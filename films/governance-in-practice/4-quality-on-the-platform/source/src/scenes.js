/* ===== Quality on the platform: the nine chapters =====
   Each chapter is a few shots in the places of plan.js and data governance's rooms.js, cut together with short dissolves (gv_shots).
   Times inside a chapter come from its cues (when each line starts) and the words of its lines (wAt), so the pictures stay with the
   voice if it's recorded again. Words on screen are on screens, papers, cards, boards and tags, at least 28 px as seen, and above the
   captions. */

// a test's owner and its dimension, on pills right of its sheet, each on a thread from its line (o.own, o.dim, 0 to 1)
function gq_meta(ctx,f,o){if(f.rows.length<5)return;const ax=f.tx+gu_mw(ctx,GQ_NN[4].s)+20,ay=f.rows[4];
  [["owner: Learning team",GV.gold,GV.goldInk,300,o.own],["dimension: completeness",GU_CYAN,GU_CYAN,440,o.dim]].forEach(([s,col,ink,y,v],i)=>{v=clamp(v||0,0,1);if(v<=0.01)return;
    gq_thread(ctx,[ax,ay],[1340,y],clamp(v*1.6,0,1),{col:ink,bend:i?20:-20});gq_rise(ctx,clamp(v*1.6-0.4,0,1),()=>gq_pill(ctx,1340,y,s,{size:30,wash:col,washA:0.35,seed:900+i}));});}
// the red night's cells that didn't run, to light in grey
const GQ_GREY=[];GQ_RED.forEach((r,ri)=>{if(r.fold)return;(r.cells||r).forEach((s,ci)=>{if(ci&&/not run/.test(s))GQ_GREY.push([ri,ci]);});});

