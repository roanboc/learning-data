/* ===== Change without surprises: the ten chapters =====
   Each chapter is a few shots in the places of past.js, plan.js and the series' rooms.js, cut together with short dissolves
   (gv_shots). Times inside a chapter come from its cues (when each line starts) and the words of its lines (wAt), so the pictures
   stay with the voice if it's recorded again. Words on screen are on paper, boards, cards, tags, stamps and speech bubbles, at least
   28 px as seen when they're read, and above the captions. */

// ---- 1 · Five in the morning ----
// how far a car has gone t seconds after it sets off at t0, speeding up at a to v metres a second
function cw_go(t,t0,a,v){const u=t-t0;if(u<=0)return 0;const tv=v/a;return u<tv?0.5*a*u*u:0.5*a*tv*tv+v*(u-tv);}
// a car crossing from one side of the road to the other between t0 and t0+d: across from x0 to x1 while it moves on by dz
function cw_swerve(t,t0,d,x0,x1,z0,dz){const u=ease(clamp((t-t0)/d,0,1));return[x0+(x1-x0)*u*u*(3-2*u),z0+dz*u];}
// a car drawn where its path puts it at t, heading the way it's going, or h0 while it stands
function cw_carAt(x,C,path,t,h0,o){const a=path(t),b=path(t+0.04),dx=b[0]-a[0],dz=b[1]-a[1],h=Math.hypot(dx,dz)>1e-4?Math.atan2(dx,dz):h0;
  return cw_car(x,C,Object.assign({x:a[0],z:a[1],h},o));}
// things in depth, drawn far to near: [z, draw]
const cw_depth=items=>items.sort((a,b)=>b[0]-a[0]).forEach(i=>i[1]());
// the officer in the middle of the crossroads: his glove raised at ten to five, his arm out at five, lowered at the end
function cw_officerAt(x,C,tt,up,on,down){const [ox,oy]=cw_pj(C,0.3,0,22.5),s=1.8*cw_ppm(C,22.5)/560;
  const po=down>0?{pose:"cw_on",pose2:"stand",mix:down}:on>0?{pose:"cw_halt",pose2:"cw_on",mix:on}:{pose:"stand",pose2:"cw_halt",mix:up};
  person(x,"cw_officer",ox,oy,s,Object.assign({t:tt},po));}
// the crossroads at dawn: three cars stopped at ten to five; they cross to the right and wait; at five the officer sends them on, and
// more come, on the right
function cw_dawn(x,tt,P){const C=CW_ST;CW_LIT=[];
  const c1=t=>{const p=cw_swerve(t,P.cross,2.4,-1.9,1.9,10.2,6.2);return[p[0],p[1]+cw_go(t,P.drove,2.4,11)];},
    c2=t=>{const p=cw_swerve(t,P.cross+0.3,2.4,-1.9,1.9,33,6.0);return[p[0],p[1]+cw_go(t,P.drove+0.5,2.4,11)];},
    c3=t=>{const p=cw_swerve(t,P.cross+0.6,2.4,1.9,-1.9,52,-6.0);return[p[0],p[1]-cw_go(t,P.drove+0.3,2.4,11)];},
    c4=t=>[1.9,2+9*(t-P.name+0.4)],c5=t=>[-1.9,130-10*Math.max(0,t-P.name)];
  const items=[],add=(path,h0,o)=>{const z=path(tt)[1];if(z>3.6&&z<C.end)items.push([z,()=>cw_carAt(x,C,path,tt,h0,o)]);};
  add(c1,0,{col:CW_PAINT[0],tail:1,head:1,driver:[0,[70,52,40],[76,82,98]]});add(c2,0,{col:CW_PAINT[1],tail:1,head:1,driver:[0,[150,112,70],[150,120,96]]});
  add(c3,Math.PI,{col:CW_PAINT[3],head:1});if(tt>P.name-0.4)add(c4,0,{col:CW_PAINT[2],tail:1,head:1,driver:[0,[50,40,36],[90,70,60]]});if(tt>P.name)add(c5,Math.PI,{col:CW_PAINT[5],head:1});
  items.push([22.5,()=>cw_officerAt(x,C,tt,easeCam(clamp((tt-P.raise)/0.6,0,1)),easeCam(clamp((tt-P.drove+0.5)/0.6,0,1)),0)]);cw_depth(items);
  cw_clockHands(x,C,50+10*easeCam(clamp((tt-P.waited-0.2)/1.6,0,1)));cw_streetLight(x,"dawn");}
