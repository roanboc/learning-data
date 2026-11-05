/* ===== It feels like understanding: the seven chapters =====
   Each chapter is a few shots in this film's places (plan.js) and the series' lab, cut together with short dissolves (ag_shots). Times
   inside a chapter come from its cues and the words of its lines (wAt, called directly so the cue check sees each word), so the
   pictures stay with the voice if it's recorded again. Words on screen are on cards, signs, screens and the wall, at least 28 px as
   seen, and above the captions. */

const fu_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
const fu_fin=(t,a,d)=>ag_in(t,a,d||0.6);
// the tangent of a curve at u, as an angle
function fu_ang(p,u){const a=ag_bz(p,Math.max(0,u-0.01)),b=ag_bz(p,Math.min(1,u+0.01));return Math.atan2(b[1]-a[1],b[0]-a[0]);}
// a small orange arrow: a push off course, at (x, y), pointing along ang, len long; a 0 to 1; o.ghost draws it pale, as it really was
function fu_push(ctx,x,y,ang,len,a,o){o=o||{};if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(ang);const col=o.ghost?rgba(AG.orange,0.28):rgba(AG.orange,0.95);
  ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=o.lw||4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(len-8,0);ctx.stroke();
  ctx.beginPath();ctx.moveTo(len+2,0);ctx.lineTo(len-12,-8);ctx.lineTo(len-12,8);ctx.closePath();ctx.fill();ctx.restore();}

/* ---------------------------------------------------------------- 1999's room: the drawing of space on the wall, then the two desks.
   o: space {earth, mars, path, labels, swirl}, craft {u, on, puff, burn, orbitTh, orb (which orbit), behind}, real (the real path's
   alpha), orbits (the orbits' alpha), radio (the radio line's alpha), odyssey {u, th, a}, second (Odyssey's second line), pushes [[u, a]],
   people {lean, nod}, crt {L, R} (what each monitor shows), dim (the light of the night it was lost) */
function fu_room99(ctx,t,o){const S=FU_SPACE,M=S.mars,E=S.earth,sp=o.space||{};
  // Earth, the way there, the labels
  fu_pencilDisc(ctx,E[0],E[1],E[2],sp.earth==null?1:sp.earth,FU.earth,{});
  fu_dots(ctx,S.path,0.04,lerp(0.04,1,sp.path==null?1:sp.path),{});
  if((o.real||0)>0)fu_line(ctx,S.real,0.04,lerp(0.04,1,o.realP==null?1:o.realP),{color:rgba(AG.amber,0.85),lw:2.6,dash:[10,8],a:o.real});
  const la=sp.labels==null?1:sp.labels;if(la>0){fu_pencil(ctx,"Earth",E[0],E[1]+E[2]+44,{align:"center",a:la});fu_pencil(ctx,"Mars",M[0],M[1]+M[2]+44,{align:"center",a:la});}
  // the orbits' far halves, behind Mars
  const ob=o.orbits||0;fu_orbit(ctx,S.plan,"back",ob,rgba(FU.graphite,0.7),[3,9]);fu_orbit(ctx,S.low,"back",ob*(o.lowA==null?1:o.lowA),rgba(AG.amber,0.85),[10,8]);
  // the craft: where it is, and whether Mars hides it
  const cr=o.craft;let cp=null;if(cr&&cr.on>0){if(cr.orbitTh!=null){const q=fu_orbitAt(cr.orb||S.low,cr.orbitTh);cp=[q[0],q[1],cr.orbitTh+Math.PI/2,q[2]];}
    else{const q=ag_bz(S.real,cr.u);cp=[q[0],q[1],fu_ang(S.real,cr.u),false];}}
  const od=o.odyssey;let opos=null;if(od&&od.a>0){if(od.th!=null){const q=fu_orbitAt(S.plan,od.th);opos=[q[0],q[1],od.th+Math.PI/2,q[2]];}else{const q=ag_bz(S.path,od.u);opos=[q[0],q[1],fu_ang(S.path,od.u),false];}}
  // the radio line home: a soft dotted thread from Earth to the craft
  if(cp&&(o.radio||0)>0)fu_dots(ctx,[E[0]+E[2]*0.7,E[1]-E[2]*0.3,lerp(E[0],cp[0],0.33),lerp(E[1],cp[1],0.33)-40,lerp(E[0],cp[0],0.66),lerp(E[1],cp[1],0.66)-40,cp[0],cp[1]],0,1,{a:o.radio,n:70,r:2.2,color:rgba([96,110,124],0.8)});
  if(opos&&(o.oRadio||0)>0){fu_dots(ctx,[E[0]+E[2]*0.7,E[1]-E[2]*0.3,lerp(E[0],opos[0],0.33),lerp(E[1],opos[1],0.33)-40,lerp(E[0],opos[0],0.66),lerp(E[1],opos[1],0.66)-40,opos[0],opos[1]],0,1,{a:o.oRadio,n:70,r:2.2,color:rgba([96,110,124],0.8)});
    // the second way to find it: another line, from another side of Earth, meeting the first at the craft
    if((o.second||0)>0){const u=ag_sine(o.second);fu_dots(ctx,[E[0]+E[2]*0.3,E[1]+E[2]*0.9,lerp(E[0],opos[0],0.4),E[1]+90,lerp(E[0],opos[0],0.8),lerp(E[1],opos[1],0.8)+60,opos[0],opos[1]],0,u,{n:80,r:2.4,color:rgba(AG.blue,0.85)});}}
  const craft=(front)=>{if(cp&&cp[3]!==front)fu_orbiter(ctx,cp[0],cp[1],cr.s||0.62,cp[2],{a:cr.on,puff:cr.puff,burn:cr.burn,t});
    if(opos&&opos[3]!==front)fu_odyssey(ctx,opos[0],opos[1],od.s||0.5,opos[2],{a:od.a});};
  craft(false);
  fu_pencilDisc(ctx,M[0],M[1],M[2],sp.mars==null?1:sp.mars,FU.mars,{swirl:sp.swirl,t});
  fu_orbit(ctx,S.plan,"front",ob,rgba(FU.graphite,0.7),[3,9]);fu_orbit(ctx,S.low,"front",ob*(o.lowA==null?1:o.lowA),rgba(AG.amber,0.85),[10,8]);
  craft(true);
  // pushes off course: small orange arrows at the craft, each at its moment
  for(const pu of (o.pushes||[])){if(pu[1]<=0.01)continue;const q=ag_bz(S.real,pu[0]),an=fu_ang(S.real,pu[0])+Math.PI/2;fu_push(ctx,q[0],q[1],an,30,pu[1],{lw:3.4});}
  // the desks of 1999, and the people at them (o.empty: the wall alone, for a close-up of the drawing)
  const F=FU99,pe=o.people||{},[lx,ly,lw]=F.deskL,[rx,ry,rw]=F.deskR;if(o.empty){ag_roomLight(ctx,1);return;}
  ag_desk(ctx,lx,ly,lw,{});ag_desk(ctx,rx,ry,rw,{});
  ag_person(ctx,FU_PEOPLE.builderB,F.bB[0],F.bB[1],F.bB[2],{t,cut:ly-70,gaze:[3,1],nod:pe.nodL||0});
  ag_person(ctx,FU_PEOPLE.builderA,F.bA[0],F.bA[1],F.bA[2],{t:t+1.3,cut:ly-70,gaze:[4,1],nod:pe.nodL||0});
  ag_person(ctx,FU_PEOPLE.navA,F.nA[0]+(pe.lean||0)*12,F.nA[1]+(pe.lean||0)*4,F.nA[2],{t:t+2.1,flip:true,cut:ry-70,gaze:[4,1],nod:(pe.nodR||0)-(pe.lean||0)*0.04,smile:0.3+0.2*(pe.lean||0)});
  ag_person(ctx,FU_PEOPLE.navB,F.nB[0]+(pe.lean||0)*8,F.nB[1],F.nB[2],{t:t+0.7,flip:true,cut:ry-70,gaze:[4,1],nod:(pe.nodR||0)-(pe.lean||0)*0.03});
  const crt=o.crt||{};fu_crt(ctx,F.crtL[0],F.crtL[1],F.crtL[2],{on:crt.onL,draw:(c,x,y,w,h)=>fu_screen99(c,x,y,w,h,crt.L||{})});
  fu_crt(ctx,F.crtR[0],F.crtR[1],F.crtR[2],{on:crt.onR,draw:(c,x,y,w,h)=>fu_screen99(c,x,y,w,h,crt.R||{})});
  fu_phone(ctx,96,812,0.7,{ring:0});fu_binders(ctx,1846,808,2,0.74);
  fu_sheet(ctx,1676,816,150,52,{rot:0.04,draw:(c,x,y,w,h)=>fu_plotDraw(c,x,y,w,h,1)});
  ag_roomLight(ctx,1);
  if((o.dim||0)>0){ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba(mix([255,255,255],[150,150,160],o.dim),1);ctx.fillRect(-W,-H,3*W,3*H);ctx.restore();}}
// what a monitor of 1999 shows: the plotted way to Mars (p), with each push drawn small and, behind it, a pale ghost of its real size
// (ghost), or nothing but a flat line (flat)
function fu_screen99(c,x,y,w,h,o){if(o.flat!=null){c.strokeStyle="rgba(60,80,70,0.7)";c.lineWidth=2;c.beginPath();c.moveTo(x+10,y+h*0.55);c.lineTo(x+w-10,y+h*0.55);c.stroke();return;}
  c.strokeStyle="rgba(60,80,70,0.25)";c.lineWidth=1;for(let i=1;i<4;i++){c.beginPath();c.moveTo(x,y+h*i/4);c.lineTo(x+w,y+h*i/4);c.stroke();}
  const P=[x+10,y+h*0.78,x+w*0.3,y+h*0.12,x+w*0.7,y+h*0.1,x+w-12,y+h*0.6];c.strokeStyle="rgba(50,70,60,0.85)";c.lineWidth=2;ag_bzPath(c,P,0,o.p==null?1:o.p,40);c.stroke();
  if(o.arrows){for(const [u,a] of o.arrows){const q=ag_bz(P,u),an=fu_ang(P,u)+Math.PI/2;if(o.ghost)fu_push(c,q[0],q[1],an,46,a*o.ghost,{ghost:true,lw:3.2});fu_push(c,q[0],q[1],an,11,a,{lw:2.8});}}}

