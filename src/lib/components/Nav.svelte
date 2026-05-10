<!-- repo/src/lib/components/Nav.svelte -->
<!-- D-09 sticky chrome + D-10 mobile hamburger overlay. -->
<!-- NAV-01..NAV-04 driver. -->
<script lang="ts">
  import { base } from '$app/paths';
  import { page } from '$app/state';
  import { pressVisible } from '$lib/content';

  // D-14 active-route reactivity. RESEARCH §1: page is fine-grained reactive
  // from $app/state (SvelteKit 2.12+ runes-native; $app/stores is deprecated).
  // Read page.route.id directly in $derived — no subscription, no $ prefix.
  //
  // Why route.id (NOT page.url.pathname): with kit.paths.relative=true (default),
  // `base` from $app/paths renders as a relative token ('.', '..') so
  // `${base}/work/` evaluates to '../work/' at runtime — NOT comparable to the
  // absolute `page.url.pathname` (e.g. '/michelle_ngo_two/work/'). page.route.id
  // is base-path-independent (e.g. '/work', '/work/[slug]') and is the
  // canonical match key for "which route am I on" comparisons.
  const routeId = $derived(page.route.id);

  // isActive(slug) — exact-match for home (slug === ''), prefix-match for subroutes.
  // Pass the route slug WITHOUT base path: '' for home, 'work' / 'about' / 'press' / 'contact' otherwise.
  function isActive(slug: string): boolean {
    if (slug === '') return routeId === '/';
    return routeId === `/${slug}` || routeId?.startsWith(`/${slug}/`) === true;
  }

  // pressVisible imported from $lib/content (Plan 04-01 export). Replaces
  // Phase 3 hard-coded $state(true) placeholder — Nav now hides Press
  // automatically when press.length < 6 (PRSS-01 conditional).
  // NOTE: pressVisible evaluates TRUE in production because Plan 04-00
  // (this plan's other depends_on) seeds press.json with ≥6 link-verified
  // items per D-02. Without that population, pressVisible would be FALSE
  // and the Press link would silently disappear from Nav.

  let menuOpen = $state(false);
  let menuEl: HTMLElement | undefined = $state();

  function openMenu() {
    menuOpen = true;
    document.body.style.overflow = 'hidden';
    queueMicrotask(() =>
      menuEl?.querySelector<HTMLElement>('a, button')?.focus()
    );
  }

  function closeMenu() {
    menuOpen = false;
    document.body.style.overflow = '';
  }

  function onKeydown(e: KeyboardEvent) {
    if (!menuOpen) return;
    if (e.key === 'Escape') {
      closeMenu();
      return;
    }
    if (e.key !== 'Tab' || !menuEl) return;
    // Trap Tab cycle inside the overlay.
    const focusables = menuEl.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])'
    );
    if (focusables.length === 0) return;
    const first = focusables[0]!;
    const last = focusables[focusables.length - 1]!;
    const active = document.activeElement;
    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }
</script>

<svelte:window onkeydown={onKeydown} />

