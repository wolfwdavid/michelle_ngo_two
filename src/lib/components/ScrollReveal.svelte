<!-- repo/src/lib/components/ScrollReveal.svelte -->
<!-- D-19 — thin wrapper around use:reveal + Svelte's built-in in:fly. -->
<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import { fly } from 'svelte/transition';

	type Props = {
		children?: import('svelte').Snippet;
		distance?: number; // px (y offset)
		duration?: number;
		delay?: number;
		threshold?: number;
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

<div use:reveal={{ threshold, onEnter: () => (visible = true) }}>
	{#if visible}
		<div in:fly={{ y: distance, duration, delay }}>
			{@render children?.()}
		</div>
	{/if}
</div>
