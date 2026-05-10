// repo/src/lib/seo.ts
// Centralized SEO helpers. svelte-meta-tags titleTemplate does NOT cascade
// across MetaTags instances (RESEARCH Pitfall 3) — every per-route MetaTags
// must repeat titleTemplate. Importing TITLE_TEMPLATE from here keeps the
// string literal DRY across all routes.
import { base } from '$app/paths';

export const SITE_ORIGIN = 'https://wolfwdavid.github.io';
export const TITLE_TEMPLATE = '%s — Michelle Ngo';

/**
 * Build an absolute URL for OG / canonical / JSON-LD use.
 * `path` should start with '/' (e.g. '/about/'). The kit.paths.base prefix
 * (/michelle_ngo_two) is added automatically.
 */
export function absoluteUrl(path: string): string {
	return `${SITE_ORIGIN}${base}${path}`;
}
