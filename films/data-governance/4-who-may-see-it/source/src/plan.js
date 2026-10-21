/* ===== Who may see it: the places and the pictures =====
   The places are painted once and kept (shared/src/finish.js). The past: West Germany in 1983 and 1987, in places of work and public
   life, never homes: a town hall's register office, a street corner with a newspaper kiosk and an advertising column, the court's hall
   (painted plainly, without the court's emblem), and a table seen from above. Today, only the university's own places (the series'
   rooms.js): Yusuf's office and his desk from above, Planning, the registrar's desk, the platform team's desk, the data team's room, its
   board and a screen close up, and the floor of offices. The pictures are the film's own things: the census forms and the register's
   cards, the posters, the judgment, the tin box and the tally; binder 6; the old path's papers; the classes (plum for direct personal
   data, a paler plum for pseudonymous, plain paper for none) and the mask, a plum band of stars; the board of models on strings; the
   key cards; the scrambler. Every name starts with ws_ or WS_. */

/* ---------- colours ---------- */
// the classes: direct personal data in plum, pseudonymous in a paler plum (still personal, so the same family), none in plain paper
const WS_DIRECT=[146,52,112],WS_DIRECTINK=[112,30,84],WS_PSEUDO=[214,160,198],WS_PSEUDOINK=[150,84,130],WS_NONE=[250,248,242];
// a pale yellow where something is pointed out
const WS_HI=[242,204,92];
// 1983's materials: a register office's oak and green, the court's red, the forms' grey-green paper, a tin box
const WS_OAK=[196,160,112],WS_COUNTER=[150,112,78],WS_ROBE=[184,34,42],WS_CAP=[170,30,36],WS_FORM=[238,240,226],WS_FORMINK=[96,120,104],WS_TIN=[132,150,140];

/* ---------- 1983: clothes the engine doesn't have ---------- */
// the series' torso and head stay as they are; these wrap them for their own kinds only: a judge's robe with a white jabot, a parka
// with its hood down, a long coat with a scarf, and an apron over whatever is worn; a judge's red cap and a felt hat
const _wsTorso=torso,_wsHead=head;
torso=function(ctx,P,br,sh){const T_=P.top;if(T_.kind==="ws_robe")return ws_robe(ctx,P,br,sh);if(T_.kind==="ws_parka")return ws_parka(ctx,P,br,sh);
  if(T_.kind==="ws_coat")return ws_coat(ctx,P,br,sh);_wsTorso(ctx,P,br,sh);if(T_.apron83)ws_apron(ctx,P,br,sh);};
// the robe: full, to the ankle, in folds from the yoke; the jabot, white cloth in tiers at the throat
function ws_robe(ctx,P,br,sh){const T_=P.top,c=T_.c,sw=P.build.sh,hw=P.build.hip,y0=-448+br,hem=-34;
  const path=()=>{ctx.beginPath();ctx.moveTo(-16,y0);ctx.bezierCurveTo(-30,y0+4,-sw+26,y0+10,-sw+12,y0+20);ctx.quadraticCurveTo(-sw-4,y0+28,-sw-4,y0+54);
    ctx.bezierCurveTo(-sw-6,y0+130,-hw-16,-300,-hw-34+sh*0.5,hem);ctx.quadraticCurveTo(sh*0.5,hem+14,hw+34+sh*0.5,hem);
    ctx.bezierCurveTo(hw+16,-300,sw+6,y0+130,sw+4,y0+54);ctx.quadraticCurveTo(sw+4,y0+28,sw-12,y0+20);ctx.bezierCurveTo(sw-26,y0+10,30,y0+4,16,y0);ctx.closePath();};
  path();litFill(ctx,c,-sw,y0,sw,hem);seam(ctx,c,0.5);ctx.save();path();ctx.clip();
  ctx.strokeStyle=rgba(darken(c,0.42),0.3);ctx.lineWidth=2.4;ctx.lineCap="round";
  for(const k of [-0.72,-0.32,0.12,0.5,0.82]){ctx.beginPath();ctx.moveTo(k*sw*0.66+sh*0.2,y0+72);ctx.quadraticCurveTo(k*(hw+10)+sh*0.4,-240,k*(hw+30)+sh*0.5,hem+4);ctx.stroke();}
  ctx.strokeStyle=rgba(lighten(c,0.22),0.22);ctx.lineWidth=6;for(const k of [-0.5,0.3]){ctx.beginPath();ctx.moveTo(k*sw*0.6+sh*0.2,y0+80);ctx.quadraticCurveTo(k*hw+sh*0.4,-240,k*(hw+24)+sh*0.5,hem+4);ctx.stroke();}
  // the yoke's edge, a deeper red across the chest
  ctx.strokeStyle=rgba(darken(c,0.3),0.55);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-sw-2,y0+66);ctx.quadraticCurveTo(sh*0.2,y0+84,sw+2,y0+66);ctx.stroke();ctx.restore();
  const jw=T_.jabot||[250,248,242];for(let i=0;i<4;i++){const y=y0-2+i*15,w=23-i*2.5,x=sh*0.2;
    ctx.beginPath();ctx.moveTo(x-w,y);ctx.quadraticCurveTo(x,y+12,x+w,y);ctx.quadraticCurveTo(x+w+3,y+13,x+w-4,y+21);ctx.quadraticCurveTo(x,y+29,x-w+4,y+21);ctx.quadraticCurveTo(x-w-3,y+13,x-w,y);ctx.closePath();
    litFill(ctx,jw,x-w,y,x+w,y+28);seam(ctx,jw,0.32,1.1);}}
// a parka to mid-thigh: a zip, two flap pockets, a drawstring at the waist, and the hood down, its fur trim round the neck
function ws_parka(ctx,P,br,sh){const T_=P.top,c=T_.c,sw=P.build.sh+4,hw=P.build.hip+8,y0=-448+br,hem=-196;
  const path=()=>{ctx.beginPath();ctx.moveTo(-18,y0-2);ctx.bezierCurveTo(-32,y0+2,-sw+26,y0+8,-sw+12,y0+18);ctx.quadraticCurveTo(-sw-4,y0+26,-sw-4,y0+52);
    ctx.bezierCurveTo(-sw-4,y0+90,-hw-4,-350,-hw-4,-320);ctx.quadraticCurveTo(-hw-10+sh*0.4,-260,-hw-8+sh*0.5,hem);ctx.quadraticCurveTo(sh*0.5,hem+8,hw+8+sh*0.5,hem);
    ctx.quadraticCurveTo(hw+10+sh*0.4,-260,hw+4,-320);ctx.bezierCurveTo(hw+4,-350,sw+4,y0+90,sw+4,y0+52);ctx.quadraticCurveTo(sw+4,y0+26,sw-12,y0+18);ctx.bezierCurveTo(sw-26,y0+8,32,y0+2,18,y0-2);ctx.closePath();};
  path();litFill(ctx,c,-sw,y0,sw,hem);seam(ctx,c,0.5);ctx.save();path();ctx.clip();
  ctx.strokeStyle=rgba(darken(c,0.5),0.7);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(sh*0.2,y0+10);ctx.lineTo(sh*0.5,hem);ctx.stroke();
  ctx.fillStyle=rgba(darken(c,0.16),1);for(const s of [-1,1]){rr(ctx,s*40-25+sh*0.4,-292,50,42,5);ctx.fill();seam(ctx,c,0.42,1.2);}
  ctx.strokeStyle=rgba(darken(c,0.35),0.55);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-hw,-334);ctx.quadraticCurveTo(sh*0.4,-326,hw,-334);ctx.stroke();ctx.restore();
  const f=T_.fur||[206,186,146];ctx.beginPath();ctx.moveTo(-sw+14,y0+18);ctx.quadraticCurveTo(-44,y0-24,0,y0-26);ctx.quadraticCurveTo(44,y0-24,sw-14,y0+18);ctx.quadraticCurveTo(30,y0+6,0,y0+8);ctx.quadraticCurveTo(-30,y0+6,-sw+14,y0+18);ctx.closePath();
  litFill(ctx,f,-sw,y0-26,sw,y0+18);ctx.strokeStyle=rgba(darken(f,0.3),0.55);ctx.lineWidth=1.3;for(let i=0;i<26;i++){const u=i/25,x=lerp(-sw+20,sw-20,u),y=y0-20+30*Math.pow(2*u-1,2)*0.7;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+(u-0.5)*9,y-7);ctx.stroke();}}
// a long coat to below the knee, buttoned, with a collar; a scarf round the neck, one end down the front
function ws_coat(ctx,P,br,sh){const T_=P.top,c=T_.c,sw=P.build.sh+3,hw=P.build.hip+6,y0=-448+br,hem=-116;
  const path=()=>{ctx.beginPath();ctx.moveTo(-16,y0-2);ctx.bezierCurveTo(-30,y0+2,-sw+26,y0+8,-sw+12,y0+18);ctx.quadraticCurveTo(-sw-3,y0+26,-sw-3,y0+52);
    ctx.bezierCurveTo(-sw-3,y0+88,-hw-3,-352,-hw,-322);ctx.quadraticCurveTo(-hw-12+sh*0.4,-220,-hw-16+sh*0.5,hem);ctx.lineTo(hw+16+sh*0.5,hem);ctx.quadraticCurveTo(hw+12+sh*0.4,-220,hw,-322);
    ctx.bezierCurveTo(hw+3,-352,sw+3,y0+88,sw+3,y0+52);ctx.quadraticCurveTo(sw+3,y0+26,sw-12,y0+18);ctx.bezierCurveTo(sw-26,y0+8,30,y0+2,16,y0-2);ctx.closePath();};
  path();litFill(ctx,c,-sw,y0,sw,hem);seam(ctx,c,0.5);ctx.save();path();ctx.clip();
  for(const s of [-1,1]){ctx.fillStyle=rgba(darken(c,0.16),1);ctx.beginPath();ctx.moveTo(s*12,y0-4);ctx.lineTo(s*(sw-6),y0+14);ctx.lineTo(s*40,y0+56);ctx.lineTo(s*14+sh*0.3,y0+70);ctx.closePath();ctx.fill();seam(ctx,c,0.4,1.2);}
  ctx.strokeStyle=rgba(darken(c,0.5),0.6);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(8+sh*0.3,y0+60);ctx.lineTo(12+sh*0.5,hem);ctx.stroke();
  ctx.fillStyle=rgba(darken(c,0.45),0.9);for(let i=0;i<4;i++)for(const s of [-1,1]){ell(ctx,s*16+sh*0.35,-404+i*46,3.4,3.4);ctx.fill();}
  for(const s of [-1,1]){ctx.strokeStyle=rgba(darken(c,0.4),0.5);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(s*46+sh*0.4,-300);ctx.lineTo(s*24+sh*0.45,-286);ctx.stroke();}ctx.restore();
  if(T_.scarf){const f=T_.scarf;ctx.beginPath();ctx.moveTo(-26,y0-6);ctx.quadraticCurveTo(0,y0+16,26,y0-6);ctx.lineTo(28,y0+12);ctx.quadraticCurveTo(0,y0+34,-28,y0+12);ctx.closePath();litFill(ctx,f,-28,y0-6,28,y0+34);seam(ctx,f,0.4,1.2);
    ctx.beginPath();ctx.moveTo(-22,y0+14);ctx.lineTo(-6,y0+20);ctx.lineTo(-12+sh*0.3,y0+120);ctx.lineTo(-30+sh*0.3,y0+116);ctx.closePath();litFill(ctx,f,-30,y0+14,-6,y0+120);seam(ctx,f,0.4,1.2);
    ctx.strokeStyle=rgba(darken(f,0.3),0.5);ctx.lineWidth=1.4;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(-28+i*5+sh*0.3,y0+118);ctx.lineTo(-28+i*5+sh*0.3,y0+128);ctx.stroke();}}}
// an apron with a bib, its neck strap and a pocket, over what the person wears
function ws_apron(ctx,P,br,sh){const a=P.top.apron83,y0=-448+br,hw=P.build.hip;
  ctx.beginPath();ctx.moveTo(-24,y0+34);ctx.lineTo(24,y0+34);ctx.lineTo(28+sh*0.3,-330);ctx.lineTo(hw+10+sh*0.4,-326);ctx.quadraticCurveTo(hw+16+sh*0.5,-220,hw+18+sh*0.5,-128);
  ctx.quadraticCurveTo(sh*0.5,-120,-hw-18+sh*0.5,-128);ctx.quadraticCurveTo(-hw-16,-220,-hw-10,-326);ctx.lineTo(-28+sh*0.3,-330);ctx.closePath();litFill(ctx,a,-hw,y0,hw,-120);seam(ctx,a,0.35);
  ctx.strokeStyle=rgba(darken(a,0.22),0.9);ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-22,y0+36);ctx.quadraticCurveTo(-26,y0+6,-14,y0);ctx.moveTo(22,y0+36);ctx.quadraticCurveTo(26,y0+6,14,y0);ctx.stroke();
  ctx.fillStyle=rgba(darken(a,0.08),1);rr(ctx,-30+sh*0.4,-296,60,44,5);ctx.fill();seam(ctx,a,0.3,1.2);}
