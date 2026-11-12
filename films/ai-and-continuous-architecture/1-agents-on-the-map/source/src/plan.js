/* ===== Agents on the map: this film's pictures =====
   Babylon is drawn with the series' components (../../../shared/src/aca.js); the present with The map before the data's (ea.js:
   the six layers, glass elements, sticky notes) and the agent from Keeping it true (kt_agent, through aca_agent). Here: what only this
   film draws, prefixed a1_. Made to read on a phone: every word is at least 28 px in the frame, or marked deco:1 as texture. */

// the layers' colours, by name, as ea.js holds them
const A1_MOT=LAY6[0][1],A1_STR=LAY6[1][1],A1_BUS=LAY6[2][1],A1_INF=LAY6[3][1],A1_APP=LAY6[4][1],A1_TEC=LAY6[5][1];
const A1_RED=[236,104,92],A1_OK=[132,226,160],A1_RET=[255,150,186],A1_NET=[132,176,255],A1_HH=[255,214,170];

// the person seen from the left: a mirror of When things go wrong's person(), for someone on the right of the frame facing in
function a1_personR(ctx,id,x,y,s,o){ctx.save();ctx.translate(x,0);ctx.scale(-1,1);ctx.translate(-x,0);person(ctx,id,x,y,s,o);ctx.restore();}

/* ---------- one buffer, for a whole picture that fades as one ---------- */
// A picture that leaves while another comes in, in one chapter, is drawn into one reused canvas and laid over at its opacity, so its
// parts never show through each other as it fades (a sky through a tower, a ground through a person).
let A1_BUF=null;
function a1_fade(ctx,a,fn){if(a<=0.002)return;if(a>=0.998){ctx.save();fn(ctx);ctx.restore();return;}const cv=ctx.canvas;
  if(!A1_BUF||A1_BUF.width!==cv.width||A1_BUF.height!==cv.height)A1_BUF=mkCanvas(cv.width,cv.height);const o=A1_BUF.getContext("2d");
  o.setTransform(1,0,0,1,0,0);o.globalAlpha=1;o.clearRect(0,0,cv.width,cv.height);o.save();o.setTransform(ctx.getTransform());fn(o);o.restore();
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=a;ctx.drawImage(A1_BUF,0,0);ctx.restore();}

/* ---------- small glyphs ---------- */
// a household: a small house, its door and a window lit, in its colour
function a1_house(ctx,x,y,s,col,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3;ctx.lineJoin="round";ctx.shadowColor=rgba(col,0.6);ctx.shadowBlur=10;
  ctx.beginPath();ctx.moveTo(-34,-6);ctx.lineTo(0,-36);ctx.lineTo(34,-6);ctx.moveTo(-26,-12);ctx.lineTo(-26,28);ctx.lineTo(26,28);ctx.lineTo(26,-12);ctx.stroke();ctx.shadowBlur=0;
  ctx.fillStyle=rgba(col,0.9);ctx.fillRect(-7,6,14,22);ctx.fillStyle=rgba(col,0.35);ctx.fillRect(10,-4,10,10);ctx.restore();});}
// a person, as ArchiMate's actor: a small figure, for "many hands"
function a1_actor(ctx,x,y,s,col,a){if(a<=0.01)return;withA(ctx,a,()=>{archGlyph(ctx,"actor",x,y,s,col);});}

/* ---------- 1. Many hands: what the king's work was split into ---------- */
// a task of the tower's building, as a card of clay with its picture: k is 0 moulding, 1 firing, 2 carrying, 3 bringing bitumen
const A1_TASKS=["moulding mud bricks","firing them in kilns","carrying baskets","bringing bitumen by river"];
function a1_taskCard(ctx,k,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{bab_clay(ctx,x,y,w,h);const cx=x+w/2,fy=y+h-74,col=[64,42,30];
  ctx.save();ctx.beginPath();ctx.rect(x+8,y+8,w-16,h-84);ctx.clip();
  if(k===0){bab_folk(ctx,cx-30,fy+4,104,"mould",t,{col,rim:0,dir:1});}
  else if(k===1){bab_kiln(ctx,cx,fy+4,0.72,t,{col,fire:1});}
  else if(k===2){bab_folk(ctx,cx-50,fy+4,100,"carry",t,{col,rim:0,dir:1,step:t*5});bab_folk(ctx,cx+50,fy+4,94,"carry",t,{col,rim:0,dir:1,step:t*5+2});}
  else{ctx.fillStyle="rgba(70,110,150,0.35)";ctx.fillRect(x+8,fy-6,w-16,40);bab_boat(ctx,cx,fy+2,0.62,t,{col,rim:0});}
  ctx.restore();
  T(ctx,A1_TASKS[k],cx,y+h-30,{w:800,size:30,align:"center",color:rgba(ACA_INK,0.96)});});}

