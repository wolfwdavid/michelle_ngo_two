---
# ============================================================================
# PROJECT FRONTMATTER TEMPLATE
# ============================================================================
# Copy this file:
#   1. Pick a slug for your project (lowercase letters/digits/hyphens only).
#      Example slug: pbs-american-portrait
#   2. Create a folder: src/content/projects/<your-slug>/
#   3. Copy this file into the new folder, RENAMING IT TO index.md.
#      (NOT _template.md — the leading underscore is a defense flag and the
#      indexer skips files it sees that name.)
#   4. Drop a poster image into the same folder named poster.jpg
#      (or .png, .webp, .avif). The indexer finds it by convention.
#   5. Replace every TODO_* placeholder below.
#   6. Replace the synopsis body (the text below the closing ---) with
#      one or more paragraphs of plain markdown.
#
# See $lib/schema.ts (projectSchema) for the full validation rules.
# The build will FAIL with a clear error pointing at this file if anything
# is invalid.
# ============================================================================

# REQUIRED — title (string, non-empty)
# The display title shown on /work/ cards and /work/<slug>/ headers.
title: TODO_TITLE

# REQUIRED — year (integer, between 1990 and next year)
# The release year. Used for sort tiebreak (newer wins).
year: TODO_YEAR

# REQUIRED — role[] (array of: "director" | "producer" | "writer")
# Multi-role allowed. Free strings are REJECTED.
role:
  - TODO_ROLE
# Examples:
# role:
#   - director
# role:
#   - director
#   - writer

# REQUIRED — format (one of: "commercial", "short film", "feature",
#                            "music video", "documentary",
#                            "branded content", "other")
# The work category. "other" exists for hybrid work; UI will not render
# a format chip for "other" (Phase 4 fallback).
format: TODO_FORMAT

# REQUIRED — poster (string, non-empty, relative path)
# Convention-based: the indexer finds the poster file in this folder
# automatically. This frontmatter field is INFORMATIONAL — it documents
# what the author put on disk. Don't hardcode /michelle_ngo_two/... paths
# here (D-26 lint guard exempts content/ but the path would break at
# runtime anyway).
poster: TODO_POSTER

# REQUIRED — exactly one of vimeoId / youtubeId (XOR)
# Vimeo IDs are numeric strings (quote them so YAML doesn't parse as a number).
# YouTube IDs are exactly 11 characters: [A-Za-z0-9_-].
# Both set OR neither set FAILS the build with a clear XOR error.
vimeoId: TODO_VIMEO_ID
# youtubeId: TODO_YOUTUBE_ID    # uncomment this line and DELETE the vimeoId
#                               # line above if the work is on YouTube

# OPTIONAL — client (string)
# Recommended for `format: commercial` and `format: branded content`.
# client: PBS

# OPTIONAL — credits (object: role-key → name)
# Bound in Phase 4 templates as {#each Object.entries(credits) as [role, name]}.
# An empty object {} is allowed; the field itself is optional.
# credits:
#   cinematographer: Jane Doe
#   editor: John Smith
#   sound: Lee Adams

# OPTIONAL — featured (boolean, default false)
# Exactly ONE project per build may have featured: true. That project is
# selected as the hero on the landing page (HERO-* in Phase 4).
# featured: false

# OPTIONAL — weight (number, default 0)
# Sort key for /work/. Higher = earlier. Year DESC is the tiebreak.
# Use 0 for normal, 10 for highlights, 100 for absolute top of grid.
# weight: 10

# OPTIONAL — tagline (string, one-line hook for cards)
# Short copy shown next to the title on /work/ cards.
# tagline: A producer's letter to the form

# OPTIONAL — previewClip (string, relative path)
# Path to a small (≤200KB, ≤8s, muted) MP4 hover-loop clip. Phase 5 only.
# If absent, /work/ shows the static poster on hover.
# previewClip: ./preview.mp4
---

Write the synopsis here as plain markdown. One or more paragraphs. This text
becomes the project's body on /work/<slug>/. Plain text, headings (##), lists,
bold, italic, and links are all supported via mdsvex.

DO NOT use enhanced:img tags inside this body — they break under mdsvex
(RESEARCH Pitfall 1). If you want inline stills, talk to Claude — Phase 4 will
add a Still Svelte component you can use here.

DO NOT hardcode any path starting with /michelle_ngo_two/ — the production
base path is injected at render time. Use relative paths or $app/paths base
in components.
