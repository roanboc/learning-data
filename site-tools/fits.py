"""Check that every piece of text stays inside its box, in every film:
    python site-tools/fits.py                    the film in the current folder (a film's source/), after its tools/build.py
    python site-tools/fits.py --film KEY ...     the films named by their release keys (such as the-question-behind-en)
    python site-tools/fits.py --all              every film a release.json names (build them first: nothing is built here)
A card's top line once ran 80 px past the card's right edge (The question behind the request, at 5:24, found on a phone on
12 November 2026): the card was laid out for a width, and the words were drawn at a size that needed more. That happens most when
text is made larger to read on a phone (at least 28 px in the 1920 px frame, PLAYBOOK.md) and its box isn't made to follow.

It draws the film every half second and watches what the canvas is asked to draw, so every component counts, whichever engine or
helper drew it:
  a box    a filled or outlined shape whose corners and edges all lie on its bounds: a rectangle, a rounded one, a pill, a disc.
           Thin rules and marks (under 0.9 of the text's size either way) and shapes too faint to see don't count, nor does a
           glow: a round gradient that fades away to nothing has no edge.
  its box  for each piece of text, a box under the point the text is placed by (its start, its middle or its end, as it is
           aligned), looking back from the text to the last solid surface painted there, so a card painted over another one hides
           it. The box has to hold the words (half their width and three quarters of their height: not a strap, a rule or a tile
           they only cross, nor a box whose edge they sit on) and be turned as they are (a slanted heading isn't held to the
           column under it); a disc or a ring holds only what sits near its middle. Of those, it is the smallest one the words
           fit in, or leave across an edge a viewer can see. The words are measured, not drawn, so the picture shows each box's
           edge with nothing written across it: an edge shows where the picture differs across it, or along its own line (by
           the middle value of nine places along the words, so a mark or a dot that crosses the edge isn't taken for it). A
           wash of light the words leave where no edge shows, or a sheen where it has faded to nothing, isn't their box there,
           and the next larger is looked at. A picture made on another canvas and then drawn on the frame (a card kept as a
           picture, a person, a scene fading out) brings its boxes and its text with it, where it is drawn.
A piece of text leaves its box where its ink ends more than --tol px (2), and more than a tenth of its own size, past such an
edge, in the frame's pixels, after the camera's zoom. Its bottom is the line it is written on: the tails of its letters may hang
below a box, as they do below a highlighter's band. Text a clip cuts at the box's edge doesn't show past it, and isn't listed.
It's a fault when the text does so for a second and a half or more in a row (it never fits: at every moment it is seen); less is
a moment in passing (a card springing open, a camera on its way), shown with -v. Text drawn as decoration (`deco`) isn't read,
so it isn't held to a box. A film may name text that is meant to leave a box in its film.json ("spills": a list of [chapter id,
text, why]); nothing else is skipped.

The engine draws the film's captions larger as the player gets smaller, so each caption is also drawn as the smallest phone shows
it, in every language the film has captions for, and held to its own box and to the frame.

It fails on any text that leaves its box. The films made before this check are fixed series by series: what each still does wrong
is listed in site-tools/fits_later.json ({film key: [[chapter id, text], ...]}), is shown as known and doesn't fail, and leaves the
list with its fix (the check says when a listed piece of text fits again). --later writes the list again for the films checked.
--json FILE writes what it found, with each piece of text's place in the frame."""
import argparse, gzip, json, math, os, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / '.github' / 'scripts'))
FW, FH = 1920, 1080  # the frame
LATER = ROOT / 'site-tools' / 'fits_later.json'

