"""Every word stands out from what is behind it: python tools/contrast.py [--min 4.5] [--every 0.5]
The module's look puts words on frosted glass and on solid colour (glass.js): ice white on the glass, dark words on a band, a pill or a
tick. A word reads only when it stands out from what is behind it, by at least 4.5 to 1 (the WCAG ratio for text), and on glass what
is behind a word changes with the place behind it and the light on it. The author asked for it on 5 November 2026: no faded colours.

This draws the film every half second, as the video does (captions off), twice: once with every word drawn on the frame in pure
magenta, and once with no words on the frame at all. Where a word's magenta shows, uncovered, are its glyphs; a word whose glyphs a
veil, a dissolve or a card drawn over it covers isn't meant to be read then, and isn't measured. For each word fully shown (its
opacity, with its colour's, at least 0.95), it measures its colour against what is behind its glyphs, where that is worst (the tenth
of every hundred of their pixels), and keeps the lowest ratio it finds for each word in each chapter. It lists every word under --min,
with its worst ratio and when, and fails if there is any. Decoration ({deco:1}, as legible.py skips it) isn't measured, nor are words
drawn anywhere but on the frame (in a dissolve's buffer, a chapter fading out, a hidden value under frost): they are drawn as they
are, as part of what is behind."""
import argparse
from lang import *
from playwright.sync_api import sync_playwright

ap = argparse.ArgumentParser(description=__doc__)
ap.add_argument('--min', type=float, default=4.5)
ap.add_argument('--every', type=float, default=0.5)
A = ap.parse_args()

