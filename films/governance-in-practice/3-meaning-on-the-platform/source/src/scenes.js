/* ===== Meaning on the platform: the nine chapters =====
   Each chapter is a few shots in the places of plan.js and data governance's rooms.js, cut together with short dissolves (gv_shots).
   Times inside a chapter come from its cues (when each line starts) and the words of its lines (wAt), so the pictures stay with the
   voice if it's recorded again. Words on screen are on screens, papers, cards, boards and tags, at least 28 px as seen, and above the
   captions. */

// the assistant's answer to what an award is: the glossary's words, as award's page has them
const GM_ANS="An award is a qualification the university confers, such as a graduate certificate, a master or a microcredential, for at least 6 credit points.";
// the pull request on Mei's screen, small: its title, the old words and the new as two bands, rose and violet, and lines under them
function gm_prSmall(q,sx,sy,sw){wc_T(q,"Sync from the glossary",sx+30,sy+100,{w:800,size:30,col:WC_DARK});gv_tint(q,sx+20,sy+128,sw-40,40,GM_R,0.7);
  gv_tint(q,sx+20,sy+178,sw-40,40,GM_V,0.7);gv_lines(q,sx+30,sy+252,sw-80,3,30,0.8);}
// a paper veil: the picture steps back (a, 0 to 1), as something had to change
function gm_veil(ctx,a){if(a<=0.01)return;ctx.save();ctx.fillStyle=rgba(WC_PAPER,0.45*clamp(a,0,1));ctx.fillRect(-W,-H,3*W,3*H);ctx.restore();}
// on submission day, between the two reports: the metric that counts both and the page whose words both use, with a thread from each
// to both reports' heads (o.met, o.wd, 0 to 1)
function gm_same(ctx,o){[[o.met,"metric · awards_conferred",234,GU_CYAN],[o.wd,"page · Award",354,GM_V]].forEach(([v,s,y,col],k)=>{v=clamp(v||0,0,1);if(v<=0.01)return;
  const w=Math.round(tw(ctx,s,28,700)+56);[[440,302],[1480,292]].forEach(p=>gm_thread(ctx,[960+(p[0]<960?10-w/2:w/2-10),y],p,clamp(v*1.6,0,1),{bend:-20,col}));
  gm_rise(ctx,clamp(v*1.6-0.3,0,1),()=>{wc_panel(ctx,960-w/2,y-32,w,64,{kind:"pill",wash:col,washA:0.3,seed:580+k});wc_T(ctx,s,960,y+10,{w:700,size:28,align:"center",col:WC_DARK});});});}

