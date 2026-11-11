/* ===== A mandate, written and enforced: the scenes =====
   Six chapters, each timed to its narration: wAt(sc, "line", "word") is the moment a word is said. The places are painted once
   (world.js); what moves is drawn live in the shots of ag_shots. The lab is one room, by day and by night: its camera stays where it
   is, and from shot to shot only what changes fades (Anil goes home, the light changes, the night's cards come and go), each card
   leaving before the next comes in where it stood. Between the lab and the quiet wall a shot dissolves: the whole picture changes, and
   nothing in one is in the other (the agent is never drawn on the wall). On the wall the camera stays still too, and a picture that
   names what the last one showed somewhere else is a later moment (later:true), so what was there leaves before it comes in; the
   page comes back in the same place each time. The title card ends chapter 1, the end card chapter 6. */

const wm_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
const WM_A=WM_L.agent,WM_P={x:70,y:60,w:900},WM_R={x:1010,w:840},WM_ANIL=[1480,700,0.8];
const WM_SCHOOL={kick:"For Health's heads of school",title:"Nursing: 64 teachers",sub:"38 of them casual, this term"};
// the lab with the workload agent at its place: o as wm_lab's, o.agent for wm_agent (think, core, loop, ringP, pulse), o.cards(ctx) at
// full contrast, after the room's light
function wm_room(cx,S,tt,o){const A=WM_A,ag=o.agent||{};
  wm_lab(cx,S,tt,Object.assign({},o,{things:c=>wm_agent(c,A[0],A[1],A[2],tt,ag),after:c=>{if(o.night)wm_band(c,A[0],A[1],A[2],tt,ag);if(o.cards)o.cards(c);}}));}
// the page, where every chapter shows it; o as wm_page's
const wm_thePage=(cx,o)=>wm_page(cx,WM_P.x,WM_P.y,WM_P.w,o);
// a card or a picture that comes in at t0 and leaves at t1: its opacity and its spring
const wm_win=(tt,t0,t1)=>ag_in(tt,t0,0.4)*(t1==null?1:1-ag_in(tt,t1,0.4));
const wm_k=(tt,t0)=>Math.min(1,ag_spr(tt,t0,0.5));
// a row lit while its words are said: from t0 to t1
const wm_lit=(tt,t0,t1)=>ag_io(tt,t0,t1,0.3);
// the rounds: ten small rings in a row, the first n filled violet as the rounds go (3 of 10 last night)
function wm_rounds(ctx,x,y,n,a){if(a<=0)return;const w=440,h=64;ctx.save();ctx.globalAlpha*=a;ag_box(ctx,x,y,w,h,h/2,{edge:AG.violet,edgeA:0.5});
  ag_T(ctx,"ROUNDS",x+28,y+43,{w:700,size:28,ls:3,col:AG.violet});
  for(let i=0;i<10;i++){const cx=x+180+i*24,cy=y+h/2,f=clamp(n-i,0,1);ctx.strokeStyle=rgba(AG.violet,0.55);ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,8,0,TAU);ctx.stroke();
    if(f>0){ctx.fillStyle=rgba(AG.violet,0.9*f);ctx.beginPath();ctx.arc(cx,cy,8*lerp(0.4,1,f),0,TAU);ctx.fill();}}
  ctx.restore();}

