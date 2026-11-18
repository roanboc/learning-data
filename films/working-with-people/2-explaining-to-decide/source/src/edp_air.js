/* ===== Explaining so people can decide: the United States Air Force, 1950 to 1952, in ink line =====
   The opening story's places, people and things (prefix edp_). The people kit draws the people and the rooms' things and is never
   changed for this film. Checked against the script's Rigour (Daniels, 1952; Daniels and Churchill, 1952; Hertzberg, Daniels and
   Churchill, 1954).
     edpLab      the measuring room of 1950: a buff wall, a measuring post with its scale, a bench where flyers wait
     edpDraw     the designers' drawing office: drawing tables, a window
     edpDoor     a corridor, its doorway built to the average man's height
     edpCock     a cockpit's mock-up on the floor of a hangar: a seat on its post, the panel in front, a canopy's frame
     edpOffice   Daniels's office in 1952: a board on the wall, a desk with a typewriter and the measurement cards, a window
     edpStreet   a street, and a parked car with its door open
   Nothing is a likeness or a copy of a photograph. No jet and no radio. Colour keeps the module's meaning: amber what doesn't fit,
   blue a plan, green what fits; the walls, the floor and the sky carry none. Every name this file declares starts with edp_ or EDP_. */
const EDP_IE=380,EDP_RF=800,edp_h=fl=>PK.hAt(fl,EDP_IE);
const EDP_PAL={wall:[226,216,192],wall2:[214,202,176],floor:[170,150,122],wood:[150,112,80],metal:[150,156,160],metal2:[110,116,122],panel:[70,76,82],
  sky:[206,224,236],sky2:[240,236,222],road:[150,150,150],curb:[200,196,186],house:[226,206,176],roof:[170,110,90],car:[120,146,150],glass:[200,220,226],tyre:[50,50,54]};
const edp_c=k=>PK.S.tone(EDP_PAL[k]);
function edp_room(ctx,col){const S=PK.S,U=PK.u;ctx.fillStyle=U.css(edp_c(col||"wall"));ctx.fillRect(0,0,1920,EDP_RF);
  S.begin(ctx,{lw:2.6,sh:4});S.fill(ctx,c=>c.rect(-20,EDP_RF-60,1960,60),U.dk(edp_c(col||"wall"),0.1),{w:0.6});
  S.poly(ctx,[[-20,EDP_RF,1],[1940,EDP_RF,1],[1940,1100,1],[-20,1100,1]],edp_c("floor"),{exact:true,grad:[0,EDP_RF,0,1080,0.1]});}
const edp_sky=(c,x,y,w,h)=>{const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,PK.u.css(edp_c("sky")));g.addColorStop(1,PK.u.css(edp_c("sky2")));c.fillStyle=g;c.fillRect(x,y,w,h);};

/* ---------------------------------------------------------------- places */
// the measuring post: a board on the wall with its scale, its sliding head-rest (at y: the top of the head)
const EDP_POST={x:640,fl:930};
function edp_post(ctx,top){const S=PK.S,{x}=EDP_POST;S.begin(ctx,{lw:2.4,sh:3});S.fill(ctx,c=>c.rect(x-70,180,46,EDP_RF-180),edp_c("wood"),{});
  S.line(ctx,c=>{for(let y=200;y<EDP_RF-10;y+=24){c.moveTo(x-70,y);c.lineTo(x-(y%120===200%120?40:54),y);}},PK.u.dk(edp_c("wood"),0.4),0.5);
  if(top!=null)S.fill(ctx,c=>c.rect(x-70,top-10,150,14),edp_c("metal2"),{});}
AG_PLACES.edpLab=ctx=>{edp_room(ctx);const S=PK.S;
  PK.window(ctx,1180,150,420,330,(c,x,y,w,h)=>{edp_sky(c,x,y,w,h);S.begin(c,{lw:2,far:0.5,sh:2});S.fill(c,cc=>cc.rect(x,y+h*0.62,w,h*0.38),[180,180,160],{w:0.5});},{});
  edp_post(ctx,null);
  // the bench at the back, under the window
  S.begin(ctx,{lw:2.6,sh:3});S.fill(ctx,c=>c.rect(1120,700,620,22),edp_c("wood"),{});S.fill(ctx,c=>{c.rect(1140,722,20,90);c.rect(1700,722,20,90);},PK.u.dk(edp_c("wood"),0.15),{});};
