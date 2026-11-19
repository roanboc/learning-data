/* ===== Wellbeing is in the work: the chapters, shot by shot =====
   The film moves between people and its key ideas (the author, 17 November 2026). In a scene, people are whole and do what the line
   says, and the words on the frame are where and when, a name, or what someone says. The ideas are explained at a board, by Carmen
   Vidal, a consultant, or by Helena; what to keep is a page of Helena's notebook (ww_uni.js). People also talk from where they are:
   Marta's requests come in on her screen, and Helena's five questions on Jun's. And they meet face to face: Helena and Marta write
   Marta's week together, and Helena takes it to the nine who asked. Every time comes from the voice: a line's start (sc.cues) or a
   word in it (wAt), so the pictures stay with the voice if it's recorded again; the score (tools/score.py) takes the same words. A shot
   is one stay in a place: the camera glides between its keys; between places the film cuts where the same people go on, and dissolves
   where the whole picture changes. Sizes are in the 1920 x 1080 frame; people's sizes come from each place's eye line. */
const WW_LAST="Fix the work before you ask people to cope.";
const ww_kick=(ctx,S,a)=>{if(a>0.004){setScreen(ctx,S);PK.kicker(ctx,2,"Wellbeing is in the work",a);}};
function ww_card(ctx,S,t,t0,t1,d,o){o=o||{};const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a<=0.004)return;setScreen(ctx,S);PK.card(ctx,o.mid?960:o.right?1848:72,o.y==null?146:o.y,d,a,{align:o.mid?"center":o.right?"right":"left"});}
const ww_imagined=(ctx,S,t,t0,t1,text)=>{const a=ag_io(t,t0,t1,0.5);if(a>0.004){setScreen(ctx,S);PK.sceneTag(ctx,text,a);}};
const ww_bub=(x,J,tt,t0,t1,lines,cam,o)=>PK.say(x,J,lines,ag_io(tt,t0,t1==null?1e9:t1,0.3),Object.assign({cam},o||{}));
const ww_name=(x,J,tt,t0,t1,name,role,dy,dx)=>{if(J)PK.nameTag(x,J.hc[0]+(dx||0),J.hc[1]-(dy||150),name,role,ag_io(tt,t0,t1,0.4));};
// while a chapter shows a key idea apart from the scene (a board seen close, a page of the notebook), its kicker steps back
const ww_apart=(t,spans)=>spans.reduce((m,[a,b])=>Math.max(m,ag_in(t,a-0.4,0.35)*(1-ag_in(t,b,0.35))),0);
// someone who stays a while takes in what goes on: a look, a nod, a smile, every few seconds (i: who they are, so no two move together)
const ww_alive=(tt,base,i,t0)=>{const ev=[],K=["look","nod","smile"];for(let k=0;k<30;k++){const at=(t0||0)+2.5+i*1.37+k*5.9,kind=K[(k+i)%3];ev.push(kind==="look"?[at,"look",2.2,[1,((k+i)%2?0.35:-0.2)]]:kind==="smile"?[at,"smile",2.4]:[at,"nod"]);}
  return PK.face(tt,Object.assign({expr:"neutral",gaze:[1,0]},base||{}),ev);};

/* ---------------------------------------------------------------- the gorge, through the views this film looks at it from (ww_gorge.js)
   People before roles looks at the bridge from above and from its heads, downstream; this film looks at it from the river below and
   from the bank upstream, and goes home with a family (ww_home.js), so each film of the series shows the story from places of its own
   (the author, 18 November 2026). */
const WW_VR=wwq_camera({x:-1.5,y:-14.6,z:-34,yaw:4,f:900,hor:1010,clouds:{fair:[[640,118,1.1],[1300,66,0.9]],grey:[[520,92,1.6],[1080,58,1.9],[1560,116,1.5]]}});    // from the river, downstream: the bridge high above it
const WW_VU=wwq_camera({x:-22,y:3.4,z:8,yaw:128,f:1000,hor:330});       // from the left bank, upstream: the bridge's head, and its span
AG_PLACES.wwGorgeR=x=>wwq_ground(x,WW_VR,{});AG_PLACES.wwGorgeRGrey=x=>wwq_ground(x,WW_VR,{grey:true});AG_PLACES.wwGorgeU=x=>wwq_ground(x,WW_VU,{});
// the river's view in the sun and under the grey sky of the years it was left are one room: the camera glides on, what changed fades
AG_ROOMS.wwGorgeRGrey="wwGorgeR";
const WW_COIL={hold:wwq_coil,holds:true};
// the people of a view, as drawables: [who, X, Z, pose, flip, o]; who a name of WWQ_FOLK, or a number (one of the communities' people
// nobody names). o.face a face through the shot (PK.face), or o.expr and o.gaze for one that lives on its own; o.opt PK.person's own;
// o.Y how high they stand (on a stone base); o.len a twisted cord's length
const ww_folks=(cam,tt,list)=>list.map(([who,X,Z,pose,flip,o],i)=>{o=o||{};const f=o.face||ww_alive(tt,{expr:o.expr||"neutral",gaze:o.gaze||[1,0]},i%5);
  return wwq_folk(cam,who,X,Z,pose,{t:tt+i*0.7,flip:!!flip,len:o.len,key:o.key,Y:o.Y,after:o.after,opt:Object.assign({},f,o.opt||{})});});
