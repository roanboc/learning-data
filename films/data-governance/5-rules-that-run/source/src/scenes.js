/* ===== Rules that run: the ten chapters =====
   Each chapter is a few shots in the places of past.js, plan.js and the series' rooms.js, cut together with short dissolves
   (gv_shots). Times inside a chapter come from its cues (when each line starts) and the words of its lines (wAt), so the pictures
   stay with the voice if it's recorded again. Words on screen are on paper, screens, boards, tags and speech bubbles, at least 28 px
   as seen, and above the captions while the voice speaks. */

// made once per chapter, the first time it draws: its cues are known by then
const rr_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// the place and the year in the top corner: the latest one passed, dissolving from the one before
function rr_pill(ctx,t,mk,a){if(a<=0.01)return;let i=0;for(let k=1;k<mk.length;k++)if(t>=mk[k][0])i=k;const u=i>0?fin(t,mk[i][0],0.35):1;
  if(u<1)wc_year(ctx,56,72,mk[i-1][1],a*(1-u));wc_year(ctx,56,72,mk[i][1],a*u);}
// a tag that springs in at t0 and goes at t1 (or stays)
function rr_tagAt(ctx,t,t0,t1,x,y,s,o){const a=t1==null?fin(t,t0,0.35):gv_io(t,t0,t1,0.35);if(a<=0.01)return;const k=0.9+0.1*spring(fin(t,t0,0.5));
  ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,a,()=>wc_tag(ctx,0,0,s,Object.assign({align:"center"},o||{})));ctx.restore();}
// a red line drawn through a tag (centred at x, y, its words at size) as p goes 0 to 1
function rr_strike(ctx,x,y,s,size,p){if(p<=0)return;const w=tw(ctx,s,size,700)+40,e=easeCam(clamp(p,0,1));ctx.save();ctx.strokeStyle=rgba(GV.redInk,0.9);ctx.lineWidth=5;ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(x-w/2-8,y+4);ctx.lineTo(x-w/2-8+(w+16)*e,y-6*e);ctx.stroke();ctx.restore();}
// a card of two lines, centred at (x,y): who someone is; it springs in at t0 (and goes at t1)
function rr_plate(ctx,t,t0,t1,x,y,lines){const a=t1==null?fin(t,t0,0.4):gv_io(t,t0,t1,0.4);if(a<=0.01)return;
  const w=Math.round(Math.max(tw(ctx,lines[0],30,800),tw(ctx,lines[1],28,600))+48),h=96,k=0.92+0.08*spring(fin(t,t0,0.5));
  ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,a,()=>{wc_panel(ctx,-w/2,-h/2,w,h,{kind:"card",seed:w});wc_T(ctx,lines[0],0,-6,{w:800,size:30,align:"center",col:WC_DARK});
    wc_T(ctx,lines[1],0,32,{w:600,size:28,align:"center",col:WC_MUTED});});ctx.restore();}
// a speech bubble that springs in at t0 and goes at t1
function rr_say(ctx,t,t0,t1,bx,by,lines,tx,ty,o){return gv_say(ctx,bx,by,lines,tx,ty,Object.assign({a:gv_io(t,t0,t1,0.35),k:0.92+0.08*spring(fin(t,t0,0.5)),size:34},o||{}));}
// someone fading in or out, drawn whole into a buffer and laid down at a, so their arms and clothes don't show through each other
function rr_ghost(ctx,a,fn){if(a<=0.01)return;if(a>=0.99){fn(ctx);return;}const [bc,bx]=wc_buf("rrGhost",ctx.canvas.width,ctx.canvas.height);bx.setTransform(ctx.getTransform());fn(bx);
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha*=a;ctx.drawImage(bc,0,0);ctx.restore();}
// a nod: the head dips and comes back once, from t0
const rr_nod=(t,t0)=>0.07*Math.sin(clamp((t-t0)/0.7,0,1)*Math.PI);

// ---- 1 · The measured river: Fustat, 861; a low flood, and a tax set by guess that would take a family's grain; the new Nilometer on
// Roda Island, read every day; sixteen cubits set in advance; farmers pay what the river allows, the tax known before the harvest ----
// two boats on the river, under sail, one going each way
const RR_NB=[[0.6,610,260,820,false,3],[0.36,462,1280,1000,true,5]];
function rr_nileBoats(x,tt){RR_NB.forEach(([s,y,x0,x1,f,sd])=>rr_boat(x,lerp(x0,x1,clamp(tt/60,0,1)),y,s,f,sd,tt));}
// the farmer's field in a low year: the farmer holds his basket of grain; the tax scribe comes, unrolls his sheet and reaches for the
// basket; the family at the door. After (the benefit): the farmer keeps the basket, the guess is struck through
function rr_dryField(x,tt,P,after){const D=RR_FD,[fx,fy,fs]=D.farmer,[tx,ty,ts]=D.taxman;
  rr_ghost(x,after?1:fin(tt,P.fam,0.6),q=>rr_family(q,tt,{expr:after?"smile":"concerned"}));
  if(!after){const wk=gv_walk(tt,P.tax,1520,tx,330),a=fin(tt,P.tax-0.1,0.4);
    if(a>0.01)rr_ghost(x,a,q=>{if(wk.moving)gv_walker(q,"rr_taxman",wk,ty,ts,{t:tt});
      else person(q,"rr_taxman",tx,ty,ts,{pose:"hold",pose2:"rr_take",mix:fin(tt,P.eat,0.6),t:tt,flip:true,carry:rr_heldScroll(fin(tt,P.guess-0.4,0.9),{left:true})});});}
  person(x,"rr_farmer",fx,fy,fs,{pose:"hold",t:tt,carry:rr_heldBasket,expr:after?"relieved":fin(tt,P.eat,0.4)>0.5?"worried":"concerned"});
  rr_tagAt(x,tt,after?-9:P.dryW,null,700,250,"a low flood: dry fields",{size:32});
  rr_tagAt(x,tt,after?-9:P.guess,null,tx,372,"a tax set by guess",{size:32,wash:GV.red,washA:0.18});if(after)rr_strike(x,tx,372,"a tax set by guess",32,fin(tt,P.allows,0.7));}
// the island's landing: the scribe hands the folded sheet to a messenger, who goes; his boat crosses the channel towards Fustat
function rr_landing(x,tt,P){const [sx,sy,ss]=RR_RD.scribe,[bx,by,bs]=RR_RD.boat,give=fin(tt,P.off+0.3,0.6),pass=P.offW+0.5,e=easeCam(clamp((tt-pass-0.5)/3.2,0,1));
  rr_boat(x,lerp(bx,900,e),lerp(by,520,e),lerp(bs,0.42,e),true,9,tt);
  person(x,"rr_scribe",sx,sy,ss,{pose:"stand",pose2:"rr_give",mix:give*(1-fin(tt,pass+0.2,0.5)),t:tt,carry:tt<pass?rr_heldFolded:null});
  const m=1-fin(tt,pass+0.4,0.4);if(m>0.01)rr_ghost(x,m,q=>person(q,"rr_boatman",sx+170,sy+14,ss,{pose:"stand",pose2:"rr_give",mix:give,t:tt,flip:true,carry:tt>=pass?rr_heldFolded:null}));
  rr_tagAt(x,tt,P.offW,null,1120,434,"to the officials",{size:32});}
// the keeper's days: the water rises a half cubit a day, from 14 to 15.5; the light moves across the stones through each day, a dusk
// between one and the next, and he reads the water in the middle of each
const RR_DAYS=[14,14.5,15,15.5];
function rr_days(tt,t0,t1){const n=RR_DAYS.length,k=clamp((tt-t0)/((t1-t0)/n),0,n-0.001),i=Math.floor(k),f=k-i,last=i===n-1,
    L=rr_cub(lerp(RR_DAYS[i],RR_DAYS[Math.min(i+1,n-1)],last?0:easeCam(clamp((f-0.72)/0.24,0,1))));
  return{L,day:last?Math.min(f,0.6):f,dusk:last?0:0.5*Math.sin(Math.PI*clamp((f-0.7)/0.3,0,1)),read:clamp((f-0.12)/0.14,0,1)*(1-clamp((f-0.62)/0.1,0,1))};}
// where a tag sits on the Nilometer's parapet, on the island
const rr_rdTag=()=>{const w=RR_RD.well,p=rr_rdp((w.x0+w.x1)/2,w.h,w.z0-w.t);return[p[0],p[1]-70];};

