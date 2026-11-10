/* ===== Walls, doors and keys: the scenes =====
   Nine chapters, each timed to its narration: wAt(sc, "line", "word") is the moment a word is said. The places are painted once
   (wd_city.js: Ragusa; wd_hall.js: the hall, the board's corner, the map); what moves is drawn live in the shots of ag_shots, which
   glide the camera in one room and dissolve, or cut, between rooms. A place's tag is drawn in screen space inside its shot, so it
   leaves with it. In the hall the camera glides from chapter to chapter (ag_cutInto, at the end), and each chapter finds the block as
   the one before left it (wd_base), so nothing jumps. */
DP_PEOPLE.push("sam");

// draw in screen space, whatever the camera is doing
function wd_scr(ctx,S,fn){ctx.save();setScreen(ctx,S);fn();ctx.restore();}
// a place's tag, top left in screen space: the place and the year, and a line under it
function wd_tag(ctx,text,a,sub,sa){if(a<=0)return;const w=dp_tw(ctx,text,{w:700,size:30})+48;ctx.save();ctx.globalAlpha*=a;dp_panel(ctx,72,56,w,66,{col:"grey",r:14,glowR:24});
  dp_T(ctx,text,96,100,{w:700,size:30});ctx.restore();if(sub&&sa>0){const w2=dp_tw(ctx,sub,{w:600,size:28})+44;ctx.save();ctx.globalAlpha*=a*sa;dp_panel(ctx,72,134,w2,58,{col:"grey",r:14,glowR:20});
    dp_T(ctx,sub,94,173,{w:600,size:28,col:"mut"});ctx.restore();}}
// a pill that springs in at t0 and fades at t1 (its middle at x, y its baseline)
function wd_pillAt(ctx,x,y,text,col,t,t0,t1,o){const a=ag_in(t,t0,0.35)*(t1==null?1:1-ag_in(t,t1,0.5));if(a<=0)return;const k=ag_spr(t,t0,0.45);
  ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x,y-12,lerp(0.7,1,clamp(k,0,1.2)));dp_pill(ctx,x,y,text,col,Object.assign({align:"center"},o||{}));ctx.restore();}
// a card that springs in at t0 and fades at t1
function wd_cardAt(ctx,x,y,w,words,t,t0,t1,o){const a=ag_in(t,t0,0.4)*(t1==null?1:1-ag_in(t,t1,0.5));if(a<=0)return null;
  return dp_card(ctx,x,y,w,words,Object.assign({},o||{},{a,k:Math.min(1,ag_spr(t,t0,0.5))}));}
// a speech card with a small tail towards whoever speaks (tx, ty)
function wd_sayAt(ctx,x,y,w,text,tx,ty,t,t0,t1){const a=ag_in(t,t0,0.4)*(t1==null?1:1-ag_in(t,t1,0.5));if(a<=0)return;const b=dp_card(ctx,x,y,w,{title:text},{measure:true});
  ctx.save();ctx.globalAlpha*=a;const bx=clamp(tx,x+40,x+w-40);ctx.save();ctx.shadowColor="rgba(72,222,244,0.5)";ctx.shadowBlur=14;ctx.fillStyle="rgba(10,30,36,0.92)";ctx.strokeStyle="rgba(150,235,245,0.9)";ctx.lineWidth=2.2;
  ctx.beginPath();ctx.moveTo(bx-18,y+b.h-2);ctx.lineTo(tx,ty);ctx.lineTo(bx+18,y+b.h-2);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
  dp_card(ctx,x,y,w,{title:text},{col:"cyan",k:Math.min(1,ag_spr(t,t0,0.5))});ctx.restore();}
// how long ago something started, as a draw-on from 0 to 1 over d seconds
const wd_on=(t,t0,d)=>clamp((t-t0)/(d||1),0,1);

/* ---------------------------------------------------------------- the hall, as each chapter finds it
   What the chapters before have left on the block and round it, so each chapter opens on what the last one ended on. */
function wd_base(ch){const b={labels:1,rooms:1,work:1,job:1,real:1,side:1,copies:1,admin:1,door:1,lit:()=>0.15};
  const s={inet:1,prov:1,keyA:1,keyU:0,thread:1,catalog:1,store:1,block:b};
  if(ch>=5)b.walls=1;
  // while the walls and doors go up, the room's own things step back: people's work and the nightly job come back in their rooms
  if(ch===4||ch===5)Object.assign(b,{work:0,job:0,real:0});
  if(ch>=6){Object.assign(b,{door:0,doorShut:1,door2:1,shaft:1,ring:1,side:0,sideShut:1});Object.assign(s,{corridor:1,flow:1,threadCut:1});}
  if(ch>=7){Object.assign(b,{split:1,sections:1,veil:(e)=>e<2?1:0,finished:1,lit:(e)=>e===2?0.3:0.15});s.catalog=0;}
  if(ch>=8){Object.assign(s,{prov:0,keyU:1,vault:1});}
  if(ch>=9){Object.assign(s,{apart:1});Object.assign(b,{copies:0,admin:0});}
  return s;}
// a state and changes to it: the block's own changes go in b
function wd_state(ch,o,b){const s=wd_base(ch);Object.assign(s,o||{});s.block=Object.assign({},s.block,b||{});return s;}
// Sam, at the bottom left of the hall, facing the block, faded whole
function wd_samHall(ctx,t,a,o){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;dp_person(ctx,"sam",250,830,0.62,Object.assign({t,gaze:[3,-2]},o||{}));ctx.restore();}

