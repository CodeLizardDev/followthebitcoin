# Dependency review — 2026-09-09

The local scaffold's React 19.2.6 and Vite 8.0.13 were updated to React 19.2.8
(including react-dom and react-server-dom-webpack) and Vite 8.2.2 after npm audit
identified fixed advisories. Exact versions and transitive dependencies are
recorded in package-lock.json.

The npm audit is **not clean**. Remaining findings involve development/build
dependencies including esbuild, image-size, sharp, undici and ws, plus packages
that depend on them. Run a fresh `npm audit` before a public source release and
review compatible fixes. Do not use `npm audit fix --force` without review.

The shipped server uses only Node built-ins and serves the static browser export.
It does not import vinext, Vite, React's server renderer, image parsers, Wrangler
or WebSocket packages. This limits production exposure to the cited server/build
paths, but does not make the contributor toolchain exempt from security updates.
Use localhost-only development, trusted inputs, CI without secrets for PRs, and
never deploy the development server or `dist/server/`.

The Windows build wrapper only allows successful vinext exits to unwind naturally
to avoid a Node native-handle shutdown race. It preserves nonzero exit codes and
does not suppress compilation errors. It is not needed on Linux.

Before a tagged public release: refresh the audit, review upstream fixes, inspect
dependency licenses, review generated artifacts for external requests and source
maps, and record the exact Git revision and checksums. This local handoff is not
a claim of independent security review or bit-for-bit reproducible builds.
