import { describe, it, expect } from 'vitest';
import { parseProject, parseFrontmatter, getProjectSlugs, formatCredits } from '$lib/content';
import {
	refineFeaturedProjectIsUnique,
	refinePressProjectFK,
	type Project,
	type PressItem
} from '$lib/schema';

describe('parseProject', () => {
	it('succeeds on valid-vimeo fixture metadata', () => {
		const mod = {
			metadata: {
				title: 'Test Vimeo Project',
				year: 2024,
				role: ['director', 'writer'],
				format: 'short film',
				poster: './poster.jpg',
				vimeoId: '123456789'
			},
			default: (() => null) as never
		};
		// parseProject signature: (path, mod) => ProjectRecord
		// Note: parseProject calls posterFor which requires a real poster file under
		// /src/lib/__fixtures__/projects/<slug>/poster.{ext}. Plan 02-02 will either
		// (a) factor parseProject so the test can pass a synthetic posterImage, or
		// (b) place a 1x1 poster.jpg in each fixture folder. This test stub is the
		// contract; implementation chooses.
		const path = '/src/lib/__fixtures__/projects/valid-vimeo/index.md';
		// Implementation may need to expose a parseFrontmatter() that doesn't resolve poster.
		expect(() => parseFrontmatter(path, mod.metadata)).not.toThrow();
		const result = parseFrontmatter(path, mod.metadata);
		expect(result.title).toBe('Test Vimeo Project');
	});
});

describe('refineFeaturedProjectIsUnique', () => {
	const base: Project = {
		title: 't',
		year: 2024,
		role: ['director'],
		format: 'short film',
		poster: './p.jpg',
		vimeoId: '1',
		featured: false,
		weight: 0
	} as Project;

	it('throws when zero projects are featured', () => {
		expect(() => refineFeaturedProjectIsUnique([base, base])).toThrow();
	});

	it('throws when more than one project is featured', () => {
		const a = { ...base, featured: true };
		const b = { ...base, featured: true };
		expect(() => refineFeaturedProjectIsUnique([a, b])).toThrow();
	});

	it('passes when exactly one project is featured', () => {
		const a = { ...base, featured: true };
		const b = { ...base };
		expect(() => refineFeaturedProjectIsUnique([a, b])).not.toThrow();
	});
});

describe('refinePressProjectFK', () => {
	it('throws when press item references unknown slug', () => {
		const items: PressItem[] = [
			{
				publication: 'P',
				headline: 'H',
				date: '2024-01-01',
				link: 'https://x.example',
				project: 'unknown-slug'
			}
		];
		expect(() => refinePressProjectFK(items, new Set(['known-slug']))).toThrow();
	});

	it('passes when press item references known slug', () => {
		const items: PressItem[] = [
			{
				publication: 'P',
				headline: 'H',
				date: '2024-01-01',
				link: 'https://x.example',
				project: 'known-slug'
			}
		];
		expect(() => refinePressProjectFK(items, new Set(['known-slug']))).not.toThrow();
	});

	it('passes when press item has no project FK', () => {
		const items: PressItem[] = [
			{ publication: 'P', headline: 'H', date: '2024-01-01', link: 'https://x.example' }
		];
		expect(() => refinePressProjectFK(items, new Set(['known-slug']))).not.toThrow();
	});
});

describe('getProjectSlugs', () => {
	it('returns an array of strings', () => {
		const slugs = getProjectSlugs();
		expect(Array.isArray(slugs)).toBe(true);
		slugs.forEach((s) => expect(typeof s).toBe('string'));
	});
});

describe('formatCredits', () => {
	it('returns empty array for undefined credits', () => {
		expect(formatCredits(undefined)).toEqual([]);
	});

	it('formats credits as "role: name" strings', () => {
		const result = formatCredits({ cinematographer: 'Jane', editor: 'John' });
		expect(result).toContain('cinematographer: Jane');
		expect(result).toContain('editor: John');
	});
});
