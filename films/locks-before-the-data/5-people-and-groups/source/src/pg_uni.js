/* ===== People and groups: the university =====
   The university's places, in the module's hall: the hall where the data platform stands, a tall block of clear glass with one lit
   door (pgHall), the data team's room, a glass desk on its left (pgTeam), and the registrar's office, a desk and its shelves on the
   right, under a warmer lamp (pgOffice). And what is drawn in them, live: the directory, Microsoft Entra ID's page of groups, each a
   row that people's cards go into and out of; the platform's door, which a person's badge passes; and the line of light between them. */

/* ---------------------------------------------------------------- the hall, and the platform in it */
const PG_PLAT={x:1236,y:176,w:380,h:596,door:[1386,640,82,132]};   // the platform's block of glass, and its one door (x, y, w, h)
AG_PLACES.pgHall=c=>dp_paintHall(c,{seed:23,horizon:700,vx:1040,lights:16,panes:7,pools:[[420,930,560,0.10],[1430,800,520,0.10]],after:c2=>{const P=PG_PLAT,[dx,dy,dw,dh]=P.door;
  // the block: clear glass, its edges catching the light, its floors faint lines, and the hall's lights through it
  c2.save();c2.beginPath();c2.rect(P.x,P.y,P.w,P.h);c2.clip();dp_blurDraw(c2,c2.canvas,P.x-20,P.y-20,P.w+40,P.h+40,P.x-20,P.y-20,P.w+40,P.h+40,2.5);
  let g=c2.createLinearGradient(P.x,P.y,P.x+P.w,P.y+P.h);g.addColorStop(0,"rgba(190,240,245,0.10)");g.addColorStop(0.4,"rgba(190,240,245,0.03)");g.addColorStop(0.55,"rgba(190,240,245,0.09)");g.addColorStop(1,"rgba(190,240,245,0.02)");
  c2.fillStyle=g;c2.fillRect(P.x,P.y,P.w,P.h);c2.fillStyle="rgba(170,230,235,0.07)";for(let y=P.y+74;y<P.y+P.h-20;y+=74)c2.fillRect(P.x,y,P.w,1.5);c2.restore();
  c2.save();c2.shadowColor="rgba(120,220,232,0.9)";c2.shadowBlur=14;c2.fillStyle="rgba(214,250,252,0.9)";c2.fillRect(P.x,P.y,P.w,2.4);c2.fillRect(P.x,P.y,2.4,P.h);c2.fillRect(P.x+P.w-2.4,P.y,2.4,P.h);c2.restore();
  // its one door, lit from inside, and the light it throws on the floor
  g=c2.createLinearGradient(0,dy,0,dy+dh);g.addColorStop(0,"rgb(170,236,242)");g.addColorStop(1,"rgb(226,252,252)");c2.fillStyle=g;c2.fillRect(dx,dy,dw,dh);
  pg_glow(c2,dx+dw/2,dy+dh*0.6,170,[140,230,240],0.35);
  c2.save();c2.translate(dx+dw/2,P.y+P.h+8);c2.scale(1,0.22);pg_glow(c2,0,0,300,[140,230,240],0.4);c2.restore();
  // its reflection in the floor
  g=c2.createLinearGradient(0,P.y+P.h,0,P.y+P.h+160);g.addColorStop(0,"rgba(170,236,242,0.10)");g.addColorStop(1,"rgba(170,236,242,0)");c2.fillStyle=g;c2.fillRect(P.x,P.y+P.h,P.w,160);}});

