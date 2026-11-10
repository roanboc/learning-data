/* ===== Network, storage and keys: the platform, in the module's hall =====
   One room, the hall (nwHall), for chapters 3 to 9, so the camera glides from chapter to chapter and only what changes fades. The
   platform is drawn live, always in the same places:
     the university's network, on the left: where people, the job machines and the build service are (NW_H.net)
     the three workspaces, glass rooms in a column, development above test above production (NW_H.rooms)
     the catalog, a lit glass tank beside production, between it and the files (NW_H.tank)
     the storage, a tall glass channel on the right, a container for each area (NW_H.store)
     the internet, a far pane at the top right (NW_H.inet); later, where it was, the security team's key vault (NW_H.vault)
     serverless compute, a small cloud between the rooms and the internet (NW_H.cloud)
   Colours mean what they mean in every film of the module: cyan an identity, green allowed, coral denied or closed, amber power
   switched on, violet hidden (here, the key vault's secrets), grey what needs no protection; gold is a sealed card's chip. An account
   key or a signed link is a sealed card (dp_sealed), never a character of it. The tools' pages are the kit's (dp_page), with the
   tools' logos as their docs show them on the day. Every name here starts with nw_ or NW_. */

AG_PLACES.nwHall=c=>dp_paintHall(c,{seed:17,horizon:690,vx:1040,lights:16,panes:7,pools:[[330,1000,520,0.11],[1300,820,700,0.06]],haze:0.08});
const NW_H={
  net:{x:40,y:96,w:610,h:770},
  rooms:[{k:"dev",name:"development",x:700,y:116,w:390,h:172},{k:"test",name:"test",x:700,y:318,w:390,h:172},{k:"prod",name:"production",x:700,y:520,w:390,h:172}],
  tank:{x:1140,y:562,w:250,h:150},
  store:{x:1460,y:476,w:430,h:390},
  inet:{x:1460,y:96,w:430,h:330},
  vault:{x:1460,y:96,w:430,h:356},
  cloud:{x:1290,y:206},
  areas:["registrar","learning","planning","hr","finance"]
};
// the middle of a room's left and right sides, and of its top
const nw_roomL=i=>{const r=NW_H.rooms[i];return[r.x,r.y+r.h/2];},nw_roomR=i=>{const r=NW_H.rooms[i];return[r.x+r.w,r.y+r.h/2];};
// a tool's logo, its height h, its left at x, its middle at y; returns its width
function nw_logo(ctx,tool,x,y,h){const im=typeof LOGO!=="undefined"&&LOGO[tool];if(!im||!im.width)return 0;const w=h*im.width/im.height;ctx.drawImage(im,x,y-h/2,w,h);return w;}

/* ---------------------------------------------------------------- the workspaces */
// a workspace: a room of clear glass, the Azure Databricks logo and its name inside it, top left; o: a, lit (its glow, 0 to 1),
// note (a line under the name), inside(ctx, room) draws what is in it
function nw_room(ctx,i,o){o=o||{};const r=NW_H.rooms[i],a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  if(o.lit>0)dp_halo(ctx,r.x+r.w/2,r.y+r.h/2,r.w*0.75,o.col||"cyan",0.12*o.lit);
  dp_wall(ctx,r.x,r.y,r.w,r.h,{col:o.col||"cyan"});
  ctx.save();ctx.fillStyle="rgba(6,20,26,0.42)";ctx.fillRect(r.x+2,r.y+2,r.w-4,r.h-4);ctx.restore();
  dp_T(ctx,r.name,r.x+24,r.y+50,{w:700,size:30});
  if(o.note)dp_T(ctx,o.note,r.x+24,r.y+96,{w:o.noteW||600,size:28,col:o.noteCol||"mut",a:o.noteA});
  if(o.note2)dp_T(ctx,o.note2,r.x+24,r.y+138,{w:600,size:28,col:o.note2Col||"mut",a:o.note2A});
  if(o.inside)o.inside(ctx,r);ctx.restore();}

// the platform's name over the three rooms, with its logo, once the voice names it
function nw_dbHead(ctx,a){if(!(a>0))return;ctx.save();ctx.globalAlpha*=a;const lw=nw_logo(ctx,"databricks",700,80,34);dp_T(ctx,"Azure Databricks",700+lw+12,92,{w:700,size:30});ctx.restore();}

