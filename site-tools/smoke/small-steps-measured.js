/* Data management (here, Small steps, measured; each series of the module has a copy of this file under its own id): plays the
   series' decision playgrounds and its evaluation through, for site-tools/smoke.py's series-learn check, only by what a visitor can
   click. A playground is played with the runs the engine lists for it (window.DM_RUNS, from site/assets/data-management/learn.js):
   each run sets every choice, the rest back to where it starts (window.DM_CTL), and plays it out to the end. Once played, every
   experiment must be ticked; the playground must say in words what happened, keep a log, draw every word whole (window.DM_MISS), give
   its picture words, and start again with none ticked. Every scenario must have its picture and take its right answer, and the
   results must count them all. Each returns what went wrong, as text. */
({
lab: async (id) => {
  const L = window.DM, Lb = L.labs.find(x => x.id === id), W = Lb.w, U = L.ui, panel = document.getElementById("dm-panel");
  const wait = ms => new Promise(r => setTimeout(r, ms)), q = s => panel.querySelector(s), qa = s => [...panel.querySelectorAll(s)];
  const out = [], ctl = (window.DM_CTL || {})[id], runs = (window.DM_RUNS || {})[id];
  const cv = q("canvas");
  if (cv) cv.scrollIntoView({block: "center"});  // a picture plays while it's in view
  await wait(300);
  if (Lb.kind !== "play") out.push("no play for a lab of kind " + Lb.kind);
  else if (!ctl || !runs) out.push("no runs written for playground " + id);
  else {
    for (const run of runs) {
      const rows = qa(".dm-ctrl .dm-row");
      ctl.forEach(([kind, key, d], i) => {
        const v = key in run ? run[key] : d, row = rows[i];
        if (!row) { out.push("no row for the choice " + key); return; }
        if (kind === "seg") {
          const b = row.querySelector('.seg button[data-k="' + v + '"]');
          if (!b) out.push("no option " + v + " for " + key); else if (b.getAttribute("aria-pressed") !== "true") b.click();
        } else {
          const b = row.querySelector(".chip-btn");
          if (!b) out.push("no switch for " + key); else if ((b.getAttribute("aria-pressed") === "true") !== !!v) b.click();
        }
      });
      const go = qa("button").find(x => x.textContent.trim() === W.playB);
      if (!go) { out.push("no button “" + W.playB + "”"); break; }
      go.click();
      const box = q(".dm-lab");
      for (let k = 0; k < 160 && box.dataset.running === "1"; k++) await wait(100);
      if (box.dataset.running === "1") out.push("a run never ended");
      if (!q(".dm-log li")) out.push("a run left nothing in its log");
    }
  }
  const ticked = qa(".dm-goals li.ok").length;
  if (ticked !== W.goals.length) out.push(ticked + " of " + W.goals.length + " experiments ticked once played: "
    + qa(".dm-goals li:not(.ok)").map(li => "“" + li.textContent.trim() + "”").join(", "));
  const say = q(".lab-say");
  if (!say || !say.textContent.trim()) out.push("nothing says in words what happened");
  const cut = [...(window.DM_MISS || [])];
  if (cut.length) out.push("its picture cuts words short: " + cut.slice(0, 4).map(s => "“" + s + "”").join(", "));
  const c2 = q("canvas");
  if (!c2) out.push("no picture");
  else if (!(c2.getAttribute("aria-label") || "").trim()) out.push("its picture has no words");
  const again = qa(".dm-again").find(b => b.textContent.trim() === U.again);
  if (!again) out.push("no way to start again");
  else {
    again.click(); await wait(100);
    const left = document.getElementById("dm-panel").querySelectorAll(".dm-goals li.ok").length;
    if (left) out.push("starting again leaves " + left + " experiments ticked");
  }
  return out;
},
quiz: async () => {
  const L = window.DM, app = document.getElementById("series-quiz"), wait = ms => new Promise(r => setTimeout(r, ms));
  const out = [], seen = new Set();
  for (let k = 0; k < L.qs.length + 2; k++) {
    if (app.querySelector(".qdone")) break;
    const t = (app.querySelector(".qbody h3") || {}).textContent, qq = L.qs.find(x => x.title === t);
    if (!qq) { out.push("a scenario that isn't in the words: " + t); break; }
    if (seen.has(qq.n)) { out.push("scenario " + qq.n + " came twice"); break; }
    seen.add(qq.n);
    if (!app.querySelector(".qvis canvas")) out.push("scenario " + qq.n + " has no picture");
    const j = qq.opts.findIndex(o => o.ok), b = app.querySelector('.qopt[data-j="' + j + '"]');
    if (!b) { out.push("scenario " + qq.n + ": no right answer to pick"); break; }
    b.click(); await wait(30);
    const fb = app.querySelector(".qfeed");
    if (!fb || !fb.classList.contains("ok")) out.push("scenario " + qq.n + ": its right answer isn't taken as right");
    const nx = app.querySelector(".qfoot .btn.primary");
    if (!nx) { out.push("scenario " + qq.n + ": no way on"); break; }
    nx.click(); await wait(30);
  }
  const ring = app.querySelector(".qdone .ring b");
  if (!ring) out.push("the results never came");
  else if (ring.textContent !== L.qs.length + "/" + L.qs.length) out.push("the results say " + ring.textContent + ", expected " + L.qs.length + "/" + L.qs.length);
  if (seen.size !== L.qs.length) out.push(seen.size + " scenarios played, of " + L.qs.length);
  const cut = [...(window.DM_MISS || [])];
  if (cut.length) out.push("a scenario's picture cuts words short: " + cut.slice(0, 4).map(s => "“" + s + "”").join(", "));
  return out;
}
})
