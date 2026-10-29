/* ===== Products in open formats: the nine chapters =====
   Each chapter is a few shots in the places of plan.js and data governance's rooms.js, cut together with short dissolves (gv_shots).
   Times inside a chapter come from its cues (when each line starts) and the words of its lines (wAt), so the pictures stay with the
   voice if it's recorded again. Words on screen are on screens, papers, cards, boards and tags, at least 28 px as seen, and above the
   captions. */

// ---- 1 · A promise in a file: Noor's room, Noor and Clara; the six data products on her board, each with its owner, and Clara's
// promise; until now, the promise typed into a catalogue while the table changed every week; the column it promised, gone; Anil's report
// on census day, broken; every promise typed again for a new catalogue; something had to change; now, each promise a file in an open
// standard; the contract written from the model, and the change that would break it, stopped; Jun's column; the ten tables, checked;
// the promise the university's, whichever catalogue shows it; and the title ----
scene("promise",(ctx,S,t,sc)=>{const c=sc.cues,P=gp_once(sc,"P",()=>({cards:wAt(sc,"room","Noor and Clara"),des:c.designs-0.3,six:wAt(sc,"designs","six data products"),
    own:wAt(sc,"designs","an owner who keeps it"),cl:c.clara,cnt:wAt(sc,"clara","the count"),rdy:wAt(sc,"clara","ready by seven"),
    ty:c.typed-0.3,hand:wAt(sc,"typed","typed by hand"),wk:wAt(sc,"typed","the tables changed"),col:wAt(sc,"column","a column"),gone:wAt(sc,"column","no longer had"),
    cen:c.census-0.3,brk:wAt(sc,"census","could break"),fm:c.format-0.3,chg:wAt(sc,"format","change the catalogue"),again:wAt(sc,"format","every promise is typed again"),
    stop:c.change,now:c.now-0.3,code:wAt(sc,"now","kept with the code"),std:wAt(sc,"now","two open standards"),pd:wAt(sc,"pair","one for the product"),
    ct:wAt(sc,"pair","its table's contract"),wr:c.written-0.3,frm:wAt(sc,"written","written from"),dis:wAt(sc,"written","can't disagree"),
    stp:wAt(sc,"written","a change that would break it"),jun:c.jun-0.3,grew:wAt(sc,"jun","its contract grew"),nob:wAt(sc,"jun","no report broke"),
    tn:c.ten-0.3,prom:wAt(sc,"ten","have a promise"),chk:wAt(sc,"ten","checked on every change"),st:c.stay-0.3,stays:wAt(sc,"stay","the promises stay"),
    uni:wAt(sc,"stay","the university's"),board:c.breath-0.3,title:c.breath+1.2}));
  gv_shots(ctx,S,t,sc.dur,gp_run([
    // today, in Noor's room: Noor at her map, Clara with her product's card
    {at:0,place:"noor",keys:[[0,960,540,1]],push:0.025,draw:(x,tt)=>gp_noorRoom(x,tt,{cards:gv_io(tt,P.cards-0.2,P.des-0.4,0.4)})},
    // on her board: the six data products, each with its owner; then Clara's, forward: its owner and its promise
    {at:P.des,place:"noorBoard",keys:[[P.des,960,540,1]],push:0.02,draw:(x,tt)=>gp_board6(x,{u:[0,1,2,3,4,5].map(i=>fin(tt,P.des+0.9+0.3*i,0.6)),own:fin(tt,P.own,0.9),
      open:clamp((tt-P.cl-0.1)/1.2,0,1),rows:[fin(tt,P.cnt,0.6),fin(tt,P.rdy,0.6)]})},
    // until now: the catalogue, its card typed by hand, beside the table as it changed week by week; the column it promised, gone
    {at:P.ty,place:"noorScreen",keys:[[P.ty,960,540,1]],push:0.02,draw:(x,tt)=>{gp_typed(x,tt,{type:clamp((tt-P.hand)/3.2,0,1),wk:1+5*clamp((tt-P.wk)/2.4,0,1),
      miss:fin(tt,P.col,0.6),q:fin(tt,P.gone,0.5)});gp_memory(x,fin(tt,P.ty,0.8));}},
    // on census day, in the Faculty of Health: Anil's report on next semester's places doesn't load
    {at:P.cen,place:"faculty",keys:[[P.cen,960,540,1]],push:0.02,draw:(x,tt)=>{gp_anil(x,tt,{anil:{expr:tt>P.brk+0.6?"concerned":"calm"},draw:q=>gp_report(q,{err:fin(tt,P.brk,0.6)})});
      gu_nameCard(x,560,140,"Anil Kurian","Faculty of Health",gv_io(tt,P.cen+0.4,P.fm-0.4,0.4));gp_memory(x,1);}},
    // a new catalogue, its fields its own: the one in use crossed out, and every promise typed again; then it steps back
    {at:P.fm,place:"noorBig",keys:[[P.fm,960,540,1]],push:0.02,draw:(x,tt)=>{gp_formats(x,tt,{x:fin(tt,P.chg,0.6),re:6*clamp((tt-P.again+0.2)/3.6,0,1)});
      gp_memory(x,1);gp_veil(x,fin(tt,P.stop,0.8));}},
    // now: the project's folders, and in them the product's file and its table's contract, each in its open standard
    {at:P.now,place:"desk",keys:[[P.now,960,540,1]],push:0.02,draw:(x,tt)=>gp_nowFiles(x,tt,{tree:fin(tt,P.code-0.2,0.6),d:clamp((tt-P.std)/0.9,0,1),
      c:clamp((tt-P.std-0.6)/0.9,0,1),std:[fin(tt,P.pd,0.5),fin(tt,P.ct,0.5)]})},
    // the contract, written from the model by the script; each line threaded to its line; a change that would break it: the impact check
    {at:P.wr,place:"desk",keys:[[P.wr,960,540,1]],push:0.02,draw:(x,tt)=>gp_written(x,tt,{u:clamp((tt-P.frm)/1.0,0,1),thr:clamp((tt-P.dis+0.4)/1.4,0,1),
      ck:clamp((tt-P.stp)/1.4,0,1)})},
    // Jun's column on credentials: its contract grows by a line, by itself, and every report that reads it still works
    {at:P.jun,place:"desk",keys:[[P.jun,960,540,1]],push:0.02,draw:(x,tt)=>{gp_junCol(x,tt,{add:clamp((tt-P.grew)/1.2,0,1),read:clamp((tt-P.jun-0.4)/1.2,0,1),
      ok:clamp((tt-P.nob)/0.9,0,1),tag:fin(tt,P.jun+0.6,0.5)});gu_nameCard(x,90,700,"Jun Park","analytics engineer",gv_io(tt,P.jun+0.3,P.tn-0.4,0.4));}},
    // the data team's board: the ten tables other teams read, each ticked, checked on every change
    {at:P.tn,place:"board",keys:[[P.tn,960,500,1]],push:0.02,draw:(x,tt)=>gp_ten(x,tt,{u:clamp((tt-P.tn-0.1)/1.6,0,1),tick:clamp((tt-P.prom)/1.6,0,1),ck:fin(tt,P.chk,0.6)})},
    // whichever catalogue shows it: two catalogues reading the same file, the university's
    {at:P.st,place:"desk",keys:[[P.st,960,540,1]],push:0.02,draw:(x,tt)=>gp_stay(x,tt,{cards:clamp((tt-P.st-0.1)/1.0,0,1),read:clamp((tt-P.stays)/1.0,0,1),
      own:clamp((tt-P.uni)/1.0,0,1)})},
    // the data team's board, close: the series' six cards; the fifth lights and lifts, and becomes the title
    {at:P.board,place:"board",keys:[[P.board,960,470,1]],push:0.02,draw:(x,tt)=>{if(tt<P.title+0.8)gu_board(x,{lit:[0,0,0,0,fin(tt,P.board+0.3,0.8)],lift:[0,0,0,0,fin(tt,P.board+1.0,1.0)]});}}],sc.dur));
  wc_year(ctx,56,72,"Until now",gv_io(t,P.ty+0.4,P.now-0.2,0.4));
  gv_title(ctx,S,t,P.title,"Products in open formats","each promise a file, in an open standard","Film 5 of 6 · data governance");});

