/* Only what you may see: plays the series' playgrounds and its evaluation through, for site-tools/smoke.py's series-learn check, from their
   words (window.OS) and only by what a visitor can click. A playground is played until every experiment is ticked, and must say in
   words what happened, draw every word whole (window.OS_MISS, from learn.js), give its picture words, and start again with none
   ticked. Every scenario must have its picture and take its right answer, and the results must count them all. Each returns what
   went wrong, as text. */
({
lab: async (id) => {
  const L = window.OS, Lb = L.labs.find(x => x.id === id), W = Lb.w, U = L.ui, panel = document.getElementById("os-panel");
  const wait = ms => new Promise(r => setTimeout(r, ms)), q = s => panel.querySelector(s), qa = s => [...panel.querySelectorAll(s)];
  const out = [];
  const press = async (t, ms) => {
    const b = qa("button").find(x => x.textContent.trim() === t);
    if (!b) { out.push("no button “" + t + "”"); return; }
    b.click(); await wait(ms || 300);
  };
  const seg = async (row, k, ms) => {
    const g = qa(".os-row .seg")[row], b = g && g.querySelectorAll("button")[k];
    if (!b) { out.push("no choice " + (k + 1) + " in group " + (row + 1)); return; }
    b.click(); await wait(ms || 300);
  };
  const cv = q("canvas");
  if (cv) cv.scrollIntoView({block: "center"});  // a picture plays while it's in view
  await wait(400);
  if (Lb.kind !== "play") out.push("no play for a lab of kind " + Lb.kind);
  else if (id === "agree") {
    await press(W.grantB, 1200); await press(W.elenaB, 1200); await press(W.dsaT); await press(W.grantB, 1200);
    await press(W.namesB, 1200); await press(W.endB, 600);
  } else if (id === "classes") {
    const ORD = ["special", "direct", "pseud", "indirect", "none"];
    for (let i = 0; i < W.cols.length; i++) { await seg(0, i, 200); await seg(1, ORD.indexOf(W.cols[i].right), 200); }
    await press(W.scanB); await press(W.moveB); await press(W.newB, 1000);
  } else if (id === "least") {
    for (let i = 0; i < W.cols.length; i++) {
      await seg(0, i, 200); const c = W.cols[i], g = qa(".os-row .seg")[1], b = g && g.querySelector('button[data-k="' + c.best[0] + '"]');
      if (!b) out.push("no way “" + c.best[0] + "” for " + c.n); else { b.click(); await wait(250); }
    }
    await press(W.pubB); await press(W.moreT); await press(W.pubB);
  } else if (id === "shelves") {
    await press(W.credB, 1200); await seg(0, 1); await press(W.credB, 1400); await press(W.supB, 1400);
    await press(W.leaveB); await seg(1, 1); await press(W.leaveB); await press(W.writeB, 1200); await press(W.roT); await press(W.writeB, 1400);
  } else if (id === "tags") {
    await press(W.buildB); await press(W.dbtT); await press(W.buildB); await press(W.copyB, 600); await press(W.propT); await press(W.copyB, 1400);
    await press(W.codeB); await press(W.srcT); await press(W.codeB); await press(W.fileB, 800); await press(W.dlT); await press(W.fileB, 800);
  } else if (id === "policy") {
    await press(W.newB); await seg(0, 1);
    for (let i = 0; i < W.readers.length; i++) await seg(1, i, 250);
    await press(W.newB, 600); await press(W.nolevelB, 600); await press(W.oldB, 600);
  } else if (id === "copies") {
    for (let i = 0; i < W.asks.length; i++) {
      const q = W.asks[i]; await seg(i, q.choices.findIndex(x => !x.fine), 200); await press(q.go, 1200);
      await seg(i, q.choices.findIndex(x => x.fine), 200); await press(q.go, 1400);
    }
  } else if (id === "proof") {
    await press(W.removeB); await press(W.revB); await press(W.removeB); await press(W.classB); await press(W.checkB); await press(W.classB);
    await press(W.readsB); await press(W.julyB); await press(W.endB); await press(W.julyB);
  } else out.push("no play written for playground " + id);
  const ticked = qa(".os-goals li.ok").length;
  if (ticked !== W.goals.length) out.push(ticked + " of " + W.goals.length + " experiments ticked once played: "
    + qa(".os-goals li:not(.ok)").map(li => "“" + li.textContent.trim() + "”").join(", "));
  const say = q(".lab-say");
  if (!say || !say.textContent.trim()) out.push("nothing says in words what happened");
  const cut = [...(window.OS_MISS || [])];
  if (cut.length) out.push("its picture cuts words short: " + cut.slice(0, 4).map(s => "“" + s + "”").join(", "));
  const c2 = q("canvas");
  if (!c2) out.push("no picture");
  else if (!(c2.getAttribute("aria-label") || "").trim()) out.push("its picture has no words");
  const again = qa(".os-again").find(b => b.textContent.trim() === U.again);
  if (!again) out.push("no way to start again");
  else {
    again.click(); await wait(100);
    const left = document.getElementById("os-panel").querySelectorAll(".os-goals li.ok").length;
    if (left) out.push("starting again leaves " + left + " experiments ticked");
  }
  return out;
},
quiz: async () => {
  const L = window.OS, app = document.getElementById("series-quiz"), wait = ms => new Promise(r => setTimeout(r, ms));
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