# The page's part: what the canvas is asked to draw, moment by moment, at SC of the frame's size (words and boxes are measured in
# the frame's pixels whatever the size, and a small picture draws ten times faster). EV: seconds between the moments drawn;
# PHONE: draw each caption alone instead, as a player PHONE css pixels wide draws it. The words themselves are measured, not
# drawn, so the picture shows each box's edge with nothing written across it.
COLLECT = r"""([EV, SC, T0, T1, PHONE]) => {
  const FW = 1920, FH = 1080, c = document.createElement('canvas'); c.width = Math.round(FW * SC); c.height = Math.round(FH * SC); const x = c.getContext('2d', { willReadFrequently: true });
  const P = CanvasRenderingContext2D.prototype, O = {};
  for (const k of ['beginPath', 'moveTo', 'lineTo', 'arcTo', 'quadraticCurveTo', 'bezierCurveTo', 'arc', 'ellipse', 'rect', 'roundRect',
    'fill', 'stroke', 'fillRect', 'strokeRect', 'clearRect', 'fillText', 'strokeText', 'drawImage', 'clip', 'save', 'restore',
    'createLinearGradient', 'createRadialGradient', 'createConicGradient']) if (P[k]) O[k] = P[k];
  let on = false, seq = 0, deco = 0, FID = 0;
  const ST = new WeakMap(), REC = new WeakMap();
  const S = ctx => { let s = ST.get(ctx); if (!s) { s = { p: [], big: false, ops: 0, full: 0, clip: null, stack: [] }; ST.set(ctx, s); } return s; };
  // what is painted on a canvas: it starts again when the canvas is cleared, and when it is painted at a later moment
  const rec = cv => { let r = REC.get(cv); if (!r || r.fid !== FID) { r = { fid: FID, boxes: [], texts: [], subs: [] }; REC.set(cv, r); } return r; };
  // how opaque a paint is: a colour's alpha, or the most opaque stop of a gradient made while the film is watched
  const GR = new WeakMap(), AC0 = CanvasGradient.prototype.addColorStop, x0 = document.createElement('canvas').getContext('2d');
  const colA = st => { if (st === 'transparent') return 0; const m = st.match(/^rgba?\(([^)]+)\)$/); if (m && m[1].indexOf('/') < 0) { const p = m[1].split(','); return p.length > 3 ? parseFloat(p[3]) : 1; }
    if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(st)) return 1; x0.fillStyle = '#000'; x0.fillStyle = st; const q = x0.fillStyle.match(/^rgba\(([^)]+)\)$/); return q ? parseFloat(q[1].split(',')[3]) : 1; };
  const alphaOf = st => typeof st === 'string' ? colA(st) : (GR.get(st) || { hi: 1 }).hi;
  for (const k of ['createLinearGradient', 'createRadialGradient', 'createConicGradient']) if (O[k]) P[k] = function () { const g = O[k].apply(this, arguments);
      GR.set(g, { r: k === 'createRadialGradient', lo: 1, hi: 0, p: k === 'createLinearGradient' ? [].slice.call(arguments, 0, 4).map(Number) : null, st: [] }); return g; };
  CanvasGradient.prototype.addColorStop = function (o, col) { const g = GR.get(this); if (g) { const a = colA(String(col)); if (a < g.lo) g.lo = a; if (a > g.hi) g.hi = a; g.st.push([+o, a]); } return AC0.apply(this, arguments); };
  // a straight gradient's alpha at a place, in the units it was made in
  const gradA = (g, X, Y) => { const p = g.p, st = g.st, dx = p[2] - p[0], dy = p[3] - p[1], L = dx * dx + dy * dy; if (!st.length) return 0;
    const t = L ? Math.max(0, Math.min(1, ((X - p[0]) * dx + (Y - p[1]) * dy) / L)) : 0; if (t <= st[0][0]) return st[0][1];
    for (let i = 1; i < st.length; i++) if (t <= st[i][0]) { const a = st[i - 1], b = st[i]; return b[0] > a[0] ? a[1] + (b[1] - a[1]) * (t - a[0]) / (b[0] - a[0]) : b[1]; }
    return st[st.length - 1][1]; };
  // a canvas's transform, in the frame's pixels
  const mat = ctx => { const m = ctx.getTransform(); return [m.a / SC, m.b / SC, m.c / SC, m.d / SC, m.e / SC, m.f / SC]; };
  const mul = (A, B) => [A[0] * B[0] + A[2] * B[1], A[1] * B[0] + A[3] * B[1], A[0] * B[2] + A[2] * B[3], A[1] * B[2] + A[3] * B[3], A[0] * B[4] + A[2] * B[5] + A[4], A[1] * B[4] + A[3] * B[5] + A[5]];
  const dev = (m, X, Y) => [m[0] * X + m[2] * Y + m[4], m[1] * X + m[3] * Y + m[5]];
  const inv = m => { const det = m[0] * m[3] - m[1] * m[2]; if (Math.abs(det) < 1e-12) return null; return [m[3] / det, -m[1] / det, -m[2] / det, m[0] / det, (m[2] * m[5] - m[3] * m[4]) / det, (m[1] * m[4] - m[0] * m[5]) / det]; };
  const scl = m => Math.sqrt(Math.abs(m[0] * m[3] - m[1] * m[2]));
  const span = q => { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const p of q) { if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0]; if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; } return [x0, y0, x1, y1]; };
  const corners = (m, b) => [dev(m, b[0], b[1]), dev(m, b[2], b[1]), dev(m, b[2], b[3]), dev(m, b[0], b[3])];
  const dbox = (m, b) => span(corners(m, b));
  const cut = (a, b) => !a ? b : !b ? a : [Math.max(a[0], b[0]), Math.max(a[1], b[1]), Math.min(a[2], b[2]), Math.min(a[3], b[3])];
  const turned = m => Math.abs(m[1]) > 1e-6 || Math.abs(m[2]) > 1e-6;
  const within = (d, D) => d[0] >= D[0] - 1 && d[1] >= D[1] - 1 && d[2] <= D[2] + 1 && d[3] <= D[3] + 1;

  /* ---- the path being built, in its own units: up to MAXP points, each on the outline or a corner the outline rounds */
  const MAXP = 60;
  const push = (s, X, Y) => { if (s.big) return; if (s.p.length >= MAXP * 2) { s.big = true; return; } s.p.push(X, Y); };
  P.beginPath = function () { const s = S(this); s.p.length = 0; s.big = false; s.ops = s.full = 0; return O.beginPath.call(this); };
  P.moveTo = function (X, Y) { push(S(this), X, Y); return O.moveTo.call(this, X, Y); };
  P.lineTo = function (X, Y) { const s = S(this); s.ops++; push(s, X, Y); return O.lineTo.call(this, X, Y); };
  P.arcTo = function (x1, y1, x2, y2, r) { const s = S(this); s.ops++; push(s, x1, y1); return O.arcTo.call(this, x1, y1, x2, y2, r); };
  P.quadraticCurveTo = function (cx, cy, X, Y) { const s = S(this); s.ops++; push(s, cx, cy); push(s, X, Y); return O.quadraticCurveTo.call(this, cx, cy, X, Y); };
  P.bezierCurveTo = function (a, b, cc, d, X, Y) { const s = S(this); s.ops++; push(s, a, b); push(s, cc, d); push(s, X, Y); return O.bezierCurveTo.call(this, a, b, cc, d, X, Y); };
  const arcPts = (s, cx, cy, rx, ry, a0, a1, ccw) => { const TAU = Math.PI * 2; let d = ccw ? a0 - a1 : a1 - a0;
    if (Math.abs(a1 - a0) >= TAU - 1e-6) d = TAU; else d = ((d % TAU) + TAU) % TAU;
    const at = a => push(s, cx + rx * Math.cos(a), cy + ry * Math.sin(a)); at(a0); at(a1);
    for (let q = 0; q < 4; q++) { const a = q * Math.PI / 2; let off = ccw ? a0 - a : a - a0; off = ((off % TAU) + TAU) % TAU; if (off < d + 1e-9) at(a); } };
  const whole = (a0, a1) => Math.abs(a1 - a0) >= Math.PI * 2 - 1e-6;
  P.arc = function (cx, cy, r, a0, a1, ccw) { const s = S(this); s.ops++; if (whole(a0, a1)) s.full++; arcPts(s, cx, cy, r, r, a0, a1, !!ccw); return O.arc.call(this, cx, cy, r, a0, a1, ccw); };
  P.ellipse = function (cx, cy, rx, ry, rot, a0, a1, ccw) { const s = S(this); s.ops++; if (whole(a0, a1)) s.full++; if (rot) s.big = true; else arcPts(s, cx, cy, rx, ry, a0, a1, !!ccw); return O.ellipse.call(this, cx, cy, rx, ry, rot, a0, a1, ccw); };
  P.rect = function (X, Y, w, h) { const s = S(this); s.ops++; push(s, X, Y); push(s, X + w, Y); push(s, X + w, Y + h); push(s, X, Y + h); return O.rect.call(this, X, Y, w, h); };
  if (O.roundRect) P.roundRect = function (X, Y, w, h) { const s = S(this); s.ops++; push(s, X, Y); push(s, X + w, Y); push(s, X + w, Y + h); push(s, X, Y + h); return O.roundRect.apply(this, arguments); };
  // the path as a box, if every point of it lies on the edge of its own bounds: [x0, y0, x1, y1]
  const pathBox = s => { if (s.big || s.p.length < 6) return null; const p = s.p; let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (let i = 0; i < p.length; i += 2) { if (p[i] < x0) x0 = p[i]; if (p[i] > x1) x1 = p[i]; if (p[i + 1] < y0) y0 = p[i + 1]; if (p[i + 1] > y1) y1 = p[i + 1]; }
    const w = x1 - x0, h = y1 - y0; if (!(w > 0) || !(h > 0)) return null; const e = Math.max(0.6, Math.min(w, h) * 0.02);
    for (let i = 0; i < p.length; i += 2) { const X = p[i], Y = p[i + 1]; if (!(Math.abs(X - x0) < e || Math.abs(X - x1) < e || Math.abs(Y - y0) < e || Math.abs(Y - y1) < e)) return null; }
    return [x0, y0, x1, y1]; };

  /* ---- boxes, in the order they are painted on each canvas; one painted inside a clip is cut by it. A glow (a round gradient that
     fades away to nothing) has no edge, so it isn't one; o: a disc or a ring, which holds only what sits near its middle */
  const addBox = (ctx, l, kind, style, disc) => { const g = typeof style === 'string' ? null : GR.get(style); if (g && g.r && g.lo < 0.05) return;
    const a = ctx.globalAlpha * alphaOf(style); if (a < 0.04) return; const m = mat(ctx), d = dbox(m, l), cl = S(ctx).clip;
    if (d[2] - d[0] < 12 || d[3] - d[1] < 12) return;
    rec(ctx.canvas).boxes.push({ q: ++seq, k: kind, m, l, d, a, solid: kind === 'f' && a >= 0.5 && (g ? g.lo >= 0.5 : typeof style === 'string'), rot: turned(m), o: disc ? 1 : 0, clip: cl && !within(d, cl) ? cl : null,
      fade: g && g.p && g.lo < 0.04 ? { p: g.p, st: g.st.slice().sort((u, v) => u[0] - v[0]), ga: ctx.globalAlpha } : null }); };
  P.fill = function () { if (on && !(arguments[0] instanceof Path2D)) { const s = S(this), b = pathBox(s); if (b) addBox(this, b, 'f', this.fillStyle, s.ops === 1 && s.full === 1); } return O.fill.apply(this, arguments); };
  P.stroke = function () { if (on && !(arguments[0] instanceof Path2D)) { const s = S(this), b = pathBox(s); if (b) addBox(this, b, 's', this.strokeStyle, s.ops === 1 && s.full === 1); } return O.stroke.apply(this, arguments); };
  const norm = (X, Y, w, h) => [Math.min(X, X + w), Math.min(Y, Y + h), Math.max(X, X + w), Math.max(Y, Y + h)];
  P.fillRect = function (X, Y, w, h) { if (on && w && h) addBox(this, norm(X, Y, w, h), 'f', this.fillStyle); return O.fillRect.call(this, X, Y, w, h); };
  P.strokeRect = function (X, Y, w, h) { if (on && w && h) addBox(this, norm(X, Y, w, h), 's', this.strokeStyle); return O.strokeRect.call(this, X, Y, w, h); };
  // a cleared canvas starts again
  P.clearRect = function (X, Y, w, h) { if (on) { const r = REC.get(this.canvas); if (r && r.fid === FID) { const D = dbox(mat(this), norm(X, Y, w, h));
        if (within([0, 0, this.canvas.width / SC, this.canvas.height / SC], D)) REC.delete(this.canvas);
        else { r.boxes = r.boxes.filter(b => !within(b.d, D)); r.texts = r.texts.filter(t => !within(dbox(t.m, t.l), D)); } } }
    return O.clearRect.call(this, X, Y, w, h); };
  const sizeOf = k => Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype, k), W0 = sizeOf('width'), H0 = sizeOf('height');
  for (const [k, d0] of [['width', W0], ['height', H0]]) Object.defineProperty(HTMLCanvasElement.prototype, k, { configurable: true, enumerable: d0.enumerable, get: d0.get, set(v) { REC.delete(this); return d0.set.call(this, v); } });
  // a picture drawn on a canvas: a large one hides what was under it; one made on another canvas brings its boxes and its text,
  // cut to where it is drawn and by the clip it is drawn in
  P.drawImage = function (img) { if (on && img) { const a = arguments; let sx = 0, sy = 0, sw = img.width || 0, sh = img.height || 0, dx, dy, dw, dh;
      if (a.length >= 9) { sx = a[1]; sy = a[2]; sw = a[3]; sh = a[4]; dx = a[5]; dy = a[6]; dw = a[7]; dh = a[8]; } else if (a.length >= 5) { dx = a[1]; dy = a[2]; dw = a[3]; dh = a[4]; } else { dx = a[1]; dy = a[2]; dw = sw; dh = sh; }
      if (dw && dh && sw && sh) { const cv = this.canvas, m = mat(this), ga = this.globalAlpha, d = dbox(m, norm(dx, dy, dw, dh)), r = rec(cv);
        if (ga >= 0.5 && (d[2] - d[0]) * (d[3] - d[1]) * SC * SC >= 0.4 * cv.width * cv.height) r.boxes.push({ q: ++seq, k: 'i', d });
        const sr = img instanceof HTMLCanvasElement && img !== cv ? REC.get(img) : null;
        if (sr && (sr.texts.length || sr.subs.length || sr.boxes.length)) { const Pm = mul(m, [dw / sw * SC, 0, 0, dh / sh * SC, dx - sx * dw / sw, dy - sy * dh / sh]), dcl = cut(S(this).clip, d);
          if (sr.texts.length || sr.subs.length) r.subs.push({ texts: sr.texts.slice(), subs: sr.subs.slice(), P: Pm, a: ga, clip: dcl });
          for (const b of sr.boxes) if (b.k !== 'i') { const bm = mul(Pm, b.m), bd = dbox(bm, b.l), bc = cut(dcl, b.clip && dbox(Pm, b.clip));
            r.boxes.push({ q: ++seq, k: b.k, m: bm, l: b.l, d: bd, a: b.a * ga, solid: b.solid && ga >= 0.5, rot: turned(bm), o: b.o, clip: within(bd, bc) ? null : bc, fade: b.fade && { p: b.fade.p, st: b.fade.st, ga: b.fade.ga * ga } }); } } } }
    return O.drawImage.apply(this, arguments); };
  P.save = function () { const s = S(this); s.stack.push(s.clip); return O.save.call(this); };
  P.restore = function () { const s = S(this); if (s.stack.length) s.clip = s.stack.pop(); return O.restore.call(this); };
  P.clip = function () { const s = S(this); if (on && !(arguments[0] instanceof Path2D) && !s.big && s.p.length >= 4) { const m = mat(this), q = [];
      for (let i = 0; i < s.p.length; i += 2) q.push(dev(m, s.p[i], s.p[i + 1])); s.clip = cut(s.clip, span(q)); }
    return O.clip.apply(this, arguments); };

  /* ---- text: each piece, with the boxes under the point it is placed by, back to the last solid surface there */
  const T0w = window.T; if (typeof T0w === 'function') window.T = function (ctx, s, X, Y, o) { const d = deco; if (o && o.deco) deco++; try { return T0w.apply(this, arguments); } finally { deco = d; } };
  // a piece of text (its four corners in the frame, q) against a box: its bounds and the box's, in the box's own units
  const place = (bm, b, q, clip) => { const mi = inv(bm); if (!mi) return null; const B = turned(bm) || !clip ? b.l : dbox(mi, cut(dbox(bm, b.l), clip));
    return { T: span(q.map(p => dev(mi, p[0], p[1]))), B, k: scl(bm), mi }; };
  // a box holds a piece of text when it holds at least half its width and most of its height: not a strap, a rule or a tile the words only cross
  const HW = 0.5, HH = 0.6;
  const holds = pl => { const T = pl.T, B = pl.B, w = T[2] - T[0], h = T[3] - T[1]; return w > 0 && h > 0 && Math.min(T[2], B[2]) - Math.max(T[0], B[0]) >= HW * w && Math.min(T[3], B[3]) - Math.max(T[1], B[1]) >= HH * h; };
  const under = (r, dx, dy, em, q) => { const out = [];
    for (let i = r.boxes.length - 1; i >= 0; i--) { const b = r.boxes[i]; if (dx < b.d[0] || dx > b.d[2] || dy < b.d[1] || dy > b.d[3]) continue;
      if (b.clip && (dx < b.clip[0] || dx > b.clip[2] || dy < b.clip[1] || dy > b.clip[3])) continue;
      if (b.k === 'i') break;
      const pl = place(b.m, b, q, b.clip); if (!pl) continue;
      if (b.rot) { const v = dev(pl.mi, dx, dy); if (v[0] < b.l[0] || v[0] > b.l[2] || v[1] < b.l[1] || v[1] > b.l[3]) continue; }
      if ((pl.B[2] - pl.B[0]) * pl.k < 0.9 * em || (pl.B[3] - pl.B[1]) * pl.k < 0.9 * em || !holds(pl)) continue;
      if (b.o && Math.hypot((pl.T[0] + pl.T[2] - b.l[0] - b.l[2]) / (b.l[2] - b.l[0]), (pl.T[1] + pl.T[3] - b.l[1] - b.l[3]) / (b.l[3] - b.l[1])) > 0.6) continue;
      out.push(b); if (b.solid) break; }
    return out; };
  const BASE = new Map(), base = ctx => { const k = ctx.font + '|' + ctx.textBaseline; let v = BASE.get(k); if (v === undefined) { v = ctx.measureText('x').actualBoundingBoxDescent; BASE.set(k, v); } return v; };
  P.fillText = function (str, X, Y) {
    if (on && str != null && String(str).trim()) { str = String(str); const a = this.globalAlpha * alphaOf(this.fillStyle);
      if (a > 0.5) { const r = rec(this.canvas), m = mat(this), mt = this.measureText(str), fm = this.font.match(/([\d.]+)px/), px = fm ? parseFloat(fm[1]) : 10;
        // text given a width to keep to (fillText's fourth argument) is squeezed to it by the browser, about the point it is placed by
        const mw = arguments.length > 3 && isFinite(arguments[3]) ? +arguments[3] : 0, sq = mw > 0 && mt.width > mw ? mw / mt.width : 1;
        const l = [X - mt.actualBoundingBoxLeft * sq, Y - mt.actualBoundingBoxAscent, X + mt.actualBoundingBoxRight * sq, Y + mt.actualBoundingBoxDescent];
        const ta = this.textAlign, al = ta === 'center' ? 'c' : (ta === 'right' || ta === 'end') ? 'r' : 'l';
        const k = Math.min(0.5 * px, (l[2] - l[0]) / 2), ax = al === 'c' ? (l[0] + l[2]) / 2 : al === 'r' ? l[2] - k : l[0] + k, A = dev(m, ax, (l[1] + l[3]) / 2);
        r.texts.push({ s: str, m, l, px, al, a, ax, ds: Math.max(0, mt.actualBoundingBoxDescent - base(this)), c: under(r, A[0], A[1], px * scl(m), corners(m, l)), deco: deco || (typeof PH_OFF !== 'undefined' && PH_OFF) ? 1 : 0, clip: S(this).clip }); } } };
  P.strokeText = function () {};

  /* ---- how clearly a box's edge shows where a piece of text crosses it, 0 to 255: the difference between the picture just inside
     and just outside the edge, or between the edge's own line and both. Each is the middle value of nine places along the rows
     (or columns) of the text, so a line, a dot or a grain that crosses the edge isn't taken for it */
  let PIX = null; const VD = Math.max(5, 1.5 / SC), NV = 9;
  const at = (X, Y) => { const px = Math.floor(X * SC), py = Math.floor(Y * SC); return px < 0 || py < 0 || px >= c.width || py >= c.height ? -1 : (py * c.width + px) * 4; };
  const mid = a => { a.sort((p, q) => p - q); return a[a.length >> 1]; };
  const shows = (bm, pl, side) => { const D = PIX || (PIX = x.getImageData(0, 0, c.width, c.height).data), T = pl.T, B = pl.B, d = VD / pl.k, e = 2 / pl.k, up = side % 2;
    const edge = B[side], n = side < 2 ? 1 : -1, lo = up ? B[0] : B[1], hi = up ? B[2] : B[3], pad = Math.min(e, (hi - lo) / 4);
    const t0 = Math.max(lo + pad, up ? T[0] : T[1]), t1 = Math.min(hi - pad, up ? T[2] : T[3]), offs = [d, -d, -e, 0, e], got = offs.map(() => [[], [], [], []]);
    for (let i = 0; i < NV; i++) { const u = t1 > t0 ? t0 + (i + 0.5) / NV * (t1 - t0) : (lo + hi) / 2;
      const js = offs.map(v => { const p = up ? dev(bm, u, edge + n * v) : dev(bm, edge + n * v, u); return at(p[0], p[1]); });
      if (js[0] < 0 || js[1] < 0) continue;
      for (let o = 0; o < offs.length; o++) if (js[o] >= 0) for (let ch = 0; ch < 4; ch++) got[o][ch].push(D[js[o] + ch]); }
    if (got[0][0].length < 3) return 0; let v = 0;
    for (let ch = 0; ch < 4; ch++) { const a = mid(got[0][ch]), b = mid(got[1][ch]); v = Math.max(v, Math.abs(a - b));
      for (let o = 2; o < offs.length; o++) if (got[o][ch].length) { const l = mid(got[o][ch]); v = Math.max(v, Math.min(Math.abs(l - a), Math.abs(l - b))); } }
    return v; };
  // a box filled with a gradient that fades to nothing has no edge where its paint has gone: there the words can't be seen to leave it
  const faded = (b, pl, side, A) => { const up = side % 2, T = pl.T, B = b.l, u = up ? (Math.max(B[0], T[0]) + Math.min(B[2], T[2])) / 2 : (Math.max(B[1], T[1]) + Math.min(B[3], T[3])) / 2;
    return (up ? gradA(b.fade, u, B[side]) : gradA(b.fade, B[side], u)) * b.fade.ga * A < 0.04; };

  /* ---- each moment: the text on the frame's canvas, and in the pictures drawn on it, each with its place in the frame */
  const r2 = v => Math.round(v * 100) / 100, r4 = v => Math.round(v * 1e4) / 1e4, out = [];
  const flat = (r, Pm, A, clip, depth, list) => { for (const t of r.texts) list.push([t, Pm, A, clip, depth]);
    if (depth < 4) for (const s of r.subs) { if (A * s.a <= 0.5) continue; flat(s, Pm ? mul(Pm, s.P) : s.P, A * s.a, cut(clip, s.clip && (Pm ? dbox(Pm, s.clip) : s.clip)), depth + 1, list); } };
  const keep = (t, sid, id) => { const fr = { t: r2(t), sid, texts: [] }, list = [], r = REC.get(c); if (id) fr.id = id; if (r && r.fid === FID) flat(r, null, 1, null, 0, list); PIX = null;
    for (const [tx, Pm, A, clip, depth] of list) { if (tx.a * A <= 0.5) continue; const m = Pm ? mul(Pm, tx.m) : tx.m, cl = cut(clip, tx.clip && (Pm ? dbox(Pm, tx.clip) : tx.clip)), q = corners(m, tx.l);
      fr.texts.push({ s: tx.s, m: m.map(r4), l: tx.l.map(r2), px: tx.px, al: tx.al, ax: r2(tx.ax), ds: r2(tx.ds), a: r2(tx.a * A), deco: tx.deco, lay: depth, clip: cl && cl.map(r2),
        c: tx.c.map(b => { const bm = Pm ? mul(Pm, b.m) : b.m, bc = cut(clip, b.clip && (Pm ? dbox(Pm, b.clip) : b.clip)), pl = place(bm, b, q, bc); let v = null;
          // where the words end more than a pixel past an edge, how clearly that edge shows
          if (pl && !PHONE) { const o = [pl.B[0] - pl.T[0], pl.B[1] - pl.T[1], pl.T[2] - pl.B[2], pl.T[3] - pl.B[3]]; if (o.some(u => u * pl.k > 1)) v = o.map((u, i) => u * pl.k > 1 ? (b.fade && faded(b, pl, i, A) ? 0 : shows(bm, pl, i)) : null); }
          return { k: b.k, a: r2(b.a * A), solid: b.solid ? 1 : 0, o: b.o, m: bm.map(r4), l: b.l.map(r2), v, clip: bc && bc.map(r2) }; }) }); }
    out.push(fr); };
  const total = TL.total, end = Math.min(T1, total);
  try {
    if (!PHONE) for (let t = T0; t < end; t += EV) { FID++; on = true; try { renderFrame(x, SC, t); } finally { on = false; } keep(t, SCENES[sceneIndex(t)].id); }
    else if (typeof drawCaption === 'function' && TL.caps) { c.getBoundingClientRect = () => ({ x: 0, y: 0, left: 0, top: 0, width: PHONE, height: PHONE * 9 / 16, right: PHONE, bottom: PHONE * 9 / 16 });
      const was = CAPS_ON; CAPS_ON = true;
      try { for (const k of TL.caps) { const t = (k.s + k.e) / 2; FID++; on = true; try { x.save(); drawCaption(x, SC, t); x.restore(); } finally { on = false; } keep(t, k.sid, k.id); } } finally { CAPS_ON = was; } }
  } finally { for (const k in O) P[k] = O[k]; CanvasGradient.prototype.addColorStop = AC0; if (typeof T0w === 'function') window.T = T0w;
    Object.defineProperty(HTMLCanvasElement.prototype, 'width', W0); Object.defineProperty(HTMLCanvasElement.prototype, 'height', H0); }
  return { total, scenes: SCENES.map(s => s.id), frames: out };
}"""

