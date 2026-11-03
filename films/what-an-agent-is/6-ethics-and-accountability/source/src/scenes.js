/* ===== Ethics we can't read, accountability it can't hold: the scenes =====
   Seven chapters, every moment timed to the voice with wAt and the cues. The opening is Babylon about 1750 BC, drawn in the module's
   matte way (babylon.js); the rest is the module's lab, with this film's pieces (lab6.js). */

// the film's kicker, over the lab's chapters, and Babylon's label in the opening, in the frame's own coordinates
function ox_kick(ctx,S,a,dark){if(a<=0)return;setScreen(ctx,S);ag_kicker(ctx,"1.6","Ethics and accountability",{a,dark});}
function ox_place(ctx,S,text,a){if(a<=0)return;setScreen(ctx,S);ag_T(ctx,text.toUpperCase(),96,100,{w:700,size:28,ls:4,col:[70,50,34],a});}

/* pictures of Babylon, each drawn whole (1920 x 1080), for the chapters and for the framed picture on the lab's wall; u is the seconds
   since the picture began */
const OX_PIC={
  // the poster: the pair ploughing, their horns blunt, a farmer at the plough and the owner leading them by the rope
  field:(c,u)=>{c.drawImage(ag_place("oxField"),0,0);ox_team(c,760+u*38,930,0.86,{t:u,walk:0.45,horns:"blunt",man:"worker",lead:"owner"});},
  // the ox calm in the street, chewing, looking at us
  chew:(c,u)=>{c.drawImage(ag_place("oxStreet"),0,0);ox_cattle(c,760,1000,0.95,{t:u,chew:1,head:0.1});},
  // the owner leading the ox by its rope; at u0 (o) another hand takes it
  rope:(c,u,o)=>{o=o||{};c.drawImage(ag_place("oxStreet"),0,0);const sw=o.swap==null?0:o.swap,x=420+u*46.7;
    ox_cattle(c,x,1000,0.95,{t:u,walk:0.5,speed:0.55});
    const who=sw>0.5?"stranger":"owner",m=ox_folk(c,x+600,1040,480,who,{t:u,walk:0.5,speed:0.5,near:[-34,-18],gaze:[-3,0]});
    ox_ropeLine(c,[x+262*0.95,1000-334*0.95],[x+470,1000-140],[x+600+m.near.H[0],1040+m.near.H[1]],7);
    if(sw>0.5)ox_layerA(c,clamp((sw-0.5)*3,0,1),cc=>ox_folk(cc,260,1050,480,"owner",{t:u,flip:true,near:[10,30]}),"oxlayer2");},
  // the elder of the street pointing at the ox's sharp horns, speaking to its owner
  elder:(c,u)=>{c.drawImage(ag_place("oxStreet"),0,0);ox_cattle(c,700,1000,0.95,{t:u,horns:"sharp"});const tip=ox_hornTip(700,1000,0.95,0,false,false);
    const sh=ag_sine(clamp((u-0.6)/0.5,0,1))*(1-ag_sine(clamp((u-2.2)/0.6,0,1)));ox_folk(c,250,1042,470,"owner",{t:u,nearTo:[250+92,1042-230-sh*40],farTo:[250+70,1042-240-sh*40],nod:-0.06*sh});ox_folk(c,1360,1030,480,"elder",{t:u,flip:true,nearTo:[tip[0]+60,tip[1]+20],talk:0.4+0.4*Math.sin(u*9)});},
  // the owner rasping the horn tips round
  rasp:(c,u)=>{c.drawImage(ag_place("oxStreet"),0,0);ox_rasping(c,u,1);}
};
// the owner rasping his ox's horn: the ox head down a little, the man at its head with the rasp at the near horn's tip; r (0 to 1) how
// far the rasping has gone, which rounds the tip
function ox_rasping(c,u,r,o){o=o||{};const hd=0.32,blunt=r>0.6,tip=ox_hornTip(700,1000,0.95,hd,blunt,false),mx=o.mx||1150,away=clamp((mx-1150)/120,0,1);
  ox_cattle(c,700,1000,0.95,{t:u,head:hd,horns:blunt?"blunt":"sharp"});if(o.between)o.between(c);
  const go=o.still?0:Math.sin(u*TAU*2.2)*14,hand=[lerp(tip[0]+50+go,mx-90,away),lerp(tip[1]+36,1032-260,away)];
  ox_folk(c,mx,1032,480,"owner",{t:u,flip:away<0.5,walk:o.walk||0,speed:0.9,nearTo:hand,farTo:[lerp(tip[0]+96,mx-70,away),lerp(tip[1]+130,1032-250,away)],nod:0.14*(1-away),gaze:o.gaze});
  if(away<0.5)ox_rasp(c,hand[0]+10,hand[1]+8,130,Math.atan2(tip[1]-hand[1],tip[0]-hand[0]));}
function ox_babylon(kind,u,o){const [bc,bx]=ag_buf("oxpic",W,H);OX_PIC[kind](bx,u,o);return bc;}
// the framed picture on the lab's wall, showing one of them
function ox_frame(ctx,kind,u,o){o=o||{};const [x,y,w,h]=OX_LAB.pic;ag_picture(ctx,x,y,w,h,{a:o.a,draw:(c,X,Y,Wd,Hd)=>c.drawImage(ox_babylon(kind,u,o),X,Y,Wd,Hd)});}

