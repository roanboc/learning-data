/* ===== Why Unity Catalog and Unity Gateway govern them: the scenes, chapter by chapter =====
   Each chapter is a run of shots (ag_shots): a place painted once, a slow camera, and what's drawn live. Times come from the cues
   (c.<line>, when each line starts) and from the words of the lines (wAt), so the pictures stay with the voice. Two framings of one
   moment are joined by a cut (cut:true), never a dissolve, so nothing shows twice. */

/* ---------------------------------------------------------------- pieces the scenes share */
// the title card, its title on two lines (the film's title is too long for one at this size); otherwise ag_title's
function ug_title(ctx,S,t,t0,lines,sub,line){const oA=ag_in(t,t0,0.8),tA=ag_in(t,t0+0.5,0.8);if(oA<=0)return;ag_veil(ctx,S,oA*0.9);setScreen(ctx,S);
  withA(ctx,tA,()=>{ag_mark(ctx,960,290,58,(t-t0-0.4)/1.6,1);lines.forEach((l,i)=>ag_T(ctx,l,960,476+i*94,{w:800,size:80,align:"center"}));
    if(sub)ag_T(ctx,sub,960,660,{w:600,size:36,align:"center",col:AG.mut});withA(ctx,ag_in(t,t0+1.2,0.8),()=>ag_T(ctx,line,960,750,{w:700,size:28,ls:3,align:"center",col:AG.kick}));});}
// the kicker over a night pass, in the frame's own space
function ug_kickNight(x,S){x.save();setScreen(x,S);UG_KICK(x,true);x.restore();}
// Mei's key in her near hand (drawn behind the hand: holdBack), and where it is in the frame while she holds it up
const UG_KEYROT=-0.9;
function ug_keyHeld(c,h){if(!h||!h.near)return;ug_key(c,h.near[0]+58,h.near[1]-30,1,{rot:UG_KEYROT});}
function ug_keyInHand(){const j=ag_joints(AG_FIG.shoulder.near,AG_POSES.hold.near),A=AG_FIG.anchor,W_=UG.who;
  return[W_.x+(j.Wr[0]+58-A[0])*W_.s,W_.y+(j.Wr[1]-30-A[1])*W_.s];}
// the hook under the ring, and where the key's bow hangs from it
function ug_hookAt(o){o=o||{};const A=UG.agent;return[(o.x==null?A.x:o.x)+50,(o.y==null?A.y:o.y)+(o.R||A.R)+6];}
function ug_hook(x,o){const h=ug_hookAt(o);x.save();x.strokeStyle="#4A4C52";x.lineWidth=5;x.lineCap="round";x.beginPath();x.moveTo(h[0],h[1]-14);x.lineTo(h[0],h[1]-2);
  x.arc(h[0]+7,h[1]-2,7,Math.PI,0,true);x.stroke();x.restore();}
// the key hanging on the hook, its blade down, swinging a little after it lands (sw)
function ug_keyOnHook(x,o){o=o||{};const h=ug_hookAt(o),s=1;const rot=Math.PI/2+(o.sw||0);
  const cx=h[0]-Math.cos(rot)*-11*s,cy=h[1]-Math.sin(rot)*-11*s;ug_key(x,cx,cy,s,{rot,a:o.a});
  if(o.tag!==false)ug_tag(x,cx+Math.cos(rot)*-11,cy+Math.sin(rot)*-11+4,"Mei Tanaka",{dx:150,dy:40,sw:(o.sw||0)*0.4,a:o.a});
  return[cx,cy];}
// the key's way from her hand to the hook: u 0 (in her hand) to 1 (on the hook), and the swing after
function ug_keyFlight(x,u,tt,t1){const a=ug_keyInHand(),h=ug_hookAt(),e=ag_sine(u);
  if(u>=1){const k=tt-t1,sw=0.32*Math.exp(-2.6*k)*Math.sin(7*k);return ug_keyOnHook(x,{sw});}
  const hx=h[0],hy=h[1]+11,cx=lerp(a[0],hx,e)+Math.sin(Math.PI*e)*-40,cy=lerp(a[1],hy,e)-Math.sin(Math.PI*e)*120,rot=lerp(UG_KEYROT,Math.PI/2,e),s=lerp(UG.who.s,1,e);
  ug_key(x,cx,cy,s,{rot});const hole=ug_keyHole(cx,cy,s,rot);ug_tag(x,hole[0],hole[1]+4,"Mei Tanaka",{dx:lerp(110,150,e),dy:lerp(70,40,e)});return[cx,cy];}

