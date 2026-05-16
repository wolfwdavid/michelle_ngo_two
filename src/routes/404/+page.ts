// repo/src/routes/404/+page.ts
// LITERAL prerender = true (matches Phase 2 Pitfall 2 inverse pattern — adapter-static
// strict mode evaluates page-options as static literals, NOT runtime expressions).
// Required so this route prerenders to build/404/index.html (and possibly build/404.html
// — adapter-static behavior depends on coexistence with the existing fallback: '404.html'
// setting; verification step confirms).
export const prerender = true;
