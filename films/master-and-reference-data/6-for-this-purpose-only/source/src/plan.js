/* ===== For this purpose only: the places and the pictures of today =====
   The places are painted once and kept (post.js): the plain and the village of the opening (past.js), the campus today, paper with a
   little sky for the chapters that explain, a second one for the industries, and the registrar's office. The pictures are the film's own:
   Owen and Jun; the appeal and its email; Linh's records, each with its values behind a door painted in its role's colour and its
   purposes on tags on the door; her wish, a note that moves from her alumni record to her; the list of purposes; the dbt and Unity
   Catalog cards; the table as the appeals team sees it; her request and its answer; and the shop's and the hospital's doors. Every name
   starts with m6_ or M6_. */

/* ---------- the places ---------- */
// today: the university's old building and its glass wing, a lawn, terraced houses across the street, a lamp (One person, many roles'
// campus, painted the same way)
const M6_LAWN=x=>664+5*Math.sin(x/300);
function m6_campus(ctx){const P=WCP;wc_sky(ctx,716,2,{sun:[1560,170]});
  wc_skyline(ctx,624,P.city,0.1,5);wc_treeRow(ctx,()=>640,-40,1980,58,70,0.24,21,P.leaf2);m6_land(ctx,M6_LAWN,P.lawn,0.42);
  wc_contact(ctx,140,770,668,0.46,0.22);wc_quad(ctx,150,668,0.46,0.62);wc_glassWing(ctx,762,668,150,170,0.48);
  [[1210,P.plaster],[1410,P.brickHouse,P.blueDoor],[1610,P.blueHouse],[1810,P.plaster]].forEach(([x,c,d])=>wc_terrace(ctx,x,742,232,c,0.56,{k:0.86,door:d}));
  wc_wash(ctx,[[1180,742],[W+60,742],[W+60,770],[1170,770]],P.hedge,{depth:0.6,kind:"hedge",lw:1.5});
  wc_roundTree(ctx,70,700,250,0.5);wc_roundTree(ctx,990,690,226,0.5,P.leaf2);wc_roundTree(ctx,1120,706,196,0.52);
  wc_wash(ctx,[[-60,782],[W+60,770],[W+60,H+60],[-60,H+60]],P.paving,{depth:0.72,kind:"ground",line:false,seed:71});
  wc_wash(ctx,wc_band(wc_smooth([[540,668],[560,720],[620,800],[740,900],[880,1090]],8),30,240),wc_lit(P.paving,0.08),{depth:0.62,kind:"path",line:false});
  ctx.save();ctx.strokeStyle=rgba(wc_dim(P.paving,0.14),0.55);ctx.lineWidth=2;for(let i=0;i<8;i++){const y=800+i*i*5;ctx.beginPath();ctx.moveTo(-20,y);ctx.lineTo(W+20,y-10);ctx.stroke();}
  for(let i=-10;i<24;i++){ctx.beginPath();ctx.moveTo(960+i*54,782);ctx.lineTo(960+i*190,1080);ctx.stroke();}ctx.restore();
  wc_lamp(ctx,1186,846,300,0.72);}
// paper, with a little sky and a strip of land, for the chapters that explain; a second, for the industries
function m6_plain(ctx){wc_sky(ctx,836,3,{clouds:3});m6_land(ctx,x=>826+16*Math.sin(x/320+1),WCP.far,0.35,{line:false});m6_land(ctx,x=>882+10*Math.sin(x/240),WCP.near,0.75,{line:false,seed:83});}
function m6_plainB(ctx){wc_sky(ctx,846,7,{clouds:4,cx:120,cw:1680});m6_land(ctx,x=>842+20*Math.sin(x/380+2),WCP.far,0.35,{line:false});m6_land(ctx,x=>898+12*Math.sin(x/260+1),WCP.near,0.75,{line:false,seed:83});}
// the registrar's office, where Mei works: a warm wall, a tall window onto the campus, a floor
function m6_office(ctx){const P=WCP;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,900),P.wallIn,{kind:"plaster",line:false,seed:71});wc_wash(ctx,wc_rect(-40,858,W+80,260),P.floor,{kind:"ground",line:false,seed:71});
  wc_wash(ctx,wc_rect(-40,846,W+80,18),wc_dim(P.wallIn,0.14),{kind:"trim",line:false,flat:true,seed:71});
  ctx.save();ctx.beginPath();ctx.rect(72,112,436,560);ctx.clip();wc_sky(ctx,560,4,{clouds:2,cx:80,cw:380,cy:150,ch:120});
  m6_land(ctx,x=>600+8*Math.sin(x/90),P.lawn,0.42,{line:false});wc_part(ctx,wc_rect(330,330,70,270),WCP.stone,0.4);wc_part(ctx,[[322,330],[408,330],[365,250]],WCP.slate,0.4);
  wc_roundTree(ctx,150,640,220,0.5);wc_roundTree(ctx,460,650,190,0.5,P.leaf2);ctx.restore();
  for(const r of [wc_rect(60,100,460,16),wc_rect(60,100,16,584),wc_rect(504,100,16,584),wc_rect(282,100,16,584),wc_rect(60,384,460,12)])wc_wash(ctx,r,WC_PAPER,{kind:"trim",lw:1.4});
  wc_wash(ctx,wc_rect(40,676,500,22),wc_dim(P.wallIn,0.1),{kind:"trim",lw:1.5});}
