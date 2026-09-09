# Data handling

| Data                       | Location                                                    | Retention                          |
| -------------------------- | ----------------------------------------------------------- | ---------------------------------- |
| Answers and quest progress | React memory in this tab                                    | Until reload or reset              |
| Badge PNG                  | Browser memory, then an explicit download/share destination | User controlled                    |
| Optional page count        | Operator-only aggregate JSON                                | 30 UTC calendar days               |
| Community messages         | External chat infrastructure and members' devices           | External service/member controlled |

No cookies, localStorage, sessionStorage, unique visitor IDs, session identifiers,
IP hashes, fingerprinting, answer uploads, analytics SDKs or real blockchain
queries are used. Icons and fonts are local. External links use no-referrer.
WebMCP exposes fictional gameplay only in browsers that support it; it makes no
network requests and does not transmit data to this site's operator.

## Aggregate counter

Set `COUNT_FILE` to an absolute path outside the export to opt into the supplied
server counter. Omit it to disable counting. It counts successful GET requests
for `/` and `/index.html`; hash navigation, scripts, HEAD, failed and other
requests do not count. DNT: 1 and Sec-GPC: 1 requests are not counted. Both HTTPS
and onion page loads contribute to the same total without a channel label.

The exact stored format is `{"version":1,"days":{"2026-09-09":17}}`.
There are no individual event records, timestamps finer than the day, identifiers,
IP addresses, user agents, referrers, query strings, locations or answers.
Expired daily totals are deleted during counting and minute flushes. Writes are
atomic and files are owner-readable only on POSIX. Up to one minute of counts can
be lost during an abrupt power loss. Reloads and bots count; this is **page loads,
not unique visitors**. No IP-based bot detection is added to improve the count.
There is no public statistics endpoint. Read the file over an authenticated
operator connection. Do not install an analytics dashboard that reintroduces
tracking. The development preview and plain static hosts do not run this counter.

## Infrastructure

The supplied Node server makes no request logs. Caddy's example disables access
logging and request-error logging; operational service messages remain. Hosting,
DNS, network and certificate providers can process metadata independently.
Audit their policies and defaults before making production claims. A hosted
preview can have platform authentication or platform telemetry; it is not the
self-hosted deployment described here.

Tor Browser can use the HTTPS version. The optional v3 onion service serves the
same files over a loopback-only connection and uses no exit relay. No cross-origin
resources, redirects to a clearnet canonical host, or clearnet analytics beacons
are required. Tor Browser's Safest mode gets a no-JavaScript reading edition.

Before opening an external community, GitHub page or sharing menu, the user
chooses to leave this site. The site embeds none of those services. Any community
promise must describe the actual chosen service; do not claim messages disappear
from other members' devices.
