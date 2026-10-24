/* ===== The same problem, everywhere: the eight chapters =====
   Each chapter is a few shots in the places of plan.js and the series' rooms.js, cut together with short dissolves (gv_shots). Times
   inside a chapter come from its cues (when each line starts) and the words of its lines (wAt), so the pictures stay with the voice if
   it's recorded again. Words on screen are on paper, boards, flyers, books, notes and speech bubbles, at least 28 px as seen, and above
   the captions. */

// made once per chapter, the first time it draws: its cues are known by then
const sp_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// a tag that springs in at t0 and goes at t1 (or stays)
function sp_tagAt(ctx,t,t0,t1,x,y,s,o){const a=t1==null?fin(t,t0,0.35):gv_io(t,t0,t1,0.35);if(a<=0.01)return;const k=0.9+0.1*spring(fin(t,t0,0.5));
  ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,a,()=>wc_tag(ctx,0,0,s,Object.assign({align:"center"},o||{})));ctx.restore();}

// ---- 1 · One question: a bank's board asks how much it stands to lose, and nobody can add it up ----
// where a person's hand is on the screen, in a pose (or between two): for things that pass from hand to hand
function sp_handAt(id,x,y,s,pose,pose2,mix,flip,side){const P_=PEOPLE[id],po=blendPose(POSE[pose],POSE[pose2],mix),k=s*P_.build.h,h=handAt(P_,side,side<0?po.L:po.R,0);
  return[x+(flip?-1:1)*h[0]*k,y+h[1]*k];}
// the board's card, seen from behind as it's handed over: its middle at x, y, turned rot; the thumbs of whoever holds it (hold, a list
// of [x, y, skin])
function sp_cardFree(ctx,x,y,rot,s,hold){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(s,s);ctx.fillStyle="rgba(60,50,40,0.22)";rr(ctx,-62,-36,130,80,6);ctx.fill();
  ctx.fillStyle="#f4f1ea";rr(ctx,-66,-40,130,80,6);ctx.fill();ctx.strokeStyle="rgba(58,54,66,0.7)";ctx.lineWidth=2;ctx.stroke();ctx.restore();
  for(const [hx,hy,skin] of hold){ctx.save();ctx.translate(hx,hy);ctx.scale(s,s);ell(ctx,0,0,12,15);litFill(ctx,skin,-12,-15,12,15);seam(ctx,skin,0.3,1.2);ctx.restore();}}
// the card in both hands, read at the chest, its back to us (in the figure's units)
function sp_cardBack(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my+14);cx.rotate(-0.02);
  cx.fillStyle="rgba(60,50,40,0.22)";rr(cx,-92,-46,190,100,6);cx.fill();cx.fillStyle="#f4f1ea";rr(cx,-96,-52,190,100,6);cx.fill();cx.strokeStyle="rgba(58,54,66,0.7)";cx.lineWidth=2;cx.stroke();cx.restore();
  fingers(cx,P_,[[mx-90,my+10],[mx+90,my+6]]);}
// the whiteboard, in marker: what each business line stands to lose, the total a red question mark; beside it, the customer's code in
// each line's system. o.q: the total's question mark (0 to 1); o.full: the last figure, written in; o.doubt: when a second figure for
// markets, from another system, is added
const SP_SUMS=[["treasury","155"],["markets","412"],["lending","268"],["abroad","?"]],SP_CODES=["client 0042","= CPTY-A17 ?","= acct 9-310 ?","= K-77/2 ?"];
function sp_board(ctx,t,o){const [bx,by]=SP_WB.board,blue=[44,78,160],red=GV.redInk;
  wc_hand(ctx,"exposure, in millions",bx+90,by+104,{size:50,col:blue,w:700});
  SP_SUMS.forEach(([k,v],i)=>{const y=by+196+i*84;wc_hand(ctx,k,bx+110,y,{size:44,col:blue});
    if(i===3){const f=o.full||0;if(f<1)wc_hand(ctx,"?",bx+540,y,{size:46,col:red,w:800,a:1-clamp(f*3,0,1)});if(f>0)wc_hand(ctx,"97",bx+560,y,{size:44,col:blue,align:"right",p:f});}
    else wc_hand(ctx,v,bx+560,y,{size:44,col:blue,align:"right"});});
  if(o.doubt){const d=clamp((t-o.doubt)/0.9,0,1);if(d>0)wc_hand(ctx,"or 398?",bx+604,by+280,{size:44,col:red,p:d});}
  ctx.save();ctx.strokeStyle=rgba(blue,0.85);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(bx+100,by+540);ctx.lineTo(bx+580,by+544);ctx.stroke();ctx.restore();
  wc_hand(ctx,"total",bx+110,by+626,{size:48,col:blue,w:800});const q=o.q==null?1:o.q;if(q>0){wc_hand(ctx,"?",bx+472,by+646,{size:110,col:red,w:800,p:q});
    wc_ring(ctx,bx+488,by+608,80,80,clamp((q-0.4)/0.6,0,1),{col:red,lw:4,seed:5});}
  wc_hand(ctx,"same client?",bx+800,by+104,{size:50,col:blue,w:700});SP_CODES.forEach((s,i)=>wc_hand(ctx,s,bx+820,by+196+i*84,{size:42,col:blue}));}
// the codes on the printouts, ringed in pencil one by one and joined, each join with a question mark (u, 0 to 1); where each code sits
const SP_SPREAD=[[130,330,-0.04],[560,340,0.03],[990,326,-0.02],[1420,336,0.05]];
function sp_codeSpot(i){const [px,py,r]=SP_SPREAD[i],{w,h}=SP_SHEET,cw=[210,154,192,115][i],dx=34+cw/2-w/2,dy=SP_SHEET.code-12-h/2;
  return[px+w/2+dx*Math.cos(r)-dy*Math.sin(r),py+h/2+dx*Math.sin(r)+dy*Math.cos(r),cw/2+28];}
function sp_codeRings(ctx,u){if(u<=0)return;for(let i=0;i<4;i++){const [x,y,rx]=sp_codeSpot(i),p=clamp(u*4.6-i*1.1,0,1);if(p>0)wc_ring(ctx,x,y,rx,40,p,{col:WC_PENCIL,lw:3.5,seed:11+i});
    if(i<3){const [x2,y2,rx2]=sp_codeSpot(i+1),q=clamp(u*4.6-i*1.1-0.7,0,1);if(q<=0)continue;const ax=x+rx+4,bx=x2-rx2-4,mx=(ax+bx)/2;
      ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.9);ctx.lineWidth=3.5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(ax,y);for(let k=1;k<=12;k++){const v=k/12*q;
        ctx.lineTo(lerp(ax,bx,v),lerp(y,y2,v)-Math.sin(v*Math.PI)*46);}ctx.stroke();ctx.restore();
      if(q>0.8)wc_hand(ctx,"?",mx-8,(y+y2)/2-62,{size:44,col:WC_PENCIL,w:700,a:(q-0.8)/0.2});}}}