scene("river",(ctx,S,t,sc)=>{const c=sc.cues,P=rr_once(sc,"P",()=>({flood:c.flood-0.3,dry:wAt(sc,"low","When")-0.3,dryW:wAt(sc,"low","the fields stay dry"),
    tax:wAt(sc,"low","a land tax")-1.0,guess:wAt(sc,"low","set by guess"),fam:wAt(sc,"low","a farmer's family")-0.3,eat:wAt(sc,"low","needs to eat")-0.2,
    cross:c.measure-0.3,roda:c.nilometer-0.2,rodaW:wAt(sc,"nilometer","Roda Island"),nilo:wAt(sc,"nilometer","Nilometer"),well:wAt(sc,"nilometer","a well open")-0.4,
    col:wAt(sc,"nilometer","a column")+0.1,days:c.keeper-0.4,every:wAt(sc,"keeper","every day"),off:wAt(sc,"keeper","and the officials")-0.2,offW:wAt(sc,"keeper","the officials"),
    s16:c.sixteen-0.3,at16:wAt(sc,"sixteen","sixteen")+0.3,full:wAt(sc,"sixteen","the tax")-0.3,below:c.below,
    ben:c.benefit-0.3,allows:wAt(sc,"benefit","what the river"),diwan:wAt(sc,"benefit","officials")-0.4,before:wAt(sc,"benefit","before the harvest"),
    score:c.score-0.3,m1:wAt(sc,"score","a measure"),m2:wAt(sc,"score","a level"),m3:wAt(sc,"score","those who decide"),title:c.breath+0.7}));
  gv_shots(ctx,S,t,sc.dur,[
    // the Nile in flood, in the late afternoon: Fustat across the water, boats under sail
    {at:0,place:"nile",keys:[[0,960,540,1],[0.2,980,530,1.05]],d:6,push:0.01,draw:(x,tt)=>rr_nileBoats(x,tt)},
    // the fields in a flood year, water in their channel
    {at:P.flood,place:"green",keys:[[P.flood,960,540,1],[P.flood+0.1,940,556,1.05]],d:3.5,push:0.01},
    // the same fields in a low year: dry and cracked; the farmer with his basket; the tax scribe, his sheet and his reach; the family
    {at:P.dry,place:"dry",keys:[[P.dry,940,556,1.05],[P.dry+0.1,900,580,1.12]],d:6,push:0.01,draw:(x,tt)=>rr_dryField(x,tt,P,false)},
    // a fair tax needs a measure: the camera rises over the river and crosses to the southern tip of Roda Island
    {at:P.cross,place:"nile",keys:[[P.cross,960,540,1],[P.cross+0.4,1330,400,1.75]],d:2.6,push:0,draw:(x,tt)=>rr_nileBoats(x,tt)},
    // the island's tip: the Nilometer's parapet at the river's edge
    {at:P.roda,place:"roda",keys:[[P.roda,960,540,1],[P.roda+0.1,940,560,1.05]],d:3,push:0.01,draw:(x,tt)=>{
      rr_tagAt(x,tt,P.rodaW-0.1,null,1300,150,"Roda Island",{size:32});rr_tagAt(x,tt,P.nilo,null,...rr_rdTag(),"the Nilometer",{size:32,wash:GV.gold,washA:0.3});}},
    // down into the well: its stair, its arches, the column marked in cubits
    {at:P.well,place:"well",keys:[[P.well,960,300,1.35],[P.well+0.2,960,540,1]],d:2.4,push:0,draw:(x,tt)=>{rr_well(x,tt,{L:rr_cub(14),day:0.3,keeper:false});
      rr_tagAt(x,tt,P.col,null,640,600,"a column marked in cubits",{size:32});}},
    // the keeper reads the water every day, and his scribe writes each reading down: the water rises a mark at a time, a day each step
    {at:P.days,place:"well",keys:[[P.days,960,540,1]],d:2,push:0.01,draw:(x,tt)=>{const D=rr_days(tt,P.days+0.2,P.off+0.4);rr_well(x,tt,D);
      const k=rr_onStair(RR_WL.main,D.L+0.3,-0.2);rr_tagAt(x,tt,P.every,null,k.x-250,k.y+40,"read every day",{size:32,wash:GV.green,washA:0.25});}},
    // the readings go to the officials: at the island's landing the scribe hands his sheet to a messenger, whose boat crosses to Fustat
    {at:P.off,place:"roda",keys:[[P.off,1300,600,1.45]],d:2,push:0.012,draw:(x,tt)=>rr_landing(x,tt,P)},
    // sixteen cubits, close on the column: the water reaches the sixteenth mark, which lights gold
    {at:P.s16,place:"column",keys:[[P.s16,960,540,1],[P.s16+0.1,960,560,1.04]],d:2.2,push:0.01,draw:(x,tt)=>{
      const L=rr_cub(lerp(15.5,15.95,easeCam(clamp((tt-P.s16-0.2)/Math.max(0.5,P.at16-P.s16-0.2),0,1))));rr_columnClose(x,tt,L,fin(tt,P.at16,0.6));
      rr_tagAt(x,tt,P.at16+0.1,null,1260,rr_waterY(RR_WL.close,rr_cub(16)),"16",{size:44,wash:GV.gold,washA:0.45});}},
    // a flood year's fields: the year's tax is due in full; below sixteen, it isn't
    {at:P.full,place:"green",keys:[[P.full,960,540,1],[P.full+0.1,960,550,1.04]],d:3,push:0.01,draw:(x,tt)=>{
      rr_tagAt(x,tt,P.full+0.3,null,960,220,"the year's land tax: due in full",{size:36,wash:GV.gold,washA:0.3});
      rr_tagAt(x,tt,P.below,null,960,304,"below 16: not in full",{size:30});}},
    // the low year again: the farmer keeps his basket for his family; the guess is struck through
    {at:P.ben,place:"dry",keys:[[P.ben,900,580,1.12],[P.ben+0.1,880,590,1.14]],d:3,push:0.01,draw:(x,tt)=>rr_dryField(x,tt,P,true)},
    // across the river in Fustat, an official reads the readings: the tax is known before the harvest
    {at:P.diwan,place:"diwan",keys:[[P.diwan,1000,540,1.08],[P.diwan+0.1,1020,540,1.12]],d:3,push:0.01,draw:(x,tt)=>{const [ox,oy,os]=RR_DW.official;
      person(x,"rr_official",ox,oy,os,{pose:"hold",t:tt,flip:true,carry:rr_heldOpen(fin(tt,P.diwan+0.3,1.0))});
      rr_tagAt(x,tt,P.before,null,1180,230,"the tax, known before the harvest",{size:32,wash:GV.gold,washA:0.3});}},
    // what a quality score should be: three tags settle over the well, one by one, the water a cubit under the gold mark (the level is
    // set before the water gets there); wordless, the water settles
    {at:P.score,place:"well",keys:[[P.score,960,540,1],[P.score+0.1,960,530,1.03]],d:4,push:0.01,draw:(x,tt)=>{const C=RR_WL.main,L=rr_cub(15),
      k=rr_onStair(C,L+0.3,-0.2),s=rr_onStair(C,L+0.85,0.22);rr_well(x,tt,{L,day:0.55,lit16:1,read:1});
      rr_tagAt(x,tt,P.m1,P.title-0.3,k.x-210,k.y+50,"a measure, every day",{size:30,wash:GV.green,washA:0.3});
      rr_tagAt(x,tt,P.m2,P.title-0.3,640,rr_waterY(C,rr_cub(16)),"a level set in advance",{size:30,wash:GV.gold,washA:0.35});
      rr_tagAt(x,tt,P.m3,P.title-0.3,s.x-190,s.y-s.s*560*0.66,"a record for those who decide",{size:30,wash:GV.gold,washA:0.25});}}]);
  rr_pill(ctx,t,[[0,"Fustat · in today's Cairo · 861"]],fin(t,0.6,0.5)*(1-fin(t,P.title,0.4)));
  gv_title(ctx,S,t,P.title,"Rules that run","quality measured, not surveyed","Film 5 of 19 · data governance");
  wc_paperOver(ctx,S);});

// ---- 2 · A survey: binder 9 says data quality is monitored; here, that means a survey once a year; its chart, David's question, and a
// guess at the flood ----
// David's question as the room sees it: a small gold card pinned beside the chart (decoration)
function rr_officeQ(ctx,a){if(a<=0.01)return;const [bx,by]=GV_OFF.board;withA(ctx,a,()=>{ctx.save();ctx.translate(bx+60,by+300);ctx.rotate(-0.05);
  wc_panel(ctx,-40,-34,80,68,{kind:"card",wash:GV.gold,washA:0.35,seed:57});gv_lines(ctx,-28,-8,56,2,14,0.8);gv_pin(ctx,0,-26,GV.red,0.6);ctx.restore();});}
