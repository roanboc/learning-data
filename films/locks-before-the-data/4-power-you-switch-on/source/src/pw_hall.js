/* ===== Power you switch on: the hall =====
   Two rooms of the module's hall, each painted once (dp_paintHall).
   The team's room (pwTeam): Sam and Jun at the left, large, looking at a board that reads left to right as a chain: each one's everyday
   account, then their admin account, then the shelf where the three tokens of great power sit (read the storage, the admin settings,
   restore a table), with a lock between each step on Jun's row. Jun's row is on top, Sam's under it. To switch power on, the room makes
   way (pw_adminXY, pw_shelfXY, v from 0 to 1): the everyday accounts leave, the admin accounts slide left along their rows, the shelf
   moves round under them, and the switch-on card, the platform team's pane and the record come in on the right.
   The platform's room (pwPlat): the catalog's lit ring with a table seen through it, the storage's long channel of files with its narrow
   back door, the admin settings and a table's history on the right, and people's badges on the left. Between the two rooms the film cuts.
   Colour means what it means in every film of the module: cyan an identity, green allowed, coral denied or closed, amber power
   switched on, violet hidden personal data, gold the passkey's chip. Every word is at least 28 px and stands out 4.5 to 1. */

AG_PLACES.pwTeam=c=>dp_paintHall(c,{seed:41,horizon:720,vx:760,lights:16,panes:8,pools:[[320,1010,560,0.14],[1250,760,760,0.07]]});
AG_PLACES.pwPlat=c=>dp_paintHall(c,{seed:17,horizon:690,vx:1020,lights:18,panes:9,pools:[[860,860,760,0.10],[1660,760,520,0.06]]});
DP_PEOPLE.push("sam","jun");

/* ---------------------------------------------------------------- where things are in each room (the 1920 x 1080 frame)
   The team's room. People: [x, y, s] (neck, size). Rows: each one's badges' top. E, A, S: the everyday column, the admin column, the
   shelf (the chain); A2 and shelfY2: the admin column and the shelf once the room has made way for switching on. lock1 sits between
   Jun's everyday and admin accounts, lock2 between his admin account and the power. card, team, rec: the switch-on view's right side. */
const PW_T={jun:[222,770,0.95],sam:[452,748,0.9],bw:400,bh:150,row:{jun:130,sam:420},
  E:640,A:1110,S:1580,sw:290,shelfY:[177,249,321],A2:640,shelfY2:[600,672,744],lock1:[1075,205],lock2:[1545,205],
  card:[1110,96,740],team:[1110,450,740,196],rec:[1110,670,740,206]};
// the platform's room
const PW_P={ring:[1080,214,270,56],table:[790,300,600],mei:[72,232],clara:[72,470],bw:400,store:[440,640,860,170],door:[1320,600,92,240],
  settings:[1450,96,430,262],history:[1450,444,430,196],office:[1450,96,430,250]};
const PW_POWERS=["Read the storage","Admin settings","Restore a table"];

/* ---------------------------------------------------------------- an account's badge
   pw_id(ctx, x, y, w, o): a badge of glass, 150 tall: its kind on a band of the identity's cyan ("EVERYDAY ACCOUNT", "ADMIN ACCOUNT",
   or o.kind), a person drawn in light, the name (o.name), and for an admin account a thin amber outline that brightens while its
   power is on (o.amber 0 to 1, o.on 0 to 1); o.coral a coral rim (taken, or kept out); o.glow a cyan glow (named, or chosen); o.k springs
   it in; o.icons draws the account's email and the web at its right end, one over the other (0 to 1), o.iconCross strikes them out */
