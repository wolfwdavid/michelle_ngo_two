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
    }
  }
};

export default config;
