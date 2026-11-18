/* ===== Growing people: the chapters, shot by shot =====
   The film moves between people and its key ideas (the author, 17 November 2026). In a scene, people are whole and do what the
   line says, and the words on the frame are where and when, a name, what someone says, or what a screen shows. A key idea is
   never a label in a scene: the ideas the film opens with are explained at a board (Mr Okada at the classroom's blackboard;
   Carmen Vidal, a consultant, at the team's board), and what to keep is a page of a notebook, in colour (gp_uni.js). People also
   talk from where they are: Graham asks his question in a call, and thanks Helena in a chat; they meet face to face too. Every
   time comes from the voice: a line's start (sc.cues) or a word in it (wAt), so the pictures stay with the voice if it's recorded
   again; the score (tools/score.py) takes the same words. A shot is one stay in a place: the camera glides between its keys, and
   everyone in it moves as one function of time, so nothing jumps; between places the film cuts, or dissolves where the whole
   picture changes. Sizes are in the 1920 x 1080 frame; people's sizes come from each place's eye line (gp_hM in the opening's
   rooms, gp_hT in the team's room). */
const GP_LAST="Their goals, weekly feedback about the work, the next step.";
const gp_kick=(ctx,S,a)=>{if(a>0.004){setScreen(ctx,S);PK.kicker(ctx,4,"Growing people",a);}};
// a card in the frame's own space, so it stays put while the camera glides: in at t0, out at t1; o.right: at the top right
function gp_card(ctx,S,t,t0,t1,d,o){o=o||{};const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a<=0.004)return;setScreen(ctx,S);PK.card(ctx,o.x!=null?o.x:o.right?1848:72,o.y==null?146:o.y,d,a,{align:o.right?"right":"left"});}
const gp_imagined=(ctx,S,t,t0,t1,text)=>{const a=ag_io(t,t0,t1,0.5);if(a>0.004){setScreen(ctx,S);PK.sceneTag(ctx,text,a);}};
const gp_say=(x,J,tt,t0,t1,lines,cam,o)=>PK.say(x,J,lines,ag_io(tt,t0,t1==null?1e9:t1,0.3),Object.assign({cam},o||{}));
// while a chapter shows a key idea apart from the scene (a board seen close, a page of a notebook), its kicker steps back
const gp_apart=(t,spans)=>spans.reduce((m,[a,b])=>Math.max(m,ag_in(t,a-0.4,0.35)*(1-ag_in(t,b,0.35))),0);
// a person's look towards a point: for someone facing right at x, the eyes' x (-1 to 1)
const gp_toward=(x,px,k)=>PK.u.clamp((px-x)/(k||420),-1,1);
// someone of the opening on a chair (PK.seated, with their kimono)
const gp_seated=(ctx,who,x,fl,h,pose,o)=>{o=o||{};const f=o.flip===true?1:(o.flip||0);PK.S.begin(ctx,{lw:PK.u.clamp(h*0.0056,1.4,6.5),sh:PK.u.clamp(h*0.0078,1.5,8.5)});
  PK.chair(ctx,x-Math.cos(Math.PI*f)*0.012*h,fl,h,f,{col:o.chair||GP_PAL.wood});return gp_person(ctx,who,x,fl,h,pose||"sit",o);};

/* ---------------------------------------------------------------- 1. Watching the children: Japan, from 1872 */
const GP_READ={lean:2,head:8,aN:[22,96,"grip"],aF:[5,12],lN:[-2,-2],lF:[4,3]},GP_SIDE={lean:0,head:2,aN:[2,6,"grip"],aF:[5,12],lN:[-2,-2],lF:[4,3]};
const GP_BEND={lean:24,head:14,aN:[18,70,"grip"],aF:[16,60],lN:[-2,-2],lF:[5,4]},GP_HOLD={lean:4,head:10,aN:[20,88,"grip"],aF:[5,12],lN:[-2,-2],lF:[4,3]};
const GP_KNEEL={mode:"kneel",lean:20,head:-12,aN:[30,40],aF:[12,30],lN:[28,-90],lF:[40,-88],fN:70,fF:70};
// the sums the teacher writes on the classroom's board, in chalk (the board's own px, from its corner)
const gp_sums=(sc,w)=>[
  {s:"2 + 3 =",x:52,y:150,size:54,w:700,col:GP_CHALK.ink,at:w("new","new methods",-0.2),d:1.0},
  {s:"4 + 1 =",x:52,y:222,size:54,w:700,col:GP_CHALK.ink,at:w("alone","four schools",-0.2),d:1.0},
  {s:"3 + 2 =",x:52,y:294,size:54,w:700,col:GP_CHALK.ink,at:w("see","what each",-0.2),d:1.0}];
// what Mr Okada writes at the blackboard: lesson study's four steps
const gp_steps4=(sc,w)=>[
  {s:"1. Choose a goal",x:70,y:180,size:58,w:700,col:GP_CHALK.blue,at:w("cycle","choose",-0.2),d:0.9},
  {s:"2. Plan it together",x:70,y:280,size:58,col:GP_CHALK.ink,at:w("cycle","plan",-0.2),d:1.1},
  {s:"3. One teaches;",x:70,y:380,size:58,col:GP_CHALK.ink,at:w("teach","One",-0.1),d:0.8},
  {s:"all watch the children",size:58,w:700,col:GP_CHALK.green,at:w("teach","watch",-0.4),d:1.0},
  {s:"4. Improve it, for next time",x:70,y:470,size:58,col:GP_CHALK.ink,at:w("teach","improve",-0.4),d:1.1}];
/* four teachers on chairs pulled into a ring before the board, in the empty classroom: after a lesson, they talk it over (the
   reflection session; the film comes back to it twice). o.board: the board's rows, written; o.clock; o.kato, o.aoki, o.sensei,
   o.ueda: PK.face's result for each. Returns their joints */
function gp_ring(x,tt,o){o=o||{};const b=GP_M.board,R={},f=(k,d)=>o[k]||PK.face(tt,d,[]);
  gp_door(x,0);gp_clock(x,o.clock==null?15.4:o.clock);GP_SEATS.forEach(([i,sx,fl])=>gp_seat(x,sx,fl,gp_kidH(fl)));
  if(o.board)gp_chalkTeach(x,null,tt,o.board,{x:b.x,y:b.y,k:1});
  R.kato=gp_seated(x,"kato",1330,852,gp_hM(852),"sit",Object.assign({t:tt+1,flip:false,hold:gp_booklet({})},f("kato",{expr:"listen",gaze:[1,0.1]})));
  R.aoki=gp_seated(x,"aoki",1610,858,gp_hM(858),"sit",Object.assign({t:tt,flip:true},f("aoki",{expr:"listen",gaze:[1,0]})));
  R.sensei=gp_seated(x,"sensei",1110,1000,gp_hM(1000),"sit",Object.assign({t:tt+2,flip:false},f("sensei",{expr:"listen",gaze:[1,-0.1]})));
  R.ueda=gp_seated(x,"ueda",1790,1006,gp_hM(1006),"sit",Object.assign({t:tt+3,flip:true},f("ueda",{expr:"listen",gaze:[1,-0.1]})));
  return R;}
