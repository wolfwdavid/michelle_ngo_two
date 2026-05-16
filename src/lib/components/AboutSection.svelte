<!-- repo/src/lib/components/AboutSection.svelte -->
<!-- D-17 — About-page structural shell. -->
<!-- Recognition slot (ABOUT-04) is supplied by parent — schema extension deferred to Phase 4. -->
<script lang="ts">
	import { base } from '$app/paths';
	import { site, siteBio, siteHeadshot } from '$lib/content';

	// Capitalize the const so we can render <Bio /> directly (Svelte 5 runes idiom).
	// Equivalent to <svelte:component this={siteBio} />.
	const Bio = siteBio;

	type Props = {
		recognition?: import('svelte').Snippet; // ABOUT-04; Phase 4 wires from site.recognition once schema extends
	};
	let { recognition }: Props = $props();
</script>

<section class="about">
	<div class="headshot">
		<!-- Phase 4 D-17 — Vite-resolved EnhancedImage via siteHeadshot (Plan 04-01). -->
		<!-- Closes Phase 3 PERF-04 TODO. enhanced:img bakes width/height + AVIF/WebP fallbacks. -->
		<enhanced:img src={siteHeadshot} alt="Michelle Ngo headshot" />
	</div>
	<div class="body">
		<!-- Phase 4 D-15 — bio is now mdsvex-compiled from src/content/bio.md (Plan 04-01). -->
		<!-- Capitalized const Bio renders directly; mdsvex emits a Svelte component class. -->
		<div class="bio">
			<Bio />
		</div>

		<p class="resume">
			<a class="resume-link" href={`${base}/${site.resumePdf.replace(/^\.\//, '')}`} download>
				Download Resume (PDF)
			</a>
		</p>

		<ul class="profiles">
			<li><a href={site.social.imdb} target="_blank" rel="noopener">IMDb</a></li>
			<li><a href={site.social.linkedin} target="_blank" rel="noopener">LinkedIn</a></li>
			<li><a href={site.social.vimeo} target="_blank" rel="noopener">Vimeo</a></li>
			<li><a href={site.social.youtube} target="_blank" rel="noopener">YouTube</a></li>
		</ul>

		{#if recognition}
			<section class="recognition">
				<h3>Selected Recognition</h3>
				{@render recognition()}
			</section>
		{/if}
	</div>
</section>

<style>
	.about {
		display: grid;
		grid-template-columns: 1fr; /* mobile: stacked, headshot first */
		gap: var(--space-5);
		padding: var(--space-5) var(--space-4);
		max-width: 1200px;
		margin: 0 auto;
	}
	@media (min-width: 768px) {
		.about {
			grid-template-columns: 2fr 3fr; /* desktop: headshot ~40% / body ~60% */
			gap: var(--space-6);
			align-items: start;
		}
	}
	/* enhanced:img emits <picture><img>, so the inner <img> needs :global() to receive the rule. */
	.headshot :global(img) {
		display: block;
		width: 100%;
		height: auto;
	}
	.body {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}
	.bio {
		font-size: var(--type-body);
		line-height: 1.65;
		margin: 0;
	}
	.resume {
		margin: 0;
	}
	.resume-link {
		display: inline-block;
		padding: var(--space-2) var(--space-3);
		border: 1px solid var(--color-ink);
		border-radius: var(--radius-sm);
		text-decoration: none;
		color: inherit;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		font-size: var(--type-caption);
	}
	.resume-link:hover {
		background: var(--color-ink);
		color: var(--color-bg);
	}
	.profiles {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		gap: var(--space-3);
		flex-wrap: wrap;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		font-size: var(--type-caption);
	}
	.profiles a {
		color: inherit;
		text-decoration: none;
	}
	.profiles a:hover {
		color: var(--color-accent-hover);
	}
	.recognition h3 {
		margin: 0 0 var(--space-2);
		font-size: var(--type-h3);
		font-family: var(--font-display);
	}
</style>
