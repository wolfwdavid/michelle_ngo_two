<script lang="ts">
  // Design tokens loaded once for the whole site (D-04).
  import '../app.css';
  // Self-hosted Fraunces variable. D-08 corrected per RESEARCH §Pitfall 6:
  // standard.css ships single woff2 with both wght+opsz axes baked (~67KB latin);
  // wght.css+opsz.css dual-import would emit two @font-face declarations sharing
  // family + unicode-range, with browser cascade picking ONE.
  import '@fontsource-variable/fraunces/standard.css';

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