// the designers' office: two drawing tables (drawn with the people, edp_drawing), a window
AG_PLACES.edpDraw=ctx=>{edp_room(ctx,"wall2");PK.window(ctx,760,140,420,340,(c,x,y,w,h)=>{edp_sky(c,x,y,w,h);},{});};
// a drawing table: its board tilted towards whoever stands at it (x: the board's middle, fl: the floor; flip: it faces left)
function edp_drawing(ctx,x,fl,h,flip){const S=PK.S,u=h/1000,d=flip?-1:1,top=fl-0.62*h;S.begin(ctx,{lw:2.6,sh:4});
  S.fill(ctx,c=>{c.rect(x-6*u,top,12*u+10,fl-top);c.rect(x-160*u,fl-10,320*u,10);},edp_c("metal2"),{});
  S.poly(ctx,[[x-d*150*u,top+10*u],[x+d*110*u,top-170*u],[x+d*130*u,top-150*u],[x-d*130*u,top+30*u]],[240,236,226],{exact:true});
  S.line(ctx,c=>{c.moveTo(x-d*70*u,top-30*u);c.lineTo(x+d*50*u,top-114*u);c.moveTo(x-d*40*u,top-6*u);c.lineTo(x+d*70*u,top-84*u);},PK.C.blue,0.5);}
// the corridor and its doorway, built to the average man's height (EDP_DOOR: x, width; its top is set by the man who fits)
const EDP_DOOR={x:960,w:250,fl:930};
AG_PLACES.edpDoor=ctx=>{edp_room(ctx);const S=PK.S,{x,w,fl}=EDP_DOOR,top=fl-edp_h(fl)+14;
  S.begin(ctx,{lw:3,sh:4});S.fill(ctx,c=>c.rect(x-w/2-26,top-26,w+52,fl-top+26),edp_c("wood"),{});S.fill(ctx,c=>c.rect(x-w/2,top,w,fl-top),[110,98,84],{flat:true});
  S.fill(ctx,c=>c.rect(x-w/2,top,w,fl-top),[150,138,120],{grad:[x,top,x,fl,0.2],line:false});};
// a cockpit's mock-up in a hangar: the seat's post rises by up (px); the panel in front, a switch high on it
const EDP_CK={x:820,fl:900,px:1240};
AG_PLACES.edpCock=ctx=>{const S=PK.S,U=PK.u;ctx.fillStyle=U.css([206,208,206]);ctx.fillRect(0,0,1920,EDP_RF);
  S.begin(ctx,{lw:2.4,far:0.3,sh:2});S.line(ctx,c=>{for(let x=-40;x<1960;x+=240){c.moveTo(x,0);c.lineTo(x+120,EDP_RF);}},[180,184,184],0.8);
  S.begin(ctx,{lw:2.6,sh:4});S.poly(ctx,[[-20,EDP_RF,1],[1940,EDP_RF,1],[1940,1100,1],[-20,1100,1]],[160,158,150],{exact:true,grad:[0,EDP_RF,0,1080,0.1]});
  // the mock-up's floor, a low platform
  S.fill(ctx,c=>c.rect(560,EDP_CK.fl,980,40),edp_c("metal"),{});};
function edp_cockpit(ctx,up,sw){const S=PK.S,{x,fl,px}=EDP_CK,h=edp_h(fl);S.begin(ctx,{lw:2.8,sh:4});
  // the seat's post, which rises and falls
  S.fill(ctx,c=>c.rect(x-40,fl-up-6,80,up+6),edp_c("metal2"),{});
  // the panel: a box with its dials, and a switch high and far on it (sw: how much the switch is picked out, 0 to 1)
  const pt=fl-0.78*h;S.fill(ctx,c=>c.rect(px-30,pt,170,fl-pt),edp_c("panel"),{});
  S.line(ctx,c=>{for(const [dx,dy] of [[20,90],[90,90],[20,190],[90,190],[55,290]]){c.moveTo(px-30+dx+22,pt+dy);c.arc(px-30+dx,pt+dy,22,0,7);}},[230,230,226],0.8);
  S.fill(ctx,c=>c.rect(px+70,pt-70,30,70),edp_c("metal"),{});
  if(sw>0.004){ctx.save();ctx.globalAlpha*=sw;S.line(ctx,c=>{c.moveTo(px+120,pt-35);c.arc(px+85,pt-35,40,0,7);},PK.C.amber,1.4);ctx.restore();}
  // the stick and the pedal
  S.line(ctx,c=>{c.moveTo(px-160,fl);c.lineTo(px-180,fl-0.24*h);},edp_c("metal2"),1.6);S.fill(ctx,c=>c.rect(px-70,fl-30,60,22),edp_c("metal2"),{});
  // the canopy's frame, over the seat
  S.line(ctx,c=>{c.moveTo(x-140,fl);c.lineTo(x-140,fl-0.98*h);c.quadraticCurveTo(x+300,fl-1.18*h,px+140,pt-80);},edp_c("metal2"),1.4);}