/* ---------------------------------------------------------------- 1 · Whose reads were those? */
scene("reads",(ctx,S,t,sc)=>{const c=sc.cues,P=ug_once(sc,"P",()=>({fac:wAt(sc,"ask","the faculties"),q:[wAt(sc,"ask","the same questions"),wAt(sc,"ask","how many students"),wAt(sc,"ask","in which courses")],
    agent:wAt(sc,"mei","set up an agent"),night:wAt(sc,"mei","at night"),pkey:wAt(sc,"key","her personal key"),signin:wAt(sc,"key","sign in as her"),
    sam:wAt(sc,"log","Sam Okafor"),chk:wAt(sc,"log","checks the platform's log"),names:wAt(sc,"read","every learner's name"),
    n2300:wAt(sc,"sunday","two thousand"),every:wAt(sc,"all","everything she can"),counts:wAt(sc,"all","all it needed was counts"),
    hand:wAt(sc,"trick","handing names over"),another:wAt(sc,"calls","another key of hers"),budget:wAt(sc,"calls","no one's budget"),carried:wAt(sc,"calls","what the calls carried"),
    point:wAt(sc,"blame","point at Mei"),pk:wAt(sc,"nothing","a personal key"),has:wAt(sc,"nothing","everything she has"),
    name:wAt(sc,"own","a name of its own"),uc:wAt(sc,"catalog","Unity Catalog"),grants:wAt(sc,"grants","only the grants"),stars:wAt(sc,"grants","stars where the names are"),
    allowed:wAt(sc,"gateway","only the ones it's allowed"),spends:wAt(sc,"gateway","counts what it spends"),
    noName:wAt(sc,"since","hasn't seen a single name"),dollars:wAt(sc,"since","three hundred dollars"),gov:wAt(sc,"jun","sends the government")}));
  const rec=(x,o)=>ug_record(x,1296,200,560,o);
  const keyGone=tt=>ag_in(tt,P.name+0.1,0.5);
  ag_shots(ctx,S,t,sc.dur,[
    // by day: Mei, and the same questions from the faculties every week
    {at:0,place:"ugLab",keys:[[0,960,540,1.04],[P.agent-0.6,960,540,1]],push:0.015,draw:(x,tt)=>{
      ug_agent(x,tt,{p:ag_sine((tt-P.agent)/1.6),a:ag_in(tt,P.agent-0.1,0.4)});
      ug_who(x,"mei",tt,{p:{gaze:[4,tt>P.fac?-2:0]}});ag_roomLight(x,1);ug_corner(x,"Today · the university",ag_in(tt,0.6,0.6));
      ug_name(x,250,196,"Mei Tanaka","Registrar's office",ag_in(tt,0.9,0.6));
      [0,1,2].forEach(i=>ug_ask(x,1296,170+i*162,560,i,{a:ag_in(tt,P.q[i],0.4),k:ag_spr(tt,P.q[i])}));}},
    // at night, on its own: the questions go into the ring one by one, and the answers settle in a stack
    {cut:true,at:P.night,place:"ugLabNight",keys:[[P.night,1080,520,1.03]],push:0.02,draw:(x,tt)=>{const t0=P.night+0.3;
      ug_agent(x,tt,{think:0.8});ag_roomLight(x,1,{night:true});ug_glow(x,tt,{think:0.8});
      [0,1,2].forEach(i=>{const u=ag_sine((tt-t0-i*0.7)/1.0);if(u>=1)return;const sx=lerp(1296,UG.agent.x-130,u),sy=lerp(170+i*162,UG.agent.y-60,u);
        ug_deco(u>0.02,()=>{x.save();x.globalAlpha*=1-ag_in(u,0.7,0.3);ag_about(x,sx,sy,lerp(1,0.5,u));ug_ask(x,sx,sy,560,i,{});x.restore();});});
      ug_answers(x,1340,250,480,{n:clamp((tt-t0-1.4)/0.7,0,3)});}},
    // her personal key: she holds it up, and it goes to the hook under the ring, so the agent signs in as her
    {cut:true,at:c.key,place:"ugLab",keys:[[c.key,760,560,1.06]],push:0.02,draw:(x,tt)=>{const rel=P.signin+0.1,down=ag_sine((tt-rel-0.4)/0.9);
      ug_agent(x,tt,{});ug_hook(x);
      ug_who(x,"mei",tt,{p:{pose:"hang",pose2:"hold",mix:tt<rel?1:1-down,holdBack:tt<rel?ug_keyHeld:null,gaze:[4,tt<rel?1:-2]}});
      ag_roomLight(x,1);ug_name(x,250,196,"Mei Tanaka","Registrar's office",1);
      if(tt<rel){const k=ug_keyInHand(),h=ug_keyHole(k[0],k[1],UG.who.s,UG_KEYROT);ug_tag(x,h[0],h[1]+4,"Mei Tanaka",{dx:110,dy:70});}
      else ug_keyFlight(x,clamp((tt-rel)/1.5,0,1),tt,rel+1.5);
      ug_card(x,476,250,420,{kick:"Her personal key",title:"signs in as Mei"},{a:ag_in(tt,P.signin,0.5),k:ag_spr(tt,P.signin)});}},
    // Sam, who runs the platform, checks who read the learner table: Mon, Tue, Wed; then one Sunday night, Mei, over and over
    {cut:true,at:c.log,place:"ugLab",keys:[[c.log,960,540,1]],push:0.02,draw:(x,tt)=>{const race=ag_in(tt,c.sunday+0.2,0.5);
      ug_who(x,"sam",tt,{p:{gaze:[4,-1]}});ag_roomLight(x,1);ug_name(x,250,196,"Sam Okafor","Data platform",ag_in(tt,c.log+0.4,0.5));
      rec(x,{a:ag_in(tt,c.read-0.2,0.5),k:ag_spr(tt,c.read-0.2),hl:[0,ag_io(tt,P.names,P.names+1.8,0.4),ag_io(tt,P.names+0.2,P.names+1.8,0.4),0]});
      ug_log(x,476,230,700,[{when:"Mon 09:12",who:"mei.tanaka@uni.example"},{when:"Tue 10:40",who:"jun.park@uni.example"},{when:"Wed 14:05",who:"mei.tanaka@uni.example"}],
        {sub:"October",n:4,a:ag_in(tt,P.chk,0.5),k:ag_spr(tt,P.chk),race,raceOff:(tt-c.sunday)*820});
      ag_pill(x,826,700,"Sunday night · 2,300 reads",{icon:"warn",col:AG.amber,a:ag_in(tt,P.n2300,0.4)});}},
    // she was asleep: at night the agent reads the learner table as her, every row, though all it needed was counts
    {cut:true,at:c.asleep,place:"ugLabNight",keys:[[c.asleep,1080,520,1.02]],push:0.02,draw:(x,tt)=>{const rows=rec(x,{a:0}),t0=c.asleep+0.8,tr=c.trick;
      const turn=ag_sine((tt-P.hand+0.6)/1.0),glow=ag_in(tt,P.every,0.6)*(1-ag_in(tt,tr,0.5)*0.6);
      ug_agent(x,tt,{think:0.9});ug_hook(x);ug_keyOnHook(x,{});
      rec(x,{glow,hl:rows.map((r,i)=>ag_io(tt,t0+i*0.5,t0+i*0.5+1.4,0.3))});
      for(let i=0;i<4;i++){const ts=t0+i*0.5,u=ag_sine((tt-ts)/0.6)*(1-ag_sine((tt-ts-1.6)/0.6));if(u>0.01)ag_reach(x,ug_armTo(rows[i][0],rows[i][1]),u,{data:clamp((tt-ts-0.5)/0.9,0,1)});}
      if(tt>tr){const u=ag_sine((tt-tr-0.2)/0.8)*0.82;ag_reach(x,ug_armTo(lerp(rows[1][0],1500,turn),lerp(rows[1][1],640,turn)),u,{data:((tt-tr)*0.8)%1});}
      ag_roomLight(x,1,{night:true});ug_glow(x,tt,{think:0.9});
      ug_card(x,476,250,380,{kick:"its job",title:"counts"},{a:ag_in(tt,P.counts,0.5),k:ag_spr(tt,P.counts),edge:AG.blue});
      ug_card(x,1220,700,640,{title:"…and list their names and emails"},{a:ag_in(tt,tr+0.1,0.5),k:ag_spr(tt,tr+0.1),edge:AG.amber});}},
    // its model calls: a violet thread out of the room, on another key of hers, from no one's budget, carrying who knows what
    {cut:true,at:c.calls,place:"ugLabNight",keys:[[c.calls,1180,500,1.04]],push:0.02,draw:(x,tt)=>{const p=[1150,404,1360,420,1640,300,1990,310],u=ag_sine((tt-c.calls-0.2)/1.4);
      ug_agent(x,tt,{think:0.9});ug_hook(x);ug_keyOnHook(x,{});ug_thread(x,p,u,{beads:tt,n:5});
      const k=ag_bz(p,0.62),ka=ag_in(tt,P.another,0.5),dy=(1-ag_spr(tt,P.another,0.6))*-60;
      if(ka>0){x.save();x.globalAlpha*=ka;x.strokeStyle="rgba(87,82,76,0.8)";x.lineWidth=2;x.beginPath();x.moveTo(k[0],k[1]);x.lineTo(k[0],k[1]+30+dy);x.stroke();
        ug_key(x,k[0],k[1]+60+dy,0.8,{rot:Math.PI/2});ug_tag(x,k[0],k[1]+40+dy,"Mei Tanaka",{dx:140,dy:60});x.restore();}
      ag_roomLight(x,1,{night:true});ug_glow(x,tt,{think:0.9});
      ag_pill(x,1560,720,"budget · none",{col:AG.amber,icon:"warn",a:ag_in(tt,P.budget,0.4)});
      const qa=ag_in(tt,P.carried,0.5);if(qa>0){const q=ag_bz(p,0.84);ag_box(x,q[0]-34,q[1]-104,68,68,34,{a:qa});ag_T(x,"?",q[0],q[1]-56,{w:800,size:40,align:"center",col:AG.mut,a:qa});}}},
    // by day: the log says Mei, every line; if names leaked, it would point at her
    {cut:true,at:c.blame,place:"ugLab",keys:[[c.blame,960,540,1]],push:0.02,draw:(x,tt)=>{const pt=ag_in(tt,P.point,0.6);
      ug_who(x,"mei",tt,{p:{gaze:[4,0]}});ag_roomLight(x,1);ug_name(x,250,196,"Mei Tanaka","Registrar's office",1);
      const L=ug_log(x,476,330,700,[{when:"Sun 02:14",who:"mei.tanaka@uni.example",warn:pt},{when:"Sun 02:14",who:"mei.tanaka@uni.example",warn:pt},{when:"Sun 02:15",who:"mei.tanaka@uni.example",warn:pt}],{sub:"Sunday night",n:3});
      if(pt>0){x.save();x.strokeStyle=rgba(AG.amber,0.9);x.lineWidth=4;x.lineCap="round";const p=[L.x+18,L.y+40,L.x-60,L.y-30,400,330,374,250],u=ag_sine((tt-P.point)/0.9);
        ag_bzPath(x,p,0,u);x.stroke();if(u>0.97)ag_arrowHead(x,374,250,Math.atan2(250-330,374-400),11,rgba(AG.amber,0.95));x.restore();}}},
    // she did nothing wrong: her key, on the agent's hook, hands over everything she can do; then a veil
    {cut:true,at:c.nothing,place:"ugLab",keys:[[c.nothing,960,540,1]],push:0.02,draw:(x,tt)=>{const kp=ug_hookAt(),cx=kp[0],cy=kp[1]+11;
      ug_agent(x,tt,{});ug_hook(x);ug_keyOnHook(x,{tag:false});
      ug_who(x,"mei",tt,{p:{gaze:[4,-1]}});ag_roomLight(x,1);ug_name(x,250,196,"Mei Tanaka","Registrar's office",1);
      [["learner table · read",1330,650],["awards · read",1380,730],["glossary · edit",1330,810]].forEach(([s,px,py],i)=>{const t0=P.pk+0.2+i*0.45,a=ag_in(tt,t0,0.4);if(a<=0)return;
        const b=ag_pill(x,px+(ag_tw(x,s,{w:700,size:28})+56)/2,py,s,{size:28,a,col:AG.ink});ug_line(x,cx,cy+20,b.x,py,ag_in(tt,t0,0.5),{head:false,a});});
      ag_veil(x,S,0.55*ag_in(tt,c.change+0.1,0.8));}},
    // so Sam gives the agent a name of its own: the key comes off the hook, and a badge drops in its place; then the catalog's rules
    {cut:true,at:c.own,place:"ugLab",keys:[[c.own,1060,540,1]],push:0.02,draw:(x,tt)=>{const g=keyGone(tt),mk=ag_in(tt,P.stars,0.8);
      ug_agent(x,tt,{});ug_hook(x);
      if(g<1){const h=ug_hookAt();x.save();x.globalAlpha*=1-g;x.translate(-g*160,-g*220);ug_keyOnHook(x,{sw:-0.3*g});x.restore();}
      ug_badgeOn(x,tt,"registrar agent",{k:(tt-P.name-0.5)/0.9});
      ug_who(x,"sam",tt,{p:{gaze:[4,-1]}});ag_roomLight(x,1);ug_name(x,250,196,"Sam Okafor","Data platform",1);
      const ra=ag_in(tt,P.uc,0.5);rec(x,{a:ra,k:ag_spr(tt,P.uc),mask:mk,lock:mk});ag_label(x,1300,178,"Unity Catalog",{a:ra});
      ag_pill(x,1576,620,"registrar agent · reads core",{col:AG.blue,icon:"lock",size:28,a:ag_in(tt,P.grants,0.5)});}},
    // Unity Gateway, its gate to models: the thread comes back, through the gateway's frame, to the one model it may call, counted
    {cut:true,at:c.gateway,place:"ugLab",keys:[[c.gateway,1060,520,1.03]],push:0.02,draw:(x,tt)=>{const p=[1150,404,1240,440,1300,370,1410,320],u=ag_sine((tt-c.gateway-0.6)/1.4);
      ug_agent(x,tt,{think:0.5});ug_badgeOn(x,tt,"registrar agent",{});ug_thread(x,p,u,{beads:tt,n:3});
      ug_gateway(x,1325,160,110,420,{p:(tt-c.gateway-0.1)/1.2});
      ag_roomLight(x,1);
      ug_service(x,1410,246,450,{who:"registrar agent",a:ag_in(tt,P.allowed,0.5),k:ag_spr(tt,P.allowed),lit:ag_in(tt,P.allowed+0.4,0.5)});
      ag_pill(x,1635,470,"counted · registrar agent",{col:AG.blue,size:28,a:ag_in(tt,P.spends,0.5)});}},
    // it worked: the same answers every morning, no names seen, a known cost; and the log says whose reads they were
    {cut:true,at:c.worked,place:"ugLab",keys:[[c.worked,960,540,1]],push:0.02,draw:(x,tt)=>{
      ug_agent(x,tt,{});ug_badgeOn(x,tt,"registrar agent",{});ag_roomLight(x,1);ug_corner(x,"Every morning",ag_in(tt,c.worked+0.2,0.5));
      ug_answers(x,1340,190,480,{n:3,tick:ag_in(tt,c.worked+0.6,0.5)});
      ag_pill(x,1580,560,"names seen · 0",{icon:"tick",col:AG.green,a:ag_in(tt,P.noName,0.4)});
      ug_card(x,476,250,460,{kick:"Registrar's budget",title:"about $300 a month"},{a:ag_in(tt,P.dollars,0.5),k:ag_spr(tt,P.dollars)});}},
    {cut:true,at:c.whose,place:"ugLab",keys:[[c.whose,960,540,1]],push:0.02,draw:(x,tt)=>{
      ug_agent(x,tt,{x:1560,y:430,R:130,r:68});ug_badgeOn(x,tt,"registrar agent",{x:1560,y:430,R:130});ag_roomLight(x,1);
      ug_log(x,150,250,880,[{when:"Mon 09:12",who:"mei.tanaka@uni.example"},{when:"Sun 02:14",id:"7c41e09a-…",tag:"registrar agent",hl:ag_in(tt,c.whose+0.4,0.5)},
        {when:"Sun 02:15",id:"7c41e09a-…",tag:"registrar agent",hl:ag_in(tt,c.whose+0.6,0.5)}],{sub:"November",n:3});}},
    // the same for data: Jun's census agent, which checks the count the university sends the government
    {cut:true,at:c.jun,place:"ugLab",keys:[[c.jun,960,540,1]],push:0.02,draw:(x,tt)=>withA(x,1-ag_in(tt,c.breath,0.8),()=>{
      ug_agent(x,tt,{});ug_badgeOn(x,tt,"census agent",{});
      ug_who(x,"jun",tt,{p:{gaze:[4,-1]}});ag_roomLight(x,1);ug_name(x,250,196,"Jun Park","Analytics engineer",ag_in(tt,c.jun+0.2,0.5));
      ug_count(x,1340,240,{w:480,k:ag_spr(tt,c.jun+0.4),a:ag_in(tt,c.jun+0.4,0.4),gov:ag_in(tt,P.gov,0.5)});
      ag_T(x,"One set of rules for people and agents",960,800,{w:700,size:36,align:"center",a:ag_in(tt,c.rules,0.6)});})}
  ],0.6);
  ug_title(ctx,S,t,c.breath,["Why Unity Catalog and","Unity Gateway govern them"],"one set of rules for people and agents","FILM 8 OF 9 · AGENTS AT WORK ON DATA");});

