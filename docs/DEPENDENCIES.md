# Dependency review — 2026-10-16

The lockfile uses exact top-level versions. The October review updated compatible
build tooling including Wrangler 4.151.0, Cloudflare's Vite plugin 1.64.0,
workers-types 5.20261016.1 and oxfmt 0.73.0. It also refreshed compatible
transitives and pins `image-size` to the fixed 2.0.4 release through an override.
React, react-dom and react-server-dom-webpack remain 19.2.8, and Vite is 8.2.2.

The audit is **not clean**: 25 reported findings were reduced to 9 high findings,
with no critical, moderate or low findings at the time of review. The remaining
flags all originate from one unpatched `braces` stack-exhaustion advisory,
[GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), propagated
through packages such as micromatch, fast-glob, shadcn and vinext. Those paths
process trusted repository/build inputs here; they are not shipped as a browser
parser or a production server. Do not describe that boundary as an upstream fix.
Review the advisory and rerun `npm audit` before later releases. Do not use
`npm audit fix --force` without reviewing compatibility and the resulting code.

Cloudflare Pages serves only static browser assets. It runs no Vinext, React
server renderer, image parser, Wrangler or WebSocket server for visitors. The
optional local/self-hosted static server uses only Node built-ins. Development
and build findings still matter for contributors: use trusted source inputs,
localhost-only development and CI without secrets for untrusted PRs. Never
publish the development server, `node_modules` or `dist/server/`.

The Windows build wrapper allows successful Vinext exits to unwind naturally to
avoid a Node native-handle shutdown race. It preserves nonzero failures and does
not suppress compilation errors. Linux builds use the normal CLI exit behavior.

The postbuild audit checks generated asset references, private artifacts, exact
CSP hashes and Cloudflare header-size limits. Release review should also inspect
licenses, browser requests and the matching Git revision. These checks are not a
claim of independent security review or bit-for-bit reproducible builds.
