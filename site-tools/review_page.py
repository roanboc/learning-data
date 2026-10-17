"""Make a page to review a rendered film on: python site-tools/review_page.py <film folder> [--pr N] [--note "..."]...
The author watches new and changed films on this page (AGENTS.md, "Share the video for review"): it plays the film in the browser,
with a button for each chapter and captions in each language under it, so nothing has to be downloaded from the chat. It is made
from the film's own files: the 720p copy that review_copy.py makes (made here if it's missing or older than the video), the chapters
in script.md, and the captions in captions/*.vtt. Everything goes in <film>/source/dist/review/; publish the page as a private
artifact with the files this prints, one page per film, and a new version of the film to the same link."""
import argparse, html, json, pathlib, re, shutil, subprocess, sys
import imageio_ffmpeg

FF = imageio_ffmpeg.get_ffmpeg_exe()
LANGS = {'en': 'English', 'es': 'Español'}  # each button in its own language
NAMES = {'en': 'English', 'es': 'Spanish'}  # the page's own words are English
ap = argparse.ArgumentParser(description=__doc__)
ap.add_argument('film', help='the film folder, such as films/enterprise-architecture/8-now-the-questions-appear')
ap.add_argument('--video', help='the rendered film (default: source/dist/<key>.mp4)')
ap.add_argument('--pr', type=int, help='the pull request the author approves')
ap.add_argument('--note', action='append', default=[], help='one line on what changed in this version (repeat for more)')
ap.add_argument('--poster-at', type=float, help='the moment the poster shows, in seconds (default: a second before chapter 2, the title card)')
A = ap.parse_args()

film = pathlib.Path(A.film).resolve()
src = film / 'source'
meta = json.loads((src / 'film.json').read_text())
key, title = meta['key'], meta['title']
sj = film.parent / 'series.json'
series = json.loads(sj.read_text()) if sj.exists() else {}
script = (film / 'script.md').read_text()
series_title = series.get('title') or re.match(r'# (.+?) · ', script).group(1)
planned = series.get('planned') or len(series.get('films', []))
num = re.match(r'(\d+)-', film.name)
eyebrow = series_title + (' · Film %s of %s' % (num.group(1), planned) if num and planned else '')

# the chapters, as built: "### 1 · Where to land · 0:00–1:03"
chapters = [(n, name, a, b) for n, name, a, b in re.findall(r'^### (\d+) · (.+?) · (\d+:\d\d)–(\d+:\d\d)\s*$', script, re.M)]
if not chapters:
    raise SystemExit('No chapters in %s: its headings should read "### 1 · Name · 0:00–0:40"' % (film / 'script.md'))
secs = lambda tc: int(tc.split(':')[0]) * 60 + int(tc.split(':')[1])

# the 720p copy, made again whenever the video is newer
video = pathlib.Path(A.video) if A.video else src / 'dist' / (key + '.mp4')
copy = video.with_name(video.stem + '.review.mp4')
if not copy.exists() or copy.stat().st_mtime < video.stat().st_mtime:
    subprocess.run([sys.executable, str(pathlib.Path(__file__).with_name('review_copy.py')), str(video)], check=True)
out = src / 'dist' / 'review'
out.mkdir(parents=True, exist_ok=True)
mp4 = out / (key + '-720p.mp4')
shutil.copyfile(copy, mp4)

# the captions, every language the film has, as [start, end, text]
def cues(p):
    o = []
    for b in p.read_text(encoding='utf-8').split('\n\n'):
        m = re.search(r'(\d+):(\d+):(\d+)\.(\d+)\s+-->\s+(\d+):(\d+):(\d+)\.(\d+)\s*\n(.*)', b, re.S)
        if m:
            g = m.groups()
            o.append([round(int(g[0]) * 3600 + int(g[1]) * 60 + int(g[2]) + int(g[3]) / 1000, 3),
                      round(int(g[4]) * 3600 + int(g[5]) * 60 + int(g[6]) + int(g[7]) / 1000, 3), g[8].strip()])
    return o
