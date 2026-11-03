/* ===== A model, reasoning, hands and a loop: the nine chapters =====
   Each chapter is a few shots, in the places of past.js and the series' room, cut together with short dissolves (ml_shots). Times
   inside a chapter come from its cues (when each line starts) and the words of its lines (wAt), so the pictures stay with the voice if
   it's recorded again. Words on screen are on cards, labels and pills, at least 28 px as seen, and above the captions. */

// made once per chapter, the first time it draws: its cues are known by then
const ml_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// the shared ag_shots, with a dissolve of each shot's own (sh.dis, seconds; 0.5 by default): the river into today takes longer
function ml_shots(ctx,S,t,end,shots){let i=0;for(let k=1;k<shots.length;k++)if(t>=shots[k].at)i=k;
  const dis=i>0?(shots[i].dis||0.5):0.5,u=i>0?clamp((t-shots[i].at)/dis,0,1):1,till=k=>shots[k+1]?shots[k+1].at:end;
  if(u<1){ag_shot(ctx,S,t,shots[i-1],shots[i].at);const [bc,bx]=ag_buf("cut",ctx.canvas.width,ctx.canvas.height);ag_shot(bx,S,t,shots[i],till(i));
    ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=ease(u);ctx.drawImage(bc,0,0);ctx.restore();setScreen(ctx,S);}
  else ag_shot(ctx,S,t,shots[i],till(i));return i;}
// the corner's kicker: the latest of [[t, num, title], ...] passed, dissolving from the one before; a null num hides it
function ml_kick(ctx,t,mk,a){if(a<=0.01)return;let i=0;for(let k=1;k<mk.length;k++)if(t>=mk[k][0])i=k;const u=i>0?ag_in(t,mk[i][0],0.5):1;
  if(u<1&&mk[i-1][1])ag_kicker(ctx,mk[i-1][1],mk[i-1][2]||"",{a:a*(1-u)});if(mk[i][1])ag_kicker(ctx,mk[i][1],mk[i][2]||"",{a:a*u});}
// a card that springs in at t0 and goes at t1 (or stays): its k and a, for ag_textCard
const ml_pop=(t,t0,t1)=>({k:clamp(ag_spr(t,t0,0.8),0,1.2),a:t1==null?ag_in(t,t0,0.35):ag_io(t,t0,t1,0.35)});
// a gust's dip: 0 before t0, up to 1 and back over d seconds
const ml_dip=(t,t0,d)=>{const u=(t-t0)/(d||1.6);return u<=0||u>=1?0:Math.sin(Math.PI*u)*(u<0.4?1:1-0.15*(u-0.4));};
const ML_TITLE="A model, reasoning, hands and a loop";
// the room's paper-pale veil, inside a shot (ag_veil resets the camera)
function ml_veil(x,a){if(a<=0.01)return;x.fillStyle="rgba(240,238,233,"+clamp(a,0,1)+")";x.fillRect(-200,-200,W+400,H+400);}

