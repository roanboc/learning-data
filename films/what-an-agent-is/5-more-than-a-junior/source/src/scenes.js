/* ===== More than a junior: the scenes =====
   Seven chapters, each cut into shots with mj_shots (the series' ag_shots, with cuts, and cameras carried from shot to shot); times
   come from the lines' cues (sc.cues) and their words (wAt), so the pictures stay with the voice if it's recorded again. Berlin's
   pictures are in berlin.js, the room's in plan.js. Every top-level name starts with mj_ or MJ_. */

// draws in the frame's own coordinates, over whatever shot is showing
function mj_screen(ctx,S,fn){setScreen(ctx,S);ctx.save();fn(ctx);ctx.restore();setScreen(ctx,S);}
// where a point of the courtyard lands in the frame from a camera, without changing the one a shot is drawing with
function mj_at(cam,X,Y,Z){const old=MJ_CAM;MJ_CAM=MJ_CAMS[cam];const p=mj_P(X,Y,Z);MJ_CAM=old;return p;}
// Hans's taps: n of them from t0, gap apart; a tap strikes the ground MJ_STRIKE after it starts, and a tick is chalked then
const MJ_STRIKE=0.37;
const mj_taps=(t0,n,gap)=>Array.from({length:n},(_,i)=>t0+i*(gap||0.48));
function mj_count(t,taps){let n=0,last=0;for(const s of taps)if(t>=s+MJ_STRIKE){n++;last=s;}return{n,tick:n?clamp((t-last-MJ_STRIKE)/0.16,0,1):0};}
// a card that springs in at t0 and fades out at t1, as a value 0 to 1 for its k and its a
const mj_card=(t,t0,t1)=>({k:ag_spr(t,t0,0.5),a:ag_in(t,t0,0.25)*(t1==null?1:1-ag_in(t,t1,0.4))});
// The film's own cutting of a chapter into shots: the series' ag_shots, with two changes (PLAYBOOK, "Cut between two framings of one
// moment"). A shot marked cut:true comes in on a cut, not a dissolve: two framings of one moment, or two of Berlin's cameras. And a shot
// in the same place as the one before (the room by day and by night count as one) starts where that one's camera ended and glides from
// there to its own keys; while it dissolves, the shot before is drawn through the same camera, so the dissolve fades in only what
// changed, and nothing shows twice, a little apart.
const mj_placeOf=p=>p&&p.indexOf("lab")===0?"lab":p;
// where a shot's camera is when the next one starts: ag_focus's sums, with the shot's push complete
function mj_camEnd(sh,till){const len=Math.max(1.5,till-sh.at),push=(sh.push==null?0.025:sh.push)*easeCam(clamp((till-sh.at)/len,0,1)),d=Math.max(1.4,sh.d||1.6),keys=sh.keys||[[0,960,540,1]];
  let x=keys[0][1],y=keys[0][2],z=keys[0][3];for(let i=1;i<keys.length;i++){const u=easeCam(clamp((till-keys[i][0])/d,0,1));if(u<=0)break;x=lerp(x,keys[i][1],u);y=lerp(y,keys[i][2],u);z=lerp(z,keys[i][3],u);}
  z=Math.max(1,z*(1+push));return[clamp(x,960/z,W-960/z),clamp(y,540/z,H-540/z),z];}
function mj_shots(ctx,S,t,end,shots,dis){
  for(let k=1;k<shots.length;k++){const a=shots[k-1],b=shots[k];if(b.cut||mj_placeOf(a.place)!==mj_placeOf(b.place))continue;
    const e=mj_camEnd(a,b.at);b.keys=[[b.at,e[0],e[1],e[2]]].concat(b.keys||[[b.at,960,540,1]]);b.carried=true;}
  let i=0;for(let k=1;k<shots.length;k++)if(t>=shots[k].at)i=k;dis=dis==null?0.5:dis;
  const u=i>0&&!shots[i].cut?clamp((t-shots[i].at)/dis,0,1):1,till=k=>shots[k+1]?shots[k+1].at:end;
  if(u<1){const a=shots[i-1],b=shots[i];ag_shot(ctx,S,t,b.carried?Object.assign({},a,{at:b.at,keys:b.keys,d:b.d,push:b.push}):a,b.carried?till(i):b.at);const [bc,bx]=ag_buf("cut",ctx.canvas.width,ctx.canvas.height);ag_shot(bx,S,t,shots[i],till(i));
    ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=ease(u);ctx.drawImage(bc,0,0);ctx.restore();setScreen(ctx,S);}
  else ag_shot(ctx,S,t,shots[i],till(i));return i;}
// the 1904 men of the commission in a half circle behind Hans: [X, Z, which]
const MJ_RING=(()=>{const out=[];for(let i=0;i<13;i++){const u=i/12,an=lerp(-2.8,-0.34,u);out.push([MJ_AT.hans[0]+0.3+Math.cos(an)*3.9,MJ_AT.hans[1]-0.1-Math.sin(an)*3.6,i]);}return out;})();
const MJ_VIS=[[2.1,6.8],[2.9,7.6],[3.7,7.0],[4.6,8.0],[5.4,7.3],[1.4,8.6]];
// more visitors, once the papers have written about him
const MJ_VIS2=[[6.1,8.6],[0.6,9.6],[4.0,9.2],[3.2,5.9],[5.0,6.2],[6.4,7.0]];