// ---- 1 · Two teams, one number: the Mars Climate Orbiter, two teams, one file of numbers, and the unit nobody wrote ----
scene("orbiter",(ctx,S,t,sc)=>{const c=sc.cues,P=fu_once(sc,"P",()=>({
    dec:wAt(sc,"launch","December"),launched:wAt(sc,"launch","launched"),mco:wAt(sc,"launch","Mars Climate Orbiter"),weather:wAt(sc,"launch","the weather"),
    thr:c.thrusters,small:wAt(sc,"thrusters","small thrusters"),firing:wAt(sc,"thrusters","each firing"),pushed:wAt(sc,"thrusters","pushed"),course:wAt(sc,"thrusters","off course"),
    bld:c.builders,colo:wAt(sc,"builders","Colorado"),worked:wAt(sc,"builders","worked out"),every:wAt(sc,"builders","every push"),
    file:c.file,sent:wAt(sc,"file","sent"),navs:wAt(sc,"file","navigators"),cal:wAt(sc,"file","California"),steer:wAt(sc,"file","steer"),
    agr:c.agreed,agreed:wAt(sc,"agreed","agreed"),newton:wAt(sc,"agreed","newton-seconds"),gave:wAt(sc,"gave","gave"),pound:wAt(sc,"gave","pound-seconds"),four:wAt(sc,"gave","four and a half"),
    q:c.quarter,counted:wAt(sc,"quarter","counted"),less:wAt(sc,"quarter","less than a quarter"),sure:wAt(sc,"sure","sure"),same:wAt(sc,"sure","the same"),
    mon:c.months,nine:wAt(sc,"months","nine months"),added:wAt(sc,"months","added up"),apr:c.april,april:wAt(sc,"april","April"),fit:wAt(sc,"april","didn't fit"),
    emails:wAt(sc,"april","emails"),settled:wAt(sc,"april","never settled"),rou:c.routine,thirty:wAt(sc,"routine","thirty years"),routine:wAt(sc,"routine","routine"),
    burn:c.burn,third:wAt(sc,"burn","twenty-third"),fired:wAt(sc,"burn","fired"),behind:wAt(sc,"behind","passed behind"),km:wAt(sc,"behind","a hundred and seventy"),
    lower:wAt(sc,"behind","lower than planned"),never:wAt(sc,"never","never"),lost:c.lost,years:wAt(sc,"lost","Years of work"),sat:wAt(sc,"lost","first weather satellite"),
    were:wAt(sc,"lost","were lost"),chg:c.change,ody:c.odyssey,mo:wAt(sc,"odyssey","Mars Odyssey"),units:wAt(sc,"odyssey","both units"),hand:wAt(sc,"odyssey","hand-off"),
    crit:wAt(sc,"independent","critical"),indep:wAt(sc,"independent","independently"),sec:wAt(sc,"second","second way"),orb:c.orbit,into:wAt(sc,"orbit","went into orbit"),
    twenty:wAt(sc,"orbit","twenty years later"),work:wAt(sc,"orbit","still at work"),risk:c.risk,agents:wAt(sc,"risk","Agents"),person:wAt(sc,"risk","a person"),
    eachSure:wAt(sc,"risk","each sure"),say:wAt(sc,"rely","Say what"),check:wAt(sc,"rely","check it"),rely:wAt(sc,"rely","rely"),br:c.breath}));
  const F=FU99,S9=FU_SPACE;
  // the craft's way: from Earth at "launched", a little way by the end of the thrusters' line, on to Mars over the nine months; then
  // its engine, and the lower orbit, behind the planet
  const cu=ag_keys(t,[[P.launched,0.04],[P.thr+6,0.3],[P.mon-0.4,0.34],[P.mon+3.6,0.97],[P.burn,1]]),
    th=t<P.behind-0.2?null:lerp(0,Math.PI*0.62,ag_sine((t-P.behind+0.2)/2.6)),
    fires=[P.firing,P.pushed,P.mon+0.2,P.mon+0.9,P.mon+1.6,P.mon+2.3,P.mon+3.0],
    pushes=fires.map(f=>[ag_keys(f,[[P.launched,0.04],[P.thr+6,0.3],[P.mon-0.4,0.34],[P.mon+3.6,0.97]]),ag_io(t,f,f+1.1,0.2)]);
  const craft={u:cu,on:fu_fin(t,P.launched-0.2,0.4),puff:clamp((t-P.firing)/1.0,0,1)<1&&t>P.firing?(t-P.firing)/1.0:(t>P.pushed&&t<P.pushed+1?(t-P.pushed):0),
    burn:ag_io(t,P.fired,P.behind+0.6,0.3)*(0.75+0.25*Math.sin(t*23)),orbitTh:th,orb:S9.low,s:0.62};
  const space={earth:clamp((t-P.dec+0.6)/1.3,0,1),mars:clamp((t-P.dec-0.2)/1.3,0,1),path:clamp((t-P.launched+0.3)/1.6,0,1),labels:fu_fin(t,P.dec+0.4,0.6)*(1-ag_io(t,P.apr-0.5,P.rou-0.3,0.4)),swirl:ag_io(t,P.weather,P.thr+2,0.6)};
  // the navigators' monitor: the plotted way; each push drawn small, and its real size, pale, behind it
  const crt={L:{p:clamp((t-P.worked)/1.4,0,1)},R:{p:fu_fin(t,P.steer-0.2,1.2),arrows:[[0.2,fu_fin(t,P.counted,0.4)],[0.5,fu_fin(t,P.counted+0.4,0.4)],[0.8,fu_fin(t,P.counted+0.8,0.4)]],ghost:fu_fin(t,P.less,0.5)}};
  const room=(x,tt,o)=>fu_room99(x,tt,Object.assign({space,craft,pushes,crt,real:fu_fin(tt,P.nine,1.2)*1,realP:clamp((tt-P.nine)/2.6,0,1)},o||{}));
  const nav={lean:ag_in(t,P.routine,1.2)*(1-fu_fin(t,P.burn,0.8)),nodL:t>P.same-0.3&&t<P.same+1.2?0.06*Math.sin((t-P.same+0.3)*8)*ag_io(t,P.same-0.3,P.same+1.0,0.2):0};
  nav.nodR=nav.nodL;
  // the file of numbers, the units' bubbles, the bars, the envelopes, the thirty ticks, Odyssey's cards: what's drawn over the room
  const over=(x,tt)=>{
    // the file: its numbers fill at the builders' desk, it slides along the floor to the navigators', into their monitor; back to say its tag stays blank; filled by Odyssey's team
    const fIn=fu_fin(tt,P.worked-0.4,0.5),slide=ag_sine((tt-P.sent)/1.8),into=ag_sine((tt-P.steer-0.2)/1.0),back=fu_fin(tt,P.sure-0.2,0.6)*(1-fu_fin(tt,P.mon-0.3,0.5)),ody=fu_fin(tt,P.units-0.3,0.6);
    if(tt<P.steer+1.2&&fIn>0){const fx=lerp(600,1052,slide),fy=430+Math.sin(slide*Math.PI)*-30,k=1-0.75*into;x.save();ag_about(x,fx+125,fy+125,k);x.translate(lerp(0,1428-(fx+125),into),lerp(0,693-(fy+125),into));
      fu_fileCard(x,fx,fy,{rows:clamp((tt-P.worked)/1.4,0,1),a:fIn*(1-into),ask:0});x.restore();}
    if(back>0)fu_fileCard(x,810,350,{rows:1,a:back,ask:fu_fin(tt,P.same,0.6),k:ag_spr(tt,P.sure-0.2,0.7)});
    if(ody>0&&tt<P.orb)fu_fileCard(x,810,262,{rows:1,a:ody*(1-fu_fin(tt,P.orb-0.6,0.4)),unit:clamp((tt-P.hand+0.2)/0.8,0,1),k:ag_spr(tt,P.units-0.3,0.7)});
    // the desks' signs: who sits where
    const sg=(1-fu_fin(tt,P.burn-0.6,0.6))*(1-ag_io(tt,P.mon-0.6,P.rou+1.2,0.4));fu_sign(x,F.pillL[0],F.pillL[1],"Colorado","the builders",fu_fin(tt,P.colo-0.2,0.5)*sg,ag_spr(tt,P.colo-0.2,0.7));
    fu_sign(x,F.pillR[0],F.pillR[1],"California","NASA's navigators",fu_fin(tt,P.cal-0.2,0.5)*sg,ag_spr(tt,P.cal-0.2,0.7));
    // the two units' agreement, and each team's own meaning
    const ag=fu_fin(tt,P.agreed-0.1,0.5)*(1-fu_fin(tt,P.four-0.2,0.5));if(ag>0)fu_blueCard(x,960,590,"agreed: newton-seconds",{a:ag,k:ag_spr(tt,P.agreed-0.1,0.7),col:AG.mut});
    const bub=fu_fin(tt,P.pound-0.3,0.5)*(1-fu_fin(tt,P.mon-0.3,0.6));
    if(bub>0){const nod=tt>P.same-0.3?Math.sin((tt-P.same+0.3)*7)*6*ag_io(tt,P.same-0.3,P.same+1.0,0.2):0;
      fu_bubble(x,F.bubL[0],F.bubL[1]+nod,"pound-seconds",{a:bub,k:ag_spr(tt,P.pound-0.3,0.7),px:F.bA[0]-20,py:F.bA[1]-150});
      fu_bubble(x,F.bubR[0],F.bubR[1]+nod,"newton-seconds",{a:fu_fin(tt,P.pound+0.1,0.5)*(1-fu_fin(tt,P.mon-0.3,0.6)),k:ag_spr(tt,P.pound+0.1,0.7),px:F.nA[0]+20,py:F.nA[1]-150});}
    // how far apart the units are
    const bars=fu_fin(tt,P.four-0.1,0.5)*(1-fu_fin(tt,P.sure-0.4,0.5));if(bars>0){const g=ag_eo(clamp((tt-P.four+0.1)/1.0,0,1));x.save();x.globalAlpha*=bars;
      const bx=700,bw=445;ag_box(x,bx-30,420,bw+300,206,18,{});x.fillStyle=rgba(AG.ink,0.85);rr(x,bx,470,bw*g,22,8);x.fill();rr(x,bx,550,100*g,22,8);x.fill();
      ag_T(x,"1 pound-second",bx+bw*g+20,489,{w:700,size:30,a:g});ag_T(x,"1 newton-second",bx+120,569,{w:700,size:30,a:g});
      ag_T(x,"4.45 times",bx,456,{w:600,size:28,col:AG.mut,a:fu_fin(tt,P.four+0.5,0.5)});x.restore();}
    // the doubt, raised in emails and never settled: an envelope a month, up from the navigators' desk; none answered; they settle in a pile
    const months=["Apr","May","Jun","Jul"];for(let i=0;i<4;i++){const t0=P.april+i*1.25,u=clamp((tt-t0)/1.3,0,1),fall=clamp((tt-P.settled-0.3-i*0.12)/0.9,0,1);if(u<=0)continue;
      const ex=lerp(1460,1090+i*150,ag_sine(u)),ey=lerp(640,384+(i%2)*34,ag_sine(u)),px=1380+i*16,py=772-i*9,fx=lerp(ex,px,ag_sine(fall)),fy=lerp(ey,py,ag_sine(fall));
      fu_envelope(x,fx,fy,lerp(0.9,0.5,fall),{a:fu_fin(tt,t0,0.3)*(1-fu_fin(tt,P.burn-0.6,0.6)),label:fall<0.3?months[i]:null,rot:lerp(-0.05,0.1*(i%2?1:-1),fall)});}
    // thirty years of success: thirty small green ticks along the skirting
    const tk=fu_fin(tt,P.thirty-0.2,0.4)*(1-fu_fin(tt,P.burn-0.6,0.6));if(tk>0){x.save();x.globalAlpha*=tk;for(let i=0;i<30;i++){const k=clamp((tt-P.thirty-i*0.04)/0.3,0,1);if(k>0)ag_tick(x,120+i*57,645,18*ag_eo(k),rgba(AG.green,1),3.4);}
      ag_pill(x,960,598,"30 years",{col:AG.green,a:fu_fin(tt,P.thirty+0.6,0.5)});x.restore();}};
  // Odyssey's changes, on the hand-off line between the desks
  const odyCards=(x,tt,a)=>{const cards=[["Both units on every hand-off",P.units],["Every critical number checked independently",P.crit],["A second way to find the craft",P.sec]];
    cards.forEach(([s,t0],i)=>fu_blueCard(x,960,656+i*74,s,{a:a*fu_fin(tt,t0-0.2,0.5),k:ag_spr(tt,t0-0.2,0.7),size:28}));
    // a second person's tick beside the first, on the file
    const tk2=fu_fin(tt,P.indep-0.2,0.4)*(1-fu_fin(tt,P.orb-0.6,0.4));if(tk2>0){x.save();x.globalAlpha*=tk2;ag_tick(x,1150,392,30,rgba(AG.green,1),4.5);x.globalAlpha*=fu_fin(tt,P.indep+0.3,0.4);ag_tick(x,1192,392,30,rgba(AG.green,1),4.5);x.restore();}};
  const sh=[
    // the wall: Earth and Mars drawn in graphite; the orbiter leaves; close on it as its thrusters fire; down to the two desks, the
    // builders', the file sliding to the navigators', and back to both
    {at:0,place:"fuWall",d:1.7,push:0,keys:[[0,960,300,1.8],[P.small-0.6,1010,150,2.7],[P.bld-0.3,960,540,1.06],[P.colo,560,560,1.32],[P.sent+0.2,1360,560,1.32],[P.agr-0.4,960,540,1.06]],
      draw:(x,tt)=>{room(x,tt,{people:nav});over(x,tt);}},
    // the navigators' monitor, close: every push counted at less than a quarter of its size, its real size a pale ghost behind it
    {cut:true,at:P.q-0.3,place:"fuWall",keys:[[P.q-0.3,1426,722,3.5]],push:0.03,draw:(x,tt)=>{room(x,tt,{people:nav});}},
    // back to both desks: each team sure; up to the wall for the nine months; the navigators' desk and its emails; thirty years
    {cut:true,at:P.sure-0.4,place:"fuWall",d:1.7,keys:[[P.sure-0.4,960,540,1.06],[P.mon-0.3,960,300,1.8],[P.apr-0.3,1355,540,1.7],[P.rou-0.3,960,560,1.06]],
      draw:(x,tt)=>{room(x,tt,{people:nav,orbits:0});over(x,tt);}},
    // the night of 23 September 1999: the light lower; the engine's glow; behind Mars, on the lower orbit, the radio line ending at
    // the planet's edge; planned, and 170 km lower
    {cut:true,at:P.burn-0.5,place:"fuWallDim",keys:[[P.burn-0.5,1150,240,2.3],[P.behind-0.3,1205,215,2.75]],d:1.8,push:0,draw:(x,tt)=>{
      room(x,tt,{empty:true,orbits:fu_fin(tt,P.km-0.4,0.6),lowA:1,radio:ag_in(tt,P.burn-0.3,0.6)*(1-fu_fin(tt,P.never+0.6,1.4)),dim:0.15});
      const M=S9.mars;fu_pencil(x,"planned",M[0]+S9.plan[0]+14,M[1]-22,{size:28,a:fu_fin(tt,P.km-0.2,0.5)});
      ag_T(x,"170 km lower",M[0]+S9.low[0]+18,M[1]+34,{w:700,size:28,col:AG.amber,a:fu_fin(tt,P.lower-0.3,0.5)});}},
    // the navigators' monitor in the dark: a flat, empty line
    {cut:true,at:P.never+0.5,place:"fuWallDim",keys:[[P.never+0.5,1428,690,2.6],[P.never+0.6,1428,694,2.7]],d:2,draw:(x,tt)=>{room(x,tt,{people:{},crt:{L:{p:1},R:{flat:1}},dim:0.15,craft:null});}},
    // both desks, the light going down: years of work, lost; then the picture steps back under a pale veil
    {cut:true,at:P.lost-0.4,place:"fuWallDim",keys:[[P.lost-0.4,960,540,1.12],[P.lost-0.3,960,540,1.04]],d:4,draw:(x,tt)=>{room(x,tt,{people:{},crt:{L:{p:1},R:{flat:1}},craft:null,dim:0.15+0.35*fu_fin(tt,P.were,1.2)});}},
    // 2001: Odyssey on the same way, and its team's three changes; the file's tag filled; a second person's tick; a second way to find it
    {cut:true,at:P.ody-0.6,place:"fuWall",keys:[[P.ody-0.6,960,500,1.12]],push:0.02,draw:(x,tt)=>{
      room(x,tt,{people:{},craft:null,real:0,odyssey:{u:ag_keys(tt,[[P.mo,0.1],[P.orb,0.85]]),a:fu_fin(tt,P.mo-0.3,0.6),s:0.5},oRadio:fu_fin(tt,P.sec-0.2,0.6),second:clamp((tt-P.sec)/1.6,0,1)});
      over(x,tt);odyCards(x,tt,1);}},
    // Odyssey goes into orbit round Mars, on the orbit planned; twenty years later, still at work
    {cut:true,at:P.orb-0.3,place:"fuWall",keys:[[P.orb-0.3,1180,250,2.2],[P.into,1230,250,2.5]],d:1.8,draw:(x,tt)=>{
      const thO=tt<P.into?null:(tt-P.into)*0.9;room(x,tt,{empty:true,craft:null,real:0,orbits:0,odyssey:{u:ag_keys(tt,[[P.orb-0.3,0.86],[P.into,1]]),th:thO,a:1,s:0.46}});
      if(thO!=null)fu_orbit(x,S9.plan,"front",fu_fin(tt,P.into,0.8),rgba(FU.graphite,0.7),[3,9]);
      const M=S9.mars,yr=tt<P.twenty?"2001":(tt<P.twenty+1.2?String(2001+Math.floor((tt-P.twenty)/1.2*20)):"2021");
      ag_pill(x,M[0],M[1]+M[2]+108,yr,{a:fu_fin(tt,P.into+0.6,0.5),size:30});
      ag_T(x,"still at work",M[0],M[1]+M[2]+168,{w:700,size:28,align:"center",col:AG.green,a:fu_fin(tt,P.work-0.2,0.5)});}},
    // today: the same stage, a person on the left and the agent's sphere in its ring on the right, a number between them; over each,
    // a bubble, its meaning turned away; said, both turn to the same word, and the number is checked against something else
    {at:P.risk-0.4,place:"fuData",keys:[[P.risk-0.4,960,540,1.06],[P.risk-0.3,960,540,1.0]],d:6,draw:(x,tt)=>{
      fu_junDesk(x,tt,{gaze:[4,0],smile:0.3});
      ag_loop(x,1440,400,{R:150,r:72,label:null,core:0.7,think:0.2+0.3*ag_io(tt,P.eachSure-0.6,P.say,0.5),t:tt,a:fu_fin(tt,P.agents-0.2,0.6),floor:null});
      ag_roomLight(x,1);
      const say=fu_fin(tt,P.say,0.8),tag=say>0.5?"people":"",out=1-fu_fin(tt,P.br-0.3,0.7);
      fu_numberCard(x,560,330,"2,880",tag,{a:fu_fin(tt,P.agents,0.6)*out,k:ag_spr(tt,P.agents,0.7),fill:say});
      const turn=lerp(0.12,1,ag_sine((tt-P.say)/0.8));
      fu_bubble(x,330,292,"people",{a:fu_fin(tt,P.person-0.1,0.5)*out,k:ag_spr(tt,P.person-0.1,0.7),px:322,py:378,blank:tt<P.say+0.4,turn,w:230});
      fu_bubble(x,1440,152,"people",{a:fu_fin(tt,P.eachSure-0.6,0.5)*out,k:ag_spr(tt,P.eachSure-0.6,0.7),px:1440,py:238,blank:tt<P.say+0.4,turn,w:230,edge:AG.violet});
      const ck=fu_fin(tt,P.check,0.6)*out;if(ck>0){fu_facList(x,lerp(1300,940,ag_sine((tt-P.check)/1.0)),316,{a:ck,w:300,h:200});
        if(tt>P.check+1.1)ag_tick(x,1206,474,34*ag_eo(clamp((tt-P.check-1.1)/0.4,0,1)),rgba(AG.green,1),5);}}}
  ];
  ag_shots(ctx,S,t,sc.dur,sh,0.5);
  // when and where, in the corner
  fu_when(ctx,"1998","Mars Climate Orbiter",fu_fin(t,0.4,0.6)*(1-fu_fin(t,P.bld-0.6,0.4)));
  fu_when(ctx,"April 1999","California",fu_fin(t,P.apr-0.2,0.5)*(1-fu_fin(t,P.burn-0.6,0.4)));
  fu_when(ctx,"23 September 1999","at Mars",fu_fin(t,P.burn-0.2,0.5)*(1-fu_fin(t,P.lost+1.0,0.5)));
  fu_when(ctx,"2001","Mars Odyssey",fu_fin(t,P.ody-0.3,0.5)*(1-fu_fin(t,P.risk-0.6,0.4)));
  fu_when(ctx,"Today","the same risk",fu_fin(t,P.risk,0.5)*(1-fu_fin(t,P.br,0.4)));
  // the Odyssey cards and file stay legible over the first wide; "Something had to change": a pale veil
  ag_veil(ctx,S,0.55*ag_io(t,P.chg-0.2,P.ody-0.4,0.5));
  ag_veil(ctx,S,0.65*ag_in(t,P.br,0.8));ag_title(ctx,S,t,P.br,"It feels like understanding",null,"FILM 4 OF 10 · WHAT AN AGENT IS");});