/* ---------------------------------------------------------------- 2 · A rule it's told, and a rule that holds */
scene("holds",(ctx,S,t,sc)=>{const c=sc.cues,P=ug_once(sc,"P",()=>({req:wAt(sc,"request","a request"),mis:wAt(sc,"lose","misread it"),lose:wAt(sc,"lose","lose it in a long task"),
    hid:wAt(sc,"lose","words hidden"),stars:wAt(sc,"enforce","only ever sees as stars"),both:wAt(sc,"both","does both"),tells:wAt(sc,"both","tells its agents"),
    enf:wAt(sc,"both","enforces them"),tables:wAt(sc,"touch","the tables"),fns:wAt(sc,"touch","the functions"),log:wAt(sc,"touch","the log"),
    models:wAt(sc,"ug","the models"),servers:wAt(sc,"ug","tool servers")}));
  const PAGE=["Never copy names, emails or student","IDs out of the project, into a prompt,","a log or a pull request, beyond the","sample a claim needs."];
  const page=(x,tt,o)=>ug_page(x,120,200,620,"What you must not do",PAGE,o);
  const WORK=["Nursing · count","query · status","First year · count","Part-time · count"];
  ag_shots(ctx,S,t,sc.dur,[
    // the project's page for agents says it; but a rule it's told is a request: misread, lost in a long task, talked out of
    {at:0,place:"ugLab",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{
      ug_agent(x,tt,{think:ag_io(tt,P.lose,P.hid+2,0.5)*0.8});ug_badgeOn(x,tt,"registrar agent",{});ag_roomLight(x,1);UG_KICK(x);
      const lost=ag_io(tt,P.lose+1.2,P.hid+1.8,0.6),wa=1-ag_in(tt,P.hid+1.6,0.6);
      const pg=page(x,tt,{a:ag_in(tt,0.4,0.5)*(1-0.7*lost),k:ag_spr(tt,0.4),blur:Math.sin(Math.PI*clamp((tt-P.mis)/1.2,0,1))});
      ag_pill(x,120+(ag_tw(x,"told · a request",{w:700,size:30})+56)/2,pg.y+pg.h+48,"told · a request",{col:AG.violet,a:ag_in(tt,P.req,0.4)});
      ag_label(x,1360,214,"its work",{col:AG.kick,a:ag_in(tt,P.lose+0.2,0.4)*wa});
      WORK.forEach((s,i)=>{const t0=P.lose+0.3+i*0.35,a=ag_in(tt,t0,0.3)*wa;if(a<=0)return;const w=ag_tw(x,s,{w:700,size:28})+56;
        ag_pill(x,1360+w/2-(1-ag_eo(clamp((tt-t0)/0.5,0,1)))*40,270+i*84,s,{size:28,a});});
      const sa=ag_in(tt,P.hid,0.4)*(1-ag_in(tt,P.hid+1.8,0.4));if(sa>0)ug_slip(x,520,330+20*(1-ag_eo(clamp((tt-P.hid)/0.6,0,1))),{a:sa,rot:-0.06});}},
    // a rule the platform enforces holds: the agent's arm comes back with stars; so the team does both
    {cut:true,at:c.enforce,place:"ugLab",keys:[[c.enforce,960,540,1]],push:0.02,draw:(x,tt)=>{const rows=ug_record(x,1296,200,560,{a:0}),t0=c.enforce+0.6;
      ug_agent(x,tt,{think:0.4});ug_badgeOn(x,tt,"registrar agent",{});
      ug_record(x,1296,200,560,{mask:1,lock:1,hl:[0,ag_io(tt,t0+0.4,t0+2,0.3),ag_io(tt,t0+0.9,t0+2.4,0.3),0]});
      for(let i=1;i<3;i++){const ts=t0+(i-1)*0.5,u=ag_sine((tt-ts)/0.6)*(1-ag_sine((tt-ts-1.8)/0.6));if(u>0.01)ag_reach(x,ug_armTo(rows[i][0],rows[i][1]),u,{data:clamp((tt-ts-0.5)/0.9,0,1)});}
      ag_roomLight(x,1);UG_KICK(x);const pg=page(x,tt,{});
      ag_pill(x,1576,ug_recordH()+200+52,"***",{size:30,col:AG.ink,a:ag_io(tt,P.stars,c.both+0.2,0.4)});
      ag_pill(x,120+(ag_tw(x,"told",{w:700,size:30})+56)/2,pg.y+pg.h+48,"told",{col:AG.violet,a:ag_in(tt,P.tells,0.4)});
      ag_pill(x,1296+(ag_tw(x,"enforced",{w:700,size:30})+56)/2,ug_recordH()+200+52,"enforced",{col:AG.blue,icon:"lock",a:ag_in(tt,P.enf,0.4)});}},
    // two places keep them: Unity Catalog, what agents touch; and inside it, Unity Gateway, the models and tool servers they call
    {cut:true,at:c.two,place:"ugLab",keys:[[c.two,1000,520,1]],push:0.02,draw:(x,tt)=>{
      ug_agent(x,tt,{x:340,y:430,R:130,r:68});ug_badgeOn(x,tt,"registrar agent",{x:340,y:430,R:130});
      ug_catalog(x,640,200,1220,480,{p:(tt-c.two-0.2)/1.4});
      ug_gateway(x,1560,280,520,370,{p:(tt-c.ug-0.2)/1.2,label:false});ag_roomLight(x,1);UG_KICK(x);
      ag_label(x,1560,266,"Unity Gateway",{align:"center",a:ag_in(tt,c.ug+0.6,0.5)});
      [["tables",P.tables],["functions",P.fns],["the log · preview",P.log]].forEach(([s,t0],i)=>ag_tool(x,690,236+i*136,520,108,s,{sub:null,a:ag_in(tt,t0,0.4),touch:ag_io(tt,t0,t0+1.4,0.4)}));
      [["models",P.models],["tool servers",P.servers]].forEach(([s,t0],i)=>ag_tool(x,1360,330+i*136,400,108,s,{sub:null,a:ag_in(tt,t0,0.4),touch:ag_io(tt,t0,t0+1.4,0.4)}));}}
  ],0.6);});

