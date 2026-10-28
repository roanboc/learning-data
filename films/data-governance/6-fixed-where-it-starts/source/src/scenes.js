/* ===== Fixed where it starts: the eight chapters =====
   Each chapter is a few shots in the places of plan.js and the series' rooms.js, cut together with short dissolves (gv_shots). Times
   inside a chapter come from its cues (when each line starts) and the words of its lines (wAt), so the pictures stay with the voice if
   it's recorded again. Words on screen are on paper, screens, boards, tags and speech bubbles, at least 28 px as seen, and above the
   captions while the voice speaks. */

// made once per chapter, the first time it draws: its cues are known by then
const fw_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// the year and the place in the top corner: the latest one passed, dissolving from the one before
function fw_pill(ctx,t,mk,a){if(a<=0.01)return;let i=0;for(let k=1;k<mk.length;k++)if(t>=mk[k][0])i=k;const u=i>0?fin(t,mk[i][0],0.35):1;
  if(u<1)wc_year(ctx,56,72,mk[i-1][1],a*(1-u));wc_year(ctx,56,72,mk[i][1],a*u);}
// a tag that springs in at t0 and goes at t1 (or stays)
function fw_tagAt(ctx,t,t0,t1,x,y,s,o){const a=t1==null?fin(t,t0,0.35):gv_io(t,t0,t1,0.35);if(a<=0.01)return;const k=0.9+0.1*spring(fin(t,t0,0.5));
  ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,a,()=>wc_tag(ctx,0,0,s,Object.assign({align:"center"},o||{})));ctx.restore();}
// the film's question, as a gold tag: where it shows, where it starts; a soft gold glow round what it names (r: x, y, w, h)
function fw_where(ctx,t,t0,t1,s,x,y,r){const a=t1==null?fin(t,t0,0.4):gv_io(t,t0,t1,0.4);if(a<=0.01)return;if(r)gv_halo(ctx,r[0],r[1],r[2],r[3],GV.gold,0.85*a);
  fw_tagAt(ctx,t,t0,t1,x,y,s,{size:32,wash:GV.gold,washA:0.32});}
// a card of two lines, centred at (x,y): what a place is and who works there, or who someone is; it springs in at t0 (and goes at t1)
function fw_plate(ctx,t,t0,t1,x,y,lines){const a=t1==null?fin(t,t0,0.4):gv_io(t,t0,t1,0.4);if(a<=0.01)return;
  const w=Math.round(Math.max(tw(ctx,lines[0],30,800),tw(ctx,lines[1],28,600))+48),h=96,k=0.92+0.08*spring(fin(t,t0,0.5));
  ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,a,()=>{wc_panel(ctx,-w/2,-h/2,w,h,{kind:"card",seed:w});wc_T(ctx,lines[0],0,-6,{w:800,size:30,align:"center",col:WC_DARK});
    wc_T(ctx,lines[1],0,32,{w:600,size:28,align:"center",col:WC_MUTED});});ctx.restore();}
// a speech bubble that springs in at t0 and goes at t1
function fw_say(ctx,t,t0,t1,bx,by,lines,tx,ty){gv_say(ctx,bx,by,lines,tx,ty,{a:gv_io(t,t0,t1,0.35),k:0.92+0.08*spring(fin(t,t0,0.5)),size:34});}
// someone fading in or out, drawn whole into a buffer and laid down at a, so their arms and coat don't show through each other
function fw_ghost(ctx,a,fn){if(a<=0.01)return;if(a>=0.99){fn(ctx);return;}const [bc,bx]=wc_buf("fwGhost",ctx.canvas.width,ctx.canvas.height);bx.setTransform(ctx.getTransform());fn(bx);
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha*=a;ctx.drawImage(bc,0,0);ctx.restore();}
// a face between two expressions
function fw_face(a,b,m){const A=EXPR[a],B=EXPR[b];if(m<=0)return A;if(m>=1)return B;const o={};new Set([...Object.keys(A),...Object.keys(B)]).forEach(k=>o[k]=lerp(A[k]||0,B[k]||0,m));return o;}

// ---- 1 · Two clinics: Vienna, 1847; women beg not to be sent to the first clinic; the fever shows in the beds, and starts on the
// doctors' hands on their way in; washed off there, and mothers go home ----
// people in the corridor walk at FW_WK.y, at FW_WK.s; someone walks from one door to another, coming out of the first and going in at
// the second, and turns the way they go
const FW_WK={y:906,s:0.62,v:230};
function fw_goes(ctx,id,t,t0,x0,x1,o){o=o||{};const w=gv_walk(t,t0,x0,x1,o.v||FW_WK.v),a=fin(t,t0-0.15,0.35)*(1-fin(t,w.end-0.15,0.4));if(t<t0-0.15||a<=0.01)return;
  fw_ghost(ctx,a,c=>gv_walker(c,id,w,o.y||FW_WK.y,o.s||FW_WK.s,{t,pose:w.moving?null:"stand",flip:x1<x0}));}
// the doors' plates, and the two clinics' deaths over them
const FW_PL={first:[875,290],second:[1415,290],autopsy:[295,322],rate:190};
// Vienna, as the film comes back to it: the mother going home, her baby asleep in her arms, out of the first clinic's door and past
// the basin (from t0); a doctor washing at the basin, then going in at that door with his hands clean (from t0, in at tIn); and the two
// clinics' doors with their deaths over them, the numbers glowing (at tg)
function fw_goingHome(x,tt,t0){fw_doorOpen(x,1,gv_io(tt,t0+0.2,t0+2.2,0.4),[236,224,196]);fw_basin(x,FW_CR.basin,880,1.0,1);
  fw_plate(x,tt,-9,null,...FW_PL.first,["first clinic","doctors and students"]);fw_plate(x,tt,-9,null,...FW_PL.second,["second clinic","midwives"]);
  const w=gv_walk(tt,t0+0.5,875,1250,150),a=fin(tt,t0+0.35,0.4);
  if(a>0.01)fw_ghost(x,a,q=>gv_walker(q,"mother2",w,FW_WK.y,FW_WK.s,{t:tt,pose:"hold",carry:fw_baby,carryBehind:true,expr:"smile"}));}
function fw_washIn(x,tt,t0,tIn){fw_doorOpen(x,1,gv_io(tt,tIn,tIn+1.9,0.4),[236,224,196]);fw_plate(x,tt,-9,null,...FW_PL.first,["first clinic","doctors and students"]);
  const w=gv_walk(tt,tIn+0.2,640,870,180),a=1-fin(tt,w.end-0.25,0.4);
  if(a>0.01)fw_ghost(x,a,q=>gv_walker(q,"doctor1",w,850,FW_WK.s,Object.assign({t:tt},
    w.moving?{}:{pose:"stand",pose2:"fw_wash",mix:fin(tt,t0+0.3,0.5)*(1-fin(tt,tIn-0.5,0.5))})));
  fw_basin(x,FW_CR.basin,880,1.0,1);}
