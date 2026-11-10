/* ===== Context and memory, governed: the scenes =====
   Six chapters, each timed to its narration: wAt(sc, "line", "word") is the moment a word is said. The places are painted once
   (world.js); what moves is drawn live in the shots of ag_shots. On one wall the camera glides on from shot to shot and only what
   changes fades; a new picture on the wall that names what the last one showed somewhere else is a later moment (later:true), so
   what was there leaves before it comes in, and a thing both show stays put, or slides. Between Lucía's corner and the quiet wall,
   shots that show the same people or words come in on a cut (cut:true), so nothing shows twice. The title card ends chapter 1, the
   end card chapter 6. Where the voice names a tool, its official logo stands beside the name (govern.js). */

const cm_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
const CM_KICK=(x,a)=>ag_kicker(x,"2.9","Context and memory, governed",{a});
// the team's memory on Lucía's wall: what its agents learned in their sessions, as the platform's memory step kept it (no one's
// tick: nobody approves a line), then the campus line. A card's title names its line; the line itself is in the entry, pulled up
const CM_F={x:1440,y:560};
const CM_MEM=["Read the glossary first","Show the count reported","Name units by their code","Totals by faculty"];
const CM_WRONG=4,CM_CAMPUS_T="Units taught on campus only",CM_EXAM_T="Room bookings: on campus",CM_ROOMS_T="Count each unit once",CM_NEW_T="Write terms as 2027-S1";
// the file's cards, the campus line last: o.appear(k), o.glow(k) (a colour or null), o.glowA(k), o.lift(k) (px), o.flag(k), o.each(k)
// (any other fields); o.without drops the campus line
function cm_cards(o){o=o||{};const out=[];CM_MEM.concat([CM_CAMPUS_T]).forEach((c,k)=>{if(o.without&&k===CM_WRONG)return;
  out.push(Object.assign({text:c,a:o.appear?o.appear(k):1,tick:0,glow:o.glow?o.glow(k):null,glowA:o.glowA?o.glowA(k):1,lift:o.lift?o.lift(k):0,flag:o.flag?o.flag(k):0},
    o.each?o.each(k):{}));});return out;}
// the file as the platform keeps it now: the four, and a line it kept since
function cm_kept(o){o=o||{};return CM_MEM.concat([CM_NEW_T]).map((c,k)=>({text:c,a:o.appear?o.appear(k):1,tick:0,glow:o.glow?o.glow(k):null,glowA:o.glowA?o.glowA(k):1}));}
// where the agent's reading line leaves the file (under the left end of its lower ledge) and meets the sphere
function cm_fileReads(c,tt,u,ax,ay,ar,o){const x0=CM_F.x-(CM_TC.per*(CM_TC.w+CM_TC.gap)+40)/2;return cm_reads(c,x0+14,CM_F.y+34,ax-ar*0.62,ay-ar*0.72,u,Object.assign({t:tt,bend:10},o||{}));}
// the campus line as an entry, pulled up: its line, and its fields. No one approved it: the platform kept it
const CM_LINE="Count only units taught on campus.";
const CM_CAMPUS={lesson:CM_LINE,rows:[["Learned in","A session on room bookings, 14 July 2026"],["Kept by","The platform's memory step, 15 July 2026"],["History","none"]]};
// the line as the agent read it, in its evidence and in the memory's tier (no full stop: a title)
const CM_LINE_T="Count only units taught on campus";

/* ---------------------------------------------------------------- 1 · Lucía's first job */
// the campus line's entry, pulled up, as it is and as it was kept in July: may 0..1 brings in "For room bookings, ", drop 0..1 lets
// those words fall away, and the rest moves back as "Count only units taught on campus."
function cm_campusCard(c,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return null;const may=o.may||0,drop=o.drop||0,rows=o.rows||CM_CAMPUS.rows;
  const bb=cm_entry(c,x,y,w,{lesson:CM_LINE,rows},{measure:true});
  c.save();c.globalAlpha*=a;if(o.k!=null)ag_about(c,x+w/2,y+bb.h/2,lerp(0.7,1,o.k));
  cm_entry(c,x,y,w,{lesson:CM_LINE,rows},{lessonA:0,edge:o.edge,edgeA:o.edgeA});
  const F={w:600,size:30},pre="For room bookings, ",rest="count only units taught on campus.",pw=ag_tw(c,pre,F),ly=bb.ly,lx=bb.lx;
  // first the rest moves over to make room, then the three words come in; dropping, they fall and fade first, then the rest moves back
  const room=ag_sine(clamp(may/0.55,0,1)),preA=clamp((may-0.5)/0.5,0,1);
  if(preA>0&&drop<0.4){const dq=clamp(drop/0.35,0,1),dy=ag_eo(dq)*12;c.save();c.globalAlpha*=preA*(1-ag_eo(dq));
    ag_T(c,pre,lx,ly+dy,{w:600,size:30,col:mix(AG.green,AG.amber,clamp(drop/0.15,0,1))});c.restore();}
  const sx=lx+pw*room*(1-ag_sine(clamp((drop-0.35)/0.65,0,1)));const cap=may<=0?1:ag_in(drop,0.75,0.25);
  if(cap<1){c.save();c.globalAlpha*=1-cap;ag_T(c,rest,sx,ly,F);c.restore();}
  if(cap>0){c.save();c.globalAlpha*=cap;ag_T(c,CM_LINE,sx,ly,F);c.restore();}
  c.restore();return bb;}

// her agent's draft and its evidence, the same in the two shots that show it: the data it read, and the line in the team's memory
function cm_why(cx,tt,T){const open=ag_sine(clamp((tt-T.evidence)/1.3,0,1)),ea=ag_in(tt,T.evidence-0.5,0.4)*(1-ag_in(tt,T.glossaryW-0.9,0.4));
  return ag_evidence(cx,80,110,760,{kick:"Her agent's draft",title:"1,142 units"},[{kick:"Data",title:"Unit offerings, on campus only",col:AG.orange},
    {kick:"Team memory",title:CM_LINE_T,col:AG.blue}],{open,side:"below",ew:360,a:ea,kickCol:AG.violet});}

