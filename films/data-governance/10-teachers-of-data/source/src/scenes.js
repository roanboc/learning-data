/* ===== Teachers of data: the eight chapters =====
   Each chapter is a few shots cut together with short dissolves (gv_shots): the first at a crossing in Bogotá (plan.js), the others in
   the university's own rooms (the series' rooms.js). Times inside a chapter come from its cues (when each line starts) and the words of
   its lines (wAt), so the pictures stay with the voice if it's recorded again. Words on screen are on paper, screens, boards, tags and
   speech bubbles, at least 28 px as seen, and above the captions. */

// made once per chapter, the first time it draws: its cues are known by then
const tt_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// the crossing's moments, for the panels painted from it, wherever they're pinned up
const tt_P=()=>{const sc=SCENES.find(q=>q.id==="crossing");return tt_once(sc,"P",()=>tt_crossCues(sc));};
// a tag that springs in at t0 and goes at t1 (or stays)
function tt_tagAt(ctx,t,t0,t1,x,y,s,o){const a=t1==null?fin(t,t0,0.35):gv_io(t,t0,t1,0.35);if(a<=0.01)return;const k=0.9+0.1*spring(fin(t,t0,0.5));
  ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,a,()=>wc_tag(ctx,0,0,s,Object.assign({align:"center"},o||{})));ctx.restore();}
// the year and the place in the top corner: the latest one passed, dissolving from the one before
function tt_pill(ctx,t,mk,a){if(a<=0.01)return;let i=0;for(let k=1;k<mk.length;k++)if(t>=mk[k][0])i=k;const u=i>0?fin(t,mk[i][0],0.35):1;
  if(u<1)wc_year(ctx,56,72,mk[i-1][1],a*(1-u));wc_year(ctx,56,72,mk[i][1],a*u);}

// ---- 1 · The mime before the fine: Bogotá, 1995, and a year on ----
// the chapter's moments, from its cues and words
function tt_crossCues(sc){const c=sc.cues,w=(id,s)=>wAt(sc,id,s);
  return{amber:c.b95+0.2,red:c.b95+1.5,drivers:w("stop","drivers stop"),zebra:w("stop","zebra"),weave:w("stop","weave"),mayor:c.mayor,mimes:w("mayor","mimes"),whistleLine:c.whistle,around:w("whistle","around"),
    whistle:w("whistle","whistle"),mimeLine:c.mime,steps:w("mime","steps"),word:w("mime","without a word"),invites:w("mime","invites"),backUp:w("mime","back up"),fineLine:c.fine,
    wont:w("fine","still won't"),officer:w("fine","a traffic officer"),writes:w("fine","writes"),applaud:w("fine","applaud"),last:c.last,cameLast:w("last","came last"),
    order:w("last","an order"),y96:c.y96,three:w("y96","three drivers"),most:c.most,understand:w("most","understand"),around2:w("most","the people around"),fewLine:c.few,
    few:w("few","few"),breath:c.breath};}
// a whistle and a clap, drawn over the person who does them
const tt_whistling=(t,t0,t1)=>t>t0&&t<t1?(x,X,Y,k)=>tt_whistleMarks(x,X,Y,k,t,gv_io(t,t0,t1,0.3)):null;
const tt_clapping=(t,t0,t1,ph)=>{if(t<=t0||t>=t1)return{};const a=gv_io(t,t0,t1,0.25),m=0.5+0.5*Math.sin((t-t0)*TAU*2.6+(ph||0)),e=clamp((m-0.72)/0.28,0,1);
  return{pose:"tt_clapA",pose2:"tt_clapB",mix:m*a,marks:(x,X,Y,k)=>tt_clapMarks(x,X,Y,k,e,a)};};
// a pose blended in at t0 and out at t1
const tt_doing=(t,t0,t1,pose,d)=>({pose2:pose,mix:gv_io(t,t0,t1,d||0.35)});

// 1995: the light turns red; three cars roll up and stop on the stripes, and people weave between them and away along our pavement; four
// mimes come down the side street; the people whistle, and one car backs off; a mime bows to the next driver and shows him the way back;
// the third driver won't move, the mime shrugs, and an officer writes a fine, to applause
function tt_world95(t,P){const people=[],cars=[];
  const lamp=tt_lampAt(t,[[0,2],[P.amber,1],[P.red,0]]);
  // the cars: two pass while the light is still green or amber; three roll up and stop on the stripes. Drivers look at the mime, or away
  const C=[{m:"hatch",col:TT_PAINT.red,d:12.25,pass:true,X1:-24,t1:0,v:12},{m:"box",col:TT_PAINT.green,d:5.25,pass:true,X1:-32,t1:0,v:13},
    {m:"hatch",col:TT_PAINT.mustard,d:12.25,X1:-1.6,t1:P.drivers-0.2,v:9,moves:[[P.whistle+0.1,P.whistle+2.4,-6.0]],drv:"ttDrv3",
      ex:()=>t>P.around?"worried":"calm",look:()=>["tt_lookL",gv_io(t,P.around,P.whistle+2.6,0.3)]},
    {m:"box",col:TT_PAINT.cream,d:8.75,X1:-2.36,t1:P.drivers+0.4,v:9,drv:"ttDrv2",ex:()=>t>P.wont-0.7?"ttStern":"calm",
      look:()=>t<P.wont-0.7?["tt_lookR",gv_io(t,P.steps,P.backUp+2.2,0.4)*0.6]:["tt_lookL",gv_io(t,P.wont-0.7,P.applaud+2,0.4)]},
    {m:"sedan",col:TT_PAINT.blue,d:5.25,X1:-1.66,t1:P.zebra+0.3,v:10,moves:[[P.backUp+0.3,P.backUp+2.3,-6.4]],drv:"ttDrv1",
      ex:()=>t>P.invites+0.8&&t<P.backUp+2.6?"ttLaugh":t>P.word-0.3?"worried":"calm",look:()=>["tt_lookR",gv_io(t,P.steps-0.6,P.backUp+2.4,0.4)]}];
  for(const k of C){const r=tt_drive(t,k);if(r.X>40||r.X<-60)continue;const lk=k.look?k.look():[null,0];
    cars.push({m:k.m,col:k.col,X:r.X,d:k.d,o:{wheel:r.wheel,brake:r.brake,reverse:r.reverse,driver:k.drv?tt_driver(k.drv,{pose:"tt_nod",pose2:lk[0],mix:lk[1],expr:k.ex?k.ex():"calm",t}):null}});}
  // the far pavement, both sides of the side street: people who whistle at the cars on the stripes and clap when the fine is written,
  // and two who only watch, under an umbrella or at the corner
  const wh0=P.around-0.3,wh1=P.whistle+1.8,cl0=P.applaud-0.3,cl1=P.applaud+2.4;
  const stand=[["ttGrey",-5.8,15.9,"tt_lips",0.3],["ttFlatCap",-4.6,15.5,"tt_whistle",1.1],["ttLong",-3.6,15.0,"tt_lips",2.0],["ttWorker",-2.8,16.2,"tt_whistle",2.9],
    ["ttCurly",11.8,15.3,"tt_whistle",0.7],["ttSpecs",13.2,15.9,"tt_lips",1.6]];
  stand.forEach(([id,X,d,wp,ph])=>{const cl=tt_clapping(t,cl0,cl1,ph);people.push({id,X,d,o:Object.assign({t,pose:"stand"},tt_doing(t,wh0+ph*0.1,wh1,wp),
    wp==="tt_lips"&&t>wh0&&t<wh1?{expr:"ttWhistle"}:{},{marks:tt_whistling(t,wh0+0.3+ph*0.1,wh1)},cl)});});
  people.push({id:"ttBun",X:0.9,d:15.7,o:{t,pose:"tt_umbrella",umbrella:[178,62,58]}});
  // three weave between the stopped cars, and go off along our pavement: one with a bag, one under an umbrella (round the cars' backs),
  // a student
  [["ttBag",[[2.55,14.7],[2.9,13.1],[2.8,10.1],[3.1,6.7],[2.95,3.3],[3.6,0.6],[7.2,-1.5],[12.5,-1.8]],P.drivers+0.1,1.5,{pose:"tt_bag",carry:tt_heldBag([196,120,80]),keep:true}],
    ["ttSuit",[[0.3,14.8],[-2.3,13.4],[-3.1,10.0],[-2.9,7.4],[-2.3,3.6],[-1.4,0.6],[-4.8,-1.4],[-9.5,-1.8]],P.drivers+0.4,1.6,{pose:"tt_umbrella",umbrella:[44,44,52],keep:true}],
    ["ttStudent",[[2.0,14.8],[3.2,13.0],[3.35,10.0],[3.5,6.8],[3.2,3.2],[4.2,0.4],[7.8,-1.0],[13.2,-1.4]],P.drivers+0.9,1.6,{}]]
    .forEach(([id,pts,t0,v,o])=>people.push({id,d:0,walk:tt_path(t,t0,pts,v),o:Object.assign({t},o)}));
  // the mimes come down both pavements of the side street, out of the distance, and take their places at the kerb; the one nearest the
  // crossing bows to everyone
  const M=[["ttMime2",[[1.5,31],[1.5,16.0],[-0.9,15.0]],P.mimes-4.4],["ttMime1",[[2.1,32.5],[2.1,16.2],[2.4,14.9]],P.mimes-4.0],
    ["ttMime3",[[0.8,33.5],[0.8,16.4],[-2.0,15.4]],P.mimes-4.2],["ttMime4",[[12.9,31.5],[12.9,16.6],[12.3,15.1]],P.mimes-3.6]];
  M.forEach(([id,pts,t0],i)=>{let w=tt_path(t,t0,pts,2.3);const o=Object.assign({t},i!==1?tt_clapping(t,cl0+0.15*i,cl1,0.9*i):{}),a=fin(t,t0,0.6);
    if(i===0){const b0=w.end+0.2;o.bow=gv_io(t,b0,b0+1.0,0.35);if(o.bow>0)Object.assign(o,{pose:"tt_bow"});}
    if(i===1){// steps out to the first car's front, bows to the driver and shows him the way back, behind the line; bows his thanks as
      // the car goes; then to the next car, which won't move: a shrug, and he steps aside for the officer
      const w2=tt_path(t,P.steps-4.2,[[2.4,14.9],[3.25,4.3]],2.4);if(t>P.steps-4.2)w=w2;
      const w3=tt_path(t,P.backUp+2.3,[[3.25,4.3],[2.6,7.4]],2.4);if(t>P.backUp+2.3)w=w3;const w4=tt_path(t,P.officer+1.1,[[2.6,7.4],[1.7,6.1]],1.6);if(t>P.officer+1.1)w=w4;
      const bw=gv_io(t,P.word-0.1,P.invites+0.4,0.35),th=gv_io(t,P.invites+0.1,P.backUp+0.6,0.35),os=0.5+0.5*Math.sin((t-P.invites-0.1)*TAU*0.7-Math.PI/2),
        thx=gv_io(t,P.backUp+1.2,P.backUp+1.9,0.3),at2=gv_io(t,w3.end,P.wont+0.6,0.3),sh=gv_io(t,P.wont+0.6,P.officer+1.0,0.3);
      o.pose=tt_mix("ttMime1",[["tt_after",Math.max(bw,th,at2)],["tt_after2",th*os],["tt_bow",thx],["shrug",sh]]);o.bow=Math.max(bw*0.7,thx);o.expr=sh>0.5?"calm":"smile";}
    people.push({id,d:0,walk:w,o,a});});
  // the officer comes in from the right and writes; the people clap
  const ow=tt_path(t,P.officer-0.9,[[8.6,7.8],[3.4,7.4]],2.6),wr=gv_io(t,Math.max(P.writes,ow.end+0.1),P.applaud+0.6,0.3);
  if(t>P.officer-1.1)people.push({id:"ttOfficer",d:0,walk:ow,o:Object.assign({t},wr>0?{pose:"stand",pose2:"write",mix:wr,carry:heldNotebook,look:1}:{carry:t>P.applaud?tt_heldShut:null})});
  for(const q of people)if(q.walk)q.d=q.walk.d;
  return{lamp,cars,people};}

