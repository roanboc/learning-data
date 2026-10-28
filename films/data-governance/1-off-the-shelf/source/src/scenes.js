/* ===== Off the shelf: the nine chapters =====
   Each chapter is a few shots in the places of plan.js and the series' rooms.js, cut together with short dissolves (gv_shots). Times
   inside a chapter come from its cues (when each line starts) and the words of its lines (wAt), so the pictures stay with the voice if
   it's recorded again. Words on screen are on paper, screens, boards, tags and speech bubbles, at least 28 px as seen, and above the
   captions. */

// made once per chapter, the first time it draws: its cues are known by then
const os_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// a mallet's blow: 0 (raised) to 1 (down) and back, over d seconds from t0; down at a third of the way
const os_strike=(t,t0,d)=>{const u=(t-t0)/(d||0.6);return u<=0||u>=1?0:u<0.35?easeCam(u/0.35):1-easeCam((u-0.35)/0.65);};
// the year and the place in the top corner: the latest one passed, dissolving from the one before
function os_pill(ctx,t,mk,a){if(a<=0.01)return;let i=0;for(let k=1;k<mk.length;k++)if(t>=mk[k][0])i=k;const u=i>0?fin(t,mk[i][0],0.35):1;
  if(u<1)wc_year(ctx,56,72,mk[i-1][1],a*(1-u));wc_year(ctx,56,72,mk[i][1],a*u);}
// a tag that springs in at t0 and goes at t1 (or stays)
function os_tagAt(ctx,t,t0,t1,x,y,s,o){const a=t1==null?fin(t,t0,0.35):gv_io(t,t0,t1,0.35);if(a<=0.01)return;const k=0.9+0.1*spring(fin(t,t0,0.5));
  ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,a,()=>wc_tag(ctx,0,0,s,Object.assign({align:"center"},o||{})));ctx.restore();}

// ---- 1 · The checklist: the steps everyone knew, often skipped, and what patients paid; then, in 2008, a checklist read aloud in the room ----
// where each of the team stands, [x, feet, size]: the anaesthetist at the table's head, the surgeon and the scrub nurse behind the
// table, and the nurse who has the checklist in front of the door
const OS_TEAM={anaes:[360,890,0.8],surgeon:[930,890,0.8],scrub:[1180,890,0.78],nurse:[1716,936,0.84]};
// the team in the operating room. o gives each one's pose and what they hold ({x:...} moves them, false leaves them out, a function
// draws them its own way); the table, the patient and the trolley are in front of the three behind the table, the nurse in front of all
function os_team(x,tt,o){o=o||{};const one=(id,k,d)=>{const v=o[k];if(v===false)return;if(typeof v==="function")return v(x,tt);
    const [px,py,s]=OS_TEAM[k],q=Object.assign({t:tt},d,v);person(x,id,q.x==null?px:q.x,py,s,q);};
  one("os_anaes","anaes",{pose:"stand"});one("os_surgeon","surgeon",{pose:"os_sterile"});one("os_scrub","scrub",{pose:"os_sterile"});
  os_counts(x,[7,3,9],1);os_orFront(x);os_patientHead(x,tt,o.awake);one("os_nurse","nurse",{pose:"os_read",carry:os_heldClip,flip:true});}
// the nurse walking with a tray, on a gv_walk
function os_trayWalk(x,tt,w){const [,y,s]=OS_TEAM.nurse;person(x,"os_nurse",w.x,y-w.bob,s,{pose:"os_tray",pose2:w.moving?(w.swing>0?"os_trayA":"os_trayB"):null,
  mix:Math.abs(w.swing),flip:w.flip,carry:os_heldTray,t:tt});}
// the steps everyone knew, each a tag by its own thing (the wristband, the antibiotic, the sponges on the trolley), with a pencil line
// to it; a (0 to 1) as it comes in, k (0 to 1) as it's struck through in red pencil
const OS_KNEW=[["the right patient",700,500,[700,596]],["the antibiotic",580,300,[552,534]],["every sponge counted",1450,560,[1506,602]]];
function os_knew(x,i,a,k){if(a<=0.01)return;const [s,tx,ty,[px,py]]=OS_KNEW[i];withA(x,a,()=>{wc_pencil(x,[[tx+(px-tx)*0.2,ty+26],[px,py]],1,{seed:40+i,lw:2.4});
  const w=wc_tag(x,tx,ty,s,{align:"center"});if(k>0)wc_pencil(x,[[tx-w/2-10,ty+6],[tx+w/2+10,ty-4]],k,{col:GV.redInk,lw:5,seed:50+i});});}
// a paper veil over the room but not the patient: the room fades back (a, 0 to 1), and the patient, asleep on the table, stays clear
function os_veil(x,a){if(a<=0.01)return;x.save();x.translate(600,600);x.scale(1,0.5);const g=x.createRadialGradient(0,0,200,0,0,640);
  g.addColorStop(0,rgba(WC_PAPER,0));g.addColorStop(1,rgba(WC_PAPER,0.55*a));x.fillStyle=g;x.fillRect(-2400,-2400,4800,4800);x.restore();}
// the checklist's three pauses across the top, joined by a pencil line: each lights gold as it's named; keep stays lit
const OS_PAUSES=[["Sign in",560],["Time out",960],["Sign out",1360]];
function os_pauses(x,tt,t0,keep,a){if(a<=0.01)return;withA(x,a,()=>{wc_pencil(x,[[600,92],[1320,92]],fin(tt,t0-0.2,0.8),{seed:60,lw:2.4});
  OS_PAUSES.forEach(([s,px],i)=>{const t1=t0+0.62*i,on=fin(tt,t1,0.3),lit=i===keep?on:on*(1-fin(tt,t1+0.7,0.4));os_tagAt(x,tt,t1-0.2,null,px,92,s,{size:32});
    if(lit>0.01)withA(x,lit,()=>os_tagAt(x,tt,t1-0.2,null,px,92,s,{size:32,wash:GV.gold,washA:0.55}));});});}
// the study's result on a card: deaths after surgery, in every 100 patients, before the checklist and with it; each bar grows in turn
function os_result(x,u1,u2,a){if(a<=0.01)return;const cx=960,top=150,w=820,h=640,base=top+h-120,unit=200;withA(x,a,()=>{
  wc_panel(x,cx-w/2,top,w,h,{kind:"card",seed:77});wc_T(x,"Deaths after surgery",cx,top+80,{w:800,size:46,align:"center",col:WC_DARK});
  wc_T(x,"in every 100 patients",cx,top+128,{w:500,size:30,align:"center",col:WC_MUTED});
  [[1.5,"1.5","before",GV_PAST,u1,-170],[0.8,"0.8","with the checklist",GV.green,u2,170]].forEach(([v,s,l,col,u,dx])=>{const e=easeCam(clamp(u,0,1)),bh=v*unit;
    if(e>0){x.save();x.beginPath();x.rect(cx+dx-90,base-bh*e,180,bh*e+2);x.clip();wc_flat(x,wc_rect(cx+dx-74,base-bh,148,bh),col,1,"bar");x.restore();}
    withA(x,clamp(u*2-0.6,0,1),()=>wc_T(x,s,cx+dx,base-bh*e-26,{w:800,size:60,align:"center",col:WC_DARK}));wc_T(x,l,cx+dx,base+52,{w:600,size:32,align:"center",col:WC_INK});});
  wc_pencil(x,[[cx-320,base],[cx+320,base]],1,{seed:78,lw:3});});}