// the sums of the lesson in 1872, as written on the board (for the moments the film comes back to it)
const gp_sumsDone=()=>gp_sums(null,()=>null);
scene("lesson",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u,K=GP_CAST,b=GP_M.board;
  const tB=w("lost","the teacher",-0.4),tC=c.open-0.6,tD=c.after-0.5,tE=c.study-0.5,tF=c.cycle-0.6,tG=c.spread-0.4,tH=c.world-0.5,tI=c.trial-0.4,tJ=c.fractions-0.4,tK=c.data-0.4,tL=c.grow-0.4;
  const SU=PK.pace(ctx,K.sensei,gp_sums(sc,w),{x:b.x,y:b.y,k:1,floor:904,h:gp_hM(904),rest:1700}),ST=PK.pace(ctx,K.okada,gp_steps4(sc,w));
  const tOpen=c.new-0.2,stuck=ag_in(t,c.see+0.4,0.8);
  // the teacher at the front: in at the door, to the board; then he opens his book and writes the sums, the book in his near hand
  const sensei=(x,tt,o)=>{o=o||{};if(tt<tOpen){const wk={x0:214,x1:1700,t0:1.0,t1:6.2,floor:xx=>xx<1290?812:U.lerp(812,904,(xx-1290)/410),h:gp_hM,arms:{aN:GP_SIDE.aN},then:PK.poseMix(GP_SIDE,GP_READ,ag_in(tt,tOpen-0.8,0.6))};
      const q=PK.walkAt(tt,wk),turn=ag_in(tt,6.3,0.6)*0.66,bk=ag_in(tt,tOpen-0.6,0.4);
      return gp_walk(x,"sensei",tt,wk,{flip:turn,expr:"neutral",gaze:[1,0.1],hold:(cc,h,d,J)=>{gp_tome(1-bk)(cc,h,d,J);if(bk>0.004){cc.save();cc.globalAlpha*=bk;gp_book({k:1.3})(cc,h,d,J);cc.restore();}}});}
    return gp_chalkTeach(x,"sensei",tt,SU,Object.assign({x:b.x,y:b.y,k:1,floor:904,h:gp_hM(904),rest:1700,face:0.66,stand:GP_READ,hold:gp_book({k:1.3})},o));};
  ag_shots(ctx,S,t,sc.dur,[
    // 1872: a village school's one classroom. The teacher comes in at the sliding door, as the children look up from their slates;
    // he writes the day's sums, and the camera goes from the board to the class and to one girl, who can't do hers
    {at:0,place:"gpClass",keys:[[0,960,540,1.0],[c.new-0.6,1090,560,1.16],[c.alone-0.6,960,540,1.0],[c.see-0.4,880,580,1.1],[c.lost-0.4,800,610,1.2]],d:2.6,draw:(x,tt,cam)=>{
      gp_door(x,ag_io(tt,0.4,6.0,0.8));gp_clock(x,9+tt/120);
      const tx=tt<6.2?PK.walkAt(tt,{x0:214,x1:1700,t0:1.0,t1:6.2,floor:812}).x:1660,behind=tt<6.2&&tx<1290;
      // he walks in behind the back row: drawn before the children, until he is past their desks
      let Js=null;if(behind)Js=sensei(x,tt);
      const bd=ag_in(tt,6.4,1.2);
      gp_class(x,tt,{look:(i,q)=>{const sx=GP_SEATS.find(s=>s[0]===i)[1];return[U.lerp(gp_toward(sx,tx),0.7,bd),U.lerp(-0.2,-0.1+0.25*Math.sin(q*0.6+i),bd)];},
        expr:i=>i===5?PK.exprMix("listen","worry",stuck):"listen",write:(i,q)=>i===5?bd*(0.5+0.4*Math.sin(q*0.8+2.1))*(1-stuck):bd*(0.5+0.5*Math.sin(q*0.7+i*1.9)),
        skip:i=>i===5,after:(cx,i)=>{if(i!==5)return;const fl=880,h=gp_kidH(fl),top=fl-0.37*h,lift=ag_in(tt,c.lost-0.9,0.6),sx=676+0.11*h+0.52*h*0.42-0.03*h;
          gp_pupil(cx,GP_KIDS[5],676,fl,h,{t:tt+6,expr:PK.exprMix("listen","worry",stuck),gaze:[U.lerp(U.lerp(gp_toward(676,tx),0.7,bd),0.6,stuck),U.lerp(U.lerp(-0.2,-0.1+0.25*Math.sin(tt*0.6+5),bd),0.5,stuck)],nod:0.1*Math.sin(tt*0.9)*bd*(1-stuck),
            hand:[U.lerp(sx+Math.sin(tt*9)*0.004*h*(1-stuck),676+0.32*h,lift),U.lerp(top-0.016*h,top-0.07*h,lift)],handK:1,slate:lift<0.05,
            hold:lift>=0.05?gp_slateUp(GP_SUM.slice(0,6),{k:1.15,dy:34}):null});}});
      if(!behind)Js=sensei(x,tt,{say:[[w("see","understood",0.1),w("see","understood",1.6)]]});
      gp_say(x,Js,tt,w("see","understood",0.1),c.lost-0.6,["Is that clear?"],cam,{dx:-60});}},
    // after school: the teacher alone with the girl's slate, the sum on it not done; he looks to the door
    {at:tB,place:"gpClass",later:true,keys:[[tB,900,600,1.12],[c.change-0.3,800,570,1.06]],d:2.4,draw:(x,tt,cam)=>{
      gp_door(x,0);gp_clock(x,15.5+(tt-tB)/120);GP_SEATS.forEach(([i,sx,fl])=>gp_seat(x,sx,fl,gp_kidH(fl)));
      const look=ag_in(tt,c.change+0.2,0.8);
      gp_person(x,"sensei",960,914,gp_hM(914),PK.poseMix(GP_HOLD,GP_SIDE,0.6*look),{t:tt,flip:true,expr:PK.exprMix("think","worry",0.5),gaze:[1,U.lerp(0.6,-0.15,look)],
        hold:gp_slateUp(GP_SUM.slice(0,6),{k:1.1,dy:U.lerp(30,10,look)})});}},
    // other days: the class at work, the door slides open, and teachers come in to watch: one by the door, one at the back, one who
    // walks along between the rows and bends by the girl, to see how she answers
    {at:tC,place:"gpClass",later:true,keys:[[tC,960,540,1.0],[c.watch-0.4,900,580,1.1],[c.watch+2.6,860,600,1.2]],d:2.6,draw:(x,tt,cam)=>{
      const op=ag_io(tt,c.open+0.1,c.groups+1.6,0.8),t1=c.open+0.4,t2=t1+1.2,t3=t1+2.4;gp_door(x,op);gp_clock(x,10.2+(tt-tC)/120);
      // at the back, behind the children: the woman teacher, along to the right
      if(tt>=t2)gp_walk(x,"aoki",tt,{x0:214,x1:1310,t0:t2,t1:t2+3.6,floor:814,h:gp_hM,then:"clasp"},{flip:ag_in(tt,t2+3.7,0.5),a:U.pin(tt,t2,0.4),expr:"listen",gaze:[1,0.2]});
      const bend=ag_in(tt,w("watch","children",-0.2),0.8),wv={x0:96,x1:598,t0:c.watch-0.6,t1:c.watch+1.6,floor:906,h:gp_hM(906),before:"listen",then:PK.poseMix("listen",GP_BEND,bend)};
      gp_class(x,tt,{look:(i,q)=>i===5?[0.6,0.4]:[0.7,-0.1+0.25*Math.sin(q*0.6+i)],expr:(i,q)=>i===5?"think":i===2||i===7?"glad":"listen",
        write:(i,q)=>i===5?0.5+0.5*Math.sin(q*0.9):0.5+0.5*Math.sin(q*0.7+i*1.9),
        after:(cx,i,j)=>{
          // by the door, between the back row and the middle one: the young teacher, his notebook in his hand
          if(j===2&&tt>=t1)gp_walk(cx,"kato",tt,{x0:214,x1:262,t0:t1,t1:t1+1.0,floor:xx=>U.lerp(808,846,(xx-214)/48),h:gp_hM,then:"listen"},Object.assign({flip:0,a:U.pin(tt,t1,0.4),hold:gp_booklet({})},
            PK.face(tt,{expr:"listen",gaze:[1,0.3]},[[c.groups+1.2,"nod"],[c.watch+0.6,"look",3.0,[1,0.55]],[c.watch+4.2,"nod"],[c.watch+6.0,"smile",2.0]])));
          // between the middle row and the front one: the older teacher, who comes along the row to the girl and bends to see her slate
          if(j===5&&tt>=t3){if(tt<c.watch-0.6)gp_walk(cx,"ueda",tt,{x0:214,x1:96,t0:t3,t1:t3+1.4,floor:xx=>U.lerp(806,906,(214-xx)/118),h:gp_hM,then:"listen"},{flip:1-ag_in(tt,t3+1.5,0.5),a:U.pin(tt,t3,0.4),hold:gp_booklet({}),expr:"listen"});
            else gp_walk(cx,"ueda",tt,wv,{flip:0,hold:gp_booklet({}),expr:PK.exprMix("listen","smile",0.4*bend),gaze:[1,U.lerp(0.2,0.8,bend)]});}}});
      gp_chalkTeach(x,"sensei",tt,SU,{x:b.x,y:b.y,k:1,floor:904,h:gp_hM(904),rest:1700,face:0.66,stand:GP_READ,hold:gp_book({k:1.3}),expr:"neutral",
        say:[[c.open+0.6,c.open+2.2],[c.groups+1.4,c.groups+3.2],[c.watch+3.0,c.watch+4.6]],events:[[c.open+2.6,"look",2.4,[0.5,0.3]],[c.groups+4.0,"nod"],[c.watch+0.8,"smile",2.2],[c.watch+5.4,"look",2.0,[0.7,0.1]]]});}},
    // afterwards: they sit together in the empty room and talk about what the children learned, and where they got stuck
    {at:tD,place:"gpClass",later:true,keys:[[tD,760,600,1.2],[tD+2.4,1196,660,1.33],[c.study-1.0,1214,665,1.36]],d:2,draw:(x,tt,cam)=>{
      const sk=w("after","stuck",-0.6),sp=[w("after","talked",-0.2),sk];
      const R=gp_ring(x,tt,{board:gp_sumsDone(),clock:15.4+(tt-tD)/120,
        kato:PK.face(tt,{expr:"listen",gaze:[1,0.1]},[[sk,"say",1.8],[sk+2.2,"nod"]]),
        aoki:PK.face(tt,{expr:"listen",gaze:[1,0]},[[sp[0]+0.4,"nod"],[sk+0.6,"nod"],[sk+1.4,"look",2.2,[1,0.4]]]),
        sensei:PK.face(tt,{expr:"listen",gaze:[1,-0.1]},[[sp[0]+1.2,"nod"],[sk+0.9,"think",2.6]]),
        ueda:PK.face(tt,{expr:"listen",gaze:[1,-0.1]},[[sp[0]+0.8,"nod"],[sk+1.0,"nod"]])});
      gp_say(x,R.kato,tt,sk,c.study-0.9,["Here, they got stuck."],cam,{dx:-300});}},
    // the 1880s: a head teacher joins a group of teachers; lesson study begins
    {at:tE,place:"gpClass",later:true,keys:[[tE,1214,665,1.36],[tE+2.4,960,540,1.0],[tE+4.8,1040,560,1.08]],d:2.4,draw:(x,tt,cam)=>{
      gp_door(x,ag_io(tt,tE+0.4,tE+4.0,0.8));gp_clock(x,15+(tt-tE)/120);
      const wk={x0:214,x1:1540,t0:tE+0.8,t1:tE+4.8,floor:xx=>xx<1290?812:U.lerp(812,900,(xx-1290)/250),h:gp_hM,then:"stand"},ta=tE+5.2,back=PK.walkAt(tt,wk).x<1290,fo=wk.floor(PK.walkAt(tt,wk).x);
      const ok=()=>gp_walk(x,"okada",tt,wk,{flip:ag_in(tt,wk.t1+0.1,0.6)*0.5,a:U.pin(tt,wk.t0,0.4),expr:gp_says("smile",tt,c.study+0.4,c.study+3.0)});
      let Jo=back?ok():null;GP_SEATS.forEach(([i,sx,fl])=>gp_seat(x,sx,fl,gp_kidH(fl)));
      // the teachers, and Mr Okada among them once he is in front of the desks: whoever stands further back is drawn first
      [["aoki",1730,884,true,2],["kato",1320,896,false,0],["ueda",1820,950,true,3],["mori",1400,958,false,1]].forEach(([k,gx,fl,fp,i])=>(!back&&!Jo&&fl>fo&&(Jo=ok()),gp_person(x,k,gx,fl,gp_hM(fl),i===1?"clasp":"listen",
        Object.assign({t:tt+i,flip:fp},PK.face(tt,{expr:"listen",gaze:[1,0.1]},[[ta+0.4+i*0.3,"nod"],[c.study+1.4+i*0.2,"smile",2.6]])))));
      if(!Jo)Jo=ok();
      PK.nameTag(x,Jo.hc[0],Jo.hc[1]-150,"Mr Okada","Head teacher",ag_io(tt,ta,tF-0.3,0.4));}},
    // the blackboard, close: Mr Okada writes lesson study's four steps
    {at:tF,cut:true,place:"gpBoard",keys:[[tF,960,540,1.0]],d:2,draw:(x,tt,cam)=>{gp_chalkTeach(x,"okada",tt,ST,{say:[[c.cycle,sc.ends.cycle],[c.teach,sc.ends.teach]]});}},
    // today, in Japan: a research lesson, many teachers watching the children
    {at:tG,place:"gpJapan",dis:1.0,keys:[[tG,960,540,1.0],[c.spread+3.4,900,560,1.08]],d:3,draw:(x,tt,cam)=>{
      gp_person(x,"obs3",300,830,gp_hM(830),"clasp",{t:tt,flip:false,hold:gp_clip,expr:"listen",gaze:[1,0.5]});
      gp_person(x,"obs4",1060,826,gp_hM(826),"listen",{t:tt+1,flip:false,hold:gp_clip,expr:"listen",gaze:[1,0.6]});
      gp_jpClass(x,tt,{look:(i,q)=>[0.7,-0.1+0.25*Math.sin(q*0.6+i)],expr:(i,q)=>i%4===1?"glad":"listen"});
      gp_person(x,"obs1",130,900,gp_hM(900),"listen",{t:tt+2,flip:false,hold:gp_clip,expr:"listen",gaze:[1,0.6]});
      gp_person(x,"sato",1560,904,gp_hM(904),"ease",Object.assign({t:tt+3,flip:0.66},PK.face(tt,{expr:"smile",gaze:[1,0.2]},[[c.spread+1.0,"say",1.6],[c.spread+5.0,"say",1.4]])));
      gp_person(x,"obs2",1190,980,gp_hM(980),"clasp",{t:tt+4,flip:true,hold:gp_clip,expr:"listen",gaze:[1,0.5]});}},
    // the United States, after 1999: a teacher gives a colleague the book about it
    {at:tH,place:"gpUS",dis:1.0,keys:[[tH,960,560,1.06]],d:2,draw:(x,tt,cam)=>{
      const tg=w("world","book",-0.2),give=ag_io(tt,tg,tg+2.0,0.5),got=ag_in(tt,tg+0.9,0.3),hy=900-gp_hM(900)*0.5;
      PK.table(x,880,700,190,900);gp_strips(x,880,690,1);
      PK.seated(x,K.matt,640,900,gp_hM(900),"sit",Object.assign({t:tt,flip:false,chair:GP_TPAL.seat,reachN:[506,hy+20],reachNk:give,hold:gp_tome(got)},PK.face(tt,{expr:"listen",gaze:[1,0]},[[tg-0.4,"look",3.2,[-1,0.2]],[tg+1.4,"smile",2.6]])));
      PK.walk(x,K.ruth,tt,{x0:-60,x1:380,t0:tH+0.2,t1:tg,floor:960,h:gp_hM(960),then:"stand"},{t:tt,reachN:[490,hy+16],reachNk:give,hold:gp_tome(1-got),expr:gp_says("smile",tt,tg+0.3,tg+1.8)});}},
    // in a trial, teams of teachers: one team at its table with a researcher's materials on how children learn fractions
    {at:tI,place:"gpUS",later:true,keys:[[tI,960,560,1.06],[c.some+0.6,900,580,1.12]],d:2.4,draw:(x,tt,cam)=>{
      const tk=w("some","research",-1.2);
      PK.table(x,880,700,190,900);gp_strips(x,880,690,1);
      PK.seated(x,K.matt,640,900,gp_hM(900),"sit",Object.assign({t:tt,flip:false,chair:GP_TPAL.seat,reachN:[790,690],reachNk:ag_io(tt,tI+1,c.some,0.6)},PK.face(tt,{expr:"think",gaze:[1,0.4]},[[tk+1.6,"look",2.4,[1,-0.2]]])));
      PK.seated(x,K.lin,1120,900,gp_hM(900),"sit",Object.assign({t:tt+1,flip:true,chair:GP_TPAL.seat,hold:gp_strip(4,{col:1})},PK.face(tt,{expr:"listen",gaze:[1,0.2]},[[c.trial+1.0,"say",1.6],[tk+1.8,"smile",2.4]])));
      PK.walk(x,K.dee,tt,{x0:2000,x1:1400,t0:tk,t1:tk+2.2,floor:930,h:gp_hM(930),arms:{aN:[16,84,"grip"],aF:[24,92,"grip"],lean:-4},then:"armful"},{t:tt,hold:gp_kit,expr:gp_says("smile",tt,tk+2.6,tk+4.2)});}},
    // their students: a girl holds up a strip folded in thirds, and her teacher kneels beside her desk
    {at:tJ,place:"gpUS",later:true,keys:[[tJ,960,560,1.06],[c.fractions+3.0,900,580,1.12]],d:2.4,draw:(x,tt,cam)=>{
      const up=ag_in(tt,c.fractions+0.4,0.6);
      [[0,380,876],[1,740,876],[3,520,940]].forEach(([i,kx,fl])=>{const h=gp_hM(fl)*0.74;gp_kidAt(x,gp_usKid(i),kx,fl,h,{t:tt+i,expr:"listen",gaze:[0.7,0.1],on:(c2,D)=>gp_strips(c2,D.x0+D.w*0.5,D.top-6,0.5)});});
      const fl=940,h=gp_hM(fl)*0.74,top=fl-0.37*h;
      const Jk=gp_kidAt(x,gp_usKid(4),900,fl,h,{t:tt+5,expr:PK.exprMix("think","glad",up),gaze:[0.6,U.lerp(0.3,-0.4,up)],hand:[900+0.3*h,top-0.24*h*up-0.02*h],handK:1,hold:up>0.004?gp_strip(3,{col:2,dy:30}):null});
      PK.person(x,K.lin,1180,958,gp_hM(958),GP_KNEEL,Object.assign({t:tt,flip:true},PK.face(tt,{expr:"smile",gaze:[1,-0.2]},[[c.fractions+1.6,"say",1.4],[c.fractions+3.4,"nod"]])));}},
    // at work today: a new analyst alone at the end of the day; once a year, her manager hands her a grade
    {at:tK,place:"gpOffice",dis:1.0,keys:[[tK,960,560,1.06],[w("data","once a year",-0.6),900,560,1.12]],d:2.6,draw:(x,tt,cam)=>{
      const ty=w("data","once a year",-0.8),tg=ty+2.0,give=ag_io(tt,tg,c.grow-0.6,0.5),got=ag_in(tt,tg+0.8,0.3);
      PK.walk(x,PK.extra(4),tt,{x0:1180,x1:1720,t0:tK+0.6,t1:tK+3.4,floor:860,h:gp_hM(860),then:"stand"},{t:tt,a:1-U.pin(tt,tK+3.2,0.4),expr:"neutral"});
      const take=ag_io(tt,tg+0.2,c.grow-0.6,0.5);
      PK.atDesk(x,K.ana,760,930,gp_hM(930),Object.assign({t:tt,screen:"monitor",chair:[90,100,110],show:gp_scrCode(),reachN:[U.lerp(900,988,take),U.lerp(690,640,take)],reachNk:Math.max(take,0.001),hold:gp_form(got),holds:got>0.5},
        PK.face(tt,{expr:PK.exprMix("neutral","think",got),gaze:[1,0.3]},[[tg-0.3,"look",2.8,[1,-0.3]]])));
      if(tt>=ty){const Jb=PK.walk(x,K.boss,tt,{x0:1760,x1:1080,t0:ty,t1:tg,floor:930,h:gp_hM(930),then:"stand"},{t:tt,flip:true,a:U.pin(tt,ty,0.4),reachN:[1000,644],reachNk:give,hold:gp_form(1-got),expr:gp_says("neutral",tt,tg+0.4,tg+1.8)});
        gp_say(x,Jb,tt,tg+0.4,c.grow-0.6,["Meets expectations."],cam);}}},
    // back to the classroom: a better lesson; the girl holds up her slate with the answer
    {at:tL,place:"gpClass",dis:1.0,keys:[[tL,930,570,1.08],[c.breath,960,540,1.0]],d:3,draw:(x,tt,cam)=>{
      gp_door(x,0);gp_clock(x,10.6+(tt-tL)/120);const up=ag_in(tt,c.grow+0.6,0.7),ok=ag_in(tt,c.grow+1.6,0.5);
      gp_person(x,"aoki",1300,816,gp_hM(816),"clasp",{t:tt,flip:true,expr:PK.exprMix("listen","smile",ok),gaze:[1,0.4]});
      gp_class(x,tt,{look:(i,q)=>[0.7,-0.1+0.25*Math.sin(q*0.6+i)],expr:(i)=>i===2||i===7?"glad":"listen",skip:i=>i===5,
        after:(cx,i,j)=>{if(j===2)gp_person(cx,"kato",262,846,gp_hM(846),"listen",{t:tt+1,flip:0,hold:gp_booklet({}),expr:PK.exprMix("listen","smile",ok),gaze:[1,0.3]});
          if(i!==5)return;const fl=880,h=gp_kidH(fl),top=fl-0.37*h;
          gp_pupil(cx,GP_KIDS[5],676,fl,h,{t:tt+6,expr:PK.exprMix("think","glad",ok),gaze:[0.7,U.lerp(0.3,-0.2,up)],hand:[676+0.3*h,top-0.2*h*up-0.03*h],handK:1,slate:up<0.5,
            hold:up>0.004?gp_slateUp(GP_SUM.slice(0,ok>0.5?7:6),{k:1.15,dy:34}):null});}});
      // once the title's veil comes over the board, its sums are only background
      gp_chalkTeach(x,"sensei",tt,SU.map(r=>Object.assign({},r,{at:null})),{x:b.x,y:b.y,k:1,floor:904,h:gp_hM(904),rest:1700,face:0.66,stand:GP_READ,hold:gp_book({k:1.3}),deco:tt>=c.breath+0.2,
        expr:PK.exprMix("neutral","smile",ok),events:[[c.grow+2.4,"nod"]]});}}
  ]);
  gp_card(ctx,S,t,c.when-0.2,c.new-0.4,{kick:"Japan",title:"1872",sub:"A school for every child"},{y:84});
  gp_card(ctx,S,t,c.alone+0.1,c.see-0.5,{kick:"By 1877",title:"One teacher: 4 schools in 10",sub:"One classroom: nearly 1 in 3"},{y:84});
  // it comes once Mr Okada, in at the door, has walked out from under it
  gp_card(ctx,S,t,c.study+2.4,tF-0.3,{kick:"The 1880s",title:"Lesson study",sub:"jugyō kenkyū"},{y:84});
  gp_card(ctx,S,t,w("spread","Today",-0.2),tH-0.3,{kick:"Japan, today",title:"99 in 100 primary teachers",sub:"took part in the past year",col:PK.C.green},{y:84});
  gp_card(ctx,S,t,c.world+0.2,tI-0.3,{kick:"After 1999",title:"A book carries it",sub:"to many countries"},{y:84});
  gp_card(ctx,S,t,c.trial+0.2,c.some+2.2,{kick:"A trial in the United States",title:"39 teams of teachers",sub:"split at random"},{y:84});
  gp_card(ctx,S,t,c.fractions+0.4,tK-0.3,{kick:"Their students",title:"Understood fractions better",col:PK.C.green},{y:84});
  gp_imagined(ctx,S,t,tK+0.6,c.grow-0.8,"Today · imagined");
  PK.title(ctx,S,t,c.breath+0.2,"Growing people","Their goals, weekly feedback, the next step","Leading data people · Ownership and performance",{side:"right"});
});