function pw_id(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=150;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,clamp(o.k,0,1.15)));
  const on=clamp(o.on||0,0,1),am=clamp(o.amber||0,0,1);if(on>0)dp_halo(ctx,x+w/2,y+h/2,w*0.75,"amber",0.16*on);if(o.glow>0)dp_halo(ctx,x+w/2,y+h/2,w*0.7,"cyan",0.16*o.glow);
  dp_panel(ctx,x,y,w,h,{col:"cyan",r:20,glowA:0.8});dp_band(ctx,x,y,w,46,20,"cyan",o.kind||"EVERYDAY ACCOUNT");
  ctx.save();ctx.translate(x+62,y+104);ctx.scale(0.6,0.6);dp_personPic(ctx,0,4,"cyan");ctx.restore();
  if(o.name)dp_T(ctx,o.name,x+118,y+114,{w:700,size:34});
  if(o.icons>0)pw_mailWeb(ctx,x+w-48,y,o.icons,o.iconCross);
  if(am>0){ctx.save();ctx.globalAlpha*=am;ctx.shadowColor=rgba(DP.F.amber,0.5+0.5*on);ctx.shadowBlur=10+14*on;ctx.strokeStyle=rgba(mix(DP.F.amber,[255,255,255],0.2*on),1);ctx.lineWidth=3+2*on;rr(ctx,x-6,y-6,w+12,h+12,25);ctx.stroke();ctx.restore();}
  if(o.coral>0){ctx.save();ctx.globalAlpha*=clamp(o.coral,0,1);ctx.shadowColor=rgba(DP.F.coral,0.8);ctx.shadowBlur=14;ctx.strokeStyle=rgba(DP.F.coral,1);ctx.lineWidth=4;rr(ctx,x-12,y-12,w+24,h+24,30);ctx.stroke();ctx.restore();}
  ctx.restore();}
// an envelope over a link, drawn in light at a badge's right end: email and the web (x their middle, y the badge's top; a from 0 to 1;
// cross 0 to 1 strikes them both out in coral). One over the other, so the longest name still has room beside them
function pw_mailWeb(ctx,x,y,a,cross){if(!(a>0))return;ctx.save();ctx.globalAlpha*=a;const c=DP.T.mut;ctx.strokeStyle=rgba(c,1);ctx.lineWidth=2.6;ctx.lineJoin="round";ctx.lineCap="round";
  const ey=y+80;rr(ctx,x-20,ey-14,40,28,4);ctx.stroke();ctx.beginPath();ctx.moveTo(x-18,ey-12);ctx.lineTo(x,ey+2);ctx.lineTo(x+18,ey-12);ctx.stroke();
  ctx.save();ctx.translate(x,y+122);ctx.rotate(-0.7);rr(ctx,-21,-7,24,14,7);ctx.stroke();rr(ctx,-3,-7,24,14,7);ctx.stroke();ctx.restore();
  if(cross>0){ctx.globalAlpha*=clamp(cross,0,1);ctx.strokeStyle=rgba(DP.F.coral,1);ctx.shadowColor=rgba(DP.F.coral,0.8);ctx.shadowBlur=8;ctx.lineWidth=4;
    ctx.beginPath();ctx.moveTo(x-26,y+142);ctx.lineTo(x+26,y+58);ctx.stroke();}
  ctx.restore();}

/* ---------------------------------------------------------------- the tokens of great power
   pw_token(ctx, x, y, label, o): 290 x 56. Dark (switched off): frosted glass, the words quiet; lit (o.on, 0 to 1): solid amber, dark
   words, glowing; o.coral a coral rim */
function pw_token(ctx,x,y,label,o){o=o||{};const a=o.a==null?1:o.a,w=o.w||290,h=56,on=clamp(o.on||0,0,1);if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,clamp(o.k,0,1.15)));
  if(on<1){ctx.save();ctx.globalAlpha*=1-on;dp_panel(ctx,x,y,w,h,{col:"grey",r:28,glowA:0.3,glowR:20});dp_T(ctx,label,x+24,y+38,{w:700,size:28,col:"mut"});ctx.restore();}
  if(on>0){ctx.save();ctx.globalAlpha*=on;const c=DP.F.amber;ctx.save();ctx.shadowColor=rgba(c,0.75);ctx.shadowBlur=22;rr(ctx,x,y,w,h,28);const g=ctx.createLinearGradient(0,y,0,y+h);
    g.addColorStop(0,rgba(mix(c,[255,255,255],0.18),1));g.addColorStop(1,rgba(c,1));ctx.fillStyle=g;ctx.fill();ctx.restore();rr(ctx,x+0.6,y+0.6,w-1.2,h-1.2,27.4);ctx.strokeStyle=rgba(mix(c,[255,255,255],0.5),0.9);ctx.lineWidth=1.2;ctx.stroke();
    dp_T(ctx,label,x+24,y+38,{w:700,size:28,col:DP.on});ctx.restore();}
  if(o.coral>0){ctx.save();ctx.globalAlpha*=clamp(o.coral,0,1);ctx.strokeStyle=rgba(DP.F.coral,1);ctx.shadowColor=rgba(DP.F.coral,0.8);ctx.shadowBlur=12;ctx.lineWidth=4;rr(ctx,x-7,y-7,w+14,h+14,34);ctx.stroke();ctx.restore();}
  ctx.restore();}