function fw_twoRates(x,tt,tg){fw_plate(x,tt,-9,null,...FW_PL.first,["first clinic","doctors and students"]);fw_plate(x,tt,-9,null,...FW_PL.second,["second clinic","midwives"]);
  const g=0.8*fin(tt,tg,0.6);for(const px of [FW_PL.first[0],FW_PL.second[0]])gv_halo(x,px-210,FW_PL.rate-46,420,92,GV.gold,g);
  fw_tagAt(x,tt,-9,null,FW_PL.first[0],FW_PL.rate,"about 1 mother in 10");fw_tagAt(x,tt,-9,null,FW_PL.second[0],FW_PL.rate,"about 1 in 30");}

scene("clinics",(ctx,S,t,sc)=>{const c=sc.cues,P=fw_once(sc,"P",()=>({cr:c.first-0.7,firstC:wAt(sc,"first","doctors")-0.3,firstR:wAt(sc,"first","one mother")-0.1,
    secondC:wAt(sc,"second","midwives")-0.3,secondR:wAt(sc,"second","one in thirty")-0.1,bg:c.beg,begW:wAt(sc,"beg","beg"),why:c.why,
    walk:c.looks-3.1,ign:wAt(sc,"looks","Ignaz"),lookL:wAt(sc,"looks","looks")-0.1,
    lookR:wAt(sc,"looks","different"),come:wAt(sc,"autopsy","come"),aut:wAt(sc,"autopsy","autopsy"),mid:wAt(sc,"autopsy","midwives"),
    basin:c.wash-0.4,lime:wAt(sc,"wash","chlorinated"),hands:wAt(sc,"wash","before")-0.2,reg:c.fall-0.5,level:wAt(sc,"fall","the level"),home:c.home-0.4,
    ward:c.showed-0.5,shows:wAt(sc,"showed","showed"),started:wAt(sc,"showed","It started"),hd:wAt(sc,"showed","hands"),lesson:c.lesson-0.2,
    dip:c.lesson+2.9,title:c.breath+0.7}));
  gv_shots(ctx,S,t,sc.dur,[
    // the general hospital's courtyard: a long building round a courtyard of lime trees
    {at:0,place:"court",keys:[[0,960,540,1],[0.2,960,520,1.06]],d:5.5,push:0.01},
    // the maternity corridor: the two clinics' doors, each named as the voice names it, and its deaths over it; a woman in labour,
    // brought to the first clinic on its day, begs the porter not to send her in, and goes in; Semmelweis walks in and looks from one
    // door to the other; doctors and a student come out of the autopsy room and go straight in at the first clinic, and a midwife comes
    // from the far end to the second
    {at:P.cr,place:"corridor",keys:[[P.cr,960,540,1],[P.bg-0.9,900,560,1.2],[P.why+1.0,960,540,1],[P.ign-0.6,1030,560,1.08],[P.come-0.9,960,540,1]],d:1.8,push:0.015,
      draw:(x,tt)=>{const D=FW_CR;
      fw_doorOpen(x,0,gv_io(tt,P.come-0.9,P.come+1.6,0.4),[40,34,32]);
      fw_doorOpen(x,1,Math.max(gv_io(tt,P.why+0.1,P.why+2.6,0.4),gv_io(tt,P.come+1.5,P.come+3.7,0.4)),[236,224,196]);
      fw_doorOpen(x,2,gv_io(tt,P.mid+0.5,P.mid+2.1,0.4),[236,224,196]);
      fw_plate(x,tt,P.firstC,null,...FW_PL.first,["first clinic","doctors and students"]);fw_plate(x,tt,P.secondC,null,...FW_PL.second,["second clinic","midwives"]);
      fw_tagAt(x,tt,P.firstR,null,FW_PL.first[0],FW_PL.rate,"about 1 mother in 10");fw_tagAt(x,tt,P.secondR,null,FW_PL.second[0],FW_PL.rate,"about 1 in 30");
      fw_tagAt(x,tt,P.aut-0.1,null,...FW_PL.autopsy,"autopsy room",{size:28});
      // the woman comes from the far end and the porter from the near one, to the first clinic's door; she clasps her hands and begs
      // him, and he points to the door; it opens, he goes in with his book, and she follows him, slowly
      const inP=tt>=P.why+0.3,wp=inP?gv_walk(tt,P.why+0.3,690,860,200):gv_walk(tt,P.bg-1.0,420,690,300),
        ap=fin(tt,P.bg-1.15,0.35)*(inP?1-fin(tt,wp.end-0.25,0.4):1);
      if(ap>0.01)fw_ghost(x,ap,q=>gv_walker(q,"porter",wp,FW_WK.y,FW_WK.s,Object.assign({t:tt,carry:fw_ledger},
        wp.moving?{}:{pose:"stand",pose2:"point",mix:inP?0:gv_io(tt,P.begW+0.5,P.why-0.3,0.4),flip:false})));
      const inW=tt>=P.why+1.0,wm=inW?gv_walk(tt,P.why+1.0,1080,875,160):gv_walk(tt,P.bg-1.0,1700,1080,280),
        am=fin(tt,P.bg-1.15,0.35)*(inW?1-fin(tt,wm.end-0.25,0.4):1);
      if(am>0.01)fw_ghost(x,am,q=>gv_walker(q,"mother",wm,FW_WK.y,FW_WK.s,Object.assign({t:tt,expr:"worried"},
        wm.moving?{}:{pose:"stand",pose2:"fw_beg",mix:inW?0:gv_io(tt,P.begW-0.3,P.why+0.2,0.5),flip:true})));
      // Semmelweis: walks in, looks at the first clinic's door, then the second's, then watches the doctors come
      const w=gv_walk(tt,P.walk,-80,1150,300),look=tt<P.lookR?1:tt<P.come-0.5?0:1;
      gv_walker(x,"semmelweis",w,FW_WK.y,FW_WK.s,{t:tt,pose:w.moving?null:"listen",flip:w.moving?false:look===1&&tt>=P.lookL});
      fw_plate(x,tt,P.ign,P.come+0.4,1370,500,["Ignaz Semmelweis","first clinic"]);
      fw_goes(x,"doctor1",tt,P.come-0.4,FW_PL.autopsy[0],FW_PL.first[0]);fw_goes(x,"student",tt,P.come+0.15,FW_PL.autopsy[0],FW_PL.first[0]-20);
      fw_goes(x,"doctor2",tt,P.come+0.7,FW_PL.autopsy[0],FW_PL.first[0]+10);fw_goes(x,"midwife",tt,P.mid-1.2,1990,FW_PL.second[0]);}},
    // the basin by the first clinic's door: Semmelweis has a doctor wash his hands in chlorinated lime before he goes in
    {at:P.basin,place:"corridor",keys:[[P.basin,700,600,1.5]],d:1.6,draw:(x,tt)=>{
      person(x,"doctor2",640,850,FW_WK.s,{pose:"stand",pose2:"fw_wash",mix:fin(tt,P.basin+0.4,0.6),t:tt});fw_basin(x,640,880,1.0,1);
      person(x,"semmelweis",430,FW_WK.y,FW_WK.s,{pose:"listen",pose2:"point",mix:fin(tt,P.basin+0.2,0.5),t:tt});
      fw_tagAt(x,tt,P.lime-0.1,null,900,650,"chlorinated lime");}},
    // his hands, close, dipping into the milky water
    {at:P.hands,place:"hands",keys:[[P.hands,960,540,1],[P.hands+0.1,960,560,1.05]],d:2.2,push:0.02,draw:(x,tt)=>
      fw_hands(x,tt,fin(tt,P.hands+0.1,1.0),fin(tt,P.hands+0.9,0.6),{sleeve:PEOPLE.doctor2.top.c,rub:fin(tt,P.hands+1.3,0.4)})},
    // the register: the first clinic's months of 1847, written in one by one, the washing between April and June; the second
    // clinic's level, dashed
    {at:P.reg,place:"register",keys:[[P.reg,960,560,1],[P.reg+0.1,940,580,1.04]],d:3,push:0.01,draw:(x,tt)=>
      fw_register(x,k=>clamp((tt-P.reg-0.3-[0,0.7,1.4,2.0,2.6][k])/0.9,0,1),clamp((tt-P.level+0.2)/1.0,0,1),fin(tt,P.reg+0.1,0.8))},
    // the corridor again, the basin by the first clinic's door: the door opens, and a mother comes out with her baby in her arms and
    // walks slowly towards the far end
    {at:P.home,place:"corridor",keys:[[P.home,1060,600,1.15],[P.home+0.1,1080,600,1.18]],d:3,push:0.01,draw:(x,tt)=>fw_goingHome(x,tt,P.home)},
    // the first clinic's ward: the fever showed in the beds; the camera goes to the door from the corridor, where a doctor comes in
    // and washes: it started there; then both, wide, for the lesson
    {at:P.ward,place:"ward",keys:[[P.ward,960,540,1],[P.started-0.3,1280,560,1.5],[P.lesson,960,540,1]],d:1.6,push:0,draw:(x,tt)=>{const D=FW_WD,
        w=gv_walk(tt,P.started-0.2,1735,1560,200),a=fin(tt,P.started-0.35,0.35);
      if(a>0.01)fw_ghost(x,a,q=>gv_walker(q,"doctor2",w,D.fy+10,FW_WK.s,{t:tt,pose:w.moving?null:"stand",pose2:w.moving?null:"fw_wash",mix:fin(tt,w.end,0.5),flip:true}));
      fw_basin(x,D.basin[0],D.basin[1],0.9,1);
      fw_where(x,tt,P.shows,P.started-0.3,"where it shows",730,470,[140,480,1300,420]);fw_where(x,tt,P.lesson+0.6,null,"where it shows",730,470,[140,480,1300,420]);
      fw_where(x,tt,P.hd-0.1,null,"where it starts",1600,270,[1440,300,420,500]);}},
    // wordless: the hands at the basin again, dipping, and the water settling; then the title
    {at:P.dip,place:"hands",keys:[[P.dip,960,540,1],[P.dip+0.1,960,550,1.04]],d:2.4,push:0.01,draw:(x,tt)=>
      fw_hands(x,tt,fin(tt,P.dip+0.1,0.9),fin(tt,P.dip+1.0,0.8),{sleeve:PEOPLE.doctor2.top.c})}]);
  fw_pill(ctx,t,[[0,"Vienna · 1847"]],fin(t,0.6,0.5)*(1-fin(t,P.title,0.4)));
  gv_title(ctx,S,t,P.title,"Fixed where it starts","where a problem begins","Film 6 of 10 · data governance");
  wc_paperOver(ctx,S);});

