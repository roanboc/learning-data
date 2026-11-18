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
- a chapter without people: a person, or the notes a person is writing (PK.notes), in view in less than SHARE of a chapter's
  frames, or a person themselves in less than WHOLE of them: a film goes between its people and its key concepts, and stays theirs;
- nobody face to face: no moment of FACE_S seconds or more in the whole film where two people stand or sit in one place, near
  each other and turned to each other. People also write to each other and call (PK.chat, PK.call), but they meet at least once;
- someone in front of their own words: whoever explains at a board (PK.teach) stands in front of what is written on it, close
  enough to read, for HIDE_S seconds or more without writing. Give them the time to step clear (a longer pause after the line),
  or lay the board out so that what comes next is written to the right of what is there;
- a line they can't reach in time: a line or a mark on the board that starts LATE seconds or more before whoever writes it can
  walk to it from where the one before ended. Pace the board's rows (PK.pace), start it later, or write it nearer;
- a line long after the voice: a row that PK.pace moved LAG seconds or more after the time the film gave it, so it is written
  long after the voice has said it. The board asks for more walking than the voice leaves time for: write on along the row,
  start a new row where the last one ended, or write the rows before it faster;
- writing at the edge: a row of a board (PK.teach) or of a notebook's page (PK.notes) whose ink ends less than EDGE px from the
  edge of the board or the page, or past it. Start it further left, shorten it, or write it smaller;
- a hand that jumps over a page: the hand that writes in a notebook (PK.notes) is HOP px or more from where it was a frame
  before, when it barely moved in the frames before and after. Two of the page's strokes run into each other, or one starts the
  moment another ends, far from it: pace the page's rows (PK.pace(ctx, null, rows));
- no key ideas written by hand: in the whole film nobody explains at a board (PK.teach) and nobody keeps a page of notes
  (PK.notes). A film goes between its people and its key ideas: an idea that is a label on a scene is lost in it;
- one place only: fewer than PLACES places in the film;
- a hair style that can't turn: a cap with no turn, hair down the back with no backT, or their two rows of unequal length;
- an arm across the face: the near arm, which the kit draws over the head, lies over FACE_N or more of the eyes, the nose and the
  mouth for ACROSS_S seconds or more. Let the far hand reach there (o.reachF, with what it holds under it, o.underF), or turn
  the person round;
