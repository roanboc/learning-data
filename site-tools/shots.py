"""Check that every shot a film times comes on screen, long enough to be seen, in every film that picks its shots from a list:
    python site-tools/shots.py                  the film in the current folder (a film's source/), after its tools/build.py
    python site-tools/shots.py --film KEY ...   the films named by their release keys (such as ethics-and-accountability-en)
    python site-tools/shots.py --all            every film a release.json names (build them first: nothing is built here)
    add --list to print every list of shots, with how long each shot is on screen
A chapter cut into shots hands its list of shots ([{at, place, ...}]) to the agent films' kit (ag_shots, in
films/what-an-agent-is/shared/src/kit.js) or the governance films' (gv_shots, films/data-governance/shared/src/rooms.js), and about
120 films draw with one of them. Both show, at each moment, the last shot in the list whose time (at) has come, and the first from
the chapter's start. So a shot listed before another that starts no later never comes on screen: in *Measure the work, not the
people*, made again on 18 November 2026, Graham's answer from the campus was listed before the next shot but started after it, and
was skipped. And a shot that starts just before the next one is gone before anyone sees it: a scan of every such film the same day
found six shots on screen for less than a second, among them the picture that makes a chapter's point (the stranger who holds the
ox's rope in *Ethics we can't read, accountability it can't hold*) and a room lost under a chapter's crossfade.

It draws each chapter on its own every STEP seconds on a small canvas, and reads each list of shots the chapter hands ag_shots or
gv_shots as it is given; a chapter's draw run only to find where its camera is (AG_PROBE, GV_PROBE) is left out. A shot is on
screen from its time until the next one's in its list (the first from the chapter's start, the last until its chapter ends): where
shots dissolve, from when it is half in until it is half out. It fails a shot on screen for less than SHOT seconds, or never: list
the shots in the order they start, and give each the time to be seen. A film names a shot that is brief on purpose in its
film.json ("brief": a list of [chapter id, at, why]), such as a picture the chapter before ends on, which the chapter dissolves
from; it names the shot within NEAR seconds of that at. A film that picks no shots this way has nothing to read, and passes.

The shots too short when this check came are listed in site-tools/shots_later.json ({film key: [[chapter id, at], ...]}): they are
shown as known and don't fail, and each leaves the list with its fix (the check says when a listed shot is long enough).
The people kit's films run the same rule in their own tools/check.py (films/people-first/shared/tools/shown.py)."""
import argparse, json, os, pathlib, sys

import fits  # how a film, its source folder and its page are found, as the check that text stays in its box finds them

ROOT = pathlib.Path(__file__).resolve().parents[1]
LATER = ROOT / 'site-tools' / 'shots_later.json'
SHOT = 1.0   # seconds a shot is on screen, at least (the people kit's shown.py asks the same)
STEP = 0.5   # seconds between two moments of a chapter read
NEAR = 0.1   # seconds between a shot's time and the time a film's "brief" or the later list names it by
PICKERS = ('ag_shots', 'gv_shots')

# The page's part: each list of shots a chapter hands ag_shots or gv_shots, once, as it is given; the shots are drawn as before
JS = r"""(o)=>{
const probing=()=>(typeof AG_PROBE!=="undefined"&&!!AG_PROBE)||(typeof GV_PROBE!=="undefined"&&!!GV_PROBE);
const fns=o.fns.filter(n=>typeof window[n]==="function"),orig={};let cur=null;
for(const n of fns){const f=orig[n]=window[n];
  window[n]=function(ctx,S,t,end,shots,dis){
    if(cur&&!probing()&&Array.isArray(shots)){const L=shots.map(s=>({at:+(s&&s.at),place:String((s&&(s.place||s.room))||"")})),
        k=n+"|"+end+"|"+L.map(s=>s.at).join(",");
      if(!cur.has(k))cur.set(k,{fn:n,end:Number.isFinite(+end)?+end:null,shots:L});}
    return f.apply(this,arguments);};}
const c=document.createElement("canvas");c.width=192;c.height=108;const x=c.getContext("2d"),out=[];
try{for(const sc of SCENES){cur=new Map();for(let t=0.05;t<sc.dur;t+=o.step){try{sc.draw(x,0.1,t,sc);}catch(e){}}
    out.push({id:String(sc.id),dur:+sc.dur,lists:[...cur.values()]});cur=null;}}
finally{cur=null;for(const n of fns)window[n]=orig[n];}
return {fns,chapters:out};}"""


