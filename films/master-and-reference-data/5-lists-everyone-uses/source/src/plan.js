/* ===== Lists everyone uses: the places and the pictures =====
   The places are painted once and kept (post.js): an airport terminal with its tall window onto the runway, the campus today, the
   paper with a little sky and land for the chapters that explain, a second one for the industries, and the data team's office. The
   pictures are the film's own things: two suitcases and their bag tags, a plane on the runway; the records each system keeps of
   Linh's job, an email with the role list attached, her identifiers; the status codes and the file that maps them, the tests that
   type the statuses again, her country three ways and the count that splits it; a list as a card with a yellow tab, its codes in
   type and its labels in words, and the five lists that get a home; the tests that read a list, and the platform's lineage; a pull
   request and her tutor role across the years; the international standard's countries; a form that asks about people; a bank's
   and a hospital's lists. Every name starts with m5_ (this film) or M5_. */

/* ---------- the places ---------- */
// the terminal: the runway seen through a tall window, its mullions, and the floor the bags stand on
const M5_SILL=764;
function m5_terminal(ctx){const P=WCP;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  ctx.save();ctx.beginPath();ctx.rect(0,0,W,M5_SILL);ctx.clip();
  wc_sky(ctx,580,6,{clouds:4,cy:110,ch:220,cx:120,cw:1700,sun:[1540,180]});
  wc_forest(ctx,x=>556+10*Math.sin(x/230)+5*Math.sin(x/70),P.farForest,0.08,13,{h:24,w:16});
  wc_land(ctx,x=>568+6*Math.sin(x/300),P.far,0.24,{line:false});wc_fieldStrips(ctx,x=>568+6*Math.sin(x/300),4,34,3,[P.far,P.field],0.26,4);
  // the control tower, far off on the left: a shaft and its glass cab
  wc_part(ctx,wc_rect(214,452,30,130),P.concrete,0.3);wc_part(ctx,[[196,452],[262,452],[272,420],[186,420]],P.glass,0.3,{kind:"glass"});
  wc_part(ctx,[[190,420],[268,420],[256,404],[202,404]],P.slate,0.3);
  // a hangar, low and long, on the far side of the field
  wc_part(ctx,[[1660,590],[1660,546],[1720,528],[1840,528],[1900,546],[1900,590]],P.stoneGrey,0.3);
  // the runway: a long pale band, its centre line dashed
  wc_wash(ctx,[[-60,612],[W+60,600],[W+60,640],[-60,656]],[214,212,206],{depth:0.5,kind:"road",line:false});
  ctx.save();ctx.strokeStyle=rgba(WC_PAPER,0.95);ctx.lineWidth=4;ctx.setLineDash([54,46]);ctx.beginPath();ctx.moveTo(-60,632);ctx.lineTo(W+60,618);ctx.stroke();ctx.restore();
  wc_land(ctx,x=>672+8*Math.sin(x/260+1),P.mid,0.52,{line:false});wc_land(ctx,x=>716+6*Math.sin(x/200),P.near,0.62,{line:false});
  ctx.restore();
  // the floor, a warm stone, with its joints running away from us
  wc_wash(ctx,wc_rect(-40,M5_SILL,W+80,H-M5_SILL+40),[226,218,204],{kind:"ground",line:false});
  ctx.save();ctx.strokeStyle=rgba([180,170,156],0.42);ctx.lineWidth=2;for(let i=0;i<6;i++){const y=M5_SILL+24+i*i*9;ctx.beginPath();ctx.moveTo(-20,y);ctx.lineTo(W+20,y);ctx.stroke();}
  for(let i=-12;i<26;i++){ctx.beginPath();ctx.moveTo(960+i*60,M5_SILL);ctx.lineTo(960+i*190,H);ctx.stroke();}ctx.restore();}
// the window's frame, kept on its own so the plane passes behind it: a transom, the mullions, the sill
function m5_termFrame(ctx){ctx.drawImage(wc_kept("termFrame",W,H,q=>{wc_wash(q,wc_rect(-40,0,W+80,26),[214,214,218],{kind:"trim",lw:1.4});
  for(let x=0;x<=W;x+=320)wc_wash(q,wc_rect(x-9,0,18,M5_SILL),[214,214,218],{kind:"trim",lw:1.4,seed:x});
  wc_wash(q,wc_rect(-40,M5_SILL-14,W+80,22),[204,204,210],{kind:"trim",lw:1.5});}),0,0,W,H);}
// today: the university's old building and its glass wing, a lawn, terraced houses across the street, a lamp (as film 1 paints it)
const M5_LAWN=x=>664+5*Math.sin(x/300);
function m5_campus(ctx){const P=WCP;wc_sky(ctx,716,2,{sun:[1560,170]});
  wc_skyline(ctx,624,P.city,0.1,5);wc_treeRow(ctx,()=>640,-40,1980,58,70,0.24,21,P.leaf2);wc_land(ctx,M5_LAWN,P.lawn,0.42);
  wc_contact(ctx,140,770,668,0.46,0.22);wc_quad(ctx,150,668,0.46,0.62);wc_glassWing(ctx,762,668,150,170,0.48);
  [[1210,P.plaster],[1410,P.brickHouse,P.blueDoor],[1610,P.blueHouse],[1810,P.plaster]].forEach(([x,c,d])=>wc_terrace(ctx,x,742,232,c,0.56,{k:0.86,door:d}));
  wc_wash(ctx,[[1180,742],[W+60,742],[W+60,770],[1170,770]],P.hedge,{depth:0.6,kind:"hedge",lw:1.5});
  wc_roundTree(ctx,70,700,250,0.5);wc_roundTree(ctx,990,690,226,0.5,P.leaf2);wc_roundTree(ctx,1120,706,196,0.52);
  wc_wash(ctx,[[-60,782],[W+60,770],[W+60,H+60],[-60,H+60]],P.paving,{depth:0.72,kind:"ground",line:false});
  wc_wash(ctx,wc_band(wc_smooth([[540,668],[560,720],[620,800],[740,900],[880,1090]],8),30,240),wc_lit(P.paving,0.08),{depth:0.62,kind:"path",line:false});
  ctx.save();ctx.strokeStyle=rgba(wc_dim(P.paving,0.14),0.55);ctx.lineWidth=2;for(let i=0;i<8;i++){const y=800+i*i*5;ctx.beginPath();ctx.moveTo(-20,y);ctx.lineTo(W+20,y-10);ctx.stroke();}
  for(let i=-10;i<24;i++){ctx.beginPath();ctx.moveTo(960+i*54,782);ctx.lineTo(960+i*190,1080);ctx.stroke();}ctx.restore();
  wc_lamp(ctx,1186,846,300,0.72);}
