/* ===== How, more than who: the chapters, shot by shot =====
   The film moves between people and its key ideas (the author, 17 November 2026). In a scene, people are whole and do what the line
   says, and the words on the frame are where and when, a name, or what someone says. The ideas are explained at a board, by Carmen
   Vidal, a consultant, by Jun or by Helena; what to keep is a page of Helena's notebook (hm_uni.js). Every time comes from the voice: a
   line's start (sc.cues) or a word in it (wAt), so the pictures stay with the voice if it's recorded again; the score (tools/score.py)
   takes the same words. Sizes are in the 1920 x 1080 frame; people's sizes come from each place's eye line. */
const hm_kick=(ctx,S,a)=>{if(a>0.004){setScreen(ctx,S);PK.kicker(ctx,4,"How, more than who",a);}};
function hm_card(ctx,S,t,t0,t1,d,o){o=o||{};const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a<=0.004)return;setScreen(ctx,S);PK.card(ctx,o.mid?960:o.right?1848:72,o.y==null?146:o.y,d,a,{align:o.mid?"center":o.right?"right":"left"});}
const hm_imagined=(ctx,S,t,t0,t1,text)=>{const a=ag_io(t,t0,t1,0.5);if(a>0.004){setScreen(ctx,S);PK.sceneTag(ctx,text,a);}};
const hm_bub=(x,J,tt,t0,t1,lines,cam,o)=>{if(J)PK.say(x,J,lines,ag_io(tt,t0,t1==null?1e9:t1,0.3),Object.assign({cam},o||{}));};
const hm_name=(x,J,tt,t0,t1,name,role,dy,dx)=>{if(J)PK.nameTag(x,J.hc[0]+(dx||0),J.hc[1]-(dy||150),name,role,ag_io(tt,t0,t1,0.4));};
// while a chapter shows a key idea apart from the scene (a board seen close, a page of the notebook), its kicker steps back
const hm_apart=(t,spans)=>spans.reduce((m,[a,b])=>Math.max(m,ag_in(t,a-0.4,0.35)*(1-ag_in(t,b,0.35))),0);
// someone who stays a while takes in what goes on: a look, a nod, a smile, every few seconds (i: who they are, so no two move together)
const hm_alive=(tt,base,i,t0)=>{base=Object.assign({expr:"neutral",gaze:[1,0]},base||{});const g=base.gaze[1],ev=[],K=["look","nod","smile"];
  for(let k=0;k<30;k++){const at=(t0||0)+1.8+i*1.1+k*5.6,kind=K[(k+Math.round(i))%3];ev.push(kind==="look"?[at,"look",2.2,[1,g+((k+Math.round(i))%2?0.45:-0.35)]]:kind==="smile"?[at,"smile",2.4]:[at,"nod"]);}
  return PK.face(tt,base,ev);};
// a face that speaks over each span of [t0, t1], on a base expression
const hm_talk=(base,tt,spans)=>{const e=PK.exprMix(base,base,0);e.open=Math.max(e.open||0,...spans.map(([a,b])=>PK.talk(tt,a,b)*0.75));return e;};
const hm_sp=(tt,i,spans,base,g)=>hm_alive(tt,{expr:hm_talk(base||"listen",tt,spans),gaze:[1,g==null?-0.2:g]},i);

/* ---------------------------------------------------------------- the gorge's people */
// kneeling to twist or braid cord, seen from the side: both hands together in front, the cord running from them to the ground;
// o.k (0 to 1): from standing to kneeling
const HM_TWIST={mode:"kneel",lean:16,head:12,aN:[44,56,"grip"],aF:[40,60,"grip"],lN:[28,-90],lF:[40,-88],fN:70,fF:70};
function hm_twisting(x,who,px,fl,tt,o){o=o||{};const U=PK.u,k=o.k==null?1:o.k,pose=k>=1?HM_TWIST:PK.poseMix("stand",HM_TWIST,U.sine(U.clamp(k,0,1)));
  const J=hmq_person(x,who,px,fl,hmq_h(fl),pose,Object.assign({t:tt,holds:true},o,o.nod!=null?{}:hm_alive(tt,{expr:o.expr||"neutral",gaze:o.gaze||[1,0.7]},px%5)));
  if(J&&J.hdN&&k>0.7){const [hx,hy]=J.hdN,len=o.len||260,sg=o.flip?-1:1,col=PK.S.tone(HMQ_PAL.rope),tw=Math.sin(tt*5)*2;x.save();x.globalAlpha*=U.clamp((k-0.7)/0.3,0,1);x.lineCap="round";x.strokeStyle=U.css(PK.S.ink);x.lineWidth=6;
    x.beginPath();x.moveTo(hx,hy+4);x.quadraticCurveTo(hx+sg*len*0.4,fl-6+tw,hx+sg*len,fl-2);x.stroke();x.strokeStyle=U.css(col);x.lineWidth=3.4;x.stroke();x.restore();}return J;}
// a walker on the bridge from u0 to u1 between t0 and t1; returns [u, who, flip, tt] for hmq_bridge, or null
const hm_on=(tt,who,u0,u1,t0,t1)=>{if(tt<t0-0.2||tt>t1+0.2)return null;const u=PK.u.lerp(u0,u1,PK.u.clamp((tt-t0)/(t1-t0),0,1));return[u,who,u1<u0,tt];};
// the bank's people: [who, x, floor, pose, flip, opts]; or {fl, draw(x)} for whoever moves
function hm_bank(x,tt,list){list.map(p=>Array.isArray(p)?{fl:p[2],p}:p).sort((a,b)=>a.fl-b.fl).forEach(it=>{if(it.draw)return it.draw(x);
  const [who,px,fl,pose,fl2,o0]=it.p,o=o0||{};if(pose==="twist")return hm_twisting(x,who,px,fl,tt,Object.assign({flip:!!fl2},o));
  const f=o.nod!=null?{}:hm_alive(tt,{expr:o.expr||"neutral",gaze:o.gaze||[1,0]},px%5);
  hmq_person(x,who,px,fl,hmq_h(fl),pose||"stand",Object.assign({t:tt+(px%7),flip:!!fl2},o,f));});}
