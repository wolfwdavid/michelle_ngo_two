// repo/src/lib/schema.ts
// Zod schemas for project frontmatter, press items, and site config.
// Validated at build time inside $lib/content.ts. Bad content fails the build
// with a file + field error pointer.
import { z } from 'zod';

// --- Atoms ---
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be ISO YYYY-MM-DD');
const url = z.string().url('Must be a valid URL');
const slug = z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters/digits/hyphens');

const role = z.enum(['director', 'producer', 'writer']);
const format = z.enum([
	'commercial',
	'short film',
	'feature',
	'music video',
	'documentary',
	'branded content',
	'other'
]);

// Vimeo IDs are numeric strings (must quote in YAML so YAML doesn't parse as number).
const vimeoId = z.string().regex(/^\d+$/, 'Vimeo ID must be a numeric string (quote it in YAML)');
// YouTube IDs are 11 characters, [A-Za-z0-9_-].
const youtubeId = z
	.string()
	.regex(/^[A-Za-z0-9_-]{11}$/, 'YouTube ID must be exactly 11 characters');

// --- Project (per-record schema; applied to each markdown frontmatter) ---
export const projectSchema = z
	.object({
		// Required
		title: z.string().min(1, 'title is required'),
		year: z
			.number()
			.int()
			.min(1990, 'year must be >= 1990')
			.max(new Date().getFullYear() + 1, 'year cannot be in the future beyond next year'),
		role: z.array(role).min(1, 'role[] must contain at least one role'),
		format: format,
		// Convention-based poster path is informational here (the indexer resolves posters
		// by file-system convention). String required so authors documenting in
		// _template.md still see the field. Indexer ignores its value.
		poster: z
			.string()
			.min(1, 'poster path required (informational; indexer resolves by convention)'),

		// Optional
		client: z.string().optional(),
		// credits is an object mapping role-key → name (e.g. { cinematographer: "Jane Doe" }).
		// Object shape chosen over flat array per Pattern 3 — easiest to bind in Phase 4 templates.
		credits: z.record(z.string(), z.string()).optional(),
		featured: z.boolean().default(false),
		weight: z.number().default(0),
		tagline: z.string().optional(),
		previewClip: z.string().optional(),

		// Video provider (XOR enforced via .refine below)
		vimeoId: vimeoId.optional(),
		youtubeId: youtubeId.optional()
	})
	// XOR: exactly one of vimeoId / youtubeId must be present.
	.refine((p) => (p.vimeoId ? 1 : 0) + (p.youtubeId ? 1 : 0) === 1, {
		message:
			'Project must have exactly one of vimeoId or youtubeId (D-03 XOR rule). Both or neither are invalid.',
		path: ['vimeoId']
	});

export type Project = z.infer<typeof projectSchema>;

// --- Press item ---
export const pressItemSchema = z.object({
	publication: z.string().min(1, 'publication is required'),
	headline: z.string().min(1, 'headline is required'),
	date: isoDate,
	link: url,
	// FK to project slug; cross-validated in refinePressProjectFK at indexer level
	project: slug.optional()
});
export type PressItem = z.infer<typeof pressItemSchema>;

// --- Site config ---
export const siteSchema = z.object({
	bio: z.string().min(1, 'bio is required'),
	headshot: z.string().min(1, 'headshot path required'),
	email: z.string().email('email must be a valid email address'),
	phone: z.string().min(1, 'phone is required'),
	resumePdf: z.string().min(1, 'resumePdf path required'),
	social: z.object({
		imdb: url,
		linkedin: url,
		vimeo: url,
		youtube: url
	})
});
export type Site = z.infer<typeof siteSchema>;

// --- Cross-record refinements (run AFTER per-record parse, inside indexer) ---

/**
 * Asserts exactly one project has featured: true.
 * D-06: featured is independent of sort and selects the hero project on the landing page.
 * Throws with a clear message naming the offending project titles.
 */
export function refineFeaturedProjectIsUnique(projects: Project[]): void {
	const featured = projects.filter((p) => p.featured);
	if (featured.length !== 1) {
		const titles = featured.map((p) => p.title).join(', ') || '(none)';
		throw new Error(
			`Exactly one project must have \`featured: true\`. Found ${featured.length}. ` +
				`Featured projects: ${titles}`
		);
	}
}

/**
 * Asserts every press item's `project` (if present) is a known slug.
 * D-10: cross-validation at indexer level since item-level Zod cannot see the project list.
 */
export function refinePressProjectFK(items: PressItem[], slugs: Set<string>): void {
	for (const [i, item] of items.entries()) {
		if (item.project && !slugs.has(item.project)) {
			throw new Error(
				`Press item ${i} ("${item.headline}") references project slug "${item.project}" ` +
					`which does not exist. Known slugs: ${[...slugs].sort().join(', ') || '(none)'}`
			);
		}
	}
}
