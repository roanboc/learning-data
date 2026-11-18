"""Nothing shows twice where a film changes shot or chapter. This series' check.py and the agentic module's run it after the rest;
python tools/check.py runs it, or on its own, from a film's source folder: python ../../shared/tools/twice.py (the agentic module's
films: python ../../../data-governance/shared/tools/twice.py).

A dissolve lays the shot coming in over the one going out for half a second (gv_shots, ag_shots and the films' own), and the engine
lays the end of each chapter over the next one's first 0.8 s. When both pictures show the same person, the same words or the same
place under another camera, a little apart or at another size, those show twice for that time, like a ghost. Stills a second apart
never catch it, and viewers do: people appeared as ghosts for under two seconds. Such a shot comes in on a cut (cut:true in its
shots), and such a chapter opens on one (gv_cutInto or ag_cutInto, after the film's last scene()).

It finds every dissolve and chapter crossfade (a pass four times a second, with the shots each chapter passes), draws each of their
frames, 30 a second, while both pictures are clearly seen, and lists each person, line of words and place that both draw (the
agentic module's agents count as one person, since they look alike: one dissolved into another place showed it twice): a person
or a line of words that leaves one place and arrives at another more than PX apart (or at sizes more than SIZE apart), a person
who stays put but whose arms are in two poses more than ARM apart (or who faces both ways), and a place whose two cameras are more
than ROOM apart. A shot in the room of the one before glides and dissolves even where it's marked as a cut (gv_shots, ag_shots), so
what both shots draw where it was must be drawn the same: a person who changes pose takes up the new one over a few frames in the
shot before, or after the dissolve, not at it. What is drawn on a scratch canvas counts where that canvas is laid on the picture,
and only what reaches into the frame counts.

It also finds words shown twice in part (since 18 November 2026): a run of WORDS or more whole words, with LETTERS or more letters
and figures in it, that is all of one line and part of another (a label, a name or a title shown again in a longer line), drawn in
both pictures and nowhere in the same place, where the run starts in each line. In *Change without surprises*, a calendar headed
"Change board" dissolved three times into the board's form, headed "Change board · once a month", and the words showed twice, a
little apart; comparing whole lines, the check had missed it. Two sentences that only share a few words, such as "the review" in
"for: the review agent" and "the review checklist", aren't the same words; and words that stay through the change show once: drawn
on top of both pictures, or in the same place on the frame just before the change and just after it, such as a chapter's heading
over a room whose labels leave. The films that showed words twice in part when the check came to read them are listed in
site-tools/twice_later.json ({film key: [[chapter id, words], ...]}): those are shown as known and don't fail, and each film leaves
the list with its fix (the check says when listed words no longer show twice).

python twice.py --film KEY (may be repeated) or --all checks films by their release keys, after their tools/build.py; --all --later
writes every film's words in part to site-tools/twice_later.json, as when a change to this check finds faults in films made before."""
import json, pathlib, sys

ROOT = next(q for q in pathlib.Path(__file__).resolve().parents if q.name == 'films').parent
LATER = ROOT / 'site-tools' / 'twice_later.json'
PX = 20      # px in the 1920 px frame
SIZE = 0.06  # a size this much larger or smaller is another size
ROOM = 12    # the cameras on one place: px between their centres, plus 10 for each 1% of zoom between them
ARM = 20     # degrees: one person's arms in the two pictures, as steady.py's jump in one frame
SEEN = (0.1, 0.9)  # the incoming picture's opacity while both are clearly seen
WORDS = 2    # words in part: a run of at least this many whole words, all of one line and part of another,
LETTERS = 8  # with at least this many letters and figures in it ("Change board" has 11, "of the" 5)
WHOLE = True  # the run is all of one of the two lines: a label, a name or a title shown again in a longer line

