/* Ministério Nova Página — Discografia (renderizada a partir de data/releases.js) */
(() => {
  const root = document.getElementById('discografia');
  const ARTISTA = window.NP_ARTISTA;
  const DATA = window.NP_RELEASES;
  if (!root || !ARTISTA || !Array.isArray(DATA)) return;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const isPending = v => !v || /^\s*\[.*\]\s*$/.test(String(v));

  /* Ícones oficiais (Simple Icons, CC0) — formas originais, sem alteração */
  const ICONS = {
    spotify: 'M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z',
    appleMusic: 'M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.801.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03a12.5 12.5 0 001.57-.1c.822-.106 1.596-.35 2.295-.81a5.046 5.046 0 001.88-2.207c.186-.42.293-.87.37-1.324.113-.675.138-1.358.137-2.04-.002-3.8 0-7.595-.003-11.393zm-6.423 3.99v5.712c0 .417-.058.827-.244 1.206-.29.59-.76.962-1.388 1.14-.35.1-.706.157-1.07.173-.95.045-1.773-.6-1.943-1.536a1.88 1.88 0 011.038-2.022c.323-.16.67-.25 1.018-.324.378-.082.758-.153 1.134-.24.274-.063.457-.23.51-.516a.904.904 0 00.02-.193c0-1.815 0-3.63-.002-5.443a.725.725 0 00-.026-.185c-.04-.15-.15-.243-.304-.234-.16.01-.318.035-.475.066-.76.15-1.52.303-2.28.456l-2.325.47-1.374.278c-.016.003-.032.01-.048.013-.277.077-.377.203-.39.49-.002.042 0 .086 0 .13-.002 2.602 0 5.204-.003 7.805 0 .42-.047.836-.215 1.227-.278.64-.77 1.04-1.434 1.233-.35.1-.71.16-1.075.172-.96.036-1.755-.6-1.92-1.544-.14-.812.23-1.685 1.154-2.075.357-.15.73-.232 1.108-.31.287-.06.575-.116.86-.177.383-.083.583-.323.6-.714v-.15c0-2.96 0-5.922.002-8.882 0-.123.013-.25.042-.37.07-.285.273-.448.546-.518.255-.066.515-.112.774-.165.733-.15 1.466-.296 2.2-.444l2.27-.46c.67-.134 1.34-.27 2.01-.403.22-.043.442-.088.663-.106.31-.025.523.17.554.482.008.073.012.148.012.223.002 1.91.002 3.822 0 5.732z',
    deezer: 'M18.81 4.16v3.03H24V4.16h-5.19zM6.27 8.38v3.027h5.189V8.38h-5.19zm12.54 0v3.027H24V8.38h-5.19zM6.27 12.594v3.027h5.189v-3.027h-5.19zm6.271 0v3.027h5.19v-3.027h-5.19zm6.27 0v3.027H24v-3.027h-5.19zM0 16.81v3.029h5.19v-3.03H0zm6.27 0v3.029h5.189v-3.03h-5.19zm6.271 0v3.029h5.19v-3.03h-5.19zm6.27 0v3.029H24v-3.03h-5.19Z',
    youtubeMusic: 'M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228s6.228-2.796 6.228-6.228S15.432 5.772 12 5.772zM9.684 15.54V8.46L15.816 12l-6.132 3.54z',
    amazonMusic: 'M14.8454 9.4083c-1.3907 1.0194-3.405 1.563-5.1424 1.563a9.333 9.333 0 0 1-6.2768-2.3835c-.1313-.117-.0143-.277.1415-.1846a12.693 12.693 0 0 0 6.285 1.6574c1.5384 0 3.2348-.318 4.7917-.9764.2359-.0985.4328.1538.203.324h-.002zm.5784-.6564c-.1784-.2257-1.1753-.1087-1.6225-.0554-.1374.0164-.158-.1026-.0349-.1867.796-.5558 2.0984-.3958 2.2502-.2092.1539.1867-.041 1.4872-.7856 2.1087-.1149.0964-.2236.0451-.1723-.082.1682-.4165.5436-1.3498.3651-1.5754z'
  };
  const PLATFORMS = [
    ['appleMusic', 'Apple Music'],
    ['deezer', 'Deezer'],
    ['youtubeMusic', 'YouTube Music'],
    ['amazonMusic', 'Amazon Music']
  ];
  /* Amazon Music: só o símbolo (sorriso + seta) do SVG oficial, enquadrado num quadrado */
  const VIEWBOX = { amazonMusic: '3.17 3 13.1 13.1' };
  const icon = (k, cls = '') => `<svg class="${cls}" viewBox="${VIEWBOX[k] || '0 0 24 24'}" aria-hidden="true" focusable="false"><path d="${ICONS[k]}"/></svg>`;

  /* link externo; placeholders viram "link pendente" (não navegam) */
  const linkAttrs = url => isPending(url)
    ? `href="#" aria-disabled="true" data-pending title="Link pendente"`
    : `href="${esc(url)}" target="_blank" rel="noopener"`;

  const spotifyBtn = (url, label, extra = '') =>
    `<a class="btn-spotify ${extra}" ${linkAttrs(url)}>${icon('spotify', 'btn-spotify__icon')}<span>${esc(label)}</span></a>`;
  const platformIcons = (links, who) => PLATFORMS.map(([k, name]) =>
    `<a class="plat" ${linkAttrs(links[k])} aria-label="${esc(who)} no ${name}">${icon(k)}</a>`).join('');

  /* ---------- dados ---------- */
  const byDate = (a, b) => String(b.data).localeCompare(String(a.data));
  const published = DATA.filter(r => !r.emBreve).sort(byDate);
  const upcoming = DATA.filter(r => r.emBreve).sort((a, b) => String(a.data).localeCompare(String(b.data)))[0];
  const latestId = published[0] && published[0].id;
  if (!published.length) return;

  const fmtDate = iso => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || ''); if (!m) return '';
    const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    return `${+m[3]} ${meses[+m[2] - 1]} ${m[1]}`;
  };

  /* ---------- estrutura ---------- */
  const container = $('.container', root);
  container.innerHTML = `
    <header class="disco-head">
      <div class="eyebrow eyebrow--gold">Discografia</div>
      <h2 class="display" id="disco-titulo">Ouça, leia, <em>relembre</em>.</h2>
    </header>

    <article class="feature" id="disco-destaque" aria-live="polite">
      <div class="feature__glow" aria-hidden="true"></div>
      <div class="feature__art">
        <div class="vinyl-slide" aria-hidden="true"><div class="vinyl"><img class="vinyl__label" alt=""></div></div>
        <img class="feature__cover" alt="">
      </div>
      <div class="feature__info">
        <div class="eyebrow eyebrow--gold feature__eyebrow"></div>
        <h3 class="feature__title"><span class="feature__name"></span><span class="eq" aria-hidden="true"><i></i><i></i><i></i></span></h3>
        <p class="feature__meta"></p>
        <div class="player" hidden>
          <div class="player__facade">
            <img class="player__thumb" alt="" width="64" height="64">
            <div class="player__text"><span class="player__name"></span><span class="player__by"></span></div>
            <button type="button" class="player__btn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg><span class="player__label">Tocar prévia</span></button>
            <a class="player__btn player__fallback" target="_blank" rel="noopener" hidden>${icon('spotify', 'player__spotify')}<span>Ouvir no Spotify</span></a>
          </div>
          <div class="player__embed"><div class="player__mount"></div></div>
        </div>
        <div class="feature__plats"></div>
        <button type="button" class="link-lyrics">Ler a letra <span class="arrow" aria-hidden="true">→</span></button>
      </div>
    </article>

    <div class="eyebrow eyebrow--gold releases-label">Todos os lançamentos</div>
    <ul class="releases" role="list"></ul>
  `;

  const feature = $('.feature', root);
  const glow = $('.feature__glow', feature);
  const cover = $('.feature__cover', feature);
  const label = $('.vinyl__label', feature);
  const player = $('.player', feature);
  const list = $('.releases', root);
  let current = null;
  let playing = false;

  /* ---------- grade ---------- */
  const cardHTML = (r, i) => `
    <li class="rel" style="--i:${i}">
      <button type="button" class="rel__cover" data-id="${esc(r.id)}" aria-label="Ver ${esc(r.titulo)} em destaque" aria-controls="disco-destaque">
        <img src="${esc(r.capa)}" alt="" loading="lazy" width="240" height="240">
        <span class="rel__play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></svg></span>
      </button>
      <span class="rel__badge">Em destaque</span>
      <div class="rel__title"><span>${esc(r.titulo)}</span><span class="eq eq--sm" aria-hidden="true"><i></i><i></i><i></i></span></div>
      <div class="rel__meta">${esc(r.tipo)} · ${esc(r.ano)}</div>
    </li>`;

  const nextCardHTML = i => {
    if (upcoming) {
      const d = fmtDate(upcoming.data);
      return `
      <li class="rel rel--soon" style="--i:${i}">
        <div class="soon">
          <img class="soon__img" src="${esc(upcoming.capa)}" alt="" loading="lazy">
          <span class="soon__shine" aria-hidden="true"></span>
          <span class="soon__badge">Em breve</span>
          <div class="soon__body">
            ${d ? `<span class="soon__date">${esc(d)}</span>` : ''}
            <a class="btn-presave" ${linkAttrs(upcoming.preSaveUrl)}>Pré-salvar</a>
          </div>
        </div>
        <div class="rel__title"><span>${esc(upcoming.titulo)}</span></div>
        <div class="rel__meta">${esc(upcoming.tipo)} · ${esc(upcoming.ano)}</div>
      </li>`;
    }
    return `
      <li class="rel rel--next" style="--i:${i}">
        <div class="next">
          <img class="next__mark" src="assets/logo-mark-white.png" alt="" aria-hidden="true">
          <p class="next__title">A próxima página está sendo escrita.</p>
          <p class="next__text">Novas canções em breve. Siga no Spotify e seja o primeiro a ouvir.</p>
          ${spotifyBtn(ARTISTA.spotify, 'Seguir no Spotify', 'btn-spotify--sm')}
        </div>
      </li>`;
  };

  list.innerHTML = published.map(cardHTML).join('') + nextCardHTML(published.length);

  /* ---------- player de prévia (Spotify iFrame API, padrão fachada) ----------
     Nada do Spotify é carregado ao abrir a página. No primeiro clique em "Tocar prévia" o script público
     da iFrame API é inserido uma única vez e um único controller é criado; trocas de lançamento usam loadUri. */
  const API_SRC = 'https://open.spotify.com/embed/iframe-api/v1';
  const API_TIMEOUT = 8000, AUTOPLAY_WAIT = 3000;
  const isDev = location.protocol === 'file:' || ['localhost', '127.0.0.1', '::1', ''].includes(location.hostname);
  const hasId = v => typeof v === 'string' && v.trim() !== '' && !isPending(v);
  const trackUri = r => 'spotify:track:' + r.spotifyId.trim();
  const P = {
    facade: $('.player__facade', player), thumb: $('.player__thumb', player), name: $('.player__name', player),
    by: $('.player__by', player), btn: $('.player__btn:not(.player__fallback)', player), label: $('.player__label', player),
    fallback: $('.player__fallback', player), embed: $('.player__embed', player), mount: $('.player__mount', player)
  };
  let controller = null;      // o único controller da página
  let creating = false;       // controller em criação (evita um segundo)
  let embedId = null;         // spotifyId carregado no controller
  let apiFailed = false;      // script bloqueado / sem internet → fallback em link
  let apiPromise = null;
  const warned = new Set();

  const loadSpotifyApi = () => {
    if (window.__npSpotifyIframeApi) return Promise.resolve(window.__npSpotifyIframeApi);
    if (apiPromise) return apiPromise;
    apiPromise = new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Spotify iFrame API: tempo esgotado')), API_TIMEOUT);
      const previous = window.onSpotifyIframeApiReady;
      window.onSpotifyIframeApiReady = api => {
        clearTimeout(timer);
        window.__npSpotifyIframeApi = api;
        if (typeof previous === 'function') { try { previous(api); } catch (_) { /* ignora */ } }
        resolve(api);
      };
      if (!document.querySelector(`script[src="${API_SRC}"]`)) {
        const s = document.createElement('script');
        s.src = API_SRC; s.async = true;
        s.onerror = () => { clearTimeout(timer); reject(new Error('Spotify iFrame API: falha ao carregar')); };
        document.head.appendChild(s);
      }
    });
    return apiPromise;
  };

  const showEmbed = on => player.classList.toggle('is-embed', on);
  const setFrameTitle = r => {
    const f = $('iframe', P.embed);
    if (f) { f.title = `Prévia de ${r.titulo} no Spotify`; f.setAttribute('loading', 'lazy'); }
  };
  const resetButton = () => {
    P.btn.disabled = false; P.btn.removeAttribute('aria-busy'); P.label.textContent = 'Tocar prévia';
  };
  const renderFacade = r => {
    P.thumb.src = r.capa;
    P.name.textContent = r.titulo;
    P.by.textContent = ARTISTA.nome;
    P.btn.setAttribute('aria-label', `Tocar prévia de ${r.titulo}`);
    const link = !isPending(r.links && r.links.spotify) ? r.links.spotify : '';
    if (apiFailed) {
      P.btn.hidden = true;
      P.fallback.hidden = !link;
      if (link) P.fallback.href = link;
    } else {
      P.btn.hidden = false; P.fallback.hidden = true;
      if (!creating) resetButton();
    }
    showEmbed(false);
  };

  const syncPlayer = r => {
    setPlaying(false);
    if (!hasId(r.spotifyId)) {
      if (isDev && !warned.has(r.id)) { warned.add(r.id); console.warn(`Lançamento sem spotifyId: ${r.titulo}`); }
      if (controller) { controller.pause(); embedId = null; }   // ao voltar a um lançamento com ID, loadUri de novo
      player.hidden = true;
      return;
    }
    player.hidden = false;
    if (controller) {
      if (embedId !== r.spotifyId) { controller.loadUri(trackUri(r)); embedId = r.spotifyId; }
      setFrameTitle(r);
      showEmbed(true);
      return;
    }
    renderFacade(r);
  };

  const startPreview = () => {
    const r = current;
    if (controller || creating || !hasId(r.spotifyId)) return;
    creating = true;
    const hadFocus = document.activeElement === P.btn;
    P.btn.disabled = true; P.btn.setAttribute('aria-busy', 'true'); P.label.textContent = 'Carregando…';
    loadSpotifyApi().then(api => {
      api.createController(P.mount, { uri: trackUri(r), width: '100%', height: 152 }, ctrl => {
        if (controller) return;              // segurança: nunca um segundo controller
        controller = ctrl; creating = false; embedId = r.spotifyId;
        let started = false;
        ctrl.addListener('playback_update', e => {
          const paused = !!(e && e.data && e.data.isPaused);
          if (!paused) started = true;
          setPlaying(!paused);
        });
        resetButton();
        const target = current;              // o visitante pode ter trocado de lançamento durante o carregamento
        if (!hasId(target.spotifyId)) { player.hidden = true; return; }
        if (target !== r) { ctrl.loadUri(trackUri(target)); embedId = target.spotifyId; setFrameTitle(target); showEmbed(true); return; }
        setFrameTitle(r);
        showEmbed(true);
        const frame = $('iframe', P.embed);
        if (hadFocus && frame && (document.activeElement === P.btn || document.activeElement === document.body)) frame.focus();
        ctrl.play();
        // autoplay bloqueado: o player já está visível para o visitante apertar o play nele mesmo
        setTimeout(() => { if (!started) setPlaying(false); }, AUTOPLAY_WAIT);
      });
    }).catch(() => {
      creating = false; apiFailed = true;
      if (hasId(current.spotifyId)) renderFacade(current);
      if (hadFocus && !P.fallback.hidden) P.fallback.focus();
    });
  };
  P.btn.addEventListener('click', startPreview);

  const setPlaying = on => {
    playing = !!on;
    feature.classList.toggle('is-playing', playing);
    $$('.rel', list).forEach(li => li.classList.toggle('is-playing', playing && $('.rel__cover', li)?.dataset.id === current?.id));
  };

  /* ---------- destaque ---------- */
  const setGlow = src => {
    const layer = document.createElement('div');
    layer.className = 'feature__glow-layer';
    layer.style.backgroundImage = `url("${src}")`;
    glow.appendChild(layer);
    requestAnimationFrame(() => requestAnimationFrame(() => layer.classList.add('is-on')));
    $$('.feature__glow-layer', glow).slice(0, -1).forEach(old => {
      old.classList.remove('is-on');
      setTimeout(() => old.remove(), 700);
    });
  };
  const fill = r => {
    current = r;
    cover.src = r.capa; cover.alt = `Capa de ${r.titulo}`;
    label.src = r.capa;
    $('.feature__eyebrow', feature).textContent = r.id === latestId ? 'Lançamento mais recente' : 'Lançamento';
    $('.feature__name', feature).textContent = r.titulo;
    $('.feature__meta', feature).textContent = `${r.tipo} · ${r.ano}`;
    $('.feature__plats', feature).innerHTML = (isPending(r.links.spotify) ? '' : spotifyBtn(r.links.spotify, 'Ouvir no Spotify')) + `<div class="feature__icons">${platformIcons(r.links, r.titulo)}</div>`;
    syncPlayer(r);
    setGlow(r.capa);
    $$('.rel__cover', list).forEach(b => {
      const on = b.dataset.id === r.id;
      b.setAttribute('aria-pressed', String(on));
      b.closest('.rel').classList.toggle('is-active', on);
    });
  };
  const show = (id, { scroll = true } = {}) => {
    const r = published.find(x => x.id === id);
    if (!r || r === current) { if (scroll) scrollToFeature(); return; }
    if (reduce) { fill(r); } else {
      feature.classList.add('is-swapping');
      setTimeout(() => { fill(r); feature.classList.remove('is-swapping'); }, 150);
    }
    if (scroll) scrollToFeature();
  };
  const scrollToFeature = () => {
    const t = feature.getBoundingClientRect().top;
    if (t < 0 || t > window.innerHeight * 0.5) feature.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  list.addEventListener('click', e => { const b = e.target.closest('.rel__cover'); if (b) show(b.dataset.id); });
  root.addEventListener('click', e => { const a = e.target.closest('a[data-pending]'); if (a) e.preventDefault(); });

  fill(published[0]);

  /* ---------- letra (drawer / bottom sheet) ---------- */
  const drawer = document.getElementById('lyrics-drawer');
  const panel = $('.drawer__panel', drawer);
  let opener = null, closeTimer = null;
  const focusables = () => $$('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])', panel).filter(el => el.offsetParent !== null);
  const openDrawer = () => {
    const r = current; opener = document.activeElement;
    $('#drawer-title', drawer).textContent = r.titulo;
    $('.drawer__meta', drawer).textContent = `${r.tipo} · ${r.ano}`;
    $('.drawer__text', drawer).textContent = r.letra;
    $('.drawer__foot', drawer).innerHTML = spotifyBtn(r.links.spotify, 'Ouvir no Spotify');
    clearTimeout(closeTimer);
    drawer.hidden = false;
    document.body.style.overflow = 'hidden';
    void drawer.offsetWidth;
    drawer.classList.add('is-open');
    $('.drawer__close', drawer).focus({ preventScroll: true });
  };
  const closeDrawer = () => {
    if (drawer.hidden) return;
    drawer.classList.remove('is-open');
    document.body.style.overflow = '';
    closeTimer = setTimeout(() => { drawer.hidden = true; }, reduce ? 0 : 220);
    if (opener && opener.focus) opener.focus({ preventScroll: true });
  };
  $('.link-lyrics', feature).addEventListener('click', openDrawer);
  drawer.addEventListener('click', e => {
    if (e.target.closest('[data-close]')) closeDrawer();
    const a = e.target.closest('a[data-pending]'); if (a) e.preventDefault();
  });
  document.addEventListener('keydown', e => {
    if (drawer.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); closeDrawer(); return; }
    if (e.key !== 'Tab') return;
    const f = focusables(); if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (document.activeElement === last || !panel.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
  });

  /* ---------- entrada ao rolar (uma vez) ---------- */
  const reveal = (el, cls = 'is-in') => {
    if (!('IntersectionObserver' in window)) { el.classList.add(cls); return; }
    const io = new IntersectionObserver(([en]) => { if (en.isIntersecting) { el.classList.add(cls); io.disconnect(); } }, { threshold: .2 });
    io.observe(el);
  };
  reveal(feature);
  reveal(list);
})();