// ---- 1 · Which number to trust: Planning's room, Clara checking the numbers before they leave; until now, her question, a failed
// check with only its name, a warning nobody owned, a survey, and a census number nobody knew whose to fix; now, a check that names
// its owner, its dimension and its level, monitoring, and each morning one scorecard with an issue for each owner; Monday 19 October,
// the six with no email, what stopped, and noon; that night; Clara now; and the title ----
scene("trust",(ctx,S,t,sc)=>{const c=sc.cues,P=gq_once(sc,"P",()=>({clara:wAt(sc,"room","Clara Jensen"),chk:wAt(sc,"room","checks the numbers"),
    cen:wAt(sc,"leave","census numbers"),lists:wAt(sc,"leave","the lists"),
    sl:c.slowed-0.3,yus:wAt(sc,"slowed","Yusuf"),said:wAt(sc,"slowed","Clara said"),
    ran:c.ran-0.3,fail:wAt(sc,"ran","a failed one"),whose:wAt(sc,"ran","not whose data"),
    yr:c.year-0.3,warn:wAt(sc,"year","A warning"),nob:wAt(sc,"year","nobody owned it"),
    sv:c.survey-0.3,svw:wAt(sc,"survey","a survey"),rated:wAt(sc,"survey","people rated"),avg:wAt(sc,"survey","three point nine"),
    br:c.broken-0.3,brk:wAt(sc,"broken","a broken night"),chn:wAt(sc,"broken","change a number"),nk:wAt(sc,"broken","nobody knew whose"),chg:c.change,
    now:c.now-0.3,own:wAt(sc,"now","names its owner"),kind:wAt(sc,"now","the kind of quality"),lvl:wAt(sc,"now","the level its owner chose"),
    wt:c.watch-0.3,mon:wAt(sc,"watch","watches for"),
    mo:c.morning-0.3,iss:wAt(sc,"morning","an issue for each owner"),
    oct:c.oct-0.3,five:wAt(sc,"oct","five more"),lim:wAt(sc,"six","the five the learning team allows"),
    built:wAt(sc,"stopped","Everything built"),stp:wAt(sc,"stopped","stopped"),kept:wAt(sc,"stopped","Planning kept"),
    noon:c.noon-0.3,added:wAt(sc,"noon","added the six emails"),night:wAt(sc,"noon","that night"),all:wAt(sc,"noon","all a hundred and sixty"),
    tr:c.trust-0.3,num:wAt(sc,"trust","which numbers to trust"),who:wAt(sc,"trust","who answers for each"),
    board:c.breath-0.3,title:c.breath+1.2}));
  gv_shots(ctx,S,t,sc.dur,gq_run([
    // Planning's office, close: Clara at her desk, checking the census numbers before they leave; where they go, a tag each
    {at:0,place:"planClose",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{gq_planDesk(x,tt,{draw:gq_census({lit:gv_io(tt,P.chk,P.sl,0.5)})});
      gq_tags(x,GQ_GO,{u:[fin(tt,P.cen,0.9),fin(tt,P.lists,0.9)]});gu_nameCard(x,1610,420,"Clara Jensen","Planning",gv_io(tt,P.clara-0.1,P.sl-0.4,0.4));}},
    // until now: Clara and Yusuf in her office, as Off the shelf drew them, and her question; the colours fade a little
    {at:P.sl,place:"planning",keys:[[P.sl,900,520,1.1],[P.sl+0.1,880,510,1.14]],d:4,draw:(x,tt)=>{gq_planWide(x,tt,{clara:{mix:fin(tt,P.said-0.4,0.6)}});gq_memory(x,fin(tt,P.sl,0.8));
      gu_nameCard(x,1300,236,"Yusuf Demir","data governance lead",gv_io(tt,P.yus-0.1,P.said+0.8,0.4));gu_filmTag(x,1600,140,"Off the shelf",fin(tt,P.yus,0.5),{align:"right"});
      gq_say(x,tt,P.said,P.ran+0.6,270,214,["Which number","do I trust?"],440,462);}},
    // a night's checks on Jun's screen: a failed one says only its name; whose data? nobody's
    {at:P.ran,place:"nightScreen",keys:[[P.ran,960,540,1]],push:0.03,draw:(x,tt)=>{gq_log(x,{n:clamp((tt-P.ran-0.3)/1.6,0,1)*GQ_LOG.length,red:fin(tt,P.fail,0.5),who:fin(tt,P.whose,0.6)});gq_memory(x,1);}},
    // a warning a night for a year, in a shared inbox on Jun's screen, and its owner: nobody
    {at:P.yr,place:"screen",keys:[[P.yr,960,540,1]],push:0.02,draw:(x,tt)=>{gq_inbox(x,{d:364*easeCam(clamp((tt-P.warn)/(P.nob-P.warn+0.3),0,1)),none:fin(tt,P.nob,0.6)});gq_memory(x,1);}},
    // the survey, on Yusuf's desk: people rated their data; its average
    {at:P.sv,place:"deskGov",keys:[[P.sv,960,540,1]],push:0.02,draw:(x,tt)=>{gq_survey(x,{u:[fin(tt,P.svw,0.6),fin(tt,P.rated,0.6),fin(tt,P.rated+0.35,0.6)],avg:fin(tt,P.avg,0.8)});gq_memory(x,1);}},
    // so a broken night: the failed line, printed; the census envelope, its number struck through; whose to fix? Then it steps back
    {at:P.br,place:"deskGov",keys:[[P.br,960,540,1]],push:0.02,draw:(x,tt)=>{gq_strip(x,120,110,fin(tt,P.brk,0.6));
      gq_envelope(x,1300,560,{a:fin(tt,P.br+0.3,0.6),x:fin(tt,P.chn,0.6),q:fin(tt,P.chn+0.5,0.5)});gq_whose(x,220,480,fin(tt,P.nk,0.6),"whose to fix?");
      gq_memory(x,1);gq_veil(x,fin(tt,P.chg,0.8));}},
    // now, on Yusuf's board: a check, and what it names: its owner, its dimension and its level
    {at:P.now,place:"boardGov",keys:[[P.now,960,500,1]],push:0.02,draw:(x,tt)=>gq_checkCard(x,{card:fin(tt,P.now+0.2,0.6),own:fin(tt,P.own,0.9),dim:fin(tt,P.kind,0.9),lvl:fin(tt,P.lvl,0.9)})},
    // monitoring, on Sam's screens: the tables it watches, and a table's rows inside the band it has learned
    {at:P.wt,place:"platform",keys:[[P.wt,960,540,1]],push:0.02,draw:(x,tt)=>{gq_samDesk(x,tt,{draw:q=>gq_samWatch(q,tt,{u:clamp((tt-P.mon)/1.8,0,1)})});
      gq_plate(x,tt,P.wt+0.3,null,1570,296,["Sam Okafor","platform team"]);}},
    // each morning: one scorecard, and an issue for each owner
    {at:P.mo,place:"desk",keys:[[P.mo,960,540,1]],push:0.02,draw:(x,tt)=>gq_morning(x,{u:fin(tt,P.mo+0.2,0.8),env:[0,1,2].map(i=>fin(tt,P.iss+0.3*i,0.9))})},
    // Monday 19 October, on Yusuf's board: the walk-in from February, and five more with no email, six over the learning team's five;
    // what's built from them stops; Planning keeps the day before's numbers
    {at:P.oct,place:"boardGov",keys:[[P.oct,960,500,1]],push:0.02,draw:(x,tt)=>gq_monday(x,{a:fin(tt,P.oct+0.2,0.6),one:fin(tt,P.oct+0.6,0.5),six:clamp((tt-P.five)/1.4,0,1),
      lim:fin(tt,P.lim,0.6),down:[0,1,2,3].map(i=>fin(tt,P.built+0.25*i,0.9)),stop:clamp((tt-P.stp)/1.0,0,1),kept:fin(tt,P.kept,0.9)})},
    // by noon, at the learning team's: Tom adds the six emails as the clock goes round
    {at:P.noon,place:"tom",keys:[[P.noon,960,540,1]],push:0.02,draw:(x,tt)=>{gq_tomDesk(x,tt,{clock:lerp(9.5,12,easeCam(clamp((tt-P.noon)/(P.night-P.noon),0,1)))},
      q=>gq_tomScreen(q,"six",{fix:clamp((tt-P.noon-0.7)/(P.night-P.noon-1.2),0,1)*6}));gq_plate(x,tt,P.noon+0.3,P.night-0.4,1690,470,["Tom Whitfield","learning team"]);}},
    // that night, on Jun's screen: every check passed
    {at:P.night-0.3,place:"nightScreen",keys:[[P.night-0.3,960,540,1]],push:0.02,draw:(x,tt)=>gq_allNight(x,{u:fin(tt,P.all,0.6)})},
    // Planning, now: Clara's census numbers ticked, and who answers for each
    {at:P.tr,place:"planClose",keys:[[P.tr,960,540,1]],push:0.02,draw:(x,tt)=>{gq_planDesk(x,tt,{clara:{expr:"smile"},draw:gq_census({tick:[0,1,2,3].map(i=>fin(tt,P.num+0.25*i,0.5))})});
      gq_tags(x,GQ_WHO,{u:[0,1,2].map(i=>fin(tt,P.who+0.3*i,0.9)),wash:GV.gold});}},
    // the data team's board, close: the series' six cards; the fourth lights and lifts, and becomes the title
    {at:P.board,place:"board",keys:[[P.board,960,470,1]],push:0.02,draw:(x,tt)=>{if(tt<P.title+0.8)gu_board(x,{lit:[0,0,0,fin(tt,P.board+0.3,0.8)],lift:[0,0,0,fin(tt,P.board+1.0,1.0)]});}}],sc.dur));
  wc_year(ctx,56,72,"Until now",gv_io(t,P.sl+0.4,P.now-0.2,0.4));wc_year(ctx,56,72,"Monday 19 October 2026",gv_io(t,P.oct+0.3,P.night-0.6,0.4));
  wc_year(ctx,56,72,"That night",gv_io(t,P.night,P.tr-0.2,0.4));
  gv_title(ctx,S,t,P.title,"Quality on the platform","rules you write, and monitoring for the rest","Film 4 of 6 · data governance");});

