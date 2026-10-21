/* ===== Who decides: the ten chapters =====
   Each chapter is a few shots in the places of plan.js and the series' rooms.js, cut together with short dissolves (gv_shots). Times
   inside a chapter come from its cues (when each line starts) and the words of its lines (wAt), so the pictures stay with the voice if
   it's recorded again. Words on screen are on paper, screens, boards, tags and speech bubbles, at least 28 px as seen, and above the
   captions. */

// made once per chapter, the first time it draws: its cues are known by then
const wd_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// a tag that springs in at t0 and goes at t1 (or stays)
function wd_tagAt(ctx,t,t0,t1,x,y,s,o){const a=t1==null?fin(t,t0,0.35):gv_io(t,t0,t1,0.35);if(a<=0.01)return;const k=0.9+0.1*spring(fin(t,t0,0.5));
  ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,a,()=>wc_tag(ctx,0,0,s,Object.assign({align:"center"},o||{})));ctx.restore();}

// ---- 1 · The cord: an engine line in 1960s Japan ----
// The line at a moment, from back to front: the light on the floor, the lamps, the buttons, the cord, the supervisor, the workers, the
// conveyor, the engines. L says what's happening: off (how far the line has moved), lamps, pulls (a hand on the cord, by station),
// press (a button pressed and lit, by post), who[i] (a worker's own pose and place), sup (the supervisor: x, pose, walking), odd (the
// engine that has a part that won't fit: its number, the part, its tilt and lift), light (the sun's place on the floor, 0 to 1).
const WD_E0=WD_LN.x0-140;
const wd_engX=(e,off)=>WD_E0+e*WD_LN.sw+off;
function wd_scene1(ctx,tt,L){const N=WD_LN,y0=wd_feet();
  if(L.light!=null){ctx.save();ctx.globalCompositeOperation="screen";for(let i=0;i<6;i++)wc_glowAt(ctx,-20+i*328+164+(L.light-0.5)*520,700,230,[255,240,206],0.3);ctx.restore();}
  wd_lamps(ctx,L.lamps||[]);
  for(let k=1;k<=N.n;k++){const b=(L.press||{})[k]||[0,0];wd_button(ctx,k,b[0],b[1]);}
  wd_cord(ctx,L.pulls||{});
  if(L.sup)L.sup.draw(ctx);
  for(let i=0;i<N.n;i++){const w=(L.who||{})[i],x=w&&w.x!=null?w.x:wd_stX(i),id="wd_w"+(i+1);
    if(w&&w.po){wd_on(ctx,id,x,w.po,{t:tt,expr:w.expr});continue;}
    // working on the engine in front: both hands on its top, following it, and back to rest between engines
    const e=Math.round((x-WD_E0-L.off)/N.sw),ex=wd_engX(e,L.off),d=ex-x,m=1-sstep(64,104,Math.abs(d)),j=2.5*Math.sin(tt*3.1+i*1.7),top=N.base-136*WD_ES+j;
    const po=wd_hands(id,x,y0,N.s,{base:"stand",L:[x+clamp(d,-70,70)-26,top],R:[x+clamp(d,-70,70)+26,top+2*Math.sin(tt*2.3+i)],extra:{look:1,gaze:[0,1],tilt:0.04}});
    wd_on(ctx,id,x,po,{t:tt,pose:"stand",mix:m});}
  ctx.drawImage(gv_place("lineFront"),0,0,W,H);
  const e0=Math.ceil((-130-WD_E0-L.off)/N.sw),e1=Math.floor((W+130-WD_E0-L.off)/N.sw);
  for(let e=e0;e<=e1;e++){const x=wd_engX(e,L.off),o=L.odd&&L.odd.e===e?L.odd:null;
    if(o&&!o.seated){wd_engine(ctx,x,N.base,o.part==="bracket"?4:6);const [px,py]=o.part==="bracket"?[50,-100]:[-18,-134];wd_part(ctx,o.part,x+px*WD_ES,N.base+py*WD_ES,o.a,o.dy);}
    else wd_engine(ctx,x,N.base,wd_stage(x));}}
// a worker's two hands on a part, pressing it (p 0 to 1); and one hand up on the cord, pulling it down (p 0 to 1)
const wd_onPart=(x,y,id,wx,p,ext)=>wd_hands(id,wx,wd_feet(),WD_LN.s,{base:"stand",L:[x-20,y+10*p],R:[x+18,y-4+10*p],extra:Object.assign({look:1,gaze:[0.1,1],tilt:0.05},ext||{})});
const wd_onCord=(id,wx,hx,p,ext)=>wd_hands(id,wx,wd_feet(),WD_LN.s,{base:"stand",R:[hx,WD_LN.cord+4+44*p],extra:Object.assign({look:0,gaze:[0.3,-1],tilt:-0.03},ext||{})});
// someone on the line whose feet are at y (a walker bobs), cut off at the conveyor's top
function wd_behindAt(ctx,id,x,y,o){ctx.save();ctx.beginPath();ctx.rect(-W,-H,3*W,WD_LN.top+H);ctx.clip();person(ctx,id,x,y,WD_LN.s,o);ctx.restore();}
// the supervisor: at x0 (home, watching the board) until t0, walking to x1, and there in the pose po gives for his place
function wd_supAt(tt,x0,x1,t0,po){const w=gv_walk(tt,t0,x0,x1,250);return{x:w.x,end:w.end,draw:ctx=>{
    if(w.moving)wd_behindAt(ctx,"wd_sup",w.x,wd_feet()-w.bob,{pose:"stand",pose2:w.swing>0?"walkA":"walkB",mix:Math.abs(w.swing),flip:w.flip,t:tt});
    else wd_on(ctx,"wd_sup",w.x,tt<t0?POSE.listen:po(w.x),{t:tt});}};}