scene("checklist",(ctx,S,t,sc)=>{const c=sc.cues,P=os_once(sc,"P",()=>({right:wAt(sc,"steps","right"),give:wAt(sc,"steps","Give"),anti:wAt(sc,"steps","antibiotic"),
    sponge:wAt(sc,"steps","sponge"),gd:c.skipped-0.3,written:wAt(sc,"skipped","written"),busy:wAt(sc,"skipped","but")-0.2,often:wAt(sc,"skipped","often"),
    pd:c.paid-0.4,inf:wAt(sc,"paid","infections"),mis:wAt(sc,"paid","mistakes"),dea:wAt(sc,"paid","deaths"),
    map:c.y2008-0.35,study:wAt(sc,"y2008","study"),op:c.pause-0.45,paused:wAt(sc,"pause","paused"),read:wAt(sc,"pause","read"),clip:c.hold-0.35,
    step:wAt(sc,"hold","step"),conf:wAt(sc,"hold","confirmed"),hl:wAt(sc,"hold","and the")-0.25,hold:wAt(sc,"hold","hold"),done:wAt(sc,"hold","done"),
    fell:c.fell-0.4,from:wAt(sc,"fell","one point"),to:wAt(sc,"fell","zero point"),wk:c.worked-0.4,list:wAt(sc,"three","one agreed"),
    copy:wAt(sc,"three","a copy"),who:wAt(sc,"three","someone"),title:c.breath+1.8}));
  const mk=[[0,"Before 2008"],[P.map,"2008"]],stepsA=tt=>[fin(tt,P.right-0.1,0.4),fin(tt,P.anti-0.15,0.4),fin(tt,P.sponge-0.15,0.4)];
  gv_shots(ctx,S,t,sc.dur,[
    // an operating room: the team, and the patient, awake; the steps everyone knew, each by its own thing as it's named
    {at:0,place:"theatre",keys:[[0,960,540,1],[4.4,920,560,1.07]],d:2.6,draw:(x,tt)=>{const a=stepsA(tt),inj=fin(tt,P.give,0.6);
      gv_halo(x,712,604,110,70,GV.gold,0.8*a[0]);gv_halo(x,530,510,100,100,GV.gold,0.8*a[1]);gv_halo(x,1456,580,110,80,GV.gold,0.8*a[2]);
      os_team(x,tt,{awake:true,anaes:{pose:"stand",pose2:"os_inject",mix:inj,carry:inj>0.5?os_heldSyringe:null},nurse:false});
      [0,1,2].forEach(i=>os_knew(x,i,a[i],0));}},
    // the steps were written down: the guidelines on a shelf down the corridor
    {at:P.gd,place:"guides",keys:[[P.gd,900,520,1.08],[P.gd+0.2,780,440,1.5]],d:2.2,push:0.02,draw:(x,tt)=>{const u=fin(tt,P.written-0.2,0.6);
      gv_halo(x,650,270,130,240,GV.gold,0.85*u);os_guideBinder(x,easeCam(u));os_tagAt(x,tt,P.written,null,714,214,"written in guidelines");}},
    // but in a busy room: the nurse hurries in with a tray, the anaesthetist turns to the screen; the steps are skipped, struck through
    {at:P.busy,place:"theatre",keys:[[P.busy,960,540,1.02],[P.busy+0.1,940,550,1.06]],d:2.4,draw:(x,tt)=>{
      os_team(x,tt,{anaes:{pose:"os_screen",flip:true},surgeon:{pose:"os_sterileUp"},scrub:{pose:"os_tray",carry:os_heldTray},
        nurse:(q,tt)=>os_trayWalk(q,tt,gv_walk(tt,P.busy+0.3,1800,1716,160))});
      [0,1,2].forEach(i=>os_knew(x,i,1,clamp((tt-(P.often-0.05+0.32*i))/0.4,0,1)));}},
    // what patients paid for it: the camera goes on from there to the patient, asleep, as the room fades back; a red tag for each harm as it's named
    {at:P.pd,place:"theatre",keys:[[P.pd,940,550,1.0865],[P.pd+0.1,760,566,1.28]],d:3.0,push:0.015,draw:(x,tt)=>{
      os_team(x,tt,{anaes:{pose:"os_screen",flip:true},surgeon:{pose:"os_sterileUp"},scrub:{pose:"os_tray",carry:os_heldTray},
        nurse:(q,tt)=>os_trayWalk(q,tt,gv_walk(tt,P.busy+0.3,1800,1716,160))});
      [0,1,2].forEach(i=>os_knew(x,i,1-fin(tt,P.pd+0.3,0.8),1));os_veil(x,fin(tt,P.pd+0.3,1.4));
      [[P.inf,600,"infections"],[P.mis,880,"mistakes"],[P.dea,1190,"avoidable deaths"]].forEach(([t0,px,s])=>os_tagAt(x,tt,t0-0.1,null,px,330,s,{wash:GV.red,washA:0.3}));}},
    // 2008: eight hospitals in eight countries, rich and poor
    {at:P.map,place:"worldmap",keys:[[P.map,960,480,1.0],[P.study,960,470,1.05]],d:2.6,draw:(x,tt)=>{
      OS_CITY.forEach((_,i)=>os_cityPin(x,i,fin(tt,P.study-0.1+0.26*i,0.5)));}},
    // three pauses in every operation; at the time out the team stops, and the nurse reads the checklist aloud
    {at:P.op,place:"theatre",keys:[[P.op,960,540,1],[P.op+0.1,980,530,1.04]],d:2.6,draw:(x,tt)=>{const p=fin(tt,P.paused-0.2,0.5);
      os_team(x,tt,{anaes:{pose:"stand",pose2:"listen",mix:p},surgeon:{pose:"os_sterile",pose2:"os_sterileUp",mix:p*0.6,carry:os_heldScalpel},scrub:{pose:"os_sterile"}});
      os_pauses(x,tt,c.pause+0.05,1,1);gv_halo(x,1590,420,250,540,GV.gold,0.6*fin(tt,P.read-0.6,0.6));
      gv_say(x,1240,262,["Time out.","Antibiotic given?"],1688,500,{a:fin(tt,P.read-0.1,0.3),k:0.92+0.08*spring(fin(tt,P.read-0.1,0.5))});}},
    // each step confirmed: the time out's boxes ticked in turn; the antibiotic's still open
    {at:P.clip,place:"clip",keys:[[P.clip,960,540,1],[P.clip+0.1,900,520,1.08]],d:2.4,push:0.02,draw:(x,tt)=>{
      os_page(x,[1,1,1,fin(tt,P.step-0.1,0.5),fin(tt,P.conf-0.05,0.5),0],{lit:1,halo:5,haloA:fin(tt,P.conf+0.4,0.5)});}},
    // and the nurse can hold the team: "Wait." The surgeon waits, scalpel up, until the anaesthetist has given the antibiotic
    {at:P.hl,place:"theatre",keys:[[P.hl,1234,520,1.4],[P.hold+0.45,960,540,1.0]],d:1.8,push:0,draw:(x,tt)=>{const st=fin(tt,P.hold-0.4,0.4)*(1-fin(tt,P.done+0.3,0.5)),
        inj=fin(tt,P.hold+0.3,0.6);
      os_team(x,tt,{anaes:{pose:"stand",pose2:"os_inject",mix:inj,carry:inj>0.5?os_heldSyringe:null},surgeon:{pose:"os_sterileUp",carry:os_heldScalpel},
        nurse:{pose:"os_read",pose2:"os_stop",mix:st,carry:st>0.5?os_heldClipL:os_heldClip,flip:true}});
      gv_say(x,1300,286,["Wait."],1660,470,{a:fin(tt,P.hold-0.2,0.3)*(1-fin(tt,P.done+0.2,0.3)),k:0.92+0.08*spring(fin(tt,P.hold-0.2,0.5))});
      gv_halo(x,530,510,100,100,GV.gold,0.8*fin(tt,P.done-0.3,0.5));os_tagAt(x,tt,P.done-0.1,null,580,300,"antibiotic given",{wash:GV.green,washA:0.3});}},
    // what changed: deaths after surgery nearly halved
    {at:P.fell,place:"worldmap",keys:[[P.fell,980,470,1.02]],push:0.01,draw:(x,tt)=>{OS_CITY.forEach((_,i)=>os_cityPin(x,i,1,true));
      x.fillStyle=rgba(WC_PAPER,0.6*fin(tt,P.fell+0.1,0.6));x.fillRect(0,0,W,H);os_result(x,fin(tt,P.from-0.2,0.9),fin(tt,P.to-0.2,0.9),fin(tt,P.fell+0.2,0.5));}},
    // all of it together: one agreed list,
    {at:P.wk,place:"clip",keys:[[P.wk,960,520,1.06],[P.wk+0.1,960,540,1.0]],d:2.6,push:0.02,draw:(x,tt)=>{os_page(x,[1,1,1,1,1,1],{lit:1,litA:1-fin(tt,P.list-0.3,0.5)});
      os_tagAt(x,tt,P.list-0.1,null,1440,800,"one agreed list",{size:34,wash:GV.gold,washA:0.35});}},
    // a copy in the room where the work happens, and someone who checks every step, every time
    {at:P.copy-0.3,place:"theatre",keys:[[P.copy-0.3,960,540,1],[P.copy,1080,540,1.06]],d:2.8,draw:(x,tt)=>{const tk=fin(tt,c.breath-1.4,0.5);
      gv_halo(x,1640,590,150,130,GV.gold,0.8*fin(tt,P.copy-0.1,0.5)*(1-fin(tt,P.who-0.2,0.5)));gv_halo(x,1580,410,270,540,GV.gold,0.7*fin(tt,P.who-0.1,0.6));
      os_team(x,tt,{surgeon:{pose:"os_sterile",pose2:"stand",mix:tk},nurse:{pose:"os_read",pose2:"os_tick",mix:tk,carry:tk>0.5?os_heldClipPen:os_heldClip,flip:true}});
      wc_pencil(x,[[1590,486],[1676,600]],fin(tt,P.copy,0.4),{seed:66,lw:2.4});os_tagAt(x,tt,P.copy,null,1410,470,"a copy in the room",{size:32});
      os_tagAt(x,tt,P.who,null,1690,380,"someone who checks",{size:32,wash:GV.gold,washA:0.35});}},
    // and at the end, before anyone leaves the room, the sign out: its three boxes ticked
    {at:c.breath-0.25,place:"clip",keys:[[c.breath-0.25,1080,520,1.1],[c.breath,1140,520,1.18]],d:2.6,push:0,draw:(x,tt)=>{const b=c.breath;
      withA(x,1-fin(tt,P.title,0.8),()=>os_page(x,[1,1,1,1,1,1,fin(tt,b+0.25,0.45),fin(tt,b+0.7,0.45),fin(tt,b+1.15,0.45)],{lit:2}));}}]);
  os_pill(ctx,t,mk,fin(t,0.6,0.5)*(1-fin(t,P.title,0.4)));
  gv_title(ctx,S,t,P.title,"Off the shelf","where a policy meets the work","Film 1 of 10 · data governance");
  wc_paperOver(ctx,S);});

