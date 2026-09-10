Curly 1.0.1 refines the playground and corrects creator attribution to Caleb Durenberger, with a link to [calebduren.com](https://calebduren.com).

Inspection now preserves the reading text’s dimensions, keeps keyboard focus on selected punctuation, and animates highlights and the explanation panel. The palette uses a warm orange brown, and brand attribution uses sentence case. Reduced-motion preferences are respected.

The typography engine and public APIs are unchanged.

Try the [Cloudflare playground](https://cowboy-curly.caleb-9b2.workers.dev/curly/) or install the tested archive:

```sh
npm install https://github.com/calebduren/curly/releases/download/v1.0.1/cowboy-curly-1.0.1.tgz
```

Use `import { smarten } from 'cowboy-curly'` or the documented renderer integrations. The package has no runtime dependencies. See the README for scope, streaming latency, and ambiguous cases.

Validation includes desktop, tablet, and mobile inspection geometry; keyboard selection and collapsed-panel semantics; build/typecheck; the existing correctness and integration suite; and a clean package consumer.

The archive is available directly from this release. npm registry publication and the `cowboy.is/curly/` domain are separate account-setup steps; the Cloudflare address works now.
