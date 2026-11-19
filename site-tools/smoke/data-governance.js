/* Governance principles: plays the series' playgrounds and its evaluation through, for site-tools/smoke.py's series-learn check, from their
   words (window.GVL) and only by what a visitor can click. A playground is played until every experiment is ticked, and must say in
   words what happened, draw every word whole (window.GVL_MISS, from learn.js), give its picture words, and start again with none
   ticked. Every scenario must have its picture and take its right answer, and the results must count them all. Each returns what
   went wrong, as text. */
({
lab: async (id) => {
  const L = window.GVL, Lb = L.labs.find(x => x.id === id), W = Lb.w, U = L.ui, panel = document.getElementById("gv-panel");
  const wait = ms => new Promise(r => setTimeout(r, ms)), q = s => panel.querySelector(s), qa = s => [...panel.querySelectorAll(s)];
  const out = [];
  const press = async (t, ms) => {
    const b = qa("button").find(x => x.textContent.trim() === t);
    if (!b) { out.push("no button “" + t + "”"); return; }
    b.click(); await wait(ms || 300);
  };
  const seg = async (row, k, ms) => {
    const g = qa(".gv-row .seg")[row], b = g && g.querySelectorAll("button")[k];
    if (!b) { out.push("no choice " + (k + 1) + " in group " + (row + 1)); return; }
    b.click(); await wait(ms || 300);
  };
  const cv = q("canvas");
  if (cv) cv.scrollIntoView({block: "center"});  // a picture plays while it's in view
  await wait(400);
  if (Lb.kind !== "play") out.push("no play for a lab of kind " + Lb.kind);
  else if (id === "hub") {
    await press(W.namesT); await press(W.ownerT); await seg(0, 1); await press(W.askB, 2400); await press(W.yearB, 2200);
  } else if (id === "shelf") {
    await seg(0, 1); await press(W.ruleT); await press(W.copyT); await press(W.checkT); await press(W.goB, 2800);
  } else if (id === "cord") {
    await seg(0, 1); await press(W.bookT); await press(W.timeT); await press(W.reqT); await press(W.crB, 2300); await press(W.repB, 2200);
  } else if (id === "gloss") {
    await seg(0, 1); for (let k = 1; k <= W.places.length; k++) await seg(k, 1);
    await press(W.checkT); await press(W.monB, 2400);
  } else if (id === "access") {
    await seg(0, 1); await seg(1, 1); await press(W.endT); await press(W.clsT); await seg(2, 1);
    await press(W.grantB, 800); await press(W.moveB); await press(W.decB); await press(W.newB, 1200);
  } else if (id === "level") {
    await press(W.ownT); await seg(0, 1); await seg(1, 0); await press(W.n2B); await press(W.n6B); await press(W.diffB, 1200);
  } else if (id === "source") {
    await press(W.formT); await press(W.oldT); await press(W.cleanT); await press(W.checkT); await press(W.watchT);
    await press(W.weekB, 2800); await press(W.breakB, 1500); await press(W.badgeB, 1500);
  } else if (id === "change") {
    await seg(0, 1); await press(W.recT); await press(W.tellT); await seg(1, 1); await press(W.goB, 2400);
  } else if (id === "product") {
    await press(W.ownerT); await press(W.slaT); await press(W.catT); await seg(0, 1); await press(W.oneT);
    await press(W.lateB, 2600); await press(W.findB, 1500); await press(W.newB, 1500);
  } else if (id === "agent") {
    await seg(0, 1); await press(W.listT); await press(W.ownT); await press(W.goB, 3000);
  } else if (id === "habit") {
    await press(W.whyT); await press(W.agreeT); await press(W.pageT); await press(W.hoursT); await seg(0, 1);
    await press(W.goB, 3600); await press(W.keepT); await press(W.yearB, 1800);
  } else out.push("no play written for playground " + id);
  const ticked = qa(".gv-goals li.ok").length;
  if (ticked !== W.goals.length) out.push(ticked + " of " + W.goals.length + " experiments ticked once played: "
    + qa(".gv-goals li:not(.ok)").map(li => "“" + li.textContent.trim() + "”").join(", "));
  const say = q(".lab-say");
  if (!say || !say.textContent.trim()) out.push("nothing says in words what happened");
  const cut = [...(window.GVL_MISS || [])];
  if (cut.length) out.push("its picture cuts words short: " + cut.slice(0, 4).map(s => "“" + s + "”").join(", "));
  const c2 = q("canvas");
  if (!c2) out.push("no picture");
  else if (!(c2.getAttribute("aria-label") || "").trim()) out.push("its picture has no words");
  const again = qa(".gv-again").find(b => b.textContent.trim() === U.again);
  if (!again) out.push("no way to start again");
  else {
    again.click(); await wait(100);
    const left = document.getElementById("gv-panel").querySelectorAll(".gv-goals li.ok").length;
    if (left) out.push("starting again leaves " + left + " experiments ticked");
  }
  return out;
},
quiz: async () => {
  const L = window.GVL, app = document.getElementById("series-quiz"), wait = ms => new Promise(r => setTimeout(r, ms));
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