scene("first",(ctx,S,t,sc)=>{const c=sc.cues,T=cm_once(sc,"T",()=>({
    lucia:wAt(sc,"place","Lucía"),monday:wAt(sc,"place","Monday"),
    agent:wAt(sc,"memory","Her agent"),mem:wAt(sc,"memory","team's memory"),learned:wAt(sc,"memory","learned"),kept:wAt(sc,"memory","kept by the platform"),
    library:wAt(sc,"job","library"),which:wAt(sc,"job","which units"),ebooks:wAt(sc,"job","e-books"),
    said:wAt(sc,"draft","one thousand"),stopped:wAt(sc,"check","stopped"),sys:wAt(sc,"check","student system"),n1236:wAt(sc,"check","one thousand"),
    n94:wAt(sc,"online","ninety-four"),onlyOnline:wAt(sc,"online","taught only online"),
    would:wAt(sc,"books","would have"),none:wAt(sc,"books","no e-books"),veryOnes:wAt(sc,"books","very ones"),comeIn:wAt(sc,"books","come in"),
    evidence:wAt(sc,"line","evidence"),oneLine:wAt(sc,"line","one line"),inMem:wAt(sc,"line","team's memory"),count:wAt(sc,"line","Count only"),
    inJuly:wAt(sc,"may","In July"),keptAs:wAt(sc,"may","kept as"),rooms:wAt(sc,"may","For room bookings"),right:wAt(sc,"may","Right, for rooms"),
    lastWeek:wAt(sc,"lost","last week"),threeWords:wAt(sc,"lost","three words"),nobody:wAt(sc,"lost","nobody"),
    glossaryW:wAt(sc,"glossary","glossary"),offering:wAt(sc,"glossary","unit offering"),both:wAt(sc,"glossary","online or both"),
    nothing:wAt(sc,"still","Nothing told"),first:wAt(sc,"still","which comes first"),change:wAt(sc,"still","Something"),
    order:wAt(sc,"govern","set an order"),
    first1:wAt(sc,"governed","First"),defs:wAt(sc,"governed","definitions"),rules:wAt(sc,"governed","data rules"),owner:wAt(sc,"governed","an owner"),
    second:wAt(sc,"second","Second"),platform:wAt(sc,"second","the platform keeps"),noApprove:wAt(sc,"second","nobody approves"),
    disagree:wAt(sc,"wins","disagree"),wins:wAt(sc,"wins","the definition wins"),flags:wAt(sc,"wins","flags the line"),
    nowW:wAt(sc,"now","Now"),lists:wAt(sc,"now","lists all"),says:wAt(sc,"now","says which definition"),
    allW:wAt(sc,"all","every one"),onl:wAt(sc,"all","online or on campus"),
    forData:wAt(sc,"data","for data"),helps:wAt(sc,"data","memory helps"),decides:wAt(sc,"data","governed decides"),wrong:wAt(sc,"data","a wrong line"),cant:wAt(sc,"data","can't change")}));
  const end=c.breath;
  ag_shots(ctx,S,t,sc.dur,[
    // Planning, today: Lucía at her desk; her agent; the team's memory on the wall, kept by the platform, which it reads
    {at:0,place:"cmLab",keys:[[0,960,540,1.0],[T.mem-0.6,1000,530,1.03]],d:2.6,draw:(cx,tt)=>{
      cm_lucia(cx,S,tt,{agent:ag_in(tt,T.agent-0.2,0.6),think:0.25*ag_in(tt,T.learned,1.2),cal:ag_in(tt,T.monday-0.1,0.4)});
      const fa=ag_in(tt,T.mem-0.3,0.6);
      cm_file(cx,CM_F.x,CM_F.y,{a:fa,mark:ag_in(tt,T.kept-0.1,0.5),markText:"kept by the platform",cards:cm_cards({appear:k=>ag_in(tt,T.learned+k*0.16,0.35)})});
      const A=CM_DESK.agent;cm_fileReads(cx,tt,ag_sine(clamp((tt-(T.learned+0.6))/1.2,0,1))*fa,A[0],A[1],A[2]);
      cm_pillAt(cx,CM_DESK.lucia[0],258,"Lucía Ortega · Planning",tt,T.lucia-0.1,null);
      cm_scr(cx,S,()=>cm_tag(cx,CM_UNI,ag_in(tt,0.5,0.6)));}},
    // the library's question, her agent's draft, and the plain check against the student system
    {at:T.library-0.4,place:"cmBoard",cut:true,keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      cm_cardAt(cx,110,130,640,{kick:"From the library",title:"Which units run next semester?",sub:"To buy their e-books"},tt,T.library-0.4,null,{kickCol:AG.kick});
      cm_agent(cx,430,640,78,tt,{think:0.2+0.6*ag_io(tt,T.which,T.said+0.4,0.6),core:0.8,label:"Lucía's agent",floor:760});
      const dA=ag_in(tt,T.said-0.3,0.4),dk=Math.min(1,ag_spr(tt,T.said-0.3,0.5));
      if(dA>0){const b=ag_textCard(cx,1200,130,600,{kick:"Her agent's draft",title:"1,142 units"},{a:dA,k:dk,kickCol:AG.violet});cm_dash(cx,1200,130,600,b.h,22,AG.mut,dA*(1-ag_in(tt,T.stopped,0.4)));}
      const turn=clamp((tt-T.stopped+0.6)/2,0,1)*1.5;
      cm_script(cx,1200,360,"Plain check","against the student system",{a:ag_in(tt,T.stopped-0.7,0.4),k:Math.min(1,ag_spr(tt,T.stopped-0.7,0.5)),turn,glow:ag_io(tt,T.stopped-0.3,T.n1236+1.2,0.3)});
      cm_cardAt(cx,1200,560,600,{kick:"Student system",title:"1,236 units",sub:"Running in Semester 1, 2027"},tt,T.sys-0.2,null,{kickCol:AG.orange,edge:AG.orange});
      cm_arrow(cx,[1500,555,1500,520,1500,505,1500,490],ag_in(tt,T.sys+0.1,0.5),{col:AG.orange,lw:3.5,head:12});
      cm_arrow(cx,[1500,360,1500,330,1500,310,1500,296],ag_in(tt,T.stopped-0.2,0.5),{col:AG.blue,lw:3.5,head:12});
      cm_stamp(cx,1660,236,"Stopped",tt,T.stopped+0.1,{col:AG.amber});
      // the difference: 94 left out
      cm_pillAt(cx,860,400,"94 left out",tt,T.n94-0.2,null,{col:AG.amber,icon:"warn"});}},
    // which they are: the 94 taught only online, and what the library would have bought
    {later:true,at:T.onlyOnline-0.5,place:"cmBoard",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const out=ag_in(tt,T.onlyOnline,0.8);cm_people(cx,200,320,{a:ag_in(tt,T.onlyOnline-0.5,0.4),out,ring:ag_in(tt,T.veryOnes,0.6)});
      cm_pillAt(cx,350,500,"taught on campus",tt,T.onlyOnline-0.3,null);
      cm_pillAt(cx,760,540,"94 taught only online",tt,T.onlyOnline+0.1,null,{col:AG.amber});
      const la=ag_in(tt,T.would-0.2,0.4);if(la>0)cm_library(cx,1150,250,620,{a:la,k:Math.min(1,ag_spr(tt,T.would-0.2,0.5)),count:"For 1,142 units",col:AG.amber,note:ag_in(tt,T.none,0.3)>0?"None for the 94":null});
      cm_pillAt(cx,760,640,"can't come in for a book",tt,T.comeIn-0.2,null,{col:AG.amber});}},
    // why: her agent's evidence, one line in the team's memory; on "Count only", its card comes up out of the file
    {later:true,at:T.evidence-0.6,place:"cmBoard",keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
      cm_agent(cx,250,700,64,tt,{think:0.3,core:0.8,label:"Lucía's agent",floor:800});
      const ev=cm_why(cx,tt,T),mi=ev.items[1].to;
      const lift=90*ag_sine(clamp((tt-T.count+0.7)/0.6,0,1)),gl=ag_in(tt,T.inMem-0.2,0.4);
      const slots=cm_file(cx,1380,700,{a:ag_in(tt,T.oneLine-0.4,0.5),cards:cm_cards({glow:k=>k===CM_WRONG&&gl>0?AG.amber:null,glowA:k=>gl,lift:k=>k===CM_WRONG?lift:0})});
      cm_reads(cx,mi.x+mi.w/2,mi.y+mi.h+6,slots[CM_WRONG].x-8,slots[CM_WRONG].y+40,ag_sine(clamp((tt-T.inMem+0.3)/0.9,0,1)),{t:tt,bend:40});}},
    // the entry, pulled up: as it is, then as it was kept in July, then the three words falling away. Lucía's agent and its evidence
    // stay where they are as the camera glides on; the file leaves before the entry comes in
    {at:T.count-0.1,place:"cmBoard",keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
      cm_agent(cx,250,700,64,tt,{think:0.3,core:0.8,label:"Lucía's agent",floor:800});
      const ev=cm_why(cx,tt,T),mi=ev.items[1].to,ea=1-ag_in(tt,T.glossaryW-0.9,0.4);
      const pa=ag_in(tt,T.count+0.4,0.4),may=ag_in(tt,T.keptAs-0.2,0.6),drop=clamp((tt-T.threeWords+0.3)/1.4,0,1);
      const rows=[CM_CAMPUS.rows[0],CM_CAMPUS.rows[1],["History","none",1,ag_in(tt,T.nobody,0.4)>0?AG.amber:null]];
      const b=cm_campusCard(cx,920,130,920,{a:pa*ea,k:Math.min(1,ag_spr(tt,T.count+0.4,0.5)),may:may*(drop>=1?0:1)+(drop>=1?1:0),drop,rows,edge:ag_in(tt,T.lastWeek,0.4)>0?AG.amber:null,edgeA:ag_in(tt,T.lastWeek,0.5)});
      cm_reads(cx,mi.x+mi.w+6,mi.y+mi.h*0.45,912,262,ag_sine(clamp((tt-T.count-0.5)/0.7,0,1))*ea,{t:tt,bend:-30});
      if(b){cm_pillAt(cx,1380,b.y+b.h+46,"right, for room bookings",tt,T.right-0.1,T.lastWeek-0.5,{col:AG.green,icon:"tick"});
        cm_pillAt(cx,1380,b.y+b.h+46,"changed last week",tt,T.lastWeek,T.glossaryW-0.9,{col:AG.amber,icon:"warn"});}}},
    // yet the glossary already said what a unit offering is; nothing told the agent which comes first (a later moment on the wall: the
    // entry and the evidence leave before the glossary comes)
    {later:true,at:T.glossaryW-0.5,place:"cmBoard",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const ga=ag_in(tt,T.glossaryW-0.3,0.4);
      const g=cm_term(cx,100,150,800,{a:ga,k:Math.min(1,ag_spr(tt,T.glossaryW-0.3,0.5)),hl:ag_in(tt,T.both-0.3,0.4)});
      const la=ag_in(tt,T.glossaryW+0.3,0.4);
      const e=cm_entry(cx,1020,150,800,{lesson:CM_LINE,rows:[CM_CAMPUS.rows[1]]},{kick:"Team memory",a:la,k:Math.min(1,ag_spr(tt,T.glossaryW+0.3,0.5)),edge:AG.amber,edgeA:0.6});
      const aa=ag_in(tt,T.nothing-0.5,0.4),pulse=0.6+0.4*Math.sin((tt-T.change)*4)*ag_io(tt,T.change,T.change+1.8,0.3);
      cm_agent(cx,960,720,60,tt,{a:aa,think:0.25+0.4*ag_io(tt,T.first-0.3,T.change+1.5,0.5),core:0.75,label:"Lucía's agent",floor:820});
      cm_reads(cx,920,670,g.x+g.w*0.6,g.y+g.h+6,ag_sine(clamp((tt-T.nothing+0.2)/0.8,0,1))*aa,{t:tt,bend:-30});
      cm_reads(cx,1000,670,e.x+e.w*0.4,e.y+e.h+6,ag_sine(clamp((tt-T.nothing)/0.8,0,1))*aa,{t:tt,bend:-30});
      const pb=cm_pillAt(cx,960,560,"which comes first?",tt,T.first-0.1,null,{col:AG.amber,icon:"warn"});
      if(pb&&tt>T.change){cx.save();cx.globalAlpha*=0.5*(pulse-0.2)*ag_io(tt,T.change,T.change+1.8,0.3);cx.strokeStyle=rgba(AG.amber,0.9);cx.lineWidth=3;rr(cx,pb.x-6,pb.y-6,pb.w+12,pb.h+12,(pb.h+12)/2);cx.stroke();cx.restore();}}},
    // so the team set an order: first what's governed, each with an owner who reviews every change; second the memory, kept by the
    // platform with no one approving each line; when the two disagree, the definition wins and the agent flags the line
    {later:true,at:T.order-0.6,place:"cmBoard",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      ag_label(cx,960,112,"The team's order",{align:"center",a:ag_in(tt,T.order-0.3,0.4)});
      const lineA=ag_in(tt,T.disagree-0.4,0.4);
      const O=cm_order(cx,460,150,1300,{a1:ag_in(tt,T.first1-0.3,0.4),k1:Math.min(1,ag_spr(tt,T.first1-0.3,0.5)),items:i=>ag_in(tt,[T.defs,T.rules][i]-0.2,0.4),rev:ag_in(tt,T.owner-0.1,0.4),
        a2:ag_in(tt,T.second-0.3,0.4),k2:Math.min(1,ag_spr(tt,T.second-0.3,0.5)),kept:ag_in(tt,T.platform-0.2,0.4),noOne:ag_in(tt,T.noApprove-0.1,0.4),
        line:{text:CM_LINE_T,a:lineA,glow:ag_in(tt,T.disagree,0.4),flag:ag_in(tt,T.flags,0.4)},win:ag_io(tt,T.wins-0.2,T.wins+2.4,0.4)});
      const aa=ag_in(tt,T.first1-0.4,0.4);cm_agent(cx,220,500,62,tt,{a:aa,think:0.3,core:0.8,label:"Lucía's agent",floor:600});
      cm_reads(cx,268,460,O.t1.x-6,O.t1.y+O.t1.h/2,ag_sine(clamp((tt-T.first1)/0.8,0,1))*aa,{t:tt,bend:-20});
      cm_reads(cx,268,540,O.t2.x-6,O.t2.y+O.t2.h/2,ag_sine(clamp((tt-T.second)/0.8,0,1))*aa,{t:tt,bend:20,col:AG.mut});
      cm_pillAt(cx,1110,720,"the definition wins",tt,T.wins-0.1,null,{col:AG.green,icon:"tick"});}},
    // now: back in Lucía's corner, her agent lists all 1,236 units and says which definition it followed; the line on the wall flagged
    {at:T.nowW-1.4,place:"cmLab",cut:true,keys:[[0,1000,530,1.03],[T.lists-0.2,1000,540,1.06]],d:2.4,draw:(cx,tt)=>{
      cm_lucia(cx,S,tt,{think:0.2,smile:0.45});
      cm_file(cx,CM_F.x,CM_F.y,{cards:cm_cards({flag:k=>k===CM_WRONG?1:0})});
      const A=CM_DESK.agent;cm_fileReads(cx,tt,1,A[0],A[1],A[2]);
      cm_cardAt(cx,110,88,600,{kick:"Her agent's answer",title:"1,236 units",sub:"Followed: Unit offering, in the glossary"},tt,T.lists-0.3,null,{kickCol:AG.violet,edge:AG.green,icon:"tick"});}},
    // the library buys e-books for every one
    {at:T.allW-0.9,place:"cmBoard",cut:true,keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const j=ag_sine(clamp((tt-T.allW)/1.6,0,1));cm_people(cx,260,380,{join:j});
      cm_library(cx,1060,300,620,{count:"For all 1,236 units",col:AG.green,note:ag_in(tt,T.onl-0.2,0.3)>0?"Online or on campus":null,k:Math.min(1,ag_spr(tt,T.allW-0.9,0.5)),a:ag_in(tt,T.allW-0.9,0.3)});}},
    // and for data: memory helps, what's governed decides, so a wrong line can't change an answer
    {later:true,at:T.forData-0.8,place:"cmBoard",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{const f=1-ag_in(tt,end+0.4,0.8);if(f<=0)return;cx.save();cx.globalAlpha*=f;
      const O=cm_order(cx,80,190,1100,{a1:ag_in(tt,T.forData-0.5,0.4),a2:ag_in(tt,T.forData-0.3,0.4),win:ag_in(tt,T.decides-0.1,0.4),
        line:{text:CM_LINE_T,a:ag_in(tt,T.wrong-0.3,0.4),glow:ag_in(tt,T.wrong,0.4),flag:ag_in(tt,T.cant-0.1,0.4)}});
      const aa=ag_in(tt,T.helps-0.6,0.4),ab=ag_textCard(cx,1330,330,500,{kick:"The answer",title:"1,236 units"},{a:aa,k:Math.min(1,ag_spr(tt,T.helps-0.6,0.5)),kickCol:AG.violet,edge:AG.green});
      cm_arrow(cx,[O.t1.x+O.t1.w+6,O.t1.y+O.t1.h/2,1250,O.t1.y+O.t1.h/2,1270,ab.y+ab.h*0.3,1324,ab.y+ab.h*0.3],ag_in(tt,T.decides-0.1,0.5),{col:AG.green,lw:4,head:14});
      cm_arrow(cx,[O.t2.x+O.t2.w+6,O.t2.y+O.t2.h/2,1250,O.t2.y+O.t2.h/2,1270,ab.y+ab.h*0.7,1324,ab.y+ab.h*0.7],ag_in(tt,T.helps-0.1,0.5),{col:AG.blue,lw:3,head:12,dash:[10,10]});
      ag_T(cx,"decides",1256,O.t1.y+O.t1.h/2-24,{w:700,size:28,col:AG.green,align:"center",a:ag_in(tt,T.decides,0.4)});
      ag_T(cx,"helps",1256,O.t2.y+O.t2.h/2+52,{w:700,size:28,col:AG.blue,align:"center",a:ag_in(tt,T.helps,0.4)});
      cm_pillAt(cx,1580,560,"can't change it",tt,T.cant,null,{col:AG.amber,icon:"warn"});
      cx.restore();}}],0.5);
  ag_title(ctx,S,t,c.breath,"Context and memory, governed",null,"FILM 9 OF 9 · AGENTS AT WORK ON DATA");
});

