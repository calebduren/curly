import { expect, it, vi } from 'vitest';
import worker from '../worker/index';

it('redirects the landing URL into the path-scoped playground', async () => {
  const assets = { fetch: vi.fn() };
  const response = await worker.fetch(new Request('https://curly.example/'), { ASSETS: assets });
  expect(response.headers.get('location')).toBe('https://curly.example/curly/');
  expect(assets.fetch).not.toHaveBeenCalled();
});
it('maps assets without absorbing sibling app paths', async () => {
  const assets = { fetch: vi.fn(async (_request: Request) => new Response('asset')) };
  await worker.fetch(new Request('https://cowboy.is/curly/assets/example.js?v=1'), {
    ASSETS: assets,
  });
  expect(assets.fetch.mock.calls[0][0].url).toBe('https://cowboy.is/assets/example.js?v=1');
  expect(
    (await worker.fetch(new Request('https://cowboy.is/lariat/'), { ASSETS: assets })).status,
  ).toBe(404);
});