/* ---------------------------------------------------------------- 1 · Few gates */
scene("gates",(ctx,S,t,sc)=>{
  const T={today:wAt(sc,"today","Today"),walls:wAt(sc,"republic","behind high"),trade:wAt(sc,"trade","It lives"),ships:wAt(sc,"trade","its ships"),
    gates:wAt(sc,"gates","Sailors"),few:wAt(sc,"gates","through only"),more:wAt(sc,"more","more than"),plague:wAt(sc,"plague","thirteen forty-eight"),fast:wAt(sc,"plague","spread fast"),
    thousands:wAt(sc,"thousands","It killed"),back:wAt(sc,"thousands","kept coming"),tell:wAt(sc,"tell","At the gate"),nobody:wAt(sc,"tell","nobody could"),
    shut:wAt(sc,"shut","Shut"),loses:wAt(sc,"shut","loses"),open:wAt(sc,"open","Leave it"),walks:wAt(sc,"open","walks in"),change:wAt(sc,"change","Something")};
  ag_shots(ctx,S,t,sc.dur,[
    // the city from the sea at dusk; along its walls, three gates light in turn; two ships come into the harbour
    {at:0,place:"wdRagusa",keys:[[0,960,560,1.1],[T.walls-0.4,760,600,1.28],[T.walls+2.0,1260,620,1.28],[T.ships-0.2,1380,640,1.22]],d:2.6,push:0,draw:(c,tt)=>{
      WD_GATES.forEach(([x,y,w,h],i)=>{const a=ag_in(tt,T.walls+0.5+i*0.7,0.6);if(a>0){c.save();c.globalCompositeOperation="lighter";wd_glow(c,x+w/2,y-h/2,70,WD.lamp,0.5*a);c.restore();
        c.save();c.beginPath();wd_archPath(c,x,y,w,h);c.clip();c.fillStyle=rgba(WD.lamp,0.55*a);c.fillRect(x,y-h,w,h);c.restore();}});
      wd_ship(c,1450,786,0.3,{t:tt,seed:1});wd_ship(c,1340,792,0.26,{t:tt,seed:2,flip:true});
      for(const [i,y0,s] of [[0,800,0.34],[1,812,0.3]]){const u=ag_eo(wd_on(tt,T.ships-0.6+i*1.0,5.2)),x=lerp(2120+i*90,1560+i*40,u);if(u>0)wd_ship(c,x,y0,s,{t:tt,seed:3+i,flip:true,sail:1-0.8*u});}
      wd_scr(c,S,()=>wd_tag(c,"Ragusa · 1377",ag_in(tt,1.0,0.6),"today: Dubrovnik, Croatia",ag_in(tt,T.today,0.5)));}},
    // a gate from the quay: porters with bales and barrels go in, one at a time; a ship at the quay takes a faint coral rim;
    // the plague's year
    {at:T.gates-0.3,place:"wdGate",keys:[[0,1000,560,1.06],[T.more-0.6,1200,600,1.14]],d:2.4,draw:(c,tt)=>{
      wd_gateLight(c,1);wd_gateLantern(c,tt,1);
      wd_ship(c,1700,914,0.74,{t:tt,flip:true,rim:ag_in(tt,T.more+0.2,1.2)*0.85,seed:4});
      for(let k=0;k<5;k++){const t0=T.gates-0.6+k*1.6,u=wd_on(tt,t0,5.2);if(u<=0||u>=1)continue;const q=ag_sine(u),x=lerp(1340,945,q),y=lerp(1050,786,q),s=lerp(1.45,0.82,q),
          fa=Math.min(1,u*6)*(1-ag_in(u,0.86,0.14));wd_walker(c,x,y,s,{flip:true,ph:tt*5.2+k,carry:k%2?"barrel":"bale",a:fa,col:k%2?[58,56,60]:[50,58,64],light:0.6});}
      wd_scr(c,S,()=>wd_cardAt(c,1328,64,520,{kick:"1348",title:"the plague"},tt,T.plague,null,{col:"coral",behind:false}));}},
    // a street: warm windows go dark, one by one, slowly; nothing else is shown
    {at:T.thousands-0.4,place:"wdStreet",keys:[[0,960,560,1.0],[T.thousands+0.2,960,520,1.16]],d:6,push:0,draw:(c,tt)=>{const R=ag_rnd(12);
      const dark=WD_SWIN.map(()=>T.thousands+0.6+R()*5.4);wd_streetWindows(c,(i,w)=>(i%5===3?0:1)*(1-ag_in(tt,dark[i],1.0)*(i%4===1?0:1)));wd_palace(c,0.6,0,0.6);}},
    // the gate again: two travellers, alike; shut, and the harbour empties; open, and the sickness drifts in
    {at:T.tell-0.4,place:"wdGate",keys:[[0,960,540,1.12],[T.shut-0.4,1060,520,1.06]],d:2.2,push:0,draw:(c,tt)=>{
      const shut=ag_in(tt,T.shut,1.0)*(1-ag_in(tt,T.open,1.2)),light=1-0.75*shut;
      wd_gateLight(c,light);wd_gateLantern(c,tt,1);
      // the ship leaves when the port shuts, and the harbour lies empty
      const go=ag_in(tt,T.shut+0.2,2.6),back=ag_in(tt,T.open+0.2,0.1);if(go<1||back>0)wd_ship(c,1700+ag_sine(go)*420*(1-back),914,0.74,{t:tt,flip:go<=0.001,a:(1-go)+back*0,seed:4,rim:0.85*(1-go)});
      wd_gateDoors(c,1-shut);
      // two travellers at the gate, cloaked alike, and the question no one could answer
      const tv=ag_in(tt,T.tell+0.2,0.6)*(1-ag_in(tt,T.shut-0.6,0.6));if(tv>0){wd_walker(c,872,808,1.02,{walk:0,a:tv,col:[70,74,78],light:0.6});wd_walker(c,1018,808,1.02,{walk:0,flip:true,a:tv,col:[70,74,78],light:0.6});
        const q=ag_in(tt,T.nobody,0.5)*tv;if(q>0){c.save();c.globalAlpha*=q;c.translate(0,(1-ag_eo(wd_on(tt,T.nobody,0.8)))*30);const sh=c.createRadialGradient(945,628,0,945,628,96);sh.addColorStop(0,"rgba(4,12,16,0.82)");sh.addColorStop(0.6,"rgba(4,12,16,0.6)");sh.addColorStop(1,"rgba(4,12,16,0)");
          c.fillStyle=sh;c.fillRect(849,532,192,192);dp_T(c,"?",945,668,{w:800,size:120,align:"center",col:"coral"});c.restore();}}
      wd_pillAt(c,945,300,"no trade","coral",tt,T.loses-0.2,T.open);
      // open: a faint coral haze comes in from the harbour, through the gate, and stays where it is
      const hz=ag_in(tt,T.open+0.4,6.0)*0.7+ag_in(tt,T.walks,3.0)*0.3;wd_haze(c,[[1880,960],[1500,900],[1180,820],[945,740],[945,560]],Math.min(hz,0.92),ag_in(tt,T.open+0.3,1.2)*3.2,tt<T.change?tt:T.change,{seed:9,n:30,r:92});}}
  ]);
});