/* ---------------------------------------------------------------- 3 · A name for the agent */
scene("name",(ctx,S,t,sc)=>{const c=sc.cues,P=ug_once(sc,"P",()=>({helps:wAt(sc,"beside","helps one person"),there:wAt(sc,"beside","while they're there"),sign:wAt(sc,"beside","sign-in"),
    own:wAt(sc,"alone","a name of its own"),sp:wAt(sc,"sp","a service principal"),soft:wAt(sc,"sp","made for software"),grants:wAt(sc,"make","grants it only"),
    core:wAt(sc,"needs","the core tables"),nowhere:wAt(sc,"needs","write nowhere"),off:wAt(sc,"stop","switches off"),works:wAt(sc,"stop","everyone else works on"),
    owner:wAt(sc,"owner","stays its owner")}));
  const two=(x,tt,o)=>{const g=o.off||0;ug_agent(x,tt,{x:900,y:420,R:130,r:68,dim:g});ug_badgeOn(x,tt,"registrar agent",{x:900,y:420,R:130,grey:g,off:true});
    ug_agent(x,tt,{x:1500,y:420,R:130,r:68,think:o.think||0});ug_badgeOn(x,tt,"census agent",{x:1500,y:420,R:130});};
  ag_shots(ctx,S,t,sc.dur,[
    // an agent that helps one person while they're there may use their sign-in
    {at:0,place:"ugLab",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{const sa=ag_in(tt,P.helps,0.6);
      ug_who(x,"mei",tt,{p:{gaze:[4,-1]}});
      if(sa>0)withA(x,sa,()=>{ag_floorShadow(x,700+AG.sdx*3,700,100,18,0.18);ag_loop(x,700,420,{R:96,r:46,t:tt,think:0.4,p:ag_sine((tt-P.helps)/1.4),stepA:[0,0,0],label:null});});
      ag_roomLight(x,1);UG_KICK(x);ug_name(x,250,196,"Mei Tanaka","Registrar's office",1);
      ag_pill(x,700,580,"signed in as Mei",{col:AG.blue,a:ag_in(tt,P.sign,0.4)});
      ug_card(x,1296,250,500,{kick:"with her there",title:"it helps her, as her"},{a:ag_in(tt,P.there,0.5),k:ag_spr(tt,P.there)});}},
    // one that works on its own, as Mei's does at night, needs a name of its own
    {cut:true,at:c.alone,place:"ugLabNight",keys:[[c.alone,1080,520,1.03]],push:0.02,draw:(x,tt)=>{
      ug_agent(x,tt,{think:0.7});ug_badgeOn(x,tt,"registrar agent",{});ag_roomLight(x,1,{night:true});ug_glow(x,tt,{think:0.7});ug_kickNight(x,S);
      ug_card(x,476,250,420,{kick:"on its own",title:"a name of its own"},{a:ag_in(tt,P.own,0.5),k:ag_spr(tt,P.own)});}},
    // on Databricks, a service principal: Sam makes one for the registrar agent, with only the grants its job needs
    {cut:true,at:c.sp,place:"ugLab",keys:[[c.sp,960,540,1]],push:0.02,draw:(x,tt)=>{
      ug_who(x,"sam",tt,{p:{gaze:[4,-1]}});ag_roomLight(x,1);UG_KICK(x);ug_name(x,250,196,"Sam Okafor","Data platform",1);
      ug_card(x,476,250,560,{kick:"Service principal",title:"registrar agent",sub:"an identity for software, not a person"},{a:ag_in(tt,P.sp,0.5),k:ag_spr(tt,P.sp),edge:AG.blue});
      ug_grants(x,1176,250,560,"registrar agent",[{text:"read · the core tables",lock:1,a:ag_in(tt,P.core,0.4)},{text:"write · nowhere",no:1,a:ag_in(tt,P.nowhere,0.4)}],
        {a:ag_in(tt,P.grants,0.5),k:ag_spr(tt,P.grants)});}},
    // Jun's census agent already has its own, as the project's page for agents says
    {cut:true,at:c.census,place:"ugLab",keys:[[c.census,960,540,1]],push:0.02,draw:(x,tt)=>{
      ug_agent(x,tt,{x:1600,y:430,R:130,r:68});ug_badgeOn(x,tt,"census agent",{x:1600,y:430,R:130});
      ug_who(x,"jun",tt,{p:{gaze:[4,-1]}});ag_roomLight(x,1);UG_KICK(x);ug_name(x,250,196,"Jun Park","Analytics engineer",ag_in(tt,c.census+0.2,0.5));
      ug_page(x,476,230,760,"Your access",["On Databricks, you work as your own service","principal, never as a person. It can read","production and write only to its own","development schema."],{a:ag_in(tt,c.census+0.4,0.5),k:ag_spr(tt,c.census+0.4),edge:AG.blue});}},
    // to stop an agent, Sam switches off its service principal, and everyone else works on
    {cut:true,at:c.stop,place:"ugLab",keys:[[c.stop,1000,540,1]],push:0.02,draw:(x,tt)=>{const g=ag_io(tt,P.off+0.2,P.off+3.2,0.5);
      two(x,tt,{off:g,think:ag_in(tt,P.works,0.5)*0.8});
      if(tt>P.works){const u=ag_sine((tt-P.works)/0.7);ag_reach(x,ug_armTo(1800,640,{x:1500,y:420,R:130}),u,{data:((tt-P.works)*0.7)%1});}
      ug_who(x,"sam",tt,{p:{gaze:[4,-1]}});ag_roomLight(x,1);UG_KICK(x);ug_name(x,250,196,"Sam Okafor","Data platform",1);}},
    // and Mei stays its owner: she answers for what it does
    {cut:true,at:c.owner,place:"ugLab",keys:[[c.owner,960,540,1]],push:0.02,draw:(x,tt)=>{
      ug_agent(x,tt,{});ug_badgeOn(x,tt,"registrar agent",{});ug_ownerOn(x,"owner · Mei Tanaka",{k:(tt-P.owner-0.2)/0.9});
      ug_who(x,"mei",tt,{p:{gaze:[4,-1]}});ag_roomLight(x,1);UG_KICK(x);ug_name(x,250,196,"Mei Tanaka","Registrar's office",1);}}
  ],0.6);});