scene("cord",(ctx,S,t,sc)=>{const c=sc.cues,N=WD_LN,P=wd_once(sc,"P",()=>{const p={find:wAt(sc,"cord","finds"),pull:wAt(sc,"cord","pulls")+0.1,btn:wAt(sc,"cord","presses"),
      lamp:c.lamp,sup:wAt(sc,"lamp","supervisor")-0.5,help:wAt(sc,"lamp","help"),s6:c.stops-0.5,stop:wAt(sc,"stops","stops"),
      team:wAt(sc,"stops","team"),did:c.did-0.4,reach:c.reach-0.4,within:wAt(sc,"reach","within"),decide:wAt(sc,"reach","someone"),data:c.data-0.4,title:c.breath+0.7};
    p.seat=Math.min(p.help+1.0,c.stops-1.4);p.fixed6=c.did-1.2;
    // the first shot: the line at 12 px a second; the engine at station 4 is 70 px short of its worker when he finds the problem
    const v=12;p.off1=t_=>wd_run(t_,v)+(wd_stX(3)-70-wd_engX(4,0)-wd_run(p.find,v));
    // station 6: its engine's front reaches the white line at the station's end as the line stops
    const xb=N.x0+6*N.sw,st3=[[p.stop-p.s6,p.fixed6+0.3-p.s6]];p.off3=t_=>wd_run(t_-p.s6,v,st3)+(xb-82-wd_engX(6,0)-wd_run(p.stop-p.s6,v,st3));
    // every worker could: faster, the day passing, one stop
    p.off4=t_=>wd_run(t_-p.did,46,[[1.9,2.9]])+37;p.off5=t_=>wd_run(t_-p.reach,12)+90;p.off6=t_=>wd_run(t_-p.data,12)+150;return p;});
  const lampsOff=()=>[...Array(N.n)].map(()=>["off",0]);
  gv_shots(ctx,S,t,sc.dur,[
    // the hall: the line moves on, past the row of workers, the supervisor at its end watching the board. At station 4 the bracket
    // won't seat: two tries, then the cord; the lamp lights above; the button on the post glows as the voice names it; the board,
    // close; the supervisor comes at once, behind the line, and they seat it together
    {at:0,place:"line",keys:[[0,960,540,1],[P.find-1.6,856,535,1.5],[P.lamp-0.2,wd_stX(3),300,2.3],[P.sup-0.1,1150,520,1.25],[P.help-0.7,960,560,1.55]],d:1.7,push:0.02,draw:(x,tt)=>{
      const off=P.off1(tt),pulled=clamp((tt-P.pull)/0.4,0,1),lit=fin(tt,P.pull+0.32,0.2),seat=fin(tt,P.seat,0.3),dark=1-fin(tt,P.seat+0.25,0.4),
        ex=wd_engX(4,off),wx=wd_stX(3)+clamp((ex-wd_stX(3))*0.5,-30,24),
        prs=Math.max(...[P.find-0.15,P.find+0.75].map(a=>{const u=(tt-a)/0.7;return u<=0||u>=1?0:Math.sin(Math.PI*u);})),
        a=lerp(lerp(-0.42,-0.1,prs),0,seat),dy=lerp(lerp(9,3,prs),0,seat),bx=ex+50*WD_ES,by=N.base-150*WD_ES,lamps=lampsOff();lamps[3]=["amber",lit*dark];
      // he pulls the cord after the second try, then holds the bracket till help comes
      const up=gv_io(tt,P.pull-0.35,P.pull+1.1,0.35),press=tt>P.pull+0.8&&tt<P.seat+0.4?0.45+0.4*seat:prs,
        po=wd_onPart(bx,by,"wd_w4",wx,press),who={3:{x:wx,po:up>0?blendPose(po,wd_onCord("wd_w4",wx,wx+70,pulled),up):po,expr:tt>P.find&&tt<P.seat?"concerned":"calm"}};
      const sp=wd_supAt(tt,N.sup,wx+84,P.sup,sx=>wd_onPart(bx+8,by,"wd_sup",sx,0.4+0.6*seat));
      wd_scene1(x,tt,{off,lamps,pulls:{3:up>0?[wx+70,N.cord+4+44*pulled*up]:null},who,sup:sp,odd:{e:4,part:"bracket",a,dy,seated:tt>=P.seat+0.3}});
      const g=gv_io(tt,P.btn-0.1,P.btn+1.6,0.35);if(g>0.01){x.save();x.globalCompositeOperation="screen";wc_glowAt(x,N.x0+4*N.sw,N.cord+171,60,[255,236,170],0.75*g);x.restore();}}},
    // station 6: the worker presses his button, the supervisor comes, the engine reaches the line at the station's end: the lamp turns
    // red and the line stops; the team fixes it together
    {at:P.s6,place:"line",keys:[[P.s6,1240,500,1.5],[P.stop-0.5,1010,520,1.12],[P.team-0.2,1260,540,1.45]],d:1.6,push:0.01,draw:(x,tt)=>{
      const off=P.off3(tt),i6=5,wx=wd_stX(i6),ex=wd_engX(6,off),press=gv_io(tt,P.s6+0.2,P.s6+1.0,0.25),lit=fin(tt,P.s6+0.55,0.2),
        red=fin(tt,P.stop,0.25),fixed=fin(tt,P.fixed6,0.35),lamps=lampsOff();lamps[5]=[red>0.5?"red":"amber",lit*(1-fixed)];
      const cx=ex-18*WD_ES,cy=N.base-168*WD_ES,tryp=(Math.sin((tt-P.s6)*4.2)*0.5+0.5)*(1-fixed),ca=lerp(-0.36+0.08*tryp,0,fixed),cdy=lerp(8,0,fixed),
        work=wd_onPart(cx,cy,"wd_w6",wx,tryp),
        who={5:{x:wx,po:press>0?blendPose(work,wd_hands("wd_w6",wx,wd_feet(),N.s,{base:"stand",R:[N.x0+6*N.sw-4,N.cord+171],extra:{gaze:[0.6,0.3],turn:0.2}}),press):work,expr:"concerned"}};
      // the team: the workers either side step over to help
      const tm=fin(tt,P.team,0.9);if(tm>0){const x5=lerp(wd_stX(4),wx-96,tm),x7=lerp(wd_stX(6),wx+100,tm);
        who[4]={x:x5,po:wd_onPart(cx-14,cy+8,"wd_w5",x5,tryp*0.5,{tilt:0.08})};who[6]={x:x7,po:wd_onPart(cx+14,cy+8,"wd_w7",x7,tryp*0.5,{tilt:-0.02})};}
      const sp=wd_supAt(tt,wd_stX(3)+92,wx+70,P.s6+0.4,sx=>wd_onPart(cx+22,cy+4,"wd_sup",sx,tryp));
      wd_scene1(x,tt,{off,lamps,press:{6:[press,lit*(1-fixed)]},who,sup:sp,odd:{e:6,part:"carb",a:ca,dy:cdy,seated:fixed>=1}});
      const g=gv_io(tt,P.stop-0.4,P.team,0.3);if(g>0.01){const lx=N.x0+6*N.sw;x.save();x.globalCompositeOperation="screen";x.filter="blur(6px)";x.fillStyle=rgba([255,250,226],0.7*g);x.fillRect(lx-12,N.top+30,24,110);x.restore();}}},
    // every worker could, and they did: the day passes, lamps light and go dark, and once more one turns red
    {at:P.did,place:"line",keys:[[P.did,960,540,1],[P.reach,960,530,1.04]],d:2,push:0,draw:(x,tt)=>{const u=tt-P.did,off=P.off4(tt),lamps=lampsOff(),pulls={},who={};
      [[1,0.3,1.4],[6,0.9,2.0],[4,1.4,2.9,1.9],[2,3.0,3.9]].forEach(([i,a,b,r])=>{const l=gv_io(u,a,b,0.2);if(l>0)lamps[i]=[r!=null&&u>=r?"red":"amber",l];
        const up=gv_io(u,a-0.45,a+0.3,0.2);if(up>0){const wx=wd_stX(i),pl=clamp((u-a+0.2)/0.3,0,1);who[i]={po:blendPose(POSE.stand,wd_onCord("wd_w"+(i+1),wx,wx+66,pl),up)};pulls[i]=[wx+66,N.cord+4+44*pl*up];}});
      const sp=wd_supAt(u,N.sup,wd_stX(4)+92,1.0,sx=>POSE.listen);
      wd_scene1(x,tt,{off,lamps,pulls,who,sup:sp,light:clamp(u/(P.reach-P.did),0,1)});}},
    // within reach: a hand on the cord; and someone who could decide, coming at once
    {at:P.reach,place:"line",keys:[[P.reach,520,580,2.1],[P.decide-0.3,760,540,1.35]],d:1.7,push:0.01,draw:(x,tt)=>{const off=P.off5(tt),i=1,wx=wd_stX(i),
        up=gv_io(tt,P.within-0.4,P.within+1.4,0.45),pull=clamp((tt-P.within-0.15)/0.35,0,1),lamps=lampsOff();lamps[1]=["amber",fin(tt,P.within+0.3,0.2)];
      const sp=wd_supAt(tt,1300,wx+92,P.decide-1.2,sx=>POSE.listen);
      wd_scene1(x,tt,{off,lamps,pulls:up>0?{1:[wx+66,N.cord+4+44*pull*up]}:{},who:{1:{po:blendPose(POSE.stand,wd_onCord("wd_w2",wx,wx+66,pull),up)}},sup:sp});}},
    // a right to decide about data needs the same: the hall again, quiet, the lamps dark, the line moving
    {at:P.data,place:"line",keys:[[P.data,960,540,1],[sc.dur,960,540,1.05]],d:2,push:0,draw:(x,tt)=>{
      const sp=wd_supAt(tt,N.sup,N.sup,1e9,sx=>POSE.listen);wd_scene1(x,tt,{off:P.off6(tt),lamps:lampsOff(),sup:sp,light:0.9});}}]);
  wd_pill(ctx,t,"Japan · 1960s",fin(t,0.6,0.5)*(1-fin(t,P.title-0.6,0.4)));
  gv_title(ctx,S,t,P.title,"Who decides","owners in the work, asked by name","Film 2 of 19 · data governance");
  wc_paperOver(ctx,S);});