// ---- 2 · An owner, a dimension, a level: the test in the project, its owner and dimension; the owner by folder; the dimension by the
// kind of test; the level in the test; the decision log; and a test with no owner, stopped by the governance check until it has one ----
scene("owner",(ctx,S,t,sc)=>{const c=sc.cues,P=gq_once(sc,"P",()=>({dbt:wAt(sc,"test","a dbt test"),own:wAt(sc,"test","names its owner"),dim:wAt(sc,"test","its dimension"),
    f:c.folder-0.3,fold:wAt(sc,"folder","from the folder"),scd:wAt(sc,"folder","short-course data"),
    k:c.kind-0.3,empty:wAt(sc,"kind","empty values"),comp:wAt(sc,"kind","checks completeness"),
    l:c.level-0.3,lt:wAt(sc,"level","in the test"),warn:wAt(sc,"level","warn on one"),stop:wAt(sc,"level","stop above five"),
    lg:c.log-0.3,who:wAt(sc,"log","who chose it"),why:wAt(sc,"log","and why"),
    pr:c.in-0.3,wo:wAt(sc,"in","without an owner"),get:wAt(sc,"in","get in"),fx:wAt(sc,"in","get in",0.5)}));
  gv_shots(ctx,S,t,sc.dur,gq_run([
    // the test, on a sheet: the not_null on customer_bk, lit; its owner and its dimension, on pills threaded to it
    {at:0,place:"desk",keys:[[0,960,500,1]],push:0.02,draw:(x,tt)=>{const f=gq_nnSheet(x,{u:clamp((tt-0.1)/0.9,0,1),test:fin(tt,P.dbt,0.5)});
      gq_meta(x,f,{own:fin(tt,P.own,0.9),dim:fin(tt,P.dim,0.9)});}},
    // dbt_project.yml: who owns each test, by folder; the short-course folders lit, and which tests each holds
    {at:P.f,place:"desk",keys:[[P.f,960,500,1]],push:0.02,draw:(x,tt)=>{const f=gq_dpSheet(x,{u:clamp((tt-P.f-0.1)/0.9,0,1),lit:fin(tt,P.scd,0.5),head:gv_io(tt,P.fold,P.scd,0.5)});
      if(f.rows.length>9){wc_hand(x,"the source's tests",1100,f.rows[6]+12,{size:32,w:700,col:WC_PENCIL,p:fin(tt,P.scd+0.3,0.8)});
        wc_hand(x,"staging's tests",1100,f.rows[9]+12,{size:32,w:700,col:WC_PENCIL,p:fin(tt,P.scd+0.7,0.8)});}
      gu_filmTag(x,1830,f.rows.length?f.rows[0]+f.h-48:800,"Governed in dbt",fin(tt,P.fold,0.5),{align:"right"});}},
    // tests/generic/builtin.sql: dbt's not_null, a test for empty values, names the dimension it checks
    {at:P.k,place:"desk",keys:[[P.k,960,500,1]],push:0.02,draw:(x,tt)=>{const f=gq_biSheet(x,{u:clamp((tt-P.k-0.1)/0.9,0,1),lit:fin(tt,P.comp,0.5)});
      if(f.rows.length>4)wc_hand(x,"a test for empty values",f.tx+gu_mw(x,GQ_BI[3].s)+50,f.rows[3]+12,{size:32,w:700,col:WC_PENCIL,p:fin(tt,P.empty,0.8)});}},
    // the level, in the test, as its owner chose: warn on one, stop above five
    {at:P.l,place:"desk",keys:[[P.l,960,500,1]],push:0.02,draw:(x,tt)=>{const f=gq_nnSheet(x,{test:fin(tt,P.lt,0.5),lvl:[0,fin(tt,P.warn,0.5),fin(tt,P.stop,0.5)]});
      if(f.rows.length>8){wc_hand(x,"warn on one",760,f.rows[7]+12,{size:34,w:700,col:GV.amberInk,p:fin(tt,P.warn+0.2,0.8)});
        wc_hand(x,"stop above five",760,f.rows[8]+12,{size:34,w:700,col:GV.redInk,p:fin(tt,P.stop+0.2,0.8)});}}},
    // the decision log, as a card: who chose it, when, and why
    {at:P.lg,place:"deskGov",keys:[[P.lg,960,540,1]],push:0.02,draw:(x,tt)=>gq_decision(x,{a:fin(tt,P.lg+0.1,0.6),who:gv_io(tt,P.who,P.why,0.4),why:fin(tt,P.why,0.5)})},
    // Jun's pull request: a test with no owner, and the governance check stops it; the line that gives it one; then the check turns green
    {at:P.pr,place:"big",keys:[[P.pr,960,540,1]],push:0.02,draw:(x,tt)=>{const g=tt<P.wo+0.3?"run":tt<P.fx+1.1?"fail":tt<P.fx+1.7?"run":"pass",
        items=GQ_PR.ck.map((n,i)=>({name:n,st:i===1?g:tt>P.pr+0.8+0.35*i?"pass":"run"}));
      gq_pr(x,tt,{items,msg:g==="pass"?GQ_PR.g.map((s,i)=>({s,col:GV.greenInk,p:clamp((tt-P.fx-1.8-0.3*i)/0.6,0,1)})):
          g==="fail"?GQ_PR.m.map((s,i)=>({s,col:i===3?GV.redInk:WC_INK,p:clamp((tt-P.wo-0.4-0.25*i)/0.6,0,1)})):[],
        pop:[0,Math.max(gv_io(tt,P.wo+0.3,P.wo+1.3,0.3),gv_io(tt,P.fx+1.7,P.fx+2.7,0.3)),0,0,0],fix:clamp((tt-P.fx)/1.0,0,1)});}}],sc.dur,1));});

