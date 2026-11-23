/* Business architecture for data: plays the series' playgrounds and its evaluation through, for site-tools/smoke.py's series-learn check, from their
   words (window.BA) and only by what a visitor can click. A playground is played until every experiment is ticked, and must say in
   words what happened, draw every word whole (window.BA_MISS, from learn.js), give its picture words, and start again with none
   ticked. Every scenario must have its picture and take its right answer, and the results must count them all. Each returns what
   went wrong, as text. */
({
lab: async (id) => {
  const L = window.BA, Lb = L.labs.find(x => x.id === id), W = Lb.w, U = L.ui, panel = document.getElementById("ba-panel");
  const wait = ms => new Promise(r => setTimeout(r, ms)), q = s => panel.querySelector(s), qa = s => [...panel.querySelectorAll(s)];
  const out = [];
  const press = async (t, ms) => {
    const b = qa("button").find(x => x.textContent.trim() === t);
    if (!b) { out.push("no button “" + t + "”"); return; }
    b.click(); await wait(ms || 300);
  };
  const seg = async (row, k, ms) => {
    const g = qa(".ba-row .seg")[row], b = g && g.querySelectorAll("button")[k];
    if (!b) { out.push("no choice " + (k + 1) + " in group " + (row + 1)); return; }
    b.click(); await wait(ms || 300);
  };
  const cv = q("canvas");
  if (cv) cv.scrollIntoView({block: "center"});  // a picture plays while it's in view
  await wait(400);
  if (Lb.kind !== "play") out.push("no play for a lab of kind " + Lb.kind);
  else if (id === "own") {
    await press(W.whos[0][1]); await press(W.whos[2][1]);
    for (const j of W.jobs.filter(j => j[2] === "biz")) await press(j[1]);
    await press(W.retireB); await press(W.amaT); await press(W.closeB, 600);
  } else if (id === "draft") {
    await press(W.draftB); await seg(0, 1); await press(W.draftB); await press(W.missB, 600);
    await seg(2, 2); await press(W.confirmB);
    await seg(1, 1); await press(W.draftB); await press(W.confirmB); await seg(1, 2); await press(W.draftB); await press(W.confirmB, 600);
  } else if (id === "matrix") {
    await seg(0, 1); await press(W.tellT); await seg(1, 1); await seg(2, 0); await seg(2, 1, 600);
  } else if (id === "levels") {
    await press(W.bornB); await seg(0, 1); await press(W.painT); await press(W.bornB); await seg(1, 1, 600); await seg(0, 2, 600);
  } else if (id === "ladder") {
    await seg(0, 0); await press(W.askB, 1600); await seg(0, 1); await press(W.askB); await press(W.offerB);
    await press(W.treeT); await press(W.offerB, 900);
  } else if (id === "rule") {
    await press(W.plantB); await seg(0, 1); await seg(0, 2); await seg(1, 0); await seg(1, 1); await press(W.plantB);
    await seg(2, 1); await press(W.moveB); await press(W.plantB, 900);
  } else if (id === "expect") {
    await press(W.janB, 2200); await seg(0, 1); await press(W.srcT); await press(W.platT);
    await press(W.janB, 2200); await press(W.worseB, 2200);
  } else out.push("no play written for playground " + id);
  const ticked = qa(".ba-goals li.ok").length;
  if (ticked !== W.goals.length) out.push(ticked + " of " + W.goals.length + " experiments ticked once played: "
    + qa(".ba-goals li:not(.ok)").map(li => "“" + li.textContent.trim() + "”").join(", "));
  const say = q(".lab-say");
  if (!say || !say.textContent.trim()) out.push("nothing says in words what happened");
  const cut = [...(window.BA_MISS || [])];
  if (cut.length) out.push("its picture cuts words short: " + cut.slice(0, 4).map(s => "“" + s + "”").join(", "));
  const c2 = q("canvas");
  if (!c2) out.push("no picture");
  else if (!(c2.getAttribute("aria-label") || "").trim()) out.push("its picture has no words");
  const again = qa(".ba-again").find(b => b.textContent.trim() === U.again);
  if (!again) out.push("no way to start again");
  else {
    again.click(); await wait(100);
    const left = document.getElementById("ba-panel").querySelectorAll(".ba-goals li.ok").length;
    if (left) out.push("starting again leaves " + left + " experiments ticked");
  }
  return out;
},
quiz: async () => {
  const L = window.BA, app = document.getElementById("series-quiz"), wait = ms => new Promise(r => setTimeout(r, ms));
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