// ---- 2 · Written by its owner: Clara's product file, each part lit as it's named: what it's for, how to use it, its owner, the table
// it offers, its service levels, where to ask; then Clara at her desk: the data team builds the table, Clara keeps the promise ----
scene("owner",(ctx,S,t,sc)=>{const c=sc.cues,P=gp_once(sc,"P",()=>({wr:wAt(sc,"file","its owner writes"),pur:wAt(sc,"for","what the product is for"),use:wAt(sc,"for","how to use it"),
    own:wAt(sc,"names","as its owner"),tab:wAt(sc,"names","the table it offers"),sl:wAt(sc,"names","its service levels"),nt:wAt(sc,"names","built every night"),
    sv:wAt(sc,"names","ready by seven"),ask:c.ask,kp:c.keeps-0.3,dt:wAt(sc,"keeps","The data team builds"),cl:wAt(sc,"keeps","Clara keeps")}));
  gv_shots(ctx,S,t,sc.dur,gp_run([
    // her file, on the desk, as she wrote it; each part lit as it's named
    {at:0,place:"desk",keys:[[0,960,500,1]],push:0.02,draw:(x,tt)=>gp_prodFile(x,{u:clamp((tt-0.2)/0.9,0,1),note:fin(tt,P.wr,0.8),
      lit:[gv_io(tt,P.pur,P.use,0.4),gv_io(tt,P.use,P.own-0.6,0.4),gv_io(tt,P.own,P.tab,0.4),gv_io(tt,P.tab,P.sl,0.4),gv_io(tt,P.sl,P.nt,0.4),gv_io(tt,P.nt,P.sv,0.4),
        gv_io(tt,P.sv,P.ask,0.4),fin(tt,P.ask+0.2,0.4)]})},
    // Planning's office: Clara at her desk, her file on her screen; who does what
    {at:P.kp,place:"planClose",keys:[[P.kp,960,540,1]],push:0.02,draw:(x,tt)=>gp_planDesk(x,tt,{clara:{expr:"smile"},who:[fin(tt,P.dt,0.9),fin(tt,P.cl,0.9)],own:fin(tt,P.cl,0.6)})}],sc.dur));});