/* ---------------------------------------------------------------- 2. Goals of her own: March 2027 */
scene("goals",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tC=c.helena-0.5,tF=w("write","On Friday",-0.5),tN=c.route-0.6,tR=c.real-0.5,tH=c.hers-0.5,tL=c.teachers-0.5,tM=c.met-0.5,N1=PK.pace(ctx,null,gp_note1(sc,w));
  const tA=5.4,tI=w("join","Ivy",-0.2),tw=w("write","asks",-0.2),tG=w("real","question",-0.3),tq=w("real","teaching rooms",-1.0),tp=w("met","one page",-0.2);
  ag_shots(ctx,S,t,sc.dur,[
    // Monday 1 March, nine o'clock: Helena brings Ivy in to her desk, which has nothing on it yet; Sam and Jun look round and smile.
    // Ivy walks in first, to the desk that is hers, and Helena the same few steps behind all the way: they never cross, nor walk as one
    // it closes in on Ivy and Helena past where Jun sits, so he leaves the frame whole rather than cut at its edge
    {at:0,place:"gpTeam",keys:[[0,960,540,1.0],[tA+0.6,800,560,1.25]],d:2.8,draw:(x,tt,cam)=>{
      const here=tt>=tA+0.15,sit=ag_in(tt,tA+0.15,0.9),turn=ag_in(tt,tA+0.9,0.7),sS=ag_io(tt,2.4,tA+2.2,0.6),sJ=ag_io(tt,3.2,tA+2.8,0.6);
      const R=gp_team(x,tt,{clock:9.0,mug:false,
        sam:Object.assign({work:1-0.85*sS,turn:sS},PK.face(tt,{expr:"neutral",gaze:[1,-0.2*sS]},[[2.8,"smile",3.6],[3.4,"nod"]])),
        jun:Object.assign({work:1-0.85*sJ},PK.face(tt,{expr:"neutral",gaze:[1,-0.2*sJ]},[[3.6,"smile",3.4],[4.2,"nod"]])),
        away:!here,ivy:Object.assign({pose:PK.poseSit(sit),work:0,turn},PK.face(tt,{expr:"glad",gaze:[1,0]},[[tA+1.8,"nod"],[w("join","first job",0.2),"smile",2.6],[w("join","statistics",0),"nod"]]))});
      const Ji=here?R.ivy:PK.walk(x,"ivy",tt,{x0:2090,x1:GP_IVY.x,t0:0.3,t1:tA,floor:GP_IVY.floor,h:GP_HI,then:"stand"},{t:tt+1,expr:"glad",gaze:[1,0.1]});
      PK.walk(x,"helena",tt,{x0:2340,x1:810,t0:0.3,t1:tA,floor:916,h:gp_hT(916),then:"clasp"},PK.face(tt,{expr:"smile",gaze:[1,0.1]},[[tA+0.9,"say",1.4],[w("join","statistics",0.3),"nod"]]));
      PK.nameTag(x,Ji.hc[0]+50,Ji.hc[1]-150,"Ivy Reyes","Data analyst",ag_io(tt,tI,tC-0.4,0.4));}},
    // Helena's corner, that afternoon: she doesn't hand her a list; she asks her to write three goals of her own
    {at:tC,cut:true,place:"gpCorner",keys:[[tC,960,540,1.0],[tF-0.6,1010,560,1.08]],d:3,draw:(x,tt,cam)=>{
      const R=gp_corner(x,tt,{t0:tC,lean:ag_in(tt,tw,0.6),
        H:PK.face(tt,{expr:"smile",gaze:[1,0.1]},[[c.helena+0.4,"say",1.2],[tw+0.2,"say",2.0],[tF-1.4,"nod"]]),
        I:PK.face(tt,{expr:"listen",gaze:[1,0.05]},[[c.helena+1.8,"look",1.4,[1,0.5]],[tw+1.6,"nod"],[tw+2.6,"smile",2.4]])});
      PK.nameTag(x,R.helena.hc[0],R.helena.hc[1]-150,"Helena Novak","Data manager",ag_io(tt,w("helena","Helena",-0.2),tw-0.3,0.4));
      gp_say(x,R.helena,tt,tw,tF-0.7,["Write three goals","of your own."],cam);}},
    // Friday 5 March: she has written them; she turns her notebook round for Helena to read, and they agree them
    {at:tF,place:"gpCorner",later:true,keys:[[tF,1010,560,1.08],[tN-0.3,1060,580,1.16]],d:2.4,draw:(x,tt,cam)=>{
      const sh=ag_in(tt,tF+1.2,0.8),ok=ag_in(tt,w("write","agree",-0.2),0.6);
      gp_corner(x,tt,{t0:tF,ibook:1,mugDown:true,show:sh,lean:0.6*sh,
        H:PK.face(tt,{expr:"listen",gaze:[1,U.lerp(0.1,0.8,sh)]},[[w("write","agree",0),"nod"],[w("write","agree",0.4),"smile",2.4]]),
        I:PK.face(tt,{expr:PK.exprMix("listen","glad",ok),gaze:[1,U.lerp(0.1,0.6,sh)]},[[w("write","agree",0.3),"nod"]])});}},
    // her three goals, in her notebook, as the voice says each
    {at:tN,place:"gpNotes",dis:0.6,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"ivy",tt,N1,{});}},
    // Helena's part is real work: from Ivy's desk, a call with Graham Ellis, who has a question about the teaching rooms. Helena,
    // who brought it, stands by; Ivy notes it down
    {at:tR,cut:true,place:"gpTeam",keys:[[tR,800,470,1.2]],d:2,draw:(x,tt,cam)=>{
      const wr=ag_io(tt,tq+1.6,tH-0.7,0.5);
      gp_team(x,tt,{clock:10.5,book:1,show:PK.onScreen.call(1,true),sam:{expr:"neutral"},jun:{expr:"neutral"},
        ivy:gp_jot(tt,wr,PK.face(tt,{expr:"smile",gaze:[1,-0.1+0.8*wr]},[[tG+0.6,"say",1.0],[tq+0.4,"nod"],[c.real+5.8,"nod"]]))});
      PK.person(x,"helena",800,916,gp_hT(916),"clasp",Object.assign({t:tt,flip:true},PK.face(tt,{expr:"smile",gaze:[1,0.3]},[[c.real+0.6,"say",1.4],[tG+1.0,"nod"],[tq+1.8,"look",1.8,[1,0.1]]])));
      let J=null;
      PK.callout(x,40,50,540,250,[205,474],ag_io(tt,tG-0.2,tH-0.3,0.4),(cc,bx,by,bw,bh)=>{J=PK.call(cc,bx,by,bw,bh,[
        {who:"graham",a:ag_in(tt,tG,0.4),face:{expr:"smile"},say:[[tG+0.6,tG+1.4],[tq,tq+2.4]],events:[[c.real+5.2,"nod"]],name:"Graham Ellis",role:"Director of Facilities"}],tt,{stack:true});});
      if(J)PK.say(x,J[0],["How full are the teaching","rooms, really?"],ag_io(tt,tq,tH-0.5,0.3),{cam});}},
    // her goals are her own: on the same page, set apart from the team's measures
    {at:tH,place:"gpNotes",dis:0.6,keys:[[tH,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"ivy",tt,N1,{});}},
    // like the teachers choosing their goal: the group of the 1880s in its ring, the young teacher noting it down
    {at:tL,place:"gpClass",dis:1.0,keys:[[tL,1196,660,1.33],[tM-0.3,1214,665,1.36]],d:2,draw:(x,tt,cam)=>{
      gp_ring(x,tt,{clock:15.2+(tt-tL)/120,
        kato:PK.face(tt,{expr:"think",gaze:[1,0.7]},[[c.teachers+1.6,"nod"],[c.teachers+3.0,"smile",1.6]]),
        aoki:PK.face(tt,{expr:"smile",gaze:[1,0.1]},[[c.teachers+0.2,"say",2.0],[c.teachers+2.8,"nod"]]),
        sensei:PK.face(tt,{expr:"listen",gaze:[1,-0.1]},[[c.teachers+1.0,"nod"]]),
        ueda:PK.face(tt,{expr:"listen",gaze:[1,-0.1]},[[c.teachers+2.2,"nod"],[c.teachers+3.2,"smile",1.4]])});}},
    // Thursday 25 March: the first goal, met. Helena comes over; Ivy turns and holds up the page: the whole route, on one sheet
    {at:tM,cut:true,place:"gpTeam",keys:[[tM,960,540,1.0],[tM+3,960,530,1.02]],d:2.6,draw:(x,tt,cam)=>{
      const up=ag_in(tt,c.met+1.4,0.6),hold=ag_in(tt,c.met+1.9,0.6),ok=ag_in(tt,tp+0.2,0.6);
      const R=gp_team(x,tt,{clock:16.0,book:0,sam:PK.face(tt,{expr:"neutral"},[[c.met+2.6,"look",1.6,[1,0.4]],[tp+0.6,"smile",2]]),jun:PK.face(tt,{expr:"neutral"},[[c.met+1.2,"look",1.8,[1,0.4]],[tp+1.2,"nod"]]),
        ivy:Object.assign({turn:up,work:1-up,hold:hold>0.02?gp_sheet:null,holds:hold>0.5,reachN:[700,578],reachNk:hold},PK.face(tt,{expr:"glad",gaze:[1,0.1]},[[w("met","route",0),"say",1.6],[tp+0.4,"smile",3]]))});
      PK.walk(x,"helena",tt,{x0:2030,x1:900,t0:tM+0.2,t1:c.met+1.8,floor:916,h:gp_hT(916),then:"clasp"},PK.face(tt,{expr:PK.exprMix("smile","glad",ok),gaze:[1,0.4]},[[tp,"nod"],[tp+0.8,"smile",3]]));
      const tr=w("met","whole route",-0.4);
      PK.callout(x,350,60,440,325,[R.ivy.hdN[0]+12,R.ivy.hdN[1]-74],ag_io(tt,tr,sc.dur+1,0.4),(cc,bx,by,bw,bh)=>gp_route(cc,bx,by,bw,bh,ag_in(tt,tr+0.2,3.2)));}}
  ]);
  gp_card(ctx,S,t,w("join","Monday",-0.3),tC-0.45,{kick:"Monday 1 March",title:"Ivy's first day",col:PK.C.blue});
  gp_card(ctx,S,t,tF+0.3,tN-0.45,{kick:"Friday 5 March",title:"Three goals, agreed",col:PK.C.blue},{right:true,y:76});
  gp_card(ctx,S,t,w("met","Thursday",-0.3),sc.dur+1,{kick:"Thursday 25 March",title:"The first goal, met",col:PK.C.green},{right:true,x:1630,y:76});
  gp_imagined(ctx,S,t,0.2,tC-0.4);
  gp_kick(ctx,S,ag_in(t,1.0,0.6)*(1-Math.max(gp_apart(t,[[tN,tR],[tH,1e9]]),ag_io(t,tR,tH-0.1,0.3))));
});