/* where things are while the room makes way for switching on (v from 0, the chain, to 1): an admin badge slides left along its row;
   the shelf's tokens go down the right side and then left, under the admin badges, on a curve that keeps clear of everything */
const pw_adminXY=(who,v)=>[lerp(PW_T.A,PW_T.A2,ag_sine(clamp(v,0,1))),PW_T.row[who]];
function pw_shelfXY(i,v){const u=ag_sine(clamp(v,0,1)),a=[PW_T.S,PW_T.shelfY[i]],c=[PW_T.S,PW_T.shelfY2[i]+20],b=[PW_T.A2,PW_T.shelfY2[i]];
  return[(1-u)*(1-u)*a[0]+2*u*(1-u)*c[0]+u*u*b[0],(1-u)*(1-u)*a[1]+2*u*(1-u)*c[1]+u*u*b[1]];}
/* a day of 24 hours, as a strip of cells: lit (amber) from the first cell, n of them (fractions light a cell partly); o.label under it */
function pw_day(ctx,x,y,w,n,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const g=3,cw=(w-23*g)/24,h=o.h||26;
  for(let i=0;i<24;i++){const cx=x+i*(cw+g),lit=clamp(n-i,0,1);rr(ctx,cx,y,cw,h,3);ctx.fillStyle="rgba(60,84,90,0.75)";ctx.fill();
    if(lit>0){ctx.save();ctx.globalAlpha*=lit;ctx.shadowColor=rgba(DP.F.amber,0.7);ctx.shadowBlur=10;rr(ctx,cx,y,cw,h,3);ctx.fillStyle=rgba(DP.F.amber,1);ctx.fill();ctx.restore();}}
  if(o.label)dp_T(ctx,o.label,x+w/2,y+h+40,{w:700,size:28,align:"center",col:"amber",a:o.la==null?1:o.la});
  ctx.restore();}
// a line of light from a badge to a token: power hanging from an account (p draws it on)
function pw_hang(ctx,a,b,p,o){o=o||{};dp_link(ctx,a,b,o.col||"amber",p,{lw:2.4,alpha:o.alpha==null?0.85:o.alpha,dot:false,dash:o.dash});}
// a coral dotted line, from the dark to what someone has taken
function pw_reach(ctx,a,b,p,o){o=o||{};if(!(p>0))return;ctx.save();ctx.globalAlpha*=o.a==null?1:o.a;dp_link(ctx,a,b,"coral",p,{lw:3.4,dash:[10,12],dot:true});ctx.restore();}
// a small lock in a disc of glass: closed (coral)
function pw_lockMark(ctx,x,y,a,o){o=o||{};if(!(a>0))return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x,y,lerp(0.6,1,clamp(o.k,0,1.15)));
  ctx.fillStyle="rgba(6,20,26,0.9)";ctx.beginPath();ctx.arc(x,y,30,0,TAU);ctx.fill();ctx.strokeStyle=rgba(DP.F.coral,0.9);ctx.lineWidth=2.4;ctx.stroke();dp_lock(ctx,x,y+2,34,"coral",o.open||0);ctx.restore();}

/* ---------------------------------------------------------------- the switch-on card
   pw_card(ctx, x, y, w, o): a card of glass with an amber rim: "SWITCH ON" on its band, then rows 60 apart, each a label and a value
   (o.rows: [[label, value, {a, col, tick, cross, glow, glowCol, day}], ...]; a value may be a function (ctx, x, baseline) that draws it;
   day: hours lit on a strip at the row's right); o.left the time left, drawn as an amber line round the card that empties (0 to 1, or
   null for none); o.on its glow. Returns its box. */