def on_screen(shots, end):
    """How long each shot of a list is on screen in a chapter that ends at end: the last shot whose time has come is shown, and the
    first from the chapter's start. -> [(start, seconds), ...]"""
    out = []
    for k, s in enumerate(shots):
        a = 0.0 if k == 0 else s['at']
        b = min([q['at'] for q in shots[k + 1:]] + [end])
        out.append((a, max(0.0, b - a)))
    return out


def short(chapters, shot=SHOT):
    """Every shot on screen for less than shot seconds, or never, as dicts: chapter, k (from 0) and of (the list's length), at,
    place, n (seconds on screen), end (the list's), fn (the kit's function), and why: short, never (next: the shot listed after it
    that starts no later) or after (it starts after its chapter ends)."""
    found = []
    for ch in chapters:
        for L in ch['lists']:
            shots = L['shots']
            end = ch['dur'] if L['end'] is None else min(L['end'], ch['dur'])
            for k, (s, (a, n)) in enumerate(zip(shots, on_screen(shots, end))):
                if n >= shot:
                    continue
                x = dict(chapter=ch['id'], k=k, of=len(shots), at=s['at'], place=s['place'], n=n, end=end, fn=L['fn'], why='short')
                if k and s['at'] >= end:
                    x['why'] = 'after'
                elif n <= 0:
                    x['why'], x['next'] = 'never', min(shots[k + 1:], key=lambda q: q['at'])
                found.append(x)
    return found


def named(entries, x):
    """The entry of [chapter id, at, ...] that names shot x (the nearest within NEAR seconds), or None"""
    near = [e for e in entries if len(e) >= 2 and e[0] == x['chapter'] and abs(float(e[1]) - x['at']) <= NEAR + 1e-9]
    return min(near, key=lambda e: abs(float(e[1]) - x['at'])) if near else None


def shot_name(x):
    return 'shot %d of %d, at %.2f s%s,' % (x['k'] + 1, x['of'], x['at'], ' (%s)' % x['place'] if x['place'] else '')


def line(x):
    """a shot that is too short, in words"""
    if x['why'] == 'after':
        return 'chapter %s: %s starts after its chapter ends (%.2f s), so it never shows' % (x['chapter'], shot_name(x), x['end'])
    if x['why'] == 'never':
        q = x['next']
        return ('chapter %s: %s never shows: the shot at %.2f s%s is listed after it but starts no later, and %s shows the last shot '
                'whose time has come. List the shots in the order they start'
                % (x['chapter'], shot_name(x), q['at'], ' (%s)' % q['place'] if q['place'] else '', x['fn']))
    return ('chapter %s: %s is on screen for %.2f s (at least %.1f s): give it the time to be seen, or leave it out'
            % (x['chapter'], shot_name(x), x['n'], SHOT))


def picks_shots(page):
    """whether the film's built files name ag_shots or gv_shots at all (a film that doesn't is read no further)"""
    for f in [page] + sorted(page.parent.glob('*.js')):
        try:
            text = f.read_text(encoding='utf-8', errors='replace')
        except OSError:
            continue
        if any('function %s(' % n in text for n in PICKERS):
            return True
    return False


def read(browser, page, step=STEP):
    """{fns: the kits' functions the page has, chapters: [{id, dur, lists: [{fn, end, shots: [{at, place}]}]}]}"""
    pg = browser.new_page(viewport={'width': 1920, 'height': 1080})
    try:
        pg.goto(page.as_uri())
        pg.wait_for_function('window.__READY__===true', timeout=180000)
        return pg.evaluate(JS, {'fns': list(PICKERS), 'step': step})
    finally:
        pg.close()


