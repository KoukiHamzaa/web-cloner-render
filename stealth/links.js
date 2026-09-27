'use strict';

/**
 * Pure URL/link helpers for the adaptive (stealth) mirror engine. Every
 * function here is side-effect free so it can be exercised offline in tests.
 *
 * The engine inspects a page the way a real browser would: it follows the
 * links a browser would load and rewrites resource URLs to relative local
 * paths so the archive works offline, the same way wget's --page-requisites
 * and --convert-links do for the primary path.
 */

var SCHEME_SKIP_RE = /^(?:data|javascript|about|blob|mailto|tel|vbscript):/i;

/**
 * True when url is a usable http(s) URL with a hostname. Everything else
 * (ftp:, file:, data:, javascript:...) is rejected before it can reach fetch.
 */
function isHttpUrl(url) {
  if (!(url instanceof URL)) return false;
  return (url.protocol === 'http:' || url.protocol === 'https:') && !!url.hostname;
}

/**
 * Captures stay on the site the user asked for. A resource is allowed when
 * it is the target host, the bare version of it (www. pairing), or a
 * subdomain of it. Keeping the list this tight avoids turning the engine
 * into a wildcard fetcher while still collecting assets served from a CDN
 * subdomain that belongs to the site.
 */
function isHostAllowed(hostname, targetHostname) {
  if (!hostname || !targetHostname) return false;
  var host = String(hostname).toLowerCase();
  var target = String(targetHostname).toLowerCase();
  if (host === target) return true;
  if (host === 'www.' + target || target === 'www.' + host) return true;
  return host.slice(-(target.length + 1)) === '.' + target ||
         target.slice(-(host.length + 1)) === '.' + host;
}

/**
 * Resolve a possibly-relative reference against a base URL. Returns an
 * absolute URL object when usable, otherwise null.
 */
function resolveReference(baseUrl, value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  var candidate = value.trim();
  if (SCHEME_SKIP_RE.test(candidate)) return null;
  try {
    var url = new URL(candidate, baseUrl);
    return isHttpUrl(url) ? url : null;
  } catch (err) {
    return null;
  }
}

function sanitizeHost(hostname) {
  return String(hostname).toLowerCase()
    .replace(/[^a-z0-9.-]/g, '_')
    .replace(/^\.+|\.+$/g, '');
}

/**
 * Map an absolute URL to a deterministic local path below the job directory.
 * The hostname becomes the top-level folder, the URL path is mirrored below
 * it, and directory-style URLs land on their folder's index.html. Path
 * traversal (..) and a second separator escape are rejected so a hostile URL
 * cannot write outside the job directory.
 */
function urlToLocalPath(url) {
  if (!isHttpUrl(url)) return null;
  var host = sanitizeHost(url.hostname);
  var rawPath = url.pathname || '/';
  var rawSegments = rawPath.split('/');
  var segments = [];
  for (var i = 0; i < rawSegments.length; i++) {
    if (!rawSegments[i]) continue;
    var decoded;
    try {
      decoded = decodeURIComponent(rawSegments[i]);
    } catch (err) {
      decoded = rawSegments[i];
    }
    if (decoded === '..' || /(^|[\/\\])\.\.([\/\\]|$)/.test(decoded) || decoded.indexOf('\u0000') !== -1) return null;
    if (decoded === '.' || !decoded) continue;
    segments.push(decoded.replace(/[\/\\]/g, '_'));
  }
  var isDirectory = rawPath.slice(-1) === '/';
  if (segments.length === 0) {
    return { rel: host + '/index.html' };
  }
  if (isDirectory) {
    return { rel: host + '/' + segments.join('/') + '/index.html' };
  }
  return { rel: host + '/' + segments.join('/') };
}

/**
 * Relative filesystem link from the page's local file to the asset's local
 * file, so rewritten references survive moving the whole folder around.
 */
function relativeLink(fromRel, toRel) {
  var fromDir = fromRel.split('/').slice(0, -1);
  var toParts = toRel.split('/');
  while (fromDir.length && toParts.length && fromDir[0] === toParts[0]) {
    fromDir.shift();
    toParts.shift();
  }
  var result = fromDir.map(function () { return '..'; }).concat(toParts);
  return result.join('/') || '.';
}

var ATTR_RE = /\b(href|src|poster|data-src)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/gi;

/**
 * Rewrite atomic URL attributes (href, src, poster, data-src) to relative
 * local paths when the reference lives on an allowed host. References that
 * cannot be resolved or stay allowed are left untouched.
 */
function rewriteHtml(html, pageUrl, targetHostname) {
  var page = urlToLocalPath(pageUrl);
  if (!page) return String(html);
  return String(html).replace(ATTR_RE, function (match, attr, quotedDouble, quotedSingle, bare) {
    var value = quotedDouble != null ? quotedDouble : (quotedSingle != null ? quotedSingle : bare);
    var resolved = resolveReference(pageUrl, value);
    if (!resolved || !isHostAllowed(resolved.hostname, targetHostname)) return match;
    var asset = urlToLocalPath(resolved);
    if (!asset) return match;
    return attr + '="' + relativeLink(page.rel, asset.rel) + '"';
  });
}

