// repo/tests/a11y.e2e.ts
// A11Y-07 gate (D-10 from 05-CONTEXT.md). Runs @axe-core/playwright against
// all 6 routes; fails the test if ANY route has a serious or critical violation.
//
// REQUIREMENTS A11Y-07 spec literal: "axe-core CI run reports zero serious or
// critical violations on every page." We filter on impact === 'serious' || 'critical'
// to honor the spec — moderate / minor violations are noise on real-world pages
// (e.g., "consider higher contrast") and would make the gate too sensitive.
//
// Pre-req from Plan 05-00 (corrected in 05-07): playwright.config.ts has
//   use: { baseURL: 'http://localhost:4173/michelle_ngo_two/' }  // trailing slash
// and tests use paths WITHOUT a leading slash. Per Playwright's URL resolution
// (new URL(path, baseURL)), a leading-slash path replaces baseURL's path entirely
// (stripping the /michelle_ngo_two prefix); paths without a leading slash compose
// correctly. The ROUTES table below carries the human-readable path for the test
// title; we strip the leading slash before goto() so display + resolution agree.

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const ROUTES: ReadonlyArray<string> = [
	'/',
	'/work/',
	'/work/pbs-american-portrait/',
	'/about/',
	'/press/',
	'/contact/'
];

for (const route of ROUTES) {
	test(`a11y — ${route} has zero serious or critical axe violations`, async ({ page }) => {
		// Strip leading slash so the path resolves relative to baseURL's
		// /michelle_ngo_two/ prefix instead of replacing it.
		const relativePath = route.replace(/^\//, '');
		const response = await page.goto(relativePath);
		// Sanity: the route loaded successfully (not a 404 from the preview server).
		expect(response?.status(), `goto(${route}) returned ${response?.status()}`).toBeLessThan(400);

		const results = await new AxeBuilder({ page }).analyze();
		const blockers = results.violations.filter(
			(v) => v.impact === 'serious' || v.impact === 'critical'
		);

		if (blockers.length > 0) {
			// Console output makes CI logs actionable — the impact + help URL points to the fix.
			// eslint-disable-next-line no-console
			console.log(
				`\n[a11y] Blocking violations on ${route}:\n` +
					blockers
						.map(
							(v) =>
								`  - [${v.impact}] ${v.id}: ${v.help}\n` +
								`    ${v.helpUrl}\n` +
								`    Affected nodes: ${v.nodes.length}`
						)
						.join('\n\n')
			);
		}
		expect(blockers).toEqual([]);
	});
}
