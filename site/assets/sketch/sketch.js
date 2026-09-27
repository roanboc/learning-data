/* Learning Data: A Sharper Sketch.
   The three-step path (Watch, Sharpen it, Make the call), six training labs and twelve evaluation scenarios.
   It draws with the film's own components (assets/film3/film.js) and keeps progress in this browser only, under "ld3:".
   "ld3:" is a historical prefix; never rename it, or visitors lose their progress. */
(()=>{"use strict";
const get=(k,d)=>{try{const v=localStorage.getItem("ld3:"+k);return v==null?d:JSON.parse(v);}catch(e){return d;}};
const set=(k,v)=>{try{localStorage.setItem("ld3:"+k,JSON.stringify(v));}catch(e){}};
const $=(s,r)=>(r||document).querySelector(s);
function h(tag,attrs,...kids){const e=document.createElement(tag);for(const k in attrs||{}){const v=attrs[k];if(v==null||v===false)continue;if(k.startsWith("on"))e.addEventListener(k.slice(2),v);else if(k==="html")e.innerHTML=v;else if(k==="style"&&typeof v==="object")Object.assign(e.style,v);else e.setAttribute(k,v===true?"":v);}
  kids.flat().forEach(c=>{if(c!=null&&c!==false)e.append(c.nodeType?c:document.createTextNode(c));});return e;}
const fill=(s,o)=>String(s).replace(/\{(\w+)\}/g,(m,k)=>o[k]!=null?o[k]:m);
// rounded up: rounding down lands on the last frame of the chapter before
const chapterStart=id=>{try{const s=SCENES.find(x=>x.id===id);return s?Math.ceil(s.start):0;}catch(e){return 0;}};
const watchLink=(id,pre)=>(pre||"../")+"#t="+chapterStart(id);

/* ---------- a canvas that draws with the film's components, at any width ---------- */
function stage(w,hgt,draw,label){const cv=h("canvas",{role:"img","aria-label":label||""});let last=null;
  function paint(){const d=Math.min(window.devicePixelRatio||1,2),cw=Math.max(300,Math.round((cv.clientWidth||w)*d));if(cv.width!==cw){cv.width=cw;cv.height=Math.round(cw*hgt/w);}
    const ctx=cv.getContext("2d"),k=cv.width/w;ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,cv.width,cv.height);ctx.setTransform(k,0,0,k,0,0);draw(ctx);}
  cv.style.aspectRatio=w+"/"+hgt;const ro="ResizeObserver" in window?new ResizeObserver(()=>paint()):null;if(ro)ro.observe(cv);
  return{el:cv,paint};}
const ready=()=>window.FILM&&FILM.ready?FILM.ready:Promise.resolve();

/* ---------- the path: progress from this browser only ---------- */
const NLAB=6,NQ=12;
function paintPath(){const p=$(".path[data-text]");if(!p)return;const T=JSON.parse(p.dataset.text),li=p.querySelectorAll("li"),seen=get("visited",[]).length,ans=get("quiz",{}),n=Object.keys(ans).length,ok=Object.values(ans).filter(a=>a&&a.ok).length,w=get("watched",false);
  const put=(i,done,txt)=>{if(!li[i])return;li[i].classList.toggle("done",!!done);if(txt)li[i].querySelector("span:last-child").textContent=txt;};
  put(0,w,w?T.watched:null);put(1,seen>=NLAB,seen?fill(T.labs,{n:seen}):null);put(2,n>=NQ,n?fill(T.quiz,{n,ok}):null);}
paintPath();window.addEventListener("storage",paintPath);window.addEventListener("pageshow",paintPath);
if(document.getElementById("film")&&typeof TL!=="undefined"){const iv=setInterval(()=>{if(get("watched",false)){clearInterval(iv);return;}if(FILM.time&&FILM.time()>TL.total*0.85){set("watched",true);paintPath();clearInterval(iv);}},3000);
  if(/^#t=/.test(location.hash)){const w=document.getElementById("watch");if(w)window.addEventListener("load",()=>w.scrollIntoView());}}

/* ---------- shared drawing helpers ---------- */
const EN=(x,y,name,o)=>Object.assign({x,y,name},o||{});
function grid(ctx,w,hh){ctx.strokeStyle="rgba(120,160,230,0.05)";ctx.lineWidth=1;for(let x=0;x<=w;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,hh);ctx.stroke();}for(let y=0;y<=hh;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}}

/* ===================================================================== */
/* LABS: training, one mechanism each                                     */
/* ===================================================================== */
// sample data: DS101, Semester 1. Eight students; two attend two tutorials; two are in double degrees; statuses change over time.
const STUD=[
 {id:"S-1041",name:"Ana",tut:["Tue 9 am"],course:["Data Science"],hist:[["enrolled","2026-02-20"]]},
 {id:"S-1042",name:"Ben",tut:["Tue 9 am","Thu 2 pm"],course:["Data Science"],hist:[["enrolled","2026-02-21"]]},
 {id:"S-1043",name:"Chloe",tut:["Thu 2 pm"],course:["Data Science","Business"],hist:[["enrolled","2026-02-22"]]},
 {id:"S-1044",name:"Dev",tut:["Tue 9 am"],course:["Data Science"],hist:[["waitlisted","2026-03-03"],["enrolled","2026-03-10"],["withdrew","2026-04-14"]]},
 {id:"S-1045",name:"Eli",tut:["Thu 2 pm"],course:["Business"],hist:[["enrolled","2026-02-25"],["withdrew","2026-03-20"]]},
 {id:"S-1046",name:"Fatima",tut:["Tue 9 am","Thu 2 pm"],course:["Data Science","Business"],hist:[["enrolled","2026-02-26"]]},
 {id:"S-1047",name:"Gus",tut:["Thu 2 pm"],course:["Data Science"],hist:[["waitlisted","2026-03-25"],["enrolled","2026-04-08"]]},
 {id:"S-1048",name:"Hana",tut:["Tue 9 am"],course:["Data Science"],hist:[["enrolled","2026-02-27"]]}];
const CENSUS="2026-03-31",TODAY="2026-04-26";
const statusOn=(s,d)=>{let st=null;s.hist.forEach(([k,dt])=>{if(dt<=d)st=k;});return st;};

const LABS=[
{id:"grain",name:"Split the box",c:"#78c8ff",chapter:"cls",
  idea:"Say exactly what one row stands for. That's the grain.",
  points:["<b>Unit</b>: the subject itself, Data Science 101.","<b>Unit offering</b>: that unit in one teaching period, at one campus. Students enrol here.","<b>Class</b>: a timetabled activity, like the Tuesday 9 am tutorial.","Counting at the wrong grain double-counts: one student in two tutorials is two class places, but one enrolment."],
  real:"Most reporting standards, TCSI included, count unit enrolments, not timetable places. Class allocation lives in the timetabling system and is joined in only when a question is about rooms or tutorials.",
  build:buildGrain},
{id:"where",name:"Where does it live?",c:"#ffd6a0",chapter:"census",
  idea:"Put each detail on the thing it truly describes.",
  points:["If a detail changes from one semester to the next, it belongs on the <b>offering</b>, not the unit.","If it changes from one tutorial to the next, it belongs on the <b>class</b>.","The census date is set per unit of study in each teaching period: it lives on the offering."],
  real:"TCSI records the unit of study census date (element E489) with each unit enrolment, and uses it to tell one enrolment from another.",
  build:buildWhere},
{id:"courses",name:"One student, two courses",c:"#5aaaff",chapter:"courses",
  idea:"When two things connect many to many, the link often deserves its own box.",
  points:["A student can hold several <b>course admissions</b>: a double degree, a transfer, a second course.","Each unit enrolment counts towards one course admission.","Join through the admission, and each student is counted once per unit."],
  real:"In TCSI, a course admission is one student, in one course, from one commencement date, and every unit enrolment links to one.",
  build:buildCourses},
{id:"time",name:"Enrolled when?",c:"#ffb040",chapter:"time",
  idea:"Keep each change with its date, and a count becomes a snapshot of one day.",
  points:["The current status answers \"enrolled now?\"; only the <b>history</b> answers \"enrolled on census date?\".","Waitlisted, enrolled and withdrawn are changes over time, each with a date.","Say which day a count is for, every time."],
  real:"TCSI reports the current status of each unit enrolment, amended when a student withdraws. Keeping the history is an extension the university adds.",
  build:buildTime},
{id:"choose",name:"Choose a reference model",c:"#ffd6a0",chapter:"two",
  idea:"There is often more than one reference model. Which one you pick, and why, matters.",
  points:["First ask how this kind of business generally works.","Then compare candidates on <b>purpose</b>, <b>region</b>, <b>scope</b> and <b>access</b>.","Write down why you chose it: the next person will ask."],
  real:"Higher education alone has several: sector-owned standards such as MortarCAPS (MCDS), which many universities actually use; government reporting collections such as TCSI in Australia and HESA Data Futures in the UK; and the Common Education Data Standards (CEDS) in the US. The film checks against TCSI because it is public; it is one of the choices.",
  build:buildChoose},
{id:"fit",name:"Fit check",c:"#5aaaff",chapter:"fit",
  idea:"Check the reference, adopt what fits the business, extend what doesn't, and record every difference.",
  points:["<b>Adopt</b> where the reference describes your business: use its ideas and its words.","<b>Extend</b> where your business needs more, in the same style.","<b>Record</b> each extension and why, in a fit register."],
  real:"A reference model is a starting point, not a cage. Adopting it blindly is as risky as ignoring it.",
  build:buildFit}];

function labBox(L,title,hint){const box=h("div",{class:"lab",style:"--c:"+L.c},h("div",{class:"lab-head"},h("h4",null,h("small",null,"Lab"),title)),hint?h("p",{class:"lab-hint"},hint):null);return box;}
function seg(opts,cur,on){const s=h("div",{class:"seg",role:"group"});opts.forEach(([k,t])=>s.append(h("button",{type:"button","aria-pressed":String(k===cur),onclick:()=>{s.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.k===k)));on(k);},"data-k":k},t)));return s;}