const WC_PLACES={ashram:m6_ashram,village:m6_village,campus:m6_campus,plain:m6_plain,plainB:m6_plainB,office:m6_office};
// a place, under the camera
function m6_place(ctx,key){ctx.drawImage(wc_place(key),0,0,W,H);}
// a veil of paper over the whole frame, so what's drawn after it stands out
function m6_hush(ctx,a){if(a<=0.01)return;ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle=rgba(WC_PAPER,a);ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);ctx.restore();}

/* ---------- the people ---------- */
// Owen runs Advancement's appeals: the business side, gold. Jun Park, the analytics engineer, as In the weeds of data crafting draws him:
// the technical side, cyan
PEOPLE.owen={name:"Owen Price",role:"Advancement",side:"Business",does:"uses",edge:BIZ,seed:23,
  skin:[214,172,138],hair:{style:"cropped",c:[70,52,40]},beard:[84,62,46],
  top:{kind:"blazer",c:[120,128,104],inner:[236,232,222]},bottom:{c:[58,60,70]},shoe:[60,44,36],build:{sh:76,hip:62,h:1.0}};
PEOPLE.jun={name:"Jun Park",role:"Analytics engineer",side:"Technical",does:"produces",edge:TECH,seed:10,
  skin:[226,186,150],hair:{style:"side",c:[24,22,26]},glasses:[40,44,54],
  top:{kind:"sweater",c:[62,120,112]},bottom:{c:[48,52,62]},shoe:[232,232,236],build:{sh:72,hip:58,h:0.99}};
// a person facing the other way when o.flip, so a pointing hand stays in the frame
function m6_person(ctx,id,x,y,s,o){if(!o.flip)return person(ctx,id,x,y,s,o);ctx.save();ctx.translate(x,0);ctx.scale(-1,1);person(ctx,id,0,y,s,o);ctx.restore();}
// Linh's roles, as bands on her white figure, in the series' order
const M6_BANDS=["student","tutor","researcher","alumna"];
const m6_bands=a=>M6_BANDS.map((r,i)=>({col:WC_ROLE[r],a:a[i]==null?1:a[i]}));
// the donor role's ink, darker than its wash, for words written in it
const M6_DONOR=WC_ROLE.donor,M6_DONORINK=[150,40,108];

/* ---------- a panel that grows or shrinks ---------- */
// a panel h tall that changes as it plays, up to hMax: the panel is kept once, hMax tall, and drawn as its top cut short and its bottom edge
// moved up to meet it, so a card that grows or shrinks never keeps a new picture for every height
function m6_panelH(ctx,x,y,w,h,hMax,o){h=Math.min(h,hMax);if(h>hMax-0.5){wc_panel(ctx,x,y,w,hMax,o);return;}const cut=y+h-28;
  ctx.save();ctx.beginPath();ctx.rect(x-10,y-10,w+20,cut-y+10);ctx.clip();wc_panel(ctx,x,y,w,hMax,o);ctx.restore();
  ctx.save();ctx.beginPath();ctx.rect(x-10,cut,w+20,38);ctx.clip();wc_panel(ctx,x,y-(hMax-h),w,hMax,o);ctx.restore();}

/* ---------- a role's record, with its door ---------- */
// Each role's values sit behind a door painted in its colour, hinged on its left; its purposes are tags on the door
const M6_RW=330,M6_RH=470,M6_DW=250,M6_DH=300;
// the door's leaf, kept once per colour: planks in the colour's wash, two battens and a handle
function m6_doorLeaf(col){return wc_kept("door6|"+col.join(","),(M6_DW+20)*2,(M6_DH+20)*2,q=>{q.scale(2,2);q.translate(10,10);const c=mix(col,WC_PAPER,0.3);
  wc_wash(q,wc_rect(0,0,M6_DW,M6_DH),c,{kind:"door",lw:1.6,seed:7});q.strokeStyle=rgba(wc_dim(col,0.4),0.35);q.lineWidth=1.6;
  for(let i=1;i<5;i++){q.beginPath();q.moveTo(M6_DW*i/5,6);q.lineTo(M6_DW*i/5,M6_DH-6);q.stroke();}
  for(const yy of [M6_DH*0.06,M6_DH*0.88])wc_wash(q,wc_rect(6,yy,M6_DW-12,14),wc_dim(c,0.12),{kind:"trim",lw:1.2,seed:yy|0});
  wc_wash(q,wc_ell(M6_DW-24,M6_DH*0.56,8,8,14),wc_dim(col,0.45),{kind:"thing",lw:1});});}