/* ---------------------------------------------------------------- 3. Every Tuesday: April and May */
scene("tuesday",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const BA=PK.pace(ctx,"carmen",gp_boardA(sc,w)),BB=PK.pace(ctx,"carmen",gp_boardB(sc,w)),N2=PK.pace(ctx,null,gp_note2(sc,w));
  const tK=c.kluger-0.6,tZ=w("kluger","more than",-0.6),tW=sc.ends.person+0.5,tN=w("sbi","three parts",-0.8),tA=c.april-0.5,tV=w("april","reviewing",-0.3),
    tT=c.not-0.5,tS=c.scott-0.5,tY=c.may-0.5,tL=w("may","to yourself",-0.3),tO=c.works-0.6;
  ag_shots(ctx,S,t,sc.dur,[
    // every Tuesday, thirty minutes in Helena's corner: Ivy's time, about her. Ivy talks; Helena listens
    {at:0,place:"gpCorner",keys:[[0,960,540,1.0],[tK-0.4,1000,560,1.08]],d:3,draw:(x,tt,cam)=>{
      gp_corner(x,tt,{t0:0,lean:0.4,
        H:PK.face(tt,{expr:"listen",gaze:[1,0.05]},[[c.meet+1.6,"nod"],[w("meet","about her",0),"smile",2.4],[w("meet","status",0.2),"nod"]]),
        I:PK.face(tt,{expr:"smile",gaze:[1,0]},[[c.meet+0.6,"say",2.4],[w("meet","about her",-0.4),"say",2.0],[w("meet","status",0.6),"smile",2.0]])});}},
    // the team's room: Carmen Vidal, the consultant, explains at its board what research found about feedback; long enough for her
    // name to be read, and for her first row to be written, before the board comes close
    {at:tK,cut:true,place:"gpTeam",keys:[[tK,960,540,1.0],[tK+0.3,1010,530,1.08]],d:3,draw:(x,tt,cam)=>{
      const R=gp_lesson(x,tt,{clock:9.6,rows:BA,say:[[c.kluger,tZ+0.6]]});
      // her tag above her and to her right, over the board's right half, which stays clear until the third line: never over her first row
      PK.nameTag(x,R.carmen.hc[0]+150,R.carmen.hc[1]-150,"Carmen Vidal","Consultant",ag_io(tt,tK+0.4,tZ-0.3,0.4));}},
    // the board, close enough to read
    {at:tZ,cut:true,place:"gpUniBoard",keys:[[tZ,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BA,{say:[[tZ,sc.ends.kluger],[c.third,sc.ends.third],[c.person,sc.ends.person]]});}},
    // the room again: Ivy writes it down, and looks to Helena as the voice says her feedback has three parts
    {at:tW,cut:true,place:"gpTeam",keys:[[tW,1010,530,1.08]],d:2,draw:(x,tt,cam)=>{
      gp_lesson(x,tt,{clock:9.7,rows:BA,note:ag_io(tt,tW+0.3,tN-0.1,0.5),
        helena:PK.face(tt,{expr:"listen",gaze:[1,0.1]},[[w("sbi","Helena's",0),"smile",2.0],[w("sbi","Helena's",0.4),"nod"]]),
        sam:PK.face(tt,{expr:"listen",gaze:[1,-0.25]},[[tW+0.6,"nod"]]),jun:PK.face(tt,{expr:"listen",gaze:[1,-0.2]},[[tW+1.2,"nod"]])});}},
    // what she keeps: feedback in three parts
    {at:tN,place:"gpNotes",dis:0.6,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"ivy",tt,N2,{});}},
    // Tuesday 13 April, in the corner: Helena tells her what she did, and what it changed
    {at:tA,place:"gpCorner",dis:0.6,keys:[[tA,1000,560,1.08]],d:2,draw:(x,tt,cam)=>{
      gp_corner(x,tt,{t0:tA,lean:0.6,H:PK.face(tt,{expr:"smile",gaze:[1,0.05]},[[c.april+0.2,"say",tV-c.april+0.4]]),I:PK.face(tt,{expr:"listen",gaze:[1,0]},[[c.april+1.2,"nod"]])});}},
    // the Wednesday before, at her desk: the agent's draft beside the glossary. It took "used" to mean booked; Graham's word means
    // people in the room. She fixes it, so his answer counts people in rooms
    {at:tV,cut:true,place:"gpTeam",keys:[[tV,800,520,1.2],[c.counts,800,500,1.22]],d:2.4,draw:(x,tt,cam)=>{
      const g=w("april","Graham's",-0.2),ok=ag_in(tt,c.counts+0.4,0.8),lk=ag_in(tt,g-0.3,0.6);
      gp_team(x,tt,{clock:14.2,book:0,show:gp_scrTwo(ok),sam:{expr:"neutral"},jun:null,
        ivy:{work:U.lerp(1,0.4,lk*(1-ok)),expr:PK.exprMix(PK.exprMix("neutral","think",lk),"glad",ok),gaze:[1,0.2],nod:0.08*ok}});
      gp_screen(x,120,ag_io(tt,tV+0.4,tT-0.3,0.4),"WHAT “USED” MEANS",PK.C.mut,[
        ["The agent's draft: booked",ag_in(tt,tV+0.8,0.5),PK.C.amber,"cross"],["Graham's word: people in them",ag_in(tt,g,0.5),PK.C.green,"tick"],
        ["Counts people in rooms",ag_in(tt,w("counts","people",-0.2),0.5),PK.C.ink,"tick"]]);}},
    // the corner again: not "you're brilliant", which is about who she is; what she did, and what it changed
    {at:tT,cut:true,place:"gpCorner",keys:[[tT,1000,560,1.08]],d:2,draw:(x,tt,cam)=>{
      const R=gp_corner(x,tt,{t0:tT,lean:0.6,H:PK.face(tt,{expr:"smile",gaze:[1,0.05]},[[w("not","what she did",-0.2),"say",2.4]]),
        I:PK.face(tt,{expr:"listen",gaze:[1,0]},[[w("not","what she did",0.4),"nod"],[w("not","changed",0.2),"smile",2.0]])});
      gp_say(x,R.helena,tt,c.not,w("not","what she did",-0.3),["You're brilliant!"],cam,{think:true,strike:ag_in(tt,w("not","which is",-0.1),0.6)});}},
    // hard feedback works the same way: Carmen's second board, close
    {at:tS,cut:true,place:"gpUniBoard",keys:[[tS,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BB,{say:[[c.scott,sc.ends.scott]]});}},
    // Tuesday 25 May, in the corner: Helena begins to tell her about the week before
    {at:tY,cut:true,place:"gpCorner",keys:[[tY,1000,560,1.08]],d:2,draw:(x,tt,cam)=>{
      gp_corner(x,tt,{t0:tY,lean:0.7,H:PK.face(tt,{expr:"neutral",gaze:[1,0.05]},[[c.may+0.2,"say",tL-c.may+0.4]]),I:PK.face(tt,{expr:"listen",gaze:[1,0.1]},[[c.may+1.0,"nod"]])});}},
    // the week before: four days alone with her change, the clock going round; then Jun has one afternoon to review it, and rushes
    {at:tL,cut:true,place:"gpTeam",keys:[[tL,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const d4=U.clamp((tt-tL-0.6)/(c.rushed-tL-1.0),0,1),hr=9+U.sine(d4)*(3*24+7.75),sent=ag_in(tt,c.rushed-0.4,0.4),rv=ag_in(tt,c.rushed+0.2,0.6),rush=U.clamp((tt-c.rushed-0.2)/4,0,1);
      gp_team(x,tt,{clock:hr,book:0,sam:{expr:"neutral"},
        jun:Object.assign({work:U.lerp(0.6,1,rv)},PK.face(tt,{expr:PK.exprMix("neutral","worry",rv),gaze:[1,0.1]},[[c.rushed+2.6,"look",1.2,[1,-0.2]]])),
        ivy:{work:1-0.5*sent,expr:PK.exprMix("think","neutral",sent),gaze:[1,0.15]}});
      // Jun's screen: the long change, scrolling past as he reads it fast
      if(rv>0.004){PK.callout(x,1180,110,480,280,[1620,540],rv*(1-ag_in(tt,tO-0.6,0.3)),(cc,bx,by,bw,bh)=>gp_scrDiff(rush*3)(cc,bx+24,by+24,bw-48,bh-48));}}},
    // what she keeps: ask for a review when it works; small and often, while it's fresh
    {at:tO,place:"gpNotes",dis:0.6,keys:[[tO,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"ivy",tt,N2,{});}}
  ]);
  gp_card(ctx,S,t,c.meet+0.3,tK-0.45,{kick:"Every Tuesday",title:"Thirty minutes",sub:"Ivy's time, about her",col:PK.C.blue});
  gp_card(ctx,S,t,c.april+0.1,tV-0.3,{kick:"Tuesday 13 April",title:"In Helena's corner",col:PK.C.blue});
  gp_card(ctx,S,t,tV+0.2,c.counts-0.4,{kick:"The week before",title:"Wednesday 7 April"},{right:true,y:76});
  gp_card(ctx,S,t,c.may+0.1,tL-0.3,{kick:"Tuesday 25 May",title:"In Helena's corner",col:PK.C.blue});
  gp_card(ctx,S,t,tL+0.2,c.rushed+1.6,{kick:"The week before",title:"Four days, then one afternoon"});
  gp_kick(ctx,S,ag_in(t,1.0,0.6)*(1-Math.max(gp_apart(t,[[tZ,tW],[tN,tA],[tS,tY],[tO,1e9]]),ag_io(t,tV+0.2,tT-0.2,0.3))));
});

