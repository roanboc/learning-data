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
// kneeling to twist cord, seen from the side: both hands together in front, the cord running from them to the ground
const WW_TWIST={mode:"kneel",lean:16,head:12,aN:[44,56,"grip"],aF:[40,60,"grip"],lN:[28,-90],lF:[40,-88],fN:70,fF:70};
function ww_twisting(x,who,px,fl,tt,o){o=o||{};const U=PK.u,J=wwq_person(x,who,px,fl,wwq_h(fl),WW_TWIST,Object.assign({t:tt,holds:true},o,o.nod!=null?{}:ww_alive(tt,{expr:o.expr||"neutral",gaze:o.gaze||[1,0.7]},px%5)));
  if(J&&J.hdN){const [hx,hy]=J.hdN,len=o.len||260,col=PK.S.tone(WWQ_PAL.rope),tw=Math.sin(tt*5)*2;x.save();x.lineCap="round";x.strokeStyle=U.css(PK.S.ink);x.lineWidth=6;
    x.beginPath();x.moveTo(hx,hy+4);x.quadraticCurveTo(hx+len*0.4,fl-6+tw,hx+len,fl-2);x.stroke();x.strokeStyle=U.css(col);x.lineWidth=3.4;x.stroke();x.restore();}return J;}
// a walker on the bridge from u0 to u1 between t0 and t1 (at rest outside it); returns [u, who, flip, tt] for wwq_bridge, or null
const ww_on=(tt,who,u0,u1,t0,t1)=>{if(tt<t0-0.2||tt>t1+0.2)return null;const u=PK.u.lerp(u0,u1,PK.u.clamp((tt-t0)/(t1-t0),0,1));return[u,who,u1<u0,tt];};
// someone who stays a while takes in what goes on: a look, a nod, a smile, every few seconds (i: who they are, so no two move together)
const ww_alive=(tt,base,i,t0)=>{const ev=[],K=["look","nod","smile"];for(let k=0;k<30;k++){const at=(t0||0)+2.5+i*1.37+k*5.9,kind=K[(k+i)%3];ev.push(kind==="look"?[at,"look",2.2,[1,((k+i)%2?0.35:-0.2)]]:kind==="smile"?[at,"smile",2.4]:[at,"nod"]);}
  return PK.face(tt,Object.assign({expr:"neutral",gaze:[1,0]},base||{}),ev);};
// the bank's people: [who, x, floor, pose, flip, opts]
function ww_bank(x,tt,list){list.slice().sort((a,b)=>a[2]-b[2]).forEach(([who,px,fl,pose,fl2,o],i)=>{o=o||{};if(pose==="twist")return ww_twisting(x,who,px,fl,tt,o);
  const f=o.nod!=null?{}:ww_alive(tt,{expr:o.expr||"neutral",gaze:o.gaze||[1,0]},px%5);
  wwq_person(x,who,px,fl,wwq_h(fl),pose||"stand",Object.assign({t:tt+(px%7),flip:!!fl2},o,f));});}


// Marta at her desk, turned to her screen or to the room; who: more people in the room ({fl, draw})
const ww_marta=(o)=>Object.assign({work:1,turn:0},o||{});
// someone who comes to a desk: walks in from x0 to x1 between t0 and t1, then stands (pose), flipped to face left when x1 < x0
const ww_qcome=(cc,who,tt,x0,x1,t0,t1,fl,o)=>{o=o||{};const flip=x1<x0,h=wwq_h(fl);if(tt<t1)return wwq_walk(cc,who,tt,{x0,x1,t0,t1,floor:fl,h,then:"stand"},Object.assign({flip},o.face||{}));
  return wwq_person(cc,who,x1,fl,h,"stand",Object.assign({t:tt,flip},o.face||{}));};
const ww_come=(cc,who,tt,x0,x1,t0,t1,fl,h,o)=>{o=o||{};const flip=x1<x0;if(tt<t1)return PK.walk(cc,who,tt,{x0,x1,t0,t1,floor:fl,h,then:o.then||"stand"},Object.assign({flip},o.face||{}));
  return PK.person(cc,who,x1,fl,h,o.then||"stand",Object.assign({t:tt,flip},o.face||{}));};

