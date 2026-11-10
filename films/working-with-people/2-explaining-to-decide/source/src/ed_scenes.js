/* ===== Explaining so people can decide: the chapters, shot by shot =====
   Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt), so the pictures stay with the voice if it's recorded
   again; the score (tools/score.py) takes the same words. In one room the camera glides and only what changes fades; a later moment in
   a room (later:true) lets what was there leave first; between rooms a shot dissolves, or cuts where the two show the same things.
   Sizes in the 1920 x 1080 frame. */

const ED_LAST="Lead with the decision; show what it turns on.";
// the film's number and title at the top left, from the second chapter on
function ed_kick(ctx,S,a){if(a<=0.004)return;setScreen(ctx,S);lp_kicker(ctx,"2","Explaining so people can decide",{a});}
// a sheet of words that springs in at t0 (and goes from o.out): lp_textSheet's words and options
function ed_sheet(ctx,t,t0,x,y,w,words,o){o=o||{};const a=ag_in(t,t0,0.35)*(o.out!=null?1-ag_in(t,o.out,0.4):1);if(a<=0.004)return null;
  return lp_textSheet(ctx,x,y,w,words,Object.assign({},o,{a,k:t-t0}));}
// lines that come in one by one, each at its own time: lp_textSheet's u
const ed_u=(t,ts)=>ts.reduce((s,t0)=>s+ag_in(t,t0,0.5),0)/ts.length;
// a tag that comes in at t0 and goes at t1 (null: stays)
function ed_tag(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);return a>0.004?lp_tag(ctx,x,y,text,Object.assign({},o,{a})):null;}
// a green tick in a disc, springing in from t0 (and going with a)
function ed_tick(ctx,t,t0,x,y,a){if(t<t0)return;const f=lerp(0.6,1,ag_spr(t-t0,0,0.5));ctx.save();ctx.globalAlpha*=ag_in(t,t0,0.3)*(a==null?1:a);ctx.fillStyle=rgba(LP.green,1);
  ctx.beginPath();ctx.arc(x,y,22*f,0,TAU);ctx.fill();lp_icon(ctx,"tick",x,y,30*f,[255,255,255]);ctx.restore();}
// a tag's width, to set a tick at its end
const ed_tagW=(ctx,text)=>lp_tw(ctx,text,{w:700,size:28})+52;
// things that fade together as one picture (a person behind a table): drawn whole on a canvas of their own first, then laid down at a
function ed_group(ctx,a,fn){if(a<=0.004)return;if(a>=0.996){fn(ctx);return;}const cv=ctx.canvas,[bc,bx]=ag_buf("edGroup",cv.width,cv.height);
  bx.setTransform(ctx.getTransform());try{fn(bx);}finally{bx.setTransform(1,0,0,1,0,0);}
  const ga=ctx.globalAlpha;ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=ga*a;ctx.drawImage(bc,0,0);ctx.restore();}
// the page and its picture, where they sit side by side: the page under the kicker on the left, the picture beside it on the right
const ED_PG={x:96,y:124},ED_PIC={x:1030,y:214,w:760,h:560,ch:54};
// the page's parts, all in (the University Council's page as Ivy finishes it); o adds or changes some
const ed_all=o=>Object.assign({decision:1,sign:1,answer:1,l1:1,l2:1,l3:1,meets:1,unknown:1,holds:1,words:1,which:1},o||{});
// the page drawn small (a copy, a print): its words are decoration there, read at full size before
function ed_pageSmall(ctx,x,y,s,o){ctx.save();ctx.translate(x,y);ctx.scale(s,s);const bb=ed_page(ctx,0,0,Object.assign({deco:true},o));ctx.restore();return bb;}
function ed_pictureSmall(ctx,x,y,s,o){ctx.save();ctx.translate(x,y);ctx.scale(s,s);const r=ed_picture(ctx,0,0,Object.assign({deco:true},o));ctx.restore();return r;}