// 1996: four cars at the light, three behind the line and one over it; people cross on the stripes and go off along our pavement; the
// mime and the people beside him nod to each other; the officer, by the car over the line, writes the one fine and shuts his notebook;
// then the light turns green
function tt_world96(t,P){const people=[],cars=[],go=P.breath+0.5;
  const lamp=tt_lampAt(t,[[0,0],[go,2]]);
  [["hatch",TT_PAINT.red,1.75,-6.0,P.y96+0.4,"ttDrv3"],["box",TT_PAINT.green,5.25,-6.0,P.y96+0.9,"ttDrv1"],["sedan",TT_PAINT.beige,8.75,-3.66,P.y96+1.3,"ttDrv2"],["hatch",TT_PAINT.blue,12.25,-6.1,P.y96+0.6,null]]
    .forEach(([m,col,d,X1,t1,drv],i)=>{const r=tt_drive(t,{X1,t1,v:8,moves:[[go+0.3+i*0.25,"go"]]});if(r.X>40)return;
      cars.push({m,col,X:r.X,d,o:{wheel:r.wheel,brake:r.brake,driver:drv?tt_driver(drv,{pose:"tt_nod",t}):null}});});
  // waiting at the kerb; the two beside the mime nod with him
  const nod=gv_io(t,P.around2-0.2,P.fewLine,0.4),pitch=nod*(0.5+0.5*Math.sin((t-P.around2)*TAU*0.8));
  [["ttSpecs",-5.6,15.5],["ttBag",-4.4,15.8,{pose:"tt_bag",carry:tt_heldBag([150,110,170])}],["ttFlatCap",-3.2,15.3,{pose2:"tt_lookR",mix:nod,pitch}],["ttGrey",-2.0,15.6,{pose2:"tt_lookR",mix:nod,pitch}],
    ["ttCurly",13.2,15.6],["ttMime3",2.4,16.4]].forEach(([id,X,d,o])=>people.push({id,X,d,o:Object.assign({t,pose:"stand"},o||{})}));
  // three cross on the stripes and go off along our pavement
  [["ttLong",[[1.75,15.0],[1.85,1.0],[-3.6,-1.2],[-9.0,-1.6]],P.y96+0.2,1.45],["ttWorker",[[2.3,15.1],[2.4,0.8],[7.2,-1.2],[13.0,-1.6]],P.y96+0.7,1.45],["ttStudent",[[2.65,15.0],[2.8,1.2],[7.8,-0.8],[14.0,-1.2]],P.y96+1.2,1.5]]
    .forEach(([id,pts,t0,v])=>people.push({id,d:0,walk:tt_path(t,t0,pts,v),o:{t}}));
  people.push({id:"ttMime2",X:-0.9,d:15.0,o:{t,pose:"stand",pose2:"tt_lookL",mix:nod,pitch,expr:"smile"}});
  const wr=gv_io(t,P.y96+1.6,P.few-0.25,0.35);people.push({id:"ttOfficer",X:1.0,d:8.0,o:{t,pose:"stand",pose2:"write",mix:wr,carry:wr>0.5?heldNotebook:tt_heldShut,look:wr>0.5?1:0}});
  for(const q of people)if(q.walk)q.d=q.walk.d;
  return{lamp,cars,people};}

// the three panels, each painted once from the scene, closer: the people around whistling, the mime's open palms, the officer's notebook
const TT_PANEL=[{key:"around",label:"the people around",box:[240,290,740,655]},{key:"mime",label:"the mime",box:[690,300,1450,850]},{key:"fine",label:"the fine, last",box:[800,300,1440,770]}];
function tt_panelImg(i,P){const B=TT_PANEL[i],T=[P.whistle,P.invites+0.82,P.writes+0.9][i],w=520,h=380;return wc_kept("ttPanel"+i,w,h,q=>{const [x0,y0,x1,y1]=B.box,k=Math.max(w/(x1-x0),h/(y1-y0));
  q.save();q.scale(k,k);q.translate(-(x0+x1)/2+w/2/k,-(y0+y1)/2+h/2/k);q.drawImage(gv_place("bogotaMid"),0,0,W,H);tt_drawWorld(q,TT_CAM.mid,tt_world95(T,P));q.restore();});}
// a panel pinned up: paper, its picture, a pin, its number and its words
// (o.lab: the size of its words, larger on Yusuf's board, where the panels are smaller)
function tt_panelAt(ctx,i,P,x,y,a,s,o){o=o||{};if(a<=0.01)return;const img=tt_panelImg(i,P),w=520,h=380,ls=o.lab||32,r=ls*0.69;ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.rotate([-0.025,0.015,-0.01][i]);
  withA(ctx,a,()=>{wc_panel(ctx,-w/2-18,-h/2-18,w+36,h+96,{kind:"card",seed:200+i});ctx.drawImage(img,-w/2,-h/2,w,h);gv_pin(ctx,0,-h/2-6,[GV.red,GV.gold,GV.green][i],1.2);
    wc_wash(ctx,wc_ell(-w/2+r,h/2+40,r,r,24),wc_lit(GV.goldInk,0.1),{kind:"thing",lw:1.2,seed:140+i});wc_T(ctx,String(i+1),-w/2+r,h/2+40+ls*0.31,{w:800,size:ls*0.875,align:"center",col:[255,255,255]});
    wc_T(ctx,TT_PANEL[i].label,-w/2+2*r+16,h/2+40+ls*0.34,{w:700,size:ls,col:WC_DARK});});ctx.restore();}