/* ---------------------------------------------------------------- 4 · The same stars */
scene("stars",(ctx,S,t,sc)=>{const c=sc.cues,P=ug_once(sc,"P",()=>({users:wAt(sc,"everyone","all the account's users"),sps:wAt(sc,"everyone","every service principal"),
    grp:wAt(sc,"counts","the office's group"),cnt:wAt(sc,"counts","all it needs is counts"),stat:wAt(sc,"status","each learner's status"),stars:wAt(sc,"status","stars where"),
    filter:wAt(sc,"rows","A row filter"),agentP:wAt(sc,"rows","for an agent"),code:wAt(sc,"code","the learner code"),n:wAt(sc,"count","eighteen thousand"),
    none:wAt(sc,"count","without a single name")}));
  const USERS=[["Clara Jensen"],["registrar agent",1],["census agent",1]];
  ag_shots(ctx,S,t,sc.dur,[
    // one policy, for all the account's users, and they include every service principal; the registrar agent isn't in the office's group
    {at:0,place:"ugLab",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{ag_roomLight(x,1);UG_KICK(x);
      ug_policy(x,476,200,560,{a:ag_in(tt,0.4,0.5),k:ag_spr(tt,0.4)});
      ug_group(x,1296,200,560,"account users",USERS,{a:ag_in(tt,P.users,0.5),k:ag_spr(tt,P.users),n:clamp((tt-P.users-0.3)/0.5,0,1)+clamp((tt-P.sps)/0.5,0,2)});
      ug_group(x,476,460,560,"registrar's office",[["Mei Tanaka"]],{a:ag_in(tt,P.grp,0.5),k:ag_spr(tt,P.grp)});
      ag_pill(x,476+(ag_tw(x,"registrar agent · not in it",{w:700,size:28})+56)/2,720,"registrar agent · not in it",{size:28,col:AG.violet,a:ag_in(tt,P.cnt,0.4)});}},
    // so it reads the learner table as Clara does: the same status, the same stars
    {cut:true,at:c.clara,place:"ugLab",keys:[[c.clara,960,540,1]],push:0.02,draw:(x,tt)=>{const hs=ag_io(tt,P.stat,P.stat+1.8,0.4),hm=ag_io(tt,P.stars,P.stars+1.8,0.4);
      ug_who(x,"clara",tt,{p:{gaze:[4,-1]}});ag_roomLight(x,1);UG_KICK(x);ug_name(x,250,196,"Clara Jensen","Planning",ag_in(tt,c.clara+0.2,0.5));
      ag_label(x,500,214,"Clara reads",{col:AG.kick,a:ag_in(tt,c.clara+0.3,0.5)});ag_label(x,1316,214,"the registrar agent reads",{col:AG.violet,a:ag_in(tt,c.clara+0.6,0.5)});
      ug_record(x,476,240,540,{mask:1,hl:[0,hm,hm,hs],a:ag_in(tt,c.clara+0.3,0.5)});ug_record(x,1296,240,540,{mask:1,hl:[0,hm,hm,hs],a:ag_in(tt,c.clara+0.6,0.5)});}},
    // nobody wrote a rule for agents: the rule for people already covered them
    {cut:true,at:c.nobody,place:"ugLab",keys:[[c.nobody,960,540,1]],push:0.02,draw:(x,tt)=>{ag_roomLight(x,1);UG_KICK(x);
      ug_policy(x,476,200,560,{glow:ag_io(tt,c.nobody+0.4,c.nobody+3.2,0.6)});ug_group(x,1296,200,560,"account users",USERS,{});
      ug_card(x,476,470,560,{kick:"written for",title:"people",sub:"and it covers agents too"},{a:ag_in(tt,wAt(sc,"nobody","The rule for people"),0.5)});}},
    // a row filter works the same way
    {cut:true,at:c.rows,place:"ugLab",keys:[[c.rows,960,540,1]],push:0.02,draw:(x,tt)=>{const f=ag_sine((tt-P.filter-0.2)/1.4);ag_roomLight(x,1);UG_KICK(x);
      ug_sketch(x,476,250,760,{filter:f,keep:3});
      ug_group(x,1340,250,480,"health_readers",[["a person"],["an agent",1]],{a:ag_in(tt,P.filter+0.6,0.5),k:ag_spr(tt,P.filter+0.6),n:1+ag_in(tt,P.agentP,0.4)});
      ag_pill(x,1580,620,"sees Health only",{col:AG.blue,icon:"lock",size:28,a:ag_in(tt,P.agentP+0.4,0.4)});}},
    // the learner code stays readable for counting: the census count, without a single name
    {cut:true,at:c.code,place:"ugLab",keys:[[c.code,960,540,1]],push:0.02,draw:(x,tt)=>{
      ug_who(x,"jun",tt,{p:{gaze:[4,-1]}});ag_roomLight(x,1);UG_KICK(x);ug_name(x,250,196,"Jun Park","Analytics engineer",1);
      ug_record(x,476,230,540,{mask:1,hl:[ag_in(tt,P.code,0.5),0,0,0]});
      ug_count(x,1296,240,{w:480,a:ag_in(tt,P.n,0.4),k:ag_spr(tt,P.n)});
      ag_pill(x,1296+(ag_tw(x,"names read · 0",{w:700,size:30})+96)/2,560,"names read · 0",{icon:"tick",col:AG.green,a:ag_in(tt,P.none,0.4)});}}
  ],0.6);});

