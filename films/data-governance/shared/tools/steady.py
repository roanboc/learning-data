"""Nobody's arm jumps in one frame. This series' check.py and the agentic module's run it after twice.py; python tools/check.py runs it,
or on its own, from a film's source folder: python ../../shared/tools/steady.py (the agentic module's films:
python ../../../data-governance/shared/tools/steady.py).

A pose that changes in one frame makes an arm jump across the body in a thirtieth of a second, and viewers see a hand "going crazy":
someone switching from one pose to another, a walker stopping mid-swing, a work cycle jumping back to its first step, an arm's bend
flipping, a hand already halfway up when a shot opens. Stills at the cues and every two seconds never catch it. Take up a new pose over
a few frames from the one before it (gv_blendNear, gv_walkInto, or ag_poseOf's mix), let a walk's swing die away as the walker stops,
and blend a cycle from each step into the next.

It draws every frame, 30 a second, on a small canvas, and follows each person the film draws (the series' person and the agent
films' ag_person) through each shot: the angles of their arms, frame by frame, as their pose gives them. A person drawn on a canvas of
their own, which a module's kit lights or fades as one picture and then lays on the frame (Modern data basics' md_person, Data
quality's dq_person in the Great Hall, and the others), is followed to where that picture lands, as jump.py and twice.py follow them;
only the outermost call counts, so a person isn't counted twice. It lists an angle that changes by more than JUMP in one frame while it
changes by less than a third of that in the frames just before and after: a jump, not a fast movement (a pull on a cord takes several
frames, each a large step). A person who turns round is let off that frame; two people with one name are told apart by where they
stand; only people seen more than faintly (OPAQUE) and reaching into the frame count."""
import sys

JUMP = 20      # degrees an arm may turn in one frame while it barely moves in the frames around it
OPAQUE = 0.05  # a person this faint or fainter isn't followed
NEAR = 120     # px in the 1920 px frame: one person, from one frame to the next