scene("crossing",(ctx,S,t,sc)=>{const P=tt_once(sc,"P",()=>tt_crossCues(sc)),cutMid=P.whistleLine-0.2;
  const mid95=(x,tt)=>tt_drawWorld(x,TT_CAM.mid,tt_world95(tt,P)),wide96=(x,tt)=>tt_drawWorld(x,TT_CAM.wide,tt_world96(tt,P));
  const i=gv_shots(ctx,S,t,sc.dur,[
    // Bogotá, 1995: the avenue from a first-floor window; the light turns red, the cars stop on the stripes, people weave between them;
    // then closer to the far pavement as the mimes come round the corner
    {at:0,place:"bogota",keys:[[0,960,540,1],[P.mayor-0.6,860,600,1.42]],d:2.6,push:0,draw:(x,tt)=>tt_drawWorld(x,TT_CAM.wide,tt_world95(tt,P))},
    // from the pavement, close to the people at the kerb: the whistles, and the first car backs off; then the mime steps in and shows the
    // next driver back; the third won't move; the fine; then back to the people at the kerb, who applaud
    {at:cutMid,place:"bogotaMid",keys:[[cutMid,740,480,1.35],[P.steps-1.4,1010,580,1.2],[P.wont-0.6,930,540,1.22],[P.applaud-0.9,738,470,1.3]],d:1.8,push:0,draw:mid95},
    // the three panels
    {at:P.last-0.3,keys:[[0,960,540,1]],push:0,draw:(x,tt)=>{x.fillStyle=rgba(WC_PAPER,1);x.fillRect(0,0,W,H);
      [P.last+0.1,P.last+0.9,P.cameLast-0.1].forEach((t0,j)=>tt_panelAt(x,j,P,[380,960,1540][j],420,fin(tt,t0,0.4),0.94+0.06*spring(fin(tt,t0,0.6))));
      const o=fin(tt,P.order,0.5);if(o>0)withA(x,o,()=>{x.strokeStyle=rgba(WC_PENCIL,0.7);x.lineWidth=4;x.lineCap="round";for(const ax of [670,1250]){x.beginPath();x.moveTo(ax-26,766);x.lineTo(ax+26,766);x.moveTo(ax+12,754);x.lineTo(ax+26,766);x.lineTo(ax+12,778);x.stroke();}});}},
    // 1996: four cars wait at the light, three behind the line
    {at:P.y96-0.3,place:"bogota",keys:[[P.y96-0.3,960,520,1.04]],push:0.02,draw:(x,tt)=>{wide96(x,tt);}},
    // closer: people cross on the stripes; the mime and the people beside them nod; the officer shuts his notebook
    {at:P.most-0.3,place:"bogotaMid",keys:[[P.most-0.3,960,520,1.02],[P.few-0.8,860,500,1.16]],d:2.0,push:0,draw:(x,tt)=>tt_drawWorld(x,TT_CAM.mid,tt_world96(tt,P))},
    // the light turns green, and the cars go
    {at:P.breath,place:"bogota",keys:[[P.breath,960,540,1]],push:0.02,draw:wide96}],0.6);
  setScreen(ctx,S);
  // tags over the picture, in the frame's own coordinates
  if(i===3)tt_tagAt(ctx,t,P.three-0.4,P.most-0.35,960,190,"1996 · three drivers in four keep the crossing clear",{size:34});
  if(i===4){tt_tagAt(ctx,t,P.understand,null,1340,250,"they understand it",{size:32});tt_tagAt(ctx,t,P.around2,null,560,250,"the people around keep it",{size:32});
    tt_tagAt(ctx,t,P.few-0.2,null,960,340,"the fine is for the few",{size:32,role:"amber"});}
  tt_pill(ctx,t,[[0,"Bogotá · 1995"],[P.y96-0.3,"Bogotá · 1996"]],(1-gv_io(t,P.last-0.3,P.y96-0.3,0.4))*(1-fin(t,P.breath+1.0,0.6)));
  gv_title(ctx,S,t,P.breath+1.2,"Teachers of data","why people keep a rule","Film 10 of 19 · data governance");
  wc_paperOver(ctx,S);});

// ---- the university: what the chapters share ----
// the floor: the people at work behind the glass, as the first film drew them (o.out leaves someone out, o.pose changes what someone is
// doing), then the glass, then the offices' names (a name the frame would cut fades out)
const TT_AT={clara:0,mei:1,yusuf:2,jun:3,sam:4},TT_WORK={clara:{pose:"reach"},mei:{pose:"hold",carry:heldNotebook},yusuf:{pose:"write",carry:heldNotebook},jun:{pose:"reach"},sam:{pose:"phone"}};
function tt_floor(x,tt,o){o=o||{};const F=GV_FL;Object.keys(TT_AT).forEach(id=>{const i=TT_AT[id];if((o.out||[]).includes(id))return;
    person(x,id,F.spot(i),806,0.5,Object.assign({pose:"stand",t:tt,flip:i%2===1},TT_WORK[id],(o.pose||{})[id]||{}));});
  gv_floorGlass(x);const m=x.getTransform(),vl=-m.e/m.a,vr=(x.canvas.width-m.e)/m.a,a=o.names==null?1:o.names;
  F.rooms.forEach((r,i)=>{const cx=F.x(i)+F.w/2,hw=tw(x,r[1],30,800)/2+6;gv_floorName(x,i,a*clamp(Math.min(cx-hw-vl,vr-cx-hw)/30,0,1));});}
// a green tick in a small round wash, springing in
function tt_tickBadge(x,cx,cy,r,u,seed){if(u<=0.01)return;const k=0.85+0.15*spring(clamp(u,0,1));x.save();x.translate(cx,cy);x.scale(k,k);
  withA(x,clamp(u*3,0,1),()=>{wc_wash(x,wc_ell(0,0,r,r,24),wc_lit(GV.green,0.15),{kind:"thing",lw:1.2,seed:seed||150});wc_tick(x,1,-1,r*1.15,[255,255,255],clamp(u*2-0.3,0,1),Math.max(3,r*0.19));});x.restore();}
// a nod: the head dips and lifts, now and then, between t0 and t1
const tt_nodAt=(tt,t0,t1,ph)=>0.06*Math.max(0,Math.sin((tt-t0)*TAU*0.9+(ph||0)))*gv_io(tt,t0,t1,0.3);
// a card held up in one hand, to pin it up
function tt_heldCard(cx,P_,hands){const h=hands[1];cx.save();cx.translate(h[0]+10,h[1]-34);cx.rotate(-0.12);cx.fillStyle="rgba(60,50,40,0.2)";cx.fillRect(-60,-30,128,72);
  cx.fillStyle="#fffdf6";cx.fillRect(-64,-36,128,72);cx.fillStyle=rgba(WC_MUTED,0.45);cx.fillRect(-40,-10,80,6);cx.fillRect(-30,8,60,6);cx.restore();fingers(cx,P_,[h]);}
// Yusuf's office, and what changes in it over the film: his board's content, small (o.board, as tt_govBoard takes it); the framed score
// (o.frame, 1 on the wall, 0 taken down; o.glow; o.ghost, where it hung); the measures there (o.ms); the shelf (o.bind); binder 29 open on
// the desk (o.desk29); the in-tray (o.tip; o.tray false once it's gone); the box (o.box, as tt_box takes it); the card on the door
// (o.door). Small type is drawn on purpose (o.read lists what this shot reads, and is left to the legibility check)
function tt_office(x,tt,o){o=o||{};const r=o.read||[];tt_govBoard(x,GV_OFF.board,o.board||{},{deco:true});
  const fr=o.frame==null?1:o.frame;if(fr>0.01)tt_frame(x,GV_OFF.score[0],GV_OFF.score[1],fr,o.glow||0,!r.includes("frame"));if(o.ghost)tt_frameGhost(x,o.ghost);
  if(o.ms)tt_measures(x,o.ms,true);tt_binders(x,o.bind||{});if(o.desk29)tt_deskBinder(x,o.desk29);if(o.tray!==false)tt_tray(x,o.tip||0,!r.includes("tray"));
  if(o.box)tt_box(x,o.box,!r.includes("box"));tt_doorCard(x,o.door||0,!r.includes("door"));}
// Yusuf's board, close: where the film keeps what it has found (tt_govBoard, at the size of the close-up)
const tt_boardClose=(x,st)=>tt_govBoard(x,GV_BC,st);

