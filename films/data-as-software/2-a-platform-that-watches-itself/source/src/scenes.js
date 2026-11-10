/* ===== A platform that watches itself: the scenes, chapter by chapter =====
   Each chapter is a run of shots (ag_shots): a place painted once, a slow camera, and what's drawn live. Times come from the cues
   (c.<line>, when each line starts) and from the words of the lines (wAt), so the pictures stay with the voice.
   In one room the camera glides and only what changes fades: the map of the night is one room from the claims job's failure to the
   agent's inbox (chapters 2 and 3 join with ag_cutInto), and the night of the last two chapters is one room too. Between rooms, a shot
   that shows the same words as the one before comes in on a cut; one whose whole picture changes dissolves. Where a card gives way to
   another in one room, the first leaves before the next comes in, so no words show twice. */

function pw_once(sc,k,fn){sc.__pw=sc.__pw||{};if(!(k in sc.__pw))sc.__pw[k]=fn();return sc.__pw[k];}
// the corner: where and when, at the top left, in the frame itself (it stays while the camera moves); [from, till, text]
function pw_corner(ctx,S,text,a){if(a<=0.004)return;setScreen(ctx,S);ctx.save();ctx.globalAlpha*=a;ctx.fillStyle=rgba(MD.flow,1);ctx.shadowColor=rgba(MD.flow,0.9);ctx.shadowBlur=10;rr(ctx,80,74,6,34,3);ctx.fill();ctx.restore();
  md_label(ctx,100,100,text,{a});}
function pw_corners(ctx,S,t,list){for(const [t0,t1,s] of list){const a=ag_in(t,t0,0.5)*(1-ag_in(t,t1-0.4,0.4));if(a>0)pw_corner(ctx,S,s,a);}}
// a person and their name above them, coming and going whole
function pw_who(ctx,who,x,y,a,t,o){o=o||{};if(a<=0.004)return;withA(ctx,a,()=>md_person(ctx,who,x,y,o.s||1,Object.assign({t},o)));
  md_nameTag(ctx,x,y-410,who,{align:"center",col:o.col,a,role:o.role,name:o.name});}
// a form's fields, a label and its value on each row, each row coming in by itself (o.rowA(i))
function pw_fields(ctx,x,y,w,rows,o){o=o||{};const rh=o.rh||96,kw=o.kw||260;rows.forEach(([k,v,f],i)=>{const a=o.rowA?o.rowA(i):1;if(a<=0.004)return;const yy=y+i*rh;
  withA(ctx,a,()=>{md_T(ctx,k,x,yy+46,{w:600,size:28,col:MD.soft});md_T(ctx,v,x+kw,yy+46,{w:700,size:32,f});
    ctx.strokeStyle="rgba(170,200,245,0.16)";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x,yy+rh-12);ctx.lineTo(x+w,yy+rh-12);ctx.stroke();});});}
// a card's spring, from t0
const pw_k=(t,t0)=>ag_spr(t,t0,0.55);
// in one room, what one moment shows leaves before the next comes in: in at t0, out by t1
const pw_io=(t,t0,t1)=>ag_in(t,t0,0.4)*(1-ag_in(t,t1-0.4,0.4));