// someone who walks onto the bank with a coil of cord, then stands holding it
const hm_bringer=(tt,who,x0,x1,t0,fl,flip)=>({fl,draw:cc=>{const d=Math.abs(x1-x0)/190;if(tt<t0+d)return hmq_walk(cc,who,tt,{x0,x1,t0,t1:t0+d,floor:fl,h:hmq_h(fl),arms:{aN:HM_CARRY.aN},then:HM_CARRY},Object.assign({flip,hold:hmq_coil,holds:true},hm_alive(tt,{expr:"smile",gaze:[1,0]},x1%5,t0)));
  return hmq_person(cc,who,x1,fl,hmq_h(fl),HM_CARRY,Object.assign({t:tt,flip,hold:hmq_coil,holds:true},hm_alive(tt,{expr:"smile",gaze:[1,0.1]},x1%5,t0)));}});
// coils of cord on the ground, checked in
function hm_pile(x,n,at){const S=PK.S;S.begin(x,{lw:2,sh:3});at.slice(0,n).forEach(([px,py])=>hmq_coil(x,[px,py-22]));}

// Marta at her desk; someone who walks to a place in a room, then takes up a pose
const hm_marta=(o)=>Object.assign({work:1,turn:0},o||{});
const hm_come=(cc,who,tt,x0,x1,t0,t1,fl,h,o)=>{o=o||{};const flip=x1<x0;if(tt<t0)return null;if(tt<t1)return PK.walk(cc,who,tt,{x0,x1,t0,t1,floor:fl,h,then:o.then||"stand"},Object.assign({flip},o.face||{}));
  return PK.person(cc,who,x1,fl,h,o.then||"stand",Object.assign({t:tt,flip},o.face||{}));};
/* ---------------------------------------------------------------- the team's room, everyone in it
   Whoever writes at the team's board (o.writer: Helena, or Jun); Sam on a chair turned to the board, or at his desk when Helena sits in
   that chair; Noor and Tomás standing, Yusuf by the window, Erin on a chair. o.faces: {who: PK.face's result}; returns everyone's joints */
const HM_HEV=Array.from({length:40},(_,k)=>k%2?[1.6+k*4.8,"nod"]:[1.6+k*4.8,"look",2.2,[1,0.35]]);
const HM_IDX={sam:0,jun:1,marta:2,noor:3,yusuf:4,erin:5,tomas:6,helena:7};
function hm_seven(x,tt,o){o=o||{};const wr=o.writer||"helena",f=k=>(o.faces||{})[k]||hm_alive(tt,{expr:"listen",gaze:[1,-0.2]},HM_IDX[k],0),r={};
  const R=hm_team(x,tt,{clock:o.clock||15,sam:wr==="helena"?null:Object.assign({work:0,pose:"sit"},f("sam")),jun:wr==="jun"?null:Object.assign({work:0,pose:"sit"},o.jun||{},f("jun")),showJ:o.showJ,
    marta:Object.assign({turn:1,work:0,pose:"sit"},f("marta")),people:[
    {fl:HM_RB.floor,draw:cc=>{r[wr]=hm_roomBoard(cc,tt,o.rows||[],wr,{say:o.say,events:o.hev||HM_HEV});}},
    {fl:HM_SAMC.floor,draw:cc=>{const k=wr==="helena"?"sam":"helena";r[k]=PK.seated(cc,k,HM_SAMC.x,HM_SAMC.floor,hm_hT(HM_SAMC.floor),"sit",Object.assign({t:tt+2,flip:true},f(k)));}},
    {fl:875,draw:cc=>{r.noor=PK.person(cc,"noor",1690,875,hm_hT(875),"clasp",Object.assign({t:tt+2,flip:true},f("noor")));}},
    {fl:935,draw:cc=>{r.yusuf=PK.person(cc,"yusuf",380,935,hm_hT(935),"clasp",Object.assign({t:tt+3},f("yusuf")));}},
    {fl:925,draw:cc=>{r.erin=PK.seated(cc,"erin",1640,925,hm_hT(925),"sit",Object.assign({t:tt+5,flip:true},f("erin")));}},
    {fl:965,draw:cc=>{r.tomas=PK.person(cc,"tomas",200,965,hm_hT(965),"ease",Object.assign({t:tt+6},f("tomas")));}}].concat(o.people||[])});
  r.jun=r.jun||R.jun;r.marta=R.marta;if(wr!=="helena")r.sam=R.sam;return r;}
const HM_LAST="Agree how you work together, and keep to it.";