// ---- 1 · Words that reach the work: Monday, Mei and award's page; Monday's new words; her line from Off the shelf; until now, five
// glossaries and two reports, and an envelope with a number nobody could explain; now, one page, a setting and one count; that night,
// Tuesday morning and submission day; her line as it reads now; and the title ----
scene("words",(ctx,S,t,sc)=>{const c=sc.cues,P=gm_once(sc,"P",()=>({mei:wAt(sc,"owns","Mei Tanaka"),own:wAt(sc,"owns","owns"),
    ch:c.changes-0.3,chW:wAt(sc,"changes","changes"),mc:wAt(sc,"changes","microcredentials"),cnt:wAt(sc,"changes","count too"),six:wAt(sc,"changes","six credit points"),
    sl:c.slowed-0.3,yus:wAt(sc,"slowed","Yusuf"),said:wAt(sc,"slowed","Mei said"),
    five:c.five-0.4,fiveW:wAt(sc,"five","five glossaries"),lists:wAt(sc,"five","lists of what"),three:wAt(sc,"five","three meanings"),
    two:c.two-0.3,cen:wAt(sc,"two","Planning's census report"),n1:wAt(sc,"two","eight hundred and twelve"),dr:wAt(sc,"two","the draft submission"),
    gov:wAt(sc,"two","to the government"),n2:wAt(sc,"two","government",0.5),q:wAt(sc,"explain","couldn't explain"),chg:c.change,
    now:c.page-0.3,pg:wAt(sc,"page","one page"),every:wAt(sc,"page","every copy"),night:wAt(sc,"page","each night"),set:wAt(sc,"setting","six credit points"),
    once:wAt(sc,"once","counted once"),rep:wAt(sc,"once","every report"),ag:wAt(sc,"once","every agent"),
    nt:c.night-0.3,finds:wAt(sc,"night","the check finds"),tue:wAt(sc,"night","on Tuesday morning")-0.3,sees:wAt(sc,"night","Mei sees"),touch:wAt(sc,"night","everything her words touch"),
    day:c.day-0.3,both:wAt(sc,"day","both reports"),num:wAt(sc,"day","four thousand"),reach:c.reach-0.3,rw:wAt(sc,"reach","reach the work"),
    board:c.breath-0.3,title:c.breath+1.2}));
  gv_shots(ctx,S,t,sc.dur,gm_run([
    // the registrar's office, Monday: Mei at her desk, award's page on her screen, with her name as its owner
    {at:0,place:"registrar",keys:[[0,900,540,1],[0.1,940,520,1.06]],d:3,draw:(x,tt)=>{gm_regDesk(x,tt,{draw:gm_meiTerm(fin(tt,P.own,0.5),0)});
      gu_nameCard(x,830,560,"Mei Tanaka","registrar's office",gv_io(tt,P.mei-0.1,P.ch-0.2,0.4));}},
    // her screen, close: award's page; the words before Monday struck through, and Monday's coming in under them, microcredentials and the
    // 6 credit points lit as they're said; published on Monday
    {at:P.ch,place:"regScreen",keys:[[P.ch,960,540,1]],push:0.02,draw:(x,tt)=>gm_termScreen(x,{own:1-fin(tt,P.ch+0.6,0.8),ch:clamp((tt-P.chW-0.1)/1.0,0,1),
      nw:clamp((tt-P.chW-0.3)/2.4,0,1),mc:fin(tt,P.mc,0.5),six:fin(tt,P.six,0.5),pub:fin(tt,P.cnt,0.6)})},
    // until now: Mei and Yusuf in her office, as Off the shelf drew them, and what she said slowed her down; the colours fade a little
    {at:P.sl,place:"regRoom",keys:[[P.sl,1080,520,1.12],[P.sl+0.1,1080,510,1.16]],d:4,draw:(x,tt)=>{gm_meiYusuf(x,tt,{mei:{expr:"concerned"}});gm_memory(x,fin(tt,P.sl,0.8));
      gu_nameCard(x,1290,250,"Yusuf Demir","data governance lead",gv_io(tt,P.yus-0.1,P.said,0.4));
      gm_meiLine(x,gv_io(tt,P.said,P.five+0.4,0.35),0.92+0.08*spring(fin(tt,P.said,0.5)),GM_SAID,0);gu_filmTag(x,1700,140,"Off the shelf",fin(tt,P.yus,0.5),{align:"right"});}},
    // the five glossaries on Yusuf's board, as One word, one home pinned them; who made each, and why; their three meanings
    {at:P.five,place:"boardGov",keys:[[P.five,960,500,1]],push:0.02,draw:(x,tt)=>{gm_memory(x,1);
      for(let i=0;i<5;i++){gm_glCard(x,i,{a:fin(tt,P.fiveW+0.18*i,0.6),lit:fin(tt,P.three+0.2*GM_GL[i].m,0.5)});gm_glTag(x,i,fin(tt,P.lists+0.2*i,0.5));}
      gu_filmTag(x,960,760,"One word, one home",fin(tt,P.five+0.6,0.5),{align:"center"});}},
    // the two reports on Yusuf's desk, each counting by another meaning, and the envelope between them, for the government: a number
    // nobody could explain; then it all steps back
    {at:P.two,place:"deskGov",keys:[[P.two,960,540,1]],push:0.02,draw:(x,tt)=>{gm_memory(x,1);
      gm_reports(x,{a:[fin(tt,P.cen-0.2,0.6),fin(tt,P.dr-0.2,0.6)],lit:[fin(tt,P.n1,0.5),fin(tt,P.n2,0.5)],env:fin(tt,P.gov,0.6),q:fin(tt,P.q,0.6)});gm_veil(x,fin(tt,P.chg,0.8));}},
    // now, on Yusuf's board: award's one page; a thread to the data team's copy, checked each night, and on to the catalog; the setting,
    // a dial at 6; the count, a ledger, and a thread to each report and the assistant that read it
    {at:P.now,place:"boardGov",keys:[[P.now,960,500,1]],push:0.02,draw:(x,tt)=>gm_nowBoard(x,tt,{page:fin(tt,P.pg-0.2,0.6),lit:gv_io(tt,P.pg,P.every,0.5),
      copy:clamp((tt-P.every+0.1)/0.9,0,1),check:fin(tt,P.night,0.6),cat:clamp((tt-P.night-0.6)/0.9,0,1),dial:fin(tt,P.set,0.6),
      book:fin(tt,P.once,0.6),read:[fin(tt,P.rep,0.6),fin(tt,P.rep+0.5,0.6),fin(tt,P.ag,0.6)]})},
    // that night, in the data team's room: nobody there, and on Jun's right-hand screen a pull request opens by itself
    {at:P.nt,place:"dataNight",keys:[[P.nt,1200,520,1.15],[P.nt+0.1,1340,520,1.4]],d:4,draw:(x,tt)=>gm_nightMon(x,clamp((tt-P.finds-0.2)/1.4,0,1))},
    // Tuesday morning: Mei at her desk, the pull request on her screen, and a thread to everything her words touch
    {at:P.tue,place:"registrar",keys:[[P.tue,960,540,1]],push:0.02,draw:(x,tt)=>{gm_regDesk(x,tt,{mei:{expr:tt>P.sees?"smile":"calm"},bar:"GitHub · pull request",draw:gm_prSmall});
      gm_touchTags(x,{u:[0,1,2,3].map(i=>fin(tt,P.touch+0.25*i,0.9))});}},
    // submission day, on Yusuf's desk: the census report counts by the glossary's words now; both say 4,867, with a tick; the envelope
    // holds one number, sealed, and sent
    {at:P.day,place:"deskGov",keys:[[P.day,960,540,1]],push:0.02,draw:(x,tt)=>gm_reports(x,{day:clamp((tt-P.both)/1.2,0,1),tick:fin(tt,P.num+0.8,0.6),
      n:clamp((tt-P.num)/1.2,0,1),seal:fin(tt,P.num+1.6,0.6),sent:fin(tt,P.reach-1.0,0.6)})},
    // Mei and Yusuf again: her line, as it reads now, with a tick
    {at:P.reach,place:"regRoom",keys:[[P.reach,1080,520,1.12],[P.reach+0.1,1080,510,1.16]],d:4,draw:(x,tt)=>{gm_meiYusuf(x,tt,{mei:{expr:"smile"},yusuf:{expr:"smile"}});
      gm_meiLine(x,fin(tt,P.reach+0.3,0.35),0.92+0.08*spring(fin(tt,P.reach+0.3,0.5)),GM_NOW,fin(tt,P.rw+0.3,0.8));}},
    // the data team's board, close: the series' six cards; the third lights and lifts, and becomes the title
    {at:P.board,place:"board",keys:[[P.board,960,470,1]],push:0.02,draw:(x,tt)=>{if(tt<P.title+0.8)gu_board(x,{lit:[0,0,fin(tt,P.board+0.3,0.8)],lift:[0,0,fin(tt,P.board+1.0,1.0)]});}}],sc.dur));
  wc_year(ctx,56,72,"Monday",gv_io(t,0.3,P.sl-0.2,0.4));wc_year(ctx,56,72,"Until now",gv_io(t,P.sl+0.4,P.now-0.2,0.4));
  wc_year(ctx,56,72,"Monday night",gv_io(t,P.nt+0.3,P.tue-0.2,0.4));wc_year(ctx,56,72,"Tuesday morning",gv_io(t,P.tue+0.3,P.day-0.2,0.4));
  wc_year(ctx,56,72,"Tuesday 24 November 2026",gv_io(t,P.day+0.3,P.reach-0.2,0.4));
  gv_title(ctx,S,t,P.title,"Meaning on the platform","one meaning for people, reports and agents","Film 3 of 6 · data governance");});

