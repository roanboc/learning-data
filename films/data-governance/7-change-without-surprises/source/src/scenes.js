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
  gv_title(ctx,S,t,P.title,"Change without surprises","what a change reaches, shown before it goes in","Film 7 of 10 · data governance");wc_paperOver(ctx,S);});

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

// ---- 7 · The old edition: some changes can't be added; a new edition goes beside the old one, like the new signs beside the old, and the
// old one stays until a date everyone knows ----
scene("edition",(ctx,S,t,sc)=>{const c=sc.cues,P=cw_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{rub:w("cant","taking"),cross:w("cant","away")-0.3,ed2:w("beside","new edition")-0.15,pole:w("beside","like")-0.2,back:w("beside","and the old")+0.1,
      tag:w("beside","until")-0.1,push:c.retires-0.4,swing:w("last","last resort")-0.25};});
  const L1=[140,120],L0=[330,120],L2=[1020,120],ed2=CW_FIELDS.slice(0,4);
  // the pole in Sweden in the days before: the old sign open, and the new one beside it in its black cover
  const signs=x=>{const O=CW_PO,[so,sn]=O.signs,r=O.r;cw_sign(x,so[0],so[1],r,-1);cw_sign(x,sn[0],sn[1],r,1);cw_cover(x,sn[0],sn[1],r,1);};
  cw_shots(ctx,S,t,sc.dur,[
    // the shelf by the data team's board: edition 1, open. A line rubbed out, and a red cross beside it; then edition 2 slides in beside
    // it, without that line, and the first is as it was
    {at:0,place:"shelf",keys:[[0,740,500,1.3],[P.ed2,960,540,1.0]],d:1.8,push:0.01,draw:(x,tt)=>{const s=easeCam(fin(tt,P.ed2,1.5)),back=fin(tt,P.ed2,0.7);
      cw_ledger(x,lerp(L0[0],L1[0],s),L1[1],1,{rub:fin(tt,P.rub,0.9),rubA:1-back,cross:fin(tt,P.cross,0.7),crossA:1-back});if(s>0.001)cw_ledger(x,lerp(1980,L2[0],s),L2[1],2,{lines:ed2});}},
    {at:P.pole,place:"x67pole",keys:[[P.pole,1100,470,1.35]],d:2,push:0.02,draw:(x,tt)=>signs(x)},
    // the two editions side by side; a tag on edition 1, "retires 31 March 2027", that swings once on "the last resort"
    {at:P.back,place:"shelf",keys:[[P.back,960,540,1.0],[P.push,700,520,1.25]],d:2.2,push:0.01,draw:(x,tt)=>{
      cw_ledger(x,...L1,1,{tag:fin(tt,P.tag,0.6),swing:clamp((tt-P.swing)/2.4,0,1)});cw_ledger(x,...L2,2,{lines:ed2});}}]);
  setScreen(ctx,S);wc_year(ctx,56,72,"Sweden · 1967",gv_io(t,P.pole+0.3,P.back,0.4));wc_paperOver(ctx,S);});