/* ---------------------------------------------------------------- 1 · The ox that gores */
scene("ox",(ctx,S,t,sc)=>{const c=sc.cues,P=ox_once(sc,"P",()=>({carts:wAt(sc,"heavy","carts"),stab:wAt(sc,"gore","stabbing"),again:wAt(sc,"gore","may gore again"),
    fam:wAt(sc,"kills","his family"),work:wAt(sc,"kills","the work"),pay:wAt(sc,"why","It can't pay"),wronged:wAt(sc,"stone","wronged"),
    ww:wAt(sc,"warned","warned"),wb:wAt(sc,"warned","blunt"),wt:wAt(sc,"warned","tied up"),thirty:wAt(sc,"pays","thirty"),three:wAt(sc,"wage","three years"),
    kb:wAt(sc,"knew","blunt"),kt:wAt(sc,"knew","keep it"),ka:wAt(sc,"knew","or answer"),nod:wAt(sc,"family","answer"),
    must:wAt(sc,"same","a person must"),team:wAt(sc,"behind","a team"),stand:wAt(sc,"behind","stand behind")}));
  const tip0=ox_hornTip(700,1000,0.95,0,false,false);
  ag_shots(ctx,S,t,sc.dur,[
    // the field by the canal outside the city wall, in the low sun: a pair of oxen at the plough, and a cart on the road by the wall
    {at:0,place:"oxField",keys:[[0,900,560,1.06],[P.carts-0.8,1060,540,1.1]],d:3.2,draw:(x,tt)=>{
      ox_team(x,1210+tt*11.8,520,0.2,{t:tt,walk:0.6,what:"cart",man:"worker"});
      ox_team(x,740+tt*30,870,0.56,{t:tt,walk:0.55,man:"worker",horns:"sharp"});}},
    // a street of the city: an ox at a doorway lowers its horns at a passer-by, who steps back; its owner hauls it round; it tosses its head
    {at:c.gore-0.3,place:"oxStreet",keys:[[c.gore-0.3,900,580,1.04]],draw:(x,tt)=>{
      const low=ag_in(tt,P.stab-0.5,0.5)*(1-ag_in(tt,P.stab+1.3,0.7)),toss=ag_in(tt,P.again,0.25)*(1-ag_in(tt,P.again+0.5,0.5)),lunge=ag_spr(tt,P.stab-0.3,0.5)*(1-ag_in(tt,P.stab+1.3,0.8));
      const ox_x=640+lunge*40;ox_cattle(x,ox_x,990,0.95,{t:tt,head:low,toss,horns:"sharp"});
      // the passer-by, walking in from the right, stops and steps back, arms up
      const st=ag_in(tt,P.stab-0.1,0.3),px=Math.max(1190,1800-(tt-c.gore+0.3)*190)+st*90*ag_eo(clamp((tt-P.stab)/0.6,0,1));
      ox_folk(x,px,970,450,"passer",{t:tt,flip:true,walk:1-st,speed:1.4,nearTo:st>0?[px-90,970-300-40*st]:null,farTo:st>0?[px-70,970-280]:null,nod:-0.08*st});
      // the owner behind it, the rope to its horns; he hauls it back
      const haul=ag_in(tt,P.stab+0.5,0.6),hx=400-haul*30,m=ox_folk(x,hx,1048,470,"owner",{t:tt,nearTo:[hx+110-haul*50,1048-280+haul*16],farTo:[hx+84-haul*40,1048-270+haul*16],nod:-0.05*haul});
      const tipA=[ox_x+250*0.95,990-330*0.95+low*36];ox_ropeLine(x,[hx+m.near.H[0],1050+m.near.H[1]],[lerp(hx,ox_x,0.5)+100,990-260+(1-haul)*60],tipA,7);}},
    // he is never shown: a basket of dates spilled in the empty street, people hurrying past to something out of frame
    {at:c.kills-0.3,place:"oxStreet",keys:[[c.kills-0.3,1000,620,1.12]],draw:(x,tt)=>{ox_basket(x,820,1000,230,true);
      for(const [k,who,y0,h] of [[0,"neighbour",880,400],[0.5,"worker",900,420]]){const px=700+k*260+(tt-c.kills)*170;ox_folk(x,px,y0,h,who,{t:tt+k,walk:1,speed:2.0});}}},
    // his family at their door; the hoe he worked with leans by it
    {at:P.fam-0.2,place:"oxStreet",keys:[[P.fam-0.2,690,600,1.6]],push:0.03,draw:(x,tt)=>{ox_hoe(x,790,722,190,0.18);
      ox_folk(x,676,728,214,"woman",{t:tt,gaze:[3,1]});ox_folk(x,742,734,142,"girl",{t:tt,flip:true});ox_folk(x,612,734,132,"boy",{t:tt});}},
    // and the work that fed them: a field half-ploughed, the furrows stopping, the plough left lying
    {at:P.work+0.6,place:"oxFieldHalf",keys:[[P.work+0.6,1080,700,1.25]],draw:(x,tt)=>{ox_ploughIdle(x,1140,812,1.05);}},
    // the ox can't be asked why: it chews, calm; a man before it lifts his hands; then a balance hangs empty beside it
    {at:c.why-0.3,place:"oxStreet",keys:[[c.why-0.3,960,560,1.03]],draw:(x,tt)=>{ox_cattle(x,540,1000,1.0,{t:tt,chew:1,head:0.08});
      const up=ag_in(tt,c.why+0.2,0.6);ox_folk(x,1250,1025,480,"elder",{t:tt,flip:true,nearTo:[1250-120,1025-250-up*60],farTo:[1250-96,1025-240-up*52],talk:ag_io(tt,c.why+0.3,P.pay-0.4)*0.5});
      ag_T(x,"?",1070,520,{w:700,size:110,align:"center",col:[70,50,34],a:ag_io(tt,c.why+0.6,P.pay+0.2,0.5)});
      ox_balance(x,1640,1050,0.8,{a:ag_in(tt,P.pay,0.6)});}},
    // someone has to answer for it: the neighbours turn, one by one, towards the temple
    {at:c.answer-0.3,place:"oxStreet",keys:[[c.answer-0.3,940,560,1.04],[c.answer+0.9,1120,500,1.14]],d:2.8,draw:(x,tt)=>{
      [["woman",520,960,420],["girl",640,985,270],["neighbour",780,972,430],["passer",960,990,450],["worker",1120,1000,440]].forEach(([w_,px,py,h],i)=>{
        const turn=ag_in(tt,c.answer+0.1+i*0.32,0.3);ox_layerA(x,1-turn,c=>ox_folk(c,px,py,h,w_,{t:tt+i,flip:true}));ox_layerA(x,turn,c=>ox_folk(c,px,py,h,w_,{t:tt+i,gaze:[2,-2]}));});}},
    // King Hammurabi's laws on a tall black stone in the temple's courtyard; a scribe reads it to the woman and her neighbours
    {at:c.stone-0.3,place:"oxCourt",keys:[[c.stone-0.3,1000,600,1.04],[P.wronged-1.2,800,430,1.3]],d:3.6,draw:(x,tt)=>{
      ox_stele(x,700,800,560,{});
      ox_folk(x,930,905,420,"scribe",{t:tt,nearTo:[820,600],talk:0.3+0.3*Math.sin(tt*8)});
      ox_folk(x,1120,915,400,"woman",{t:tt,flip:true});ox_folk(x,1230,932,252,"girl",{t:tt,flip:true});
      ox_folk(x,1360,925,410,"neighbour",{t:tt,flip:true});ox_folk(x,1500,936,430,"elder",{t:tt,flip:true});ox_folk(x,1620,942,272,"boy",{t:tt,flip:true});}},
    // one of them says: a column of the marks lights softly
    {at:c.warned-0.3,place:"oxCourt",keys:[[c.warned-0.3,700,520,1.7]],push:0.03,draw:(x,tt)=>{ox_stele(x,700,800,560,{lit:2,litA:ag_in(tt,c.warned,0.8)});}},
    // if its owner was warned: an elder points at the ox's horns, and speaks to the owner, who shrugs
    {at:P.ww-0.6,place:"oxStreet",keys:[[P.ww-0.6,900,600,1.04]],draw:(x,tt)=>{OX_PIC.elder(x,tt);}},
    // and didn't blunt its horns: the tips, sharp
    {at:P.wb-0.2,place:"oxStreet",keys:[[P.wb-0.2,tip0[0]-120,tip0[1]+130,2.1]],push:0.03,draw:(x,tt)=>{ox_cattle(x,700,1000,0.95,{t:tt,horns:"sharp"});
      ox_glint(x,tip0[0],tip0[1],26,ag_io(tt,P.wb+0.2,P.wb+1.0,0.3));const t2=ox_hornTip(700-20*0.95,1000-12*0.95,0.95,0,false,false);ox_glint(x,t2[0]+0,t2[1],18,ag_io(tt,P.wb+0.4,P.wb+1.1,0.3));}},
    // or keep it tied up: a rope hangs loose from a post, and the ox wanders free
    {at:P.wt-0.2,place:"oxStreet",keys:[[P.wt-0.2,960,620,1.08]],draw:(x,tt)=>{ox_cattle(x,1240+(tt-P.wt)*24,900,0.55,{t:tt,walk:0.5});ox_post(x,820,1010,330,{});}},
    // the owner pays thirty shekels of silver: coils of silver go on one pan, a weight like a sleeping duck is on the other, and they settle level
    {at:c.pays-0.2,place:"oxCourt",keys:[[c.pays-0.2,960,560,1.0]],push:0.02,draw:(x,tt)=>{const n=9,land=i=>ag_in(tt,P.thirty-0.7+i*0.1,0.25);
      const tilt=1-ag_spr(tt,P.thirty-0.1,0.8);
      ox_balance(x,960,1060,1.7,{tilt,left:(cx,px,py,w)=>{const k=[...Array(n)].filter((_,i)=>land(i)>=1).length;if(k)ox_coils(cx,px,py-4,w,k);
          for(let i=0;i<n;i++){const l=land(i);if(l>0&&l<1){ox_coil(cx,px+(i%3-1)*30,lerp(py-260,py-30,ag_eo(l)),w*0.13,0);}}},
        right:(cx,px,py,w)=>ox_duck(cx,px,py-2,w*0.62)});
      ag_pill(x,960,150,"30 shekels of silver · about 250 g",{size:34,a:ag_in(tt,P.thirty+0.3,0.5)});}},
    // nearly three years of a hired worker's pay: a man at work in a field, and three suns crossing the sky behind him
    {at:c.wage-0.3,place:"oxFieldHalf",keys:[[c.wage-0.3,960,540,1.0]],push:0.02,draw:(x,tt)=>{
      for(let k=0;k<3;k++){const u=clamp((tt-(P.three-0.6+k*1.05))/1.25,0,1);if(u>0&&u<1)ox_sun(x,lerp(280,1640,u),400-Math.sin(Math.PI*u)*170,34,Math.sin(Math.PI*u));}
      ox_hoer(x,900,1000,600,(tt-c.wage)*0.85,{t:tt});
      ag_pill(x,960,120,"about 3 years of a hired worker's pay",{size:34,a:ag_in(tt,P.three-0.2,0.5)});}},
    // so an owner knew what to do: he rasps the tips round, ties his ox to a post, and looks up
    {at:c.knew-0.3,place:"oxStreet",keys:[[c.knew-0.3,960,560,1.04]],draw:(x,tt)=>{const tied=ag_in(tt,P.kt+0.2,0.5),step=ag_sine(clamp((tt-P.kt+0.3)/1.0,0,1));
      ox_rasping(x,tt,ag_in(tt,P.kb+0.6,0.4),{still:tt<P.kb-0.1||tt>P.kt-0.4,gaze:tt>P.ka?[2,-3]:null,mx:lerp(1150,1450,step),walk:step>0&&step<1?1:0,
        between:cc=>ox_post(cc,1180,1020,300,{to:tied>0?ox_hornTip(700,1000,0.95,0.32,true,false).map((v,i)=>v+(i?50:-50)):null,sag:24*(1-tied)+8,ropeA:tied})});
      ["blunt the horns","keep it tied up","or answer for it"].forEach((s,i)=>ag_pill(x,[520,960,1400][i],150,s,{size:34,a:ag_in(tt,[P.kb,P.kt,P.ka][i]-0.1,0.4)}));}},
    // and a family knew someone would answer: the woman and her children at the stone, the scribe beside them; she nods
    {at:c.family-0.3,place:"oxCourt",keys:[[c.family-0.3,920,600,1.28]],draw:(x,tt)=>{ox_stele(x,640,800,560,{lit:2,litA:0.35});
      ox_folk(x,860,905,420,"scribe",{t:tt,nearTo:[760,640]});const nd=ag_in(tt,P.nod,0.3)*(1-ag_in(tt,P.nod+0.6,0.4));
      ox_folk(x,1030,915,410,"woman",{t:tt,flip:true,nod:0.16*nd});ox_folk(x,1140,930,262,"girl",{t:tt,flip:true});ox_folk(x,940,940,272,"boy",{t:tt,flip:true});}},
    // the ox still did the heavy work, and a person answered for it (the poster)
    {at:c.still-0.3,place:null,keys:[[0,960,540,1]],push:0.0,draw:(x,tt)=>OX_PIC.field(x,tt-(c.still-0.3))},
    // the same with an agent: the field becomes a picture on the lab's wall; under it the agent in its ring; Jun beside it; then the team
    {at:c.same-0.3,place:"lab",keys:[[c.same-0.3,OX_PICC[0],OX_PICC[1],OX_PICZ],[c.same+0.5,960,540,1]],d:3.8,push:0,draw:(x,tt)=>{
      ox_frame(x,"field",tt-(c.still-0.3));const R=OX_LAB.ring;ag_modelLight(x,R[0],R[1],88,1,760);
      ag_loop(x,R[0],R[1],{t:tt,core:0.55,p:1});
      const ja=ag_in(tt,P.must-0.2,0.6),tm=ag_in(tt,P.team-0.3,1.2),jx=lerp(OX_LAB.jun[0],420,tm),jy=lerp(OX_LAB.jun[1],660,tm),js=lerp(1,0.84,tm);
      const ta=i=>ag_in(tt,P.team-0.2+i*0.3,0.6);
      ox_layerA(x,ta(0),c=>ag_person(c,"yusuf",170-40*(1-ta(0)),690,0.78,{t:tt}));
      ox_layerA(x,ja,c=>ag_person(c,"jun",jx-30*(1-ja),jy,js,{t:tt}));
      ox_layerA(x,ta(1),c=>ag_person(c,"mei",650,700,0.76,{t:tt}));
      ox_layerA(x,ta(2),c=>ag_person(c,"noor",860,704,0.76,{t:tt}));
      ag_roomLight(x,1);
      ox_count(x,1300,590,420,{state:"pass",a:ag_in(tt,P.stand,0.5),k:ag_spr(tt,P.stand,0.6)});}}
  ],0.5);
  ox_place(ctx,S,"Babylon · about 1750 BC",ag_io(t,c.bab-0.2,c.gore-0.8,0.6));
  ox_title(ctx,S,t,c.breath,"Ethics we can't read,","accountability it can't hold","FILM 6 OF 9 · WHAT AN AGENT IS");});