scene("survey",(ctx,S,t,sc)=>{const c=sc.cues,P=rr_once(sc,"P",()=>({take:wAt(sc,"binder","binder nine")+0.2,page:wAt(sc,"binder","says")-0.3,
    mon:wAt(sc,"binder","monitored")-0.1,form:wAt(sc,"survey","a survey")-0.2,nums:wAt(sc,"spring","from one")-0.2,ring:sc.ends.spring-0.16,board:c.short-0.5,
    shortW:wAt(sc,"short","short-course"),avg:c.average+0.1,door:c.david-0.5,ask:wAt(sc,"david","can we")-0.1,cant:c.cant-0.3,flood:wAt(sc,"guess","a guess"),
    not:wAt(sc,"guess","not the data"),needs:c.needs-0.4}));
  gv_shots(ctx,S,t,sc.dur,[
    // Yusuf's office: binders 2, 12 and 6 are out with the earlier films; he slides binder 9 out and takes it down
    {at:0,place:"office",keys:[[0,1180,540,1.22],[P.take+0.3,1300,560,1.34]],d:2,draw:(x,tt)=>{const got=tt>=P.take+0.1;
      rr_officeScreen(x,"survey");gv_deskBook(x);rr_binders(x,{gone9:got,out9:fin(tt,P.take-0.4,0.4)});
      person(x,"yusuf",1460,905,0.8,got?{pose:"reach",pose2:"hold",mix:fin(tt,P.take+0.1,0.5),t:tt,carry:rr_heldBinder(["Rules","that run"],RR_B9)}:{pose:"listen",pose2:"reach",mix:fin(tt,P.take-0.8,0.5),t:tt});}},
    // binder 9's page: its policy and its line, "monitored" underlined as it's read; then the survey's form laid on top of it
    {at:P.page,place:"policy",keys:[[P.page,960,500,1],[P.page+0.1,900,460,1.08],[P.form,960,520,1]],d:1.6,push:0.01,draw:(x,tt)=>{
      rr_policy9(x,{under:fin(tt,P.mon,0.7)});rr_survey(x,fin(tt,P.form,0.9),{nums:clamp((tt-P.nums)/1.2,0,1),ring:clamp((tt-P.ring)/0.7,0,1)});}},
    // his board, close: the chart he pins up from the answers; the short-course platform's bar lights; the average written under it
    {at:P.board,place:"boardGov",keys:[[P.board,800,470,1.04],[P.board+0.1,780,470,1.06]],d:3,push:0.01,draw:(x,tt)=>
      rr_chart(x,290,96-18*(1-fin(tt,P.board+0.1,0.6)),1,{bars:clamp((tt-P.board-0.4)/1.4,0,1),lit:gv_io(tt,P.shortW-0.1,P.avg+0.8,0.4),avg:clamp((tt-P.avg)/1.1,0,1)})},
    // David at the door, with his question
    {at:P.door,place:"office",keys:[[P.door,760,540,1.2]],d:2,draw:(x,tt)=>{rr_officeScreen(x,"survey");gv_deskBook(x);rr_binders(x,{gone9:true});rr_officeChart(x,1);
      person(x,"david",165,905,0.8,{pose:"stand",pose2:"explain",mix:gv_io(tt,P.ask,P.cant,0.5),t:tt});
      person(x,"yusuf",1080,905,0.8,{pose:"listen",t:tt,flip:true});
      rr_plate(x,tt,P.door+0.4,P.ask+0.1,520,240,["Prof. David Mensah","Deputy Vice-Chancellor"]);
      rr_say(x,tt,P.ask,9e9,110,140,RR_Q,250,410);}},
    // the board again: his question pinned beside the chart; for a moment the dry field of the opening, pale behind it; then the chart
    // fades to pencil
    {at:P.cant,place:"boardGov",keys:[[P.cant,960,480,1.0]],d:2,push:0.012,draw:(x,tt)=>{
      rr_chart(x,250,96,0.96,{bars:1,avg:1,field:gv_io(tt,P.flood-0.1,P.not-0.4,0.5),pencil:fin(tt,P.not-0.1,0.9)});rr_qCard(x,1180,150,fin(tt,P.cant+0.2,0.6),0);}},
    // Yusuf looks from the chart to the question, and opens his notebook
    {at:P.needs,place:"office",keys:[[P.needs,1000,540,1.3]],d:2,draw:(x,tt)=>{rr_officeScreen(x,"survey");gv_deskBook(x);rr_binders(x,{gone9:true});rr_officeChart(x,1);rr_officeQ(x,1);
      const op=fin(tt,P.needs+0.7,0.6);person(x,"yusuf",1230,905,0.8,{pose:"listen",pose2:"hold",mix:op,t:tt,flip:true,carry:op>0.4?heldNotebook:null,nod:-0.04*fin(tt,P.needs+0.2,0.5)});}}]);
  wc_year(ctx,56,72,"Today",fin(t,0.3,0.5)*(1-fin(t,P.page,0.4)));
  wc_paperOver(ctx,S);});

// ---- 3 · What already runs: like the keeper, the data team measures every night: a hundred and sixty checks, each passing, warning
// or failing; but a result names only the check ----
// the room round a screen at night: dark, the screen's own light on it; and a veil over the screen, so a line grown out of it reads
function rr_nightAround(ctx,a){if(a<=0.01)return;ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba(mix([255,255,255],[52,62,104],a),1);ctx.fillRect(-W,-H,3*W,3*H);ctx.restore();
  const [x,y,w,h]=GV_SC;ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,x+w/2,y+h/2,w*0.75,[150,180,230],0.35*a);ctx.restore();}
function rr_veilScreen(ctx,a){if(a<=0.01)return;const [x,y,w,h]=GV_SC;ctx.save();ctx.fillStyle=rgba(GV.screen,a);ctx.fillRect(x,y+54,w,h-54);ctx.restore();}
scene("runs",(ctx,S,t,sc)=>{const c=sc.cues,P=rr_once(sc,"P",()=>({room:wAt(sc,"keeper","the data team")-0.2,scr:c.checks-0.2,run:wAt(sc,"checks","a hundred"),
    runE:c.id-0.3,big:c.names-0.1,own:wAt(sc,"not","whose"),dim:wAt(sc,"not","what kind")}));
  gv_shots(ctx,S,t,sc.dur,[
    // like the keeper: on the stair, reading the water on the column, as in the opening
    {at:0,place:"well",keys:[[0,1180,480,1.25]],d:2,push:0.012,draw:(x,tt)=>rr_well(x,tt,{L:rr_cub(15),day:0.5,read:1})},
    // the data team's room at night: the window dark, the two monitors glowing
    {at:P.room,place:"data",keys:[[P.room,1300,540,1.1],[P.room+0.1,1340,540,1.14]],d:3,push:0.01,draw:x=>rr_night(x,1)},
    // Jun's screen, close: last night's checks, a line for each as it runs, and the count; the named lines light; the three marks
    {at:P.scr,place:"screenData",keys:[[P.scr,960,440,1.0]],d:2,push:0.01,draw:(x,tt,cam)=>{rr_nightAround(x,1);
      rr_checks(x,{n:160*(1-Math.pow(1-clamp((tt-P.run+1.4)/(P.runE-P.run+1.4),0,1),2.4)),lit:{3:fin(tt,c.id,0.4),4:fin(tt,c.twice,0.4),6:fin(tt,c.census,0.4)},
        legend:clamp((tt-c.pass)/1.8,0,1),cam});}},
    // one line grown to fill the screen, with two empty tags: whose is it, and what kind of quality does it check?
    {at:P.big,place:"screenData",keys:[[P.big,960,440,1.0]],d:2,push:0.01,draw:(x,tt,cam)=>{rr_nightAround(x,1);rr_checks(x,{n:160,legend:1,cam,fade:0.85*fin(tt,P.big,0.6)});
      rr_bigLine(x,fin(tt,P.big+0.1,0.9),{count:1});
      rr_tagIn(x,690,590,"owner: ?",fin(tt,P.own,0.5),{wash:GV.red,washA:0.16});rr_tagIn(x,1230,590,"dimension: ?",fin(tt,P.dim,0.5),{wash:GV.red,washA:0.16});}}]);
  wc_paperOver(ctx,S);});

// ---- 4 · An owner and a dimension: Yusuf asks for both on every check; Jun writes them into the rule register ----
// Yusuf's notebook, open on the desk: two words written in it (p1, p2)
function rr_notebook(ctx,x,y,p1,p2){ctx.save();ctx.translate(x,y);ctx.rotate(-0.03);ctx.save();ctx.filter="blur(12px)";ctx.fillStyle="rgba(50,40,30,0.3)";ctx.fillRect(-560,-330,1140,700);ctx.restore();
  wc_wash(ctx,wc_rrPts(-580,-360,1160,720,18),GV_HOLD.teal,{kind:"cover",lw:1.4,seed:211});gv_sheet(ctx,-550,-330,540,660);gv_sheet(ctx,10,-330,540,660);
  ctx.strokeStyle="rgba(120,130,160,0.4)";ctx.lineWidth=2;for(let i=0;i<9;i++)for(const x0 of [-520,40]){ctx.beginPath();ctx.moveTo(x0,-220+i*62);ctx.lineTo(x0+480,-220+i*62);ctx.stroke();}
  if(p1>0)wc_hand(ctx,"owner",-470,-104,{size:64,w:700,col:GV_SIGN.ink,p:p1});if(p2>0)wc_hand(ctx,"dimension",-470,20,{size:64,w:700,col:GV_SIGN.ink,p:p2});ctx.restore();}