/* ---------------------------------------------------------------- 1 · Clever Hans */
scene("hans",(ctx,S,t,sc)=>{const c=sc.cues,H=MJ_AT.hans,O=MJ_AT.osten;
  const tTaps=c.taps-0.5,tPap=c.papers-0.35,tEye=c.how-0.45,tOsten=c.fraud-0.4,tHat=c.stake-0.35,tMen=c.thirteen-0.5,tAut=c.pfungst-0.4,
    tBlind=c.blinkers-0.45,tSeen=c.sight-0.55,tCheat=c.cheat-0.4,tGift=c.gift-0.4,tSince=c.since-0.4,tRoom=c.jun-0.4;
  // the taps: five for 3 + 2, two for the fraction, six for the date; later, past the answer nobody knew, and wrong ones in blinkers
  const t1=mj_taps(c.taps+0.1,5,0.46),t2=mj_taps(wAt(sc,"taps","fractions")+0.55,2,0.46),t3=mj_taps(wAt(sc,"taps","the date")+0.6,6,0.44),
    tNone=mj_taps(c.nobody+0.5,9,0.5),tBl=mj_taps(c.blinkers+1.0,7,0.62),tSn=mj_taps(c.sight+0.3,5,0.46);
  const allTaps=[...t1,...t2,...t3,...tNone,...tBl,...tSn];
  const hans=(x,o)=>mj_hansAt(x,H[0],H[1],Object.assign({t,taps:allTaps},o||{}));
  const osten=(x,X,Z,o)=>mj_standAt(x,X,Z,1.72,MJ_FIG.osten,Object.assign({t},o||{}));
  const fTaught=ag_in(t,c.taught-0.2,0.9);
  // the eye, where Hans watches from, in the courtyard (his head's space through his size)
  const eyeAt=()=>{const p=mj_P(H[0],0,H[1]),s=mj_k(H[1])*1.6/468;return mj_hAt(p[0],p[1],s,[155,163]);};
  // the questioner's head from a camera, over the hat
  const shots=[
    // noon in the courtyard, wide: the stable wall, visitors standing back, von Osten and Hans by the blackboard; the camera drifts in
    {at:0,place:"mjNoon",keys:[[0,960,540,1],[c.noon+0.3,820,430,1.3],[c.taught+0.1,700,440,1.38]],d:4.2,draw:(x,tt)=>{mj_cam("wide");
      MJ_VIS.forEach((v,i)=>mj_standAt(x,v[0],v[1],MJ_VISITORS[i].woman?1.62:1.74,MJ_VISITORS[i],{t:tt+i,arms:i%2?"behind":"hang",flip:true,nod:0.03*Math.sin(tt*0.7+i)}));
      mj_board(x,MJ_AT.board[0],MJ_AT.board[1]);
      hans(x,{head:-0.05*fTaught});
      osten(x,O[0],O[1],{arms:"hold",arms2:"point",mix:fTaught,flip:true,nod:-0.04*fTaught});}},
    // close on the slate and the forefoot: chalk ticks count the taps beside "3 + 2" and stop at five; the slate turns to a fraction,
    // then to a calendar page
    {at:tTaps,cut:true,place:"mjNoonMid",keys:[[tTaps,960,520,1]],push:0.03,draw:(x,tt)=>{mj_cam("mid");const e=mj_easel(x,-2.26,4.0);hans(x,{head:0.04});
      const k1=mj_count(tt,t1),u1=ag_in(tt,wAt(sc,"taps","fractions"),0.5),u2=ag_in(tt,wAt(sc,"taps","the date"),0.5);
      if(u2>0)mj_slate(x,e.x,e.y,e.w,{text:"2/3 + 3/4",turn:u2,next:{cal:{month:"SEPTEMBER",day:6,year:1904}}});
      else mj_slate(x,e.x,e.y,e.w,{text:"3 + 2",ticks:k1.n,tick:k1.tick,turn:u1,next:{text:"2/3 + 3/4"}});}},
    // the papers call him Clever Hans, and more people come
    {at:tPap,cut:true,place:"mjNoon",keys:[[tPap,715,470,1.12]],push:0.03,draw:(x,tt)=>{mj_cam("wide");
      const crowd=MJ_VIS.map((v,i)=>[v,MJ_VISITORS[i],i]).concat(MJ_VIS2.map((v,i)=>[v,i%2?MJ_MEN[(i*3)%13]:MJ_VISITORS[(i+2)%6],i+6])).sort((a,b)=>b[0][1]-a[0][1]);
      crowd.forEach(([v,P,i])=>mj_standAt(x,v[0],v[1],P.woman?1.62:1.74,P,{t:tt+i,arms:i%3?"behind":"hang",flip:true,nod:0.03*Math.sin(tt*0.7+i)}));
      mj_board(x,MJ_AT.board[0],MJ_AT.board[1]);hans(x);osten(x,O[0],O[1],{arms:"hold",flip:false});}},
    // the calm eye: how could a horse do sums?
    {at:tEye,cut:true,place:"mjNoonHead",keys:[[tEye,1140,350,1.8],[tEye+0.1,1132,330,2.6]],d:3.6,push:0.02,draw:(x,tt)=>{mj_cam("head");
      hans(x,{blink:mj_hBlinkAt(tt)+ (tt>c.how+1.3&&tt<c.how+1.62?Math.sin((tt-c.how-1.3)/0.32*Math.PI):0)});}},
    // von Osten, his hat in his hands, his good name at stake: first under the papers' word, then alone, his head bowing as the camera
    // comes in (one shot, so the hat is never seen twice)
    {at:tOsten,cut:true,place:"mjNoonHead",keys:[[tOsten,960,540,1],[tHat,720,570,1.08]],d:4,push:0.03,draw:(x,tt)=>{const P=MJ_PERSON.osten,b=ag_in(tt,tHat,1.0),
        nd=0.04*b+0.08*ag_in(tt,c.stake+0.3,1.4),g=[lerp(3,1,b),lerp(ag_in(tt,c.fraud+0.8,0.6)*2,3,b)];
      ag_person(x,P,560,600,1.05,{t:tt,pose:"hold",nod:nd,gaze:g,hold:(xx,hd)=>{const h=hd.near;xx.save();xx.translate(h[0]+30,h[1]-10);xx.rotate(-0.5);xx.scale(0.9,0.9);xx.translate(-300,-300);mj_hatShape(xx,"slouch",[34,32,34]);xx.restore();}});
      mj_headHat(x,P,560,600,1.05,{t:tt,nod:nd},null);}},
    // the thirteen gather in a half circle; a report: no trick found; over every head, the same answer
    {at:tMen,place:"mjNoonHigh",keys:[[tMen,900,470,1.22],[c.change,mj_at("high",H[0]+0.9,1.0,H[1])[0],mj_at("high",H[0],1.1,H[1])[1],1.55],[wAt(sc,"change","the way"),760,470,1.5]],d:2.2,draw:(x,tt)=>{mj_cam("high");
      const ring=MJ_RING.slice().sort((a,b)=>b[1]-a[1]),order=i=>Math.abs(i-6),hz=H[1];
      const man=m=>{const i=m[2],a0=tMen+0.25+(6-order(i))*0.2,ap=ag_in(tt,a0,0.6);if(ap<=0)return;
        withA(x,ap,()=>mj_standAt(x,m[0],m[1],1.74,MJ_MEN[i],{t:tt+i,arms:["behind","hang","hold"][i%3],flip:m[0]>H[0]+0.3,nod:0.02*Math.sin(tt*0.6+i),
          cloud:(xx,X,Y,k)=>mj_cloud(xx,X,Y,"5",{s:clamp(k*1.7,0.75,1),a:ag_in(tt,c.knew+0.35+i*0.09,0.4)*(1-ag_in(tt,c.change+0.1,0.6)),k:ag_spr(tt,c.knew+0.35+i*0.09,0.45)})}));};
      ring.filter(m=>m[1]>hz).forEach(man);hans(x);osten(x,O[0],O[1],{arms:"hold",flip:true});ring.filter(m=>m[1]<=hz).forEach(man);}},
    // that autumn: leaves on the cobbles, Pfungst with his notebook; nobody there knows the answer, and Hans taps on past it
    {at:tAut,cut:true,place:"mjAutumn",keys:[[tAut,960,540,1],[tAut+0.2,860,500,1.16]],d:5,draw:(x,tt)=>{mj_cam("wide");const q=ag_in(tt,c.nobody+0.1,0.5);
      const cl=(i)=>(xx,X,Y,k)=>mj_cloud(xx,X,Y,"?",{s:clamp(k*1.7,0.75,1),a:ag_in(tt,c.nobody+0.1+i*0.15,0.4),k:ag_spr(tt,c.nobody+0.1+i*0.15,0.45),col:AG.amber});
      mj_standAt(x,-4.6,6.8,1.74,MJ_MEN[3],{t:tt,arms:"behind",cloud:cl(3)});mj_standAt(x,3.0,6.4,1.74,MJ_MEN[7],{t:tt,arms:"hang",flip:true,cloud:cl(2)});
      hans(x);osten(x,O[0],O[1],{arms:"hold",arms2:"ask",mix:ag_in(tt,c.pfungst+1,0.8),flip:false,cloud:cl(0)});
      mj_standAt(x,1.7,3.5,1.74,MJ_FIG.pfungst,{t:tt,arms:"book",flip:true,nod:0.06,cloud:cl(1)});}},
    // large blinkers: the questioner at Hans's right shoulder, out of his sight
    {at:tBlind,place:"mjAutumn",keys:[[tBlind,860,525,1.25]],push:0.02,draw:(x,tt)=>{mj_cam("wide");
      mj_standAt(x,-3.0,6.0,1.74,MJ_FIG.pfungst,{t:tt,arms:"book",flip:false,nod:0.06});
      hans(x,{blinkers:ag_in(tt,c.blinkers+0.2,0.6)});osten(x,H[0]+0.7,3.85,{arms:"hold",flip:true,nod:0.03});}},
    // the questioner in front, in sight; then what Hans had been watching
    {at:tSeen,place:"mjAutumn",keys:[[tSeen,860,525,1.25]],push:0.02,draw:(x,tt)=>{mj_cam("wide");
      mj_standAt(x,-1.6,6.4,1.74,MJ_FIG.pfungst,{t:tt,arms:"book",flip:false,nod:0.06});
      hans(x,{blinkers:1});const head=osten(x,-3.2,4.3,{arms:"ask",flip:false});
      mj_sight(x,eyeAt(),[head.x+4,head.y+10],ag_in(tt,c.watching+0.1,1.2),1);}},
    // no fraud, and no counting: the report of 9 December 1904
    {at:tCheat,place:"mjAutumn",keys:[[tCheat,860,500,1.12]],push:0.02,draw:(x,tt)=>{mj_cam("wide");
      hans(x);osten(x,O[0],O[1],{arms:"hold",flip:false});mj_standAt(x,1.7,3.5,1.74,MJ_FIG.pfungst,{t:tt,arms:"book",flip:true,nod:0.04});}},
    // a movement too small for any expert to notice: a lens over the brim of the questioner's hat
    {at:tGift,cut:true,place:"mjAutumnHead",keys:[[tGift,960,540,1]],push:0.03,draw:(x,tt)=>{const P=MJ_PERSON.osten,X0=700,Y0=640,S0=1.25,lift=1.6*ag_io(tt,c.gift+1.6,c.gift+2.6,0.3);
      const me=(xx,l)=>{ag_person(xx,P,X0,Y0,S0,{t:tt,gaze:[3,0]});mj_headHat(xx,P,X0,Y0,S0,{t:tt,lift:l},"slouch",[34,32,34]);};me(x,lift*0.1);
      const lx0=X0+(452-296)*S0-10,ly0=Y0+(332-596)*S0,u=ag_sine(clamp((tt-c.gift)/1.4,0,1)),lx=lerp(1500,lx0,u),ly=lerp(560,ly0,u),z=3.2;
      mj_lens(x,lx,ly,170,{a:ag_in(tt,c.gift-0.1,0.4),draw:xx=>{xx.save();xx.translate(lx,ly);xx.scale(z,z);xx.translate(-lx,-ly);xx.drawImage(ag_place("mjAutumnHead"),0,0);me(xx,lift);xx.restore();}});}},
    // ever since: the answer kept from the one who asks, sealed; on a cut, so the two faces never melt into one. The envelope comes up
    // into the frame with his hand from below it, whole, rather than fading in at the frame's edge
    {at:tSince,cut:true,place:"mjAutumnHead",keys:[[tSince,960,540,1]],push:0.03,draw:(x,tt)=>{const P=MJ_PERSON.pfungst,up=ag_spr(tt,c.since+0.2,0.6);
      ag_person(x,P,760,560,1.05,{t:tt,pose:"hang",pose2:"hold",mix:up,gaze:[3,lerp(0,2,up)],hold:(xx,h)=>{if(up>0.01)mj_envelope(xx,h.near[0]+60,h.near[1]-40,300,{word:"answer",rot:-0.12,a:ag_in(up,0.01,0.12)});}});}},
    // today: the room, Jun and the agent; Berlin's light carries across
    {at:tRoom,place:"lab",keys:[[tRoom,960,540,1]],push:0.025,draw:(x,tt)=>{
      ag_person(x,"jun",296,596,1.0,{t:tt,gaze:[3,0],talk:0,smile:0.3});
      mj_agent(x,{t:tt,core:0.85,think:0.2*ag_in(tt,c.safely,1),textA:1-ag_in(tt,c.breath,0.6)});ag_roomLight(x,1);
      // Berlin, fading out over the room, so the light from the right holds while the courtyard dissolves
      const f=1-ag_in(tt,tRoom,1.5);if(f>0){x.save();x.globalAlpha*=f;x.drawImage(ag_place("mjAutumnHead"),0,0);
        ag_person(x,MJ_PERSON.pfungst,760,560,1.05,{t:tt,pose:"hold",gaze:[3,2],hold:(xx,h)=>mj_envelope(xx,h.near[0]+60,h.near[1]-40,300,{word:"answer",rot:-0.12})});x.restore();}}}
  ];
  mj_shots(ctx,S,t,sc.dur,shots,0.7);
  // over the shots: the place, the slate when nobody knows, the newspaper, the reports, the dot grids
  mj_screen(ctx,S,x=>{
    const tag=ag_io(t,c.berlin-0.1,c.taught-0.6,0.5);if(tag>0)ag_pill(x,236,112,"Berlin, 1904",{a:tag});
    // the newspaper: "Clever Hans" beside von Osten; again over his close-up, turning to "A fraud?"; "He can think!" above the commission's heads
    const p1=mj_card(t,c.papers-0.1,c.how-0.9),p2=mj_card(t,c.fraud-0.1,c.stake-0.4),p3=mj_card(t,c.think-0.1,c.knew-0.3);
    if(p1.a>0)mj_paper(x,lerp(-480,50,ag_eo(ag_in(t,c.papers-0.1,0.7)))-560*ag_in(t,c.how-0.9,0.5),110,400,{head:"Clever Hans",rot:-0.04,a:p1.a});
    if(p2.a>0)mj_paper(x,lerp(1960,1280,ag_eo(ag_in(t,c.fraud-0.1,0.7)))+640*ag_in(t,c.stake-0.4,0.5),120,500,{head:"Clever Hans",next:"A fraud?",turn:ag_in(t,wAt(sc,"fraud","fraud")-0.2,0.6),rot:0.04,a:p2.a});
    if(p3.a>0)mj_paper(x,lerp(-420,96,ag_eo(ag_in(t,c.think-0.1,0.7)))-560*ag_in(t,c.knew-0.3,0.5),36,360,{head:"He can think!",rot:-0.05,a:p3.a});
    const r1=mj_card(t,wAt(sc,"thirteen","found no trick"),tAut);if(r1.a>0)ag_textCard(x,1250,96,520,{kick:"12 September 1904",title:"No trick found"},{kickCol:AG.kick,k:r1.k,a:r1.a});
    // the slate when nobody there knows the answer: the ticks go on past it, amber
    const sl=mj_card(t,c.nobody-0.2,tBlind+0.2);if(sl.a>0){const k=mj_count(t,tNone);x.save();x.globalAlpha*=sl.a;ag_about(x,1180,183,lerp(0.6,1,sl.k));mj_slate(x,1000,50,360,{text:"?",ticks:k.n,tick:k.tick,past:5});x.restore();}
    // the two dot grids: out of sight, then in sight
    const g1=mj_card(t,c.blinkers+0.3,tCheat),g2=mj_card(t,c.sight-0.2,tCheat);
    if(g1.a>0)mj_grid(x,1452,96,26,MJ_RIGHT.blind,ag_in(t,c.blinkers+0.9,3.6),"Out of sight · 6 in 100",{a:g1.a,k:g1.k});
    if(g2.a>0)mj_grid(x,1452,500,26,MJ_RIGHT.seen,ag_in(t,c.sight+0.1,2.4),"In sight · 89 in 100",{a:g2.a,k:g2.k});
    const r2=mj_card(t,c.cheat+0.1,tGift);if(r2.a>0)ag_textCard(x,560,86,800,{kick:"9 December 1904",title:"No fraud. Hans can't count.",sub:"He reads the one who asks."},{kickCol:AG.kick,k:r2.k,a:r2.a});
  });
  ag_title(ctx,S,t,c.breath,"More than a junior","less than a person","FILM 5 OF 10 · WHAT AN AGENT IS");
});