// ---- 3 · The contract, from the model: the contract, what each part promises; nobody types it; the script writes it from the model
// and the product's file, in the Open Data Contract Standard; each line of the model threaded to its line; and on a pull request, a hand
// edit fails the check, then passes, up to date and valid ----
scene("contract",(ctx,S,t,sc)=>{const c=sc.cues,P=gp_once(sc,"P",()=>({n:["each column","its type","always there","identify a person","the tests it must pass"].map(w=>wAt(sc,"each",w)),
    nb:c.nobody,ty:wAt(sc,"nobody","types it"),scr:wAt(sc,"script","A script writes it"),mdl:wAt(sc,"script","from the model"),std:wAt(sc,"script","Open Data Contract Standard"),
    side:wAt(sc,"side","each line"),pr:c.check-0.3,fail:wAt(sc,"check","a check fails"),rules:wAt(sc,"check","breaks the standard's rules")}));
  gv_shots(ctx,S,t,sc.dur,gp_run([
    // the contract on the desk, what it promises in pencil beside it; a pencil that stops short; then the model, the product's file and
    // the script, and each line of the model threaded to its line in the contract
    {at:0,place:"desk",keys:[[0,960,500,1]],push:0.02,draw:(x,tt)=>gp_contractDesk(x,tt,{note:P.n.map(w=>fin(tt,w,0.8)),pen:clamp((tt-P.nb+0.2)/1.4,0,1),
      warn:fin(tt,P.ty+0.3,0.6),gen:fin(tt,P.ty+0.3,0.6),scr:clamp((tt-P.scr)/1.2,0,1),src:clamp((tt-P.mdl)/1.2,0,1),std:fin(tt,P.std,0.6),
      thr:[0,1,2,3,4].map(k=>clamp((tt-P.side-0.3*k)/0.9,0,1))})},
    // Jun's pull request, its contract edited by hand: the products check fails, out of date; made in the model, and the script run, it
    // passes, up to date and valid against the standards
    {at:P.pr,place:"big",keys:[[P.pr,960,540,1]],push:0.02,draw:(x,tt)=>gp_prCheck(x,tt,{hand:fin(tt,P.pr+0.5,0.8),fail:clamp((tt-P.fail)/1.0,0,1),
      pass:clamp((tt-P.rules+0.2)/1.2,0,1),std:fin(tt,P.rules+1.2,0.6)})}],sc.dur));});