/* Lab 1: count at the grain you choose */
function buildGrain(L){let g="class";const box=labBox(L,"Split the box","Count DS101 in Semester 1 at each grain, and see which number means \"students enrolled\".");
  const st=stage(1200,360,ctx=>{grid(ctx,1200,360);const hi=k=>k===(g==="class"?"Class":g==="offering"?"Offering":"Unit")?1:0;
    const E={Unit:EN(190,130,"Unit",{sub:"Data Science 101",hi:hi("Unit"),s:1.3}),Offering:EN(600,130,"Unit offering",{sub:"Semester 1 · city campus",hi:hi("Offering"),s:1.3}),Class:EN(1010,130,"Class",{sub:"Tue 9 am · Thu 2 pm",hi:hi("Class"),s:1.3})};
    diagram(ctx,E,[["Offering","Unit","*","1",{s:1.3}],["Offering","Class","1","*",{s:1.3}]]);
    const n=g==="class"?STUD.reduce((a,s)=>a+s.tut.length,0):g==="offering"?STUD.length:1,x=g==="class"?1000:g==="offering"?600:200;
    T(ctx,String(n),x,290,{w:800,size:64,align:"center",color:rgba(g==="offering"?GOOD:g==="class"?BAD:SK,1)});
    T(ctx,g==="class"?"tutorial places":g==="offering"?"students enrolled":"unit",x,334,{w:600,size:18,align:"center",color:rgba(SOFT,1)});},"The unit, the unit offering and the class, with the count at the chosen grain.");
  const say=h("p",{class:"lab-say",role:"status"});const rows=h("tbody");
  function upd(){st.paint();const r=g==="class"?STUD.flatMap(s=>s.tut.map(t=>[s.id,s.name,t])):g==="offering"?STUD.map(s=>[s.id,s.name,"DS101 · Semester 1"]):[["DS101","Data Science 101","one row"]];
    rows.replaceChildren(...r.map(c=>h("tr",null,...c.map(v=>h("td",null,v)))));
    say.innerHTML=g==="class"?'<span class="no">10 rows, but only 8 students.</span> Ben and Fatima each sit in two tutorials. One row here is one place in a tutorial.':g==="offering"?'<span class="ok">8 rows, 8 students.</span> One row is one student in one unit offering: the grain that answers "how many enrolled?".':'<span class="warn">One row for the whole subject.</span> The unit knows what Data Science 101 is, not who takes it this semester.';}
  box.append(st.el,h("div",{class:"lab-controls"},h("span",{class:"lbl"},"Count one row per"),seg([["unit","Unit"],["offering","Unit offering"],["class","Class place"]],g,k=>{g=k;upd();})),
    h("div",{class:"utab-wrap"},h("table",{class:"utab"},h("thead",null,h("tr",null,h("th",null,"key"),h("th",null,"name"),h("th",null,"row stands for"))),rows)),say);
  ready().then(upd);return box;}

