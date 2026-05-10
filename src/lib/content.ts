// repo/src/lib/content.ts
// SINGLE CONTENT BOUNDARY (D-13).
// Routes import from this module: `import { projects, press, site } from '$lib/content'`.
// Routes MUST NOT call import.meta.glob against src/content/ — enforced by
// repo/scripts/check-content-boundary.sh.
//
// All validation runs at module load: Vite executes this file as part of the
// build (and once per dev session). Zod failures throw → Vite surfaces the
// error in the build/dev log with the file path.

import {
	projectSchema,
	pressItemSchema,
	siteSchema,
	refineFeaturedProjectIsUnique,
	refinePressProjectFK,
	type Project,
	type PressItem,
	type Site
} from './schema';
import pressJson from '../content/press.json';
import siteJson from '../content/site.json';
// Phase 4 D-15 / D-20 / RESEARCH §3:
// mdsvex-compiled bio component. RELATIVE path because $lib resolves to
// repo/src/lib/, not repo/src/content/ — see RESEARCH Pitfall 5.
import Bio from '../content/bio.md';

// --- Module shape that mdsvex emits for every .md file imported via Vite ---
type MdModule = {
	metadata: Record<string, unknown>;
	default: import('svelte').ComponentType;
};

// --- Image module shape from import.meta.glob with `?enhanced` query ---
export type EnhancedImage = {
	sources: { avif?: string; webp?: string; png?: string; jpeg?: string };
	img: { src: string; w: number; h: number };
};

// --- Eager-glob: every project markdown, validated at module load ---
// The pattern `*/index.md` requires depth-2 — `_template.md` at depth 1 is
// naturally excluded.
const projectModules = import.meta.glob<MdModule>(
	'/src/content/projects/*/index.md',
	{ eager: true }
);

// Second glob for posters by convention (Pattern 5). The poster field in
// frontmatter is informational; the indexer finds the actual file by extension.
const posterModules = import.meta.glob<EnhancedImage>(
	'/src/content/projects/*/poster.{avif,gif,jpg,jpeg,png,webp}',
	{ query: { enhanced: true }, import: 'default', eager: true }
);

// Phase 4 D-17 / RESEARCH §4:
// Vite-resolved EnhancedImage for the headshot. Convention path
// /src/content/headshot.{ext}; enhanced-img produces srcset + AVIF/WebP +
// baked dimensions (CLS prevention). Same idiom as posterModules above.
const headshotModules = import.meta.glob<EnhancedImage>(
	'/src/content/headshot.{avif,gif,jpg,jpeg,png,webp}',
	{ query: { enhanced: true }, import: 'default', eager: true }
);

// Slug regex accepts both the production path AND the __fixtures__ path
// so unit tests can exercise the helpers without sitting in src/content/.
// Production glob is rooted at `/src/content/projects/*/index.md` so fixture
// paths never land in `projectModules` at runtime — the relaxation is
// testing-only and harmless.
function slugFromPath(path: string): string {
	const m = path.match(
		/\/(?:src\/content|src\/lib\/__fixtures__)\/projects\/([^/]+)\/index\.md$/
	);
	if (!m || !m[1]) throw new Error(`Cannot extract slug from "${path}"`);
	return m[1];
}

function posterFor(slug: string): EnhancedImage {
	// Convention: the poster lives at /src/content/projects/<slug>/poster.{ext}.
	// Frontmatter `poster:` is informational only — indexer resolves by file system.
	const candidates = Object.entries(posterModules).filter(([p]) =>
		p.startsWith(`/src/content/projects/${slug}/poster.`)
	);
	if (candidates.length === 0) {
		throw new Error(
			`No poster found for project "${slug}". ` +
				`Expected /src/content/projects/${slug}/poster.{avif,gif,jpg,jpeg,png,webp}`
		);
	}
	if (candidates.length > 1) {
		throw new Error(
			`Multiple posters for project "${slug}": ${candidates
				.map(([p]) => p)
				.join(', ')}. Keep exactly one.`
		);
	}
	const first = candidates[0];
	if (!first) {
		// Unreachable — length checked above. Narrows for noUncheckedIndexedAccess.
		throw new Error(`No poster candidate for project "${slug}" (unreachable)`);
	}
	return first[1];
}

// Type augmentation: project + slug + resolved poster + compiled body component
export type ProjectRecord = Project & {
	slug: string;
	posterImage: EnhancedImage;
	Body: import('svelte').ComponentType;
};

/**
 * Validate raw frontmatter against projectSchema. Pure — no IO, no glob.
 * Exported for unit testing without poster file requirements.
 */
export function parseFrontmatter(
	path: string,
	metadata: Record<string, unknown>
): Project {
	const result = projectSchema.safeParse(metadata);
	if (!result.success) {
		const issues = result.error.issues
			.map((i) => `  - ${i.path.join('.') || '(root)'}: ${i.message}`)
			.join('\n');
		throw new Error(`Invalid project frontmatter in ${path}:\n${issues}`);
	}
	return result.data;
}

/**
 * Parse a single project from a (path, MdModule) pair, including poster resolution.
 * Used by the production glob; tests use parseFrontmatter to sidestep posters.
 */
export function parseProject(path: string, mod: MdModule): ProjectRecord {
	const slug = slugFromPath(path);
	const project = parseFrontmatter(path, mod.metadata);
	return {
		...project,
		slug,
		posterImage: posterFor(slug),
		Body: mod.default
	};
}