scene("owner",(ctx,S,t,sc)=>{const c=sc.cues,P=rr_once(sc,"P",()=>({nb:c.two+0.5,w1:wAt(sc,"two","two things"),reg:c.owner-0.3,learn:wAt(sc,"learning","learning team"),
    dimT:c.dimension,six:[wAt(sc,"six","completeness"),wAt(sc,"six","uniqueness"),wAt(sc,"six","validity"),wAt(sc,"six","consistency"),wAt(sc,"six","accuracy"),wAt(sc,"six","timeliness")],
    e1:wAt(sc,"empty","completeness"),e2:wAt(sc,"empty","uniqueness"),endE:sc.ends.empty,foot:wAt(sc,"jun","beside"),tags:sc.ends.jun-0.2}));
  const own=i=>clamp((t-(i<4?P.learn-1.4+i*0.32:i===4?P.learn+0.7:P.learn+1.3))/0.7,0,1),
    dim=i=>clamp((t-[P.e1,P.e2,P.endE+0.1,P.e1+0.3,P.endE+0.5,P.endE+0.9][i])/0.6,0,1);
  gv_shots(ctx,S,t,sc.dur,[
    // the data team's room: Yusuf at Jun's desk with his notebook
    {at:0,place:"data",keys:[[0,1320,560,1.2]],d:2,draw:(x,tt)=>{person(x,"jun",1740,905,0.8,{pose:"listen",t:tt,flip:true});
      person(x,"yusuf",1260,905,0.8,{pose:"hold",t:tt,carry:heldNotebook});}},
    // his notebook, open on Jun's desk: two words
    {at:P.nb,place:"junTop",keys:[[P.nb,960,540,1],[P.nb+0.1,960,530,1.04]],d:2,push:0.01,draw:(x,tt)=>rr_notebook(x,960,520,clamp((tt-P.w1+0.2)/0.6,0,1),clamp((tt-P.w1-0.4)/0.8,0,1))},
    // the rule register, open on Jun's desk: the owners written in; the six dimensions along the top; then each check's dimension
    {at:P.reg,place:"junTop",keys:[[P.reg,960,540,1]],d:2,push:0.006,draw:(x,tt)=>{
      rr_register(x,{own:[0,1,2,3,4,5].map(own),dim:[0,1,2,3,4,5].map(dim),learning:gv_io(tt,P.learn-0.2,P.dimT-0.3,0.4),foot:clamp((tt-P.foot)/1.4,0,1)});
      rr_dims(x,P.six.map(s=>fin(tt,s-0.15,0.5)),P.six.map(s=>fin(tt,s-0.15,0.4)*(1-0.5*fin(tt,s+0.9,0.5))),clamp((tt-P.six[5]-0.5)/0.9,0,1));}},
    // the line from the night before, its two tags filled in
    {at:P.tags,place:"screenData",keys:[[P.tags,960,440,1.0]],d:2,push:0.01,draw:(x,tt,cam)=>{rr_checks(x,{n:160,legend:1,cam,fade:0.85});rr_bigLine(x,1,{count:1});
      rr_tagIn(x,690,590,"owner: Learning team",fin(tt,P.tags+0.3,0.5),{wash:GV.gold,washA:0.4});rr_tagIn(x,1230,590,"dimension: completeness",fin(tt,P.tags+0.8,0.5),{wash:GV.gold,washA:0.4});}}]);
  wc_paperOver(ctx,S);});

// ---- 5 · The scorecard: it writes itself from last night's checks; under it, what didn't pass and whose it is; David's question
// answered: Planning's check passed ----
// the scorecard on Planning's wall screen, as the room sees it (its words too small to read, decoration): the planning row lit (hiA)
function rr_planScreen(ctx,hiA){const [sx,sy,sw]=GV_PL.screen,k=sw/GV_SC[2];ctx.save();ctx.translate(sx,sy);ctx.scale(k,k);ctx.translate(-GV_SC[0],-GV_SC[1]);
  rr_asDeco(true,()=>gv_scorecard(ctx,{z:k},{rows:RR_SK15,date:"15 October 2026",sections:RR_SEC15,hi:5,hiA}));ctx.restore();}
// a check named under a cell of the scorecard: its words and its owner, on a card (in the screen's units)
function rr_cellCard(ctx,x,y,u,lines){if(u<=0.01)return;const w=Math.round(Math.max(tw(ctx,lines[0],22,600),tw(ctx,lines[1],22,700))+40),k=0.9+0.1*spring(clamp(u,0,1));
  ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,clamp(u*2,0,1),()=>{wc_panel(ctx,-w/2,-38,w,76,{kind:"card",wash:GV.gold,washA:0.25,seed:w});
    wc_T(ctx,lines[0],-w/2+20,-6,{w:600,size:22,col:WC_DARK});wc_T(ctx,lines[1],-w/2+20,24,{w:700,size:22,col:GV.goldInk});});ctx.restore();}
scene("scorecard",(ctx,S,t,sc)=>{const c=sc.cues,P=rr_once(sc,"P",()=>{const L=gv_skLay(ctx,[RR_SK15,RR_SK15]);return{scr:0.9,fill:1.4,
    area:wAt(sc,"row","area"),dimW:wAt(sc,"row","dimension"),cell:wAt(sc,"row","in each cell"),under:c.under-0.3,whose:wAt(sc,"under","whose"),door:c.answer-0.3,
    plan:c.census-0.3,acc:wAt(sc,"census","census"),room:c.passed-0.3,nod:wAt(sc,"passed","it passed"),tick:sc.ends.passed+0.1,rowCam:[960,L.rows[5].top+178,1.55]};});
  gv_shots(ctx,S,t,sc.dur,[
    // Yusuf's office, morning: the scorecard on his screen
    {at:0,place:"office",keys:[[0,1000,560,1.25]],d:2,draw:(x,tt)=>{rr_officeScreen(x,"score");gv_deskBook(x);rr_binders(x,{gone9:true});rr_officeChart(x,1);rr_officeQ(x,1);
      person(x,"yusuf",1110,905,0.8,{pose:"listen",t:tt,flip:true});}},
    // the scorecard fills in, wide: a wash in each cell as its count arrives; the rows, the columns and a cell lit as they're named;
    // then down to what didn't pass, and whose it is
    {at:P.scr,place:"screenGov",keys:[[P.scr,...GV_SKV.all],[P.under+0.1,960,520,1.38]],d:1.6,push:0,draw:(x,tt,cam)=>{const sec=fin(tt,P.under,0.8),
        L=gv_scorecard(x,cam,{rows:RR_SK15,after:RR_SK15,mx:sec,sections:[],afterSections:RR_SEC15,clear:" ",date:"15 October 2026",p:clamp((tt-P.fill)/3.4,0,1),scroll:240*easeCam(fin(tt,P.under,1.4))});
      const top=L.rows[0].top-L.scroll,bot=L.rows[11].top+L.rows[11].h-L.scroll,r5=L.rows[5];
      gv_halo(x,GV_SK.x-10,top-10,L.cw[0]+20,bot-top+20,GV.gold,0.75*gv_io(tt,P.area-0.1,P.dimW-0.2,0.3));
      gv_halo(x,L.cx[1],GV_SK.y-36-L.scroll,L.cx[7]-L.cx[1],50,GV.gold,0.75*gv_io(tt,P.dimW-0.1,P.cell-0.2,0.3));
      gv_halo(x,L.cx[2]-16,r5.top-16-L.scroll,L.cw[2]+32,r5.h+32,GV.gold,0.85*gv_io(tt,P.cell-0.1,P.under,0.3));
      if(L.secB&&L.secB[0]){const s0=L.secB[0];gv_tint(x,s0.cols[1]-10,s0.rows[0]-GV_SK.rh*0.74-L.scroll,tw(x,"Learning team",GV_SK.sz,600)+20,3*GV_SK.rh,GV.gold,0.7*fin(tt,P.whose,0.4));}}},
    // David at the door again: Yusuf turns to the screen and points at Planning's row
    {at:P.door,place:"office",keys:[[P.door,760,540,1.2]],d:2,draw:(x,tt)=>{rr_officeScreen(x,"score");gv_deskBook(x);rr_binders(x,{gone9:true});rr_officeChart(x,1);rr_officeQ(x,1);
      person(x,"david",165,905,0.8,{pose:"listen",t:tt});person(x,"yusuf",1080,905,0.8,{pose:"listen",pose2:"point",mix:fin(tt,P.door+0.6,0.5),t:tt,flip:true});
      rr_say(x,tt,P.door+0.2,9e9,110,140,RR_Q,250,410);}},
    // close on Planning's row: its accuracy cell lights, with its check and its owner
    {at:P.plan,place:"screenGov",keys:[[P.plan,...P.rowCam]],d:2,push:0.01,draw:(x,tt,cam)=>{const L=gv_scorecard(x,cam,{rows:RR_SK15,sections:RR_SEC15,date:"15 October 2026",hi:5,hiA:fin(tt,P.plan+0.3,0.5)}),r=L.rows[5];
      gv_halo(x,L.cx[5]-26,r.top-26,L.cw[5]+52,r.h+52,GV.green,0.9*fin(tt,P.acc-0.2,0.5));
      rr_cellCard(x,Math.min(L.cx[5]+L.cw[5]/2,1560-260),r.top+r.h+60,fin(tt,P.acc,0.5),["Planning's number matches the census report","owner: Planning"]);}},
    // Planning's room: Clara at her wall screen sees the same row, and nods
    {at:P.room,place:"planning",keys:[[P.room,1000,520,1.12]],d:2,draw:(x,tt)=>{rr_planScreen(x,1);
      person(x,"clara",1400,905,0.8,{pose:"listen",t:tt,flip:true,nod:rr_nod(tt,P.nod)});rr_plate(x,tt,P.room+0.4,null,1400,250,["Clara Jensen","Planning"]);}},
    // the office: David's question, answered
    {at:P.tick,place:"office",keys:[[P.tick,620,500,1.35]],d:2,draw:(x,tt)=>{rr_officeScreen(x,"score");gv_deskBook(x);rr_binders(x,{gone9:true});rr_officeChart(x,1);rr_officeQ(x,1);
      person(x,"david",165,905,0.8,{pose:"listen",t:tt,expr:"relieved",nod:rr_nod(tt,P.tick+0.9)});person(x,"yusuf",1080,905,0.8,{pose:"listen",t:tt,flip:true});
      const bw=rr_say(x,tt,-9,9e9,110,140,RR_Q,250,410);wc_tick(x,110+(bw||560)+44,196,56,GV.green,fin(tt,P.tick+0.3,0.6),6);}}]);
  wc_paperOver(ctx,S);});