/* ---------------------------------------------------------------- 1. Three days in June */
scene("days",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tC=c.cord-0.5,tT=c.tie-0.5,tV=c.weave-0.5,tD=c.done-0.5,tN=c.how-0.4,tA=c.data-0.5,N1=PK.pace(ctx,null,hm_note1(sc,w));
  const tI=w("tire","tires",0);
  const PILE=[[300,712],[346,722],[392,712],[322,700],[370,700],[1560,712],[1606,722],[1650,712],[1584,700]];
  ag_shots(ctx,S,t,sc.dur,[
    // the gorge, the bridge across it, people crossing; on the banks, the families
    {at:0,place:"hmGorge",keys:[[0,960,560,1.0],[c.june-0.2,960,470,1.1],[c.hold-0.2,960,500,1.05],[c.need,700,600,1.12]],d:3,draw:(x,tt,cam)=>{
      hmq_steel(x,1);hmq_bridge(x,{age:0.05,walkers:[hm_on(tt,"m3",0.04,0.96,0.6,24),hm_on(tt,"w4",0.96,0.04,6,30),hm_on(tt,"v1",0.06,0.94,c.hold,c.hold+22)].filter(Boolean)});
      hm_bank(x,tt,[["w1",170,900,"stand",false,{hold:hmq_coil,holds:true,expr:"smile",gaze:[1,0.1]}],["m1",440,690,"clasp",false,{expr:"neutral"}],
        ["w2",300,800,"twist",false,{len:160}],["keeper",1700,880,"clasp",true,{expr:"neutral",gaze:[1,0.1]}],["w3",1560,740,"twist",true,{len:150}]]);}},
    // day one: the bridge of last year is gone; every family's cord is brought and checked in, on both banks; the braiding begins
    {at:tC,place:"hmGorge",later:true,keys:[[tC,960,520,1.06],[c.part-0.2,960,540,1.05],[c.braid,560,700,1.3],[E.tire,700,640,1.18]],d:3.2,draw:(x,tt,cam)=>{
      hmq_steel(x,1);const n=Math.round(U.clamp((tt-tC-1.2)/(c.part-tC-1.6),0,1)*PILE.length);hm_pile(x,n,PILE);
      const L=[hm_bringer(tt,"w1",2080,1760,tC+0.3,1000,true),hm_bringer(tt,"m4",-160,200,tC+1.6,770,false),hm_bringer(tt,"w3",2080,1860,tC+0.8,820,true),hm_bringer(tt,"m5",2080,1660,tC+2.2,740,true),
        ["keeper",440,810,"clasp",false,hm_alive(tt,{expr:"neutral",gaze:[1,0.5]},0,tC)],
        ["w5",1480,660,"clasp",true,PK.face(tt,{expr:"neutral",gaze:[1,0.6]},[[tC+3.4,"nod"],[c.cord+5,"look",2.4,[1,0.3]],[c.part+2,"nod"]])],
        ["w2",1540,880,"twist",true,{len:150,k:ag_in(tt,c.part,0.5)}]];
      // one braids until he tires; he stands and steps back, and another kneels in his place
      L.push({fl:960,draw:cc=>{if(tt<tI+0.6)return hm_twisting(cc,"m2",330,960,tt,{len:150,k:ag_in(tt,c.part+0.6,0.5)*(1-ag_in(tt,tI,0.6))});
        const ts=tI+0.6;if(tt<ts+2.4)return hmq_walk(cc,"m2",tt,{x0:330,x1:-180,t0:ts,t1:ts+2.4,floor:960,h:hmq_h(960),then:"stand"},Object.assign({flip:true},hm_alive(tt,{gaze:[1,0.3]},2,ts)));}});
      L.push({fl:965,draw:cc=>{const ta=tI+1.2,tb=tI+3.2;if(tt<ta)return;if(tt<tb)return hmq_walk(cc,"m3",tt,{x0:-160,x1:330,t0:ta,t1:tb,floor:965,h:hmq_h(965),then:"stand"},hm_alive(tt,{},3,ta));
        return hm_twisting(cc,"m3",330,965,tt,{len:150,k:ag_in(tt,tb,0.5)});}});
      hm_bank(x,tt,L);}},
    // day two: many hands pull the cables across and tie them to the old stone bases, the older guiding the younger
    {at:tT,place:"hmGorge",later:true,keys:[[tT,700,640,1.18],[tT+1.6,960,520,1.05],[c.tie+3,960,500,1.08]],d:3,draw:(x,tt,cam)=>{
      hmq_steel(x,1);hmq_bridge(x,{age:0,k:0.5*U.clamp((tt-c.tie)/(c.weave-c.tie-0.8),0,1)});
      const pull=(i)=>Object.assign({holds:true},hm_alive(tt,{expr:"neutral",gaze:[1,0.2]},i,tT));
      hm_bank(x,tt,[["m1",360,700,HM_CARRY,false,pull(1)],["m4",250,780,HM_CARRY,false,pull(2)],["keeper",130,860,"clasp",false,PK.face(tt,{gaze:[1,0.1]},[[c.tie+1.6,"look",2.4,[1,-0.2]],[c.tie+4.2,"nod"],[c.tie+7,"smile",2.4]])],
        ["m5",1560,700,HM_CARRY,true,pull(3)],["m3",1670,790,HM_CARRY,true,pull(4)],["w3",1800,880,"clasp",true,PK.face(tt,{gaze:[1,0.1]},[[c.tie+2.4,"nod"],[c.tie+5.2,"look",2.4,[1,-0.2]]])]]);}},
    // day three: two builders weave the sides and the floor, one from each bank, until they meet in the middle
    {at:tV,place:"hmGorge",later:true,keys:[[tV,960,500,1.06],[c.done-1.2,960,470,1.14]],d:3,draw:(x,tt,cam)=>{
      const m=U.clamp((tt-c.weave-0.4)/(c.done-c.weave-1.4),0,1);hmq_steel(x,1);
      hmq_bridge(x,{age:0,k:0.5+0.5*m,walkers:[[U.lerp(0.04,0.47,m),"m3",false,tt*0.4],[U.lerp(0.96,0.53,m),"m5",true,tt*0.4]]});
      hm_bank(x,tt,[["keeper",440,700,"clasp",false,{expr:"neutral",gaze:[1,0.3]}],["w1",250,820,"stand",false,{expr:"smile",gaze:[1,0.2]}],["w3",1640,760,"clasp",true,{expr:"smile",gaze:[1,0.2]}]]);}},
    // that afternoon: the bridge done, people crossing; the next day, they celebrate
    {at:tD,place:"hmGorge",later:true,keys:[[tD,960,500,1.06],[c.how-0.6,960,520,1.0]],d:3,draw:(x,tt,cam)=>{
      hmq_steel(x,1);hmq_bridge(x,{age:0,walkers:[hm_on(tt,"m3",0.08,0.92,tD+0.6,tD+14),hm_on(tt,"w4",0.94,0.06,tD+2,tD+16)].filter(Boolean)});
      const cl={hold:hmq_coil,holds:true,expr:"smile"};
      hm_bank(x,tt,[["w1",170,900,"stand",false,{expr:"smile"}],["m1",430,700,"clasp",false,{expr:"smile"}],["m4",300,790,"stand",false,{expr:"smile"}],["keeper",1700,880,"clasp",true,{expr:"smile"}],
        ["w3",1560,740,"stand",true,{expr:"smile"}],["m5",1820,800,"stand",true,{expr:"smile"}]]);}},
    {at:tN,place:"hmNotes",dis:0.6,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N1,{});}},
    // a data team's work is like that: at their desks, each part leaning on someone else's
    {at:tA,place:"hmTeam",dis:1.0,keys:[[tA,960,540,1.0],[c.more,1040,550,1.06]],d:3,draw:(x,tt,cam)=>{
      const R=hm_team(x,tt,{clock:10,sam:Object.assign({work:1},hm_alive(tt,{},1,tA)),jun:Object.assign({work:1},hm_alive(tt,{},2,tA)),marta:Object.assign(hm_marta({}),hm_alive(tt,{},3,tA)),
        people:[{fl:900,draw:cc=>{hm_come(cc,"yusuf",tt,-160,980,tA+0.6,tA+6.2,900,hm_hT(900),{then:HM_CARRY,face:Object.assign({hold:hm_sheet,holds:true},hm_alive(tt,{expr:"smile",gaze:[1,0]},4,tA))});}}]});}}
  ]);
  hm_card(ctx,S,t,c.where+0.4,c.june-0.3,{kick:"Quehue, Cusco, Peru",title:"The Apurímac river"},{y:40,mid:true});
  hm_card(ctx,S,t,c.june+0.2,c.size-0.3,{kick:"Every June",title:"Four communities, a new bridge"},{y:40,mid:true});
  hm_card(ctx,S,t,c.size+0.2,c.alone-0.3,{kick:"28 metres · about 1,000 people",title:"Three days",col:PK.C.orange},{y:40,mid:true});
  hm_card(ctx,S,t,c.hold+0.4,c.need-0.3,{kick:"For a year",title:"About 15 metres above the river",col:PK.C.orange},{y:40,mid:true});
  hm_card(ctx,S,t,tC+0.4,c.part-0.4,{kick:"Day one",title:"Every cord checked in"},{y:40,mid:true});
  hm_card(ctx,S,t,tT+0.4,c.tie+4.4,{kick:"Day two",title:"Cables across the gorge"},{y:40,mid:true});
  hm_card(ctx,S,t,tV+0.4,c.weave+4.4,{kick:"Day three",title:"Woven from both banks"},{y:40,mid:true});
  hm_card(ctx,S,t,tD+0.4,c.how-0.8,{kick:"By that afternoon",title:"A bridge for another year",col:PK.C.green},{y:40,mid:true});
  hm_imagined(ctx,S,t,tA+0.6,c.breath,"The university, 2027 · imagined");
  PK.title(ctx,S,t,c.breath+0.2,"How, more than who","How a team works together","Leading data people · People first",{side:"right",size:64});
});