// a walk along the floor of a bridge of that age, from u0 to u1 (z across it), and on over the bank to the points after it
const ww_deck=(u0,u1,z,age,more)=>{const p=[];for(let i=0;i<=24;i++){const [x,y]=wwq_deckAt(PK.u.lerp(u0,u1,i/24),{age});p.push([x,y,z||0]);}return p.concat((more||[]).map(q=>[q[0],0,q[1]]));};
const ww_walk=(cam,who,tt,path,t0,t1,o)=>{o=o||{};return wwq_walker(cam,who,tt,{path,t0,t1,then:o.then,arms:o.arms,k:o.k},{key:o.key,opt:Object.assign({expr:"neutral",gaze:[1,0]},o.opt)});};
// the families at both heads of the bridge, at the rims' edge, as the river's view sees them
const WW_RIMR=[["w2",-14.5,-2.6,WWQ_TWIST,false,{len:0.8}],["m1",-14.4,4.0,"clasp"],["w1",-14.3,-5.2,"stand",false,{opt:WW_COIL}],[0,-14.4,8.0,"stand"],[1,-14.5,12.0,WWQ_TWIST],
  ["m4",14.4,-3.4,"clasp",true],["w5",14.5,6.0,WWQ_TWIST,true,{len:0.8}],[2,14.4,9.6,"stand",true],[3,14.4,13.4,"clasp",true]];
// the families on the left bank, upstream of the bridge's head, as the view from upstream sees them; two more across the gorge
const WW_FAMU=[["w2",-15.6,2.6,WWQ_TWIST,true,{len:0.8}],["m1",-17.8,2.2,"clasp",true],["w1",-19.0,0.2,"stand",true,{opt:WW_COIL}],["w3",-17.0,-2.8,"stand",true,{opt:WW_COIL}],
  [0,-20.6,-2.6,WWQ_TWIST,false,{len:0.7}],["m4",15.6,2.4,"clasp",true],["w5",16.4,-1.8,WWQ_TWIST,true,{len:0.8}]];
// as the bridge is made: about a thousand people, along both rims (some of them, as the river's view sees them)
// (seen from below, someone nearer stands higher up the picture: a line along each rim, a step or two apart, nobody over another)
const WW_CROWD=[["w1",-14.4,-6.0,"stand",false,{opt:WW_COIL}],["w2",-14.5,-1.9,WWQ_TWIST,false,{len:0.8}],["m1",-14.4,2.2,"clasp"],["m4",14.4,-2.8,"clasp",true],["w5",14.5,2.6,WWQ_TWIST,true,{len:0.8}]]
  .concat([-12.6,-10.4,-8.2,-3.9,4.6,7.0,9.6,12.4].map((z,i)=>[10+i,-14.4,z,i%3===1?WWQ_TWIST:i%3===2?"clasp":"stand",false,i%2?{}:{opt:WW_COIL}]))
  .concat([-11.6,-9.4,-7.2,-5.0,5.0,7.6,10.2,13.0].map((z,i)=>[20+i,14.4,z,i%3===0?WWQ_TWIST:i%3===1?"stand":"clasp",true,i%2?{opt:WW_COIL}:{}]));

// Marta at her desk, turned to her screen or to the room; who: more people in the room ({fl, draw})
const ww_marta=(o)=>Object.assign({work:1,turn:0},o||{});
// someone who comes to a desk: walks in from x0 to x1 between t0 and t1, then stands (pose), flipped to face left when x1 < x0
const ww_come=(cc,who,tt,x0,x1,t0,t1,fl,h,o)=>{o=o||{};const flip=x1<x0;if(tt<t1)return PK.walk(cc,who,tt,{x0,x1,t0,t1,floor:fl,h,then:o.then||"stand"},Object.assign({flip},o.face||{}));
  return PK.person(cc,who,x1,fl,h,o.then||"stand",Object.assign({t:tt,flip},o.face||{}));};