// --- Build the projects array, sort by weight DESC, year DESC ---
const rawProjects: ProjectRecord[] = Object.entries(projectModules)
	// Defensive: skip _template.md if anyone ever moves it under a folder.
	.filter(([path]) => !path.endsWith('/_template.md'))
	.map(([path, mod]) => parseProject(path, mod));

// Cross-record validation: featured uniqueness.
//
// Phase 2 softening (D-16: minimum-count enforcement is SOFT during Phase 2):
// Skip the featured-uniqueness check if there are zero projects, since the
// empty `src/content/projects/` skeleton would otherwise fail the build at
// module load before any real seeding has happened. Once Plan 02-05 seeds
// real projects, the standard Pattern 3 check applies.
if (rawProjects.length > 0) {
	refineFeaturedProjectIsUnique(rawProjects);
}

// Sort: weight DESC primary, year DESC tiebreak (D-06).
const projects: ReadonlyArray<ProjectRecord> = rawProjects.sort((a, b) => {
	if (a.weight !== b.weight) return b.weight - a.weight;
	return b.year - a.year;
});

// --- Press: validated array, FK-checked against project slugs ---
const pressParse = pressItemSchema.array().safeParse(pressJson);
if (!pressParse.success) {
	const issues = pressParse.error.issues
		.map((i) => `  - press[${i.path.join('.') || '?'}]: ${i.message}`)
		.join('\n');
	throw new Error(`Invalid src/content/press.json:\n${issues}`);
}
const press: ReadonlyArray<PressItem> = pressParse.data;

// FK refinement (D-10).
const projectSlugs = new Set(projects.map((p) => p.slug));
refinePressProjectFK([...press], projectSlugs);

// --- Site: validated object ---
const siteParse = siteSchema.safeParse(siteJson);
if (!siteParse.success) {
	const issues = siteParse.error.issues
		.map((i) => `  - site.${i.path.join('.') || '(root)'}: ${i.message}`)
		.join('\n');
	throw new Error(`Invalid src/content/site.json:\n${issues}`);
}
const site: Site = siteParse.data;

// --- Helpers (named in CLAUDE.md tech-stack table; tested in content.test.ts) ---

/** Returns the slug of every indexed project. */
export function getProjectSlugs(): string[] {
	return projects.map((p) => p.slug);
}

/**
 * Format a credits record into "role: name" strings for template rendering.
 * Returns [] if credits is undefined (matches Phase 4 template expectations).
 */
export function formatCredits(credits: Record<string, string> | undefined): string[] {
	if (!credits) return [];
	return Object.entries(credits).map(([role, name]) => `${role}: ${name}`);
}

// ---- Phase 4 D-15 / D-20: bio.md as a Svelte ComponentType ----
// mdsvex compiles bio.md at build time; the default export IS the component.
// AboutSection consumes via: <svelte:component this={siteBio} /> or <Bio /> (capitalized const).
export const siteBio: import('svelte').ComponentType = Bio;

// ---- Phase 4 D-17 / RESEARCH §4: headshot Vite-resolved EnhancedImage ----
function resolveHeadshot(): EnhancedImage {
	const candidates = Object.values(headshotModules);
	if (candidates.length === 0) {
		throw new Error(
			'No headshot found at /src/content/headshot.{avif,gif,jpg,jpeg,png,webp}. ' +
				'Add the file or update src/content/site.json:headshot to point at the right path.'
		);
	}
	if (candidates.length > 1) {
		throw new Error('Multiple headshot files found — keep exactly one.');
	}
	return candidates[0]!;
}
export const siteHeadshot: EnhancedImage = resolveHeadshot();

// ---- Phase 4 D-21 / RESEARCH §5: adjacency helpers (WORK-04 driver) ----
/**
 * Returns the project immediately AFTER the given slug in the sorted
 * `projects` array (D-06 sort: weight DESC, year DESC).
 * Returns null if the slug is the last project OR if the slug is unknown.
 * D-11: chronological progression for industry-hirer scanning.
 */
export function getNextProject(slug: string): ProjectRecord | null {
	const i = projects.findIndex((p) => p.slug === slug);
	if (i === -1) return null; // unknown slug → null
	if (i >= projects.length - 1) return null; // last project → null
	return projects[i + 1] ?? null;
}

/**
 * Returns the project immediately BEFORE the given slug. Mirror of getNextProject.
 * Returns null if the slug is the first project OR if the slug is unknown.
 */
export function getPreviousProject(slug: string): ProjectRecord | null {
	const i = projects.findIndex((p) => p.slug === slug);
	if (i <= 0) return null; // unknown OR first project → null
	return projects[i - 1] ?? null;
}

// ---- Phase 4 D-02 / PRSS-01 / RESEARCH §5: pressVisible derived export ----
// Nav.svelte and /press/ defensive fallback both consume this.
// Hard-coded `true` placeholder in Phase 3 Nav.svelte gets replaced with
// this import in Plan 04-05.
export const pressVisible: boolean = press.length >= 6;

// --- Public exports (the only surface) ---
export { projects, press, site };
// Note: siteBio, siteHeadshot, getNextProject, getPreviousProject, pressVisible
// are exported inline above (each with its own `export` keyword).