- a hand above the head: a hand that reaches for something, or holds it, stays above the top of the head (by HIGH of the person's
  height or more) for HIGH_S seconds or more, the arm as straight up as it goes. A hand works between the hips and the top of the
  head: lower what is written on or reached for (a board in a room: its top row no higher than the writer's head);
- a hand that stops short: a hand whose reach is complete (o.reachNk or o.reachFk at 1) stays more than SHORT of the person's
  height from the point it reaches for, for SHORT_S seconds or more. An arm is about a third of a person's height: a point further
  off leaves the hand in the air, short of the sheet, the pin or the other person's hand. Stand them nearer, or bring what they
  reach for within the arm's length;
- someone hidden: HIDDEN or more of someone's head and back, or most of their face, behind someone drawn after them, for HIDDEN_S
  seconds or more. Stand them apart, or seat one to the side. Someone nobody names (PK.extra), or someone far smaller, so far
  off, is the background: whoever is near may stand in front of them;
- the further one on top: someone whose feet are further up the picture (by DEPTH of their height or more), so further away,
  drawn over whoever is nearer, for DEPTH_S seconds or more. Draw what is further away first;
- solid things in one place: a film says what is solid in the thing's own drawing (a car, a cart, a boat), with
  PK.watch({solid: name, at: [x0, y0, x1, y1], ground: y, ctx}) where PK.watch is set. Listed: one further away drawn over a nearer
  one, or over a person who is nearer (and a person further away drawn over it), and two that overlap on one ground line.

The last six came on 18 November 2026, when four films were drawn (in Measure the work, not the people, cars drove through each
other, an arm lay across a face, someone sat hidden behind whoever wrote at the board, and hands stopped short of the slip, the
sheet and the pin they reached for). What those films had then is in
site-tools/people_later.json, {film key: [[kind, chapter id], ...]}: it is listed and doesn't stop the check, and each film leaves
the list with its fix.

Someone on a screen (a tile of a call, PK.call) is followed too, for their face and their pose, but isn't someone in the room: they
aren't held to its eye line, they make no row, the call's panel may hold their head, and they don't count as a person in view.

A person is followed while they stay in one room and move on the picture as a body can: a cut, or another room, is someone new."""
import sys

ROW, ROW_S = 3, 3.0
SCALE = 0.10
AIR, AIR_S = 70, 2.5
JUMP = 20
OVER_S = 0.3
LARGE, STILL, STATUE = 300, 14.0, 1.0
SHARE, WHOLE = 0.85, 0.6
FACE_S = 3.0
HIDE_S, LATE, LAG = 1.6, 0.2, 1.2
EDGE = 24
HOP = 70
PLACES = 2
FACE_N, ACROSS_S = 2, 0.5
HIGH, HIGH_S = 0.02, 1.0
HIDDEN, HIDDEN_S = 0.5, 1.5
DEPTH, DEPTH_S = 0.04, 0.3
SHORT, SHORT_S = 0.07, 0.5

HOOK = r"""()=>{
if(window.__PKW)return;const H=window.__PKW={on:false,pend:new Map()};
const add=(cv,r)=>{let a=H.pend.get(cv);if(!a)H.pend.set(cv,a=[]);a.push(r);},at=(m,x,y)=>[m.a*x+m.c*y+m.e,m.b*x+m.d*y+m.f];
// the governance films' checks (twice.py, jump.py) follow people through a function called ag_person: the kit hands them one
if(typeof window.ag_person!=="function")window.ag_person=function(){};
// the room each shot shows (ag_shot draws every shot): a person is someone new in another room
const ROOMS=typeof AG_ROOMS!=="undefined"?AG_ROOMS:{};H.place="none";
if(typeof window.ag_shot==="function"){const os=window.ag_shot;window.ag_shot=function(ctx,S_,t,sh){const was=H.place,pl=sh&&(sh.room||sh.place);
  H.place=pl?String(ROOMS[pl]||pl):"own"+(sh&&sh.at!=null?sh.at:"");try{return os.apply(this,arguments);}finally{H.place=was;}};}
PK.watch=r=>{const c=r.ctx,m=c.getTransform(),k=Math.hypot(m.a,m.b),a=c.globalAlpha*(r.a==null?1:r.a);
  // something solid a film draws and says so (a car, a cart, a boat): where it is, and the ground it stands on
  if(r.solid){if(H.on){const p=at(m,r.at[0],r.at[1]),q=at(m,r.at[2],r.at[3]);add(c.canvas,{k:"S",name:String(r.solid),place:H.place,x0:p[0],y0:p[1],x1:q[0],y1:q[1],g:at(m,r.at[0],r.ground==null?r.at[3]:r.ground)[1],a});}return;}
  if(r.box){if(H.on){const p=at(m,r.box[0],r.box[1]),q=at(m,r.box[0]+r.box[2],r.box[1]+r.box[3]);add(c.canvas,{k:"B",x0:p[0],y0:p[1],x1:q[0],y1:q[1],a});}return;}
  // the notes someone is writing (PK.notes), and a chat or a call on show (PK.chat, PK.call): that they are in the picture
  if(r.note||r.talk){if(H.on)add(c.canvas,{k:r.note?"N":"K",who:r.who||r.talk,edge:r.edge,tip:r.tip?at(m,r.tip[0],r.tip[1]):null,a});return;}
  // whoever explains at a board (PK.teach): whether they stand in front of its words, and the lines they can't reach in time
  if(r.teach){if(H.on)add(c.canvas,{k:"T",who:r.teach,over:r.over,late:r.late,lag:r.lag,edge:r.edge,a});return;}
  if(r.part!=="lower"){c.save();c.globalAlpha=a;window.ag_person(c,r.who,r.x,r.floor,r.h/1000);c.restore();}
  if(H.on){const f=at(m,r.x,r.floor),hc=at(m,r.hc[0],r.hc[1]);
    add(c.canvas,H.last={k:"P",who:r.who,kid:r.kid,place:H.place,wx:r.x,wf:r.floor,x:f[0],y:f[1],h:r.h*k,hx:hc[0],hy:hc[1],hh:r.hh*k,flip:r.flip,part:r.part,mode:r.mode,pose:r.pose,reach:r.reach,at:r.at,hold:r.hold,
      expr:r.expr,gaze:r.gaze,nod:r.nod,live:r.live,busy:r.busy,screen:!!r.screen,a});}};
// everyone's joints, as PK.person gives them back, with how thick an arm, a body and a leg are: for the arms, and for who is in
// front of whom. PK.person is called by name everywhere in the kit (K.person), so this follows a walk, a desk and a board too
const JN=["hc","sc","hip","shN","eN","wN","hdN","shF","eF","wF","hdF","hN","hF","kN","kF","nN","nF"],op=PK.person;
PK.person=function(ctx){H.last=null;const J=op.apply(this,arguments),r=H.last;H.last=null;
  if(r&&J&&J.hc&&J.p){const m=ctx.getTransform(),u=J.u*Math.hypot(m.a,m.b),p=J.p;r.j={};for(const n of JN)r.j[n]=at(m,J[n][0],J[n][1]);
    r.tg=[at(m,r.at[0],r.at[1]),at(m,r.at[2],r.at[3])];r.sg=(J.sgn||1)*(m.a<0?-1:1);r.tk=J.k==null?1:J.k;r.sd=J.side||0;r.ha=J.ha||0;
    r.g=[p.arm[0]/2,p.arm[1]/2,p.arm[2]/2,p.hand,p.tor[0]/2,p.tor[2]/2,p.leg[0]/2,p.leg[1]/2,p.leg[2]/2].map(v=>v*u);}
  return J;};
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
      if(r.k==="B"){[o.x0,o.y0]=map(r.x0,r.y0);[o.x1,o.y1]=map(r.x1,r.y1);}
      else if(r.k==="S"){[o.x0,o.y0]=map(r.x0,r.y0);[o.x1,o.y1]=map(r.x1,r.y1);o.g=map(r.x0,r.g)[1];}
      else if(r.k==="P"){[o.x,o.y]=map(r.x,r.y);[o.hx,o.hy]=map(r.hx,r.hy);o.h=r.h*k;o.hh=r.hh*k;
        if(r.j){o.j={};for(const n in r.j)o.j[n]=map(r.j[n][0],r.j[n][1]);o.tg=r.tg.map(q=>map(q[0],q[1]));o.g=r.g.map(v=>v*k);if(m.a*kx<0)o.sg=-r.sg;}}
      add(this.canvas,o);}}}
  return di.apply(this,arguments);};
}"""

JS = r"""(o)=>{
const H=window.__PKW,S=0.1,main=document.createElement("canvas");main.width=192;main.height=108;const mx=main.getContext("2d");
const info=filmInfo().scenes,when=f=>{const T=f/30,i=sceneIndex(T);return info[i].id+" "+(T-info[i].start).toFixed(1)+" s";};
// 1. every frame: who is on the picture, and every box of words, in px of the 1920 px frame
const F=[],EDGES=new Map();
for(let f=0;f/30<TL.total;f++){H.pend=new Map();H.on=true;mx.setTransform(1,0,0,1,0,0);mx.globalAlpha=1;mx.globalCompositeOperation="source-over";mx.clearRect(0,0,192,108);
  try{renderFrame(mx,S,f/30);}catch(e){}
  H.on=false;const R=H.pend.get(main)||[],P=[],B=[],N=[],K=[],TB=[],SO=[];let tip=null,nth=0;
  for(const r of R){nth++;if(r.a<0.05)continue;
    if(r.a>=0.5)for(const e of r.edge||[]){const key=(r.k==="T"?"board":"page")+"|"+e.s;if(!EDGES.has(key))EDGES.set(key,{f,on:r.k==="T"?"board":"page",s:e.s,room:e.room});}
    if(r.k==="T"){if(r.a>=0.5)TB.push(r);}
    else if(r.k==="N"||r.k==="K"){if(r.a>=0.5)(r.k==="N"?N:K).push(r.who);if(r.k==="N"&&r.tip&&r.a>=0.5)tip=[r.tip[0]/S,r.tip[1]/S];}
    else if(r.k==="B")B.push({x0:Math.min(r.x0,r.x1)/S,y0:Math.min(r.y0,r.y1)/S,x1:Math.max(r.x0,r.x1)/S,y1:Math.max(r.y0,r.y1)/S,a:r.a});
    else if(r.k==="S")SO.push({name:r.name,place:r.place,x0:Math.min(r.x0,r.x1)/S,y0:Math.min(r.y0,r.y1)/S,x1:Math.max(r.x0,r.x1)/S,y1:Math.max(r.y0,r.y1)/S,g:r.g/S,a:r.a,n:nth});
    else{const j=r.j?{}:null;if(j)for(const n in r.j)j[n]=[r.j[n][0]/S,r.j[n][1]/S];
      P.push(Object.assign({},r,{x:r.x/S,y:r.y/S,h:r.h/S,hx:r.hx/S,hy:r.hy/S,hh:r.hh/S,j,g:r.g?r.g.map(v=>v/S):null,tg:r.tg?r.tg.map(q=>[q[0]/S,q[1]/S]):null,n:nth}));}}
  // someone drawn in two halves (behind a desk) is one person
  const G=[];for(const p of P){const g=G.find(q=>q.who===p.who&&q.place===p.place&&Math.abs(q.x-p.x)<6&&Math.abs(q.y-p.y)<6&&Math.abs(q.a-p.a)<0.02&&!q.parts.includes(p.part));
    if(g){g.parts.push(p.part);if(p.part!=="lower")Object.assign(g,p,{parts:g.parts});}else G.push(Object.assign({},p,{parts:[p.part]}));}
  F.push({sc:sceneIndex(f/30),P:G,B,N,K,TB,SO,tip});}
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
/* Arms, and who is in front of whom. A body is a few round-ended bars (a head, a back, two arms, two legs), from the joints
   PK.person gave back; a point of someone is hidden where it lies inside a bar of someone drawn after them. A solid thing a film
   draws and says so (a car) is its box. Each stands on its own ground line: what is further up the picture is further away. */
const dseg=(q,a,b)=>{const vx=b[0]-a[0],vy=b[1]-a[1],L=vx*vx+vy*vy,u=L?Math.max(0,Math.min(1,((q[0]-a[0])*vx+(q[1]-a[1])*vy)/L)):0;return[Math.hypot(q[0]-a[0]-vx*u,q[1]-a[1]-vy*u),u];};
const inBar=(q,c)=>{const [d,u]=dseg(q,c[0],c[1]);return d<=c[2]+(c[3]-c[2])*u;},shown=p=>p.a>=0.9&&!p.screen&&p.j&&inView(p)&&!p.parts.every(q=>q==="lower");
const armOf=(p,s)=>{const j=p.j,g=p.g;return[[j["sh"+s],j["e"+s],g[0],g[1]],[j["e"+s],j["w"+s],g[1],g[2]],[j["hd"+s],j["hd"+s],g[3]*0.62,g[3]*0.62]];};
const bodyOf=p=>{const j=p.j,g=p.g,w=1-0.35*(p.sd||0);return[[j.hc,j.hc,p.hh*0.5,p.hh*0.5],[j.sc,j.hip,g[4]*0.9*w,g[5]*w],[j.hN,j.kN,g[6],g[7]],[j.kN,j.nN,g[7],g[8]],[j.hF,j.kF,g[6],g[7]],[j.kF,j.nF,g[7],g[8]]].concat(armOf(p,"N"),armOf(p,"F"));};
// the face: both eyes, the nose and the mouth, where the head's own table has them, as far round as the head is turned
const FC=[[0.07,-0.02],[0.29,-0.02],[0.24,0.1],[0.19,0.275]],FF=[[-0.115,-0.02],[0.115,-0.02],[0,0.1],[0,0.275]];
const faceOf=p=>{const c=Math.cos(p.ha),s=Math.sin(p.ha),k=p.tk==null?1:p.tk;return FC.map((q,i)=>{const x=(FF[i][0]+(q[0]-FF[i][0])*k)*p.hh,y=q[1]*p.hh;return[p.j.hc[0]+p.sg*(x*c-y*s),p.j.hc[1]+x*s+y*c];});};
const across=p=>{const A=armOf(p,"N");return faceOf(p).filter(q=>A.some(c=>inBar(q,c))).length;};
// a hand at work (it reaches for something, or holds it) above the top of the head: the arm is as straight up as it goes
const high=p=>["N","F"].some((s,i)=>(p.reach[i]>=0.5||(p.hold&&Math.abs(p.pose[3+2*i])>o.air))&&p.j["hd"+s][1]<p.j.hc[1]-0.5*p.hh-o.high*p.h);
// a hand that stops short: it reaches for a point of the frame (o.reachN, o.reachF) that is further off than the arm is long
const short=p=>{let d=0;if(p.tg)["N","F"].forEach((s,i)=>{if(p.reach[i]>=0.95&&(p.at[2*i]||p.at[2*i+1]))d=Math.max(d,Math.hypot(p.j["hd"+s][0]-p.tg[i][0],p.j["hd"+s][1]-p.tg[i][1]));});return d;};
// the points of someone that others may hide: seven of the head, fifteen of the back
const ptsOf=p=>{const j=p.j,r=0.3*p.hh,H=[j.hc],B=[],w=p.g[5]*0.6*(1-0.35*(p.sd||0)),vx=j.hip[0]-j.sc[0],vy=j.hip[1]-j.sc[1],L=Math.hypot(vx,vy)||1;
  for(let a=0;a<6;a++)H.push([j.hc[0]+r*Math.cos(a*Math.PI/3),j.hc[1]+r*Math.sin(a*Math.PI/3)]);
  for(const f of [0.1,0.3,0.5,0.7,0.9])for(const d of [-1,0,1])B.push([j.sc[0]+vx*f-vy/L*w*d,j.sc[1]+vy*f+vx/L*w*d]);return{H,B};};
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
    if(s>=0&&!next){if(j-s>=min){const m=say(j-s,s);probs.push(typeof m==="string"?{f:fr[s][0],s:m}:{f:fr[s][0],s:m.s,k:m.k});}s=-1;}
    if(h&&s<0)s=j;}};
  run(j=>seen(fr[j][1])&&air(fr[j][1]),o.airS*30,n=>t.who+" holds a hand in the air for "+(n/30).toFixed(1)+" s, with nothing in it");
  run(j=>seen(fr[j][1])&&fall(fr[j][1]),3,n=>t.who+" falls into a seat with stiff legs (a stand and a sit mixed; use PK.poseSit)");
  // an arm across their own face: the near arm, which is drawn over the head; and a hand held above the head, at work
  run(j=>shown(fr[j][1])&&across(fr[j][1])>=o.faceN,o.acrossS*30,n=>({k:"face",s:t.who+"'s arm lies across their own face for "+(n/30).toFixed(1)+" s: the near arm is drawn over the head. Let the far hand reach there (o.reachF), or turn them round"}));
  run(j=>shown(fr[j][1])&&high(fr[j][1]),o.highS*30,n=>({k:"high",s:t.who+" holds a hand above their head for "+(n/30).toFixed(1)+" s, the arm straight up: a hand works between the hips and the top of the head. Lower what they write on or reach for"}));
  // a hand that stops short of what it reaches for: by how much at most, while it lasts
  run(j=>shown(fr[j][1])&&short(fr[j][1])>o.short*fr[j][1].h,o.shortS*30,(n,s0)=>{let d=0;for(let q=s0;q<s0+n;q++)d=Math.max(d,short(fr[q][1]));
    return{k:"short",s:t.who+"'s hand stops "+Math.round(d)+" px short of what it reaches for, for "+(n/30).toFixed(1)+" s: the arm isn't long enough. Stand them nearer, or bring what they reach for within the arm's length"};});
  const large=j=>seen(fr[j][1])&&inView(fr[j][1])&&fr[j][1].h>=o.large;
  run(j=>large(j)&&!fr[j][1].live,o.statue*30,n=>t.who+" is a statue for "+(n/30).toFixed(1)+" s: drawn without the time (o.t), so nothing of them moves");
  // staying as they are: from one moment (the anchor) on, nothing staged changes; a slow change adds up, and is a change
  let an=-1;const still=j=>{if(!large(j)||fr[j][1].busy||(j&&fr[j-1][0]!==fr[j][0]-1)){an=-1;return false;}if(an<0||!same(fr[an][1],fr[j][1])){an=j;return false;}return true;};
  run(still,o.still*30,n=>t.who+" stays as they are for "+(n/30).toFixed(0)+" s: no nod, look, smile or change of stance (PK.face)");}