/* Lab 2: put each detail on the box it describes */
function buildWhere(L){const A=[["Unit name: Data Science 101","Unit"],["Credit points: 6","Unit"],["Census date: 31 Mar","Offering"],["Teaching period: Semester 1","Offering"],["Campus and mode: city, on site","Offering"],["Room and time: B204, Tue 9 am","Class"],["Tutor: Dr Lee","Class"]];
  const pick={};const box=labBox(L,"Where does it live?","Choose the box each detail belongs to, then check.");
  const st=stage(1200,380,ctx=>{grid(ctx,1200,380);const at=k=>A.filter(a=>pick[a[0]]===k).map(a=>[a[0].split(":")[0],""]);
    const E={Unit:EN(210,190,"Unit",{attrs:at("Unit"),s:1.15}),Offering:EN(600,190,"Unit offering",{attrs:at("Offering"),s:1.15}),Class:EN(990,190,"Class",{attrs:at("Class"),s:1.15})};
    diagram(ctx,E,[["Offering","Unit","*","1",{s:1.15}],["Offering","Class","1","*",{s:1.15}]]);},"Three boxes, each listing the details placed on it.");
  const list=h("div",{class:"qsort"}),say=h("p",{class:"lab-say",role:"status"},"Place all seven details, then check.");
  A.forEach(([t])=>{list.append(h("div",{class:"row"},h("span",{class:"t"},t),seg([["Unit","Unit"],["Offering","Offering"],["Class","Class"]],null,k=>{pick[t]=k;st.paint();list.querySelectorAll(".row").forEach(r=>r.classList.remove("ok","no"));})));});
  const check=h("button",{type:"button",class:"chip-btn go",onclick:()=>{let ok=0;[...list.children].forEach((r,i)=>{const good=pick[A[i][0]]===A[i][1];r.classList.toggle("ok",good);r.classList.toggle("no",!good);if(good)ok++;});
    say.innerHTML=ok===A.length?'<span class="ok">All seven in place.</span> Details that change each semester live on the offering; details that change each tutorial live on the class.':'<span class="warn">'+ok+' of 7 in place.</span> Ask: does this change from one semester to the next (offering), or from one tutorial to the next (class)?';}},"Check");
  box.append(st.el,h("div",{style:"padding:4px 16px 0"},list),h("div",{class:"lab-controls"},check),say);ready().then(()=>st.paint());return box;}

/* Lab 3: join through the course admission */
function buildCourses(L){let m="v1";const box=labBox(L,"One student, two courses","Count DS101 enrolments by course, first with the old sketch, then with a course admission.");
  const st=stage(1200,300,ctx=>{grid(ctx,1200,300);if(m==="v1"){const E={Student:EN(260,80,"Student",{s:1.25}),Course:EN(260,225,"Course",{s:1.25}),Enrol:EN(760,80,"Unit enrolment",{s:1.25})};diagram(ctx,E,[["Student","Enrol","1","*",{s:1.25}],["Student","Course","*","1",{bad:1,s:1.25}]]);tag(ctx,760,225,"joins through the student",BAD,{align:"center",size:22});}
    else{const E={Student:EN(170,80,"Student",{s:1.2}),Adm:EN(590,80,"Course admission",{pin:"adopt",s:1.2}),Course:EN(1020,80,"Course",{s:1.2}),Enrol:EN(590,225,"Unit enrolment",{s:1.2})};diagram(ctx,E,[["Student","Adm","1","*",{s:1.2}],["Adm","Course","*","1",{s:1.2}],["Adm","Enrol","1","*",{s:1.2}]]);}},"The model being used to join enrolments to courses.");
  const rows=h("tbody"),say=h("p",{class:"lab-say",role:"status"}),cards=h("div",{class:"lab-cards"});
  function upd(){st.paint();const act=STUD.filter(s=>statusOn(s,CENSUS)==="enrolled");
    // the old sketch joins each enrolment to every course the student is in; the admission links each enrolment to the one course it counts towards
    const r=m==="v1"?act.flatMap(s=>s.course.map(c=>[s.id,s.name,c])):act.map(s=>[s.id,s.name,s.course[0]]);
    rows.replaceChildren(...r.map(c=>h("tr",null,...c.map(v=>h("td",null,v)))));const ids=new Set(r.map(x=>x[0]));
    cards.replaceChildren(h("div",{class:"mcard"},h("h5",null,"Rows"),h("div",{class:"num"},String(r.length)),h("p",null,"enrolments by course")),h("div",{class:"mcard"},h("h5",null,"Students"),h("div",{class:"num"},String(ids.size)),h("p",null,"enrolled on census date")));
    say.innerHTML=m==="v1"?'<span class="no">'+r.length+' rows for '+ids.size+' students.</span> Chloe and Fatima are in double degrees, so the join through the student repeats them once per course.':'<span class="ok">'+r.length+' rows, '+ids.size+' students.</span> Each unit enrolment counts towards one course admission, so each student is counted once.';}
  box.append(st.el,h("div",{class:"lab-controls"},h("span",{class:"lbl"},"Model"),seg([["v1","Sketch v1: student → course"],["v2","Sketch v2: course admission"]],m,k=>{m=k;upd();})),cards,h("div",{class:"utab-wrap"},h("table",{class:"utab"},h("thead",null,h("tr",null,h("th",null,"student"),h("th",null,"name"),h("th",null,"course"))),rows)),say);
  ready().then(upd);return box;}