/* ---------------------------------------------------------------- 1 · Last night, in test */
// the three teams whose numbers come from HR's model of contracts, under it
const WM_TEAMS=[["Finance",250],["Planning",500],["Research",750]];
scene("first",(ctx,S,t,sc)=>{const c=sc.cues,T=wm_once(sc,"T",()=>({
    agentW:wAt(sc,"ask","workload agent"),heads:wAt(sc,"ask","heads of school"),casual:wAt(sc,"ask","casual"),
    built:wAt(sc,"test","built in test"),copy:wAt(sc,"test","copy of the data"),reach:wAt(sc,"test","reach production"),
    eleven:wAt(sc,"fail","soon after eleven"),failed:wAt(sc,"fail","failed in test"),numbers:wAt(sc,"fail","numbers"),
    nobody:wAt(sc,"nobody","Nobody"),why:wAt(sc,"nobody","Finding out why"),
    worksA:wAt(sc,"harm","works alone"),harmW:wAt(sc,"harm","harm alone"),
    failedB:wAt(sc,"oct","failed build"),changed:wAt(sc,"oct","changed HR's model"),other:wAt(sc,"oct","other teams'"),
    reached:wAt(sc,"overnight","reached production"),overW:wAt(sc,"overnight","changed overnight"),known:wAt(sc,"overnight","nobody would"),
    nowhere:wAt(sc,"where","written nowhere"),signIt:wAt(sc,"where","sign it"),readIt:wAt(sc,"where","read it"),stopIt:wAt(sc,"where","stop it"),
    wrote:wAt(sc,"mandate","wrote its mandate"),oneTask:wAt(sc,"mandate","the one task"),
    itsTask:wAt(sc,"which","Its task"),andWhere:wAt(sc,"which","and where"),itsFolders:wAt(sc,"which","Its folders"),itsChecks:wAt(sc,"which","its checks"),
    rounds:wAt(sc,"limits","Ten rounds"),
    swW:wAt(sc,"switch","A switch"),undoW:wAt(sc,"switch","undo"),
    onMap:wAt(sc,"map","on the map"),beside:wAt(sc,"map","beside the task"),
    signW:wAt(sc,"signed","signed it"),approved:wAt(sc,"signed","approved"),
    tools:wAt(sc,"held","the tools"),
    plain:wAt(sc,"check","a plain check"),arrived:wAt(sc,"check","arrived"),started:wAt(sc,"check","the agent started"),
    three:wAt(sc,"cause","In three rounds"),foundWhy:wAt(sc,"cause","found why"),every:wAt(sc,"cause","every version"),
    tutors:wAt(sc,"twice","Three tutors"),countedTwice:wAt(sc,"twice","counted twice"),
    fixedW:wAt(sc,"fixed","fixed one line"),checkedW:wAt(sc,"fixed","checked it in test"),nothingElse:wAt(sc,"fixed","touched nothing else"),
    twenty:wAt(sc,"report","Twenty minutes"),waiting:wAt(sc,"report","waiting for Anil"),
    neverSaw:wAt(sc,"never","never saw the bug"),passes:wAt(sc,"never","passes its night in test"),yes:wAt(sc,"never","a person's yes"),
    writtenDown:wAt(sc,"data","written down"),heldW:wAt(sc,"data","held in every tool"),takenBack:wAt(sc,"data","taken back")}));
  const S2=c.fail-0.7,S3=c.oct-0.7,S4=T.nowhere-1.0,S5=T.wrote-0.6,S6=c.check-0.8;
  ag_shots(ctx,S,t,sc.dur,[
    // Today, at the university: Anil at his desk; his workload agent, whose week's answer goes to Health's heads of school; the night
    // build, every change built in test before it can reach production
    {at:0,place:"wmLab",keys:[[0,960,540,1.0]],push:0.012,draw:(cx,tt)=>{
      const think=0.2+0.4*ag_io(tt,T.agentW-0.2,T.casual+1.0,0.5);
      wm_room(cx,S,tt,{anil:1,screen:"day",time:8*60+40,testLit:ag_in(tt,T.built,0.8),prodLit:0.3,labels:ag_in(tt,T.copy-0.3,0.5),agent:{think,core:0.8},cards:c=>{
        const qa=wm_win(tt,T.heads-0.3,S2-0.6);
        if(qa>0)ag_textCard(c,520,92,640,WM_SCHOOL,{a:qa,k:wm_k(tt,T.heads-0.3),kickCol:AG.blue,edge:AG.blue,edgeA:0.5,tail:{side:"bottom",at:0.94,px:1236,py:404}});
        wm_arrow(c,[1376,716,1410,690,1440,676,1478,664],ag_in(tt,T.reach-0.2,0.6)*(1-ag_in(tt,S2-0.6,0.4)),{col:AG.blue,lw:3.5,head:12,dash:[9,8]});}});
      wm_scr(cx,S,()=>wm_tag(cx,WM_UNI,wm_win(tt,0.5,S2-0.8)));}},
    // last night, soon after eleven: the build fails in test, on its own numbers; nobody is at work; finding out why is its job
    {at:S2,place:"wmNight",dis:1.2,keys:[[0,960,540,1.0]],push:0.012,draw:(cx,tt)=>{
      const fl=ag_in(tt,T.failed-0.1,0.5),why=ag_in(tt,T.why-0.2,0.6);
      wm_room(cx,S,tt,{night:true,screen:"dark",time:23*60+14,testLit:0.7,testCol:fl>0.5?AG.amber:AG.blue,prodLit:0.3,agent:{think:0.15+0.55*why,core:0.6+0.4*why},cards:c=>{
        wm_pillAt(c,1040,668,"failed in test · 23:14",tt,T.failed-0.1,S3-0.6,{icon:"warn",col:AG.amber,size:28});
        const na=wm_win(tt,T.numbers-0.2,S3-0.6);
        if(na>0)ag_textCard(c,100,130,640,{kick:"In test, last night",title:"Nursing: 67 teachers",sub:"41 casual · HR's own report: 64 and 38"},{a:na,k:wm_k(tt,T.numbers-0.2),kickCol:AG.amber,edge:AG.amber});
        wm_pillAt(c,410,560,"nobody at work",tt,T.nobody,S3-0.6,{size:28});
        wm_pillAt(c,1060,300,"its job: find out why",tt,T.why,T.worksA-0.5,{size:28,col:AG.violet});
        wm_pillAt(c,1000,300,"alone, it can do harm alone",tt,T.worksA-0.1,S3-0.5,{size:28,col:AG.amber,icon:"warn"});}});
      wm_scr(cx,S,()=>wm_tag(cx,"Last night · 23:14",wm_win(tt,T.eleven,S3-0.6)));}},
    // one night in October: to make a failed build pass, it also changed HR's model of contracts, which other teams' numbers come
    // from; had that reached production, theirs would have changed overnight, and nobody would have known why
    {at:S3,place:"wmNight",keys:[[0,960,540,1.0]],push:0.012,draw:(cx,tt)=>{
      const ch=ag_in(tt,T.changed+0.1,0.5),out=S4-0.6,arm=ag_sine(clamp((tt-T.changed+0.6)/1.1,0,1))*(1-ag_in(tt,T.reached-0.4,0.6));
      wm_room(cx,S,tt,{night:true,screen:"dark",time:23*60+14,testLit:0.7,testCol:ag_in(tt,T.failedB-0.2,0.4)>0.5?AG.amber:AG.blue,prodLit:0.3,
        agent:{think:0.3+0.4*arm,core:0.9},things:null,cards:c=>{
        const ha=wm_win(tt,T.changed-0.6,out);
        // its arm, reaching out of its own folders to HR's model
        if(arm>0&&ha>0)ag_reach(c,[WM_A[0]-WM_A[2]*0.9,WM_A[1]-8,1080,380,900,236,726,206],arm,{grip:ag_in(tt,T.changed,0.3),a:ha});
        if(ha>0){ag_textCard(c,100,130,620,{kick:"HR's model",title:"Contracts",sub:"stg_hr_system__contracts"},{a:ha,k:wm_k(tt,T.changed-0.6),kickCol:AG.blue,edge:ch>0.02?AG.amber:null,edgeA:0.35+0.45*ch});
          wm_stamp(c,600,186,"changed",tt,T.changed+0.3,{col:AG.amber,t1:out});}
        // the teams whose numbers come from it, and the numbers that would have changed
        WM_TEAMS.forEach((m,i)=>{const t0=T.other+i*0.2,bad=ag_in(tt,T.overW+i*0.15,0.4);if(wm_win(tt,t0,out)<=0)return;
          c.save();c.globalAlpha*=wm_win(tt,t0,out);wm_link(c,410,318,m[1],400,ag_in(tt,t0,0.5),{col:AG.blue,alpha:0.7});c.restore();
          wm_pillAt(c,m[1],446,bad>0.5?m[0]+"?":m[0],tt,t0,out,{size:28,col:bad>0.5?AG.amber:null,icon:bad>0.5?"warn":null});});
        wm_pillAt(c,410,540,"nobody would know why",tt,T.known,out,{size:28,col:AG.amber});
        wm_arrow(c,[1376,716,1410,690,1440,676,1478,664],ag_in(tt,T.reached-0.2,0.6)*(1-ag_in(tt,out,0.4)),{col:AG.amber,lw:3.5,head:12,dash:[9,8]});}});
      wm_scr(cx,S,()=>wm_tag(cx,"One night in October",wm_win(tt,S3+0.6,out)));}},
    // what it might do alone was written nowhere: no one place to sign it, read it or stop it. Something had to change
    {at:S4,place:"wmBoard",keys:[[0,960,540,1.0]],push:0,draw:(cx,tt)=>{
      wm_thePage(cx,{blank:1,a:ag_in(tt,T.nowhere-0.4,0.5)});
      [["no place to sign it",T.signIt],["no place to read it",T.readIt],["no place to stop it",T.stopIt]].forEach((p,i)=>
        wm_pillL(cx,1080,300+i*96,p[0],tt,p[1]-0.1,c.change+0.4,{size:30,icon:"warn",col:AG.amber}));}},
    // so Anil wrote its mandate: one page, the one task it may do alone, line by line as the voice names them; on the map beside the
    // task it covers; signed by Anil and approved by Noor; and each line written into the tools that hold it
    {at:S5,place:"wmBoard",keys:[[0,960,540,1.0]],push:0,draw:(cx,tt)=>{
      const R0=[T.oneTask,T.andWhere,T.itsFolders,T.itsFolders+0.5,T.itsChecks,T.rounds,T.swW,T.undoW,T.signW-0.3,T.approved-0.2],
        R1=[T.andWhere,T.itsFolders,T.itsChecks,T.itsChecks,T.rounds,T.swW,T.undoW,T.onMap,T.approved,T.tools],
        tileAt=[T.tools-0.3,T.tools+0.1,T.tools+0.5],tileRow=[0,2,5];
      const P=wm_thePage(cx,{blank:1-ag_in(tt,T.wrote-0.2,0.9),show:i=>ag_in(tt,R0[i]-0.15,0.5),
        lit:i=>Math.max(wm_lit(tt,R0[i]-0.1,R1[i]),i===3&&ag_in(tt,T.beside-0.2,0.3)>0?0:0,i===0?wm_lit(tt,T.beside-0.2,T.signW-0.4):0,
          tileRow.indexOf(i)>=0?wm_lit(tt,tileAt[tileRow.indexOf(i)],tileAt[tileRow.indexOf(i)]+1.4):0),
        sign:clamp((tt-T.signW-0.1)/0.9,0,1),approve:clamp((tt-T.approved-0.1)/0.6,0,1)});
      // Anil, who wrote it, beside it while it's written; he leaves as the map comes in
      const an=ag_in(tt,T.wrote-0.6,0.5)*(1-ag_in(tt,T.onMap-0.9,0.5));
      if(an>0)wm_fade(cx,an,c2=>ag_person(c2,"anil",WM_ANIL[0],WM_ANIL[1],WM_ANIL[2],{t:tt,flip:true,gaze:[3,0.5],smile:0.2}));
      wm_pillAt(cx,WM_ANIL[0],404,"Anil Kurian, its owner",tt,T.wrote,T.onMap-0.9,{size:28,icon:"draft",col:AG.blue});
      // on the map: its stage beside each kind of task, and the mandate's line under the night task's
      const sa=wm_win(tt,T.onMap-0.3,T.tools-0.9);
      if(sa>0)wm_stageList(cx,WM_R.x,96,WM_R.w,{a:sa,k:wm_k(tt,T.onMap-0.3),lit:i=>i===3?ag_in(tt,T.beside-0.2,0.4):0,mandate:ag_in(tt,T.beside+0.2,0.9)});
      // the tools that hold its lines
      const TL=[{mark:"databricks",name:"Unity Catalog",sub:"its grants: where it may write"},{mark:"github",name:"GitHub",sub:"its push rules, and its run"},
        {mark:"databricks",name:"Unity Gateway",sub:"its limit, on its own name"}];
      TL.forEach((d,i)=>{const ta=ag_in(tt,tileAt[i],0.4);if(ta<=0)return;const ty=150+i*170,b=P.rows[tileRow[i]];
        cx.save();cx.globalAlpha*=ta;wm_link(cx,WM_P.x+WM_P.w+6,b.y+b.h/2,1056,ty+56,ag_in(tt,tileAt[i]+0.1,0.5),{col:AG.blue,alpha:0.7});cx.restore();
        wm_tile(cx,1060,ty,780,Object.assign({a:ta,k:wm_k(tt,tileAt[i])},d));});}},
    // last night: the plain check first, then the agent; three rounds; the cause, the three tutors counted twice, the one line put back
    // in its own model, checked in test; its report for Anil, twenty minutes after the failure; production never saw the bug
    {at:S6,place:"wmNight",keys:[[0,960,540,1.0]],push:0.012,draw:(cx,tt)=>{
      const st=ag_in(tt,T.started-0.2,0.6),lp=ag_in(tt,T.three-0.4,0.6)*(1-ag_in(tt,T.twenty-0.8,0.6)),
        ru=clamp((tt-T.three)/(T.foundWhy-T.three+0.8),0,1),fx=clamp((tt-T.fixedW)/1.6,0,1),ok=ag_in(tt,T.checkedW-0.1,0.6),
        mins=ag_keys(tt,[[S6,23*60+15],[T.started,23*60+16],[T.foundWhy,23*60+22],[T.fixedW,23*60+28],[T.twenty,23*60+34]]),
        rep=wm_win(tt,T.twenty-0.3,T.writtenDown-0.8),out=T.twenty-0.7;
      wm_room(cx,S,tt,{night:true,screen:ag_in(tt,T.waiting-0.4,0.3)>0.5?"report":"dark",time:mins,testLit:0.7,testCol:ok>0.5?AG.green:AG.amber,prodLit:0.35,
        agent:{think:0.2+0.6*st*(1-ok*0.6),core:0.6+0.4*st,loop:lp,ringP:ag_sine(clamp((tt-T.three+0.4)/0.8,0,1)),pulse:{deg:-120+ru*3*360,a:lp*(1-ag_in(tt,T.foundWhy+0.6,0.6))}},cards:c=>{
        // the plain check, before the agent starts: has tonight's copy arrived? yes, at 22:41
        const pa=wm_win(tt,S6+0.5,T.three-0.6);
        wm_script(c,100,130,"A plain check","Has tonight's copy arrived?",{a:pa,k:wm_k(tt,S6+0.5),w:620,turn:Math.max(0,tt-T.plain)*0.4,glow:ag_io(tt,T.plain-0.2,T.arrived+0.8,0.4)});
        wm_pillAt(c,860,192,"yes · 22:41",tt,T.arrived-0.1,T.three-0.6,{size:28,icon:"tick",col:AG.green});
        wm_pillAt(c,1040,300,"it starts · 23:16",tt,T.started,T.three-0.2,{size:28,col:AG.violet});
        wm_rounds(c,990,196,ru*3,wm_win(tt,T.three-0.3,out));
        // the cause: the day's change dropped the line that keeps only today's version of each contract
        const ca=wm_win(tt,T.foundWhy-0.3,out);
        wm_code(c,100,96,860,{a:ca,k:wm_k(tt,T.foundWhy-0.3),mark:"dbt",bad:ag_in(tt,T.every-0.3,0.5),gap:ag_in(tt,T.fixedW-0.4,0.6),fix:fx});
        // three tutors who moved this term, each counted twice: HR's two versions of their contracts
        const ka=wm_win(tt,T.tutors-0.3,out);
        wm_contracts(c,100,412,{a:ka,k:wm_k(tt,T.tutors-0.3),dup:ag_in(tt,T.countedTwice-0.6,1.0),fix:clamp((tt-T.checkedW+0.2)/1.4,0,1)});
        wm_pillL(c,120,600,"3 counted twice",tt,T.countedTwice,T.checkedW-0.2,{size:28,icon:"warn",col:AG.amber});
        wm_pillL(c,120,600,"passed in test",tt,T.checkedW+0.2,out,{size:28,icon:"tick",col:AG.green});
        wm_pillL(c,120,680,"nothing else changed",tt,T.nothingElse,out,{size:28,icon:"lock",col:AG.blue});
        // its report for Anil, above his desk, on his screen
        if(rep>0)wm_report(c,100,50,760,{a:rep,k:wm_k(tt,T.twenty-0.3),rowH:76,lines:clamp((tt-T.twenty)/0.35,0,5),tail:[709,604],tailSide:"bottom"});
        // production: only what passes its night in test, and a person's yes
        wm_pillAt(c,1670,540,"Nursing: 64, 38 casual",tt,T.neverSaw,null,{size:28,icon:"tick",col:AG.green});
        wm_arrow(c,[1376,716,1410,690,1440,676,1478,664],ag_in(tt,T.passes-0.3,0.6),{col:AG.blue,lw:3.5,head:12,dash:[9,8]});
        wm_pillAt(c,1660,640,"a person's yes",tt,T.yes-0.1,null,{size:28,icon:"lock",col:AG.blue});
        // and for data: autonomy written down, held in every tool, and taken back
        [["written down","draft",T.writtenDown],["held in every tool","lock",T.heldW],["can be taken back","undo",T.takenBack]].forEach((p,i)=>
          wm_pillL(c,330,236+i*100,p[0],tt,p[2]-0.1,null,{size:32,icon:p[1],col:AG.blue}));}});
      wm_scr(cx,S,()=>wm_tag(cx,"Last night · 23:15",wm_win(tt,S6+0.4,T.foundWhy-0.9)));}}]);
  ag_title(ctx,S,t,c.breath,"A mandate, written and enforced","what an agent may do alone, written down","FILM 7 OF 7 · FROM HELPER TO COLLEAGUE");
});

