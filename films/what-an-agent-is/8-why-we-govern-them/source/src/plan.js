/* ===== Why we govern them: the room's own pieces =====
   The film's pieces in the module's lab, all prefixed wg_ / WG_ (shared/src is never changed for one film):
     the room's usual shot (WR): Jun standing at the left, the cards he talks about beside him, the agent in its ring in the middle,
     its tools at the wall's right, the four needs along the top of the wall, the switch on the wall below the cards, the oak tray on
     the floor, and production behind glass at the right;
     its pieces: the four question cards that turn over to their answers, the census count with its check, the plain job, a draft,
     the marks a person gives it, the outlined cards of what more it could do, the word cards from the series' earlier films, the owner
     tag, the switch and its wire, the log, the role card, the rails along the agent's arms, two bars, the mandate, the approve box,
     the frame on the floor where it works in test, the report, the shelf of three references, the cards that flick past, and the
     cards for what comes next. Colours keep the module's meanings: blue tools and structure (and limits), violet the model and what it
     does, orange data and evidence, green a check that passes or an approval, amber a check that fails. */

// a value worked out once per chapter (the cue times its scene uses)
function wg_once(sc,k,fn){sc.__wg=sc.__wg||{};if(!(k in sc.__wg))sc.__wg[k]=fn();return sc.__wg[k];}

/* ---------------------------------------------------------------- where things stand in the room's usual shot
   As the style prototype (style X) has it: Jun standing at the left, from the waist up; the cards he talks about beside him; the agent
   in its ring, floating on the wall with its shadow on the floor; its tools at the wall's right; the oak tray on the floor; production
   behind glass at the right, below the tools. The four needs run along the top of the wall, each lighting in its chapter. */
const WR={agent:{x:1140,y:470,R:150,r:78},jun:{x:250,y:610,s:0.98},cards:{x:476,y:250,w:430},
  four:{x1:1872,y:132,h:76,gap:14},tools:{x:1600,w:262,h:116,y:[270,420,570]},
  tray:{x:1400,y:792,w:300},glass:{x:1564,y:712,w:308,h:168},sw:{x:880,y:604}};
WR.hook=WR.agent.y+WR.agent.R;
// the lab with quieter marble where this film puts its words: the cards beside Jun, the four needs, the agent, the kicker, the tools
const WG_QUIET=[[690,445,260,230,0.55],[1240,170,660,70,0.5],[1140,470,250,230,0.45],[420,96,360,46,0.3],[1730,480,170,260,0.45]];
AG_PLACES.wgLab=c=>ag_paintLab(c,{quiet:WG_QUIET});
AG_PLACES.wgLabNight=c=>ag_paintLab(c,{quiet:WG_QUIET,night:true,lamp:[860,780]});
AG_ROOMS.wgLabNight="wgLab";                               // the lab by night is the lab: the camera glides from one to the other

/* ---------------------------------------------------------------- the agent
   wg_agent(ctx, t, o): the loop (ag_loop) at WR.agent unless o.x, o.y, o.R, o.r; o.core, o.think, o.lit, o.p, o.pulse, o.a, o.dim (0 to
   1: the band goes dark, as when it's stopped); its shadow on the floor; no label (A model, reasoning, hands and a loop names the model). Returns the steps' boxes. */
function wg_agent(ctx,t,o){o=o||{};const A=WR.agent,x=o.x==null?A.x:o.x,y=o.y==null?A.y:o.y,R=o.R||A.R,r=o.r||A.r,a=o.a==null?1:o.a,dim=clamp(o.dim||0,0,1);
  if(a<=0)return[];if(o.floor!==false)withA(ctx,a,()=>ag_floorShadow(ctx,x+AG.sdx*3,o.floorY||Math.max(y+R+130,700),R*1.15,22,0.2));
  return ag_loop(ctx,x,y,{R,r,t,a,p:o.p,core:(o.core==null?1:o.core)*(1-dim*0.92),think:(o.think||0)*(1-dim),lit:o.lit,col:o.col,pulse:o.pulse,label:o.label===undefined?null:o.label,stepA:o.stepA,stepK:o.stepK});}
