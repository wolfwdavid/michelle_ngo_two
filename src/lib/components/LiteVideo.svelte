<!-- repo/src/lib/components/LiteVideo.svelte -->
<!-- WORK-02 / PERF-03 driver. D-05..D-08. -->
<!-- INVARIANT: this is the ONLY file in the repo that ever renders a -->
<!-- Vimeo/YouTube <iframe>. ProjectCard wraps this; HeroShell wraps this; -->
<!-- Phase 4 detail routes wrap this. The facade gate is structural. -->
<script lang="ts">
	import type { EnhancedImage } from '$lib/content';

	type Props = {
		provider: 'vimeo' | 'youtube';
		id: string;
		poster: EnhancedImage;
		title: string;
		mode?: 'card' | 'hero' | 'detail';
		hash?: string; // Vimeo unlisted-video privacy hash (forward-compat)
		oncardclick?: () => void; // mode='card' click handler (ProjectCard wires goto)
		/**
		 * Browser loading hint forwarded to the underlying <enhanced:img>.
		 * Default 'lazy' matches the LCP-optimization contract: callers must
		 * explicitly opt the LCP element into eager loading.
		 */
		loading?: 'lazy' | 'eager';
		/**
		 * Resource priority hint forwarded to the underlying <enhanced:img>.
		 * Default 'auto' lets the browser decide; set 'high' on the explicit
		 * LCP element (first WorkGrid card, hero poster).
		 */
		fetchpriority?: 'high' | 'auto';
	};
	let {
		provider,
		id,
		poster,
		title,
		mode = 'detail',
		hash,
		oncardclick,
		loading = 'lazy',
		fetchpriority = 'auto'
	}: Props = $props();

	let mounted = $state(false);

	function buildSrc(): string {
		if (provider === 'vimeo') {
			// Vimeo unlisted-video privacy hash MUST be the FIRST query parameter
			// (Pitfall 4). Build conditionally.
			const tail = `autoplay=1&dnt=1&title=0&byline=0&portrait=0`;
			return hash
				? `https://player.vimeo.com/video/${id}?h=${hash}&${tail}`
				: `https://player.vimeo.com/video/${id}?${tail}`;
		}
		// YouTube: youtube-nocookie defers cookie storage until play.
		// (Per RESEARCH Pitfall 8, the "modest-branding" param is deprecated as
		// of 2024 and intentionally omitted here — do NOT add it back.)
		return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`;
	}

	function onClick() {
		if (mode === 'card') {
			oncardclick?.();
			return;
		}
		// hero / detail: mount the iframe per D-08.
		mounted = true;
	}
</script>

<div class="lite-video" data-mode={mode}>
	{#if !mounted}
		<button
			type="button"
			class="lite-video__poster"
			aria-label={`Play ${title} reel`}
			onclick={onClick}
		>
			<enhanced:img src={poster} alt="" {loading} {fetchpriority} />
			<span class="lite-video__play" aria-hidden="true">
				<svg viewBox="0 0 64 64" width="64" height="64">
					<circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" stroke-width="1.5" />
					<polygon points="26,20 26,44 46,32" fill="currentColor" />
				</svg>
			</span>
		</button>
	{:else}
		<iframe
			src={buildSrc()}
			{title}
			frameborder="0"
			allow="autoplay; fullscreen; picture-in-picture"
			allowfullscreen
		></iframe>
	{/if}
</div>

<style>
	.lite-video {
		position: relative;
		width: 100%;
		background: var(--color-grey-200);
	}
	.lite-video__poster {
		position: relative;
		display: block;
		width: 100%;
		padding: 0;
		margin: 0;
		background: none;
		border: 0;
		cursor: pointer;
		color: var(--color-bg);
	}
	/* enhanced-img bakes width/height — D-14 honors native aspect. Do NOT set
	   aspect-ratio or object-fit:cover here (Pitfall 5). */
	.lite-video__poster :global(img) {
		display: block;
		width: 100%;
		height: auto;
	}
	.lite-video__play {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		transition: color 200ms var(--ease-out);
	}
	.lite-video__poster:hover .lite-video__play,
	.lite-video__poster:focus-visible .lite-video__play {
		color: var(--color-accent-hover);
	}
	.lite-video__poster:active .lite-video__play {
		color: var(--color-accent-active);
	}
	.lite-video iframe {
		display: block;
		width: 100%;
		aspect-ratio: 16 / 9;
		border: 0;
	}
</style>