/* ---------------------------------------------------------------- 2 · One page, on the map */
// the map's column: Anil, who owns it; the workload agent; its role; the stage list on its assignment, at the right
const WM_COL={anil:[100,110,420],agent:[100,346,420],role:[100,566,420]},WM_SL={x:640,y:118,w:1000};
scene("page",(ctx,S,t,sc)=>{const c=sc.cues,T=wm_once(sc,"T",()=>({
    assigned:wAt(sc,"role","assigned"),itsRole:wAt(sc,"role","its role"),stage:wAt(sc,"role","its stage"),each:wAt(sc,"role","each kind of task"),
    night:wAt(sc,"line","the night task"),five:wAt(sc,"line","stage five"),more:wAt(sc,"line","one more line"),
    req:wAt(sc,"file","requirement"),gov:wAt(sc,"file","governance"),
    find:wAt(sc,"test","find why"),own:wAt(sc,"test","If the cause"),
    prW:wAt(sc,"pr","pull request"),six:wAt(sc,"pr","report by six"),
    elseW:wAt(sc,"else","anywhere else"),nothingW:wAt(sc,"else","change nothing"),
    read:wAt(sc,"prod","read"),draftW:wAt(sc,"prod","draft the fix"),rerun:wAt(sc,"prod","Never rerun"),
    neverW:wAt(sc,"never","never change"),meaning:wAt(sc,"never","A question of meaning"),
    plainW:wAt(sc,"first","a plain check"),ifNot:wAt(sc,"first","If not"),
    sameErr:wAt(sc,"twice","The same error twice"),stops:wAt(sc,"twice","it stops"),
    signing:wAt(sc,"gate","Signing it"),gateW:wAt(sc,"gate","its gate"),fourteen:wAt(sc,"gate","fourteen nights"),miss:wAt(sc,"gate","without a miss"),
    risk:wAt(sc,"law","high-risk"),und:wAt(sc,"law","understand it"),watch:wAt(sc,"law","watch it"),rev:wAt(sc,"law","reverse it"),stopW:wAt(sc,"law","stop it"),
    oneKind:wAt(sc,"one","one kind of task"),word:wAt(sc,"one","a word about staff"),suggests:wAt(sc,"one","only suggests")}));
  const P2=c.file-0.5,P3=c.test-0.6,P4=c.gate-0.6,P5=c.law-0.6,P6=c.one-0.6;
  // the detail cards beside the page, one after another, each with the page's row it opens
  const DET=[{at:c.test,to:c.prod,row:0,kick:"In test",items:[["Find why the night build failed","n",T.find],["If the cause is in its own models: fix it on its own branch, in its own schema","n",T.own],
      ["Then open a pull request, and report by 06:00","n",T.prW],["If the cause is anywhere else: tell that part's owner, and change nothing","no",T.elseW]]},
    {at:c.prod,to:c.never,row:1,kick:"In production",items:[["Read, find the cause, and draft the fix","n",T.read],["Never rerun: a plain job does that","no",T.rerun]]},
    {at:c.never,to:c.first,row:3,kick:"Everywhere",items:[["Never change a test, a seed, a contract or a definition","no",T.neverW],["A question of meaning goes to its owner","n",T.meaning]]},
    {at:c.first,to:c.twice,row:4,kick:"Checks",items:[["First, a plain check: has tonight's copy arrived?","gear",T.plainW],["If not, nothing starts, and Sam is told","no",T.ifNot]]},
    {at:c.twice,to:null,row:5,kick:"Limits",items:[["10 rounds · 1 hour · a set budget","n",c.twice],["The same error twice: it stops and reports","warn",T.stops]]}];
  ag_shots(ctx,S,t,sc.dur,[
    // on the map: the workload agent, owned by Anil, assigned to its role, with its stage beside each kind of task; beside the night
    // task, at stage five, one more line: its mandate
    {at:0,place:"wmBoard",keys:[[0,960,540,1.0]],push:0,draw:(cx,tt)=>{
      const M=wm_onMap(cx,{pos:WM_COL,show:k=>({anil:ag_in(tt,0.3,0.5),owner:ag_in(tt,0.6,0.7),agent:ag_in(tt,0.5,0.5),assign:ag_in(tt,T.assigned-0.2,0.7),role:ag_in(tt,T.itsRole-0.2,0.5)})[k],
        glow:k=>k==="agent"?AG.violet:null});
      const la=ag_in(tt,T.stage-0.3,0.5),q=M.assignAt;
      if(la>0){cx.save();cx.globalAlpha*=la;cx.strokeStyle=rgba(AG.blue,0.6);cx.lineWidth=2.6;cx.setLineDash([8,7]);cx.beginPath();cx.moveTo(q[0]+10,q[1]);cx.lineTo(WM_SL.x-6,q[1]);cx.stroke();cx.setLineDash([]);cx.restore();}
      wm_stageList(cx,WM_SL.x,WM_SL.y,WM_SL.w,{a:la,k:wm_k(tt,T.stage-0.3),show:i=>ag_in(tt,T.each-0.2+i*0.18,0.4),lit:i=>i===3?ag_in(tt,T.night-0.2,0.4):0,mandate:ag_in(tt,T.more,1.0)});}},
    // the mandate itself: a requirement, kept with the project's governance, in governance/8-mandates/
    {later:true,at:P2,place:"wmBoard",keys:[[0,960,540,1.0]],push:0,draw:(cx,tt)=>{
      const F=wm_folders(cx,120,120,600,{lit:ag_in(tt,T.gov-0.2,0.5),show:i=>ag_in(tt,P2+0.5+i*0.08,0.4)});
      const r=F.rows[7],ya=ag_in(tt,P2+0.9,0.5);
      cx.save();cx.globalAlpha*=ya;wm_link(cx,r.x+r.w+8,r.y+r.h/2,800,340,ag_in(tt,P2+1.0,0.6),{col:AG.blue,alpha:0.7});cx.restore();
      wm_yaml(cx,810,150,960,{a:ya,k:wm_k(tt,P2+0.9),show:i=>ag_in(tt,P2+1.1+i*0.12,0.4),lit:i=>i===1?ag_in(tt,T.req-0.2,0.4):i===2?ag_in(tt,T.gov,0.4)*0.6:0});}},
    // the page, line by line: in test, in production, everywhere, its checks, its limits
    {later:true,at:P3,place:"wmBoard",keys:[[0,960,540,1.0]],push:0,draw:(cx,tt)=>{
      wm_thePage(cx,{sign:1,approve:1,lit:i=>{let v=0;DET.forEach(d=>{if(d.row===i)v=Math.max(v,wm_lit(tt,d.at-0.2,d.to==null?P4:d.to-0.6));});return v;}});
      DET.forEach(d=>{const a=wm_win(tt,d.at-0.3,d.to==null?null:d.to-0.75);if(a<=0)return;
        wm_detail(cx,WM_R.x,96,WM_R.w,{a,k:wm_k(tt,d.at-0.3),kick:d.kick,edge:AG.blue,edgeA:0.45,items:d.items.map(it=>({text:it[0],mark:it[1],a:ag_in(tt,it[2]-0.2,0.4),
          mcol:it[1]==="no"||it[1]==="warn"?AG.amber:AG.blue}))});});}},
    // signing it was the last step of its gate to stage five, after fourteen nights in test without a miss
    {later:true,at:P4,place:"wmBoard",keys:[[0,960,540,1.0]],push:0,draw:(cx,tt)=>{
      const pass=ag_in(tt,T.miss+0.5,0.5);
      wm_stages(cx,150,800,1660,{k:[0,1,2,3,4].map(i=>ag_in(tt,P4+0.3+i*0.12,0.5)),lit:[0,0,0,0,ag_in(tt,T.gateW-0.2,0.5)],dim:0.3,gates:true,passed:[1,1,1,1,pass],
        gate:{i:4,a:ag_in(tt,T.gateW-0.3,0.5),k:wm_k(tt,T.gateW-0.3),x:860,y:40}});
      const na=ag_in(tt,T.fourteen-0.3,0.4);if(na>0){ag_T(cx,"14 nights in test",180,206,{w:700,size:28,col:AG.mut,a:na});wm_nights(cx,200,262,{n:14,u:clamp((tt-T.fourteen)/1.6,0,1),a:na});}}},
    // Europe's AI law: people who can understand it, watch it, reverse it and stop it
    {later:true,at:P5,place:"wmBoard",keys:[[0,960,540,1.0]],push:0,draw:(cx,tt)=>{
      wm_law(cx,360,170,1200,{a:ag_in(tt,P5+0.5,0.5),k:wm_k(tt,P5+0.5),show:i=>ag_in(tt,[T.und,T.watch,T.rev,T.stopW][i]-0.2,0.4)});}},
    // it covers one kind of task; on what a word about staff means, the same agent only suggests
    {later:true,at:P6,place:"wmBoard",keys:[[0,960,540,1.0]],push:0,draw:(cx,tt)=>{
      const b=wm_stageList(cx,420,150,1000,{a:ag_in(tt,P6+0.5,0.5),k:wm_k(tt,P6+0.5),mandate:1,lit:i=>i===3?ag_io(tt,T.oneKind-0.3,T.word-0.2,0.4):i===0?ag_in(tt,T.word-0.2,0.4):0,
        litCol:i=>i===0?AG.violet:AG.blue});
      const r=b.rows[0];wm_pillL(cx,1460,r.y+r.h/2,"only suggests",tt,T.suggests-0.1,null,{size:28,col:AG.violet});}}]);
});