/* ---------------------------------------------------------------- 5 · Tools in the catalog */
scene("tools",(ctx,S,t,sc)=>{const c=sc.cues,P=ug_once(sc,"P",()=>({fn:wAt(sc,"fn","a function"),grant:wAt(sc,"grant","a grant"),may:wAt(sc,"run","may run the count"),
    cant:wAt(sc,"run","can't change it"),servers:wAt(sc,"servers","the tool servers"),gw:wAt(sc,"servers","through Unity Gateway"),only:wAt(sc,"each","only these"),
    read:wAt(sc,"fewest","only read")}));
  const AGT={x:700,y:430,R:140,r:72};
  ag_shots(ctx,S,t,sc.dur,[
    // the census count, written once by the data team, is a function in the catalog: Jun's agent has the grant to run it, and can't change it
    {at:0,place:"ugLab",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{const F=ug_function(x,1200,240,620,{a:0}),reach=ag_sine((tt-c.run-0.2)/0.8);
      ug_catalog(x,1150,190,720,520,{p:(tt-0.2)/1.4});ug_agent(x,tt,Object.assign({think:reach*0.6},AGT));ug_badgeOn(x,tt,"census agent",AGT);
      if(reach>0.01)ag_reach(x,ug_armTo(F.x,F.y+110,AGT),reach,{data:clamp((tt-c.run-1.1)/1.0,0,1)});
      ag_roomLight(x,1);UG_KICK(x);
      ug_function(x,1200,240,620,{owner:"data team",a:ag_in(tt,P.fn,0.5),k:ag_spr(tt,P.fn),lit:ag_in(tt,c.run+0.8,0.4),rule:ag_in(tt,P.may,0.4)});
      ag_pill(x,1510,500,"grant EXECUTE · census agent",{col:AG.blue,size:28,a:ag_in(tt,P.grant,0.4)});}},
    // the tool servers agents call, registered there through Unity Gateway, each with its own grant: these, and only these
    {cut:true,at:c.servers,place:"ugLab",keys:[[c.servers,960,540,1]],push:0.02,draw:(x,tt)=>{const T_=[["Catalog","read only"],["Query","read only"],["Repository","not granted"]];
      ug_catalog(x,1150,190,720,560,{});ug_agent(x,tt,Object.assign({think:0.4},AGT));ug_badgeOn(x,tt,"registrar agent",AGT);
      for(let i=0;i<3;i++){const t0=P.only-0.6+i*0.4,u=ag_sine((tt-t0)/0.7)*(i===2?0.78:1);if(u>0.01)ag_reach(x,ug_armTo(1230,276+i*150,AGT),u,{data:i<2?clamp((tt-t0-0.8)/1.0,0,1):0});}
      ag_roomLight(x,1);UG_KICK(x);
      const pulse=Math.sin(Math.PI*clamp((tt-P.read)/0.9,0,1));
      T_.forEach(([n,s],i)=>{const t0=P.servers+0.2+i*0.3,grey=i===2;x.save();if(grey)x.globalAlpha*=0.55;
        ag_tool(x,1230,218+i*150,420,116,n,{sub:s,icon:grey?null:"lock",a:ag_in(tt,t0,0.4),touch:grey?0:Math.max(ag_in(tt,P.only-0.6+i*0.4+0.7,0.3),pulse)});x.restore();});
      ag_pill(x,1510,712,"registered through Unity Gateway",{col:AG.blue,size:28,a:ag_in(tt,P.gw,0.4)});}}
  ],0.6);});

