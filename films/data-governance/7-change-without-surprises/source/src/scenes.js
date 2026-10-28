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
  if(zo>3.4&&zo<160)items.push([zo,()=>cw_car(x,C,{x:1.4,z:zo,h:Math.PI,col:CW_PAINT[1],head:clamp((34-zo)/4,0,1)})]);
  items.push([18.1,()=>cw_lorry(x,C,{x:-1.4,z:18.1,tail:1})]);
  items.push([9.65,()=>{const V=cw_car(x,C,{x:xc,z:9.65,h:0.08*Math.sin(out*Math.PI),col:CW_PAINT[3],tail:1,driver:[0,[88,64,46],[96,108,128]],lean:0.14*out});
    // his seat, on the left, far from the middle of the road
    const a=gv_io(tt,P.wheelL-0.1,P.wheelL+2.2,0.4);if(a>0){const [hx,hy]=V.p(2.1,-0.38+0.14*out,1.16),r=0.36*cw_ppm(C,9.65);wc_ring(x,hx,hy,r,r*1.1,fin(tt,P.wheelL-0.1,0.6),{col:GV.gold,a:0.9*a,lw:4});}}]);
  cw_depth(items);cw_dusk(x,false);}
// a little later on the same road: a tow truck pulls away a car with its front crumpled, lifted at the rear; the officer writes in his
// notebook, and looks up
function cw_towShot(x,tt,P){const C=CW_CR,u=tt-P.crash,zt=15.5+1.0*u;CW_LIT=[];cw_roadMotion(x,C,22);
  const zc=zt-5.63,lift=a=>0.55*Math.max(0,1-a/3.86),Vc=cw_frame(C,-1.4,zc,Math.PI,3.86,lift);
  cw_tow(x,C,{x:-1.4,z:zt,tail:1,t:tt,hook:Vc.p(0.05,0,0.86)});cw_car(x,C,{x:-1.4,z:zc,h:Math.PI,col:CW_PAINT[0],crumpled:true,lift});
  const [ox,oy]=cw_pj(C,-3.9,0,10),s=1.8*cw_ppm(C,10)/560,lk=easeCam(clamp((tt-P.change+0.2)/0.6,0,1));
  person(x,"cw_officer",ox,oy,s,{pose:"write",pose2:"stand",mix:lk,carry:lk<0.6?heldNotebook:null,t:tt,flip:true});cw_dusk(x,true);}