/* ---------- 2 onwards. The present: Tomás's map, the windows and cards on it ---------- */
// The map, where every chapter after the opening finds it: six layers from (A1_MX, A1_MY), A1_MW wide, each A1_SH high
const A1_MX=700,A1_MY=150,A1_MW=1080,A1_SH=84,A1_GAP=18,a1_row=i=>A1_MY+i*(A1_SH+A1_GAP);
// an element of the map, as ArchiMate draws it: o.agent puts the series' teal agent in the glyph's place, o.ghost (0..1) makes it a
// faint, dashed outline (nobody put it on the map), o.hi lights it, o.deco marks its words as texture (the map seen from afar)
function a1_el(ctx,x,y,w,h,name,col,kind,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const sz=o.size||28,gh=clamp(o.ghost||0,0,1),t=o.t||0,hi=o.hi||0;
  withA(ctx,a,()=>{const r=kind==="process"||kind==="role"?Math.min(h/2.4,22):8;
    if(gh<0.999)withA(ctx,1-gh,()=>{glass(ctx,x,y,w,h,r,col,{glow:8+18*hi,ea:0.85,fill:"rgba(7,12,24,0.94)"});ctx.fillStyle=rgba(col,0.12+0.14*hi);rr(ctx,x,y,w,h,r);ctx.fill();});
    if(gh>0.001)withA(ctx,gh,()=>{ctx.save();ctx.fillStyle="rgba(7,12,24,0.72)";rr(ctx,x,y,w,h,r);ctx.fill();ctx.setLineDash([9,8]);ctx.lineDashOffset=-t*8;ctx.strokeStyle=rgba(col,0.8);ctx.lineWidth=2;rr(ctx,x,y,w,h,r);ctx.stroke();ctx.restore();});
    // o.badge: the glyph sits on the box's top-right corner, so a narrow box keeps its whole width for the name
    const bd=!!o.badge,gs=o.gs||Math.min(15,h*0.22),gx=bd?x+w-6:x+w-gs-12,gy=bd?y+4:y+h/2;
    if(bd)withA(ctx,1-0.4*gh,()=>{ctx.save();ctx.fillStyle="rgba(7,12,24,0.97)";ctx.strokeStyle=rgba(col,0.7);ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(gx,gy,gs*1.45,0,TAU);ctx.fill();ctx.stroke();ctx.restore();});
    if(o.agent)aca_agent(ctx,bd?gx:gx-2,gy,gs*0.9,t,{ghost:gh});else if(kind)withA(ctx,1-0.4*gh,()=>archGlyph(ctx,kind,gx,gy,gs,mix(col,INK,0.15)));
    if(!name)return;const tw_=bd?w-20:w-gs*2-34,ls=wrapT(ctx,name,0,0,tw_,{size:sz,w:700,measure:true}),lh=sz*1.12,cx=bd?x+w/2:x+(w-gs*2-12)/2+4;
    ls.forEach((l,i)=>T(ctx,l,cx,y+h/2+sz*0.36-(ls.length-1)*lh/2+i*lh,{w:700,size:sz,align:"center",color:rgba(INK,0.96*(1-0.3*gh)),deco:o.deco}));});}