/* ---------------------------------------------------------------- today's agent at work: o {ask (when Jun asks it), read, query, check,
   done (the answer's moment)}, as times; the hands reach to the catalog and the query, data rides back, the ring turns once on the check */
function fu_agentAt(x,tt,T,o){o=o||{};const back=ag_sine((tt-T.check-0.4)/1.2),hold=1-back,
    reach=[ag_sine((tt-T.read+0.3)/0.9)*hold,ag_sine((tt-T.query+0.1)/0.9)*hold,0.3*ag_sine((tt-T.read)/1.4)],
    data=[clamp((tt-T.read-0.6)/1.5,0,1),clamp((tt-T.query-0.5)/1.5,0,1),0],
    touch=[ag_io(tt,T.read+0.4,T.check,0.3),ag_io(tt,T.query+0.5,T.check+0.3,0.3),0],
    think=(o.think==null?0.15:o.think)+0.6*ag_io(tt,T.ask,T.done+0.6,0.6),pulse=tt>T.check-0.1&&tt<T.check+1.5?(tt-T.check+0.1)/1.4*360-90:null,
    lit=tt>T.check&&tt<T.done?2:(tt>T.read-0.3&&tt<T.check?1:(tt>T.ask+0.3&&tt<T.read-0.3?0:null));
  fu_agent(x,tt,{core:0.7+0.3*think,think,lit,col:lit===2?AG.green:AG.violet,pulse,reach,data,touch,a:o.a,frost:o.frost,toolsA:o.toolsA});}