/* ---------------------------------------------------------------- 2 · What an agent reads */
// the five questions any data gets, one a line, in the order the voice asks them
const CM_Q=["owns","may","reviews","kept","gone"];
scene("reads",(ctx,S,t,sc)=>{const c=sc.cues,T=cm_once(sc,"T",()=>({
    reads:wAt(sc,"began","what an agent reads"),code:wAt(sc,"began","code"),meta:wAt(sc,"began","metadata"),skills:wAt(sc,"began","skills"),tools:wAt(sc,"began","tools"),
    memory:wAt(sc,"adds","memory"),shapes:wAt(sc,"data","shapes"),isData:wAt(sc,"data","is data"),gets:wAt(sc,"data","gets what"),
    note:wAt(sc,"chat","A note"),none:wAt(sc,"chat","none of them"),answer:wAt(sc,"context","The team's context"),all5:wAt(sc,"context","all five"),
    four:wAt(sc,"memory","answers four"),noRev:wAt(sc,"memory","no one reviews"),second:wAt(sc,"memory","comes second")}));
  ag_shots(ctx,S,t,sc.dur,[
    // what an agent reads, as Context engineering drew it: each kind of context as it's named, then memory; all of it is data
    {later:true,at:0,place:"cmBoard",keys:[[0,960,540,1.0]],push:0.03,draw:(cx,tt)=>{const at=[T.code,T.meta,T.skills,T.tools];
      cm_context(cx,{t:tt,show:i=>clamp((tt-at[i]+0.15)/1.0,0,1),memory:clamp((tt-T.memory+0.15)/1.0,0,1),gov:clamp((tt-T.gets)/1.2,0,1),
        back:i=>clamp((tt-at[i]-0.75)/1.3,0,1),backMem:clamp((tt-T.memory-0.75)/1.3,0,1),
        think:0.1+0.5*ag_io(tt,T.shapes-0.2,T.isData+0.8,0.5)});
      ag_label(cx,960,262,"What an agent reads",{align:"center",a:ag_in(tt,T.reads-0.2,0.4)*(1-ag_in(tt,T.isData-0.7,0.35))});
      ag_label(cx,960,262,"All of it is data",{align:"center",col:AG.orange,a:ag_in(tt,T.isData-0.2,0.4)});}},
    // the five questions: a column lights as each is asked; a note in a chat answers none; the team's context answers all five; the
    // memory four, with no one reviewing each line, so it comes second (later:true: the cards leave before the table comes, so their
    // names never show twice)
    {later:true,at:c.owns-0.5,place:"cmBoard",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{const q=CM_Q.map(id=>c[id]),nx=j=>j<4?q[j+1]:T.note;
      ag_label(cx,205,172,"What any data gets",{a:ag_in(tt,c.owns-0.5,0.4)});
      const tb=cm_govTable(cx,205,200,{cols:q.map((t0,j)=>ag_io(tt,t0-0.2,nx(j)-0.2,0.3)+0.25*ag_in(tt,nx(j)-0.2,0.3)*(1-ag_in(tt,T.answer,0.5))),
        cells:(i,j)=>i<4?ag_in(tt,T.answer+0.25+j*0.16+i*0.05,0.3):(j===2?0:ag_in(tt,T.four+0.2+j*0.14,0.3)),noCell:(i,j)=>i===4&&j===2?ag_in(tt,T.noRev-0.1,0.4):0,
        rowHl:i=>i===4?ag_io(tt,T.four-0.2,T.second+1.6,0.4):0,
        chat:ag_in(tt,T.note-0.2,0.4)*(1-0.55*ag_in(tt,T.answer,0.6)),chatCell:j=>ag_in(tt,T.none+j*0.12,0.3)});
      cm_pillAt(cx,960,tb.y+tb.h+48,"memory comes second",tt,T.second-0.1,null,{col:AG.blue,size:28});}}]);
  CM_KICK(ctx,1);});