/* ---------------------------------------------------------------- 2 · A month apart */
scene("apart",(ctx,S,t,sc)=>{
  const T={council:wAt(sc,"council","Great Council"),passed:wAt(sc,"council","passed"),anyone:wAt(sc,"month","Anyone"),mrkan:wAt(sc,"month","on the islet"),cavtat:wAt(sc,"month","Cavtat"),
    then:wAt(sc,"then","Only then"),enter:wAt(sc,"then","enter"),noone:wAt(sc,"noone","No one"),stays:wAt(sc,"noone","stays the month"),officers:wAt(sc,"officers","health officers"),
    port:wAt(sc,"port","The port"),island:wAt(sc,"island","held on"),first:wAt(sc,"first","the first"),forty:wAt(sc,"forty","forty days"),word:wAt(sc,"forty","the word"),
    same:wAt(sc,"same","The university's"),people:wAt(sc,"same","people and jobs"),breaks:wAt(sc,"same","whoever breaks"),doors:wAt(sc,"needs","a few doors"),apart:wAt(sc,"needs","a place apart")};
  T.sea=T.anyone+2.4;
  ag_shots(ctx,S,t,sc.dur,[
    // the Great Council's hall, its nobles on their benches
    {at:0,place:"wdCouncil",keys:[[0,960,520,1.0],[2.0,960,560,1.08]],d:4.0,push:0.02,draw:(c,tt)=>{wd_scr(c,S,()=>wd_tag(c,"27 July 1377",ag_in(tt,0.8,0.6)));}},
    // the table: the law written on its parchment, and sealed; what it says
    {at:T.passed-0.5,place:"wdTable",keys:[[0,960,520,1.04],[T.anyone,960,540,1.0]],d:2.4,push:0.02,draw:(c,tt)=>{
      wd_parchment(c,560,130,760,ag_in(tt,T.passed-0.5,0.6),clamp((tt-T.passed-0.3)/0.7,0,1),tt);
      wd_cardAt(c,380,520,1160,{kick:"The law",title:"Whoever comes from a place with plague: a month apart, on Mrkan or in Cavtat, before entering"},tt,T.anyone,null,{col:"cyan"});}},
    // the coast as a map: the city, the open sea, Mrkan and Cavtat; a month apart, then in through the gate; and no one goes to them
    {at:T.mrkan-0.4,place:"wdCoast",keys:[[0,900,560,1.08],[T.noone-0.4,880,560,1.04]],d:2.2,draw:(c,tt)=>wd_coastLaw(c,S,tt,T,false)},
    // the quay and the gate: health officers with lanterns, one by a ship, one at the gate
    {at:T.officers-0.4,place:"wdGate",keys:[[0,1040,560,1.06]],push:0.03,draw:(c,tt)=>{wd_gateLight(c,1);wd_gateLantern(c,tt,1);wd_ship(c,1700,914,0.74,{t:tt,flip:true,seed:4});
      const a=ag_in(tt,T.officers,0.6);wd_walker(c,1380,960,1.42,{walk:0,carry:"lantern",hood:false,light:1,col:[44,52,64],a});wd_walker(c,1190,812,1.02,{walk:0,flip:true,carry:"lantern",hood:false,light:1,col:[44,52,64],a});}},
    // the port open: ships in the harbour again, the windows lit
    {at:T.port-0.4,place:"wdRagusa",keys:[[0,1160,600,1.18],[T.port+0.2,1260,620,1.24]],d:3.0,push:0,draw:(c,tt)=>{
      wd_ship(c,1450,786,0.3,{t:tt,seed:1});wd_ship(c,1340,792,0.26,{t:tt,seed:2,flip:true});
      for(const [i,x0,y0,s] of [[0,1560,800,0.34],[1,1640,812,0.3],[2,1250,806,0.28]]){const u=ag_eo(wd_on(tt,T.port-0.2+i*0.7,3.4));wd_ship(c,lerp(x0+520,x0,u),y0,s,{t:tt,seed:5+i,flip:true,sail:1-0.8*u});}}},
    // the map again: the sickness held on the island; the first known law; forty days
    {at:T.island-0.4,place:"wdCoast",keys:[[0,1080,620,1.16],[T.first-0.4,900,560,1.04]],d:2.4,draw:(c,tt)=>{wd_coastLaw(c,S,tt,T,true);
      wd_scr(c,S,()=>{wd_cardAt(c,560,170,800,{kick:"1377",title:"the first known quarantine law"},tt,T.first,T.forty-0.3,{col:"cyan"});
        wd_cardAt(c,560,170,800,{kick:"40 days",title:"quaranta · quarantine"},tt,T.forty+0.4,T.same-0.6,{col:"cyan"});});}},
    // the university's hall: people and jobs reach the platform every day; whoever breaks in comes too; a few doors, each with a
    // rule, and a place apart; then the title
    {at:T.same-0.4,place:"wdHall",keys:[[0,930,500,1.04],[T.doors-0.6,980,520,1.0]],d:2.4,draw:(c,tt)=>{
      const s=wd_state(3,{prov:0,keyA:0,thread:0,catalog:0,store:0,inet:ag_in(tt,T.people,0.6)},{labels:0,rooms:0,work:0,job:0,real:0,copies:0,admin:0,lit:()=>0.15,
        door2:ag_in(tt,T.doors+0.5,0.8)});s.apart=ag_in(tt,T.apart,0.8);s.apartLabel=0;wd_hallWorld(c,tt,s);
      for(let k=0;k<5;k++){const u=wd_on(tt,T.people-0.2+k*0.9,3.4);if(u<=0||u>=1)continue;const x=lerp(150,470,ag_sine(u)),y=lerp(640,392,ag_sine(u));c.save();c.globalAlpha*=Math.min(1,u*5,(1-u)*5);wd_mini(c,x,y,k%2?"gear":"person","cyan",0.8);c.restore();}
      wd_walk(c,[[120,760],[300,560],[440,440]],wd_on(tt,T.breaks,2.2),{a:1-ag_in(tt,T.doors-0.4,0.6)});
      // the two doors, each with its ring: a rule at each
      for(const [x,i] of [[WD_DOOR.x,0],[WD_DOOR2.x,1]]){const a=ag_in(tt,T.doors+0.2+i*0.5,0.5);if(a<=0)continue;c.save();c.globalAlpha*=a;c.strokeStyle=rgba(DP.F.cyan,1);c.lineWidth=4;c.shadowColor=rgba(DP.F.cyan,0.9);c.shadowBlur=12;
        c.beginPath();c.ellipse(x,WD_DOOR.y+WD_DOOR.h/2,30,72,0,0,TAU);c.stroke();c.restore();}}}
  ]);
  dp_title(ctx,S,t,sc.cues.breath,"Walls, doors and keys",null,"FILM 3 OF 9 · LOCKS BEFORE THE DATA");
});
// the coast's map, as the law is said (T the chapter's moments); held: the haze rests on the islet
function wd_coastLaw(c,S,tt,T,held){const M=WD_MAP;
  const nm=(text,x,y,t0,o)=>{const a=held?1:ag_in(tt,t0,0.5);if(a>0)dp_T(c,text,x,y,Object.assign({w:700,size:30,align:"center",a},o||{}));};
  nm("Ragusa",M.city[0]-40,M.city[1]+78,T.mrkan-0.6);nm("the open sea",M.sea[0],M.sea[1],T.sea,{col:"mut",w:600});nm("Mrkan",M.mrkan[0],M.mrkan[1]+64,T.mrkan+0.2);nm("Cavtat",M.cavtat[0]+96,M.cavtat[1]+8,T.cavtat);
  // the ship at sea, and its line to the islet; a month of moons over it; then on to the city's gate, green
  const ship=[700,800],isl=[1270,742],gate=[M.gate[0]+8,M.gate[1]+14];
  if(!held){wd_ship(c,ship[0],ship[1],0.2,{t:tt,seed:7,sail:1});
    const l1=wd_on(tt,T.then,1.4);if(l1>0)dp_link(c,[ship[0]+30,ship[1]-14],isl,"grey",l1,{dash:[8,9],dot:false});
    for(let k=0;k<4;k++){const a=ag_in(tt,T.then+1.0+k*0.55,0.4);if(a>0){const x=isl[0]-230+k*62,y=isl[1]-70-Math.sin((k+0.5)/4*Math.PI)*36;wd_moon(c,x,y,15,k,a);}}
    const l2=wd_on(tt,T.enter+0.4,1.6);if(l2>0)dp_link(c,isl,gate,"green",ag_sine(l2),{dash:[10,8]});
    // no one from the city goes to them: whoever does stays the month too
    const g=wd_on(tt,T.noone+0.2,2.6);if(g>0){const a=1-ag_in(tt,T.officers-1.0,0.6),A=[gate[0]+24,gate[1]+56],C=[860,760],B=[isl[0]-26,isl[1]+12],bz=u=>[(1-u)*(1-u)*A[0]+2*(1-u)*u*C[0]+u*u*B[0],(1-u)*(1-u)*A[1]+2*(1-u)*u*C[1]+u*u*B[1]];
      c.save();c.globalAlpha*=a;c.strokeStyle="rgba(200,230,232,0.8)";c.lineWidth=2.4;c.setLineDash([3,9]);c.lineCap="round";c.beginPath();const ug=ag_sine(g);for(let k=0;k<=40;k++){const p=bz(ug*k/40);k?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);}c.stroke();c.setLineDash([]);
      const p=bz(ug);c.fillStyle="rgb(240,250,250)";c.beginPath();c.arc(p[0],p[1],7,0,TAU);c.fill();c.restore();}
    wd_scr(c,S,()=>wd_cardAt(c,1060,170,700,{title:"Whoever goes to them stays the month too"},tt,T.stays-0.4,T.officers-0.8,{col:"cyan"}));}
  else{const a=ag_in(tt,T.island,1.4);wd_haze(c,[[isl[0]-40,isl[1]],[isl[0]+40,isl[1]-6]],1,a*1.4,tt,{seed:3,n:14,r:46});
    }}
// a moon of the month: phase k (0 a crescent, 1 a half, 2 full, 3 a half waning), drawn in light
function wd_moon(c,x,y,r,k,a){if(a<=0)return;c.save();c.globalAlpha*=a;dp_halo(c,x,y,r*3,[220,240,240],0.18);c.fillStyle="rgba(230,245,245,0.95)";c.beginPath();c.arc(x,y,r,0,TAU);c.fill();
  if(k!==2){c.fillStyle="rgb(8,22,28)";c.beginPath();const off=k===0?r*0.62:k===1?r:-r;if(k===3){c.rect(x-r,y-r,r,2*r);}else if(k===1){c.rect(x-r,y-r,r,2*r);}else c.arc(x-off,y,r,0,TAU);c.fill();}
  c.restore();}