/* ---------------------------------------------------------------- 1. No average pilot: 1950 to 1952 */
scene("pilot",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),lab={light:"day"},ofc={light:"morning"};
  // the drawing office's three sheets, pinned in a row: the average man, a door built to his height, a cockpit
  const P1={x:70,y:150,w:450,h:700},P2={x:560,y:150,w:620,h:700},P3={x:1220,y:150,w:630,h:700},HS=ed_heights(6),ORD=[2,5,0,3,1,4];
  // the count's ten steps, each on the word that says it: 1,055, 302, 143, 73, 28, 12, 6, 3, 2, and none
  const steps=tt=>[w("height","one",-0.1),w("chest","three",-0.1),w("fewer","hundred",-0.1),w("fewer","seventy",-0.1),w("fewer","twenty",-0.1),
    w("fewer","twelve",-0.1),w("fewer","six",-0.1),w("fewer","six",0.3),w("fewer","two",-0.1),w("none","not",-0.1)].map(t0=>ag_in(tt,t0,0.7));
  // Daniels at his desk, as one picture, so he can leave whole
  const daniels=(x,tt,a)=>ed_group(x,a,g=>{lp_person(g,ED_PEOPLE.daniels,400,610,1.0,{t:tt,light:ofc,cut:874});lp_table(g,90,880,640,{depth:90});});
  ag_shots(ctx,S,t,sc.dur,[
    // the measuring room, 1950: a flyer at the board, the measurer writing each figure on a card
    {at:0,place:"edLab",keys:[[0,1010,560,1.1],[0.4,960,540,1.0]],d:3,draw:(x,tt)=>{
      ed_board(x,632,150,1080,lerp(250,344,ag_in(tt,w("when","measured",-0.4),1.2)),1);
      lp_person(x,ED_PEOPLE.flyer,860,640,1.0,{t:tt,light:lab});
      lp_person(x,ED_PEOPLE.measurer,1450,650,1.0,{t:tt,flip:true,pose:"hold",hold:ed_card,light:lab});
      ed_sheet(x,tt,w("when","nineteen",-0.3),96,150,480,{kick:"1950",title:"The United States Air Force",lines:["More than 4,000 flyers measured","132 measurements each"]},
        {light:"day",out:c.why-0.4,u:ed_u(tt,[w("when","thousand",-0.2),w("when","hundred",-0.2)])});
      ed_sheet(x,tt,w("why","designed",-0.2),96,150,480,{kick:"The figures went to",title:"The designers",lines:["Flying suits","Helmets","Cockpits"]},
        {col:LP.blue,light:"day",u:ed_u(tt,[w("why","suits",-0.2),w("why","helmets",-0.2),w("why","cockpits",-0.2)])});}},
    // the designers' drawing office: the average man, a door built to his height, and a cockpit
    {at:c.avg-0.4,place:"edDraw",dis:1.6,keys:[[c.avg-0.4,860,540,1.12],[c.door-0.8,960,540,1.0]],draw:(x,tt)=>{
      const t1=c.avg+0.1,t2=c.door-0.3,t3=c.cockpit-0.3,a1=ag_in(tt,t1,0.35),a2=ag_in(tt,t2,0.35),a3=ag_in(tt,t3,0.35);
      if(a1>0.004){lp_sheet(x,P1.x,P1.y,P1.w,P1.h,{a:a1,k:tt-t1,col:LP.blue,light:"late"});x.save();x.globalAlpha*=a1;
        lp_T(x,"The average man",P1.x+40,P1.y+100,{w:800,size:40});lp_T(x,"About 5 ft 9 in",P1.x+40,P1.y+146,{w:600,size:28,col:LP.mut});
        ed_manikin(x,P1.x+190,P1.y+670,370,{a:ag_in(tt,w("avg","average",-0.2),0.8)});
        ed_dim(x,P1.x+360,P1.y+300,P1.y+670,null,{a:ag_in(tt,w("avg","five",-0.2),0.6)});x.restore();
        ed_tag(x,tt,w("easy","easiest",-0.1),null,P1.x+P1.w/2,P1.y+200,"The easiest to fit?",{align:"center"});
        ed_tag(x,tt,w("easy","commonest",-0.1),null,P1.x+P1.w/2,P1.y+264,"The commonest?",{align:"center"});}
      if(a2>0.004){const st=ag_in(tt,w("door","stoop",-0.7),0.9);lp_sheet(x,P2.x,P2.y,P2.w,P2.h,{a:a2,k:tt-t2,col:LP.blue,light:"late"});x.save();x.globalAlpha*=a2;
        lp_T(x,"A door built to his height",P2.x+40,P2.y+100,{w:800,size:40});
        ed_row(x,610,1130,820,{n:6,hs:HS,order:ORD,ppi:4.1,lintel:69,lintelU:ag_in(tt,w("door","doorway",-0.2),0.9),stoop:st,risk:st});x.restore();
        ed_tag(x,tt,w("door","half",-0.1),null,P2.x+P2.w/2,P2.y+200,"About half would stoop",{align:"center",col:LP.amber});}
      if(a3>0.004){lp_sheet(x,P3.x,P3.y,P3.w,P3.h,{a:a3,k:tt-t3,col:LP.blue,light:"late"});x.save();x.globalAlpha*=a3;
        lp_T(x,"In a cockpit",P3.x+40,P3.y+100,{w:800,size:40});
        ed_cockpit(x,1405,760,0.5,{lw:1.7,pilots:[{k:0.88}],reach:"switch",gaps:ag_in(tt,w("cockpit","reach",-0.3),0.6)});x.restore();
        ed_tag(x,tt,w("cockpit","control",-0.1),null,P3.x+P3.w/2,P3.y+150,"A control just out of reach",{align:"center",col:LP.amber});
        ed_tag(x,tt,w("cockpit","pedal",-0.1),null,P3.x+P3.w/2,P3.y+212,"A pedal too far away",{align:"center",col:LP.amber});}}},
    // Daniels's office, 1952: his question, the middle band he called average, his count, his note, and the range
    {at:c.daniels-0.4,place:"edOffice",dis:1.6,keys:[[c.daniels-0.4,960,540,1.0],[c.height-0.6,1080,520,1.06],[c.note-0.4,960,540,1.0]],draw:(x,tt)=>{
      const r0=c.range-0.2,slide=ag_sine(ag_in(tt,r0,1.6));
      daniels(x,tt,1-ag_in(tt,r0,0.8));
      ed_sheet(x,tt,w("daniels","Lieutenant",-0.2),960,170,780,{kick:"1952",title:"Lieutenant Gilbert Daniels",sub:"A scientist in the Air Force's anthropology section",lines:["How many flyers are average?"]},
        {light:"morning",out:c.ten-0.5,u:ag_in(tt,w("asked","plain",-0.1),0.5)});
      // on each measurement, the middle 30% counted as average: a generous band
      const k0=w("ten","ten",-0.2),cA=ag_in(tt,k0,0.35)*(1-ag_in(tt,c.height-1.0,0.4));
      if(cA>0.004){lp_sheet(x,960,170,860,620,{a:cA,k:tt-k0,col:LP.orange,light:"morning"});x.save();x.globalAlpha*=cA;
        lp_T(x,"TEN MEASUREMENTS",1000,240,{w:800,size:28,ls:3,col:LP.orange});lp_T(x,"Average: the middle 30%",1000,296,{w:800,size:40});
        ed_curve(x,1020,360,740,300,{u:ag_in(tt,k0+0.4,1.6),b:ag_in(tt,w("band","middle",-0.2),0.8)});
        lp_T(x,"A generous band",1390,724,{w:600,size:28,col:LP.mut,align:"center",a:ag_in(tt,w("band","generous",-0.2),0.5)});x.restore();}
      // the count: 4,063 flyers, fewer at each measurement, and none at the last
      const n0=c.height-0.4,nA=ag_in(tt,n0,0.35)*(1-ag_in(tt,c.note-0.7,0.4));
      if(nA>0.004){const st=steps(tt);lp_sheet(x,700,170,1140,640,{a:nA,k:tt-n0,col:LP.orange,light:"morning"});x.save();x.globalAlpha*=nA;
        lp_T(x,"DANIELS'S COUNT · 4,063 FLYERS",740,240,{w:800,size:28,ls:3,col:LP.orange});
        ed_dots(x,744,300,{steps:st,cols:79,pitch:8,r:2.9});ed_countTable(x,1420,300,{steps:st});x.restore();
        const p0=w("none","not",0.2);lp_pill(x,1060,508,"Average on all ten: not one",{col:LP.amber,a:nA*ag_in(tt,p0,0.4),k:tt-p0});}
      // his note: its first lines, the second sentence underlined; then it moves aside for the range
      const e0=c.note-0.2,eA=ag_in(tt,e0,0.35);
      if(eA>0.004)ed_note(x,lerp(960,100,slide),170,840,{a:eA,k:tt-e0,light:"morning",u:clamp((tt-w("note","virtually",-0.2))/(c.note+7.6-w("note","virtually",-0.2)),0,1)});
      const g0=w("range","range",-0.2),gA=ag_in(tt,g0,0.35);
      if(gA>0.004){lp_sheet(x,1000,170,820,600,{a:gA,k:tt-g0,col:LP.blue,light:"morning"});x.save();x.globalAlpha*=gA;
        lp_T(x,"WHAT A DESIGN TURNS ON",1040,240,{w:800,size:28,ls:3,col:LP.blue});lp_T(x,"The range",1040,296,{w:800,size:40});
        ed_range(x,1060,340,700,280,{b:ag_in(tt,w("range","five",-0.2),0.8)});x.restore();}
      const f9=w("range","nine",-0.1);lp_pill(x,1410,830,"Fits 9 flyers in 10",{col:LP.green,a:ag_in(tt,f9,0.4),k:tt-f9});}},
    // the drawing office again: a cockpit designed for the range, its seat and pedals moving to each pilot; a car's seat, for the same reason
    {at:c.fit-0.4,place:"edDraw",dis:1.6,keys:[[c.fit-0.4,960,540,1.0]],draw:(x,tt)=>{const f0=c.fit-0.1,a=ag_in(tt,f0,0.35),kk=1+0.1*Math.sin((tt-f0)*1.05),P=ed_fit(kk);
      lp_sheet(x,200,150,1520,700,{a,k:tt-f0,col:LP.blue,light:"late"});x.save();x.globalAlpha*=a;
      lp_T(x,"Fit the range, not the average",250,250,{w:800,size:40});
      ed_cockpit(x,500,740,0.6,{lw:1.4,pilots:[P],reach:"stick",seats:[P.dy],pedals:[P.pedal],eye:ag_in(tt,f0+0.8,0.6),arrows:ag_in(tt,w("adjust","rise",-0.3),0.6)});x.restore();
      ed_tag(x,tt,w("adjust","rise",-0.1),null,1240,380,"Seats that rise and fall",{col:LP.blue});
      ed_tag(x,tt,w("adjust","pedals",-0.1),null,1240,450,"Pedals that move",{col:LP.blue});
      const s9=w("seats","ninety",-0.2);lp_T(x,"By the 1970s",1450,540,{w:600,size:28,col:LP.mut,align:"center",a:ag_in(tt,s9,0.4)});
      lp_pill(x,1450,592,"The middle 90 in every 100",{col:LP.green,a:ag_in(tt,s9,0.4),k:tt-s9});
      const c0=w("car","seat",-0.3),cs=ag_in(tt,c0,0.4);if(cs>0.004){ed_carSeat(x,1470,790,0.6,{a:cs,slide:0.5-0.5*Math.cos((tt-c0)*1.6)});
        lp_T(x,"A car's seat",1300,800,{w:600,size:28,col:LP.mut,align:"right",a:cs});}}},
    // the team's room: one number that seems to say everything, opening into the week it hides
    {at:c.data-0.4,place:"edLate",dis:1.6,keys:[[c.data-0.4,960,540,1.0]],draw:(x,tt)=>{const f0=w("data","one",-0.2),s0=w("lead","show",-0.3),sp=ag_in(tt,s0,1.2);
      lp_figure(x,760,300,400,{kick:"Rooms booked",num:"38%",label:"The week's average"},{a:ag_in(tt,f0,0.35)*(1-sp),k:tt-f0,light:"late"});
      ed_picture(x,580,220,{a:sp*(1-0.6*ag_in(tt,c.breath,1.0)),k:tt-s0,u:ag_in(tt,s0+0.4,2.0),peak:ag_in(tt,w("lead","turns",-0.1),0.6),labels:ag_in(tt,w("lead","turns",0.3),0.5),light:"late"});}}
  ]);
  lp_title(ctx,S,t,c.breath+0.2,"Explaining so people can decide","The decision first, and the part of the data it turns on","Leading data people · Working with people");
});