// ---- 3 · Written from the run: the red night's build, and the two scripts that read its results; the scorecard, learning's
// completeness six of seven, and the tests that didn't run, in grey; the learning team's issue, with a cause to fill in and a date ----
scene("run",(ctx,S,t,sc)=>{const c=sc.cues,P=gq_once(sc,"P",()=>({two:wAt(sc,"read","two scripts"),res:wAt(sc,"read","dbt's results"),
    sc:c.scorecard-0.3,lr:c.learning,six:wAt(sc,"learning","six of seven"),nr:c.notrun-0.3,nrw:wAt(sc,"notrun","not run"),
    is:c.issue-0.3,iw:wAt(sc,"issue","an issue to answer"),wd:wAt(sc,"issue","what didn't pass"),why:wAt(sc,"issue","why the level is there"),
    cause:wAt(sc,"due","A cause"),date:wAt(sc,"due","a date to answer by")}));
  gv_shots(ctx,S,t,sc.dur,gq_run([
    // after the night's build: dbt's results, and the two scripts that read them
    {at:0,place:"big",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>gq_term(x,{res:fin(tt,0.5,0.6),ar:fin(tt,P.res,0.9),c:[clamp((tt-P.two)/0.9,0,1),clamp((tt-P.two-0.7)/0.9,0,1)],
      out:[fin(tt,P.res+0.6,0.4),fin(tt,P.res+1.2,0.4)]})},
    // the scorecard, the red night's: learning's completeness, six of seven; then what didn't run, in grey, not failed
    {at:P.sc,place:"big",keys:[[P.sc,960,540,1],[P.lr-0.6,900,500,1.15],[P.nr,960,540,1]],d:1.6,push:0,draw:(x,tt)=>{const nr=fin(tt,P.nrw-0.2,0.5),
        lit=[[3,1,gv_io(tt,P.six-0.3,P.nr+0.6,0.4),GV.red]].concat(GQ_GREY.map(([r,cc])=>[r,cc,nr,null]));
      gq_scorePage(x,{rows:GQ_RED,wash:fin(tt,P.sc+0.4,0.8),lit,dim:nr*0.8});
      wc_hand(x,"grey: not run, not failed",150,850,{size:32,w:700,col:GV.greyInk,p:fin(tt,P.nrw,0.8)});}},
    // the issue the second writes, to the learning team: what didn't pass, why the level is there, a cause to fill in, a date
    {at:P.is,place:"bigLearn",keys:[[P.is,960,540,1]],push:0.02,draw:(x,tt)=>gq_issue(x,GQ_ISSUE,{u:GQ_ISSUE.map((_,i)=>fin(tt,P.is+0.2+0.08*i,0.5)),
      lit:[gv_io(tt,P.iw,P.wd,0.4),0,0,gv_io(tt,P.wd,P.why,0.4),0,gv_io(tt,P.why,P.cause-0.4,0.4),gv_io(tt,P.cause,P.date,0.4),fin(tt,P.date,0.5)],litCol:[0,0,0,GV.red]})}],sc.dur));});