/* ---------------------------------------------------------------- 1 · The 1202 alarm */
scene("alarm",(ctx,S,t,sc)=>{const c=sc.cues,P=pw_once(sc,"P",()=>({steer:wAt(sc,"descent","its computer steering"),lightOn:wAt(sc,"light","a light comes on"),code:wAt(sc,"light","code"),
    hou:wAt(sc,"ask","Houston"),stop:wAt(sc,"stakes","stopped"),abort:wAt(sc,"stakes","abort"),back:wAt(sc,"stakes","turn back"),secs:wAt(sc,"seconds","in seconds"),
    mit:wAt(sc,"built","MIT"),watch:wAt(sc,"built","watch itself"),again:wAt(sc,"restart","starts again"),keeps:wAt(sc,"restart","keeps the steering"),drops:wAt(sc,"restart","drops the rest"),
    alarm:wAt(sc,"raised","raises the alarm"),people:wAt(sc,"raised","people can decide"),review:wAt(sc,"bales","review its alarms"),half:wAt(sc,"go","Half a minute"),up:wAt(sc,"go","the word goes up"),
    four:[0,1,2,3].map(i=>c.four+0.35+i*0.42),lands:wAt(sc,"landed","lands"),said:wAt(sc,"kept","said what was wrong"),knew:wAt(sc,"kept","people who knew"),
    fails:wAt(sc,"uni","fails one night"),morning:wAt(sc,"decide","By morning"),person:wAt(sc,"decide","a person decides")}));
  // the module's descent: where it is along its path, from high on the left to the ground
  const U=tt=>ag_keys(tt,[[0,0.02],[c.light,0.3],[c.stakes,0.5],[c.seconds+2,0.62],[c.four,0.84],[P.lands,1]],u=>u);
  const lm=(x,tt,o)=>{const u=U(tt),q=pw_lmAt(u),land=ag_in(tt,P.lands-0.15,0.2);pw_lm(x,q.x,q.y,q.s,{tilt:q.tilt,fire:(1-land)*(0.8+0.2*Math.sin(tt*3)),t:tt});if(tt>P.lands-1.5)pw_dust(x,q.x,q.y+190*q.s,tt,P.lands);return q;};
  ag_shots(ctx,S,t,sc.dur,[
    // 20 July 1969: the Moon below, the Earth in the black sky, and the module coming down its long curve; the camera draws back slowly
    {at:0,place:"pwSpace",keys:[[0,800,450,1.2],[0.4,900,470,1.06]],d:9,push:0.02,draw:(x,tt)=>{const q=lm(x,tt);
      md_tag(x,q.x+170*q.s,q.y-30,"its computer steering",{icon:"refresh",col:MD.flow,a:pw_io(tt,P.steer,c.light-0.2)});}},
    // its display and keyboard: the computer at work, then the PROG light, amber, and the code 1202
    {at:c.light-0.5,place:"pwPanel",keys:[[c.light-0.5,960,540,1.0],[c.light+0.9,1003,470,1.3],[c.more-0.5,960,540,1.0]],d:1.5,push:0,draw:(x,tt)=>{
      const k=Math.floor(tt*7),alt=String(33500-Math.floor((tt-c.light)*180)).padStart(5,"0");
      pw_dsky(x,tt,{prog:ag_in(tt,P.lightOn+0.6,0.25),comp:(k%3)?1:0,code:ag_in(tt,P.code+0.5,0.3),verb:tt>P.code+0.3?"05":"06",noun:tt>P.code+0.3?"09":"63",r:["+02"+String(350-k%40).padStart(3,"0"),"-00"+String(740+k%9).padStart(3,"0"),"+"+alt]});
      md_textCard(x,1330,400,500,{kick:"1202",title:"More work than time"},{edge:MD.wait,k:pw_k(tt,c.more),a:ag_in(tt,c.more,0.3)});}},
    // Houston: the crew ask about the code; it comes down to Mission Control as a word on a thin line
    {at:c.ask-0.4,place:"pwHouston",keys:[[c.ask-0.4,960,500,1.06]],push:0.03,draw:(x,tt)=>{
      md_textCard(x,960-470,360,940,{kick:"Neil Armstrong, from Eagle",title:"\u201cGive us a reading on the 1202 program alarm.\u201d"},{edge:MD.wait,k:pw_k(tt,P.hou-0.5),a:ag_in(tt,P.hou-0.5,0.35)});}},
    // what either way would cost: the descent, and two tags over it; the abort's way back up, dashed; then: decide, in seconds
    {at:c.stakes-0.3,place:"pwSpace",keys:[[c.stakes-0.3,1000,470,1.1]],push:0.03,draw:(x,tt)=>{const q=lm(x,tt);
      const ab=ag_in(tt,P.back-0.2,1.2);if(ab>0)md_lane(x,md_curve([q.x+70,q.y-170],[q.x+620,q.y-400],{bend:0.45}),MD.fail,0.8,{dash:true,u:ab,t:tt});
      md_tag(x,q.x-600,q.y+30,"stop: nothing steers",{icon:"cross",col:MD.fail,a:pw_io(tt,P.stop,c.seconds-0.1)});
      md_tag(x,q.x+250,q.y-110,"abort: no landing",{icon:"cross",col:MD.fail,a:pw_io(tt,P.abort,c.seconds-0.1)});
      md_pill(x,q.x,q.y+330,"decide, in seconds",{col:MD.wait,icon:"clock",k:pw_k(tt,P.secs),a:ag_in(tt,P.secs,0.3)});}},
    // built to watch itself: its work in a cycle of its time; on a restart the smaller work falls away and the steering and display stay
    {at:c.built-0.3,place:"night",keys:[[c.built-0.3,960,520,1.0]],push:0.025,draw:(x,tt)=>{
      md_tag(x,380,214,"MIT · its makers",{icon:"person",col:[214,224,240],a:ag_in(tt,P.mit,0.4)});md_tag(x,700,214,"built to watch itself",{icon:"eye",col:MD.flow,a:ag_in(tt,P.watch,0.4)});
      pw_work(x,380,290,{over:1,restart:clamp((tt-P.again)/1.6,0,1),a:ag_in(tt,c.built-0.3,0.4)});
      if(tt>P.again-0.2&&tt<P.again+1.6){const r=ag_sine((tt-P.again+0.2)/1.8);md_icon(x,"refresh",1540,375,56,MD.flow,{a:Math.sin(Math.PI*r)});}
      // and it raises the alarm, so people can decide
      const al=ag_in(tt,P.alarm,0.4);if(al>0){md_pill(x,960,712,"PROG · 1202",{col:MD.wait,icon:"warn",a:al,k:pw_k(tt,P.alarm)});md_tag(x,960,800,"people decide",{icon:"person",col:MD.wait,align:"center",a:ag_in(tt,P.people,0.4)});}}},
    // the guidance console: the officer who had just helped review its alarms, and the rule they'd agreed
    {at:c.bales-0.3,place:"pwConsole",keys:[[c.bales-0.3,920,520,1.0]],push:0.03,draw:(x,tt)=>{
      md_person(x,PW_CTRL,560,600,1.0,{t:tt,cut:812,covered:true,gaze:[3,1]});md_nameTag(x,560,190,PW_CTRL,{align:"center",name:"The guidance officer",role:"Houston, 20 July 1969",col:MD.flow});
      md_textCard(x,960,220,840,{kick:"Alarms reviewed",title:"1202: go on",sub:"unless it comes too often, or the descent goes off course"},{edge:MD.agreed,icon:"contract",k:pw_k(tt,c.meant-0.2),a:ag_in(tt,c.meant-0.2,0.35)});
      // half a minute after the alarm, the word goes up: go
      md_tag(x,960,560,"half a minute after the alarm",{icon:"clock",col:[214,224,240],a:ag_in(tt,P.half,0.4)});
      const g=ag_sine((tt-P.up)/2.2);if(g>0&&g<1){const y=lerp(520,-60,g);md_lane(x,[[840,540],[840,y]],MD.pass,0.7*(1-g));md_pill(x,840,y,"go",{col:MD.pass,icon:"tick",size:36});}}},
    // four more alarms, each a go, and the landing: the module touches down in a soft lift of grey dust
    {at:c.four-0.3,place:"pwSpace",keys:[[c.four-0.3,1130,550,1.22]],push:0.02,draw:(x,tt)=>{const q=lm(x,tt);
      ["1202","1201","1202","1202"].forEach((s,i)=>{const f=P.four[i],a=ag_in(tt,f,0.25)*(1-ag_in(tt,c.kept-0.2,0.5));if(a<=0)return;const ok=ag_in(tt,f+0.3,0.25);
        md_tag(x,500,330+i*68,s+(ok>0.5?" · go":""),{icon:ok>0.5?"tick":"warn",col:mix(MD.wait,MD.pass,ok),a,size:28});});
      md_tag(x,1130,197,"it watched itself, and said what was wrong",{icon:"eye",col:MD.flow,align:"center",a:pw_io(tt,P.said-0.6,c.uni)});
      md_tag(x,1130,263,"people who knew decided",{icon:"person",col:MD.pass,align:"center",a:pw_io(tt,P.knew,c.uni)});}},
    // this November: the university's map at night, the claims job, its first task failing; by morning, one insight for a person
    {at:c.uni-0.2,place:"map",keys:[[c.uni-0.2,960,540,1.0]],push:0.02,draw:(x,tt)=>{const f=ag_in(tt,P.fails,0.6),m=ag_in(tt,P.morning,0.5);
      pw_map(x,tt,{a:lerp(1,0.3,m),hu:1,t1:{state:"fail",from:"run",u:f},t2:{state:"wait",from:"idle",u:ag_in(tt,P.fails+0.6,0.6)},clock:tt>P.fails?"Monday 22:03":"Monday 22:00",err:ag_in(tt,P.fails+0.3,0.5),stopped:f,dim:["app","contract","pay"]});
      if(m>0){withA(x,m,()=>pw_zero(x,520,400,880,300,{mode:"inbox",k:pw_k(tt,P.morning)}));md_tag(x,960,760,"a person decides",{icon:"person",col:MD.wait,align:"center",a:ag_in(tt,P.person,0.4)});}}}
  ],0.6);
  pw_corners(ctx,S,t,[[0.9,c.light-0.6,"Apollo 11 · 20 July 1969"],[c.ask-0.2,c.stakes-0.3,"Houston · Mission Control"],[c.bales,c.four-0.3,"Houston · Mission Control"],[c.uni+0.2,c.breath,"The university · November 2026"]]);
  md_title(ctx,S,t,c.breath,"A platform that watches itself","a job fails at night; by morning, a person decides","FILM 2 OF 2 · DATA AS SOFTWARE");});