caps = {p.stem: cues(p) for p in sorted((film / 'captions').glob('*.vtt'))}
caps = {k: v for k, v in sorted(caps.items(), key=lambda kv: (kv[0] != 'en', kv[0])) if v}
(out / 'captions.json').write_text(json.dumps(caps, ensure_ascii=False), encoding='utf-8')

# the poster: the title card, which follows chapter 1
at = A.poster_at if A.poster_at is not None else (secs(chapters[1][2]) - 1.0 if len(chapters) > 1 else 3.0)
subprocess.run([FF, '-y', '-loglevel', 'error', '-ss', '%.2f' % at, '-i', str(mp4), '-frames:v', '1', '-q:v', '4', str(out / 'poster.jpg')], check=True)

# the pull request, on the repository's own GitHub
pr = ''
if A.pr:
    url = subprocess.run(['git', 'remote', 'get-url', 'origin'], capture_output=True, text=True, cwd=film).stdout.strip()
    slug = '/'.join(re.sub(r'\.git$', '', url).rstrip('/').split('/')[-2:]) or 'roanboc/learning-data'
    pr = 'https://github.com/%s/pull/%d' % (slug, A.pr)

e = html.escape
names = [NAMES.get(k, k.upper()) for k in caps]
langs_txt = ' and '.join([', '.join(names[:-1]), names[-1]] if len(names) > 1 else names)
cap_buttons = ''.join('\n      <button type="button" data-lang="%s" aria-pressed="false">%s</button>' % (k, e(LANGS.get(k, k.upper()))) for k in caps)
notes = ''.join('\n      <li>%s</li>' % e(n) for n in A.note)
approve = ('approve <a href="%s">pull request #%d</a> or send corrections in the thread.' % (pr, A.pr)) if pr else 'approve it or send corrections in the thread.'
page = '''<title>%(title)s</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=IBM+Plex+Mono:wght@500&display=swap">
<style>
  /* A screening page in night blue: the film first, its captions and chapters under it, then what changed. One column.
     Mint names the series, gold marks what is on and the one thing to do. A deliberate single dark look, for watching. */
  :root {
    --bg: #0b1119; --panel: #111a26; --line: #233246; --fg: #e9eef6; --muted: #9eabbf; --mint: #8fdcc1; --gold: #e9b949;
    --sans: "Manrope", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    --mono: "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    color-scheme: dark;
  }
  body { background: var(--bg); color: var(--fg); font-family: var(--sans); font-size: 16px; line-height: 1.55; }
  .wrap {
    max-width: 980px; margin: 0 auto; display: grid; gap: 28px;
    padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px));
    padding-block: 28px 56px;
  }
  header { display: grid; gap: 6px; }
  .eyebrow { font: 700 12px/1.3 var(--sans); letter-spacing: 0.14em; text-transform: uppercase; color: var(--mint); }
  h1 { font: 800 clamp(30px, 5.4vw, 46px)/1.08 var(--sans); margin: 0; text-wrap: balance; letter-spacing: -0.01em; }
  .meta { font: 500 13px/1.4 var(--mono); color: var(--muted); margin: 2px 0 0; }
  .watch { display: grid; gap: 12px; }
  .player { border: 1px solid var(--line); border-radius: 10px; overflow: hidden; background: #000; aspect-ratio: 16 / 9; max-width: 100%%; }
  video { display: block; width: 100%%; height: 100%%; background: #000; }
  .cap-row { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
  .cap-label { font: 700 12px/1 var(--sans); letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-right: 6px; }
  .cap-row button {
    background: var(--panel); color: var(--fg); border: 1px solid var(--line); border-radius: 999px;
    padding: 6px 14px; font: 600 14px/1.2 var(--sans); cursor: pointer;
  }
  .cap-row button[aria-pressed="true"] { border-color: var(--gold); color: var(--gold); }
  .cap-text { margin: 0; min-height: 2.9em; max-width: 70ch; font: 600 18px/1.45 var(--sans); color: var(--fg); }
  h2 { font: 700 13px/1.3 var(--sans); letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin: 0 0 12px; }
  ol.chapters { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%%, 280px), 1fr)); gap: 8px; }
  .chapters button {
    display: flex; align-items: baseline; gap: 12px; width: 100%%; min-width: 0; text-align: left; cursor: pointer;
    background: var(--panel); color: var(--fg); border: 1px solid var(--line); border-radius: 8px;
    padding: 10px 12px; font: 600 15px/1.35 var(--sans);
  }
  .chapters button:hover { border-color: #3a4d68; }
  .chapters button[aria-current="true"] { border-color: var(--gold); box-shadow: inset 3px 0 0 var(--gold); }
  .tc { font: 500 13px var(--mono); color: var(--muted); font-variant-numeric: tabular-nums; min-width: 3.1em; }
  .n { font: 500 13px var(--mono); color: var(--mint); min-width: 1.4em; }
  .notes ul { margin: 0 0 16px; padding-left: 20px; display: grid; gap: 8px; max-width: 68ch; }
  .notes p { margin: 0; max-width: 68ch; }
  a { color: var(--gold); text-underline-offset: 3px; }
  button:focus-visible, a:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }
</style>

<div class="wrap">
  <header>
    <div class="eyebrow">%(eyebrow)s</div>
    <h1>%(title)s</h1>
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
      <span class="cap-label">Captions</span>
      <button type="button" data-lang="" aria-pressed="true">Off</button>%(cap_buttons)s
    </div>
    <p class="cap-text" id="cap"></p>
  </div>

  <section aria-labelledby="ch-head">
    <h2 id="ch-head">Chapters</h2>
    <ol class="chapters" id="chapters"></ol>
  </section>

  <section class="notes" aria-labelledby="rev-head">
    <h2 id="rev-head">%(notes_head)s</h2>%(notes)s
    <p>Once you've watched it, %(approve)s</p>
  </section>
</div>

<script>
  // the chapters as built (script.md), each a button that plays the film from its start
  const CHAPTERS = %(chapters)s;
  const film = document.getElementById("film"), list = document.getElementById("chapters");
  const secs = tc => { const [m, s] = tc.split(":").map(Number); return m * 60 + s; };
  const buttons = CHAPTERS.map(([tc, name], i) => {
    const li = document.createElement("li"), b = document.createElement("button");
    b.type = "button";
    b.innerHTML = '<span class="n">' + (i + 1) + '</span><span class="tc">' + tc + '</span><span></span>';
    b.lastChild.textContent = name;
    b.setAttribute("aria-label", "Play chapter " + (i + 1) + ", " + name + ", from " + tc);
    b.addEventListener("click", () => { film.currentTime = secs(tc) + 0.05; const p = film.play(); if (p && p.catch) p.catch(() => {}); });
    li.appendChild(b); list.appendChild(li); return b;
  });
  // the chapter playing now is outlined in gold
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
''' % dict(title=e(title), eyebrow=e(eyebrow), dur=chapters[-1][3], langs=(' · captions in ' + langs_txt) if caps else '', mp4=mp4.name,
           cap_buttons=cap_buttons, notes_head='In this version' if notes else 'Your review', notes=('\n    <ul>%s\n    </ul>' % notes) if notes else '',
           approve=approve, chapters=json.dumps([[a, name] for n, name, a, b in chapters], ensure_ascii=False))
page_file = out / (key + '.html')
page_file.write_text(page, encoding='utf-8')
size = mp4.stat().st_size / 1e6
print('wrote %s (%d chapters, captions: %s), %s (%.1f MB), captions.json and poster.jpg' % (page_file, len(chapters), ', '.join(caps) or 'none', mp4.name, size))
if size > 15:
    print('  the copy is over the 15 MB an artifact takes: make it again with review_copy.py --mb 14')
print('Publish it as a private artifact: file_path %s, files %s' % (page_file, json.dumps({p.name: str(p) for p in (mp4, out / 'captions.json', out / 'poster.jpg')})))
