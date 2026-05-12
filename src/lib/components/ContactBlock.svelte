<!-- repo/src/lib/components/ContactBlock.svelte -->
<!-- D-18b — large mailto + tel + social cluster, stacked at any breakpoint. -->
<script lang="ts">
	import { site } from '$lib/content';
</script>

<section class="contact">
	<a class="email" href={`mailto:${site.email}`}>{site.email}</a>
	<a class="phone" href={`tel:${site.phone.replace(/[^+\d]/g, '')}`}>{site.phone}</a>
	<ul class="profiles">
		<li><a href={site.social.imdb} target="_blank" rel="noopener">IMDb</a></li>
		<li><a href={site.social.linkedin} target="_blank" rel="noopener">LinkedIn</a></li>
		<li><a href={site.social.vimeo} target="_blank" rel="noopener">Vimeo</a></li>
		<li><a href={site.social.youtube} target="_blank" rel="noopener">YouTube</a></li>
	</ul>
</section>

<style>
	.contact {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		align-items: flex-start;
		padding: var(--space-6) var(--space-4);
	}
	.email,
	.phone {
		font-family: var(--font-display);
		font-weight: 700;
		font-variation-settings: 'opsz' 144;
		text-decoration: none;
		color: inherit;
		line-height: 1.05;
	}
	.email {
		font-size: var(--type-display);
		word-break: break-word;
	}
	.phone {
		font-size: var(--type-h1);
	}
	.email:hover,
	.phone:hover {
		color: var(--color-accent-hover);
	}
	.profiles {
		list-style: none;
		margin: var(--space-3) 0 0;
		padding: 0;
		display: flex;
		gap: var(--space-3);
		flex-wrap: wrap;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		font-size: var(--type-caption);
	}
	.profiles a {
		color: inherit;
		text-decoration: none;
	}
	.profiles a:hover {
		color: var(--color-accent-hover);
	}
</style>
