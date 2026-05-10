import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: { command: 'npm run build && npm run preview', port: 4173 },
	testMatch: '**/*.e2e.{ts,js}',
	use: {
		// RESEARCH §Pitfall 7: kit.paths.base = '/michelle_ngo_two' means the
		// preview server serves the app under that prefix; bare '/' is empty.
		// page.goto('/') in tests then resolves to the app root.
		baseURL: 'http://localhost:4173/michelle_ngo_two'
	}
});
