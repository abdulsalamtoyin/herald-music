# The Herald Music — 3D Edition: Design Spec

**Date:** 2026-06-05
**Status:** Approved (design), pending spec review
**Author:** Toyin Abdulsalam (with Claude)

## Goal

Convert the existing single-page Herald Music site into a "stunning" immersive
3D experience **without losing any existing information**. Every piece of
content — bio, scripture references, track list, forms, links, meta tags —
remains present and functional.

## Core Principle: 3D as a Layer, Not a Replacement

All content stays in real, semantic HTML. Three.js (WebGL) renders *behind and
around* the content for depth and motion. If WebGL is unavailable or the user
prefers reduced motion, the site gracefully falls back to the existing elegant
2D design. Nothing breaks; nothing is lost.

This matters because:
- A `<canvas>` is invisible to search engines and screen readers. Keeping text
  as real HTML preserves SEO, accessibility, and the requirement that "all the
  information is still there."
- The current site is zero-build static (Netlify/Vercel). The 3D version keeps
  that — no bundler, Three.js via CDN ES modules + importmap.

## Decisions (from brainstorming)

| Decision | Choice |
| --- | --- |
| 3D technology | Three.js immersive (real WebGL) |
| Aesthetic | Keep warm gold (`#c98b4e`) on near-black (`#0a0a0a`), reverent/cinematic |
| Hero centerpiece | Glowing **light orb with a faint cross of light inside**, slowly rotating |
| Build step | None — Three.js via CDN ES module + importmap |

## Content Inventory (must all be preserved)

- **Meta/head:** title, description, OG tags, theme-color, favicon, fonts
  (Cormorant Garamond + Inter), `css/styles.css` link.
- **Header/nav:** brand, primary nav (About, Music, Podcast, Gallery, Book,
  Contact), "Listen" Spotify pill, mobile menu.
- **Hero:** eyebrow "Message in melodies", H1 "Bringing God's word to life
  through song.", sub-paragraph, two CTAs, scroll indicator.
- **About:** portrait (`images/faith-portrait.jpg`) + caption, full two-paragraph
  bio, "Three threads, one melody" pillars (Worship / Scripture / Story).
- **Music:** 12 tracks injected by `js/main.js` (`TRACKS` array — titles, years,
  covers, Spotify links). "Follow on Spotify" CTA.
- **Podcast:** copy + "Invite Faith on your show" link + podcast card.
- **Gallery:** 3 devotionals — Colossians 2:14 (Redemption), Mark 1:35 (Audience
  of One), Galatians 2:20 (He Died to Replace It).
- **Booking form:** name, email, phone, date, event type (select), venue,
  details, submit + live note. Wired in `main.js`.
- **Contact form:** name, email, subject, message, submit + live note. Wired in
  `main.js`. Plus email link and 4 social links.
- **Footer:** brand, tagline, Explore/Connect/Follow link groups, copyright +
  year (set by JS), "Built with love in Queensland."

## Architecture

```
index.html            semantic content (unchanged text) + canvas/depth wrappers
css/styles.css        existing styles kept + extended (depth, glass, glow, tilt)
js/three-scene.js     NEW — WebGL world (scene, camera, particles, orb+cross,
                      scroll/mouse motion). Self-disables on no-WebGL / reduced-motion.
js/main.js            kept (tracks, forms, nav, reveals) + 3D tilt-card wiring
```

- Three.js loaded via `<script type="importmap">` + `import * as THREE from 'three'`
  from a CDN (e.g. esm.sh / unpkg / jsDelivr pinned version).
- `three-scene.js` exposes a small init that the page calls after
  `DOMContentLoaded`, only when WebGL + motion are allowed.

## The 3D Experience (section by section)

- **Hero:** Full-viewport fixed WebGL canvas behind hero text. Drifting golden
  particle starfield + a softly glowing light orb that slowly rotates, with a
  faint cross of light visible inside it. Hero text parallax-floats on
  mouse-move (subtle, capped).
- **Music:** The 12 album cards become 3D tilt cards (rotate toward cursor +
  sheen/glare). Covers, titles, years, Spotify links unchanged.
- **Scroll:** Camera and particle field drift with scroll position (depth
  parallax) to tie sections together.
- **About / Pillars / Gallery:** Glassmorphic panels with soft depth; existing
  scroll-reveal preserved. Devotional cards get a gentle 3D float/tilt.
- **Forms / Footer:** Functionally untouched; restyled to match depth aesthetic.

## Performance & Safety (error handling)

- **WebGL feature-detect** → if unsupported, never create the scene; the 2D site
  stands on its own.
- **`prefers-reduced-motion: reduce`** → no animation loop; static orb image or
  plain dark hero background.
- **Render loop paused** when tab hidden (`visibilitychange`) and when the hero
  canvas is scrolled off-screen (IntersectionObserver).
- **Capped `devicePixelRatio`** (e.g. ≤ 2) and throttled mouse handlers for
  smooth mobile.
- **Lazy/large images:** existing `loading="lazy"` kept; tilt cards must not
  force eager decode.
- **Graceful CDN failure:** if the Three.js import fails, catch and fall back to
  2D — no uncaught errors, no blank hero.

## Testability / Units

- `three-scene.js` is one isolated unit: input = a canvas/container + config;
  output = a running (and stoppable) scene. Can be reasoned about without
  touching `main.js`.
- Fallback path is independently verifiable: disable WebGL / set reduced-motion
  and confirm full content + working forms remain.
- `main.js` track/form/nav logic is unchanged behavior; tilt wiring is additive.

## Out of Scope (YAGNI)

- No backend / form submission service (still client-side acknowledgement).
- No build tooling, framework, or TypeScript migration.
- No new content, copy, or images beyond what exists.
- No literal 3D models/GLTF assets — orb + cross are generated procedurally.

## Success Criteria

1. All content from the inventory above is present and functional.
2. Hero shows the glowing orb-with-cross + golden particles on WebGL-capable
   browsers.
3. Album cards tilt in 3D toward the cursor.
4. With WebGL disabled or reduced-motion on, the site is fully usable and
   still looks polished (2D fallback).
5. Smooth on mobile (no jank, paused when off-screen/hidden).
6. No build step required; deploys as static like today.