// ---- 2 · Still amber: binder 15, the scorecard's amber cell, the issue log's old answer, the clean-up's card, and the mop under the leak ----
// the data team's room, with the leak: Yusuf and Jun where they stand, the pipe, the buckets and their drips, the mop (o.mop: leaning,
// 0 to 1; o.held: Jun mopping, from 0 to 1, in place of leaning)
const FW_DR={yusuf:1000,jun:1760,mopper:1640};
function fw_dataRoom(x,tt,o){fw_leak(x,tt,{buckets:o.buckets,fixed:o.fixed,mop:o.held?0:o.mop,sensor:o.sensor});
  if(o.yusuf!==false)person(x,"yusuf",FW_DR.yusuf,905,0.8,Object.assign({pose:"listen",t:tt},o.yusuf||{}));
  if(o.held)person(x,"jun",FW_DR.mopper,905,0.8,{pose:"hold",t:tt,flip:true,carry:fw_heldMop(Math.sin(tt*2.6)),expr:"concerned"});
  else if(o.jun!==false)person(x,"jun",FW_DR.jun,905,0.8,Object.assign({pose:"listen",t:tt,flip:true},o.jun||{}));}

scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,P=fw_once(sc,"P",()=>({take:c.binder+0.2,page:wAt(sc,"binder","the root")-0.5,
    sc:c.amber-0.5,cell:wAt(sc,"amber","one cell"),row:c.what-0.3,owner:wAt(sc,"issue","owner"),
    log:wAt(sc,"issue","The first")-0.5,cleaned:wAt(sc,"issue","cleaned")-0.15,room:c.jun-0.5,card:c.jun+1.2,trim:wAt(sc,"jun","trimmed"),
    low:wAt(sc,"jun","lower case"),wal:c.wallet-0.4,two:wAt(sc,"wallet","two wallets"),wide:c.others-0.4,fin:wAt(sc,"others","every system"),
    mail:wAt(sc,"others","cleans"),mop:c.mop-0.4,mopT:wAt(sc,"mop","mop"),leak:wAt(sc,"mop","a leak")}));
  gv_shots(ctx,S,t,sc.dur,[
    // Yusuf's office: binders 2, 12, 6 and 9 are out with the earlier films; he slides binder 15 out and takes it down
    {at:0,place:"office",keys:[[0,1180,540,1.22],[P.take+0.3,1260,560,1.34]],d:2,draw:(x,tt)=>{const got=tt>=P.take+0.1;
      fw_officeScreen(x);gv_deskBook(x);fw_binders(x,got,fin(tt,P.take-0.4,0.4));
      person(x,"yusuf",1610,905,0.8,got?{pose:"reach",pose2:"hold",mix:fin(tt,P.take+0.1,0.5),t:tt,carry:fw_heldBinder}:{pose:"listen",pose2:"reach",mix:fin(tt,P.take-0.8,0.5),t:tt});}},
    // binder 15's page, close: its policy, and its line
    {at:P.page,place:"policy",keys:[[P.page,960,500,1],[P.page+0.1,900,450,1.08]],d:4,push:0.01,draw:x=>fw_policy15(x,0,0)},
    // his screen: the scorecard in turns, the whole page (its words too small to read, the washes carrying it), one cell amber; then
    // the learning row, lit, and under it the warnings, and whose they are
    {at:P.sc,place:"screenGov",keys:[[P.sc,...FW_SKV.all],[P.row,...FW_SKV.row]],d:1.4,push:0,draw:(x,tt,cam)=>{
      const L=fw_scorecard(x,cam,{sections:FW_SKW,hi:4,hiA:fin(tt,P.row+0.4,0.5)}),r=L.rows[4],w=L.sec[0];
      gv_halo(x,L.cx[3]-26,r.top-26,L.cw[3]+52,r.h+52,FW.amber,0.9*gv_io(tt,P.cell,P.row+0.6,0.4));
      gv_tint(x,w.cols[1]-10,w.rows[0]-FW_SK.rh*0.74,tw(x,"Learning team",FW_SK.sz,600)+20,2*FW_SK.rh,GV.gold,0.7*fin(tt,P.owner,0.4));}},
    // Tom's desk, the learning team's: the issue log, the night's failure closed for good, and the line for the emails lit, then
    // closed with the old answer
    {at:P.log,place:"tomTop",keys:[[P.log,960,550,1],[P.log+0.1,960,530,1.04]],d:3,push:0.01,draw:(x,tt)=>
      fw_issueLog(x,fin(tt,P.log+0.3,0.5),fin(tt,P.cleaned,0.3))},
    // the data team's room: Jun shows Yusuf where the emails are cleaned; along the ceiling, a pipe; under it, a bucket and a mop
    {at:P.room,place:"data",keys:[[P.room,1300,560,1.2],[P.room+0.1,1320,560,1.24]],d:2,draw:(x,tt)=>
      fw_dataRoom(x,tt,{buckets:[1,0,0],mop:1,jun:{pose:"explain"}})},
    // the data team's board: the clean-up's card, an email as typed and after; "trimmed" and "lower case" light as they're said, and
    // what each takes away is ringed
    {at:P.card,place:"boardData",keys:[[P.card,960,500,1],[P.card+0.1,960,490,1.04]],d:3,push:0.01,draw:(x,tt)=>
      fw_cleanCard(x,{trim:fin(tt,P.trim-0.1,0.5),low:fin(tt,P.low-0.1,0.5)})},
    // the wallet, close: without it, two wallets for one learner
    {at:P.wal,place:"screenData",keys:[[P.wal,960,420,1],[P.wal+0.1,960,430,1.03]],d:3,push:0.01,draw:(x,tt)=>fw_wallets(x,tt-P.wal-0.2,fin(tt,P.two,0.5))},
    // the room, wide: the pipe runs the width of the wall; two more buckets catch its drips, everyone else who cleans them again
    {at:P.wide,place:"data",keys:[[P.wide,960,540,1]],d:2,push:0.012,draw:(x,tt)=>{const b2=fin(tt,P.fin,0.5),b3=fin(tt,P.mail-0.4,0.5);
      fw_dataRoom(x,tt,{buckets:[1,b2,b3],mop:1});
      fw_tagAt(x,tt,P.fin+0.2,null,FW_LK.joints[1]-150,830,"finance");fw_tagAt(x,tt,P.mail-0.2,null,FW_LK.joints[2]-150,830,"mailing list");}},
    // the first bucket, close: the drip falls, Jun mops round it, and the drip keeps falling
    {at:P.mop,place:"data",keys:[[P.mop,1280,700,1.5]],d:2,push:0.015,draw:(x,tt)=>{fw_dataRoom(x,tt,{buckets:[1,1,1],held:1});
      fw_tagAt(x,tt,P.mopT,null,1480,800,"the clean-up");fw_tagAt(x,tt,P.leak,null,FW_LK.joints[0]-150,830,"data team");}}]);
  wc_year(ctx,56,72,"Today",fin(t,0.3,0.5)*(1-fin(t,P.page,0.4)));
  wc_paperOver(ctx,S);});

