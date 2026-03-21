import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initLandingPageAnimation(container) {
  if (!container) return () => {};

  const html = document.documentElement;

  /* ══════════════════════════════════════
     WEBGL — MEDELLÍN CITY GRID SIMULATION
  ══════════════════════════════════════ */
  let animationFrameId;
  const canvas = container.querySelector('#city-canvas');
  let renderer, scene, cam;

  // ✅ pulseData declared here so animate() can access it
  let pulseData = [];

  if (canvas) {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    scene = new THREE.Scene();
    cam = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    cam.position.set(0, 14, 22);
    cam.lookAt(0, 0, 0);

    const valleyW = 10, valleyL = 26;

    const streetMat = new THREE.LineBasicMaterial({
      color: 0x00C896, transparent: true, opacity: 0.12,
      blending: THREE.AdditiveBlending, depthWrite: false
    });
    const aveMat = new THREE.LineBasicMaterial({
      color: 0x00C896, transparent: true, opacity: 0.22,
      blending: THREE.AdditiveBlending, depthWrite: false
    });
    const nodeMat = new THREE.PointsMaterial({
      color: 0x00C896, size: 0.12, sizeAttenuation: true,
      transparent: true, opacity: 0.55,
      blending: THREE.AdditiveBlending, depthWrite: false
    });

    const nsCount = 14;
    for (let i = 0; i < nsCount; i++) {
      const x = (i / (nsCount - 1) - 0.5) * valleyW;
      const valleyFactor = Math.sqrt(1 - Math.pow(x / (valleyW * 0.6), 2));
      const len = valleyL * valleyFactor;
      if (len < 2) continue;
      const pts = [new THREE.Vector3(x, 0, -len / 2), new THREE.Vector3(x, 0, len / 2)];
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const isMajor = i === Math.floor(nsCount / 2);
      scene.add(new THREE.Line(geo, isMajor ? aveMat : streetMat));
    }

    const ewCount = 32;
    for (let j = 0; j < ewCount; j++) {
      const z = (j / (ewCount - 1) - 0.5) * valleyL;
      const valleyFactor = Math.max(0, 1 - Math.pow(z / (valleyL * 0.5), 2));
      const w = valleyW * Math.sqrt(valleyFactor) * 0.95;
      if (w < 0.5) continue;
      const pts = [new THREE.Vector3(-w / 2, 0, z), new THREE.Vector3(w / 2, 0, z)];
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const isMajor = j % 6 === 0;
      scene.add(new THREE.Line(geo, isMajor ? aveMat : streetMat));
    }

    const nodePositions = [];
    for (let i = 0; i < nsCount; i++) {
      const x = (i / (nsCount - 1) - 0.5) * valleyW;
      const vf = Math.sqrt(Math.max(0, 1 - Math.pow(x / (valleyW * 0.6), 2)));
      const len = valleyL * vf;
      for (let j = 0; j < ewCount; j++) {
        const z = (j / (ewCount - 1) - 0.5) * valleyL;
        if (Math.abs(z) < len / 2) nodePositions.push(x, 0, z);
      }
    }
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.Float32BufferAttribute(nodePositions, 3));
    scene.add(new THREE.Points(nodeGeo, nodeMat));

    const centerGeo = new THREE.BufferGeometry();
    centerGeo.setAttribute('position', new THREE.Float32BufferAttribute([0, 0.05, 0], 3));
    const centerMat = new THREE.PointsMaterial({
      color: 0x00C896, size: 0.6, sizeAttenuation: true,
      transparent: true, opacity: 0.9,
      blending: THREE.AdditiveBlending, depthWrite: false
    });
    scene.add(new THREE.Points(centerGeo, centerMat));

    // ✅ Assign to outer pulseData (no const/let here)
    const PULSES = 28;
    const pulsePositions = new Float32Array(PULSES * 3);
    for (let i = 0; i < PULSES; i++) {
      const isNS = Math.random() > 0.5;
      if (isNS) {
        const x = (Math.floor(Math.random() * nsCount) / (nsCount - 1) - 0.5) * valleyW;
        const vf = Math.sqrt(Math.max(0, 1 - Math.pow(x / (valleyW * 0.6), 2)));
        const len = valleyL * vf;
        pulseData.push({ type: 'ns', x, zMin: -len / 2, zMax: len / 2, z: Math.random() * len - len / 2, speed: (Math.random() * .04 + .015) * (Math.random() > .5 ? 1 : -1) });
      } else {
        const z = (Math.floor(Math.random() * ewCount) / (ewCount - 1) - 0.5) * valleyL;
        const vf = Math.max(0, 1 - Math.pow(z / (valleyL * .5), 2));
        const w = valleyW * Math.sqrt(vf) * 0.95;
        pulseData.push({ type: 'ew', z, xMin: -w / 2, xMax: w / 2, x: Math.random() * w - w / 2, speed: (Math.random() * .04 + .015) * (Math.random() > .5 ? 1 : -1) });
      }
    }

    const pulseGeo = new THREE.BufferGeometry();
    pulseGeo.setAttribute('position', new THREE.BufferAttribute(pulsePositions, 3));
    const pulseMat = new THREE.PointsMaterial({
      color: 0x4dffd0, size: 0.18, sizeAttenuation: true,
      transparent: true, opacity: 0.8,
      blending: THREE.AdditiveBlending, depthWrite: false
    });
    const pulseSystem = new THREE.Points(pulseGeo, pulseMat);
    scene.add(pulseSystem);

    const AMBIENT = 600;
    const ambPos = new Float32Array(AMBIENT * 3);
    for (let i = 0; i < AMBIENT; i++) {
      ambPos[i * 3] = (Math.random() - .5) * 25;
      ambPos[i * 3 + 1] = (Math.random() - .5) * 8;
      ambPos[i * 3 + 2] = (Math.random() - .5) * 30;
    }
    const ambGeo = new THREE.BufferGeometry();
    ambGeo.setAttribute('position', new THREE.BufferAttribute(ambPos, 3));
    const ambMat = new THREE.PointsMaterial({
      color: 0x00C896, size: .025, sizeAttenuation: true,
      transparent: true, opacity: .22,
      blending: THREE.AdditiveBlending, depthWrite: false
    });
    scene.add(new THREE.Points(ambGeo, ambMat));
  }

  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  const onMouseMove = e => {
    mouse.tx = (e.clientX / window.innerWidth - 0.5) * 0.5;
    mouse.ty = (e.clientY / window.innerHeight - 0.5) * 0.3;
  };
  window.addEventListener('mousemove', onMouseMove);

  const onResize = () => {
    if (cam && renderer) {
      cam.aspect = window.innerWidth / window.innerHeight;
      cam.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
  };
  window.addEventListener('resize', onResize);

  let t = 0;
  function animate() {
    animationFrameId = requestAnimationFrame(animate);
    if (!renderer || !scene || !cam) return;
    t += 0.008;

    mouse.x += (mouse.tx - mouse.x) * 0.04;
    mouse.y += (mouse.ty - mouse.y) * 0.04;

    cam.position.x = Math.sin(t * 0.05) * 3 + mouse.x * 4;
    cam.position.z = 22 + Math.cos(t * 0.07) * 2;
    cam.position.y = 14 + mouse.y * 3 + Math.sin(t * 0.04) * 1;
    cam.lookAt(0, 0, 0);

    const pulseGeo = scene.children.find(c => c.type === 'Points' && c.material.color?.getHex() === 0x4dffd0)?.geometry;
    if (pulseGeo && pulseData.length > 0) {
      const pos = pulseGeo.attributes.position.array;
      const PULSES = pulseData.length;
      for (let i = 0; i < PULSES; i++) {
        const p = pulseData[i];
        if (p.type === 'ns') {
          p.z += p.speed;
          if (p.z > p.zMax || p.z < p.zMin) p.speed *= -1;
          pos[i * 3] = p.x; pos[i * 3 + 1] = 0.05; pos[i * 3 + 2] = p.z;
        } else {
          p.x += p.speed;
          if (p.x > p.xMax || p.x < p.xMin) p.speed *= -1;
          pos[i * 3] = p.x; pos[i * 3 + 1] = 0.05; pos[i * 3 + 2] = p.z;
        }
      }
      pulseGeo.attributes.position.needsUpdate = true;
    }

    const pMat = scene.children.find(c => c.type === 'Points' && c.material.color?.getHex() === 0x4dffd0)?.material;
    if (pMat) pMat.opacity = 0.7 + Math.sin(t * 3) * 0.15;

    const cMat = scene.children.find(c => c.geometry?.attributes?.position?.array?.length === 3)?.material;
    if (cMat) cMat.size = 0.5 + Math.sin(t * 2.5) * 0.15;

    renderer.render(scene, cam);
  }

  if (canvas) animate();

  /* ══ THEME ══ */
  const themeBtn = container.querySelector('#theme-btn');
  const onThemeToggle = function () {
    html.dataset.theme = html.dataset.theme === 'light' ? 'dark' : 'light';
    gsap.from(this, { rotate: 180, scale: .6, duration: .4, ease: 'back.out(2)' });
  };
  if (themeBtn) themeBtn.addEventListener('click', onThemeToggle);

  /* ══ NAVBAR HIDE/SHOW ══ */
  let lastY = 0;
  ScrollTrigger.create({
    start: 'top top',
    end: 'max',
    onUpdate(s) {
      const y = s.scroll();
      const nav = container.querySelector('#nav');
      if (nav) gsap.to(nav, { yPercent: (y > lastY && y > 80) ? -110 : 0, duration: .3, ease: 'power2.inOut' });
      lastY = y;
    }
  });

  const navLinks = container.querySelectorAll('.nav-links a');
  const onNavLinkClick = function () {
    navLinks.forEach(x => x.classList.remove('active'));
    this.classList.add('active');
    gsap.from(this, { scale: .85, duration: .28, ease: 'back.out(2)' });
  };
  navLinks.forEach(a => a.addEventListener('click', onNavLinkClick));

  /* ══ HERO ENTRANCE ══ */
  gsap.from(container.querySelector('#nav'), { y: -70, opacity: 0, duration: .7, ease: 'power3.out' });
  gsap.from(container.querySelectorAll('.hero-aura, .orb'), { scale: .4, opacity: 0, duration: 2.4, ease: 'power2.out', delay: .1, stagger: .1 });

  const heroEls = container.querySelectorAll('#hl, #htitle, #hsub, #hbtns, #hdash');
  if (heroEls.length) {
    gsap.set(heroEls, { opacity: 0, y: 32 });
    gsap.to(heroEls, { opacity: 1, y: 0, duration: .9, ease: 'power3.out', stagger: .13, delay: .55 });
  }

  gsap.from(container.querySelectorAll('.curve-circle'), { scale: 0, opacity: 0, duration: .8, ease: 'back.out(2.5)', delay: 1.6 });

  gsap.to(container.querySelectorAll('.orb-field'), {
    y: -100, ease: 'none',
    scrollTrigger: { trigger: container.querySelector('.hero'), start: 'top top', end: 'bottom top', scrub: 1.8 }
  });
  gsap.to(container.querySelectorAll('.mk'), {
    rotateX: 5, transformPerspective: 1100, ease: 'none',
    scrollTrigger: { trigger: container.querySelector('#hdash'), start: 'top 75%', end: 'bottom 20%', scrub: 1.2 }
  });

  const curveScroll = container.querySelector('#curve-scroll');
  if (curveScroll) {
    curveScroll.addEventListener('click', () => {
      const trusted = container.querySelector('.trusted');
      if (trusted) window.scrollTo({ top: trusted.offsetTop, behavior: 'smooth' });
      gsap.from(curveScroll, { scale: .8, duration: .3, ease: 'back.out(2)' });
    });
  }

  /* ══ DASHBOARD COUNTERS ══ */
  ScrollTrigger.create({
    trigger: container.querySelector('#hdash'), start: 'top 88%', once: true, onEnter: () => {
      [{ id: 'a1', v: 47, s: '' }, { id: 'a2', v: 94, s: '%' }, { id: 'a3', v: 12, s: '' }].forEach(({ id, v, s }) => {
        const el = container.querySelector('#' + id);
        if (!el) return;
        const o = { n: 0 };
        gsap.to(o, { n: v, duration: 1.5, ease: 'power2.out', onUpdate: () => { el.textContent = Math.round(o.n) + s; } });
      });
    }
  });

  /* ══ STATS ══ */
  ScrollTrigger.create({
    trigger: container.querySelector('.stats-strip'), start: 'top 82%', once: true, onEnter: () => {
      [{ id: 's1', v: 12400, s: '+' }, { id: 's2', v: 48000, s: '+' }, { id: 's3', v: 380, s: '+' }].forEach(({ id, v, s }) => {
        const el = container.querySelector('#' + id);
        if (!el) return;
        const o = { n: 0 };
        gsap.to(o, {
          n: v, duration: 2, ease: 'power2.out', onUpdate: () => {
            let n = Math.round(o.n);
            el.textContent = (n >= 1000 ? (n / 1000).toFixed(n >= 100000 ? 0 : 1) + 'k' : n) + s;
          }
        });
      });
      gsap.from(container.querySelectorAll('.st-it'), { opacity: 0, y: 18, scale: .94, duration: .55, stagger: .12, ease: 'back.out(1.4)' });
    }
  });

  /* ══ SCROLL REVEALS ══ */
  const revTargets = [
    ['.trusted-lbl, .logo-e', '.trusted', .06],
    ['.feat-card', '.feat-grid', .08],
    ['.caso', '.casos-grid', .1],
    ['.svc', '.svc-grid', .07],
    ['.ins', '.ins-grid', .1],
    ['.blog-h', '.blog-main', .12],
    ['.faq-it', '.faq-list', .07],
    ['.footer-card', '.footer-shell', 0],
  ];
  revTargets.forEach(([sel, trig, stag]) => {
    const elements = container.querySelectorAll(sel);
    const triggerEl = container.querySelector(trig);
    if (elements.length && triggerEl) {
      gsap.from(elements, {
        opacity: 0, y: 38, scale: .96, duration: .72, stagger: stag, ease: 'power3.out',
        scrollTrigger: { trigger: triggerEl, start: 'top 86%', once: true }
      });
    }
  });

  container.querySelectorAll('.sh').forEach(el => {
    gsap.from(el.children, {
      opacity: 0, y: 22, duration: .65, stagger: .1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  container.querySelectorAll('.slot').forEach((s, i) => {
    gsap.to(s, { borderColor: 'rgba(0,200,150,.45)', duration: 1.5 + i * .3, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * .6 });
    gsap.to(s, { y: -8, duration: 2.8 + i * .3, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * .4 });
  });

  gsap.from(container.querySelectorAll('.slot'), {
    opacity: 0, y: 30, scale: .95, duration: .7, stagger: .15, ease: 'power3.out',
    scrollTrigger: { trigger: container.querySelector('#features'), start: 'top 84%', once: true }
  });

  ['vt-tag', 'vt-eyebrow', 'vt-h', 'vt-h-accent', 'vt-line', 'vt-desc', 'vt-btns'].forEach((c, i) => {
    const el = container.querySelectorAll('.' + c);
    if (el.length) {
      gsap.from(el, {
        opacity: 0, x: -24, duration: .65, delay: i * .09, ease: 'power3.out',
        scrollTrigger: { trigger: container.querySelector('.video-sec'), start: 'top 80%', once: true }
      });
    }
  });

  container.querySelectorAll('.orb').forEach((o, i) => {
    gsap.to(o, { y: -20, duration: 4 + i * 1.2, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * .7 });
    gsap.to(o, { x: 15, duration: 6 + i * 1.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * .4 });
  });

  /* ══ 3D CARD TILT ══ */
  const onCardMouseMove = function (e) {
    const r = this.getBoundingClientRect();
    gsap.to(this, { rotateY: ((e.clientX - r.left) / r.width - .5) * 10, rotateX: ((e.clientY - r.top) / r.height - .5) * -10, transformPerspective: 800, duration: .32, ease: 'power2.out' });
  };
  const onCardMouseLeave = function () { gsap.to(this, { rotateY: 0, rotateX: 0, duration: .5, ease: 'power2.out' }); };
  container.querySelectorAll('.fcard,.caso,.svc,.ins,.blog-h,.blog-s').forEach(card => {
    card.addEventListener('mousemove', onCardMouseMove);
    card.addEventListener('mouseleave', onCardMouseLeave);
  });

  /* ══ MAGNETIC BUTTONS ══ */
  const onBtnMouseMove = function (e) {
    const r = this.getBoundingClientRect();
    gsap.to(this, { x: (e.clientX - r.left - r.width / 2) * .22, y: (e.clientY - r.top - r.height / 2) * .22, duration: .24, ease: 'power2.out' });
  };
  const onBtnMouseLeave = function () { gsap.to(this, { x: 0, y: 0, duration: .5, ease: 'elastic.out(1,.5)' }); };
  const onBtnClick = function (e) {
    const s = document.createElement('span'), r = this.getBoundingClientRect();
    Object.assign(s.style, { position: 'absolute', borderRadius: '50%', background: 'rgba(5,8,16,.18)', transform: 'scale(0)', pointerEvents: 'none', width: '70px', height: '70px', left: (e.clientX - r.left - 35) + 'px', top: (e.clientY - r.top - 35) + 'px' });
    this.appendChild(s);
    gsap.to(s, { scale: 4, opacity: 0, duration: .55, ease: 'power2.out', onComplete: () => s.remove() });
  };
  container.querySelectorAll('.btn-g,.btn-outline').forEach(btn => {
    btn.addEventListener('mousemove', onBtnMouseMove);
    btn.addEventListener('mouseleave', onBtnMouseLeave);
    btn.addEventListener('click', onBtnClick);
  });

  /* ══ FOOTER ICON BOUNCE ══ */
  const onFsocEnter = function () { gsap.to(this, { y: -4, duration: .16, ease: 'power2.out' }); };
  const onFsocLeave = function () { gsap.to(this, { y: 0, duration: .38, ease: 'elastic.out(1,.5)' }); };
  container.querySelectorAll('.fsoc,.fib').forEach(b => {
    b.addEventListener('mouseenter', onFsocEnter);
    b.addEventListener('mouseleave', onFsocLeave);
  });

  const scrollTopBtn = container.querySelector('#scroll-top');
  if (scrollTopBtn) scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ══ FAQ ACCORDION ══ */
  const onFaqClick = function () {
    const it = this.parentElement, was = it.classList.contains('open');
    container.querySelectorAll('.faq-it').forEach(x => x.classList.remove('open'));
    if (!was) {
      it.classList.add('open');
      gsap.from(this.nextElementSibling, { opacity: 0, y: -8, duration: .3, ease: 'power2.out' });
    }
    gsap.from(this.querySelector('.faq-plus'), { scale: .7, duration: .28, ease: 'back.out(2)' });
  };
  container.querySelectorAll('.faq-q').forEach(q => q.addEventListener('click', onFaqClick));

  /* ══ PLAY BUTTON ══ */
  const playBtn = container.querySelector('#play-btn');
  if (playBtn) playBtn.addEventListener('click', function () {
    gsap.to(this, { scale: .88, duration: .1, yoyo: true, repeat: 1, ease: 'power2.out' });
    alert('Reemplaza con tu URL de video.');
  });

  return () => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('resize', onResize);
    ScrollTrigger.getAll().forEach(t => t.kill());
    if (renderer) renderer.dispose();
  };
}