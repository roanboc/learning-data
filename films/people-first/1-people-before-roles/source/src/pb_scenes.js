/* ===== People before roles: the chapters, shot by shot =====
   The film moves between people and its key ideas (the author, 17 November 2026). In a scene, people are whole and do what the line
   says, and the words on the frame are where and when, a name, a number, or what someone says. The ideas the story opens with are
   explained at the team's board by Carmen Vidal, a consultant; what to keep from a chapter is a page of Helena's notebook (pb_uni.js).
   People also talk from where they are: Erin writes to Jun. And they meet face to face: Helena sits down with each of the seven
   where they work. Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt), so the pictures stay with the
   voice if it's recorded again; the score (tools/score.py) takes the same words. A shot is one stay in a place: the camera glides
   between its keys; between places the film cuts where the same people go on, and dissolves where the whole picture changes (the
   gorge and the university). Sizes are in the 1920 x 1080 frame; people's sizes come from each place's eye line. */
const PB_LAST="Know the people before you plan the work.";
const pb_kick=(ctx,S,a)=>{if(a>0.004){setScreen(ctx,S);PK.kicker(ctx,1,"People before roles",a);}};
function pb_card(ctx,S,t,t0,t1,d,o){o=o||{};const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a<=0.004)return;setScreen(ctx,S);PK.card(ctx,o.mid?960:o.right?1848:72,o.y==null?146:o.y,d,a,{align:o.mid?"center":o.right?"right":"left"});}
const pb_imagined=(ctx,S,t,t0,t1,text)=>{const a=ag_io(t,t0,t1,0.5);if(a>0.004){setScreen(ctx,S);PK.sceneTag(ctx,text,a);}};
const pb_bub=(x,J,tt,t0,t1,lines,cam,o)=>PK.say(x,J,lines,ag_io(tt,t0,t1==null?1e9:t1,0.3),Object.assign({cam},o||{}));
const pb_name=(x,J,tt,t0,t1,name,role,dy,dx)=>{if(J)PK.nameTag(x,J.hc[0]+(dx||0),J.hc[1]-(dy||150),name,role,ag_io(tt,t0,t1,0.4));};
// while a chapter shows a key idea apart from the scene (a board seen close, a page of the notebook), its kicker steps back
const pb_apart=(t,spans)=>spans.reduce((m,[a,b])=>Math.max(m,ag_in(t,a-0.4,0.35)*(1-ag_in(t,b,0.35))),0);
// kneeling to twist cord, seen from the side: both hands together in front, the cord running from them to the ground
const PB_TWIST={mode:"kneel",lean:16,head:12,aN:[44,56,"grip"],aF:[40,60,"grip"],lN:[28,-90],lF:[40,-88],fN:70,fF:70};
function pb_twisting(x,who,px,fl,tt,o){o=o||{};const U=PK.u,J=pbq_person(x,who,px,fl,pbq_h(fl),PB_TWIST,Object.assign({t:tt,holds:true},o,o.nod!=null?{}:pb_alive(tt,{expr:o.expr||"neutral",gaze:o.gaze||[1,0.7]},px%5)));
  if(J&&J.hdN){const [hx,hy]=J.hdN,len=o.len||260,col=PK.S.tone(PBQ_PAL.rope),tw=Math.sin(tt*5)*2;x.save();x.lineCap="round";x.strokeStyle=U.css(PK.S.ink);x.lineWidth=6;
    x.beginPath();x.moveTo(hx,hy+4);x.quadraticCurveTo(hx+len*0.4,fl-6+tw,hx+len,fl-2);x.stroke();x.strokeStyle=U.css(col);x.lineWidth=3.4;x.stroke();x.restore();}return J;}
// a walker on the bridge from u0 to u1 between t0 and t1 (at rest outside it); returns [u, who, flip, tt] for pbq_bridge, or null
const pb_on=(tt,who,u0,u1,t0,t1)=>{if(tt<t0-0.2||tt>t1+0.2)return null;const u=PK.u.lerp(u0,u1,PK.u.clamp((tt-t0)/(t1-t0),0,1));return[u,who,u1<u0,tt];};
// someone who stays a while takes in what goes on: a look, a nod, a smile, every few seconds (i: who they are, so no two move together)
const pb_alive=(tt,base,i,t0)=>{const ev=[],K=["look","nod","smile"];for(let k=0;k<30;k++){const at=(t0||0)+2.5+i*1.37+k*5.9,kind=K[(k+i)%3];ev.push(kind==="look"?[at,"look",2.2,[1,((k+i)%2?0.35:-0.2)]]:kind==="smile"?[at,"smile",2.4]:[at,"nod"]);}
  return PK.face(tt,Object.assign({expr:"neutral",gaze:[1,0]},base||{}),ev);};
// the bank's people: [who, x, floor, pose, flip, opts]
function pb_bank(x,tt,list){list.slice().sort((a,b)=>a[2]-b[2]).forEach(([who,px,fl,pose,fl2,o],i)=>{o=o||{};if(pose==="twist")return pb_twisting(x,who,px,fl,tt,o);
  const f=o.nod!=null?{}:pb_alive(tt,{expr:o.expr||"neutral",gaze:o.gaze||[1,0]},px%5);
  pbq_person(x,who,px,fl,pbq_h(fl),pose||"stand",Object.assign({t:tt+(px%7),flip:!!fl2},o,f));});}