// ---- 2 · Submission day: the two reports agree; Mei sends; the checks worked because people knew why; the fines come last ----
scene("today",(ctx,S,t,sc)=>{const c=sc.cues,P=tt_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{move:c.sends+0.7,sub:w("agree","The submission"),cen:w("agree","census report"),agree:w("agree","agree:"),count:w("agree","counted"),m:c.mei-0.5,
      gold:w("mei","the government's"),down:w("mei","written down"),send:c.helped-1.7,fl:c.helped-0.4,helped:w("helped","helped"),knew:w("helped","knew why"),
      of:c.fines-0.5,bc:w("fines","the checks")-0.6,checks:w("fines","the checks"),before:w("before","before")};});
  const F=GV_FL,cy=F.top+250;
  // the two reports' cards on the glass: Planning's turns over to the new count, the submission's comes in; both ticked, and joined
  const cards=(x,tt)=>{tt_glassCard(x,0,fin(tt,0.4,0.5),["census report","4,812 awards"],{flip:clamp((tt-P.cen-0.2)/0.6,0,1),back:["census report","4,867 awards"]});
    tt_glassCard(x,1,fin(tt,P.sub-0.1,0.45),["submission","4,867 awards"]);
    for(const i of [0,1])tt_tickBadge(x,F.x(i)+F.w-30,cy+4,24,fin(tt,P.agree+0.15*i,0.45),160+i);
    tt_arc(x,F.x(0)+F.w/2,cy-6,F.x(1)+F.w/2,cy-6,64,clamp((tt-P.count+0.3)/0.9,0,1),GV.gold,5);};
  gv_shots(ctx,S,t,sc.dur,[
    // the floor where the work is done; then closer, on Planning's glass and the registrar's
    {at:0,place:"floor",keys:[[0,960,540,1],[P.move,640,456,1.5]],d:2.4,push:0,draw:(x,tt)=>{tt_floor(x,tt,{});cards(x,tt);}},
    // Mei's desk: the submission on her screen, how it maps, and who decided; the decision's card; Send, and Sent
    {at:P.m,place:"registrarClose",keys:[[P.m,1010,520,1.04],[P.m+0.1,1030,510,1.08]],d:5,draw:(x,tt)=>{const sent=fin(tt,P.send+0.35,0.4);
      tt_dropCard(x,915,476,320,150,["decided","written down"],clamp((tt-P.down+0.25)/0.9,0,1));
      gv_behind(x,"mei",GV_RX.seat[0],GV_RX.top,GV_RX.seat[1],{pose:"listen",t:tt,expr:sent>0.5?"smile":"calm",nod:tt_nodAt(tt,P.send+0.5,P.fl,0.4)});
      x.drawImage(gv_place("registrarDesk"),0,0,W,H);
      tt_meiScreen(x,{gold:fin(tt,P.gold-0.1,0.6),press:gv_io(tt,P.send,P.send+0.4,0.15),sent});}},
    // the floor: a tick on each office's glass where the work is done; and the people look up, and nod
    {at:P.fl,place:"floor",keys:[[P.fl,960,540,1]],push:0.02,draw:(x,tt)=>{const pose={};
      ["clara","mei","jun","sam","yusuf"].forEach((id,k)=>pose[id]={pose2:"listen",mix:fin(tt,P.knew-0.2+0.1*k,0.5),nod:tt_nodAt(tt,P.knew+0.1*k,P.of+0.6,k)});
      tt_floor(x,tt,{pose});cards(x,99);[0,1,3,4].forEach((i,k)=>tt_tickBadge(x,F.x(i)+F.w-26,F.top+56,20,fin(tt,P.helped-0.2+0.3*k,0.45),170+i));}},
    // Yusuf's office: he takes a card to his board
    {at:P.of,place:"office",keys:[[P.of,960,500,1.24],[P.of+0.1,940,490,1.28]],d:3,draw:(x,tt)=>{tt_office(x,tt,{board:{panel:[1,1,1]},box:{}});
      person(x,"yusuf",1180,905,0.8,{pose:"listen",pose2:"tt_pin",mix:fin(tt,P.of+0.6,0.7),t:tt,flip:true,carry:tt_heldCard});}},
    // his board, close: the three panels from Bogotá; under the fine, "the checks"; under the other two, a pencilled question
    {at:P.bc,place:"boardGov",keys:[[P.bc,1000,340,1.6],[P.before-0.5,760,340,1.6]],d:2.0,push:0,draw:(x,tt)=>tt_boardClose(x,{
      lit:[0,0,fin(tt,P.checks-0.4,0.6)*(1-0.6*fin(tt,P.before-0.3,0.6))],B:[0,0,fin(tt,P.checks+0.1,0.4)],q:[fin(tt,P.before-0.15,0.35),fin(tt,P.before+0.25,0.35),0]})}]);
  wc_year(ctx,56,72,"Today",fin(t,0.3,0.5)*(1-fin(t,P.m,0.4)));
  wc_paperOver(ctx,S);});

// ---- 3 · A page beside the check: Anil is stopped, and shown how; governance's queue becomes office hours ----
// something carried in both hands while walking (a laptop): the arms stay, the legs step
POSE.tt_carry={L:[0.16,-2.05],R:[0.16,-2.05],feet:24,shift:0,tilt:0,turn:0.06,gaze:[0.3,0.1],look:0};
POSE.tt_carryA=Object.assign({},POSE.tt_carry,{feet:14,shift:-5,tilt:0.03});POSE.tt_carryB=Object.assign({},POSE.tt_carryA,{shift:5,tilt:-0.03});
function tt_carrier(x,id,w,y,s,carry,o){person(x,id,w.x,y-w.bob,s,Object.assign({pose:"tt_carry",pose2:w.moving?(w.swing>0?"tt_carryA":"tt_carryB"):null,mix:Math.abs(w.swing),flip:w.flip,carry},o||{}));}
// the adviser's printed call list, held low over the desk in one hand; and her pose holding it
POSE.tt_list={L:[0.13,-0.1],R:[0.3,-1.0],hand:"open",feet:26,shift:3,tilt:0.02,turn:0.2,gaze:[0.6,0.1],look:0};
function tt_heldList(cx,P_,hands){const h=hands[1];cx.save();cx.translate(h[0]+36,h[1]-46);cx.rotate(0.06);cx.fillStyle="rgba(60,50,40,0.2)";cx.fillRect(-56,-70,120,150);
  cx.fillStyle="#fffdf6";cx.fillRect(-60,-76,120,150);cx.fillStyle=rgba([70,96,140],0.8);cx.fillRect(-50,-66,100,10);cx.fillStyle=rgba(WC_MUTED,0.45);
  for(let i=0;i<8;i++){cx.fillRect(-50,-46+i*14,62,5);cx.fillRect(18,-46+i*14,32,5);}cx.restore();fingers(cx,P_,[h]);}
// Yusuf's hand to the tray on his desk, to tip it
POSE.tt_tray={L:[0.13,-0.1],R:[1.0,1.3],hand:"open",feet:32,shift:6,tilt:-0.05,turn:0.3,gaze:[0.8,0.5],look:1};

