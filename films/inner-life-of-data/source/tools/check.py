"""Check that every moment of the film draws without an error, before a long render: python tools/check.py (or with FILM_LANG=es).
It draws every frame the video will (30 a second) on a small canvas, which takes about a minute, and lists any moment that fails:
a shape that breaks for one frame stops a full render (PLAYBOOK.md, "Check every frame, not every tenth of a second").
Then nothing may show twice where one chapter meets the next (the governance films' twice.py, as From words to data's check.py runs
it): where both chapters show the same words a little apart or at another size, the engine's fade shows them twice, like a ghost.
Such a join carries the picture on, lets what was there leave first, or cuts (CHAPTER_JOINS, after the film's last scene())."""
import pathlib,sys
from lang import *
from playwright.sync_api import sync_playwright
sys.path.append(str(next(q for q in pathlib.Path(__file__).resolve().parents if q.name=='films')/'data-governance'/'shared'/'tools'));import twice
with sync_playwright() as p:
    b=p.chromium.launch(args=["--allow-file-access-from-files"]);pg=b.new_page();pg.goto((DIST/'render.html').as_uri());pg.wait_for_function("window.__READY__===true",timeout=90000)
    r=pg.evaluate("""()=>{const c=document.createElement('canvas');c.width=192;c.height=108;const x=c.getContext('2d'),bad=[];let n=0;
      for(let f=0;f<TL.total*30;f++){const t=f/30;n++;try{renderFrame(x,0.1,t);}catch(e){bad.push([+t.toFixed(2),SCENES[sceneIndex(t)].id,e.message]);}}return{n,bad,total:TL.total};}""")
    tw=None if r['bad'] else twice.check(pg);b.close()
print('checked %d frames over %.1f s'%(r['n'],r['total']))
for t,sid,msg in r['bad'][:20]:print('  %6.1f s  %-8s %s'%(t,sid,msg))
if r['bad']:raise SystemExit('%d moments fail to draw'%len(r['bad']))
print('every moment draws')
print(tw[0])
for l in tw[1]:print('  '+l)
if tw[1]:raise SystemExit('%d chapter joins show something twice'%len(tw[1]))
print('nothing shows twice where one chapter meets the next')
