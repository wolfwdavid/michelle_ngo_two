<!-- repo/src/routes/work/[slug]/+page.svelte -->
<!-- WORK-03 + WORK-04 + WORK-05 driver. D-10 element order: -->
<!-- 1. LiteVideo (mode='detail', full-width above the fold) -->
<!-- 2. h1 (project.title, display serif) -->
<!-- 3. Meta row (role chip(s) title-cased + year + format chip suppressed when 'other') -->
<!-- 4. Synopsis (mdsvex-rendered project body via project.Body component) -->
<!-- 5. Credits dl (D-12 dt/dd; suppress entire block if credits undefined) -->
<!-- 6. Prev/Next nav (D-11 chronological via getNextProject/getPreviousProject) -->
<script lang="ts">
	import { base } from '$app/paths';
	import LiteVideo from '$lib/components/LiteVideo.svelte';
	import { getNextProject, getPreviousProject } from '$lib/content';

	let { data } = $props();
	const project = $derived(data.project);

	// XOR enforced upstream by Phase 2 schema; one of vimeoId/youtubeId is set.
	// $derived so prop rebind on SPA navigation re-computes (Svelte 5 idiom).
	const provider = $derived<'vimeo' | 'youtube'>(project.vimeoId ? 'vimeo' : 'youtube');
	const videoId = $derived<string>((project.vimeoId ?? project.youtubeId)!);

	// mdsvex-compiled body component from parseProject (Phase 2).
	const Body = $derived(project.Body);

	// D-11 chronological adjacency. Adjacency helpers from Plan 04-01.
	const prev = $derived(getPreviousProject(project.slug));
	const next = $derived(getNextProject(project.slug));

	// D-13 / Phase 4 audit Top 2 carryover: title-cased display labels for format chip.
	// Same map as ProjectCard.svelte; intentionally duplicated rather than extracted
	// to a $lib helper because there are exactly 2 sites and the map is small enough
	// that the duplication is cheaper than the indirection. If a third site ever
	// renders this chip, extract to $lib/format.ts at that point (rule of three).
	const FORMAT_LABEL: Record<string, string> = {
		documentary: 'Documentary',
		feature: 'Feature',
		'short film': 'Short',
		'music video': 'Music Video',
		commercial: 'Commercial',
		'branded content': 'Branded Content',
		other: ''
	};
</script>

<svelte:head>
	<title>{project.title} — Michelle Ngo</title>
</svelte:head>

<article class="project">
	<!-- 1. LiteVideo full-width above the fold (D-10 step 1). mode='detail' is default but explicit is clearer. -->
	<div class="video">
		<LiteVideo
			{provider}
			id={videoId}
			poster={project.posterImage}
			title={project.title}
			mode="detail"
		/>
	</div>

	<div class="body">
		<!-- 2. h1 display-serif title (D-10 step 2) -->
		<h1>{project.title}</h1>

		<!-- 3. Meta row: role chip(s) + year + format chip (D-10 step 3 + D-15 from quick task: title-case role) -->
		<div class="meta">
			{#each project.role as r}
				<span class="chip chip--role">{r.charAt(0).toUpperCase() + r.slice(1)}</span>
			{/each}
			<span class="year">{project.year}</span>
			{#if project.format !== 'other'}
				<span class="chip chip--format">{FORMAT_LABEL[project.format] ?? project.format}</span>
			{/if}
		</div>

		<!-- 4. Synopsis: mdsvex-rendered body (D-10 step 4) -->
		<div class="synopsis"><Body /></div>

		<!-- 5. Credits dl (D-10 step 5 + D-12 dl/dt/dd; suppressed when credits undefined) -->
		{#if project.credits}
			<dl class="credits">
				{#each Object.entries(project.credits) as [role, name]}
					<dt>{role}</dt>
					<dd>{name}</dd>
				{/each}
			</dl>
		{/if}

		<!-- 6. Prev/Next nav (D-10 step 6 + D-11 chronological + WORK-04) -->
		<nav class="adjacency" aria-label="Project navigation">
			<span class="adjacency__prev">
				{#if prev}
					<a href="{base}/work/{prev.slug}/">← Previous: {prev.title}</a>
				{/if}
			</span>
			<span class="adjacency__next">
				{#if next}
					<a href="{base}/work/{next.slug}/">Next: {next.title} →</a>
				{/if}
			</span>
		</nav>
	</div>
</article>

<style>
	.project {
		max-width: 1200px;
		margin: 0 auto;
		padding: var(--space-5) 0;
	}
	.video {
		width: 100%;
	}
	.body {
		padding: var(--space-5) var(--space-4);
	}
	h1 {
		font-family: var(--font-display);
		font-weight: 700;
		font-variation-settings: 'opsz' 144;
		font-size: var(--type-h1);
		letter-spacing: -0.01em;
		line-height: 1.1;
		margin: 0 0 var(--space-3);
	}
	.meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--type-caption);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		margin-bottom: var(--space-4);
	}
	.chip {
		display: inline-block;
		padding: 0.15em 0.6em;
		border: 1px solid var(--color-grey-300);
		border-radius: var(--radius-sm);
	}
	.chip--role { color: var(--color-ink); }
	.chip--format { color: var(--color-grey-500); }
	.year { color: var(--color-grey-500); }
	.synopsis {
		font-size: var(--type-body);
		line-height: 1.65;
		margin-bottom: var(--space-5);
	}
	.synopsis :global(p) { margin: 0 0 var(--space-3); }
	/* D-12 credits as <dl>: 2-col grid on desktop, stacked on mobile */
	.credits {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-1) var(--space-3);
		margin: 0 0 var(--space-5);
	}
	@media (min-width: 768px) {
		.credits {
			grid-template-columns: auto 1fr;
		}
	}
	.credits dt {
		font-weight: 600;
		text-transform: capitalize;
	}
	.credits dd {
		margin: 0;
		color: var(--color-grey-500);
	}
	/* D-11 prev/next nav — text links with arrow glyphs */
	.adjacency {
		display: flex;
		justify-content: space-between;
		gap: var(--space-3);
		padding-top: var(--space-5);
		border-top: 1px solid var(--color-grey-200);
		font-size: var(--type-caption);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}
	.adjacency a {
		color: inherit;
		text-decoration: none;
	}
	.adjacency a:hover {
		color: var(--color-accent);
	}
	.adjacency__prev,
	.adjacency__next {
		flex: 1 1 50%;
	}
	.adjacency__next {
		text-align: right;
	}
</style>