/* ---------------------------------------------------------------- 3 · If someone got in */
// the intruder's walk, through the block as it is: from the plain to the door, into the room, to each pane, down the side door to the
// files; out along the thread; and to the copies
const WD_WALK1=[[200,560],[470,390],[560,392],[591,300],[763,300],[935,300],[1107,300],[1279,300],[1132,470],[1132,650],[900,720]];
const WD_WALK2=[[600,330],[620,226],[470,226],[340,290],[244,420]],WD_WALK3=[[900,720],[1180,720],[1236,700]];
scene("inside",(ctx,S,t,sc)=>{
  const T={job:wAt(sc,"token","nightly job"),longer:wAt(sc,"token","no longer"),sam:wAt(sc,"asks","Sam Okafor"),attacker:wAt(sc,"asks","what an attacker"),
    door:wAt(sc,"door","Today"),inet:wAt(sc,"door","open internet"),anyone:wAt(sc,"door","anyone"),one:wAt(sc,"one","one workspace"),exp:wAt(sc,"one","experiments"),real:wAt(sc,"one","real records"),
    areas:wAt(sc,"areas","every area's"),reg:wAt(sc,"areas","registrar's"),learn:wAt(sc,"areas","learning"),plan:wAt(sc,"areas","planning"),hr:wAt(sc,"areas","HR"),fin:wAt(sc,"areas","finance"),
    files:wAt(sc,"files","straight to"),store:wAt(sc,"files","storage"),past:wAt(sc,"files","past the catalog"),out:wAt(sc,"out","Data can"),backups:wAt(sc,"backups","The backups"),admin:wAt(sc,"backups","any admin"),
    key:wAt(sc,"key","the data's key"),cant:wAt(sc,"key","can't take"),grew:wAt(sc,"grew","Nobody"),small:wAt(sc,"grew","started small")};
  T.walk=T.cant+0.6;
  const lit=[T.reg,T.learn,T.plan,T.hr,T.fin];
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"wdHall",keys:[[0,960,540,1.0],[0.5,1060,400,1.34],[T.sam-0.2,780,560,1.06],[T.inet-0.8,520,500,1.16],[T.one-0.6,930,330,1.42],[T.areas+0.6,930,300,1.36],
        [T.files-0.2,930,640,1.3],[T.out-0.3,600,420,1.14],[T.backups-0.2,1120,640,1.34],[T.key-0.3,560,330,1.02],[T.walk-0.4,960,540,1.0]],d:1.8,push:0,draw:(c,tt)=>{
      const walking=ag_in(tt,T.walk,0.3)*(1-ag_in(tt,T.grew+0.2,0.8));
      const s=wd_state(3,{inet:ag_in(tt,T.inet,0.5),prov:ag_in(tt,T.key,0.6),keyA:ag_in(tt,T.key+0.3,0.6),thread:wd_on(tt,T.out+0.2,1.4),catalog:ag_in(tt,T.past,0.5),store:ag_in(tt,T.store,0.5)},
        {labels:i=>ag_in(tt,lit[i],0.4),rooms:ag_in(tt,T.one,0.5),work:ag_in(tt,T.exp,0.5),job:ag_in(tt,T.job-0.4,0.6),real:ag_in(tt,T.real,0.5),
         lit:(e,i)=>0.15+0.85*ag_in(tt,lit[i],0.4)*(1-ag_in(tt,T.files-0.6,0.8)),coral:(e,i)=>walking*ag_in(tt,T.walk+0.5+i*0.32,0.25),
         side:1,copies:ag_in(tt,T.backups,0.5),admin:ag_in(tt,T.admin,0.5),crack:ag_in(tt,T.walk+2.6,0.4)*(1-ag_in(tt,T.grew+0.2,0.8)),door:1});
      wd_hallWorld(c,tt,s);
      // the job no longer carries Jun's token: the token's sealed card, struck through, and gone
      const tk=ag_in(tt,0.6,0.5)*(1-ag_in(tt,T.longer+1.6,0.6));if(tk>0)dp_sealed(c,744,328,300,"Jun's token",{a:tk,revoked:wd_on(tt,T.longer+0.2,0.8)});
      // the intruder's walk through it all
      if(walking>0){c.save();c.globalAlpha*=walking;wd_walk(c,WD_WALK1,wd_on(tt,T.walk,2.6));wd_walk(c,WD_WALK2,wd_on(tt,T.walk+1.2,1.0));wd_walk(c,WD_WALK3,wd_on(tt,T.walk+2.2,0.6));c.restore();}
      // it started small, and grew: a block of the size it began, growing to what it is
      const gr=wd_on(tt,T.small-0.4,2.2),ga=ag_in(tt,T.small-0.4,0.3)*(1-ag_in(tt,T.small+1.9,0.6));if(ga>0){const B=WD_BK,w=lerp(330,B.w,ag_sine(gr)),h=lerp(270,B.h,ag_sine(gr));
        c.save();c.globalAlpha*=ga;c.setLineDash([12,10]);c.strokeStyle="rgba(200,250,250,0.9)";c.lineWidth=3;c.shadowColor="rgba(104,216,230,0.8)";c.shadowBlur=10;rr(c,B.x-8,B.y-8,w+16,h+16,16);c.stroke();c.restore();}
      // Sam, and the question
      wd_samHall(c,tt,ag_in(tt,T.sam-0.3,0.6)*(1-ag_in(tt,T.inet-1.4,0.6)));
      wd_sayAt(c,40,430,520,"If someone got in, how far could they go?",300,612,tt,T.attacker,T.door-0.2);}}
  ]);
});

/* ---------------------------------------------------------------- 4 · Who secures what */
scene("who",(ctx,S,t,sc)=>{
  const T={writes:wAt(sc,"writes","Sam writes"),cloud:wAt(sc,"cloud","The cloud"),makers:wAt(sc,"makers","The platform's"),rest:wAt(sc,"rest","The university"),
    contract:wAt(sc,"contract","Whatever"),data:wAt(sc,"contract","the data is"),walls:wAt(sc,"contract","the walls"),map:wAt(sc,"map","They follow"),areas:wAt(sc,"map","the areas"),
    owner:wAt(sc,"map","the owner"),decides:wAt(sc,"map","Who decides"),trusted:wAt(sc,"trusted","A wall"),checked:wAt(sc,"trusted","still checked"),
    small:wAt(sc,"small","But walls"),mistake:wAt(sc,"small","a mistake"),started:wAt(sc,"small","where it started")};
  ag_shots(ctx,S,t,sc.dur,[
    // the board: Sam writes who secures what, a marker in hand
    {at:0,place:"wdBoard",keys:[[0,860,520,1.04],[T.rest+0.4,820,500,1.08]],d:3,push:0,draw:(c,tt)=>{const B=WD_BOARD;
      dp_wall(c,B.x,B.y,B.w,B.h,{col:"cyan"});
      wd_row(c,150,"The cloud provider","buildings, machines, the network between them","grey",wd_on(tt,T.cloud,0.8));
      wd_row(c,300,"The platform's makers","its software, how it checks every request","grey",wd_on(tt,T.makers,0.8));
      wd_row(c,450,"The university","who gets in, what each may do, settings, keys, copies",[190,245,245],wd_on(tt,T.rest,0.8));
      wd_pillAt(c,452,672,"its data: always",[190,245,245],tt,T.data,null,{size:30,glow:28});
      dp_person(c,"sam",1590,830,0.84,{t:tt,flip:true,pose:"hold",hold:(x,h)=>wd_marker(x,h),gaze:[2,0]});}},
    // the university's map: five areas, each with its named owner
    {at:T.map-0.4,place:"wdMap",keys:[[0,960,470,1.06]],push:0.03,draw:(c,tt)=>{
      wd_uniMap(c,tt,1,i=>wd_on(tt,T.owner+i*0.3,0.6),{areas:i=>ag_in(tt,T.areas-0.2+i*0.2,0.4)});
      wd_cardAt(c,1180,712,440,{kick:"owners",title:"Who decides"},tt,T.decides,null,{col:"cyan"});}},
    // the block again: walls rise along the areas' edges, five rooms where there was one; every request still checked; a spill stays put
    {at:T.trusted-0.4,cut:true,place:"wdHall",keys:[[0,930,415,1.3],[T.small+0.4,930,425,1.27]],d:2,push:0,draw:(c,tt)=>{
      const s=wd_state(4,{},{walls:wd_on(tt,T.trusted+0.3,2.2)});wd_hallWorld(c,tt,s);
      // a request in each room, one at a time: a badge reaches a pane, through a small ring, and a tick
      for(let i=0;i<5;i++){const t0=T.checked-0.6+i*0.9,p=wd_on(tt,t0,1.4),fa=ag_in(tt,t0,0.3)*(1-ag_in(tt,t0+1.6,0.4));if(fa<=0)continue;const pb=wd_paneBox(2,i,0),cx=pb.x+pb.w/2;
        c.save();c.globalAlpha*=fa;wd_mini(c,cx,lerp(450,400,ag_sine(p)),"person","cyan",0.72);c.strokeStyle=rgba(DP.F.cyan,0.95);c.lineWidth=3;c.shadowColor=rgba(DP.F.cyan,0.8);c.shadowBlur=8;
        c.beginPath();c.ellipse(cx,pb.y+pb.h+14,34,8,0,0,TAU);c.stroke();c.restore();dp_tick(c,cx+44,pb.y+pb.h+14,"green",clamp((p-0.4)/0.5,0,1)*fa);}
      // a mistake, or an intruder: a coral spill in one room, held there by its walls
      const sp=ag_in(tt,T.mistake,0.8)*(1-ag_in(tt,sc.dur-0.9,0.5));if(sp>0){const pb=wd_paneBox(2,3,0);wd_haze(c,[[pb.x+30,410],[pb.x+pb.w-30,400]],1,sp*1.6,tt,{seed:21,n:12,r:46});
        wd_pane(c,pb.x,pb.y,pb.w,pb.h,{lit:0.6*sp,mix:1,label:"HR"});}}}
  ]);
});

