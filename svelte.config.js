// repo/svelte.config.js
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Order matters: mdsvex transforms .md → Svelte source FIRST,
  // then vitePreprocess handles TypeScript / SCSS in <script>/<style> blocks.
  // Reversed order means vitePreprocess sees raw markdown and breaks.
  preprocess: [
    mdsvex({ extensions: ['.md'] }),
    vitePreprocess()
  ],
  // SvelteKit must know to compile .md files as routes/components.
  // CRITICAL: do NOT pass '.svelte' to mdsvex itself — that breaks Svelte 5
  // templates with `</p> attempted to close an element that was not open`
  // errors (mdsvex issue #685).
  extensions: ['.svelte', '.md'],
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: '404.html',
      precompress: false,
      strict: true
    }),
    paths: {
      base: process.argv.includes('dev') ? '' : (process.env.BASE_PATH ?? '')
    },
    // Phase 3 Wave 2: Nav.svelte links to /work/, /about/, /press/, /contact/
    // — those routes are scaffolded in Phase 4. Until then, the prerenderer
    // follows the links and would 404. 'warn' lets the build continue while
    // surfacing the issue. Phase 4 adds the routes, after which 'fail' (or
    // omitting this option) becomes correct again.
    prerender: {
      handleHttpError: 'warn',
      handleMissingId: 'warn'
    }
  }
};

export default config;