// ---- 6 · Whose level? Each check needs its sixteen cubits, set by its owner: the learning team's warn on any, stop above five;
// Planning's stop on any difference; each owner signs; a rule nobody owns is ignored, then switched off ----
// drawn in the frame's own coordinates (1920 by 1080) whatever the camera does, so a card stays where it reads; and where a point of
// the place is in the frame
function rr_inFrame(ctx,cam,fn){const z=cam&&cam.z?cam.z:1;ctx.save();ctx.translate(cam.x,cam.y);ctx.scale(1/z,1/z);ctx.translate(-960,-540);fn(ctx);ctx.restore();}
const rr_toFrame=(cam,x,y)=>[(x-cam.x)*cam.z+960,(y-cam.y)*cam.z+540];
// Tom's card as it's made: the reason in once it's been said (why), the level typed in as it's said (lv, 0 to 1); "" leaves a line empty
function rr_tomCard(why,lv){const R=RR_RLT.rows,L=R[2][1];return{kicker:RR_RLT.kicker,title:RR_RLT.title,
  rows:[R[0],R[1],["Level",L.slice(0,Math.ceil(L.length*clamp(lv,0,1)))],["Why",why?R[3][1]:""]]};}
// the learning team's office: Tom behind his desk, the desk and its screen, what the screen shows, the poster's heading
function rr_tomDesk(x,tt,o,screen){gv_behind(x,"tom",RR_TX.seat[0],RR_TX.top,RR_TX.seat[1],Object.assign({pose:"listen",t:tt,flip:true},o||{}));
  x.drawImage(gv_place("tomDesk"),0,0,W,H);if(screen)screen(x);rr_tomPoster(x);}
// a rule card as the board shows it from a step away: its shape only (a title, four rows, a signature and a stamp, nothing to read);
// o.gaps lights its empty rows red, o.signed signs and stamps it, o.gold washes it gold, o.off greys it (each 0 to 1)
function rr_miniCard(ctx,x,y,w,o){o=o||{};const k=w/1000,h=(o.signed?610:518)*k,bar=(bx,by,bw,bh,col,a)=>{ctx.fillStyle=rgba(col,a);ctx.fillRect(bx*k,by*k,bw*k,bh*k);};
  ctx.save();ctx.translate(x,y);if(o.rot)ctx.rotate(o.rot);gv_sheet(ctx,0,0,w,h);gv_pin(ctx,w/2,10*k+4,GV.red,0.8);
  bar(48,52,220,16,WC_MUTED,0.4);bar(48,100,640,26,WC_DARK,0.55);bar(48,154,904,3,WC_MUTED,0.4);
  for(let i=0;i<4;i++){const ry=172+66*i;bar(48,ry+28,150,14,WC_MUTED,0.4);
    if(o.gaps&&o.gaps.includes(i)){ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba(wc_lit(GV.red,0.72),1);ctx.fillRect(346*k,(ry+8)*k,606*k,52*k);ctx.restore();bar(360,ry+56,592,3,GV.redInk,0.8);}
    else bar(360,ry+26,[380,300,460,520][i],16,WC_DARK,0.45);}
  if(o.signed){const sy=(172+264+14+58)*k;bar(48,172+264+14+40,120,14,WC_MUTED,0.4);ctx.save();ctx.strokeStyle=rgba(GV_SIGN.ink,0.85);ctx.lineWidth=Math.max(1.5,5*k);ctx.lineCap="round";
    ctx.beginPath();for(let i=0;i<=24;i++){const u=i/24,px=(372+300*u)*k,py=sy-10*k-Math.sin(u*14)*16*k*(1-u*0.4);if(i)ctx.lineTo(px,py);else ctx.moveTo(px,py);}ctx.stroke();ctx.restore();
    const sw=230*k,sh=74*k;ctx.save();ctx.translate(802*k,h-66*k);ctx.rotate(-0.05);ctx.drawImage(gv_stampRule(230,74,GV.greenInk),-sw/2-5*k,-sh/2-5*k,sw+10*k,sh+10*k);
    ctx.fillStyle=rgba(GV.greenInk,0.7);ctx.fillRect(-sw*0.32,-6*k,sw*0.64,12*k);ctx.restore();}
  gv_tint(ctx,0,0,w,h,GV.gold,0.45*(o.gold||0));gv_tint(ctx,0,0,w,h,GV.grey,0.7*(o.off||0));ctx.restore();}