// a door with its top left at (x,y), opening inwards as p goes 0 to 1: drawn in strips, its far edge drawn back in perspective; sh shakes it
// on its latch; face(c) draws what's on it (its tags) on c, in the door's own units. Swinging, the door's face is painted on it as a picture,
// narrowed with it, and read again once the door is still
function m6_door(ctx,x,y,col,p,sh,face){const leaf=m6_doorLeaf(col),q=ease(clamp(p,0,1)),cw=Math.cos(q*1.45),vis=M6_DW*cw,n=16,dx=(sh||0)*4;if(vis<1)return;
  // shut, it's drawn whole; opening, its strips are put together first, so where they overlap never shows as lines when the door is faded
  if(q<0.005)ctx.drawImage(leaf,x+dx-10,y-10,M6_DW+20,M6_DH+20);
  else{const [b,bx]=wc_buf("door6",(M6_DW+20)*2,(M6_DH+20)*2);
    for(let i=0;i<n;i++){const u0=i/n,s=1-q*0.16*(u0+0.5/n);bx.drawImage(leaf,(10+M6_DW*u0)*2,0,(M6_DW/n)*2,(M6_DH+20)*2,(10+vis*u0)*2,(10-10*s+(1-s)*M6_DH*0.5)*2,(vis/n+0.6)*2,(M6_DH+20)*s*2);}
    ctx.drawImage(b,x+dx-10,y-10,M6_DW+20,M6_DH+20);}
  if(face&&cw>0.999){ctx.save();ctx.translate(x+dx,y);face(ctx);ctx.restore();}
  else if(face&&cw>0.25){const [b,bx]=wc_buf("door6face",(M6_DW+40)*2,(M6_DH+40)*2);bx.scale(2,2);bx.translate(20,20);face(bx);
    ctx.save();ctx.translate(x+dx,y);ctx.scale(cw,1);ctx.drawImage(b,-20,-20,M6_DW+40,M6_DH+40);ctx.restore();}
  if(q>0.01)withA(ctx,q*0.28,()=>{ctx.fillStyle=rgba([40,26,20],1);ctx.fillRect(x+dx,y,vis,M6_DH);});}
// the doorway's frame, kept once per colour
function m6_frame(col){return wc_kept("frame6|"+col.join(","),(M6_DW+60)*2,(M6_DH+40)*2,q=>{q.scale(2,2);q.translate(20,20);const c=wc_dim(mix(col,WC_PAPER,0.45),0.12);
  for(const r of [wc_rect(-14,-14,M6_DW+28,14),wc_rect(-14,0,14,M6_DH),wc_rect(M6_DW,0,14,M6_DH)])wc_wash(q,r,c,{kind:"trim",lw:1.3,seed:r[0][0]|0});});}
// a role's record: its card, the role's colour behind its title, and what it holds; behind its door, the values (o.vals); on the door, its
// purposes as tags (o.tags, each arriving at o.tt[i]); o.open opens the door, o.shake shakes it on its latch; o.col for a colour that isn't
// a role's. Returns where its door is
function m6_rec(ctx,t,x,y,role,title,what,o){o=o||{};const col=o.col||WC_ROLE[role],tW=tw(ctx,title,30,800),dx=x+(M6_RW-M6_DW)/2,dy=y+128;
  wc_panel(ctx,x,y,M6_RW,M6_RH,{kind:"card",role:col,sw:tW+36,seed:o.seed||title.length+3});wc_T(ctx,title,x+32,y+48,{w:800,size:30,col:WC_DARK});
  if(what)wc_T(ctx,what,x+32,y+94,{w:600,size:28,col:WC_MUTED});
  ctx.drawImage(m6_frame(col),dx-20,dy-20,M6_DW+60,M6_DH+40);
  const op=o.open||0;
  if(op>0.01){ctx.save();ctx.beginPath();ctx.rect(dx,dy,M6_DW,M6_DH);ctx.clip();ctx.fillStyle=rgba(mix(col,WC_PAPER,0.86),1);ctx.fillRect(dx,dy,M6_DW,M6_DH);
    const g=ctx.createLinearGradient(dx,dy,dx+M6_DW,dy);g.addColorStop(0,rgba(wc_dim(col,0.3),0.22));g.addColorStop(0.4,rgba(col,0));ctx.fillStyle=g;ctx.fillRect(dx,dy,M6_DW,M6_DH);
    (o.vals||[]).forEach((v,i)=>wc_T(ctx,v,dx+M6_DW/2+16,dy+92+i*50,{w:i?600:700,size:28,align:"center",col:i?WC_INK:WC_DARK,a:clamp((op-0.3)/0.5,0,1)}));ctx.restore();}
  const tags=o.tags||[];
  m6_door(ctx,dx,dy,col,op,o.shake||0,c=>tags.forEach((s,i)=>{const t0=(o.tt||[])[i];if(t0==null)return;
    arrive(c,M6_DW/2-10,64+i*54,t,t0,()=>wc_tag(c,M6_DW/2-10,64+i*54,s,{align:"center",size:28,w:700,wash:s==="fundraising"?M6_DONOR:null,washA:0.45}),{dy:-10,d:0.7});}));
  if(o.latch>0.01)m6_latch(ctx,dx,dy,o.latch);
  return{x:dx,y:dy,cx:dx+M6_DW/2,cy:dy+M6_DH/2,hx:dx+M6_DW-24,hy:dy+M6_DH*0.56};}
// a pencil ring as wc_ring draws one, but begun and closed at its lower left, so where its ends overlap never underlines the line above
function m6_ring(ctx,cx,cy,rx,ry,p,o){o=o||{};if(p<=0)return;const pts=[];for(let i=0;i<=60;i++){const u=i/60,a=2.0+u*TAU*1.08,r=1+0.05*Math.sin(u*9)+0.04*u;
    pts.push([cx+Math.cos(a)*rx*r,cy+Math.sin(a)*ry*r]);}
  wc_pencil(ctx,pts,p,{col:o.col||WC_PENCIL,lw:o.lw||3.4,a:o.a==null?0.92:o.a,seed:o.seed||9,amp:1.4});}
