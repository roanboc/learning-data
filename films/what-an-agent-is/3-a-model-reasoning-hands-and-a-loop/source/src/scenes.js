/* ===== A model, reasoning, hands and a loop: the nine chapters =====
   Each chapter is a few shots, in the places of past.js and the series' room, cut together with short dissolves (ml_shots). Times
   inside a chapter come from its cues (when each line starts) and the words of its lines (wAt), so the pictures stay with the voice if
   it's recorded again. Words on screen are on cards, labels and pills, at least 28 px as seen, and above the captions. */

// made once per chapter, the first time it draws: its cues are known by then
const ml_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// the shared ag_shots: a shot may dissolve in over its own time (sh.dis, seconds; 0.5 by default): the river into today takes longer;
// in one room the camera glides on from shot to shot, and between rooms a shot marked cut comes in on a cut
const ml_shots=(ctx,S,t,end,shots)=>ag_shots(ctx,S,t,end,shots);
// the bare lab, as a later moment passes through it: its light, which every shot of it draws
AG_BARE.lab=c=>ag_roomLight(c,1);
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
    {cut:true,at:P.close,place:null,room:"cockpit",keys:[[P.close,960,540,1],[P.close+0.1,950,540,1.03]],d:4,push:0.01,draw:(x,tt)=>{
      ml_cockpit(x,tt,{mate:ML_PEOPLE.cachin,roll:0.012*Math.sin(tt*0.9),turn:0.04*Math.sin(tt*1.1)});
      const p1=ml_pop(tt,P.young,null),p2=ml_pop(tt,P.cachin,null);
      ag_textCard(x,200,236,380,{title:"Lawrence Sperry",sub:"pilot, 21"},{tail:{side:"right",at:0.6,px:700,py:372},k:p1.k,a:p1.a});
      ag_textCard(x,1380,110,340,{title:"Emil Cachin",sub:"mechanic"},{tail:{side:"bottom",at:0.3,px:1466,py:280},k:p2.k,a:p2.a});}},
    // flying by hand, closer on Sperry: each gust tips a wing, and his arms bring it back; his back aches. The cockpit is one room
    // (room), so the camera glides in closer from the shot before rather than jumping
    {cut:true,at:P.pit,place:null,room:"cockpit",keys:[[P.pit,920,540,1.06],[P.pit+0.1,890,560,1.13]],d:8,push:0.01,draw:(x,tt)=>{const ach=ag_io(tt,P.ache,P.ache+1.8,0.6);
      ml_cockpit(x,tt,{mate:ML_PEOPLE.cachin,roll:roll(tt),turn:turn(tt)+0.06*Math.sin(tt*1.3),gust:gustA(tt),lift:ach,nod:-0.03*ach});}},
    // the danger, drawn as a diagram: the aeroplane tipped, sliding sideways and down; the path fades before the water
    {cut:true,at:P.slip,place:null,room:"cockpit",keys:[[P.slip,960,540,1.06],[P.slip+0.1,960,520,1.0]],d:2,push:0.01,draw:(x,tt)=>{ml_cockpit(x,tt,{mate:ML_PEOPLE.cachin,roll:0.02});ml_veil(x,0.55*ag_in(tt,P.slip,0.6));
      const a=ag_in(tt,P.slip+0.1,0.5);ag_box(x,360,170,1200,620,26,{a});ml_slip(x,360,170,1200,620,ag_in(tt,P.slide-0.2,P.fall-P.slide+0.8),{t:tt,a,roll:0.36*ag_in(tt,P.slip+0.3,1.2)});}},
    // Sperry's answer: his box, cut open, on a card; four gyroscopes spinning, their axes upright as it tips; a valve, a piston, the wing's edge
    {at:P.box,place:"mlSeine",keys:[[P.box,960,540,1.02],[P.box+0.1,960,500,1.06]],d:10,push:0.01,draw:(x,tt)=>{ml_veil(x,0.6);ag_box(x,190,150,1540,640,26,{a:ag_in(tt,P.box,0.4)});
      const b=ml_box(x,666,506,0.92,{t:tt,tilt:tilt(tt),push:push(tt),air:clamp((tt-P.feels+0.2)/1.4,0,1),plane:1,level:1,chain:1,a:ag_in(tt,P.box+0.1,0.5)});
      ag_T(x,"4 gyroscopes",666,734,{w:700,size:30,align:"center",a:ag_in(tt,P.four,0.4)});
      ag_T(x,"level",b.level[0]+150,b.level[1]+10,{w:700,size:30,col:AG.green,a:ag_in(tt,P.lev+0.4,0.4)});}},
    // over the river: the flying boat passes the grandstand, and heads in the crowd turn to follow it
    {cut:true,at:P.pass,place:"mlSeine",keys:[[P.pass,860,560,1.12],[P.pass+0.1,900,560,1.16]],d:3,push:0.01,draw:(x,tt)=>{const bx=lerp(700,1060,clamp((tt-P.pass)/3,0,1));
      ml_boat(x,bx,540,0.95,{t:tt,shadow:600,who:[{who:{skin:[232,198,170],top:{c:[70,62,56]},cap:[104,72,48],goggles:true}},{who:{skin:[220,182,150],top:{c:[104,100,96]},cap:[84,82,80]}}]});
      ml_crowd(x,tt,{turn:-0.6+1.3*ag_in(tt,P.pass+0.2,2.4)});}},
    // in the cockpit, Sperry lets go of the wheel and raises his hands, open; the wheel holds still; Cachin looks up at them
    {at:P.lets-0.3,place:null,room:"cockpit",keys:[[P.lets-0.3,960,540,1],[P.lets-0.2,960,525,1.04]],d:4,push:0.01,draw:(x,tt)=>{const r=0.3*ag_in(tt,P.lets,0.5)+0.7*ag_in(tt,P.raise-0.15,0.9);
      ml_cockpit(x,tt,{mate:ML_PEOPLE.cachin,raise:r,mateGaze:[2-3*r,-0.6-0.8*r],roll:0.008*Math.sin(tt*0.8)});}},
    // from behind: Cachin climbs out along the lower wing; it dips under his weight, and the box brings it back
    {at:P.out,place:"mlSky",keys:[[P.out,960,560,1],[P.out+0.1,960,540,1.04]],d:5,push:0.01,draw:(x,tt)=>{const u=ag_sine(clamp((tt-P.climbs+0.2)/2.2,0,1)),
        r=0.15*ag_in(tt,P.dip-0.3,0.9)*(1-ag_in(tt,P.back+0.2,1.6));
      ml_boatBack(x,960,600,1.5,{roll:r,t:tt,heads:true,out:{u,spec:{coat:[104,100,96],hat:"cap",hatC:[84,82,80]}}});}},
    // the crowd cheers
    {at:P.cheer,place:"mlSeine",keys:[[P.cheer,960,560,1.1],[P.cheer+0.1,980,560,1.13]],d:3,push:0.01,draw:(x,tt)=>{ml_boat(x,1240,600,0.6,{t:tt,shadow:690,
        who:[{who:{skin:[232,198,170],top:{c:[70,62,56]},cap:[104,72,48],goggles:true}},{who:{skin:[220,182,150],top:{c:[104,100,96]},cap:[84,82,80]}}]});
      ml_crowd(x,tt,{turn:0.6,up:ag_in(tt,P.cheer,0.6)});}},
    // the judges' table: first prize
    {at:P.prize,place:"mlTable",keys:[[P.prize,960,560,1.08],[P.prize+0.1,1000,600,1.14]],d:4,push:0.01,draw:(x,tt)=>{const J=ML_TABLE.judges;
      ag_person(x,ML_J2,J[1][0],J[1][1],J[1][2],{t:tt,cut:ML_TABLE.top,gaze:[2,1],smile:0.5});
      ag_person(x,ML_PEOPLE.judge,J[0][0],J[0][1],J[0][2],{t:tt,cut:ML_TABLE.top,gaze:[2,1],smile:0.5});ml_tableFront(x);
      const p=ml_pop(tt,P.first-0.15,null);ag_textCard(x,1220,690,420,{kick:"First prize",title:"50,000 francs"},{k:p.k,a:p.a});}},
    // and now a pilot can let go, and rest: Sperry's hands leave the wheel and rest on the hull's edge
    {at:P.rest,place:null,keys:[[P.rest,960,540,1.04],[P.rest+0.1,960,520,1.08]],d:4,push:0.01,draw:(x,tt)=>{
      ml_cockpit(x,tt,{mate:ML_PEOPLE.cachin,rest:clamp((tt-P.letgo+0.2)/1.4,0,1),roll:0.01*Math.sin(tt)});}},
    // today: an airliner's flight deck, two pilots; a typical flight's timeline; one turns to look at a screen, the other nods
    {at:P.deck,dis:1.4,place:"mlDeck",keys:[[P.deck,960,560,1.02],[P.deck+0.1,960,540,1.05]],d:10,push:0.01,draw:(x,tt)=>{const D=ML_DECK,pt=ag_in(tt,P.watch-0.2,0.7);
      ag_person(x,ML_PEOPLE.officer,D.fo[0],D.fo[1],D.fo[2],{t:tt,cut:D.cut,gaze:[1+pt,0.3]});
      ag_person(x,ML_PEOPLE.captain,D.cap[0],D.cap[1],D.cap[2],{t:tt,cut:D.cut,nod:0.1*ag_io(tt,P.decide-0.1,P.decide+0.8,0.3),gaze:[1,0.2]});
      ml_deckFront(x);const a=ag_in(tt,P.only-0.3,0.5);ag_box(x,240,124,1440,192,24,{a});ml_timeline(x,320,232,1280,ag_in(tt,P.only,1.6),{a,labels:ag_in(tt,P.only+1.2,0.6)});}},
    // the box again, on the marble wall: hands, a check, a loop, but no model; then a model drops in, and it's an agent
    {at:P.room,dis:0.9,place:"lab",keys:[[P.room,1124,500,1.12],[P.put-0.4,1060,520,1.0]],d:2.4,push:0.01,draw:(x,tt)=>ml_boxRoom(x,tt,P)}]);
  ml_kick(ctx,t,[[0,"1914"],[P.deck+0.6,"Today"],[P.room+0.2,null]],ag_in(t,0.6,0.6));
  ag_title(ctx,S,t,P.title,ML_TITLE,null,"WHAT AN AGENT IS · FILM 3 OF 10");});

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
  else{const ti=1-ag_in(tt,P.title,0.5),r=lerp(b.r,88,grow);ag_loop(x,rx,ry,{t:tt,R,r,label:null,core:lerp(0.5,1,grow),
    stepA:[ag_in(tt,P.agent-0.2,0.4)*ti,ag_in(tt,P.agent+0.3,0.4)*ti,ag_in(tt,P.agent+0.8,0.4)*ti]});
    // its name fades in as the sphere grows, and moves up into it as it passes the size where ag_model puts the name inside (80),
    // rather than jumping there in one frame
    const na=ag_in(grow,0.55,0.15)*ti,u=ag_sine(clamp((r-68)/12,0,1));
    if(na>0)ag_T(x,"Model",rx,lerp(ry+r+44,ry+r*0.6,u),{w:700,size:28,align:"center",col:AG.label,a:na});}}

