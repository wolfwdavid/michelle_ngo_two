import { expect, test } from '@playwright/test';

test('has expected h1', async ({ page }) => {
	// Paths must NOT start with '/' — baseURL is 'http://localhost:4173/michelle_ngo_two/'
	// and a leading slash would replace the /michelle_ngo_two prefix in the URL
	// resolver. Trailing slash matters: adapter-static produces demo/playwright/index.html
	// and trailingSlash redirects strip the URL after navigation if absent. See
	// tests/a11y.e2e.ts for the same convention.
	await page.goto('demo/playwright/');
	await expect(page.locator('h1')).toBeVisible();
});
