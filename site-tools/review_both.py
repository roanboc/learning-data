"""The review page of a film made again: the version before, beside this one. python site-tools/review_page.py <film folder>
--before <its render or review copy> runs it, after making the usual files (this version's 720p copy, captions.json, poster.jpg).

The author asked to see a film made again "before and after" (17 November 2026). One page holds both: a switch between the two
versions, which keeps the chapter and how far through it the film is; each version's own chapters and captions; and the same
moments of both, side by side, each a button that plays its version from there. The earlier version is a review copy kept from
its own review (a full render gets a copy made), so nothing is rendered again. Everything goes in <film>/source/dist/review/."""
import html, json, pathlib, re, shutil, subprocess, sys


def secs(tc):
    """"4:42", "4:42.5" or plain seconds."""
    tc = str(tc).strip()
    if ':' in tc:
        m, s = tc.split(':')
        return int(m) * 60 + float(s)
    return float(tc)


def mmss(t):
    return '%d:%02d' % (int(t) // 60, int(t) % 60)


def duration(FF, f):
    h, m, s = re.search(r'Duration: (\d+):(\d+):([\d.]+)', subprocess.run([FF, '-i', str(f)], capture_output=True, text=True).stderr).groups()
    return int(h) * 3600 + int(m) * 60 + float(s)


def still(FF, mp4, t, to, width=960):
    subprocess.run([FF, '-y', '-loglevel', 'error', '-ss', '%.2f' % t, '-i', str(mp4), '-frames:v', '1', '-vf', 'scale=%d:-2:flags=lanczos' % width,
                    '-q:v', '3', str(to)], check=True)


def write(A, out, key, title, eyebrow, chapters, caps, mp4, page, notes, approve, cues, FF):
    """Write the page with both versions over the usual one, and return the files to publish beside it (and how many pairs)."""
    e = html.escape
    before = pathlib.Path(A.before)
    b_mp4 = out / (key + '-before-720p.mp4')
    if before.name.endswith('.review.mp4') or before.stat().st_size <= 15e6:  # already a review copy
        shutil.copyfile(before, b_mp4)
    else:
        subprocess.run([sys.executable, str(pathlib.Path(__file__).with_name('review_copy.py')), str(before), '--out', str(b_mp4)], check=True)

    # each version's chapters: [start, name], and where the version ends
    now_ch, now_end = [[a, name] for n, name, a, b in chapters], chapters[-1][3]
    if A.before_chapters:
        ts = [t.strip() for t in A.before_chapters.split(',')]
        if len(ts) != len(chapters) + 1:
            raise SystemExit('--before-chapters takes %d starts and the end, as m:ss: this version has %d chapters' % (len(chapters), len(chapters)))
        b_ch, b_end = [[t, name] for t, (n, name, a, b) in zip(ts, chapters)], ts[-1]
    else:
        b_ch, b_end = now_ch, mmss(duration(FF, b_mp4))
    edges = lambda ch, end: [secs(c[0]) for c in ch] + [secs(end)]
    B, N = edges(b_ch, b_end), edges(now_ch, now_end)

    # the earlier version's captions: a folder of *.vtt, or the captions.json of its own review page
    b_caps = None
    if A.before_captions:
        src = pathlib.Path(A.before_captions)
        d = json.loads(src.read_text(encoding='utf-8')) if src.is_file() else {p.stem: cues(p) for p in sorted(src.glob('*.vtt'))}
        d = {k: v for k, v in sorted(d.items(), key=lambda kv: (kv[0] != 'en', kv[0])) if v}
        if d:
            b_caps = 'captions-before.json'
            (out / b_caps).write_text(json.dumps(d, ensure_ascii=False), encoding='utf-8')

    still(FF, b_mp4, max(0.0, (B[1] if len(B) > 2 else 4.0) - 1.0), out / 'poster-before.jpg', 1280)

    # the moments set side by side: the ones asked for, or the middle of every chapter
    pairs = []
    for p in A.pair:
        bits = [x.strip() for x in p.split('|')]
        if len(bits) != 3:
            raise SystemExit('--pair takes "what to look at|time before|time now": %r' % p)
        pairs.append((bits[0], secs(bits[1]), secs(bits[2])))
    if not pairs:
        pairs = [(name, (B[i] + B[i + 1]) / 2, (N[i] + N[i + 1]) / 2) for i, (a, name) in enumerate(now_ch)]
    files = {p.name: str(p) for p in (mp4, b_mp4, out / 'captions.json', out / 'poster.jpg', out / 'poster-before.jpg')}
    if b_caps:
        files[b_caps] = str(out / b_caps)
    for old in out.glob('pair-*.jpg'):
        old.unlink()
    figs = ''
    for i, (what, tb, tn) in enumerate(pairs, 1):
        fb, fn = out / ('pair-%d-before.jpg' % i), out / ('pair-%d-now.jpg' % i)
        still(FF, b_mp4, tb, fb)
        still(FF, mp4, tn, fn)
        files[fb.name], files[fn.name] = str(fb), str(fn)
        figs += '''
    <figure class="pair">
      <figcaption>%s</figcaption>
      <div class="two">
        <button type="button" data-v="before" data-t="%.2f" aria-label="%s"><img src="%s" alt="%s" loading="lazy" width="960" height="540"><span>%s · %s</span></button>
        <button type="button" class="now" data-v="now" data-t="%.2f" aria-label="%s"><img src="%s" alt="%s" loading="lazy" width="960" height="540"><span>%s · %s</span></button>
      </div>
    </figure>''' % (e(what), tb, e('Play %s from %s: %s' % (A.before_label, mmss(tb), what)), fb.name, e('%s, %s' % (what, A.before_label)), e(A.before_label), mmss(tb),
                   tn, e('Play %s from %s: %s' % (A.label, mmss(tn), what)), fn.name, e('%s, %s' % (what, A.label)), e(A.label), mmss(tn))

    names = {'en': 'English', 'es': 'Spanish'}
    langs = [names.get(k, k.upper()) for k in caps]
    langs_txt = ' and '.join([', '.join(langs[:-1]), langs[-1]] if len(langs) > 1 else langs)
    shown = {'en': 'English', 'es': 'Español'}
    cap_buttons = ''.join('\n      <button type="button" data-lang="%s" aria-pressed="false">%s</button>' % (k, e(shown.get(k, k.upper()))) for k in caps)
    versions = {'before': dict(label=A.before_label, src=b_mp4.name, poster='poster-before.jpg', chapters=b_ch, end=b_end, caps=b_caps),
                'now': dict(label=A.label, src=mp4.name, poster='poster.jpg', chapters=now_ch, end=now_end, caps='captions.json' if caps else None)}
    css = page[page.index('<style>') + len('<style>'):page.index('</style>')]  # the usual page's own look
    both = '''<title>%(title)s</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=IBM+Plex+Mono:wght@500&display=swap">
<style>%(css)s
  /* Two versions of one film: a switch over the player, and the same moments of both in pairs. Gold marks the version playing. */
  .switch {
    display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 4px; padding: 4px; width: min(100%%, 560px); box-sizing: border-box;
    background: var(--panel); border: 1px solid var(--line); border-radius: 12px;
  }
  .switch button {
    display: grid; gap: 3px; min-width: 0; text-align: left; cursor: pointer; padding: 9px 14px; border: 0; border-radius: 9px;
    background: transparent; color: var(--muted); font: 700 15px/1.25 var(--sans);
  }
  .switch small { font: 500 12px/1.2 var(--mono); color: var(--muted); }
  .switch button[aria-pressed="true"] { background: #1a2738; color: var(--fg); box-shadow: inset 0 0 0 1px var(--gold); }
  .switch button[aria-pressed="true"] small { color: var(--gold); }
  .pairs { display: grid; gap: 22px; }
  .pairs h2 { margin: 0; }
  .pairs .how { margin: -12px 0 0; color: var(--muted); max-width: 68ch; }
  .pair { margin: 0; display: grid; gap: 8px; }
  .pair figcaption { font: 700 16px/1.35 var(--sans); max-width: 68ch; }
  .two { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
  @media (max-width: 620px) { .two { grid-template-columns: minmax(0, 1fr); } }
  .two button {
    position: relative; display: block; min-width: 0; padding: 0; cursor: pointer; aspect-ratio: 16 / 9; overflow: hidden;
    background: #000; border: 1px solid var(--line); border-radius: 8px;
  }
  .two button:hover { border-color: #3a4d68; }
  .two img { display: block; width: 100%%; height: 100%%; object-fit: cover; }
  .two span {
    position: absolute; left: 8px; bottom: 8px; padding: 4px 9px; border-radius: 999px;
    background: rgba(11, 17, 25, 0.88); color: var(--fg); font: 500 12px/1.2 var(--mono);
  }
  .two .now span { color: var(--gold); }
</style>

<div class="wrap">
  <header>
    <div class="eyebrow">%(eyebrow)s</div>
    <h1>%(title)s</h1>
    <p class="meta">Before and after · %(b_label)s %(b_dur)s · %(label)s %(dur)s · 720p%(langs)s</p>
  </header>

  <div class="watch">
    <div class="switch" id="switch" role="group" aria-label="The version that plays">
      <button type="button" data-v="before" aria-pressed="false">%(b_label)s<small>%(b_dur)s</small></button>
      <button type="button" data-v="now" aria-pressed="true">%(label)s<small>%(dur)s</small></button>
    </div>
    <div class="player">
      <video id="film" controls playsinline preload="metadata" poster="poster.jpg" src="%(mp4)s">Your browser can't play this video here.</video>
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

  <section class="pairs" aria-labelledby="pair-head">
    <h2 id="pair-head">Side by side</h2>
    <p class="how">The same moment in each version. Pick a picture to play that version from there.</p>%(figs)s
  </section>

  <section class="notes" aria-labelledby="rev-head">
    <h2 id="rev-head">%(notes_head)s</h2>%(notes)s
    <p>Once you've compared them, %(approve)s</p>
  </section>
</div>

<script>
  // the two versions: where each one's file, poster, chapters (as built) and captions are
  const V = %(versions)s;
  const film = document.getElementById("film"), list = document.getElementById("chapters");
  const verBtns = [...document.querySelectorAll("#switch button")];
  const secs = tc => { const [m, s] = String(tc).split(":").map(Number); return m * 60 + s; };
  const play = () => { const p = film.play(); if (p && p.catch) p.catch(() => {}); };
  let cur = "now", buttons = [];

  // the chapters of the version playing, each a button that plays it from its start
  function chapters() {
    list.textContent = "";
    buttons = V[cur].chapters.map(([tc, name], i) => {
      const li = document.createElement("li"), b = document.createElement("button");
      b.type = "button";
      b.innerHTML = '<span class="n">' + (i + 1) + '</span><span class="tc">' + tc + '</span><span></span>';
      b.lastChild.textContent = name;
      b.setAttribute("aria-label", "Play chapter " + (i + 1) + ", " + name + ", from " + tc);
      b.addEventListener("click", () => { film.currentTime = secs(tc) + 0.05; play(); });
      li.appendChild(b); list.appendChild(li); return b;
    });
  }
  // the chapter playing now is outlined in gold
  function mark() {
    const t = film.currentTime; let k = 0;
    V[cur].chapters.forEach(([tc], i) => { if (t >= secs(tc)) k = i; });
    buttons.forEach((b, i) => b.setAttribute("aria-current", i === k ? "true" : "false"));
  }
  // where a moment of one version falls in the other: the same chapter, as far through it
  function across(from, to, t) {
    const edges = v => V[v].chapters.map(c => secs(c[0])).concat(secs(V[v].end)), A = edges(from), B = edges(to);
    let k = 0; for (let i = 0; i < A.length - 1; i++) if (t >= A[i]) k = i;
    const f = Math.min(1, Math.max(0, (t - A[k]) / Math.max(0.1, A[k + 1] - A[k])));
    return B[k] + f * (B[k + 1] - B[k]);
  }
  // play a version: from t, or from where the other one is
  function use(v, t, go) {
    if (v === cur) { if (t != null) film.currentTime = t; if (go) play(); mark(); showCap(); return; }
    if (t == null) t = across(cur, v, film.currentTime || 0);
    cur = v; verBtns.forEach(b => b.setAttribute("aria-pressed", b.dataset.v === v ? "true" : "false"));
    film.addEventListener("loadedmetadata", () => { if (t > 0.05) film.currentTime = t; if (go) play(); mark(); showCap(); }, { once: true });
    film.poster = V[v].poster; film.src = V[v].src; film.load();
    chapters(); captions();
  }
  verBtns.forEach(b => b.addEventListener("click", () => use(b.dataset.v, null, !film.paused)));
  document.querySelectorAll(".two button").forEach(b => b.addEventListener("click", () => {
    use(b.dataset.v, +b.dataset.t, true);
    film.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
  }));
  film.addEventListener("timeupdate", mark);
  film.addEventListener("seeked", mark);

  // captions under the film, in each language the version playing has
  const CAPS = {}; let lang = "";
  const capEl = document.getElementById("cap"), capRow = document.getElementById("cap-row"), capBtns = [...capRow.querySelectorAll("button")];
  function showCap() {
    const d = CAPS[cur];
    if (!d || !lang || !d[lang]) { capEl.textContent = ""; return; }
    const t = film.currentTime, c = d[lang].find(c => t >= c[0] - 0.05 && t < c[1] + 0.15);
    capEl.textContent = c ? c[2] : ""; capEl.lang = lang;
  }
  function setLang(l) {
    lang = l; capBtns.forEach(b => b.setAttribute("aria-pressed", b.dataset.lang === l ? "true" : "false")); showCap();
    try { localStorage.setItem("caps", l); } catch (e) {}
  }
  capBtns.forEach(b => b.addEventListener("click", () => setLang(b.dataset.lang)));
  function captions() {
    const v = cur, f = V[v].caps;
    capRow.hidden = !f; showCap();
    if (!f || CAPS[v]) return;
    fetch(f).then(r => r.json()).then(d => { CAPS[v] = d; showCap(); }).catch(() => { if (cur === v) capRow.hidden = true; });
  }
  let raf = 0;
  const tick = () => { showCap(); if (!film.paused) raf = requestAnimationFrame(tick); };
  film.addEventListener("play", () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); });
  film.addEventListener("seeked", showCap);
  try { const l = localStorage.getItem("caps") || ""; if (capBtns.some(b => b.dataset.lang === l)) setLang(l); } catch (e) {}
  chapters(); captions(); mark();
</script>
''' % dict(title=e(title), css=css.rstrip(), eyebrow=e(eyebrow), b_label=e(A.before_label), label=e(A.label), b_dur=b_end, dur=now_end,
           langs=(' · captions in ' + langs_txt) if caps else '', mp4=mp4.name, cap_buttons=cap_buttons, figs=figs,
           notes_head='In this version' if notes else 'Your review', notes=('\n    <ul>%s\n    </ul>' % notes) if notes else '', approve=approve,
           versions=json.dumps(versions, ensure_ascii=False))
    (out / (key + '.html')).write_text(both, encoding='utf-8')
    files['pairs'] = len(pairs)
    return files