/* ---------------------------------------------------------------- the room, today
   Chapters 2 to 8 share one room (the style prototype's layout, ML_ROOM): Jun at his desk on the left, the agent's ring right of
   centre, its tools down the right; the cards each chapter needs come and go between them. Things first, then the room's light,
   then cards and words. */
const ml_steps=(tt,t0,d)=>t0==null||tt<t0?-1:Math.floor((tt-t0)/d)%3;   // the lit step while the agent works round its ring

// ---- 2 · Jun's question: Planning asks; census day; the afternoon by hand; Jun gives it to an agent, and reviews and decides ----
scene("question",(ctx,S,t,sc)=>{const c=sc.cues,P=ml_once(sc,"P",()=>({asks:wAt(sc,"today","asks"),cen:c.census,counts:wAt(sc,"census","counts"),hand:c.byhand,
    find:wAt(sc,"byhand","find"),read:wAt(sc,"byhand","read"),query:wAt(sc,"byhand","query"),check:wAt(sc,"byhand","check"),fix:wAt(sc,"byhand","fix"),
    gives:wAt(sc,"gives","gives"),agent:wAt(sc,"gives","agent"),takes:wAt(sc,"gives","takes"),checks:wAt(sc,"gives","checks"),reviews:wAt(sc,"gives","reviews"),
    decides:wAt(sc,"gives","decides")}));
  ml_shots(ctx,S,t,sc.dur,[{at:0,place:"lab",keys:[[0,960,540,1],[0.1,950,530,1.03]],d:sc.dur,push:0.01,draw:(x,tt)=>ml_question(x,tt,P)}]);
  ml_kick(ctx,t,[[0,"Today"]],ag_in(t,0.2,0.6));});
function ml_question(x,tt,P){const [rx,ry]=ML_ROOM.ring,into=ag_in(tt,P.gives+0.1,1.3),ring=ag_in(tt,P.agent-0.3,1.2);
  // the agent, once Jun gives it the job: its ring draws itself, the five cards slide in, and it works round its steps
  if(ring>0){const lit=ml_steps(tt,P.takes,0.55);ag_loop(x,rx,ry,{t:tt,p:ring,core:ring,a:ring,lit:tt>=P.checks?2:lit,col:tt>=P.checks?AG.green:AG.violet,stepA:[ring,ring,ring]});}
  ml_jun(x,tt,{gaze:tt<P.gives?[2,-1.2]:[3,-0.2],nod:0.06*ag_io(tt,P.decides-0.1,P.decides+0.7,0.3)});
  ag_roomLight(x,1);
  // Planning's question, beside him; it becomes the agent's goal
  const m=ml_pop(tt,P.asks-0.1,P.gives+0.1);ag_textCard(x,452,196,600,{kick:"From Planning",title:"How has the census-day count changed since last year?",sub:"for next year's classes"},
    {tail:{side:"left",at:0.8,px:418,py:468},k:m.k,a:m.a});
  const g=ml_pop(tt,P.gives+0.3,null),[gx,gy,gw]=ML_ROOM.goal;ag_textCard(x,gx,gy,gw,{kick:"Goal",title:"Census-day count",sub:"Compare it with last year"},{tail:{side:"bottom",at:0.1,px:430,py:436},k:g.k,a:g.a});
  // census day, on its calendar card, and what it is
  const off=1-ag_in(tt,P.gives,0.6),cl=ml_pop(tt,P.cen,null);ml_cal(x,1150,184,300,"31 March","census day",{k:cl.k,a:cl.a*off});
  const la=ag_in(tt,P.counts,0.5)*off;ag_T(x,"the day the university counts",1300,394,{w:600,size:28,align:"center",col:AG.mut,a:la});ag_T(x,"who is studying",1300,430,{w:600,size:28,align:"center",col:AG.mut,a:la});
  // by hand: an afternoon, and the five small steps, round and round from fix back to query
  const ck=ml_pop(tt,P.hand,null);ml_clock(x,1580,500,lerp(1,5,clamp((tt-P.hand)/7,0,1)),"an afternoon",{w:260,k:ck.k,a:ck.a*off});
  ml_byHand(x,tt,[ag_in(tt,P.find-0.1,0.4),ag_in(tt,P.read-0.1,0.4),ag_in(tt,P.query-0.1,0.4),ag_in(tt,P.check-0.1,0.4),ag_in(tt,P.fix-0.1,0.4)],
    {x:540,y:494,loop:ag_in(tt,P.fix+0.3,0.9),into,to:[rx,ry]});
  // while he reviews and decides
  const rv=ml_pop(tt,P.reviews,null);ag_pill(x,700,760,"review · decide",{a:rv.a});}

// ---- 3 · A model writes: four parts, the first a model; it writes what's likely to come next; a guess; it can't look up or check ----
scene("writes",(ctx,S,t,sc)=>{const c=sc.cues,P=ml_once(sc,"P",()=>({four:c.four,model:wAt(sc,"four","model"),learned:c.learned,likely:wAt(sc,"learned","likely"),
    next:wAt(sc,"learned","next"),ask:c.guess,best:wAt(sc,"guess","best"),never:wAt(sc,"guess","never"),alone:c.alone,look:wAt(sc,"alone","look"),check:wAt(sc,"alone","check")}));
  ml_shots(ctx,S,t,sc.dur,[{at:0,place:"lab",keys:[[0,950,530,1.03],[0.1,980,520,1.04]],d:sc.dur,push:0.01,draw:(x,tt)=>ml_writes(x,tt,P)}]);
  ml_kick(ctx,t,[[0,"Today"]],1);
  ml_parts(ctx,[ag_in(t,P.model-0.1,0.5)],{a:ag_in(t,P.four,0.6)});});
