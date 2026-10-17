"""The review page of a film of this series, on watercolour paper: run from the repository's root,

    python films/master-and-reference-data/shared/tools/review_page.py <film folder> [--pr N] [--note "..."]... [--new 2,3] [--name <file>.mp4]

It runs site-tools/review_page.py, which makes the 720p copy, captions.json, the poster and the page in the film's source/dist/review/,
then writes the page again in the series' look, with the same parts: the film, a button per chapter (those in --new marked "new"),
captions in each language, what changed (--note) and the pull request. Publish it as that tool prints, one page per film; a later
version of the film goes to the same link, with its copy under a new --name, so no browser plays the old one from its cache."""
import argparse, html, json, pathlib, re, subprocess, sys

ROOT = pathlib.Path(__file__).resolve().parents[4]
LANGS = {'en': 'English', 'es': 'Español'}  # each button in its own language
NAMES = {'en': 'English', 'es': 'Spanish'}  # the page's own words are English
ap = argparse.ArgumentParser(description=__doc__)
ap.add_argument('film', help='the film folder, such as films/master-and-reference-data/1-one-person-many-roles')
ap.add_argument('--video', help='the rendered film (default: source/dist/<key>.mp4)')
ap.add_argument('--pr', type=int, help='the pull request the author approves')
ap.add_argument('--note', action='append', default=[], help='one line on what changed in this version (repeat for more)')
ap.add_argument('--poster-at', type=float, help='the moment the poster shows, in seconds (default: the title card)')
ap.add_argument('--new', default='', help='the chapters new in this version, such as 2,3,12')
ap.add_argument('--name', help='the copy\'s file name on the page (default: <key>-720p.mp4)')
A = ap.parse_args()

# the copy, the captions and the poster, made as for every other film
cmd = [sys.executable, str(ROOT / 'site-tools' / 'review_page.py'), A.film] + (['--video', A.video] if A.video else []) + \
      (['--pr', str(A.pr)] if A.pr else []) + (['--poster-at', str(A.poster_at)] if A.poster_at is not None else [])
for n in A.note:
    cmd += ['--note', n]
made = subprocess.run(cmd, check=True, stdout=subprocess.PIPE, text=True).stdout
print(''.join(l + '\n' for l in made.splitlines() if 'an artifact takes' in l), end='')  # its warning if the copy is too big

film = pathlib.Path(A.film).resolve()
meta = json.loads((film / 'source' / 'film.json').read_text())
series = json.loads((film.parent / 'series.json').read_text())
script = (film / 'script.md').read_text()
out = film / 'source' / 'dist' / 'review'
mp4 = out / (meta['key'] + '-720p.mp4')
if A.name and A.name != mp4.name:
    mp4 = mp4.replace(out / A.name)
num = re.match(r'(\d+)-', film.name)
eyebrow = series['title'] + (' · Film %s of %s' % (num.group(1), series['planned']) if num and series.get('planned') else '')
chapters = re.findall(r'^### (\d+) · (.+?) · (\d+:\d\d)–(\d+:\d\d)\s*$', script, re.M)
new = [int(n) for n in A.new.split(',') if n.strip()]
caps = list(json.loads((out / 'captions.json').read_text(encoding='utf-8')))
pr = ''
if A.pr:
    url = subprocess.run(['git', 'remote', 'get-url', 'origin'], capture_output=True, text=True, cwd=film).stdout.strip()
    slug = '/'.join(re.sub(r'\.git$', '', url).rstrip('/').split('/')[-2:]) or 'roanboc/learning-data'
    pr = 'https://github.com/%s/pull/%d' % (slug, A.pr)

