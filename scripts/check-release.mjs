import { siteConfig } from '../lib/site-config.ts';
import { auditStaticRelease, validateDestinations } from './pages-release.mjs';

const local = process.argv.includes('--local');
validateDestinations(siteConfig, { local });
const result = await auditStaticRelease('dist/client');
if (!local && /name="robots"[^>]*content="[^"]*noindex/i.test(result.html))
  throw new Error('Public release still forbids indexing');
console.log(
  `Static release checks passed: same-origin assets, exact CSP hashes (${result.inlineScriptCount}), no private artifacts. Community and onion links remain optional.`,
);
