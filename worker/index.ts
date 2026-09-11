interface Assets {
  fetch(request: Request): Promise<Response>;
}

/** Typograph owns its dedicated domains. The backup preserves path and query. */
export default {
  async fetch(request: Request, env: { ASSETS: Assets }): Promise<Response> {
    const url = new URL(request.url);
    if (url.hostname === 'typograph.ing') {
      url.hostname = 'typograph.dev';
      url.protocol = 'https:';
      url.port = '';
      return Response.redirect(url.toString(), 308);
    }
    return env.ASSETS.fetch(request);
  },
};