// ---- 4 · Which check goes where: the data's way, on a sheet on Yusuf's board; a pin at each of the four places to check, what each
// catches, a thread from each to the data's owner; prevent, check, watch; then the four together ----
scene("where",(ctx,S,t,sc)=>{const c=sc.cues,P=gq_once(sc,"P",()=>({dbt:wAt(sc,"one","A dbt test"),ty:wAt(sc,"more","where it's typed"),ld:wAt(sc,"more","where it's loaded"),
    tb:wAt(sc,"more","the platform's tables"),ea:wAt(sc,"each","Each catches"),ow:wAt(sc,"each","each tells the data's owner"),pv:c.prevent,ck:c.check,wt:c.watch,br:c.breath}));
  gv_shots(ctx,S,t,sc.dur,gq_run([
    {at:0,place:"boardGov",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>gq_way(x,tt,{pin:[fin(tt,P.dbt,0.8),fin(tt,P.ty,0.8),fin(tt,P.ld,0.8),fin(tt,P.tb,0.8)],
      cat:[0,1,2,3].map(i=>fin(tt,P.ea+0.3*i,0.7)),own:fin(tt,P.ow,1.0),w:[fin(tt,P.pv,0.8),fin(tt,P.ck,0.8),fin(tt,P.wt,0.8)],all:fin(tt,P.br,0.8),tag:fin(tt,P.pv,0.5)})}],sc.dur));});

// ---- 5 · Where it's typed: the email as typed, and the clean-up every night; from 2 November, the sign-up form checks it; a test on
// the source for every email since, that should never fail; and once the old emails are corrected, the clean-up goes ----
scene("typed",(ctx,S,t,sc)=>{const c=sc.cues,P=gq_once(sc,"P",()=>({ev:wAt(sc,"cleaned","every night"),cl:wAt(sc,"cleaned","cleaned them"),
    fm:c.form-0.3,ck:wAt(sc,"form","checks each email"),src:c.source-0.3,tst:wAt(sc,"source","A test on the source"),since:wAt(sc,"source","recorded since"),
    stp:wAt(sc,"source","stops the build"),nv:wAt(sc,"never","should never fail"),brk:wAt(sc,"never","the form has broken"),
    gs:c.goes-0.3,cu:wAt(sc,"goes","the clean-up goes"),row:wAt(sc,"goes","checks every row")}));
  gv_shots(ctx,S,t,sc.dur,gq_run([
    // the email as typed, on a card, and the clean-up the data team ran on it every night, on a sheet
    {at:0,place:"desk",keys:[[0,960,500,1]],push:0.02,draw:(x,tt)=>{gq_clSheet(x,90,80,1740,{lit:fin(tt,P.ev,0.5)});gq_emailCard(x,{u:fin(tt,P.cl,0.8),night:fin(tt,P.ev,0.9)});}},
    // from 2 November: the sign-up form, on Tom's screen, checks each email as it's typed
    {at:P.fm,place:"tom",keys:[[P.fm,960,540,1]],push:0.02,draw:(x,tt)=>gq_tomDesk(x,tt,{},q=>gq_tomScreen(q,"form",{p:clamp((tt-P.ck)/1.6,0,1),ok:fin(tt,P.ck+1.7,0.4),tag:fin(tt,P.ck+2.0,0.5)}))},
    // the test on the source: every email recorded since that day is clean, or the build stops; it should never fail
    {at:P.src,place:"desk",keys:[[P.src,960,500,1]],push:0.02,draw:(x,tt)=>{const f=gq_ecSheet(x,90,70,1740,{test:fin(tt,P.tst,0.5),since:fin(tt,P.since,0.5)});
      gq_never(x,f,{stop:fin(tt,P.stp,0.6),never:fin(tt,P.nv,0.8),broke:fin(tt,P.brk,0.6)});}},
    // once the old emails are corrected at the source: the clean-up struck through, and the test's since, so it checks every row
    {at:P.gs,place:"desk",keys:[[P.gs,960,500,1]],push:0.02,draw:(x,tt)=>{gq_req(x,1260,60,fin(tt,P.gs+0.2,0.6));gq_clSheet(x,80,90,1150,{go:fin(tt,P.cu,0.9)});
      gq_ecSheet(x,80,330,1600,{gone:fin(tt,P.row,0.9)});}}],sc.dur));
  wc_year(ctx,56,72,"From 2 November 2026",gv_io(t,P.fm+0.3,P.src-0.2,0.4));});

