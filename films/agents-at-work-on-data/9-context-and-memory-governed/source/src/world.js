/* ===== Context and memory, governed: the world =====
   The film's places and people, and the small pieces every chapter uses. Every name here starts with cm_ or CM_.
     places       the lab, its marble quieter where the film puts its cards: cmLab (Lucía's corner of Planning, the team's memory on
                  the wall at the right), cmBoard (the whole wall quiet, for the diagrams)
     CM_LUCIA     Lucía Ortega, new in Planning; the same spec as Context engineering's (the series' numbers.md)
     cm_scr       draw in screen space, whatever the camera is doing
     cm_tag       a tag at the top left: where and when
     cm_pillAt    a pill that springs in at t0 and fades at t1
     cm_cardAt    a card (ag_textCard) that springs in at t0 and fades at t1
     cm_dash      a dashed rounded edge, for what is only proposed or a draft
     cm_agent     an agent's sphere, with its light and its name
     cm_lucia     Lucía at her desk, her screen, the calendar on the desk, and her agent beside her
     cm_people    the dots for students: on campus, and the 386 who study online
     cm_library   the library's card: next year's e-books, and how many students they're for */

AG_PLACES.cmLab=c=>ag_paintLab(c,{quiet:[[1440,380,520,260,0.75],[620,220,520,170,0.5],[960,560,700,200,0.3]]});
AG_PLACES.cmBoard=c=>ag_paintLab(c,{seed:3,quiet:[[960,330,980,300,0.8],[960,620,900,160,0.4]]});
AG_PLACES.cmNight=c=>ag_paintLab(c,{seed:5,quiet:[[960,330,980,300,0.8]]});

const CM_LUCIA={name:"Lucía Ortega",role:"Planning",skin:[206,160,124],hair:{style:"long",c:[48,32,26]},earrings:[208,214,226],top:{kind:"sweater",c:[84,88,96]},breath:0.29};
const CM_UNI="The university · Planning · today";

function cm_scr(ctx,S,fn){ctx.save();setScreen(ctx,S);fn();ctx.restore();}
// the place's tag, top left, in screen space (as the module's films tag a place)
function cm_tag(ctx,s,a,o){o=o||{};if(a<=0)return;const f={w:500,size:28,f:"mono"},w=ag_tw(ctx,s,f)+48,x=o.x||64,y=o.y||52,h=56;ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor="rgba(40,32,24,0.2)";ctx.shadowBlur=18;ctx.shadowOffsetX=AG.sdx*0.6;ctx.shadowOffsetY=6;rr(ctx,x,y,w,h,12);ctx.fillStyle="rgba(243,241,237,0.95)";ctx.fill();ctx.restore();
  ctx.strokeStyle=AG.card.edge;ctx.lineWidth=1.2;rr(ctx,x,y,w,h,12);ctx.stroke();ag_T(ctx,s,x+24,y+38,{w:500,size:28,f:"mono",col:AG.ink});ctx.restore();}
function cm_pillAt(ctx,x,y,text,t,t0,t1,o){const a=ag_in(t,t0,0.35)*(t1==null?1:1-ag_in(t,t1,0.5));if(a<=0)return null;const k=ag_spr(t,t0,0.45);
  ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x,y,lerp(0.7,1,clamp(k,0,1.2)));const b=ag_pill(ctx,x,y,text,o||{});ctx.restore();return b;}
function cm_cardAt(ctx,x,y,w,words,t,t0,t1,o){o=o||{};const a=ag_in(t,t0,0.4)*(t1==null?1:1-ag_in(t,t1,0.5));if(a<=0)return ag_textCard(ctx,x,y,w,words,{measure:true});
  return ag_textCard(ctx,x,y,w,words,Object.assign({},o,{a,k:Math.min(1,ag_spr(t,t0,0.5))}));}