// 1966, a border in the hills: beyond the barrier the road keeps right, and a car drives away on the right; this side, a Swedish car,
// its wheel on the left, comes up to the barrier on the left
function cw_border(x,tt,P){const C=CW_BD,u=tt-P.border;CW_LIT=[];cw_car(x,C,{x:1.5,z:34+6*u,col:CW_PAINT[5],tail:0.4});x.drawImage(gv_place("x66borderBar"),0,0,W,H);
  cw_car(x,C,{x:-1.5,z:8.4+4.8*(1-Math.pow(1-clamp(u/3.4,0,1),2)),col:CW_PAINT[4],tail:0.5,driver:[0,[96,70,50],[120,96,72]]});cw_lights();}
// a narrow road at dusk: the car behind a lorry, its driver on the left, can't see past it; he edges out, a car comes the other way
// out from behind the lorry, and he pulls back in
function cw_overtake(x,tt,P){const C=CW_CR;CW_LIT=[];cw_roadMotion(x,C,14*(tt-P.road));
  const out=easeCam(clamp((tt-P.over-0.3)/1.0,0,1))*(1-easeCam(clamp((tt-P.see-0.35)/0.6,0,1))),zo=23-24*(tt-P.see-0.2),xc=-1.4+0.85*out,items=[];
  if(zo>3.4&&zo<160)items.push([zo,()=>cw_car(x,C,{x:1.4,z:zo,h:Math.PI,col:CW_PAINT[1],head:1})]);
  items.push([18.1,()=>cw_lorry(x,C,{x:-1.4,z:18.1,tail:1})]);
  items.push([9.65,()=>{const V=cw_car(x,C,{x:xc,z:9.65,h:0.08*Math.sin(out*Math.PI),col:CW_PAINT[3],tail:1,driver:[0,[88,64,46],[96,108,128]],lean:0.14*out});
    // his seat, on the left, far from the middle of the road
    const a=gv_io(tt,P.wheelL-0.1,P.wheelL+2.2,0.4);if(a>0){const [hx,hy]=V.p(2.1,-0.38+0.14*out,1.16),r=0.36*cw_ppm(C,9.65);wc_ring(x,hx,hy,r,r*1.1,fin(tt,P.wheelL-0.1,0.6),{col:GV.gold,a:0.9*a,lw:4});}}]);
  cw_depth(items);cw_dusk(x,false);}
// a little later on the same road: a tow truck pulls away a car with its front crumpled, lifted at the rear; the officer writes in his
// notebook, and looks up
function cw_towShot(x,tt,P){const C=CW_CR,u=tt-P.crash,zt=20+1.1*u;CW_LIT=[];cw_roadMotion(x,C,0);
  const zc=zt-5.9,lift=a=>0.55*Math.max(0,1-a/3.86),Vc=cw_frame(C,-1.4,zc,Math.PI,3.86,lift);
  cw_tow(x,C,{x:-1.4,z:zt,tail:1,hook:Vc.p(0.05,0,0.86)});cw_car(x,C,{x:-1.4,z:zc,h:Math.PI,col:CW_PAINT[0],crumpled:true,lift});
  const [ox,oy]=cw_pj(C,-3.9,0,10),s=1.8*cw_ppm(C,10)/560,lk=easeCam(clamp((tt-P.change+0.2)/0.6,0,1));
  person(x,"cw_officer",ox,oy,s,{pose:"write",pose2:"stand",mix:lk,carry:lk<0.6?heldNotebook:null,t:tt,flip:true});cw_dusk(x,true);}
