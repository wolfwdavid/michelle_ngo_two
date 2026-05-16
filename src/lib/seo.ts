// repo/src/lib/seo.ts
// Centralized SEO helpers. svelte-meta-tags titleTemplate does NOT cascade
// across MetaTags instances (RESEARCH Pitfall 3) — every per-route MetaTags
// must repeat titleTemplate. Importing TITLE_TEMPLATE from here keeps the
// string literal DRY across all routes.
//
// Rule 1 bug fix during Plan 05-04 Task 1: do NOT use `base` from `$app/paths`
// for absolute SEO URLs. SvelteKit defaults to paths.relative=true, which makes
// `base` render as a relative-path token (`.`, `..`, `../..`) baked into the
// prerendered HTML — yielding malformed absolute URLs like
// `https://wolfwdavid.github.io../../og-default.png`. svelte-meta-tags
// serializes OG/canonical strings VERBATIM, so we need the literal absolute
// base path here. Read it from the SAME source as svelte.config.js
// (process.env.BASE_PATH); this runs in Node at SSR/prerender time so the
// resulting absolute URLs are baked into the static HTML.

export const SITE_ORIGIN = 'https://wolfwdavid.github.io';
export const TITLE_TEMPLATE = '%s — Michelle Ngo';

/**
 * The configured base path (e.g. '/michelle_ngo_two'). Mirrors the value
 * svelte.config.js feeds into kit.paths.base. Used for absolute URL
 * composition only — internal links continue to use `base` from $app/paths.
 */
const ABSOLUTE_BASE = process.env.BASE_PATH ?? '';

/**
 * Build an absolute URL for OG / canonical / JSON-LD use.
 * `path` should start with '/' (e.g. '/about/'). The kit.paths.base prefix
 * is added automatically (read from process.env.BASE_PATH at build time).
 */
export function absoluteUrl(path: string): string {
	return `${SITE_ORIGIN}${ABSOLUTE_BASE}${path}`;
}
