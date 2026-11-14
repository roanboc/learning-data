/* Platform and solution architecture: plays the series' labs and scenarios through, for site-tools/smoke.py's series-learn
   check, from their words (window.PSA) and only by what a visitor can click. A lab gets the right answers, with one wrong pick on
   its first card, and must reach its end, say what happened in words (its end only once), draw every word whole (window.PSA_MISS,
   from learn.js), and start again; the join cards of Model the data practice are answered from their own options. Every scenario
   must have its picture, the first one too, and get its right answer, and the results must count them all; its picture is
   played with motion reduced, as a visitor may ask, so it draws its answered state at once, and every word it draws, before
   and after, must be whole (long Spanish names once ran out of four of them on a phone). Each returns what went wrong, as text. */
({
lab: async (id) => {
  const L = window.PSA, Lb = L.labs.find(x => x.id === id), W = Lb.w, U = L.ui, panel = document.getElementById("ps-panel");
  const wait = ms => new Promise(r => setTimeout(r, ms)), q = s => panel.querySelector(s), qa = s => [...panel.querySelectorAll(s)];
  const click = (el, what) => { if (!el) throw new Error("nothing to click: " + what); el.click(); };
  const byText = (sel, t) => qa(sel).find(b => b.textContent.trim() === t);
  const out = [];
  if (Lb.kind === "deal") {
    for (let i = 0; i < W.items.length; i++) {
      const it = W.items[i], opts = it.opts || W.buckets;
      if (i === 0) click(q('.ps-opts button[data-k="' + opts.find(o => o[0] !== it.b)[0] + '"]'), "a wrong pick");
      else click(q('.ps-opts button[data-k="' + it.b + '"]'), "card " + (i + 1));
      await wait(20);
      if (!q(".ps-why")) out.push("card " + (i + 1) + " says nothing about why");
      click(q(".lab-controls .chip-btn.go"), "next, after card " + (i + 1)); await wait(20);
    }
  } else out.push("no play for a lab of kind " + Lb.kind);
  await wait(60);
  const end = q(".ps-end"), say = q(".lab-say");
  if (!end) out.push("it never reached its end");
  else if (!end.textContent.includes((W.items.length - 1) + " ")) out.push("its end doesn't count the right first tries: " + end.textContent.slice(0, 80));
  if (!say || !say.textContent.trim()) out.push("nothing says in words what happened");
  else if (end && !say.classList.contains("sr") && say.textContent.includes(end.textContent.trim())) out.push("its end is said twice, under the picture and in its end box");
  const cut = [...(window.PSA_MISS || [])];
  if (cut.length) out.push("its picture cuts words short: " + cut.slice(0, 4).map(s => "“" + s + "”").join(", "));
  const cv = q("canvas");
  if (cv && !(cv.getAttribute("aria-label") || "").trim()) out.push("its picture has no words");
  const again = byText(".chip-btn", U.again);
  if (!again) out.push("no way to start again");
  else { again.click(); await wait(60); if (document.getElementById("ps-panel").querySelector(".ps-end")) out.push("starting again leaves the end on the page"); }
  return out;
},
quiz: async () => {
  const L = window.PSA, app = document.getElementById("series-quiz"), wait = ms => new Promise(r => setTimeout(r, ms));
  const out = [], seen = new Set(), mm = window.matchMedia;
  const still = q => ({ matches: true, media: q, onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; } });
  window.matchMedia = q => /prefers-reduced-motion/.test(q) ? still(q) : mm.call(window, q);
  try {
    for (let k = 0; k < L.qs.length + 2; k++) {
      if (app.querySelector(".qdone")) break;
      const t = (app.querySelector(".qbody h3") || {}).textContent, qq = L.qs.find(x => x.title === t);
      if (!qq) { out.push("a scenario that isn't in the words: " + t); break; }
      if (seen.has(qq.n)) { out.push("scenario " + qq.n + " came twice"); break; }
      seen.add(qq.n);
      if (!app.querySelector(".qvis canvas")) out.push("scenario " + qq.n + " has no picture");
      if (qq.type === "choice") {
        const j = qq.opts.findIndex(o => o.ok), b = app.querySelector('.qopt[data-j="' + j + '"]');
        if (!b) { out.push("scenario " + qq.n + ": no right answer to pick"); break; }
        b.click();
      } else { out.push("scenario " + qq.n + ": no play for a scenario of type " + qq.type); break; }
      await wait(30);
      const fb = app.querySelector(".qfeed");
      if (!fb || !fb.classList.contains("ok")) out.push("scenario " + qq.n + ": its right answer isn't taken as right");
      const nx = app.querySelector(".qfoot .btn.primary");
      if (!nx) { out.push("scenario " + qq.n + ": no way on"); break; }
      nx.click(); await wait(30);
    }
  } finally { window.matchMedia = mm; }
  const cut = [...(window.PSA_MISS || [])];
  if (cut.length) out.push("a scenario's picture cuts words short: " + cut.slice(0, 4).map(s => "“" + s + "”").join(", "));
  const ring = app.querySelector(".qdone .ring b");
  if (!ring) out.push("the results never came");
  else if (ring.textContent !== L.qs.length + "/" + L.qs.length) out.push("the results say " + ring.textContent + ", expected " + L.qs.length + "/" + L.qs.length);
  if (seen.size !== L.qs.length) out.push(seen.size + " scenarios played, of " + L.qs.length);
  return out;
}
})