/* ---------------------------------------------------------------- 1. Before it falls */
scene("bridge",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tW=c.wears-0.5,tG=c.sag-0.5,tM=c.missed-0.5,tN=c.need-0.5,tJ=c.june-0.5,tA=c.team-0.6,tF=w("fell","fell",-0.2);
  ag_shots(ctx,S,t,sc.dur,[
    // the gorge, the bridge new across it, people crossing; on the banks, the families who look after it
    {at:0,place:"wwGorge",keys:[[0,960,560,1.0],[c.who-0.2,960,460,1.12],[c.since+0.6,560,600,1.15]],d:3,draw:(x,tt,cam)=>{
      wwq_steel(x,1);wwq_bridge(x,{age:0.05,walkers:[ww_on(tt,"m3",0.04,0.96,0.6,22),ww_on(tt,"w4",0.96,0.04,5,24)].filter(Boolean)});
      ww_bank(x,tt,[["w1",170,900,"stand",false,{hold:wwq_coil,holds:true,expr:"smile",gaze:[1,0.1]}],["m1",470,690,"clasp",false,{expr:"neutral"}],
        ["w2",300,800,"twist",false,{len:200}],["keeper",1700,880,"clasp",true,{expr:"neutral",gaze:[1,0.1]}],["w3",1560,740,"twist",true,{len:180}]]);}},
    // sun, rain and wind, all year: the rope weakens; one man crosses, slowly
    {at:tW,place:"wwGorgeGrey",later:true,keys:[[tW,560,600,1.15],[tW+2.4,960,500,1.05]],d:3,draw:(x,tt,cam)=>{
      wwq_steel(x,1,null,true);wwq_bridge(x,{age:0.35,grey:true,walkers:[ww_on(tt,"m3",0.1,0.9,tW+0.4,tG+0.4)].filter(Boolean)});
      wwq_rain(x,tt,ag_io(tt,w("wears","rain",-0.2),tG-0.3,0.6),ag_in(tt,w("wears","wind",-0.2),0.8));
      ww_bank(x,tt,[["m1",470,690,"clasp",false,PK.face(tt,{expr:"worry",gaze:[1,-0.3]},[[tW+1.6,"look",2.4,[1,0.1]]])]]);}},
    // five months after one renewal: a visitor finds it sagging, one handrail lower; someone crosses it all the same
    {at:tG,place:"wwGorge",later:true,keys:[[tG,960,500,1.05],[c.holds-0.4,820,500,1.12]],d:3,draw:(x,tt,cam)=>{
      wwq_steel(x,1);const wr=ag_io(tt,w("sag","visitor",0),c.holds+0.4,0.5);
      wwq_bridge(x,{age:0.55,tilt:ag_in(tt,w("sag","handrail",-0.4),1.0),walkers:[ww_on(tt,"w4",0.92,0.08,c.holds-0.2,c.missed-0.6)].filter(Boolean)});
      ww_bank(x,tt,[["v1",330,820,PK.poseMix("stand",WW_NOTE,wr),false,Object.assign({underF:PK.inHand.notebook({}),hold:wr>0.3?PK.inHand.pen("ink"):null,holds:true},
        PK.face(tt,{expr:"think",gaze:[1,0.1+0.5*wr]},[[w("sag","sagging",0),"look",2.6,[1,-0.2]],[w("holds","Wait",0),"look",2.2,[1,0]]]))]]);}},
    // 2020: not renewed; March 2021, at twenty-one months, it falls; a keeper on the bank
    {at:tM,place:"wwGorgeGrey",later:true,keys:[[tM,960,500,1.05],[c.fell+1.0,960,520,1.1]],d:3,draw:(x,tt,cam)=>{
      wwq_steel(x,1,null,true);wwq_bridge(x,{age:0.9,grey:true,fall:U.sine(U.clamp((tt-tF)/1.6,0,1))});
      ww_bank(x,tt,[["keeper",1640,820,"clasp",true,PK.face(tt,{expr:"worry",gaze:[1,0.1]},[[tM+1.2,"look",2.6,[1,0.3]],[tF+0.3,"look",3.0,[1,0.6]],[c.fell+3.0,"nod"]])]]);}},
    // people who cross need it renewed before it fails: each year, on a date, the families come with their cord, and a thousand weave it in three days
    {at:tN,place:"wwGorge",later:true,keys:[[tN,960,520,1.1],[c.three+0.4,700,600,1.15]],d:3.2,draw:(x,tt,cam)=>{
      const k=U.clamp((tt-c.custom)/(c.june-c.custom-0.6),0,1);wwq_steel(x,1);wwq_bridge(x,{age:0,k});
      const walkIn=(who,x0,x1,t0,fl,flip)=>({fl,draw:cc=>wwq_walk(cc,who,tt,{x0,x1,t0,t1:t0+3.2,floor:fl,h:wwq_h(fl),arms:{aN:WW_CARRY.aN},then:WW_CARRY},Object.assign({flip,hold:wwq_coil,holds:true},ww_alive(tt,{expr:"smile",gaze:[1,0]},x1%5,t0+2)))});
      const L=[walkIn("w1",-160,170,tN+0.4,900,false),walkIn("m1",-160,430,tN+1.4,700,false),walkIn("m3",2080,1600,tN+0.9,760,true),walkIn("w3",2080,1760,c.custom,890,true),walkIn("m4",-160,290,c.custom+0.8,780,false)];
      L.push({fl:820,draw:cc=>ww_twisting(cc,"w2",400,820,tt,{len:160})},{fl:640,draw:cc=>ww_twisting(cc,"w5",1440,640,tt,{len:120,flip:true})});
      L.sort((a,b)=>a.fl-b.fl).forEach(i=>i.draw(x));}},
    // June 2021: woven again, with their own means; people cross it on foot
    {at:tJ,place:"wwGorge",keys:[[tJ,700,600,1.15],[tJ+1.6,960,520,1.1],[c.lasts-0.2,960,460,1.2]],d:3,draw:(x,tt,cam)=>{
      const bl=ag_in(tt,tJ+1.2,0.45),CS=PK.poseMix(WW_CARRY,"stand",bl),CC=PK.poseMix(WW_CARRY,"clasp",bl),cl={hold:wwq_coil,holds:true,expr:"smile"};wwq_steel(x,1);wwq_bridge(x,{age:0,walkers:[ww_on(tt,"m5",0.05,0.95,tJ+0.6,tJ+16),ww_on(tt,"w4",0.92,0.08,tJ+3,tJ+17)].filter(Boolean)});
      ww_bank(x,tt,[["w1",170,900,CS,false,cl],["m1",430,700,CC,false,cl],["m4",290,780,CS,false,cl],
        ["w2",400,820,"twist",false,{len:160}],["m3",1600,760,CC,true,cl],["w3",1760,890,CS,true,cl],["w5",1440,640,"twist",true,{len:120,flip:true}]]);}},
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
  ww_card(ctx,S,t,tJ+1.8,c.lasts-0.4,{kick:"June 2021",title:"Woven again, with their own means",col:PK.C.green},{y:40,mid:true});
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
    // 1972: the bridge left for a time, still hanging, gleaming; its keeper stops two visitors at the edge
    {at:0,place:"wwGorge",keys:[[0,960,500,1.0],[c.dying-0.4,560,560,1.1]],d:3,draw:(x,tt,cam)=>{
      wwq_steel(x,1);wwq_bridge(x,{age:0.45});
      const sp=w("dying","Don't",0),L=[
        {fl:890,draw:cc=>ww_qcome(cc,"v2",tt,-160,150,1.4,5.0,890,{face:PK.face(tt,{expr:"smile",gaze:[1,-0.1]},[[sp+0.2,"look",3,[1,0.2]],[c.knew,"nod"]])})},
        {fl:770,draw:cc=>ww_qcome(cc,"v1",tt,-160,280,0.2,4.4,770,{face:PK.face(tt,{expr:"smile",gaze:[1,-0.1]},[[sp+0.4,"look",3,[1,0.3]],[c.knew+0.6,"smile",2]])})},
        {fl:840,draw:cc=>{const Jk=wwq_person(cc,"keeper",450,840,wwq_h(840),"clasp",Object.assign({t:tt,flip:true},PK.face(tt,{expr:ww_says("worry",tt,sp,sp+2.6),gaze:[1,0]},[[1.6,"look",2.4,[1,0.3]],[c.knew+0.4,"nod"]])));
          ww_bub(cc,Jk,tt,sp,c.knew+1.0,["Don't cross!","The bridge is dying."],cam,{dx:300});}}];
      L.sort((a,b)=>a.fl-b.fl).forEach(i=>i.draw(x));}},
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
    // at Quehue, the old bridge cut loose while it still holds, and the new one made
    {at:0,place:"wwGorge",keys:[[0,960,520,1.1],[c.renew+0.4,820,560,1.12]],d:3,draw:(x,tt,cam)=>{
      const f=U.sine(U.clamp((tt-tC)/1.8,0,1)),k=U.clamp((tt-c.renew)/(tJ-c.renew-0.4),0,1);wwq_steel(x,1);
      if(f<1)wwq_bridge(x,{age:0.5,fall:f});wwq_bridge(x,{age:0,k:f<1?0:Math.max(0.05,k)});
      ww_bank(x,tt,[["w1",170,900,"stand",false,{hold:wwq_coil,holds:true,expr:"smile"}],["m1",470,690,"clasp",false,PK.face(tt,{expr:"neutral",gaze:[1,0]},[[tC+0.2,"look",2.6,[1,0.3]],[c.renew+1,"smile",2.4]])],
        ["w2",300,800,"twist",false,{len:200}],["keeper",1700,880,"clasp",true,PK.face(tt,{expr:"neutral",gaze:[1,0.1]},[[tC+0.4,"look",2.6,[1,0.3]],[c.renew+1.6,"nod"]])],["w3",1560,740,"twist",true,{len:180}]]);}},
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
