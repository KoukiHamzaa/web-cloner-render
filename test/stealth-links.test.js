const assert = require('assert');
const l = require('../stealth/links');
const robots = require('../stealth/robots');

const page = new URL('https://shop.example.com/pages/detail');
const POSTER_IMG = 'https://shop.example.com/images/poster.png';

let checks = 0;
const verify = (cond, label) => {
  assert.strictEqual(cond, true, label);
  checks += 1;
};

// --- isHttpUrl / resolveReference ------------------------------------------
verify(l.isHttpUrl(page) === true, 'http(s) URL accepted');
verify(l.isHttpUrl(new URL('ftp://x.test/a')) === false, 'ftp URL rejected');
verify(l.isHttpUrl(new URL('file:///etc/passwd')) === false, 'file URL rejected');

const dataUrl = l.resolveReference(page, 'data:image/svg+xml;base64,AA==');
verify(dataUrl === null, 'data: reference skipped');
const scriptUrl = l.resolveReference(page, 'javascript:void(0)');
verify(scriptUrl === null, 'javascript: reference skipped');
const relative = l.resolveReference(page, '../css/app.css');
verify(relative && relative.href === 'https://shop.example.com/css/app.css', 'relative reference resolved');
const absolute = l.resolveReference(page, 'https://shop.example.com/app.js');
verify(absolute && absolute.href === 'https://shop.example.com/app.js', 'absolute reference resolved');
const schemeRelative = l.resolveReference(page, '//cdn.shop.example.com/img.png');
verify(schemeRelative && schemeRelative.href === 'https://cdn.shop.example.com/img.png', 'scheme-relative reference resolved');

// --- isHostAllowed ----------------------------------------------------------
verify(l.isHostAllowed('shop.example.com', 'shop.example.com') === true, 'same host allowed');
verify(l.isHostAllowed('WWW.Example.COM', 'example.com') === true, 'case/active-www pairing allowed');
verify(l.isHostAllowed('cdn.shop.example.com', 'shop.example.com') === true, 'subdomain allowed');
verify(l.isHostAllowed('images.shop.example.com', 'shop.example.com') === true, 'deep subdomain allowed');
verify(l.isHostAllowed('shop.example.org', 'shop.example.com') === false, 'sibling TLD rejected');
verify(l.isHostAllowed('example.com.evil.test', 'example.com') === false, 'decoy suffix rejected');
verify(l.isHostAllowed('google.com', 'near-google.com') === false, 'unrelated host rejected');

// --- urlToLocalPath ---------------------------------------------------------
verify(l.urlToLocalPath(new URL('https://example.com/')).rel === 'example.com/index.html', 'root maps to index.html');
verify(l.urlToLocalPath(new URL('https://example.com/about')).rel === 'example.com/about', 'path kept');
verify(l.urlToLocalPath(new URL('https://example.com/docs/')).rel === 'example.com/docs/index.html', 'dir maps to folder index');
verify(l.urlToLocalPath(new URL('https://example.com/img/a%20b.png')).rel === 'example.com/img/a b.png', 'percent-decoding applied');
verify(l.urlToLocalPath(new URL('https://example.com/a/../../etc/passwd')).rel === 'example.com/etc/passwd', 'dot segments normalized by URL parser');

const traversal = new URL('https://example.com/');
Object.defineProperty(traversal, 'pathname', { value: '/../etc/passwd', enumerable: true });
verify(l.urlToLocalPath(traversal) === null, 'literal dot-dot rejected');
verify(l.urlToLocalPath(new URL('https://example.com/..%2f..%2fetc')) === null, 'encoded traversal rejected');

// --- relativeLink -----------------------------------------------------------
verify(l.relativeLink('example.com/pages/detail', 'example.com/pages/detail') === 'detail', 'same-page asset is filename');
verify(l.relativeLink('example.com/pages/detail', 'example.com/images/poster.png') === '../images/poster.png', 'sibling folder relative');
verify(l.relativeLink('example.com/pages/detail', 'example.com/assets/img/a.png') === '../assets/img/a.png', 'deeper relative path');
verify(l.relativeLink('example.com/index.html', 'example.com/other/page.html') === 'other/page.html', 'root to nested page');