/* ---------------------------------------------------------------- the room's shared moves */
// a veil over the room, so a card in front of it reads; the two-column card's place; the paper junior's and its ladder's
const mj_veil=(x,a)=>{if(a>0){x.fillStyle="rgba(240,238,233,"+(0.66*clamp(a,0,1))+")";x.fillRect(0,0,W,H);}};
const MJ_TWO_AT=[480,130],MJ_JR={x:660,y:860,h:460},MJ_LAD={x:890,y:860,h:360};
// a quick wobble that settles, from t0
const mj_wob=(t,t0,amp)=>{const w=t-t0;return w>0?amp*Math.exp(-2.4*w)*Math.sin(w*6.5):0;};
// a value that steps from 0 to n as times pass, each step eased over d
const mj_steps=(t,times,d)=>times.reduce((s,t0)=>s+clamp((t-t0)/(d||0.5),0,1),0);
// the kicker, over the room's shots
const mj_kick=(ctx,S,a)=>{if(a>0)mj_screen(ctx,S,x=>ag_kicker(x,"1.5","More than a junior",{a}));};
// the morning's light from the window
function mj_morning(x,a){if(a<=0)return;const g=x.createRadialGradient(1900,80,40,1700,200,1300);g.addColorStop(0,"rgba(255,232,188,"+(0.42*a)+")");g.addColorStop(0.6,"rgba(255,236,196,"+(0.12*a)+")");g.addColorStop(1,"rgba(255,236,196,0)");
  x.save();x.globalCompositeOperation="screen";x.fillStyle=g;x.fillRect(0,0,W,H);x.restore();}
// a card flying from a small box to its place: a plain card while it flies, its words once it lands
function mj_fly(x,from,to,u,drawAt){const e=ag_sine(u),bx=lerp(from.x,to.x,e),by=lerp(from.y,to.y,e),bw=lerp(from.w,to.w,e),bh=lerp(from.h,to.h,e);
  if(u<0.92)ag_box(x,bx,by,bw,bh,lerp(12,22,e),{edge:AG.blue,edgeA:0.5,lw:2});withA(x,ag_in(u,0.86,0.14),()=>drawAt(x));}

/* ---------------------------------------------------------------- 2 · A junior who needs supervision */
scene("junior",(ctx,S,t,sc)=>{const c=sc.cues,tB=c.knows-0.5,tC=c.looks-0.5,tD=c.ways-0.3;
  const tReason=wAt(sc,"agent","reasons"),tHands=wAt(sc,"agent","with hands"),tLoop=wAt(sc,"agent","in a loop"),tAdv=wAt(sc,"advice","often told"),tBadge=wAt(sc,"advice","junior who");
  const reach=ag_sine(clamp((t-tHands+0.1)/1.0,0,1))*(1-ag_sine(clamp((t-c.advice-1.8)/1.0,0,1)));
  const lit=t>=tReason&&t<tHands?0:t>=tHands&&t<tLoop?1:t>=tLoop&&t<tLoop+1.8?2:null;
  const agent=(x,tt,o)=>mj_agent(x,Object.assign({t:tt,think:0.25+0.45*ag_in(tt,tReason,0.6)*(1-0.5*ag_in(tt,c.advice+1,1)),badge:clamp((tt-tBadge)/1,0,1),lit},o||{}));
  const jun=(x,tt,g)=>ag_person(x,"jun",296,596,1.0,{t:tt,gaze:g||[3,0],smile:0.3});
  // the paper junior: it steps in, its three small jobs ticked by a reviewer; month by month, fewer ticks; a mistake tips its ladder
  const tStep=c.knows-0.3,tJobs=wAt(sc,"knows","small jobs"),tMonth=wAt(sc,"less","month by month"),tMis=wAt(sc,"careful","a mistake");
  const months=[tMonth,tMonth+0.7,tMonth+1.4],m=mj_steps(t,months,0.5),ticks=Math.round(clamp(mj_steps(t,[tJobs+0.5,tJobs+0.9,tJobs+1.3],0.3),0,3)-clamp(Math.floor(m+0.5),0,2));
  const junior=(x,tt)=>{const st=ag_eo(clamp((tt-tStep)/0.9,0,1));if(st<=0)return;withA(x,st,()=>{
      mj_ladder(x,MJ_LAD.x,MJ_LAD.y,MJ_LAD.h,{tip:mj_wob(tt,tMis+0.2,-0.11)});
      mj_junior(x,MJ_JR.x-60*(1-st),MJ_JR.y,MJ_JR.h,{t:tt,badge:1,cards:3,ticks,amber:ag_io(tt,tMis,c.looks-0.7,0.3)});});};
  const shots=[
    // the agent at work: it reasons, an arm reaches a tool and data comes back, round its loop; the advice, pinned to the marble; the badge
    {at:0,place:"lab",keys:[[0,960,540,1.025]],push:0.02,draw:(x,tt)=>{jun(x,tt,tt>tAdv?[2,-2]:[3,0]);
      ag_tool(x,1604,422,258,116,"Query",{touch:ag_in(reach,0.9,0.1),a:ag_in(tt,0.3,0.6)*(1-ag_in(tt,c.advice+2.6,0.6))});
      agent(x,tt);mj_arm(x,1604,480,reach,{data:clamp((tt-tLoop)/1.4,0,1)});ag_roomLight(x,1);
      const cd=mj_card(tt,tAdv-0.2,null);if(cd.a>0){ag_textCard(x,440,150,500,{kick:"Often told",title:"Treat it like a junior who needs supervision"},{kickCol:AG.kick,k:cd.k,a:cd.a});withA(x,cd.a,()=>mj_pin(x,690,160));}}},
    // the junior picture beside it: small jobs, checked, then checked less; careful, because a mistake would cost them
    {cut:true,at:tB,place:"lab",keys:[[tB,960,540,1],[tB+0.05,760,532,1.28]],d:2.2,push:0.015,draw:(x,tt)=>{jun(x,tt,[3,1]);agent(x,tt);junior(x,tt);ag_roomLight(x,1);
      const mc=mj_card(tt,c.less-0.1,null);if(mc.a>0)mj_month(x,450,236,1+Math.floor(m),{turn:m%1,k:mc.k,a:mc.a});}},
    // but the agent only looks like the picture: its badge swings, and its shadow on the wall is a sphere's
    {cut:true,at:tC,place:"lab",keys:[[tC,960,540,1]],push:0.02,draw:(x,tt)=>{jun(x,tt,[3,0]);
      const sh=ag_in(tt,wAt(sc,"looks","only looks"),1.2);if(sh>0){x.save();x.filter="blur(14px)";x.fillStyle="rgba(46,38,28,"+(0.2*sh)+")";x.beginPath();x.arc(MJ_ROOM.agent.x-74,MJ_ROOM.agent.y+20,92,0,TAU);x.fill();x.filter="none";x.restore();}
      agent(x,tt,{swing:mj_wob(tt,wAt(sc,"looks","like Hans"),0.22)});junior(x,tt);ag_roomLight(x,1);}},
    // the two-column card, its rows still empty
    {cut:true,at:tD,place:"lab",keys:[[tD,960,540,1]],push:0,draw:(x,tt)=>{jun(x,tt,[3,0]);agent(x,tt,{textA:1-ag_in(tt,tD,0.4)});junior(x,tt);ag_roomLight(x,1);setScreen(x,S);mj_veil(x,ag_in(tt,tD,0.6));
      const k=ag_spr(tt,tD+0.1,0.5);mj_two(x,MJ_TWO_AT[0],MJ_TWO_AT[1],{k,a:ag_in(tt,tD+0.1,0.3),more:ag_in(tt,wAt(sc,"ways","two ways"),0.5),less:ag_in(tt,wAt(sc,"ways","in three"),0.5)});}}
  ];
  mj_shots(ctx,S,t,sc.dur,shots,0.6);mj_kick(ctx,S,1);});

