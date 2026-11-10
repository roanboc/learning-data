/* ===== An agreement first: the university =====
   The university's places, in the module's hall (films/locks-before-the-data/shared/src/hall.js): the hall with the platform, a tall
   block of clear glass (afHall); and three rooms of the same glass, each with a glass desk: Anil's in the Faculty of Health (afAnil),
   the registrar's office with Mei's long table (afMei), Sam's on the platform team (afSam) and Yusuf's in data governance (afYusuf). People stand behind a desk, cut at
   its back edge, arms down; their cards are on the other side of the frame, never over them. And the pieces the university's scenes
   share: a person's name card, the request, the two papers side by side, the door to the data, the study's own space, a year's ring,
   the chart on Anil's screen, what could happen with nothing written, the agent's card. Prefixed af_. */

/* ---------------------------------------------------------------- a glass desk, painted into a place
   A slab seen from a little above: its back edge at back, its front edge AF_SLAB lower and lit along its length, its front frosted
   down to the frame's foot. A person behind it is drawn with cut: back. */
const AF_SLAB=26;
function af_deskPaint(c,x0,x1,back){const y=back+AF_SLAB,h=H-y,ice=DP.ice;
  c.save();c.beginPath();c.rect(x0,y,x1-x0,h);c.clip();dp_blurDraw(c,c.canvas,x0-20,y-20,x1-x0+40,h+40,x0-20,y-20,x1-x0+40,h+40,14);
  const g=c.createLinearGradient(0,y,0,H);g.addColorStop(0,"rgba(150,220,225,0.10)");g.addColorStop(1,"rgba(150,220,225,0.02)");c.fillStyle=g;c.fillRect(x0,y,x1-x0,h);c.fillStyle="rgba(4,14,18,0.35)";c.fillRect(x0,y,x1-x0,h);c.restore();
  c.save();c.beginPath();c.moveTo(x0+22,back);c.lineTo(x1-22,back);c.lineTo(x1,y);c.lineTo(x0,y);c.closePath();c.fillStyle="rgba(170,235,240,0.12)";c.fill();c.restore();
  c.fillStyle=rgba(ice,0.35);c.fillRect(x0+22,back,x1-x0-44,1.4);
  c.save();c.shadowColor=rgba(DP.F.cyan,0.8);c.shadowBlur=10;c.fillStyle=rgba(mix(ice,[255,255,255],0.3),0.9);c.fillRect(x0,y,x1-x0,2.2);c.restore();
  c.fillStyle=rgba(ice,0.22);c.fillRect(x0,y,1.6,h);c.fillRect(x1-1.6,y,1.6,h);}
const AF_BACK=774;     // every desk's back edge: people behind a desk are cut here

/* ---------------------------------------------------------------- the places: the hall with the platform, and three rooms
   Each a hall of its own (its lights and panes fall where its seed puts them, its floor's lines meet at vx), with pools of light where
   its people stand and its desk */
AG_PLACES.afHall=c=>dp_paintHall(c,{seed:26,horizon:700,vx:820,pools:[[420,900,460,0.10],[1400,880,560,0.08]],after:af_platformPaint});
AG_PLACES.afAnil=c=>dp_paintHall(c,{seed:41,horizon:690,vx:1260,panes:7,pools:[[400,900,420,0.13]],after:c=>af_deskPaint(c,-20,1940,AF_BACK)});
AG_PLACES.afMei=c=>dp_paintHall(c,{seed:52,horizon:700,vx:760,panes:8,pools:[[1480,900,420,0.13],[480,900,420,0.10]],after:c=>af_deskPaint(c,150,1860,AF_BACK)});
AG_PLACES.afSam=c=>dp_paintHall(c,{seed:74,horizon:700,vx:1500,panes:8,pools:[[420,900,420,0.13]],after:c=>af_deskPaint(c,-20,980,AF_BACK)});
AG_PLACES.afYusuf=c=>dp_paintHall(c,{seed:63,horizon:690,vx:1400,panes:7,pools:[[420,900,420,0.13]],after:c=>af_deskPaint(c,-20,1080,AF_BACK)});