// ---- 2 · The shelf: Yusuf's first day, and what he inherits ----
// a box carried in both hands, looking up at the building; and a step either way with it
POSE.os_box={L:[0.16,-2.05],R:[0.16,-2.05],feet:24,shift:0,tilt:0,turn:0.12,gaze:[0.5,-0.45],look:0};
POSE.os_boxA=Object.assign({},POSE.os_box,{feet:14,shift:-5,tilt:0.03,gaze:[0.4,-0.2]});POSE.os_boxB=Object.assign({},POSE.os_boxA,{shift:5,tilt:-0.03});
// the campus path's middle: its height at each x
const OS_PATH=wc_smooth(GV_CP.path,8);
function os_pathY(x){const p=OS_PATH;for(let i=1;i<p.length;i++)if(p[i][0]>=x)return lerp(p[i-1][1],p[i][1],clamp((x-p[i-1][0])/Math.max(1e-6,p[i][0]-p[i-1][0]),0,1));return p[p.length-1][1];}
// a name card, as master data's films introduce people: the name, then the role; it rises a little as it comes
function os_nameCard(ctx,x,y,name,role,a){if(a<=0.01)return;const w=Math.round(Math.max(tw(ctx,name,32,800),tw(ctx,role,28,600))+60);
  withA(ctx,a,()=>{ctx.save();ctx.translate(0,12*(1-a));wc_panel(ctx,x,y,w,112,{kind:"card",seed:3});wc_T(ctx,name,x+30,y+48,{w:800,size:32,col:WC_DARK});
    wc_T(ctx,role,x+30,y+90,{w:600,size:28,col:WC_MUTED});ctx.restore();});}
// his box, on the desk once he's in
const os_deskBox=x=>x.drawImage(os_boxC(),748,GV_OFF.desk[1]-192,224,200);

scene("shelf",(ctx,S,t,sc)=>{const c=sc.cues,P=os_once(sc,"P",()=>({b:c.shelf-0.6,ch:c.chart-0.5,co:c.council-0.6,br:c.brief-0.5,walk:c.starts+2.7,
    thirty:wAt(sc,"shelf","thirty"),mat:wAt(sc,"shelf","maturity"),half:wAt(sc,"chart","half"),once:wAt(sc,"council","once")}));
  gv_shots(ctx,S,t,sc.dur,[
    // the campus: Yusuf's first day, a box of his things in his arms; he looks up at the building, then goes in
    {at:0,place:"campus",keys:[[0,1080,760,1.7],[0.4,1090,770,1.82],[P.walk,1250,730,1.82]],d:3.4,draw:(x,tt)=>{const w=gv_walk(tt,P.walk,1060,1360,90),k=(w.x-1060)/300;
      person(x,"yusuf",w.x,os_pathY(w.x)+2-w.bob,lerp(0.235,0.19,k),{pose:"os_box",pose2:w.moving?(w.swing>0?"os_boxA":"os_boxB"):null,mix:Math.abs(w.swing),t:tt,carry:os_heldBox});}},
    // his office: the shelf of binders, 34 policies, and the score on the wall; the newest DMBOK on his desk, as the prologue left it
    {at:P.b,place:"office",keys:[[P.b,1100,560,1.2],[P.b+0.1,1180,540,1.32]],d:5,draw:(x,tt)=>{const [sx,sy,sw,sh]=GV_OFF.score;
      os_chartSmall(x,0);gv_halo(x,sx-30,sy-30,sw+60,sh+60,GV.gold,0.85*gv_io(tt,P.mat-0.1,P.ch,0.5));os_score(x);os_binders(x);os_deskBox(x);gv_deskBook(x);
      person(x,"yusuf",1190,895,0.8,{pose:"listen",t:tt});os_tagAt(x,tt,P.thirty-0.2,null,1621,290,"34 data policies");}},
    // the chart, close: half its names are still to be confirmed
    {at:P.ch,place:"boardGov",keys:[[P.ch,960,520,1],[P.ch+0.1,960,500,1.05]],d:4,push:0,draw:(x,tt)=>os_chart(x,k=>fin(tt,P.half-0.2+2.2*k/8,0.3))},
    // the council's minutes: the same action, carried forward again
    {at:P.co,place:"desk",keys:[[P.co,960,560,1],[P.co+0.1,960,520,1.08]],d:3.2,draw:(x,tt)=>os_minutes(x,fin(tt,P.once-0.16,0.3))},
    // the office again: Yusuf has taken binder 12 down; David, at the door, gives him his brief
    {at:P.br,place:"office",keys:[[P.br,960,540,1],[P.br+0.1,940,540,1.04]],d:4,draw:(x,tt)=>{
      os_chartSmall(x,1);os_score(x);os_binders(x,{missing:i=>i===11});os_deskBox(x);gv_deskBook(x);
      person(x,"david",190,868,0.8,{pose:"explain",t:tt});person(x,"yusuf",1240,905,0.8,{pose:"hold",expr:"worried",t:tt,flip:true,carry:heldBinder("12",os_bindCol(11))});
      const q=c.brief+0.1;gv_say(x,250,190,["Can you fix governance","before the submission?"],205,400,{a:fin(tt,q,0.35),k:0.92+0.08*spring(fin(tt,q,0.5))});}}]);
  // today, and who Yusuf is
  wc_year(ctx,56,72,"Today",fin(t,0.3,0.5)*(1-fin(t,P.b,0.4)));os_nameCard(ctx,470,560,"Yusuf Demir","data governance lead",gv_io(t,c.starts+0.3,P.b-0.3,0.4));
  wc_paperOver(ctx,S);});

