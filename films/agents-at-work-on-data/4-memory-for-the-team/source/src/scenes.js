/* ===== Memory: from one chat to the team: the scenes =====
   Seven chapters, each timed to its narration: wAt(sc, "line", "word") is the moment a word is said. The opening's places are
   painted once (places.js), the lab's pieces drawn by memory.js; tm_shots glides the camera, carrying it from shot to shot in one place, and dissolves from one shot to the next,
   or cuts (cut: true) where both show the same people, things or words. A place's tag is drawn in screen space inside its shot, so
   it dissolves with it. People keep their arms down; a hand rises only to hold the thing the story is about (a report form). */

// in screen space, whatever the camera is doing
function tm_scr(ctx,S,fn){ctx.save();setScreen(ctx,S);fn();ctx.restore();}
// The film's cutting of a chapter into shots: the module's ag_shots, with the camera carried, as More than a junior does. A shot in the
// same place as the one before, unless it comes in on a cut, starts where that one's camera ended and glides from there to its own
// keys; while it dissolves in, the shot before is drawn through the same camera, so only what changed fades in, and the place never
// shows twice, a little apart.
function tm_camEnd(sh,till){const len=Math.max(1.5,till-sh.at),push=(sh.push==null?0.025:sh.push)*easeCam(clamp((till-sh.at)/len,0,1)),d=Math.max(1.4,sh.d||1.6),keys=sh.keys||[[0,960,540,1]];
  let x=keys[0][1],y=keys[0][2],z=keys[0][3];for(let i=1;i<keys.length;i++){const u=easeCam(clamp((till-keys[i][0])/d,0,1));if(u<=0)break;x=lerp(x,keys[i][1],u);y=lerp(y,keys[i][2],u);z=lerp(z,keys[i][3],u);}
  z=Math.max(1,z*(1+push));return[clamp(x,960/z,W-960/z),clamp(y,540/z,H-540/z),z];}
function tm_shots(ctx,S,t,end,shots,dis){
  for(let k=1;k<shots.length;k++){const a=shots[k-1],b=shots[k];if(b.cut||a.place!==b.place)continue;
    const e=tm_camEnd(a,b.at),own=(b.keys||[[b.at,960,540,1]]).map(q=>[Math.max(q[0],b.at),q[1],q[2],q[3]]);b.keys=[[b.at,e[0],e[1],e[2]]].concat(own);b.carried=true;}
  let i=0;for(let k=1;k<shots.length;k++)if(t>=shots[k].at)i=k;dis=dis==null?0.5:dis;
  const u=i>0&&!shots[i].cut?clamp((t-shots[i].at)/dis,0,1):1,till=k=>shots[k+1]?shots[k+1].at:end;
  if(u<1){const a=shots[i-1],b=shots[i];ag_shot(ctx,S,t,b.carried?Object.assign({},a,{at:b.at,keys:b.keys,d:b.d,push:b.push}):a,b.carried?till(i):b.at);
    const [bc,bx]=ag_buf("cut",ctx.canvas.width,ctx.canvas.height);ag_shot(bx,S,t,b,till(i));
    ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=ease(u);ctx.drawImage(bc,0,0);ctx.restore();setScreen(ctx,S);}
  else ag_shot(ctx,S,t,shots[i],till(i));return i;}
// a pill that springs in at t0 and fades out at t1
function tm_pillAt(ctx,x,y,text,t,t0,t1,o){const a=ag_in(t,t0,0.35)*(t1==null?1:1-ag_in(t,t1,0.5));if(a<=0)return;const k=ag_spr(t,t0,0.45);
  ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x,y,lerp(0.7,1,clamp(k,0,1.2)));ag_pill(ctx,x,y,text,o||{});ctx.restore();}
// a card that springs in at t0 and fades at t1
function tm_cardAt(ctx,x,y,w,words,t,t0,t1,o){o=o||{};const a=ag_in(t,t0,0.4)*(t1==null?1:1-ag_in(t,t1,0.5));if(a<=0)return null;
  return ag_textCard(ctx,x,y,w,words,Object.assign({},o,{a,k:Math.min(1,ag_spr(t,t0,0.5))}));}
// a pill with an arrow after it, pointing the way
function tm_dir(ctx,x,y,text,t,t0){const a=ag_in(t,t0,0.4);if(a<=0)return;const b=ag_pill(ctx,x,y,text,{a,size:28});ctx.save();ctx.globalAlpha*=a;
  const ax=b.x+b.w+22+Math.sin(t*2)*3;ctx.strokeStyle=rgba(AG.ink,0.8);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(ax-18,y);ctx.lineTo(ax+6,y);ctx.stroke();
  ag_arrowHead(ctx,ax+10,y,0,12,rgba(AG.ink,0.8));ctx.restore();}
// where a person's near hand is on screen, from the hands ag_person returns (figure space)
function tm_hand(x,y,s,flip,h){return[x+(flip?-1:1)*(h[0]-AG_FIG.anchor[0])*s,y+(h[1]-AG_FIG.anchor[1])*s];}
// an envelope, a small alert sheet, a report on its way: small papers that fly
function tm_envelope(ctx,x,y,s,rot,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(rot||0);ctx.scale(s,s);
  ctx.save();ctx.shadowColor="rgba(40,30,20,0.25)";ctx.shadowBlur=10;ctx.shadowOffsetX=-3;ctx.shadowOffsetY=5;ctx.fillStyle="#EFE7D2";ctx.fillRect(-60,-38,120,76);ctx.restore();
  ctx.strokeStyle="rgba(120,104,80,0.6)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-60,-38);ctx.lineTo(0,6);ctx.lineTo(60,-38);ctx.stroke();ctx.restore();}
function tm_alertMini(ctx,x,y,s,rot,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(rot||0);ctx.scale(s,s);
  ctx.save();ctx.shadowColor="rgba(40,30,20,0.25)";ctx.shadowBlur=10;ctx.shadowOffsetX=-3;ctx.shadowOffsetY=5;ctx.fillStyle="#F7F4EA";ctx.fillRect(-50,-64,100,128);ctx.restore();
  ctx.fillStyle="rgba(70,76,86,0.9)";ctx.fillRect(-50,-64,100,22);ctx.strokeStyle="rgba(70,76,86,0.9)";ctx.lineWidth=3;ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(-34,-14);ctx.lineTo(-24,-32);ctx.lineTo(-14,-14);ctx.closePath();ctx.stroke();
  ctx.fillStyle="rgba(70,66,60,0.45)";for(let m=0;m<5;m++)ctx.fillRect(m<1?-4:-40,-26+m*15,m<1?44:80-(m%3)*14,5);ctx.restore();}
// a card of numbers that matter, one line after another: lines [[text, at]], o.kick, o.sub (and its time, o.subAt)
function tm_tally(ctx,x,y,w,lines,t,o){o=o||{};const a=ag_in(t,lines[0][1]-0.3,0.4);if(a<=0)return;const h=AG_PAD*2+40+lines.length*56+(o.sub?44:0);
  ctx.save();ctx.globalAlpha*=a;ag_box(ctx,x,y,w,h,24,{});ag_T(ctx,String(o.kick||"").toUpperCase(),x+AG_PAD,y+AG_PAD+26,{w:700,size:28,ls:4,col:AG.kick});
  lines.forEach((l,i)=>{const la=ag_in(t,l[1],0.4);if(la>0)ag_T(ctx,l[0],x+AG_PAD,y+AG_PAD+92+i*56,{w:800,size:40,a:la,col:AG.ink});});
  if(o.sub){const sa=ag_in(t,o.subAt||lines[0][1],0.4);if(sa>0)ag_T(ctx,o.sub,x+AG_PAD,y+h-AG_PAD-6,{w:500,size:28,col:AG.mut,a:sa});}ctx.restore();}
// the crew rooms of 1974, framed: the warning pinned in one room, and the way to the others that stops at the wall
function tm_crewPic(ctx,x,y,w,h,o){o=o||{};ag_picture(ctx,x,y,w,h,{img:ag_place("tmCrew"),a:o.a,draw:(c,X,Y,Wd,Hd)=>{c.save();c.translate(X,Y);c.scale(Wd/W,Hd/H);
  const n=tm_notice(c,0,{kind:"notice"}),rB=TM_ROOMS[1],B=TM_BOARD;if(n)tm_link(c,n.x+n.w,n.y+60,rB.x+B.dx+40,B.y+60,1,{col:AG.mut,stop:0.17,lift:40,w:9});c.restore();}});}
// a short sample of a path's line, on the card that names it: solid, or dashed (dash)
function tm_sample(ctx,x,y,a,dash){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=dash?rgba([118,110,98],1):rgba(TM.ink,0.95);ctx.lineWidth=dash?3.5:4.5;ctx.lineCap="round";
  if(dash)ctx.setLineDash(dash);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+72,y);ctx.stroke();ctx.restore();}