// ArchiMate's assignment: a dot where it starts (who or what does the work) and an arrowhead where it ends (the role), drawn up to p;
// o.cross (0..1) strikes it out, in red, at its middle
function a1_assign(ctx,x0,y0,x1,y1,col,p,a,o){o=o||{};if(p<=0||a<=0.01)return;withA(ctx,a,()=>{const x=lerp(x0,x1,p),y=lerp(y0,y1,p);ctx.save();ctx.strokeStyle=rgba(col,0.9);ctx.fillStyle=rgba(col,1);ctx.lineWidth=o.lw||3;
  ctx.beginPath();ctx.arc(x0,y0,(o.lw||3)*2,0,TAU);ctx.fill();ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x,y);ctx.stroke();
  if(p>0.95){const an=Math.atan2(y1-y0,x1-x0),hs=(o.lw||3)*4.6;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x1-hs*Math.cos(an-0.4),y1-hs*Math.sin(an-0.4));ctx.lineTo(x1-hs*Math.cos(an+0.4),y1-hs*Math.sin(an+0.4));ctx.closePath();ctx.fill();}ctx.restore();
  if((o.cross||0)>0.01)kt_rcross(ctx,(x0+x1)/2,(y0+y1)/2,o.cr||22,o.cross);});}
// a window on a screen: a bar with its title, and its body, in the colour of the layer it belongs to
function a1_win(ctx,x,y,w,h,title,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,col,{glow:12+14*(o.hi||0),ea:0.7,fill:"rgba(10,14,24,0.97)"});
  ctx.save();rr(ctx,x,y,w,h,16);ctx.clip();ctx.fillStyle=rgba(mix(col,[10,14,24],0.8),1);ctx.fillRect(x,y,w,60);ctx.fillStyle=rgba(col,0.35);ctx.fillRect(x,y+59,w,1.5);ctx.restore();
  [[232,96,84],[245,206,140],[132,226,160]].forEach((c,i)=>{ctx.fillStyle=rgba(c,0.8);ctx.beginPath();ctx.arc(x+28+i*22,y+30,6,0,TAU);ctx.fill();});
  T(ctx,title,x+100,y+40,{w:700,size:o.size||28,color:rgba(mix(col,INK,0.45),1)});});}
// a message in a chat: the household's on the left, warm; the chat's on the right, teal. Returns its height
function a1_bubble(ctx,x,y,w,text,side,o){o=o||{};const a=o.a==null?1:o.a,sz=o.size||30,ls=wrapT(ctx,text,0,0,w-48,{size:sz,w:600,measure:true}),lh=sz*1.26,h=ls.length*lh+30;if(a<=0.01)return h;
  const col=side?KT_AI:A1_HH,bw=Math.min(w,Math.max(...ls.map(l=>tw(ctx,l,sz,600)))+48),X=side?x-bw:x;
  withA(ctx,a,()=>{ctx.save();ctx.fillStyle=side?"rgba(10,40,44,0.96)":"rgba(52,38,26,0.96)";ctx.strokeStyle=rgba(col,0.8);ctx.lineWidth=2;rr(ctx,X,y,bw,h,22);ctx.fill();ctx.stroke();
    ctx.beginPath();const tl=o.tailLeft==null?!side:o.tailLeft,tx=tl?X+40:X+bw-40,ty=o.up?y+1:y+h-1,dy=o.up?-16:14;ctx.moveTo(tx-9,ty);ctx.lineTo(tx+(tl?-14:14),ty+dy);ctx.lineTo(tx+9,ty);ctx.closePath();ctx.fill();ctx.restore();
    ls.forEach((l,i)=>T(ctx,l,X+24,y+15+sz*0.92+i*lh,{w:600,size:sz,color:rgba(mix(col,INK,0.55),1)}));});return h;}
// a sheet of paper with a title and lines: rows are [text, colour, size]; returns its height. o.stamp: a red box round the last row
function a1_paper(ctx,x,y,w,title,rows,o){o=o||{};const a=o.a==null?1:o.a,ts=o.tsize||34,ink=[52,44,40];let h=ts+64;const R=rows.map(([s,col,sz])=>{sz=sz||30;const ls=wrapT(ctx,s,0,0,w-64,{size:sz,w:700,measure:true});h+=ls.length*sz*1.22+18;return[ls,col||ink,sz];});h+=20;
  if(a<=0.01)return h;withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{rot:o.rot==null?0.01:o.rot,plain:true});ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot==null?0.01:o.rot);ctx.translate(-w/2,-h/2);
    T(ctx,title,32,ts+26,{w:800,size:ts,color:rgba(ink,0.96)});ctx.fillStyle="rgba(52,44,40,0.25)";ctx.fillRect(32,ts+42,w-64,2);let yy=ts+66;
    R.forEach(([ls,col,sz],k)=>{const q=o.p?clamp(o.p*R.length-k,0,1):1,last=k===R.length-1&&o.stamp;withA(ctx,q,()=>{if(last){ctx.save();ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=3;rr(ctx,20,yy-6,w-40,ls.length*sz*1.22+20,10);ctx.stroke();ctx.restore();}
      ls.forEach((l,i)=>T(ctx,l,32,yy+sz*0.92+i*sz*1.22,{w:700,size:sz,color:rgba(col,0.96)}));});yy+=ls.length*sz*1.22+18;});ctx.restore();});return h;}