/* Lab 4: a count is a snapshot of one day */
function buildTime(L){const D0=new Date("2026-02-15"),DAYS=80;let day=Math.round((new Date(CENSUS)-D0)/864e5);const iso=d=>new Date(D0.getTime()+d*864e5).toISOString().slice(0,10);
  const box=labBox(L,"Enrolled when?","Slide through the semester. The count changes; the census date doesn't.");
  const COL={waitlisted:EXT,enrolled:GOOD,withdrew:BAD};
  const st=stage(1200,420,ctx=>{grid(ctx,1200,420);const x0=190,x1=1160,X=d=>x0+(x1-x0)*d/DAYS,dCen=(new Date(CENSUS)-D0)/864e5,dTod=(new Date(TODAY)-D0)/864e5;
    STUD.forEach((s,i)=>{const y=40+i*40;T(ctx,s.name,x0-16,y+7,{w:700,size:20,align:"right",color:rgba(SOFT,1)});
      s.hist.forEach(([k,dt],j)=>{const a=(new Date(dt)-D0)/864e5,b=j<s.hist.length-1?(new Date(s.hist[j+1][1])-D0)/864e5:DAYS;ctx.fillStyle=rgba(COL[k],k==="withdrew"?0.35:0.7);rr(ctx,X(a),y-10,Math.max(4,X(b)-X(a)),20,6);ctx.fill();});});
    [[dCen,"census 31 Mar",REF],[dTod,"today 26 Apr",CYAN]].forEach(([d,l,c])=>{ctx.strokeStyle=rgba(c,0.9);ctx.setLineDash([6,6]);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(X(d),24);ctx.lineTo(X(d),360);ctx.stroke();ctx.setLineDash([]);T(ctx,l,X(d),384,{w:700,size:15,align:"center",color:rgba(c,1)});});
    ctx.strokeStyle="rgba(255,255,255,0.9)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(X(day),20);ctx.lineTo(X(day),364);ctx.stroke();glow(ctx,X(day),20,30,C.white,0.8);
    const n=STUD.filter(s=>statusOn(s,iso(day))==="enrolled").length;tag(ctx,Math.min(1060,Math.max(260,X(day))),410,iso(day)+" · "+n+" enrolled",C.white,{align:"center",size:16});},"Each student's status over time, with the census date, today and the chosen day marked.");
  const rng=h("input",{type:"range",min:0,max:DAYS,value:day,"aria-label":"Day in the semester",style:"flex:1;min-width:160px;accent-color:#ffd6a0"}),say=h("p",{class:"lab-say",role:"status"});
  function upd(){st.paint();const d=iso(day),n=STUD.filter(s=>statusOn(s,d)==="enrolled").length;
    say.innerHTML=d===CENSUS?'<span class="ok">'+n+' enrolled on census date.</span> This is the number the census report counts, and it stays the same whenever you ask.':d===TODAY?'<span class="warn">'+n+' enrolled today.</span> Dev withdrew after census and Gus enrolled late: a count of "now" is not the census count.':n+' enrolled on '+d+'. Only the history, with a date on each change, can answer this for any day.';}
  rng.addEventListener("input",()=>{day=+rng.value;upd();});
  const jump=(d,l)=>h("button",{type:"button",class:"chip-btn sm",onclick:()=>{day=Math.round((new Date(d)-D0)/864e5);rng.value=day;upd();}},l);
  box.append(st.el,h("div",{class:"lab-controls"},rng,jump(CENSUS,"Census date"),jump(TODAY,"Today")),say);ready().then(upd);return box;}

/* Lab 5: pick a reference model for the situation, and say why */
const REFM=[
 {k:"tcsi",n:"TCSI",r:"Australia",p:"Government reporting of student data",s:"Students, course admissions, unit enrolments, census dates",a:"Public specifications"},
 {k:"hesa",n:"HESA Data Futures",r:"United Kingdom",p:"Reporting student data to regulators",s:"Students, engagements, courses, modules",a:"Public specifications"},
 {k:"ceds",n:"CEDS",r:"United States",p:"Common vocabulary to share education data",s:"Early learning to workforce, including postsecondary",a:"Public domain"},
 {k:"mcds",n:"MCDS (MortarCAPS)",r:"Sector standard: Australia, New Zealand, Canada, UK",p:"The sector's own data standard, widely used by universities",s:"Many domains: students, curriculum, credentials, finance, people, research",a:"Check access and licence"}];
const SITS=[
 {t:"An Australian university wants a reference model for its student data that other universities also use.",best:"mcds",why:{tcsi:"One of the choices: public and precise, but built for government reporting, and narrower than a model for the whole university.",hesa:"UK regulatory reporting: the wrong region, and built for reporting.",ceds:"A US vocabulary: the wrong region.",mcds:"Right region and purpose: the sector's own data standard, which many universities actually use. Check access and licence, and record why."}},
 {t:"A UK university is redesigning its student records to report to its regulator.",best:"hesa",why:{tcsi:"Australian: its elements and census rules don't apply in the UK.",hesa:"Right purpose and region: the UK's student data collection defines what must be reported.",ceds:"US-based: useful ideas, but not what the UK regulator expects.",mcds:"A sector model that includes the UK, and worth checking for wider design; for regulatory reporting, the collection itself comes first."}},
 {t:"A US community college wants a common vocabulary to share data with its state.",best:"ceds",why:{tcsi:"Australian government reporting: the wrong region and purpose.",hesa:"UK regulatory reporting: the wrong region and purpose.",ceds:"Right purpose and region: a public-domain vocabulary designed for sharing education data in the US.",mcds:"A higher education sector model, but not the shared vocabulary US states use."}},
 {t:"A small team needs a public reference for exactly the student data an Australian university sends to government.",best:"tcsi",why:{tcsi:"Right purpose: public, and it describes exactly the data reported to government.",hesa:"UK reporting: its elements and rules don't apply in Australia.",ceds:"US-based and broader: not what Australian reporting checks against.",mcds:"The sector standard many universities use, and a strong choice for the wider model. For the exact reporting rules, the reporting collection itself is the closest, public source."}}];
