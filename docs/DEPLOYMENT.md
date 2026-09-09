# Low-cost HTTPS + onion deployment

This checkout is local only. No domain, VPS, onion service, chat group or public
GitHub repository has been created. Do not advertise placeholder destinations.

## Chosen architecture

Build once, serve static files. A single small Linux VPS runs the zero-dependency
Node static server, Caddy for automatic HTTPS, and Tor for a v3 onion service.
One copy of the files and one daily aggregate counter serve both entrypoints.
There is no database, paid analytics subscription or always-running React server.

Free static hosting is also possible: upload only `dist/client/`. In that mode,
the supplied daily counter and onion service need separate infrastructure; the
host may keep request metadata. Reusing an existing Linux server is the cheapest
way to get all three capabilities with the documented data handling.

As checked on 2026-09-09, the selected domain was offered by Porkbun at $7.98 for
the first year and $11.84 renewal, with possible tax at checkout. One reference
VPS price is Hetzner CX23 in Germany/Finland at €5.49/month excluding IPv4 and VAT.
Allow roughly €6–8/month plus domain fees depending on tax and networking; this
is an estimate, not a purchased plan or a permanent quote.

Sources: [Porkbun .org](https://porkbun.com/tld/org),
[Hetzner current price adjustment](https://docs.hetzner.com/general/infrastructure-and-availability/price-adjustment/),
[Tor onion setup](https://community.torproject.org/onion-services/setup/),
[Caddy logging](https://caddyserver.com/docs/caddyfile/directives/log).

## Release settings

Set reviewed public destinations in `lib/site-config.ts`: `publicOrigin`,
`repositoryUrl`, `communityUrl`, `communityProvider`, and `onionUrl`. Keep unknown
values null. The selected HTTPS domain is `https://followthebitcoin.org`, but do
not set it as live until registered and served. `publicOrigin` controls the badge
and share link. It must not force onion visitors back to clearnet during play.
Change `robots` in `app/layout.tsx` to allow indexing only for the public release.
The release checker deliberately blocks unresolved public destinations.

## Operator setup (review before running on your server)

1. Provision a small, supported Linux host. Install supported Node 24 LTS, Caddy
   and Tor from their official package sources. Limit incoming ports to SSH,
   80 and 443; the application must bind to loopback, not a public interface.
2. Build and validate the reviewed source revision with `npm ci`, `npm run lint`,
   `npx tsc --noEmit`, `npm test`, `npm run build`, and `npm run check:release`.
3. Copy **only** `dist/client/`, `server/`, `LICENSE` and the reviewed deployment
   configuration to `/opt/follow-the-bitcoin`. Keep the directory readable but
   not writable by the dynamic service user. Do not copy `.git`, source maps,
   dev servers, `node_modules`, secrets or `dist/server` into the public root.
4. Install `deploy/follow-the-bitcoin.service` under `/etc/systemd/system/`.
   Run `systemctl daemon-reload` and `systemctl enable --now follow-the-bitcoin`.
   `curl -I http://127.0.0.1:4317/` must return 200 with privacy headers.
5. Register the domain, set DNS to the host and use `deploy/Caddyfile`. Validate
   with `caddy validate --config /etc/caddy/Caddyfile` before reload. Verify HTTPS
   and inspect both normal and error logs to confirm requests are not recorded.
6. Add the Tor configuration fragment to your existing torrc. Run
   `tor --verify-config`, then restart Tor using your distribution's service.
   Read `/var/lib/tor/follow-the-bitcoin/hostname` for the actual v3 address.
7. Test that address in Tor Browser. Add the verified URL to `onionUrl` and set
   `ONION_URL=http://THE_VERIFIED_56_CHARACTER_ADDRESS.onion/` in the operator-only
   `/etc/follow-the-bitcoin.env`. Rebuild the public files, restart the site, and
   check that the HTTPS response advertises the correct `Onion-Location` header.
   Do not enable non-anonymous or single-hop onion mode.
8. Test the whole quest, badge download, and no-JavaScript edition over HTTPS and
   Tor. Check that third-party requests occur only after deliberately leaving.
   Load once with DNT/GPC and once without; inspect the aggregate file. Confirm
   `/stats`, `/metrics`, `/.env` and filesystem traversal attempts cannot expose
   private data. The JSON is read over SSH, never via a public endpoint.

State is tiny: only the 30-day count file and Tor's private service keys need
operator backups. Store the keys securely outside the website; losing them
changes the onion address. Do not back up access logs or introduce request-level
analytics. Caddy certificates need renewal, and the OS/services need updates.

## GitHub and community activation

Create a separate project-owned public GitHub repository; do not accidentally
publish through a personal account if separation is intended. Review all commit
author metadata, remote URLs and included files before pushing. Enable protected
branches, CI and private vulnerability reporting as described in CONTRIBUTING.
The CI workflow runs checks and produces an artifact; it does not deploy on push.

Recommended chat is a moderator-owned SimpleX group. The moderator creates and
retains the group/profile in their own app, enables an invitation, checks it from
a separate test profile, and supplies the public invitation URL. Put that exact
link in `communityUrl`. Do not create an agent-owned group or invent a link.
SimpleX does not require a phone/email account; it does require a compatible app.
An open invitation needs moderation, and group members can retain messages.
[SimpleX quick start](https://simplex.chat/docs/guide/readme.html).

If Matrix or GitHub Discussions is chosen instead, update both the configuration
and community privacy copy to reflect account, provider and retention behaviour.
Publishing the site is independent of joining its community.
