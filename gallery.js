/* Galeria (#galeria): carrossel em perspectiva, legenda, lightbox e ligação com a linha do tempo.
   Dados em data/gallery.json. Sem JS, a seção mostra a grade estática do HTML. */
(() => {
  const root = document.getElementById('galeria');
  if (!root) return;

  const $ = s => root.querySelector(s);
  const stage = $('#gal-stage'), wrap = $('.gal-stage-wrap'), capEl = $('#gal-caption');
  const counterEl = $('#gal-counter'), bar = $('#gal-bar');
  const playBtn = $('#gal-play'), prevBtn = $('#gal-prev'), nextBtn = $('#gal-next');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TICK = 5000, RESUME = 8000, CAP_MS = 150;
  const MES = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmtDate = iso => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || ''); return m ? `${+m[3]} ${MES[+m[2] - 1]} ${m[1]}` : ''; };
  const pad = n => String(n).padStart(2, '0');

  let all = [], events = [], list = [], data = null;
  let idx = 0, timer = null, capTimer = null;
  let manualPause = false, hover = false, focusIn = false, inView = true, dragging = false, lbOpen = false;
  let resumeAt = 0, dragDx = 0, curSp = 300, lastDragEnd = 0, revealed = false;

  /* ---------- autoplay ---------- */
  const canPlay = () => !reduce && !manualPause && !hover && !focusIn && !document.hidden && inView &&
    !dragging && !lbOpen && list.length > 1 && Date.now() >= resumeAt;

  function schedule() {
    clearTimeout(timer); timer = null;
    if (canPlay()) {
      stage.classList.remove('is-paused');
      timer = setTimeout(() => goTo(idx + 1, false), TICK);
    } else {
      stage.classList.add('is-paused');
      const wait = resumeAt - Date.now();
      if (!manualPause && !reduce && list.length > 1 && wait > 0) timer = setTimeout(schedule, wait + 30);
    }
    if (playBtn) {
      playBtn.setAttribute('aria-pressed', String(manualPause));
      playBtn.setAttribute('aria-label', manualPause ? 'Reproduzir' : 'Pausar');
      playBtn.textContent = manualPause ? '▶' : '❚❚';
    }
  }

  function restartBar() {
    bar.classList.remove('run');
    void bar.offsetWidth;
    bar.classList.add('run');
  }

  /* ---------- geometria do carrossel ---------- */
  function layout(offset = 0) {
    const vw = window.innerWidth;
    const cw = vw >= 1024 ? 340 : vw >= 768 ? 260 : Math.round((stage.clientWidth || 320) * 0.8);
    const sp = vw >= 768 ? cw * 0.72 : cw * 0.9;
    curSp = sp;
    stage.style.setProperty('--cw', cw + 'px');
    stage.style.height = Math.round(cw * 1.25 + 24) + 'px';
    const pos = idx - offset / sp;
    stage.querySelectorAll('.gal-slide').forEach((el, i) => {
      const d = i - pos, ad = Math.abs(d);
      const hidden = ad > 2.6;
      const s = ad <= 1 ? 1 - 0.15 * ad : Math.max(0.6, 0.85 - 0.13 * (ad - 1));
      const op = ad <= 1 ? 1 - 0.3 * ad : Math.max(0.3, 0.7 - 0.3 * (ad - 1));
      const ry = Math.max(-2, Math.min(2, d)) * -14;
      el.style.transform = `translate3d(${(d * sp).toFixed(1)}px, 0, 0) rotateY(${ry.toFixed(2)}deg) scale(${s.toFixed(3)})`;
      el.style.setProperty('--op', hidden ? '0' : op.toFixed(3));
      el.style.zIndex = String(20 - Math.round(ad * 4));
      el.style.visibility = hidden ? 'hidden' : 'visible';
      el.classList.toggle('is-center', ad < 0.5);
    });
  }

  /* ---------- legenda ---------- */
  function updateCaption(user) {
    const it = list[idx];
    if (!it) return;
    const apply = () => {
      capEl.innerHTML = `<div class="gal-cap__date">${esc(fmtDate(it.data) || it.dataLabel || '')}</div>` +
        `<div class="gal-cap__evento">${esc(it.evento)}</div>` +
        `<div class="gal-cap__local">${esc(it.local || '')}</div>`;
      capEl.classList.remove('is-out');
      if (!reduce) { capEl.classList.remove('is-new'); void capEl.offsetWidth; capEl.classList.add('is-new'); }
    };
    capEl.setAttribute('aria-live', user ? 'polite' : 'off');
    clearTimeout(capTimer);
    if (reduce || !capEl.dataset.ready) { apply(); capEl.dataset.ready = '1'; return; }
    capEl.classList.add('is-out');
    capTimer = setTimeout(apply, CAP_MS);
  }

  /* ---------- navegação ---------- */
  function preload(i) {
    const n = list.length;
    const it = list[((i % n) + n) % n];
    if (it) { const im = new Image(); im.src = it.src; }
  }

  function goTo(i, user) {
    const n = list.length;
    if (!n) return;
    i = ((i % n) + n) % n;
    const changed = i !== idx;
    idx = i;
    layout(0);
    updateCaption(user);
    counterEl.textContent = `${pad(idx + 1)} / ${pad(n)}`;
    if (changed || user) restartBar();
    if (user) resumeAt = Date.now() + RESUME;
    preload(idx + 1); preload(idx - 1);
    schedule();
  }

  /* ---------- montagem ---------- */
  function picture(it, eager) {
    const srcs = (it.srcAvif ? `<source type="image/avif" srcset="${esc(it.srcAvif)}">` : '') +
      (it.srcWebp ? `<source type="image/webp" srcset="${esc(it.srcWebp)}">` : '');
    return `<picture>${srcs}<img src="${esc(it.src)}" width="${Number(it.width) || 4}" height="${Number(it.height) || 5}" ` +
      `alt="${esc(it.alt || '')}" loading="${eager ? 'eager' : 'lazy'}" decoding="async" draggable="false"></picture>`;
  }

  function buildStage() {
    stage.innerHTML = list.map((it, i) => {
      const label = `Ampliar foto: ${it.evento}${fmtDate(it.data) ? ', ' + fmtDate(it.data) : ''}`;
      return `<figure class="gal-slide" data-i="${i}"><button type="button" class="gal-open" tabindex="-1" aria-label="${esc(label)}">${picture(it, i === 0)}</button></figure>`;
    }).join('');
  }

  // Sem filtros na tela: leva ao primeiro item do evento dentro da galeria completa.
  function setFilter(id, user) {
    if (id !== 'todos' && !events.some(e => e.id === id)) return;
    const apply = () => {
      list = all.slice();
      idx = id === 'todos' ? 0 : Math.max(0, list.findIndex(x => x.eventoId === id));
      buildStage();
      layout(0);
      updateCaption(false);
      counterEl.textContent = `${pad(idx + 1)} / ${pad(list.length)}`;
      restartBar();
      resumeAt = user ? Date.now() + RESUME : 0;
      schedule();
      stage.classList.remove('is-fade');
    };
    if (reduce) apply();
    else { stage.classList.add('is-fade'); setTimeout(apply, 150); }
  }

  /* ---------- lightbox ---------- */
  let lb, lbImg, lbCap, lbCount, lbClose, lbPrev, lbNext, lbIdx = 0, lbOrigin = null, lbOriginImg = null, lbOriginIdx = -1;

  function buildLb() {
    lb = document.createElement('div');
    lb.className = 'gal-lb';
    lb.hidden = true;
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Foto ampliada');
    lb.innerHTML = '<div class="gal-lb__bg" data-close></div>' +
      '<button type="button" class="gal-lb__close" data-close aria-label="Fechar">×</button>' +
      '<button type="button" class="gal-lb__nav gal-lb__prev" aria-label="Foto anterior">←</button>' +
      '<figure class="gal-lb__fig"><img class="gal-lb__img" alt=""><figcaption class="gal-lb__cap"></figcaption></figure>' +
      '<button type="button" class="gal-lb__nav gal-lb__next" aria-label="Próxima foto">→</button>' +
      '<div class="gal-lb__count" aria-live="polite"></div>';
    document.body.appendChild(lb);
    lbImg = lb.querySelector('.gal-lb__img');
    lbCap = lb.querySelector('.gal-lb__cap');
    lbCount = lb.querySelector('.gal-lb__count');
    lbClose = lb.querySelector('.gal-lb__close');
    lbPrev = lb.querySelector('.gal-lb__prev');
    lbNext = lb.querySelector('.gal-lb__next');

    lb.addEventListener('click', e => {
      if (e.target.closest('[data-close]')) closeLb();
      else if (e.target.closest('.gal-lb__prev')) lbStep(-1);
      else if (e.target.closest('.gal-lb__next')) lbStep(1);
    });
    document.addEventListener('keydown', e => {
      if (!lbOpen) return;
      if (e.key === 'Escape') { e.preventDefault(); closeLb(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); lbStep(-1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); lbStep(1); }
      else if (e.key === 'Tab') {
        const f = [lbClose, lbPrev, lbNext];
        const k = f.indexOf(document.activeElement);
        if (e.shiftKey && (k <= 0)) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && (k === -1 || k === f.length - 1)) { e.preventDefault(); f[0].focus(); }
      }
    });

    // arrastar a foto: para os lados troca, para baixo fecha
    let sx = 0, sy = 0, dragLb = false;
    lbImg.addEventListener('pointerdown', e => { dragLb = true; sx = e.clientX; sy = e.clientY; lbImg.setPointerCapture(e.pointerId); lbImg.style.transition = 'none'; });
    lbImg.addEventListener('pointermove', e => {
      if (!dragLb) return;
      lbImg.style.transform = `translate(${e.clientX - sx}px, ${Math.max(0, e.clientY - sy)}px)`;
    });
    const endLb = e => {
      if (!dragLb) return;
      dragLb = false;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      lbImg.style.transition = '';
      lbImg.style.transform = '';
      if (dx > 80) lbStep(-1);
      else if (dx < -80) lbStep(1);
      else if (dy > 120) closeLb();
    };
    lbImg.addEventListener('pointerup', endLb);
    lbImg.addEventListener('pointercancel', () => { dragLb = false; lbImg.style.transform = ''; lbImg.style.transition = ''; });
  }

  function lbShow(i) {
    const n = list.length;
    lbIdx = ((i % n) + n) % n;
    const it = list[lbIdx];
    lbImg.alt = it.alt || '';
    lbImg.src = it.src;
    lbCap.innerHTML = `<div class="gal-cap__date">${esc(fmtDate(it.data) || it.dataLabel || '')}</div>` +
      `<div class="gal-cap__evento">${esc(it.evento)}</div>` +
      `<div class="gal-cap__local">${esc(it.local || '')}</div>` +
      (it.legenda ? `<p class="gal-lb__legenda">${esc(it.legenda)}</p>` : '');
    lbCount.textContent = `${lbIdx + 1} de ${n}`;
    preload(lbIdx + 1); preload(lbIdx - 1);
  }

  function lbStep(d) {
    if (reduce) { lbShow(lbIdx + d); return; }
    lbImg.style.opacity = '0';
    const next = lbIdx + d;
    setTimeout(() => { lbShow(next); lbImg.style.opacity = '1'; }, 150);
  }

  function openLb(i, btn) {
    if (!lb) buildLb();
    lbOrigin = btn;
    lbOriginImg = btn && btn.querySelector('img');
    lbOriginIdx = i;
    lbOpen = true;
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    lbShow(i);
    schedule();
    lb.classList.remove('is-on');
    requestAnimationFrame(() => {
      const to = lbImg.getBoundingClientRect();
      const from = lbOriginImg && lbOriginImg.getBoundingClientRect();
      if (!reduce && from && from.width && to.width) {
        lbImg.style.transition = 'none';
        lbImg.style.transformOrigin = '0 0';
        lbImg.style.transform = `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`;
        void lbImg.offsetWidth;
        lbImg.style.transition = 'transform .3s cubic-bezier(0.23, 1, 0.32, 1)';
        lbImg.style.transform = 'none';
      }
      lb.classList.add('is-on');
      lbClose.focus({ preventScroll: true });
    });
  }

  function closeLb() {
    if (!lbOpen) return;
    lbOpen = false;
    const back = lbOriginImg && lbOriginImg.getBoundingClientRect();
    const visible = back && back.width && back.bottom > 0 && back.top < window.innerHeight;
    lb.classList.remove('is-on');
    if (!reduce && visible && lbIdx === lbOriginIdx) {
      const cur = lbImg.getBoundingClientRect();
      lbImg.style.transformOrigin = '0 0';
      lbImg.style.transition = 'transform .2s cubic-bezier(0.23, 1, 0.32, 1)';
      lbImg.style.transform = `translate(${back.left - cur.left}px, ${back.top - cur.top}px) scale(${back.width / cur.width}, ${back.height / cur.height})`;
    }
    setTimeout(finishClose, reduce || !visible || lbIdx !== lbOriginIdx ? 0 : 200);
  }

  function finishClose() {
    lb.hidden = true;
    lbImg.style.transform = ''; lbImg.style.transition = ''; lbImg.style.opacity = '';
    document.body.style.overflow = '';
    if (lbIdx !== idx && list.length) goTo(lbIdx, false);
    if (lbOrigin && lbOrigin.isConnected) lbOrigin.focus({ preventScroll: true });
    schedule();
  }

  /* ---------- ligação com a linha do tempo (Sobre) ---------- */
  function scrollToGallery() {
    const top = window.NP_naturalTop ? window.NP_naturalTop(root) : root.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: Math.max(0, top - 24), behavior: reduce ? 'auto' : 'smooth' });
  }

  function linkTimeline() {
    const tl = (data && data.linhaDoTempo) || [];
    const mk = id => {
      const a = document.createElement('a');
      a.className = 'tl-gal';
      a.href = `#galeria?evento=${encodeURIComponent(id)}`;
      a.textContent = 'Ver fotos →';
      a.addEventListener('click', e => {
        e.preventDefault();
        setFilter(id, true);
        history.replaceState(null, '', a.getAttribute('href'));
        scrollToGallery();
      });
      return a;
    };
    tl.forEach((id, k) => {
      if (!id || !all.some(x => x.eventoId === id)) return;   // sem fotos: sem link
      const pt = document.querySelector(`.tl-pt[data-pt="${k}"] .tl-tip`);
      const card = document.querySelector(`.tl-card[data-pt="${k}"]`);
      if (pt) pt.appendChild(mk(id));
      if (card) card.appendChild(mk(id));
    });
  }

  function readHash() {
    const m = /evento=([^&]+)/.exec(location.hash);
    return m ? decodeURIComponent(m[1]) : null;
  }

  /* ---------- eventos ---------- */
  function bindStage() {
    wrap.addEventListener('mouseenter', () => { hover = true; schedule(); });
    wrap.addEventListener('mouseleave', () => { hover = false; schedule(); });
    wrap.addEventListener('focusin', () => { focusIn = true; schedule(); });
    wrap.addEventListener('focusout', () => setTimeout(() => { focusIn = wrap.contains(document.activeElement); schedule(); }, 0));
    document.addEventListener('visibilitychange', schedule);
    window.addEventListener('resize', () => layout(0));

    prevBtn.addEventListener('click', () => goTo(idx - 1, true));
    nextBtn.addEventListener('click', () => goTo(idx + 1, true));
    playBtn.addEventListener('click', () => { manualPause = !manualPause; resumeAt = Date.now(); schedule(); });

    // teclado no carrossel
    stage.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(idx - 1, true); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); goTo(idx + 1, true); }
      else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const btn = stage.querySelector('.gal-slide.is-center .gal-open');
        if (btn) openLb(idx, btn);
      }
    });

    // clique: lateral traz ao centro; central abre o lightbox
    stage.addEventListener('click', e => {
      if (Date.now() - lastDragEnd < 300) return;
      const slide = e.target.closest('.gal-slide');
      if (!slide) return;
      const i = +slide.dataset.i;
      if (i === idx) openLb(i, slide.querySelector('.gal-open'));
      else goTo(i, true);
    });

    // arrastar (mouse e toque)
    let sx = 0, lastX = 0, lastT = 0, vx = 0, moved = false;
    stage.addEventListener('pointerdown', e => {
      if (e.button !== 0 || lbOpen) return;
      dragging = true; moved = false;
      sx = lastX = e.clientX; lastT = performance.now(); vx = 0;
      stage.setPointerCapture(e.pointerId);
      stage.classList.add('is-drag');
      schedule();
    });
    stage.addEventListener('pointermove', e => {
      if (!dragging) return;
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 6) moved = true;
      const now = performance.now();
      vx = (e.clientX - lastX) / Math.max(1, now - lastT);
      lastX = e.clientX; lastT = now;
      dragDx = dx;
      layout(dx);
    });
    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      stage.classList.remove('is-drag');
      if (moved) lastDragEnd = Date.now();
      const dx = dragDx; dragDx = 0;
      const steps = (Math.abs(dx) > 50 || Math.abs(vx) > 0.6) ? (dx < 0 ? 1 : -1) : 0;
      if (steps) goTo(idx + steps, true);
      else { layout(0); schedule(); }
    };
    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);

    // entrada ao rolar e pausa fora da tela
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      inView = en.isIntersecting;
      if (en.intersectionRatio >= 0.2 && !revealed) { revealed = true; root.classList.add('is-in'); }
      schedule();
    }), { threshold: [0, 0.2] });
    io.observe(root);
    window.addEventListener('hashchange', () => {
      const id = readHash();
      if (id && events.some(e => e.id === id)) setFilter(id, true);
    });
  }

  /* ---------- carga ---------- */
  function init(json) {
    data = json;
    all = (json.itens || []).filter(x => x.destaque)
      .sort((a, b) => String(b.data || '').localeCompare(String(a.data || '')));
    if (!all.length) { root.classList.add('gal-empty'); return; }
    const seen = new Map();
    all.forEach(it => { if (!seen.has(it.eventoId)) seen.set(it.eventoId, { id: it.eventoId, label: it.evento }); });
    events = [...seen.values()];
    list = all.slice();
    const wanted = readHash();
    buildStage();
    layout(0);
    updateCaption(false);
    counterEl.textContent = `${pad(idx + 1)} / ${pad(list.length)}`;
    if (wanted && events.some(e => e.id === wanted)) setFilter(wanted, false);
    bindStage();
    linkTimeline();
    schedule();
  }

  root.classList.add('gal-js');
  fetch('data/gallery.json', { cache: 'no-cache' })
    .then(r => { if (!r.ok) throw new Error('gallery.json'); return r.json(); })
    .then(init)
    .catch(() => { root.classList.add('gal-fallback-on'); });
})();