// Daniels's office, 1952: the board where he works out his count, the desk on the right, a window
const EDP_BD={x:240,y:250,k:0.5,w:1250*0.5,h:524*0.5,floor:930,rest:960};
AG_PLACES.edpOffice=ctx=>{edp_room(ctx);const S=PK.S;
  PK.window(ctx,1260,130,420,330,(c,x,y,w,h)=>{edp_sky(c,x,y,w,h);S.begin(c,{lw:2,far:0.5,sh:2});S.fill(c,cc=>cc.rect(x,y+h*0.7,w,h*0.3),[170,176,150],{w:0.5});},{});
  S.begin(ctx,{lw:2.6,sh:4});PK.board(ctx,EDP_BD.x,EDP_BD.y,EDP_BD.w,EDP_BD.h,{});};
// on the desk: a typewriter (its sheet up to o.page, 0 to 1), and the cards, in stacks
function edp_typewriter(ctx,x,y,k,page){const S=PK.S;S.begin(ctx,{lw:2.4,sh:3});
  if(page>0.004)S.fill(ctx,c=>c.rect(x-48*k,y-(40+80*page)*k,96*k,(40+80*page)*k),[250,248,240],{});
  S.fill(ctx,c=>{c.moveTo(x-90*k,y);c.lineTo(x-70*k,y-46*k);c.lineTo(x+70*k,y-46*k);c.lineTo(x+90*k,y);c.closePath();},[60,64,70],{});
  S.fill(ctx,c=>c.rect(x-100*k,y-58*k,200*k,14*k),[80,84,90],{});}
function edp_cards(ctx,x,y,k){const S=PK.S;S.begin(ctx,{lw:2.2,sh:3});for(let i=0;i<3;i++)S.fill(ctx,c=>c.rect(x+i*44*k,y-(26+i*8)*k,38*k,(26+i*8)*k),[236,226,196],{w:0.5});}
// the street, and a parked car, its driver's door open (the seat inside slides back by slide, 0 to 1)
AG_PLACES.edpStreet=ctx=>{const S=PK.S,hz=560;edp_sky(ctx,0,0,1920,hz+4);S.begin(ctx,{lw:2.4,far:0.3,sh:3});
  for(let i=0;i<7;i++){const x0=-60+i*300,h=200+(i*53)%80;S.fill(ctx,c=>c.rect(x0,hz-h,250,h),edp_c("house"),{w:0.5});
    S.fill(ctx,c=>{c.moveTo(x0-10,hz-h);c.lineTo(x0+125,hz-h-60);c.lineTo(x0+260,hz-h);c.closePath();},edp_c("roof"),{w:0.5});}
  S.begin(ctx,{lw:2.6,sh:4});S.fill(ctx,c=>c.rect(-20,hz,1960,70),edp_c("curb"),{});S.poly(ctx,[[-20,hz+70,1],[1940,hz+70,1],[1940,1100,1],[-20,1100,1]],edp_c("road"),{exact:true,grad:[0,hz,0,1080,0.1]});};
const EDP_CAR={x:980,fl:930};
function edp_carBack(ctx){const S=PK.S,{x,fl}=EDP_CAR;S.begin(ctx,{lw:3,sh:5});
  S.fill(ctx,c=>{c.moveTo(x-520,fl-60);c.lineTo(x-520,fl-250);c.quadraticCurveTo(x-380,fl-270,x-300,fl-280);c.lineTo(x-200,fl-470);c.lineTo(x+250,fl-470);c.lineTo(x+380,fl-290);c.quadraticCurveTo(x+560,fl-280,x+600,fl-230);c.lineTo(x+600,fl-60);c.closePath();},edp_c("car"),{grad:[0,fl-470,0,fl,0.12]});
  S.fill(ctx,c=>c.rect(x-170,fl-440,390,150),edp_c("glass"),{line:false,flat:true});}
function edp_carFront(ctx){const S=PK.S,{x,fl}=EDP_CAR;S.begin(ctx,{lw:3,sh:5});
  // the body below the window, in front of the driver's legs, with the opening of the door; the wheels; the door, swung open towards us
  S.fill(ctx,c=>{c.rect(x-520,fl-250,330,190);c.rect(x+240,fl-280,360,220);},edp_c("car"),{});
  S.fill(ctx,c=>c.rect(x-190,fl-170,430,110),PK.u.dk(edp_c("car"),0.12),{});
  for(const wx of [x-330,x+420])S.fill(ctx,c=>c.arc(wx,fl-50,70,0,7),edp_c("tyre"),{});
  S.poly(ctx,[[x-190,fl-300],[x-330,fl-330],[x-330,fl-90],[x-190,fl-70]],PK.u.dk(edp_c("car"),0.06),{exact:true});}

