"""Check that on-screen text reads on a phone: python tools/legible.py [--min 28] [--every 0.5] [--overlaps]
A phone held sideways, full screen, shows the 1920-pixel frame about 850 pixels wide, so text drawn 28 px high in the frame is
about 12 px on the phone: the smallest that reads comfortably. This draws the film every half second (captions off, as in the
video) and records every piece of text drawn on the frame, at the size it's drawn after the camera's zoom, while it's clearly
visible (its opacity, with its colour's, over 0.5). It measures what the canvas draws, so text from every component counts, not
only what goes through T. It lists, per chapter, the text drawn smaller than --min (allowing 5% for things still settling as
they arrive), with the function that drew it, and fails if there is any. Text marked as decoration ({deco:1}, or drawn inside
phDeco) is skipped, and so is text drawn into a cached picture.
--overlaps also lists text that runs off the frame or over other text: what larger words most often break."""
import argparse
from lang import *
from playwright.sync_api import sync_playwright

if 'render_page' not in globals():  # the films made before the series tools: their lang.py names DIST, and render.html is the same
    def render_page(p):
        b = p.chromium.launch(args=["--allow-file-access-from-files"]); pg = b.new_page(viewport={"width": 1920, "height": 1080})
        pg.goto((DIST / 'render.html').as_uri()); pg.wait_for_function("window.__READY__===true", timeout=120000)
        return b, pg

ap = argparse.ArgumentParser(description=__doc__)
ap.add_argument('--min', type=float, default=28)
ap.add_argument('--every', type=float, default=0.5)
ap.add_argument('--overlaps', action='store_true')
A = ap.parse_args()
JS = r"""([EV,MIN,OV])=>{const seen={},hits={};let sid="",tnow=0,deco=0,boxes=[];
 const c=document.createElement('canvas');c.width=1920;c.height=1080;const x=c.getContext('2d');
 const T0=window.T;window.T=function(ctx,s,X,Y,o){const d=deco;if(o&&o.deco)deco++;try{return T0(ctx,s,X,Y,o);}finally{deco=d;}};
 const P=CanvasRenderingContext2D.prototype,F0=P.fillText;
 const alphaOf=st=>{if(typeof st!=="string")return 1;const m=st.match(/rgba?\(([^)]+)\)/);if(m){const p=m[1].split(',');return p.length>3?parseFloat(p[3]):1;}return 1;};
 const who=()=>(new Error().stack||"").split("\n").slice(3).map(l=>l.trim().replace(/^at /,"").split(" ")[0]).filter(n=>n&&!/^(T|window\.T|withA|Array\.forEach|Object\.draw|renderFrame|eval|f)$/.test(n)&&!n.startsWith("file:")&&!n.startsWith("<anon")).slice(0,2).join(" < ")||"the scene";
 P.fillText=function(s,X,Y){const off=deco||(typeof PH_OFF!=="undefined"&&PH_OFF);if(this.canvas===c&&!off&&s!=null&&String(s).trim()){const m=this.getTransform(),k=Math.sqrt(Math.abs(m.a*m.d-m.b*m.c));
   const fm=this.font.match(/([\d.]+)px/),px=fm?parseFloat(fm[1]):10,sz=px*k,a=this.globalAlpha*alphaOf(this.fillStyle);
   const fx=m.a*X+m.c*Y+m.e,fy=m.b*X+m.d*Y+m.f;
   if(a>0.5&&fx>-40&&fx<1960&&fy>0&&fy<1110){const key=sid+"\u0000"+s,r=seen[key];if(!r||sz<r.sz)seen[key]={sz,t:tnow,who:sz<MIN*0.95?who():""};
     if(OV&&Math.abs(m.b)<1e-6){const w=this.measureText(s).width*k,al=this.textAlign,bl=this.textBaseline;const x0=al==="center"?fx-w/2:(al==="right"||al==="end")?fx-w:fx;
       const top=bl==="middle"?fy-sz*0.36:bl==="top"||bl==="hanging"?fy:fy-sz*0.72;boxes.push([x0,top,x0+w,top+sz*0.72,String(s),sz]);}}}
  return F0.apply(this,arguments);};
 const flag=(k,v)=>{if(!hits[k])hits[k]=v;};
 for(let t=0;t<TL.total;t+=EV){const i=sceneIndex(t);sid=SCENES[i].id;tnow=t;boxes=[];renderFrame(x,1,t);
   if(OV){for(const b of boxes){if(b[0]<-2||b[2]>1922)flag(sid+"\u0000off\u0000"+b[4],[sid,t,"runs off the frame",b[4],""]);}
     for(let p=0;p<boxes.length;p++)for(let q=p+1;q<boxes.length;q++){const A=boxes[p],B=boxes[q];if(A[4]===B[4])continue;
       const ix=Math.min(A[2],B[2])-Math.max(A[0],B[0]),iy=Math.min(A[3],B[3])-Math.max(A[1],B[1]);if(ix<=4||iy<=4)continue;
       const ar=Math.min((A[2]-A[0])*(A[3]-A[1]),(B[2]-B[0])*(B[3]-B[1]));if(ix*iy>0.15*ar)flag(sid+"\u0000ov\u0000"+A[4]+"\u0000"+B[4],[sid,t,"overlaps",A[4],B[4]]);}}}
 P.fillText=F0;window.T=T0;const out=[];for(const k in seen){const[s,str]=k.split("\u0000");const r=seen[k];out.push([s,str,+r.sz.toFixed(1),+r.t.toFixed(1),r.who]);}
 return {texts:out,hits:Object.values(hits)};}"""
with sync_playwright() as p:
    b, pg = render_page(p)
    r = pg.evaluate(JS, [A.every, A.min, A.overlaps])
    b.close()
texts = r['texts']
bad = sorted([x for x in texts if x[2] < A.min * 0.95], key=lambda x: (x[0], x[3]))
order = {}
for x in sorted(texts, key=lambda x: x[3]):
    order.setdefault(x[0], len(order))
print('%d pieces of text, %d drawn smaller than %g px' % (len(texts), len(bad), A.min))
for sid in sorted({x[0] for x in bad}, key=lambda s: order.get(s, 99)):
    xs = [x for x in bad if x[0] == sid]
    print('  %-10s %3d: ' % (sid, len(xs)) + ' · '.join('%s (%g, %.0fs, %s)' % (x[1][:32], x[2], x[3], x[4]) for x in xs[:14]) + (' …' if len(xs) > 14 else ''))
if A.overlaps:
    hs = sorted(r['hits'], key=lambda h: h[1])
    print('%d places where text runs off the frame or over other text' % len(hs))
    for h in hs:
        print('  %-10s %6.1fs  %s: %s%s' % (h[0], h[1], h[2], h[3][:40], ' / ' + h[4][:40] if h[4] else ''))
if bad:
    raise SystemExit('%d pieces of text are too small to read on a phone' % len(bad))
print('all text reads on a phone')