scene("beside",(ctx,S,t,sc)=>{const c=sc.cues,P=tt_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{add:w("adds","adds a column"),stops:w("adds","stops"),sc:c.no-0.6,link:w("no","say no"),page:w("says","a page"),parts:[w("what","what the rule"),w("what","why"),w("what","how to"),w("what","who to")],
      two:c.two,bc:c.mime-0.5,nomime:w("mime","no mime"),of:c.queue-0.5,tip:c.queue+1.3,go:c.queue+2.7,hours:w("hours","office hours"),anyone:w("hours","anyone")};});
  const clockM=tt=>14+2*easeCam(clamp((tt-P.two-0.6)/1.0,0,1)),pin=P.go+1.95,back=pin+1.3;
  gv_shots(ctx,S,t,sc.dur,[
    // the faculty's office: Anil at his desk; an adviser stops by with the printed call list; his change on the screen, and the check's red
    {at:0,place:"faculty",keys:[[0,960,540,1],[P.add+0.3,860,470,1.18]],d:3,draw:(x,tt)=>{const X=GV_FX,top=X.top,wk=gv_walk(tt,0.5,-160,180,300),ask=gv_io(tt,2.2,P.add+0.6,0.35);
      tt_clock(x,1250,180,60,clockM(tt));
      gv_behind(x,"ttAdviser",wk.x,top,1.7,{standing:true,pose:wk.moving?"stand":"tt_list",pose2:wk.moving?(wk.swing>0?"walkA":"walkB"):null,mix:Math.abs(wk.swing),t:tt,carry:tt_heldList,expr:"smile"});
      gv_behind(x,"anil",X.seat[0],top,X.seat[1],{pose:"listen",t:tt,flip:true,nod:tt_nodAt(tt,3.6,5.4,0),expr:tt>P.stops+0.2?"concerned":"calm"});
      x.drawImage(gv_place("facultyDesk"),0,0,W,H);
      tt_onScreen(x,X.screen,q=>tt_anilScreen(q,{add:fin(tt,P.add,0.5),check:fin(tt,P.stops,0.4)}),true);
      gv_say(x,250,140,["which school?"],196,440,{a:ask,k:0.92+0.08*spring(fin(tt,2.2,0.5))});}},
    // the screen, close: the check's message, its link; the page it links; the line Anil types, and the tick
    {at:P.sc,place:"screenFac",keys:[[P.sc,960,470,1.04],[P.two-0.6,1000,480,1.04]],d:2,push:0,draw:(x,tt)=>{
      tt_clock(x,1760,190,92,clockM(tt));const open=fin(tt,P.page-0.1,0.7)*(1-fin(tt,P.two-0.3,0.5));
      tt_onScreen(x,GV_SC,q=>tt_anilScreen(q,{add:1,check:1,link:fin(tt,P.link-0.1,0.5),page:open,lit:j=>fin(tt,P.parts[j]-0.1,0.4),
        typed:clamp((tt-P.two-0.1)/1.1,0,1),ok:fin(tt,P.two+1.6,0.6)}));}},
    // Yusuf's board: the mime lights; under it, a page beside every check
    {at:P.bc,place:"boardGov",keys:[[P.bc,760,340,1.6]],push:0.02,draw:(x,tt)=>tt_boardClose(x,{lit:[0,fin(tt,P.nomime-0.4,0.6),0],B:[0,fin(tt,P.nomime+0.1,0.4),1],q:[1,1-fin(tt,P.nomime-0.1,0.3),0]})},
    // his office: the in-tray of forms awaiting approval, tipped into the box marked retired; a card on his door; two people come with
    // their laptops, and he waves them in
    {at:P.of,place:"office",keys:[[P.of,800,640,1.4],[P.go+0.2,640,560,1.3],[back+0.2,700,560,1.22]],d:1.8,draw:(x,tt)=>{
      const tip=clamp((tt-P.tip)/1.1,0,1),forms=clamp((tt-P.tip-0.6)/0.6,0,1),w1=gv_walk(tt,P.go,1000,420,300),w2=gv_walk(tt,back,420,760,300),
        lw=gv_walk(tt,P.anyone-0.6,-150,300,260),tw_=gv_walk(tt,P.anyone-0.2,-180,500,300);
      tt_office(x,tt,{board:{lit:[0,0,0],B:[0,1,1],q:[1,0,0]},tip,box:{forms},door:fin(tt,pin+0.25,0.5),read:["tray","box","door"]});
      if(tt<P.go)person(x,"yusuf",1000,905,0.8,{pose:"listen",pose2:"tt_tray",mix:gv_io(tt,P.tip-0.6,P.tip+1.0,0.4),t:tt,flip:true});
      else if(tt<back)gv_walker(x,"yusuf",w1,905,0.8,{t:tt,pose:w1.moving?null:"listen",pose2:w1.moving?null:"tt_pin",mix:gv_io(tt,pin-0.1,pin+0.9,0.3),flip:true});
      else gv_walker(x,"yusuf",w2,905,0.8,{t:tt,pose:w2.moving?null:"listen",pose2:w2.moving?null:"wave",mix:w2.moving?0:gv_io(tt,w2.end+0.1,sc.dur+1,0.4),flip:w2.moving?false:true,expr:"smile"});
      if(tt>P.anyone-0.7){tt_carrier(x,"leila",lw,905,0.8,tt_heldLaptop,{t:tt});tt_carrier(x,"tom",tw_,905,0.8,tt_heldLaptop,{t:tt});}}}]);
  tt_nameCard(ctx,1480,250,"Anil Kurian","Faculty of Health",gv_io(t,1.2,P.add-0.2,0.4));
  wc_paperOver(ctx,S);});

// ---- 4 · Each other: once a month the stewards meet, to bring what broke and what helped; Yusuf began with the few who wanted to ----
// Yusuf at the board, a marker in his hand; and a steward telling the one beside them something, a hand open
POSE.tt_marker={L:[0.14,-0.08],R:[0.3,-1.25],hand:"open",feet:26,shift:4,tilt:0.03,turn:0.2,gaze:[0.5,0],look:0};
POSE.tt_tell={L:[0.14,-0.08],R:[0.2,2.75],hand:"open",feet:26,shift:6,tilt:-0.08,turn:0.5,gaze:[1,0.1],look:0};
// and the one listening: turned to them, the head a little on one side
POSE.tt_hear={L:[0.14,-0.08],R:[0.1,0.05],feet:26,shift:-4,tilt:0.08,turn:0.5,gaze:[1,0],look:0};
// the stewards, in their seats from the left, each with where they look after the data
const TT_STEW=[["mei","Mei","registrar's office"],["leila","Leila","admissions"],["tom","Tom","short courses"],["clara","Clara","Planning"],["anil","Anil","Faculty of Health"]];
// the meeting room: the screen (o.faces; o.title, the month), the whiteboard (o.board, as tt_meetBoard takes it), the stamp's box on the windowsill; Yusuf by the
// board (o.yusuf, his options, or false; o.yx where he stands); the stewards at the table (o.pose(j), each one's options), and their names on cards (o.tent(j))
// (o.yusuf a function draws him itself); the board's notes and the calendar are small from here, so only the close-ups read them, and
// the stamp and the cards only where o.read names them
function tt_meeting(x,tt,o){o=o||{};const M=GV_MT,rd=o.read||[];if(o.screen!==false)tt_meetScreen(x,{faces:o.faces,pose:o.fpose,title:o.title},tt);
  tt_deco(true,()=>{if(o.board)tt_meetBoard(x,o.board);tt_calendar(x,o.cal||{});});tt_stampBox(x,!rd.includes("stamp"));
  if(typeof o.yusuf==="function")o.yusuf(x);else if(o.yusuf!==false)person(x,"yusuf",o.yx||200,905,M.s,Object.assign({pose:"tt_marker",t:tt,carry:tt_heldMarker},o.yusuf||{}));
  TT_STEW.forEach(([id],j)=>gv_behind(x,id,M.seats[j],M.top,M.s,Object.assign({pose:"listen",t:tt,flip:j>=3},o.pose?o.pose(j):{})));
  x.drawImage(gv_place("meetingTable"),0,0,W,H);tt_deco(!rd.includes("tents"),()=>TT_STEW.forEach(([id,n,r],j)=>tt_tent(x,M.seats[j],n,r,o.tent?o.tent(j):1)));}

scene("each",(ctx,S,t,sc)=>{const c=sc.cues,P=tt_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o),t0=w("meet","the people")+0.1,h0=w("bring","what broke")-0.15,h1=w("bring","what helped")-0.15;
    return{t0,dt:(w("meet","faculty")+0.3-t0)/4,ap:c.approve-0.5,bz:c.bring-0.4,h:[h0,h1],n:[h0+0.75,h0+1.15,h1+0.8,h1+1.3,h1+1.8],wc:c.few-0.35,
      few:w("few","the few")+0.1,oth:c.joined+0.2,fac:w("joined","working")-0.6,cr:c.crossing+0.2,lit:w("crossing","the crossing")-0.2,
      col:w("crossing","colleagues")+0.1,rm:w("crossing","long before")-0.4};});
  const named=j=>P.t0+j*P.dt;
  gv_shots(ctx,S,t,sc.dur,[
    // the meeting room: the stewards at the table, each named as the camera comes to them; then, on the windowsill, the box Yusuf's
    // stamp lives in, shut
    {at:0,place:"meeting",keys:[[0,960,540,1],[1.8,960,575,1.5],[P.ap,1240,545,1.5]],d:2.2,push:0,draw:(x,tt)=>tt_meeting(x,tt,{read:["tents","stamp"],tent:j=>fin(tt,named(j),0.45),
      pose:j=>({expr:tt>named(j)?"smile":"calm",nod:tt_nodAt(tt,named(j),named(j)+1.1,0)})})},
    // the whiteboard, close: what broke, what helped; a note under one or the other as each of them speaks
    {at:P.bz,place:"meetZ",keys:[[P.bz,700,430,1.4]],push:0.02,draw:(x,tt)=>tt_inZ(x,TT_Z.board,q=>{
      tt_meetBoard(q,{heads:j=>clamp((tt-P.h[j])/0.7,0,1),note:j=>fin(tt,P.n[j],0.5)});tt_stampBox(q,true);})},
    // Yusuf's board: who he asked to the first meeting, the few who came ticked, then the others; then the crossing's first panel lights,
    // and under it, the stewards
    {at:P.wc,place:"boardGov",keys:[[P.wc,1240,380,1.6],[P.cr,760,340,1.6]],d:2.2,push:0,draw:(x,tt)=>tt_boardClose(x,{lit:[fin(tt,P.lit,0.6),0,0],B:[fin(tt,P.col,0.4),1,1],
      q:[1-fin(tt,P.col-0.2,0.3),0,0],who:{a:fin(tt,P.wc+0.3,0.5),tick:j=>j<2?fin(tt,P.few+0.45*j,0.4):fin(tt,P.oth+0.45*(j-2),0.4),fac:clamp((tt-P.fac)/0.9,0,1)}})},
    // the room again: the faculties who joined light on the screen; and round the table, the stewards tell each other things
    {at:P.rm,place:"meeting",keys:[[P.rm,1060,575,1.5]],push:0.02,draw:(x,tt)=>{const turn=a=>gv_io(tt,P.rm+a,sc.dur+1,0.5);
      tt_meeting(x,tt,{read:["tents"],faces:j=>fin(tt,P.rm+0.4+0.4*j,0.5),board:{heads:1,note:()=>1},pose:j=>[
        {pose2:"tt_tell",mix:turn(0.9)},{flip:true,pose2:"tt_hear",mix:turn(1.1),expr:"smile",nod:tt_nodAt(tt,P.rm+1.6,sc.dur,0.3)},
        {pose2:"tt_hear",mix:turn(1.5),expr:"smile",nod:tt_nodAt(tt,P.rm+2.1,sc.dur,1.1)},{pose2:"tt_tell",mix:turn(1.3)},
        {pose2:"tt_hear",mix:turn(1.7),nod:tt_nodAt(tt,P.rm+2.4,sc.dur,2)}][j]});}}]);
  wc_paperOver(ctx,S);});

