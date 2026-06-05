/* The Herald Music — front-end interactions */

// ---------- Track / discography data ----------
// Replace the spotify URLs with real track IDs from open.spotify.com/track/<ID>
const TRACKS = [
  { title: "Give Me Oil In My Lamp",              year: "2024", cover: "images/Give_Me_Oil_In_My_Lamp.jpeg",  spotify: "https://open.spotify.com/artist/35X6yqB18zfsZ9Jw6TgGFX" },
  { title: "The Cross",                           year: "2024", cover: "images/The_Cross.jpeg",          spotify: "https://open.spotify.com/artist/35X6yqB18zfsZ9Jw6TgGFX" },
  { title: "The Light",                           year: "2024", cover: "images/Faith5.jpeg",          spotify: "https://open.spotify.com/artist/35X6yqB18zfsZ9Jw6TgGFX" },
  { title: "It's The Same Faith",                 year: "2023", cover: "images/SAME_FAITHH.png",          spotify: "https://open.spotify.com/artist/35X6yqB18zfsZ9Jw6TgGFX" },
  { title: "Virtuous Woman",                      year: "2023", cover: "images/Virtuos_woman.jpeg",   spotify: "https://open.spotify.com/artist/35X6yqB18zfsZ9Jw6TgGFX" },
  { title: "The Secret Place",                    year: "2023", cover: "images/secret_place.jpeg",    spotify: "https://open.spotify.com/artist/35X6yqB18zfsZ9Jw6TgGFX" },
  { title: "Ewo Loose (What Is Your Direction?)", year: "2022", cover: "images/ewo_looose.jpg",          spotify: "https://open.spotify.com/artist/35X6yqB18zfsZ9Jw6TgGFX" },
  { title: "Reaching Home",                       year: "2022", cover: "images/Reaching_Home.jpeg",   spotify: "https://open.spotify.com/artist/35X6yqB18zfsZ9Jw6TgGFX" },
  { title: "Ibaare — Special Version 2",          year: "2022", cover: "images/Ibaare.jpeg",          spotify: "https://open.spotify.com/artist/35X6yqB18zfsZ9Jw6TgGFX" },
  { title: "There Is More",                       year: "2021", cover: "images/There_is_More.png",          spotify: "https://open.spotify.com/artist/35X6yqB18zfsZ9Jw6TgGFX" },
  { title: "You are still overall",                       year: "2021", cover: "images/OVER_ALL.png",          spotify: "https://open.spotify.com/album/4tXSnWnvOsbdX1XFsNQu7d?si=ykKW1USEQdCkAgNvCQX81Q" },
  { title: "Amazing Grace",                       year: "2021", cover: "images/Amazing_grace.jpeg",          spotify: "https://open.spotify.com/album/4tXSnWnvOsbdX1XFsNQu7d?si=ykKW1USEQdCkAgNvCQX81Q" },
];

const initials = (s) => {
  const parts = s.replace(/[—\-():?]/g, ' ').split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map(p => p[0]).join('').toUpperCase();
};

function renderTracks() {
  const grid = document.getElementById('trackGrid');
  if (!grid) return;
  grid.innerHTML = TRACKS.map((t, i) => `
    <article class="track-card reveal" style="--i:${i}">
      <a href="${t.spotify}" target="_blank" rel="noopener" aria-label="Listen to ${t.title} on Spotify">
        <div class="track-art" style="background: linear-gradient(135deg, ${tint(i)}, #1a1208);">
          ${t.cover
            ? `<img
                src="${t.cover}"
                alt="${t.title} cover art"
                loading="lazy"
                onerror="this.style.display='none'"
               />`
            : `<span>${initials(t.title)}</span>`
          }
          <span class="play">▶ PLAY</span>
          <span class="card-glare" aria-hidden="true"></span>
        </div>
        <div class="track-meta">
          <h4 class="track-title">${t.title}</h4>
          <span class="track-sub">Single · ${t.year}</span>
        </div>
      </a>
    </article>
  `).join('');
}

function wireTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.track-card').forEach((card) => {
    const glare = card.querySelector('.card-glare');
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;   // 0..1
      const py = (e.clientY - r.top) / r.height;   // 0..1
      const rotY = (px - 0.5) * 12;                // deg
      const rotX = (0.5 - py) * 12;                // deg
      card.classList.add('tilting');
      card.style.transform =
        `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`;
      if (glare) {
        glare.style.setProperty('--gx', `${px * 100}%`);
        glare.style.setProperty('--gy', `${py * 100}%`);
      }
    });
    card.addEventListener('pointerleave', () => {
      card.classList.remove('tilting');
      card.style.transform = '';
    });
  });
}

function tint(i) {
  const palette = [
    '#c98b4e', '#a16b3c', '#8c6a3a', '#b88a52', '#7a5436',
    '#a07a48', '#c2945a', '#8e623e', '#b07c44', '#9b7040'
  ];
  return palette[i % palette.length];
}

// ---------- Header scroll state ----------
const header = document.getElementById('siteHeader');
const onScroll = () => {
  if (window.scrollY > 32) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---------- Mobile menu ----------
const toggle = document.querySelector('.menu-toggle');
const mobileNav = document.getElementById('mobileNav');
toggle?.addEventListener('click', () => {
  const open = toggle.classList.toggle('open');
  mobileNav.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
});
mobileNav?.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    toggle.classList.remove('open');
    mobileNav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  })
);

// ---------- Reveal on scroll ----------
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

function observeReveals() {
  document.querySelectorAll('.section h2, .section h3, .section p, .pillar, .track-card, .devotional, .form-card, .about-portrait, .about-copy')
    .forEach(el => {
      el.classList.add('reveal');
      io.observe(el);
    });
}

// ---------- Forms (graceful client-side) ----------
function wireForm(formId, noteId, message) {
  const form = document.getElementById(formId);
  const note = document.getElementById(noteId);
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    // No backend wired here — pipe to a service like Formspree, Netlify Forms,
    // or your own endpoint. For now we just acknowledge in the UI.
    console.log(`[${formId}] submission:`, data);
    note.textContent = message;
    form.reset();
    setTimeout(() => { note.textContent = ''; }, 6000);
  });
}

// ---------- Year ----------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  renderTracks();
  wireTilt();
  observeReveals();
  wireForm('bookingForm', 'bookingNote', 'Thank you — your inquiry has been received. We will be in touch soon.');
  wireForm('contactForm', 'contactNote', 'Thank you — your message has been received.');
});

