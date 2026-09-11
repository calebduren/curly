# Releasing Typograph

This iteration is a local prerelease: `@calebduren/typograph@2.0.0-next.1`. The unscoped `typograph` name belongs to an unrelated npm project. The scoped name is configured locally; registry publication and ownership have not been verified.

1. Update the library and playground versions, workspace dependency, lockfile, and changelogs.
2. Run `npm ci` and `npm run check`.
3. Review `release/calebduren-typograph-<version>.tgz`, produced by the consumer check. Inspect `npm pack --dry-run -w @calebduren/typograph` for unintended files.
4. Check the generated package and skill links in the site. `npm run build:resources` copies the complete skill folder, creates both archives, and records package integrity. It is already part of the build.
5. When changing the punctuation engine, run `npm run bench` and review the measurements. The benchmark covers punctuation entrypoints, not the whole typography system.
6. Create the release and attach the tested archive when ready to publish. Archive installation works independently of npm registry availability.
7. For a registry release, first verify access to the `@calebduren` scope. Publish from `packages/typograph` with `npm publish --access public --tag next` for this prerelease. Use npm's login and required second factor. Advertise a registry install command only after an independent public install succeeds.
8. When ready to host, build and deploy with `npx wrangler deploy`. The checked-in configuration creates a dedicated `typograph` Worker for `typograph.dev` and `typograph.ing`. Confirm the active Cloudflare account owns the intended zones before applying it.
9. Verify the production root page, hashed assets, downloads, clipboard feedback, mobile layout, and redirects.

The primary domain is `typograph.dev`. Requests to `typograph.ing` redirect to the primary domain while preserving path and query. Other missing assets remain 404 responses. Both domains were registered by the owner; checked-in routes are preparation, not evidence of deployment.

The package contains JavaScript, types, optional CSS, documentation, license, and upstream notices. Skill downloads contain only the portable skill and its references. No development metadata, private fonts, or credentials belong in either archive.