/* ---------------------------------------------------------------- 3 · Held in every tool */
scene("held",(ctx,S,t,sc)=>{const c=sc.cues,T=wm_once(sc,"T",()=>({
    words:wAt(sc,"words","only words"),intoW:wAt(sc,"words","written into the tools"),
    uc:wAt(sc,"grants","Unity Catalog's grants"),inTest:wAt(sc,"grants","in test"),inProd:wAt(sc,"grants","in production"),
    gh:wAt(sc,"folders","GitHub's push rules"),app:wAt(sc,"folders","its App can't push"),
    timeout:wAt(sc,"hour","timeout"),sixty:wAt(sc,"hour","at sixty minutes"),
    plainCode:wAt(sc,"rounds","plain code"),notModel:wAt(sc,"rounds","not by the model"),
    ug:wAt(sc,"budget","Unity Gateway"),fifty:wAt(sc,"budget","fifty thousand"),caps:wAt(sc,"budget","caps a night's cost"),
    step:wAt(sc,"first","first step"),
    against:wAt(sc,"agree","checks the page"),more:wAt(sc,"agree","allows more"),fails:wAt(sc,"agree","the check fails"),
    reads:wAt(sc,"widen","Nothing the agent reads"),neither:wAt(sc,"widen","neither can the agent"),lives:wAt(sc,"widen","the page lives")}));
  // which of the page's rows each tool holds, and from when; a row once held keeps a small mark of it
  const HOLD=[[0,c.grants],[1,c.grants],[2,c.folders],[3,c.folders],[5,c.hour],[4,c.first]];
  const Wn=[c.grants,c.folders,c.hour,c.rounds,c.budget,c.first,c.agree,c.widen,null];
  // the place for the line now being said: in from its line, out before the next comes in
  const at=(i,tt)=>wm_win(tt,Wn[i]-0.3,Wn[i+1]==null?null:Wn[i+1]-0.75),k=(i,tt)=>wm_k(tt,Wn[i]-0.3),X=WM_R.x,Wd=WM_R.w;
  ag_shots(ctx,S,t,sc.dur,[
    {later:true,at:0,place:"wmBoard",keys:[[0,960,540,1.0]],push:0,draw:(cx,tt)=>{
      const lit=i=>{let v=0;if(i<=1)v=wm_lit(tt,c.grants-0.2,c.folders-0.6);if(i===2||i===3)v=wm_lit(tt,c.folders-0.2,c.hour-0.6);
        if(i===5)v=wm_lit(tt,c.hour-0.2,c.first-0.6);if(i===4)v=wm_lit(tt,c.first-0.2,c.agree-0.6);if(i>=8)v=wm_lit(tt,c.widen-0.2,sc.dur);
        if(c.agree-0.2<tt&&tt<c.widen-0.6)v=Math.max(v,0.5*wm_lit(tt,c.agree-0.2,c.widen-0.6));return v;};
      wm_thePage(cx,{sign:1,approve:1,lit,held:i=>{const h=HOLD.find(q=>q[0]===i);return h?ag_in(tt,h[1]+0.6,0.4):0;},locked:ag_in(tt,T.lives-0.1,0.5)});
      // a page is only words; so each line goes into the tools from the map
      wm_pillL(cx,X+20,140,"a page is only words",tt,T.words-0.1,T.intoW-0.2,{size:30,icon:"warn",col:AG.amber});
      wm_pillL(cx,X+20,140,"so each line goes into a tool",tt,T.intoW-0.1,c.grants-0.75,{size:30,icon:"lock",col:AG.blue});
      // where it may write: Unity Catalog's grants
      wm_place(cx,X,96,Wd,{a:at(0,tt),k:k(0,tt),mark:"databricks",kick:"Unity Catalog · grants",title:"Where it may write",
        rows:[{name:"In test",value:"its own schema",lit:ag_in(tt,T.inTest-0.2,0.4),mark:"tick"},{name:"In production",value:"nowhere: it only reads",lit:ag_in(tt,T.inProd-0.2,0.4),mark:"lock"}]});
      // its folders: GitHub's push rules for its App
      wm_detail(cx,X,96,Wd,{a:at(1,tt),k:k(1,tt),mark:"github",kick:"GitHub · push rules",title:"Where its App may push",edge:AG.blue,edgeA:0.45,
        items:[{text:"models/marts/workload/",mark:"file",folder:true,f:"mono",size:28},{text:"models/intermediate/workload/",mark:"file",folder:true,f:"mono",size:28},
          {text:"analyses/workload/",mark:"file",folder:true,f:"mono",size:28},{text:"Anywhere else: blocked",mark:"no",mcol:AG.amber,a:ag_in(tt,T.app-0.1,0.4)}]});
      // the hour: its run's timeout
      wm_place(cx,X,96,Wd,{a:at(2,tt),k:k(2,tt),mark:"github",kick:"GitHub Actions · its run",title:"One hour",
        rows:[{name:"Its job's timeout",value:"timeout-minutes: 60",lit:ag_in(tt,T.timeout-0.2,0.4)},{name:"At sixty minutes",value:"GitHub cancels the job",a:ag_in(tt,T.sixty-0.2,0.4)}]});
      // its rounds: counted by the plain code that runs it
      const ra=at(3,tt);if(ra>0){wm_script(cx,X,120,"The plain code that runs it","counts its rounds: at most 10",{a:ra,k:k(3,tt),w:Wd,turn:Math.max(0,tt-T.plainCode)*0.4});
        wm_pillL(cx,X+20,300,"not the model",tt,T.notModel-0.1,c.budget-0.75,{size:30,col:AG.violet});}
      // its budget: a rate limit in Unity Gateway, on its own name
      wm_place(cx,X,96,Wd,{a:at(4,tt),k:k(4,tt),mark:"databricks",kick:"Unity Gateway · rate limit",title:"On its own name",
        rows:[{name:"workload agent",value:"50,000 tokens a minute",lit:ag_in(tt,T.fifty-0.2,0.4)},{name:"With the hour",value:"at most 3 million a night",a:ag_in(tt,T.caps-0.3,0.4)}]});
      // the plain check: its run's first step
      wm_place(cx,X,96,Wd,{a:at(5,tt),k:k(5,tt),mark:"github",kick:"GitHub Actions · its run",title:"Its first step",
        rows:[{name:"Step 1, before the agent",value:"has tonight's copy arrived?",lit:ag_in(tt,T.step-0.2,0.4)}]});
      // the project's check: the page against every place; a grant that allows more fails it, before anything merges
      wm_checks(cx,X,96,Wd,{a:at(6,tt),k:k(6,tt),rows:i=>ag_in(tt,T.against+0.2+i*0.22,0.35),fail:ag_in(tt,T.more-0.2,0.7),pass:ag_in(tt,T.against+1.2,0.4)*(1-ag_in(tt,T.more-0.2,0.4))});
      // nothing it reads widens it, and neither can it: the page lives where its App can't push
      const fa=at(7,tt);if(fa>0){const F=wm_folders(cx,X,96,Wd,{a:fa,k:k(7,tt),lit:ag_in(tt,T.lives-0.2,0.5)}),r=F.rows[7];
        cx.save();cx.globalAlpha*=fa*ag_in(tt,T.lives,0.4);ag_lock(cx,r.x+r.w-150,r.y+r.h/2+4,28,rgba(AG.blue,1));cx.restore();
        wm_pillL(cx,X+20,F.y+F.h+52,"its App can't push here",tt,T.lives+0.1,null,{size:28,icon:"lock",col:AG.blue});}}}]);
});