// ---- 2 · One term, one page: award's page on the platform, in beta: its words, owner and domain, the tables that hold it and where its
// words come from; published from Noor's map, where a change is made; Clara reading it beside the data; and the assistant citing it ----
scene("page",(ctx,S,t,sc)=>{const c=sc.cues,P=gm_once(sc,"P",()=>({beta:wAt(sc,"term","in beta"),words:wAt(sc,"has","its words"),owner:wAt(sc,"has","its owner"),
    dom:wAt(sc,"has","its domain"),tab:wAt(sc,"lists","the tables"),from:wAt(sc,"lists","where its words come from"),
    mp:c.map-0.3,pub:wAt(sc,"map","published"),kept:wAt(sc,"map","where each term is kept"),made:wAt(sc,"map","a change is made"),never:wAt(sc,"map","never on the page"),
    rd:c.read-0.3,ci:c.cites-0.3,ans:wAt(sc,"cites","it cites")}));
  gv_shots(ctx,S,t,sc.dur,gm_run([
    // award's page on the platform, drawn as a form, in beta: its words, its owner and its domain; the tables that hold it, and where its
    // words come from, lit as they're said
    {at:0,place:"bigReg",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>gm_awardPage(x,{beta:fin(tt,P.beta,0.5),lit:[gv_io(tt,P.words,P.owner,0.4),gv_io(tt,P.owner,P.dom,0.4),
      gv_io(tt,P.dom,P.tab-0.4,0.4),gv_io(tt,P.tab,P.from,0.4),fin(tt,P.from,0.5)],al:[0,1,2].map(i=>gv_io(tt,P.tab+0.25*i,P.from,0.4))})},
    // Noor's map, close: award's business term at home, published one way to its page; a pencil reaching for the page stops, crossed:
    // a change is made at home
    {at:P.mp,place:"mapClose",keys:[[P.mp,960,500,1]],push:0.02,draw:(x,tt)=>gm_mapHome(x,tt,{a:fin(tt,P.mp,0.6),pub:clamp((tt-P.pub)/1.0,0,1),hl:gv_io(tt,P.kept,P.made+0.6,0.5),
      reach:clamp((tt-P.made+0.2)/1.0,0,1)*(1-fin(tt,P.never+1.2,0.6)),stop:fin(tt,P.never,0.6)})},
    // Planning: Clara reads award's page beside her table, on her wall screen
    {at:P.rd,place:"planning",keys:[[P.rd,900,480,1.08]],push:0.02,draw:(x,tt)=>{gm_planWall(x,tt,{clara:{mix:fin(tt,P.rd+1.0,0.6)}});
      gu_nameCard(x,120,330,"Clara Jensen","Planning",gv_io(tt,P.rd+0.3,P.ci-0.2,0.4));}},
    // Genie One, the platform's assistant: what counts as an award? It answers in the page's words, and cites the page
    {at:P.ci,place:"bigPlan",keys:[[P.ci,960,540,1]],push:0.02,draw:(x,tt)=>gm_genie(x,tt,{question:"What counts as an award?",q:clamp((tt-P.ci-0.1)/1.0,0,1),
      a:fin(tt,P.ans-0.4,0.6),words:GM_ANS,wordsCol:GM_VI,cites:[["page","Award"]],ci:[fin(tt,P.ans,0.6)],cl:[gv_io(tt,P.ans+0.4,sc.dur,0.5)],violet:0})}],sc.dur));});

