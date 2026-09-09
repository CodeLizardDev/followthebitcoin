// Public, reviewed deployment settings. No secrets belong in this file.
// Leave unavailable destinations null: the UI must never pretend they are live.
export const siteConfig = {
  name: 'Follow the Bitcoin',
  publicOrigin: null as string | null,
  repositoryUrl: null as string | null,
  communityUrl: null as string | null,
  communityProvider: 'SimpleX',
  onionUrl: null as string | null,
};