head=function(ctx,P,E,po,t){_wsHead(ctx,P,E,po,t);const h=P.hat,hc=P.hatC||WS_CAP;
  // a judge's cap: soft red cloth, its top a little wider than its band
  if(h==="ws_cap"){ctx.beginPath();ctx.moveTo(-47,-36);ctx.quadraticCurveTo(-52,-66,-55,-94);ctx.quadraticCurveTo(0,-108,55,-94);ctx.quadraticCurveTo(52,-66,47,-36);ctx.quadraticCurveTo(0,-28,-47,-36);ctx.closePath();
    litFill(ctx,hc,-55,-108,55,-28);seam(ctx,hc,0.5);ctx.beginPath();ctx.ellipse(0,-95,55,10,0,0,TAU);litFill(ctx,lighten(hc,0.08),-55,-105,55,-85);seam(ctx,hc,0.4,1.2);
    ctx.strokeStyle=rgba(darken(hc,0.35),0.5);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-47,-46);ctx.quadraticCurveTo(0,-38,47,-46);ctx.stroke();
    ctx.strokeStyle=rgba(lighten(hc,0.25),0.35);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-32,-86);ctx.quadraticCurveTo(-36,-66,-32,-50);ctx.stroke();}
  // a felt hat: a brim, a crown pinched at the front, a dark band
  if(h==="ws_felt"){ctx.beginPath();ctx.ellipse(0,-44,78,15,-0.04,0,TAU);litFill(ctx,hc,-78,-59,78,-29);seam(ctx,hc,0.5);
    ctx.beginPath();ctx.moveTo(-44,-48);ctx.bezierCurveTo(-48,-106,-14,-106,0,-94);ctx.bezierCurveTo(14,-106,48,-106,44,-48);ctx.quadraticCurveTo(0,-38,-44,-48);ctx.closePath();litFill(ctx,hc,-48,-106,48,-40);seam(ctx,hc,0.5);
    ctx.fillStyle=rgba(darken(hc,0.42),1);ctx.beginPath();ctx.moveTo(-44,-60);ctx.quadraticCurveTo(0,-50,44,-60);ctx.lineTo(44,-50);ctx.quadraticCurveTo(0,-40,-44,-50);ctx.closePath();ctx.fill();}};

/* ---------- 1983: the people, invented ---------- */
Object.assign(PEOPLE,{
  // the register office's clerk: a blouse and a cardigan, a permed head of hair, large glasses
  ws_clerk:{name:"",role:"clerk of the register of residents",side:"",edge:GV_PAST,seed:41,skin:[236,200,172],hair:{style:"curly",c:[124,84,54]},glasses:[118,88,66],
    top:{kind:"cardigan",c:[178,122,70],inner:[240,230,206]},bottom:{kind:"skirt",c:[108,84,66]},legs:[206,176,154],shoe:[72,52,42],build:{sh:66,hip:60,h:0.96}},
  // on the street: a student in a parka, a pensioner in a coat and a felt hat, a shopkeeper in an apron
  ws_student:{name:"",role:"student",side:"",edge:GV_PAST,seed:42,skin:[230,192,162],hair:{style:"long",c:[96,70,48]},beard:[104,76,52],
    top:{kind:"ws_parka",c:[110,116,78],fur:[206,188,150]},bottom:{c:[72,98,140]},shoe:[124,104,82],build:{sh:74,hip:60,h:1.01}},
  ws_pensioner:{name:"",role:"pensioner",side:"",edge:GV_PAST,seed:43,skin:[228,192,168],hair:{style:"cropped",c:[206,204,200]},glasses:[64,62,70],hat:"ws_felt",hatC:[96,88,78],
    top:{kind:"ws_coat",c:[122,120,114],scarf:[150,62,52]},bottom:{c:[82,80,78]},shoe:[42,34,30],build:{sh:72,hip:62,h:0.97}},
  ws_keeper:{name:"",role:"shopkeeper",side:"",edge:GV_PAST,seed:44,skin:[214,170,140],hair:{style:"bob",c:[72,54,42],streak:[110,86,66]},
    top:{kind:"sweater",c:[152,62,66],apron83:[212,224,236]},bottom:{c:[72,72,86]},shoe:[62,48,40],build:{sh:68,hip:62,h:0.96}}
});
// a shrug for someone sitting behind a desk: palms up at the chest, where the desk doesn't hide them
Object.assign(POSE,{ws_shrugSeat:{L:[0.25,2.5],R:[0.25,2.5],hand:"open",feet:30,shift:0,tilt:0.1,turn:0,gaze:[0,0],look:0}});
// the eight judges of the First Senate, in red robes and caps: invented faces, of the ages and the one woman the Senate had in 1983
const WS_JUDGES=[[[230,194,168],{style:"cropped",c:[204,202,198]},null,1.0],[[226,186,156],{style:"side",c:[150,142,136]},[60,58,66],1.02],
  [[234,198,174],{style:"side",c:[96,86,80]},null,0.99],[[222,182,152],{style:"cropped",c:[232,230,226]},[70,66,72],1.01],
  [[236,202,180],{style:"bob",c:[196,190,186],streak:[222,218,214]},null,0.95],[[228,190,160],{style:"side",c:[120,108,98]},[56,54,60],1.0],
  [[232,196,170],{style:"cropped",c:[176,170,164]},null,1.03],[[224,184,156],{style:"side",c:[210,206,202]},null,0.98]];
WS_JUDGES.forEach(([skin,hair,glasses,h],i)=>{PEOPLE["ws_judge"+i]={name:"",role:"judge",side:"",edge:GV_PAST,seed:50+i,skin,hair,glasses,hat:"ws_cap",hatC:WS_CAP,
  top:{kind:"ws_robe",c:WS_ROBE},bottom:{c:[40,36,40]},shoe:[30,26,26],build:{sh:i===4?66:74,hip:i===4?60:62,h}};});

/* ---------- 1983: a town hall's register office ---------- */
// the wall and its green dado, the cabinet of card drawers that is the register of residents, the town's map, the clock, a window
// onto a street of plane trees; the counter is the front layer (ws_paintCounter83), drawn after the clerk
const WS_HL={fy:770,top:640,cab:[96,236,520,534],map:[904,190,360,250],clock:[752,198,48],win:[1404,150,380,420],clerk:[800,0.9],plant:1840};
function ws_window83(ctx,x,y,w,h,seed){ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();wc_sky(ctx,y+h*0.6,seed,{clouds:2,cx:x+10,cw:Math.max(40,w-120),cy:y+20,ch:h*0.2});
  // the house across the street: plaster, a cornice, its windows
  wc_part(ctx,wc_rect(x+w*0.34,y+h*0.16,w*0.9,h),[220,196,160],0.45);wc_part(ctx,wc_rect(x+w*0.3,y+h*0.13,w*0.9,16),[200,176,140],0.45);
  for(let r=0;r<3;r++)for(let k=0;k<3;k++)wc_flat(ctx,wc_rect(x+w*0.42+k*w*0.2,y+h*0.24+r*h*0.2,w*0.1,h*0.12),[122,140,170],0.45,"pane");
  // a plane tree in new leaf, its trunk mottled
  const tx=x+w*0.2;wc_wash(ctx,[[tx-12,y+h],[tx-8,y+h*0.42],[tx+8,y+h*0.42],[tx+12,y+h]],[196,186,160],{depth:0.5,kind:"trunk"});
  const R=wc_rng(seed),parts=[];for(let i=0;i<9;i++){const a=R()*TAU;parts.push(wc_ell(tx+Math.cos(a)*w*0.16,y+h*0.32+Math.sin(a)*h*0.12,w*(0.1+R()*0.05),h*(0.08+R()*0.04),20));}
  wc_wash(ctx,parts,[164,200,112],{depth:0.5,kind:"tree"});ctx.restore();
  const f=16;for(const r of [wc_rect(x-f,y-f,w+2*f,f),wc_rect(x-f,y-f,f,h+2*f),wc_rect(x+w,y-f,f,h+2*f),wc_rect(x+w/2-6,y,12,h),wc_rect(x,y+h*0.36-6,w,12)])wc_wash(ctx,r,[246,244,236],{kind:"trim",lw:1.4});
  wc_wash(ctx,wc_rect(x-30,y+h,w+60,24),[204,196,170],{kind:"trim",lw:1.5});}
function ws_paintHall83(ctx){const L=WS_HL;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,L.fy+40),[238,228,198],{kind:"plaster",line:false,seed:401});
  wc_wash(ctx,wc_rect(-40,520,W+80,L.fy-520),[196,206,186],{kind:"plaster",line:false,seed:402});wc_wash(ctx,wc_rect(-40,510,W+80,14),[164,172,152],{kind:"trim",lw:1.2});
  wc_wash(ctx,wc_rect(-40,L.fy,W+80,H-L.fy+40),[188,162,124],{kind:"ground",line:false,seed:403});gv_lightGlow(ctx,900,0,640);
  ws_window83(ctx,L.win[0],L.win[1],L.win[2],L.win[3],41);
  // the register: a cabinet of small drawers, each with a brass pull and a card in its label holder
  const [cx,cy,cw,ch]=L.cab;wc_contact(ctx,cx-10,cx+cw+10,L.fy+2,0.9,0.3);wc_part(ctx,wc_rect(cx,cy,cw,L.fy-cy),wc_dim(WS_OAK,0.18),1,{seed:404});
  wc_part(ctx,wc_rect(cx-12,cy-18,cw+24,22),WS_OAK,1);const nc=6,nr=7,dw=(cw-28)/nc,dh=(L.top-cy-30)/nr;
  for(let r=0;r<nr;r++)for(let k=0;k<nc;k++){const dx=cx+14+k*dw,dy=cy+14+r*dh;wc_part(ctx,wc_rect(dx+3,dy+3,dw-6,dh-6),wc_lit(WS_OAK,0.06),1,{lw:1.1,seed:405+r*nc+k});
    wc_flat(ctx,wc_rect(dx+dw/2-18,dy+12,36,16),[248,244,230],1,"label");wc_flat(ctx,wc_rect(dx+dw/2-12,dy+dh-24,24,8),[176,140,70],1,"pull");}
  // the town's map, framed: a river, streets, a park
  const [mx,my,mw,mh]=L.map;gv_frame(ctx,mx,my,mw,mh);ctx.save();ctx.beginPath();ctx.rect(mx,my,mw,mh);ctx.clip();wc_flat(ctx,wc_rect(mx,my,mw,mh),[246,240,220],1,"map");
  wc_wash(ctx,wc_band(wc_smooth([[mx-20,my+mh*0.7],[mx+mw*0.3,my+mh*0.55],[mx+mw*0.6,my+mh*0.72],[mx+mw+20,my+mh*0.5]],8),18,22),[150,190,220],{kind:"swatch",line:false,a:0.8});
  wc_flat(ctx,wc_ell(mx+mw*0.7,my+mh*0.28,46,30,20),[172,206,140],1,"park");ctx.strokeStyle=rgba([170,150,120],0.8);ctx.lineWidth=3;
  for(const [a,b,c2,d] of [[0,0.3,1,0.36],[0,0.86,1,0.8],[0.22,0,0.3,1],[0.5,0,0.46,1],[0.8,0,0.86,1]]){ctx.beginPath();ctx.moveTo(mx+a*mw,my+b*mh);ctx.lineTo(mx+c2*mw,my+d*mh);ctx.stroke();}ctx.restore();
  // the clock: a white face, its ticks, the hands at a quarter past ten
  const [kx,ky,kr]=L.clock;wc_wash(ctx,wc_ell(kx,ky,kr+8,kr+8,40),[70,70,76],{kind:"clock",lw:1.4});wc_flat(ctx,wc_ell(kx,ky,kr,kr,40),[250,250,246],1,"face");
  ctx.save();ctx.strokeStyle=rgba([40,40,46],0.9);ctx.lineCap="round";for(let i=0;i<12;i++){const a=i/12*TAU;ctx.lineWidth=i%3?2:4;ctx.beginPath();ctx.moveTo(kx+Math.cos(a)*kr*0.78,ky+Math.sin(a)*kr*0.78);ctx.lineTo(kx+Math.cos(a)*kr*0.92,ky+Math.sin(a)*kr*0.92);ctx.stroke();}
  ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(kx,ky);ctx.lineTo(kx+Math.cos(-2.6)*kr*0.5,ky+Math.sin(-2.6)*kr*0.5);ctx.stroke();ctx.lineWidth=3.5;ctx.beginPath();ctx.moveTo(kx,ky);ctx.lineTo(kx+kr*0.72,ky+kr*0.08);ctx.stroke();ctx.restore();
  // a notice board between the cabinet and the map: three notices, nothing to read
  gv_cork(ctx,672,300,180,170,10);gv_sheet(ctx,688,316,70,92,{rot:-0.03});gv_sheet(ctx,770,322,66,84,{rot:0.04});gv_sheet(ctx,712,404,86,52,{rot:0.02});
  gv_plant(ctx,L.plant,L.fy,1.0);}
// the counter: its top, the panelled front, and on it a typewriter, a stamp on its pad and a tray of forms
function ws_paintCounter83(ctx){const L=WS_HL,top=L.top;wc_part(ctx,wc_rect(-40,top+30,W+80,H-top),WS_COUNTER,1,{seed:411});
  for(let i=0;i<7;i++)wc_part(ctx,wc_rect(-20+i*290+24,top+70,240,H-top-40),wc_lit(WS_COUNTER,0.08),1,{lw:1.2,seed:412+i});
  wc_part(ctx,wc_rect(-40,top,W+80,38),wc_lit(WS_COUNTER,0.18),1,{seed:420});wc_flat(ctx,wc_rect(-40,top+34,W+80,8),wc_dim(WS_COUNTER,0.3),1,"edge");
  // the typewriter: grey-green, its keys in rows, a sheet in the roller
  const tx=1430;wc_part(ctx,[[tx,top+8],[tx+300,top+8],[tx+282,top-70],[tx+18,top-70]],[146,158,146],1,{seed:421});wc_part(ctx,wc_rect(tx+30,top-104,240,36),[126,138,128],1);
  gv_sheet(ctx,tx+70,top-196,160,100,{rot:0});for(let r=0;r<3;r++)for(let k=0;k<10;k++)wc_flat(ctx,wc_ell(tx+56+k*21+r*8,top-50+r*18,7,6,10),[60,62,66],1,"key");
  wc_part(ctx,wc_rect(310,top-14,150,24),[70,72,80],1);wc_flat(ctx,wc_rect(322,top-16,126,10),[60,80,150],1,"ink");
  wc_part(ctx,wc_rect(486,top-18,80,20),[60,52,48],1);wc_part(ctx,[[508,top-18],[544,top-18],[538,top-60],[514,top-60]],[150,104,70],1);wc_wash(ctx,wc_ell(526,top-74,22,18,20),[150,104,70],{kind:"thing",lw:1.2});}