scene("question",(ctx,S,t,sc)=>{const c=sc.cues,P=sp_once(sc,"P",()=>({board:wAt(sc,"ask","board"),some:wAt(sc,"answer","somewhere"),team:wAt(sc,"ask","risk team"),fails:wAt(sc,"ask","another bank"),
    every:wAt(sc,"answer","every business line"),names:wAt(sc,"answer","its own names"),same:wAt(sc,"answer","same customers"),
    add:wAt(sc,"monday","add it up"),trust:wAt(sc,"trust","which to trust"),put:wAt(sc,"trust","put them"),title:c.breath+1.7}));
  const mk=[[0,"2008 · a bank"]],D=SP_RK.desk,[sx,ss]=SP_RK.seat,sy=D.top+GV_SIT*ss,skinH=PEOPLE.spHead.skin,skinD=PEOPLE.spDep.skin;
  // the handover: he holds out the card from give, she takes it at swap, and brings it in to read from read
  const give=P.board-0.6,swap=P.board+0.45,read=swap+0.35;
  gv_shots(ctx,S,t,sc.dur,[
    // the risk floor, late: the news on the television, then the floor; someone from the board's office brings the question to the head of
    // risk's desk, and her team gathers round
    {at:0,place:"risk",keys:[[0,390,290,1.9],[2.2,960,560,1.08]],d:3.4,draw:(x,tt)=>{sp_tvNews(x,clamp(tt/5.5,0,1));
      const dep=gv_walk(tt,1.9,2060,1500,330),a1=gv_walk(tt,P.team-1.4,-160,250,360),a2=gv_walk(tt,P.team-1.0,-160,420,360);
      gv_walker(x,"spAn1",a1,1004,0.86,{t:tt,pose:a1.moving?null:"listen"});gv_walker(x,"spAn2",a2,1010,0.88,{t:tt,pose:a2.moving?null:"listen",flip:false});
      const gm=fin(tt,give,0.5),bk=fin(tt,swap+0.3,0.5),dPose=bk>0?["spGive","listen",bk]:["stand","spGive",gm];
      const up=fin(tt,dep.end-0.4,0.5),tk=fin(tt,give+0.2,0.5),rd=fin(tt,read,0.6),hPose=rd>0?["spTake","spReadOne",rd]:tk>0?["spLookUp","spTake",tk]:["write","spLookUp",up];
      gv_behind(x,"spHead",sx,D.top,ss,{t:tt,pose:hPose[0],pose2:hPose[1],mix:hPose[2],expr:tt>read+0.6?"concerned":"calm"});
      if(dep.moving)gv_walker(x,"spDep",dep,1012,0.9,{t:tt});else gv_walker(x,"spDep",dep,1012,0.9,{t:tt,pose:dPose[0],pose2:dPose[1],mix:dPose[2],flip:true});
      x.drawImage(gv_place("riskDesk"),0,0);sp_lampLight(x,1);
      // the card, in front of the desk's things, held at one end: hanging from his hand as he walks (pointing down), held out to her (pointing at her), passed, and read.
      // A plain card's back looks the same turned half round, so its turn is kept within a half turn as it changes hands.
      const card=(h,ang,s)=>[h[0]+Math.cos(ang)*52*s,h[1]+Math.sin(ang)*52*s],hh=sp_handAt("spHead",sx,sy,ss,hPose[0],hPose[1],hPose[2],false,1),hA=lerp(-0.1,-0.18,rd);
      if(tt<swap+0.15){const dh=dep.moving?sp_handAt("spDep",dep.x,1012-dep.bob,0.9,"stand",dep.swing>0?"walkA":"walkB",Math.abs(dep.swing),true,1)
            :sp_handAt("spDep",dep.x,1012,0.9,dPose[0],dPose[1],dPose[2],true,1),dA=lerp(Math.PI/2+0.1,Math.PI+0.08,dep.moving?0:gm),
          u=easeCam(clamp((tt-(swap-0.3))/0.45,0,1)),[ax,ay]=card(dh,dA,0.92),[bx,by]=card(hh,-0.1,0.97);
        sp_cardFree(x,lerp(ax,bx,u),lerp(ay,by,u),lerp(dA-Math.PI,-0.1,u),lerp(0.92,0.97,u),(u<0.6?[[dh[0],dh[1],skinD]]:[]).concat(u>0.4?[[hh[0],hh[1],skinH]]:[]));}
      else{const [bx,by]=card(hh,hA,0.97);sp_cardFree(x,bx,by,hA,0.97,[[hh[0],hh[1],skinH]]);}}},
    // the desk from above: the board's card, close; then a printout from each business line, each with its own code for the same customer
    {at:P.fails-0.3,place:"spread",keys:[[P.fails-0.3,960,196,2.2],[c.answer-0.5,960,520,1.0]],d:2.6,draw:(x,tt)=>{sp_cardOnDesk(x,960,196,-0.03);
      SP_SPREAD.forEach(([px,py,r],i)=>sp_printout(x,i,px,py,r,fin(tt,P.some-0.1+i*0.5,0.6),fin(tt,P.names+i*0.28,0.5)));
      sp_codeRings(x,clamp((tt-P.same+0.2)/1.6,0,1));
      wc_hand(x,"the same customer?",960,866,{size:46,col:WC_PENCIL,align:"center",p:clamp((tt-P.same-1.0)/0.9,0,1)});}},
    // the whiteboard: the business lines' sums, and the total, a red question mark; the desk calendar turns, Friday to Monday
    {at:c.monday-0.3,place:"board08",keys:[[c.monday-0.3,940,530,1.0],[c.monday+1.6,960,520,1.04]],d:2,draw:(x,tt)=>{
      sp_board(x,tt,{q:clamp((tt-P.add+0.1)/0.7,0,1)});const days=["Fri","Sat","Sun","Mon"],f=[c.monday+0.05,c.monday+0.65,c.monday+1.25];
      let i=0;f.forEach(ft=>{if(tt>=ft+0.4)i++;});const turning=f.findIndex(ft=>tt>=ft&&tt<ft+0.4);
      if(turning>=0)sp_calendar(x,days[turning],days[turning+1],(tt-f[turning])/0.4);else sp_calendar(x,days[i],days[i],0);}},
    // out through the window: the bank's one lit floor, then the city, and window after window lit late in the other towers
    {at:c.one-0.3,place:"city",keys:[[c.one-0.3,300,470,1.7],[c.one+0.2,960,540,1.0]],d:3.4,push:0,draw:(x,tt)=>{sp_lateWindows(x,clamp((tt-c.one-0.5)/(c.there-c.one-1.4),0,1));}},
    // the board again, closer: the last figure comes in, and the total is still a question; then a second figure for one line
    {at:c.there-0.3,place:"board08",keys:[[c.there-0.3,760,470,1.25],[P.put,750,480,1.22]],d:2,draw:(x,tt)=>{
      sp_board(x,tt,{q:1,full:clamp((tt-c.there-0.4)/0.6,0,1),doubt:P.trust-0.3});sp_calendar(x,"Mon","Mon",0);}},
    // the last light on the floor: she reads the question again, as the screens and the ceiling go dark, row by row, but for her lamp
    {at:c.breath-0.2,place:"risk",keys:[[c.breath-0.2,960,560,1.08],[c.breath+0.6,960,560,1.0]],d:2.4,draw:(x,tt)=>{sp_tvNews(x,1);
      gv_behind(x,"spHead",sx,D.top,ss,{t:tt,pose:"hold",carry:sp_cardBack,expr:"worried"});x.drawImage(gv_place("riskDesk"),0,0);sp_lampLight(x,1);sp_lightsOut(x,fin(tt,c.breath+0.1,1.6),1);}}]);
  sp_pill(ctx,t,mk,fin(t,0.5,0.6)*(1-fin(t,c.breath,0.4)));
  wc_paperOver(ctx,S);wc_fadeIn(ctx,S,t,1.4);
  gv_title(ctx,S,t,P.title,"The same problem, everywhere","why data governance exists","Prologue · data governance");});

// ---- 2 · Not a new problem: in the 1970s, departments share data, a new job looks after it, and in 1980 its people start meeting ----
// a ring binder, closed, held or passed: its cover, the spine on its left, a label; its middle at x, y, turned rot
function sp_binderFree(ctx,x,y,rot,col,s){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(s,s);ctx.fillStyle="rgba(60,40,30,0.22)";rr(ctx,-50,-62,108,132,6);ctx.fill();
  ctx.fillStyle=rgba(col,1);rr(ctx,-54,-66,108,132,6);ctx.fill();ctx.strokeStyle="rgba(58,54,66,0.7)";ctx.lineWidth=2;ctx.stroke();ctx.fillStyle=rgba(wc_dim(col,0.3),1);ctx.fillRect(-54,-66,18,132);
  ctx.fillStyle="rgba(250,248,240,0.95)";ctx.fillRect(-20,-40,56,30);ctx.restore();}
