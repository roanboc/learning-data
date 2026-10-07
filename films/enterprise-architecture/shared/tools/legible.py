"""Check that on-screen text is large enough to read on a phone: python tools/legible.py [--min 28] [--every 0.5]
A phone held sideways, full screen, shows the 1920-pixel frame about 850 pixels wide, so text drawn 28 px high in the frame is
about 12 px on the phone: the smallest that reads comfortably. This draws the film every half second (captions off, as in the
video), records the size every piece of text is drawn at, after the camera's zoom, while it's clearly visible (opacity over 0.6),
and lists, per chapter, the text drawn smaller than --min, allowing 5% for things still settling as they arrive.
It fails if any is."""
import argparse
from lang import *
from playwright.sync_api import sync_playwright

ap = argparse.ArgumentParser(description=__doc__)
ap.add_argument('--min', type=float, default=28)
ap.add_argument('--every', type=float, default=0.5)
A = ap.parse_args()
with sync_playwright() as p:
    b, pg = render_page(p)
    r = pg.evaluate("""([MIN,EV])=>{const seen={},T0=window.T;let sid="";
      window.T=function(ctx,s,x,y,o){const m=ctx.getTransform(),k=Math.sqrt(Math.abs(m.a*m.d-m.b*m.c)),sz=((o&&o.size)||24)*k,a=ctx.globalAlpha;
        if(a>0.6&&s&&String(s).trim()&&!(o&&o.deco)){const key=sid+"\\u0000"+s;if(!seen[key]||sz<seen[key])seen[key]=sz;}return T0(ctx,s,x,y,o);};
      const c=document.createElement('canvas');c.width=1920;c.height=1080;const x=c.getContext('2d');
      for(let t=0;t<TL.total;t+=EV){sid=SCENES[sceneIndex(t)].id;renderFrame(x,1,t);}
      window.T=T0;const out=[];for(const k in seen){const[s,str]=k.split("\\u0000");out.push([s,str,+seen[k].toFixed(1)]);}return out;}""", [A.min, A.every])
    b.close()
bad = sorted([x for x in r if x[2] < A.min * 0.95], key=lambda x: (x[0], x[2]))
order = {}
for s, _, _ in r:
    order.setdefault(s, len(order))
print('%d pieces of text, %d drawn smaller than %g px' % (len(r), len(bad), A.min))
for sid in sorted({x[0] for x in bad}, key=lambda s: order.get(s, 99)):
    xs = [x for x in bad if x[0] == sid]
    print('  %-10s %3d: ' % (sid, len(xs)) + ' · '.join('%s (%g)' % (x[1][:40], x[2]) for x in xs[:12]) + (' …' if len(xs) > 12 else ''))
if bad:
    raise SystemExit('%d pieces of text are too small to read on a phone' % len(bad))
print('all text reads on a phone')