// what many feared, at night, in grey: a car keeping right, and another coming at it on the same side, a driver who didn't know; the
// picture stops before they meet
function cw_whatIf(x,tt,P){const C=CW_ST,tf=Math.min(tt,P.meet+0.1),za=8+2.5*(tf-P.feared),zb=60-6.2*Math.max(0,tf-P.many);CW_LIT=[];
  if(tt>P.many)cw_car(x,C,{x:1.9,z:zb,h:Math.PI,col:CW_PAINT[2],head:1});cw_car(x,C,{x:1.9,z:za,col:CW_PAINT[0],tail:1,head:1,driver:[0,[70,52,40],[76,82,98]]});
  cw_streetLight(x,"night");const g=fin(tt,P.many,1.0);if(g>0){x.save();x.globalCompositeOperation="saturation";x.globalAlpha=0.9*g;x.fillStyle="rgb(128,128,128)";x.fillRect(-W,-H,3*W,3*H);x.restore();cw_grade(x,mix([255,255,255],[214,214,222],g));}}
// 1963 to 1966, the change commission's office: planners at the long table, one at the plan on the wall, and their papers growing,
// a year at a time
function cw_commission(x,tt,P){const O=CW_OF,yr=tt<P.y64?0:tt<P.y65?1:tt<P.y66?2:3;
  gv_behind(x,"cw_planA",470,O.top-24,0.94,{t:tt,pose:"write"});gv_behind(x,"cw_planB",800,O.top-24,0.92,{t:tt,pose:"listen",flip:true});
  gv_behind(x,"cw_planC",1010,O.top-24,0.96,{standing:true,t:tt,pose:"point"});x.drawImage(gv_place("x63officeT"),0,0,W,H);
  for(let i=0;i<4+yr*7;i++){x.fillStyle=rgba(i%2?[238,234,224]:[250,248,240],1);x.fillRect(1250-120+(hash(i,3)-0.5)*8,O.top-12-i*5,240,5);}}
// the night the covers changed: the road worker on his ladder takes the black cover off the new sign, on the right, and wraps the old
// one in it
function cw_swap(x,tt,P){const O=CW_PO,[so,sn]=O.signs,r=O.r,u=tt-P.night,off=easeCam(clamp(u/0.9,0,1)),acr=easeCam(clamp((u-0.9)/0.6,0,1)),on=easeCam(clamp((u-1.5)/0.9,0,1));
  cw_sign(x,so[0],so[1],r,-1);cw_sign(x,sn[0],sn[1],r,1);cw_cover(x,sn[0],sn[1],r,1-off);if(on>0)cw_cover(x,so[0],so[1],r,on);
  // the cover in his hand as it goes across, bunched
  const held=off>0.98&&on<0.02,bx=lerp(sn[0]-10,so[0]+10,acr),by=sn[1]-r*1.28-40*Math.sin(acr*Math.PI);
  cw_ladder(x,1012,1188,O.bar+8,H+30);
  const ln=lerp(26,-26,acr),k=1.0,hy=930,hand=(px,py)=>[(px-1100)/k-ln,(py-hy)/k],P_=PEOPLE.cw_worker,
    rT=acr<0.5?hand(held?bx:sn[0]+4,held?by+10:sn[1]-r*1.2-36*off):hand(1150,O.bar+6),lT=acr>=0.5?hand(held?bx:so[0]-4,held?by+10:so[1]-r*1.2+r*2.2*on*0):hand(1052,O.bar+6);
  cw_back(x,"cw_worker",1100,hy,k,{lean:ln,a:[cw_ik(P_,-1,lT[0],lT[1]),cw_ik(P_,1,rT[0],rT[1])]});
  if(held){x.save();x.translate(bx,by);x.fillStyle=rgba(CW.black,0.96);x.beginPath();x.ellipse(0,0,58,30,-0.2,0,TAU);x.fill();x.strokeStyle=rgba([96,94,100],0.6);x.lineWidth=3;
    for(const d of [-24,0,22]){x.beginPath();x.moveTo(d-10,-22);x.quadraticCurveTo(d+6,0,d-4,24);x.stroke();}x.restore();}
  CW_LIT=[];cw_grade(x,[104,112,160]);cw_light(x,180,-80,1400,[255,212,150],0.42);cw_light(x,1380,170,260,[255,200,130],0.25);cw_lights();}