# Who drew a piece of text: the functions on the stack as the page draws it again, for what the check lists.
WHO = r"""([SC, ITEMS]) => { const c = document.createElement('canvas'); c.width = Math.round(1920 * SC); c.height = Math.round(1080 * SC); const x = c.getContext('2d');
  const P = CanvasRenderingContext2D.prototype, F0 = P.fillText; let want = null, got = '';
  const skip = /^(T|window\.T|withA|draw|f|eval|renderFrame|drawScene|(Array|Object|UtilityScript|P|CanvasRenderingContext2D|sc|pv|arrive)\..*)$/;
  P.fillText = function (s) { if (want !== null && !got && String(s) === want) got = (new Error().stack || '').split('\n').slice(2).map(l => l.trim().replace(/^at /, '').split(' ')[0])
      .filter(n => n && !skip.test(n) && !/^(file|https?):|^<anon/.test(n)).slice(0, 2).join(' < ') || 'the scene'; return F0.apply(this, arguments); };
  try { return ITEMS.map(([t, s]) => { want = s; got = ''; renderFrame(x, SC, t); return got; }); } finally { P.fillText = F0; } }"""

SIDES = ('left', 'top', 'right', 'bottom')
TOL = 2.0     # px past the edge, in the frame's pixels, that count
REL = 0.1     # ... and this share of the text's size, so a title isn't held to a hair
HOLD = (0.5, 0.75)  # a box holds a piece of text when it holds this share of its width, and of its height
SHOWS = 12    # an edge shows where the picture differs by this much (of 255) across it, or along its own line
TURN = 0.035  # radians: text turned further than this against a box (a slanted heading over a column) isn't held to it
LONG = 1.5    # seconds in a row past its box that make a fault; less is a moment in passing
PHONE = 288   # css px: the narrowest player, a phone 320 px wide held upright, where the captions are drawn largest


