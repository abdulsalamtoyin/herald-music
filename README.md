# The Herald Music — Replica Site

A static, single-page replica of [theheraldmusic.lovable.app](https://theheraldmusic.lovable.app/).
Pure HTML / CSS / vanilla JS — no framework, no build step, ready to deploy
to any static host.

## Folder structure

```
herald-music/
├── index.html          # Page content & structure
├── css/
│   └── styles.css      # Dark, gold-accented theme
├── js/
│   └── main.js         # Discography, nav, scroll reveal, forms
├── images/
│   ├── favicon.svg     # Site icon
│   └── README.md       # Where to drop real photos
├── netlify.toml        # Netlify config (drag-and-drop ready)
├── vercel.json         # Vercel config
├── robots.txt
├── sitemap.xml
├── package.json        # `npm run dev` for local preview
└── .gitignore
```

## Local preview

You don't need Node to view it — just open `index.html` in a browser.
But for a proper local server (so anchors and fetches behave normally):

```bash
cd herald-music
npm run dev          # opens on http://localhost:5173
```

That uses `npx serve` under the hood; no install required.

## Customising

| What                                | Where                                                                |
| ----------------------------------- | -------------------------------------------------------------------- |
| Hero copy, bio, section text        | `index.html`                                                         |
| Colours, fonts, spacing             | `css/styles.css` — see `:root` at the top                            |
| Track list (titles, year, Spotify)  | `js/main.js` — top of file, `TRACKS` array                           |
| Portrait image of Faith             | drop `images/faith-portrait.jpg` (4:5, ~800×1000)                    |
| Social / email links                | `index.html` — header, contact and footer sections                    |
| Favicon                             | `images/favicon.svg`                                                 |

## Hooking up the forms

The booking and contact forms currently log to the console and show a thank-you
note. To make them actually deliver:

### Option 1 — Netlify Forms (zero backend)

In `index.html`, on each `<form>` tag, add `data-netlify="true"` and a unique
`name="..."` attribute. Netlify will detect the form on deploy and you'll see
submissions in the dashboard.

```html
<form class="form-card" id="bookingForm" name="booking" data-netlify="true" novalidate>
```

### Option 2 — Formspree / Getform / Basin

Get a form endpoint URL, then in `js/main.js` replace the `console.log` line
with:

```js
fetch('https://formspree.io/f/YOUR_ID', { method: 'POST', body: new FormData(form) });
```

### Option 3 — Your own backend

`POST` the FormData to whatever endpoint you control.

## Deploying

### Netlify (recommended — easiest)

1. Drag the `herald-music` folder onto <https://app.netlify.com/drop>, **or**
2. Push to GitHub and "Add new site → Import from Git" — settings are auto-detected from `netlify.toml`.

### Vercel

```bash
npx vercel        # one-off preview
npx vercel --prod # production
```

Settings are auto-detected from `vercel.json`.

### Cloudflare Pages

1. Push to GitHub.
2. Cloudflare Pages → Create project → connect repo.
3. Build command: *(leave blank)*. Output directory: `/`.

### GitHub Pages

```bash
cd herald-music
git init && git add . && git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

Then in repo Settings → Pages, set source to `main` / root.

### Plain web host (cPanel, S3, FTP)

Upload the contents of `herald-music/` to your web root. Done. There is no
build step — the files you see are the files that ship.

## Replacing the Spotify track IDs

Every track currently links to the artist page. To deep-link each song:

1. Open `js/main.js`.
2. For each entry in `TRACKS`, replace `spotify:` with the full
   `https://open.spotify.com/track/<id>` URL from the song's "Share → Copy link".

## License

Site code: MIT. Brand, music, and likeness are © The Herald Music / Faith Abdulsalam.