// 3. frame by frame
const half=i=>F[i].P.filter(p=>seen(p)&&!p.screen&&p.parts.includes("upper")&&!p.parts.includes("lower"));
runs(i=>half(i).length>0,4,(s,n)=>({f:s,s:"a half-figure: "+half(s).map(p=>p.who).join(", ")+"'s upper half with no lower half, for "+(n/30).toFixed(1)+" s"}));
const grown=i=>F[i].P.filter(p=>seen(p)&&!p.kid&&!p.screen&&!p.parts.every(q=>q==="lower")&&p.h>=250&&inView(p));
const off=i=>{const g=grown(i);if(g.length<2)return null;const e=g.map(p=>p.y-0.91*p.h),lo=e.indexOf(Math.min(...e)),hi=e.indexOf(Math.max(...e)),hs=g.map(p=>p.h).sort((a,b)=>a-b),med=hs[hs.length>>1];
  return e[hi]-e[lo]>o.scale*med?[g[lo].who,g[hi].who,Math.round(e[hi]-e[lo])]:null;};
runs(i=>!!off(i),6,(s,n)=>{const q=off(s);return{f:s,s:q[0]+" and "+q[1]+" are out of scale with each other: their eye lines are "+q[2]+" px apart, for "+(n/30).toFixed(1)+" s"};});
const row=i=>{const g=grown(i).filter(p=>p.mode==="stand"&&Math.max(Math.abs(p.pose[6]),Math.abs(p.pose[8]))<16);let best=[];
  for(const a of g){const r=g.filter(p=>Math.abs(p.h-a.h)<=0.06*a.h&&Math.abs(p.y-a.y)<=0.06*a.h).sort((p,q)=>p.x-q.x);
    if(r.length>best.length&&r.every((p,k)=>!k||p.x-r[k-1].x>0.18*a.h))best=r;}
  return best.length>=o.row?best:null;};