def _inv(m):
    det = m[0] * m[3] - m[1] * m[2]
    if abs(det) < 1e-12:
        return None
    return [m[3] / det, -m[1] / det, -m[2] / det, m[0] / det, (m[2] * m[5] - m[3] * m[4]) / det, (m[1] * m[4] - m[0] * m[5]) / det]


def _dev(m, x, y):
    return m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]


def _scl(m):
    return math.sqrt(abs(m[0] * m[3] - m[1] * m[2]))


def _turned(m):
    return abs(m[1]) > 1e-6 or abs(m[2]) > 1e-6


def _bounds(m, l):
    q = [_dev(m, X, Y) for X, Y in ((l[0], l[1]), (l[2], l[1]), (l[2], l[3]), (l[0], l[3]))]
    return [min(p[0] for p in q), min(p[1] for p in q), max(p[0] for p in q), max(p[1] for p in q)]


def frame_rect(t):
    """a piece of text's ink, as a rectangle in the frame: [x0, y0, x1, y1]"""
    return _bounds(t['m'], t['l'])


def anchor(t):
    """the point a piece of text is placed by, in the frame: near its start, its middle or its end, at mid-height"""
    l = t['l']
    return _dev(t['m'], t['ax'], (l[1] + l[3]) / 2)


def box_rect(b):
    """a box as a rectangle in the frame, cut by the clip it was painted in: [x0, y0, x1, y1]"""
    d, c = _bounds(b['m'], b['l']), b.get('clip')
    return [max(d[0], c[0]), max(d[1], c[1]), min(d[2], c[2]), min(d[3], c[3])] if c else d