/* ---------------------------------------------------------------- 1. Before it falls */
scene("bridge",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tU=c.who-0.5,tW=c.wears-0.5,tG=c.sag-0.5,tM=c.missed-0.5,tN=c.custom-0.6,tJ=c.june-0.5,tP=w("june","and people",-0.3),tA=c.team-0.6,tF=w("fell","fell",-0.2);
  ag_shots(ctx,S,t,sc.dur,[
    // from the river: the bridge of grass high above it, two people crossing; at its heads, along the rims, the families
    {at:0,place:"wwGorgeR",keys:[[0,960,600,1.0],[c.where+2.6,960,520,1.14]],d:4,draw:(x,tt,cam)=>{
      wwq_scene(x,WW_VR,{age:0.05},ww_folks(WW_VR,tt,WW_RIMR).concat([ww_walk(WW_VR,"m3",tt,ww_deck(0.03,0.97,-0.2,0.05),-3,28),ww_walk(WW_VR,"w4",tt,ww_deck(0.97,0.03,0.2,0.05),-1,31)]));}},
    // from the bank upstream, by the bridge's head: the families who look after it, twisting cord, carrying it; someone crosses
    {at:tU,place:"wwGorgeU",cut:true,keys:[[tU,960,540,1.0],[c.since+0.4,900,560,1.1]],d:4,draw:(x,tt,cam)=>{
      wwq_scene(x,WW_VU,{age:0.05},ww_folks(WW_VU,tt,WW_FAMU).concat([ww_walk(WW_VU,"m5",tt,ww_deck(0.95,0.08,0.1,0.05,[[-15.6,0.4],[-17.6,2.4]]),tU-6,c.since+9)]));}},
    // sun, rain and wind, all year: the rope weakens; one man crosses, slowly
    {at:tW,place:"wwGorgeRGrey",dis:0.9,keys:[[tW,960,560,1.04],[c.sag-1.0,960,500,1.14]],d:3,draw:(x,tt,cam)=>{
      wwq_scene(x,WW_VR,{age:0.32,grey:true},[ww_walk(WW_VR,"m3",tt,ww_deck(0.12,0.9,0,0.32),tW-3,tW+24)]);
      wwq_rain(x,tt,ag_io(tt,w("wears","rain",-0.2),tG-0.3,0.6),ag_in(tt,w("wears","wind",-0.2),0.8));}},
    // five months after one renewal: a visitor finds it sagging in the middle, one handrail lower; someone crosses it all the same
    {at:tG,place:"wwGorgeU",dis:0.9,keys:[[tG,960,540,1.0],[w("sag","sagging",-0.2),820,520,1.16]],d:3,draw:(x,tt,cam)=>{
      const wr=ag_io(tt,w("sag","visitor",0),c.missed,0.5);
      wwq_scene(x,WW_VU,{age:0.55,tilt:1},ww_folks(WW_VU,tt,[["v1",-18.4,1.8,PK.poseMix("stand",WW_NOTE,wr),true,{face:PK.face(tt,{expr:"think",gaze:[1,0.1+0.5*wr]},[[w("sag","sagging",0),"look",2.6,[1,-0.2]],[w("holds","Wait",0),"look",2.2,[1,0]]]),
        opt:{underF:ww_openNote({side:-1,lines:Math.round(1+3*U.clamp((tt-w("sag","visitor",0))/6,0,1))}),hold:wr>0.3?PK.inHand.pen("ink"):null,holds:true}}]]).concat([ww_walk(WW_VU,"w4",tt,ww_deck(0.94,0.1,0,0.55,[[-15.6,-0.6],[-16.8,-2.6]]),c.holds-0.6,c.missed+2.4)]));}},
    // 2020: not renewed; March 2021, at twenty-one months old, it falls into the river; on the rims, people who can't cross now
    {at:tM,place:"wwGorgeRGrey",dis:0.9,keys:[[tM,960,560,1.0],[c.fell+1.2,960,620,1.04]],d:3,draw:(x,tt,cam)=>{
      wwq_scene(x,WW_VR,{age:0.9,grey:true,fall:U.sine(U.clamp((tt-tF)/1.6,0,1))},ww_folks(WW_VR,tt,[["keeper",-14.4,-3.4,"clasp",false,{face:PK.face(tt,{expr:"worry",gaze:[1,0.1]},[[tM+1.2,"look",2.6,[1,0.3]],[tF+0.3,"look",3.0,[1,0.6]],[c.fell+3.0,"nod"]])}],
        ["m1",14.4,-2.8,"clasp",true,{expr:"worry"}],[4,-14.4,4.0,"stand",false,{expr:"worry"}],[5,14.4,5.2,"stand",true]]));}},
    // so the communities don't wait for that: each year, on a date, they make the whole bridge new; about a thousand weave it in three days
    {at:tN,place:"wwGorgeR",later:true,keys:[[tN,960,560,1.0],[c.three+0.2,960,520,1.12]],d:3.2,draw:(x,tt,cam)=>{
      const k=U.clamp((tt-c.custom)/(c.june-c.custom-0.6),0,1);wwq_scene(x,WW_VR,{age:0,k:Math.max(0.04,k)},ww_folks(WW_VR,tt,WW_CROWD));}},
    // June 2021: at home, a family makes its cord again (ww_home.js)
    {at:tJ,place:"wwHome",cut:true,keys:[[tJ,960,540,1.0],[tP,930,560,1.06]],d:4,draw:(x,tt,cam)=>{wwv_family(x,tt,tJ);}},
    // and people cross it on foot today; its rope lasts a year or two, the bridge more than five hundred years
    {at:tP,place:"wwGorgeR",cut:true,keys:[[tP,960,500,1.16],[c.lasts+1.6,960,600,1.0]],d:4,draw:(x,tt,cam)=>{
      wwq_scene(x,WW_VR,{age:0},ww_folks(WW_VR,tt,WW_RIMR).concat([ww_walk(WW_VR,"m5",tt,ww_deck(0.03,0.97,-0.2,0),tP-5,tP+26),ww_walk(WW_VR,"w4",tt,ww_deck(0.97,0.03,0.2,0),tP-1,tP+30)]));}},
    // a team's work is arranged too, and people stand on it every day: Marta at her desk, the requests coming in
    {at:tA,place:"wwTeam",dis:1.0,keys:[[tA,960,540,1.0],[c.shows-0.2,700,560,1.16],[c.breath,960,540,1.0]],d:3,draw:(x,tt,cam)=>{
      const wo=ag_in(tt,c.shows,0.6)*(1-ag_in(tt,c.look+0.4,0.8));
      ww_team(x,tt,{clock:16.2,show:PK.onScreen.chat(0.6+0.4*Math.sin(tt*0.6),{}),marta:Object.assign(ww_marta({work:1-0.6*ag_in(tt,c.look+0.4,0.8)}),
        PK.face(tt,{expr:PK.exprMix("neutral","worry",wo),gaze:[1,0.2]},[[c.look+1.2,"smile",3]])),
        sam:Object.assign({work:1},ww_alive(tt,{},1,tA)),jun:Object.assign({work:1},ww_alive(tt,{},2,tA))});}}
  ]);
  ww_card(ctx,S,t,c.where+0.4,c.who-0.4,{kick:"Quehue, Cusco, Peru",title:"The Apurímac river",sub:"A bridge of grass rope"},{y:40,mid:true});
  ww_card(ctx,S,t,c.who+0.2,c.since-0.3,{kick:"Four communities",title:"Huinchiri · Chaupibanda · Choccayhua · Ccollana Quehue"},{y:40,mid:true});
  ww_card(ctx,S,t,c.sag+0.2,c.holds-0.4,{kick:"Five months after one renewal",title:"Sagging in the middle",col:PK.C.amber},{y:40,mid:true});
  ww_card(ctx,S,t,c.missed+0.2,c.fell-0.4,{kick:"2020",title:"Not renewed",col:PK.C.amber},{y:40,mid:true});
  ww_card(ctx,S,t,c.fell+0.2,c.need-0.6,{kick:"March 2021",title:"Twenty-one months old",col:PK.C.amber},{y:40,mid:true});
  ww_card(ctx,S,t,c.custom+0.4,c.three-0.3,{kick:"Each year",title:"On a date",col:PK.C.blue},{y:40,mid:true});
  ww_card(ctx,S,t,c.three+0.1,c.june-0.6,{kick:"About 1,000 people",title:"Three days",col:PK.C.orange},{y:40,mid:true});
  ww_card(ctx,S,t,tJ+1.4,tP-0.3,{kick:"June 2021",title:"At home in Quehue"},{y:40,mid:true});
  ww_card(ctx,S,t,w("lasts","By its",-0.2),c.team-0.8,{kick:"The bridge, by its people's account",title:"More than 500 years"},{y:40,mid:true});
  PK.title(ctx,S,t,c.breath+0.2,"Wellbeing is in the work","Fix the work before you ask people to cope","Leading data people · People first",{side:"right",size:64});
});

