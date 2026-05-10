// repo/src/routes/press/+page.ts
// PRSS-01 conditional rendering. D-02 commits to >=6 link-verified items, but
// a defensive guard is shipped per CONTEXT.md "Claude's Discretion".
// Per RESEARCH Anti-Patterns: NEVER raise an error at build time; redirect cleanly.
import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';
import { pressVisible } from '$lib/content';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	// PRSS-01: if press footprint is below 6 link-verified items, fold into
	// ABOUT-04 Selected Recognition by redirecting to /about/. The Nav also
	// hides the Press link in this case (Plan 04-05 wires pressVisible into Nav).
	if (!pressVisible) {
		redirect(307, `${base}/about/`);
	}
	// Otherwise, render normally — +page.svelte composes the editorial banner +
	// PressList. press + projects + siteHeadshot are imported in +page.svelte.
	return {};
};

// PRODUCTION CASE (D-02 commits >=6 link-verified press items): pressVisible
// evaluates TRUE, this load() returns {}, and /press/+page.svelte prerenders
// normally as build/press/index.html.
//
// DEFENSIVE PATH (pressVisible === false): the redirect() call is intercepted
// by adapter-static during prerender. The exact build artifact behavior is
// verified manually as a HUMAN-UAT item — see this plan's manual_verification
// frontmatter (HUMAN-UAT-04-04-01). The adapter-static handling of build-time
// redirects is the source of truth and is checked by the deferred manual UAT,
// not encoded in this comment.
//
// prerender = true is INHERITED from +layout.ts.