// ---- 3 · Follow it back: from the wallet, through the data team's clean-up, to the sign-up form, and the phone that types the email ----
// the learning team's desk: the wall, Tom behind his desk, the desk and its screen, what the screen shows, the poster's heading
function fw_tomDesk(x,tt,o,screen){gv_behind(x,"tom",FW_TX.seat[0],FW_TX.top,FW_TX.seat[1],Object.assign({pose:"listen",t:tt,flip:true},o||{}));
  x.drawImage(gv_place("tomDesk"),0,0,W,H);if(screen)screen(x);fw_tomPoster(x);}
// the thumb over the keys: it reaches each key as it presses it (presses: [[time, key], ...], in order), lifting a little between
// them, and goes back to rest after the last; where its tip is, and how far it's pressed
const FW_REST=[1210,890];
function fw_typing(tt,presses,pos,rest){rest=rest||FW_REST;let from=rest,to=pos[presses[0][1]],t0=presses[0][0]-0.7,t1=presses[0][0];
  presses.forEach(([tp,k],i)=>{if(tt>=tp){from=pos[k];t0=tp+0.1;const n=presses[i+1];to=n?pos[n[1]]:rest;t1=n?n[0]:tp+0.9;}});
  const u=easeCam(clamp((tt-t0)/Math.max(0.15,t1-t0),0,1)),lift=Math.sin(Math.PI*u)*24;let down=0;
  for(const [tp,,hold] of presses){const d=tt-tp;if(hold){if(d>-0.02&&d<hold)down=1;}else if(d>-0.02&&d<0.16)down=Math.max(down,1-Math.abs(d-0.06)/0.1);}
  return{x:lerp(from[0],to[0],u)+lift*0.4,y:lerp(from[1],to[1],u)+lift*0.5,down:clamp(down,0,1)};}
// the key being pressed, for the keyboard to light; and what's typed, the latest of steps ([[time, text], ...])
const fw_pressed=(tt,presses)=>{let k=null;for(const [tp,kk,hold] of presses)if(tt>=tp-0.02&&tt<tp+(hold||0.16))k=kk;return k;};
const fw_val=(tt,steps)=>{let v="";for(const [ts,s] of steps)if(tt>=ts)v=s;return v;};
// the phone in a learner's hand: the screen (o, as fw_phone takes it), then the thumb typing (presses)
function fw_typer(x,tt,o,presses){const pos=fw_phone(x,Object.assign({press:presses?fw_pressed(tt,presses):null,t:tt},o));
  const th=presses?fw_typing(tt,presses,pos):{x:FW_REST[0],y:FW_REST[1],down:0};fw_thumb(x,th.x,th.y,th.down);}
const FW_PHV=[960,500,1.2],FW_EM="DanielKim.Work@mail.example";

