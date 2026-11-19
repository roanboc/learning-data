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

/* ---------------------------------------------------------------- the gorge, through the views this film looks at it from (hm_gorge.js)
   People before roles looks at the bridge from above and from beside its heads, downstream; Wellbeing is in the work from the river
   below, from the bank upstream and at home; No two alike from the high plain where the grass is cut. This film looks from high
   over the bridge's head, across the plain and up the gorge; down on it from the rim; at a stone base as the cables are tied; and
   from up the gorge, past the steel bridge; and on the bank, at the check-in and the braiding of day one (hm_bank.js): each film
   shows the story from places of its own (the author, 18 November 2026). */
const HM_VO=hmq_camera({x:-19.5,y:8.5,z:-7,yaw:66,f:760,hor:250});           // high over the bridge's head: the plain, the gorge, the peaks
const HM_VH=hmq_camera({x:-17,y:5,z:-4.5,yaw:70,f:900,hor:-40});            // from the rim beside its head, down on it and the river
const HM_VB=hmq_camera({x:-19.6,y:2.2,z:-5.6,yaw:48,f:1050,hor:480});        // at the left bank's stone base, the gorge beyond it
const HM_VK=hmq_camera({x:-13.2,y:1.7,z:-4.6,yaw:-8,f:1250,hor:260});        // at the bridge's head, from the rim downstream
const HM_VS=hmq_camera({x:46,y:10,z:156,yaw:200,f:2000,hor:320});            // up the gorge, past the steel bridge, to the rope bridge
AG_PLACES.hmOver=x=>hmq_ground(x,HM_VO,{});AG_PLACES.hmHigh=x=>hmq_ground(x,HM_VH,{});AG_PLACES.hmHighGrey=x=>hmq_ground(x,HM_VH,{grey:true});
AG_PLACES.hmBase=x=>hmq_ground(x,HM_VB,{});AG_PLACES.hmHead=x=>hmq_ground(x,HM_VK,{});AG_PLACES.hmSteel=x=>hmq_ground(x,HM_VS,{});AG_PLACES.hmSteelGrey=x=>hmq_ground(x,HM_VS,{grey:true});
// a view in the sun and under the grey sky of the years the bridge was left are one room: the camera glides on, what changed fades
AG_ROOMS.hmHighGrey="hmHigh";AG_ROOMS.hmSteelGrey="hmSteel";
const HM_COIL={hold:hmq_coil,holds:true};
// the people of a view, as drawables: [who, X, Z, pose, flip, o]; who a name of HMQ_FOLK, or a number (one of the communities'
// people nobody names). o.face a face through the shot (PK.face), or o.expr and o.gaze for one that lives on its own; o.opt
// PK.person's own; o.Y how high they stand (on a stone base); o.k a child's height; o.len a twisted cord's length
const hm_folks=(cam,tt,list)=>list.map(([who,X,Z,pose,flip,o],i)=>{o=o||{};const f=o.face||hm_alive(tt,{expr:o.expr||"neutral",gaze:o.gaze||[1,0]},i%5);
  return hmq_folk(cam,who,X,Z,pose,{t:tt+i*0.7,flip:!!flip,len:o.len,key:o.key,Y:o.Y,k:o.k,after:o.after,opt:Object.assign({},f,o.opt||{})});});