/* ---------------------------------------------------------------- the catalog, a lit glass tank */
// the catalog at (x, y) (its top left), s its size (1: 440 x 300, as it first appears; 0.514: beside production); o: a, lit (0 to 1),
// chips [grant, mask, filter] lit 0 to 1 each, label (true by default)
function nw_tankAt(s){const T=NW_H.tank;return s==null?T:{x:T.x,y:T.y,w:T.w,h:T.h};}
function nw_catTank(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=(o.w||440)*s,h=(o.h||300)*s,lit=o.lit==null?0.6:o.lit;ctx.save();ctx.globalAlpha*=a;
  dp_halo(ctx,x+w/2,y+h*0.6,w*0.9,"cyan",0.10+0.12*lit);
  // the glass, and the lit water inside it, pale silver going to the identity's cyan where it's lit
  ctx.save();rr(ctx,x,y,w,h,18*s);ctx.fillStyle="rgba(6,20,26,0.6)";ctx.fill();ctx.clip();
  const wy=y+h*0.36,g=ctx.createLinearGradient(0,wy,0,y+h);g.addColorStop(0,rgba(mix(NW_C.water,DP.F.cyan,0.25*lit),0.55));g.addColorStop(1,rgba(mix(NW_C.waterDk,DP.F.cyan,0.15*lit),0.35));
  ctx.fillStyle=g;ctx.fillRect(x,wy,w,y+h-wy);ctx.fillStyle="rgba(240,252,252,0.8)";ctx.fillRect(x,wy-1,w,2);
  const hg=ctx.createLinearGradient(x,y,x+w,y+h);hg.addColorStop(0,"rgba(220,250,250,0.16)");hg.addColorStop(0.5,"rgba(220,250,250,0.02)");hg.addColorStop(1,"rgba(220,250,250,0.08)");ctx.fillStyle=hg;ctx.fillRect(x,y,w,h);ctx.restore();
  ctx.save();ctx.shadowColor=rgba(DP.F.cyan,0.9);ctx.shadowBlur=14;rr(ctx,x+1,y+1,w-2,h-2,18*s);ctx.strokeStyle=rgba(mix(DP.F.cyan,[255,255,255],0.4),0.95);ctx.lineWidth=2.4;ctx.stroke();ctx.restore();
  if(o.label!==false){const big=o.big==null?(s>0.8?1:0):o.big,lh=lerp(30,40,big),sz=lerp(28,36,big),tw=dp_tw(ctx,"Unity Catalog",{w:700,size:sz}),lw0=lh*((typeof LOGO!=="undefined"&&LOGO.databricks&&LOGO.databricks.width)?LOGO.databricks.width/LOGO.databricks.height:0),
      lx=x+w/2-(lw0+(lw0?12:0)+tw)/2,ly=y+lerp(40,62,big);nw_logo(ctx,"databricks",lx,ly-sz*0.36,lh);dp_T(ctx,"Unity Catalog",lx+lw0+(lw0?12:0),ly,{w:700,size:sz});}
  // the three chips on its rim: each check every read passes
  if(o.chips&&(o.chipsA==null||o.chipsA>0)){const names=["Grant","Mask","Filter"],cw=names.map(n=>dp_tw(ctx,n,{w:700,size:28})+36),gap=14,tot=cw.reduce((p,q)=>p+q,0)+gap*2;let cx=x+w/2-tot/2;
    ctx.save();ctx.globalAlpha*=o.chipsA==null?1:o.chipsA;names.forEach((n,i)=>{const u=o.chips[i]||0;dp_pill(ctx,cx,y+h+56,n,u>0.5?"green":"grey",{size:28,a:0.6+0.4*u,glow:u>0.5?18:6});cx+=cw[i]+gap;});ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- the storage, and its containers */
// the storage account: a tall channel of clear glass, the Azure Storage logo, its name, and a container for each area; o: a, lit [5],
// door (its door on the internet, 0 shut to 1 open), rows (each container's opacity)
function nw_store(ctx,o){o=o||{};const S=NW_H.store,a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  dp_halo(ctx,S.x+S.w/2,S.y+S.h/2,S.w*0.8,"cyan",0.06);dp_wall(ctx,S.x,S.y,S.w,S.h,{col:"cyan"});
  ctx.save();ctx.fillStyle="rgba(6,20,26,0.45)";ctx.fillRect(S.x+2,S.y+2,S.w-4,S.h-4);ctx.restore();
  const lw=nw_logo(ctx,"storage",S.x+24,S.y+42,32);dp_T(ctx,"Azure Storage",S.x+24+lw+(lw?12:0),S.y+52,{w:700,size:30});
  dp_T(ctx,"unidataprod",S.x+24,S.y+96,{w:500,size:28,f:"mono",col:"mut"});
  NW_H.areas.forEach((n,i)=>{const ra=o.rows?o.rows[i]:1;if(ra<=0)return;const y=S.y+128+i*52,lit=o.lit?o.lit[i]||0:0;ctx.save();ctx.globalAlpha*=ra;
    rr(ctx,S.x+20,y,S.w-40,44,10);ctx.fillStyle=rgba(mix([10,30,36],DP.F.cyan,0.18*lit),0.9);ctx.fill();ctx.strokeStyle=rgba(mix([120,200,205],DP.F.cyan,lit),0.35+0.45*lit);ctx.lineWidth=1.4;ctx.stroke();
    // the files in it: a few thin sheets of light
    for(let k=0;k<6;k++){ctx.fillStyle=rgba(NW_C.water,0.18+0.12*lit);ctx.fillRect(S.x+S.w-200+k*26,y+10,16,24);}
    dp_T(ctx,n,S.x+40,y+32,{w:600,size:28,f:"mono"});
    // encrypted at rest: a small violet lock on each container
    if(o.enc>0)withA(ctx,o.enc,()=>dp_lock(ctx,S.x+S.w-40,y+24,26,"violet",0));ctx.restore();});
  // the files can't be read: a dashed coral line round the storage
  if(o.out>0){ctx.save();ctx.globalAlpha*=o.out;const c=dp_f("coral");ctx.setLineDash([12,10]);ctx.strokeStyle=rgba(c,1);ctx.shadowColor=rgba(c,0.8);ctx.shadowBlur=10;ctx.lineWidth=3;rr(ctx,S.x-10,S.y-10,S.w+20,S.h+20,24);ctx.stroke();ctx.restore();}
  ctx.restore();}
// the point on the storage's left side at height y, and its top middle
const nw_storeL=y=>[NW_H.store.x,y],nw_storeTop=()=>[NW_H.store.x+NW_H.store.w/2,NW_H.store.y];

/* ---------------------------------------------------------------- the internet, and the doors to it */
// the internet: a far pane of frosted glass at the top right, scattered with faint points of light, any address anywhere; o: a, label
function nw_inet(ctx,t,o){o=o||{};const I=NW_H.inet,a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  dp_panel(ctx,I.x,I.y,I.w,I.h,{col:"grey",r:22,glowA:0.5});
  // a darker band of glass at the top, under its name, so the name reads over the hall's glow behind the pane
  const R=ag_rnd(77);ctx.save();rr(ctx,I.x,I.y,I.w,I.h,22);ctx.clip();{const g=ctx.createLinearGradient(0,I.y,0,I.y+150);g.addColorStop(0,"rgba(4,14,18,0.5)");g.addColorStop(0.7,"rgba(4,14,18,0.3)");g.addColorStop(1,"rgba(4,14,18,0)");ctx.fillStyle=g;ctx.fillRect(I.x,I.y,I.w,150);}
  for(let i=0;i<90;i++){const x=I.x+20+R()*(I.w-40),y=I.y+110+R()*(I.h-130),r=1.2+R()*2.4,tw=0.5+0.5*Math.sin(t*1.3+i);
    ctx.fillStyle="rgba(210,235,238,"+(0.12+0.3*R()*tw).toFixed(3)+")";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();}ctx.restore();
  dp_T(ctx,"The internet",I.x+28,I.y+56,{w:700,size:34});dp_T(ctx,"any address, anywhere",I.x+28,I.y+98,{w:600,size:28,col:"mut"});ctx.restore();}
// a door on the internet: a coral dotted line from the internet's pane to a room or the storage, drawn on (p), shut (shut 0 to 1: the
// line goes and a small coral lock stays where the door was), or passing only some addresses (o.only: 0 to 1, the line thins)
function nw_door(ctx,from,to,p,o){o=o||{};if(p<=0)return;const sh=clamp(o.shut||0,0,1),a=(o.a==null?1:o.a);
  if(sh<1)dp_link(ctx,from,to,"coral",p,{dash:o.only>0?[4,10]:[10,9],lw:lerp(3,1.8,o.only||0),alpha:(1-sh)*a*lerp(1,0.7,o.only||0),dot:false});
  if(p>=1){ctx.save();ctx.globalAlpha*=a;const c=dp_f("coral");ctx.fillStyle=rgba(c,1);ctx.shadowColor=rgba(c,0.8);ctx.shadowBlur=10;ctx.beginPath();ctx.arc(to[0],to[1],7,0,TAU);ctx.fill();ctx.restore();
    if(sh>0)withA(ctx,ag_eo(sh)*a,()=>dp_lock(ctx,to[0]+(o.lockDx||26),to[1]+6,34,"coral",0));}}
// the doors from the internet: to each room's right side and to the storage's top, with where they start on the internet's pane
const NW_DOORS=[[[1460,206],[1090,202]],[[1460,300],[1090,404]],[[1460,394],[1090,560]],[[1675,426],[1675,476]]];

/* ---------------------------------------------------------------- the university's network, and its private doors */
// the university's network: a floor of frosted glass on the left with a pane along its right edge, where its private doors are
function nw_net(ctx,o){o=o||{};const N=NW_H.net,a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  dp_wall(ctx,N.x+N.w-14,N.y,14,N.h,{frosted:true,col:"green",a:0.9});
  if(o.label!==0)dp_T(ctx,"The university's network",N.x+20,N.y+40,{w:700,size:30,col:"green",a:o.label==null?1:o.label});ctx.restore();}
// a private endpoint: a green door in the network's pane, at a room's height, and its line of light to the room (p draws it on)
function nw_privDoor(ctx,i,p,o){o=o||{};if(p<=0)return;const N=NW_H.net,y=nw_roomL(i)[1],x=N.x+N.w-7,a=o.a==null?1:o.a;ctx.save();ctx.globalAlpha*=a;
  const c=dp_f("green"),u=ag_eo(clamp(p*1.6,0,1));ctx.save();ctx.shadowColor=rgba(c,0.9);ctx.shadowBlur=16;rr(ctx,x-12,y-44*u,24,88*u,8);ctx.fillStyle=rgba(mix(c,[6,20,26],0.25),1);ctx.fill();ctx.restore();
  dp_link(ctx,[x+12,y],nw_roomL(i),"green",clamp(p*1.6-0.5,0,1),{lw:3});ctx.restore();}
// the gears of job compute, and the build service, inside the network (a: each one's opacity)
function nw_jobs(ctx,a){if(!(a>0))return;ctx.save();ctx.globalAlpha*=a;const N=NW_H.net,x=N.x+30,y=N.y+90;dp_panel(ctx,x,y,270,150,{col:"cyan",r:18});
  ctx.save();ctx.translate(x+70,y+82);ctx.scale(0.5,0.5);dp_gearPic(ctx,0,6,"cyan");ctx.restore();dp_T(ctx,"Job",x+128,y+66,{w:700,size:30});dp_T(ctx,"compute",x+128,y+104,{w:700,size:30});ctx.restore();}
function nw_build(ctx,a){if(!(a>0))return;ctx.save();ctx.globalAlpha*=a;const N=NW_H.net,x=N.x+320,y=N.y+90;dp_panel(ctx,x,y,262,150,{col:"cyan",r:18});
  nw_logo(ctx,"github",x+26,y+76,48);dp_T(ctx,"Build",x+92,y+66,{w:700,size:30});dp_T(ctx,"service",x+92,y+104,{w:700,size:30});ctx.restore();}

/* ---------------------------------------------------------------- serverless compute, and the ways out */
// serverless compute: a small cloud of glass, run by Databricks for the university, between the rooms and the internet
function nw_cloud(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const C=NW_H.cloud;ctx.save();ctx.globalAlpha*=a;dp_halo(ctx,C.x,C.y,170,"cyan",0.10);
  const shape=c=>{c.beginPath();c.moveTo(C.x-110,C.y+46);c.bezierCurveTo(C.x-150,C.y+46,C.x-150,C.y-12,C.x-102,C.y-14);c.bezierCurveTo(C.x-100,C.y-70,C.x-30,C.y-84,C.x-4,C.y-44);
    c.bezierCurveTo(C.x+20,C.y-90,C.x+104,C.y-76,C.x+100,C.y-16);c.bezierCurveTo(C.x+150,C.y-14,C.x+150,C.y+46,C.x+110,C.y+46);c.closePath();};
  ctx.save();shape(ctx);ctx.fillStyle="rgba(6,20,26,0.7)";ctx.fill();ctx.clip();dp_behind(ctx);ctx.fillStyle="rgba(150,215,220,0.10)";ctx.fillRect(C.x-160,C.y-100,320,160);ctx.restore();
  ctx.save();shape(ctx);ctx.shadowColor=rgba(DP.F.cyan,0.8);ctx.shadowBlur=12;ctx.strokeStyle=rgba(mix(DP.F.cyan,[255,255,255],0.4),0.95);ctx.lineWidth=2.4;ctx.stroke();ctx.restore();
  dp_T(ctx,"Serverless",C.x,C.y+14,{w:700,size:30,align:"center"});dp_T(ctx,"run by Databricks",C.x,C.y+86,{w:600,size:28,align:"center",col:"mut"});ctx.restore();}
// where serverless compute could send a table: points all over the internet's pane, and the one on the short list
const NW_OUT=(()=>{const R=ag_rnd(91),I=NW_H.inet,L=[];for(let i=0;i<9;i++)L.push([I.x+60+R()*(I.w-120),I.y+150+R()*(I.h-180)]);return L;})();
const NW_API=[1700,250];

/* ---------------------------------------------------------------- the counter, the ways around, and the cards */
// how many ways reach the files without the catalog (n), and through it; a panel top left
function nw_counter(ctx,n,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const k=Math.round(n),s1=k+(k===1?" way":" ways")+" around the catalog",s2="straight to the files";
  ctx.save();ctx.globalAlpha*=a;const w=Math.max(dp_tw(ctx,s1,{w:700,size:34}),dp_tw(ctx,s2,{w:600,size:28}))+60;dp_panel(ctx,60,64,w,128,{col:k>0?"coral":"green",r:18});
  dp_T(ctx,s1,90,116,{w:700,size:34,col:k>0?"coral":"green"});dp_T(ctx,s2,90,162,{w:600,size:28,col:"mut"});ctx.restore();}
// the six people with a role on the storage, as small badges of glass with a coral rim (or, on the way to the catalog, green)
function nw_personChip(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=o.w||84,h=o.h||100;ctx.save();ctx.globalAlpha*=a;dp_panel(ctx,x,y,w,h,{col:o.col||"coral",r:16,glowR:20});
  ctx.save();ctx.translate(x+w/2,y+h*0.54);ctx.scale(0.56,0.56);dp_personPic(ctx,0,0,o.col||"coral");ctx.restore();ctx.restore();}
// the ways around: each one's short coral line to a bus on the left of the rooms, and the bus, along the floor under the rooms and the
// catalog, into the storage's side (p draws each on; a fades it)
const NW_BUS={x:668,y:836};
function nw_wayStub(ctx,from,p,o){o=o||{};if(p<=0)return;dp_link(ctx,from,[NW_BUS.x,from[1]],o.col||"coral",p,{lw:3,alpha:o.a==null?1:o.a,dot:false});}
function nw_wayBus(ctx,top,p,o){o=o||{};if(p<=0)return;const a=o.a==null?1:o.a,c=dp_f(o.col||"coral"),L1=NW_BUS.y-top,L2=NW_H.store.x-NW_BUS.x,d=clamp(p,0,1)*(L1+L2);ctx.save();ctx.globalAlpha*=a;
  ctx.strokeStyle=rgba(c,1);ctx.lineWidth=4;ctx.shadowColor=rgba(c,0.8);ctx.shadowBlur=10;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(NW_BUS.x,top);
  if(d<=L1)ctx.lineTo(NW_BUS.x,top+d);else{ctx.lineTo(NW_BUS.x,NW_BUS.y);ctx.lineTo(NW_BUS.x+d-L1,NW_BUS.y);}ctx.stroke();
  if(p>=1){ctx.fillStyle=rgba(mix(c,[255,255,255],0.35),1);ctx.beginPath();ctx.arc(NW_H.store.x,NW_BUS.y,7,0,TAU);ctx.fill();}ctx.restore();}
// a stamp that lands on a card: a coral pill, springing in (k)
function nw_stamp(ctx,x,y,text,k,o){o=o||{};if(!(k>0))return;ctx.save();ag_about(ctx,x,y-12,lerp(1.5,1,ag_eo(clamp(k,0,1))));ctx.globalAlpha*=clamp(k*2,0,1);dp_pill(ctx,x,y,text,o.col||"coral",{size:28,align:"center"});ctx.restore();}

/* ---------------------------------------------------------------- the one door you switch on, and the vault */
// the admin door: a narrow door with an amber edge in the storage's side, shut; glow 0 to 1 while power is switched on, open 0 to 1
function nw_adminDoor(ctx,glow,open,o){o=o||{};const S=NW_H.store,x=S.x-6,y=o.y||490,h=96,a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const c=dp_f("amber");
  if(glow>0)dp_halo(ctx,x,y+h/2,140,"amber",0.25*glow);
  ctx.save();ctx.shadowColor=rgba(c,0.5+0.5*glow);ctx.shadowBlur=8+14*glow;rr(ctx,x-14,y,28,h,8);ctx.fillStyle=rgba(mix([14,30,34],c,0.12+0.4*glow*open),1);ctx.fill();
  ctx.strokeStyle=rgba(mix(c,[255,255,255],0.3*glow),0.7+0.3*glow);ctx.lineWidth=3;ctx.stroke();ctx.restore();ctx.restore();}
// the key vault: a pane of darker glass, violet (what's behind it is hidden), the Key Vault logo, its name, and who keeps it
function nw_vault(ctx,o){o=o||{};const V=NW_H.vault,a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  dp_frost(ctx,V.x,V.y,V.w,V.h,null,{col:"violet",r:22});
  const lw=nw_logo(ctx,"keyVault",V.x+24,V.y+42,34);dp_T(ctx,"Key Vault",V.x+24+lw+(lw?12:0),V.y+52,{w:700,size:30});
  dp_T(ctx,"kv-uni-keys",V.x+24,V.y+92,{w:500,size:28,f:"mono"});dp_T(ctx,"kept by the security team",V.x+24,V.y+130,{w:600,size:28,col:"mut"});ctx.restore();}
// the vault's two keys, each a sealed card: the workspace's, above, and the storage's
const NW_VK=[{x:1484,y:248,w:382},{x:1484,y:352,w:382}];

/* ---------------------------------------------------------------- the whole platform, from what a chapter shows
   nw_base(ctx, t, b) draws every standing piece, always in the same places and the same order, from b (each 0 to 1, left out 0):
   head (the platform's name), inet, doors [4] and shut [4] (the doors on the internet: three rooms', the storage's), only (an IP access
   list on the rooms' doors), net and netLabel, priv [3] (private endpoints), jobs, build, rooms [3] and notes [3] (each {note, noteCol,
   noteA, note2, note2Col, note2A}), m (the catalog: 0 big in the middle, 1 in its place beside production), lit, chips [3], chipsA,
   pl (production's link to the catalog), link (the catalog's to the files), locs (its external locations, one to each container), store,
   storeLit [5], rows [5], cloud, outs, outsA, cross (serverless compute's ways out, and what a dry run would have blocked), allow [2]
   (the two places it may reach), vault, vk [2] (its keys), vkRev, vkLine [2], admin {a, glow, open, lock}. The same b draws the same
   picture, so a chapter that opens where the last one ends starts from the same b. */
const NW_CATBIG={x:520,y:300,w:440,h:300};
function nw_tankG(m){const u=ag_sine(m==null?1:m),A=NW_CATBIG,B=NW_H.tank;return{x:lerp(A.x,B.x,u),y:lerp(A.y,B.y,u),w:lerp(A.w,B.w,u),h:lerp(A.h,B.h,u)};}
// the catalog at g {x, y, w, h}: its label's size goes with its own
function nw_cat(ctx,g,o){o=o||{};const big=clamp((g.w-250)/(440-250),0,1);return nw_catTank(ctx,g.x,g.y,1,Object.assign({},o,{w:g.w,h:g.h,big}));}
const nw_linkY=m=>lerp(NW_CATBIG.y+200,NW_H.tank.y+NW_H.tank.h/2,ag_sine(m==null?1:m));
function nw_base(x,t,b){b=b||{};const R=NW_H.rooms,ST=NW_H.store,g=nw_tankG(b.m),v=(k,i)=>b[k]?b[k][i]||0:0;
  nw_dbHead(x,b.head);
  nw_inet(x,t,{a:b.inet||0});
  nw_net(x,{a:b.net||0,label:b.netLabel==null?1:b.netLabel});
  NW_DOORS.forEach((d,i)=>nw_door(x,d[0],d[1],v("doors",i),{shut:v("shut",i),only:i<3?(b.only||0):0}));
  if(b.outs>0)NW_OUT.forEach((q,i)=>{const oa=b.outsA==null?1:b.outsA;if(oa<=0)return;dp_link(x,[NW_H.cloud.x+90,NW_H.cloud.y-10],q,"coral",clamp(b.outs*1.5-i*0.06,0,1),{dash:[4,9],lw:1.8,alpha:oa*0.85,dot:false});
    if(b.cross>0)withA(x,b.cross*oa,()=>dp_cross(x,q[0],q[1],"coral",1));});
  if(b.allow){const aa=b.allowA==null?1:b.allowA;withA(x,aa,()=>{dp_link(x,[NW_H.cloud.x+110,NW_H.cloud.y+44],[ST.x+14,ST.y+10],"green",v("allow",0),{lw:3});
    dp_link(x,[NW_H.cloud.x+146,NW_H.cloud.y+4],NW_API,"green",v("allow",1),{lw:3});});}
  if(b.pl>0)dp_link(x,[R[2].x+R[2].w,g.y+g.h/2],[g.x,g.y+g.h/2],"cyan",b.pl,{lw:3,dot:false});
  if(b.link>0){const ly=nw_linkY(b.m);dp_link(x,[g.x+g.w,ly],[ST.x,ly],"cyan",b.link,{lw:b.linkW||3});}
  if(b.locs>0)for(let i=0;i<5;i++)dp_link(x,[g.x+g.w,g.y+30+i*24],[ST.x+20,ST.y+150+i*52],"cyan",clamp(b.locs*1.6-i*0.15,0,1),{lw:2.2,alpha:0.9});
  if(b.vkLine){dp_link(x,[NW_VK[0].x,NW_VK[0].y+48],[R[2].x+R[2].w,R[2].y+20],"cyan",v("vkLine",0),{lw:2.6});dp_link(x,[1675,NW_VK[1].y+96],[1675,ST.y],"cyan",v("vkLine",1),{lw:2.6});}
  R.forEach((r,i)=>{const a=v("rooms",i);if(a>0)nw_room(x,i,Object.assign({a,lit:b.roomLit?b.roomLit[i]:0},b.notes&&b.notes[i]||{}));});
  nw_cat(x,g,{a:b.tankA==null?1:b.tankA,lit:b.lit==null?0.6:b.lit,chips:b.chips,chipsA:b.chipsA});
  nw_store(x,{a:b.store==null?1:b.store,lit:b.storeLit,rows:b.rows,enc:b.enc,out:b.out});
  nw_cloud(x,t,{a:b.cloud||0});
  nw_vault(x,{a:b.vault||0});
  if(b.vk){if(v("vk",0)>0)dp_sealed(x,NW_VK[0].x,NW_VK[0].y,NW_VK[0].w,"workspace-prod",{a:v("vk",0)});if(v("vk",1)>0)dp_sealed(x,NW_VK[1].x,NW_VK[1].y,NW_VK[1].w,"storage-prod",{a:v("vk",1),revoked:b.vkRev||0});}
  if(b.admin&&b.admin.a>0){nw_adminDoor(x,b.admin.glow||0,b.admin.open||0,{a:b.admin.a});if(b.admin.lock>0)withA(x,b.admin.lock*b.admin.a,()=>dp_lock(x,1424,552,30,"coral",0));}
  [0,1,2].forEach(i=>nw_privDoor(x,i,v("priv",i)));
  nw_jobs(x,b.jobs||0);nw_build(x,b.build||0);}