// ---- 5 · Warn first: a new rule starts at the stewards' meeting; why, first; agreed and dated; it warns until then; the warnings go ----
// a guess at what a column holds, in a speech bubble: who's speaking, then what they'd count, its number rung in amber (ring)
function tt_guess(x,X,Y,name,pre,num,tx,ty,a,ring){if(a<=0.01)return;const s=pre+" "+num,w=Math.round(Math.max(tw(x,s,36,700),tw(x,name,28,600))+56),h=118,k=0.92+0.08*spring(clamp(a,0,1));
  x.save();x.translate(tx,ty);x.scale(k,k);x.translate(-tx,-ty);withA(x,clamp(a*2.5,0,1),()=>{const bx=clamp(tx,X+40,X+w-40);
    x.beginPath();x.moveTo(bx-18,Y+h-2);x.lineTo(tx,ty);x.lineTo(bx+18,Y+h-2);x.closePath();x.fillStyle=rgba(WC_CARD,1);x.fill();x.strokeStyle=rgba(WC_PENCIL,0.85);x.lineWidth=2;x.stroke();
    wc_panel(x,X,Y,w,h,{kind:"card",seed:Math.round(X+Y)});x.fillStyle=rgba(WC_CARD,1);x.fillRect(bx-15,Y+h-4,30,5);
    wc_T(x,name,X+28,Y+42,{w:600,size:28,col:WC_MUTED});wc_T(x,s,X+28,Y+94,{w:700,size:36,col:WC_DARK});
    if(ring>0.01)wc_ring(x,X+30+tw(x,pre+" ",36,700)+tw(x,num,36,700)/2,Y+81,22,27,ring,{col:TT_AMBER,lw:4});});x.restore();}
// Bogotá, a moment after the fine: the mime bows, and the officer, his notebook shut, touches his cap
function tt_worldBow(t,t0){const P0=tt_P(),Wd=tt_world95(P0.applaud+2.6+Math.max(0,t-t0),P0),b=gv_io(t,t0+0.4,t0+1.7,0.4),cap=gv_io(t,t0+1.0,t0+2.8,0.35);
  Wd.people.forEach(q=>{if(q.id==="ttMime1")q.o=Object.assign({},q.o,b>0?{pose:"tt_bow",pose2:null,bow:b,expr:"smile"}:{pose:"stand",pose2:null,bow:0,expr:"smile"});
    if(q.id==="ttOfficer")q.o=Object.assign({},q.o,{pose:"stand",pose2:"tt_cap",mix:cap,carry:tt_heldShutL,look:0});});return Wd;}

scene("warn",(ctx,S,t,sc)=>{const c=sc.cues,P=tt_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o),wr=w("brings","every column")-0.1;
    return{walk:1.0,pin:w("brings","Yusuf brings")-0.3,mz:wr-0.5,write:wr,wend:sc.ends.brings-0.2,why:c.why-0.3,col:w("why","First, why")+0.1,g1:w("why","will guess")-0.2,
      g2:w("why","two guesses")+0.1,two:w("why","two numbers"),rm:c.agree-0.4,up:w("agree","stewards")+0.2,dz:w("agree","set a date")-0.05,date:w("agree","date")-0.1,
      jz:c.warns-0.35,warn:w("warns","only warns")-0.2,link:w("links","links its page")-0.1,day:w("links","names the day"),cz:c.gone-0.6,wk:w("gone","Four weeks")-0.1,
      tick:w("nothing","nothing left"),bg:sc.ends.nothing+1.5,mime:w("mime","The mime"),fine:w("mime","before the fine"),bo:sc.ends.mime-0.3};});
  // the whiteboard as the chapter goes: the notes from before; the new rule pinned up and written; the column nobody described; its date
  const brd=tt=>({heads:1,note:()=>1,rule:fin(tt,P.pin+0.2,0.4),write:clamp((tt-P.write)/(P.wend-P.write),0,1),col:fin(tt,P.col,0.45),date:clamp((tt-P.date)/0.8,0,1)});
  const board=(x,tt)=>tt_inZ(x,TT_Z.board,q=>{tt_meetBoard(q,brd(tt));tt_deco(true,()=>tt_calendar(q,{}));tt_stampBox(q,true);});
  gv_shots(ctx,S,t,sc.dur,[
    // the meeting room: Yusuf brings a card to the board and pins it up
    {at:0,place:"meeting",keys:[[0,640,575,1.5]],push:0.02,draw:(x,tt)=>{const wk=gv_walk(tt,P.walk,200,300,140),pin=gv_io(tt,P.pin-0.45,P.pin+0.9,0.35);
      tt_meeting(x,tt,{board:brd(tt),faces:()=>1,read:["tents"],yusuf:q=>gv_walker(q,"yusuf",wk,905,GV_MT.s,{t:tt,pose:wk.moving?null:"tt_marker",pose2:wk.moving?null:"tt_pin",mix:pin,
        carry:tt<P.pin+0.3?tt_heldCard:tt_heldMarker})});}},
    // the whiteboard, close: the new rule written as it's said; then the column nobody described, and two readers' guesses at it
    {at:P.mz,place:"meetZ",keys:[[P.mz,1120,630,1.2],[P.why,960,540,1]],d:1.8,push:0,draw:(x,tt)=>{board(x,tt);
      tt_guess(x,960,196,"Clara","with microcredentials?","2",1420,356,fin(tt,P.g1,0.5),fin(tt,P.two,0.6));
      tt_guess(x,1250,372,"Anil","without?","1",1540,530,fin(tt,P.g2,0.5),fin(tt,P.two+0.25,0.6));}},
    // the room: hands go up round the table, and on the screen
    {at:P.rm,place:"meeting",keys:[[P.rm,960,560,1.15]],push:0.02,draw:(x,tt)=>{const up=j=>gv_io(tt,P.up+0.1*j,P.dz+0.8,0.22);
      tt_meeting(x,tt,{board:brd(tt),faces:()=>1,fpose:j=>({pose2:"tt_handUp",mix:up(j+5)}),pose:j=>({pose2:"tt_handUp",mix:up(j),expr:"smile"}),yx:300,
        yusuf:{expr:"smile",nod:tt_nodAt(tt,P.up+0.5,P.dz+0.5,0.5)}});}},
    // the board, close: the date, in gold
    {at:P.dz,place:"meetZ",keys:[[P.dz,1120,630,1.2]],push:0.02,draw:board},
    // Jun's screen in the data team's room: the check warns, links its page, names the day; the rules are still met; Jun describes it
    {at:P.jz,place:"screenData",keys:[[P.jz,960,470,1.04],[P.day+1.4,990,480,1.04]],d:2,push:0,draw:(x,tt)=>tt_onScreen(x,GV_SC,q=>tt_junScreen(q,{warn:fin(tt,P.warn,0.5),
      link:fin(tt,P.link,0.5),date:fin(tt,P.day,0.5),typed:clamp((tt-P.day-1.5)/1.6,0,1)}))},
    // the stewards' calendar: 1 December ringed; the weeks crossed off, the warnings left each week, down to none; a tick
    {at:P.cz,place:"calZ",keys:[[P.cz,960,540,1]],push:0.02,draw:(x,tt)=>tt_inZ(x,TT_Z.cal,q=>{tt_deco(true,()=>tt_meetBoard(q,brd(99)));
      tt_calendar(q,{off:k=>k<5?fin(tt,P.wk+0.62*k,0.5):0,tick:fin(tt,P.tick,0.5),ring:fin(tt,P.cz+0.6,0.8)});})},
    // Yusuf's board: the three panels light in turn, and under each, the new rule's step
    {at:P.bg,place:"boardGov",keys:[[P.bg,760,360,1.35]],push:0.02,draw:(x,tt)=>{const L=[P.mime-0.1,P.mime+0.45,P.fine];
      tt_boardClose(x,{lit:i=>fin(tt,L[i],0.4)*(1-0.55*fin(tt,L[i]+0.9,0.6)),B:[1,1,1],C:i=>fin(tt,L[i]+0.15,0.45),who:{a:1,tick:()=>1,fac:1}});}},
    // Bogotá, for a moment
    {at:P.bo,place:"bogotaMid",keys:[[P.bo,930,540,1.22]],push:0.02,draw:(x,tt)=>tt_drawWorld(x,TT_CAM.mid,tt_worldBow(tt,P.bo))}]);
  tt_nameCard(ctx,1640,250,"Jun Park","data team",gv_io(t,P.jz+0.4,P.cz-0.2,0.4));
  wc_year(ctx,56,72,"Bogotá · 1995",fin(t,P.bo+0.2,0.4));
  wc_paperOver(ctx,S);});