/* ---------------------------------------------------------------- 1. The bridge they went back to */
scene("bridge",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tS=c.steel-0.5,tL=c.left-0.6,tK=c.keeper-0.5,tD=c.did-0.6,tT=c.today-0.6,tU=c.turn-0.4,tA=c.data-0.6;
  ag_shots(ctx,S,t,sc.dur,[
    // the gorge, the bridge of grass across it, people crossing; on the near bank, families with their cord
    {at:0,place:"pbGorge",keys:[[0,960,560,1.0],[c.rope+0.2,960,420,1.3],[c.incas+1.6,960,540,1.0],[c.wear-0.2,420,640,1.25]],d:3,draw:(x,tt,cam)=>{
      pbq_steel(x,0);pbq_bridge(x,{age:0.05,walkers:[pb_on(tt,"m3",0.04,0.96,0.6,22),pb_on(tt,"w4",0.96,0.04,5,27),pb_on(tt,"m5",0.04,0.7,17,30)].filter(Boolean)});
      const tw=w("wear","many hands",-0.6);
      pb_bank(x,tt,[["w1",170,900,"stand",false,{hold:pbq_coil,holds:true,expr:"neutral",gaze:[1,0.1]}],["m1",470,690,"clasp",false,{expr:"neutral",gaze:[1,0]}],
        ["w2",300,800,"twist",false,{len:200}],["keeper",1700,880,"clasp",true,{expr:"neutral",gaze:[1,0.1]}],["w3",1560,740,"twist",true,{len:180}]]);}},
    // 1968: a steel bridge, up the gorge; a truck crosses it, and the last walker leaves the rope
    {at:tS,place:"pbGorge",keys:[[tS,420,640,1.25],[tS+2.2,960,460,1.25],[c.need+1.0,960,500,1.15]],d:3,draw:(x,tt,cam)=>{
      const a=ag_in(tt,w("steel","steel bridge",-0.3),1.4),tr=U.clamp((tt-w("need","cars",-0.4))/5.5,0,1);pbq_steel(x,a,tt>w("need","cars",-0.4)&&tr<1?tr:null);
      pbq_bridge(x,{age:0.1,walkers:[pb_on(tt,"m5",0.7,0.99,tS,w("need","few",0.6))].filter(Boolean)});
      pb_bank(x,tt,[["m1",470,690,"clasp",false,PK.face(tt,{expr:"neutral",gaze:[1,0]},[[w("steel","steel",0.3),"look",3.2,[1,-0.4]]])]]);}},
    // 1970: under a grey sky, the rope left to decay; a geographer writes it down
    {at:tL,place:"pbGorgeGrey",later:true,keys:[[tL,960,520,1.12],[c.skill+0.4,960,560,1.0]],d:3,draw:(x,tt,cam)=>{
      pbq_steel(x,1,null,true);pbq_bridge(x,{age:1,grey:true});
      const wr=ag_io(tt,w("left","finds",-0.2),c.skill+1.4,0.5);
      pb_bank(x,tt,[["geo",260,830,PK.poseMix("stand",PB_NOTE,wr),false,{underF:PK.inHand.notebook({}),hold:wr>0.3?PK.inHand.pen("ink"):null,holds:true,expr:"think",gaze:[1,0.1+0.5*wr]}],
        ["keeper",1720,860,"clasp",true,PK.face(tt,{expr:"worry",gaze:[1,0.1]},[[c.skill+0.4,"look",2.4,[1,0.3]]])]]);}},
    // October 1972: a keeper of the bridge tells two visitors what his people have decided
    {at:tK,place:"pbGorgeGrey",later:true,keys:[[tK,960,540,1.0],[c.sad-0.4,560,560,1.1]],d:3,draw:(x,tt,cam)=>{
      pbq_steel(x,1,null,true);pbq_bridge(x,{age:1,grey:true});
      const s1=c.sad,s2=c.rebuild;
      pb_bank(x,tt,[["v2",150,890,"listen",false,PK.face(tt,{expr:"listen",gaze:[1,-0.1]},[[tK+1.6,"look",2.2,[1,0.2]],[s1+1.8,"nod"],[s2+0.6,"smile",3.0]])],["v1",225,770,PK.poseMix("listen",PB_NOTE,ag_in(tt,s2,0.5)),false,
        Object.assign({underF:PK.inHand.notebook({}),hold:tt>s2+0.3?PK.inHand.pen("ink"):null,holds:true},PK.face(tt,{expr:"listen",gaze:[1,-0.1]},[[tK+2.4,"nod"],[s1+1.0,"smile",2.0],[s2+0.5,"look",4,[1,0.5]]]))]]);
      const Jk=pbq_person(x,"keeper",450,840,pbq_h(840),"clasp",{t:tt,flip:true,expr:pb_says(PK.exprMix("worry","smile",ag_in(tt,s2,0.6)),tt,s1+0.1,sc.ends.rebuild),gaze:[1,0]});
      pb_bub(x,Jk,tt,s1+0.1,s2-0.3,["My people feel sad","about leaving the bridge."],cam,{dx:300});
      pb_bub(x,Jk,tt,s2,tD-0.3,["We'll rebuild it","when the New Year comes."],cam,{dx:300});}},
    // the new year: the families come back, each with its cord, and the bridge is made new
    {at:tD,place:"pbGorge",later:true,keys:[[tD,960,540,1.0],[c.all+0.4,600,600,1.2]],d:3.2,draw:(x,tt,cam)=>{
      const k=0.25+0.75*ag_in(tt,tD+1.0,6.0),ev=w("all","everyone",-0.3);pbq_steel(x,1);pbq_bridge(x,{age:0,k});
      const walkIn=(who,x0,x1,t0,fl,flip)=>({fl,draw:cc=>pbq_walk(cc,who,tt,{x0,x1,t0,t1:t0+3.2,floor:fl,h:pbq_h(fl),arms:{aN:PB_CARRY.aN},then:PB_CARRY},{flip,hold:pbq_coil,holds:true,expr:"smile"})});
      const L=[walkIn("w1",-160,170,tD+0.2,900,false),walkIn("m1",-160,430,tD+1.2,700,false),walkIn("w2",-160,300,ev,790,false),walkIn("m3",2080,1600,tD+0.8,760,true),walkIn("w3",2080,1760,ev+0.4,890,true)];
      L.push({fl:860,draw:cc=>{const Jk=pbq_person(cc,"keeper",1500,840,pbq_h(840),"clasp",{t:tt,flip:true,expr:pb_says("smile",tt,ev-0.2,ev+1.6),gaze:[1,0]});pb_bub(cc,Jk,tt,ev-0.2,tT-0.3,["Only now","does everyone come."],cam,{dx:-110});}});
      L.sort((a,b)=>a.fl-b.fl).forEach(i=>i.draw(x));}},
    // each June, today: both banks full, families with their cord; people cross the new bridge
    {at:tT,place:"pbGorge",later:true,keys:[[tT,600,600,1.2],[tT+2.4,960,540,1.0],[c.died-0.4,1480,580,1.1]],d:3,draw:(x,tt,cam)=>{
      pbq_steel(x,1,U.clamp((tt-tT-2)/6,0,1));pbq_bridge(x,{age:0,walkers:[pb_on(tt,"m3",0.05,0.95,tT+0.5,tT+20),pb_on(tt,"w4",0.9,0.1,tT+3,tT+22)].filter(Boolean)});
      const d1=c.died;
      pb_bank(x,tt,[["w1",130,900,"stand",false,{hold:pbq_coil,holds:true,expr:"smile",gaze:[1,0.1]}],["w3",330,780,"twist",false,{len:150}],["m1",470,640,"clasp",false,{expr:"smile"}],
        ["w2",180,620,"stand",false,{hold:pbq_coil,holds:true,expr:"smile"}],["keeper",1250,660,"clasp",true,{expr:"smile",gaze:[1,0.1]}],["w5",1640,780,"twist",true,{len:150}]]);
      const Jb=pbq_person(x,"m2",1790,940,pbq_h(940),"clasp",Object.assign(pb_alive(tt,{gaze:[1,-0.1]},3,tT),{t:tt,flip:true,expr:pb_says("neutral",tt,d1+0.2,sc.ends.died)}));
      pb_bub(x,Jb,tt,d1+0.2,tU-0.3,["If we stop preserving it,","it would be like if we died."],cam,{dx:-220});}},
    // the steel carries a truck across; the rope, two people who meet in the middle and greet each other
    {at:tU,place:"pbGorge",later:true,keys:[[tU,1480,580,1.1],[w("turn","together",-1.0),960,420,1.3]],d:2,draw:(x,tt,cam)=>{
      pbq_steel(x,1,U.clamp((tt-tU)/4.5,0,1));const m=w("turn","together",-0.6);
      pbq_bridge(x,{age:0,walkers:[pb_on(tt,"m1",0.2,0.46,tU-1,m),pb_on(tt,"w2",0.8,0.54,tU-1,m)].filter(Boolean)});}},
    // a data team, read both ways: the chart of seven boxes on the wall, and the seven people in the room
    {at:tA,place:"pbTeam",dis:1.0,keys:[[tA,1390,330,1.3],[w("data","people",-0.6),960,540,1.0],[c.breath,700,560,1.12]],d:3,draw:(x,tt,cam)=>{
      pb_team(x,tt,{clock:9.4,show:PK.onScreen.chat(0.5,{}),marta:{work:1},people:[
        {fl:846,draw:cc=>PK.person(cc,"noor",930,846,pb_hT(846),"ease",Object.assign({t:tt},pb_alive(tt,{gaze:[1,0.1]},0,tA)))},
        {fl:880,draw:cc=>PK.person(cc,"yusuf",1520,880,pb_hT(880),"clasp",Object.assign({t:tt+2,flip:true},pb_alive(tt,{expr:"smile"},1,tA)))},
        {fl:915,draw:cc=>PK.seated(cc,"erin",1060,915,pb_hT(915),"sit",Object.assign({t:tt+3},pb_alive(tt,{},2,tA)))},
        {fl:950,draw:cc=>PK.person(cc,"tomas",1700,950,pb_hT(950),"ease",Object.assign({t:tt+5,flip:true},pb_alive(tt,{expr:"smile",gaze:[1,0.1]},3,tA)))}]});}}
  ]);
  pb_card(ctx,S,t,c.where+0.4,c.incas-0.4,{kick:"Quehue, Cusco, Peru",title:"The Apurímac river",sub:"Q'eswachaka: a bridge of twisted grass"},{y:40,mid:true});
  pb_card(ctx,S,t,w("steel","steel",-0.2),c.need+2.2,{kick:"1968",title:"A steel bridge",sub:"almost 100 metres away"},{y:40,mid:true});
  pb_card(ctx,S,t,c.left+0.3,c.skill+1.4,{kick:"1970",title:"Found decaying",sub:"not raised for a few years",col:PK.C.amber},{y:40,mid:true});
  pb_card(ctx,S,t,c.keeper+0.2,c.sad-0.6,{kick:"October 1972",title:"One of the bridge's keepers"},{y:40,mid:true});
  pb_card(ctx,S,t,c.today+0.2,c.minka-0.4,{kick:"Each June",title:"About 1,000 people",sub:"four communities, each family with its cord",col:PK.C.orange},{y:40,mid:true});
  pb_card(ctx,S,t,c.minka+0.1,c.unesco-0.4,{kick:"Minka",title:"Unpaid work, shared",sub:"for everyone's benefit",col:PK.C.blue},{y:40,mid:true});
  pb_card(ctx,S,t,c.unesco+0.1,c.died-0.5,{kick:"UNESCO",title:"It strengthens their ties",sub:"not simply a way across",col:PK.C.green},{y:40,mid:true});
  PK.title(ctx,S,t,c.breath+0.2,"People before roles","Know the people first","Leading data people · People first",{side:"right"});
});