function pw_card(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,rows=o.rows||[],h=74+rows.length*60+16;if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,clamp(o.k,0,1.15)));const on=clamp(o.on||0,0,1);if(on>0)dp_halo(ctx,x+w/2,y+h/2,w*0.8,"amber",0.12*on);
  dp_panel(ctx,x,y,w,h,{col:"amber",r:22,glowA:0.6+0.6*on});dp_band(ctx,x,y,w,50,22,"amber",o.title||"SWITCH ON");
  rows.forEach((r,i)=>{const q=r[2]||{},ra=q.a==null?1:q.a;if(ra<=0)return;const by=y+106+i*60;ctx.save();ctx.globalAlpha*=ra;
    if(q.glow>0)dp_halo(ctx,x+w/2,by-10,w*0.45,q.glowCol||"amber",0.16*q.glow);
    dp_T(ctx,r[0],x+28,by,{w:600,size:28,col:"mut"});if(typeof r[1]==="function")r[1](ctx,x+214,by);else if(r[1])dp_T(ctx,r[1],x+214,by,{w:700,size:28,col:q.col||"ink"});
    if(q.day!=null)pw_day(ctx,x+w-280,by-24,240,q.day,{h:24});
    if(q.tick!=null)dp_tick(ctx,x+w-46,by-10,"green",q.tick);if(q.cross!=null)dp_cross(ctx,x+w-46,by-10,"coral",q.cross);ctx.restore();});
  // the time left: an amber line round the card, from its top middle, emptying clockwise
  if(o.left!=null&&o.left>0){const L=clamp(o.left,0,1),pad=10,X=x-pad,Y=y-pad,Wd=w+2*pad,Hd=h+2*pad,per=2*(Wd+Hd),run=per*L;ctx.save();ctx.strokeStyle=rgba(DP.F.amber,1);
    ctx.shadowColor=rgba(DP.F.amber,0.8);ctx.shadowBlur=10;ctx.lineWidth=3.4;ctx.lineCap="round";ctx.setLineDash([run,per]);ctx.lineDashOffset=0;
    ctx.beginPath();ctx.moveTo(X+Wd/2,Y);ctx.lineTo(X+Wd,Y);ctx.lineTo(X+Wd,Y+Hd);ctx.lineTo(X,Y+Hd);ctx.lineTo(X,Y);ctx.lineTo(X+Wd/2,Y);ctx.stroke();ctx.restore();}
  ctx.restore();return{x,y,w,h};}
// the card's rows' baselines, and where the token sits in its Power row (its top left)
const pw_cardRow=i=>PW_T.card[1]+106+i*60;
const pw_cardTok=()=>[PW_T.card[0]+214,PW_T.card[1]+68];

/* ---------------------------------------------------------------- the platform team's pane, its bell, and the record */
function pw_bell(ctx,x,y,s,a,ring){if(!(a>0))return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(Math.sin((ring||0)*TAU*2.2)*0.18*Math.max(0,1-(ring||0)));ctx.scale(s,s);
  const c=DP.F.amber;ctx.shadowColor=rgba(c,0.8);ctx.shadowBlur=14;ctx.fillStyle=rgba(c,1);ctx.beginPath();ctx.moveTo(-20,10);ctx.bezierCurveTo(-20,-6,-16,-22,0,-24);ctx.bezierCurveTo(16,-22,20,-6,20,10);ctx.lineTo(26,18);ctx.lineTo(-26,18);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.arc(0,24,6,0,TAU);ctx.fill();ctx.fillRect(-3,-30,6,8);ctx.restore();}
/* the platform team's pane: its name, its bell, and the alert (o.alert: [line, line] and its opacity o.al; o.ring the bell's swing;
   o.match, 0 to 1: a tick and "Matches today's task") */
function pw_team(ctx,o){o=o||{};const [x,y,w,h]=PW_T.team,a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  dp_panel(ctx,x,y,w,h,{col:"cyan",r:20});dp_T(ctx,"PLATFORM TEAM",x+28,y+48,{w:800,size:28,ls:4,col:"cyan"});pw_bell(ctx,x+w-50,y+42,0.9,1,o.ring);
  const al=o.al||0;if(al>0&&o.alert){ctx.save();ctx.globalAlpha*=al;dp_T(ctx,o.alert[0],x+28,y+100,{w:700,size:30,col:"amber"});if(o.alert[1])dp_T(ctx,o.alert[1],x+28,y+140,{w:600,size:28});ctx.restore();}
  if(o.match>0){dp_tick(ctx,x+46,y+170,"green",o.match);dp_T(ctx,"Matches today's task",x+80,y+180,{w:700,size:28,col:"green",a:clamp(o.match*1.5,0,1)});}
  ctx.restore();}
