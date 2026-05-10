<!-- repo/src/routes/about/+page.svelte -->
<!-- ABOUT-01..04 driver. D-16 — recognition derived from press.json category filter. -->
<!-- Single source of truth: same press array also drives /press/ (Plan 04-04 part 2). -->
<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';
	import AboutSection from '$lib/components/AboutSection.svelte';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';
	import { press, site } from '$lib/content';
	import { TITLE_TEMPLATE, absoluteUrl } from '$lib/seo';

	// D-16: derive recognition from press category filter.
	// $derived so prop rebind on SPA navigation re-computes (Svelte 5 idiom).
	const recognitionItems = $derived(
		press.filter((p) => p.category === 'award' || p.category === 'festival')
	);

	// SEO-01/02: per-route MetaTags. Pitfall 3: titleTemplate must be repeated.
	const aboutUrl = absoluteUrl('/about/');
	const ogDefaultUrl = absoluteUrl('/og-default.png');

	// D-15 / SEO-03: hand-rolled JSON-LD Person schema. Hand-rolled per CONTEXT
	// (full schema control; svelte-meta-tags JSON-LD helpers don't cover the
	// Pitfall 4 close-script-tag escape needed for any user-controlled string).
	const personSchema = {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: 'Michelle Ngo',
		jobTitle: 'Director, Producer, Writer',
		url: aboutUrl,
		image: ogDefaultUrl,
		sameAs: [
			site.social.imdb,
			site.social.linkedin,
			site.social.vimeo,
			site.social.youtube
		],
		worksFor: { '@type': 'Organization', name: 'Archival Producers Alliance' }
	};
	// RESEARCH §Pitfall 4: close-script-tag defense. Replace `</` with `<\/` so any
	// synopsis or social-URL string containing a close-script sequence can't
	// terminate the JSON-LD script tag early.
	const personLd = JSON.stringify(personSchema).replace(/<\//g, '<\\/');
</script>

<MetaTags
	title="About"
	titleTemplate={TITLE_TEMPLATE}
	description="About Michelle Ngo — filmmaker working across documentary, narrative, music video, and branded content."
	canonical={aboutUrl}
	openGraph={{
		type: 'profile',
		url: aboutUrl,
		title: 'About Michelle Ngo',
		description: 'Filmmaker — director, producer, writer.',
		siteName: 'Michelle Ngo',
		images: [{ url: ogDefaultUrl, width: 1200, height: 630 }]
	}}
	twitter={{
		cardType: 'summary_large_image',
		title: 'About — Michelle Ngo',
		description: 'Filmmaker bio.',
		image: ogDefaultUrl
	}}
/>

<!-- D-15 / SEO-03: hand-rolled JSON-LD Person. {@html} is required because
     svelte:head + raw script tags don't interpolate; the close-script escape
     in personLd defends against early-termination of the script block. -->
<svelte:head>
	{@html `<script type="application/ld+json">${personLd}</script>`}
</svelte:head>

<!-- D-09 / A11Y-06: visually-hidden h1 satisfies single-h1-per-page rule -->
<!-- without disrupting AboutSection's intentional structural design. -->
<!-- The .sr-only token-class lives in repo/src/app.css (Wave 0 / Plan 05-00). -->
<h1 class="sr-only">About</h1>

<!-- D-12 / POLI-02: reveal AboutSection (bio + recognition snippet) on scroll-into-view. -->
<!-- Single coarse reveal; AboutSection internal sequence already lays out bio above -->
<!-- recognition naturally — sequential effect comes from layout order, not reveals. -->
<ScrollReveal duration={180}>
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
</ScrollReveal>

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
