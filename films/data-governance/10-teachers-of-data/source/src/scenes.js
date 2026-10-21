/* ===== Teachers of data: the eight chapters =====
   Each chapter is a few shots cut together with short dissolves (gv_shots): the first at a crossing in Bogotá (plan.js), the others in
   the university's own rooms (the series' rooms.js). Times inside a chapter come from its cues (when each line starts) and the words of
   its lines (wAt), so the pictures stay with the voice if it's recorded again. Words on screen are on paper, screens, boards, tags and
   speech bubbles, at least 28 px as seen, and above the captions. */

// made once per chapter, the first time it draws: its cues are known by then
const tt_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
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
function tt_panelAt(ctx,i,P,x,y,a,s){if(a<=0.01)return;const img=tt_panelImg(i,P),w=520,h=380;ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.rotate([-0.025,0.015,-0.01][i]);
  withA(ctx,a,()=>{wc_panel(ctx,-w/2-18,-h/2-18,w+36,h+96,{kind:"card",seed:200+i});ctx.drawImage(img,-w/2,-h/2,w,h);gv_pin(ctx,0,-h/2-6,[GV.red,GV.gold,GV.green][i],1.2);
    wc_wash(ctx,wc_ell(-w/2+22,h/2+40,22,22,24),wc_lit(GV.goldInk,0.1),{kind:"thing",lw:1.2,seed:140+i});wc_T(ctx,String(i+1),-w/2+22,h/2+50,{w:800,size:28,align:"center",col:[255,255,255]});
    wc_T(ctx,TT_PANEL[i].label,-w/2+60,h/2+51,{w:700,size:32,col:WC_DARK});});ctx.restore();}

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

["today","beside","each","warn","measured","teach","lasts"].forEach(id=>scene(id,(ctx,S,t,sc)=>{setScreen(ctx,S);ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_paperOver(ctx,S);}));