// paper, with a little sky and a strip of land, for the chapters that explain; a second, for the industries
function m5_plain(ctx){wc_sky(ctx,836,3,{clouds:3});wc_land(ctx,x=>826+16*Math.sin(x/320+1),WCP.far,0.35,{line:false});wc_land(ctx,x=>882+10*Math.sin(x/240),WCP.near,0.75,{line:false});}
function m5_plainB(ctx){wc_sky(ctx,846,7,{clouds:4,cx:120,cw:1680});wc_land(ctx,x=>842+20*Math.sin(x/380+2),WCP.far,0.35,{line:false});wc_land(ctx,x=>898+12*Math.sin(x/260+1),WCP.near,0.75,{line:false});}
// the data team's office: a warm wall, a tall window onto the campus, a floor (the room Noor works in)
function m5_office(ctx){const P=WCP;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,900),P.wallIn,{kind:"plaster",line:false});wc_wash(ctx,wc_rect(-40,858,W+80,260),P.floor,{kind:"ground",line:false});
  wc_wash(ctx,wc_rect(-40,846,W+80,18),wc_dim(P.wallIn,0.14),{kind:"trim",line:false,flat:true});
  ctx.save();ctx.beginPath();ctx.rect(72,112,436,560);ctx.clip();wc_sky(ctx,560,4,{clouds:2,cx:80,cw:380,cy:150,ch:120});
  wc_land(ctx,x=>600+8*Math.sin(x/90),P.lawn,0.42,{line:false});wc_part(ctx,wc_rect(330,330,70,270),WCP.stone,0.4);wc_part(ctx,[[322,330],[408,330],[365,250]],WCP.slate,0.4);
  wc_roundTree(ctx,150,640,220,0.5);wc_roundTree(ctx,460,650,190,0.5,P.leaf2);ctx.restore();
  for(const r of [wc_rect(60,100,460,16),wc_rect(60,100,16,584),wc_rect(504,100,16,584),wc_rect(282,100,16,584),wc_rect(60,384,460,12)])wc_wash(ctx,r,WC_PAPER,{kind:"trim",lw:1.4});
  wc_wash(ctx,wc_rect(40,676,500,22),wc_dim(P.wallIn,0.1),{kind:"trim",lw:1.5});}
const WC_PLACES={terminal:m5_terminal,campus:m5_campus,plain:m5_plain,plainB:m5_plainB,office:m5_office};
// a place, under the camera
function m5_place(ctx,key){ctx.drawImage(wc_place(key),0,0,W,H);}

/* ---------- small things every chapter uses ---------- */
// a veil of paper over the whole frame, so the one thing drawn after it stands out
function m5_hush(ctx,a){if(a<=0.01)return;ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle=rgba(WC_PAPER,a);ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);ctx.restore();}
// a person facing the other way when o.flip: someone who points at what's on their left, so the hand stays in the frame
function m5_person(ctx,id,x,y,s,o){if(!o.flip)return person(ctx,id,x,y,s,o);ctx.save();ctx.translate(x,0);ctx.scale(-1,1);person(ctx,id,0,y,s,o);ctx.restore();}
// pencil writing that writes itself from t0 over d seconds
function m5_note(ctx,t,s,x,y,t0,d,o){o=o||{};const p=clamp((t-t0)/d,0,1);if(p>0)wc_hand(ctx,s,x,y,{p,size:o.size||34,w:o.w||700,col:o.col||WC_INK,align:o.align});}
// a name card: a name, and what they do
function m5_name(ctx,x,y,name,role,o){o=o||{};const w=Math.round(Math.max(tw(ctx,name,32,800),tw(ctx,role,28,600))+60);wc_panel(ctx,x,y,w,108,{kind:"card",seed:name.length});
  wc_T(ctx,name,x+30,y+46,{w:800,size:32,col:WC_DARK});wc_T(ctx,role,x+30,y+86,{w:600,size:28,col:WC_MUTED});return w;}
// a pencil arrow from one point to another, drawn on as p goes 0 to 1
function m5_arrow(ctx,x0,y0,x1,y1,p,o){o=o||{};if(p<=0)return;const ex=lerp(x0,x1,ease(clamp(p,0,1))),ey=lerp(y0,y1,ease(clamp(p,0,1))),an=Math.atan2(y1-y0,x1-x0);ctx.save();
  ctx.strokeStyle=rgba(o.col||WC_PENCIL,o.a==null?0.85:o.a);ctx.fillStyle=ctx.strokeStyle;ctx.lineWidth=o.lw||3;ctx.lineCap="round";if(o.dash)ctx.setLineDash(o.dash);ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(ex,ey);ctx.stroke();ctx.setLineDash([]);
  if(p>=0.98){ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x1-16*Math.cos(an-0.45),y1-16*Math.sin(an-0.45));ctx.lineTo(x1-16*Math.cos(an+0.45),y1-16*Math.sin(an+0.45));ctx.closePath();ctx.fill();}ctx.restore();}
// a chip of colour behind a word: a value lit; returns its width
function m5_lit(ctx,x,y,s,col,o){o=o||{};const size=o.size||30,wt=o.w||800,w=Math.round(tw(ctx,s,size,wt,o.f)+(o.pad||36)),h=o.h||Math.round(size+20);
  wc_panel(ctx,x,y-h/2,w,h,{kind:"chip",role:col,dashed:o.dashed,seed:o.seed||s.length});wc_T(ctx,s,x+w/2,y+size*0.36,{w:wt,size,f:o.f,align:"center",col:WC_DARK});return w;}