scene("back",(ctx,S,t,sc)=>{const c=sc.cues,P=fw_once(sc,"P",()=>({point:wAt(sc,"follow","back"),tr:c.path-0.5,wallet:wAt(sc,"path","wallet"),
    clean:wAt(sc,"path","clean-up"),short:wAt(sc,"path","short-course"),form:wAt(sc,"path","sign-up"),tom:c.box-0.6,plain:wAt(sc,"box","plain text"),
    ph:wAt(sc,"box","phones")-0.4,cap:wAt(sc,"box","capital"),sug:wAt(sc,"space","picking"),spc:wAt(sc,"space","a space"),lr:c.third-0.4,
    three:wAt(sc,"third","one email"),bk:c.starts-0.4,shows:wAt(sc,"starts","shows"),ph2:wAt(sc,"starts","but it")-0.2,here:wAt(sc,"starts","starts here")}));
  const lit=[P.wallet,P.clean,P.short,P.form],d0=P.ph+0.9,
    presses=[[d0,"d"],[P.cap+0.45,"a"],[P.cap+0.85,"n"],[P.sug+0.35,"sug"]],
    typed=[[d0+0.05,"D"],[P.cap+0.5,"Da"],[P.cap+0.9,"Dan"],[P.sug+0.4,FW_EM+" "]];
  gv_shots(ctx,S,t,sc.dur,[
    // the data team's room: Yusuf turns to the team's board and points; they follow one email back
    {at:0,place:"data",keys:[[0,960,540,1],[0.2,940,540,1.04]],d:2,draw:(x,tt)=>
      fw_dataRoom(x,tt,{buckets:[1,1,1],mop:1,yusuf:{pose:"listen",pose2:"point",mix:fin(tt,P.point-0.3,0.5),flip:true}})},
    // the board, close: a card for each place the email passes, pinned right to left as they're named, from the wallet back to the
    // sign-up form, a thread from pin to pin
    {at:P.tr,place:"boardData",keys:[[P.tr,960,482,1.2],[P.tr+0.1,960,478,1.23]],d:3,push:0.01,draw:(x,tt)=>fw_trail(x,k=>fin(tt,lit[k]-0.1,0.4))},
    // the learning team's office: Tom at his desk, the sign-up form on his screen; its email box, a tag says, is a plain text box
    {at:P.tom,place:"tom",keys:[[P.tom,960,540,1],[P.plain-0.6,860,500,1.1]],d:1.8,push:0,draw:(x,tt)=>{
      fw_tomDesk(x,tt,{},q=>fw_tomScreen(q,"form",{lit:fin(tt,P.tom+0.6,0.5),tag:fin(tt,P.plain-0.1,0.5)}));
      fw_plate(x,tt,P.tom+0.3,P.plain-0.6,1690,470,["Tom Whitfield","learning team"]);}},
    // a learner's phone: the phone starts the email with a capital; picking a suggestion leaves a space at the end
    {at:P.ph,place:"phone",keys:[[P.ph,...FW_PHV]],d:1.6,push:0.01,draw:(x,tt)=>fw_typer(x,tt,{val:fw_val(tt,typed),shift:tt<d0+0.05?1:0,
      ring:fin(tt,P.cap-0.1,0.5),sug:fin(tt,P.cap+1.0,0.3)*(1-fin(tt,P.sug+0.4,0.3)),sugVal:FW_EM,spc:fin(tt,P.spc-0.1,0.5),caret:true},presses)},
    // Tom's screen: the learners as the form saved them; three of eight as typed
    {at:P.lr,place:"screenLearn",keys:[[P.lr,960,400,1],[P.lr+0.1,960,410,1.03]],d:3,push:0.01,draw:(x,tt)=>fw_learners(x,fin(tt,P.lr+0.3,0.5),0,fin(tt,P.three,0.4))},
    // the bucket in the data team's room: where it shows
    {at:P.bk,place:"data",keys:[[P.bk,1280,700,1.5]],d:2,push:0.015,draw:(x,tt)=>{fw_dataRoom(x,tt,{buckets:[1,1,1],held:1,yusuf:false});
      fw_where(x,tt,P.shows-0.1,null,"where it shows",1150,760,[1250,700,210,230]);}},
    // the phone again: where it starts
    {at:P.ph2,place:"phone",keys:[[P.ph2,...FW_PHV]],d:1.6,push:0.01,draw:(x,tt)=>{fw_typer(x,tt,{val:FW_EM+" ",ring:1,spc:1,caret:true});
      fw_where(x,tt,P.here-0.1,null,"where it starts",470,365,[736,316,448,94]);}}]);
  wc_paperOver(ctx,S);});

// ---- 4 · Fixed where it's typed: the issue with an owner, a cause, a date and a check; the email box, like the basin in Vienna; the old
// emails; the clean-up goes, no system cleans them again, and each learner keeps one wallet ----
scene("entry",(ctx,S,t,sc)=>{const c=sc.cues,P=fw_once(sc,"P",()=>({own:wAt(sc,"time","an owner"),cause:wAt(sc,"time","a cause"),date:wAt(sc,"time","a date"),
    chk:wAt(sc,"time","a check"),tom:c.email-0.5,box:wAt(sc,"email","an email box"),ph:wAt(sc,"email","so phones")-0.4,stop:wAt(sc,"email","stop"),
    sug:c.trims-0.3,trim:wAt(sc,"trims","trims"),low:wAt(sc,"trims","lower case"),shape:wAt(sc,"trims","checks"),saved:wAt(sc,"trims","saved"),
    gr:c.work-0.4,does:wAt(sc,"work","The form"),vb:c.basin-0.3,vw:wAt(sc,"basin","the form")-0.3,vin:wAt(sc,"basin","stops"),lr:c.before-0.4,fix:wAt(sc,"before","corrects"),
    cu:wAt(sc,"before","Then the")-0.3,go:wAt(sc,"before","can go"),room:c.relief-3.6,one:wAt(sc,"relief","and every")-0.2}));
  const d0=P.ph+0.8,presses=[[d0,"d"],[P.stop+0.5,"a"],[P.stop+0.88,"n"],[P.sug,"sug"],[P.saved+0.3,"btn"]],
    typed=[[d0+0.05,"d"],[P.stop+0.55,"da"],[P.stop+0.93,"dan"],[P.sug+0.05,FW_EM+" "]],
    gPress=[[P.gr+0.7,"box",0.5],[P.gr+1.5,"paste"]],gEm=" Grace.Okafor@Mail.example";
  // what the box holds as the form does its work: the space trimmed, then lower case
  const box=tt=>tt<P.trim?{val:fw_val(tt,typed)}:tt<P.low?{prev:FW_EM+" ",val:FW_EM,mixv:fin(tt,P.trim,0.5)}:{prev:FW_EM,val:FW_EM.toLowerCase(),mixv:fin(tt,P.low,0.5)};
  gv_shots(ctx,S,t,sc.dur,[
    // Yusuf's board: this time, an issue with an owner, a cause, a date, and the check that closes it
    {at:0,place:"boardGov",keys:[[0,960,500,1],[0.1,960,490,1.04]],d:4,push:0.01,draw:(x,tt)=>
      fw_issueGold(x,fin(tt,0.4,0.6),i=>fin(tt,[P.own,P.cause,P.date,P.chk][i]-0.1,0.5),0)},
    // Tom's desk: the form's email box becomes an email box, and its tag says so
    {at:P.tom,place:"tom",keys:[[P.tom,860,500,1.1]],d:1.8,push:0.01,draw:(x,tt)=>
      fw_tomDesk(x,tt,{pose:"listen",pose2:"point",mix:fin(tt,P.box-0.5,0.5)},q=>fw_tomScreen(q,"form",{tag:1,fix:fin(tt,P.box,0.6)}))},
    // the phone: no capital now; then the form trims the space, writes the email in lower case and checks its shape, before it's saved
    {at:P.ph,place:"phone",keys:[[P.ph,...FW_PHV]],d:1.6,push:0.01,draw:(x,tt)=>fw_typer(x,tt,Object.assign(box(tt),{email:true,
      ring:gv_io(tt,P.stop-0.15,P.sug,0.3),ringCol:GV.green,sug:fin(tt,P.stop+1.0,0.3)*(1-fin(tt,P.sug+0.05,0.3)),sugVal:FW_EM,ok:fin(tt,P.shape,0.5),
      caret:tt<P.saved-0.7,kb:1-fin(tt,P.saved-0.7,0.6),btn:gv_io(tt,P.saved+0.3,P.saved+0.55,0.12)}),presses)},
    // another learner pastes her email, a space in front and capitals in it; the form does the work
    {at:P.gr,place:"phone",keys:[[P.gr,...FW_PHV]],d:1.6,push:0.01,draw:(x,tt)=>{const pasted=tt>=P.gr+1.55;
      fw_typer(x,tt,{name:"Grace Okafor",email:true,val:pasted&&tt<P.does?gEm:"",prev:tt>=P.does?gEm:null,mixv:fin(tt,P.does,0.6),
        ...(tt>=P.does?{val:gEm.trim().toLowerCase()}:{}),paste:gv_io(tt,P.gr+1.1,P.gr+1.6,0.15),spc:gv_io(tt,P.gr+1.9,P.does,0.3),
        ok:fin(tt,P.does+0.6,0.5),caret:tt<P.does},gPress);}},
    // Vienna, a moment: a doctor's hands, close, dipping into the basin, as in 1847; then the corridor: he finishes at the basin by the
    // first clinic's door, and goes in. The form stops the problem on its way in, as the basin did
    {at:P.vb,place:"hands",keys:[[P.vb,960,540,1],[P.vb+0.1,960,560,1.05]],d:2.2,push:0.02,draw:(x,tt)=>
      fw_hands(x,tt,fin(tt,P.vb+0.1,0.8),fin(tt,P.vb+0.7,0.6),{sleeve:PEOPLE.doctor1.top.c,rub:fin(tt,P.vb+1.1,0.4)})},
    {at:P.vw,place:"corridor",keys:[[P.vw,760,600,1.3],[P.vw+0.1,780,600,1.33]],d:3,push:0.01,draw:(x,tt)=>fw_washIn(x,tt,P.vw-0.8,P.vin)},
    // Tom's screen: the team corrects the old emails, one by one
    {at:P.lr,place:"screenLearn",keys:[[P.lr,960,400,1],[P.lr+0.1,960,410,1.03]],d:3,push:0.01,draw:(x,tt)=>fw_learners(x,1,clamp((tt-P.fix)/1.8,0,1),0)},
    // the data team's board: the clean-up's card, stamped retired
    {at:P.cu,place:"boardData",keys:[[P.cu,960,500,1],[P.cu+0.1,960,490,1.03]],d:3,push:0.01,draw:(x,tt)=>fw_cleanCard(x,{trim:1,low:1,retired:fin(tt,P.go,0.4)})},
    // wordless: the data team's room; the joints clamped, the drips stop, the buckets and the mop are put away; then, said: no system
    // cleans them again
    {at:P.room,place:"data",keys:[[P.room,960,540,1]],d:2,push:0.012,draw:(x,tt)=>{const away=1-fin(tt,P.room+1.5,0.9);
      fw_dataRoom(x,tt,{buckets:[away,away,away],mop:away,fixed:fin(tt,P.room+0.5,0.7),yusuf:false,jun:{expr:"relieved"}});}},
    // the wallet: one for each learner now, its email as it should be, ticked
    {at:P.one,place:"screenData",keys:[[P.one,960,420,1],[P.one+0.1,960,430,1.03]],d:3,push:0.01,draw:(x,tt)=>fw_walletOne(x,tt-P.one-0.2)}]);
  fw_pill(ctx,t,[[P.vb,"Vienna · 1847"]],gv_io(t,P.vb+0.2,P.lr-0.3,0.4));
  wc_paperOver(ctx,S);});