// a card carried across a cut, in the frame's own coordinates: from a to b (each [x, y, scale]) as u runs 0 to 1, with a soft arc
function fu_carry(ctx,S,u,a,b,draw){if(u<=0||u>=1)return;setScreen(ctx,S);const k=ag_sine(u),x=lerp(a[0],b[0],k),y=lerp(a[1],b[1],k)-Math.sin(Math.PI*k)*60,s=lerp(a[2],b[2],k);
  ctx.save();ctx.translate(x,y);ctx.scale(s,s);draw(ctx);ctx.restore();}

// ---- 2 · A fluent answer: Anil plans the advisers; Jun asks the agent; 2,160 students, a passing check and its evidence ----
scene("fluent",(ctx,S,t,sc)=>{const c=sc.cues,P=fu_once(sc,"P",()=>({
    anil:wAt(sc,"today","Anil Kurian"),plans:wAt(sc,"today","plans"),adv:wAt(sc,"today","student advisers"),
    calls:c.calls,each:wAt(sc,"calls","Each adviser"),n240:wAt(sc,"calls","two hundred and forty"),once:wAt(sc,"calls","once a term"),see:wAt(sc,"calls","to see"),
    asks:c.asks,jun:wAt(sc,"asks","Jun"),team:wAt(sc,"asks","data team"),many:wAt(sc,"asks","how many"),
    agent:c.agent,ag:wAt(sc,"agent","the agent"),hands:c.hands,read:wAt(sc,"hands","read the catalog"),query:wAt(sc,"hands","run a query"),
    checks:wAt(sc,"hands","checks the count"),source:wAt(sc,"hands","the source"),ans:c.answer,two:wAt(sc,"answer","two thousand"),
    sixty:wAt(sc,"answer","sixty-three"),evid:wAt(sc,"answer","evidence attached"),study:c.study,longer:wAt(sc,"study","longer explanations"),
    conf:wAt(sc,"study","more confident"),acc:wAt(sc,"study","no more accurate"),feels:c.feels,safe:wAt(sc,"feels","feels safe")}));
  const T={ask:P.ag,read:P.read,query:P.query,check:P.checks,done:P.ans};
  // the advisers along the faculty's wall: each with a phone and a list, "240"; a soft ring on one phone
  const adv=(x,tt)=>{x.save();ag_about(x,200,170,1.15);fu_advisers(x,200,170,4,36,i=>({a:fu_fin(tt,P.each+0.7+i*0.16,0.4),list:{n:6,done:6,p:clamp((tt-P.once+0.2)/1.4-i*0.12,0,1)},ring:i===1?clamp((tt-P.see+0.5)/1.6,0,1):0}));x.restore();};
  const jun=(x,tt,o)=>fu_junDesk(x,tt,Object.assign({gaze:tt<P.ag-0.3?[4,-1]:(tt<P.ans?[6,-1]:[4,-3]),smile:0.3+0.4*fu_fin(tt,P.two,0.8),nod:-0.03*fu_fin(tt,P.ag-0.2,0.5)*(1-fu_fin(tt,P.ans,0.6))},o||{}));
  const SC={x:960,y:520,z:1.04};
  const sh=[
    // the Faculty of Health: Anil at his desk, his screen, "Advisers next term"; out to the wall and its advisers
    {at:0,place:"fuFaculty",d:1.8,keys:[[0,1152,560,1.25],[P.calls-0.6,960,540,1.0]],draw:(x,tt)=>{
      adv(x,tt);fu_anilDesk(x,tt,{caret:true,t:tt,gaze:tt>P.asks?[2,-2]:[3,0]});ag_roomLight(x,1);
      fu_nameCard(x,1480,180,"Anil Kurian","Faculty of Health",fu_fin(tt,P.anil-0.2,0.5));
      fu_say(x,820,150,440,"How many students does the faculty have this term?",{tail:{side:"right",at:0.75,px:1410,py:400},a:fu_fin(tt,P.asks-0.1,0.4)*(1-fu_fin(tt,P.team-0.2,0.25)),k:ag_spr(tt,P.asks-0.1,0.7)});}},
    // the data team: Jun reads the question and asks the agent; its hands, the data back, the check; the answer, with its evidence
    {at:P.team-0.2,place:"fuData",keys:[[P.team-0.2,SC.x,SC.y,SC.z]],push:0.02,draw:(x,tt)=>{
      fu_agentAt(x,tt,T);jun(x,tt);ag_roomLight(x,1);
      fu_check(x,1150,640,fu_fin(tt,P.source,0.5));
      fu_answer(x,520,150,{a:fu_fin(tt,P.ans-0.1,0.5),k:ag_spr(tt,P.ans-0.1,0.8)});
      fu_say(x,520,150,440,"How many students does the faculty have this term?",{tail:{side:"bottom",at:0.1,px:390,py:400},a:fu_fin(tt,P.team+1.2,0.2)*(1-fu_fin(tt,P.ag-0.1,0.2))});}},
    // the number goes back to Anil, who types it where the caret was
    {at:P.evid+0.5,place:"fuFaculty",keys:[[P.evid+0.5,1371,600,1.75]],push:0.02,draw:(x,tt)=>{
      adv(x,tt);const ty=clamp((tt-P.evid-1.4)/0.7,0,1);fu_anilDesk(x,tt,{value:"2,160",typed:ty,unit:"students",unitA:ag_in(ty,0.9,0.1),caret:ty<1,t:tt,gaze:[2,1]});ag_roomLight(x,1);}},
    // the 2025 study: a short answer and a long one; confidence rises with the long one, accuracy stays where it is
    {at:P.study-0.3,place:"fuQuiet",keys:[[P.study-0.3,960,520,1.0]],push:0.03,draw:(x,tt)=>{
      const sw=ag_tw(x,"Steyvers and colleagues",{w:700,size:30})+ag_tw(x,"2025",{w:500,size:30})+92;fu_source(x,960-sw/2,120,"Steyvers and colleagues","2025",fu_fin(tt,P.study,0.5));
      const ca=fu_fin(tt,P.study+0.4,0.5);fu_studyCard(x,250,260,520,2,"short",{a:ca,k:ag_spr(tt,P.study+0.4,0.7)});
      fu_studyCard(x,1110,260,560,8,"long",{a:ca,k:ag_spr(tt,P.study+0.6,0.7),shown:lerp(2,8,ag_sine((tt-P.longer)/1.6))});
      const ba=fu_fin(tt,P.conf-0.6,0.5),cf=lerp(0.42,0.86,ag_sine((tt-P.conf)/1.3)),hi=ag_io(tt,P.acc,P.feels+2,0.4);
      fu_bar(x,250,654,"confidence",0.42,{a:ba,col:AG_OAK.dark});fu_bar(x,250,722,"accuracy",0.5,{a:ba,hi});
      fu_bar(x,1110,654,"confidence",cf,{a:ba,col:AG_OAK.dark});fu_bar(x,1110,722,"accuracy",0.5,{a:ba,hi});}},
    // back at Jun's desk: the answer glows softly, and Jun leans back
    {at:P.feels-0.5,place:"fuData",keys:[[P.feels-0.5,690,500,1.25],[P.feels-0.4,686,500,1.28]],d:3,draw:(x,tt)=>{
      fu_agentAt(x,tt,T,{think:0,toolsA:0});jun(x,tt,{lean:fu_fin(tt,P.feels,1.4),smile:0.75,gaze:[4,-3]});ag_roomLight(x,1);
      fu_check(x,1150,640,1);const b=fu_answer(x,520,150,{a:0});fu_glow(x,b.card,fu_fin(tt,P.feels-0.2,1.2));fu_answer(x,520,150,{});}},
    // across the campus, Anil nods
    {at:P.safe-0.2,place:"fuFaculty",keys:[[P.safe-0.2,1371,600,1.75],[P.safe-0.1,1371,598,1.78]],d:3,draw:(x,tt)=>{
      adv(x,tt);const nd=Math.sin(clamp((tt-P.safe)/1.2,0,1)*Math.PI*2)*0.06;fu_anilDesk(x,tt,{value:"2,160",unit:"students",t:tt,nod:nd,smile:0.5,gaze:[2,1]});ag_roomLight(x,1);}}
  ];
  ag_shots(ctx,S,t,sc.dur,sh,0.5);
  // Anil's question, carried across the cut to Jun's desk; Jun passes it to the agent
  const sz=(z,wx,wy)=>[(wx-SC.x)*z+960,(wy-SC.y)*z+540];
  fu_carry(ctx,S,clamp((t-P.team+0.25)/1.45,0,1),[820+220,150+63,1],[...sz(SC.z,520+220,150+63),SC.z],c=>fu_say(c,-220,-63,440,"How many students does the faculty have this term?",{}));
  const into=clamp((t-P.ag+0.1)/0.9,0,1);if(into>0&&into<1){const s0=sz(SC.z,520+220,213),s1=sz(SC.z,1150,400),sc=lerp(SC.z,0.12,ag_sine(into));
    fu_carry(ctx,S,into,[...s0,SC.z],[...s1,0.12],c=>fu_say(c,-220,-63,440,"How many students does the faculty have this term?",{a:Math.pow(clamp((sc-0.12)/(SC.z-0.12),0,1),6)}));}
  // the number, carried back to Anil
  fu_carry(ctx,S,clamp((t-P.evid-0.1)/1.3,0,1),[...sz(SC.z,660,226),1],[(1290-1371)*1.75+960,(690-600)*1.75+540,1.4],c=>ag_pill(c,0,0,"2,160 students",{size:30}));
  fu_when(ctx,"Today","Faculty of Health",fu_fin(t,0.5,0.6)*(1-fu_fin(t,P.team-0.5,0.4)));
  fu_when(ctx,"Today","the data team",fu_fin(t,P.team+0.2,0.5)*(1-fu_fin(t,P.evid+0.2,0.4)));});