function ml_writes(x,tt,P){const [rx,ry]=ML_ROOM.ring,pale=ag_in(tt,0.2,1.2);
  // the ring fades to a pale outline; the sphere alone, its label
  ml_pages(x,tt,rx,ry,88,ag_io(tt,P.learned,P.likely+0.6,0.6));
  ag_modelLight(x,rx,ry,88,1);ag_ring(x,rx,ry,180,{p:1,from:-120,a:lerp(1,0.22,pale)});
  for(const [s,d] of AG_LOOP.steps){const r=d*Math.PI/180;ag_step(x,rx+Math.cos(r)*180,ry+Math.sin(r)*180,s,{a:1-pale});}
  ag_model(x,rx,ry,88,{t:tt,core:1,think:ag_io(tt,P.likely,P.best+1.5,0.5),label:"Model"});
  ml_jun(x,tt,{gaze:[3,-0.4]});
  // the student records, shut behind glass, out of the sphere's reach
  const cb=ml_pop(tt,P.never-0.1,null);ml_cabinet(x,1520,560,260,230,{a:cb.a});
  ag_roomLight(x,1);
  const g=1-ag_in(tt,0.1,0.6),[gx,gy,gw]=ML_ROOM.goal;ag_textCard(x,gx,gy,gw,{kick:"Goal",title:"Census-day count",sub:"Compare it with last year"},{tail:{side:"bottom",at:0.1,px:430,py:436},a:g});
  // it writes what's likely to come next: "The university has about", three words waiting, and the first is picked
  const w1=ag_io(tt,P.likely-0.4,P.ask+0.2,0.4),k1=clamp((tt-P.likely+0.3)/1.3,0,1);
  ml_written(x,1240,196,620,"The university has about",k1,{a:w1,ka:ag_spr(tt,P.likely-0.4,0.8),cands:["18,000","20,000","15,000"],
    candA:[ag_in(tt,P.likely+1.0,0.3),ag_in(tt,P.likely+1.15,0.3),ag_in(tt,P.likely+1.3,0.3)],pick:ag_in(tt,P.likely+2.2,0.6)});
  // asked for the census-day count, the best it can write is a guess
  const q=ml_pop(tt,P.ask,null);ag_textCard(x,gx,gy,520,{title:"How many students on census day?"},{tail:{side:"bottom",at:0.1,px:430,py:436},k:q.k,a:q.a});
  const w2=ag_in(tt,P.best-0.3,0.4),ans=ml_written(x,1240,196,620,"About 18,000, probably.",clamp((tt-P.best)/1.2,0,1),{a:w2});
  // on its own it can't look anything up, or check what it wrote
  const p1=ml_pop(tt,P.look,null),p2=ml_pop(tt,P.check,null);
  ag_pill(x,1400,ans.y+ans.h+50,"looked up: nothing",{a:p1.a*w2});ag_pill(x,1712,ans.y+ans.h+50,"checked: no",{a:p2.a*w2});}

// the agent in its ring, drawn piece by piece so each can fade: o.ringA, o.stepA, o.core, o.think, o.lit (the lit step) and o.col, o.pulse
function ml_agent(x,tt,o){o=o||{};const [rx,ry]=ML_ROOM.ring,R=180,r=88,ra=o.ringA==null?1:o.ringA,sa=o.stepA==null?1:o.stepA;
  ag_modelLight(x,rx,ry,r,o.core==null?1:o.core);if(ra>0.01)ag_ring(x,rx,ry,R,{p:1,from:-120,pulse:o.pulse,a:ra});
  ag_model(x,rx,ry,r,{t:tt,core:o.core,think:o.think,label:"Model"});
  return AG_LOOP.steps.map(([s,d],i)=>{const q=d*Math.PI/180;return ag_step(x,rx+Math.cos(q)*R,ry+Math.sin(q)*R,s,{on:o.lit===i?(o.col||AG.violet):null,a:sa});});}
// a pellet riding along the ring from degrees d0 to d1, then into the sphere (u 0 to 1)
function ml_ride(x,u,d0,d1){if(u<=0||u>=1)return;const [rx,ry]=ML_ROOM.ring;let px,py;
  if(u<0.7){const d=lerp(d0,d1,u/0.7)*Math.PI/180;px=rx+Math.cos(d)*180;py=ry+Math.sin(d)*180;}
  else{const d=d1*Math.PI/180,v=(u-0.7)/0.3;px=lerp(rx+Math.cos(d)*180,rx,v);py=lerp(ry+Math.sin(d)*180,ry,v);}
  ag_pellet(x,px,py,1-sstep(0.9,1,u));}
// a card's flight out of the sphere (u 0 to 1) along a curve from (x0, y0) by (x1, y1) to (x2, y2): where its middle is, and its size,
// full by halfway, so its words can come while it's still on its way
function ml_fly(u,x0,y0,x1,y1,x2,y2){const e=ag_eo(u),q=(a0,a1,a2)=>(1-e)*(1-e)*a0+2*(1-e)*e*a1+e*e*a2;return{x:q(x0,x1,x2),y:q(y0,y1,y2),s:lerp(0.3,1,ag_eo(clamp(u/0.55,0,1)))};}
// the parts row: those already met stay lit, softer
const ml_partsOn=(t,i,ti)=>[0,1,2,3].map(k=>k<i?0.45:k===i?ag_in(t,ti-0.1,0.5):0);

// ---- 4 · Reasoning: a plan, checked against the team's rules; each result read as feedback ----
scene("reasons",(ctx,S,t,sc)=>{const c=sc.cues,P=ml_once(sc,"P",()=>({reason:wAt(sc,"second","reasoning"),plan:c.plan,writes:wAt(sc,"plan","writes"),
    find:wAt(sc,"plan","find"),count:wAt(sc,"plan","count"),report:c.report,check3:wAt(sc,"report","check"),census:wAt(sc,"report","census"),
    rules:c.rules,tools:wAt(sc,"rules","tools"),reading:wAt(sc,"rules","reading"),evidence:wAt(sc,"rules","evidence"),
    result:c.result,feedback:wAt(sc,"result","feedback"),changes:wAt(sc,"result","changes"),is:c.is,fb2:wAt(sc,"is","feedback"),cks:wAt(sc,"is","checks")}));
  ml_shots(ctx,S,t,sc.dur,[{at:0,place:"lab",keys:[[0,980,520,1.04],[0.1,990,520,1.05]],d:sc.dur,push:0.01,draw:(x,tt)=>ml_reasons(x,tt,P)}]);
  ml_kick(ctx,t,[[0,"Today"]],1);ml_parts(ctx,ml_partsOn(t,1,P.reason));});
function ml_reasons(x,tt,P){const back=ag_in(tt,0.2,1.2),fb=[P.feedback,P.feedback+1.6],ride=fb.reduce((m,f)=>Math.max(m,ag_io(tt,f-0.2,f+1.5,0.3)),0);
  ml_agent(x,tt,{ringA:lerp(0.22,1,back),stepA:back,core:1+0.4*ride,think:ag_io(tt,P.writes,P.check3+2,0.5)+ag_io(tt,P.evidence+0.6,P.evidence+2.4,0.4)});
  for(const f of fb)ml_ride(x,clamp((tt-f)/1.3,0,1),0,120);
  ml_jun(x,tt,{gaze:[3,-0.6]});
  ag_roomLight(x,1);
  // the plan, written out line by line; the sphere's light runs down it, and each line meets the rules
  const ka=ag_spr(tt,P.writes-0.2,0.8),tk=i=>ag_in(tt,P.evidence+0.8+i*0.35,0.3);
  const pl=ml_plan(x,1350,150,500,["1 Find the tables","2 Count the students","3 Check the total against the census report"],{a:ag_in(tt,P.writes-0.2,0.4),ka,
    k:[clamp((tt-P.find)/0.8,0,1),clamp((tt-P.count)/0.8,0,1),clamp((tt-P.check3)/1.4,0,1)],tick:[tk(0),tk(1),tk(2)]});
  const sw=ag_io(tt,P.evidence+0.6,P.evidence+2.0,0.2),sy=lerp(pl.y+70,pl.y+pl.h-20,clamp((tt-P.evidence-0.6)/1.3,0,1));
  if(sw>0.01){x.save();x.globalAlpha*=sw;const g=x.createLinearGradient(pl.x,sy,pl.x+pl.w,sy);g.addColorStop(0,rgba(AG.violet,0));g.addColorStop(0.5,rgba(AG.violet,0.5));g.addColorStop(1,rgba(AG.violet,0));
    x.fillStyle=g;x.fillRect(pl.x+10,sy-3,pl.w-20,6);x.restore();}
  // the census report, the university's official count
  const cr=ml_pop(tt,P.census-0.1,null);ag_textCard(x,500,560,410,{kick:"Census report",title:"31 March 2026",sub:"the university's official count"},{k:cr.k,a:cr.a});
  // the rules Jun's team gave it, from his side
  const rl=ag_spr(tt,P.rules-0.1,0.8);ml_rules(x,452,214,470,{a:ag_in(tt,P.rules-0.1,0.4),ka:rl,tail:{side:"bottom",at:0.08,px:430,py:430},
    k:[ag_in(tt,P.tools-0.4,0.4),ag_in(tt,P.reading-0.2,0.4),ag_in(tt,P.evidence-0.2,0.4)]});
  // reasoning is feedback, and checks against rules
  ag_label(x,1290,650,"feedback",{col:AG.orange,a:ag_in(tt,P.fb2,0.4)});
  ag_label(x,pl.x+pl.w/2,pl.y+pl.h+50,"checks against rules",{col:AG.green,align:"center",a:ag_in(tt,P.cks,0.4)});}