// the registrar's office: the lab's marble and oak, another stretch of the wall
AG_PLACES.tmOffice=c=>ag_paintLab(c,{seed:3});

/* ---------------------------------------------------------------- 1 · Cleared for the approach */
scene("approach",(ctx,S,t,sc)=>{
  const T={place:wAt(sc,"place","Virginia"),cloud:wAt(sc,"cloud","passenger jet"),dulles:wAt(sc,"cloud","Dulles"),
    cleared:wAt(sc,"cleared","controller",-0.5),clears:wAt(sc,"cleared","clears"),
    crew:wAt(sc,"crew","To the crew",-0.4),down:wAt(sc,"crew","go down"),ft:wAt(sc,"crew","eighteen"),ctrl:wAt(sc,"ctrl","controllers"),
    ridge:wAt(sc,"ridge","ridge"),struck:wAt(sc,"died","struck"),
    before:wAt(sc,"before","Six weeks",-0.4),same:wAt(sc,"before","same words"),missed:wAt(sc,"before","narrowly missed"),
    warned:wAt(sc,"warned","warned"),share:wAt(sc,"warned","share"),pilot:wAt(sc,"punish","pilot"),punished:wAt(sc,"punish","punished"),change:wAt(sc,"punish","Something had to change"),
    y76:wAt(sc,"y1976","In nineteen",-0.3),every:wAt(sc,"y1976","every pilot"),ctl:wAt(sc,"y1976","controller"),mech:wAt(sc,"y1976","mechanic"),
    confide:wAt(sc,"confide","in confidence"),honest:wAt(sc,"confide","honest mistake"),
    nasa:wAt(sc,"nasa","NASA",-0.4),power:wAt(sc,"nasa","no power to punish"),read:wAt(sc,"nasa","read every report"),names:wAt(sc,"nasa","took out the names"),
    sent:wAt(sc,"sent","sent"),reach:wAt(sc,"reach","Now",-0.4),everyCrew:wAt(sc,"reach","every crew"),
    reports:wAt(sc,"count","two point three"),alerts:wAt(sc,"count","eight thousand"),
    uni:wAt(sc,"stakes","At the university",-0.3),chat:wAt(sc,"chat","one person's agent"),stays:wAt(sc,"chat","stays"),
    colleague:wAt(sc,"chat","colleague's agent"),mistake:wAt(sc,"chat","same mistake"),team:wAt(sc,"team","Memory"),everyAgent:wAt(sc,"team","every agent")};
  const strobe=tt=>Math.max(0,1-Math.abs((((tt%1.3)+1.3)%1.3)-0.06)/0.06);
  tm_shots(ctx,S,t,sc.dur,[
    // Virginia, December 1974: low cloud over the hills, rain and wet snow; the jet comes out of the cloud, on towards Dulles
    {at:0,place:"tmSky",keys:[[0,1000,520,1.1],[0.6,960,540,1.0]],d:7,draw:(c,tt)=>{
      tm_clouds(c,tt,1,{y:300,h:260,n:12,seed:3,speed:30,k:1.1});
      const u=clamp((tt-(T.cloud-0.6))/9.6,0,1);if(u>0)tm_jet(c,lerp(-220,1520,u),lerp(330,432,u),1.0,{tilt:0.045,strobe:strobe(tt)});
      tm_clouds(c,tt,0.8,{y:390,h:200,n:9,seed:7,speed:56,k:0.9});tm_rain(c,tt,0.9,{snow:0.6});
      tm_scr(c,S,()=>{tm_tag(c,"Virginia · 1 December 1974",ag_in(tt,0.6,0.6));tm_dir(c,1560,250,"to Dulles airport",tt,T.dulles-0.1);});}},
    // the approach control room: the controller at the scope, the jet's blip coming in
    {at:T.cleared,place:"tmRadar",keys:[[0,1080,480,1.14],[T.cleared+0.3,1040,470,1.06]],d:4,draw:(c,tt)=>{
      tm_scope(c,tt,{u:lerp(0.35,0.8,clamp((tt-T.cleared)/6,0,1))});
      tm_lit(c,bx=>ag_person(bx,TM_P.ctrl,780,604,1.0,{t:tt,cut:758,gaze:[3,0]}));
      tm_scr(c,S,()=>tm_cardAt(c,64,110,640,{kick:"The controller",title:"Cleared for the approach",sub:"the last stretch down to the runway"},tt,T.clears-0.1,null,{kickCol:AG.kick}));}},
    // the approach side on: two readings of the same words; the cloud hides the ridge; the path stops where it meets it
    {at:T.crew,place:"tmProfile",keys:[[0,960,520,1.04],[T.crew+0.2,960,540,1.0]],d:3,push:0.015,draw:(c,tt)=>{
      const P0=TM_PRO,jet=[P0.start,[P0.down[0],P0.start[1]],[P0.down[1],P0.y1800],P0.impact],fa=ag_in(tt,T.ft-0.4,0.6);
      if(fa>0){c.save();c.globalAlpha*=fa;c.strokeStyle=rgba(TM.ink,0.28);c.lineWidth=2;c.setLineDash([6,10]);c.beginPath();c.moveTo(60,P0.y1800);c.lineTo(1520,P0.y1800);c.stroke();c.setLineDash([]);
        ag_T(c,"1,800 feet",70,P0.y1800-18,{w:700,size:28,col:AG.mut});c.restore();}
      tm_proPath(c,P0.chart,ag_sine(clamp((tt-T.ctrl)/2.6,0,1)),{dash:[14,11],col:[118,110,98],w:3.5});
      tm_proCloud(c,tt,lerp(1,0.3,ag_in(tt,T.ridge-0.4,1.2)));
      const u=ag_keys(tt,[[T.crew+0.3,0],[T.down,0.16],[T.ft+0.6,0.7],[T.struck,1]],x=>x),tip=tm_proPath(c,jet,u,{w:4.5}),ja=1-ag_in(tt,T.struck+0.05,0.35);
      if(u>0&&ja>0)tm_jet(c,tip.x,tip.y,0.3,{tilt:tip.a,a:ja});
      if(tt>=T.struck){c.strokeStyle=rgba(TM.ink,0.9);c.lineWidth=3;c.beginPath();c.arc(P0.impact[0],P0.impact[1],10,0,TAU);c.stroke();}
      // each card with a sample of its line: the crew's path solid, the chart's heights dashed
      const cw=tm_cardAt(c,500,150,560,{kick:"The crew",title:"Down at once, to 1,800 feet"},tt,T.crew+0.4,null,{kickCol:AG.kick});
      if(cw)tm_sample(c,cw.x+cw.w-108,cw.y+40,ag_in(tt,T.crew+0.4,0.4),null);
      const cc=tm_cardAt(c,1110,170,600,{kick:"The controllers",title:"Keep to the chart's heights"},tt,T.ctrl+0.2,null,{kickCol:AG.kick});
      if(cc)tm_sample(c,cc.x+cc.w-108,cc.y+40,ag_in(tt,T.ctrl+0.2,0.4),[14,11]);
      tm_pillAt(c,P0.ridge.x+40,560,"a ridge, in the cloud",tt,T.ridge,null);tm_pillAt(c,1660,740,"Dulles",tt,T.crew+0.6,null);
      tm_scr(c,S,()=>tm_tag(c,"Side view · not to scale",ag_in(tt,T.crew+0.3,0.6)));}},
    // six weeks before: another crew, the same words, the same ridge, narrowly missed
    {at:T.before,place:"tmSky",keys:[[0,1160,600,1.5],[T.before+0.4,1180,600,1.44]],d:6,push:0.01,draw:(c,tt)=>{
      tm_clouds(c,tt,0.55,{y:560,h:160,n:12,seed:11,speed:24,k:0.9});
      const crest=tm_ridgeY(TM_RIDGE.x,2),jx=TM_RIDGE.x+(tt-(T.missed-0.3))*184;tm_jet(c,jx,crest-44+(jx-TM_RIDGE.x)*0.04,0.6,{tilt:0.04,strobe:strobe(tt)});
      tm_clouds(c,tt,0.4,{y:640,h:120,n:8,seed:13,speed:40,k:0.8});tm_rain(c,tt,0.55,{snow:0.3});
      tm_pillAt(c,TM_RIDGE.x,crest+90,"narrowly missed",tt,T.missed,null);
      tm_scr(c,S,()=>{tm_tag(c,"Virginia · October 1974",ag_in(tt,T.before+0.5,0.6));
        tm_cardAt(c,64,140,600,{kick:"Six weeks before",title:"The same words, taken the same way"},tt,T.same-0.2,null,{kickCol:AG.kick});});}},
    // three crew rooms: one airline warns its own pilots; there's no way to the others; a report could bring a penalty
    {at:T.warned-0.6,place:"tmCrew",keys:[[0,330,580,1.6],[T.share-0.7,330,580,1.6],[T.share+0.1,960,540,1.0]],d:2.4,push:0,draw:(c,tt)=>{
      const rA=TM_ROOMS[0],rB=TM_ROOMS[1],B=TM_BOARD,m=ag_in(tt,T.pilot-0.6,0.7);
      ag_person(c,TM_P.pilot,rA.x+180,800,0.62,{t:tt,gaze:[3,-2]});
      ag_person(c,TM_P.pilot2,rB.x+180,800,0.62,{t:tt+2,gaze:[3,-1],pose:"hang",pose2:"hold",mix:m,hold:(c2,h)=>tm_form(c2,h.near[0]-30,h.near[1]-250,{a:clamp(m*2-0.6,0,1),rot:-0.08})});
      const n=tm_notice(c,0,{kind:"notice",p:clamp((tt-T.warned-0.1)/0.5,0,1)});
      tm_pillAt(c,rA.x+B.dx+B.w/2,B.y-52,"to its own pilots",tt,T.warned+0.5,T.pilot-0.5);
      if(n)tm_link(c,n.x+n.w,n.y+60,rB.x+B.dx+40,B.y+60,ag_sine(clamp((tt-T.share)/1.2,0,1)),{col:AG.mut,stop:0.17,lift:40});
      tm_pillAt(c,740,440,"no way to share it",tt,T.share+0.7,T.pilot-0.5);
      tm_pillAt(c,rB.x+300,350,"report a mistake, risk a penalty",tt,T.punished,null);
      tm_scr(c,S,()=>{tm_tag(c,"Crew rooms · 1974",ag_in(tt,T.warned,0.6));ag_veil(c,S,0.3*ag_in(tt,T.change,0.9));});}},
    // 1976: every pilot, controller and mechanic can report, in confidence; the forms go off in envelopes
    {at:T.y76,cut:true,place:"tmCrew",keys:[[0,960,540,1.0]],push:0.02,draw:(c,tt)=>{
      const who=[TM_P.pilot,TM_P.ctrl76,TM_P.mech],lab=["pilot","controller","mechanic"],at=[T.every,T.ctl,T.mech];
      TM_ROOMS.forEach((r,i)=>{const x=r.x+180,y=800,s=0.62,go=T.confide-0.3+i*0.25,m=1-ag_in(tt,go,0.7);
        const h=ag_person(c,who[i],x,y,s,{t:tt+i,gaze:[3,-1],pose:"hang",pose2:"hold",mix:m,hold:(c2,hh)=>{if(m>0.05)tm_form(c2,hh.near[0]-30,hh.near[1]-250,{a:clamp(m*2-1,0,1),rot:-0.08});}});
        // the envelope: from the hand, off to the right
        const u=clamp((tt-go)/1.4,0,1);if(u>0&&u<1&&h){const p=tm_hand(x,y,s,false,h.near),e=ag_sine(u);tm_envelope(c,lerp(p[0]+40,2040,e),lerp(p[1]-80,280,e)-Math.sin(e*Math.PI)*90,0.8,0.1-0.2*e,1);}
        tm_pillAt(c,r.x+330,230,lab[i],tt,at[i],null);});
      tm_pillAt(c,960,330,"in confidence",tt,T.confide,null,{icon:"lock"});tm_pillAt(c,960,404,"an honest mistake: no penalty",tt,T.honest,null);
      tm_scr(c,S,()=>tm_tag(c,"United States · 1976",ag_in(tt,T.y76+0.3,0.5)));}},
    // the reporting system's office: an analyst reads each report and takes the strip with the name off; the alerts go out
    {at:T.nasa,place:"tmNasa",keys:[[0,980,500,1.1],[T.nasa+0.3,960,540,1.0]],d:3,draw:(c,tt)=>{
      const strip=clamp((tt-(T.names-0.1))/1.6,0,1);
      // reports arriving, into the tray on the desk
      for(let k=0;k<4;k++){const u=clamp((tt-(T.nasa+0.2+k*0.35))/1.0,0,1);if(u>0&&u<1){const e=ag_sine(u);tm_envelope(c,lerp(-120,520,e),lerp(300,720,e)-Math.sin(e*Math.PI)*60,0.7,0.2-0.2*e,1);}}
      ag_person(c,TM_P.analyst,820,566,1.0,{t:tt,cut:766,pose:"hold",gaze:[3,1],hold:(c2,h)=>tm_form(c2,h.near[0]-20,h.near[1]-260,{strip,rot:-0.06})});
      tm_desk76(c);
      const nIn=Math.min(4,Math.floor(clamp((tt-T.nasa-1.2)/0.35,0,4)));for(let k=0;k<2+nIn;k++){c.fillStyle=k%2?"#EFE7D2":"#F6F3E9";c.fillRect(420+(k%3)*3,756-k*5,200,8);}
      for(let k=0;k<3;k++){const u=clamp((tt-(T.sent+0.1+k*0.3))/1.5,0,1);if(u>0&&u<1){const e=ag_sine(u);tm_alertMini(c,lerp(1080,-140,e),lerp(730,360+k*60,e)-Math.sin(e*Math.PI)*80,0.9,-0.15+0.3*e,1);}}
      tm_pillAt(c,960,120,"no power to punish",tt,T.power,null);tm_pillAt(c,1250,270,"names taken out",tt,T.names+0.9,null);
      tm_pillAt(c,560,560,"safety alerts",tt,T.sent+0.4,null);
      tm_scr(c,S,()=>tm_tag(c,"NASA · California · 1976",ag_in(tt,T.nasa+0.3,0.5)));}},
    // every crew room: the same alert on every board; fifty years of it
    {at:T.reach,place:"tmCrew",keys:[[0,960,540,1.0]],push:0.02,draw:(c,tt)=>{
      const who=[TM_P.pilot,TM_P.ctrl76,TM_P.mech];
      TM_ROOMS.forEach((r,i)=>{ag_person(c,who[i],r.x+180,800,0.62,{t:tt+i,gaze:[3,-2]});tm_notice(c,i,{kind:"alert",p:clamp((tt-(T.everyCrew-0.4+i*0.25))/0.5,0,1)});});
      tm_scr(c,S,()=>{tm_tag(c,"United States · 1976 to 2025",ag_in(tt,T.reach+0.3,0.5));
        tm_tally(c,560,90,800,[["More than 2.3 million reports",T.reports],["More than 8,000 safety alerts",T.alerts]],tt,{kick:"In fifty years",sub:"April 1976 to December 2025",subAt:T.alerts+0.6});});}},
    // the university: what one person's agent learns stays in that chat; a colleague's agent repeats the mistake; memory the team shares
    // (under the title card's veil the scene fades, so only the title's words show)
    {at:T.uni,place:"lab",keys:[[0,960,520,1.04],[T.uni+0.3,960,540,1.0]],d:2.4,draw:(c,tt)=>{const f=1-ag_in(tt,sc.cues.breath+0.4,0.8);if(f<=0)return;c.save();c.globalAlpha*=f;
      const A=[560,540],Bp=[1360,540],fileA=ag_in(tt,T.team-0.2,0.6),fixed=ag_in(tt,T.everyAgent+0.6,0.5);
      tm_agent(c,A[0],A[1],72,tt,{label:"Jun's agent",core:0.8,a:ag_in(tt,T.chat-0.4,0.6)});tm_agent(c,Bp[0],Bp[1],72,tt+1.3,{label:"A colleague's agent",core:0.7,a:ag_in(tt,T.colleague-0.3,0.6)});
      ag_roomLight(c,1);
      // far less at stake, but lost the same way: the crew rooms of 1974, framed, the warning pinned in one room
      tm_crewPic(c,660,190,600,338,{a:ag_in(tt,T.uni+0.8,0.6)*(1-ag_in(tt,T.chat-0.5,0.5))});
      // the chat, and what it learned, with Jun's agent only
      const sa=ag_in(tt,T.chat-0.1,0.5);if(sa>0)tm_session(c,90,120,470,210,{a:sa,k:Math.min(1,ag_spr(tt,T.chat-0.1,0.5)),sub:"one chat",draw:x=>{
        ag_T(x,"LESSON",120,236,{w:700,size:28,ls:3,col:AG.violet});ag_lines(x,["Read status as it was","on census day"],120,280,38,{w:600,size:30});}});
      tm_link(c,A[0]+150,A[1],Bp[0]-150,Bp[1],ag_sine(clamp((tt-T.stays)/1.2,0,1)),{col:AG.mut,stop:0.42,lift:60,a:1-fileA});
      const mA=ag_in(tt,T.mistake,0.4);if(mA>0){if(fixed<1)ag_pill(c,1660,420,"18,375",{col:AG.amber,icon:"warn",a:mA*(1-fixed)});if(fixed>0)ag_pill(c,1660,420,"18,412",{col:AG.green,icon:"tick",a:fixed});}
      // the team's memory, outside any chat, read by both
      const cards=[{title:"Students, not enrolments",ok:true},{title:"Status as on census day",ok:true,glow:ag_io(tt,T.everyAgent,T.everyAgent+2,0.5)},{title:"Show the count reported",ok:true}];
      // the team's memory, clear of the chat's card; both agents read it from its middle card
      const fx=600,mx=fx+22+(TM_CARD.w+TM_CARD.gap)+TM_CARD.w/2;tm_file(c,fx,300,{cards,a:fileA,k:Math.min(1,ag_spr(tt,T.team-0.2,0.5))});
      for(const [i,p] of [[0,A],[1,Bp]])tm_link(c,mx,336,p[0],p[1]-140,ag_sine(clamp((tt-T.everyAgent-i*0.3)/1.0,0,1)),{t:tt,a:fileA});
      tm_scr(c,S,()=>tm_tag(c,"The university · 2026",ag_in(tt,T.uni+0.6,0.5)));c.restore();}}
  ],0.8);
  ag_title(ctx,S,t,sc.cues.breath,"Memory: from one chat to the team",null,"FILM 4 OF 9 · AGENTS AT WORK ON DATA");
});

