/* Model the business: plays the series' playgrounds and its evaluation through, for site-tools/smoke.py's series-learn check, from their
   words (window.WD) and only by what a visitor can click. A playground is played until every experiment is ticked, and must say in
   words what happened, draw every word whole (window.WD_MISS, from learn.js), give its picture words, and start again with none
   ticked. Every scenario must have its picture and take its right answer, and the results must count them all. Each returns what
   went wrong, as text. */
({
lab: async (id) => {
  const L = window.WD, Lb = L.labs.find(x => x.id === id), W = Lb.w, U = L.ui, panel = document.getElementById("pg-panel");
  const wait = ms => new Promise(r => setTimeout(r, ms)), q = s => panel.querySelector(s), qa = s => [...panel.querySelectorAll(s)];
  const out = [];
  const press = async (t, ms) => {
    const b = qa("button").find(x => x.textContent.trim() === t);
    if (!b) { out.push("no button “" + t + "”"); return; }
    b.click(); await wait(ms || 300);
  };
  const cv = q("canvas");
  if (cv) cv.scrollIntoView({block: "center"});  // a picture plays while it's in view
  await wait(400);
  if (Lb.kind !== "play") out.push("no play for a lab of kind " + Lb.kind);
  else if (id === "place") {
    await press(W.askB); await press(W.layers[1][1]); await press(W.layers[2][1]); await press(W.askB, 1600);
    await press(W.fixB, 2600);
    await press(W.fixes[1][1]); await press(W.fixB, 2600);
    await press(W.lookB); await press(W.layers[3][1]); await press(W.lookB, 900);
    await press(W.layers[0][1]); await press(W.creators[1][1], 900); await press(W.creators[0][1]);
  } else if (id === "sharpen") {
    await press(W.refB, 500); await press(W.recB);  // the reference first: question marks, and nothing to record yet
    await press(W.grains[1][1], 900); await press(W.dates[1][1], 900); await press(W.joins[1][1], 900); await press(W.whens[1][1], 1200);
    await press(W.recB, 900);
  } else if (id === "choose") {
    await press(W.noteB);  // nothing picked yet: it asks for a pick first
    for (let i = 0; i < W.sits.length; i++) {  // each situation: a weaker start first, then the best
      const best = W.cands.find(c => c.k === W.sits[i].best), weak = W.cands.find(c => c.k !== W.sits[i].best);
      await press(String(i + 1), 400); await press(weak.n, 500); await press(best.n, 600);
    }
    await press(W.noteB, 700);
  } else if (id === "where") {
    const put = async (d, L) => { await press(d.l, 200); await press(W.levels[L], 900); };
    const low = W.details.find(d => d.lv === "cls");
    await put(low, "offer");  // too high: one offering, two tutorials' values
    for (const d of W.details) if (d.lv !== "cls" || d === low) await put(d, d.lv);  // each where it belongs
  } else if (id === "time") {
    const r = q('input[type="range"]');
    const slide = async (v, ms) => {  // as a visitor drags the slider to a day and lets go
      r.value = String(v); r.dispatchEvent(new Event("input", {bubbles: true})); r.dispatchEvent(new Event("change", {bubbles: true})); await wait(ms || 400);
    };
    if (!r) out.push("no slider to ask about a day");
    await press(W.cenB, 900);  // only the status now: census date comes out as today
    await press(W.models[1][1], 900); await press(W.cenB, 900); await press(W.nowB, 900);
    for (let d = 0; r && d <= +r.max && qa(".pg-goals li.ok").length < W.goals.length; d++) await slide(d, 60);  // a day when 8 were enrolled
  } else out.push("no play written for playground " + id);
  const ticked = qa(".pg-goals li.ok").length;
  if (ticked !== W.goals.length) out.push(ticked + " of " + W.goals.length + " experiments ticked once played: "
    + qa(".pg-goals li:not(.ok)").map(li => "“" + li.textContent.trim() + "”").join(", "));
  const say = q(".lab-say");
  if (!say || !say.textContent.trim()) out.push("nothing says in words what happened");
  const cut = [...(window.WD_MISS || [])];
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
  const L = window.WD, app = document.getElementById("series-quiz"), wait = ms => new Promise(r => setTimeout(r, ms));
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