// ---- 3 · Explain it: the zip test, the 2002 study at Yale; Jun's six, three questions he can't answer, the agent behind frosted glass ----
scene("explain",(ctx,S,t,sc)=>{const c=sc.cues,P=fu_once(sc,"P",()=>({
    try:c.try,how:wAt(sc,"try","how well"),zip:wAt(sc,"try","a zip"),one:wAt(sc,"try","from one to seven"),
    now:c.now,explain:wAt(sc,"now","explain"),step:wAt(sc,"now","step by step"),closes:wAt(sc,"now","closes and opens"),
    yale:c.yale,at:wAt(sc,"yale","at Yale"),asked:wAt(sc,"yale","asked people"),every:wAt(sc,"yale","everyday things"),like:wAt(sc,"yale","like a zip"),
    lower:c.lower,rated:wAt(sc,"lower","rated themselves lower"),six:c.six,asix:wAt(sc,"six","a six"),table:c.table,student:c.student,compare:c.compare,
    cant:c.cant,rough:wAt(sc,"cant","not even roughly"),came:c.came,know:wAt(sc,"came","not from knowing")}));
  const sh=[
    // the zip, drawn large, and seven dots under it; then three blank lines beside it, and the pencil that doesn't write
    {at:0,place:"fuQuiet",keys:[[0,960,520,1.04]],push:0.04,draw:(x,tt)=>{
      const mv=ag_sine((tt-P.now+0.4)/1.6),x0=lerp(300,130,mv),x1=lerp(1620,1010,mv),zy=lerp(430,410,mv);
      const sl=lerp(0.18,0.42,ag_sine((tt-P.closes+0.3)/1.4)),op=ag_sine((tt-P.closes)/1.4)*0.9;
      fu_zip(x,x0,x1,zy,{sl,open:op,a:fu_fin(tt,0.3,0.8)});
      // the viewer's own rating: the dots light one by one to five, held; after trying, they slip back to three
      const up=clamp((tt-P.one)/1.6*5,0,5),down=ag_sine((tt-P.rated)/1.2)*2;
      fu_scale(x,lerp(960,570,mv),736,up-down,{a:fu_fin(tt,P.how,0.6),k:null});
      // explain, step by step: three numbered blank lines, the pencil hovering over the first
      const bl=fu_fin(tt,P.explain,0.4)*(1-fu_fin(tt,P.every-0.6,0.4));fu_blankLines(x,1140,330,560,bl,{p:clamp((tt-P.explain)/1.2,0,1)});
      if(bl>0)withA(x,bl,()=>fu_pencilIcon(x,1250,300-8*Math.sin(tt*2.2)-12*ag_spr(tt,P.step,0.6),-0.5,0.9));
      // the study at Yale: its source; everyday things join the zip
      const sw=ag_tw(x,"Rozenblit and Keil, 2002",{w:700,size:30})+ag_tw(x,"Yale",{w:500,size:30})+92;fu_source(x,960-sw/2,110,"Rozenblit and Keil, 2002","Yale",fu_fin(tt,P.yale,0.5));
      const ev=k=>fu_fin(tt,P.every+0.1+k*0.35,0.5);fu_lockKey(x,1230,420,1.1,ev(0));fu_cistern(x,1460,420,1.1,ev(1));fu_pianoKeys(x,1680,420,1.1,ev(2));}},
    // Jun's own rating: six, quickly; three questions; the agent slips behind frosted glass, and the six falls to two
    {at:P.six-0.6,place:"fuData",keys:[[P.six-0.6,960,520,1.04],[P.six-0.5,960,520,1.0]],d:8,draw:(x,tt)=>{
      fu_agent(x,tt,{core:0.75,think:0.15,frost:ag_sine((tt-P.cant)/1.3)});
      fu_junDesk(x,tt,{gaze:tt<P.table?[4,-2]:[6,-1],smile:0.55*(1-fu_fin(tt,P.cant,1.2))+0.15,nod:0.04*fu_fin(tt,P.rough,1)});ag_roomLight(x,1);
      const b=fu_answer(x,520,150,{a:0});fu_glow(x,b.card,1-fu_fin(tt,P.know-0.4,1.6));fu_answer(x,520,150,{});
      const six=clamp((tt-P.asix+0.2)/0.9*6,0,6),fall=clamp((tt-P.rough)/1.6*4,0,4);fu_scale(x,730,476,six-fall,{gap:60,r:18,a:fu_fin(tt,P.six-0.2,0.5)});
      [["Which table did it read?",P.table],["What counted as a student?",P.student],["What did its check compare?",P.compare]].forEach(([q,t0],i)=>
        fu_question(x,1150,656+i*74,q,{a:fu_fin(tt,t0-0.15,0.4),k:ag_spr(tt,t0-0.15,0.7)}));}}
  ];
  ag_shots(ctx,S,t,sc.dur,sh,0.5);});

// ---- 4 · Right every time: months of right answers; the doubt in the chat, let go; the 2010 review; 9 advisers planned, 12 needed ----
scene("right",(ctx,S,t,sc)=>{const c=sc.cues,P=fu_once(sc,"P",()=>({
    months:c.months,right:wAt(sc,"months","been right"),stopped:wAt(sc,"months","stopped opening"),chat:c.chat,wrote:wAt(sc,"chat","wrote in a chat"),
    long:wAt(sc,"chat","looked long"),replied:c.replied,checked:wAt(sc,"replied","checked its source"),go:wAt(sc,"replied","let it go"),
    review:c.review,raja:wAt(sc,"review","Raja"),aids:wAt(sc,"review","automated aids"),busy:c.busy,longtime:wAt(sc,"busy","right for a long time"),
    stop:wAt(sc,"busy","stop checking"),above:wAt(sc,"busy","above all"),experts:c.experts,exp:wAt(sc,"experts","experts too"),training:wAt(sc,"experts","training alone"),
    routine:c.routine,mars:wAt(sc,"routine","orbiting Mars"),feel:wAt(sc,"routine","feel routine"),planned:c.planned,nine:wAt(sc,"planned","nine advisers"),
    needed:c.needed,twelve:wAt(sc,"needed","twelve"),seven:wAt(sc,"needed","seven hundred and twenty"),call:wAt(sc,"needed","never had their call")}));
  const cal=(x,tt)=>fu_calendar(x,530,150,{w:400,turn:clamp((tt-0.3)/3.4*10,0,10),ticks:clamp((tt-P.right+0.2)/2.6*10,0,10)});
  const dust=fu_fin(t,P.stopped,2.2);
  const sh=[
    // Jun's desk: the calendar turning, a tick on every month; the evidence folder, closed, gathering dust; the chat, and the doubt let go
    {at:0,place:"fuData",keys:[[0,960,520,1.04]],push:0.03,draw:(x,tt)=>{
      cal(x,tt);fu_agent(x,tt,{core:0.75,think:0.1});const typing=tt<P.chat-0.3||tt>P.go+0.4;
      fu_junDesk(x,tt,{gaze:typing?[3,2]:[5,-2],folder:{dust:fu_fin(tt,P.stopped,2.2)},smile:0.35});ag_roomLight(x,1);
      const up=ag_sine((tt-P.go)/1.6),ca=1-up;
      fu_chat(x,720,630-up*44,440,"Anil Kurian","The advisers' lists look long this term.",{a:fu_fin(tt,P.wrote,0.5)*ca,k:ag_spr(tt,P.wrote,0.7)});
      fu_chat(x,1190,650-up*44,420,"Jun","The agent checked its source",{tick:true,a:fu_fin(tt,P.replied,0.5)*ca,k:ag_spr(tt,P.replied,0.7)});}},
    // the 2010 review: a person at a desk with an aid that's been right a long time; busy, their eyes leave it; an expert does the same;
    // training, hung between them, changes nothing
    {at:P.review-0.4,place:"fuQuiet",keys:[[P.review-0.4,960,540,1.04],[P.review-0.3,960,540,1.0]],d:12,draw:(x,tt)=>{
      const sw=ag_tw(x,"Parasuraman and Manzey",{w:700,size:30})+ag_tw(x,"2010",{w:500,size:30})+92;fu_source(x,960-sw/2,100,"Parasuraman and Manzey","2010",fu_fin(tt,P.review,0.5));
      const busy=ag_sine((tt-P.above)/1.0),busy2=ag_sine((tt-P.exp-0.2)/1.0),n=clamp((tt-P.longtime)/2.2*6,0,6);
      ag_desk(x,150,860,640,{});ag_desk(x,1130,860,640,{});
      ag_person(x,FU_AID_PEOPLE.p1,420,610,0.56,{t:tt,cut:790,gaze:busy>0.5?[2,4]:[5,0],nod:0.05*busy});
      ag_person(x,FU_AID_PEOPLE.p2,1500,610,0.56,{t:tt+1.3,flip:true,cut:790,gaze:busy2>0.5?[2,4]:[5,0],nod:0.05*busy2,a:fu_fin(tt,P.exp-0.6,0.6)});
      fu_aid(x,580,662,{n,a:fu_fin(tt,P.raja,0.6)});fu_aid(x,1190,662,{n:clamp((tt-P.exp)/1.2*6,0,6),a:fu_fin(tt,P.exp-0.4,0.6)});
      ag_roomLight(x,1);
      fu_mobile(x,lerp(80,470,busy),806,busy);fu_papers(x,lerp(60,330,busy),818,4,busy);
      fu_mobile(x,lerp(1840,1450,busy2),806,busy2);fu_papers(x,lerp(1860,1590,busy2),818,4,busy2);
      fu_tag(x,960,330,"training",{a:fu_fin(tt,P.training-0.2,0.5),sway:0.06*Math.sin((tt-P.training)*2.4)*ag_in(tt,P.training,0.4),len:140});}},
    // back at Jun's desk: like the thirty years of the opening, a run of ticks along the skirting, under the calendar's
    {at:P.routine-0.4,place:"fuData",keys:[[P.routine-0.4,960,520,1.04],[P.routine-0.3,960,520,1.0]],d:3,draw:(x,tt)=>{
      cal(x,tt);const tk=fu_fin(tt,P.mars-0.2,0.4)*(1-fu_fin(tt,P.feel+0.8,0.8));if(tk>0)withA(x,tk,()=>{for(let i=0;i<30;i++){const k=clamp((tt-P.mars-i*0.04)/0.3,0,1);if(k>0)ag_tick(x,120+i*57,640,18*ag_eo(k),rgba(AG.green,1),3.4);}});
      fu_agent(x,tt,{core:0.75,think:0.1});fu_junDesk(x,tt,{gaze:[3,2],folder:{dust:1},smile:0.35});ag_roomLight(x,1);}},
    // the end of the term at the Faculty of Health: nine advisers planned; three more needed; 720 students without their call
    {at:P.planned-0.4,place:"fuFaculty",keys:[[P.planned-0.4,960,540,1.04],[P.planned-0.3,960,540,1.0]],d:8,draw:(x,tt)=>{
      const am=fu_fin(tt,P.seven-0.2,0.9);
      for(let i=0;i<12;i++){const ax=70+i*112;if(i<9)fu_adviser(x,ax,150,{a:fu_fin(tt,P.planned-0.4+i*0.08,0.4),label:null,list:{n:8,done:6,amber:am>0.5?2:0}});
        else fu_adviser(x,ax,150,{dashed:true,a:fu_fin(tt,P.twelve-0.1+(i-9)*0.18,0.4)});}
      fu_anilDesk(x,tt,{value:"9",unit:"advisers",t:tt,gaze:[1,-3]});ag_roomLight(x,1);
      fu_bracket(x,70,1066,446,"9 advisers",{a:fu_fin(tt,P.nine-0.2,0.4),p:clamp((tt-P.nine+0.2)/0.8,0,1)});
      fu_bracket(x,1078,1402,446,"12 needed",{a:fu_fin(tt,P.twelve,0.4),p:clamp((tt-P.twelve)/0.8,0,1),col:AG.amber});
      ag_pill(x,736,580,"720 students · no call",{col:AG.amber,a:am});}}
  ];
  ag_shots(ctx,S,t,sc.dur,sh,0.5);
  fu_when(ctx,"Early in the term",null,fu_fin(t,P.chat-0.2,0.5)*(1-fu_fin(t,P.review-0.6,0.4)));
  fu_when(ctx,"End of term","Faculty of Health",fu_fin(t,P.planned-0.2,0.5)*(1-fu_fin(t,sc.dur-0.6,0.4)));});

