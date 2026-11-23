/* Transições entre seções — Ministério Nova Página (ver transitions.css)
   1. Páginas empilhadas (ligado à rolagem): cada seção "assenta" quando seu fim chega ao pé da tela
      e a próxima sobe por cima dela; a de trás recua (escala) e escurece (véu). Subindo, tudo se desfaz.
   2. Virada de página: saltos longos pelo menu e troca entre páginas cobrem a tela com uma folha dourada.
   3. Costura de luz e entrada do conteúdo ao entrar na tela. */
(() => {
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const EASE = 'cubic-bezier(0.76, 0, 0.24, 1)';
  const COVER_MS = 520, HOLD_MS = 90, REVEAL_MS = 640;
  const NEAR = 1.3;              // seções a menos de 1,3 tela: rolagem suave (sem a folha)
  const STACK_SCALE = 0.06;      // quanto a seção de trás recua (6%)
  const STACK_VEIL = 0.6;        // quanto ela escurece (véu até 60%)
  const FLAG = 'np-wipe';

  const store = {
    get() { try { return sessionStorage.getItem(FLAG); } catch (_) { return null; } },
    set() { try { sessionStorage.setItem(FLAG, '1'); } catch (_) { /* sem storage: só não há virada na chegada */ } },
    clear() { try { sessionStorage.removeItem(FLAG); } catch (_) { /* idem */ } }
  };
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* ---------- 1. páginas empilhadas ---------- */
  const stack = $$('[data-stack]');
  let tops = [];                 // posição natural (sem sticky) de cada seção da pilha
  let starts = [], spans = [];   // quando cada seção assenta (scrollY) e por quanto a próxima leva para cobri-la
  let vh = window.innerHeight;
  const naturalTop = el => {
    const i = stack.indexOf(el);
    if (i >= 0 && tops.length) return tops[i];
    const s = stack.find(x => x.contains(el));
    if (s && tops.length) {
      // posição do elemento dentro da seção + posição natural da seção
      return tops[stack.indexOf(s)] + (el.getBoundingClientRect().top - s.getBoundingClientRect().top);
    }
    return el.getBoundingClientRect().top + window.scrollY;
  };
  window.NP_naturalTop = naturalTop;

  if (stack.length > 1 && !reduce) {
    root.classList.add('np-stacking');
    // cada folha fica acima da anterior (algumas seções já tinham z-index próprio)
    stack.forEach((s, i) => { s.style.zIndex = String(i + 1); });
    const veils = stack.map(s => {
      if (s.hasAttribute('data-stack-noveil')) return null;
      const v = document.createElement('div');
      v.className = 'stack-veil'; v.setAttribute('aria-hidden', 'true');
      s.appendChild(v);
      return v;
    });
    let ticking = false;
    const measure = () => {
      vh = window.innerHeight;
      // as seções da pilha são contínuas desde o topo do documento (Hero, depois as seções do <main>):
      // posição natural = soma das alturas anteriores (o sticky não altera offsetHeight)
      let y = 0;
      tops = []; starts = []; spans = [];
      stack.forEach(s => {
        tops.push(y);
        const h = s.offsetHeight;
        const stick = Math.min(0, vh - h);      // seção alta: assenta quando o fim chega ao pé da tela
        s.style.top = stick + 'px';
        // recua a partir do centro da parte visível dela
        s.style.setProperty('--stack-origin', `${-stick + Math.min(vh, h) / 2}px`);
        starts.push(y + Math.max(0, h - vh));   // scrollY em que a seção assenta
        spans.push(Math.min(vh, h));            // distância até a próxima cobri-la por inteiro
        y += h;
      });
      update();
    };
    const update = () => {
      ticking = false;
      const sy = window.scrollY;
      for (let i = 0; i < stack.length; i++) {
        const s = stack[i];
        // 0: seção ainda livre · 1: a próxima já a cobriu por inteiro (a última nunca é coberta)
        const p = i + 1 < stack.length ? clamp((sy - starts[i]) / spans[i], 0, 1) : 0;
        if (p > 0 && p < 1) {
          s.classList.add('is-stacking');
          s.style.transform = `scale(${(1 - STACK_SCALE * p).toFixed(4)})`;
        } else {
          s.classList.remove('is-stacking');
          s.style.transform = p >= 1 ? `scale(${1 - STACK_SCALE})` : '';
        }
        if (veils[i]) veils[i].style.opacity = (STACK_VEIL * p).toFixed(3);
      }
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => requestAnimationFrame(measure));
    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(() => requestAnimationFrame(measure));
      stack.forEach(s => ro.observe(s));
    }
    window.addEventListener('load', measure);
    if (document.fonts) document.fonts.ready.then(measure);
    measure();
  }

  /* ---------- 3. costura de luz e entrada do conteúdo ---------- */
  $$('[data-seam]').forEach(s => {
    const spark = document.createElement('span');
    spark.className = 'seam-spark'; spark.setAttribute('aria-hidden', 'true');
    s.appendChild(spark);
  });
  $$('[data-reveal-children]').forEach(s => {
    Array.from(s.children).filter(c => !c.classList.contains('seam-spark') && !c.classList.contains('stack-veil')).forEach((c, i) => {
      c.setAttribute('data-rv', ''); c.style.setProperty('--rv-i', i);
    });
  });
  const watched = $$('[data-seam], [data-reveal-children]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      if (el.hasAttribute('data-seam')) el.classList.add('is-seamed');
      if (el.hasAttribute('data-reveal-children')) el.classList.add('is-revealed');
      io.unobserve(el);
    }), { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    watched.forEach(el => io.observe(el));
  } else {
    watched.forEach(el => el.classList.add('is-seamed', 'is-revealed'));
  }

  /* ---------- 2. virada de página ---------- */
  const wipe = document.createElement('div');
  wipe.className = 'page-wipe'; wipe.setAttribute('aria-hidden', 'true');
  wipe.innerHTML = '<div class="page-wipe__panel"><img class="page-wipe__mark" src="assets/logo-mark-dourada.png" alt=""></div>';
  document.body.appendChild(wipe);
  const panel = wipe.firstElementChild;
  const mark = panel.firstElementChild;
  let busy = false;

  const cover = () => new Promise(done => {
    wipe.classList.add('is-active');
    panel.animate([{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }], { duration: COVER_MS, easing: EASE, fill: 'forwards' });
    mark.animate([{ opacity: 0, transform: 'translate(-50%, -40%) scale(.92)' }, { opacity: .9, transform: 'translate(-50%, -50%) scale(1)' }],
      { duration: 380, delay: COVER_MS - 220, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'forwards' });
    setTimeout(done, COVER_MS + HOLD_MS);
  });
  const reveal = () => new Promise(done => {
    mark.animate([{ opacity: .9 }, { opacity: 0 }], { duration: 200, easing: 'ease-out', fill: 'forwards' });
    const a = panel.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-100%)' }], { duration: REVEAL_MS, easing: EASE, fill: 'forwards' });
    a.onfinish = () => {
      wipe.classList.remove('is-active');
      panel.getAnimations().forEach(x => x.cancel());
      mark.getAnimations().forEach(x => x.cancel());
      done();
    };
  });

  const focusSection = target => {
    if (!target.hasAttribute('tabindex') && !/^(A|BUTTON|INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  };
  const scrollToTarget = (target, smooth) => {
    const y = Math.max(0, naturalTop(target));
    const prev = root.style.scrollBehavior;
    if (!smooth) root.style.scrollBehavior = 'auto';
    window.scrollTo({ top: y, behavior: smooth ? 'smooth' : 'auto' });
    if (!smooth) root.style.scrollBehavior = prev;
  };

  document.addEventListener('click', e => {
    if (busy || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest('a[href]');
    if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    let url;
    try { url = new URL(a.href, location.href); } catch (_) { return; }
    if (url.origin !== location.origin) return;

    const samePage = url.pathname === location.pathname || (url.pathname.endsWith('/index.html') && /\/$/.test(location.pathname)) || (location.pathname.endsWith('/index.html') && /\/$/.test(url.pathname));
    if (samePage) {
      if (!url.hash) return;
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      if (reduce) return;                                          // âncora nativa, sem animação
      e.preventDefault();
      const distance = Math.abs(naturalTop(target) - window.scrollY);
      if (location.hash !== url.hash) history.pushState(null, '', url.hash);
      if (distance < window.innerHeight * NEAR) {                  // perto: rolagem suave (a pilha anima junto)
        scrollToTarget(target, true);
        focusSection(target);
        return;
      }
      busy = true;
      cover().then(() => { scrollToTarget(target, false); focusSection(target); return reveal(); }).then(() => { busy = false; });
      return;
    }
    if (reduce) return;
    if (!/\.html?$/.test(url.pathname) && !/\/$/.test(url.pathname)) return;   // só páginas do site
    e.preventDefault();
    busy = true;
    store.set();
    cover().then(() => { window.location.href = url.href; });
  });

  /* chegada por link com âncora (ex.: index.html#discografia): corrige para a posição natural da seção.
     Repete quando imagens e fontes terminam de carregar, a menos que o visitante já tenha rolado. */
  let userMoved = false;
  ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(ev => window.addEventListener(ev, () => { userMoved = true; }, { passive: true, once: true }));
  const fixHash = () => {
    if (userMoved || !location.hash || !root.classList.contains('np-stacking')) return;
    const t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (t) scrollToTarget(t, false);
  };

  /* chegada vinda de uma virada em outra página: começa coberta e revela */
  if (store.get()) {
    store.clear();
    if (!reduce) {
      wipe.classList.add('is-active');
      panel.animate([{ transform: 'translateY(0)' }], { duration: 0, fill: 'forwards' });
      mark.animate([{ opacity: .9 }], { duration: 0, fill: 'forwards' });
      root.classList.remove('np-wipe-in');
      setTimeout(() => { fixHash(); reveal(); }, 160);
    }
  } else {
    setTimeout(fixHash, 60);
  }
  window.addEventListener('load', () => setTimeout(fixHash, 30));
  if (document.fonts) document.fonts.ready.then(() => setTimeout(fixHash, 30));
  root.classList.remove('np-wipe-in');

  /* voltar pelo histórico do navegador: garante a página descoberta */
  window.addEventListener('pageshow', e => {
    if (!e.persisted) return;
    busy = false;
    wipe.classList.remove('is-active');
    panel.getAnimations().forEach(x => x.cancel());
    mark.getAnimations().forEach(x => x.cancel());
  });
})();
