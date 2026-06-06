# Newsletter Email List Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an email-list signup to The Herald Music site that stores subscribers in Faith's free Kit (ConvertKit) account, with two entry points (a band above the footer and a compact footer field) sharing one handler.

**Architecture:** Static site (`index.html`, `css/styles.css`, `js/main.js`, no build step). A new `wireNewsletter()` function — modeled on the existing `wireForm()` — AJAX-POSTs an email to Kit's public form-subscription endpoint and shows an inline status message. A public `KIT_FORM_ID` constant (no secret key) gates the integration; until set to a real value, both forms show a friendly fallback message.

**Tech Stack:** Vanilla HTML/CSS/JS, `fetch`, Kit (ConvertKit) public form endpoint. No test runner exists in this project — verification is `node --check` for JS syntax plus manual browser checks at `localhost:8000`, matching how the existing forms were verified.

**Reference spec:** `docs/superpowers/specs/2026-06-06-newsletter-email-list-design.md`

---

## File structure

- `index.html` — new `<section class="section section-dark newsletter">` band inserted before `<!-- Footer -->` (currently line 370); compact subscribe `<form>` added inside the footer's brand column (after the `.footer-tag` paragraph, line 378).
- `css/styles.css` — new "Newsletter" style block appended in the styles area (e.g. after the footer block, around line 694, before `/* ----- Reveal animation ----- */`).
- `js/main.js` — `KIT_FORM_ID` constant + `wireNewsletter()` added in the Forms section (after `wireForm`, line 179); two init calls added inside `DOMContentLoaded` (line 185).
- `docs/superpowers/specs/2026-06-06-next-steps-brief.md` — newsletter marked done; Kit setup steps documented.

Field/endpoint contract (Kit):
- Endpoint: `https://app.kit.com/forms/<KIT_FORM_ID>/subscriptions`
- Request body (JSON): `{ "email_address": "you@email.com" }`
- Success: HTTP 200 (`res.ok`). Treat any non-OK / network error / placeholder-ID as the fallback path.

---

### Task 1: Add the newsletter band to index.html

**Files:**
- Modify: `index.html` (insert before `<!-- Footer -->`, currently line 370)

- [ ] **Step 1: Insert the band markup**

Insert this block immediately before the `<!-- Footer -->` comment line:

```html
  <!-- Newsletter -->
  <section class="section section-dark newsletter" id="newsletter">
    <div class="container newsletter-inner">
      <p class="eyebrow center">Newsletter</p>
      <h2>Get new releases in your inbox.</h2>
      <p class="newsletter-copy">Be the first to hear new songs, podcast episodes, and where Faith is ministering next.</p>
      <form class="newsletter-form" id="newsletterForm" novalidate>
        <input type="checkbox" name="botcheck" class="hp-field" tabindex="-1" autocomplete="off" aria-hidden="true" />
        <input type="email" name="email_address" aria-label="Email address" placeholder="you@email.com" required />
        <button class="btn btn-primary" type="submit">Subscribe</button>
      </form>
      <p class="form-note newsletter-note" id="newsletterNote" aria-live="polite"></p>
    </div>
  </section>

```

- [ ] **Step 2: Verify HTML structure is intact**

Run: `grep -n "id=\"newsletter\"\|<!-- Footer -->" index.html`
Expected: the `id="newsletter"` line appears immediately above the `<!-- Footer -->` line.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add newsletter signup band above footer"
```

---

### Task 2: Add the compact footer subscribe field

**Files:**
- Modify: `index.html` (footer brand column, after the `.footer-tag` paragraph — currently line 378)

- [ ] **Step 1: Insert the compact form after the footer tag line**

Find this line inside the footer's first `<div>`:

```html
        <p class="footer-tag">…message in melodies. Bringing God's word to life through song.</p>
```

Insert immediately after it:

```html
        <form class="footer-subscribe" id="footerSubscribe" novalidate>
          <input type="checkbox" name="botcheck" class="hp-field" tabindex="-1" autocomplete="off" aria-hidden="true" />
          <input type="email" name="email_address" aria-label="Email address" placeholder="Your email" required />
          <button class="btn btn-primary" type="submit">Join</button>
          <p class="form-note footer-note" id="footerSubscribeNote" aria-live="polite"></p>
        </form>