// the data team's room: a glass desk on the left, a laptop on it, the hall behind
const PG_DESK=772;   // the desks' back edge: whoever stands behind one is hidden below it
function pg_paintDesk(c,x0,x1,warm){const top=PG_DESK;let g=c.createLinearGradient(0,top,0,top+26);g.addColorStop(0,"rgba(190,240,245,0.32)");g.addColorStop(1,"rgba(120,190,200,0.16)");
  c.fillStyle="rgba(8,24,28,0.9)";c.fillRect(x0,top,x1-x0,H-top);c.fillStyle=g;c.fillRect(x0,top,x1-x0,26);
  c.save();c.shadowColor="rgba(120,220,232,0.8)";c.shadowBlur=10;c.fillStyle="rgba(214,250,252,0.85)";c.fillRect(x0,top,x1-x0,2);c.restore();
  g=c.createLinearGradient(0,top+26,0,H);g.addColorStop(0,"rgba(120,200,210,0.10)");g.addColorStop(1,"rgba(120,200,210,0.02)");c.fillStyle=g;c.fillRect(x0,top+26,x1-x0,H-top-26);
  if(warm)pg_glow(c,warm[0],warm[1],420,PG.warm,0.12);}
AG_PLACES.pgTeam=c=>dp_paintHall(c,{seed:41,horizon:690,vx:1260,lights:18,panes:8,pools:[[460,880,520,0.1],[1300,780,640,0.07]],after:c2=>{pg_paintDesk(c2,40,900);
  // a laptop on the desk, its back to us, and a cup
  c2.fillStyle="rgb(26,34,38)";c2.beginPath();c2.moveTo(560,PG_DESK+4);c2.lineTo(800,PG_DESK+4);c2.lineTo(784,PG_DESK-130);c2.lineTo(576,PG_DESK-130);c2.closePath();c2.fill();
  c2.strokeStyle="rgba(150,220,228,0.5)";c2.lineWidth=2;c2.stroke();pg_glow(c2,680,PG_DESK-60,80,"cyan",0.08);
  c2.fillStyle="rgb(40,50,54)";rr(c2,170,PG_DESK-52,46,56,8);c2.fill();c2.strokeStyle="rgba(170,230,236,0.4)";c2.stroke();}});
// the registrar's office: a desk on the right under a warm lamp, shelves of box files behind it
AG_PLACES.pgOffice=c=>dp_paintHall(c,{seed:63,horizon:690,vx:700,lights:14,panes:6,pools:[[1460,880,520,0.1],[620,780,600,0.07]],after:c2=>{
  // the shelves: frosted panes in front of rows of box files, their spines in quiet colours
  const R=ag_rnd(5);c2.fillStyle="rgba(10,26,30,0.85)";c2.fillRect(1090,150,760,560);
  for(let r=0;r<4;r++){const y=176+r*132;c2.fillStyle="rgba(150,210,218,0.25)";c2.fillRect(1100,y+112,740,3);
    for(let x=1112;x<1820;){const bw=34+R()*20,bh=86+R()*20,col=[[126,112,100],[98,110,116],[140,128,110],[88,94,104],[120,104,96]][Math.floor(R()*5)];
      c2.fillStyle=rgba(col,1);c2.fillRect(x,y+112-bh,bw-4,bh);c2.fillStyle="rgba(240,236,224,0.6)";c2.fillRect(x+6,y+112-bh+16,bw-16,12);x+=bw;}}
  dp_blurDraw(c2,c2.canvas,1090,150,760,560,1090,150,760,560,3.5);c2.fillStyle="rgba(150,215,222,0.08)";c2.fillRect(1090,150,760,560);
  c2.fillStyle="rgba(214,250,252,0.6)";c2.fillRect(1090,150,760,2);
  pg_paintDesk(c2,1000,1900,[1720,640]);
  // the lamp on the desk
  c2.fillStyle="rgb(36,44,46)";c2.fillRect(1756,PG_DESK-150,8,150);c2.beginPath();c2.moveTo(1700,PG_DESK-150);c2.lineTo(1820,PG_DESK-150);c2.lineTo(1790,PG_DESK-210);c2.lineTo(1730,PG_DESK-210);c2.closePath();c2.fill();
  c2.fillStyle="rgb(255,232,190)";c2.fillRect(1704,PG_DESK-154,112,6);pg_glow(c2,1760,PG_DESK-120,260,PG.warm,0.3);}});
