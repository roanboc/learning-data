/* The same one, everywhere: plays the series' labs and scenarios through, for site-tools/smoke.py's series-learn check, from their
   words (window.MR) and only by what a visitor can click. A lab gets every control in its picture's panel tried, twice over, then
   each choice of a list and each end of a slider, and must say in words what happened, label its picture, and draw every word
   whole (window.MR_MISS, from learn.js). Every scenario, for all films, must have its picture and take its right answer, and the
   results must count them all and end with the series' last words.
   Each returns what went wrong, as text. */
({
lab: async (id) => {
  const L = window.MR, app = document.getElementById("series-labs"), wait = ms => new Promise(r => setTimeout(r, ms));
  const lab = () => app.querySelector(".mr-lab"), out = [];
  if (!L.labs.some(x => x.id === id)) return ["no lab " + id + " in the words"];
  if (!lab()) return ["its lab never drew"];
  let said = false;
  const heard = () => { const s = lab().querySelector(".mr-say"); if (s && s.textContent.trim()) said = true; };
  const live = () => [...lab().querySelectorAll("button")].filter(b => !b.disabled && b.getAttribute("role") !== "tab" && b.offsetParent);
  heard();
  for (let round = 0; round < 2; round++)
    for (let i = 0; i < 60; i++) { const b = live()[i]; if (!b) break; b.click(); await wait(20); heard(); }
  for (const s of [...lab().querySelectorAll("select")])
    for (let i = 0; i < s.options.length; i++) { s.selectedIndex = i; s.dispatchEvent(new Event("change", { bubbles: true })); await wait(20); heard(); }
  for (const r of [...lab().querySelectorAll("input[type=range]")])
    for (const v of [r.min, r.max, r.min]) {
      r.value = v; r.dispatchEvent(new Event("input", { bubbles: true })); r.dispatchEvent(new Event("change", { bubbles: true }));
      await wait(20); heard();
    }
  await wait(150);
  if (!lab().querySelector(".mr-say[role=status]")) out.push("nothing on the page says in words what happened");
  else if (!said) out.push("trying every control, it never said in words what happened");
  const cv = lab().querySelector("canvas");
  if (!cv) out.push("it has no picture");
  else if (!(cv.getAttribute("aria-label") || "").trim()) out.push("its picture has no words");
  const cut = [...(window.MR_MISS || [])];
  if (cut.length) out.push("its picture cuts words short: " + cut.slice(0, 4).map(s => "“" + s + "”").join(", "));
  return out;
},
quiz: async () => {
  const L = window.MR, U = L.ui, app = document.getElementById("series-quiz"), wait = ms => new Promise(r => setTimeout(r, ms));
  const out = [], seen = new Set();
  // the page opens on the first film with a scenario left; every film's are under "All films", the button with no number
  const all = [...app.querySelectorAll(".mr-films button")].find(b => !b.querySelector("i"));
  if (!all) return ["no way to choose all films"];
  all.click(); await wait(30);
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
