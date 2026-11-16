/* Learning Data: the example project's page (dbt-project/). Makes its three parts interactive: a live map of the four folders,
   where one question is followed in eleven steps and lenses show what attaches where; what dbt alone can't answer; and the open
   standards, line by line. Without this script every part reads in order, as site-tools/build_series.py writes it; with it, each
   part gets .is-live. */
(() => {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s), $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmt = (t, o) => t.replace(/\{(\w+)\}/g, (_, k) => o[k]);

  // Links to panels become tabs: one panel shows at a time; the arrows, Home and End move between them. A link to anything in a
  // panel (#px-s4, #px-d2-L19) opens that panel first.
  function tabs(list, onShow) {
    const links = $$(':scope > li > a', list), panels = links.map(a => document.getElementById(a.hash.slice(1)));
    list.setAttribute('role', 'tablist');
    links.forEach((a, i) => {
      a.parentElement.setAttribute('role', 'presentation');
      a.setAttribute('role', 'tab'); a.setAttribute('aria-controls', panels[i].id);
      panels[i].setAttribute('role', 'tabpanel');
    });
    const T = { links, panels, n: links.length, cur: -1 };
    T.show = (i, how) => {
      i = Math.max(0, Math.min(T.n - 1, i));
      const from = T.cur; T.cur = i;
      links.forEach((a, j) => {
        a.setAttribute('aria-selected', j === i ? 'true' : 'false'); a.tabIndex = j === i ? 0 : -1;
        a.parentElement.classList.toggle('is-on', j === i); a.parentElement.classList.toggle('is-done', j < i);
        panels[j].hidden = j !== i;
      });
      if (how !== 'init') panels[i].classList.add('is-enter');  // a panel the visitor opens eases in
      if (how === 'key') links[i].focus();
      if (onShow) onShow(i, from, how);
    };
    T.start = () => {
      const at = location.hash.length > 1 && document.getElementById(decodeURIComponent(location.hash.slice(1)));
      const i = at ? panels.findIndex(p => p.contains(at)) : -1;
      return i < 0 ? 0 : i;
    };
    list.addEventListener('click', e => {
      const a = e.target.closest('[role=tab]');
      if (!a) return;
      e.preventDefault(); T.show(links.indexOf(a), 'click');
    });
    list.addEventListener('keydown', e => {
      const m = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      const j = m !== undefined ? T.cur + m : e.key === 'Home' ? 0 : e.key === 'End' ? T.n - 1 : null;
      if (j === null) return;
      e.preventDefault(); T.show((j + T.n) % T.n, 'key');
    });
    return T;
  }

  // 1. The map. Two layers move together as a camera over the map: the folders and their lines behind, the pieces in front, and
  // between them a canvas where light is data: rows along the dbt project's line, context down from governance, the answer back
  // to the question. The play bar follows the question in eleven steps; a piece opens its panel; a lens shows what attaches where.
  function map(app) {
    const vp = $('.px-vp', app), back = $('.px-back', app), front = $('.px-front', app), cv = $('.px-dots', app);
    const bar = $('.px-bar', app), foot = $('.px-foot', app), insp = $('.px-insp', app), hint = $('.px-hint', app);
    const play = $('.px-play', foot), label = $('.px-pl', play), timer = $('.px-timer i', play);
    const prev = $('.px-prev', foot), next = $('.px-next', foot), range = $('input[type=range]', foot), count = $('.px-count', foot);
    const ticks = $$('.px-ticks li', foot), fill = $('.px-fill', foot);
    const lensBtns = $$('.px-lens', bar), lensP = $$('.px-lensp', bar), merge = $('.px-merge', bar), side = $('.px-side', bar);
    const N = +app.dataset.n, nodes = $$('.px-nd', front), shields = $$('.px-shd', front);
    const byId = {}; nodes.forEach(n => { byId[n.dataset.id] = n; });
    const arts = {}; $$('.px-art', insp).forEach(a => { arts[a.id.slice(3)] = a; });
    const groups = $$('.px-eg', back), ctx = cv.getContext && cv.getContext('2d');
    const pin = document.createElement('canvas'); pin.className = 'px-pin'; pin.setAttribute('aria-hidden', 'true'); vp.insertBefore(pin, hint);
    const pctx = pin.getContext && pin.getContext('2d');  // above the pieces: the learner's label
    const num = k => parseFloat(app.style.getPropertyValue(k));  // the map's sizes, from its own style: no style is worked out to read them
    const WORLD = { wide: [num('--WW'), num('--WH')], tall: [num('--TW'), num('--TH')] };
    const stepOf = {}; for (let i = 1; i <= N; i++) stepOf[arts['s' + i].dataset.node] = i;
    const LINE = ['sources', 'staging', 'intermediate', 'core', 'marts', 'gate', 'metrics', 'exposures'];  // along the rows' line
    const WAIT = 6500, reduce = still();
    let tall = false, wide = false, open = true, W = 0, H = 0, dpr = 1;
    let step = 0, sel = 'i0', lens = '', hlId = null;
    let cam = { s: 1, x: 0, y: 0 }, anim = null, edges = [], pulses = [], drag = null;
    let playing = false, held = false, t0 = 0, last = 0, raf = 0, looping = false, seen = false;
    const broken = new Set();

    app.classList.add('is-live'); bar.hidden = false; foot.hidden = false;
    $$('.px-hbtn, .px-go', app).forEach(b => { b.hidden = false; });
    $$('.px-tog', app).forEach(b => { b.hidden = false; });
    const pathBtns = $$('.px-pth', insp), pathPs = $$('.px-pthp', insp);
    let path = 'new';  // where the build starts: from nothing, or on models already built

    // ---- where things are
    const rect = el => (tall ? el.dataset.t : el.dataset.r).split(' ').map(Number);
    function mode(w) {  // a phone's tall map; the panel beside the map from 1100 px, below it under that
      tall = w < 640; wide = w >= 1100;
      app.classList.toggle('is-tall', tall); app.classList.toggle('is-side', wide); app.classList.toggle('is-mid', !wide && w >= 760);
    }
    function layout() {
      const was = tall; mode(app.clientWidth);
      W = vp.clientWidth; H = vp.clientHeight; dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = pin.width = Math.round(W * dpr); cv.height = pin.height = Math.round(H * dpr);
      if (was !== tall || !edges.length) sample();
    }
    // each line of the layout shown, as points every few units, for the light to travel along
    function sample() {
      const svg = $(tall ? '.px-edges.px-tall' : '.px-edges.px-wide', back);
      edges = $$('.px-eg', svg).map((g, gi) => {
        const p = $('.px-tr', g), L = p.getTotalLength(), n = Math.max(2, Math.ceil(L / 4)), pts = new Float32Array(2 * n + 2);
        for (let i = 0; i <= n; i++) { const q = p.getPointAtLength(L * i / n); pts[2 * i] = q.x; pts[2 * i + 1] = q.y; }
        const lane = (g.getAttribute('class').match(/px-(in|ea|dg|dp|ok)/) || [])[1], pipe = g.dataset.e === 'pipe';
        const k = pipe ? { n: Math.round(L / 24), v: 64, r: 2.3 } : lane === 'ok' ? { n: Math.max(5, Math.round(L / 55)), v: 125, r: 2.6 }
          : { n: Math.max(2, Math.round(L / 44)), v: 44, r: 2.1 };
        return { id: g.dataset.e, a: g.dataset.a, b: g.dataset.b, step: g.dataset.step === '' ? null : +g.dataset.step, h: +g.dataset.h,
                 lane, pipe, pts, n, L, seed: gi * 7.31, k, lit: true, broken: false, dim: false };
      });
    }

    // ---- the camera: screen = world × s + (x, y)
    function apply() {
      const tr = `translate(${cam.x.toFixed(2)}px,${cam.y.toFixed(2)}px) scale(${cam.s.toFixed(4)})`;
      back.style.transform = tr; front.style.transform = tr;
      vp.style.setProperty('--gs', cam.s.toFixed(4)); vp.style.setProperty('--gx', cam.x.toFixed(1) + 'px'); vp.style.setProperty('--gy', cam.y.toFixed(1) + 'px');
      if (reduce || !looping) draw(performance.now());
    }
    const size = () => (tall ? WORLD.tall : WORLD.wide);
    function fit(b, most, pad = tall ? 14 : 36) {  // a box of the map [x0, y0, x1, y1], as large as fits, up to a scale
      const s = Math.min(most, (W - 2 * pad) / Math.max(1, b[2] - b[0]), (H - 2 * pad) / Math.max(1, b[3] - b[1]));
      return { s, x: (W - (b[2] - b[0]) * s) / 2 - b[0] * s, y: (H - (b[3] - b[1]) * s) / 2 - b[1] * s };
    }
    function box(ids) {
      if (ids === '*') return [0, 0, ...size()];
      let b = [1e9, 1e9, -1e9, -1e9];
      ids.split(' ').forEach(id => {
        const el = byId[id]; if (!el) return;
        const [x, y, w, h] = rect(el);
        b = [Math.min(b[0], x), Math.min(b[1], y), Math.max(b[2], x + w), Math.max(b[3], y + h)];
      });
      return b;
    }
    function home() {  // the whole map; on a phone, the map's width from its top
      if (!tall) return fit(box('*'), 1.15, 20);
      const s = Math.min(1.1, (W - 12) / size()[0]);
      return { s, x: (W - size()[0] * s) / 2, y: 6 };
    }
    const lowest = () => Math.min(home().s, fit(box('*'), 9).s) * 0.85;
    function keep(c) {  // never lose the map off the window
      const [ww, wh] = size(), m = 90;
      c.x = Math.min(W - m, Math.max(m - ww * c.s, c.x)); c.y = Math.min(H - m, Math.max(m - wh * c.s, c.y));
      return c;
    }
    function aim(spec, how) {
      const to = spec === 'home' ? home() : fit(box(spec), spec === '*' ? 1.15 : tall ? 1.25 : 1.4);
      glide(to, how);
    }
    function glide(to, how) {
      if (reduce || how === 'init' || !W) { cam = to; anim = null; apply(); return; }
      anim = { from: { ...cam }, to, t0: performance.now(), d: 1000 };
      wake();
    }
    const centre = c => [(W / 2 - c.x) / c.s, (H / 2 - c.y) / c.s];
    function moveCam(now) {  // the centre moves and the scale grows evenly, with a little lift on a long way
      if (!anim) return;
      const k = Math.min(1, (now - anim.t0) / anim.d), e = (1 - Math.cos(Math.PI * k)) / 2;
      const a = centre(anim.from), b = centre(anim.to);
      const far = Math.hypot(b[0] - a[0], b[1] - a[1]) * Math.min(anim.from.s, anim.to.s) / Math.max(W, H);
      const s = anim.from.s * Math.pow(anim.to.s / anim.from.s, e) * (1 - Math.min(0.22, far * 0.28) * Math.sin(Math.PI * e));
      const cx = a[0] + (b[0] - a[0]) * e, cy = a[1] + (b[1] - a[1]) * e;
      cam = { s, x: W / 2 - cx * s, y: H / 2 - cy * s };
      if (k >= 1) { cam = { ...anim.to }; anim = null; }
      apply();
    }
    function zoom(f, px = W / 2, py = H / 2, how) {
      const s = Math.max(lowest(), Math.min(3, cam.s * f)), wx = (px - cam.x) / cam.s, wy = (py - cam.y) / cam.s;
      const to = keep({ s, x: px - wx * s, y: py - wy * s });
      if (how === 'now') { anim = null; cam = to; apply(); } else glide(to);
    }
    function reveal(el) {  // a piece reached by the keyboard comes into view, large enough to read
      const r = el.classList.contains('px-shd') ? [+el.style.getPropertyValue(tall ? '--X' : '--x') - 15, +el.style.getPropertyValue(tall ? '--Y' : '--y') - 15, 30, 30] : rect(el);
      const c = anim ? anim.to : cam;  // where the camera will be: it may be on its way somewhere else
      const s = Math.max(c.s, tall ? 0.8 : 0.7), m = 24;
      // each way moves only as far as it must: a piece already in view one way stays put that way, and one too big for the window is centred
      const along = (p, len, size, cur) => {
        const a = p * s + cur, z = (p + len) * s + cur;
        if (len * s > size - 2 * m) return size / 2 - (p + len / 2) * s;
        return a < m ? cur + m - a : z > size - m ? cur - (z - size + m) : cur;
      };
      const to = keep({ s, x: along(r[0], r[2], W, W / 2 - (W / 2 - c.x) / c.s * s), y: along(r[1], r[3], H, H / 2 - (H / 2 - c.y) / c.s * s) });
      if (to.s !== c.s || Math.abs(to.x - c.x) > 0.5 || Math.abs(to.y - c.y) > 0.5) glide(to);
      // and the page: on a phone the map can reach below the window, so where the piece lands once the camera is there stays in it,
      // under the header (a frame later, after any scroll of the browser's own for the focus)
      requestAnimationFrame(() => {
        const v = vp.getBoundingClientRect(), hb = (document.querySelector('header.top') || { getBoundingClientRect: () => ({ bottom: 0 }) }).getBoundingClientRect().bottom;
        const y0 = v.top + r[1] * to.s + to.y, y1 = v.top + (r[1] + r[3]) * to.s + to.y, lo = hb + 8, hi = innerHeight - 8;
        if (y1 > hi || y0 < lo) window.scrollBy({ top: y1 > hi && y0 - (y1 - hi) >= lo ? y1 - hi : y0 - lo, behavior: reduce ? 'auto' : 'smooth' });
      });
    }

    // ---- the light
    const RGB = { in: '255,148,173', ea: '255,200,96', dg: '185,162,255', dp: '126,182,255', ok: '95,224,160', bad: '255,138,126' };
    const SPR = {};
    function sprite(c) {
      if (SPR[c]) return SPR[c];
      const s = document.createElement('canvas'); s.width = s.height = 32;
      const x = s.getContext('2d'), g = x.createRadialGradient(16, 16, 0, 16, 16, 16);
      g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.22, `rgba(${c},1)`); g.addColorStop(0.5, `rgba(${c},.35)`); g.addColorStop(1, `rgba(${c},0)`);
      x.fillStyle = g; x.fillRect(0, 0, 32, 32);
      return (SPR[c] = s);
    }
    const rnd = i => { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); };
    function at(e, t) {  // a point a share t along an edge
      const f = Math.max(0, Math.min(1, t)) * e.n, i = Math.min(e.n - 1, Math.floor(f)), u = f - i, p = e.pts;
      return [p[2 * i] + (p[2 * i + 2] - p[2 * i]) * u, p[2 * i + 1] + (p[2 * i + 3] - p[2 * i + 1]) * u];
    }
    function dot(c, wx, wy, r, a) {
      const x = wx * cam.s + cam.x, y = wy * cam.s + cam.y;
      if (x < -20 || y < -20 || x > W + 20 || y > H + 20) return;
      const z = r * Math.max(0.7, Math.min(1.6, cam.s)) * 5.4;
      ctx.globalAlpha = a; ctx.drawImage(sprite(c), x - z / 2, y - z / 2, z, z);
    }
    function draw(now) {
      if (!ctx || !W) return;
      const time = reduce ? 0 : now / 1000;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H); ctx.globalCompositeOperation = 'lighter';
      if (pctx) { pctx.setTransform(dpr, 0, 0, dpr, 0, 0); pctx.clearRect(0, 0, W, H); }
      for (const e of edges) {
        if (!e.lit) continue;
        const { n, v, r } = e.k, dim = e.dim ? 0.22 : 1;
        for (let j = 0; j < n; j++) {
          let t = (j / n + rnd(e.seed + j) * 0.6 / n + time * v / e.L) % 1, c = RGB[e.lane], a = dim;
          if (e.broken) { t *= 0.5; c = RGB.bad; a *= 1 - Math.pow(t / 0.5, 3); }  // stopped at the shield
          const [x, y] = at(e, t);
          let ox = 0, oy = 0;
          if (e.pipe) {  // a stream, not a string: each row a little off the line; context rides along from staging on
            const off = (rnd(e.seed + j * 3.7) - 0.5) * 7;
            if (tall) ox = off; else oy = off;
            if (j % 4 === 1) { c = RGB.dg; a *= Math.max(0, Math.min(1, (t - 1 / 6) * 14)); }
          }
          a *= Math.min(1, t * 12, (1 - t) * 12);
          if (a > 0.02) dot(c, x + ox, y + oy, r, a);
        }
      }
      for (const p of pulses) {  // a bright comet along a line that just lit
        const k = (now - p.t0) / p.d; if (k < 0 || k > 1) continue;
        const e = edges.find(x => x.id === p.id); if (!e) continue;
        const ee = (1 - Math.cos(Math.PI * k)) / 2;
        for (let i = 0; i < 6; i++) { const [x, y] = at(e, ee - i * 0.018); dot(RGB[e.lane], x, y, 5.2 - i * 0.7, (1 - i / 6) * (k < 0.92 ? 1 : (1 - k) / 0.08)); }
      }
      if (lens === 'learner' && !reduce) {  // the learner followed: a ring that walks the line, stopping at each layer
        const e = edges.find(x => x.pipe);
        if (e) {
          const T = 1.3, M = 0.9, per = T + M, loop = 7 * T + 6 * M, u = time % loop, i = Math.min(6, Math.floor(u / per)), w = u - i * per;
          const t = (i + (w > T && i < 6 ? (1 - Math.cos(Math.PI * (w - T) / M)) / 2 : 0)) / 6;
          const [wx, wy] = at(e, t), x = wx * cam.s + cam.x, y = wy * cam.s + cam.y;
          dot('255,255,255', wx, wy, 6, 1);
          ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
          ctx.lineWidth = 2; ctx.strokeStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, 9, 0, 7); ctx.stroke();
          here(w <= T ? STOPS[i] : null);
          if (pctx) {  // the label rides above the layers, so a layer never hides it
            const k = Math.max(0.85, Math.min(1.3, cam.s)), top = y - (tall ? 40 : 47) * cam.s - 9 * k;
            pctx.font = '800 ' + Math.round(12 * k) + 'px Manrope, system-ui, sans-serif';
            const bw = pctx.measureText(ME).width + 16 * k, bh = 22 * k, lx = x - bw / 2, ly = top - bh;
            pctx.fillStyle = '#ffffff'; pctx.beginPath();
            if (pctx.roundRect) pctx.roundRect(lx, ly, bw, bh, bh / 2); else pctx.rect(lx, ly, bw, bh);
            pctx.moveTo(x - 5 * k, ly + bh - 1); pctx.lineTo(x, ly + bh + 6 * k); pctx.lineTo(x + 5 * k, ly + bh - 1); pctx.fill();
            pctx.fillStyle = '#0a1222'; pctx.fillText(ME, lx + 8 * k, ly + 15.5 * k);
          }
        }
      }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    }
    const ME = 'S-20417', STOPS = ['sources', 'staging', 'intermediate', 'core', 'marts', 'metrics', 'exposures'];
    let at1 = null;
    function here(id) {  // the layer the learner has stopped at
      if (id === at1) return;
      if (at1 && byId[at1]) byId[at1].classList.remove('is-here');
      at1 = id; if (id && byId[id]) byId[id].classList.add('is-here');
    }
    function loop(now) {
      if (!looping) return;
      moveCam(now);
      if (playing) tick(now);
      if (!reduce) draw(now);
      pulses = pulses.filter(p => now - p.t0 < p.d);
      raf = requestAnimationFrame(loop);
    }
    function wake() { if (looping || !seen) return; looping = true; raf = requestAnimationFrame(loop); }
    function sleep() { looping = false; cancelAnimationFrame(raf); if (anim) { cam = { ...anim.to }; anim = null; apply(); } }

    // ---- what is lit, picked, faded
    function paint() {
      const S = step, isLit = st => S === 0 || (st !== null && st <= S);
      groups.forEach(g => {
        const st = g.dataset.step === '' ? null : +g.dataset.step;
        g.classList.toggle('is-lit', isLit(st)); g.classList.toggle('is-broken', broken.has(+g.dataset.h));
      });
      const touched = new Set();
      edges.forEach(e => {
        e.lit = isLit(e.step); e.broken = broken.has(e.h);
        if (e.lit) { touched.add(e.a); touched.add(e.b); if (e.pipe) LINE.forEach(k => touched.add(k)); }
      });
      const t = sel[0], i = +sel.slice(1), on = t === 's' ? arts[sel].dataset.node : t === 'l' ? arts[sel].dataset.node : null;
      nodes.forEach(n => {
        const id = n.dataset.id, st = stepOf[id];
        const lit = S === 0 || (st && st <= S) || touched.has(id);
        n.classList.toggle('is-wait', !lit);
        n.classList.toggle('is-on', id === on);
        n.classList.toggle('is-off', !!lens && lens !== 'checks' && !n.querySelector(`.px-bdg[data-lens="${lens}"]`));
      });
      shields.forEach(s => s.classList.toggle('is-on', t === 'h' && +s.dataset.id.slice(1) === i));
      app.classList.toggle('is-asking', S > 0 && S < N);
      app.classList.toggle('is-answered', S === N);
      if (reduce || !looping) draw(performance.now());
    }
    function setStep(i, how) {
      const from = step; step = i;
      range.value = String(i); fill.style.setProperty('--p', i / N);
      ticks.forEach((li, j) => { li.classList.toggle('is-past', j <= i); li.classList.toggle('is-now', j === i); });
      prev.disabled = i === 0; next.disabled = i === N;
      if (how !== 'init' && i === from + 1 && !reduce) {  // one step on: its lines light with a comet, and land on what they reach
        const now = performance.now();
        edges.filter(e => e.step === i).forEach(e => {
          pulses.push({ id: e.id, t0: now + 150, d: 1100 });
          const to = byId[e.b];
          if (to) { to.classList.remove('is-land'); setTimeout(() => { void to.offsetWidth; to.classList.add('is-land'); }, 1150); }
        });
      }
      setPlay();
    }
    function say(a) {
      const of = $('.px-of', a), h = $('h3', a);
      const text = a.id === 'px-i0' ? count.dataset.map : (of ? of.textContent + ': ' : '') + h.textContent;
      count.textContent = text; range.setAttribute('aria-valuetext', step ? fmt(count.dataset.of, { n: step, of: N }) + ': ' + $('h3', arts['s' + step]).textContent : count.dataset.map);
    }
    // show one panel, and move the map to it: a step sets the story there; a layer or a handoff shows the whole map lit
    function show(id, how) {
      const a = arts[id]; if (!a) return;
      const from = sel; sel = id;
      Object.keys(arts).forEach(k => { arts[k].hidden = k !== id; });
      if (how !== 'init' && from !== id) { a.classList.remove('is-enter'); void a.offsetWidth; a.classList.add('is-enter'); }
      if (wide) insp.scrollTop = 0;
      const t = id[0];
      if (t === 's') setStep(+id.slice(1), how); else if (t === 'i' || step !== 0) setStep(0, how);
      if (how !== 'play') stop();
      app.classList.toggle('is-exists', path === 'exists' && !!$('.px-pth', a));
      paint(); say(a);
      aim(id === 'i0' ? 'home' : a.dataset.frame || '*', how);
    }

    function setPath(p) {
      path = p;
      pathBtns.forEach(b => b.setAttribute('aria-pressed', b.dataset.path === p ? 'true' : 'false'));
      pathPs.forEach(x => { x.hidden = x.dataset.path !== p; });
      app.classList.toggle('is-exists', p === 'exists' && !!$('.px-pth', arts[sel]));
    }
    pathBtns.forEach(b => { b.hidden = false; b.addEventListener('click', () => { stop(); setPath(b.dataset.path); }); });
    setPath('new');

    // ---- playing
    function setPlay() {
      label.textContent = playing ? play.dataset.pause : step === N ? play.dataset.again : play.dataset.play;
      play.classList.toggle('is-playing', playing);
    }
    function tick(now) {
      if (held) t0 += now - last;
      last = now;
      const k = (now - t0) / WAIT;
      timer.style.transform = `scaleX(${Math.min(1, k)})`;
      if (k >= 1) {
        if (step >= N) { stop(); return; }
        show('s' + (step + 1), 'play'); t0 = now;
      }
    }
    function into() {  // the map in full view before it plays
      const r = vp.getBoundingClientRect(), top = (document.querySelector('header.top') || { getBoundingClientRect: () => ({ bottom: 0 }) }).getBoundingClientRect().bottom;
      if (r.top < top || r.bottom > innerHeight) {
        const a = app.getBoundingClientRect();
        window.scrollBy({ top: a.top - top - 10, behavior: reduce ? 'auto' : 'smooth' });
      }
    }
    function start() {
      into();
      if (step === 0 || step >= N) show('s1', 'play');
      playing = true; t0 = last = performance.now(); setPlay(); wake();
    }
    function stop() {
      if (!playing) return;
      playing = false; timer.style.transform = 'scaleX(0)'; setPlay();
    }

    // ---- lenses, and the checks
    function setLens(k) {
      lens = lens === k ? '' : k;
      if (lens !== 'learner') here(null);
      app.dataset.lens = lens;
      lensBtns.forEach(b => b.setAttribute('aria-pressed', b.dataset.lens === lens ? 'true' : 'false'));
      lensP.forEach(p => { p.hidden = p.dataset.lens !== lens; });
      shields.forEach(s => { s.hidden = lens !== 'checks'; });
      merge.hidden = lens !== 'checks';
      if (lens !== 'checks' && broken.size) { broken.clear(); held1(); }
      stop();
      if (lens && step !== 0) setStep(0, 'lens');
      paint();
      if (lens) aim(lens === 'learner' ? 'sources exposures dash' : tall ? 'home' : '*');
      requestAnimationFrame(layout);  // the caption under the toolbar changes the window's height
    }
    function held1() {
      shields.forEach(s => s.setAttribute('aria-pressed', broken.has(+s.dataset.id.slice(1)) ? 'true' : 'false'));
      $$('.px-ho', insp).forEach(a => {
        const bad = broken.has(+a.dataset.h), b = $('.px-hbtn', a);
        a.classList.toggle('is-broken', bad); b.textContent = bad ? b.dataset.back : b.dataset.go;
      });
      const n = shields.length, k = n - broken.size;
      app.classList.toggle('is-blocked', broken.size > 0);
      $('.px-mt', merge).textContent = broken.size ? merge.dataset.mbad : merge.dataset.mok;
      $('small', merge).textContent = broken.size ? fmt(merge.dataset.bad, { k, n }) : fmt(merge.dataset.ok, { n });
      paint();
    }
    function breakOne(h) { if (broken.has(h)) broken.delete(h); else broken.add(h); held1(); }

    // ---- a piece under the pointer shows what it joins
    function hl(id) {
      if (hlId === id) return;
      hlId = id; app.classList.toggle('is-hl', !!id);
      const near = new Set(id ? [id] : []), li = LINE.indexOf(id);
      if (li >= 0) { near.add(LINE[li - 1]); near.add(LINE[li + 1]); }
      groups.forEach(g => {
        const on = !!id && (g.dataset.a === id || g.dataset.b === id || (g.dataset.e === 'pipe' && li >= 0));
        g.classList.toggle('is-near', on); if (on) { near.add(g.dataset.a); near.add(g.dataset.b); }
      });
      nodes.forEach(n => n.classList.toggle('is-near', near.has(n.dataset.id)));
      edges.forEach(e => { e.dim = !!id && !(e.a === id || e.b === id || (e.pipe && li >= 0)); });
      if (reduce || !looping) draw(performance.now());
    }

    // ---- the keyboard walks the pieces with the arrows, one stop in the tab order
    const order = () => nodes.concat(shields.filter(s => !s.hidden));
    function rove(el) { order().forEach(n => { n.tabIndex = n === el ? 0 : -1; }); }
    front.addEventListener('keydown', e => {
      const list = order(), i = list.indexOf(document.activeElement);
      const m = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      const j = m !== undefined ? (i + m + list.length) % list.length : e.key === 'Home' ? 0 : e.key === 'End' ? list.length - 1 : null;
      if (j === null || i < 0) return;
      e.preventDefault(); rove(list[j]); list[j].focus({ preventScroll: true }); reveal(list[j]);
    });
    front.addEventListener('focusin', e => { const el = e.target.closest('.px-nd, .px-shd'); if (el) { rove(el); reveal(el); } });
    vp.addEventListener('scroll', () => { if (vp.scrollLeft || vp.scrollTop) { vp.scrollLeft = 0; vp.scrollTop = 0; } });  // focus never scrolls the window
    vp.addEventListener('keydown', e => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === '+' || e.key === '=') { e.preventDefault(); zoom(1.3); } else if (e.key === '-' || e.key === '_') { e.preventDefault(); zoom(1 / 1.3); }
      else if (e.key === '0') { e.preventDefault(); aim('home'); }
    });

    // ---- the pointer: pick, hover, drag to move, Ctrl or ⌘ and the wheel to zoom
    front.addEventListener('click', e => {
      if (drag && drag.moved) return;
      const s = e.target.closest('.px-shd');
      if (s) { const h = +s.dataset.id.slice(1); breakOne(h); show('h' + h, 'click'); return; }
      const n = e.target.closest('.px-nd'); if (n) show(n.dataset.go, 'click');
    });
    front.addEventListener('pointerover', e => { const n = e.target.closest('.px-nd'); if (n && e.pointerType !== 'touch') hl(n.dataset.id); });
    front.addEventListener('pointerout', e => { const n = e.target.closest('.px-nd'); if (n && !n.contains(e.relatedTarget)) hl(null); });
    const quiet = () => { if (hint) hint.classList.add('is-gone'); };
    vp.addEventListener('pointerdown', e => {
      if (e.pointerType === 'touch' || e.button !== 0 || e.target.closest('button')) return;
      drag = { x: e.clientX, y: e.clientY, cx: cam.x, cy: cam.y, moved: false };
      try { vp.setPointerCapture(e.pointerId); } catch (err) { /* not captured */ }
    });
    vp.addEventListener('pointermove', e => {
      if (!drag) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!drag.moved && Math.hypot(dx, dy) < 5) return;
      drag.moved = true; vp.classList.add('is-grab'); anim = null; quiet();
      cam = keep({ s: cam.s, x: drag.cx + dx, y: drag.cy + dy }); apply();
    });
    // on a touch screen one finger still scrolls the page, and two move and zoom the map
    let two = null;
    const pair = t => { const r = vp.getBoundingClientRect(); return [(t[0].clientX + t[1].clientX) / 2 - r.left, (t[0].clientY + t[1].clientY) / 2 - r.top, Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY)]; };
    vp.addEventListener('touchstart', e => {
      if (e.touches.length !== 2) return;
      const [x, y, d] = pair(e.touches);
      two = { d: Math.max(1, d), s: cam.s, wx: (x - cam.x) / cam.s, wy: (y - cam.y) / cam.s };
      anim = null; stop(); quiet();
    }, { passive: true });
    vp.addEventListener('touchmove', e => {
      if (!two || e.touches.length !== 2) return;
      if (e.cancelable) e.preventDefault();
      const [x, y, d] = pair(e.touches), s = Math.max(lowest(), Math.min(3, two.s * d / two.d));
      cam = keep({ s, x: x - two.wx * s, y: y - two.wy * s }); apply();
    }, { passive: false });
    const lift = e => { if (e.touches.length < 2) two = null; };
    vp.addEventListener('touchend', lift); vp.addEventListener('touchcancel', lift);
    if (hint && matchMedia('(hover: none)').matches) hint.textContent = hint.dataset.touch;
    const end = () => { vp.classList.remove('is-grab'); setTimeout(() => { drag = null; }, 0); };
    vp.addEventListener('pointerup', end); vp.addEventListener('pointercancel', end);
    vp.addEventListener('wheel', e => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault(); quiet();
      const r = vp.getBoundingClientRect();
      zoom(Math.exp(-e.deltaY * 0.0025), e.clientX - r.left, e.clientY - r.top, 'now');
    }, { passive: false });

    // ---- the toolbar, the play bar and the panel
    lensBtns.forEach(b => b.addEventListener('click', () => setLens(b.dataset.lens)));
    $$('.px-z[data-z]', bar).forEach(b => b.addEventListener('click', () => {
      quiet();
      if (b.dataset.z === 'fit') aim(tall ? '*' : 'home'); else zoom(b.dataset.z === 'in' ? 1.3 : 1 / 1.3);
    }));
    side.addEventListener('click', () => {
      open = !open; app.classList.toggle('is-closed', !open); side.setAttribute('aria-pressed', open ? 'true' : 'false');
      layout(); aim(sel === 'i0' ? 'home' : arts[sel].dataset.frame || '*');
    });
    play.addEventListener('click', () => (playing ? stop() : start()));
    prev.addEventListener('click', () => show(step <= 1 ? 'i0' : 's' + (step - 1), 'step'));
    next.addEventListener('click', () => show('s' + Math.min(N, step + 1), 'step'));
    range.addEventListener('input', () => { const v = +range.value; show(v ? 's' + v : 'i0', 'scrub'); });
    insp.addEventListener('pointerenter', () => { held = true; });
    insp.addEventListener('pointerleave', () => { held = false; });
    function land(id) {  // the panel a link opened: its heading takes the focus, so the keyboard isn't left on a hidden link
      const h = arts[id] && $('h3', arts[id]); if (!h) return;
      h.tabIndex = -1; h.focus({ preventScroll: true });
    }
    insp.addEventListener('click', e => {
      const a = e.target.closest('a[href^="#px-"]');
      if (a) { e.preventDefault(); const id = a.hash.slice(4); show(id, 'click'); land(id); return; }
      const b = e.target.closest('.px-hbtn');
      if (b) { if (lens !== 'checks') setLens('checks'); breakOne(+b.dataset.h); return; }
      if (e.target.closest('.px-go')) { start(); play.focus({ preventScroll: true }); return; }
      const tg = e.target.closest('.px-tog');
      if (tg) {  // the mart, without the short course matched by email
        const v = tg.closest('.px-view'), alt = tg.getAttribute('aria-pressed') !== 'true';
        tg.setAttribute('aria-pressed', alt ? 'true' : 'false'); v.classList.toggle('is-alt', alt);
        $$('[data-alt]', v).forEach(c => { if (!c.dataset.was) c.dataset.was = c.textContent; c.textContent = alt ? c.dataset.alt : c.dataset.was; });
      }
    });

    // ---- only while it can be seen
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(es => es.forEach(x => {
        seen = x.isIntersecting;
        if (seen) wake(); else { stop(); sleep(); }
      }), { rootMargin: '80px' }).observe(app);
    } else { seen = true; wake(); }
    document.addEventListener('visibilitychange', () => { if (document.hidden) { stop(); sleep(); } else if (seen) wake(); });
    let queued = 0;
    const again = () => { cancelAnimationFrame(queued); queued = requestAnimationFrame(() => { const w = W, h = H, t = tall; layout(); if (w !== W || h !== H || t !== tall) aim(sel === 'i0' ? 'home' : arts[sel].dataset.frame || '*', 'init'); }); };
    if ('ResizeObserver' in window) new ResizeObserver(again).observe(app); else addEventListener('resize', again);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (reduce || !looping) draw(performance.now()); });

    const at0 = location.hash.length > 1 && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    const first = (at0 && at0.closest('.px-art')) || arts.i0;
    mode(innerWidth <= 640 ? innerWidth : innerWidth - 2 * Math.max(12, innerWidth / 2 - 650) - 16);  // from the window, until the page is laid out
    Object.keys(arts).forEach(k => { arts[k].hidden = arts[k] !== first; });  // one panel from the first frame
    rove(byId.q);
    // what needs measuring waits until the page has been laid out once, so starting the map never holds the page
    requestAnimationFrame(() => setTimeout(() => {
      layout(); show(first.id.slice(3), 'init'); app.classList.add('is-ready');
      if (at0 && app.contains(at0)) {  // a link to a panel: the map and its panel in view, as the panel moved when the others hid
        const hb = (document.querySelector('header.top') || { getBoundingClientRect: () => ({ bottom: 0 }) }).getBoundingClientRect().bottom;
        window.scrollTo(0, app.getBoundingClientRect().top + window.scrollY - hb - 10);
      } else if (at0) at0.scrollIntoView();  // a link further down: the map above it is shorter now
    }, 0));
  }

  // 2. What dbt alone can't tell you: each switch adds one piece of context, and the questions it answers turn over.
  function context(root) {
    const bar = $('.px-cx-bar', root), sw = $$('.px-pc', root), cards = $$('.px-card', root), ring = $$('.px-dn', root);
    const big = $('.px-donut b', root), say = $('.px-cx-n', root), done = $('.px-cx-done', root), on = new Set();
    root.classList.add('is-live'); bar.hidden = false;
    $$('.px-add', root).forEach(b => { b.hidden = false; });
    function paint(added) {
      sw.forEach(b => b.setAttribute('aria-pressed', on.has(b.dataset.k) ? 'true' : 'false'));
      cards.forEach(c => {
        const k = c.dataset.k, yes = k === 'dbt' || on.has(k);
        c.classList.toggle('is-on', yes); c.classList.toggle('is-new', yes && k === added);
      });
      ring.forEach(r => r.classList.toggle('is-on', r.dataset.k === 'dbt' || on.has(r.dataset.k)));
      const n = 1 + on.size;
      big.textContent = n; say.textContent = fmt(say.dataset.of, { n, of: cards.length });
      done.hidden = n < cards.length;
    }
    sw.forEach(b => b.addEventListener('click', () => {
      const k = b.dataset.k;
      if (on.has(k)) { on.delete(k); paint(); } else { on.add(k); paint(k); }
    }));
    root.addEventListener('click', e => {
      const add = e.target.closest('.px-add');
      if (add) {  // the card's own button: add its piece, and move on to the answer it gives
        on.add(add.dataset.k); paint(add.dataset.k);
        $('.px-with', add.closest('.px-card')).focus({ preventScroll: true });
        return;
      }
      const all = e.target.closest('[data-all]');
      if (all) { sw.forEach(b => (all.dataset.all === '1' ? on.add(b.dataset.k) : on.delete(b.dataset.k))); paint(); }
    });
    paint();
  }

  // 3. Open standards: the standards become tabs; a note lights its lines in the file, and a lit line picks its note.
  function standards(root) {
    root.classList.add('is-live');
    function pick(a, scroll) {
      const p = a.closest('.px-sp'), lo = +a.dataset.a, hi = +a.dataset.b, box = $('.px-code', p);
      let first = null;
      $$('.px-note', p).forEach(x => x.setAttribute('aria-current', x === a ? 'true' : 'false'));
      $$('.px-ln', p).forEach(l => {
        const n = +l.dataset.n, lit = n >= lo && n <= hi;
        l.classList.toggle('lit', lit);
        if (lit && !first) first = l;
      });
      if (scroll && first && box.scrollHeight > box.clientHeight + 4) {
        box.scrollTo({ top: Math.max(0, first.offsetTop - box.clientHeight * 0.2), behavior: still() ? 'auto' : 'smooth' });
      }
    }
    const T = tabs($('.px-stabs', root), i => {
      const p = T.panels[i];
      if (!$('.px-note[aria-current=true]', p)) pick($('.px-note', p), false);
    });
    root.addEventListener('click', e => {
      const a = e.target.closest('.px-note');
      if (a) { e.preventDefault(); pick(a, true); return; }
      const l = e.target.closest('.px-ln.nt');
      if (l) {
        const n = +l.dataset.n, note = $$('.px-note', l.closest('.px-sp')).find(x => n >= +x.dataset.a && n <= +x.dataset.b);
        if (note) pick(note, false);
      }
    });
    T.show(T.start(), 'init');
  }

  const parts = [['.px-app', map], ['.px-cx', context], ['.px-sd', standards]];
  const made = [];
  for (const [sel, make] of parts) {
    const el = $(sel);
    if (!el) continue;
    el.classList.add('px-still'); made.push(el);
    try { make(el); } catch (err) { console.warn('project page: ' + sel, err); }  // eslint-disable-line no-console
  }
  requestAnimationFrame(() => requestAnimationFrame(() => made.forEach(el => el.classList.remove('px-still'))));
})();
