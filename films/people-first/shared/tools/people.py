"""People carry these films: the people kit's own checks. tools/check.py runs them, from a film's source folder; on its own:
python ../../../people-first/shared/tools/people.py (after tools/build.py).

The author found the Leading data people films disappointing (issue 391, and 17 November 2026): half-figures lined up in front of a
plain wall, a giant bust beside small whole people, cards and charts carrying the story while the people stood by, faces that never
reacted, a hand held in the air to explain. Each is a rule of the kit now (films/people-first/shared/README.md), and each rule that
can be measured is a check here. The film is drawn frame by frame, 30 a second, on a small canvas, and everyone the kit draws
(PK.person and what calls it) and every box of words (PK.card, PK.tag, PK.bubble) is followed to where it lands on the picture, with
how clearly it shows there (a person on a picture of their own, or in a shot that dissolves, counts as faint as they are seen).

It lists:
- a half-figure: someone's upper half drawn with no lower half (a bust behind a bench); behind a desk both halves are drawn, the
  desk between them (PK.atDesk);
- someone out of scale: two grown people in one picture whose eye lines differ by more than SCALE of their height: a standing
  adult's eyes are on the place's eye line wherever they stand (PK.hAt), so a head far above or below it is a giant or a doll;
- a row: ROW or more people standing at about one depth and one size (their feet within 6% of their height of one line), apart from
  each other, for ROW_S seconds or more. Let two stand together, one a step behind and half hidden; seat one; bring one nearer;
- a hand in the air: a standing person's forearm raised past AIR degrees, with nothing held and nothing reached for, for AIR_S
  seconds or more. Hands hold, carry, give, take, write, rest or greet: a greeting is over within that time;
- falling into a seat: legs half way between standing and sitting with a straight back and straight shins, which is a stand and a
  sit mixed (PK.poseMix); sitting down and standing up are PK.poseSit;
- a pose that jumps: a limb, the lean or a reach that changes by more than JUMP degrees in one frame while it barely moves in the
  frames before and after (take up a new pose over 0.3 to 0.5 s);
- words and a head in one place: a box of words that overlaps someone's head for OVER_S seconds or more, whichever is on top;
- a statue: someone seen large (LARGE px or taller) drawn without the time (o.t), so with no breath, no blink and none of the
  kit's own life, for STATUE seconds or more;
- someone who stays as they are: a person seen large whose pose, face, eyes and place, as the film stages them, stay the same for
  STILL seconds or more, unless they are at work at a desk. The kit keeps them alive in between (a settle, a glance), but a
  listener takes in what is said: a nod, a look, a smile, a change of stance (PK.face);
- a chapter without people: a person in view in less than SHARE of a chapter's frames;
- one place only: fewer than PLACES places in the film;
- a hair style that can't turn: a cap with no turn, hair down the back with no backT, or their two rows of unequal length.

A person is followed while they stay in one room and move on the picture as a body can: a cut, or another room, is someone new."""
import sys

ROW, ROW_S = 3, 3.0
SCALE = 0.10
AIR, AIR_S = 70, 2.5
JUMP = 20
OVER_S = 0.3
LARGE, STILL, STATUE = 300, 14.0, 1.0
SHARE = 0.85
PLACES = 2