// ---- 5 · One word, two meanings: 2,880 people on the lists; the table counted full-time equivalents; neither asked; the check closed its
// own circle; the record of what the agent's hands did said it all along ----
scene("meanings",(ctx,S,t,sc)=>{const c=sc.cues,P=fu_once(sc,"P",()=>({
    counted:c.counted,anil:wAt(sc,"counted","Anil counted"),lists:wAt(sc,"counted","the advisers' lists"),n2880:wAt(sc,"counted","two thousand"),
    load:c.load,from:wAt(sc,"load","student load"),reports:wAt(sc,"load","reports to the government"),half:c.half,two:wAt(sc,"half","two half-time"),
    one:wAt(sc,"half","count as one"),studies:wAt(sc,"half","half the faculty"),fte:c.fte,said:wAt(sc,"fte","the table said"),ftes:wAt(sc,"fte","full-time equivalents"),
    notp:wAt(sc,"fte","not people"),meant:c.meant,jm:wAt(sc,"meant","Jun meant"),took:wAt(sc,"meant","the agent took"),neither:c.neither,
    people:c.people,say:wAt(sc,"people","say it back"),ask:wAt(sc,"people","or ask"),study:c.study,less:wAt(sc,"study","do this less"),
    presume:wAt(sc,"study","presume"),same:c.same,compared:wAt(sc,"same","compared its total"),passed:wAt(sc,"same","so it passed"),
    record:c.record,hands:wAt(sc,"record","what its hands did"),along:wAt(sc,"record","all along"),added:wAt(sc,"record","full-time equivalents")}));
  const SC={x:960,y:520,z:1.04};
  const sh=[
    // the end of the term: Anil counts the nine lists, 2,880; the agent said 2,160; the gap, 720
    {at:0,place:"fuFaculty",keys:[[0,960,540,1.04]],push:0.03,draw:(x,tt)=>{
      for(let i=0;i<12;i++){const ax=70+i*112,hl=ag_io(tt,P.lists+i*0.18,P.lists+i*0.18+0.5,0.2);
        if(i<9)fu_adviser(x,ax,150,{label:null,list:{n:8,done:6,amber:2}});else fu_adviser(x,ax,150,{dashed:true});
        if(i<9&&hl>0)withA(x,hl*0.6,()=>{x.strokeStyle=rgba([74,80,92],0.9);x.lineWidth=3;rr(x,ax-4,146,108,266,16);x.stroke();});}
      fu_anilDesk(x,tt,{value:"9",unit:"advisers",t:tt,gaze:[1,-3]});ag_roomLight(x,1);
      fu_gapBars(x,140,560,{a:fu_fin(tt,P.n2880-0.5,0.5),p1:clamp((tt-P.n2880+0.3)/1.0,0,1),p2:clamp((tt-P.n2880-0.9)/1.0,0,1),gap:fu_fin(tt,P.n2880+1.9,0.6)});}},
    // student load, the table the agent read: its column, "students"; full-time and half-time students; each half-time pair counts as one
    {at:P.load-0.4,place:"fuQuiet",keys:[[P.load-0.4,960,470,1.04],[P.load-0.3,960,470,1.0]],d:14,draw:(x,tt)=>{
      fu_loadTable(x,300,60,1320,780,{a:fu_fin(tt,P.load-0.2,0.5),note:fu_fin(tt,P.ftes,0.6),students:clamp((tt-P.two+0.4)/1.4,0,1),labels:fu_fin(tt,P.two+0.8,0.5),
        close:clamp((tt-P.one)/1.4,0,1),sum:fu_fin(tt,P.said-0.2,0.6)});}},
    // one word in the middle, two meanings: Jun's bubble holds a person; the agent's, violet, "full-time equivalents"; nothing passes between
    {cut:true,at:P.meant-0.4,place:"fuData",keys:[[P.meant-0.4,SC.x,SC.y,SC.z]],push:0.03,draw:(x,tt)=>{
      fu_agent(x,tt,{core:0.75,think:0.3});fu_junDesk(x,tt,{gaze:[4,-3],folder:{dust:1}});ag_roomLight(x,1);
      ag_T(x,"students",760,560,{w:800,size:64,align:"center",a:fu_fin(tt,P.jm-0.4,0.5)});
      fu_bubble(x,340,292,"",{w:150,a:fu_fin(tt,P.jm,0.5),k:ag_spr(tt,P.jm,0.7),px:322,py:378,draw:(c,bx,by)=>fu_figure(c,bx,by+12,0.62,FU_STU)});
      fu_bubble(x,1150,168,"full-time equivalents",{a:fu_fin(tt,P.took,0.5),k:ag_spr(tt,P.took,0.7),px:1150,py:236,edge:AG.violet,size:30});}},
    // people check they've understood each other: "You mean…?", "Yes.", and a small tick between them
    {at:P.people-0.4,place:"fuQuiet",keys:[[P.people-0.4,960,560,1.1],[P.people-0.3,960,556,1.14]],d:5,draw:(x,tt)=>{
      ag_desk(x,560,880,800,{});ag_person(x,FU_TALK.a,640,640,0.6,{t:tt,cut:810,gaze:[5,-1],talk:ag_io(tt,P.say-0.2,P.say+0.9,0.15)*0.8});
      ag_person(x,FU_TALK.b,1280,640,0.6,{t:tt+1.1,flip:true,cut:810,gaze:[5,-1],nod:0.05*Math.sin(clamp((tt-P.ask+0.2)/0.9,0,1)*Math.PI*2),talk:ag_io(tt,P.ask,P.ask+0.6,0.15)*0.7});ag_roomLight(x,1);
      fu_say(x,690,250,260,"You mean…?",{title:true,tail:{side:"bottom",at:0.2,px:700,py:430},a:fu_fin(tt,P.say-0.3,0.4),k:ag_spr(tt,P.say-0.3,0.7)});
      fu_say(x,1010,330,170,"Yes.",{title:true,tail:{side:"bottom",at:0.8,px:1210,py:470},a:fu_fin(tt,P.ask-0.1,0.4),k:ag_spr(tt,P.ask-0.1,0.7)});
      const tk=clamp((tt-P.ask-0.5)/0.4,0,1);if(tk>0)ag_tick(x,960,520,40*ag_eo(tk),rgba(AG.green,1),6);}},
    // the 2024 study: the agent goes straight to its answer, past the place where its question would have gone
    {at:P.study-0.4,place:"fuData",keys:[[P.study-0.4,SC.x,SC.y,SC.z]],push:0.03,draw:(x,tt)=>{
      const go=clamp((tt-P.less)/1.6,0,1);fu_agent(x,tt,{core:0.8,think:0.3+0.4*ag_io(tt,P.less-0.4,P.presume+1.2,0.5)});fu_junDesk(x,tt,{gaze:[4,-2],folder:{dust:1}});ag_roomLight(x,1);
      const ph=fu_fin(tt,P.study+0.6,0.6);if(ph>0)withA(x,ph,()=>{x.save();x.setLineDash([9,8]);x.strokeStyle=rgba(AG.mut,0.7);x.lineWidth=2.6;rr(x,700,470,170,72,36);x.stroke();x.restore();
        ag_T(x,"?",785,518,{w:800,size:36,align:"center",col:AG.mut,a:0.8});});
      const path=[990,410,880,470,760,560,740,396];if(go>0)fu_dots(x,path,0,ag_sine(go),{n:44,r:3.4,color:rgba(AG.violet,0.8)});
      fu_answer(x,520,150,{a:fu_fin(tt,P.less+1.4,0.4),k:ag_spr(tt,P.less+1.4,0.8)});
      const sw=fu_source(x,72,60,"Shaikh and colleagues","2024",fu_fin(tt,P.study,0.5));}},
    // the check compared the total with the same table: a closed circle, and the pill passed
    {cut:true,at:P.same-0.4,place:"fuQuiet",keys:[[P.same-0.4,960,500,1.04],[P.same-0.3,960,500,1.0]],d:5,draw:(x,tt)=>{
      fu_answer(x,240,300,{a:fu_fin(tt,P.same-0.3,0.5)});fu_table(x,1200,240,480,300,{a:fu_fin(tt,P.same,0.5),note:1,noteCol:AG.mut});
      const lp=clamp((tt-P.compared)/1.8,0,1);if(lp>0){const top=[700,330,860,200,1060,200,1196,300],bot=[1240,560,1080,700,820,700,640,560];
        fu_line(x,top,0,ag_sine(Math.min(1,lp*2)),{color:rgba(AG.ink,0.6),lw:5});if(lp>0.5)fu_line(x,bot,0,ag_sine(lp*2-1),{color:rgba(AG.ink,0.6),lw:5});
        if(lp>0.45){const q=ag_bz(top,1);ag_arrowHead(x,q[0],q[1],0.62,15,rgba(AG.ink,0.65));}if(lp>=1){const q=ag_bz(bot,1);ag_arrowHead(x,q[0],q[1],-2.4,15,rgba(AG.ink,0.65));}}
      fu_check(x,950,450,fu_fin(tt,P.passed-0.2,0.5));}},
    // Jun opens the evidence at last: what the agent's hands did, line by line; "full-time equivalents" washes amber
    {at:P.record-0.4,place:"fuData",keys:[[P.record-0.4,900,500,1.08],[P.record-0.3,900,498,1.1]],d:6,draw:(x,tt)=>{
      const op=ag_sine((tt-P.record+0.1)/0.9);fu_junDesk(x,tt,{gaze:[5,-3],folder:{dust:1-op,open:op},smile:0.2});ag_roomLight(x,1);
      const rise=ag_sine((tt-P.hands+0.3)/1.0),am=fu_fin(tt,P.added-0.2,0.8);
      x.save();x.translate(0,(1-rise)*500);const r=fu_answer(x,520,110,{a:fu_fin(tt,P.hands-0.3,0.4),open:clamp((tt-P.hands-0.6)/1.4,0,1),side:"right",ew:400,amber:am});x.restore();
      ag_label(x,1000,82,"What its hands did",{col:AG.kick,a:fu_fin(tt,P.hands+0.6,0.5)});
      if(am>0){x.save();x.translate(0,(1-rise)*500);fu_evHighlight(x,r.items[0],0,FU_EV.fte[0].title,"(full-time equivalents)",400,am);fu_evHighlight(x,r.items[1],1,FU_EV.fte[1].title,"“students”,",400,am);x.restore();}}}
  ];
  ag_shots(ctx,S,t,sc.dur,sh,0.5);
  fu_when(ctx,"End of term","Faculty of Health",fu_fin(t,0.4,0.5)*(1-fu_fin(t,P.load-0.6,0.4)));});