def over(t, b, shown=None):
    """how far a piece of text's ink ends past each edge of a box, in the frame's pixels: [left, top, right, bottom]. shown: the
    part of the frame the text can show in (a clip), for a box and text that aren't turned"""
    if (shown or b.get('clip')) and not _turned(t['m']) and not _turned(b['m']):
        r, d = frame_rect(t), box_rect(b)
        if shown:
            r = [max(r[0], shown[0]), max(r[1], shown[1]), min(r[2], shown[2]), min(r[3], shown[3])]
        return [d[0] - r[0], d[1] - r[1], r[2] - d[2], r[3] - d[3]]
    mi = _inv(b['m'])
    if not mi:
        return None
    l = t['l']
    q = [_dev(mi, *_dev(t['m'], X, Y)) for X, Y in ((l[0], l[1]), (l[2], l[1]), (l[2], l[3]), (l[0], l[3]))]
    kb = _scl(b['m'])
    lx0, ly0, lx1, ly1 = min(p[0] for p in q), min(p[1] for p in q), max(p[0] for p in q), max(p[1] for p in q)
    return [(b['l'][0] - lx0) * kb, (b['l'][1] - ly0) * kb, (lx1 - b['l'][2]) * kb, (ly1 - b['l'][3]) * kb]


def _size(t, b):
    """a piece of text's ink, as wide and as tall as a box sees it, in the frame's pixels"""
    mi, l = _inv(b['m']), t['l']
    if not mi:
        return 0, 0
    q = [_dev(mi, *_dev(t['m'], X, Y)) for X, Y in ((l[0], l[1]), (l[2], l[1]), (l[2], l[3]), (l[0], l[3]))]
    kb = _scl(b['m'])
    return (max(p[0] for p in q) - min(p[0] for p in q)) * kb, (max(p[1] for p in q) - min(p[1] for p in q)) * kb


