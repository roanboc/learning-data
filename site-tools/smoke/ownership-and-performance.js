/* Leading data people (each of the module's series has a file of these same words, named for it): plays the
   series' decision playgrounds and its evaluation through, for site-tools/smoke.py's series-learn check, from their words
   (window.LDP) and only by what a visitor can click. A playground is played with each set of picks in its w.tries, in turn, until
   every experiment is ticked, and must say in words what happened, draw every word whole (window.LDP_MISS, from the module's
   engine), give its picture words, and start again with none ticked. Every scenario must have its picture and take its right
   answer, and the results must count them all. Each returns what went wrong, as text. */
({
lab: async (id) => {
  const L = window.LDP, Lb = L.labs.find(x => x.id === id), W = Lb.w, U = L.ui, panel = document.getElementById("lp-panel");
  const wait = ms => new Promise(r => setTimeout(r, ms)), q = s => panel.querySelector(s), qa = s => [...panel.querySelectorAll(s)];
  const out = [];
  const cv = q("canvas");
  if (cv) cv.scrollIntoView({block: "center"});  // a picture plays while it's in view
  await wait(400);
  if (Lb.kind !== "weeks") out.push("no play for a lab of kind " + Lb.kind);
  else if (!(W.tries || []).length) out.push("no tries in its words, so nothing was played");
  else for (const t of W.tries) {
    W.choices.forEach((c, i) => {
      const row = qa(".lp-row .seg")[i], b = row && [...row.querySelectorAll("button")].find(x => x.dataset.k === t[c.k]);
      if (!b) out.push("no pick “" + t[c.k] + "” for “" + c.label + "”"); else b.click();
    });
    const run = qa("button").find(x => x.textContent.trim() === W.runB.replace("{n}", String(W.weeks)));
    if (!run) { out.push("no button to play the weeks"); break; }
    run.click(); await wait(W.weeks * 360 + 600);
  }
  const ticked = qa(".lp-goals li.ok").length;
  if (ticked !== W.goals.length) out.push(ticked + " of " + W.goals.length + " experiments ticked once played: "
    + qa(".lp-goals li:not(.ok)").map(li => "“" + li.textContent.trim() + "”").join(", "));
  const say = q(".lab-say");
  if (!say || !say.textContent.trim()) out.push("nothing says in words what happened");
  const cut = [...(window.LDP_MISS || [])];
  if (cut.length) out.push("its picture cuts words short: " + cut.slice(0, 4).map(s => "“" + s + "”").join(", "));
  const c2 = q("canvas");
  if (!c2) out.push("no picture");
  else if (!(c2.getAttribute("aria-label") || "").trim()) out.push("its picture has no words");
  const again = qa(".lp-again").find(b => b.textContent.trim() === U.again);
  if (!again) out.push("no way to start again");
  else {
    again.click(); await wait(100);
    const left = document.getElementById("lp-panel").querySelectorAll(".lp-goals li.ok").length;
    if (left) out.push("starting again leaves " + left + " experiments ticked");
  }
  return out;
},
quiz: async () => {
  const L = window.LDP, app = document.getElementById("series-quiz"), wait = ms => new Promise(r => setTimeout(r, ms));
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