/* ---------------------------------------------------------------- 2. Less about who */
scene("who",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off);
  const tZ=w("google","studied",-1.0),tG=c.gorge-0.5,tK=w("gorge","In a data team",-0.5),BA=PK.pace(ctx,"carmen",hm_boardA(sc,w)),N2=PK.pace(ctx,null,hm_note2(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"hmBoard",keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BA,{say:[[c.google,E.google],[c.quote,E.quote],[c.safe,E.safe],[c.word,E.word]]});}},
    // the gorge keeps both, from custom
    {at:tG,place:"hmGorge",dis:0.8,keys:[[tG,700,620,1.15]],d:3,draw:(x,tt,cam)=>{hmq_steel(x,1);hmq_bridge(x,{age:0.05});
      hm_bank(x,tt,[["w2",300,800,"twist",false,{len:160}],["keeper",470,720,"clasp",false,{expr:"neutral",gaze:[1,0.4]}],["m4",200,900,HM_CARRY,false,{hold:hmq_coil,holds:true,expr:"smile"}]]);}},
    {at:tK,place:"hmNotes",dis:0.6,keys:[[tK,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N2,{});}}
  ]);
  hm_kick(ctx,S,ag_in(t,0.6,0.6)*(1-hm_apart(t,[[tZ,tG],[tK,1e9]])));
});