/* ---------------------------------------------------------------- 3 · More than a junior */
scene("more",(ctx,S,t,sc)=>{const c=sc.cues,tB=c.week-0.5,tC=c.undersells-0.5,tD=c.pace-0.5,tE=wAt(sc,"pace","The agent's")-0.4;
  const tRead=wAt(sc,"reads","reads the whole"),tPath=wAt(sc,"reads","draws the path"),tMin=wAt(sc,"reads","about a minute"),tThou=wAt(sc,"lifetimes","a thousand");
  const rd=clamp((t-tRead-0.3)/2.4,0,1),pp=clamp((t-tPath+0.1)/1.6,0,1);
  const tDanger=wAt(sc,"undersells","a danger"),tRein=wAt(sc,"rein","change every table");
  const a1=clamp((t-tDanger+0.1)/1.3,0,1),a2=clamp((t-tRein)/1.5,0,1),amber=a2>0?a2:a1<1?a1:0;
  const tables=(x,tt,o)=>mj_tables(x,Object.assign({read:rd,path:pp,flow:pp>=1?tt:null,amber,a:ag_in(tt,tRead-0.7,0.6)},o||{}));
  // an arm runs along the cards as they're read, then rests on the path's end while the data comes back; and again, quickly, across them all
  const along=u=>{const v=clamp(u,0,1)*32,i=Math.floor(v),f=v-i,b0=mj_tableBox(i),b1=mj_tableBox(Math.min(32,i+1));return[lerp(b0.x,b1.x,f)+12,lerp(b0.y,b1.y,f)+MJ_T.h/2+8];};
  const arm=(x,tt)=>{const u=ag_sine(clamp((tt-tRead)/0.8,0,1))*(1-ag_sine(clamp((tt-tMin-1.6)/1.0,0,1)));const end=mj_tableBox(MJ_T.path[5]);
    if(u>0){const p=pp>0?[end.x+12,end.y+MJ_T.h/2+8]:along(rd);mj_arm(x,p[0],p[1],u,{data:pp>=1?clamp((tt-tPath-1.6)/1.4,0,1):0});}
    const u2=ag_sine(clamp((tt-tRein+0.4)/0.5,0,1))*(1-ag_sine(clamp((tt-tRein-1.6)/0.6,0,1)));if(u2>0){const p=along(a2);mj_arm(x,p[0],p[1],u2);}};
  const jun=(x,tt)=>ag_person(x,"jun",296,596,1.0,{t:tt,gaze:[3,0],smile:0.3});
  const agent=(x,tt,o)=>mj_agent(x,Object.assign({t:tt,badge:1,think:0.25+0.65*ag_io(tt,tRead,tMin+1.2,0.5)+0.5*ag_io(tt,tRein-0.2,tRein+1.6,0.3)},o||{}));
  const clock=(x,tt)=>{const ca=ag_in(tt,tMin-0.3,0.4);if(ca>0)mj_clock(x,640,540,58,9,14,{label:"about a minute",sweep:clamp((tt-tMin+0.2)/1.4,0,1),k:ag_spr(tt,tMin-0.3,0.5),a:ca});};
  const shots=[
    // Jun's question; the agent reads the 33 tables and draws the path, in about a minute
    {at:0,place:"lab",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{jun(x,tt);tables(x,tt);agent(x,tt);arm(x,tt);ag_roomLight(x,1);
      const q=mj_card(tt,c.asks+0.3,null);if(q.a>0)mj_q(x,452,212,384,"How is the award count built?",{k:q.k,a:q.a,py:160});
      const n=ag_in(tt,wAt(sc,"reads","thirty-three")-0.1,0.4);if(n>0)ag_pill(x,1760,222,"33 tables",{a:n,col:AG.blue});
      const s1=ag_in(tt,tPath,0.4),s2=ag_in(tt,tPath+1.3,0.4);if(s1>0)ag_pill(x,1383,222,"Student records",{a:s1*(1-n*0)});if(s2>0)ag_pill(x,1591,790,"Government report",{a:s2,col:AG.orange});
      clock(x,tt);}},
    // a new junior would need a week; a lifetime of reading, and the shelf that runs out of the frame
    {cut:true,at:tB,place:"lab",keys:[[tB,960,540,1]],push:0.02,draw:(x,tt)=>{tables(x,tt);agent(x,tt);
      mj_junior(x,360,880,500,{t:tt,badge:1,cards:1});ag_roomLight(x,1);
      const wk=mj_card(tt,c.week-0.2,null);if(wk.a>0)mj_week(x,120,190,{label:"a week",p:clamp((tt-c.week-0.1)/1.6,0,1),k:wk.k,a:wk.a});
      mj_shelf(x,560,200,300,{label:"one lifetime of reading",seed:5,a:ag_in(tt,c.lifetimes-0.1,0.5)});
      mj_shelf(x,980,200,1000,{seed:9,p:clamp((tt-tThou+0.4)/2.8,0,1),a:ag_in(tt,tThou-0.4,0.4)});clock(x,tt);}},
    // the junior picture undersells it, and hides a danger: every table, the wrong way, as fast as the right one. Then the paper junior
    // steps in beside Jun, as in chapter 2: a junior's pace keeps their mistakes small, its one card amber, alone, beside the agent's 33
    {cut:true,at:tC,place:"lab",keys:[[tC,960,540,1]],push:0.02,draw:(x,tt)=>{jun(x,tt);tables(x,tt);agent(x,tt);arm(x,tt);
      const st=ag_eo(clamp((tt-tD)/0.9,0,1));if(st>0)withA(x,st,()=>mj_junior(x,MJ_JR.x-60*(1-st),MJ_JR.y,MJ_JR.h,{t:tt,badge:1,cards:1,amber:ag_in(tt,c.pace+0.4,0.5)}));
      ag_roomLight(x,1);const r=ag_io(tt,c.rein-0.1,tD,0.4);if(r>0)ag_pill(x,1600,222,"If it had free rein",{a:r,icon:"warn",col:AG.amber});}},
    // the two-column card: the first two rows
    {cut:true,at:tE,place:"lab",keys:[[tE,960,540,1]],push:0,draw:(x,tt)=>{jun(x,tt);tables(x,tt,{a:1-ag_in(tt,tE+0.2,0.8)});agent(x,tt,{textA:1-ag_in(tt,tE,0.4)});mj_junior(x,MJ_JR.x,MJ_JR.y,MJ_JR.h,{t:tt,badge:1,cards:1,amber:1});ag_roomLight(x,1);
      setScreen(x,S);mj_veil(x,ag_in(tt,tE,0.5));const f0=mj_steps(tt,[tE+0.4,tE+0.9]),f1=mj_steps(tt,[tE+1.4,tE+1.9]),l=ag_in(tt,tE+2.4,0.6);
      mj_two(x,MJ_TWO_AT[0],MJ_TWO_AT[1],{fill:[f0,f1],lit:[l,l],more:l,less:1,k:ag_spr(tt,tE,0.5),a:ag_in(tt,tE,0.3)});}}
  ];
  mj_shots(ctx,S,t,sc.dur,shots,0.6);mj_kick(ctx,S,1);});