/* ---------------------------------------------------------------- 3 · Context, reviewed like code */
// the team's project, as the example project names its files, and its owners, as CODEOWNERS lists them there
const CM_REPO=[{name:"AGENTS.md",note:"the page for agents"},{name:"skills/",note:"the skills",folder:1},{name:"models/",note:"dbt's descriptions",folder:1,logo:"dbt"},
  {name:"governance/5-data-contracts/",note:"the contracts",folder:1},{name:"CODEOWNERS",note:"who owns each file"}];
const CM_OWN=[["*","jun.park@uni.example"],["/models/marts/planning/_planning__models.yml","planning@uni.example jun.park@uni.example"],["/skills/review-for-governance/","data.governance@uni.example noor@uni.example"]];
// the table agents read on Databricks, as dbt describes it in the example project (models/staging/student_system/)
const CM_TABLE={name:"stg_student_system__unit_offerings",comment:"A unit taught in a semester, on campus, online or both.",col:["delivery_mode","How the unit is taught that semester: on campus, online or both."]};
scene("code",(ctx,S,t,sc)=>{const c=sc.cues,T=cm_once(sc,"T",()=>({
    repo:wAt(sc,"lives","repository"),gh:wAt(sc,"lives","on GitHub"),page:wAt(sc,"lives","the page for agents"),skills:wAt(sc,"lives","the skills"),dbt:wAt(sc,"lives","dbt's descriptions"),contracts:wAt(sc,"lives","the contracts"),
    owner:wAt(sc,"owner","an owner"),list:wAt(sc,"owner","a list"),meta:wAt(sc,"owner","its own metadata"),
    pr:wAt(sc,"pull","pull request"),reviews:wAt(sc,"pull","its owner reviews"),prod:wAt(sc,"pull","production"),second:wAt(sc,"pull","second person's"),
    propose:wAt(sc,"propose","propose"),never:wAt(sc,"propose","never approve"),
    history:wAt(sc,"history","history"),who:wAt(sc,"history","who changed"),why:wAt(sc,"history","and why"),
    gloss:wAt(sc,"glossary","business glossary"),owners:wAt(sc,"glossary","their owners"),gdbx:wAt(sc,"glossary","Databricks"),
    skill:wAt(sc,"copies","A skill"),copies:wAt(sc,"copies","copies each one"),whereFrom:wAt(sc,"copies","where it came from"),
    oneway:wAt(sc,"oneway","one way"),dbx:wAt(sc,"oneway","Databricks"),
    dbtW:wAt(sc,"comments","dbt writes"),uc:wAt(sc,"comments","Unity Catalog"),comments:wAt(sc,"comments","comments"),column:wAt(sc,"comments","column"),
    gw:wAt(sc,"skills","Unity Gateway"),obj:wAt(sc,"object","Unity Catalog object"),sOwner:wAt(sc,"object","an owner"),perm:wAt(sc,"object","permissions"),rec:wAt(sc,"object","a record"),
    nobody:wAt(sc,"nobody","Nobody"),starts:wAt(sc,"nobody","A change starts")}));
  ag_shots(ctx,S,t,sc.dur,[
    // the repository, on GitHub, each thing lit as it's named; at the right, the owners' list, then a change, then its history
    {later:true,at:0,place:"cmBoard",keys:[[0,960,540,1.0]],push:0.025,draw:(cx,tt)=>{const lit=[T.page,T.skills,T.dbt,T.contracts,T.list];
      const rows=CM_REPO.map((r,i)=>Object.assign({},r,{a:i<4?1:ag_in(tt,T.list-0.3,0.4),lit:i===4?ag_io(tt,T.list-0.2,T.pr-0.6,0.3):ag_io(tt,lit[i]-0.15,lit[i]+1.4,0.3),
        noteA:ag_in(tt,lit[i]-0.1,0.4)}));
      const R=cm_repo(cx,60,150,870,rows,{a:ag_in(tt,0.05,0.4),k:Math.min(1,ag_spr(tt,0.05,0.5)),nameW:490,mark:ag_in(tt,T.gh-0.2,0.4)});
      // CODEOWNERS, linked to its row
      const oa=ag_in(tt,T.owner-0.2,0.4)*(1-ag_in(tt,T.pr-0.75,0.35));
      if(oa>0){const r4=R.rows[4];cm_arrow(cx,[r4.x+r4.w+4,r4.y+r4.h/2,r4.x+r4.w+24,r4.y+r4.h/2,r4.x+r4.w+30,r4.y+r4.h/2,r4.x+r4.w+40,r4.y+r4.h/2],ag_in(tt,T.list,0.4),{col:AG.blue,lw:3,head:10,a:oa});
        cm_owners(cx,960,150,880,CM_OWN.map((l,i)=>[l[0],l[1],ag_in(tt,T.owner+i*0.3,0.4)]),{a:oa,k:Math.min(1,ag_spr(tt,T.owner-0.2,0.5)),subA:ag_in(tt,T.meta-0.3,0.4)});}
      // the change: Jun's agent opened it; its owner reviews it, a second person approves it; the agent can't
      const pa=ag_in(tt,T.pr-0.3,0.4)*(1-ag_in(tt,T.history-0.65,0.35));
      if(pa>0)cm_pr(cx,960,150,880,{title:"Check every unit list against the student system",by:"Opened by Jun's agent",byPen:1,byGlow:ag_io(tt,T.propose-0.2,T.never+1.2,0.3),
        files:[["skills/reconcile-and-diff/SKILL.md"]],
        rows:[{text:"Its owner reviews it: Jun Park",state:"wait",tick:ag_in(tt,T.reviews+0.5,0.35),a:ag_in(tt,T.reviews-0.2,0.4)},
              {text:"A second person approves it: Noor Rahman",state:"wait",tick:ag_in(tt,T.second+0.5,0.35),a:ag_in(tt,T.prod-0.2,0.4)},
              {text:"Jun's agent can't approve it",state:"lock",a:ag_in(tt,T.never-0.1,0.4)}],a:pa,k:Math.min(1,ag_spr(tt,T.pr-0.3,0.5))});
      // and its history: who, when, and why
      const ha=ag_in(tt,T.history-0.3,0.4);
      if(ha>0)cm_history(cx,960,150,880,[["Proposed by","Jun's agent, 2 November 2026",ag_in(tt,T.who-0.2,0.4)],["Reviewed and approved by","Jun Park and Noor Rahman, 3 November 2026",ag_in(tt,T.who+0.4,0.4)],
        ["Why","Check every unit list against the student system",ag_in(tt,T.why-0.2,0.4)]],{kick:"History",a:ha,k:Math.min(1,ag_spr(tt,T.history-0.3,0.5))});}},
    // the definitions come from the business glossary, kept by their owners on Databricks; a skill copies each into the project, with
    // where it came from (later:true: the repository leaves, then comes back at the right, so its files never show twice)
    {later:true,at:T.gloss-0.5,place:"cmBoard",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const ga=ag_in(tt,T.gloss-0.3,0.4);
      const g=cm_term(cx,80,190,700,{a:ga,k:Math.min(1,ag_spr(tt,T.gloss-0.3,0.5)),ownerA:ag_in(tt,T.owners-0.2,0.4),edge:ag_io(tt,T.owners-0.2,T.skill,0.4)>0?AG.blue:null,edgeA:ag_io(tt,T.owners-0.2,T.skill,0.4)});
      const sa=ag_in(tt,T.skill-0.3,0.4),sk=cm_script(cx,820,300,"Sync the glossary","a skill",{a:sa,k:Math.min(1,ag_spr(tt,T.skill-0.3,0.5)),turn:Math.max(0,tt-T.copies)*0.5,glow:ag_io(tt,T.copies-0.2,T.whereFrom+1.2,0.4)});
      cm_arrow(cx,[g.x+g.w+4,362,g.x+g.w+14,362,g.x+g.w+22,362,816,362],ag_in(tt,T.skill-0.1,0.4),{col:AG.blue,lw:3.5,head:12});
      const ra=ag_in(tt,T.copies-0.2,0.4),rx=1240;
      cm_arrow(cx,[sk?sk.x+sk.w+4:1200,362,1210,362,1220,362,rx-6,362],ag_in(tt,T.copies,0.4),{col:AG.blue,lw:3.5,head:12});
      const R=cm_repo(cx,rx,190,620,[{name:"models/",folder:1,note:null}],{a:ra,k:Math.min(1,ag_spr(tt,T.copies-0.2,0.5)),mark:1});
      // the copy, with its source
      const ca=ag_in(tt,T.copies+0.3,0.4);if(ca>0){const y0=R.bb.y+R.bb.h+20;ag_box(cx,rx,y0,620,214,22,{a:ca,edge:AG.blue,edgeA:0.5});cx.save();cx.globalAlpha*=ca;
        ag_T(cx,"Unit offering",rx+28,y0+52,{w:700,size:32});ag_T(cx,"A unit taught in a semester,",rx+28,y0+96,{w:600,size:28});ag_T(cx,"on campus, online or both.",rx+28,y0+134,{w:600,size:28});
        const wa=ag_in(tt,T.whereFrom-0.2,0.4);if(wa>0){cx.fillStyle=rgba(AG.blue,0.1*wa);rr(cx,rx+14,y0+152,592,48,10);cx.fill();}
        ag_T(cx,"source: the glossary's term",rx+28,y0+186,{w:500,size:28,f:"mono",col:AG.blue,a:ag_in(tt,T.whereFrom-0.3,0.4)});cx.restore();}}},
    // one way, to where agents read it: dbt writes its descriptions as comments in Unity Catalog, the skills go to Unity Gateway; nobody
    // edits them there (later:true: the repository leaves, then comes back smaller at the left, so its files never show twice)
    {later:true,at:T.oneway-0.5,place:"cmBoard",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      cm_repo(cx,40,250,400,[{name:"AGENTS.md"},{name:"skills/",folder:1,lit:ag_io(tt,T.gw-0.3,T.nobody-0.3,0.4)},{name:"models/",folder:1,lit:ag_io(tt,T.uc-0.3,T.gw-0.4,0.4)}],{mark:1});
      const u=ag_sine(clamp((tt-T.oneway+0.2)/0.9,0,1));cm_arrow(cx,[456,420,490,420,530,420,568,420],u,{col:AG.blue,lw:4,head:14});
      ag_T(cx,"one way",512,396,{w:600,size:28,col:AG.mut,align:"center",a:ag_in(tt,T.oneway,0.4)});
      cm_zone(cx,580,130,1290,740,"On Databricks",{a:ag_in(tt,T.dbx-0.4,0.5),mark:"databricks"});
      const ta=ag_in(tt,T.uc-0.3,0.4),tb=cm_table(cx,610,210,640,{name:CM_TABLE.name,comment:CM_TABLE.comment,by:"dbt",byA:ag_in(tt,T.dbtW-0.2,0.4),
        cols:[[CM_TABLE.col[0],CM_TABLE.col[1],ag_in(tt,T.column-0.2,0.4)]],commentA:ag_in(tt,T.comments-0.2,0.4),a:ta,k:Math.min(1,ag_spr(tt,T.uc-0.3,0.5))});
      const sr=[["A Unity Catalog object",T.obj],["An owner",T.sOwner],["Permissions",T.perm],["A record of who read or changed it",T.rec]];
      const sa=ag_in(tt,T.gw-0.3,0.4),sb=cm_skill(cx,1280,210,560,{name:"reconcile-and-diff",rows:sr.map(r=>[r[0],ag_in(tt,r[1]-0.15,0.4)]),a:sa,k:Math.min(1,ag_spr(tt,T.gw-0.3,0.5))});
      // Jun's agent reads both there
      const aa=ag_in(tt,T.uc+0.4,0.5);cm_agent(cx,1262,760,54,tt,{a:aa,think:0.2,core:0.75,label:"Jun's agent",floor:850});
      cm_reads(cx,tb.x+tb.w*0.55,tb.y+tb.h+6,1222,722,ag_sine(clamp((tt-T.uc-0.5)/0.9,0,1))*ta,{t:tt,bend:20});
      cm_reads(cx,sb.x+sb.w*0.4,sb.y+sb.h+6,1302,722,ag_sine(clamp((tt-T.gw-0.4)/0.9,0,1))*sa,{t:tt,bend:20});
      cm_pillAt(cx,1700,172,"no edits here",tt,T.nobody-0.1,null,{icon:"lock",col:AG.blue,size:28});
      cm_pillAt(cx,270,620,"a change starts here",tt,T.starts-0.1,null,{icon:"draft",col:AG.green,size:28});}}]);
  CM_KICK(ctx,1);});