/* ---------------------------------------------------------------- 2. A chart and a list */
scene("chart",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tH=c.helena-0.6,tB=c.boxes-0.5,tZ=w("boxes","It doesn't",-0.5),tR=w("iso","value",-1.4),tE=c.before-0.4;
  const BA=PK.pace(ctx,"carmen",pb_boardA(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // Monday morning: Helena walks up the path to the building
    {at:0,place:"pbCampus",keys:[[0,960,540,1.0],[tH,1100,560,1.08]],d:3,draw:(x,tt,cam)=>{
      PK.walk(x,PK.extra(5),tt,{x0:1420,x1:2100,t0:1.0,t1:9,floor:PB_CA.way(1500),h:pb_hC(PB_CA.way(1500))},{far:0.3});
      PK.walk(x,"helena",tt,{x0:200,x1:1440,t0:0.4,t1:tH+0.6,floor:xx=>PB_CA.way(xx),h:fl=>pb_hC(fl)},{expr:"smile",gaze:[1,0]});}},
    // at her corner: two sheets wait on the round table
    {at:tH,place:"pbCorner",cut:true,keys:[[tH,960,540,1.0],[c.two+0.4,900,560,1.08]],d:3,draw:(x,tt,cam)=>{
      const ch=w("two","chart",-0.3),li=w("two","forty-six",-0.3),pick=ag_io(tt,c.tempt+0.4,w("sort","changes",0),0.5),so=ag_in(tt,w("sort","sort",0),1.6);
      const J=pb_corner(x,tt,{t0:tH,sheets:true,write:pick,he:PK.exprMix("smile","think",ag_in(tt,ch,0.6)),hg:[1,0.5],hf:PK.face(tt,{expr:"smile",gaze:[1,0.5]},[[tH+1.6,"look",2.4,[1,0.1]],[c.two+1.0,"nod"],[c.tempt-1.2,"look",2.2,[1,0.2]],[w("sort","changes",0.4),"look",3,[1,0.1]]])});
      pb_name(x,J.helena,tt,c.helena,ch-0.4,"Helena Novak","Data manager",170);
      PK.callout(x,1070,40,720,300,[950,628],ag_io(tt,ch,c.sort+0.2,0.4),(cc,bx,by,bw,bh)=>pb_chartCard(cc,bx,by,bw,bh,{lit:ag_in(tt,ch+0.3,1.4)}));
      PK.callout(x,1150,450,600,320,[810,628],ag_io(tt,li,tB-0.3,0.4),(cc,bx,by,bw,bh)=>pb_listCard(cc,bx,by,bw,bh,{sort:so}));}},
    // that day, Carmen Vidal at the team's board, Helena at the side with her notebook; Sam and Jun turned to listen
    {at:tB,place:"pbTeam",cut:true,keys:[[tB,960,540,1.0],[tB+0.4,1010,530,1.08]],d:2.6,draw:(x,tt,cam)=>{
      const R=pb_lesson(x,tt,{clock:11.0,rows:BA,say:[[c.boxes,sc.ends.boxes]]});pb_name(x,R.at,tt,tB+0.4,tZ-0.2,"Carmen Vidal","Consultant");}},
    // the board, close: what a chart shows, and a standard for putting people first
    {at:tZ,cut:true,place:"pbBoard",keys:[[tZ,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BA,{say:[[tZ,sc.ends.boxes],[c.iso,sc.ends.iso]]});}},
    // the room again: Helena writes it down, and decides to sit down with each of the seven first
    {at:tE,cut:true,place:"pbTeam",keys:[[tE,1010,530,1.08],[sc.dur-0.5,1180,560,1.14]],d:2,draw:(x,tt,cam)=>{
      pb_lesson(x,tt,{clock:11.3,rows:BA,note:ag_in(tt,tE+0.2,0.5),helena:PK.face(tt,{expr:"think",gaze:[1,0.5]},[[c.before+1.8,"nod"]]),
        sam:PK.face(tt,{expr:"listen",gaze:[1,-0.25]},[[c.before+0.8,"look",2.4,[1,0.2]]]),jun:PK.face(tt,{expr:"listen",gaze:[1,-0.2]},[[c.before+1.2,"smile",2.0]])});}}
  ]);
  pb_imagined(ctx,S,t,0.2,tH-0.3,"The university, 2027 · imagined");
  pb_card(ctx,S,t,c.mon+0.2,tH-0.3,{kick:"Monday 1 February 2027",title:"Helena's first day"});
  pb_kick(ctx,S,ag_in(t,1.0,0.6)*(1-pb_apart(t,[[tZ,tE]])));
});

