"""No row of torsos: people who act, meet or work in a place are seen whole in it, not lined up as half-figures in front of it.
The module's check.py runs it after the agent films' checks; python tools/check.py runs it, or on its own, from a film's source
folder: python tools/rows.py (it needs the film built: python tools/build.py).

In Owning the outcome three farmers and Wangari Maathai stood in a row, cut at the waist, at one size and one height, in front of the
hills they were planting (issue 391, the author, 12 November 2026). The people of these films were half-figures only, so every scene
lined them up the same way, and the place behind them, with nothing to do, became plain. People who do something, together or in
their place, are drawn whole, standing, walking, sitting or kneeling where they are (lp_body, people.js); half-figures stay for
talk seen close, and for a person or two at a time.

It draws the film every half second on a small canvas and notes each person the module draws (lp_person and lp_body, and the agent
films' ag_person when a film calls it), whole or cut at the waist, where they land on the frame and how big. It lists each time
ROW or more half-figures are seen at once, more than faintly, at about one size (within SIZE of each other) with their necks at
about one height (within LEVEL px of the 1920 px frame), for HOLD seconds or more: a row of torsos. A film names a row that is meant
in its film.json (`rows`: [{"chapter": ..., "why": ...}]). The films that had rows when the check came in are listed in
rows_later.json, each until its people are drawn again: a listed film's rows are printed, not failed."""
import json, pathlib, sys

ROW = 3        # half-figures in a row
SIZE = 0.15    # their sizes within this share of each other
LEVEL = 60     # px in the 1920 px frame: their necks at about one height
HOLD = 2.0     # seconds a row stays before it counts
OPAQUE = 0.5   # a person this faint or fainter isn't counted
STEP = 0.5     # seconds between the frames it draws
LATER = pathlib.Path(__file__).resolve().parent / 'rows_later.json'

JS = r"""(o)=>{
const S=0.1,main=document.createElement("canvas");main.width=192;main.height=108;const mx=main.getContext("2d");
const H={on:false,depth:0,seen:[]};
const keep=(ctx,x,y,s,whole,op)=>{if(!H.on||H.depth)return;const c=ctx.canvas;if(c.width!==192||c.height!==108)return;
  const m=ctx.getTransform(),k=Math.hypot(m.a,m.b),a=ctx.globalAlpha*(op&&op.a!=null?op.a:1);
  H.seen.push({x:(m.a*x+m.c*y+m.e)/S,y:(m.b*x+m.d*y+m.f)/S,z:k*s/S,whole,a});};
for(const nm of["lp_person","ag_person"]){if(typeof window[nm]!=="function")continue;const of=window[nm];
  window[nm]=function(ctx,who,x,y,s,op){keep(ctx,x,y,s,!!(op&&op.__legs),op);H.depth++;try{return of.apply(this,arguments);}finally{H.depth--;}};}
const rows=[];let n=0;
for(let T=0;T<TL.total;T+=o.step){const c=SCENES[sceneIndex(T)];H.seen=[];H.depth=0;n++;
  mx.setTransform(1,0,0,1,0,0);mx.globalAlpha=1;mx.clearRect(0,0,192,108);H.on=true;try{renderFrame(mx,S,T);}catch(e){}H.on=false;
  // the half-figures seen, in the frame: their necks inside it
  const ps=H.seen.filter(p=>!p.whole&&p.a>o.opaque&&p.x>-50&&p.x<1970&&p.y>-50&&p.y<1080);let best=0;
  for(const p of ps){const g=ps.filter(q=>Math.abs(q.y-p.y)<=o.level&&Math.abs(q.z-p.z)<=o.size*Math.max(q.z,p.z));best=Math.max(best,g.length);}
  rows.push({t:T,chap:c.id,at:T-c.start,n:best});}
return{frames:n,rows};}"""


def check(pg, key=None):
    """Run on a page with the film loaded (lang.render_page). Returns (what it checked, a line for each row of torsos)."""
    r = pg.evaluate(JS, dict(step=STEP, opaque=OPAQUE, level=LEVEL, size=SIZE))
    meta = json.loads((pathlib.Path.cwd() / 'film.json').read_text())
    meant = {m['chapter'] for m in meta.get('rows', [])}
    runs, cur = [], None
    for f in r['rows']:
        if f['n'] >= ROW and f['chap'] not in meant:
            if cur and cur['chap'] == f['chap'] and abs(f['t'] - cur['end'] - STEP) < 1e-6:
                cur['end'] = f['t']; cur['n'] = max(cur['n'], f['n'])
            else:
                cur = dict(chap=f['chap'], t=f['t'], at=f['at'], end=f['t'], n=f['n']); runs.append(cur)
        else:
            cur = None
    lines = ['%7.2f s  %-10s +%-6.2f %d half-figures in a row for %.1f s: draw them whole, in their place (lp_body), or fewer at a time' % (
        u['t'], u['chap'], u['at'], u['n'], u['end'] - u['t'] + STEP) for u in runs if u['end'] - u['t'] + STEP >= HOLD]
    return 'looked at %d frames for rows of torsos' % r['frames'], lines


def later():
    return set(json.loads(LATER.read_text())['films']) if LATER.exists() else set()


if __name__ == '__main__':
    from lang import render_page, META
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b, pg = render_page(p)
        msg, bad = check(pg)
        b.close()
    print('rows.py:', msg)
    for l in bad:
        print('  ' + l)
    if bad and META['key'] not in later():
        sys.exit('rows.py: %d rows of torsos (see above)' % len(bad))
    if bad:
        print('rows.py: listed in rows_later.json, so not failed yet')
    elif META['key'] in later():
        print('rows.py: no rows left: take %s out of rows_later.json' % META['key'])
