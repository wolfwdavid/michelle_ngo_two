// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

// Phase 4 Plan 04-01 (RESEARCH §3 / Pitfall 5):
// mdsvex compiles every imported .md file into a Svelte component class.
// Without this ambient declaration, TypeScript reports `Cannot find module '...bio.md'`
// at the import site even though Vite + mdsvex resolve the file at build time.
declare module '*.md' {
	import type { SvelteComponent } from 'svelte';
	export default class Comp extends SvelteComponent {}
	export const metadata: Record<string, unknown>;
}

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
