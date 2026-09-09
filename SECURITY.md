# Security and privacy reports

Never include keys, real wallet records, private messages or visitor IP addresses
in public issues. A project-owned GitHub repository and reporting channel are not
published yet. Do not report to an invented address.

Before public launch, enable GitHub private vulnerability reporting and link the
verified repository. Report security issues there; use ordinary issues for
non-sensitive reproducible bugs. No response-time SLA is promised for this small
volunteer project. Support targets the most recent release.

## Deployment boundary

Only `dist/client/` is public. Do not serve the repository, `dist/server/`, source
maps, `.env`, aggregate files, Git history or onion keys. The Node static server
sets a restrictive CSP and does not expose a metrics API. Deploy one server
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