/* ---------------------------------------------------------------- 2. Fourteen, all urgent */
scene("fourteen",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tM=c.marta-0.5,tL=c.last-0.4,tC=w("cope","cope",-0.8),N1=PK.pace(ctx,null,ww_note1(sc,w));
  const ask=[w("urgent","urgent",-0.2),w("urgent","urgent",0.5),w("last","order",0),w("last","last",0)];
  ag_shots(ctx,S,t,sc.dur,[
    // February: Helena walks up the path to the building
    {at:0,place:"wwCampus",keys:[[0,960,540,1.0],[tM,1100,560,1.08]],d:3,draw:(x,tt,cam)=>{
      PK.walk(x,PK.extra(5),tt,{x0:1420,x1:2100,t0:1.0,t1:9,floor:WW_CA.way(1500),h:ww_hC(WW_CA.way(1500))},{far:0.3});
      const J=PK.walk(x,"helena",tt,{x0:200,x1:1440,t0:0.4,t1:tM+0.6,floor:xx=>WW_CA.way(xx),h:fl=>ww_hC(fl)},{expr:"smile",gaze:[1,0]});
      ww_name(x,J,tt,c.helena+1.2,tM-0.3,"Helena Novak","Data manager",170);}},
    // Marta at her desk: the requests come in on her screen, each called urgent; two people come to her desk, and the last asks first
    {at:tM,place:"wwTeam",dis:0.8,keys:[[tM,700,560,1.12],[c.blame-0.3,820,560,1.06]],d:3,draw:(x,tt,cam)=>{
      const R=ww_team(x,tt,{clock:10.2,sam:Object.assign({work:1},ww_alive(tt,{},1,tM)),jun:Object.assign({work:1},ww_alive(tt,{},2,tM)),show:PK.onScreen.chat(0.8,{}),
        marta:Object.assign(ww_marta({turn:ag_io(tt,c.last+0.3,c.blame+1.4,0.5)}),PK.face(tt,{expr:"neutral",gaze:[1,0.2]},[[w("marta","Marta",0.2),"look",2.4,[1,0]],[c.urgent+0.6,"look",2.0,[1,-0.1]],[c.blame+2.0,"nod"]])),
        people:[{fl:905,draw:cc=>{const J=ww_come(cc,PK.extra(21),tt,2150,900,w("last","last",0.4),w("last","last",3.2),905,ww_hT(905),{face:PK.face(tt,{expr:"neutral",gaze:[1,0]},[[c.blame+1.0,"look",2.2,[1,0.2]]])});}},
          {fl:935,draw:cc=>{const J=ww_come(cc,PK.extra(24),tt,2250,780,w("last","last",-0.4),w("last","last",2.2),935,ww_hT(935),{face:PK.face(tt,{expr:ww_says("smile",tt,w("last","last",2.2),c.blame+2.4),gaze:[1,0]},[[c.blame+3.4,"look",2.0,[1,0.3]]])});
            ww_bub(cc,J,tt,w("last","last",2.2),c.blame+2.6,["Can you do mine first?"],cam,{dx:160});}}]});
      ww_name(x,R.marta,tt,c.marta+0.4,c.urgent-0.2,"Marta Silva","Data analyst",null,120);
      PK.callout(x,880,70,640,330,[470,560],ag_io(tt,c.urgent-0.4,w("last","last",0.4),0.4),(cc,bx,by,bw,bh)=>PK.chat(cc,bx,by,bw,bh,ww_inbox(ask,{n:2}),tt,{}));}},
    // what she could ask of Marta, and where she looks instead: a page of her notebook
    {at:tC,place:"wwNotes",dis:0.6,keys:[[tC,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N1,{});}}
  ]);
  ww_imagined(ctx,S,t,0.2,tM-0.3,"The university, 2027 · imagined");
  ww_card(ctx,S,t,0.6,tM-0.3,{kick:"February 2027",title:"At the university"});
  ww_card(ctx,S,t,c.blame+0.2,tC-0.3,{kick:"Eleven ways in",title:"Nobody sees the others' requests",col:PK.C.amber},{right:true});
  ww_kick(ctx,S,ag_in(t,1.0,0.6)*(1-ww_apart(t,[[tC,1e9]])));
});

