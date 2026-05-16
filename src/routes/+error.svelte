<!-- repo/src/routes/+error.svelte -->
<!-- D-18 corrected / SEO-05 / RESEARCH §Pattern 6 (in-app navigation error half of dual-pattern). -->
<!-- Renders inside +layout.svelte chrome → gets Nav + Footer + page-fade for free. -->
<!-- For GH-Pages-served deep-link 404 first paint, see repo/src/routes/404/+page.svelte. -->
<script lang="ts">
	import { page } from '$app/state';
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

<!-- Pass page.error?.message so a thrown error() with a custom message overrides the default copy. -->
<NotFoundPage message={page.error?.message} />