scene("notnew",(ctx,S,t,sc)=>{const c=sc.cues,P=sp_once(sc,"P",()=>({share:wAt(sc,"sharing","sharing data"),owns:wAt(sc,"questions","who owns"),see:wAt(sc,"questions","who may see"),
    admin:wAt(sc,"job","data administration"),dict:wAt(sc,"job","dictionary"),la:wAt(sc,"la","Los Angeles"),meet:wAt(sc,"la","started meeting"),share2:wAt(sc,"la","to share"),
    learned:wAt(sc,"la","learned"),dama:wAt(sc,"chapters","DAMA"),city:wAt(sc,"chapters","city after city"),same:wAt(sc,"alone","the same lessons"),them:wAt(sc,"together","learn them"),
    tog:wAt(sc,"together","together")}));
  const mk=[[0,"1970s"],[c.la-0.1,"Los Angeles · 1980"],[P.city-0.6,"1980s"]],L=SP_LA;
  // the meeting in Los Angeles: who stands at the back, at the chart and at the table; o.back and o.seat let a shot pose those standing at
  // the back and those at the table
  const meeting=(x,tt,o)=>{L.back.forEach(([bx,id],i)=>{const cup=i%2===1,bo=Object.assign({t:tt,pose:cup?"spCup":"listen",carry:cup?sp_cupHeld:null,flip:true,expr:o.expr||"calm"},o.back&&o.back(i,id,bx));
      person(x,id,bx,L.bf,L.bs,bo);sp_badge(x,id,bx,L.bf,L.bs,bo.flip);});
    const [cx,cf,cs]=L.chart,writing=tt>P.meet-0.5&&tt<P.learned+1.0;person(x,"spLa1",cx,cf,cs,{t:tt,pose:writing?"point":"listen",flip:writing,expr:o.expr||"calm"});sp_badge(x,"spLa1",cx,cf,cs,writing);
    L.seats.forEach(([sx,id],i)=>{const so=o.seat?o.seat(i,id,sx):{pose:"listen",flip:true};gv_behind(x,id,sx,L.table[2],L.s,Object.assign({t:tt,expr:o.expr||"calm"},so));});
    x.drawImage(gv_place("la80table"),0,0);sp_cardName(x);};
  gv_shots(ctx,S,t,sc.dur,[
    // the office floor: sales, accounts and shipping at their terminals; pencil lines run from each to the one computer they share, then
    // two questions go up on it, and they look up
    {at:0,place:"office70",keys:[[0,960,540,1.0],[c.questions+0.4,960,440,1.42]],d:2.4,draw:(x,tt)=>{sp_blink(x,tt);SP_70.desks.forEach(d=>sp_signName(x,d.sign[0],d.sign[1]));
      sp_slip(x,872,532,214,116,[252,224,118],-0.05,["who owns","this data?"],34,fin(tt,P.owns-0.15,0.5),301);sp_slip(x,1062,470,184,116,[246,178,190],0.05,["who may","see it?"],34,fin(tt,P.see-0.15,0.5),302);
      SP_70.desks.forEach((d,i)=>{const look=fin(tt,c.questions+0.4+i*0.25,0.7)*(i===2?0.7:1);gv_behind(x,d.id,d.seat[0],d.top,d.seat[1],{t:tt,pose:"spType",pose2:"spLookCab",mix:look,flip:d.term[2]>0});});
      SP_70.desks.forEach(d=>sp_termGlow(x,d,1));x.drawImage(gv_place("desks70"),0,0);sp_links70(x,clamp((tt-P.share+0.2)/1.8,0,1));}},
    // her office, from the corridor: she writes in the dictionary; then her door, and the job's name on it
    {at:c.job-0.3,place:"admin70",keys:[[c.job-0.3,900,520,1.08],[P.admin-0.8,640,470,1.3]],d:1.6,draw:(x,tt)=>{
      gv_behind(x,"spAdmin",SP_AD.seat[0],SP_AD.top,SP_AD.seat[1],{t:tt,pose:"write",nod:0.03*Math.sin(tt*2.2)});x.drawImage(gv_place("adminFront70"),0,0);sp_adminLamp(x,1);sp_doorName(x);}},
    // the dictionary, from above: she writes what a customer is
    {at:P.dict-0.4,place:"dict70",keys:[[P.dict-0.4,960,500,1.08],[P.dict+0.6,1210,470,1.42]],d:1.8,draw:(x,tt)=>{const ink=[36,56,130];
      wc_T(x,"Data dictionary",360,224,{w:700,size:44,f:"mono",col:WC_DARK});
      const L3=[["customer:",1040,470,52,P.dict+0.3,0.6],["has bought from us",1070,546,46,P.dict+1.0,1.0],["in the last 3 years",1070,614,46,P.dict+2.1,1.0]];let pen=null;
      L3.forEach(([s,lx,ly,sz,t0,d])=>{const p=clamp((tt-t0)/d,0,1);if(p<=0)return;wc_hand(x,s,lx,ly,{size:sz,col:ink,w:600,p});
        pen=[lx+tw(x,s.slice(0,Math.ceil(s.length*p)),sz,600),ly-sz*0.25];});
      sp_penHand(x,...(pen||[1040,470]),1.25);}},
    // Los Angeles at dusk, 1980: an office building, its upstairs room lit, palms against the sky
    {at:c.la-0.3,place:"laOut",keys:[[c.la-0.3,960,540,1.0],[c.la+0.3,700,560,1.25]],d:2.6},
    // inside, the meeting: what they've learned goes up on the flip chart, line by line; then the card on the table, close
    {at:P.meet-0.7,place:"la80",keys:[[P.meet-0.7,960,540,1.0],[P.dama-0.9,1205,700,1.62]],d:1.6,draw:(x,tt)=>{
      meeting(x,tt,{});sp_chart(x,[fin(tt,P.meet+0.3,1.1),fin(tt,P.share2+0.3,0.8),fin(tt,P.learned,0.8)]);}},
    // the chapters: a flyer for each new chapter's meeting, pinned up one after another
    {at:P.city-0.7,place:"notice80",keys:[[P.city-0.7,960,470,1.0],[P.city+2.5,960,480,1.04]],d:2,draw:(x,tt)=>{for(let i=0;i<6;i++)sp_flyer(x,i,fin(tt,P.city-0.25+i*0.34,0.45));}},
    // before that, each alone: three buildings at night, one lit window in each, someone writing the same lesson down
    {at:c.alone-0.3,place:"alone70",keys:[[c.alone-0.3,960,520,1.0]],d:2,push:0.03,draw:(x,tt)=>{SP_AL.forEach((a,i)=>{sp_aloneWindow(x,i,tt);const [wx,wy,ww]=a.win;
      sp_slip(x,wx+ww/2,wy-58,440,66,null,[-0.02,0.015,-0.01][i],["one meaning for each word"],30,fin(tt,P.same-0.2+i*0.35,0.5),311+i);});}},
    // and now together: two standing at the back hold up their binders, pass them across and swap
    {at:c.together-0.3,place:"la80",keys:[[c.together-0.3,1450,560,1.5],[P.tog+0.5,1440,570,1.56]],d:2,draw:(x,tt)=>{const sw=P.them-0.5,r=fin(tt,sw,0.45)*(1-fin(tt,sw+0.95,0.4)),
        m=easeCam(clamp((tt-sw-0.35)/0.6,0,1)),pair=[[3,"spLa5",false],[4,"spLa7",true]];
      meeting(x,tt,{expr:tt>P.tog?"smile":"calm",seat:i=>i===0?{pose:"write",flip:false,nod:0.03*Math.sin(tt*2)}:{pose:"listen",flip:true},
        back:i=>i===3||i===4?{pose:"spShowB",pose2:"spPassS",mix:r,flip:i===4,carry:null}:null});
      // each binder at its holder's hands: between them at the chest, in the right hand held out; they pass in the middle, one over the
      // other, and the holders' thumbs show on them
      const h=pair.map(([i,id,fl])=>{const bx=L.back[i][0],R_=sp_handAt(id,bx,L.bf,L.bs,"spShowB","spPassS",r,fl,1),L_=sp_handAt(id,bx,L.bf,L.bs,"spShowB","spPassS",r,fl,-1);
        return {id,R:R_,L:L_,c:[lerp((R_[0]+L_[0])/2,R_[0],r),lerp((R_[1]+L_[1])/2,R_[1],r)+lerp(6,-4,r)]};});
      [[1,0,10,[40,70,130],[0.06,-0.04]],[0,1,-28,[120,130,80],[-0.05,0.08]]].forEach(([a,b,arc,col,rot])=>{const p=h[a].c,q=h[b].c;
        sp_binderFree(x,lerp(p[0],q[0],m),lerp(p[1],q[1],m)+Math.sin(m*Math.PI)*arc,lerp(rot[0],rot[1],m),col,0.55);});
      h.forEach(q=>{const sk=PEOPLE[q.id].skin;for(const [p,on] of [[q.R,1],[q.L,1-r]])if(on>0.5){x.save();x.translate(p[0],p[1]-2);x.scale(0.58,0.58);ell(x,0,0,12,15);
        litFill(x,sk,-12,-15,12,15);seam(x,sk,0.3,1.2);x.restore();}});}},
    // from above: she copies a page from the binder she borrowed into her own
    {at:P.them+0.95,place:"copy80",keys:[[P.them+0.95,960,540,1.04],[P.them+1.15,1200,520,1.22]],d:2.6,draw:(x,tt)=>{let pen=null;
      SP_CP.lines.forEach(([lx,ly,w,head],i)=>{const p=clamp((tt-P.them-1.25-i*0.6)/0.52,0,1);if(p>0)pen=sp_scribble(x,lx,ly,w,p,331+i,head);});
      sp_penHand(x,...(pen||SP_CP.lines[0].slice(0,2)),1.25);}}]);
  sp_pill(ctx,t,mk,fin(t,0.4,0.6)*(1-gv_io(t,c.questions+0.3,c.job+0.25,0.4))*(1-gv_io(t,P.dama-0.4,P.city-0.6,0.4))*(1-fin(t,c.alone-0.4,0.4)));});