/* ---------------------------------------------------------------- 3. One week, on one page */
scene("page",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tP=c.asks-0.6,tH=c.helps-0.5,tR=c.jdr-0.6,tZ=w("jdr","job demands",-0.9),N2=PK.pace(ctx,null,ww_note2(sc,w)),BA=PK.pace(ctx,"carmen",ww_boardA(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // Monday the eighth, their weekly half-hour: Marta across the table from Helena, who writes
    {at:0,place:"wwCorner",keys:[[0,960,540,1.0],[tP,900,560,1.08]],d:3,draw:(x,tt,cam)=>{
      ww_corner(x,tt,{t0:-3,who2:"marta",book:true,write:ag_io(tt,c.from+0.2,tP+0.6,0.5),lean:ag_in(tt,c.from,0.6)*0.6,he:"listen",hf:PK.face(tt,{expr:"smile",gaze:[1,0.2]},[[1.6,"look",2.4,[1,0]],[c.from+0.4,"look",3,[1,0.5]]]),
        ie:"neutral",iface:PK.face(tt,{expr:"smile",gaze:[1,0.2]},[[2.2,"say",2.4],[c.from+0.8,"look",2.6,[1,0.5]],[c.from+3.0,"nod"]])});}},
    // the page: what the work asks
    {at:tP,place:"wwNotes",dis:0.6,keys:[[tP,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N2,{});}},
    // what helps: she knows the numbers, and Jun checks a query when she asks
    {at:tH,place:"wwTeam",dis:0.6,keys:[[tH,760,560,1.12]],d:2,draw:(x,tt,cam)=>{
      ww_team(x,tt,{clock:11.4,sam:Object.assign({work:1},ww_alive(tt,{},1,tH)),jun:null,show:PK.onScreen.chat(0.7,{}),
        marta:Object.assign(ww_marta({turn:ag_io(tt,w("helps","Jun",-0.4),c.jdr,0.5)}),PK.face(tt,{expr:"smile",gaze:[1,0.2]},[[w("helps","knows",0),"look",2.6,[1,0.1]],[w("helps","Jun",0.4),"smile",2.4]])),
        people:[{fl:905,draw:cc=>ww_come(cc,"jun",tt,1700,830,tH+0.2,w("helps","Jun",0.2),905,ww_hT(905),{then:WW_SHOW,face:Object.assign({hold:ww_sheet,holds:true},PK.face(tt,{expr:"smile",gaze:[1,0.1]},[[w("helps","query",0),"nod"]]))})}]});}},
    // Carmen at the team's board: job demands and job resources
    {at:tR,place:"wwTeam",later:true,keys:[[tR,960,540,1.0],[tZ,1010,530,1.08]],d:2,draw:(x,tt,cam)=>{
      const R=ww_lesson(x,tt,{clock:11.6,rows:BA,marta:Object.assign({turn:1,work:0},ww_lis(tt,-0.2)),say:[[c.jdr,sc.ends.both]]});}},
    {at:tZ,cut:true,place:"wwBoard",keys:[[tZ,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BA,{say:[[c.jdr,sc.ends.jdr],[c.both,sc.ends.both]]});}}
  ]);
  ww_card(ctx,S,t,0.6,tP-0.3,{kick:"Monday 8 February",title:"Marta's week, on one page"},{y:40,mid:true});
  ww_kick(ctx,S,ag_in(t,0.6,0.6)*(1-ww_apart(t,[[tP,tH],[tZ,1e9]])));
});

/* ---------------------------------------------------------------- 4. Three things everyone needs */
scene("needs",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tZ=w("three","everyone",-0.4),tL=c.care-0.5,tA=w("about","nothing",-1.2),BB=PK.pace(ctx,"carmen",ww_boardB(sc,w)),N3=PK.pace(ctx,null,ww_note3(sc,w));
  const ask=[tL-3,tL-2.6,tL-2.2,tL-1.8];
  ag_shots(ctx,S,t,sc.dur,[
    // the team's room: Carmen at the board again, Marta and Jun turned to it
    {at:0,place:"wwTeam",keys:[[0,960,540,1.0],[tZ,1010,530,1.08]],d:2,draw:(x,tt,cam)=>{ww_lesson(x,tt,{clock:11.8,rows:BB,marta:Object.assign({turn:1,work:0},ww_lis(tt,-0.2)),say:[[c.three,c.care]]});}},
    {at:tZ,cut:true,place:"wwBoard",keys:[[tZ,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BB,{say:[[c.three,sc.ends.three],[c.marta,sc.ends.marta],[c.names,sc.ends.names],[c.better,sc.ends.better]]});}},
    // meet those needs: a faster laptop is a kindness, and changes nothing in her order
    {at:tL,place:"wwTeam",cut:true,keys:[[tL,760,520,1.06]],d:2,draw:(x,tt,cam)=>{
      const R=ww_team(x,tt,{clock:13.5,jun:Object.assign({work:1},ww_alive(tt,{},2,tL)),sam:null,show:PK.onScreen.chat(0.8,{}),
        marta:Object.assign(ww_marta({turn:ag_io(tt,c.laptop-0.2,c.about-0.6,0.5)}),PK.face(tt,{expr:"neutral",gaze:[1,0.2]},[[c.laptop+0.4,"smile",2.4],[w("laptop","no say",-0.2),"look",3,[1,0.3]]])),
        people:[{fl:905,draw:cc=>ww_come(cc,"sam",tt,1700,860,c.laptop-1.4,c.laptop+0.6,905,ww_hT(905),{then:WW_CARRY,face:PK.face(tt,{expr:"smile",gaze:[1,0.1]},[[c.laptop+1.6,"nod"]])})}]});
      PK.callout(x,60,50,640,300,[470,560],ag_io(tt,w("laptop","no say",-0.6),tA-0.3,0.4),(cc,bx,by,bw,bh)=>PK.chat(cc,bx,by,bw,bh,ww_inbox(ask,{n:2}),tt,{}));}},
    {at:tA,place:"wwNotes",dis:0.6,keys:[[tA,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N3,{});}}
  ]);
  ww_kick(ctx,S,ag_in(t,0.6,0.6)*(1-ww_apart(t,[[tZ,tL],[w("laptop","no say",-0.6),1e9]])));
});