// what many feared, at night, in grey: a car keeping right, and another coming at it on the same side, a driver who didn't know; the
// picture stops before they meet
function cw_whatIf(x,tt,P){const C=CW_ST,tf=Math.min(tt,P.meet+0.1),za=6+1.5*(tf-P.feared),vb=39/Math.max(1,P.meet+0.1-P.many),zb=70-vb*Math.max(0,tf-P.many);CW_LIT=[];
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
// the crossroads the morning after: traffic on the right, a bus among it, people walking towards us on the pavements
function cw_morning(x,tt,P){const C=CW_ST,u=tt-P.huge,items=[];CW_LIT=[];
  items.push([14+5*u,()=>cw_bus(x,C,{x:1.9,z:14+5*u})]);items.push([34+6*u,()=>cw_car(x,C,{x:1.9,z:34+6*u,col:CW_PAINT[4]})]);
  items.push([70-11*u,()=>cw_car(x,C,{x:-1.9,z:70-11*u,h:Math.PI,col:CW_PAINT[2]})]);items.push([118-10*u,()=>cw_car(x,C,{x:-1.9,z:118-10*u,h:Math.PI,col:CW_PAINT[0]})]);
  for(const [id,X,z0,t0,v] of [["cw_walkA",-5.1,19.4,0,1.3],["cw_walkB",5.6,16.2,0.45,1.2]]){const u_=Math.max(0,tt-P.huge-t0),z=z0-v*u_,ph=u_*Math.PI*2.1,sw=Math.sin(ph),k=cw_ppm(C,z),[px,py]=cw_pj(C,X,0,z);
    items.push([z,()=>person(x,id,px,py-Math.abs(sw)*0.025*k,1.7*k/560,{pose:"stand",pose2:sw>0?"walkA":"walkB",mix:Math.min(1,Math.abs(sw)*1.2),t:tt})]);}
  cw_depth(items);cw_lights();}
// the police station, the desk close: the reports for September and October 1966 in a stack; the officer's hand slides in the
// stack for 1967, half as tall, beside it, and goes; a pencil line marks half
function cw_reportsAt(x,tt,P){const O=CW_PD,u=tt-P.half,foot=O.top-6,sl=easeCam(clamp((u-0.3)/1.2,0,1)),go=easeCam(clamp((u-1.8)/0.9,0,1)),sx=lerp(2000,1240,sl);
  x.drawImage(gv_place("x67deskT"),0,0,W,H);cw_reports(x,sx,foot,4,"September–October 1967",1,fin(u,1.9,0.5));
  cw_push(x,sx+193+go*900,foot-46,CW.navy,PEOPLE.cw_officer.skin,1,1.45);
  const p=clamp((u-2.5)/0.9,0,1);if(p>0)wc_pencil(x,[[540,foot-88],[lerp(540,1460,p),foot-88]],1,{col:GV.gold,lw:4,seed:7});}
// the crossroads at five, after the change: the cars on the right, the clock at five, the booklet in the kiosk's window; the three
// things everyone knew, tagged as they're said; the officer lowers his glove
function cw_atFive(x,tt,P){const C=CW_ST,u=tt-P.knew,items=[];CW_LIT=[];
  items.push([16.4+cw_go(tt,P.knew+0.6,1.6,9),()=>cw_car(x,C,{x:1.9,z:16.4+cw_go(tt,P.knew+0.6,1.6,9),col:CW_PAINT[4],tail:1,head:1,driver:[0,[70,52,40],[76,82,98]]})]);
  items.push([40+6*u,()=>cw_car(x,C,{x:1.9,z:40+6*u,col:CW_PAINT[1],tail:1,head:1})]);items.push([64-7*u,()=>cw_car(x,C,{x:-1.9,z:64-7*u,h:Math.PI,col:CW_PAINT[3],head:1})]);
  items.push([22.5,()=>cw_officerAt(x,C,tt,1,1,easeCam(clamp((tt-P.breath+0.1)/0.7,0,1)))]);cw_depth(items);cw_clockHands(x,C,60);cw_streetLight(x,"dawn");
  const out=P.title;cw_tagAt(x,tt,P.what,out,1601,452,"what would change");cw_tagAt(x,tt,P.when,out,1400,252,"when");cw_tagAt(x,tt,P.todo,out,250,560,"what to do");}
scene("dawn",(ctx,S,t,sc)=>{const P=cw_once(sc,"P",()=>{const c=sc.cues,w=(id,s,o)=>wAt(sc,id,s,o);
    return{raise:0.6,every:w("stop","every car"),cross:c.cross+0.2,waited:w("cross","waited"),drove:w("five","drove"),name:c.name,
      border:c.left-0.2,road:c.wheel-0.2,wheelL:w("wheel","with the wheel"),over:c.overtake,see:w("overtake","couldn't see"),crash:w("overtake","and many")-0.2,change:c.change,
      feared:c.feared-0.1,many:w("feared","many feared"),meet:w("feared","head on"),know:c.know-0.3,y64:c.commission+0.5,y65:c.commission+1.1,y66:c.commission+1.7,
      signs:c.signs-0.2,night:w("signs","covered"),booklet:c.booklet-0.2,milk:w("booklet","and the change")-0.1,huge:c.huge-0.2,half:c.half-0.2,
      knew:c.knew-0.2,what:w("knew","what would"),when:w("knew","when"),todo:w("knew","what they"),breath:c.breath,title:c.breath+0.9};});
  cw_shots(ctx,S,t,sc.dur,[
    {at:0,place:"x67dawn",keys:[[0,1270,470,1.55],[P.every-0.4,960,560,1.0],[P.name,990,540,1.1]],d:2.4,push:0.02,draw:(x,tt)=>cw_dawn(x,tt,P)},
    {at:P.border,place:"x66border",keys:[[P.border,960,540,1.0],[P.border+0.3,980,500,1.3]],d:3.8,draw:(x,tt)=>cw_border(x,tt,P)},
    {at:P.road,place:"x66road",keys:[[P.road,960,560,1.6],[P.wheelL+1.4,960,540,1.0]],d:1.8,push:0,draw:(x,tt)=>cw_overtake(x,tt,P)},
    {at:P.crash,place:"x66road",keys:[[P.crash,960,540,1.0],[P.change-0.6,760,560,1.2]],d:2.2,draw:(x,tt)=>cw_towShot(x,tt,P)},
    {at:P.feared,place:"x67night",keys:[[P.feared,960,560,1.0],[P.feared+0.6,1090,580,1.55]],d:4.2,draw:(x,tt)=>cw_whatIf(x,tt,P)},
    {at:P.know,place:"x63office",keys:[[P.know,960,540,1.0]],draw:(x,tt)=>cw_commission(x,tt,P)},
    {at:P.signs,place:"x67pole",keys:[[P.signs,1100,540,1.0]],draw:(x,tt)=>cw_swap(x,tt,P)},
    {at:P.booklet,place:"x67post",keys:[[P.booklet,960,560,1.0]],draw:(x,tt)=>cw_postman(x,tt,P)},
    {at:P.milk,place:"x67grocer",keys:[[P.milk,920,420,1.3]],draw:(x,tt)=>cw_milk(x,tt,P)},
    {at:P.huge,place:"x67day",keys:[[P.huge,960,540,1.0]],draw:(x,tt)=>cw_morning(x,tt,P)},
    {at:P.half,place:"x67desk",keys:[[P.half,1010,560,1.2]],draw:(x,tt)=>cw_reportsAt(x,tt,P)},
    {at:P.knew,place:"x67dawn",keys:[[P.knew,960,540,1.0]],draw:(x,tt)=>cw_atFive(x,tt,P)}],0.6);
  setScreen(ctx,S);const mk=[[0,"Sweden · 3 September 1967"],[P.border,"Sweden · 1966"],[P.know,"Sweden · 1963"],[P.y64,"Sweden · 1964"],[P.y65,"Sweden · 1965"],[P.y66,"Sweden · 1966"],
    [P.signs,"Sweden · 1967"],[P.huge,"Sweden · 3 September 1967"],[P.half,"Sweden · 1967"],[P.knew,"Sweden · 3 September 1967"]];
  cw_pill(ctx,t,mk,fin(t,0.6,0.5)*(1-gv_io(t,P.feared+0.4,P.know-0.1,0.4))*(1-fin(t,P.title,0.4)));
  gv_title(ctx,S,t,P.title,"Change without surprises","what a change reaches, shown before it goes in","Film 7 of 19 · data governance");wc_paperOver(ctx,S);});

// ---- 2 · The change board: award's meaning changed this morning, and Jun must change what the reports count; the binder says the
// impact is assessed first, and in practice that's a board once a month whose form is answered from memory ----
// the tray of forms at the end of Jun's desk; the notice and the forms on the desks, from above: where each lies, and its scale
const CW_TRAY=[1480,668],CW_RQP=[500,60,0.92],CW_BFP=[470,40,0.98];
const cw_at=(x,P_,fn)=>{x.save();x.translate(P_[0],P_[1]);x.scale(P_[2],P_[2]);const r=fn(x);x.restore();return r?[P_[0]+r[0]*P_[2],P_[1]+r[1]*P_[2]]:null;};
scene("board",(ctx,S,t,sc)=>{const c=sc.cues,P=cw_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{three:w("same","three"),notice:w("award","word")-0.2,mc:w("award","microcredentials"),mei:c.mei-0.2,signed:w("mei","signed")-0.1,
      jun:c.jun-0.2,form:c.jun+1.3,binder:c.binder-0.2,impact:w("binder","impact"),room:c.practice-0.2,cal:w("practice","once")-0.4,month:w("practice","once"),
      form2:w("practice","and its")-0.2,memory:w("practice","answered"),next:c.next-0.2,draft:w("next","draft"),nobody:c.nobody-0.2,rem:w("nobody","remembers"),
      told:w("nobody","told"),better:c.better-0.2,q1:c.better+0.3,q2:c.better+1.8};});
  const title=cw_heldTitled(["Change","without","surprises"],cw_bindCol(18));
  cw_shots(ctx,S,t,sc.dur,[
    // the campus, today: Jun walks up the path to the door
    {at:0,place:"campus",keys:[[0,1180,560,1.25],[0.3,1260,540,1.36]],d:8,draw:(x,tt)=>{const wk=gv_walk(tt,0.6,1080,1446,52),k=(wk.x-1060)/300;
      withA(x,1-fin(tt,wk.end-0.45,0.45),()=>person(x,"jun",wk.x,cw_pathY(wk.x)+2-wk.bob,lerp(0.235,0.19,k),{pose:"stand",pose2:wk.moving?(wk.swing>0?"walkA":"walkB"):null,mix:Math.abs(wk.swing),t:tt}));}},
    // Mei's desk, from above: Monday night's change notice for award, its new words lit violet
    {at:P.notice,place:"topMei",keys:[[P.notice,960,520,1.02],[P.mc-0.3,860,432,1.25]],d:2.2,draw:(x,tt)=>cw_notice(x,{lit:fin(tt,P.mc,0.9)})},
    // Mei, who owns the word, at her desk
    {at:P.mei,place:"regClose",keys:[[P.mei,800,520,1.04],[P.mei+0.1,780,520,1.08]],d:2,draw:(x,tt)=>{
      gv_behind(x,"mei",GV_RX.seat[0],GV_RX.top,GV_RX.seat[1],{pose:"listen",expr:"calm",t:tt,gaze:[0.3,0.6]});x.drawImage(gv_place("regDesk"),0,0,W,H);}},
    // the notice's foot: she signs off the meaning, and a green tick lands
    {at:P.signed,place:"topMei",keys:[[P.signed,800,690,1.45]],d:2,push:0.01,draw:(x,tt)=>{const g=clamp((tt-P.signed-0.25)/1.2,0,1),
      pen=cw_notice(x,{lit:1,sign:g,ok:fin(tt,P.signed+1.6,0.5)});cw_pen(x,pen[0],pen[1],cw_penA(tt,P.signed+0.25,P.signed+1.45));}},
    // the data team's room: Jun takes a change request from the tray on his desk
    {at:P.jun,place:"data",keys:[[P.jun,1420,610,1.3],[P.jun+0.1,1440,610,1.36]],d:2,draw:(x,tt)=>{const has=tt>=P.jun+1.0,h=cw_handAt("jun",0,905,0.8,"cw_reachLow",1),jx=CW_TRAY[0]+40-h[0];
      if(!has)cw_tray(x,CW_TRAY[0],CW_TRAY[1]);else{withA(x,1,()=>cw_tray(x,CW_TRAY[0],CW_TRAY[1]));}
      person(x,"jun",jx,905,0.8,has?{pose:"hold",t:tt,carry:cw_heldForm}:{pose:"listen",pose2:"cw_reachLow",mix:fin(tt,P.jun+0.35,0.5),t:tt});}},
    // the form on his desk: he writes its title, and his name
    {at:P.form,place:"topJun",keys:[[P.form,920,330,1.38]],d:2,push:0.01,draw:(x,tt)=>{const pen=cw_at(x,CW_RQP,q=>cw_request(q,{title:clamp((tt-P.form-0.1)/1.2,0,1),name:clamp((tt-P.form-1.4)/0.45,0,1)}));
      if(pen)cw_pen(x,pen[0],pen[1],cw_penA(tt,P.form+0.1,P.form+1.85));}},
    // Yusuf's office: the shelf, with gaps where five binders have gone to the work; he takes down binder 19
    {at:P.binder,place:"office",keys:[[P.binder,1240,560,1.3],[P.binder+0.1,1250,556,1.34]],d:2,draw:(x,tt)=>{const out=fin(tt,P.binder+0.55,0.35),has=tt>=P.binder+0.9,h=cw_handAt("yusuf",0,905,0.8,"reach",1),yx=1432-h[0];
      cw_binders(x,{out19:has,lift:out});
      person(x,"yusuf",yx,905,0.8,has?{pose:"hold",t:tt,carry:title}:{pose:"listen",pose2:"reach",mix:fin(tt,P.binder+0.05,0.45),t:tt});}},
    // binder 19 open on his desk: policy 19, change management, and its first line, lit gold
    {at:P.impact-0.2,place:"desk",keys:[[P.impact-0.2,1240,420,1.3]],d:2,push:0.012,draw:(x,tt)=>cw_binder19(x,{lit:fin(tt,P.impact,0.8)})},
    // the meeting room, empty: on the wall between the whiteboard and the screen, the change board's calendar
    {at:P.room,place:"meeting",keys:[[P.room,960,540,1],[P.room+0.3,880,400,1.55]],d:1.8,draw:(x,tt)=>{cw_calSmall(x,{});x.drawImage(gv_place("meetingTable"),0,0,W,H);}},
    // the calendar, close: once a month, the next meeting circled in red
    {at:P.cal,place:"calWall",keys:[[P.cal,960,470,1.0],[P.cal+0.1,960,460,1.04]],d:2,draw:(x,tt)=>cw_at(x,[CW_CW.x,CW_CW.y,CW_CW.k],q=>cw_calendar(q,{ring:clamp((tt-P.month)/0.7,0,1)}))},
    // the board's form on the meeting table: what will this change affect? A pencil writes "awards?"
    {at:P.form2,place:"topMeet",keys:[[P.form2,960,470,1.08]],d:2,push:0.012,draw:(x,tt)=>{const pen=cw_at(x,CW_BFP,q=>cw_boardForm(q,{aw:clamp((tt-P.memory)/0.9,0,1)}));
      if(pen)cw_pen(x,pen[0],pen[1],cw_penA(tt,P.memory,P.memory+0.9),{pencil:1});}},
    // the calendar again: the draft submission's gold card sits on a day before the circled one
    {at:P.next,place:"calWall",keys:[[P.next,960,470,1.04],[P.draft-0.4,900,430,1.16]],d:2.2,draw:(x,tt)=>cw_at(x,[CW_CW.x,CW_CW.y,CW_CW.k],q=>cw_calendar(q,{ring:1,draft:clamp((tt-P.draft)/0.9,0,1)}))},
    // the form, close: under "awards?", one line scribbled too small to read, and three left empty
    {at:P.nobody,place:"topMeet",keys:[[P.nobody,960,470,1.08],[P.nobody+0.1,900,566,1.34]],d:2,draw:(x,tt)=>{const g=clamp((tt-P.rem+0.2)/1.0,0,1),
      pen=cw_at(x,CW_BFP,q=>cw_boardForm(q,{aw:1,scrib:g,empty:fin(tt,P.told,0.6)}));if(pen&&g<1)cw_pen(x,pen[0],pen[1],cw_penA(tt,P.rem-0.2,P.rem+0.8),{pencil:1});}},
    // the data team's room: Jun, and Yusuf with binder 19
    {at:P.better,place:"data",keys:[[P.better,1240,540,1.18],[P.better+0.1,1260,530,1.22]],d:3,draw:(x,tt)=>{cw_tray(x,CW_TRAY[0],CW_TRAY[1]);
      person(x,"yusuf",1040,905,0.8,{pose:"hold",t:tt,carry:title});person(x,"jun",1560,905,0.8,{pose:"explain",expr:"concerned",t:tt,flip:true});
      cw_say(x,tt,P.q1,null,1300,170,["So it waits a month?"],1500,430);cw_say(x,tt,P.q2,null,600,250,["Let's see what","it reaches first."],990,440);}}]);
  setScreen(ctx,S);cw_pill(ctx,t,[[0,"Today"]],fin(t,0.4,0.5)*(1-fin(t,P.mei,0.4)));cw_three(ctx,t,P.three,P.notice-0.35,150);
  cw_nameCard(ctx,24,740,"Mei Tanaka","Registrar's office",gv_io(t,P.mei+0.3,P.signed,0.4));
  cw_nameCard(ctx,24,740,"Jun Park","Analytics engineer",gv_io(t,P.jun+0.3,P.form,0.4));
  cw_nameCard(ctx,24,740,"Yusuf Demir","Data governance",gv_io(t,P.binder+0.3,P.impact-0.3,0.4));
  wc_paperOver(ctx,S);});