/* ---------------------------------------------------------------- the platform, and the study's own space in it
   The platform: a tall block of clear glass in the hall, painted into afHall (its name, "The platform", is drawn live, af_platform).
   The study's own space: a small room of clear glass inside it, named, holding only the four columns it may have (cols(i) 0 to 1 each;
   frost 0 to 1 frosts them over and takes them away, as the study's copy is deleted) */
const AF_PLAT={x:1060,y:150,w:700,h:690,room:[1160,420,500,330]};
function af_platformPaint(c){const P=AF_PLAT;dp_wall(c,P.x,P.y,P.w,P.h,{col:"cyan"});
  c.save();c.strokeStyle="rgba(190,245,245,0.28)";c.lineWidth=1.6;c.beginPath();c.moveTo(P.x+40,P.y-30);c.lineTo(P.x+P.w+40,P.y-30);c.lineTo(P.x+P.w+40,P.y+P.h-40);c.stroke();
  c.beginPath();c.moveTo(P.x,P.y);c.lineTo(P.x+40,P.y-30);c.moveTo(P.x+P.w,P.y);c.lineTo(P.x+P.w+40,P.y-30);c.moveTo(P.x+P.w,P.y+P.h);c.lineTo(P.x+P.w+40,P.y+P.h-40);c.stroke();c.restore();}
function af_platform(ctx,o){o=o||{};const P=AF_PLAT;dp_T(ctx,"The platform",P.x+30,P.y+62,{w:700,size:30,col:"cyan",a:o.a==null?1:o.a});}
const AF_COLS=["course","results","year of birth","learner code"];
function af_room(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(!(a>0.003))return;const [x,y,w,h]=AF_PLAT.room,col=o.col||"cyan";ctx.save();ctx.globalAlpha*=a;
  dp_wall(ctx,x,y,w,h,{col,a:o.wallA==null?1:o.wallA});
  dp_T(ctx,"Health progress study",x+24,y+52,{w:700,size:30,col});dp_T(ctx,"its own space",x+24,y+92,{w:600,size:28,col:"mut"});
  const cols=o.cols||(()=>1),fr=clamp(o.frost||0,0,1);
  AF_COLS.forEach((c,i)=>{const ca=cols(i)*(1-ag_in(fr,0.55,0.45));if(!(ca>0.003))return;const cw=(w-60)/2,cx=x+24+(i%2)*(cw+12),cy=y+132+Math.floor(i/2)*84;ctx.save();ctx.globalAlpha*=ca;
    dp_panel(ctx,cx,cy,cw,64,{col:"cyan",r:12,glowR:18,behind:o.behind||"afHall"});dp_T(ctx,c,cx+18,cy+42,{w:600,size:28});
    if(fr>0)dp_frost(ctx,cx,cy,cw,64,null,{a:ag_in(fr,0,0.5),col:"grey",behind:o.behind||"afHall"});
    ctx.restore();});
  ctx.restore();}
// where a line from outside reaches the room: its left wall, at its middle
const AF_ROOMIN=[AF_PLAT.room[0],AF_PLAT.room[1]+AF_PLAT.room[3]*0.5];

/* ---------------------------------------------------------------- the door to the data
   A pane of frosted glass in a frame, a pill on it, "Access", a lock on it; open (0 to 1) slides the pane aside, the lock opening, and
   the platform's cyan light shows behind it. Closed, it says access comes last. In afHall it stands in the platform's face. */
