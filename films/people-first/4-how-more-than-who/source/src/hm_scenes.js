/* ===== How, more than who: the chapters, shot by shot =====
   Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt), so the pictures stay with the voice if it's recorded
   again; the score (tools/score.py) takes the same words. In one room the camera glides and only what changes fades; a later moment in
   a room (later:true) lets what was there leave first; between rooms a shot dissolves. In the gorge the camera closes in to twice the
   size and more, so words there are drawn at the screen's own size (hm_label, or after setScreen). Sizes in the 1920 x 1080 frame. */

const HM_TITLE="How, more than who",HM_LAST="Agree how you work together, and keep to it.";
// outdoors there is no wall for a shadow; under the grey sky the light is flat
const HM_SUN={wall:0},HM_GREY={light:"grey",wall:0};
// last year's bridge, and this year's
const HM_OLD={age:1,wear:0.22,extra:{r1:8}},HM_NEW={age:0};
// someone walking over a bridge q: at u0 of the way across at t0, going sp of the span a second (to the left when sp is under 0)
function hm_walker(ctx,q,t,u0,t0,sp,who,o){const u=u0+(t-t0)*sp;if(u<0.015||u>0.985)return null;const p=hm_deck(u,q);return hm_fig(ctx,p[0],p[1],50,Object.assign({who,pose:"walk",t:t+who,flip:sp<0,shadow:0},o||{}));}

