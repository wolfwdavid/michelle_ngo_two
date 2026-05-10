<!-- repo/src/routes/contact/+page.svelte -->
<!-- CTCT-01..03 driver. D-18: <h1>CONTACT</h1> + brief framing line + <ContactBlock />. -->
<!-- ContactBlock (Phase 3 D-18b) handles mailto + tel + 4 social links — stacked column. -->
<!-- CTCT-02 (footer mailto + tel on every page) is satisfied by Footer in +layout.svelte. -->
<script lang="ts">
  import ContactBlock from '$lib/components/ContactBlock.svelte';
</script>

<svelte:head>
  <title>Contact — Michelle Ngo</title>
</svelte:head>

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
    padding: var(--space-5) 0;
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