// the place and the decade in the top corner
function wd_pill(ctx,t,s,a){if(a>0.01)wc_year(ctx,56,72,s,a);}

// ---- 2 · To be confirmed: the binder Who decides, its register, and a thread of twenty-three replies ----
scene("tbc",(ctx,S,t,sc)=>{const c=sc.cues,P=wd_once(sc,"P",()=>({desk:c.says-0.9,open:c.says+0.1,every:wAt(sc,"says","every"),
    stu:wAt(sc,"says","students"),cou:wAt(sc,"says","courses"),reg:c.register-0.5,eight:wAt(sc,"register","eight"),three:wAt(sc,"register","Three"),half:wAt(sc,"register","half"),
    mail:c.email-0.4,hl:wAt(sc,"thread","award"),open2:wAt(sc,"thread","thread")+0.1,none:wAt(sc,"thread","Nobody")}));
  gv_shots(ctx,S,t,sc.dur,[
    // his office: Yusuf at his desk, the binder he took off the shelf held up in front of him
    {at:0,place:"office",keys:[[0,1000,500,1.15],[1.2,990,560,1.6]],d:2.4,draw:(x,tt)=>{
      gv_behind(x,"yusuf",1000,GV_OFF.desk[1],0.8,{pose:"hold",t:tt,carry:wd_heldTitled(["Who","decides"],WD_B2),gaze:[0,0.4]});x.drawImage(gv_place("officeDesk"),0,0,W,H);}},
    // his desk from above: the binder, its cover, then open: policy 2 and its first line, then the register, and "TBC", one by one
    {at:P.desk,place:"deskTop",keys:[[P.desk,1085,520,1.15],[P.open+0.7,640,500,1.32],[P.reg,1310,540,1.28]],d:1.8,push:0.015,draw:(x,tt)=>{const u=clamp((tt-P.open)/1.1,0,1);
      wd_binder2(x,easeCam(u),q=>wd_policy2(q,1,fin(tt,P.every,0.6)),q=>wd_register(q,1,k=>k<3?fin(tt,P.three+0.45*k,0.6):fin(tt,P.half+0.4*(k-3),0.6)));
      wd_tagAt(x,tt,P.stu-0.1,null,320,wd_pageTop()+566,"students",{size:30});wd_tagAt(x,tt,P.cou-0.1,null,540,wd_pageTop()+566,"courses",{size:30});
      // the eight domains, counted down the register as the voice says how many
      for(let i=0;i<8;i++){const g=gv_io(tt,P.eight+0.08*i,P.eight+0.8+0.08*i,0.2);if(g>0.01)gv_tint(x,WD_RG.x()-14,WD_RG.y0()+i*WD_RG.dy-38,190,54,GV.gold,0.5*g);}}},
    // his screen: the inbox, the thread about award with its twenty-three replies; it opens on four questions, and no decision
    {at:P.mail,place:"screenGov",keys:[[P.mail,960,440,1.02],[P.open2,960,420,1.08]],d:2.2,push:0.01,draw:(x,tt)=>{
      wd_inbox(x,{hl:fin(tt,P.hl,0.5),open:fin(tt,P.open2,0.5),msg:i=>fin(tt,P.open2+0.4+0.55*i,0.4),none:fin(tt,P.none,0.5)});}}]);
  wd_pill(ctx,t,"Today",fin(t,0.4,0.5)*(1-fin(t,P.desk-0.3,0.3)));
  wc_paperOver(ctx,S);});

