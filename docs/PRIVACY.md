# Data handling

| Data | Location | Retention |
| --- | --- | --- |
| Answers and quest progress | React memory in this tab | Until reload or reset |
| Badge PNG | Browser memory, then an explicit download/share destination | User controlled |
| Community posts | GitHub and readers' devices | GitHub/member controlled |
| Hosting connection metadata | Cloudflare infrastructure | Provider controlled |

The Pages release has no project analytics, cookies, localStorage, sessionStorage,
visitor IDs, session identifiers, IP hashes, fingerprinting, answer uploads,
analytics SDKs or real blockchain queries. Fonts, icons and scripts are local.
External links use no-referrer. WebMCP exposes fictional gameplay in browsers
that support it and makes no request or answer upload to this project's operator.

## Cloudflare Pages

Cloudflare serves the static files and can process connection metadata such as
IP addresses as an infrastructure provider. The project's lack of a tracking
script does not imply that the CDN never sees a connection. There is no active
project page counter or analytics beacon in this release. Web Analytics and
script injection must remain disabled unless the privacy design is explicitly
revised and disclosed. A restrictive same-origin CSP also blocks external script
and connection destinations during play.

The reading edition works with JavaScript disabled. Tor Browser can use the HTTPS
version, subject to the provider's availability/access rules. A project-owned
`.onion` address is not available yet. A future onion service can serve the same
files without clearnet resource dependencies or a redirect back to HTTPS.

## Community and sharing

GitHub Discussions is optional and external. Reading public discussions does not
require joining the game; posting requires a GitHub account. GitHub processes
account and connection data under its own policies. Posts are public and other
people can retain them. Do not post seeds, real wallet details, private messages
or personal data. Community participation never affects badge eligibility.

The site embeds no social network or chat client. A user explicitly chooses to
open an external source, community page or system sharing menu. The badge has no
name, wallet address or unique participant identifier. Sharing it may disclose
participation to the destination chosen by the user.

## Optional self-hosted aggregate counter

This section describes the separate Node server in the repository, **not the
Cloudflare Pages deployment**. Set `COUNT_FILE` to a private absolute path outside
the export to enable it; omit that setting to disable counting.

Only successful GET requests for `/` and `/index.html` count. Hash navigation,
scripts, HEAD, failures and other paths do not count. DNT: 1 and Sec-GPC: 1
requests are excluded. If HTTPS and onion use the same server, they contribute
to a combined daily total without a channel label.

The exact format is `{"version":1,"days":{"2026-10-16":17}}`. No individual
records, timestamps finer than the day, identifiers, IP addresses, user agents,
referrers, query strings, locations or answers are stored. Totals expire after
30 UTC calendar days during counting/flushes. Writes are atomic and owner-readable
on POSIX. Abrupt shutdown can lose up to one minute of totals. Reloads and bots
count; these are **page loads, not unique visitors**. There is no public metrics
endpoint or IP-based bot detection. Read totals through an authenticated operator
connection.

The supplied Node server writes no request log. The Caddy example disables
request access/error logs while retaining operational messages. Hosting, DNS,
network and certificate providers can still process metadata independently.
Audit deployment-specific defaults before stating stronger privacy guarantees.