// an arm from the ring's right towards a point: the curve ag_reach takes
function wg_armTo(x1,y1,o){o=o||{};const A=WR.agent,x=o.x==null?A.x:o.x,y=o.y==null?A.y:o.y,R=o.R||A.R,x0=x+R*0.62,y0=y+R*0.42+(o.dy||0);
  return[x0,y0,lerp(x0,x1,0.35),y0+(o.bow==null?60:o.bow),lerp(x0,x1,0.75),y1+(o.bow2==null?20:o.bow2),x1,y1];}
// the tools at the wall's right, read only: o.touch[i], o.a[i] (each), o.sub[i] a line of its own
function wg_tools(ctx,o){o=o||{};const T_=WR.tools,names=["Catalog","Query","Docs"];names.forEach((n,i)=>{const a=o.a?o.a[i]:1;if(a<=0)return;
  ag_tool(ctx,T_.x,T_.y[i],T_.w,T_.h,n,{a,touch:o.touch?o.touch[i]:0,sub:o.sub?o.sub[i]:undefined});});}

/* ---------------------------------------------------------------- the four needs, along the top of the wall
   wg_four(ctx, st): st.q[i] (0 to 1) each card arriving (it springs), st.flip[i] (0 the question, 1 the answer, turning between),
   st.lit[i] (0 to 1, a blue edge and glow: the chapter's own), st.pop[i] (0 to 1, a short swell as it's named), st.a; the row ends at WR.four.x1. Each card fits its words, and the row
   closes up as the questions turn into their shorter answers. Returns the boxes. */
const WG_ASK=["Who answers for it?","Under what name?","What may it touch?","Who checks its work?"],WG_NEED=["An owner","An identity","Limits","Review"];
function wg_four(ctx,st){st=st||{};const F=WR.four,a=st.a==null?1:st.a,out=[];
  const fl=i=>st.flip?clamp(st.flip[i],0,1):1,wq=WG_ASK.map(s=>ag_tw(ctx,s,{w:600,size:28})+56),wa=WG_NEED.map(s=>ag_tw(ctx,s,{w:800,size:30})+60);
  const ws=wq.map((q,i)=>lerp(q,wa[i],ag_sine(fl(i)))),tot=ws.reduce((s,w)=>s+w,0)+F.gap*3;let x=(st.x1||F.x1)-tot;
  for(let i=0;i<4;i++){const w=ws[i],y=st.y||F.y,b={x,y,w,h:F.h};out.push(b);x+=w+F.gap;const q=st.q?st.q[i]:1;if(q<=0||a<=0)continue;
    const f=fl(i),lit=st.lit?clamp(st.lit[i]||0,0,1):0,sx=Math.max(0.02,Math.abs(Math.cos(Math.PI*f))),qk=clamp(q,0,1.2);
    ctx.save();ctx.globalAlpha*=a*clamp(q*1.4,0,1);ctx.translate(b.x+w/2,y+F.h/2);const pp=1+0.12*clamp(st.pop?st.pop[i]||0:0,0,1);ctx.scale(sx*lerp(0.7,1,qk)*pp,lerp(0.7,1,qk)*pp);ctx.translate(-w/2,-F.h/2);
    ag_box(ctx,0,0,w,F.h,18,{edge:lit>0.02?AG.blue:null,edgeA:0.95*lit,lw:3,glow:lit>0.02?AG.blue:null,glowA:lit});
    // the words show only while the card faces us at nearly full size: turning edge-on or springing in, they'd read under 28 px
    const ta=clamp((lerp(0.7,1,qk)*pp*Math.sqrt(sx)-0.9)/0.08,0,1);
    if(f<0.5)ag_T(ctx,WG_ASK[i],w/2,F.h/2+10,{w:600,size:28,col:AG.ink,align:"center",a:ta});else ag_T(ctx,WG_NEED[i],w/2,F.h/2+11,{w:800,size:30,col:lit>0.5?AG.blue:AG.ink,align:"center",a:ta});
    ctx.restore();}
  return out;}

