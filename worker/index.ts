interface Assets {
  fetch(request: Request): Promise<Response>;
}

/** A path-scoped site: sibling Cowboy apps keep their own routes. */
export default {
  async fetch(request: Request, env: { ASSETS: Assets }): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/' || url.pathname === '/curly') {
      url.pathname = '/curly/';
      return Response.redirect(url.toString(), 302);
    }
    if (!url.pathname.startsWith('/curly/')) return new Response('Not found', { status: 404 });
    url.pathname = url.pathname.slice('/curly'.length);
    return env.ASSETS.fetch(new Request(url, request));
  },
};