// ---- 4 · Every shared table, in one product: the data team's thirty-three tables; the ten other teams read, each into one of the six
// products; and Jun's completions, in no product, stopped until a product takes it in ----
scene("shared",(ctx,S,t,sc)=>{const c=sc.cues,P=gp_once(sc,"P",()=>({ten:wAt(sc,"ten","ten are read"),one:wAt(sc,"ten","each is in exactly one"),six:wAt(sc,"ten","six products"),
    same:c.same-0.3,np:wAt(sc,"new","in no product"),tk:wAt(sc,"new","until a product takes it in")}));
  gv_shots(ctx,S,t,sc.dur,gp_run([
    // the board: thirty-three tables; ten lit; the six stalls, each of the ten flying into its own
    {at:0,place:"board",keys:[[0,960,520,1]],push:0.02,draw:(x,tt)=>gp_33(x,tt,{u:clamp((tt-0.4)/2.0,0,1),ten:fin(tt,P.ten,0.8),st:clamp((tt-P.one)/1.2,0,1),
      fly:clamp((tt-P.one-0.4)/1.8,0,1),n:[0,1,2,3,4,5].map(i=>fin(tt,P.six+0.8+0.12*i,0.5)),head:fin(tt,P.six,0.8)})},
    // the products check on Jun's pull request: a shared table in no product stops it; a product takes it in, and it passes
    {at:P.same,place:"big",keys:[[P.same,960,540,1]],push:0.02,draw:(x,tt)=>gp_newPR(x,tt,{fail:clamp((tt-P.np)/1.0,0,1),prod:clamp((tt-P.tk)/1.6,0,1),
      pass:clamp((tt-P.tk-1.8)/1.0,0,1),tag:fin(tt,P.same+0.6,0.5)})}],sc.dur));});

// ---- 5 · A change that would break it: the model changes and its contract follows; a rename breaks the census dashboard; the impact
// check fails, needs a new version; version 1 stays with a date to go, version 2 beside it; credentials' two versions, the first
// deprecated; and Jun's column, added, breaking nobody ----
scene("break",(ctx,S,t,sc)=>{const c=sc.cues,P=gp_once(sc,"P",()=>({ch:wAt(sc,"follows","a model changes"),fol:wAt(sc,"follows","its contract follows"),sm:c.some,
    br:wAt(sc,"some","break the readers"),rn:c.rename-0.3,fl:wAt(sc,"rename","the impact check fails"),bk:wAt(sc,"rename","it's breaking"),nv:wAt(sc,"rename","needs a new version"),
    sy:c.stays-0.3,dt:wAt(sc,"stays","a date to go"),nw:wAt(sc,"stays","the new one goes beside it"),tw:c.two-0.3,has:wAt(sc,"two","has two"),
    ret:wAt(sc,"two","retires on"),d31:wAt(sc,"two","thirty-first"),cs:wAt(sc,"two","its contract says"),dep:wAt(sc,"two","deprecated"),out:wAt(sc,"two","on its way out"),
    ad:c.add-0.3,nc:wAt(sc,"add","a new column"),nb:wAt(sc,"add","breaks nobody")}));
  gv_shots(ctx,S,t,sc.dur,gp_run([
    // the model's line renamed, the contract's following by itself; the census dashboard's thread breaks
    {at:0,place:"desk",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>gp_renameDesk(x,tt,{ren:clamp((tt-P.ch)/0.8,0,1),fol:clamp((tt-P.fol)/0.8,0,1),rd:fin(tt,P.sm,0.6),
      brk:clamp((tt-P.br)/0.8,0,1)})},
    // the rename's pull request: the impact check fails; breaking, it needs a new version
    {at:P.rn,place:"big",keys:[[P.rn,960,540,1]],push:0.02,draw:(x,tt)=>gp_renamePR(x,tt,{fail:clamp((tt-P.fl)/1.0,0,1),lit:fin(tt,P.bk,0.6),who:fin(tt,P.nv,0.6)})},
    // on the data team's board: version 1 stays, with a date to go; version 2 beside it
    {at:P.sy,place:"board",keys:[[P.sy,960,520,1]],push:0.02,draw:(x,tt)=>gp_editions(x,tt,{v1:fin(tt,P.sy+0.2,0.6),date:clamp((tt-P.dt)/0.9,0,1),v2:fin(tt,P.nw,1.0),
      rd:fin(tt,P.sy+0.8,0.8)})},
    // credentials' two versions: version 1's date to go, ringed; its contract, deprecated, on its way out
    {at:P.tw,place:"desk",keys:[[P.tw,960,540,1]],push:0.02,draw:(x,tt)=>gp_credVers(x,tt,{u:clamp((tt-P.tw-0.1)/0.9,0,1),two:fin(tt,P.has,0.6),date:fin(tt,P.ret,0.6),
      ring:clamp((tt-P.d31)/1.0,0,1),c:clamp((tt-P.cs)/0.9,0,1),dep:fin(tt,P.dep,0.6),out:clamp((tt-P.out)/1.0,0,1)})},
    // better, add: Jun's column again, and every reader still whole
    {at:P.ad,place:"desk",keys:[[P.ad,960,540,1]],push:0.02,draw:(x,tt)=>gp_junCol(x,tt,{add:clamp((tt-P.nc)/1.0,0,1),read:1,ok:clamp((tt-P.nb)/0.9,0,1),
      tag:fin(tt,P.ad+0.4,0.5),tagTitle:"Change without surprises"})}],sc.dur,1));});