HOOK = r"""()=>{
if(window.__PKW)return;const H=window.__PKW={on:false,pend:new Map()};
const add=(cv,r)=>{let a=H.pend.get(cv);if(!a)H.pend.set(cv,a=[]);a.push(r);},at=(m,x,y)=>[m.a*x+m.c*y+m.e,m.b*x+m.d*y+m.f];
// the governance films' checks (twice.py, jump.py) follow people through a function called ag_person: the kit hands them one
if(typeof window.ag_person!=="function")window.ag_person=function(){};
// the room each shot shows (ag_shot draws every shot): a person is someone new in another room
const ROOMS=typeof AG_ROOMS!=="undefined"?AG_ROOMS:{};H.place="none";
if(typeof window.ag_shot==="function"){const os=window.ag_shot;window.ag_shot=function(ctx,S_,t,sh){const was=H.place,pl=sh&&(sh.room||sh.place);
  H.place=pl?String(ROOMS[pl]||pl):"own"+(sh&&sh.at!=null?sh.at:"");try{return os.apply(this,arguments);}finally{H.place=was;}};}
PK.watch=r=>{const c=r.ctx,m=c.getTransform(),k=Math.hypot(m.a,m.b),a=c.globalAlpha*r.a;
  if(r.box){if(H.on){const p=at(m,r.box[0],r.box[1]),q=at(m,r.box[0]+r.box[2],r.box[1]+r.box[3]);add(c.canvas,{k:"B",x0:p[0],y0:p[1],x1:q[0],y1:q[1],a});}return;}
  if(r.part!=="lower"){c.save();c.globalAlpha=a;window.ag_person(c,r.who,r.x,r.floor,r.h/1000);c.restore();}
  if(H.on){const f=at(m,r.x,r.floor),hc=at(m,r.hc[0],r.hc[1]);
    add(c.canvas,{k:"P",who:r.who,kid:r.kid,place:H.place,wx:r.x,wf:r.floor,x:f[0],y:f[1],h:r.h*k,hx:hc[0],hy:hc[1],hh:r.hh*k,flip:r.flip,part:r.part,mode:r.mode,pose:r.pose,reach:r.reach,at:r.at,hold:r.hold,
      expr:r.expr,gaze:r.gaze,nod:r.nod,live:r.live,busy:r.busy,a});}};
// a scratch canvas starts again empty
if(typeof window.ag_buf==="function"){const ob=window.ag_buf;window.ag_buf=function(){const r=ob.apply(this,arguments);if(r&&r[0])H.pend.delete(r[0]);return r;};}
// a picture laid on another brings who is on it to where it is laid, as faint as it is laid; a whole picture laid over the frame (a
// dissolve's shot, the chapter before in the engine's crossfade) covers what is under it
const P2=CanvasRenderingContext2D.prototype,di=P2.drawImage,whole=c=>(typeof OFF!=="undefined"&&c===OFF)||(typeof AG_BUFS!=="undefined"&&c===AG_BUFS.cut);
P2.drawImage=function(img){if(H.on){
  if(whole(img)&&img.width===this.canvas.width){const un=H.pend.get(this.canvas);if(un)for(const r of un)r.a*=1-this.globalAlpha;}
  const rs=H.pend.get(img);if(rs&&rs.length){const A=arguments,n=A.length;let sx=0,sy=0,sw=img.width,sh=img.height,dx,dy,dw,dh;
    if(n>=9){sx=A[1];sy=A[2];sw=A[3];sh=A[4];dx=A[5];dy=A[6];dw=A[7];dh=A[8];}else if(n>=5){dx=A[1];dy=A[2];dw=A[3];dh=A[4];}else{dx=A[1];dy=A[2];dw=sw;dh=sh;}
    const m=this.getTransform(),kx=dw/sw,ky=dh/sh,k=Math.hypot(m.a,m.b)*Math.abs(kx),map=(x,y)=>at(m,dx+(x-sx)*kx,dy+(y-sy)*ky);
    for(const r of rs){const o=Object.assign({},r,{a:r.a*this.globalAlpha});
      if(r.k==="B"){[o.x0,o.y0]=map(r.x0,r.y0);[o.x1,o.y1]=map(r.x1,r.y1);}else{[o.x,o.y]=map(r.x,r.y);[o.hx,o.hy]=map(r.hx,r.hy);o.h=r.h*k;o.hh=r.hh*k;}
      add(this.canvas,o);}}}
  return di.apply(this,arguments);};
}"""

