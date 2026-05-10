// repo/src/routes/work/[slug]/+page.ts
// WORK-03 driver. RESEARCH Pattern 2: dynamic-route prerendering via entries().
// adapter-static needs to know every slug at build time.
import { error } from '@sveltejs/kit';
import { projects } from '$lib/content';
import type { PageLoad } from './$types';

/**
 * Tells the prerenderer to generate one HTML per project at build time.
 * Sync return is sufficient — $lib/content is eager-loaded at module init,
 * so projects[] is already populated.
 */
export function entries(): Array<{ slug: string }> {
	return projects.map((p) => ({ slug: p.slug }));
}

// prerender = true is INHERITED from +layout.ts (Phase 1 INFR-07). Do NOT re-export.

/**
 * Look up the project by slug. error(404, ...) if unknown — defensive guard
 * since entries() should keep this code path slug-bounded, but the throw
 * also surfaces a clear error if anyone deep-links a stale URL post-launch.
 */
export const load: PageLoad = ({ params }) => {
	const project = projects.find((p) => p.slug === params.slug);
	if (!project) {
		error(404, `Project not found: ${params.slug}`);
	}
	return { project };
};