/* ---------- 1. airport codes ---------- */
// a suitcase standing on the floor, its bottom at (x,y): a body with two ribs, a handle on top, two wheels; kept. Returns where its
// handle's right post meets the bar, for the tag's string
const M5_CASE_A=[620,1004,360,600,[86,102,134]],M5_CASE_B=[1300,1004,340,560,[132,108,88]];
function m5_case(ctx,c){const [x,y,w,h,col]=c,k=wc_kept("case"+w+"x"+h,w+80,h+90,q=>{q.translate(40,60);
    wc_wash(q,wc_rect(w*0.36,-46,10,52),[70,72,82],{kind:"iron",lw:1});wc_wash(q,wc_rect(w*0.64-10,-46,10,52),[70,72,82],{kind:"iron",lw:1});
    wc_wash(q,wc_rrPts(w*0.33,-58,w*0.34,18,8),[60,62,72],{kind:"iron",lw:1.3});
    wc_wash(q,wc_rrPts(0,0,w,h-22,30),col,{kind:"build",lw:2});
    q.save();q.strokeStyle=rgba(wc_dim(col,0.3),0.5);q.lineWidth=4;q.lineCap="round";for(const fx of [0.3,0.7]){q.beginPath();q.moveTo(w*fx,26);q.lineTo(w*fx,h-48);q.stroke();}q.restore();
    for(const wx of [40,w-40])wc_wash(q,wc_ell(wx,h-14,16,16,18),[52,52,60],{kind:"iron",lw:1});});
  wc_contact(ctx,x-w/2,x+w/2,y-6,0.9,0.3);ctx.drawImage(k,x-w/2-40,y-h-60);return[x+w*0.14,y-h-50];}
// a bag tag, hanging on its string from (ax,ay): a strip of card, tapered at the top round a hole, the code on a band of the lists'
// yellow, the city under it, and a barcode; it swings in on arrival (t0) and settles, then sways a little. The text is drawn live
const M5_TAGW=270,M5_TAGH=430;
function m5_tagPaper(){return wc_kept("tagPaper",(M5_TAGW+40)*2,(M5_TAGH+40)*2,q=>{q.scale(2,2);q.translate(20,20);const w=M5_TAGW,h=M5_TAGH;
  const pts=[[w*0.3,0],[w*0.7,0],[w,56],[w,h-14],[w-14,h],[14,h],[0,h-14],[0,56]];wc_wash(q,pts,WC_CARD,{kind:"paper",lw:1.6,seed:3});
  wc_wash(q,wc_resample(wc_rect(14,78,w-28,150),10),WC_BADGE,{kind:"swatch",line:false,a:0.62,seed:7});
  q.save();q.fillStyle=rgba(WC_INK,0.82);const R=wc_rng(11);let bx=34;while(bx<w-34){const bw=1.5+R()*4.5;q.fillRect(bx,312,bw,82);bx+=bw+1.5+R()*4;}q.restore();
  q.beginPath();q.arc(w/2,30,13,0,TAU);q.fillStyle=rgba([228,222,210],1);q.fill();q.lineWidth=2.4;q.strokeStyle=rgba(WC_PENCIL,0.7);q.stroke();
  q.beginPath();q.arc(w/2,30,7,0,TAU);q.fillStyle=rgba([150,144,134],1);q.fill();});}
function m5_tag(ctx,t,ax,ay,code,city,t0,o){o=o||{};const p=t-t0;if(p<=0)return;const a=clamp(p*2.2,0,1)*(o.a==null?1:o.a);if(a<=0.01)return;
  const sw=0.34*Math.exp(-p*1.6)*Math.cos(p*5.2+0.3)+0.018*Math.sin(t*1.1+ax*0.01),drop=(1-spring(p/0.9))*-40,L=o.len||34;
  withA(ctx,a,()=>{ctx.save();ctx.translate(ax,ay+drop);ctx.rotate(sw);
    ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.8);ctx.lineWidth=2.2;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-6,0);ctx.lineTo(-3,L+16);ctx.moveTo(6,0);ctx.lineTo(3,L+16);ctx.stroke();ctx.restore();
    ctx.translate(-M5_TAGW/2,L);ctx.drawImage(m5_tagPaper(),-20,-20,M5_TAGW+40,M5_TAGH+40);
    wc_T(ctx,code,M5_TAGW/2,200,{f:"mono",w:500,size:112,align:"center",col:WC_DARK});
    const cs=Math.max(28,Math.min(32,32*(M5_TAGW-40)/tw(ctx,city,32,800)));wc_T(ctx,city,M5_TAGW/2,276,{w:800,size:cs,align:"center",col:WC_INK,deco:o.deco});
    if(o.ring>0)wc_ring(ctx,M5_TAGW/2+(o.ringDx||0),164,o.ringRx||70,56,o.ring,{seed:o.seed||13,col:o.ringCol});
    ctx.restore();});}
// a plane on the runway, seen from the side, nose to the right: a white fuselage, a fin, a wing and an engine; kept
function m5_plane(ctx,x,y,s,a){if(a<=0.01)return;const c=wc_kept("plane",760,260,q=>{q.scale(2,2);q.translate(10,10);const body=[[20,56],[60,50],[300,48],[330,52],[350,62],[340,72],[300,78],[60,78],[30,72]];
    wc_wash(q,[[34,54],[54,10],[78,10],[98,52]],[236,236,240],{kind:"build",lw:1});wc_wash(q,body,[244,244,246],{kind:"build",lw:1.2});
    wc_wash(q,[[150,70],[230,70],[196,104],[170,104]],[226,226,232],{kind:"build",lw:1});wc_wash(q,wc_rrPts(176,86,44,18,8),[200,202,210],{kind:"build",lw:1});
    q.fillStyle=rgba([96,110,140],0.75);for(let i=0;i<16;i++){q.beginPath();q.arc(100+i*13,60,2.4,0,TAU);q.fill();}
    wc_wash(q,[[316,56],[334,56],[344,63],[330,63]],[110,126,156],{kind:"window",line:false,flat:true});});
  withA(ctx,a,()=>ctx.drawImage(c,x-180*s,y-60*s,380*s,130*s));}
