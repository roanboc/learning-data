/* The map before the data: plays the series' playgrounds and its evaluation through, for site-tools/smoke.py's series-learn check, from their
   words (window.EA) and only by what a visitor can click. A playground is played until every experiment is ticked, and must say in
   words what happened, draw every word whole (window.EA_MISS, from learn.js), give its picture words, and start again with none
   ticked. Every scenario must have its picture and take its right answer, and the results must count them all. Each returns what
   went wrong, as text. */
({
lab: async (id) => {
  const L = window.EA, Lb = L.labs.find(x => x.id === id), W = Lb.w, U = L.ui, panel = document.getElementById("ea-panel");
  const wait = ms => new Promise(r => setTimeout(r, ms)), q = s => panel.querySelector(s), qa = s => [...panel.querySelectorAll(s)];
  const out = [];
  const press = async (t, ms) => {
    const b = qa("button").find(x => x.textContent.trim() === t);
    if (!b) { out.push("no button “" + t + "”"); return; }
    b.click(); await wait(ms || 300);
  };
  const seg = async (row, k, ms) => {
    const g = qa(".ea-row .seg")[row], b = g && g.querySelectorAll("button")[k];
    if (!b) { out.push("no choice " + (k + 1) + " in group " + (row + 1)); return; }
    b.click(); await wait(ms || 300);
  };
  const cv = q("canvas");
  if (cv) cv.scrollIntoView({block: "center"});  // a picture plays while it's in view
  await wait(400);
  if (Lb.kind !== "play") out.push("no play for a lab of kind " + Lb.kind);
  else if (id === "pile") {
    await press(W.weekB); await press(W.weekB); await press(W.weekB); await press(W.askB);
    await seg(0, 1); await press(W.talkT); for (let i = 0; i < 5; i++) await press(W.weekB); await press(W.askB, 600);
  } else if (id === "fit") {
    for (const k of ["meters", "text", "plans", "bill"]) await press(W.offers.find(o => o[0] === k)[1]);
    await seg(0, 1); await press(W.offers.find(o => o[0] === "credits")[1]); await seg(1, 1); await seg(1, 0);
    await press(W.offers.find(o => o[0] === "fast")[1], 600);
  } else if (id === "chain") {
    await seg(0, 0); await seg(1, 1); await seg(1, 0); await seg(0, 1); await seg(1, 1); await seg(0, 2); await seg(1, 2);
    await seg(2, 1); await press(W.checkB, 600);
  } else if (id === "survive") {
    await press(W.changes[0][1]); await press(W.changes[1][1]); await press(W.rwT); await press(W.changes[2][1], 600);
  } else if (id === "first") {
    await press(W.habitB); await press(W.runB, 600); await press(W.ruleB); await press(W.runB, 600);
    await press(W.regT); await press(W.ruleB); await press(W.runB, 1500);
  } else if (id === "cross") {
    await press(W.facts[2][3]); await press(W.openB); await press(W.facts[2][3]);
    for (const f of W.facts.filter(f => f[4])) await press(f[3]); await press(W.openB, 1300);
  } else if (id === "place") {
    await press(W.systems[0][1]); await press(W.systems[0][1]); await seg(0, 1);
    for (const k of ["sheet", "fleet", "billing"]) await press(W.systems.find(x => x[0] === k)[1], 400);
  } else if (id === "walk") {
    await seg(0, 0); await seg(0, 1); await seg(1, 1); for (let i = 0; i < 6; i++) await press(W.downB, 400);
  } else out.push("no play written for playground " + id);
  const ticked = qa(".ea-goals li.ok").length;
  if (ticked !== W.goals.length) out.push(ticked + " of " + W.goals.length + " experiments ticked once played: "
    + qa(".ea-goals li:not(.ok)").map(li => "“" + li.textContent.trim() + "”").join(", "));
  const say = q(".lab-say");
  if (!say || !say.textContent.trim()) out.push("nothing says in words what happened");
  const cut = [...(window.EA_MISS || [])];
  if (cut.length) out.push("its picture cuts words short: " + cut.slice(0, 4).map(s => "“" + s + "”").join(", "));
  const c2 = q("canvas");
  if (!c2) out.push("no picture");
  else if (!(c2.getAttribute("aria-label") || "").trim()) out.push("its picture has no words");
  const again = qa(".ea-again").find(b => b.textContent.trim() === U.again);
  if (!again) out.push("no way to start again");
  else {
    again.click(); await wait(100);
    const left = document.getElementById("ea-panel").querySelectorAll(".ea-goals li.ok").length;
    if (left) out.push("starting again leaves " + left + " experiments ticked");
  }
  return out;
},
quiz: async () => {
  const L = window.EA, app = document.getElementById("series-quiz"), wait = ms => new Promise(r => setTimeout(r, ms));
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