/* ---------------------------------------------------------------- the census count, its check, the plain job, a draft and its marks */
// the count (the answer of A model, reasoning, hands and a loop): o.fail 0 (green, "Matches the source") to 1 (amber, "Check failed"); o.gov (0 to 1) the line under its
// pill, "to the government"; o.w its width (520); o.k springs it in
function wg_count(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,w=o.w||520;if(a<=0)return null;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+90,lerp(0.6,1,o.k));
  const b=ag_textCard(ctx,x,y,w,{kick:"Census-day count",title:"18,412 students"},{kickCol:AG.kick});
  const f=clamp(o.fail||0,0,1);
  if(f<1)ag_pill(ctx,x+28+ag_tw(ctx,"Matches the source",{w:700,size:30})/2+48,b.y+b.h+44,"Matches the source",{icon:"tick",col:AG.green,a:1-f});
  if(f>0)ag_pill(ctx,x+28+ag_tw(ctx,"Check failed",{w:700,size:30})/2+48,b.y+b.h+44,"Check failed",{icon:"warn",col:AG.amber,a:f});
  if(o.gov>0)ag_T(ctx,"to the government",x+28,b.y+b.h+118,{w:600,size:28,col:AG.mut,a:o.gov});
  ctx.restore();return b;}
// the plain job that counts them: a blue card (tools and structure), with a green tick while it passes
function wg_plain(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+240,y+60,lerp(0.6,1,o.k));
  const b=ag_textCard(ctx,x,y,470,{kick:"Plain job",title:"every census day"},{kickCol:AG.blue,edge:AG.blue,edgeA:0.6});
  if(o.tick>0)withA(ctx,o.tick,()=>ag_tick(ctx,b.x+b.w-48,b.y+b.h/2,30,rgba(AG.green,1),5));ctx.restore();}
// a draft card, as it lies in the tray (x, y its centre): a pen and its words
function wg_draft(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=ag_tw(ctx,text,{w:700,size:28})+92,h=58;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x,y,lerp(0.6,1,o.k));ag_box(ctx,x-w/2,y-h/2,w,h,14,{edge:AG.violet,edgeA:0.5});
  ag_pen(ctx,x-w/2+34,y,26,rgba(AG.violet,1));ag_T(ctx,text,x-w/2+60,y+10,{w:700,size:28});ctx.restore();}
// a person's mark: "reviewed · Jun" (a plain tick) or, approved, in green; it springs in like a stamp
function wg_mark(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a,k=o.k==null?1:o.k;if(a<=0||k<=0)return;ctx.save();ctx.globalAlpha*=a*clamp(k*2,0,1);ag_about(ctx,x,y,lerp(1.5,1,clamp(k,0,1.3)));
  ag_pill(ctx,x,y,text,{icon:"tick",col:o.ok?AG.green:AG.ink});ctx.restore();}

/* ---------------------------------------------------------------- what more it could do: outlined cards, filled in at the end */
function wg_ghost(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=ag_tw(ctx,text,{w:700,size:30})+64,h=78,f=clamp(o.fill||0,0,1);
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,o.k));
  if(f>0)ag_box(ctx,x,y,w,h,20,{a:f,edge:AG.violet,edgeA:0.5});
  ctx.strokeStyle=rgba(AG.mut,0.7*(1-f));ctx.lineWidth=2.4;ctx.setLineDash([10,9]);rr(ctx,x,y,w,h,20);ctx.stroke();ctx.setLineDash([]);
  ag_T(ctx,text,x+32,y+h/2+11,{w:700,size:30,col:mix(AG.mut,AG.ink,f)});ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the word cards: what the series' earlier films showed */
function wg_word(ctx,x,y,w,film,title,sub,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+40,y+60,lerp(0.6,1,o.k));
  const b=ag_textCard(ctx,x,y,w,{kick:film,title,sub},{kickCol:AG.kick,edge:o.hl>0?AG.violet:null,edgeA:0.8*(o.hl||0)});ctx.restore();return b;}

/* ---------------------------------------------------------------- the owner tag, the badge, the switch and its wire
   wg_tag(ctx, hx, hy, text, o): a paper tag on a string from a hook at (hx, hy); o.dx, o.dy where the tag's middle hangs, o.sw a
   swing (radians), o.a. wg_hand: an empty, hand-shaped outline, "next owner". */