// ---- 3 · Someone signs: in 2002, a law makes the chief executive and the chief financial officer sign for the figures ----
scene("signs",(ctx,S,t,sc)=>{const c=sc.cues,P=sp_once(sc,"P",()=>({execs:wAt(sc,"law","chief executives"),sign:wAt(sc,"law","sign for"),fig:wAt(sc,"law","figures"),
    ctrl:wAt(sc,"controls","the controls"),ans:wAt(sc,"top","answered")}));
  const K=SP_B2,sg=[["spCeo",P.sign-0.05,1.15],["spCfo",P.fig-0.05,1.1]];
  // the two at the table, the report in front of them
  const room=(x,tt)=>{K.seats.forEach(([sx,id],i)=>gv_behind(x,id,sx,K.top,K.s,{t:tt,pose:"listen",flip:i===1,nod:0.02*Math.sin(tt*1.3+i*2)}));
    x.drawImage(gv_place("board02table"),0,0);};
  gv_shots(ctx,S,t,sc.dur,[
    // the boardroom: the two who sign, the finance floor behind the glass
    {at:0,place:"board02",keys:[[0,960,540,1.0],[0.5,960,560,1.1]],d:6,draw:(x,tt)=>{sp_controls(x,0);room(x,tt);}},
    // the report's last page, from above: he signs, then she does
    {at:P.sign-0.45,place:"report02",keys:[[P.sign-0.45,950,480,1.04],[P.sign-0.25,940,470,1.26]],d:1.5,draw:(x,tt)=>sp_reportPage(x,tt,sg)},
    // the controls behind them: the binders on the finance floor light gold
    {at:sg[1][1]+1.15,place:"board02",keys:[[sg[1][1]+1.15,960,560,1.06],[P.ctrl-0.15,960,420,1.5]],d:2.2,draw:(x,tt)=>{sp_controls(x,fin(tt,P.ctrl,0.8));room(x,tt);}},
    // back to the page, what they certify and the two signatures, as the ink dries; their lines ruled in gold
    {at:c.top-0.45,place:"report02",keys:[[c.top-0.45,940,450,1.3],[c.top-0.25,930,420,1.42]],d:5,draw:(x,tt)=>sp_reportPage(x,tt,sg,{dry:fin(tt,c.top-0.45,4),gold:[fin(tt,P.ans,0.6),fin(tt,P.ans+0.4,0.6)]})}]);
  sp_pill(ctx,t,[[0,"United States · 2002"]],fin(t,0.4,0.6)*(1-fin(t,c.breath,0.4)));});

// ---- 4 · Written down: what the members had learned becomes a book; it draws the work as a wheel, held true by its centre, governance ----
// a note pinned beside the wheel: it springs in at t0, goes at o.out
function sp_note(x,tt,t0,cx,cy,lines,o){o=o||{};const a=fin(tt,t0,0.35)*(o.out==null?1:1-fin(tt,o.out,0.4));if(a<=0.01)return;const sz=30,
    w=Math.round(Math.max(...lines.map(l=>tw(x,l,sz,700)))+48),h=lines.length*(sz+12)+28,k=0.9+0.1*spring(fin(tt,t0,0.5));
  x.save();x.translate(cx,cy);x.scale(k,k);withA(x,a,()=>{wc_panel(x,-w/2,-h/2,w,h,{kind:"card",seed:w});
    lines.forEach((l,i)=>wc_T(x,l,0,-h/2+14+(i+0.8)*(sz+12),{w:700,size:sz,align:"center",col:WC_INK}));});x.restore();}
