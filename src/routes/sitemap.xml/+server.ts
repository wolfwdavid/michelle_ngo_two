// repo/src/routes/sitemap.xml/+server.ts
// SEO-04 driver. D-17 corrected per RESEARCH §Pattern 5 Approach C:
// SvelteKit +server.ts endpoint with prerender = true. adapter-static prerenders
// this to build/sitemap.xml. Single source of truth via $lib/content (the same
// boundary the routes use — no glob duplication, no Vite-coupled prebuild script).
//
// Anti-pattern guard (RESEARCH "Sitemap.xml committed AND prerendered"):
// repo/static/sitemap.xml MUST NOT exist — adapter-static would prefer the static
// file over the prerendered route output, defeating the dynamic generation.

import { projects } from '$lib/content';
import { base } from '$app/paths';

export const prerender = true;

const SITE_ORIGIN = 'https://wolfwdavid.github.io';

type SitemapEntry = {
	loc: string;
	changefreq: 'monthly' | 'yearly';
};

export function GET(): Response {
	const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

	const staticEntries: SitemapEntry[] = [
		{ loc: `${SITE_ORIGIN}${base}/`, changefreq: 'monthly' },
		{ loc: `${SITE_ORIGIN}${base}/work/`, changefreq: 'monthly' },
		{ loc: `${SITE_ORIGIN}${base}/about/`, changefreq: 'monthly' },
		{ loc: `${SITE_ORIGIN}${base}/press/`, changefreq: 'monthly' },
		{ loc: `${SITE_ORIGIN}${base}/contact/`, changefreq: 'monthly' }
	];

	const projectEntries: SitemapEntry[] = projects.map((p) => ({
		loc: `${SITE_ORIGIN}${base}/work/${p.slug}/`,
		changefreq: 'yearly'
	}));

	const allEntries = [...staticEntries, ...projectEntries];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries
	.map(
		(e) => `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
  </url>`
	)
	.join('\n')}
</urlset>
`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8'
		}
	});
}