/* ---------- 1983: a street corner ---------- */
// the houses of the street, post-war plaster with shops below; a plane tree; a yellow telephone box; the advertising column, its old
// posters faded; the newspaper kiosk, its papers pinned along the front (nothing to read)
const WS_ST={fy:860,col:[960,330,190],kiosk:[1330,1760],booth:[380,520],tree:180};
function ws_paintStreet83(ctx){const S_=WS_ST,fy=S_.fy;wc_sky(ctx,560,47,{sun:[1500,120],cx:200,cw:1500,cy:40,ch:140});
  // the houses: four fronts of different heights and colours, rows of windows, shopfronts at the bottom
  [[-40,120,460,[226,200,160]],[420,170,430,[190,200,206]],[850,100,520,[228,186,164]],[1370,150,600,[214,206,180]]].forEach(([x,y,w,c],i)=>{wc_part(ctx,wc_rect(x,y,w,fy-y-60),c,0.62,{seed:430+i});
    wc_part(ctx,wc_rect(x-6,y-16,w+12,20),wc_dim(c,0.12),0.62);const nk=Math.floor(w/110);for(let r=0;r<Math.floor((fy-y-260)/110);r++)for(let k=0;k<nk;k++)wc_flat(ctx,wc_rect(x+30+k*(w-40)/nk,y+40+r*110,52,70),[122,140,170],0.6,"pane");
    wc_part(ctx,wc_rect(x+20,fy-220,w-40,150),[110,120,130],0.6,{kind:"glass"});wc_part(ctx,wc_rect(x+12,fy-236,w-24,20),[[150,80,64],[70,96,120],[96,120,80],[150,120,70]][i],0.6);});
  // the pavement: slabs, a kerb in front
  wc_wash(ctx,wc_rect(-40,fy-70,W+80,H-fy+110),[214,208,198],{kind:"ground",line:false,seed:440});ctx.save();ctx.strokeStyle=rgba([170,164,154],0.4);ctx.lineWidth=2;
  for(let i=-14;i<=14;i++){ctx.beginPath();ctx.moveTo(960+i*80,fy-70);ctx.lineTo(960+i*190,H+40);ctx.stroke();}for(const y of [fy-30,fy+30,fy+110,fy+210]){ctx.beginPath();ctx.moveTo(-40,y);ctx.lineTo(W+40,y);ctx.stroke();}ctx.restore();
  // the plane tree: a mottled trunk, grey, olive and cream, and its leaves just out
  const tx=S_.tree;wc_wash(ctx,[[tx-26,fy+20],[tx-18,360],[tx+18,360],[tx+26,fy+20]],[188,182,160],{kind:"trunk",seed:441});
  const R=wc_rng(442);for(let i=0;i<16;i++)wc_flat(ctx,wc_ell(tx-14+R()*28,380+R()*(fy-380),6+R()*8,10+R()*12,10),[[150,156,120],[226,220,196],[120,128,110]][i%3],1,"bark");
  const parts=[];for(let i=0;i<12;i++){const a=R()*TAU;parts.push(wc_ell(tx+Math.cos(a)*170,250+Math.sin(a)*110,90+R()*40,70+R()*30,24));}wc_wash(ctx,parts,[160,198,108],{kind:"tree",seed:443});
  // the telephone box: yellow, its glass in small panes
  const [b0,b1]=S_.booth;wc_contact(ctx,b0-10,b1+10,fy+4,1,0.3);wc_part(ctx,wc_rect(b0,fy-330,b1-b0,330),[236,196,58],1,{seed:444});wc_part(ctx,wc_rect(b0-8,fy-350,b1-b0+16,26),[226,184,46],1);
  for(let r=0;r<4;r++)for(let k=0;k<2;k++)wc_flat(ctx,wc_rect(b0+16+k*(b1-b0-24)/2,fy-310+r*66,(b1-b0-40)/2,56),[176,206,222],1,"pane");
  // the advertising column: a plinth, the round body, a band and its domed cap with a finial; old posters, faded, all round it
  const [ax,at,ar]=S_.col;wc_contact(ctx,ax-ar,ax+ar,fy+4,1,0.35);wc_part(ctx,wc_rect(ax-ar-10,fy-40,2*ar+20,40),[96,110,100],1,{seed:445});
  wc_part(ctx,wc_rect(ax-ar,at,2*ar,fy-40-at),[226,220,200],1,{seed:446});
  ctx.save();ctx.beginPath();ctx.rect(ax-ar,at,2*ar,fy-40-at);ctx.clip();const P2=wc_rng(447);for(let i=0;i<9;i++){const px=ax-ar+P2()*2*ar-60,py=at+20+P2()*(fy-at-220);wc_flat(ctx,wc_rect(px,py,120+P2()*50,150+P2()*60),[[214,196,170],[196,206,214],[222,210,176],[206,190,196]][i%4],1,"old");}
  const g=ctx.createLinearGradient(ax-ar,0,ax+ar,0);g.addColorStop(0,"rgba(60,50,40,0.22)");g.addColorStop(0.35,"rgba(255,255,255,0.12)");g.addColorStop(1,"rgba(60,50,40,0.3)");ctx.fillStyle=g;ctx.fillRect(ax-ar,at,2*ar,fy-at);ctx.restore();
  wc_part(ctx,wc_rect(ax-ar-14,at-30,2*ar+28,34),[80,104,90],1);wc_part(ctx,[[ax-ar-8,at-28],[ax-ar+30,at-120],[ax+ar-30,at-120],[ax+ar+8,at-28]],[86,112,96],1,{seed:448});
  wc_wash(ctx,wc_ell(ax,at-120,ar-30,16,30),[96,122,104],{kind:"thing",lw:1.3});wc_part(ctx,wc_rect(ax-6,at-176,12,56),[86,112,96],1);wc_wash(ctx,wc_ell(ax,at-182,14,14,20),[86,112,96],{kind:"thing",lw:1.2});
  // the kiosk: a green booth, a hatch with an awning, papers pinned in rows on its front, a roof that overhangs
  const [k0,k1]=S_.kiosk;wc_contact(ctx,k0-10,k1+10,fy+4,1,0.35);wc_part(ctx,wc_rect(k0,fy-420,k1-k0,420),[78,120,92],1,{seed:449});
  wc_part(ctx,wc_rect(k0-24,fy-470,k1-k0+48,56),[64,100,78],1);wc_part(ctx,wc_rect(k0+40,fy-390,k1-k0-80,170),[60,70,72],1,{kind:"glass"});
  for(let i=0;i<8;i++){const sx=k0+30+i*((k1-k0-60)/8);gv_sheet(ctx,sx,fy-196,(k1-k0-60)/8-10,120,{rot:(i%2?0.02:-0.02)});wc_flat(ctx,wc_rect(sx+8,fy-180,(k1-k0-60)/8-26,14),[[200,60,50],[60,80,140],[60,60,64]][i%3],1,"head");}
  wc_wash(ctx,[[k0+30,fy-396],[k1-30,fy-396],[k1-14,fy-350],[k0+14,fy-350]],[200,70,60],{kind:"build",lw:1.3});
  wc_lamp(ctx,1880,fy+10,520,1);}

/* ---------- 1983: the court's hall ---------- */
// a plain hall, not the court's own: a wall of pale wood behind the bench, tall windows onto the park on either side, the light from
// above; the bench, raised and long, is the front layer (ws_paintBench), drawn after the judges; the public's seats along the bottom
const WS_CT={top:560,bench:[170,1750],seats:[896,1000],judges:[318,488,658,828,1092,1262,1432,1602],s:0.62};
function ws_paintCourt(ctx){const C=WS_CT;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),[232,226,214],{kind:"plaster",line:false,seed:451});
  // the windows, floor to ceiling, onto the park's trees
  for(const [x0,x1] of [[-40,250],[1670,1960]]){ctx.save();ctx.beginPath();ctx.rect(x0,40,x1-x0,760);ctx.clip();wc_sky(ctx,560,52+x0,{clouds:1,cx:x0,cw:x1-x0,cy:60,ch:120});
    wc_roundTree(ctx,(x0+x1)/2,820,700,0.5,[150,190,110]);wc_roundTree(ctx,(x0+x1)/2+90,860,560,0.45,[132,178,100]);ctx.restore();
    for(let k=0;k<=3;k++)wc_wash(ctx,wc_rect(x0+k*(x1-x0)/3-5,40,10,760),[226,222,214],{kind:"trim",lw:1.2});wc_wash(ctx,wc_rect(x0,32,x1-x0,14),[226,222,214],{kind:"trim",lw:1.2});}
  // the wall behind the bench: panels of pale wood, light falling on it from above
  wc_part(ctx,wc_rect(270,70,1380,C.top+40),[222,196,150],1,{seed:452});for(let i=0;i<10;i++)wc_part(ctx,wc_rect(284+i*136,86,124,C.top),wc_lit([222,196,150],0.05),1,{lw:1.1,seed:453+i});
  gv_lightGlow(ctx,960,0,820);
  // the floor below the bench, the public's seats along the bottom: a row of chair backs in blue cloth
  wc_wash(ctx,wc_rect(-40,C.top+200,W+80,H),[196,182,160],{kind:"ground",line:false,seed:465});}
function ws_paintBench(ctx){const C=WS_CT,top=C.top,[b0,b1]=C.bench;
  wc_part(ctx,wc_rect(b0,top+26,b1-b0,240),wc_dim([214,186,140],0.08),1,{seed:466});for(let i=0;i<8;i++)wc_part(ctx,wc_rect(b0+16+i*(b1-b0-32)/8,top+48,(b1-b0-32)/8-12,200),wc_lit([214,186,140],0.06),1,{lw:1.1,seed:467+i});
  wc_part(ctx,wc_rect(b0-20,top,b1-b0+40,34),wc_lit([214,186,140],0.14),1,{seed:476});
  // the public's seats, from behind
  for(let i=0;i<9;i++){const x=40+i*214;wc_part(ctx,wc_rrPts(x,C.seats[0],180,200,30),[70,84,120],1,{seed:477+i});}}

/* ---------- 1983: a table, seen from above ---------- */
// dark wood with its grain, a green blotter where the form lies, a pencil pot and an eraser at the edges
function ws_paintTable83(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),[160,116,80],{kind:"plaster",line:false,seed:481});
  ctx.save();ctx.globalCompositeOperation="multiply";const R=wc_rng(482);for(let i=0;i<64;i++){const y=R()*H;ctx.strokeStyle=rgba(wc_dim([160,116,80],0.25+R()*0.12),0.2+R()*0.14);ctx.lineWidth=1+R()*2.6;ctx.beginPath();ctx.moveTo(-20,y);
    for(let x=0;x<=W+40;x+=80)ctx.lineTo(x,y+7*Math.sin(x/320+i)+3*Math.sin(x/96+i*2));ctx.stroke();}ctx.restore();
  wc_part(ctx,wc_rect(560,60,800,940),[118,140,108],1,{seed:483});wc_flat(ctx,wc_rect(560,60,800,26),[92,80,64],1,"corner");wc_flat(ctx,wc_rect(560,974,800,26),[92,80,64],1,"corner");
  wc_wash(ctx,wc_ell(1780,120,60,60,30),[110,120,140],{kind:"thing",lw:1.5});for(let i=0;i<4;i++){ctx.save();ctx.translate(1770+i*8,104);ctx.rotate(-0.3+i*0.2);wc_flat(ctx,wc_rect(-3,-70,7,72),[[214,186,120],[96,120,170],[214,186,120],[204,80,70]][i],1,"pen");ctx.restore();}
  wc_part(ctx,wc_rrPts(150,940,120,60,10),[236,200,196],1);}

/* ---------- 1983: the things ---------- */
// a census form, kept once: grey-green paper, a strip at the top for name and address (lines and boxes), then rows of answers, a box
// to tick on each, nothing written; w by h, drawn centred on (x,y), rotated by rot
function ws_formC(w,h){return wc_kept("form|"+w+"x"+h,w+40,h+40,q=>{q.translate(20,20);q.save();q.filter="blur(6px)";q.fillStyle="rgba(60,50,40,0.24)";q.fillRect(6,10,w,h);q.restore();
  wc_wash(q,wc_rect(0,0,w,h),WS_FORM,{kind:"page",lw:1.4,seed:w+h});const k=w/400,ink=WS_FORMINK;
  q.save();q.strokeStyle=rgba(ink,0.8);q.lineWidth=3*k;q.strokeRect(14*k,14*k,w-28*k,h*0.22);q.lineWidth=1.6*k;
  for(let i=0;i<3;i++){q.beginPath();q.moveTo(30*k,(46+i*28)*k);q.lineTo(w-30*k,(46+i*28)*k);q.stroke();}
  for(let i=0;i<8;i++)q.strokeRect((30+i*22)*k,h*0.22-12*k,16*k,16*k);
  q.fillStyle=rgba(ink,0.55);q.fillRect(14*k,h*0.25,w-28*k,10*k);
  for(let r=0;r<9;r++){const y=h*0.3+r*(h*0.66/9);q.fillStyle=rgba(ink,0.35);q.fillRect(30*k,y+6*k,(150+40*Math.sin(r*3.1))*k,6*k);q.strokeStyle=rgba(ink,0.8);q.lineWidth=1.6*k;
    for(let b=0;b<3;b++)q.strokeRect(w-(120-b*34)*k,y,18*k,18*k);q.beginPath();q.moveTo(30*k,y+26*k);q.lineTo(w-30*k,y+26*k);q.strokeStyle=rgba(ink,0.25);q.stroke();}
  q.restore();});}