/* ---------------------------------------------------------------- 2 · The night the job failed */
scene("night",(ctx,S,t,sc)=>{const c=sc.cues,P=pw_once(sc,"P",()=>({claim:wAt(sc,"casual","claim the hours"),app:wAt(sc,"casual","in an app"),job:wAt(sc,"job","the claims job"),
    build:wAt(sc,"job","builds the hours to pay"),send:wAt(sc,"job","sends them"),live:wAt(sc,"version","goes live"),say:wAt(sc,"type","as they say them"),thirty:wAt(sc,"type","one thirty"),
    sent:wAt(sc,"type","where it sent"),still:wAt(sc,"contract","still says"),three:wAt(sc,"fails","three minutes past ten"),fail:wAt(sc,"fails","the job fails"),read:wAt(sc,"fails","can't read"),
    nothing:wAt(sc,"waits","Nothing wrong"),stops:wAt(sc,"waits","the job stops"),noon:wAt(sc,"noon","by noon on Tuesday"),pay:wAt(sc,"noon","eight hundred and fifty-six")}));
  ag_shots(ctx,S,t,sc.dur,[
    // casual staff claim the hours they teach in an app: Linh, a casual tutor, and her claim (the example project's CL-104262)
    {at:0,place:"night",keys:[[0,960,540,1.0]],push:0.025,draw:(x,tt)=>{pw_who(x,"linh",420,660,ag_in(tt,0.2,0.6),tt,{col:[214,224,240]});
      md_window(x,800,170,980,560,{product:"Claims app",title:"A claim",edge:MD.sys.hr,a:ag_in(tt,P.claim-0.3,0.5),k:pw_k(tt,P.claim-0.3),draw:(cx,B)=>{
        pw_fields(cx,B.x+24,B.y+30,B.w-48,[["Unit","HI101"],["Duty","consultation"],["Day","Thursday 29 October"],["Hours","1.50","mono"]],{rowA:i=>ag_in(tt,P.claim+0.2+i*0.35,0.3)});}});}},
    // the map, one shot whose camera glides: the claims job, at ten on the Monday before pay day, builds the hours to pay and sends
    // them to the payroll system; on the app's new version, at 15:02, the camera glides to the app, its hours in the new form, and its
    // contract, unchanged; at 22:03 it glides back as the job fails, nothing wrong reaches payroll, and payroll needs the hours by noon
    {cut:true,at:c.job-0.3,place:"map",keys:[[c.job-0.3,960,520,1.0],[c.version-0.4,560,470,1.32],[c.fails-0.6,960,520,1.0]],d:1.8,push:0,draw:(x,tt)=>pw_nightMap(x,tt,P,c)}
  ],0.6);
  pw_corners(ctx,S,t,[[0.5,c.job-0.4,"Casual staff · the claims app"]]);});