// ---- 6 · Who reads it: Clara's descriptor, who reads it, from dbt's exposures: the census dashboard; what it's built from: two of Mei's
// products; and when Mei's learner records change, the owners she tells ----
scene("readers",(ctx,S,t,sc)=>{const c=sc.cues,P=gp_once(sc,"P",()=>({rec:wAt(sc,"says","from the record"),bf:wAt(sc,"built","what it's built from"),wh:c.when-0.3,
    chg:wAt(sc,"when","one of them changes"),mk:wAt(sc,"when","Mei knows"),tell:wAt(sc,"when","who to tell"),ship:wAt(sc,"when","before anything ships")}));
  gv_shots(ctx,S,t,sc.dur,gp_run([
    // Clara's descriptor: its readers, then its inputs, two of Mei's products
    {at:0,place:"desk",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>gp_readers(x,tt,{u:clamp((tt-0.2)/0.9,0,1),rd:clamp((tt-P.rec)/2.0,0,1),built:clamp((tt-P.bf)/2.0,0,1)})},
    // learner_records' descriptor: the products that read it; Mei tells each of their owners
    {at:P.wh,place:"desk",keys:[[P.wh,960,540,1]],push:0.02,draw:(x,tt)=>gp_meiTells(x,tt,{u:clamp((tt-P.wh-0.1)/0.9,0,1),lit:clamp((tt-P.chg)/1.2,0,1),mei:fin(tt,P.mk,0.6),
      tell:clamp((tt-P.tell)/2.4,0,1),tag:fin(tt,P.ship,0.5)})}],sc.dur,1));});

// ---- 7 · Open standards: the two files and the two standards they're written in, as books, kept by Bitol at the Linux Foundation,
// free to use, versioned; tools that know them read the file, and the check holds every file to the rules; the versions the project
// keeps, and how it moves ----
scene("open",(ctx,S,t,sc)=>{const c=sc.cues,P=gp_once(sc,"P",()=>({bf:wAt(sc,"both","Both files"),dp:wAt(sc,"both","one for data products"),dc:wAt(sc,"both","one for data contracts"),
    bit:wAt(sc,"bitol","Bitol"),free:wAt(sc,"bitol","free for anyone"),ver:wAt(sc,"bitol","versioned"),tl:c.tools-0.3,tk:wAt(sc,"tools","Tools that know them"),
    ck:wAt(sc,"tools","a check holds"),rl:wAt(sc,"tools","the standard's rules"),kp:c.keeps-0.3,today:wAt(sc,"keeps","its catalogue reads today"),mv:wAt(sc,"keeps","moves when")}));
  gv_shots(ctx,S,t,sc.dur,gp_run([
    // the two files, then a book for each standard, and who keeps them; the licence; a newer edition behind each
    {at:0,place:"desk",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>gp_books(x,tt,{files:clamp((tt-P.bf)/0.9,0,1),u:[fin(tt,P.dp,0.8),fin(tt,P.dc,0.8)],
      thr:clamp((tt-P.dc-0.2)/1.4,0,1),who:fin(tt,P.bit,0.6),lic:fin(tt,P.free,0.6),newer:clamp((tt-P.ver)/1.2,0,1)})},
    // three tools read the contract; the check, in a terminal: every file up to date and valid
    {at:P.tl,place:"desk",keys:[[P.tl,960,540,1]],push:0.02,draw:(x,tt)=>gp_tools(x,tt,{read:clamp((tt-P.tk)/2.0,0,1),chk:clamp((tt-P.ck)/1.4,0,1),valid:fin(tt,P.rl,0.6)})},
    // the versions it keeps: what the catalogue reads today, and how to move to a newer one
    {at:P.kp,place:"desk",keys:[[P.kp,960,540,1]],push:0.02,draw:(x,tt)=>gp_kept(x,tt,{u:clamp((tt-P.kp-0.1)/0.9,0,1),dir:fin(tt,P.kp+0.5,0.6),lit:fin(tt,P.today,0.6),
      move:fin(tt,P.mv,0.6)})}],sc.dur));});

