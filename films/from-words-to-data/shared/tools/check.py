"""Check that every moment of the film draws without an error, before a long render: python tools/check.py
It draws every frame of the film (30 a second, as the video does) on a small canvas, in a minute or two, and lists any moment that fails.
Then nothing may show twice where one chapter meets the next (the governance films' twice.py): the engine lays the end of each
chapter over the next one's first 0.8 s, and where both show the same words a little apart or at another size, those words show
twice for that time, like a ghost. Such a join carries the picture on, lets what was there leave first, or cuts (CHAPTER_JOINS,
in shared/src/joins.js). The governance and agent films run this file first and twice.py later, with their own checks, so they
set TWICE to False."""
import pathlib, sys
from lang import *
from playwright.sync_api import sync_playwright

TWICE = globals().get('TWICE', True)
if TWICE:
    sys.path.append(str(pathlib.Path(__file__).resolve().parents[3] / 'data-governance' / 'shared' / 'tools'))
    import twice

with sync_playwright() as p:
    b, pg = render_page(p)
    r = pg.evaluate("""()=>{const c=document.createElement('canvas');c.width=192;c.height=108;const x=c.getContext('2d'),bad=[];let n=0;
      for(let f=0;f/30<TL.total;f++){const t=f/30;n++;try{renderFrame(x,0.1,t);}catch(e){bad.push([+t.toFixed(2),SCENES[sceneIndex(t)].id,e.message]);}}
      return{n,bad,total:TL.total,scenes:SCENES.length};}""")
    tw = twice.check(pg) if TWICE and not r['bad'] else None
    b.close()
print('checked %d moments over %.1f s, %d chapters' % (r['n'], r['total'], r['scenes']))
for t, sid, msg in r['bad'][:20]:
    print('  %7.2f s  %-10s %s' % (t, sid, msg))
if r['bad']:
    raise SystemExit('%d moments fail to draw' % len(r['bad']))
print('every moment draws')
if tw:
    print(tw[0])
    for l in tw[1]:
        print('  ' + l)
    if tw[1]:
        raise SystemExit('%d chapter joins show something twice' % len(tw[1]))
    print('nothing shows twice where one chapter meets the next')
