var KEEP_ALIVE_DEFAULT_INTERVAL_MS = 10 * 60 * 1000;

/**
 * Keep a Render free web service from spinning down. Render sleeps a free
 * instance after 15 minutes without inbound traffic, so while this app is
 * awake it pings its own public health endpoint (a real app route) every few
 * minutes to reset the idle timer. Only active while running on Render by
 * default.
 *
 * Env:
 *   KEEP_AWAKE              set "false" to disable on Render, "true" to force
 *                           on locally (e.g. a preview/tunnel with its own URL)
 *   KEEP_AWAKE_URL          public URL to ping; defaults to RENDER_EXTERNAL_URL
 *   KEEP_AWAKE_INTERVAL_MS  ping cadence (60000..840000); default 10 minutes
 *
 * Options (for tests/tools): { intervalMs, url } override env entirely.
 */
module.exports = function startKeepAlive(opts) {
  opts = opts || {};
  var onRender = !!(process.env.RENDER_EXTERNAL_URL || process.env.RENDER_INSTANCE_ID);
  if (process.env.KEEP_AWAKE === 'false' && !opts.url) return null;
  if (!onRender && process.env.KEEP_AWAKE !== 'true' && !opts.url) return null;

  var url = opts.url || process.env.KEEP_AWAKE_URL || process.env.RENDER_EXTERNAL_URL;
  url = url ? String(url).replace(/\/$/, '') : null;
  if (!url) return null;

  var intervalMs = opts.intervalMs || parseInt(process.env.KEEP_AWAKE_INTERVAL_MS, 10);
  if (!opts.intervalMs && (!intervalMs || intervalMs < 60e3 || intervalMs > 14 * 60e3)) {
    intervalMs = KEEP_ALIVE_DEFAULT_INTERVAL_MS;
  }

  var ping = function() {
    var controller = new AbortController();
    var timeout = setTimeout(function() { controller.abort(); }, 10e3);
    fetch(url + '/healthz', { signal: controller.signal })
      .then(function(res) {
        clearTimeout(timeout);
        if (!res.ok) console.error('keep-alive ping failed:', res.status, url);
      })
      .catch(function(err) {
        clearTimeout(timeout);
        console.error(err.name === 'AbortError'
          ? 'keep-alive ping timed out: ' + url
          : 'keep-alive ping error: ' + err.message);
      });
  };

  ping();
  var timer = setInterval(ping, intervalMs);
  timer.unref();
  return timer;
};