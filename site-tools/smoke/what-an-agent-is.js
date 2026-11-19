/* What an agent is: plays the series' playgrounds and its evaluation through, for site-tools/smoke.py's series-learn check, from
   their words (window.AGL) and only by what a visitor can click. A playground is played until every experiment is ticked, and must
   say in words what happened, draw every word whole (window.AGL_MISS, from learn.js), give its picture words, and start again with
   none ticked. Every scenario must have its picture and take its right answer, and the results must count them all. Each returns
   what went wrong, as text. Agents at work on data and From helper to colleague play theirs with the same steps (PLAYS below). */
({
lab: async (id) => {
  const L = window.AGL, Lb = L.labs.find(x => x.id === id), W = Lb.w, U = L.ui, panel = document.getElementById("ag-panel");
  const wait = ms => new Promise(r => setTimeout(r, ms)), q = s => panel.querySelector(s), qa = s => [...panel.querySelectorAll(s)];
  const out = [];
  const press = async (t, ms) => {
    const b = qa("button").find(x => x.textContent.trim() === t);
    if (!b) { out.push("no button “" + t + "”"); return; }
    b.click(); await wait(ms || 300);
  };
  const seg = async (row, k, ms) => {
    const g = qa(".ag-row .seg")[row], b = g && g.querySelectorAll("button")[k];
    if (!b) { out.push("no choice " + (k + 1) + " in group " + (row + 1)); return; }
    b.click(); await wait(ms || 300);
  };
  const cv = q("canvas");
  if (cv) cv.scrollIntoView({block: "center"});  // a picture plays while it's in view
  await wait(400);
  const PLAYS = {
    waited: async () => {
      await press(W.trainB, 1800);
      await seg(0, 2); await press(W.needs.power); await press(W.needs.data); await press(W.trainB, 1800);
      await seg(0, 5); await press(W.needs.money); await press(W.trainB, 1800);
      await press(W.needs.power); await press(W.trainB, 1800);
    },
    wheel: async () => {
      await press(W.spinTen); await seg(0, 0); await press(W.spinTen); await seg(0, 2); await press(W.spinTen); await press(W.spinTen);
      await seg(1, 3); await press(W.mondayB);
    },
    parts: async () => {
      await press(W.askB, 800); await press(W.parts.hands); await press(W.askB, 1800);
      await press(W.parts.reason); await press(W.parts.loop); await press(W.askB, 3400);
      await seg(0, 1); await press(W.marchB);
    },
    unit: async () => {
      await press(W.askB); await press(W.backT); await press(W.askB);
      await press(W.backT); await seg(1, 1); await press(W.askB);
    },
    junior: async () => {
      await press(W.pathB); await press(W.fixB); await press(W.nextB);
      await seg(1, 1); await press(W.nextB); await seg(0, 1); await seg(2, 1); await press(W.speedB);
    },
    minds: async () => {
      await press(W.askB); await press(W.askB); await press(W.sureB); await press(W.askB); await press(W.askB);
      await press(W.evT); await press(W.checkB); await press(W.twoT); await press(W.checkB); await press(W.fixB); await press(W.signB);
    },
    night: async () => {
      await press(W.nightB, 2100); await seg(1, 1); await press(W.compareB);
      await seg(2, 1); await seg(0, 1); await seg(3, 1); await press(W.nightB, 2100);
    },
    colleague: async () => {
      for (const k of ["owner", "name", "limits", "review"]) await press(W.rules[k]);
      for (const k of ["moves", "who", "stop", "change"]) await press(W.evB[k]);
    },
    copy9: async () => {
      await press(W.buildB); await seg(0, 1); await press(W.buildB);
      await press(W.makeB); await seg(1, 1); await press(W.makeB); await seg(1, 2); await press(W.makeB);
      await seg(3, 1); await press(W.handB);
    },
    swarm: async () => {
      await press(W.runB, 3900); await seg(0, 0); await press(W.runB, 3900); await seg(0, 2); await seg(2, 1); await press(W.runB, 3900);
      await press(W.copyT); await press(W.checkT); await press(W.pinB);
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