// ---- 8 · In their words: the note says who must be told; Jun writes to the wallet team in their words, not his; like Sweden's
// booklet, what changes, from when and what to do; he adds who will help, and Marta reads it ----
scene("words",(ctx,S,t,sc)=>{const c=sc.cues,P=cw_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{hi:w("told","who must")-0.1,ask:w("told","didn't")-0.1,desk:c.writes-0.4,write:w("writes","writes to")+0.2,strike:w("writes","not his")-0.1,
      book:c.booklet-0.3,t0:w("booklet","what changes")-0.2,t1:w("booklet","from when")-0.2,t2:w("booklet","what to do")-0.2,help:c.help,
      room:c.half-0.5,nod:w("half","telling")-0.2,pad:c.half+(sc.ends.half-c.half)+0.5};});
  const NT=[520,120,1],OU=[110,300],TH=[940,160],TH3=[80,170],BK=[1300,200];
  // a tag from 1967 lifts off the booklet's picture and lands at the end of the note's row
  const tag=(x,tt,i,s,row)=>{const t0=[P.t0,P.t1,P.t2][i],a=fin(tt,t0,0.25);if(a<=0.01)return;const f=easeCam(fin(tt,t0+0.3,0.7)),
      [sx,sy]=[BK[0]+CW_BKP[i][0]-60,BK[1]+CW_BKP[i][1]],[ex,ey]=[TH3[0]+830,TH3[1]+CW_THEIRS[row][1]-12],k=lerp(1.15,1,spring(a));
    x.save();x.translate(lerp(sx,ex,f),lerp(sy,ey,f)-60*Math.sin(f*Math.PI));x.scale(k,k);withA(x,clamp(a*2,0,1),()=>wc_tag(x,0,0,s,{align:"left",size:34}));x.restore();};
  cw_shots(ctx,S,t,sc.dur,[
    // the second impact note, close: who must be told; Marta's name lights gold, and "didn't ask" lands beside it
    {at:0,place:"topJun",keys:[[0,960,640,1.4]],d:2,push:0.012,draw:(x,tt)=>{cw_at(x,NT,q=>{cw_impact(q,{reach:CW_REACH2,names:CW_NAMES2,no:1,clip:false});
        const hA=fin(tt,P.hi,0.6);if(hA>0.01){q.save();q.globalCompositeOperation="multiply";q.fillStyle=rgba(wc_lit(GV.gold,0.6),hA);wc_tr(q,wc_rrPts(60,668,tw(q,"Marta Nowak",32,600)+28,46,8));q.fill();q.restore();}
        cw_lineTag(q,96+tw(q,"Marta Nowak",32,600)+20,690,"didn't ask",GV.grey,WC_INK,fin(tt,P.ask,0.45));});}},
    // Jun's desk: his first try, in the data team's words, and the note he writes in the wallet team's; the first is struck through
    {at:P.desk,place:"topJun",keys:[[P.desk,955,470,1.08]],d:2,push:0.012,draw:(x,tt)=>{cw_at(x,[...OU,1],q=>cw_ourNote(q,{strike:clamp((tt-P.strike)/0.9,0,1)}));
      const pen=cw_at(x,[...TH,1],q=>cw_theirNote(q,{p:clamp((tt-P.write)/4.4,0,1)}));if(pen)cw_pen(x,pen[0],pen[1],cw_penA(tt,P.write,P.write+4.4));}},
    // the note and Sweden's booklet beside it: what would change, when and what to do, lifted off its pictures onto the note's rows;
    // then Jun adds who will help, and his name
    {at:P.book,place:"topJun",keys:[[P.book,960,540,1.0]],d:2,push:0.012,draw:(x,tt)=>{const b=easeCam(fin(tt,P.book+0.2,0.9));
      const pen=cw_at(x,[...TH3,1],q=>cw_theirNote(q,{p:1,p2:clamp((tt-P.help)/1.3,0,1)}));if(b>0.001)cw_bookletOpen(x,BK[0]+(1-b)*700,BK[1]);
      tag(x,tt,0,"what would change",1);tag(x,tt,1,"when",0);tag(x,tt,2,"what to do",3);if(pen)cw_pen(x,pen[0],pen[1],cw_penA(tt,P.help,P.help+1.3));}},
    // the meeting room: Marta reads the note across the table from Jun, and nods
    {at:P.room,place:"meeting",keys:[[P.room,960,680,1.66],[P.room+0.1,960,676,1.72]],d:3,draw:(x,tt)=>{
      gv_behind(x,"jun",720,GV_MT.top,GV_MT.s,{pose:"listen",t:tt});gv_behind(x,"marta",1200,GV_MT.top,GV_MT.s,{pose:"hold",t:tt,flip:true,carry:cw_heldLetter,nod:cw_nod(tt,P.nod)});
      x.drawImage(gv_place("meetingTable"),0,0,W,H);}},
    // without words: in her notebook, she writes "Thursday"
    {at:P.pad,place:"topMeet",keys:[[P.pad,900,520,1.2]],d:2,push:0.012,draw:(x,tt)=>{const pen=cw_at(x,[640,140,1],q=>cw_notebook(q,{p:clamp((tt-P.pad-0.4)/1.1,0,1)}));
      if(pen)cw_pen(x,pen[0],pen[1],cw_penA(tt,P.pad+0.4,P.pad+1.5));}}]);
  wc_paperOver(ctx,S);});

