<!-- repo/src/lib/components/ProjectCard.svelte -->
<!-- D-14 variable aspect + D-15 info-below-poster layout. -->
<!-- Wraps LiteVideo (Wave 1) in card mode → click navigates to detail. -->
<script lang="ts">
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import type { ProjectRecord } from '$lib/content';
	import LiteVideo from './LiteVideo.svelte';

	type Props = { project: ProjectRecord };
	let { project }: Props = $props();

	// XOR enforced upstream by Phase 2 schema; one of vimeoId/youtubeId is set.
	// $derived so swapping `project` at runtime (e.g. parent re-binding) keeps
	// provider/videoId in sync — Svelte 5 warns on plain `const` reads of $props
	// values because they would otherwise stale on prop change.
	const provider = $derived<'vimeo' | 'youtube'>(project.vimeoId ? 'vimeo' : 'youtube');
	const videoId = $derived<string>((project.vimeoId ?? project.youtubeId)!);

	function navigateToDetail(): void {
		// SvelteKit SPA navigation; honors the page-fade transition (POLI-03).
		goto(`${base}/work/${project.slug}/`);
	}
</script>

<article class="card">
	<LiteVideo
		{provider}
		id={videoId}
		poster={project.posterImage}
		title={project.title}
		mode="card"
		oncardclick={navigateToDetail}
	/>
	<div class="info">
		<h3 class="title">{project.title}</h3>
		<div class="row">
			{#each project.role as r}
				<span class="chip chip--role">{r.charAt(0).toUpperCase() + r.slice(1)}</span>
			{/each}
			<span class="year">{project.year}</span>
			{#if project.format !== 'other'}
				<span class="chip chip--format">{project.format}</span>
			{/if}
		</div>
	</div>
</article>

<style>
	.card {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}
	/* D-14 / Pitfall 5: do NOT set aspect-ratio or object-fit on the poster. */
	/* enhanced-img bakes width/height attributes; the card adapts to the */
	/* native poster ratio. */
	.info {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}
	.title {
		font-family: var(--font-display);
		font-weight: 700;
		font-variation-settings: 'opsz' 144;
		font-size: var(--type-h3);
		line-height: 1.15;
		margin: 0;
	}
	.row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--type-caption);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}
	.chip {
		display: inline-block;
		padding: 0.15em 0.6em;
		border: 1px solid var(--color-grey-300);
		border-radius: var(--radius-sm);
	}
	.chip--role { color: var(--color-ink); }
	.chip--format { color: var(--color-grey-500); }
	.year { color: var(--color-grey-500); }
</style>