// a walk along the floor of a bridge of that age, from u0 to u1 (z across it), and on over the bank to the points after it
const hm_deck=(u0,u1,z,age,more)=>{const p=[];for(let i=0;i<=24;i++){const [x,y]=hmq_deckAt(PK.u.lerp(u0,u1,i/24),{age});p.push([x,y,z||0]);}return p.concat((more||[]).map(q=>[q[0],0,q[1]]));};
const hm_walk=(cam,who,tt,path,t0,t1,o)=>{o=o||{};return hmq_walker(cam,who,tt,{path,t0,t1,then:o.then,arms:o.arms,k:o.k},{key:o.key,opt:Object.assign({expr:"neutral",gaze:[1,0]},o.opt)});};
// someone on the bridge's floor at u (z across it), kneeling or standing
const hm_onDeck=(cam,who,u,z,pose,o)=>{o=o||{};const [X,Y]=hmq_deckAt(u,o.deck);return hmq_folk(cam,who,X,z,pose,Object.assign({Y},o));};
// the families at both heads of the bridge, as the view from high over its head sees them
const HM_OVERF=[["m4",16.0,-3.0,"clasp",true],["w5",16.6,2.4,HMQ_TWIST,true,{len:0.8}],[2,17.4,-0.8,"stand",true],[3,18.2,3.6,"clasp",true],["w3",16.4,5.6,"stand",true,{opt:HM_COIL}],[4,17.0,-5.4,"stand",true],
  ["w2",-14.6,4.0,HMQ_TWIST,false,{len:0.7}],["m1",-14.8,6.0,"clasp",false],["w1",-14.5,7.6,"stand",false,{opt:HM_COIL}]];
// pulling on a rope: leaning back from it, both hands on it, feet apart; a heave every so often (k: 0 to 1)
const HM_PULL={lean:-14,head:-4,aN:[52,30,"grip"],aF:[46,36,"grip"],lN:[-20,-6],lF:[22,8]},HM_HEAVE={lean:-22,head:-8,aN:[58,26,"grip"],aF:[52,32,"grip"],lN:[-24,-8],lF:[26,10]};
const hm_heave=(tt,i)=>PK.poseMix(HM_PULL,HM_HEAVE,0.5-0.5*Math.cos((tt+i*0.37)*2*Math.PI/2.4));

/* at the bridge's head, made: a builder kneels on its floor, weaving its side, and his grandson kneels at the edge of the stone base
   behind him, watching his hands, then trying the cords at the bridge's head himself; the gorge and its river beyond them */
const HM_KID={mode:"kneel",lean:10,head:16,aN:[22,26],aF:[16,32],lN:[28,-90],lF:[40,-88],fN:70,fF:70},HM_KTRY={mode:"kneel",lean:24,head:14,aN:[56,44,"grip"],aF:[50,52,"grip"],lN:[28,-90],lF:[40,-88],fN:70,fF:70};
function hm_teachKid(x,tt,t0,tq){const c=HM_VK,U=PK.u,tr=U.sine(U.clamp((tt-t0-4.6)/0.5,0,1)),hn=c.P(-14.17,0.82,-0.56),hf=c.P(-14.05,0.78,-0.5);
  return hmq_scene(x,c,{age:0},[hm_onDeck(c,"keeper",0.05,-0.1,HM_WEAVE,{t:tt,flip:false,deck:{},key:"elder",opt:PK.face(tt,{expr:hm_talk("neutral",tt,[[t0+0.8,t0+2.6],[tq+0.4,tq+2.6]]),gaze:[1,0.6]},[[t0+3.0,"look",2.4,[-1,-0.2]],[t0+6.0,"smile",2.2],[tq+3.2,"look",2.0,[-1,-0.2]]])}),
    hmq_folk(c,HMV_BOY,-14.42,-0.32,PK.poseMix(HM_KID,HM_KTRY,tr),{t:tt+1,Y:HMQ_BASE.h,flip:false,k:0.72,key:"young",opt:Object.assign({reachN:[hn[0],hn[1]],reachF:[hf[0],hf[1]],reachNk:tr,reachFk:tr,holds:tr>0.5},
      PK.face(tt,{expr:"think",gaze:[1,0.5]},[[t0+2.0,"look",2.2,[1,0.1]],[t0+6.4,"smile",2.4],[tq+0.6,"nod"]]))})]);}

/* day three, from the rim: the sides and the floor woven from both banks, one builder from each, kneeling on the floor as they go,
   until they meet in the middle (m: 0 to 1); on the far rim, the families watch */
