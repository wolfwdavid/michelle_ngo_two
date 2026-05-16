import { describe, it, expect } from 'vitest';
import { projectSchema, pressItemSchema, siteSchema } from '$lib/schema';
import pressGood from './__fixtures__/press-good.json';
import pressBad from './__fixtures__/press-bad-shape.json';
import siteGood from './__fixtures__/site-good.json';
import siteBad from './__fixtures__/site-bad-email.json';

describe('projectSchema', () => {
	it('rejects missing required field (title)', () => {
		const result = projectSchema.safeParse({
			year: 2024,
			role: ['director'],
			format: 'commercial',
			poster: './poster.jpg',
			vimeoId: '111111111'
		});
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues.some((i) => i.path.includes('title'))).toBe(true);
		}
	});

	it('rejects both video IDs (XOR violation)', () => {
		const result = projectSchema.safeParse({
			title: 'Both',
			year: 2024,
			role: ['director'],
			format: 'commercial',
			poster: './poster.jpg',
			vimeoId: '987654321',
			youtubeId: 'aBcDeFgHiJk'
		});
		expect(result.success).toBe(false);
	});

	it('rejects no video IDs (XOR violation)', () => {
		const result = projectSchema.safeParse({
			title: 'Neither',
			year: 2024,
			role: ['director'],
			format: 'commercial',
			poster: './poster.jpg'
		});
		expect(result.success).toBe(false);
	});

	it('accepts valid Vimeo project', () => {
		const result = projectSchema.safeParse({
			title: 'OK',
			year: 2024,
			role: ['director'],
			format: 'short film',
			poster: './poster.jpg',
			vimeoId: '123456789'
		});
		expect(result.success).toBe(true);
	});

	it('accepts valid YouTube project', () => {
		const result = projectSchema.safeParse({
			title: 'OK',
			year: 2024,
			role: ['producer'],
			format: 'music video',
			poster: './poster.jpg',
			youtubeId: 'dQw4w9WgXcQ'
		});
		expect(result.success).toBe(true);
	});

	it('rejects role values outside the literal union', () => {
		const result = projectSchema.safeParse({
			title: 'Bad role',
			year: 2024,
			role: ['cinematographer'],
			format: 'short film',
			poster: './poster.jpg',
			vimeoId: '123456789'
		});
		expect(result.success).toBe(false);
	});

	it('rejects format values outside the literal union', () => {
		const result = projectSchema.safeParse({
			title: 'Bad format',
			year: 2024,
			role: ['director'],
			format: 'web series',
			poster: './poster.jpg',
			vimeoId: '123456789'
		});
		expect(result.success).toBe(false);
	});
});

describe('pressItemSchema', () => {
	it('accepts good press items', () => {
		for (const item of pressGood) {
			const result = pressItemSchema.safeParse(item);
			expect(result.success).toBe(true);
		}
	});

	it('rejects bad press item shape (non-ISO date, non-URL link)', () => {
		const result = pressItemSchema.safeParse(pressBad[0]);
		expect(result.success).toBe(false);
	});
});

describe('siteSchema', () => {
	it('accepts good site config', () => {
		const result = siteSchema.safeParse(siteGood);
		expect(result.success).toBe(true);
	});

	it('rejects bad email', () => {
		const result = siteSchema.safeParse(siteBad);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues.some((i) => i.path.includes('email'))).toBe(true);
		}
	});
});
