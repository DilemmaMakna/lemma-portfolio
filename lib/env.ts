// The only place that reads site env settings. Values are frozen when the module loads.
//
// Do not import `env.contactWebhookUrl` from a client component. This module does not use
// `import "server-only"` because `siteUrl` is also needed on the client; keep that rule in review.
//
// NEXT_PUBLIC_* is inlined at build time only for a literal `process.env.NEXT_PUBLIC_X` access.
// Do not change it to `process.env[name]`.

const DEFAULT_SITE_URL = "https://dilemma-makna.com";

// Runs at module load: an invalid URL fails the build or start instead of being used silently.
function parseSiteUrl(raw: string | undefined): string {
  const value = (raw?.trim() || DEFAULT_SITE_URL).replace(/\/+$/, "");
  try {
    new URL(value);
  } catch {
    throw new Error(`NEXT_PUBLIC_SITE_URL is not a valid URL: ${value}`);
  }
  return value;
}

export const env = Object.freeze({
  siteUrl: parseSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  googleSiteVerification: process.env.GOOGLE_SITE_VERIFICATION || undefined,
  contactWebhookUrl: process.env.CONTACT_WEBHOOK_URL || undefined,
});