// ---- 5 · Hands: tools, each from a tool server, plugged in through an open standard; these three can only read ----
scene("hands",(ctx,S,t,sc)=>{const c=sc.cues,P=ml_once(sc,"P",()=>({hands:wAt(sc,"third","hands"),open:wAt(sc,"third","open"),tools:wAt(sc,"third","tools"),three:c.three,
    catalog:wAt(sc,"three","Catalog"),query:wAt(sc,"three","Query"),docs:wAt(sc,"three","Docs"),server:c.server,tsrv:wAt(sc,"server","server"),
    std:wAt(sc,"mcp","standard"),proto:wAt(sc,"mcp","Protocol"),any:wAt(sc,"mcp","any"),use:wAt(sc,"mcp","use"),read:c.read,only:wAt(sc,"read","only"),
    account:wAt(sc,"read","account"),row:wAt(sc,"read","row")}));
  ml_shots(ctx,S,t,sc.dur,[{at:0,place:"lab",keys:[[0,990,520,1.05],[0.1,1000,520,1.04]],d:sc.dur,push:0.01,draw:(x,tt)=>ml_hands(x,tt,P)}]);
  ml_kick(ctx,t,[[0,"Today"]],1);ml_parts(ctx,ml_partsOn(t,2,P.hands));});
function ml_hands(x,tt,P){const [rx,ry]=ML_ROOM.ring,arr=[P.catalog,P.query,P.docs],plug=ag_in(tt,P.std-0.2,0.5),lock=ag_io(tt,P.only-0.1,P.account+1.2,0.4);
  ml_agent(x,tt,{core:1,lit:tt>P.tools-0.3&&tt<P.docs+1.5?1:null,col:AG.blue});ml_jun(x,tt,{gaze:[3,-0.5]});
  // a model can't open a table: the sphere's light touches a closed card, and nothing opens
  const tb=ag_io(tt,P.open-0.6,P.tools+0.3,0.3),sh=Math.sin((tt-P.open)*30)*6*ag_io(tt,P.open,P.open+0.5,0.1);
  if(tb>0.01){const bx=1440+sh;x.save();x.globalAlpha*=tb;x.strokeStyle=rgba(AG.violet,0.5*ag_in(tt,P.open-0.3,0.3));x.lineWidth=4;x.setLineDash([8,10]);
      x.beginPath();x.moveTo(rx+96,ry);x.lineTo(bx-6,ry);x.stroke();x.setLineDash([]);
    ag_box(x,bx,ry-56,220,112,20,{});ag_T(x,"Students",bx+28,ry-6,{w:700,size:32});ag_lock(x,bx+40,ry+26,28,rgba(AG.blue,1));ag_T(x,"a table",bx+64,ry+34,{w:600,size:28,col:AG.mut});x.restore();}
  // but tools can: three arms unfold from Act, and the three tools come in from the right, each from its server
  ML_ROOM.tools.forEach((tl,i)=>{const t0=arr[i],dx=lerp(420,0,ag_eo(ag_in(tt,t0-0.5,0.8))),ta=ag_in(tt,t0-0.5,0.5);
    const u=0.6*ag_sine(ag_in(tt,P.tools-0.1,1.0))+0.4*ag_sine(ag_in(tt,t0+0.1,0.6));
    ml_tool(x,i,{dx,a:ta,touch:u>0.95?1:0,lock,server:ag_in(tt,P.tsrv-0.2+i*0.25,0.5),plug});
    ag_reach(x,ml_arm(i),u,{grip:u>0.95?1:0});if(plug>0.01&&u>0.95){const e=ml_arm(i);ml_plug(x,e[6]-6,e[7],0,1,"#3E3F45",plug);}});
  ag_T(x,"tool server",ML_ROOM.tx+ML_ROOM.tw-76,ML_ROOM.tools[0][1]-50,{w:600,size:28,col:AG.mut,align:"right",a:ag_io(tt,P.tsrv,P.std+0.6,0.4)});
  // any agent that follows the standard can use them: a second sphere, grey, plugs into Catalog's server from above, and leaves
  const g2=ag_io(tt,P.any-0.4,P.use+1.4,0.7),gy=lerp(-120,96,ag_eo(ag_in(tt,P.any-0.4,0.9)))-lerp(0,260,ag_in(tt,P.use+0.9,0.8)),gx=ML_ROOM.tx+ML_ROOM.tw-5;
  if(g2>0.01){x.save();x.globalAlpha*=g2;x.strokeStyle="#8C8A86";x.lineWidth=9;x.lineCap="round";x.beginPath();x.moveTo(gx,gy+40);x.lineTo(gx,gy+70);x.stroke();
    ml_plug(x,gx,gy+82,Math.PI/2,1,"#3E3F45",1);ag_soft(x,c=>c.arc(gx,gy,42,0,TAU),[176,176,178],[236,236,238],gx+14,gy-16,56,"rgba(46,38,28,0.3)",10,0.8);
    x.fillStyle=rgba([120,120,124],0.9);x.beginPath();ag_rect(x,gx-26,gy-8,52,14,7);x.fill();x.restore();}
  ag_roomLight(x,1);
  // the open standard, under the ring; then what their account can do
  const mp=ag_io(tt,P.proto-0.3,P.read,0.4);ag_T(x,"Model Context Protocol",rx,742,{w:700,size:30,align:"center",a:mp});ag_T(x,"an open standard",rx,780,{w:500,size:28,align:"center",col:AG.mut,a:mp});
  ag_pill(x,rx,766,"Account: read only · can't change a row",{a:ag_in(tt,P.account-0.1,0.4),col:AG.blue,icon:"lock"});}

// ---- 6 · A loop: plan, act, check, round again; round one falls short of the census report; the model reads the rule; round two matches ----
scene("loop",(ctx,S,t,sc)=>{const c=sc.cues,P=ml_once(sc,"P",()=>({loopW:wAt(sc,"fourth","loop"),planW:wAt(sc,"fourth","plan"),act:wAt(sc,"fourth","act"),
    checkW:wAt(sc,"fourth","check"),round:wAt(sc,"fourth","round"),goal:wAt(sc,"fourth","goal"),counts:c.counts,catalog:wAt(sc,"counts","Catalog"),query:wAt(sc,"counts","Query"),
    short:c.short,chk:wAt(sc,"short","check"),n476:wAt(sc,"short","476"),today:c.today,asare:wAt(sc,"today","count"),rule:c.rule,docs:wAt(sc,"rule","Docs"),
    stood:wAt(sc,"rule","stood"),again:c.again,date:wAt(sc,"again","date"),gives:wAt(sc,"again","gives"),passes:c.passes,matches:wAt(sc,"passes","matches"),
    pass:wAt(sc,"passes","passes"),unlike:c.unlike,push:wAt(sc,"unlike","push"),decides:wAt(sc,"unlike","decides"),stops:c.stops,cks:wAt(sc,"stops","checks"),
    limit:wAt(sc,"stops","limit"),person:wAt(sc,"stops","person")}));
  ml_shots(ctx,S,t,sc.dur,[{at:0,place:"lab",keys:[[0,1000,520,1.04],[0.1,990,530,1.03]],d:sc.dur,push:0.01,draw:(x,tt)=>ml_loopRoom(x,tt,P)}]);
  ml_kick(ctx,t,[[0,"Today"]],1);ml_parts(ctx,ml_partsOn(t,3,P.loopW));});