// ---- 3 · A copy that says where it came from: the data team's copy of award, beside the models, and the table's description written
// from it; its source, named; and each build writing the descriptions on to the catalog, one way ----
scene("copy",(ctx,S,t,sc)=>{const c=sc.cues,P=gm_once(sc,"P",()=>({own:wAt(sc,"keeps","its own copy"),tab:wAt(sc,"keeps","the tables that hold award"),
    same:wAt(sc,"keeps","in the same words"),nm:c.names-0.3,src:wAt(sc,"names","names its source"),term:wAt(sc,"names","the glossary's term"),
    day:wAt(sc,"names","the day it was synced"),sd:c.sends-0.3,build:wAt(sc,"sends","Each build"),desc:wAt(sc,"sends","sends the descriptions"),back:wAt(sc,"sends","never back")}));
  gv_shots(ctx,S,t,sc.dur,gm_run([
    // the course domain's conceptual model, as the project keeps it: award, in the copy's words; under it, the table's model, whose
    // description is written from them, lit in the same colour
    {at:0,place:"desk",keys:[[0,960,500,1]],push:0.02,draw:(x,tt)=>{gm_copySheet(x,{rows:5,y:50,u:clamp((tt-0.2)/0.9,0,1),def:fin(tt,P.own,0.5)});
      gm_modSheet(x,{u:clamp((tt-P.tab+0.3)/0.9,0,1),doc:fin(tt,P.same,0.5)});}},
    // the whole copy: its source named, the glossary's term, and the day it was synced, lit as they're said
    {at:P.nm,place:"desk",keys:[[P.nm,960,500,1]],push:0.02,draw:(x,tt)=>{gm_copySheet(x,{y:60,def:1,src:[fin(tt,P.src,0.5),fin(tt,P.src+0.3,0.5),fin(tt,P.term,0.5),0,fin(tt,P.day,0.5)]});
      gu_filmTag(x,1830,740,"One word, one home",fin(tt,P.nm+0.6,0.5),{align:"right"});}},
    // core_award in the catalog: each build writes its comment from the project's words, one way, never back
    {at:P.sd,place:"big",keys:[[P.sd,960,540,1]],push:0.02,draw:(x,tt)=>gm_comment(x,tt,{ar:clamp((tt-P.build)/0.9,0,1),c:clamp((tt-P.desc)/1.0,0,1),back:clamp((tt-P.back+0.2)/1.0,0,1)})}],sc.dur));});