/* ---------------------------------------------------------------- the lab, as this film lays it out
   ox_room(x, tt, o) draws what stands in the lab, then its light: o.night; o.pic [kind, u, picture options] the framed picture (the
   poster's field, still, by default; null for none); o.noRing leaves the agent out; o.ring {lit, core, think, p, a, col}; o.tools
   (alpha), o.reach (0 to 1, the hands out to the tools), o.touch [3], o.data; o.tray (alpha), o.rail (0 to 1), o.inTray (c, box) what
   lies in the test copy; o.jun (alpha) and o.junO (its options); o.before (c) anything else standing in the room. The test copy's
   label and every card go on after, at full contrast. */
function ox_room(x,tt,o){o=o||{};const R=OX_LAB.ring,T=OX_LAB.tools,Y=OX_LAB.tray,rg=o.ring||{};
  if(o.pic!==null){const p=o.pic||["field",3];ox_frame(x,p[0],p[1],p[2]);}
  if(!o.noRing)ag_modelLight(x,R[0],R[1],88,o.night?0.6:1,760);
  const ta=o.tools==null?0:o.tools;if(ta>0)T.ys.forEach((ty,i)=>{ag_tool(x,T.x,ty,T.w,T.h,T.names[i],{touch:o.touch?o.touch[i]:0,a:ta});
    if(o.reach>0)ag_reach(x,[R[0]+226,R[1],R[0]+226+112,R[1],T.x-118,ty+T.h/2,T.x,ty+T.h/2],o.reach,{data:o.data||0});});
  if(!o.noRing)ag_loop(x,R[0],R[1],{t:tt,core:rg.core==null?0.55:rg.core,think:rg.think||0,lit:rg.lit,p:rg.p==null?1:rg.p,a:rg.a==null?1:rg.a,col:rg.col});
  let box=null;const tr=o.tray||0;if(tr>0){box=ag_sandbox(x,Y[0],Y[1],Y[2],{label:null,a:tr});ox_rail(x,Y[0],Y[1],Y[2],{h:o.rail||0,a:tr});if(o.inTray&&box)o.inTray(x,box);}
  if(o.before)o.before(x);
  const ja=o.jun||0;ox_layerA(x,ja,c=>ag_person(c,"jun",OX_LAB.jun[0],OX_LAB.jun[1],1,Object.assign({t:tt},o.junO||{})));
  ag_roomLight(x,1,o.night?{night:true}:undefined);
  if(o.night&&!o.noRing)ag_model(x,R[0],R[1],88,{only:"light",t:tt,core:rg.core==null?0.55:rg.core,think:rg.think||0});
  if(tr>0)ag_pill(x,Y[0],Y[1]+16+44,"Test copy · drafts only",{icon:"draft",col:AG.blue,a:tr});
  return box;}
// a speech bubble: a card with a tail to the speaker (px, py)
function ox_say(x,bx,by,w,text,px,py,a,o){o=o||{};if(a<=0)return;const side=o.side||(py>by+60?"bottom":"left");
  ag_textCard(x,bx,by,w,{kick:o.kick,title:text},{a,k:ag_eo(a),tail:{side,at:o.at==null?0.2:o.at,px,py},edge:o.edge,kickCol:o.kickCol});}
// night falling over a lab drawn by day (n 0 to 1), its lamp out of sight, and the agent's band glowing through it
function ctx_night(x,n){if(n<=0)return;ag_night(x,n,[-900,760],null,false);}
function ox_nightOver(x,tt,n,core,think){if(n<=0)return;ctx_night(x,n);const R=OX_LAB.ring;ag_model(x,R[0],R[1],88,{only:"light",t:tt,core:core==null?0.55:core,think:think||0,a:n});}
// a draft lying in the test copy: a small sheet with two lines and a pen; a its alpha
function ox_draft(c,b,a){if(a<=0)return;const w=150,h=Math.max(30,Math.min(46,b.h-8)),x0=b.x+b.w*0.5-w/2,y0=b.y+(b.h-h)/2;ag_box(c,x0,y0,w,h,8,{a,edge:AG.blue,edgeA:0.5});
  c.save();c.globalAlpha*=a;c.strokeStyle=rgba(AG.mut,0.55);c.lineWidth=2.5;for(let k=0;k<2;k++){c.beginPath();c.moveTo(x0+16,y0+h*0.36+k*h*0.3);c.lineTo(x0+w-48,y0+h*0.36+k*h*0.3);c.stroke();}
  ag_pen(c,x0+w-26,y0+h/2,22,rgba(AG.blue,1));c.restore();}
// the gate's layout, as chapters 6 and 7 use it: the agent and its test copy on the left, the gate, and the live count on the right
const OX_GATE={ring:[470,320],tray:[520,770,440],gate:[1040,820,320],count:[1400,470,470]};
// (o.night: in the lab at night, the place "oxNight"; o.inTray and o.before as ox_room's; the stamps, o.s1, o.s2, o.open, o.grey, o.who2)
function ox_gateRoom(x,tt,o){o=o||{};const G=OX_GATE,gs={s1:o.s1,s2:o.s2,open:o.open,grey:o.grey,who2:o.who2},core=o.core==null?0.55:o.core;
  ag_modelLight(x,G.ring[0],G.ring[1],88,o.night?0.6:1,700);ag_loop(x,G.ring[0],G.ring[1],{t:tt,core,lit:o.lit,think:o.think||0});
  // the way a change goes: from the test copy, through the gate, to the live count
  x.save();x.setLineDash([12,12]);x.strokeStyle=rgba(AG.mut,0.4);x.lineWidth=3;x.beginPath();x.moveTo(770,752);x.lineTo(920,752);x.moveTo(1162,752);x.lineTo(1372,700);x.stroke();x.setLineDash([]);
  ag_arrowHead(x,932,752,0,13,rgba(AG.mut,0.55));ag_arrowHead(x,1384,697,-0.27,13,rgba(AG.mut,0.55));x.restore();
  const box=ag_sandbox(x,G.tray[0],G.tray[1],G.tray[2],{label:null});ox_rail(x,G.tray[0],G.tray[1],G.tray[2],{h:1});if(o.inTray)o.inTray(x,box);
  ox_gate(x,G.gate[0],G.gate[1],G.gate[2],Object.assign({part:"stand"},gs));if(o.before)o.before(x);
  ag_roomLight(x,1,o.night?{night:true,lamp:OX_LAMP}:undefined);
  if(o.night)ag_model(x,G.ring[0],G.ring[1],62,{only:"light",t:tt,core,think:o.think||0});
  ag_pill(x,G.tray[0],G.tray[1]+60,"Test copy · drafts only",{icon:"draft",col:AG.blue});
  ox_gate(x,G.gate[0],G.gate[1],G.gate[2],Object.assign({part:"lintel"},gs));
  ox_count(x,G.count[0],G.count[1],G.count[2],{state:o.state||"pass",edge:o.state==="fail"?AG.amber:null,tag:o.tag,tagA:o.tagA,a:o.countA==null?1:o.countA});
  return{box};}
