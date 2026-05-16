// repo/src/routes/_dev/components/+page.ts
// Dev-only component gallery route (D-22).
//
// CRITICAL: `prerender` MUST be a LITERAL boolean for SvelteKit static
// evaluation. Phase 2 STATE Pitfall 2 hit and resolved: the literal `false`
// is identical in dev (route is served live) and in build (adapter-static
// omits it; fallback: '404.html' serves the 404 shell if anyone hits the
// URL in production). Same pattern as /_debug/+page.ts.
export const prerender = false;
export const ssr = true;