/* ---------------------------------------------------------------- the people of 1950 to 1952: nobody's likeness
   Flyers in plain white undershirts, their hair cut short; the measurer, the clerk and the designers in shirts and jackets of the
   time; Daniels in the Air Force's summer khaki, which reads as beige, never as the module's amber. */
const EDP_FOLK={
  flyer1:{key:"edpFlyer1",name:"",skin:[228,192,162],hair:{style:"crop",c:[96,72,50]},top:{kind:"sweater",c:[238,236,230]},bottom:{kind:"trousers",c:[96,100,80]},shoe:[50,44,40]},
  flyer2:{key:"edpFlyer2",name:"",skin:[200,156,124],hair:{style:"crop",c:[40,32,28]},top:{kind:"sweater",c:[236,234,228]},bottom:{kind:"trousers",c:[96,100,80]},shoe:[50,44,40]},
  flyer3:{key:"edpFlyer3",name:"",skin:[236,204,176],hair:{style:"short",c:[170,130,80]},top:{kind:"sweater",c:[238,236,230]},bottom:{kind:"trousers",c:[96,100,80]},shoe:[50,44,40]},
  flyer4:{key:"edpFlyer4",name:"",skin:[150,104,80],hair:{style:"crop",c:[30,26,24]},top:{kind:"sweater",c:[236,234,228]},bottom:{kind:"trousers",c:[96,100,80]},shoe:[50,44,40]},
  pilot:{key:"edpPilot",name:"",skin:[226,190,160],hair:{style:"short",c:[80,60,44]},top:{kind:"jacket",c:[120,112,84],inner:[200,190,160]},bottom:{kind:"trousers",c:[110,104,80]},shoe:[60,48,40]},
  pilot2:{key:"edpPilot2",name:"",skin:[214,172,140],hair:{style:"crop",c:[54,42,36]},top:{kind:"jacket",c:[120,112,84],inner:[200,190,160]},bottom:{kind:"trousers",c:[110,104,80]},shoe:[60,48,40]},
  measurer:{key:"edpMeasurer",name:"",skin:[212,174,144],hair:{style:"short",c:[58,46,40]},glasses:[50,44,40],top:{kind:"jacket",c:[150,150,146],inner:[236,232,222]},bottom:{kind:"trousers",c:[80,80,84]},shoe:[50,44,42]},
  clerk:{key:"edpClerk",name:"",skin:[236,204,180],hair:{style:"bun",c:[110,74,50]},top:{kind:"jacket",c:[110,130,150],inner:[240,236,226]},bottom:{kind:"skirt",c:[90,96,110]},shoe:[60,48,46]},
  designer1:{key:"edpDesigner1",name:"",skin:[230,196,170],hair:{style:"short",c:[70,56,44]},top:{kind:"sweater",c:[150,136,110]},bottom:{kind:"trousers",c:[80,80,90]},shoe:[56,46,42]},
  designer2:{key:"edpDesigner2",name:"",skin:[220,180,150],hair:{style:"long",c:[60,44,36]},top:{kind:"jacket",c:[120,100,96],inner:[240,234,224]},bottom:{kind:"skirt",c:[80,76,90]},shoe:[60,48,46]},
  daniels:{key:"edpDaniels",name:"Gilbert Daniels",skin:[230,194,166],hair:{style:"short",c:[72,54,42]},glasses:[44,40,38],top:{kind:"jacket",c:[196,184,152],inner:[226,218,194]},bottom:{kind:"trousers",c:[176,164,132]},shoe:[90,70,50]},
  driver:{key:"edpDriver",name:"",skin:[226,186,156],hair:{style:"bob",c:[90,60,40]},top:{kind:"jacket",c:[90,120,110],inner:[240,236,226]},bottom:{kind:"trousers",c:[70,74,90]},shoe:[60,48,46]}};
const edp_row=w=>typeof w==="string"?(EDP_FOLK[w]||PK.CAST[w]):w;
const edp_person=(ctx,who,x,fl,pose,o,h)=>PK.person(ctx,edp_row(who),x,fl,h||edp_h(fl),pose,o);
const edp_seat=(ctx,who,x,fl,pose,o,h)=>PK.seated(ctx,edp_row(who),x,fl,h||edp_h(fl),pose||"sit",o);
const edp_desk=(ctx,who,x,fl,o)=>PK.atDesk(ctx,edp_row(who),x,fl,edp_h(fl),Object.assign({screen:null},o||{}));