// ---- 6 · Knowing, not feeling: the board's lesson; Jun's team's three changes, each beside Odyssey's ----
scene("knowing",(ctx,S,t,sc)=>{const c=sc.cues,P=fu_once(sc,"P",()=>({
    board:c.board,plainly:wAt(sc,"board","plainly"),happen:wAt(sc,"board","mistakes happen"),catch:wAt(sc,"board","catch them"),
    three:c.three,things:wAt(sc,"three","three things"),ody:wAt(sc,"three","Odyssey's team"),
    say:c.say,said:wAt(sc,"say","hear it said back"),unit:wAt(sc,"say","names its unit"),reads:wAt(sc,"say","reads the question back"),before:wAt(sc,"say","before it counts"),
    check:c.check,didnt:wAt(sc,"check","didn't make"),list:wAt(sc,"check","own list"),hands:c.hands,read:wAt(sc,"hands","read what its hands did"),only:wAt(sc,"hands","not only"),
    log:c.log,write:wAt(sc,"log","Write every doubt"),owner:wAt(sc,"log","with an owner"),answered:wAt(sc,"log","answered"),
    decides:c.decides,person:wAt(sc,"decides","a person decides"),tick:wAt(sc,"decides","the agent's tick"),ref:wAt(sc,"decides","only for reference")}));
  // three columns, 80 px in from each side: Jun's team's three changes, each under the change of Odyssey's it follows
  const COL=[355,975,1580],L=[80,680,1320],win=[P.say-0.3,P.check-0.3,P.log-0.3,P.ref+0.6],CY=[210,252,224],
    CH=["Say it, hear it back","Check against something else","Every doubt has an owner"],AT=[P.say,P.check,P.log];
  // the column being said is lit; the others wait, dimmed, until all three stand together at the end
  const lit=(i,tt)=>{if(tt<win[0])return 1;if(tt>=win[3])return lerp(0.42,1,fu_fin(tt,win[3],0.8));return lerp(0.42,1,fu_fin(tt,win[i],0.5)*(1-fu_fin(tt,win[i+1],0.5)));};
  // "three things": a numbered place for each, waiting, until its change is said into it
  const slot=(x,tt,i)=>{const a=fu_fin(tt,P.things-0.1+i*0.3,0.4)*(1-fu_fin(tt,AT[i]-0.1,0.4));if(a<=0.01)return;const w=ag_tw(x,CH[i],{w:800,size:34})+64;
    x.save();x.globalAlpha*=a;ag_about(x,COL[i],CY[i]+37,lerp(0.7,1,ag_spr(tt,P.things-0.1+i*0.3,0.7)));x.setLineDash([9,8]);x.strokeStyle=rgba(AG.mut,0.55);x.lineWidth=2.4;
    rr(x,COL[i]-w/2,CY[i],w,74,20);x.stroke();x.setLineDash([]);ag_T(x,String(i+1),COL[i],CY[i]+50,{w:800,size:36,align:"center",col:AG.mut});x.restore();};
  const sh=[
    // NASA's review board, on the wall where 1999 was drawn: mistakes happen; checks are there to catch them
    {at:0,place:"fuWall",keys:[[0,960,520,1.04]],push:0.03,draw:(x,tt)=>{
      withA(x,0.35,()=>fu_room99(x,tt,{empty:true,craft:null,real:0,orbits:0}));
      fu_quote(x,960,500,"Mistakes happen; checks are there to catch them.","NASA review board, 1999",{a:fu_fin(tt,P.board+0.2,0.6),k:ag_spr(tt,P.board+0.2,0.8)});}},
    // the board: Odyssey's changes along the top, small; Jun's team's under each, with what it looks like at the university
    {at:P.three-0.5,place:"fuQuiet",keys:[[P.three-0.5,960,540,1.04],[P.three-0.4,960,540,1.0]],d:30,push:0.012,draw:(x,tt)=>{
      const oa=k=>fu_fin(tt,P.ody-0.2+k*0.3,0.5),ok=k=>ag_spr(tt,P.ody-0.2+k*0.3,0.7);for(let i=0;i<3;i++)withA(x,lit(i,tt),()=>slot(x,tt,i));
      // 1 · both units on every hand-off: say it, hear it back. Every count names its unit; the agent reads the question back, and waits
      withA(x,lit(0,tt),()=>{fu_blueCard(x,COL[0],120,"Both units on every hand-off",{a:oa(0),k:ok(0),size:28});
        fu_changeCard(x,COL[0],CY[0],CH[0],{a:fu_fin(tt,P.say-0.1,0.5),k:ag_spr(tt,P.say-0.1,0.7)});
        fu_unitCard(x,L[0],316,550,"Census day","people, each counted once",{a:fu_fin(tt,P.unit-0.6,0.5),unitA:fu_fin(tt,P.unit,0.5)});
        fu_unitCard(x,L[0],434,550,"Student load","full-time equivalents",{a:fu_fin(tt,P.unit-0.3,0.5),unitA:fu_fin(tt,P.unit+0.3,0.5)});
        fu_miniAgent(x,L[0]+70,650,0.6,{a:fu_fin(tt,P.reads-0.4,0.5),t:tt,think:0.5});
        ag_textCard(x,L[0]+156,570,394,{sub:"Students in the Faculty of Health, each person counted once?"},{a:fu_fin(tt,P.reads,0.5),k:ag_spr(tt,P.reads,0.7),edge:AG.violet,tail:{side:"left",at:0.5,px:L[0]+124,py:640}});});
      // 2 · critical numbers checked independently, a second way to find the craft: check against something else. The old answer against
      // the faculty's own list shows the gap at once; and read what its hands did
      withA(x,lit(1,tt),()=>{fu_blueCard(x,COL[1],120,"Every critical number checked independently",{a:oa(1),k:ok(1),size:28});
        fu_blueCard(x,COL[1],178,"A second way to find the craft",{a:oa(1),k:ok(1),size:28});
        fu_changeCard(x,COL[1],CY[1],CH[1],{a:fu_fin(tt,P.check-0.1,0.5),k:ag_spr(tt,P.check-0.1,0.7)});
        fu_countMini(x,L[1],352,206,"Answer","2,160","students",{kick:true,a:fu_fin(tt,P.didnt-0.4,0.5)});
        fu_countMini(x,L[1]+256,352,334,"The faculty's own list","2,880","people",{a:fu_fin(tt,P.list-0.3,0.5),k:ag_spr(tt,P.list-0.3,0.7)});
        fu_notEquals(x,L[1]+231,425,fu_fin(tt,P.list+0.6,0.4));ag_T(x,"720",L[1]+231,536,{w:800,size:32,align:"center",col:AG.amber,a:fu_fin(tt,P.list+0.9,0.4)});
        fu_recordMini(x,COL[1]-280,560,560,{a:fu_fin(tt,P.read-0.3,0.5),amber:fu_fin(tt,P.read+0.4,0.6),finger:clamp((tt-P.read)/2.2,0,1)});});
      // 3 · the emails of 1999, gathered at last into one page: every doubt has an owner. The team's log; a person decides
      withA(x,lit(2,tt),()=>{const gather=ag_sine((tt-P.write)/1.2);for(let i=0;i<4;i++){const ex=lerp(COL[2]-195+i*130,COL[2],gather);fu_envelope(x,ex,150,0.62,{a:oa(2)*(1-gather),rot:(i%2?0.05:-0.05),label:["Apr","May","Jun","Jul"][i],deco:true});}
        if(gather>0)fu_sheet(x,COL[2]-70,104,140,92,{a:gather,draw:(c,sx,sy,sw,sh)=>{for(let k=0;k<4;k++){c.fillStyle=rgba(AG.mut,0.35);c.fillRect(sx+16,sy+16+k*17,(sw-32)*(k===3?0.5:0.9),6);}}});
        fu_changeCard(x,COL[2],CY[2],CH[2],{a:fu_fin(tt,P.log-0.1,0.5),k:ag_spr(tt,P.log-0.1,0.7)});
        fu_log(x,L[2],330,520,{a:fu_fin(tt,P.write-0.2,0.5),row:fu_fin(tt,P.owner-0.5,0.5),answered:fu_fin(tt,P.answered,0.5)});
        fu_decision(x,L[2],566,520,{a:fu_fin(tt,P.person-0.4,0.5),k:ag_spr(tt,P.person-0.4,0.7),initials:clamp((tt-P.person)/0.9,0,1),grey:fu_fin(tt,P.tick+0.2,0.8)});});}}
  ];
  ag_shots(ctx,S,t,sc.dur,sh,0.5);});