function ml_loopRoom(x,tt,P){const [rx,ry]=ML_ROOM.ring;
  // where the agent is in its loop: once round, Plan, Act, Check and back, then each round's steps
  const keys=[[P.planW,-120],[P.act,0],[P.checkW,120],[P.round+0.4,240],[P.catalog-0.3,360],[P.chk,480],[P.rule-0.3,600],[P.again-0.2,720],[P.matches-0.3,840]];
  // the light arrives at each key's step at the key's time, moving there over the 1.2 s before (less when the keys are closer)
  let deg=-120,pa=0;for(let i=0;i<keys.length;i++){if(tt<keys[i][0])break;const nx=keys[i+1],d=nx?Math.min(1.2,nx[0]-keys[i][0]):1,u=nx?ag_sine(clamp((tt-nx[0]+d)/d,0,1)):1;
    deg=nx?lerp(keys[i][1],nx[1],u):keys[i][1];pa=1;}
  pa*=1-ag_in(tt,P.unlike-0.4,0.6)+ag_in(tt,P.stops,0.6)*0;
  const step=((Math.round((deg+120)/120)%3)+3)%3,lit=tt<P.planW||tt>P.unlike-0.4?(tt>P.pass?2:null):step,okC=tt>P.pass;
  ml_agent(x,tt,{core:1,think:ag_io(tt,P.today,P.rule+1,0.5)+ag_io(tt,P.unlike,P.decides+1.2,0.5),lit,col:okC&&lit===2?AG.green:lit===2&&tt>P.chk-0.3?AG.amber:AG.amber,pulse:{deg,a:pa}});
  // the arms rest on the tools; one takes hold as the agent uses its tool, and orange pellets ride back
  const use=[[P.catalog-0.3],[P.query-0.3,P.again+0.2],[P.docs-0.3]];
  ML_ROOM.tools.forEach((tl,i)=>{let on=0,d=0;for(const u0 of use[i]){on=Math.max(on,ag_io(tt,u0,u0+2.2,0.3));const v=clamp((tt-u0-0.4)/1.4,0,1);if(v>0&&v<1)d=v;}
    ml_tool(x,i,{touch:on,server:1,plug:1});ag_reach(x,ml_arm(i),1,{grip:1,data:d});const e=ml_arm(i);ml_plug(x,e[6]-6,e[7],0,1,"#3E3F45",1);});
  ml_jun(x,tt,{gaze:tt>P.person-0.3?[3,-1.4]:[3,-0.5],nod:0.06*ag_io(tt,P.person,P.person+0.8,0.3)});
  ag_roomLight(x,1);
  // the goal, above Jun: it glows on "until the goal is met"
  const [gx,gy,gw]=ML_ROOM.goal,gg=ag_io(tt,P.goal-0.1,P.goal+1.6,0.4);
  ag_textCard(x,gx,gy,gw,{kick:"Goal",title:"Census-day count",sub:"Compare it with last year"},{tail:{side:"bottom",at:0.1,px:430,py:436},edge:gg>0.05?AG.amber:null,a:ag_in(tt,0,0.6)});
  if(gg>0.01){x.save();x.globalAlpha*=gg*0.5;x.shadowColor=rgba(AG.amber,0.9);x.shadowBlur=30;x.strokeStyle=rgba(AG.amber,0.8);x.lineWidth=3;x.beginPath();ag_rect(x,gx,gy,gw,136,22);x.stroke();x.restore();}
  // slot A, what the agent is looking at: the students' table, the census report, the census rule, the census report again
  const off=1-ag_in(tt,P.unlike-0.4,0.6),A=(t0,t1)=>ml_pop(tt,t0,t1);
  let a=A(P.catalog+0.7,P.short-0.2);ag_textCard(x,480,388,450,{kick:"Catalog · a table",title:"Students",sub:"one row for each version of a record, with the dates it was true"},{k:a.k,a:a.a*off,kickCol:AG.blue});
  a=A(P.short,P.rule-0.2);ml_query(x,480,388,450,"Census report","31 March 2026 · students studying","18,412",{col:AG.ink,kickCol:AG.mut,ka:a.k,a:a.a*off});
  a=A(P.stood-0.8,P.passes-0.2);ag_textCard(x,480,388,450,{kick:"Docs · census day",title:"Count each student as their record stood that day"},{k:a.k,a:a.a*off,kickCol:AG.blue});
  a=A(P.passes,null);ml_query(x,480,388,450,"Census report","31 March 2026 · students studying","18,412",{col:AG.ink,kickCol:AG.mut,ka:a.k,a:a.a*off});
  // slot B, the query and what comes back
  a=A(P.query+0.3,P.again-0.2);ml_query(x,480,630,450,"Query 1","Count students who are studying","17,936",{numA:ag_in(tt,P.query+1.6,0.4),note:"476 short",noteA:ag_in(tt,P.n476,0.4),ka:a.k,a:a.a*off});
  a=A(P.again+0.1,null);ml_query(x,480,630,450,"Query 2","Count students who were studying on 31 March 2026","18,412",{numA:ag_in(tt,P.gives+0.4,0.4),col:tt>P.matches?AG.green:AG.orange,
    note:"= census report",noteA:0,ka:a.k,a:a.a*off});
  if(tt>P.matches-0.2){const eq=ag_in(tt,P.matches-0.2,0.4)*off;ag_T(x,"= 18,412",900,836,{w:700,size:30,col:AG.green,align:"right",a:eq});}
  // slot C, its thinking: did it count them as they are today? then a fourth line in its plan
  const th=ag_io(tt,P.asare-0.6,P.rule-0.1,0.4);ml_thought(x,900,150,"Counted as they are today?",th,{k:ag_spr(tt,P.asare-0.6,0.8),px:rx-60,py:ry-80});
  const pl=ag_io(tt,P.rule-0.2,P.again+0.4,0.4);ml_plan(x,900,112,560,["4 Read the census rule (Docs)"],{a:pl,ka:ag_spr(tt,P.rule-0.2,0.8),fresh:[1],k:[clamp((tt-P.rule)/1.0,0,1)]});
  // the check: amber while it doesn't match, green when it does
  const vA=ag_in(tt,P.chk+0.2,0.4);if(tt<P.matches)ag_verdict(x,rx,724,"Doesn't match yet","loop",vA);else ag_verdict(x,rx,724,"Matches the source","pass",1);
  // unlike Sperry's box, which can only push back: the model decides what to try next
  const un=ag_io(tt,P.unlike-0.2,P.stops-0.2,0.5);if(un>0.01){x.save();x.globalAlpha*=un;ag_box(x,480,380,440,330,24,{});
    ml_box(x,700,520,0.36,{t:tt,tilt:0.1*Math.sin(tt*2),push:0.5+0.5*Math.sin(tt*2),level:1,chain:1});
    ag_T(x,"Sperry's box",700,428,{w:700,size:30,align:"center"});ag_T(x,"push back",700,668,{w:700,size:30,align:"center",col:AG.amber});x.restore();}
  const nx=[["read Docs",rx-150,206],["ask Jun",rx+60,206],["query again",rx+270,206]],pick=ag_in(tt,P.decides,0.4);
  nx.forEach(([s,px,py],i)=>{const a2=ag_io(tt,P.unlike+0.6+i*0.15,P.stops-0.2,0.4);if(a2<=0.01)return;ag_pill(x,px,py,s,{a:a2*(i===0?lerp(0.55,1,pick):lerp(0.55,0.35,pick)),col:i===0&&pick>0.5?AG.violet:null});});
  // the loop stops: when the checks pass, at its limit of tries, or when it needs a person
  const st=[["checks pass",rx-300,P.cks],["limit: 10 rounds",rx,P.limit],["a person: ask Jun",rx+330,P.person]];
  st.forEach(([s,px,t0],i)=>{const a2=ag_in(tt,t0-0.1,0.4);if(a2>0.01)ag_pill(x,px,806,s,{a:a2,col:i===0?AG.green:null});});}

// ---- 7 · The answer, with its evidence: the agent brings it to Jun and draws back; the evidence fans out; Jun reads it, signs, and it goes to Planning ----
scene("answer",(ctx,S,t,sc)=>{const c=sc.cues,P=ml_once(sc,"P",()=>({brings:wAt(sc,"brings","brings"),evid:wAt(sc,"evid","evidence"),tables:wAt(sc,"evid","tables"),
    rule:wAt(sc,"evid","rule"),both:wAt(sc,"evid","both"),check:wAt(sc,"evid","check"),cev:wAt(sc,"decides","evidence"),appr:wAt(sc,"decides","approval"),
    reads:wAt(sc,"decides","reads"),decides:wAt(sc,"decides","decides"),planning:wAt(sc,"decides","Planning")}));
  ml_shots(ctx,S,t,sc.dur,[{at:0,place:"lab",keys:[[0,990,530,1.03],[0.1,980,530,1.02]],d:sc.dur,push:0.01,draw:(x,tt)=>ml_answerRoom(x,tt,P)}]);
  ml_kick(ctx,t,[[0,"Today"]],1);ml_parts(ctx,[0.45,0.45,0.45,1],{a:1-ag_in(t,0.3,0.8)});});
