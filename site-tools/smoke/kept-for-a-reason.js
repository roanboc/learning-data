/* Kept for a reason: plays the series' playgrounds and its evaluation through, for site-tools/smoke.py's series-learn check, from their
   words (window.KR) and only by what a visitor can click. A playground is played until every experiment is ticked, and must say in
   words what happened, draw every word whole (window.KR_MISS, from learn.js), give its picture words, and start again with none
   ticked. Every scenario must have its picture and take its right answer, and the results must count them all. Each returns what
   went wrong, as text. */
({
lab: async (id) => {
  const L = window.KR, Lb = L.labs.find(x => x.id === id), W = Lb.w, U = L.ui, panel = document.getElementById("kr-panel");
  const wait = ms => new Promise(r => setTimeout(r, ms)), q = s => panel.querySelector(s), qa = s => [...panel.querySelectorAll(s)];
  const out = [];
  const press = async (t, ms) => {
    const b = qa("button").find(x => x.textContent.trim() === t);
    if (!b) { out.push("no button “" + t + "”"); return; }
    b.click(); await wait(ms || 300);
  };
  const seg = async (row, k, ms) => {
    const g = qa(".kr-row .seg")[row], b = g && g.querySelectorAll("button")[k];
    if (!b) { out.push("no choice " + (k + 1) + " in group " + (row + 1)); return; }
    b.click(); await wait(ms || 300);
  };
  const cv = q("canvas");
  if (cv) cv.scrollIntoView({block: "center"});  // a picture plays while it's in view
  await wait(400);
  if (Lb.kind !== "play") out.push("no play for a lab of kind " + Lb.kind);
  else if (id === "reason") {
    const ORD = ["contract", "law", "yes", "task", "none"];
    await press(W.noB); await press(W.dropB);
    for (let i = 0; i < W.pieces.length; i++) { await seg(0, i, 200); await seg(1, ORD.indexOf(W.pieces[i].right), 200); }
    await press(W.dropB); await press(W.noB); await press(W.planB); await press(W.smallT); await press(W.planB);
  } else if (id === "schedule") {
    await press(W.octB); await seg(0, 1); await press(W.octB); await press(W.linhB);
    await press(W.janB); await press(W.holdT); await press(W.janB); await press(W.settleB);
  } else if (id === "forget") {
    await press(W.logB); await seg(0, 1); await press(W.logB); await press(W.allB); await press(W.searchB); await seg(1, 1); await press(W.searchB);
    await press(W.rebuildB); await seg(2, 1); await press(W.rebuildB); await press(W.allB);
  } else if (id === "deleted") {
    await press(W.delB); await press(W.qB); await press(W.vacB); await press(W.qB); await press(W.rewT); await press(W.delB); await press(W.vacB); await press(W.qB);
    await press(W.rebB); await press(W.srcT); await press(W.rebB); await press(W.restB); await press(W.reT); await press(W.restB);
    await press(W.histB); await press(W.namedT); await press(W.histB);
  } else if (id === "asks") {
    await press(W.dayB); await seg(0, 1); await press(W.dayB); await press(W.runB); await press(W.sendB);
    await seg(1, 1); await seg(2, 1); await press(W.runB); await press(W.checkB); await press(W.sendB);
  } else out.push("no play written for playground " + id);
  const ticked = qa(".kr-goals li.ok").length;
  if (ticked !== W.goals.length) out.push(ticked + " of " + W.goals.length + " experiments ticked once played: "
    + qa(".kr-goals li:not(.ok)").map(li => "“" + li.textContent.trim() + "”").join(", "));
  const say = q(".lab-say");
  if (!say || !say.textContent.trim()) out.push("nothing says in words what happened");
  const cut = [...(window.KR_MISS || [])];
  if (cut.length) out.push("its picture cuts words short: " + cut.slice(0, 4).map(s => "“" + s + "”").join(", "));
  const c2 = q("canvas");
  if (!c2) out.push("no picture");
  else if (!(c2.getAttribute("aria-label") || "").trim()) out.push("its picture has no words");
  const again = qa(".kr-again").find(b => b.textContent.trim() === U.again);
  if (!again) out.push("no way to start again");
  else {
    again.click(); await wait(100);
    const left = document.getElementById("kr-panel").querySelectorAll(".kr-goals li.ok").length;
    if (left) out.push("starting again leaves " + left + " experiments ticked");
  }
  return out;
},
quiz: async () => {
  const L = window.KR, app = document.getElementById("series-quiz"), wait = ms => new Promise(r => setTimeout(r, ms));
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
  return out;
}
})