scene("level",(ctx,S,t,sc)=>{const c=sc.cues,P=rr_once(sc,"P",()=>({at16:wAt(sc,"cubits","sixteen cubits"),card:c.who-0.3,lvQ:wAt(sc,"who","the level"),own:wAt(sc,"not","its owner"),
    desk:c.email-0.3,walk:wAt(sc,"email","one or two"),follow:wAt(sc,"email","follows them up"),chose:c.chose-0.3,warn:wAt(sc,"chose","warn on any"),stop:wAt(sc,"chose","stop"),
    five:wAt(sc,"chose","above five"),plan:c.planning-0.3,any:c.any,stops:wAt(sc,"any","stops it"),gov:wAt(sc,"any","because"),pcard:wAt(sc,"any","because")-0.4,
    csign:wAt(sc,"signs","with its level"),page:wAt(sc,"signs","writes it")-0.1,
    lone:c.ignored-0.3,ign:wAt(sc,"ignored","gets ignored"),off:wAt(sc,"ignored","switched off")}));
  const CX=300,CY=150,LX=1450,LY=200,TS=P.csign-0.1;
  gv_shots(ctx,S,t,sc.dur,[
    // for a moment, the Nilometer's column, as in the opening: the water reaches its sixteenth mark, which lights gold
    {at:0,place:"column",keys:[[0,960,560,1.04]],d:2,push:0.012,draw:(x,tt)=>{const L=rr_cub(lerp(15.6,15.95,easeCam(clamp((tt-0.3)/Math.max(0.6,P.at16-0.3),0,1))));
      rr_columnClose(x,tt,L,fin(tt,P.at16,0.6));rr_tagAt(x,tt,P.at16+0.1,null,1260,rr_waterY(RR_WL.close,rr_cub(16)),"16",{size:44,wash:GV.gold,washA:0.45});}},
    // Tom's desk from above: the learning team's rule card, its level and its reason still empty; who sets the level? Its owner
    {at:P.card,place:"tomTop",keys:[[P.card,960,540,1]],d:3,push:0.01,draw:(x,tt)=>
      rr_rule(x,CX,CY,1000,rr_tomCard(0,0),{p:clamp((tt-P.card-0.1)/1.0,0,1),signer:"",lit:{2:gv_io(tt,P.lvQ-0.1,P.own-0.3,0.4),0:fin(tt,P.own-0.1,0.4)}})},
    // Tom at his desk, the learning team's: one or two walk-ins a term; more means something broke. His screen shows the team's list
    {at:P.desk,place:"tom",keys:[[P.desk,960,540,1],[P.desk+0.1,900,500,1.08]],d:3,push:0.01,draw:(x,tt)=>{
      rr_tomDesk(x,tt,{pose:"listen",t:tt,nod:rr_nod(tt,P.walk+0.2),expr:"smile"},q=>rr_tomScreenList(q,1));
      rr_plate(x,tt,P.desk+0.4,null,1680,470,["Tom Whitfield","learning team"]);
      rr_say(x,tt,P.walk-0.1,9e9,560,140,["One or two walk-ins a term.","More means something broke."],1290,450);}},
    // the card again: the reason written in, then the level they chose, typed in as it's said; beside it, what the night does at
    // each count: none passes, one to five warn, six stops
    {at:P.chose,place:"tomTop",keys:[[P.chose,960,540,1]],d:3,push:0.01,draw:(x,tt)=>{const lv=clamp((tt-P.warn+0.1)/Math.max(0.6,P.five+0.4-P.warn),0,1);
      rr_rule(x,CX,CY,1000,rr_tomCard(1,lv),{signer:"",lit:{3:gv_io(tt,P.chose+0.2,P.warn-0.3,0.4),2:fin(tt,P.warn-0.2,0.4)}});
      rr_level(x,LX,LY,fin(tt,P.warn,0.5),fin(tt,P.stop,0.5),6*clamp((tt-P.warn)/Math.max(0.6,P.five-P.warn),0,1),RR_LV,"enrolments with no email");}},
    // Planning's room: Clara at her wall screen; any difference, and nobody ships
    {at:P.plan,place:"planning",keys:[[P.plan,1000,520,1.12],[P.plan+0.1,1250,560,1.35]],d:2.2,push:0,draw:(x,tt)=>{rr_planScreen(x,0);
      person(x,"clara",1400,905,0.8,{pose:"listen",pose2:"explain",mix:gv_io(tt,P.any-0.2,P.pcard,0.5),t:tt,flip:true});
      rr_plate(x,tt,P.plan+0.5,P.any-0.1,1640,330,["Clara Jensen","Planning"]);rr_say(x,tt,P.any,9e9,1440,190,["Any difference,","and nobody ships."],1410,470);}},
    // her card, on Planning's desk: the opposite level, stop on any difference, because that number goes to the government; each owner
    // signs: Clara first, and her card is stamped
    {at:P.pcard,place:"planTop",keys:[[P.pcard,960,540,1]],d:3,push:0.01,draw:(x,tt)=>withA(x,1-fin(tt,TS-0.3,0.25),()=>{
      rr_rule(x,CX,CY,1000,RR_RLC,{signer:"Clara Jensen",sign:clamp((tt-c.signs-0.05)/0.75,0,1),stamp:fin(tt,c.signs+0.85,0.3),lit:{2:gv_io(tt,P.pcard+0.2,P.gov+0.1,0.4),3:gv_io(tt,P.gov,c.signs-0.2,0.4)}});
      rr_level(x,LX,LY,1,1,6*fin(tt,P.pcard+0.3,0.8),RR_LVC,"differences from the census");})},
    // then Tom, on his desk: his card comes in, he signs, and it's stamped
    {at:TS,place:"tomTop",keys:[[TS,960,540,1]],d:3,push:0.01,draw:(x,tt)=>{const e=easeCam(clamp((tt-TS-0.15)/0.6,0,1));withA(x,clamp(e*1.6,0,1),()=>{
      rr_rule(x,lerp(CX+500,CX,e),CY,1000,RR_RLT,{signer:"Tom Whitfield",sign:clamp((tt-TS-0.75)/0.65,0,1),stamp:fin(tt,TS+1.45,0.3)});rr_level(x,LX,LY,1,1,null,RR_LV,"enrolments with no email");});}},
    // Jun's screen: the page of the night's checks; the two rules' lines light gold as the data team writes them into the checks
    {at:P.page,place:"screenData",keys:[[P.page,960,440,1.0]],d:2,push:0.01,draw:(x,tt,cam)=>
      rr_checks(x,{n:160,legend:1,lit:{5:fin(tt,P.page+0.4,0.5),6:fin(tt,P.page+0.7,0.5)},cam})},
    // the team's board, close: the two signed cards keep their gold; a third, with nobody beside it, its owner and its reason empty;
    // warning slips pile up against it, unread; then it's struck through, "off", and it goes grey
    {at:P.lone,place:"boardData",keys:[[P.lone,960,520,1.05]],d:2,push:0.01,draw:(x,tt)=>{const off=fin(tt,P.off+0.3,0.8),k=0.95,X0=760,Y0=120,
        tl=tw(x,RR_RLR.title,42,800)*k,tx=X0+48*k,ty=Y0+110*k,st=easeCam(clamp((tt-P.off)/0.5,0,1));
      rr_miniCard(x,290,130,380,{signed:1,gold:1,rot:-0.03});rr_miniCard(x,330,470,380,{signed:1,gold:1,rot:0.025});
      rr_rule(x,X0,Y0,1000*k,RR_RLR,{missA:1-0.6*off});gv_tint(x,X0,Y0,1000*k,518*k,GV.grey,0.6*off);
      if(st>0){x.save();x.strokeStyle=rgba(GV.redInk,0.9);x.lineWidth=5;x.lineCap="round";x.beginPath();x.moveTo(tx-8,ty);x.lineTo(tx-8+(tl+16)*st,ty-4*st);x.stroke();x.restore();}
      wc_hand(x,"off",tx+tl+34,ty+16,{size:48,w:700,col:GV.redInk,p:clamp((tt-P.off-0.4)/0.4,0,1)});
      rr_slips(x,1480,700,clamp((tt-P.ign+0.8)/2.4,0,1)*14,{grey:off});}}]);
  wc_paperOver(ctx,S);});

// ---- 7 · Tom reads his row: at Thursday's office hours; the amber cell he knows (a walk-in from February); the one he's never seen
// (emails as typed, cleaned every night downstream); nobody owned the warning; now it's his team's ----
// Yusuf's office with its things, as the earlier chapters left it
function rr_office(x){rr_officeScreen(x,"score");gv_deskBook(x);rr_binders(x,{gone9:true});rr_officeChart(x,1);rr_officeQ(x,1);}
scene("row",(ctx,S,t,sc)=>{const c=sc.cues,P=rr_once(sc,"P",()=>{const L=gv_skLay(ctx,[RR_SK15]);return{walk:0.3,reads:wAt(sc,"hours","Tom reads")-0.3,row:wAt(sc,"hours","the learning row"),
    knows:wAt(sc,"knows","he knows"),walkin:wAt(sc,"knows","a walk-in"),cert:wAt(sc,"knows","certificate"),never:wAt(sc,"never","never seen"),typed:wAt(sc,"never","emails typed"),
    spaces:wAt(sc,"never","spaces"),clean:c.cleans-0.3,cl:wAt(sc,"cleans","cleans them"),broke:wAt(sc,"cleans","nothing broke"),nobody:c.nobody-0.3,read:wAt(sc,"nobody","nobody read"),
    now:c.now,look:sc.ends.now+0.3,rowCam:[960,L.rows[4].top+178,1.55]};});
  gv_shots(ctx,S,t,sc.dur,[
    // Yusuf's office, a Thursday afternoon: a card on the open door, his office hours; Tom comes in and stands beside him at the screen
    {at:0,place:"office",keys:[[0,600,470,1.6],[0.6,800,540,1.15]],d:1.6,draw:(x,tt,cam)=>{rr_office(x);rr_hoursCard(x,1,cam.z);
      const wk=gv_walk(tt,P.walk,40,600,380);gv_walker(x,"tom",wk,905,0.8,wk.moving?{t:tt}:{t:tt,pose:"listen"});person(x,"yusuf",1000,905,0.8,{pose:"listen",t:tt,flip:true});}},
    // the scorecard on his screen, close on the learning row; the amber cell he knows lights, and an enrolment comes out of it: a
    // walk-in from February, whose certificate can't find an address; then the one he's never seen, and its two lines under Warnings
    {at:P.reads,place:"screenGov",keys:[[P.reads,...GV_SKV.all],[P.reads+0.2,...P.rowCam]],d:1.6,push:0,draw:(x,tt,cam)=>{
      const L=gv_scorecard(x,cam,{rows:RR_SK15,sections:RR_SEC15,date:"15 October 2026",hi:4,hiA:fin(tt,P.row,0.5)}),r=L.rows[4],cell=j=>[L.cx[j]+L.cw[j]/2,r.top+r.h/2];
      gv_halo(x,L.cx[1]-26,r.top-26,L.cw[1]+52,r.h+52,GV.amber,0.9*gv_io(tt,P.knows-0.1,P.never-0.3,0.4));
      gv_halo(x,L.cx[3]-26,r.top-26,L.cw[3]+52,r.h+52,GV.amber,0.9*fin(tt,P.never,0.4));
      rr_inFrame(x,cam,q=>{const ue=clamp((tt-P.walkin+0.3)/0.9,0,1),go=1-fin(tt,P.never-0.5,0.4);
        if(ue>0&&go>0.01){const [ax,ay]=rr_toFrame(cam,...cell(1)),e=easeCam(ue);withA(q,go,()=>rr_enrolCard(q,lerp(ax,500,e),lerp(ay,640,e),ue,{cert:fin(tt,P.cert,0.6)}));}});
      const s0=L.sec[0];[1,2].forEach(k=>gv_tint(x,GV_SK.x,s0.rows[k]-GV_SK.rh*0.74,GV_SK.w,GV_SK.rh,GV.amber,0.7*fin(tt,P.typed+0.25*k,0.4)));}},
    // one of those emails as it was typed, on the data team's board: spaces at each end, capitals; the night's clean-up passes it
    // through a sieve and it comes out tidy
    {at:P.spaces-0.4,place:"boardData",keys:[[P.spaces-0.4,960,470,1.0]],d:2,push:0.01,draw:(x,tt)=>{const dr=easeCam(clamp((tt-P.cl+0.2)/0.9,0,1));
      x.save();x.translate(0,170*dr);x.translate(960,240);x.scale(1-0.5*dr,1-0.5*dr);x.translate(-960,-240);rr_typed(x,707,250,fin(tt,P.spaces-0.2,0.4)*(1-fin(tt,P.cl+0.5,0.3)));x.restore();
      x.save();x.translate(960,470);x.scale(1.6,1.6);rr_sieve(x,0,0,fin(tt,P.clean,0.4));x.restore();rr_clean(x,730,720,fin(tt,P.cl+0.6,0.5));
      rr_tagAt(x,tt,P.broke,null,960,820,"cleaned downstream, every night",{size:32,wash:GV.green,washA:0.25});}},
    // old warning slips on the data team's desk, one for every night, each with nobody's name; then the learning team's on the stack
    {at:P.nobody,place:"junTop",keys:[[P.nobody,960,560,1.45]],d:3,push:0.01,draw:(x,tt)=>rr_slips(x,960,720,clamp((tt-P.nobody)/1.6,0,1)*30,{owner:1,mine:fin(tt,P.now,0.5)})},
    // the office again: Tom looks up at Yusuf
    {at:P.look,place:"office",keys:[[P.look,800,540,1.15]],d:2,draw:(x,tt,cam)=>{rr_office(x);rr_hoursCard(x,1,cam.z);
      person(x,"tom",600,905,0.8,{pose:"listen",t:tt,nod:rr_nod(tt,P.look+0.5)});person(x,"yusuf",1000,905,0.8,{pose:"listen",t:tt,flip:true,nod:rr_nod(tt,P.look+0.9)});}}]);
  wc_paperOver(ctx,S);});