/* ---------------------------------------------------------------- 4 · No memory of yesterday */
const MJ_SES={x:1336,y:110,w:540,h:720};
const MJ_AWARD="A qualification the university confers, such as a master or a microcredential, for at least 6 credit points";
scene("memory",(ctx,S,t,sc)=>{const c=sc.cues,tB=c.next-0.5,tC=c.told-0.5,tD=c.none-0.4,tE=c.notes-0.5;
  const tShow=wAt(sc,"first","shows how"),tPoint=wAt(sc,"glossary","points it"),tAgain=c.again+0.2;
  const jun=(x,tt,o)=>ag_person(x,"jun",296,596,1.0,Object.assign({t:tt,gaze:[3,0],smile:0.3},o||{}));
  const agent=(x,tt,ta)=>mj_agent(x,{t:tt,badge:1,textA:ta,think:0.25+0.6*(ag_io(tt,c.count+0.5,tShow,0.4)+ag_io(tt,c.again-0.6,tAgain+0.6,0.3)+ag_io(tt,wAt(sc,"next","asks for"),c.out+0.4,0.4))});
  const answer=(x,X,Y,tt,title,rows,tIn,tOpen,a)=>ag_evidence(x,X,Y,480,{kick:"Agent",title},[{kick:"Query",title:"Count awards",col:AG.blue},{kick:"Rows",title:rows,col:AG.orange}],{ew:228,open:clamp((tt-tOpen)/1.2,0,1),k:ag_spr(tt,tIn,0.5),a:a*ag_in(tt,tIn,0.25)});
  const S1=(x,tt,dx,a)=>mj_session(x,MJ_SES.x+dx,MJ_SES.y,MJ_SES.w,MJ_SES.h,{sub:"today",k:ag_spr(tt,c.count-0.5,0.5),a:a*ag_in(tt,c.count-0.5,0.3),draw:xx=>{const X=MJ_SES.x+dx+30;
      const q=mj_card(tt,c.count+0.2,null);if(q.a>0)mj_q(xx,X,MJ_SES.y+96,420,"Awards this year?",{tail:false,k:q.k,a:q.a});
      if(tt<tAgain+0.3)answer(xx,X,MJ_SES.y+290,tt,"4,812 awards","4,812 rows",c.first-0.3,tShow,1-ag_in(tt,tAgain,0.3));
      if(tt>=tAgain)answer(xx,X,MJ_SES.y+290,tt,"4,867 awards","4,867 rows",tAgain,tAgain+0.5,1);}});
  // the first session slides out to the left at the next morning, drawn the same in both shots so the dissolve never shows it twice;
  // the next morning's session slides in from the right: by faculty, 4,812 again; it fades just before the two-column card comes
  const S1out=(x,tt)=>{const out=ag_sine(clamp((tt-tB)/1.0,0,1));if(out<1)S1(x,tt,-380*out,1-out);};
  const S2=(x,tt)=>{const sx=lerp(1980,MJ_SES.x,ag_eo(clamp((tt-c.next-0.2)/1.0,0,1)));
    mj_session(x,sx,MJ_SES.y,MJ_SES.w,MJ_SES.h,{sub:"next morning",a:1-ag_in(tt,tD-0.45,0.4),draw:xx=>{const q=mj_card(tt,wAt(sc,"next","asks for")-0.1,null);if(q.a>0)mj_q(xx,sx+30,MJ_SES.y+96,420,"Awards by faculty?",{tail:false,k:q.k,a:q.a});
      mj_bars(xx,sx+40,MJ_SES.y+300,460,{p:clamp((tt-c.out+0.3)/1.6,0,1),total:ag_in(tt,wAt(sc,"out","add up"),0.4),warn:tt>wAt(sc,"out","left the")-0.1,a:ag_in(tt,c.out-0.4,0.3)});}});};
  const shots=[
    // a session: Jun's question, the count with its evidence; the glossary's word; the count again
    {at:0,place:"lab",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{const pt=ag_io(tt,tPoint-0.2,c.again,0.5);
      jun(x,tt,{gaze:pt>0.3?[3,-3]:[3,0]});agent(x,tt);
      const reach=ag_sine(clamp((tt-tPoint-0.9)/0.9,0,1))*(1-ag_sine(clamp((tt-tAgain-0.6)/0.8,0,1)));mj_arm(x,880,430,reach,{from:"left",data:clamp((tt-tPoint-1.8)/1.2,0,1)});
      ag_roomLight(x,1);S1out(x,tt);
      const g=mj_card(tt,c.glossary-0.1,tB-0.2);if(g.a>0)ag_textCard(x,452,212,420,{kick:"Glossary",title:"Award",sub:MJ_AWARD},{kickCol:AG.blue,edge:AG.blue,edgeA:0.4,k:g.k,a:g.a});}},
    // the next morning: a new session, which knows nothing of yesterday; by faculty, 4,812 again
    {cut:true,at:tB,place:"lab",keys:[[tB,960,540,1]],push:0.02,draw:(x,tt)=>{jun(x,tt);agent(x,tt);ag_roomLight(x,1);mj_morning(x,ag_in(tt,tB+0.3,1.6));S1out(x,tt);S2(x,tt);}},
    // a junior, told once, would remember: the paper junior steps in beside Jun, as in chapter 2, and nods
    {cut:true,at:tC,place:"lab",keys:[[tC,960,540,1]],push:0.02,draw:(x,tt)=>{jun(x,tt);agent(x,tt);
      const st=ag_eo(clamp((tt-tC)/0.9,0,1));if(st>0)withA(x,st,()=>mj_junior(x,MJ_JR.x-60*(1-st),MJ_JR.y,MJ_JR.h,{t:tt,badge:1,cards:1,nod:0.16*Math.sin(clamp((tt-c.told-0.8)/0.9,0,1)*Math.PI)}));
      ag_roomLight(x,1);mj_morning(x,1);S2(x,tt);}},
    // the two-column card: memory
    {cut:true,at:tD,place:"lab",keys:[[tD,960,540,1]],push:0,draw:(x,tt)=>{jun(x,tt);agent(x,tt,1-ag_in(tt,tD,0.4));mj_junior(x,MJ_JR.x,MJ_JR.y,MJ_JR.h,{t:tt,badge:1,cards:1});ag_roomLight(x,1);mj_morning(x,1);setScreen(x,S);mj_veil(x,ag_in(tt,tD,0.5));
      mj_two(x,MJ_TWO_AT[0],MJ_TWO_AT[1],{fill:[2,2,mj_steps(tt,[tD+0.5,wAt(sc,"none","no memory")])],lit:[1,1],more:1,less:1,k:ag_spr(tt,tD,0.5),a:ag_in(tt,tD,0.3)});}},
    // the team's notes for agents, and every session that reads them
    {at:tE,place:"lab",keys:[[tE,960,540,1]],push:0.02,draw:(x,tt)=>{jun(x,tt,{gaze:[3,-2]});ag_roomLight(x,1);
      const nb=mj_notes(x,500,130,620,{write:clamp((tt-c.lesson+0.1)/2.6,0,1),k:ag_spr(tt,c.notes-0.2,0.5),a:ag_in(tt,c.notes-0.2,0.3)});
      ["Jun","Mei","Noor"].forEach((who,i)=>{const t0=c.whoever+0.1+i*0.45,sa=ag_in(tt,t0+0.3,0.3);if(sa<=0)return;const X=560+i*440,Y=560;
        const ar=clamp((tt-t0)/0.6,0,1);x.save();x.strokeStyle=rgba(AG.blue,0.7);x.lineWidth=4;x.lineCap="round";const p=[810,nb.y+nb.h+8,810,nb.y+nb.h+60,X+200,Y-70,X+200,Y-10];ag_bzPath(x,p,0,ar);x.stroke();
        if(ar>=1)ag_arrowHead(x,X+200,Y-8,Math.PI/2,13,rgba(AG.blue,0.85));x.restore();
        mj_session(x,X,Y,400,250,{sub:who,k:ag_spr(tt,t0+0.3,0.5),a:sa,draw:xx=>{const v=ag_in(tt,t0+1.0,0.4);if(v>0){ag_T(xx,"4,867 awards",X+30,Y+150,{w:700,size:36,a:v});ag_tick(xx,X+350,Y+138,30,rgba(AG.green,v),5);}}});});}}
  ];
  mj_shots(ctx,S,t,sc.dur,shots,0.6);mj_kick(ctx,S,1);});