function wg_tag(ctx,hx,hy,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const dx=o.dx==null?-120:o.dx,dy=o.dy==null?70:o.dy,w=ag_tw(ctx,text,{w:700,size:28})+70,h=56;
  ctx.save();ctx.globalAlpha*=a;ctx.translate(hx,hy);ctx.rotate(o.sw||0);
  ctx.strokeStyle="rgba(87,82,76,0.85)";ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(dx*0.4,dy*0.3,dx+w/2-22,dy);ctx.stroke();
  ctx.translate(dx,dy);ag_card(ctx,c=>{c.moveTo(-w/2+16,-h/2);c.lineTo(w/2,-h/2);c.lineTo(w/2,h/2);c.lineTo(-w/2+16,h/2);c.lineTo(-w/2,0);c.closePath();},{x:-w/2,y:-h/2,w,h},{});
  ctx.fillStyle="rgba(87,82,76,0.6)";ctx.beginPath();ctx.arc(w/2-22,0,5,0,TAU);ctx.fill();
  ag_T(ctx,text,-w/2+26,10,{w:700,size:28});ctx.restore();}
function wg_hand(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(AG.mut,0.8);ctx.lineWidth=3;ctx.setLineDash([9,8]);ctx.lineJoin="round";
  ctx.beginPath();ctx.moveTo(x-46,y+60);ctx.lineTo(x-50,y-6);ctx.quadraticCurveTo(x-50,y-30,x-34,y-30);ctx.lineTo(x-30,y-64);ctx.quadraticCurveTo(x-22,y-80,x-14,y-64);ctx.lineTo(x-12,y-40);
  ctx.lineTo(x-8,y-84);ctx.quadraticCurveTo(x,y-100,x+8,y-84);ctx.lineTo(x+8,y-40);ctx.lineTo(x+16,y-76);ctx.quadraticCurveTo(x+24,y-90,x+30,y-74);ctx.lineTo(x+28,y-30);
  ctx.lineTo(x+40,y-56);ctx.quadraticCurveTo(x+52,y-64,x+54,y-48);ctx.lineTo(x+40,y+10);ctx.quadraticCurveTo(x+34,y+44,x+30,y+60);ctx.stroke();ctx.setLineDash([]);
  ag_T(ctx,"next owner",x,y+104,{w:700,size:28,col:AG.mut,align:"center"});ctx.restore();}
// a pale oak switch with a graphite lever: on 1 (up: the agent runs, a small violet light) to 0 (down: stopped)
function wg_switch(ctx,x,y,on,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;on=clamp(on,0,1);ctx.save();ctx.globalAlpha*=a;
  ag_soft(ctx,cc=>ag_rect(cc,x-48,y-30,96,60,12),AG_OAK.base,AG_OAK.hi,x+20,y-24,70,rgba(AG_OAK.dark,0.55),8);
  const ang=lerp(0.75,-0.75,on),L=46;ctx.strokeStyle="#36373C";ctx.lineWidth=9;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x,y+6);ctx.lineTo(x+Math.sin(ang)*L,y+6-Math.cos(ang)*L*0.9);ctx.stroke();
  ctx.fillStyle="#2B2B32";ctx.beginPath();ctx.arc(x+Math.sin(ang)*L,y+6-Math.cos(ang)*L*0.9,9,0,TAU);ctx.fill();
  const lc=mix([150,148,144],AG.violet,on);ctx.save();if(on>0.5){ctx.shadowColor=rgba(AG.violet,0.7*on);ctx.shadowBlur=12;}ctx.fillStyle=rgba(lc,1);ctx.beginPath();ctx.arc(x+32,y-14,6,0,TAU);ctx.fill();ctx.restore();
  ctx.restore();}
