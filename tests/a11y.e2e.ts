// repo/tests/a11y.e2e.ts
// A11Y-07 gate (D-10 from 05-CONTEXT.md). Runs @axe-core/playwright against
// all 7 routes; fails the test if ANY route has a serious or critical violation.
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
	'/contact/',
	'/404/' // Phase 6 CI-03: prerendered branded 404 from Phase 5 D-18; goto resolves to /michelle_ngo_two/404/ via baseURL trailing-slash convention
];

for (const route of ROUTES) {
	test(`a11y — ${route} has zero serious or critical axe violations`, async ({ page }) => {
		// Strip leading slash so the path resolves relative to baseURL's
		// /michelle_ngo_two/ prefix instead of replacing it.
		const relativePath = route.replace(/^\//, '');
		const response = await page.goto(relativePath);
		// Sanity: the route loaded successfully (not a 404 from the preview server).
		expect(response?.status(), `goto(${route}) returned ${response?.status()}`).toBeLessThan(400);

		// Plan 05-08 a11y-test settle window: the ScrollReveal always-render-with-
		// opacity refactor (Plan 05-08) drives a 180ms CSS opacity/transform
		// transition on IntersectionObserver entry. Axe-core's color-contrast
		// rule computes the EFFECTIVE blended color of every element, including
		// any sub-1 opacity contributed by ancestor `.reveal-target` mid-
		// transition — which produces false-positive color-contrast violations
		// while the page is still settling (e.g. `--color-grey-500: #5A5851`
		// has contrast 6.41:1 at final-state opacity but interpolates to ~4.48:1
		// at α ≈ 0.7). Established a11y-test best practice (axe-core docs:
		// "Wait for any animations or transitions to complete before running
		// axe") — wait the transition duration plus a small buffer so axe scans
		// stable computed colors. 400ms safely covers 180ms + reveal-action
		// observer fire latency on the slowest worker.
		await page.waitForTimeout(400);

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
