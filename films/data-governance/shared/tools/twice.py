"""Nothing shows twice where a film changes shot or chapter. This series' check.py and the agentic module's run it after the rest;
python tools/check.py runs it, or on its own, from a film's source folder: python ../../shared/tools/twice.py (the agentic module's
films: python ../../../data-governance/shared/tools/twice.py).

A dissolve lays the shot coming in over the one going out for half a second (gv_shots, ag_shots and the films' own), and the engine
lays the end of each chapter over the next one's first 0.8 s. When both pictures show the same person, the same words or the same
place under another camera, a little apart or at another size, those show twice for that time, like a ghost. Stills a second apart
never catch it, and viewers do: people appeared as ghosts for under two seconds. Such a shot comes in on a cut (cut:true in its
shots), and such a chapter opens on one (gv_cutInto or ag_cutInto, after the film's last scene()).

It finds every dissolve and chapter crossfade (a pass four times a second, with the shots each chapter passes), draws each of their
frames, 30 a second, while both pictures are clearly seen, and lists each person, line of words and place that both draw: a person
or a line of words that leaves one place and arrives at another more than PX apart (or at sizes more than SIZE apart), a person
who stays put but whose arms are in two poses more than ARM apart (or who faces both ways), and a place whose two cameras are more
than ROOM apart. A shot in the room of the one before glides and dissolves even where it's marked as a cut (gv_shots, ag_shots), so
what both shots draw where it was must be drawn the same: a person who changes pose takes up the new one over a few frames in the
shot before, or after the dissolve, not at it. What is drawn on a scratch canvas counts where that canvas is laid on the picture,
and only what reaches into the frame counts."""
import sys

PX = 20      # px in the 1920 px frame
SIZE = 0.06  # a size this much larger or smaller is another size
ROOM = 12    # the cameras on one place: px between their centres, plus 10 for each 1% of zoom between them
ARM = 20     # degrees: one person's arms in the two pictures, as steady.py's jump in one frame
SEEN = (0.1, 0.9)  # the incoming picture's opacity while both are clearly seen