// ---- 6 · Where it's loaded: the platform team's pipeline; its expectations, one on each table; two enrolments with no ID kept out at
// the door, and counted; the count, in the learning team's issue; and the two fixed where they're kept ----
scene("loaded",(ctx,S,t,sc)=>{const c=sc.cues,P=gq_once(sc,"P",()=>({fl:wAt(sc,"loads","each system's files"),ex:c.expect-0.3,rl:wAt(sc,"expect","rules on each table"),
    ap:c.apart-0.3,kept:wAt(sc,"apart","kept out"),re:c.reaches-0.3,own:wAt(sc,"reaches","reaches its owner"),fx:wAt(sc,"reaches","fixed where it's kept")}));
  gv_shots(ctx,S,t,sc.dur,gq_run([
    // the platform team's loading pipeline: each system's files, into its tables
    {at:0,place:"bigPlat",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>gq_pipe(x,tt,{u:clamp((tt-P.fl+0.3)/2.0,0,1)})},
    // the pipeline's file: an expectation on each table, lit as they're named
    {at:P.ex,place:"desk",keys:[[P.ex,960,500,1]],push:0.02,draw:(x,tt)=>gq_lpSheet(x,{u:clamp((tt-P.ex-0.1)/0.9,0,1),lit:[0,1,2].map(i=>fin(tt,P.rl+0.3*i,0.5))})},
    // at the enrolments' door: two rows with no ID can't pass the expectation; they're kept out, and counted
    {at:P.ap,place:"bigPlat",keys:[[P.ap,960,540,1]],push:0.02,draw:(x,tt)=>gq_door(x,tt,{flow:clamp((tt-P.ap-0.2)/2.2,0,1),out:clamp((tt-P.kept)/1.6,0,1)})},
    // the count reaches the learning team, in its issue
    {at:P.re,place:"bigLearn",keys:[[P.re,960,540,1]],push:0.02,draw:(x,tt)=>gq_issue(x,GQ_ISSUE2,{u:GQ_ISSUE2.map((_,i)=>fin(tt,P.re+0.2+0.08*i,0.5)),
      lit:[gv_io(tt,P.own,P.fx,0.4),0,0,fin(tt,P.own+0.3,0.5)],litCol:[0,0,0,GV.amber]})},
    // and fixed where it's kept: Tom gives the two their IDs, in the short-course platform
    {at:P.fx-0.3,place:"tom",keys:[[P.fx-0.3,960,540,1]],push:0.02,draw:(x,tt)=>gq_tomDesk(x,tt,{},q=>gq_tomScreen(q,"two",{fix:clamp((tt-P.fx-0.2)/2.0,0,1)*2}))}],sc.dur));});