// ---- 8 · A check, or a list? Following up the walk-ins is about what people do: a list the team works through, not a check ----
scene("list",(ctx,S,t,sc)=>{const c=sc.cues,P=rr_once(sc,"P",()=>({cards:c.people-0.3,ppl:wAt(sc,"people","what people do"),data:wAt(sc,"people","not the data"),
    list:wAt(sc,"people","a list"),works:wAt(sc,"people","works through")}));
  gv_shots(ctx,S,t,sc.dur,[
    // Tom's screen: the team's follow-up list, a plain page made every night with the rest; its one row today, the walk-in from February
    {at:0,place:"screenLearn",keys:[[0,960,440,1.0]],d:2,push:0.012,draw:(x,tt,cam)=>rr_list(x,RR_L1,{cam,lit:{0:fin(tt,0.8,0.5)}})},
    // two cards on his desk: a list, about what people do; a check, about the data, which can stop the update; the list lights
    {at:P.cards,place:"tomTop",keys:[[P.cards,960,540,1]],d:3,push:0.01,draw:(x,tt)=>
      rr_twoCards(x,fin(tt,P.data-0.2,0.6),fin(tt,P.ppl-0.2,0.6),0,fin(tt,P.list,0.5))},
    // the list again: Tom types a note on the row
    {at:P.works-0.3,place:"screenLearn",keys:[[P.works-0.3,960,440,1.0]],d:2,push:0.012,draw:(x,tt,cam)=>rr_list(x,RR_L1,{cam,note:clamp((tt-P.works)/1.4,0,1)})}]);
  wc_paperOver(ctx,S);});

// ---- 9 · One red night: five more walk-ins with no email make six; the check fails and everything built from the short courses keeps
// yesterday's numbers; the morning's red cell and issue; the team's list and the six registered by noon; that night, green ----
// the last nine lines of the night's page, the email check failed
const RR_CKF=RR_CK.slice(151).map((l,i)=>i===RR_CKI.email?["Every short-course enrolment has an email","fail","6 without"]:l);
scene("night",(ctx,S,t,sc)=>{const c=sc.cues,P=rr_once(sc,"P",()=>({scr:1.4,more:wAt(sc,"five","five more"),
    noE:wAt(sc,"five","with no email"),over:wAt(sc,"six","over"),fails:wAt(sc,"six","fails"),big:wAt(sc,"six","the check fails"),board:c.stops-0.3,stop:wAt(sc,"stops","stops"),
    plan:wAt(sc,"stops","Planning's"),morn:c.morning-0.4,red:wAt(sc,"morning","one red cell"),log:wAt(sc,"morning","an issue")-0.3,date:wAt(sc,"morning","with a date"),
    tom:c.tom-0.3,chose:c.chose-0.3,list:c.list-0.3,noon:c.noon-0.4,reg:wAt(sc,"noon","registered"),green:c.green-0.4,gr:wAt(sc,"green","green"),close:sc.ends.green+0.4}));
  const [LX,LY,LW]=RR_TT.log;
  gv_shots(ctx,S,t,sc.dur,[
    // the data team's room at night
    {at:0,place:"data",keys:[[0,1300,540,1.1],[0.1,1340,540,1.14]],d:3,push:0.01,draw:x=>rr_night(x,1)},
    // the page of the night's checks: the count of enrolments with no email runs from one to six, red at six, over five; the line
    // fails, and grows to fill the screen
    {at:P.scr,place:"screenData",keys:[[P.scr,960,440,1.0]],d:2,push:0.01,draw:(x,tt,cam)=>{rr_nightAround(x,1);const f=fin(tt,P.fails-0.3,0.3);
      rr_checks(x,{n:160,legend:1,cam,lines:f>0.5?RR_CKF:null,fade:0.85*fin(tt,P.big+0.2,0.5)});
      rr_counter(x,1+5*clamp((tt-P.more)/Math.max(0.8,P.noE+0.6-P.more),0,1),fin(tt,P.scr+0.3,0.5)*(1-fin(tt,P.big+0.2,0.4)),fin(tt,P.over,0.5));
      rr_bigLine(x,fin(tt,P.big+0.3,0.9),{count:6,state:"fail"});}},
    // the reports built from the short courses, on the team's board, each held with yesterday's numbers; Planning's last
    {at:P.board,place:"boardData",keys:[[P.board,960,480,1.0]],d:2,push:0.012,draw:(x,tt)=>{
      rr_covers(x,[fin(tt,P.stop,0.4),fin(tt,P.plan,0.4),fin(tt,P.stop+0.45,0.4),fin(tt,P.stop+0.9,0.4)]);rr_night(x,0.4,[]);}},
    // the morning: the scorecard of the 19th, wide; one red cell, the learning team's completeness, and grey where nothing was checked;
    // then close, the learning row lit
    {at:P.morn,place:"screenGov",keys:[[P.morn,...GV_SKV.all],[P.red-0.6,...RR_SKCAM]],d:1.6,push:0,draw:(x,tt,cam)=>{
      const L=rr_scorecard(x,cam,{rows:RR_SK19,sections:RR_SEC19,date:"19 October 2026",hi:4,hiA:fin(tt,P.red,0.5)}),r=L.rows[4];
      rr_glow(x,L.cx[1]+6,r.top+2,L.cw[1]-12,r.h-5,GV.red,0.9*fin(tt,P.red,0.4),14);}},
    // Tom's desk: the issue log; the night's failure is written in, with its owner and a date, and lit
    {at:P.log,place:"tomTop",keys:[[P.log,960,540,1]],d:3,push:0.01,draw:(x,tt)=>rr_issueLog(x,LX,LY,LW,{write:clamp((tt-P.log-0.3)/1.3,0,1),hiA:fin(tt,P.date,0.5)})},
    // Tom reads it: six; something broke
    {at:P.tom,place:"tom",keys:[[P.tom,900,500,1.08]],d:2,push:0.01,draw:(x,tt)=>{rr_tomDesk(x,tt,{expr:"concerned",nod:rr_nod(tt,P.tom+1.0)},q=>rr_tomScreenList(q,6));
      rr_say(x,tt,P.tom+0.4,9e9,700,170,["Six. Something broke."],1290,450);}},
    // his team's card: the level they chose, and its reason
    {at:P.chose,place:"tomTop",keys:[[P.chose,960,540,1]],d:3,push:0.01,draw:(x,tt)=>{const e=easeCam(clamp((tt-P.chose-0.1)/0.9,0,1));
      withA(x,clamp(e*1.6,0,1),()=>rr_rule(x,lerp(1100,460,e),150,1000,RR_RLT,{signer:"Tom Whitfield",stamp:1,rot:0.015,lit:{2:fin(tt,P.chose+0.7,0.5),3:fin(tt,P.chose+1.2,0.5)}}));}},
    // the team's list now holds six: the walk-in from February, and five First Aid enrolments from last night
    {at:P.list,place:"screenLearn",keys:[[P.list,960,440,1.0]],d:2,push:0.01,draw:(x,tt,cam)=>rr_list(x,RR_L6,{cam,rowA:RR_L6.map((r,i)=>i?fin(tt,P.list+0.4+0.22*i,0.35):1)})},
    // by noon: each enrolment gets its email, and a learner registered
    {at:P.noon,place:"tomTop",keys:[[P.noon,960,540,1]],d:3,push:0.01,draw:(x,tt)=>{
      rr_sixCards(x,RR_L6.map((r,i)=>clamp((tt-P.reg-0.1-0.42*i)/0.6,0,1)),fin(tt,P.noon+0.1,0.6));rr_clock(x,1800,300,fin(tt,P.noon+0.2,0.5));}},
    // that night: the cell washes back to green, and the grey fills in
    {at:P.green,place:"screenGov",keys:[[P.green,...RR_SKCAM]],d:2,push:0.01,draw:(x,tt,cam)=>{const mx=clamp((tt-P.gr+0.2)/1.2,0,1);
      rr_scorecard(x,cam,{rows:RR_SK19,after:RR_SK20,mx,sections:RR_SEC19,afterSections:RR_SEC20,date:mx<0.5?"19 October 2026":"20 October 2026",hi:4,hiA:1});}},
    // the issue log: the failure's line closed
    {at:P.close,place:"tomTop",keys:[[P.close,960,540,1]],d:3,push:0.01,draw:(x,tt)=>rr_issueLog(x,LX,LY,LW,{hiA:1,stamp:fin(tt,P.close+0.4,0.4)})}]);
  wc_paperOver(ctx,S);});

