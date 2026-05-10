// repo/src/lib/previews.ts
// POLI-01 build-time slug detection (D-02 corrected per RESEARCH §Pattern 7).
// Vite globs static/previews/*.mp4 at build time; the resulting Set of slugs
// is what ProjectCard.svelte checks before rendering the hover-loop layer.
//
// Per RESEARCH §Pattern 7 note 5: convention-by-presence beats schema-field-
// source-of-truth here. Authors drop a clip at static/previews/<slug>.mp4 —
// no schema migration needed; Plan 05-06 adds infrastructure, content
// authoring (per-slug clips) lands incrementally as the user produces them.
//
// IMPORTANT: this file must run cleanly even when static/previews/ is empty —
// Vite's eager glob returns an empty object for no matches; we coerce to a Set.

const previewModules = import.meta.glob('/static/previews/*.mp4', {
	query: '?url',
	import: 'default',
	eager: true
});

/**
 * Set of project slugs that have a hover-preview clip at static/previews/<slug>.mp4.
 * Built at module load (Vite glob is eager). ProjectCard.svelte uses
 * `previewSlugs.has(project.slug)` to decide whether to render the hover layer.
 */
export const previewSlugs: ReadonlySet<string> = new Set(
	Object.keys(previewModules)
		.map((path) => {
			// path is like '/static/previews/pbs-american-portrait.mp4'
			const m = path.match(/\/static\/previews\/([^/]+)\.mp4$/);
			return m?.[1] ?? '';
		})
		.filter((s) => s.length > 0)
);
