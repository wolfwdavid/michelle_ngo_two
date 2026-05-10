<!-- repo/src/routes/press/+page.svelte -->
<!-- PRSS-01..03 driver. -->
<!-- PRSS-02: editorial headshot banner at top (D-17 reuse of siteHeadshot). -->
<!-- PRSS-03: PressList groups items by project (Phase 3 component handles clustering). -->
<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';
	import { siteHeadshot, press, projects } from '$lib/content';
	import PressList from '$lib/components/PressList.svelte';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';
	import { TITLE_TEMPLATE, absoluteUrl } from '$lib/seo';

	// SEO-01/02: per-route MetaTags. Pitfall 3: titleTemplate must be repeated.
	const pressUrl = absoluteUrl('/press/');
	const ogDefaultUrl = absoluteUrl('/og-default.png');
</script>

<MetaTags
	title="Press"
	titleTemplate={TITLE_TEMPLATE}
	description="Press, awards, festival selections, and features for Michelle Ngo's film work."
	canonical={pressUrl}
	openGraph={{
		type: 'website',
		url: pressUrl,
		title: 'Press — Michelle Ngo',
		description: 'Press and recognition.',
		siteName: 'Michelle Ngo',
		images: [{ url: ogDefaultUrl, width: 1200, height: 630 }]
	}}
	twitter={{
		cardType: 'summary_large_image',
		title: 'Press — Michelle Ngo',
		description: 'Press and recognition.',
		image: ogDefaultUrl
	}}
/>

<!-- PRSS-02: headshot full-bleed editorial banner. 21:9 cinematic crop. -->
<!-- The object-fit: cover here is INTENTIONAL and does NOT violate D-14 — -->
<!-- D-14 protects ProjectCard posters from forced cropping; the headshot -->
<!-- is a deliberate banner treatment (RESEARCH §4 documents this). -->
<header class="press-lead">
	<enhanced:img src={siteHeadshot} alt="Michelle Ngo" sizes="100vw" />
</header>

<section class="press-body">
	<h1>PRESS</h1>
	<!-- D-12 / POLI-02: reveal PressList (project groups). Per-group stagger -->
	<!-- would require PressList internal change; coarse wrap maintains the -->
	<!-- "no new motion infra" principle. -->
	<ScrollReveal duration={180}>
		<PressList items={press} {projects} />
	</ScrollReveal>
</section>

<style>
	/* PRSS-02 banner — 21:9 cinematic crop; object-fit cover is INTENTIONAL here
	   (deliberate banner treatment, NOT a D-14 ProjectCard violation). */
	.press-lead {
		width: 100%;
		aspect-ratio: 21 / 9;
		overflow: hidden;
	}
	.press-lead :global(img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center top;
	}
	.press-body {
		max-width: 900px;
		margin: 0 auto;
		padding: var(--space-5) var(--space-4);
	}
	h1 {
		font-family: var(--font-display);
		font-weight: 700;
		font-variation-settings: 'opsz' 144;
		font-size: var(--type-h1);
		letter-spacing: -0.01em;
		text-transform: uppercase;
		margin: 0 0 var(--space-5);
	}
	@media (min-width: 768px) {
		.press-body {
			padding: var(--space-6) var(--space-5);
		}
	}
</style>
