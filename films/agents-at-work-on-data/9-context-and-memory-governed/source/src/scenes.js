/* ===== Context and memory, governed: the scenes =====
   Six chapters, each timed to its narration: wAt(sc, "line", "word") is the moment a word is said. The places are painted once
   (world.js); what moves is drawn live in the shots of ag_shots. Shots that show the same place, people or words come in on a cut
   (cut:true), so nothing shows twice; a dissolve only joins two different places. The title card ends chapter 1, the end card
   chapter 6. */

const cm_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
const CM_KICK=(x,a)=>ag_kicker(x,"2.9","Context and memory, governed",{a});
// the team's memory on Lucía's wall: the four lessons Memory: from one chat to the team shows, as its cards name them, each with who
// approved it, then the campus line. A card's title names its lesson; the lesson itself is in the entry, pulled up
const CM_F={x:1440,y:560};
const CM_MEM=[["Students, not enrolments","Mei Tanaka"],["Read the glossary first","Yusuf Demir"],["Show the count reported","Clara Jensen"],["Status as on census day","Mei Tanaka"]];
const CM_WRONG=4,CM_CAMPUS_T="Campus only",CM_EXAM_T="Exam rooms: campus only",CM_ROOMS_T="Room bookings: campus only",CM_NEW_T="Say which term a count is for";
// the file's cards, the campus line last: o.appear(k), o.tick(k), o.who(k) (the approver's name, 0..1), o.glow(k) (a colour or null),
// o.glowA(k), o.lift(k) (px), o.each(k) (any other fields); o.without drops the campus line
function cm_cards(o){o=o||{};const out=[];CM_MEM.concat([[CM_CAMPUS_T,"Mei Tanaka"]]).forEach((c,k)=>{if(o.without&&k===CM_WRONG)return;
  out.push(Object.assign({text:c[0],who:o.who?c[1]:null,whoA:o.who?o.who(k):0,a:o.appear?o.appear(k):1,tick:o.tick?o.tick(k):1,glow:o.glow?o.glow(k):null,glowA:o.glowA?o.glowA(k):1,
    lift:o.lift?o.lift(k):0},o.each?o.each(k):{}));});return out;}
// the file as the team keeps it now: the four, and Say which term
function cm_kept(o){o=o||{};return CM_MEM.concat([[CM_NEW_T,"Mei Tanaka"]]).map((c,k)=>({text:c[0],who:o.who?c[1]:null,whoA:o.who?o.who(k):0,a:o.appear?o.appear(k):1,tick:1,
  glow:o.glow?o.glow(k):null,glowA:o.glowA?o.glowA(k):1}));}
// where the agent's reading line leaves the file (under the left end of its lower ledge, clear of the names) and meets the sphere
function cm_fileReads(c,tt,u,ax,ay,ar,o){const x0=CM_F.x-(CM_TC.per*(CM_TC.w+CM_TC.gap)+40)/2;return cm_reads(c,x0+14,CM_F.y+34,ax-ar*0.62,ay-ar*0.72,u,Object.assign({t:tt,bend:10},o||{}));}
// the campus line as an entry, pulled up: lesson, and its fields
const CM_CAMPUS={lesson:"Count only students on campus.",rows:[["Learned in","A session on exam rooms, 12 May 2026"],["Approved by","Mei Tanaka, 13 May 2026",1,AG.green],["History","none"]]};
// Memory: from one chat to the team's lesson about census day, word for word
const CM_CENSUS="Read each student's status as it was on census day, not as it is today.";
// the record kept when the line was deleted
const CM_RECORD=[["Added, 13 May 2026","Approved by Mei Tanaka, for exam rooms"],["Deleted, 3 November 2026","By Yusuf Demir, data governance"],["Why","A merge dropped “For exam rooms”"]];

/* ---------------------------------------------------------------- 1 · Lucía's first job */
// the campus line's entry, pulled up, its lesson as it was approved in May and as it is now: may 0..1 brings in "For exam rooms, ",
// drop 0..1 lets those words fall away, and the rest moves back as "Count only students on campus."
function cm_campusCard(c,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return null;const may=o.may||0,drop=o.drop||0,rows=o.rows||CM_CAMPUS.rows;
  const bb=cm_entry(c,x,y,w,{lesson:"Count only students on campus.",rows},{measure:true});
  c.save();c.globalAlpha*=a;if(o.k!=null)ag_about(c,x+w/2,y+bb.h/2,lerp(0.7,1,o.k));
  cm_entry(c,x,y,w,{lesson:"Count only students on campus.",rows},{lessonA:0,edge:o.edge,edgeA:o.edgeA});
  const F={w:600,size:30},pre="For exam rooms, ",rest="count only students on campus.",pw=ag_tw(c,pre,F),ly=bb.ly,lx=bb.lx;
  // first the rest moves over to make room, then the three words come in; dropping, they fall and fade first, then the rest moves back
  const room=ag_sine(clamp(may/0.55,0,1)),preA=clamp((may-0.5)/0.5,0,1);
  if(preA>0&&drop<0.4){const dq=clamp(drop/0.35,0,1),dy=ag_eo(dq)*12;c.save();c.globalAlpha*=preA*(1-ag_eo(dq));
    ag_T(c,pre,lx,ly+dy,{w:600,size:30,col:mix(AG.green,AG.amber,clamp(drop/0.15,0,1))});c.restore();}
  const sx=lx+pw*room*(1-ag_sine(clamp((drop-0.35)/0.65,0,1)));const cap=may<=0?1:ag_in(drop,0.75,0.25);
  if(cap<1){c.save();c.globalAlpha*=1-cap;ag_T(c,rest,sx,ly,F);c.restore();}
  if(cap>0){c.save();c.globalAlpha*=cap;ag_T(c,"Count only students on campus.",sx,ly,F);c.restore();}
  c.restore();return bb;}

// her agent's draft and its evidence, the same in the two shots that show it: the data it read, and the line in the team's memory
function cm_why(cx,tt,T){const open=ag_sine(clamp((tt-T.evidence)/1.3,0,1)),ea=ag_in(tt,T.evidence-0.5,0.4)*(1-ag_in(tt,T.stillThere-0.2,0.5));
  return ag_evidence(cx,80,110,760,{kick:"Her agent's draft",title:"18,026 students"},[{kick:"Data",title:"Students on campus on census day",col:AG.orange},
    {kick:"Team memory",title:"Count only students on campus",col:AG.blue}],{open,side:"below",ew:360,a:ea,kickCol:AG.violet});}