/* ---------------------------------------------------------------- 4. Both ways: June */
scene("both",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const N3=PK.pace(ctx,null,gp_note3(sc,w)),tJ=c.june-0.5,tN=w("thanks","From then",-0.6),tL=c.lesson-0.5,tC=c.council-0.5,tR=c.names-0.5;
  const iy=[w("june","when I bring",-0.2),w("june","you answer",-0.2),w("june","and I stop",-0.2)];
  ag_shots(ctx,S,t,sc.dur,[
    // in the corner, Helena asks for feedback on herself
    {at:0,place:"gpCorner",keys:[[0,960,540,1.0],[tJ-0.3,1000,560,1.08]],d:3,draw:(x,tt,cam)=>{
      const R=gp_corner(x,tt,{t0:0,lean:0.5,H:PK.face(tt,{expr:"smile",gaze:[1,0.05]},[[w("asks","what should",-0.2),"say",1.8]]),
        I:PK.face(tt,{expr:"listen",gaze:[1,0]},[[c.asks+1.2,"look",1.6,[1,0.3]],[w("asks","differently",0.2),"think",2.6]])});
      gp_say(x,R.helena,tt,w("asks","what should",-0.2),tJ-0.4,["What should I do differently?"],cam);}},
    // in June, Ivy tells her; Helena thanks her, and writes it down
    {at:tJ,place:"gpCorner",later:true,keys:[[tJ,1000,560,1.107],[tJ+0.2,1000,540,1.04]],d:1.6,draw:(x,tt,cam)=>{
      const th=w("thanks","thanks",-0.2),wr=ag_in(tt,th+1.0,0.6);
      const R=gp_corner(x,tt,{t0:tJ,lean:0.6,hbook:ag_in(tt,tJ+0.6,0.5),hwrite:wr,
        H:PK.face(tt,{expr:"listen",gaze:[1,0.05]},[[iy[1]+0.4,"nod"],[iy[2]+0.6,"think",1.4],[th,"smile",2.0],[th+0.3,"say",0.8]]),
        I:PK.face(tt,{expr:"neutral",gaze:[1,0]},[[iy[0],"say",sc.ends.june-iy[0]],[th+0.4,"smile",2.4]])});
      // two lines, and the camera wide enough: three would come down onto her head
      gp_say(x,R.ivy,tt,iy[0],th-0.3,["When I bring you a question, you answer","it at once, and I stop looking."],cam,{dx:-80,la:[1,ag_in(tt,w("june","at once",-0.2),0.3)]});
      gp_say(x,R.helena,tt,th,tN-0.4,["Thank you."],cam);}},
    // Helena's own notebook: what Ivy told her, and what she does from then on
    {at:tN,place:"gpNotesH",dis:0.6,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N3,{});}},
    // in lesson study, the group planned the lesson together: the talk afterwards is about the lesson and the children's learning
    {at:tL,place:"gpClass",dis:1.0,keys:[[tL,1196,660,1.33],[tC-0.3,1214,665,1.36]],d:2,draw:(x,tt,cam)=>{
      const ch=w("lesson","children's",-0.2);
      gp_ring(x,tt,{board:gp_sumsDone(),clock:15.5+(tt-tL)/120,
        kato:PK.face(tt,{expr:"listen",gaze:[1,0.1]},[[c.lesson+1.0,"nod"],[ch,"say",2.0]]),
        aoki:PK.face(tt,{expr:"smile",gaze:[1,0]},[[c.lesson+0.4,"say",2.6],[ch+1.0,"nod"]]),
        sensei:PK.face(tt,{expr:"listen",gaze:[1,-0.1]},[[c.lesson+2.2,"nod"],[ch+0.6,"smile",2.0]]),
        ueda:PK.face(tt,{expr:"listen",gaze:[1,-0.1]},[[c.lesson+3.0,"nod"],[ch+2.2,"nod"]])});}},
    // Thursday 24 June: on the campus, Graham writes to thank Helena
    {at:tC,place:"gpCampus",dis:1.0,keys:[[tC,900,570,1.1]],d:2,draw:(x,tt,cam)=>{
      gp_passer(x,tt,PK.extra(16),tC-2.5,{out:true});
      const ta=w("council","writes",0.2)+1.6,CH=gp_chatG(ta,2.6),cs=PK.chatSize(x,CH,{}),sent=ag_in(tt,ta+0.2,0.6);
      const Jg=PK.person(x,"graham",930,GP_CA.near,GP_HC,"phone",Object.assign({t:tt,flip:true,hold:PK.inHand.phone({back:true}),holds:true},
        PK.face(tt,{expr:PK.exprMix("smile","glad",sent),gaze:[1,0.9]},[[ta+0.8,"nod"]])));
      PK.callout(x,300,250,cs.w,cs.h,[Jg.hdN[0]-20,Jg.hdN[1]-30],ag_in(tt,w("council","writes",-0.4),0.4),(cc,bx,by,bw,bh)=>PK.chat(cc,bx,by,bw,bh,CH,tt,{}));}},
    // at the next review, in the team's room, she reads his note to the team, and says who did each part; Mei has come over
    {at:tR,cut:true,place:"gpTeam",keys:[[tR,960,540,1.0]],d:2.6,draw:(x,tt,cam)=>{
      const pI=w("parts","Ivy's",-0.2),pJ=w("parts","Jun's",-0.2),pS=w("parts","Sam's",-0.2),pM=w("parts","Mei's",-0.2),cr=c.credit,pub=ag_in(tt,cr+0.2,0.8),rd=ag_io(tt,tR+0.6,c.parts-0.6,0.5);
      const R=gp_team(x,tt,{clock:10.0,pot:null,book:0,
        sam:Object.assign({work:0,turn:1},PK.face(tt,{expr:PK.exprMix("listen","glad",pub),gaze:[1,-0.1]},[[pS+0.4,"smile",2.4],[pS+0.6,"nod"]])),
        jun:Object.assign({work:0},PK.face(tt,{expr:PK.exprMix("listen","glad",pub),gaze:[1,-0.1]},[[pJ+0.4,"smile",2.4],[pJ+0.6,"nod"]])),
        ivy:Object.assign({turn:1,work:0},PK.face(tt,{expr:PK.exprMix("listen","glad",pub),gaze:[1,-0.05]},[[pI+0.4,"smile",2.4],[pI+0.6,"nod"]]))});
      const Jm=PK.person(x,"mei",1560,900,gp_hT(900),"clasp",Object.assign({t:tt+2,flip:true},PK.face(tt,{expr:PK.exprMix("listen","glad",pub),gaze:[1,0]},[[pM+0.4,"smile",2.4],[pM+0.6,"nod"]])));
      const Jh=PK.person(x,"helena",1000,950,gp_hT(950),PK.poseMix("phone","clasp",ag_in(tt,c.parts-0.8,0.6)),Object.assign({t:tt+4,flip:false,hold:PK.inHand.phone({}),holds:true},
        PK.face(tt,{expr:"smile",gaze:[1,U.lerp(0.8,0,ag_in(tt,c.parts-0.8,0.6))]},[[c.names+0.3,"say",2.6],[pI,"look",1.2,[-1,-0.1]],[pJ,"look",1.2,[1,-0.2]],[pS,"look",1.2,[1,-0.2]],[pM,"look",1.6,[1,0]],[cr,"say",1.8]])));
      gp_say(x,Jh,tt,c.names+0.2,c.parts-0.5,["“Thank you. Your team's page","let the University Council decide.”"],cam,{la:[1,ag_in(tt,c.names+1.0,0.3)]});
      const tg=(J,name,part,at,dy,dx)=>PK.nameTag(x,J.hc[0]+(dx||0),J.hc[1]-(dy||130),name,part,ag_io(tt,at,sc.dur+1,0.4));
      tg(R.ivy,"Ivy Reyes","The route",pI);tg(R.jun,"Jun Park","The models",pJ,130,-50);tg(R.sam,"Sam Okafor","The sensors",pS);tg(Jm,"Mei Tanaka","The bookings",pM,130,-30);}}
  ]);
  gp_card(ctx,S,t,tJ+0.3,tN-0.5,{kick:"June",title:"In Helena's corner",col:PK.C.blue});
  gp_card(ctx,S,t,c.council+0.7,tR-0.4,{kick:"Thursday 24 June",title:"The new teaching building, put off",sub:"by the University Council"},{right:true,y:76});
  gp_kick(ctx,S,ag_in(t,1.0,0.6)*(1-gp_apart(t,[[tN,tR]])));
});