// ---- 3 · Two numbers: Planning's report and the draft submission don't agree ----
// the floor: the people at work behind the glass (o.out leaves someone out), then the glass, then the offices' names (a name the
// frame would cut fades out)
const OS_AT={clara:0,mei:1,yusuf:2,jun:3,sam:4},OS_WORK={clara:{pose:"reach"},mei:{pose:"hold",carry:heldNotebook},jun:{pose:"reach"},sam:{pose:"phone"}};
// Yusuf at work in his office, writing in his notebook, while the data team looks into the two numbers
const OS_YUSUF={pose:"write",carry:heldNotebook};
function os_floor(x,tt,o){o=o||{};const F=GV_FL;Object.keys(OS_AT).forEach(id=>{const i=OS_AT[id];if(id==="yusuf"?!o.yusufIn:(o.out||[]).includes(id))return;
    person(x,id,F.spot(i),806,0.5,Object.assign({pose:"stand",t:tt,flip:i%2===1},OS_WORK[id]||{},(o.pose||{})[id]||{}));});
  gv_floorGlass(x);const m=x.getTransform(),vl=-m.e/m.a,vr=(x.canvas.width-m.e)/m.a,a=o.names==null?1:o.names;
  F.rooms.forEach((r,i)=>{const cx=F.x(i)+F.w/2,hw=tw(x,r[1],30,800)/2+6;gv_floorName(x,i,a*clamp(Math.min(cx-hw-vl,vr-cx-hw)/30,0,1));});}

scene("numbers",(ctx,S,t,sc)=>{const c=sc.cues,P=os_once(sc,"P",()=>({pl:c.census-0.6,rg:c.draft-0.6,wh:c.which-0.6,
    four1:wAt(sc,"census","four"),four2:wAt(sc,"draft","four")}));
  gv_shots(ctx,S,t,sc.dur,[
    // the same week: Jun, from the data team, walks down the floor, past the offices where the work is done; Yusuf is at his desk
    {at:0,place:"floor",keys:[[0,1080,560,1.14],[0.3,760,560,1.14]],d:3.0,draw:(x,tt)=>{const w=gv_walk(tt,0.3,1250,640,210);
      os_floor(x,tt,{names:fin(tt,0.4,0.6),out:["jun"],yusufIn:true,pose:{yusuf:OS_YUSUF}});gv_walker(x,"jun",w,GV_FL.walk,0.62,{t:tt,flip:true});}},
    // Planning: Clara shows him the census report
    {at:P.pl,place:"planning",keys:[[P.pl,900,540,1.1],[P.pl+0.1,880,520,1.16]],d:5,draw:(x,tt)=>{os_census(x,fin(tt,P.four1-0.1,0.5));
      person(x,"clara",440,905,0.8,{pose:"point",t:tt});person(x,"jun",1270,905,0.8,{pose:"listen",t:tt,flip:true});}},
    // the registrar's office: Mei holds up the draft submission
    {at:P.rg,place:"registrar",keys:[[P.rg,1180,540,1.12],[P.rg+0.1,1200,520,1.18]],d:5,draw:(x,tt)=>{
      person(x,"mei",1000,905,0.84,{pose:"hold",t:tt,carry:os_draft(fin(tt,P.four2-0.1,0.5))});person(x,"jun",1290,905,0.8,{pose:"listen",t:tt,flip:true});}},
    // the floor again: two reports, two numbers, and Jun between them
    {at:P.wh,place:"floor",keys:[[P.wh,700,540,1.22],[P.wh+0.1,690,530,1.28]],d:4,draw:(x,tt)=>{const F=GV_FL;
      os_floor(x,tt,{pose:{clara:{pose:"listen"},mei:{pose:"listen"},yusuf:OS_YUSUF},out:["jun"],yusufIn:true});
      person(x,"jun",F.x(1)-16,F.walk,0.62,{pose:"stand",expr:"concerned",t:tt});
      [[0,"census report","4,812 awards"],[1,"draft submission","4,867 awards"]].forEach(([i,a,b],k)=>os_glassCard(x,tt,i,P.wh+0.1+0.15*k,[a,b]));
      gv_qmark(x,F.x(1)-16,F.walk-0.62*560-50,96,fin(tt,c.which+0.1,0.6));}}]);
  wc_paperOver(ctx,S);});

// ---- 4 · Who decides? The data team finds both numbers right; no one agrees which matches the government's definition, so they
//      take it to data governance ----
// something carried in both hands while walking: the arms stay, the legs step
POSE.os_carry=Object.assign({},POSE.os_box,{gaze:[0.3,0.1],turn:0.06});
function os_carrier(x,id,w,y,s,carry,o){person(x,id,w.x,y-w.bob,s,Object.assign({pose:"os_carry",pose2:w.moving?(w.swing>0?"os_boxA":"os_boxB"):null,mix:Math.abs(w.swing),flip:w.flip,carry},o||{}));}
// a card on an office's glass on the floor: two lines, coming in at t0
function os_glassCard(x,tt,i,t0,lines,o){o=o||{};const u=fin(tt,t0,0.45);if(u<=0)return;const F=GV_FL,k=0.92+0.08*spring(u),sz=o.size||30,h=82+(lines.length-1)*(sz+12);
  x.save();x.translate(F.x(i)+F.w/2,F.top+(o.top||250)+h/2);x.scale(k,k);withA(x,u,()=>gv_card(x,-F.w/2+(o.pad||22),-h/2,F.w-2*(o.pad||22),h,lines,{size:sz,align:"center",pin:false,y0:52,wash:o.wash||OS_NUM,washA:o.washA||0.14}));x.restore();}