// ---- 7 · Feeling sure is not knowing: this term the agent reads the question back, counts 2,880, the faculty's list agrees; twelve
// advisers; what makes us feel we understand; Odyssey, still at work; an answer you can plan on ----
scene("close",(ctx,S,t,sc)=>{const c=sc.cues,P=fu_once(sc,"P",()=>({
    again:c.again,asks:wAt(sc,"again","asks again"),reads:wAt(sc,"again","reads it back"),q:wAt(sc,"again","students in the Faculty"),
    yes:c.yes,counts:c.counts,n2880:wAt(sc,"counts","two thousand"),agrees:wAt(sc,"counts","own list agrees"),twelve:c.twelve,plans:wAt(sc,"twelve","twelve advisers"),
    every:wAt(sc,"twelve","every student"),fluent:c.fluent,fa:wAt(sc,"fluent","A fluent answer"),tick:wAt(sc,"fluent","a green tick"),run:wAt(sc,"fluent","a long run"),
    feel:wAt(sc,"fluent","make us feel"),anyway:c.anyway,still:wAt(sc,"anyway","still at work"),years:wAt(sc,"anyway","twenty years later"),
    plan:c.plan,on:wAt(sc,"plan","plan on"),take:c.takeaway,br:c.breath}));
  const T={ask:P.asks,read:P.yes+0.5,query:P.yes+1.3,check:P.counts-0.2,done:P.counts+0.4};
  const sh=[
    // this term: Jun asks again; the agent reads the question back, and waits; "Yes."; its hands, the data back, the check. The agent
    // comes in once the board has gone (as the chapters crossed, it showed both here and on the board)
    {at:0,place:"fuData",keys:[[0,960,520,1.04]],push:0.03,draw:(x,tt)=>{
      fu_agentAt(x,tt,T,{think:0.15,a:ag_in(tt,0.8,0.5)});fu_junDesk(x,tt,{gaze:tt<P.reads?[4,-1]:[6,-2],smile:0.4,talk:ag_talk(sc,"yes",tt)*0,folder:{dust:0}});ag_roomLight(x,1);
      ag_textCard(x,500,92,560,{sub:"Students in the Faculty of Health, each person counted once?"},{a:fu_fin(tt,P.reads,0.5)*(1-fu_fin(tt,P.counts-0.6,0.4)),k:ag_spr(tt,P.reads,0.7),edge:AG.violet,tail:{side:"right",at:0.85,px:1000,py:330}});
      fu_bubble(x,330,292,"Yes.",{a:fu_fin(tt,P.yes,0.4)*(1-fu_fin(tt,P.counts-0.6,0.4)),k:ag_spr(tt,P.yes,0.7),px:322,py:378,w:150});}},
    // 2,880 people, and the faculty's own list beside it: the same; a green tick; Jun's initials
    {cut:true,at:P.counts-0.3,place:"fuData",keys:[[P.counts-0.3,632,380,1.52],[P.counts-0.2,632,378,1.55]],d:5,draw:(x,tt)=>{
      // the frame's edge cuts the ring before its Act step; the agent steps back as the faculty's list comes in
      fu_agentAt(x,tt,T,{think:0.15,a:1-0.45*fu_fin(tt,P.agrees-0.5,0.8)});fu_junDesk(x,tt,{gaze:[5,-3],smile:0.5,folder:{dust:0}});ag_roomLight(x,1);
      const r=fu_answer(x,330,130,{v:"people",a:fu_fin(tt,P.n2880-0.2,0.5),k:ag_spr(tt,P.n2880-0.2,0.8)});
      fu_facList(x,860,140,{w:330,h:200,lines:2,a:fu_fin(tt,P.agrees-0.5,0.5),k:ag_spr(tt,P.agrees-0.5,0.7)});
      fu_equals(x,815,250,fu_fin(tt,P.agrees+0.1,0.4));const tk=clamp((tt-P.agrees-0.4)/0.4,0,1);if(tk>0)ag_tick(x,1140,296,34*ag_eo(tk),rgba(AG.green,1),5);
      fu_initials(x,r.card.x+r.card.w-96,r.card.y+96,clamp((tt-P.agrees-1.0)/0.9,0,1),{s:0.8});}},
    // twelve advisers, a list of 240 each; every name ticked, list by list
    {at:P.twelve-0.5,place:"fuFaculty",keys:[[P.twelve-0.5,960,540,1.04],[P.twelve-0.4,960,540,1.0]],d:6,draw:(x,tt)=>{
      for(let i=0;i<12;i++)fu_adviser(x,70+i*112,150,{a:fu_fin(tt,P.twelve-0.4+i*0.06,0.4),list:{n:6,done:6,p:clamp((tt-P.every)/0.5-i*0.22,0,1)}});
      fu_anilDesk(x,tt,{value:"12",unit:"advisers",t:tt,gaze:[1,-3],smile:0.5});ag_roomLight(x,1);
      fu_bracket(x,70,1402,500,"12 advisers",{a:fu_fin(tt,P.plans-0.2,0.4),p:clamp((tt-P.plans+0.2)/0.8,0,1)});}},
    // what makes us feel we understand: a fluent answer, a green tick, a long run of success; a soft glow round them
    {at:P.fluent-0.5,place:"fuQuiet",keys:[[P.fluent-0.5,960,500,1.04],[P.fluent-0.4,960,500,1.0]],d:5,draw:(x,tt)=>{
      const up=(t0)=>[fu_fin(tt,t0-0.2,0.6),(1-ag_eo(clamp((tt-t0+0.2)/1.0,0,1)))*70];const gl=fu_fin(tt,P.feel,1.2);ag_about(x,960,420,1.18);
      let [a1,d1]=up(P.fa);x.save();x.translate(0,d1);const b=fu_answer(x,236,300,{a:0});fu_glow(x,b.card,gl*a1);fu_answer(x,236,300,{a:a1});x.restore();
      let [a2,d2]=up(P.tick);x.save();x.translate(0,d2);if(a2>0)withA(x,a2,()=>{fu_glow(x,{x:790,y:390,w:340,h:76},gl);fu_check(x,960,428,1);});x.restore();
      let [a3,d3]=up(P.run);x.save();x.translate(0,d3);if(a3>0)withA(x,a3,()=>{const cb=fu_calendar(x,1290,290,{w:400,ticks:10,a:0});fu_glow(x,cb,gl);fu_calendar(x,1290,290,{w:400,ticks:10});});x.restore();}},
    // Odyssey's team checked anyway: Odyssey in its ring round Mars, 2001 turning to 2021
    {at:P.anyway-0.5,place:"fuWall",keys:[[P.anyway-0.5,1200,230,2.2],[P.anyway-0.4,1210,228,2.3]],d:5,draw:(x,tt)=>{
      const th=(tt-P.anyway)*0.9;fu_room99(x,tt,{empty:true,craft:null,real:0,orbits:0,odyssey:{th,a:1,s:0.46}});fu_orbit(x,FU_SPACE.plan,"front",1,rgba(FU.graphite,0.7),[3,9]);
      const M=FU_SPACE.mars,yr=tt<P.years?"2001":(tt<P.years+1.2?String(2001+Math.floor((tt-P.years)/1.2*20)):"2021");
      ag_pill(x,M[0],M[1]+M[2]+108,yr,{size:30,a:fu_fin(tt,P.anyway,0.5)});ag_T(x,"still at work",M[0],M[1]+M[2]+168,{w:700,size:28,align:"center",col:AG.green,a:fu_fin(tt,P.still-0.2,0.5)});}},
    // an answer you can plan on: "Advisers next term: 12", and Anil nods
    {at:P.plan-0.5,place:"fuFaculty",keys:[[P.plan-0.5,1371,600,1.75],[P.plan-0.4,1371,598,1.78]],d:4,draw:(x,tt)=>{
      for(let i=0;i<12;i++)fu_adviser(x,70+i*112,150,{list:{n:6,done:6}});const nd=Math.sin(clamp((tt-P.on)/1.2,0,1)*Math.PI*2)*0.06;
      fu_anilDesk(x,tt,{value:"12",unit:"advisers",t:tt,nod:nd,smile:0.6,gaze:[2,1]});ag_roomLight(x,1);}},
    // the frame clears to the marble wall
    {at:P.take-0.6,place:"fuQuiet",keys:[[P.take-0.6,960,540,1.0]],push:0,draw:()=>{}}
  ];
  ag_shots(ctx,S,t,sc.dur,sh,0.5);
  fu_when(ctx,"This term",null,fu_fin(t,0.4,0.5)*(1-fu_fin(t,P.counts-0.6,0.4)));
  ag_end(ctx,S,t,P.take-0.4,"It feels like understanding","Feeling sure is not knowing.","Film 4 of 10");});

// chapters that open on a cut: each shows people, a place or words the chapter before ends on, which a crossfade would show twice
ag_cutInto(["right", "meanings"]);