// what reads the code: airlines, timetables, bookings, boarding passes, the baggage systems, round the top of the frame
const M5_USERS=[["airlines",250,190],["timetables",600,128],["bookings",960,106],["boarding passes",1320,128],["baggage systems",1670,190]];
// the card where a city's name changes: Saigon, struck through, then Ho Chi Minh City, in 1976
function m5_rename(ctx,t,x,y,t0,tStrike,tNew){const k=fin(t,t0,0.4);if(k<=0.01)return;withA(ctx,k,()=>{wc_panel(ctx,x,y,380,170,{kind:"card",seed:12});
  m5_note(ctx,t,"Saigon",x+30,y+62,t0+0.1,0.6,{size:36});const sp=clamp((t-tStrike)/0.5,0,1);if(sp>0){ctx.save();ctx.strokeStyle=rgba(WC_INK,0.85);ctx.lineWidth=3.2;ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(x+24,y+50);ctx.lineTo(x+24+lerp(0,140,sp),y+48);ctx.stroke();ctx.restore();}
  m5_note(ctx,t,"Ho Chi Minh City",x+30,y+116,tNew,1.0,{size:36});withA(ctx,fin(t,tNew+0.8,0.4),()=>wc_T(ctx,"1976",x+350,y+60,{f:"mono",w:500,size:30,align:"right",col:WC_MUTED}));});}
// the products' logos, for the tests and the platform: the engine's own start loads them, and this series' start doesn't
if(typeof loadLogos==="function"&&!Object.keys(LOGO).length)loadLogos();
// Linh as the person, in white paper, wearing her roles' colours: student, tutor, researcher, alumna
const m5_bands=a=>["student","tutor","researcher","alumna"].map((r,i)=>({col:WC_ROLE[r],a:a[i]==null?1:a[i]}));

/* ---------- 2. One role, three names ---------- */
// Linh's card: her name, what she studies, and her two roles here as chips; returns where the tutor chip ends, for the lines from it
function m5_linhCard(ctx,x,y,o){o=o||{};const w=440;wc_panel(ctx,x,y,w,200,{kind:"card",seed:6});wc_T(ctx,"Linh Nguyen",x+30,y+50,{w:800,size:32,col:WC_DARK});
  wc_T(ctx,"health informatics",x+30,y+90,{w:600,size:28,col:WC_MUTED});const sw=Math.round(tw(ctx,"Student",30,800)+56),tw2=Math.round(tw(ctx,"Tutor",30,800)+56);
  wc_chip(ctx,x+30,y+116,sw,60,"student","Student",null,{seed:3});withA(ctx,o.tutor==null?1:o.tutor,()=>wc_chip(ctx,x+46+sw,y+116,tw2,60,"tutor","Tutor",null,{seed:4}));
  return[x+46+sw+tw2,y+146];}
// a record as one system keeps it: the system, washed in the role's colour behind its name, the key it knows her by, and one field with
// its value in the system's own words; returns where the value sits, [x0, x1, y], for the rings and lines that point at it
const M5_SYSH=128;
function m5_sys(ctx,x,y,w,sys,role,id,field,val,o){o=o||{};const col=WC_ROLE[role]||role,tW=tw(ctx,sys,30,800),vs=o.mono?30:32,vw=o.mono?500:800,vf=o.mono?"mono":undefined;
  wc_panel(ctx,x,y,w,M5_SYSH,{kind:"card",role:col,sw:tW+36,seed:o.seed||sys.length});wc_T(ctx,sys,x+32,y+48,{w:800,size:30,col:WC_DARK});
  if(id)wc_T(ctx,id,x+w-28,y+48,{w:500,size:28,f:"mono",align:"right",col:WC_INK});
  const fw=tw(ctx,field,28,600),vx=x+32+fw+30,vW=tw(ctx,val,vs,vw,vf);wc_T(ctx,field,x+32,y+101,{w:600,size:28,col:WC_MUTED});
  if(o.lit)withA(ctx,o.lit,()=>wc_panel(ctx,vx-14,y+70,vW+28,44,{kind:"chip",role:o.litCol||col,seed:val.length+2}));
  wc_T(ctx,val,vx,y+102,{w:vw,size:vs,f:vf,col:WC_DARK});return[vx,vx+vW,y+91];}
// where a match would be written down, and isn't: a dashed card with an equals sign in pencil (p draws it), and a cross over it (px)
function m5_noMatch(ctx,x,y,p,px){if(p<=0.01)return;withA(ctx,clamp(p*2,0,1),()=>wc_panel(ctx,x,y,200,104,{kind:"card",dashed:true,role:WC_PENCIL,seed:9}));
  ctx.save();ctx.strokeStyle=rgba(WC_INK,0.8);ctx.lineWidth=4;ctx.lineCap="round";[0,1].forEach(i=>{const q=clamp(p*2-1-i*0.4,0,1);if(q<=0)return;ctx.beginPath();ctx.moveTo(x+70,y+42+i*22);ctx.lineTo(x+70+60*ease(q),y+42+i*22);ctx.stroke();});ctx.restore();
  wc_cross(ctx,x+100,y+52,74,WC_NO,px);}
// HR's email, and what's attached: the role list, as a spreadsheet
function m5_sheetIcon(ctx,x,y){wc_panel(ctx,x,y,40,46,{kind:"card",seed:44});ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.6);ctx.lineWidth=1.6;
  for(let i=1;i<4;i++){ctx.beginPath();ctx.moveTo(x+6,y+i*11.5);ctx.lineTo(x+34,y+i*11.5);ctx.stroke();}ctx.beginPath();ctx.moveTo(x+17,y+5);ctx.lineTo(x+17,y+41);ctx.stroke();ctx.restore();}
const M5_MAILW=720,M5_MAILH=300;
function m5_email(ctx,x,y){const w=M5_MAILW,h=M5_MAILH;wc_panel(ctx,x,y,w,h,{kind:"card",seed:41});wc_envelope(ctx,x+w-76,y+58,0.5,0);
  [["From","HR"],["Subject","the role list"]].forEach(([k,v],i)=>{wc_T(ctx,k,x+32,y+58+i*50,{w:600,size:28,col:WC_MUTED});wc_T(ctx,v,x+176,y+58+i*50,{w:800,size:30,col:WC_DARK});});
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.35);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+28,y+134);ctx.lineTo(x+w-28,y+134);ctx.stroke();ctx.restore();
  wc_T(ctx,"The latest version is attached.",x+32,y+182,{w:600,size:28,col:WC_INK});
  const ax=x+30,ay=y+210;wc_panel(ctx,ax,ay,w-60,66,{kind:"chip",role:[214,210,196],seed:43});m5_sheetIcon(ctx,ax+18,ay+10);
  wc_T(ctx,"roles_FINAL_v3.xlsx",ax+80,ay+44,{f:"mono",w:500,size:28,col:WC_DARK});}