/* ---------------------------------------------------------------- 5 · Few doors */
scene("doors",(ctx,S,t,sc)=>{
  const T={off:wAt(sc,"internet","comes off"),reach:wAt(sc,"internet","reach it only"),priv:wAt(sc,"internet","private path"),net:wAt(sc,"internet","university's own"),
    storage:wAt(sc,"storage","reaches the storage"),too:wAt(sc,"storage","too"),out:wAt(sc,"out","the way out"),list:wAt(sc,"out","short list"),
    files:wAt(sc,"files","Storage keeps"),masks:wAt(sc,"files","no masks"),catalog:wAt(sc,"catalog","the catalog"),checks:wAt(sc,"catalog","checks every"),rule:wAt(sc,"catalog","applies every"),
    back:wAt(sc,"back","The back door"),shut:wAt(sc,"back","stays shut"),admin:wAt(sc,"admin","an admin"),on:wAt(sc,"admin","switched on"),like:wAt(sc,"like","Like Ragusa's"),rule2:wAt(sc,"like","a rule")};
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"wdHall",keys:[[0,930,425,1.27],[T.off-1.2,560,430,1.18],[T.priv-0.2,1360,420,1.12],[T.storage-0.4,960,540,1.24],[T.out-0.3,480,420,1.12],
        [T.files-0.3,930,700,1.36],[T.catalog-0.3,960,560,1.3],[T.back-0.2,1060,560,1.3],[T.like-1.4,960,540,1.0]],d:1.8,push:0,draw:(c,tt)=>{
      const s=wd_state(5,{corridor:ag_in(tt,T.priv,1.4),flow:ag_in(tt,T.net,1.0),threadCut:wd_on(tt,T.out+0.4,1.2),catalog:1},
        {door:1-ag_in(tt,T.off+0.2,1.0),doorShut:ag_in(tt,T.off+0.6,0.6),door2:ag_in(tt,T.reach,1.0),shaft:ag_in(tt,T.storage+0.4,0.8),
         files:ag_in(tt,T.masks-1.2,0.8)*(1-ag_in(tt,T.catalog-0.2,0.8)),ring:ag_in(tt,T.catalog+0.2,0.6),side:1-ag_in(tt,T.back+0.2,0.9),sideShut:ag_in(tt,T.shut,0.5),amber:ag_io(tt,T.on-0.2,T.on+1.6,0.5)});
      wd_hallWorld(c,tt,s);
      wd_pillAt(c,WD_DOOR.x,WD_DOOR.y+WD_DOOR.h+62,"closed to the internet","coral",tt,T.off+0.8,T.priv-0.4);
      wd_pillAt(c,1080,500,"private","cyan",tt,T.too-0.4,T.out+0.2);
      // the short list of places data may leave for
      wd_cardAt(c,40,470,404,{kick:"may leave for",sub:"the government's returns, the university's reports, the backups' place apart"},tt,T.list,T.files-0.6,{col:"green"});
      // the catalog, the files' only door: each request checked on the way, and a rule's values hidden
      for(let k=0;k<3;k++)wd_request(c,WD_CT.x,wd_on(tt,T.checks-0.4+k*1.3,1.0),{rule:k>0});
      wd_pillAt(c,1132,450,"back door: shut","coral",tt,T.shut,T.admin-0.2);
      wd_pillAt(c,1132,450,"an admin account, switched on","amber",tt,T.on-0.2,T.on+1.8);}},
    // Ragusa's walls: three gates lit, an officer with a lantern at each
    {at:T.like-0.3,place:"wdRagusa",keys:[[0,1000,600,1.16],[T.rule2,1040,610,1.2]],d:3,push:0,draw:(c,tt)=>{
      WD_GATES.forEach(([x,y,w,h],i)=>{c.save();c.globalCompositeOperation="lighter";wd_glow(c,x+w/2,y-h/2,70,WD.lamp,0.5);c.restore();c.save();c.beginPath();wd_archPath(c,x,y,w,h);c.clip();c.fillStyle=rgba(WD.lamp,0.55);c.fillRect(x,y-h,w,h);c.restore();
        wd_walker(c,x+w+14,y+2,0.3,{walk:0,carry:"lantern",hood:false,light:1,col:[44,52,64],flip:i===2,a:ag_in(tt,T.like+0.4+i*0.4,0.5)});});
      wd_ship(c,1450,786,0.3,{t:tt,seed:1});wd_ship(c,1340,792,0.26,{t:tt,seed:2,flip:true});wd_ship(c,1560,800,0.34,{t:tt,seed:3,flip:true,sail:0.2});
      wd_scr(c,S,()=>wd_tag(c,"Ragusa",ag_in(tt,T.like,0.5)));}}
  ]);
});

