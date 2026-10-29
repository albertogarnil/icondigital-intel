/* Intel Digital — shared header, footer and interactions for every page.
   Each page sets <body data-page="..."> and includes #site-header / #site-footer placeholders. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* every page opens at the top (unless it targets an anchor): some viewers restore the
     previous scroll position, so navigating from the footer looked like nothing happened */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const toTop = () => { if (!location.hash) window.scrollTo(0, 0); };
  toTop(); addEventListener('pageshow', toTop); addEventListener('load', () => setTimeout(toTop, 0));
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
    const url = new URL(a.getAttribute('href'), location.href);
    if (url.origin !== location.origin || (url.pathname === location.pathname && url.hash)) return;
    e.preventDefault();
    document.body.classList.add('is-leaving');
    setTimeout(() => { location.href = url.href; }, reduce ? 0 : 220);
  });

  const finePointer = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const page = document.querySelector('[data-page]')?.dataset.page || 'inicio';

  const PAGES = [
    { id: 'nosotros',     href: 'nosotros.html',     label: 'Nosotros' },
    { id: 'soluciones',   href: 'soluciones.html',    label: 'Soluciones para Empresas' },
    { id: 'acompanamiento', href: 'acompanamiento.html', label: 'Acompañamiento' },
    { id: 'unete',        href: 'unete.html',        label: 'Únete al equipo' },
  ];
  const HOME = document.body.dataset.home || './';
  const ICON = {
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  };
  const bars = '<span class="bars" aria-hidden="true"><b></b><b></b><b></b><b></b></span>';
  const label = t => `<span class="btn-label"><span data-t="${t}">${t}</span></span>`;
  window.IDBtnLabel = label;

  /* ---------- header ---------- */
  const header = document.getElementById('site-header');
  if (header) {
    header.outerHTML = `
    <header class="site-nav" id="nav">
      <div class="nav-row">
        <a class="brand" href="${HOME}" aria-label="Intel Digital, volver al inicio" title="Volver al inicio"><img src="img/logo-blanco.png" alt="Intel Digital Comunicaciones" width="306" height="75"><span class="brand-tip" aria-hidden="true">Inicio</span></a>
        <ul class="nav-track" id="navTrack">
          <li class="nav-ind" id="navInd" aria-hidden="true"></li>
          ${PAGES.map(p => `<li><a href="${p.href}"${p.id === page ? ' class="is-active" aria-current="page"' : ''}>${p.label}</a></li>`).join('')}
        </ul>
        <div class="nav-side">
          <span class="nav-phone">${bars}+34 916 867 514</span>
          <a class="btn btn-primary btn-sm${page === 'contacto' ? ' is-active' : ''}" href="contacto.html"${page === 'contacto' ? ' aria-current="page"' : ''}>${label('Contacto')}<span class="arr" aria-hidden="true"></span></a>
          <button class="burger" id="burger" aria-label="Abrir menú" aria-expanded="false" aria-controls="overlay"><span></span></button>
        </div>
      </div>
      <div class="nav-progress" id="navProgress"></div>
    </header>
    <div class="overlay" id="overlay">
      <ul>
        <li><a href="${HOME}"${page === 'inicio' ? ' class="is-active"' : ''}>Inicio <small>/inicio</small></a></li>
        ${PAGES.map(p => `<li><a href="${p.href}"${p.id === page ? ' class="is-active"' : ''}>${p.label} <small>/${p.id}</small></a></li>`).join('')}
        <li><a href="contacto.html"${page === 'contacto' ? ' class="is-active"' : ''}>Contacto <small>/contacto</small></a></li>
      </ul>
      <div class="ov-foot"><span>+34 916 867 514</span><span>info@inteldigital.com</span><span>Distribuidor Oficial Orange</span></div>
    </div>`;
  }

  /* ---------- footer ---------- */
  const footer = document.getElementById('site-footer');
  if (footer) {
    footer.outerHTML = `
    <footer class="site-foot">
      ${document.querySelector('[data-no-footcta]') ? '' : `
      <div class="foot-cta"><div class="wrap">
        <h2>¿Hablamos de tu <span class="grad">conectividad</span>?</h2>
        <a class="btn btn-primary" href="consulta.html">${label('Agenda una consulta')}<span class="arr" aria-hidden="true"></span></a>
      </div></div>`}
      <div class="wrap foot-main">
        <div class="foot-brand">
          <img class="logo" src="img/logo.png" alt="Intel Digital Comunicaciones" width="306" height="75">
          <p>Telecomunicaciones y soluciones digitales para empresas y autónomos desde 1999.</p>
          <div class="orange-badge"><img src="img/orange.png" alt="Logo de Orange" width="44" height="44"><div><small>Distribuidor oficial</small><span>Orange en toda España</span></div></div>
        </div>
        <div class="foot-col">
          <h4>Navegación</h4>
          <ul>
            <li><a href="${HOME}">Inicio</a></li>
            ${PAGES.map(p => `<li><a href="${p.href}">${p.id === 'unete' ? 'Trabaja con nosotros' : p.label}</a></li>`).join('')}
            <li><a href="contacto.html">Contáctanos</a></li>
          </ul>
        </div>
        <div class="foot-col">
          <h4>Soluciones</h4>
          <ul>
            <li><a href="soluciones.html#pymes">Pymes</a></li>
            <li><a href="soluciones.html#autonomos">Autónomos</a></li>
            <li><a href="soluciones.html#gran-empresa">Gran empresa</a></li>
            <li><a href="soluciones.html#digitaliza">Digitaliza tu empresa</a></li>
            <li><a href="soluciones.html#servicios">Servicios</a></li>
          </ul>
        </div>
        <div class="foot-col">
          <h4>Contacto</h4>
          <div class="contact-line">${ICON.phone}+34 916 867 514</div>
          <div class="contact-line">${ICON.mail}info@inteldigital.com</div>
          <a class="btn btn-ghost btn-sm" href="unete.html" style="margin-top:6px">${label('Envía tu CV')}</a>
          <div class="socials">
            <a href="#" aria-label="X"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.8 3h3.1l-6.8 7.7 8 10.3h-6.2l-4.9-6.3L5.4 21H2.3l7.2-8.2L1.8 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.4 4.7H5.5z"/></svg></a>
            <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg></a>
            <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 8.5V6.8c0-.8.5-1.3 1.4-1.3H17V2.2h-2.6C11.6 2.2 10.6 4 10.6 6.4v2.1H8v3.3h2.6V22H14V11.8h2.6l.5-3.3z"/></svg></a>
            <a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.5 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM3 9h3v12H3zm6 0h2.9v1.7c.4-.8 1.5-1.9 3.3-1.9 3.5 0 4.1 2.3 4.1 5.3V21h-3v-6.2c0-1.5 0-3.3-2-3.3s-2.3 1.6-2.3 3.2V21H9z"/></svg></a>
          </div>
        </div>
      </div>
      <div class="foot-mark" aria-hidden="true">intel digital</div>
      <div class="foot-status"><div class="wrap">
        <span class="sys"><span class="live"></span>Red operativa · Cobertura nacional · Desde 1999</span>
        <span>© ${new Date().getFullYear()} Intel Digital. Todos los derechos reservados.</span>
        <nav><a href="#">Política de privacidad</a><a href="#">Términos y condiciones</a><a href="#">Ajuste de cookies</a></nav>
      </div></div>
    </footer>`;
  }

  /* button labels: wrap plain-text labels for the hover roll */
  document.querySelectorAll('.btn').forEach(b => {
    if (b.querySelector('.btn-label')) return;
    const node = [...b.childNodes].find(n => n.nodeType === 3 && n.textContent.trim());
    if (!node) return;
    const t = node.textContent.trim();
    const span = document.createElement('span');
    span.innerHTML = label(t);
    b.replaceChild(span.firstElementChild, node);
  });

  /* ---------- nav behaviour ---------- */
  const nav = document.getElementById('nav');
  const prog = document.getElementById('navProgress');
  if (document.querySelector('[data-nav-solid]')) nav.classList.add('is-solid');
  const onScroll = () => {
    nav.classList.toggle('is-scrolled', scrollY > 30);
    const max = document.documentElement.scrollHeight - innerHeight;
    prog.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const track = document.getElementById('navTrack'), ind = document.getElementById('navInd');
  const moveInd = a => {
    if (!a) { ind.style.opacity = 0; return; }
    const tr = track.getBoundingClientRect(), r = a.getBoundingClientRect();
    ind.style.width = r.width + 'px'; ind.style.transform = `translateX(${r.left - tr.left}px)`; ind.style.opacity = 1;
  };
  track.querySelectorAll('a').forEach(a => { a.addEventListener('mouseenter', () => moveInd(a)); a.addEventListener('focus', () => moveInd(a)); });
  track.addEventListener('mouseleave', () => moveInd(track.querySelector('.is-active')));
  requestAnimationFrame(() => moveInd(track.querySelector('.is-active')));
  addEventListener('resize', () => moveInd(track.querySelector('.is-active')));

  const burger = document.getElementById('burger');
  burger.addEventListener('click', () => {
    const open = document.body.classList.toggle('nav-open');
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.documentElement.style.overflow = open ? 'hidden' : '';
  });
  addEventListener('keydown', e => { if (e.key === 'Escape' && document.body.classList.contains('nav-open')) burger.click(); });

  /* ---------- particle wave (any canvas.wave) ---------- */
  document.querySelectorAll('canvas.wave').forEach(cv => {
    const ctx = cv.getContext('2d');
    const dense = cv.dataset.density === 'low' ? [80, 30] : [110, 46];
    const [COLS, ROWS] = dense;
    const hz = parseFloat(cv.dataset.horizon || '.34');
    let W, H, t = 0, mx = .5, my = .6, tmx = .5, tmy = .6, running = true;
    const size = () => { const d = Math.min(devicePixelRatio || 1, 2); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
    size(); addEventListener('resize', size);
    cv.parentElement.addEventListener('pointermove', e => { const r = cv.getBoundingClientRect(); tmx = (e.clientX - r.left) / r.width; tmy = (e.clientY - r.top) / r.height; });
    const draw = () => {
      if (!running) return;
      t += reduce ? 0 : .0045; mx += (tmx - mx) * .05; my += (tmy - my) * .05;
      ctx.clearRect(0, 0, W, H);
      const horizon = H * hz, spread = W * 1.6;
      for (let r = 0; r < ROWS; r++) {
        const zN = r / (ROWS - 1), persp = .25 + zN * zN * 1.4;
        for (let c = 0; c < COLS; c++) {
          const px = W / 2 + (c / (COLS - 1) - .5) * spread * persp;
          if (px < -10 || px > W + 10) continue;
          const dx = c / (COLS - 1) - mx, dz = zN - (1 - my * .6);
          const ripple = Math.exp(-(dx * dx * 9 + dz * dz * 6)) * Math.sin(t * 4 - Math.sqrt(dx * dx + dz * dz) * 22) * 46;
          const y = Math.sin(c * .11 + t * 1.6) * 22 + Math.sin(r * .23 - t * 1.1 + c * .04) * 30 + Math.cos(c * .05 + r * .09 + t) * 18 + ripple;
          const py = horizon + zN * H * .4 - y * persp * .9;
          const g = Math.max(0, Math.min(1, (y + 50) / 110));
          const a = Math.min(1, (.22 + zN * .85) * (.5 + g * .6));
          /* brand gradient: #e84b15 (low) -> #ffd71f (crests) */
          ctx.fillStyle = `rgba(${232 + Math.round(g * 23)},${75 + Math.round(g * 140)},${21 + Math.round(g * 10)},${a})`;
          const s = .6 + zN * 1.9; ctx.fillRect(px, py, s, s);
        }
      }
      if (!reduce) requestAnimationFrame(draw);
    };
    new IntersectionObserver(([e]) => { running = e.isIntersecting; if (running) requestAnimationFrame(draw); }).observe(cv);
  });

  /* ---------- magnetic buttons ---------- */
  if (finePointer && !reduce) document.querySelectorAll('.btn').forEach(b => {
    b.addEventListener('pointermove', e => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px,${(e.clientY - r.top - r.height / 2) * .3}px)`;
    });
    b.addEventListener('pointerleave', () => b.style.transform = '');
  });

  /* ---------- tech card spotlight ---------- */
  document.querySelectorAll('.tcard').forEach(c => c.addEventListener('pointermove', e => {
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }));

  /* ---------- collage parallax ---------- */
  document.querySelectorAll('.collage').forEach(col => {
    if (!finePointer || reduce) return;
    col.addEventListener('pointermove', e => {
      const r = col.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      col.querySelectorAll('[data-depth]').forEach(el => el.style.transform = `translate(${-x * el.dataset.depth}px,${-y * el.dataset.depth}px)`);
    });
    col.addEventListener('pointerleave', () => col.querySelectorAll('[data-depth]').forEach(el => el.style.transform = ''));
  });

  /* ---------- KPI counters + charts (HTML holds final values) ---------- */
  const fmt = n => n.toLocaleString('es-ES');
  document.querySelectorAll('[data-count]').forEach(el => el.textContent = fmt(+el.dataset.count));
  document.querySelectorAll('.kpi').forEach(k => {
    if (reduce) { k.classList.add('is-in'); return; }
    new IntersectionObserver((es, o) => es.forEach(e => {
      if (!e.isIntersecting) return; o.disconnect(); k.classList.add('is-in');
      k.querySelectorAll('[data-count]').forEach(el => {
        const end = +el.dataset.count, t0 = performance.now(), dur = 1800;
        const step = now => { const p = Math.min(1, (now - t0) / dur); el.textContent = fmt(Math.round(end * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step);
      });
    }), { threshold: .35 }).observe(k);
  });

  /* ---------- accordion ---------- */
  document.querySelectorAll('.acc').forEach(acc => acc.querySelectorAll('.acc-item').forEach(item => {
    const btn = item.querySelector('.acc-btn');
    btn.addEventListener('click', () => {
      const open = !item.classList.contains('is-open');
      acc.querySelectorAll('.acc-item').forEach(i => { i.classList.remove('is-open'); i.querySelector('.acc-btn').setAttribute('aria-expanded', false); });
      if (open) { item.classList.add('is-open'); btn.setAttribute('aria-expanded', true); }
    });
  }));

  /* ---------- timeline ---------- */
  const tlWrap = document.querySelector('.timeline');
  if (tlWrap) {
    const bar = tlWrap.querySelector('.prog'), items = [...tlWrap.querySelectorAll('.tl')];
    const upd = () => {
      const r = tlWrap.getBoundingClientRect(), mid = innerHeight * .6;
      bar.style.height = Math.max(0, Math.min(1, (mid - r.top) / (r.height - 20))) * (r.height - 26) + 'px';
      items.forEach(el => el.classList.toggle('is-on', el.getBoundingClientRect().top + 20 < mid));
    };
    addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
  }

  /* ---------- reveal (only what starts below the first screen) ---------- */
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.remove('pre'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.rv,.stagger').forEach(el => { if (el.getBoundingClientRect().top > innerHeight) { el.classList.add('pre'); io.observe(el); } });
  }

  /* ---------- segmented controls ---------- */
  document.querySelectorAll('.seg').forEach(seg => {
    const inputs = [...seg.querySelectorAll('input')], pill = seg.querySelector('.pill');
    seg.style.setProperty('--n', inputs.length);
    const upd = () => { const i = inputs.findIndex(x => x.checked); pill.style.transform = `translateX(${i * 100}%)`; seg.dispatchEvent(new CustomEvent('segchange', { detail: inputs[i].value })); };
    inputs.forEach(x => x.addEventListener('change', upd));
    const want = location.hash.slice(1);
    const match = inputs.find(x => x.value === want);
    if (match && seg.dataset.hash !== undefined) match.checked = true;
    upd();
  });

  /* ---------- forms (prototype: validate only) ---------- */
  document.querySelectorAll('form[data-form]').forEach(form => {
    const msg = form.querySelector('.form-msg');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const bad = [...form.querySelectorAll('[required]')].find(f => !f.closest('[hidden]') && (f.type === 'checkbox' ? !f.checked : !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value))));
      if (bad) { msg.className = 'form-msg err'; msg.textContent = bad.type === 'checkbox' ? 'Acepta la política de privacidad para continuar.' : 'Revisa los campos marcados con *.'; bad.focus(); return; }
      msg.className = 'form-msg ok'; msg.textContent = form.dataset.form;
    });
    form.querySelectorAll('input[type=file]').forEach(fi => fi.addEventListener('change', () => { const out = form.querySelector('[data-file-name]'); if (out) out.textContent = fi.files[0]?.name || 'PDF o Word, máx. 5 MB'; }));
  });
})();