/* ---------------------------------------------------------------- 2 · One chat */
const TM_LAB={jun:[300,644],agent:[790,430],sess:[1150,96,710,760]};
scene("onechat",(ctx,S,t,sc)=>{
  const T={april:wAt(sc,"april","April"),asks:wAt(sc,"april","Jun asks"),answers:wAt(sc,"short","answers"),short:wAt(sc,"short","thirty-seven short"),
    withdrawn:wAt(sc,"why","withdrawn"),mei:wAt(sc,"mei","Jun asks Mei",-0.3),office:wAt(sc,"mei","registrar's office"),count:wAt(sc,"mei","They count"),
    again:wAt(sc,"again","counts again"),lesson:wAt(sc,"lesson","The lesson"),own:wAt(sc,"own","memory of its own"),goes:wAt(sc,"own","the lesson goes there"),
    stays:wAt(sc,"stays","stays"),oneChat:wAt(sc,"stays","one chat"),notes:wAt(sc,"notes","notes for agents"),hand:wAt(sc,"notes","kept by hand"),stops:wAt(sc,"notes","stops to write"),busy:wAt(sc,"notes","busy week")};
  const L=TM_LAB,[sx,sy,sw,sh]=L.sess;
  const rows=[{at:T.asks,who:"jun",text:"How many students were studying on census day?"},
    {at:T.answers,who:"agent",text:"18,375 students",size:36},
    {at:T.short,pill:{text:"Reported: 18,412 · 37 short",col:AG.amber,icon:"warn"},gone:T.again-0.2},
    {at:T.withdrawn,who:"why",text:"37 withdrew after census day. Their status was read as it is today.",gone:T.again-0.2},
    {at:T.again+0.2,who:"agent",text:"18,412 students",size:36,pill:{text:"Matches the count reported",col:AG.green,icon:"tick"}},
    {at:T.lesson,who:"lesson",text:"Read each student's status as it was on census day, not as it is today.",glow:1}];
  const lab=(c,tt)=>{
    const sessA=1-ag_in(tt,T.stays,0.8),think=ag_io(tt,T.asks+0.6,T.answers,0.4)+ag_io(tt,T.again-0.6,T.again+0.3,0.3);
    ag_person(c,"jun",L.jun[0],L.jun[1],1.0,{t:tt,gaze:tt<T.notes?[3,0]:[3,-1]});
    tm_agent(c,L.agent[0],L.agent[1],84,tt,{label:"Jun's agent",core:0.6+0.3*think,think,busy:think});
    ag_roomLight(c,1);
    if(sessA>0)tm_session(c,sx,sy,sw,sh,{sub:"14 April",a:sessA*ag_in(tt,T.april-0.2,0.5),k:lerp(0.7,1,sessA),draw:x=>tm_rows(x,sx+34,sy+104,sw-68,rows,tt)});
    tm_pillAt(c,1500,820,"Session · 14 April · closed",tt,T.stays+0.6,T.notes-0.3);
    // its own memory, under the agent: the lesson goes there, and only there
    const oa=ag_in(tt,T.own,0.5);if(oa>0)ag_textCard(c,580,690,500,{kick:"Its own memory",sub:"Status as it was on census day"},{kickCol:AG.violet,a:oa,k:Math.min(1,ag_spr(tt,T.own,0.5)),edge:AG.violet,edgeA:0.35});
    const fu=clamp((tt-T.goes+0.3)/1.1,0,1);if(fu>0&&fu<1){const e=ag_sine(fu);c.save();c.globalAlpha*=1-ag_in(fu,0.85,0.15);ag_box(c,lerp(1190,600,e),lerp(640,730,e),lerp(300,200,e),44,12,{edge:AG.violet,edgeA:0.5});c.restore();}
    tm_pillAt(c,L.agent[0],200,"one chat · one agent's memory",tt,T.oneChat,T.notes-0.2,{col:AG.violet});
    // the team's notes, kept by hand: nobody stopped to write it
    const na=ag_in(tt,T.notes-0.2,0.5);if(na>0)tm_notes(c,1200,130,600,{a:na,k:Math.min(1,ag_spr(tt,T.notes-0.2,0.5)),t:tt});
    tm_pillAt(c,1500,500,"only what someone stops to write",tt,T.stops,null);
    const wa=ag_in(tt,T.busy-0.2,0.4);if(wa>0)tm_week(c,1310,580,{a:wa,k:Math.min(1,ag_spr(tt,T.busy-0.2,0.5)),p:clamp((tt-T.busy)/1.4,0,1)});
    tm_scr(c,S,()=>tm_tag(c,"The university · April 2026",ag_in(tt,0.6,0.5)));};
  tm_shots(ctx,S,t,sc.dur,[
    {at:0,place:"lab",keys:[[0,960,540,1.025],[0.8,960,540,1.0]],push:0.02,draw:lab},
    // the registrar's office: Jun asks Mei; they count
    {at:T.mei,cut:true,place:"tmOffice",keys:[[0,960,540,1.04]],push:0.02,draw:(c,tt)=>{
      ag_person(c,"jun",380,644,1.0,{t:tt,gaze:[3,0]});ag_person(c,"mei",1540,644,1.0,{t:tt+1,flip:true,gaze:[3,0]});ag_roomLight(c,1);
      tm_cardAt(c,560,140,560,{kick:"Jun",title:"Do the 37 who withdrew after census day count?"},tt,T.mei+0.4,null,{kickCol:AG.kick,tail:{side:"left",at:0.3,px:520,py:300}});
      tm_cardAt(c,780,430,600,{kick:"Mei · Registrar's office",title:"They count. They were studying on census day."},tt,T.count-0.2,null,{kickCol:AG.kick,tail:{side:"right",at:0.3,px:1420,py:420}});
      tm_scr(c,S,()=>tm_tag(c,"The registrar's office",ag_in(tt,T.mei+0.3,0.5)));}},
    {at:T.again-0.4,cut:true,place:"lab",keys:[[0,960,540,1.0]],push:0.02,draw:lab}],0.8);
});