function ml_answerRoom(x,tt,P){const [rx,ry]=ML_ROOM.ring,A=ML_ANS,R=ML_REST,W=A.w,EP=ml_evPlaces(x),h=EP.card.h;
  // the agent lets go of its tools, which slide away to the right; its steps go quiet, and it draws back, smaller, to the top right
  const hold=1-ag_sine(ag_in(tt,P.brings-0.2,0.8)),away=ag_eo(ag_in(tt,P.brings+0.4,1.0)),sa=1-ag_in(tt,P.brings+0.9,0.4),mv=ag_sine(ag_in(tt,P.brings+1.3,1.6));
  ml_small(x,tt,lerp(rx,R[0],mv),lerp(ry,R[1],mv),lerp(180,R[2],mv),lerp(88,R[3],mv),{stepA:sa,label:sa,core:1,lit:tt<P.brings-0.2?2:null,col:AG.green});
  if(away<1)ML_ROOM.tools.forEach((tl,i)=>{ml_tool(x,i,{dx:560*away,a:1-away,server:1,plug:1});ag_reach(x,ml_arm(i),hold,{grip:hold>0.95?1:0});
    const e=ml_arm(i);ml_plug(x,e[6]-6,e[7],0,1,"#3E3F45",clamp((hold-0.85)/0.15,0,1)*(1-away));});
  // Jun watches it come, reads the evidence as it fans out, then again from the top; nods, signs, and watches it go
  const gy=ml_pw(tt,[[0,-0.5],[P.brings+0.6,-0.5],[P.brings+1.4,-0.35],[P.tables-0.2,-0.35],[P.tables+0.3,-0.75],[P.rule+0.3,-0.4],[P.both+0.5,0.1],[P.check+0.4,0.55],
    [P.cev,0.55],[P.cev+0.4,-0.35],[P.appr+0.3,0.3],[P.reads-0.2,-0.75],[P.decides-0.1,0.5],[P.decides+0.2,0.3],[P.planning+0.2,0.3],[P.planning+0.8,-1.2]]);
  ml_jun(x,tt,{gaze:[3,gy],nod:0.07*ag_io(tt,P.decides-0.3,P.decides+0.5,0.3),smile:0.25*ag_in(tt,P.decides+0.4,0.8)});
  ag_roomLight(x,1);
  // the goal, met: it goes as the answer comes to rest where it was
  const [gx,gy0,gw]=ML_ROOM.goal,ga=1-ag_in(tt,P.brings+0.7,0.5);
  if(ga>0.01)ag_textCard(x,gx,gy0,gw,{kick:"Goal",title:"Census-day count",sub:"Compare it with last year"},{tail:{side:"bottom",at:0.1,px:430,py:436},a:ga});
  // the answer leaves the sphere as a small blank card and flies to Jun, full size halfway; its words come while it's still on its way
  const fl=clamp((tt-P.brings)/1.3,0,1),F=ml_fly(fl,rx,ry,880,250,A.x+W/2,A.y+h/2),wa=ag_in(tt,P.brings+0.7,0.3),ox=F.x-(A.x+W/2),oy=F.y-(A.y+h/2);
  if(fl>0&&wa<1){x.save();x.translate(F.x,F.y);x.scale(F.s,F.s);ag_box(x,-W/2,-h/2,W,h,22,{a:(1-wa)*ag_in(tt,P.brings,0.2)});x.restore();}
  // it goes up to Planning once Jun has signed: the answer, its check and his name; the evidence stays with him
  const lu=clamp((tt-P.planning-0.2)/1.1,0,1),dy=-820*lu*lu,la=1-sstep(0.6,1,lu);
  // the evidence fans out, each piece as it's named: the tables, the rule, both queries, the check
  const op=ml_pw(tt,[[P.tables-0.25,0],[P.rule-0.25,0.161],[P.both-0.25,0.321],[P.both+0.1,0.482],[P.check-0.25,0.643],[P.check+0.75,1]]);
  if(op<1){x.save();x.translate(ox,oy);ag_evidence(x,A.x,A.y,W,ML_ANSW,ML_EV,{side:"right",ew:A.ew,gap:A.gap,open:op,a:wa});x.restore();}
  else{if(la>0.01)ag_evidence(x,A.x,A.y+dy,W,ML_ANSW,[],{side:"right",ew:A.ew,gap:A.gap,a:wa*la});EP.items.forEach((e,i)=>ml_evItem(x,e,ML_EV[i]));}
  // the check comes with it, under the answer: evidence, not approval
  const vm=ag_sine(ag_in(tt,P.brings+1.0,1.0)),gl=ag_io(tt,P.cev-0.2,P.cev+0.9,0.3);if(la>0.01){x.save();if(gl>0.01){x.shadowColor=rgba(AG.green,0.8*gl);x.shadowBlur=26*gl;}
    ag_verdict(x,lerp(rx,A.x+W/2,vm),lerp(724,A.y+h+46,vm)+dy,"Matches the source","pass",la);x.restore();}
  // "Approved by:", with nothing after it, until Jun signs
  const ap=ml_pop(tt,P.appr-0.1,null);ml_approve(x,A.x,A.y+h+92+dy,W,"Jun",clamp((tt-P.decides-0.05)/0.7,0,1),{k:ap.k,a:ap.a*la});
  const tp=ag_in(tt,P.planning-0.15,0.35);ag_pill(x,A.x+W/2,A.y-44+dy,"To Planning",{a:tp*la});}

// ---- 8 · A plain script: next March the steps are known; the evidence becomes a recipe with a test, and Noor approves it; it runs in seconds
//      every census day, like Sperry's box; the agent took four minutes; once, the long way; plain scripts for known steps, agents for the rest ----
scene("script",(ctx,S,t,sc)=>{const c=sc.cues,P=ml_once(sc,"P",()=>({March:wAt(sc,"march","March"),steps:wAt(sc,"march","steps"),
    project:wAt(sc,"recipe","project"),test:wAt(sc,"recipe","test"),noor:wAt(sc,"recipe","Noor"),approves:wAt(sc,"recipe","approves"),
    runs:c.runs,rIn:wAt(sc,"runs","runs"),like:wAt(sc,"runs","like"),
    took:c.took,four:wAt(sc,"took","four"),plain:wAt(sc,"took","plain"),needs:wAt(sc,"took","needs"),
    web:c.web,searched:wAt(sc,"web","searched"),webW:wAt(sc,"web","web"),docs:wAt(sc,"docs","Docs"),plan:wAt(sc,"docs","plan"),
    names:c.names,namesW:wAt(sc,"names","names"),gives:wAt(sc,"names","gives"),only:wAt(sc,"names","only"),
    known:c.known,plainS:wAt(sc,"known","plain"),keep:c.keep,agents:wAt(sc,"keep","agents")}));
  ml_shots(ctx,S,t,sc.dur,[
    // Jun's room: next March's calendar; the evidence lines up into a recipe, with its test; Noor approves it; it runs each census day; the agent rests
    {at:0,place:"lab",keys:[[0,980,530,1.02],[0.1,990,530,1.03]],d:P.web,push:0.01,draw:(x,tt)=>ml_recipeRoom(x,tt,P)},
    // once: an agent whose plan named no tools took the long way, out to the web, though Docs had the rules; now each plan names them.
    // Another time in the lab (later:true): today's room leaves before that day's comes in (dissolved one into the other, the agent showed
    // in two places, and the plan's words over the recipe's)
    {later:true,at:P.web-0.4,dis:0.7,place:"lab",keys:[[P.web-0.4,1000,520,1.04],[P.web-0.3,990,520,1.02]],d:8,push:0.01,draw:(x,tt)=>ml_longWay(x,tt,P)},
    // two columns on the wall: a plain script for the steps that are known, an agent for the steps nobody can write in advance
    {cut:true,at:P.known-0.4,dis:0.7,place:"lab",keys:[[P.known-0.4,960,520,1.02],[P.known-0.3,960,530,1.0]],d:6,push:0.01,draw:(x,tt)=>ml_twoCols(x,tt,{
      aL:ag_in(tt,P.known-0.3,0.6),rm:ag_sine(ag_in(tt,P.plainS-0.7,0.9)),rl:ag_in(tt,P.plainS,0.4),aR:ag_in(tt,P.keep-0.4,0.6),am:ag_sine(ag_in(tt,P.agents-0.3,1.1)),
      al:ag_in(tt,P.agents+0.6,0.4)})}]);
  ml_kick(ctx,t,[[0,"Today"],[P.web-0.2,"Once"],[P.names-0.1,"Today"]],1);});