var SRCSET_RE = /(srcset)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/gi;

function rewriteSrcset(srcset, pageUrl, targetHostname) {
  var page = urlToLocalPath(pageUrl);
  if (!page) return srcset;
  return String(srcset).replace(SRCSET_RE, function (match, attr, quotedDouble, quotedSingle, bare) {
    var value = quotedDouble != null ? quotedDouble : (quotedSingle != null ? quotedSingle : bare);
    var candidates = value.split(',').map(function (candidate) {
      var parts = candidate.trim().split(/\s+/);
      if (!parts.length || !parts[0]) return candidate;
      var first = parts[0];
      var resolved = resolveReference(pageUrl, first);
      if (!resolved || !isHostAllowed(resolved.hostname, targetHostname)) return candidate;
      var asset = urlToLocalPath(resolved);
      if (!asset) return candidate;
      return [relativeLink(page.rel, asset.rel)].concat(parts.slice(1)).join(' ');
    });
    return attr + '="' + candidates.join(', ') + '"';
  });
}

var CSS_URL_RE = /url\(\s*(?:"([^"]*)"|'([^']*)'|([^)'"\s]*))\s*\)/gi;

/**
 * Rewrite url(...) references in stylesheets to relative local paths, again
 * only for references that resolve back to the allowed site.
 */
function rewriteCss(css, pageUrl, targetHostname) {
  var page = urlToLocalPath(pageUrl);
  if (!page) return String(css);
  return String(css).replace(CSS_URL_RE, function (match, quotedDouble, quotedSingle, bare) {
    var value = quotedDouble != null ? quotedDouble : (quotedSingle != null ? quotedSingle : bare);
    if (!value || SCHEME_SKIP_RE.test(value.trim()) || value.trim().indexOf('#') === 0) return match;
    var resolved = resolveReference(pageUrl, value);
    if (!resolved || !isHostAllowed(resolved.hostname, targetHostname)) return match;
    var asset = urlToLocalPath(resolved);
    if (!asset) return match;
    return 'url("' + relativeLink(page.rel, asset.rel) + '")';
  });
}

/**
 * Collect every absolute http(s) URL referenced from an HTML page, so the
 * crawler can recursively fetch pages and requisites. References to other
 * hosts are dropped by the same allow-list used for rewriting.
 */
function collectHtmlUrls(html, pageUrl, targetHostname) {
  var found = {};
  var remember = function (value) {
    var resolved = resolveReference(pageUrl, value);
    if (!resolved || !isHostAllowed(resolved.hostname, targetHostname)) return;
    found[resolved.href] = true;
  };

  String(html).replace(ATTR_RE, function (match, attr, quotedDouble, quotedSingle, bare) {
    var value = quotedDouble != null ? quotedDouble : (quotedSingle != null ? quotedSingle : bare);
    remember(value);
    return match;
  });
  String(html).replace(SRCSET_RE, function (match, attr, quotedDouble, quotedSingle, bare) {
    var value = quotedDouble != null ? quotedDouble : (quotedSingle != null ? quotedSingle : bare);
    value.split(',').forEach(function (candidate) {
      var first = candidate.trim().split(/\s+/)[0];
      if (first) remember(first);
    });
    return match;
  });
  String(html).replace(CSS_URL_RE, function (match, quotedDouble, quotedSingle, bare) {
    var value = quotedDouble != null ? quotedDouble : (quotedSingle != null ? quotedSingle : bare);
    if (value && value.trim()) remember(value);
    return match;
  });
  return Object.keys(found);
}

/**
 * Heuristic for whether an absolute URL points at a navigable page (recursed
 * into) versus a resource (fetched once). URLs without a file extension are
 * treated as routed pages, since most modern frameworks hide the extension.
 */
function looksLikePage(url) {
  if (!isHttpUrl(url)) return false;
  var pathname = (url.pathname || '/').toLowerCase();
  if (pathname.slice(-1) === '/') return true;
  var last = pathname.split('/').pop() || '';
  if (!last) return true;
  var match = last.match(/\.([a-z0-9]+)$/);
  if (!match) return true;
  return /^(?:html?|php|aspx?|jsp)$/.test(match[1]);
}

module.exports = {
  isHttpUrl: isHttpUrl,
  isHostAllowed: isHostAllowed,
  sanitizeHost: sanitizeHost,
  resolveReference: resolveReference,
  urlToLocalPath: urlToLocalPath,
  relativeLink: relativeLink,
  rewriteHtml: rewriteHtml,
  rewriteSrcset: rewriteSrcset,
  rewriteCss: rewriteCss,
  collectHtmlUrls: collectHtmlUrls,
  looksLikePage: looksLikePage
};