// ---- 7 · What no rule names: one night, half the new badges with no credit; every test passed; monitoring caught it, by what it
// learned and by a profile; the alert, across the campus to the learning team; and the surprise, become a test ----
scene("watch",(ctx,S,t,sc)=>{const c=sc.cues,P=gq_once(sc,"P",()=>({nc:wAt(sc,"half","no credit"),ps:c.passed-0.3,ep:wAt(sc,"passed","Every test passed"),nr:wAt(sc,"passed","no rule said"),
    cg:c.caught-0.3,ct:wAt(sc,"caught","caught it"),ln:wAt(sc,"learns","learns when"),pr:wAt(sc,"profile","a profile"),cn:wAt(sc,"profile","counts, each night"),
    us:wAt(sc,"profile","usually one in twelve"),tw:wAt(sc,"two","one in two"),al:c.alert-0.3,lt:wAt(sc,"alert","the learning team"),
    bc:c.became-0.3,cf:wAt(sc,"became","confirmed it"),bt:wAt(sc,"became","became a test")}));
  gv_shots(ctx,S,t,sc.dur,gq_run([
    // one night, on the data team's big screen: the badges that arrived, half with no credit
    {at:0,place:"bigNight",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>gq_badges(x,{u:clamp((tt-0.3)/1.2,0,1),lit:fin(tt,P.nc,0.6)})},
    // credit_points' tests: not null, and 0 isn't empty, so it passes; no rule for a microcredential's credit
    {at:P.ps,place:"desk",keys:[[P.ps,960,500,1]],push:0.02,draw:(x,tt)=>{gq_cpSheet(x,{u:clamp((tt-P.ps-0.1)/0.9,0,1),pass:fin(tt,P.ep,0.6)});gq_whose(x,1300,140,fin(tt,P.nr,0.6),"no rule for it");}},
    // the badges' quality page: an alert; anomaly detection, in preview; the profile, and that night's point, one in two
    {at:P.cg,place:"bigNight",keys:[[P.cg,960,540,1]],push:0.02,draw:(x,tt)=>gq_quality(x,tt,{st:fin(tt,P.ct,0.5),ad:gv_io(tt,P.ln,P.pr,0.5),pr:fin(tt,P.pr,0.6),
      u:clamp((tt-P.cn)/1.6,0,1)*0.9+fin(tt,P.tw,0.6)*0.1,usual:fin(tt,P.us,0.8),last:fin(tt,P.tw,0.8),al:fin(tt,P.tw+0.6,0.6)})},
    // the alert crosses the campus to the learning team's door, the owner on record
    {at:P.al,place:"campus",keys:[[P.al,1100,560,1.1]],push:0.02,draw:(x,tt)=>{gq_flyAlert(x,clamp((tt-P.al-0.4)/3.4,0,1));
      gq_plate(x,tt,P.lt,null,GV_CP.door[0]+190,GV_CP.door[1]-272,["Learning team","owner on record"]);}},
    // the next morning, at the learning team's: Tom reads the notice
    {at:P.bc-2.4,place:"tom",keys:[[P.bc-2.4,960,540,1]],push:0.02,draw:(x,tt)=>gq_tomDesk(x,tt,{tom:{expr:"concerned"},clock:9.1},q=>gq_tomScreen(q,"alert",{u:fin(tt,P.bc-2.1,0.5)}))},
    // once confirmed, the rule it became: a test on credit_points, and the decision
    {at:P.bc,place:"desk",keys:[[P.bc,960,500,1]],push:0.02,draw:(x,tt)=>{gq_cpSheet(x,{add:clamp((tt-P.bt)/1.2,0,1)});gq_lmsDec(x,1300,100,fin(tt,P.cf,0.6));
      gu_filmTag(x,1300,500,"Fixed where it starts",fin(tt,P.cf+0.4,0.5));}}],sc.dur));
  wc_year(ctx,56,72,"The next morning",gv_io(t,P.bc-2.1,P.bc-0.2,0.4));});

// ---- 8 · One scorecard: the platform's results, by table; the scorecard reading them under the tests', each table's owner from the
// project; every result to one owner, not a shared inbox; measured, not surveyed; and every test with an owner and a dimension ----
scene("card",(ctx,S,t,sc)=>{const c=sc.cues,P=gq_once(sc,"P",()=>({ld:wAt(sc,"land","land on the platform"),bt:wAt(sc,"land","by table"),
    rd:c.reads-0.3,own:wAt(sc,"reads","owner is in the project"),rs:wAt(sc,"reads","the scorecard reads them"),
    ib:c.inbox-0.3,one:wAt(sc,"inbox","reaches one owner"),sh:wAt(sc,"inbox","not a shared inbox"),
    ms:c.measured-0.3,ns:wAt(sc,"measured","not surveyed"),t160:wAt(sc,"measured","a hundred and sixty of"),
    t22:wAt(sc,"platform","twenty-two checks"),od:wAt(sc,"platform","every test had an owner")}));
  gv_shots(ctx,S,t,sc.dur,gq_run([
    // what the platform found last night, a row for each check on each table, in the SQL editor
    {at:0,place:"bigPlat",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>gq_results(x,tt,{u:clamp((tt-P.ld+0.4)/1.6,0,1),tab:gv_io(tt,P.bt,sc.dur,0.5)})},
    // the scorecard, the platform's table under the tests'; each table's owner, from the project
    {at:P.rd,place:"big",keys:[[P.rd,960,540,1]],push:0.02,draw:(x,tt)=>gq_platCard(x,{on:fin(tt,P.own-0.3,0.8),meta:fin(tt,P.own+0.3,0.9),lit:gv_io(tt,P.rs,P.ib,0.5)})},
    // every result to one owner, not a shared inbox
    {at:P.ib,place:"boardGov",keys:[[P.ib,960,540,1]],push:0.02,draw:(x,tt)=>gq_toOwners(x,{x:fin(tt,P.sh,0.6),u:[0,1,2].map(i=>fin(tt,P.one+0.25*i,0.9))})},
    // measured, not surveyed: last night's totals, the tests' and the platform's
    {at:P.ms,place:"deskGov",keys:[[P.ms,960,540,1]],push:0.02,draw:(x,tt)=>gq_measured(x,{x:fin(tt,P.ns,0.6),tag:fin(tt,P.ns,0.5),tests:fin(tt,P.t160,0.6),plat:fin(tt,P.t22,0.6)})},
    // and the governance check's measures: every test with an owner and a dimension
    {at:P.od-0.3,place:"big",keys:[[P.od-0.3,960,540,1]],push:0.02,draw:(x,tt)=>gq_measures(x,{u:clamp((tt-P.od+0.1)/1.0,0,1),lit:fin(tt,P.od+0.6,0.5),tag:fin(tt,P.od+0.3,0.5)})}],sc.dur));});

