"""Check that every moment of the film draws without an error, before a long render: python tools/check.py (or with FILM_LANG=es).
It draws the film every tenth of a second on a small canvas, which takes about half a minute, and lists any moment that fails."""
from lang import *
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(args=["--allow-file-access-from-files"]);pg=b.new_page();pg.goto((DIST/'render.html').as_uri());pg.wait_for_function("window.__READY__===true",timeout=90000)
    r=pg.evaluate("""()=>{const c=document.createElement('canvas');c.width=192;c.height=108;const x=c.getContext('2d'),bad=[];let n=0;
      for(let t=0;t<TL.total;t+=0.1){n++;try{renderFrame(x,0.1,t);}catch(e){bad.push([+t.toFixed(1),SCENES[sceneIndex(t)].id,e.message]);}}return{n,bad,total:TL.total};}""");b.close()
print('checked %d moments over %.1f s'%(r['n'],r['total']))
for t,sid,msg in r['bad'][:20]:print('  %6.1f s  %-8s %s'%(t,sid,msg))
if r['bad']:raise SystemExit('%d moments fail to draw'%len(r['bad']))
print('every moment draws')