const AF_DOOR=[1290,480,240,360];
function af_door(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(!(a>0.003))return;const [x,y,w,h]=o.rect||AF_DOOR,u=ag_sine(clamp(o.open||0,0,1)),bh=o.behind||"afHall";ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.fillStyle="rgba(4,14,18,0.82)";ctx.fillRect(x,y,w,h);
  if(u>0){const g=ctx.createLinearGradient(x,0,x+w,0);g.addColorStop(0,rgba(DP.F.cyan,0.5*u));g.addColorStop(1,rgba(DP.F.cyan,0.18*u));ctx.fillStyle=g;ctx.fillRect(x,y,w,h);}
  dp_wall(ctx,x+u*w*0.46,y,w,h,{frosted:true,col:"cyan",behind:bh});dp_lock(ctx,x+u*w*0.46+w-Math.min(46,w*0.22),y+h*0.52,Math.min(46,w*0.24),u>0.5?"green":"cyan",u);ctx.restore();
  ctx.save();ctx.strokeStyle=rgba(DP.ice,0.75);ctx.lineWidth=2.2;ctx.shadowColor=rgba(DP.F.cyan,0.7);ctx.shadowBlur=10;ctx.strokeRect(x-5,y-5,w+10,h+5);ctx.restore();
  dp_pill(ctx,x+w/2,y-28,"Access","cyan",{align:"center",a:o.pillA==null?1:o.pillA});
  ctx.restore();}

/* ---------------------------------------------------------------- people's name cards, the request, the two papers
   af_name: a person's card, their role over their name. af_request: Anil's request (full: who it's from and what for).
   af_twoPapers: the two papers side by side, each coming in by its own k (0 to 1): each person's confidentiality agreement (a person's
   outline) and the data sharing agreement for a use (a folded corner) */
function af_name(ctx,x,y,w,kick,title,o){o=o||{};return dp_card(ctx,x,y,w,{kick,title},{col:o.col||"cyan",a:o.a,k:o.k,behind:o.behind,measure:o.measure});}
function af_request(ctx,x,y,w,o){o=o||{};const col=o.col||AF_ICE;
  return dp_card(ctx,x,y,w,{kick:"Request",title:"Records of the faculty's learners · 2,614",sub:o.full?"From: Anil Kurian · For: a study of how learners progress":null},
    {col,a:o.a,k:o.k,behind:o.behind,measure:o.measure});}
const AF_TWO={w:420,h:212,gap:36};
function af_twoPapers(ctx,x,y,o){o=o||{};const {w,h,gap}=AF_TWO,xb=x+w+gap,a=o.a==null?1:o.a;if(!(a>0.003))return;ctx.save();ctx.globalAlpha*=a;
  const one=(k,x0,draw)=>{if(!(k>0.003))return;ctx.save();ctx.globalAlpha*=ag_in(k,0,0.45);ag_about(ctx,x0+w/2,y+h/2,lerp(0.7,1,Math.min(1,ag_spr(k,0,0.9))));draw(x0);ctx.restore();};
  one(o.ka==null?1:o.ka,x,x0=>{dp_panel(ctx,x0,y,w,h,{col:AF_ICE,r:18,behind:o.behind});ctx.save();ctx.translate(x0+70,y+h/2+4);ctx.scale(0.72,0.72);dp_personPic(ctx,0,0,"cyan");ctx.restore();
    dp_T(ctx,"Confidentiality",x0+128,y+h/2-8,{w:800,size:34});dp_T(ctx,"agreement",x0+128,y+h/2+38,{w:800,size:34});});
  one(o.kb==null?1:o.kb,xb,x0=>{af_panelFold(ctx,x0,y,w,h,{behind:o.behind});dp_T(ctx,"Data sharing",x0+40,y+h/2-8,{w:800,size:34});dp_T(ctx,"agreement",x0+40,y+h/2+38,{w:800,size:34});});
  ctx.restore();return{a:[x,y,w,h],b:[xb,y,w,h]};}

/* ---------------------------------------------------------------- a year going round
   A ring of twelve marks, a light running once round it (u 0 to 1), its words beside it */
function af_year(ctx,x,y,r,u,text,o){o=o||{};const a=o.a==null?1:o.a;if(!(a>0.003))return;ctx.save();ctx.globalAlpha*=a;const c=DP.F.cyan;
  for(let i=0;i<12;i++){const an=-Math.PI/2+i*TAU/12,lit=u*12>i;ctx.fillStyle=lit?rgba(mix(c,[255,255,255],0.3),1):"rgba(190,245,245,0.3)";ctx.beginPath();ctx.arc(x+Math.cos(an)*r,y+Math.sin(an)*r,lit?6:4,0,TAU);ctx.fill();}
  if(u>0){ctx.save();ctx.strokeStyle=rgba(c,1);ctx.lineWidth=3;ctx.lineCap="round";ctx.shadowColor=rgba(c,0.8);ctx.shadowBlur=10;ctx.beginPath();ctx.arc(x,y,r,-Math.PI/2,-Math.PI/2+TAU*clamp(u,0,1));ctx.stroke();ctx.restore();}
  if(text)dp_T(ctx,text,x+r+26,y+10,{w:700,size:30,col:"cyan"});ctx.restore();}

