<!-- repo/src/lib/components/ScrollReveal.svelte -->
<!-- Gap closure 05-08: always-render-with-opacity refactor. The previous -->
<!-- conditional-render + Svelte fly-transition pattern (see 05-07-SUMMARY -->
<!-- "Performance regression detail") caused two coupled regressions: -->
<!-- (1) CLS 0.435 on /work/ when WorkGrid popped into the DOM on intersection -->
<!-- (Performance dropped 90 → 73), and (2) axe-core color-contrast false -->
<!-- positive on /about/ when .bio > p was scanned mid-animation at sub-1 -->
<!-- opacity (3.09:1 vs WCAG AA 4.5:1). Coupled fix per 05-VERIFICATION.md: -->
<!-- render children unconditionally at SSR/hydration so the DOM is stable -->
<!-- from first paint (CLS 0) and axe always scans children at final color -->
<!-- (no false positive). Visual reveal still fires — driven by a CSS class -->
<!-- toggle on IntersectionObserver, not by mounting children. POLI-02 -->
<!-- behavior preserved. A11Y-03 reduced-motion preserved via belt-and- -->
<!-- suspenders (layer 1 = app.css global blanket, layer 2 = reveal.ts -->
<!-- early-exit, layer 3 = the scoped @media block below). -->
<script lang="ts">
	import { reveal } from '$lib/actions/reveal';

	type Props = {
		children?: import('svelte').Snippet;
		distance?: number; // px (y offset on translateY) — default 12
		duration?: number; // ms — default 400 (consumers pass 180 to match POLI-03)
		delay?: number; // ms — default 0
		threshold?: number; // IntersectionObserver threshold 0..1 — default 0.15
	};
	let {
		children,
		distance = 12,
		duration = 400,
		delay = 0,
		threshold = 0.15
	}: Props = $props();

	let visible = $state(false);
</script>

<div
	use:reveal={{ threshold, onEnter: () => (visible = true) }}
	class="reveal-target"
	class:visible
	style="--reveal-duration: {duration}ms; --reveal-delay: {delay}ms; --reveal-distance: {distance}px;"
>
	{@render children?.()}
</div>

<style>
	.reveal-target {
		opacity: 0;
		transform: translateY(var(--reveal-distance, 12px));
		transition:
			opacity var(--reveal-duration, 400ms) ease-out var(--reveal-delay, 0ms),
			transform var(--reveal-duration, 400ms) ease-out var(--reveal-delay, 0ms);
		will-change: opacity, transform;
	}
	.reveal-target.visible {
		opacity: 1;
		transform: translateY(0);
	}
	/* A11Y-03 layer 3: prefers-reduced-motion forces the final visible state */
	/* immediately, with no transition. Layers 1 (app.css blanket) + 2 (reveal.ts */
	/* early-exit) already ensure the user-perceived outcome is correct; this */
	/* layer guarantees the visual result is correct even in the brief window */
	/* between SSR delivery and JS hydration. */
	@media (prefers-reduced-motion: reduce) {
		.reveal-target {
			opacity: 1;
			transform: none;
			transition: none;
		}
	}
</style>