JS = r"""(o)=>{
const S=0.1,JUMP=o.jump*Math.PI/180,OPAQUE=o.opaque,NEAR=o.near*S;
const main=document.createElement("canvas");main.width=192;main.height=108;const mx=main.getContext("2d");
const H={on:false,shot:[],chap:null,seen:[],pend:new Map(),depth:0};
const at=(m,x,y)=>[m.a*x+m.c*y+m.e,m.b*x+m.d*y+m.f];
// what is in the frame: the person's box, in sizes from where they stand, reaches into it
const inside=(q,z,b)=>q[0]+b[1]*z>0&&q[0]+b[0]*z<192&&q[1]+b[3]*z>0&&q[1]+b[2]*z<108;
// each person drawn, kept with the canvas it's drawn on: the frame, or a canvas of their own that follows them onto the frame (below)
const add=(cv,r)=>{let a=H.pend.get(cv);if(!a)H.pend.set(cv,a=[]);a.push(r);};
const keep=(ctx,key,x,y,z,b,flip,arms)=>{if(!H.on||!arms)return;const q=at(ctx.getTransform(),x,y);
  add(ctx.canvas,{key:H.chap+"|"+(H.shot.length?H.shot[H.shot.length-1]:"")+"|"+key,who:key,x:q[0],y:q[1],z,b,flip:!!flip,arms,a:ctx.globalAlpha});};
// the series' watercolour people: the pose they're drawn in, as person() blends it (arms L and R, in radians)
if(typeof person==="function"&&typeof blendPose==="function"&&typeof POSE!=="undefined"){const o0=person;
  person=function(ctx,id,x,y,s,op){if(H.on&&!H.depth){op=op||{};let po=null;try{po=blendPose(POSE[op.pose||"stand"],POSE[op.pose2],op.mix);}catch(e){}
      const P_=typeof PEOPLE!=="undefined"?PEOPLE[id]:null,h=P_&&P_.build&&P_.build.h||1,m=ctx.getTransform();
      if(po&&po.L&&po.R)keep(ctx,String(id),x,y,Math.hypot(m.a,m.b)*s*h,[-300,300,-700,0],op.flip,[...po.L,...po.R]);}
    H.depth++;try{return o0.apply(this,arguments);}finally{H.depth--;}};}
// the agent films' people: near and far arm (in degrees), a hanging arm as the painted one hangs (AG_HANG in their people.js)
if(typeof ag_person==="function"&&typeof ag_poseOf==="function"){const o1=ag_person;
  ag_person=function(ctx,who,x,y,s,op){if(H.on&&!H.depth){op=op||{};let po=null;try{po=op.pose&&(op.pose!=="hang"||(op.pose2&&op.mix>0))?ag_poseOf(op):null;}catch(e){}
      const H_=typeof AG_HANG!=="undefined"?AG_HANG:{near:[4,34],far:[0,6]},n=po&&po.near||H_.near,f=po&&po.far||H_.far,m=ctx.getTransform();let key="?";
      try{const P_=typeof ag_spec==="function"?ag_spec(who):who;key=typeof who==="string"?who:String(P_&&(P_.key||P_.name)||"?");}catch(e){}
      keep(ctx,key,x,y,Math.hypot(m.a,m.b)*s,[-500,500,-400,560],op.flip,[n[0],n[1],f[0],f[1]].map(v=>v*Math.PI/180));}
    H.depth++;try{return o1.apply(this,arguments);}finally{H.depth--;}};}
// a scratch canvas starts again empty: what was drawn on it before is gone (a kit's buffer, given out again for the next person)
for(const nm of["wc_buf","ag_buf"]){if(typeof window[nm]!=="function")continue;const ob=window[nm];
  window[nm]=function(){const r=ob.apply(this,arguments);if(r&&r[0])H.pend.delete(r[0]);return r;};}
const P2=CanvasRenderingContext2D.prototype,di=P2.drawImage,cr=P2.clearRect;
// and so does a canvas cleared all over
P2.clearRect=function(x,y,w,h){if(H.on&&H.pend.has(this.canvas)){const m=this.getTransform(),c=this.canvas,q=[at(m,x,y),at(m,x+w,y),at(m,x,y+h),at(m,x+w,y+h)];
    if(Math.min(...q.map(v=>v[0]))<=0&&Math.min(...q.map(v=>v[1]))<=0&&Math.max(...q.map(v=>v[0]))>=c.width&&Math.max(...q.map(v=>v[1]))>=c.height)H.pend.delete(c);}
  return cr.apply(this,arguments);};
// a picture laid on another brings the people on it to where it's laid, at its opacity (a person lit or faded as one picture, a dissolve,
// the engine's crossfade); a whole picture laid over the frame covers the people under it, as jump.py has it
const whole=c=>(typeof OFF!=="undefined"&&c===OFF)||(typeof AG_BUFS!=="undefined"&&c===AG_BUFS.cut)||(typeof WC!=="undefined"&&WC.buf&&c===WC.buf.cut);
P2.drawImage=function(img){if(H.on&&img!==this.canvas){
  if(whole(img)&&img.width===this.canvas.width){const un=H.pend.get(this.canvas);if(un)for(const r of un)r.a*=1-this.globalAlpha;}
  const rs=H.pend.get(img);if(rs&&rs.length){const A=arguments,n=A.length;let sx=0,sy=0,sw=img.width,sh=img.height,dx,dy,dw,dh;
    if(n>=9){sx=A[1];sy=A[2];sw=A[3];sh=A[4];dx=A[5];dy=A[6];dw=A[7];dh=A[8];}else if(n>=5){dx=A[1];dy=A[2];dw=A[3];dh=A[4];}else{dx=A[1];dy=A[2];dw=sw;dh=sh;}
    const m=this.getTransform(),kx=dw/sw,ky=dh/sh,k=Math.hypot(m.a,m.b)*Math.abs(kx),mir=kx*m.a<0;
    for(const r of rs){if(r.x<sx-sw/2||r.x>sx+sw*1.5||r.y<sy-sh/2||r.y>sy+sh*1.5)continue;const q=at(m,dx+(r.x-sx)*kx,dy+(r.y-sy)*ky);
      add(this.canvas,Object.assign({},r,{x:q[0],y:q[1],z:r.z*k,a:r.a*this.globalAlpha,flip:mir?!r.flip:r.flip}));}}}
  return di.apply(this,arguments);};
// shots, so that a person is followed within one; and chapters
for(const sn of["gv_shot","ag_shot"]){if(typeof window[sn]!=="function")continue;const os=window[sn];
  window[sn]=function(ctx,S_,t,sh){H.shot.push(sh&&sh.at!=null?(+sh.at).toFixed(2):"?");try{return os.apply(this,arguments);}finally{H.shot.pop();}};}
const turn=(a,b)=>{const d=Math.abs(a-b)%(2*Math.PI);return Math.min(d,2*Math.PI-d);};
// 1. every frame: each person followed from the frame before (the nearest of that name in that shot), and how far their arms turned
const tracks=new Map(),done=[];let n=0;
for(let f=0;f/30<TL.total;f++){const T=f/30,c=SCENES[sceneIndex(T)];H.chap=c.id;H.seen=[];H.shot=[];H.pend=new Map();H.depth=0;n++;
  mx.setTransform(1,0,0,1,0,0);mx.globalAlpha=1;mx.globalCompositeOperation="source-over";mx.clearRect(0,0,192,108);H.on=true;
  try{renderFrame(mx,S,T);}catch(e){}
  H.on=false;
  // the people on the frame as it ends: seen more than faintly, and reaching into it
  for(const p of H.pend.get(main)||[])if(p.a>OPAQUE&&inside([p.x,p.y],p.z,p.b))H.seen.push(p);
  const now=new Map();
  for(const p of H.seen){const was=(tracks.get(p.key)||[]).filter(r=>r.f===f-1&&!r.taken);let best=null,bd=NEAR;
    for(const r of was){const d=Math.hypot(r.p.x-p.x,r.p.y-p.y);if(d<bd){bd=d;best=r;}}
    let tr;if(best){best.taken=true;tr=best.tr;tr.v.push([f,best.p.flip!==p.flip?0:Math.max(...p.arms.map((a,i)=>turn(a,best.p.arms[i]||0)))]);}
    else{tr={who:p.who,v:[]};done.push(tr);}
    let a=now.get(p.key);if(!a)now.set(p.key,a=[]);a.push({f,p,tr});}
  for(const [k,a] of now)tracks.set(k,a);
  for(const k of[...tracks.keys()])if(!now.has(k))tracks.delete(k);}
// 2. a jump: one frame's turn over JUMP, with those just before and after under a third of it
const jumps=[];
for(const tr of done){const v=new Map(tr.v);for(const [f,a] of tr.v)if(a>JUMP&&(v.get(f-1)||0)<a/3&&(v.get(f+1)||0)<a/3){
  const T=f/30,c=SCENES[sceneIndex(T)];jumps.push({t:T,chap:c.id,at:T-c.start,who:tr.who,deg:a*180/Math.PI,
    before:(v.get(f-1)||0)*180/Math.PI,after:(v.get(f+1)||0)*180/Math.PI});}}
return{frames:n,people:done.length,jumps};}"""


def check(pg):
    """Run on a page with the film loaded (lang.render_page). Returns (what it checked, a line for each arm that jumps in one frame)."""
    r = pg.evaluate(JS, dict(jump=JUMP, opaque=OPAQUE, near=NEAR))
    lines = ['%7.2f s  %-10s +%-6.2f %s: an arm turns %d degrees in one frame (%d before it, %d after)' % (
        j['t'], j['chap'], j['at'], j['who'], round(j['deg']), round(j['before']), round(j['after'])) for j in r['jumps']]
    lines.sort()
    return 'followed %d people through %d frames' % (r['people'], r['frames']), lines


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
        sys.exit('%d arms jump in one frame' % len(bad))
    print('no arm jumps in one frame')