/* ---------------------------------------------------------------- 3. Four questions, seven people */
scene("seven",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tF=w("four","four questions",-0.7),tN=c.noor-0.5,tS=c.sam-0.5,tJ=c.jun-0.5,tY=c.yusuf-0.5,tM=c.marta-0.5,tE=c.erin-0.5,tO=c.tomas-0.5,tX=c.none-0.6;
  const N1=PK.pace(ctx,null,pb_note1(sc,w)),lis=(t0,ev)=>PK.face(0,{expr:"listen"},[]),sit=(fl)=>pb_hT(fl);
  // Helena on a chair beside someone's desk, her notebook on her knee; o.flip faces left
  const hSit=(cc,tt,px,fl,flip,ev)=>PK.seated(cc,"helena",px,fl,pb_hT(fl),"sit",Object.assign({t:tt+4,flip},PK.face(tt,{expr:"listen",gaze:[1,-0.1]},ev||[])));
  ag_shots(ctx,S,t,sc.dur,[
    // Monday to Thursday: Helena pulls a chair up beside Sam's desk
    {at:0,place:"pbTeam",later:true,keys:[[0,1180,560,1.14],[2.2,960,540,1.0],[tF,1080,560,1.1]],d:3,draw:(x,tt,cam)=>{
      pb_team(x,tt,{clock:9.2,marta:null,jun:{work:1},sam:Object.assign({turn:ag_in(tt,2.6,0.5),work:1-ag_in(tt,2.4,0.5)},PK.face(tt,{expr:"neutral",gaze:[1,0]},[[2.6,"smile",3]])),people:[
        {fl:905,draw:cc=>hSit(cc,tt,1000,905,false,[[0.8,"smile",2.4],[2.8,"look",2.2,[1,0.1]]])}]});}},
    // what she asks each of them: a page of her notebook
    {at:tF,place:"pbNotes",dis:0.6,keys:[[tF,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N1,{});}},
    // Noor, at her map of the university's data on the board
    {at:tN,place:"pbTeam",dis:0.6,keys:[[tN,960,520,1.12]],d:2,draw:(x,tt,cam)=>{
      const R=pb_team(x,tt,{clock:10,marta:null,sam:null,jun:null,people:[
        {fl:860,draw:cc=>{PK.person(cc,"noor",900,860,pb_hT(860),PB_SHOW,{t:tt,flip:false,reachN:[1010,430],reachNk:ag_in(tt,tN+0.8,0.5),expr:pb_says("smile",tt,w("noor","She'd",-0.1),sc.ends.noor),gaze:[1,0]});}},
        {fl:910,draw:cc=>PK.person(cc,"helena",1330,910,pb_hT(910),PB_NOTE,{t:tt,flip:true,underF:PK.inHand.notebook({}),hold:PK.inHand.pen("blue"),holds:true,expr:"listen",gaze:[1,0.1]})}]});}},
    // Sam, at his desk
    {at:tS,place:"pbTeam",later:true,keys:[[tS,1120,560,1.15]],d:2,draw:(x,tt,cam)=>{let Jh=null;
      const R=pb_team(x,tt,{clock:11,marta:null,jun:null,sam:Object.assign({turn:0.6,work:0.4},PK.face(tt,{expr:"smile",gaze:[1,0]},[[w("sam","proud",0),"say",3.0]])),people:[{fl:905,draw:cc=>{Jh=hSit(cc,tt,980,905,false,[[c.sam+3.6,"nod"]]);}}]});
      pb_name(x,R.sam,tt,tS+0.3,w("sam","proud",-0.4),"Sam Okafor","Data platform");
      pb_bub(x,R.sam,tt,w("sam","proud",0),tJ-0.3,["Each morning, the data","is simply there."],cam,{dx:-60});}},
    // Jun, at his
    {at:tJ,place:"pbTeam",later:true,keys:[[tJ,1450,560,1.2]],d:2,draw:(x,tt,cam)=>{
      const R=pb_team(x,tt,{clock:14,marta:null,sam:null,jun:Object.assign({turn:0.6,work:0.3},PK.face(tt,{expr:"smile",gaze:[1,0]},[[w("jun","proudest",0),"say",3.0]])),people:[{fl:905,draw:cc=>hSit(cc,tt,1350,905,false,[[c.jun+3.2,"smile",2.4]])}]});
      pb_name(x,R.jun,tt,tJ+0.3,w("jun","proudest",-0.4),"Jun Park","Analytics engineer",null,-150);
      pb_bub(x,R.jun,tt,w("jun","proudest",0),tY-0.3,["When they stop asking,","because now they know."],cam,{dx:-200});}},
    // Yusuf, at Helena's corner
    {at:tY,place:"pbCorner",cut:true,keys:[[tY,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=pb_corner(x,tt,{t0:tY,who2:"yusuf",book:true,he:"listen",hg:[1,0.25],ie:pb_says("smile",tt,w("yusuf","Ask",-0.1),sc.ends.yusuf),hf:PK.face(tt,{expr:"listen",gaze:[1,0.25]},[[sc.ends.yusuf,"nod"]])});
      pb_name(x,R.who2,tt,tY+0.3,w("yusuf","Ask",-0.4),"Yusuf Demir","Data governance lead",200);
      pb_bub(x,R.who2,tt,w("yusuf","Ask",-0.1),tM-0.3,["Ask me at the start,","and I can say yes more often."],cam,{dx:-120});}},
    // Marta, at her desk by the window
    {at:tM,place:"pbTeam",cut:true,keys:[[tM,700,560,1.18]],d:2,draw:(x,tt,cam)=>{
      const R=pb_team(x,tt,{clock:15,sam:null,jun:null,marta:Object.assign({turn:0.5,work:0.3},PK.face(tt,{expr:"neutral",gaze:[1,0]},[[w("marta","would",0),"say",3.0]])),people:[
        {fl:930,draw:cc=>PK.person(cc,"helena",960,930,pb_hT(930),PB_NOTE,{t:tt,flip:true,underF:PK.inHand.notebook({}),hold:PK.inHand.pen("blue"),holds:true,expr:"listen",gaze:[1,0.2]})}]});
      pb_name(x,R.marta,tt,tM+0.3,w("marta","would",-0.4),"Marta Silva","Data analyst");
      pb_bub(x,R.marta,tt,w("marta","would",0),tE-0.3,["What happens to a number","after I send it?"],cam,{dx:-170});}},
    // Erin and Marta, out for lunch on a Thursday
    {at:tE,place:"pbCampus",cut:true,keys:[[tE,960,560,1.06]],d:2,draw:(x,tt,cam)=>{
      const way={t0:tE+0.2,t1:tE+6.4,h:fl=>pb_hC(fl)};
      const Je=PK.walk(x,"erin",tt,Object.assign({},way,{x0:1420,x1:640,floor:xx=>PB_CA.way(xx)+6}),PK.face(tt,{expr:"smile",gaze:[1,0]},[[tE+2.4,"look",2,[-1,0]]]));
      const Jm=PK.walk(x,"marta",tt,Object.assign({},way,{x0:1560,x1:800,floor:xx=>PB_CA.way(xx)+22,phase:0.4}),{expr:pb_says("smile",tt,tE+2.4,tE+3.6)});
      pb_name(x,Je,tt,tE+0.6,c.tomas-0.8,"Erin Walsh","Platform engineer");}},
    // Tomás, at the back of a teaching room, where a report is on the screen
    {at:tO,place:"pbLecture",dis:0.6,keys:[[tO,1180,520,1.12]],d:2,draw:(x,tt,cam)=>{
      const fl=930,Jt=PK.person(x,"tomas",1500,fl,pb_hL(fl),"clasp",{t:tt,flip:true,expr:pb_says("smile",tt,w("tomas","can tell",-0.1),sc.ends.tomas),gaze:[1,-0.1]});
      PK.person(x,"helena",1240,900,pb_hL(900),PB_NOTE,{t:tt,underF:PK.inHand.notebook({}),hold:PK.inHand.pen("blue"),holds:true,expr:"listen",gaze:[1,0.1]});
      pb_name(x,Jt,tt,tO+0.3,w("tomas","can tell",-0.4),"Tomás Ortega","Report developer");
      pb_bub(x,Jt,tt,w("tomas","can tell",-0.1),tX-0.3,["I know who reads each one,","and what they do with it."],cam,{dx:-160});}},
    // none of it is on the chart: Helena at the chart on the wall
    {at:tX,place:"pbTeam",cut:true,keys:[[tX,1330,420,1.25],[sc.dur,1330,440,1.28]],d:2,draw:(x,tt,cam)=>{
      pb_team(x,tt,{clock:17,marta:null,sam:null,jun:null,people:[{fl:880,draw:cc=>PK.person(cc,"helena",1180,880,pb_hT(880),"clasp",{t:tt,flip:false,underF:PK.inHand.notebook({}),holds:true,expr:"think",gaze:[1,-0.5]})}]});}}
  ]);
  pb_card(ctx,S,t,c.hour+0.2,tF-0.3,{kick:"Monday to Thursday",title:"About an hour each",sub:"where each of them works"},{right:true,y:76});
  pb_card(ctx,S,t,tE+1.0,tO-0.3,{kick:"Thursdays",title:"Lunch, since their first week"},{right:true,y:76});
  pb_kick(ctx,S,ag_in(t,0.6,0.6)*(1-pb_apart(t,[[tF,tN]])));
});