// ---- 3 · Already written: the data team's map names every domain's owner, and so does every model other teams read ----
// the floor: the people at work behind the glass, then the glass, then the offices' names (a name the frame would cut fades out)
const WD_AT={clara:0,mei:1,jun:3,sam:4},WD_WORK={clara:{pose:"reach"},mei:{pose:"hold",carry:heldNotebook},jun:{pose:"reach"},sam:{pose:"phone"}};
function wd_floor(x,tt,o){o=o||{};const F=GV_FL;Object.keys(WD_AT).forEach(id=>{const i=WD_AT[id];
    person(x,id,F.spot(i),806,0.5,Object.assign({pose:"stand",t:tt,flip:i%2===1},WD_WORK[id],(o.pose||{})[id]||{}));});
  gv_floorGlass(x);const m=x.getTransform(),vl=-m.e/m.a,vr=(x.canvas.width-m.e)/m.a;
  F.rooms.forEach((r,i)=>{const cx=F.x(i)+F.w/2,hw=tw(x,r[1],30,800)/2+6;gv_floorName(x,i,clamp(Math.min(cx-hw-vl,vr-cx-hw)/30,0,1));});}
// someone walking with a notebook held in both hands: the arms stay, the legs step
POSE.wd_carry=Object.assign({},POSE.hold,{gaze:[0.3,0.1],turn:0.06,look:0});
POSE.wd_carryA=Object.assign({},POSE.wd_carry,{feet:14,shift:-5,tilt:0.03});POSE.wd_carryB=Object.assign({},POSE.wd_carryA,{shift:5,tilt:-0.03});
function wd_carrier(x,id,w,y,s,carry,o){person(x,id,w.x,y-w.bob,s,Object.assign({pose:"wd_carry",pose2:w.moving?(w.swing>0?"wd_carryA":"wd_carryB"):null,mix:Math.abs(w.swing),flip:w.flip,carry},o||{}));}
// a speech bubble that springs in at t0 and goes at t1
function wd_say(x,tt,t0,t1,bx,by,lines,tx,ty){gv_say(x,bx,by,lines,tx,ty,{a:gv_io(tt,t0,t1,0.35),k:0.92+0.08*spring(fin(tt,t0,0.5)),size:34});}
scene("written",(ctx,S,t,sc)=>{const c=sc.cues,P=wd_once(sc,"P",()=>({who:wAt(sc,"asks","who"),noor:wAt(sc,"map","Noor"),open:wAt(sc,"map","opens")-0.2,
    every:wAt(sc,"map","Every"),mod:c.models-0.35,evm:wAt(sc,"models","every"),aw:wAt(sc,"models","award's"),mei:wAt(sc,"models","Mei"),
    built:c.built-0.35,bec:wAt(sc,"built","because"),fl:c.confirm-0.35,reg:sc.ends.confirm+0.15}));
  const owners=[2,4,6,8,10,12,14,16];
  gv_shots(ctx,S,t,sc.dur,[
    // the data team's room: Yusuf comes in and asks Jun and Noor who they ask; Noor answers by showing him
    {at:0,place:"data",keys:[[0,1100,520,1.12],[2.2,1080,515,1.16]],d:3,draw:(x,tt)=>{const wk=gv_walk(tt,0.2,330,830,230),up=fin(tt,wk.end-0.8,0.6);
      person(x,"jun",1600,905,0.8,{pose:"reach",pose2:"listen",mix:up,t:tt,flip:true});
      person(x,"noor",1290,905,0.8,{pose:"stand",pose2:"listen",mix:up,t:tt,flip:true,...(tt>P.noor?{pose:"listen",pose2:"explain",mix:fin(tt,P.noor,0.5)}:{})});
      wd_carrier(x,"yusuf",wk,905,0.8,heldNotebook,{t:tt});
      wd_say(x,tt,P.who-0.2,P.noor-0.2,470,170,["Who do you ask, when","a meaning isn't clear?"],850,440);}},
    // the screen: their map of the university's domains, as the data team keeps it; under each domain, its owner, lit one by one
    {at:P.open,place:"screenData",keys:[[P.open,960,440,1.02],[P.every-0.4,960,450,1.06]],d:2.4,push:0.01,draw:(x,tt)=>{
      wd_file(x,"models/_shared/_shared__conceptual.yml",WD_MAP,{show:fin(tt,P.open+0.25,0.7),lit:i=>{const k=owners.indexOf(i);return k<0?0:fin(tt,P.every+0.22*k,0.4);}});}},
    // and the course domain's model of the award, which other teams read: its owner, Mei Tanaka
    {at:P.mod,place:"screenData",keys:[[P.mod,960,440,1.04],[P.aw-0.5,880,470,1.18]],d:2.2,push:0.01,draw:(x,tt)=>{
      wd_file(x,"models/core/course/_core_course__models.yml",WD_MODEL,{show:fin(tt,P.mod+0.15,0.5),lit:i=>i===10?fin(tt,P.evm,0.5):0});
      const cw=tw(x,"m",28,500,"mono");wd_tagAt(x,tt,P.mei-0.1,null,GV_SC[0]+100+8*cw,wd_lineY(12)+78,"Mei Tanaka · registrar's office",{align:"left",size:32,wash:GV.gold,washA:0.5});}},
    // the room again: why they wrote it down
    {at:P.built,place:"data",keys:[[P.built,1080,520,1.14],[P.built+0.1,1080,515,1.17]],d:3,draw:(x,tt)=>{
      person(x,"jun",1600,905,0.8,{pose:"explain",expr:"smile",t:tt,flip:true});person(x,"noor",1290,905,0.8,{pose:"listen",t:tt,flip:true});
      person(x,"yusuf",830,905,0.8,{pose:"write",carry:heldNotebook,t:tt});
      wd_say(x,tt,P.bec-0.1,sc.dur,1250,190,["We needed someone","to ask."],1590,440);}},
    // the floor: Yusuf takes each name to its office, and a gold tick goes up on its glass
    {at:P.fl,place:"floor",keys:[[P.fl,1000,540,1.08],[P.fl+0.3,800,545,1.1]],d:3.2,draw:(x,tt)=>{const F=GV_FL,wk=gv_walk(tt,P.fl+0.1,F.x(3)+40,F.x(1)+F.w/2+70,280);
      // he stops at the registrar's office, where Mei nods, and the tick goes up on its glass; then on Planning's, the next along
      wd_floor(x,tt,{pose:{mei:{pose:"listen",nod:0.05*Math.sin(tt*3)*gv_io(tt,wk.end-0.6,wk.end+1.0,0.3)},clara:{pose:"listen"}}});
      wd_carrier(x,"yusuf",wk,F.walk,0.62,heldNotebook,{t:tt});wd_glassTick(x,1,fin(tt,wk.end-0.1,0.6));wd_glassTick(x,0,fin(tt,wk.end+0.7,0.6));}},
    // the register, close: a gold tick by each owner, the owners still to be confirmed struck through, and his note: they're in the map
    {at:P.reg,place:"deskTop",keys:[[P.reg,1330,520,1.3]],push:0.015,draw:(x,tt)=>{const tick=i=>fin(tt,P.reg+0.3+0.12*i,0.35);
      wd_binder2(x,1,q=>wd_policy2(q,1,0),q=>wd_register(q,1,()=>1,tick,{strike:i=>fin(tt,P.reg+0.35+0.12*i,0.35),note:fin(tt,P.reg+0.9,1.2)}));}}]);
  wc_paperOver(ctx,S);});