const HM_WEAVE={mode:"kneel",lean:22,head:14,aN:[58,48,"grip"],aF:[50,56,"grip"],lN:[28,-90],lF:[40,-88],fN:70,fF:70};
const HM_FARF=[["m4",16.0,-3.0,"clasp",true],["w5",16.6,2.4,HMQ_TWIST,true,{len:0.8}],[2,17.4,-0.8,"stand",true],[3,18.2,3.6,"clasp",true],["w3",16.4,5.6,"stand",true,{opt:HM_COIL}],[4,17.0,-5.4,"stand",true]];
function hm_weave(x,tt,m,o){o=o||{};const c=HM_VH,U=PK.u,wv=U.lerp(0.1,0.485,U.sine(U.clamp(m,0,1))),bob=a=>PK.poseMix(HM_WEAVE,Object.assign({},HM_WEAVE,{lean:30,aN:[64,40,"grip"],aF:[56,50,"grip"]}),0.5-0.5*Math.cos(tt*2.6+a));
  return hmq_scene(x,c,{age:0,weave:wv},hm_folks(c,tt,HM_FARF).concat([hm_onDeck(c,"m3",wv,-0.1,bob(0),{t:tt,flip:false,deck:{},opt:PK.face(tt,{expr:"think",gaze:[1,0.6]},[[o.meet||1e9,"smile",3]])}),
    hm_onDeck(c,"m5",1-wv,0.1,bob(1.3),{t:tt+1,flip:true,deck:{},opt:PK.face(tt,{expr:"think",gaze:[1,0.6]},[[o.meet||1e9,"smile",3]])})]));}

/* day two at the left bank's stone base: the floor cables pulled taut across the gorge by many hands on both banks (slack, from t0
   to t1); the near one tied already, and a young man kneeling to wind the far one round its post, while the older one, first on its
   tail, guides him; the others pull behind them, and across the gorge more pull at the far base */