/* ---------- 3. Typed again ---------- */
// a file in the project: its name in type over a rule (and the product's logo, o.logo), then its lines in type. A line can be columns
// (o.cols gives each column's x). o.tp types the lines from o.from on, letter by letter, as it goes 0 to 1: by hand. o.lit: lines lit,
// as [[line, colour, a]]; o.head: the first line is a header, in muted type. Returns the card's height
const M5_LH=42;
function m5_file(ctx,x,y,w,name,lines,o){o=o||{};const h=Math.round(84+lines.length*M5_LH+12);wc_panel(ctx,x,y,w,h,{kind:"card",seed:o.seed||name.length});
  const lw=o.logo?logo(ctx,o.logo,x+28,y+25,30):0;wc_T(ctx,name,x+30+(lw?lw+12:0),y+48,{f:"mono",w:700,size:28,col:WC_DARK});
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.35);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+26,y+70);ctx.lineTo(x+w-26,y+70);ctx.stroke();ctx.restore();
  let left=Infinity;const from=o.from||0;if(o.tp!=null)left=Math.round(lines.slice(from).reduce((a,l)=>a+(Array.isArray(l)?l.join("").length:l.length),0)*clamp(o.tp,0,1));
  lines.forEach((ln,i)=>{const ly=y+84+i*M5_LH+M5_LH/2,lit=(o.lit||[]).find(l=>l[0]===i);
    if(lit&&(lit[2]==null||lit[2]>0.01))withA(ctx,lit[2]==null?1:lit[2],()=>wc_panel(ctx,x+14,ly-21,w-28,42,{kind:"chip",role:lit[1],seed:i+7}));
    (Array.isArray(ln)?ln:[ln]).forEach((s,j)=>{let str=s;if(i>=from&&o.tp!=null){const n=Math.min(str.length,left);left-=n;str=str.slice(0,n);}
      if(str)wc_T(ctx,str,x+30+(o.cols?o.cols[j]:0),ly+10,{f:"mono",w:500,size:28,col:i===0&&o.head?WC_MUTED:WC_INK});});});
  // the lines it had before, struck through in red as they go
  if(o.old&&o.oldA>0.01)withA(ctx,o.oldA,()=>o.old.forEach((s,i)=>{const ly=y+84+i*M5_LH+M5_LH/2;wc_T(ctx,s,x+30,ly+10,{f:"mono",w:500,size:28,col:WC_INK});
    const sp=clamp((o.strike||0)*1.6-i*0.15,0,1);if(sp>0&&s.trim()){const x0=x+30+tw(ctx,s.match(/^ */)[0],28,500,"mono"),x1=x+30+tw(ctx,s,28,500,"mono");
      ctx.save();ctx.strokeStyle=rgba(WC_NO,0.85);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x0,ly);ctx.lineTo(lerp(x0,x1,sp),ly);ctx.stroke();ctx.restore();}}));
  return h;}
const m5_lineY=(y,i)=>y+84+i*M5_LH+M5_LH/2;
// the two tests that type the statuses again, and the file that maps the codes: as the project holds them (shown without the file's
// label column)
const M5_MAPF=[["key_set","source_code","canonical_status"],["SIS","ENR","studying"],["SIS","LOA","inactive"],["SIS","WD","withdrawn"],["SIS","CMP","completed"],
  ["LMS","active","studying"],["LMS","inactive","inactive"]];
const M5_TYPED=["accepted_values:","  arguments:","    values: [studying,","      inactive, withdrawn,","      completed]"];
// a count, as a report shows it: what it counts, then a row a value, each with its bar and its number; o.rowA: each row's arrival,
// o.grow: how far the bars have grown; returns the card's height
const M5_REPH=64;
function m5_report(ctx,x,y,w,title,sub,rows,o){o=o||{};const h=Math.round(116+rows.length*M5_REPH+18),max=o.max||Math.max(...rows.map(r=>r[1])),bx=x+(o.bx||250),bw=w-(o.bx||250)-110;
  wc_panel(ctx,x,y,w,h,{kind:"card",seed:o.seed||29});wc_T(ctx,title,x+30,y+50,{w:800,size:30,col:WC_DARK});wc_T(ctx,sub,x+30,y+90,{w:600,size:28,col:WC_MUTED});
  rows.forEach(([lab,n],i)=>{const a=o.rowA?o.rowA[i]:1;if(a<=0.01)return;const ry=y+116+i*M5_REPH+M5_REPH/2,mono=lab.length<=3;
    withA(ctx,a,()=>{wc_T(ctx,lab,x+(o.lx||64),ry+10,{w:700,size:30,f:mono?"mono":undefined,col:WC_DARK});const L=Math.max(10,bw*n/max),g=o.grow==null?1:o.grow;
      ctx.save();ctx.beginPath();ctx.rect(bx-10,ry-30,(L+20)*ease(clamp(g,0,1)),60);ctx.clip();wc_panel(ctx,bx,ry-16,L,32,{kind:"chip",role:o.col||[132,146,172],seed:i+31});ctx.restore();
      withA(ctx,fin(g,0.6,0.4),()=>wc_T(ctx,String(n),bx+L+14,ry+10,{f:"mono",w:500,size:28,col:WC_INK}));});});return h;}
const m5_repY=(y,i)=>y+116+i*M5_REPH+M5_REPH/2;
// a pencil bracket down the left of some rows, from y0 to y1, drawn on as p goes 0 to 1
function m5_bracket(ctx,x,y0,y1,p,o){o=o||{};if(p<=0)return;const pts=[],m=(y0+y1)/2;for(let i=0;i<=40;i++){const y=lerp(y0,y1,i/40),d=Math.abs(y-m)/((y1-y0)/2);pts.push([x-14*Math.sqrt(Math.max(0,1-d*d))*0+(d<0.08?-12*(1-d/0.08):0)-(1-Math.pow(d,6))*10,y]);}
  wc_pencil(ctx,pts,p,{col:o.col||WC_PENCIL,lw:3,a:0.9,seed:o.seed||5,amp:1});}