// the night's map, as it is at tt
function pw_nightMap(x,tt,P,c){const fail=ag_in(tt,P.fail,0.6),late=tt>P.three-0.2;
  pw_map(x,tt,{hu:ag_in(tt,P.thirty,0.5),caret:pw_io(tt,P.say,P.sent+1),t:tt,flow:!late,stopped:ag_in(tt,P.stops,0.8),clock:late?"Monday 22:03":"Monday 22:00",
    t1:{state:fail>0?"fail":tt>P.build?"run":"idle",from:fail>0?"run":"idle",u:fail>0?fail:ag_in(tt,P.build,0.5)},t2:{state:"wait",from:"idle",u:ag_in(tt,P.stops,0.6)},
    err:ag_in(tt,P.read,0.5),contractLit:pw_io(tt,P.still,c.fails),job:1,appLit:pw_io(tt,P.live,P.say),
    dim:["plat","job","pay"],dimA:ag_in(tt,c.version-0.6,0.5)*(1-ag_in(tt,c.fails+0.9,0.5))});
  md_pill(x,270,150,"new version · 15:02",{col:MD.sys.hr,icon:"refresh",size:28,k:pw_k(tt,P.live),a:pw_io(tt,P.live,c.fails-0.6)});
  md_tag(x,1440,200,"nothing wrong arrives",{icon:"lock",col:MD.pass,a:ag_in(tt,P.nothing,0.4)*(1-ag_in(tt,P.noon-0.4,0.4))});
  md_tag(x,1440,200,"needed by Tuesday 12:00",{icon:"clock",col:[214,224,240],a:ag_in(tt,P.noon,0.4)});
  md_textCard(x,1440,400,440,{kick:"Pay day · Thursday",title:"856 casual staff"},{edge:[214,224,240],icon:"person",k:pw_k(tt,P.pay),a:ag_in(tt,P.pay,0.35)});}