// ---- 1 · Hands off: the Seine in June 1914, flying by hand, Sperry's box, the prize; the autopilot today; a box with no model ----
scene("off",(ctx,S,t,sc)=>{const c=sc.cues,P=ml_once(sc,"P",()=>({contest:wAt(sc,"date","contest"),prog:c.last-0.2,young:wAt(sc,"last","young"),cachin:wAt(sc,"last","Emil"),
    close:wAt(sc,"last","young")-0.4,pit:c.hard-0.5,g1:wAt(sc,"gust","gust"),ache:wAt(sc,"ache","arms"),slip:c.fall-0.5,slide:wAt(sc,"fall","slip"),fall:wAt(sc,"fall","fall"),
    box:c.box-0.6,four:wAt(sc,"box","four"),point:wAt(sc,"box","pointing"),moves:wAt(sc,"box","moves"),tips:wAt(sc,"feels","tips"),feels:wAt(sc,"feels","feels"),
    pist:wAt(sc,"feels","pistons"),lev:wAt(sc,"feels","level"),pass:c.hands-0.5,raise:wAt(sc,"hands","raises"),lets:wAt(sc,"hands","lets"),
    out:c.wing-0.4,climbs:wAt(sc,"wing","climbs"),dip:wAt(sc,"dips","dips"),back:wAt(sc,"dips","brings"),cheer:wAt(sc,"dips","back")+0.3,
    prize:c.prize-0.45,first:wAt(sc,"prize","first"),rest:wAt(sc,"prize","now")-0.2,letgo:wAt(sc,"prize","let"),
    deck:c.auto-0.4,only:wAt(sc,"auto","only"),watch:wAt(sc,"seats","watch"),decide:wAt(sc,"seats","decide"),
    room:c.nomodel-0.6,hands:wAt(sc,"nomodel","hands"),check:wAt(sc,"nomodel","check"),loop:wAt(sc,"nomodel","loop"),nom:wAt(sc,"nomodel","model"),
    job:wAt(sc,"nomodel","known"),put:c.agent,inside:wAt(sc,"agent","inside"),agent:wAt(sc,"agent","agent"),title:c.breath+0.2}));
  // the gusts: three, each answered by the pilot's arms a moment later; then on "ache" he straightens his back
  const gusts=[P.g1,P.g1+1.7,P.g1+3.4],roll=tt=>gusts.reduce((s,g)=>s+0.085*ml_dip(tt,g,1.5),0),turn=tt=>-gusts.reduce((s,g)=>s+0.5*ml_dip(tt,g+0.25,1.4),0);
  const gustA=tt=>gusts.reduce((s,g)=>Math.max(s,ag_io(tt,g-0.4,g+0.9,0.3)),0);
  // the box: it tips as the aeroplane does, and the piston brings it back
  const tilt=tt=>0.13*Math.sin((tt-P.point)*1.6)*ag_io(tt,P.point,P.tips-0.3,0.5)+0.12*ag_in(tt,P.tips-0.2,0.6)*(1-ag_in(tt,P.lev-0.2,1.2));
  const push=tt=>ag_in(tt,P.pist-0.2,0.6)*(1-ag_in(tt,P.lev+0.6,0.8));
  ml_shots(ctx,S,t,sc.dur,[
    // the Seine at Bezons, just outside Paris: the crowd along the bank, the grandstand across the water; the contest's card
    {at:0,place:"mlSeine",keys:[[0,960,540,1],[0.1,960,520,1.04]],d:9,push:0.01,draw:(x,tt)=>{ml_crowd(x,tt,{});
      const p=ml_pop(tt,P.contest-0.2,null);ag_textCard(x,1150,150,560,{kick:"Paris, 1914",title:"A contest for safer aeroplanes"},{k:p.k,a:p.a});}},
    // last to fly: the programme, and the flying boat coming in from the left, far off and low over the water, beyond the judges' awning
    {at:P.prog,place:"mlSeine",keys:[[P.prog,960,520,1.04],[P.prog+0.1,860,560,1.12]],d:2.6,push:0.01,draw:(x,tt)=>{
      const bx=lerp(-60,700,clamp((tt-P.prog)/5,0,1));ml_boat(x,bx,540,0.5,{t:tt,shadow:588,who:[{who:{skin:[232,198,170],top:{c:[70,62,56]},cap:[104,72,48],goggles:true}},{who:{skin:[220,182,150],top:{c:[104,100,96]},cap:[84,82,80]}}]});
      ml_crowd(x,tt,{turn:ag_in(tt,P.prog+1,1.2)*0.6});
      const p=ml_pop(tt,P.prog+0.1,null);ag_textCard(x,140,170,520,{kick:"Programme · last to fly",title:"Lawrence Sperry",sub:"with Emil Cachin"},{k:p.k,a:p.a});}},
    // closer: the two of them side by side in the cockpit, Sperry at the wheel and Cachin beside him on the right, their names
    {at:P.close,place:null,keys:[[P.close,960,540,1],[P.close+0.1,950,540,1.03]],d:4,push:0.01,draw:(x,tt)=>{
      ml_cockpit(x,tt,{mate:ML_PEOPLE.cachin,roll:0.012*Math.sin(tt*0.9),turn:0.04*Math.sin(tt*1.1)});
      const p1=ml_pop(tt,P.young,null),p2=ml_pop(tt,P.cachin,null);
      ag_textCard(x,200,236,380,{title:"Lawrence Sperry",sub:"pilot, 21"},{tail:{side:"right",at:0.6,px:700,py:372},k:p1.k,a:p1.a});
      ag_textCard(x,1380,110,340,{title:"Emil Cachin",sub:"mechanic"},{tail:{side:"bottom",at:0.3,px:1466,py:280},k:p2.k,a:p2.a});}},
    // flying by hand, closer on Sperry: each gust tips a wing, and his arms bring it back; his back aches
    {at:P.pit,place:null,keys:[[P.pit,920,540,1.06],[P.pit+0.1,890,560,1.13]],d:8,push:0.01,draw:(x,tt)=>{const ach=ag_io(tt,P.ache,P.ache+1.8,0.6);
      ml_cockpit(x,tt,{mate:ML_PEOPLE.cachin,roll:roll(tt),turn:turn(tt)+0.06*Math.sin(tt*1.3),gust:gustA(tt),lift:ach,nod:-0.03*ach});}},
    // the danger, drawn as a diagram: the aeroplane tipped, sliding sideways and down; the path fades before the water
    {at:P.slip,place:null,keys:[[P.slip,960,540,1.06],[P.slip+0.1,960,520,1.0]],d:2,push:0.01,draw:(x,tt)=>{ml_cockpit(x,tt,{mate:ML_PEOPLE.cachin,roll:0.02});ml_veil(x,0.55*ag_in(tt,P.slip,0.6));
      const a=ag_in(tt,P.slip+0.1,0.5);ag_box(x,360,170,1200,620,26,{a});ml_slip(x,360,170,1200,620,ag_in(tt,P.slide-0.2,P.fall-P.slide+0.8),{t:tt,a,roll:0.36*ag_in(tt,P.slip+0.3,1.2)});}},
    // Sperry's answer: his box, cut open, on a card; four gyroscopes spinning, their axes upright as it tips; a valve, a piston, the wing's edge
    {at:P.box,place:"mlSeine",keys:[[P.box,960,540,1.02],[P.box+0.1,960,500,1.06]],d:10,push:0.01,draw:(x,tt)=>{ml_veil(x,0.6);ag_box(x,190,150,1540,640,26,{a:ag_in(tt,P.box,0.4)});
      const b=ml_box(x,666,506,0.92,{t:tt,tilt:tilt(tt),push:push(tt),air:clamp((tt-P.feels+0.2)/1.4,0,1),plane:1,level:1,chain:1,a:ag_in(tt,P.box+0.1,0.5)});
      ag_T(x,"4 gyroscopes",666,734,{w:700,size:30,align:"center",a:ag_in(tt,P.four,0.4)});
      ag_T(x,"level",b.level[0]+150,b.level[1]+10,{w:700,size:30,col:AG.green,a:ag_in(tt,P.lev+0.4,0.4)});}},
    // over the river: the flying boat passes the grandstand, and heads in the crowd turn to follow it
    {at:P.pass,place:"mlSeine",keys:[[P.pass,860,560,1.12],[P.pass+0.1,900,560,1.16]],d:3,push:0.01,draw:(x,tt)=>{const bx=lerp(700,1060,clamp((tt-P.pass)/3,0,1));
      ml_boat(x,bx,540,0.95,{t:tt,shadow:600,who:[{who:{skin:[232,198,170],top:{c:[70,62,56]},cap:[104,72,48],goggles:true}},{who:{skin:[220,182,150],top:{c:[104,100,96]},cap:[84,82,80]}}]});
      ml_crowd(x,tt,{turn:-0.6+1.3*ag_in(tt,P.pass+0.2,2.4)});}},
    // in the cockpit, Sperry lets go of the wheel and raises his hands, open; the wheel holds still; Cachin looks up at them
    {at:P.lets-0.3,place:null,keys:[[P.lets-0.3,960,540,1],[P.lets-0.2,960,525,1.04]],d:4,push:0.01,draw:(x,tt)=>{const r=0.3*ag_in(tt,P.lets,0.5)+0.7*ag_in(tt,P.raise-0.15,0.9);
      ml_cockpit(x,tt,{mate:ML_PEOPLE.cachin,raise:r,mateGaze:[2-3*r,-0.6-0.8*r],roll:0.008*Math.sin(tt*0.8)});}},
    // from behind: Cachin climbs out along the lower wing; it dips under his weight, and the box brings it back
    {at:P.out,place:"mlSky",keys:[[P.out,960,560,1],[P.out+0.1,960,540,1.04]],d:5,push:0.01,draw:(x,tt)=>{const u=ag_sine(clamp((tt-P.climbs+0.2)/2.2,0,1)),
        r=0.15*ag_in(tt,P.dip-0.3,0.9)*(1-ag_in(tt,P.back+0.2,1.6));
      ml_boatBack(x,960,600,1.5,{roll:r,t:tt,heads:true,out:{u,spec:{coat:[104,100,96],hat:"cap",hatC:[84,82,80]}}});}},
    // the crowd cheers
    {at:P.cheer,place:"mlSeine",keys:[[P.cheer,960,560,1.1],[P.cheer+0.1,980,560,1.13]],d:3,push:0.01,draw:(x,tt)=>{ml_boat(x,1240,600,0.6,{t:tt,shadow:690,
        who:[{who:{skin:[232,198,170],top:{c:[70,62,56]},cap:[104,72,48],goggles:true}},{who:{skin:[220,182,150],top:{c:[104,100,96]},cap:[84,82,80]}}]});
      ml_crowd(x,tt,{turn:0.6,up:ag_in(tt,P.cheer,0.6),wave:0.5+0.5*Math.sin(tt*7)});}},
    // the judges' table: first prize
    {at:P.prize,place:"mlTable",keys:[[P.prize,960,560,1.08],[P.prize+0.1,1000,600,1.14]],d:4,push:0.01,draw:(x,tt)=>{const J=ML_TABLE.judges;
      ag_person(x,ML_J2,J[1][0],J[1][1],J[1][2],{t:tt,cut:ML_TABLE.top,pose:"desk",gaze:[2,1],smile:0.5});
      ag_person(x,ML_PEOPLE.judge,J[0][0],J[0][1],J[0][2],{t:tt,cut:ML_TABLE.top,pose:"hold",gaze:[2,1],smile:0.5});ml_tableFront(x);
      const p=ml_pop(tt,P.first-0.15,null);ag_textCard(x,1220,690,420,{kick:"First prize",title:"50,000 francs"},{k:p.k,a:p.a});}},
    // and now a pilot can let go, and rest: Sperry's hands leave the wheel and rest on the hull's edge
    {at:P.rest,place:null,keys:[[P.rest,960,540,1.04],[P.rest+0.1,960,520,1.08]],d:4,push:0.01,draw:(x,tt)=>{
      ml_cockpit(x,tt,{mate:ML_PEOPLE.cachin,rest:clamp((tt-P.letgo+0.2)/1.4,0,1),roll:0.01*Math.sin(tt)});}},
    // today: an airliner's flight deck, two pilots; a typical flight's timeline; one turns to a screen and points, the other nods
    {at:P.deck,dis:1.4,place:"mlDeck",keys:[[P.deck,960,560,1.02],[P.deck+0.1,960,540,1.05]],d:10,push:0.01,draw:(x,tt)=>{const D=ML_DECK,pt=ag_in(tt,P.watch-0.2,0.7);
      ag_person(x,ML_PEOPLE.officer,D.fo[0],D.fo[1],D.fo[2],{t:tt,cut:D.cut,pose:"desk",pose2:"point",mix:pt,gaze:[1+pt,0.3]});
      ag_person(x,ML_PEOPLE.captain,D.cap[0],D.cap[1],D.cap[2],{t:tt,cut:D.cut,pose:"desk",nod:0.1*ag_io(tt,P.decide-0.1,P.decide+0.8,0.3),gaze:[1,0.2]});
      ml_deckFront(x);const a=ag_in(tt,P.only-0.3,0.5);ag_box(x,240,124,1440,192,24,{a});ml_timeline(x,320,232,1280,ag_in(tt,P.only,1.6),{a,labels:ag_in(tt,P.only+1.2,0.6)});}},
    // the box again, on the marble wall: hands, a check, a loop, but no model; then a model drops in, and it's an agent
    {at:P.room,dis:0.9,place:"lab",keys:[[P.room,1124,500,1.12],[P.put-0.4,1060,520,1.0]],d:2.4,push:0.01,draw:(x,tt)=>ml_boxRoom(x,tt,P)}]);
  ml_kick(ctx,t,[[0,"1914"],[P.deck+0.6,"Today"],[P.room+0.2,null]],ag_in(t,0.6,0.6));
  ag_title(ctx,S,t,P.title,ML_TITLE,null,"WHAT AN AGENT IS · FILM 2 OF 9");});