// a pencil latch from the door's handle, across its edge, to the gap beside its record, drawn on as p goes 0 to 1
function m6_latch(ctx,dx,dy,p){const y=dy+M6_DH*0.56,x0=dx+M6_DW-24,x1=dx+(M6_RW+M6_DW)/2+12;wc_pencil(ctx,[[x1,y],[x0,y]],p,{lw:5,col:WC_PENCIL,seed:dx|0,amp:0.6});
  if(p>0.95){ctx.save();ctx.fillStyle=rgba(WC_PENCIL,0.9);ctx.beginPath();ctx.arc(x1,y,6,0,TAU);ctx.fill();ctx.restore();}}
// a door's shake when something knocks and it stays shut: two small knocks from t0
const m6_shake=(t,t0)=>{const u=t-t0;return u<0||u>0.7?0:Math.sin(u*TAU*6)*Math.exp(-u*5);};
// a request: a slip washed in the colour of who asks, its edge dashed as a request's is, held up a little askew with a shadow under it, so it
// never reads as one of a door's own tags; returns its width
function m6_ask(ctx,x,y,s,col,o){o=o||{};const w=Math.round(tw(ctx,s,28,800)+60),h=58;ctx.save();ctx.translate(x,y);ctx.rotate(o.rot==null?-0.05:o.rot);
  ctx.shadowColor=rgba([40,30,50],0.3);ctx.shadowBlur=16;ctx.shadowOffsetY=7;wc_panel(ctx,-w/2,-h/2,w,h,{kind:"card",dashed:true,role:wc_dim(col,0.15),wash:col,washA:0.42,seed:s.length+11});
  ctx.shadowColor="transparent";ctx.shadowBlur=0;ctx.shadowOffsetY=0;wc_T(ctx,s,0,10,{w:800,size:28,align:"center",col:WC_DARK});ctx.restore();return w;}

/* ---------- Linh's wish ---------- */
// the note the alumni office pinned to her record: "no fundraising" and when; kept, its words drawn every frame
const M6_NW=268,M6_NH=104;
function m6_note(ctx,x,y,rot){const c=wc_kept("note6",(M6_NW+30)*2,(M6_NH+30)*2,q=>{q.scale(2,2);q.translate(15,15);wc_wash(q,[[0,4],[M6_NW-2,0],[M6_NW,M6_NH-2],[3,M6_NH]],[255,240,180],{kind:"paper",lw:1.5,seed:5});
    q.fillStyle=rgba([200,70,60],0.9);q.beginPath();q.arc(M6_NW/2,10,6,0,TAU);q.fill();});
  ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);ctx.drawImage(c,-M6_NW/2-15,-M6_NH/2-15,M6_NW+30,M6_NH+30);
  wc_T(ctx,"no fundraising",-M6_NW/2+22,-M6_NH/2+52,{w:700,size:28,col:WC_DARK});wc_T(ctx,"Dec 2022",-M6_NW/2+22,-M6_NH/2+90,{w:500,size:28,f:"mono",col:WC_MUTED});ctx.restore();}
// her wish on the person, opened into its fields: what she asked, for which purpose, when, to whom, how to change it; each written on as
// fa[i] goes 0 to 1
const M6_WISH={x:20,y:84,w:430,h:290};
function m6_wish(ctx,fa){const {x,y,w,h}=M6_WISH;wc_panel(ctx,x,y,w,h,{kind:"card",fill:[255,248,214],seed:12});
  ctx.fillStyle=rgba([200,70,60],0.9);ctx.beginPath();ctx.arc(x+w/2,y+12,6,0,TAU);ctx.fill();
  const f=i=>clamp(fa[i]||0,0,1);
  if(f(0)>0)wc_T(ctx,"no",x+30,y+70,{w:800,size:44,col:WC_DARK,a:f(0)});
  if(f(1)>0)withA(ctx,f(1),()=>wc_tag(ctx,x+100,y+56,"fundraising",{size:28,w:700,wash:M6_DONOR,washA:0.45}));
  if(f(2)>0)wc_T(ctx,typeOn("Dec 2022",f(2)),x+30,y+136,{w:500,size:28,f:"mono",col:WC_INK});
  if(f(3)>0)wc_T(ctx,typeOn("told the alumni office",f(3)),x+30,y+190,{w:600,size:28,col:WC_INK});
  if(f(4)>0)wc_T(ctx,typeOn("change it: her settings",f(4)),x+30,y+244,{w:600,size:28,col:WC_INK});}

/* ---------- 2. an appeal ---------- */
// the appeal: its title on a magenta stroke and what it's for; then the request it sends (o.req, typed on) and the list it gets (o.list)
const M6_AP={x:600,y:110,w:660,h:300};
function m6_appeal(ctx,o){o=o||{};const {x,y,w}=M6_AP,tW=tw(ctx,"Scholarship appeal",30,800);
  wc_panel(ctx,x,y,w,M6_AP.h,{kind:"card",role:M6_DONOR,sw:tW+36,seed:6});wc_T(ctx,"Scholarship appeal",x+32,y+48,{w:800,size:30,col:WC_DARK});
  wc_T(ctx,"health informatics",x+32,y+94,{w:600,size:28,col:WC_MUTED});
  if(o.req>0){const s="this year's top students",fw=Math.round(tw(ctx,s,28,700)+48);wc_panel(ctx,x+28,y+124,fw,62,{kind:"card",dashed:true,role:M6_DONOR,seed:9});
    wc_T(ctx,typeOn(s,o.req),x+52,y+166,{w:700,size:28,col:WC_DARK});}
  return m6_reqEnd(ctx);}