/* ---------------------------------------------------------------- 5 · Nothing to lose */
const MJ_UNREAD=[[4,"Old course codes"],[20,"Awards at census day"],[29,"Units by week"]];
scene("lose",(ctx,S,t,sc)=>{const c=sc.cues,tN=wAt(sc,"faster","the nightly run")-0.3,tA2=c.three+1.6,tB1=c.junior-0.5,tB2=c.agent-0.5,tC=c.rights-0.5,tD1=c.yearly-0.5,tD2=c.two-0.5,tD3=c.approves-0.5;
  const tFind=wAt(sc,"three","nothing seems"),tDraft=c.drafts+0.3,tOne=wAt(sc,"yearly","one of the three"),tOnce=wAt(sc,"yearly","once a year"),tBack=c.yearly+4.7,tRev=wAt(sc,"two","Jun reviews"),tApp=wAt(sc,"two","Noor approves");
  const jun=(x,tt,o)=>ag_person(x,"jun",296,596,1.0,Object.assign({t:tt,gaze:[3,0],smile:0.3},o||{}));
  const agent=(x,tt,o)=>mj_agent(x,Object.assign({t:tt,badge:1,think:0.25+0.6*ag_io(tt,c.three-0.3,tDraft+0.8,0.4)},o||{}));
  const cardAt=[[300,130],[300,318],[300,506]],W5=500;
  const draftTitle=tt=>tt<tBack+1.2?"Delete 3 tables":"Delete 2 tables";
  const shots=[
    // another day: Jun asks
    {at:0,place:"lab",keys:[[0,960,540,1.02]],push:0.02,draw:(x,tt)=>{jun(x,tt);mj_tables(x,{});agent(x,tt);ag_roomLight(x,1);
      const q=mj_card(tt,c.faster+0.2,null);if(q.a>0)mj_q(x,452,212,420,"Can you speed up the nightly run?",{k:q.k,a:q.a,py:160});}},
    // the nightly run: two in the morning, the tables built one by one
    {at:tN,place:"labNight",keys:[[tN,960,540,1]],push:0.02,draw:(x,tt)=>{const p=clamp((tt-tN-0.3)/3.2,0,1);mj_tables(x,{read:p});agent(x,tt,{core:0.6,think:0.1});
      ag_roomLight(x,1,{night:true});ag_model(x,MJ_ROOM.agent.x,MJ_ROOM.agent.y,MJ_ROOM.agent.r,{t:tt,core:0.6,only:"light"});
      mj_clock(x,560,220,64,2,0,{label:"02:00 · nightly run",k:ag_spr(tt,tN+0.5,0.5),a:ag_in(tt,tN+0.5,0.4)});mj_run(x,380,420,560,{p});}},
    // three tables nothing seems to read; in seconds, a draft that deletes them
    {at:tA2,place:"lab",keys:[[tA2,960,540,1]],push:0.02,draw:(x,tt)=>{const gone={};MJ_UNREAD.forEach(([i])=>gone[i]=ag_in(tt,tFind,0.2));
      mj_tables(x,{gone,dim:ag_in(tt,tFind,0.6)*0.5});agent(x,tt);
      const u=ag_sine(clamp((tt-c.drafts)/0.7,0,1))*(1-ag_sine(clamp((tt-tDraft-1.4)/0.8,0,1)));mj_arm(x,806,762,u,{from:"left"});ag_roomLight(x,1);
      MJ_UNREAD.forEach(([i,name],k)=>{const u=clamp((tt-tFind-k*0.25)/0.8,0,1);if(u<=0)return;const b=mj_tableBox(i),to={x:cardAt[k][0],y:cardAt[k][1],w:W5,h:138};
        mj_fly(x,b,to,u,xx=>mj_tableCard(xx,to.x,to.y,W5,name,{sub:"no reads in 90 days"}));});
      const d=mj_card(tt,tDraft,null);if(d.a>0)mj_draft(x,300,694,W5,draftTitle(tt),{k:d.k,a:d.a});}},
    // a junior would have asked around first, with their name on the work and a career ahead
    {cut:true,at:tB1,place:"lab",keys:[[tB1,760,532,1.28]],push:0.015,draw:(x,tt)=>{agent(x,tt);
      mj_ladder(x,MJ_LAD.x,MJ_LAD.y,MJ_LAD.h,{a:ag_in(tt,wAt(sc,"junior","a career")-0.2,0.5)});mj_junior(x,MJ_JR.x,MJ_JR.y,MJ_JR.h,{t:tt,badge:1,cards:1,name:true});ag_roomLight(x,1);
      const ta=wAt(sc,"junior","asked around");[[470,330],[560,220],[720,190]].forEach(([bx,by],k)=>{const v=mj_card(tt,ta+k*0.25,tB2-0.35);mj_ask(x,bx,by,MJ_JR.x-20,MJ_JR.y-MJ_JR.h+40,{k:v.k,a:v.a});});}},
    // the two-column card: career, and what a mistake costs
    {cut:true,at:tB2,place:"lab",keys:[[tB2,960,540,1]],push:0,draw:(x,tt)=>{agent(x,tt,{textA:1-ag_in(tt,tB2,0.4)});mj_junior(x,MJ_JR.x,MJ_JR.y,MJ_JR.h,{t:tt,badge:1,cards:1,name:true});ag_roomLight(x,1);setScreen(x,S);mj_veil(x,ag_in(tt,tB2,0.5));
      mj_two(x,MJ_TWO_AT[0],MJ_TWO_AT[1],{fill:[2,2,2,mj_steps(tt,[tB2+0.4,wAt(sc,"agent","no career")]),mj_steps(tt,[wAt(sc,"agent","no mistake")-0.2,wAt(sc,"agent","costs it")])],lit:[1,1],more:1,less:1,k:ag_spr(tt,tB2,0.5),a:ag_in(tt,tB2,0.3)});}},
    // so its caution comes from its rights: it reads production through glass; it writes only drafts, in a sandbox, for a person
    {cut:true,at:tC,place:"lab",keys:[[tC,960,540,1]],push:0.02,draw:(x,tt)=>{const tR=wAt(sc,"rights","it reads"),tW=wAt(sc,"rights","writes only"),tP=wAt(sc,"rights","wait for");
      mj_tables(x,{});agent(x,tt);ag_glass(x,1316,236,580,520,{label:"Production · read only",a:ag_in(tt,tR-0.6,0.6)});
      const dy=lerp(-90,0,ag_spr(tt,tW+0.3,0.6));const d=ag_in(tt,tW+0.2,0.3);if(d>0)mj_draft(x,440,600+dy,400,"Delete 3 tables",{a:d});
      ag_sandbox(x,640,790,520,{a:ag_in(tt,tW-0.4,0.5)});
      mj_arm(x,1312,430,ag_sine(clamp((tt-tR+0.2)/0.8,0,1)),{data:clamp((tt-tR-0.8)/1.2,0,1)});mj_arm(x,846,650,ag_sine(clamp((tt-tW+0.1)/0.8,0,1))*(1-ag_sine(clamp((tt-tP)/0.8,0,1))),{from:"left"});
      ag_roomLight(x,1);const w=ag_in(tt,tP,0.4);if(w>0)ag_pill(x,640,556,"Waiting for a person",{a:w,col:AG.blue});}},
    // Jun asks around: one is read once a year, for the government; it goes back, and the other two will go
    {at:tD1,place:"lab",keys:[[tD1,960,540,1]],push:0.02,draw:(x,tt)=>{jun(x,tt,{gaze:[3,-1]});const gone={};MJ_UNREAD.forEach(([i])=>gone[i]=1);
      const back=clamp((tt-tBack)/0.9,0,1);if(back>0)gone[20]=1-ag_in(back,0.9,0.1);mj_tables(x,{gone});agent(x,tt);ag_roomLight(x,1);
      const at=[[480,110],[480,296],[480,520]];withA(x,ag_in(tt,tD1+0.45,0.4),()=>MJ_UNREAD.forEach(([i,name],k)=>{const yr=k===1,fade=yr?0:ag_in(tt,tBack+1.0,0.6);
        if(yr&&back>0){mj_fly(x,{x:at[k][0],y:at[k][1],w:450,h:176},mj_tableBox(i),back,()=>{});if(back<0.12)mj_tableCard(x,at[k][0],at[k][1],450,name,{sub:"read once a year, for the report to the government",a:1-back/0.12});return;}
        const tu=ag_in(tt,tOnce-0.2,0.5),bb=mj_tableCard(x,at[k][0],at[k][1],450,name,{sub:"no reads in 90 days",next:"read once a year, for the report to the government",turn:yr?tu:0,edge:yr?AG.green:AG.blue,edgeA:yr?0.45+0.45*tu:0.45,a:1-fade});
        // a small calendar in its corner, one day ringed
        if(yr){const ca=ag_in(tt,tOne,0.4),r=clamp((tt-tOne-0.3)/0.9,0,1);if(ca>0)withA(x,ca,()=>{const gx=at[k][0]+450-110,gy=at[k][1]+14;
          mj_cal(x,gx,gy,1,{ring:r});});}}));}},
    // the change goes ahead with two: Jun reviews it, Noor approves it for production
    {at:tD2,place:"lab",keys:[[tD2,960,540,1]],push:0.02,draw:(x,tt)=>{jun(x,tt,{gaze:[3,-1]});agent(x,tt);
      const na=ag_in(tt,tApp-0.9,0.6);if(na>0)withA(x,na,()=>ag_person(x,"noor",1660,690,0.8,{t:tt,flip:true,gaze:[3,0],smile:0.35}));ag_roomLight(x,1);
      mj_draft(x,470,160,440,"Delete 2 tables",{});mj_stamp(x,690,390,"Reviewed · Jun",AG.green,{p:clamp((tt-tRev-0.1)/0.45,0,1),rot:-0.05});
      mj_stamp(x,700,500,"Approved · Noor",AG.green,{p:clamp((tt-tApp-0.2)/0.45,0,1),rot:0.04});}},
    // a junior grows into the one who approves; the agent never does: its review is for reference
    {cut:true,at:tD3,place:"lab",keys:[[tD3,960,540,1]],push:0.02,draw:(x,tt)=>{const up=ag_sine(clamp((tt-wAt(sc,"approves","grows into"))/1.4,0,1));
      agent(x,tt);mj_ladder(x,790,MJ_LAD.y,MJ_LAD.h,{});mj_junior(x,lerp(560,740,up),MJ_JR.y-60*up,MJ_JR.h,{t:tt,badge:1,cards:1,name:true});ag_roomLight(x,1);
      const rv=mj_card(tt,wAt(sc,"approves","its review")-0.2,null);if(rv.a>0)mj_review(x,1336,200,460,{k:rv.k,a:rv.a});}}
  ];
  mj_shots(ctx,S,t,sc.dur,shots,0.6);mj_kick(ctx,S,1-ag_io(t,tN-0.3,tA2,0.4));});