scene("first",(ctx,S,t,sc)=>{const c=sc.cues,T=cm_once(sc,"T",()=>({
    lucia:wAt(sc,"place","Lucía"),monday:wAt(sc,"place","Monday"),
    agent:wAt(sc,"memory","Her agent"),mem:wAt(sc,"memory","team's memory"),lessons:wAt(sc,"memory","lessons"),approved:wAt(sc,"memory","approved"),
    library:wAt(sc,"job","library"),how:wAt(sc,"job","how many"),ebooks:wAt(sc,"job","e-books"),
    said:wAt(sc,"draft","eighteen"),stopped:wAt(sc,"check","stopped"),report:wAt(sc,"check","census report"),n412:wAt(sc,"check","eighteen"),
    n386:wAt(sc,"online","three hundred"),studyOnline:wAt(sc,"online","study online"),
    would:wAt(sc,"books","would have"),fewer:wAt(sc,"books","fewer"),veryOnes:wAt(sc,"books","very ones"),comeIn:wAt(sc,"books","come in"),
    evidence:wAt(sc,"line","evidence"),oneLine:wAt(sc,"line","one line"),inMem:wAt(sc,"line","team's memory"),count:wAt(sc,"line","Count only"),
    inMay:wAt(sc,"may","In May"),approvedAs:wAt(sc,"may","approved as"),exam:wAt(sc,"may","For exam rooms"),right:wAt(sc,"may","Right, for rooms"),
    lastWeek:wAt(sc,"lost","last week"),threeWords:wAt(sc,"lost","three words"),nobody:wAt(sc,"lost","nobody"),
    stillThere:wAt(sc,"still","still there"),questions:wAt(sc,"still","questions"),noReport:wAt(sc,"still","no report"),change:wAt(sc,"still","Something"),
    governs:wAt(sc,"govern","governs"),context:wAt(sc,"govern","context"),memory2:wAt(sc,"govern","memory"),anyData:wAt(sc,"govern","any data"),
    owner:wAt(sc,"five","an owner"),read:wAt(sc,"five","Agents may read"),person:wAt(sc,"five","A person"),
    keptW:wAt(sc,"kept","kept only"),everywhere:wAt(sc,"kept","everywhere"),
    source:wAt(sc,"found","source"),foundW:wAt(sc,"found","found and"),deletedW:wAt(sc,"found","deleted"),record:wAt(sc,"found","record"),
    knows:wAt(sc,"now","what the team knows"),every:wAt(sc,"now","every entry"),who:wAt(sc,"now","who approved"),
    allW:wAt(sc,"all","for all"),
    read2:wAt(sc,"data","what agents read"),count2:wAt(sc,"data","what they count"),wrong:wAt(sc,"data","a wrong lesson"),gone:wAt(sc,"data","stays gone")}));
  const end=c.breath;
  ag_shots(ctx,S,t,sc.dur,[
    // Planning, today: Lucía at her desk; her agent; the team's memory on the wall, which it reads
    {at:0,place:"cmLab",keys:[[0,960,540,1.0],[T.mem-0.6,1000,530,1.03]],d:2.6,draw:(cx,tt)=>{
      cm_lucia(cx,S,tt,{agent:ag_in(tt,T.agent-0.2,0.6),think:0.25*ag_in(tt,T.lessons,1.2),cal:ag_in(tt,T.monday-0.1,0.4)});
      const fa=ag_in(tt,T.mem-0.3,0.6);
      cm_file(cx,CM_F.x,CM_F.y,{a:fa,cards:cm_cards({appear:k=>ag_in(tt,T.lessons+k*0.16,0.35),tick:k=>ag_in(tt,T.approved+0.1+k*0.14,0.3)})});
      const A=CM_DESK.agent;cm_fileReads(cx,tt,ag_sine(clamp((tt-(T.lessons+0.6))/1.2,0,1))*fa,A[0],A[1],A[2]);
      cm_pillAt(cx,CM_DESK.lucia[0],258,"Lucía Ortega · Planning",tt,T.lucia-0.1,null);
      cm_scr(cx,S,()=>cm_tag(cx,CM_UNI,ag_in(tt,0.5,0.6)));}},
    // the library's question, her agent's draft, and the plain check against the census report
    {at:T.library-0.4,place:"cmBoard",cut:true,keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      cm_cardAt(cx,110,130,640,{kick:"From the library",title:"How many students are there?",sub:"To buy next year's e-books"},tt,T.library-0.4,null,{kickCol:AG.kick});
      cm_agent(cx,430,600,78,tt,{think:0.2+0.6*ag_io(tt,T.how,T.said+0.4,0.6),core:0.8,label:"Lucía's agent",floor:720});
      const dA=ag_in(tt,T.said-0.3,0.4),dk=Math.min(1,ag_spr(tt,T.said-0.3,0.5));
      if(dA>0){const b=ag_textCard(cx,1200,130,600,{kick:"Her agent's draft",title:"18,026 students"},{a:dA,k:dk,kickCol:AG.violet});cm_dash(cx,1200,130,600,b.h,22,AG.mut,dA*(1-ag_in(tt,T.stopped,0.4)));}
      const turn=clamp((tt-T.stopped+0.6)/2,0,1)*1.5;
      cm_script(cx,1200,360,"Plain check","against the census report",{a:ag_in(tt,T.stopped-0.7,0.4),k:Math.min(1,ag_spr(tt,T.stopped-0.7,0.5)),turn,glow:ag_io(tt,T.stopped-0.3,T.n412+1.2,0.3)});
      cm_cardAt(cx,1200,560,600,{kick:"Census report",title:"18,412 students",sub:"On census day, 31 March 2026"},tt,T.report-0.2,null,{kickCol:AG.orange,edge:AG.orange});
      cm_arrow(cx,[1500,555,1500,520,1500,505,1500,490],ag_in(tt,T.report+0.1,0.5),{col:AG.orange,lw:3.5,head:12});
      cm_arrow(cx,[1500,360,1500,330,1500,310,1500,296],ag_in(tt,T.stopped-0.2,0.5),{col:AG.blue,lw:3.5,head:12});
      cm_stamp(cx,1660,236,"Stopped",tt,T.stopped+0.1,{col:AG.amber});
      // the difference: 386 left out
      const g=ag_in(tt,T.n386-0.2,0.4);if(g>0)cm_pillAt(cx,860,390,"386 left out",tt,T.n386-0.2,null,{col:AG.amber,icon:"warn"});}},
    // who they are: the 386 who study online, and what the library would have bought
    {at:T.studyOnline-0.5,place:"cmBoard",cut:true,keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const out=ag_in(tt,T.studyOnline,0.8);cm_people(cx,200,320,{a:ag_in(tt,T.studyOnline-0.5,0.4),out,ring:ag_in(tt,T.veryOnes,0.6)});
      cm_pillAt(cx,360,500,"on campus",tt,T.studyOnline-0.3,null);
      cm_pillAt(cx,760,540,"386 study online",tt,T.studyOnline+0.1,null,{col:AG.amber});
      const la=ag_in(tt,T.would-0.2,0.4);if(la>0)cm_library(cx,1150,250,620,{a:la,k:Math.min(1,ag_spr(tt,T.would-0.2,0.5)),count:"For 18,026 students",col:AG.amber,note:ag_in(tt,T.fewer,0.3)>0?"386 fewer":null});
      cm_pillAt(cx,760,640,"can't come in for a book",tt,T.comeIn-0.2,null,{col:AG.amber});}},
    // why: her agent's evidence, one line in the team's memory; on "Count only", its card comes up out of the file
    {at:T.evidence-0.6,place:"cmBoard",cut:true,keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
      cm_agent(cx,250,700,64,tt,{think:0.3,core:0.8,label:"Lucía's agent",floor:800});
      const ev=cm_why(cx,tt,T),mi=ev.items[1].to;
      const lift=90*ag_sine(clamp((tt-T.count+0.7)/0.6,0,1)),gl=ag_in(tt,T.inMem-0.2,0.4);
      const slots=cm_file(cx,1380,700,{a:ag_in(tt,T.oneLine-0.4,0.5),cards:cm_cards({glow:k=>k===CM_WRONG&&gl>0?AG.amber:null,glowA:k=>gl,lift:k=>k===CM_WRONG?lift:0})});
      cm_reads(cx,mi.x+mi.w/2,mi.y+mi.h+6,slots[CM_WRONG].x-8,slots[CM_WRONG].y+40,ag_sine(clamp((tt-T.inMem+0.3)/0.9,0,1)),{t:tt,bend:40});}},
    // the entry, pulled up: as it is, then as approved in May, then the three words falling away
    {at:T.count-0.1,place:"cmBoard",cut:true,keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
      cm_agent(cx,250,700,64,tt,{think:0.3,core:0.8,label:"Lucía's agent",floor:800});
      const ev=cm_why(cx,tt,T),mi=ev.items[1].to,ea=1-ag_in(tt,T.stillThere-0.2,0.5);
      const pa=ag_in(tt,T.count-0.1,0.4),may=ag_in(tt,T.approvedAs-0.2,0.6),drop=clamp((tt-T.threeWords+0.3)/1.4,0,1);
      const rows=[CM_CAMPUS.rows[0],CM_CAMPUS.rows[1],["History","none",1,ag_in(tt,T.nobody,0.4)>0?AG.amber:null]];
      const b=cm_campusCard(cx,920,130,920,{a:pa,k:Math.min(1,ag_spr(tt,T.count-0.1,0.5)),may:may*(drop>=1?0:1)+(drop>=1?1:0),drop,rows,edge:ag_in(tt,T.lastWeek,0.4)>0?AG.amber:null,edgeA:ag_in(tt,T.lastWeek,0.5)});
      cm_reads(cx,mi.x+mi.w+6,mi.y+mi.h*0.45,912,262,ag_sine(clamp((tt-T.count)/0.7,0,1))*ea,{t:tt,bend:-30});
      if(b){cm_pillAt(cx,1380,b.y+b.h+46,"right, for exam rooms",tt,T.right-0.1,T.lastWeek-0.5,{col:AG.green,icon:"tick"});
        cm_pillAt(cx,1380,b.y+b.h+46,"changed last week",tt,T.lastWeek,null,{col:AG.amber,icon:"warn"});}}},
    // still there: every agent reads it, for questions no report can check
    {at:T.stillThere-0.5,place:"cmBoard",cut:true,keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const pulse=0.6+0.4*Math.sin((tt-T.change)*4)*ag_io(tt,T.change,T.change+1.8,0.3);
      cm_file(cx,960,610,{cards:cm_cards({glow:k=>k===CM_WRONG?AG.amber:null,glowA:k=>pulse})});
      const ag=[[480,770,"Jun's agent"],[960,780,"Clara's agent"],[1440,770,"Lucía's agent"]];
      ag.forEach((p,i)=>{cm_agent(cx,p[0],p[1],48,tt,{ph:i*1.7,think:0.2,core:0.7,label:p[2],a:ag_in(tt,T.stillThere-0.3+i*0.15,0.4)});
        cm_reads(cx,960+(i-1)*200,648,p[0]+(i-1)*-10,p[1]-54,ag_sine(clamp((tt-T.stillThere-i*0.15)/0.9,0,1)),{t:tt,bend:0});});
      cm_pillAt(cx,320,300,"Students to survey?",tt,T.questions,null,{icon:"warn",col:AG.amber});
      cm_pillAt(cx,1640,300,"Seats for welcome week?",tt,T.questions+0.5,null,{icon:"warn",col:AG.amber});
      cm_pillAt(cx,960,138,"no report to check them against",tt,T.noReport,null,{col:AG.amber});}},
    // the change: context and memory, governed like any data, in five ways
    {at:T.governs-0.6,place:"cmBoard",cut:true,keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      ag_label(cx,960,196,"Governed like any data",{align:"center",a:ag_in(tt,T.governs-0.6,0.5)});
      cm_cardAt(cx,330,236,560,{kick:"Context",sub:"The repository, the skills, dbt's descriptions, the contracts"},tt,T.context-0.2,null,{kickCol:AG.blue,edge:AG.blue});
      cm_cardAt(cx,1030,236,560,{kick:"Memory",sub:"What the team keeps from its sessions"},tt,T.memory2-0.2,null,{kickCol:AG.blue,edge:AG.blue});
      const P=[[520,500,"An owner",T.owner,null],[960,500,"Agents read, never change",T.read,"lock"],[1400,500,"A person reviews",T.person,"tick"],
        [700,588,"Kept while it's right",T.keptW,null],[1220,588,"Deleted everywhere",T.everywhere,null]];
      P.forEach(p=>cm_pillAt(cx,p[0],p[1],p[2],tt,p[3]-0.1,null,{col:AG.green,icon:p[4]}));}},
    // found: the line against its source, deleted, with a record of why
    {at:T.source-0.9,place:"cmBoard",cut:true,keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const sa=ag_in(tt,T.source-0.7,0.4);cm_session(cx,100,150,760,240,{a:sa,date:"12 May 2026",lines:["For exam rooms, count only","students on campus."]});
      const hl=ag_in(tt,T.source+0.2,0.4);if(hl>0){cx.save();cx.globalAlpha*=hl;cx.fillStyle=rgba(AG.green,0.14);rr(cx,113,220,ag_tw(cx,"For exam rooms,",{w:600,size:28})+18,42,10);cx.fill();cx.restore();}
      const rm=ag_in(tt,T.deletedW,0.4),ea=ag_in(tt,T.source-0.7,0.4)*(1-0.55*ag_in(tt,T.deletedW+0.4,0.6));
      const b=cm_entry(cx,980,150,840,{lesson:"Count only students on campus.",rows:[CM_CAMPUS.rows[0]]},{a:ea,edge:AG.amber,edgeA:hl});
      cm_reads(cx,860,270,980,270,ag_sine(clamp((tt-T.source)/0.6,0,1)),{t:tt,bend:0});
      cm_pillAt(cx,1400,b.y+b.h+46,"lost: For exam rooms",tt,T.source+0.4,T.deletedW,{col:AG.amber,icon:"warn"});
      cm_stamp(cx,1606,226,"Deleted",tt,T.deletedW,{col:AG.amber,rot:-0.06});
      const ra=ag_in(tt,T.record-0.2,0.5);if(ra>0)cm_history(cx,560,470,800,CM_RECORD,{kick:"Record",a:ra,k:Math.min(1,ag_spr(tt,T.record-0.2,0.5))});}},
    // now: her agent starts with what the team knows, every entry with who approved it; the camera leans in only a little, so her
    // calendar stays whole in the frame and the agent's name stays above the captions
    {at:T.knows-1.4,place:"cmLab",cut:true,keys:[[0,1000,530,1.03],[T.every-0.2,1000,540,1.06]],d:2.4,draw:(cx,tt)=>{
      cm_lucia(cx,S,tt,{think:0.2,smile:0.45});
      cm_file(cx,CM_F.x,CM_F.y,{cards:cm_cards({without:true,who:k=>ag_in(tt,T.who+k*0.15,0.4)})});
      const A=CM_DESK.agent;cm_fileReads(cx,tt,1,A[0],A[1],A[2]);}},
    // the library buys e-books for all 18,412
    {at:T.allW-0.9,place:"cmBoard",cut:true,keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const j=ag_sine(clamp((tt-T.allW)/1.6,0,1));cm_people(cx,260,380,{join:j});
      cm_library(cx,1060,300,620,{count:"For all 18,412 students",col:AG.green,k:Math.min(1,ag_spr(tt,T.allW-0.9,0.5)),a:ag_in(tt,T.allW-0.9,0.3)});}},
    // and for data: what agents read is governed like what they count
    {at:T.read2-0.8,place:"cmBoard",cut:true,keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{const f=1-ag_in(tt,end+0.4,0.8);if(f<=0)return;cx.save();cx.globalAlpha*=f;
      cm_cardAt(cx,300,200,600,{kick:"What agents read",title:"The team's memory",sub:"and its context"},tt,T.read2-0.2,null,{kickCol:AG.blue,edge:AG.blue});
      cm_cardAt(cx,1020,200,600,{kick:"What they count",title:"18,412 students",sub:"on census day, 31 March 2026"},tt,T.count2-0.2,null,{kickCol:AG.orange,edge:AG.orange});
      [0,1].forEach(s=>{for(let i=0;i<5;i++)cm_govMark(cx,(s?1020:300)+90+i*105,460,ag_in(tt,T.count2+0.6+i*0.12+s*0.06,0.4));});
      const wa=ag_in(tt,T.wrong-0.1,0.4)*(1-ag_in(tt,T.gone+0.5,0.6));if(wa>0){cx.save();cx.globalAlpha*=wa;cm_card(cx,830,560,{text:CM_CAMPUS_T,glow:AG.amber,glowA:1},-0.018);cx.restore();}
      cm_stamp(cx,984,664,"Deleted",tt,T.gone,{col:AG.amber,t1:T.gone+0.5,size:30});
      cx.restore();}}],0.5);
  ag_title(ctx,S,t,c.breath,"Context and memory, governed",null,"FILM 9 OF 9 · AGENTS AT WORK ON DATA");
});