/* ---------------------------------------------------------------- 3 · Watching overnight */
scene("watch",(ctx,S,t,sc)=>{const c=sc.cues,P=pw_once(sc,"P",()=>({zero:wAt(sc,"sam","Genie ZeroOps"),jobs:wAt(sc,"sam","jobs and tables"),bg:wAt(sc,"agent","in the background"),
    nobody:wAt(sc,"agent","nobody asking"),finds:wAt(sc,"detect","finds the failure"),traces:wAt(sc,"cause","traces the cause"),form:wAt(sc,"cause","changed form"),
    hits:[wAt(sc,"touches","the hours for the payroll system"),wAt(sc,"touches","payroll's export"),wAt(sc,"touches","casual teaching cost")],
    prop:wAt(sc,"fix","proposes a fix"),half:wAt(sc,"fix","one and a half"),morning:wAt(sc,"inbox","By morning"),prod:wAt(sc,"inbox","nothing in production"),
    lineage:wAt(sc,"knows","keep the lineage"),owns:wAt(sc,"knows","who owns what")}));
  // the agent's page: what it watches, then (each page leaving before the next comes in) its insight, step by step, then its inbox
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"map",keys:[[0,960,520,1.0]],push:0,draw:(x,tt)=>{const out=ag_in(tt,c.knows-0.6,0.5),zin=ag_in(tt,P.zero-0.2,0.5)*(1-out);
      pw_map(x,tt,{a:lerp(1,0.2,ag_in(tt,0.6,1.2))*(1-out)+out,hu:1,t1:{state:"fail"},t2:{state:"wait"},clock:"Monday 22:03",err:1-ag_in(tt,0.6,0.8),stopped:1,flow:out>0.5,
        exp:Math.max(ag_in(tt,P.hits[1],0.4)*(1-out),out),cost:Math.max(ag_in(tt,P.hits[2],0.4)*(1-out),out),hit:0,lanes:1,owners:ag_in(tt,P.owns,0.5),
        appLit:pw_io(tt,P.lineage,sc.dur),payLit:pw_io(tt,P.lineage+0.3,sc.dur)});
      md_pill(x,960,96,"the platform is watching",{icon:"eye",col:MD.flow,a:pw_io(tt,0.9,P.zero-0.3)*(1-out)});
      // Sam, who runs the platform, set it to watch; then he goes home, and it works on with nobody asking
      pw_who(x,"sam",330,660,ag_in(tt,c.sam,0.6)*(1-ag_in(tt,P.nobody,0.7)),tt,{col:MD.flow});
      const mode=tt<P.finds-0.1?"watch":tt<c.inbox-0.1?"insight":"inbox",T=mode==="watch"?P.finds-0.1:mode==="insight"?(tt<P.finds+0.5?P.finds-0.1:c.inbox-0.1):c.inbox-0.1;
      const ma=mode==="watch"?1-ag_in(tt,P.finds-0.5,0.3):mode==="insight"?ag_in(tt,P.finds-0.1,0.3)*(1-ag_in(tt,c.inbox-0.5,0.3)):ag_in(tt,c.inbox-0.1,0.3);
      const view=tt<c.cause-0.1?0:tt<c.touches-0.1?1:tt<c.fix-0.1?2:3,vT=[P.finds-0.1,c.cause-0.1,c.touches-0.1,c.fix-0.1],nx=[c.cause-0.1,c.touches-0.1,c.fix-0.1,c.inbox-0.1][view],
        vu=ag_in(tt,vT[view]+0.3,0.3)*(1-ag_in(tt,nx-0.4,0.3));
      if(zin>0)withA(x,zin,()=>pw_zero(x,700,100,1160,750,{mode,ma,k:pw_k(tt,P.zero-0.2),rows:ag_in(tt,P.jobs,0.8),night:ag_in(tt,P.bg,0.5),
        steps:[ag_in(tt,P.finds,0.5),ag_in(tt,P.form+0.4,0.5),ag_in(tt,P.hits[2]+0.4,0.5),ag_in(tt,P.half,0.5)],view,vu,trace:clamp((tt-P.traces)/3.2,0,1),cause:ag_in(tt,P.form,0.5),
        hits:P.hits.map(h=>ag_in(tt,h,0.4)),fix:clamp((tt-P.prop)/2.4,0,1),fixK:pw_k(tt,P.half),lock:ag_in(tt,P.prod,0.5)}));}}
  ],0.6);
  pw_corners(ctx,S,t,[[0.4,P.finds-0.3,"Monday · 22:00"],[P.finds,c.inbox-0.3,"Monday · 22:03"],[c.inbox,c.knows-0.5,"Tuesday · morning"]]);});

