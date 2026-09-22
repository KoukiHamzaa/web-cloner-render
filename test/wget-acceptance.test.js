const assert = require('assert');
const wget = require('../wget');

const { parseTarget, buildCrawlDomains } = wget;

assert.strictEqual(typeof parseTarget, 'function');
assert.strictEqual(typeof buildCrawlDomains, 'function');

let cases = 0;
for (let i = 0; i < 50; i += 1) {
  const hostname = `example-${i}.test`;
  const target = parseTarget(hostname);
  assert(target, `bare hostname should parse: ${hostname}`);
  assert.strictEqual(target.protocol, 'https:');
  assert.strictEqual(target.hostname, hostname);
  assert.deepStrictEqual(buildCrawlDomains(target.hostname), [hostname, `www.${hostname}`]);
  cases += 3;
}

for (let i = 0; i < 50; i += 1) {
  const hostname = `www.example-${i}.test`;
  const target = parseTarget(`https://${hostname}/path`);
  assert(target, `www hostname should parse: ${hostname}`);
  assert.strictEqual(target.protocol, 'https:');
  assert.strictEqual(target.hostname, hostname);
  assert.deepStrictEqual(buildCrawlDomains(target.hostname), [hostname, hostname.slice(4)]);
  cases += 3;
}

const ilovepdf = parseTarget('ilovepdf.com');
assert.strictEqual(ilovepdf.href, 'https://ilovepdf.com/');
assert.deepStrictEqual(buildCrawlDomains(ilovepdf.hostname), [
  'ilovepdf.com',
  'www.ilovepdf.com'
]);

for (const invalid of ['', '   ', 'file:///etc/passwd', 'javascript:alert(1)', 'ftp://example.com']) {
  assert.strictEqual(parseTarget(invalid), null, `invalid URL accepted: ${invalid}`);
}

console.log(`Acceptance tests passed: ${cases} generated assertions plus ilovepdf and invalid-input checks.`);