// ---- 4 · The nightly sync: the data team's room at night; the check comparing the copy with the glossary, and Monday's change found;
// the pull request it opens, with the old words and the new and what they touch; Tuesday's reviews; Mei seeing where her words are used ----
scene("sync",(ctx,S,t,sc)=>{const c=sc.cues,P=gm_once(sc,"P",()=>({cmp:wAt(sc,"every","each copy")-0.3,chg:wAt(sc,"monday","had changed"),
    op:c.opened-0.3,on:wAt(sc,"opened","the old words"),wt:wAt(sc,"opened","what the new words touch"),
    th:c.three-0.3,t1:wAt(sc,"three","Three tables"),t2:wAt(sc,"three","eight definitions"),t3:wAt(sc,"three","the code"),t4:wAt(sc,"three","three reports"),
    tu:c.tuesday-0.3,ap:wAt(sc,"tuesday","Mei approved"),cf:wAt(sc,"tuesday","data governance confirmed"),sw:c.saw-0.3,used:wAt(sc,"saw","where her words are used")}));
  gv_shots(ctx,S,t,sc.dur,gm_run([
    // every night, in the data team's room: nobody there, the screens lit
    {at:0,place:"dataNight",keys:[[0,1100,520,1.1],[0.1,1200,520,1.2]],d:3,draw:(x,tt)=>gm_nightMon(x,0)},
    // the check, on Jun's screen: award in the glossary beside the data team's copy, read line by line; on Monday night they differ
    {at:P.cmp,place:"nightScreen",keys:[[P.cmp,960,540,1]],push:0.02,draw:(x,tt)=>gm_compare(x,{scan:clamp((tt-P.cmp-0.3)/2.6,0,1),diff:fin(tt,P.chg,0.8)})},
    // the pull request the check opened: the old words and the new, and what they touch, folded
    {at:P.op,place:"bigNight",keys:[[P.op,960,540,1]],push:0.02,draw:(x,tt)=>gm_changed(x,{v:clamp((tt-P.on)/1.4,0,1),wt:fin(tt,P.wt,0.6)})},
    // what the new words touch, opened: a box each, filled and lit as it's said
    {at:P.th,place:"bigNight",keys:[[P.th,960,540,1]],push:0.02,draw:(x,tt)=>gm_touches(x,{u:[P.t1,P.t2,P.t3,P.t4].map(w=>clamp((tt-w)/0.9,0,1)),
      lit:[gv_io(tt,P.t1,P.t2,0.4),gv_io(tt,P.t2,P.t3,0.4),gv_io(tt,P.t3,P.t4,0.4),gv_io(tt,P.t4,P.tu,0.4)]})},
    // Tuesday morning: Mei approves the meaning, and data governance confirms the term
    {at:P.tu,place:"bigReg",keys:[[P.tu,960,540,1]],push:0.02,draw:(x,tt)=>{gm_reviews(x,{mei:clamp((tt-P.ap)/0.8,0,1),yus:clamp((tt-P.cf)/0.8,0,1)});
      gu_filmTag(x,1770,170,"Who does what, end to end",fin(tt,P.tu+0.6,0.5),{align:"right"});}},
    // the registrar's office: Mei at her desk, and a thread from her screen to each place her words are used
    {at:P.sw,place:"registrar",keys:[[P.sw,960,540,1]],push:0.02,draw:(x,tt)=>{gm_regDesk(x,tt,{mei:{expr:"smile"},bar:"GitHub · pull request",draw:gm_prSmall});
      gm_touchTags(x,{u:[0,1,2,3].map(i=>fin(tt,P.used-0.4+0.25*i,0.9))});}}],sc.dur));
  // the day, in the corner, only where no screen's bar is under it
  wc_year(ctx,56,72,"Tuesday morning",gv_io(t,P.sw+0.3,sc.dur,0.4));});

