<!-- repo/src/lib/components/HeroShell.svelte -->
<!-- D-16 — Phase 3 structural shell only. -->
<!-- Phase 4 fills <slot name="reel" /> with the actual hero composition -->
<!-- (HERO-02 reel master Vimeo ID + HERO-04 autoplay-fallback SDK). -->
<script lang="ts">
	type Props = {
		reel?: import('svelte').Snippet; // Phase 4 supplies; Phase 3 fixture supplies in gallery
	};
	let { reel }: Props = $props();
</script>

<section class="hero">
	<h1 class="wordmark">MICHELLE NGO</h1>
	<p class="roles">
		<span>DIRECTOR</span>
		<span>PRODUCER</span>
		<span>WRITER</span>
	</p>
	<div class="reel">
		{@render reel?.()}
	</div>
</section>

<style>
	.hero {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-5);
		padding: var(--space-6) var(--space-4);
	}
	.wordmark {
		font-family: var(--font-display);
		font-weight: 800;
		font-variation-settings: 'opsz' 144;
		font-size: var(--type-display);
		letter-spacing: -0.02em;
		margin: 0;
		text-align: center;
	}
	.roles {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		text-align: center;
		font-size: var(--type-h3);
		text-transform: uppercase;
		letter-spacing: 0.3em;
		margin: 0;
		color: var(--color-grey-500);
	}
	.reel {
		width: 100%;
		max-width: 1200px;
		/* D-22b: prevent visual collapse when reel snippet is unsupplied (fixture render).
		   Production composition supplies LiteVideo which provides its own height; this
		   min-height is a fallback only. min(...) keeps mobile from over-reserving. */
		min-height: min(60vh, 480px);
	}
</style>
