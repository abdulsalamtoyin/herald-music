# The Herald Music — Next Steps Brief

**Date:** 2026-06-06
**Branch:** `main` (recent work committed locally, **not pushed** to origin)
**Purpose:** Hand off remaining tasks to a fresh, cheaper session. Implement
straight from here.

## Current state (what's already done)

The site is the **animated 3D edition** (Three.js hero orb + particles, tilt
album cards). Recently completed and committed on `main`:

- Removed the floating notes/lamps motif layer.
- Livelier "Recent releases" grid (staggered spring-in, cover zoom, sheen, glow).
- Forms wired to **Web3Forms** (AJAX) — *needs an access key, see below*.
- Spotify artist player embedded above the track grid.
- Cover art hardened (intrinsic width/height, `decoding=async`, initials fallback).
- YouTube "▶ Watch" links: header pill, mobile menu, podcast button, podcast thumbnail.
- Songs sorted newest-first by release year (`renderTracks`).
- Podcast "On the show" series: Message in Melodies / Talk with Faith /
  Health, Family & Motherhood.

Files: `index.html`, `css/styles.css`, `js/main.js` (no build step; static).

## 1. REQUIRED — activate the contact/booking forms

The forms POST to Web3Forms but use a placeholder key. Until set, they show a
friendly error instead of sending.

- Get a free key at <https://web3forms.com> (enter the destination email; they
  email the key).
- In `js/main.js`, replace:
  ```js
  const WEB3FORMS_KEY = 'YOUR-WEB3FORMS-ACCESS-KEY';
  ```
  with the real key.
- Then test: submit each form locally (`python3 -m http.server 8000`) and
  confirm the email arrives. Honeypot field `botcheck` + per-form `subject`
  are already in place.

## 2. Verify in a real browser

The last few sessions could not auto-screenshot (Playwright bridge offline).
Load `localhost:8000` and eyeball:
- Hero 3D orb renders; no console errors.
- Track grid: newest-first order, staggered entrance, hover zoom/sheen/glow.
- Spotify embed plays; YouTube "Watch" links open the channel.
- Podcast series cards render 3-up (1-up on mobile).
- Reduced-motion: animations disabled when OS setting is on.

## 3. Suggested professional polish (not yet done)

Pick per owner priority:

- **OG / social image** — add `og:image` + Twitter card meta + a branded
  1200×630 share image so links preview nicely.
- **SEO structured data** — JSON-LD `MusicGroup`/`Person` with `sameAs`
  (Spotify, YouTube, Instagram, X) for rich results. Add canonical URL.
- **Newsletter / email capture** — "Get new releases in your inbox"
  (Mailchimp / ConvertKit / Buttondown) to grow an audience list.
- **Scrollspy** — highlight the active section in the nav on scroll.
- **Real per-track Spotify links** — most track cards currently point to the
  artist page, not the individual song. Paste real
  `open.spotify.com/track/<id>` URLs into the `TRACKS` array in `js/main.js`.
- **Streaming row** — Spotify + Apple Music + YouTube links on hero/footer.
- **Accessibility** — skip-to-content link, visible focus rings.
- **Press/EPK** — short downloadable bio for bookers; optional testimonials /
  "where Faith has ministered" strip for social proof.

## 4. Housekeeping

- Commits on `main` are **local only** — push when ready (`git push`).
- Leftover branch `feature/3d-edition` still exists; delete if unwanted.
- Keep honoring `prefers-reduced-motion`; decorative layers stay `aria-hidden`.
