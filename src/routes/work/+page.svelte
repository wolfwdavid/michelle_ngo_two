<!-- repo/src/routes/work/+page.svelte -->
<!-- WORK-01 / WORK-05 driver. D-09 composition: h1 + WorkGrid (no intro copy). -->
<!-- D-13 edge-bleed container: padding-inline matching page gutter rhythm. -->
<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';
	import WorkGrid from '$lib/components/WorkGrid.svelte';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';
	import { projects } from '$lib/content';
	import { TITLE_TEMPLATE, absoluteUrl } from '$lib/seo';

	// SEO-01/02: per-route MetaTags. Pitfall 3: titleTemplate must be repeated
	// per-route — no cascade from +layout.svelte's MetaTags.
	const workUrl = absoluteUrl('/work/');
	const ogDefaultUrl = absoluteUrl('/og-default.png');
</script>

<MetaTags
	title="Work"
	titleTemplate={TITLE_TEMPLATE}
	description="Selected directing, producing, and writing work by Michelle Ngo. Documentaries, features, music videos, commercials."
	canonical={workUrl}
	openGraph={{
		type: 'website',
		url: workUrl,
		title: 'Work',
		description: 'Selected film work — director, producer, writer.',
		siteName: 'Michelle Ngo',
		images: [{ url: ogDefaultUrl, width: 1200, height: 630 }]
	}}
	twitter={{
		cardType: 'summary_large_image',
		title: 'Work — Michelle Ngo',
		description: 'Selected film work.',
		image: ogDefaultUrl
	}}
/>

<section class="work-index">
	<h1>WORK</h1>
	<!-- D-13 edge-bleed wrapper — padding-inline matches the page gutter rhythm -->
	<!-- so card grid columns align with the rest of the page chrome. -->
	<div class="grid-wrapper">
		<!-- D-12 / POLI-02: coarse reveal wrap. Per-row stagger would require -->
		<!-- WorkGrid internal refactor; coarse wrap keeps "no new motion infra" intact. -->
		<ScrollReveal duration={180}>
			<WorkGrid {projects} />
		</ScrollReveal>
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