/* ---------- the lists ---------- */
// a list: a card with a yellow tab, its name on the tab, and a row a value: its code in type and its label in words (a row is
// [code, label], or just a label). o.lit: rows lit, as [[row, colour, a]]; o.rowA: each row's arrival; o.newRow: a row drawn dashed,
// new; o.foot: a line under the rows, such as its owner. Returns the list's height
const M5_RH=48;
function m5_tab(ctx,x,y,name,seed){const tabW=Math.round(tw(ctx,name,28,800)+44);wc_panel(ctx,x+16,y-48,tabW,62,{kind:"card",wash:WC_BADGE,washA:0.72,seed});
  wc_T(ctx,name,x+38,y-12,{w:800,size:28,col:WC_DARK});return tabW;}
function m5_list(ctx,x,y,w,name,rows,o){o=o||{};const n=rows.length,h=Math.round(24+n*M5_RH+(o.foot?52:0)+14),seed=o.seed||name.length;m5_tab(ctx,x,y,name,seed);
  wc_panel(ctx,x,y,w,h,{kind:"card",seed:seed+5});
  const codes=rows.some(r=>Array.isArray(r)),cw=o.cw||(codes?Math.max(...rows.map(r=>Array.isArray(r)?tw(ctx,r[0],28,500,"mono"):0))+28:0);
  rows.forEach((r,i)=>{const a=o.rowA?o.rowA[i]:1;if(a<=0.01)return;const ry=y+24+i*M5_RH+M5_RH/2,[code,lab]=Array.isArray(r)?r:[null,r],lit=(o.lit||[]).find(l=>l[0]===i);
    withA(ctx,a,()=>{if(lit&&(lit[2]==null||lit[2]>0.01))withA(ctx,lit[2]==null?1:lit[2],()=>wc_panel(ctx,x+12,ry-22,w-24,44,{kind:"chip",role:lit[1],seed:i+11}));
      if(o.newRow===i)wc_panel(ctx,x+12,ry-22,w-24,44,{kind:"card",dashed:true,role:WC_PENCIL,fill:WC_CARD,seed:i+13});
      if(code)wc_T(ctx,code,x+28,ry+10,{f:"mono",w:500,size:28,col:WC_INK});wc_T(ctx,lab,x+28+cw,ry+11,{w:600,size:30,col:WC_DARK});});});
  if(o.foot)wc_T(ctx,o.foot,x+28,y+h-30,{w:600,size:28,col:WC_MUTED});return h;}
const m5_rowY=(y,i)=>y+24+i*M5_RH+M5_RH/2;
// a table, as a list's home keeps it: the yellow tab, a header row in muted type, then a row a value. cols: [[heading, x, "mono"]];
// o.colA: each column's arrival, o.rowA: each row's; o.hi: cells lit, as [[row, col, colour, a]]; o.dash: a row drawn dashed, new
function m5_grid(ctx,x,y,w,name,cols,rows,o){o=o||{};const n=rows.length,h=Math.round(24+(n+1)*M5_RH+14),seed=o.seed||name.length;m5_tab(ctx,x,y,name,seed);
  wc_panel(ctx,x,y,w,h,{kind:"card",seed:seed+5});const hy=y+24+M5_RH/2;
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.3);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+22,y+24+M5_RH);ctx.lineTo(x+w-22,y+24+M5_RH);ctx.stroke();ctx.restore();
  if(o.dash!=null){const ry=m5_gridY(y,o.dash);withA(ctx,o.rowA?o.rowA[o.dash]:1,()=>wc_panel(ctx,x+12,ry-22,w-24,44,{kind:"card",dashed:true,role:WC_PENCIL,seed:17}));}
  cols.forEach(([hd,cx,f],j)=>{const ca=o.colA?o.colA[j]:1;if(ca<=0.01)return;const mono=f==="mono";withA(ctx,ca,()=>{wc_T(ctx,hd,x+28+cx,hy+10,{w:600,size:28,col:WC_MUTED});
    rows.forEach((r,i)=>{const ra=o.rowA?o.rowA[i]:1;if(ra<=0.01||r[j]==null)return;const ry=m5_gridY(y,i),hi=(o.hi||[]).find(q=>q[0]===i&&q[1]===j);
      withA(ctx,ra,()=>{if(hi&&(hi[3]==null||hi[3]>0.01)){const cw=tw(ctx,r[j],mono?28:30,mono?500:600,mono?"mono":undefined)+30;withA(ctx,hi[3]==null?1:hi[3],()=>wc_panel(ctx,x+28+cx-15,ry-21,cw,42,{kind:"chip",role:hi[2],seed:i*5+j}));}
        wc_T(ctx,r[j],x+28+cx,ry+10,mono?{f:"mono",w:500,size:28,col:WC_INK}:{w:600,size:30,col:WC_DARK});});});});});
  return h;}
const m5_gridY=(y,i)=>y+24+(i+1)*M5_RH+M5_RH/2;
// a list, small: its yellow tab and name over a card with two faint rows, or with a line of its own (o.line, o.line2)
function m5_mini(ctx,x,y,w,name,o){o=o||{};const seed=name.length;m5_tab(ctx,x,y+48,name,seed);const h=o.line2?96:o.line?64:52;wc_panel(ctx,x,y+48,w,h,{kind:"card",seed:seed+5});
  if(o.line){wc_T(ctx,o.line,x+28,y+48+44,{w:600,size:28,col:WC_INK});if(o.line2)wc_T(ctx,o.line2,x+28,y+48+82,{w:600,size:28,col:WC_INK});return;}
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.28);ctx.lineWidth=3;ctx.lineCap="round";for(let i=0;i<2;i++){ctx.beginPath();ctx.moveTo(x+26,y+68+i*16);ctx.lineTo(x+w*(0.66-i*0.2),y+68+i*16);ctx.stroke();}ctx.restore();}

/* ---------- 4. The lists that sort ---------- */
// a dotted pencil line that leaves downwards and arrives level, drawn on as p goes 0 to 1
function m5_drop(ctx,x0,y0,x1,y1,col,o){o=o||{};const p=o.p==null?1:o.p;if(p<=0)return;const pts=[],c1=[x0,y1],c2=[(x0+x1)/2,y1];
  for(let i=0;i<=28;i++){const t=i/28,u=1-t;pts.push([u*u*u*x0+3*u*u*t*c1[0]+3*u*t*t*c2[0]+t*t*t*x1,u*u*u*y0+3*u*u*t*c1[1]+3*u*t*t*c2[1]+t*t*t*y1]);}
  const n=Math.max(2,Math.round(pts.length*clamp(p,0,1)));ctx.save();ctx.strokeStyle=rgba(col||WC_PENCIL,o.a==null?0.7:o.a);ctx.lineWidth=o.lw||3;ctx.lineCap="round";ctx.setLineDash([2,11]);
  ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<n;i++)ctx.lineTo(pts[i][0],pts[i][1]);ctx.stroke();ctx.restore();}