/* ---------------------------------------------------------------- 4. Who they turn to */
scene("turn",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tA=c.ask-0.4,tW=c.show-0.4,tB=c.box-0.5,tU=c.ubuntu-0.5,tZ=w("ubuntu","says",-0.2),tR=w("title","Anyone",-1.6),tM=c.room-0.5;
  const BB=PK.pace(ctx,"carmen",pb_boardB(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // Helena at her corner, writing one name, again and again
    {at:0,place:"pbCorner",keys:[[0,960,540,1.0],[tA,900,560,1.08]],d:3,draw:(x,tt,cam)=>{pb_corner(x,tt,{t0:-4,book:false,sheets:true,write:ag_in(tt,0.6,0.5),he:"think",hg:[1,0.6]});}},
    // Marta comes to Jun's desk with a number she's stuck on; Erin writes to him
    {at:tA,place:"pbTeam",dis:0.6,keys:[[tA,1420,560,1.2]],d:2,draw:(x,tt,cam)=>{
      const m=w("ask","Marta",-0.2),e=w("ask","So does",0),R=pb_team(x,tt,{clock:10.5,marta:null,sam:{work:1},showJ:PK.onScreen.chat(ag_in(tt,e,0.4),{}),
        jun:Object.assign({turn:ag_in(tt,m+0.6,0.5),work:0.4},PK.face(tt,{expr:"listen",gaze:[1,0]},[[e+0.4,"look",3,[1,0.4]]])),people:[
        {fl:905,draw:cc=>PK.walk(cc,"marta",tt,{x0:2060,x1:1500,t0:tA-0.6,t1:m+0.9,floor:905,h:pb_hT(905),arms:{aN:PB_CARRY.aN},then:PB_SHOW},{flip:true,hold:pb_sheet,holds:true,expr:pb_says("worry",tt,m+0.4,m+1.6)})}]});
      PK.callout(x,560,120,660,250,[1660,520],ag_io(tt,e-0.2,tW-0.2,0.4),(cc,bx,by,bw,bh)=>PK.chat(cc,bx,by,bw,bh,pb_chat(e+0.2,e+1.6),tt,{}));}},
    // Noor brings him her map first; Sam shows him a load that looks odd
    {at:tW,place:"pbTeam",later:true,keys:[[tW,1300,560,1.18]],d:2,draw:(x,tt,cam)=>{
      const s=w("show","Sam",-0.3),wk=ag_in(tt,s-0.4,1.6);
      pb_team(x,tt,{clock:11.5,marta:null,show:null,sam:Object.assign({turn:ag_in(tt,s+0.6,0.4)*0.6,work:1-ag_in(tt,s+0.4,0.5)},PK.face(tt,{expr:"neutral",gaze:[1,0]},[[s+0.8,"say",1.6]])),
        jun:{turn:0.8,work:0,expr:"listen",gaze:[1,0.1]},people:[
        {fl:905,draw:cc=>PK.person(cc,"noor",1560,905,pb_hT(905),PB_SHOW,{t:tt,flip:true,hold:pb_sheet,holds:true,a:1-ag_in(tt,s-0.6,0.5),expr:"smile",gaze:[1,0]})}]});}},
    // the chart: Jun is one box of seven, with one line up, to Helena; it doesn't show who people turn to
    {at:tB,place:"pbTeam",later:true,keys:[[tB,1330,420,1.25]],d:2,draw:(x,tt,cam)=>{
      const pr=ag_in(tt,w("shows","turn",-0.6),0.5);
      pb_team(x,tt,{clock:12,marta:null,sam:null,jun:null,people:[{fl:880,draw:cc=>PK.person(cc,"helena",1250,880,pb_hT(880),PK.poseMix("clasp",PB_SHOW,pr),
        {t:tt,flip:false,underF:PK.inHand.notebook({}),hold:pr>0.3?PK.inHand.pen("ink"):null,holds:true,reachN:[1330,330],reachNk:pr,expr:"think",gaze:[1,-0.5]})}]});
      PK.callout(x,860,560,760,300,[1330,400],ag_io(tt,c.box+0.2,tU-0.3,0.4),(cc,bx,by,bw,bh)=>pb_chartCard(cc,bx,by,bw,bh,{jun:ag_in(tt,w("box","one box",-0.2),0.6),
        up:ag_in(tt,w("box","line",-0.3),1.2),turn:ag_in(tt,w("shows","turn",-0.4),2.0)}));}},
    // Carmen, at the team's board, on Ubuntu and on shared leadership
    {at:tU,place:"pbTeam",later:true,keys:[[tU,1330,420,1.25],[tU+2.2,1010,530,1.08]],d:2.6,draw:(x,tt,cam)=>{pb_lesson(x,tt,{clock:15,rows:BB,say:[[c.ubuntu,tZ+0.6]]});}},
    {at:tZ,cut:true,place:"pbBoard",keys:[[tZ,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BB,{say:[[tZ,sc.ends.ubuntu],[c.shared,sc.ends.shared],[c.review,sc.ends.review],[c.title,sc.ends.title]]});}},
    {at:tR+3.4,cut:true,place:"pbTeam",keys:[[tR+3.4,1010,530,1.08]],d:2,draw:(x,tt,cam)=>{
      pb_lesson(x,tt,{clock:15.3,rows:BB,jun:PK.face(tt,{expr:"listen",gaze:[1,-0.2]},[[tR+3.8,"smile",2.4]]),helena:PK.face(tt,{expr:"listen",gaze:[1,-0.2]},[[tR+4.0,"look",2,[1,0.3]]])});}},
    // at the corner: Helena asks Jun if he wants this, and makes room for it
    {at:tM,place:"pbCorner",cut:true,keys:[[tM,960,540,1.0],[c.room+3,940,560,1.06]],d:3,draw:(x,tt,cam)=>{
      const q=w("room","She asks",0),a=w("room","in March",-0.2);
      const R=pb_corner(x,tt,{t0:tM,who2:"jun",book:true,lean:ag_in(tt,q,0.6),he:pb_says("smile",tt,q,q+2.4),ie:pb_says(PK.exprMix("listen","glad",ag_in(tt,a,0.6)),tt,a+0.2,a+1.8),
        iface:PK.face(tt,{expr:"listen",gaze:[1,0.3]},[[a,"nod"]])});
      pb_bub(x,R.helena,tt,q,a-0.2,["Would you like to be","the one beside our newcomer?"],cam,{dx:140});
      pb_bub(x,R.who2,tt,a+0.2,sc.dur,["I'd like that."],cam,{dx:-80});}}
  ]);
  pb_card(ctx,S,t,c.room+3.0,sc.dur-0.2,{kick:"In March",title:"Beside a newcomer",col:PK.C.green},{right:true,y:76});
  pb_kick(ctx,S,ag_in(t,0.6,0.6)*(1-pb_apart(t,[[tZ,tR+3.4]])));
});