function ml_recipeRoom(x,tt,P){const R=ML_REST,EP=ml_evPlaces(x),RC={x:860,y:232,w:560},RB=ml_recipe(x,RC.x,RC.y,RC.w,{a:0,foot:"x"}),
    YR=[["2027",680],["2028",1000],["2029",1320]],runAt=[P.rIn,P.rIn+1.6,P.rIn+3.2];
  // the agent, resting small at the top right; "four minutes and twelve steps"; and as a plain rerun needs no agent, its band dims
  const dim=ag_in(tt,P.needs-0.1,0.9);ml_small(x,tt,R[0],R[1],R[2],R[3],{stepA:0,core:lerp(1,0.12,dim)});
  ml_jun(x,tt,{gaze:[3,ml_pw(tt,[[0,0.2],[P.March-0.4,0.2],[P.March,-0.45],[P.steps,-0.45],[P.steps+0.6,-0.3],[P.noor,-0.3],[P.noor+0.4,0.3],
    [P.runs,0.3],[P.runs+0.5,0.35],[P.four-0.2,0.35],[P.four+0.3,-0.9]])],nod:0.05*ag_io(tt,P.approves,P.approves+0.7,0.3)});
  ag_roomLight(x,1);
  // each census day the recipe runs: a light from it down to that year's card
  const fold=ag_in(tt,P.runs-0.3,0.9),yA=1-ag_in(tt,P.plain-0.3,0.6),rb=RC.y+136+44;
  for(let i=0;i<3;i++){const a=ag_in(tt,runAt[i]-0.3,0.4)*yA;if(a<=0.01)continue;const cx=YR[i][1]+140,p=[RC.x+RC.w/2,rb+4,RC.x+RC.w/2,rb+40,cx,440,cx,474];
    x.save();x.globalAlpha*=a;x.strokeStyle=rgba(AG.blue,0.5);x.lineWidth=3;x.setLineDash([6,8]);ag_bzPath(x,p,0,1);x.stroke();x.setLineDash([]);
    const u=clamp((tt-runAt[i]+0.2)/0.6,0,1);if(u>0&&u<1){const q=ag_bz(p,ag_sine(u));x.shadowColor=rgba(AG.blue,0.7);x.shadowBlur=14;x.fillStyle=rgba(AG.blue,1);x.beginPath();x.arc(q[0],q[1],8,0,TAU);x.fill();}
    x.restore();}
  // the recipe: it comes as the steps are known; the steps that worked fly into it and become its lines, the test in green; saved in the project
  const rc=ml_pop(tt,P.steps-0.35,null),dest=[0,1,null,2,3],arr=i=>P.steps+0.2+i*0.15;
  ml_recipe(x,RC.x,RC.y,RC.w,{ka:rc.k,a:rc.a,k:[0,1,3,4].map(i=>ag_in(tt,arr(i)+0.6,0.4)),tick:ag_in(tt,P.test,0.4),fold,foot:"Saved in the project",footA:ag_in(tt,P.project-0.1,0.4)});
  // the evidence from the answer: the first query, which fell short, is left out
  EP.items.forEach((e,i)=>{const d=dest[i];if(d==null){const u=ag_in(tt,P.steps,0.7);ml_evItem(x,e,ML_EV[i],{a:1-u,dy:30*u});return;}
    const u=clamp((tt-arr(i))/0.9,0,1),v=ag_sine(u);ml_evItem(x,e,ML_EV[i],{dx:(RC.x+12-e.x)*v,dy:(RB.ly(d)-56-e.y)*v,a:1-sstep(0.55,1,u)});});
  // Noor's review: she approves it
  const rv=ml_pop(tt,P.noor-0.25,P.runs-0.3),ry=RC.y+RB.h+36;ag_textCard(x,RC.x,ry,RC.w,{kick:"Review",title:"Noor",sub:"data architect"},{k:rv.k,a:rv.a,kickCol:AG.mut});
  const ok=ag_in(tt,P.approves,0.4)*rv.a;if(ok>0.01)ag_pill(x,RC.x+RC.w-150,ry+88,"approved",{a:ok,col:AG.green,icon:"tick"});
  // next March: a calendar where the answer was, rolling from 2026 to 2027; it becomes the first census day the recipe runs on, then 2028, 2029
  const cm=ag_sine(ag_in(tt,P.runs-0.3,0.9)),cl=ml_pop(tt,P.March-0.3,null);
  ml_cal(x,lerp(452,YR[0][1],cm),lerp(232,480,cm),280,"31 March","2027",{from:"2026",roll:clamp((tt-P.March-0.2)/0.7,0,1),k:cl.k,a:cl.a*yA,tick:ag_in(tt,runAt[0]+0.4,0.4)});
  for(let i=1;i<3;i++){const p=ml_pop(tt,runAt[i]-0.3,null);ml_cal(x,YR[i][1],480,280,"31 March",YR[i][0],{k:p.k,a:p.a*yA,tick:ag_in(tt,runAt[i]+0.4,0.4)});}
  for(let i=0;i<3;i++)ag_T(x,"3 s",YR[i][1]+140,684,{w:700,size:30,align:"center",col:AG.blue,a:ag_in(tt,runAt[i]+0.2,0.4)*yA});
  // the same way every time, like Sperry's box: small, its wheels turning
  const bx=ag_io(tt,P.like-0.2,P.took-0.2,0.5);if(bx>0.01){ml_box(x,1744,600,0.38,{t:tt,tilt:0.06*Math.sin(tt*1.7),push:0.5+0.5*Math.sin(tt*1.7),level:1,chain:0,a:bx});
    ag_T(x,"Sperry's box",1744,722,{w:700,size:28,align:"center",a:bx});}
  // the agent took four minutes and twelve steps
  const ac=ml_pop(tt,P.four-0.1,P.needs+0.6);ag_textCard(x,1620,440,260,{kick:"Agent",title:"4 min",sub:"12 steps"},{k:ac.k,a:ac.a});}
// once: the long way out to the web, a plan that named no tools; now the plan names them, and the agent has only those
function ml_longWay(x,tt,P){const [rx,ry]=ML_ROOM.ring,fold=ag_in(tt,P.namesW-0.1,1.0),reach=ag_sine(ag_in(tt,P.searched-0.3,1.4))*(1-ag_sine(fold)),
    give=[0,1,2].map(i=>ag_sine(ag_in(tt,P.gives+0.1+i*0.18,0.8))),lit=tt<P.searched-0.3?0:tt<P.namesW-0.1?1:tt<P.gives?0:1;
  ml_agent(x,tt,{core:1,lit,col:lit===0?AG.violet:AG.blue,think:ag_io(tt,P.namesW-0.2,P.namesW+1.2,0.4)});
  // its three tools, and the arms that reach them once the plan names them; Docs had the census rules all along
  const dg=ag_io(tt,P.docs-0.2,P.docs+1.4,0.3);
  ML_ROOM.tools.forEach((tl,i)=>{const u=give[i],dt=i===2?Math.max(dg*(0.6+0.4*Math.sin((tt-P.docs)*7)),ag_io(tt,P.only,P.only+1.8,0.3)):0;
    ml_tool(x,i,{touch:Math.max(u>0.95?0.4:0,dt),server:1,plug:1});
    if(u>0.002){ag_reach(x,ml_arm(i),u,{grip:u>0.95?1:0,data:i===2?clamp((tt-P.only-0.2)/1.4,0,1):0});if(u>0.95){const e=ml_arm(i);ml_plug(x,e[6]-6,e[7],0,1,"#3E3F45",1);}}});
  // the long way: one long arm up to the web, and data coming back along it, slowly
  const GL=[1420,160,56],ga=ag_io(tt,P.searched-0.5,P.namesW+0.9,0.5);ml_globe(x,GL[0],GL[1],GL[2],ga,{side:"left"});
  ag_reach(x,[1360,476,1460,470,1470,300,GL[0]+8,GL[1]+GL[2]+14],reach,{grip:reach>0.95?1:0,data:reach>0.95?((tt-P.webW)*0.4)%1:0});
  ag_roomLight(x,1);
  // its plan: find the census rules; "Tools:" with nothing after it, marked amber once we see why; then filled in, and ticked
  const pk=ml_pop(tt,P.web-0.25,null),fill=clamp((tt-P.namesW)/1.0,0,1),k0=6/27;
  const pl=ml_plan(x,160,250,640,["1 Find the census rules","Tools: Catalog, Query, Docs"],{a:pk.a,ka:pk.k,amber:[false,tt>P.plan-0.1&&fill<=0],
    k:[1,lerp(k0,1,fill)],tick:[0,ag_in(tt,P.namesW+1.0,0.4)]});
  if(pk.a>0.01){x.save();x.globalAlpha*=pk.a;x.strokeStyle=rgba(AG.violet,0.45);x.lineWidth=3;x.setLineDash([6,8]);x.beginPath();x.moveTo(pl.x+pl.w+6,pl.y+52);
    x.lineTo(rx-150,ry-176);x.stroke();x.setLineDash([]);x.restore();}}