scene("decides",(ctx,S,t,sc)=>{const c=sc.cues,P=os_once(sc,"P",()=>({b1:c.both-0.5,s:c.monday-0.6,b3:c.before-0.6,cc:c.gov-0.6,k:c.ask-0.6,d:c.answers-0.6,e:c.tbc-0.6,
    right:wAt(sc,"both","right"),word:wAt(sc,"monday","the word"),micro:wAt(sc,"monday","microcredentials"),bef:wAt(sc,"before","before"),aft:wAt(sc,"before","after"),
    ours:wAt(sc,"gov","which"),who:wAt(sc,"gov","matches"),takes:wAt(sc,"ask","takes"),ask:wAt(sc,"ask","who"),
    mei:wAt(sc,"answers","Mei"),jun:wAt(sc,"answers","Jun"),plan:wAt(sc,"answers","Planning"),tobe:wAt(sc,"tbc","to be"),
    rm:c.room-0.5,own:wAt(sc,"room","everyone"),none:wAt(sc,"room","no one")}));
  const board=(x,tt,mon)=>{os_reportCard(x,OS_RC.census,"census report","ran Friday","4,812",fin(tt,P.right-0.1,0.35));
    os_reportCard(x,OS_RC.draft,"draft submission","ran Wednesday","4,867",fin(tt,P.right-0.02,0.35));
    if(mon>0){const [mx,my,mw,mh]=OS_RC.monday;x.save();x.translate(0,-60*(1-easeCam(mon)));withA(x,clamp(mon*3,0,1),()=>os_mondayCard(x));x.restore();}};
  gv_shots(ctx,S,t,sc.dur,[
    // the data team checks both numbers: Jun takes them back down the floor to his team; it starts as the last chapter left the floor,
    // so nothing doubles as the two dissolve
    {at:0,place:"floor",keys:[[0,732,530,1.312],[0.4,1180,560,1.14]],d:2.6,draw:(x,tt)=>{const w=gv_walk(tt,0.1,368,1250,380);
      os_floor(x,tt,{pose:{clara:{pose:"listen"},mei:{pose:"listen"},yusuf:OS_YUSUF},out:["jun"],yusufIn:true});os_carrier(x,"jun",w,GV_FL.walk,0.62,heldNotebook,{t:tt});}},
    // the data team's board: both reports are right, each by its own meaning of award
    {at:P.b1,place:"boardData",keys:[[P.b1,960,500,1.08],[P.b1+0.1,960,490,1.12]],d:3,push:0,draw:(x,tt)=>board(x,tt,0)},
    // Jun's screen: the glossary's term, and the row added on Monday
    {at:P.s,place:"screen",keys:[[P.s,960,470,1.06],[P.micro-0.3,960,440,1.18]],d:2.4,push:0,draw:(x,tt)=>os_glossary(x,fin(tt,P.micro-0.1,0.6),fin(tt,P.word+0.08-0.1,0.5))},
    // the board again: Monday's card goes up between them, one report before it, one after
    {at:P.b3,place:"boardData",keys:[[P.b3,960,480,1.12]],push:0.02,draw:(x,tt)=>{board(x,tt,fin(tt,c.before-0.1,0.3));
      os_tagAt(x,tt,P.bef,null,OS_RC.census[0]+OS_RC.census[2]/2,268,"before");os_tagAt(x,tt,P.aft,null,OS_RC.draft[0]+OS_RC.draft[2]/2,268,"after");}},
    // the registrar's desk: the government's definition and ours, and nobody to say how one maps to the other
    {at:P.cc,place:"registrar",keys:[[P.cc,1000,560,1.22],[P.cc+0.1,1010,540,1.26]],d:5,draw:(x,tt)=>{const [mx,my,mw]=OS_RD.manual,[tx,ty,tw_]=OS_RD.tent;
      withA(x,fin(tt,c.gov+0.1,0.3),()=>os_manual(x));withA(x,fin(tt,P.ours-0.1,0.3),()=>os_tent(x));
      os_tagAt(x,tt,c.gov+0.2,null,mx+mw/2,770,"the government's definition",{size:26});os_tagAt(x,tt,P.ours,null,tx+tw_/2,770,"ours",{size:26});
      const top=os_arc(x,tx+tw_/2,ty-14,mx+mw/2,my-14,200,fin(tt,P.ours,0.9));if(top)gv_qmark(x,top[0],top[1]-14,84,fin(tt,P.who,0.6));
      person(x,"mei",560,905,0.8,{pose:"listen",pose2:"shrug",mix:fin(tt,P.who-0.1,0.5),expr:"concerned",t:tt});}},
    // so the data team takes it to data governance: Jun walks to Yusuf's office, and Yusuf looks up; the question, over them both. Then
    // the floor, as each is named: who does what with the word
    {at:P.k,place:"floor",keys:[[P.k,1120,600,1.22],[P.d-0.2,960,540,1]],d:1.8,push:0,draw:(x,tt)=>{const w=gv_walk(tt,P.k+0.1,1330,1170,150),
        up=fin(tt,P.takes+0.5,0.5);
      os_floor(x,tt,{out:["jun"],yusufIn:true,pose:{yusuf:Object.assign({pose2:"listen",mix:up},OS_YUSUF)}});gv_walker(x,"jun",w,GV_FL.walk,0.62,{t:tt,flip:true});
      withA(x,1-fin(tt,P.mei-0.5,0.4),()=>gv_qmark(x,1094,GV_FL.walk-0.62*560-30,90,fin(tt,P.ask-0.05,0.6)));
      os_glassCard(x,tt,1,P.mei-0.1,["Mei","owns the meaning"]);os_glassCard(x,tt,3,P.jun-0.1,["Jun","builds the model"]);os_glassCard(x,tt,0,P.plan-0.1,["Planning","reports what","it's given"]);}},
    // and the chart, close: the government submission's row lights; the one accountable is still to be confirmed
    {at:P.e,place:"boardGov",keys:[[P.e,960,520,1],[P.e+0.1,960,540,1.06]],d:3,push:0,draw:(x,tt)=>{const st=fin(tt,P.tobe-0.2,0.3);os_chart(x,()=>1,{light:2,lightA:fin(tt,c.tbc-0.1,0.8),hide:st>0.4?[2,1]:null});
      const [sx,sy]=os_cellAt(2,1);gv_stamp(x,sx,sy+4,"TBC",st,{size:44,rot:-0.1});}},
    // like the operating room before the checklist: each of the team knows their own step, and where someone would check them all,
    // nobody stands
    {at:P.rm,place:"theatre",keys:[[P.rm,960,540,1],[P.rm+0.1,960,530,1.04]],d:2.6,draw:(x,tt)=>{os_team(x,tt,{nurse:false});
      [["the antibiotic",360,340],["the operation",930,360],["the sponges",1180,372]].forEach(([s,px,py],i)=>os_tagAt(x,tt,P.own+0.32*i,null,px,py,s));
      gv_qmark(x,1716,560,120,fin(tt,P.none,0.6));}}]);
  wc_year(ctx,56,72,"Before 2008",gv_io(t,P.rm+0.2,sc.dur+1,0.4));
  wc_paperOver(ctx,S);});

// ---- 5 · What governance is for: deciding who decides, and making sure each decision reaches the work ----
// an office on the floor washed in a colour (behind its person), or lit up, brighter
function os_roomLit(x,i,col,a){const F=GV_FL;gv_tint(x,F.x(i),F.top,F.w,F.fy-F.top,col,a);}
function os_roomGlow(x,i,a){if(a<=0.01)return;const F=GV_FL;x.save();x.beginPath();x.rect(F.x(i),F.top,F.w,F.fy-F.top);x.clip();x.globalCompositeOperation="screen";
  wc_glowAt(x,F.x(i)+F.w/2,F.top+300,430,[255,238,204],0.42*a);x.restore();}
// a decision's card, flying from the governance office (or the office from) to the glass of an office where the work is done (u, 0 to
// 1), and pinned there; amend draws the line added to it by hand
const OS_DEC_Y=GV_FL.top+300;
function os_decFly(x,i,u,tick,from,amend){if(u<=0)return;const F=GV_FL,e=easeCam(clamp(u,0,1)),f=from==null?2:from;
  os_decision(x,lerp(F.x(f)+F.w/2,F.x(i)+F.w/2,e),lerp(OS_DEC_Y+20,OS_DEC_Y,e)-130*Math.sin(Math.PI*e),lerp(0.5,1,e),tick,amend);}
// a label over two offices of the floor, in the band above their glass, with a pencil bracket out to their edges
function os_overRooms(x,tt,t0,i0,i1,s,o){const F=GV_FL,x0=F.x(i0)+16,x1=F.x(i1)+F.w-16,m=(x0+x1)/2,y=108,u=easeCam(fin(tt,t0,0.7));if(u<=0)return;
  x.save();x.strokeStyle=rgba(WC_PENCIL,0.8);x.lineWidth=3;x.lineCap="round";x.beginPath();x.moveTo(m-(m-x0)*u,y);x.lineTo(m+(x1-m)*u,y);
  if(u>0.9){const d=20*(u-0.9)/0.1;x.moveTo(x0,y);x.lineTo(x0,y+d);x.moveTo(x1,y);x.lineTo(x1,y+d);}x.stroke();x.restore();os_tagAt(x,tt,t0,null,m,y-40,s,o);}
// a label on paper of two lines or more, springing in at t0
function os_note(x,tt,t0,cx,cy,lines,o){o=o||{};const a=fin(tt,t0,0.35)*(o.out==null?1:1-fin(tt,o.out,0.4));if(a<=0.01)return;const sz=o.size||30,w=Math.round(Math.max(...lines.map(l=>tw(x,l,sz,700)))+48),h=lines.length*(sz+12)+28,
    k=0.9+0.1*spring(fin(tt,t0,0.5));
  x.save();x.translate(cx,cy);x.scale(k,k);withA(x,a,()=>{wc_panel(x,-w/2,-h/2,w,h,{kind:"card",wash:o.wash,washA:o.washA,seed:w});
    lines.forEach((l,i)=>wc_T(x,l,0,-h/2+14+(i+0.8)*(sz+12),{w:700,size:sz,align:"center",col:WC_INK}));});x.restore();}