// the people of the university this film shows, each in the hall's light
DP_PEOPLE.push("sam","jun","mei","noor");

/* ---------------------------------------------------------------- the directory: Microsoft Entra ID's groups, as rows */
// where the directory's page stands in the hall, and its rows: each a group, as the directory names it
const PG_DIR={x:90,y:150,w:760,h:620,rows:["data_team","registrar_office","registrar_exam_support","planning_learner_readers","finance_analysts"],top:0,lh:96};
// the directory's page, its rows (each group's name, a drawer of frosted glass), and what each row holds: a map of row index to
// [names] drawn as small cards along the row. o: a, rows (how many shown, 0 to n, a row comes in as its share passes 1), lit (a row
// index to light in cyan), where, title
function pg_directory(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return null;const D=PG_DIR,b=dp_page(ctx,D.x,D.y,D.w,D.h,{tool:"entra",name:"Microsoft Entra ID",where:o.where||"Groups",a,title:o.title});
  ctx.save();ctx.globalAlpha*=a;const n=D.rows.length;
  for(let i=0;i<n;i++){const u=clamp((o.rows==null?n:o.rows)-i,0,1);if(u<=0)continue;const y=b.y+i*D.lh;ctx.save();ctx.globalAlpha*=ag_sine(u);
    const lit=o.lit===i?1:0;rr(ctx,b.x,y,b.w,78,14);ctx.fillStyle=lit?rgba(DP.F.cyan,0.16):"rgba(4,14,18,0.45)";ctx.fill();ctx.strokeStyle=rgba(lit?DP.F.cyan:DP.T.mut,lit?0.95:0.35);ctx.lineWidth=lit?2.4:1.4;ctx.stroke();
    dp_T(ctx,D.rows[i],b.x+24,y+50,{w:500,size:28,f:"mono",col:lit?"cyan":"ink"});ctx.restore();}
  ctx.restore();return b;}
// where row i of the directory is (its box), for the cards that go into it
function pg_dirRow(i){const D=PG_DIR;return{x:D.x+32,y:D.y+76+(28)+i*D.lh,w:D.w-64,h:78};}
// a card moving into, along or out of a row: from [x, y] to [x, y], u from 0 to 1 (sine)
function pg_cardAt(ctx,name,from,to,u,o){const p=ag_sine(clamp(u,0,1));return pg_who(ctx,lerp(from[0],to[0],p),lerp(from[1],to[1],p),name,o);}
// a tool's name on a slip, its logo, unaltered, before it; x, y its top left (o.align "center": x its middle); returns its box
function pg_toolSlip(ctx,x,y,tool,name,a,o){o=o||{};const im=typeof LOGO!=="undefined"&&LOGO[tool],lh=36,lw=im&&im.width?lh*im.width/im.height:0,
  w=dp_tw(ctx,name,{w:700,size:30})+lw+(lw?64:48),x0=o.align==="center"?x-w/2:x,bb={x:x0,y,w,h:70};if(!(a>0.004))return bb;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x0+w/2,y+35,lerp(0.7,1,o.k));dp_panel(ctx,x0,y,w,70,{col:"cyan",r:16,glowR:26,behind:o.behind});
  if(lw)ctx.drawImage(im,x0+22,y+17,lw,lh);dp_T(ctx,name,x0+(lw?lw+42:24),y+46,{w:700,size:30});ctx.restore();return bb;}