JS = r"""(o)=>{
const S=0.1,PX=o.px,SIZE=o.size,ROOM=o.room,ARM=o.arm*Math.PI/180,LO=o.seen[0],HI=o.seen[1],XFD=typeof XF!=="undefined"?XF:0.8,WN=o.words,WL=o.letters,WH=o.whole;
const main=document.createElement("canvas");main.width=192;main.height=108;const mx=main.getContext("2d");
// the pictures a frame is made of: the frame itself, the dissolve's incoming shot, and the chapter before in a crossfade
const root=c=>{if(c===main)return"main";if(typeof OFF!=="undefined"&&c===OFF)return"xf";
  if((typeof AG_BUFS!=="undefined"&&c===AG_BUFS.cut)||(typeof WC!=="undefined"&&WC.buf&&c===WC.buf.cut))return"dis";return null;};
const H={on:false,coarse:false,pend:new Map(),comp:{},lay:{},stack:[],calls:[],T:0};
// what is drawn on the frame after the dissolve's or the crossfade's picture is laid on it, such as a chapter's heading, is on top of both
const add=(cv,r)=>{if(cv===main)r.top=[!!H.lay.dis,!!H.lay.xf];let a=H.pend.get(cv);if(!a)H.pend.set(cv,a=[]);a.push(r);};
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
// the module's agents (ag_model, a sphere): like one person, in one place at a time, since they look alike; its size is its radius. The mark on a
// title card (ag_mark) is an emblem, not the agent
let mark=0;if(typeof ag_mark==="function"){const om=ag_mark;ag_mark=function(){mark++;try{return om.apply(this,arguments);}finally{mark--;}};}
if(typeof ag_model==="function"){const o2=ag_model;ag_model=function(ctx,x,y,r,op){op=op||{};const a=op.a==null?1:op.a;
    if(H.on&&!mark&&op.only!=="light"&&a>0){const m=ctx.getTransform(),q=at(m,x,y);add(ctx.canvas,{k:"P",key:"the agent",x:q[0],y:q[1],z:Math.hypot(m.a,m.b)*r,a:ctx.globalAlpha*a,b:[-1.1,1.1,-1.1,1.1],arms:null,flip:false});}
  return o2.apply(this,arguments);};}
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
// a line's words, without the marks around them, and where each starts (in sizes from the line's start), to find the words two lines share
const words=(c,s,px)=>{const out=[],re=/\S+/g;let m;while((m=re.exec(s))){const r=m[0],l=/^[^\p{L}\p{N}]*/u.exec(r)[0].length,e=/[^\p{L}\p{N}]*$/u.exec(r)[0].length;
    if(l+e>=r.length)continue;out.push({w:r.slice(l,r.length-e),x:c.measureText(s.slice(0,m.index+l)).width/Math.max(px,1)});}return out;};
P2.fillText=function(s,x,y){if(H.on){const w=String(s).trim();if(w.length>2){const m=this.getTransform(),q=at(m,x,y),px=parseFloat((/([\d.]+)px/.exec(this.font)||[0,10])[1]),
    wd=this.measureText(String(s)).width/Math.max(px,1),al={center:0.5,right:1,end:1}[this.textAlign]||0;
    add(this.canvas,{k:"T",key:w.slice(0,60),x:q[0],y:q[1],z:Math.hypot(m.a,m.b)*px,a:this.globalAlpha*inkA(this),b:[-al*wd,(1-al)*wd,-1,0.3],ws:words(this,String(s),px)});}}
  return ft.apply(this,arguments);};
// a picture laid on another: the dissolve's and the crossfade's opacity; a scratch canvas brings what's on it where it's laid
P2.drawImage=function(img){const rn=root(img);
  if(rn==="dis"||rn==="xf"){H.comp[rn]=Math.max(H.comp[rn]||0,this.globalAlpha);H.lay[rn]=true;}
  else if(H.on&&!rn){const rs=H.pend.get(img);if(rs&&rs.length){const A=arguments,n=A.length;let sx=0,sy=0,sw=img.width,sh=img.height,dx,dy,dw,dh;
    if(n>=9){sx=A[1];sy=A[2];sw=A[3];sh=A[4];dx=A[5];dy=A[6];dw=A[7];dh=A[8];}else if(n>=5){dx=A[1];dy=A[2];dw=A[3];dh=A[4];}else{dx=A[1];dy=A[2];dw=sw;dh=sh;}
    const m=this.getTransform(),kx=dw/sw,ky=dh/sh,k=Math.hypot(m.a,m.b)*Math.abs(kx);
    for(const r of rs){if(r.k==="R"||r.x<sx-sw/2||r.x>sx+sw*1.5||r.y<sy-sh/2||r.y>sy+sh*1.5)continue;const q=at(m,dx+(r.x-sx)*kx,dy+(r.y-sy)*ky);
      add(this.canvas,{k:r.k,key:r.key,x:q[0],y:q[1],z:r.z*k,a:r.a*this.globalAlpha,b:r.b,arms:r.arms,flip:r.k==="P"?r.flip!==(m.a*kx<0):false,ws:r.ws});}}}
  return di.apply(this,arguments);};
const draw=T=>{mx.setTransform(1,0,0,1,0,0);mx.globalAlpha=1;mx.globalCompositeOperation="source-over";mx.clearRect(0,0,192,108);
  try{renderFrame(mx,S,T);}catch(e){}};
// 1. where the dissolves and crossfades are
const fr=new Set(),spans=[],win=(a,b)=>{spans.push([a,b]);for(let f=Math.max(0,Math.floor(a*30));f<=Math.ceil(b*30);f++)if(f/30<TL.total)fr.add(f);};let wins=0;
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
// the lines of words that stay through a change: drawn on the frame just before it and just after it, in the same place, such as a
// heading on a room's wall while what is in the room leaves; for the words two lines share, which show twice only where both change
const lines=T=>{H.pend=new Map();H.comp={};H.lay={};H.on=true;draw(Math.min(Math.max(T,0),TL.total-1/30));H.on=false;
  return(H.pend.get(main)||[]).filter(r=>r.k==="T"&&r.a>0.05&&inside(r));};
const stay=spans.map(([a,b])=>{const A0=lines(a-0.05),B0=lines(b+0.05);return{a,b,ls:A0.filter(p=>B0.some(q=>q.key===p.key&&near(p,[q])<=PX))};});
const stays=(f,r)=>stay.some(w=>f>=w.a*30-1&&f<=w.b*30+1&&w.ls.some(q=>q.key===r.key&&near(r,[q])<=PX));
for(const f of fs){const T=f/30;H.pend=new Map();H.comp={};H.lay={};H.on=true;draw(T);H.on=false;
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
    // words in part: a run of whole words that is all of one line and part of another, such as "Change board" alone and in "Change
    // board · once a month", where both pictures draw it and nowhere in the same place (where the run is drawn, from where each line
    // starts); what stays through the change (on top of both pictures, or drawn in the same place just before and just after it),
    // such as a chapter's heading, doesn't show twice, and what the other picture draws where it is shows once
    const top=side==="dis"?0:1,wa=A.filter(r=>r.k==="T"&&r.a>0.05&&r.ws&&r.ws.length),wb=B.filter(r=>r.k==="T"&&r.a>0.05&&r.ws&&r.ws.length),
      on=r=>!(r.top&&r.top[top])&&!stays(f,r);
    if(wa.length&&wb.length){const has=new Map(),shared=new Map();for(const q of wb)for(const t of q.ws){let s=has.get(t.w);if(!s)has.set(t.w,s=new Set());s.add(q);}
      for(const p of wa){const qs=new Set();for(const t of p.ws)for(const q of has.get(t.w)||[])qs.add(q);
        for(const q of qs){if(q.key===p.key)continue;const n=p.ws.length,m=q.ws.length;
          for(let i=0;i<n;i++)for(let j=0;j<m;j++){if(p.ws[i].w!==q.ws[j].w||(i&&j&&p.ws[i-1].w===q.ws[j-1].w))continue;let L=0;
            while(i+L<n&&j+L<m&&p.ws[i+L].w===q.ws[j+L].w)L++;
            const run=p.ws.slice(i,i+L).map(t=>t.w),u=run.join(" "),nl=run.join("").replace(/[^\p{L}\p{N}]/gu,"").length;
            const wh=L===n||L===m,ln=L===n?q.key:p.key,o=shared.get(u);if(L<WN||nl<WL||(WH&&!wh))continue;
            if(!o)shared.set(u,{run,ln,wh});else if(wh&&!o.wh)Object.assign(o,{ln,wh});}}}
      const where=(rs,run)=>{const out=[];for(const r of rs)for(let i=0;i+run.length<=r.ws.length;i++){let k=0;while(k<run.length&&r.ws[i+k].w===run[k])k++;
          if(k===run.length)out.push({x:r.x+(r.b[0]+r.ws[i].x)*r.z,y:r.y,z:r.z});}return out;};
      for(const [u,{run,ln,wh}] of shared){const pa=where(wa,run),pb=where(wb,run),ua=where(wa.filter(on),run).filter(p=>near(p,pb)>PX),ub=pb.filter(q=>near(q,pa)>PX);
        if(ua.length&&ub.length){let d=Infinity;for(const p of ua)for(const q of ub)d=Math.min(d,Math.hypot(p.x-q.x,p.y-q.y)/S+(Math.abs(p.z/q.z-1)>SIZE?1e4:0));
          probs.push({f,side,k:"W",key:u,d:d>=1e4?1e4:Math.round(d),ln:ln.slice(0,60),wh});}}}
    const ra=A.filter(r=>r.k==="R"&&r.a>0.05),rb=B.filter(r=>r.k==="R"&&r.a>0.05);
    for(const p of ra)for(const q of rb)if(p.key===q.key){const d=Math.hypot(p.cam[0]-q.cam[0],p.cam[1]-q.cam[1])+1000*Math.abs(p.cam[2]/q.cam[2]-1);
      if(d>ROOM)probs.push({f,side,k:"R",key:p.key,d:Math.round(d)});}}}
const runs=s=>{const a=[...s].sort((x,y)=>x-y);let n=0;for(let i=0;i<a.length;i++)if(!i||a[i]-a[i-1]>2)n++;return n;};
return{frames:fs.length,dis:runs(seen.dis),xf:runs(seen.xf),wins,probs,scenes:SCENES.map(s=>[s.id,s.start])};}"""



