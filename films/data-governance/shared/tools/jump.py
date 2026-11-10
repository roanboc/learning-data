"""Nothing jumps where a film changes shot or chapter. This series' check.py and the agentic module's run it after twice.py and
steady.py; python tools/check.py runs it, or on its own, from a film's source folder: python ../../shared/tools/jump.py (the agentic
module's films: python ../../../data-governance/shared/tools/jump.py).

A cut between two framings of one place makes the whole picture jump a little in, out or aside, and what only the shot before showed
vanishes in that frame. The author saw it as sudden jumps in the zoom that broke the films' flow (4 November 2026): a shot's slow push
snapped back at a cut to the same room, a dim wall and the same wall lit were framed a few percent apart, a chapter opened on the room
the last one ended in under its own camera, and the cards of the shot before were gone in a thirtieth of a second. In one room the
camera glides from one framing to the next, and what changes fades (gv_shots and ag_shots do it for shots in one room, the same place
or two places GV_ROOMS or AG_ROOMS make one room; gv_cutInto and ag_cutInto for chapters that open on what the last one ends on). A
later moment in the room (later:true) passes through the bare room: what was there leaves, then what comes later comes in.

It draws every frame, 30 a second, on a small canvas, and follows the places each shot draws (with its camera), the people (the
series' person and the module's ag_person) and every line of words, as they reach the picture. It lists:
- the picture jumping: one room under a camera that moves the picture more than MOVE px at its corners in one frame, while it moves
  under a third of that in the frames just before and after (a glide moves a little every frame);
- something jumping: a person or a line of words, clearly seen in two frames running, that moves more than THING px or changes size by
  more than SIZE in one frame, while it moves under a third of that in the two frames before and after (a change of room is a new shot);
- something vanishing or appearing in one frame where the film changes shot or chapter while the room stays (words written out a
  letter at a time are the same words as they grow).
A shot that draws its own scene and names no room (no place, no room) is a room of its own: a cut to or from it is a new shot.
A change that moves the picture BIG px or more at its corners is a new shot, which may cut, and isn't listed."""
import sys

MOVE = 6       # px at the picture's corners, in the 1920 px frame: the camera on one room
THING = 8      # px: a person or a line of words
SIZE = 0.03    # a size this much larger or smaller in one frame
BIG = 300      # px: a change this large is a new shot
SEEN = 0.5     # opacity: clearly seen
NEAR = 40      # px: one thing, from one frame to the next