// the hand's angles that put it at (tx, ty), in the figure's own units, the elbow out: for the worker seen from behind
function cw_ik(P_,s,tx,ty){const sx=s*(P_.build.sh-12),sy=-416,dx=s*(tx-sx),dy=ty-sy,L=Math.hypot(dx,dy),D=clamp(L-13,30,204),at=Math.atan2(dx,dy),
  phi=Math.acos(clamp((108*108+D*D-100*100)/(2*108*D),-1,1)),a0=at-phi,ex=Math.sin(a0)*108,ey=Math.cos(a0)*108,a1=Math.atan2(dx*D/L-ex,dy*D/L-ey);return[a0,a1];}
// the post office: the postman fills his sack with booklets, a bundle in his hands, more on the counter
function cw_postman(x,tt,P){const O=CW_PS,u=tt-P.booklet,s=1.05,cut=O.top-12,py=cut+GV_STAND*s,n=Math.max(0,6-Math.floor(Math.max(0,u-0.5)/0.4)),
  [lx,ly]=cw_handAt("cw_postman",960,py,s,"hold",-1),[rx,ry]=cw_handAt("cw_postman",960,py,s,"hold",1),mx=(lx+rx)/2,my=(ly+ry)/2;
  gv_behind(x,"cw_postman",960,cut,s,{standing:true,pose:"hold",t:tt,carry:cw_heldBooklets(n)});x.drawImage(gv_place("x67postT"),0,0,W,H);
  cw_sack(x,960,O.top+14,250,108,false);
  for(let i=0;i<6;i++){const t0=P.booklet+0.5+i*0.4,f=clamp((tt-t0)/0.3,0,1);if(f<=0||f>=1)continue;cw_booklet(x,mx+(hash(i,5)-0.5)*20,my+20+f*f*80,70,(hash(i,9)-0.5)*0.5);}
  cw_sack(x,960,O.top+14,250,108,true);cw_bookletStack(x,560,O.top+16,150,16);cw_bookletStack(x,1400,O.top+16,150,11);}
// the grocer's: the grocer sets a pack of milk down on the counter beside the crate, each with its H
function cw_milk(x,tt,P){const O=CW_GR,u=tt-P.milk,s=1.15,cut=O.top-22,py=cut+GV_STAND*s,set=easeCam(clamp((u-0.4)/0.9,0,1)),held=set<1;
  gv_behind(x,"cw_grocer",1040,cut,s,{standing:true,pose:"hold",pose2:"cw_set",mix:set,t:tt,carry:held?cw_heldTetra:null});x.drawImage(gv_place("x67grocerT"),0,0,W,H);
  if(!held){const [hx,hy]=cw_handAt("cw_grocer",1040,py,s,"cw_set",1),k=s*PEOPLE.cw_grocer.build.h;cw_tetra(x,hx+6*k,hy+52*k,104*k);}}