def later():
    """Shots known to be too short when this check came, to be fixed film by film: {film key: [[chapter id, at], ...]}"""
    return json.loads(LATER.read_text(encoding='utf-8')) if LATER.exists() else {}


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--film', action='append', help='a release key; may be repeated')
    ap.add_argument('--all', action='store_true', help='every film')
    ap.add_argument('--list', action='store_true', help='print every list of shots, with how long each shot is on screen')
    A = ap.parse_args()
    from playwright.sync_api import sync_playwright
    import films as release_films  # .github/scripts/films.py, put on the path by fits
    inv = {e['key']: e for e in release_films.films()}
    if A.film or A.all:
        keys = list(inv) if A.all else A.film
        unknown = [k for k in keys if k not in inv]
        if unknown:
            ap.error('unknown film key %s' % ', '.join(unknown))
        todo = [(k, inv[k]['name'], fits.entry_page(inv[k]), ROOT / inv[k]['dir']) for k in keys]
    else:
        here = fits.at(pathlib.Path.cwd(), os.environ.get('FILM_LANG', 'en'), inv)
        if not here:
            ap.error("run this from a film's source folder, or name films with --film or --all")
        todo = [here]
    failed, known = [], later()
    with sync_playwright() as p:
        b = None
        for key, name, page, src in todo:
            head = '%s: ' % (name or key) if len(todo) > 1 else ''
            if not page.exists():
                raise SystemExit('%s: no %s; run its tools/build.py first' % (key, page))
            if not picks_shots(page):
                print('%spicks no shots from a list (%s): nothing to read' % (head, ' or '.join(PICKERS)), flush=True)
                continue
            b = b or p.chromium.launch(args=['--allow-file-access-from-files'])
            r = read(b, page)
            meta = json.loads((src / 'film.json').read_text(encoding='utf-8')) if (src / 'film.json').exists() else {}
            brief, listed = meta.get('brief', []), known.get(key, [])
            chapters = r['chapters']
            nshots = sum(len(L['shots']) for ch in chapters for L in ch['lists'])
            if A.list:
                for ch in chapters:
                    for L in ch['lists']:
                        end = ch['dur'] if L['end'] is None else min(L['end'], ch['dur'])
                        print('%schapter %s (%.2f s), %s:' % (head, ch['id'], ch['dur'], L['fn']), flush=True)
                        for k, (s, (a, n)) in enumerate(zip(L['shots'], on_screen(L['shots'], end))):
                            print('  %2d  at %7.2f  on screen %5.2f s  %s' % (k + 1, s['at'], n, s['place']), flush=True)
            found = short(chapters)
            mine = [x for x in found if not named(brief, x)]
            new = [x for x in mine if not named(listed, x)]
            print('%sread %d shots in %d lists of %d chapters; %d on screen for less than %.1f s, or never%s' % (
                head, nshots, sum(len(ch['lists']) for ch in chapters), len(chapters), len(mine), SHOT,
                ', %d of them known and still to fix (site-tools/shots_later.json)' % (len(mine) - len(new)) if len(mine) > len(new) else ''),
                flush=True)
            for x in mine:
                print('  %s%s' % ('' if x in new else '(known) ', line(x)), flush=True)
            for x in found:
                e = named(brief, x)
                if e:
                    print('  (brief on purpose) chapter %s: %s is on screen for %.2f s: %s' % (x['chapter'], shot_name(x), x['n'], e[2] if len(e) > 2 else 'named in film.json'), flush=True)
            for e in listed:
                if not any(named([e], x) for x in found):
                    print('  (long enough now) chapter %s, the shot at %.2f s: take it off the list in site-tools/shots_later.json' % (e[0], float(e[1])), flush=True)
            for e in brief:
                if not any(named([e], x) for x in found):
                    print('  (no longer brief) chapter %s, the shot at %.2f s: take it out of "brief" in film.json' % (e[0], float(e[1])), flush=True)
            if new:
                failed.append(key)
        if b:
            b.close()
    if failed:
        raise SystemExit('%d film%s with shots that never show, or show for less than %.1f s: %s. List each chapter\'s shots in the '
                         'order they start, and give each the time to be seen' % (len(failed), 's' if len(failed) > 1 else '', SHOT, ', '.join(failed)))
    print('every shot comes on screen, long enough to be seen' if not any(known.get(k) for k, *_ in todo) else 'no new shot is too short')


if __name__ == '__main__':
    main()