def read(pg, words=None, letters=None, whole=None):
    """What the page's part finds, on a page with the film loaded: {frames, dis, xf, wins, probs, scenes}"""
    return pg.evaluate(JS, dict(px=PX, size=SIZE, room=ROOM, arm=ARM, seen=SEEN, words=WORDS if words is None else words,
                                letters=LETTERS if letters is None else letters, whole=WHOLE if whole is None else whole))


def changes(r):
    """Each change of shot or chapter that shows something twice: its frames (less than three apart), its chapter and what shows twice
    (got: P people, T lines of words, W words in part, A arms, R places; each {what: px apart, or 1e4 at two sizes})"""
    scenes = r['scenes']
    trans = []
    for p in sorted(r['probs'], key=lambda p: (p['side'], p['f'])):
        if trans and trans[-1]['side'] == p['side'] and p['f'] - trans[-1]['f2'] <= 2:
            trans[-1]['f2'] = p['f']
        else:
            trans.append(dict(side=p['side'], f=p['f'], f2=p['f'], got={'P': {}, 'T': {}, 'W': {}, 'R': {}, 'A': {}}, line={}))
        g = trans[-1]['got'][p['k']]
        g[p['key']] = max(g.get(p['key'], 0), p['d'])
        if p['k'] == 'W':
            trans[-1]['line'].setdefault(p['key'], p.get('ln', ''))
    for c in trans:
        t = c['f'] / 30
        c['t'] = t
        c['sid'], c['start'] = [s for s in scenes if s[1] <= t + 1e-6][-1]
        for k in [k for k in c['got']['W'] if k in c['got']['T']]:
            del c['got']['W'][k]  # the whole line shows twice, and says so
    return [c for c in trans if any(c['got'].values())]