// --- rewriteHtml ------------------------------------------------------------
verify(l.rewriteHtml('', page, 'shop.example.com') === '', 'empty html untouched');
verify(l.rewriteHtml('plain text no tags', page, 'shop.example.com') === 'plain text no tags', 'plain text untouched');
const rewritten = l.rewriteHtml(`<img src="/images/poster.png"><a href="https://shop.example.com/pages/detail">detail</a>`, page, 'shop.example.com');
verify(rewritten.includes('../images/poster.png'), 'absolute src rewritten to relative local path');
verify(rewritten.includes('href="detail"'), 'internal link rewritten relative');
verify(!rewritten.includes('src="/images/poster.png"'), 'absolute src attribute no longer present');
const lazy = l.rewriteHtml(`<img data-src="/images/lazy.png">`, page, 'shop.example.com');
verify(lazy.includes('data-src="../images/lazy.png"'), 'data-src rewritten');
const external = l.rewriteHtml(`<img src="https://other-site.com/logo.png">`, page, 'shop.example.com');
verify(external.includes('https://other-site.com/logo.png'), 'external host untouched');

// --- rewriteSrcset ----------------------------------------------------------
const srcset = l.rewriteSrcset(`srcset="/images/a.png 1x, https://cdn.shop.example.com/b.png 2x"`, page, 'shop.example.com');
verify(srcset.includes('srcset="../images/a.png 1x, ../../cdn.shop.example.com/b.png 2x"'), 'srcset candidates rewritten to local paths');

// --- rewriteCss -------------------------------------------------------------
const cssFixed = l.rewriteCss(`.a{background:url("/img/bg.png")}`, page, 'shop.example.com');
verify(cssFixed.includes('url("../img/bg.png")'), 'css url rewritten');
const cssData = l.rewriteCss(`.a{background:url("data:image/png;base64,xx")}`, page, 'shop.example.com');
verify(cssData.includes('data:image/png;base64,xx'), 'css data url untouched');
const cssFrag = l.rewriteCss(`.a{background:url("#grad")}`, page, 'shop.example.com');
verify(cssFrag.includes('#grad'), 'css fragment untouched');

// --- collectHtmlUrls --------------------------------------------------------
const urls = l.collectHtmlUrls(
  `<a href="/pages/a">a</a><img src="/img/x.png" srcset="/img/y.png 2x"><link rel="stylesheet" href="https://other-site.com/x.css">`,
  page,
  'shop.example.com'
);
verify(urls.includes('https://shop.example.com/pages/a'), 'page link collected');
verify(urls.includes('https://shop.example.com/img/x.png'), 'img collected');
verify(urls.includes('https://shop.example.com/img/y.png'), 'srcset candidate collected');
verify(urls.length === 3, 'external host excluded from collected urls');

// --- looksLikePage ----------------------------------------------------------
verify(l.looksLikePage(new URL('https://example.com/')) === true, 'root is a page');
verify(l.looksLikePage(new URL('https://example.com/about')) === true, 'extensionless path is a page');
verify(l.looksLikePage(new URL('https://example.com/contact/index.html')) === true, 'index.html is a page');
verify(l.looksLikePage(new URL('https://example.com/img/logo.png')) === false, 'png not a page');
verify(l.looksLikePage(new URL('https://example.com/assets/app.js')) === false, 'js not a page');

// --- robots.txt ---------------------------------------------------------------
const groups = robots.parseRobots([
  'User-agent: *',
  'Disallow: /private/',
  'Disallow: /admin$',
  'Disallow: /search?*',
  '',
  'User-agent: BadBot',
  'Disallow: /',
  '',
  'User-agent: GoodBot',
  'Disallow: /secret'
].join('\n'));
verify(robots.isPathAllowed('/public/page', groups) === true, 'non-disallowed path allowed');
verify(robots.isPathAllowed('/private/file', groups) === false, 'folder disallow applied');
verify(robots.isPathAllowed('/admin/file', groups) === true, 'trailing $ anchors admin rule');
verify(robots.isPathAllowed('/admin', groups) === false, 'anchored admin rule blocks exact path');
verify(robots.isPathAllowed('/search', groups) === true, 'wildcard rule does not match bare path');
verify(robots.isPathAllowed('/search?q=1', groups) === false, 'wildcard rule matches query path');
verify(robots.isPathAllowed('/x', robots.parseRobots('garbage input: no rules')) === true, 'unparseable robots allows all');
verify(robots.isPathAllowed('/x', []) === true, 'empty groups allow all');

console.log(`Stealth tests passed: ${checks} assertions across links and robots helpers.`);