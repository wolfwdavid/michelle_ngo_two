<!-- repo/src/lib/components/WorkGrid.svelte -->
<!-- D-13 explicit breakpoint columns: 1 / 2 / 3 across <768 / >=768 / >=1024. -->
<script lang="ts">
	import type { ProjectRecord } from '$lib/content';
	import ProjectCard from './ProjectCard.svelte';

	type Props = { projects: readonly ProjectRecord[] };
	let { projects }: Props = $props();
</script>

<ul class="grid">
	{#each projects as project (project.slug)}
		<li><ProjectCard {project} /></li>
	{/each}
</ul>

<style>
	.grid {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: 1fr;          /* mobile: 1 col (D-13) */
		gap: var(--space-4);
	}
	@media (min-width: 768px) {
		.grid {
			grid-template-columns: 1fr 1fr;    /* tablet: 2 col */
			gap: var(--space-5);
		}
	}
	@media (min-width: 1024px) {
		.grid {
			grid-template-columns: 1fr 1fr 1fr; /* desktop: 3 col */
		}
	}
</style>