runs(i=>!!row(i),o.rowS*30,(s,n)=>({f:s,s:"a row: "+row(s).map(p=>p.who).join(", ")+" stand at one depth and one size, apart, for "+(n/30).toFixed(1)+" s"}));
const over=i=>{const out=[];for(const p of F[i].P){if(!seen(p)||p.screen||p.parts.every(q=>q==="lower")||p.hh<36)continue;const x0=p.hx-0.42*p.hh,x1=p.hx+0.42*p.hh,y0=p.hy-0.62*p.hh,y1=p.hy+0.5*p.hh;
    if(F[i].B.some(b=>b.a>=0.5&&b.x0+4<x1&&b.x1-4>x0&&b.y0+4<y1&&b.y1-4>y0))out.push(p.who);}return out;};
runs(i=>over(i).length>0,o.overS*30,(s,n)=>({f:s,s:"words and "+[...new Set(over(s))].join(", ")+"'s head are in one place, for "+(n/30).toFixed(1)+" s"}));
/* who is in front of whom: someone hidden behind someone else; someone, or something solid, further away drawn over what is nearer;
   and two solid things in one place. Each pair is followed for as long as it lasts */
{const P2=new Map(),note=(key,i,v)=>{let a=P2.get(key);if(!a)P2.set(key,a=[]);a.push([i,v]);},frac=(pts,in_)=>pts.filter(in_).length/pts.length;
  F.forEach((fr,i)=>{const ps=fr.P.filter(shown),so=fr.SO.filter(q=>q.a>=0.9),box=q=>pt=>pt[0]>=q.x0&&pt[0]<=q.x1&&pt[1]>=q.y0&&pt[1]<=q.y1;
    for(const A of ps){const pa=ptsOf(A);
      for(const Bp of ps){if(Bp===A||Bp.n<A.n||Bp.place!==A.place)continue;
        // rough first: the two are nowhere near each other
        if(Math.abs(Bp.x-A.x)>0.6*(A.h+Bp.h)||Math.abs(Bp.y-A.y)>A.h+Bp.h)continue;
        const bars=bodyOf(Bp),hit=q=>bars.some(c=>inBar(q,c)),fh=frac(pa.H,hit),fb=frac(pa.B,hit),all=(fh*pa.H.length+fb*pa.B.length)/(pa.H.length+pa.B.length);
        if(Bp.y<A.y-o.depth*Math.max(A.h,Bp.h)&&all>=0.15)note("order|"+Bp.who+"|"+A.who,i,all);
        // someone nobody names (PK.extra), or someone far smaller, so far off, is the background: whoever is near may pass in front
        else if((fh>=0.6||all>=o.hidden)&&!/^extra\d+$/.test(A.who)&&A.h>=0.6*Bp.h)note("behind|"+A.who+"|"+Bp.who,i,fh>=0.6?1:0);}
      for(const q of so){if(q.place!==A.place)continue;const cov=frac(pa.H.concat(pa.B),box(q)),tol=o.depth*Math.max(A.h,q.y1-q.y0);
        if(q.n>A.n&&q.g<A.y-tol&&cov>=0.3)note("order|a "+q.name+"|"+A.who,i,cov);
        if(q.n<A.n&&A.y<q.g-tol&&cov>=0.3)note("order|"+A.who+"|a "+q.name,i,cov);}}
    so.forEach((a,x)=>so.forEach((b,y)=>{if(y<=x||a.place!==b.place)return;const w=Math.min(a.x1,b.x1)-Math.max(a.x0,b.x0),h=Math.min(a.y1,b.y1)-Math.max(a.y0,b.y0);if(w<=0||h<=0)return;
      const cov=w*h/Math.min((a.x1-a.x0)*(a.y1-a.y0),(b.x1-b.x0)*(b.y1-b.y0)),tol=o.depth*Math.max(a.y1-a.y0,b.y1-b.y0),lo=a.n<b.n?a:b,hi=a.n<b.n?b:a;if(cov<0.1)return;
      if(Math.abs(a.g-b.g)<=tol)note("one|"+lo.name+"|"+hi.name,i,cov);else if(hi.g<lo.g)note("order|a "+hi.name+"|a "+lo.name,i,cov);}));});
  for(const [key,a] of P2){const [kind,x,y]=key.split("|"),min=(kind==="behind"?o.hiddenS:o.depthS)*30;let s=0;
    for(let j=1;j<=a.length;j++)if(j===a.length||a[j][0]!==a[j-1][0]+1){const n=j-s,f=a[s][0];
      if(n>=min)probs.push({f,k:kind==="one"?"solid":kind,s:kind==="behind"?x+" is hidden behind "+y+" for "+(n/30).toFixed(1)+" s ("+(a.slice(s,j).some(v=>v[1])?"their face":"more than half of them")+"): stand them apart, or seat "+x+" to the side"
        :kind==="order"?x+" is further away than "+(x===y?"another "+y.slice(2):y)+" but is drawn over "+(y.startsWith("a ")?"it":"them")+", for "+(n/30).toFixed(1)+" s: draw what is further away first"
        :"two solid things ("+x+", "+y+") are in one place for "+(n/30).toFixed(1)+" s: give each its own ground line, or let one pass before the other comes"});s=j;}}}