// ---- 4 · Three roles: the owner and the steward (both Mei), and the custodian (Sam's team) ----
// where the role cards go: three blank ones on Yusuf's board; then beside Mei at her desk, and beside Sam's screens
const WD_BOARD3=[[300,330],[760,330],[1220,330]],WD_CARD=[400,180],WD_MEI=[[712,236],[712,446]],WD_SAMC=[300,96];
scene("roles",(ctx,S,t,sc)=>{const c=sc.cues,P=wd_once(sc,"P",()=>({three:wAt(sc,"sorts","three"),names:wAt(sc,"sorts","whatever"),
    ow:c.owner-0.3,owc:wAt(sc,"owner","owner"),meid:wAt(sc,"owner","Mei"),stc:wAt(sc,"steward","steward"),log:wAt(sc,"steward","Mei")-0.3,
    same:wAt(sc,"steward","same"),why:wAt(sc,"steward","why"),both:c.both-0.3,bth:wAt(sc,"both","both"),cu:c.custodian-0.3,
    cuc:wAt(sc,"custodian","custodian"),tab:wAt(sc,"custodian","table"),dsn:wAt(sc,"custodian","doesn't")}));
  const [cw,ch]=WD_CARD;
  // Mei at her desk, and her two cards (np: how far her name is written on them)
  const mei=(x,tt,np,lit)=>{gv_behind(x,"mei",GV_RX.seat[0],GV_RX.top,GV_RX.seat[1],{pose:"stand",t:tt,gaze:[0.5,0.1]});x.drawImage(gv_place("regDesk"),0,0,W,H);wd_glossMini(x,lit);
    wd_drop(x,fin(tt,P.owc,0.6),()=>wd_roleCard(x,WD_MEI[0][0],WD_MEI[0][1],cw,ch,"owner","answers for what it means",{wash:GV.gold,name:"Mei Tanaka",np}));
    wd_drop(x,fin(tt,P.stc,0.6),()=>wd_roleCard(x,WD_MEI[1][0],WD_MEI[1][1],cw,ch,"steward","keeps it right, day to day",{wash:GV.gold,name:"Mei Tanaka",np}));};
  gv_shots(ctx,S,t,sc.dur,[
    // Yusuf's board: three blank cards, one for each role; the names vary from one policy to the next
    {at:0,place:"boardGov",keys:[[0,960,500,1],[0.4,960,490,1.06]],d:4,push:0.01,draw:(x,tt)=>{
      ["owner","steward","custodian"].forEach((hd,k)=>wd_drop(x,fin(tt,P.three+0.3*k,0.5),()=>{const [bx,by]=WD_BOARD3[k];wc_panel(x,bx,by,cw,ch,{kind:"card",seed:80+k});
        wc_T(x,hd,bx+cw/2,by+ch/2+18,{w:800,size:52,align:"center",col:WC_DARK});gv_pin(x,bx+cw/2,by+14,GV.red,1.2);}));
      wc_hand(x,"the names vary from one policy to the next",960,640,{p:fin(tt,P.names,1.4),size:36,col:WC_DARK,align:"center"});}},
    // the registrar's office: Mei at her desk; she owns award, and she keeps it right
    {at:P.ow,place:"regClose",keys:[[P.ow,960,540,1],[P.ow+0.2,920,520,1.08]],d:4,push:0.012,draw:(x,tt)=>mei(x,tt,0,fin(tt,P.meid,0.5))},
    // her screen, close: her log of identity decisions: same learner or not, decided by her, and why
    {at:P.log,place:"screenReg",keys:[[P.log,960,450,1.08],[P.why-0.6,1080,460,1.14]],d:2.2,push:0.008,draw:(x,tt)=>{
      wd_log(x,{lit:[0,fin(tt,P.same,0.5),fin(tt,P.log+0.4,0.5),0,fin(tt,P.why,0.5)],rows:i=>fin(tt,P.log+0.15+0.12*i,0.4)});}},
    // her desk again: one person, both roles
    {at:P.both,place:"regClose",keys:[[P.both,920,520,1.08],[P.both+0.1,900,510,1.12]],d:3,push:0.01,draw:(x,tt)=>mei(x,tt,fin(tt,P.bth-0.2,0.9),1)},
    // the platform team: Sam's desk, the platform's tables; he can change any of them, but what award means is Mei's
    {at:P.cu,place:"platClose",keys:[[P.cu,960,540,1],[P.cu+0.2,1000,520,1.08]],d:4,push:0.012,draw:(x,tt)=>{
      gv_behind(x,"sam",GV_PX.seat[0],GV_PX.top,GV_PX.seat[1],{pose:"reach",flip:true,t:tt});x.drawImage(gv_place("platDesk"),0,0,W,H);wd_platScreens(x,fin(tt,P.tab,0.5));
      wd_drop(x,fin(tt,P.cuc,0.6),()=>wd_roleCard(x,WD_SAMC[0],WD_SAMC[1],cw+60,ch,"custodian","runs the platform",{wash:[64,170,210],washA:0.3,name:"Sam's team",np:fin(tt,P.cuc+0.6,0.8),nameCol:GV.cyanInk}));
      wd_say(x,tt,P.dsn,sc.dur,1110,236,["What award means?","Ask Mei."],1528,408);}}]);
  wc_paperOver(ctx,S);});