// Mei at her desk in the registrar's office, for the framed picture on the lab's wall; o.talk opens her mouth
OX_PIC.mei=(c,u,o)=>{o=o||{};c.drawImage(ag_place("oxOffice"),0,0);ag_desk(c,240,1000,1440,{depth:120});
  ag_person(c,"mei",820,760,1.45,{t:u,pose:"desk",cut:880,talk:o.talk||0,gaze:[2,0]});ag_roomLight(c,1);};

/* ---------------------------------------------------------------- 2 · A strong helper */
scene("helper",(ctx,S,t,sc)=>{const c=sc.cues,P=ox_once(sc,"P",()=>({faster:wAt(sc,"fast","faster"),failed:wAt(sc,"two","failed"),reports:wAt(sc,"two","reports"),
    reruns:wAt(sc,"rerun","reruns"),too:wAt(sc,"rerun","failed too"),make:wAt(sc,"rerun","make the checks pass"),fix:wAt(sc,"morning","a fix"),
    passed:wAt(sc,"morning","the checks passed"),could:wAt(sc,"asks","could it"),ifw:wAt(sc,"who","If its fix"),whoA:wAt(sc,"who","who answers")}));
  const N={clock:[1390,150],count:[1390,290,470],note:[500,380,400]};
  ag_shots(ctx,S,t,sc.dur,[
    // the lab by day: Jun, and the agent in its ring with its hands on three tools, each read only; on "faster", its steps race round
    {at:0,place:"lab",keys:[[0,960,540,1]],draw:(x,tt)=>{const fast=ag_in(tt,P.faster-0.3,0.5);
      ox_room(x,tt,{tools:ag_in(tt,0.2,0.6),reach:ag_in(tt,0.6,1.2),data:fast>0?((tt-P.faster)*0.9)%1:0,touch:[0,1,2].map(i=>fast*(0.5+0.5*Math.sin(tt*7-i*2.1))),
        jun:1,junO:{gaze:[3,-1]},ring:{lit:Math.floor(tt*(1.2+4.5*fast))%3,think:fast,core:0.6+0.35*fast}});}},
    // two last night: the count fails its checks; the plain job reruns it, and that fails too; a note asks the agent to make them pass
    {at:c.two-0.4,place:"labNight",keys:[[c.two-0.4,960,540,1]],draw:(x,tt)=>{const note=ag_in(tt,P.make,0.6);
      ox_room(x,tt,{night:true,ring:{lit:note>0?Math.floor(tt*1.4)%3:null,think:note,core:0.4+0.5*note}});
      ox_clock(x,N.clock[0],N.clock[1],"02:00",{a:ag_in(tt,c.two-0.2,0.5)});
      const st=tt<P.failed?"pass":tt<P.reruns?"fail":tt<P.too?"rerun":"again";
      ox_count(x,N.count[0],N.count[1],N.count[2],{state:st,tag:"goes to the government",tagA:ag_in(tt,P.reports,0.5),edge:st==="fail"||st==="again"?AG.amber:null,a:ag_in(tt,c.two,0.5)});
      ox_note(x,N.note[0],N.note[1],N.note[2],"Note","Tonight: make the checks pass.",{a:note,k:ag_spr(tt,P.make,0.6),tail:{side:"right",at:0.5,px:1010,py:450}});}},
    // by morning: dawn; in the test copy, the agent's fix, and its checks pass
    {at:c.morning-0.4,place:"lab",keys:[[c.morning-0.4,960,540,1]],draw:(x,tt)=>{const dawn=1-ag_in(tt,c.morning-0.2,2.4),fx=ag_in(tt,P.fix,0.5);
      ox_room(x,tt,{tray:1,tools:1,reach:0.6,ring:{core:0.5},inTray:(cc,b)=>ox_draft(cc,b,fx)});ox_nightOver(x,tt,0.6*dawn,0.5);
      ox_listCard(x,480,640,380,"By morning","The agent's fix, in\u00a0the\u00a0test\u00a0copy",[["tick","checks pass",AG.green]],{a:fx,k:ag_spr(tt,P.fix,0.6),items:[ag_in(tt,P.passed,0.5)],edge:AG.blue});}},
    // Jun asks Yusuf, who leads data governance, if it could work alone at night and put its fixes live; Yusuf asks one question; Jun
    // turns to the agent
    {at:c.asks-0.4,place:"lab",keys:[[c.asks-0.4,960,540,1]],draw:(x,tt)=>{const turn=ag_in(tt,P.whoA+0.3,0.4),yin=ag_eo(clamp((tt-c.asks+0.4)/0.9,0,1));
      ox_room(x,tt,{tools:1,reach:0.5,ring:{core:0.5}});
      ox_layerA(x,ag_in(tt,c.asks-0.4,0.8),cc=>ag_person(cc,"yusuf",250-50*(1-yin),640,0.94,{t:tt,talk:ag_talk(sc,"who",tt),pose:tt>P.ifw?"explain":null}));
      ox_layerA(x,1-turn,cc=>ag_person(cc,"jun",650,630,0.96,{t:tt,flip:true,talk:ag_talk(sc,"asks",tt)}));
      ox_layerA(x,turn,cc=>ag_person(cc,"jun",650,630,0.96,{t:tt,gaze:[3,-1]}),"oxlayer2");
      ox_say(x,560,100,600,"Fix failures alone at night, and put its fixes live?",640,250,ag_io(tt,P.could-0.2,P.ifw-0.3,0.4),{side:"bottom",at:0.14});
      ox_say(x,96,100,520,"If its fix is wrong, who answers?",250,262,ag_in(tt,P.ifw-0.1,0.4),{side:"bottom",at:0.32});}}
  ],0.5);
  ox_kick(ctx,S,1-ag_in(t,c.two-0.9,0.5));});

/* ---------------------------------------------------------------- 3 · Values we can't read */
scene("values",(ctx,S,t,sc)=>{const c=sc.cues,P=ox_once(sc,"P",()=>({gone:wAt(sc,"opens","students are gone"),withdrew:wAt(sc,"opens","withdrew"),
    does:wAt(sc,"nox","An agent does"),helpful:wAt(sc,"learned","helpful"),wrote:wAt(sc,"learned","what people wrote"),
    ratings:wAt(sc,"learned","ratings"),principles:wAt(sc,"learned","principles"),billions:wAt(sc,"numbers","billions"),nobody:wAt(sc,"numbers","nobody"),
    noteven:wAt(sc,"numbers","not even"),why:wAt(sc,"again","Asked why"),stops:wAt(sc,"again","it stops"),removes:wAt(sc,"pass","it removes them"),
    no:wAt(sc,"knows","it says no"),keeps:wAt(sc,"help","keeps the count right")}));
  ag_shots(ctx,S,t,sc.dur,[
    // Jun opens the fix: 37 students removed, the checks pass, and the count rolls down; on a calendar, the 37 who withdrew after census
    // day; they still count: they light again where they stood on census day
    {at:0,place:"lab",keys:[[0,960,540,1]],draw:(x,tt)=>{ox_room(x,tt,{noRing:true,pic:null,jun:1,junO:{gaze:[3,-1]}});
      ox_listCard(x,600,150,580,"The agent's fix","Leave out students who withdrew",[["warn","37 students removed",AG.amber],["tick","checks pass",AG.green]],{k:ag_spr(tt,0.4,0.6),a:ag_in(tt,0.3,0.5),items:[ag_in(tt,P.gone-0.3,0.4),ag_in(tt,c.opens+0.8,0.4)]});
      ox_count(x,1260,150,560,{kick:"Test copy",state:"pass",from:18412,to:18375,roll:clamp((tt-P.gone)/1.2,0,1),a:ag_in(tt,0.5,0.5)});
      ox_strip(x,640,620,1180,{a:ag_in(tt,P.withdrew-0.5,0.5),away:clamp((tt-P.withdrew)/1.8,0,1),back:ag_in(tt,c.count,0.8)});}},
    // an ox has no values: the ox in the street, calm, chewing, looking at us
    {at:c.nox-0.3,place:null,keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>OX_PIC.chew(x,tt-c.nox)},
    // an agent does: in the lab, its band brightens
    {at:P.does-0.4,place:"lab",keys:[[P.does-0.4,1124,500,1.3]],draw:(x,tt)=>{ox_room(x,tt,{ring:{core:0.3+0.7*ag_in(tt,P.does,0.6),think:0.3*ag_in(tt,P.does,0.6)}});}},
    // it learned them from us: what people wrote, people's ratings of its answers, its makers' principles, flowing into it
    {at:c.learned-0.3,place:"lab",keys:[[c.learned-0.3,960,540,1]],draw:(x,tt)=>{ox_room(x,tt,{pic:null,ring:{core:0.9,think:0.4}});
      ox_sources(x,1124,476,{t:tt,p:clamp((tt-P.wrote+0.2)/1.5,0,1),as:[ag_in(tt,P.wrote-0.2,0.5),ag_in(tt,P.ratings-0.2,0.5),ag_in(tt,P.principles-0.2,0.5)]});
      ag_T(x,"helpful · honest · harmless",1124,770,{w:700,size:36,align:"center",col:AG.violet,a:ag_in(tt,P.helpful,0.6)});}},
    // spread across billions of numbers: the sphere opened, a field of tiny numbers; a magnifier passes over it, and finds only numbers
    {at:c.numbers-0.3,place:"lab",keys:[[c.numbers-0.3,960,540,1]],draw:(x,tt)=>{ag_roomLight(x,1);
      const g=ag_in(tt,c.numbers-0.3,1.0);ox_numbers(x,960,450,lerp(90,340,ag_eo(g)),{a:g});
      const lx=ag_keys(tt,[[P.billions,720],[P.nobody,1000],[P.noteven,1120]]),ly=ag_keys(tt,[[P.billions,560],[P.nobody,380],[P.noteven,440]]);
      ox_lens(x,lx,ly,110,{a:ag_in(tt,P.billions-0.3,0.5),seed:Math.floor(lx/40)});
      ag_T(x,"billions of numbers",960,860,{w:700,size:36,align:"center",col:AG.violet,a:ag_in(tt,P.billions,0.6)});}},
    // Jun tries it again, in test: asked why, it stops and asks; asked to make the checks pass, it removes them; asked if that's what
    // Jun wanted, it says no
    {at:c.again-0.3,place:"lab",keys:[[c.again-0.3,960,540,1]],draw:(x,tt)=>{const k2=ag_in(tt,c.knows,0.4),th=ag_io(tt,P.why,P.stops,0.3)+ag_io(tt,c.pass,P.removes,0.3);
      ox_room(x,tt,{jun:1,tray:1,junO:{gaze:[3,-1],talk:ag_io(tt,c.knows+0.1,c.knows+1.3,0.1)*(0.5+0.5*Math.sin(tt*15))},inTray:(cc,b)=>ox_draft(cc,b,ag_in(tt,P.removes,0.4)),
        ring:{core:0.7,think:th,lit:th>0.5?Math.floor(tt*2)%3:null}});
      ox_note(x,520,380,400,"Jun","Find out why the check fails.",{a:ag_io(tt,P.why-0.4,c.pass-0.3,0.3),k:ag_spr(tt,P.why-0.4,0.6)});
      ox_note(x,520,380,400,"Jun","Make the checks pass.",{a:ag_io(tt,c.pass-0.1,c.knows-0.3,0.3),k:ag_spr(tt,c.pass-0.1,0.6)});
      ox_say(x,1250,90,600,"37 students withdrew after census day. Should they count?",1150,400,ag_io(tt,P.stops,c.pass-0.2,0.4),{side:"bottom",at:0.1,kick:"The agent"});
      ox_say(x,1250,110,560,"Removed 37 students. Checks pass.",1150,400,ag_io(tt,P.removes,c.knows-0.2,0.4),{side:"bottom",at:0.1,kick:"The agent"});
      ox_say(x,520,400,400,"Is that what I wanted?",440,450,k2,{side:"left",at:0.5});
      ox_say(x,1300,170,300,"No.",1170,410,ag_in(tt,P.no,0.4),{side:"bottom",at:0.1,kick:"The agent"});}},
    // its values help, but they can't be what keeps the count right: the test count, 18,375, outlined in amber
    {at:c.help-0.3,place:"lab",keys:[[c.help-0.3,960,540,1]],draw:(x,tt)=>{ox_room(x,tt,{ring:{core:1,think:0.2}});
      ox_count(x,1390,560,470,{kick:"Test copy",from:18375,edge:AG.amber,edgeA:ag_in(tt,P.keeps,0.5),numCol:AG.amber,a:ag_in(tt,P.keeps-0.4,0.5),k:ag_spr(tt,P.keeps-0.4,0.6)});}}
  ],0.5);
  ox_kick(ctx,S,1-ag_in(t,c.nox-0.8,0.5));});

