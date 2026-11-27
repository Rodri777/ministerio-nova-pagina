/* Agenda (#agenda): eventos da Google Calendar API v3 (leitura com chave de API, sem OAuth).
   Configuração em data/agenda-publica.js (window.NP_CALENDARIO). */
(() => {
  'use strict';

  const section = document.getElementById('agenda');
  const root = document.getElementById('events');
  if (!section || !root) return;

  const cfg = window.NP_CALENDARIO || {};
  const TZ = 'America/Cuiaba';
  const FETCH_SIZE = Number(cfg.pageSize) || 20;   // eventos buscados na API
  const VISIBLE = 6;                                // eventos exibidos antes de "Ver agenda completa"
  const CACHE_KEY = 'np-agenda-v1';
  const CACHE_MS = 10 * 60 * 1000;
  const ENDPOINT = 'https://www.googleapis.com/calendar/v3/calendars/' + encodeURIComponent(cfg.calendarId || '') + '/events';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ARROW = '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  let state = 'loading';
  let events = [];
  let showAll = false;
  let seen = false;

  /* ---------- utilidades ---------- */
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const isUrl = v => {
    if (typeof v !== 'string' || !/^https?:\/\//i.test(v.trim())) return false;
    try { new URL(v.trim()); return true; } catch (_) { return false; }
  };
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const fmt = (date, opts, tz = TZ) => new Intl.DateTimeFormat('pt-BR', { ...opts, timeZone: tz }).format(date);
  const hm = d => fmt(d, { hour: '2-digit', minute: '2-digit', hour12: false });
  const ymd = (d, tz = TZ) => new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
  const dayNum = key => { const [y, m, d] = key.split('-').map(Number); return Date.UTC(y, m - 1, d) / 86400000; };
  const monthShort = (date, tz) => fmt(date, { month: 'short' }, tz).replace('.', '').toUpperCase();
  const weekdayShort = (date, tz) => fmt(date, { weekday: 'short' }, tz).replace('.', '').toUpperCase();

  // Texto puro: somente texto e quebras de linha; qualquer HTML do Google Agenda é descartado.
  function toText(html) {
    if (!html) return '';
    const prepared = String(html).replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|div|li)>/gi, '\n');
    const doc = new DOMParser().parseFromString(prepared, 'text/html');
    const t = (doc.body.textContent || '').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
    return t ? cap(t) : '';
  }

  // Local: remove CEP e "Brasil" e separa nome do local e cidade/UF.
  function parseLocal(raw) {
    const parts = String(raw || '').split(',')
      .map(p => p.replace(/\b\d{5}-?\d{3}\b/g, '').replace(/\s+/g, ' ').trim())
      .filter(p => p && !/^brasil$/i.test(p));
    let city = null, uf = null, rest = parts.slice();
    const last = rest[rest.length - 1] || '';
    const dashed = last.match(/^(.+?)\s*[-–\/]\s*([A-Za-z]{2})$/);
    if (dashed) {
      city = dashed[1].trim(); uf = dashed[2].toUpperCase(); rest.pop();
      // "Av. Jaime Barrichelo - Sorriso/MT": o trecho antes do último " - " é endereço, não cidade
      const cut = city.lastIndexOf(' - ');
      if (cut > 0) { rest.push(city.slice(0, cut).trim()); city = city.slice(cut + 3).trim(); }
    }
    else if (/^[A-Za-z]{2}$/.test(last) && rest.length >= 2) { uf = last.toUpperCase(); rest.pop(); city = rest.pop(); }
    if (city && uf) return { name: rest.join(', ') || null, city: `${city}/${uf}`, text: null };
    const text = parts.join(', ') || null;
    return { name: null, city: null, text };
  }

  function normalize(items) {
    const nowKey = ymd(new Date());
    const today = dayNum(nowKey);
    const now = Date.now();
    return items
      .filter(ev => ev && ev.status !== 'cancelled')
      .map(ev => {
        const s = ev.start || {}, e = ev.end || {};
        const title = String(ev.summary || '').trim() || 'Evento confirmado';
        const rawLocation = typeof ev.location === 'string' ? ev.location.trim() : '';
        const description = toText(ev.description);
        let base;
        if (s.dateTime) {
          const start = new Date(s.dateTime);
          const end = e.dateTime ? new Date(e.dateTime) : new Date(start.getTime() + 3600e3);
          if (end.getTime() <= now) return null;                       // já terminou
          base = {
            allDay: false, start, end,
            startKey: ymd(start), sortTs: start.getTime(),
            time: hm(start) + ' – ' + hm(end)
          };
        } else if (s.date) {
          const [y, m, d] = s.date.split('-').map(Number);
          const dt = new Date(Date.UTC(y, m - 1, d));
          const [ey, em, ed] = e.date ? e.date.split('-').map(Number) : [y, m, d];
          const lastDay = Date.UTC(ey, em - 1, e.date ? ed - 1 : d) / 86400000;   // o fim do Google é exclusivo
          if (lastDay < today) return null;                             // dia inteiro já passou
          base = {
            allDay: true, start: null, end: null,
            startKey: s.date, endKey: e.date || s.date, sortTs: Date.parse(`${s.date}T00:00:00-04:00`),
            time: 'Dia inteiro', dayUtc: dt
          };
        } else {
          return null;
        }
        const dateForParts = base.allDay ? base.dayUtc : base.start;
        const tz = base.allDay ? 'UTC' : TZ;
        const daysAway = dayNum(base.startKey) - today;
        return {
          ...base,
          title,
          day: fmt(dateForParts, { day: '2-digit' }, tz),
          month: monthShort(dateForParts, tz),
          weekday: cap(fmt(dateForParts, { weekday: 'long' }, tz)),
          weekdayShort: weekdayShort(dateForParts, tz),
          daysAway,
          place: isUrl(rawLocation) ? { name: null, city: null, text: null } : parseLocal(rawLocation),
          rawLocation,
          isLink: isUrl(rawLocation),
          description
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.sortTs - b.sortTs);
  }

  function selo(ev) {
    if (ev.daysAway <= 0) return 'hoje';
    if (ev.daysAway === 1) return 'amanhã';
    return `em ${ev.daysAway} dias`;
  }

  // Links: adicionar ao Google Agenda e chegar pelo mapa.
  function calendarUrl(ev) {
    const toZ = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
    const dates = ev.allDay
      ? `${ev.startKey.replace(/-/g, '')}/${ev.endKey.replace(/-/g, '')}`
      : `${toZ(ev.start)}/${toZ(ev.end)}`;
    const q = [
      'action=TEMPLATE',
      'text=' + encodeURIComponent(ev.title),
      'dates=' + dates,
      ev.description ? 'details=' + encodeURIComponent(ev.description) : '',
      ev.rawLocation ? 'location=' + encodeURIComponent(ev.rawLocation) : ''
    ].filter(Boolean).join('&');
    return 'https://calendar.google.com/calendar/render?' + q;
  }
  const mapsUrl = ev => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(ev.rawLocation);

  function actionsHTML(ev) {
    const chegar = ev.rawLocation && !ev.isLink
      ? `<a class="ag-map" href="${esc(mapsUrl(ev))}" target="_blank" rel="noopener noreferrer">Como chegar &#8599;</a>`
      : (ev.isLink ? `<a class="ag-map" href="${esc(ev.rawLocation)}" target="_blank" rel="noopener noreferrer">Acessar link do evento &#8599;</a>` : '');
    return `<div class="ag-actions">
  <a class="ag-folha" href="${esc(calendarUrl(ev))}" target="_blank" rel="noopener noreferrer"><span>+ Adicionar à minha agenda</span></a>
  ${chegar}
</div>`;
  }

  function placeText(ev) {
    if (ev.place.name && ev.place.city) return `${ev.place.name} · ${ev.place.city}`;
    if (ev.place.city) return ev.place.city;
    return ev.place.name || ev.place.text || '';
  }

  /* ---------- estados ---------- */
  function setBusy(v) { root.setAttribute('aria-busy', v ? 'true' : 'false'); }

  function renderLoading() {
    root.className = 'ag-list';
    setBusy(true);
    root.innerHTML = `
      <div class="ag-next ag-next--sk" aria-hidden="true">
        <div class="ag-next__date"><span class="ag-sk ag-sk--day"></span><span class="ag-sk ag-sk--mon"></span></div>
        <div class="ag-next__info">
          <span class="ag-sk ag-sk--line w40"></span>
          <span class="ag-sk ag-sk--title"></span>
          <span class="ag-sk ag-sk--line w70"></span>
          <span class="ag-sk ag-sk--line w50"></span>
        </div>
      </div>
      <div class="ag-sk-row" aria-hidden="true"><span class="ag-sk ag-sk--cell"></span><span class="ag-sk ag-sk--line w60"></span><span class="ag-sk ag-sk--line w30"></span><span class="ag-sk ag-sk--line w40"></span></div>
      <div class="ag-sk-row" aria-hidden="true"><span class="ag-sk ag-sk--cell"></span><span class="ag-sk ag-sk--line w60"></span><span class="ag-sk ag-sk--line w30"></span><span class="ag-sk ag-sk--line w40"></span></div>`;
  }

  function renderEmpty() {
    root.className = 'ag-list';
    setBusy(false);
    root.innerHTML = `<div class="ag-empty ag-enter" style="--i:0">
  <p class="ag-empty__t">Nenhuma apresentação agendada no momento.</p>
  <p class="ag-empty__s">Que tal levar o ministério até a sua igreja ou evento?</p>
  <a class="ag-folha" href="#agendamentos"><span>Convide o ministério para o seu evento</span></a>
</div>`;
  }

  function renderPopulated() {
    root.className = 'ag-list';
    setBusy(false);
    const [first, ...rest] = events;
    const featured = `<article class="ag-next ag-enter" style="--i:0" aria-labelledby="ag-next-titulo">
  <div class="ag-next__date">
    <span class="ag-next__day">${esc(first.day)}</span>
    <span class="ag-next__mon">${esc(first.month)}</span>
  </div>
  <div class="ag-next__info">
    <p class="ag-next__selo">Próximo encontro · ${esc(selo(first))}</p>
    <p class="ag-next__when">${esc(first.weekday)} · ${esc(first.time)}</p>
    <h3 class="ag-next__title" id="ag-next-titulo">${esc(first.title)}</h3>
    ${placeText(first) ? `<p class="ag-next__place">${esc(placeText(first))}</p>` : ''}
    ${first.description ? `<p class="ag-next__desc">${esc(first.description)}</p>` : ''}
    ${actionsHTML(first)}
  </div>
</article>`;

    const rows = rest.map((ev, k) => {
      const i = k + 1;
      const hidden = i >= VISIBLE && !showAll;
      return `<div class="ag-item ag-enter" data-i="${i}" style="--i:${i + 1}"${hidden ? ' hidden' : ''}>
  <button type="button" class="ag-row" id="ag-row-${i}" aria-expanded="false" aria-controls="ag-panel-${i}">
    <span class="ag-row__date"><span class="ag-row__dm"><span class="ag-row__day">${esc(ev.day)}</span><span class="ag-row__mon">${esc(ev.month)}</span></span><span class="ag-row__wd">${esc(ev.weekdayShort)}</span></span>
    <span class="ag-row__main"><span class="ag-row__title">${esc(ev.title)}</span>${ev.place.name || ev.place.text ? `<span class="ag-row__place">${esc(ev.place.name || ev.place.text)}</span>` : ''}</span>
    <span class="ag-row__city">${esc(ev.place.city || '')}</span>
    <span class="ag-row__time">${esc(ev.time)}</span>
    <span class="ag-row__arrow" aria-hidden="true">${ARROW}</span>
  </button>
  <div class="ag-panel" id="ag-panel-${i}" role="region" aria-labelledby="ag-row-${i}" inert>
    <div class="ag-panel__in">
      ${ev.description ? `<p class="ag-panel__desc">${esc(ev.description)}</p>` : ''}
      ${actionsHTML(ev)}
    </div>
  </div>
</div>`;
    }).join('');

    const more = events.length > VISIBLE
      ? `<button type="button" class="ag-more" aria-expanded="${showAll}">${showAll ? 'Ocultar agenda ↑' : 'Ver agenda completa ↓'}</button>`
      : '';

    root.innerHTML = featured + (rows ? `<div class="ag-rows">${rows}</div>` : '') + more;
  }

  function render() {
    if (state === 'loading') renderLoading();
    else if (state === 'empty' || state === 'error') renderEmpty();
    else renderPopulated();
  }

  /* ---------- dados ---------- */
  async function fetchItems() {
    const params = new URLSearchParams({
      key: cfg.apiKey || '',
      singleEvents: 'true',
      orderBy: 'startTime',
      timeMin: new Date().toISOString(),
      maxResults: String(FETCH_SIZE)
    });
    const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = ctrl ? setTimeout(() => ctrl.abort(), 12000) : null;
    try {
      const res = await fetch(ENDPOINT + '?' + params.toString(), { headers: { Accept: 'application/json' }, signal: ctrl ? ctrl.signal : undefined });
      if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`HTTP ${res.status} ${body.slice(0, 300)}`);
      }
      const json = await res.json();
      return json.items || [];
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  function readCache() {
    try {
      const c = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null');
      if (c && Array.isArray(c.items) && Date.now() - c.t < CACHE_MS) return c.items;
    } catch (_) { /* sessionStorage indisponível */ }
    return null;
  }
  function writeCache(items) {
    try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), items })); } catch (_) { /* sem cache */ }
  }

  let loaded = false;
  async function load() {
    if (loaded) return;
    loaded = true;
    state = 'loading';
    render();
    try {
      let items = readCache();
      if (!items) {
        items = await fetchItems();
        writeCache(items);
      }
      events = normalize(items);
      state = events.length ? 'populated' : 'empty';
    } catch (err) {
      console.error('[Agenda] Não foi possível carregar a Google Calendar API:', err);
      state = 'error';
    }
    render();
  }

  /* ---------- interação: expandir linha (uma por vez) e agenda completa ---------- */
  function setOpen(item, open) {
    const btn = item.querySelector('.ag-row');
    const panel = item.querySelector('.ag-panel');
    item.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
    panel.inert = !open;
  }

  root.addEventListener('click', e => {
    const row = e.target.closest('.ag-row');
    if (row) {
      const item = row.closest('.ag-item');
      const open = !item.classList.contains('is-open');
      root.querySelectorAll('.ag-item.is-open').forEach(other => { if (other !== item) setOpen(other, false); });
      setOpen(item, open);
      return;
    }
    const more = e.target.closest('.ag-more');
    if (more) {
      showAll = !showAll;
      renderPopulated();
      const again = root.querySelector('.ag-more');
      if (again) again.focus();
    }
  });

  /* ---------- entrada e carregamento preguiçoso ---------- */
  if ('IntersectionObserver' in window) {
    const reveal = new IntersectionObserver(entries => {
      if (entries.some(en => en.isIntersecting)) {
        seen = true;
        section.classList.add('is-in');
        reveal.disconnect();
      }
    }, { threshold: 0.12 });
    reveal.observe(section);

    const near = new IntersectionObserver(entries => {
      if (entries.some(en => en.isIntersecting)) {
        near.disconnect();
        load();
      }
    }, { rootMargin: '400px 0px' });
    near.observe(section);
  } else {
    seen = true;
    section.classList.add('is-in');
    load();
  }
})();