/* ---------------------------------------------------------------- 2 · What an agent reads */
// the five questions any data gets, one a line, in the order the voice asks them
const CM_Q=["owns","may","reviews","kept","gone"];
scene("reads",(ctx,S,t,sc)=>{const c=sc.cues,T=cm_once(sc,"T",()=>({
    reads:wAt(sc,"began","what an agent reads"),code:wAt(sc,"began","code"),meta:wAt(sc,"began","metadata"),skills:wAt(sc,"began","skills"),tools:wAt(sc,"began","tools"),
    memory:wAt(sc,"adds","memory"),shapes:wAt(sc,"data","shapes"),isData:wAt(sc,"data","is data"),gets:wAt(sc,"data","gets what"),
    note:wAt(sc,"chat","A note"),none:wAt(sc,"chat","none of them"),answer:wAt(sc,"chat","The team's context"),all5:wAt(sc,"chat","all five")}));
  ag_shots(ctx,S,t,sc.dur,[
    // what an agent reads, as Context engineering drew it: each kind of context as it's named, then memory; all of it is data
    {at:0,place:"cmBoard",keys:[[0,960,540,1.0]],push:0.03,draw:(cx,tt)=>{const at=[T.code,T.meta,T.skills,T.tools];
      cm_context(cx,{t:tt,show:i=>clamp((tt-at[i]+0.15)/1.0,0,1),memory:clamp((tt-T.memory+0.15)/1.0,0,1),gov:clamp((tt-T.gets)/1.2,0,1),
        back:i=>clamp((tt-at[i]-0.75)/1.3,0,1),backMem:clamp((tt-T.memory-0.75)/1.3,0,1),
        think:0.1+0.5*ag_io(tt,T.shapes-0.2,T.isData+0.8,0.5)});
      ag_label(cx,960,262,"What an agent reads",{align:"center",a:ag_in(tt,T.reads-0.2,0.4)*(1-ag_in(tt,T.isData-0.7,0.35))});
      ag_label(cx,960,262,"All of it is data",{align:"center",col:AG.orange,a:ag_in(tt,T.isData-0.2,0.4)});}},
    // the five questions: a column lights as each is asked; a note in a chat answers none; the team's context and memory, all five
    {at:c.owns-0.5,place:"cmBoard",cut:true,keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{const q=CM_Q.map(id=>c[id]),nx=j=>j<4?q[j+1]:T.note;
      ag_label(cx,205,172,"What any data gets",{a:ag_in(tt,c.owns-0.5,0.4)});
      cm_govTable(cx,205,200,{cols:q.map((t0,j)=>ag_io(tt,t0-0.2,nx(j)-0.2,0.3)+0.25*ag_in(tt,nx(j)-0.2,0.3)*(1-ag_in(tt,T.answer,0.5))),
        cells:(i,j)=>ag_in(tt,T.answer+0.25+j*0.16+i*0.05,0.3),chat:ag_in(tt,T.note-0.2,0.4)*(1-0.55*ag_in(tt,T.answer,0.6)),chatCell:j=>ag_in(tt,T.none+j*0.12,0.3)});}}]);
  CM_KICK(ctx,1);});

/* ---------------------------------------------------------------- 3 · Context, reviewed like code */
// the team's project, as the example project names its files, and its owners, as CODEOWNERS lists them there
const CM_REPO=[{name:"AGENTS.md",note:"the page for agents"},{name:"skills/",note:"the skills",folder:1},{name:"models/",note:"dbt's descriptions",folder:1},
  {name:"governance/5-data-contracts/",note:"the contracts",folder:1},{name:"CODEOWNERS",note:"who owns each file"}];