/* ---------------------------------------------------------------- 2. One page for the University Council */
scene("page",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),gr={light:"grey"},dy={light:"day"};
  ag_shots(ctx,S,t,sc.dur,[
    // Graham's office: the decision he must make, the question agreed with him, the answer, and one page by Tuesday 1 June
    {at:0,place:"edGraham",keys:[[0,1000,540,1.06],[0.6,960,540,1.0]],d:2.4,draw:(x,tt)=>{
      ed_sheet(x,tt,w("uni","Graham",-0.1),1000,150,640,{kick:"Director of Facilities",title:"Graham Ellis"},{light:"grey",out:c.q-0.5});
      ed_sheet(x,tt,w("ask","Council",-0.2),1000,350,640,{kick:"For the University Council",title:"A new teaching building?",lines:["40 rooms","About A$140 million"]},
        {light:"grey",out:c.q-0.5,u:ed_u(tt,[w("ask","forty",-0.1),w("ask","hundred",-0.2)])});
      ed_tag(x,tt,w("full","always",-0.3),c.q-0.5,1000,700,"“The rooms are always full”");
      ed_sheet(x,tt,w("q","agreed",-0.2),1000,150,680,{kick:"Agreed in writing, February",title:"Too few rooms, or too few at some hours?"},{col:LP.blue,light:"grey"});
      const a0=w("april","answer",-0.1);lp_pill(x,1340,450,"Late April: too few, only at some hours",{col:LP.green,a:ag_in(tt,a0,0.4),k:tt-a0});
      ed_sheet(x,tt,w("june","one",-0.2),1000,540,640,{kick:"By Tuesday 1 June",title:"One page",sub:"For the University Council"},{col:LP.amber,light:"grey"});
      lp_person(x,"graham",520,650,1.0,{t:tt,light:gr});}},
    // the team's room: Ivy and Helena, the first draft in the order of the work, its first chart, and Helena's question
    {at:c.ivy-0.4,place:"lpRoom",dis:1.6,keys:[[c.ivy-0.4,960,540,1.0]],draw:(x,tt)=>{const d0=w("draft","twelve",-0.2),h0=c.who-0.4;
      ed_draft(x,216,140,{a:ag_in(tt,c.draft-0.2,0.35),u:ag_in(tt,d0,1.6),nine:ag_in(tt,w("draft","nine",-0.1),0.5)});
      ed_tag(x,tt,w("draft","data",-0.1),h0,392,320,"The data",{align:"center"});
      ed_tag(x,tt,w("draft","method",-0.1),h0,774,384,"The method",{align:"center"});
      ed_tag(x,tt,w("draft","checks",-0.1),h0,1084,384,"The checks",{align:"center"});
      ed_tag(x,tt,w("draft","answer",-0.1),h0,1260,320,"The answer, on page 9",{align:"center",col:LP.blue});
      const f0=w("chart","average",-0.3);lp_figure(x,760,440,400,{kick:"Page 1",num:"38%",label:"Rooms booked, the week's average"},{a:ag_io(tt,f0,c.thesis-0.4,0.35),k:tt-f0,light:"day"});
      ed_tag(x,tt,w("thesis","thesis",-0.2),h0-0.1,960,520,"How a thesis is written",{align:"center"});
      ed_tag(x,tt,w("thesis","nothing",-0.2),h0-0.1,960,590,"Nothing in it is wrong",{align:"center"});
      ed_sheet(x,tt,w("who","who",-0.2),770,440,520,{kick:"Helena asks",title:"Who will read it, and what will they decide with it?"},{col:LP.blue,light:"day"});
      lp_person(x,"ivy",560,700,1.0,{t:tt,light:dy});lp_person(x,"helena",1460,700,1.0,{t:tt,flip:true,light:dy});
      const n0=w("ivy","Ivy",-0.1),n1=w("ivy","Helena",-0.1),nOut=1-ag_in(tt,c.draft-0.6,0.4);
      lp_nameTag(x,760,790,"ivy",{a:ag_in(tt,n0,0.4)*nOut});lp_nameTag(x,1250,790,"helena",{align:"right",a:ag_in(tt,n1,0.4)*nOut});}}
  ]);
  setScreen(ctx,S);lp_sceneTag(ctx,"The university, 2027 · imagined",{a:ag_io(t,w("uni","university",-0.3),c.june,0.5)});
  ed_kick(ctx,S,ag_in(t,0.6,0.6));
});