const HM_TIE={mode:"kneel",lean:26,head:16,aN:[60,40,"grip"],aF:[54,48,"grip"],lN:[28,-90],lF:[40,-88],fN:70,fF:70};
const HM_PULLERS=[[-16.3,2.3],[-16.8,3.3],[-17.3,4.3],[-17.8,5.3]],HM_EH=[-15.65,1.0,1.42];
function hm_tie(x,tt,t0,t1){const c=HM_VB,U=PK.u,p=U.sine(U.clamp((tt-t0-0.4)/(t1-t0-3.4),0,1)),tk=U.sine(U.clamp((tt-t0-2.8)/(t1-t0-3.8),0,1));
  const tail=[HM_EH].concat(HM_PULLERS.map(q=>[q[0]+0.3,0.95,q[1]-0.55]));
  // his hands on the turns, going round the post's near side as he winds them, higher with each turn
  const w=tt*2.4,yh=HMQ_BASE.h+0.24+0.11*2.5*tk,hand=(a,dy)=>c.P(-14.7-0.27*Math.cos(a),yh+dy,0.85-0.27*Math.sin(a));
  const hN=hand(0.32*Math.sin(w),0.02),hF=hand(0.32*Math.sin(w+1.9)-0.25,-0.03),eN=c.P(HM_EH[0]+0.14,HM_EH[1]-0.01,HM_EH[2]-0.13),eF=c.P(HM_EH[0]-0.14,HM_EH[1]+0.01,HM_EH[2]+0.13);
  return hmq_scene(x,c,{age:0,k:0.45,slack:4.2*(1-p)+0.2},[...hmq_tied(c,-1,1,{k:tk,tail}),...hmq_tied(c,-1,-1,{k:1}),
    hmq_folk(c,"m2",-15.17,0.82,HM_TIE,{t:tt,Y:HMQ_BASE.h,flip:false,key:"young",opt:Object.assign({reachN:[hN[0],hN[1]],reachF:[hF[0],hF[1]],holds:true},
      PK.face(tt,{expr:"think",gaze:[1,0.6]},[[t0+3.6,"look",2.0,[-1,-0.3]],[t0+6.6,"nod"]]))}),
    hmq_folk(c,"keeper",-15.95,1.2,"stand",{t:tt+1,flip:false,key:"elder",opt:Object.assign({reachN:[eN[0],eN[1]],reachF:[eF[0],eF[1]],holds:true},
      PK.face(tt,{expr:hm_talk("neutral",tt,[[t0+2.2,t0+4.0],[t0+5.4,t0+6.8]]),gaze:[1,0.4]},[[t0+4.2,"nod"]]))}),
    // the others on its tail, and across the gorge more pull at the far base
    ...["m4","m5",6,8].map((who,i)=>hmq_folk(c,who,HM_PULLERS[i][0],HM_PULLERS[i][1],hm_heave(tt,i),{t:tt+2+i,flip:true,opt:Object.assign({holds:true},hm_alive(tt,{expr:"neutral",gaze:[1,0.1]},i,t0))})),
    ...["m1","m3",10,12].map((who,i)=>hmq_folk(c,who,16.6+i*1.1,-0.85,hm_heave(tt,i+4),{t:tt+3+i,flip:false,opt:{holds:true}}))]);}

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
  const tH=c.hold-0.5,tC=c.cord-0.5,tB=c.braid-0.5,tT=c.tie-0.5,tV=c.weave-0.5,tD=c.done-0.5,tN=c.how-0.4,tA=c.data-0.5,N1=PK.pace(ctx,null,hm_note1(sc,w));
  const tI=w("tire","tires",0),give=w("cord","checked",-0.2),meet=w("weave","meet",0);
  ag_shots(ctx,S,t,sc.dur,[
    // at the head of the bridge, the families of the four communities; two people cross it, one each way
    {at:0,place:"hmOver",keys:[[0,960,540,1.0],[c.june,960,555,1.04],[tH,970,580,1.08]],d:4,draw:(x,tt,cam)=>{
      hmq_scene(x,HM_VO,{age:0.05},hm_folks(HM_VO,tt,HM_OVERF).concat([hm_walk(HM_VO,"m3",tt,hm_deck(0.02,0.98,-0.15,0.05,[[16.4,-0.6],[18.6,-1.4]]),-4,24),
        hm_walk(HM_VO,"w4",tt,hm_deck(0.98,0.05,0.15,0.05),2,30)]));}},
    // from the rim above its head: someone crossing, about fifteen metres above the river; every cord of it holds them
    {at:tH,place:"hmHigh",cut:true,keys:[[tH,960,540,1.0],[c.need,900,600,1.14],[c.way,960,540,1.0]],d:4,draw:(x,tt,cam)=>{
      hmq_scene(x,HM_VH,{age:0.05},hm_folks(HM_VH,tt,HM_FARF).concat([hm_walk(HM_VH,"m5",tt,hm_deck(0.02,0.98,-0.12,0.05,[[16.2,-0.4],[17.6,-1.8]]),tH-2,tH+20),
        hm_walk(HM_VH,"w4",tt,hm_deck(0.96,0.04,0.12,0.05),tH+3,tH+26)]));}},
    // day one, on the bank: every family's cord checked in, and laid in rows (hm_bank.js)
    {at:tC,place:"hmCheck",cut:true,keys:[[tC,960,540,1.0],[give+1.6,1010,560,1.1],[c.part+1.2,900,520,1.04]],d:4,draw:(x,tt,cam)=>{hmv_check(x,tt,tC,give);}},
    // three ropes braided into each cable; when the one who braids tires, another takes his place
    {at:tB,place:"hmBraid",cut:true,keys:[[tB,960,540,1.0],[tI-0.6,880,580,1.12]],d:4,draw:(x,tt,cam)=>{hmv_braid(x,tt,tB,tI);}},
    // day two: many hands pull the cables across the gorge and tie them to the stone bases, the older guiding the younger
    {at:tT,place:"hmBase",cut:true,keys:[[tT,960,540,1.0],[c.tie+2.4,900,560,1.06],[tV-0.4,920,550,1.04]],d:4,draw:(x,tt,cam)=>{hm_tie(x,tt,tT,tV);}},
    // day three: woven from both banks, until the two builders meet in the middle
    {at:tV,place:"hmHigh",cut:true,keys:[[tV,960,540,1.0],[meet,1020,600,1.12]],d:4,draw:(x,tt,cam)=>{hm_weave(x,tt,(tt-c.weave-0.2)/(meet-c.weave-0.2),{meet:meet+0.2});}},
    // that afternoon: a bridge for another year, people crossing it, the families at its head
    {at:tD,place:"hmOver",cut:true,keys:[[tD,970,575,1.08],[c.how-0.4,960,540,1.0]],d:4,draw:(x,tt,cam)=>{
      hmq_scene(x,HM_VO,{age:0},hm_folks(HM_VO,tt,HM_OVERF.map(r=>[r[0],r[1],r[2],r[3],r[4],Object.assign({expr:"smile"},r[5]||{})])).concat([
        hm_walk(HM_VO,"m3",tt,hm_deck(0.04,0.98,-0.15,0),tD-3,tD+18),hm_walk(HM_VO,"m5",tt,hm_deck(0.96,0.05,0.15,0),tD-8,tD+14),hm_walk(HM_VO,7,tt,hm_deck(0.98,0.3,-0.1,0),tD+1,tD+30)]));}},
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
  hm_card(ctx,S,t,tV+0.4,c.weave+4.4,{kick:"Day three",title:"Woven from both banks"},{y:40});
  hm_card(ctx,S,t,tD+0.4,c.how-0.8,{kick:"By that afternoon",title:"A bridge for another year",col:PK.C.green},{y:40,mid:true});
  hm_imagined(ctx,S,t,tA+0.6,c.breath,"The university, 2027 · imagined");
  PK.title(ctx,S,t,c.breath+0.2,"How, more than who","How a team works together","Leading data people · People first",{side:"right",size:64});
});

