"""Every hand belongs to an arm of a person's size. This series' check.py runs it after steady.py; or on its own, from a film's source
folder: python ../../shared/tools/hands.py (the other series' films: python ../../../data-governance/shared/tools/hands.py).

Rodrigo saw "extra long arms and floating hands" (Who does what, end to end, 10 November 2026): a hand laid on a book with no arm to it,
a sleeve running from the pen in a teacher's hand to the far corner of the frame, three times as long as an arm, and two thumbs in the
middle of a card held at the chest, with nothing joining them to the arms behind it. It checks the two ways those come about.

1. A hand drawn on its own, in from the frame's edge (a close shot of a hand writing, holding, pointing), tells the check where it is:
   its helper calls window.__ARM__(ctx, wx, wy, ax, ay, len) as it draws, with the wrist (wx, wy), a point further along the arm towards
   the shoulder (ax, ay), and the hand's length from wrist to fingertip, in the units it draws in. Its arm must leave the frame within
   REACH hand lengths of the wrist: a forearm and an upper arm are about three. A sleeve that fades into the dark before the edge (the
   analytics engineering films' night scenes) passes its fade's length, wrist to gone, as a seventh argument, and that counts instead.
   A longer sleeve means a shoulder inside the frame, with no body there, or a giant's arm. Come in closer, scale the hand up as
   a hand nearer the camera, or draw the person and their own arm (as Who does what, end to end does: ee_reachPose).
   A hand with no arm to the frame's edge is never drawn on its own: the person's own arm reaches it.
2. Two thumbs on a thing held in both hands go at the thing's edges, where the hands hold it. The series' hold pose crosses the forearms
   behind the thing, so its two hands sit close together in the middle of it (about 60 of the figure's units apart); thumbs drawn there,
   fingers(cx, P_, [l, r]) with the hands as they are, float in the middle of a card. It lists every two thumbs on a held thing (a
   person's carry) that the thing reaches OUT units past, on both sides: draw them at its half-width from its middle. A spade's handle
   or a jug, held with the thumbs at its sides, passes.

It draws every third frame, 10 a second, at 768 px wide, and lists each helper or person, the chapter and the times it was wrong."""
import sys

REACH = 3.5   # hand lengths, wrist to the frame's edge, that an arm may show
OUT = 24      # the figure's units: what is held, this far out past each of two thumbs, means they sit inside it, not at its edges

