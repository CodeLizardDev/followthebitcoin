# Free Cloudflare Pages deployment

The production configuration targets `https://followthebitcoin.pages.dev/`, with
source at `https://github.com/CodeLizardDev/followthebitcoin`. The project does not
need a purchased domain. This is a static release: no Pages Functions, database,
paid Worker or Node server is deployed.

## Initial deployment: Direct Upload

Build the reviewed source locally with Node 24. Create or select **Workers &
Pages → Create application → Pages → Direct Upload / Upload assets**. Use project
name `followthebitcoin` and upload the **contents** of `dist/client/`, either as
a folder or a ZIP whose root contains `index.html`, `_headers` and the assets.
Do not upload the source archive or wrap the export inside an extra directory.
There are no framework build settings, Functions bindings or runtime secrets for
this dashboard upload.

`npm run build` includes the postbuild step that removes known build metadata,
generates CSP response headers and audits the public output. Do not publish an
unchecked raw framework build. The optional CLI configuration is
`deploy/wrangler-pages.jsonc`; use it explicitly with
`npx wrangler pages deploy --config deploy/wrangler-pages.jsonc` after separate
operator authentication. The configuration contains no credentials.

The public GitHub repository holds the source and CI review checks. A Git push
does **not** update this Direct Upload project automatically. For each update,
upload a newly checked export and record its source revision. Cloudflare does
not allow converting an existing Direct Upload project to Git integration;
automated deployments can be added later through Wrangler CI with a narrowly
scoped deployment credential. No such credential or workflow is installed by
this release. Creating a different Git-integrated project is another later
option, but its address/name availability must be handled deliberately.

Leave Cloudflare Web Analytics, Zaraz, Rocket Loader and other HTML/script
injection disabled. The release's same-origin CSP intentionally excludes
analytics beacons. Hosting request metadata remains under Cloudflare's policies.
The project's own daily counter does not run on Pages. No public `.onion` service
is claimed by this deployment.

Cloudflare Pages' free tier currently allows static asset requests without
request charges and has quotas including monthly builds and file limits. This
project requires no paid option. Check the provider's current plan before
changing the architecture or enabling Functions.

Sources: [Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/),
[Wrangler CI](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/),
[response headers](https://developers.cloudflare.com/pages/configuration/headers/),
[free-tier limits](https://developers.cloudflare.com/pages/platform/limits/),
[static asset pricing](https://developers.cloudflare.com/pages/functions/pricing/).

## Release and verification

Before publishing a source revision, run `npm ci`, `npm run lint`,
`npx tsc --noEmit`, `npm test`, `npm run build`, and `npm run check:release`.
The GitHub workflow repeats these checks. Configure protected `main`, one approval,
required CI and resolved conversations. Upload only the reviewed production
revision after its checks pass. Do not pass secrets to untrusted pull-request
builds. Review checks do not deploy or require a Cloudflare credential.

The public root must contain only `dist/client/`. Never upload `.git`, source
maps, `.env`, `node_modules`, `dist/server/`, onion keys or aggregate data. The
export audit checks same-origin executable/style/image assets, CSP hash matches,
forbidden artifacts and Cloudflare's 2,000-character header-line limit. The CSP
permits only the exact generated inline bootstrap scripts, not arbitrary inline
script or eval. Rebuild instead of manually copying hashes between releases.

After Cloudflare reports a successful deployment:

1. Verify HTTPS responds successfully at the exact production address. Confirm
   `Content-Security-Policy`, `Referrer-Policy: no-referrer`,
   `X-Content-Type-Options: nosniff` and `X-Frame-Options: DENY` in the response.
2. Play the full quest using visible answer buttons and every role switch. Check
   wrong answers, completion, reset, badge download and direct hash navigation.
3. Inspect requests and console errors. Gameplay must use only the site's origin,
   with no analytics beacon, wallet connection, cookie or progress storage.
4. Check a narrow mobile viewport, keyboard focus, disabled JavaScript reading
   mode and optional outbound source/community links. Test Tor Browser separately
   before making claims about Tor accessibility on the hosting account.
5. Record the production revision and deployment outcome. For a bad release, use
   Pages' rollback and fix the source through the normal review process.

## Community and source settings

`lib/site-config.ts` holds public destinations only. The current community uses
GitHub Discussions in the source repository. Enable it in repository settings,
moderate public posts and provide a welcome/rules topic. Posting needs a GitHub
account; reading or playing the game does not. Never embed the discussion UI or
load GitHub on the player's behalf. Enable private vulnerability reporting for
sensitive reports rather than directing users to public discussions.

An alternative SimpleX group can be added later if a moderator supplies and
verifies its invitation. Update the configuration and privacy copy together;
do not invent a group or promise messages disappear from members' devices.

## Optional later self-hosting and Tor

Tor Browser can visit an HTTPS site. A real v3 onion address requires a running
Tor service; Cloudflare Pages alone does not provide it. The export supports a
separate low-cost Linux host later, using the existing Node server and examples
in `deploy/` for Caddy, systemd and Tor. The self-hosted Node server has no npm
runtime dependencies. It binds to loopback by default.

Install supported Node, Caddy and Tor from official packages. Copy only public
assets and the server files, validate Caddy and Tor configuration, serve the same
release over HTTPS and onion, and verify the actual generated v3 hostname in Tor
Browser. Set `onionUrl` and `ONION_URL` only to that verified address. Tor private
keys stay outside the public root. Do not redirect onion play back to clearnet.
Keep these services patched and disable request-level access/error logging in
the reverse proxy. [Tor setup](https://community.torproject.org/onion-services/setup/).

The optional Node counter is enabled only by setting `COUNT_FILE` to a private
path outside the public export. It stores only daily totals for 30 UTC days,
respects DNT/GPC and counts reloads/bots too. It is not a unique-human metric and
has no public endpoint. Omit `COUNT_FILE` to disable it. This feature is not part
of the free Pages deployment.