// ---- 5 · Should never fail: the rule stays as a check; the cell turns green ----
scene("never",(ctx,S,t,sc)=>{const c=sc.cues,P=fw_once(sc,"P",()=>({chk:wAt(sc,"stays","a check"),owner:wAt(sc,"fails","its owner"),sc:c.green-0.5,
    turn:wAt(sc,"green","turns green"),bd:wAt(sc,"green","but because")-0.3,right:wAt(sc,"green","right where")}));
  const [jx]=FW_LK.joints;
  gv_shots(ctx,S,t,sc.dur,[
    // from the clamped joint down to where the bucket stood: a small leak sensor, its light green, and who it tells
    {at:0,place:"data",keys:[[0,1280,360,1.5],[0.5,1300,720,1.5]],d:2,push:0.012,draw:(x,tt)=>{fw_dataRoom(x,tt,{buckets:[0,0,0],fixed:1,sensor:1,yusuf:false,jun:false});
      fw_tagAt(x,tt,Math.max(P.chk-0.1,2.4),null,1250,770,"a check that should never fail");
      const p=clamp((tt-P.owner+0.3)/0.8,0,1);wc_link(x,jx+30,FW_BK.y-20,1590,712,GV.goldInk,{p,dash:[10,10],lw:3});fw_tagAt(x,tt,P.owner+0.3,null,1740,700,"tells: Learning team",{wash:GV.gold,washA:0.3});}},
    // the scorecard, a Monday after the fix: the learning row's validity cell turns green, and the row's and the page's with it; the
    // warnings go
    {at:P.sc,place:"screenGov",keys:[[P.sc,...FW_SKV.row]],d:1.4,push:0,draw:(x,tt,cam)=>
      fw_scorecard(x,cam,{after:FW_SKF,mx:fin(tt,P.turn,1.0),sections:FW_SKW,hi:4,hiA:fin(tt,P.sc+0.3,0.5)})},
    // Yusuf's board: the issue's card, closed because the check passes
    {at:P.bd,place:"boardGov",keys:[[P.bd,960,500,1],[P.bd+0.1,960,490,1.04]],d:3,push:0.01,draw:(x,tt)=>fw_issueGold(x,1,()=>1,fin(tt,P.right,0.4))}]);
  wc_paperOver(ctx,S);});