JS = r"""(o)=>{
const H=window.__PKW,S=0.1,main=document.createElement("canvas");main.width=192;main.height=108;const mx=main.getContext("2d");
const info=filmInfo().scenes,when=f=>{const T=f/30,i=sceneIndex(T);return info[i].id+" "+(T-info[i].start).toFixed(1)+" s";};
// 1. every frame: who is on the picture, and every box of words, in px of the 1920 px frame
const F=[];
for(let f=0;f/30<TL.total;f++){H.pend=new Map();H.on=true;mx.setTransform(1,0,0,1,0,0);mx.globalAlpha=1;mx.globalCompositeOperation="source-over";mx.clearRect(0,0,192,108);
  try{renderFrame(mx,S,f/30);}catch(e){}
  H.on=false;const R=H.pend.get(main)||[],P=[],B=[];
  for(const r of R){if(r.a<0.05)continue;
    if(r.k==="B")B.push({x0:Math.min(r.x0,r.x1)/S,y0:Math.min(r.y0,r.y1)/S,x1:Math.max(r.x0,r.x1)/S,y1:Math.max(r.y0,r.y1)/S,a:r.a});
    else P.push(Object.assign({},r,{x:r.x/S,y:r.y/S,h:r.h/S,hx:r.hx/S,hy:r.hy/S,hh:r.hh/S}));}
  // someone drawn in two halves (behind a desk) is one person
  const G=[];for(const p of P){const g=G.find(q=>q.who===p.who&&q.place===p.place&&Math.abs(q.x-p.x)<6&&Math.abs(q.y-p.y)<6&&Math.abs(q.a-p.a)<0.02&&!q.parts.includes(p.part));
    if(g){g.parts.push(p.part);if(p.part!=="lower")Object.assign(g,p,{parts:g.parts});}else G.push(Object.assign({},p,{parts:[p.part]}));}
  F.push({sc:sceneIndex(f/30),P:G,B});}
const seen=p=>p.a>=0.5,inView=p=>p.hx>0&&p.hx<1920&&p.hy>0&&p.hy<1080,probs=[];
const runs=(hit,min,say)=>{let s=-1;for(let i=0;i<=F.length;i++){const h=i<F.length&&hit(i);if(h&&s<0)s=i;if(!h&&s>=0){if(i-s>=min)probs.push(say(s,i-s));s=-1;}}};
// 2. follow each person from frame to frame, while they stay in one room and move on the picture as a body can (the nearest first):
// after a cut, or in another room, they are someone new
const T=[];let live=[];
for(let i=0;i<F.length;i++){const ps=F[i].P.filter(p=>!p.parts.every(q=>q==="lower")),pairs=[],next=[],done=new Set();
  for(const t of live)for(const p of ps){if(t.who!==p.who||t.last.place!==p.place)continue;const d=Math.hypot(t.last.x-p.x,t.last.y-p.y),z=Math.abs(p.h/t.last.h-1);if(d<60&&z<0.06)pairs.push([d+z*1000+Math.abs(t.last.a-p.a)*20,t,p]);}
  pairs.sort((a,b)=>a[0]-b[0]);
  for(const [c,t,p] of pairs){if(t.used===i||done.has(p))continue;t.used=i;done.add(p);t.last=p;t.f.push([i,p]);next.push(t);}
  for(const p of ps)if(!done.has(p)){const t={who:p.who,f:[[i,p]],used:i,last:p};T.push(t);next.push(t);}
  live=next;}
const rAt=(a,b)=>Math.max(Math.hypot(a.at[0]-b.at[0],a.at[1]-b.at[1])*Math.min(a.reach[0],b.reach[0]),Math.hypot(a.at[2]-b.at[2],a.at[3]-b.at[3])*Math.min(a.reach[1],b.reach[1]));
// how far two moments of one person are apart, as degrees of a limb (a hand that goes 1.5 px to another place counts as a degree)
const dPose=(a,b)=>{let d=0;for(let k=0;k<10;k++)d=Math.max(d,Math.abs(a.pose[k]-b.pose[k]));for(let k=0;k<2;k++)d=Math.max(d,Math.abs(a.reach[k]-b.reach[k])*60);return Math.max(d,rAt(a,b)/1.5);};
// the same as at another moment: nothing staged has changed (a pose within 2 degrees, a place within 4 px, the face, the eyes, a nod)
const same=(a,b)=>dPose(a,b)<2&&Math.abs(a.wx-b.wx)+Math.abs(a.wf-b.wf)<4&&Math.abs(a.flip-b.flip)<0.03&&Math.abs(a.nod-b.nod)<0.045&&
  Math.abs(a.gaze[0]-b.gaze[0])+Math.abs(a.gaze[1]-b.gaze[1])<0.2&&Math.abs(a.expr[0]-b.expr[0])+Math.abs(a.expr[1]-b.expr[1])+Math.abs(a.expr[2]-b.expr[2])<0.12;
const air=p=>p.mode==="stand"&&!p.hold&&((Math.abs(p.pose[3])>o.air&&p.reach[0]<0.5)||(Math.abs(p.pose[5])>o.air&&p.reach[1]<0.5));
const fall=p=>p.mode!=="kneel"&&Math.max(Math.abs(p.pose[6]),Math.abs(p.pose[8]))>=30&&Math.max(Math.abs(p.pose[6]),Math.abs(p.pose[8]))<=65&&p.pose[0]<10&&Math.min(p.pose[7],p.pose[9])>-15;
for(const t of T){const fr=t.f,d=fr.map((x,j)=>j&&fr[j-1][0]===x[0]-1?dPose(fr[j-1][1],x[1]):0);
  // a pose that jumps
  for(let j=1;j<fr.length;j++)if(d[j]>o.jump&&seen(fr[j][1])&&(d[j-1]||0)<d[j]/3&&(d[j+1]||0)<d[j]/3)probs.push({f:fr[j][0],s:t.who+"'s pose jumps "+Math.round(d[j])+"° in one frame"});
  // a hand in the air, falling into a seat, never moving: how long each lasts
  // (a run ends where it stops being true, and where the person is out of the picture for a frame)
  const run=(hit,min,say)=>{let s=-1;for(let j=0;j<=fr.length;j++){const h=j<fr.length&&hit(j),next=h&&s>=0&&fr[j-1][0]===fr[j][0]-1;
    if(s>=0&&!next){if(j-s>=min)probs.push({f:fr[s][0],s:say(j-s)});s=-1;}
    if(h&&s<0)s=j;}};
  run(j=>seen(fr[j][1])&&air(fr[j][1]),o.airS*30,n=>t.who+" holds a hand in the air for "+(n/30).toFixed(1)+" s, with nothing in it");
  run(j=>seen(fr[j][1])&&fall(fr[j][1]),3,n=>t.who+" falls into a seat with stiff legs (a stand and a sit mixed; use PK.poseSit)");
  const large=j=>seen(fr[j][1])&&inView(fr[j][1])&&fr[j][1].h>=o.large;
  run(j=>large(j)&&!fr[j][1].live,o.statue*30,n=>t.who+" is a statue for "+(n/30).toFixed(1)+" s: drawn without the time (o.t), so nothing of them moves");
  // staying as they are: from one moment (the anchor) on, nothing staged changes; a slow change adds up, and is a change
  let an=-1;const still=j=>{if(!large(j)||fr[j][1].busy||(j&&fr[j-1][0]!==fr[j][0]-1)){an=-1;return false;}if(an<0||!same(fr[an][1],fr[j][1])){an=j;return false;}return true;};
  run(still,o.still*30,n=>t.who+" stays as they are for "+(n/30).toFixed(0)+" s: no nod, look, smile or change of stance (PK.face)");}
// 3. frame by frame
const half=i=>F[i].P.filter(p=>seen(p)&&p.parts.includes("upper")&&!p.parts.includes("lower"));
runs(i=>half(i).length>0,4,(s,n)=>({f:s,s:"a half-figure: "+half(s).map(p=>p.who).join(", ")+"'s upper half with no lower half, for "+(n/30).toFixed(1)+" s"}));
const grown=i=>F[i].P.filter(p=>seen(p)&&!p.kid&&!p.parts.every(q=>q==="lower")&&p.h>=250&&inView(p));
const off=i=>{const g=grown(i);if(g.length<2)return null;const e=g.map(p=>p.y-0.91*p.h),lo=e.indexOf(Math.min(...e)),hi=e.indexOf(Math.max(...e)),hs=g.map(p=>p.h).sort((a,b)=>a-b),med=hs[hs.length>>1];
  return e[hi]-e[lo]>o.scale*med?[g[lo].who,g[hi].who,Math.round(e[hi]-e[lo])]:null;};
runs(i=>!!off(i),6,(s,n)=>{const q=off(s);return{f:s,s:q[0]+" and "+q[1]+" are out of scale with each other: their eye lines are "+q[2]+" px apart, for "+(n/30).toFixed(1)+" s"};});
const row=i=>{const g=grown(i).filter(p=>p.mode==="stand"&&Math.max(Math.abs(p.pose[6]),Math.abs(p.pose[8]))<16);let best=[];
  for(const a of g){const r=g.filter(p=>Math.abs(p.h-a.h)<=0.06*a.h&&Math.abs(p.y-a.y)<=0.06*a.h).sort((p,q)=>p.x-q.x);
    if(r.length>best.length&&r.every((p,k)=>!k||p.x-r[k-1].x>0.18*a.h))best=r;}
  return best.length>=o.row?best:null;};
runs(i=>!!row(i),o.rowS*30,(s,n)=>({f:s,s:"a row: "+row(s).map(p=>p.who).join(", ")+" stand at one depth and one size, apart, for "+(n/30).toFixed(1)+" s"}));
const over=i=>{const out=[];for(const p of F[i].P){if(!seen(p)||p.parts.every(q=>q==="lower")||p.hh<36)continue;const x0=p.hx-0.42*p.hh,x1=p.hx+0.42*p.hh,y0=p.hy-0.62*p.hh,y1=p.hy+0.5*p.hh;
    if(F[i].B.some(b=>b.a>=0.5&&b.x0+4<x1&&b.x1-4>x0&&b.y0+4<y1&&b.y1-4>y0))out.push(p.who);}return out;};
runs(i=>over(i).length>0,o.overS*30,(s,n)=>({f:s,s:"words and "+[...new Set(over(s))].join(", ")+"'s head are in one place, for "+(n/30).toFixed(1)+" s"}));
// 4. each chapter: a person in view most of the time
const share=info.map((sc,k)=>{let n=0,m=0;for(const fr of F)if(fr.sc===k){n++;if(fr.P.some(p=>seen(p)&&inView(p)&&!p.parts.every(q=>q==="lower")))m++;}return[sc.id,n?m/n:1];});
for(const [id,v] of share)if(v<o.share)probs.push({f:-1,s:"chapter "+id+": a person is in view "+Math.round(v*100)+"% of the time (at least "+Math.round(o.share*100)+"%)"});
// 5. the film's places, and the kit's hair tables
const places=typeof AG_PLACES!=="undefined"?Object.keys(AG_PLACES).length:0;
if(places<o.places)probs.push({f:-1,s:"the film has "+places+" place"+(places===1?"":"s")+" (at least "+o.places+")"});
const HS=PK.HAIRS?PK.HAIRS():{},rows=q=>Array.isArray(q)&&q.length===2&&q[0].length===q[1].length;
for(const k in HS){const h=HS[k];
  if(h.cap&&!rows(h.turn))probs.push({f:-1,s:"the hair style "+k+" can't turn: it has a cap and no turn, or the turn's two rows are of unequal length"});
  if(h.back&&!rows(h.backT))probs.push({f:-1,s:"the hair style "+k+" can't turn: it has hair down the back and no backT, or its two rows are of unequal length"});}
probs.sort((a,b)=>a.f-b.f);
const names=new Set();for(const t of T)names.add(t.who);
return{n:F.length,people:names.size,places,share:share.map(([id,v])=>id+" "+Math.round(v*100)+"%").join(", "),probs:probs.map(p=>(p.f>=0?when(p.f)+": ":"")+p.s)};}"""


def watch(pg):
    """Follow the people from here on: call it before the governance films' twice.py and jump.py, so they follow the kit's people too."""
    pg.evaluate(HOOK)


def check(pg):
    watch(pg)
    r = pg.evaluate(JS, {'row': ROW, 'rowS': ROW_S, 'scale': SCALE, 'air': AIR, 'airS': AIR_S, 'jump': JUMP, 'overS': OVER_S, 'large': LARGE,
                         'still': STILL, 'statue': STATUE, 'share': SHARE, 'places': PLACES})
    return ('followed %d people through %d moments, in %d places; a person in view: %s' % (r['people'], r['n'], r['places'], r['share']), r['probs'])


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
        raise SystemExit('%d things about the people to put right' % len(probs))
    print('the people stand whole, in scale and at ease; nobody jumps, waves a hand about or stays frozen')