const m6_reqEnd=ctx=>[M6_AP.x+28+Math.round(tw(ctx,"this year's top students",28,700)+48),M6_AP.y+155];
// the student system's results, with an empty, dashed tag where a purpose would be
const M6_RS={x:1300,y:440,w:560,h:250};
function m6_results(ctx,o){o=o||{};const {x,y,w,h}=M6_RS,tW=tw(ctx,"Results",30,800);wc_panel(ctx,x,y,w,h,{kind:"card",role:WC_ROLE.student,sw:tW+36,seed:4});
  wc_T(ctx,"Results",x+32,y+48,{w:800,size:30,col:WC_DARK});wc_T(ctx,"student system",x+w-24,y+48,{w:600,size:28,col:WC_MUTED,align:"right"});
  ["HD","D","C"].forEach((g,i)=>{wc_T(ctx,"S-204"+(17+i*9),x+32,y+102+i*42,{w:500,size:28,f:"mono",col:WC_INK});wc_T(ctx,g,x+240,y+102+i*42,{w:500,size:28,f:"mono",col:WC_INK});});
  wc_panel(ctx,x+w-210,y+86,180,52,{kind:"tag",dashed:true,role:WC_PENCIL,seed:3});wc_T(ctx,"purpose",x+w-120,y+122,{w:600,size:28,col:WC_MUTED,align:"center",a:o.pa==null?0.8:o.pa});}
// the list the registry sends: "top students · 24", a chip in the student's colour
function m6_list(ctx,x,y){wc_chip(ctx,x-150,y-29,300,58,"student","top students",null,{seed:5});wc_T(ctx,"24",x+126,y+11,{w:800,size:30,f:"mono",align:"right",col:WC_DARK});}

/* ---------- 3. a wish left behind ---------- */
// the appeal's email: what it asks, who it's to (o.to, typed on as o.tp goes 0 to 1), who sent it, with an envelope
const M6_EM={w:600,h:196};
function m6_email(ctx,x,y,o){o=o||{};const tW=tw(ctx,"Give to the new scholarship",30,800);wc_panel(ctx,x,y,M6_EM.w,M6_EM.h,{kind:"card",role:M6_DONOR,sw:tW+36,seed:8});
  wc_T(ctx,"Give to the new scholarship",x+32,y+48,{w:800,size:30,col:WC_DARK});const to=o.to||"to: Linh Nguyen, student";
  wc_T(ctx,o.tp==null?to:typeOn(to,o.tp),x+32,y+100,{w:500,size:28,f:"mono",col:WC_INK});
  wc_T(ctx,"from: Advancement",x+32,y+150,{w:600,size:28,col:WC_MUTED});wc_envelope(ctx,x+M6_EM.w-64,y+142,0.56,-0.06);}
// her two records, as the systems hold them
const M6_R3={student:[1240,110,620,140],alumna:[1240,520,620,250]},M6_N3=[1600,690,-0.03];
function m6_rec3(ctx,k){const [x,y,w,h]=M6_R3[k];if(k==="student")wc_roleCard(ctx,x,y,w,h,"student","Student","S-20436",null,{note:"master's, from Jul 2025"});
  else wc_roleCard(ctx,x,y,w,h,"alumna","Alumna","S-17142",null,{note:"since 2022"});}

/* ---------- 4 and 5. what each role is for; wishes on the person ---------- */
// Linh as the person, and her four records in a row, as they're named
const M6_LP=[205,860,0.74],M6_RX=[470,825,1180,1535],M6_RY=110;
const M6_ROLES=[["student","Student","results",["teaching","awards"],["S-20436","results","P · C"]],
  ["alumna","Alumna","details",["news","events","fundraising"],["S-17142","class of 2022","email · address"]],
  ["tutor","Casual tutor","pay",["employment"],["E-4417","pay","bank details"]],
  ["researcher","Researcher","project data",["her project"],["R-3082","interviews","as she agreed"]]];
// the list every purpose comes from: its owner and its date, and the purposes
const M6_PL={x:470,y:680,w:1395,h:200},M6_PURP=["teaching","awards","news","events","fundraising","employment","her project"];
function m6_purposes(ctx,lit){const {x,y,w,h}=M6_PL;wc_panel(ctx,x,y,w,h,{kind:"card",seed:14});
  wc_T(ctx,"purposes",x+30,y+50,{w:800,size:30,col:WC_DARK});const pw=tw(ctx,"purposes",30,800);
  wc_T(ctx," · owner: privacy office · from Nov 2026",x+30+pw,y+50,{w:600,size:28,col:WC_MUTED});
  let cx=x+30;M6_PURP.forEach((s,i)=>{const tw0=Math.round(tw(ctx,s,28,700)+40);wc_tag(ctx,cx,y+140,s,{size:28,w:700,wash:s==="fundraising"?M6_DONOR:null,washA:0.45});
    if(lit&&lit[i]>0.01)wc_ring(ctx,cx+tw0/2,y+140,tw0/2+14,34,lit[i],{seed:i+3});cx+=tw0+16;});}
// where each record sits, and the door it opens
const m6_recAt=i=>[M6_RX[i],M6_RY];
// a pencil rail from x0 (the note on her), under the records, rising in the gap beside each one to its door's latch; drawn on as p goes
// 0 to 1, each rise as d[i] does
const M6_RAILY=632,m6_gap=i=>M6_RX[i]+M6_RW+12;
function m6_rail(ctx,x0,p,d){wc_pencil(ctx,[[x0,M6_RAILY],[m6_gap(3),M6_RAILY]],p,{lw:2.6,col:WC_PENCIL,seed:41,amp:0.8});
  M6_RX.forEach((x,i)=>{const q=d[i]||0;if(q<=0)return;wc_pencil(ctx,[[m6_gap(i),M6_RAILY],[m6_gap(i),M6_RY+128+M6_DH*0.56]],q,{lw:2.6,col:WC_PENCIL,seed:43+i,amp:0.8});});}