/* ---------------------------------------------------------------- 3 · Weeks later */
scene("weeks",(ctx,S,t,sc)=>{
  const T={june:wAt(sc,"june","In June"),asks:wAt(sc,"june","asks her own agent"),mode:wAt(sc,"june","by mode of study"),same:wAt(sc,"same","same mistake"),total:wAt(sc,"same","Its total"),
    known:wAt(sc,"knew","would have known"),never:wAt(sc,"knew","never seen"),afternoon:wAt(sc,"afternoon","afternoon"),april:wAt(sc,"afternoon","April"),
    budget:wAt(sc,"budget","budget figures"),nearly:wAt(sc,"budget","nearly went out"),crew:wAt(sc,"back","Like the crew"),stayed:wAt(sc,"back","stayed")};
  const sx=80,sy=170,sw=720,sh=680,ag2=[1080,520];
  const rows=[{at:T.asks,who:"clara",text:"Students on census day, by mode of study?"},
    {at:T.same-0.3,who:"agent",h:190,draw:(x,X,Y,Wd)=>tm_bars(x,X,Y+8,Wd,{p:clamp((t-T.same)/0.9,0,1),total:t>=T.total?"18,375":null})},
    {at:T.total+0.6,pill:{text:"37 short of the count reported",col:AG.amber,icon:"warn"}}];
  tm_shots(ctx,S,t,sc.dur,[{at:0,place:"lab",keys:[[0,960,540,1.0]],push:0.02,draw:(c,tt)=>{
    const noon=ag_in(tt,T.afternoon,2.0)*(1-ag_in(tt,T.budget+1,1.5)),think=ag_io(tt,T.asks+0.6,T.same,0.4);
    ag_person(c,"clara",1600,644,1.0,{t:tt,flip:true,gaze:tt<T.known?[3,0]:[3,-2]});
    tm_agent(c,ag2[0],ag2[1],80,tt,{label:"Clara's agent",core:0.6+0.3*think,think,busy:think});
    // Jun's agent, which learned it in April, out of reach
    const ja=ag_in(tt,T.known-0.3,0.6);if(ja>0)tm_agent(c,1490,190,42,tt+0.7,{a:ja,core:0.75});
    ag_roomLight(c,1);
    if(noon>0){const g=c.createLinearGradient(W,0,W*0.2,H*0.6);g.addColorStop(0,"rgba(255,206,150,"+(0.16*noon)+")");g.addColorStop(1,"rgba(255,206,150,0)");c.fillStyle=g;c.fillRect(0,0,W,H);}
    if(ja>0){c.save();c.globalAlpha*=ja;ag_T(c,"Jun's agent",1370,200,{w:700,size:28,align:"right",col:AG.label});c.restore();
      tm_link(c,1450,250,ag2[0]+110,ag2[1]-120,ag_sine(clamp((tt-T.never+0.2)/1.1,0,1)),{col:AG.mut,stop:0.5,lift:-10});tm_pillAt(c,1660,100,"learned it in April",tt,T.known+0.4,T.budget);}
    const sa=1-ag_in(tt,T.budget-0.4,0.6);if(sa>0)tm_session(c,sx,sy,sw,sh,{sub:"9 June",a:sa*ag_in(tt,T.june-0.2,0.5),draw:x=>tm_rows(x,sx+34,sy+104,sw-68,rows,tt)});
    // an afternoon, finding what one chat had learned
    const ca=ag_io(tt,T.afternoon-0.2,T.budget-0.2,0.4);if(ca>0){const hr=lerp(13,17,clamp((tt-T.afternoon)/3.8,0,1));tm_clock(c,930,170,62,Math.floor(hr),(hr%1)*60,{a:ca,from:13});
      tm_pillAt(c,930,280,"an afternoon",tt,T.afternoon+0.3,T.budget-0.2);}
    // the budget figures, nearly out, thirty-seven students short
    const ba=ag_in(tt,T.budget-0.2,0.5);if(ba>0){const nx=lerp(0,60,ag_sine(clamp((tt-T.nearly)/0.8,0,1)))-lerp(0,60,ag_sine(clamp((tt-T.nearly-1.2)/0.6,0,1)));
      c.save();c.globalAlpha*=ba;c.translate(nx,0);ag_textCard(c,140,200,600,{kick:"Planning",title:"Budget figures",sub:"by mode of study, for next year"},{kickCol:AG.kick});
      tm_stamp(c,440,430,"37 students short",AG.amber,{p:clamp((tt-(T.budget+0.6))/0.4,0,1)});c.restore();tm_pillAt(c,440,560,"nearly went out",tt,T.nearly+0.2,null);}
    // like the crew six weeks before: one person's lesson stayed where it was learned
    const pa=ag_in(tt,T.crew-0.2,0.7);if(pa>0)tm_crewPic(c,790,100,400,225,{a:pa});
    tm_scr(c,S,()=>tm_tag(c,"The university · June 2026",ag_in(tt,0.6,0.5)));}}],0.8);
});