/* ---------------------------------------------------------------- 5. An order, agreed */
// the teaching room: the nine who asked, seated; Helena at the front, by its board. o.rows: what she writes there (PK.teach)
const WW_LB={x:1340,y:250,k:0.368,floor:930,rest:900};
// the nine who asked, seated (PK.audience's seats and order), each with a look, a nod or a smile now and then
function ww_audience(x,tt,n,look){const seats=PK.seats({}),order=[5,1,9,6,2,8,0,10,4,7,3],taken={};order.slice(0,n).forEach((s,i)=>taken[s]=i);
  seats.forEach((s,i)=>{const ch=PK.PAL[i%2?"chair2":"chair"];if(taken[i]==null){PK.S.begin(x,{lw:PK.u.clamp(s.h*0.0056,1.4,6.5),sh:4});PK.chair(x,s.x-0.012*s.h,s.fl,s.h,false,{col:ch});return;}
    PK.seated(x,PK.extra(i+3),s.x,s.fl,s.h,PK.poseMix("sit","sitBack",(i*0.37)%1),Object.assign({t:tt+i*1.7,chair:ch,shade:0},ww_alive(tt,{expr:"listen",gaze:[1,-look]},(i*3)%7*0.7)));});}
function ww_meeting(x,tt,o){o=o||{};let Jh=null;ww_audience(x,tt,9,o.look==null?0.4:o.look);
  if(o.rows)Jh=PK.teach(x,"helena",tt,o.rows,Object.assign({},WW_LB,{h:ww_hL(WW_LB.floor),deco:true,say:o.say}));
  else Jh=PK.person(x,"helena",1250,930,ww_hL(930),o.pose||"clasp",Object.assign({t:tt,flip:true},o.face||{}));return Jh;}
scene("order",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tP=c.team-0.6,tA=c.agree-0.6,tZ=w("agree","Two requests",-0.9),N4=PK.pace(ctx,null,ww_note4(sc,w)),BC=PK.pace(ctx,"helena",ww_boardC(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // Wednesday the tenth: the nine who asked, in one room; Helena brings the page
    {at:0,place:"wwLecture",keys:[[0,960,540,1.0],[c.evidence,1040,540,1.06]],d:3,draw:(x,tt,cam)=>{
      const sh=ag_io(tt,c.evidence-0.2,tP,0.5);ww_meeting(x,tt,{look:0.5,pose:PK.poseMix("clasp",WW_SHOW,sh),face:Object.assign({hold:sh>0.3?ww_sheet:null,holds:sh>0.3},
        PK.face(tt,{expr:ww_says("smile",tt,c.room,sc.ends.evidence),gaze:[1,0]},[[c.evidence+2,"look",2.4,[1,0.2]]]))});}},
    // what she takes in: a page of her notebook
    {at:tP,place:"wwNotes",dis:0.6,keys:[[tP,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N4,{});}},
    // they agree: Helena writes it at the room's board
    {at:tA,place:"wwLecture",dis:0.6,keys:[[tA,1200,520,1.1]],d:2,draw:(x,tt,cam)=>{ww_meeting(x,tt,{rows:BC,look:0.8,say:[[c.agree,sc.ends.door]]});}},
    {at:tZ,cut:true,place:"wwBoard",keys:[[tZ,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"helena",tt,BC,{say:[[c.agree,sc.ends.agree],[c.three,sc.ends.three],[c.door,sc.ends.door]]});}}
  ]);
  ww_card(ctx,S,t,0.6,c.evidence-0.3,{kick:"Wednesday 10 February",title:"The nine who asked, in one room"});
  ww_kick(ctx,S,ag_in(t,0.6,0.6)*(1-ww_apart(t,[[tP,tA],[tZ,1e9]])));
});

/* ---------------------------------------------------------------- 6. Where to look */
scene("keeper",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tR=c.where-0.6,tZ=w("where","in the work",-0.6),BD=PK.pace(ctx,"carmen",ww_boardD(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // 1972: the bridge left for a time, still hanging whole, gleaming; at its head, its keeper stops two visitors
    {at:0,place:"wwGorgeU",keys:[[0,960,540,1.0],[c.dying-0.6,1150,590,1.26]],d:3.4,draw:(x,tt,cam)=>{
      const sp=w("dying","Don't",0),R=wwq_scene(x,WW_VU,{age:0.36},[
        ww_walk(WW_VU,"v1",tt,[[-20.5,0,-3.4],[-17.9,0,1.3]],0.2,4.6,{opt:PK.face(tt,{expr:"smile",gaze:[1,-0.1]},[[sp+0.4,"look",3,[1,0.3]],[c.knew+0.6,"smile",2]])}),
        ww_walk(WW_VU,"v2",tt,[[-20.8,0,-7.4],[-18.0,0,-2.5]],0.8,5.8,{opt:PK.face(tt,{expr:"smile",gaze:[1,-0.1]},[[sp+0.2,"look",3,[1,0.2]],[c.knew,"nod"]])}),
        wwq_folk(WW_VU,"keeper",-16.2,2.6,"clasp",{t:tt,key:"k",opt:PK.face(tt,{expr:ww_says("worry",tt,sp,sp+2.6),gaze:[1,0]},[[1.6,"look",2.4,[1,0.3]],[c.knew+0.4,"nod"]])})]);
      ww_bub(x,R.k,tt,sp,c.knew+1.0,["Don't cross!","The bridge is dying."],cam,{dx:-260});}},
    // where to look in the work: Carmen at the team's board
    {at:tR,place:"wwTeam",dis:0.8,keys:[[tR,960,540,1.0],[tZ,1010,530,1.08]],d:2,draw:(x,tt,cam)=>{ww_lesson(x,tt,{clock:15.0,rows:BD,say:[[c.where,sc.ends.hazards]]});}},
    {at:tZ,cut:true,place:"wwBoard",keys:[[tZ,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BD,{say:[[c.where,sc.ends.where],[c.more,sc.ends.more],[c.hazards,sc.ends.hazards]]});}}
  ]);
  ww_card(ctx,S,t,0.6,c.dying-0.6,{kick:"October 1972",title:"Left for a time, still hanging"},{y:40,mid:true});
  ww_kick(ctx,S,ag_in(t,0.6,0.6)*(1-ww_apart(t,[[tZ,1e9]])));
});