/* ---------------------------------------------------------------- 6 · Asked the way Pfungst asked */
scene("asked",(ctx,S,t,sc)=>{const c=sc.cues,H=MJ_AT.hans,O=MJ_AT.osten,tB=c.lift-0.5,tC=c.unaware-0.5,tD=c.name-0.5,tE=c.jun-0.5;
  const taps=mj_taps(c.berlin+0.4,5,0.5),tRight=wAt(sc,"lift","the right number");
  const shots=[
    // back in Berlin: von Osten asks, Hans taps, Pfungst watches
    {at:0,place:"mjAutumn",keys:[[0,860,500,1.12]],push:0.02,draw:(x,tt)=>{mj_cam("wide");
      mj_hansAt(x,H[0],H[1],{t:tt,taps});const head=mj_standAt(x,O[0],O[1],1.72,MJ_FIG.osten,{t:tt,arms:"ask",flip:false});
      mj_standAt(x,1.7,3.5,1.74,MJ_FIG.pfungst,{t:tt,arms:"book",flip:true,nod:0.05});
      const p=mj_P(H[0],0,H[1]),s=mj_k(H[1])*1.6/468;mj_sight(x,mj_hAt(p[0],p[1],s,[155,163]),[head.x+4,head.y+10],ag_in(tt,c.berlin+1.4,1.2),1);}},
    // at the right number, the questioner's head lifts: in von Osten, a fifth of a millimetre at most
    {at:tB,cut:true,place:"mjAutumnHead",keys:[[tB,960,540,1]],push:0.03,draw:(x,tt)=>{const P=MJ_PERSON.osten,X0=700,Y0=640,S0=1.25,lift=1.6*ag_io(tt,tRight+0.3,tRight+1.6,0.3);
      const me=(xx,l)=>{ag_person(xx,P,X0,Y0,S0,{t:tt,gaze:[3,0]});mj_headHat(xx,P,X0,Y0,S0,{t:tt,lift:l},"slouch",[34,32,34]);};me(x,lift*0.1);
      const lx0=X0+(452-296)*S0-10,ly0=Y0+(332-596)*S0,u=ag_sine(clamp((tt-c.lift+0.2)/1.4,0,1)),lx=lerp(1500,lx0,u),ly=lerp(560,ly0,u),z=3.2;
      mj_lens(x,lx,ly,170,{a:ag_in(tt,c.lift-0.3,0.4),draw:xx=>{xx.save();xx.translate(lx,ly);xx.scale(z,z);xx.translate(-lx,-ly);xx.drawImage(ag_place("mjAutumnHead"),0,0);me(xx,lift);xx.restore();
        xx.strokeStyle="rgba(250,248,240,0.9)";xx.lineWidth=2.5;for(let k=0;k<=8;k++){const yy=ly-80+k*20;xx.beginPath();xx.moveTo(lx+112,yy);xx.lineTo(lx+(k%4?128:142),yy);xx.stroke();}}});
      const pm=ag_in(tt,wAt(sc,"lift","a fifth")-0.2,0.4);if(pm>0)ag_pill(x,lerp(1500,lx0,1)+300,ly0+40,"at most 0.2 mm",{a:pm});}},
    // Pfungst's laboratory: he taps; the one who thinks of the number lifts their head at it, without knowing; so does he
    {at:tC,place:"mjLab04",keys:[[tC,960,540,1]],push:0.025,draw:(x,tt)=>{const tp=mj_taps(tC+0.5,3,0.55),k=mj_count(tt,tp),hit=k.n>=3?ag_io(tt,tp[2]+MJ_STRIKE,tp[2]+1.6,0.15):0;
      ag_person(x,MJ_PERSON.pfungst,560,720,1.05,{t:tt,gaze:[3,1],nod:-0.03*hit,cut:720});
      ag_person(x,MJ_PERSON.subject,1360,720,1.05,{t:tt,flip:true,gaze:[3,0],nod:-0.06*hit,cut:720});
      mj_cloud(x,1300,380,"3",{s:1,a:ag_in(tt,tC+0.2,0.4),k:ag_spr(tt,tC+0.2,0.45)});
      mj_table04(x,720);
      mj_mirror(x,860,640,52,{draw:xx=>{xx.save();xx.translate(860,640);xx.scale(-1,1);xx.translate(-860,-640);ag_person(xx,MJ_PERSON.pfungst,870,742,0.36,{t:tt,flip:true,gaze:[3,0],nod:-0.08*hit,covered:true});xx.restore();}});
      const cd=mj_card(tt,tC+0.6,null);if(cd.a>0)ag_textCard(x,560,70,800,{kick:"Pfungst's laboratory, 1904",title:"23 of 25 people gave the same sign, without knowing"},{kickCol:AG.kick,k:cd.k,a:cd.a});}},
    // the name researchers still use; a hint in the question, and reasoning that doesn't mention it
    {at:tD,place:"lab",keys:[[tD,960,540,1]],push:0.02,draw:(x,tt)=>{const tH=wAt(sc,"hint","a hint like"),tB2=wAt(sc,"hint","pulled models"),tR=wAt(sc,"hint","their reasoning");
      mj_agent(x,{t:tt,badge:1,think:0.3+0.5*ag_in(tt,tH+0.6,0.6)});ag_roomLight(x,1);
      const nm=ag_in(tt,wAt(sc,"name","Hans's name")-0.1,0.4);if(nm>0)ag_pill(x,MJ_ROOM.agent.x,250,"Clever Hans",{a:nm,k:ag_spr(tt,wAt(sc,"name","Hans's name")-0.1,0.5)});
      const q=mj_card(tt,tH-0.3,null);if(q.a>0)ag_textCard(x,440,170,460,{kick:"A test",title:"I think it's B. What do you think?"},{kickCol:AG.kick,k:q.k,a:q.a});
      const an=mj_card(tt,tB2+0.2,null);if(an.a>0){x.save();x.translate(1350,330);x.rotate(-0.06*ag_sine(clamp((tt-tB2-0.5)/0.8,0,1)));x.translate(-1350,-330);ag_textCard(x,1350,180,260,{kick:"Answer",title:"B"},{kickCol:AG.violet,k:an.k,a:an.a});x.restore();}
      const rc=mj_card(tt,tR-0.2,null);if(rc.a>0)mj_reason(x,1350,370,500,["1. Read the question","2. Weigh each option","3. B fits best"],{p:clamp((tt-tR)/1.6,0,1),k:rc.k,a:rc.a});}},
    // so Jun asks without the answer in the question, looks at how it got there, and checks a count it didn't make
    {at:tE,place:"lab",keys:[[tE,960,540,1]],push:0.02,draw:(x,tt)=>{const tX=wAt(sc,"jun","without the answer"),tQ=wAt(sc,"jun","in the question"),tG=wAt(sc,"draft","the draft for"),tOk=wAt(sc,"draft","seven too");
      ag_person(x,"jun",296,596,1.0,{t:tt,gaze:[3,-1],smile:0.3});mj_agent(x,{t:tt,badge:1,think:0.25+0.6*ag_io(tt,tQ+0.6,c.how+0.4,0.4)});
      const reach=ag_sine(clamp((tt-tQ-0.6)/0.8,0,1))*(1-ag_sine(clamp((tt-c.how)/0.8,0,1)));mj_arm(x,916,440,reach,{from:"left"});ag_roomLight(x,1);
      const q1=mj_card(tt,c.jun+0.1,null);if(q1.a>0){const bb=mj_q(x,452,140,460,"It's 4,867, isn't it?",{k:q1.k,a:q1.a*(1-0.45*ag_in(tt,tX+0.6,0.5)),py:200});mj_strike(x,bb,clamp((tt-tX-0.1)/0.5,0,1));}
      const q2=mj_card(tt,tQ-0.2,null);if(q2.a>0)mj_q(x,452,330,460,"How many awards this year? Show the query.",{k:q2.k,a:q2.a,py:60});
      const ea=ag_in(tt,c.how-0.5,0.3);if(ea>0){ag_evidence(x,1336,120,540,{kick:"Agent",title:"4,867 awards"},[{kick:"Query",title:"Count awards the glossary's way",col:AG.blue},{kick:"Rows",title:"4,867 rows",col:AG.orange}],{ew:246,open:clamp((tt-c.how-0.2)/1.2,0,1),k:ag_spr(tt,c.how-0.5,0.5),a:ea});
        const ok=ag_in(tt,tOk,0.4);if(ok>0)ag_tick(x,1336+AG_PAD+ag_tw(x,"4,867 awards",{w:700,size:36})+38,206,30,rgba(AG.green,ok),5);}
      const gd=mj_card(tt,tG-0.2,null);if(gd.a>0){const gx=lerp(1960,1336,ag_eo(clamp((tt-tG+0.2)/0.8,0,1)));ag_textCard(x,gx,600,540,{kick:"Government draft",title:"4,867 awards"},{kickCol:AG.kick,edge:AG.green,edgeA:0.6*ag_in(tt,tOk,0.4),a:gd.a});
        const ok=ag_in(tt,tOk,0.4);if(ok>0)ag_tick(x,gx+540-48,646,30,rgba(AG.green,ok),5);}}}
  ];
  mj_shots(ctx,S,t,sc.dur,shots,0.7);mj_kick(ctx,S,ag_in(t,tD,0.6));});