/* ---------------------------------------------------------------- 3. Two numbers */
scene("number",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off);
  const tB=c.check-0.4,tS=c.study-0.4,tP=c.stop-0.4,BB=PK.pace(ctx,"jun",hm_boardB(sc,w)),BC=PK.pace(ctx,"carmen",hm_boardC(sc,w));
  const jw=w("wrong","your report",-0.2),tw=w("wrong","your model",-0.3);
  ag_shots(ctx,S,t,sc.dur,[
    // Wednesday: Jun at his desk, with his new model
    {at:0,place:"hmTeam",keys:[[0,960,540,1.0],[c.model,1260,500,1.1]],d:3,draw:(x,tt,cam)=>{
      const R=hm_team(x,tt,{clock:9.5,sam:Object.assign({work:1},hm_alive(tt,{},1,0)),jun:Object.assign({work:1},hm_alive(tt,{expr:"think",gaze:[1,0.4]},2,0)),marta:Object.assign(hm_marta({}),hm_alive(tt,{},3,0))});
      hm_name(x,R.jun,tt,c.model+0.2,tB-0.3,"Jun Park","Analytics engineer",160);}},
    // he writes the two numbers up; Tomás, who built the report; at the table, the two of them, and two who say nothing
    {at:tB,place:"hmTeam",later:true,keys:[[tB,960,540,1.0],[c.tomas,700,600,1.1],[c.wrong,860,560,1.04],[c.quiet,1240,560,1.06],[c.quiet+3,960,540,1.0]],d:3,draw:(x,tt,cam)=>{
      const R=hm_seven(x,tt,{writer:"jun",rows:BB,clock:10,say:[[c.check,E.differ],[jw,w("wrong","Tomás answers",-0.2)]],faces:{
        tomas:hm_sp(tt,6,[[tw,E.wrong]],"neutral",-0.1),
        erin:hm_alive(tt,{expr:"neutral",gaze:[1,0.45]},5,tB),
        marta:hm_alive(tt,{expr:"neutral",gaze:[1,0.4]},2.5,tB)}});
      hm_name(x,R.tomas,tt,c.tomas+0.2,c.wrong-0.4,"Tomás Ortega","Report developer",170);
      hm_bub(x,R.jun,tt,jw,w("wrong","Tomás answers",-0.1),["Your report is wrong."],cam);
      hm_bub(x,R.tomas,tt,tw,E.wrong+0.6,["Your model is new."],cam);}},
    {at:tS,place:"hmBoard",dis:0.8,keys:[[tS,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BC,{say:[[c.study,E.study]]});}},
    // Helena stops it, and says why
    {at:tP,place:"hmTeam",dis:0.8,keys:[[tP,960,540,1.0],[c.stop+1,1240,560,1.08]],d:3,draw:(x,tt,cam)=>{
      const R=hm_seven(x,tt,{writer:"jun",rows:BB,clock:10.2,faces:{helena:PK.face(tt,{expr:hm_talk("neutral",tt,[[w("stop","we've left",-0.1),E.stop]]),gaze:[1,0]},[[c.stop+0.4,"look",2.2,[1,-0.2]],[E.stop+0.8,"nod"]])}});
      hm_bub(x,R.helena,tt,w("stop","we've left",-0.3),E.stop+0.8,["We've left the number,","and started on each other."],cam,{rise:200});}}
  ]);
  hm_imagined(ctx,S,t,0.2,c.model,"The university, 2027 · imagined");
  hm_card(ctx,S,t,0.6,c.model-0.3,{kick:"Wednesday 24 February",title:"Helena's fourth week"},{y:40,mid:true});
  hm_kick(ctx,S,ag_in(t,c.model,0.6)*(1-hm_apart(t,[[c.tomas-0.4,c.wrong],[tS,tP]])));
});

/* ---------------------------------------------------------------- 4. Three things */
scene("three",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off);
  const tN=c.named-0.4,tA=c.answer-0.4,BD=PK.pace(ctx,"helena",hm_boardD(sc,w)),BE=PK.pace(ctx,"carmen",hm_boardE(sc,w));
  const J=[[c.jun1,E.jun1],[c.jun2,E.jun2],[c.jun3,E.jun3]],T=[[c.tom1,E.tom1],[c.tom2,E.tom2],[c.tom3,E.tom3]];
  ag_shots(ctx,S,t,sc.dur,[
    // Helena writes the three things; Jun goes first, then Tomás
    {at:0,place:"hmTeam",later:true,keys:[[0,960,540,1.0],[c.jun1-0.4,1240,520,1.08],[c.tom1-0.4,620,600,1.1],[E.tom3+0.4,960,540,1.0]],d:3,draw:(x,tt,cam)=>{
      const R=hm_seven(x,tt,{rows:BD,clock:10.4,say:[[c.ask,E.ask]],faces:{jun:hm_sp(tt,1,J,"neutral",0),tomas:hm_sp(tt,6,T,"neutral",-0.1)}});
      const lines={jun1:["I saw two numbers","for the same thing."],jun2:["I'm worried: I need people","to trust what we publish."],jun3:["Let's check them side by side,","before either is sent."],
        tom1:["I heard my report called wrong,","before anyone asked what it counts."],tom2:["That stung. I need what I built","read before it's replaced."],tom3:["I ask to be asked."]};
      for(const id in lines)hm_bub(x,id[0]==="j"?R.jun:R.tomas,tt,c[id]-0.1,E[id]+0.3,lines[id],cam,id[0]==="j"?{lean:240,rise:150}:{});}},
    {at:tN,place:"hmBoard",dis:0.8,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BE,{say:[[c.named,E.named],[c.practice,E.practice]]});}},
    // once named, they can be answered: Jun asks
    {at:tA,place:"hmTeam",dis:0.8,keys:[[tA,960,540,1.0],[c.answer+1.4,1100,540,1.06]],d:3,draw:(x,tt,cam)=>{
      const ja=w("answer","what does",-0.2);
      const R=hm_seven(x,tt,{rows:BD,clock:10.6,faces:{jun:hm_sp(tt,1,[[ja,E.answer]],"smile",0),tomas:PK.face(tt,{expr:"smile",gaze:[1,0]},[[ja+0.8,"nod"],[E.answer+0.4,"smile",2.4]])}});
      hm_bub(x,R.jun,tt,ja,E.answer+0.8,["What does your report count?"],cam,{lean:240,rise:150});}}
  ]);
  hm_kick(ctx,S,ag_in(t,0.6,0.6)*(1-hm_apart(t,[[c.tom1-0.4,E.tom3+0.6],[tN,tA]])));
});