/* ---------------------------------------------------------------- 4 · A person approves */
scene("approve",(ctx,S,t,sc)=>{const c=sc.cues,P=pw_once(sc,"P",()=>({cause:wAt(sc,"checks","the cause against the claims"),push:wAt(sc,"checks","push its fix"),
    asks:wAt(sc,"asks","a person asks"),conf:wAt(sc,"asks","confirms"),opens:wAt(sc,"pr","opens a pull request"),tests:wAt(sc,"pr","its tests run"),every:wAt(sc,"pr","every change"),
    didnt:wAt(sc,"noor","didn't write it"),noor:wAt(sc,"noor","Noor"),again:wAt(sc,"runs","runs again"),ten:wAt(sc,"runs","by ten"),paid:wAt(sc,"paid","casual staff are paid"),
    among:wAt(sc,"paid","among them"),prop:wAt(sc,"proposes","proposes"),appr:wAt(sc,"proposes","a person approves")}));
  ag_shots(ctx,S,t,sc.dur,[
    // Tuesday, half past eight: Sam, the insight, the claims beside it; he asks for the fix on a new branch, and confirms the push
    {at:0,place:"pwMorning",keys:[[0,960,540,1.0]],push:0.02,draw:(x,tt)=>{const a1=ag_in(tt,0.3,0.6)*(1-ag_in(tt,P.opens-0.5,0.4));
      pw_who(x,"sam",330,660,ag_in(tt,0.2,0.6),tt,{col:MD.flow});
      if(a1>0)withA(x,a1,()=>{md_card(x,620,140,1220,130,{edge:MD.wait,glow:0.8});x.fillStyle=rgba(MD.wait,1);x.beginPath();x.arc(664,190,9,0,TAU);x.fill();
        md_T(x,"The claims job failed at 22:03",696,200,{w:800,size:32});md_T(x,"cause: the hours' new form · fix proposed",696,246,{w:600,size:28,col:MD.soft});
        md_rows(x,640,310,[{h:"Claim",w:300,f:"mono"},{h:"Hours",w:220,f:"mono"}],[["CL-104190","3.50"],["CL-104262","1.50"],["CL-104287",{s:"1:30",f:"mono",col:mix(MD.fail,MD.ink,0.3)}]],
          {rh:58,lit:tt>P.cause+0.6?2:[],litCol:MD.fail,rowA:(r,i)=>ag_in(tt,P.cause+i*0.2,0.3)});
        pw_confirm(x,1180,320,660,{press:ag_in(tt,P.conf,0.25),k:pw_k(tt,P.push),a:ag_in(tt,P.push,0.35)});
        pw_branch(x,1200,640,620,{u:clamp((tt-P.conf-0.3)/1.2,0,1),a:ag_in(tt,P.conf,0.4)});});
      // the pull request: its tests, then Noor, who didn't write it, approves; the agent proposes and pushes when asked, and never approves
      const a2=ag_in(tt,P.opens-0.1,0.4);
      if(a2>0)withA(x,a2,()=>pw_pr(x,600,110,760,430,{checks:[ag_in(tt,P.tests+0.6,0.4),ag_in(tt,P.every,0.4)],approve:ag_in(tt,P.noor+0.2,0.4),k:pw_k(tt,P.opens-0.1)}));
      pw_who(x,"noor",1640,660,ag_in(tt,P.didnt-0.4,0.6),tt,{flip:true,col:MD.pass});
      pw_agentCard(x,620,580,720,{a:ag_in(tt,c.never,0.35),k:pw_k(tt,c.never)});}},
    // 9:20: the job runs again, both tasks green, and payroll has the hours by ten, before noon
    {cut:true,at:c.runs-0.3,place:"map",keys:[[c.runs-0.3,960,540,1.0]],push:0,draw:(x,tt)=>{const ok=ag_in(tt,P.again,0.6),ok2=ag_in(tt,P.again+1.2,0.6);
      pw_map(x,tt,{hu:1,t1:{state:"ok",from:"fail",u:ok},t2:{state:"ok",from:"wait",u:ok2},clock:"Tuesday 09:20",flow:true,stopped:1-ok2,exp:1,cost:1,dim:["app","contract"]});
      md_tag(x,1440,200,"hours here by 10:00",{icon:"tick",col:MD.pass,a:ag_in(tt,P.ten,0.4)});md_tag(x,1440,130,"needed by 12:00",{icon:"clock",col:[214,224,240],a:ag_in(tt,P.ten+0.4,0.4)});}},
    // Thursday: 856 casual staff are paid, Linh among them
    {at:c.paid-0.3,place:"pwMorning",keys:[[c.paid-0.3,960,540,1.0]],push:0.02,draw:(x,tt)=>{const out=1-ag_in(tt,c.proposes-0.7,0.5);
      pw_who(x,"linh",420,660,ag_in(tt,c.paid-0.3,0.6)*out,tt,{col:[214,224,240]});pw_payday(x,800,300,820,{a:ag_in(tt,P.paid,0.4)*out,k:pw_k(tt,P.paid)});
      md_pill(x,640,330,"paid",{col:MD.pass,icon:"tick",a:ag_in(tt,P.among,0.4)*out,k:pw_k(tt,P.among)});
      // the takeaway
      const ta=ag_in(tt,c.proposes-0.1,0.5);if(ta>0){md_card(x,360,330,1200,250,{edge:MD.pass,glow:0.6,a:ta});withA(x,ta,()=>{
        md_icon(x,"eye",470,420,52,MD.flow);md_T(x,"The platform proposes;",530,436,{w:800,size:48});md_icon(x,"person",470,516,52,MD.pass,{a:ag_in(tt,P.appr,0.4)});
        md_T(x,"a person approves.",530,532,{w:800,size:48,a:ag_in(tt,P.appr,0.4)});});}}}
  ],0.6);
  pw_corners(ctx,S,t,[[0.5,c.noor-0.3,"Tuesday · 08:30"],[c.noor+0.2,c.runs-0.4,"Tuesday · 09:05"],[c.runs,c.paid-0.4,"Tuesday · 09:20"],[c.paid,c.proposes-0.7,"Thursday 5 November · pay day"]]);});