// a dashed edge inside a card's own: what is proposed, or only a draft, has no solid edge yet
function cm_dash(ctx,x,y,w,h,r,col,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.setLineDash([12,9]);ctx.strokeStyle=rgba(col||AG.mut,0.8);ctx.lineWidth=2.4;
  rr(ctx,x+5,y+5,w-10,h-10,Math.max(4,r-4));ctx.stroke();ctx.restore();}
// a soft spring in: 0..1 for fading, and k for the scale (0.85 to 1)
function cm_pop(ctx,x,y,t,t0,fn,o){o=o||{};const a=ag_in(t,t0,o.d||0.4)*(o.t1==null?1:1-ag_in(t,o.t1,0.5));if(a<=0)return;const k=Math.min(1.04,ag_spr(t,t0,o.s||0.5));
  ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x,y,lerp(o.from||0.85,1,k));fn(a);ctx.restore();}

/* ---------------------------------------------------------------- an agent: its sphere, its light, its name under it */
function cm_agent(ctx,x,y,r,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  if(o.light!==false)ag_modelLight(ctx,x,y,r,0.8,o.floor);
  ag_model(ctx,x,y,r,{t:t+(o.ph||0),core:o.core==null?0.7:o.core,think:o.think||0,label:o.label||null});ctx.restore();}

/* ---------------------------------------------------------------- Lucía's corner of Planning
   The desk across the left half, Lucía behind it, her screen to her right, a small desk calendar, and her agent beside the desk. */
const CM_DESK={desk:[110,870,880],lucia:[430,560,0.84],screen:[660,620,250,150],agent:[1100,716,62],cal:[200,800]};
function cm_lucia(ctx,S,t,o){o=o||{};const D=CM_DESK,[dx,dy,dw]=D.desk,[lx,ly,ls]=D.lucia,[sx,sy,sw,sh]=D.screen,[ax,ay,ar]=D.agent;
  ag_desk(ctx,dx,dy,dw,{});
  ag_screen(ctx,sx,sy,sw,sh,{stand:dy-70-sy-sh+6,draw:(c,x0,y0,w0,h0)=>{cm_screenRows(c,x0,y0,w0,h0,o.rows==null?1:o.rows);}});
  ag_person(ctx,CM_LUCIA,lx,ly,ls,{t,cut:dy-70,gaze:o.gaze||[4,0],nod:o.nod||0,smile:o.smile==null?0.3:o.smile,blink:o.blink});
  cm_calendar(ctx,D.cal[0],D.cal[1],o.cal==null?1:o.cal);
  ag_roomLight(ctx,1);
  if(o.agent!==0)cm_agent(ctx,ax,ay,ar,t,{a:o.agent==null?1:o.agent,think:o.think||0,core:o.core,label:"Lucía's agent",ph:1.3,floor:ay+150});}
// what her screen shows: quiet rows of a table, the top row blue
function cm_screenRows(c,x,y,w,h,a){c.fillStyle="#F4F5F3";c.fillRect(x,y,w,h);if(a<=0)return;c.save();c.globalAlpha*=a;c.fillStyle=rgba(AG.blue,0.16);c.fillRect(x,y,w,20);
  c.strokeStyle=rgba(AG.blue,0.22);c.lineWidth=1;for(let k=1;k<7;k++){c.beginPath();c.moveTo(x,y+20+k*18);c.lineTo(x+w,y+20+k*18);c.stroke();}
  for(const f of [0.36,0.66]){c.beginPath();c.moveTo(x+w*f,y);c.lineTo(x+w*f,y+h);c.stroke();}c.restore();}
