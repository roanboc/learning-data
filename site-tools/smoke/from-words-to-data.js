/* From words to data, and In the weeds of data crafting (site-tools/smoke/in-the-weeds.js is the same file): plays the series'
   one pack of labs and scenarios through, for site-tools/smoke.py's series-learn check, from the pack (window.FW) and each film's
   own words (window.FW_FILM, from assets/from-words-to-data/learn.js), and only by what a visitor can click. A lab must load its
   film's words and picture, get every control tried, twice over, say in words what happened, and label its picture. Every
   scenario must have its picture and take its right answer, and the results must count them all.
   Each returns what went wrong, as text. */
({
lab: async (id) => {
  const P = window.FW, app = document.getElementById("series-labs"), wait = ms => new Promise(r => setTimeout(r, ms)), out = [];
  if (!P.labs.some(x => x.id === id)) return ["no lab " + id + " in the pack"];
  for (let i = 0; i < 100 && !app.querySelector(".stop .lab"); i++) await wait(100);
  const lab = app.querySelector(".stop .lab");
  if (!lab) return ["its lab never drew: " + app.textContent.slice(0, 120)];
  let said = false;
  const heard = () => { const s = lab.querySelector(".lab-say"); if (s && s.textContent.trim()) said = true; };
  const live = () => [...lab.querySelectorAll("button")].filter(b => !b.disabled && b.offsetParent);
  heard();
  for (let round = 0; round < 2; round++)
    for (let i = 0; i < 60; i++) { const b = live()[i]; if (!b) break; b.click(); await wait(15); heard(); }
  for (const c of [...lab.querySelectorAll("input[type=checkbox]")]) { c.click(); await wait(15); heard(); }
  await wait(100);
  if (!lab.querySelector(".lab-say[role=status]")) out.push("nothing on the page says in words what happened");
  else if (!said) out.push("trying every control, it never said in words what happened");
  const cv = lab.querySelector("canvas");
  if (!cv) out.push("it has no picture");
  else if (!(cv.getAttribute("aria-label") || "").trim()) out.push("its picture has no words");
  return out;
},
quiz: async () => {
  const P = window.FW, app = document.getElementById("series-quiz"), wait = ms => new Promise(r => setTimeout(r, ms)), out = [], seen = new Set();
  const shown = async () => { for (let i = 0; i < 100; i++) { if (app.querySelector(".qbody h3, .qdone")) return; await wait(100); } };
  // start from the first scenario, whatever was answered before
  const again = app.querySelector(".qdone .btn"); if (again) again.click();
  const one = app.querySelector(".dots button"); if (one) one.click();
  for (let k = 0; k < P.qs.length + 2; k++) {
    await shown();
    if (app.querySelector(".qdone")) break;
    const hq = P.qs[k], t = (app.querySelector(".qbody h3") || {}).textContent;
    if (!hq) { out.push("more scenarios than in the pack: " + t); break; }
    const F = await window.FW_FILM(hq.film), q = F.words.qs[hq.q];
    if (!q) { out.push("scenario " + hq.n + ": no scenario " + hq.q + " in film " + hq.film + "'s words"); break; }
    if (q.lab !== hq.lab) out.push("scenario " + hq.n + ": its film's words put it on lab " + q.lab + ", the pack on " + hq.lab);
    if (t !== q.title) { out.push("scenario " + hq.n + " isn't the one shown: " + t); break; }
    seen.add(hq.n);
    const cv = app.querySelector(".qvis canvas");
    if (!cv) out.push("scenario " + hq.n + " has no picture");
    else if (!(cv.getAttribute("aria-label") || "").trim()) out.push("scenario " + hq.n + ": its picture has no words");
    if (q.type === "choice") {
      const b = app.querySelectorAll(".qopts .qopt")[q.opts.findIndex(o => o.ok)];
      if (!b) { out.push("scenario " + hq.n + ": no right answer to pick"); break; }
      b.click();
    } else if (q.type === "order") {
      for (let p = 0; p < q.items.length; p++) for (let m = 0; m < 20; m++) {
        const lis = [...app.querySelectorAll(".qorder li")], at = lis.findIndex(li => li.children[1].textContent === q.items[p]);
        if (at <= p) break;
        lis[at].querySelector(".mv button").click(); await wait(5);
      }
      const chk = app.querySelector(".qbody > .btn.primary");
      if (!chk) { out.push("scenario " + hq.n + ": no way to check the order"); break; }
      chk.click();
    } else { out.push("no play for a scenario of type " + q.type); break; }
    await wait(30);
    const fb = app.querySelector(".qfeed");
    if (!fb || !fb.classList.contains("ok")) out.push("scenario " + hq.n + ": its right answer isn't taken as right");
    const nx = app.querySelector(".qfoot .btn.primary");
    if (!nx) { out.push("scenario " + hq.n + ": no way on"); break; }
    nx.click(); await wait(30);
  }
  await shown();
  const ring = app.querySelector(".qdone .ring b");
  if (!ring) out.push("the results never came");
  else if (ring.textContent !== P.qs.length + "/" + P.qs.length) out.push("the results say " + ring.textContent + ", expected " + P.qs.length + "/" + P.qs.length);
  if (seen.size !== P.qs.length) out.push(seen.size + " scenarios played, of " + P.qs.length);
  return out;
}
})