scene("for",(ctx,S,t,sc)=>{const c=sc.cues,P=os_once(sc,"P",()=>({b:c.for-0.6,cc:c.like-0.6,d:c.mgmt-0.6,who:wAt(sc,"doesnt","who"),how:wAt(sc,"doesnt","how"),
    dd:wAt(sc,"for","deciding"),mk:wAt(sc,"for","making"),rule:wAt(sc,"like","a rule"),copy:wAt(sc,"like","a copy"),chk:wAt(sc,"like","someone"),
    gv:wAt(sc,"mgmt","Governance"),kept:wAt(sc,"mgmt","checks"),mg:wAt(sc,"mgmt","Management")}));
  // the four offices where the work is done; each one's decision sets off, the nearest first, and lands on its glass
  const WORK=[0,1,3,4],ID=["clara","mei",0,"jun","sam"],go=i=>P.mk-0.35+(i===1||i===3?0:0.12),lands=i=>go(i)+0.85;
  gv_shots(ctx,S,t,sc.dur,[
    // binder 12, open on his desk: what policy 12 says; then a note stuck beside it for each thing it doesn't say
    {at:0,place:"desk",keys:[[0,1250,500,1.22],[P.who-1.0,960,520,1.0]],d:1.8,draw:(x,tt)=>{os_open12(x);
      os_sticky(x,560,330,420,200,-0.05,["who decides?"],54,fin(tt,P.who-0.3,0.25),clamp((tt-P.who+0.05)/0.8,0,1));
      os_sticky(x,590,650,460,260,0.04,["how does it","reach the work?"],50,fin(tt,P.how-0.3,0.25),clamp((tt-P.how+0.05)/1.2,0,1));}},
    // the floor: in the governance office, deciding who decides; then each decision goes out to an office where the work is done, and
    // the people there look up
    {at:P.b,place:"floor",keys:[[P.b,960,450,1.26],[P.mk-0.5,960,540,1.0]],d:1.8,draw:(x,tt)=>{
      os_roomLit(x,2,GV.gold,0.32*fin(tt,P.dd-0.1,0.6));WORK.forEach(i=>os_roomLit(x,i,GV.gold,0.14*fin(tt,lands(i)-0.1,0.6)));
      const pose={yusuf:{pose:"write",carry:heldNotebook}};WORK.forEach(i=>{if(ID[i]!=="mei")pose[ID[i]]={pose2:"listen",mix:fin(tt,lands(i)-0.1,0.5)};});
      os_floor(x,tt,{yusufIn:true,pose});os_glassCard(x,tt,2,P.dd-0.1,["deciding","who decides"],{wash:GV.gold,washA:0.32});
      WORK.forEach(i=>os_decFly(x,i,clamp((tt-go(i))/0.85,0,1),0));
      os_tagAt(x,tt,P.mk+0.6,null,960,66,"each decision reaches the work",{size:32,wash:GV.gold,washA:0.3});}},
    // the surgical checklist again: a rule, the page itself; then in the room, a copy where the work happens, on the nurse's clipboard,
    // and the nurse, someone who checks
    {at:P.cc,place:"clip",keys:[[P.cc,960,540,1],[P.cc+0.1,960,520,1.04]],d:2.4,draw:(x,tt)=>{os_page(x,[1,1,1,1,1,1,1,1,1],{});
      os_tagAt(x,tt,P.rule-0.1,null,1440,800,"a rule",{size:34,wash:GV.gold,washA:0.35});}},
    {at:P.copy-0.35,place:"theatre",keys:[[P.copy-0.35,1182,540,1.3],[P.copy,1182,530,1.36]],d:2.4,draw:(x,tt)=>{
      gv_halo(x,1640,590,150,130,GV.gold,0.85*fin(tt,P.copy-0.1,0.5)*(1-fin(tt,P.chk-0.2,0.5)));gv_halo(x,1580,410,270,540,GV.gold,0.7*fin(tt,P.chk-0.1,0.6));
      os_team(x,tt,{});wc_pencil(x,[[1236,300],[1676,604]],fin(tt,P.copy,0.4),{seed:67,lw:2.4});os_note(x,tt,P.copy,1060,290,["a copy where","the work happens"]);
      os_tagAt(x,tt,P.chk,null,1640,380,"someone who checks",{size:32,wash:GV.gold,washA:0.35});}},
    // the floor again: governance sets the rules and checks they're kept, a tick on each decision; management does the work
    {at:P.d,place:"floor",keys:[[P.d,960,540,1]],push:0.02,draw:(x,tt)=>{const F=GV_FL;
      os_roomLit(x,2,GV.gold,0.14+0.22*fin(tt,P.gv-0.1,0.5));WORK.forEach((i,k)=>{os_roomLit(x,i,GV.gold,0.14);os_roomGlow(x,i,fin(tt,P.mg-0.2+0.06*Math.min(k,2),0.5));});
      const pose={yusuf:{pose:"write",carry:heldNotebook}};WORK.forEach((i,k)=>{if(ID[i]!=="mei")pose[ID[i]]={pose:"listen",pose2:OS_WORK[ID[i]].pose,mix:fin(tt,P.mg-0.2+0.06*Math.min(k,2),0.5)};});
      os_floor(x,tt,{yusufIn:true,pose});os_glassCard(x,tt,2,P.gv-0.1,["governance","sets the rules,","checks they're kept"],{wash:GV.gold,washA:0.32,top:196,pad:8});
      WORK.forEach((i,k)=>os_decision(x,F.x(i)+F.w/2,OS_DEC_Y,1,fin(tt,P.kept+0.12*k,0.4)));
      os_overRooms(x,tt,P.mg-0.2,0,1,"management · does the work");os_overRooms(x,tt,P.mg-0.14,3,4,"management · does the work");}}]);
  wc_year(ctx,56,72,"2008",gv_io(t,P.cc+0.2,P.d,0.4));
  wc_paperOver(ctx,S);});

// ---- 6 · Listen first: no thirty-fifth policy; one question in every office, and what slows each one down ----
// someone answering while Yusuf writes it down: their bubble springs in at t0 and goes at t1
function os_answer(x,tt,t0,t1,bx,by,lines,tx,ty){gv_say(x,bx,by,lines,tx,ty,{a:gv_io(tt,t0,t1,0.35),k:0.92+0.08*spring(fin(tt,t0,0.5)),size:34});}
const os_noting=tt=>({pose:"write",carry:heldNotebook,t:tt});