const CM_OWN=[["*","jun.park@uni.example"],["/models/marts/planning/_planning__models.yml","planning@uni.example jun.park@uni.example"],["/skills/review-for-governance/","data.governance@uni.example noor@uni.example"]];
scene("code",(ctx,S,t,sc)=>{const c=sc.cues,T=cm_once(sc,"T",()=>({
    repo:wAt(sc,"lives","repository"),page:wAt(sc,"lives","the page for agents"),skills:wAt(sc,"lives","the skills"),dbt:wAt(sc,"lives","dbt's descriptions"),contracts:wAt(sc,"lives","the contracts"),
    owner:wAt(sc,"owner","an owner"),list:wAt(sc,"owner","a list"),meta:wAt(sc,"owner","its own metadata"),
    pr:wAt(sc,"pull","pull request"),reviews:wAt(sc,"pull","its owner reviews"),prod:wAt(sc,"pull","production"),second:wAt(sc,"pull","second person's"),
    propose:wAt(sc,"propose","propose"),never:wAt(sc,"propose","never approve"),
    history:wAt(sc,"history","history"),who:wAt(sc,"history","who changed"),why:wAt(sc,"history","and why"),
    oneway:wAt(sc,"oneway","one way"),dbx:wAt(sc,"oneway","Databricks"),
    uc:wAt(sc,"comments","Unity Catalog"),comments:wAt(sc,"comments","comments"),column:wAt(sc,"comments","column"),
    gw:wAt(sc,"skills","Unity Gateway"),beta:wAt(sc,"skills","in beta"),obj:wAt(sc,"object","Unity Catalog object"),sOwner:wAt(sc,"object","an owner"),perm:wAt(sc,"object","permissions"),rec:wAt(sc,"object","a record"),
    nobody:wAt(sc,"nobody","Nobody"),starts:wAt(sc,"nobody","A change starts")}));
  ag_shots(ctx,S,t,sc.dur,[
    // the repository, each thing lit as it's named; at the right, the owners' list, then a change, then its history
    {at:0,place:"cmBoard",keys:[[0,960,540,1.0]],push:0.025,draw:(cx,tt)=>{const lit=[T.page,T.skills,T.dbt,T.contracts,T.list];
      const rows=CM_REPO.map((r,i)=>Object.assign({},r,{a:i<4?1:ag_in(tt,T.list-0.3,0.4),lit:i===4?ag_io(tt,T.list-0.2,T.pr-0.6,0.3):ag_io(tt,lit[i]-0.15,lit[i]+1.4,0.3),
        noteA:ag_in(tt,lit[i]-0.1,0.4)}));
      const R=cm_repo(cx,60,150,870,rows,{a:ag_in(tt,0.05,0.4),k:Math.min(1,ag_spr(tt,0.05,0.5)),nameW:490});
      // CODEOWNERS, linked to its row
      const oa=ag_in(tt,T.owner-0.2,0.4)*(1-ag_in(tt,T.pr-0.75,0.35));
      if(oa>0){const r4=R.rows[4];cm_arrow(cx,[r4.x+r4.w+4,r4.y+r4.h/2,r4.x+r4.w+24,r4.y+r4.h/2,r4.x+r4.w+30,r4.y+r4.h/2,r4.x+r4.w+40,r4.y+r4.h/2],ag_in(tt,T.list,0.4),{col:AG.blue,lw:3,head:10,a:oa});
        cm_owners(cx,960,150,880,CM_OWN.map((l,i)=>[l[0],l[1],ag_in(tt,T.owner+i*0.3,0.4)]),{a:oa,k:Math.min(1,ag_spr(tt,T.owner-0.2,0.5)),subA:ag_in(tt,T.meta-0.3,0.4)});}
      // the change: Jun's agent opened it; its owner reviews it, a second person approves it; the agent can't
      const pa=ag_in(tt,T.pr-0.3,0.4)*(1-ag_in(tt,T.history-0.65,0.35));
      if(pa>0)cm_pr(cx,960,150,880,{title:"Reconcile every count against the census report",by:"Opened by Jun's agent",byPen:1,byGlow:ag_io(tt,T.propose-0.2,T.never+1.2,0.3),
        files:[["skills/reconcile-and-diff/SKILL.md"]],
        rows:[{text:"Its owner reviews it: Jun Park",state:"wait",tick:ag_in(tt,T.reviews+0.5,0.35),a:ag_in(tt,T.reviews-0.2,0.4)},
              {text:"A second person approves it: Noor Rahman",state:"wait",tick:ag_in(tt,T.second+0.5,0.35),a:ag_in(tt,T.prod-0.2,0.4)},
              {text:"Jun's agent can't approve it",state:"lock",a:ag_in(tt,T.never-0.1,0.4)}],a:pa,k:Math.min(1,ag_spr(tt,T.pr-0.3,0.5))});
      // and its history: who, when, and why
      const ha=ag_in(tt,T.history-0.3,0.4);
      if(ha>0)cm_history(cx,960,150,880,[["Proposed by","Jun's agent, 2 November 2026",ag_in(tt,T.who-0.2,0.4)],["Reviewed and approved by","Jun Park and Noor Rahman, 3 November 2026",ag_in(tt,T.who+0.4,0.4)],
        ["Why","Reconcile every count against the census report",ag_in(tt,T.why-0.2,0.4)]],{kick:"History",a:ha,k:Math.min(1,ag_spr(tt,T.history-0.3,0.5))});}},
    // one way, to where agents read it: dbt's descriptions as comments in Unity Catalog, the skills in Unity Gateway; nobody edits them there
    {at:T.oneway-0.5,place:"cmBoard",cut:true,keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      cm_repo(cx,40,250,400,[{name:"AGENTS.md"},{name:"skills/",folder:1,lit:ag_io(tt,T.gw-0.3,T.nobody-0.3,0.4)},{name:"models/",folder:1,lit:ag_io(tt,T.uc-0.3,T.gw-0.4,0.4)}],{});
      const u=ag_sine(clamp((tt-T.oneway+0.2)/0.9,0,1));cm_arrow(cx,[456,420,490,420,530,420,568,420],u,{col:AG.blue,lw:4,head:14});
      ag_T(cx,"one way",512,396,{w:600,size:28,col:AG.mut,align:"center",a:ag_in(tt,T.oneway,0.4)});
      cm_zone(cx,580,130,1290,740,"On Databricks",{a:ag_in(tt,T.dbx-0.4,0.5)});
      const ta=ag_in(tt,T.uc-0.3,0.4),tb=cm_table(cx,610,210,640,{name:"mart_planning__near_award",comment:"Every award a learner was enrolled in, or held credit towards, on the census date, …",
        cols:[["census_date","Planning's census date: the date the numbers are as at.",ag_in(tt,T.column-0.2,0.4)]],commentA:ag_in(tt,T.comments-0.2,0.4),a:ta,k:Math.min(1,ag_spr(tt,T.uc-0.3,0.5))});
      const sr=[["A Unity Catalog object",T.obj],["An owner",T.sOwner],["Permissions",T.perm],["A record of who read or changed it",T.rec]];
      const sa=ag_in(tt,T.gw-0.3,0.4),sb=cm_skill(cx,1280,210,560,{name:"reconcile-and-diff",rows:sr.map(r=>[r[0],ag_in(tt,r[1]-0.15,0.4)]),beta:ag_in(tt,T.beta-0.1,0.4),a:sa,k:Math.min(1,ag_spr(tt,T.gw-0.3,0.5))});
      // Jun's agent reads both there
      const aa=ag_in(tt,T.uc+0.4,0.5);cm_agent(cx,1262,760,54,tt,{a:aa,think:0.2,core:0.75,label:"Jun's agent",floor:850});
      cm_reads(cx,tb.x+tb.w*0.55,tb.y+tb.h+6,1222,722,ag_sine(clamp((tt-T.uc-0.5)/0.9,0,1))*ta,{t:tt,bend:20});
      cm_reads(cx,sb.x+sb.w*0.4,sb.y+sb.h+6,1302,722,ag_sine(clamp((tt-T.gw-0.4)/0.9,0,1))*sa,{t:tt,bend:20});
      cm_pillAt(cx,1700,172,"no edits here",tt,T.nobody-0.1,null,{icon:"lock",col:AG.blue,size:28});
      cm_pillAt(cx,270,620,"a change starts here",tt,T.starts-0.1,null,{icon:"draft",col:AG.green,size:28});}}]);
  CM_KICK(ctx,1);});