/* ---------------------------------------------------------------- 3. The decision first */
scene("first",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  const PX=510,PY=124;
  ag_shots(ctx,S,t,sc.dur,[
    // the University Council's room before a meeting: a pile of papers at each place, a decision on each; the top one starts with its decision
    {at:0,place:"edCouncil",keys:[[0,960,540,1.0],[c.start-0.6,960,500,1.12]],d:2.2,draw:(x,tt)=>{const p0=w("pile","pile",-0.4);
      ed_councilTable(x,140,800,1640);
      [300,620,960,1300,1620].forEach((px,i)=>ed_pile(x,px-110,792,{n:lerp(2,i===2?22:14+i%2*3,ag_sine(ag_in(tt,p0+i*0.25,2.4))),w:220}));
      ed_tag(x,tt,w("pile","decide",-0.1),c.start-0.4,960,520,"A decision on each",{align:"center"});
      const l0=w("start","decision",-0.5),u=ag_sine(ag_in(tt,l0,1.4));
      if(u>0.004){x.save();x.translate(960,lerp(640,400,u));x.scale(lerp(0.3,1,u),lerp(0.3,1,u));ed_page(x,-450,-100,{p:{decision:1},h:200,a:ag_in(tt,l0,0.3),light:"day",pin:false,deco:u<0.985});x.restore();}}},
    // the team's room, late: Minto's pyramid; then the page, written top down, its method moved to the back
    {at:c.minto-0.4,place:"edLate",dis:1.6,keys:[[c.minto-0.4,960,540,1.0]],draw:(x,tt)=>{
      const m0=w("minto","Barbara",-0.2),mA=ag_in(tt,m0,0.35)*(1-ag_in(tt,c.decision-0.7,0.4));
      if(mA>0.004){lp_sheet(x,560,150,800,640,{a:mA,k:tt-m0,col:LP.blue,light:"late"});x.save();x.globalAlpha*=mA;
        lp_T(x,"BARBARA MINTO",600,220,{w:800,size:28,ls:3,col:LP.blue});lp_T(x,"The pyramid",600,274,{w:800,size:40});
        ed_pyramid(x,960,330,{u:ed_u(tt,[w("minto","answer",-0.2),w("minto","reasons",-0.2),w("minto","evidence",-0.2)])});x.restore();}
      const d0=c.decision-0.2,bx=lerp(PX,140,ag_sine(ag_in(tt,c.back-0.2,1.6))),dw=w("decision","decision",-0.2);
      ed_page(x,bx,PY,{p:{decision:ag_in(tt,dw,0.6),sign:ag_in(tt,dw+0.8,0.6),answer:ag_in(tt,w("answer","rooms",-0.2),0.6),
        l1:ag_in(tt,w("three","peak",-0.2),0.5),l2:ag_in(tt,w("three","bookings",-0.2),0.5),l3:ag_in(tt,w("three","take",-0.2),0.5)},a:ag_in(tt,d0,0.4),k:tt-d0,light:"late"});
      ed_pageLight(x,bx,PY,30,128,LP.blue,ag_io(tt,dw,c.answer-0.3,0.4));
      ed_pageLight(x,bx,PY,176,264,LP.blue,ag_io(tt,w("answer","rooms",-0.2),c.three-0.3,0.4));
      ed_pageLight(x,bx,PY,270,474,LP.orange,ag_io(tt,w("three","peak",-0.2),c.back-0.3,0.4));
      // at the back: the method and the other charts; then the true finding the decision doesn't turn on
      const b0=w("back","back",-0.3),bA=ag_in(tt,b0,0.4);
      if(bA>0.004){x.save();x.globalAlpha*=bA;lp_sheet(x,1312,308,460,232,{light:"late",pin:false});lp_sheet(x,1296,294,460,232,{light:"late",pin:false});x.restore();
        lp_textSheet(x,1280,280,460,{kick:"At the back",lines:["The method","The other charts"]},{a:bA*(1-ag_in(tt,w("holds","doesn't",-0.2),0.45)),k:tt-b0,light:"late",pin:false});}
      const s0=w("seats","true",-0.2),sv=ag_sine(ag_in(tt,w("holds","doesn't",-0.2),1.4));
      if(tt>=s0){x.save();lp_textSheet(x,1280,lerp(600,280,sv),460,{kick:"True",lines:["When people came, rooms were about half full"]},{a:ag_in(tt,s0,0.35),k:tt-s0,light:"late",pin:false});x.restore();}
      ed_tag(x,tt,w("holds","holds",-0.3),null,1510,640,"A half-full room still holds a class",{align:"center"});}}
  ]);
  ed_kick(ctx,S,ag_in(t,0.6,0.6));
});

