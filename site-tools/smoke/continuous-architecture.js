/* AI architecture and Continuous architecture (one copy each, the same engine): plays the series' playgrounds and its evaluation through, for site-tools/smoke.py's series-learn check,
   from their words (window.ACA) and only by what a visitor can click. A playground is played until every experiment is ticked, and must
   say in words what happened, draw every word whole (window.ACA_MISS, from learn.js), give its picture words, and start again with
   none ticked. Every scenario must have its picture, the first one too, and take its right answer, and the results must count them
   all. Each returns what went wrong, as text. */
({
lab: async (id) => {
  const L = window.ACA, Lb = L.labs.find(x => x.id === id), W = Lb.w, U = L.ui, panel = document.getElementById("aca-panel");
  const wait = ms => new Promise(r => setTimeout(r, ms)), q = s => panel.querySelector(s), qa = s => [...panel.querySelectorAll(s)];
  const out = [];
  const press = async (t, ms) => {
    const b = qa("button").find(x => x.textContent.trim() === t);
    if (!b) { out.push("no button “" + t + "”"); return; }
    b.click(); await wait(ms || 250);
  };
  const seg = async (row, k, ms) => {
    const g = qa(".aca-row .seg")[row], b = g && g.querySelectorAll("button")[k];
    if (!b) { out.push("no choice " + (k + 1) + " in group " + (row + 1)); return; }
    b.click(); await wait(ms || 250);
  };
  // a button that steps through states: pressed until it says the state wanted
  const step = async (label, state) => {
    const b = qa(".aca-cyc").find(x => x.dataset.cycle === label);
    if (!b) { out.push("no button for “" + label + "”"); return; }
    for (let i = 0; i < 6 && b.dataset.state !== state; i++) { b.click(); await wait(60); }
    if (b.dataset.state !== state) out.push("“" + label + "” never reached " + state);
  };
  const cv = q("canvas");
  if (cv) cv.scrollIntoView({block: "center"});  // a picture plays while it's in view
  await wait(300);
  if (Lb.kind !== "play") out.push("no play for a lab of kind " + Lb.kind);
  else if (id === "far") {
    const T = k => W.tasks.find(t => t.k === k).s;
    await step(T("plan"), "draft"); await step(T("time"), "draft"); await step(T("check"), "verify");
    await press(W.ownT); await press(W.weekB, 600);
  } else if (id === "platform") {
    await press(W.gwT); await press(W.shT);
    for (const e of W.events) await press(e.b, 200);
  } else if (id === "place") {
    const want = {tariffs: "place", export: "never", account: "signin", medical: "tool", notes: "never"};
    for (const x of W.items) await step(x.s, want[x.k]);
    for (const e of W.events) await press(e.b, 200);
  } else if (id === "watcher") {
    await seg(0, 3); await press(W.fixB); await press(W.runB); await seg(0, 2); await press(W.fixB); await seg(0, 0, 600);
  } else if (id === "confirm") {
    await seg(0, 1); await seg(1, 1); await seg(2, 2); await press(W.guessT); await press(W.runB, 600);
  } else if (id === "checks") {
    for (const c of W.checks) await press(c.s, 100);
    for (const c of W.changes) await press(c.b, 300);
  } else if (id === "keep") {
    for (const b of W.beats) if (b.k !== "change") await press(b.s, 100);
    await press(W.runB, 600);
  } else out.push("no play written for playground " + id);
  const ticked = qa(".aca-goals li.ok").length;
  if (ticked !== W.goals.length) out.push(ticked + " of " + W.goals.length + " experiments ticked once played: "
    + qa(".aca-goals li:not(.ok)").map(li => "“" + li.textContent.trim() + "”").join(", "));
  const say = q(".lab-say");
  if (!say || !say.textContent.trim()) out.push("nothing says in words what happened");
  const cut = [...(window.ACA_MISS || [])];
  if (cut.length) out.push("its picture cuts words short: " + cut.slice(0, 4).map(s => "“" + s + "”").join(", "));
  const c2 = q("canvas");
  if (!c2) out.push("no picture");
  else if (!(c2.getAttribute("aria-label") || "").trim()) out.push("its picture has no words");
  const again = qa(".aca-again").find(b => b.textContent.trim() === U.again);
  if (!again) out.push("no way to start again");
  else {
    again.click(); await wait(100);
    const left = document.getElementById("aca-panel").querySelectorAll(".aca-goals li.ok").length;
    if (left) out.push("starting again leaves " + left + " experiments ticked");
  }
  return out;
},
quiz: async () => {
  const L = window.ACA, app = document.getElementById("series-quiz"), wait = ms => new Promise(r => setTimeout(r, ms));
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
    b.click();
    await wait(30);
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
  const cut = [...(window.ACA_MISS || [])];
  if (cut.length) out.push("a scenario's picture cuts words short: " + cut.slice(0, 4).map(s => "“" + s + "”").join(", "));
  return out;
}
})
