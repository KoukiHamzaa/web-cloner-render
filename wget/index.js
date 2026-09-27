var execFile = require('child_process').execFile;
var crypto = require('crypto');
var fs = require('fs');
var path = require('path');
var archive = require('../archiver');
var stealth = require('../stealth/crawler');

/**
 * Adaptive capture pipeline.
 *
 * Tier 1 is the classic wget mirror: recursive, link-converting, honorable to
 * robots.txt, and fast on cooperative sites.
 *
 * Tier 2 is the adaptive engine. Many sites now answer the plain wget client
 * with a 403, a robots.txt exclusion or a TLS refusal while happily serving a
 * normal browser. When tier 1 saves nothing, the adaptive engine automatically
 * retries the same capture the way a browser would: realistic headers, bounded
 * concurrency, a throttle that backs off on 429/403, and the same quota and
 * timeout. Both tiers write the same job-directory layout and emit the same
 * progress shape, so zipping, cleanup, and the socket UI are unchanged.
 */

var DOWNLOAD_ROOT = path.join(__dirname, '..', 'downloads');

// wget mirrors recursively, so without a ceiling a single request can fill the
// disk. Both limits can be raised through the environment.
var QUOTA = process.env.DOWNLOAD_QUOTA || '100m';
var TIMEOUT_MS = Number(process.env.DOWNLOAD_TIMEOUT_MS) || 5 * 60 * 1000;

// Adaptive engine tuning. All stealthed only when enabled; the default keeps
// the rescue behaviour on so blocked sites still end up downloadable.
var STEALTH_ENABLED = process.env.STEALTH_ENABLED !== 'false';
var STEALTH_CONCURRENCY = Number(process.env.STEALTH_CONCURRENCY) || 6;
var STEALTH_MAX_PAGES = Number(process.env.STEALTH_MAX_PAGES) || 200;
var STEALTH_REQUEST_TIMEOUT_MS = Number(process.env.STEALTH_REQUEST_TIMEOUT_MS) || 30 * 1000;
var STEALTH_RESPECT_ROBOTS = process.env.STEALTH_RESPECT_ROBOTS !== 'false';

/**
 * wget --mirror --convert-links --adjust-extension --page-requisites
 * --no-parent http://example.org
 * --mirror – Makes (among other things) the download recursive.
 * --convert-links – convert all the links (also to stuff like CSS stylesheets) to relative, so it will be suitable for offline viewing.
 * --adjust-extension – Adds suitable extensions to filenames (html or css) depending on their content-type.
 * --page-requisites – Download things like CSS style-sheets and images required to properly display the page offline.
 * --no-parent – When recurring do not ascend to the parent directory. It useful for restricting the download to only a portion of the site.
 */
module.exports = (socket, data, onFinished) => {
  var done = typeof onFinished === 'function' ? onFinished : function () {};
  var send = (payload) => socket.emit(data.token, payload);

  var target = parseTarget(data.website);
  if (!target) {
    send({ error: 'That does not look like a website address. Try something like https://example.com' });
    done();
    return null;
  }

  var jobId = crypto.randomBytes(8).toString('hex');
  var jobDir = path.join(DOWNLOAD_ROOT, jobId);
  try {
    fs.mkdirSync(jobDir, { recursive: true });
  } catch (err) {
    send({ error: 'Could not create a working directory on the server: ' + err.message });
    done();
    return null;
  }

  var settled = false;
  var cancelled = false;
  var timedOut = false;
  var stderrTail = [];
  var fallbackHandle = null;

  var fail = (message) => {
    if (settled) return;
    settled = true;
    clearTimeout(timer);
    removeJobDir(jobDir);
    send({ error: message });
    done();
  };

  var finalize = () => {
    if (settled) return;
    settled = true;
    clearTimeout(timer);
    send({ progress: 'Converting' });

    var zipName = target.hostname.replace(/[^a-zA-Z0-9._-]/g, '_') + '-' + jobId;
    archive(jobDir, zipName, (err, name) => {
      removeJobDir(jobDir);
      if (err) {
        send({ error: 'The site downloaded but could not be compressed: ' + err.message });
      } else {
        send({ progress: 'Completed', file: name });
      }
      done();
    });
  };

  var timer = setTimeout(() => {
    timedOut = true;
    if (fallbackHandle) fallbackHandle.cancel();
    fail('The download took longer than ' + Math.round(TIMEOUT_MS / 1000) +
         ' seconds and was stopped. Try a smaller site or a specific page.');
  }, TIMEOUT_MS);

  // execFile rather than exec: the address is passed as a separate argument and
  // never reaches a shell, so it cannot be used to run other commands.
  var crawlDomains = buildCrawlDomains(target.hostname);

  var child = execFile('wget', [
    '-mkEpnp',
    '--no-if-modified-since',
    '--quota=' + QUOTA,
    '--span-hosts',
    '--domains=' + crawlDomains.join(','),
    target.href
  ], { cwd: jobDir, maxBuffer: 32 * 1024 * 1024 });

  // Fires when wget itself cannot be started, which on a fresh machine almost
  // always means it is not installed.
  child.on('error', (err) => {
    if (err.code === 'ENOENT') {
      fail('wget is not installed on the server. Install it and restart the app: ' +
           'apt install wget, brew install wget, or winget install JernejSimoncic.Wget');
      return;
    }
    fail('Could not start the download: ' + err.message);
  });

  child.stderr.on('data', (chunk) => {
    var text = chunk.toString();
    stderrTail = stderrTail.concat(text.split('\n')).slice(-60);
    send({ progress: text });
  });

  child.on('close', (code) => {
    if (settled) return;
    clearTimeout(timer);

    if (timedOut) return;
    if (cancelled) {
      settled = true;
      removeJobDir(jobDir);
      done();
      return;
    }

    // Trust the filesystem rather than wget's output. wget writes nothing at
    // all for an off-site redirect, a robots.txt exclusion or a 403. When
    // nothing landed, hand the job to the adaptive engine before giving up.
    if (countFiles(jobDir) === 0) {
      if (STEALTH_ENABLED) {
        runAdaptiveFallback();
      } else {
        fail('Nothing could be downloaded from ' + target.hostname + '. ' +
             explainFailure(stderrTail, code));
      }
      return;
    }

    finalize();
  });

  function runAdaptiveFallback() {
    send({ progress: 'This site is blocking plain requests. Switching to the adaptive engine…\n' });
    timer = setTimeout(() => {
      timedOut = true;
      fallbackHandle.cancel();
      fail('Neither the standard nor the adaptive engine finished within ' +
           Math.round(TIMEOUT_MS / 1000) + ' seconds. Try a smaller site or a specific page.');
    }, TIMEOUT_MS);

    fallbackHandle = stealth({
      target: target,
      jobDir: jobDir,
      quotaBytes: parseSize(QUOTA) || Infinity,
      timeoutMs: TIMEOUT_MS,
      requestTimeoutMs: STEALTH_REQUEST_TIMEOUT_MS,
      concurrency: STEALTH_CONCURRENCY,
      respectRobots: STEALTH_RESPECT_ROBOTS,
      maxPages: STEALTH_MAX_PAGES
    }, function (payload) {
      if (!settled) send(payload);
    }, function (result) {
      if (settled) return;
      clearTimeout(timer);
      if (result && result.error) {
        fail(result.error);
        return;
      }
      if (countFiles(jobDir) === 0) {
        fail('Nothing could be downloaded from ' + target.hostname +
             ' even after retrying with the adaptive engine.');
        return;
      }
      finalize();
    });
  }

  return {
    cancel: function () {
      cancelled = true;
      if (fallbackHandle) fallbackHandle.cancel();
      child.kill();
    }
  };
};