// the record: rows rising into a frosted pane, under the account that did each thing (rows: [[text, opacity], ...])
function pw_record(ctx,rows,o){o=o||{};const [x,y,w,h]=PW_T.rec,a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  dp_panel(ctx,x,y,w,h,{col:"cyan",r:20});dp_T(ctx,"THE RECORD",x+28,y+48,{w:800,size:28,ls:4,col:"cyan"});
  ctx.save();rr(ctx,x,y+60,w,h-60,0);ctx.clip();rows.forEach((r,i)=>{const u=clamp(r[1],0,1);if(u<=0)return;ctx.save();ctx.globalAlpha*=u;dp_T(ctx,r[0],x+28,y+96+i*40+(1-ag_eo(u))*22,{w:600,size:28});ctx.restore();});ctx.restore();
  ctx.restore();}

/* ---------------------------------------------------------------- the platform's room
   the catalog: a ring of light, the front door that checks every request (a its opacity, glow 0 to 1 a request passing) */
function pw_catalog(ctx,a,o){o=o||{};if(!(a>0))return;const [cx,cy,rx,ry]=PW_P.ring;ctx.save();ctx.globalAlpha*=a;const c=DP.F.cyan;
  dp_halo(ctx,cx,cy,rx*1.1,"cyan",0.10+0.12*(o.glow||0));ctx.shadowColor=rgba(c,0.9);ctx.shadowBlur=16;ctx.strokeStyle=rgba(mix(c,[255,255,255],0.3),1);ctx.lineWidth=5;
  ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,0,TAU);ctx.stroke();ctx.shadowBlur=0;ctx.strokeStyle=rgba(c,0.45);ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(cx,cy,rx-16,ry-7,0,0,TAU);ctx.stroke();
  dp_T(ctx,"The catalog",cx,cy-ry-26,{w:700,size:32,align:"center",col:"cyan"});ctx.restore();}
// a table seen through the catalog: its name, its columns, and a row, the personal columns under violet frost unless o.clear
function pw_table(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,rows=o.rows||[["S-20412","Samuel Osei","14 May 1987"]],h=118+rows.length*60;if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,clamp(o.k,0,1.15)));dp_panel(ctx,x,y,w,h,{col:o.col||"cyan",r:20});dp_T(ctx,o.title||"Learners",x+28,y+48,{w:700,size:32});
  const cols=[x+28,x+182,x+390];["Student","Name","Date of birth"].forEach((s,i)=>dp_T(ctx,s,cols[i],y+96,{w:600,size:28,col:"mut"}));
  rows.forEach((r,j)=>{const by=y+150+j*60;dp_T(ctx,r[0],cols[0],by,{w:700,size:28});for(let i=1;i<3;i++){if(o.clear)dp_T(ctx,r[i],cols[i],by,{w:700,size:28,col:o.hot===i?"coral":"ink"});
    else dp_frost(ctx,cols[i]-6,by-32,i===1?172:178,42,c=>dp_T(c,r[i],cols[i],by,{w:700,size:28}),{r:10});}});
  ctx.restore();return{x,y,w,h};}
// the storage: a long channel of frosted glass, its files in a row (o.file lights one: last night's file, the tenth)
const PW_FILE=[PW_P.store[0]+40+9*66+22,PW_P.store[1]+72+33];
function pw_store(ctx,a,o){o=o||{};if(!(a>0))return;const [x,y,w,h]=PW_P.store;ctx.save();ctx.globalAlpha*=a;dp_panel(ctx,x,y,w,h,{col:"grey",r:18,glowA:0.4});
  dp_T(ctx,"The storage",x+28,y+48,{w:700,size:30,col:"ink"});
  for(let i=0;i<12;i++){const fx=x+40+i*66,fy=y+72;const hot=o.file>0&&i===9;ctx.save();ctx.strokeStyle=hot?rgba(mix(DP.F.cyan,[255,255,255],0.3),1):"rgba(190,230,232,0.55)";ctx.lineWidth=2.2;
    ctx.beginPath();ctx.moveTo(fx,fy);ctx.lineTo(fx+30,fy);ctx.lineTo(fx+44,fy+14);ctx.lineTo(fx+44,fy+66);ctx.lineTo(fx,fy+66);ctx.closePath();ctx.stroke();
    if(hot){ctx.shadowColor=rgba(DP.F.cyan,0.9);ctx.shadowBlur=14*o.file;ctx.stroke();}ctx.beginPath();ctx.moveTo(fx+8,fy+30);ctx.lineTo(fx+34,fy+30);ctx.moveTo(fx+8,fy+44);ctx.lineTo(fx+34,fy+44);ctx.stroke();ctx.restore();}
  ctx.restore();}