// ---- 9 · Ready: from Wednesday the draft submission counts with the new mark, the census report from its next run; like the cars at
// ten to five, the change waits until each owner it reaches is ready; it goes in today ----
scene("ready",(ctx,S,t,sc)=>{const c=sc.cues,P=cw_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{ins:w("wed","draft")+0.1,card1:w("wed","counts")-0.2,plan:w("wed","and Planning")-0.3,card2:w("wed","next run")-0.6,cars:c.wait-0.25,board:w("wait","the change")-0.2,
      mei:w("wait","Mei")-0.15,stamp:c.goes-0.35,press:w("goes","goes in")+0.15,thu:w("goes","today")+0.2};});
  const dawnP={cross:-10,drove:1e9,name:1e9,raise:-10,waited:1e9},[px,py,pw]=CW_PAGE,own=[[0,"mei",GV_ROOM.reg],[3,"marta",GV_ROOM.meet],[1,"clara",GV_ROOM.plan]];
  cw_shots(ctx,S,t,sc.dur,[
    // the registrar's office: Mei holds up the draft submission
    {at:0,place:"registrar",keys:[[0,930,560,1.42],[0.1,936,556,1.46]],d:3,draw:(x,tt)=>person(x,"mei",900,905,0.8,{pose:"hold",t:tt,carry:cw_heldDraft})},
    // on her desk, its card goes on: "counts as an award · from Wednesday"
    {at:P.ins,place:"topMei",keys:[[P.ins,960,560,1.08]],d:2,push:0.012,draw:(x,tt)=>{cw_at(x,[560,110,1],q=>{cw_report(q,"Draft submission","Registrar's office",GV_ROOM.reg);
      cw_whenCard(q,150,330,520,"from Wednesday",fin(tt,P.card1,0.6));});}},
    // Planning: the census report on Clara's desk, and its card, "counts as an award · from its next run"
    {at:P.plan,place:"topPlan",keys:[[P.plan,960,560,1.08]],d:2,push:0.012,draw:(x,tt)=>{cw_at(x,[560,110,1],q=>{cw_report(q,"Census report","Planning",GV_ROOM.plan);
      cw_whenCard(q,150,330,520,"from its next run",fin(tt,P.card2,0.6));});}},
    // Sweden, ten to five: the cars on the right, stopped, waiting
    {at:P.cars,place:"x67dawn",keys:[[P.cars,960,560,1.0]],d:2,push:0.02,draw:(x,tt)=>cw_dawn(x,tt,dawnP)},
    // the register on the board: the three lines that use credentials light gold one by one; each owner nods, and "ready" lands
    {at:P.board,place:"boardWide",keys:[[P.board,900,450,1.08],[P.board+0.1,901,450,1.1]],d:2,draw:(x,tt)=>{cw_credCard(x,...CW_CARD,1);cw_who(x,px,py,pw,[1,1,1,1,1],{foot:1});
      gv_pin(x,px+pw/2,py+16,GV.red,1.6);own.forEach(([i,id,wall],j)=>{const t0=P.mei+1.0*j,ry=cw_rowY(py,pw,i);cw_lineGold(x,px,py,pw,i,fin(tt,t0-0.2,0.35));
        cw_cameo(x,px+pw+92,ry,40,id,gv_io(tt,t0,t0+1.0,0.3),{wall,t:tt,nod:cw_nod(tt,t0+0.3)});
        wc_tick(x,px+pw-58,ry-2,40,GV.greenInk,clamp((tt-t0-0.75)/0.35,0,1),6);cw_lineTag(x,px+pw+22,ry,"ready",GV.green,GV.greenInk,fin(tt,t0+0.85,0.45));});}},
    // the change request, close: Jun stamps it, "in · today"
    {at:P.stamp,place:"topJun",keys:[[P.stamp,560,540,1.15]],d:2,push:0.012,draw:(x,tt)=>{cw_at(x,CW_RQ4,q=>cw_request(q,{title:1,name:1,box1:1,cross:1,box2:1,stamp:clamp((tt-P.press)/0.4,0,1)}));
      cw_at(x,CW_IN4,q=>cw_impact(q,{reach:CW_REACH2,names:CW_NAMES2,no:1}));cw_stamper(x,110+0.84*770,90+0.84*808,clamp((tt-P.press+0.5)/1.0,0,1),[62,120,112],[226,186,150]);}},
    // Thursday: in the meeting room, Jun and Marta side by side at a laptop that faces away, working
    {at:P.thu,place:"meeting",keys:[[P.thu,1080,660,1.62],[P.thu+0.1,1080,656,1.68]],d:3,draw:(x,tt)=>{
      gv_behind(x,"jun",960,GV_MT.top,GV_MT.s,{pose:"write",t:tt,gaze:[0.6,0.7]});gv_behind(x,"marta",1200,GV_MT.top,GV_MT.s,{pose:"write",t:tt,flip:true,gaze:[0.6,0.7]});
      x.drawImage(gv_place("meetingTable"),0,0,W,H);cw_laptopBack(x,1080,GV_MT.top+26);}}]);
  setScreen(ctx,S);wc_year(ctx,56,72,"Sweden · 3 September 1967",gv_io(t,P.cars+0.3,P.board,0.4));cw_pill(ctx,t,[[0,"Thursday"]],gv_io(t,P.thu+0.3,sc.dur-0.5,0.5));wc_paperOver(ctx,S);});