def its_box(t, tol=TOL, rel=REL, drawn=True):
    """The box a piece of text is held to, and how far it ends past it: (box, [left, top, right, bottom] in px, the sides it leaves
    by, the sides a clip cuts it at instead). Of the boxes the page listed under the point the text is placed by (back to the last
    solid surface), it is the smallest one that holds the text (HOLD) and that the text fits in, or leaves across an edge that
    shows in the picture; one it leaves only where no edge shows isn't a box a viewer sees there (a glow, a wash of light), and
    the next larger is looked at. The bottom is measured from the line the text is written on: the tails of its letters may hang
    below a box, as they do below a highlighter's band. drawn=False: the smallest, whether or not its edges show.
    (None, ...) when there is none."""
    em, clip, tail = t['px'] * _scl(t['m']), t.get('clip'), t.get('ds', 0) * _scl(t['m'])
    far = lambda o: [i for i in range(4) if o[i] > tol and o[i] > rel * em]
    for area, n, b in sorted(((b['l'][2] - b['l'][0]) * (b['l'][3] - b['l'][1]) * _scl(b['m']) ** 2, n, b) for n, b in enumerate(t['c'])):
        full = over(t, b)
        if not full or abs(math.remainder(math.atan2(t['m'][1], t['m'][0]) - math.atan2(b['m'][1], b['m'][0]), math.pi)) > TURN:
            continue
        w, h = _size(t, b)
        if w <= 0 or h <= 0 or w - max(full[0], 0) - max(full[2], 0) < HOLD[0] * w or h - max(full[1], 0) - max(full[3], 0) < HOLD[1] * h:
            continue  # the words only cross it: a strap, a rule, a tile, a label that sits on its edge
        o = over(t, b, clip) if clip else list(full)
        full[3] -= tail
        o[3] -= tail
        out, v = far(o), b.get('v') or (None,) * 4
        if not out:
            return b, o, [], far(full)
        if not drawn:
            return b, o, out, []
        out = [i for i in out if v[i] is not None and v[i] >= SHOWS]
        if out:
            return b, o, out, []
    return None, None, [], []


