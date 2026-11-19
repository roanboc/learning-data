/* Agents at work on data: plays the series' playgrounds and its evaluation through, for site-tools/smoke.py's series-learn check,
   from their words (window.AGL) and only by what a visitor can click. Every playground here is a machine (learn.js): rows of choices
   (data-set, each choice's data-k) and situations to play (data-run). A playground is played until every experiment is ticked, and
   must say in words what happened, draw every word whole (window.AGL_MISS, from learn.js), give its picture words, and start again
   with none ticked. Every scenario must have its picture and take its right answer, and the results must count them all. Each
   returns what went wrong, as text. */
({
lab: async (id) => {
  const L = window.AGL, Lb = L.labs.find(x => x.id === id), W = Lb.w, U = L.ui, panel = document.getElementById("ag-panel");
  const wait = ms => new Promise(r => setTimeout(r, ms)), q = s => panel.querySelector(s), qa = s => [...panel.querySelectorAll(s)];
  const out = [];
  const set = async (k, v) => {
    const b = q('[data-set="' + k + '"] button[data-k="' + v + '"]');
    if (!b) { out.push("no choice “" + v + "” for “" + k + "”"); return; }
    b.click(); await wait(150);
  };
  const run = async (k, ms) => {
    const b = q('button[data-run="' + k + '"]');
    if (!b) { out.push("no situation “" + k + "” to play"); return; }
    b.click(); await wait(ms || 1300);
  };
  const cv = q("canvas");
  if (cv) cv.scrollIntoView({block: "center"});  // a picture plays while it's in view
  await wait(400);
  // each: the settings and the situations, in the order a visitor would try them
  const PLAYS = {
    context: async () => {
      await run("jun"); await set("rule", "ask"); await run("jun");
      await set("gloss", "page"); await run("jun"); await run("new", 2600);
    },
    skill: async () => {
      await set("flow", "wf"); await run("agree"); await set("skill", "skill"); await run("known"); await run("odd");
      await run("new", 2600); await run("add"); await run("new", 2400);
    },
    hands: async () => {
      await run("ticket", 2600); await set("rows", "masked"); await run("ticket");
      await set("repo", "branch"); await run("change", 2600); await set("ident", "own"); await run("audit", 2000);
    },
    memory: async () => {
      await run("april", 2000); await run("june", 2000); await set("where", "team"); await run("april", 2000); await run("june", 2000);
      await run("plant", 1600); await run("june", 2000); await set("review", "person"); await run("plant", 2400);
    },
    check: async () => {
      await run("run", 2000); await set("tools", "named"); await run("run", 2000); await set("sum", "sum"); await run("run", 2000);
      await set("lock", "people"); await run("run", 2400); await run("mei", 2600);
    },
    wrong: async () => {
      for (const f of ["column", "number", "test", "loop", "simple"]) { await set("fail", f); await set("design", "on"); await run("go", 2000); }
    },
    place: async () => {
      await run("ask", 2000); await run("plan", 1600);
      await set("a1", "gov"); await set("a2", "gov"); await set("a3", "gov"); await run("ask", 2000); await run("delete", 1800);
    },
    gate: async () => {
      await run("night", 2000); await set("ident", "sp"); await set("model", "gw"); await run("night", 2000);
      await run("email", 2000); await run("stop", 1800);
    },
    order: async () => {
      await run("ask", 2000); await set("order", "gov"); await run("ask", 2000); await run("chat", 1600); await run("line", 1800);
    }
  };
  if (Lb.kind !== "play") out.push("no play for a lab of kind " + Lb.kind);
  else if (PLAYS[id]) await PLAYS[id]();
  else out.push("no play written for playground " + id);
  const ticked = qa(".ag-goals li.ok").length;
  if (ticked !== W.goals.length) out.push(ticked + " of " + W.goals.length + " experiments ticked once played: "
    + qa(".ag-goals li:not(.ok)").map(li => "“" + li.textContent.trim() + "”").join(", "));
  const say = q(".lab-say");
  if (!say || !say.textContent.trim()) out.push("nothing says in words what happened");
  const cut = [...(window.AGL_MISS || [])];
  if (cut.length) out.push("its picture cuts words short: " + cut.slice(0, 4).map(s => "“" + s + "”").join(", "));
  const c2 = q("canvas");
  if (!c2) out.push("no picture");
  else if (!(c2.getAttribute("aria-label") || "").trim()) out.push("its picture has no words");
  const again = qa(".ag-again").find(b => b.textContent.trim() === U.again);
  if (!again) out.push("no way to start again");
  else {
    again.click(); await wait(100);
    const left = document.getElementById("ag-panel").querySelectorAll(".ag-goals li.ok").length;
    if (left) out.push("starting again leaves " + left + " experiments ticked");
  }
  return out;
},
quiz: async () => {
  const L = window.AGL, app = document.getElementById("series-quiz"), wait = ms => new Promise(r => setTimeout(r, ms));
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