/* ---------------------------------------------------------------- 5. A turn each */
scene("turn",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off);
  const tF=c.students-0.5,tG=c.groups-0.4,tO=c.owner-0.4,tL=c.glossary-0.4,BD=PK.pace(ctx,"helena",hm_boardD(sc,()=>-10)),BF=PK.pace(ctx,"helena",hm_boardF(sc,w)),BG=PK.pace(ctx,"carmen",hm_boardG(sc,w)),N3=PK.pace(ctx,null,hm_note3(sc,w));
  const eS=w("erin","The old report",-0.1),mS=w("marta","She says",-0.1);
  ag_shots(ctx,S,t,sc.dur,[
    // a turn each: Erin, who hadn't spoken; Marta, who knows the university's numbers
    {at:0,place:"hmTeam",later:true,keys:[[0,960,540,1.0],[c.erin-0.2,1300,580,1.1],[c.marta-0.2,820,580,1.08],[tF-0.4,960,540,1.0]],d:3,draw:(x,tt,cam)=>{
      const R=hm_seven(x,tt,{rows:BD,clock:10.8,say:[[c.round,E.round]],faces:{erin:hm_sp(tt,5,[[eS,E.erin]],"neutral",0),marta:hm_sp(tt,2,[[mS,E.marta]],"neutral",0)}});
      hm_name(x,R.erin,tt,c.erin+0.2,eS-0.2,"Erin Walsh","Platform engineer",150,-160);
      hm_bub(x,R.erin,tt,eS,E.erin+0.5,["The old report reads","only the student system."],cam,{lean:200,rise:150});
      hm_name(x,R.marta,tt,c.marta+0.2,mS-0.2,"Marta Silva","Data analyst",150);
      hm_bub(x,R.marta,tt,mS,E.marta+0.5,["I can say what","each of them counts."],cam);}},
    // what each counts, written as Marta says it
    {at:tF,place:"hmTeam",later:true,keys:[[tF,960,540,1.0],[c.learners,1000,530,1.05]],d:2,draw:(x,tt,cam)=>{
      hm_seven(x,tt,{rows:BF,clock:11,faces:{marta:hm_sp(tt,2,[[c.students,E.students],[c.learners,E.learners]],"neutral",0)}});}},
    {at:tG,place:"hmBoard",dis:0.8,keys:[[tG,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BG,{say:[[c.groups,E.groups],[c.turns,E.turns]]});}},
    // which number to publish is the registrar's office's: Jun asks, in a ticket
    {at:tO,place:"hmTeam",dis:0.8,keys:[[tO,960,540,1.0],[c.ticket,1200,520,1.06]],d:3,draw:(x,tt,cam)=>{
      const R=hm_seven(x,tt,{rows:BF,clock:11.4,jun:{work:ag_in(tt,c.ticket-0.6,0.5)},showJ:PK.onScreen.chat(ag_in(tt,c.ticket,1.2),{rows:[[0.4,0.5,1],[0.5,0.4,1]]})});
      const ph=R.jun&&R.jun.hc?[R.jun.hc[0]-40,R.jun.hc[1]+60]:[1700,600];
      PK.callout(x,440,36,620,270,ph,ag_io(tt,w("ticket","asks",-0.4),tL-0.3,0.4),(cc,bx,by,bw,bh)=>PK.chat(cc,bx,by,bw,bh,{title:"Ticket · Registrar's office",who:["jun"],me:"jun",
        msgs:[{who:"jun",s:"Census day: students or learners?",at:w("ticket","asks",0)},{who:"jun",s:"Which one do we publish?",at:w("ticket","ticket",0.2)}]},tt,{}));}},
    {at:tL,place:"hmNotes",dis:0.6,keys:[[tL,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N3,{});}}
  ]);
  hm_kick(ctx,S,ag_in(t,0.6,0.6)*(1-hm_apart(t,[[tG,tO],[w("ticket","asks",-0.4),1e9]])));
});