/* ---------------------------------------------------------------- 5 · The contract first */
scene("contract",(ctx,S,t,sc)=>{const c=sc.cues,P=pw_once(sc,"P",()=>({cause:wAt(sc,"mended","not its cause"),good:wAt(sc,"good","a good one"),miss:wAt(sc,"good","missing"),
    asks:wAt(sc,"first","also asks"),ingrid:wAt(sc,"first","Ingrid Holm"),first:wAt(sc,"first","change the contract first"),every:wAt(sc,"knows","everyone who reads"),
    before:wAt(sc,"knows","before the app changes"),doc:wAt(sc,"document","a document"),little:wAt(sc,"document","said too little"),radar:wAt(sc,"document","so a radar's"),
    pct:wAt(sc,"document","thirteen percent"),ch:wAt(sc,"checklist","the checklist changed"),sw:wAt(sc,"checklist","the software")}));
  ag_shots(ctx,S,t,sc.dur,[
    // the fix mended the night, not its cause: the contract still says decimal hours; the app's change was good for tutors
    {at:0,place:"map",keys:[[0,960,520,1.0],[0.5,600,520,1.3]],d:2.2,push:0,draw:(x,tt)=>{const ms=ag_in(tt,P.miss,0.5);
      pw_map(x,tt,{hu:1,good:ag_in(tt,P.good,0.5),t1:{state:"ok"},t2:{state:"ok"},clock:"Tuesday 09:20",contractLit:pw_io(tt,P.cause,c.good),dim:["plat","job","pay"]});
      md_tag(x,560,630,"still: decimal hours",{icon:"contract",col:MD.agreed,a:pw_io(tt,P.cause,c.first)});
      md_tag(x,560,550,"good for tutors",{icon:"tick",col:MD.pass,a:ag_in(tt,P.good,0.4)});
      if(ms>0){md_card(x,560,690,520,84,{dash:[10,9],edge:MD.wait,a:ms});md_T(x,"a step: the contract first",590,744,{w:700,size:30,col:mix(MD.wait,MD.ink,0.3),a:ms});}}},
    // so Sam's pull request also asks Ingrid Holm, in HR, who owns the claims' data, to change the contract first: proposed, for her
    {cut:true,at:c.first-0.3,place:"pwMorning",keys:[[c.first-0.3,960,540,1.0]],push:0.02,draw:(x,tt)=>{pw_who(x,"ingrid",330,660,ag_in(tt,c.first-0.2,0.6),tt,{col:MD.sys.hr,role:"HR · owns the claims' data"});
      pw_pr(x,600,110,760,560,{checks:[1,1],approve:1,ask:ag_in(tt,P.asks,0.5),a:ag_in(tt,c.first-0.2,0.4)});
      pw_decision(x,1400,250,460,{state:"Proposed",a:ag_in(tt,P.first,0.4),k:pw_k(tt,P.first)});}},
    // then everyone who reads the hours knows, before the app changes: the contract, tied in gold to each of them
    {cut:true,at:c.knows-0.3,place:"map",keys:[[c.knows-0.3,960,520,1.0]],push:0.02,draw:(x,tt)=>pw_map(x,tt,{hu:1,t1:{state:"ok"},t2:{state:"ok"},clock:"Tuesday 09:20",exp:1,cost:1,
      gold:clamp((tt-P.every)/1.8,0,1),contractLit:ag_in(tt,P.every,0.5),dim:["plat","job"]})},
    // On Apollo 11, the cause took a night to find
    {at:c.apollo-0.3,place:"pwSpace",keys:[[c.apollo-0.3,1120,520,1.15]],push:0.03,draw:(x,tt)=>pw_lm(x,1180,604,1,{t:tt})},
    // a document between two systems had said too little, so a radar's electronics took about 13% of the computer's time
    {at:c.document-0.3,place:"night",keys:[[c.document-0.3,960,520,1.0]],push:0.02,draw:(x,tt)=>pw_iface(x,{t:tt,k:[pw_k(tt,c.document-0.2),pw_k(tt,c.document+0.2)],doc:ag_in(tt,P.doc,0.4),
      gap:ag_in(tt,P.little,0.5),bar:ag_in(tt,P.radar,0.4),take:clamp((tt-P.pct+0.6)/1.2,0,1)})},
    // for the next missions, the checklist changed, and the software learned to check
    {later:true,at:c.checklist-0.3,place:"night",keys:[[c.checklist-0.3,960,520,1.0]],push:0.02,draw:(x,tt)=>pw_checklist(x,660,120,600,{ch:ag_in(tt,P.ch,0.5),note:ag_in(tt,P.ch+0.5,0.4),noteK:pw_k(tt,P.ch+0.5),
      sw:ag_in(tt,P.sw,0.4),k:pw_k(tt,c.checklist-0.2)})}
  ],0.6);
  pw_corners(ctx,S,t,[[c.first,c.knows-0.4,"Tuesday · the pull request"],[c.apollo,sc.dur,"Apollo 11 · the night after"]]);});

