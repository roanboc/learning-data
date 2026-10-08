/* ===== What it must be able to do: the film's own pictures (prefixed d4_) =====
   The Inca road, marked on the mountains, with its relay posts; a runner's band passing a knotted cord from post to post; the notes
   of the first wall, and a capability map drawn in levels, in the strategy layer's amber; owners' gold ticks; a heat map from cool
   to hot; a reorganisation; and the level that stops. Capabilities start as paper notes and turn to glass once confirmed. */

const STR = LAY6[1][1];                       // the strategy layer, where capabilities sit
const COOLC = [120, 200, 190], WARMC = [240, 200, 110], HOTC = [235, 95, 70];
function heatCol(v) { v = clamp(v, 0, 1); return v < 0.5 ? mix(COOLC, WARMC, v * 2) : mix(WARMC, HOTC, (v - 0.5) * 2); }

/* ---------- 1400s: the road ---------- */
// the road: a cubic curve up the mountains, from the bottom left to the top right, and the five relay posts along it
const D4_ROAD = [[160, 900], [620, 1010], [1000, 140], [1760, 300]];
function d4_bez(s) {
  const [p0, p1, p2, p3] = D4_ROAD, u = 1 - s;
  return [u * u * u * p0[0] + 3 * u * u * s * p1[0] + 3 * u * s * s * p2[0] + s * s * s * p3[0],
          u * u * u * p0[1] + 3 * u * u * s * p1[1] + 3 * u * s * s * p2[1] + s * s * s * p3[1]];
}
const D4_ROADPTS = Array.from({ length: 81 }, (_, i) => d4_bez(i / 80));
const D4_POSTS = [0.06, 0.28, 0.5, 0.72, 0.94];
const D4_PEAKS = [[60, 820], [250, 560], [420, 720], [640, 470], [860, 700], [1080, 400], [1300, 640], [1500, 480], [1700, 650], [1880, 560]];
const D4_BANDS = [[230, 150, 110], [120, 190, 210], [230, 205, 110], [170, 140, 220], [150, 210, 150]];
// the mountains, in marker; a faint line under the road
function d4_mountains(ctx, p, a) { if (a <= 0.01) return; withA(ctx, a, () => marker(ctx, D4_PEAKS, p, { lw: 3, col: rgba(PARCH, 0.35) })); }
// the road, drawn in marker up to p (0..1 of its length)
function d4_road(ctx, p, a) { if (a <= 0.01) return; withA(ctx, a, () => marker(ctx, D4_ROADPTS, p, { lw: 7, col: rgba(PARCH, 0.9) })); }
// a relay post: a small hut with a pitched roof
function d4_post(ctx, x, y, a) { if (a <= 0.01) return; withA(ctx, a, () => { ctx.save(); ctx.fillStyle = "rgba(96,60,40,0.95)"; ctx.strokeStyle = rgba(PARCH, 0.9); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.rect(x - 22, y - 34, 44, 34); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - 30, y - 32); ctx.lineTo(x, y - 58); ctx.lineTo(x + 30, y - 32); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); }); }
// the message: a knotted cord, carried by a runner's band of colour col, at road position s (0..1), pointing along the road
function d4_carrier(ctx, s, col, a) { if (a <= 0.01) return; const [x, y] = d4_bez(s), [x2, y2] = d4_bez(clamp(s + 0.01, 0, 1)), ang = Math.atan2(y2 - y, x2 - x);
  withA(ctx, a, () => { glow(ctx, x, y, 64, col, 0.35); ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
    ctx.strokeStyle = "rgba(222,170,112,0.95)"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-70, 0); ctx.lineTo(70, 0); ctx.stroke();
    ctx.fillStyle = "rgba(222,170,112,1)"; [-46, -16, 14, 44].forEach(k => { ctx.beginPath(); ctx.arc(k, 0, 6, 0, TAU); ctx.fill(); });
    ctx.fillStyle = rgba(col, 1); rr(ctx, -18, -22, 36, 44, 8); ctx.fill(); ctx.restore(); }); }

/* ---------- the wall and the notes ---------- */
// a note of the capability map: paper while it's a draft (g 0), glass in the strategy layer's amber once confirmed (g 1)
function d4_cap(ctx, cx, cy, w, h, name, g, o) { o = o || {}; const x = cx - w / 2, y = cy - h / 2, sz = o.size || 30; g = clamp(g == null ? 1 : g, 0, 1);
  if (g < 1) withA(ctx, 1 - g, () => sticky(ctx, cx, cy, w, h, name, { col: NOTEC[o.k || 0], size: sz, rot: 0, st: o.st }));
  if (g > 0) withA(ctx, g, () => archEl(ctx, x, y, w, h, name, o.col || STR, o.kind || "capability", { size: sz, gs: o.gs || 17, hi: o.hi || 0 })); }
// a capability coloured by how well it works: 0 cool, 1 hot. Its glass takes the colour, and a tint of it grows with the heat
function d4_heat(ctx, cx, cy, w, h, name, v, a) { if (a <= 0.01) return; const x = cx - w / 2, y = cy - h / 2, col = heatCol(v), sz = 30;
  withA(ctx, a, () => { glass(ctx, x, y, w, h, 16, col, { glow: 12 + 14 * v, ea: 0.85, fill: "rgba(7,12,24,0.94)" });
    ctx.fillStyle = rgba(col, 0.12 + 0.5 * v); rr(ctx, x, y, w, h, 16); ctx.fill();
    archGlyph(ctx, "capability", x + w - 28, y + 26, 17, col);
    const ls = wrapT(ctx, name, 0, 0, w - 64, { size: sz, w: 700, measure: true });
    wrapT(ctx, name, cx - 8, cy + sz * 0.36 - (ls.length - 1) * sz * 0.58, w - 64, { size: sz, w: 700, align: "center", color: rgba(INK, 0.96), lh: sz * 1.15 }); }); }
// the key for the heat map: a bar from cool to hot, with a word at each end
function d4_legend(ctx, x, y, w, a) { if (a <= 0.01) return; withA(ctx, a, () => { const g = ctx.createLinearGradient(x, 0, x + w, 0);
  g.addColorStop(0, rgba(COOLC, 1)); g.addColorStop(0.5, rgba(WARMC, 1)); g.addColorStop(1, rgba(HOTC, 1)); ctx.fillStyle = g; rr(ctx, x, y, w, 18, 9); ctx.fill();
  T(ctx, "cool", x, y + 56, { w: 700, size: 30, color: rgba(PARCH, 0.95) }); T(ctx, "hot", x + w - 50, y + 56, { w: 700, size: 30, color: rgba(PARCH, 0.95) }); }); }
// a faint box for a level that is not drawn in full: paper, faded
function d4_faint(ctx, cx, cy, w, h, name, a) { if (a <= 0.01) return; withA(ctx, a, () => sticky(ctx, cx, cy, w, h, name, { col: NOTEC[2], size: 30, rot: 0 })); }
// a line from one point to another, drawn to p (0..1), in the strategy amber
function d4_link(ctx, x0, y0, x1, y1, p, a) { if (p <= 0) return; withA(ctx, a == null ? 0.85 : a, () => marker(ctx, [[x0, y0], [x1, y1]], p, { lw: 3, col: rgba(STR, 0.85) })); }