def known_in(c, known):
    """the words in part of change c that the list of words still to fix names ([[chapter id, words], ...])"""
    return {k for k in c['got']['W'] if any(len(e) >= 2 and e[0] == c['sid'] and e[1] == k for e in known)}


def line(c, known=()):
    """a change of shot or chapter that shows something twice, in words; known: the words in part to mark as known"""
    bits = []
    P, T, W, R = c['got']['P'], c['got']['T'], c['got']['W'], c['got']['R']
    far = lambda d: '%d px apart' % d if d < 1e4 else 'at two sizes'
    for got, fmt in ((P, '%s'), (T, '"%s"')):
        ks = sorted(got, key=lambda k: -got[k])
        if ks:
            bits.append(', '.join('%s %s' % (fmt % k[:30], far(got[k])) for k in ks[:4]) + (' and %d more' % (len(ks) - 4) if len(ks) > 4 else ''))
    ks = sorted(W, key=lambda k: -W[k])
    if ks:
        bits.append(', '.join('%s"%s" %s (in "%s")' % ('(known) ' if k in known else '', k[:30], far(W[k]), c['line'][k][:40]) for k in ks[:4])
                    + (' and %d more' % (len(ks) - 4) if len(ks) > 4 else ''))
    for k, d in sorted(c['got']['A'].items()):
        bits.append('%s %s' % (k, 'facing both ways' if d >= 1e4 else 'with arms in two poses %d degrees apart' % d))
    for k, d in R.items():
        bits.append('the place %s under two cameras %d apart' % (k, d))
    return '%7.2f s  %-10s +%-6.2f twice in a %s: %s' % (c['t'], c['sid'], c['t'] - c['start'],
                                                        'dissolve' if c['side'] == 'dis' else 'chapter crossfade', '; '.join(bits))


def film_key(pg):
    """the release key of the film on the page (the film whose source folder holds it, in the language FILM_LANG names), or None"""
    import os, urllib.parse
    u = urllib.parse.urlsplit(pg.url)
    if u.scheme != 'file':
        return None
    here = pathlib.Path(urllib.parse.unquote(u.path)).resolve()
    sys.path.insert(0, str(ROOT / '.github' / 'scripts'))
    import films as release_films
    lang = os.environ.get('FILM_LANG', 'en')
    mine = [e for e in release_films.films() if e['lang'] == lang and (ROOT / e['dir']).resolve() in here.parents]
    return max(mine, key=lambda e: len(e['dir']))['key'] if mine else None


