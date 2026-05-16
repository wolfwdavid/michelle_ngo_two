<!-- repo/src/lib/components/Footer.svelte -->
<!-- D-11 / NAV-05 / CTCT-02. -->
<script lang="ts">
  import { site } from '$lib/content';

  const year = new Date().getFullYear();
</script>

<footer class="footer">
  <div class="col col--contact">
    <h3>Contact</h3>
    <p>
      <a class="mono" href={`mailto:${site.email}`}>{site.email}</a>
    </p>
    <p>
      <a class="mono" href={`tel:${site.phone.replace(/[^+\d]/g, '')}`}>{site.phone}</a>
    </p>
  </div>

  <div class="col col--social">
    <h3>Profiles</h3>
    <ul>
      <li><a href={site.social.imdb}    target="_blank" rel="noopener">IMDb</a></li>
      <li><a href={site.social.linkedin} target="_blank" rel="noopener">LinkedIn</a></li>
      <li><a href={site.social.vimeo}    target="_blank" rel="noopener">Vimeo</a></li>
      <li><a href={site.social.youtube}  target="_blank" rel="noopener">YouTube</a></li>
    </ul>
  </div>

  <div class="col col--copy">
    <p>© {year} Michelle Ngo</p>
  </div>
</footer>

<style>
  .footer {
    margin-top: var(--space-7);
    padding: var(--space-5) var(--space-4);
    border-top: 1px solid var(--color-grey-200);
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-4);
    font-size: var(--type-caption);
  }
  @media (min-width: 768px) {
    .footer {
      grid-template-columns: 1fr 1fr 1fr;
      gap: var(--space-5);
      align-items: start;
    }
  }
  .col h3 {
    margin: 0 0 var(--space-2);
    font-size: var(--type-caption);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--color-grey-500);
  }
  .col p {
    margin: 0 0 var(--space-1);
  }
  .col a {
    color: inherit;
    text-decoration: none;
  }
  .col a:hover {
    color: var(--color-accent-hover);
  }
  .col--social ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }
  .col--copy p {
    color: var(--color-grey-500);
  }
</style>