// a setting's switch, as a settings page shows it: u is 0 when it's on (lit, to the right) and 1 when it's off
function a1_switch(ctx,x,y,u,col,a){if(a<=0.01)return;withA(ctx,a,()=>{const e=ease(clamp(u,0,1)),c=mix(col,[90,96,110],e);ctx.save();ctx.fillStyle=rgba(c,0.28+0.3*(1-e));ctx.strokeStyle=rgba(c,0.95);ctx.lineWidth=2.5;rr(ctx,x,y-22,84,44,22);ctx.fill();ctx.stroke();
  ctx.fillStyle=rgba(mix(c,INK,0.5),1);ctx.shadowColor=rgba(c,0.8);ctx.shadowBlur=10*(1-e);ctx.beginPath();ctx.arc(x+62-40*e,y,16,0,TAU);ctx.fill();ctx.restore();});}
// a dashed group, as ArchiMate draws one: a frame with a tab carrying its name (an activity given whole, here)
function a1_group(ctx,x,y,w,h,name,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const sz=o.size||30,tw_=tw(ctx,name,sz,800)+44,th=sz+22,hi=o.hi||0;ctx.save();
  ctx.fillStyle=rgba(col,0.04+0.05*hi);rr(ctx,x,y,w,h,16);ctx.fill();ctx.setLineDash([14,10]);ctx.lineDashOffset=-(o.t||0)*6;ctx.strokeStyle=rgba(col,0.7+0.3*hi);ctx.lineWidth=3+1.5*hi;if(hi>0){ctx.shadowColor=rgba(col,0.8);ctx.shadowBlur=18*hi;}rr(ctx,x,y,w,h,16);ctx.stroke();ctx.setLineDash([]);ctx.shadowBlur=0;
  ctx.fillStyle="rgba(8,12,24,0.97)";rr(ctx,x+20,y-th/2,tw_,th,10);ctx.fill();ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=2;rr(ctx,x+20,y-th/2,tw_,th,10);ctx.stroke();
  T(ctx,name,x+42,y+sz*0.36,{w:800,size:sz,color:rgba(col,1)});ctx.restore();});}
// an owner, as the business side marks one: a gold tick and a name
function a1_owner(ctx,x,y,name,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const sz=o.size||30;kt_gtick(ctx,x,y,sz*0.5,1);T(ctx,name,x+sz*0.9,y+sz*0.36,{w:800,size:sz,color:rgba(BIZ,1)});});}
// a person, in a window or on a card: ArchiMate's actor, small
function a1_who(ctx,x,y,s,col,a){if(a<=0.01)return;withA(ctx,a,()=>archGlyph(ctx,"actor",x,y,s,col));}
// a card with a coloured kicker and lines below it, for what the narration names; returns its height
function a1_card(ctx,x,y,w,kicker,lines,col,o){o=o||{};const a=o.a==null?1:o.a,sz=o.size||30,L=[];lines.forEach(s=>wrapT(ctx,s,0,0,w-56,{size:sz,w:700,measure:true}).forEach(l=>L.push(l)));
  const h=Math.max(o.minH||0,(kicker?76:28)+L.length*sz*1.25+18);if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,col,{glow:12+14*(o.hi||0),ea:0.85,fill:"rgba(7,11,22,0.96)"});if(o.ghost){ctx.save();ctx.setLineDash([9,8]);ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=2;rr(ctx,x,y,w,h,18);ctx.stroke();ctx.restore();}
    if(kicker)T(ctx,kicker,x+28,y+46,{f:"mono",w:500,size:28,color:rgba(col,1)});L.forEach((l,i)=>T(ctx,l,x+28,y+(kicker?76:28)+sz*0.92+i*sz*1.25,{w:700,size:sz,color:rgba(o.ink||INK,0.96)}));});return h;}