// ---- 8 · A catalogue over the platform: Sam's screens, Ontos and Unity Catalog; Ontos imports a contract from its file, and lays the
// products out by domain, each with its owner team; a steward reviews before it's published; the nightly policy on owners; a column
// linked to its business term; a Labs project, as it is; and the files at home, the catalogue a copy ----
scene("catalogue",(ctx,S,t,sc)=>{const c=sc.cues,P=gp_once(sc,"P",()=>({on:wAt(sc,"ontos","Ontos"),imp:c.imports-0.3,ff:wAt(sc,"imports","from its file"),
    lay:wAt(sc,"imports","lays the products"),team:wAt(sc,"imports","each with its team"),sw:c.steward-0.3,stw:wAt(sc,"steward","A steward"),
    rv:wAt(sc,"steward","reviews"),pub:wAt(sc,"steward","published"),po:c.policy-0.3,eve:wAt(sc,"policy","Each night"),act:wAt(sc,"policy","an active one"),
    no:wAt(sc,"policy","with no owner"),tag:wAt(sc,"policy","is tagged"),told:wAt(sc,"policy","governance is told"),lk:c.link-0.3,lc:wAt(sc,"link","link each column"),
    bt:wAt(sc,"link","the business term"),lb:c.labs-0.3,asis:wAt(sc,"labs","comes as it is"),nfs:wAt(sc,"labs","no formal support"),hm:c.home-0.3,
    fl:wAt(sc,"home","the files"),ah:wAt(sc,"home","at home"),cp:wAt(sc,"home","holds a copy")}));
  gv_shots(ctx,S,t,sc.dur,gp_run([
    // the platform team's room: Sam, and on his screens Ontos, from Databricks Labs, beside Unity Catalog
    {at:0,place:"platform",keys:[[0,960,540,1]],push:0.025,draw:(x,tt)=>{gp_samDesk(x,tt,{draw:q=>gp_ontosScreens(q,tt,{u:clamp((tt-P.on)/1.0,0,1)})});
      gp_plate(x,tt,0.6,P.imp-0.5,1570,296,["Sam Okafor","platform team"]);}},
    // Ontos imports the contract from its file
    {at:P.imp,place:"bigPlat",keys:[[P.imp,960,540,1]],push:0.02,draw:(x,tt)=>gp_import(x,tt,{up:clamp((tt-P.ff+0.3)/0.9,0,1),rev:clamp((tt-P.ff-0.6)/0.9,0,1)})},
    // and lays the products out by domain, each with its owner team
    {at:P.lay-0.2,place:"bigPlat",keys:[[P.lay-0.2,960,540,1]],push:0.02,draw:(x,tt)=>gp_domains(x,tt,{u:clamp((tt-P.lay)/1.4,0,1),team:fin(tt,P.team,0.6)})},
    // Clara's product on its way to being published: a data steward reviews and approves; its owner publishes
    {at:P.sw,place:"bigPlat",keys:[[P.sw,960,540,1]],push:0.02,draw:(x,tt)=>gp_lifecycle(x,tt,{step:lerp(1,4,easeCam(clamp((tt-P.rv)/(P.pub-P.rv+0.6),0,1))),
      stw:fin(tt,P.stw,0.8),pub:fin(tt,P.pub,0.8)})},
    // the policy every night: an active product with no owner is tagged, and governance is told
    {at:P.po,place:"bigPlat",keys:[[P.po,960,540,1]],push:0.02,draw:(x,tt)=>gp_policy(x,tt,{sch:fin(tt,P.eve,0.6),lit:[0,gv_io(tt,P.act,P.no,0.4),fin(tt,P.no,0.5),0,
      fin(tt,P.tag,0.5),fin(tt,P.told,0.5),0]})},
    // a column linked to the business term it holds
    {at:P.lk,place:"bigPlat",keys:[[P.lk,960,540,1]],push:0.02,draw:(x,tt)=>gp_link(x,tt,{link:fin(tt,P.lc,0.8),term:fin(tt,P.bt,0.8)})},
    // a Labs project comes as it is: what Databricks says of every one
    {at:P.lb,place:"bigPlat",keys:[[P.lb,960,540,1]],push:0.02,draw:(x,tt)=>gp_labs(x,tt,{lit:[fin(tt,P.asis,0.5),fin(tt,P.asis,0.5),fin(tt,P.nfs,0.5),fin(tt,P.asis+0.3,0.5)]})},
    // on Noor's map: the files' home, in the project, and the catalogue's copy, one way
    {at:P.hm,place:"mapClose",keys:[[P.hm,960,540,1],[P.hm+0.5,1150,640,1.22]],d:2.4,push:0.01,draw:(x,tt)=>gp_home(x,tt,{home:fin(tt,P.ah,0.6),arr:clamp((tt-P.cp+0.4)/1.0,0,1),
      copy:fin(tt,P.cp,0.6),tag:fin(tt,P.fl,0.5)})}],sc.dur));});

