<!-- repo/src/routes/contact/+page.svelte -->
<!-- CTCT-01..03 driver. D-18: <h1>CONTACT</h1> + brief framing line + <ContactBlock />. -->
<!-- ContactBlock (Phase 3 D-18b) handles mailto + tel + 4 social links — stacked column. -->
<!-- CTCT-02 (footer mailto + tel on every page) is satisfied by Footer in +layout.svelte. -->
<script lang="ts">
  import { MetaTags } from 'svelte-meta-tags';
  import ContactBlock from '$lib/components/ContactBlock.svelte';
  import { TITLE_TEMPLATE, absoluteUrl } from '$lib/seo';

  // SEO-01/02: per-route MetaTags. Pitfall 3: titleTemplate must be repeated.
  const contactUrl = absoluteUrl('/contact/');
  const ogDefaultUrl = absoluteUrl('/og-default.png');
</script>

<MetaTags
  title="Contact"
  titleTemplate={TITLE_TEMPLATE}
  description="Contact Michelle Ngo for project inquiries, agencies, casting. Direct email and phone."
  canonical={contactUrl}
  openGraph={{
    type: 'website',
    url: contactUrl,
    title: 'Contact — Michelle Ngo',
    description: 'Direct email and phone for project inquiries.',
    siteName: 'Michelle Ngo',
    images: [{ url: ogDefaultUrl, width: 1200, height: 630 }]
  }}
  twitter={{
    cardType: 'summary_large_image',
    title: 'Contact — Michelle Ngo',
    description: 'Direct contact.',
    image: ogDefaultUrl
  }}
/>

<section class="contact-page">
  <h1>CONTACT</h1>
  <!-- D-18 framing line — single sentence, body-size, muted grey color. -->
  <!-- Sets expectations for what email/phone are for (industry-hirer reach). -->
  <p class="framing">For project inquiries, agencies, casting:</p>

  <ContactBlock />
</section>

<style>
  .contact-page {
    max-width: 1200px;
    margin: 0 auto;
    /* D-13 / Phase 4 audit Top 1 carryover: removed `padding: var(--space-5) 0` */
    /* — route + ContactBlock-internal padding was double-stacking, pushing the */
    /* mailto CTA ~9.5rem off the top of the viewport on 375x667 (mobile 30s */
    /* core-value violation). ContactBlock owns its own internal padding. */
  }
  h1 {
    font-family: var(--font-display);
    font-weight: 700;
    font-variation-settings: 'opsz' 144;
    font-size: var(--type-h1);
    letter-spacing: -0.01em;
    text-transform: uppercase;
    margin: 0 var(--space-4) var(--space-3);
  }
  .framing {
    font-family: var(--font-display);
    font-size: var(--type-body);
    color: var(--color-grey-500);
    margin: 0 var(--space-4) var(--space-4);
    font-style: italic;
  }
  @media (min-width: 768px) {
    h1 {
      margin: 0 var(--space-5) var(--space-3);
    }
    .framing {
      margin: 0 var(--space-5) var(--space-4);
    }
  }
</style>
