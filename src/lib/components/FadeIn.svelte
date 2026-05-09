<!-- repo/src/lib/components/FadeIn.svelte -->
<!-- D-19 — thin wrapper around use:reveal + Svelte's built-in in:fade. -->
<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import { fade } from 'svelte/transition';

	type Props = {
		children?: import('svelte').Snippet;
		duration?: number; // ms
		delay?: number; // ms
		threshold?: number; // 0..1
	};
	let { children, duration = 400, delay = 0, threshold = 0.15 }: Props = $props();

	let visible = $state(false);
</script>

<div use:reveal={{ threshold, onEnter: () => (visible = true) }}>
	{#if visible}
		<div in:fade={{ duration, delay }}>
			{@render children?.()}
		</div>
	{/if}
</div>