// ---- 10 · A step, not a meeting: the policy's line leaves the shelf and becomes a box on every change request; every team adds its
// line to the record; the board meets only when a change needs it. It paid off: in today, nothing broke, the two reports agree, and,
// like Sweden's morning, no one was surprised. One question is left ----
// Sweden, the morning after: the traffic flows on the right, and the officer, his glove down, walks off the road to the pavement
function cw_after(x,tt,t0){const C=CW_ST,u=tt-t0,items=[];CW_LIT=[];
  items.push([16+5*u,()=>cw_bus(x,C,{x:1.9,z:16+5*u})]);items.push([38+6*u,()=>cw_car(x,C,{x:1.9,z:38+6*u,col:CW_PAINT[4]})]);
  items.push([72-11*u,()=>cw_car(x,C,{x:-1.9,z:72-11*u,h:Math.PI,col:CW_PAINT[2]})]);items.push([120-10*u,()=>cw_car(x,C,{x:-1.9,z:120-10*u,h:Math.PI,col:CW_PAINT[0]})]);
  const g=easeCam(clamp((u-0.5)/3.4,0,1)),X=lerp(0.3,5.2,g),walking=g>0&&g<1,ph=(u-0.5)*Math.PI*2.2,sw=walking?Math.sin(ph):0,k=cw_ppm(C,22.5),[ox,oy]=cw_pj(C,X,0,22.5);
  items.push([22.5,()=>person(x,"cw_officer",ox,oy-Math.abs(sw)*0.02*k,1.8*k/560,{pose:"stand",pose2:sw>0?"walkA":"walkB",mix:Math.min(1,Math.abs(sw)*1.2),t:tt})]);
  cw_depth(items);cw_lights();}