/* ---------------------------------------------------------------- 6 · Rooms apart */
scene("rooms",(ctx,S,t,sc)=>{
  const T={three:wAt(sc,"three","becomes three"),dev:wAt(sc,"three","development"),try:wAt(sc,"try","try new"),test:wAt(sc,"try","in test"),run:wAt(sc,"try","as it will run"),
    prod:wAt(sc,"prod","Production"),real:wAt(sc,"prod","the real records"),nightly:wAt(sc,"prod","runs the nightly"),own:wAt(sc,"own","Each reaches"),masked:wAt(sc,"masked","made-up"),never:wAt(sc,"masked","never a copy"),
    mistake:wAt(sc,"mistake","a mistake"),intruder:wAt(sc,"mistake","an intruder"),path:wAt(sc,"path","one reviewed"),builds:wAt(sc,"path","From a branch"),islet:wAt(sc,"islet","Like the islet"),gate:wAt(sc,"islet","through the gate")};
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"wdHall",keys:[[0,930,420,1.16],[T.three,930,360,1.3],[T.own-0.2,930,470,1.24],[T.path-0.4,1100,450,1.2]],d:2,push:0,draw:(c,tt)=>{
      const sp=wd_on(tt,T.three+0.3,2.4),own=ag_in(tt,T.own,0.6),vl=ag_in(tt,T.masked,0.8);
      const s=wd_state(6,{catalog:1-ag_in(tt,T.three+0.2,0.5),store:1-ag_in(tt,T.masked+0.3,0.4)*(1-ag_in(tt,T.mistake-0.4,0.5))},{split:sp,sections:ag_in(tt,T.own,0.8),work:ag_in(tt,T.try,0.6),test:ag_in(tt,T.test,0.6),finished:ag_in(tt,T.run,0.8),job:ag_in(tt,T.nightly,0.6),real:ag_in(tt,T.real,0.6),
        lit:(e,i)=>e===2?0.15+0.6*own*Math.max(0,Math.sin(Math.min(Math.PI,(tt-T.own-i*0.15)*2))):0.15+0.5*own*Math.max(0,Math.sin(Math.min(Math.PI,(tt-T.own-0.4-e*0.3-i*0.12)*2))),
        veil:e=>e<2?vl:0,coral:(e,i)=>e===0&&i===2?ag_in(tt,T.mistake,0.6)*(1-ag_in(tt,T.path-0.6,0.6)):0});
      wd_hallWorld(c,tt,s);
      wd_cardAt(c,520,560,520,{kick:"made-up or masked",sub:"never a copy of production's"},tt,T.masked+0.3,T.mistake-0.4,{col:"violet"});
      // a mistake in development stays there; an intruder there finds only frost
      const ma=ag_in(tt,T.mistake,0.6)*(1-ag_in(tt,T.path-0.6,0.6));if(ma>0){const b=wd_roomBox(0,1);wd_haze(c,[[b.x+60,400],[b.x+b.w-60,390]],1,ma*1.5,tt,{seed:31,n:10,r:40});}
      const ia=ag_in(tt,T.intruder,0.3)*(1-ag_in(tt,T.path-0.6,0.6));if(ia>0){const b=wd_roomBox(0,1),pb=wd_paneBox(0,2,1);c.save();c.globalAlpha*=ia;wd_walk(c,[[b.x+20,470],[pb.x+pb.w/2,pb.y+pb.h+6]],wd_on(tt,T.intruder,1.2));c.restore();}
      // one reviewed path: development, test, production
      const pa=wd_on(tt,T.path+0.2,1.6),pf=1-ag_in(tt,T.islet-0.6,0.5);if(pa>0&&pf>0){c.save();c.globalAlpha*=pf;const y=92,half=[101,46,91];for(let e=0;e<2;e++){const a=wd_roomBox(e,1),b=wd_roomBox(e+1,1),u=clamp(pa*2-e,0,1);
          if(u>0)dp_link(c,[a.x+a.w/2+half[e],y],[b.x+b.w/2-half[e+1],y],"green",ag_sine(u),{lw:4});}
        wd_T(c,"one reviewed path",935,46,{w:700,size:28,align:"center",col:"green",a:ag_in(pa,0.8,0.2)});c.restore();}
      wd_cardAt(c,1424,520,420,{kick:"built in",title:"From a branch to production"},tt,T.builds,T.islet-0.6,{col:"green"});}},
    // the coast: what isn't trusted yet waits apart, then comes in only through the gate
    {at:T.islet-0.3,place:"wdCoast",keys:[[0,860,560,1.04]],push:0.03,draw:(c,tt)=>{const M=WD_MAP,isl=[1270,742],gate=[M.gate[0]+8,M.gate[1]+14],ship=[700,800];
      for(const [n,x,y] of [["Ragusa",M.city[0]-40,M.city[1]+78],["Mrkan",M.mrkan[0],M.mrkan[1]+64]])dp_T(c,n,x,y,{w:700,size:30,align:"center"});
      wd_ship(c,ship[0],ship[1],0.2,{t:tt,seed:7,sail:1});dp_link(c,[ship[0]+30,ship[1]-14],isl,"grey",wd_on(tt,T.islet+0.2,1.0),{dash:[8,9],dot:false});
      for(let k=0;k<4;k++)wd_moon(c,isl[0]-230+k*62,isl[1]-70-Math.sin((k+0.5)/4*Math.PI)*36,15,k,ag_in(tt,T.islet+1.0+k*0.4,0.3));
      const l2=wd_on(tt,T.gate-0.4,1.4);if(l2>0)dp_link(c,isl,gate,"green",ag_sine(l2),{dash:[10,8]});}}
  ]);
});

