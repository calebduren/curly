import { expect, it, vi } from 'vitest';
import worker from '../worker/index';

it('serves the primary domain at the root without redirecting assets', async () => {
  const assets = { fetch: vi.fn(async (_request: Request) => new Response('asset')) };
  const request = new Request('https://typograph.dev/assets/example.js?v=1');
  const response = await worker.fetch(request, { ASSETS: assets });
  expect(await response.text()).toBe('asset');
  expect(assets.fetch).toHaveBeenCalledWith(request);
});

it('redirects the secondary domain while preserving paths and query strings', async () => {
  const assets = { fetch: vi.fn() };
  const response = await worker.fetch(
    new Request('https://typograph.ing/skill/SKILL.md?source=guide'),
    { ASSETS: assets },
  );
  expect(response.status).toBe(308);
  expect(response.headers.get('location')).toBe(
    'https://typograph.dev/skill/SKILL.md?source=guide',
  );
  expect(assets.fetch).not.toHaveBeenCalled();
});

it('does not turn missing assets into a successful page', async () => {
  const assets = { fetch: vi.fn(async () => new Response('Not found', { status: 404 })) };
  expect(
    (await worker.fetch(new Request('https://typograph.dev/missing.js'), { ASSETS: assets }))
      .status,
  ).toBe(404);
});