/* ---------- 6. written into the platform ---------- */
// a card of code: its header (what it is, in which tool), and its lines in mono, typed on as each line's p goes 0 to 1; lit lines get a
// wash behind them (o.lit[i], in o.litCol)
function m6_code(ctx,x,y,w,head,lines,ps,o){o=o||{};const lh=40,h=78+lines.length*lh+18;wc_panel(ctx,x,y,w,h,{kind:"card",seed:o.seed||lines.length});
  wc_T(ctx,head,x+28,y+46,{w:700,size:28,col:WC_MUTED});
  lines.forEach((s,i)=>{const p=ps[i]==null?1:ps[i];if(p<=0)return;const yy=y+92+i*lh;
    if(o.lit&&o.lit[i]>0.01){const ind=tw(ctx,s.slice(0,s.length-s.trimStart().length),28,500,"mono"),lx=x+30+ind-12,lw=Math.min(x+w-16-lx,tw(ctx,s.trim(),28,500,"mono")+24);
      withA(ctx,o.lit[i],()=>wc_panel(ctx,lx,yy-30,lw,42,{kind:"chip",role:o.litCol||WC_SIDE.tech,seed:i+5}));}
    wc_T(ctx,typeOn(s,p),x+30,yy,{w:500,size:28,f:"mono",col:WC_DARK});});return h;}
// dbt's YAML for the student system's results, the columns and their purposes
const M6_YAML=["- name: stg_student_system__results","  columns:","    - name: student_bk","      config:","        meta: {personal_data: direct}",
  "      databricks_tags: {purpose: teaching}","    - name: grade","      databricks_tags: {purpose: teaching}"];
// the two policies, in Unity Catalog's SQL
const M6_POLA=["CREATE POLICY hide_teaching","ON CATALOG university","COLUMN MASK hidden","TO `appeals` FOR TABLES","MATCH COLUMNS has_tag_value(","  'purpose', 'teaching') AS c","ON COLUMN c"];
const M6_POLB=["CREATE POLICY honour_wishes","ON CATALOG university","ROW FILTER no_wish_against","TO `appeals` FOR TABLES","MATCH COLUMNS has_tag_value(","  'key', 'person') AS p","USING COLUMNS (p, 'fundraising')"];
// the test: what it checks, and how it came out (o.fail, o.pass, 0 to 1)
function m6_test(ctx,x,y,o){o=o||{};const w=630,h=232;wc_panel(ctx,x,y,w,h,{kind:"card",seed:16});wc_T(ctx,"dbt test",x+28,y+46,{w:700,size:28,col:WC_MUTED});
  wc_T(ctx,"personal_data_has_a_purpose",x+30,y+98,{w:500,size:28,f:"mono",col:WC_DARK});
  const f=o.fail||0,p=o.pass||0;
  if(f>0&&p<0.5)withA(ctx,1-clamp(p*2,0,1),()=>{wc_cross(ctx,x+50,y+160,30,WC_NO,clamp(f/0.4,0,1));wc_T(ctx,typeOn("1 column with no purpose",clamp((f-0.3)/0.7,0,1)),x+80,y+170,{w:700,size:28,col:WC_NO});
    wc_T(ctx,typeOn("student_bk",clamp((f-0.5)/0.5,0,1)),x+80,y+212,{w:500,size:28,f:"mono",col:WC_NO});});
  if(p>0.5)withA(ctx,clamp(p*2-1,0,1),()=>{wc_tick(ctx,x+50,y+160,30,WC_ROLEINK.alumna,clamp(p*2-1,0,1),4);wc_T(ctx,"passed",x+80,y+170,{w:700,size:28,col:WC_ROLEINK.alumna});});}
// alumni with their final grades, as the appeals team sees them: names and the emails they gave the alumni office; the grades, tagged
// for teaching, hidden (o.mask); and the rows of anyone whose wishes say no struck through, faded and closed up (o.gone)
const M6_TB={x:440,y:470,w:1440},M6_ROWS=[["Sofia Marin","sofia.marin@mail.example","HD",0],["Daniel Osei","d.osei@mail.example","D",0],
  ["Thi Linh Nguyen","linh.nguyen2001@mail.example","C",1],["Anika Rao","anika.r@mail.example","HD",0],["Leo Becker","leo.becker@mail.example","D",1]];