/* ---------------------------------------------------------------- 5. What won't change yet */
// the seven and Helena in the team's room, on Friday: Sam, Jun and Marta at their desks, turned round; Noor and Yusuf standing at
// the back, Erin on a chair, Tomás near; Helena in front of the board. faces: {who: PK.face's result}
function pb_all(x,tt,faces,o){o=o||{};const f=k=>faces[k]||PK.face(tt,{expr:"listen",gaze:[1,-0.2]},[]);let Jh=null;
  pb_team(x,tt,{clock:o.clock||16,sam:Object.assign({turn:1,work:0,pose:"sit"},f("sam")),jun:Object.assign({work:0,pose:"sit"},f("jun")),marta:Object.assign({turn:1,work:0,pose:"sit"},f("marta")),people:[
    {fl:846,draw:cc=>PK.person(cc,"noor",1460,846,pb_hT(846),"clasp",Object.assign({t:tt+2,flip:true},f("noor")))},
    {fl:870,draw:cc=>{Jh=PK.person(cc,"helena",760,870,pb_hT(870),"ease",Object.assign({t:tt},faces.helena||{expr:"smile"}));}},
    {fl:940,draw:cc=>PK.person(cc,"yusuf",1040,940,pb_hT(940),"clasp",Object.assign({t:tt+3,flip:true},f("yusuf")))},
    {fl:915,draw:cc=>PK.seated(cc,"erin",1600,915,pb_hT(915),"sit",Object.assign({t:tt+5,flip:true},f("erin")))},
    {fl:960,draw:cc=>PK.person(cc,"tomas",300,960,pb_hT(960),"ease",Object.assign({t:tt+6},f("tomas")))}]});return Jh;}
