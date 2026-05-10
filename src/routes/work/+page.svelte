<!-- repo/src/routes/work/+page.svelte -->
<!-- WORK-01 / WORK-05 driver. D-09 composition: h1 + WorkGrid (no intro copy). -->
<!-- D-13 edge-bleed container: padding-inline matching page gutter rhythm. -->
<script lang="ts">
	import WorkGrid from '$lib/components/WorkGrid.svelte';
	import { projects } from '$lib/content';
</script>

<svelte:head>
	<title>Work — Michelle Ngo</title>
</svelte:head>

<section class="work-index">
	<h1>WORK</h1>
	<!-- D-13 edge-bleed wrapper — padding-inline matches the page gutter rhythm -->
	<!-- so card grid columns align with the rest of the page chrome. -->
	<div class="grid-wrapper">
		<WorkGrid {projects} />
	</div>
</section>

<style>
	.work-index {
		padding: var(--space-5) 0;
	}
	h1 {
		font-family: var(--font-display);
		font-weight: 700;
		font-variation-settings: 'opsz' 144;
		font-size: var(--type-h1);
		letter-spacing: -0.01em;
		text-transform: uppercase;
		margin: 0 var(--space-4) var(--space-5);
	}
	/* D-13 edge-bleed container */
	.grid-wrapper {
		padding-inline: var(--space-4);
	}
	@media (min-width: 768px) {
		.grid-wrapper {
			padding-inline: var(--space-5);
		}
		h1 {
			margin: 0 var(--space-5) var(--space-5);
		}
	}
</style>