// the platform's name and logo, on a slip above its block
function pg_platName(ctx,a){const P=PG_PLAT;return pg_toolSlip(ctx,P.x+P.w/2,P.y-96,"databricks","Azure Databricks",a,{align:"center"});}
// the line of light from the directory to the platform's door: the platform reads it; p draws it on, glow runs a light along it
function pg_reads(ctx,p,glow,label){const a=[PG_DIR.x+PG_DIR.w+8,520],b=[PG_PLAT.door[0]-14,PG_PLAT.door[1]+40];dp_link(ctx,a,b,"cyan",p,{lw:3});
  if(glow>0&&glow<1){const u=ag_sine(glow),x=lerp(a[0],b[0],u),y=lerp(a[1],b[1],u);pg_glow(ctx,x,y,60,"cyan",0.8*Math.sin(Math.PI*glow));}
  if(label>0)dp_tag(ctx,a[0]+60,a[1]-130,"reads people and groups","cyan",{a:label});}

/* ---------------------------------------------------------------- signing in, the agreement, roles, a secure store, the end */
// a sign-in through the directory, with a passkey: whom it's for, the face check, a tick and "Signed in". x, y its top left, w wide,
// 330 tall; o: title, sub, face (0 to 1), tick (0 to 1), signed (0 to 1), a, k, behind
function pg_signin(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=330;if(a<=0.004)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.8,1,o.k));
  dp_panel(ctx,x,y,w,h,{col:"cyan",r:22,behind:o.behind});const im=typeof LOGO!=="undefined"&&LOGO.entra;let lx=x+34;
  if(im&&im.width){const lh=34,lw=lh*im.width/im.height;ctx.drawImage(im,lx,y+28,lw,lh);lx+=lw+16;}dp_T(ctx,"Microsoft Entra ID",lx,y+56,{w:700,size:28,col:"mut"});
  dp_T(ctx,o.title||"Sign in to Azure Databricks",x+34,y+118,{w:700,size:36});dp_T(ctx,o.sub||"Use your passkey",x+34,y+162,{w:600,size:30,col:"mut"});
  // the face check: corners that frame a face, a ring drawn round it, then the tick
  const fc=clamp(o.face||0,0,1),tk=clamp(o.tick||0,0,1),cx=x+92,cy=y+252;ctx.save();ctx.strokeStyle=rgba(DP.F.cyan,0.95);ctx.lineWidth=4;ctx.lineCap="round";
  for(let i=0;i<4;i++){ctx.save();ctx.translate(cx,cy);ctx.rotate(i*Math.PI/2);ctx.beginPath();ctx.moveTo(-38,-22);ctx.lineTo(-38,-38);ctx.lineTo(-22,-38);ctx.stroke();ctx.restore();}
  if(fc>0){ctx.beginPath();ctx.arc(cx,cy,26,-Math.PI/2,-Math.PI/2+TAU*ag_sine(fc));ctx.stroke();}ctx.restore();if(tk>0)dp_tick(ctx,cx,cy,"green",tk);
  const sg=clamp(o.signed||0,0,1);if(sg>0)dp_T(ctx,"Signed in",x+164,y+264,{w:700,size:34,col:"green",a:sg});
  ctx.restore();return{x,y,w,h};}
// each person's confidentiality agreement, in the signer's voice (An agreement first's six lines, word for word), and its Accept
// button, which turns green with a tick as it's accepted (o.accept 0 to 1). x, y its top left; returns its box
const PG_AGREE=["I keep what I see to myself","I use it only for the work it's given for","I keep no copy where it isn't allowed","I answer for the data I'm given","I report anything that goes wrong, at once","It holds after I leave"];
function pg_agreement(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=110+PG_AGREE.length*44+90;if(a<=0.004)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.8,1,o.k));
  dp_panel(ctx,x,y,w,h,{col:"cyan",r:22,behind:o.behind});dp_T(ctx,"Confidentiality agreement",x+34,y+68,{w:700,size:36});
  PG_AGREE.forEach((l,i)=>dp_T(ctx,l,x+34,y+128+i*44,{w:600,size:28,col:"mut"}));
  const ac=clamp(o.accept||0,0,1),bw=dp_pill(ctx,x+34,y+h-38,"Accept","cyan",{a:1-ac});dp_pill(ctx,x+34,y+h-38,"Accept","green",{a:ac});if(ac>0)dp_tick(ctx,x+34+bw+34,y+h-48,"green",ac);
  ctx.restore();return{x,y,w,h};}