// the line between the name strip and the answers, as a share of the form's height
const WS_FCUT=0.235;
// the form; o.split lifts the name strip off upward (0 to 1) and o.cut hides it; o.ticks shows answers ticked
function ws_form(ctx,x,y,w,h,o){o=o||{};const c=ws_formC(w,h),k=w/400;ctx.save();ctx.translate(x,y);ctx.rotate(o.rot||0);const sy=-(o.split||0)*h*0.32;
  if(!o.cut){ctx.save();ctx.beginPath();ctx.rect(-w/2-20,-h/2-20+sy,w+40,h*WS_FCUT+20);ctx.clip();ctx.drawImage(c,-w/2-20,-h/2-20+sy);ctx.restore();}
  if(!o.top){ctx.save();ctx.beginPath();ctx.rect(-w/2-20,-h/2+h*WS_FCUT,w+40,h);ctx.clip();ctx.drawImage(c,-w/2-20,-h/2-20);ctx.restore();
    if(o.ticks)for(let r=0;r<9;r++){const yy=-h/2+h*0.3+r*(h*0.66/9),bx=w/2-(120-((r*7)%3)*34)*k;wc_tick(ctx,bx+9*k,yy+9*k,22*k,[60,70,120],1,2.6*k);}}
  ctx.restore();}
// a bundle of forms lying on the counter, seen a little from above: the top form's face, foreshortened, and the stack's edges under it;
// string round it, tied (tied, 1) or loose (0)
function ws_bundle(ctx,x,y,w,tied){const fh=Math.round(w*0.2),c=wc_kept("bundle|"+w,w+40,fh+90,q=>{q.translate(20,20);q.save();q.filter="blur(5px)";q.fillStyle="rgba(60,44,30,0.26)";q.fillRect(6,fh+10,w,44);q.restore();
    for(let i=0;i<8;i++)wc_flat(q,wc_rect((i%2)*3,fh+i*5,w,6),i%2?WS_FORM:wc_dim(WS_FORM,0.07),1,"edge");
    q.save();q.scale(1,fh/(w*1.35));q.drawImage(ws_formC(w,Math.round(w*1.35)),-20,-20);q.restore();});
  ctx.drawImage(c,x-w/2-20,y-fh-60);if(tied>0){ctx.save();ctx.globalAlpha=clamp(tied*1.5,0,1);ctx.strokeStyle="rgba(176,146,96,0.95)";ctx.lineWidth=4;
    ctx.beginPath();ctx.moveTo(x,y-fh-40);ctx.lineTo(x,y);ctx.moveTo(x-w/2,y-fh*0.5-40);ctx.quadraticCurveTo(x,y-fh*0.5-34,x+w/2,y-fh*0.5-40);ctx.stroke();
    ctx.fillStyle="rgba(176,146,96,0.95)";ctx.beginPath();ctx.ellipse(x,y-fh*0.5-38,10,6,0.3,0,TAU);ctx.fill();ctx.restore();}}
// a census form held up in both hands by its top corners, facing us, under the chin (in the figure's units)
function ws_heldForm(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2,w=190,h=256;cx.save();cx.translate(mx,my+62);cx.rotate(-0.03);
  cx.drawImage(ws_formC(w,h),-w/2-20,-h/2-20);cx.restore();fingers(cx,P_,[[mx-w/2+10,my-56],[mx+w/2-10,my-60]]);}
// a card from the register of residents: an index card with a red rule, a name line and lines under it
function ws_regCard(ctx,x,y,w,h,rot){const c=wc_kept("regcard|"+w,w+40,h+40,q=>{q.translate(20,20);q.save();q.filter="blur(5px)";q.fillStyle="rgba(60,50,40,0.22)";q.fillRect(5,8,w,h);q.restore();
    wc_wash(q,wc_rect(0,0,w,h),[250,246,232],{kind:"page",lw:1.3,seed:w});q.fillStyle="rgba(200,70,60,0.7)";q.fillRect(10,h*0.24,w-20,3);q.fillStyle=rgba([90,110,150],0.35);for(let i=0;i<5;i++)q.fillRect(16,h*0.36+i*h*0.12,w*(i===4?0.5:0.86),3);
    q.fillStyle=rgba([40,40,60],0.75);q.fillRect(16,h*0.1,w*0.5,h*0.08);});ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);ctx.drawImage(c,-w/2-20,-h/2-20);ctx.restore();}
// a small painted card, flying from the form to the town's map: a house, a school, a bus
function ws_planCard(ctx,k,x,y,s){const c=wc_kept("plancard"+k,150,130,q=>{q.translate(15,15);wc_wash(q,wc_rect(0,0,120,100),WC_CARD,{kind:"paper",lw:1.4,seed:61+k});
    if(k===0){wc_part(q,wc_rect(34,46,52,38),[214,150,110],1);wc_part(q,[[28,48],[60,22],[92,48]],[150,80,70],1);wc_flat(q,wc_rect(54,62,14,22),[110,80,60],1,"door");}
    if(k===1){wc_part(q,wc_rect(22,44,76,40),[222,196,140],1);wc_part(q,[[18,46],[60,24],[102,46]],[120,110,130],1);wc_part(q,wc_rect(54,16,12,16),[120,110,130],1);for(let i=0;i<3;i++)wc_flat(q,wc_rect(30+i*22,54,12,12),[120,150,190],1,"pane");}
    if(k===2){wc_part(q,wc_rrPts(16,30,88,44,10),[236,196,70],1);for(let i=0;i<3;i++)wc_flat(q,wc_rect(24+i*24,38,18,14),[150,190,220],1,"pane");for(const wx of [34,86])wc_wash(q,wc_ell(wx,76,9,9,14),[50,50,56],{kind:"thing",lw:1.2});}});
  ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.drawImage(c,-75,-65);ctx.restore();}
// a poster on the column, unrolling from the top as u goes 0 to 1: a form crossed through, an eye with a hand over it, a question mark
const WS_POST=[[[244,214,60],[40,40,46]],[[70,110,170],[250,248,240]],[[232,120,60],[40,34,30]]];
function ws_posterC(k,w,h){return wc_kept("poster"+k+"|"+w,w+20,h+20,q=>{q.translate(10,10);const [bg,fg]=WS_POST[k];wc_wash(q,wc_rect(0,0,w,h),bg,{kind:"paper",lw:1.3,seed:71+k});
  q.save();q.translate(w/2,h*0.46);q.lineCap="round";q.lineJoin="round";
  if(k===0){q.fillStyle=rgba(WS_FORM,1);q.fillRect(-w*0.24,-h*0.26,w*0.48,h*0.5);q.fillStyle=rgba(fg,0.5);for(let i=0;i<5;i++)q.fillRect(-w*0.18,-h*0.18+i*h*0.08,w*0.36,4);
    q.strokeStyle=rgba([200,40,40],1);q.lineWidth=w*0.07;q.beginPath();q.moveTo(-w*0.32,-h*0.3);q.lineTo(w*0.32,h*0.3);q.stroke();}
  if(k===1){q.strokeStyle=rgba(fg,1);q.lineWidth=w*0.045;q.beginPath();q.moveTo(-w*0.34,0);q.quadraticCurveTo(0,-h*0.2,w*0.34,0);q.quadraticCurveTo(0,h*0.2,-w*0.34,0);q.stroke();
    q.fillStyle=rgba(fg,1);q.beginPath();q.arc(0,0,w*0.09,0,TAU);q.fill();q.fillStyle=rgba([226,180,150],1);q.beginPath();q.moveTo(-w*0.3,-h*0.04);q.quadraticCurveTo(-w*0.1,-h*0.2,w*0.18,-h*0.12);
    q.lineTo(w*0.3,-h*0.18);q.lineTo(w*0.32,-h*0.12);q.lineTo(w*0.2,-h*0.04);q.quadraticCurveTo(0,h*0.06,-w*0.3,h*0.04);q.closePath();q.fill();q.strokeStyle=rgba([150,100,80],0.8);q.lineWidth=2;q.stroke();}
  if(k===2){q.fillStyle=rgba(fg,1);q.font=font(800,h*0.56);q.textAlign="center";q.fillText("?",0,h*0.2);}
  q.restore();});}
function ws_poster(ctx,k,x,y,w,h,u){if(u<=0)return;const e=easeCam(clamp(u,0,1));ctx.save();ctx.beginPath();ctx.rect(x-10,y-10,w+20,h*e+10);ctx.clip();ctx.drawImage(ws_posterC(k,w,h),x-10,y-10);ctx.restore();
  if(e<1){ctx.save();ctx.fillStyle=rgba(wc_lit(WS_POST[k][0],0.3),1);ctx.fillRect(x-2,y+h*e-6,w+4,12);ctx.restore();}}
// the judgment's words, on a sheet rising into the hall
function ws_judgment(ctx,x,y,u){if(u<=0)return;const e=easeCam(clamp(u,0,1)),w=880,h=230;ctx.save();ctx.translate(0,40*(1-e));withA(ctx,clamp(u*2,0,1),()=>{gv_sheet(ctx,x-w/2,y,w,h);
  wc_T(ctx,"each person may, in principle, decide",x,y+92,{w:700,size:36,align:"center",col:WC_DARK});wc_T(ctx,"on the disclosure and use of their personal data",x,y+148,{w:700,size:36,align:"center",col:WC_DARK});
  wc_T(ctx,"15 December 1983",x,y+200,{w:600,size:28,align:"center",col:WC_MUTED});});ctx.restore();}
// four slips, each one answer from the form, sliding together into the outline of a person (u 0 to 1): no name, and still someone
const WS_SLIPS=[["age 34",[-1,-1]],["nurse",[1,-1]],["2 children",[-1,1]],["bus 12",[1,1]]];
function ws_slips(ctx,cx,cy,u,ring){const e=easeCam(clamp(u,0,1));
  if(ring>0){const a=clamp(ring,0,1);withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.7);ctx.lineWidth=4;ctx.setLineDash([3,10]);ctx.lineCap="round";ctx.beginPath();ctx.arc(cx,cy-190,80,0,TAU);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx-230,cy+250);ctx.quadraticCurveTo(cx-230,cy-80,cx,cy-90);ctx.quadraticCurveTo(cx+230,cy-80,cx+230,cy+250);ctx.stroke();ctx.restore();});}
  WS_SLIPS.forEach(([s,[sx,sy]],i)=>{const x=cx+sx*lerp(560,120,e),y=cy+sy*lerp(280,60,e)+40,r=(i%2?0.05:-0.04)*(1-e);ctx.save();ctx.translate(x,y);ctx.rotate(r);
    const w=Math.round(tw(ctx,s,34,700)+60);wc_panel(ctx,-w/2,-36,w,72,{kind:"card",seed:80+i});wc_T(ctx,s,0,12,{w:700,size:34,align:"center",col:WC_DARK});ctx.restore();});}
// the tin box: a cash box, its lid open (open 1) or shut, and its lock turning (lock 0 to 1)
function ws_tinBox(ctx,x,y,open,lock){const w=300,h=200;wc_contact(ctx,x-w/2,x+w/2,y+h/2+8,1,0.35);ctx.drawImage(wc_kept("tin",w+40,h+40,q=>{q.translate(20,20);wc_part(q,wc_rrPts(0,0,w,h,14),WS_TIN,1,{seed:91});
    wc_part(q,wc_rrPts(12,12,w-24,h-24,10),wc_dim(WS_TIN,0.3),1,{seed:92});}),x-w/2-20,y-h/2-20);
  if(open>0.02){const k=open;ctx.save();ctx.translate(x,y-h/2);ctx.scale(1,lerp(1,-0.55,k));wc_panel(ctx,-w/2,0,w,h,{kind:"card",fill:wc_lit(WS_TIN,0.15),seed:93});ctx.restore();}
  else{wc_part(ctx,wc_rrPts(x-w/2,y-h/2,w,h,14),wc_lit(WS_TIN,0.12),1,{seed:94});wc_flat(ctx,wc_rect(x-w/2+20,y-6,w-40,8),wc_dim(WS_TIN,0.2),1,"seam");
    ctx.save();ctx.translate(x,y+50);wc_wash(ctx,wc_ell(0,0,22,22,20),[200,176,96],{kind:"thing",lw:1.3});ctx.rotate(lock*Math.PI/2);ctx.fillStyle=rgba([60,50,30],0.9);ctx.fillRect(-3,-12,6,24);ctx.restore();}}
// the tally: a sheet where the answers are counted in strokes of five, n of them so far
function ws_tally(ctx,x,y,n){gv_sheet(ctx,x,y,360,300);ctx.save();ctx.strokeStyle=rgba([60,70,120],0.85);ctx.lineWidth=4;ctx.lineCap="round";
  for(let i=0;i<Math.floor(n);i++){const g=Math.floor(i/5),j=i%5,gx=x+60+(g%3)*100,gy=y+60+Math.floor(g/3)*100;
    ctx.beginPath();if(j<4){ctx.moveTo(gx+j*16,gy);ctx.lineTo(gx+j*16+2,gy+56);}else{ctx.moveTo(gx-8,gy+44);ctx.lineTo(gx+60,gy+10);}ctx.stroke();}ctx.restore();}