scene("listen",(ctx,S,t,sc)=>{const c=sc.cues,P=os_once(sc,"P",()=>({a2:wAt(sc,"ask","He asks")-0.4,flip:wAt(sc,"ask","doesn't")+0.3,every:wAt(sc,"ask","everyone"),
    q:wAt(sc,"ask","what slows"),b:c.jun-0.6,m:c.mei-0.6,s:c.sam-0.6,p:c.plan-0.6,f:c.binder-0.6,they:wAt(sc,"binder","They"),g:c.tools-1.15,
    h:wAt(sc,"tools","Tools")-0.5,trust:wAt(sc,"plan","trust"),carry:wAt(sc,"tools","carry"),agree:wAt(sc,"tools","agree"),cant:wAt(sc,"tools","can't")}));
  gv_shots(ctx,S,t,sc.dur,[
    // his desk: a fresh page for a thirty-fifth policy, its heading and nothing else; it turns over, unwritten
    {at:0,place:"desk",keys:[[0,960,520,1],[P.flip-0.3,960,500,1.06]],d:1.8,draw:(x,tt)=>os_page35(x,Math.PI*easeCam(clamp((tt-P.flip)/1.1,0,1)))},
    // the floor: he goes out with his notebook, past every office, and asks the same question; each one looks up
    {at:P.a2,place:"floor",keys:[[P.a2,960,540,1]],push:0.04,draw:(x,tt)=>{const F=GV_FL,w=gv_walk(tt,P.a2+0.15,F.x(2)+76,F.x(3)-18,200),pose={};
      ["clara","jun","sam"].forEach((id,k)=>pose[id]={pose2:"listen",mix:fin(tt,P.every-0.1+0.14*k,0.5)});
      os_floor(x,tt,{pose});os_carrier(x,"yusuf",w,F.walk,0.62,heldNotebook,{t:tt});
      os_answer(x,tt,P.q-0.15,99,w.x-190,420,["What slows you down?"],w.x+6,540);}},
    // the data team: Jun
    {at:P.b,place:"data",keys:[[P.b,1240,520,1.12],[P.b+0.1,1260,510,1.16]],d:4,draw:(x,tt)=>{os_dataBoard(x);person(x,"yusuf",960,905,0.8,os_noting(tt));
      person(x,"jun",1480,905,0.8,{pose:"explain",t:tt,flip:true});os_answer(x,tt,c.jun+0.2,P.m+0.6,1540,250,["The rules arrive","after I've built it."],1505,452);}},
    // the registrar's office: Mei, her word on the desk
    {at:P.m,place:"registrar",keys:[[P.m,1080,520,1.12],[P.m+0.1,1060,510,1.16]],d:4,draw:(x,tt)=>{os_tent(x);
      person(x,"mei",860,905,0.8,{pose:"explain",t:tt});person(x,"yusuf",1450,905,0.8,Object.assign(os_noting(tt),{flip:true}));
      os_answer(x,tt,c.mei+0.2,P.s+0.6,560,262,["I approve the words,","then never see them used."],850,456);}},
    // the platform team: Sam
    {at:P.s,place:"platform",keys:[[P.s,900,520,1.12],[P.s+0.1,880,510,1.16]],d:4,draw:(x,tt)=>{
      person(x,"sam",640,905,0.8,{pose:"explain",t:tt});person(x,"yusuf",1180,905,0.8,Object.assign(os_noting(tt),{flip:true}));
      os_answer(x,tt,c.sam+0.2,P.p+0.6,330,262,["Tell me which column,","I'll protect it in minutes."],630,456);}},
    // Planning: Clara, her census on the screen and the draft's number stuck beside it
    {at:P.p,place:"planning",keys:[[P.p,900,520,1.1],[P.p+0.1,880,510,1.14]],d:4,draw:(x,tt)=>{os_census(x,1);
      os_sticky(x,1222,238,212,160,0.06,["4,867?"],46,fin(tt,P.p+0.25,0.25),1);
      person(x,"clara",440,905,0.8,{pose:"listen",pose2:"shrug",mix:fin(tt,P.trust-0.2,0.5),expr:"concerned",t:tt});
      person(x,"yusuf",1270,905,0.8,Object.assign(os_noting(tt),{flip:true}));os_answer(x,tt,c.plan+0.1,P.f+0.6,270,214,["Which number","do I trust?"],440,462);}},
    // his office's board, close: his question, and the four answers pinned up under it one by one
    {at:P.f,place:"boardGov",keys:[[P.f,960,500,1],[P.f+0.1,960,490,1.04]],d:3,push:0.02,draw:(x,tt)=>{os_asked(x);
      for(let k=0;k<4;k++)os_ansCard(x,k,fin(tt,c.binder-0.2+0.45*k,0.35));}},
    // his office: the shelf the binder came from, in a warm light; what they wrote is what they were asked for
    {at:P.they-0.5,place:"office",keys:[[P.they-0.5,1320,520,1.16],[P.they-0.4,1360,520,1.2]],d:3,draw:(x,tt)=>{os_chartSmall(x,1);os_ansSmall(x);os_score(x);gv_deskBook(x);
      os_binders(x,{missing:i=>i===11});const g=fin(tt,P.they-0.2,0.9),[sx,,sw]=[GV_OFF.shelf.x,0,GV_OFF.shelf.w];
      if(g>0){x.save();x.globalCompositeOperation="soft-light";wc_glowAt(x,sx+sw/2,520,560,[255,190,90],0.9*g);x.globalCompositeOperation="screen";
        wc_glowAt(x,sx+sw/2,470,500,[255,222,160],0.42*g);x.restore();}
      person(x,"yusuf",1200,905,0.8,{pose:"listen",expr:"smile",t:tt});}},
    // the data team's room: Mei, Jun and Yusuf, working it out together
    {at:P.g,place:"data",keys:[[P.g,1300,520,1.14],[P.g+0.1,1320,520,1.18]],d:3,draw:(x,tt)=>{const nod=k=>0.05*Math.sin(tt*3.1+k)*gv_io(tt,P.g+0.3,P.h,0.4);os_dataBoard(x);
      person(x,"yusuf",900,905,0.8,{pose:"listen",t:tt,nod:nod(1)});person(x,"mei",1330,905,0.8,{pose:"explain",t:tt});
      person(x,"jun",1600,905,0.8,{pose:"listen",t:tt,flip:true,nod:nod(2)});}},
    // Jun's screen: the rules on award. What they agreed on Monday is checked every night, and holds; how award maps to the
    // government's can't be checked, as no one has agreed it
    {at:P.h,place:"screen",keys:[[P.h,960,450,1],[P.cant-0.3,960,500,1.06]],d:1.8,push:0.02,draw:(x,tt)=>
      os_rules(x,fin(tt,P.carry-0.3,0.5),fin(tt,P.carry+0.25,0.4),fin(tt,P.agree-0.1,0.6),fin(tt,P.cant-0.15,0.5))}]);
  wc_paperOver(ctx,S);});

// ---- 7 · Where does it run? Binder 12 open again, and every line of policy 12 marked by where it runs ----
scene("runs",(ctx,S,t,sc)=>{const c=sc.cues,P=os_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{open:w("takes","opens",-0.2),where:w("takes","where"),b:c.runs-0.6,key:[w("runs","run in",-0.1),w("owned","decisions",-0.1),w("go","go",-0.2)],
      hi:[w("runs","a field"),w("runs","a check"),w("runs","every night"),w("runs","a label"),w("owned","owns"),w("owned","writes"),w("go","go")],
      note:[w("runs","a field"),w("runs","a check"),w("runs","every night"),w("runs","a label"),w("owned","owns",0.3),w("owned","where the"),99]};});
  gv_shots(ctx,S,t,sc.dur,[
    // his desk: binder 12, closed, and three highlighters; he opens it, and sticks his question beside policy 12
    {at:0,place:"desk",keys:[[0,1300,520,1.1],[P.open,960,520,1],[P.b-0.9,1300,500,1.25]],d:1.6,draw:(x,tt)=>{
      [[1792,330,1.4,GV.green],[1836,530,1.52,GV.gold],[1798,736,1.44,GV.grey]].forEach(([mx,my,r,col])=>os_marker(x,mx,my,r,col));
      os_opening12(x,easeCam(clamp((tt-P.open)/0.9,0,1)));
      os_sticky(x,560,380,440,230,-0.04,["where does","it run?"],56,fin(tt,P.where-0.35,0.25),clamp((tt-P.where+0.1)/1.0,0,1));}},
    // the page, close: each line marked as it's sorted, green where it can run in the work, gold where it's a decision someone owns,
    // grey where it can go; what he writes beside it; his key at the top
    {at:P.b,place:"policy",keys:[[P.b,960,540,1]],push:0.035,draw:(x,tt)=>os_policy(x,k=>fin(tt,P.hi[k]-0.45,k===4?0.8:0.45),k=>fin(tt,P.note[k],0.7),
      j=>fin(tt,P.key[j],0.6),fin(tt,P.hi[6]+0.35,0.5))}]);
  wc_paperOver(ctx,S);});