def measure_frames(frames, tol=TOL, rel=REL):
    """What each piece of text did over the moments it was seen: a dict by (chapter, text) of n (moments seen in a box), bad
    (moments its ink showed past the box), run (the most moments in a row it did), cut (moments a clip cut it at the box instead),
    mx and mn (the most and the least it ended past the box, px), and the worst moment. The same words drawn twice in one moment
    count once, by the copy that leaves its box furthest. A run that goes on from one chapter into the next is one run: the
    chapter that shows most of it has all of it (the earlier one, when they show as much), and the other only its own part, so
    a card that is still there for a moment as the next chapter fades in isn't listed twice."""
    stats, streak = {}, {}  # streak: for each text past its box, the moment it last was and how many moments of the run each chapter showed

    def close(s):
        part = streak.pop(s)[1]
        st = stats[(max(part, key=part.get), s)]
        st['run'] = max(st['run'], sum(part.values()))

    for fi, fr in enumerate(frames):
        now = {}
        for t in fr['texts']:
            ax, ay = anchor(t)
            if not (0 <= ax <= FW and 0 <= ay <= FH):
                continue  # placed off the frame: not seen
            r, clip = frame_rect(t), t.get('clip')
            if clip and (min(r[2], clip[2]) - max(r[0], clip[0]) < 1 or min(r[3], clip[3]) - max(r[1], clip[1]) < 1):
                continue  # all of it clipped away
            b, o, out, cut = its_box(t, tol, rel)
            if not b:
                continue
            m = max(o[i] for i in out) if out else max(o)
            was = now.get(t['s'])
            if was is None or (bool(out), m) > (bool(was[3]), was[0]):
                now[t['s']] = (m, t, b, out, cut, o, r)
        for s, (m, t, b, out, cut, o, r) in now.items():
            st = stats.get((fr['sid'], s))
            if st is None:
                st = stats[(fr['sid'], s)] = dict(sid=fr['sid'], s=s, n=0, bad=0, run=0, cut=0, mx=-1e9, mn=1e9, deco=bool(t.get('deco')))
            st['n'] += 1
            st['mn'] = min(st['mn'], m)
            st['cut'] += 1 if cut else 0
            if out:
                st['bad'] += 1
                was = streak.setdefault(s, [fi, {}])
                was[0], was[1][fr['sid']] = fi, was[1].get(fr['sid'], 0) + 1
                st['run'] = max(st['run'], was[1][fr['sid']])
            if (bool(out), m) > (st.get('_bad', False), st['mx']):
                st.update(mx=m, _bad=bool(out), t=fr['t'], o=[round(v, 1) for v in o], side=SIDES[max(out, key=lambda i: o[i])] if out else '',
                          d=[round(v, 1) for v in r], b=[round(v, 1) for v in box_rect(b)], bk=b['k'], ba=b['a'], bv=b.get('v'),
                          em=round(t['px'] * _scl(t['m']), 1), lay=t.get('lay', 0), clip=t.get('clip'))
            if 'id' in fr:
                st['id'] = fr['id']
        for s in [s for s, was in streak.items() if was[0] != fi]:
            close(s)
    for s in list(streak):
        close(s)
    for st in stats.values():
        st['mx'], st['mn'] = round(st['mx'], 1), round(st['mn'], 1)
        st.pop('_bad', None)
    return stats


def sort(stats, every=0.5, spills=()):
    """What was measured, as (never fits, leaves its box for LONG seconds or more in a row, leaves it for less): each a list of
    texts, the worst first. The first two are faults; never fits: at every moment it was seen. every: seconds between the moments
    measured. Text a film names in its "spills" is left out, and so is text drawn as decoration."""
    allowed, long = {(s[0], s[1]) for s in spills}, max(2, int(math.ceil(LONG / every - 1e-9)) + 1)
    never, awhile, briefly = [], [], []
    for x in stats.values():
        if x['bad'] < 1 or x['deco'] or (x['sid'], x['s']) in allowed:
            continue
        (briefly if x['run'] < long else never if x['bad'] == x['n'] else awhile).append(x)
    key = lambda x: -x['mx']
    return sorted(never, key=key), sorted(awhile, key=key), sorted(briefly, key=key)


def line(x, every=0.5):
    when = 'at all %d moments' % x['n'] if x['bad'] == x['n'] else '%d of %d moments' % (x['bad'], x['n'])
    if x['run'] > x['bad']:
        when += ' and across a change of chapter'
    if x['bad'] < x['n'] or x['run'] > x['bad']:
        when += ', %.1f s in a row' % ((x['run'] - 1) * every)
    return '%-10s %6.1f s  %-42s %5.1f px past the %s of its box (%s)%s' % (
        x['sid'], x['t'], repr(x['s'][:38]), x['mx'], x['side'], when, '  drawn by ' + x['who'] if x.get('who') else '')


def captions(frames, tol=TOL):
    """Captions drawn at a phone's size that leave their own box or the frame: (chapter/line, text, what)."""
    out = []
    for fr in frames:
        for t in fr['texts']:
            r, (b, o, past, _) = frame_rect(t), its_box(t, tol, 0, drawn=False)
            name = '%s/%s' % (fr['sid'], fr.get('id', ''))
            if r[0] < -tol or r[1] < -tol or r[2] > FW + tol or r[3] > FH + tol:
                out.append((name, t['s'], 'runs off the frame'))
            elif not b:
                out.append((name, t['s'], 'has no box under it'))
            elif past:
                out.append((name, t['s'], 'runs %.0f px past the %s of its box' % (max(o), SIDES[o.index(max(o))])))
            else:
                d = box_rect(b)
                if d[0] < -tol or d[1] < -tol or d[2] > FW + tol or d[3] > FH + tol:
                    out.append((name, t['s'], 'is in a box that runs off the frame'))
    return out


def entry_page(e):
    return ROOT / e['dir'] / pathlib.Path(e['player']).parent / 'render.html'


def at(here, lang, inv):
    """The film whose source folder this is, as (key, name, the page it builds, its source folder), or None if it is no film's.
    A film is known by its entry in a release.json, in the language asked for: the first films have no film.json, and CI runs
    this check from every film's folder. A film that has no entry yet, as while it is made, is known by its film.json."""
    here = pathlib.Path(here).resolve()
    mine = [e for e in inv.values() if (ROOT / e['dir']).resolve() == here and e['lang'] == lang]
    if mine:
        return mine[0]['key'], None, entry_page(mine[0]), here
    if (here / 'film.json').exists():
        return here.parent.name, None, here / 'dist' / 'render.html', here
    return None


