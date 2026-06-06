# The Herald Music — Newsletter Email List Design

**Date:** 2026-06-06
**Status:** Approved (brainstorming) → ready for implementation plan
**Branch target:** `main` (static site, no build step)

## Goal

Let visitors subscribe to The Herald Music's email list directly on the
website. Subscribers are stored in Faith's free **Kit (ConvertKit)** account so
she can later broadcast new-release announcements to everyone from one
dashboard. Kit's free tier covers up to 10,000 subscribers with broadcasts
included — the closest fit to "never need to pay."

## Non-goals

- No first-name or other fields — **email-only** (lowest friction).
- No automated test harness (this static project has none; matches existing
  manual verification of the contact/booking forms).
- No server, build step, or secret API keys in the page.
- Not switching the existing contact/booking forms off Web3Forms.

## Architecture

The site is static (`index.html`, `css/styles.css`, `js/main.js`, no build).
The newsletter reuses the existing form pattern.

- A new `wireNewsletter()` function in `js/main.js`, modeled on the existing
  `wireForm()` (see `js/main.js:138`).
- A public config constant beside `WEB3FORMS_KEY` (`js/main.js:135`):
  ```js
  const KIT_FORM_ID = 'YOUR-KIT-FORM-ID'; // Kit → Grow → Forms → Embed → form id
  ```
- **Endpoint:** `https://app.kit.com/forms/<KIT_FORM_ID>/subscriptions`
  (public form-subscription endpoint; no secret key — safe for a client-side
  static site).
- Until `KIT_FORM_ID` is set to a real value, the form shows a friendly
  fallback message instead of erroring — the same defensive pattern used for
  the Web3Forms placeholder key.
- **Verify at implementation:** confirm the public form-subscription endpoint
  accepts cross-origin AJAX (so the inline status message works). If Kit does
  not allow CORS for AJAX, fall back to a plain HTML `<form>` POST (standard
  Kit embed) with the success/status shown via Kit's hosted confirmation —
  still email-only, still both entry points.

## Entry points (two forms, one shared handler)

1. **Dedicated band above the footer** — a `<section class="newsletter">` with:
   - Heading: "Get new releases in your inbox"
   - One sentence of supporting copy
   - Email input + "Subscribe" button
   - Inline status line (`aria-live="polite"`)
2. **Compact footer field** — a small email input + button in a new footer
   column next to the existing contact links.

Both forms call the same `wireNewsletter()` and post to the same Kit form, so
all subscribers land in one list regardless of entry point.

## UX & behavior

Mirrors the existing forms (`js/main.js:144-178`):

- `reportValidity()` validation before submit.
- Hidden **honeypot** field for bot filtering (same approach as `botcheck`).
- "Subscribing…" status + submit button disabled during the request.
- On success: show success message and `form.reset()`.
- Inline note auto-clears after 8 seconds.

**Messages:**

- Success: `Thanks! Please check your inbox to confirm your subscription.`
  (Covers Kit double opt-in, which sends a confirmation email when enabled.)
- Error / network failure / unset `KIT_FORM_ID`:
  `Couldn't subscribe right now — email theheraldmusic1@gmail.com to be added.`

## Styling & accessibility

- New CSS in `css/styles.css` matching the site's `.form-card` and button
  styles and color palette; the band gets a subtle treatment consistent with
  the recent "Recent releases" polish.
- Honors `prefers-reduced-motion`.
- Labels properly associated with inputs; decorative elements `aria-hidden`.
- Status line uses `aria-live="polite"` so screen readers announce results.

## Owner setup (one-time, document in the next-steps brief)

1. Create a free Kit (ConvertKit) account.
2. Create a Form; copy its Form ID.
3. Paste it into `KIT_FORM_ID` in `js/main.js`.
4. Signups then flow into Kit; broadcasts are sent from the Kit dashboard.

## Testing

Manual verification (same as existing forms):

- Serve locally (`python3 -m http.server 8000`).
- Submit from both the band and the footer field.
- Confirm: valid email proceeds; invalid email is blocked by validation;
  honeypot path is handled; placeholder `KIT_FORM_ID` shows the fallback
  message.

## Files touched

- `index.html` — newsletter band section + footer field.
- `css/styles.css` — newsletter band + footer field styles.
- `js/main.js` — `KIT_FORM_ID` constant, `wireNewsletter()`, init wiring.
- `docs/superpowers/specs/2026-06-06-next-steps-brief.md` — mark newsletter
  done; add Kit setup steps.