// a shredder: a grey box with a slot; a strip goes in as u goes 0 to 1, and shreds fall into the basket under it
function ws_shredder(ctx,x,y,u){wc_part(ctx,wc_rrPts(x-170,y-60,340,120,16),[150,154,160],1,{seed:95});wc_flat(ctx,wc_rect(x-130,y-8,260,10),[50,52,58],1,"slot");
  if(u>0&&u<1){const e=clamp(u,0,1);ctx.save();ctx.beginPath();ctx.rect(x-200,y-400,400,394);ctx.clip();ctx.fillStyle=rgba(WS_FORM,1);ctx.fillRect(x-120,y-4-120*(1-e),240,120);ctx.restore();}
  if(u>0.1){ctx.save();ctx.strokeStyle=rgba(wc_dim(WS_FORM,0.15),0.9);ctx.lineWidth=5;for(let i=0;i<14;i++){const sx=x-110+i*17,l=Math.min(90,(u-0.1)*200);ctx.beginPath();ctx.moveTo(sx,y+62);ctx.lineTo(sx+3*Math.sin(i),y+62+l);ctx.stroke();}ctx.restore();}}

/* ---------- today: the shelf, and binder 6 ---------- */
// the shelf's 34 binders, numbered as Off the shelf numbered them (binder n is the n-th along the rows, from the left); binders 2 and
// 12 went to the work with the films before (Who decides; One word, one home), so their places stay empty. Binder 6 is this film's:
// o.out slides it forward (0 to 1), o.taken leaves it out once it's in Yusuf's hands
const WS_BIND={w:24,h:146,gap:26.6,x:1393,cols:[[96,118,150],[150,90,80],[120,140,104],[186,160,110],[132,136,150],[110,96,130]]};
const ws_bindCol=i=>WS_BIND.cols[Math.floor(hash(i,17)*WS_BIND.cols.length)];
function ws_bindPos(i){const B=WS_BIND,row=i<17?0:1;return[B.x+(i%17)*B.gap,GV_OFF.shelf.rows[1+row]];}
function ws_binders(ctx,o){o=o||{};const B=WS_BIND;for(let i=0;i<34;i++){if(i===1||i===11||(o.taken&&i===5))continue;const [x,y]=ws_bindPos(i),u=i===5&&o.out?o.out:0,bw=B.w+u*6;
  ctx.save();ctx.translate(0,-10*u);gv_binder(ctx,x-u*3,y-B.h,bw,B.h,ws_bindCol(i));ctx.restore();}}
// a binder in both hands, its label the film's title (in the figure's units, like the series' heldBinder)
function ws_heldTitled(lines,col){return(cx,P_,hands)=>{const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my+4);cx.rotate(-0.06);
  const w=168,h=214;cx.fillStyle=rgba(mix(col,[0,0,0],0.35),1);rr(cx,-w/2+9,-h/2+7,w,h,10);cx.fill();
  const g=cx.createLinearGradient(-w/2,-h/2,w/2,h/2);g.addColorStop(0,rgba(mix(col,[255,255,255],0.28),1));g.addColorStop(1,rgba(col,1));cx.fillStyle=g;rr(cx,-w/2,-h/2,w,h,10);cx.fill();
  cx.fillStyle="rgba(250,246,236,0.95)";for(let i=0;i<7;i++)cx.fillRect(w/2-2,-h/2+12+i*5,10,3.2);
  cx.fillStyle="rgba(255,252,242,0.97)";rr(cx,-w/2+16,-h/2+26,w-32,112,10);cx.fill();
  cx.fillStyle=rgba(mix(col,[0,0,0],0.5),1);cx.textAlign="center";cx.font=font(800,32);lines.forEach((s,i)=>cx.fillText(s,0,-h/2+74+i*38-(lines.length-1)*6));cx.restore();
  fingers(cx,P_,[[mx-w/2+4,my+30],[mx+w/2-2,my+24]]);};}
// binder 6 open on Yusuf's desk, seen from above: the inside of its cover on the left, policy 6's first page on the right, the rings
// between them. The paper is kept; the words are drawn every frame. WS_OB: where it lies; ws_obLine: where the policy's first line is
const WS_OB={x:250,y:96,w:1420,h:800};
function ws_openBinderC(){const B=WS_OB,col=ws_bindCol(5);return wc_kept("openBinder",B.w+80,B.h+80,q=>{q.translate(40,40);const w=B.w,h=B.h,m=w/2;
  q.save();q.filter="blur(10px)";q.fillStyle="rgba(60,44,30,0.3)";q.fillRect(12,18,w,h);q.restore();
  wc_wash(q,wc_rrPts(0,0,w,h,14),col,{kind:"cover",lw:1.6,seed:61});wc_wash(q,wc_rrPts(22,22,m-38,h-44,8),wc_lit(col,0.22),{kind:"swatch",line:false,a:0.7,seed:62});
  // a pocket on the inside of the cover, and the binder's own index card in it
  wc_part(q,wc_rect(70,h-330,m-150,250),wc_lit(col,0.4),1,{seed:63});wc_flat(q,wc_rect(110,h-300,m-230,120),WC_CARD,1,"card");
  q.fillStyle=rgba(WC_MUTED,0.3);for(let i=0;i<3;i++)q.fillRect(136,h-268+i*28,(m-290)*(i===2?0.5:0.9),5);
  // the pages on the rings, their edges showing under the top one
  for(let i=3;i>=1;i--)wc_flat(q,wc_rect(m+16+i*3,20+i*3,m-46,h-40),wc_dim(GV.paper,0.05*i),1,"pages");
  wc_wash(q,wc_rect(m+16,20,m-46,h-40),GV.paper,{kind:"page",lw:1.3,seed:64});
  for(const y of [140,h/2,h-140])wc_wash(q,wc_ell(m+52,y,13,13,20),wc_dim(GV.oak,0.12),{kind:"thing",lw:1.1,seed:y|0});
  // the ring mechanism: a metal bar down the spine, three rings over it
  wc_part(q,wc_rrPts(m-26,60,52,h-120,18),GV.metal,1,{kind:"thing",seed:65});
  for(const y of [140,h/2,h-140]){q.save();q.strokeStyle=rgba(wc_dim(GV.metal,0.35),0.95);q.lineWidth=11;q.lineCap="round";q.beginPath();q.ellipse(m+10,y,46,15,0,Math.PI*0.95,Math.PI*2.05);q.stroke();
    q.strokeStyle="rgba(255,255,255,0.55)";q.lineWidth=3;q.beginPath();q.ellipse(m+10,y-3,44,12,0,Math.PI*1.1,Math.PI*1.6);q.stroke();q.restore();}});}
const ws_obX=()=>WS_OB.x+WS_OB.w/2+100;
function ws_openBinder(ctx,a){if(a<=0.01)return;const B=WS_OB,x=ws_obX();withA(ctx,a,()=>{ctx.drawImage(ws_openBinderC(),B.x-40,B.y-40);
  wc_T(ctx,"Policy 6 · Data protection",x,B.y+130,{w:800,size:40,col:WC_DARK});
  wc_T(ctx,"6.1",x,B.y+268,{w:700,size:30,col:WC_MUTED});ws_obLine().forEach((s,i)=>wc_T(ctx,s,x+70,B.y+268+i*46,{w:600,size:30,col:WC_INK}));
  [6.2,6.3,6.4,6.5].forEach((n,i)=>{const y=B.y+420+i*96;wc_T(ctx,String(n),x,y,{w:700,size:30,col:WC_MUTED,a:0.55,deco:1});gv_lines(ctx,x+70,y-18,470,2,30,0.9);});});}
const ws_obLine=()=>["Personal data is classified","and protected."];

/* ---------- today: the old path, as it went until now ---------- */
// a memory: the desk's colours fade a little, warmer and paler, while the old path's papers come in on top (a, 0 to 1)
function ws_memory(ctx,a){if(a<=0.01)return;ctx.save();ctx.globalCompositeOperation="saturation";ctx.fillStyle=rgba([128,128,128],0.6*a);ctx.fillRect(-W,-H,3*W,3*H);
  ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba([248,230,204],0.7*a);ctx.fillRect(-W,-H,3*W,3*H);ctx.globalCompositeOperation="source-over";ctx.fillStyle=rgba(WC_PAPER,0.22*a);ctx.fillRect(-W,-H,3*W,3*H);ctx.restore();}
// the request form: its heading, boxes to fill in, a signature
function ws_reqForm(ctx,x,y,rot,a){if(a<=0.01)return;const w=420,h=540,c=wc_kept("reqform",w+40,h+40,q=>{q.drawImage(gv_sheetPaper(w,h),0,0);q.translate(20,20);
    q.strokeStyle=rgba(WC_MUTED,0.55);q.lineWidth=2;for(let i=0;i<5;i++)q.strokeRect(38,132+i*66,w-76,40);q.fillStyle=rgba(WC_MUTED,0.35);for(let i=0;i<5;i++)q.fillRect(38,118+i*66,90+30*(i%3),6);
    q.strokeStyle=rgba([40,50,110],0.8);q.lineWidth=2.6;q.lineCap="round";q.beginPath();q.moveTo(64,h-44);for(let k=1;k<14;k++)q.lineTo(64+k*13,h-44-11*Math.sin(k*1.3)+(k%4)*2);q.stroke();});
  ctx.save();ctx.translate(x,y);ctx.rotate(rot);withA(ctx,a,()=>{ctx.drawImage(c,-w/2-20,-h/2-20);wc_T(ctx,"request for access",0,-h/2+68,{w:800,size:32,align:"center",col:WC_DARK});});ctx.restore();}
// the approval, printed from an email: its header, a rule, one word
function ws_emailPrint(ctx,x,y,rot,a){if(a<=0.01)return;const w=440,h=300,c=wc_kept("emailprint",w+40,h+40,q=>{q.drawImage(gv_sheetPaper(w,h),0,0);q.translate(20,20);
    q.fillStyle=rgba(WC_MUTED,0.42);for(let i=0;i<3;i++)q.fillRect(36,40+i*26,[200,262,170][i],6);q.fillStyle=rgba(WC_MUTED,0.25);q.fillRect(36,128,w-72,3);
    for(let i=0;i<2;i++)q.fillRect(36,236+i*24,[300,180][i],5);});
  ctx.save();ctx.translate(x,y);ctx.rotate(rot);withA(ctx,a,()=>{ctx.drawImage(c,-w/2-20,-h/2-20);wc_T(ctx,"Approved",-w/2+36,-h/2+200,{w:800,size:46,col:WC_DARK});});ctx.restore();}
// a desk calendar, from above: its back, the pages under rings at the top. A page shows a month and a day (drawn every frame); the top
// page lifts towards the rings as it turns (flip, 0 to 1), the next one under it
function ws_calBaseC(){return wc_kept("calbase",360,380,q=>{q.translate(20,40);q.save();q.filter="blur(7px)";q.fillStyle="rgba(60,44,30,0.28)";q.fillRect(6,10,300,300);q.restore();
  wc_wash(q,wc_rect(0,0,300,300),[96,110,140],{kind:"cover",lw:1.4,seed:71});});}
function ws_calRingsC(){return wc_kept("calrings",360,80,q=>{q.translate(20,40);for(let i=0;i<9;i++){q.strokeStyle=rgba([84,88,100],0.95);q.lineWidth=4.5;q.beginPath();q.ellipse(36+i*29,22,7,14,0,0,TAU);q.stroke();}});}
function ws_calPageC(){return wc_kept("calpage",312,300,q=>{q.translate(20,20);wc_wash(q,wc_rect(0,0,272,262),GV.paper,{kind:"page",lw:1.2,seed:72});wc_flat(q,wc_rect(2,2,268,58),[198,96,74],1,"band");});}
function ws_calPage(ctx,x,y,m,d,k){if(k<=0.02)return;const d0=k<0.95?1:0;ctx.save();ctx.translate(x,y-126);ctx.scale(1,k);ctx.drawImage(ws_calPageC(),-156,-20);
  wc_T(ctx,m,0,42,{w:800,size:32,align:"center",col:[255,255,255],deco:d0});wc_T(ctx,d,0,196,{w:800,size:116,align:"center",col:WC_DARK,deco:d0});ctx.restore();}
function ws_calendar(ctx,x,y,cur,next,flip){ctx.drawImage(ws_calBaseC(),x-170,y-190);if(flip>0.001&&next)ws_calPage(ctx,x,y,next[0],next[1],1);
  ws_calPage(ctx,x,y,cur[0],cur[1],1-clamp(flip,0,1));ctx.drawImage(ws_calRingsC(),x-170,y-190);}
// the whole learner table, printed: a long sheet unrolling across the desk from the left (u, 0 to 1), every column filled, names and
// emails too
const WS_PRINT={w:1480,h:250,cols:[[40,"key",150],[250,"student ID",190],[520,"name",250],[820,"email",340],[1230,"status",170]]};
function ws_printC(){const P=WS_PRINT;return wc_kept("printout",P.w+40,P.h+40,q=>{q.drawImage(gv_sheetPaper(P.w,P.h),0,0);q.translate(20,20);q.fillStyle=rgba(WC_MUTED,0.22);q.fillRect(30,112,P.w-60,3);
  for(let r=0;r<5;r++){const y=136+r*22;P.cols.forEach(([x,,cw],i)=>{const dark=i===2||i===3;q.fillStyle=rgba(dark?[58,50,72]:WC_MUTED,dark?0.6:0.36);q.fillRect(x,y,cw*(0.5+0.45*hash(r*7+i,3)),7);});}});}