/* ---------------------------------------------------------------- Anil's screen
   A pane of clear glass standing on his desk, and on it a chart with no labels: bars rising, one missing, a question mark in its
   place. u (0 to 1) brings the bars up one by one */
const AF_SCREEN=[1070,320,600,400];
function af_screen(ctx,u,o){o=o||{};const a=o.a==null?1:o.a;if(!(a>0.003))return;const [x,y,w,h]=AF_SCREEN;ctx.save();ctx.globalAlpha*=a;
  ctx.fillStyle="rgba(190,245,245,0.35)";ctx.fillRect(x+w/2-4,y+h,8,AF_BACK-y-h);ctx.fillRect(x+w/2-70,AF_BACK-6,140,6);
  dp_panel(ctx,x,y,w,h,{col:AF_ICE,r:16,behind:o.behind||"afAnil"});
  ctx.fillStyle="rgba(190,245,245,0.35)";ctx.fillRect(x+60,y+h-60,w-120,2);
  const H0=[0.34,0.42,0.5,null,0.68,0.78],bw=56;H0.forEach((v,i)=>{const bx=x+84+i*80,k=clamp(u*7-i,0,1);if(!(k>0))return;
    if(v==null){dp_T(ctx,"?",bx+bw/2,y+h-90,{w:800,size:64,align:"center",col:"ink",a:ag_in(k,0,0.6)});return;}
    const bh=(h-140)*v*ag_eo(k);ctx.fillStyle=rgba(DP.ice,0.75);rr(ctx,bx,y+h-62-bh,bw,bh,6);ctx.fill();});
  ctx.restore();}

/* ---------------------------------------------------------------- what could happen with nothing written
   A table where names sit beside results, and then who gets extra time: the names and the support hidden under violet frost (personal
   data; no word of it can be read), the results plain. cols (0 to 1) brings in the third column; copies (0 to 1) sends small copies of it
   to a laptop and a shared folder, at the frame's edges */
function af_harm(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(!(a>0.003))return;const w=760,rh=62,c3=o.third==null?1:o.third,bh=o.behind;ctx.save();ctx.globalAlpha*=a;
  dp_panel(ctx,x,y,w,74+rh*3+16,{col:AF_ICE,r:18,behind:bh});
  const cx=[x+30,x+290,x+520];dp_T(ctx,"Name",cx[0],y+50,{w:700,size:28});dp_T(ctx,"Results",cx[1],y+50,{w:700,size:28,col:"mut"});
  if(c3>0.003)dp_T(ctx,"Exam support",cx[2],y+50,{w:700,size:28,a:ag_in(c3,0,0.5)});
  const names=["Samira Haddad","Tom Ellery","Priya Nair"],sup=["extra time","none","extra time"],res=["90 of 120","75 of 120","105 of 120"];
  for(let i=0;i<3;i++){const ry=y+74+i*rh;
    dp_frost(ctx,cx[0]-10,ry+8,230,rh-16,c=>ag_T(c,names[i],cx[0],ry+rh/2+10,{w:600,size:28,col:[240,240,250],deco:1}),{behind:bh});
    dp_T(ctx,res[i],cx[1],ry+rh/2+10,{w:600,size:28});
    if(c3>0.003){ctx.save();ctx.globalAlpha*=ag_in(c3,0.2,0.6);dp_frost(ctx,cx[2]-10,ry+8,200,rh-16,c=>ag_T(c,sup[i],cx[2],ry+rh/2+10,{w:600,size:28,col:[240,240,250],deco:1}),{behind:bh});ctx.restore();}}
  ctx.restore();}
