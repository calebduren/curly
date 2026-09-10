# Releasing Curly

1. Update the version and changelog, including the playground’s workspace dependency.
2. `npm ci && npm run build && npm run typecheck && npm test`
3. `npm run bench` and review the environment, scope, and measurements.
4. `npm run check:package` verifies the actual tarball in a clean temporary consumer: ESM, CommonJS, type resolution, CSS export, and both AST adapters.
5. Audit `npm pack --dry-run -w cowboy-curly`. Only the public package files belong in the archive.
6. From `packages/curly`, publish with `npm publish --access public`. Use npm’s browser login and required second factor; never put a token in source or chat.
7. Commit, tag `v<version>`, and create a GitHub release with the tested tarball.
8. `npm run build && npx wrangler deploy` publishes the dedicated playground Worker.
9. Verify the live `/curly/` page, hashed assets, content headers, interactions, and narrow mobile layout. Check the package’s public install command in a new consumer.

The Worker rewrites only its `/curly/` prefix before fetching static assets. Connect `cowboy.is/curly*` in the appropriate Cloudflare zone only after confirming domain ownership, existing routes, and DNS. DNS delegation may require registrar access; don’t replace unrelated records or another app’s route.

Font files in the playground are self-hosted from Fontsource under their bundled SIL Open Font Licenses. The library itself has no font or framework dependency. No ReUI licensed component code is included.