JS = r"""(o)=>{
const S=0.1,PX=o.px,SIZE=o.size,ROOM=o.room,ARM=o.arm*Math.PI/180,LO=o.seen[0],HI=o.seen[1],XFD=typeof XF!=="undefined"?XF:0.8;
const main=document.createElement("canvas");main.width=192;main.height=108;const mx=main.getContext("2d");
// the pictures a frame is made of: the frame itself, the dissolve's incoming shot, and the chapter before in a crossfade
const root=c=>{if(c===main)return"main";if(typeof OFF!=="undefined"&&c===OFF)return"xf";
  if((typeof AG_BUFS!=="undefined"&&c===AG_BUFS.cut)||(typeof WC!=="undefined"&&WC.buf&&c===WC.buf.cut))return"dis";return null;};
const H={on:false,coarse:false,pend:new Map(),comp:{},stack:[],calls:[],T:0};
const add=(cv,r)=>{let a=H.pend.get(cv);if(!a)H.pend.set(cv,a=[]);a.push(r);};
const at=(m,x,y)=>[m.a*x+m.c*y+m.e,m.b*x+m.d*y+m.f];
// people: the series' watercolour people (person) and the module's (ag_person), where their feet or hips are, and their size
// and their arms as their pose gives them (as steady.py reads them), and which way they face
if(typeof person==="function"){const o0=person;person=function(ctx,id,x,y,s,op){if(H.on){const m=ctx.getTransform(),P_=typeof PEOPLE!=="undefined"?PEOPLE[id]:null,
    h=P_&&P_.build&&P_.build.h||1,q=at(m,x,y);op=op||{};let arms=null;
    try{if(typeof blendPose==="function"&&typeof POSE!=="undefined"){const po=blendPose(POSE[op.pose||"stand"],POSE[op.pose2],op.mix);if(po&&po.L&&po.R)arms=[...po.L,...po.R];}}catch(e){}
    add(ctx.canvas,{k:"P",key:String(id),x:q[0],y:q[1],z:Math.hypot(m.a,m.b)*s*h,a:ctx.globalAlpha,b:[-300,300,-700,0],arms,flip:!!op.flip!==(m.a<0)});}
  return o0.apply(this,arguments);};}
if(typeof ag_person==="function"){const o1=ag_person;ag_person=function(ctx,who,x,y,s,op){if(H.on){const m=ctx.getTransform(),q=at(m,x,y);let key="?",arms=null;op=op||{};
    try{const P_=typeof ag_spec==="function"?ag_spec(who):who;key=typeof who==="string"?who:String(P_&&(P_.key||P_.name)||"?");}catch(e){}
    try{const po=typeof ag_poseOf==="function"&&op.pose&&(op.pose!=="hang"||(op.pose2&&op.mix>0))?ag_poseOf(op):null,
        H_=typeof AG_HANG!=="undefined"?AG_HANG:{near:[4,34],far:[0,6]},n=po&&po.near||H_.near,f=po&&po.far||H_.far;arms=[n[0],n[1],f[0],f[1]].map(v=>v*Math.PI/180);}catch(e){}
    add(ctx.canvas,{k:"P",key,x:q[0],y:q[1],z:Math.hypot(m.a,m.b)*s,a:ctx.globalAlpha,b:[-500,500,-400,560],arms,flip:!!op.flip!==(m.a<0)});}
  return o1.apply(this,arguments);};}
// a scratch canvas starts again empty
for(const nm of["wc_buf","ag_buf"]){if(typeof window[nm]!=="function")continue;const ob=window[nm];
  window[nm]=function(){const r=ob.apply(this,arguments);if(r&&r[0])H.pend.delete(r[0]);return r;};}
// places: each shot's place and its camera
for(const [sn,fn] of [["gv_shot","gv_focus"],["ag_shot","ag_focus"]]){if(typeof window[sn]!=="function")continue;const os=window[sn],of=window[fn];
  window[sn]=function(ctx,S_,t,sh){H.stack.push({place:sh&&(sh.room||sh.place),cam:null});let top;
    try{return os.apply(this,arguments);}finally{top=H.stack.pop();if(H.on&&top.place&&top.cam)add(ctx.canvas,{k:"R",key:String(top.place),cam:top.cam,a:ctx.globalAlpha});}};
  if(typeof of==="function")window[fn]=function(){const r=of.apply(this,arguments),top=H.stack[H.stack.length-1];if(top&&!top.cam&&r)top.cam=[r.x,r.y,r.z];return r;};}
// the shots each chapter passes, in the pass that finds the dissolves
for(const nm of Object.getOwnPropertyNames(window)){if(!/^[a-z0-9]+_shots$/.test(nm))continue;let f;try{f=window[nm];}catch(e){continue;}if(typeof f!=="function")continue;
  window[nm]=function(ctx,S_,t,end,shots,dis){if(H.coarse&&Array.isArray(shots))H.calls.push({t:+t,dis:+dis||0,shots:shots.map(s=>[+s.at||0,!!s.cut,+s.dis||0])});
    return f.apply(this,arguments);};}
// words
const P2=CanvasRenderingContext2D.prototype,ft=P2.fillText,di=P2.drawImage;
// words drawn in a colour that has its own opacity are that faint
const inkA=c=>{const s=c.fillStyle;if(typeof s!=="string")return 1;const m=/^rgba\([^)]*,\s*([\d.]+)\)$/.exec(s);return m?+m[1]:1;};
P2.fillText=function(s,x,y){if(H.on){const w=String(s).trim();if(w.length>2){const m=this.getTransform(),q=at(m,x,y),px=parseFloat((/([\d.]+)px/.exec(this.font)||[0,10])[1]),
    wd=this.measureText(String(s)).width/Math.max(px,1),al={center:0.5,right:1,end:1}[this.textAlign]||0;
    add(this.canvas,{k:"T",key:w.slice(0,60),x:q[0],y:q[1],z:Math.hypot(m.a,m.b)*px,a:this.globalAlpha*inkA(this),b:[-al*wd,(1-al)*wd,-1,0.3]});}}
  return ft.apply(this,arguments);};
// a picture laid on another: the dissolve's and the crossfade's opacity; a scratch canvas brings what's on it where it's laid
P2.drawImage=function(img){const rn=root(img);
  if(rn==="dis"||rn==="xf")H.comp[rn]=Math.max(H.comp[rn]||0,this.globalAlpha);
  else if(H.on&&!rn){const rs=H.pend.get(img);if(rs&&rs.length){const A=arguments,n=A.length;let sx=0,sy=0,sw=img.width,sh=img.height,dx,dy,dw,dh;
    if(n>=9){sx=A[1];sy=A[2];sw=A[3];sh=A[4];dx=A[5];dy=A[6];dw=A[7];dh=A[8];}else if(n>=5){dx=A[1];dy=A[2];dw=A[3];dh=A[4];}else{dx=A[1];dy=A[2];dw=sw;dh=sh;}
    const m=this.getTransform(),kx=dw/sw,ky=dh/sh,k=Math.hypot(m.a,m.b)*Math.abs(kx);
    for(const r of rs){if(r.k==="R"||r.x<sx-sw/2||r.x>sx+sw*1.5||r.y<sy-sh/2||r.y>sy+sh*1.5)continue;const q=at(m,dx+(r.x-sx)*kx,dy+(r.y-sy)*ky);
      add(this.canvas,{k:r.k,key:r.key,x:q[0],y:q[1],z:r.z*k,a:r.a*this.globalAlpha,b:r.b,arms:r.arms,flip:r.k==="P"?r.flip!==(m.a*kx<0):false});}}}
  return di.apply(this,arguments);};
const draw=T=>{mx.setTransform(1,0,0,1,0,0);mx.globalAlpha=1;mx.globalCompositeOperation="source-over";mx.clearRect(0,0,192,108);
  try{renderFrame(mx,S,T);}catch(e){}};
// 1. where the dissolves and crossfades are
const fr=new Set(),win=(a,b)=>{for(let f=Math.max(0,Math.floor(a*30));f<=Math.ceil(b*30);f++)if(f/30<TL.total)fr.add(f);};let wins=0;
H.coarse=true;
for(let k=0;k/4<TL.total;k++){const T=k/4;H.calls=[];H.comp={};draw(T);
  for(const c of H.calls)for(let i=1;i<c.shots.length;i++){const [a,cut,d]=c.shots[i];if(cut)continue;const s0=T-c.t+a;win(s0-0.07,s0+Math.max(d,c.dis,0.5)+0.07);wins++;}
  if(H.comp.dis>0)win(T-0.6,T+0.6);}
H.coarse=false;
for(let i=1;i<SCENES.length;i++)win(SCENES[i].start,SCENES[i].start+XFD);
// 2. each of their frames
const fs=[...fr].sort((a,b)=>a-b),probs=[],seen={dis:new Set(),xf:new Set()};
// what is in the frame: a person's or a line's box (b, in sizes from where it's drawn) reaches into it
const inside=r=>!r.b||(r.x+r.b[1]*r.z>0&&r.x+r.b[0]*r.z<192&&r.y+r.b[3]*r.z>0&&r.y+r.b[2]*r.z<108);
const group=(R,k)=>{const g=new Map();for(const r of R)if(r.k===k&&r.a>0.05){let a=g.get(r.key);if(!a)g.set(r.key,a=[]);a.push(r);}return g;};
const turn=(a,b)=>{const d=Math.abs(a-b)%(2*Math.PI);return Math.min(d,2*Math.PI-d);};
const near=(p,qs)=>{let b=Infinity;for(const q of qs){const d=Math.hypot(p.x-q.x,p.y-q.y)/S+(Math.abs(p.z/q.z-1)>SIZE?1e4:0);if(d<b)b=d;}return b;};
for(const f of fs){const T=f/30;H.pend=new Map();H.comp={};H.on=true;draw(T);H.on=false;
  const R={main:[],dis:[],xf:[]};for(const [cv,rs] of H.pend){const n=root(cv);if(n)R[n].push(...rs);}
  for(const side of["dis","xf"]){const ca=H.comp[side]||0;if(ca<LO||ca>HI)continue;seen[side].add(f);const A=R.main.filter(inside),B=R[side].filter(inside);
    for(const k of["P","T"]){const ga=group(A,k),gb=group(B,k);
      for(const [key,as] of ga){const bs=gb.get(key);if(!bs)continue;
        const ua=as.filter(p=>near(p,bs)>PX),ub=bs.filter(q=>near(q,as)>PX);
        if(ua.length&&ub.length){let d=Infinity;for(const p of ua)for(const q of ub)d=Math.min(d,Math.hypot(p.x-q.x,p.y-q.y)/S);probs.push({f,side,k,key,d:Math.round(d)});}
        // one person in both, where they were: the same pose, facing the same way
        if(k==="P"){let w=0;for(const p of as)for(const q of bs){if(Math.hypot(p.x-q.x,p.y-q.y)/S>PX||Math.abs(p.z/q.z-1)>SIZE)continue;
            if(p.flip!==q.flip)w=Math.max(w,1e4);else if(p.arms&&q.arms)w=Math.max(w,...p.arms.map((a,i)=>turn(a,q.arms[i]||0)));}
          if(w>ARM)probs.push({f,side,k:"A",key,d:w>=1e4?1e4:Math.round(w*180/Math.PI)});}}}
    const ra=A.filter(r=>r.k==="R"&&r.a>0.05),rb=B.filter(r=>r.k==="R"&&r.a>0.05);
    for(const p of ra)for(const q of rb)if(p.key===q.key){const d=Math.hypot(p.cam[0]-q.cam[0],p.cam[1]-q.cam[1])+1000*Math.abs(p.cam[2]/q.cam[2]-1);
      if(d>ROOM)probs.push({f,side,k:"R",key:p.key,d:Math.round(d)});}}}
const runs=s=>{const a=[...s].sort((x,y)=>x-y);let n=0;for(let i=0;i<a.length;i++)if(!i||a[i]-a[i-1]>2)n++;return n;};
return{frames:fs.length,dis:runs(seen.dis),xf:runs(seen.xf),wins,probs,scenes:SCENES.map(s=>[s.id,s.start])};}"""