```

- [ ] **Step 2: Verify both forms exist**

Run: `grep -n "id=\"footerSubscribe\"\|id=\"newsletterForm\"" index.html`
Expected: two lines, one for each form id.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add compact newsletter field to footer"
```

---

### Task 3: Style the newsletter band and footer field

**Files:**
- Modify: `css/styles.css` (append after the footer block, around line 694, before `/* ----- Reveal animation ----- */`)

- [ ] **Step 1: Add the newsletter styles**

Insert this block (it reuses existing tokens `--bg`, `--line`, `--text`, `--accent`, `--text-dim`, `--sans`, `--transition`):

```css
/* ----- Newsletter ----- */
.newsletter-inner { text-align: center; max-width: 640px; margin: 0 auto; }
.newsletter-copy { color: var(--text-dim); margin: 0.75rem auto 2rem; max-width: 46ch; }
.newsletter-form {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}
.newsletter-form input[type="email"] {
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 0.85rem 1rem;
  color: var(--text);
  font-family: var(--sans);
  font-size: 0.95rem;
  min-width: 280px;
  transition: border-color var(--transition);
}
.newsletter-form input[type="email"]:focus { outline: none; border-color: var(--accent); }
.newsletter-form .btn { margin: 0; }
.newsletter-note { text-align: center; margin-top: 1rem; }

/* compact footer subscribe */
.footer-subscribe { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1.25rem; }
.footer-subscribe input[type="email"] {
  flex: 1 1 160px;
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 0.6rem 0.8rem;
  color: var(--text);
  font-family: var(--sans);
  font-size: 0.9rem;
  transition: border-color var(--transition);
}
.footer-subscribe input[type="email"]:focus { outline: none; border-color: var(--accent); }
.footer-subscribe .btn { margin: 0; padding: 0.6rem 1.1rem; }
.footer-note { margin-top: 0.25rem; flex-basis: 100%; }
```

- [ ] **Step 2: Verify the styles were added**

Run: `grep -n "\.newsletter-form\|\.footer-subscribe" css/styles.css`
Expected: at least four matches across the two selectors.

- [ ] **Step 3: Commit**

```bash
git add css/styles.css
git commit -m "style: newsletter band and footer subscribe field"
```

---

### Task 4: Wire the Kit submission handler in main.js

**Files:**
- Modify: `js/main.js` (add after `wireForm` ends at line 179; add init calls inside `DOMContentLoaded` at line 185)

- [ ] **Step 1: Add the constant and handler**

Insert this block immediately after the closing `}` of `wireForm` (line 179), before `// ---------- Year ----------`:

```js
// ---------- Newsletter (Kit / ConvertKit) ----------
// Create a free form at https://kit.com → Grow → Forms, then paste its Form ID
// below. The list goes live the moment this is set. No secret key needed —
// this is the public form id, safe to ship in a static page.
const KIT_FORM_ID = 'YOUR-KIT-FORM-ID';
const KIT_ENDPOINT = (id) => `https://app.kit.com/forms/${id}/subscriptions`;

const NEWSLETTER_FALLBACK =
  'Couldn’t subscribe right now — email theheraldmusic1@gmail.com to be added.';

