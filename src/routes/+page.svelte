<!-- repo/src/routes/+page.svelte -->
<!-- Phase 4 Plan 04-02: replaces Phase 1 deploy-smoke placeholder. -->
<!-- HERO-01..05 driver. D-01 (featured project = reel) + D-05 (static poster + Play CTA) -->
<!-- + D-06 (first-viewport on 375x667) + D-08 (below-fold LatestWorkStrip). -->
<!-- Phase 1 deploy-smoke continuity: HeroShell renders the literal MICHELLE NGO -->
<!-- text as <h1>, so the smoke job grep continues to find it in built HTML. -->
<script lang="ts">
	import HeroShell from '$lib/components/HeroShell.svelte';
	import LatestWorkStrip from '$lib/components/LatestWorkStrip.svelte';
	import LiteVideo from '$lib/components/LiteVideo.svelte';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';
	import { projects } from '$lib/content';

	// D-01: Reel master = featured project (Phase 2 D-06 enforces exactly one
	// `featured: true` project, so this find never returns undefined at runtime).
	const featured = $derived(projects.find((p) => p.featured)!);

	// XOR enforced upstream by Phase 2 schema; one of vimeoId/youtubeId is set.
	const provider = $derived<'vimeo' | 'youtube'>(featured.vimeoId ? 'vimeo' : 'youtube');
	const videoId = $derived<string>((featured.vimeoId ?? featured.youtubeId)!);
</script>

<svelte:head>
	<title>Michelle Ngo — Director, Producer, Writer</title>
</svelte:head>

<!-- HeroShell renders MICHELLE NGO wordmark + DIRECTOR · PRODUCER · WRITER role line. -->
<!-- The reel snippet supplies LiteVideo in mode='hero' — D-05 static poster + Play CTA, -->
<!-- click → mounts iframe with autoplay=1 (D-08 contract from Phase 3). -->
<!-- D-07 explicitly skips Vimeo Player SDK; the always-on Play CTA satisfies HERO-04. -->
<HeroShell>
	{#snippet reel()}
		<LiteVideo
			{provider}
			id={videoId}
			poster={featured.posterImage}
			title={`Reel — ${featured.title}`}
			mode="hero"
		/>
	{/snippet}
</HeroShell>

<!-- D-08 / HERO-05: below-fold horizontal-scroll strip of 4-6 most-recent projects. -->
<!-- D-12 / POLI-02: reveal LatestWorkStrip on scroll-into-view. Single coarse -->
<!-- reveal (not per-card stagger) — per-card stagger would need to bleed into -->
<!-- LatestWorkStrip's internal markup, violating D-12's "no new motion infra". -->
<ScrollReveal duration={180}>
	<LatestWorkStrip {projects} />
</ScrollReveal>