// The map, with the elements this film names: billing and the contact centre's software, and the two agents Tomás put on it, each
// assigned to a role of its own in the business layer, with its owner. Every other element is drawn faint, as texture.
// o: p draws the layers; hi[i] lights a layer; deco marks the names as texture (the map seen from afar); el shows the named elements;
// ag[k] lights an agent; roles shows their roles; own[k] their owners; rights lights their rights; more (0..1) adds the agents found
// later (the end of the film); plat lays the AI platform under it; here and who light where agents work and who answers for them
const A1_APPS=[["billing",960,0],["contact centre",1170,0],["outage agent",1380,1],["map agent",1590,1]],A1_ROLES=[["fault triage",1380,"Grace"],["map drafting",1590,"Tomás"]];
const A1_TEXB=[[0,[980,1200,1420,1640]],[1,[960,1180]],[2,[960,1170]],[3,[960,1170,1380,1590]],[5,[960,1170,1380,1590]]];
const A1_ALL=[["website chat","billing chat"],["outage agent","fault triage"],["crew planner","crew rostering"],["meter agent","meter follow-up"],["field assistant","crew questions"],["map agent","map drafting"]];
function a1_map(ctx,t,o){o=o||{};const p=o.p==null?1:o.p,deco=!!o.deco,R=layerStack(ctx,A1_MX,A1_MY,A1_MW,{p,sh:A1_SH,gap:A1_GAP,hi:o.hi,size:30});if(p<=0)return R;
  // texture: what else the map holds, too small to read and not about agents
  const tx=fin(p,0.6,0.4);if(tx>0.01)A1_TEXB.forEach(([i,xs])=>{const col=LAY6[i][1],ta=tx*0.85*(i===1?1-clamp(o.all||0,0,1):1);if(ta>0.01)xs.forEach((x,k)=>{withA(ctx,ta,()=>{ctx.save();ctx.fillStyle=rgba(col,0.07);ctx.strokeStyle=rgba(col,0.3);ctx.lineWidth=1.4;rr(ctx,x,a1_row(i)+14,180,56,8);ctx.fill();ctx.stroke();
    ctx.fillStyle=rgba(col,0.22);ctx.fillRect(x+20,a1_row(i)+36,90+hash(i*7+k,31)*50,5);ctx.fillRect(x+20,a1_row(i)+50,50+hash(i*7+k,32)*40,5);ctx.restore();});});});
  const el=o.el||0,ro=o.roles||0,ag=o.ag||[0,0],own=o.own||[0,0],y4=a1_row(4)+12,y2=a1_row(2)+12;
  if(el>0.01&&!(o.all>0))A1_APPS.forEach(([nm,x,isA],k)=>{const hi=isA?(ag[k-2]||0)+(o.here||0):0;a1_el(ctx,x,y4,196,60,nm,A1_APP,"component",{a:el,size:21,deco,agent:!!isA,t,hi});});
  if(ro>0.01&&!(o.all>0))A1_ROLES.forEach(([nm,x,who],k)=>{const q=clamp(ro*1.6-k*0.4,0,1);if(q<=0.01)return;a1_assign(ctx,x+98,y4,x+98,y2+64,KT_AI,ease(q),q,{lw:2.4});
    a1_el(ctx,x,y2,196,60,nm,A1_BUS,"role",{a:q,size:21,deco,hi:(o.rights||0)*0.6});
    // its rights, written down: a sheet pinned to the role
    withA(ctx,q,()=>{ctx.save();ctx.translate(x+8,y2-14);ctx.rotate(-0.08);ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=6;ctx.fillStyle="rgba(238,232,218,0.96)";ctx.fillRect(0,0,26,32);ctx.shadowBlur=0;
      ctx.fillStyle="rgba(80,70,60,0.6)";[8,14,20].forEach(yy=>ctx.fillRect(5,yy,16,2.4));if((o.rights||0)>0.01){ctx.strokeStyle=rgba(BIZ,o.rights);ctx.lineWidth=2.4;ctx.strokeRect(-3,-3,32,38);}ctx.restore();});
    // its owner, above it
    const ow=own[k]||0;if(ow>0.01)withA(ctx,ow,()=>{const oy=a1_row(1)+44,hi=o.who||0;kt_gtick(ctx,x+30,oy,12,1);if(hi>0.01)glow(ctx,x+30,oy,40,BIZ,0.5*hi);T(ctx,who,x+50,oy+8,{w:800,size:21,color:rgba(BIZ,1),deco});
      ctx.save();ctx.strokeStyle=rgba(BIZ,0.6);ctx.lineWidth=2;ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(x+30,oy+14);ctx.lineTo(x+30,y2-2);ctx.stroke();ctx.restore();});});
  // every agent, at the end of the film: six in the application layer, each assigned to a role of its own, each with its owner
  const al=o.all||0;if(al>0.01)A1_ALL.forEach(([nm,rl],k)=>{const x=960+k*136,q=clamp(al*2.2-k*0.24,0,1);if(q<=0.01)return;
    a1_el(ctx,x,y4,124,60,nm,A1_APP,"component",{a:q,size:21,deco:true,agent:true,t,gs:10,badge:true,hi:o.here||0});a1_assign(ctx,x+62,y4,x+62,y2+64,KT_AI,1,q,{lw:2});
    a1_el(ctx,x,y2,124,60,rl,A1_BUS,"role",{a:q,size:21,deco:true,gs:10,badge:true,hi:o.roleHi||0});withA(ctx,q,()=>{kt_gtick(ctx,x+62,a1_row(1)+42,13,1);if((o.who||0)>0.01)glow(ctx,x+62,a1_row(1)+42,40,BIZ,0.5*o.who);
      ctx.save();ctx.strokeStyle=rgba(BIZ,0.55);ctx.lineWidth=2;ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(x+62,a1_row(1)+56);ctx.lineTo(x+62,y2-2);ctx.stroke();ctx.restore();});});
  // the AI platform, under what the map runs on
  if((o.plat||0)>0.01)slab(ctx,A1_MX,a1_row(6),A1_MW,48,"the AI platform",KT_AI,{a:o.plat,fill:0.35,hi:o.platHi||0,size:30,sk:34});
  return R;}
