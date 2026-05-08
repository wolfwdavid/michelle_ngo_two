// repo/src/routes/_debug/+page.ts
// Dev-only content inspector route (D-20 / CONT-03).
//
// CRITICAL: `prerender` MUST be a LITERAL boolean for SvelteKit static evaluation.
// Do NOT write a non-literal expression (e.g. negating a build-mode flag) — that forces
// dynamic module load at build time (Pitfall 2 in RESEARCH.md). The literal `false` is
// identical in dev (route is served live) and in build (route is omitted from prerender
// output; adapter-static's fallback: '404.html' serves the 404 shell if anyone hits the
// URL in production).
//
// ssr = true is the default but explicit here to make the contract clear: even
// though we don't prerender, we DO server-render in dev so the indexer runs.

export const prerender = false;
export const ssr = true;