function m6_table(ctx,o){o=o||{};const {x,y,w}=M6_TB,rh=50,gone=o.gone||0,mask=o.mask||0;
  // rows close up as the struck ones leave
  const ys=[];let yy=y+144;M6_ROWS.forEach(r=>{ys.push(yy);yy+=rh*(r[3]?1-ease(clamp((gone-0.62)/0.38,0,1)):1);});
  const h=Math.round(yy-y+12),hMax=144+M6_ROWS.length*rh+12;m6_panelH(ctx,x,y,w,Math.max(160,h),hMax,{kind:"card",seed:18});
  wc_T(ctx,"alumni, as the appeals team sees them",x+30,y+48,{w:700,size:28,col:WC_MUTED});
  const C=[x+30,x+380,x+1140];["name","email","final grade"].forEach((s,i)=>wc_T(ctx,s,C[i],y+98,{w:800,size:28,col:WC_DARK}));
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.35);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+24,y+114);ctx.lineTo(x+w-24,y+114);ctx.stroke();ctx.restore();
  if(mask>0.01)withA(ctx,mask,()=>m6_panelH(ctx,C[2]-18,y+124,250,Math.max(60,yy-y-130),hMax-142,{kind:"card",dashed:true,role:WC_SIDE.tech,wash:WC_SIDE.tech,washA:0.16,seed:21}));
  M6_ROWS.forEach((r,i)=>{const a=r[3]?1-clamp((gone-0.4)/0.22,0,1):1;if(a<=0.01)return;withA(ctx,a,()=>{const ry=ys[i]+34;
    wc_T(ctx,r[0],C[0],ry,{w:600,size:28,col:WC_INK});wc_T(ctx,r[1],C[1],ry,{w:500,size:28,f:"mono",col:WC_INK});
    if(mask<1)wc_T(ctx,r[2],C[2],ry,{w:500,size:28,f:"mono",col:WC_INK,a:1-mask});
    if(mask>0)wc_T(ctx,"hidden",C[2],ry,{w:600,size:28,col:WC_MUTED,a:mask});
    if(r[3]&&gone>0){const sw=Math.min(1,gone/0.36);ctx.save();ctx.strokeStyle=rgba(WC_NO,0.9);ctx.lineWidth=3.4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(C[0]-8,ry-10);ctx.lineTo(lerp(C[0]-8,x+w-40,sw),ry-10);ctx.stroke();ctx.restore();}});});
  return h;}
// the tables that carry the tags, each lit as the policies reach it
const M6_TBLS=["results","enrolments","assessments"];

/* ---------- 7. the appeal, again ---------- */
// the appeal's count, its card growing a row at a time as each p goes 0 to 1: selected (p1, counting up), those who said no taken off
// (p2), and who it will ask (p3)
const M6_AC={x:110,y:100,w:640,h:330};
function m6_count(ctx,p1,p2,p3){const {x,y,w,h}=M6_AC,tW=tw(ctx,"Scholarship appeal",30,800),g=p=>ease(clamp(p,0,1));
  m6_panelH(ctx,x,y,w,92+64*g(p1*5)+64*g(p2*2)+110*g(p3*2),h,{kind:"card",role:M6_DONOR,sw:tW+36,seed:6});
  wc_T(ctx,"Scholarship appeal",x+32,y+48,{w:800,size:30,col:WC_DARK});wc_T(ctx,"to alumni",x+w-24,y+48,{w:600,size:28,col:WC_MUTED,align:"right"});
  const n=Math.round(2140*ease(clamp(p1,0,1)));
  if(p1>0.12)withA(ctx,clamp((p1*5-0.6)/0.4,0,1),()=>{wc_T(ctx,"alumni selected",x+32,y+120,{w:600,size:30,col:WC_INK});
    wc_T(ctx,n.toLocaleString("en-GB"),x+w-32,y+120,{w:500,size:34,f:"mono",col:WC_DARK,align:"right"});});
  if(p2>0.5)withA(ctx,clamp(p2*2-1,0,1),()=>{wc_T(ctx,"said no",x+32,y+184,{w:600,size:30,col:WC_NO});wc_T(ctx,"− 37",x+w-32,y+184,{w:500,size:34,f:"mono",col:WC_NO,align:"right"});});
  if(p3>0.5)withA(ctx,clamp(p3*2-1,0,1),()=>{ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.6);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(x+28,y+216);ctx.lineTo(x+w-28,y+216);ctx.stroke();ctx.restore();
    wc_T(ctx,"to ask",x+32,y+272,{w:800,size:30,col:WC_DARK});wc_T(ctx,"2,103",x+w-32,y+272,{w:800,size:40,f:"mono",col:WC_DARK,align:"right"});});}
// the list it was going to send, the alumni the platform showed: Linh's line, and Leo's, struck through in red ink, each with the note that
// took it off
const M6_AL={x:110,y:460,w:640},M6_ANAMES=[["Sofia Marin",0],["Daniel Osei",0],["Thi Linh Nguyen",1],["Anika Rao",0],["Leo Becker",1]];
function m6_alist(ctx,st){const {x,y,w}=M6_AL,h=78+M6_ANAMES.length*50;wc_panel(ctx,x,y,w,h,{kind:"card",seed:19});wc_T(ctx,"alumni selected",x+30,y+46,{w:700,size:28,col:WC_MUTED});
  M6_ANAMES.forEach(([nm,no],i)=>{const yy=y+100+i*50;wc_T(ctx,nm,x+30,yy,{w:600,size:28,col:no&&st>0.5?WC_MUTED:WC_INK});
    if(no&&st>0){const nw=tw(ctx,nm,28,600),p=clamp(st*1.6-(i===2?0.2:0),0,1);ctx.save();ctx.strokeStyle=rgba(WC_NO,0.9);ctx.lineWidth=3.4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x+24,yy-10);ctx.lineTo(x+24+(nw+16)*p,yy-10);ctx.stroke();ctx.restore();
      if(p>0.6)withA(ctx,clamp((p-0.6)/0.4,0,1),()=>wc_tag(ctx,x+w-24,yy-10,"no fundraising",{align:"right",size:28,w:600,wash:[255,236,160],washA:0.7}));}});return h;}