JS = r"""(o)=>{
const S=0.1,MOVE=o.move,THING=o.thing,SIZE=o.size,BIG=o.big,SEEN=o.seen,NEAR=o.near;
const main=document.createElement("canvas");main.width=192;main.height=108;const mx=main.getContext("2d");
const H={on:false,pend:new Map(),stack:[],calls:[]};
const add=(cv,r)=>{let a=H.pend.get(cv);if(!a)H.pend.set(cv,a=[]);a.push(r);};
const at=(m,x,y)=>[m.a*x+m.c*y+m.e,m.b*x+m.d*y+m.f];
const ROOMS=Object.assign({},typeof GV_ROOMS!=="undefined"?GV_ROOMS:{},typeof AG_ROOMS!=="undefined"?AG_ROOMS:{}),room=k=>ROOMS[k]||k;
// people: the series' watercolour people (person) and the module's (ag_person), where they stand, and their size
if(typeof person==="function"){const o0=person;person=function(ctx,id,x,y,s,op){if(H.on){const m=ctx.getTransform(),P_=typeof PEOPLE!=="undefined"?PEOPLE[id]:null,
    h=P_&&P_.build&&P_.build.h||1,q=at(m,x,y);add(ctx.canvas,{k:"P",key:String(id),x:q[0],y:q[1],z:Math.hypot(m.a,m.b)*s*h,a:ctx.globalAlpha});}
  return o0.apply(this,arguments);};}
if(typeof ag_person==="function"){const o1=ag_person;ag_person=function(ctx,who,x,y,s,op){if(H.on){const m=ctx.getTransform(),q=at(m,x,y);let key="?";
    try{const P_=typeof ag_spec==="function"?ag_spec(who):who;key=typeof who==="string"?who:String(P_&&(P_.key||P_.name)||"?");}catch(e){}
    add(ctx.canvas,{k:"P",key,x:q[0],y:q[1],z:Math.hypot(m.a,m.b)*s,a:ctx.globalAlpha});}
  return o1.apply(this,arguments);};}
// a scratch canvas starts again empty
for(const nm of["wc_buf","ag_buf"]){if(typeof window[nm]!=="function")continue;const ob=window[nm];
  window[nm]=function(){const r=ob.apply(this,arguments);if(r&&r[0])H.pend.delete(r[0]);return r;};}
// places: each shot's place and its camera
for(const [sn,fn] of [["gv_shot","gv_focus"],["ag_shot","ag_focus"]]){if(typeof window[sn]!=="function")continue;const os=window[sn],of=window[fn];
  window[sn]=function(ctx,S_,t,sh){H.stack.push({place:sh&&(sh.room||sh.place),cam:null});let top;
    try{return os.apply(this,arguments);}finally{top=H.stack.pop();if(H.on&&top.place&&top.cam)add(ctx.canvas,{k:"R",key:room(String(top.place)),cam:top.cam,a:ctx.globalAlpha});}};
  if(typeof of==="function")window[fn]=function(){const r=of.apply(this,arguments),top=H.stack[H.stack.length-1];if(top&&!top.cam&&r)top.cam=[r.x,r.y,r.z];return r;};}
// which shot each chapter's shots show, on the picture itself
for(const nm of Object.getOwnPropertyNames(window)){if(!/^[a-z0-9]+_shots$/.test(nm))continue;let f;try{f=window[nm];}catch(e){continue;}if(typeof f!=="function")continue;
  window[nm]=function(ctx){const r=f.apply(this,arguments);if(H.on&&ctx&&ctx.canvas===main)H.calls.push(r);return r;};}
// words
const P2=CanvasRenderingContext2D.prototype,ft=P2.fillText,di=P2.drawImage;
// words drawn in a colour that has its own opacity are that faint
const inkA=c=>{const s=c.fillStyle;if(typeof s!=="string")return 1;const m=/^rgba\([^)]*,\s*([\d.]+)\)$/.exec(s);return m?+m[1]:1;};
// a line of words is where the middle of what shows of it is, however it's aligned: spaces at either end don't count, so a line typed
// out letter by letter stays where it is when a space comes
P2.fillText=function(s,x,y){if(H.on){const w=String(s).trim();if(w.length>2){const m=this.getTransform(),al={center:0.5,right:1,end:1}[this.textAlign]||0,
    S0=String(s),W0=this.measureText(S0).width,x0=x-al*W0,wl=this.measureText(S0.slice(0,S0.length-S0.trimStart().length)).width,
    q=at(m,x0+(wl+this.measureText(S0.trimEnd()).width)/2,y),px=parseFloat((/([\d.]+)px/.exec(this.font)||[0,10])[1]);
    add(this.canvas,{k:"T",key:w.slice(0,60),x:q[0],y:q[1],z:Math.hypot(m.a,m.b)*px,a:this.globalAlpha*inkA(this)});}}
  return ft.apply(this,arguments);};
// a picture laid on another brings what's on it where it's laid, at its opacity (a dissolve, the engine's crossfade, a fading person)
const whole=c=>(typeof OFF!=="undefined"&&c===OFF)||(typeof AG_BUFS!=="undefined"&&c===AG_BUFS.cut)||(typeof WC!=="undefined"&&WC.buf&&c===WC.buf.cut);
P2.drawImage=function(img){if(H.on){
  // a whole picture laid over the frame (a dissolve's shot, or the chapter before in the engine's crossfade) covers what's under it
  if(whole(img)&&img.width===this.canvas.width){const un=H.pend.get(this.canvas);if(un)for(const r of un)r.a*=1-this.globalAlpha;
    if(this.canvas===main&&this.globalAlpha>0.002&&this.globalAlpha<0.998)H.mix=true;}
  const rs=H.pend.get(img);if(rs&&rs.length){const A=arguments,n=A.length;let sx=0,sy=0,sw=img.width,sh=img.height,dx,dy,dw,dh;
    if(n>=9){sx=A[1];sy=A[2];sw=A[3];sh=A[4];dx=A[5];dy=A[6];dw=A[7];dh=A[8];}else if(n>=5){dx=A[1];dy=A[2];dw=A[3];dh=A[4];}else{dx=A[1];dy=A[2];dw=sw;dh=sh;}
    const m=this.getTransform(),kx=dw/sw,ky=dh/sh,k=Math.hypot(m.a,m.b)*Math.abs(kx);
    for(const r of rs){if(r.k==="R"){if(Math.abs(kx*m.a-1)<1e-6&&Math.abs(ky*m.d-1)<1e-6&&!dx&&!dy&&!m.e&&!m.f)add(this.canvas,Object.assign({},r,{a:r.a*this.globalAlpha}));continue;}
      if(r.x<sx-sw/2||r.x>sx+sw*1.5||r.y<sy-sh/2||r.y>sy+sh*1.5)continue;const q=at(m,dx+(r.x-sx)*kx,dy+(r.y-sy)*ky);
      add(this.canvas,{k:r.k,key:r.key,x:q[0],y:q[1],z:r.z*k,a:r.a*this.globalAlpha});}}}
  return di.apply(this,arguments);};
// how far the picture moves at its corners (or its middle), in px of the 1920 px frame, from camera a to camera b
const move=(a,b)=>{let m=0;for(const [sx,sy] of [[0,0],[1920,0],[0,1080],[1920,1080],[960,540]]){const wx=(sx-960)/a[2]+a[0],wy=(sy-540)/a[2]+a[1];
  m=Math.max(m,Math.hypot((wx-b[0])*b[2]+960-sx,(wy-b[1])*b[2]+540-sy));}return m;};
const inside=r=>r.x>9.6&&r.x<182.4&&r.y>5.4&&r.y<102.6;
// 1. every frame: each room's camera (the last one drawn, clearly seen), and the people and words clearly seen
const F=[];
for(let f=0;f/30<TL.total;f++){const T=f/30;H.pend=new Map();H.stack=[];H.calls=[];H.mix=false;H.on=true;
  mx.setTransform(1,0,0,1,0,0);mx.globalAlpha=1;mx.globalCompositeOperation="source-over";mx.clearRect(0,0,192,108);
  try{renderFrame(mx,S,T);}catch(e){}
  H.on=false;const R=H.pend.get(main)||[],rooms=new Map();let top=null;
  for(const r of R)if(r.k==="R"&&r.a>=SEEN){rooms.set(r.key,r.cam);top=r;}
  F.push({f,sc:sceneIndex(T),calls:H.calls.join(","),rooms,top:top&&top.key,mix:H.mix,
    things:R.filter(r=>(r.k==="P"||r.k==="T")&&r.a>=0.05).map(r=>({k:r.k,key:r.key,x:r.x/S,y:r.y/S,z:r.z,a:r.a,in:inside(r)}))});}
// 2. from each frame to the next: how far each room's camera moved the picture, and the picture as a whole (a new shot when far)
const steps=[null];
for(let i=1;i<F.length;i++){const a=F[i-1],b=F[i],cams=new Map();for(const [k,c] of b.rooms){const p=a.rooms.get(k);if(p)cams.set(k,{m:move(p,c),from:p,to:c});}
  // a change of room is a new shot (the same people may well stand elsewhere in another place), and so is a change of shot to or from
  // one that names no room (a shot that draws its own scene and gives no room: only the same place or room is one room)
  let shot=0;if(a.top&&b.top)shot=a.top===b.top?cams.get(b.top).m:Infinity;else if(a.calls!==b.calls||a.sc!==b.sc)shot=Infinity;
  steps.push({cams,shot,stay:a.top&&b.top&&a.top===b.top&&shot<BIG,change:a.sc!==b.sc||a.calls!==b.calls});}
const probs=[];
// the picture jumping: a room's camera moving far more in one frame than in the frames around it; not while two pictures are mixed,
// where the camera seen goes from one picture's to the other's (twice.py checks that the two cameras agree)
for(let i=1;i<F.length;i++)for(const [k,c] of steps[i].cams){if(c.m<=MOVE||c.m>=BIG||F[i].mix||F[i-1].mix)continue;
  const was=steps[i-1]&&steps[i-1].cams.get(k),then=steps[i+1]&&steps[i+1].cams.get(k);
  if((was?was.m:0)<c.m/3&&(then?then.m:0)<c.m/3)probs.push({f:i,kind:"room",key:k,d:c.m,z0:c.from[2],z1:c.to[2]});}
// something jumping: a person or a line of words seen clearly in two frames running, each paired with the nearest of its name in the
// frame before, nearest first, one to one (so a row of the same words fading in one by one isn't one of them hopping along); faint ones
// are paired too, so that how fast a card flying in moved before it was clearly seen counts; not while two pictures are mixed (twice.py
// looks at dissolves)
const pair=(A,B)=>{const c=[],byKey=new Map();for(let i=0;i<A.length;i++){const p=A[i];if(!p.in)continue;const kk=p.k+"|"+p.key;let l=byKey.get(kk);if(!l)byKey.set(kk,l=[]);l.push(i);}
  for(let j=0;j<B.length;j++){const q=B[j];if(!q.in)continue;for(const i of byKey.get(q.k+"|"+q.key)||[]){const p=A[i];
    const d=Math.hypot(p.x-q.x,p.y-q.y);if(d<BIG)c.push([d,i,j]);}}
  c.sort((x,y)=>x[0]-y[0]);const ua=new Set(),m=new Map();for(const [d,i,j] of c){if(ua.has(i)||m.has(j))continue;ua.add(i);m.set(j,i);}
  // then, among things of one name, two swap partners wherever that pairs them nearer in all: lines of the same words sliding more than
  // half their spacing in a frame (a sheet coming up) would otherwise pair across, and one of them would seem to jump
  const ds=(i,j)=>Math.hypot(A[i].x-B[j].x,A[i].y-B[j].y),groups=new Map();
  for(const j of m.keys()){const kk=B[j].k+"|"+B[j].key;let l=groups.get(kk);if(!l)groups.set(kk,l=[]);l.push(j);}
  for(const js of groups.values())for(let more=js.length>1;more;){more=false;
    for(let u=0;u<js.length;u++)for(let v=u+1;v<js.length;v++){const j1=js[u],j2=js[v],i1=m.get(j1),i2=m.get(j2),d12=ds(i1,j2),d21=ds(i2,j1);
      if(d12<BIG&&d21<BIG&&d12+d21<ds(i1,j1)+ds(i2,j2)-0.5){m.set(j1,i2);m.set(j2,i1);more=true;}}}
  return m;};
for(let i=1;i<F.length;i++)F[i].back=pair(F[i-1].things,F[i].things);
const hop=(i,j)=>{const b=F[i]&&F[i].back,k=b&&b.get(j);if(k==null)return null;const p=F[i].things[j],q=F[i-1].things[k];return{k,d:Math.hypot(p.x-q.x,p.y-q.y),r:p.z/q.z};};
for(let i=1;i<F.length;i++){if(steps[i].shot>=BIG||F[i].mix||F[i-1].mix)continue;const got=[];
  for(let j=0;j<F[i].things.length;j++){const h=hop(i,j);if(!h)continue;const p=F[i].things[j],dr=Math.abs(h.r-1);if(p.a<SEEN||F[i-1].things[h.k].a<SEEN)continue;
    if(dr>=0.3||(h.d<=THING&&dr<=SIZE))continue;
    let after=null,an=null;if(F[i+1])for(const [jn,k] of F[i+1].back)if(k===j){after=hop(i+1,jn);an=jn;break;}
    let after2=null;if(an!=null&&F[i+2])for(const [jn,k] of F[i+2].back)if(k===an){after2=hop(i+2,jn);break;}
    // only what is there in the frames just before and after (words whose number ticks are new words every frame or two), and still
    // two frames away too (a spring that settles turns round between two big steps)
    const before=hop(i-1,h.k),before2=before&&hop(i-2,before.k),still=x=>x&&x.d<h.d/3+1&&Math.abs(x.r-1)<Math.max(dr/3,SIZE/3);
    if(still(before)&&still(after)&&(!before2||still(before2))&&(!after2||still(after2)))got.push(p.key+" "+Math.round(h.d)+" px"+(dr>SIZE?" x"+h.r.toFixed(2):""));}
  if(got.length)probs.push({f:i,kind:"thing",got});}
// something vanishing or appearing in one frame where the film changes shot or chapter, while the room stays; words being written
// out, a letter more in this frame than the last, are the same words
const same=(p,q)=>p.k===q.k&&(p.key===q.key||p.k==="T"&&(p.key.startsWith(q.key)||q.key.startsWith(p.key)))&&Math.hypot(q.x-p.x,q.y-p.y)<NEAR;
for(let i=1;i<F.length;i++){if(!steps[i].change||!steps[i].stay||F[i].mix&&F[i-1].mix)continue;const a=F[i-1],b=F[i],gone=[],came=[];
  for(const p of a.things)if(p.a>=SEEN&&p.in&&!b.things.some(q=>same(p,q)))gone.push(p.key);
  for(const q of b.things)if(q.a>=SEEN&&q.in&&!a.things.some(p=>same(p,q)))came.push(q.key);
  if(gone.length||came.length)probs.push({f:i,kind:"pop",gone:[...new Set(gone)],came:[...new Set(came)]});}
const dump=o.at==null?null:F.filter(r=>Math.abs(r.f/30-o.at)<=0.2).map(r=>({f:r.f,calls:r.calls,mix:r.mix,top:r.top,rooms:[...r.rooms].map(([k,c])=>k+" "+c.map(v=>v.toFixed(3)).join(",")),
  things:r.things.map(q=>q.k+" "+q.key.slice(0,24)+" "+Math.round(q.x)+","+Math.round(q.y)+" z"+q.z.toFixed(1)+" a"+q.a.toFixed(2))}));
return{frames:F.length,probs,dump,scenes:SCENES.map(s=>[s.id,s.start])};}"""