// two columns on the wall, a plain script under the first and the agent under the second: o.aL, o.aR (each column), o.rm and o.rl (the
// recipe coming in, its label), o.am and o.al (the agent coming in, its label), o.a (all of it)
function ml_twoCols(x,tt,o){const X0=640,X1=1220,Y=200,a=o.a==null?1:o.a;ag_roomLight(x,1);if(a<=0.01)return;x.save();x.globalAlpha*=a;
  const out=ml_columns(x,1,{x0:X0,x1:X1,y:Y,h:560,aL:o.aL,aR:o.aR}),rm=o.rm||0,am=o.am||0;
  ml_recipe(x,lerp(X0-200-420,X0-200,rm),out.left[1]-40,400,{fold:1,a:rm});
  ag_label(x,X0,out.left[1]+170,"plain script",{col:AG.blue,align:"center",a:o.rl||0});
  ml_small(x,tt,lerp(X1+420,X1,am),out.right[1]+60,100,48,{stepA:0,a:am});
  ag_label(x,X1,out.right[1]+230,"agent",{col:AG.violet,align:"center",a:o.al||0});x.restore();}

// ---- 9 · Back in the seat: Sperry's box held the aeroplane level while he stayed in his seat; Jun's agent brought him the evidence to decide;
//      an agent is its four parts; use one only where a plain script can't do the job ----
const ML_BOATWHO=[{who:{skin:[232,198,170],top:{c:[70,62,56]},cap:[104,72,48],goggles:true}},{who:{skin:[220,182,150],top:{c:[104,100,96]},cap:[84,82,80]}}];
scene("seat",(ctx,S,t,sc)=>{const c=sc.cues,P=ml_once(sc,"P",()=>({job:wAt(sc,"held","one"),while_:wAt(sc,"held","while"),seat:wAt(sc,"held","seat"),
    took:c.took,steps:wAt(sc,"took","steps"),brought:wAt(sc,"took","brought"),evid:wAt(sc,"took","evidence"),decide:wAt(sc,"took","decide"),
    is:c.is,model:wAt(sc,"is","model"),reasons:wAt(sc,"is","reasons"),hands:wAt(sc,"is","hands"),loop:wAt(sc,"is","loop"),only:c.only,end:c.breath}));
  ml_shots(ctx,S,t,sc.dur,[
    // 1914: the flying boat over the Seine, level, and Sperry's box at work, its one job
    {at:0,place:"mlSeine",keys:[[0,900,560,1.12],[0.1,940,560,1.14]],d:P.while_,push:0.01,draw:(x,tt)=>{const bx=lerp(560,1160,clamp(tt/(P.while_+0.4),0,1));
      ml_boat(x,bx,540,0.95,{t:tt,shadow:600,who:ML_BOATWHO});ml_crowd(x,tt,{turn:0.2+0.3*clamp(tt/P.while_,0,1)});
      const ia=ag_in(tt,P.job-0.3,0.5);if(ia>0.01){x.save();x.globalAlpha*=ia;ag_box(x,1240,124,440,300,24,{});
        ml_box(x,1460,250,0.3,{t:tt,tilt:0.05*Math.sin(tt*1.6),push:0.5+0.5*Math.sin(tt*1.6),level:1,chain:0});
        ag_T(x,"one job: hold it level",1460,396,{w:700,size:28,align:"center"});x.restore();}}},
    // Sperry back in his seat, his hands resting by the controls; the camera settles on his face
    {at:P.while_-0.3,place:null,keys:[[P.while_-0.3,960,540,1],[P.while_-0.2,ML_FACE[0],ML_FACE[1],1.5]],d:2.4,push:0.01,draw:(x,tt)=>
      ml_cockpit(x,tt,{mate:ML_PEOPLE.cachin,rest:1,mateGaze:[-1,-0.4],roll:0.006*Math.sin(tt*0.8)})},
    // today: the agent takes the steps of the new question, and brings Jun its answer with the evidence; he decides; its four parts gather in its ring
    {at:P.took-0.4,dis:1.0,place:"lab",keys:[[P.took-0.4,960,540,1],[P.took-0.3,960,540,1]],d:6,push:0.01,draw:(x,tt)=>ml_recap(x,tt,P)},
    // the two columns again: the agent settles under the steps nobody can write in advance
    {at:P.only-0.3,dis:0.7,place:"lab",keys:[[P.only-0.3,960,530,1.0],[P.only-0.2,960,520,1.02]],d:6,push:0.01,draw:(x,tt)=>ml_twoCols(x,tt,{aL:1,aR:1,rm:1,rl:1,
      am:ag_sine(ag_in(tt,P.only,1.1)),al:ag_in(tt,P.only+0.9,0.4),a:1-ag_in(tt,P.end,0.6)})}]);
  ml_kick(ctx,t,[[0,"1914"],[P.took-0.2,"Today"],[P.end,null]],1);
  // the four parts, lighting in turn as they're named, then into the ring, each to its place
  const pa=ag_io(t,P.is-0.4,P.only-0.3,0.5);if(pa>0.01)ml_parts(ctx,[ag_in(t,P.model-0.1,0.4),ag_in(t,P.reasons-0.1,0.4),ag_in(t,P.hands-0.1,0.4),ag_in(t,P.loop-0.1,0.4)],
    {a:pa,gather:ag_in(t,P.loop+0.25,1.0)});
  ag_end(ctx,S,t,P.end,ML_TITLE,null,"Film 3 of 10");});
const ML_FACE=[880,440];   // Sperry's face in the cockpit, for the camera
function ml_recap(x,tt,P){const [rx,ry]=ML_ROOM.ring,A=ML_ANS,W=500;
  // it takes the steps: its light goes once round the ring, data back along the arms
  const pu=clamp((tt-P.steps+0.4)/2.4,0,1),deg=-120+360*ag_sine(pu),pa=ag_io(tt,P.steps-0.4,P.brought+0.2,0.3),
    glow=ag_io(tt,P.loop+0.95,P.only-0.1,0.35),lit=pa>0.5?(((Math.round((deg+120)/120)%3)+3)%3):null;
  ml_agent(x,tt,{core:1+0.4*glow,think:glow,pulse:{deg:pa>0.01?deg:-120+360*ag_sine(clamp((tt-P.loop-0.95)/1.3,0,1)),a:Math.max(pa,glow)},lit,col:AG.violet});
  ML_ROOM.tools.forEach((tl,i)=>{const d=clamp((tt-P.steps-0.2-i*0.5)/1.4,0,1);ml_tool(x,i,{touch:d>0&&d<1?1:0,server:1,plug:1});
    ag_reach(x,ml_arm(i),1,{grip:1,data:d});const e=ml_arm(i);ml_plug(x,e[6]-6,e[7],0,1,"#3E3F45",1);});
  ml_jun(x,tt,{gaze:[3,ml_pw(tt,[[0,-0.5],[P.brought+0.4,-0.5],[P.brought+1.0,-0.35],[P.is,-0.35],[P.is+0.4,-0.9]])],
    nod:0.07*ag_io(tt,P.decide-0.2,P.decide+0.6,0.3),smile:0.2*ag_in(tt,P.decide,0.8)});
  ag_roomLight(x,1);
  // its answer, brought to Jun with the evidence clipped to it; he signs it; it goes as the four parts come
  const out=1-ag_in(tt,P.is-0.4,0.5);if(out<=0.01)return;const h=ag_evidence(x,A.x,A.y,W,ML_ANSW,ML_EV,{a:0}).card.h,fl=clamp((tt-P.brought)/1.1,0,1),
    F=ml_fly(fl,rx,ry,860,260,A.x+W/2,A.y+h/2),wa=ag_in(tt,P.brought+0.6,0.3);
  if(fl>0&&wa<1){x.save();x.globalAlpha*=out;x.translate(F.x,F.y);x.scale(F.s,F.s);ag_box(x,-W/2,-h/2,W,h,22,{a:(1-wa)*ag_in(tt,P.brought,0.2)});x.restore();}
  x.save();x.translate(F.x-(A.x+W/2),F.y-(A.y+h/2));ag_evidence(x,A.x,A.y,W,ML_ANSW,ML_EV,{a:wa*out});x.restore();
  const ap=ml_pop(tt,P.evid,null);ml_approve(x,A.x,A.y+h+22,W,"Jun",clamp((tt-P.decide+0.1)/0.6,0,1),{k:ap.k,a:ap.a*out});}

// chapters that open on a cut: each shows people, a place or words the chapter before ends on, which a crossfade would show twice
ag_cutInto(["question", "hands", "loop", "answer"]);
