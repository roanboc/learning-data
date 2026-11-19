/* Governance on the map: plays the series' playgrounds and its evaluation through, for site-tools/smoke.py's series-learn check,
   from their words (window.MR) and only by what a visitor can click. A playground is played until every experiment is ticked, and
   must say in words what happened, label its picture, draw every word whole (window.MR_MISS, from learn.js), and start again with
   none ticked. Every scenario, for all films, must have its picture and take its right answer, and the results must count them all
   and end with the series' last words.
   Each returns what went wrong, as text. */
({
lab: async (id) => {
  const L = window.MR, U = L.ui, app = document.getElementById("series-labs"), wait = ms => new Promise(r => setTimeout(r, ms));
  const lab = () => app.querySelector(".mr-lab"), out = [];
  const Lb = L.labs.find(x => x.id === id);
  if (!Lb) return ["no lab " + id + " in the words"];
  if (!lab()) return ["its lab never drew"];
  const W = Lb.w;
  const press = async (t, ms) => {
    const b = [...lab().querySelectorAll("button")].find(x => x.textContent.trim() === t);
    if (!b) { out.push("no button “" + t + "”"); return; }
    b.click(); await wait(ms || 60);
  };
  const cv0 = lab().querySelector("canvas");
  if (cv0) cv0.scrollIntoView({block: "center"});
  await wait(200);
  if (Lb.kind !== "play") out.push("no play for a lab of kind " + Lb.kind);
  else if (id === "kept_up") { await press(W.tops[2][1]); for (const t of [W.heatT, W.juneB, W.reorgB, W.moneyB]) await press(t); }
  else if (id === "end_to_end") { await press(W.names[1][1]); await press(W.pubs[1][1]); await press(W.askB); await press(W.leaveB); }
  else if (id === "one_home") {
    await press(W.moveB); await press(W.pages[1][1]); await press(W.askB); await press(W.checkT); await press(W.typeB); await press(W.samB);
  } else out.push("no play written for playground " + id);
  await wait(150);
  const ticked = lab().querySelectorAll(".mr-goals li.ok").length;
  if (ticked !== W.goals.length) out.push(ticked + " of " + W.goals.length + " experiments ticked once played: "
    + [...lab().querySelectorAll(".mr-goals li:not(.ok)")].map(li => "“" + li.textContent.trim() + "”").join(", "));
  const say = lab().querySelector(".mr-say[role=status]");
  if (!say || !say.textContent.trim()) out.push("nothing says in words what happened");
  const cv = lab().querySelector("canvas");
  if (!cv) out.push("it has no picture");
  else if (!(cv.getAttribute("aria-label") || "").trim()) out.push("its picture has no words");
  const cut = [...(window.MR_MISS || [])];
  if (cut.length) out.push("its picture cuts words short: " + cut.slice(0, 4).map(s => "“" + s + "”").join(", "));
  const again = [...lab().querySelectorAll(".mr-again")].find(b => b.textContent.trim() === U.again);
  if (!again) out.push("no way to start again");
  else { again.click(); await wait(80); const left = lab().querySelectorAll(".mr-goals li.ok").length; if (left) out.push("starting again leaves " + left + " experiments ticked"); }
  return out;
},
quiz: async () => {
  const L = window.MR, U = L.ui, app = document.getElementById("series-quiz"), wait = ms => new Promise(r => setTimeout(r, ms));
  const out = [], seen = new Set();
  // one list of every scenario of the series, numbered 1 to N, with no film level above it; a fresh page opens on the first
  if (app.querySelector(".mr-films, .gp-films, select")) return ["the scenarios are split by film again"];
  if (app.querySelectorAll(".dots button").length !== L.qs.length) return ["the scenarios show " + app.querySelectorAll(".dots button").length + " of " + L.qs.length + " in one list"];
  for (let k = 0; k < L.qs.length + 2; k++) {
    if (app.querySelector(".qdone")) break;
    const q = L.qs[k], t = (app.querySelector(".qbody h3") || {}).textContent;
    if (!q) { out.push("more scenarios than in the words: " + t); break; }
    if (t !== q.title) { out.push("scenario " + q.n + " isn't the one shown: " + t); break; }
    seen.add(q.n);
    const cv = app.querySelector(".qvis canvas");
    if (!cv) out.push("scenario " + q.n + " has no picture");
    else if (!(cv.getAttribute("aria-label") || "").trim()) out.push("scenario " + q.n + ": its picture has no words");
    if (q.type === "choice") {
      const b = app.querySelectorAll(".qopts .qopt")[q.opts.findIndex(o => o.ok)];
      if (!b) { out.push("scenario " + q.n + ": no right answer to pick"); break; }
      b.click();
    } else if (q.type === "order") {
      for (let p = 0; p < q.items.length; p++) for (let m = 0; m < 20; m++) {
        const lis = [...app.querySelectorAll(".qorder li")], at = lis.findIndex(li => li.children[1].textContent === q.items[p]);
        if (at <= p) break;
        lis[at].querySelector(".mv button").click(); await wait(5);
      }
      const chk = [...app.querySelectorAll(".qbody .btn.primary")].find(b => b.textContent === U.check);
      if (!chk) { out.push("scenario " + q.n + ": no way to check the order"); break; }
      chk.click();
    } else { out.push("no play for a scenario of type " + q.type); break; }
    await wait(30);
    const fb = app.querySelector(".qfeed");
    if (!fb || !fb.classList.contains("ok")) out.push("scenario " + q.n + ": its right answer isn't taken as right");
    const nx = app.querySelector(".qfoot .btn.primary");
    if (!nx) { out.push("scenario " + q.n + ": no way on"); break; }
    nx.click(); await wait(30);
  }
  const ring = app.querySelector(".qdone .ring b");
  if (!ring) out.push("the results never came");
  else if (ring.textContent !== L.qs.length + "/" + L.qs.length) out.push("the results say " + ring.textContent + ", expected " + L.qs.length + "/" + L.qs.length);
  if (seen.size !== L.qs.length) out.push(seen.size + " scenarios played, of " + L.qs.length);
  if (L.close && !app.querySelector(".qdone .mr-close")) out.push("the results for all films don't end with the series' last words");
  const cut = [...(window.MR_MISS || [])];
  if (cut.length) out.push("a scenario's picture cuts words short: " + cut.slice(0, 4).map(s => "“" + s + "”").join(", "));
  return out;
}
})