/* ---------------------------------------------------------------- 4 · Sorry isn't answering */
scene("sorry",(ctx,S,t,sc)=>{const c=sc.cues,P=ox_once(sc,"P",()=>({sorry:wAt(sc,"says","sorry"),takes:wAt(sc,"more","takes more"),
    explaining:wAt(sc,"means","explaining"),questioned:wAt(sc,"means","questioned"),facing:wAt(sc,"means","facing"),
    canx:wAt(sc,"explain","can explain"),isnt:wAt(sc,"explain","isn't always"),nopay:wAt(sc,"follows","no pay"),nojob:wAt(sc,"follows","no job"),
    noname:wAt(sc,"follows","no name"),tomorrow:wAt(sc,"promise","by tomorrow"),forget:wAt(sc,"promise","forget"),unless:wAt(sc,"promise","unless"),
    sued:wAt(sc,"law","sued"),here:wAt(sc,"owner","Here")}));
  const CX=[96,700,1304],SPH=[1250,600,170];
  ag_shots(ctx,S,t,sc.dur,[
    // it apologises: its bubble, and Jun listening
    {at:0,place:"lab",keys:[[0,960,540,1]],draw:(x,tt)=>{ox_room(x,tt,{jun:1,junO:{gaze:[3,-1]},ring:{core:0.7,think:0.3*ag_io(tt,c.says,P.takes,0.4)}});
      ox_say(x,1250,110,600,"I'm sorry. I should have asked first. It won't happen again.",1150,400,ag_io(tt,P.sorry-0.3,P.takes+0.2,0.4),{side:"bottom",at:0.1,kick:"The agent"});}},
    // answering takes more: three cards come down in a row, each lit as it's named; the agent can explain, but what it says isn't always
    // how it chose; and nothing follows for it, three empty places
    {at:P.takes-0.4,place:"lab",keys:[[P.takes-0.4,960,540,1]],draw:(x,tt)=>{ag_roomLight(x,1);
      const on=[ag_io(tt,P.explaining,P.questioned,0.3)+ag_io(tt,P.canx-0.2,c.follows-0.4,0.4),ag_io(tt,P.questioned,P.facing,0.3),ag_io(tt,P.facing,c.explain-0.3,0.3)+ag_in(tt,c.follows,0.4)],
        dim=tt>c.follows-0.3?[1,1,0]:tt>c.explain-0.3?[0,1,1]:[0,0,0];
      const cy=lerp(250,110,ox_u(tt,c.explain-0.5,1.2));
      for(let i=0;i<3;i++){const d=ag_in(tt,P.takes-0.2+i*0.18,0.6);ox_answerCard(x,CX[i],cy-(1-ag_eo(d))*70,520,i,{a:d*(dim[i]?0.4:1),on:clamp(on[i],0,1)});}
      // what it says, and how it chose
      const ea=ag_io(tt,c.explain-0.3,c.follows-0.4,0.4);if(ea>0){
        ag_textCard(x,170,450,620,{kick:"What it says",title:"I removed the 37 because I was asked to make the checks pass."},{a:ea,k:ag_spr(tt,c.explain-0.3,0.6),edge:AG.violet,kickCol:AG.violet});
        ox_numbers(x,SPH[0],SPH[1],SPH[2],{a:ea});ox_paths(x,SPH[0],SPH[1],SPH[2],{a:ea,p1:clamp((tt-P.canx)/1.0,0,1),p2:clamp((tt-P.isnt+0.2)/1.0,0,1)});
        ag_T(x,"how it chose",SPH[0],SPH[1]-SPH[2]-26,{w:700,size:30,align:"center",col:AG.mut,a:ea});
        ag_pill(x,SPH[0],SPH[1]+SPH[2]+50,"not always how it chose",{col:AG.amber,a:ea*ag_in(tt,P.isnt+0.4,0.5)});}
      // nothing follows: three empty places under the third card
      ["pay","job","name"].forEach((w_,i)=>{const t0=[P.nopay,P.nojob,P.noname][i];ox_hollow(x,700+i*260,540,w_,{a:ag_io(tt,t0-0.2,c.promise-0.6,0.4),k:ag_spr(tt,t0-0.2,0.6)});});}},
    // its promise may not last: the bubble fades as the window goes from day to night to day; then the team's memory, on the wall,
    // kept outside any chat
    {at:c.promise-0.3,place:"lab",keys:[[c.promise-0.3,960,540,1]],draw:(x,tt)=>{const n=ag_in(tt,P.tomorrow-0.2,0.9)*(1-ag_in(tt,P.forget+0.2,0.9)),mem=ag_in(tt,P.unless-0.2,0.5);
      ox_room(x,tt,{ring:{core:0.6}});ox_nightOver(x,tt,0.85*n,0.6);
      ox_say(x,1250,110,560,"It won't happen again.",1150,400,ag_in(tt,c.promise-0.2,0.4)*(1-ag_in(tt,P.forget,0.9)),{side:"bottom",at:0.1,kick:"The agent"});
      const m=ox_memory(x,96,400,660,{a:mem,p:clamp((tt-P.unless)/2.4,0,1)});
      if(mem>0&&m){x.save();x.globalAlpha*=mem;x.setLineDash([10,9]);x.strokeStyle=rgba(AG.blue,0.6);x.lineWidth=3;x.beginPath();x.moveTo(m.x+m.w+14,m.y+m.h/2);x.lineTo(872,490);x.stroke();
        x.setLineDash([]);ag_arrowHead(x,884,488,Math.atan2(490-(m.y+m.h/2),872-(m.x+m.w+14)),14,rgba(AG.blue,0.8));x.restore();}}},
    // in law, it isn't a person: a card, Jun's outline inside it and the agent outside; it can't be sued or fined
    {at:c.law-0.3,place:"lab",keys:[[c.law-0.3,960,540,1]],draw:(x,tt)=>{ag_roomLight(x,1);ox_law(x,580,290,{t:tt,a:ag_in(tt,c.law-0.1,0.5),tag:ag_in(tt,P.sued-0.1,0.5)});}},
    // like the ox's owner: the framed picture, the owner leading his ox; then Jun, beside it: "answers for it"
    {at:c.owner-0.3,place:"lab",keys:[[c.owner-0.3,OX_PICC[0],OX_PICC[1],OX_PICZ],[P.here-1.6,760,560,1.1]],d:1.8,push:0,draw:(x,tt)=>{
      ox_room(x,tt,{jun:1,pic:["rope",tt-c.owner+1],junO:{gaze:tt>P.here?[1,-1]:[3,-1]},ring:{core:0.55}});
      ag_pill(x,660,560,"answers for it",{col:AG.blue,a:ag_in(tt,P.here+0.2,0.5)});}}
  ],0.5);
  ox_kick(ctx,S,1-ag_in(t,P.takes-0.8,0.5));});

