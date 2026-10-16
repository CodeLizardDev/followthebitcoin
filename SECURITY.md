# Security and privacy reports

Never include keys, real wallet records, private messages or visitor IP addresses
in public issues. Use [GitHub private vulnerability reporting](https://github.com/CodeLizardDev/followthebitcoin/security/advisories/new)
for security issues. Private reporting is enabled for this repository.

Use ordinary [issues](https://github.com/CodeLizardDev/followthebitcoin/issues) for
non-sensitive reproducible bugs. No response-time SLA is promised for this small
volunteer project. Support targets the most recent release.

## Deployment boundary

Only `dist/client/` is public. Do not serve the repository, `dist/server/`, source
maps, `.env`, aggregate files, Git history or onion keys. The Node static server
sets a restrictive CSP and does not expose a metrics API. Cloudflare Pages uses
the same policy in the generated `_headers` file; it runs no Node server or
project-owned visitor counter. For optional self-hosting, deploy one server
process per aggregate file; atomic replacement is not a multi-process lock.

The game uses no server-side React in production. Dependency findings still
matter for contributors and the build environment; review them before a release.
Do not execute untrusted PR code with secrets. Keep server OS, Node, Tor and Caddy
patched. Do not expose the local development server to the internet.

## Residual limitations

Memory-only progress disappears on reload. Badge completion is self-attested,
not fraud-resistant certification. A public group invitation can be copied;
members can retain messages. Infrastructure providers have their own metadata
practices. The static version does not make browsers or third-party sites private.