function ws_printout(ctx,x,y,u,a){if(u<=0||a<=0.01)return;const P=WS_PRINT,e=easeCam(clamp(u,0,1));withA(ctx,a,()=>{ctx.save();ctx.beginPath();ctx.rect(x-40,y-40,P.w*e+60,P.h+80);ctx.clip();
    ctx.drawImage(ws_printC(),x-20,y-20);wc_T(ctx,"learner table",x+40,y+52,{w:800,size:30,col:WC_DARK});P.cols.forEach(([cx,s])=>wc_T(ctx,s,x+cx,y+96,{w:700,size:28,col:WC_MUTED}));ctx.restore();
  // the roll, still to unroll
  if(e<0.995){const rx=x+P.w*e,g=ctx.createLinearGradient(rx-22,0,rx+22,0);g.addColorStop(0,"rgba(200,192,176,1)");g.addColorStop(0.5,"rgba(255,253,248,1)");g.addColorStop(1,"rgba(196,186,170,1)");
    ctx.save();ctx.fillStyle="rgba(60,44,30,0.2)";ctx.fillRect(rx-18,y+8,46,P.h);ctx.fillStyle=g;rr(ctx,rx-22,y-6,44,P.h+12,18);ctx.fill();ctx.strokeStyle=rgba(WC_PENCIL,0.6);ctx.lineWidth=1.6;ctx.stroke();ctx.restore();}});}
// a key on a string and a paper tag: access, granted to one person by name
function ws_keyC(){return wc_kept("key",260,120,q=>{q.translate(20,60);const c=[214,176,92];
  wc_wash(q,wc_ell(36,0,34,34,30),c,{kind:"thing",lw:1.3,seed:81});q.save();q.globalCompositeOperation="destination-out";q.beginPath();q.arc(30,0,12,0,TAU);q.fill();q.restore();
  wc_part(q,wc_rect(66,-8,150,16),c,1,{seed:82});wc_part(q,[[170,8],[186,8],[186,30],[178,24],[170,30]],c,1,{seed:83});wc_part(q,[[196,8],[214,8],[214,26],[196,26]],c,1,{seed:84});});}
function ws_keyTag(ctx,x,y,rot,name,a){if(a<=0.01)return;ctx.save();ctx.translate(x,y);ctx.rotate(rot);withA(ctx,a,()=>{ctx.drawImage(ws_keyC(),-20,-60);
  ctx.strokeStyle=rgba([150,128,92],0.9);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(8,14);ctx.quadraticCurveTo(-10,70,24,110);ctx.stroke();
  const w=Math.round(tw(ctx,name,32,800)+60);wc_panel(ctx,8,106,w,66,{kind:"tag",seed:85});wc_T(ctx,name,8+w/2,151,{w:800,size:32,align:"center",col:WC_DARK});});ctx.restore();}

/* ---------- today: who can read the learner table ---------- */
// the 41 people the platform's grants name, as Sam's screen lists them: people from other jobs, years of requests granted by name. Nine
// have moved on (WS_GONE). After Yusuf's review in December, two groups read the table: the registrar's office (WS_REG) and the data
// team (WS_DATA); everyone else reads Planning's marts, or asks
const WS_WHO=["M. Tanaka","J. Park","P. Ndlovu","E. Fischer","R. Gupta","T. Moreno","A. Moreau","K. Kowalski","L. Silva","D. Novak","H. Sato",
  "I. Andersson","C. Okoye","F. Rahman","G. Varga","B. Herrera","S. Bianchi","N. Mwangi","P. Kaur","V. Dupont","O. Sorensen","Y. Ito","M. Pereira",
  "A. Nakamura","T. Adeyemi","R. Horvat","E. Larsen","J. Bakker","K. Quinn","L. Romero","S. Takahashi","H. Eriksen","D. Molina","U. Abara",
  "Z. Iqbal","C. Fontaine","M. Kovac","R. Duarte","A. Shah","W. Brooks","G. Hoffmann"];
const WS_GONE=[5,9,14,18,23,27,31,35,39],WS_REG=[0,2,6,10,13,16,20,24,28,33],WS_DATA=[1,11,19,25,36];
// where name i sits on the screen close (GV_SC): four columns of eleven
const ws_whoAt=i=>{const [x,y]=GV_SC;return[x+50+Math.floor(i/11)*300,y+150+(i%11)*44];};
// the list: the names coming in (fill, 0 to 1), the nine going grey (grey), and, in December, the names going into the two groups'
// cards (gather) while the rest fall away
function ws_whoList(ctx,fill,grey,gather,dec){const [X,Y,Wd,Hd]=GV_SC;
  gv_screen(ctx,X,Y,Wd,Hd,"learner table · who can read"+(dec?" · December 2026":""),null,{barH:52,titleSize:30});
  const cards=[[X+120,Y+250,480,"registrar's office","keeps the learners' records",WS_REG],[X+660,Y+250,480,"data team","builds the models",WS_DATA]];
  const g=easeCam(clamp(gather,0,1));
  if(g>0)cards.forEach(([cx,cy,cw,a,b],k)=>withA(ctx,clamp(gather*2.2-0.9-k*0.15,0,1),()=>{wc_panel(ctx,cx,cy,cw,170,{kind:"card",wash:GV.gold,washA:0.12,seed:90+k});
    wc_T(ctx,a,cx+cw/2,cy+70,{w:800,size:34,align:"center",col:WC_DARK});wc_T(ctx,b,cx+cw/2,cy+122,{w:600,size:30,align:"center",col:WC_INK});}));
  WS_WHO.forEach((s,i)=>{const u=clamp(fill*1.25-i/41*0.25,0,1)*clamp((fill*41-i)*1.5,0,1);if(u<=0.01)return;const gone=WS_GONE.includes(i),gr=gone?clamp(grey,0,1):0;
    let [x,y]=ws_whoAt(i),a=u;const k=WS_REG.indexOf(i)>=0?0:WS_DATA.indexOf(i)>=0?1:-1;
    if(g>0){if(k>=0){const [cx,cy,cw]=cards[k],v=easeCam(clamp(gather*1.6-0.1-0.25*((i*7)%11)/11,0,1));x=lerp(x,cx+cw/2-60,v);y=lerp(y,cy+86,v);a*=1-clamp(v*1.4-0.4,0,1);}
      else{const v=clamp(gather*1.8-0.2-(gone?0:0.3),0,1);y+=v*v*120;a*=1-v;}}
    if(a>0.01)wc_T(ctx,s,x,y,{w:600,size:28,col:mix(WC_INK,[176,174,184],gr),a});});
  const fa=clamp(fill*3-2,0,1)*(1-g);if(fa>0.01){wc_T(ctx,"41 people",X+50,Y+Hd-30,{w:800,size:30,col:WC_DARK,a:fa});
    if(grey>0)wc_T(ctx,"9 moved on",X+260,Y+Hd-30,{w:700,size:30,col:[150,148,160],a:fa*clamp(grey*2,0,1)});}}

/* ---------- today: the classes, and the mask ---------- */
// a class, as a chip beside a column: direct in deep plum, pseudonymous in a paler plum, none in plain paper; returns its width
const WS_CLS={direct:WS_DIRECT,pseudonymous:WS_PSEUDO,none:WS_NONE};
function ws_chip(ctx,x,y,cls,o){o=o||{};const s=o.size||28,w=Math.round(tw(ctx,cls,s,700)+44),h=s+22;
  wc_panel(ctx,x,y-h/2,w,h,{kind:"chip",fill:WS_CLS[cls],seed:cls.length+3});wc_T(ctx,cls,x+22,y+s*0.36,{w:700,size:s,col:cls==="direct"?[255,255,255]:WC_DARK});return w;}
// a chip coming in at t0: it lands a little large and settles
function ws_chipAt(ctx,t,t0,x,y,cls,o){const u=fin(t,t0,0.4);if(u<=0)return;const k=lerp(1.25,1,spring(fin(t,t0,0.55)));ctx.save();ctx.translate(x,y);ctx.scale(k,k);
  withA(ctx,clamp(u*2,0,1),()=>ws_chip(ctx,0,0,cls,o));ctx.restore();}
// the mask: a plum band with stars on it, over a value, sliding in from the left as u goes 0 to 1; everyone outside the registrar's office
// reads ***
function ws_mask(ctx,x,y,w,h,u,o){if(u<=0)return;o=o||{};const e=easeCam(clamp(u,0,1)),s=o.size||28;ctx.save();ctx.beginPath();ctx.rect(x-10,y-10,(w+20)*e,h+20);ctx.clip();
  wc_panel(ctx,x,y,w,h,{kind:"card",fill:WS_DIRECT,seed:(w+h)|0});wc_T(ctx,"***",x+18,y+h/2+s*0.5,{w:800,size:s+4,f:"mono",col:[255,255,255]});ctx.restore();}

/* ---------- today: the learner table, as the registrar's office sees it ---------- */
// five of core_learner's columns, with a value from the example project's sample data (Aisha Karimi, the learner the series follows)
const WS_COLS=[["learner_key","pseudonymous","0905e6e2…"],["learner_bk","direct","SIS|S-20417"],["full_name","direct","Aisha Karimi"],["email","direct","aisha.k@mail.example"],
  ["status","none","completed"]];
// where row i is on a screen close (GV_SC), and where its chip sits
const WS_CL={x:GV_SC[0]+56,chip:GV_SC[0]+430,val:GV_SC[0]+760,y:GV_SC[1]+190,dy:96};
function ws_colList(ctx,o){o=o||{};const [X,Y,Wd,Hd]=GV_SC,L=WS_CL;gv_screen(ctx,X,Y,Wd,Hd,"learner table",null,{barH:52,titleSize:30});
  wc_T(ctx,"core_learner",X+Wd-36,Y+37,{w:500,size:28,f:"mono",align:"right",col:[226,234,246]});
  wc_T(ctx,"column",L.x,Y+110,{w:700,size:28,col:WC_MUTED});wc_T(ctx,"class",L.chip,Y+110,{w:700,size:28,col:WC_MUTED});wc_T(ctx,"value",L.val,Y+110,{w:700,size:28,col:WC_MUTED});
  WS_COLS.forEach(([n,cls,v],i)=>{const y=L.y+i*L.dy,hi=o.hi?o.hi(i):0;if(hi>0.01)gv_tint(ctx,X+20,y-44,Wd-40,72,WS_HI,0.6*hi);
    wc_T(ctx,n,L.x,y,{w:500,size:30,f:"mono",col:WC_DARK});wc_T(ctx,v,L.val,y,{w:500,size:30,f:"mono",col:WC_INK,a:o.vals==null?1:o.vals});
    if(o.chip&&!(o.lift&&i===3))ws_chipAt(ctx,o.t,o.chip(i),L.chip,y-10,cls,{size:30});});}
// the project's own lines for the email column (models/core/student/_core_student__models.yml, lines 79 to 83; the description cut),
// the class lit (hi, 0 to 1)
const WS_YAML=[["79","- name: email"],["80","  description: The learner's email, lower case, …"],["81","  data_type: string"],["82","  config:"],["83","    meta: {personal_data: direct}"]];
function ws_yaml(ctx,hi,a){const [X,Y,Wd,Hd]=GV_SC;withA(ctx,a==null?1:a,()=>{gv_screen(ctx,X,Y,Wd,Hd,"_core_student__models.yml",null,{barH:52,titleSize:30,bar:[64,72,96]});
  WS_YAML.forEach(([n,s],i)=>{const y=Y+190+i*80;if(i===4&&hi>0.01){const w=tw(ctx,s.trim(),32,500,"mono");ctx.save();ctx.globalCompositeOperation="multiply";
      ctx.fillStyle=rgba(wc_lit(WS_PSEUDO,0.2),0.95*hi);rr(ctx,X+200+72-14,y-38,(w+28)*easeCam(clamp(hi*1.4,0,1)),54,10);ctx.fill();ctx.restore();}
    wc_T(ctx,n,X+60,y,{w:500,size:30,f:"mono",col:WC_MUTED});wc_T(ctx,s,X+200,y,{w:500,size:32,f:"mono",col:i===4?WS_DIRECTINK:WC_DARK});});});}
// the governance check, on the data team's screen: a column with no class stops the change (red), then, classed, it passes (ok, 0 to 1)
function ws_check(ctx,red,ok){const [X,Y,Wd,Hd]=GV_SC;gv_screen(ctx,X,Y,Wd,Hd,"governance check",null,{barH:52,titleSize:30,bar:[54,62,80]});
  wc_T(ctx,"core_credential",X+60,Y+140,{w:500,size:30,f:"mono",col:WC_MUTED});const r=clamp(red,0,1)*(1-0.6*clamp(ok,0,1)),col=mix(GV.redInk,[150,148,160],clamp(ok,0,1));
  if(r>0.01){wc_T(ctx,"credential_bk has no meta.personal_data:",X+60,Y+214,{w:500,size:32,f:"mono",col,a:r});wc_T(ctx,"say whether it identifies a person",X+60,Y+266,{w:500,size:32,f:"mono",col,a:r});}
  if(ok>0){wc_tick(ctx,X+92,Y+392,48,GV.greenInk,clamp(ok*2,0,1),6);withA(ctx,clamp(ok*2-0.5,0,1),()=>wc_T(ctx,"Governance's rules are met",X+150,Y+404,{w:800,size:36,col:GV.greenInk}));}}
