<!-- repo/src/routes/_debug/+page.svelte -->
<!-- Dev-only content inspector. NOT served in production (prerender = false). -->
<script lang="ts">
  import { projects, press, site, getProjectSlugs, formatCredits } from '$lib/content';
</script>

<svelte:head>
  <title>_debug — content inspector</title>
</svelte:head>

<h1>Content debug</h1>

<p>
  <strong>Indexer state:</strong>
  {projects.length} projects · {press.length} press items · site.email = <code>{site.email}</code>
</p>

<h2>Projects ({projects.length})</h2>
{#if projects.length === 0}
  <p><em>No projects indexed yet. Plan 02-05 seeds the first 6+.</em></p>
{:else}
  <table border="1" cellpadding="4" cellspacing="0">
    <thead>
      <tr>
        <th>Slug</th>
        <th>Title</th>
        <th>Year</th>
        <th>Role</th>
        <th>Format</th>
        <th>Featured</th>
        <th>Weight</th>
        <th>Provider</th>
        <th>Credits</th>
      </tr>
    </thead>
    <tbody>
      {#each projects as p (p.slug)}
        <tr>
          <td><code>{p.slug}</code></td>
          <td>{p.title}</td>
          <td>{p.year}</td>
          <td>{p.role.join(', ')}</td>
          <td>{p.format}</td>
          <td>{p.featured ? 'YES' : ''}</td>
          <td>{p.weight}</td>
          <td>{p.vimeoId ? `vimeo:${p.vimeoId}` : `youtube:${p.youtubeId}`}</td>
          <td>
            {#each formatCredits(p.credits) as line}
              <div>{line}</div>
            {/each}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

<h2>Press ({press.length})</h2>
{#if press.length === 0}
  <p><em>No press items yet.</em></p>
{:else}
  <ol>
    {#each press as item, i (i)}
      <li>
        {item.date} —
        <a href={item.link} target="_blank" rel="noopener">{item.publication}</a>:
        {item.headline}
        {#if item.project}<em>(→ {item.project})</em>{/if}
      </li>
    {/each}
  </ol>
{/if}

<h2>Site config</h2>
<pre>{JSON.stringify(site, null, 2)}</pre>

<h2>Helpers</h2>
<p><strong>getProjectSlugs():</strong> <code>{JSON.stringify(getProjectSlugs())}</code></p>

<hr />
<small>
  Dev-only route (D-20 / CONT-03). Not served in production.
  Hit / on the deployed URL to see the placeholder home; / _debug / 404s.
</small>