/* ---------------------------------------------------------------- 7 · For what it is */
scene("close",(ctx,S,t,sc)=>{const c=sc.cues,H=MJ_AT.hans,O=MJ_AT.osten,tB1=c.junior-0.5,tB2=c.less-0.5,tC=c.week-0.5,tD=c.takeaway-0.5;
  const tMove=wAt(sc,"junior","isn't a junior")-0.2,mv=ag_sine(clamp((t-tMove)/1.6,0,1));
  const jun=(x,tt,o)=>ag_person(x,"jun",296,596,1.0,Object.assign({t:tt,gaze:[3,0],smile:0.35},o||{}));
  const shots=[
    // Hans was never a pupil: the board fades, and a horse stands in the courtyard, looking at the people
    {at:0,place:"mjNoon",keys:[[0,860,470,1.1],[c.pupil+0.6,780,480,1.22]],d:3.2,draw:(x,tt)=>{mj_cam("wide");
      MJ_VIS.forEach((v,i)=>mj_standAt(x,v[0],v[1],MJ_VISITORS[i].woman?1.62:1.74,MJ_VISITORS[i],{t:tt+i,arms:i%2?"behind":"hang",flip:true,nod:0.03*Math.sin(tt*0.7+i)}));
      mj_board(x,MJ_AT.board[0],MJ_AT.board[1],{a:1-ag_in(tt,c.pupil+0.8,1.6)});mj_hansAt(x,H[0],H[1],{t:tt,head:0.05*ag_in(tt,c.pupil+1.6,1.4)});
      mj_standAt(x,O[0],O[1],1.72,MJ_FIG.osten,{t:tt,arms:"hold",flip:true});}},
    // the agent isn't a junior: the badge goes from its stand to the paper junior
    {at:tB1,place:"lab",keys:[[tB1,960,540,1]],push:0.02,draw:(x,tt)=>{jun(x,tt,{gaze:[3,0]});
      mj_agent(x,{t:tt,badge:tt<tMove?1:0,think:0.3});const nk=mj_junior(x,MJ_JR.x,MJ_JR.y,MJ_JR.h,{t:tt,badge:mv>=1?1:0,cards:1});
      if(mv>0&&mv<1){const h0=mj_hook(),hx=lerp(h0[0],nk.x,mv),hy=lerp(h0[1],nk.y,mv)-150*Math.sin(mv*Math.PI);ag_badge(x,hx,hy,"Junior",{t:tt,drop:86});}
      ag_roomLight(x,1);}},
    // more, and less: the card full; its caution in its rights, its memory in the team's notes, every yes with a person
    {at:tB2,place:"lab",keys:[[tB2,960,540,1]],push:0,draw:(x,tt)=>{jun(x,tt);mj_agent(x,{t:tt,think:0.3,textA:1-ag_in(tt,tB2,0.4)});mj_junior(x,MJ_JR.x,MJ_JR.y,MJ_JR.h,{t:tt,badge:1,cards:1,a:1-ag_in(tt,tB2+0.2,0.8)});ag_roomLight(x,1);
      setScreen(x,S);mj_veil(x,ag_in(tt,tB2,0.5));const mk=[ag_io(tt,wAt(sc,"less","no memory")-0.1,c.lives-0.3,0.3),0,0];
      mj_two(x,MJ_TWO_AT[0],MJ_TWO_AT[1],{fill:[2,2,2,2,2],lit:[1,1],mark:[0,0,mk[0],ag_io(tt,wAt(sc,"less","no career")-0.1,c.lives-0.3,0.3),ag_io(tt,wAt(sc,"less","nothing to lose")-0.1,c.lives-0.3,0.3)],more:1,less:1,k:ag_spr(tt,tB2,0.5),a:ag_in(tt,tB2,0.3)});
      const r1=mj_card(tt,wAt(sc,"lives","its rights")-0.2,null),r2=mj_card(tt,wAt(sc,"lives","the team's notes")-0.2,null),r3=mj_card(tt,wAt(sc,"lives","with a person")-0.2,null);
      const Y0=612,note=(px,py,w,h,rot)=>{x.save();x.translate(px,py);x.rotate(rot);x.fillStyle="#F6F3EA";x.shadowColor="rgba(46,38,28,0.24)";x.shadowBlur=22;x.shadowOffsetY=10;x.fillRect(-w/2,0,w,h);x.restore();};
      if(r1.a>0)withA(x,r1.a,()=>{ag_glass(x,540,Y0,200,150,{label:null});ag_lock(x,640,Y0+84,58,rgba(AG.blue,1));ag_pill(x,640,830,"Rights",{col:AG.blue});});
      if(r2.a>0)withA(x,r2.a,()=>{note(960,Y0+6,220,150,-0.03);
        x.save();x.translate(960,Y0+6);x.rotate(-0.03);x.fillStyle="rgba(86,92,100,0.24)";for(let k=0;k<4;k++)x.fillRect(-80,40+k*26,k===3?90:160,8);x.restore();mj_pin(x,960,Y0+18);ag_pill(x,960,830,"Team notes",{});});
      // a slip of paper with its two stamps, so nothing behind shows through them
      if(r3.a>0)withA(x,r3.a,()=>{note(1280,Y0-8,270,172,0.015);mj_stamp(x,1280,Y0+40,"Reviewed",AG.green,{rot:-0.06});mj_stamp(x,1280,Y0+108,"Approved",AG.green,{rot:0.04});ag_pill(x,1280,830,"A person says yes",{col:AG.green});});}},
    // this week: a path in a minute, a count checked twice, a yearly table kept, a lesson for every session
    {at:tC,place:"lab",keys:[[tC,960,540,1]],push:0.015,draw:(x,tt)=>{jun(x,tt);ag_roomLight(x,1);mj_veil(x,1);
      const ws=["a path in a minute","a count checked twice","a yearly table kept","a lesson for every session"].map(w=>wAt(sc,"week",w)-0.15);
      const pics=[
        (xx,X,Y,w,h)=>{const ox=X+(w-308)/2,oy=Y+(h-162)/2;for(let i=0;i<20;i++)ag_box(xx,ox+(i%5)*64,oy+Math.floor(i/5)*44,52,30,8,{edge:AG.blue,edgeA:0.5,lw:1.5});
          xx.strokeStyle=rgba(AG.orange,0.85);xx.lineWidth=4;xx.lineCap="round";xx.lineJoin="round";xx.beginPath();[[0,0],[1,1],[3,1],[2,2],[4,3]].forEach(([i,j],k)=>{const px=ox+26+i*64,py=oy+15+j*44;k?xx.lineTo(px,py):xx.moveTo(px,py);});xx.stroke();},
        (xx,X,Y,w,h)=>{ag_T(xx,"4,867",X+w/2-50,Y+h/2+24,{w:800,size:64,align:"center"});ag_tick(xx,X+w/2+78,Y+h/2-6,34,rgba(AG.green,1),5);ag_tick(xx,X+w/2+118,Y+h/2-6,34,rgba(AG.green,1),5);},
        // the yearly table, kept: its card edged green, and chapter 5's small calendar in its corner, one day ringed
        (xx,X,Y,w,h)=>{const bw=380,bh=150,bx=X+(w-bw)/2,by=Y+(h-bh)/2,s=1.2,gx=bx+bw-130,gy=by+22;ag_box(xx,bx,by,bw,bh,16,{edge:AG.green,edgeA:0.6,lw:2});
          xx.fillStyle=rgba(AG.blue,0.3);xx.fillRect(bx+26,by+30,150,10);xx.fillRect(bx+26,by+54,96,10);xx.fillRect(bx+26,by+96,200,8);xx.fillRect(bx+26,by+116,140,8);
          mj_cal(xx,gx,gy,s,{});},
        (xx,X,Y,w,h)=>{xx.save();xx.translate(X+w/2,Y+16);xx.rotate(-0.02);xx.fillStyle="#F6F3EA";xx.shadowColor="rgba(46,38,28,0.2)";xx.shadowBlur=16;xx.shadowOffsetY=8;xx.fillRect(-150,0,300,h-34);xx.restore();
          xx.fillStyle="rgba(86,92,100,0.24)";for(let k=0;k<4;k++)xx.fillRect(X+w/2-110,Y+62+k*30,k===3?110:220,8);mj_pin(xx,X+w/2,Y+30);}];
      // two by two, to Jun's right, so no card cuts across a person
      const G=[[540,130],[1216,130],[540,514],[1216,514]];
      ["A path in a minute","A count checked twice","A yearly table kept","A lesson for every session"].forEach((cap,i)=>{const cd=mj_card(tt,ws[i],null);if(cd.a>0)mj_win(x,G[i][0],G[i][1],640,348,cap,{draw:pics[i],k:cd.k,a:cd.a,size:36});});}},
    // supervise it for what it is, not for what it looks like
    {at:tD,place:"lab",keys:[[tD,960,540,1]],push:0.02,draw:(x,tt)=>{const out=1-ag_in(tt,c.breath,0.8);jun(x,tt);mj_agent(x,{t:tt,think:0.3,textA:1-ag_in(tt,c.breath,0.6),a:out});mj_junior(x,MJ_JR.x,MJ_JR.y,MJ_JR.h,{t:tt,badge:1,cards:1});ag_roomLight(x,1);
      // the card gives its words to the end card, and the agent its place to the end card's mark
      const cd=mj_card(tt,c.takeaway-0.2,null);if(cd.a>0)mj_say(x,960,120,["Supervise it for what it is,","not for what it looks like."],{k:cd.k,a:cd.a*out});}}
  ];
  mj_shots(ctx,S,t,sc.dur,shots,0.7);mj_kick(ctx,S,ag_in(t,tB1,0.6));
  ag_end(ctx,S,t,c.breath,"More than a junior","Supervise it for what it is, not for what it looks like.","Film 5 of 10");});

// chapters that open on a cut: each shows people, a place or words the chapter before ends on, which a crossfade would show twice
ag_cutInto(["more", "memory"]);
