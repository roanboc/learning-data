"""What a film times but never shows: the people kit's check that every shot comes on screen, and that every row of a board or a
page is written before its chapter ends. tools/check.py runs it, from a film's source folder; on its own:
python ../../../people-first/shared/tools/shown.py (after tools/build.py).

Measure the work, not the people, made again on 18 November 2026, had two faults that no other check saw, since a check that
measures the picture can't find what is never drawn:
- a shot that never shows. At each moment ag_shots shows the last shot in its list whose time (at) has come, so a shot listed
  before another that starts as early or earlier never comes on screen: Graham's answer from the campus was listed before the
  next shot but started after it, and was skipped (people.py still counted the chat, which is drawn in the shot before). It
  lists a shot that is on screen for less than SHOT seconds, or never: list the shots in the order they start, and give each
  the time to be seen, the last one until its chapter ends;
- a row written after its chapter ends. A board's row (PK.teach) or a page's (PK.notes) whose pen is still writing when its
  chapter ends is cut off, and the rest is never written: a page of Helena's notes was timed past its chapter's end. It lists
  words finished less than READ seconds before their chapter ends (a second to read them, as the kit's README asks before a
  film cuts away from a board), and a mark (a line under, a highlighter's band, a ring, a tick) finished less than MARK seconds
  before it, or after it: give the chapter a pause at its end (breathe, in the film's breath.js) and start the writing from it,
  or write it earlier.

Each chapter is drawn every STEP seconds on a small canvas, and each list of shots it hands ag_shots, and each board and page it
writes, is read as it is given: each row's strokes with the times the pen takes them (PK.inkPlan, as PK.written and the score's
tools/pens.py read them). A board far off, written as decoration (o.deco), is left out: the board seen close shows the same rows.
A chapter's draw run only to find where its camera is (ag_probe) is left out too."""
import sys

SHOT = 1.0   # seconds a shot is on screen, at least
READ = 1.0   # seconds between a row's last words and its chapter's end, at least
MARK = 0.3   # seconds between a mark's last stroke and its chapter's end, at least
STEP = 0.5   # seconds between two moments of a chapter read

JS = r"""(o)=>{
const probing=()=>typeof AG_PROBE!=="undefined"&&!!AG_PROBE,name=w=>typeof w==="string"?w:(w&&(w.key||w.name))||"someone";
const small=document.createElement("canvas");small.width=192;small.height=108;const sx=small.getContext("2d");
const big=document.createElement("canvas");big.width=1920;big.height=1080;const bx=big.getContext("2d");
let cur=null;const os=window.ag_shots,ot=PK.teach,on=PK.notes;
// each list of shots a chapter hands ag_shots, as it is given (once)
if(typeof os==="function")window.ag_shots=function(ctx,S,t,end,shots,dis){
  if(cur&&!probing()&&Array.isArray(shots)){const L=shots.map(s=>({at:+s.at,place:String(s.place||s.room||"")})),k=end+"|"+L.map(s=>s.at).join(",");
    if(!cur.lists.has(k))cur.lists.set(k,{end:+end,shots:L});}
  return os.apply(this,arguments);};
// each board and page a chapter writes: every stroke, with the times the pen takes it
const read=(kind,f)=>function(ctx,who,t,items,op){
  if(cur&&!probing()&&Array.isArray(items)&&!(op&&op.deco)){const k=kind+"|"+name(who)+"|"+items.map(it=>String(it.s||it.k||"")+"@"+it.at).join("|");
    if(!cur.seen.has(k)){cur.seen.add(k);
      try{for(const s of PK.inkPlan(bx,items,{})){const it=items[s.i]||{},m=s.m!=null?it.marks[s.m]:null,key=kind+"|"+name(who)+"|"+s.i+"|"+s.m+"|"+s.t0.toFixed(2);
        if(!cur.rows.has(key))cur.rows.set(key,{on:kind,who:name(who),words:String(it.s||""),mark:m?String(m[0]):(it.s?"":String(it.k||"drawing")),t0:s.t0,t1:s.t1});}}
      catch(e){}}}
  return f.apply(this,arguments);};
if(typeof ot==="function")PK.teach=read("board",ot);
if(typeof on==="function")PK.notes=read("page",on);
const out=[];
try{for(const sc of SCENES){cur={lists:new Map(),rows:new Map(),seen:new Set()};
    for(let t=0.05;t<sc.dur;t+=o.step){try{sc.draw(sx,0.1,t,sc);}catch(e){}}
    out.push({id:sc.id,dur:sc.dur,lists:[...cur.lists.values()],rows:[...cur.rows.values()]});cur=null;}}
finally{cur=null;window.ag_shots=os;PK.teach=ot;PK.notes=on;}
return out;}"""