/* ---------------------------------------------------------------- 7. Three signs, and a limit */
scene("signs",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tZ=w("signs","three signs",-0.6),tE=c.employers-0.5,tN=c.part-0.5,BE=PK.pace(ctx,"carmen",ww_boardE(sc,w)),N5=PK.pace(ctx,null,ww_note5(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"wwTeam",keys:[[0,960,540,1.0],[tZ,1010,530,1.08]],d:2,draw:(x,tt,cam)=>{ww_lesson(x,tt,{clock:15.3,rows:BE,say:[[c.signs,sc.ends.ask]]});}},
    {at:tZ,cut:true,place:"wwBoard",keys:[[tZ,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BE,{say:[[c.signs,sc.ends.signs],[c.who,sc.ends.who],[c.notmed,sc.ends.notmed],[c.ask,sc.ends.ask]]});}},
    // the work first: Helena asks Tomás how the week went, and listens
    {at:tE,place:"wwCorner",dis:0.6,keys:[[tE,960,540,1.0],[tN,940,560,1.06]],d:3,draw:(x,tt,cam)=>{
      ww_corner(x,tt,{t0:tE-5,who2:"tomas",book:true,lean:0.6,he:"listen",hf:PK.face(tt,{expr:"listen",gaze:[1,0]},[[tE+0.6,"nod"],[tE+3.4,"look",2.2,[1,0.2]],[tE+5.6,"nod"]]),
        ie:"neutral",iface:PK.face(tt,{expr:"neutral",gaze:[1,0.2]},[[tE+0.4,"say",2.6],[tE+3.6,"look",2.0,[1,0.4]],[tE+5.2,"smile",2.0]])});}},
    {at:tN,place:"wwNotes",dis:0.6,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N5,{});}}
  ]);
  ww_kick(ctx,S,ag_in(t,0.6,0.6)*(1-ww_apart(t,[[tZ,tE],[tN,1e9]])));
});

/* ---------------------------------------------------------------- 8. Ask everyone, in writing */
// the team's room, all seven, Helena at its board (o.rows); o.faces: {who: PK.face's result}
function ww_seven(x,tt,o){o=o||{};const f=k=>(o.faces||{})[k]||ww_alive(tt,{expr:"listen",gaze:[1,-0.2]},{sam:0,jun:1,marta:2,noor:3,yusuf:4,erin:5,tomas:6}[k],0);let Jh=null;
  ww_team(x,tt,{clock:o.clock||15,sam:null,jun:Object.assign({work:0,pose:"sit"},f("jun")),marta:Object.assign({turn:1,work:0,pose:"sit"},f("marta")),people:[
    {fl:WW_RB.floor,draw:cc=>{Jh=ww_roomBoard(cc,tt,o.rows||[],"helena",{say:o.say});}},
    {fl:WW_SAMC.floor,draw:cc=>PK.seated(cc,"sam",WW_SAMC.x,WW_SAMC.floor,ww_hT(WW_SAMC.floor),"sit",Object.assign({t:tt+2,flip:true},f("sam")))},
    {fl:875,draw:cc=>PK.person(cc,"noor",1690,875,ww_hT(875),"clasp",Object.assign({t:tt+2,flip:true},f("noor")))},
    {fl:935,draw:cc=>PK.person(cc,"yusuf",380,935,ww_hT(935),"clasp",Object.assign({t:tt+3},f("yusuf")))},
    {fl:925,draw:cc=>PK.seated(cc,"erin",1640,925,ww_hT(925),"sit",Object.assign({t:tt+5,flip:true},f("erin")))},
    {fl:965,draw:cc=>PK.person(cc,"tomas",200,965,ww_hT(965),"ease",Object.assign({t:tt+6},f("tomas")))}]});return Jh;}