/* ---------------------------------------------------------------- 4 · A session, and what lasts */
scene("kinds",(ctx,S,t,sc)=>{
  const T={y72:wAt(sc,"tulving","In nineteen"),endel:wAt(sc,"tulving","Endel Tulving"),two:wAt(sc,"tulving","two kinds"),epi:wAt(sc,"episodic","Episodic memory"),event:wAt(sc,"episodic","an event"),
    sem:wAt(sc,"semantic","Semantic memory"),facts:wAt(sc,"semantic","facts and meanings"),model:wAt(sc,"model","keeps nothing",-0.6),fresh:wAt(sc,"model","starts fresh"),
    record:wAt(sc,"record","A session's record"),asked:wAt(sc,"record","who asked"),did:wAt(sc,"record","what the agent did"),corrected:wAt(sc,"record","what Jun corrected"),
    long:wAt(sc,"long","long"),rows:wAt(sc,"long","sample rows"),noOne:wAt(sc,"long","no one else"),lasting:wAt(sc,"lasting","Lasting memory"),line:wAt(sc,"lasting","a line or two"),
    fact:wAt(sc,"fact","A fact"),pref:wAt(sc,"pref","A preference"),dec:wAt(sc,"decision","A decision"),like:wAt(sc,"like","Like semantic memory"),outlasts:wAt(sc,"like","outlasts")};
  tm_shots(ctx,S,t,sc.dur,[
    // Tulving, 1972: two kinds of memory (the camera starts where the last chapter's stopped, and holds while the chapters cross)
    {at:0,place:"lab",keys:[[0,960,540,1.02],[0.8,960,540,1.0]],push:0.02,draw:(c,tt)=>{
      tm_cardAt(c,640,110,640,{kick:"Psychologist · 1972",title:"Endel Tulving",sub:"told apart two kinds of memory"},tt,T.y72+0.1,null,{kickCol:AG.kick});
      tm_cardAt(c,200,430,700,{kick:"Episodic memory",title:"What happened to us",sub:"an event, and when and where it happened"},tt,T.epi-0.2,null,{kickCol:AG.violet});
      tm_cardAt(c,1020,430,700,{kick:"Semantic memory",title:"What we know",sub:"facts and meanings, without when and where"},tt,T.sem-0.2,null,{kickCol:AG.blue});}},
    // the model keeps nothing; a session's record is an episode; lasting memory keeps what sessions teach
    {at:T.model-0.4,place:"lab",keys:[[0,960,540,1.0]],push:0.02,draw:(c,tt)=>{
      const mA=ag_in(tt,T.model-0.4,0.6)*(1-ag_in(tt,T.lasting-0.6,0.6)),M=[560,420];
      tm_agent(c,M[0],M[1],86,tt,{label:"Model",a:mA,core:0.7});
      ag_roomLight(c,1);
      // sessions come and go; nothing stays
      ["14 April","15 April","16 April"].forEach((d,i)=>{const t0=T.model-0.1+i*1.15,u=clamp((tt-t0)/2.2,0,1);if(u<=0||u>=1)return;
        const x=u<0.4?lerp(M[0]-560,M[0]-170,ag_sine(u/0.4)):u<0.55?M[0]-170:lerp(M[0]-170,M[0]+260,ag_sine((u-0.55)/0.45)),a=ag_in(u,0,0.25)*(1-ag_in(u,0.75,0.25))*mA;
        tm_session(c,x,M[1]-62,340,124,{sub:d,a});});
      tm_pillAt(c,M[0],720,"starts fresh",tt,T.fresh,T.record+1.0);
      // the record: long, line after line
      const rA=ag_in(tt,T.record-0.2,0.5)*(1-ag_in(tt,T.outlasts,0.9)),n=lerp(0,10,clamp((tt-T.asked+0.4)/(T.corrected-T.asked+1.4),0,1))+lerp(0,6,clamp((tt-T.long)/2.6,0,1));
      if(rA>0)tm_record(c,1060,90,780,760,{a:rA,k:Math.min(1,ag_spr(tt,T.record-0.2,0.5)),n,scroll:lerp(0,230,ag_sine(clamp((tt-T.long)/3.0,0,1)))});
      tm_pillAt(c,M[0],700,"sample rows about students",tt,T.rows,T.lasting-0.4);tm_pillAt(c,M[0],780,"no one else reads it",tt,T.noOne,T.lasting-0.4);
      // what lasts: a line or two each, drawn from the record
      const K=[["Fact","Read each student's status as it was on census day.",T.fact],["Preference","Planning wants every total beside the count reported.",T.pref],
        ["Decision","Students who withdraw after census day still count.",T.dec]];
      K.forEach(([k,s,t0],i)=>{const y=110+i*230,b=tm_cardAt(c,120,y,760,{kick:k,title:s},tt,t0-0.2,null,{kickCol:AG.kick});
        if(b&&rA>0){const u=ag_sine(clamp((tt-t0+0.5)/0.6,0,1)),la=rA*(1-ag_in(tt,t0+1.2,0.5));if(la>0)tm_link(c,1060,300+i*120,880,y+60,u,{col:AG.violet,a:la,lift:10});}});
      tm_pillAt(c,500,820,"like semantic memory: it outlasts the session",tt,T.like,null,{col:AG.blue});}}
  ],0.8);
});