JS = r"""([EV,MIN])=>{const worst={};let sid="",mode=0,deco=0,rec=[];
 const c=document.createElement('canvas');c.width=1920;c.height=1080;const x=c.getContext('2d',{willReadFrequently:true});
 const T0=window.T;window.T=function(ctx,s,X,Y,o){const d=deco;if(o&&o.deco)deco++;try{return T0(ctx,s,X,Y,o);}finally{deco=d;}};
 const P=CanvasRenderingContext2D.prototype,F0=P.fillText;
 // a fillStyle as the canvas gives it back: "#rrggbb" when opaque, "rgba(r, g, b, a)" when not
 const colOf=st=>{if(typeof st!=="string")return null;let m=st.match(/^#([0-9a-f]{6})$/i);if(m){const v=parseInt(m[1],16);return [v>>16&255,v>>8&255,v&255,1];}
   m=st.match(/rgba?\(([^)]+)\)/);if(m){const p=m[1].split(",").map(parseFloat);return [p[0],p[1],p[2],p.length>3?p[3]:1];}return null;};
 // mode 1: the frame's own words in pure magenta (their opacity kept), so where each one shows, and whether something covers it, can be
 // seen; mode 2: no words on the frame at all, so what is behind them can be measured. Words drawn anywhere else are drawn as they are.
 P.fillText=function(s,X,Y){if(this.canvas!==c)return F0.apply(this,arguments);if(s==null||!String(s).trim())return;const col=colOf(this.fillStyle);
   if(mode===1){this.save();this.fillStyle="rgba(255,0,255,"+(col?col[3]:1)+")";this.shadowColor="rgba(0,0,0,0)";F0.apply(this,arguments);this.restore();return;}
   const m=this.getTransform();if(deco||!col||Math.abs(m.b)>1e-6||Math.abs(m.c)>1e-6)return;const a=this.globalAlpha*col[3];if(a<0.95)return;
   const k=Math.sqrt(Math.abs(m.a*m.d)),fm=this.font.match(/([\d.]+)px/),sz=(fm?parseFloat(fm[1]):10)*k,w=this.measureText(s).width*k;
   const fx=m.a*X+m.e,fy=m.d*Y+m.f,al=this.textAlign,bl=this.textBaseline,x0=al==="center"?fx-w/2:(al==="right"||al==="end")?fx-w:fx,
         top=bl==="middle"?fy-sz*0.5:bl==="top"||bl==="hanging"?fy:fy-sz*0.8;
   rec.push({s:String(s),col,x0:x0-2,y0:top-2,w:w+4,h:sz*1.05+4,sz});};
 const L=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);},LT=new Float32Array(256);for(let i=0;i<256;i++)LT[i]=L(i);
 const lum=(r,g,b)=>0.2126*LT[r|0]+0.7152*LT[g|0]+0.0722*LT[b|0],ratio=(p,q)=>(Math.max(p,q)+0.05)/(Math.min(p,q)+0.05);
 const draw=()=>{x.setTransform(1,0,0,1,0,0);x.globalAlpha=1;x.globalCompositeOperation="source-over";x.clearRect(0,0,1920,1080);renderFrame(x,1,tnow);};
 let n=0,covered=0,tnow=0;
 for(let t=0;t<TL.total;t+=EV){tnow=t;sid=SCENES[sceneIndex(t)].id;rec=[];mode=1;draw();const dm=x.getImageData(0,0,1920,1080).data;mode=2;draw();if(!rec.length)continue;
   const db=x.getImageData(0,0,1920,1080).data;
   for(const r of rec){const X0=Math.max(0,Math.floor(r.x0)),Y0=Math.max(0,Math.floor(r.y0)),X1=Math.min(1920,Math.ceil(r.x0+r.w)),Y1=Math.min(1080,Math.ceil(r.y0+r.h));
     if(X1-X0<4||Y1-Y0<4)continue;let foot=0;const core=[];
     for(let yy=Y0;yy<Y1;yy++)for(let xx=X0;xx<X1;xx++){const p=(yy*1920+xx)*4,dr=dm[p]-db[p],dg=dm[p+1]-db[p+1],dbl=dm[p+2]-db[p+2];
       if(Math.max(Math.abs(dr),Math.abs(dg),Math.abs(dbl))<=30)continue;foot++;
       // a glyph's core: magenta, uncovered (a veil, a dissolve or a card drawn over the word darkens or mixes it)
       if(dm[p]>=200&&dm[p+1]<=70&&dm[p+2]>=200)core.push(lum(db[p],db[p+1],db[p+2]));}
     if(foot<8)continue;if(core.length<Math.max(6,foot*0.25)){covered++;continue;}
     // the word's colour against what is behind its glyphs, where it is worst (the tenth of every hundred pixels of its cores)
     const lw=lum(r.col[0],r.col[1],r.col[2]),rs=core.map(lb=>ratio(lw,lb)).sort((a,b)=>a-b),cr=rs[Math.floor(rs.length*0.1)];n++;
     const key=sid+"\u0000"+r.s,o=worst[key];if(!o||cr<o.cr)worst[key]={cr,t,col:r.col.slice(0,3).map(v=>Math.round(v))};}}
 P.fillText=F0;window.T=T0;const out=[];for(const k in worst){const [s,str]=k.split("\u0000"),o=worst[k];out.push([s,str,+o.cr.toFixed(2),+o.t.toFixed(1),o.col]);}
 return {n,covered,words:out};}"""

with sync_playwright() as p:
    b, pg = render_page(p)
    r = pg.evaluate(JS, [A.every, A.min])
    b.close()
words = r['words']
low = sorted([w for w in words if w[2] < A.min], key=lambda w: (w[3], w[2]))
lowest = min(words, key=lambda w: w[2]) if words else None
print('measured %d words (%d different) every %g s, and left %d covered by something drawn over them; the lowest stands out %s' % (r['n'], len(words), A.every, r['covered'],
      '%.2f to 1 ("%s", %s at %.1f s)' % (lowest[2], lowest[1], lowest[0], lowest[3]) if lowest else 'nowhere: no words'))
for sid in dict.fromkeys(w[0] for w in low):
    print('%s:' % sid)
    for w in [w for w in low if w[0] == sid]:
        print('  %.2f to 1 at %5.1f s, rgb%s: %s' % (w[2], w[3], tuple(w[4]), w[1]))
if low:
    raise SystemExit('%d words stand out less than %g to 1 from what is behind them' % (len(low), A.min))
print('every word stands out at least %g to 1 from what is behind it' % A.min)
