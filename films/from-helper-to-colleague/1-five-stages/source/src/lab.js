/* ===== Five stages, not a switch: the lab's pieces =====
   Where things stand in the module's lab (FL), and the film's pieces there, prefixed fs_ / FS_:
     the five stages (src/stages.js) stand on the floor, filling the wall (FL.big) or smaller at the right (FL.small), Anil's
     workload agent at the upper left with its badge, the one person the moment needs below it, facing the stages;
     the workload agent's answer for Health's heads of school; a task's tag, which leaves the agent and settles on its stage; a card
     of lines that come in one by one; the pills; the oak plinth under the stages ("What never changes"); the five levels of the
     researchers' scale above the stages; the fourteen nights in test; the planning agent's ticket passing from Jun's helper.
   Colours keep the module's meanings: blue tools and structure (the stages, the gates, the limits), violet the model, orange data
   coming back, green a check that passes or a gate passed, amber a check that fails, a loop, or a task moved down a stage. */

const FL={big:{x:150,y:800,w:1660},small:{x:680,y:800,w:1160},agent:{x:250,y:228,r:62},person:{x:372,y:700,s:0.8},
  agentWide:{x:1360,y:372,r:88}};
// the lab with quieter marble where this film puts its words: the upper left, the stages' cards, the agent
const FS_QUIET=[[500,250,420,190,0.55],[1000,330,820,170,0.45],[1360,380,220,200,0.4],[420,96,360,46,0.3]];
AG_PLACES.fsLab=c=>ag_paintLab(c,{quiet:FS_QUIET});
AG_PLACES.fsLabNight=c=>ag_paintLab(c,{quiet:FS_QUIET,night:true,lamp:[1880,790]});
AG_ROOMS.fsLabNight="fsLab";                             // the lab by night is the lab: from night to morning the camera glides on
const FS_KICK=(x,o)=>ag_kicker(x,"3.1","Five stages, not a switch",o);
// a layout between the big and the small picture of the stages, u 0 to 1
function fs_layout(u){const A=FL.big,B=FL.small,k=ag_sine(u);return{x:lerp(A.x,B.x,k),y:lerp(A.y,B.y,k),w:lerp(A.w,B.w,k)};}

/* ---------------------------------------------------------------- the agent, the people */
// an agent: the sphere, its light on the wall, and its badge on a blue lanyard below it with its name (o.name); o.glow lights the
// badge (its identity); o.think, o.core, o.a
function fs_agent(ctx,t,o){o=o||{};const P_=o.at||FL.agent,a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;
  ag_modelLight(ctx,P_.x,P_.y,P_.r,o.core==null?1:o.core);ag_model(ctx,P_.x,P_.y,P_.r,{t,core:o.core==null?1:o.core,think:o.think||0});
  const hy=P_.y+P_.r+4,drop=o.drop||46;
  if(o.glow>0){const w=ag_tw(ctx,o.name,{w:700,size:28})+48;ctx.save();ctx.globalAlpha*=o.glow;ctx.shadowColor=rgba(AG.blue,0.8);ctx.shadowBlur=26;ctx.strokeStyle=rgba(AG.blue,0.9);
    ctx.lineWidth=4;rr(ctx,P_.x-w/2-6,hy+drop-6,w+12,70,14);ctx.stroke();ctx.restore();}
  ag_badge(ctx,P_.x,hy,o.name||"workload agent",{t,drop});ctx.restore();}
// the one person a moment needs, below the agent, facing the stages; o.p (gaze, nod, talk), o.a; people fade whole
function fs_who(ctx,who,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const S=o.at||FL.person;
  withA(ctx,a,()=>ag_person(ctx,who,S.x+(o.dx||0),S.y,S.s,Object.assign({t,gaze:[4,-1]},o.p||{})));}

/* ---------------------------------------------------------------- cards, tags, pills */
function fs_card(ctx,x,y,w,kick,title,sub,o){o=o||{};return ag_textCard(ctx,x,y,w,{kick,title,sub},{kickCol:o.kickCol||AG.kick,edge:o.edge,edgeA:o.edgeA,tail:o.tail,a:o.a,k:o.k,icon:o.icon});}
// the workload agent's answer for Health's heads of school: who teaches in each school this term, and how many are casual
function fs_answer(ctx,x,y,w,o){o=o||{};return fs_card(ctx,x,y,w,"Health's heads of school","Who teaches in each school","and how many are casual, this term",
  {kickCol:AG.blue,edge:o.ok?AG.green:(o.warn?AG.amber:AG.blue),edgeA:0.6,icon:o.ok?"tick":null,a:o.a,k:o.k});}
// a pill whose left edge is at x (ag_pill takes its middle)
function fs_pillL(ctx,x,y,text,o){o=o||{};const w=ag_tw(ctx,text,{w:700,size:o.size||30})+(o.icon?96:56);return ag_pill(ctx,x+w/2,y,text,o);}
// a card of lines that come in one by one: kick, then lines [{t, a, col}], each 30 px; returns its box
function fs_list(ctx,x,y,w,kick,lines,o){o=o||{};const h=64+lines.length*46+14,a=o.a==null?1:o.a;if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));ag_box(ctx,x,y,w,h,22,{edge:o.edge||AG.blue,edgeA:0.5});
  ag_T(ctx,String(kick).toUpperCase(),x+28,y+48,{w:700,size:28,ls:3,col:o.kickCol||AG.blue});
  lines.forEach((l,i)=>{const la=l.a==null?1:l.a;if(la<=0)return;const ly=y+64+i*46+34;
    if(l.tick){ag_tick(ctx,x+42,ly-10,20,rgba(l.col||AG.green,la),3.6);}
    ag_T(ctx,l.t,x+(l.tick?70:28),ly,{w:700,size:30,col:l.col&&!l.tick?l.col:AG.ink,a:la});});
  ctx.restore();return{x,y,w,h};}
