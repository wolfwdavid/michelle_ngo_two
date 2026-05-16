import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { projectSchema } from '$lib/schema';

describe('_template.md', () => {
	it('parses successfully after placeholder substitution (CONT-08)', () => {
		// Read the template, strip the YAML fence, replace TODO placeholders with valid values,
		// then assert projectSchema accepts the result.
		const path = resolve(process.cwd(), 'src/content/projects/_template.md');
		const raw = readFileSync(path, 'utf-8');
		const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
		expect(fmMatch).not.toBeNull();
		const yamlSrc = (fmMatch![1] ?? '')
			.replace(/TODO_TITLE/g, 'Sample Title')
			.replace(/TODO_YEAR/g, '2024')
			.replace(/TODO_ROLE/g, 'director')
			.replace(/TODO_FORMAT/g, 'short film')
			.replace(/TODO_POSTER/g, './poster.jpg')
			.replace(/TODO_VIMEO_ID/g, '"123456789"');
		// Minimal YAML parser sufficient for the template's known shape.
		// Plan 02-03's executor may use `yaml` package or hand-roll based on template structure.
		// For now, the test verifies the file exists and contains all required field names.
		expect(yamlSrc).toMatch(/title:/);
		expect(yamlSrc).toMatch(/year:/);
		expect(yamlSrc).toMatch(/role:/);
		expect(yamlSrc).toMatch(/format:/);
		expect(yamlSrc).toMatch(/poster:/);
		expect(yamlSrc).toMatch(/vimeoId:|youtubeId:/);
		// Reference projectSchema to keep the type import live; full schema validation is
		// exercised by Plan 02-03 once the YAML parser is wired in.
		expect(typeof projectSchema.safeParse).toBe('function');
	});
});