// whoever explains at a board: in front of its words without writing; and the lines that start before they can be there
const hides=i=>F[i].TB.filter(r=>r.over).map(r=>r.who);
runs(i=>hides(i).length>0,o.hideS*30,(s,n)=>({f:s,s:[...new Set(hides(s))].join(", ")+" stands in front of the board's words for "+(n/30).toFixed(1)+" s without writing: give them time to step clear, or write the next line to the right of what is there"}));
{const said=new Set();F.forEach((fr,i)=>{for(const r of fr.TB)for(const l of r.late||[]){const key=r.who+"|"+l.s+"|"+l.t.toFixed(1);if(l.by<o.late||said.has(key))continue;said.add(key);
  probs.push({f:i,s:r.who+" can't reach \""+l.s+"\" in time: it starts "+l.by.toFixed(1)+" s before they can walk to it (it is written at "+l.t.toFixed(1)+" s of the chapter). Pace the rows (PK.pace), start it later, or write it nearer where the line before ended"});}
  for(const r of fr.TB)for(const l of r.lag||[]){const key="lag|"+r.who+"|"+l.s+"|"+l.t.toFixed(1);if(l.by<o.lag||said.has(key))continue;said.add(key);
  probs.push({f:i,s:"\""+l.s+"\" is written "+l.by.toFixed(1)+" s after the voice says it: "+r.who+" has too far to walk to it. Write on along the row, start the row where the last one ended, or write the rows before it faster"});}});}