// a task's tag: a pill with a small square at its left in the tag's colour (blue at its stage, amber moved down, green back up)
function fs_tag(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a,col=o.col||AG.blue,w=ag_tw(ctx,text,{w:700,size:28})+72,h=54;if(a<=0)return{x:x-w/2,y:y-h/2,w,h};
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x,y,lerp(0.5,1,o.k));
  ag_box(ctx,x-w/2,y-h/2,w,h,h/2,{edge:col,edgeA:0.75,glow:o.glow?col:null,glowA:o.glow||0});
  ctx.fillStyle=rgba(col,0.9);rr(ctx,x-w/2+20,y-8,16,16,4);ctx.fill();ag_T(ctx,text,x-w/2+48,y+10,{w:700,size:28});ctx.restore();return{x:x-w/2,y:y-h/2,w,h};}
// where a task's tag rests above its stage's card, its right end at the card's: n-th tag on that stage (0 the lowest). The steps rise
// to the right, so a tag wider than its card reaches left, over the lower step, and never into the next card
function fs_tagAt(ctx,st,n,text){const w=ag_tw(ctx,text,{w:700,size:28})+72;return{x:st.x+st.w-w/2,y:st.y-44-n*64};}
// a tag on its way from the agent to its stage (u 0 to 1), then resting there
function fs_tagMove(ctx,from,to,u,text,o){const k=ag_sine(u),x=lerp(from.x,to.x,k),y=lerp(from.y,to.y,k)-Math.sin(Math.PI*clamp(u,0,1))*60;return fs_tag(ctx,x,y,text,o);}

/* ---------------------------------------------------------------- what never changes, the researchers' levels, the nights */
// an oak plinth under the stages, its words on its face
function fs_plinth(ctx,L,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const x=L.x-30,w=L.w+60,y=L.y-2,h=56;ctx.save();ctx.globalAlpha*=a;
  ag_floorShadow(ctx,x+w/2-6,y+h+6,w*0.55,18,0.25);let g=ctx.createLinearGradient(0,y,0,y+h);g.addColorStop(0,rgba(AG_OAK.base,1));g.addColorStop(1,rgba(AG_OAK.dark,1));
  ctx.fillStyle=g;ctx.fillRect(x,y,w,h);ctx.fillStyle=rgba(AG_OAK.hi,0.9);ctx.fillRect(x,y,w,2);
  ag_T(ctx,"WHAT NEVER CHANGES",x+w/2,y+40,{w:700,size:28,ls:5,align:"center",col:[72,56,36]});ctx.restore();}
// the researchers' five levels, named by what the person does, each above its stage's card; o.cross (0 to 1) strikes the last, and
// o.here (0 to 1) puts the film's own line under it
const FS_LEVELS=["Operator","Collaborator","Consultant","Approver","Observer"];
function fs_levels(ctx,stages,o){o=o||{};for(let i=0;i<5;i++){const la=o.p?clamp(o.p[i]||0,0,1):1;if(la<=0)continue;const S=stages[i],y=S.y-40;
    const b=ag_pill(ctx,S.cx,y,FS_LEVELS[i],{col:[86,92,100],a:la*(o.a==null?1:o.a),size:28});
    if(i===4&&o.cross>0){ctx.save();ctx.globalAlpha*=o.cross*la*(o.a==null?1:o.a);ctx.strokeStyle=rgba(AG.amber,0.95);ctx.lineWidth=4;ctx.lineCap="round";
      ctx.beginPath();ctx.moveTo(b.x+20,y);ctx.lineTo(b.x+20+(b.w-40)*ag_sine(o.cross),y);ctx.stroke();ctx.restore();}}}
// the nights in test, one square each, filling green one by one (p 0 to n), with the first and last dates under them (o.from, o.to)
function fs_nights(ctx,x,y,n,p,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const s=24,g=8;ctx.save();ctx.globalAlpha*=a;
  ag_box(ctx,x-28,y-26,n*(s+g)-g+56,s+26+70,22,{edge:AG.green,edgeA:0.35});      // on a card of its own, so its dates read by night
  for(let i=0;i<n;i++){const f=clamp(p-i,0,1),bx=x+i*(s+g);ag_box(ctx,bx,y,s,s,6,{edge:f>0.1?AG.green:[120,116,108],edgeA:0.3+0.6*f});
    if(f>0){ctx.fillStyle=rgba(AG.green,0.85*f);rr(ctx,bx+5,y+5,s-10,s-10,3);ctx.fill();}}
  ag_T(ctx,o.from||"16 October",x,y+s+40,{w:600,size:28,col:AG.mut});ag_T(ctx,o.to||"29 October",x+n*(s+g)-g,y+s+40,{w:600,size:28,col:AG.mut,align:"right"});ctx.restore();}