// what keeps a code: a drum, as databases are drawn; who reads a label: a head and shoulders
function m5_drum(ctx,x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle=rgba([210,218,230],1);ctx.strokeStyle=rgba(WC_PENCIL,0.9);ctx.lineWidth=2.4;
  ctx.beginPath();ctx.moveTo(-20,-15);ctx.lineTo(-20,15);ctx.ellipse(0,15,20,7,0,Math.PI,0,true);ctx.lineTo(20,-15);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.ellipse(0,-15,20,7,0,0,TAU);ctx.fill();ctx.stroke();ctx.beginPath();ctx.ellipse(0,0,20,7,0,0,Math.PI);ctx.stroke();ctx.restore();}
function m5_reader(ctx,x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle=rgba([236,220,204],1);ctx.strokeStyle=rgba(WC_PENCIL,0.9);ctx.lineWidth=2.4;
  ctx.beginPath();ctx.arc(0,-11,11,0,TAU);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(-21,22);ctx.quadraticCurveTo(-21,3,0,3);ctx.quadraticCurveTo(21,3,21,22);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}
// a bag tag at a smaller size, hanging from a pin, for the codes that come from outside; at this size the code is read, the city is a detail
function m5_smallTag(ctx,t,x,y,s,code,city,t0,o){o=o||{};ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  withA(ctx,fin(t,t0,0.3),()=>{ctx.fillStyle=rgba(WC_PENCIL,0.9);ctx.beginPath();ctx.arc(0,-4,7,0,TAU);ctx.fill();});m5_tag(ctx,t,0,0,code,city,t0,Object.assign({deco:1},o));ctx.restore();}

/* ---------- 6. Read, not typed ---------- */
// what reads the list on the platform: a table, or a report, as a node of its lineage, with a small glyph
function m5_node(ctx,x,y,w,name,kind,o){o=o||{};wc_panel(ctx,x,y,w,80,{kind:"card",seed:name.length+60,wash:o.wash,washA:o.washA||0.3});
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.85);ctx.lineWidth=2.2;const gx=x+24,gy=y+22;
  if(kind==="table"){ctx.strokeRect(gx,gy,36,36);ctx.beginPath();for(let i=1;i<3;i++){ctx.moveTo(gx,gy+i*12);ctx.lineTo(gx+36,gy+i*12);}ctx.moveTo(gx+14,gy);ctx.lineTo(gx+14,gy+36);ctx.stroke();}
  else{ctx.beginPath();ctx.moveTo(gx,gy+36);ctx.lineTo(gx+38,gy+36);ctx.stroke();[[4,20],[16,8],[28,26]].forEach(([bx,bh])=>{ctx.fillStyle=rgba(o.col||[120,134,160],0.85);ctx.fillRect(gx+bx,gy+36-36+bh,8,36-bh);});}
  ctx.restore();wc_T(ctx,name,x+76,y+51,kind==="table"?{f:"mono",w:500,size:28,col:WC_DARK}:{w:700,size:28,col:WC_DARK});}
// the platform's frame: a sheet with the product's logo and what it shows, here its lineage
function m5_platform(ctx,x,y,w,h){wc_panel(ctx,x,y,w,h,{kind:"sheet",seed:66});const lw=logo(ctx,"databricks",x+30,y+26,34);
  wc_T(ctx,"lineage",x+30+(lw||0)+(lw?16:0),y+54,{w:700,size:28,col:WC_MUTED});}
// a pin, where a test reads the list
function m5_pin(ctx,x,y,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.fillStyle=rgba(WC_BADGE,1);ctx.strokeStyle=rgba(WC_INK,0.85);ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(x,y,9,0,TAU);ctx.fill();ctx.stroke();ctx.fillStyle=rgba([255,255,255],0.6);
  ctx.beginPath();ctx.arc(x-3,y-3,3,0,TAU);ctx.fill();ctx.restore();});}

/* ---------- 7. A change, with a date ---------- */
// a pull request: its title, who opened it and on what, the line it adds and the line it ends, and the owner's review: approved, with a
// tick, as o.ok goes 0 to 1. o.l1, o.l2: each line's arrival
const M5_PRW=980,M5_PRH=320;
function m5_pr(ctx,x,y,o){o=o||{};const w=M5_PRW,h=M5_PRH;wc_panel(ctx,x,y,w,h,{kind:"card",seed:71});
  // the branch, merging: two circles joined by a curve
  ctx.save();ctx.strokeStyle=rgba(WC_ROLEINK.alumna,0.95);ctx.lineWidth=3;ctx.beginPath();ctx.arc(x+44,y+40,8,0,TAU);ctx.stroke();ctx.beginPath();ctx.arc(x+44,y+84,8,0,TAU);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x+44,y+48);ctx.lineTo(x+44,y+76);ctx.stroke();ctx.restore();
  wc_T(ctx,"HR's new name for tutors",x+80,y+52,{w:800,size:30,col:WC_DARK});wc_T(ctx,"role names, by system · opened by Jun",x+80,y+92,{w:600,size:28,col:WC_MUTED});
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.3);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+26,y+118);ctx.lineTo(x+w-26,y+118);ctx.stroke();ctx.restore();
  [[o.l1,"+","HR · Sessional Academic → tutor · from 2027-01-01",WC_ROLE.tutor],[o.l2,"~","HR · Casual Academic → tutor · until 2026-12-31",WC_ROLE.tutor]].forEach(([a,m,s,c],i)=>{
    if(a==null)a=1;if(a<=0.01)return;const ly=y+160+i*56;withA(ctx,a,()=>{wc_panel(ctx,x+20,ly-24,w-40,48,{kind:"chip",role:c,seed:i+72});
      wc_T(ctx,m,x+44,ly+10,{f:"mono",w:500,size:30,col:WC_DARK});wc_T(ctx,s,x+84,ly+10,{w:600,size:28,col:WC_DARK});});});
  const ra=o.rev==null?1:o.rev;if(ra<=0.01)return;withA(ctx,ra,()=>{wc_T(ctx,"review",x+32,y+h-36,{w:600,size:28,col:WC_MUTED});
    wc_T(ctx,"HR, the list's owner",x+134,y+h-36,{w:800,size:30,col:WC_DARK});const ok=o.ok||0;
    if(ok>0.01){const bx=x+134+tw(ctx,"HR, the list's owner",30,800)+24;withA(ctx,fin(ok,0,0.4),()=>wc_badge(ctx,bx,y+h-46,"approved",{role:[150,206,150]}));
      wc_tick(ctx,bx+tw(ctx,"approved",28,700)+56,y+h-50,40,WC_ROLEINK.alumna,clamp(ok*1.4-0.4,0,1),5);}});}