// a graphite wire through points (a smooth line), drawn as far as p (0 to 1); o.lit lights it violet (current flows)
function wg_wire(ctx,pts,p,o){o=o||{};if(p<=0)return;const a=o.a==null?1:o.a;if(a<=0)return;let L=0;const seg=[];for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);seg.push(d);L+=d;}
  let left=L*clamp(p,0,1);ctx.save();ctx.globalAlpha*=a;ctx.lineCap="round";ctx.lineJoin="round";
  const path=()=>{ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);let r=left;for(let i=1;i<pts.length&&r>0;i++){const u=Math.min(1,r/seg[i-1]);ctx.lineTo(lerp(pts[i-1][0],pts[i][0],u),lerp(pts[i-1][1],pts[i][1],u));r-=seg[i-1];}};
  ctx.strokeStyle=rgba(AG.shadow,0.16);ctx.lineWidth=7;ctx.save();ctx.translate(AG.sdx*0.6,6);path();ctx.stroke();ctx.restore();
  ctx.strokeStyle="#3A3B40";ctx.lineWidth=4.5;path();ctx.stroke();
  if(o.lit>0){ctx.strokeStyle=rgba(AG.violet,0.85*o.lit);ctx.lineWidth=2;path();ctx.stroke();}ctx.restore();}

/* ---------------------------------------------------------------- the log: what the agent did, line by line, and under whose name
   rows: [{text, who, agent (true: its own name, violet), a, hl (0 to 1, lit)}]; o.kick ("Log"); o.n how many rows tall it is (it grows as
   one arrives; all of them unless given); returns the card */
function wg_log(ctx,x,y,w,rows,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return null;const lh=44,h=28+38+(o.n==null?rows.length:o.n)*lh+18;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,22,{});ag_T(ctx,(o.kick||"Log").toUpperCase(),x+28,y+50,{w:700,size:28,ls:4,col:AG.kick});
  rows.forEach((r,i)=>{const ry=y+66+i*lh,ra=r.a==null?1:r.a;if(ra<=0)return;
    if(r.hl>0){ctx.fillStyle=rgba(AG.violet,0.08*r.hl);rr(ctx,x+14,ry+2,w-28,lh-4,10);ctx.fill();}
    ag_T(ctx,r.text,x+28,ry+32,{w:600,size:28,a:ra});
    if(r.who)ag_T(ctx,r.who,x+w-28,ry+32,{w:700,size:28,align:"right",col:r.agent?AG.violet:AG.mut,a:ra});});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the role card: rights from a role
   lines [{text, lock (a blue lock before it), a, hl}]; o.k */
function wg_role(ctx,x,y,w,role,lines,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return null;lines=lines||[];const h=28+38+44+lines.length*42+(lines.length?20:0)+18;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));ag_box(ctx,x,y,w,h,22,{edge:AG.blue,edgeA:0.55});
  ag_T(ctx,"ROLE",x+28,y+50,{w:700,size:28,ls:4,col:AG.blue});ag_T(ctx,role,x+28,y+98,{w:700,size:36});
  lines.forEach((l,i)=>{const ly=y+108+i*42+34,la=l.a==null?1:l.a;if(la<=0)return;
    if(l.hl>0){ctx.fillStyle=rgba(AG.blue,0.09*l.hl);rr(ctx,x+14,ly-30,w-28,40,10);ctx.fill();}
    if(l.lock)ag_lock(ctx,x+42,ly-6,26,rgba(AG.blue,la));ag_T(ctx,l.text,x+(l.lock?68:28),ly,{w:600,size:28,a:la});});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the rails: oak rails along the agent's arms to its tools, and no further */