# a pen's mark in words: on words of a row, and of its own
ON_WORDS = {'under': 'a line under', 'under2': 'two lines under', 'hl': "a highlighter's band over", 'strike': 'a line through',
            'box': 'a box round', 'ring': 'a ring round'}
ALONE = {'under': 'a line under', 'hl': "a highlighter's band", 'line': 'a line', 'arrow': 'an arrow', 'box': 'a box', 'ring': 'a ring',
         'tick': 'a tick', 'cross': 'a cross', 'star': 'a star', 'dot': 'a dot', 'drawing': 'a drawing'}


def on_screen(shots, end):
    """How long each shot of a list is on screen, in a chapter that ends at end: ag_shots shows the last shot whose at has come,
    and the first from the chapter's start. -> [(start, seconds), ...]"""
    out = []
    for k, s in enumerate(shots):
        a = 0.0 if k == 0 else s['at']
        b = min([q['at'] for q in shots[k + 1:]] + [end])
        out.append((a, max(0.0, b - a)))
    return out


def _stroke(r):
    """a row's stroke in words: "Nobody was slow" on Helena's page, or a highlighter's band over "Nobody was slow" on it"""
    on = "%s's %s" % (r['who'][:1].upper() + r['who'][1:], 'board' if r['on'] == 'board' else 'page')
    if not r['mark']:
        return '"%s" on %s' % (r['words'], on)
    if r['words'] and r['mark'] in ON_WORDS:
        return '%s "%s" on %s' % (ON_WORDS[r['mark']], r['words'], on)
    return '%s on %s' % (ALONE.get(r['mark'], 'a ' + r['mark']), on)


def problems(chapters, shot=SHOT, read=READ, mark=MARK):
    """What the chapters time but never show, as lines to print. -> (shots read, strokes read, the lines)"""
    probs, nshots, nrows = [], 0, 0
    for ch in chapters:
        dur = ch['dur']
        for L in ch['lists']:
            shots, end = L['shots'], min(L['end'], dur)
            nshots += len(shots)
            for k, (s, (a, n)) in enumerate(zip(shots, on_screen(shots, end))):
                if n >= shot:
                    continue
                what = 'the shot at %.1f s%s' % (s['at'], ' (%s)' % s['place'] if s['place'] else '')
                if k and s['at'] >= end:
                    probs.append('chapter %s: %s starts after its chapter ends (%.1f s), so it never shows' % (ch['id'], what, end))
                elif n <= 0:
                    q = min(shots[k + 1:], key=lambda q: q['at'])
                    probs.append('chapter %s: %s never shows: the shot at %.1f s%s is listed after it but starts no later, and ag_shots '
                                 'shows the last shot whose time has come. List the shots in the order they start'
                                 % (ch['id'], what, q['at'], ' (%s)' % q['place'] if q['place'] else ''))
                else:
                    probs.append('chapter %s: %s is on screen for %.1f s (at least %.1f s): give it the time to be seen, or leave it out'
                                 % (ch['id'], what, n, shot))
        for r in ch['rows']:
            nrows += 1
            room, need = dur - r['t1'], mark if r['mark'] else read
            if room >= need:
                continue
            if room < 0:
                probs.append('chapter %s: %s is written from %.1f to %.1f s, after its chapter ends (%.1f s), so it is cut off: give the '
                             'chapter a pause at its end (breathe) and start the writing from it, or write it earlier'
                             % (ch['id'], _stroke(r), r['t0'], r['t1'], dur))
            else:
                probs.append('chapter %s: %s is finished %.1f s before its chapter ends (at least %.1f s%s): give the chapter a longer '
                             'pause at its end (breathe), or write it earlier'
                             % (ch['id'], _stroke(r), room, need, '' if r['mark'] else ', to read it'))
    return nshots, nrows, probs


def check(pg):
    r = pg.evaluate(JS, {'step': STEP})
    nshots, nrows, probs = problems(r)
    return ('read %d shots and %d strokes of boards and pages in %d chapters' % (nshots, nrows, len(r)), probs)


if __name__ == '__main__':
    import pathlib
    sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
    from lang import *
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b, pg = render_page(p)
        head, probs = check(pg)
        b.close()
    print(head)
    for l in probs:
        print('  ' + l)
    if probs:
        raise SystemExit('%d things timed but never shown' % len(probs))
    print('every shot comes on screen, and every row is written before its chapter ends')