// ---- 5 · A number is a setting: the 6 credit points in the new words; kept once, in dbt_project.yml; Jun's column reading it, and every
// count of awards reading the column; if Mei and the faculties ever agree on another number, one line, in a reviewed pull request ----
scene("setting",(ctx,S,t,sc)=>{const c=sc.cues,P=gm_once(sc,"P",()=>({six:wAt(sc,"number","six credit points"),vars:sc.ends.number+0.3,
    kp:c.kept-0.3,set:wAt(sc,"kept","as a setting"),min:wAt(sc,"kept","min award credit points"),
    rd:c.reads-0.3,jun:wAt(sc,"reads","Jun's new column"),it:wAt(sc,"reads","reads it"),every:wAt(sc,"reads","every count of awards"),
    ag:c.agree-0.3,another:wAt(sc,"agree","another number"),line:wAt(sc,"agree","one line changes"),rev:wAt(sc,"agree","a reviewed pull request"),turn:sc.ends.agree+0.2}));
  gv_shots(ctx,S,t,sc.dur,gm_run([
    // the sync's report again, on Jun's screen by day: the number in the new words, and its line on vars: a number may belong in one
    {at:0,place:"big",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>gm_varsReport(x,{six:fin(tt,P.six,0.5),vars:fin(tt,P.vars,0.6)})},
    // dbt_project.yml's vars: the setting the new words need, lit; under it, the setting as a dial at 6, on a thread from its line
    {at:P.kp,place:"desk",keys:[[P.kp,960,500,1]],push:0.02,draw:(x,tt)=>{const f=gm_varsSheet(x,{u:clamp((tt-P.kp)/0.8,0,1),lit:fin(tt,P.set,0.5)});
      if(f.rows.length>5)gm_thread(x,[f.tx+gu_mw(x,GM_VARS[5].s)+16,f.rows[5]],[1500,546],clamp((tt-P.min-0.2)/0.9,0,1),{bend:-30});
      gm_dial(x,1500,660,110,6,{a:fin(tt,P.min,0.6),label:"one setting"});}},
    // core_credential version 2: Jun's new column reads the setting, a thread from the dial; every count of awards reads the column
    {at:P.rd,place:"desk",keys:[[P.rd,960,500,1]],push:0.02,draw:(x,tt)=>{const f=gm_credSheet(x,{u:clamp((tt-P.rd)/0.8,0,1),lit:fin(tt,P.it,0.5),col:fin(tt,P.jun,0.5)});
      const vx=f.tx+gu_mw(x,"        or (… = 'microcredential' and credit_points >= {{ var('min_award");gm_dial(x,vx,740,100,6,{a:fin(tt,P.rd+0.6,0.6)});
      if(f.rows.length>6){gm_thread(x,[vx,634],[vx,f.rows[5]+20],clamp((tt-P.it)/0.9,0,1),{bend:0});
        gm_thread(x,[f.tx+gu_mw(x,"        as counts_as_award,")+16,f.rows[6]],[560,690],clamp((tt-P.every)/0.9,0,1),{bend:-20});}
      gu_tagAt(x,tt,P.every+0.5,null,560,720,"every count of awards",{size:30});gu_filmTag(x,1830,640,"Governed in dbt",fin(tt,P.rd+0.6,0.5),{align:"right"});}},
    // if Mei and the faculties ever agree on another number: the setting's dial, a pencil needle where it could go; one line, in a pull
    // request they review; then, without words, the needle turns to it and back
    {at:P.ag,place:"desk",keys:[[P.ag,960,500,1]],push:0.02,draw:(x,tt)=>{const b=Math.sin(Math.PI*easeCam(clamp((tt-P.turn)/2.4,0,1)));
      gm_dial(x,560,470,170,6+2*b,{label:"min_award_credit_points",mono:true,ghost:8,ga:fin(tt,P.another,0.6)*(1-b)});
      gm_maybe(x,{a:fin(tt,P.line-0.2,0.6),rev:clamp((tt-P.rev)/1.0,0,1),req:fin(tt,P.rev+1.0,0.5)});}}],sc.dur));});

// ---- 6 · Counted once: a count is a meaning too, a ledger with its rule; awards conferred, a metric view the project builds; its pull
// request, tested and reviewed; the two reports that read it; and Planning's report giving up its own count ----
scene("count",(ctx,S,t,sc)=>{const c=sc.cues,P=gm_once(sc,"P",()=>({which:wAt(sc,"meaning","which credentials count"),yr:wAt(sc,"meaning","in which year"),
    once:wAt(sc,"once","counted once"),mv:wAt(sc,"once","as a metric view")-0.3,counts:wAt(sc,"what","It counts"),cred:wAt(sc,"what","the credentials"),
    aw:wAt(sc,"what","count as an award"),by:wAt(sc,"what","by the year"),bd:wAt(sc,"builds","builds it"),rv:wAt(sc,"builds","is reviewed"),
    rd:c.reads-0.3,dr:wAt(sc,"reads","The draft submission"),cen:wAt(sc,"reads","Planning's census report"),
    ow:c.own-0.3,nei:wAt(sc,"own","Neither counts"),way:wAt(sc,"own","its own way")}));
  gv_shots(ctx,S,t,sc.dur,gm_run([
    // a ledger on Yusuf's desk: awards conferred, and its rule, a line at a time; this year's line
    {at:0,place:"deskGov",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>gm_ledger(x,{r1:clamp((tt-P.which)/1.2,0,1),r2:clamp((tt-P.yr)/1.2,0,1),yr:clamp((tt-P.once)/1.2,0,1)})},
    // the metric view, as the project builds it: what it counts, lit as it's said; beside it, its pull request, tested and approved by
    // its owner
    {at:P.mv,place:"desk",keys:[[P.mv,960,500,1]],push:0.02,draw:(x,tt)=>{gm_mvSheet(x,{u:clamp((tt-P.mv)/0.9,0,1),
        lit:[gv_io(tt,P.mv+0.4,P.counts,0.4),fin(tt,P.cred,0.5),fin(tt,P.aw,0.5),fin(tt,P.by,0.5),fin(tt,P.counts,0.5)]});
      gm_mvPR(x,tt,{a:fin(tt,P.bd,0.6),ck:clamp((tt-P.bd-0.4)/1.6,0,1),ok:clamp((tt-P.rv)/0.8,0,1)});}},
    // the metric view's page in the catalog: its owner, and what reads it: the draft submission and Planning's census report
    {at:P.rd,place:"big",keys:[[P.rd,960,540,1]],push:0.02,draw:(x,tt)=>gm_lineage(x,tt,{own:gv_io(tt,P.rd+0.4,P.dr,0.4),r:[clamp((tt-P.dr)/1.0,0,1),clamp((tt-P.cen)/1.0,0,1)]})},
    // Planning's census report: its own count, struck through; the metric's, in its place
    {at:P.ow,place:"bigPlan",keys:[[P.ow,960,540,1]],push:0.02,draw:(x,tt)=>gm_census(x,{x:clamp((tt-P.nei)/1.0,0,1),nw:fin(tt,P.way,0.7),lit:gv_io(tt,P.way+0.4,sc.dur,0.5)})}],sc.dur));});