<nav class="nav" aria-label="Site navigation">
  <a href="{base}/" class="wordmark">MICHELLE NGO</a>

  <ul class="links">
    <li>
      <a
        href="{base}/work/"
        aria-current={isActive('work') ? 'page' : undefined}
      >Work</a>
    </li>
    <li>
      <a
        href="{base}/about/"
        aria-current={isActive('about') ? 'page' : undefined}
      >About</a>
    </li>
    {#if pressVisible}
      <li>
        <a
          href="{base}/press/"
          aria-current={isActive('press') ? 'page' : undefined}
        >Press</a>
      </li>
    {/if}
    <li>
      <a
        href="{base}/contact/"
        aria-current={isActive('contact') ? 'page' : undefined}
      >Contact</a>
    </li>
  </ul>

  <button
    type="button"
    class="hamburger"
    aria-label="Open menu"
    aria-expanded={menuOpen}
    onclick={openMenu}
  >
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <line x1="3" y1="6"  x2="21" y2="6"  stroke="currentColor" stroke-width="1.5"/>
      <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="1.5"/>
      <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="1.5"/>
    </svg>
  </button>
</nav>

{#if menuOpen}
  <div
    bind:this={menuEl}
    role="dialog"
    aria-modal="true"
    aria-label="Site navigation"
    tabindex="-1"
    class="mobile-menu"
    onclick={(e) => {
      if (e.target === e.currentTarget) closeMenu();
    }}
    onkeydown={(e) => {
      if (e.key === 'Enter' && e.target === e.currentTarget) closeMenu();
    }}
  >
    <button
      type="button"
      class="mobile-menu__close"
      aria-label="Close menu"
      onclick={closeMenu}
    >
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
        <line x1="5" y1="5"  x2="19" y2="19" stroke="currentColor" stroke-width="1.5"/>
        <line x1="19" y1="5" x2="5"  y2="19" stroke="currentColor" stroke-width="1.5"/>
      </svg>
    </button>
    <ul class="mobile-menu__links">
      <li>
        <a
          href="{base}/work/"
          aria-current={isActive('work') ? 'page' : undefined}
          onclick={closeMenu}
        >Work</a>
      </li>
      <li>
        <a
          href="{base}/about/"
          aria-current={isActive('about') ? 'page' : undefined}
          onclick={closeMenu}
        >About</a>
      </li>
      {#if pressVisible}
        <li>
          <a
            href="{base}/press/"
            aria-current={isActive('press') ? 'page' : undefined}
            onclick={closeMenu}
          >Press</a>
        </li>
      {/if}
      <li>
        <a
          href="{base}/contact/"
          aria-current={isActive('contact') ? 'page' : undefined}
          onclick={closeMenu}
        >Contact</a>
      </li>
    </ul>
  </div>
{/if}

<style>
  .nav {
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-3) var(--space-4);
    background: color-mix(in oklab, var(--color-bg) 80%, transparent);
    /* Pitfall 6: literal pixel blur, NOT var() — Safari compatibility. */
    -webkit-backdrop-filter: blur(8px);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--color-grey-200);
  }
  .wordmark {
    font-family: var(--font-display);
    font-weight: 700;
    font-variation-settings: 'opsz' 144;
    letter-spacing: -0.01em;
    text-decoration: none;
    color: inherit;
    font-size: var(--type-h3);
  }
  .links {
    display: flex;
    gap: var(--space-4);
    list-style: none;
    margin: 0;
    padding: 0;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-size: var(--type-caption);
  }
  .links a {
    color: inherit;
    text-decoration: none;
  }
  .links a:hover {
    color: var(--color-accent);
  }
  .hamburger {
    display: none;
    background: none;
    border: 0;
    padding: var(--space-2);
    cursor: pointer;
    color: inherit;
  }
  @media (max-width: 767px) {
    .links { display: none; }
    .hamburger { display: inline-flex; }
  }
  .mobile-menu {
    position: fixed;
    inset: 0;
    z-index: 200;
    background: var(--color-bg);
    display: grid;
    place-items: center;
    animation: fade-in 200ms var(--ease-out);
  }
  @keyframes fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  .mobile-menu__close {
    position: absolute;
    top: var(--space-3);
    right: var(--space-4);
    background: none;
    border: 0;
    padding: var(--space-2);
    cursor: pointer;
    color: inherit;
  }
  .mobile-menu__links {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }
  .mobile-menu__links a {
    color: inherit;
    text-decoration: none;
    font-family: var(--font-display);
    font-size: var(--type-h1);
    font-weight: 600;
  }

  /* D-14 active-route indicator — 2px accent underline + aria-current page. */
  /* Reduced-motion blanket from app.css zeroes the transition automatically. */
  .links a {
    border-bottom: 2px solid transparent;
    padding-bottom: var(--space-1);
    transition: border-color 200ms var(--ease-out);
  }
  .links a[aria-current="page"] {
    border-bottom-color: var(--color-accent);
  }
  /* Mobile menu equivalent */
  .mobile-menu__links a {
    border-bottom: 2px solid transparent;
    padding-bottom: var(--space-1);
  }
  .mobile-menu__links a[aria-current="page"] {
    border-bottom-color: var(--color-accent);
  }
</style>