// a role given to an admin group: the tool's logo and name, the role, and the group that holds it (in amber: power, when switched on)
function pg_roleCard(ctx,x,y,w,tool,name,role,group,o){o=o||{};const a=o.a==null?1:o.a,h=150;if(a<=0.004)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.85,1,o.k));dp_panel(ctx,x,y,w,h,{col:"cyan",r:20,behind:o.behind});
  const im=typeof LOGO!=="undefined"&&LOGO[tool];let lx=x+30;if(im&&im.width){const lh=34,lw=lh*im.width/im.height;ctx.drawImage(im,lx,y+24,lw,lh);lx+=lw+16;}
  dp_T(ctx,name,lx,y+52,{w:600,size:28,col:"mut"});dp_T(ctx,role,x+30,y+114,{w:700,size:32});
  const rw=dp_tw(ctx,role,{w:700,size:32});dp_link(ctx,[x+52+rw,y+103],[x+112+rw,y+103],"amber",1,{lw:2.4,dot:false});
  dp_T(ctx,group,x+130+rw,y+114,{w:500,size:30,f:"mono",col:"amber"});ctx.restore();return{x,y,w,h};}
// the computer's secure store: a box of frosted glass with a lock, where the command line keeps its passes
function pg_store(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=130;if(a<=0.004)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;
  dp_frost(ctx,x,y,w,h,null,{col:"violet",r:20,behind:o.behind});dp_lock(ctx,x+60,y+h/2-4,56,"violet",0);
  dp_T(ctx,"The computer's secure store",x+112,y+h/2+10,{w:700,size:30});ctx.restore();return{x,y,w,h};}
// the end card, as the kit's dp_end, its last line in two
function pg_end(ctx,S,t,t0,title,l1,l2,line){const oA=ag_in(t,t0,1.0),tA=ag_in(t,t0+0.6,0.9);if(oA<=0)return;dp_veil(ctx,S,oA*0.9);setScreen(ctx,S);
  withA(ctx,tA,()=>{dp_T(ctx,l1,960,300,{w:700,size:48,align:"center"});dp_T(ctx,l2,960,368,{w:700,size:48,align:"center"});dp_mark(ctx,960,500,56,(t-t0-0.7)/1.4,1);
    dp_T(ctx,title,960,650,{w:800,size:44,align:"center"});dp_T(ctx,line,960,708,{w:600,size:28,align:"center",col:"mut"});});}

/* ---------------------------------------------------------------- sign-ins, the rule, the admin groups */
// a group inside a group: platform_team, a chip inside the directory's data_team row
function pg_nested(ctx,a){if(!(a>0.004))return;const D=PG_DIR,x0=D.x+32+290,y0=D.y+104+14;ctx.save();ctx.globalAlpha*=a;rr(ctx,x0,y0,250,50,12);ctx.fillStyle="rgba(4,14,18,0.6)";ctx.fill();
  ctx.strokeStyle=rgba(DP.F.cyan,0.8);ctx.lineWidth=1.8;ctx.stroke();dp_T(ctx,"platform_team",x0+16,y0+35,{w:500,size:28,f:"mono"});ctx.restore();}
// someone's sign-in: a small disc with a person in it, running from the directory's edge to the platform's door (g 0 to 1)
function pg_disc(ctx,g){if(!(g>0&&g<1))return;const A0=[PG_DIR.x+PG_DIR.w+8,520],B0=[PG_PLAT.door[0]+20,PG_PLAT.door[1]+60],q=ag_sine(g),x=lerp(A0[0],B0[0],q),y=lerp(A0[1],B0[1],q);
  ctx.save();ctx.globalAlpha*=Math.min(1,g*6)*(1-ag_in(g,0.8,0.2));dp_panel(ctx,x-30,y-30,60,60,{col:"cyan",r:30,glowR:24});ctx.translate(x,y);ctx.scale(0.42,0.42);dp_personPic(ctx,0,8,"cyan");ctx.restore();}