function buildChoose(L){let si=0,pick=null;const box=labBox(L,"Choose a reference model","Read the situation, compare the candidates, and pick the best starting template.");
  const sit=h("p",{class:"lab-info"}),opts=h("div",{class:"qlist"}),say=h("p",{class:"lab-say",role:"status"});
  function upd(){const S=SITS[si];sit.innerHTML="<b>Situation "+(si+1)+" of "+SITS.length+".</b> "+S.t;
    opts.replaceChildren(...REFM.map(m=>{const b=h("button",{type:"button","aria-pressed":String(pick===m.k),onclick:()=>{pick=m.k;upd();}},h("span",null,h("b",null,m.n)," · ",m.r,h("br"),h("small",{style:"color:var(--smuted);font-weight:500"},m.p+". Scope: "+m.s+". Access: "+m.a+".")),pick===m.k?h("span",{class:"badge "+(m.k===S.best?"good":"warn")},m.k===S.best?"best fit":"weaker fit"):null);return b;}));
    say.innerHTML=pick?(pick===S.best?'<span class="ok">Good choice.</span> ':'<span class="warn">Not the best fit.</span> ')+S.why[pick]+(pick===S.best?' Now record why you chose it.':''):"Pick one. There is no universal answer: the situation decides.";}
  const nav=h("div",{class:"lab-controls"},h("span",{class:"lbl"},"Situation"),seg(SITS.map((s,i)=>[String(i),String(i+1)]),"0",k=>{si=+k;pick=null;upd();}));
  box.append(sit,opts,nav,say);upd();return box;}

/* Lab 6: adopt or extend, and the fit register writes itself */
const FITS=[["Student","adopt","TCSI has students."],["Course admission","adopt","TCSI's course admission is one student, one course, one start date."],["Unit enrolment","adopt","TCSI reports each unit enrolment."],["Census date on each unit enrolment","adopt","TCSI element E489."],["Class (timetabled tutorial)","extend","Not in TCSI: timetabling is ours."],["Unit offering, as its own box","extend","TCSI identifies it by unit code and census date, without naming it."],["Status history, with dates","extend","TCSI reports the current status only."],["Waitlisted, as a status","extend","The university's own status, not a TCSI code."]];
function buildFit(L){const pick={};const box=labBox(L,"Fit check","For each part of sketch v2, decide: adopted from TCSI, or extended by us? Then read the fit register.");
  const st=stage(1200,440,ctx=>{grid(ctx,1200,440);const pos=lay(L3,0.74,600,215),E=E3(Object.keys(L3),pos,SUB2,0.74);Object.keys(E).forEach(k=>{const nm=NAME[k],f=FITS.find(x=>x[0].startsWith(nm));const p=f?pick[f[0]]:null;if(p){E[k].pin=p;}});
    diagram(ctx,E,L3R.map(r=>r.concat([{s:0.74}])));},"Sketch v2, with a pin on each box you have decided: blue for adopted, amber for extended.");
  const list=h("div",{class:"qsort"}),reg=h("div",{class:"lab-info"}),say=h("p",{class:"lab-say",role:"status"},"Decide all eight, then check.");
  FITS.forEach(([t])=>list.append(h("div",{class:"row"},h("span",{class:"t"},t),seg([["adopt","Adopt"],["extend","Extend"]],null,k=>{pick[t]=k;st.paint();list.querySelectorAll(".row").forEach(r=>r.classList.remove("ok","no"));}))));
  const check=h("button",{type:"button",class:"chip-btn go",onclick:()=>{let ok=0;[...list.children].forEach((r,i)=>{const g=pick[FITS[i][0]]===FITS[i][1];r.classList.toggle("ok",g);r.classList.toggle("no",!g);if(g)ok++;});
    const ext=FITS.filter(f=>f[1]==="extend");reg.innerHTML="<b>Fit register · sketch v2, checked against TCSI.</b><br>"+ext.map(f=>"• "+f[0]+": extended. "+f[2]).join("<br>");
    say.innerHTML=ok===FITS.length?'<span class="ok">All eight right.</span> Four adopted, four extended, and each extension recorded with its reason: the next person can see what is standard and what is ours.':'<span class="warn">'+ok+' of 8 right.</span> Ask: does TCSI already describe this? If yes, adopt it. If the business needs more, extend it.';}},"Check and write the register");
  box.append(st.el,h("div",{style:"padding:4px 16px 0"},list),h("div",{class:"lab-controls"},check),reg,say);ready().then(()=>st.paint());return box;}

/* the labs page: a rail of stops, one stop at a time, each with its idea and its lab */
const labsApp=document.getElementById("labs3-app");
if(labsApp){labsApp.textContent="";const rail=h("div",{class:"stops",role:"tablist","aria-label":"Labs"}),holder=h("div");
  const visited=new Set(get("visited",[]));
  function show(id,focus){const L=LABS.find(x=>x.id===id)||LABS[0];visited.add(L.id);set("visited",[...visited]);paintPath();
    [...rail.children].forEach(b=>{const on=b.dataset.id===L.id;b.setAttribute("aria-selected",String(on));b.classList.toggle("done",visited.has(b.dataset.id));});
    const i=LABS.indexOf(L),nxt=LABS[i+1];
    holder.replaceChildren(h("div",{class:"stop",style:"--c:"+L.c},
      h("div",{class:"stop-text"},h("p",{class:"kicker"},h("b",null,"Lab "+(i+1))," of "+LABS.length),h("h3",null,L.name),h("p",{class:"idea"},L.idea),h("ul",null,...L.points.map(p=>h("li",{html:p}))),
        h("details",{class:"real"},h("summary",null,"In practice"),h("p",null,L.real)),
        h("div",{class:"stop-nav"},h("a",{class:"btn",href:watchLink(L.chapter)},"Watch this part"),nxt?h("button",{type:"button",class:"btn primary",onclick:()=>{show(nxt.id,true);}},"Next: "+nxt.name+" →"):h("a",{class:"btn primary",href:"../scenarios/"},"Make the call →"))),
      L.build(L)));
    if(history.replaceState)history.replaceState(null,"","#"+L.id);if(focus)holder.scrollIntoView({block:"start"});}
  LABS.forEach((L,i)=>rail.append(h("button",{type:"button",role:"tab","data-id":L.id,style:"--c:"+L.c,onclick:()=>show(L.id)},h("i",null,String(i+1)),L.name)));
  labsApp.append(rail,holder);show((location.hash||"").slice(1));}