// the role's names across the years: a band in the tutor's violet, a year a step; the old name until the day the new one starts
const M5_Y0=2023,M5_YX=660,M5_YW=200,M5_BANDY=700;
const m5_yx=yr=>M5_YX+(yr-M5_Y0)*M5_YW;
function m5_years(ctx,t,o){const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const x0=m5_yx(2023.1),xs=m5_yx(2027),x1=m5_yx(2029),y=M5_BANDY;
  // the axis and its years
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.6);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(m5_yx(2023)-20,y+52);ctx.lineTo(x1+10,y+52);ctx.stroke();
  for(let yr=2023;yr<=2028;yr++){const x=m5_yx(yr);ctx.beginPath();ctx.moveTo(x,y+44);ctx.lineTo(x,y+60);ctx.stroke();}ctx.restore();
  for(let yr=2023;yr<=2028;yr++)wc_T(ctx,String(yr),m5_yx(yr)+M5_YW/2,y+98,{f:"mono",w:500,size:28,align:"center",col:WC_INK});
  // the old name: the whole band at first, then ended on the day the new one starts (o.cut)
  const cut=o.cut||0,oldEnd=lerp(x1,xs,ease(clamp(cut,0,1)));
  ctx.save();ctx.beginPath();ctx.rect(x0-10,y-40,oldEnd-x0+10,80);ctx.clip();wc_panel(ctx,x0,y-26,x1-x0,52,{kind:"chip",role:WC_ROLE.tutor,seed:81});ctx.restore();
  wc_T(ctx,"Casual Academic",(x0+xs)/2,y+10,{w:800,size:28,align:"center",col:WC_DARK});
  // the new one, dashed until it's approved, from 1 January
  const nw=o.newA||0;if(nw>0.01)withA(ctx,nw,()=>{const solid=o.solid||0;withA(ctx,1-solid,()=>wc_panel(ctx,xs+6,y-26,x1-xs-6,52,{kind:"chip",role:WC_ROLE.tutor,dashed:true,seed:82}));
    withA(ctx,solid,()=>wc_panel(ctx,xs+6,y-26,x1-xs-6,52,{kind:"chip",role:WC_ROLE.tutor,seed:83}));wc_T(ctx,"Sessional Academic",(xs+x1)/2,y+10,{w:800,size:28,align:"center",col:WC_DARK});});
  // the day it changes
  const dA=o.day||0;if(dA>0.01)withA(ctx,dA,()=>{ctx.save();ctx.strokeStyle=rgba(WC_INK,0.8);ctx.lineWidth=3;ctx.setLineDash([6,8]);ctx.beginPath();ctx.moveTo(xs,y-70);ctx.lineTo(xs,y+44);ctx.stroke();ctx.restore();
    wc_tag(ctx,xs+16,y-96,"1 Jan 2027",{align:"left",size:28,w:600});});});}
// one of her contracts: a small paper with its year, two lines of terms and a signature, above the band
function m5_contract(ctx,x,y,yr){wc_panel(ctx,x-60,y,120,96,{kind:"sheet",seed:yr%7+90});wc_T(ctx,String(yr),x,y+38,{f:"mono",w:500,size:28,align:"center",col:WC_DARK});
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.32);ctx.lineWidth=2.4;ctx.lineCap="round";[0,1].forEach(i=>{ctx.beginPath();ctx.moveTo(x-40,y+56+i*11);ctx.lineTo(x+(i?18:40),y+56+i*11);ctx.stroke();});
  ctx.strokeStyle=rgba(WC_INK,0.7);ctx.lineWidth=2.2;ctx.beginPath();for(let k=0;k<=24;k++){const u=k/24,sx=x-36+u*52,sy=y+84-Math.sin(u*TAU*1.6)*5*(1-u*0.4)-u*3;k?ctx.lineTo(sx,sy):ctx.moveTo(sx,sy);}ctx.stroke();ctx.restore();}

/* ---------- 9. Lists about people ---------- */
// a form that asks about you: a field's name, then its choices as chips with a round mark; o.pick: the choice picked
function m5_choice(ctx,x,y,s,o){o=o||{};const w=Math.round(tw(ctx,s,28,600)+74);wc_panel(ctx,x,y,w,56,{kind:"tag",seed:s.length+30,wash:o.lit,washA:0.5});
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.85);ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(x+28,y+28,10,0,TAU);ctx.stroke();ctx.restore();
  wc_T(ctx,s,x+48,y+38,{w:600,size:28,col:WC_DARK});return w;}
function m5_choices(ctx,x,y,list,o){o=o||{};let cx=x;const xs=[];list.forEach((s,i)=>{const a=o.a?o.a[i]:1;xs.push(cx);const w=Math.round(tw(ctx,s,28,600)+74);
  if(a>0.01)withA(ctx,a,()=>m5_choice(ctx,cx,y,s,{lit:o.lit&&o.lit[i]}));cx+=w+14;});return xs;}

/* ---------- 10. Elsewhere ---------- */
// an industry's panel: a sheet with its name on a wash of the industry's colour
const M5_IPW=820,M5_IPH=660;
function m5_ind(ctx,x,y,ind,name){wc_panel(ctx,x,y,M5_IPW,M5_IPH,{kind:"sheet",seed:ind.length+50});
  wc_panel(ctx,x+24,y+24,Math.round(tw(ctx,name,36,800)+56),64,{kind:"chip",role:WC_IND[ind],seed:ind.length+52});wc_T(ctx,name,x+52,y+68,{w:800,size:36,col:WC_DARK});}