/* ---------------------------------------------------------------- 7 · Keys you can see */
scene("keys",(ctx,S,t,sc)=>{
  const T={encrypted:wAt(sc,"encrypted","encrypted"),unread:wAt(sc,"encrypted","unreadable"),who:wAt(sc,"who","who holds"),until:wAt(sc,"until","Until now"),own:wAt(sc,"own","the university's own"),
    team:wAt(sc,"own","security team"),use:wAt(sc,"use","may use"),take:wAt(sc,"use","never take"),del:wAt(sc,"use","can't delete"),back:wAt(sc,"back","take it back"),nobody:wAt(sc,"back","nobody can read"),
    lose:wAt(sc,"lose","Lose that"),rec:wAt(sc,"lose","every use"),ninety:wAt(sc,"lose","ninety days"),rector:wAt(sc,"rector","In Ragusa"),shut:wAt(sc,"rector","shut each"),
    taken:wAt(sc,"rector","keys taken"),morning:wAt(sc,"rector","until morning"),knew:wAt(sc,"knew","Everyone")};
  T.street=T.taken-0.6;
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"wdHall",keys:[[0,930,420,1.12],[T.encrypted-0.4,930,450,1.2],[T.until-0.6,960,400,1.0],[T.use-0.4,1420,330,1.14],[T.back-0.3,1180,380,1.06],
        [T.lose-0.2,1240,330,1.12]],d:1.8,push:0,draw:(c,tt)=>{
      const ku=wd_on(tt,T.own+0.2,2.4),taken=ag_io(tt,T.back+0.6,T.nobody+2.6,0.6),dim=ag_io(tt,T.lose,T.rec+0.6,0.6);
      const s=wd_state(7,{prov:1-ag_in(tt,T.team+1.0,0.8),vault:ag_in(tt,T.own,0.8),keyU:ku,keyDim:dim,vaultCoral:taken,corLabel:0,store:1-ag_in(tt,T.encrypted+0.4,0.4)*(1-ag_in(tt,T.who-0.2,0.5))},
        {cipher:ag_in(tt,T.encrypted,1.0),full:taken,dim:dim});
      wd_hallWorld(c,tt,s);
      wd_cardAt(c,520,560,560,{kick:"encrypted",title:"on disk, and on the move"},tt,T.encrypted+0.4,T.who-0.2,{col:"violet"});
      // a request that may read passes through the frost, and what it may see is clear for it
      const rq=wd_on(tt,T.unread-0.8,2.2),ra=ag_in(tt,T.unread-0.8,0.3)*(1-ag_in(tt,T.who-0.4,0.4));if(ra>0){const pb=wd_paneBox(2,4,1);c.save();c.globalAlpha*=ra;wd_mini(c,pb.x+pb.w/2,lerp(470,pb.y+pb.h+40,ag_sine(rq)),"person","cyan",0.7);
        dp_tick(c,pb.x+pb.w/2+40,pb.y+pb.h+30,"green",clamp(rq*2-1,0,1));const clear=clamp(rq*2-1,0,1);if(clear>0){c.save();rr(c,pb.x,pb.y,pb.w,pb.h,8);c.clip();c.globalAlpha*=clear;
          c.fillStyle="rgba(200,240,240,0.35)";c.fillRect(pb.x,pb.y,pb.w,pb.h);c.fillStyle="rgba(240,252,252,0.8)";for(let r=0;r<5;r++)c.fillRect(pb.x+8,pb.y+14+r*18,pb.w-16,3);c.restore();}c.restore();}
      // the platform may use it, never take it out: a thread to the vault, and back with "open"
      const ua=ag_io(tt,T.use,T.back-0.2,0.4);if(ua>0){const a=[1390,250],b=[WD_VAULT.x+20,WD_VAULT.y+200],u=wd_on(tt,T.use+0.1,1.0);c.save();c.globalAlpha*=ua;dp_link(c,a,b,"cyan",ag_sine(u),{dot:u>=1});
        const back=wd_on(tt,T.use+1.2,1.2);if(back>0){const x=lerp(b[0],a[0],ag_sine(back)),y=lerp(b[1],a[1],ag_sine(back));dp_pill(c,x,y+12,"open","cyan",{align:"center",a:ag_in(back,0,0.2)});}c.restore();}
      wd_pillAt(c,WD_VAULT.x+WD_VAULT.w/2,WD_VAULT.y+WD_VAULT.h+30,"the platform team: can't delete","coral",tt,T.del,T.back-0.2);
      wd_pillAt(c,WD_VAULT.x+WD_VAULT.w/2,WD_VAULT.y+WD_VAULT.h+30,"taken back","coral",tt,T.back+0.8,T.nobody+2.6);
      // every use recorded, and a deleted key kept ninety days
      const la=ag_io(tt,T.rec,sc.cues.rector-0.6,0.5);if(la>0){c.save();c.globalAlpha*=la;dp_panel(c,1510,456,330,190,{col:"grey",r:16,glowR:20});
        ["02:00 · used","02:01 · used","09:14 · used"].forEach((l,i)=>dp_T(c,l,1540,506+i*46,{w:600,size:28,f:"mono",a:ag_in(tt,T.rec+0.2+i*0.35,0.3)}));c.restore();}
      const da=ag_io(tt,T.ninety-0.2,sc.cues.rector-0.4,0.5);if(da>0){const b=wd_cardAt(c,1490,666,410,{kick:"a deleted key",title:"kept 90 days"},tt,T.ninety-0.2,sc.cues.rector-0.4,{col:"violet"});
        if(b){c.save();c.globalAlpha*=da;const cx=b.x+b.w-70,cy=b.y+b.h/2,r=38;c.strokeStyle="rgba(190,245,245,0.35)";c.lineWidth=6;c.beginPath();c.arc(cx,cy,r,0,TAU);c.stroke();
          c.strokeStyle=rgba(DP.F.violet,1);c.shadowColor=rgba(DP.F.violet,0.8);c.shadowBlur=8;c.beginPath();c.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+TAU*(1-0.25*wd_on(tt,T.ninety+0.4,3)));c.stroke();c.restore();}}}},
    // Ragusa at night: the gate shut, its keys lifted from the lock and carried up the street to the rector's palace
    {at:T.rector-0.3,place:"wdGateNight",keys:[[0,945,600,1.12],[T.shut,945,620,1.2]],d:2.4,push:0,draw:(c,tt)=>{
      const sh=ag_in(tt,T.shut-0.6,1.6);wd_gateLight(c,0.4*(1-sh));wd_gateLantern(c,tt,1);wd_gateDoors(c,1-sh,{lock:true});
      const kb=ag_in(tt,T.shut+0.9,0.6);wd_walker(c,1060,800,1.04,{walk:0,flip:true,carry:"keys",col:[50,52,60],a:kb,light:0.8});
      wd_scr(c,S,()=>wd_tag(c,"Ragusa · at night",ag_in(tt,T.rector,0.5)));}},
    {at:T.street,cut:true,place:"wdStreetNight",keys:[[0,960,580,1.0],[T.street+0.4,960,480,1.3]],d:5.6,push:0,draw:(c,tt)=>{
      wd_streetWindows(c,(i,w)=>i%3===0?0.9:0);
      const u=wd_on(tt,T.street+0.2,T.morning-T.street+0.4),z=lerp(1.1,3.7,ag_sine(u)),p=wd_st(0,0,z,40),closing=ag_in(tt,T.morning+0.4,1.2);
      wd_palace(c,1-0.6*closing,1-closing,ag_in(tt,T.knew-0.6,1.0));
      wd_walker(c,p[0],p[1],1.3/z,{back:true,ph:tt*4.6,carry:"keys",col:[50,52,60],a:1-ag_in(tt,T.morning+0.1,0.6),light:0.5});
      wd_scr(c,S,()=>dp_T(c,"the rector's palace",960,170,{w:700,size:30,align:"center",a:ag_in(tt,T.morning-0.8,0.6)}));}}
  ]);
});

/* ---------------------------------------------------------------- 8 · Copies nobody can delete */
scene("copies",(ctx,S,t,sc)=>{
  const T={first:wAt(sc,"first","deletes the backups"),locks:wAt(sc,"first","locks the data"),money:wAt(sc,"first","asks for money"),night:wAt(sc,"night","every night"),
    apart:wAt(sc,"night","a place apart"),admins:wAt(sc,"night","admins of"),locked:wAt(sc,"locked","locked for"),even:wAt(sc,"locked","not even"),restore:wAt(sc,"restore","restores one"),
    hope:wAt(sc,"restore","a hope"),ways:wAt(sc,"ways","cuts both"),early:wAt(sc,"ways","deleted early"),dmd:wAt(sc,"ways","Deleted means")};
  // the slabs that leave production for the place apart, one each night
  const A=WD_APART,slot=k=>[A.x+76,A.y+A.h-44-k*30],from=[1236,640];
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"wdHall",keys:[[0,1100,500,1.12],[T.first-0.2,1120,500,1.22],[T.night-0.6,1300,560,1.08],[T.restore-0.4,1360,640,1.16],[T.ways-0.4,1500,600,1.22]],d:1.8,push:0,draw:(c,tt)=>{
      const atk=ag_io(tt,T.locks,T.money+1.4,0.5),gone=k=>ag_in(tt,T.first+0.3+k*0.25,0.3)*(1-ag_in(tt,T.money+1.4,0.6)),newA=ag_in(tt,T.night,0.8);
      const s=wd_state(8,{apart:newA,apartLabel:ag_in(tt,T.apart,0.5)},{copies:1-ag_in(tt,T.night+1.2,0.8),admin:1-ag_in(tt,T.night+1.2,0.8),prodCoral:atk});
      // the attacker's first move: each copy taken, one by one (each crossed and gone, then all back)
      s.block.crack=0;wd_hallWorld(c,tt,s);
      for(let k=0;k<6;k++){const g=gone(k);if(g<=0)continue;const y=820-k*24-8;c.save();c.globalAlpha*=g;c.fillStyle="rgba(8,18,22,0.92)";c.fillRect(1230,y-12,136,22);c.restore();dp_cross(c,1220,y,"coral",g);}
      wd_pillAt(c,1236,150,"locked: pay to unlock","coral",tt,T.locks+0.3,T.money+1.4);
      wd_cardAt(c,1480,480,400,{title:"what an attacker does first"},tt,T.money+1.6,T.night-0.4,{col:"coral"});
      // every night, a copy goes to the place apart, and is locked thirty days; the next night's follows
      for(let k=0;k<3;k++){const t0=T.night+0.8+k*(k<2?3.2:2.6),u=wd_on(tt,t0,2.2);if(u<=0)continue;const q=ag_sine(u),p=slot(k),x=lerp(from[0],p[0],q),y=lerp(from[1],p[1],q)-Math.sin(Math.PI*q)*120;
        wd_slab(c,x,y,{locked:ag_in(tt,T.locked+k*1.6,0.4)*(k===0||u>=1?1:0)});}
      wd_pillAt(c,A.x+A.w/2,A.y+A.h+76,"locked 30 days","coral",tt,T.locked+0.3,T.early-0.9);
      // not even an admin can delete one before then
      const ta=ag_io(tt,T.even-0.2,T.even+1.6,0.3);if(ta>0){const p=slot(1);dp_cross(c,p[0]+168,p[1]+9,"coral",ta);}
      wd_pillAt(c,A.x+A.w/2,A.y-96,"locked","coral",tt,T.even+0.1,T.even+1.6);
      // once a month, one restored beside production, and checked
      const r=wd_on(tt,T.restore+0.2,1.8),ra=ag_in(tt,T.restore,0.3)*(1-ag_in(tt,T.ways-0.4,0.6));if(ra>0){const p=slot(0),q=ag_sine(r),x=lerp(p[0],1214,q),y=lerp(p[1],690,q)-Math.sin(Math.PI*q)*100;
        c.save();c.globalAlpha*=ra;wd_slab(c,x,y,{w:150});const op=wd_on(tt,T.restore+2.0,0.8);if(op>0){c.save();c.globalAlpha*=op;dp_panel(c,1196,620,180,150,{col:"green",r:14,glowR:20});
          c.fillStyle="rgba(220,245,240,0.6)";for(let i=0;i<4;i++)c.fillRect(1216,648+i*24,120,4);c.restore();}c.restore();}
      wd_pillAt(c,1286,598,"restored · checked","green",tt,T.restore+2.6,T.ways-0.4);
      // the lock cuts both ways
      wd_pillAt(c,A.x+A.w/2,A.y+A.h+76,"can't be deleted early","coral",tt,T.early-0.4,null);
      wd_cardAt(c,1056,880-240,440,{kick:"comes back in",title:"Deleted means deleted"},tt,T.dmd,null,{col:"violet",behind:false});}}
  ]);
});