// ---- 5 · Who decides what: each domain its own words; governance a few shared rules; the council conflicts and exceptions ----
// the council round the stewards' table, facing Yusuf at the board (look: 0 to 1, turning to the door on the right)
const WD_COUNCIL=["mei","clara","anil","noor","sam"];
POSE.wd_lookBack=Object.assign({},POSE.listen,{gaze:[-0.7,0.05],turn:-0.08,tilt:-0.03});
// Yusuf at the stewards' board, pointing up at what he has written there
function wd_atBoard(x,tt){const [sx,sy]=GV_MT.stand,s=GV_MT.s;POSE.wd_now=wd_hands("yusuf",sx,sy,s,{base:"point",R:[322,404],extra:{gaze:[0.3,-0.6],turn:0.1,hand:null}});
  person(x,"yusuf",sx,sy,s,{t:tt,pose:"wd_now",carry:wd_heldMarker});}
// a marker held in the right hand, its cap off, writing
function wd_heldMarker(cx,P_,hands){const r=hands[1];cx.save();cx.translate(r[0],r[1]);cx.rotate(-0.7);cx.fillStyle="rgba(40,44,54,1)";rr(cx,-7,-58,14,52,4);cx.fill();
  cx.fillStyle=rgba(WD_MARK,1);rr(cx,-7,-70,14,14,3);cx.fill();cx.restore();fingers(cx,P_,[r]);}
