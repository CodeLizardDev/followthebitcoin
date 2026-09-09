# Follow the Bitcoin

**Every payment tells a story. Can you uncover it?**

A free, MIT-licensed Bitcoin privacy game for beginners. In **First Clue**, you
investigate three fictional payment maps, switch roles and try decisions that
reveal less. Finish all three to earn a **First Clue** badge that is created on
your device and can be downloaded or shared. Wrong guesses never remove rewards.

The first release is brand-neutral. Future quests can add more complex fictional
scenarios and carefully sourced reconstructions of real cases, each with its
own badge. It is not an official Bitcoin project or wallet endorsement.

## Run the release locally

Use Node 24 LTS (`.nvmrc` records the tested version).

```sh
npm ci
npm run build
npm start
```

Open **http://127.0.0.1:4317/**. This serves the same static export intended for
production, with security headers and no hot-reload traffic. After a PC restart,
`npm start` is sufficient if the build exists. For development use
`npm run dev -- --hostname 127.0.0.1 --port 4317` with the release server stopped.

## Privacy by minimization

- No account, email, wallet connection, real transaction or payment is required.
- No cookies, local storage, visitor IDs, fingerprints or answer uploads.
- Progress exists only in this tab; reloading clears it. Badge files are yours.
- Fonts, icons and scripts are local. No third-party requests are needed to play.
- Optional server counting stores only `{date: total}` per UTC day for 30 days.
  It respects DNT/GPC and counts page loads, **not unique people**. Set `COUNT_FILE`
  outside the public directory to enable it. No public metrics endpoint exists.
- Community is an external, optional invitation, never an embedded tracker.
- The same export supports an onion service; a no-JavaScript reading edition
  includes every lesson for Tor Browser's Safest mode.

See [data handling](docs/PRIVACY.md) for exact behaviour and hosting boundaries.

## Status and public destinations

This is a **local first release**. The selected domain `followthebitcoin.org` has
not been registered by this project. The GitHub repository will belong to a
separate project account/organization; nothing has been pushed to a personal
account. A community invitation and live onion address are not yet available.
The UI says so rather than showing fake links.

Set the actual verified destinations in `lib/site-config.ts` and update public
indexing before launch. The recommended community is a moderator-owned SimpleX
group; the moderator must supply and verify the invitation. No visitor needs to
join it to play. The supplied Linux deployment uses one small server for HTTPS,
Tor and the aggregate counter. See [deployment](docs/DEPLOYMENT.md) for setup and
current cost estimates. Plain static hosting also works without the counter.

## Checks and contribution workflow

```sh
npm run lint
npx tsc --noEmit
npm test
npm run build
npm run check:release -- --local
```

Without `--local`, the release check also requires the real public destinations.
Tests cover quest progression, badge eligibility, invalid actions, satoshi
conservation, counter retention, privacy signals and private-path exclusion.

Use issues, focused pull requests, review, protected branches, pinned dependencies
and reviewed releases. CI runs on Linux and never publishes automatically.
[Contributing](CONTRIBUTING.md), [security](SECURITY.md),
[dependency review](docs/DEPENDENCIES.md), [third-party licenses](THIRD_PARTY.md).
The dependency audit still has build/development findings; review them before a
public release. The deployed server itself has no npm runtime dependencies.

The framework export is `dist/client/`; never publish `dist/server/`, `.git`,
secrets, onion keys or aggregate files. The server uses same-origin resources and
does not redirect onion visitors to the clearnet domain. Hash routes such as
`/#quest/first-clue` make quests linkable on static hosts without extra routing.

## Educational model

Observer knowledge is stated explicitly. Public transaction links and inferred
ownership are different. A new receiving address does not erase past payments.
The CoinJoin example is a simplified equal-output model, not a product's real
fee quote or a promise of anonymity. Evidence sources are linked in each lesson.
Badges celebrate completing a quest, not verified financial privacy.
