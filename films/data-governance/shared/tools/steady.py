"""Nobody's arm jumps in one frame. This series' check.py and the agentic module's run it after twice.py; python tools/check.py runs it,
or on its own, from a film's source folder: python ../../shared/tools/steady.py (the agentic module's films:
python ../../../data-governance/shared/tools/steady.py).

A pose that changes in one frame makes an arm jump across the body in a thirtieth of a second, and viewers see a hand "going crazy":
someone switching from one pose to another, a walker stopping mid-swing, a work cycle jumping back to its first step, an arm's bend
flipping, a hand already halfway up when a shot opens. Stills at the cues and every two seconds never catch it. Take up a new pose over
a few frames from the one before it (gv_blendNear, gv_walkInto, or ag_poseOf's mix), let a walk's swing die away as the walker stops,
and blend a cycle from each step into the next.

It draws every frame, 30 a second, on a small canvas, and follows each person the film draws on its picture (the series' person and
the module's ag_person) through each shot: the angles of their arms, frame by frame, as their pose gives them. It lists an angle that
changes by more than JUMP in one frame while it changes by less than a third of that in the frames just before and after: a jump, not
a fast movement (a pull on a cord takes several frames, each a large step). A person who turns round is let off that frame; two people
with one name are told apart by where they stand; only people at least half seen (OPAQUE) and reaching into the frame count."""
import sys

JUMP = 20      # degrees an arm may turn in one frame while it barely moves in the frames around it
OPAQUE = 0.05  # a person this faint or fainter isn't followed
NEAR = 120     # px in the 1920 px frame: one person, from one frame to the next

JS = r"""(o)=>{
const S=0.1,JUMP=o.jump*Math.PI/180,OPAQUE=o.opaque,NEAR=o.near*S;
const main=document.createElement("canvas");main.width=192;main.height=108;const mx=main.getContext("2d");
const H={on:false,shot:[],chap:null,seen:[]};
const at=(m,x,y)=>[m.a*x+m.c*y+m.e,m.b*x+m.d*y+m.f];
// what is in the frame: the person's box, in sizes from where they stand, reaches into it
const inside=(q,z,b)=>q[0]+b[1]*z>0&&q[0]+b[0]*z<192&&q[1]+b[3]*z>0&&q[1]+b[2]*z<108;
const keep=(ctx,key,x,y,z,b,flip,arms)=>{if(!H.on||ctx.canvas!==main||!arms||ctx.globalAlpha<=OPAQUE)return;const q=at(ctx.getTransform(),x,y);
  if(!inside(q,z,b))return;H.seen.push({key:H.chap+"|"+(H.shot.length?H.shot[H.shot.length-1]:"")+"|"+key,who:key,x:q[0],y:q[1],flip:!!flip,arms});};
// the series' watercolour people: the pose they're drawn in, as person() blends it (arms L and R, in radians)
if(typeof person==="function"&&typeof blendPose==="function"&&typeof POSE!=="undefined"){const o0=person;
  person=function(ctx,id,x,y,s,op){if(H.on){op=op||{};let po=null;try{po=blendPose(POSE[op.pose||"stand"],POSE[op.pose2],op.mix);}catch(e){}
      const P_=typeof PEOPLE!=="undefined"?PEOPLE[id]:null,h=P_&&P_.build&&P_.build.h||1,m=ctx.getTransform();
      if(po&&po.L&&po.R)keep(ctx,String(id),x,y,Math.hypot(m.a,m.b)*s*h,[-300,300,-700,0],op.flip,[...po.L,...po.R]);}
    return o0.apply(this,arguments);};}
// the module's people: near and far arm (in degrees), a hanging arm as ag_poseOf hangs it
if(typeof ag_person==="function"&&typeof ag_poseOf==="function"){const o1=ag_person;
  ag_person=function(ctx,who,x,y,s,op){if(H.on){op=op||{};let po=null;try{po=op.pose&&(op.pose!=="hang"||(op.pose2&&op.mix>0))?ag_poseOf(op):null;}catch(e){}
      const n=po&&po.near||[2,14],f=po&&po.far||[0,6],m=ctx.getTransform();let key="?";
      try{const P_=typeof ag_spec==="function"?ag_spec(who):who;key=typeof who==="string"?who:String(P_&&(P_.key||P_.name)||"?");}catch(e){}
      keep(ctx,key,x,y,Math.hypot(m.a,m.b)*s,[-500,500,-400,560],op.flip,[n[0],n[1],f[0],f[1]].map(v=>v*Math.PI/180));}
    return o1.apply(this,arguments);};}
// shots, so that a person is followed within one; and chapters
for(const sn of["gv_shot","ag_shot"]){if(typeof window[sn]!=="function")continue;const os=window[sn];
  window[sn]=function(ctx,S_,t,sh){H.shot.push(sh&&sh.at!=null?(+sh.at).toFixed(2):"?");try{return os.apply(this,arguments);}finally{H.shot.pop();}};}
const turn=(a,b)=>{const d=Math.abs(a-b)%(2*Math.PI);return Math.min(d,2*Math.PI-d);};
// 1. every frame: each person followed from the frame before (the nearest of that name in that shot), and how far their arms turned
const tracks=new Map(),done=[];let n=0;
for(let f=0;f/30<TL.total;f++){const T=f/30,c=SCENES[sceneIndex(T)];H.chap=c.id;H.seen=[];H.shot=[];H.on=true;n++;
  mx.setTransform(1,0,0,1,0,0);mx.globalAlpha=1;mx.globalCompositeOperation="source-over";mx.clearRect(0,0,192,108);
  try{renderFrame(mx,S,T);}catch(e){}
  H.on=false;const now=new Map();
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
