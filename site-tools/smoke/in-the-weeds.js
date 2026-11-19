/* In the weeds of data crafting: plays the series' playgrounds and its evaluation through, for site-tools/smoke.py's series-learn check, from their
   words (window.IW) and only by what a visitor can click. A playground is played until every experiment is ticked, and must say in
   words what happened, draw every word whole (window.IW_MISS, from learn.js), give its picture words, and start again with none
   ticked. Every scenario must have its picture and take its right answer, and the results must count them all. Each returns what
   went wrong, as text. */
({
lab: async (id) => {
  const L = window.IW, Lb = L.labs.find(x => x.id === id), W = Lb.w, U = L.ui, panel = document.getElementById("pg-panel");
  const wait = ms => new Promise(r => setTimeout(r, ms)), q = s => panel.querySelector(s), qa = s => [...panel.querySelectorAll(s)];
  const out = [];
  const press = async (t, ms) => {
    const b = qa("button").find(x => x.textContent.trim() === t);
    if (!b) { out.push("no button “" + t + "”"); return; }
    b.click(); await wait(ms || 300);
  };
  const seg = async (row, k, ms) => {
    const g = qa(".pg-row .seg")[row], b = g && g.querySelectorAll("button")[k];
    if (!b) { out.push("no choice " + (k + 1) + " in group " + (row + 1)); return; }
    b.click(); await wait(ms || 300);
  };
  const cv = q("canvas");
  if (cv) cv.scrollIntoView({block: "center"});  // a picture plays while it's in view
  await wait(400);
  if (Lb.kind !== "play") out.push("no play for a lab of kind " + Lb.kind);
  else if (id === "blueprint") {
    await press(W.tools[1].n); await press(W.bugT); await press(W.declT);
    await press(W.draftB); await press(W.approveB);
  } else if (id === "scope") {
    await press(W.terms[2].n); await press(W.terms[3].n); await press(W.terms[4].n); await press(W.terms[4].n);
    await press(W.kinds[1][1]); await press(W.whos[1][1]);
  } else if (id === "same") {
    await press(W.normT); await press(W.r3T); await press(W.r2T); await press(W.apartT);
    await press(W.hashes[1][1]); await press(W.spaceT);
  } else if (id === "grain") {
    await press(W.joins[1][1]); await press(W.joins[0][1]); await press(W.days[1][1]); await press(W.bys[1][1]);
  } else if (id === "catch") {
    for (const b of W.bad) await press(b.test, 150);
    await press(W.txtT); await press(W.enfT); await press(W.walks[1][1]); await press(W.walks[2][1]);
  } else if (id === "once") {
    await press(W.matches[1][1]); await press(W.ons[1][1]);
    await press(W.runB); await press(W.runB); await press(W.ruleT); await press(W.runB); await press(W.fullB, 600);
  } else if (id === "access") {
    await press(W.ons[1][1]); await press(W.ons[2][1]); await press(W.grantT); await press(W.hashes[1][1]);
  } else if (id === "review") {
    await press(W.does[1][1]); await press(W.does[2][1]); await press(W.queryT); await press(W.diffs[1][1]); await press(W.ases[1][1]);
  } else if (id === "home") {
    await press(W.editB); await press(W.kepts[1][1]); await press(W.editB); await press(W.vers[1][1]); await press(W.whoB);
  } else if (id === "finance") {
    await press(W.closeB); await press(W.counts[1][1]); await press(W.closeB); await press(W.diffB); await press(W.moveB, 600);
  } else out.push("no play written for playground " + id);
  const ticked = qa(".pg-goals li.ok").length;
  if (ticked !== W.goals.length) out.push(ticked + " of " + W.goals.length + " experiments ticked once played: "
    + qa(".pg-goals li:not(.ok)").map(li => "“" + li.textContent.trim() + "”").join(", "));
  const say = q(".lab-say");
  if (!say || !say.textContent.trim()) out.push("nothing says in words what happened");
  const cut = [...(window.IW_MISS || [])];
  if (cut.length) out.push("its picture cuts words short: " + cut.slice(0, 4).map(s => "“" + s + "”").join(", "));
  const c2 = q("canvas");
  if (!c2) out.push("no picture");
  else if (!(c2.getAttribute("aria-label") || "").trim()) out.push("its picture has no words");
  const again = qa(".pg-again").find(b => b.textContent.trim() === U.again);
  if (!again) out.push("no way to start again");
  else {
    again.click(); await wait(100);
    const left = document.getElementById("pg-panel").querySelectorAll(".pg-goals li.ok").length;
    if (left) out.push("starting again leaves " + left + " experiments ticked");
  }
  return out;
},
quiz: async () => {
  const L = window.IW, app = document.getElementById("series-quiz"), wait = ms => new Promise(r => setTimeout(r, ms));
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