// ---- 3 · Who uses what: the table's card on the board, and no record of what uses it; a page of the register, each line written by
// its owner, kept by the data team ----
scene("uses",(ctx,S,t,sc)=>{const c=sc.cues,P=cw_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{who:w("see","who"),close:c.table-0.2,look:c.nobody-0.2,back:w("nobody","or who")-0.6,ans:w("nobody","answers"),start:c.start,
      mei:w("start","record")-0.3,clara:c.lines-1.1,marta:c.lines+0.6,jun:w("lines","and Jun")+0.1};});
  const pg=(x,tt,o)=>cw_who(x,CW_PAGE[0],CW_PAGE[1],CW_PAGE[2],o.pr,{foot:o.foot,reg:o.reg}),drop=tt=>easeCam(fin(tt,P.start,0.55));
  cw_shots(ctx,S,t,sc.dur,[
    // the data team's room: Jun and Yusuf at the board, the table's card on it, nothing around it
    {at:0,place:"data",keys:[[0,720,480,1.34],[0.1,700,476,1.4]],d:3,draw:(x,tt)=>{cw_tray(x,CW_TRAY[0],CW_TRAY[1]);cw_boardSmall(x);
      person(x,"yusuf",1040,905,0.8,{pose:"hold",t:tt,flip:true,carry:cw_heldTitled(["Change","without","surprises"],cw_bindCol(18))});
      person(x,"jun",790,905,0.8,{pose:"listen",pose2:"point",mix:gv_io(tt,P.who-0.3,P.close+0.4,0.45),t:tt,flip:true});}},
    // the board, close: the card for the table of credentials
    {at:P.close,place:"boardWide",keys:[[P.close,700,440,1.22],[P.close+0.1,720,440,1.28]],d:6,draw:(x,tt)=>cw_credCard(x,...CW_CARD,1)},
    // Jun looks at the empty board
    {at:P.look,place:"data",keys:[[P.look,700,460,1.5],[P.look+0.1,710,460,1.54]],d:3,draw:(x,tt)=>{cw_boardSmall(x);
      person(x,"yusuf",1040,905,0.8,{pose:"listen",t:tt,flip:true});person(x,"jun",790,905,0.8,{pose:"listen",expr:"concerned",t:tt,flip:true});}},
    // the board again: a pencil question mark beside the card; then the register's new page pinned over it
    {at:P.back,place:"boardWide",keys:[[P.back,820,470,1.06],[P.start-0.3,1000,450,1.1]],d:2.2,draw:(x,tt)=>{cw_credCard(x,...CW_CARD,1);
      const q=cw_qDraw(x,1000,520,240,clamp((tt-P.ans+0.2)/0.9,0,1));if(q&&tt<P.ans+0.8)cw_pen(x,q[0],q[1],cw_penA(tt,P.ans-0.2,P.ans+0.7),{pencil:1});
      const d=drop(tt);if(d>0.01){x.save();x.translate(0,-60*(1-d));withA(x,clamp(d*2,0,1),()=>pg(x,tt,{pr:[0,0,0,0,0]}));gv_pin(x,CW_PAGE[0]+CW_PAGE[2]/2,CW_PAGE[1]+16,GV.red,1.6);x.restore();}}},
    // each owner writes their own line: Mei in the registrar's office
    {at:P.mei,place:"registrar",keys:[[P.mei,940,560,1.3],[P.mei+0.1,950,556,1.34]],d:2,draw:(x,tt)=>person(x,"mei",900,905,0.8,{pose:"write",t:tt,carry:cw_heldPage})},
    // Clara in Planning, two lines
    {at:P.clara,place:"planning",keys:[[P.clara,1060,560,1.3],[P.clara+0.1,1070,556,1.34]],d:2,draw:(x,tt)=>person(x,"clara",1080,905,0.8,{pose:"write",t:tt,carry:cw_heldPage})},
    // Marta in the meeting room
    {at:P.marta,place:"meeting",keys:[[P.marta,1500,560,1.3],[P.marta+0.1,1510,556,1.34]],d:2,draw:(x,tt)=>{person(x,"marta",1720,905,0.8,{pose:"write",t:tt,carry:cw_heldPage,flip:true});
      x.drawImage(gv_place("meetingTable"),0,0,W,H);}},
    // back on the board: Jun copies Finance's note in, and writes at the foot who keeps the page
    {at:P.jun,place:"boardWide",keys:[[P.jun,890,450,1.13],[P.jun+0.1,890,450,1.15]],d:2,draw:(x,tt)=>{cw_credCard(x,...CW_CARD,1);
      const f=clamp((tt-P.jun-0.5)/1.2,0,1),ft=clamp((tt-P.jun-1.9)/1.0,0,1),[px,py,pw]=CW_PAGE,pen=pg(x,tt,{pr:[1,1,1,1,f],foot:ft});gv_pin(x,px+pw/2,py+16,GV.red,1.6);if(pen)cw_pen(x,pen[0],pen[1]);
      cw_finNote(x,1590,690,1-fin(tt,P.jun+3.2,0.6));}}]);
  setScreen(ctx,S);cw_nameCard(ctx,24,740,"Clara Jensen","Planning",gv_io(t,P.clara+0.3,P.marta,0.4));cw_nameCard(ctx,24,740,"Marta Nowak","Wallet app team",gv_io(t,P.marta+0.3,P.jun,0.4));
  wc_paperOver(ctx,S);});