/* ---------------------------------------------------------------- 6 · Through the gateway */
scene("gateway",(ctx,S,t,sc)=>{const c=sc.cues,P=ug_once(sc,"P",()=>({ug:wAt(sc,"models","In Unity Gateway"),svc:wAt(sc,"models","a service in the catalog"),
    keys:wAt(sc,"one","Mei's keys"),inout:wAt(sc,"checks","what goes in"),hides:wAt(sc,"email","hides it"),trick:wAt(sc,"trick","to trick the agent"),
    lim:wAt(sc,"limit","how many calls"),name:wAt(sc,"count","under its name"),bud:wAt(sc,"count","its own budget")}));
  const AGT={x:400,y:470,R:120,r:64},TH=[470,500,700,520,860,390,1000,400],TH2=[1000,400,1120,408,1220,300,1300,244];
  const thread=(x,tt,u)=>{ug_thread(x,TH,clamp(u*2,0,1),{beads:tt,n:3,speed:0.3});if(u>0.5)ug_thread(x,TH2,(u-0.5)*2,{beads:tt+0.6,n:2,speed:0.3});};
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"ugLab",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{const tu=ag_sine((tt-c.one-0.2)/1.6),ka=ag_in(tt,P.keys,0.4)*(1-ag_in(tt,P.keys+2.4,0.6));
      ug_agent(x,tt,Object.assign({think:0.5},AGT));ug_badgeOn(x,tt,"registrar agent",AGT);thread(x,tt,tu);
      ug_gateway(x,1000,200,140,450,{p:(tt-P.ug)/1.2});ag_roomLight(x,1);UG_KICK(x);
      [["registrar agent"],["data team"],[null]].forEach(([w],i)=>{const t0=P.svc+0.1+i*0.3;
        ug_service(x,1300,170+i*180,560,{who:w,grey:w?0:1,a:ag_in(tt,t0,0.4),k:ag_spr(tt,t0),lit:i===0?Math.max(ag_io(tt,c.granted,c.granted+1.2,0.3),ag_in(tt,c.one+1.4,0.5)):i===1?ag_io(tt,c.granted+0.5,c.granted+1.7,0.3):0});});
      // Mei's keys, taken back
      if(ka>0){x.save();x.globalAlpha*=ka;const bx=110,by=150;ag_box(x,bx,by,620,150,20,{});ag_T(x,"MEI'S KEYS · FOR THE AGENT",bx+28,by+48,{w:700,size:28,ls:3,col:AG.kick});
        ug_key(x,bx+70,by+102,0.7,{rot:0});ug_key(x,bx+230,by+102,0.6,{rot:0});const st=ag_sine((tt-P.keys-0.5)/0.6);
        if(st>0){x.strokeStyle=rgba(AG.mut,0.9);x.lineWidth=4;x.lineCap="round";x.beginPath();x.moveTo(bx+30,by+118);x.lineTo(bx+30+(330)*st,by+86);x.stroke();}
        ag_T(x,"taken back",bx+592,by+112,{w:700,size:28,align:"right",col:AG.mut,a:ag_in(tt,P.keys+0.9,0.4)});x.restore();}}},
    // checks on each service, in beta: an email address hidden, words written to trick it stopped; a limit; every call counted
    {cut:true,at:c.checks,place:"ugLab",keys:[[c.checks,960,540,1]],push:0.02,draw:(x,tt)=>{
      ug_agent(x,tt,Object.assign({think:0.5},AGT));ug_badgeOn(x,tt,"registrar agent",AGT);thread(x,tt,1);
      ug_gateway(x,1000,200,140,450,{});ag_roomLight(x,1);UG_KICK(x);
      [["registrar agent"],["data team"],[null]].forEach(([w],i)=>ug_service(x,1300,170+i*180,560,{who:w,grey:w?0:1,lit:i===0?1:0}));
      ug_check(x,906,716,"sensitive data",{a:ag_in(tt,c.checks+0.6,0.4)});ug_check(x,920,800,"prompt injection",{a:ag_in(tt,c.checks+1.0,0.4)});
      // a prompt comes to the gateway's door, its email address is hidden there, and it goes on through
      const pe=c.email,pin=ag_eo(clamp((tt-pe-0.2)/0.8,0,1)),pon=ag_sine((tt-P.hides-0.9)/1.0),pa=ag_in(tt,pe+0.2,0.3)*(1-ag_in(tt,P.hides+1.1,0.5));
      if(pa>0)ug_prompt(x,lerp(420,480,pin)+pon*420,180,{a:pa,hide:ag_in(tt,P.hides,0.6)});
      // words written to trick it come to the same door, and stop there
      const st=c.trick+0.2,sa=ag_in(tt,st,0.3)*(1-ag_in(tt,c.limit-0.3,0.5));
      if(sa>0){const sx=lerp(600,780,ag_eo(clamp((tt-st)/0.9,0,1)))+Math.sin((tt-st-0.9)*38)*6*ag_io(tt,st+0.9,st+1.3,0.1);ug_slip(x,sx,256,{a:sa});
        ag_pill(x,sx,330,"blocked",{icon:"warn",col:AG.amber,size:28,a:ag_in(tt,P.trick,0.4)*sa});}
      ug_dial(x,1420,800,52,{a:ag_in(tt,c.limit+0.2,0.4),v:ag_keys(tt,[[c.limit,0.2],[c.limit+1.2,0.84],[c.limit+1.6,0.8]])});
      ag_T(x,"limit · 60 calls a minute",1490,810,{w:700,size:28,a:ag_in(tt,P.lim,0.4)});}},
    // every call counted under its name: the registrar's office sees what its agent costs, in its own budget
    {cut:true,at:c.count,place:"ugLab",keys:[[c.count,960,540,1]],push:0.02,draw:(x,tt)=>{const AG2={x:1580,y:430,R:130,r:68};
      ug_agent(x,tt,Object.assign({think:0.3},AG2));ug_badgeOn(x,tt,"registrar agent",AG2);
      ug_who(x,"mei",tt,{p:{gaze:[4,-1]}});ag_roomLight(x,1);UG_KICK(x);ug_name(x,250,196,"Mei Tanaka","Registrar's office",ag_in(tt,c.count+0.2,0.5));
      ug_usage(x,476,230,620,{a:ag_in(tt,P.name,0.5),k:ag_spr(tt,P.name),fill:ag_sine((tt-P.name-0.3)/1.2),budget:ag_in(tt,P.bud,0.5)});}}
  ],0.6);});

/* ---------------------------------------------------------------- 7 · Seen under its own name */
scene("seen",(ctx,S,t,sc)=>{const c=sc.cues,P=ug_once(sc,"P",()=>({q:wAt(sc,"same","The same question"),mei:wAt(sc,"same","lists Mei"),agent:wAt(sc,"same","the registrar agent"),
    says:wAt(sc,"whose","Now the log says"),tables:wAt(sc,"lineage","the tables"),table:wAt(sc,"usage","own table"),tokens:wAt(sc,"usage","the tokens"),
    alone:wAt(sc,"stop","stop the agent alone"),nobody:wAt(sc,"stop","nobody else")}));
  const AG2={x:1600,y:430,R:130,r:68};
  const rows=(tt,hl)=>[{when:"Mon 09:12",who:"mei.tanaka@uni.example",a:ag_in(tt,P.mei,0.4)},{when:"Wed 14:05",who:"mei.tanaka@uni.example",a:ag_in(tt,P.mei+0.3,0.4)},
    {when:"Sun 02:14",id:"7c41e09a-…",tag:"registrar agent",a:ag_in(tt,P.agent,0.4),hl},{when:"Sun 02:15",id:"7c41e09a-…",tag:"registrar agent",a:ag_in(tt,P.agent+0.3,0.4),hl}];
  ag_shots(ctx,S,t,sc.dur,[
    // a month later: the same question, and an answer that says whose reads they were
    {at:0,place:"ugLab",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{const hl=Math.sin(Math.PI*clamp((tt-P.says)/1.2,0,1));
      const ca=ag_io(tt,0.3,c.same,0.5);ug_who(x,"sam",tt,{p:{gaze:[4,-1]}});ag_roomLight(x,1);UG_KICK(x,false,1-ca);ug_corner(x,"A month later",ca);ug_name(x,250,196,"Sam Okafor","Data platform",ag_in(tt,0.4,0.5));
      ug_query(x,476,180,760,{a:ag_in(tt,P.q,0.5),k:ag_spr(tt,P.q)});
      ug_log(x,476,446,880,rows(tt,ag_in(tt,P.agent+0.6,0.4)*0.6+hl*0.4),{sub:"November",a:ag_in(tt,P.mei-0.3,0.4)});}},
    // lineage: the tables its queries read; and the gateway's own table of its calls
    {cut:true,at:c.lineage,place:"ugLab",keys:[[c.lineage,960,540,1]],push:0.02,draw:(x,tt)=>{const t0=P.tables;
      ug_who(x,"sam",tt,{p:{gaze:[4,-1]}});ag_roomLight(x,1);UG_KICK(x);ug_name(x,250,196,"Sam Okafor","Data platform",1);
      ag_label(x,480,214,"Lineage",{col:AG.kick,a:ag_in(tt,c.lineage+0.2,0.4)});
      const T3=["core_learner_v1","core_credential_v2","core_award"].map((n,i)=>ug_table(x,476,246+i*104,n,{a:ag_in(tt,t0-0.2+i*0.25,0.4)}));
      const A=ug_card(x,950,330,300,{kick:"Answer",title:"Nursing"},{a:ag_in(tt,t0+0.6,0.4),edge:AG.orange,kickCol:AG.orange});
      T3.forEach((b,i)=>ug_line(x,b.x+b.w+10,b.y+b.h/2,A.x-12,A.y+A.h/2,(tt-t0-0.2-i*0.2)/0.7,{}));
      ug_card(x,1300,250,560,{kick:"The gateway's own table",title:"system.ai_gateway.usage",sub:"requester · registrar agent"},{a:ag_in(tt,P.table,0.5),k:ag_spr(tt,P.table),edge:AG.blue,kickCol:AG.blue});
      ag_pill(x,1580,500,"every call · its tokens",{col:AG.blue,size:28,a:ag_in(tt,P.tokens,0.4)});}},
    // if something looks wrong, Sam stops the agent alone, and nobody else stops with it
    {cut:true,at:c.stop,place:"ugLab",keys:[[c.stop,1000,540,1]],push:0.02,draw:(x,tt)=>{const g=ag_io(tt,P.alone+0.2,P.alone+2.8,0.5);
      ug_agent(x,tt,{x:900,y:420,R:130,r:68,dim:g});ug_badgeOn(x,tt,"registrar agent",{x:900,y:420,R:130,grey:g,off:true});
      ug_agent(x,tt,{x:1500,y:420,R:130,r:68,think:ag_in(tt,P.nobody,0.5)*0.8});ug_badgeOn(x,tt,"census agent",{x:1500,y:420,R:130});
      ug_who(x,"sam",tt,{p:{gaze:[4,-1]}});ag_roomLight(x,1);UG_KICK(x);ug_name(x,250,196,"Sam Okafor","Data platform",1);}},
    // and no read of the agent's is taken for Mei's again
    {cut:true,at:c.mei,place:"ugLab",keys:[[c.mei,960,540,1]],push:0.02,draw:(x,tt)=>{
      ug_who(x,"mei",tt,{p:{gaze:[4,-1]}});ag_roomLight(x,1);UG_KICK(x);ug_name(x,250,196,"Mei Tanaka","Registrar's office",ag_in(tt,c.mei+0.2,0.5));
      ug_log(x,476,300,880,rows(1e6,ag_io(tt,c.mei+0.8,c.mei+2.4,0.4)),{sub:"November",a:ag_in(tt,c.mei+0.3,0.5)});}}
  ],0.6);});