// the crossroads the morning after: traffic on the right, a bus among it, people on the pavement of the side street
function cw_morning(x,tt,P){const C=CW_ST,u=tt-P.huge,items=[];CW_LIT=[];
  items.push([14+5*u,()=>cw_bus(x,C,{x:1.9,z:14+5*u})]);items.push([34+6*u,()=>cw_car(x,C,{x:1.9,z:34+6*u,col:CW_PAINT[4]})]);
  items.push([70-11*u,()=>cw_car(x,C,{x:-1.9,z:70-11*u,h:Math.PI,col:CW_PAINT[2]})]);items.push([118-10*u,()=>cw_car(x,C,{x:-1.9,z:118-10*u,h:Math.PI,col:CW_PAINT[0]})]);
  for(const [id,X0,X1,t0] of [["cw_walkA",-15,-8.5,0],["cw_walkB",9.5,15.5,0.4]]){const w=gv_walk(tt,P.huge+t0,cw_pj(C,X0,0,26.6)[0],cw_pj(C,X1,0,26.6)[0],70),y=cw_pj(C,0,0,26.6)[1];
    items.push([26.6,()=>gv_walker(x,id,w,y,1.7*cw_ppm(C,26.6)/560,{t:tt})]);}
  cw_depth(items);cw_lights();}
// the police station: the officer, his cap off, sets the reports for September and October 1967 on the desk, beside the stack for
// 1966, twice as tall; a pencil line marks half
function cw_reportsAt(x,tt,P){const O=CW_PD,u=tt-P.half,dn=easeCam(clamp((u-0.4)/0.9,0,1));
  gv_behind(x,"cw_officerH",1500,O.top-30,1.02,{t:tt,pose:"hold"});x.drawImage(gv_place("x67deskT"),0,0,W,H);
  cw_reports(x,1680,lerp(O.top-170,O.top-6,dn),4,dn>0.97?"September–October 1967":null,1);
  const p=clamp((u-1.8)/0.8,0,1);if(p>0)wc_pencil(x,[[1460,O.top-6-4*17],[lerp(1460,1450,p),O.top-6-4*17],[lerp(1460,1890,p),O.top-6-4*17]],1,{col:GV.gold,lw:4,seed:7});}
// the crossroads at five, after the change: the cars on the right, the clock at five, the booklet in the kiosk's window; the three
// things everyone knew, tagged as they're said; the officer lowers his glove
function cw_atFive(x,tt,P){const C=CW_ST,u=tt-P.knew,items=[];CW_LIT=[];
  items.push([16.4+cw_go(tt,P.knew+0.6,1.6,9),()=>cw_car(x,C,{x:1.9,z:16.4+cw_go(tt,P.knew+0.6,1.6,9),col:CW_PAINT[4],tail:1,head:1,driver:[0,[70,52,40],[76,82,98]]})]);
  items.push([40+6*u,()=>cw_car(x,C,{x:1.9,z:40+6*u,col:CW_PAINT[1],tail:1,head:1})]);items.push([64-7*u,()=>cw_car(x,C,{x:-1.9,z:64-7*u,h:Math.PI,col:CW_PAINT[3],head:1})]);
  items.push([22.5,()=>cw_officerAt(x,C,tt,1,1,easeCam(clamp((tt-P.breath-0.3)/0.9,0,1)))]);cw_depth(items);cw_clockHands(x,C,60);cw_streetLight(x,"dawn");
  const out=P.title;cw_tagAt(x,tt,P.what,out,1601,452,"what would change");cw_tagAt(x,tt,P.when,out,1400,252,"when");cw_tagAt(x,tt,P.todo,out,250,560,"what to do");}