/* ---------------------------------------------------------------- 4 · Memory, kept like data */
// the agents that write sessions, at the left of the board
const CM_WRITERS=[[170,330,"Jun's agent"],[170,540,"Clara's agent"],[170,750,"Lucía's agent"]];
// the proposals the daily step writes now, and the files of the team's memory once Say which term is approved (memory/entries/)
const CM_PROPS=["Say which term a count is for","Round averages to one decimal"];
const CM_ENTRIES=["read-the-glossary-first.md","say-which-term-a-count-is-for.md","show-the-count-reported.md","status-as-on-census-day.md","students-not-enrolments.md"];
// the file before the merge: the four, the campus line as approved in May, and the line the step kept about room bookings, no one's tick
function cm_before(o){o=o||{};return CM_MEM.map(m=>({text:m[0],tick:1})).concat([{text:CM_EXAM_T,tick:1},{text:CM_ROOMS_T,tick:0}]).map((cd,k)=>Object.assign(cd,o.each?o.each(k):{}));}
scene("memory",(ctx,S,t,sc)=>{const c=sc.cues,T=cm_once(sc,"T",()=>({
    write:wAt(sc,"different","agents write"),
    dbx:wAt(sc,"lakebase","On Databricks"),sessions:wAt(sc,"lakebase","sessions"),lasting:wAt(sc,"lakebase","lasting memory"),lake:wAt(sc,"lakebase","Lakebase"),beta:wAt(sc,"lakebase","in beta"),
    step:wAt(sc,"daily","A step"),once:wAt(sc,"daily","once a day"),readsS:wAt(sc,"daily","reads the sessions"),keeps:wAt(sc,"daily","keeps what"),asking:wAt(sc,"daily","without asking"),
    campus:wAt(sc,"how","campus line"),lost:wAt(sc,"how","lost its words"),merged:wAt(sc,"how","merged"),other:wAt(sc,"how","other lines"),built:wAt(sc,"how","as it's built"),
    room:wAt(sc,"room","one room"),whoever:wAt(sc,"room","whoever may write"),any:wAt(sc,"room","any entry"),nothing:wAt(sc,"room","nothing records"),
    split:wAt(sc,"split","split it in two"),props:wAt(sc,"split","only proposals"),noAgent:wAt(sc,"split","no agent reads"),
    morning:wAt(sc,"morning","Each morning"),script:wAt(sc,"morning","a script"),pr:wAt(sc,"morning","pull request"),oneFile:wAt(sc,"morning","one file"),
    person:wAt(sc,"confirm","The person"),confirms:wAt(sc,"confirm","confirms"),ownerM:wAt(sc,"confirm","the owner of its meaning"),approves:wAt(sc,"confirm","approves"),
    yusuf:wAt(sc,"yusuf","Yusuf"),gov:wAt(sc,"yusuf","data governance"),whole:wAt(sc,"yusuf","as a whole"),
    loads:wAt(sc,"load","a script loads"),files:wAt(sc,"load","approved files"),store:wAt(sc,"load","the team's store"),every:wAt(sc,"load","every agent"),none:wAt(sc,"load","none may change")}));
  ag_shots(ctx,S,t,sc.dur,[
    // agents write their sessions; on Databricks, a sessions store and the team's lasting memory, in Lakebase; once a day a step keeps
    // what seems worth keeping, unasked: here, a line about room bookings, with no one's tick
    {at:0,place:"cmBoard",keys:[[0,960,540,1.0]],push:0.025,draw:(cx,tt)=>{
      cm_zone(cx,330,140,1550,720,"On Databricks · Lakebase",{a:ag_in(tt,T.lake-0.3,0.5)});
      const s0=Math.min(0.15,T.write-0.4),sa=ag_in(tt,s0,0.5),rowY=i=>210+136+i*64+26;
      cm_store(cx,380,210,420,348,{kick:"Store",title:"Sessions",rows:CM_WRITERS.map((p,i)=>({text:p[2]+" · today",a:ag_in(tt,T.write+0.2+i*0.3,0.4)})),
        glow:ag_io(tt,T.sessions-0.2,T.sessions+1.2,0.3)?AG.blue:null,glowA:ag_io(tt,T.sessions-0.2,T.sessions+1.2,0.3),a:sa,k:Math.min(1,ag_spr(tt,s0,0.5))});
      CM_WRITERS.forEach((p,i)=>{cm_agent(cx,p[0],p[1],44,tt,{ph:i*1.3,think:0.3,core:0.75,label:p[2],a:ag_in(tt,0.05+i*0.12,0.4),floor:p[1]+92});
        cm_reads(cx,p[0]+48,p[1]-6,376,rowY(i),ag_sine(clamp((tt-T.write-i*0.3)/0.8,0,1)),{t:tt,bend:0,col:AG.violet});});
      // the daily step reads the sessions, and writes to the lasting memory
      const sta=ag_in(tt,T.step-0.2,0.4);
      cm_step(cx,390,640,{w:400,a:sta,k:Math.min(1,ag_spr(tt,T.step-0.2,0.5)),turn:Math.max(0,tt-T.once)*0.35,glow:ag_io(tt,T.readsS-0.2,T.asking+0.6,0.4)});
      cm_arrow(cx,[590,562,590,590,590,612,590,634],ag_in(tt,T.readsS-0.3,0.5),{col:AG.violet,lw:3.5,head:12});
      cm_arrow(cx,[794,702,842,702,898,702,946,702],ag_in(tt,T.keeps-0.4,0.5),{col:AG.violet,lw:3.5,head:12});
      const add=ag_in(tt,T.keeps+0.1,0.5),ga=add*(1-ag_in(tt,T.asking+1.2,0.6));
      cm_file(cx,1400,770,{a:ag_in(tt,T.lasting-0.3,0.5),cards:cm_before({each:k=>k===5?{a:add,glow:ga>0?AG.violet:null,glowA:ga}:{}})});
      // sessions and memory are in beta; Lakebase isn't: the mark sits on the two stores
      cm_pillAt(cx,690,302,"beta",tt,T.beta-0.1,null,{size:28,col:AG.blue});cm_pillAt(cx,1296,374,"beta",tt,T.beta+0.1,null,{size:28,col:AG.blue});
      cm_pillAt(cx,590,820,"no one reviews it",tt,T.asking,null,{icon:"warn",col:AG.amber,size:28});}},
    // how the campus line lost its words: the step merges the room bookings line into it, as it's built to, and its title becomes
    // Campus only; the store is one room: whoever may write to it may change any entry, and nothing records what it said before
    {at:c.how-0.4,place:"cmBoard",cut:true,keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const m=clamp((tt-T.merged)/1.4,0,1),gl=ag_in(tt,T.campus-0.2,0.4)*(1-ag_in(tt,T.room-0.2,0.6)),w1=ag_in(tt,T.whoever,0.5),hit=k=>ag_io(tt,T.any-0.2+k*0.1,T.nothing,0.3);
      // the room bookings card slides onto the campus line, which loses its title under it; then the card goes, and the new title comes
      const slide=clamp(m/0.6,0,1),gone=clamp((m-0.6)/0.2,0,1);
      cm_file(cx,820,770,{cards:cm_before({each:k=>k===4?{alt:CM_CAMPUS_T,altA:clamp((m-0.8)/0.2,0,1),textA:1-clamp((m-0.55)/0.05,0,1),glow:gl>0?AG.amber:null,glowA:gl}
        :k===5?{slot:5-slide,a:1-gone,glow:gl>0?AG.amber:null,glowA:gl}:(k===0||k===2)&&hit(k)>0?{glow:AG.violet,glowA:hit(k)}:{}})});
      // the step, and its line into the two cards
      cm_step(cx,1400,640,{w:400,turn:tt*0.35,glow:ag_io(tt,T.merged-0.4,T.built+0.6,0.4)});
      const tip=1236-278*ag_sine(slide);cm_arrow(cx,[1396,702,lerp(1396,tip,0.33),702,lerp(1396,tip,0.66),702,tip,702],ag_in(tt,T.merged-0.6,0.5),{col:AG.violet,lw:3.5,head:12});
      cm_pillAt(cx,960,236,"It can rewrite, merge, split or delete any entry",tt,T.built-0.2,T.room-0.4,{size:28,col:AG.violet});
      // whoever may write: an agent on each side, each reaching a different card
      [[200,470,"Clara's agent",[400,478]],[1600,420,"Jun's agent",[1226,470]]].forEach((p,i)=>{cm_agent(cx,p[0],p[1],44,tt,{ph:i*1.7,think:0.3,core:0.75,label:p[2],a:w1,floor:p[1]+92});
        const L=i?-1:1;cm_reads(cx,p[0]+L*48,p[1]-6,p[3][0],p[3][1],ag_sine(clamp((tt-T.whoever-0.2-i*0.2)/0.8,0,1))*w1,{t:tt,bend:-20,col:AG.violet});});
      cm_pillAt(cx,960,236,"nothing records what it said before",tt,T.nothing-0.1,null,{icon:"warn",col:AG.amber,size:28});}},
    // split in two: the daily step writes only proposals, in a store no agent reads; the team's memory is a store of its own
    {at:c.split-0.4,place:"cmBoard",cut:true,keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      cm_step(cx,90,190,{w:400,turn:tt*0.35,glow:ag_io(tt,T.props-0.3,T.props+1.4,0.4)});
      cm_arrow(cx,[290,318,290,350,290,370,290,394],ag_in(tt,T.props-0.2,0.5),{col:AG.violet,lw:3.5,head:12});
      const pa=ag_in(tt,T.split-0.2,0.4);
      cm_store(cx,90,400,560,284,{kick:"Store",title:"Proposals",dashed:true,edge:null,rows:CM_PROPS.map((s,i)=>({text:s,dashed:true,a:ag_in(tt,T.props+0.2+i*0.3,0.4)})),a:pa,k:Math.min(1,ag_spr(tt,T.split-0.2,0.5))});
      cm_pillAt(cx,370,744,"no agent reads it",tt,T.noAgent-0.1,null,{icon:"lock",size:28});
      const fa=ag_in(tt,T.split+0.3,0.4);
      cm_file(cx,1150,700,{a:fa,cards:cm_cards({without:true})});
      [[1760,300,"Jun's agent",410],[1760,500,"Clara's agent",560],[1760,700,"Lucía's agent",690]].forEach((p,i)=>{cm_agent(cx,p[0],p[1],44,tt,{ph:i*1.4,think:0.2,core:0.75,label:p[2],a:fa,floor:p[1]+92});
        cm_reads(cx,1596,p[3],p[0]-48,p[1]-6,ag_sine(clamp((tt-T.split-0.6-i*0.2)/0.8,0,1))*fa,{t:tt,bend:0});});}},
    // each morning a plain script brings the proposals to the repository, one file each; the person confirms, the meaning's owner approves
    {at:c.morning-0.4,place:"cmBoard",cut:true,keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      cm_store(cx,80,170,520,284,{kick:"Store",title:"Proposals",dashed:true,edge:null,rows:CM_PROPS.map(s=>({text:s,dashed:true}))});
      const sa=ag_in(tt,T.script-0.3,0.4);
      cm_script(cx,80,540,"Each morning","a plain script",{a:sa,k:Math.min(1,ag_spr(tt,T.script-0.3,0.5)),turn:Math.max(0,tt-T.script)*0.5,glow:ag_io(tt,T.script,T.pr+1.0,0.4)});
      cm_arrow(cx,[300,458,300,490,300,510,300,534],ag_in(tt,T.script-0.1,0.4),{col:AG.blue,lw:3.5,head:12});
      cm_arrow(cx,[424,602,640,602,780,250,952,250],ag_in(tt,T.pr-0.3,0.6),{col:AG.blue,lw:3.5,head:12});
      const ra=ag_in(tt,T.pr-0.2,0.4),lit=ag_in(tt,T.person-0.2,0.4);
      cm_pr(cx,960,110,880,{title:"Memory proposals, 4 November 2026",by:"Opened by the morning script",
        files:[["memory/entries/say-which-term-a-count-is-for.md",ag_in(tt,T.oneFile,0.4),lit>0?mix(AG.ink,AG.blue,lit):null],["memory/entries/round-averages-to-one-decimal.md",ag_in(tt,T.oneFile+0.35,0.4)]],
        a:ra,k:Math.min(1,ag_spr(tt,T.pr-0.2,0.5))});
      // the first file as a proposed entry: dashed, with a pen, until "Approved" lands on it; then it's an entry
      const ea=ag_in(tt,T.person-0.3,0.4),ok=ag_in(tt,T.approves+0.25,0.35);
      cm_entry(cx,960,420,880,{lesson:"Say which term a count is for.",rows:[["Learned in","A session, 3 November 2026"],["Confirmed by","Clara Jensen, whose session it was",ag_in(tt,T.confirms-0.2,0.4)],
        ["Approved by","Mei Tanaka, who owns its meaning",ag_in(tt,T.ownerM-0.1,0.4),ok>0?mix(AG.ink,AG.green,ok):null]]},{prop:1-ag_in(tt,T.approves+0.4,0.6),a:ea,k:Math.min(1,ag_spr(tt,T.person-0.3,0.5))});
      cm_stamp(cx,1650,486,"Approved",tt,T.approves+0.2,{col:AG.green,size:28});}},
    // Yusuf, in data governance, owns the memory as a whole: CODEOWNERS says so
    {at:c.yusuf-0.4,place:"cmBoard",cut:true,keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      ag_person(cx,"yusuf",420,640,0.9,{t:tt,gaze:[4,0],smile:0.3});
      cm_pillAt(cx,420,300,"Yusuf Demir · Data governance",tt,c.yusuf-0.3,null,{size:28});
      cm_owners(cx,960,110,880,[["/memory/","data.governance@uni.example",1,ag_in(tt,T.whole-0.2,0.4)]],{a:ag_in(tt,T.gov-0.4,0.4),k:Math.min(1,ag_spr(tt,T.gov-0.4,0.5))});
      cm_file(cx,1400,812,{cards:cm_kept()});}},
    // a plain script loads the approved files into the team's store: every agent reads it, none may change it
    {at:c.load-0.4,place:"cmBoard",cut:true,keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      cm_repo(cx,80,150,660,CM_ENTRIES.map(n=>({name:n})),{title:"memory/entries/",nameW:560});
      const sa=ag_in(tt,T.loads-0.3,0.4);
      cm_script(cx,80,640,"Load","the approved files",{a:sa,k:Math.min(1,ag_spr(tt,T.loads-0.3,0.5)),turn:Math.max(0,tt-T.loads)*0.5,glow:ag_io(tt,T.files-0.2,T.store+1.0,0.4)});
      cm_arrow(cx,[275,580,275,600,275,618,275,636],ag_in(tt,T.loads-0.1,0.4),{col:AG.blue,lw:3.5,head:12});
      cm_arrow(cx,[474,702,640,702,760,600,890,600],ag_in(tt,T.store-0.4,0.4),{col:AG.blue,lw:3.5,head:12});
      const fa=ag_in(tt,T.store-0.3,0.4);
      cm_file(cx,1340,660,{a:fa,cards:cm_kept({appear:k=>ag_in(tt,T.store+k*0.15,0.35)}),lock:ag_in(tt,T.none-0.1,0.4)});
      [[1100,780,"Jun's agent"],[1340,780,"Clara's agent"],[1580,780,"Lucía's agent"]].forEach((p,i)=>{const aa=ag_in(tt,T.every-0.3+i*0.12,0.4);
        cm_agent(cx,p[0],p[1],40,tt,{ph:i*1.6,think:0.2,core:0.75,label:p[2],a:aa,floor:p[1]+84});
        cm_reads(cx,p[0],696,p[0],p[1]-44,ag_sine(clamp((tt-T.every-i*0.15)/0.8,0,1))*aa,{t:tt,bend:0});});}}]);
  CM_KICK(ctx,1);});