JS = r"""(o)=>{
const S=0.4,REACH=o.reach,OUT=o.out;
const main=document.createElement("canvas");main.width=768;main.height=432;const mx=main.getContext("2d");
const at=(m,x,y)=>[m.a*x+m.c*y+m.e,m.b*x+m.d*y+m.f];
const bad=[];let on=false,T=0,chap="",who=[];
// 1. arms in from the frame's edge: how far the sleeve runs, wrist to edge, in hand lengths
window.__ARM__=function(ctx,wx,wy,ax,ay,len,fade){if(!on||ctx.globalAlpha<0.05)return;const m=ctx.getTransform(),w=at(m,wx,wy),a=at(m,ax,ay),k=Math.hypot(m.a,m.b),
    cw=ctx.canvas.width,ch=ctx.canvas.height;if(w[0]<0||w[1]<0||w[0]>cw||w[1]>ch)return;
  let ux=a[0]-w[0],uy=a[1]-w[1];const l=Math.hypot(ux,uy);if(!(l>0))return;ux/=l;uy/=l;
  const ts=[ux>0?(cw-w[0])/ux:ux<0?-w[0]/ux:1e9,uy>0?(ch-w[1])/uy:uy<0?-w[1]/uy:1e9],d=Math.min(...ts,fade>0?fade*k:1e9),r=d/(len*k);
  if(r>REACH)bad.push({kind:"arm",t:T,chap,who:(new Error().stack.split("\n")[2]||"").trim().replace(/^at /,"").split(" ")[0],v:r});};
// 2. two thumbs on a held thing with the thing on past both of them: they float in its middle. What the person holds (op.carry) is drawn
// on the figure's canvas over a copy kept just before; a pixel that changed since is the thing
if(typeof person==="function"&&typeof fingers==="function"){const o0=person,f0=fingers,cp=document.createElement("canvas"),cq=cp.getContext("2d",{willReadFrequently:true});
  person=function(ctx,id,x,y,s,op){const A=[...arguments];let cur={id,snap:null};
    if(op&&op.carry){const c0=op.carry;A[5]=Object.assign({},op,{carry:function(cx,P_,h){const c=cx.canvas;if(on){if(cp.width!==c.width||cp.height!==c.height){cp.width=c.width;cp.height=c.height;}
      cq.setTransform(1,0,0,1,0,0);cq.clearRect(0,0,cp.width,cp.height);cq.drawImage(c,0,0);cur.snap=cx;}return c0.apply(this,arguments);}});}
    who.push(cur);try{return o0.apply(this,A);}finally{who.pop();}};
  const px=(cx,p)=>{const q=at(cx.getTransform(),p[0],p[1]),X=Math.round(q[0]),Y=Math.round(q[1]);if(X<0||Y<0||X>=cx.canvas.width||Y>=cx.canvas.height)return null;return[X,Y];};
  const changed=(cx,p)=>{const q=px(cx,p);if(!q)return false;const u=cx.getImageData(q[0],q[1],1,1).data,v=cq.getImageData(q[0],q[1],1,1).data;
    return Math.abs(u[0]-v[0])+Math.abs(u[1]-v[1])+Math.abs(u[2]-v[2])+Math.abs(u[3]-v[3])>24;};
  fingers=function(cx,P_,pts){const cur=who[who.length-1];
    if(on&&cur&&cur.snap===cx&&pts&&pts.length===2){const [l,r]=pts[0][0]<=pts[1][0]?pts:[pts[1],pts[0]];
      if(changed(cx,[l[0]-OUT,l[1]])&&changed(cx,[r[0]+OUT,r[1]]))
        bad.push({kind:"grip",t:T,chap,who:cur.id+" "+((new Error().stack.split("\n")[2]||"").trim().replace(/^at /,"").split(" ")[0])});}
    return f0.apply(this,arguments);};}
let n=0;
for(let f=0;f/30<TL.total;f+=3){T=f/30;const c=SCENES[sceneIndex(T)];chap=c.id;who=[];n++;
  mx.setTransform(1,0,0,1,0,0);mx.globalAlpha=1;mx.globalCompositeOperation="source-over";mx.clearRect(0,0,768,432);on=true;
  try{renderFrame(mx,S,T);}catch(e){}on=false;}
return{frames:n,bad};}"""


def check(pg):
    """Run on a page with the film loaded (lang.render_page). Returns (what it checked, a line for each arm too long or grip that floats)."""
    r = pg.evaluate(JS, dict(reach=REACH, out=OUT))
    runs = {}
    for b in r['bad']:
        k = (b['kind'], b['chap'], b['who'])
        rs = runs.setdefault(k, [])
        if rs and b['t'] - rs[-1][1] < 0.15:
            rs[-1][1] = b['t']; rs[-1][2] = max(rs[-1][2], b.get('v', 0))
        else:
            rs.append([b['t'], b['t'], b.get('v', 0)])
    lines = []
    for (kind, chap, who), rs in runs.items():
        for t0, t1, v in rs:
            what = ('an arm runs %.1f hand lengths to the frame\'s edge (at most %.1f)' % (v, REACH) if kind == 'arm'
                    else 'two thumbs float in the middle of what they hold, not at its edges')
            lines.append('%7.2f-%7.2f s  %-10s %s: %s' % (t0, t1, chap, who, what))
    lines.sort()
    return 'looked at every hand drawn on its own and every two-handed grip in %d frames' % r['frames'], lines


if __name__ == '__main__':
    from lang import render_page
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b, pg = render_page(p)
        msg, bad = check(pg)
        b.close()
    print(msg)
    for l in bad:
        print('  ' + l)
    if bad:
        sys.exit('%d hands are not where an arm of a person\'s size would put them' % len(bad))
    print('every hand is where an arm of a person\'s size puts it')
