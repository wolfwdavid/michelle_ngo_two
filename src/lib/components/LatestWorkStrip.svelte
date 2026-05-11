<!-- repo/src/lib/components/LatestWorkStrip.svelte -->
<!-- D-08 / HERO-05 — below-fold latest-work strip. -->
<!-- 4-6 most-recent projects sorted by year DESC. Pure CSS scroll-snap; no JS. -->
<!-- Click any card → /work/[slug]/ via {base} prefix (D-24 carried). -->
<!-- enhanced:img src={runtime-EnhancedImage} pattern matches LiteVideo.svelte. -->
<script lang="ts">
	import { base } from '$app/paths';
	import type { ProjectRecord } from '$lib/content';

	type Props = { projects: readonly ProjectRecord[] };
	let { projects }: Props = $props();

	// Filter + sort: 4-6 most-recent by year DESC. The `projects` array
	// arrives sorted by D-06 (weight DESC, year DESC), so a year-DESC re-sort
	// refines past the case where the featured project's weight pulls it
	// ahead of more-recent unfeatured work.
	// $derived so it re-runs on prop rebind (Svelte 5 idiom).
	const items = $derived(
		[...projects].sort((a, b) => b.year - a.year).slice(0, 6)
	);
</script>

<section class="strip" aria-label="Latest work">
	<ul class="rail">
		{#each items as p (p.slug)}
			<li class="card">
				<a href="{base}/work/{p.slug}/">
					<enhanced:img src={p.posterImage} alt="" loading="lazy" />
					<h3>{p.title}</h3>
				</a>
			</li>
		{/each}
	</ul>
</section>

<style>
	.strip {
		padding: var(--space-5) 0;
	}
	.rail {
		list-style: none;
		margin: 0;
		/* Edge-bleed: padding-inline on the rail so the first/last card */
		/* aligns with the page gutter; scroll container can bleed beyond. */
		padding: 0 var(--space-4);
		display: flex;
		gap: var(--space-4);
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		scrollbar-width: thin;
		-webkit-overflow-scrolling: touch; /* iOS momentum scroll */
	}
	.card {
		flex: 0 0 auto;
		width: clamp(240px, 70vw, 360px);
		scroll-snap-align: start;
	}
	.card a {
		display: block;
		color: inherit;
		text-decoration: none;
	}
	/* D-14 honor-native-aspect: NO aspect-ratio, NO object-fit on the poster */
	.card :global(img) {
		display: block;
		width: 100%;
		height: auto;
	}
	.card h3 {
		font-family: var(--font-display);
		font-size: var(--type-h3);
		font-weight: 600;
		margin: var(--space-2) 0 0;
	}
	.card a:hover h3 {
		color: var(--color-accent);
	}
	@media (min-width: 768px) {
		.card { width: 320px; }
	}
	@media (min-width: 1024px) {
		.rail { padding: 0 var(--space-5); }
	}
</style>