/* ---------------------------------------------------------------- 5. The next step: July to December */
const GP_CARRY={lean:2,head:6,aN:[18,96,"grip"],aF:[16,92,"grip"],lN:[-2,-2],lF:[4,3]};
scene("next",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const N4=PK.pace(ctx,null,gp_note4(sc,w)),tB=w("july","Ivy owns",-0.2),tH=c.mid-0.5,tN=w("mid","half year",-0.35),tF=c.forward-0.5,tD=c.dec-0.5;
  ag_shots(ctx,S,t,sc.dur,[
    // Thursday 1 July: Helena brings her a seedling in a pot, as the team does when someone first owns a product. Her screen says
    // what she owns: the counts per room per hour, refreshed every Monday by seven
    {at:0,place:"gpTeam",later:true,keys:[[0,960,540,1.0],[tB-0.6,940,550,1.03]],d:2.6,draw:(x,tt,cam)=>{
      const turn=ag_in(tt,tB-1.0,0.5),up=ag_in(tt,tB-0.6,0.8),th=tB+1.0,rk=ag_in(tt,tB+0.3,0.7),pull=ag_in(tt,th+0.2,0.9),hand=[U.lerp(676,628,pull),U.lerp(588,604,pull)],seen=ag_in(tt,tB+0.6,0.6);
      const R=gp_team(x,tt,{clock:9.1,sam:{work:1-0.8*seen,expr:PK.exprMix("neutral","smile",seen),gaze:[1,-0.3*seen],turn:seen},jun:{work:1-0.8*seen,expr:PK.exprMix("neutral","smile",seen)},
        ivy:Object.assign({turn,work:0.3*(1-turn),pose:PK.poseSit(1-up),expr:PK.exprMix("neutral","glad",ag_in(tt,tB+0.6,0.6)),gaze:[1,0.2],hold:tt>=th?gp_potHold(0.3):null},
          tt<tB-0.2?{}:{reachN:hand,reachNk:rk,reachF:[hand[0]+22,hand[1]+8],reachFk:rk})});
      const Jh=PK.walk(x,"helena",tt,{x0:2030,x1:806,t0:0.4,t1:tB-0.2,floor:904,h:gp_hT(904),arms:{aN:GP_CARRY.aN},then:PK.poseMix(GP_CARRY,"clasp",ag_in(tt,th+0.35,0.7))},
        {hold:tt<th?gp_potHold(0.3):null,expr:gp_says("smile",tt,tB+0.3,tB+1.6),reachN:[690,590],reachNk:ag_io(tt,tB+0.2,th+0.5,0.6)});
      // to her right, over the board: the tag of Ivy's steps is above Ivy
      gp_say(x,Jh,tt,tB+0.3,w("july","counts",-0.6),["It's yours now."],cam,{dx:240});
      gp_steps(x,R.ivy.hc[0],R.ivy.hc[1]-150,tt,ag_io(tt,tB+0.1,w("july","counts",-0.7),0.4),[-1e9,tB+0.4,1e9]);
      gp_screen(x,84,ag_io(tt,w("july","counts",-0.3),tH-0.3,0.4),"TEACHING SPACE USE",PK.C.orange,[
        ["Counts per room, per hour",ag_in(tt,w("july","counts",-0.1),0.5),PK.C.ink],["Every Monday by 7:00",ag_in(tt,w("july","every Monday",-0.1),0.5),PK.C.blue]]);}},
    // Tuesday 20 July: her half year, looked back on and forward, from the notebook open between them
    {at:tH,cut:true,place:"gpCorner",keys:[[tH,1000,560,1.08]],d:2,draw:(x,tt,cam)=>{
      gp_corner(x,tt,{t0:tH,ibook:1,mugDown:true,show:ag_in(tt,c.mid+1.4,0.8),lean:0.5,
        H:PK.face(tt,{expr:"smile",gaze:[1,0.4]},[[c.mid+0.4,"say",1.6],[tN-0.6,"nod"]]),I:PK.face(tt,{expr:"glad",gaze:[1,0.5]},[[c.mid+2.0,"say",1.4]])});}},
    // her notes of it, open as the notebook comes out between them and the voice says "her half year": all three goals met;
    // what went well; what she'd do differently; what she wants next
    {at:tN,place:"gpNotes",dis:0.6,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"ivy",tt,N4,{});}},
    // a growth conversation looks forward: Helena asks where she wants to go, and what she needs to get there
    {at:tF,place:"gpCorner",dis:0.6,keys:[[tF,1000,560,1.08],[tF+0.3,1000,540,1.04]],d:1.6,draw:(x,tt,cam)=>{
      const q1=w("forward","where",-0.2),q2=w("forward","what she needs",-0.2);
      const R=gp_corner(x,tt,{t0:tF,lean:0.7,H:PK.face(tt,{expr:"smile",gaze:[1,0.05]},[[q1,"say",1.4],[q2,"say",1.6]]),
        I:PK.face(tt,{expr:"listen",gaze:[1,0]},[[q1+1.0,"think",1.6],[q2+1.4,"smile",2.4],[q2+1.8,"nod"]])});
      gp_say(x,R.helena,tt,q1,tD-0.4,["Where do you want to go?","What do you need to get there?"],cam,{la:[1,ag_in(tt,q2,0.3)]});}},
    // Tuesday 14 December, at dusk: nearly six months an owner. Her next goal is one she chose: to coach the next graduate
    // the same framing and the same two people as the shot before: the light goes from July to a December dusk round them
    {at:tD,place:"gpCornerDusk",dis:1.0,keys:[[tD,1000,540,1.066]],d:3,draw:(x,tt,cam)=>{
      const tc=w("coach","to coach",-0.3);
      const R=gp_corner(x,tt,{t0:tD,dusk:true,lean:U.lerp(0.7,0.5,ag_in(tt,tD+1.2,0.8)),H:PK.face(tt,{expr:"listen",gaze:[1,0.05]},[[tc+0.8,"smile",3.0],[tc+1.2,"nod"],[c.steps+1.0,"nod"]]),
        I:PK.face(tt,{expr:"glad",gaze:[1,0]},[[tc-0.2,"say",2.2],[c.steps+0.6,"smile",3.0]])});
      gp_say(x,R.ivy,tt,tc,c.steps-0.4,["Next, I'd like to coach","the next graduate."],cam);
      gp_steps(x,R.ivy.hc[0],R.ivy.hc[1]-150,tt,ag_io(tt,c.steps-0.2,sc.dur+1,0.4),[c.steps-0.1,w("steps","owner",-0.2),w("steps","coach",-0.2)]);}}
  ]);
  gp_card(ctx,S,t,w("july","Thursday",-0.3),tH-0.45,{kick:"Thursday 1 July",title:"Teaching space use",sub:"Ivy's first data product",col:PK.C.orange},{right:true,x:1676,y:76});
  gp_card(ctx,S,t,c.mid+0.1,tN-0.45,{kick:"Tuesday 20 July",title:"Half a year",col:PK.C.blue});
  gp_card(ctx,S,t,c.dec+0.1,c.coach-0.6,{kick:"Tuesday 14 December",title:"Nearly six months an owner",col:PK.C.blue},{right:true,y:76});
  gp_kick(ctx,S,ag_in(t,1.0,0.6)*(1-Math.max(gp_apart(t,[[tN,tF]]),ag_io(t,w("july","counts",-0.5),tH-0.1,0.3))));
});