function wg_rail(ctx,p,u,a){if(u<=0||a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.lineCap="round";
  ctx.strokeStyle=rgba(AG.shadow,0.14);ctx.lineWidth=26;ctx.save();ctx.translate(AG.sdx,10);ag_bzPath(ctx,p,0,u);ctx.stroke();ctx.restore();
  ctx.strokeStyle=rgba(AG_OAK.dark,1);ctx.lineWidth=24;ag_bzPath(ctx,p,0,u);ctx.stroke();ctx.strokeStyle=rgba(AG_OAK.base,1);ctx.lineWidth=19;ag_bzPath(ctx,p,0,u);ctx.stroke();
  ctx.strokeStyle=rgba(AG_OAK.hi,0.9);ctx.lineWidth=3;ctx.save();ctx.translate(0,-5);ag_bzPath(ctx,p,0,u);ctx.stroke();ctx.restore();
  // its end: a small oak stop
  if(u>0.98){const q=ag_bz(p,1);ag_soft(ctx,cc=>cc.arc(q[0],q[1],16,0,TAU),AG_OAK.base,AG_OAK.hi,q[0]+4,q[1]-6,16,rgba(AG_OAK.dark,0.6),5);}
  ctx.restore();}

/* ---------------------------------------------------------------- two bars: what it can do, and what it may do alone (set by a person) */
function wg_bars(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  const bar=(yy,label,fill,col,knob)=>{ag_T(ctx,label,x,yy,{w:700,size:30});const by=yy+22,bh=30;
    ag_soft(ctx,cc=>ag_rect(cc,x,by,w,bh,bh/2),[222,219,212],[240,238,233],x+w*0.8,by,w,"rgba(46,38,28,0.25)",8);
    if(fill>0){ctx.save();ctx.shadowColor=rgba(col,0.35);ctx.shadowBlur=10;ctx.fillStyle=rgba(col,0.9);rr(ctx,x+3,by+3,Math.max(bh-6,(w-6)*fill),bh-6,(bh-6)/2);ctx.fill();ctx.restore();}
    if(knob>0){const kx=x+3+Math.max(bh-6,(w-6)*fill);ctx.save();ctx.globalAlpha*=knob;ag_soft(ctx,cc=>cc.arc(kx,by+bh/2,22,0,TAU),AG_OAK.base,AG_OAK.hi,kx+6,by+4,22,rgba(AG_OAK.dark,0.6),6);ctx.restore();}};
  bar(y,"what it can do",clamp(o.can||0,0,1),AG.violet,0);bar(y+120,"what it may do alone",clamp(o.alone||0,0,1),AG.blue,o.knob||0);ctx.restore();}

/* ---------------------------------------------------------------- the mandate: the shape of one, its headings with blank lines; signed by its owner */
function wg_mandate(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return null;const heads=["which tasks","where","how each is checked","signed by its owner"],rowH=62,last=84,h=28+38+3*rowH+last+52+20;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));ag_box(ctx,x,y,w,h,22,{edge:AG.blue,edgeA:0.5});
  ag_T(ctx,"MANDATE",x+28,y+50,{w:700,size:28,ls:4,col:AG.blue});
  heads.forEach((s,i)=>{const hy=y+66+i*rowH,ly=hy+(i<3?56:last-8);ag_T(ctx,s,x+28,hy+30,{w:700,size:28,col:AG.mut});ctx.strokeStyle="rgba(60,50,40,0.25)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+28,ly);ctx.lineTo(x+w-28,ly);ctx.stroke();});
  // the owner's signature on the last line: one loose stroke, drawn as far as o.sign
  const sg=clamp(o.sign||0,0,1);if(sg>0){const sy=y+66+3*rowH+last-22,sx=x+w*0.3;ctx.strokeStyle=rgba(AG.ink,0.85);ctx.lineWidth=3.2;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();
    const n=60;for(let k=0;k<=n*sg;k++){const u=k/n,px=sx+u*w*0.46,py=sy-14*Math.sin(u*TAU*3.2)*(1-u*0.5)-u*6;k?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.stroke();}
  const fy=y+66+3*rowH+last+40;ag_T(ctx,"can be withdrawn at any time",x+28,fy,{w:600,size:28,col:AG.blue});ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- review: the approve box an agent never has, the frame where it works in
   test, its report, and the marks of the people who check */
function wg_approve(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const g=clamp(o.grey||0,0,1),w=ag_tw(ctx,"approve",{w:700,size:30})+100,h=60;
  ctx.save();ctx.globalAlpha*=a*(1-0.55*g);ag_box(ctx,x-w/2,y-h/2,w,h,16,{edge:mix(AG.green,[150,148,144],g),edgeA:0.8});
  ctx.strokeStyle=rgba(mix(AG.green,[150,148,144],g),1);ctx.lineWidth=3;rr(ctx,x-w/2+24,y-14,28,28,6);ctx.stroke();
  ag_T(ctx,"approve",x-w/2+68,y+11,{w:700,size:30,col:mix(AG.ink,[140,138,134],g)});
  if(g>0){ctx.strokeStyle=rgba([120,118,114],0.9*g);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x-w/2+20,y);ctx.lineTo(lerp(x-w/2+20,x+w/2-20,g),y);ctx.stroke();}ctx.restore();}
// a pale blue frame on the floor, in perspective: (x, y) its front edge's middle, w wide, d deep; o.label under it
function wg_testFrame(ctx,x,y,w,d,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const ins=d*0.4;ctx.save();ctx.globalAlpha*=a;
  ctx.beginPath();ctx.moveTo(x-w/2+ins,y-d);ctx.lineTo(x+w/2-ins,y-d);ctx.lineTo(x+w/2,y);ctx.lineTo(x-w/2,y);ctx.closePath();ctx.fillStyle=rgba(AG.blue,0.07);ctx.fill();
  ctx.strokeStyle=rgba(AG.blue,0.85);ctx.lineWidth=3.4;ctx.setLineDash([16,10]);ctx.stroke();ctx.setLineDash([]);ctx.restore();
  if(o.label)ag_pill(ctx,x,y+46,o.label,{col:AG.blue,a});}
// production behind its glass: the word "Production", and the tables the real work reads, small, in rows
function wg_production(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  ag_T(ctx,"Production",x+28,y+96,{w:700,size:30,col:AG.mut});
  const tw=170,th=118,g=26,nc=Math.max(1,Math.floor((w-56+g)/(tw+g))),nr=Math.max(1,Math.floor((h-160+g)/(th+g))),x0=x+(w-(nc*tw+(nc-1)*g))/2;
  for(let r=0;r<nr;r++)for(let i=0;i<nc;i++){const tx=x0+i*(tw+g),ty=y+128+r*(th+g);ag_box(ctx,tx,ty,tw,th,10,{});
    ctx.fillStyle=rgba(AG.blue,0.3);rr(ctx,tx+10,ty+12,tw-20,14,5);ctx.fill();
    for(let k=0;k<4;k++){ctx.fillStyle="rgba(60,50,40,0.13)";ctx.fillRect(tx+12,ty+42+k*18,(tw-24)*(k%2?0.8:1),6);}}
  ctx.restore();}

/* ---------------------------------------------------------------- the shelf of references: an oak shelf, three books lying on it, spines out
   books [title, ...]; o.k[i] each book sliding in (0 to 1) from the right; returns the shelf's top */
function wg_shelf(ctx,x,y,w,books,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  ag_floorShadow(ctx,x+w/2+AG.sdx*2,y+40,w*0.52,16,0.2);
  ag_soft(ctx,cc=>ag_rect(cc,x,y,w,22,6),AG_OAK.base,AG_OAK.hi,x+w*0.8,y,w,rgba(AG_OAK.dark,0.55),6);
  const cols=[[226,222,214],[214,220,224],[222,214,206]],bh=62;let top=y;
  books.forEach((s,i)=>{const k=o.k?o.k[i]:1;if(k<=0)return;const bw=Math.min(w-60,ag_tw(ctx,s,{w:700,size:30})+90),bx=x+30+i*10+(1-ag_eo(k))*600,by=y-(i+1)*bh;
    ctx.save();ctx.globalAlpha*=clamp(k*2,0,1);ag_soft(ctx,cc=>ag_rect(cc,bx,by,bw,bh-4,8),cols[i%3],[255,255,252],bx+bw*0.8,by,bw,"rgba(46,38,28,0.28)",10);
    ctx.fillStyle="rgba(60,50,40,0.18)";ctx.fillRect(bx+18,by+6,4,bh-16);ctx.fillRect(bx+bw-22,by+6,4,bh-16);
    ag_T(ctx,s,bx+40,by+bh/2+8,{w:700,size:30});ctx.restore();top=by;});
  ctx.restore();return top;}

/* ---------------------------------------------------------------- the people of the room, as this film poses them */
// Jun standing at the left, as the prototype has him, his arms down: o.p (ag_person's gaze, nod, talk), o.dx (a step), o.a (at night he has gone home)
function wg_jun(ctx,t,o){o=o||{};const J=WR.jun,a=o.a==null?1:o.a;if(a<=0.01)return null;let h=null;
  withA(ctx,a,()=>{h=ag_person(ctx,"jun",J.x+(o.dx||0),J.y,J.s,Object.assign({t,gaze:[3,0]},o.p||{}));});return h;}
// a hand's place in the frame, from ag_person's figure-space hands: who drawn at (x, y), size s, flip
function wg_handAt(h,x,y,s,flip){if(!h||!h.near)return null;const A=AG_FIG.anchor;return[x+(flip?-1:1)*(h.near[0]-A[0])*s,y+(h.near[1]-A[1])*s];}

/* ---------------------------------------------------------------- the room's usual things, in their places
   wg_tagOn: the owner tag on the ring's hook (o.dy lifts it, o.sw swings it); wg_badgeOn: the badge beside it, its name turning over
   (flip 0 "Jun Park", 1 "census agent"); wg_switchWire: the switch on the wall, wired to the badge's hook. */
function wg_tagOn(x,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;wg_tag(x,WR.agent.x-30+(o.mx||0),WR.hook-2+(o.dy||0),"owner · Jun Park",{dx:-170,dy:80,sw:o.sw||0,a});}
function wg_badgeOn(x,tt,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const f=clamp(o.flip||0,0,1),sx=Math.max(0.03,Math.abs(Math.cos(Math.PI*f)));
  const hx=WR.agent.x+50,hy=WR.hook-2;x.save();x.globalAlpha*=a;x.translate(hx,hy+(o.dy||0));x.scale(sx,1);x.translate(-hx,-hy);
  wg_badge(x,hx,hy,f<0.5?"Jun Park":"census agent",{t:tt,drop:56,ta:clamp((Math.sqrt(sx)-0.9)/0.08,0,1)});x.restore();}
// the series' badge (ag_badge in shared/src/agent.js), drawn here so its name can fade while it turns edge-on (o.ta), where it would
// read under 28 px; the same badge otherwise
function wg_badge(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const drop=o.drop||90,sw=Math.sin((o.t||0)*1.3)*0.025,w=ag_tw(ctx,text,{w:700,size:28})+48,h=58;
  ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(sw);
  ctx.strokeStyle=rgba(AG.blue,0.9);ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-26,0);ctx.lineTo(-8,drop-10);ctx.moveTo(26,0);ctx.lineTo(8,drop-10);ctx.stroke();
  ctx.fillStyle="#9AA0A8";ctx.fillRect(-9,drop-14,18,14);
  ag_box(ctx,-w/2,drop,w,h,10,{});ctx.fillStyle=rgba(AG.blue,0.85);ctx.fillRect(-w/2+10,drop+4,w-20,5);
  ag_T(ctx,text,0,drop+h/2+15,{w:700,size:28,align:"center",a:o.ta==null?1:o.ta});ctx.restore();}
function wg_switchWire(x,on,o){o=o||{};const S_=WR.sw,a=o.a==null?1:o.a;if(a<=0)return;
  wg_wire(x,[[S_.x+40,S_.y],[1000,S_.y],[1060,646],[WR.agent.x+50,WR.hook+4]],o.p==null?1:o.p,{lit:on*(o.lit==null?1:o.lit),a});wg_switch(x,S_.x,S_.y,on,{a});}
// one of the four rules of its own: a card at the wall's right (x, y its top left, w wide), its number in a blue disc, then the rule
// in lines of its own; returns its height
function wg_rule(ctx,x,y,w,n,lines,o){o=o||{};const a=o.a==null?1:o.a,h=Math.max(84,44+lines.length*40);if(a<=0)return h;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));ag_box(ctx,x,y,w,h,18,{edge:AG.blue,edgeA:0.45});
  ctx.fillStyle=rgba(AG.blue,0.92);ctx.beginPath();ctx.arc(x+48,y+42,20,0,TAU);ctx.fill();ag_T(ctx,String(n),x+48,y+52,{w:800,size:28,col:[255,255,255],align:"center"});
  lines.forEach((l,i)=>ag_T(ctx,l,x+86,y+52+i*40,{w:600,size:30}));ctx.restore();return h;}
// the agent, its owner tag and its badge, moved as one to (cx, cy) and scaled by s: for a shot that frames the room differently
function wg_group(x,tt,cx,cy,s,o){o=o||{};const A=WR.agent;x.save();x.translate(cx,cy);x.scale(s,s);x.translate(-A.x,-A.y);
  wg_agent(x,tt,o);wg_tagOn(x,{});wg_badgeOn(x,tt,{flip:1});x.restore();}