def collect(browser, page, every, scale, t0=0, t1=1e9, phone=0, init=None, who=None):
    """What the page draws: the film's moments, or (phone) its captions as a phone draws them; init: a script to run first, such
    as another language's captions. who: [(seconds, text)] to name the functions that drew them, added to the result."""
    pg = browser.new_page(viewport={'width': FW, 'height': FH})
    try:
        if init:
            pg.add_init_script(path=str(init))
        pg.goto(page.as_uri())
        pg.wait_for_function('window.__READY__===true', timeout=180000)
        if who is not None:
            return pg.evaluate(WHO, [scale, who])
        return pg.evaluate(COLLECT, [every, scale, t0, t1, phone])
    finally:
        pg.close()


def later():
    """Text known to leave its box in films made before this check, to be fixed film by film: {film key: [[chapter, text], ...]}"""
    return json.loads(LATER.read_text(encoding='utf-8')) if LATER.exists() else {}


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--film', action='append', help='a release key; may be repeated')
    ap.add_argument('--all', action='store_true', help='every film')
    ap.add_argument('--every', type=float, default=0.5, help='seconds between the moments drawn (0.5)')
    ap.add_argument('--scale', type=float, default=0.25, help='the size the film is drawn at while it is measured (0.25 of the frame)')
    ap.add_argument('--tol', type=float, default=TOL, help='px past the edge that count (2)')
    ap.add_argument('--from', dest='t0', type=float, default=0)
    ap.add_argument('--to', dest='t1', type=float, default=1e9)
    ap.add_argument('--json', help='write what was found to this file')
    ap.add_argument('--raw', help='a folder to keep what the page drew in, one .json.gz per film')
    ap.add_argument('--later', action='store_true', help='write what these films still do wrong to site-tools/fits_later.json, to fix film by film')
    ap.add_argument('-v', action='store_true', help='also list text that leaves its box for a moment in passing')
    A = ap.parse_args()
    from playwright.sync_api import sync_playwright
    import films as release_films
    inv = {e['key']: e for e in release_films.films()}
    if A.film or A.all:
        keys = list(inv) if A.all else A.film
        unknown = [k for k in keys if k not in inv]
        if unknown:
            ap.error('unknown film key %s' % ', '.join(unknown))
        todo = [(k, inv[k]['name'], entry_page(inv[k]), ROOT / inv[k]['dir']) for k in keys]
    else:
        here = at(pathlib.Path.cwd(), os.environ.get('FILM_LANG', 'en'), inv)
        if not here:
            ap.error('run this from a film\'s source folder, or name films with --film or --all')
        todo = [here]
    out, failed, known, was = {}, [], later(), later()
    with sync_playwright() as p:
        b = p.chromium.launch(args=['--allow-file-access-from-files'])
        for key, name, page, src in todo:
            if not page.exists():
                raise SystemExit('%s: no %s; run its tools/build.py first' % (key, page))
            r = collect(b, page, A.every, A.scale, A.t0, A.t1)
            if A.raw:
                pathlib.Path(A.raw).mkdir(parents=True, exist_ok=True)
                with gzip.open(pathlib.Path(A.raw) / (key + '.json.gz'), 'wt', encoding='utf-8', compresslevel=3) as f:
                    json.dump(dict(r, page=str(page)), f)
            meta = json.loads((src / 'film.json').read_text(encoding='utf-8')) if (src / 'film.json').exists() else {}
            stats = measure_frames(r['frames'], A.tol)
            never, awhile, briefly = sort(stats, A.every, meta.get('spills', ()))
            found = never + awhile
            if found:
                for x, w in zip(found, collect(b, page, A.every, A.scale, who=[[x['t'], x['s']] for x in found])):
                    x['who'] = w
            # the captions, as the smallest phone draws them, in each language the film has captions for
            caps = []
            if A.t0 == 0 and A.t1 >= r['total']:
                packs = [None] + (sorted((src / 'src' / 'i18n').glob('*/captions.js')) if page.parent.name == 'dist' else [])
                for pack in packs:
                    cr = collect(b, page, A.every, A.scale, phone=PHONE, init=pack)
                    caps += [(pack.parent.name if pack else 'film',) + c for c in captions(cr['frames'], A.tol)]
            if A.later:
                known[key] = sorted([x['sid'], x['s']] for x in found)
            old = {tuple(k) for k in known.get(key, ())}
            new = [x for x in found if (x['sid'], x['s']) not in old]
            fixed = sorted(old - {(x['sid'], x['s']) for x in found}) if A.t0 == 0 and A.t1 >= r['total'] else []
            out[key] = dict(page=str(page), total=r['total'], never=never, awhile=awhile, briefly=briefly, texts=len(stats), captions=caps)
            head = '%s: ' % (name or key) if len(todo) > 1 else ''
            print('%s%d pieces of text in boxes over %.0f s; %d leave their box%s' % (head, len(stats), r['total'], len(found),
                  ', %d of them known and still to fix (site-tools/fits_later.json)' % (len(found) - len(new)) if len(found) > len(new) else ''), flush=True)
            for x in found:
                print('  %s%s' % ('' if x in new else '(known) ', line(x, A.every)), flush=True)
            if A.v:
                for x in briefly:
                    print('  (briefly) ' + line(x, A.every), flush=True)
            for sid, s in fixed:
                print('  (fits now) %-10s %s: take it off the list in site-tools/fits_later.json' % (sid, repr(s[:60])), flush=True)
            for lang, where, s, what in caps:
                print('  caption on a phone (%s) %s %s: %s' % (lang, where, what, s[:60]), flush=True)
            if new or caps:
                failed.append(key)
            if A.json:
                pathlib.Path(A.json).write_text(json.dumps(out, indent=1, ensure_ascii=False), encoding='utf-8')
        b.close()
    if A.later:
        known = {k: v for k, v in known.items() if v and k in inv}
        if known != was:
            LATER.write_text(json.dumps({k: known[k] for k in inv if k in known}, indent=1, ensure_ascii=False) + '\n', encoding='utf-8')
        print('%d pieces of text in %d films are listed to fix later' % (sum(len(v) for v in known.values()), len(known)))
        return
    if failed:
        raise SystemExit('%d film%s with text that leaves its box: %s. Make the box fit the words (measure them at the size they are drawn), '
                         'wrap or shorten them, or give them more room' % (len(failed), 's' if len(failed) > 1 else '', ', '.join(failed)))
    print('every piece of text stays inside its box' if not any(known.get(k) for k, *_ in todo) else 'no new text leaves its box')


if __name__ == '__main__':
    main()