/* ---------------------------------------------------------------- 4 · Memory, kept by the platform */
// the agents that write sessions, at the left of the board
const CM_WRITERS=[[170,330,"Jun's agent"],[170,540,"Clara's agent"],[170,750,"Lucía's agent"]];
// the file before the merge: the four, the line kept in July about room bookings, and the line the step keeps today; no one's tick
function cm_before(o){o=o||{};return CM_MEM.concat([CM_EXAM_T,CM_ROOMS_T]).map((s,k)=>Object.assign({text:s,tick:0},o.each?o.each(k):{}));}
scene("memory",(ctx,S,t,sc)=>{const c=sc.cues,T=cm_once(sc,"T",()=>({
    write:wAt(sc,"different","agents write"),
    dbx:wAt(sc,"lakebase","On Databricks"),sessions:wAt(sc,"lakebase","sessions"),lasting:wAt(sc,"lakebase","lasting memory"),lake:wAt(sc,"lakebase","Lakebase"),
    step:wAt(sc,"daily","A step"),once:wAt(sc,"daily","once a day"),readsS:wAt(sc,"daily","reads the sessions"),keeps:wAt(sc,"daily","keeps what"),asking:wAt(sc,"daily","without asking"),
    campus:wAt(sc,"how","campus line"),lost:wAt(sc,"how","lost its words"),merged:wAt(sc,"how","merged"),other:wAt(sc,"how","other lines"),built:wAt(sc,"how","as it's built"),
    room:wAt(sc,"room","one room"),whoever:wAt(sc,"room","whoever may write"),any:wAt(sc,"room","any entry"),nothing:wAt(sc,"room","nothing records"),
    hand:wAt(sc,"hand","by hand"),few:wAt(sc,"hand","a few lessons"),
    hundreds:wAt(sc,"hundreds","hundreds a week"),anyone:wAt(sc,"hundreds","more than anyone"),upToDate:wAt(sc,"hundreds","keep up to date"),
    keepsMem:wAt(sc,"so","keeps the memory"),governs:wAt(sc,"so","the team governs"),restOn:wAt(sc,"so","rest on"),
    defsFirst:wAt(sc,"order","the definitions"),rules:wAt(sc,"order","data rules"),memSecond:wAt(sc,"order","memory second"),
    disagree:wAt(sc,"disagree","disagrees"),follows:wAt(sc,"disagree","follows the definition"),flags:wAt(sc,"disagree","flags the line"),
    yusuf:wAt(sc,"yusuf","Yusuf"),gov:wAt(sc,"yusuf","data governance"),whole:wAt(sc,"yusuf","as a whole"),rw:wAt(sc,"yusuf","read and write"),howLong:wAt(sc,"yusuf","how long"),
    flagged:wAt(sc,"flag","flagged line"),toHim:wAt(sc,"flag","goes to him"),deletes:wAt(sc,"flag","deletes it"),
    every:wAt(sc,"read","Every agent"),none:wAt(sc,"read","none may change"),only:wAt(sc,"read","only the step")}));
  ag_shots(ctx,S,t,sc.dur,[
    // agents write their sessions; on Databricks, a sessions store and the team's lasting memory, in Lakebase; once a day a step keeps
    // what seems worth keeping, unasked: here, a line about counting units (later:true: what the last chapter ends on leaves before the
    // agents come, so Jun's agent never shows twice)
    {later:true,at:0,place:"cmBoard",keys:[[0,960,540,1.0]],push:0.025,draw:(cx,tt)=>{
      cm_zone(cx,330,140,1550,720,"On Databricks · Lakebase",{a:ag_in(tt,T.dbx-0.3,0.5),mark:"databricks"});
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
      cm_file(cx,1400,770,{a:ag_in(tt,T.lasting-0.3,0.5),label:"Team memory",cards:cm_before({each:k=>k===5?{a:add,glow:ga>0?AG.violet:null,glowA:ga}:{}})});
      cm_pillAt(cx,590,820,"no one reviews it",tt,T.asking,null,{icon:"warn",col:AG.amber,size:28});}},
    // how the campus line lost its words: the step merges the line about counting each unit once into it, as it's built to, and its
    // title becomes Units taught on campus only; the store is one room: whoever may write to it may change any entry, and nothing
    // records what it said before (later:true: the file and the step change places, so they leave first and never show twice)
    {later:true,at:c.how-0.4,place:"cmBoard",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const m=clamp((tt-T.merged)/1.4,0,1),gl=ag_in(tt,T.campus-0.2,0.4)*(1-ag_in(tt,T.room-0.2,0.6)),w1=ag_in(tt,T.whoever,0.5),hit=k=>ag_io(tt,T.any-0.2+k*0.1,T.nothing,0.3);
      // the line about counting each unit once slides onto the room bookings line, which loses its title under it; then the card goes,
      // and the new title comes
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
    // approving every line by hand works for a few lessons, as Mei did; but the step keeps hundreds a week, more than anyone can read
    {later:true,at:c.hand-0.4,place:"cmBoard",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const pa=ag_in(tt,c.hand-0.3,0.5);if(pa>0){cx.save();cx.globalAlpha*=pa;ag_person(cx,"mei",300,690,0.8,{t:tt,gaze:[4,0],smile:0.3});cx.restore();}
      cm_pillAt(cx,300,300,"Mei Tanaka · Registrar's office",tt,c.hand-0.2,null,{size:28});
      const few=["Read the glossary first","Show the count reported","Name units by their code"];
      few.forEach((s,i)=>{const ia=ag_in(tt,T.hand-0.2+i*0.25,0.4);if(ia<=0)return;cm_index(cx,560,380+i*80,440,58,{text:s,a:ia,tick:ag_in(tt,T.few-0.1+i*0.25,0.35)});});
      cm_pillAt(cx,780,640,"a few, by hand",tt,T.few,null,{icon:"tick",col:AG.green,size:28});
      // the step's lines pour in
      const u=clamp((tt-T.hundreds+0.3)/2.6,0,1),ta=ag_in(tt,T.hundreds-0.4,0.4);
      cm_step(cx,1100,130,{w:400,a:ta,turn:tt*0.5,glow:ta*0.6});
      cm_tiles(cx,1100,290,7,6,ag_sine(u),{a:ta,w:96,h:58,gx:14,gy:14});
      cm_pillAt(cx,1490,756,"hundreds a week",tt,T.hundreds+0.2,null,{icon:"warn",col:AG.amber,size:28});
      cm_pillAt(cx,780,756,"more than anyone can read",tt,T.anyone-0.1,null,{icon:"warn",col:AG.amber,size:28});}},
    // so the platform keeps the memory, and the team governs what answers must rest on: agents read the definitions and the data
    // rules first, memory second; when a line disagrees with a definition, the agent follows the definition and flags the line
    {later:true,at:c.so-0.4,place:"cmBoard",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const O=cm_order(cx,500,150,1300,{a1:ag_in(tt,T.governs-0.3,0.4),k1:Math.min(1,ag_spr(tt,T.governs-0.3,0.5)),rev:ag_in(tt,T.restOn,0.4),items:i=>ag_in(tt,[T.defsFirst,T.rules][i]-0.2,0.4),
        a2:ag_in(tt,T.keepsMem-0.4,0.4),k2:Math.min(1,ag_spr(tt,T.keepsMem-0.4,0.5)),kept:ag_in(tt,T.keepsMem-0.2,0.4),noOne:ag_in(tt,T.memSecond,0.4),
        line:{text:CM_LINE_T,a:ag_in(tt,T.disagree-0.4,0.4),glow:ag_in(tt,T.disagree,0.4),flag:ag_in(tt,T.flags,0.4)},win:ag_io(tt,T.follows-0.2,T.follows+2.4,0.4)});
      const aa=ag_in(tt,T.defsFirst-0.6,0.4);cm_agent(cx,240,500,62,tt,{a:aa,think:0.3,core:0.8,label:"Clara's agent",floor:600});
      cm_reads(cx,288,460,O.t1.x-6,O.t1.y+O.t1.h/2,ag_sine(clamp((tt-T.defsFirst)/0.8,0,1))*aa,{t:tt,bend:-20});
      cm_reads(cx,288,540,O.t2.x-6,O.t2.y+O.t2.h/2,ag_sine(clamp((tt-T.memSecond)/0.8,0,1))*aa,{t:tt,bend:20,col:AG.mut});
      cm_pillAt(cx,1150,720,"it follows the definition",tt,T.follows-0.1,null,{col:AG.green,icon:"tick",size:28});}},
    // Yusuf, in data governance, owns the memory as a whole: who may read and write each store, and how long it's kept; each flagged
    // line goes to him, and he deletes it if it's wrong
    {later:true,at:c.yusuf-0.4,place:"cmBoard",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      ag_person(cx,"yusuf",360,640,0.9,{t:tt,gaze:[4,0],smile:0.3});
      cm_pillAt(cx,360,290,"Yusuf Demir · Data governance",tt,c.yusuf-0.3,null,{size:28});
      cm_spec(cx,820,110,1000,"Team memory","Owner: Yusuf Demir",[["Who may read","Every agent",ag_in(tt,T.rw-0.2,0.4),ag_io(tt,T.rw-0.2,T.howLong-0.2,0.3)],
        ["Who may write","Only the memory step",ag_in(tt,T.rw+0.3,0.4),ag_io(tt,T.rw+0.2,T.howLong-0.2,0.3)],["Sessions kept","30 days",ag_in(tt,T.howLong-0.2,0.4),ag_io(tt,T.howLong-0.2,T.flagged-0.4,0.3)]],
        {a:ag_in(tt,T.whole-0.4,0.4),k:Math.min(1,ag_spr(tt,T.whole-0.4,0.5))});
      // a flagged line comes to him; he deletes it if it's wrong
      const fa=ag_in(tt,T.flagged-0.3,0.4),mv=ag_sine(clamp((tt-T.toHim+0.3)/1.1,0,1)),del=ag_in(tt,T.deletes+0.1,0.5);
      if(fa>0){cx.save();cx.globalAlpha*=fa*(1-ag_in(tt,T.deletes+1.4,0.6));cm_card(cx,lerp(1400,640,mv),560,{text:CM_CAMPUS_T,glow:AG.amber,glowA:1,flag:1-del,strike:del},-0.018);cx.restore();}
      cm_stamp(cx,860,700,"Deleted",tt,T.deletes+0.2,{col:AG.amber,size:28,t1:T.deletes+1.4});}},
    // every agent may read the team's store, and none may change it: only the step writes there
    {later:true,at:c.read-0.4,place:"cmBoard",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const sa=ag_in(tt,c.read-0.3,0.4);
      cm_step(cx,100,300,{w:400,a:sa,turn:tt*0.35,glow:ag_io(tt,T.only-0.2,T.only+1.6,0.4)});
      cm_arrow(cx,[504,362,560,362,600,362,636,362],ag_in(tt,T.only-0.1,0.5),{col:AG.violet,lw:4,head:14});
      cm_pillAt(cx,300,480,"only the step writes",tt,T.only,null,{col:AG.violet,size:28});
      cm_store(cx,640,150,640,470,{kick:"Store",title:"The team's memory",rows:cm_kept().map(r=>({text:r.text})),mark:1,lock:ag_in(tt,T.none-0.1,0.4),lockText:"agents: read only",a:sa,k:Math.min(1,ag_spr(tt,c.read-0.3,0.5))});
      [[1560,250,"Jun's agent"],[1560,470,"Clara's agent"],[1560,690,"Lucía's agent"]].forEach((p,i)=>{const aa=ag_in(tt,T.every-0.3+i*0.12,0.4);
        cm_agent(cx,p[0],p[1],44,tt,{ph:i*1.6,think:0.2,core:0.75,label:p[2],a:aa,floor:p[1]+92});
        cm_reads(cx,1286,p[1],p[0]-50,p[1]-4,ag_sine(clamp((tt-T.every-i*0.15)/0.8,0,1))*aa,{t:tt,bend:0});});}}]);
  CM_KICK(ctx,1);});

