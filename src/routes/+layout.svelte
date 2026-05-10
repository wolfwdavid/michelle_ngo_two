<script lang="ts">
  // Design tokens loaded once for the whole site (D-04).
  import '../app.css';
  // Self-hosted Fraunces variable, weight axis only (D-01, D-02; smallest payload).
  import '@fontsource-variable/fraunces/wght.css';

  import { fade } from 'svelte/transition';
  import Nav from '$lib/components/Nav.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import favicon from '$lib/assets/favicon.svg';

  let { children, data } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<Nav />

<!-- D-12 / POLI-03: in-only fade keyed on data.url. -->
<!-- NO out: directive — SvelteKit unmounts before mount; out: would race. -->
<!-- The load() in +layout.ts supplies data.url BEFORE the slot swaps. -->
{#key data.url}
  <main in:fade={{ duration: 180 }}>
    {@render children()}
  </main>
{/key}

<Footer />