// a passkey, drawn in light: a key's bow and blade (x, y the blade's middle; s its size, about 120 long at 1)
function pg_passkey(ctx,x,y,s,col,a){if(!(a>0.004))return;const c=dp_f(col||"cyan");ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);
  ctx.strokeStyle=rgba(mix(c,[255,255,255],0.35),1);ctx.shadowColor=rgba(c,0.9);ctx.shadowBlur=14;ctx.lineWidth=7;ctx.lineCap="round";ctx.lineJoin="round";
  ctx.beginPath();ctx.arc(-34,0,24,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(-10,0);ctx.lineTo(58,0);ctx.moveTo(40,0);ctx.lineTo(40,18);ctx.moveTo(56,0);ctx.lineTo(56,14);ctx.stroke();ctx.restore();}
// a phone held in the near hand, its screen showing the face check (f, 0 to 1), and a green light once the passkey is unlocked (ok);
// no tick on it, since a person seen from the other side is drawn mirrored
function pg_heldPhone(c,h,f,ok){const [x,y]=h.near;pg_phone(c,x-18,y-150,0.36,{face:f});if(ok>0)pg_glow(c,x+22,y-88,70,"green",0.55*ok);}
// the sign-in rule, a Conditional Access policy in the directory: what it covers and what it asks for, a line each, lit as it's said
// (lit[i] 0 to 1); n lines shown
const PG_RULE=[["Users","All users"],["Target resources","Azure Databricks"],["Require authentication strength","Passkeys only"],["Require terms of use","Confidentiality agreement"]];
function pg_rule(ctx,a,lit,n){const b=dp_page(ctx,PG_DIR.x,PG_DIR.y,PG_DIR.w,PG_DIR.h,{tool:"entra",name:"Microsoft Entra ID",where:"Conditional Access",title:"Data platform sign-in",a});if(!(a>0.004))return b;
  withA(ctx,a,()=>{for(let i=0;i<n;i++){const y=b.y+i*104,l=clamp(lit[i]||0,0,1);rr(ctx,b.x-12,y-4,b.w+24,90,14);ctx.fillStyle=rgba(DP.F.cyan,0.12*l);ctx.fill();
    ctx.strokeStyle=rgba(DP.F.cyan,0.3+0.65*l);ctx.lineWidth=1.4+l;ctx.stroke();dp_T(ctx,PG_RULE[i][0],b.x+14,y+32,{w:600,size:28,col:"mut"});
    dp_T(ctx,PG_RULE[i][1],b.x+14,y+72,{w:700,size:30,col:l>0.5?"cyan":"ink"});}});return b;}
// the directory's admin groups, each a slot of glass with an amber edge, as the directory names them; n shown (0 to 6), on[i] (0 to 1:
// someone switched on in it), a; returns the page's box
const PG_ADMINS=["admin_account_settings","admin_production_settings","admin_test_settings","admin_development_settings","admin_storage_readers","admin_table_restorers"];
function pg_slots(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(!(a>0.004))return null;const D=PG_DIR,b=dp_page(ctx,D.x,D.y,D.w,D.h,{tool:"entra",name:"Microsoft Entra ID",where:"Groups",a});
  ctx.save();ctx.globalAlpha*=a;PG_ADMINS.forEach((g,i)=>{const u=clamp((o.n==null?6:o.n)-i,0,1);if(u<=0)return;const on=o.on?clamp(o.on[i]||0,0,1):0;
    pg_slot(ctx,b.x,b.y+i*78,g,{w:b.w,on,count:"0 members",countOn:"1 member",a:ag_sine(u)});});ctx.restore();return b;}
// the right end of admin group i's slot, where an eligible account's dotted line reaches it
function pg_slotEnd(i){return[PG_DIR.x+PG_DIR.w-32,PG_DIR.y+104+i*78+35];}