/* ---------------------------------------------------------------- 4 · Alone in test, a draft in production */
scene("alone",(ctx,S,t,sc)=>{const c=sc.cues,T=wm_once(sc,"T",()=>({
    twoW:wAt(sc,"two","two things"),same:wAt(sc,"two","the same count"),
    first:wAt(sc,"bug","The first"),rule:wAt(sc,"bug","The rule is written"),counted:wAt(sc,"bug","The code counted"),
    putting:wAt(sc,"may","Putting that right"),inTest:wAt(sc,"may","in test"),
    second:wAt(sc,"moved","The second"),nursing:wAt(sc,"moved","Nursing unit"),ph:wAt(sc,"moved","Public Health"),
    both:wAt(sc,"which","both schools"),noRule:wAt(sc,"which","No rule says"),
    notBug:wAt(sc,"decide","not a bug"),hrW:wAt(sc,"decide","HR decides"),asked:wAt(sc,"decide","asked in its report"),nothingW:wAt(sc,"decide","changed nothing"),
    apartW:wAt(sc,"apart","tell the two apart"),person:wAt(sc,"apart","neither can a person"),
    inProd:wAt(sc,"draft","in production"),jun:wAt(sc,"draft","Jun reviews"),meaning:wAt(sc,"draft","a meaning goes"),noor:wAt(sc,"draft","Noor approves"),
    guess:wAt(sc,"costs","a wrong guess"),nobody:wAt(sc,"costs","nobody approves"),
    again:wAt(sc,"rerun","run again"),noAgent:wAt(sc,"rerun","needs no agent"),plainJob:wAt(sc,"rerun","a plain job")}));
  const A2=c.draft-0.8,L1={x:80,w:820},L2={x:1020,w:820};
  ag_shots(ctx,S,t,sc.dur,[
    // two things wrong with the same count: a bug, which has a written rule, and a question no rule answers
    {later:true,at:0,place:"wmBoard",keys:[[0,960,540,1.0]],push:0,draw:(cx,tt)=>{
      const ca=wm_win(tt,0.4,T.apartW-0.5);
      if(ca>0){ag_textCard(cx,660,60,600,{kick:"In test, last night",title:"Nursing: 67 teachers"},{a:ca,k:wm_k(tt,0.4),kickCol:AG.amber,edge:AG.amber});
        [[L1.x+L1.w/2,"1",T.twoW],[L2.x+L2.w/2,"2",T.twoW+0.3]].forEach(p=>{const u=ag_in(tt,p[2],0.6);if(u<=0)return;cx.save();cx.globalAlpha*=ca;
          wm_arrow(cx,[p[0]<960?660:1260,170,p[0]<960?520:1400,170,p[0],190,p[0],282],u,{col:AG.amber,lw:3,head:11});cx.restore();});}
      wm_pillAt(cx,960,150,"a bug, or what a word means?",tt,T.apartW-0.1,null,{size:30,icon:"warn",col:AG.amber});
      // 1: a bug, with a written rule; the fix the mandate lets it make, in test
      const b1=wm_win(tt,T.first-0.3,null);
      wm_detail(cx,L1.x,300,L1.w,{a:b1,k:wm_k(tt,T.first-0.3),kick:"1 · A bug",kickCol:AG.amber,edge:AG.amber,edgeA:0.4,items:[
        {text:"The rule is written: each contract counts once, as it stands today",mark:"tick",mcol:AG.green,a:ag_in(tt,T.rule-0.2,0.4)},
        {text:"The code counted every version",mark:"no",mcol:AG.amber,a:ag_in(tt,T.counted-0.2,0.4)},
        {text:"A fix its mandate lets it make, in test",mark:"tick",mcol:AG.green,a:ag_in(tt,T.putting-0.2,0.4)}]});
      wm_contracts(cx,L1.x+38,640,{a:ag_in(tt,T.counted-0.3,0.5)*b1,dup:ag_in(tt,T.counted,0.9),fix:clamp((tt-T.inTest+0.3)/1.4,0,1)});
      // 2: a question: the tutor who moved; both schools, or only the one they teach in now? No rule says; HR decides it
      const b2=wm_win(tt,T.second-0.3,null);
      wm_moved(cx,L2.x+15,300,{a:b2,k:wm_k(tt,T.second-0.3),arrow:ag_in(tt,T.ph-0.4,0.7),now:ag_in(tt,T.ph,0.4)*0.6});
      wm_detail(cx,L2.x,480,L2.w,{a:wm_win(tt,T.both-0.4,null),k:wm_k(tt,T.both-0.4),kick:"2 · A question",kickCol:AG.violet,edge:AG.violet,edgeA:0.4,items:[
        {text:"Both schools this term, or only the one they teach in now?",mark:"warn",mcol:AG.amber,a:ag_in(tt,T.both-0.3,0.4)},
        {text:"No rule says",mark:"no",mcol:AG.amber,a:ag_in(tt,T.noRule-0.2,0.4)},
        {text:"What a word about staff means: HR decides it",mark:"n",n:"?",mcol:AG.violet,a:ag_in(tt,T.hrW-0.3,0.4)},
        {text:"It asked in its report, and changed nothing",mark:"tick",mcol:AG.green,a:ag_in(tt,T.asked-0.2,0.4)}]});}},
    // so in production it only drafts: a pull request for Jun, the meaning for its owner, and Noor's yes; in test a wrong guess
    // costs only a pull request nobody approves; and a night that only needs to run again needs no agent
    {at:A2,place:"wmNight",keys:[[0,960,540,1.0]],push:0.012,draw:(cx,tt)=>{
      const pj=ag_in(tt,T.again-0.2,0.6),dr=wm_win(tt,A2+0.6,T.guess-0.75);
      wm_room(cx,S,tt,{night:true,screen:"dark",time:23*60+33,testLit:0.7,testCol:AG.green,prodLit:0.35,agent:{think:0.3*(1-pj),core:0.8-0.4*pj},cards:c=>{
        if(dr>0){const b=wm_pr(c,520,70,660,{a:dr,k:wm_k(tt,A2+0.6),dashed:1,kick:"PULL REQUEST · A DRAFT",title:"Count each contract once, as it stands today",by:"Opened by workload-agent[bot]",
            rows:[{text:"Jun reviews the code",state:"wait",a:ag_in(tt,T.jun-0.2,0.4)},{text:"A meaning goes to its owner",state:"wait",a:ag_in(tt,T.meaning-0.2,0.4)},
              {text:"Noor approves, as a second person",state:"lock",a:ag_in(tt,T.noor-0.2,0.4)}]});
          c.save();c.globalAlpha*=dr;wm_arrow(c,[b.x+b.w+6,b.y+120,1300,140,1430,200,1476,262],ag_in(tt,T.inProd-0.1,0.6),{col:AG.blue,lw:3.5,head:12,dash:[9,8]});c.restore();}
        wm_pillAt(c,1670,420,"it only drafts",tt,T.inProd,T.guess-0.75,{size:28,icon:"draft",col:AG.blue});
        // in test: a wrong guess, a pull request nobody approves
        const ga=wm_win(tt,T.guess-0.3,T.again-0.75);
        wm_pr(c,520,150,640,{a:ga,k:wm_k(tt,T.guess-0.3),kick:"PULL REQUEST",title:"A wrong guess, in test",rows:[{text:"Nobody approves it",state:"no",a:ag_in(tt,T.nobody-0.2,0.4)}]});
        // a plain job reruns the night: no agent needed
        const ja=wm_win(tt,T.again-0.3,null);
        if(ja>0){wm_script(c,520,180,"A plain job","runs the night again",{a:ja,k:wm_k(tt,T.again-0.3),w:600,turn:Math.max(0,tt-T.plainJob)*0.5,glow:ag_io(tt,T.plainJob-0.2,T.plainJob+1.6,0.4)});
          wm_pillAt(c,820,380,"no agent needed",tt,T.noAgent,null,{size:28,icon:"tick",col:AG.green});}}});
      wm_scr(cx,S,()=>wm_tag(cx,"At night",wm_win(tt,A2+0.6,null)));}}]);
});

