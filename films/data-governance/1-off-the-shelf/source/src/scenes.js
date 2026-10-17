/* ===== Off the shelf: the ten chapters =====
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

// ---- 1 · One measure: from a market in 1215 to an inspector in the 1880s ----
// the wine stall's three measures, era by era: never the same three
const OS_JUGS=[[0.32,0.24,0.4],[0.26,0.38,0.3],[0.4,0.28,0.22],[0.3,0.34,0.26],[0.24,0.42,0.33]];
function os_jugs(ctx,era,a,k){[230,330,440].forEach((x,j)=>{const h=OS_JUGS[era][j]*200;withA(ctx,a,()=>{ctx.save();ctx.translate(x,OS_MK.wine[2]+4);ctx.scale(k,k);os_jugAt(ctx,0,0,h*0.62,h);ctx.restore();});});}
// the clerk's gallon, carried in both hands
function os_heldGallon(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.drawImage(os_gallonC(),mx-60,my-112);fingers(cx,P_,[[mx-36,my-26],[mx+36,my-26]]);}
// a hand set level with the scale's pan, holding the weight out over it
POSE.os_place={L:[0.14,-0.06],R:[1.2,-4.38],hand:"open",feet:30,shift:4,tilt:-0.03,turn:0.22,gaze:[0.7,0.3],look:1};

scene("measure",(ctx,S,t,sc)=>{const c=sc.cues,P=os_once(sc,"P",()=>{const again=wAt(sc,"three","again and");
    return{years:[0,1,2,3].map(i=>c.repeat+0.2+1.3*i),hall:c.kings-0.4,y1871:wAt(sc,"county","In eighteen")-0.5,shop:c.worked-0.4,close:again-0.3,
      hits:[again+0.19,again+0.79,c.breath-0.555],title:c.breath+0.7,magna:wAt(sc,"m1215","Magna"),stds:wAt(sc,"kings","standards"),officers:wAt(sc,"kings","Officers"),
      now:wAt(sc,"kings","now and"),bushel:wAt(sc,"county","bushel"),thirty:wAt(sc,"county","thirty"),copy:wAt(sc,"three","a copy"),insp:wAt(sc,"three","an inspector"),
      chk:wAt(sc,"three","checked"),law:wAt(sc,"three","with the law")};});
  const mk=[[0,"England · 1215"],...P.years.map((y,i)=>[y,["England · 1225","England · 1297","England · 1640","England · 1824"][i]]),[P.hall,"England · 1497"],[P.y1871,"England · 1871"],[P.shop,"England · 1880s"]];
  gv_shots(ctx,S,t,sc.dur,[
    // 1215: the sheriff's crier reads the charter at the market cross; the stalls listen
    {at:0,place:"market",keys:[[0,960,540,1],[c.quote-0.8,940,480,1.16]],d:3.4,draw:(x,tt)=>{const M=OS_MK;
      person(x,"miller",1460,880,0.64,{pose:"listen",t:tt,flip:true});os_jugs(x,0,1,1);os_proclaim(x,M.wine[1]-14,470,0,1);
      person(x,"vintner",650,872,0.6,{pose:"listen",t:tt,flip:true});person(x,"crier",M.crier,M.step+4,0.58,{pose:"hold",t:tt,carry:heldScroll});
      person(x,"buyer",1130,915,0.64,{pose:"listen",t:tt});person(x,"alewife",760,940,0.66,{pose:"hold",t:tt,carry:heldJug,flip:true});
      os_tagAt(x,tt,P.magna-0.1,P.years[0]-0.6,620,250,"Magna Carta");
      const q=gv_io(tt,c.quote-0.1,P.years[0]-0.5,0.35);gv_say(x,1000,150,["One measure of wine","throughout our kingdom."],934,360,{a:q,k:0.92+0.08*spring(fin(tt,c.quote-0.1,0.5))});}},
    // the centuries pass at the wine stall: the charter read again, the measures still not the same
    {at:P.years[0]-0.3,place:"market",keys:[[P.years[0]-0.3,500,560,1.9],[P.years[3]+0.4,470,580,1.98]],d:2.6,push:0,draw:(x,tt)=>{let e=0;P.years.forEach((y,i)=>{if(tt>=y)e=i+1;});
      const u=e>0?fin(tt,P.years[e-1],0.45):1;if(u<1)os_jugs(x,e-1,1-u,1);os_jugs(x,e,u,0.6+0.4*spring(u));
      let f=1,seal=1;P.years.forEach(y=>{const v=(tt-(y-0.3))/0.6;if(v>0&&v<1){f=v;seal=0;}else if(v>=1&&v<1.8)seal=spring(clamp((v-1)/0.6,0,1));});
      os_proclaim(x,OS_MK.wine[1]-14,470,f>=1?0:f,seal);}},
    // 1497: the king's standards in the market hall's cupboard; the clerk of the market takes the gallon to a trader's jug
    {at:P.hall,place:"hall",keys:[[P.hall,960,560,1.04],[P.officers,1060,590,1.12]],d:2.6,draw:(x,tt)=>{const [cx,cy,cw]=OS_HL.cup,take=P.officers-0.6,
        g=fin(tt,P.stds-0.3,0.6),u=clamp((tt-take)/0.55,0,1),w=gv_walk(tt,P.officers+0.1,860,1150,260),near=fin(tt,P.now-0.4,0.5);
      os_standards(x,u>0,g);os_tagAt(x,tt,P.stds-0.3,P.officers-0.3,cx+cw/2,cy-62,"the king's standards");
      person(x,"trader",1390,930,0.78,{pose:"hold",t:tt,carry:heldJug,flip:true});
      if(u>0&&u<1){const a=easeCam(u),gx=lerp(cx+215+60,w.x-22,a),gy=lerp(cy+120+70,700,a)-90*Math.sin(Math.PI*a);x.drawImage(os_gallonC(),gx-60,gy-70);}
      if(tt<P.officers+0.1)person(x,"clerk",860,960,0.8,{pose:"stand",pose2:"reach",mix:clamp((tt-take)/0.4,0,1)*(1-fin(tt,take+0.55,0.3)),t:tt,flip:true,carry:u>=1?os_heldGallon:null});
      else gv_walker(x,"clerk",w,960,0.8,{t:tt,carry:os_heldGallon,pose:near>0?"hold":null});
      os_tagAt(x,tt,P.now-0.3,null,1270,250,"checked now and then");}},
    // 1871: a corn exchange, and one county's bushels, every one a different size
    {at:P.y1871,place:"exchange",keys:[[P.y1871,960,540,1],[P.thirty,960,520,1.06]],d:2.4,draw:(x,tt)=>{
      person(x,"grocer",1640,880,0.74,{pose:"listen",t:tt,flip:true});os_exTable(x);
      [124,150,96,170,112,140].forEach((h,i)=>{const t0=P.bushel-0.3+2.2*i/7,u=fin(tt,t0,0.5),bx=330+i*250;if(u<=0)return;const k=spring(u);
        x.save();x.translate(bx,OS_EX.table[2]+4);x.scale(k,k);os_measureAt(x,0,0,h*1.1,h*0.8);x.restore();
        os_tagAt(x,tt,t0+0.15,null,bx,OS_EX.table[2]-h*0.8-52,"bushel",{size:28});});
      os_tagAt(x,tt,P.thirty-0.15,null,960,190,"32 measures in one county",{size:34});}},
    // the 1880s: a grocer's shop: the law on the counter, a copy in the inspector's case, the inspector checking the shop's weight
    {at:P.shop,place:"shop",keys:[[P.shop,960,540,1],[P.insp,1060,520,1.06]],d:2.4,draw:(x,tt)=>{const top=OS_SH.counter[2],land=P.chk+0.5,
        tilt=tt<land?-0.2:-0.2*Math.exp(-(tt-land)*3)*Math.cos((tt-land)*9);
      person(x,"grocer",440,860,0.78,{pose:"listen",t:tt});os_counter(x);os_act(x,650,top+6);
      os_scaleAt(x,OS_SH.scale,top+4,tilt,(q,ex,ey)=>os_iron(q,ex,ey,0),tt>=land?(q,ex,ey)=>os_brass(q,ex,ey):null);
      os_case(x,1712,905,fin(tt,P.copy-0.3,0.6));
      const m=clamp((tt-(P.chk-0.4))/0.5,0,1),back=fin(tt,land+0.3,0.5);
      person(x,"inspector",1380,905,0.86,{pose:"hold",pose2:"os_place",mix:m*(1-back),t:tt,flip:true,wide:true,carry:tt<land?heldWeight:null});
      os_tagAt(x,tt,c.three,null,650,500,"one definition, in law");os_tagAt(x,tt,P.copy-0.05,null,1712,652,"a copy in every county");
      os_tagAt(x,tt,P.insp-0.05,null,1380,186,"an inspector who checks");}},
    // close: his mark on each weight, again and again, with the law beside him
    {at:P.close,place:"stamp",keys:[[P.close,960,540,1]],push:0.03,draw:(x,tt)=>{const s=OS_ST.s,ws=OS_ST.weights,y=OS_ST.base,h=P.hits,[ax,ay,as]=OS_ST.act;
      gv_halo(x,ax-200*as,ay-150*as,400*as,170*as,GV.gold,0.9*fin(tt,P.law-0.1,0.8));
      ws.forEach((wx,i)=>os_iron(x,wx,y,fin(tt,h[i],0.25),s));
      // the tools go from weight to weight between the blows, lifting as they go
      const leg=(a,b,t0,t1)=>{const v=clamp((tt-t0)/(t1-t0),0,1);return[lerp(a,b,easeCam(v)),80*Math.sin(Math.PI*v)];},
        [tx,lift]=tt<h[1]-0.2?leg(ws[0],ws[1],h[0]+0.08,h[1]-0.16):leg(ws[1],ws[2],h[1]+0.25,h[2]-0.55),u=Math.max(...h.map(hh=>os_strike(tt,hh-0.21,0.6))),
        away=easeCam(clamp((tt-h[2]-0.35)/1.1,0,1));
      // done: the hands go, and the last mark shows
      x.save();x.translate(300*away,860*away);os_markTools(x,tx,y,s,u,lift);x.restore();}}]);
  os_pill(ctx,t,mk,fin(t,0.6,0.5)*(1-fin(t,P.close,0.4)));
  gv_title(ctx,S,t,P.title,"Off the shelf","where a policy meets the work","Film 1 of 16 · data governance");
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
    // his office: the shelf of binders, 34 policies, and the score on the wall
    {at:P.b,place:"office",keys:[[P.b,1100,560,1.2],[P.b+0.1,1180,540,1.32]],d:5,draw:(x,tt)=>{const [sx,sy,sw,sh]=GV_OFF.score;
      os_chartSmall(x,0);gv_halo(x,sx-30,sy-30,sw+60,sh+60,GV.gold,0.85*gv_io(tt,P.mat-0.1,P.ch,0.5));os_score(x);os_binders(x);os_deskBox(x);
      person(x,"yusuf",1190,895,0.8,{pose:"listen",t:tt});os_tagAt(x,tt,P.thirty-0.2,null,1621,290,"34 data policies");}},
    // the chart, close: half its names are still to be confirmed
    {at:P.ch,place:"boardGov",keys:[[P.ch,960,520,1],[P.ch+0.1,960,500,1.05]],d:4,push:0,draw:(x,tt)=>os_chart(x,k=>fin(tt,P.half-0.2+2.2*k/8,0.3))},
    // the council's minutes: the same action, carried forward again
    {at:P.co,place:"desk",keys:[[P.co,960,560,1],[P.co+0.1,960,520,1.08]],d:3.2,draw:(x,tt)=>os_minutes(x,fin(tt,P.once-0.16,0.3))},
    // the office again: Yusuf has taken binder 12 down; David, at the door, gives him his brief
    {at:P.br,place:"office",keys:[[P.br,960,540,1],[P.br+0.1,940,540,1.04]],d:4,draw:(x,tt)=>{
      os_chartSmall(x,1);os_score(x);os_binders(x,{missing:i=>i===11});os_deskBox(x);
      person(x,"david",190,868,0.8,{pose:"explain",t:tt});person(x,"yusuf",1240,905,0.8,{pose:"hold",expr:"worried",t:tt,flip:true,carry:heldBinder("12",os_bindCol(11))});
      const q=c.brief+0.1;gv_say(x,250,190,["Can you fix governance","before the submission?"],205,400,{a:fin(tt,q,0.35),k:0.92+0.08*spring(fin(tt,q,0.5))});}}]);
  // today, and who Yusuf is
  wc_year(ctx,56,72,"Today",fin(t,0.3,0.5)*(1-fin(t,P.b,0.4)));os_nameCard(ctx,470,560,"Yusuf Demir","data governance lead",gv_io(t,c.starts+0.3,P.b-0.3,0.4));
  wc_paperOver(ctx,S);});

// ---- 3 · Two numbers: Planning's report and the draft submission don't agree ----
// the floor: the people at work behind the glass (o.out leaves someone out), then the glass, then the offices' names (a name the
// frame would cut fades out)
const OS_AT={clara:0,mei:1,yusuf:2,jun:3,sam:4},OS_WORK={clara:{pose:"reach"},mei:{pose:"hold",carry:heldNotebook},jun:{pose:"reach"},sam:{pose:"phone"}};
function os_floor(x,tt,o){o=o||{};const F=GV_FL;Object.keys(OS_AT).forEach(id=>{const i=OS_AT[id];if(id==="yusuf"?!o.yusufIn:(o.out||[]).includes(id))return;
    person(x,id,F.spot(i),806,0.5,Object.assign({pose:"stand",t:tt,flip:i%2===1},OS_WORK[id]||{},(o.pose||{})[id]||{}));});
  gv_floorGlass(x);const m=x.getTransform(),vl=-m.e/m.a,vr=(x.canvas.width-m.e)/m.a,a=o.names==null?1:o.names;
  F.rooms.forEach((r,i)=>{const cx=F.x(i)+F.w/2,hw=tw(x,r[1],30,800)/2+6;gv_floorName(x,i,a*clamp(Math.min(cx-hw-vl,vr-cx-hw)/30,0,1));});}

scene("numbers",(ctx,S,t,sc)=>{const c=sc.cues,P=os_once(sc,"P",()=>({pl:c.census-0.6,rg:c.draft-0.6,wh:c.which-0.6,
    four1:wAt(sc,"census","four"),four2:wAt(sc,"draft","four")}));
  gv_shots(ctx,S,t,sc.dur,[
    // the same week: Yusuf walks down the floor, past the offices where the work is done
    {at:0,place:"floor",keys:[[0,1080,560,1.14],[0.3,760,560,1.14]],d:3.0,draw:(x,tt)=>{const w=gv_walk(tt,0.3,1180,640,190);
      os_floor(x,tt,{names:fin(tt,0.4,0.6)});gv_walker(x,"yusuf",w,GV_FL.walk,0.62,{t:tt,flip:true});}},
    // Planning: Clara shows him the census report
    {at:P.pl,place:"planning",keys:[[P.pl,900,540,1.1],[P.pl+0.1,880,520,1.16]],d:5,draw:(x,tt)=>{os_census(x,fin(tt,P.four1-0.1,0.5));
      person(x,"clara",440,905,0.8,{pose:"point",t:tt});person(x,"yusuf",1270,905,0.8,{pose:"listen",t:tt,flip:true});}},
    // the registrar's office: Mei holds up the draft submission
    {at:P.rg,place:"registrar",keys:[[P.rg,1180,540,1.12],[P.rg+0.1,1200,520,1.18]],d:5,draw:(x,tt)=>{
      person(x,"mei",1000,905,0.84,{pose:"hold",t:tt,carry:os_draft(fin(tt,P.four2-0.1,0.5))});person(x,"yusuf",1290,905,0.8,{pose:"listen",t:tt,flip:true});}},
    // the floor again: two reports, two numbers, and Yusuf between them
    {at:P.wh,place:"floor",keys:[[P.wh,700,540,1.22],[P.wh+0.1,690,530,1.28]],d:4,draw:(x,tt)=>{const F=GV_FL;
      os_floor(x,tt,{pose:{clara:{pose:"listen"},mei:{pose:"listen"}}});
      person(x,"yusuf",F.x(1)-16,F.walk,0.62,{pose:"stand",expr:"concerned",t:tt});
      [[0,"census report","4,812 awards"],[1,"draft submission","4,867 awards"]].forEach(([i,a,b],k)=>os_glassCard(x,tt,i,P.wh+0.1+0.15*k,[a,b]));
      gv_qmark(x,F.x(1)-16,F.walk-0.62*560-50,96,fin(tt,c.which+0.1,0.6));}}]);
  wc_paperOver(ctx,S);});

// ---- 4 · Who decides? Both numbers are right; no one has decided how ours maps to the government's ----
// something carried in both hands while walking: the arms stay, the legs step
POSE.os_carry=Object.assign({},POSE.os_box,{gaze:[0.3,0.1],turn:0.06});
function os_carrier(x,id,w,y,s,carry,o){person(x,id,w.x,y-w.bob,s,Object.assign({pose:"os_carry",pose2:w.moving?(w.swing>0?"os_boxA":"os_boxB"):null,mix:Math.abs(w.swing),flip:w.flip,carry},o||{}));}
// a card on an office's glass on the floor: two lines, coming in at t0
function os_glassCard(x,tt,i,t0,lines,o){o=o||{};const u=fin(tt,t0,0.45);if(u<=0)return;const F=GV_FL,k=0.92+0.08*spring(u),sz=o.size||30,h=82+(lines.length-1)*(sz+12);
  x.save();x.translate(F.x(i)+F.w/2,F.top+(o.top||250)+h/2);x.scale(k,k);withA(x,u,()=>gv_card(x,-F.w/2+(o.pad||22),-h/2,F.w-2*(o.pad||22),h,lines,{size:sz,align:"center",pin:false,y0:52,wash:o.wash||OS_NUM,washA:o.washA||0.14}));x.restore();}

scene("decides",(ctx,S,t,sc)=>{const c=sc.cues,P=os_once(sc,"P",()=>({b1:c.both-0.5,s:c.monday-0.6,b3:c.before-0.6,cc:c.gov-0.6,d:c.answers-0.6,e:c.tbc-0.6,
    right:wAt(sc,"both","right"),word:wAt(sc,"monday","the word"),micro:wAt(sc,"monday","microcredentials"),bef:wAt(sc,"before","before"),aft:wAt(sc,"before","after"),
    ours:wAt(sc,"gov","ours"),who:wAt(sc,"gov","Who"),mei:wAt(sc,"answers","Mei"),jun:wAt(sc,"answers","Jun"),plan:wAt(sc,"answers","Planning"),tobe:wAt(sc,"tbc","to be")}));
  const board=(x,tt,mon)=>{os_reportCard(x,OS_RC.census,"census report","ran Friday","4,812",fin(tt,P.right-0.1,0.35));
    os_reportCard(x,OS_RC.draft,"draft submission","ran Wednesday","4,867",fin(tt,P.right-0.02,0.35));
    if(mon>0){const [mx,my,mw,mh]=OS_RC.monday;x.save();x.translate(0,-60*(1-easeCam(mon)));withA(x,clamp(mon*3,0,1),()=>os_mondayCard(x));x.restore();}};
  gv_shots(ctx,S,t,sc.dur,[
    // Yusuf follows the numbers back, down the floor to the data team; it starts as the last chapter left the floor, so nothing doubles
    // as the two dissolve
    {at:0,place:"floor",keys:[[0,732,530,1.312],[0.4,1180,560,1.14]],d:2.6,draw:(x,tt)=>{const w=gv_walk(tt,0.2,368,1090,300);
      os_floor(x,tt,{pose:{clara:{pose:"listen"},mei:{pose:"listen"},jun:{pose:"wave"}}});os_carrier(x,"yusuf",w,GV_FL.walk,0.62,heldNotebook,{t:tt});}},
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
      const top=os_arc(x,tx+tw_/2,ty-14,mx+mw/2,my-14,200,fin(tt,P.who-0.1,0.9));if(top)gv_qmark(x,top[0],top[1]-14,84,fin(tt,P.who+0.5,0.6));
      person(x,"mei",560,905,0.8,{pose:"listen",pose2:"shrug",mix:fin(tt,P.who+0.3,0.5),expr:"concerned",t:tt});}},
    // the floor: who does what with the word, as each is named
    {at:P.d,place:"floor",keys:[[P.d,960,540,1]],push:0,draw:(x,tt)=>{os_floor(x,tt,{});person(x,"yusuf",GV_FL.x(2)+176,GV_FL.walk,0.62,{pose:"listen",t:tt});
      os_glassCard(x,tt,1,P.mei-0.1,["Mei","owns the meaning"]);os_glassCard(x,tt,3,P.jun-0.1,["Jun","builds the model"]);os_glassCard(x,tt,0,P.plan-0.1,["Planning","reports what","it's given"]);}},
    // and the chart, close: the government submission's row lights; the one accountable is still to be confirmed
    {at:P.e,place:"boardGov",keys:[[P.e,960,520,1],[P.e+0.1,960,540,1.06]],d:3,push:0,draw:(x,tt)=>{const st=fin(tt,P.tobe-0.2,0.3);os_chart(x,()=>1,{light:2,lightA:fin(tt,c.tbc-0.1,0.8),hide:st>0.4?[2,1]:null});
      const [sx,sy]=os_cellAt(2,1);gv_stamp(x,sx,sy+4,"TBC",st,{size:44,rot:-0.1});}}]);
  wc_paperOver(ctx,S);});

// ---- 5 · What governance is for: deciding who decides, and making sure each decision reaches the work ----
// an office on the floor washed in a colour (behind its person), or lit up, brighter
function os_roomLit(x,i,col,a){const F=GV_FL;gv_tint(x,F.x(i),F.top,F.w,F.fy-F.top,col,a);}
function os_roomGlow(x,i,a){if(a<=0.01)return;const F=GV_FL;x.save();x.beginPath();x.rect(F.x(i),F.top,F.w,F.fy-F.top);x.clip();x.globalCompositeOperation="screen";
  wc_glowAt(x,F.x(i)+F.w/2,F.top+300,430,[255,238,204],0.42*a);x.restore();}
// a decision's card, flying from the governance office to the glass of an office where the work is done (u, 0 to 1), and pinned there
const OS_DEC_Y=GV_FL.top+300;
function os_decFly(x,i,u,tick){if(u<=0)return;const F=GV_FL,e=easeCam(clamp(u,0,1));
  os_decision(x,lerp(F.x(2)+F.w/2,F.x(i)+F.w/2,e),lerp(OS_DEC_Y+20,OS_DEC_Y,e)-130*Math.sin(Math.PI*e),lerp(0.5,1,e),tick);}
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
    // the 1880s shop again, on the market square: the Act, the inspector's case of brass copies, and the inspector, who checks the shop's
    // weight against his
    {at:P.cc,place:"shop",keys:[[P.cc,960,540,1],[P.cc+0.1,980,530,1.04]],d:5,draw:(x,tt)=>{const top=OS_SH.counter[2],land=P.chk+0.3,
        tilt=tt<land?-0.2:-0.2*Math.exp(-(tt-land)*3)*Math.cos((tt-land)*9);
      gv_halo(x,500,top-130,300,150,GV.gold,0.85*fin(tt,P.rule-0.1,0.6));gv_halo(x,1540,700,340,220,GV.gold,0.85*fin(tt,P.copy-0.1,0.6));
      gv_halo(x,1250,380,260,540,GV.gold,0.6*fin(tt,P.chk-0.1,0.6));
      person(x,"grocer",440,860,0.78,{pose:"listen",t:tt});os_counter(x);os_act(x,650,top+6);
      os_scaleAt(x,OS_SH.scale,top+4,tilt,(q,ex,ey)=>os_iron(q,ex,ey,1),tt>=land?(q,ex,ey)=>os_brass(q,ex,ey):null);os_case(x,1712,905,1);
      const m=clamp((tt-(P.chk-0.4))/0.45,0,1),back=fin(tt,land+0.3,0.5);
      person(x,"inspector",1380,905,0.86,{pose:"hold",pose2:"os_place",mix:m*(1-back),t:tt,flip:true,wide:true,carry:tt<land?heldWeight:null});
      os_tagAt(x,tt,P.rule,null,650,500,"a rule");os_note(x,tt,P.copy,1690,630,["a copy where","the work happens"]);os_tagAt(x,tt,P.chk,null,1380,186,"someone who checks");}},
    // the floor again: governance sets the rules and checks they're kept, a tick on each decision; management does the work
    {at:P.d,place:"floor",keys:[[P.d,960,540,1]],push:0.02,draw:(x,tt)=>{const F=GV_FL;
      os_roomLit(x,2,GV.gold,0.14+0.22*fin(tt,P.gv-0.1,0.5));WORK.forEach((i,k)=>{os_roomLit(x,i,GV.gold,0.14);os_roomGlow(x,i,fin(tt,P.mg-0.2+0.06*Math.min(k,2),0.5));});
      const pose={yusuf:{pose:"write",carry:heldNotebook}};WORK.forEach((i,k)=>{if(ID[i]!=="mei")pose[ID[i]]={pose:"listen",pose2:OS_WORK[ID[i]].pose,mix:fin(tt,P.mg-0.2+0.06*Math.min(k,2),0.5)};});
      os_floor(x,tt,{yusufIn:true,pose});os_glassCard(x,tt,2,P.gv-0.1,["governance","sets the rules,","checks they're kept"],{wash:GV.gold,washA:0.32,top:196,pad:8});
      WORK.forEach((i,k)=>os_decision(x,F.x(i)+F.w/2,OS_DEC_Y,1,fin(tt,P.kept+0.12*k,0.4)));
      os_overRooms(x,tt,P.mg-0.2,0,1,"management · does the work");os_overRooms(x,tt,P.mg-0.14,3,4,"management · does the work");}}]);
  wc_year(ctx,56,72,"England · 1880s",gv_io(t,P.cc+0.2,P.d,0.4));
  wc_paperOver(ctx,S);});

// ---- 6 · Governance at the centre: DAMA's book and its wheel; the other frameworks on the same ground; then where it runs ----
scene("wheel",(ctx,S,t,sc)=>{const c=sc.cues,P=os_once(sc,"P",()=>({b:c.wheel-0.6,d:c.takes-0.6,body:wAt(sc,"body","body"),eleven:wAt(sc,"wheel","eleven"),
    gov:wAt(sc,"wheel","governance"),where:wAt(sc,"wheel","where"),dee:wAt(sc,"others","Dee"),i8:wAt(sc,"others","eight thousand"),i38:wAt(sc,"others","thirty"),
    shows:wAt(sc,"takes","shows")}));
  const out=P.d-1.4,ring=[[1,3],[0,4]];
  gv_shots(ctx,S,t,sc.dur,[
    // his desk: binder 12, closed, his two notes sticking out of it; DAMA's book set down beside it
    {at:0,place:"desk",keys:[[0,960,540,1],[P.body,1170,520,1.1]],d:2,draw:(x,tt)=>{os_closed12(x);const u=fin(tt,P.body-0.5,0.3);if(u<=0)return;
      x.save();x.translate(1330,520);const k=lerp(1.25,1,easeCam(u));x.scale(k,k);withA(x,clamp(u*3,0,1),()=>os_dmbok(x,0,0));x.restore();}},
    // the book open at its wheel: ten areas round the centre, data governance, where they meet; then the frameworks that cover the same
    // ground, or part of it; then close in on the centre
    {at:P.b,place:"page",keys:[[P.b,960,500,1.04],[P.b+0.1,960,480,1.0],[out,960,448,2.3]],d:1.6,push:0.02,draw:(x,tt)=>{
      const hi=tt>=P.i38-0.3?"centre":tt>=P.i8-0.2?9:-1;
      os_wheel(x,{area:k=>fin(tt,P.eleven-0.1+k*0.24,0.5),centre:fin(tt,P.gov-0.1,0.6),joins:clamp((tt-P.where+0.2)/1.2,0,1),
        ring:clamp((tt-P.dee+0.2)/1.4,0,1)*(1-fin(tt,out,0.4)),dim:gv_io(tt,P.dee-0.2,out,0.5),hi,
        outline:hi==="centre"?gv_io(tt,P.i38-0.1,out,0.4):hi===9?fin(tt,P.i8-0.1,0.4):0,labels:1-fin(tt,out,0.4),fade:1-0.6*fin(tt,out,0.6)});
      os_note(x,tt,P.dee-0.1,1660,150,["DCAM","the same ground"],{out});os_note(x,tt,P.i8-0.1,262,150,["ISO 8000","data quality"],{out});
      os_note(x,tt,P.i38-0.1,1660,780,["ISO/IEC 38505","governing data"],{out});}},
    // where it runs: the governance office at the centre of the floor, and the offices round it, at work
    {at:P.d,place:"floor",keys:[[P.d,960,485,1.9],[P.d+0.4,960,540,1.0]],d:2.4,push:0.02,draw:(x,tt)=>{
      os_roomLit(x,2,GV.gold,0.32+0.16*(1-fin(tt,P.d+0.4,1.6)));ring.forEach((r,j)=>r.forEach(i=>os_roomGlow(x,i,fin(tt,P.shows-0.1+0.3*j,0.6))));
      os_floor(x,tt,{yusufIn:true,pose:{yusuf:{pose:"listen"}}});}}]);
  wc_paperOver(ctx,S);});

// ---- 7 · Listen first: no thirty-fifth policy; one question in every office, and what slows each one down ----
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
    {at:P.they-0.5,place:"office",keys:[[P.they-0.5,1320,520,1.16],[P.they-0.4,1360,520,1.2]],d:3,draw:(x,tt)=>{os_chartSmall(x,1);os_ansSmall(x);os_score(x);
      os_binders(x,{missing:i=>i===11});const g=fin(tt,P.they-0.2,0.9),[sx,,sw]=[GV_OFF.shelf.x,0,GV_OFF.shelf.w];
      if(g>0){x.save();x.globalCompositeOperation="soft-light";wc_glowAt(x,sx+sw/2,520,560,[255,190,90],0.9*g);x.globalCompositeOperation="screen";
        wc_glowAt(x,sx+sw/2,470,500,[255,222,160],0.42*g);x.restore();}
      person(x,"yusuf",1200,905,0.8,{pose:"listen",expr:"smile",t:tt});}},
    // the data team's room: Mei, Jun and Yusuf, working it out together
    {at:P.g,place:"data",keys:[[P.g,1300,520,1.14],[P.g+0.1,1320,520,1.18]],d:3,draw:(x,tt)=>{const nod=k=>0.05*Math.sin(tt*3.1+k)*gv_io(tt,P.g+0.3,P.h,0.4);os_dataBoard(x);
      person(x,"yusuf",900,905,0.8,{pose:"listen",t:tt,nod:nod(1)});person(x,"mei",1330,905,0.8,{pose:"explain",t:tt});
      person(x,"jun",1600,905,0.8,{pose:"listen",t:tt,flip:true,nod:nod(2)});}},
    // Jun's screen: what they agreed on Monday runs as a test, and passes; how award maps to the government's has no test, as no
    // one has agreed it
    {at:P.h,place:"screen",keys:[[P.h,960,450,1],[P.cant-0.3,960,500,1.06]],d:1.8,push:0.02,draw:(x,tt)=>
      os_tests(x,fin(tt,P.carry-0.3,0.5),fin(tt,P.carry+0.25,0.4),fin(tt,P.agree-0.1,0.6),fin(tt,P.cant-0.15,0.5))}]);
  wc_paperOver(ctx,S);});

// ---- 8 · Where does it run? Binder 12 open again, and every line of policy 12 marked by where it runs ----
scene("runs",(ctx,S,t,sc)=>{const c=sc.cues,P=os_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{open:w("takes","opens",-0.2),where:w("takes","where"),b:c.runs-0.6,key:[w("runs","run in",-0.1),w("owned","decisions",-0.1),w("go","go",-0.2)],
      hi:[w("runs","required"),w("runs","a check"),w("runs","a tag"),w("runs","a test"),w("owned","owns"),w("owned","writes"),w("go","go")],
      note:[w("runs","required"),w("runs","a check"),w("runs","a tag"),w("runs","a test"),w("owned","owns",0.3),w("owned","where the"),99]};});
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

// ---- 9 · Where decisions enter: the data team's loop, and a gold pin at each step where a decision enters it ----
// a face between two expressions (m, 0 to 1)
function os_face(a,b,m){const A=EXPR[a],B=EXPR[b];if(m<=0)return A;if(m>=1)return B;const o={};new Set([...Object.keys(A),...Object.keys(B)]).forEach(k=>o[k]=lerp(A[k]||0,B[k]||0,m));return o;}
scene("enter",(ctx,S,t,sc)=>{const c=sc.cues,P=os_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{places:w("places","places"),lp:c.loop-0.6,go:w("loop","loop",-0.1),end:w("loop","new version",0.1),m:c.pin-0.6,meet:w("pin","another meeting"),
      needs:w("pin","It needs"),pin:w("pin","a pin"),q:c.pins-0.6,
      pins:OS_PINS.map(([,word])=>w(sc.vo.find(v=>v.id==="pins").text.includes(word)?"pins":"pins2",word,-0.15)),two:w("pins","a contract",-0.1),br:c.breath-0.3};});
  const [qx,qy,qw,qh]=GV_PC,[px,py,pw,ph]=GV_DT.poster,
    pins=(x,tt,R,lab)=>OS_PINS.forEach(([i,,lines],k)=>os_goldPin(x,i,R[0],R[1],R[2],R[3],fin(tt,P.pins[k],0.3),clamp((tt-P.pins[k]-0.05)/0.5,0,1),lines,
      lab&&(j=>clamp((tt-(j?P.two:P.pins[k]+0.1))/0.6,0,1))));
  gv_shots(ctx,S,t,sc.dur,[
    // the data team's room: Yusuf comes in with a box of gold pins; Jun turns from his desk; the poster of how they build catches the light
    {at:0,place:"data",keys:[[0,1000,520,1.08],[0.4,1060,515,1.14]],d:3.2,draw:(x,tt)=>{const wk=gv_walk(tt,0.2,300,860,220);
      os_dataBoard(x);os_warm(x,px+pw/2,py+ph/2,420,fin(tt,P.places-0.4,0.8));
      person(x,"jun",1600,905,0.8,{pose:"stand",pose2:"listen",mix:fin(tt,wk.end-0.7,0.6),t:tt,flip:true});os_carrier(x,"yusuf",wk,905,0.8,heldPins,{t:tt});}},
    // the poster, close: the loop they build in, going round from a question to a new version
    {at:P.lp,place:"poster",keys:[[P.lp,960,500,1.06],[P.lp+0.1,960,490,1]],d:2.4,push:0.02,draw:(x,tt)=>
      withA(x,1-fin(tt,P.m-0.7,0.6),()=>os_loopRun(x,qx,qy,qw,qh,clamp((tt-P.go)/((P.end-P.go)/0.9),0,1)))},
    // the room again: Jun expects another meeting; Yusuf holds up the pins instead
    {at:P.m,place:"data",keys:[[P.m,1120,520,1.16],[P.m+0.1,1100,515,1.2]],d:4,draw:(x,tt)=>{os_dataBoard(x);os_warm(x,px+pw/2,py+ph/2,420,1);
      person(x,"yusuf",880,905,0.8,{pose:"hold",pose2:"holdUp",mix:fin(tt,P.needs-0.1,0.5),E:os_face("calm","smile",fin(tt,P.needs,0.5)),t:tt,carry:heldPins});
      person(x,"jun",1480,905,0.8,{pose:"listen",E:os_face("concerned","relieved",fin(tt,P.pin,0.6)),t:tt,flip:true});
      os_answer(x,tt,P.meet-0.25,P.pin+0.3,1500,330,["Another meeting?"],1462,456);}},
    // the poster, close: a gold pin at each step where a decision enters, and what enters there
    {at:P.q,place:"poster",keys:[[P.q,960,500,1.04],[P.q+0.1,960,490,1]],d:2.4,push:0.02,draw:(x,tt)=>pins(x,tt,GV_PC,true)},
    // the room: the team's own loop, with six gold pins in it
    {at:P.br,place:"data",keys:[[P.br,1060,520,1.1],[P.br+0.1,1060,515,1.13]],d:2.4,draw:(x,tt)=>{os_dataBoard(x);os_warm(x,px+pw/2,py+ph/2,420,1);pins(x,99,GV_DT.poster,false);
      person(x,"yusuf",860,905,0.8,{pose:"hold",expr:"smile",t:tt,carry:heldPins});person(x,"jun",1560,905,0.8,{pose:"listen",expr:"smile",t:tt,flip:true});}}]);
  wc_paperOver(ctx,S);});

// ---- 10 · The series: nine binders for the films on what governance needs, six cards for the films on the tools ----
scene("series",(ctx,S,t,sc)=>{const c=sc.cues,P=os_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{nine:w("next","nine",-0.1),take:w("next","takes"),tl:c.tools-0.6,six:w("tools","six",-0.1),f:c.wish-0.6,end:c.breath-0.2};});
  const B1=OS_NINE[0],held=os_heldTitled(["Who","decides"],os_bindCol(B1));
  gv_shots(ctx,S,t,sc.dur,[
    // his office: nine binders on the shelf light up, one for each film to come; he takes the first down
    {at:0,place:"office",keys:[[0,1120,520,1.2],[P.take+0.5,1270,560,1.4]],d:1.8,draw:(x,tt)=>{const n=j=>fin(tt,P.nine+0.12*j,0.35),got=tt>=P.take+0.55,
        r1=fin(tt,P.take-0.1,0.5),r2=fin(tt,P.take+0.55,0.5);
      os_chartSmall(x,1);os_ansSmall(x);os_score(x);
      os_binders(x,{missing:i=>i===11||(got&&i===B1),glow:i=>{const j=OS_NINE.indexOf(i);return j<0?0:0.85*n(j);},
        out:i=>{const j=OS_NINE.indexOf(i);return j<0?0:Math.max(0.5*n(j),i===B1?fin(tt,P.take+0.1,0.35):0);}});
      person(x,"yusuf",1250,905,0.8,got?{pose:"reach",pose2:"hold",mix:r2,t:tt,carry:held}:{pose:"listen",pose2:"reach",mix:r1,t:tt});}},
    // the data team's board, close: six cards, one for each film on the tools
    {at:P.tl,place:"boardData",keys:[[P.tl,960,500,1.04],[P.tl+0.1,960,490,1]],d:2.4,push:0.02,draw:(x,tt)=>{os_toolsHead(x,fin(tt,P.tl+0.3,0.6));
      for(let k=0;k<6;k++)os_toolCard(x,k,fin(tt,P.six+0.3*k,0.35));}},
    // the floor: he takes the binder to where the work is done; Jun looks up
    {at:P.f,place:"floor",keys:[[P.f,1000,560,1.2],[P.f+0.1,1100,555,1.22]],d:4,draw:(x,tt)=>{const F=GV_FL,wk=gv_walk(tt,P.f+0.2,880,1400,150);
      os_floor(x,tt,{pose:{jun:{pose2:"listen",mix:fin(tt,wk.end-0.8,0.6)}}});os_carrier(x,"yusuf",wk,F.walk,0.62,held,{t:tt});}}]);
  gv_end(ctx,S,t,P.end,"Off the shelf","A policy that doesn't run anywhere is a wish.","Film 1 of 16");
  wc_paperOver(ctx,S);});