def check(pg):
    """Run on a page with the film loaded (lang.render_page). Returns (what it checked, a line for each change of shot or chapter
    that shows something twice)."""
    r = pg.evaluate(JS, dict(px=PX, size=SIZE, room=ROOM, arm=ARM, seen=SEEN))
    scenes = r['scenes']
    # one change of shot or chapter: its frames, less than three apart
    trans = []
    for p in sorted(r['probs'], key=lambda p: (p['side'], p['f'])):
        if trans and trans[-1]['side'] == p['side'] and p['f'] - trans[-1]['f2'] <= 2:
            trans[-1]['f2'] = p['f']
        else:
            trans.append(dict(side=p['side'], f=p['f'], f2=p['f'], got={'P': {}, 'T': {}, 'R': {}, 'A': {}}))
        g = trans[-1]['got'][p['k']]
        g[p['key']] = max(g.get(p['key'], 0), p['d'])
    lines = []
    for c in trans:
        t = c['f'] / 30
        sid, start = [s for s in scenes if s[1] <= t + 1e-6][-1]
        bits = []
        P, T, R = c['got']['P'], c['got']['T'], c['got']['R']
        far = lambda d: '%d px apart' % d if d < 1e4 else 'at two sizes'
        for got, fmt in ((P, '%s'), (T, '"%s"')):
            ks = sorted(got, key=lambda k: -got[k])
            if ks:
                bits.append(', '.join('%s %s' % (fmt % k[:30], far(got[k])) for k in ks[:4]) + (' and %d more' % (len(ks) - 4) if len(ks) > 4 else ''))
        for k, d in sorted(c['got']['A'].items()):
            bits.append('%s %s' % (k, 'facing both ways' if d >= 1e4 else 'with arms in two poses %d degrees apart' % d))
        for k, d in R.items():
            bits.append('the place %s under two cameras %d apart' % (k, d))
        lines.append('%7.2f s  %-10s +%-6.2f twice in a %s: %s' % (t, sid, t - start, 'dissolve' if c['side'] == 'dis' else 'chapter crossfade',
                                                                 '; '.join(bits)))
    lines.sort()
    msg = 'checked %d dissolves and %d chapter changes (%d frames)' % (r['dis'], r['xf'], r['frames'])
    if r['wins'] and not r['dis']:
        lines.append('found no dissolve to check, though the chapters pass shots that dissolve: is the dissolve drawn on a canvas this '
                     'check knows (wc_buf("cut") or ag_buf("cut"))?')
    return msg, lines


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
        sys.exit('%d changes of shot or chapter show something twice' % len(bad))
    print('nothing shows twice where the film changes shot or chapter')