/* ---------------------------------------------------------------- 5 · A switch, and an undo */
scene("stop",(ctx,S,t,sc)=>{const c=sc.cues,T=wm_once(sc,"T",()=>({
    two:wAt(sc,"shown","Two lines"),
    sp:wAt(sc,"switch","service principal"),suspends:wAt(sc,"switch","suspends its App"),
    sign:wAt(sc,"sp","can't sign in"),stay:wAt(sc,"sp","its grants stay"),
    repo:wAt(sc,"app","can't reach the repository"),works:wAt(sc,"app","everyone else works on"),
    anil:wAt(sc,"who","Anil may stop it"),sam:wAt(sc,"who","so may Sam"),hour:wAt(sc,"who","at any hour"),
    pr:wAt(sc,"undo","a pull request"),reverted:wAt(sc,"undo","reverted"),
    versions:wAt(sc,"table","keeps its versions"),who:wAt(sc,"table","who wrote each one"),restore:wAt(sc,"table","restore the one before"),seven:wAt(sc,"table","seven days"),
    taken:wAt(sc,"back","taken back"),narrow:wAt(sc,"back","narrow or withdraw"),waits:wAt(sc,"back","the task waits"),
    dec:wAt(sc,"december","Each December"),access:wAt(sc,"december","access review"),
    nobody:wAt(sc,"none","nobody needed")}));
  const X2=c.switch-0.6,X3=c.undo-0.6,X4=c.back-0.6,X5=c.none-0.6,PEOPLE={anil:[1240,700,0.8],sam:[1640,700,0.8]};
  const person=(cx,tt,who,a)=>{if(a<=0)return;const p=PEOPLE[who];wm_fade(cx,a,c2=>ag_person(c2,who,p[0],p[1],p[2],{t:tt+(who==="sam"?1.7:0),flip:true,gaze:[3,0.4],smile:0.25}));};
  ag_shots(ctx,S,t,sc.dur,[
    // two lines more: the switch and the undo, shown here, not used
    {at:0,place:"wmBoard",keys:[[0,960,540,1.0]],push:0,draw:(cx,tt)=>{
      wm_thePage(cx,{sign:1,approve:1,lit:i=>i===6||i===7?ag_in(tt,T.two,0.5):0});
      wm_pillL(cx,WM_R.x+20,300,"shown here, not used",tt,T.two+0.4,null,{size:30,col:AG.blue});}},
    // the switch: Sam deactivates its service principal and suspends its App; then it can't sign in, and its grants stay; it can't
    // reach the repository, and everyone else works on; Anil may stop it too, and so may Sam, at any hour, without asking first
    {later:true,at:X2,place:"wmBoard",keys:[[0,960,540,1.0]],push:0,draw:(cx,tt)=>{
      wm_switches(cx,100,80,860,{a:ag_in(tt,X2+0.5,0.5),k:wm_k(tt,X2+0.5),show:i=>ag_in(tt,[T.sp,T.suspends][i]-0.3,0.4),glow:i=>ag_io(tt,[T.sp,T.suspends][i]-0.2,[T.sign,T.repo][i]+1.6,0.4)});
      const offA=ag_in(tt,T.sign-0.5,0.5);if(offA>0)ag_T(cx,"Once it's off:",120,516,{w:700,size:28,col:AG.mut,a:offA});
      [["it can't sign in","lock",T.sign,AG.amber],["its grants stay","tick",T.stay,AG.green],["it can't reach the repository","lock",T.repo,AG.amber],["everyone else works on","tick",T.works,AG.green]]
        .forEach((p,i)=>wm_pillL(cx,120,568+i*80,p[0],tt,p[2]-0.1,null,{size:28,icon:p[1],col:p[3]}));
      person(cx,tt,"sam",ag_in(tt,X2+0.6,0.5));person(cx,tt,"anil",ag_in(tt,T.anil-0.3,0.5));
      wm_pillAt(cx,PEOPLE.sam[0],410,"Sam, data platform",tt,X2+0.8,null,{size:28});
      wm_pillAt(cx,PEOPLE.anil[0],410,"Anil, its owner",tt,T.anil-0.1,null,{size:28});
      wm_pillAt(cx,1440,310,"at any hour, without asking first",tt,T.hour-0.1,null,{size:28,icon:"tick",col:AG.green});}},
    // the undo: every change it proposes is a pull request, which can be reverted; and each table keeps its versions, with who wrote
    // each and when, so a person can restore the one before, by default for seven days
    {later:true,at:X3,place:"wmBoard",keys:[[0,960,540,1.0]],push:0,draw:(cx,tt)=>{
      const ra=ag_in(tt,T.reverted-0.2,0.5);
      wm_pr(cx,100,96,820,{a:ag_in(tt,T.pr-0.4,0.5),k:wm_k(tt,T.pr-0.4),title:"Count each contract once, as it stands today",by:"Opened by workload-agent[bot]",
        rows:[{text:"Merged",state:"tick"},{text:"Can be reverted: one more pull request",state:"undo",a:ra}]});
      wm_versions(cx,1000,96,840,{a:ag_in(tt,T.versions-0.3,0.5),k:wm_k(tt,T.versions-0.3),show:i=>ag_in(tt,T.who-0.2+i*0.15,0.4),lit:1,litA:ag_in(tt,T.restore-0.2,0.5)});
      wm_pillL(cx,1020,548,"restore the one before",tt,T.restore,null,{size:28,icon:"undo",col:AG.green});
      wm_pillL(cx,1020,630,"by default, for 7 days",tt,T.seven-0.1,null,{size:28,col:AG.blue});}},
    // the mandate itself can be taken back: Anil narrows or withdraws it in a pull request, and the night task waits for him again;
    // each December it's read again, with the access review
    {later:true,at:X4,place:"wmBoard",keys:[[0,960,540,1.0]],push:0,draw:(cx,tt)=>{
      const w=ag_in(tt,T.waits,0.8);
      wm_pr(cx,100,96,820,{a:ag_in(tt,T.taken-0.3,0.5),k:wm_k(tt,T.taken-0.3),title:"Narrow or withdraw the mandate",by:"Opened by Anil Kurian, its owner",branch:WM_FILE,
        rows:[{text:"Anil's to change, at any time",state:"wait",tick:ag_in(tt,T.narrow,0.4),a:ag_in(tt,T.narrow-0.2,0.4)}]});
      wm_stageList(cx,1000,96,840,{a:ag_in(tt,T.narrow,0.5),k:wm_k(tt,T.narrow),mandate:1,mandateA:1-0.65*w,lit:i=>i===3?ag_in(tt,T.waits-0.3,0.4):0,litCol:i=>AG.amber,
        num:i=>i===3?[5,4,w]:null});
      wm_pillL(cx,1020,720,"the night task waits for Anil",tt,T.waits+0.3,T.dec-0.7,{size:28,icon:"warn",col:AG.amber});
      wm_pillL(cx,1020,720,"each December, read again",tt,T.dec-0.1,null,{size:28,icon:"tick",col:AG.blue});
      wm_pillL(cx,1020,806,"with the access review",tt,T.access-0.1,null,{size:28,col:AG.blue});}},
    // last night, nobody needed either
    {later:true,at:X5,place:"wmBoard",keys:[[0,960,540,1.0]],push:0,draw:(cx,tt)=>{
      wm_thePage(cx,{sign:1,approve:1,lit:i=>i===6||i===7?0.6:0,litCol:()=>AG.green});
      wm_pillL(cx,WM_R.x+20,300,"last night: neither needed",tt,T.nobody-0.1,null,{size:30,icon:"tick",col:AG.green});}}]);
});