// a credential's key, three of them, as the doc block gives them (models/core/student/_student__columns.md, lines 24 to 27): two that
// are only codes, and an award's, which holds the student's ID
const WS_KEYS=[["LMS|B-5010","a badge"],["SC|C-88","a certificate"],["SIS|S-20417|GCDA","an award"]];
const WS_KY={x:GV_SC[0]+120,y:GV_SC[1]+300,dy:120,note:GV_SC[0]+760,size:46};
// o: ticks (the two codes), id (the student ID lit), ring (the 1983 pencil round it), line (the court's line, drawn at the column),
// chip (when the class lands), t
function ws_keys(ctx,o){const [X,Y,Wd,Hd]=GV_SC,K=WS_KY;gv_screen(ctx,X,Y,Wd,Hd,"credentials",null,{barH:52,titleSize:30});
  wc_T(ctx,"core_credential",X+Wd-36,Y+37,{w:500,size:28,f:"mono",align:"right",col:[226,234,246]});wc_T(ctx,"credential_bk",K.x,Y+160,{w:500,size:36,f:"mono",col:WC_DARK});
  if(o.line>0)wc_pencil(ctx,[[K.x-34,Y+100],[K.x-36,Y+300],[K.x-33,Y+670]],o.line,{col:WC_PENCIL,lw:6,a:0.92,seed:31,amp:1.2});
  WS_KEYS.forEach(([k,n],i)=>{const y=K.y+i*K.dy;
    if(i===2&&o.id>0){const pre=tw(ctx,"SIS|",K.size,500,"mono"),w=tw(ctx,"S-20417",K.size,500,"mono");gv_tint(ctx,K.x+pre-8,y-46,w+16,62,WS_DIRECT,0.7*o.id);
      if(o.ring>0)wc_ring(ctx,K.x+pre+w/2,y-14,w/2+34,48,o.ring,{col:WC_PENCIL,lw:4,seed:17});
      const u=clamp(o.id*1.5-0.3,0,1);if(u>0)withA(ctx,u,()=>wc_tag(ctx,K.x+pre+w/2,y+62,"student ID",{align:"center",size:30,wash:WS_DIRECT,washA:0.35,seed:19}));}
    wc_T(ctx,k,K.x,y,{w:500,size:K.size,f:"mono",col:WC_DARK});wc_T(ctx,n,K.note,y-4,{w:600,size:30,col:WC_MUTED});
    if(i<2&&o.ticks)wc_tick(ctx,K.note-46,y-18,34,WC_PENCIL,o.ticks(i),4);});
  if(o.chip!=null)ws_chipAt(ctx,o.t,o.chip,K.x+tw(ctx,"credential_bk",36,500,"mono")+40,Y+148,"direct",{size:32});}

/* ---------- today: the mask follows the column ---------- */
// on Sam's screens at the platform team's desk (GV_PX): the email column with its tag (tag, 0 to 1, as the chip lands), and the one rule
// that reads the tag
function ws_tagScreen(ctx,t,t0){const [x,y,w,h]=GV_PX.screens[0];gv_screen(ctx,x,y,w,h,"core_learner",null,{barH:44,titleSize:28});
  wc_T(ctx,"email",x+30,y+98,{w:500,size:30,f:"mono",col:WC_DARK});wc_T(ctx,"tag",x+30,y+158,{w:700,size:28,col:WC_MUTED});
  if(t0!=null)ws_chipAt(ctx,t,t0,x+30,y+214,"personal_data = direct",{size:28});}
// and on the second screen, the one rule that reads the tag: values for the registrar's office, stars for everyone else (band slides them in)
function ws_ruleScreen(ctx,a,band){const [x,y,w,h]=GV_PX.screens[1];gv_screen(ctx,x,y,w,h,"rule",null,{barH:44,titleSize:28});withA(ctx,a,()=>{
  wc_T(ctx,"where the tag is direct:",x+30,y+96,{w:700,size:28,col:WC_MUTED});wc_T(ctx,"registrar's office: values",x+30,y+160,{w:700,size:30,col:WC_DARK});
  wc_T(ctx,"everyone else:",x+30,y+232,{w:700,size:30,col:WC_DARK});ws_mask(ctx,x+260,y+200,120,48,band,{size:28});});}
// the data team's board: cards on strings, from the systems the learner table is built from, through it, to what's built on it
// (WS_BD); each card's rows are columns. ws_bdAnchor: where a card's string leaves (side 1, right) or arrives (side -1, left)
const WS_BD={src:[[262,118,"student system"],[262,300,"learning platform"],[262,482,"short courses"]],
  lt:{x:690,y:250,w:420,title:"learner table",rows:["learner_key","email","status"]},
  wal:{x:1240,y:90,w:430,title:"wallet",rows:["learner_key","email","credentials_held"]},
  near:{x:1240,y:376,w:430,title:"near-award list",rows:["learner_key","award_code","credit_points_earned"]},
  tom:{x:1240,y:652,w:430,title:"built tomorrow",rows:["learner_key","email"]}};
const ws_bdH=c=>c.rows?84+c.rows.length*50:88;
const ws_bdAnchor=(c,side)=>c.rows?[side>0?c.x+c.w:c.x,c.y+ws_bdH(c)/2]:[side>0?c[0]+320:c[0],c[1]+44];
// a card: paper, a pin, its title, its rows; o.mask(r): the band over row r's values (0 to 1); o.lit: its title lit
function ws_bdCard(ctx,c,o){o=o||{};const h=ws_bdH(c);wc_panel(ctx,c.x,c.y,c.w,h,{kind:"card",seed:(c.x+c.y)|0});gv_pin(ctx,c.x+c.w/2,c.y+14,GV.grey,1.1);
  wc_T(ctx,c.title,c.x+28,c.y+60,{w:800,size:32,col:WC_DARK});ctx.save();ctx.fillStyle=rgba(WC_PENCIL,0.25);ctx.fillRect(c.x+24,c.y+80,c.w-48,2);ctx.restore();
  c.rows.forEach((r,i)=>{const y=c.y+126+i*50;wc_T(ctx,r,c.x+28,y,{w:500,size:28,f:"mono",col:WC_INK});if(o.mask){const u=o.mask(i);if(u>0)ws_mask(ctx,c.x+150,y-34,c.w-178,46,u,{size:28});}});}
function ws_srcCard(ctx,s){const [x,y,n]=s;wc_panel(ctx,x,y,320,88,{kind:"card",seed:x+y});gv_pin(ctx,x+160,y+12,GV.grey,1);wc_T(ctx,n,x+160,y+58,{w:800,size:30,align:"center",col:WC_DARK});}
// a string between two pins, sagging a little (p draws it on); and a bead travelling along it (u), plum for the mask, paler for the key
function ws_strPts(a,b){const pts=[];for(let i=0;i<=20;i++){const u=i/20;pts.push([lerp(a[0],b[0],u),lerp(a[1],b[1],u)+26*Math.sin(Math.PI*u)]);}return pts;}
function ws_string(ctx,a,b,p){if(p<=0)return;const pts=ws_strPts(a,b),n=Math.max(2,Math.round(pts.length*clamp(p,0,1)));ctx.save();ctx.strokeStyle=rgba([84,92,120],0.85);ctx.lineWidth=3.2;ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<n;i++)ctx.lineTo(pts[i][0],pts[i][1]);ctx.stroke();ctx.restore();gv_pin(ctx,a[0],a[1],GV.grey,0.8);if(p>=1)gv_pin(ctx,b[0],b[1],GV.grey,0.8);}
function ws_bead(ctx,a,b,u,col,r){if(u<=0||u>=1)return;const [x,y]=wc_along(ws_strPts(a,b),easeCam(u));ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,x,y,r*3,wc_lit(col,0.3),0.5);ctx.restore();
  ctx.save();ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.strokeStyle=rgba(wc_dim(col,0.3),0.9);ctx.lineWidth=2;ctx.stroke();ctx.restore();}

/* ---------- today: a purpose and a date ---------- */
// Clara's request, on Mei's screen: under the table's owner, who asks, what for, until when; Mei's approval for her office (ok, 0 to 1)
function ws_request(ctx,a,ok){const [X,Y,Wd,Hd]=GV_SC;gv_screen(ctx,X,Y,Wd,Hd,"access request",null,{barH:52,titleSize:30});withA(ctx,a,()=>{
  wc_T(ctx,"learner table · owner: registrar's office",X+60,Y+132,{w:600,size:30,col:WC_MUTED});wc_T(ctx,"Clara Jensen · Planning",X+60,Y+222,{w:800,size:40,col:WC_DARK});
  wc_T(ctx,"for: next term's places",X+60,Y+300,{w:600,size:36,col:WC_INK});wc_T(ctx,"until: 15 December",X+60,Y+362,{w:600,size:36,col:WC_INK});
  if(ok>0){wc_tick(ctx,X+96,Y+470,54,GV.goldInk,clamp(ok*2,0,1),7);withA(ctx,clamp(ok*2-0.6,0,1),()=>{wc_T(ctx,"approved by the registrar's office",X+156,Y+482,{w:800,size:36,col:GV.goldInk});
    wc_T(ctx,"Mei Tanaka",X+156,Y+540,{w:600,size:30,col:WC_MUTED});});}});}
// the key card that grants it: a group, the table, an end date (glow lights the date); its words at 28 px or more
function ws_accessCard(ctx,x,y,o){o=o||{};const w=300,h=196;ctx.save();ctx.translate(x,y);ctx.rotate(o.rot||0);withA(ctx,o.a==null?1:o.a,()=>{
  wc_panel(ctx,-w/2,-h/2,w,h,{kind:"card",wash:GV.gold,washA:0.1,seed:96});if(o.pin!==false)gv_pin(ctx,0,-h/2+14,GV.gold,1.1);
  ctx.save();ctx.translate(-w/2+24,-h/2+28);ctx.scale(0.36,0.36);ctx.drawImage(ws_keyC(),-20,-60);ctx.restore();
  wc_T(ctx,"Planning",-w/2+112,-h/2+62,{w:800,size:32,col:WC_DARK});wc_T(ctx,"learner table",-w/2+28,-h/2+118,{w:600,size:30,col:WC_INK});
  if(o.glow>0.01)gv_tint(ctx,-w/2+18,-h/2+136,w-36,50,GV.gold,0.8*o.glow);wc_T(ctx,"until 15 Dec",-w/2+28,-h/2+170,{w:700,size:30,col:GV.goldInk});});ctx.restore();}

/* ---------- today: Planning's list, and the learner table it needs ---------- */
// Planning's wall screen (GV_PL): the learners near an award on census day, rows from the example project's sample data
// (mart_planning__near_award): a key, the award, the credit held and still to go. No names: there's no column for them
const WS_NEAR=[["0905e6e2…","GCDA","45","15"],["0abde902…","GCDA","45","15"],["66efb51c…","MDA","110","10"],["8cb33ef0…","GCDA","45","15"],["372b5006…","GCHI","45","15"]];
const WS_NC=[[590,"key"],[810,"award"],[950,"credit held"],[1160,"to go"]];
function ws_nearList(ctx,sweep){const [x,y,w,h]=GV_PL.screen;gv_screen(ctx,x,y,w,h,"learners near an award",null,{barH:46,titleSize:28});
  wc_T(ctx,"census 31 March 2026",x+30,y+88,{w:600,size:28,col:WC_MUTED});
  if(sweep>0&&sweep<1){const sx=x+20+(w-40)*easeCam(sweep);ctx.save();ctx.globalCompositeOperation="multiply";const g=ctx.createLinearGradient(sx-160,0,sx+40,0);
    g.addColorStop(0,"rgba(255,226,150,0)");g.addColorStop(0.8,"rgba(255,226,150,0.9)");g.addColorStop(1,"rgba(255,226,150,0)");ctx.fillStyle=g;ctx.fillRect(x+10,y+104,w-20,44);ctx.restore();}
  WS_NC.forEach(([cx,s])=>wc_T(ctx,s,cx,y+136,{w:700,size:28,col:WC_MUTED}));ctx.save();ctx.fillStyle=rgba(WC_PENCIL,0.2);ctx.fillRect(x+20,y+150,w-40,2);ctx.restore();
  WS_NEAR.forEach((r,i)=>r.forEach((v,j)=>wc_T(ctx,v,WS_NC[j][0]+(j>=2?20:0),y+190+i*40,{w:500,size:28,f:"mono",col:WC_INK})));}
// the learner table's columns, on a card by the screen; status ringed (ring, 0 to 1)
const WS_LTC=["learner_key","learner_bk","full_name","email","status"];
function ws_ltCard(ctx,x,y,u,ring){if(u<=0)return;const e=easeCam(clamp(u,0,1)),w=300,h=330;ctx.save();ctx.translate(60*(1-e),0);withA(ctx,clamp(u*2,0,1),()=>{
  wc_panel(ctx,x,y,w,h,{kind:"card",seed:97});gv_pin(ctx,x+w/2,y+14,GV.grey,1.1);wc_T(ctx,"learner table",x+26,y+64,{w:800,size:30,col:WC_DARK});
  WS_LTC.forEach((s,i)=>wc_T(ctx,s,x+26,y+124+i*44,{w:500,size:28,f:"mono",col:WC_INK}));
  if(ring>0)wc_ring(ctx,x+26+tw(ctx,"status",28,500,"mono")/2,y+124+4*44-10,74,30,ring,{col:WC_PENCIL,lw:3.6,seed:23});});ctx.restore();}
// a sticky note, written on: its words in a hand (p reveals them)
function ws_sticky(ctx,x,y,lines,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const w=o.w||220,h=o.h||170,k=o.k==null?1:o.k;ctx.save();ctx.translate(x,y);ctx.rotate(o.rot||0);ctx.scale(k,k);
  withA(ctx,a,()=>{ctx.fillStyle="rgba(70,60,50,0.18)";ctx.fillRect(-w/2+4,-h/2+6,w,h);ctx.drawImage(wc_kept("sticky|"+w+"x"+h+"|"+(o.col||0),w+20,h+20,q=>{q.translate(10,10);wc_wash(q,wc_rect(0,0,w,h),GV_NOTE[o.col||0],{kind:"swatch",seed:w+h});}),-w/2-10,-h/2-10);
    lines.forEach((s,i)=>wc_hand(ctx,s,-w/2+24,-h/2+60+i*44,{size:o.size||32,w:700,col:o.ink||[60,54,90],p:o.p==null?1:clamp(o.p*lines.length-i,0,1)}));});ctx.restore();}