function wd_council(x,tt,look){WD_COUNCIL.forEach((id,i)=>gv_behind(x,id,GV_MT.seats[i],GV_MT.top,GV_MT.s,{pose:"listen",pose2:"wd_lookBack",mix:look||0,t:tt,flip:true}));
  x.drawImage(gv_place("meetTable"),0,0,W,H);}
scene("domains",(ctx,S,t,sc)=>{const c=sc.cues,P=wd_once(sc,"P",()=>({own:wAt(sc,"own","own"),gov:wAt(sc,"shared","Governance"),glo:wAt(sc,"shared","glossary"),
    cla:wAt(sc,"shared","classify"),mt:c.council-0.3,wb:wAt(sc,"council","council")-0.35,cdec:wAt(sc,"council","decides"),next:wAt(sc,"council","next"),
    lim:c.limit,dvc:wAt(sc,"limit","deputy"),door:sc.ends.limit-0.2,rest:c.rest-0.3,ow:wAt(sc,"rest","owner")}));
  // the board: the eight domains, their gold dots, the band of shared rules; glow: the domains lit as the owner decides the rest
  const board=(x,tt,glow)=>{wd_band(x,fin(tt,P.gov,0.5),fin(tt,P.glo-0.2,0.5),fin(tt,P.cla-0.3,0.5));
    for(let i=0;i<8;i++)wd_drop(x,fin(tt,0.1+0.08*i,0.45),()=>wd_domCard(x,i,fin(tt,P.own+0.09*i,0.4),glow?fin(tt,P.ow+0.07*i,0.5):0));};
  // what's written on the meeting room's board, small: the close-up reads it
  const [mbx,mby,mbw]=GV_MT.board,rule=(x,tt)=>wd_councilRule(x,[fin(tt,P.wb-1.2,2.0),fin(tt,P.cdec,0.8),fin(tt,P.next-0.1,0.8),fin(tt,P.dvc-0.5,0.6),fin(tt,P.dvc,0.9)],mbx-6,mby-14,mbw/WD_MB[2],true);
  gv_shots(ctx,S,t,sc.dur,[
    // Yusuf's board: each domain, with its owner, decides what its own words mean; over them, the few rules every domain shares
    {at:0,place:"boardGov",keys:[[0,960,520,1],[P.gov-0.6,960,480,1.04]],d:3,push:0.008,draw:(x,tt)=>board(x,tt,false)},
    // the stewards' meeting room: the council round the table, Yusuf at the board
    {at:P.mt,place:"meeting",keys:[[P.mt,900,520,1.08],[P.mt+0.1,880,515,1.12]],d:4,draw:(x,tt)=>{rule(x,tt);wd_atBoard(x,tt);wd_council(x,tt,0);}},
    // the board, close: what Yusuf writes
    {at:P.wb,place:"meetBoard",keys:[[P.wb,800,450,1.2],[P.wb+0.2,780,440,1.26]],d:4,push:0.01,draw:(x,tt)=>
      wd_councilRule(x,[fin(tt,P.wb-1.2,2.0),fin(tt,P.cdec,0.8),fin(tt,P.next-0.1,0.8),fin(tt,P.dvc-0.5,0.6),fin(tt,P.dvc,0.9)],WD_MB[0],WD_MB[1],1,false)},
    // the room again: the deputy vice-chancellor at the door, and the council turns to him
    {at:P.door,place:"meeting",keys:[[P.door,1300,520,1.25],[P.door+0.1,1310,515,1.28]],d:3,draw:(x,tt)=>{rule(x,tt);const w=gv_walk(tt,P.door+0.1,1900,1750,200);
      wd_atBoard(x,tt);wd_council(x,tt,fin(tt,P.door+0.3,0.6));
      gv_walker(x,"david",w,905,GV_MT.s,{t:tt,flip:true});wd_tagAt(x,tt,P.door+0.5,null,1640,392,"deputy vice-chancellor",{size:30});}},
    // the board again: everything else, the owner decides, where the work is
    {at:P.rest,place:"boardGov",keys:[[P.rest,960,520,1.02],[P.rest+0.1,960,540,1.06]],d:3,push:0.008,draw:(x,tt)=>board(x,tt,true)}]);
  wc_paperOver(ctx,S);});