/* ---------------------------------------------------------------- 6 · Five stages, each with its gate */
scene("close",(ctx,S,t,sc)=>{const c=sc.cues,T=wm_once(sc,"T",()=>({
    read:wAt(sc,"morning","read the report"),measures:wAt(sc,"morning","its measures"),three:wAt(sc,"morning","three rounds"),
    merged:wAt(sc,"jun","merged it"),ran:wAt(sc,"jun","ran in test again"),yes:wAt(sc,"jun","said yes"),
    withHR:wAt(sc,"hr","with HR"),
    nursing:wAt(sc,"count","Nursing counts"),decided:wAt(sc,"count","decided nothing"),
    stages:wAt(sc,"began","five stages"),
    whose:wAt(sc,"three","whose identity"),howMuch:wAt(sc,"three","how much it may do"),person:wAt(sc,"three","what the person does"),
    mapW:wAt(sc,"gate","written on the map"),itsGate:wAt(sc,"gate","its gate"),last:wAt(sc,"gate","The last"),written:wAt(sc,"gate","written,"),narrow:wAt(sc,"gate","narrow"),revoc:wAt(sc,"gate","revocable"),
    seven:wAt(sc,"seven","Seven films"),
    longer:wAt(sc,"road","a longer road"),helps:wAt(sc,"road","helps one person"),beside:wAt(sc,"road","works beside"),
    nextW:wAt(sc,"next","Next")}));
  const end=c.breath,L=[1,2,3,4,5,6,7].map(i=>c["l"+i]),C2=c.began-0.6,C3=c.seven-0.5;
  ag_shots(ctx,S,t,sc.dur,[
    // back at the university this morning: Anil reads the report and its measures; Jun merges the fix, it runs in test again, and
    // Noor says yes for production; the question is with HR; Nursing counts 64 teachers, 38 of them casual
    {at:0,place:"wmLab",keys:[[0,960,540,1.0]],push:0.012,draw:(cx,tt)=>{
      const pa=wm_win(tt,c.jun-0.3,c.hr-0.75),ok=ag_in(tt,T.ran,0.5),py=ag_in(tt,T.yes+0.2,0.6);
      wm_room(cx,S,tt,{anil:1,anilGaze:[5,-1],screen:tt<c.jun?"report":"pr",time:8*60+40,testLit:0.4+0.4*ok,testCol:ok>0.5?AG.green:AG.blue,prodLit:0.3+0.5*py,agent:{think:0.15,core:0.7},cards:c2=>{
        const ra=wm_win(tt,T.read-0.3,c.jun-0.75);
        if(ra>0)wm_report(c2,520,30,660,{a:ra,k:wm_k(tt,T.read-0.3),title:false,rowH:74,measures:ag_in(tt,T.measures-0.2,0.8),tail:[709,604],tailSide:"bottom"});
        if(pa>0)wm_pr(c2,520,40,660,{a:pa,k:wm_k(tt,c.jun-0.3),title:"Count each contract once, as it stands today",by:"Opened by workload-agent[bot]",
          rows:[{text:"Reviewed and merged: Jun Park",state:"wait",tick:ag_in(tt,T.merged,0.4)},{text:"In test again: passed",state:"wait",tick:ag_in(tt,T.ran+0.3,0.4)},
            {text:"Production: Noor Rahman, yes",state:"wait",tick:ag_in(tt,T.yes+0.2,0.4)}]});
        const ha=wm_win(tt,c.hr-0.3,c.count-0.75);
        if(ha>0)ag_textCard(c2,520,92,640,{kick:"With HR",title:"Where a tutor who moved counts",sub:"in both schools, or where they teach now"},{a:ha,k:wm_k(tt,c.hr-0.3),kickCol:AG.violet,edge:AG.violet,edgeA:0.5});
        const na=wm_win(tt,c.count-0.3,C2-0.6);
        if(na>0){ag_textCard(c2,520,92,640,WM_SCHOOL,{a:na,k:wm_k(tt,c.count-0.3),kickCol:AG.blue,edge:AG.green,edgeA:0.6,tail:{side:"bottom",at:0.94,px:1236,py:404}});
          const tk=na*ag_in(tt,c.count+0.5,0.4);if(tk>0){c2.save();c2.globalAlpha*=tk;ag_tick(c2,520+640-52,92+76,30,rgba(AG.green,1),4.4);c2.restore();}}
        wm_pillAt(c2,760,340,"it decided nothing a person owns",tt,T.decided-0.1,C2-0.6,{size:28,icon:"tick",col:AG.green});}});
      wm_scr(cx,S,()=>wm_tag(cx,"The university · this morning",wm_win(tt,0.4,T.read-0.7)));}},
    // the series began with five stages: each changes whose identity, how much it may do, and what the person does; each written on
    // the map, each with its gate; the last a mandate, written, narrow and revocable
    {at:C2,place:"wmBoard",keys:[[0,960,540,1.0]],push:0,draw:(cx,tt)=>{
      const g=ag_in(tt,T.itsGate-0.3,0.5),gp=i=>ag_in(tt,T.itsGate+0.2+i*0.35,0.4);
      wm_stages(cx,150,800,1660,{k:[0,1,2,3,4].map(i=>ag_in(tt,C2+0.5+i*0.14,0.5)),lit:[0,0,0,0,ag_in(tt,T.whose-0.3,0.5)],dim:0.25*ag_in(tt,T.whose-0.3,0.5),
        gates:[g,g,g,g,g],passed:[0,1,2,3,4].map(gp),gate:{i:4,a:wm_win(tt,T.last-0.3,null),k:wm_k(tt,T.last-0.3),x:860,y:40},
        facts:{i:4,a:wm_win(tt,T.whose-0.3,T.last-0.75),k:wm_k(tt,T.whose-0.3),x:150,y:60,w:820}});
      [["written",T.written],["narrow",T.narrow],["revocable",T.revoc]].forEach((p,i)=>wm_pillL(cx,180+i*230,300,p[0],tt,p[1]-0.1,null,{size:30,icon:"tick",col:AG.green}));}},
    // seven films, seven lessons, each as it's said; then the whole road, from further off
    {later:true,at:C3,place:"wmBoard",keys:[[0,960,540,1.0]],push:0,draw:(cx,tt)=>{const f=1-ag_in(tt,end+0.4,0.8);if(f<=0)return;cx.save();cx.globalAlpha*=f;
      const u=ag_sine(clamp((tt-T.longer+0.4)/1.8,0,1)),G=wm_gridBox(cx),b=wm_shelf(2),s=Math.min((b.w-48)/G.w,(b.h-132)/G.h),
        tx=b.x+24+((b.w-48)-G.w*s)/2,ty=b.y+112;
      wm_shelves(cx,{a:ag_in(tt,T.longer+0.3,0.6),skip:2,shelfA:i=>i===2?ag_in(tt,T.longer+0.6,0.6):ag_in(tt,T.longer+0.9+i*0.2,0.5),lit:3,litA:ag_in(tt,T.nextW-0.2,0.5)});
      cx.save();const k=lerp(1,s,u);cx.translate(lerp(0,tx-G.x*s,u),lerp(0,ty-G.y*s,u));cx.scale(k,k);
      wm_lessons(cx,{show:i=>clamp((tt-L[i]+0.15)/1.0,0,1),deco:u>0,slots:ag_in(tt,T.seven+0.1,0.5)*(1-u)});cx.restore();
      ag_T(cx,"an agent that helps one person",84,750,{w:600,size:28,col:AG.mut,a:ag_in(tt,T.helps-0.2,0.4)});
      ag_T(cx,"one that works beside the team",1836,750,{w:600,size:28,col:AG.mut,align:"right",a:ag_in(tt,T.beside-0.2,0.4)});
      const b4=wm_shelf(3);wm_pillAt(cx,b4.x+b4.w/2,256,"Next",tt,T.nextW-0.1,null,{size:28,col:AG.blue});
      cx.restore();}}]);
  // the end card: the film's lesson, and the next series, as the voice names it
  ag_end(ctx,S,t,end,"A mandate, written and enforced","Autonomy is a written, narrow, revocable mandate.","Film 7 of 7","From helper to colleague");
  const na=ag_in(t,end+1.2,0.6);if(na>0){setScreen(ctx,S);ag_T(ctx,"Next: A colleague that isn't a person",960,790,{w:600,size:30,align:"center",col:AG.mut,a:na});}
});

// chapters that open where the one before ends: on the quiet wall the camera stays, and what the last chapter ends on leaves before
// the new one's picture comes in (its first shot is later:true); between the wall and the lab, they dissolve
ag_cutInto(["held","alone"]);
