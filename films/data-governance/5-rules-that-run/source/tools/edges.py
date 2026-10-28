"""No word cut by the frame: python tools/edges.py, from this film's source folder, after tools/build.py (tools/check.py runs it too).

A copy of *Fixed where it starts*' check (28 October 2026). In this film the camera closes on Yusuf's printed scorecard at the end, and
the frame cut the survey's chart beside it: "ality survey", "em" and "form" stood at the frame's left edge for seconds. Neither the
series' checks nor tools/legible.py saw it: they skip text drawn as decoration, as that chart was at that size, and this check, as first
written, skipped any word drawn turned, as the chart is, by half a degree. This draws the film every quarter of a second and fails on
any word, decoration or not, turned by up to about 3 degrees, that shows (more than half its ink) and that the frame's left or right edge
cuts, wherever its anchor is. Fade such words as the frame comes to them (rr_fadeCut in src/plan.js), as the playbook says."""
import pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[3] / 'shared' / 'tools'))
import run  # the series' tools first, then From words to data's
from lang import *
from playwright.sync_api import sync_playwright

EVERY = 0.25
JS = r"""([EV])=>{const hits={};let sid="",tnow=0;
 const c=document.createElement('canvas');c.width=1920;c.height=1080;const x=c.getContext('2d');
 const P=CanvasRenderingContext2D.prototype,F0=P.fillText;
 const alphaOf=st=>{if(typeof st!=="string")return 1;const m=st.match(/rgba?\(([^)]+)\)/);if(m){const p=m[1].split(',');return p.length>3?parseFloat(p[3]):1;}return 1;};
 P.fillText=function(s,X,Y){if(this.canvas===c&&s!=null&&String(s).trim()){const m=this.getTransform(),k=Math.sqrt(Math.abs(m.a*m.d-m.b*m.c));
   const a=this.globalAlpha*alphaOf(this.fillStyle),fx=m.a*X+m.c*Y+m.e,fy=m.b*X+m.d*Y+m.f;
   if(a>0.5&&Math.abs(m.b)<=0.05*Math.abs(m.a)&&fy>0&&fy<1110){const w=this.measureText(s).width*k,al=this.textAlign,x0=al==="center"?fx-w/2:(al==="right"||al==="end")?fx-w:fx;
     if(x0+w>8&&x0<1912&&(x0<-2||x0+w>1922)){const key=sid+"\u0000"+s;if(!hits[key])hits[key]=[sid,+tnow.toFixed(2),String(s),Math.round(x0),Math.round(x0+w)];}}}
  return F0.apply(this,arguments);};
 for(let t=0;t<TL.total;t+=EV){sid=SCENES[sceneIndex(t)].id;tnow=t;renderFrame(x,1,t);}
 P.fillText=F0;return Object.values(hits);}"""
with sync_playwright() as p:
    b, pg = render_page(p)
    hits = pg.evaluate(JS, [EVERY])
    b.close()
for sid, t, s, x0, x1 in hits:
    print('  %-8s %6.2f s  "%s" runs from x %d to %d, cut by the frame' % (sid, t, s, x0, x1))
if hits:
    raise SystemExit('%d words cut by the frame\'s edge: fade them as the frame comes to them (rr_fadeCut)' % len(hits))
print('no word cut by the frame\'s edge, decoration included')