// ---- 4 · The impact note: what it reaches, whether it breaks anything, who must be told; the first draft reaches five things, and
// three didn't ask for it ----
// the change request and its note on Jun's desk: where each lies, and its scale
const CW_RQ4=[110,90,0.84],CW_IN4=[930,150,0.98];
scene("note",(ctx,S,t,sc)=>{const c=sc.cues,P=cw_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{clip:w("note","impact")-0.2,h1:w("note","what"),h2:w("note","whether"),h3:w("note","who"),draft:c.draft-0.2,rel:w("draft","relabels"),board:c.five-0.2,five:w("five","five"),
      list:c.five+2.2,asked:c.asked-0.2,ask:w("asked","asked"),dash:w("didnt","dashboard")-0.3,fore:w("didnt","forecast")-0.3,app:w("didnt","wallet")-0.2,
      names:c.owners-0.2,mei:w("owners","Mei"),clara:w("owners","Clara"),fin:w("owners","Finance"),marta:w("owners","Marta"),room:w("owners","who leads")-0.2};});
  const rq=(x,o)=>cw_at(x,CW_RQ4,q=>cw_request(q,Object.assign({title:1,name:1},o))),note=(x,o)=>cw_at(x,CW_IN4,q=>cw_impact(q,o)),
    heads=tt=>[clamp((tt-P.h1)/0.8,0,1),clamp((tt-P.h2)/0.8,0,1),clamp((tt-P.h3)/0.8,0,1)],[px,py,pw]=CW_PAGE,
    page=(x,tt,g)=>{cw_credCard(x,...CW_CARD,1);cw_who(x,px,py,pw,[1,1,1,1,1],{foot:1});gv_pin(x,px+pw/2,py+16,GV.red,1.6);for(let i=0;i<5;i++)cw_lineGold(x,px,py,pw,i,g(i));};
  cw_shots(ctx,S,t,sc.dur,[
    // Jun's desk: the change request, and the impact note clipped to it, its three headings written as each is said
    {at:0,place:"topJun",keys:[[0,800,500,1.0],[P.clip+0.3,1300,520,1.16]],d:2.2,draw:(x,tt)=>{rq(x,{});const sl=easeCam(fin(tt,P.clip,0.7));if(sl<=0.01)return;
      x.save();x.translate(700*(1-sl),-40*(1-sl));const pen=note(x,{heads:heads(tt)});x.restore();if(pen)cw_pen(x,pen[0]+700*(1-sl),pen[1],cw_penA(tt,P.h1,P.h3+0.8));}},
    // the request, close: its one change, in a box
    {at:P.draft,place:"topJun",keys:[[P.draft,700,610,1.5]],d:2,push:0.012,draw:(x,tt)=>{const b=clamp((tt-P.rel-0.1)/1.5,0,1),pen=rq(x,{box1:b});note(x,{heads:[1,1,1]});
      if(pen&&b<1)cw_pen(x,pen[0],pen[1],cw_penA(tt,P.rel+0.1,P.rel+1.6));}},
    // the board: the register's five lines wash gold, one after another
    {at:P.board,place:"boardWide",keys:[[P.board,880,450,1.1],[P.board+0.1,880,450,1.13]],d:2,draw:(x,tt)=>page(x,tt,i=>fin(tt,P.five+0.25*i,0.35))},
    // the note: what it reaches, five things
    {at:P.list,place:"topJun",keys:[[P.list,1330,420,1.3]],d:2,push:0.01,draw:(x,tt)=>{rq(x,{box1:1});const r=clamp((tt-P.list-0.15)/1.4,0,1),pen=note(x,{reach:CW_REACH1,reachP:r});
      if(pen&&r<1)cw_pen(x,pen[0],pen[1]);}},
    // the board: who asked for it, and who didn't
    {at:P.asked,place:"boardWide",keys:[[P.asked,900,450,1.06],[P.asked+0.1,901,450,1.08]],d:2,draw:(x,tt)=>{page(x,tt,()=>1);const tx=px+pw+22;
      [0,1].forEach(i=>cw_lineTag(x,tx,cw_rowY(py,pw,i),"asked for it",GV.green,GV.greenInk,fin(tt,P.ask+0.2*i,0.45)));
      [[2,P.dash],[4,P.fore],[3,P.app]].forEach(([i,t0])=>cw_lineTag(x,tx,cw_rowY(py,pw,i),"didn't ask",GV.grey,WC_INK,fin(tt,t0,0.45)));}},
    // the note: who must be told, four names, and a quick look at each owner
    {at:P.names,place:"topJun",keys:[[P.names,1152,640,1.25]],d:2,push:0.006,draw:(x,tt)=>{rq(x,{box1:1});const n=clamp((tt-P.mei+0.1)/(P.marta+0.9-P.mei),0,1),pen=note(x,{reach:CW_REACH1,names:CW_NAMES1,namesP:n});
      if(pen&&n<1)cw_pen(x,pen[0],pen[1]);
      [["mei",P.mei,GV_ROOM.reg],["clara",P.clara,GV_ROOM.plan],[null,P.fin,null],["marta",P.marta,GV_ROOM.meet]].forEach(([id,t0,wall],i)=>
        cw_cameo(x,1184+i*136,636,58,id,fin(tt,t0-0.1,0.45),{wall,word:"Finance",size:26,t:tt}));}},
    // Marta, who leads the wallet app team, in the meeting room
    {at:P.room,place:"meeting",keys:[[P.room,1220,600,1.5],[P.room+0.1,1220,600,1.56]],d:2.4,draw:(x,tt)=>{gv_behind(x,"marta",1200,GV_MT.top,GV_MT.s,{pose:"listen",t:tt});
      x.drawImage(gv_place("meetingTable"),0,0,W,H);}}]);
  setScreen(ctx,S);cw_nameCard(ctx,24,740,"Marta Nowak","Wallet app team",gv_io(t,P.room+0.4,sc.dur+1,0.4));
  wc_paperOver(ctx,S);});