// ---- 7 · Agents read the same meaning: Clara asking Genie One how many awards; its answer, from the metric, citing award's page and
// preferring it to its own guess; an agent the data team builds on the metric, with the same answer; one meaning, one number ----
scene("agents",(ctx,S,t,sc)=>{const c=sc.cues,P=gm_once(sc,"P",()=>({cl:wAt(sc,"asks","Clara"),gq:wAt(sc,"asks","how many awards")-0.3,
    ans:c.answers,met:wAt(sc,"answers","from the metric"),cite:wAt(sc,"answers","cites award's page"),guess:wAt(sc,"prefers","its own guess"),shows:wAt(sc,"prefers","shows where"),
    bt:c.built-0.3,on:wAt(sc,"built","on the metric"),same:wAt(sc,"built","gives the same answer"),one:c.one-0.3,ppl:wAt(sc,"one","People"),ag:wAt(sc,"one","agents read")}));
  gv_shots(ctx,S,t,sc.dur,gm_run([
    // Planning: Clara at her wall screen, Genie One open on it, her question typed in
    {at:0,place:"planning",keys:[[0,900,480,1.08],[0.1,900,450,1.14]],d:4,draw:(x,tt)=>{gm_planWall(x,tt,{bar:"Databricks · Genie One",genie:gm_genieAsk(clamp((tt-P.cl-0.6)/1.6,0,1)),
      clara:{mix:fin(tt,P.cl+0.6,0.6)}});gu_nameCard(x,120,330,"Clara Jensen","Planning",gv_io(tt,P.cl-0.1,P.gq-0.2,0.4));}},
    // Genie One, close: how many awards did we confer this year? 4,867, from the metric, and award's page, cited for what an award is;
    // its own guess, struck through; where the answer came from, lit
    {at:P.gq,place:"bigPlan",keys:[[P.gq,960,540,1]],push:0.02,draw:(x,tt)=>{gm_genie(x,tt,{question:GM_ASK,q:1,
        a:fin(tt,P.ans,0.6),big:"4,867 awards conferred in 2026",words:GM_ANS,wordsCol:GM_VI,ww:960,cites:[["metric","awards_conferred"],["page","Award"]],
        ci:[fin(tt,P.met,0.6),fin(tt,P.cite,0.6)],cl:[gv_io(tt,P.met,P.cite,0.4)+fin(tt,P.shows,0.5),gv_io(tt,P.cite,P.guess,0.4)+fin(tt,P.shows+0.3,0.5)],violet:1,
        guess:gv_io(tt,P.guess-0.3,P.shows+0.6,0.4),no:clamp((tt-P.guess-0.4)/0.6,0,1)});}},
    // the data team's agent: its data source is the metric; the same question, the same answer
    {at:P.bt,place:"big",keys:[[P.bt,960,540,1]],push:0.02,draw:(x,tt)=>gm_agent(x,tt,{src:gv_io(tt,P.on,P.same+1.0,0.5),q:clamp((tt-P.bt-0.2)/1.2,0,1),a:fin(tt,P.same,0.6)})},
    // on Yusuf's board: the page and the metric, and the three that read them, each saying 4,867
    {at:P.one,place:"boardGov",keys:[[P.one,960,500,1]],push:0.02,draw:(x,tt)=>gm_oneNumber(x,tt,{u:[fin(tt,P.ppl,0.9),fin(tt,P.ag,0.9),fin(tt,P.ag+0.4,0.9)]})}],sc.dur));});

