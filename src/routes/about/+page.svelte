<!-- repo/src/routes/about/+page.svelte -->
<!-- ABOUT-01..04 driver. D-16 — recognition derived from press.json category filter. -->
<!-- Single source of truth: same press array also drives /press/ (Plan 04-04 part 2). -->
<script lang="ts">
	import AboutSection from '$lib/components/AboutSection.svelte';
	import { press } from '$lib/content';

	// D-16: derive recognition from press category filter.
	// $derived so prop rebind on SPA navigation re-computes (Svelte 5 idiom).
	const recognitionItems = $derived(
		press.filter((p) => p.category === 'award' || p.category === 'festival')
	);
</script>

<svelte:head>
	<title>About — Michelle Ngo</title>
</svelte:head>

<!-- D-09 / A11Y-06: visually-hidden h1 satisfies single-h1-per-page rule -->
<!-- without disrupting AboutSection's intentional structural design. -->
<!-- The .sr-only token-class lives in repo/src/app.css (Wave 0 / Plan 05-00). -->
<h1 class="sr-only">About</h1>
<!-- AboutSection internally renders: headshot (siteHeadshot via enhanced-img), -->
<!-- bio (siteBio Svelte component via mdsvex), resume PDF link, IMDb/LinkedIn/Vimeo/YouTube profiles, -->
<!-- and the recognition snippet supplied below. -->
<AboutSection>
	{#snippet recognition()}
		{#if recognitionItems.length > 0}
			<ul class="recognition-items">
				{#each recognitionItems as item (item.link)}
					<li>
						<span class="pub">{item.publication}</span> —
						<a href={item.link} target="_blank" rel="noopener">{item.headline}</a>
						<time datetime={item.date}>{item.date.slice(0, 4)}</time>
					</li>
				{/each}
			</ul>
		{/if}
	{/snippet}
</AboutSection>

<style>
	.recognition-items {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		font-size: var(--type-body);
	}
	.recognition-items .pub {
		font-weight: 600;
	}
	.recognition-items time {
		color: var(--color-grey-500);
		margin-left: var(--space-2);
	}
	.recognition-items a {
		color: inherit;
		text-decoration: underline;
	}
	.recognition-items a:hover {
		color: var(--color-accent);
	}
</style>