/* ---------------------------------------------------------------- 5 · Memory for the team */
const TM_CENSUS="Read each student's status as it was on census day, not as it is today.";
const TM_OLD=[{title:"Students, not enrolments",ok:true},{title:"Read the glossary first",ok:true},{title:"Show the count reported",ok:true}];
scene("team",(ctx,S,t,sc)=>{
  const T={end:wAt(sc,"propose","end of each session"),proposes:wAt(sc,"propose","proposes"),learned:wAt(sc,"entry","what was learned"),came:wAt(sc,"entry","where it came from"),
    confirmed:wAt(sc,"entry","who confirmed"),names:wAt(sc,"clean","No students' names"),ids:wAt(sc,"clean","no IDs"),sens:wAt(sc,"clean","nothing sensitive"),about:wAt(sc,"clean","a lesson about the data"),
    review:wAt(sc,"review","a person reads it"),nasa:wAt(sc,"review","NASA's analysts"),meanings:wAt(sc,"meiok","Meanings"),approves:wAt(sc,"meiok","approves"),
    memory:wAt(sc,"shared","team's memory"),outside:wAt(sc,"shared","outside any chat"),every:wAt(sc,"shared","every agent"),starts:wAt(sc,"shared","when a session starts"),
    clara:wAt(sc,"asks","Clara asks again"),answers:wAt(sc,"asks","answers"),shows:wAt(sc,"asks","shows the entry"),
    home:wAt(sc,"home","needed every time"),skill:wAt(sc,"home","a skill"),test:wAt(sc,"home","a test"),gloss:wAt(sc,"home","the glossary"),
    whose:wAt(sc,"blame","whose agent"),reports:wAt(sc,"blame","Like the reports"),blame:wAt(sc,"blame","not the blame")};
  const F=(tt,extra)=>[["Lesson",TM_CENSUS,null,ag_in(tt,T.learned-0.1,0.4)],["Learned in","A session on the census count, 14 April",null,ag_in(tt,T.came-0.1,0.4)],
    ["Confirmed by","The registrar's office",null,ag_in(tt,T.confirmed-0.1,0.4)]].concat(extra||[]);
  const agents=[[600,620,"Jun's agent"],[960,620,"Clara's agent"],[1320,620,"Noor's agent"]];
  tm_shots(ctx,S,t,sc.dur,[
    // the end of the session: the agent proposes what's worth keeping, with where it came from and who confirmed it; nothing about a person
    {at:0,place:"lab",keys:[[0,960,540,1.0]],push:0.02,draw:(c,tt)=>{
      const think=ag_io(tt,T.end,T.proposes+0.8,0.4);tm_agent(c,420,470,84,tt,{label:"Jun's agent",core:0.6+0.3*think,think,busy:think});ag_roomLight(c,1);
      const sa=ag_in(tt,0.2,0.4)*(1-ag_in(tt,T.end+0.6,0.7));if(sa>0)tm_session(c,90,96,600,170,{sub:"14 April",a:sa,k:lerp(0.75,1,sa),draw:x=>ag_T(x,"The census count",124,226,{w:600,size:30})});
      const ea=ag_in(tt,T.proposes,0.5);if(ea>0){const k=Math.min(1,ag_spr(tt,T.proposes,0.6));tm_entry(c,840,110,900,{kind:"proposed",fields:F(tt),a:ea,k});}
      [["no names",990,T.names],["no IDs",1240,T.ids],["nothing sensitive",1530,T.sens]].forEach(([s,x,t0])=>tm_pillAt(c,x,580,s,tt,t0,null,{col:AG.green,icon:"tick"}));
      tm_pillAt(c,1290,670,"a lesson about the data, not about a person",tt,T.about,null);}},
    // a person reads it, as the analysts read every report; meanings are Mei's: she approves it
    {at:T.review-0.4,cut:true,place:"lab",keys:[[0,960,540,1.0]],push:0.02,draw:(c,tt)=>{
      ag_person(c,"mei",1560,644,1.0,{t:tt,flip:true,gaze:[3,1]});ag_roomLight(c,1);
      ag_picture(c,70,130,250,160,{img:ag_place("tmNasa"),a:ag_in(tt,T.nasa-0.2,0.6)});
      const ap=clamp((tt-(T.approves+0.1))/0.35,0,1);
      tm_entry(c,400,140,880,{kind:ap>0.5?"entry":"proposed",fields:F(99,[["Approved by","Mei Tanaka, registrar's office",AG.green,ag_in(tt,T.approves+0.3,0.4)]]),
        stamp:{text:"Approved",col:AG.green,p:ap,dx:180,dy:70}});}},
    // into the team's memory, outside any chat; every agent reads it when a session starts
    {at:T.memory-0.4,cut:true,place:"lab",keys:[[0,960,540,1.0]],push:0.02,draw:(c,tt)=>{
      const drop=ag_spr(tt,T.memory,0.6),cards=TM_OLD.concat([{title:"Status as on census day",ok:true,lift:lerp(220,0,Math.min(1,drop)),glow:ag_io(tt,T.memory,T.starts+1.5,0.5)}]);
      agents.forEach(([x,y,l],i)=>tm_agent(c,x,y,56,tt+i,{label:l,core:0.55+0.35*ag_in(tt,T.starts+i*0.3+0.6,0.4),a:ag_in(tt,T.every-0.4+i*0.15,0.5)}));
      ag_roomLight(c,1);
      const pos=tm_file(c,384,330,{cards});
      agents.forEach(([x,y],i)=>tm_link(c,pos[3]?pos[3].cx:960,362,x,y-110,ag_sine(clamp((tt-T.starts-i*0.3)/1.0,0,1)),{t:tt}));
      tm_pillAt(c,1700,250,"outside any chat",tt,T.outside,null);}},
    // Clara asks again: 18,412, with the entry it followed
    {at:T.clara-0.4,cut:true,place:"lab",keys:[[0,960,540,1.0]],push:0.02,draw:(c,tt)=>{
      const think=ag_io(tt,T.clara+0.5,T.answers,0.4);ag_person(c,"clara",1600,644,1.0,{t:tt,flip:true,gaze:[3,0]});
      tm_agent(c,1080,470,80,tt,{label:"Clara's agent",core:0.6+0.3*think,think,busy:think});ag_roomLight(c,1);
      tm_cardAt(c,980,96,560,{kick:"Clara",title:"Students on census day, by mode of study?"},tt,T.clara,T.answers,{kickCol:AG.kick});
      const a=ag_in(tt,T.answers-0.1,0.5);if(a>0)ag_evidence(c,140,150,660,{kick:"Clara's agent",title:"18,412 students",sub:"on census day, by mode of study"},
        [{kick:"Team memory",title:"Status as it was on census day",col:AG.blue},{kick:"Query",title:"Counted as at 31 March",col:AG.orange},{kick:"Check",title:"Matches the count reported",col:AG.green}],
        {open:clamp((tt-T.shows)/1.6,0,1),ew:250,gap:20,a,k:Math.min(1,ag_spr(tt,T.answers-0.1,0.5))});}},
    // a lesson needed every time moves to its home: a skill, a test, the glossary
    {at:T.home-0.4,cut:true,place:"lab",keys:[[0,960,540,1.0]],push:0.02,draw:(c,tt)=>{
      const cards=TM_OLD.concat([{title:"Status as on census day",ok:true,lift:30*ag_in(tt,T.home,0.6),glow:ag_in(tt,T.home,0.6)}]),pos=tm_file(c,384,330,{cards});
      [["A skill","a step in its procedure",AG.blue,T.skill,420],["A test","checked on every run",AG.green,T.test,820],["The glossary","the meaning, defined once",AG.kick,T.gloss,1220]].forEach(([k,s,col,t0,x])=>{
        const b=tm_cardAt(c,x,520,340,{kick:k,sub:s},tt,t0-0.1,null,{kickCol:col,edge:col===AG.kick?null:col,edgeA:0.5});
        if(b&&pos[3])tm_link(c,pos[3].cx,pos[3].y+pos[3].h+40,x+170,520,ag_sine(clamp((tt-t0+0.3)/0.7,0,1)),{col:AG.mut,lift:-20});});}},
    // the entry carries the lesson, not the blame
    {at:T.whose-0.4,cut:true,place:"lab",keys:[[0,960,540,1.0]],push:0.02,draw:(c,tt)=>{
      const b=tm_entry(c,380,110,1060,{fields:[["Lesson",TM_CENSUS],["Learned in","A session on the census count, 14 April"],["Confirmed by","The registrar's office"],["Approved by","Mei Tanaka, registrar's office",AG.green]]});
      // the field it doesn't have: whose agent got it wrong
      const ga=ag_in(tt,T.whose,0.4)*(1-ag_in(tt,T.reports-0.3,0.6));if(ga>0){const y=b.y+b.h+30,w=640,x=960-w/2;c.save();c.globalAlpha*=ga;c.setLineDash([10,8]);c.strokeStyle=rgba(AG.mut,0.7);c.lineWidth=2.4;
        rr(c,x,y,w,70,14);c.stroke();c.setLineDash([]);ag_T(c,"Whose agent got it wrong?",x+30,y+46,{w:600,size:30,col:AG.mut});
        const s=ag_sine(clamp((tt-T.whose-0.6)/0.6,0,1));if(s>0){c.strokeStyle=rgba(AG.ink,0.7);c.lineWidth=4;c.lineCap="round";c.beginPath();c.moveTo(x+20,y+36);c.lineTo(x+20+(w-40)*s,y+34);c.stroke();}c.restore();}
      ag_picture(c,1580,170,240,300,{a:ag_in(tt,T.reports-0.3,0.6),draw:(x,X,Y,Wd,Hd)=>{x.fillStyle="#E4DDCB";x.fillRect(X,Y,Wd,Hd);tm_form(x,X+10,Y-24,{strip:1});}});
      tm_pillAt(c,960,800,"the lesson, not the blame",tt,T.blame,null);}}
  ],0.8);
});