// ---- 8 · Three layers, one home each: on Noor's map, what a word means, how a number is counted and how things relate; each one's home,
// and its copies, checked against it each night or built from it ----
scene("layers",(ctx,S,t,sc)=>{const c=sc.cues,P=gm_once(sc,"P",()=>({w:wAt(sc,"three","what a word means"),n:wAt(sc,"three","how a number is counted"),
    r:wAt(sc,"three","how things relate"),home:c.home,wl:c.words,gc:wAt(sc,"words","the glossary copies"),rl:c.relate,cp:wAt(sc,"relate","copied into the project"),
    ct:c.counts,mv:wAt(sc,"counts","serves as metric views"),ck:c.checked}));
  gv_shots(ctx,S,t,sc.dur,gm_run([
    // the sheet pinned over Noor's map: a row for each layer; its home, lit as it's named, and its copies, threaded to it; then the ticks
    {at:0,place:"mapClose",keys:[[0,960,500,1]],push:0.03,draw:(x,tt)=>{const all=Math.max(1-fin(tt,P.wl,0.4),fin(tt,P.ck,0.4)),on=(a,b)=>0.3+0.7*Math.max(all,gv_io(tt,a,b,0.4));
      gm_layers(x,tt,{row:[fin(tt,P.w,0.6),fin(tt,P.n,0.6),fin(tt,P.r,0.6)],home:fin(tt,P.home,0.6),hw:[on(P.wl,P.rl),on(P.ct,P.ck),on(P.rl,P.ct)],
        c:[clamp((tt-P.gc)/1.4,0,1),clamp((tt-P.mv)/0.9,0,1),clamp((tt-P.cp)/0.9,0,1)],ck:fin(tt,P.ck+0.3,0.8),tag:fin(tt,P.home+0.4,0.5)});}}],sc.dur));});

// ---- 9 · One meaning: Mei's words, used in every table, count and answer; the floor of offices, each reading what she decides;
// submission day, both reports counted by the same metric with the same words; Yusuf's board again; the next film; the end card ----
scene("close",(ctx,S,t,sc)=>{const c=sc.cues,P=gm_once(sc,"P",()=>({tb:wAt(sc,"sees","every table"),ct:wAt(sc,"sees","count"),an:wAt(sc,"sees","answer"),
    dc:c.decides-0.3,once:wAt(sc,"decides","once"),car:wAt(sc,"decides","carries it everywhere"),dy:c.day-0.3,both:wAt(sc,"day","both say"),
    met:wAt(sc,"day","the same metric"),wd:wAt(sc,"day","the same words"),ls:c.last-0.3,board:c.breath-0.3,end:c.breath+1.6}));
  gv_shots(ctx,S,t,sc.dur,gm_run([
    // the registrar's office: Mei at her desk, award's page on her screen, and a thread to each table, count and answer her words reach
    {at:0,place:"registrar",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{gm_regDesk(x,tt,{mei:{expr:"smile"},draw:gm_meiTerm(0,0)});
      gm_used(x,tt,{u:[fin(tt,P.tb,0.9),fin(tt,P.ct,0.9),fin(tt,P.an,0.9),fin(tt,P.an+0.3,0.9)]});}},
    // the floor of offices: the registrar's office, where she decides, lit; a violet thread from it to each office that reads it
    {at:P.dc,place:"floor",keys:[[P.dc,960,540,1]],push:0.02,draw:(x,tt)=>gm_floor(x,tt,{home:fin(tt,P.once-0.4,0.8),u:[0,1,2,3].map(i=>clamp((tt-P.car-0.2*i)/1.0,0,1)),
      pose:{mei:{expr:"smile"}}})},
    // submission day, on Yusuf's desk: both reports say 4,867, counted by the same metric, with the same words
    {at:P.dy,place:"deskGov",keys:[[P.dy,960,540,1]],push:0.02,draw:(x,tt)=>{gm_reports(x,{day:1,tick:fin(tt,P.both+0.8,0.6),n:1,seal:1,sent:1,lit:[fin(tt,P.wd,0.6),fin(tt,P.wd,0.6)]});
      gm_same(x,{met:fin(tt,P.met,0.8),wd:fin(tt,P.wd,0.8)});}},
    // Yusuf's board, as the film began it: one page, a setting and one count, read by people, reports and agents
    {at:P.ls,place:"boardGov",keys:[[P.ls,960,500,1]],push:0.02,draw:(x,tt)=>gm_nowBoard(x,tt,{page:1,copy:1,check:1,cat:1,dial:1,book:1,read:[1,1,1],lit:gv_io(tt,P.ls+0.3,P.board,0.5)})},
    // the data team's board: the next film's card lifts
    {at:P.board,place:"board",keys:[[P.board,960,470,1]],push:0.02,draw:(x,tt)=>{if(tt<P.end+0.8)gu_board(x,{lit:[0,0,1],lift:[0,0,0,fin(tt,P.board+0.5,1.0)]});}}],sc.dur));
  wc_year(ctx,56,72,"Tuesday 24 November 2026",gv_io(t,P.dy+0.3,P.ls-0.2,0.4));
  gv_end(ctx,S,t,P.end,"Meaning on the platform","One meaning, read by people, reports and agents.","Film 3 of 6");});