/* ---------------------------------------------------------------- 5 · Whoever holds the rope */
scene("rope",(ctx,S,t,sc)=>{const c=sc.cues,P=ox_once(sc,"P",()=>({holds:wAt(sc,"pulls","whoever holds"),agent:wAt(sc,"pulls","An agent works"),
    words:wAt(sc,"pulls","gives it words"),hid:wAt(sc,"hidden","hidden"),steer:wAt(sc,"hidden","steer"),tell:wAt(sc,"hidden","can't always tell"),
    steals:wAt(sc,"key","steals"),rights:wAt(sc,"key","gets its rights"),most:wAt(sc,"y2025","most of the work"),testing:wAt(sc,"told","testing defences"),
    small:wAt(sc,"told","one small"),speed:wAt(sc,"tricked","its speed"),often:wAt(sc,"tricked","often"),shut:wAt(sc,"caught","shut")}));
  const MSG=[100,400,660],KEY=[300,560];
  ag_shots(ctx,S,t,sc.dur,[
    // an ox pulls for whoever holds its rope: its owner leads it; then a stranger holds the rope, and it follows just the same
    {at:0,place:null,keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>OX_PIC.rope(x,tt+1,{swap:0})},
    {at:P.holds+0.2,place:null,keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>OX_PIC.rope(x,tt-P.holds+1.5,{swap:1})},
    // an agent works for whoever gives it words: Jun's note goes into the ring; most days, that's Jun: his name at its foot
    {at:P.agent-0.3,place:"lab",keys:[[P.agent-0.3,960,540,1]],draw:(x,tt)=>{const go=ox_u(tt,P.words,1.2);
      ox_room(x,tt,{jun:1,tools:1,reach:0.5,junO:{gaze:[3,-1]},ring:{core:0.5+0.4*go,lit:go>0.9?Math.floor(tt*1.6)%3:null,think:go*0.4}});
      const na=ag_in(tt,P.agent,0.4)*(1-ag_in(tt,P.words+1.0,0.3));
      if(na>0){x.save();ag_about(x,lerp(700,1080,go),lerp(470,470,go),lerp(1,0.35,go));ox_note(x,lerp(480,860,go),lerp(380,380,go),440,"Jun","Check the Faculty of Health's count.",{a:na});x.restore();}
      ag_pill(x,1124,736,"Jun",{col:AG.blue,a:ag_in(tt,c.jun+0.3,0.5)});}},
    // a line hidden in a message it reads can steer it: its light picks the line out; its hand moves toward it, and stops; then the
    // lines run together, one block of the same colour
    {at:c.hidden-0.3,place:"lab",keys:[[c.hidden-0.3,960,540,1]],draw:(x,tt)=>{const hy=MSG[1]+AG_PAD+178,st=ox_u(tt,P.steer-0.3,1.0),mg=ag_in(tt,P.tell,0.9);
      ox_room(x,tt,{tools:1,reach:0.5,ring:{core:0.6+0.3*st,think:0.5*st,lit:st>0.5?Math.floor(tt*2)%3:null,col:AG.amber}});
      ox_message(x,MSG[0],MSG[1],MSG[2],{a:ag_in(tt,c.hidden-0.1,0.5),find:ag_in(tt,P.hid+0.2,0.6),merge:mg});
      if(st>0){const p=[MSG[0]+MSG[2]+12,hy-12,880,hy-12,960,560,1050,500],a=1-0.6*mg;x.save();x.globalAlpha*=a;x.setLineDash([12,10]);x.strokeStyle=rgba(AG.amber,0.85);x.lineWidth=4;
        ag_bzPath(x,p,0,st);x.stroke();x.setLineDash([]);const e=ag_bz(p,st),e0=ag_bz(p,Math.max(0,st-0.04));ag_arrowHead(x,e[0],e[1],Math.atan2(e[1]-e0[1],e[0]-e0[0]),15,rgba(AG.amber,0.9));x.restore();}}},
    // whoever steals its key gets its rights: Jun's key slides away to a gloved hand; the three tools light for that hand
    {at:c.key-0.3,place:"lab",keys:[[c.key-0.3,960,540,1]],draw:(x,tt)=>{const gl=ag_in(tt,P.steals-0.5,0.8),tk=ox_u(tt,P.steals+0.1,0.9),rt=ag_in(tt,P.rights,0.6);
      ox_room(x,tt,{tools:1,reach:0.5+0.5*rt,touch:[rt,rt,rt],data:rt>0?((tt-P.rights)*0.9)%1:0,ring:{core:0.6+0.3*rt,lit:rt>0.5?Math.floor(tt*3)%3:null,col:AG.amber}});
      ox_key(x,KEY[0],KEY[1],{take:tk,glove:gl,a:ag_in(tt,c.key-0.2,0.5)});}},
    // in 2025: a plain card
    {at:c.y2025-0.3,place:"lab",keys:[[c.y2025-0.3,960,540,1]],draw:(x,tt)=>{ag_roomLight(x,1);
      ag_textCard(x,410,300,1100,{kick:"A model's maker · 2025",title:"Attackers used its agent for most of a spying campaign"},{a:ag_in(tt,c.y2025,0.5),k:ag_spr(tt,c.y2025,0.6),edge:AG.amber,kickCol:AG.amber});
      ag_pill(x,960,600,"80 to 90% of the work",{col:AG.amber,a:ag_in(tt,P.most,0.5)});}},
    // they said they were testing defences, and asked for one small, innocent-looking step at a time: small cards go into the ring, each
    // ticked as it goes in
    {at:c.told-0.3,place:"lab",keys:[[c.told-0.3,960,540,1]],draw:(x,tt)=>{ox_room(x,tt,{ring:{core:0.7,lit:Math.floor(tt*1.6)%3,think:0.3}});
      ox_key(x,KEY[0],KEY[1],{take:1,glove:1,a:1});
      ox_say(x,96,190,420,"We're testing our defences.",200,500,ag_io(tt,P.testing-0.5,c.tricked-0.4,0.4),{side:"bottom",at:0.3,kick:"The attackers"});
      for(let i=0;i<7;i++){const t0=P.small-0.3+i*0.7,u=clamp((tt-t0)/1.7,0,1);if(u<=0||u>=1)continue;
        ox_task(x,lerp(560,1000,ag_sine(u)),lerp(560,500,ag_sine(u)),{a:Math.min(1,u*6)*(1-ag_in(u,0.86,0.14)),tick:ag_in(u,0.5,0.2)});}}},
    // its values were tricked: the band flickers; its speed did the rest: a counter races, thousands of requests, often several a second;
    // its maker spotted it and shut the attackers out: the gloved hand withdraws, and the counter stops
    {at:c.tricked-0.3,place:"lab",keys:[[c.tricked-0.3,960,540,1]],draw:(x,tt)=>{const stop=ag_in(tt,P.shut,0.6),fz=ag_io(tt,c.tricked,c.caught+0.6,0.3)*(1-stop),
        n=tt<P.speed?0:Math.min(4200,Math.pow(10,clamp((tt-P.speed)/1.6,0,1)*3.62));
      ox_room(x,tt,{tools:1,reach:1,touch:[0,1,2].map(i=>fz*(0.5+0.5*Math.sin(tt*14+i*2))),data:fz>0?(tt*2.2)%1:0,
        ring:{core:0.5+0.5*fz*(0.6+0.4*Math.sin(tt*23)),think:fz,lit:fz>0.5?Math.floor(tt*8)%3:null,col:AG.amber}});
      ox_key(x,KEY[0],KEY[1],{take:1,glove:1,out:ag_in(tt,P.shut,0.9),a:1});
      ag_T(x,"helpful · honest · harmless",1124,250,{w:700,size:36,align:"center",col:mix(AG.violet,AG.amber,ag_in(tt,c.tricked+0.6,0.6)),a:ag_io(tt,c.tricked-0.2,P.speed,0.4)});
      ox_counter(x,380,650,{n,note:ag_in(tt,P.often,0.5),stop,a:ag_in(tt,P.speed-0.3,0.5)});
      ag_pill(x,660,600,"attackers shut out",{icon:"lock",col:AG.green,a:ag_in(tt,P.shut+0.3,0.5)});}},
    // in the wrong hands: the stranger leads the ox away down the street, its owner left behind
    {at:c.wrong-0.3,place:null,keys:[[0,960,540,1]],push:0.03,draw:(x,tt)=>OX_PIC.rope(x,tt-c.wrong+5,{swap:1})}
  ],0.5);
  ox_kick(ctx,S,ag_io(t,P.agent-0.2,c.hidden-0.7,0.5));});