scene("dawn",(ctx,S,t,sc)=>{const P=cw_once(sc,"P",()=>{const c=sc.cues,w=(id,s,o)=>wAt(sc,id,s,o);
    return{raise:0.6,every:w("stop","every car"),cross:c.cross+0.2,waited:w("cross","waited"),drove:w("five","drove"),name:c.name,
      border:c.left-0.2,road:c.wheel-0.2,wheelL:w("wheel","with the wheel"),over:c.overtake,see:w("overtake","couldn't see"),crash:w("overtake","and many")-0.2,change:c.change,
      feared:c.feared-0.1,many:w("feared","many feared"),meet:w("feared","head on"),know:c.know-0.3,y64:c.commission+0.5,y65:c.commission+1.1,y66:c.commission+1.7,
      signs:c.signs-0.2,night:w("signs","covered"),booklet:c.booklet-0.2,milk:w("booklet","and the change")-0.1,huge:c.huge-0.2,half:c.half-0.2,
      knew:c.knew-0.2,what:w("knew","what would"),when:w("knew","when"),todo:w("knew","what they"),breath:c.breath,title:c.breath+0.6};});
  gv_shots(ctx,S,t,sc.dur,[
    {at:0,place:"x67dawn",keys:[[0,1270,470,1.55],[P.every-0.4,960,560,1.0],[P.name,990,540,1.1]],d:2.4,push:0.02,draw:(x,tt)=>cw_dawn(x,tt,P)},
    {at:P.border,place:"x66border",keys:[[P.border,960,540,1.0],[P.border+0.3,1010,520,1.16]],d:3.6,draw:(x,tt)=>cw_border(x,tt,P)},
    {at:P.road,place:"x66road",keys:[[P.road,960,560,1.6],[P.wheelL+1.4,960,540,1.0]],d:1.8,push:0,draw:(x,tt)=>cw_overtake(x,tt,P)},
    {at:P.crash,place:"x66road",keys:[[P.crash,960,540,1.0],[P.change-0.6,760,560,1.2]],d:2.2,draw:(x,tt)=>cw_towShot(x,tt,P)},
    {at:P.feared,place:"x67night",keys:[[P.feared,960,560,1.0],[P.many,1060,560,1.12]],d:3,draw:(x,tt)=>cw_whatIf(x,tt,P)},
    {at:P.know,place:"x63office",keys:[[P.know,960,540,1.0]],draw:(x,tt)=>cw_commission(x,tt,P)},
    {at:P.signs,place:"x67pole",keys:[[P.signs,1100,540,1.0]],draw:(x,tt)=>cw_swap(x,tt,P)},
    {at:P.booklet,place:"x67post",keys:[[P.booklet,960,560,1.0]],draw:(x,tt)=>cw_postman(x,tt,P)},
    {at:P.milk,place:"x67grocer",keys:[[P.milk,960,560,1.0]],draw:(x,tt)=>cw_milk(x,tt,P)},
    {at:P.huge,place:"x67day",keys:[[P.huge,960,540,1.0]],draw:(x,tt)=>cw_morning(x,tt,P)},
    {at:P.half,place:"x67desk",keys:[[P.half,1060,560,1.0]],draw:(x,tt)=>cw_reportsAt(x,tt,P)},
    {at:P.knew,place:"x67dawn",keys:[[P.knew,960,540,1.0]],draw:(x,tt)=>cw_atFive(x,tt,P)}],0.6);
  setScreen(ctx,S);const mk=[[0,"Sweden · 3 September 1967"],[P.border,"Sweden · 1966"],[P.know,"Sweden · 1963"],[P.y64,"Sweden · 1964"],[P.y65,"Sweden · 1965"],[P.y66,"Sweden · 1966"],
    [P.signs,"Sweden · 1967"],[P.huge,"Sweden · 3 September 1967"],[P.half,"Sweden · 1967"],[P.knew,"Sweden · 3 September 1967"]];
  cw_pill(ctx,t,mk,fin(t,0.6,0.5)*(1-gv_io(t,P.feared+0.4,P.know-0.1,0.4))*(1-fin(t,P.title,0.4)));
  gv_title(ctx,S,t,P.title,"Change without surprises","what a change reaches, shown before it goes in","Film 7 of 19 · data governance");wc_paperOver(ctx,S);});

["board","uses","note","breaks","adds","edition","words","ready","step"].forEach(id=>scene(id,(ctx,S,t,sc)=>{gv_shots(ctx,S,t,sc.dur,[{at:0,place:"x67day",keys:[[0,960,540,1]],push:0}]);wc_paperOver(ctx,S);}));