/* ---------------------------------------------------------------- 5 · Kept, then deleted */
// what the docs say about deleting a session, word for word (Databricks docs, Agent sessions, beta, updated 17 October 2026; read 4 November 2026)
const CM_DOCS_Q="Deleting a session or session store does not delete memory retained in a memory store.";
// the skills in the repository, and on the platform: one deleted in the repository, still on the platform
const CM_SKILLS=["draft-a-model","reconcile-and-diff","count-exam-rooms"];
// a session's tile on the strip of days kept: violet edge, two grey lines
function cm_tile(ctx,x,y,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_box(ctx,x,y,44,58,8,{edge:AG.violet,edgeA:0.55});
  ctx.fillStyle="rgba(86,92,100,0.18)";rr(ctx,x+9,y+18,26,6,3);ctx.fill();rr(ctx,x+9,y+32,18,6,3);ctx.fill();ctx.restore();}
scene("keep",(ctx,S,t,sc)=>{const c=sc.cues,T=cm_once(sc,"T",()=>({
    keeping:wAt(sc,"decide","Keeping"),decisions:wAt(sc,"decide","decisions"),
    sessions:wAt(sc,"thirty","sessions"),thirty:wAt(sc,"thirty","thirty days"),job:wAt(sc,"thirty","scheduled job"),deletes:wAt(sc,"thirty","deletes them"),
    date:wAt(sc,"again","a date"),ownerDoes:wAt(sc,"again","its owner does"),
    namesNo:wAt(sc,"names","names no student"),priv:wAt(sc,"names","nothing private"),hist:wAt(sc,"names","its history"),
    traps:wAt(sc,"traps","traps"),found:wAt(sc,"traps","campus line"),first:wAt(sc,"traps","first thought"),delChat:wAt(sc,"traps","delete the chat"),
    delNothing:wAt(sc,"nothing","deletes nothing"),docs:wAt(sc,"nothing","the docs say"),doesnt:wAt(sc,"nothing","doesn't delete"),
    syncW:wAt(sc,"sync","the sync"),neverDel:wAt(sc,"sync","never deletes"),
    whereW:wAt(sc,"where","where a thing"),file:wAt(sc,"where","the line's file"),why:wAt(sc,"where","says why"),entry:wAt(sc,"where","its entry"),next:wAt(sc,"where","next load"),
    rec:wAt(sc,"record","The record"),added:wAt(sc,"record","who added"),deleted:wAt(sc,"record","who deleted"),whyR:wAt(sc,"record","and why"),noAgent:wAt(sc,"record","No agent")}));
  ag_shots(ctx,S,t,sc.dur,[
    // sessions kept thirty days: a strip of days; each day a scheduled job puts the oldest in the bin, and today's comes in
    {at:0,place:"cmBoard",keys:[[0,960,540,1.0]],push:0.025,draw:(cx,tt)=>{
      ag_label(cx,960,178,"Keeping and deleting",{align:"center",a:ag_in(tt,T.keeping-0.3,0.4)});
      cm_pillAt(cx,960,238,"the team decides both",tt,T.decisions-0.1,null,{size:28,col:AG.blue});
      const x0=150,P=54,ty=388,per=1.7,run=tt-T.deletes,on=run>=0,n=on?Math.floor(run/per):0,f=on?(run-n*per)/per:0;
      const fall=on?clamp(f/0.45,0,1):0,slide=on?ag_sine(clamp((f-0.3)/0.4,0,1)):0,inA=on?ag_in(f,0.55,0.3):0;
      for(let i=0;i<=30;i++){const appear=ag_in(tt,0.15+i*0.03,0.3);if(i===30&&!on)continue;
        let x=x0+(i-(i>0?slide:0))*P,y=ty,a=appear;
        if(i===0&&on){y=ty+ag_sine(fall)*150;a*=1-ag_in(fall,0.5,0.45);}
        if(i===30)a=inA;
        cm_tile(cx,x,y,a);}
      // the bracket: thirty days
      const ba=ag_in(tt,T.thirty-0.2,0.4);if(ba>0){cx.save();cx.globalAlpha*=ba;cx.strokeStyle=rgba(AG.blue,0.7);cx.lineWidth=3;cx.lineCap="round";
        cx.beginPath();cx.moveTo(x0,368);cx.lineTo(x0,352);cx.lineTo(x0+29*P+44,352);cx.lineTo(x0+29*P+44,368);cx.stroke();cx.restore();
        ag_T(cx,"Kept 30 days",x0+(29*P+44)/2,334,{w:700,size:28,align:"center",col:AG.blue,a:ba});}
      const bna=ag_in(tt,T.job-0.3,0.4);if(bna>0){cx.save();cx.globalAlpha*=bna;cm_bin(cx,172,600,76,rgba(AG.mut,0.95),on?ag_io(f,0.0,0.5,0.15):0);cx.restore();}
      cm_script(cx,280,540,"Scheduled job","deletes sessions after 30 days",{a:ag_in(tt,T.job-0.3,0.4),k:Math.min(1,ag_spr(tt,T.job-0.3,0.5)),turn:Math.max(0,tt-T.job)*0.4,glow:on?ag_io(f,0.0,0.5,0.15)*0.8:0});}},
    // an entry with a date to check it again: the date comes, its owner checks it, the next date is set and its history says so; a
    // proposal that names a student is turned down
    {at:c.again-0.4,place:"cmBoard",cut:true,keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const ea=ag_in(tt,c.again-0.3,0.4),chk=ag_in(tt,T.ownerDoes+0.3,0.5);
      const rows=[["Owner","Mei Tanaka, registrar's office",ag_in(tt,T.date-0.7,0.4)],["Check again","1 November 2026",ag_in(tt,T.date-0.1,0.4),AG.blue,"1 March 2027",chk],
        ["History","15 April 2026 · approved by Mei Tanaka",ag_in(tt,T.date+0.2,0.4)],[null,"2 November 2026 · checked by Mei Tanaka",ag_in(tt,T.ownerDoes+0.4,0.4)]];
      cm_entry(cx,100,230,820,{lesson:CM_CENSUS,rows},{a:ea,k:Math.min(1,ag_spr(tt,c.again-0.3,0.5)),hl:3,hlA:ag_in(tt,T.hist-0.2,0.4),hlCol:AG.blue});
      cm_stamp(cx,760,568,"Checked",tt,T.ownerDoes+0.1,{col:AG.green,size:28});
      const pa=ag_in(tt,T.namesNo-0.7,0.4);
      cm_entry(cx,1000,230,820,{lesson:"Student 20481 is counted twice.",rows:[["Learned in","A session, 3 November 2026"]]},{kind:"proposed",a:pa,k:Math.min(1,ag_spr(tt,T.namesNo-0.7,0.5))});
      cm_stamp(cx,1660,288,"Turned down",tt,T.namesNo+0.2,{col:AG.amber,size:28});
      cm_pillAt(cx,1410,548,"names a student",tt,T.namesNo+0.4,null,{icon:"warn",col:AG.amber,size:28});}},
    // the first thought: delete the chat the line came from; it deletes nothing of the line, as the docs say
    {at:c.traps-0.4,place:"cmBoard",cut:true,keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const dq=ag_sine(clamp((tt-T.delChat-0.1)/0.8,0,1)),sa=ag_in(tt,c.traps-0.3,0.4)*(1-ag_in(tt,T.delChat+0.4,0.5));
      if(sa>0){cx.save();cx.globalAlpha*=sa;cx.translate(0,dq*90);cm_session(cx,100,250,720,220,{date:"12 May 2026",lines:["For exam rooms, count only","students on campus."]});cx.restore();}
      cm_pillAt(cx,460,200,"delete the chat?",tt,T.first-0.1,T.delChat+0.6,{size:28});
      const bna=1-ag_in(tt,T.docs-0.8,0.4);if(bna>0){cx.save();cx.globalAlpha*=bna;cm_bin(cx,460,560,84,rgba(AG.mut,0.95),ag_io(tt,T.delChat-0.1,T.delChat+0.9,0.3));cx.restore();}
      cm_file(cx,1430,760,{cards:cm_cards({glow:k=>k===CM_WRONG?AG.amber:null,glowA:k=>ag_in(tt,T.delNothing-0.2,0.4)})});
      cm_pillAt(cx,1430,300,"still in the team's memory",tt,T.delNothing,null,{icon:"warn",col:AG.amber,size:28});
      const qa=ag_in(tt,T.docs-0.4,0.4);if(qa>0)cm_quote(cx,100,600,860,CM_DOCS_Q,"Databricks docs \u00b7 Agent sessions \u00b7 beta",{a:qa,k:Math.min(1,ag_spr(tt,T.docs-0.4,0.5))});}},
    // the sync that copies skills to the platform never deletes one
    {at:c.sync-0.4,place:"cmBoard",cut:true,keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      cm_repo(cx,40,220,700,CM_SKILLS.map((n,i)=>({name:"skills/"+n+"/",folder:1,strike:i===2?1:0,note:i===2?"deleted":null,noteCol:AG.amber,col:i===2?AG.amber:null})),{nameW:470});
      const sa=ag_in(tt,T.syncW-0.3,0.4);
      cm_script(cx,800,330,"Skill sync","copies, never deletes",{a:sa,k:Math.min(1,ag_spr(tt,T.syncW-0.3,0.5)),turn:Math.max(0,tt-T.syncW)*0.5,glow:ag_io(tt,T.neverDel-0.3,T.neverDel+1.4,0.4)});
      cm_arrow(cx,[744,392,760,392,776,392,796,392],ag_in(tt,T.syncW-0.1,0.4),{col:AG.blue,lw:3.5,head:12});
      cm_arrow(cx,[1234,392,1250,392,1266,392,1286,392],ag_in(tt,T.syncW+0.3,0.4),{col:AG.blue,lw:3.5,head:12});
      const za=ag_in(tt,T.syncW,0.4);cm_zone(cx,1300,170,580,520,"Unity Gateway skills · beta",{a:za});
      CM_SKILLS.forEach((n,i)=>{const g=i===2?ag_in(tt,T.neverDel,0.4):0;cx.save();cx.globalAlpha*=za;cm_index(cx,1332,260+i*76,516,56,{text:n,glow:g>0?AG.amber:null,glowA:g});cx.restore();});
      cm_pillAt(cx,1590,560,"still on the platform",tt,T.neverDel+0.2,null,{icon:"warn",col:AG.amber,size:28});}},
    // delete where it's kept: the line's file, in a pull request that says why; its entry, at the next load; the record stays
    {at:c.where-0.4,place:"cmBoard",cut:true,keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const pa=ag_in(tt,T.whereW-0.2,0.4),fl=ag_in(tt,T.file-0.2,0.4);
      cm_pr(cx,80,150,900,{title:"Delete: Count only students on campus",by:"Opened by Yusuf Demir",files:[["memory/entries/campus-only.md",1,fl>0?mix(AG.ink,AG.amber,fl):null]],
        rows:[{text:"Why: a merge dropped “For exam rooms”",state:"no",a:ag_in(tt,T.why-0.2,0.4)},{text:"Approved by Mei Tanaka",state:"wait",tick:ag_in(tt,T.why+0.9,0.35),a:ag_in(tt,T.why+0.5,0.4)}],
        a:pa,k:Math.min(1,ag_spr(tt,T.whereW-0.2,0.5))});
      const la=ag_in(tt,T.entry-0.4,0.4);
      cm_script(cx,1480,150,"Next load","the approved files",{a:la,k:Math.min(1,ag_spr(tt,T.entry-0.4,0.5)),turn:Math.max(0,tt-T.next)*0.5,glow:ag_io(tt,T.next-0.3,T.next+1.4,0.4)});
      cm_arrow(cx,[984,222,1150,222,1300,214,1476,214],ag_in(tt,T.entry-0.2,0.5),{col:AG.blue,lw:3.5,head:12});
      cm_arrow(cx,[1530,280,1500,340,1380,380,1294,382],ag_in(tt,T.next-0.2,0.4),{col:AG.blue,lw:3.5,head:12});
      const gone=ag_sine(clamp((tt-T.next-0.2)/1.2,0,1));
      cm_file(cx,1440,780,{cards:cm_cards({each:k=>k===CM_WRONG?{a:1-gone,strike:ag_in(tt,T.next-0.3,0.4),glow:AG.amber,glowA:1}:{}})});
      const ra=ag_in(tt,T.rec-0.3,0.4);if(ra>0)cm_history(cx,80,530,900,CM_RECORD.map((r,i)=>[r[0],r[1],ag_in(tt,[T.added,T.deleted,T.whyR][i]-0.2,0.4)]),{kick:"Record",a:ra,k:Math.min(1,ag_spr(tt,T.rec-0.3,0.5))});
      cm_pillAt(cx,1500,714,"no agent reads it again",tt,T.noAgent-0.1,null,{size:28});}}]);
  CM_KICK(ctx,1);});

