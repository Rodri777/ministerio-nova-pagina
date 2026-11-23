/* Agendamentos — chips por tipo de evento, botão do WhatsApp com mensagem pronta e revelação ao rolar.
   Dados em data/agendamento.js (window.NP_AGENDA). */
(() => {
  const cfg = window.NP_AGENDA;
  const root = document.getElementById('agendamentos');
  if (!cfg || !root || !Array.isArray(cfg.tipos) || !cfg.tipos.length) return;

  const $ = s => root.querySelector(s);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDev = location.protocol === 'file:' || ['localhost', '127.0.0.1', '::1', ''].includes(location.hostname);
  const isPh = v => !v || /\[.*\]/.test(String(v));
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* WhatsApp: só dígitos, 10 a 15 posições, e sem placeholder */
  const digits = String(cfg.whatsapp || '').replace(/\D/g, '');
  const waOK = !isPh(cfg.whatsapp) && /^\d{10,15}$/.test(digits);
  if (!waOK && isDev) console.warn('Agendamento: número do WhatsApp não configurado em data/agendamento.js');

  const tipos = cfg.tipos;
  const chipsEl = $('#ag-chips'), subject = $('#ag-subject'), cta = $('#ag-cta');
  const statsEl = $('#ag-stats'), respEl = $('#ag-response'), mailEl = $('#ag-mail');
  let current = Math.max(0, tipos.findIndex(t => t.id === cfg.padrao));
  let subjectTimer = null;

  /* chips */
  chipsEl.innerHTML = tipos.map((t, i) =>
    `<button type="button" class="ag-chip" role="radio" aria-checked="false" tabindex="-1" data-i="${i}">${esc(t.rotulo)}</button>`).join('');
  const chips = Array.from(chipsEl.querySelectorAll('.ag-chip'));

  const setSubject = text => {
    if (subject.textContent === text) return;
    clearTimeout(subjectTimer);
    if (reduce) { subject.textContent = text; return; }
    subject.classList.add('is-out');
    subjectTimer = setTimeout(() => { subject.textContent = text; subject.classList.remove('is-out'); }, 200);
  };

  const updateCta = () => {
    const t = tipos[current];
    if (waOK) {
      cta.href = `https://wa.me/${digits}?text=${encodeURIComponent(t.mensagem)}`;
      cta.removeAttribute('aria-disabled');
      cta.classList.remove('is-disabled');
    } else {
      cta.href = '#';
      cta.setAttribute('aria-disabled', 'true');
      cta.classList.add('is-disabled');
    }
  };

  const select = (i, { focus = false } = {}) => {
    current = i;
    chips.forEach((c, k) => {
      const on = k === i;
      c.setAttribute('aria-checked', String(on));
      c.tabIndex = on ? 0 : -1;
      c.classList.toggle('is-on', on);
    });
    if (focus) chips[i].focus();
    setSubject(tipos[i].sujeitoTitulo);
    updateCta();
  };

  chipsEl.addEventListener('click', e => {
    const c = e.target.closest('.ag-chip');
    if (c) select(+c.dataset.i);
  });
  chipsEl.addEventListener('keydown', e => {
    const n = tipos.length;
    const move = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (move === undefined && e.key !== 'Home' && e.key !== 'End') return;
    e.preventDefault();
    let next = e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : (current + move + n) % n;
    select(next, { focus: true });
  });

  /* botão principal */
  cta.addEventListener('click', e => { if (!waOK) e.preventDefault(); });

  /* faixa de números: oculta se houver qualquer placeholder */
  const stats = Array.isArray(cfg.estatisticas) ? cfg.estatisticas : [];
  if (stats.length && !stats.some(s => isPh(s.valor) || isPh(s.rotulo))) {
    statsEl.innerHTML = stats.map(s => `<div class="ag-stat"><b>${esc(s.valor)}</b><span>${esc(s.rotulo)}</span></div>`).join('');
    statsEl.hidden = false;
  } else {
    statsEl.hidden = true;
  }

  /* linhas de apoio */
  if (!isPh(cfg.tempoResposta)) { respEl.textContent = `Respondemos em até ${cfg.tempoResposta}.`; respEl.hidden = false; }
  else respEl.hidden = true;
  if (cfg.email) { mailEl.href = `mailto:${cfg.email}`; mailEl.textContent = cfg.email; }

  /* estado inicial */
  select(current);

  /* revelação ao rolar, uma vez, em sequência */
  const items = Array.from(root.querySelectorAll('[data-ag]'));
  items.forEach((el, i) => el.style.setProperty('--i', i));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(([en]) => {
      if (en.isIntersecting) { root.classList.add('is-in'); io.disconnect(); }
    }, { threshold: 0.15 });
    io.observe(root);
  } else {
    root.classList.add('is-in');
  }
})();