/* ---------------------------------------------------------------- 5 · Kept, then deleted */
// what the docs say about deleting a session, word for word (Databricks docs, Agent sessions, updated 17 October 2026; read 4 November 2026)
const CM_DOCS_Q="Deleting a session or session store does not delete memory retained in a memory store.";
// the skills in the repository, and on the platform: one deleted in the repository, still on the platform
const CM_SKILLS=["draft-a-model","reconcile-and-diff","count-room-bookings"];
// a session's tile on the strip of days kept: violet edge, two grey lines
function cm_tile(ctx,x,y,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_box(ctx,x,y,44,58,8,{edge:AG.violet,edgeA:0.55});
  ctx.fillStyle="rgba(86,92,100,0.18)";rr(ctx,x+9,y+18,26,6,3);ctx.fill();rr(ctx,x+9,y+32,18,6,3);ctx.fill();ctx.restore();}
// the record Yusuf keeps in the repository (the example project's memory/removed.md)
const CM_RECORD=[["The line: Count only units taught on campus.","Deleted from the team's store, 3 November 2026"],["The skill count-room-bookings","Deleted from Unity Gateway too, 3 November 2026"],
  ["Why","A merge dropped “For room bookings”"]];
scene("keep",(ctx,S,t,sc)=>{const c=sc.cues,T=cm_once(sc,"T",()=>({
    keeping:wAt(sc,"decide","Keeping"),decisions:wAt(sc,"decide","decisions"),
    sessions:wAt(sc,"thirty","sessions"),thirty:wAt(sc,"thirty","thirty days"),job:wAt(sc,"thirty","scheduled job"),deletes:wAt(sc,"thirty","deletes them"),
    traps:wAt(sc,"traps","traps"),found:wAt(sc,"traps","campus line"),first:wAt(sc,"traps","first thought"),delChat:wAt(sc,"traps","delete the chat"),
    delNothing:wAt(sc,"nothing","deletes nothing"),docs:wAt(sc,"nothing","the docs say"),doesnt:wAt(sc,"nothing","doesn't delete"),
    syncW:wAt(sc,"sync","the sync"),neverDel:wAt(sc,"sync","never deletes"),
    whereW:wAt(sc,"where","where a thing"),lineW:wAt(sc,"where","the line"),storeW:wAt(sc,"where","the team's store"),skillW:wAt(sc,"where","a skill"),
    platformW:wAt(sc,"where","on the platform"),repoW:wAt(sc,"where","the repository"),
    recW:wAt(sc,"record","records"),what:wAt(sc,"record","what he deleted"),whyR:wAt(sc,"record","and why"),inRepo:wAt(sc,"record","the repository"),noAgent:wAt(sc,"record","No agent")}));
  ag_shots(ctx,S,t,sc.dur,[
    // sessions kept thirty days: a strip of days; each day a scheduled job puts the oldest in the bin, and today's comes in
    {later:true,at:0,place:"cmBoard",keys:[[0,960,540,1.0]],push:0.025,draw:(cx,tt)=>{
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
    // the first thought: delete the chat the line came from; it deletes nothing of the line, as the docs say
    {later:true,at:c.traps-0.4,place:"cmBoard",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const dq=ag_sine(clamp((tt-T.delChat-0.1)/0.8,0,1)),sa=ag_in(tt,c.traps-0.3,0.4)*(1-ag_in(tt,T.delChat+0.4,0.5));
      if(sa>0){cx.save();cx.globalAlpha*=sa;cx.translate(0,dq*90);cm_session(cx,100,250,720,220,{date:"14 July 2026",lines:["For room bookings, count only","units taught on campus."]});cx.restore();}
      cm_pillAt(cx,460,200,"delete the chat?",tt,T.first-0.1,T.delChat+0.6,{size:28});
      const bna=1-ag_in(tt,T.docs-0.8,0.4);if(bna>0){cx.save();cx.globalAlpha*=bna;cm_bin(cx,460,560,84,rgba(AG.mut,0.95),ag_io(tt,T.delChat-0.1,T.delChat+0.9,0.3));cx.restore();}
      cm_file(cx,1430,760,{cards:cm_cards({glow:k=>k===CM_WRONG?AG.amber:null,glowA:k=>ag_in(tt,T.delNothing-0.2,0.4),flag:k=>k===CM_WRONG?1:0})});
      cm_pillAt(cx,1430,300,"still in the team's memory",tt,T.delNothing,null,{icon:"warn",col:AG.amber,size:28});
      const qa=ag_in(tt,T.docs-0.4,0.4);if(qa>0)cm_quote(cx,100,600,860,CM_DOCS_Q,"Databricks docs · Agent sessions",{a:qa,k:Math.min(1,ag_spr(tt,T.docs-0.4,0.5))});}},
    // the sync that copies skills to the platform never deletes one
    {later:true,at:c.sync-0.4,place:"cmBoard",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      cm_repo(cx,40,220,700,CM_SKILLS.map((n,i)=>({name:"skills/"+n+"/",folder:1,strike:i===2?1:0,note:i===2?"deleted":null,noteCol:AG.amber,col:i===2?AG.amber:null})),{nameW:470,mark:1});
      const sa=ag_in(tt,T.syncW-0.3,0.4);
      cm_script(cx,800,330,"Skill sync","copies, never deletes",{a:sa,k:Math.min(1,ag_spr(tt,T.syncW-0.3,0.5)),turn:Math.max(0,tt-T.syncW)*0.5,glow:ag_io(tt,T.neverDel-0.3,T.neverDel+1.4,0.4)});
      cm_arrow(cx,[744,392,760,392,776,392,796,392],ag_in(tt,T.syncW-0.1,0.4),{col:AG.blue,lw:3.5,head:12});
      cm_arrow(cx,[1234,392,1250,392,1266,392,1286,392],ag_in(tt,T.syncW+0.3,0.4),{col:AG.blue,lw:3.5,head:12});
      const za=ag_in(tt,T.syncW,0.4);cm_zone(cx,1300,170,580,520,"Unity Gateway skills",{a:za,mark:"databricks"});
      CM_SKILLS.forEach((n,i)=>{const g=i===2?ag_in(tt,T.neverDel,0.4):0;cx.save();cx.globalAlpha*=za;cm_index(cx,1332,260+i*76,516,56,{text:n,glow:g>0?AG.amber:null,glowA:g});cx.restore();});
      cm_pillAt(cx,1590,560,"still on the platform",tt,T.neverDel+0.2,null,{icon:"warn",col:AG.amber,size:28});}},
    // delete where it's kept: the line, in the team's store; the skill on the platform as well as in the repository
    {later:true,at:c.where-0.4,place:"cmBoard",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const ld=ag_in(tt,T.storeW-0.1,0.4),lg=ag_sine(clamp((tt-T.storeW-0.6)/0.9,0,1));
      const rows=CM_MEM.map(s=>({text:s})).concat([{text:CM_CAMPUS_T,col:AG.amber,colA:ag_in(tt,T.lineW-0.2,0.4),flag:1-ld,strike:ld,a:1-lg}]);
      cm_store(cx,80,170,700,472,{kick:"Store",title:"The team's memory",rows,mark:1,a:ag_in(tt,T.whereW-0.4,0.4),k:Math.min(1,ag_spr(tt,T.whereW-0.4,0.5))});
      cm_stamp(cx,600,560,"Deleted",tt,T.storeW+0.1,{col:AG.amber,size:28,t1:T.storeW+1.6});
      const za=ag_in(tt,T.skillW-0.3,0.4);cm_zone(cx,880,170,960,214,"Unity Gateway skills",{a:za,mark:"databricks"});
      const pg=ag_in(tt,T.platformW-0.1,0.4);if(za>0){cx.save();cx.globalAlpha*=za;cm_index(cx,912,264,640,56,{text:"count-room-bookings",glow:AG.amber,glowA:1-pg,strike:pg});cx.restore();}
      const ra=ag_in(tt,T.repoW-0.3,0.4),rd=ag_in(tt,T.repoW+0.1,0.4);
      cm_repo(cx,880,430,960,[{name:"skills/count-room-bookings/",folder:1,strike:rd,col:AG.amber,note:rd>0?"deleted":null,noteCol:AG.amber}],{nameW:560,mark:1,a:ra,k:Math.min(1,ag_spr(tt,T.repoW-0.3,0.5))});}},
    // Yusuf records what he deleted, and why, in the repository; no agent will read the line again
    {later:true,at:c.record-0.5,place:"cmBoard",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const ra=ag_in(tt,c.record-0.3,0.4);
      cm_history(cx,300,190,1320,CM_RECORD.map((r,i)=>[r[0],r[1],ag_in(tt,[T.what,T.what+0.6,T.whyR][i]-0.2,0.4)]),{kick:"Record",mark:"github",file:"memory/removed.md",a:ra,k:Math.min(1,ag_spr(tt,c.record-0.3,0.5))});
      cm_pillAt(cx,960,630,"no agent reads the line again",tt,T.noAgent-0.1,null,{size:28,col:AG.green,icon:"tick"});}}]);
  CM_KICK(ctx,1);});