def check(pg, at=None):
    """Run on a page with the film loaded (lang.render_page). Returns (what it checked, a line for each moment something jumps).
    With at (seconds), it also prints what each frame within 0.2 s of it holds: the shots, the rooms' cameras, and what is seen."""
    r = pg.evaluate(JS, dict(move=MOVE, thing=THING, size=SIZE, big=BIG, seen=SEEN, near=NEAR, at=at))
    for d in r['dump'] or []:
        print('%.3f s  shots %s%s  rooms: %s' % (d['f'] / 30, d['calls'], '  mixed' if d['mix'] else '', '; '.join(d['rooms'])))
        for q in d['things']:
            print('    ' + q)
    scenes = r['scenes']
    lines = []
    for p in sorted(r['probs'], key=lambda p: p['f']):
        t = p['f'] / 30
        sid, start = [s for s in scenes if s[1] <= t + 1e-6][-1]
        some = lambda ks: ', '.join('"%s"' % k[:30] for k in ks[:4]) + (' and %d more' % (len(ks) - 4) if len(ks) > 4 else '')
        if p['kind'] == 'room':
            what = 'the picture of %s jumps %d px at its corners in one frame (zoom %.3f to %.3f)' % (p['key'], round(p['d']), p['z0'], p['z1'])
        elif p['kind'] == 'thing':
            what = 'in one frame %s jump%s' % (some(p['got']), 's' if len(p['got']) == 1 else '')
        else:
            what = '; '.join(x for x in (p['gone'] and '%s vanish%s in one frame' % (some(p['gone']), 'es' if len(p['gone']) == 1 else ''),
                                           p['came'] and '%s appear%s in one frame' % (some(p['came']), 's' if len(p['came']) == 1 else '')) if x)
        lines.append('%7.2f s  %-10s +%-6.2f %s' % (t, sid, t - start, what))
    return 'followed the camera, people and words through %d frames' % r['frames'], lines


if __name__ == '__main__':
    # python jump.py, or python jump.py --at 86.6 to see the frames around a moment
    from lang import render_page
    from playwright.sync_api import sync_playwright
    at = float(sys.argv[sys.argv.index('--at') + 1]) if '--at' in sys.argv else None
    with sync_playwright() as p:
        b, pg = render_page(p)
        msg, bad = check(pg, at)
        b.close()
    print(msg)
    for l in bad:
        print('  ' + l)
    if bad:
        sys.exit('%d moments jump' % len(bad))
    print('nothing jumps where the film changes shot or chapter')