// the hand that writes in a notebook: never thrown across the page in one frame
{const dT=i=>i>0&&i<F.length&&F[i].tip&&F[i-1].tip?Math.hypot(F[i].tip[0]-F[i-1].tip[0],F[i].tip[1]-F[i-1].tip[1]):0;
  for(let i=1;i<F.length;i++){const d=dT(i);if(d>=o.hop&&dT(i-1)<d/3&&dT(i+1)<d/3)probs.push({f:i,s:"the hand over the notebook jumps "+Math.round(d)+" px in one frame: pace the page's rows (PK.pace(ctx, null, rows))"});}}
// a board's or a page's rows, each inside it
for(const e of EDGES.values())if(e.room<o.edge)probs.push({f:e.f,s:"\""+e.s+"\" is written "+(e.room<0?(-e.room).toFixed(0)+" px past the "+e.on+"'s edge":"only "+e.room.toFixed(0)+" px from the "+e.on+"'s edge")+": start it further left, shorten it, or write it smaller"});
// 4. each chapter: a person in view most of the time, or the notes one of them is writing; and a person themselves for a good part
const here=fr=>fr.P.some(p=>seen(p)&&!p.screen&&inView(p)&&!p.parts.every(q=>q==="lower"));
const share=info.map((sc,k)=>{let n=0,m=0,w=0;for(const fr of F)if(fr.sc===k){n++;const h=here(fr);if(h)w++;if(h||fr.N.length)m++;}return[sc.id,n?m/n:1,n?w/n:1];});
for(const [id,v,w] of share){if(v<o.share)probs.push({f:-1,s:"chapter "+id+": a person, or the notes one is writing, is in view "+Math.round(v*100)+"% of the time (at least "+Math.round(o.share*100)+"%)"});
  else if(w<o.whole)probs.push({f:-1,s:"chapter "+id+": a person is in view "+Math.round(w*100)+"% of the time (at least "+Math.round(o.whole*100)+"%): too long on notes alone"});}
