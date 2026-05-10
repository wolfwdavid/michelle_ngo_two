<!-- repo/src/routes/_dev/components/+page.svelte -->
<!-- D-22 — visual gallery for all 11 Phase 3 components. -->
<!-- prerender = false (literal) in +page.ts; production omits this route. -->
<script lang="ts">
  import type { PressItem } from '$lib/schema';

  // Components — Nav and Footer are mounted by +layout.svelte (Wave 2),
  // so the gallery references them in notes only (no double-mount).
  import LiteVideo from '$lib/components/LiteVideo.svelte';
  import ProjectCard from '$lib/components/ProjectCard.svelte';
  import WorkGrid from '$lib/components/WorkGrid.svelte';
  import HeroShell from '$lib/components/HeroShell.svelte';
  import AboutSection from '$lib/components/AboutSection.svelte';
  import PressList from '$lib/components/PressList.svelte';
  import ContactBlock from '$lib/components/ContactBlock.svelte';
  import FadeIn from '$lib/components/FadeIn.svelte';
  import ScrollReveal from '$lib/components/ScrollReveal.svelte';

  // Fixture posters via ?enhanced query — direct fixture imports (D-22).
  // Vite resolves at build time. The same enhanced-img Vite plugin used by
  // production posters processes these.
  import vimeoPoster from '$lib/__fixtures__/projects/valid-vimeo/poster.jpg?enhanced';
  import youtubePoster from '$lib/__fixtures__/projects/valid-youtube/poster.jpg?enhanced';

  // Real seeded content (Phase 2 Plan 02-05) — single content boundary (D-25).
  import { projects, press } from '$lib/content';

  // Featured project for HeroShell reel slot (PBS American Portrait per Plan 02-05).
  const featured = projects.find((p) => p.featured) ?? projects[0];

  // Sample 3 cards for the "single-card states" section (variety of role/format).
  const cardSamples = projects.slice(0, 3);

  // Fallback press demo when src/content/press.json is empty (Phase 4 entry
  // gate currently blocks ≥6 link-verified items). Keeping the inline fixture
  // typed as PressItem[] guarantees the gallery never crashes and exercises
  // both the per-project group AND the Profile & Other bucket.
  const pressDemo: readonly PressItem[] =
    press.length > 0
      ? press
      : ([
          {
            publication: 'Variety',
            headline: 'Director Profile (fixture)',
            date: '2024-03-15',
            link: 'https://variety.com/example',
            project: featured?.slug
          },
          {
            publication: 'IndieWire',
            headline: 'Festival Pick (fixture)',
            date: '2023-09-01',
            link: 'https://indiewire.com/example'
          }
        ] as const);
</script>

<svelte:head><title>_dev/components — gallery</title></svelte:head>

