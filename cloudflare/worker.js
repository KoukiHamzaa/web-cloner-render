const DEFAULT_BACKEND_URL = 'https://web-cloner-x3a3.onrender.com';

export default {
  async fetch(request, env) {
    const incomingUrl = new URL(request.url);
    const configuredBackend = env.BACKEND_URL || DEFAULT_BACKEND_URL;

    let backendUrl;
    try {
      backendUrl = new URL(configuredBackend);
    } catch (error) {
      return new Response('Invalid BACKEND_URL configuration.', { status: 500 });
    }

    if (backendUrl.protocol !== 'https:' && backendUrl.protocol !== 'http:') {
      return new Response('BACKEND_URL must use http or https.', { status: 500 });
    }

    // Preserve the full path and query string, including Socket.IO polling and
    // WebSocket upgrade requests.
    backendUrl.pathname = incomingUrl.pathname;
    backendUrl.search = incomingUrl.search;

    const headers = new Headers(request.headers);
    headers.set('X-Forwarded-Host', incomingUrl.host);
    headers.set('X-Forwarded-Proto', incomingUrl.protocol.replace(':', ''));

    const upstreamRequest = new Request(backendUrl.toString(), {
      method: request.method,
      headers,
      body: request.method === 'GET' || request.method === 'HEAD' ? undefined : request.body,
      redirect: 'manual'
    });

    const upstreamResponse = await fetch(upstreamRequest);
    const responseHeaders = new Headers(upstreamResponse.headers);

    // Keep redirects on the Cloudflare hostname rather than exposing the
    // Render origin to visitors.
    const location = responseHeaders.get('Location');
    if (location) {
      try {
        const redirectUrl = new URL(location, backendUrl);
        if (redirectUrl.origin === backendUrl.origin) {
          redirectUrl.protocol = incomingUrl.protocol;
          redirectUrl.host = incomingUrl.host;
          responseHeaders.set('Location', redirectUrl.toString());
        }
      } catch (error) {
        // Leave non-URL Location headers unchanged.
      }
    }

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: responseHeaders
    });
  }
};