// people meet face to face at least once: two in one place, near each other and turned to each other, for a few seconds
const meet=i=>{const g=F[i].P.filter(p=>seen(p)&&!p.screen&&!p.kid&&inView(p)&&!p.parts.every(q=>q==="lower")&&p.h>=200).sort((a,b)=>a.x-b.x);
  for(let a=0;a<g.length;a++)for(let b=a+1;b<g.length;b++){const l=g[a],r=g[b],h=Math.max(l.h,r.h);
    if(l.who!==r.who&&l.place===r.place&&r.x-l.x<=1.5*h&&Math.min(l.h,r.h)>=0.7*h&&l.flip<=0.6&&r.flip>=0.4&&r.flip-l.flip>=0.25)return true;}return false;};
let faces=0,chats=0,calls=0;{let s=-1;for(let i=0;i<=F.length;i++){const h=i<F.length&&meet(i);if(h&&s<0)s=i;if(!h&&s>=0){if(i-s>=o.faceS*30)faces++;s=-1;}}
  const cnt=kind=>{let n=0,on=false;for(const fr of F){const h=fr.K.includes(kind);if(h&&!on)n++;on=h;}return n;};chats=cnt("chat");calls=cnt("call");}
const span=has=>{let n=0,on=false;for(const fr of F){const h=has(fr);if(h&&!on)n++;on=h;}return n;},boards=span(fr=>fr.TB.length>0),pages=span(fr=>fr.N.length>0);
if(!boards&&!pages)probs.push({f:-1,s:"the film's key ideas are never written by hand: nobody explains at a board (PK.teach) and nobody keeps a page of notes (PK.notes). A film goes between its people and its key ideas"});
if(!faces)probs.push({f:-1,s:"nobody meets face to face: in the whole film no two people are in one place, near each other and turned to each other, for "+o.faceS+" s (people also write and call, but they meet in person at least once)"});
// 5. the film's places, and the kit's hair tables
const places=typeof AG_PLACES!=="undefined"?Object.keys(AG_PLACES).length:0;
if(places<o.places)probs.push({f:-1,s:"the film has "+places+" place"+(places===1?"":"s")+" (at least "+o.places+")"});
const HS=PK.HAIRS?PK.HAIRS():{},rows=q=>Array.isArray(q)&&q.length===2&&q[0].length===q[1].length;
for(const k in HS){const h=HS[k];
  if(h.cap&&!rows(h.turn))probs.push({f:-1,s:"the hair style "+k+" can't turn: it has a cap and no turn, or the turn's two rows are of unequal length"});
  if(h.back&&!rows(h.backT))probs.push({f:-1,s:"the hair style "+k+" can't turn: it has hair down the back and no backT, or its two rows are of unequal length"});}