/**
 * Accepts what the user typed and returns a URL only if it is a real http(s)
 * address. Anything else is rejected before it reaches wget.
 */
function parseTarget(input) {
  if (typeof input !== 'string' || !input.trim()) return null;
  var raw = input.trim();
  var url;
  try {
    // Prefer HTTPS when no scheme was given. This avoids an HTTP-to-HTTPS
    // redirect leaving wget with only the initial HTML document on sites that
    // serve their assets from the secure canonical URL. Prefixing a value
    // that already has one turns file:///etc/passwd into a request for a host
    // called "file" instead of rejecting it.
    url = new URL(/^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : 'https://' + raw);
  } catch (err) {
    return null;
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
  if (!url.hostname) return null;
  return url;
}

function buildCrawlDomains(hostname) {
  var domains = [hostname];
  if (hostname.indexOf('www.') === 0) {
    domains.push(hostname.slice(4));
  } else {
    domains.push('www.' + hostname);
  }
  return domains;
}

/**
 * "100m", "2g", "512K" and plain numbers all become a byte count.
 */
function parseSize(value) {
  if (typeof value !== 'string') value = String(value == null ? '' : value);
  var match = value.trim().match(/^(\d+)\s*([kKmMgGtT]?)$/);
  if (!match) return null;
  var unit = (match[2] || '').toLowerCase();
  var multiplier = { '': 1, k: 1024, m: 1024 * 1024, g: 1024 * 1024 * 1024, t: 1024 * 1024 * 1024 * 1024 };
  return Number(match[1]) * multiplier[unit];
}

module.exports.parseTarget = parseTarget;
module.exports.buildCrawlDomains = buildCrawlDomains;
module.exports.parseSize = parseSize;

/**
 * wget's closing lines are usually a summary, so the last line is rarely the
 * reason anything failed. Prefer the last line that actually looks like one.
 */
function explainFailure(lines, exitCode) {
  var interesting = /failed|unable|refused|denied|ERROR \d|error \d|robots|No such|not found|forbidden|timed out|giving up|Unsupported scheme/i;
  for (var i = lines.length - 1; i >= 0; i--) {
    var line = lines[i].trim();
    if (line && interesting.test(line)) return line;
  }
  if (exitCode === 8) return 'The server refused the request (it may block automated downloads).';
  return 'wget exited with code ' + exitCode + ' without saving any files.';
}

function countFiles(directory) {
  var total = 0;
  var entries;
  try {
    entries = fs.readdirSync(directory, { withFileTypes: true });
  } catch (err) {
    return 0;
  }
  for (var i = 0; i < entries.length; i++) {
    if (entries[i].isDirectory()) {
      total += countFiles(path.join(directory, entries[i].name));
    } else {
      total++;
    }
  }
  return total;
}

/**
 * Deletes a single job directory. The guard matters: the previous version
 * joined an empty string onto the app root and recursively deleted the whole
 * application whenever the hostname had not been captured yet.
 */
function removeJobDir(directory) {
  var resolved = path.resolve(directory);
  var root = path.resolve(DOWNLOAD_ROOT);
  if (resolved === root || !resolved.startsWith(root + path.sep)) {
    console.error('Refusing to delete a path outside the downloads folder: ' + resolved);
    return;
  }
  fs.rm(resolved, { recursive: true, force: true }, (err) => {
    if (err) console.error('Could not clean up ' + resolved + ': ' + err.message);
  });
}