// ---- 6 · Measured by use: binder 29 says maturity is assessed every year, and nobody does; the score comes down; three measures from
//      the work go up where it hung ----
// both arms reaching one point (U out from the middle, V up from the feet, in Yusuf's units, the same for each hand), the elbows out:
// the angles person() takes
function tt_ik(U,V){const L1=108,L2=113,dx=U-62,dy=V+416,d=Math.min(Math.hypot(dx,dy),L1+L2-0.5),th=Math.atan2(dx,dy),al=Math.acos(clamp((L1*L1+d*d-L2*L2)/(2*L1*d),-1,1)),
    a0=Math.sin(th+al)>Math.sin(th-al)?th+al:th-al;return[a0,Math.atan2(dx-L1*Math.sin(a0),dy-L1*Math.cos(a0))];}
// Yusuf looking up at the frame; reaching a binder at his shoulder's height; his hands at the frame's lower corners, at V (tt_frameArms):
// raised to it, or low, carrying it (tt_holdLow, and its steps)
POSE.tt_up={L:[0.14,-0.08],R:[0.1,0.05],feet:26,shift:4,tilt:-0.06,turn:0.3,gaze:[0.6,-0.7],look:0};
POSE.tt_take={L:[0.13,-0.1],R:[0.75,1.96],hand:"open",feet:30,shift:6,tilt:-0.02,turn:0.3,gaze:[0.8,0.2],look:0};
const tt_frameArms=(V,o)=>{const a=tt_ik(100,V);return Object.assign({L:a,R:a.slice(),hand:"open",feet:26,shift:0,tilt:0,turn:0,gaze:[0,V<-500?-0.8:0.5],look:0},o||{});};
POSE.tt_holdLow=tt_frameArms(-205,{turn:0.06});
POSE.tt_holdLowA=Object.assign({},POSE.tt_holdLow,{feet:14,shift:-5,tilt:0.03});POSE.tt_holdLowB=Object.assign({},POSE.tt_holdLowA,{shift:5,tilt:-0.03});
// his board as it stands from here on: the three panels, the stewards and the new rule's steps, the who sheet
const TT_BRD6={B:[1,1,1],C:()=>1,who:{a:1,tick:()=>1,fac:1}};
// he lifts the frame down, his hands at its lower corners, carries it to the box, steps behind it and lets it in
function tt_takeDown(x,tt,P){const wk=gv_walk(tt,P.walk,1238,560,330),walking=tt>=P.walk,lw=clamp((tt-wk.end-0.05)/0.45,0,1),
    X=walking?wk.x:1238,Y=lerp(864,846,easeCam(clamp((tt-P.walk)/(wk.end-P.walk),0,1)))-wk.bob;
  tt_office(x,tt,{board:TT_BRD6,frame:tt<P.tc?1:0,ghost:fin(tt,P.tc+0.15,0.5),bind:{missing:28},tip:1,door:1,desk29:1,read:["frame"]});
  let o;if(!walking){POSE.tt_lower=tt_frameArms(lerp(-630,-205,easeCam(clamp((tt-P.dn)/0.6,0,1))));o={pose:tt_mix("tt_raise",[["listen",1],["tt_lower",fin(tt,P.fr,0.5)]]),t:tt};}
  else if(wk.moving)o={pose:"tt_holdLow",pose2:wk.swing>0?"tt_holdLowA":"tt_holdLowB",mix:Math.abs(wk.swing),flip:true,t:tt};
  else o={pose:"tt_holdLow",pose2:"listen",mix:fin(tt,wk.end+0.3,0.45),flip:true,t:tt,expr:"smile"};
  person(x,"yusuf",X,Y,0.8,o);
  if(tt>=P.tc&&lw<=0)tt_frameHeld(x,"yusuf",0.8,tt_handsAt("yusuf",X,Y,0.8,o),lerp(-10,6,fin(tt,P.dn,0.6)),false);
  tt_box(x,{forms:1,frame:lw},true);}
// the desk, from above: the green marker comes in, runs over the policy's line, writes under it, and goes
function tt_markUp(x,tt,P){const hi=clamp((tt-P.hi)/1.0,0,1),note=clamp((tt-P.nt)/1.35,0,1),st={hi,note};tt_open29(x,st);
  const L=(p,q,u)=>[lerp(p[0],q[0],u),lerp(p[1],q[1],u)],rest=[1640,980],a=tt_penAt29(x,{hi:0}),b=tt_penAt29(x,{hi:1}),n0=tt_penAt29(x,{hi:1,note:0.02}),n1=tt_penAt29(x,{hi:1,note:1});
  const pos=tt<P.hi?L(rest,a,easeCam(clamp((tt-P.hz)/(P.hi-P.hz),0,1))):tt<P.hi+1.0?tt_penAt29(x,{hi}):tt<P.nt?L(b,n0,easeCam(clamp((tt-P.hi-1.0)/(P.nt-P.hi-1.0),0,1))):
    tt<P.nt+1.35?tt_penAt29(x,st):L(n1,rest,easeCam(clamp((tt-P.nt-1.35)/0.4,0,1)));
  tt_pen(x,pos[0],pos[1],1);}

scene("measured",(ctx,S,t,sc)=>{const c=sc.cues,P=tt_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o),fr=c.nobody-0.35;
    return{two:w("score","two point one"),turn:c.binder-0.8,dk:c.binder+0.4,open:w("binder","twenty-nine")-0.1,fr,tc:fr+0.5,dn:fr+0.6,walk:fr+1.25,
      hz:c.work+0.3,hi:w("work","measured")-0.2,nt:w("work","the work")+0.1,wz:sc.ends.work+0.15,
      rows:[["an owner","a glossary term","a class","a description"].map(s=>w("project",s)-0.1),[w("run","which tests")-0.1,w("run","whose")-0.1],
        [w("people","office hours")-0.1,w("people","came back")-0.1]],run:c.run,ppl:c.people,of2:c.paper-0.15,used:w("paper","used")};});
  gv_shots(ctx,S,t,sc.dur,[
    // his office: the framed score glows as it's named; he turns to the shelf and takes binder 29 down
    {at:0,place:"office",keys:[[0,1182,470,1.3]],push:0.02,draw:(x,tt)=>{const got=tt>=P.turn+0.85;
      tt_office(x,tt,{board:TT_BRD6,glow:fin(tt,P.two-0.15,0.5)*(1-fin(tt,P.turn+0.3,0.6)),bind:got?{missing:28}:{out:28,u:fin(tt,P.turn+0.5,0.3)},tip:1,box:{forms:1},door:1,read:["frame"]});
      person(x,"yusuf",1500,905,0.8,{pose:"tt_up",pose2:"tt_take",mix:fin(tt,P.turn+0.05,0.45),t:tt,flip:tt<P.turn,wide:true,carry:got?tt_heldBinder29:null});}},
    // the desk, from above: binder 29, shut; it opens at its policy, and the camera goes to its line
    {at:P.dk,place:"desk",keys:[[P.dk,960,540,1],[P.open+0.75,1152,470,1.25]],d:1.8,push:0,draw:(x,tt)=>tt_opening29(x,clamp((tt-P.open)/0.8,0,1),{})},
    // the office: he lifts the frame down and carries it to the box marked retired
    {at:P.fr,place:"office",keys:[[P.fr,1060,500,1.25],[P.walk,760,520,1.25]],d:1.9,push:0,draw:(x,tt)=>tt_takeDown(x,tt,P)},
    // the desk again: the green marker over the policy's line, and what he writes under it
    {at:P.hz,place:"desk",keys:[[P.hz,1152,470,1.25]],push:0.02,draw:(x,tt)=>tt_markUp(x,tt,P)},
    // the wall where the frame hung: three sheets go up; each lights its rows as they're named, the camera moving down them
    {at:P.wz,place:"officeZ",keys:[[P.wz,960,540,1.2],[P.run-0.5,960,560,1.24],[P.ppl-0.5,960,610,1.3]],d:1.6,push:0,draw:(x,tt)=>tt_inZ(x,TT_Z.wall,q=>{tt_frameGhost(q,1);
      tt_measures(q,{up:i=>fin(tt,P.wz+0.45+0.25*i,0.45),row:(i,j)=>fin(tt,P.rows[i][j],0.4)},false);})},
    // the office: the frame in the box, on paper; then the three sheets, lit as they're named used, and Yusuf by them, nodding
    {at:P.of2,place:"office",keys:[[P.of2,790,560,1.3],[P.used-1.9,1170,430,1.3]],d:1.8,push:0,draw:(x,tt)=>{
      tt_office(x,tt,{board:TT_BRD6,frame:0,ghost:1,ms:{row:()=>1,glow:i=>fin(tt,P.used-0.1+0.15*i,0.5)},bind:{missing:28},tip:1,box:{forms:1,frame:1},door:1,desk29:1,read:["box"]});
      person(x,"yusuf",1440,905,0.8,{pose:"listen",t:tt,flip:true,expr:"smile",nod:tt_nodAt(tt,P.used,P.used+1.6,0)});}}]);
  wc_paperOver(ctx,S);});