scene("friday",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tK=c.keeper-0.5,tW=c.week-0.4,tN=w("knows","planned",-0.9),N2=PK.pace(ctx,null,pb_note2(sc));
  const rel=(tt,k)=>PK.face(tt,{expr:"listen",gaze:[1,-0.2]},[[1.4+k*0.6,"smile",2.4],[6+k*0.5,"look",2.6,[1,0.1]],[w("stays","stays",0.2)+k*0.3,"relief",4.0],[w("notall","promise",0)+k*0.4,"nod"],[w("stays","this month",0.2)+k*0.25,"nod"]]);
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"pbTeam",keys:[[0,1180,540,1.0],[c.stays-0.4,1180,520,1.05]],d:3,draw:(x,tt,cam)=>{
      const s=c.stays,n=c.notall,F={};["sam","jun","marta","noor","yusuf","erin","tomas"].forEach((k,i)=>F[k]=rel(tt,i));
      F.helena=PK.face(tt,{expr:"smile",gaze:[1,0]},[[2,"look",2.6,[1,0.2]],[7,"nod"],[w("stays","stays",-0.6),"say",n-0.2-w("stays","stays",-0.6)],[n,"say",tK-0.3-n]]);const Jh=pb_all(x,tt,F,{clock:16});
      pb_bub(x,Jh,tt,w("stays","stays",-0.6),n-0.2,["Who does what","stays as it is this month."],cam,{dx:60});
      pb_bub(x,Jh,tt,n,tK-0.3,["I can't promise","that nothing will change."],cam,{dx:60});}},
    // at the gorge, in 1972, a keeper said what his people would keep
    {at:tK,place:"pbGorgeGrey",dis:0.8,keys:[[tK,560,560,1.1]],d:2,draw:(x,tt,cam)=>{
      pbq_steel(x,1,null,true);pbq_bridge(x,{age:1,grey:true});
      pb_bank(x,tt,[["v2",150,890,"listen",false,{expr:"listen"}],["v1",250,770,"listen",false,{expr:"listen"}]]);
      const Jk=pbq_person(x,"keeper",450,840,pbq_h(840),"clasp",{t:tt,flip:true,expr:pb_says("smile",tt,w("keeper","keeper",0),w("keeper","would",0.4)),gaze:[1,0]});
      pb_bub(x,Jk,tt,w("keeper","keeper",0),tW-0.3,["We'll rebuild it."],cam,{dx:300});}},
    // Helena, in her first week: the team, at ease
    {at:tW,place:"pbTeam",dis:0.8,keys:[[tW,1100,540,1.06]],d:2,draw:(x,tt,cam)=>{
      const F={};["sam","jun","marta","noor","yusuf","erin","tomas"].forEach((k,i)=>F[k]=PK.face(tt,{expr:"smile",gaze:[1,-0.2]},[[tW+0.6+i*0.3,"nod"]]));
      pb_all(x,tt,F,{clock:16.2});}},
    {at:tN,place:"pbNotes",dis:0.6,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N2,{});}}
  ]);
  pb_card(ctx,S,t,0.6,c.fear-0.2,{kick:"Friday 5 February",title:"All seven, in the team's room"},{y:40,mid:true});
  pb_kick(ctx,S,ag_in(t,0.6,0.6)*(1-pb_apart(t,[[tN,1e9]])));
});

