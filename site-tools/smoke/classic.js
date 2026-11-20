/* The classic lab kinds (site/assets/learn/classic.js): plays whichever is open on a series' labs page through, by what a visitor
   can click, for site-tools/smoke.py's series-learn check, which runs this in place of the series' own play script when the lab
   open is a classic one. Returns what went wrong, as text. */
({
lab: async (id) => {
  const box = document.querySelector("#series-labs .lc-lab"), out = [];
  if (!box) return ["no classic lab drawn"];
  const wait = ms => new Promise(r => setTimeout(r, ms)), say = () => (box.querySelector(".lab-say") || {}).textContent || "";
  const kind = box.dataset.kind;
  if (!say().trim()) out.push(kind + ": says nothing before it's touched");
  if (kind === "count") {
    const ins = [...box.querySelectorAll(".lc-toggles input")];
    if (!ins.length) out.push("count: no items to tick");
    for (const i of ins) { i.click(); await wait(40); }
    if (!(box.querySelector(".lc-total b") || {}).textContent) out.push("count: no total");
  } else if (kind === "compose") {
    const rows = [...box.querySelectorAll(".lc-slot .seg")];
    if (!rows.length) out.push("compose: no parts to choose");
    for (const g of rows) { const bs = g.querySelectorAll("button"); bs[0].click(); await wait(40); }
    if (box.querySelector(".lc-sentence .gap")) out.push("compose: the sentence still has a gap with every part chosen");
    if (box.querySelectorAll(".lc-list li").length !== rows.length) out.push("compose: not every part says why");
  } else if (kind === "pick") {
    const bs = [...box.querySelectorAll(".lab-controls .seg button")];
    if (bs.length < 2) out.push("pick: fewer than two options");
    const seen = new Set();
    for (const b of bs) { b.click(); await wait(40); seen.add(say()); }
    if (seen.size < bs.length) out.push("pick: two options say the same");
  } else if (kind === "sort") {
    const rows = [...box.querySelectorAll(".lc-row")];
    for (const r of rows) { r.querySelector(".seg button").click(); await wait(20); }
    const go = [...box.querySelectorAll("button")].find(b => b.classList.contains("go"));
    if (!go || go.disabled) out.push("sort: Check stays off with every item placed");
    else { go.click(); await wait(60); if (box.querySelectorAll(".lc-why").length !== rows.length) out.push("sort: not every item says why once checked"); }
  } else if (kind === "steps") {
    const next = [...box.querySelectorAll("button")].find(b => b.classList.contains("go")), n = box.querySelectorAll(".lc-steps li").length;
    for (let i = 1; i < n; i++) { next.click(); await wait(20); }
    if (!next.disabled) out.push("steps: Next step still on at the last step");
  } else out.push("a classic lab of kind " + kind + ", which this script doesn't play");
  if (!say().trim()) out.push(kind + ": says nothing once played");
  return out;
},
})