scene("written",(ctx,S,t,sc)=>{const c=sc.cues,P=sp_once(sc,"P",()=>({members:wAt(sc,"dmbok","members"),know:wAt(sc,"dmbok","knowledge"),dm:wAt(sc,"dmbok","DMBOK"),
    arch:wAt(sc,"wheel","architecture"),mod:wAt(sc,"wheel","modelling"),sec:wAt(sc,"wheel","security"),qual:wAt(sc,"wheel","quality"),meta:wAt(sc,"wheel","metadata"),
    more:wAt(sc,"wheel","more"),hub:wAt(sc,"hub","hub"),gov:wAt(sc,"hub","governance"),fit:wAt(sc,"decide","fit"),bal:wAt(sc,"decide","balance"),
    auth:wAt(sc,"decide","authority"),part:wAt(sc,"guides","part"),agree:wAt(sc,"takes","agree"),shows:wAt(sc,"takes","shows"),
    draws:wAt(sc,"wheel","draws"),whl:wAt(sc,"wheel","wheel")}));
  const K=SP_SH,set=P.know-0.9,pg=P.dm+0.9,shut=P.shows-0.2,back=shut+1.0,out=P.agree-0.5,named=[P.arch,P.mod,0,P.sec,0,0,0,0,P.meta,P.qual],rest=[2,4,5,6,7],
    areaAt=k=>named[k]?named[k]-0.15:P.more-0.1+rest.indexOf(k)*0.16;
  gv_shots(ctx,S,t,sc.dur,[
    // the shelf: the binders of what the members had learned light as they're named; the book is set beside them
    {at:0,place:"shelf09",keys:[[0,960,540,1.0],[set+1.6,1160,546,1.42]],d:2.6,draw:(x,tt)=>{x.save();x.globalCompositeOperation="screen";
      SP_BINDERS.forEach(([bx,w,h],i)=>{const g=gv_io(tt,P.members-0.3+i*0.12,P.members+1.2+i*0.12,0.35);if(g>0)wc_glowAt(x,bx+w/2,K.top-h*0.55,h*0.62,[255,212,140],0.42*g);});x.restore();
      const u=easeCam(clamp((tt-set)/1.1,0,1));if(u<=0)return;const dy=(1-u)*640,k=1.06-0.06*spring(fin(tt,set+0.9,0.6));sp_book(x,K.books[0],K.top+dy,1,{k});
      const rel=fin(tt,set+1.25,0.9);if(rel<1){const hx=K.w/2*k,hy=K.top+dy-K.h*0.2*k,o=40*easeCam(clamp(rel*3,0,1)),dn=700*easeCam(rel);
        sp_holdHand(x,K.books[0]-hx-o,hy+dn,-1,0.85);sp_holdHand(x,K.books[0]+hx+o,hy+dn,1,0.85);}}},
    // the book opens: its wheel's two rings sketched in pencil as it "draws" it; the areas come in as they're named, uneven, until the
    // centre lights and holds them true; it turns once, evenly; the other guides, on the same ground or part of it; then all of it lit,
    // and the book closes
    {at:pg,place:"wheelpage",keys:[[pg,960,540,1.04],[pg+0.1,960,540,1.0]],d:1.6,draw:(x,tt)=>{const cu=Math.max(1-clamp((tt-pg-0.55)/0.9,0,1),clamp((tt-shut)/0.9,0,1));
      if(Math.sin(Math.PI/2*easeCam(cu))<0.86){sp_wheelGuide(x,clamp((tt-P.draws-0.2)/(P.whl-P.draws+0.5),0,1));sp_wheel(x,{area:k=>fin(tt,areaAt(k),0.5),off:1-spring(fin(tt,P.gov-0.05,1.0)),turn:TAU*easeCam(clamp((tt-P.bal+0.1)/2.0,0,1)),centre:fin(tt,P.hub-0.1,0.6),
        pulse:Math.min(1,gv_io(tt,P.auth-0.2,P.auth+1.0,0.4)+gv_io(tt,P.agree-0.3,99,0.6)),spokes:clamp((tt-P.gov+0.1)/0.9,0,1),
        spokeA:0.75+0.25*gv_io(tt,P.fit-0.1,P.fit+1.0,0.3),rim:clamp((tt-P.gov-0.3)/1.0,0,1),labels:1-gv_io(tt,P.bal-0.45,P.bal+2.05,0.3),
        ring:clamp((tt-c.guides+0.1)/1.4,0,1)*(1-fin(tt,out,0.4)),dim:gv_io(tt,c.guides-0.2,out,0.5),keep:k=>k===9?fin(tt,P.part-0.1,0.4):0,
        outlines:[[9,gv_io(tt,P.part-0.1,out,0.4)],["centre",gv_io(tt,P.part+1.2,out,0.4)]]});
      sp_note(x,tt,c.guides+0.15,1660,150,["DCAM","the same ground"],{out});sp_note(x,tt,P.part-0.1,262,150,["ISO 8000","data quality"],{out});
      sp_note(x,tt,P.part+1.2,1660,780,["ISO/IEC 38505","governing data"],{out});}sp_coverClose(x,cu);}},
    // closed, and back on the shelf beside the binders
    {at:back,place:"shelf09",keys:[[back,1160,546,1.42],[back+0.1,1020,540,1.08]],d:2.4,draw:x=>sp_book(x,K.books[0],K.top,1)}]);
  sp_pill(ctx,t,[[0,"2009"]],fin(t,0.4,0.6)*(1-fin(t,P.dm+0.3,0.5)));});

// ---- 5 · Governance first: the banks' regulators put governance first, a condition for all the rest; ten years on, two of thirty-one ----
scene("first",(ctx,S,t,sc)=>{const c=sc.cues,P=sp_once(sc,"P",()=>({pr:wAt(sc,"principles","principles"),first:wAt(sc,"principles","first"),
    cond:wAt(sc,"principles","condition"),own:wAt(sc,"own","own"),risk:wAt(sc,"own","risk"),qual:wAt(sc,"own","quality"),two:wAt(sc,"ten","two"),
    thirty:wAt(sc,"ten","thirty-one"),met:wAt(sc,"ten","met"),under:wAt(sc,"programmes","underfunded"),narrow:wAt(sc,"programmes","narrow"),
    att:wAt(sc,"programmes","attention"),dec:wAt(sc,"takes","decisions")}));
  const K=SP_PR,{spine,y,w}=K,pg=P.pr-0.3,turn=c.own-0.85,tu=1.15,yr=c.ten-0.3,go=c.takes-0.3;
  // the four at the table, the principles in front of them
  const room=(x,tt)=>{SP_BS.seats.forEach(([sx,id],i)=>gv_behind(x,id,sx,SP_BS.top,SP_BS.s,{t:tt,pose:i===1?"spReadOne":"listen",flip:i>=2,nod:0.02*Math.sin(tt*1.2+i*2)}));
    x.drawImage(gv_place("basel13table"),0,0);};
  gv_shots(ctx,S,t,sc.dur,[
    // the regulators' room, high over the old town, the minster and the river
    {at:0,place:"basel13",keys:[[0,960,540,1.0],[0.3,960,520,1.1]],d:4.5,draw:room},
    // the principles: the list; the first lit gold, then gold from it to each of the others; the page turns to the second principle,
    // and one of its lines is written in, its owner and its quality lit
    {at:pg,place:"principles13",keys:[[pg,800,545,1.12],[c.own+0.1,650,470,1.42]],d:2.0,draw:(x,tt)=>{const u=clamp((tt-turn)/tu,0,1),th=Math.PI*easeCam(u),
        lst={a:fin(tt,pg+0.1,0.5),lit:fin(tt,P.first-0.1,0.6),run:clamp((tt-P.cond+0.1)/1.4,0,1)};
      if(u<=0){sp_prList(x,lst);x.drawImage(sp_prFace("gov",sp_prGov,1),spine,y);}
      else if(u<1){sp_prList(x,lst);x.drawImage(sp_prFace("next",sp_prNext,1),spine,y);sp_turn(x,th,sp_prFace("gov",sp_prGov,1),sp_prFace("arch",sp_prArch,-1));}
      else{x.drawImage(sp_prFace("arch",sp_prArch,-1),spine-w,y);x.drawImage(sp_prFace("next",sp_prNext,1),spine,y);
        sp_prOwn(x,fin(tt,turn+tu,0.45),fin(tt,P.own-0.05,0.5),fin(tt,P.qual-0.05,0.5),fin(tt,P.risk-0.05,0.5));}}},
    // ten years on, the same table: the progress report; the camera comes back to the two green towers and rests on them
    {at:yr,place:"report23",keys:[[yr,700,560,1.2],[P.under-0.6,960,540,1.02],[go,629,500,2.0]],d:2.2,
      draw:(x,tt)=>sp_report(x,tt,{at:yr,two:P.two,thirty:P.thirty,met:P.met,under:P.under,narrow:P.narrow,att:P.att,dec:P.dec,go})}]);
  sp_pill(ctx,t,[[0,"Basel · 2013"],[yr+0.2,"Basel · 2023"]],fin(t,0.4,0.6)*(1-fin(t,c.breath,0.4)));});

