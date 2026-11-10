/* The map before the data: plays the series' labs and scenarios through, for site-tools/smoke.py's series-learn check, from their
   words (window.EA) and only by what a visitor can click. A lab gets the right answers, with one wrong pick on its first card or
   question where it has one, and must reach its end, say what happened in words (its end only once), draw every word whole
   (window.EA_MISS, from learn.js), and start again. Every scenario must have its picture, the first one too, and get its right
   answer, and the results must count them all.
   Each returns what went wrong, as text. */
({
lab: async (id) => {
  const L = window.EA, Lb = L.labs.find(x => x.id === id), W = Lb.w, U = L.ui, panel = document.getElementById("ea-panel");
  const wait = ms => new Promise(r => setTimeout(r, ms)), q = s => panel.querySelector(s), qa = s => [...panel.querySelectorAll(s)];
  const click = (el, what) => { if (!el) throw new Error("nothing to click: " + what); el.click(); };
  const until = async (f, ms) => { for (let t = 0; t < (ms || 3000) && !f(); t += 50) await wait(50); return f(); };
  const byText = (sel, t) => qa(sel).find(b => b.textContent.trim() === t);
  const out = [];
  if (Lb.kind === "deal") {
    for (let i = 0; i < W.items.length; i++) {
      const it = W.items[i], opts = it.opts || W.buckets;
      if (i === 0) click(q('.ea-opts button[data-k="' + opts.find(o => o[0] !== it.b)[0] + '"]'), "a wrong pick");
      else click(q('.ea-opts button[data-k="' + it.b + '"]'), "card " + (i + 1));
      await wait(20); click(q(".lab-controls .chip-btn.go"), "next, after card " + (i + 1)); await wait(20);
    }
    if (W.off) { const b = qa(".ea-off button"); click(b[0], "switch a system off"); await wait(20);
      if (!q(".lab-say") || !q(".lab-say").textContent.trim()) out.push("switching a system off says nothing"); click(b[0], "switch it back on"); }
  } else if (Lb.kind === "change") {
    for (const c of W.changes) {
      click(q('.ea-change[data-k="' + c.k + '"]'), "change " + c.k); await wait(20);
      for (let k = 0; k < 12 && q(".ea-rename .ea-opts"); k++) {
        const t = q("#ea-rq").textContent, b = W.boxes.find(x => t.includes("“" + x.t + "”") || t.includes("«" + x.t + "»"));
        if (!b) { out.push("a box to rename isn't named in its question: " + t); break; }
        click(q('.ea-rename .ea-opts button[data-k="' + b.to + '"]'), "rename " + b.t); await wait(20);
        const nx = q(".ea-rename .chip-btn.go"); if (nx) { nx.click(); await wait(20); } else break;
      }
    }
  } else if (Lb.kind === "night") {
    click(byText(".lab-controls button", W.habit), "the night as it always goes"); await wait(40);
    const segs = qa(".ea-crews .seg"); click(segs[0].querySelector("[data-k=hill]"), "crew 1"); click(segs[1].querySelector("[data-k=river]"), "crew 2");
    click(byText(".lab-controls button", W.run), "run the night");
    if (!await until(() => q(".ea-facts"), 8000)) out.push("the rule's facts never came after a good night");
    else { qa(".ea-fact").forEach((r, k) => r.querySelector('[data-k="' + W.facts.items[k].b + '"]').click()); click(byText(".ea-area .chip-btn", U.check), "check the facts"); }
  } else if (Lb.kind === "gate") {
    W.facts.forEach((f, i) => { if (f.x || i === 2) q('[data-i="' + i + '"]').click(); });
    click(byText(".lab-controls button", W.open), "open the gate");
  } else if (Lb.kind === "rule") {
    const pick = async (k, what) => { await until(() => q('.ea-step:last-child .ea-opts button[data-k="' + k + '"]:not([disabled])')); click(q('.ea-step:last-child .ea-opts button[data-k="' + k + '"]:not([disabled])'), what); await wait(20); };
    await pick(W.split.opts.find(o => o[0] !== W.split.b)[0], "a wrong owner"); await pick(W.split.b, "the right owner");
    for (const c of W.cards) for (const sl of c.slots) await pick("ok", sl.label);
    await pick(W.fail.b, "where a failing check goes");
    await until(() => byText(".chip-btn", W.gen.plant)); click(byText(".chip-btn", W.gen.plant), "plant a case that must fail");
  } else if (Lb.kind === "walk") {
    for (let li = 0; li < W.layers.length; li++) {
      W.layers[li].items.forEach((it, j) => { if (it.x || (li === 2 && it.trap)) q('.ea-touch [data-j="' + j + '"]').click(); });
      click(byText(".chip-btn", W.next), "check the layer"); await wait(20);
      click(q(".ea-area .lab-controls .chip-btn.go"), "go down a layer"); await wait(20);
    }
  } else if (Lb.kind === "navigator") {
    W.els.forEach((e, i) => { if (e.fail != null) q('.ea-el[data-i="' + i + '"]').click(); });
    click(byText(".chip-btn", W.run), "run the checks"); await wait(20);
    const k = Math.max(0, W.ask.qs.findIndex(x => x.no)), ans = () => (q(".ea-answer") || {}).textContent;
    click(qa(".ea-opts.ask button")[k], "ask before fixing"); await wait(20);
    if (!ans()) out.push("asking before the fixes answers nothing");
    click(byText(".chip-btn", W.fixAll), "fix what fails"); await wait(20);
    const open = W.els.filter(e => e.fail != null && !e.fix).length, flagged = qa(".ea-el.fail").length;
    if (flagged !== open) out.push(flagged + " still flagged after the fixes, where " + open + " has no fix");
    click(qa(".ea-opts.ask button")[k], "ask the agent"); await wait(20);
    if (ans() !== W.ask.qs[k].a) out.push("after the fixes, the agent doesn't give its answer");
  } else out.push("no play for a lab of kind " + Lb.kind);
  await wait(60);
  const end = q(".ea-end"), say = q(".lab-say");
  if (!end) out.push("it never reached its end");
  if (!say || !say.textContent.trim()) out.push("nothing says in words what happened");
  else if (end && !say.classList.contains("sr") && say.textContent.includes(end.textContent.trim())) out.push("its end is said twice, under the picture and in its end box");
  const cut = [...(window.EA_MISS || [])];
  if (cut.length) out.push("its picture cuts words short: " + cut.slice(0, 4).map(s => "“" + s + "”").join(", "));
  const cv = q("canvas");
  if (cv && !(cv.getAttribute("aria-label") || "").trim()) out.push("its picture has no words");
  const again = byText(".chip-btn", U.again);
  if (!again) out.push("no way to start again");
  else { again.click(); await wait(60); if (document.getElementById("ea-panel").querySelector(".ea-end")) out.push("starting again leaves the end on the page"); }
  return out;
},
quiz: async () => {
  const L = window.EA, U = L.ui, app = document.getElementById("series-quiz"), wait = ms => new Promise(r => setTimeout(r, ms));
  const out = [], seen = new Set();
  for (let k = 0; k < L.qs.length + 2; k++) {
    if (app.querySelector(".qdone")) break;
    const t = (app.querySelector(".qbody h3") || {}).textContent, qq = L.qs.find(x => x.title === t);
    if (!qq) { out.push("a scenario that isn't in the words: " + t); break; }
    if (seen.has(qq.n)) { out.push("scenario " + qq.n + " came twice"); break; }
    seen.add(qq.n);
    if (!app.querySelector(".qvis canvas")) out.push("scenario " + qq.n + " has no picture");
    if (qq.type === "choice" || qq.type === "spot") {
      const O = qq.type === "choice" ? qq.opts : qq.lines, j = O.findIndex(o => o.ok), b = app.querySelector('.qopt[data-j="' + j + '"]');
      if (!b) { out.push("scenario " + qq.n + ": no right answer to pick"); break; }
      b.click();
    } else if (qq.type === "order") {
      for (let p = 0; p < qq.items.length; p++) for (let m = 0; m < 20; m++) {
        const lis = [...app.querySelectorAll(".qorder li")], at = lis.findIndex(li => li.children[1].textContent === qq.items[p]);
        if (at <= p) break;
        lis[at].querySelector(".mv button").click(); await wait(5);
      }
      [...app.querySelectorAll(".qbody .btn.primary")].find(b => b.textContent === U.check).click();
    }
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
  return out;
}
})