// The process of helping a household that can't pay, written down, with its owner: its five tasks, in order, as the role and how-far
// chapters both show them, in the same place, so the camera glides on from one to the other. Tasks are [what, its step, k]: k is the
// order the narration takes them in. o: a; cover (0..1) outlines the tasks the agent's role covers, in teal; keep (0..1) lights what
// stays with people, in gold (the activity, and the decision in it); own (0..1) its owner; hi[i] lights a task
const A1_TASKS5=["answer a question about a bill","take a request for more time","tell the officer what's owed and paid","check the plan follows the hardship rules","agree the plan"];
const A1_PX=a1i=>140+a1i*330,A1_PY=272,A1_PW=308,A1_PH=170;
function a1_proc(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const cv=o.cover||0,kp=o.keep||0,hi=o.hi||[];
  withA(ctx,a,()=>{a1_group(ctx,100,222,1720,330,"help a household that can't pay",mix(A1_BUS,BIZ,kp),{t,hi:kp*0.8});
    A1_TASKS5.forEach((nm,i)=>{const x=A1_PX(i),dec=i===4,col=dec?mix(A1_BUS,BIZ,kp):A1_BUS;a1_el(ctx,x,A1_PY,A1_PW,A1_PH,nm,col,"process",{size:28,hi:(hi[i]||0)+(dec?kp*0.7:0),gs:13});
      if(!dec&&cv>0.01)withA(ctx,cv,()=>{ctx.save();ctx.strokeStyle=rgba(KT_AI,0.95);ctx.lineWidth=3;ctx.shadowColor=rgba(KT_AI,0.7);ctx.shadowBlur=12;rr(ctx,x-7,A1_PY-7,A1_PW+14,A1_PH+14,24);ctx.stroke();ctx.restore();aca_agent(ctx,x+30,A1_PY+26,11,t,{});});});
    // its owner, on the frame
    if((o.own||0)>0.01)withA(ctx,o.own,()=>{glass(ctx,1440,196,350,52,26,BIZ,{glow:10,ea:0.9,fill:"rgba(26,20,8,0.97)"});a1_owner(ctx,1470,222,"head of retail",1,{size:30});});});}
