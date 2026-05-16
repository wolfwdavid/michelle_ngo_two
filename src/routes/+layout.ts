// repo/src/routes/+layout.ts
export const prerender = true;
export const trailingSlash = 'always';

/**
 * Returns the current pathname so +layout.svelte can key the page-fade
 * transition on `data.url` (NOT $page.url.pathname — see RESEARCH Pitfall 1:
 * the $page store updates AFTER the slot is replaced, so the transition
 * fires too late). The data flows top-down with navigation, so the new
 * value arrives BEFORE the slot swaps.
 */
export function load({ url }: { url: URL }) {
  return { url: url.pathname };
}