/* ---------------------------------------------------------------- 1. Three days in June: Quehue, the high Andes of Peru */
scene("days",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  // ---- the making of the cables, close on the bank: cords into ropes, three ropes into a cable, in a builder's hand
  const bx=1270,by=640,bs=0.9,A=HM_PEOPLE.builder,B=HM_PEOPLE.builder2,
    letGo=w("tire","tires",-0.1),aOut=letGo+0.45,bIn=w("tire","another",0.5),bHold=bIn+1.15,
    mA=1-ag_in(t,letGo,0.45),xA=bx+lerp(0,420,ag_sine((t-aOut)/1.2)),aA=1-ag_in(t,aOut+0.5,0.6),
    xB=bx+lerp(420,0,ag_sine((t-bIn)/1.2)),aB=ag_in(t,bIn,0.6),mB=ag_in(t,bHold,0.45),held=Math.max(mA*(t<aOut?1:0),mB),
    rest=hm_palm(bx,by,bs,true,1),hand=t<bIn?hm_palm(xA,by,bs,true,mA):hm_palm(xB,by,bs,true,mB),
    E=[lerp(rest[0]-6,hand[0],held),lerp(rest[1]+54,hand[1],held)],J=[640,rest[1]+10];
  const ropes=(x,tt)=>{const ra=ag_in(tt,c.braid-0.1,0.5),ba=ag_in(tt,w("braid","braid",-0.3),0.7);if(ra<=0.004)return;x.save();x.globalAlpha*=ra;
    for(const [k,y0] of [[0,480],[1,655],[2,830]]){const K=[330,lerp(y0,J[1],0.45)];
      for(let i=0;i<5;i++)hm_rope(x,hm_hang([-30,y0-56+i*28],K,6+(i%2)*8,10),8,{});
      hm_rope(x,hm_hang(K,[J[0]+12,J[1]+(k-1)*11],k===1?4:-10+k*8,14),24,{});}
    if(ba>0.004){const e=[lerp(J[0]+40,E[0],ag_sine(ba)),lerp(J[1],E[1],ag_sine(ba))];hm_rope(x,hm_hang([J[0]-6,J[1]],e,12*(1-held)+8,24),56,{braid:true});}
    x.restore();};
  // ---- the three days at the gorge, in one shot: the cables pulled across, tied, last year's bridge cut loose, the weaving
  const T=c.tie,cut=T+7.9,wv=c.weave-0.2,meet=c.weave+7.2,home=c.done-0.6,
    cab=[["f0",T-0.6,2.6],["f1",T+1.0,2.2],["f2",T+2.2,2.2],["f3",T+3.3,2.1],["r0",T+4.3,1.9],["r1",T+5.1,1.9]];
  const built=(x,tt,cam)=>{const uw=ag_sine((tt-wv)/(meet-wv))*0.5,done=tt>=meet,mat=Math.max(0,uw-0.2)+0.2*ag_in(tt,meet-0.4,2.4),
      q=Object.assign({},HM_NEW,{f:[0,1,2,3].map(k=>ag_in(tt,cab[k][1],cab[k][2])),r:[4,5].map(k=>ag_in(tt,cab[k][1],cab[k][2])),ties:[uw,uw],floor:[Math.max(0,uw-0.03),Math.max(0,uw-0.03)],mat:[mat,mat]});
    hm_banks(x,tt,{men:1-ag_in(tt,T-0.6,0.8)+ag_in(tt,home+3,1.2),kids:0});
    // the men who pull each cable across from the right bank, leaning back on a thin rope; those who pay it out on the left
    const hauling=ag_io(tt,T-0.7,T+7.3,0.6),R=HM_BANK.R,L=HM_BANK.L;
    if(hauling>0.004){const hands=[];
      for(let i=0;i<8;i++){const f=hm_fig(x,R.x0+34+i*32,R.y+15,50,{who:i*2,pose:"haul",flip:true,a:hauling});if(f)hands.push(f.hand);}
      for(let i=0;i<4;i++)hm_fig(x,L.x0+330+i*24,L.y+(i%2)*3,50,{who:[0,2,4,6][i],pose:i%2?"bend":"stand",a:hauling});
      if(hands.length)for(const [id,t0,d] of cab){const p=(tt-t0)/d;if(p<=0||p>=1)continue;x.save();x.globalAlpha*=hauling;hm_rope(x,[hm_at(id,ag_sine(p),HM_NEW),hm_anchor(id,1)].concat(hands),1.8,{});x.restore();}}
    // tying them to the stone base on the right bank: two men stooping to it, an older man beside them
    const tying=ag_io(tt,w("tie","tie",-0.5),cut+0.2,0.5);
    if(tying>0.004){hm_fig(x,1436,449,50,{who:4,pose:"bend",flip:true,a:tying});hm_fig(x,1468,452,50,{who:6,pose:"bend",flip:true,a:tying});hm_fig(x,1502,455,50,{who:0,pose:"stand",flip:true,a:tying});}
    // last year's bridge until it is cut loose, then this year's cables, the sides and the floor
    if(tt<cut)hm_bridge(x,HM_OLD);else{hm_bridge(x,Object.assign({},HM_OLD,{f:0,r:0,a:1-(tt-cut)/0.3}));hm_fall(x,tt-cut,{age:1,drift:9});}
    hm_bridge(x,Object.assign({},q,{f:q.f.map(v=>ag_sine(v)),r:q.r.map(v=>ag_sine(v)),mid:cx=>{
      if(tt>wv-0.4&&tt<home+8){const out=ag_in(tt,home,0.01),back=(tt-home)*0.05;
        // each builder sits astride the floor cables at the edge of the work, two men behind passing cord and rods; then they go home
        for(const [side,who] of [[0,0],[1,2]]){const u=Math.max(0.045,uw-0.028),ub=side?1-u:u,fa=ag_in(tt,wv-0.4,0.6);
          if(!out){let p=hm_deck(ub,q);hm_fig(cx,p[0],p[1],50,{who,pose:"astride",flip:!!side,shadow:0,a:fa});
            for(const [d,wh] of [[0.07,who+4],[0.13,who+6]]){if(u-d<0.02)continue;p=hm_deck(side?1-(u-d):u-d,q);hm_fig(cx,p[0],p[1],50,{who:wh,pose:"sit",flip:!!side,shadow:0,a:fa});}}
          else for(const [d,wh] of [[0,who],[0.07,who+4],[0.13,who+6]]){const uu=u-d-back;if(uu<0.02)continue;const p=hm_deck(side?1-uu:uu,q);hm_fig(cx,p[0],p[1],50,{who:wh,pose:"walk",t:tt+d*9,flip:!side,shadow:0});}}}
      // and the first to cross it
      if(tt>home+3.5)for(const [u0,t0,sp,who] of [[0.02,home+3.5,0.05,1],[0.98,home+5.5,-0.045,5],[0.02,home+8.5,0.05,3],[0.98,home+11,-0.05,7],[0.02,home+14,0.045,2],[0.98,home+17,-0.045,4],[0.02,home+20,0.05,6]])hm_walker(cx,q,tt,u0,t0,sp,who);}}));
    return q;};
  ag_shots(ctx,S,t,sc.dur,[
    // the gorge in June, last year's bridge still across it, people coming in along both banks
    {at:0,place:"hmGorge",keys:[[0,960,500,1.22],[c.where-1.4,960,540,1.0]],d:4,draw:(x,tt,cam)=>{
      hm_banks(x,tt,{come:0});
      hm_bridge(x,Object.assign({mid:cx=>hm_walker(cx,HM_OLD,tt,0.16,0,0.036,2)},HM_OLD));
      hm_sheet(x,tt,c.where-0.2,130,84,620,{kick:"The high Andes of Peru",title:"Quehue",lines:["Four communities","Every June: a new bridge of grass rope"]},
        {light:null,pin:false,out:c.size-0.7,u:hm_u(tt,[w("june","four",-0.2),w("june","bridge",-0.2)])});
      const ra=ag_io(tt,w("june","Apurímac",-0.3),c.size-0.4);if(ra>0.004)hm_label(x,cam,960,806,()=>lp_tag(x,0,0,"The Apurímac river",{align:"center",col:LP.ink,a:ra}));
      hm_measure(x,cam,[504,352],[1416,356],"28 metres",{u:ag_in(tt,w("size","twenty",-0.2),1.1),a:1-ag_in(tt,c.alone-0.9,0.4)});
      hm_sheet(x,tt,w("size","About",-0.2),1190,84,600,{kick:"Built in three days",title:"By about 1,000 people"},{light:null,pin:false,out:c.alone-0.8});}},
    // one family, and no drawing
    {at:c.alone-0.4,place:"hmBank",keys:[[c.alone-0.4,960,540,1.0]],dis:1.0,draw:(x,tt)=>{
      lp_person(x,HM_PEOPLE.woman,430,640,0.9,{t:tt,pose:"hold",hold:(cx,h)=>hm_coil(cx,h.near[0]+34,h.near[1]+58,92,{}),light:HM_SUN});
      lp_person(x,HM_PEOPLE.man,850,640,0.9,{t:tt,flip:true,light:HM_SUN});
      hm_tag(x,tt,w("alone","alone",-0.9),null,640,236,"No family could raise it alone",{align:"center",col:LP.ink});
      // where a drawing of the bridge would be: an empty frame
      const fa=ag_in(tt,w("alone","drawing",-0.5),0.5);if(fa>0.004){x.save();x.globalAlpha*=fa;x.fillStyle="rgba(250,247,240,0.28)";x.fillRect(1180,170,580,330);x.setLineDash([18,14]);x.strokeStyle=rgba(LP.ink,0.7);x.lineWidth=4;x.strokeRect(1180,170,580,330);x.restore();}
      hm_tag(x,tt,w("alone","drawing",-0.2),null,1470,560,"No drawing of it",{align:"center",col:LP.amber});
      hm_tag(x,tt,w("alone","written",-0.2),null,1470,630,"No written plan",{align:"center",col:LP.amber});}},
    // yet it has to hold: someone crossing, fifteen metres above the river; then every cord in it, close
    {at:c.hold-0.4,place:"hmGorge",keys:[[c.hold-0.4,960,600,1.55],[c.need-0.7,740,480,2.1],[c.way-1.0,960,540,1.0]],d:3.2,dis:1.0,draw:(x,tt,cam)=>{
      hm_banks(x,tt,{});
      hm_bridge(x,Object.assign({mid:cx=>hm_walker(cx,HM_OLD,tt,0.3,c.hold-0.4,0.04,2)},HM_OLD));
      hm_measure(x,cam,[1012,548],[1012,836],"About 15 metres",{u:ag_in(tt,w("hold","fifteen",-0.6),1.0),a:1-ag_in(tt,c.need-0.8,0.4),dx:150});}},
    // each family's cord, checked in
    {at:c.cord-0.4,place:"hmBank",keys:[[c.cord-0.4,960,540,1.0]],dis:1.0,draw:(x,tt)=>{const ck=w("cord","checked",-0.2);
      const coil=(cx,h)=>hm_coil(cx,h.near[0]+34,h.near[1]+58,92,{});
      lp_person(x,HM_PEOPLE.woman,330,640,0.9,{t:tt,pose:"hold",hold:coil,light:HM_SUN});
      lp_person(x,HM_PEOPLE.woman2,1590,640,0.9,{t:tt,flip:true,pose:"hold",hold:coil,light:HM_SUN});
      lp_person(x,HM_PEOPLE.man2,960,640,0.9,{t:tt,light:HM_SUN,nod:0.05*ag_io(tt,ck,ck+1.4,0.3)});
      hm_sheet(x,tt,w("cord","promised",-0.3),660,60,600,{kick:"Each family",title:"One cord, as promised",lines:["Forty arm spans: about 70 metres"]},{light:null,pin:false,u:ag_in(tt,w("cord","forty",-0.2),0.5)});
      for(const [px,dt] of [[470,0],[1450,0.5]]){const a=ag_in(tt,ck+dt,0.3);if(a<=0.004)continue;x.save();x.globalAlpha*=a;const f=lerp(0.6,1,ag_spr(tt,ck+dt,0.5));
        x.fillStyle=rgba(LP.green,1);x.beginPath();x.arc(px,700,30*f,0,TAU);x.fill();lp_icon(x,"tick",px,700,38*f,[255,255,255]);x.restore();}
      hm_pill(x,tt,ck+0.2,null,960,840,"Every cord checked in, on both banks",{col:LP.green,icon:"tick"});}},
    // each community's part: the six cables, the mat and the rods
    {at:c.part-0.45,place:"hmBank",later:true,keys:[[c.part-0.45,960,540,1.0]],draw:(x,tt)=>{const t6=w("part","six",-0.3),tm=w("part","mat",-0.3),y0=742;
      const G=[["Huinchiri","Two cables of the floor",270,t6,cx=>{hm_cableCoil(cx,190,y0,84,{braid:true,w:19});hm_cableCoil(cx,350,y0,84,{braid:true,w:19});}],
        ["Chaupibanda","A floor cable, a handrail",735,t6+0.5,cx=>{hm_cableCoil(cx,655,y0,84,{braid:true,w:19});hm_cableCoil(cx,812,y0+6,70,{w:13,n:5});}],
        ["Ccollana Quehue","A floor cable, a handrail",1200,t6+1.0,cx=>{hm_cableCoil(cx,1120,y0,84,{braid:true,w:19});hm_cableCoil(cx,1277,y0+6,70,{w:13,n:5});}],
        ["Choccayhua","The mat and the rods",1660,tm,cx=>{hm_matRoll(cx,1560,y0-22,170,76,{});hm_rods(cx,1580,y0+38,190,{});}]];
      hm_pill(x,tt,c.part+0.1,null,960,300,"Each community knows its part",{col:LP.blue});
      G.forEach(([name,what,px,t1,draw],i)=>{const t0=c.part+0.5+i*0.45,a=ag_in(tt,t1,0.5);
        hm_tag(x,tt,t0,null,px,560,name,{align:"center",col:LP.ink});
        if(a>0.004){x.save();x.globalAlpha*=a;draw(x);x.restore();}
        hm_tag(x,tt,t1+0.3,null,px,850,what,{align:"center",col:LP.mut});});}},
    // cords into ropes, three ropes into a cable; one man braids until he tires, then another takes his place
    {at:c.braid-0.45,place:"hmBank",later:true,keys:[[c.braid-0.45,960,540,1.0]],draw:(x,tt)=>{
      ropes(x,tt);
      if(aA>0.004)lp_person(x,A,xA,by,bs,{t:tt,flip:true,pose:"hold",pose2:"hang",mix:1-mA,a:aA,light:HM_SUN,holdBack:hm_over(A,xA,by,bs,true,tt,cx=>ropes(cx,tt))});
      if(aB>0.004)lp_person(x,B,xB,by,bs,{t:tt,flip:true,pose:"hang",pose2:"hold",mix:Math.max(mB,0.001),a:aB,light:HM_SUN,holdBack:hm_over(B,xB,by,bs,true,tt,cx=>ropes(cx,tt))});
      hm_tag(x,tt,w("braid","twist",-0.2),null,60,330,"Cords, twisted into ropes",{col:LP.ink});
      hm_tag(x,tt,w("braid","braid",0.2),null,1090,560,"Three ropes, braided into a cable",{align:"right",col:LP.ink});
      hm_tag(x,tt,bIn+0.2,null,1600,250,"When one tires, another takes his place",{align:"right",col:LP.ink});}},
    // the cables pulled across and tied; last year's bridge cut loose; the weaving from both banks; the bridge, new
    {at:T-0.45,place:"hmGorge",keys:[[T-0.45,960,540,1.0],[w("tie","tie",-1.3),1300,470,1.9],[cut-1.7,960,540,1.0],[c.weave+0.2,960,500,1.9],[home-0.2,960,540,1.0]],d:2.8,dis:1.0,draw:(x,tt,cam)=>{
      built(x,tt,cam);
      hm_sheet(x,tt,w("how","promises",-0.3),170,96,640,{kick:"How they work",title:"Promises kept",lines:["A cord from every family"]},{col:LP.green,light:null,pin:false,out:c.data-0.8});
      hm_sheet(x,tt,w("how","parts",-0.3),1110,96,640,{kick:"How they work",title:"Parts everyone knows",lines:["Each community, its own part"]},{col:LP.blue,light:null,pin:false,out:c.data-0.8});}},
    // and a data team's work: four parts, each leaning on the one before
    {at:c.data-0.4,place:"hmWed",keys:[[c.data-0.4,960,540,1.0]],dis:1.2,push:0,draw:(x,tt)=>{const g=1-ag_in(tt,c.breath+0.2,0.8),t0=c.data+0.2;x.save();x.globalAlpha*=g;
      hm_chain(x,tt,{at:[t0,t0+0.7,t0+1.4,t0+2.1],light:"day",y:210});
      hm_tag(x,tt,w("data","alone",-0.5),c.more-0.4,960,520,"Nobody can do it alone",{align:"center",col:LP.ink});
      hm_tag(x,tt,w("data","leans",-0.3),c.more-0.4,960,596,"Every part leans on someone else's",{align:"center",col:LP.ink});
      hm_pill(x,tt,w("more","how",-0.2),null,960,530,"How a team works together",{col:LP.blue,size:38});
      const ma=ag_in(tt,w("more","more",-0.3),0.4);if(ma>0.004)lp_T(x,"counts for more than",960,618,{w:700,size:30,align:"center",col:LP.mut,a:ma});
      hm_pill(x,tt,w("more","who",-0.2),null,960,690,"who is in it",{col:LP.mut});
      x.restore();}}
  ]);
  // words over the gorge, at the screen's own size
  setScreen(ctx,S);
  hm_tag(ctx,t,w("hold","hold",-0.5),c.need-0.8,960,150,"It has to hold, for a year",{align:"center",col:LP.amber});
  hm_tag(ctx,t,w("need","cord",-1.0),c.way-0.9,960,150,"Its strength: every cord in it",{align:"center",col:LP.amber});
  hm_tag(ctx,t,w("need","own",-0.5),c.way-0.9,700,810,"Know your own part",{align:"center",col:LP.blue});
  hm_tag(ctx,t,w("need","trust",-0.3),c.way-0.9,1220,810,"Trust everyone else's",{align:"center",col:LP.green});
  hm_pill(ctx,t,w("way","way",-0.4),c.cord-0.7,960,160,"A way of working that everyone knows",{col:LP.blue});
  hm_tag(ctx,t,w("tie","pull",-0.5),w("tie","tie",-0.6),960,150,"Many hands pull the cables across",{align:"center",col:LP.ink});
  hm_tag(ctx,t,w("tie","tie",-0.3),cut-1.2,960,150,"Tied to the old stone bases",{align:"center",col:LP.ink});
  hm_tag(ctx,t,w("tie","older",-0.3),cut-1.2,960,810,"The older guide the younger",{align:"center",col:LP.ink});
  hm_tag(ctx,t,cut+0.2,c.weave-0.3,960,150,"Last year's bridge, cut loose",{align:"center",col:LP.ink});
  hm_tag(ctx,t,w("weave","builders",-0.3),c.done-0.6,960,150,"Two builders, one from each bank",{align:"center",col:LP.ink});
  hm_pill(ctx,t,meet-0.2,c.done-0.6,960,810,"They meet in the middle",{col:LP.green,icon:"tick"});
  hm_pill(ctx,t,w("done","bridge",-0.3),c.how-0.6,960,160,"A bridge for another year",{col:LP.green,icon:"tick"});
  hm_tag(ctx,t,w("done","next",-0.2),c.how-0.6,960,250,"The next day, they celebrate",{align:"center",col:LP.ink});
  lp_title(ctx,S,t,c.breath+0.2,HM_TITLE,"A turn each, promises kept, one page","Leading data people · People first");
});

