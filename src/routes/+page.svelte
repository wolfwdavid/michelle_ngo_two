<!-- repo/src/routes/+page.svelte -->
<script lang="ts">
	// No imports needed for Phase 1 placeholder.
	// base from '$app/paths' will be needed in Phase 2+ for real internal links.
</script>

<svelte:head>
	<title>Michelle Ngo — Director, Producer, Writer</title>
</svelte:head>

<main>
	<h1>MICHELLE NGO</h1>
	<p class="roles">
		<span>DIRECTOR</span>
		<span>PRODUCER</span>
		<span>WRITER</span>
	</p>
	<p class="contact">
		<a href="mailto:mynogo@gmail.com">mynogo@gmail.com</a>
	</p>
	<p><a href="/foo">synthetic-failure-link-do-not-merge</a></p>
</main>

<style>
	main {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 2rem;
		padding: 2rem;
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
		background: #fff;
		color: #111;
	}
	h1 {
		font-size: clamp(2rem, 8vw, 5rem);
		font-weight: 800;
		letter-spacing: 0.02em;
		margin: 0;
	}
	.roles {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		text-align: center;
		font-size: clamp(1rem, 2vw, 1.5rem);
		letter-spacing: 0.3em;
		margin: 0;
	}
	.contact {
		margin: 0;
		font-size: 1rem;
	}
	.contact a {
		color: inherit;
	}
</style>
