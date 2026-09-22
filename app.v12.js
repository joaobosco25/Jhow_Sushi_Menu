(() => {
  'use strict';

  const menu = window.JOE_MENU || [];
  const cfg = window.JOE_CONFIG || {};
  const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  let toastTimer;

  const normalize = s => (s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  function allItems() {
    const out = [];
    menu.forEach(section => {
      const groups = section.groups || [{ label: null, items: section.items || [] }];
      groups.forEach(group => group.items.forEach(item => out.push({ section, group, item })));
    });
    return out;
  }

  function renderCategories() {
    const host = $('#categories');
    if (!host) return;
    host.innerHTML = menu.map((s, i) =>
      `<button class="category ${i === 0 ? 'active' : ''}" data-target="${s.id}">${s.title}</button>`
    ).join('');

    $$('.category', host).forEach(btn => btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      if (!target) return;
      const top = target.getBoundingClientRect().top + window.scrollY - 145;
      window.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' });
    }));
  }

  function itemCard(item) {
    const media = item.image
      ? `<div class="item-media"><img src="${item.image}" alt="${item.name}" loading="lazy" decoding="async" width="520" height="390"></div>`
      : '';

    return `<article class="menu-item ${item.image ? 'has-image ' : ''}${item.premium ? 'premium' : ''}">
      ${media}
      <div class="item-copy"><h4>${item.name}</h4>${item.desc ? `<p>${item.desc}</p>` : ''}</div>
      <div class="item-side"><span class="price">${brl.format(item.price)}</span></div>
    </article>`;
  }

  function renderMenu() {
    const host = $('#menuGrid');
    if (!host) return;

    host.innerHTML = menu.map(section => {
      let body = '';
      if (section.groups) {
        body = section.groups.map(group =>
          `<div class="group"><div class="group-label">${group.label}</div><div class="items">${group.items.map(itemCard).join('')}</div></div>`
        ).join('');
      } else {
        body = `<div class="items">${(section.items || []).map(itemCard).join('')}</div>`;
      }

      return `<section class="menu-section ${section.featured ? 'featured' : ''}" id="${section.id}">
        <div class="section-title"><div><small>${section.eyebrow || ''}</small><h3>${section.title}</h3></div></div>${body}
      </section>`;
    }).join('');
  }

  function renderSearch(q = '') {
    const host = $('#searchResults');
    if (!host) return;
    const n = normalize(q).trim();
    const items = allItems()
      .filter(x => !n || normalize(`${x.item.name} ${x.item.desc || ''} ${x.section.title}`).includes(n))
      .slice(0, 30);

    host.innerHTML = items.length
      ? items.map(x => `<div class="search-result"><div><strong>${x.item.name}</strong><small>${x.section.title} · ${brl.format(x.item.price)}</small></div></div>`).join('')
      : '<p style="color:#8c756d">Nenhum item encontrado.</p>';
  }

  function canonicalUrl() {
    if (cfg.menuUrl) return cfg.menuUrl;
    const u = new URL(window.location.href);
    u.hash = '';
    u.search = '';
    return u.protocol === 'file:' ? 'https://joaobosco25.github.io/Jhow_Sushi_Menu/' : u.href;
  }

  function buildQr() {
    const mount = $('#qrcode');
    if (!mount || mount.dataset.ready) return;
    const url = canonicalUrl();
    const qrUrl = $('#qrUrl');
    if (qrUrl) qrUrl.textContent = url;

    // Usa o QR já incluído no projeto. Isso elimina uma biblioteca externa do carregamento inicial.
    mount.innerHTML = '<img src="assets/QR_Jhow_Sushi_Menu.png" alt="QR Code do cardápio Jhow Sushi House" width="220" height="220" loading="eager" decoding="async">';
    mount.dataset.ready = '1';
  }

  function downloadQr() {
    const a = document.createElement('a');
    a.download = 'QR_Jhow_Sushi_Menu.png';
    a.href = 'assets/QR_Jhow_Sushi_Menu.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function showToast(text) {
    const t = $('#toast');
    if (!t) return;
    t.textContent = text;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 1800);
  }

  function dismissPreloader() {
    const preloader = $('#preloader');
    if (!preloader) return;
    preloader.classList.add('is-leaving');
    window.setTimeout(() => { preloader.hidden = true; }, 360);
  }

  function setupIntro() {
    requestAnimationFrame(() => {
      document.body.classList.add('site-ready');
      dismissPreloader();
    });
  }

  function setupNativeSmoothScroll() {
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = $(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' });
    }));
  }

  function setupRevealAnimations() {
    if (reducedMotion || !('IntersectionObserver' in window)) return;

    const candidates = [
      ...$$('.premium-reveal'),
      ...$$('.menu-section')
    ];

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

    candidates.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 1.05) {
        el.classList.add('reveal-visible');
      } else {
        el.classList.add('reveal-pending');
        observer.observe(el);
      }
    });
  }

  function setupPageProgress() {
    const bar = $('#pageProgress');
    const topbar = $('#topbar');
    let ticking = false;

    const update = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / max));
      if (bar) bar.style.transform = `scaleX(${progress})`;
      if (topbar) topbar.classList.toggle('scrolled', window.scrollY > 30);
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });

    update();
  }

  function categorySpy() {
    const sections = menu.map(s => document.getElementById(s.id)).filter(Boolean);
    if (!sections.length || !('IntersectionObserver' in window)) return;

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        $$('.category').forEach(b => b.classList.toggle('active', b.dataset.target === e.target.id));
        const active = $(`.category[data-target="${e.target.id}"]`);
        const categoryHost = $('#categories');
        if (active && categoryHost) {
          const targetLeft = active.offsetLeft - (categoryHost.clientWidth - active.offsetWidth) / 2;
          categoryHost.scrollTo({ left: Math.max(0, targetLeft), behavior: reducedMotion ? 'auto' : 'smooth' });
        }
      });
    }, { rootMargin: '-34% 0px -58% 0px', threshold: 0 });

    sections.forEach(s => io.observe(s));
  }

  function setupPointerEffects() {
    // Efeitos só no desktop com mouse. No celular não criamos animações contínuas.
    if (!finePointer || reducedMotion) return;

    const orb = $('#cursorOrb');
    if (orb) {
      let x = -300, y = -300, tx = -300, ty = -300, raf = 0;
      const loop = () => {
        x += (tx - x) * .16;
        y += (ty - y) * .16;
        orb.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;
        raf = requestAnimationFrame(loop);
      };
      window.addEventListener('pointermove', e => {
        tx = e.clientX;
        ty = e.clientY;
        orb.style.opacity = '.85';
        if (!raf) raf = requestAnimationFrame(loop);
      }, { passive: true });
    }

    $$('.menu-section').forEach(section => {
      section.addEventListener('pointermove', e => {
        const r = section.getBoundingClientRect();
        section.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
        section.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
      }, { passive: true });
    });
  }

  function openLayer(el) {
    if (!el) return;
    el.classList.add('open');
    el.setAttribute('aria-hidden', 'false');
    document.body.classList.add('locked');
    requestAnimationFrame(() => el.classList.add('modal-ready'));
  }

  function closeLayer(el) {
    if (!el) return;
    el.classList.remove('modal-ready');
    window.setTimeout(() => {
      el.classList.remove('open');
      el.setAttribute('aria-hidden', 'true');
      if (!$('.modal.open')) document.body.classList.remove('locked');
    }, reducedMotion ? 0 : 220);
  }

  function bindUI() {
    const openSearch = $('#openSearch');
    const searchModal = $('#searchModal');
    const searchInput = $('#searchInput');
    if (openSearch) openSearch.addEventListener('click', () => {
      renderSearch(searchInput?.value || '');
      openLayer(searchModal);
      setTimeout(() => searchInput?.focus(), 120);
    });
    $$('[data-close-search]').forEach(x => x.addEventListener('click', () => closeLayer(searchModal)));
    if (searchInput) searchInput.addEventListener('input', e => renderSearch(e.target.value));

    const qrModal = $('#qrModal');
    const openQr = () => {
      buildQr();
      openLayer(qrModal);
    };
    $('#openQr')?.addEventListener('click', openQr);
    $('#heroQr')?.addEventListener('click', openQr);
    $$('[data-close-qr]').forEach(x => x.addEventListener('click', () => closeLayer(qrModal)));
    $('#downloadQr')?.addEventListener('click', downloadQr);

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') $$('.modal.open').forEach(closeLayer);
    });
  }

  function init() {
    const start = performance.now();

    renderCategories();
    renderMenu();
    setupNativeSmoothScroll();
    bindUI();
    categorySpy();
    setupPageProgress();

    // O hero aparece imediatamente; efeitos abaixo entram depois que o conteúdo crítico já está pronto.
    setupIntro();

    requestAnimationFrame(() => {
      setupRevealAnimations();
      if (finePointer) setupPointerEffects();
      document.documentElement.dataset.jhowInitMs = Math.round(performance.now() - start);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
