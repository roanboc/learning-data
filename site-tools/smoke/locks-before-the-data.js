/* Locks before the data: plays the series' playgrounds and its evaluation through, for site-tools/smoke.py's series-learn check, from their
   words (window.LK) and only by what a visitor can click. A playground is played until every experiment is ticked, and must say in
   words what happened, draw every word whole (window.LK_MISS, from learn.js), give its picture words, and start again with none
   ticked. Every scenario must have its picture and take its right answer, and the results must count them all. Each returns what
   went wrong, as text. */
({
lab: async (id) => {
  const L = window.LK, Lb = L.labs.find(x => x.id === id), W = Lb.w, U = L.ui, panel = document.getElementById("lk-panel");
  const wait = ms => new Promise(r => setTimeout(r, ms)), q = s => panel.querySelector(s), qa = s => [...panel.querySelectorAll(s)];
  const out = [];
  const press = async (t, ms) => {
    const b = qa("button").find(x => x.textContent.trim() === t);
    if (!b) { out.push("no button “" + t + "”"); return; }
    b.click(); await wait(ms || 300);
  };
  const seg = async (row, k, ms) => {
    const g = qa(".lk-row .seg")[row], b = g && g.querySelectorAll("button")[k];
    if (!b) { out.push("no choice " + (k + 1) + " in group " + (row + 1)); return; }
    b.click(); await wait(ms || 300);
  };
  const cv = q("canvas");
  if (cv) cv.scrollIntoView({block: "center"});  // a picture plays while it's in view
  await wait(400);
  if (Lb.kind !== "play") out.push("no play for a lab of kind " + Lb.kind);
  else if (id === "who") {
    await press(W.movedT); await press(W.loadB, 1400); await press(W.ids[1][1]); await press(W.loadB, 1400); await press(W.thiefB, 1500);
    await press(W.rights[1][1]); await press(W.anaB, 1200); await press(W.leoB); await press(W.agreeT); await press(W.leoB, 1200);
  } else if (id === "ladder") {
    await press(W.thiefB); await press(W.movedB); await press(W.rungs[5].name, 800); await press(W.thiefB); await press(W.movedB);
    await press(W.fakeB); await press(W.ppl[3].name); await press(W.fakeB);
  } else if (id === "walls") {
    await press(W.tries.web, 2000);
    for (const k of ["door", "rooms", "cat", "copies"]) await press(W.locks[k]);
    for (const k of ["web", "stolen", "files", "ransom"]) await press(W.tries[k], 1400);
  } else if (id === "power") {
    await press(W.phishB, 1500); await press(W.wheres[1][1]); await press(W.phishB, 1500);
    await press(W.apprs[1][1]); await press(W.askB); await press(W.apprs[0][1]); await press(W.askB, 400); await press(W.fileB, 1400);
    await wait(2600);
  } else if (id === "groups") {
    await press(W.anaB, 1200); await press(W.whos[1][1]); await press(W.anaB, 1200); await press(W.leoB, 1200);
    await press(W.signs[1][1]); await press(W.fakeB, 1200); await press(W.repB); await press(W.tokT); await press(W.repB);
  } else if (id === "workload") {
    await press(W.loadB, 1200); await press(W.runs[1][1]); await press(W.loadB, 1200); await press(W.deps[1][1]); await press(W.depB, 1200); await press(W.forkB, 1200);
    await press(W.scanT); await press(W.pushB, 1200); await press(W.pwds[1][1]); await press(W.printB, 1200);
  } else if (id === "tank") {
    await press(W.tries.around, 1800);
    for (const k of ["keys", "roles", "pub", "pol", "bind"]) await press(W.locks[k]);
    await press(W.tries.around, 1800); for (const k of ["web", "out", "dev"]) await press(W.tries[k], 1400);
  } else if (id === "gate") {
    await press(W.pushB, 2000); await press(W.rulesT); await press(W.pushB, 1200); await press(W.prB, 2000); await press(W.fixB, 2000);
    await press(W.apprT); await press(W.depB, 3300); await press(W.pinT); await press(W.tagB, 1200);
  } else if (id === "record") {
    await press(W.askB, 1200); await press(W.wheres[1][1]); await press(W.askB, 1200); await press(W.quietB);
    await press(W.bellT); await press(W.nightB); await press(W.copyT); await press(W.restB);
  } else out.push("no play written for playground " + id);
  const ticked = qa(".lk-goals li.ok").length;
  if (ticked !== W.goals.length) out.push(ticked + " of " + W.goals.length + " experiments ticked once played: "
    + qa(".lk-goals li:not(.ok)").map(li => "“" + li.textContent.trim() + "”").join(", "));
  const say = q(".lab-say");
  if (!say || !say.textContent.trim()) out.push("nothing says in words what happened");
  const cut = [...(window.LK_MISS || [])];
  if (cut.length) out.push("its picture cuts words short: " + cut.slice(0, 4).map(s => "“" + s + "”").join(", "));
  const c2 = q("canvas");
  if (!c2) out.push("no picture");
  else if (!(c2.getAttribute("aria-label") || "").trim()) out.push("its picture has no words");
  const again = qa(".lk-again").find(b => b.textContent.trim() === U.again);
  if (!again) out.push("no way to start again");
  else {
    again.click(); await wait(100);
    const left = document.getElementById("lk-panel").querySelectorAll(".lk-goals li.ok").length;
    if (left) out.push("starting again leaves " + left + " experiments ticked");
  }
  return out;
},
quiz: async () => {
  const L = window.LK, app = document.getElementById("series-quiz"), wait = ms => new Promise(r => setTimeout(r, ms));
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
