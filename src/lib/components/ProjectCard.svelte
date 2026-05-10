<!-- repo/src/lib/components/ProjectCard.svelte -->
<!-- D-14 variable aspect + D-15 info-below-poster layout. -->
<!-- Wraps LiteVideo (Wave 1) in card mode → click navigates to detail. -->
<script lang="ts">
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { prefersReducedMotion } from 'svelte/motion';
	import type { ProjectRecord } from '$lib/content';
	import { previewSlugs } from '$lib/previews';
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

	// D-13 / Phase 4 audit Top 2 carryover: title-cased display labels for format chip.
	// Same pattern as Phase 3 role-chip fix (quick task 260510-bbq). Screen readers
	// announce the title-cased display label; visual `text-transform: uppercase` on
	// the .chip stays unchanged so sighted-user output is identical.
	const FORMAT_LABEL: Record<string, string> = {
		documentary: 'Documentary',
		feature: 'Feature',
		'short film': 'Short',
		'music video': 'Music Video',
		commercial: 'Commercial',
		'branded content': 'Branded Content',
		other: ''
	};

	// POLI-01 hover-loop layer (D-04). Composition extension over the existing
	// LiteVideo poster — never builds an iframe URL itself (PERF-03 invariant).
	// previewSlugs (build-time Set from $lib/previews) decides per-project whether
	// the layer renders at all (D-01 partial coverage). Projects without a clip
	// at static/previews/<slug>.mp4 stay poster-only — no surprise behavior.
	const hasPreview = $derived(previewSlugs.has(project.slug));

	let videoEl = $state<HTMLVideoElement | undefined>(undefined);
	let isHovered = $state(false);
	let hasLoaded = $state(false);

	function onMouseEnter(): void {
		// A11Y-03 (D-25 carried): reduced-motion users see static poster, no autoplay.
		if (prefersReducedMotion.current) return;
		if (!hasPreview) return; // POLI-01 partial — no clip → no loop
		isHovered = true;
		if (videoEl) {
			// Lazy upgrade preload ('metadata' → 'auto') on first hover only —
			// saves bandwidth for users who never hover.
			if (!hasLoaded) {
				videoEl.preload = 'auto';
				hasLoaded = true;
			}
			void videoEl.play().catch(() => {
				// Browsers may block play() if user hasn't interacted with the page yet
				// OR for power-saving reasons. Silently ignore — user sees static poster.
			});
		}
	}

	function onMouseLeave(): void {
		isHovered = false;
		if (videoEl) {
			videoEl.pause();
			videoEl.currentTime = 0;
		}
	}
</script>

<article
	class="card"
	class:has-preview={hasPreview}
	onmouseenter={onMouseEnter}
	onmouseleave={onMouseLeave}
>
	<div class="media">
		<LiteVideo
			{provider}
			id={videoId}
			poster={project.posterImage}
			title={project.title}
			mode="card"
			oncardclick={navigateToDetail}
		/>
		{#if hasPreview}
			<video
				bind:this={videoEl}
				class="hover-loop"
				class:visible={isHovered}
				src={`${base}/previews/${project.slug}.mp4`}
				muted
				loop
				playsinline
				preload="metadata"
				aria-hidden="true"
				tabindex="-1"
			></video>
		{/if}
	</div>
	<div class="info">
		<h3 class="title">{project.title}</h3>
		<div class="row">
			{#each project.role as r}
				<span class="chip chip--role">{r.charAt(0).toUpperCase() + r.slice(1)}</span>
			{/each}
			<span class="year">{project.year}</span>
			{#if project.format !== 'other'}
				<span class="chip chip--format">{FORMAT_LABEL[project.format] ?? project.format}</span>
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

	/* POLI-01 hover-loop layer (D-04). Composition extension only —
	   .media wraps the existing LiteVideo poster so the absolutely-positioned
	   <video> layer can stack over it without disturbing layout (PERF-04 / D-14
	   baked-dimension contract preserved; RESEARCH Pitfall 9: no CLS impact). */
	.media {
		position: relative;
	}
	.hover-loop {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0;
		pointer-events: none; /* clicks pass through to the LiteVideo poster button */
		transition: opacity 200ms var(--ease-out);
	}
	/* A11Y-04 + POLI-01 (D-03): only activate hover-loop on devices with hover +
	   fine pointer. Touch / coarse pointer / keyboard see the static poster —
	   no surprise autoplay on phones, tablets, or assistive-tech contexts. */
	@media (hover: hover) and (pointer: fine) {
		.hover-loop.visible {
			opacity: 1;
		}
	}
	/* A11Y-03 belt + suspenders (D-25 carried): hard-disable the layer for
	   reduced-motion users regardless of pointer/hover capability. The JS guard
	   in onMouseEnter is the primary defense; this CSS guarantees no flash even
	   if JS is disabled or the matchMedia probe is delayed. */
	@media (prefers-reduced-motion: reduce) {
		.hover-loop {
			display: none !important;
		}
	}
</style>