// ---- 6 · Should we?: a team asks whether it should, not only whether it can; an office answers a customer for the data it holds ----
// a nod: 0 to 1 and back, twice, from t0 (a pose's mix toward its looking-down twin)
const sp_nodMix=(t,t0)=>{const u=(t-t0)/0.5;return u<=0||u>=2?0:Math.pow(Math.sin(Math.PI*u),2);};
// a sheet passing over the front desk (the customer's letter, or the reply), and the two holding it: the giver holds it at the chest,
// holds it out from give, lets go at swap; the taker reaches for it from give, takes it, and from read holds it at the chest to read it.
// o.dir 1: the customer gives, -1: the privacy lead does; o.nod, when the reader nods; o.expr: [customer's, lead's] at each step
function sp_frontPeople(x,tt,o){const K=SP_FD,[cx,cf,cs]=K.cust,[lx,lf,ls]=K.priv,top=K.desk[1],skC=PEOPLE.spCust.skin,skP=PEOPLE.spPriv.skin,
    held=fin(tt,o.give,0.5),back=fin(tt,o.swap+0.2,0.5),reach=fin(tt,o.give+0.2,0.5),rd=fin(tt,o.read,0.5),nd=o.nod?sp_nodMix(tt,o.nod):0;
  let gPose=back>0?["spOffer","listen",back]:["spReadStand","spOffer",held],tPose=rd>0?["spOffer","spReadStand",rd]:["listen","spOffer",reach];
  if(nd>0&&rd>=1)tPose=["spReadStand","spReadNod",nd];
  const cP=o.dir>0?gPose:tPose,lP=o.dir>0?tPose:gPose,cCarry=(o.dir>0?held<=0:rd>=1)?sp_sheetBack:null,lCarry=(o.dir>0?rd>=1:held<=0)?sp_sheetBack:null;
  // the sheet between their hands: in the giver's from give, the taker's from swap, until it's held at the chest again; lifted a little
  // as it crosses the counter, and on the privacy lead's side, drawn behind the counter
  const hC=sp_handAt("spCust",cx,cf,cs,cP[0],cP[1],cP[2],false,1),hL=sp_handAt("spPriv",lx,lf,ls,lP[0],lP[1],lP[2],true,1),[gh,th,gs,ts]=o.dir>0?[hC,hL,skC,skP]:[hL,hC,skP,skC];
  let sheet=null,leadSide=false;
  if(held>0&&rd<1){const u=easeCam(clamp((tt-(o.swap-0.3))/0.45,0,1)),dx=o.dir*44,ax=gh[0]+dx,ay=gh[1]-8,bx=th[0]-dx,by=th[1]-8,lift=Math.sin(Math.PI*u)*26;
    leadSide=o.dir>0?u>=0.5:u<0.5;
    sheet=()=>sp_sheetHeld(x,lerp(ax,bx,u),lerp(ay,by,u)-lift,o.dir*0.08*(1-2*u),1.2,(u<0.6?[[gh[0],gh[1]-lift*(1-u),gs]]:[]).concat(u>0.4?[[th[0],th[1]-lift*u,ts]]:[]));}
  sp_behindAt(x,"spPriv",lx,top,lf,ls,{t:tt,pose:lP[0],pose2:lP[1],mix:lP[2],flip:true,expr:o.lexpr||"calm",carry:lCarry});
  if(sheet&&leadSide)sheet();
  x.drawImage(gv_place("front18desk"),0,0);
  person(x,"spCust",cx,cf,cs,{t:tt,pose:cP[0],pose2:cP[1],mix:cP[2],expr:o.cexpr||"calm",carry:cCarry});
  if(sheet&&!leadSide)sheet();}
scene("should",(ctx,S,t,sc)=>{const c=sc.cues,P=sp_once(sc,"P",()=>({data:wAt(sc,"grew","data"),q:wAt(sc,"grew","questions"),second:wAt(sc,"ethics","second"),
    eth:wAt(sc,"ethics","ethics"),not:wAt(sc,"ethics","not only"),can:wAt(sc,"ethics","can"),should:wAt(sc,"ethics","should"),answer:wAt(sc,"law","answer"),
    pers:wAt(sc,"law","personal"),hold:wAt(sc,"law","hold"),prove:wAt(sc,"law","prove"),people:wAt(sc,"people","people")}));
  const K=SP_TR,[px,pf,ps]=K.stand,top=K.table[1],KS=SP_SH,sh=c.ethics-0.45,set=P.second-0.95,back=P.not+0.2,fd=c.law-0.3,dk=fd+2.15,slide=P.hold-0.35,fd2=c.people-0.75;
  // the team room: the one at the board, and the three at the table; pp, the standing one's pose [pose, pose2, mix] and expression;
  // sp, each seated one's
  const room=(x,tt,pp,sp)=>{person(x,"spT2",px,pf,ps,{t:tt,pose:pp[0],pose2:pp[1],mix:pp[2],flip:true,expr:pp[3]||"calm"});
    K.seats.forEach(([sx,id],i)=>{const s=sp[i];sp_seated(x,id,sx,top,K.s,{t:tt+i*1.3,pose:s[0],pose2:s[1],mix:s[2],expr:s[3]||"calm"});});
    x.drawImage(gv_place("team17table"),0,0);};
  gv_shots(ctx,S,t,sc.dur,[
    // close on the proposal: customers' locations multiply on its map as data grows, and its question comes in; back from it to the team
    {at:0,place:"team17",keys:[[0,430,400,1.6],[P.q-0.4,1000,560,1.04]],d:1.8,draw:(x,tt)=>{
      sp_mapDots(x,SP_DOTS.length*Math.pow(clamp((tt-P.data+0.1)/2.9,0,1),1.7),clamp((tt-P.q)/1.0,0,1));sp_proposal(x,fin(tt,P.q-0.15,1.0));
      room(x,tt,["listen","spPointUp",fin(tt,0.7,0.7),"smile"],[["spSitL"],["spSitL"],["spSitL"]]);}},
    // the shelf: the second edition set beside the first, a tab standing out of it, "ethics", lit gold
    {at:sh,place:"shelf09",keys:[[sh,1240,520,1.12],[set+1.2,1335,470,1.42]],d:2.0,draw:(x,tt)=>{sp_book(x,KS.books[0],KS.top,1);
      const u=easeCam(clamp((tt-set)/1.1,0,1));if(u<=0)return;const dy=(1-u)*640,k=1.06-0.06*spring(fin(tt,set+0.9,0.6));
      x.save();x.translate(KS.books[1],KS.top+dy);x.scale(k,k);sp_bookTab(x,0,0,"ethics",fin(tt,P.eth-0.15,0.5),40);x.restore();sp_book(x,KS.books[1],KS.top+dy,2,{k});
      const rel=fin(tt,set+1.25,0.9);if(rel<1){const hx=KS.w/2*k,hy=KS.top+dy-KS.h*0.2*k,o=40*easeCam(clamp(rel*3,0,1)),dn=700*easeCam(rel);
        sp_holdHand(x,KS.books[1]-hx-o,hy+dn,-1,0.85);sp_holdHand(x,KS.books[1]+hx+o,hy+dn,1,0.85);}}},
    // the team again, closer, the proposal's words out of the frame: she turns to them, they nod, we can; then one of them raises a
    // hand, should we?, and the room goes still
    {at:back,place:"team17",keys:[[back,1310,620,1.574],[back+0.3,1310,600,1.6]],d:2.6,push:0,draw:(x,tt)=>{sp_mapDots(x,SP_DOTS.length,1);sp_proposal(x,1);
      const pitch=fin(tt,back+0.25,0.6),still=fin(tt,P.should-0.25,0.6),ask=fin(tt,P.should-0.45,0.4),turn=fin(tt,P.should+0.1,0.5),
        n1=sp_nodMix(tt,P.can-0.1),n4=sp_nodMix(tt,P.can+0.05),nP=sp_nodMix(tt,P.can+0.15),glad=tt>P.can-0.3&&tt<P.should-0.1?"smile":"calm";
      const pp=still>0?["spPitch","spBackR",still,"calm"]:nP>0?["spPitch","spPitchNod",nP,"smile"]:["spPointUp","spPitch",pitch,"smile"];
      room(x,tt,pp,[turn>0?["spSitL","spSitR",turn]:["spSitL","spSitLNod",n1,glad],["spSitL","spAskUp",ask],["spSitL","spSitLNod",n4,glad]]);
      const b=fin(tt,P.should-0.15,0.5);if(b>0)gv_say(x,1300,340,["We can.","Should we?"],1476,524,{size:38,k:lerp(0.6,1,spring(b)),a:clamp(b*3,0,1)});}},
    // Europe, 2018: a customer brings a letter to an office's front desk, and its privacy lead takes it
    {at:fd,place:"front18",keys:[[fd,900,560,1.04],[fd+0.3,880,600,1.16]],d:2.4,draw:(x,tt)=>sp_frontPeople(x,tt,{dir:1,give:fd+0.55,swap:fd+1.3,read:fd+1.65,
      cexpr:"concerned",lexpr:"calm"})},
    // the counter from above: the letter; the office's register opens at its record of processing; the customer's rows light; a reply
    // comes, the rows are copied onto it, and it's stamped
    {at:dk,place:"desk18",keys:[[dk,880,540,1.07],[dk+0.3,960,540,1.0]],d:2.6,draw:(x,tt)=>{const d=fin(tt,slide,0.6),open=clamp((tt-P.answer+0.1)/0.6,0,1);
      sp_letterOpen(x,d<=0?1:d<1?0.45:0);const [rx,ry,rw]=SP_DK.reg;let r=null;
      if(open>0){r=gv_register(x,rx,ry,rw,{title:SP_ROP.title,cols:SP_ROP.cols,rows:SP_ROP.rows});sp_ropLight(x,r,clamp((tt-P.pers+0.25)/0.8,0,1));}
      sp_regCover(x,open);if(r)sp_reply(x,r,d,[0,1,2,3].map(i=>clamp((tt-slide-0.45-0.18*i)/0.45,0,1)),fin(tt,P.prove-0.08,0.35));}},
    // the reply handed over the counter; the customer reads it, and nods
    {at:fd2,place:"front18",keys:[[fd2,900,560,1.04],[fd2+1.3,690,610,1.42]],d:2.4,draw:(x,tt)=>sp_frontPeople(x,tt,{dir:-1,give:fd2+0.4,swap:fd2+1.0,read:fd2+1.35,
      nod:P.people-0.1,cexpr:tt>P.people-0.4?"smile":"calm",lexpr:tt>fd2+0.3?"smile":"calm"})}]);
  sp_pill(ctx,t,[[0,"2017"],[fd+0.2,"Europe · 2018"]],fin(t,0.4,0.6)*(1-fin(t,c.breath,0.4)));});