// ---- 8 · What's worth keeping: under each answer on Yusuf's board, what's worth keeping so it stops; then who decides, and who acts ----
scene("keep",(ctx,S,t,sc)=>{const c=sc.cues,P=os_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{worth:w("keep","worth"),b:c.rules-0.6,card:[w("rules","Rules"),w("words","One"),w("classes","A class"),w("owners","a list")],f:c.decide-0.6,
      own:w("decide","Owners"),stw:w("decide","Stewards"),teams:w("act","The teams"),use:w("act","use it"),gov:w("act","governance"),kept:w("act","kept")};});
  gv_shots(ctx,S,t,sc.dur,[
    // his office: Yusuf at his board, a stack of gold cards in his hands; the four answers catch a warm light
    {at:0,place:"office",keys:[[0,1060,520,1.14],[P.worth-0.6,930,440,1.4]],d:2.4,draw:(x,tt)=>{const [bx,by,bw,bh]=GV_OFF.board;
      os_chartSmall(x,1);os_ansSmall(x);os_warm(x,bx+bw/2,by+bh*0.6,220,fin(tt,P.worth-0.2,0.8));os_score(x);os_binders(x,{missing:i=>i===11});gv_deskBook(x);
      person(x,"yusuf",1190,905,0.8,{pose:"hold",expr:"calm",t:tt,flip:true,carry:os_heldGold});}},
    // the board, close: under each answer, what's worth keeping so it stops, on a gold card
    {at:P.b,place:"boardGov",keys:[[P.b,960,520,1.03],[P.b+0.1,960,510,1]],d:2.4,push:0.02,draw:(x,tt)=>{os_asked(x,OS_KB.ask);
      for(let k=0;k<4;k++){os_ansCard(x,k,1,OS_KB.ans);os_keepArrow(x,k,clamp((tt-P.card[k]+0.45)/0.45,0,1));os_keepCard(x,k,fin(tt,P.card[k],0.35));}}},
    // the floor: the owners decide, and the stewards keep it up to date, a line added by hand; a copy goes to each team that uses it;
    // governance checks it's kept
    {at:P.f,place:"floor",keys:[[P.f,960,540,1]],push:0.025,draw:(x,tt)=>{const F=GV_FL,own=fin(tt,P.own-0.15,0.6),go=k=>P.use-0.55+0.14*k,
        land=k=>fin(tt,go(k)+0.75,0.4),tick=k=>fin(tt,P.kept-0.2+0.12*k,0.4),amend=k=>clamp((tt-P.stw-0.1-0.25*k)/0.9,0,1);
      [0,1].forEach(i=>os_roomLit(x,i,GV.gold,0.3*own));[3,4].forEach((i,k)=>os_roomLit(x,i,GV.cyanInk,0.2*land(k)));os_roomLit(x,2,GV.gold,0.32*fin(tt,P.gov-0.15,0.5));
      const ex=(t0,t1)=>gv_io(tt,t0,t1,0.45);
      os_floor(x,tt,{yusufIn:true,pose:{clara:{pose2:"explain",mix:ex(P.own-0.25,P.stw+0.2)},mei:{pose2:"write",mix:fin(tt,P.stw-0.15,0.5)},
        jun:{pose2:"listen",mix:ex(go(0)-0.3,go(0)+1.1)},sam:{pose2:"listen",mix:ex(go(1)-0.3,go(1)+1.1)},yusuf:{pose:"listen",pose2:"write",mix:fin(tt,P.gov-0.25,0.5),carry:heldNotebook}}});
      // the owners' decisions on their glass, a line added to each, and a copy of each flying to a team's
      [0,1].forEach((i,k)=>{const u=fin(tt,P.own+0.1*k,0.45);if(u>0)withA(x,clamp(u*2.5,0,1),()=>os_decision(x,F.x(i)+F.w/2,OS_DEC_Y,lerp(1.15,1,spring(u)),tick(k),amend(k)));});
      [3,4].forEach((i,k)=>os_decFly(x,i,clamp((tt-go(k))/0.85,0,1),tick(k+2),k,1));
      os_overRooms(x,tt,P.own-0.2,0,1,"owners decide · stewards keep it up to date");os_overRooms(x,tt,P.teams-0.15,3,4,"the teams who do the work · use it");
      os_glassCard(x,tt,2,P.gov-0.1,["governance","checks it's kept"],{wash:GV.gold,washA:0.32});}}]);
  wc_paperOver(ctx,S);});

// ---- 9 · The series: nine binders for this series' films on why governance; then the two series that follow, each named on a card:
//     three cards on Noor's architecture map for the films that draw it as one model, six on the data team's board for those that build it ----
scene("series",(ctx,S,t,sc)=>{const c=sc.cues,P=os_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{nine:w("next","nine",-0.1),take:w("next","follows"),ml:c.map-0.6,mc:w("map","as one",-0.2),three:w("map","on the"),tl:c.tools-0.6,six:w("tools","six",-0.1),
      f:c.wish-0.6,end:c.breath-0.2};});
  const B1=OS_NINE[0],held=os_heldTitled(["Who","decides"],os_bindCol(B1));
  gv_shots(ctx,S,t,sc.dur,[
    // his office: nine binders on the shelf light up, one for each film to come; he takes the first down
    {at:0,place:"office",keys:[[0,1120,520,1.2],[P.take+0.5,1270,560,1.4]],d:1.8,draw:(x,tt)=>{const n=j=>fin(tt,P.nine+0.12*j,0.35),got=tt>=P.take+0.55,
        r1=fin(tt,P.take-0.1,0.5),r2=fin(tt,P.take+0.55,0.5);
      os_chartSmall(x,1);os_ansSmall(x);os_keepSmall(x);os_score(x);gv_deskBook(x);
      os_binders(x,{missing:i=>i===11||(got&&i===B1),glow:i=>{const j=OS_NINE.indexOf(i);return j<0?0:0.85*n(j);},
        out:i=>{const j=OS_NINE.indexOf(i);return j<0?0:Math.max(0.5*n(j),i===B1?fin(tt,P.take+0.1,0.35):0);}});
      person(x,"yusuf",1250,905,0.8,got?{pose:"reach",pose2:"hold",mix:r2,t:tt,carry:held}:{pose:"listen",pose2:"reach",mix:r1,t:tt});}},
    // Noor's room: the university's architecture map on her wall, and Noor, the data architect, at it
    {at:P.ml,place:"noor",keys:[[P.ml,860,500,1.1],[P.ml+0.1,800,470,1.16]],d:2,draw:(x,tt)=>{
      person(x,"noor",1250,905,0.8,{pose:"listen",pose2:"point",mix:fin(tt,P.ml+0.5,0.6),t:tt,flip:true});
      os_nameCard(x,1330,236,"Noor Rahman","data architect",gv_io(tt,P.ml+0.4,P.mc,0.4));}},
    // the map, close: the series' name, and three cards, one in each layer the films add to
    {at:P.mc,place:"mapClose",keys:[[P.mc,960,520,1.03],[P.mc+0.1,960,510,1]],d:2.4,push:0.02,draw:(x,tt)=>{os_mapHead(x,fin(tt,P.mc+0.3,0.6));for(let k=0;k<3;k++)os_mapCard(x,k,fin(tt,P.three+0.3*k,0.35));}},
    // the data team's board, close: the series' name, and six cards, one for each film that builds it with the tools
    {at:P.tl,place:"boardData",keys:[[P.tl,960,500,1.04],[P.tl+0.1,960,490,1]],d:2.4,push:0.02,draw:(x,tt)=>{os_toolsHead(x,fin(tt,P.tl+0.3,0.6));
      for(let k=0;k<6;k++)os_toolCard(x,k,fin(tt,P.six+0.3*k,0.35));}},
    // the floor: he takes the binder to where the work is done; Jun looks up
    {at:P.f,place:"floor",keys:[[P.f,1000,560,1.2],[P.f+0.1,1100,555,1.22]],d:4,draw:(x,tt)=>{const F=GV_FL,wk=gv_walk(tt,P.f+0.2,880,1400,150);
      os_floor(x,tt,{pose:{jun:{pose2:"listen",mix:fin(tt,wk.end-0.8,0.6)}}});os_carrier(x,"yusuf",wk,F.walk,0.62,held,{t:tt});}}]);
  gv_end(ctx,S,t,P.end,"Off the shelf","A policy that doesn't run anywhere is a wish.","Film 1 of 10");
  wc_paperOver(ctx,S);});