/* ---------------------------------------------------------------- 2. Less about who: a study of 180 teams */
scene("who",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),tL=c.safe-0.5;
  ag_shots(ctx,S,t,sc.dur,[
    // the study, and what it found, as its own guide writes it
    {at:0,place:"hmWed",keys:[[0,960,540,1.0]],draw:(x,tt)=>{const q0=c.quote-0.2;
      hm_sheet(x,tt,w("google","180",-0.4),140,190,660,{kick:"Google's study of its own teams",title:"180 teams",lines:["Why did some work better than others?"]},{u:ag_in(tt,w("google","why",-0.2),0.5)});
      hm_quote(x,860,190,920,{a:ag_in(tt,q0,0.35),k:tt-q0,u:[1,ag_in(tt,w("quote","less",-0.2),0.5),ag_in(tt,w("quote","more",-0.2),0.5)]});}},
    // its list, in its order: two of the five are this film's; then the gorge, which has both
    {at:tL,place:"hmWed",later:true,keys:[[tL,960,540,1.0]],draw:(x,tt)=>{const l0=tL+0.5,p0=c.gorge-0.3;
      hm_five(x,140,150,860,{a:ag_in(tt,l0,0.35),k:tt-l0,
        u:[ag_in(tt,c.safe+0.2,0.4),ag_in(tt,w("word","keeping",-0.3),0.4),ag_in(tt,w("word","clear",-0.3),0.4),ag_in(tt,w("word","clear",1.0),0.5),ag_in(tt,w("word","clear",1.3),0.5)],
        sub:[ag_in(tt,w("safe","speak",-0.3),0.4),1,1],hi:{1:LP.green,2:LP.blue},hiA:{1:ag_in(tt,w("word","keeping",0.3),0.5),2:ag_in(tt,w("word","clear",0.3),0.5)}});
      hm_sheet(x,tt,w("safe","later",-0.3),1090,150,690,{kick:"A later film",title:"The team comes first",sub:"About psychological safety"},{out:c.word-0.5});
      hm_print(x,1108,168,654,{a:ag_in(tt,p0,0.4),k:tt-p0,light:"day"});
      hm_tag(x,tt,w("gorge","custom",-0.6),null,1435,626,"At the gorge: both, from custom",{align:"center",col:LP.ink});
      hm_tag(x,tt,w("gorge","say",-0.3),null,1435,700,"In a data team: said out loud",{align:"center",col:LP.blue});}}
  ]);
  hm_kick(ctx,S,ag_in(t,0.6,0.6));
});
/* ---------------------------------------------------------------- 3. Two numbers: the university, Wednesday 24 February 2027 */
scene("number",(ctx,S,t,sc)=>{const c=sc.cues,e=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),dy={light:"day"},G=sc.start,tJ=c.model-0.4,tT=c.tomas-0.4,tW=c.wrong-0.5;
  ag_shots(ctx,S,t,sc.dur,[
    // Helena Novak, in her fourth week
    {at:0,place:"hmWed",later:true,keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      lp_person(x,"helena",560,640,1.0,{t:tt+G,light:dy});
      hm_tag(x,tt,w("wed","Wednesday",-0.3),null,980,214,"Wednesday 24 February 2027",{col:LP.ink});
      hm_sheet(x,tt,w("wed","Helena",-0.2),980,276,640,{kick:"The data manager",title:"Helena Novak",lines:["In her fourth week"]},{u:ag_in(tt,w("wed","fourth",-0.3),0.5)});}},
    // Jun, his new model, and the check: both, for the same day
    {at:tJ,place:"hmWed",later:true,keys:[[tJ,960,540,1.0]],draw:(x,tt)=>{const k0=c.check-0.2,b0=w("check","both",-0.3),f1=w("differ","18,412",-0.4),f2=w("differ","19,549",-0.4);
      lp_person(x,"jun",1440,640,1.0,{t:tt+G,flip:true,light:dy});
      hm_sheet(x,tt,c.model-0.1,200,170,720,{kick:"Analytics engineer",title:"Jun Park",lines:["Built a new model","To take over one of the old reports"]},{out:k0-0.5,u:hm_u(tt,[w("model","built",-0.2),w("model","take",-0.2)])});
      hm_sheet(x,tt,k0,200,150,820,{kick:"The check",title:"Both, for census day last year",sub:"31 March 2026: the count sent to the government"});
      hm_count(x,200,404,400,"The old report","18,412",{a:ag_in(tt,b0,0.35),k:tt-b0,n:ag_in(tt,f1,0.4)});
      hm_count(x,620,404,400,"The new model","19,549",{a:ag_in(tt,b0+0.4,0.35),k:tt-b0-0.4,n:ag_in(tt,f2,0.4)});
      hm_tag(x,tt,w("differ","19,549",1.4),null,610,704,"A gap of 1,137",{align:"center",col:LP.amber});}},
    // Tomás, who built the old report
    {at:tT,place:"hmWed",later:true,keys:[[tT,960,540,1.0]],draw:(x,tt)=>{
      lp_person(x,HM_TOMAS,520,640,1.0,{t:tt+G,light:dy});
      hm_sheet(x,tt,c.tomas-0.1,930,170,800,{kick:"Report developer",title:"Tomás Ortega",lines:["Built that report, years ago","People still ask him what its numbers mean"]},{u:hm_u(tt,[w("tomas","built",-0.2),w("tomas","People",-0.2)])});}},
    // the team's table: it turns to the person; two do the talking; Helena stops it and says why
    {at:tW,place:"hmWed",later:true,keys:[[tW,960,540,1.0]],push:0,draw:(x,tt)=>{
      const j0=w("wrong","your",-0.3),j1=w("wrong","Tomás",-0.2),o0=w("wrong","model",-0.5),stop=w("stop","stops",-0.1),say=w("stop","we've",-0.3),back=w("stop","number",-0.2),s0=c.study-0.7,s1=c.stop-0.6;
      hm_team(x,tt+G,{light:"day",talk:{jun:hm_talk(tt,j0+0.3,j1),tomas:hm_talk(tt,o0+0.3,e.wrong),helena:hm_talk(tt,say+0.3,e.stop)}});
      // the two numbers: they dim as the talk leaves them, and come back when Helena names what happened
      const na=ag_in(tt,tW+0.6,0.4)*(1-0.65*ag_in(tt,j0,0.8))*(1-ag_in(tt,s0,0.4))+ag_in(tt,back,0.5);
      lp_pill(x,690,190,"The old report: 18,412",{col:LP.orange,a:na});lp_pill(x,1230,190,"The new model: 19,549",{col:LP.orange,a:na});
      hm_say(x,1842,384,"Your report\nis wrong.",1750,{col:LP.amber,align:"right",a:ag_io(tt,j0,stop,0.35),k:tt-j0});
      hm_say(x,78,384,"Your model\nis new.",170,{col:LP.amber,align:"left",a:ag_io(tt,o0,stop,0.35),k:tt-o0});
      hm_tag(x,tt,w("quiet","Two",-0.2),s0,960,300,"Two people do all the talking",{align:"center",col:LP.amber});
      hm_tag(x,tt,w("quiet","Erin",-0.2),s0,hm_seat("erin"),478,"Erin Walsh",{align:"center",col:LP.mut});
      hm_tag(x,tt,w("quiet","Marta",-0.2),s0,hm_seat("marta"),478,"Marta Silva",{align:"center",col:LP.mut});
      // what 116 studies of teams found
      hm_sheet(x,tt,w("study","conflict",-0.3),410,150,520,{kick:"About the person",title:"Harms the work"},{col:LP.amber,out:s1});
      hm_sheet(x,tt,w("study","Disagreement",-0.3),990,150,520,{kick:"About the work",title:"Need not harm it",sub:"If it stays about the work"},{col:LP.green,out:s1});
      hm_tag(x,tt,c.study+0.1,s1,960,440,"Across 116 studies of teams",{align:"center",col:LP.ink});
      hm_say(x,hm_seat("helena"),384,"We've left the number,\nand started on each other.",hm_seat("helena"),{col:LP.blue,a:ag_in(tt,say,0.35),k:tt-say});}}
  ]);
  setScreen(ctx,S);lp_sceneTag(ctx,"The university, 2027 · imagined",{a:ag_io(t,0.8,tJ-0.2,0.5)});
  hm_kick(ctx,S,1);
});
/* ---------------------------------------------------------------- 4. Three things: what you saw, what you feel and need, what you ask */
scene("three",(ctx,S,t,sc)=>{const c=sc.cues,e=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),G=sc.start,
    J=["I saw two numbers for the same thing.","I'm worried: I need people to trust what we publish.","I ask that we check them side by side, before either is sent."],
    T=["I heard my report called wrong, before anyone asked what it counts.","That stung: I need what I built to be read before it's replaced.","I ask to be asked."];
  ag_shots(ctx,S,t,sc.dur,[
    // the same table: each of the two says three things, and they go up on the wall as he says them
    {at:0,place:"hmWed",keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{const s0=c.ask+0.2,s1=c.named-0.8,n0=c.named+0.1,n1=c.answer-0.8,a0=c.answer-0.1,q0=w("answer","what does",-0.3);
      hm_team(x,tt+G,{light:"day",talk:{helena:hm_talk(tt,w("ask","what you saw",0),e.ask),
        jun:hm_talk(tt,w("jun1","I saw",0),e.jun1)+hm_talk(tt,c.jun2,e.jun2)+hm_talk(tt,c.jun3,e.jun3)+hm_talk(tt,q0+0.3,e.answer),
        tomas:hm_talk(tt,w("tom1","I heard",0),e.tom1)+hm_talk(tt,c.tom2,e.tom2)+hm_talk(tt,c.tom3,e.tom3)}});
      hm_three(x,150,128,1620,{a:ag_io(tt,s0,s1,0.4),k:tt-s0,light:"day",head:[ag_in(tt,w("ask","what you saw",-0.2),0.4),ag_in(tt,w("ask","what you feel",-0.2),0.4),ag_in(tt,w("ask","and what you ask",0.1),0.4)],
        rows:[{name:"Jun",cells:J,a:ag_in(tt,c.jun1-0.1,0.4),u:[ag_in(tt,w("jun1","I saw",-0.1),0.5),ag_in(tt,c.jun2,0.5),ag_in(tt,c.jun3,0.5)]},
              {name:"Tomás",cells:T,a:ag_in(tt,c.tom1-0.1,0.4),u:[ag_in(tt,w("tom1","I heard",-0.1),0.5),ag_in(tt,c.tom2,0.5),ag_in(tt,c.tom3,0.5)]}]});
      // where the three things come from, and what they rest on
      hm_sheet(x,tt,n0,220,150,720,{kick:"Where the three things come from",title:"Non-violent communication",lines:["Marshall Rosenberg, psychologist"]},{out:n1,u:ag_in(tt,w("named","psychologist",-0.4),0.5)});
      hm_sheet(x,tt,c.practice+0.1,980,150,700,{kick:"What it rests on",title:"Practice and small studies",sub:"Not on large trials"},{out:n1});
      hm_tag(x,tt,w("practice","feelings",-0.3),n1,960,440,"Feelings are in a hard conversation anyway",{align:"center",col:LP.ink});
      // named, so answered: Tomás's ask, and Jun's question
      hm_tag(x,tt,w("answer","answered",-0.5),null,960,290,"Once they're named, they can be answered",{align:"center",col:LP.ink});
      hm_say(x,78,384,"I ask\nto be asked.",170,{col:LP.blue,align:"left",a:ag_in(tt,a0,0.35),k:tt-a0});
      hm_say(x,1842,384,"What does\nyour report count?",1750,{col:LP.green,align:"right",a:ag_in(tt,q0,0.35),k:tt-q0});}}
  ]);
  hm_kick(ctx,S,1);
});
/* ---------------------------------------------------------------- 5. A turn each: what each of the two numbers counts */
scene("turn",(ctx,S,t,sc)=>{const c=sc.cues,e=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),dy={light:"day"},G=sc.start,tM=c.marta-0.5,tG=c.groups-0.5,tO=c.owner-0.5;
  ag_shots(ctx,S,t,sc.dur,[
    // the same table: a turn each, and Erin, who hadn't spoken
    {at:0,place:"hmWed",keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{const r0=w("round","everyone",-0.3),e0=w("erin","reads",-0.6),ex=hm_seat("erin");
      hm_team(x,tt+G,{light:"day",talk:{erin:hm_talk(tt,e0+0.3,e.erin)}});
      hm_marks(x,tt,{a:ag_in(tt,r0,0.4),at:{jun:r0+0.3,tomas:r0+0.5,erin:c.erin+0.1},col:{jun:LP.mut,tomas:LP.mut}});
      hm_pill(x,tt,w("round","turn",-0.4),null,960,210,"A turn each",{col:LP.blue,size:36});
      hm_tag(x,tt,c.erin+0.2,null,ex,300,"Erin Walsh · Platform engineer",{align:"center",col:LP.ink});
      hm_say(x,ex,392,"The old report reads only\nthe student system.",ex,{col:LP.ink,a:ag_in(tt,e0,0.35),k:tt-e0});}},
    // Marta, who knows the university's numbers: what each of the two counts
    {at:tM,place:"hmWed",later:true,push:0.012,keys:[[tM,960,540,1.0]],draw:(x,tt)=>{const s0=c.students-0.1,l0=c.learners-0.1;
      lp_person(x,HM_MARTA,285,650,0.92,{t:tt+G,light:dy,talk:hm_talk(tt,c.students,e.students)+hm_talk(tt,c.learners,e.learners)});
      hm_sheet(x,tt,c.marta-0.1,560,150,620,{kick:"Data analyst",title:"Marta Silva",lines:["Knows the university's numbers"]},{out:s0-0.5,u:ag_in(tt,w("marta","knows",-0.2),0.5)});
      hm_sheet(x,tt,s0,540,150,640,{kick:"The old report counts",title:"18,412 students",lines:["Taking the units that make up a degree","The number sent to the government"]},
        {col:LP.orange,u:hm_u(tt,[w("students","people",-0.2),w("students","government",-0.9)])});
      hm_sheet(x,tt,l0,1200,150,640,{kick:"The new model counts",title:"19,549 learners",lines:["Those students","And 1,137 people on short courses"]},
        {col:LP.orange,u:hm_u(tt,[w("learners","those",-0.2),w("learners","1,137",-0.3)])});
      hm_split(x,540,610,1300,{a:ag_in(tt,s0+0.6,0.4),u:ag_in(tt,s0+0.8,1.4),v:ag_in(tt,w("learners","1,137",-0.2),0.9)});
      hm_pill(x,tt,w("both","right",-0.6),null,1190,746,"Both numbers are right",{col:LP.green,icon:"tick"});
      hm_tag(x,tt,w("both","never",-0.3),null,1190,822,"They were never the same thing",{align:"center",col:LP.ink});}},
    // what the best small groups had; how much each member spoke (a drawing of the idea, not the study's data)
    {at:tG,place:"hmWed",later:true,keys:[[tG,960,540,1.0]],draw:(x,tt)=>{const g0=w("groups","small",-0.3),b0=w("turns","taking",-0.6);
      hm_sheet(x,tt,c.groups-0.1,130,220,780,{kick:"Anita Woolley and colleagues, 2010",title:"Small groups, many kinds of task"});
      hm_pill(x,tt,w("groups","collective",-0.4),null,520,490,"Collective intelligence",{col:LP.blue,size:36});
      hm_tag(x,tt,w("turns","little",-0.3),null,520,598,"Little to do with how clever the cleverest was",{align:"center",col:LP.mut});
      hm_talkBars(x,1010,286,330,270,[84,58,14,9,6],{a:ag_in(tt,g0,0.5),u:ag_in(tt,b0,1.3),col:mix(LP.orange,LP.paper,0.35)});
      hm_talkBars(x,1450,286,330,270,[36,33,38,31,34],{a:ag_in(tt,g0+0.5,0.5),u:ag_in(tt,b0+0.5,1.3)});
      hm_tag(x,tt,b0-0.2,null,1395,226,"How much each one spoke",{align:"center",col:LP.ink});
      hm_tag(x,tt,b0+1.2,null,1175,682,"A few do the talking",{align:"center",col:LP.mut});
      hm_tag(x,tt,w("turns","equally",-0.5),null,1615,682,"Turns more equal: did better",{align:"center",col:LP.green});}},
    // whose number to publish: not theirs to decide; the owner is asked in a ticket, and the words go into the glossary
    {at:tO,place:"hmWed",later:true,keys:[[tO,960,540,1.0]],draw:(x,tt)=>{const k0=w("ticket","So Jun",-0.3),k1=c.glossary-0.7,g0=c.glossary-0.1;
      lp_person(x,"jun",230,730,0.72,{t:tt+G,light:dy});lp_person(x,HM_TOMAS,500,730,0.72,{t:tt+G,light:dy});lp_person(x,"helena",770,730,0.72,{t:tt+G,light:dy});
      hm_tag(x,tt,w("owner","Jun's",-0.2),null,230,470,"Jun",{align:"center",col:LP.mut});
      hm_tag(x,tt,w("owner","Tomás's",-0.2),null,500,470,"Tomás",{align:"center",col:LP.mut});
      hm_tag(x,tt,w("owner","Helena's",-0.2),null,770,470,"Helena",{align:"center",col:LP.mut});
      hm_tag(x,tt,w("owner","Helena's",0.5),null,500,380,"Which number to publish: not theirs to decide",{align:"center",col:LP.ink});
      hm_sheet(x,tt,w("ticket","registrar's",-0.4),1040,150,760,{kick:"Owns what the two words mean",title:"The registrar's office"},{col:LP.green});
      hm_sheet(x,tt,k0,1040,362,760,{kick:"A ticket, from Jun Park",title:"Students or learners: which number do we publish?"},{col:LP.blue,out:k1});
      hm_glossary(x,1040,362,760,{a:ag_in(tt,g0,0.35),k:tt-g0,light:"day",u:[ag_in(tt,g0+0.3,0.5),ag_in(tt,g0+0.9,0.5)],owner:ag_in(tt,g0+1.5,0.5)});
      hm_tag(x,tt,w("glossary","before",-0.3),null,1420,800,"Before a line of the model changes",{align:"center",col:LP.ink});}}
  ]);
  hm_kick(ctx,S,1);
});
/* ---------------------------------------------------------------- 6. One page: how we work together */
scene("page",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"},G=sc.start,tP=c.meet-0.7,tS=c.trust-0.6,tQ=c.gorge-0.5,tF=c.wall-0.6;
  ag_shots(ctx,S,t,sc.dur,[
    // Thursday 25 February: the eight of them, and a page still to write
    {at:0,place:"hmMorning",later:true,keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{
      hm_team(x,tt+G,{light:"morning"});
      hm_tag(x,tt,c.thu-0.2,null,960,170,"Thursday 25 February",{align:"center",col:LP.ink});
      hm_sheet(x,tt,w("thu","page",-0.5),600,222,720,{kick:"The data team",title:"How we work together",sub:"Five lines, in their own words"},{col:LP.blue,light:"morning"});}},
    // the page, line by line, as each is read out
    {at:tP,place:"hmMorning",later:true,keys:[[tP,960,540,1.0]],push:0,draw:(x,tt)=>{
      lp_person(x,HM_TOMAS,110,720,0.72,{t:tt+G,light:mo});lp_person(x,HM_ERIN,330,720,0.72,{t:tt+G,light:mo});
      lp_person(x,"helena",1590,720,0.72,{t:tt+G,flip:true,light:mo});lp_person(x,"jun",1810,720,0.72,{t:tt+G,flip:true,light:mo});
      hm_page(x,480,126,960,{light:"morning",a:ag_in(tt,tP+0.5,0.4),k:tt-tP-0.5,
        u:[ag_in(tt,c.meet-0.1,0.6),ag_in(tt,c.help-0.1,0.6),ag_in(tt,c.disagree-0.1,0.6),ag_in(tt,c.decide-0.1,0.6),ag_in(tt,c.date-0.1,0.6)]});}},
    // its last line is how trust is kept; what such a page is called, and how much is known about it
    {at:tS,place:"hmMorning",later:true,keys:[[tS,960,540,1.0]],draw:(x,tt)=>{
      hm_page(x,130,150,580,{light:"morning",body:false,hi:4,hiA:ag_in(tt,w("trust","last",-0.2),0.6)});
      hm_sheet(x,tt,w("trust","112",-0.4),780,150,1000,{kick:"112 studies · 7,763 teams",title:"Teams that trust each other do better work"},{col:LP.green,light:"morning"});
      hm_sheet(x,tt,w("charter","charter",-0.6),780,372,450,{kick:"Researchers call it",title:"A team charter"},{col:LP.blue,light:"morning"});
      hm_sheet(x,tt,w("charter","32",-0.4),1260,372,520,{kick:"32 student teams",title:"Held up best",lines:["A good charter","And a good plan"]},{light:"morning",u:hm_u(tt,[w("charter","good charter",-0.2),w("charter","good plan",-0.2)])});
      hm_tag(x,tt,w("small","one",-0.3),null,1520,716,"One small study",{align:"center",col:LP.amber});
      hm_tag(x,tt,w("small","practice",-0.7),null,1280,796,"The page comes from practice, not from a trial",{align:"center",col:LP.ink});}},
    // at the gorge the way is passed on by doing, parents beside children
    {at:tQ,place:"hmGorge",keys:[[tQ,600,474,1.9],[tQ+0.3,566,470,2.15]],d:7,dis:1.0,push:0,draw:(x,tt)=>{
      hm_banks(x,tt,{kids:1});
      hm_bridge(x,Object.assign({mid:cx=>{hm_walker(cx,HM_NEW,tt,0.08,tQ,0.03,3);hm_walker(cx,HM_NEW,tt,0.46,tQ,-0.028,6);}},HM_NEW));}},
    // Friday 26 February: the page, on the wall
    {at:tF,place:"hmFri",keys:[[tF,960,540,1.0]],dis:1.0,draw:(x,tt)=>{
      hm_page(x,480,116,960,{light:"late",pin:true});
      hm_tag(x,tt,w("wall","Friday",-0.2),null,1680,210,"Friday 26 February",{align:"center",col:LP.ink});
      hm_tag(x,tt,w("wall","wall",-0.4),null,1680,280,"On the wall",{align:"center",col:LP.green});}}
  ]);
  setScreen(ctx,S);
  hm_tag(ctx,t,w("gorge","passed",-0.4),tF-0.5,960,150,"Passed on by doing, parents beside children",{align:"center",col:LP.ink});
  hm_tag(ctx,t,w("gorge","team",-0.3),tF-0.5,960,810,"A team has no such years: so it writes",{align:"center",col:LP.blue});
  hm_kick(ctx,S,1);
});
/* ---------------------------------------------------------------- 7. Where the bridge stops */
scene("limits",(ctx,S,t,sc)=>{const c=sc.cues,e=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),G=sc.start,tB=c.line-0.5,tS=c.steel-0.5,tR=c.each-0.5;
  // ---- the bridge's years in one picture of the gorge: let go around 1970, fallen in March 2021, cut down in May 2025, and each
  // time woven again. One drawing of time, so the shots that only change the light (sun, grey, sun) show nothing twice
  const L0=w("lapse","steel",-0.5),L1=w("lapse","let",-0.3),R1=c.fell-1.9,P0=w("fell","pandemic",-0.2),F1=w("fell","fell",-0.5),N1=c.cut-2.2,D0=c.cut+0.1,C2=w("cut","cut",-0.2),A0=c.again-1.4,A1=c.again-0.4,Y=HM_NEW;
  const nightAt=tt=>ag_io(tt,D0,A0,1.1);
  const hist=(x,tt,cam)=>{
    // who is on the banks: there, gone while the bridge is let go, back, gone in 2020, back, away in the night, back
    const folk=(1-ag_in(tt,L1,1.5))+ag_in(tt,R1+0.2,0.9)*(1-ag_in(tt,P0,1.2))+ag_in(tt,N1+0.2,0.9)*(1-ag_in(tt,D0,0.9))+ag_in(tt,A0+0.4,0.9);
    hm_banks(x,tt,{a:clamp(folk,0,1)});
    hm_steel(x,{a:ag_in(tt,L0,0.9)});
    const sa=ag_io(tt,L0+0.6,c.fell-0.9,0.4);if(sa>0.004)hm_label(x,cam,946,286,()=>lp_tag(x,0,0,"The steel bridge",{align:"center",col:LP.ink,a:sa}));
    const walk=(q,t0,t1)=>cx=>{if(tt<t0||tt>t1)return;for(const [u0,dt,sp,who] of [[0.04,0,0.05,2],[0.96,2.6,-0.045,5],[0.04,6.2,0.05,7],[0.96,9.4,-0.05,1],[0.04,12.5,0.045,4]])hm_walker(cx,q,tt,u0,t0+dt,sp,who);};
    // until it is let go
    if(tt<L1+2.3){const k=ag_in(tt,L1,1.3),q={age:0.25+0.75*k,wear:0.5*k};hm_bridge(x,Object.assign({a:1-ag_in(tt,L1+1.1,1.1),mid:walk(q,0,L1-1.2)},q));}
    // made again; unmade in 2020; fallen in March 2021
    if(tt>=R1&&tt<F1){const k=ag_in(tt,P0+0.4,2.6),q={age:0.2+0.8*k,wear:0.55*k};hm_bridge(x,Object.assign({a:ag_in(tt,R1+0.1,0.9),mid:walk(q,R1+0.9,P0-0.6)},q));}
    if(tt>=F1&&tt<F1+6){hm_bridge(x,{age:1,wear:0.55,f:0,r:0,a:1-(tt-F1)/0.3});hm_fall(x,tt-F1,{age:1,drift:3});}
    // made again; cut down in the night, in May 2025
    if(tt>=N1&&tt<C2)hm_bridge(x,Object.assign({a:ag_in(tt,N1+0.2,0.9),mid:walk(Y,N1+1.1,D0-0.8)},Y));
    if(tt>=C2&&tt<C2+7){hm_bridge(x,Object.assign({},Y,{f:0,r:0,a:1-(tt-C2)/0.3}));hm_fall(x,tt-C2,{age:0,from:1,drift:3.5});}
    // and woven again: the cables, then the sides and the floor from both banks
    if(tt>=A1){const u=0.5*ag_sine((tt-A1-0.5)/2.4),m=Math.max(0,u-0.12)+0.12*ag_in(tt,A1+2.6,1.0);
      const fa=ag_in(tt,A1+0.4,0.5)*(1-ag_in(tt,A1+2.9,0.6)),far=walk(Y,A1+3.6,1e9);
      hm_bridge(x,Object.assign({a:ag_in(tt,A1,0.7),ties:[u,u],floor:[Math.max(0,u-0.03),Math.max(0,u-0.03)],mat:[m,m],mid:cx=>{
        if(fa>0.004)for(const [side,who] of [[0,0],[1,2]]){const uu=Math.max(0.045,u-0.028),q=hm_deck(side?1-uu:uu,Y);hm_fig(cx,q[0],q[1],50,{who,pose:"astride",flip:!!side,shadow:0,a:fa});}
        far(cx);}},Y));}
    // the night of May 2025
    const night=nightAt(tt);if(night>0.004){x.fillStyle="rgba(16,22,46,"+0.6*night+")";x.fillRect(-20,-20,W+40,H+40);}};
  const light=(at,place,dis)=>({at,place,keys:[[at,960,540,1.0]],dis,push:0,draw:hist});
  ag_shots(ctx,S,t,sc.dur,[
    light(0,"hmGorge"),light(c.lapse-0.3,"hmGorgeGrey",1.2),light(R1,"hmGorge",1.0),light(P0,"hmGorgeGrey",1.2),light(N1,"hmGorge",1.0),
    // the weaving is taught inside a builder's own family; fewer of the young speak the work's language
    {at:tB,place:"hmBank",keys:[[tB,960,540,1.0]],dis:1.0,draw:(x,tt)=>{
      lp_person(x,HM_PEOPLE.builder,560,640,0.9,{t:tt,light:HM_SUN});lp_person(x,HM_PEOPLE.builder2,1010,640,0.9,{t:tt,flip:true,light:HM_SUN});
      hm_tag(x,tt,w("line","taught",-0.4),null,785,190,"Taught only inside a builder's own family",{align:"center",col:LP.ink});
      hm_tag(x,tt,w("line","tradition",-0.6),null,785,258,"As their tradition asks",{align:"center",col:LP.mut});
      hm_tag(x,tt,c.quechua,null,1530,430,"Fewer of the young speak Quechua",{align:"center",col:LP.amber});
      hm_tag(x,tt,w("quechua","language",-0.4),null,1530,500,"The language of the work",{align:"center",col:LP.ink});}},
    // most people cross on the steel bridge now; and custom settles who does which part
    {at:tS,place:"hmGorge",keys:[[tS,960,540,1.0],[c.custom-1.3,620,470,1.9]],d:3.0,dis:1.0,push:0,draw:(x,tt,cam)=>{
      hm_banks(x,tt,{});hm_steel(x,{});
      const sa=ag_io(tt,w("steel","most",-0.3),c.custom-1.5,0.4);if(sa>0.004)hm_label(x,cam,946,286,()=>lp_tag(x,0,0,"Most people cross here now",{align:"center",col:LP.ink,a:sa}));
      hm_bridge(x,Object.assign({mid:cx=>{hm_walker(cx,Y,tt,0.1,tS,0.034,4);hm_walker(cx,Y,tt,0.97,tS+9,-0.03,1);}},Y));}},
    // a data team has to ask each person; and what Tomás knows is where anyone can read it
    {at:tR,place:"hmFri",keys:[[tR,960,540,1.0]],dis:1.0,push:0,draw:(x,tt)=>{const a0=w("each","ask",-0.3),k1=c.tomas-0.7,g0=w("tomas","glossary",-0.7),at={};
      HM_SEATS.forEach(([id],i)=>{at[id]=a0+0.2+i*0.3;});
      hm_team(x,tt+G,{light:"late"});
      hm_marks(x,tt,{a:ag_in(tt,c.each-0.1,0.4),at,col:{tomas:mix(LP.blue,LP.green,ag_in(tt,c.tomas,0.6))}});
      hm_pill(x,tt,a0,k1,960,210,"Ask each person",{col:LP.blue,size:36});
      hm_tag(x,tt,w("each","leave",-0.3),k1,960,304,"What the team knows: never with one person only",{align:"center",col:LP.ink});
      hm_say(x,78,384,"I ask\nto be asked.",170,{col:LP.blue,align:"left",a:ag_in(tt,c.tomas-0.1,0.35),k:tt-c.tomas+0.1});
      hm_glossary(x,600,84,840,{a:ag_in(tt,g0,0.35),k:tt-g0,light:"late"});
      hm_tag(x,tt,w("tomas","anyone",-0.3),null,1672,300,"Where anyone can read it",{align:"center",col:LP.green});}}
  ]);
  // words over the gorge, at the screen's own size
  setScreen(ctx,S);
  hm_tag(ctx,t,c.kept+0.3,w("kept","always",-0.9),960,150,"Still brings four communities together",{align:"center",col:LP.ink});
  hm_tag(ctx,t,w("kept","always",-0.4),c.lapse-0.6,960,150,"It hasn't always kept the bridge",{align:"center",col:LP.amber});
  [["Around 1970: let go, for a time",w("lapse","let",-0.5)],["2020: the pandemic stops the work",w("fell","pandemic",-0.4)],["March 2021: the bridge falls",w("fell","March",-0.2)],["May 2025: cut down in the night",w("cut","May",-0.2)]]
    .forEach(([s,t0],i)=>hm_tag(ctx,t,t0,tB-0.6,96,154+i*62,s,{col:LP.amber}));
  hm_pill(ctx,t,w("again","wove",-0.4),tB-0.6,1420,180,"Each time, woven again",{col:LP.green,icon:"tick"});
  hm_tag(ctx,t,w("steel","visitors",-0.3),c.custom-0.9,960,810,"Visitors help keep this one going",{align:"center",col:LP.ink});
  hm_tag(ctx,t,c.custom+0.1,c.judge-0.7,960,150,"Custom settles who does which part",{align:"center",col:LP.ink});
  [["Who makes the cord",w("custom","makes",-0.6)],["Who braids the cables",w("custom","braids",-0.6)],["Who may learn to weave",w("custom","learn",-0.8)]]
    .forEach(([s,t0],i)=>hm_tag(ctx,t,t0,c.judge-0.7,960,226+i*64,s,{align:"center",col:LP.mut}));
  hm_tag(ctx,t,w("judge","own",-0.5),tR-0.6,960,150,"The communities' own way: not ours to judge",{align:"center",col:LP.ink});
  hm_tag(ctx,t,w("judge","model",-0.6),tR-0.6,960,810,"Not a model for a data team",{align:"center",col:LP.ink});
  const nk=t<tB?nightAt(t):0;hm_kick(ctx,S,1-nk);hm_kick(ctx,S,nk,{light:"evening"});
});
/* ---------------------------------------------------------------- 8. On Monday */
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"},G=sc.start,tI=c.ivy-0.5,e0=c.breath+0.6;
  ag_shots(ctx,S,t,sc.dur,[
    // what to take: four things, and the bridge, made again each June
    {at:0,place:"hmMorning",later:true,keys:[[0,960,540,1.0]],draw:(x,tt)=>{const p0=w("read","bridge",-0.4),L={light:"morning"};
      hm_sheet(x,tt,c.write-0.1,110,140,860,{kick:"One",title:"Write one page together",sub:"In your own words"},Object.assign({col:LP.blue},L));
      hm_sheet(x,tt,c.open-0.1,110,386,860,{kick:"Two",title:"Disagree about the work, in the open",sub:"When it turns to the person: stop, and say so"},Object.assign({col:LP.blue},L));
      hm_sheet(x,tt,c.keep-0.1,110,632,860,{kick:"Three",title:"Keep small promises",sub:"And say early when you can't"},Object.assign({col:LP.green},L));
      hm_print(x,1105,158,640,{a:ag_in(tt,p0,0.4),k:tt-p0,light:"morning"});
      hm_tag(x,tt,w("read","June",-0.5),null,1425,580,"Made again each June",{align:"center",col:LP.ink});
      hm_sheet(x,tt,w("read","read",-0.4),1040,632,770,{kick:"Four",title:"Read your page again each quarter",sub:"And whenever someone joins"},Object.assign({col:LP.blue},L));}},
    // Monday 1 March: someone joins
    {at:tI,place:"hmMorning",later:true,keys:[[tI,960,540,1.0]],draw:(x,tt)=>{const d0=w("ivy","Ivy",-0.7),i0=w("ivy","opens",-0.5),n0=c.next-0.1,g=1-ag_in(tt,e0,0.8);if(g<=0.004)return;x.save();x.globalAlpha*=g;
      hm_door(x,1150,316,280,600,0.78*ag_sine((tt-d0)/1.5));
      lp_person(x,"helena",330,650,0.9,{t:tt+G,light:mo});
      hm_page(x,610,150,520,{light:"morning",body:false,pin:true});
      lp_person(x,"ivy",1640,650,0.9,{t:tt+G,flip:true,light:mo,a:ag_in(tt,i0,0.6)});
      hm_tag(x,tt,w("ivy","Monday",-0.3),null,1626,190,"Monday 1 March 2027",{align:"center",col:LP.ink});
      hm_tag(x,tt,i0+0.5,n0-0.5,1626,262,"Ivy Reyes, a new graduate",{align:"center",col:LP.ink});
      hm_tag(x,tt,n0,null,1626,262,"Next: Many hats, one picture",{align:"center",col:LP.blue});
      hm_pill(x,tt,c.take-0.1,null,870,750,"Agree how you work together",{col:LP.blue});
      hm_pill(x,tt,w("take","keep",-0.3),null,870,830,"Keep to it",{col:LP.green});x.restore();}}
  ]);
  lp_end(ctx,S,t,e0,HM_TITLE,HM_LAST,"Film 4 of 4","People first");
  hm_kick(ctx,S,1-ag_in(t,e0,0.8),{light:"morning"});
});

// chapters that open in the room the one before ends in: the camera glides on, and only what changes fades
ag_cutInto(["who","number","three","turn","page","monday"]);