// ---- 7 · Machines that learn: a model learns whatever its examples show it; a team asks where the data came from and who decided they
// could use it; the DMBOK's revision adds AI; Europe's AI law asks for data governance; the third edition is being written ----
scene("machines",(ctx,S,t,sc)=>{const c=sc.cues,P=sp_once(sc,"P",()=>({what:wAt(sc,"learn","whatever"),where:wAt(sc,"ask","where"),who:wAt(sc,"ask","who"),
    rev:wAt(sc,"revision","revision"),ai:wAt(sc,"revision","AI"),gov:wAt(sc,"act","governance"),third:wAt(sc,"third","third"),
    notes:["AI governance","data ethics","sustainability"].map(w=>wAt(sc,"third",w)),living:wAt(sc,"living","living"),y27:wAt(sc,"planned","twenty")}));
  const KS=SP_SH,B=SP_SH4.books,[dx0,dw,dh]=SP_SH4.draft,tB=c.ask-0.55,tC=c.revision-0.45,tD=c.act-0.45,tE=c.third-0.5,set=P.rev-0.3,G=P.gov-0.15,dset=P.third-0.1,
    // when each example lands on the pile: the fifth, the wrong one, on "whatever"
    L=[0.65,1.1,1.55,2.0,P.what-0.2,P.what+0.75,P.what+1.2];
  gv_shots(ctx,S,t,sc.dur,[
    // the training table from above: each example taken from the box and laid on the pile, the notebook copying it, the wrong one too
    {at:0,place:"desk24",keys:[[0,940,540,1.0],[1.2,1000,540,1.04]],d:3.0,draw:(x,tt)=>{L.forEach((l,i)=>{const u=clamp((tt-(l-0.42))/0.42,0,1);if(u<=0)return;
      const e=easeCam(u),[px,py,pr]=sp_pile(i),sx=260+((i*97)%380),sy=330+((i*53)%140),top=u>=1&&(i===L.length-1||tt<L[i+1]-0.42);
      sp_photo(x,lerp(sx,px,e),lerp(sy,py,e)-Math.sin(Math.PI*e)*70,lerp(pr+(i%2?0.3:-0.3),pr,e),lerp(0.62,1.12,e),SP_EX[i],1,!top);
      sp_copy(x,i,clamp((tt-(l+0.08))/0.5,0,1));});}},
    // the team at their table: one lifts the box and asks where the data came from; another asks who decided they could use it
    {at:tB,place:"team24",keys:[[tB,1000,560,1.06],[tB+0.4,1080,520,1.16]],d:2.6,draw:(x,tt)=>{const reach=fin(tt,tB+0.25,0.5),lift=clamp((tt-(tB+0.8))/0.6,0,1),
        turn=fin(tt,P.who-0.2,0.5),ask=fin(tt,P.who-0.35,0.45),worry=tt>P.where-0.4;
      const p3=turn>0?["spBoxUp","spBoxUpR",turn,"concerned"]:lift>0?["spBoxRest","spBoxUp",easeCam(lift),worry?"concerned":"calm"]:["stand","spBoxRest",reach,"calm"];
      sp_team24(x,tt,{p:{spMl1:["spEyesR","spEyesR",0,"calm"],spMl3:p3,spMl2:["spEyesR","spAskOpen",ask,tt>P.who-0.4?"concerned":"calm",true]},hold:reach,lift,
        rot:lerp(-0.04,0.03,turn)*easeCam(lift)});
      const b1=fin(tt,P.where-0.15,0.5),b2=fin(tt,P.who-0.15,0.5);
      if(b1>0)gv_say(x,640,300,["Where did this","data come from?"],930,486,{size:38,k:lerp(0.6,1,spring(b1)),a:clamp(b1*3,0,1)});
      if(b2>0)gv_say(x,1240,300,["Who decided","we could use it?"],1372,486,{size:38,k:lerp(0.6,1,spring(b2)),a:clamp(b2*3,0,1)});}},
    // the shelf in 2024: the revision set beside the other two, a new tab standing out of it, "AI", lit gold
    {at:tC,place:"shelf24",keys:[[tC,740,540,1.02],[set+1.2,920,470,1.32]],d:2.0,draw:(x,tt)=>{sp_book(x,B[0],KS.top,1);sp_bookTab(x,B[1],KS.top,"ethics",0,40);sp_book(x,B[1],KS.top,2);
      const u=easeCam(clamp((tt-set)/1.1,0,1));if(u<=0)return;const dy=(1-u)*640,k=1.06-0.06*spring(fin(tt,set+0.9,0.6));
      x.save();x.translate(B[2],KS.top+dy);x.scale(k,k);sp_bookTab(x,0,0,"AI",fin(tt,P.ai-0.15,0.5),70);x.restore();sp_book(x,B[2],KS.top+dy,3,{k});
      const rel=fin(tt,set+1.25,0.9);if(rel<1){const hx=KS.w/2*k,hy=KS.top+dy-KS.h*0.2*k,o=40*easeCam(clamp(rel*3,0,1)),dn=700*easeCam(rel);
        sp_holdHand(x,B[2]-hx-o,hy+dn,-1,0.85);sp_holdHand(x,B[2]+hx+o,hy+dn,1,0.85);}}},
    // Europe, 2024: the AI law, open at Article 10, its title lit gold by a highlighter
    {at:tD,place:"act24",keys:[[tD,960,540,1.0],[tD+0.4,960,440,1.12]],d:2.4,draw:(x,tt)=>{const lit=easeCam(clamp((tt-G)/0.9,0,1));sp_actWords(x,lit);
      const ein=easeCam(clamp((tt-(G-0.9))/0.8,0,1)),eout=easeCam(clamp((tt-(G+1.1))/0.9,0,1)),off=(1-ein)+eout;
      if(off<1.4){const [tx,ty]=sp_actTip(x,lit);sp_highlighter(x,tx+off*760,ty+off*560,1);}}},
    // now: the third edition's draft set beside them, leaning on them; its new sections stuck on it one by one; its pages lift, as if it's
    // still being written; a tag, planned for 2027
    {at:tE,place:"shelf24",keys:[[tE,820,540,1.0],[tE+1.0,1300,560,1.55],[P.living-0.7,1180,545,1.3],[P.y27-0.7,1300,560,1.5]],d:1.8,draw:(x,tt,cam)=>{
      // a book whose words the frame's left edge cuts keeps them as decoration
      const left=cam.x-960/cam.z,cut=(bx,half)=>left>bx-half&&left<bx+half;
      sp_book(x,B[0],KS.top,1,{deco:cut(B[0]+11,160)});sp_bookTab(x,B[1],KS.top,"ethics",0,40,cut(B[1]+112,80));sp_book(x,B[1],KS.top,2,{deco:cut(B[1]+11,160)});
      sp_bookTab(x,B[2],KS.top,"AI",0,70,cut(B[2]+112,50));sp_book(x,B[2],KS.top,3,{deco:cut(B[2]+11,160)});
      const u=easeCam(clamp((tt-dset)/1.1,0,1));if(u<=0)return;const dy=(1-u)*700,rel=clamp((tt-(dset+1.15))/0.5,0,1),lift=Math.sin(Math.PI*clamp((tt-(P.living-0.3))/2.6,0,1));
      sp_draft(x,{y:-dy,lean:easeCam(clamp((tt-(dset+1.15))/0.6,0,1)),notes:P.notes.map(n=>fin(tt,n-0.15,0.45)),lift});sp_tag(x,clamp((tt-(P.y27-0.25))/1.6,0,1));
      if(rel<1){const hy=KS.top+dy-dh*0.3,o=60*easeCam(clamp(rel*3,0,1)),dn=900*rel*rel;sp_holdHand(x,dx0-o,hy+dn,-1,0.8);sp_holdHand(x,dx0+dw+o,hy+dn,1,0.8);}}}]);
  sp_pill(ctx,t,[[0,"2024"],[tD+0.2,"Europe · 2024"],[tE+0.2,"Now"]],fin(t,0.4,0.6)*(1-fin(t,c.breath,0.4)));});