/* ===================================================================== */
/* SCENARIOS: evaluation                                                  */
/* ===================================================================== */
const QS=[
 {lab:"grain",type:"choice",title:"Two numbers, every test green",sit:"Genie says 131 students are enrolled in DS101. The certified census report says 118. Every data test passed. What do you check first?",
  opts:[{t:"Re-run the pipeline: the data must be stale.",why:"Nothing suggests stale data, and both numbers come from tested, fresh data."},{t:"What each number counts: its grain, its date and its definition.",ok:true},{t:"Trust the bigger number: it has more rows.",why:"More rows can mean double counting, which is exactly the risk here."}],
  why:"When clean data disagrees, the difference is usually meaning: what one row stands for, which day, and which definition.",vis:"two"},
 {lab:"where",type:"sort",title:"Where does it live?",sit:"Place each new detail on the box it describes.",buckets:[["Unit","Unit"],["Offering","Unit offering"],["Class","Class"]],
  items:[{t:"Learning outcomes of Data Science 101",b:"Unit",why:"they describe the subject, whenever it runs"},{t:"Enrolment cap for Semester 1",b:"Offering",why:"it can change each semester"},{t:"Video link for the Thursday tutorial",b:"Class",why:"it belongs to one timetabled activity"},{t:"The unit coordinator this semester",b:"Offering",why:"coordinators change between offerings"},{t:"Census date",b:"Offering",why:"each offering has its own"}],
  why:"If it changes each semester, it's the offering. If it changes each tutorial, it's the class. If it never changes, it's the unit.",vis:"split"},
 {lab:"courses",type:"choice",title:"Counted twice",sit:"A student in a double degree appears twice in the DS101 census count. What's the best fix to the model?",
  opts:[{t:"Remove duplicates in the dashboard.",why:"It hides the symptom in one place; every other report still double-counts."},{t:"Add a course admission between student and course, and link each unit enrolment to one admission.",ok:true},{t:"Only let students enrol in one course.",why:"The model must describe the business, not change it."}],
  why:"A many-to-many relationship needs its own box. Each unit enrolment counts towards one course admission, so each student is counted once.",vis:"adm"},
 {lab:"time",type:"choice",title:"Asked in April",sit:"On 26 April, the Head of School asks how many students were enrolled on census date, 31 March. Genie answers with today's count. What does the model need?",
  opts:[{t:"A faster refresh, so the count is more current.",why:"The problem isn't freshness: the question is about a past day."},{t:"The history of each enrolment's status, with a date on each change.",ok:true},{t:"A separate table copied on census date, and nothing else.",why:"A copy helps for one day, but only a history with dates answers for any day, and explains the change."}],
  why:"The current status answers \"now\". A history of changes, each with its date, answers \"on census date\", or any other day.",vis:"strip"},
 {lab:"choose",type:"choice",title:"Which reference?",sit:"A UK university is redesigning its student records and must report to its regulator. Which reference model is the best first template?",
  opts:[{t:"TCSI",why:"It's Australian: its elements and census rules don't apply in the UK."},{t:"HESA Data Futures",ok:true},{t:"CEDS",why:"It's a US vocabulary, not what the UK regulator expects."}],
  why:"Choose by purpose, region, scope and access. For UK regulatory reporting, the UK's student data collection is the closest fit.",vis:"refs"},
 {lab:"choose",type:"choice",title:"Why this one?",sit:"Your team picked TCSI as its reference model. Six months later, a new analyst asks why. What should they find?",
  opts:[{t:"Nothing: the choice is obvious.",why:"It isn't obvious to the next person. Several models could have fitted."},{t:"A short note: which candidates were compared, and why TCSI fitted our purpose, region and scope.",ok:true},{t:"The full TCSI specification, copied into the wiki.",why:"That says what TCSI is, not why you chose it."}],
  why:"The choice of reference is a decision like any other: record the candidates and the reasons.",vis:"refs"},
 {lab:"fit",type:"sort",title:"Adopt or extend?",sit:"Your reference is TCSI. Decide for each concept.",buckets:[["adopt","Adopt"],["extend","Extend"]],
  items:[{t:"Course admission",b:"adopt",why:"TCSI defines it"},{t:"Timetabled tutorial (class)",b:"extend",why:"not in TCSI"},{t:"Census date with each unit enrolment",b:"adopt",why:"TCSI element E489"},{t:"Status history with dates",b:"extend",why:"TCSI keeps the current status"},{t:"Unit enrolment",b:"adopt",why:"TCSI reports it"}],
  why:"Adopt what the reference already describes; extend where the business needs more; record every extension.",vis:"pins"},
 {lab:"fit",type:"choice",title:"The reference has no class",sit:"Your reference model has no concept of a timetabled class, but your business needs one for tutorials. What do you do?",
  opts:[{t:"Drop classes: the reference is the standard.",why:"The reference is a starting point, not a cage. The business still runs tutorials."},{t:"Extend the model with a Class, in the reference's style, and record why.",ok:true},{t:"Rename Class to Unit of study so it matches.",why:"That changes the meaning: a class is not a unit of study."}],
  why:"Where the business is truly different, the business wins, and the difference is recorded.",vis:"pins"},
 {lab:"fit",type:"choice",title:"Copy it exactly?",sit:"Someone proposes adopting the reference model exactly: every box, every name, nothing else. Good idea?",
  opts:[{t:"Yes: standards are always right.",why:"A reference describes a common case, and may be built for another purpose, such as reporting."},{t:"Check it first: adopt where it fits the business, extend where it doesn't.",ok:true},{t:"No: build our own from scratch.",why:"That ignores years of shared work, and makes reporting and sharing harder."}],
  why:"Check the reference. Fit it to the business.",vis:"refs"},
 {lab:"choose",type:"order",title:"In what order?",sit:"Put the steps of sharpening a model with a reference in order.",
  items:["Ask how this kind of business generally works","Look for published reference models","Choose one, and record why","Check where it fits our business","Adopt what fits, and extend the rest","Record every difference in a fit register"],
  why:"Question first, then candidates, then a recorded choice, then the fit: adopt, extend, record.",vis:"steps"},
 {lab:"levels",type:"sort",title:"Which level of detail?",sit:"Sort each statement into the level of the model it belongs to.",buckets:[["c","Conceptual"],["l","Logical"],["p","Physical"]],
  items:[{t:"A student can hold many course admissions",b:"c",why:"things and how they connect, for the business"},{t:"A unit offering is identified by its unit code and census date",b:"l",why:"identifiers are logical"},{t:"census_date is a DATE column in unit_offering",b:"p",why:"columns and types are physical"},{t:"A status change has a status and a date",b:"l",why:"attributes of an entity"},{t:"The unit_enrolment table is split by year",b:"p",why:"storage is physical"}],
  why:"Same meaning, three levels of detail: the business owns the conceptual model, engineers own the physical, and all three must agree.",vis:"levels"},
 {lab:"fit",type:"choice",title:"Next year",sit:"Next year the university launches microcredentials: short courses that aren't degrees. The model has no place for them. What's the healthy response?",
  opts:[{t:"Squeeze them into Course and say nothing.",why:"Hidden changes are how two numbers start to disagree again."},{t:"Check the reference for them, extend where needed, and publish sketch v3 with a note of what changed and why.",ok:true},{t:"Freeze the model: changes are risky.",why:"Models evolve: not often, but always. Versioning makes change safe."}],
  why:"Models evolve. Check the reference again, fit it to the business, and version the change with a note.",vis:"stamp"}];