/* ---------------------------------------------------------------- 8 · One set of rules */
scene("one",(ctx,S,t,sc)=>{const c=sc.cues,P=ug_once(sc,"P",()=>({agent:wAt(sc,"hold","every agent"),tool:wAt(sc,"hold","every tool"),person:wAt(sc,"hold","every person"),
    keep:wAt(sc,"same","one set to keep"),log:wAt(sc,"same","one log to read"),rev:wAt(sc,"same","one review"),gov:wAt(sc,"number","sends the government"),
    see:wAt(sc,"checked","can see"),limit:wAt(sc,"checked","limit"),acct:wAt(sc,"checked","account for")}));
  const ROWS=[[["Mei Tanaka",0],["Clara Jensen",0],["Sam Okafor",0]],[["registrar agent",1],["census agent",1]],[["Catalog",2],["Query",2],["census_day_students",2]]];
  ag_shots(ctx,S,t,sc.dur,[
    // kept where the data and the models live, the rules hold for every agent, every tool and every person
    {at:0,place:"ugLab",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{ag_roomLight(x,1);UG_KICK(x);
      ug_page(x,110,210,560,"What you must not do",["Never copy names, emails or student","IDs out of the project, into a prompt,","a log or a pull request, beyond the","sample a claim needs."],{a:ag_in(tt,0.3,0.5)});
      ug_catalog(x,760,200,1100,470,{});ug_gateway(x,1690,290,270,340,{label:false});ag_label(x,1690,270,"Unity Gateway",{align:"center"});
      ag_T(x,"models",1690,440,{w:700,size:30,align:"center",col:AG.blue});ag_T(x,"tool servers",1690,490,{w:700,size:30,align:"center",col:AG.blue});
      const T0=[P.person,P.agent,P.tool];ROWS.forEach((r,j)=>{let px=800;r.forEach(([s,k],i)=>{const t0=T0[j]+i*0.18,u=ag_eo(clamp((tt-t0)/0.8,0,1)),a=ag_in(tt,t0,0.3);
        const w=ag_tw(x,s,{w:700,size:28})+56;const b=ag_pill(x,px+w/2+(1-u)*-40,286+j*120,s,{size:28,a,col:k===1?AG.violet:k===2?AG.blue:null});px+=w+16;});});
      ag_pill(x,960,740,"one set to keep",{col:AG.blue,a:ag_in(tt,P.keep,0.4)});ag_pill(x,1290,740,"one log to read",{col:AG.blue,a:ag_in(tt,P.log,0.4)});
      ag_pill(x,1580,740,"one review",{col:AG.blue,a:ag_in(tt,P.rev,0.4)});}},
    // Jun's census agent works under them too: the number the university sends the government, checked by an agent the team can see
    {cut:true,at:c.census,place:"ugLab",keys:[[c.census,960,540,1]],push:0.02,draw:(x,tt)=>{const fly=ag_sine((tt-P.acct-0.6)/1.4);
      ug_agent(x,tt,{});ug_badgeOn(x,tt,"census agent",{});
      ug_who(x,"jun",tt,{p:{gaze:[4,-1]}});ag_roomLight(x,1);UG_KICK(x);ug_name(x,250,196,"Jun Park","Analytics engineer",ag_in(tt,c.census+0.2,0.5));
      if(fly<1){x.save();x.globalAlpha*=1-ag_in(fly,0.2,0.25);x.translate(fly*fly*700,-fly*fly*200);ug_count(x,1340,240,{w:480,a:ag_in(tt,c.number,0.4),k:ag_spr(tt,c.number),gov:ag_in(tt,P.gov,0.5)});x.restore();}
      [["seen",P.see],["limited",P.limit],["counted",P.acct]].forEach(([s,t0],i)=>ag_pill(x,UG.agent.x+(i-1)*190,790,s,{col:AG.blue,size:28,a:ag_in(tt,t0,0.4)}));}},
    // every morning, the faculties' answers wait under the registrar agent's own name
    {cut:true,at:c.morning,place:"ugLab",keys:[[c.morning,960,540,1]],push:0.02,draw:(x,tt)=>{
      ug_agent(x,tt,{});ug_badgeOn(x,tt,"registrar agent",{});ug_ownerOn(x,"owner · Mei Tanaka",{});
      const ca=ag_in(tt,c.morning+0.2,0.5);ug_who(x,"mei",tt,{p:{gaze:[4,-1],smile:0.45}});ag_roomLight(x,1);UG_KICK(x,false,1-ca);ug_corner(x,"Every morning",ca);
      ug_answers(x,1340,190,520,{n:3,tick:1,sign:ag_in(tt,c.morning+0.8,0.6)});}},
    // one set of rules for people and agents, enforced where the data and the models live; next, the team's context and memory
    {cut:true,at:c.take,place:"ugLab",keys:[[c.take,960,540,1]],push:0.02,draw:(x,tt)=>withA(x,1-ag_in(tt,c.breath,0.9),()=>{ag_roomLight(x,1);UG_KICK(x);
      const la=ag_in(tt,c.take+0.2,0.6);ag_T(x,"One set of rules for people and agents,",960,380,{w:700,size:48,align:"center",a:la});
      ag_T(x,"enforced where the data and the models live.",960,450,{w:700,size:48,align:"center",a:la});
      ug_card(x,650,560,620,{kick:"Next",title:"Context and memory, governed"},{a:ag_in(tt,c.next,0.4),k:ag_spr(tt,c.next)});})}
  ],0.6);
  ag_end(ctx,S,t,c.breath,"Why Unity Catalog and Unity Gateway govern them","One set of rules for people and agents.","Film 8 of 9","Agents at work on data");});

// every chapter after the opening opens on a cut: each shows the same room as the one before, under another camera
ag_cutInto(["holds","name","stars","tools","gateway","seen","one"]);
