/* The Herald Music — 3D hero scene
 *
 * Renders a golden particle starfield with a glowing orb (a faint cross of
 * light inside) behind the hero text. The scene is purely decorative and
 * self-disables when WebGL is unavailable, when the user prefers reduced
 * motion, or if three.js fails to load — in every fallback case the existing
 * 2D site (hero-bg) stands on its own. No content lives in here.
 */

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function webglSupported() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

async function init() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  if (prefersReducedMotion()) {
    console.log('[three-scene] reduced motion — skipping 3D');
    return;
  }
  if (!webglSupported()) {
    console.log('[three-scene] no WebGL — skipping 3D');
    return;
  }

  let THREE;
  try {
    THREE = await import('three');
  } catch (err) {
    console.warn('[three-scene] three.js failed to load — 2D fallback', err);
    return;
  }

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.z = 6;

  // --- Orb with a faint cross of light inside ---
  const orb = new THREE.Group();

  // Glowing translucent sphere body.
  const orbBody = new THREE.Mesh(
    new THREE.SphereGeometry(1.3, 48, 48),
    new THREE.MeshBasicMaterial({
      color: 0xffd9a0,
      transparent: true,
      opacity: 0.16,
    })
  );
  orb.add(orbBody);

  // Inner bright core.
  const orbCore = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 32, 32),
    new THREE.MeshBasicMaterial({
      color: 0xffe9c4,
      transparent: true,
      opacity: 0.5,
    })
  );
  orb.add(orbCore);

  // Faint cross of light (two thin glowing bars) inside the orb.
  const crossMat = new THREE.MeshBasicMaterial({
    color: 0xfff1d6,
    transparent: true,
    opacity: 0.75,
  });
  const crossVertical = new THREE.Mesh(
    new THREE.BoxGeometry(0.07, 1.6, 0.07),
    crossMat
  );
  const crossHorizontal = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.07, 0.07),
    crossMat
  );
  crossHorizontal.position.y = 0.25;
  const cross = new THREE.Group();
  cross.add(crossVertical);
  cross.add(crossHorizontal);
  orb.add(cross);

  scene.add(orb);

  // --- Golden particle starfield ---
  const PARTICLE_COUNT = 900;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 24;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 18;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0xc98b4e,
    size: 0.045,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // Pointer parallax target (-1..1).
  const pointer = { x: 0, y: 0 };
  let lastMove = 0;
  window.addEventListener('pointermove', (e) => {
    const now = performance.now();
    if (now - lastMove < 16) return; // ~60fps throttle
    lastMove = now;
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  // Scroll progress through the hero (0 at top, ~1 when scrolled one viewport).
  let scrollProgress = 0;
  window.addEventListener('scroll', () => {
    scrollProgress = Math.min(window.scrollY / window.innerHeight, 1);
  }, { passive: true });

  let running = true;
  let onScreen = true;

  function animate() {
    if (!running || !onScreen) return;

    orb.rotation.y += 0.0035;
    const pulse = 1 + Math.sin(Date.now() * 0.0012) * 0.03;
    orbBody.scale.setScalar(pulse);

    particles.rotation.y += 0.0006;
    particles.rotation.x += 0.0002;

    // Ease camera toward pointer for parallax.
    camera.position.x += (pointer.x * 0.6 - camera.position.x) * 0.04;
    camera.position.y += (-pointer.y * 0.4 - camera.position.y) * 0.04;
    // Drift deeper as the user scrolls past the hero.
    camera.position.z = 6 + scrollProgress * 3;
    orb.position.y = -scrollProgress * 1.5;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  // Pause rendering when the hero is off-screen.
  const hero = document.getElementById('top');
  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      onScreen = entries[0].isIntersecting;
      if (onScreen && running) animate();
    }, { threshold: 0.01 }).observe(hero);
  }

  // Pause when tab hidden.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      running = false;
    } else if (!running) {
      running = true;
      animate();
    }
  });

  animate();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