/* ---------------------------------------------------------------- 4. What it turns on */
scene("turns",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),lt={light:"late"};
  const G0={x:140,y:150,w:1100,h:690,ch:78};
  ag_shots(ctx,S,t,sc.dur,[
    // the team's room, on from the page: the week's average beside it, then the whole week, drawn big; the advice; the page and its picture together
    {at:0,place:"edLate",keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{
      const out=ag_sine(ag_in(tt,w("map","whole",-0.4),1.4)),back=ag_sine(ag_in(tt,c.together-0.2,1.8)),px=back>0?lerp(40,ED_PG.x,back):lerp(140,40,out),pa=back>0?back:1-out;
      if(pa>0.004)ed_page(x,px,ED_PG.y,{a:pa,p:ed_all({meets:0,unknown:0,holds:0,words:0,which:0}),light:"late"});
      // the week's average, 38%, on its own
      const f0=w("hides","average",-0.3);lp_figure(x,1300,250,480,{kick:"The week's average",num:"38%",label:"Rooms booked"},{a:ag_in(tt,f0,0.35)*(1-ag_in(tt,w("right","academics",-0.7),0.4)),k:tt-f0,light:"late"});
      // the whole week, hour by hour: big while it's read, then beside the page
      const m0=w("map","heat",-0.2),G={x:lerp(G0.x,ED_PIC.x,back),y:lerp(G0.y,ED_PIC.y,back),w:lerp(G0.w,ED_PIC.w,back),h:lerp(G0.h,ED_PIC.h,back),ch:lerp(G0.ch,ED_PIC.ch,back)};
      const pk=w("peak","ten",-0.2),sw=w("together","shows",-0.2),pulse=ag_io(tt,sw,sw+1.6,0.4)*(0.5+0.5*Math.sin((tt-sw)*7));
      ed_picture(x,G.x,G.y,{w:G.w,h:G.h,ch:G.ch,a:ag_in(tt,m0,0.4),k:tt-m0,u:ag_in(tt,m0+0.3,2.4),peak:ag_in(tt,pk,0.6)*(1-0.6*pulse),
        peakLab:ag_in(tt,w("peak","ninety",-0.1),0.5),otherLab:ag_in(tt,w("peak","Most",-0.1),0.5),avg:ag_in(tt,w("right","academics",-0.3),0.5),ring:ag_io(tt,w("corridors","empty",-0.3),c.daniels-0.4,0.5),light:"late"});
      // the academics were right at the peak; Facilities were right at the other hours
      const r0=w("right","academics",-0.2),r1=w("corridors","Facilities",-0.2),tOut=c.daniels-0.4,ta="Academics: “always full”",tf="Facilities: “empty corridors”";
      ed_tag(x,tt,r0,tOut,1300,420,ta);ed_tick(x,tt,w("right","right",-0.1),1300+ed_tagW(x,ta)+34,420,1-ag_in(tt,tOut,0.4));
      ed_tag(x,tt,r1,tOut,1300,520,tf);ed_tick(x,tt,w("corridors","saw",0.2),1300+ed_tagW(x,tf)+34,520,1-ag_in(tt,tOut,0.4));
      // like Daniels's count
      ed_sheet(x,tt,w("daniels","Daniels",-0.3),1300,300,500,{kick:"Daniels's count, 1952",title:"Average on all ten: not one"},{col:LP.orange,light:"late",out:c.used-0.4});
      // booked isn't used: in one booked hour in five, nobody came
      const u0=w("used","booked",-0.3),uA=ag_in(tt,u0,0.35)*(1-ag_in(tt,c.tufte-0.4,0.4));
      if(uA>0.004){lp_sheet(x,1300,300,500,340,{a:uA,k:tt-u0,col:LP.orange,light:"late"});x.save();x.globalAlpha*=uA;
        lp_T(x,"BOOKED ISN'T USED",1340,370,{w:800,size:28,ls:3,col:LP.orange});ed_fifth(x,1340,410,{u:ag_in(tt,w("used","five",-0.4),1.0)});
        lp_T(x,"In 1 booked hour in 5,",1340,542,{w:600,size:28});lp_T(x,"the sensors counted nobody",1340,580,{w:600,size:28});x.restore();}
      // the advice the page and its picture follow
      ed_sheet(x,tt,w("tufte","Edward",-0.2),1320,170,440,{title:"Above all else, show the data",sub:"Edward Tufte"},{light:"late",out:c.together-0.4});
      ed_sheet(x,tt,w("knaflic","Cole",-0.2),1320,430,440,{title:"Know who you're showing, and the one thing they need to see",sub:"Cole Nussbaumer Knaflic"},{light:"late",out:c.together-0.4});
      ed_pageLight(x,ED_PG.x,ED_PG.y,30,128,LP.blue,ag_io(tt,w("together","says",-0.2),w("together","shows",-0.2),0.4));}},
    // a later moment in the room: Helena, and the same rule for anything that crosses teams
    {at:c.route-0.4,place:"edLate",later:true,keys:[[c.route-0.4,960,540,1.0]],push:0,draw:(x,tt)=>{const q0=w("route","crosses",-0.3),qA=ag_in(tt,q0,0.35);
      if(qA>0.004){lp_sheet(x,140,300,1180,360,{a:qA,k:tt-q0,col:LP.blue,light:"late"});x.save();x.globalAlpha*=qA;
        lp_T(x,"ANYTHING THAT CROSSES TEAMS",190,370,{w:800,size:28,ls:3,col:LP.blue});lp_T(x,"Its route, in one picture",190,428,{w:800,size:40});
        ed_route(x,190,510,{u:ag_in(tt,w("route","teams",-0.2),2.4)});x.restore();}
      lp_person(x,"helena",1580,690,1.0,{t:tt,flip:true,light:lt});}}
  ]);
  ed_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 5. What isn't known, in their words */
