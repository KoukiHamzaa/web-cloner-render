'use strict';

var fs = require('fs');
var path = require('path');
var l = require('./links');
var robots = require('./robots');

/**
 * Adaptive mirror engine.
 *
 * A growing number of sites answer wget's plain client with a 403, a
 * robots.txt exclusion or a TLS refusal even though the same content is
 * available to a browser. This engine retries a capture the way a browser
 * would: realistic request headers, bounded concurrency, a throttle that
 * backs off when a host starts answering 429/403, and the same quotas and
 * timeouts as the primary path. It writes the same job-directory layout and
 * emits the same progress shape, so everything downstream (archiver, socket)
 * is unchanged.
 *
 * Only http(s) URLs that stay on the target host (or its subdomains) are ever
 * fetched, and every URL is checked against robots.txt before it is opened.
 */

function sleep(ms) {
  return new Promise(function (resolve) { setTimeout(resolve, ms); });
}

function contentTypeOf(res) {
  var value = (res.headers.get('content-type') || '').toLowerCase();
  if (value.indexOf('text/html') !== -1) return 'html';
  if (value.indexOf('text/css') !== -1 || value.indexOf('stylesheet') !== -1) return 'css';
  return 'blob';
}

function browserHeaders(options) {
  return {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Referer': options.referer || options.url,
    'Sec-Ch-Ua': '"Chromium";v="124", "Google Chrome";v="124", "Not.A/Brand";v="99"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"Windows"',
    'Sec-Fetch-Dest': options.dest || 'document',
    'Sec-Fetch-Mode': options.mode || 'navigate',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
  };
}

/**
 * Read a response body fully, stopping once it would push the job past its
 * quota. Returns { buffer, truncated } so callers can decide what to keep.
 */
async function readBody(response, quotaLeft, type) {
  var chunks = [];
  var total = 0;
  var truncated = false;
  for await (const chunk of response.body) {
    chunks.push(chunk);
    total += chunk.length;
    if (quotaLeft != null && total > quotaLeft) {
      truncated = true;
      break;
    }
  }
  return { buffer: Buffer.concat(chunks, total), truncated: truncated };
}

function guardInside(root, absolute) {
  var resolved = path.resolve(absolute);
  var base = path.resolve(root);
  if (resolved !== base && resolved.slice(0, base.length + 1) !== base + path.sep) {
    throw new Error('refusing to write outside the job directory');
  }
  return resolved;
}