// ---- 6 · What no rule names: the badges with no credit, every check passing, and monitoring that knows the usual shape; as in Vienna,
// the numbers show something's wrong before anyone knows why ----
scene("unknown",(ctx,S,t,sc)=>{const c=sc.cues,P=fw_once(sc,"P",()=>({arr:c.night+1.2,z1:c.half-0.6,zero:wAt(sc,"half","zero credit"),pass:c.pass-0.3,
    tick:wAt(sc,"pass","passes"),num:wAt(sc,"pass","a number"),wal:c.wallet-0.3,morn:c.shape-0.8,arr2:wAt(sc,"shape","when it arrives"),
    rows:wAt(sc,"shape","how many rows"),empty:wAt(sc,"shape","how many empty"),spread:wAt(sc,"shape","spread"),last:wAt(sc,"usual","Last night"),
    owner:wAt(sc,"tells","the owner"),fly:wAt(sc,"tells","on record")-0.2,tom:wAt(sc,"tells","the learning")-0.3,vn:c.numbers-0.3,
    nb:wAt(sc,"numbers","the numbers")-0.1,back:c.tells-0.4}));
  // the platform team's desk at night, then in the morning: last night's badges, the checks, the wallet, then Sam's monitoring
  const plat=(x,tt,cam)=>{const far=cam.z<1.57?1:0,night=1-fin(tt,P.morn,1.2),
        k=[P.arr2,P.rows,P.empty,P.spread].reduce((n,w)=>n+fin(tt,w-0.1,0.4),0);
      if(night<0.99)fw_ghost(x,1-night,q=>gv_behind(q,"sam",GV_PX.seat[0],GV_PX.top,GV_PX.seat[1],{pose:"listen",t:tt,flip:true}));
      x.drawImage(gv_place("platformDesk"),0,0,W,H);fw_night(x,night);
      fw_badges(x,clamp((tt-P.arr)/0.5,0,8),fin(tt,P.zero-0.1,0.5),far||tt>P.pass+0.4?1:0);
      const chk=1-fin(tt,P.wal,0.4),wal=fin(tt,P.wal,0.4)*(1-fin(tt,P.morn+0.3,0.5)),mon=fin(tt,P.morn+0.3,0.5);
      if(chk>0.01)withA(x,chk*fin(tt,P.pass,0.4),()=>fw_checks(x,fin(tt,P.tick-0.1,0.4)+fin(tt,P.num-0.1,0.4)*0.6,far));
      if(wal>0.01)withA(x,wal,()=>fw_walletBadge(x,1,far));if(mon>0.01)withA(x,mon,()=>fw_monitor(x,k,fin(tt,P.last-0.1,0.8),far));
      fw_plate(x,tt,P.morn+0.9,P.owner-0.3,1570,296,["Sam Okafor","platform team"]);fw_ownerCard(x,fin(tt,P.owner,0.5));fw_flyAlert(x,clamp((tt-P.fly)/0.7,0,1));};
  gv_shots(ctx,S,t,sc.dur,[
    // the desk: in the morning the camera moves over to Sam, at his desk with his plate
    {at:0,place:"platform",keys:[[0,960,540,1],[P.z1,775,504,1.62],[P.pass,1050,504,1.62],[P.morn,1320,504,1.62]],d:1.6,push:0,draw:plat},
    // Vienna, a moment: the two clinics' doors and their deaths over them; the numbers showed something was wrong before anyone knew why
    {at:P.vn,place:"corridor",keys:[[P.vn,1063,520,1.12],[P.vn+0.1,1063,515,1.15]],d:3,push:0.01,draw:(x,tt)=>fw_twoRates(x,tt,P.nb)},
    // back at Sam's desk: the owner on record, and the notice on its way
    {at:P.back,place:"platform",keys:[[P.back,1320,504,1.62]],d:1.6,push:0,draw:plat},
    // Tom's desk: the alert lands with its owner
    {at:P.tom,place:"tom",keys:[[P.tom,860,500,1.1]],d:1.8,push:0.01,draw:(x,tt)=>
      fw_tomDesk(x,tt,{expr:"concerned"},q=>fw_tomScreen(q,"alert",{u:fin(tt,P.tom+0.3,0.5)}))}]);
  fw_pill(ctx,t,[[P.vn,"Vienna · 1847"]],gv_io(t,P.vn+0.2,P.back-0.3,0.4));
  wc_paperOver(ctx,S);});

// ---- 7 · A surprise becomes a rule: fixed where it started, then a check with an owner; prevent, check, watch ----
scene("rule",(ctx,S,t,sc)=>{const c=sc.cues,P=fw_once(sc,"P",()=>({fix:wAt(sc,"cause","fixes"),send:wAt(sc,"cause","sends"),rl:c.rule-0.4,
    mc:wAt(sc,"rule","a microcredential"),own:wAt(sc,"rule","with an owner"),bd:c.three-0.5,prev:wAt(sc,"three","Prevent"),chk:wAt(sc,"three","Check what"),
    watch:wAt(sc,"three","Watch"),conf:wAt(sc,"every","confirm"),nx:c.next-0.3,stp:wAt(sc,"next","stopped")}));
  gv_shots(ctx,S,t,sc.dur,[
    // Tom's screen: the microcredentials' credit set back, and the badges sent again
    {at:0,place:"screenLearn",keys:[[0,960,420,1],[0.1,960,430,1.03]],d:4,push:0.01,draw:(x,tt)=>
      fw_courses(x,k=>fin(tt,P.fix+0.35*k,0.4),fin(tt,P.send,0.3),clamp((tt-P.send-0.2)/1.2,0,1))},
    // Tom's desk: the rule, on a quality rule card, its lines coming in; on "with an owner", Tom signs it, and it's stamped; next time,
    // a badge with no credit comes in and stops at the rule, stamped, so it never reaches a wallet
    {at:P.rl,place:"tomTop",keys:[[P.rl,960,500,1],[P.rl+0.1,960,480,1.03]],d:3,push:0.01,draw:(x,tt)=>{
      fw_rule(x,fin(tt,P.mc-0.4,1.2),clamp((tt-P.own+0.1)/0.7,0,1),fin(tt,P.own+0.75,0.3));
      fw_stopped(x,fin(tt,P.nx,0.9),fin(tt,P.stp-0.05,0.3));}},
    // Yusuf's board: prevent, check, watch; the card that moves from watch to check
    {at:P.bd,place:"boardGov",keys:[[P.bd,960,500,1],[P.bd+0.1,960,490,1.03]],d:3,push:0.01,draw:(x,tt)=>{
      for(let k=0;k<3;k++)fw_three(x,k,fin(tt,[P.prev,P.chk,P.watch][k]-0.1,0.5),k===2?fin(tt,P.conf-0.2,1.4):0);}}]);
  wc_paperOver(ctx,S);});

// ---- 8 · Nobody to blame: evidence and help; Semmelweis, right, and the reasons his washing spread slowly; basic hygiene now, and the
// mother going home again; what data governance brings; policy 15 marked green ----
// the corridor of 1847: doctors waiting at the basin
function fw_queue(x,tt){person(x,"doctor1",330,FW_WK.y,FW_WK.s,{pose:"stand",t:tt});person(x,"student",470,FW_WK.y,FW_WK.s,{pose:"listen",t:tt});
  person(x,"doctor2",640,850,FW_WK.s,{pose:"fw_wash",t:tt});fw_basin(x,640,880,1.0,1);person(x,"semmelweis",900,FW_WK.y,FW_WK.s,{pose:"listen",t:tt,flip:true});}
// the stewards' meeting room: the evidence on the screen, the four at the table, then the table over them
function fw_meeting(x,tt,P){fw_evidence(x,1);gv_halo(x,GV_MT.screen[0]-20,GV_MT.screen[1]-20,GV_MT.screen[2]+40,GV_MT.screen[3]+40,GV.gold,0.7*gv_io(tt,P.ev,P.vi,0.5));
  const S_=GV_MT.seats,nod=0.05*Math.sin(tt*3.1)*gv_io(tt,P.nod+0.3,P.ev+1.2,0.4);
  gv_behind(x,"yusuf",S_[0],GV_MT.top,GV_MT.s,{pose:"listen",t:tt});gv_behind(x,"tom",S_[1],GV_MT.top,GV_MT.s,{pose:"listen",t:tt,nod,E:fw_face("concerned","relieved",fin(tt,P.help,0.6))});
  gv_behind(x,"jun",S_[3],GV_MT.top,GV_MT.s,{pose:"listen",pose2:"explain",mix:fin(tt,P.help-0.3,0.5),t:tt,flip:true});gv_behind(x,"sam",S_[4],GV_MT.top,GV_MT.s,{pose:"listen",t:tt,flip:true});
  x.drawImage(gv_place("meetingTable"),0,0,W,H);}