/* ---------------------------------------------------------------- 6 · What the team knows */
scene("close",(ctx,S,t,sc)=>{const c=sc.cues,T=cm_once(sc,"T",()=>({
    asks:wAt(sc,"again","asks again"),
    lists:wAt(sc,"answer","lists all"),evidence:wAt(sc,"answer","with its evidence"),offerings:wAt(sc,"answer","unit offerings it read"),defn:wAt(sc,"answer","the definition it followed"),
    every:wAt(sc,"library","every unit"),online:wAt(sc,"library","online or on campus"),
    everyAgent:wAt(sc,"same","Every agent"),newcomer:wAt(sc,"same","every newcomer"),sameDefs:wAt(sc,"same","the same definitions"),help:wAt(sc,"same","memory to help"),
    readsW:wAt(sc,"began","what an agent reads"),nine:wAt(sc,"began","Nine films"),
    longer:wAt(sc,"road","a longer road"),helps:wAt(sc,"road","helps one person"),beside:wAt(sc,"road","works beside"),
    nextW:wAt(sc,"next","Next")}));
  const end=c.breath,L=[1,2,3,4,5,6,7,8,9].map(i=>c["l"+i]);
  ag_shots(ctx,S,t,sc.dur,[
    // back in Planning: Lucía asks again
    {at:0,place:"cmLab",keys:[[0,1000,530,1.03]],push:0.02,draw:(cx,tt)=>{
      cm_lucia(cx,S,tt,{think:0.2+0.4*ag_io(tt,T.asks,T.asks+1.6,0.4),smile:0.35});
      cm_cardAt(cx,110,88,600,{kick:"From the library",title:"Which units run next semester?",sub:"To buy their e-books"},tt,T.asks-0.5,null,{kickCol:AG.kick});
      cm_file(cx,CM_F.x,CM_F.y,{cards:cm_kept()});
      const A=CM_DESK.agent;cm_fileReads(cx,tt,ag_sine(clamp((tt-T.asks)/1.0,0,1)),A[0],A[1],A[2]);}},
    // her agent's answer, with its evidence: the unit offerings it read, and the definition it followed
    {at:c.answer-0.3,place:"cmBoard",cut:true,keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
      cm_agent(cx,250,700,64,tt,{think:0.3,core:0.85,label:"Lucía's agent",floor:800});
      const open=ag_sine(clamp((tt-T.evidence)/1.3,0,1));
      const ev=ag_evidence(cx,80,110,760,{kick:"Her agent's answer",title:"1,236 units"},[{kick:"Data",title:"Unit offerings, Semester 1, 2027",col:AG.orange},
        {kick:"Definition",title:"Unit offering, in the glossary",col:AG.green}],{open,side:"below",ew:360,edge:AG.green,a:ag_in(tt,c.answer-0.2,0.4),kickCol:AG.violet}),mi=ev.items[1].to;
      const ga=ag_in(tt,T.defn-0.5,0.4),g=cm_term(cx,1040,220,780,{a:ga,k:Math.min(1,ag_spr(tt,T.defn-0.5,0.5)),edge:AG.green,edgeA:ag_in(tt,T.defn,0.4)});
      cm_reads(cx,mi.x+mi.w+6,mi.y+mi.h*0.45,g.x-8,g.y+g.h*0.5,ag_sine(clamp((tt-T.defn+0.2)/0.9,0,1))*ga,{t:tt,bend:-20});}},
    // the library buys e-books for every unit, online or on campus
    {later:true,at:c.library-0.4,place:"cmBoard",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      cm_people(cx,260,380,{join:1});
      cm_library(cx,1060,300,620,{count:"For all 1,236 units",col:AG.green,note:ag_in(tt,T.online-0.2,0.3)>0?"Online or on campus":null,k:Math.min(1,ag_spr(tt,c.library-0.4,0.5)),a:ag_in(tt,c.library-0.4,0.3)});}},
    // every agent, and every newcomer, starts from the same definitions, with memory to help
    {later:true,at:c.same-0.4,place:"cmBoard",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const O=cm_order(cx,420,110,1080,{a1:ag_in(tt,T.sameDefs-0.4,0.4),a2:ag_in(tt,T.help-0.4,0.4),win:ag_io(tt,T.sameDefs-0.1,T.sameDefs+1.8,0.4)});
      [["Jun's agent",360],["Clara's agent",660],["Lucía's agent",960],["Noor's agent",1260],["Sam's agent",1560]].forEach((p,i)=>{const aa=ag_in(tt,T.everyAgent-0.3+i*0.12,0.4);
        cm_agent(cx,p[1],760,44,tt,{ph:i*1.3,think:0.2,core:0.75,label:p[0],a:aa,floor:852});
        cm_reads(cx,960+(i-2)*110,O.t2.y+O.t2.h+6,p[1],712,ag_sine(clamp((tt-T.everyAgent-i*0.12)/0.9,0,1))*aa,{t:tt,bend:0});});
      cm_pillAt(cx,1720,120,"newcomers too",tt,T.newcomer-0.1,null,{size:28,col:AG.blue});}},
    // where the series began: what an agent reads; nine films, nine lessons; then the whole road, from further off
    {later:true,at:c.began-0.4,place:"cmBoard",keys:[[0,960,540,1.0]],push:0,draw:(cx,tt)=>{const f=1-ag_in(tt,end+0.4,0.8);if(f<=0)return;cx.save();cx.globalAlpha*=f;
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
  const a1=ag_in(t,end+0.6,0.9);if(a1>0){setScreen(ctx,S);ag_T(ctx,"Govern what agents must get right.",960,296,{w:700,size:48,align:"center",a:a1});
    ag_T(ctx,"Memory comes second.",960,364,{w:700,size:48,align:"center",a:a1});}
  const na=ag_in(t,end+1.2,0.6);if(na>0){setScreen(ctx,S);ag_T(ctx,"Next: From helper to colleague",960,790,{w:600,size:30,align:"center",col:AG.mut,a:na});}
});

// chapters that open where the chapter before ends: on the quiet wall the camera glides on, and what the last chapter ends on leaves
// before the new one's picture comes in (its first shot is later:true); from the wall to Lucía's corner, it's a cut
ag_cutInto(["reads","code","memory","keep","close"]);
