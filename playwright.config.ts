import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173,
		// kit.paths.base = '/michelle_ngo_two' must be set for BOTH build and preview
		// so the preview server serves the app under that URL prefix. On Windows Git
		// Bash, MSYS path-conversion mangles the leading slash of BASE_PATH unless
		// MSYS_NO_PATHCONV=1 is set; passing both through the env block here makes
		// the test runner self-sufficient regardless of the shell that invokes
		// `npm run test:e2e` (CI Linux runners ignore MSYS_NO_PATHCONV).
		env: {
			BASE_PATH: '/michelle_ngo_two',
			MSYS_NO_PATHCONV: '1'
		}
	},
	testMatch: '**/*.e2e.{ts,js}',
	use: {
		// RESEARCH §Pitfall 7: kit.paths.base = '/michelle_ngo_two' means the
		// preview server serves the app under that URL prefix. The trailing
		// slash is required so test paths without a leading slash (e.g.
		// 'work/' instead of '/work/') compose via the URL constructor as
		// new URL('work/', baseURL) = http://localhost:4173/michelle_ngo_two/work/.
		// A leading-slash test path would replace baseURL's path entirely, stripping
		// the base prefix and 404'ing every non-root route.
		baseURL: 'http://localhost:4173/michelle_ngo_two/'
	}
});