/* ---------------------------------------------------------------- 6. One page */
scene("page",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off);
  const tZ=c.meet-0.6,tI=c.trust-0.4,tY=c.gorge-0.4,tK=w("gorge","A team",-0.6),tW=c.wall-0.4;
  const BH=PK.pace(ctx,"helena",hm_boardH(sc,w)),BI=PK.pace(ctx,"carmen",hm_boardI(sc,w)),N4=PK.pace(ctx,null,hm_note4(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"hmTeam",keys:[[0,960,540,1.0],[tZ,1010,530,1.08]],d:2,draw:(x,tt,cam)=>{hm_seven(x,tt,{rows:BH,clock:14,say:[[c.thu,E.thu]]});}},
    {at:tZ,cut:true,place:"hmBoard",keys:[[tZ,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"helena",tt,BH,{say:[[c.thu,E.thu]]});}},
    {at:tI,place:"hmBoard",later:true,keys:[[tI,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BI,{say:[[c.trust,E.trust],[c.charter,E.charter],[c.small,E.small]]});}},
    // at the gorge, the way is passed on by doing it, parents beside children
    {at:tY,place:"hmGorge",dis:0.8,keys:[[tY,620,700,1.25]],d:3,draw:(x,tt,cam)=>{hmq_steel(x,1);hmq_bridge(x,{age:0.1});
      hm_bank(x,tt,[["w2",250,880,"twist",false,{len:120}],["w5",400,930,"twist",false,{len:80,gaze:[1,0.4]}],["keeper",470,740,"clasp",false,{expr:"smile",gaze:[1,0.5]}]]);}},
    {at:tK,place:"hmNotes",dis:0.6,keys:[[tK,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N4,{});}},
    // on Friday, the page is on the wall
    {at:tW,place:"hmTeam",dis:0.8,keys:[[tW,960,540,1.0],[sc.dur,1000,550,1.05]],d:3,draw:(x,tt,cam)=>{hm_seven(x,tt,{rows:BH,clock:9});}}
  ]);
  hm_card(ctx,S,t,0.6,tZ-0.3,{kick:"Thursday 25 February",title:"One page, in their own words"},{y:40,mid:true});
  hm_card(ctx,S,t,tW+0.4,null,{kick:"Friday 26 February",title:"On the wall",col:PK.C.green},{y:40,mid:true});
  hm_kick(ctx,S,ag_in(t,0.6,0.6)*(1-hm_apart(t,[[tZ,tY],[tK,tW]])));
});

/* ---------------------------------------------------------------- 7. Where the bridge stops */
scene("limits",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tL=c.lapse-0.5,tF=c.fell-0.5,tC=c.cut-0.5,tA=c.again-0.5,tN=c.line-0.5,tS=c.steel-0.5,tU=c.custom-0.5,tE=c.each-0.4,tT=c.tomas-0.4,N5=PK.pace(ctx,null,hm_note5(sc,w));
  const fF=w("fell","bridge fell",0),fC=w("cut","cut it down",0);
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"hmGorge",keys:[[0,960,520,1.05]],d:3,draw:(x,tt,cam)=>{hmq_steel(x,1);hmq_bridge(x,{age:0.1,walkers:[hm_on(tt,"m3",0.06,0.94,0.4,14)].filter(Boolean)});
      hm_bank(x,tt,[["w1",170,900,"stand",false,{expr:"smile"}],["m1",440,700,"clasp",false,{}],["w3",1560,740,"stand",true,{expr:"smile"}],["keeper",1700,880,"clasp",true,{}]]);}},
    // around 1970, a steel bridge newly beside it: the bridge left for a time
    {at:tL,place:"hmGorgeGrey",later:true,keys:[[tL,960,500,1.05]],d:3,draw:(x,tt,cam)=>{hmq_steel(x,ag_in(tt,w("lapse","steel",-0.2),1.2),null,true);hmq_bridge(x,{age:0.85,grey:true});
      hm_bank(x,tt,[["keeper",1640,820,"clasp",true,PK.face(tt,{expr:"worry",gaze:[1,0.1]},[[tL+1.4,"look",2.6,[1,0.3]],[E.lapse,"nod"]])]]);}},
    // 2020: the work stops; March 2021: it falls
    {at:tF,place:"hmGorgeGrey",later:true,keys:[[tF,960,500,1.05],[fF+0.6,960,520,1.1]],d:3,draw:(x,tt,cam)=>{hmq_steel(x,1,null,true);hmq_bridge(x,{age:0.9,grey:true,fall:U.sine(U.clamp((tt-fF)/1.6,0,1))});
      hm_bank(x,tt,[["m1",440,700,"clasp",false,PK.face(tt,{expr:"worry",gaze:[1,0.2]},[[tF+1,"look",2.4,[1,0.4]],[fF+0.3,"look",3.0,[1,0.6]]])]]);}},
    // May 2025: cut down in the night
    {at:tC,place:"hmGorgeGrey",later:true,keys:[[tC,960,500,1.05]],d:3,draw:(x,tt,cam)=>{hmq_steel(x,1,null,true);hmq_bridge(x,{age:0.15,grey:true,fall:U.sine(U.clamp((tt-fC)/1.4,0,1))});
      hm_bank(x,tt,[["keeper",1640,820,"clasp",true,PK.face(tt,{expr:"worry",gaze:[1,0.1]},[[fC+0.3,"look",3.0,[1,0.6]],[E.cut+0.4,"nod"]])]]);}},
    // each time, woven again
    {at:tA,place:"hmGorge",later:true,keys:[[tA,960,520,1.05]],d:3,draw:(x,tt,cam)=>{hmq_steel(x,1);hmq_bridge(x,{age:0,k:U.clamp((tt-c.again)/(E.again-c.again+0.4),0,1)});
      hm_bank(x,tt,[["w2",300,800,"twist",false,{len:160}],["m4",200,900,HM_CARRY,false,{hold:hmq_coil,holds:true,expr:"smile"}],["w3",1560,740,"twist",true,{len:150}],["m5",1760,880,HM_CARRY,true,{hold:hmq_coil,holds:true,expr:"smile"}]]);}},
    // the weaving taught inside a builder's own family; the language of the work
    {at:tN,place:"hmGorge",later:true,keys:[[tN,960,520,1.05],[tN+1.8,400,760,1.35]],d:3,draw:(x,tt,cam)=>{hmq_steel(x,1);hmq_bridge(x,{age:0.05});
      hm_bank(x,tt,[["m2",190,860,"twist",false,{len:110}],["m5",400,950,"twist",false,{len:70,gaze:[1,0.4]}]]);}},
    // most people cross on the steel bridge now; visitors on the grass one
    {at:tS,place:"hmGorge",later:true,keys:[[tS,400,760,1.35],[tS+1.8,960,480,1.1]],d:3,draw:(x,tt,cam)=>{hmq_steel(x,1,U.clamp((tt-tS)/8,0,1));
      hmq_bridge(x,{age:0.1,walkers:[hm_on(tt,"v1",0.06,0.94,tS+0.4,tS+14),hm_on(tt,"v2",0.1,0.94,tS+2.4,tS+16)].filter(Boolean)});
      hm_bank(x,tt,[["keeper",1700,880,"clasp",true,{expr:"smile",gaze:[1,0.2]}]]);}},
    // custom settles who does which part
    {at:tU,place:"hmGorge",later:true,keys:[[tU,960,520,1.05],[c.judge,800,560,1.1]],d:3,draw:(x,tt,cam)=>{hmq_steel(x,1);hmq_bridge(x,{age:0.05});
      hm_bank(x,tt,[["w1",170,900,HM_CARRY,false,{hold:hmq_coil,holds:true}],["w2",300,790,"twist",false,{len:150}],["m1",440,700,"clasp",false,{}],["w3",1560,740,"twist",true,{len:150}],["keeper",1700,880,"clasp",true,{}]]);}},
    {at:tE,place:"hmNotes",dis:0.6,keys:[[tE,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N5,{});}},
    // Tomás asked to be asked
    {at:tT,place:"hmTeam",dis:0.8,keys:[[tT,700,600,1.1],[sc.dur,800,580,1.06]],d:3,draw:(x,tt,cam)=>{
      hm_seven(x,tt,{rows:PK.pace(ctx,"helena",hm_boardF(sc,()=>-10)),clock:9.5,faces:{tomas:PK.face(tt,{expr:"smile",gaze:[1,0]},[[c.tomas+1.4,"nod"],[c.tomas+4,"look",2.2,[1,-0.2]]])}});}}
  ]);
  hm_card(ctx,S,t,tL+0.4,c.fell-0.4,{kick:"Around 1970",title:"A steel bridge beside it",col:PK.C.amber},{y:40,mid:true});
  hm_card(ctx,S,t,tF+0.4,fF-0.4,{kick:"2020",title:"The pandemic stops the work",col:PK.C.amber},{y:40,mid:true});
  hm_card(ctx,S,t,fF+0.2,c.cut-0.4,{kick:"March 2021",title:"The bridge falls",col:PK.C.amber},{y:40,mid:true});
  hm_card(ctx,S,t,tC+0.4,c.again-0.4,{kick:"May 2025",title:"Cut down in the night",col:PK.C.amber},{y:40,mid:true});
  hm_card(ctx,S,t,c.again+0.2,c.line-0.4,{kick:"Each time",title:"Woven again",col:PK.C.green},{y:40,mid:true});
  hm_kick(ctx,S,ag_in(t,0.6,0.6)*(1-hm_apart(t,[[tE,tT]])));
});