// the learner table as Clara (or the agent) reads it: the key and status as they are, learner_bk, full_name and email as stars. Rows from
// the example project's sample data. o.hi: the key and status columns lit; o.pulse: the stars lit
const WS_LT=[["0905e6e2…","completed"],["66efb51c…","studying"],["0abde902…","completed"],["8cb33ef0…","studying"]];
const WS_MT=[[50,"learner_key"],[330,"learner_bk"],[590,"full_name"],[850,"email"],[1080,"status"]];
function ws_maskTable(ctx,o){o=o||{};const [X,Y,Wd,Hd]=GV_SC;gv_screen(ctx,X,Y,Wd,Hd,o.title||"learner table",null,{barH:52,titleSize:30});
  wc_T(ctx,"core_learner",X+Wd-36,Y+37,{w:500,size:28,f:"mono",align:"right",col:[226,234,246]});
  if(o.hi>0.01)for(const k of [0,4])gv_tint(ctx,X+WS_MT[k][0]-16,Y+86,k?200:230,40+WS_LT.length*86+30,WS_HI,0.6*o.hi);
  WS_MT.forEach(([cx,s])=>wc_T(ctx,s,X+cx,Y+118,{w:500,size:28,f:"mono",col:WC_MUTED}));ctx.save();ctx.fillStyle=rgba(WC_PENCIL,0.2);ctx.fillRect(X+30,Y+136,Wd-60,2);ctx.restore();
  WS_LT.forEach(([k,st],i)=>{const y=Y+196+i*86;wc_T(ctx,k,X+WS_MT[0][0],y,{w:500,size:30,f:"mono",col:WC_INK});wc_T(ctx,st,X+WS_MT[4][0],y,{w:500,size:30,f:"mono",col:WC_INK});
    for(const k2 of [1,2,3])ws_mask(ctx,X+WS_MT[k2][0],y-36,200,50,1,{size:28});});
  if(o.pulse>0.01){ctx.save();ctx.globalCompositeOperation="screen";for(const k2 of [1,2,3])wc_glowAt(ctx,X+WS_MT[k2][0]+100,Y+330,260,[255,200,240],0.25*o.pulse);ctx.restore();}}

/* ---------- today: a key is still personal data ---------- */
// the scrambler, on Yusuf's desk from above: a small machine with a slot on each side and a crank; a slip with a student ID goes in on
// the left, a slip with its key (the sha-256's first characters) comes out on the right
const WS_SCR={x:960,y:560,w:380,h:250};
function ws_scramblerC(){const S=WS_SCR;return wc_kept("scrambler",S.w+80,S.h+80,q=>{q.translate(40,40);q.save();q.filter="blur(9px)";q.fillStyle="rgba(60,44,30,0.32)";q.fillRect(10,16,S.w,S.h);q.restore();
  wc_part(q,wc_rrPts(0,0,S.w,S.h,30),[132,150,140],1,{kind:"thing",seed:101});wc_part(q,wc_rrPts(26,24,S.w-52,S.h-48,20),[150,168,158],1,{seed:102});
  for(const sx of [-6,S.w-10])wc_flat(q,wc_rect(sx,S.h/2-44,16,88),[52,58,60],1,"slot");
  // gears seen through a window on the top, and the crank's arm and handle
  wc_wash(q,wc_ell(S.w/2-30,S.h/2,62,62,40),[206,220,214],{kind:"thing",lw:1.2,seed:103});q.save();q.strokeStyle=rgba([96,110,104],0.9);q.lineWidth=5;
  for(const [gx,gy,r] of [[S.w/2-50,S.h/2-6,30],[S.w/2+2,S.h/2+18,20]]){q.beginPath();q.arc(gx,gy,r,0,TAU);q.stroke();for(let k=0;k<10;k++){const a=k/10*TAU;q.beginPath();q.moveTo(gx+Math.cos(a)*r,gy+Math.sin(a)*r);q.lineTo(gx+Math.cos(a)*(r+8),gy+Math.sin(a)*(r+8));q.stroke();}}q.restore();
  wc_wash(q,wc_ell(S.w-84,S.h/2,26,26,30),[110,122,116],{kind:"thing",lw:1.2,seed:104});});}
function ws_scrambler(ctx,crank){const S=WS_SCR;ctx.drawImage(ws_scramblerC(),S.x-S.w/2-40,S.y-S.h/2-40);const cx=S.x+S.w/2-84,cy=S.y,a=crank*TAU;
  ctx.save();ctx.strokeStyle=rgba([70,78,74],1);ctx.lineWidth=12;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*70,cy+Math.sin(a)*70);ctx.stroke();
  ctx.fillStyle=rgba([150,92,64],1);ctx.beginPath();ctx.arc(cx+Math.cos(a)*70,cy+Math.sin(a)*70,15,0,TAU);ctx.fill();ctx.restore();}
// a paper slip with one value on it, in mono (o.glow lights it; o.cut clips it at a slot: only what's left of cutL, or right of cutR, shows)
function ws_slip(ctx,x,y,s,o){o=o||{};const sz=o.size||34,w=Math.round(tw(ctx,s,sz,500,"mono")+56),h=sz+38;ctx.save();if(o.cutL!=null||o.cutR!=null){ctx.beginPath();
    const l=o.cutR!=null?o.cutR:-W,r=o.cutL!=null?o.cutL:2*W;ctx.rect(l,y-200,r-l,400);ctx.clip();}
  withA(ctx,o.a==null?1:o.a,()=>{wc_panel(ctx,x-w/2,y-h/2,w,h,{kind:"card",wash:o.wash,washA:o.washA||0.35,seed:(s.length*7+w)|0});if(o.glow>0.01)gv_tint(ctx,x-w/2+8,y-h/2+8,w-16,h-16,WS_HI,0.8*o.glow);
    wc_T(ctx,s,x,y+sz*0.36,{w:500,size:sz,f:"mono",align:"center",col:WC_DARK});});ctx.restore();return w;}
// the student IDs that went through the scrambler, and the first characters of the key each gave
const WS_IDS=[["SIS|S-20401","9dc82789…"],["SIS|S-20402","66efb51c…"],["SIS|S-20403","0abde902…"],["SIS|S-20404","9a496a9f…"],["SIS|S-20405","7467ec4e…"],
  ["SIS|S-20406","e1c4f13e…"],["SIS|S-20407","4c6425db…"],["SIS|S-20408","5f8a7901…"],["SIS|S-20409","fdb9e5a9…"],["SIS|S-20410","5440b46d…"],["SIS|S-20411","459c5ea5…"],
  ["SIS|S-20412","e69dec44…"],["SIS|S-20413","dfed4e0e…"],["SIS|S-20414","4a088fa6…"],["SIS|S-20415","9e64382f…"],["SIS|S-20416","ee1f1641…"],["SIS|S-20417","0905e6e2…"]];
// the agent's card, beside the table it reads
function ws_agentCard(ctx,x,y,a){if(a<=0.01)return;withA(ctx,a,()=>{const w=560,h=128;wc_panel(ctx,x,y,w,h,{kind:"card",wash:WC_SIDE.tech,washA:0.2,seed:105});
  ctx.save();ctx.translate(x+64,y+h/2);ctx.strokeStyle=rgba(GV.cyanInk,0.9);ctx.lineWidth=4;rr(ctx,-28,-24,56,48,10);ctx.stroke();ctx.fillStyle=rgba(GV.cyanInk,0.9);
  for(const ex of [-11,11]){ctx.beginPath();ctx.arc(ex,-3,5,0,TAU);ctx.fill();}ctx.fillRect(-12,11,24,4);ctx.beginPath();ctx.moveTo(0,-24);ctx.lineTo(0,-36);ctx.stroke();ctx.restore();
  wc_T(ctx,"the data team's agent",x+120,y+54,{w:800,size:32,col:WC_DARK});wc_T(ctx,"counts and samples",x+120,y+100,{w:600,size:30,col:WC_INK});});}

/* ---------- today: copies, a tray, a calendar ---------- */
// a spreadsheet printed and copied, pinned to an office's glass on the floor (no words: its grid is what it is)
function ws_copyC(){return wc_kept("copy",170,210,q=>{q.drawImage(gv_sheetPaper(130,170),0,0);q.translate(20,20);q.strokeStyle=rgba([90,130,96],0.6);q.lineWidth=1.6;
  for(let r=0;r<=8;r++){q.beginPath();q.moveTo(12,18+r*17);q.lineTo(118,18+r*17);q.stroke();}for(let k=0;k<=4;k++){q.beginPath();q.moveTo(12+k*26.5,18);q.lineTo(12+k*26.5,154);q.stroke();}
  q.fillStyle=rgba([90,130,96],0.25);q.fillRect(12,18,106,17);});}
// the faculties' tray on Planning's desk, its label in front
function ws_tray(ctx,x,y,a){wc_part(ctx,[[x-80,y],[x+80,y],[x+70,y-34],[x-70,y-34]],[150,156,168],1,{lw:1.3,seed:107});wc_tag(ctx,x,y+30,"faculties",{align:"center",size:28,seed:108});}
// a desk calendar on Planning's desk, from the front: the month on its band, the day (drawn every frame)
function ws_tent(ctx,x,y,m,d,a){const w=150,h=150;withA(ctx,a==null?1:a,()=>{wc_panel(ctx,x-w/2,y-h,w,h,{kind:"card",seed:109});ctx.save();ctx.fillStyle=rgba([198,96,74],0.92);rr(ctx,x-w/2+8,y-h+8,w-16,44,8);ctx.fill();ctx.restore();
  wc_T(ctx,m,x,y-h+40,{w:800,size:28,align:"center",col:[255,255,255]});wc_T(ctx,d,x,y-28,{w:800,size:62,align:"center",col:WC_DARK});});}

/* ---------- 1983 into today: the court's line, between columns ---------- */
// the form's pencil line, across it between the names and the answers, turns (u, 0 to 1) into the line between a table's columns: on the
// left what's counted (key, status, credit), on the right who it is (name, email); band lays the mask over the right side (0 to 1)
const WS_TB={x:560,y:200,w:800,h:600,div:1066,cols:[[600,"key"],[740,"status"],[890,"credit"],[1100,"name"],[1222,"email"]]};
function ws_lineAt(u,form){const T_=WS_TB,e=easeCam(clamp(u,0,1)),[fx,fy,fw,fh]=form,yl=fy-fh/2+fh*WS_FCUT;
  return[[lerp(fx-fw/2-30,T_.div,e),lerp(yl,T_.y-30,e)],[lerp(fx+fw/2+30,T_.div,e),lerp(yl,T_.y+T_.h+30,e)]];}
function ws_line(ctx,a,b,p,lw){if(p<=0)return;const n=40,m=Math.max(2,Math.round(n*clamp(p,0,1)));ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.92);ctx.lineWidth=lw||5;ctx.lineCap="round";ctx.beginPath();
  for(let i=0;i<=m;i++){const u=i/n,j=Math.sin(u*31)*0.8+Math.sin(u*7)*1.2;const x=lerp(a[0],b[0],u),y=lerp(a[1],b[1],u),dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1;
    const px=x-dy/l*j,py=y+dx/l*j;if(i)ctx.lineTo(px,py);else ctx.moveTo(px,py);}ctx.stroke();ctx.restore();}
function ws_colsTable(ctx,a,band){if(a<=0.01)return;const T_=WS_TB;withA(ctx,a,()=>{ctx.drawImage(gv_sheetPaper(T_.w,T_.h,{col:WS_FORM}),T_.x-20,T_.y-20);
  T_.cols.forEach(([x,s])=>wc_T(ctx,s,x,T_.y+70,{w:800,size:34,col:WC_DARK}));ctx.save();ctx.fillStyle=rgba(WS_FORMINK,0.5);ctx.fillRect(T_.x+24,T_.y+94,T_.w-48,3);
  for(let r=0;r<8;r++){const y=T_.y+140+r*56;ctx.fillStyle=rgba(WS_FORMINK,0.18);ctx.fillRect(T_.x+24,y+24,T_.w-48,1.5);
    T_.cols.forEach(([x],k)=>{ctx.fillStyle=rgba(k>=3?[70,60,80]:WS_FORMINK,k>=3?0.5:0.4);ctx.fillRect(x,y,(k>=3?92:70)*(0.55+0.45*hash(r*5+k,9)),8);});}ctx.restore();
  if(band>0)ws_mask(ctx,T_.div+24,T_.y+112,T_.x+T_.w-T_.div-48,T_.h-140,band,{size:34});});}

/* ---------- the places, painted once ---------- */
// 1983's four places and their front layers (the counter, the bench), then the university's, from the series' shared set; a screen close
// up is painted on the wall of the room it stands in
const WC_PLACES={hall83:ws_paintHall83,counter83:ws_paintCounter83,street83:ws_paintStreet83,court:ws_paintCourt,bench:ws_paintBench,table83:ws_paintTable83,
  office:gv_paintOffice,desk:gv_paintDesk,planning:gv_paintPlanning,registrar:gv_paintRegistrarClose,registrarDesk:gv_paintRegistrarDesk,platform:gv_paintPlatformClose,
  platformDesk:gv_paintPlatformDesk,floor:gv_paintFloor,boardData:c=>gv_paintBoardClose(c,GV_ROOM.data),screen:c=>gv_paintScreenDesk(c,GV_ROOM.data),
  screenReg:c=>gv_paintScreenDesk(c,GV_ROOM.reg),screenPlat:c=>gv_paintScreenDesk(c,GV_ROOM.plat),screenPlan:c=>gv_paintScreenDesk(c,GV_ROOM.plan)};