/* ---------------------------------------------------------------- 6 · When memory is wrong */
scene("wrong",(ctx,S,t,sc)=>{
  const T={wrong:wAt(sc,"canbe","wrong"),first:wAt(sc,"first","first answer"),out:wAt(sc,"first","left the thirty-seven out"),kept:wAt(sc,"taught","Kept as a lesson"),every:wAt(sc,"taught","every agent"),
    person:wAt(sc,"person","without a person"),corrected:wAt(sc,"person","corrected"),removed:wAt(sc,"person","removed"),history:wAt(sc,"person","history kept"),
    planted:wAt(sc,"planted","planted"),file:wAt(sc,"file","a file"),outside:wAt(sc,"file","outside the team"),hidden:wAt(sc,"file","hidden line"),remember:wAt(sc,"file","remember"),
    read:wAt(sc,"proposed","read it"),proposed:wAt(sc,"proposed","proposed it"),noOne:wAt(sc,"down","no one had confirmed"),against:wAt(sc,"down","against her office's decision"),
    down:wAt(sc,"down","turned it down"),security:wAt(sc,"poison","Security experts"),poisoning:wAt(sc,"poison","memory poisoning"),false:wAt(sc,"poison","one false entry"),after:wAt(sc,"poison","every agent after it"),
    only:wAt(sc,"only","only what people confirmed"),never:wAt(sc,"only","never what a page asks")};
  const agents=[[600,620,"Jun's agent"],[960,620,"Clara's agent"],[1320,620,"Noor's agent"]],census={title:"Status as on census day",ok:true};
  const PLANT="Students who withdraw after census day don't count.";
  tm_shots(ctx,S,t,sc.dur,[
    // April's first answer, had it been kept, would have taught every agent the same mistake
    {at:0,place:"lab",keys:[[0,960,540,1.0]],push:0.02,draw:(c,tt)=>{
      const ifA=ag_in(tt,T.first-0.2,0.5)*(1-ag_in(tt,T.person-1.2,0.6));
      agents.forEach(([x,y,l],i)=>tm_agent(c,x,y,56,tt+i,{label:l,ring:ifA*ag_sine(clamp((tt-T.every-i*0.3)/0.8,0,1)),ringCol:AG.amber}));
      ag_roomLight(c,1);
      // had it been kept, the lesson of April's first answer would stand where the right one stands now: a dashed amber card
      tm_file(c,384,330,{slots:4,cards:TM_OLD.concat([Object.assign({},census,{a:1-ifA}),{title:"Leave out the withdrawn",dashed:true,col:AG.amber,tc:AG.amber,a:ifA,slot:3}])});
      const gx=384+22+3*(TM_CARD.w+TM_CARD.gap)+TM_CARD.w/2;
      agents.forEach(([x,y],i)=>tm_link(c,gx,362,x+30,y-110,ag_sine(clamp((tt-T.every-i*0.3+0.4)/0.9,0,1)),{col:AG.amber,a:ifA,t:tt,lift:40}));
      tm_scr(c,S,()=>tm_tag(c,"If it had been kept",ifA*ag_in(tt,T.kept-0.2,0.4),{dashed:true}));}},
    // nothing goes in without a person; any entry can be corrected or removed, its history kept
    {at:T.person-0.4,place:"lab",keys:[[0,960,540,1.0]],push:0.02,draw:(c,tt)=>{
      tm_entry(c,420,120,1080,{fields:[["Lesson",TM_CENSUS],["Approved by","Mei Tanaka, registrar's office",AG.green],
        ["History","14 April · proposed from a session"],[null,"15 April · approved by Mei Tanaka"]],hl:2,hlA:ag_in(tt,T.history,0.5),a:ag_in(tt,T.person-0.4,0.5)});
      tm_pillAt(c,960,96,"nothing goes in without a person",tt,T.person,null);
      tm_pillAt(c,820,760,"Correct",tt,T.corrected,null,{icon:"draft"});tm_pillAt(c,1100,760,"Remove",tt,T.removed,null);}},
    // a file from outside the team, with a hidden line; the agent reads it and proposes it
    {at:T.planted-0.4,place:"lab",keys:[[0,960,540,1.0]],push:0.02,draw:(c,tt)=>{
      const A=[1180,650],reach=ag_io(tt,T.read-0.3,T.proposed+0.3,0.5),think=ag_io(tt,T.read,T.proposed+0.6,0.3);
      tm_agent(c,A[0],A[1],64,tt,{label:"Jun's agent",core:0.6+0.3*think,think,busy:think,a:ag_in(tt,T.file,0.5)});ag_roomLight(c,1);
      const sh=tm_sheet(c,90,150,760,{open:clamp((tt-T.hidden-0.2)/1.0,0,1),a:ag_in(tt,T.planted-0.2,0.5),k:Math.min(1,ag_spr(tt,T.planted-0.2,0.5))});
      tm_pillAt(c,640,110,"from outside the team",tt,T.outside,null);
      if(sh&&reach>0)ag_reach(c,[A[0]-50,A[1]+30,A[0]-200,A[1]+90,sh.x+sh.w+150,sh.y+sh.h*0.55+60,sh.x+sh.w+6,sh.y+sh.h*0.55],reach,{data:clamp((tt-T.read-0.4)/1.2,0,1)});
      const ea=ag_in(tt,T.proposed,0.5);if(ea>0)tm_entry(c,1000,110,860,{kind:"proposed",fields:[["Lesson",PLANT],["Learned in","A file from outside the team"],["Confirmed by","No one",AG.amber]],a:ea,k:Math.min(1,ag_spr(tt,T.proposed,0.5))});}},
    // Mei: no one confirmed it, and it goes against her office's decision; she turns it down
    {at:T.noOne-0.4,cut:true,place:"lab",keys:[[0,960,540,1.0]],push:0.02,draw:(c,tt)=>{
      ag_person(c,"mei",1560,644,1.0,{t:tt,flip:true,gaze:[3,1]});ag_roomLight(c,1);
      const b=tm_entry(c,300,130,900,{kind:"proposed",fields:[["Lesson",PLANT],["Learned in","A file from outside the team"],["Confirmed by","No one",AG.amber]],hl:2,hlA:ag_in(tt,T.noOne,0.5),
        stamp:{text:"Turned down",col:AG.amber,p:clamp((tt-(T.down+0.1))/0.35,0,1),dx:220,dy:70}});
      tm_pillAt(c,750,b.y+b.h+60,"against the registrar's decision",tt,T.against,null,{col:AG.amber,icon:"warn"});}},
    // memory poisoning: one false entry, and every agent after it is misled
    {at:T.security-0.4,place:"lab",keys:[[0,960,540,1.0]],push:0.02,draw:(c,tt)=>{
      const xs=[420,700,980,1260,1540],bad={title:"Withdrawn: don't count",col:AG.amber,tc:AG.amber,a:ag_in(tt,T.false-0.2,0.4)};
      xs.forEach((x,i)=>tm_agent(c,x,660,44,tt+i*0.7,{ring:ag_sine(clamp((tt-T.after-i*0.35)/0.7,0,1)),ringCol:AG.amber}));
      ag_roomLight(c,1);const pos=tm_file(c,800,330,{cards:[TM_OLD[0],TM_OLD[1],bad]});
      xs.forEach((x,i)=>{if(pos[2])tm_link(c,pos[2].cx,362,x,660-84-12,ag_sine(clamp((tt-T.after-i*0.35+0.4)/0.8,0,1)),{col:AG.amber,t:tt,a:bad.a});});
      tm_cardAt(c,100,110,600,{kick:"Security experts call it",title:"Memory poisoning"},tt,T.security,null,{kickCol:AG.kick});
      tm_scr(c,S,()=>tm_tag(c,"If it got in",ag_in(tt,T.false,0.4),{dashed:true,y:300}));}},
    // so the team's memory keeps only what people confirmed
    {at:T.only-0.4,place:"lab",keys:[[0,960,540,1.0]],push:0.02,draw:(c,tt)=>{
      tm_cardAt(c,420,130,1080,{kick:"The team's memory keeps",title:"Only what people confirmed",sub:"never what a page asks it to remember"},tt,T.only-0.2,null,{kickCol:AG.blue});
      tm_file(c,384,700,{cards:TM_OLD.concat([census]),a:ag_in(tt,T.only+0.6,0.6)});}}
  ],0.8);
});