scene("unknown",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),dy={light:"day"};
  const MX=510,MY=124;
  ag_shots(ctx,S,t,sc.dur,[
    // the page and its picture again: what it would take not to build, the forecast it meets, what isn't known and how far the answer holds
    {at:0,place:"edLate",later:true,keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{
      const fly=ag_in(tt,w("take","move",-0.1),2.6),mv=fly*(1-ag_in(tt,c.unknown-0.4,1.2)),m0=w("forecast","meets",-0.2),k0=w("unknown","isn't",-0.2),h0=w("holds","far",-0.2);
      ed_page(x,ED_PG.x,ED_PG.y,{p:ed_all({meets:ag_in(tt,m0,0.6),unknown:ag_in(tt,k0,0.6),holds:ag_in(tt,h0,0.6),words:0,which:0}),light:"late"});
      ed_pageLight(x,ED_PG.x,ED_PG.y,392,474,LP.blue,ag_io(tt,c.take,c.forecast-0.3,0.4));
      ed_pageLight(x,ED_PG.x,ED_PG.y,474,512,LP.green,ag_io(tt,m0,c.unknown-0.3,0.4));
      ed_pageLight(x,ED_PG.x,ED_PG.y,516,604,LP.amber,ag_io(tt,k0,c.breath-1.0,0.4));
      ed_picture(x,ED_PIC.x,ED_PIC.y,{w:ED_PIC.w,h:ED_PIC.h,ch:ED_PIC.ch,u:1,peak:1,move:mv,chips:fly,peakLab:1-ag_in(tt,w("take","move",-0.3),0.4)*(1-ag_in(tt,c.unknown+0.4,0.6)),otherLab:1,light:"late"});
      ed_tag(x,tt,w("take","move",0.3),c.unknown-0.4,ED_PIC.x+ED_PIC.w/2,824,"1 peak class in 6, to other hours",{align:"center",col:LP.blue});}},
    // the registrar's office: Mei, who wasn't in the work, reads it and says it back; one word means something else to her
    {at:c.mei-0.4,place:"edMei",cut:true,keys:[[c.mei-0.4,960,540,1.0]],draw:(x,tt)=>{
      const wd=w("word","utilisation",-0.2),b0=w("words","booked",-0.2),q0=w("which","which",-0.2),a0=w("plan","answers",-0.2),d0=w("words","means",-0.2);
      ed_page(x,MX,MY,{p:ed_all({words:ag_in(tt,d0,0.6),which:ag_in(tt,a0,0.6)}),booked:ag_in(tt,b0,0.9),word:ag_io(tt,wd,b0+0.2,0.4),light:"day"});
      ed_pageLight(x,MX,MY,606,652,LP.blue,ag_io(tt,d0,c.which-0.3,0.4));ed_pageLight(x,MX,MY,650,734,LP.blue,ag_io(tt,a0,c.same-0.6,0.4));
      lp_person(x,"ivy",300,700,1.0,{t:tt,light:dy});lp_person(x,"mei",1640,700,1.0,{t:tt,flip:true,light:dy});
      const m0=w("mei","Mei",-0.1),s0=w("says","two",-0.2),out0=c.word-0.3;
      lp_nameTag(x,1640,330,"mei",{align:"center",a:ag_in(tt,m0,0.4)*(1-ag_in(tt,out0,0.4))});
      ed_tag(x,tt,s0,out0,1640,250,"Said back in 2 minutes",{align:"center",col:LP.green});
      ed_tag(x,tt,w("word","seats",-0.2),b0-0.3,490,300,"To Mei: seats filled",{align:"right",col:LP.amber});
      ed_tag(x,tt,w("word","booked",-0.2),b0-0.3,1824,300,"On the page: rooms booked",{align:"right",col:LP.amber});
      ed_tag(x,tt,q0,c.same-0.6,1824,300,"Which classes would move?",{align:"right"});}},
    // the team's room: the same page, with the same numbers, for everyone
    {at:c.same-0.4,place:"edLate",cut:true,keys:[[c.same-0.4,960,540,1.0]],draw:(x,tt)=>{
      [[158,"Council","The University Council"],[712,"faculties","The faculties"],[1267,"registrar's","The registrar's office"]].forEach(([px,word,label],i)=>{
        const p0=c.same+0.1+i*0.35;if(tt<p0)return;x.save();x.globalAlpha*=ag_in(tt,p0,0.35);ed_pageSmall(x,px,220,0.55,{p:ed_all(),booked:1,light:"late",k:tt-p0});x.restore();
        ed_tag(x,tt,w("same",word,-0.2),null,px+247,720,label,{align:"center"});});}}
  ]);
  ed_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 6. They decide */