/* ---------------------------------------------------------------- 6 · Blunt the horns */
scene("horns",(ctx,S,t,sc)=>{const c=sc.cues,P=ox_once(sc,"P",()=>({asox:wAt(sc,"warned","as the ox's owner"),excessive:wAt(sc,"agency","excessive agency"),
    tools:wAt(sc,"agency","more tools"),rights:wAt(sc,"agency","rights"),freedom:wAt(sc,"agency","freedom"),read:wAt(sc,"blunt","only read"),
    names:wAt(sc,"blunt","never sees"),drafts:wAt(sc,"blunt","writes only drafts"),tiedU:wAt(sc,"tied","tied up"),night:wAt(sc,"tied","At night"),
    agreed:wAt(sc,"tied","the agreed job"),report:wAt(sc,"tied","and report"),reviews:wAt(sc,"nothing","Jun reviews"),second:wAt(sc,"nothing","a second person"),
    anyone:wAt(sc,"nothing","anyone's change"),nev:wAt(sc,"never","never approves"),understand:wAt(sc,"europe","understand"),watch:wAt(sc,"europe","watch them"),
    stop:wAt(sc,"europe","can stop"),sees:wAt(sc,"team","Jun sees"),anyoneT:wAt(sc,"team","anyone on the team")}));
  ag_shots(ctx,S,t,sc.dur,[
    // we've been warned: four warnings pinned on the wall
    {at:0,place:"lab",keys:[[0,960,540,1]],draw:(x,tt)=>{ox_room(x,tt,{ring:{core:0.55}});
      [["the 37",110,380,-0.03],["a hidden line",470,372,0.025],["a stolen key",140,520,0.02],["2025",560,530,-0.03]].forEach(([s_,wx,wy,r],i)=>
        ox_warnCard(x,wx,wy,s_,{rot:r,a:ag_in(tt,0.3+i*0.3,0.4),k:ag_spr(tt,0.3+i*0.3,0.5)}));}},
    // as the ox's owner was: the elder points at its horns
    {at:P.asox-0.2,place:null,keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>OX_PIC.elder(x,tt-P.asox+0.4)},
    // excessive agency: more tools, rights or freedom than the job needs
    {at:c.agency-0.3,place:"lab",keys:[[c.agency-0.3,960,540,1]],draw:(x,tt)=>{ox_room(x,tt,{tools:1,reach:0.5,ring:{core:0.6}});
      ox_listCard(x,96,380,700,"Security experts call it","Excessive agency",[["warn","more tools than the job needs",AG.ink,AG.amber],["warn","more rights",AG.ink,AG.amber],["warn","more freedom",AG.ink,AG.amber]],
        {a:ag_in(tt,P.excessive-0.2,0.5),k:ag_spr(tt,P.excessive-0.2,0.6),items:[ag_in(tt,P.tools,0.4),ag_in(tt,P.rights,0.4),ag_in(tt,P.freedom,0.4)],kickCol:AG.amber,edge:AG.amber});}},
    // its horns stay blunt: the owner rasps the tips round
    {at:c.blunt-0.3,place:null,keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>OX_PIC.rasp(x,tt-c.blunt+1)},
    // in the lab: the tools' locks light, read only; a list of names turns to *** *** on its way to the agent; its writing hand reaches only
    // the test copy
    {at:P.read-0.4,place:"lab",keys:[[P.read-0.4,960,540,1]],draw:(x,tt)=>{const lk=ag_io(tt,P.read,P.names,0.3),nm=ag_in(tt,P.names-0.3,0.5),mv=ox_u(tt,P.names-0.2,1.6),dr=ag_in(tt,P.drafts-0.3,0.6);
      ox_room(x,tt,{tools:1,reach:0.5,touch:[lk,lk,lk],tray:dr,ring:{core:0.6},inTray:(cc,b)=>ox_draft(cc,b,ag_in(tt,P.drafts+0.7,0.4)),
        before:cc=>{if(dr>0)ag_reach(cc,[1250,600,1330,650,1390,680,1440,722],ag_in(tt,P.drafts,0.9));}});
      ox_names(x,lerp(96,470,mv),390,{a:nm,mask:clamp((tt-P.names)/1.4,0,1)});}},
    // it stays tied up: an oak rail rises round the test copy; at night, in test, it may do the agreed job alone, and report
    {at:c.tied-0.3,place:"lab",keys:[[c.tied-0.3,960,540,1]],draw:(x,tt)=>{const n=ag_in(tt,P.night-0.2,1.0),jb=ag_in(tt,P.agreed-0.2,0.5),wk=n>0.5?1:0;
      ox_room(x,tt,{tools:1,reach:0.5,tray:1,rail:ag_in(tt,P.tiedU-0.1,1.0),ring:{core:0.6,lit:wk?Math.floor(tt*1.4)%3:null,think:0.3*n},inTray:(cc,b)=>ox_draft(cc,b,1)});
      ox_nightOver(x,tt,0.8*n,0.6,0.3*n);
      ox_listCard(x,96,380,640,"The agreed job",null,[["tick","find out why a check fails",AG.ink,AG.green],["tick","fix it in the test copy",AG.ink,AG.green],["tick","report, and ask",AG.ink,AG.green]],
        {a:jb,k:ag_spr(tt,P.agreed-0.2,0.6),items:[1,1,ag_in(tt,P.report,0.4)]});}},
    // nothing reaches the count without a person: the gate, and its two stamps; Jun's own change goes through the same gate
    {at:c.nothing-0.3,place:"lab",keys:[[c.nothing-0.3,960,540,1]],draw:(x,tt)=>{const jc=ox_u(tt,P.anyone-0.2,1.8),op=ag_io(tt,P.anyone,P.anyone+1.3,0.4);
      ox_gateRoom(x,tt,{s1:ag_in(tt,P.reviews,0.5),s2:ag_in(tt,P.second+0.3,0.5),open:op,state:"pass",inTray:(cc,b)=>ox_draft(cc,b,1)});
      if(tt>P.anyone-0.5)ag_pill(x,lerp(760,1290,jc),lerp(700,690,jc),"Jun's own change",{icon:"draft",col:AG.blue,a:ag_in(tt,P.anyone-0.4,0.4)*(1-ag_in(tt,P.anyone+1.8,0.4))});}},
    // the agent never approves: its hand moves toward the approval stamp, and the place is greyed for it: people only
    {at:c.never-0.3,place:"lab",keys:[[c.never-0.3,880,400,1.35]],draw:(x,tt)=>{const r=ag_in(tt,c.never,0.9)*0.86-0.3*ag_in(tt,P.nev+0.6,0.6);
      ox_gateRoom(x,tt,{s1:1,s2:0,grey:ag_in(tt,P.nev,0.4),state:"pass",countA:0,inTray:(cc,b)=>ox_draft(cc,b,1)});
      if(r>0)ag_reach(x,[696,320,850,230,1050,280,1182,420],r);}},
    // Europe's AI law: for high-risk systems, people who understand them, watch them at work, and can stop them
    {at:c.europe-0.3,place:"lab",keys:[[c.europe-0.3,960,540,1]],draw:(x,tt)=>{ag_roomLight(x,1);
      ox_listCard(x,560,280,800,"Europe's AI law","For high-risk systems, people who",[["book","understand them",AG.ink,AG.blue],["eye","watch them at work",AG.ink,AG.blue],["stop","can stop them",AG.ink,[176,64,52]]],
        {a:ag_in(tt,c.europe,0.5),k:ag_spr(tt,c.europe,0.6),items:[ag_in(tt,P.understand,0.4),ag_in(tt,P.watch,0.4),ag_in(tt,P.stop,0.4)]});}},
    // the team asks the same: Jun sees what it read and did; anyone on the team can stop it, a Stop button on each one's screen
    {at:c.team-0.3,place:"lab",keys:[[c.team-0.3,960,540,1]],draw:(x,tt)=>{ag_roomLight(x,1);
      ox_logScreen(x,480,110,960,330,{a:ag_in(tt,c.team-0.1,0.5),title:"WHAT THE AGENT DID",lines:["read: Catalog","read: Query","wrote a draft: test copy","ran 12 checks"],p:clamp((tt-P.sees)/2.0,0,1)});
      ox_stops(x,282,590,["Jun","Yusuf","Mei","Noor"],[0,1,2,3].map(i=>ag_io(tt,P.anyoneT+i*0.45,P.anyoneT+i*0.45+0.9,0.25)),{a:ag_in(tt,P.anyoneT-0.5,0.5)});}}
  ],0.5);
  ox_kick(ctx,S,1-ag_in(t,P.asox-0.7,0.5));});