/* ---------- 8. what do you hold about me? ---------- */
// her request, as it arrives: what she asks, and the date
const M6_RQW=620;
function m6_request(ctx,x,y){const w=M6_RQW,h=118;wc_panel(ctx,x,y,w,h,{kind:"card",fill:[255,250,236],seed:22});wc_T(ctx,"What do you hold about me?",x+30,y+50,{w:800,size:30,col:WC_DARK});
  wc_T(ctx,"3 Dec",x+w-24,y+50,{w:500,size:28,f:"mono",align:"right",col:WC_MUTED});wc_T(ctx,"from Linh Nguyen",x+30,y+94,{w:600,size:28,col:WC_MUTED});}
// an office searching its own system: dimmed, with a magnifying glass that circles as it searches
function m6_search(ctx,x,y,name,t){const w=330,h=92;wc_panel(ctx,x,y,w,h,{kind:"card",seed:name.length+24});wc_T(ctx,name,x+28,y+56,{w:700,size:28,col:WC_INK});
  const a=t*2.4,mx=x+w-48+Math.cos(a)*7,my=y+44+Math.sin(a)*6;ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.85);ctx.lineWidth=3.6;ctx.lineCap="round";ctx.beginPath();ctx.arc(mx,my,13,0,TAU);
  ctx.moveTo(mx+9,my+9);ctx.lineTo(mx+22,my+22);ctx.stroke();ctx.restore();}
// her five records, in a column: role, key, and the office that keeps it
const M6_R8X=760,M6_R8W=460,M6_R8=[["student","Student","S-17142","registrar's office"],["student","Student","S-20436","registrar's office"],["alumna","Alumna","S-17142","alumni office"],
  ["tutor","Casual tutor","E-4417","HR"],["researcher","Researcher","R-3082","research office"]];
const m6_r8y=i=>232+i*122;
function m6_rec8(ctx,i,o){o=o||{};const [r,title,id,office]=M6_R8[i];wc_roleCard(ctx,M6_R8X,m6_r8y(i),M6_R8W,104,r,title,id,null,{note:office,seed:i+30});}
// the answer: what the university holds about her, a section per role: its values, where they came from (a tag in the source's colour),
// and what they're for
const M6_ANS={x:1262,y:96,w:618},M6_AROWS=[["student","Student","name, results","registrar's office","teaching and awards"],["alumna","Alumna","address, email","alumni office","news, events"],
  ["tutor","Casual tutor","bank details, pay","HR","employment"],["researcher","Researcher","interviews","research office","her project"]];
function m6_answer(ctx,ps){const {x,y,w}=M6_ANS,h=116+M6_AROWS.length*162;wc_panel(ctx,x,y,w,h,{kind:"sheet",seed:26});wc_T(ctx,"What we hold about you",x+30,y+56,{w:800,size:34,col:WC_DARK});
  M6_AROWS.forEach(([r,title,vals,src,purp],i)=>{const p=ps[i]||0;if(p<=0)return;const yy=y+112+i*162;withA(ctx,clamp(p*2,0,1),()=>{
    ctx.fillStyle=rgba(WC_ROLE[r],1);ctx.beginPath();ctx.arc(x+40,yy,9,0,TAU);ctx.fill();wc_T(ctx,title,x+60,yy+10,{w:800,size:30,col:WC_DARK});
    wc_T(ctx,typeOn(vals,clamp(p*1.6-0.2,0,1)),x+60,yy+56,{w:600,size:28,col:WC_INK});
    if(p>0.5)withA(ctx,clamp((p-0.5)*2,0,1),()=>{wc_tag(ctx,x+w-24,yy,src,{align:"right",size:28,w:600,wash:WC_ROLE[r],washA:0.35});wc_T(ctx,"for "+purp,x+60,yy+102,{w:600,size:28,col:WC_MUTED});});});});
  return h;}
// where a value of the answer sits, for the correction's arrow
const m6_ansAt=i=>[M6_ANS.x+60,M6_ANS.y+112+i*162+56];
// what each role keeps if she asks to be forgotten, beside its record
const M6_KX=1262,M6_KEEP=["degree · kept for good","enrolment · while she studies","her no · so it still holds","pay · as the law requires","project data · kept as its rules require"];

/* ---------- 9. elsewhere ---------- */
// who asks: a card with its name washed in the asker's colour, and what it's asking for
function m6_asker(ctx,x,y,title,what,col){const tW=tw(ctx,title,30,800);wc_panel(ctx,x,y,M6_RW,130,{kind:"card",role:col,sw:tW+36,seed:title.length+7});
  wc_T(ctx,title,x+32,y+48,{w:800,size:30,col:WC_DARK});wc_T(ctx,what,x+32,y+94,{w:600,size:28,col:WC_MUTED});}
// a panel for an industry, with its name on a chip in the industry's colour
const M6_PAN=[[60,"retail","a shop"],[1000,"health","a hospital"]],M6_PY=96,M6_PW=860,M6_PH=720;
function m6_panel(ctx,i){const [x,ind,title]=M6_PAN[i];wc_panel(ctx,x,M6_PY,M6_PW,M6_PH,{kind:"card",seed:40+i});
  const w=Math.round(tw(ctx,title,30,800)+56);wc_chip(ctx,x+30,M6_PY+26,w,58,WC_IND[ind],title,null,{seed:title.length});}
