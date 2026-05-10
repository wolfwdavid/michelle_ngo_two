// Phase 4 Plan 04-01 (RESEARCH §3 / Pitfall 5):
// TypeScript 6 + moduleResolution: 'bundler' resolves real files on disk
// before consulting ambient `declare module '*.md'` wildcards. The ambient
// declaration in src/app.d.ts documents the runtime contract for ALL .md
// imports; this sidecar makes svelte-check + tsc compile-time happy for
// THIS specific import in $lib/content.ts.
import type { SvelteComponent } from 'svelte';
export default class Comp extends SvelteComponent {}
export const metadata: Record<string, unknown>;