// ---- 10 · Measured, not surveyed: binder 9's line runs now; a rule without an owner is sent back; like the Nilometer, a measure, not a
// guess: each morning, what to trust, what's held back and who fixes it; binder 15 next; the lesson ----
// Mei's card, sent back without an owner, and back again with one
const RR_RLM={kicker:"Quality rule",title:"Every award has a date",rows:[["Owner","Mei Tanaka, registrar's office"],RR_RLA.rows[1],RR_RLA.rows[2],RR_RLA.rows[3]]};
// on the printout, drawn in its own coordinates: a pale veil over the table (a, 0 to 1), but not over the cells lit (lit(cell, row,
// column), 0 to 1): the green ones, then the grey ones, then the one red cell stand out in turn
function rr_prFocus(ctx,L,rows,lit,a){if(a<=0.01)return;const K=GV_SK,box=(i,j)=>{const r=L.rows[i];return[L.cx[j]+6,r.top+2,L.cw[j]-12,r.h-5];};ctx.save();ctx.fillStyle=rgba(GV.screen,1);
  ctx.globalAlpha=0.72*a;ctx.beginPath();ctx.rect(K.x-10,K.y-34,K.w+20,L.bottom-K.y+42);
  rows.forEach((row,i)=>{for(let j=1;j<=GV_SKD.length;j++)if(gv_skCell(row[j]))ctx.rect(...box(i,j));});ctx.fill("evenodd");
  rows.forEach((row,i)=>{for(let j=1;j<=GV_SKD.length;j++){const c=gv_skCell(row[j]),u=c?0.72*a*(1-clamp(lit(c,i,j),0,1)):0;if(u<=0.01)continue;ctx.globalAlpha=u;ctx.fillRect(...box(i,j));}});
  ctx.restore();}
scene("measured",(ctx,S,t,sc)=>{const c=sc.cues,P=rr_once(sc,"P",()=>({runs:wAt(sc,"runs","runs now"),every:wAt(sc,"runs","every rule"),level:wAt(sc,"runs","a level"),
    score:wAt(sc,"runs","a scorecard"),ran:wAt(sc,"runs","what ran"),back:c.back-0.4,own:wAt(sc,"back","an owner"),sent:wAt(sc,"back","sent back"),swap:sc.ends.back+0.25,
    board:c.like-0.05,nilo:wAt(sc,"like","the Nilometer"),measure:wAt(sc,"like","a measure"),guess:wAt(sc,"like","not a guess"),knows:c.knows,trust:wAt(sc,"knows","which data"),held:wAt(sc,"knows","what's held back"),
    fix:wAt(sc,"knows","who fixes it"),shelf:c.next-0.4,film:wAt(sc,"next","the next film"),end:c.lesson-0.3}));
  gv_shots(ctx,S,t,sc.dur,[
    // binder 9's page: a green highlighter goes behind its line as it runs now, and Yusuf writes beside it, one by one
    {at:0,place:"policy",keys:[[0,960,500,1],[0.1,900,470,1.06]],d:3,push:0.01,draw:(x,tt)=>rr_policy9(x,{hi:clamp((tt-P.runs)/1.2,0,1),
      notes:[clamp((tt-P.every)/1.4,0,1),clamp((tt-P.level)/1.2,0,1),clamp((tt-P.score)/1.3,0,1),clamp((tt-P.ran-0.2)/1.3,0,1)]})},
    // a new rule card comes back to Jun's desk: no owner, so it's sent back; then the same card again, its owner written in, signed
    {at:P.back,place:"junTop",keys:[[P.back,960,540,1]],d:3,push:0.01,draw:(x,tt)=>{const sw=easeCam(clamp((tt-P.swap)/0.5,0,1)),cin=easeCam(clamp((tt-P.back-0.1)/0.8,0,1));
      if(sw<1)withA(x,clamp(cin*1.6,0,1)*clamp((1-sw)*1.6,0,1),()=>rr_rule(x,lerp(lerp(1100,460,cin),-200,sw),110,1000,RR_RLA,{missA:fin(tt,P.own-0.1,0.4),ask:{0:"needs an owner"},
        askP:clamp((tt-P.own-0.2)/0.8,0,1),stampKind:"sent back",stamp:fin(tt,P.sent,0.3)}));
      if(sw>0)withA(x,clamp(sw*1.6,0,1),()=>rr_rule(x,lerp(1100,460,sw),130,1000,RR_RLM,{signer:"Mei Tanaka",sign:clamp((tt-P.swap-0.45)/0.45,0,1),stamp:fin(tt,P.swap+0.95,0.25)}));}},
    // Yusuf's board: the survey's chart on the left, the red morning's scorecard printed on the right; between them, for a moment, the
    // column with its gold mark. Then close on the printout: what it can trust, what's held back, and who fixes it
    {at:P.board,place:"boardGov",keys:[[P.board,950,460,1.15],[P.knows-0.3,1260,455,1.5]],d:1.8,push:0,draw:(x,tt,cam)=>{
      rr_chart(x,250,273,0.52,{bars:1,avg:1,z:cam.z,pencil:fin(tt,P.guess,0.7)});
      const wT=gv_io(tt,P.trust-0.1,P.held,0.4),wH=gv_io(tt,P.held-0.1,P.fix,0.4),wF=fin(tt,P.fix-0.1,0.4),
        L=rr_printout(x,cam,{fn:(q,L)=>{rr_prFocus(q,L,RR_SK19,(c,i,j)=>(c.state==="pass"?wT:0)+(c.state==="skip"?wH:0)+(i===4&&j===1?wF:0),fin(tt,P.trust-0.1,0.4));
          const r=L.rows[4];rr_glow(q,L.cx[1]+6,r.top+2,L.cw[1]-12,r.h-5,GV.red,wF,16);}});
      rr_vignette(x,760,460,130,gv_io(tt,P.nilo-0.1,P.measure+0.7,0.5));
      // the tags: above the printout; among the grey cells, on the rows between them; and just right of the red cell
      const pt=rr_prPt,r4=L.rows[4],r6=L.rows[6],r8=L.rows[8];
      rr_tagAt(x,tt,P.trust,P.held-0.1,1243,200,"can trust",{size:30,wash:GV.green,washA:0.3});
      rr_tagAt(x,tt,P.held,P.fix-0.1,pt(GV_SK.x+GV_SK.w/2,0)[0],pt(0,(r6.top+r8.top+r8.h)/2)[1],"held back",{size:30,wash:GV.grey,washA:0.4});
      rr_tagAt(x,tt,P.fix,null,pt(L.cx[2]+4,0)[0],pt(0,r4.top+r4.h/2)[1],"Learning team",{size:30,wash:GV.gold,washA:0.4,align:"left"});}},
    // his shelf: gaps where binders 2, 12, 6 and now 9 stood, each taken to the work; he takes down binder 15
    {at:P.shelf,place:"office",keys:[[P.shelf,1500,520,1.3]],d:2,draw:(x,tt)=>{const got=tt>=P.film+0.5;rr_officeScreen(x,"score");gv_deskBook(x);
      rr_binders(x,{gone9:true,gone15:got,out15:fin(tt,P.film-0.2,0.5)});rr_officeChart(x,1);rr_officeQ(x,1);
      person(x,"yusuf",1620,905,0.8,got?{pose:"reach",pose2:"hold",mix:fin(tt,P.film+0.5,0.5),t:tt,carry:rr_heldBinder(["Fixed","where it","starts"],RR_B15)}:
        {pose:"listen",pose2:"reach",mix:fin(tt,P.film-0.4,0.5),t:tt});}}]);
  gv_end(ctx,S,t,P.end,"Rules that run","A quality rule is a check with an owner.","Film 5 of 19");
  wc_paperOver(ctx,S);});