e = html.escape
names = [NAMES.get(k, k.upper()) for k in caps]
langs_txt = ' and '.join([', '.join(names[:-1]), names[-1]] if len(names) > 1 else names)
cap_buttons = ''.join('\n      <button type="button" data-lang="%s" aria-pressed="false" lang="%s">%s</button>' % (k, k, LANGS.get(k, k.upper())) for k in caps)
notes = ('\n    <ul>%s\n    </ul>' % ''.join('\n      <li>%s</li>' % e(n) for n in A.note)) if A.note else ''
approve = ('approve <a href="%s">pull request #%d</a> or send corrections in the thread.' % (pr, A.pr)) if pr else 'approve it or send corrections in the thread.'
page = '''<title>%(title)s</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=IBM+Plex+Mono:wght@500&display=swap">
<style>
  /* A screening page on watercolour paper, as the series is drawn: the film first, its captions and chapters under it, then what
     changed. Pencil lines, ink text, and the role washes the films use, each for one job: teal (the student) marks what is on,
     amber (the applicant) the one thing to do. A deliberate single light look, like the films' daylight paper. */
  :root {
    --paper: #fbf7ee; --card: #fdfbf5; --line: rgba(58, 54, 66, 0.28); --ink: #2e2a38; --dark: #1e1a28;
    --muted: #5f5b6c; --teal: #0e9692; --teal-ink: #00706c; --amber: #e2960a; --amber-ink: #8a5500;
    --coral: #ee604e; --violet: #7e56dc; --green: #26a060;
    --sans: "Manrope", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    --mono: "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    color-scheme: light;
  }
  body {
    background: var(--paper); color: var(--ink); font-family: var(--sans); font-size: 16px; line-height: 1.55;
    background-image:
      radial-gradient(ellipse 60%% 38%% at 12%% 0%%, rgba(14, 150, 146, 0.13), transparent 70%%),
      radial-gradient(ellipse 46%% 30%% at 88%% 4%%, rgba(226, 150, 10, 0.12), transparent 70%%),
      radial-gradient(ellipse 50%% 26%% at 55%% 0%%, rgba(126, 86, 220, 0.07), transparent 70%%);
    background-repeat: no-repeat;
  }
  .wrap {
    max-width: 1000px; margin: 0 auto; display: grid; gap: 30px;
    padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px));
    padding-block: 32px 60px;
  }
  header { display: grid; gap: 6px; }
  .eyebrow { font: 700 12px/1.3 var(--sans); letter-spacing: 0.14em; text-transform: uppercase; color: var(--teal-ink); }
  h1 { font: 800 clamp(30px, 5.4vw, 46px)/1.08 var(--sans); margin: 0; color: var(--dark); text-wrap: balance; letter-spacing: -0.01em; }
  .roles { display: flex; gap: 6px; margin: 6px 0 2px; }
  .roles i { width: 34px; height: 7px; border-radius: 6px 3px 7px 2px; opacity: 0.85; }
  .meta { font: 500 13px/1.4 var(--mono); color: var(--muted); margin: 0; }
  .watch { display: grid; gap: 12px; }
  .player {
    border: 1.5px solid rgba(58, 54, 66, 0.55); border-radius: 6px; overflow: hidden; background: var(--card);
    aspect-ratio: 16 / 9; max-width: 100%%; box-shadow: 0 1px 0 rgba(58, 54, 66, 0.08), 0 14px 34px -18px rgba(46, 42, 56, 0.45);
  }
  video { display: block; width: 100%%; height: 100%%; background: var(--card); }
  .cap-row { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
  .label { font: 700 12px/1 var(--sans); letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-right: 6px; }
  .cap-row button {
    background: var(--card); color: var(--ink); border: 1px solid var(--line); border-radius: 999px;
    padding: 6px 14px; font: 600 14px/1.2 var(--sans); cursor: pointer;
  }
  .cap-row button[aria-pressed="true"] { background: rgba(14, 150, 146, 0.16); border-color: var(--teal); color: var(--teal-ink); }
  .cap-text { margin: 0; min-height: 2.9em; max-width: 70ch; font: 600 18px/1.45 var(--sans); color: var(--dark); }
  h2 { font: 700 13px/1.3 var(--sans); letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin: 0 0 12px; }
  ol.chapters {
    list-style: none; margin: 0; padding: 0; display: grid; gap: 8px;
    grid-template-columns: repeat(auto-fill, minmax(min(100%%, 290px), 1fr));
  }
  .chapters button {
    display: flex; align-items: baseline; gap: 12px; width: 100%%; min-width: 0; text-align: left; cursor: pointer;
    background: var(--card); color: var(--ink); border: 1px solid var(--line); border-radius: 6px;
    padding: 10px 12px; font: 600 15px/1.35 var(--sans);
  }
  .chapters button:hover { border-color: rgba(58, 54, 66, 0.55); }
  .chapters button[aria-current="true"] { border-color: var(--teal); box-shadow: inset 4px 0 0 var(--teal); background: rgba(14, 150, 146, 0.07); }
  .tc { font: 500 13px var(--mono); color: var(--muted); font-variant-numeric: tabular-nums; min-width: 3.1em; }
  .n { font: 500 13px var(--mono); color: var(--teal-ink); min-width: 1.4em; }
  .chapters .new { margin-left: auto; font: 700 11px/1 var(--sans); letter-spacing: 0.1em; text-transform: uppercase; color: var(--amber-ink); }
  .notes { background: var(--card); border: 1px solid var(--line); border-radius: 6px; padding: 18px 20px 20px; }
  .notes ul { margin: 0 0 16px; padding-left: 20px; display: grid; gap: 8px; max-width: 70ch; }
  .notes li::marker { color: var(--teal); }
  .notes p { margin: 0; }
  .notes .ask { border-top: 1px solid var(--line); padding-top: 14px; }
  a { color: var(--amber-ink); font-weight: 700; text-decoration-color: var(--amber); text-decoration-thickness: 2px; text-underline-offset: 3px; }
  button:focus-visible, a:focus-visible { outline: 2px solid var(--teal-ink); outline-offset: 2px; }
</style>

<div class="wrap">
  <header>
    <div class="eyebrow">%(eyebrow)s</div>
    <h1>%(title)s</h1>
    <div class="roles" aria-hidden="true"><i style="background:var(--teal)"></i><i style="background:var(--amber)"></i><i style="background:var(--coral)"></i><i style="background:var(--violet)"></i><i style="background:var(--green)"></i></div>
    <p class="meta">Review copy · %(dur)s · 720p%(langs)s</p>
  </header>

  <div class="watch">
    <div class="player">
      <video id="film" controls playsinline preload="metadata" poster="poster.jpg">
        <source src="%(mp4)s" type="video/mp4">
        Your browser can't play this video here.
      </video>
    </div>
    <div class="cap-row" id="cap-row" role="group" aria-label="Captions">
      <span class="label">Captions</span>
      <button type="button" data-lang="" aria-pressed="true">Off</button>%(cap_buttons)s
    </div>
    <p class="cap-text" id="cap" aria-live="off"></p>
  </div>

  <section aria-labelledby="ch-head">
    <h2 id="ch-head">Chapters</h2>
    <ol class="chapters" id="chapters"></ol>
  </section>

  <section class="notes" aria-labelledby="rev-head">
    <h2 id="rev-head">In this revision</h2>%(notes)s
    <p class="ask">Once you've watched it, %(approve)s</p>
  </section>
</div>

<script>
  // the chapters as built (script.md), each a button that plays the film from its start; the new ones are marked
  const CHAPTERS = %(chapters)s, NEW = %(new)s;
  const film = document.getElementById("film"), list = document.getElementById("chapters");
  const secs = tc => { const [m, s] = tc.split(":").map(Number); return m * 60 + s; };
  const buttons = CHAPTERS.map(([tc, name], i) => {
    const li = document.createElement("li"), b = document.createElement("button");
    b.type = "button";
    b.innerHTML = '<span class="n">' + (i + 1) + '</span><span class="tc">' + tc + '</span><span></span>';
    b.children[2].textContent = name;
    if (NEW.includes(i + 1)) { const s = document.createElement("span"); s.className = "new"; s.textContent = "new"; b.appendChild(s); }
    b.setAttribute("aria-label", "Play chapter " + (i + 1) + ", " + name + (NEW.includes(i + 1) ? " (new)" : "") + ", from " + tc);
    b.addEventListener("click", () => { film.currentTime = secs(tc) + 0.1; const p = film.play(); if (p && p.catch) p.catch(() => {}); });
    li.appendChild(b); list.appendChild(li); return b;
  });
  // the chapter playing now is marked in teal
  function mark() {
    const t = film.currentTime; let k = 0;
    CHAPTERS.forEach(([tc], i) => { if (t >= secs(tc)) k = i; });
    buttons.forEach((b, i) => b.setAttribute("aria-current", i === k ? "true" : "false"));
  }
  film.addEventListener("timeupdate", mark);
  film.addEventListener("seeked", mark);
  mark();

  // captions under the film, in each language it has (captions.json holds them all)
  let CAPS = null, lang = "";
  const capEl = document.getElementById("cap"), capBtns = [...document.querySelectorAll("#cap-row button")];
  function showCap() {
    if (!CAPS || !lang) { capEl.textContent = ""; return; }
    const t = film.currentTime, c = CAPS[lang].find(c => t >= c[0] - 0.05 && t < c[1] + 0.15);
    capEl.textContent = c ? c[2] : ""; capEl.lang = lang;
  }
  function setLang(l) {
    lang = l; capBtns.forEach(b => b.setAttribute("aria-pressed", b.dataset.lang === l ? "true" : "false")); showCap();
    try { localStorage.setItem("caps", l); } catch (e) {}
  }
  capBtns.forEach(b => b.addEventListener("click", () => setLang(b.dataset.lang)));
  fetch("captions.json").then(r => r.json()).then(d => {
    CAPS = d; let saved = ""; try { saved = localStorage.getItem("caps") || ""; } catch (e) {}
    setLang(CAPS[saved] ? saved : "");
  }).catch(() => { document.getElementById("cap-row").hidden = true; });
  let raf = 0;
  const tick = () => { showCap(); if (!film.paused) raf = requestAnimationFrame(tick); };
  film.addEventListener("play", () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); });
  film.addEventListener("seeked", showCap);
</script>
''' % dict(title=e(meta['title']), eyebrow=e(eyebrow), dur=chapters[-1][3], langs=(' · captions in ' + langs_txt) if caps else '',
           mp4=e(mp4.name), cap_buttons=cap_buttons, notes=notes, approve=approve,
           chapters=json.dumps([[a, name] for n, name, a, b in chapters], ensure_ascii=False), new=json.dumps(new))
pf = out / (meta['key'] + '.html')
pf.write_text(page, encoding='utf-8')
print('wrote %s on watercolour paper (%d chapters, %d new; captions: %s), %s (%.1f MB)' % (pf, len(chapters), len(new), ', '.join(caps) or 'none', mp4.name, mp4.stat().st_size / 1e6))
print('Publish it as a private artifact: file_path %s, files %s' % (pf, json.dumps({p.name: str(p) for p in (mp4, out / 'captions.json', out / 'poster.jpg')})))
