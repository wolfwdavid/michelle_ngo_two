<!-- repo/src/lib/components/NotFoundPage.svelte -->
<!-- D-18 / SEO-05 / POLI-04: shared branded 404 component. -->
<!-- Mounted by both repo/src/routes/+error.svelte (in-app nav errors) AND -->
<!-- repo/src/routes/404/+page.svelte (prerendered for GH-Pages-served first paint). -->
<!-- Single source of truth — drift between the two paths impossible. -->
<!-- -->
<!-- Copy intent (CONTEXT Claude's Discretion): cinematic-warm, NOT snarky-tech. -->
<!-- "Lost on set" + "didn't make the final cut" reads as a director's vocabulary. -->
<script lang="ts">
	import { base } from '$app/paths';

	type Props = {
		/** Optional override message — +error.svelte passes page.error?.message; static 404 uses default. */
		message?: string;
	};
	let { message }: Props = $props();
</script>

<section class="error-page">
	<h1>404 — Lost on set.</h1>
	<p>{message ?? "Looks like this scene didn't make the final cut."}</p>
	<!-- D-20 base-path discipline carried — never hard-code /work/. -->
	<a class="back-link" href="{base}/work/">← Back to Work</a>
</section>

<style>
	.error-page {
		max-width: 600px;
		margin: 0 auto;
		padding: var(--space-7) var(--space-4);
		text-align: center;
	}
	.error-page h1 {
		font-family: var(--font-display);
		font-weight: 700;
		font-variation-settings: 'opsz' 144;
		font-size: var(--type-display);
		letter-spacing: -0.02em;
		line-height: 1.05;
		margin: 0 0 var(--space-3);
	}
	.error-page p {
		font-size: var(--type-body);
		color: var(--color-grey-500);
		margin: 0 0 var(--space-5);
	}
	.back-link {
		display: inline-block;
		padding: var(--space-2) var(--space-4);
		border: 1px solid var(--color-ink);
		text-decoration: none;
		color: var(--color-ink);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-size: var(--type-caption);
		transition:
			background-color 200ms var(--ease-out),
			color 200ms var(--ease-out);
	}
	.back-link:hover,
	.back-link:focus-visible {
		background: var(--color-ink);
		color: var(--color-bg);
	}
</style>