// ---- 9 · Rules, and monitoring for the rest: this morning, Clara opens the scorecard; one amber cell, on the learning team's list to
// follow up; every cell has an owner; Clara's numbers ticked, and who answers for each; the data's way; the next film; the end card ----
scene("close",(ctx,S,t,sc)=>{const c=sc.cues,P=gq_once(sc,"P",()=>({op:wAt(sc,"opens","opens the scorecard"),am:c.amber-0.3,cell:wAt(sc,"amber","One amber cell"),
    ne:wAt(sc,"amber","no email"),lt:wAt(sc,"amber","the learning team"),el:c.else-0.3,ow:wAt(sc,"else","every cell has an owner"),
    kn:c.knows-0.3,nm:wAt(sc,"knows","which numbers to trust"),who:wAt(sc,"knows","who answers for each"),
    ls:c.last-0.3,rw:wAt(sc,"last","Rules you write"),mn:wAt(sc,"last","monitoring for the rest"),board:c.breath-0.3,end:c.breath+1.6}));
  gv_shots(ctx,S,t,sc.dur,gq_run([
    // this morning: Clara opens the scorecard before the numbers leave; one amber cell
    {at:0,place:"planClose",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>gq_planDesk(x,tt,{bar:"docs/scorecard.md",draw:gq_cardSmall({lit:fin(tt,P.op+0.8,0.6)})})},
    // the scorecard: learning's completeness amber, and its one row under Not passed
    {at:P.am,place:"bigPlan",keys:[[P.am,960,540,1]],push:0.02,draw:(x,tt)=>{gq_scorePage(x,{rows:GQ_LAST,lit:[[3,1,fin(tt,P.cell,0.5),GV.amber]]});gq_notPassed(x,738,{lit:fin(tt,P.ne,0.5)});}},
    // the learning team's list to follow up, on Tom's screen
    {at:P.lt-0.3,place:"tom",keys:[[P.lt-0.3,960,540,1]],push:0.02,draw:(x,tt)=>gq_tomDesk(x,tt,{clock:9.25},q=>gq_tomScreen(q,"follow",{u:fin(tt,P.lt,0.5)}))},
    // everything else passed; a gold pin on each domain: every cell has an owner
    {at:P.el,place:"bigPlan",keys:[[P.el,960,540,1]],push:0.02,draw:(x,tt)=>{gq_scorePage(x,{rows:GQ_LAST,lit:[[3,1,1,GV.amber]],pins:clamp((tt-P.ow)/1.4,0,1)});gq_notPassed(x,738,{});}},
    // Planning: Clara's census numbers ticked, and who answers for each
    {at:P.kn,place:"planClose",keys:[[P.kn,960,540,1]],push:0.02,draw:(x,tt)=>{gq_planDesk(x,tt,{clara:{expr:"smile"},draw:gq_census({tick:[0,1,2,3].map(i=>fin(tt,P.nm+0.25*i,0.5))})});
      gq_tags(x,GQ_WHO,{u:[0,1,2].map(i=>fin(tt,P.who+0.3*i,0.9)),wash:GV.gold});}},
    // the data's way again: rules you write, and monitoring for the rest
    {at:P.ls,place:"boardGov",keys:[[P.ls,960,540,1]],push:0.02,draw:(x,tt)=>gq_way(x,tt,{pin:[1,1,1,1],cat:[1,1,1,1],own:1,w:[fin(tt,P.rw,0.8),fin(tt,P.rw+0.3,0.8),fin(tt,P.mn,0.8)]})},
    // the data team's board: the next film's card lifts
    {at:P.board,place:"board",keys:[[P.board,960,470,1]],push:0.02,draw:(x,tt)=>{if(tt<P.end+0.8)gu_board(x,{lit:[0,0,0,1],lift:[0,0,0,0,fin(tt,P.board+0.5,1.0)]});}}],sc.dur));
  wc_year(ctx,56,72,"This morning",gv_io(t,0.3,P.am-0.6,0.4));
  gv_end(ctx,S,t,P.end,"Quality on the platform","Rules you write, and monitoring for the rest.","Film 4 of 6");});