probs.sort((a,b)=>a.f-b.f);
const names=new Set();for(const t of T)names.add(t.who);
return{n:F.length,people:names.size,places,faces,chats,calls,boards,pages,share:share.map(([id,v,w])=>id+" "+Math.round(v*100)+"%"+(w<v-0.005?" ("+Math.round(w*100)+"% themselves)":"")).join(", "),probs:probs.map(p=>[p.k||"",p.f>=0?info[sceneIndex(p.f/30)].id:"",(p.f>=0?when(p.f)+": ":"")+p.s])};}"""


def watch(pg):
    """Follow the people from here on: call it before the governance films' twice.py and jump.py, so they follow the kit's people too."""
    pg.evaluate(HOOK)


LATER_KINDS = ('face', 'high', 'short', 'behind', 'order', 'solid')


def later():
    """What this film still has to put right: site-tools/people_later.json, {film key: [[kind, chapter id], ...]}, the film's key as
    its release.json has it. The checks on arms and on who is in front of whom came on 18 November 2026, after four films were
    drawn: what those films had then is listed there and only reported, and each film leaves the list with its fix. Only those
    checks' findings (LATER_KINDS) can be put off."""
    import json
    try:
        import lang
        key = next(e['key'] for e in json.loads((lang.ROOT.parent / 'release.json').read_text(encoding='utf-8')) if e.get('lang', 'en') == 'en')
        rows = json.loads((lang.REPO / 'site-tools' / 'people_later.json').read_text(encoding='utf-8')).get(key, [])
        return {(k, c) for k, c in rows if k in LATER_KINDS}
    except (Exception, SystemExit):  # run outside a film's folder (lang stops there), or with no list: nothing is put off
        return set()


def limits():
    """The limits above, as the page's part takes them."""
    return {'row': ROW, 'rowS': ROW_S, 'scale': SCALE, 'air': AIR, 'airS': AIR_S, 'jump': JUMP, 'overS': OVER_S, 'large': LARGE, 'still': STILL,
            'statue': STATUE, 'share': SHARE, 'whole': WHOLE, 'faceS': FACE_S, 'hideS': HIDE_S, 'late': LATE, 'lag': LAG, 'edge': EDGE, 'hop': HOP,
            'places': PLACES, 'faceN': FACE_N, 'acrossS': ACROSS_S, 'high': HIGH, 'highS': HIGH_S, 'hidden': HIDDEN, 'hiddenS': HIDDEN_S,
            'depth': DEPTH, 'depthS': DEPTH_S, 'short': SHORT, 'shortS': SHORT_S}


def check(pg):
    watch(pg)
    r = pg.evaluate(JS, limits())
    head = ('followed %d people through %d moments, in %d places; they meet face to face %d time%s, write in a chat %d and call %d; '
            'someone explains at a board %d time%s and a page of notes is written %d; a person in view: %s'
            % (r['people'], r['n'], r['places'], r['faces'], '' if r['faces'] == 1 else 's', r['chats'], r['calls'],
               r['boards'], '' if r['boards'] == 1 else 's', r['pages'], r['share']))
    known, off = later(), []
    now = [l for k, c, l in r['probs'] if (k, c) not in known]
    old = [l for k, c, l in r['probs'] if (k, c) in known]
    if old:
        off.append('  known and still to put right (site-tools/people_later.json), %d:' % len(old))
        off.extend('    ' + l for l in old)
    for k, c in sorted(known - {(k, c) for k, c, l in r['probs']}, key=lambda e: (e[1], e[0])):
        off.append('  (put right now) chapter %s has nothing of the kind "%s" left: take it off this film\'s list in site-tools/people_later.json' % (c, k))
    return ('\n'.join([head] + off), now)


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