// ---- 8 · Still at the centre: each era asked the same question; the book grows, governance stays at its centre; today, at a university, a
// new data governance lead is about to meet it ----
scene("centre",(ctx,S,t,sc)=>{const c=sc.cues,P=sp_once(sc,"P",()=>({q:wAt(sc,"because","question"),y80:wAt(sc,"every","nineteen"),y08:wAt(sc,"every","two thousand"),sys:wAt(sc,"every","every"),
    who:wAt(sc,"every","who decides"),dec:wAt(sc,"every","decides"),ans:wAt(sc,"every","answers"),book:wAt(sc,"grows","book"),gov:wAt(sc,"grows","governance"),
    centre:wAt(sc,"grows","centre"),lead:wAt(sc,"today","lead"),same:wAt(sc,"today","same"),end:c.breath+1.3}));
  const bd=c.because-0.2,g2=c.grows-0.45,pick=P.book-0.2,op=P.gov-0.85,cp=c.today-0.45,of=P.lead-1.25;
  gv_shots(ctx,S,t,sc.dur,[
    // the shelf as the last chapter left it, close on the draft (its camera, closed in by its push); back from it to all of it: the editions, the draft leaning on the
    // newest, its tag
    {at:0,place:"shelf24",keys:[[0,1300,560,1.5375],[0.9,1000,540,1.08]],d:2.4,draw:(x,tt,cam)=>sp_shelfAll(x,cam)},
    // a board: the question pinned up, a question mark; a pencil sketch of each time it was asked, pinned above it as it's named, a thread
    // from it to the question; then the question's words, as they're said
    {at:bd,place:"board26",keys:[[bd,960,665,1.3],[c.every-1.2,960,500,1.12]],d:1.6,draw:(x,tt)=>{const w=[P.y80,P.y08,P.sys];
      w.forEach((wi,i)=>sp_sketchSheet(x,i,fin(tt,wi-0.2,0.5)));sp_threads(x,w.map(wi=>clamp((tt-(wi+0.25))/0.6,0,1)));
      sp_question(x,fin(tt,P.q-0.15,0.5),fin(tt,P.dec-0.1,0.4),fin(tt,P.ans-0.15,0.4));}},
    // the shelf again: two hands take the newest copy from it; the draft, its prop gone, settles upright
    {at:g2,place:"shelf24",keys:[[g2,820,540,1.02],[pick+0.6,1040,520,1.2]],d:2.0,draw:(x,tt,cam)=>sp_shelfAll(x,cam,{take:clamp((tt-pick)/1.0,0,1)})},
    // it opens at its wheel: every area in its place round the centre, governance, which lights gold, its spokes running out to each
    {at:op,place:"wheelpage",keys:[[op,960,540,1.04],[op+0.1,960,520,1.0]],d:2.4,draw:(x,tt)=>{const cu=1-clamp((tt-op-0.55)/0.9,0,1);
      if(Math.sin(Math.PI/2*easeCam(cu))<0.86)sp_wheel(x,{area:()=>1,rim:1,centre:fin(tt,P.gov+0.1,0.6),pulse:gv_io(tt,P.centre-0.2,P.centre+1.2,0.4),
        spokes:clamp((tt-P.gov)/0.9,0,1),spokeA:0.9});
      sp_coverClose(x,cu,3);}},
    // the university, in the morning
    {at:cp,place:"campus",keys:[[cp,1200,580,1.2],[of,1300,560,1.3]],d:2.6},
    // Yusuf's office, before he comes: the newest copy is set down on his desk; the shelf of policies; the light under the door, and
    // footsteps
    {at:of,place:"office24",keys:[[of,900,560,1.5],[of+1.8,960,540,1.02]],d:2.0,draw:(x,tt)=>{
      sp_deskBook(x,clamp((tt-of-0.15)/1.0,0,1),fin(tt,of+1.2,0.6));sp_nameCard(x,330,640,"Yusuf Demir","data governance lead",gv_io(tt,P.lead-0.1,P.end-0.3,0.4));
      sp_tagAt(x,tt,Math.max(P.same-0.2,of+3.5),null,1621,290,"34 data policies");sp_doorLight(x,fin(tt,c.breath-0.4,0.8),clamp((tt-c.breath-0.2)/1.4,0,1));}}]);
  sp_pill(ctx,t,[[0,"Today"]],fin(t,0.4,0.6)*(1-fin(t,P.end,0.4)));
  // the end: the title, and the film that comes next
  gv_end(ctx,S,t,P.end,"The same problem, everywhere",null,"Prologue");
  if(t>P.end+1.2)withA(ctx,fin(t,P.end+1.4,0.8),()=>wc_tag(ctx,960,780,"Next: Off the shelf",{align:"center",size:30,w:600}));
  wc_paperOver(ctx,S);});
