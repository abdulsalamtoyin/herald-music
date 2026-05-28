# Images

Drop your real images here and the site will pick them up.

Expected file names (referenced from the HTML/CSS):

- `faith-portrait.jpg` — about-section portrait. Recommended size: 800×1000 px (4:5 ratio).
- `favicon.svg` — already provided. Replace with your own SVG/PNG if you prefer.

Optional (if you decide to swap the CSS-art devotionals for real artwork):

- `devotional-1.jpg` — Colossians 2:14 / Redemption
- `devotional-2.jpg` — Mark 1:35 / Audience of One
- `devotional-3.jpg` — Galatians 2:20 / He Died to Replace It

Optional album covers (10 tracks):

- `track-01.jpg` … `track-10.jpg` — square (1000×1000 px). To use them, edit
  `js/main.js` and add a `cover: 'images/track-01.jpg'` field to each track,
  then update the `renderTracks()` template to render an `<img>` instead of
  the gradient placeholder.