/* ---------------------------------------------------------------- 8. On Monday */
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off);
  const tO=c.open-0.5,tR=c.read-0.5,tE=c.breath+0.6,BH=PK.pace(ctx,"helena",hm_boardH(sc,()=>-10)),N6=PK.pace(ctx,null,hm_note6(sc,w));
  const iv=w("ivy","opens",-1.6);
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"hmTeam",later:true,keys:[[0,960,540,1.0],[tO,1000,550,1.05]],d:3,draw:(x,tt,cam)=>{hm_seven(x,tt,{rows:BH,clock:9});}},
    {at:tO,place:"hmNotes",dis:0.6,keys:[[tO,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N6,{});}},
    // read the page again each quarter, and whenever someone joins: Monday 1 March, Ivy Reyes opens the door
    {at:tR,place:"hmTeam",dis:0.8,keys:[[tR,960,540,1.0],[c.ivy+2,1080,560,1.08],[tE,1060,550,1.04]],d:3,draw:(x,tt,cam)=>{let Ji=null;
      const look=(i)=>hm_alive(tt,{expr:"smile",gaze:[1,0.2]},i,tR-1.5);
      hm_seven(x,tt,{rows:BH,clock:9,faces:{sam:look(0),jun:look(1),marta:look(2),noor:look(3),yusuf:look(4),erin:look(5),tomas:look(6),helena:look(7)},
        people:[{fl:1030,draw:cc=>{Ji=hm_come(cc,"ivy",tt,2140,1000,iv,iv+4.2,1030,hm_hT(1030),{face:hm_alive(tt,{expr:"smile",gaze:[1,0]},2,iv)});}}]});
      hm_name(x,Ji,tt,Math.max(w("ivy","Ivy Reyes",0),iv+4.4),c.next-0.2,"Ivy Reyes","New graduate",170);}}
  ]);
  hm_card(ctx,S,t,c.ivy+0.2,w("ivy","Ivy Reyes",-0.3),{kick:"Monday 1 March",title:"Someone joins"},{y:40,mid:true});
  hm_card(ctx,S,t,c.next+0.3,E.next+0.6,{kick:"The next film",title:"Many hats, one picture"},{right:true,y:40});
  hm_kick(ctx,S,(1-ag_in(t,tE-0.2,0.6))*(1-hm_apart(t,[[tO,tR]])));
  PK.end(ctx,S,t,tE,"How, more than who",HM_LAST,"Film 4 of 4","People first",{side:"right"});
});
// the chapters that open where the one before ends, or on a board after the team room: glide on, or cut
ag_cutInto(["who","three","turn","monday"]);
