(() => {
  'use strict';

  /* ------------------------------------------------------------------
     FEATURED PROJECTS (All 3 have interactive slide presentations + repos)
  ------------------------------------------------------------------ */
  const projects = [
    {
      title: 'Multi-Omics Breast Cancer Subtype Classification',
      subtitle: 'Explainable machine learning on RNA-seq & DNA methylation.',
      desc: 'An integrated multi-omics pipeline (2026 UGRF Shortlisted) combining TCGA RNA-seq and DNA methylation data for PAM50 breast cancer molecular subtype classification. Applies DESeq2, ANOVA F-test feature selection, and Independent Component Analysis (ICA), boosting test accuracy from a 60% baseline (68% single-omics) to ~79% with an optimized Random Forest alongside XGBoost and SVM models, plus SHAP biomarker interpretation and an interactive clinical GUI.',
      stack: 'Python · Random Forest · XGBoost · SVM · SHAP · DESeq2 · ICA · GUI',
      repo: 'https://github.com/Laila9445/-Multi-Omics-Breast-Cancer-Molecular-Subtype-Classification-',
      presentation: {
        folder: 'assets/presentations/multi-omics-breast-cancer',
        pdf: 'assets/presentations/multi-omics-breast-cancer.pdf',
        slides: 19
      }
    },
    {
      title: 'Fish-i — Proactive Computer Vision Mobility Companion',
      subtitle: 'Real-time assistive object detection & bilingual OCR.',
      desc: 'NAID 2026 Biomedical Engineering & Computer Vision project: a hybrid edge-cloud mobility system for blind and visually impaired users. Pairs 4-camera smart glasses with on-phone YOLOv8 obstacle detection, distance and direction estimation, EasyOCR for Arabic and English signage/currency reading, and a risk-prioritized Decision Engine that delivers concise open-ear voice guidance.',
      stack: 'Python · YOLOv8 · OpenCV · EasyOCR (AR/EN) · Edge AI · Assistive Tech',
      repo: 'https://github.com/Laila9445/Object-Detection-Computer-Vision-Project',
      presentation: {
        folder: 'assets/presentations/fish-i-computer-vision',
        pdf: 'assets/presentations/fish-i-computer-vision.pdf',
        slides: 19
      }
    },
    {
      title: 'Hospital Information System',
      subtitle: 'One centralized platform for every hospital department.',
      desc: 'A centralized web-based hospital management system (BMD303) connecting doctors, nurses, patients, radiologists, physiotherapists, and billing staff, with JWT authentication, role-based access control, inter-departmental referral workflows, appointments, prescriptions, medical records, billing, and FHIR-compatible endpoints.',
      stack: '.NET · JWT · RBAC · FHIR Endpoints · Swagger/OpenAPI',
      repo: 'https://github.com/Laila9445/BMD303-Hospital-Information-System',
      presentation: {
        folder: 'assets/presentations/hospital-information-system',
        pdf: 'assets/presentations/hospital-information-system.pdf',
        slides: 17
      }
    }
  ];

  const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6"/></svg>';
  const deckIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M12 16v4m-4 0h8M8 12l2.5-3 2 2L16 8"/></svg>';

  /* ---------- Render work rows (built with DOM APIs, no innerHTML on data) ---------- */
  const list = document.querySelector('#work-list');
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; };

  projects.forEach((p, i) => {
    const row = el('article', 'work-row');
    row.append(el('span', 'number', String(i + 1).padStart(2, '0')));

    const head = el('div');
    head.append(el('h3', null, p.title), el('p', 'subtitle', p.subtitle));

    const body = el('div', 'work-description');
    body.append(el('p', null, p.desc), el('p', 'stack', p.stack));

    const links = el('div', 'work-links');
    const btn = el('button', 'deck-btn');
    btn.type = 'button';
    btn.insertAdjacentHTML('beforeend', deckIcon);
    btn.append(document.createTextNode('View presentation'));
    if (p.presentation) {
      btn.addEventListener('click', () => openViewer(p, btn));
      btn.setAttribute('aria-label', 'View presentation for ' + p.title);
    } else {
      btn.disabled = true;
      btn.title = 'Presentation coming soon';
      btn.lastChild.textContent = 'Presentation soon';
    }
    links.append(btn);
    if (p.repo) {
      const a = el('a', 'text-link', 'GitHub repo');
      a.href = p.repo; a.target = '_blank'; a.rel = 'noopener';
      a.insertAdjacentHTML('beforeend', arrow);
      links.append(a);
    }
    row.append(head, body, links);
    list.append(row);
  });

  /* ---------- Mobile menu ---------- */
  const menu = document.querySelector('#menu-toggle');
  const nav = document.querySelector('#navigation');
  const closeMenu = () => { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); };
  menu.addEventListener('click', () => { const o = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(o)); });
  nav.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
  window.matchMedia('(min-width:721px)').addEventListener('change', e => { if (e.matches) closeMenu(); });

  /* ---------- Presentation viewer ---------- */
  const viewer = document.querySelector('#viewer');
  const slide = document.querySelector('#slide');
  const counter = document.querySelector('#counter');
  const thumbs = document.querySelector('#thumbs');
  const title = document.querySelector('#viewer-title');
  let current = null, index = 0, opener = null;

  const src = n => `${current.presentation.folder}/${String(n).padStart(2, '0')}.jpg`;

  function show(n) {
    const total = current.presentation.slides;
    index = Math.min(Math.max(n, 1), total);
    slide.src = src(index);
    slide.alt = `${current.title}, slide ${index} of ${total}`;
    counter.textContent = `Slide ${index} / ${total}`;
    thumbs.querySelectorAll('button').forEach((b, i) => b.setAttribute('aria-current', String(i + 1 === index)));
    thumbs.children[index - 1]?.scrollIntoView({ block: 'nearest', inline: 'center' });
    document.querySelector('#prev').disabled = index === 1;
    document.querySelector('#next').disabled = index === total;
    const preload = new Image(); preload.src = src(Math.min(index + 1, total));
  }

  function openViewer(project, trigger) {
    current = project; opener = trigger;
    title.textContent = project.title;
    thumbs.replaceChildren();
    for (let i = 1; i <= project.presentation.slides; i++) {
      const b = el('button'); b.type = 'button'; b.setAttribute('aria-label', 'Go to slide ' + i);
      const im = new Image(); im.src = src(i); im.alt = ''; im.loading = 'lazy';
      b.append(im); b.addEventListener('click', () => show(i)); thumbs.append(b);
    }
    viewer.hidden = false;
    document.body.classList.add('locked');
    show(1);
    document.querySelector('#viewer-close').focus();
  }

  function closeViewer() {
    viewer.hidden = true;
    document.body.classList.remove('locked');
    opener?.focus();
  }

  document.querySelector('#viewer-close').addEventListener('click', closeViewer);
  document.querySelector('#prev').addEventListener('click', () => show(index - 1));
  document.querySelector('#next').addEventListener('click', () => show(index + 1));
  viewer.addEventListener('click', e => { if (e.target === viewer || e.target.classList.contains('viewer-stage')) closeViewer(); });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (!viewer.hidden) closeViewer();
      else if (nav.classList.contains('open')) { closeMenu(); menu.focus(); }
      return;
    }
    if (viewer.hidden) return;
    if (e.key === 'ArrowRight') show(index + 1);
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'Tab') {
      const f = [...viewer.querySelectorAll('button:not([disabled]),a[href]')];
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  let touchX = null;
  viewer.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  viewer.addEventListener('touchend', e => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    touchX = null;
  });

  /* ---------- Back to top + scroll reveal ---------- */
  const top = document.querySelector('#to-top');
  window.addEventListener('scroll', () => { top.hidden = window.scrollY < 700; }, { passive: true });
  top.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { threshold: .12 });
    document.querySelectorAll('.work-row, .system-grid article, .skills > div, .about-grid p').forEach(n => { n.classList.add('reveal'); io.observe(n); });
  }
})();