const QV={
 two:c=>{numCard(c,40,50,250,"Genie","131",null,CYAN);numCard(c,310,50,250,"Census report","118",null,LAYER.gold);tag(c,300,300,"every test passed",GOOD,{align:"center",size:16});},
 split:c=>{diagram(c,{U:EN(110,150,"Unit",{s:0.7}),O:EN(300,150,"Unit offering",{s:0.7}),C:EN(490,150,"Class",{s:0.7})},[["O","U","*","1",{s:0.7}],["O","C","1","*",{s:0.7}]]);},
 adm:c=>{diagram(c,{S:EN(110,110,"Student",{s:0.7}),A:EN(300,110,"Course admission",{s:0.7,pin:"adopt"}),K:EN(490,110,"Course",{s:0.7}),E:EN(300,240,"Unit enrolment",{s:0.7})},[["S","A","1","*",{s:0.7}],["A","K","*","1",{s:0.7}],["A","E","1","*",{s:0.7}]]);},
 strip:c=>{filmStrip(c,18,110,[{s:"waitlisted",d:"3 Mar",col:EXT},{s:"enrolled",d:"10 Mar",col:GOOD},{s:"census",d:"31 Mar",col:REF,hi:1}],1,0,0);},
 refs:c=>{[["TCSI","Australia"],["HESA Data Futures","UK"],["CEDS","US"],["MCDS","sector"]].forEach(([n,r],i)=>tag(c,300,70+i*62,n+" · "+r,REF,{align:"center",size:18}));},
 pins:c=>{diagram(c,{E:EN(170,110,"Unit enrolment",{s:0.72,pin:"adopt"}),O:EN(430,110,"Unit offering",{s:0.72,pin:"extend"}),C:EN(430,240,"Class",{s:0.72,pin:"extend"}),S:EN(170,240,"Status change",{s:0.72,pin:"extend"})},[["E","O","*","1",{s:0.72}],["O","C","1","*",{s:0.72}],["E","S","1","*",{s:0.72}]]);},
 steps:c=>{["Check","Adopt","Extend","Record"].forEach((s,i)=>tag(c,300,70+i*62,(i+1)+"  "+s,[REF,ADOPT,EXT,C.white][i],{align:"center",size:20}));},
 levels:c=>{[["Conceptual",SK],["Logical",REF],["Physical",GOOD]].forEach(([n,col],i)=>{glass(c,30+i*190,60,170,200,14,col,{glow:10,ea:0.6,fill:"rgba(7,12,24,0.9)"});T(c,n,115+i*190,100,{w:800,size:18,align:"center",color:rgba(col,1)});});},
 stamp:c=>{stamp(c,300,120,"sketch v2",GOOD,1);stamp(c,300,200,"sketch v3?",EXT,1,0.3);}};