// ---- 7 · Teachers of data: Yusuf's office hours; the wheel of data work, governance at its centre, each part with the films that teach
//      it; a new analyst's first weeks; and Anil shows a new colleague the page that helped him ----
// Tom, turned to what Yusuf shows him, leaning in a little; and Yusuf at the whiteboard, his marker up to it
POSE.tt_lookIn=Object.assign({},POSE.listen,{shift:5,tilt:0.07,turn:0.35,gaze:[0.85,0.45]});
POSE.tt_board={L:[0.14,-0.08],R:[1.5,2.9],feet:28,shift:4,tilt:-0.04,turn:0.35,gaze:[0.7,-0.5],look:0};
// the wheel as it's drawn and lit: the centre, the parts one by one, the gold lines in, then each part lit with its films (documents has
// none, and stays dark)
const tt_wheelAt=(tt,P)=>({centre:clamp((tt-P.c0)/0.8,0,1),part:k=>clamp((tt-P.p0-0.27*k)/0.5,0,1),joins:clamp((tt-P.j0)/0.9,0,1),
  lit:k=>k===5?0:fin(tt,P.l0+0.24*(k<5?k:k-1),0.45)});
// the stewards' calendar by now: the weeks crossed off, down to none, and the first of December ringed
const TT_CAL7={off:k=>k<5?1:0,tick:1,ring:1};
// Yusuf sketching on his clipboard for whoever is at his right (he faces them): the pen's hand where the sketch has got to (p), the
// other under the board; looking down at it, then up (up, 0 to 1), the pen lifted off it
function tt_sketcher(x,tt,X,p,up){POSE.tt_sk=Object.assign({},POSE.write,{L:tt_ik(...tt_skGrip(p,up)),R:[0.3,-1.6],feet:26,shift:2,tilt:lerp(0.05,-0.02,up),turn:0.3,
    gaze:[lerp(0.4,0.9,up),lerp(1,0.05,up)],look:1-up});
  person(x,"yusuf",X,905,0.8,{pose:"tt_sk",t:tt,flip:true,carry:tt_heldSketch(p,up),carryBehind:true,expr:up>0.5?"smile":"calm"});}
scene("teach",(ctx,S,t,sc)=>{const c=sc.cues,P=tt_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o),teach=w("day","It teaches");
    return{sk0:0.5,sk1:teach-0.5,teach,mt:c.centre-0.35,mz:w("centre","the centre")-0.1,c0:w("centre","the centre")+0.15,p0:w("centre","data work")-0.1,j0:w("centre","meets")-0.1,
      l0:w("fit","how the pieces")-0.2,fz:c.path-0.5,nc:w("path","new analyst")-0.15,sz:w("path","a path")-0.15,fl:w("path","short films")-0.05,lb:w("path","labs")-0.05,
      dn:w("path","practise")+0.15,az:c.pass-0.35,aw:c.pass-0.05,show:w("pass","Anil shows"),col:w("pass","a new colleague"),pz:w("pass","the page")-0.2,how:w("pass","the page")+0.25};});
  const sk=tt=>clamp((tt-P.sk0)/(P.sk1-P.sk0),0,1);
  gv_shots(ctx,S,t,sc.dur,[
    // office hours: the card on Yusuf's door; Tom, and Yusuf sketching for him on a clipboard; Yusuf looks up, and Tom nods
    {at:0,place:"office",keys:[[0,800,550,1.2],[1.3,900,560,1.35]],d:2.5,push:0,draw:(x,tt)=>{
      tt_office(x,tt,{board:TT_BRD6,frame:0,ghost:1,ms:{row:()=>1},tip:1,box:{forms:1,frame:1},door:1,read:["door"]});
      person(x,"tom",790,905,0.8,{pose:"tt_lookIn",t:tt,expr:tt>P.teach?"smile":"calm",nod:tt_nodAt(tt,P.teach+0.05,P.mt+1,0)});
      tt_sketcher(x,tt,1020,sk(tt),fin(tt,P.teach-0.35,0.5));}},
    // the stewards' meeting room: Yusuf at the whiteboard, and round the table, the stewards turned to it
    {at:P.mt,place:"meeting",keys:[[P.mt,900,560,1.2],[P.mt+0.1,640,520,1.45]],d:1.5,push:0,draw:(x,tt)=>tt_meeting(x,tt,{board:{wheel:tt_wheelAt(tt,P)},cal:TT_CAL7,
      faces:()=>1,title:"Stewards, November",yx:260,yusuf:{pose2:"tt_board",mix:fin(tt,P.mt+0.5,0.6)},pose:()=>({flip:true})})},
    // the whiteboard, close: the wheel he once found in a book, governance at its centre, the ten other parts round it, each named as it's
    // drawn, gold lines to the centre; then each part lit, with the films that teach it
    {at:P.mz,place:"meetZ",keys:[[P.mz,960,514,1.05]],push:0.03,draw:(x,tt)=>tt_inZ(x,TT_Z.board,q=>{tt_meetBoard(q,{wheel:tt_wheelAt(tt,P)});tt_deco(true,()=>tt_calendar(q,TT_CAL7));})},
    // the faculty's office, its other side: a new analyst at their desk, and on the screen, their first weeks
    {at:P.fz,place:"facultyB",keys:[[P.fz,960,540,1],[P.fz+0.1,900,520,1.12]],d:2.4,push:0,draw:(x,tt)=>{gv_behind(x,"ttNew",TT_FB.seat,GV_FX.top,1.7,{pose:"listen",t:tt});
      x.drawImage(gv_place("facultyDeskB"),0,0,W,H);tt_onScreen(x,TT_FB.screen,q=>tt_pathScreen(q,{}),true);}},
    // the screen, close: the films light as they're named, then the labs; week 1's are done
    {at:P.sz,place:"screenFac",keys:[[P.sz,960,470,1.04]],push:0.02,draw:(x,tt)=>tt_onScreen(x,GV_SC,q=>tt_pathScreen(q,{film:j=>fin(tt,P.fl+0.2*j,0.4),
      lab:j=>fin(tt,P.lb+0.2*j,0.4),done:fin(tt,P.dn,0.5)}))},
    // the office again: Anil comes over, and points at the screen, where the page that helped him opens (his arm is drawn again where
    // it reaches in front of the screen and the plant on the sill, which the desk's layer holds)
    {at:P.az,place:"facultyB",keys:[[P.az,1000,540,1.02]],push:0.03,draw:(x,tt)=>{const wk=gv_walk(tt,P.aw,2100,1765,300),
        anil=()=>gv_behind(x,"anil",wk.x,GV_FX.top,1.7,{standing:true,t:tt,flip:true,expr:"smile",pose:wk.moving?"stand":"listen",
          pose2:wk.moving?(wk.swing>0?"walkA":"walkB"):"point",mix:wk.moving?Math.abs(wk.swing):gv_io(tt,P.show-0.15,99,0.45)});
      anil();gv_behind(x,"ttNew",TT_FB.seat,GV_FX.top,1.7,{pose:"listen",t:tt,expr:tt>P.col?"smile":"calm",nod:tt_nodAt(tt,P.col+0.2,P.pz+0.6,0)});
      x.drawImage(gv_place("facultyDeskB"),0,0,W,H);tt_onScreen(x,TT_FB.screen,q=>tt_pathScreen(q,{done:1,page:fin(tt,P.show+0.3,0.7)}),true);
      x.save();x.beginPath();x.rect(1240,430,360,180);x.clip();anil();x.restore();}},
    // the screen, close: the page, Classify a column, and its How
    {at:P.pz,place:"screenFac",keys:[[P.pz,960,470,1.04],[P.pz+0.1,1010,500,1.08]],d:2.6,push:0,draw:(x,tt)=>tt_onScreen(x,GV_SC,q=>tt_pathScreen(q,{done:1,page:1,
      lit:j=>j===2?fin(tt,P.how,0.5):0}))}]);
  tt_nameCard(ctx,90,250,"New analyst","Faculty of Health, week 1",gv_io(t,P.nc,P.sz-0.1,0.4));
  wc_paperOver(ctx,S);});
scene("lasts",(ctx,S,t,sc)=>{setScreen(ctx,S);ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_paperOver(ctx,S);});