scene("ask",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tJ=w("five","sends",-0.6),tS=c.show-0.6,tZ=w("show","answers",-0.8),BF=PK.pace(ctx,"helena",ww_boardF(sc,w)),sent=w("five","sends",0);
  ag_shots(ctx,S,t,sc.dur,[
    // Helena doesn't wait: at her corner, she writes the five questions
    {at:0,place:"wwCorner",keys:[[0,960,540,1.0],[tJ,900,560,1.08]],d:3,draw:(x,tt,cam)=>{ww_corner(x,tt,{t0:-2,book:true,write:ag_in(tt,c.wait+1.0,0.5),he:"think",hf:PK.face(tt,{expr:"think",gaze:[1,0.5]},[[c.wait+0.4,"look",2.4,[1,0.2]]])});}},
    // they come in on everyone's screens: Jun's, as he reads it; and the answers come back in writing
    {at:tJ,place:"wwTeam",dis:0.6,keys:[[tJ,1450,560,1.2]],d:2,draw:(x,tt,cam)=>{
      const R=ww_team(x,tt,{clock:16.4,sam:Object.assign({work:1},ww_alive(tt,{},1,tJ)),marta:null,jun:Object.assign({turn:0,work:1},PK.face(tt,{expr:"neutral",gaze:[1,0.2]},[[sent+0.8,"look",2.6,[1,0.3]],[c.needs+1.6,"smile",2.4]])),showJ:PK.onScreen.chat(ag_in(tt,sent,0.4),{})});
      PK.callout(x,620,90,720,300,[1700,520],ag_io(tt,sent-0.2,tS-0.3,0.4),(cc,bx,by,bw,bh)=>PK.chat(cc,bx,by,bw,bh,ww_five(sent+0.2,c.needs+1.0),tt,{}));}},
    // a week later, all seven: Helena writes the answers at the board
    {at:tS,place:"wwTeam",later:true,keys:[[tS,1450,560,1.2],[tS+2,1010,530,1.08]],d:2,draw:(x,tt,cam)=>{ww_seven(x,tt,{rows:BF,clock:16,say:[[c.show,sc.ends.changed]]});}},
    {at:tZ+1.4,cut:true,place:"wwBoard",keys:[[tZ+1.4,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"helena",tt,BF,{say:[[c.show,sc.ends.show],[c.counts,sc.ends.counts],[c.wears,sc.ends.wears],[c.changed,sc.ends.changed]]});}}
  ]);
  ww_card(ctx,S,t,0.6,tJ-0.3,{kick:"Friday 12 February",title:"Five questions, in writing"},{y:40,mid:true});
  ww_card(ctx,S,t,tS+0.4,tZ+1.0,{kick:"A week later",title:"All seven, the answers"},{y:40,mid:true});
  ww_kick(ctx,S,ag_in(t,0.6,0.6)*(1-ww_apart(t,[[sent-0.6,tS+0.2],[tZ+1.4,1e9]])));
});

/* ---------------------------------------------------------------- 9. On a date */
scene("date",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tC=w("cut","cut loose",-0.2),tJ=c.june-0.6,tW=c.week-0.6,tX=c.next-0.4,tE=c.breath+0.6,N6=PK.pace(ctx,null,ww_note6(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // at Quehue, the old bridge cut loose while it still holds, once the new floor cables are across: it swings down to the river,
    // which takes it; the new one made
    {at:0,place:"wwGorgeR",keys:[[0,960,560,1.0],[c.renew+0.4,960,520,1.12]],d:3,draw:(x,tt,cam)=>{
      const f=U.sine(U.clamp((tt-tC)/2.4,0,1)),k=U.clamp((tt-c.renew)/(tJ-c.renew-0.4),0,1);
      wwq_scene(x,WW_VR,{bridges:[{age:0.5,cut:f},{age:0,k:0.3+0.7*k}]},ww_folks(WW_VR,tt,WW_RIMR));}},
    // Helena's team has its date too: Marta's twelve, each on its date
    {at:tJ,place:"wwTeam",dis:1.0,keys:[[tJ,960,540,1.0],[c.marta,760,560,1.1]],d:3,draw:(x,tt,cam)=>{
      ww_team(x,tt,{clock:15.5,show:PK.onScreen.chat(0.3,{}),sam:Object.assign({work:1},ww_alive(tt,{},1,tJ)),jun:Object.assign({work:1},ww_alive(tt,{},2,tJ)),
        marta:Object.assign(ww_marta({turn:ag_io(tt,c.marta-0.4,tW,0.5)}),PK.face(tt,{expr:"smile",gaze:[1,0.1]},[[c.marta+0.6,"say",2.4],[c.marta+3.4,"nod"]])),
        people:[{fl:905,draw:cc=>PK.person(cc,"helena",930,905,ww_hT(905),"clasp",Object.assign({t:tt,flip:true},PK.face(tt,{expr:"smile",gaze:[1,0]},[[c.june+0.6,"look",2.2,[1,0.2]],[c.marta+1.6,"nod"]])))}]});}},
    {at:tW,place:"wwNotes",dis:0.6,keys:[[tW,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N6,{});}},
    // at her corner, Helena shuts her notebook and looks out at the campus
    {at:tX,place:"wwCorner",dis:0.6,keys:[[tX,960,540,1.0],[sc.dur,900,560,1.08]],d:3,draw:(x,tt,cam)=>{
      ww_corner(x,tt,{t0:tX-6,book:true,hf:PK.face(tt,{expr:"smile",gaze:[1,0.2]},[[tX+2.0,"look",2.2,[1,-0.3]],[tX+5,"nod"]]),handN:[740,632],handF:[770,626]});}}
  ]);
  ww_card(ctx,S,t,c.cut+0.2,c.renew-0.4,{kick:"Each June, at Quehue",title:"Cut loose while it still holds"},{y:40,mid:true});
  ww_card(ctx,S,t,c.marta+0.2,tW-0.3,{kick:"End of February",title:"Six of twelve, each on its date",col:PK.C.green},{right:true});
  ww_card(ctx,S,t,c.next+0.3,c.end-0.4,{kick:"The next film",title:"No two alike"},{right:true});
  ww_kick(ctx,S,(1-ag_in(t,tE-0.2,0.6))*(1-ww_apart(t,[[tW,tX]])));
  PK.end(ctx,S,t,tE,"Wellbeing is in the work",WW_LAST,"Film 2 of 4","People first",{side:"right"});
});
// chapters that open in a room after a board seen close: the film cuts
ag_cutInto(["needs","signs"]);