module.exports = function crawl(options, status, done) {
  var target = options.target;
  var jobDir = options.jobDir;
  var quotaBytes = options.quotaBytes != null ? options.quotaBytes : Infinity;
  var timeoutMs = options.timeoutMs || 5 * 60 * 1000;
  var requestTimeoutMs = options.requestTimeoutMs || 30 * 1000;
  var concurrency = options.concurrency || 6;
  var respectRobots = options.respectRobots !== false;
  var maxPages = options.maxPages || 200;
  var maxDepth = options.maxDepth || 18;

  var hostDir = path.join(jobDir, l.sanitizeHost(target.hostname));
  fs.mkdirSync(hostDir, { recursive: true });

  var emit = function (text) {
    status({ progress: text });
  };

  var robotsRules = null;
  var queue = [];
  var visited = {};
  var saved = {};
  var inflight = 0;
  var totalBytes = 0;
  var pageCount = 0;
  var finished = false;
  var quotaHit = false;
  var deadline = Date.now() + timeoutMs;
  var started = Date.now();
  var summaryTimer = null;

  function markDone(error) {
    if (finished) return;
    finished = true;
    if (summaryTimer) clearInterval(summaryTimer);
    done({
      error: error || null,
      timedOut: !error && Date.now() >= deadline,
      quotaHit: quotaHit,
      files: Object.keys(saved).length,
      pages: pageCount,
      bytes: totalBytes
    });
  }

  function elapsed() {
    return Math.round((Date.now() - started) / 1000);
  }

  function maybeFinish() {
    if (finished) return;
    if (inflight === 0 && queue.length === 0) {
      markDone(null);
      return;
    }
    if (Date.now() >= deadline && inflight === 0 && queue.length === 0) {
      markDone(null);
    }
  }

  function enqueue(url, depth, referer) {
    if (finished || quotaHit) return;
    if (depth > maxDepth) return;
    var key = url.href;
    if (visited[key]) return;
    visited[key] = true;
    queue.push({ url: url, depth: depth, referer: referer });
    pump();
  }

  function bucketText(label) {
    var mb = (totalBytes / (1024 * 1024)).toFixed(1);
    return 'Summary: ' + Object.keys(saved).length + ' files · ' + mb + ' MB · ' + pageCount + ' pages · ' + elapsed() + 's — ' + label;
  }

  async function fetchWithBackoff(url, headers) {
    var lastRes = null;
    for (var attempt = 0; attempt <= 2; attempt++) {
      if (attempt > 0) {
        var waitMs = 700 * attempt;
        emit('Blocked by ' + url.hostname + '; backing off ' + waitMs + ' ms before retry ' + (attempt) + '/2');
        await sleep(waitMs);
      }
      if (finished) return null;
      var controller = new AbortController();
      var timer = setTimeout(function () { controller.abort(); }, requestTimeoutMs);
      try {
        lastRes = await fetch(url.href, { headers: headers, signal: controller.signal, redirect: 'follow' });
      } catch (err) {
        lastRes = null;
      } finally {
        clearTimeout(timer);
      }
      if (lastRes && (lastRes.status === 429 || (lastRes.status === 403 && attempt < 2))) {
        try { if (lastRes.body) await lastRes.body.cancel(); } catch (err) { /* best effort */ }
        continue;
      }
      break;
    }
    return lastRes;
  }

  async function handleResponse(url, res, depth) {
    if (!res) {
      emit('No response from ' + url.href);
      return;
    }
    if (res.status === 403 || res.status === 429) {
      emit('Rejected ' + res.status + ' while fetching ' + url.href + ' — page skipped');
      if (res.body) { try { await res.body.cancel(); } catch (err) { /* ignore */ } }
      return;
    }
    if (res.status === 404 || res.status === 410) {
      emit('Ignoring ' + res.status + ' ' + url.href);
      if (res.body) { try { await res.body.cancel(); } catch (err) { /* ignore */ } }
      return;
    }
    if (res.status < 200 || res.status >= 300) {
      emit('Skipped ' + url.href + ' (HTTP ' + res.status + ')');
      if (res.body) { try { await res.body.cancel(); } catch (err) { /* ignore */ } }
      return;
    }

    var local = l.urlToLocalPath(url);
    if (!local) {
      if (res.body) { try { await res.body.cancel(); } catch (err) { /* ignore */ } }
      return;
    }
    var type = contentTypeOf(res);

    if (type !== 'html') {
      if (saved[local.rel]) {
        if (res.body) { try { await res.body.cancel(); } catch (err) { /* ignore */ } }
        return;
      }
      if (quotaHit) return;
    }
    var quotaLeft = quotaBytes - totalBytes;
    var outPath;
    try {
      outPath = guardInside(jobDir, path.join(jobDir, local.rel));
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
    } catch (err) {
      emit('Could not prepare ' + local.rel + ': ' + err.message);
      if (res.body) { try { await res.body.cancel(); } catch (err) { /* ignore */ } }
      return;
    }

    try {
      if (type === 'html') {
        var pageData = await readBody(res, quotaLeft, 'html');
        var rewritten = l.rewriteHtml(pageData.buffer.toString('utf8'), url, target.hostname);
        fs.writeFileSync(outPath, rewritten);
        totalBytes += Buffer.byteLength(rewritten);
        saved[local.rel] = true;
        pageCount++;
        emit('Saving to: \'' + local.rel + '\'  [' + Buffer.byteLength(rewritten) + ' bytes] 200 OK');

        var refs = l.collectHtmlUrls(rewritten, url, target.hostname);
        for (var i = 0; i < refs.length; i++) {
          var refUrl = new URL(refs[i]);
          if (refUrl.href === url.href) continue;
          if (respectRobots && robotsRules && !robots.isPathAllowed(refUrl.pathname, robotsRules)) {
            emit('Robots.txt: skipping ' + refUrl.href);
            continue;
          }
          if (l.looksLikePage(refUrl)) {
            if (pageCount < maxPages) enqueue(refUrl, depth + 1, url.href);
          } else {
            enqueue(refUrl, depth + 1, url.href);
          }
        }
      } else if (type === 'css') {
        if (saved[local.rel]) {
          if (res.body) { try { await res.body.cancel(); } catch (err) { /* ignore */ } }
          return;
        }
        var cssData = await readBody(res, quotaLeft, 'css');
        var cssText = cssData.buffer.toString('utf8');
        var cssRewritten = l.rewriteCss(cssText, url, target.hostname);
        fs.writeFileSync(outPath, cssRewritten);
        totalBytes += Buffer.byteLength(cssRewritten);
        saved[local.rel] = true;
        emit('Saving to: \'' + local.rel + '\'  [' + Buffer.byteLength(cssRewritten) + ' bytes] 200 OK');

        var cssRefs = l.collectHtmlUrls(cssText, url, target.hostname);
        for (var c = 0; c < cssRefs.length; c++) {
          var cssRefUrl = new URL(cssRefs[c]);
          if (cssRefUrl.href === url.href) continue;
          enqueue(cssRefUrl, depth + 1, url.href);
        }
      } else {
        if (saved[local.rel]) {
          if (res.body) { try { await res.body.cancel(); } catch (err) { /* ignore */ } }
          return;
        }
        var fileStream = fs.createWriteStream(outPath);
        var bytes = 0;
        for await (const chunk of res.body) {
          if (!fileStream.write(chunk)) {
            await new Promise(function (resolve) { fileStream.once('drain', resolve); });
          }
          bytes += chunk.length;
          totalBytes += chunk.length;
          if (quotaBytes !== Infinity && totalBytes >= quotaBytes) {
            quotaHit = true;
            break;
          }
        }
        fileStream.end();
        if (quotaHit && res.body) { try { await res.body.cancel(); } catch (err2) { /* ignore */ } }
        saved[local.rel] = true;
        emit('Saving to: \'' + local.rel + '\'  [' + bytes + ' bytes] 200 OK');
      }

      if (quotaHit) {
        emit(bucketText('quota reached — capture stopped here. Download the archive and narrow the URL for more.'));
      }
    } catch (err) {
      emit('Could not store ' + url.href + ': ' + err.message);
      try { if (res.body) await res.body.cancel(); } catch (err2) { /* ignore */ }
    }
  }

  function pump() {
    if (finished) return;
    while (inflight < concurrency && queue.length) {
      var item = queue.shift();
      inflight++;
      processItem(item);
    }
  }

  async function processItem(item) {
    var headers = browserHeaders({ url: item.url.href, referer: item.referer || item.url.href });
    try {
      if (respectRobots && robotsRules && !robots.isPathAllowed(item.url.pathname, robotsRules)) {
        emit('Robots.txt: skipping ' + item.url.href);
        return;
      }
      if (Date.now() >= deadline) {
        emit('Approaching the download timeout — capture stopped.');
        return;
      }
      var res = await fetchWithBackoff(item.url, headers);
      await handleResponse(item.url, res);
    } catch (err) {
      emit('Failed ' + item.url.href + ': ' + err.message);
    } finally {
      inflight--;
      pump();
      maybeFinish();
    }
  }

  function seed() {
    enqueue(target, 0, target.href);
    summaryTimer = setInterval(function () {
      if (finished) return;
      emit(bucketText('capture in progress'));
    }, 4000);
  }

  var loadRobots = function (next) {
    if (!respectRobots) return next();
    var origin = target.origin;
    var robotsUrl = new URL('/robots.txt', origin);
    fetchWithBackoff(robotsUrl, browserHeaders({ url: robotsUrl.href, dest: 'document' }))
      .then(function (res) {
        if (!res || res.status !== 200) return next();
        return readBody(res, 256 * 1024, 'html').then(function (data) {
          robotsRules = robots.parseRobots(data.buffer.toString('utf8'));
          next();
        });
      })
      .catch(function () { next(); });
  };

  loadRobots(function () {
    seed();
  });

  return {
    cancel: function () {
      if (!finished) markDone({ error: 'The capture was cancelled.' });
    }
  };
};