/* ---------------------------------------------------------------- 6 · What the team knows */
scene("close",(ctx,S,t,sc)=>{const c=sc.cues,T=cm_once(sc,"T",()=>({
    asks:wAt(sc,"again","asks again"),
    answers:wAt(sc,"answer","answers"),evidence:wAt(sc,"answer","with its evidence"),census:wAt(sc,"answer","census-day count"),each:wAt(sc,"answer","each entry"),whoA:wAt(sc,"answer","who approved"),
    every:wAt(sc,"library","every student"),online:wAt(sc,"library","online or on campus"),
    everyAgent:wAt(sc,"same","Every agent"),newcomer:wAt(sc,"same","every newcomer"),knows:wAt(sc,"same","what the team knows"),
    readsW:wAt(sc,"began","what an agent reads"),nine:wAt(sc,"began","Nine films"),
    longer:wAt(sc,"road","a longer road"),helps:wAt(sc,"road","helps one person"),beside:wAt(sc,"road","works beside"),
    nextW:wAt(sc,"next","Next")}));
  const end=c.breath,L=[1,2,3,4,5,6,7,8,9].map(i=>c["l"+i]);
  ag_shots(ctx,S,t,sc.dur,[
    // back in Planning: Lucía asks again
    {at:0,place:"cmLab",keys:[[0,1000,530,1.03]],push:0.02,draw:(cx,tt)=>{
      cm_lucia(cx,S,tt,{think:0.2+0.4*ag_io(tt,T.asks,T.asks+1.6,0.4),smile:0.35});
      cm_cardAt(cx,110,88,600,{kick:"From the library",title:"How many students are there?",sub:"To buy next year's e-books"},tt,T.asks-0.5,null,{kickCol:AG.kick});
      cm_file(cx,CM_F.x,CM_F.y,{cards:cm_kept({who:k=>1})});
      const A=CM_DESK.agent;cm_fileReads(cx,tt,ag_sine(clamp((tt-T.asks)/1.0,0,1)),A[0],A[1],A[2]);}},
    // her agent's answer, with its evidence: the census-day count, and each entry it read, with who approved it
    {at:c.answer-0.3,place:"cmBoard",cut:true,keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
      cm_agent(cx,250,700,64,tt,{think:0.3,core:0.85,label:"Lucía's agent",floor:800});
      const open=ag_sine(clamp((tt-T.evidence)/1.3,0,1));
      const ev=ag_evidence(cx,80,110,760,{kick:"Her agent's answer",title:"18,412 students"},[{kick:"Data",title:"The census-day count",col:AG.orange},
        {kick:"Team memory",title:"5 entries, each with who approved it",col:AG.blue}],{open,side:"below",ew:360,edge:AG.green,a:ag_in(tt,c.answer-0.2,0.4),kickCol:AG.violet}),mi=ev.items[1].to;
      const slots=cm_file(cx,1380,790,{cards:cm_kept({who:k=>ag_in(tt,T.whoA+k*0.12,0.4)})});
      cm_reads(cx,mi.x+mi.w+6,mi.y+mi.h*0.45,slots[0].x-8,slots[0].y+40,ag_sine(clamp((tt-T.each+0.2)/0.9,0,1)),{t:tt,bend:-20});}},
    // the library buys e-books for every student, online or on campus
    {at:c.library-0.4,place:"cmBoard",cut:true,keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      cm_people(cx,260,380,{join:1});
      cm_library(cx,1060,300,620,{count:"For all 18,412 students",col:AG.green,note:ag_in(tt,T.online-0.2,0.3)>0?"online or on campus":null,k:Math.min(1,ag_spr(tt,c.library-0.4,0.5)),a:ag_in(tt,c.library-0.4,0.3)});}},
    // every agent, and every newcomer, starts from what the team knows
    {at:c.same-0.4,place:"cmBoard",cut:true,keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      cm_file(cx,960,560,{cards:cm_kept({who:k=>1})});
      [["Jun's agent",360],["Clara's agent",660],["Lucía's agent",960],["Noor's agent",1260],["Sam's agent",1560]].forEach((p,i)=>{const aa=ag_in(tt,T.everyAgent-0.3+i*0.12,0.4);
        cm_agent(cx,p[1],780,44,tt,{ph:i*1.3,think:0.2,core:0.75,label:p[0],a:aa,floor:872});
        cm_reads(cx,960+(i-2)*110,652,p[1],732,ag_sine(clamp((tt-T.everyAgent-i*0.12)/0.9,0,1))*aa,{t:tt,bend:0});});
      cm_pillAt(cx,960,108,"what the team knows, approved by people",tt,T.knows-0.1,null,{icon:"tick",col:AG.green,size:28});}},
    // where the series began: what an agent reads; nine films, nine lessons; then the whole road, from further off
    {at:c.began-0.4,place:"cmBoard",cut:true,keys:[[0,960,540,1.0]],push:0,draw:(cx,tt)=>{const f=1-ag_in(tt,end+0.4,0.8);if(f<=0)return;cx.save();cx.globalAlpha*=f;
      const ca=ag_in(tt,c.began-0.4,0.4)*(1-ag_in(tt,T.nine-0.2,0.5));
      if(ca>0){cm_context(cx,{t:tt,memory:1,gov:1,a:ca});ag_label(cx,960,262,"What an agent reads",{align:"center",a:ca*ag_in(tt,T.readsW-0.3,0.4)});}
      // the nine lessons, each as it's said; on "a longer road", the grid goes to its shelf
      const u=ag_sine(clamp((tt-T.longer+0.4)/1.8,0,1)),G=cm_gridBox(cx),b=cm_shelf(1),s=Math.min((b.w-48)/G.w,(b.h-132)/G.h),
        tx=b.x+24+((b.w-48)-G.w*s)/2,ty=b.y+112;
      cm_shelves(cx,{a:ag_in(tt,T.longer+0.3,0.6),skip2:true,shelfA:i=>i===1?ag_in(tt,T.longer+0.6,0.6):ag_in(tt,T.longer+0.9+i*0.2,0.5),lit:2,litA:ag_in(tt,T.nextW-0.2,0.5)});
      cx.save();const k=lerp(1,s,u);cx.translate(lerp(0,tx-G.x*s,u),lerp(0,ty-G.y*s,u));cx.scale(k,k);
      cm_lessons(cx,{show:i=>clamp((tt-L[i]+0.15)/1.0,0,1),deco:u>0,slots:ag_in(tt,T.nine+0.1,0.5)*(1-u)});cx.restore();
      ag_T(cx,"an agent that helps one person",84,750,{w:600,size:28,col:AG.mut,a:ag_in(tt,T.helps-0.2,0.4)});
      ag_T(cx,"one that works beside the team",1836,750,{w:600,size:28,col:AG.mut,align:"right",a:ag_in(tt,T.beside-0.2,0.4)});
      const b3=cm_shelf(2);cm_pillAt(cx,b3.x+b3.w/2,256,"Next",tt,T.nextW-0.1,null,{size:28,col:AG.blue});
      cx.restore();}}]);
  // the end card: the film's lesson, and the next series named as the voice says it
  ag_end(ctx,S,t,end,"Context and memory, governed",null,"Film 9 of 9","Agents at work on data");
  const a1=ag_in(t,end+0.6,0.9);if(a1>0){setScreen(ctx,S);ag_T(ctx,"The team's context and memory are governed assets,",960,296,{w:700,size:48,align:"center",a:a1});
    ag_T(ctx,"not private notes.",960,364,{w:700,size:48,align:"center",a:a1});}
  const na=ag_in(t,end+1.2,0.6);if(na>0){setScreen(ctx,S);ag_T(ctx,"Next: From helper to colleague",960,790,{w:600,size:30,align:"center",col:AG.mut,a:na});}
});

// chapters that open on a cut: each shows the board the chapter before ends on, which a crossfade would show twice
ag_cutInto(["reads","code","memory","keep","close"]);