/* ---------------------------------------------------------------- 6. On Monday */
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const N5=PK.pace(ctx,null,gp_note5(sc,w)),tH=c.helena-0.5,tN=c.goals-0.6,tM=c.module-0.5,tE=c.breath+0.6;
  ag_shots(ctx,S,t,sc.dur,[
    // Japan's schools today: a research lesson, many teachers watching the children
    {at:0,place:"gpJapan",keys:[[0,960,540,1.0],[tH-0.4,900,560,1.08]],d:3,draw:(x,tt,cam)=>{
      gp_person(x,"obs3",300,830,gp_hM(830),"clasp",Object.assign({t:tt,flip:false,hold:gp_clip},PK.face(tt,{expr:"listen",gaze:[1,0.5]},[[c.way+1.0,"nod"]])));
      gp_person(x,"obs4",1060,826,gp_hM(826),"listen",Object.assign({t:tt+1,flip:false,hold:gp_clip},PK.face(tt,{expr:"listen",gaze:[1,0.6]},[[c.back+3.0,"nod"],[w("way","children's",0),"smile",2.0]])));
      gp_jpClass(x,tt,{look:(i,q)=>[0.7,-0.1+0.25*Math.sin(q*0.6+i)],expr:(i,q)=>i%4===1?"glad":"listen"});
      gp_person(x,"obs1",130,900,gp_hM(900),"listen",Object.assign({t:tt+2,flip:false,hold:gp_clip},PK.face(tt,{expr:"listen",gaze:[1,0.6]},[[c.back+1.4,"nod"]])));
      gp_person(x,"sato",1560,904,gp_hM(904),"ease",Object.assign({t:tt+3,flip:0.66},PK.face(tt,{expr:"smile",gaze:[1,0.2]},[[c.back+0.6,"say",1.6],[c.way+1.0,"say",1.4]])));
      gp_person(x,"obs2",1190,980,gp_hM(980),"clasp",Object.assign({t:tt+4,flip:true,hold:gp_clip},PK.face(tt,{expr:"listen",gaze:[1,0.5]},[[w("way","better",0),"nod"]])));}},
    // Helena did the same for Ivy: in the team's room, a Tuesday like the others, the seedling grown on the sill
    {at:tH,place:"gpTeam",dis:1.0,keys:[[tH,960,540,1.0]],d:2.6,draw:(x,tt,cam)=>{
      const up=ag_in(tt,tH+0.6,0.6);
      gp_team(x,tt,{clock:11.0,pot:0.85,book:0,sam:{expr:"neutral"},jun:{expr:"neutral"},
        ivy:Object.assign({turn:up,work:1-up},PK.face(tt,{expr:"glad",gaze:[1,0]},[[w("helena","goals",0),"say",1.6],[w("helena","next step",0.2),"nod"]]))});
      PK.person(x,"helena",820,916,gp_hT(916),"clasp",Object.assign({t:tt,flip:true},PK.face(tt,{expr:"smile",gaze:[1,0.3]},[[c.helena+0.6,"say",1.4],[w("helena","feedback",0),"nod"],[w("helena","next step",0.4),"smile",2.0]])));}},
    // what to do on Monday, in Ivy's notebook: she leads people now too
    {at:tN,place:"gpNotes",dis:0.6,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"ivy",tt,N5,{});}},
    // March 2028: the next graduate's first day. Helena brings them in; Ivy stands up to meet them, her hand out
    {at:tM,place:"gpTeam",dis:0.6,keys:[[tM,960,540,1.0],[c.take,940,550,1.03]],d:2.6,draw:(x,tt,cam)=>{
      const tA=tM+3.4,up=ag_in(tt,tA-0.8,0.8),sh=ag_io(tt,tA+0.4,tA+2.6,0.5),bob=Math.sin((tt-tA)*9)*6*sh,mid=[700,640+bob];
      const R=gp_team(x,tt,{clock:9.0,pot:1,book:0,sam:{expr:"smile"},jun:{expr:"smile"},
        ivy:Object.assign({turn:1,work:0,pose:PK.poseSit(1-up,"ease"),reachN:mid,reachNk:sh},PK.face(tt,{expr:"glad",gaze:[1,0]},[[tA+0.4,"say",1.4],[c.take+0.6,"nod"]]))});
      const G=PK.extra(21);
      PK.walk(x,G,tt,{x0:2060,x1:780,t0:tM+0.2,t1:tA,floor:900,h:gp_hT(900),then:"stand"},Object.assign({reachF:mid,reachFk:sh},PK.face(tt,{expr:"smile",gaze:[1,0]},[[tA+0.6,"nod"],[tA+1.6,"glad",3.0]])));
      PK.walk(x,"helena",tt,{x0:2140,x1:1060,t0:tM+0.6,t1:tA+0.4,floor:930,h:gp_hT(930),then:"clasp"},PK.face(tt,{expr:"smile",gaze:[1,0.1]},[[tA+1.2,"nod"],[c.take+0.4,"smile",3]]));
      PK.nameTag(x,R.ivy.hc[0],R.ivy.hc[1]-150,"Ivy Reyes","Coach",ag_io(tt,tA+0.2,tE-0.4,0.4));}}
  ]);
  // it leaves as Ivy's tag comes, above her as she stands
  gp_card(ctx,S,t,tM+0.4,tM+3.2,{kick:"March 2028",title:"The next graduate",col:PK.C.blue});
  gp_imagined(ctx,S,t,tM+0.4,tE-0.4,"The university, 2028 · imagined");
  gp_kick(ctx,S,ag_in(t,1.0,0.6)*(1-Math.max(gp_apart(t,[[0,tH],[tN,tM]]),ag_in(t,tE-0.6,0.4))));
  PK.end(ctx,S,t,tE,"Growing people",GP_LAST,"Film 4 of 4","Ownership and performance",{side:"right"});
});
ag_cutInto(["tuesday","next"]);