// ---- 6 · Required: every change is checked for its owners; the council's oldest action closes ----
// Noor pins the card to the team's board (k: 0 to 1, her reach; drop: how far the card has come down), Yusuf beside her, looking up
// at it; Jun turns from his screen to look (look: 0 to 1)
POSE.wd_upLeft=Object.assign({},POSE.listen,{gaze:[0.6,-0.45],turn:0.06});
function wd_pinning(x,tt,k,drop,look){const C=WD_TC(),s=0.8;
  POSE.wd_now=wd_hands("noor",960,905,s,{base:"listen",flip:true,R:[C.x+C.w-16,C.y+C.h*0.6-50*(1-easeCam(clamp(drop,0,1)))],extra:{gaze:[0.5,-0.35],turn:0.04}});
  person(x,"noor",960,905,s,{t:tt,pose:"listen",pose2:"wd_now",mix:k,flip:true});
  person(x,"yusuf",1190,905,s,{t:tt,pose:"wd_upLeft",expr:"smile",flip:true});
  person(x,"jun",1660,905,s,{t:tt,pose:"wd_lookBack",pose2:"wd_upLeft",mix:look,flip:true});}
scene("required",(ctx,S,t,sc)=>{const c=sc.cues,P=wd_once(sc,"P",()=>({own:wAt(sc,"required","owner"),chg:c.proposed+0.9,bef:wAt(sc,"proposed","before"),
    dom:wAt(sc,"check","domain"),mod:wAt(sc,"check","model"),fail:wAt(sc,"fails","fails"),says:wAt(sc,"fails","says"),what:wAt(sc,"fails","what"),
    where:wAt(sc,"fails","where"),fix:sc.ends.fails+0.3,min:c.closed-0.3,cl:wAt(sc,"closed","closed")}));
  gv_shots(ctx,S,t,sc.dur,[
    // the data team's room: Noor pins a gold card to the team's board, Yusuf beside her, and Jun looks round from his desk
    {at:0,place:"data",keys:[[0,1060,520,1.12],[0.4,980,520,1.2]],d:3.2,draw:(x,tt)=>{const drop=fin(tt,P.own-0.25,0.6);wd_teamCard(x,drop);
      wd_pinning(x,tt,gv_io(tt,P.own-0.9,P.chg,0.6),drop,fin(tt,P.own,0.8));}},
    // Jun's screen: a change proposed for review, grey until it's reviewed; the governance check runs, stops on the marts, and says
    // what to add and where; Jun adds the two lines, and it passes
    {at:P.chg,place:"screenData",keys:[[P.chg,960,430,1.08],[P.says-0.6,910,520,1.18]],d:2.2,push:0.004,draw:(x,tt)=>{
      wd_change(x,tt,{before:gv_io(tt,P.bef-0.1,c.check+0.3,0.4),checks:fin(tt,c.check-0.1,0.5),dom:fin(tt,P.dom+0.15,0.3),core:fin(tt,P.mod+0.15,0.3),
        fail:fin(tt,P.fail,0.3),msg:fin(tt,P.says-0.1,0.4),what:fin(tt,P.what,0.4),where:fin(tt,P.where,0.4),fix:fin(tt,P.fix,1.2),rerun:fin(tt,P.fix+1.2,0.7)});}},
    // the desk from above: the council's minutes; the action carried forward month after month, closed at last
    {at:P.min,place:"deskTop",keys:[[P.min,960,540,1],[P.min+0.2,1050,590,1.1]],d:3.2,push:0.01,draw:(x,tt)=>wd_minutes(x,tt,1,fin(tt,P.cl-0.05,0.5))}]);
  wc_paperOver(ctx,S);});

// ---- the chapters still to draw: a plain page with the chapter's name, so the film runs end to end ----
["asked","logged","time","which"].forEach(id=>scene(id,(ctx,S,t,sc)=>{setScreen(ctx,S);ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_T(ctx,sc.name,960,520,{w:800,size:64,align:"center",col:WC_MUTED});wc_paperOver(ctx,S);}));

const WC_PLACES={line:wd_paintLine,lineFront:wd_paintLineFront,office:gv_paintOffice,officeDesk:wd_paintOfficeDesk,deskTop:wd_paintDeskTop,
  screenGov:c=>gv_paintScreenDesk(c,GV_ROOM.gov),data:gv_paintData,screenData:c=>gv_paintScreenDesk(c,GV_ROOM.data),floor:gv_paintFloor,
  boardGov:c=>gv_paintBoardClose(c,GV_ROOM.gov),regClose:gv_paintRegistrarClose,regDesk:gv_paintRegistrarDesk,screenReg:c=>gv_paintScreenDesk(c,GV_ROOM.reg),
  platClose:gv_paintPlatformClose,platDesk:gv_paintPlatformDesk,meeting:gv_paintMeeting,meetTable:gv_paintMeetingTable,meetBoard:wd_paintMeetBoard};
