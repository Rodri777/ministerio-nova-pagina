/* Vídeos (#videos): cards dos Reels do Instagram a partir de data/videos.json e lightbox com o player oficial.
   Nenhum script ou iframe do Instagram é carregado até o visitante abrir um Reel. */
(function () {
  'use strict';

  const side = document.getElementById('video-side');
  if (!side) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const TIMEOUT = 10000;

  let list = [];
  let cur = 0;
  let origin = null;
  let lb = null, frameEl, coverEl, loadEl, errEl, eyebrowEl, titleEl, metaEl, linkEl, altEl, prevEl, nextEl, closeEl;
  let timer = null;

  /* ---------- cards ---------- */
  function eyebrowOf(v) {
    return [v.dataExibicao, v.tipo].filter(Boolean).join(' · ').toUpperCase();
  }
  function metaOf(v) {
    return [v.evento, v.local].filter(Boolean).join(' · ');
  }
  function cardHTML(v, i) {
    const label = `Assistir ${v.titulo} no Instagram`;
    return `<article class="reel" style="--i:${i}">
  <button type="button" class="reel__btn" data-i="${i}" aria-label="${esc(label)}">
    <span class="reel__media">
      <picture>
        <source srcset="${esc(v.capa)}" type="image/webp">
        <img src="${esc(v.capaFallback)}" width="${esc(v.capaLargura)}" height="${esc(v.capaAltura)}" alt="" loading="lazy" decoding="async">
      </picture>
    </span>
    <span class="reel__badge"><svg aria-hidden="true" focusable="false"><use href="#i-instagram"/></svg>REELS</span>
    <span class="reel__play" aria-hidden="true"><svg viewBox="0 0 14 14" focusable="false"><path d="M4 2.2v9.6L12 7z" fill="currentColor"/></svg></span>
  </button>
  <div class="reel__body">
    <p class="reel__eyebrow">${esc(eyebrowOf(v))}</p>
    <h3 class="reel__title" title="${esc(v.titulo)}">${esc(v.titulo)}</h3>
    <p class="reel__meta">${esc(metaOf(v))}</p>
    ${v.descricao ? `<p class="reel__desc">${esc(v.descricao)}</p>` : ''}
  </div>
</article>`;
  }

  function render(items) {
    list = items.filter(v => v && typeof v.codigo === 'string' && v.codigo.trim());
    side.dataset.count = String(list.length);
    side.innerHTML = list.map(cardHTML).join('');
    if (!reduce) observe();
    else side.classList.add('is-in');
  }

  function observe() {
    if (!('IntersectionObserver' in window)) { side.classList.add('is-in'); return; }
    const io = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) { side.classList.add('is-in'); io.disconnect(); }
    }, { threshold: 0.2 });
    io.observe(side);
  }

  side.addEventListener('click', e => {
    const b = e.target.closest('.reel__btn');
    if (!b) return;
    openLb(Number(b.dataset.i), b);
  });

  /* ---------- lightbox ---------- */
  function buildLb() {
    lb = document.createElement('div');
    lb.className = 'vb';
    lb.hidden = true;
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Reel do Instagram');
    lb.innerHTML = `
      <div class="vb__bg" data-close></div>
      <button type="button" class="vb__close">Fechar</button>
      <button type="button" class="vb__nav vb__prev" aria-label="Reel anterior">&larr;</button>
      <button type="button" class="vb__nav vb__next" aria-label="Próximo Reel">&rarr;</button>
      <div class="vb__panel">
        <div class="vb__frame">
          <img class="vb__cover" alt="" aria-hidden="true">
          <div class="vb__load" aria-hidden="true"></div>
          <div class="vb__err" hidden>
            <p>Não foi possível carregar o vídeo aqui.</p>
            <a class="vb__alt" target="_blank" rel="noopener noreferrer">Assistir no Instagram &#8599;</a>
          </div>
        </div>
        <div class="vb__info">
          <p class="reel__eyebrow vb__eyebrow"></p>
          <h3 class="vb__title"></h3>
          <p class="reel__meta vb__meta"></p>
          <a class="vb__link" target="_blank" rel="noopener noreferrer">Abrir no Instagram &#8599;</a>
        </div>
      </div>`;
    document.body.appendChild(lb);
    frameEl = lb.querySelector('.vb__frame');
    coverEl = lb.querySelector('.vb__cover');
    loadEl = lb.querySelector('.vb__load');
    errEl = lb.querySelector('.vb__err');
    eyebrowEl = lb.querySelector('.vb__eyebrow');
    titleEl = lb.querySelector('.vb__title');
    metaEl = lb.querySelector('.vb__meta');
    linkEl = lb.querySelector('.vb__link');
    altEl = lb.querySelector('.vb__alt');
    prevEl = lb.querySelector('.vb__prev');
    nextEl = lb.querySelector('.vb__next');
    closeEl = lb.querySelector('.vb__close');

    lb.addEventListener('click', e => {
      if (e.target.closest('[data-close]') || e.target.closest('.vb__close')) close();
    });
    prevEl.addEventListener('click', () => step(-1));
    nextEl.addEventListener('click', () => step(1));
    lb.addEventListener('keydown', onKey);
    window.addEventListener('resize', () => { if (!lb.hidden) sizeFrame(); });
  }

  // Largura do player: até 400px; altura = largura × 16/9 + 160px (moldura), até 90vh.
  function sizeFrame() {
    const vw = window.innerWidth, vh = window.innerHeight;
    const desktop = vw >= 900;
    let w = Math.min(400, vw * 0.92 - (desktop ? 312 : 0));
    if (w * 16 / 9 + 160 > vh * 0.9) w = (vh * 0.9 - 160) * 9 / 16;
    w = Math.max(200, Math.round(w));
    const h = Math.round(w * 16 / 9 + 160);
    lb.style.setProperty('--fw', w + 'px');
    lb.style.setProperty('--fh', h + 'px');
  }

  function clearFrame() {
    clearTimeout(timer);
    timer = null;
    frameEl.querySelectorAll('iframe').forEach(n => n.remove());
  }

  function showItem(i) {
    const v = list[i];
    clearFrame();
    cur = i;
    coverEl.src = v.capaFallback;
    coverEl.alt = '';
    eyebrowEl.textContent = eyebrowOf(v);
    titleEl.textContent = v.titulo;
    metaEl.textContent = metaOf(v);
    linkEl.href = v.url;
    altEl.href = v.url;
    errEl.hidden = true;
    loadEl.hidden = false;
    prevEl.hidden = nextEl.hidden = list.length < 2;

    const f = document.createElement('iframe');
    f.src = 'https://www.instagram.com/reel/' + encodeURIComponent(v.codigo) + '/embed';
    f.title = v.titulo + ' no Instagram';
    f.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; clipboard-write');
    f.setAttribute('allowfullscreen', '');
    f.setAttribute('scrolling', 'no');
    f.style.cssText = 'border:0;width:100%;height:100%;position:relative;z-index:1;background:transparent';
    f.addEventListener('load', () => {
      if (!f.isConnected) return;
      clearTimeout(timer); timer = null;
      loadEl.hidden = true;
    });
    frameEl.appendChild(f);
    timer = setTimeout(() => {
      f.remove();
      loadEl.hidden = true;
      errEl.hidden = false;
      timer = null;
    }, TIMEOUT);
  }

  function openLb(i, from) {
    if (!lb) buildLb();
    origin = from || null;
    lb.hidden = false;
    sizeFrame();
    showItem(i);
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => lb.classList.add('is-on'));
    closeEl.focus();
  }

  function close() {
    if (!lb || lb.hidden) return;
    clearFrame();
    lb.classList.remove('is-on');
    document.body.style.overflow = '';
    const done = () => { lb.hidden = true; };
    if (reduce) done(); else setTimeout(done, 200);
    if (origin && origin.isConnected) origin.focus();
    origin = null;
  }

  function step(d) {
    if (list.length < 2) return;
    showItem((cur + d + list.length) % list.length);
  }

  function onKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); return; }
    if (e.key === 'Tab') {
      const f = Array.from(lb.querySelectorAll('button, a[href]')).filter(n => !n.hidden && n.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || !lb.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  /* ---------- carga ---------- */
  fetch('data/videos.json', { cache: 'no-cache' })
    .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(json => render(json.itens || []))
    .catch(() => { side.hidden = true; });
})();
