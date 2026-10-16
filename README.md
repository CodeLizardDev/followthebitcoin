# Follow the Bitcoin

**Every payment leaves a clue. Can you uncover it?**

A free, MIT-licensed Bitcoin privacy game for beginners. In **First Clue**, you
investigate three fictional payment maps, switch roles and try decisions that
reveal less. Finish all three to earn a **First Clue** badge created on your
device. You can download or share it. Wrong guesses never remove rewards.

Production address: **https://followthebitcoin.pages.dev/**.
Source and reviews: **https://github.com/CodeLizardDev/followthebitcoin**.
Community: **https://github.com/CodeLizardDev/followthebitcoin/discussions**.
Playing requires no account; posting in the optional community requires GitHub.

The first release is brand-neutral. Future quests can add harder fictional
scenarios and carefully sourced reconstructions of real cases, each with a badge.
This is an independent educational project, not an official Bitcoin project or
wallet endorsement.

## Run locally

Use Node 24 LTS (`.nvmrc` records the tested version).

```sh
npm ci
npm run build
npm start
```

Open **http://127.0.0.1:4317/**. This serves the production static export with
security headers. After a PC restart, `npm start` is sufficient if the build
already exists. For development, stop the release server and use
`npm run dev -- --hostname 127.0.0.1 --port 4317`.

## Privacy by minimization

- No account, email, wallet connection, real transaction or payment is needed.
- No cookies, localStorage, visitor IDs, fingerprints or answer uploads.
- Progress stays in this tab's memory and clears on reload. Badge files are yours.
- Fonts, icons and scripts are local. No third-party request is needed to play.
- The Pages edition has no project analytics, visitor beacon or active counter.
  Cloudflare serves the files and can process connection metadata independently.
- Community is an optional external link. GitHub conversations are public and
  account/provider data is governed by GitHub.
- The reading edition includes every lesson with JavaScript disabled, including
  Tor Browser's Safest mode. A project-owned `.onion` address is not available yet.

See [data handling](docs/PRIVACY.md) for hosting boundaries and the separate,
optional self-hosted daily counter.

## Free Cloudflare Pages deployment

The site uses **Pages Direct Upload**, project `followthebitcoin`. After the
production deployment credentials are configured, GitHub Actions automatically
publishes successful `main` pushes. Pull requests run checks without deployment
secrets. The checked static export is built once, retained as an immutable
artifact and deployed without rebuilding; a final check skips stale revisions.
No custom domain, Functions, database or paid Worker is required. Do not enable
Web Analytics, Zaraz or third-party script injection for this release.

Each export regenerates `_headers` from the exact emitted inline-script bytes.
The build rejects stale assets, private artifacts, third-party executable assets
and CSP lines beyond Cloudflare's 2,000-character limit. Only `dist/client/` is
uploaded; `dist/server/` and the local Node server are never deployed to Pages.

See [deployment and verification](docs/DEPLOYMENT.md) for the full settings,
release checks and optional later Tor deployment. The free tier still has
provider quotas and terms; no paid service is required by this configuration.

## Checks and contribution workflow

```sh
npm run lint
npx tsc --noEmit
npm test
npm run build
npm run check:release
```

Tests cover progression, badge eligibility, invalid actions, satoshi conservation,
counter privacy/retention and Pages CSP/artifact safeguards. `--local` relaxes only
the requirement for configured public URLs; it never weakens artifact checks.
Community and onion destinations are optional, and unset links must stay honest.

Use focused pull requests, evidence, independent review, protected branches,
pinned dependencies and reviewed releases. GitHub CI checks pull requests without
deployment credentials. Protected `main` is the release gate; the separate
`production` job receives the Cloudflare deployment secrets only for publishing.
[Contributing](CONTRIBUTING.md), [security](SECURITY.md),
[dependency review](docs/DEPENDENCIES.md), [third-party licenses](THIRD_PARTY.md).

## Educational model

Observer knowledge is stated explicitly. Public transaction links and inferred
ownership are different. A fresh receiving address does not erase old payments.
The CoinJoin example is a simplified equal-output model, not a real fee quote or
a guarantee of anonymity. Evidence sources are linked in each lesson. Badges
celebrate completion, not verified financial privacy.