// ---- 5 · Breaking or not? Relabelled, the big microcredentials would drop out of two numbers no one meant to move, and the wallets
// would show them as awards; the table would look the same, but changing what data means is breaking: Mei decides it breaks ----
scene("breaks",(ctx,S,t,sc)=>{const c=sc.cues,P=cw_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{close:c.credit+2.0,mc:w("part","microcredentials"),rel:w("drop","Relabelled"),drop:w("drop","drop out")-0.2,both:w("drop","both")-0.4,wallet:c.wallet-0.2,
      wrel:w("wallet","as awards")-0.2,table:c.same-0.2,same:w("same","same"),breaking:w("meaning","breaking"),road:c.road-0.2,sw:w("road","switching")+0.2,
      room:c.decides-0.6,bub:c.decides-0.3,stamp:w("decides","this one")-0.1};});
  const press=P.stamp+0.5,dawnP={cross:P.sw,drove:1e9,name:1e9,raise:-10,waited:1e9},[px,py,pw]=CW_PAGE;
  cw_shots(ctx,S,t,sc.dur,[
    // Planning: Clara at her wall screen, her dashboard of learners near an award
    {at:0,place:"planning",keys:[[0,1000,480,1.22],[0.1,1010,476,1.26]],d:3,draw:(x,tt)=>{cw_dashSmall(x,{});
      person(x,"clara",1420,905,0.8,{pose:"listen",pose2:"point",mix:gv_io(tt,0.6,P.close+0.4,0.45),t:tt,flip:true});}},
    // the dashboard, close: one learner's credit towards an award, in two parts; relabelled, the big microcredential drops out
    {at:P.close,place:"planScreen",keys:[[P.close,960,520,1.0],[P.mc-0.4,1080,560,1.16]],d:2.4,push:0.01,draw:(x,tt)=>cw_dash(x,{rel:fin(tt,P.rel,0.7),drop:clamp((tt-P.drop)/1.3,0,1)})},
    // the board: Finance's forecast, pinned beside its line, moves too
    {at:P.both,place:"boardWide",keys:[[P.both,1400,560,1.3]],d:2,push:0.01,draw:(x,tt)=>{cw_credCard(x,...CW_CARD,1);cw_who(x,px,py,pw,[1,1,1,1,1],{foot:1});gv_pin(x,px+pw/2,py+16,GV.red,1.6);
      cw_lineGold(x,px,py,pw,4,0.8);cw_forecast(x,1560,cw_rowY(py,pw,4)-110,{shift:clamp((tt-P.both-0.4)/1.2,0,1)});}},
    // a learner's phone: the wallet app shows the microcredential as an award
    {at:P.wallet,place:"phoneBg",keys:[[P.wallet,960,500,1.0],[P.wallet+0.1,960,480,1.04]],d:3,draw:(x,tt)=>cw_phone(x,{rel:fin(tt,P.wrel,0.7)})},
    // the table of credentials, a ruled page: the same, but for one word in one row; and changing what it means is breaking
    {at:P.table,place:"topJun",keys:[[P.table,860,480,1.1],[P.same,900,470,1.2]],d:2.4,push:0.01,draw:(x,tt)=>cw_table(x,{rel:fin(tt,P.same,0.7),red:fin(tt,P.breaking,0.6)})},
    // 1967: switching sides of the road, the cars cross to the right together
    {at:P.road,place:"x67dawn",keys:[[P.road,960,560,1.0]],d:2,push:0.02,draw:(x,tt)=>cw_dawn(x,tt,dawnP)},
    // the data team's room: Mei, Jun and Yusuf at the board with the note; Mei, who owns the meaning, decides
    {at:P.room,place:"data",keys:[[P.room,900,500,1.24],[P.room+0.1,910,500,1.28]],d:3,draw:(x,tt)=>{cw_boardSmall(x,{page:1,n:5,foot:1});
      person(x,"mei",600,905,0.8,{pose:"explain",t:tt});person(x,"jun",1010,905,0.8,{pose:"hold",t:tt,flip:true,carry:cw_heldNote});
      person(x,"yusuf",1250,905,0.8,{pose:"listen",t:tt,flip:true});cw_say(x,tt,P.bub,null,470,150,["Then microcredential","means something else."],610,440);}},
    // the note, close: her stamp on "Does it break?", "breaks", and her initials
    {at:P.stamp,place:"topJun",keys:[[P.stamp,1240,560,1.38]],d:2,push:0.01,draw:(x,tt)=>{cw_at(x,CW_RQ4,q=>cw_request(q,{title:1,name:1,box1:1}));
      const mt=clamp((tt-press-0.7)/0.6,0,1),pen=cw_at(x,CW_IN4,q=>cw_impact(q,{reach:CW_REACH1,names:CW_NAMES1,stampP:fin(tt,press,0.3),mt}));
      cw_stamper(x,930+250*0.98,150+484*0.98,clamp((tt-P.stamp)/1.0,0,1),[98,134,114],[232,194,164]);if(pen&&mt<1)cw_pen(x,pen[0],pen[1]);}}]);
  setScreen(ctx,S);wc_year(ctx,56,72,"Sweden · 1967",gv_io(t,P.road+0.3,P.room,0.4));
  wc_paperOver(ctx,S);});