/* ---------------------------------------------------------------- 7 · Every crew */
scene("every",(ctx,S,t,sc)=>{
  const T={warning:wAt(sc,"warning","warning"),never:wAt(sc,"warning","never reached"),today:wAt(sc,"today","Today",-0.4),everyCrew:wAt(sc,"today","every crew"),
    uni:wAt(sc,"reaches","At the university",-0.4),jun:wAt(sc,"reaches","Jun's agent"),clara:wAt(sc,"reaches","reaches Clara's"),starts:wAt(sc,"reaches","every agent the team starts"),
    reviewed:wAt(sc,"kept","Reviewed by a person"),names:wAt(sc,"kept","kept without names"),corrected:wAt(sc,"kept","corrected"),take:wAt(sc,"takeaway","Let the agent")};
  tm_shots(ctx,S,t,sc.dur,[
    // 1974: the warning stayed on one airline's board
    {at:0,place:"tmCrew",keys:[[0,960,540,1.0]],push:0.02,draw:(c,tt)=>{const rA=TM_ROOMS[0],rB=TM_ROOMS[1],B=TM_BOARD;
      ag_person(c,TM_P.pilot,rA.x+180,800,0.62,{t:tt,gaze:[3,-2]});const n=tm_notice(c,0,{kind:"notice"});
      if(n)tm_link(c,n.x+n.w,n.y+60,rB.x+B.dx+40,B.y+60,ag_sine(clamp((tt-T.warning)/1.2,0,1)),{col:AG.mut,stop:0.17,lift:40});
      tm_pillAt(c,960,330,"never reached the others",tt,T.never,null);
      tm_scr(c,S,()=>tm_tag(c,"Crew rooms · 1974",ag_in(tt,0.4,0.5)));}},
    // today: what one crew learns reaches every crew
    {at:T.today,cut:true,place:"tmCrew",keys:[[0,960,540,1.0]],push:0.02,draw:(c,tt)=>{
      const who=[TM_P.pilot2,TM_P.ctrl76,TM_P.mech];
      TM_ROOMS.forEach((r,i)=>{ag_person(c,who[i],r.x+180,800,0.62,{t:tt+i,gaze:[3,-2]});tm_notice(c,i,{kind:"alert",p:clamp((tt-(T.everyCrew-0.3+i*0.25))/0.5,0,1)});});
      tm_scr(c,S,()=>tm_tag(c,"Today",ag_in(tt,T.today+0.3,0.5)));}},
    // the university: what Jun's agent learned reaches Clara's, and every agent the team starts; reviewed, without names, corrected
    {at:T.uni,place:"lab",keys:[[0,960,540,1.0]],push:0.02,draw:(c,tt)=>{
      const ag3=[[560,640,56,"Jun's agent",T.jun],[930,640,56,"Clara's agent",T.clara],[1260,660,42,null,T.starts],[1480,660,42,null,T.starts+0.3],[1700,660,42,null,T.starts+0.6]];
      ag3.forEach(([x,y,r,l,t0],i)=>tm_agent(c,x,y,r,tt+i*0.6,{label:l,a:ag_in(tt,t0-0.4,0.5),core:0.55+0.35*ag_in(tt,t0+0.5,0.4)}));
      ag_roomLight(c,1);const pos=tm_file(c,384,330,{cards:TM_OLD.concat([{title:"Status as on census day",ok:true,glow:ag_io(tt,T.jun,T.reviewed,0.5)}])});
      ag3.forEach(([x,y,r,l,t0])=>tm_link(c,pos[3]?pos[3].cx:960,362,x,y-r*1.9-12,ag_sine(clamp((tt-t0)/1.0,0,1)),{t:tt}));
      [["reviewed by a person",560,T.reviewed],["kept without names",960,T.names],["corrected when it's wrong",1390,T.corrected]].forEach(([s,x,t0])=>tm_pillAt(c,x,470,s,tt,t0,null,{col:AG.green,icon:"tick"}));}}
  ],0.8);
  // the takeaway, then the end card
  const t0=T.take-0.4;ag_veil(ctx,S,0.5*ag_in(t,t0,1.0));ag_end(ctx,S,t,t0,"Memory: from one chat to the team","Let the agent learn from the team, not from one person.","Film 4 of 9","Agents at work on data");
});

// chapters that open on a cut: each shows people, things or words the chapter before ends on, which a crossfade would show twice
ag_cutInto(["weeks","team","wrong"]);
