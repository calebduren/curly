Curly is a small typography kit for English prose and AI interfaces, by Cowboy.

This first release includes smart quotes and apostrophes, opt-in measurement primes and ellipses, protected ranges, cross-node remark/rehype integrations, inspectable decisions, a paragraph-buffered prose stream, and optional reading styles.

Try the [Cloudflare playground](https://cowboy-curly.caleb-9b2.workers.dev/curly/) or install the tested archive:

```sh
npm install https://github.com/calebduren/curly/releases/download/v1.0.0/cowboy-curly-1.0.0.tgz
```

Use `import { smarten } from 'cowboy-curly'` or the documented renderer integrations. The package has no runtime dependencies. See the README for scope, streaming latency, and ambiguous cases.

Validation: unit/invariant/integration tests, TypeScript, production build, clean ESM/CommonJS package consumer, public CI, and desktop/mobile browser review. Measurements and reproduction scripts are included in the repository.

The archive is available directly from this release. npm registry publication and the `cowboy.is/curly/` domain are separate account-setup steps; the Cloudflare address works now.