// a second judge, younger, for the table
const ML_J2={name:"A judge",key:"ml-judge2",skin:[214,178,148],hair:{style:"side",c:[96,76,60]},beard:[110,90,72],top:{kind:"suit",c:[58,56,62],inner:[238,236,230],tie:[90,60,60]},breath:0.29};
// the box in the room, its labels one by one, the empty circle where a model would be, then the model dropping in and the agent's ring
function ml_boxRoom(x,tt,P){const [rx,ry]=ML_ROOM.ring;ag_roomLight(x,1);
  const drop=ag_in(tt,P.inside-0.3,0.9),grow=ag_in(tt,P.agent-0.6,1.4),boxA=1-ag_in(tt,P.agent-0.4,1.0),tipping=Math.sin((tt-P.check)*2.2)*ag_io(tt,P.check,P.loop-0.1,0.4);
  const s=0.55,bt=0.08*tipping,b=ml_box(x,rx,ry,s,{t:tt,tilt:bt,push:0.4*Math.max(0,tipping),hands:ag_in(tt,P.hands,0.5),check:ag_in(tt,P.check,0.4),
    checkCol:Math.abs(tipping)>0.25?AG.amber:AG.green,level:1,chain:1,empty:ag_in(tt,P.nom-0.1,0.5)*(1-drop),a:boxA});
  // the labels: hands on the piston, the check on the gyroscopes, the loop round the box
  const la=boxA;ag_label(x,b.piston[0]-40,b.piston[1]+74,"hands",{col:AG.blue,a:la*ag_in(tt,P.hands,0.4)});
  const ck=Math.abs(tipping)>0.25?AG.amber:AG.green,ca=la*ag_in(tt,P.check,0.4);ag_T(x,"a check: is it level?",rx,ry-284,{w:700,size:30,col:ck,a:ca,align:"center"});
  if(ca>0.01){x.save();x.globalAlpha*=ca;x.strokeStyle=rgba(ck,0.6);x.lineWidth=2;x.setLineDash([6,8]);x.beginPath();x.moveTo(rx,ry-266);x.lineTo(rx,b.level[1]-26);x.stroke();x.restore();}
  const R=lerp(250,180,grow),ringP=ag_sine(clamp((tt-P.loop+0.2)/1.4,0,1));
  ag_label(x,rx-266,ry+128,"a loop",{col:AG_OAK.dark,a:la*ag_in(tt,P.loop+0.4,0.4),align:"right"});
  ag_label(x,rx,ry+158,"no model",{col:AG.violet,align:"center",a:la*ag_in(tt,P.nom+0.1,0.4)*(1-drop)});
  const jb=ml_pop(tt,P.job-0.1,P.put-0.2);ag_pill(x,rx,ry+R+70,"one job: hold it level",{a:jb.a});
  // the model drops into the empty circle; then the ring closes in to the agent's, its sphere grows, and it takes Plan, Act and Check
  if(grow<=0){ag_ring(x,rx,ry,R,{p:ringP,from:-120,arrows:[-30]});
    if(drop>0){const y0=ry-560,fall=ag_eo(clamp(drop*1.25,0,1)),settle=drop>=0.8?Math.sin((drop-0.8)/0.2*Math.PI)*-10:0;
      ag_model(x,rx,lerp(y0,ry,fall)+settle,b.r,{t:tt,core:0.5});}}
  else ag_loop(x,rx,ry,{t:tt,R,r:lerp(b.r,88,grow),label:grow>0.6?"Model":null,core:lerp(0.5,1,grow),stepA:[ag_in(tt,P.agent-0.2,0.4),ag_in(tt,P.agent,0.4),ag_in(tt,P.agent+0.2,0.4)]});}