const quizApp=document.getElementById("quiz3-app");
if(quizApp){quizApp.textContent="";const ans=get("quiz",{});let cur=0;
  const bar=h("div",{class:"qbar"}),dots=h("div",{class:"dots",role:"group","aria-label":"Scenarios"}),score=h("p",{class:"score"}),card=h("div");bar.append(dots,score);quizApp.append(h("div",{class:"quiz"},bar,card));
  const labName=id=>(LABS.find(l=>l.id===id)||{name:"Three levels of precision"}).name,labHref=id=>id==="levels"?watchLink("levels"):"../labs/#"+id;
  function paintBar(){dots.replaceChildren(...QS.map((q,i)=>h("button",{type:"button",class:ans[i]?(ans[i].ok?"ok":"no"):"","aria-current":String(i===cur),"aria-label":"Scenario "+(i+1),onclick:()=>{cur=i;render();}},String(i+1))));
    const n=Object.keys(ans).length,ok=Object.values(ans).filter(a=>a.ok).length;score.innerHTML="Score "+ok+" <span>of "+n+" answered · "+(QS.length-n)+" to go</span>";paintPath();}
  function done(ok){ans[cur]={ok};set("quiz",ans);paintBar();}
  function feed(ok,q){return h("div",{class:"qfeed "+(ok?"ok":"no")},h("h4",null,ok?"Good call":"Not quite"),h("p",null,q.why));}
  function foot(q){const last=cur===QS.length-1;return h("div",{class:"qfoot"},h("a",{class:"link",href:labHref(q.lab)},(q.lab==="levels"?"Watch: ":"Explore this in the lab: ")+labName(q.lab)),
    h("button",{type:"button",class:"btn primary",onclick:()=>{if(last)results();else{cur+=1;render();}}},last?"See your results":"Next scenario"));}
  function render(){paintBar();const q=QS[cur],body=h("div",{class:"qbody"}),vis=stage(600,320,c=>{grid(c,600,320);(QV[q.vis]||(()=>{}))(c);},q.title);
    body.append(h("p",{class:"qtag",style:"--c:#78c8ff"},h("i"),"Scenario "+(cur+1)+" of "+QS.length),h("h3",null,q.title),h("p",{class:"qsit"},q.sit));
    const out=h("div");
    if(q.type==="choice"){const box=h("div",{class:"qopts"});q.opts.forEach((o,i)=>box.append(h("button",{type:"button",class:"qopt",onclick:()=>{[...box.children].forEach((b,j)=>{b.disabled=true;if(q.opts[j].ok)b.classList.add("ok");});if(!o.ok){box.children[i].classList.add("no");box.children[i].append(h("small",null,o.why));}done(!!o.ok);out.replaceChildren(feed(!!o.ok,q),foot(q));}},h("span",{class:"k"},"ABC"[i]),h("span",null,o.t))));body.append(box);}
    if(q.type==="sort"){const pick={},box=h("div",{class:"qsort"});q.items.forEach(it=>box.append(h("div",{class:"row"},h("span",{class:"t"},it.t),h("div",{class:"qseg"},...q.buckets.map(([k,t])=>h("button",{type:"button","aria-pressed":"false",onclick:e=>{pick[it.t]=k;[...e.target.parentNode.children].forEach(b=>b.setAttribute("aria-pressed",String(b===e.target)));}},t))))));
      body.append(box,h("button",{type:"button",class:"btn primary",onclick:e=>{let ok=true;[...box.children].forEach((r,i)=>{const it=q.items[i],g=pick[it.t]===it.b;r.classList.add(g?"ok":"no");if(!g){ok=false;r.append(h("p",{class:"fix"},"→ "+q.buckets.find(b=>b[0]===it.b)[1]+": "+it.why));}r.querySelectorAll("button").forEach(b=>b.disabled=true);});e.target.remove();done(ok);out.replaceChildren(feed(ok,q),foot(q));}},"Check"));}
    if(q.type==="order"){let ord=q.items.map((t,i)=>i).sort((a,b)=>((a*7+3)%q.items.length)-((b*7+3)%q.items.length));const box=h("ol",{class:"qorder"});
      const draw=()=>box.replaceChildren(...ord.map((ix,p)=>h("li",null,h("span",{class:"n"},String(p+1)),h("span",null,q.items[ix]),h("span",{class:"mv"},h("button",{type:"button","aria-label":"Move up",onclick:()=>{if(p>0){[ord[p-1],ord[p]]=[ord[p],ord[p-1]];draw();}}},"↑"),h("button",{type:"button","aria-label":"Move down",onclick:()=>{if(p<ord.length-1){[ord[p+1],ord[p]]=[ord[p],ord[p+1]];draw();}}},"↓")))));draw();
      body.append(box,h("button",{type:"button",class:"btn primary",onclick:e=>{const ok=ord.every((ix,p)=>ix===p);[...box.children].forEach((li,p)=>{li.classList.add(ord[p]===p?"ok":"no");li.querySelectorAll("button").forEach(b=>b.disabled=true);});e.target.remove();done(ok);out.replaceChildren(feed(ok,q),foot(q));}},"Check"));}
    body.append(out);card.replaceChildren(h("div",{class:"qcard"},h("div",{class:"qvis"},vis.el),body));ready().then(()=>vis.paint());}
  function results(){paintBar();const ok=Object.values(ans).filter(a=>a.ok).length,n=QS.length,band=ok>=12?["You'd lead this model.","Every call right: you check references, fit them to the business, and record why."]:ok>=9?["Solid calls.","You've got the practice. Review the labs in red to close the gaps."]:ok>=6?["Good start.","The ideas are landing. Replay the labs in red."]:["Worth another look.","Watch the film again, then try the labs. The second time, these calls get easier."];
    const by={};QS.forEach((q,i)=>{const k=q.lab;by[k]=by[k]||{ok:0,n:0};by[k].n++;if(ans[i]&&ans[i].ok)by[k].ok++;});
    card.replaceChildren(h("div",{class:"qdone"},h("div",{class:"ring",style:"--p:"+Math.round(ok/n*100)},h("b",null,ok+"/"+n)),h("div",null,h("h3",null,band[0]),h("p",null,band[1]),
      h("div",{class:"mastery"},...Object.keys(by).map(k=>h("a",{href:labHref(k),class:by[k].ok===by[k].n?"ok":"no",style:"--c:"+((LABS.find(l=>l.id===k)||{c:"#a0b2cd"}).c)},h("i"),labName(k)+" · "+by[k].ok+"/"+by[k].n))),
      h("button",{type:"button",class:"btn",onclick:()=>{for(const k in ans)delete ans[k];set("quiz",ans);cur=0;render();}},"Start again"))));}
  const first=QS.findIndex((q,i)=>!ans[i]);if(first<0)results();else{cur=first;render();}}
})();