// a small copy of the table on its way somewhere (u 0 to 1 along from a to b), and where copies end up: a laptop, a shared folder
function af_copy(ctx,a,b,u,al){if(!(al>0.003)||u<=0)return;const e=ag_sine(clamp(u,0,1)),x=lerp(a[0],b[0],e),y=lerp(a[1],b[1],e)-Math.sin(e*Math.PI)*60,w=120,h=76;
  ctx.save();ctx.globalAlpha*=al;ctx.translate(x,y);ctx.rotate((1-e)*-0.1+e*0.06);rr(ctx,-w/2,-h/2,w,h,8);ctx.fillStyle="rgba(10,30,36,0.9)";ctx.fill();ctx.strokeStyle=rgba(DP.ice,0.7);ctx.lineWidth=1.6;ctx.stroke();
  for(let i=0;i<3;i++){ctx.fillStyle=rgba(DP.F.violet,0.85);rr(ctx,-w/2+12,-h/2+14+i*20,34,9,4);ctx.fill();ctx.fillStyle=rgba(DP.ice,0.6);rr(ctx,-w/2+56,-h/2+14+i*20,24,9,4);ctx.fill();
    ctx.fillStyle=rgba(DP.F.violet,0.85);rr(ctx,-w/2+88,-h/2+14+i*20,20,9,4);ctx.fill();}
  ctx.restore();}
function af_laptop(ctx,x,y,a){if(!(a>0.003))return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(DP.ice,0.85);ctx.lineWidth=2.4;ctx.lineJoin="round";ctx.shadowColor=rgba(DP.ice,0.5);ctx.shadowBlur=8;
  rr(ctx,x-90,y-110,180,116,10);ctx.stroke();ctx.beginPath();ctx.moveTo(x-112,y+6);ctx.lineTo(x+112,y+6);ctx.lineTo(x+128,y+26);ctx.lineTo(x-128,y+26);ctx.closePath();ctx.stroke();ctx.restore();
  dp_T(ctx,"Laptop",x,y+72,{w:700,size:28,align:"center",col:"mut",a});}
function af_folder(ctx,x,y,a){if(!(a>0.003))return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(DP.ice,0.85);ctx.lineWidth=2.4;ctx.lineJoin="round";ctx.shadowColor=rgba(DP.ice,0.5);ctx.shadowBlur=8;
  ctx.beginPath();ctx.moveTo(x-110,y+26);ctx.lineTo(x-110,y-96);ctx.lineTo(x-40,y-96);ctx.lineTo(x-24,y-78);ctx.lineTo(x+110,y-78);ctx.lineTo(x+110,y+26);ctx.closePath();ctx.stroke();ctx.restore();
  dp_T(ctx,"Shared folder",x,y+72,{w:700,size:28,align:"center",col:"mut",a});}

/* ---------------------------------------------------------------- the agent's card
   An agent signs nothing: its card shows its owner's signature, and says so */
function af_agentCard(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(!(a>0.003))return;const h=218;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  dp_panel(ctx,x,y,w,h,{col:"cyan",r:20,behind:o.behind});dp_T(ctx,"AGENT",x+30,y+54,{w:800,size:28,ls:4,col:"cyan"});
  af_signature(ctx,x+30,y+120,w-60,o.sign==null?1:o.sign,3.4);dp_T(ctx,"Signed for by its owner",x+30,y+178,{w:600,size:28,col:"mut"});ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- a small label, right-aligned to x, its middle at y
   The Five Safes beside the agreement's lines: ice words on a small pane of frost, a short line of light to the line it names */
function af_label(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a;if(!(a>0.003))return;const w=dp_tw(ctx,text,{w:700,size:28})+36,h=48;ctx.save();ctx.globalAlpha*=a;
  if(o.to)dp_link(ctx,[x,y],o.to,AF_ICE,1,{lw:1.6,dot:false,alpha:0.7});
  dp_panel(ctx,x-w,y-h/2,w,h,{col:AF_ICE,r:12,glowR:20,behind:o.behind});dp_T(ctx,text,x-w+18,y+10,{w:700,size:28});ctx.restore();}
