<script lang="ts">
  // Design tokens loaded once for the whole site (D-04).
  import '../app.css';
  // Self-hosted Fraunces variable. D-08 corrected per RESEARCH §Pitfall 6:
  // standard.css ships single woff2 with both wght+opsz axes baked (~67KB latin);
  // wght.css+opsz.css dual-import would emit two @font-face declarations sharing
  // family + unicode-range, with browser cascade picking ONE.
  import '@fontsource-variable/fraunces/standard.css';
  // D-06 / D-08 secondary type face (Phase 7). The variable Fontsource package
  // (@fontsource-variable/ibm-plex-mono) is not published — IBM Plex Mono has no
  // variable axis upstream — so we fall back to the static @fontsource/ibm-plex-mono
  // 400 weight per the plan's D-08 contingency. Family name in --font-mono is
  // 'IBM Plex Mono' (no 'Variable') to match the @font-face this import declares.
  import '@fontsource/ibm-plex-mono/400.css';

  import { fade } from 'svelte/transition';
  import { MetaTags } from 'svelte-meta-tags';
  import { base } from '$app/paths';
  import Nav from '$lib/components/Nav.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { absoluteUrl } from '$lib/seo';

  let { children, data } = $props();

  // D-14 default OG image. Per-route MetaTags (Task 2) override this for
  // /work/[slug]/ with the project's own poster. RESEARCH §Pitfall 3:
  // titleTemplate does NOT cascade across MetaTags instances — do NOT set it
  // here. Per-route MetaTags must each repeat titleTemplate.
  //
  // Use absoluteUrl() (not template literals with `base` from $app/paths) —
  // paths.relative=true rebinds `base` to a relative token at prerender,
  // breaking absolute URLs. absoluteUrl reads process.env.BASE_PATH directly.
  const defaultOg = absoluteUrl('/og-default.png');
  const siteUrl = absoluteUrl('/');
</script>

<svelte:head>
  <!-- POLI-04 / D-18b favicon link surface. Final asset swap is HUMAN-UAT
       (Plan VALIDATION); shapes + filenames here are the contract. -->
  <link rel="icon" href="{base}/favicon.ico" sizes="any" />
  <link rel="icon" href="{base}/favicon-32x32.png" type="image/png" sizes="32x32" />
  <link rel="apple-touch-icon" href="{base}/apple-touch-icon.png" sizes="180x180" />
  <link rel="manifest" href="{base}/site.webmanifest" />
</svelte:head>

<!-- D-14: site-level default MetaTags. Per-route MetaTags in each
     +page.svelte override title/description/openGraph/twitter per RESEARCH
     §Pitfall 3 (no cascade — each route repeats titleTemplate). -->
<MetaTags
  title="Michelle Ngo — Director, Producer, Writer"
  description="Filmmaker portfolio of Michelle Ngo — director, producer, writer."
  openGraph={{
    type: 'website',
    url: siteUrl,
    title: 'Michelle Ngo',
    description: 'Filmmaker portfolio — director, producer, writer.',
    siteName: 'Michelle Ngo',
    images: [
      {
        url: defaultOg,
        width: 1200,
        height: 630,
        alt: 'Michelle Ngo — Director, Producer, Writer'
      }
    ]
  }}
  twitter={{
    cardType: 'summary_large_image',
    title: 'Michelle Ngo',
    description: 'Filmmaker portfolio.',
    image: defaultOg,
    imageAlt: 'Michelle Ngo — Director, Producer, Writer'
  }}
/>

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