<main class="gallery">
  <header class="gallery__head">
    <h1>Component gallery</h1>
    <p>
      D-22 — every Phase 3 component rendered against fixtures or real content.
      This route uses literal <code>prerender = false</code>; adapter-static
      omits it from production builds.
    </p>
  </header>

  <section class="gallery__section">
    <h2>1. Nav</h2>
    <p>
      Sticky <code>Nav</code> is mounted globally by <code>+layout.svelte</code>
      and is visible at the top of this page. Resize the viewport below 768px
      to see the hamburger overlay (D-09 / D-10). NAV-04 manual gate verifies
      no horizontal scroll at 375 / 768 / 1024px.
    </p>
  </section>

  <hr />

  <section class="gallery__section">
    <h2>2. LiteVideo (WORK-02 facade)</h2>
    <p>
      WORK-02 / PERF-03 verification surface: open DevTools Network tab,
      filter <code>vimeo</code> and <code>youtube</code> — should be ZERO matches
      before clicking. Click a poster to mount the iframe.
    </p>

    <h3>Vimeo provider (mode="detail")</h3>
    <LiteVideo
      provider="vimeo"
      id="76979871"
      poster={vimeoPoster}
      title="Big Buck Bunny (Vimeo public test)"
    />

    <h3>YouTube provider (mode="detail")</h3>
    <LiteVideo
      provider="youtube"
      id="dQw4w9WgXcQ"
      poster={youtubePoster}
      title="YouTube embed test"
    />

    <h3>LiteVideo in card mode (oncardclick alerts instead of mounting iframe)</h3>
    <LiteVideo
      provider="vimeo"
      id="76979871"
      poster={vimeoPoster}
      title="Card-mode demo"
      mode="card"
      oncardclick={() => alert('Card click — Phase 4 navigates to /work/[slug]/ via goto')}
    />
  </section>

  <hr />

  <section class="gallery__section">
    <h2>3. WorkGrid + ProjectCard (real seeded projects)</h2>
    <p>
      {projects.length} projects from <code>$lib/content</code>. Explicit
      breakpoint columns 1 / 2 / 3 across &lt;768 / ≥768 / ≥1024 (D-13). Cards
      use <code>mode="card"</code> — clicks navigate to <code>/work/[slug]/</code>
      (Phase 4 owns that route, so expect a 404 fallback).
    </p>
    <WorkGrid {projects} />
  </section>

  <hr />

  <section class="gallery__section">
    <h2>4. ProjectCard — single-card states</h2>
    <p>
      The first three seeded projects in isolation. Each card shows the
      role chip(s), year, and format chip (suppressed for <code>format="other"</code>
      per Phase 2 D-05).
    </p>
    {#each cardSamples as project (project.slug)}
      <div class="single-card">
        <p class="single-card__meta">
          <strong>roles: {project.role.join(', ')} · format: {project.format}</strong>
        </p>
        <ProjectCard {project} />
      </div>
    {/each}
  </section>

  <hr />

  <section class="gallery__section">
    <h2>5. HeroShell (D-16 — structural shell with reel slot)</h2>
    <p>
      Wordmark + role-stack + reel snippet slot. Phase 4 will replace the
      featured-project LiteVideo with the real reel master via HERO-02.
    </p>
    {#if featured}
      <HeroShell>
        {#snippet reel()}
          <LiteVideo
            provider={featured.vimeoId ? 'vimeo' : 'youtube'}
            id={(featured.vimeoId ?? featured.youtubeId)!}
            poster={featured.posterImage}
            title={featured.title}
            mode="hero"
          />
        {/snippet}
      </HeroShell>
    {:else}
      <p><em>No featured project — Phase 2 Plan 02-05 should have seeded one.</em></p>
    {/if}
  </section>

  <hr />

  <section class="gallery__section">
    <h2>6. AboutSection (D-17)</h2>
    <p>
      Two-column at ≥768px (headshot ~40% / body ~60%); stacked on mobile
      with headshot first. The recognition snippet below is stubbed — Phase 4
      ABOUT-04 wires the real value once <code>siteSchema</code> extends.
      Note: <code>static/headshot.jpg</code> + <code>static/resume.pdf</code>
      may 404 (Phase 4 provisioning).
    </p>
    <AboutSection>
      {#snippet recognition()}
        <ul>
          <li>Festival selection — example (stubbed for Phase 3 gallery)</li>
          <li>Award nomination — example (stubbed for Phase 3 gallery)</li>
        </ul>
      {/snippet}
    </AboutSection>
  </section>

  <hr />

  <section class="gallery__section">
    <h2>7. PressList (D-18 accordion)</h2>
    <p>
      Uses real <code>press.json</code> if non-empty; otherwise demonstrates
      with two inline fixture items (currently {press.length} real items, so
      fixture-fed). Resize below 768px to see breakpoint default-collapsed
      behavior (Pitfall 9 escape hatch).
    </p>
    <PressList items={pressDemo} {projects} />
  </section>

  <hr />

  <section class="gallery__section">
    <h2>8. ContactBlock (D-18b)</h2>
    <p>
      Stacked at any breakpoint. Display-size mailto, h1-size tel, then 4
      social profile links. No form, no copy-to-clipboard (CTCT-01).
    </p>
    <ContactBlock />
  </section>

  <hr />

  <section class="gallery__section">
    <h2>9. FadeIn</h2>
    <p>
      Scroll the gallery — the paragraph below fades in on intersection
      (threshold 0.15 from D-19).
    </p>
    <FadeIn>
      <p class="motion-payload">
        FadeIn payload — appears with <code>in:fade</code> when scrolled into view.
      </p>
    </FadeIn>
  </section>

  <hr />

  <section class="gallery__section">
    <h2>10. ScrollReveal</h2>
    <p>Same <code>useReveal</code> action, <code>in:fly</code> with custom distance.</p>
    <ScrollReveal distance={24}>
      <p class="motion-payload">
        ScrollReveal payload — slides up 24px on intersection.
      </p>
    </ScrollReveal>
  </section>

  <hr />

  <section class="gallery__section">
    <h2>11. Footer</h2>
    <p>
      Footer is mounted globally by <code>+layout.svelte</code>; scroll to the
      bottom of this page to see it (NAV-05). Verify it ALSO appears on
      <code>/</code> (Phase 1 home placeholder) to confirm global mounting.
    </p>
  </section>
</main>

<style>
  .gallery {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--space-5) var(--space-4);
  }
  .gallery__head {
    margin-bottom: var(--space-5);
  }
  .gallery__section {
    margin: var(--space-5) 0;
  }
  .gallery__section h2 {
    font-family: var(--font-display);
    font-size: var(--type-h2);
    margin: 0 0 var(--space-3);
  }
  .gallery__section h3 {
    margin: var(--space-4) 0 var(--space-2);
    font-size: var(--type-h3);
  }
  hr {
    border: 0;
    border-top: 1px solid var(--color-grey-200);
    margin: var(--space-5) 0;
  }
  .single-card {
    max-width: 480px;
    margin-bottom: var(--space-5);
  }
  .single-card__meta {
    margin: 0 0 var(--space-2);
    font-size: var(--type-caption);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-grey-500);
  }
  .motion-payload {
    padding: var(--space-4);
    background: var(--color-grey-100);
    margin: 0;
  }
</style>