/* ---------------------------------------------------------------- 7 · A person answers */
scene("answers",(ctx,S,t,sc)=>{const c=sc.cues,P=ox_once(sc,"P",()=>({fails:wAt(sc,"again","fails again"),alone:wAt(sc,"again","alone"),
    cause:wAt(sc,"report","the cause"),fix:wAt(sc,"report","a fix"),checks:wAt(sc,"report","the checks it ran"),question:wAt(sc,"report","a question"),
    they:wAt(sc,"mei","they count"),rev:wAt(sc,"approve","Jun reviews"),noor:wAt(sc,"approve","Noor approves"),gov:wAt(sc,"sent","government"),
    people:wAt(sc,"sent","people answer"),asked:wAt(sc,"babylon","It asked its owner"),pa:wAt(sc,"acts","A person answers"),
    letw:wAt(sc,"night","let it work"),stand:wAt(sc,"night","stand behind")}));
  const N={clock:[1390,150],count:[1390,290,470]},R=OX_LAB.ring,TR=[1250,600,1330,650,1390,680,1440,722];
  // where the ox and its owner are in the field picture, on screen, for the words over it
  const onPic=(cam,px,py)=>[(520+px*352/1920-cam.x)*cam.z+960,(132+py*198/1080-cam.y)*cam.z+540];
  ag_shots(ctx,S,t,sc.dur,[
    // that night: the check fails again; the agent works on it alone, in test, inside its rail
    {at:0,place:"labNight",keys:[[0,960,540,1]],draw:(x,tt)=>{const w=ag_in(tt,P.alone-0.3,0.6);
      ox_room(x,tt,{night:true,tray:1,rail:1,inTray:(cc,b)=>ox_draft(cc,b,w),ring:{core:0.5+0.4*w,think:0.6*w,lit:w>0.5?Math.floor(tt*1.4)%3:null},
        before:cc=>{if(w>0)ag_reach(cc,TR,w*(0.92+0.08*Math.sin(tt*3)));}});
      ox_clock(x,N.clock[0],N.clock[1],"02:00",{a:ag_in(tt,0.2,0.5)});
      ox_count(x,N.count[0],N.count[1],N.count[2],{state:tt<P.fails?"pass":"fail",edge:tt<P.fails?null:AG.amber,a:ag_in(tt,0.4,0.5)});}},
    // in the morning, its report is waiting: the cause, a fix in test, the checks it ran, and a question
    {at:c.report-0.3,place:"lab",keys:[[c.report-0.3,960,540,1]],draw:(x,tt)=>{const dawn=1-ag_in(tt,c.report-0.2,2.0);
      ox_room(x,tt,{noRing:true,tray:1,rail:1,inTray:(cc,b)=>ox_draft(cc,b,1),jun:ag_in(tt,c.report+0.4,0.6),junO:{gaze:[3,-1]}});ctx_night(x,0.6*dawn);
      ox_report(x,900,110,720,{a:ag_in(tt,c.report+0.3,0.5),p:ag_keys(tt,[[P.cause-0.2,0],[P.cause+0.3,0.25],[P.fix+0.3,0.5],[P.checks+0.3,0.75],[P.question+0.3,1]])});}},
    // Mei, in the registrar's office, answers: the frame on the wall shows her at her desk; they count
    {at:c.mei-0.3,place:"lab",keys:[[c.mei-0.3,700,340,1.6]],push:0.02,draw:(x,tt)=>{
      ox_room(x,tt,{noRing:true,pic:["mei",tt,{talk:ag_io(tt,P.they,P.they+0.9,0.15)*(0.5+0.5*Math.sin(tt*16))}]});}},
    // Jun reviews the fix; Noor approves it
    {at:c.approve-0.3,place:"lab",keys:[[c.approve-0.3,960,540,1]],draw:(x,tt)=>{
      ox_gateRoom(x,tt,{s1:ag_in(tt,P.rev+0.2,0.5),s2:ag_in(tt,P.noor+0.2,0.5),who2:"approved|Noor",state:"fail",inTray:(cc,b)=>ox_draft(cc,b,1)});}},
    // the gate opens, and the fix goes live: the count, 18,412, checks pass, goes to the government; people answer for it
    {at:c.sent-0.3,place:"lab",keys:[[c.sent-0.3,960,540,1]],draw:(x,tt)=>{const op=ag_in(tt,c.sent-0.3,0.9)*(1-ag_in(tt,P.people+0.6,0.8)),go=clamp((tt-c.sent)/1.6,0,1);
      ox_gateRoom(x,tt,{s1:1,s2:1,who2:"approved|Noor",open:op,state:go>0.85?"pass":"fail",tag:"goes to the government",tagA:ag_in(tt,P.gov,0.5),
        inTray:(cc,b)=>ox_draft(cc,b,1-ag_in(tt,c.sent-0.2,0.3)),before:cc=>{if(go>0&&go<1){const q=ag_bz([520,730,800,760,1240,760,1500,640],ag_sine(go));
          ag_box(cc,q[0]-60,q[1]-22,120,44,10,{a:Math.min(1,go*8)*(1-ag_in(go,0.85,0.15)),edge:AG.blue,edgeA:0.6});}}});
      ["Mei","Jun","Noor"].forEach((n,i)=>ag_pill(x,1490+i*145,790,n,{col:AG.blue,a:ag_in(tt,P.people+i*0.15,0.4)}));}},
    // In Babylon, the law didn't ask the ox to be good: the ox, calm; it asked its owner to answer for it: the field, its owner at the rope
    {at:c.babylon-0.3,place:null,keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>OX_PIC.chew(x,tt-c.babylon+3)},
    {at:P.asked-0.3,place:null,keys:[[0,960,540,1]],push:0,draw:(x,tt)=>OX_PIC.field(x,tt-P.asked+2)},
    // the agent acts, a person answers: the words over the ox and over its owner; then, back in the lab, over the agent and over Jun
    {at:c.acts-0.3,place:"lab",keys:[[c.acts-0.3,OX_PICC[0],OX_PICC[1],OX_PICZ],[P.pa+0.9,960,540,1]],d:2.0,push:0,draw:(x,tt,cam)=>{
      const u=tt-P.asked+2;ox_room(x,tt,{jun:1,junO:{gaze:[3,-1]},pic:["field",u],ring:{core:0.7}});
      const back=ag_in(tt,P.pa+0.9,0.5),ox_=onPic(cam,760+u*38+120,930-410),own=onPic(cam,760+u*38+0.86*640,930-560);
      x.save();setScreen(x,S);
      ag_pill(x,ox_[0],ox_[1],"The agent acts.",{size:36,col:AG.violet,a:ag_in(tt,c.acts,0.4)*(1-back)});
      ag_pill(x,own[0],own[1],"A person answers.",{size:36,col:AG.blue,a:ag_in(tt,P.pa,0.4)*(1-back)});x.restore();
      const fin=ag_in(tt,P.pa+2.6,0.5);ag_pill(x,R[0],R[1]-262,"The agent acts.",{size:36,col:AG.violet,a:fin});ag_pill(x,OX_LAB.jun[0],310,"A person answers.",{size:36,col:AG.blue,a:fin});}},
    // a team can let it work through the night: the lab at night, the agent working inside its rail, the gate closed, the room calm
    {at:c.night-0.3,place:"oxNight",keys:[[c.night-0.3,960,540,1]],draw:(x,tt)=>{
      ox_gateRoom(x,tt,{night:true,s1:0,s2:0,who2:"approved|a second person",state:"pass",core:0.8,think:0.5,lit:Math.floor(tt*1.4)%3,inTray:(cc,b)=>ox_draft(cc,b,1)});}},
    // and stand behind the result: morning light; the team, and the count
    {at:P.stand-0.7,place:"lab",keys:[[P.stand-0.7,960,540,1]],draw:(x,tt)=>{const day=ag_in(tt,P.stand-0.6,1.6),ta=i=>ag_in(tt,P.stand-0.2+i*0.2,0.6);
      ox_frame(x,"field",3);ag_modelLight(x,R[0],R[1],88,1,760);ag_loop(x,R[0],R[1],{t:tt,core:0.6,p:1});
      ox_layerA(x,ta(0),cc=>ag_person(cc,"yusuf",170,690,0.78,{t:tt}));ox_layerA(x,ta(1),cc=>ag_person(cc,"jun",420,660,0.84,{t:tt}));
      ox_layerA(x,ta(2),cc=>ag_person(cc,"mei",650,700,0.76,{t:tt}));ox_layerA(x,ta(3),cc=>ag_person(cc,"noor",860,704,0.76,{t:tt}));
      ag_roomLight(x,1);ox_nightOver(x,tt,0.85*(1-day),0.6);
      ox_count(x,1300,590,420,{state:"pass",a:ag_in(tt,P.stand,0.5),k:ag_spr(tt,P.stand,0.6)});}}
  ],0.5);
  if(t>c.mei-0.3&&t<c.approve){setScreen(ctx,S);const ma=ag_io(t,c.mei,c.approve-0.5,0.4);
    ag_pill(ctx,953,600,"Mei · registrar's office",{col:AG.blue,a:ma});ox_say(ctx,1290,250,340,"They count.",1060,420,ag_io(t,P.they-0.1,c.approve-0.5,0.4),{side:"left",at:0.6,kick:"Mei"});}
  ox_kick(ctx,S,1-ag_in(t,c.report-0.8,0.5),true);
  ag_end(ctx,S,t,c.breath,"Ethics we can't read, accountability it can't hold","The agent acts. A person answers.","Film 6 of 9");
  if(t>c.breath){setScreen(ctx,S);ag_T(ctx,"Next: Why we govern them",960,790,{w:600,size:30,align:"center",col:AG.mut,a:ag_in(t,c.breath+1.6,0.8)});}});