scene("step",(ctx,S,t,sc)=>{const c=sc.cues,P=cw_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{close:w("shelf","the line")-0.3,lift:w("shelf","leaves")-0.3,yus:c.every-0.6,form:w("every","carries")-0.2,land:w("every","impact")-0.3,own:w("every","owners")-0.2,
      reg:c.team-0.5,six:w("team","adds")-0.1,cal:c.board-0.5,fade:w("board","only"),note:w("board","when")-0.1,pays:c.pays-0.4,today:c.today-0.4,ring:w("today","today")-0.1,
      month:w("today","month")-0.2,broke:c.broke-0.7,agree:w("broke","and the two")-0.2,line:w("broke","agree")-0.3,morn:c.morning-0.4,idea:c.idea-0.4,clip:c.idea+0.2,
      late:c.late-0.4,near:w("late","a table")-0.2,owner:w("late","who answers")-0.1,end:c.breath-0.2};});
  const [px,py,pw]=CW_PAGE,RQB=[560,60,0.9],NT6=[44,176,0.7],PG6=[688,100,1000];
  cw_shots(ctx,S,t,sc.dur,[
    // Yusuf's office: binder 19 open on his desk, beside the newest DMBOK
    {at:0,place:"office",keys:[[0,940,500,1.36],[0.1,944,496,1.4]],d:3,draw:(x,tt)=>{gv_behind(x,"yusuf",860,GV_OFF.desk[1],0.8,{standing:true,pose:"listen",t:tt,gaze:[0.3,0.9]});
      cw_binderFlat(x,860,GV_OFF.desk[1]+4);}},
    // the binder, close: its line about change lifts off the page as a gold card, and goes
    {at:P.close,place:"desk",keys:[[P.close,1240,420,1.3]],d:2,push:0.012,draw:(x,tt)=>cw_binder19(x,{lit:1,lift:fin(tt,P.lift,0.8),go:fin(tt,P.lift+0.9,1.0)})},
    // the data team's room: Yusuf reaches up with the card to a blank change request form on the board, and puts it at its foot
    {at:P.yus,place:"data",keys:[[P.yus,760,460,1.42],[P.yus+0.1,770,456,1.46]],d:3,draw:(x,tt)=>{cw_tray(x,CW_TRAY[0],CW_TRAY[1]);cw_boardSmall(x);
      const [fx,fy]=[742,381];x.save();x.fillStyle="rgba(60,50,40,0.2)";x.fillRect(fx-34,fy-44,72,94);x.fillStyle="rgb(250,248,242)";x.fillRect(fx-38,fy-48,72,94);x.fillStyle=rgba(wc_lit(GV.cyanInk,0.8),1);x.fillRect(fx-34,fy-44,64,10);x.restore();
      const h=cw_handAt("yusuf",0,905,0.8,"cw_pin",1);
      person(x,"yusuf",fx-10-h[0],905,0.8,{pose:"listen",pose2:"cw_pin",mix:fin(tt,P.form-1.0,1.0),t:tt,flip:false,carry:cw_heldGold});}},
    // the form, close: the card lands on it, and becomes the box every request now has; each owner's ready, in green
    {at:P.form,place:"boardWide",keys:[[P.form,960,550,1.06]],d:2,push:0.012,draw:(x,tt)=>{const g=easeCam(fin(tt,P.form+0.1,0.7)),nb=fin(tt,P.land+0.2,0.8);
      cw_at(x,RQB,q=>{cw_request(q,{blank:1,newBox:nb});gv_pin(q,500,16,GV.red,1.6);});
      if(nb<1){const [tx,ty]=[RQB[0]+500*RQB[2],RQB[1]+816*RQB[2]];x.save();x.translate(lerp(tx-1250,tx,g),lerp(ty+180,ty,g));x.scale(0.9,0.9);withA(x,1-clamp(nb*2,0,1),()=>{
        wc_panel(x,-320,-72,640,150,{kind:"card",wash:GV.gold,washA:0.5,seed:57});cw_T(x,"19.1",-290,-16,{w:800,size:30,col:GV.goldInk});
        CW_OBL.forEach((l,j)=>cw_T(x,l,-210,-16+j*44,{w:600,size:30,col:WC_DARK}));});x.restore();}
      const og=fin(tt,P.own,0.5);if(og>0.01)cw_at(x,RQB,q=>{q.save();q.globalCompositeOperation="multiply";q.fillStyle=rgba(wc_lit(GV.green,0.6),og);q.fillRect(644,772,286,38);q.restore();});}},
    // the register: a team that starts using credentials writes its own line, in its own hand
    {at:P.reg,place:"boardWide",keys:[[P.reg,900,470,1.04],[P.reg+0.1,902,468,1.06]],d:3,draw:(x,tt)=>{cw_credCard(x,...CW_CARD,1);
      const p6=clamp((tt-P.six)/1.5,0,1),pen=cw_who(x,px,py,pw,[1,1,1,1,1,p6],{foot:1,rows:CW_WHO6,inks:CW_INK6});gv_pin(x,px+pw/2,py+16,GV.red,1.6);
      if(pen&&p6<1)cw_pen(x,pen[0],pen[1]);cw_cameo(x,px+pw+92,cw_rowY(py,pw,5),44,"anil",gv_io(tt,P.six-0.3,P.six+1.9,0.35),{wall:GV_ROOM.fac,t:tt});}},
    // the meeting room's calendar: the monthly circles fade; one note stays, "for a change that needs it"
    {at:P.cal,place:"calWall",keys:[[P.cal,960,470,1.0],[P.cal+0.1,960,466,1.03]],d:3,draw:(x,tt)=>cw_at(x,[CW_CW.x,CW_CW.y,CW_CW.k],q=>cw_calendar(q,{ring:1,fade:0.75*fin(tt,P.fade,0.9),note:fin(tt,P.note,0.6)}))},
    // the change request, close: in, today
    {at:P.pays,place:"topJun",keys:[[P.pays,560,540,1.15],[P.pays+0.1,566,536,1.19]],d:3,draw:(x,tt)=>{cw_at(x,CW_RQ4,q=>cw_request(q,{title:1,name:1,box1:1,cross:1,box2:1,stamp:1}));
      cw_at(x,CW_IN4,q=>cw_impact(q,{reach:CW_REACH2,names:CW_NAMES2,no:1}));}},
    // the calendar: today ringed in gold, weeks before the board's faded circle
    {at:P.today,place:"calWall",keys:[[P.today,960,470,1.0],[P.today+0.1,960,466,1.03]],d:3,draw:(x,tt)=>cw_at(x,[CW_CW.x,CW_CW.y,CW_CW.k],q=>{
      cw_calendar(q,{ring:1,fade:0.75-0.45*gv_io(tt,P.month,P.month+1.1,0.35),note:1,today:fin(tt,P.ring,0.8)});})},
    // nothing broke: the register, every line as it was, beside the second note's green tick
    {at:P.broke,place:"boardWide",keys:[[P.broke,960,470,1.0]],d:2,push:0.01,draw:(x,tt)=>{cw_at(x,NT6,q=>{cw_impact(q,{reach:CW_REACH2,names:CW_NAMES2,no:1,clip:false});gv_pin(q,440,12,GV.red,2);});
      cw_who(x,...PG6,[1,1,1,1,1,1],{foot:1,rows:CW_WHO6,inks:CW_INK6});gv_pin(x,PG6[0]+PG6[2]/2,PG6[1]+16,GV.red,1.6);}},
    // the two reports will agree: the draft submission's card and the census report's, side by side, joined by a gold line
    {at:P.agree,place:"topMeet",keys:[[P.agree,960,500,1.0],[P.agree+0.1,960,496,1.03]],d:3,draw:(x,tt)=>{
      cw_at(x,[180,150,0.8],q=>{cw_report(q,"Draft submission","Registrar's office",GV_ROOM.reg);cw_whenCard(q,150,330,520,"from Wednesday",1);});
      cw_at(x,[1180,150,0.8],q=>{cw_report(q,"Census report","Planning",GV_ROOM.plan);cw_whenCard(q,150,330,520,"from its next run",1);});
      const e=easeCam(fin(tt,P.line,0.9));if(e>0.01){const y0=150+0.8*394,x0=180+0.8*670,x1=1180+0.8*150;x.save();x.strokeStyle=rgba(GV.goldInk,0.9);x.lineWidth=7;x.lineCap="round";
        x.beginPath();x.moveTo(x0,y0);x.lineTo(lerp(x0,x1,e),y0);x.stroke();[x0,lerp(x0,x1,e)].forEach(xx=>{x.fillStyle=rgba(GV.goldInk,0.95);x.beginPath();x.arc(xx,y0,9,0,TAU);x.fill();});x.restore();}}},
    // Sweden's morning
    {at:P.morn,place:"x67day",keys:[[P.morn,960,540,1.0],[P.morn+0.1,964,536,1.03]],d:4,draw:(x,tt)=>cw_after(x,tt,P.morn)},
    // an ordinary day: Jun clips an impact note to another change request
    {at:P.idea,place:"topJun",keys:[[P.idea,860,500,1.0],[P.idea+0.1,864,496,1.03]],d:3,draw:(x,tt)=>{const sl=easeCam(fin(tt,P.clip,0.8));
      cw_at(x,[110,90,0.84],q=>cw_request(q,{blank:1,newBox:1,other:["Add the date each award was given","Mei Tanaka"]}));
      x.save();x.translate(700*(1-sl),-40*(1-sl));cw_at(x,CW_IN4,q=>cw_impact(q,{bars:1,no:1,clip:sl>0.96}));x.restore();}},
    // one question: the register, every line with its owner; and the table Planning's dashboard uses, a clock above it, and no owner
    // (the papers go as the end card's veil comes, so its words never sit on theirs)
    {at:P.late,place:"boardWide",keys:[[P.late,960,470,1.0],[P.late+0.1,962,468,1.03]],d:3,draw:(x,tt)=>{const a=fin(tt,P.near,0.6);withA(x,1-fin(tt,P.end,0.7),()=>{
      cw_who(x,...PG6,[1,1,1,1,1,1],{foot:1,rows:CW_WHO6,inks:CW_INK6});gv_pin(x,PG6[0]+PG6[2]/2,PG6[1]+16,GV.red,1.6);
      if(a>0.01)withA(x,a,()=>cw_boardClock(x,300,190,70,4,50));cw_nearCard(x,90,330,a,{owner:fin(tt,P.owner,1.0)});});}}]);
  gv_end(ctx,S,t,P.end,"Change without surprises","Change control is a step in the change, not a meeting.","Film 7 of 10");
  setScreen(ctx,S);wc_year(ctx,56,72,"Sweden · 3 September 1967",gv_io(t,P.morn+0.3,P.idea,0.4));wc_paperOver(ctx,S);});