/* ---------------------------------------------------------------- 9 · The walk again */
scene("again",(ctx,S,t,sc)=>{
  const T={walks:wAt(sc,"walks","Sam walks"),more:wAt(sc,"walks","once more"),nodoor:wAt(sc,"nodoor","no door"),stolen:wAt(sc,"stolen","With a stolen"),one:wAt(sc,"stolen","that one person"),
    checks:wAt(sc,"stolen","catalog's checks"),back:wAt(sc,"no","No back door"),send:wAt(sc,"no","nowhere to send"),key:wAt(sc,"no","no key"),copy:wAt(sc,"no","no copy"),
    ragusa:wAt(sc,"ragusa","Ragusa stayed"),gates:wAt(sc,"ragusa","a few gates"),open:wAt(sc,"open","stays open"),need:wAt(sc,"open","that need it"),few:wAt(sc,"few","Few doors")};
  const A=WD_APART;
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"wdHall",keys:[[0,1500,600,1.22],[0.4,960,540,1.0],[T.stolen-0.4,1146,470,1.24],[T.back-0.4,960,540,1.0]],d:1.8,push:0,draw:(c,tt)=>{
      const s=wd_state(9,{corLabel:1-ag_in(tt,T.back-0.8,0.5)},{});wd_hallWorld(c,tt,s);wd_samHall(c,tt,ag_in(tt,0.2,0.8)*(1-ag_io(tt,T.stolen-0.7,T.back-0.5,0.5)));
      // from the open internet: no door to find
      wd_walk(c,[[180,600],[300,480],[452,400]],wd_on(tt,T.more,1.4),{a:1-ag_in(tt,T.stolen-0.6,0.5),head:true});
      wd_pillAt(c,330,560,"no door","coral",tt,T.nodoor,T.stolen-0.6);
      // a stolen way in: only what that one person may reach, in one room, through production's ring: a tick, and the rule's values hidden
      const pr=wd_roomBox(2,1),pcx=pr.x+pr.w/2,sa=ag_in(tt,T.stolen,0.4)*(1-ag_in(tt,T.back-0.6,0.5));if(sa>0){c.save();c.globalAlpha*=sa;wd_mini(c,1520,390,"person","coral",0.8);
        wd_walk(c,[[1490,392],[1408,392],[1400,500]],wd_on(tt,T.one-0.6,1.4),{head:true});wd_request(c,pcx,wd_on(tt,T.checks-0.6,1.6),{k:62/WD_CT.rx,rule:true});c.restore();}
      // and nothing more: each way it tries, stopped
      const stops=[[T.back,[1132,640],"shut",[WD_SD.x+WD_SD.w/2,532]],[T.send,[300,190],"not on the list",[WD_THREAD[1][0]-6,WD_THREAD[1][1]]],
        [T.key,[WD_VAULT.x+WD_VAULT.w/2,WD_VAULT.y+WD_VAULT.h+30],"not yours",[WD_VAULT.x+30,WD_VAULT.y+WD_VAULT.h-20]],[T.copy,[A.x+A.w/2,A.y+A.h+76],"locked",[A.x+40,A.y+A.h-60]]];
      const end=T.ragusa-0.6;stops.forEach(([t0,p,word,at])=>{const a=1-ag_in(tt,end,0.5);if(a<=0)return;c.save();c.globalAlpha*=a;wd_walk(c,[[at[0]-60,at[1]+60],at],wd_on(tt,t0-0.3,0.4),{head:true});c.restore();
        wd_pillAt(c,p[0],p[1],word,"coral",tt,t0,end);});}},
    // Ragusa at dawn: the gates open, ships in the harbour, officers with lanterns at each gate
    {at:T.ragusa-0.4,place:"wdRagusaDawn",keys:[[0,960,560,1.08],[T.gates,1060,600,1.16]],d:3,push:0,draw:(c,tt)=>{
      WD_GATES.forEach(([x,y,w,h],i)=>{const a=ag_in(tt,T.ragusa+0.2+i*0.5,0.8);c.save();c.beginPath();wd_archPath(c,x,y,w,h);c.clip();c.fillStyle=rgba(WD.lamp,0.5*a);c.fillRect(x,y-h,w,h);c.restore();
        wd_walker(c,x+w+14,y+2,0.3,{walk:0,carry:"lantern",hood:false,light:1,col:[44,52,64],flip:i===2});});
      wd_ship(c,1450,786,0.3,{t:tt,seed:1});wd_ship(c,1340,792,0.26,{t:tt,seed:2,flip:true});
      for(const [i,x0,y0,s] of [[0,1560,800,0.34],[1,1640,812,0.3]]){const u=ag_eo(wd_on(tt,T.ragusa+0.6+i*0.8,4));wd_ship(c,lerp(x0+520,x0,u),y0,s,{t:tt,seed:5+i,flip:true,sail:1-0.8*u});}
      wd_scr(c,S,()=>wd_tag(c,"Ragusa · 1377",ag_in(tt,T.ragusa,0.5)));}},
    // the university's data, open to the people and jobs that need it; the network's name leaves as the end card comes in, so the end
    // card's line, on the same row, has it to itself
    {at:T.open-0.4,place:"wdHall",keys:[[0,1180,420,1.1]],push:0.03,draw:(c,tt)=>{const s=wd_state(9,{flow:1,corLabel:1-ag_in(tt,T.few-0.4,0.8)},{lit:(e,i)=>e===2?0.45+0.35*Math.sin(tt*1.4+i):0.2});wd_hallWorld(c,tt,s);}}
  ]);
  dp_end(ctx,S,t,T.few-0.4,"Walls, doors and keys",null,"Film 3 of 9","Locks before the data");
  const la=ag_in(t,T.few-0.4+0.6,0.9);if(la>0){setScreen(ctx,S);dp_T(ctx,"Few doors, each with a lock you can see.",960,360,{w:700,size:48,align:"center",a:la});}
  const na=ag_in(t,T.few+1.6,0.6);if(na>0){setScreen(ctx,S);dp_T(ctx,"Next: Power you switch on",960,790,{w:600,size:30,align:"center",col:"mut",a:na});}
});

// chapters that open on what the one before ends on: in the hall, the camera glides on; from the hall to the board, a cut (Sam is in both)
ag_cutInto(["inside","who","doors","again"]);
