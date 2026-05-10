<!-- repo/src/routes/404/+page.svelte -->
<!-- D-18 corrected / SEO-05 / RESEARCH §Pattern 6 (prerendered first-paint half of dual-pattern). -->
<!-- adapter-static prerenders this to build/404/index.html. The existing fallback: '404.html' -->
<!-- in svelte.config.js (Phase 1 INFR-05) coexists — community discussion (issue #10880) -->
<!-- suggests adapter-static will overwrite the fallback SPA shell with this prerendered content -->
<!-- so GH Pages serves the BRANDED markup for unknown URLs, not a blank shell. -->
<!-- Plan task verification: cat build/404.html | grep "Lost on set" confirms. -->
<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';
	import { TITLE_TEMPLATE } from '$lib/seo';
	import NotFoundPage from '$lib/components/NotFoundPage.svelte';
</script>

<MetaTags
	title="Not Found"
	titleTemplate={TITLE_TEMPLATE}
	description="This scene didn't make the final cut."
	robots={false}
/>

<NotFoundPage />