scene("blame",(ctx,S,t,sc)=>{const c=sc.cues,P=fw_once(sc,"P",()=>({nod:wAt(sc,"blamed","Nobody"),ev:wAt(sc,"blamed","the evidence"),help:wAt(sc,"blamed","help"),
    vi:c.vienna-0.5,hd:wAt(sc,"vienna","But the")-0.3,hurt:wAt(sc,"vienna","hurt"),rg:c.proof-0.4,nums:wAt(sc,"proof","numbers"),pt:wAt(sc,"proof","He waited")-0.3,
    pub:wAt(sc,"proof","publish"),lt:c.letters-0.5,angry:wAt(sc,"letters","angry"),af:c.after-0.4,nw:c.now-0.3,ph:c.lasts-0.4,easy:wAt(sc,"lasts","easy"),
    evid:wAt(sc,"lasts","and when")-0.3,sn:c.close-0.4,br:c.brings-0.4,less:wAt(sc,"brings","less"),trust:wAt(sc,"brings","data everyone"),
    hear:wAt(sc,"brings","an owner"),pg:c.breath-0.5,hi:c.breath+0.5,note:c.breath+2.0,end:c.breath+2.9}));
  gv_shots(ctx,S,t,sc.dur,[
    // the stewards' meeting: the evidence on the screen; nobody blames Tom's team; Jun offers help
    {at:0,place:"meeting",keys:[[0,960,500,1.06],[0.1,980,490,1.1]],d:4,push:0.01,draw:(x,tt)=>{fw_meeting(x,tt,P);
      fw_say(x,tt,P.help-0.1,P.vi+0.5,1010,490,["We'll help you try it out"],GV_MT.seats[3],572);}},
    // Vienna again: doctors wait their turn at the basin
    {at:P.vi,place:"corridor",keys:[[P.vi,620,620,1.35]],d:1.6,push:0.015,draw:(x,tt)=>fw_queue(x,tt)},
    // a doctor's hands, close: reddened, rubbed
    {at:P.hd,place:"hands",keys:[[P.hd,960,540,1],[P.hd+0.1,960,560,1.05]],d:3,push:0.01,draw:(x,tt)=>
      fw_hands(x,tt,fin(tt,P.hd+0.1,0.8),0.35,{skin:mix(FW_SKIN,FW_RAW,fin(tt,P.hd+0.6,1.4)),sleeve:PEOPLE.doctor1.top.c,rub:fin(tt,P.hd+0.8,0.5)})},
    // the register: his only proof, the numbers
    {at:P.rg,place:"register",keys:[[P.rg,960,560,1],[P.rg+0.1,960,540,1.05]],d:3,push:0.01,draw:(x,tt)=>{fw_register(x,()=>1,1,1);
      gv_halo(x,580,250,360,470,GV.gold,0.75*fin(tt,P.nums-0.2,0.6));}},
    // Pest, his desk: his first paper, in 1858, then his book, dated 1861
    {at:P.pt,place:"pestTop",keys:[[P.pt,960,540,1],[P.pt+0.1,980,560,1.04]],d:3,push:0.01,draw:(x,tt)=>{fw_pestPapers(x,fin(tt,P.pt+0.2,0.6),fin(tt,P.pub,0.6));
      fw_tagAt(x,tt,P.pt+0.5,null,560,130,"his first paper");fw_tagAt(x,tt,P.pub+0.3,null,1230,205,"his book");}},
    // Pest, 1862: he writes, fast; open letters fly from his desk
    {at:P.lt,place:"pest",keys:[[P.lt,960,540,1],[P.lt+0.1,940,530,1.04]],d:3,push:0.01,draw:(x,tt)=>{
      gv_behind(x,"semmelweis",FW_PS.seat[0],FW_PS.top,FW_PS.seat[1],{pose:"write",t:tt,expr:"worried",carry:heldNotebook});x.drawImage(gv_place("pestDesk"),0,0,W,H);
      for(let k=0;k<3;k++){const u=clamp((tt-P.angry+0.2-0.3*k)/0.8,0,1);if(u<=0)continue;const e=easeCam(u),lx=lerp(FW_PS.seat[0],420+70*k,e),ly=lerp(FW_PS.top-40,560-18*k,e)-220*Math.sin(Math.PI*e);
        fw_letter(x,lx,ly,lerp(0.2,-0.12+0.06*k,e),lerp(0.5,0.9,e));}
      fw_tagAt(x,tt,P.angry+1.1,null,560,330,"an open letter to all professors of obstetrics");}},
    // the basin alone in the corridor, the water still: washing became the rule after his death
    {at:P.af,place:"corridor",keys:[[P.af,640,640,1.6]],d:1.6,push:0.015,draw:x=>fw_basin(x,640,880,1.0,1)},
    // basic hygiene now: the first clinic's door opens, and the mother goes home with her baby, past the basin, as in 1847
    {at:P.nw,place:"corridor",keys:[[P.nw,1060,600,1.15],[P.nw+0.1,1080,600,1.18]],d:3,push:0.01,draw:(x,tt)=>fw_goingHome(x,tt,P.nw)},
    // today: the email box, checked where it's typed, easy to keep
    {at:P.ph,place:"phone",keys:[[P.ph,...FW_PHV]],d:1.6,push:0.01,draw:(x,tt)=>{fw_typer(x,tt,{val:FW_EM.toLowerCase(),email:true,ok:1,kb:0});
      gv_halo(x,1086,246,120,100,GV.green,0.8*fin(tt,P.easy-0.1,0.5));}},
    // the meeting room's screen: the evidence, not the blame
    {at:P.evid,place:"meeting",keys:[[P.evid,1204,322,1.8]],d:1.6,push:0.01,draw:(x,tt)=>fw_meeting(x,tt,P)},
    // the leak sensor, its light green
    {at:P.sn,place:"data",keys:[[P.sn,1356,810,2.0]],d:1.6,push:0.015,draw:(x,tt)=>fw_dataRoom(x,tt,{buckets:[0,0,0],fixed:1,sensor:1,yusuf:false,jun:false})},
    // Yusuf's board: prevent, check, watch, and under each, as it's named, what data governance brings
    {at:P.br,place:"boardGov",keys:[[P.br,960,520,1],[P.br+0.1,960,510,1.03]],d:3,push:0.01,draw:(x,tt)=>{
      for(let k=0;k<3;k++){fw_three(x,k,1,0);fw_brings(x,k,fin(tt,[P.less,P.trust,P.hear][k]-0.1,0.5));}}},
    // wordless: binder 15's line, marked green with Yusuf's highlighter, and his note beside it; then the end card
    {at:P.pg,place:"policy",keys:[[P.pg,960,500,1],[P.pg+0.1,900,450,1.06]],d:4,push:0.01,draw:(x,tt)=>fw_policy15(x,clamp((tt-P.hi)/1.4,0,1),clamp((tt-P.note)/1.2,0,1))}]);
  fw_pill(ctx,t,[[P.vi,"Vienna · 1847"],[P.pt,"Pest · 1858"],[P.pub,"Pest · 1861"],[P.lt,"Pest · 1862"]],fin(t,P.vi+0.2,0.4)*(1-fin(t,P.af-0.2,0.4)));
  wc_year(ctx,56,72,"Today",fin(t,P.ph+0.2,0.4)*(1-fin(t,P.end,0.6)));
  gv_end(ctx,S,t,P.end,"Fixed where it starts","Fix the cause, then make the fix a check.","Film 6 of 10");
  wc_paperOver(ctx,S);});