// ---- 6 · Add, don't break: one new mark, yes or no, that follows Mei's rule; nothing changes until a team chooses it, and the note
// now reaches three things, and breaks none ----
const CW_TB6=[60,120,1000],CW_N1=[90,150,0.86],CW_N2=[1010,150,0.86];
scene("adds",(ctx,S,t,sc)=>{const c=sc.cues,P=cw_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{cross:c.adds+0.2,table:c.mark-0.2,mark:w("mark","one new mark"),yes:w("mark","yes or no"),reg:c.choose-0.2,gold:w("lists","only what"),
      note:w("lists","the two")-0.3,names:w("lists","three owners"),side:c.nothing-0.3,no:w("nothing","breaks")};});
  const [px,py,pw]=CW_PAGE,cred=[0,1,3];
  cw_shots(ctx,S,t,sc.dur,[
    // Jun's desk: he crosses out the first draft's box, and writes a new one
    {at:0,place:"topJun",keys:[[0,560,560,1.48]],d:2,push:0.01,draw:(x,tt)=>{const cr=clamp((tt-P.cross)/0.6,0,1),b2=clamp((tt-P.cross-0.7)/1.4,0,1),
      pen=cw_at(x,CW_RQ4,q=>cw_request(q,{title:1,name:1,box1:1,cross:cr,box2:b2}));cw_at(x,CW_IN4,q=>cw_impact(q,{reach:CW_REACH1,names:CW_NAMES1,stampP:1,mt:1}));
      if(pen&&b2<1)cw_pen(x,pen[0],pen[1],cw_penA(tt,P.cross,P.cross+2.1));}},
    // the table of credentials: the new column slides in, in green; its yes cells light violet, with the 6 credit points of Mei's rule
    {at:P.table,place:"topJun",keys:[[P.table,760,470,1.12],[P.mark+0.4,960,470,1.0]],d:2.2,push:0.01,draw:(x,tt)=>{const y=fin(tt,P.yes,0.8);
      cw_table(x,{at:CW_TB6,rel:0,mark:clamp((tt-P.mark)/0.9,0,1),yes:y});
      const rc=fin(tt,P.yes-0.3,0.6);if(rc>0)withA(x,rc,()=>cw_ruleCard(x,1420,180+40*(1-easeCam(rc)),{lit:y}));}},
    // the register on the board: its five lines stay as they are
    {at:P.reg,place:"boardWide",keys:[[P.reg,860,450,1.06],[P.reg+0.1,880,450,1.1]],d:3,draw:(x,tt)=>{cw_credCard(x,...CW_CARD,1);cw_who(x,px,py,pw,[1,1,1,1,1],{foot:1});gv_pin(x,px+pw/2,py+16,GV.red,1.6);
      cred.forEach((i,j)=>cw_lineGold(x,px,py,pw,i,fin(tt,P.gold+0.25*j,0.35)));}},
    // a new impact note: what it reaches, three things, and who must be told, three owners
    {at:P.note,place:"topJun",keys:[[P.note,1180,520,1.2]],d:2,push:0.01,draw:(x,tt)=>{cw_at(x,CW_RQ4,q=>cw_request(q,{title:1,name:1,box1:1,cross:1,box2:1}));
      const r=clamp((tt-P.note-0.2)/1.2,0,1),n=clamp((tt-P.names)/1.1,0,1),pen=cw_at(x,CW_IN4,q=>cw_impact(q,{reach:CW_REACH2,reachP:r,names:n>0?CW_NAMES2:null,namesP:n}));
      if(pen&&(r<1||n<1))cw_pen(x,pen[0],pen[1]);}},
    // side by side: the first note, long, with its red stamp; the second, short, and nothing breaks
    {at:P.side,place:"topJun",keys:[[P.side,928,520,1.04],[P.side+0.1,928,520,1.07]],d:2.4,draw:(x,tt)=>{
      cw_at(x,CW_N1,q=>cw_impact(q,{reach:CW_REACH1,names:CW_NAMES1,stampP:1,mt:1,clip:false}));
      cw_at(x,CW_N2,q=>cw_impact(q,{reach:CW_REACH2,names:CW_NAMES2,no:clamp((tt-P.no+0.1)/0.8,0,1),clip:false}));}}]);
  wc_paperOver(ctx,S);});

["edition","words","ready","step"].forEach(id=>scene(id,(ctx,S,t,sc)=>{cw_shots(ctx,S,t,sc.dur,[{at:0,place:"x67day",keys:[[0,960,540,1]],push:0}]);wc_paperOver(ctx,S);}));