// the storage's back door: a narrow pane with an amber edge; open from 0 (shut) to 1 (slid up)
function pw_door2(ctx,a,open,o){o=o||{};if(!(a>0))return;const [x,y,w,h]=PW_P.door,u=ag_sine(clamp(open||0,0,1));ctx.save();ctx.globalAlpha*=a;
  ctx.fillStyle="rgba(4,10,12,0.85)";rr(ctx,x,y,w,h,10);ctx.fill();ctx.save();rr(ctx,x,y,w,h,10);ctx.clip();const dy=-u*(h-24);
  dp_wall(ctx,x,y+dy,w,h,{frosted:true,col:"amber"});ctx.restore();
  ctx.save();ctx.strokeStyle=rgba(DP.F.amber,0.9+0.1*(o.glow||0));ctx.shadowColor=rgba(DP.F.amber,0.6+0.4*(o.glow||0));ctx.shadowBlur=10+16*(o.glow||0);ctx.lineWidth=3;rr(ctx,x,y,w,h,10);ctx.stroke();ctx.restore();
  dp_lock(ctx,x+w/2,y+h/2+dy*0.3,40,u>0.5?"amber":"coral",u);ctx.restore();}
// the admin settings: three switches (o.flip lights the third, a setting changed)
function pw_settings(ctx,a,o){o=o||{};if(!(a>0))return;const [x,y,w,h]=PW_P.settings;ctx.save();ctx.globalAlpha*=a;dp_panel(ctx,x,y,w,h,{col:"cyan",r:20});
  dp_T(ctx,"Admin settings",x+28,y+50,{w:700,size:32});["Who may sign in","How they sign in","Personal tokens"].forEach((s,i)=>dp_switch(ctx,x+28,y+84+i*58,i===2?1-(o.flip||0):1,{col:"green",label:s}));ctx.restore();}
// a table's history: its versions in a row, and where it is now (o.back slides it back two versions, 0 to 1)
function pw_history(ctx,a,o){o=o||{};if(!(a>0))return;const [x,y,w,h]=PW_P.history;ctx.save();ctx.globalAlpha*=a;dp_panel(ctx,x,y,w,h,{col:"cyan",r:20});
  dp_T(ctx,"Learners · history",x+28,y+50,{w:700,size:30});const b=ag_sine(clamp(o.back||0,0,1)),cur=5-2*b;
  for(let i=0;i<6;i++){const tx=x+36+i*62,ty=y+80,gone=i>cur+0.5;ctx.save();ctx.globalAlpha*=gone?0.35:1;rr(ctx,tx,ty,44,44,8);ctx.fillStyle=i<=cur+0.01?"rgba(70,140,150,0.55)":"rgba(40,70,76,0.5)";ctx.fill();
    ctx.strokeStyle="rgba(190,235,238,0.7)";ctx.lineWidth=2;ctx.stroke();ctx.restore();if(i<5){ctx.strokeStyle="rgba(190,235,238,0.4)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(tx+44,ty+22);ctx.lineTo(tx+62,ty+22);ctx.stroke();}}
  const mx=x+36+cur*62+22;ctx.fillStyle=rgba(DP.F.cyan,1);ctx.beginPath();ctx.moveTo(mx,y+132);ctx.lineTo(mx-9,y+144);ctx.lineTo(mx+9,y+144);ctx.closePath();ctx.fill();
  dp_pill(ctx,clamp(mx,x+70,x+w-70),y+182,"Now","cyan",{align:"center"});ctx.restore();}

/* ---------------------------------------------------------------- the emergency accounts' case, far off: two cards behind glass */
function pw_breakGlass(ctx,x,y,w,a){if(!(a>0))return;ctx.save();ctx.globalAlpha*=a;dp_panel(ctx,x,y,w,300,{col:"grey",r:20});dp_T(ctx,"Break glass",x+28,y+52,{w:700,size:32});
  for(let i=0;i<2;i++)pw_token(ctx,x+28,y+90+i*82,"Emergency account",{w:w-56,on:1});
  dp_wall(ctx,x+12,y+70,w-24,216,{frosted:false,col:"grey",a:0.9});ctx.restore();}