/* ---------------------------------------------------------------- 6 · Don't reinvent the wheel */
scene("close",(ctx,S,t,sc)=>{const c=sc.cues,P=pw_once(sc,"P",()=>({sre:wAt(sc,"old","site reliability engineers"),al:wAt(sc,"old","alerts"),oncall:wAt(sc,"old","people on call"),
    blame:wAt(sc,"old","blameless reviews"),first:wAt(sc,"now","the first hours"),over:wAt(sc,"now","overnight"),what:wAt(sc,"choose","Choose what it watches"),lin:wAt(sc,"choose","keep the lineage"),
    who:wAt(sc,"choose","decide who reviews"),wheel:wAt(sc,"wheel","reinvent the wheel"),w:["investigate","adapt","implement","iterate"].map(s=>wAt(sc,"iterate",s)),docs:wAt(sc,"iterate","the official docs")}));
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"night",keys:[[0,960,520,1.0]],push:0.02,draw:(x,tt)=>{
      // what site reliability engineers have done for years
      const o1=1-ag_in(tt,c.now-0.4,0.4);md_label(x,960,330,"Site reliability engineering · for years",{align:"center",a:ag_in(tt,P.sre,0.5)*o1});
      [["Alerts","warn",P.al],["People on call","person",P.oncall],["Blameless reviews","doc",P.blame]].forEach(([s,ic,t0],i)=>md_textCard(x,190+i*520,390,500,{title:s},{icon:ic,edge:[214,224,240],k:pw_k(tt,t0),a:ag_in(tt,t0,0.35)*o1}));
      // what's new: the first hours of the work, overnight, from the failure to the person at 08:30
      const o2=ag_in(tt,c.now,0.4)*(1-ag_in(tt,c.choose-0.4,0.4));if(o2>0)withA(x,o2,()=>{const y=430,x0=300,x1=1620;md_lane(x,[[x0,y],[x1,y]],MD.flow,0.8,{u:clamp((tt-P.first)/2,0,1)});
        md_tag(x,x0,y-70,"22:03",{icon:"clock",col:MD.fail,align:"center"});md_tag(x,x1,y-70,"08:30",{icon:"person",col:MD.wait,align:"center"});
        ["Detected","Root cause","Impact","Proposed fix"].forEach((s,i)=>{const xx=lerp(x0+220,x1-220,i/3),a=ag_in(tt,P.first+0.4+i*0.35,0.3);glow(x,xx,y,30,MD.flow,0.8*a);
          withA(x,a,()=>{x.fillStyle=rgba(MD.flow,1);x.beginPath();x.arc(xx,y,10,0,TAU);x.fill();md_T(x,s,xx,y+64,{w:700,size:30,align:"center"});});});
        md_T(x,"overnight",960,y+170,{w:700,size:32,align:"center",col:MD.soft,a:ag_in(tt,P.over,0.4)});});
      // what to choose, keep and decide
      const o3=ag_in(tt,c.choose,0.4)*(1-ag_in(tt,c.wheel-0.4,0.4));if(o3>0)withA(x,o3,()=>{md_card(x,460,220,1000,400,{r:22});
        [["Choose what it watches","eye",MD.flow,P.what],["Keep the lineage and the owners it reads","table",MD.flow,P.lin],["Decide who reviews and who approves","person",MD.wait,P.who]].forEach(([s,ic,col,t0],i)=>{
          const a=ag_in(tt,t0,0.4);md_icon(x,ic,530,310+i*110,44,col,{a});md_T(x,s,580,322+i*110,{w:700,size:32,a});});});
      // there are already standards: don't reinvent the wheel; investigate, adapt, implement, iterate, from the official docs
      const o4=ag_in(tt,c.wheel,0.4)*(1-ag_in(tt,c.breath,0.6));if(o4>0)withA(x,o4,()=>{md_mark(x,960,300,70,(tt-c.wheel)/1.8,1);
        md_T(x,"Don't reinvent the wheel",960,470,{w:800,size:44,align:"center",a:ag_in(tt,P.wheel,0.4)});
        const ws=["investigate","adapt","implement","iterate"],wd=ws.map(s=>md_tw(x,s,{w:700,size:36})+60),gap=40,tot=wd.reduce((a,b)=>a+b,0)+gap*3;let xx=960-tot/2;
        ws.forEach((s,i)=>{const a=ag_in(tt,P.w[i],0.3);if(a>0)md_tag(x,xx,580,s,{col:MD.flow,size:36,a});xx+=wd[i]+gap;});
        md_tag(x,960,700,"Official docs on this film's page",{icon:"doc",col:[214,224,240],align:"center",a:ag_in(tt,P.docs,0.4)});});}}
  ],0.6);
  md_end(ctx,S,t,c.breath,"A platform that watches itself","The platform proposes; a person approves.","Film 2 of 2","Data as software");});

ag_cutInto(["watch","close"]);