/* ---------------------------------------------------------------- 2. Less about who */
scene("who",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off);
  const tZ=w("google","studied",-1.0),tG=c.gorge-0.5,tK=w("gorge","In a data team",-0.5),BA=PK.pace(ctx,"carmen",hm_boardA(sc,w)),N2=PK.pace(ctx,null,hm_note2(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"hmBoard",keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BA,{say:[[c.google,E.google],[c.quote,E.quote],[c.safe,E.safe],[c.word,E.word]]});}},
    // the gorge has both, from custom: each family's cord, promised and checked in; each community's part, known
    {at:tG,place:"hmCheck",dis:0.8,keys:[[tG,960,540,1.0],[tK,900,540,1.06]],d:3,draw:(x,tt,cam)=>{hmv_check(x,tt,tG,tG+2.4);}},
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
      hm_name(x,R.erin,tt,c.erin+0.2,eS-0.2,"Erin Walsh","Platform engineer",250,-160);
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
    // the notebook's glossary has the two words the board has: cut, so they never show twice
    {at:tL,place:"hmNotes",cut:true,keys:[[tL,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N3,{});}}
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
    {at:tY,place:"hmBraid",dis:0.8,keys:[[tY,960,540,1.0],[tK,1060,600,1.12]],d:3,draw:(x,tt,cam)=>{hmv_braid(x,tt,tY,1e9,{kids:true});}},
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
  const fF=w("fell","bridge fell",0),fC=w("cut","cut it down",0),sw=w("lapse","steel",-0.2);
  ag_shots(ctx,S,t,sc.dur,[
    // still, each June, four communities at its head, and people crossing it
    {at:0,place:"hmOver",keys:[[0,980,575,1.06],[tL,960,540,1.0]],d:3,draw:(x,tt,cam)=>{
      hmq_scene(x,HM_VO,{age:0.1},hm_folks(HM_VO,tt,HM_OVERF).concat([hm_walk(HM_VO,"m3",tt,hm_deck(0.04,0.98,-0.15,0.1),-3,20),hm_walk(HM_VO,"w4",tt,hm_deck(0.96,0.05,0.15,0.1),-8,16)]));}},
    // around 1970: a steel bridge newly built up the gorge; the bridge of grass, left for a time, sags and greys
    {at:tL,place:"hmSteelGrey",cut:true,keys:[[tL,960,540,1.0],[c.fell-0.6,920,520,1.08]],d:3,draw:(x,tt,cam)=>{
      hmq_scene(x,HM_VS,{age:0.85,grey:true,steel:ag_in(tt,sw,1.2)},[hm_walk(HM_VS,"m1",tt,[hmq_steelAt(0.12,0.2),hmq_steelAt(0.9,0.2)],sw+1.4,sw+14)]);}},
    // 2020: the work stops; March 2021: the bridge falls, in two, into the gorge
    {at:tF,place:"hmHighGrey",cut:true,keys:[[tF,960,540,1.0],[fF+0.6,940,600,1.08]],d:3,draw:(x,tt,cam)=>{
      hmq_scene(x,HM_VH,{age:0.9,grey:true,fall:U.sine(U.clamp((tt-fF)/1.6,0,1))},hm_folks(HM_VH,tt,[["keeper",16.2,-2.2,"clasp",true,{face:PK.face(tt,{expr:"worry",gaze:[1,0.3]},[[fF+0.3,"look",3.0,[1,0.7]]])}],
        ["m1",16.8,1.8,"stand",true,{face:PK.face(tt,{expr:"worry",gaze:[1,0.3]},[[fF+0.5,"look",3.0,[1,0.6]]])}]]));}},
    // May 2025: cut loose in the night, it falls to the river
    {at:tC,place:"hmHighGrey",later:true,keys:[[tC,960,540,1.0],[fC+0.6,960,620,1.06]],d:3,draw:(x,tt,cam)=>{
      hmq_scene(x,HM_VH,{age:0.15,grey:true,cut:U.sine(U.clamp((tt-fC)/1.4,0,1))},[]);}},
    // each time, woven again, from both banks
    {at:tA,place:"hmHigh",later:true,keys:[[tA,960,540,1.0],[c.line-0.4,960,560,1.04]],d:3,draw:(x,tt,cam)=>{
      hmq_scene(x,HM_VH,{age:0,k:Math.max(0.04,U.clamp((tt-c.again)/(E.again-c.again+0.6),0,1))},hm_folks(HM_VH,tt,HM_FARF));}},
    // the weaving is taught inside a builder's own family: at the bridge's head, a grandfather shows a grandson; the language of the work
    {at:tN,place:"hmHead",cut:true,keys:[[tN,960,540,1.0],[c.quechua,1010,560,1.06]],d:3,draw:(x,tt,cam)=>{hm_teachKid(x,tt,tN,c.quechua);}},
    // most people cross on the steel bridge now, on foot and by truck; visitors cross the bridge of grass, down the gorge
    {at:tS,place:"hmSteel",cut:true,keys:[[tS,960,540,1.0],[c.custom-0.6,1000,520,1.08]],d:3,draw:(x,tt,cam)=>{const k=U.clamp((tt-tS)/(c.custom-tS),0,1);
      hmq_scene(x,HM_VS,{age:0.1,truck:U.lerp(0.95,0.05,k)},[hm_walk(HM_VS,"w3",tt,[hmq_steelAt(0.1,-0.3),hmq_steelAt(0.95,-0.3)],tS-2,tS+16),hm_walk(HM_VS,"m5",tt,[hmq_steelAt(0.85,0.35),hmq_steelAt(0.05,0.35)],tS-4,tS+12),
        hm_walk(HM_VS,"v1",tt,hm_deck(0.05,0.95,-0.1,0.1),tS-3,tS+16),hm_walk(HM_VS,"v2",tt,hm_deck(0.02,0.92,0.1,0.1),tS-1,tS+18)]);}},
    // custom settles who does which part: who makes the cord, who braids the cables (hm_bank.js)
    {at:tU,place:"hmBraid",cut:true,keys:[[tU,960,540,1.0],[c.judge,900,560,1.08]],d:3,draw:(x,tt,cam)=>{hmv_braid(x,tt,tU,1e9);}},
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