// ---- 9 · Outlives the tool: census day next March, at dawn: Anil opens Clara's product in the catalogue, reads its promise, and plans
// from it by seven; whichever catalogue it is by then, the promise is the same file, in its open standard, which any tool can read; the
// catalogue goes, the file stays; the next film; the end card ----
scene("close",(ctx,S,t,sc)=>{const c=sc.cues,P=gp_once(sc,"P",()=>({rd:wAt(sc,"march","read its promise"),pl:wAt(sc,"march","plan from it"),sv:wAt(sc,"march","by seven"),
    ch:c.changed-0.3,cc:wAt(sc,"changed","the catalogue has changed"),fi:wAt(sc,"file","it's a file"),of:wAt(sc,"file","in an open format"),
    kc:wAt(sc,"file","kept with the code"),any:wAt(sc,"file","any tool"),ot:wAt(sc,"last","outlives the tool"),board:c.breath-0.3,end:c.breath+1.6}));
  gv_shots(ctx,S,t,sc.dur,gp_run([
    // census day next March, at dawn, in the Faculty of Health: Anil reads the promise, and plans from it by seven
    {at:0,place:"facultyDawn",keys:[[0,960,540,1]],push:0.025,draw:(x,tt)=>{gp_anil(x,tt,{desk:"facDeskDawn",anil:{expr:tt>P.pl?"smile":"calm"},
      draw:q=>gp_dawnScreen(q,tt,{read:fin(tt,P.rd,0.6),plan:fin(tt,P.pl,0.8),time:tt<P.sv?"6:58":"7:00"})});
      gu_nameCard(x,560,140,"Anil Kurian","Faculty of Health",gv_io(tt,0.6,P.ch-0.6,0.4));}},
    // whichever catalogue it is by then: the same promise, read from the same file, in its open standard; the catalogue goes, the file stays
    {at:P.ch,place:"desk",keys:[[P.ch,960,540,1]],push:0.02,draw:(x,tt)=>gp_frames(x,tt,{swap:fin(tt,P.cc,1.0),file:clamp((tt-P.fi)/1.0,0,1),std:fin(tt,P.of,0.6),
      own:fin(tt,P.kc,0.6),read:clamp((tt-P.any)/1.0,0,1),go:fin(tt,P.ot,1.2)})},
    // the data team's board: the next film's card lifts
    {at:P.board,place:"board",keys:[[P.board,960,470,1]],push:0.02,draw:(x,tt)=>{if(tt<P.end+0.8)gu_board(x,{lit:[0,0,0,0,1],lift:[0,0,0,0,0,fin(tt,P.board+0.5,1.0)]});}}],sc.dur));
  wc_year(ctx,56,72,"Census day, March 2027",gv_io(t,0.3,P.ch-0.6,0.4));
  gv_end(ctx,S,t,P.end,"Products in open formats","A contract in an open format outlives the tool.","Film 5 of 6");});