def later():
    """Words shown twice in part, found when this check came to read them, to be fixed film by film: {film key: [[chapter id, words], ...]}"""
    return json.loads(LATER.read_text(encoding='utf-8')) if LATER.exists() else {}


def check(pg, known=None):
    """Run on a page with the film loaded (lang.render_page). Returns (what it checked, a line for each change of shot or chapter
    that shows something twice). known: the film's words in part still to fix ([[chapter id, words], ...]; by default its entry in
    site-tools/twice_later.json): a change that shows only those twice is listed in what it checked, and doesn't fail."""
    r = read(pg)
    if known is None:
        known = later().get(film_key(pg) or '', [])
    lines, kept, cs = [], [], changes(r)
    for c in cs:
        k = known_in(c, known)
        only = k and k == set(c['got']['W']) and not any(c['got'][x] for x in 'PTRA')
        (kept if only else lines).append(line(c, k))
    lines.sort()
    msg = 'checked %d dissolves and %d chapter changes (%d frames)' % (r['dis'], r['xf'], r['frames'])
    if kept:
        msg += ('; %d show%s words twice in part, known and still to fix (site-tools/twice_later.json):\n' % (len(kept), 's' if len(kept) == 1 else '')
                + '\n'.join('  (known) ' + l for l in sorted(kept)))
    found = {(c['sid'], k) for c in cs for k in c['got']['W']}
    for e in known:
        if (e[0], e[1]) not in found:
            msg += '\n  (no longer twice) chapter %s, "%s": take it off the list in site-tools/twice_later.json' % (e[0], e[1])
    if r['wins'] and not r['dis']:
        lines.append('found no dissolve to check, though the chapters pass shots that dissolve: is the dissolve drawn on a canvas this '
                     'check knows (wc_buf("cut") or ag_buf("cut"))?')
    return msg, lines


def main():
    import argparse, os
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--film', action='append', help="a release key, after the film's tools/build.py; may be repeated")
    ap.add_argument('--all', action='store_true', help="every film a release.json names (build them first: nothing is built here)")
    ap.add_argument('--later', action='store_true', help='with --all: list every film\'s words in part in site-tools/twice_later.json')
    A = ap.parse_args()
    from playwright.sync_api import sync_playwright
    if not (A.film or A.all):
        from lang import render_page
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
        return
    if A.later and not A.all:
        ap.error('--later lists every film: use it with --all')
    sys.path.insert(0, str(ROOT / '.github' / 'scripts'))
    import films as release_films
    inv = {e['key']: e for e in release_films.films()}
    keys = list(inv) if A.all else A.film
    unknown = [k for k in keys if k not in inv]
    if unknown:
        ap.error('unknown film key %s' % ', '.join(unknown))
    failed, words = [], {}
    with sync_playwright() as p:
        b = p.chromium.launch(args=['--allow-file-access-from-files'])
        for key in keys:
            e = inv[key]
            page = ROOT / e['dir'] / pathlib.Path(e['player']).parent / 'render.html'
            if not page.exists():
                raise SystemExit('%s: no %s; run its tools/build.py first%s' % (key, page, ' (FILM_LANG=%s)' % e['lang'] if e['lang'] != 'en' else ''))
            pg = b.new_page(viewport={'width': 1920, 'height': 1080})
            pg.goto(page.as_uri())
            pg.wait_for_function('window.__READY__===true', timeout=180000)
            if A.later:
                found = sorted({(c['sid'], k) for c in changes(read(pg)) for k in c['got']['W']})
                if found:
                    words[key] = [list(x) for x in found]
                print('%s: %d words in part' % (e['name'], len(found)), flush=True)
            else:
                msg, bad = check(pg)
                print('%s: %s' % (e['name'], msg), flush=True)
                for l in bad:
                    print('  ' + l, flush=True)
                if bad:
                    failed.append(key)
            pg.close()
        b.close()
    if A.later:
        LATER.write_text(json.dumps(words, indent=1, ensure_ascii=False) + '\n', encoding='utf-8')
        print('listed %d films in %s' % (len(words), LATER.relative_to(ROOT)))
    elif failed:
        sys.exit('%d film%s show something twice where they change shot or chapter: %s' % (len(failed), 's' if len(failed) > 1 else '', ', '.join(failed)))


if __name__ == '__main__':
    main()