// a small standing calendar on the desk, open at Monday: her first day
function cm_calendar(ctx,x,y,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const w=132,h=124;
  ag_floorShadow(ctx,x+AG.sdx,y+4,w*0.55,8,0.22);
  ctx.fillStyle="#3A3B40";ctx.beginPath();ctx.moveTo(x-w/2+8,y);ctx.lineTo(x-w/2+20,y-h);ctx.lineTo(x+w/2-20,y-h);ctx.lineTo(x+w/2-8,y);ctx.closePath();ctx.fill();
  ag_box(ctx,x-w/2+12,y-h+6,w-24,h-12,10,{});ctx.fillStyle=rgba(AG.mut,0.85);rr(ctx,x-w/2+12,y-h+6,w-24,30,10);ctx.fill();ctx.fillRect(x-w/2+12,y-h+26,w-24,10);
  ag_T(ctx,"MON",x,y-h+31,{w:700,size:22,ls:2,align:"center",col:[246,244,240],deco:1});
  ag_T(ctx,"2",x,y-30,{w:800,size:48,align:"center",col:AG.ink,deco:1});ctx.restore();}

/* ---------------------------------------------------------------- the students, as dots
   A grid of soft dots for the students on campus, and a scatter of 386 who study online, away from it (drawn as about one dot in
   ten, so the count is said by the label, not by counting). out 0..1: how far they're left out (grey, apart); in 0..1: they join. */
function cm_people(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const R=ag_rnd(41),join=o.join||0,out=o.out||0;ctx.save();ctx.globalAlpha*=a;
  // on campus: a block of dots, as a crowd seen from above
  for(let i=0;i<14;i++)for(let j=0;j<6;j++){const px=x+i*22+(j%2)*11,py=y+j*20;ctx.fillStyle=rgba(AG.ink,0.55);ctx.beginPath();ctx.arc(px,py,6.5,0,TAU);ctx.fill();}
  // online: forty dots spread out to the right, each at home; joining, they take the rows under the block
  for(let k=0;k<40;k++){const fx=x+400+R()*300,fy=y-20+R()*150,row=6+(k/14|0),tx=x+(k%14)*22+(row%2)*11,ty=y+row*20;
    const u=ag_sine(clamp(join*1.5-k*0.0125,0,1)),px=lerp(fx,tx,u),py=lerp(fy,ty,u),col=mix(AG.ink,[150,146,140],out*(1-u));
    ctx.fillStyle=rgba(col,0.55);ctx.beginPath();ctx.arc(px,py,6.5,0,TAU);ctx.fill();
    if(o.ring>0&&u<0.5){ctx.strokeStyle=rgba(AG.amber,0.6*o.ring*(1-2*u));ctx.lineWidth=2;ctx.beginPath();ctx.arc(px,py,11,0,TAU);ctx.stroke();}}
  ctx.restore();}

/* the library's card: a kicker, the title, and who the books are for; o.count (a number to show), o.col (its edge), o.note (a line
   under it, in the edge's colour) */
function cm_library(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const h=o.note?232:186;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,22,{edge:o.col||null,edgeA:0.8});cm_bookIcon(ctx,x+52,y+58,o.col?rgba(o.col,1):rgba(AG.mut,1));
  ag_T(ctx,"THE LIBRARY",x+96,y+68,{w:700,size:28,ls:4,col:AG.kick});
  ag_T(ctx,"Next year's e-books",x+28,y+122,{w:700,size:36});
  ag_T(ctx,o.count,x+28,y+164,{w:600,size:30,col:AG.mut});
  if(o.note)ag_T(ctx,o.note,x+28,y+208,{w:700,size:28,col:o.col||AG.amber});ctx.restore();}
function cm_bookIcon(ctx,x,y,col){ctx.save();ctx.strokeStyle=col;ctx.lineWidth=3;ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(x,y-14);ctx.quadraticCurveTo(x-12,y-20,x-24,y-16);ctx.lineTo(x-24,y+14);
  ctx.quadraticCurveTo(x-12,y+10,x,y+16);ctx.quadraticCurveTo(x+12,y+10,x+24,y+14);ctx.lineTo(x+24,y-16);ctx.quadraticCurveTo(x+12,y-20,x,y-14);ctx.lineTo(x,y+16);ctx.stroke();ctx.restore();}