/* ---------------------------------------------------------------- 6. On Monday */
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tS=c.same-0.4,tM=w("m1","On Monday",-0.55),tX=sc.ends.m4+0.7,tE=c.breath+0.6,N3=PK.pace(ctx,null,pb_note3(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // the gorge today: steel carries a truck; on the rope, two people meet
    {at:0,place:"pbGorge",keys:[[0,960,460,1.2],[tS,960,430,1.28]],d:3,draw:(x,tt,cam)=>{
      pbq_steel(x,1,U.clamp((tt-0.4)/5,0,1));const m=w("back","each other",-0.4);
      pbq_bridge(x,{age:0,walkers:[pb_on(tt,"w2",0.15,0.46,0,m),pb_on(tt,"m1",0.85,0.54,0,m)].filter(Boolean)});
      pb_bank(x,tt,[["w1",380,800,"stand",false,{hold:pbq_coil,holds:true,expr:"smile",gaze:[1,-0.1]}],["keeper",1560,760,"clasp",true,{expr:"smile",gaze:[1,-0.1]}]]);}},
    // the team's room: the team at work, Helena among them
    {at:tS,place:"pbTeam",dis:0.8,keys:[[tS,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      pb_team(x,tt,{clock:9.3,sam:{work:1},jun:{work:1},marta:{work:0.4,turn:0.3,expr:"smile"},people:[
        {fl:880,draw:cc=>PK.person(cc,"helena",900,880,pb_hT(880),"ease",{t:tt,flip:true,expr:"smile",gaze:[1,0]})},
        {fl:860,draw:cc=>PK.person(cc,"noor",1470,860,pb_hT(860),"clasp",{t:tt+2,flip:true,expr:"smile"})}]});}},
    {at:tM,place:"pbNotes",dis:0.6,keys:[[tM,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N3,{});}},
    // at her corner, Helena shuts her notebook and looks out at the campus
    {at:tX,place:"pbCorner",dis:0.6,keys:[[tX,960,540,1.0],[sc.dur,900,560,1.08]],d:3,draw:(x,tt,cam)=>{
      pb_corner(x,tt,{t0:tX-6,book:true,hf:PK.face(tt,{expr:"smile",gaze:[1,0.2]},[[tX+2.0,"look",2.2,[1,-0.3]],[tX+5,"nod"]]),handN:[740,632],handF:[770,626]});}}
  ]);
  pb_card(ctx,S,t,c.next+0.3,c.take-0.4,{kick:"The next film",title:"Wellbeing is in the work"},{right:true});
  pb_kick(ctx,S,(1-ag_in(t,tE-0.2,0.6))*(1-pb_apart(t,[[tM,tX]])));
  PK.end(ctx,S,t,tE,"People before roles",PB_LAST,"Film 1 of 4","People first",{side:"right"});
});
// chapters that open in the room the one before ends in: the camera glides on, or the film cuts
ag_cutInto(["seven","turn","friday"]);
