<!-- repo/src/lib/components/PressList.svelte -->
<!-- D-18 + RESEARCH Pattern 5. Native <details>/<summary> accordion. -->
<script lang="ts">
	import type { PressItem } from '$lib/schema';
	import type { ProjectRecord } from '$lib/content';

	type Props = {
		items: readonly PressItem[];
		projects: readonly ProjectRecord[]; // for slug → title lookup (D-18)
	};
	let { items, projects }: Props = $props();

	// slug → human title for group headings.
	// $derived so it re-runs if `projects` rebinds (avoids Svelte 5
	// state_referenced_locally warning on plain-const reads of $props()).
	const titleBySlug = $derived(new Map(projects.map((p) => [p.slug, p.title])));

	// Group items by project slug. Items without `project` go under `null` key.
	// $derived so the grouping recomputes when `items` rebinds.
	type Group = { key: string | null; items: PressItem[] };
	const groups: Group[] = $derived.by(() => {
		const acc = new Map<string | null, PressItem[]>();
		for (const item of items) {
			const key = item.project ?? null;
			const list = acc.get(key) ?? [];
			list.push(item);
			acc.set(key, list);
		}
		// Project groups first (in iteration order), Profile & Other last.
		const out: Group[] = [];
		for (const [key, list] of acc.entries()) {
			if (key !== null) out.push({ key, items: list });
		}
		const profileBucket = acc.get(null);
		if (profileBucket && profileBucket.length > 0) {
			out.push({ key: null, items: profileBucket });
		}
		return out;
	});

	// Pitfall 9 fix: <details open> + mobile CSS that hides .items collides
	// with the user clicking to expand. Mark interaction via a class so the
	// mobile-collapsed CSS yields to user intent. ~5 LOC, no flash.
	function onToggle(e: Event) {
		const el = e.currentTarget as HTMLDetailsElement;
		el.classList.add('user-toggled');
	}
</script>

<section class="press-list">
	{#each groups as g (g.key ?? '__profile')}
		{#if g.key !== null}
			<details open class="press-group" ontoggle={onToggle}>
				<summary>
					<span class="title">{titleBySlug.get(g.key) ?? g.key}</span>
					<svg class="chevron" viewBox="0 0 12 8" aria-hidden="true">
						<polyline
							points="1,1 6,7 11,1"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
						/>
					</svg>
				</summary>
				<ul class="items">
					{#each g.items as item}
						<li>
							<span class="pub">{item.publication}</span> —
							<a href={item.link} target="_blank" rel="noopener">{item.headline}</a>
							<time class="year" datetime={item.date}>{item.date.slice(0, 4)}</time>
						</li>
					{/each}
				</ul>
			</details>
		{:else}
			<section class="press-group press-group--profile">
				<h3>Profile &amp; Other</h3>
				<ul class="items">
					{#each g.items as item}
						<li>
							<span class="pub">{item.publication}</span> —
							<a href={item.link} target="_blank" rel="noopener">{item.headline}</a>
							<time class="year" datetime={item.date}>{item.date.slice(0, 4)}</time>
						</li>
					{/each}
				</ul>
			</section>
		{/if}
	{/each}
</section>

<style>
	.press-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}
	.press-group {
		border-bottom: 1px solid var(--color-grey-200);
		padding-bottom: var(--space-3);
	}
	summary {
		list-style: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-2) 0;
		font-family: var(--font-display);
		font-size: var(--type-h3);
		font-weight: 600;
	}
	summary::-webkit-details-marker {
		display: none;
	}
	.chevron {
		width: 0.75em;
		height: 0.5em;
		transition: transform 200ms var(--ease-out);
	}
	.press-group:not([open]) > summary .chevron {
		transform: rotate(-90deg);
	}
	.items {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		font-size: var(--type-body);
	}
	.pub {
		font-weight: 600;
	}
	.year {
		color: var(--color-grey-500);
		margin-left: var(--space-2);
	}
	.items a {
		color: inherit;
		text-decoration: underline;
	}
	.items a:hover {
		color: var(--color-accent);
	}
	.press-group--profile h3 {
		margin: 0 0 var(--space-2);
		font-family: var(--font-display);
		font-size: var(--type-h3);
		font-weight: 600;
	}

	/* Pitfall 9: mobile default-collapsed via CSS override. */
	/* The <details open> attribute stays in the SSR markup (no hydration */
	/* mismatch), but on mobile we hide the body until the user has toggled. */
	@media (max-width: 767px) {
		.press-group[open]:not(.user-toggled) > .items {
			display: none;
		}
		.press-group[open]:not(.user-toggled) > summary .chevron {
			transform: rotate(-90deg);
		}
	}

	/* Audit Fix 2 (03-UI-REVIEW.md §"Top 3 Priority Fixes" item 3): */
	/* Under 480px the inline flow `Publication — Headline · Year` wraps */
	/* awkwardly mid-sentence and breaks the publication–headline relationship. */
	/* Stack publication on its own block-level row above the headline + date. */
	/* Layout at >=480px is unchanged (this rule does nothing above the breakpoint). */
	@media (max-width: 479px) {
		.items li {
			display: flex;
			flex-direction: column;
			gap: var(--space-1, 0.25rem);
		}
		.items li .pub {
			display: block;
		}
		.items li .year {
			margin-left: 0;
		}
	}
</style>