scene("decide",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),gr={light:"grey"},dy={light:"day"};
  const MEM=[260,520,780,1040,1300];
  ag_shots(ctx,S,t,sc.dur,[
    // Graham's office, Tuesday 1 June: the page goes under his name, with the week's picture beside it
    {at:0,place:"edGraham",keys:[[0,960,540,1.0]],draw:(x,tt)=>{const p0=w("sends","page",-0.4),q0=w("sends","picture",-0.4),n0=w("sends","name",-0.3);
      if(tt>=p0){x.save();x.globalAlpha*=ag_in(tt,p0,0.35);ed_pageSmall(x,920,230,0.5,{p:ed_all(),booked:1,light:"grey",k:tt-p0});
        x.translate(920,230);x.scale(0.5,0.5);ed_pageLight(x,0,0,128,168,LP.blue,ag_io(tt,n0,c.meets-0.6,0.4));x.restore();}
      if(tt>=q0){x.save();x.globalAlpha*=ag_in(tt,q0,0.35);ed_pictureSmall(x,1400,268,0.5,{light:"grey",k:tt-q0});x.restore();}
      ed_tag(x,tt,w("sends","Tuesday",-0.2),null,1355,680,"Tuesday 1 June",{align:"center"});
      lp_person(x,"graham",520,650,1.0,{t:tt,light:gr});}},
    // the University Council's room, Thursday 24 June: its members' two questions, both answered on the page; the decision
    {at:c.meets-0.4,place:"edCouncil",cut:true,keys:[[c.meets-0.4,960,540,1.0]],draw:(x,tt)=>{const d0=w("defers","defer",-0.3),dA=ag_in(tt,d0,0.35);
      lp_screen(x,600,170,860,286,{a:1-dA,draw:(cc,X,Y,W2,H2)=>ed_heat(cc,X+90,Y+50,(W2-130)/10,(H2-74)/5,{u:1,peak:1,deco:1})});
      const cut=794;MEM.forEach((mx,i)=>lp_person(x,lp_crowd(i+1),mx,640,0.62,{t:tt+i*0.7,flip:i>=3,cut,light:dy}));
      ed_councilTable(x,120,800,1400);
      lp_person(x,"graham",1700,660,0.95,{t:tt,flip:true,light:dy});
      const q1="How sure is the growth?",q2="Which classes would move?",b0=w("asks","both",-0.1),qOut=d0-0.2;
      ed_tag(x,tt,w("asks","sure",-0.3),qOut,100,220,q1);ed_tick(x,tt,b0,100+ed_tagW(x,q1)+34,220,1-ag_in(tt,qOut,0.4));
      ed_tag(x,tt,w("asks","which",-0.3),qOut,100,290,q2);ed_tick(x,tt,b0+0.3,100+ed_tagW(x,q2)+34,290,1-ag_in(tt,qOut,0.4));
      ed_sheet(x,tt,d0,600,140,860,{kick:"Thursday 24 June 2027",title:"The building deferred for two years",lines:["The timetable change from Semester 1 2028","A review in June 2029"]},
        {col:LP.green,light:"day",u:ed_u(tt,[w("defers","timetable",-0.2),w("defers","review",-0.2)])});
      ed_tag(x,tt,w("argued","choice",-0.3),null,100,380,"The choice, not the numbers");}}
  ]);
  ed_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 7. On Monday */
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),e0=c.breath;
  const pair=(x,tt,o)=>{o=o||{};const a=1-0.9*ag_in(tt,e0,1.0);ed_page(x,ED_PG.x,ED_PG.y,{a,p:ed_all(),booked:1,light:"morning"});
    ed_picture(x,ED_PIC.x,ED_PIC.y,{a,w:ED_PIC.w,h:ED_PIC.h,ch:ED_PIC.ch,u:1,peak:o.peak==null?1:o.peak,light:"morning"});};
  ag_shots(ctx,S,t,sc.dur,[
    // the team's room on a Monday morning: what Daniels did, in three prints
    {at:0,place:"edMorning",keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      const pr=(i,t0)=>({a:ag_in(tt,t0,0.35),k:tt-t0}),A=pr(0,0.6),B=pr(1,0.9),C=pr(2,1.2);
      lp_sheet(x,110,200,520,440,{a:A.a,k:A.k,col:LP.orange,light:"morning"});if(A.a>0.004){x.save();x.globalAlpha*=A.a;x.translate(160,250);x.scale(0.53,0.53);ed_dots(x,0,40,{steps:[],cols:79,pitch:9,r:3.2});x.restore();lp_T(x,"4,063 flyers, 10 measurements",160,600,{w:600,size:28,col:LP.mut,a:A.a});}
      if(B.a>0.004){x.save();x.globalAlpha*=B.a;x.translate(710,200);x.scale(0.52,0.52);ed_note(x,0,0,1000,{u:1,h:846,k:B.k,light:"morning",deco:true});x.restore();}
      lp_sheet(x,1290,200,520,440,{a:C.a,k:C.k,col:LP.blue,light:"morning"});if(C.a>0.004){x.save();x.globalAlpha*=C.a;ed_cockpit(x,1450,560,0.36,{lw:2,pilots:[ed_fit(1)],reach:"stick",seats:[0],pedals:[0]});x.restore();}
      ed_tag(x,tt,w("back","counted",-0.2),null,370,700,"He counted",{align:"center"});
      ed_tag(x,tt,w("back","plainly",-0.2),null,970,700,"He said what it meant",{align:"center"});
      ed_tag(x,tt,w("back","left",-0.2),null,1550,700,"He left the design to designers",{align:"center"});}},
    // a later moment: Ivy's page, which did the same
    {at:c.ivy-0.4,place:"edMorning",later:true,keys:[[c.ivy-0.4,960,540,1.0]],push:0,draw:(x,tt)=>{
      const dz=w("ivy","decision",-0.2),pk=w("ivy","peak",-0.2),ch=w("ivy","choice",-0.2),pulse=ag_io(tt,pk,pk+1.6,0.4)*(0.5+0.5*Math.sin((tt-pk)*7));
      pair(x,tt,{peak:1-0.6*pulse});
      ed_pageLight(x,ED_PG.x,ED_PG.y,30,128,LP.blue,ag_io(tt,dz,pk-0.2,0.4));ed_pageLight(x,ED_PG.x,ED_PG.y,30,166,LP.blue,ag_io(tt,ch,c.one-0.6,0.4));}},
    // a later moment: four things to do on Monday
    {at:c.one-0.4,place:"edMorning",later:true,keys:[[c.one-0.4,960,540,1.0]],push:0,draw:(x,tt)=>{
      const S4=[["one",140,150,{kick:"One",title:"Start with the decision",lines:["Then the answer, in one sentence"]}],
        ["two",1000,150,{kick:"Two",title:"Show what it turns on",lines:["The peak and the spread, drawn as you write"]}],
        ["three",140,500,{kick:"Three",title:"Say what you don't know",lines:["In their words, the same numbers for all"]}],
        ["four",1000,500,{kick:"Four",title:"Try it on someone new to it",lines:["Then let the people who decide, decide"]}]];
      S4.forEach(([id,sx,sy,words])=>ed_sheet(x,tt,c[id]-0.1,sx,sy,780,words,{col:LP.blue,light:"morning",u:ag_in(tt,c[id]+1.0,0.6)}));}},
    // a later moment: the page and its picture, alone, as they become the end card
    {at:c.take-0.6,place:"edMorning",later:true,keys:[[c.take-0.6,960,540,1.0]],push:0,draw:(x,tt)=>{pair(x,tt);}}
  ]);
  lp_end(ctx,S,t,e0,"Explaining so people can decide",ED_LAST,"Film 2 of 3","Working with people");
  ed_kick(ctx,S,1-ag_in(t,e0,0.6));
});

ag_cutInto(["turns","unknown","decide"]);