function wireNewsletter(formId, noteId) {
  const form = document.getElementById(formId);
  const note = document.getElementById(noteId);
  if (!form) return;
  const submitBtn = form.querySelector('[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (form.botcheck && form.botcheck.checked) return;   // honeypot: silently ignore bots
    if (!form.reportValidity()) return;

    if (!KIT_FORM_ID || KIT_FORM_ID === 'YOUR-KIT-FORM-ID') {
      note.textContent = NEWSLETTER_FALLBACK;
      setTimeout(() => { note.textContent = ''; }, 8000);
      return;
    }

    const email = form.email_address.value.trim();
    note.textContent = 'Subscribing…';
    if (submitBtn) submitBtn.disabled = true;

    try {
      const res = await fetch(KIT_ENDPOINT(KIT_FORM_ID), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email_address: email }),
      });
      if (res.ok) {
        note.textContent = 'Thanks! Please check your inbox to confirm your subscription.';
        form.reset();
      } else {
        note.textContent = NEWSLETTER_FALLBACK;
      }
    } catch {
      note.textContent = NEWSLETTER_FALLBACK;
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      setTimeout(() => { note.textContent = ''; }, 8000);
    }
  });
}
```

- [ ] **Step 2: Add init calls**

In the `DOMContentLoaded` listener (line 185), after the two existing `wireForm(...)` calls, add:

```js
  wireNewsletter('newsletterForm', 'newsletterNote');
  wireNewsletter('footerSubscribe', 'footerSubscribeNote');
```

- [ ] **Step 3: Verify JS syntax**

Run: `node --check js/main.js`
Expected: no output (exit 0 = syntax OK).

- [ ] **Step 4: Verify wiring markers**

Run: `grep -n "KIT_FORM_ID\|wireNewsletter" js/main.js`
Expected: the constant definition, the function definition, and the two init calls.

- [ ] **Step 5: Commit**

```bash
git add js/main.js
git commit -m "feat: wire newsletter forms to Kit (ConvertKit)"
```

---

### Task 5: Manual verification + document Kit setup

**Files:**
- Modify: `docs/superpowers/specs/2026-06-06-next-steps-brief.md`

- [ ] **Step 1: Serve and load the site**

Run: `python3 -m http.server 8000`
Then open `http://localhost:8000` in a browser.

- [ ] **Step 2: Verify behavior (placeholder-ID path)**

With `KIT_FORM_ID` still at `'YOUR-KIT-FORM-ID'`:
- The newsletter band renders above the footer; heading + copy + email field + Subscribe button.
- The footer brand column shows the compact email + Join field.
- Submitting an empty/invalid email is blocked by the browser (validation bubble).
- Submitting a valid email shows the fallback note: "Couldn't subscribe right now — email theheraldmusic1@gmail.com to be added." (because no real Form ID is set).
- No console errors.

- [ ] **Step 3: Document the Kit setup steps**

In `docs/superpowers/specs/2026-06-06-next-steps-brief.md`, under the "Suggested professional polish" → "Newsletter / email capture" item, replace that bullet with a short DONE note plus setup steps:

```markdown
- **Newsletter / email capture — DONE (needs Form ID).** Signup band above the
  footer + compact footer field, both wired to Kit (ConvertKit). To activate:
  1. Create a free account at <https://kit.com> and create a Form.
  2. Copy the Form's numeric ID.
  3. In `js/main.js`, set `const KIT_FORM_ID = '<your-id>';`.
  4. Submit a test email on the live site; confirm it appears in Kit and the
     confirmation email arrives. Then send releases via Kit → Broadcasts.
```

- [ ] **Step 4: Final JS syntax re-check**

Run: `node --check js/main.js`
Expected: no output (exit 0).

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/specs/2026-06-06-next-steps-brief.md
git commit -m "docs: mark newsletter done; add Kit setup steps"
```

---

## Notes for the implementer

- **Live Kit test is owner-gated.** A real subscribe round-trip can only be confirmed once Faith creates a Kit form and sets `KIT_FORM_ID`. Until then, the placeholder-ID fallback path (Task 5, Step 2) is the verification. If a real ID is available during implementation, also confirm: success message shows, the address appears in Kit, and no CORS error appears in the console.
- **CORS fallback (from the spec):** if the browser console shows a CORS error on submit with a real ID, switch the two forms to a plain HTML `<form method="POST" action="https://app.kit.com/forms/<id>/subscriptions">` (no `e.preventDefault()`), keeping the email-only fields and both entry points; Kit then shows its own hosted confirmation. Re-run `node --check` and the manual load.
- Keep the existing Web3Forms contact/booking forms untouched.
```