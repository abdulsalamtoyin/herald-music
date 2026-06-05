# The Herald Music — Blueprint Redesign Brief

**Date:** 2026-06-05
**Status:** Approved direction, ready to implement (in a fresh session)
**Supersedes:** the immersive 3D direction in `2026-06-05-3d-site-design.md`

## Why this brief exists

We built an immersive gold-on-black 3D version (Three.js orb + particles +
floating notes/lamps). The owner then referenced **https://blueprintapps.io**
and chose to **pivot** to that architectural style. This brief hands the pivot
off to a fresh session to keep cost down. Implement directly from here — the
content inventory and current file layout are summarized below so you do not
need to re-derive them.

## Direction (locked decisions)

| Decision | Choice |
| --- | --- |
| Aesthetic | **Blueprint** — architectural line-grid, precise, restrained (à la blueprintapps.io) |
| Palette | **Blueprint blue**: deep navy background, pale cyan/white grid lines, keep a *touch* of warm gold as accent |
| 3D hero | **Remove it** — replace WebGL orb/particles/motifs with a clean blueprint-grid hero |
| Motion | **Smooth scroll + refined staggered section reveals** (calm easing), animated grid draw-in |
| Content | **Preserve everything** (see inventory below) |

## Suggested palette tokens

```
--bg:        #0a1626   /* deep blueprint navy */
--bg-2:      #0d1d31   /* panel navy */
--grid-line: rgba(150, 200, 235, 0.12)   /* fine cyan-white lines */
--grid-bold: rgba(150, 200, 235, 0.22)   /* every 5th line, brighter */
--ink:       #e8f1fa   /* near-white text */
--muted:     #9fb3c8   /* slate text */
--gold:      #c98b4e   /* retained accent only (CTAs, brand mark) */
```
(Adjust to taste; the point is navy + thin luminous lines + sparing gold.)

## What to REMOVE

- `index.html`: the `<canvas id="heroCanvas">`, the `<script type="importmap">`,
  the `<script type="module" src="js/three-scene.js">`, and the
  `<div class="floating-motifs">` element.
- `js/three-scene.js` — delete (no longer used).
- `js/vendor/three-0.160.0.module.js` — delete (removes the vendored Three.js;
  this also fully retires the supply-chain surface).
- `js/main.js`: remove `spawnMotifs()`, `NOTE_GLYPHS`, `LAMP_SVG`, and the
  `spawnMotifs()` call. The 3D card-tilt (`wireTilt`) can stay or be replaced
  with a flatter hover — owner's call; default to a subtle 2px lift, no rotateX/Y.
- `css/styles.css`: remove the 3D-specific blocks added for the prior direction
  (`.hero-canvas`, `.floating-motifs`/`.motif`/`@keyframes motif-*`,
  `.track-card` perspective/tilt/glare, orb-related depth). Keep general layout.

## What to ADD

1. **Animated blueprint grid background**
   - A fixed, full-page fine line-grid (CSS `repeating-linear-gradient` for the
     base grid, or an SVG pattern; canvas only if you want parallax drift).
   - Every 5th line slightly brighter (`--grid-bold`) for the drafting feel.
   - Subtle parallax/drift on scroll, and a one-time "draw-in" on load.
   - Technical-drawing accents: thin corner ticks/crosshairs at section corners,
     hairline rules under headings, small coordinate-style labels (optional).

2. **Blueprint hero (replacing the 3D hero)**
   - Keep all hero copy: eyebrow "Message in melodies", H1 "Bringing God's word
     to life through song.", sub-paragraph, two CTAs, scroll indicator.
   - Set it over the grid with a faint architectural diagram motif (e.g., a
     line-drawn cross or sound-wave rendered as thin blueprint strokes — gospel
     tie-in without WebGL). Pure SVG/CSS.

3. **Smooth scroll + section motion**
   - Smooth in-page anchor scrolling.
   - Keep/extend the existing IntersectionObserver reveal in `js/main.js`
     (`observeReveals`) but refine: staggered children, gentle translate+fade,
     calm easing (e.g., `cubic-bezier(.22,.61,.36,1)`), respect reduced-motion.

## Content inventory — PRESERVE ALL (unchanged from the site today)

- Head/meta: title, description, OG tags, theme-color, favicon, fonts
  (Cormorant Garamond + Inter).
- Header nav: About, Music, Podcast, Gallery, Book, Contact + "Listen" Spotify
  pill + mobile menu.
- Hero copy (above).
- About: portrait + caption + two bio paragraphs + 3 pillars (Worship /
  Scripture / Story).
- Music: 12 tracks from the `TRACKS` array in `js/main.js` (titles, years,
  covers, Spotify links) + "Follow on Spotify" CTA.
- Podcast: copy + card. Gallery: 3 devotionals (Colossians 2:14, Mark 1:35,
  Galatians 2:20).
- Booking form (8 fields) + Contact form (4 fields) + email + 4 socials.
- Footer: brand, tagline, Explore/Connect/Follow groups, year, "Built with love
  in Queensland."

## Current file layout (for the implementer)

```
index.html            content + (to-remove) 3D hooks
css/styles.css        existing 2D styles + (to-remove) 3D blocks
js/main.js            TRACKS data, renderTracks, forms, nav, observeReveals,
                      wireTilt (3D tilt), spawnMotifs (to remove)
js/three-scene.js     WebGL scene — DELETE
js/vendor/three-*.js  vendored Three.js — DELETE
```

## Constraints

- No build step (static; Netlify/Vercel). Plain HTML/CSS/JS.
- Honor `prefers-reduced-motion` (no grid drift / reveals when set).
- Accessibility: decorative grid/diagram is `aria-hidden`; all content stays
  real DOM text.
- Keep it performant: prefer CSS gradients/SVG for the grid over per-frame JS.

## Recommended first steps in the fresh session

1. `git checkout -b feature/blueprint-redesign`
2. Remove the 3D layer (files + markup + CSS/JS blocks above).
3. Add palette tokens + the blueprint grid background.
4. Rebuild the hero on the grid; refine scroll reveals.
5. Restyle sections/cards to the architectural look.
6. Serve (`python3 -m http.server 8000`) and verify all content + reduced-motion.
7. Brainstorm/plan via superpowers if desired; otherwise implement straight
   from this brief.
