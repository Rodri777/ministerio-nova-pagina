/* Ministério Nova Página — interações */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ease = 'cubic-bezier(0.23, 1, 0.32, 1)';
  const fade = [{ opacity: 0 }, { opacity: 1 }];
  const mobileMQ = window.matchMedia('(max-width: 899px)');
  const narrowMQ = window.matchMedia('(max-width: 768px)');
  const animate = (el, frames, opts) => (el.animate ? el.animate(frames, opts) : null);

  /* ---------- dados: linha do tempo de 2025 ----------
     Ordenada por "date" (AAAA-MM-DD) antes de renderizar; o item final (sem data) fica sempre por último.
     Usada na home (#sobre) e em nossa-historia.html. */
  const MILESTONES = [
    { date: '2025-08-30', label: '30 de agosto de 2025', title: 'O início do projeto',
      text: 'Jovens com dons musicais se reuniram para dar vida a um novo projeto. Nesse dia foram definidos os integrantes e o propósito do Ministério Nova Página: levar a mensagem de Cristo a quem está sem esperança.' },
    { date: '2025-10-05', label: '5 de outubro de 2025', title: 'Primeira apresentação',
      text: 'Em Nova Mutum (MT), o grupo subiu ao palco pela primeira vez e começou a levar sua mensagem por Mato Grosso.' },
    { date: '2025-10-27', label: '27 de outubro de 2025', title: 'Primeira música publicada',
      text: '“Eu Vou Falar”, gravada em estúdio na Betel Música e Artes, em Sorriso, chega ao público. Está no YouTube, Spotify, Deezer, Amazon Music e nas principais plataformas digitais.' },
    { date: '2025-11-06', label: '6 de novembro de 2025', title: 'Primeiro clipe musical',
      text: 'Lançamento do clipe de “Eu Vou Falar”. Direção e edição de filmagem: Ewerton Lourenço. Filmagem: Wends Pierre e Ewerton Lourenço. Drone: Jackson Fernandes.' },
    { date: '2025-12-04', label: '4 de dezembro de 2025', title: 'Câmara Municipal de Sorriso',
      text: 'A convite da Câmara, o grupo levou uma mensagem especial e uma pauta importante a todos os presentes.' },
    { date: '2025-12-16', label: '16 de dezembro de 2025', title: 'Promic · Natal Luz',
      text: 'Com apoio da Secretaria de Cultura de Sorriso, o grupo se apresentou no Natal Luz e mostrou seu repertório e o Ministério Nova Página a todo o público.' },
    { date: '2025-12-17', label: '17 de dezembro de 2025', title: '“Evangelho”',
      text: 'A segunda música gravada em estúdio chega a todas as plataformas digitais.' }
  ].sort((a, b) => a.date.localeCompare(b.date));
  const TL_END = {
    title: 'E a história segue sendo escrita...',
    text: 'Acompanhe os próximos lançamentos, clipes e apresentações no nosso acervo.',
    cta: 'Ver história completa',
    href: 'nossa-historia.html'
  };

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- redes sociais (cabeçalho desktop + menu do celular), a partir de data/site.js ---------- */
  const SOCIAL = [
    ['instagram', 'Instagram'],
    ['facebook', 'Facebook'],
    ['youtube', 'YouTube'],
    ['spotify', 'Spotify']
  ];
  const isUrl = v => {
    if (typeof v !== 'string' || !/^https?:\/\//i.test(v.trim())) return false;
    try { new URL(v.trim()); return true; } catch (_) { return false; }
  };
  const social = (window.NP_SITE && window.NP_SITE.social) || {};
  const socialHTML = SOCIAL.filter(([k]) => isUrl(social[k])).map(([k, name]) =>
    `<a href="${esc(social[k].trim())}" target="_blank" rel="noopener noreferrer" aria-label="${name} do Ministério Nova Página"><svg aria-hidden="true" focusable="false"><use href="#i-${k}"/></svg></a>`).join('');
  $$('[data-social]').forEach(el => { el.innerHTML = socialHTML; el.hidden = !socialHTML; });

  /* ---------- menu móvel ---------- */
  const menu = $('#mobile-menu');
  const openBtn = $('#menu-open');
  if (menu && openBtn) {
    const setMenu = open => {
      menu.classList.toggle('is-open', open);
      openBtn.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) $('#menu-close').focus(); else openBtn.focus({ preventScroll: true });
    };
    openBtn.addEventListener('click', () => setMenu(true));
    $('#menu-close').addEventListener('click', () => setMenu(false));
    $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false); });
    mobileMQ.addEventListener('change', e => { if (!e.matches) setMenu(false); });
  }

  /* ---------- feixe de luz do hero ---------- */
  const glow = $('#hero-glow');
  const heroLogo = $('#hero-logo');
  const hero = $('.hero');
  if (glow && hero && heroLogo) {
    let mode = null;
    const buildDust = (k) => {
      $$('.dust', glow).forEach(d => d.remove());
      let s = 7; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
      const frag = document.createDocumentFragment();
      for (let i = 0; i < 40; i++) {
        const t = 8 + r() * 80, spread = (30 + t * 2.6) * k, z = 1 + r() * 2.4, o = (.3 + r() * .6).toFixed(2);
        const d = document.createElement('div');
        d.className = 'dust';
        d.style.cssText = `left:calc(var(--gx, 75%) + ${((r() * 2 - 1) * spread).toFixed(0)}px);top:${t}%;width:${z}px;height:${z}px;--o:${o};animation-duration:${(9 + r() * 10).toFixed(1)}s;animation-delay:${(-r() * 18).toFixed(1)}s`;
        frag.appendChild(d);
      }
      glow.appendChild(frag);
    };
    const place = () => {
      const m = mobileMQ.matches ? 'm' : 'd';
      const k = m === 'm' ? .55 : 1;
      if (m !== mode) { mode = m; glow.style.setProperty('--gk', k); buildDust(k); }
      const hr = hero.getBoundingClientRect(), lr = heroLogo.getBoundingClientRect();
      if (!lr.width) return;
      const cx = lr.left + lr.width / 2 - hr.left;
      glow.style.setProperty('--gx', cx + 'px');
      // Mobile: a "poça" de luz fica logo abaixo da logo; desktop: no chão do hero.
      if (m === 'm') {
        // feixe e "chão" centrados sob a logo (≤768px: monograma)
        const poolH = glow.querySelector('.pool').offsetHeight || 150 * k;
        glow.style.setProperty('--pool-bottom', Math.max(0, hr.bottom - lr.bottom - (narrowMQ.matches ? poolH * .5 : 40)) + 'px');
      }
      else glow.style.setProperty('--pool-bottom', '2%');
    };
    place();
    window.addEventListener('resize', place, { passive: true });
    // pausa partículas e feixe quando a Hero sai da tela
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([en]) => hero.classList.toggle('is-offscreen', !en.isIntersecting)).observe(hero);
    }
    heroLogo.addEventListener('load', place);
    if (document.fonts) document.fonts.ready.then(place);
  }

  /* ---------- entrada do hero ---------- */
  $$('[data-enter]').forEach(el => animate(el, reduce ? fade : [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 600, delay: (+el.dataset.enter) * 60, easing: ease, fill: 'backwards' }));
  $$('[data-lit]').forEach(el => animate(el, fade, { duration: 700, delay: +el.dataset.lit, easing: ease, fill: 'backwards' }));
  $$('[data-logo]').forEach(el => animate(el, reduce ? fade : [{ opacity: 0, transform: 'scale(0.97)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 900, delay: 180, easing: ease, fill: 'backwards' }));
  /* transição do hero ao rolar */
  const heroMain = $('#hero-main'), heroStrip = $('.hero-strip'), heroShade = $('#hero-shade');
  if (hero && heroMain) {
    let ticking = false;
    const onScroll = () => {
      ticking = false;
      const h = hero.offsetHeight || 1;
      const p = Math.min(1, Math.max(0, window.scrollY / h));
      if (reduce) {
        heroMain.style.opacity = String(1 - p * .9);
      } else {
        heroMain.style.transform = `translate3d(0, ${(-p * 90).toFixed(1)}px, 0) scale(${(1 - p * .06).toFixed(4)})`;
        heroMain.style.opacity = String(Math.max(0, 1 - p * 1.4));
        if (glow) glow.style.transform = `translate3d(0, ${(p * 120).toFixed(1)}px, 0)`;
      }
      if (heroStrip) heroStrip.style.opacity = String(Math.max(0, 1 - p * 5));
      if (heroShade) heroShade.style.opacity = String(Math.min(.85, p * 1.1));
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    onScroll();
  }

  /* ---------- linha do tempo (home) ---------- */
  const tlPoints = $('#tl-points');
  const tlCards = $('#tl-cards');
  if (tlPoints) {
    const last = MILESTONES.length - 1;
    tlPoints.innerHTML = MILESTONES.map(({ label, title, text }, i) => `
      <div class="tl-pt${i === last ? ' is-latest' : ''}" data-pt="${i}" tabindex="0" role="button" aria-label="${esc(label + ' — ' + title)}" aria-expanded="false">
        <div class="tl-tip" role="tooltip">${esc(text)}</div>
        <div class="tl-dot"></div>
        <div class="tl-meta"><div class="tl-date">${esc(label)}</div><div class="tl-title">${esc(title)}</div></div>
      </div>`).join('');
    const pts = $$('.tl-pt', tlPoints);
    // datas com alturas iguais: os títulos começam na mesma linha mesmo quando uma data quebra em duas
    const dates = $$('.tl-date', tlPoints);
    const tlBox = tlPoints.closest('.tl');
    const equalize = () => {
      dates.forEach(d => { d.style.minHeight = ''; });
      const max = Math.max(...dates.map(d => d.getBoundingClientRect().height));
      if (max > 0) dates.forEach(d => { d.style.minHeight = max + 'px'; });
      // o trilho acompanha a altura dos textos, para não invadir o bloco seguinte
      if (tlBox && getComputedStyle(tlBox).display !== 'none') {
        tlBox.style.height = '';
        const base = tlBox.getBoundingClientRect().height;
        const need = Math.max(...pts.map(pt => pt.querySelector('.tl-meta').getBoundingClientRect().bottom)) - tlBox.getBoundingClientRect().top;
        if (need > base) tlBox.style.height = Math.ceil(need) + 'px';
      }
    };
    let eqRaf = 0;
    const scheduleEq = () => { cancelAnimationFrame(eqRaf); eqRaf = requestAnimationFrame(equalize); };
    equalize();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(scheduleEq);
    window.addEventListener('resize', scheduleEq);
    const setOpen = (pt, open) => { pt.classList.toggle('is-open', open); pt.setAttribute('aria-expanded', String(open)); };
    pts.forEach(pt => {
      pt.addEventListener('mouseenter', () => setOpen(pt, true));
      pt.addEventListener('mouseleave', () => setOpen(pt, false));
      pt.addEventListener('focus', () => setOpen(pt, true));
      pt.addEventListener('blur', () => setOpen(pt, false));
      pt.addEventListener('click', () => { const was = pt.classList.contains('is-open'); pts.forEach(p => setOpen(p, false)); setOpen(pt, !was); });
      pt.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pt.click(); } });
    });
  }
  if (tlCards) {
    const last = MILESTONES.length - 1;
    tlCards.innerHTML = MILESTONES.map(({ label, title, text }, i) => `
      <article class="tl-card${i === last ? ' is-latest' : ''}" data-pt="${i}">
        <div class="tl-card__top"><span class="tl-card__dot"></span><span class="tl-date">${esc(label)}</span></div>
        <h3>${esc(title)}</h3>
        <p>${esc(text)}</p>
      </article>`).join('');
  }
  // item final (sem data) + botão, sempre depois dos marcos
  const tlEnd = $('#tl-end');
  if (tlEnd) {
    tlEnd.innerHTML = `
      <h3 class="tl-end__title">${esc(TL_END.title)}</h3>
      <p class="tl-end__text">${esc(TL_END.text)}</p>
      <a href="${esc(TL_END.href)}" class="link-arrow tl-end__cta">${esc(TL_END.cta)} <span class="arrow">→</span></a>`;
  }

  /* ---------- linha do tempo (nossa-historia.html) ---------- */
  const vtl = $('#vtl');
  if (vtl) {
    const last = MILESTONES.length - 1;
    vtl.insertAdjacentHTML('beforeend', MILESTONES.map(({ label, title, text }, i) => `
      <div class="vtl__item${i === last ? ' is-latest' : ''}" data-pt="${i}">
        <div class="vtl__date">${esc(label)}</div>
        <div class="vtl__dotcol"><div class="vtl__dot"></div></div>
        <div><h3>${esc(title)}</h3><p>${esc(text)}</p><a href="index.html#galeria" class="link-arrow">Ver fotos <span class="arrow">→</span></a></div>
        <div class="placeholder">foto do marco</div>
      </div>`).join('') + `
      <div class="vtl__item vtl__item--end" data-pt="${MILESTONES.length}">
        <div class="vtl__date"></div>
        <div class="vtl__dotcol"><div class="vtl__dot"></div></div>
        <div><h3>${esc(TL_END.title)}</h3><p>${esc(TL_END.text)}</p></div>
        <div></div>
      </div>`);
  }

  /* ---------- formulário (somente visual) ---------- */
  const form = $('#contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      $('#form-note').textContent = 'Obrigado! O envio ainda não está conectado — em breve retornaremos por aqui.';
    });
  }

  /* ---------- Sobre: entrada ao rolar (uma vez) ---------- */
  const about = $('#sobre');
  if (about) {
    if ('IntersectionObserver' in window) {
      const aio = new IntersectionObserver(([en]) => { if (en.isIntersecting) { about.classList.add('is-in'); aio.disconnect(); } }, { threshold: .2 });
      aio.observe(about);
    } else about.classList.add('is-in');
  }

  /* ---------- revelar ao rolar ---------- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      const el = en.target;
      if (el.matches('[data-draw]')) animate(el, reduce ? fade : [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 900, easing: ease, fill: 'backwards' });
      else if (el.matches('[data-draw-y]')) animate(el, reduce ? fade : [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], { duration: 1400, easing: ease, fill: 'backwards' });
      else animate(el, reduce ? fade : [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 500, delay: 250 + (+el.dataset.pt || 0) * 60, easing: ease, fill: 'backwards' });
    }), { threshold: .2 });
    $$('[data-draw],[data-draw-y],[data-pt]').forEach(el => io.observe(el));
  }
})();
