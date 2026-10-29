/* ===== The marketplace: the nine chapters =====
   Each chapter is a few shots in the places of plan.js and data governance's rooms.js, cut together with short dissolves (gv_shots).
   Times inside a chapter come from its cues (when each line starts) and the words of its lines (wAt), so the pictures stay with the
   voice if it's recorded again. Words on screen are on screens, papers, cards, boards and tags, at least 28 px as seen, and above the
   captions. */

// ---- 1 · Asking around: today, in the Faculty of Health, Anil plans next semester's places; the certificate's last unit, a hospital
// placement arranged months ahead; one place for each learner a unit from finishing; in September, nobody owned the table and he didn't
// know whom to ask; three emails, and a copy back; it counted one, the census report two; one place offered, and a learner who would
// have waited; the copy in his inbox, its codes, nobody's yes and no end date; something had to change; now, the products in one
// catalogue like a shop window, each with its owner; this morning, found and asked; Clara's yes, until January; her table agrees; a
// second place; the old copy deleted; and the title ----
scene("asking",(ctx,S,t,sc)=>{const c=sc.cues,P=gk_once(sc,"P",()=>({card:c.today+0.6,cert:c.cert-0.3,ce:c.cert,ahead:wAt(sc,"cert","arranged months ahead"),
    count:c.count-0.3,ct:c.count,unit:wAt(sc,"count","a unit from finishing"),sept:c.sept-0.3,nob:wAt(sc,"sept","nobody owned"),whom:wAt(sc,"sept","whom to ask"),
    around:c.around-0.3,ask:c.around,col:wAt(sc,"around","a colleague"),one:c.one-0.3,cnt:wAt(sc,"one","one learner"),cen:c.two,which:wAt(sc,"two","which was right"),
    off:c.offered-0.3,op:wAt(sc,"offered","offered one place"),wait:wAt(sc,"offered","would have waited"),inb:c.inbox-0.3,lead:wAt(sc,"inbox","lead back"),
    nyes:wAt(sc,"inbox","nobody's yes"),nend:wAt(sc,"inbox","no end date"),chg:c.change,now:c.now-0.3,dp:wAt(sc,"now","data products"),own:wAt(sc,"now","its owner"),
    find:c.find,askO:wAt(sc,"find","ask its owner"),mor:c.morning-0.3,found:wAt(sc,"morning","found"),asked:wAt(sc,"morning","and asked"),yes:c.yes-0.3,
    sy:wAt(sc,"yes","said yes"),jan:wAt(sc,"yes","until the end of January"),agr:c.agrees-0.3,ag:wAt(sc,"agrees","agrees"),sec:c.second-0.3,
    sp:wAt(sc,"second","a second place"),nw:wAt(sc,"second","no one waits"),del:c.deleted-0.3,dl:wAt(sc,"deleted","deleted"),board:c.breath-0.3,title:c.breath+1.2}));
  gv_shots(ctx,S,t,sc.dur,gk_run([
    // today, in the Faculty of Health: Anil, and on his screen next semester's places, the hospital places still to work out
    {at:0,place:"faculty",keys:[[0,960,540,1]],push:0.025,draw:(x,tt)=>{gk_anil(x,tt,{draw:q=>gk_placesForm(q,tt,{})});
      gu_nameCard(x,560,140,"Anil Kurian","Faculty of Health",gv_io(tt,P.card,P.cert-0.4,0.4));}},
    // the certificate, unit by unit, the last a placement in a hospital; the calendar's pages turn to next semester
    {at:P.cert,place:"desk",keys:[[P.cert,960,540,1]],push:0.02,draw:(x,tt)=>gk_cert(x,tt,{u:clamp((tt-P.ce-0.1)/3.0,0,1),cal:clamp((tt-P.ahead)/3.0,0,1)})},
    // its learners, each with a bar of credit; the two a unit from finishing
    {at:P.count,place:"desk",keys:[[P.count,960,540,1]],push:0.02,draw:(x,tt)=>gk_learners(x,tt,{u:clamp((tt-P.ct)/1.8,0,1),near:fin(tt,P.unit,0.6),
      note:clamp((tt-P.unit-0.1)/1.2,0,1)})},
    // in September: no number to write in, and nobody to ask
    {at:P.sept,place:"faculty",keys:[[P.sept,960,540,1]],push:0.025,draw:(x,tt)=>{gk_anil(x,tt,{anil:{expr:tt>P.nob?"worried":"calm"},draw:q=>gk_placesForm(q,tt,{n:"?"})});
      wc_hand(x,"whom to ask?",1250,330,{size:44,w:700,col:WC_PENCIL,align:"center",p:clamp((tt-P.whom)/0.9,0,1)});gk_memory(x,1);}},
    // he asked around: three emails across the campus, and one came back with a copy
    {at:P.around,place:"campus",keys:[[P.around,960,540,1]],push:0.02,draw:(x,tt)=>{gk_mail(x,tt,{out:clamp((tt-P.ask)/1.8,0,1),back:clamp((tt-P.col)/1.8,0,1)});
      gk_memory(x,1);}},
    // the copy counted one; the census report said two; which was right?
    {at:P.one,place:"desk",keys:[[P.one,960,540,1]],push:0.02,draw:(x,tt)=>{gk_copy(x,tt,{one:fin(tt,P.cnt,0.8),two:fin(tt,P.cen,0.8),q:clamp((tt-P.which)/1.0,0,1)});
      gk_memory(x,1);}},
    // one place offered; the second learner a unit from finishing would have waited a semester
    {at:P.off,place:"desk",keys:[[P.off,960,540,1]],push:0.02,draw:(x,tt)=>{gk_placement(x,tt,{n:fin(tt,P.op,0.6),back:clamp((tt-P.wait)/1.4,0,1)});gk_memory(x,1);}},
    // the copy in his inbox: a code for every learner, one leading back to a name; nobody's yes, no end date; then the picture steps back
    {at:P.inb,place:"facBig",keys:[[P.inb,960,540,1]],push:0.02,draw:(x,tt)=>{gk_inbox(x,tt,{lead:clamp((tt-P.lead)/1.2,0,1),yes:clamp((tt-P.nyes)/1.0,0,1),
      end:clamp((tt-P.nend)/1.0,0,1)});gk_memory(x,1);gk_veil(x,fin(tt,P.chg,0.8));}},
    // now: the products in one catalogue, like a shop window, each with its owner; you find one, and ask, saying why and until when
    {at:P.now,place:"shop",keys:[[P.now,960,540,1]],push:0.02,draw:(x,tt)=>gk_shop(x,tt,{u:[0,1,2,3,4,5].map(i=>fin(tt,P.dp+0.2+0.25*i,0.6)),own:fin(tt,P.own,0.8),
      lift:fin(tt,P.find,0.8),req:fin(tt,P.askO,0.8)})},
    // this morning: Anil finds Planning's product in a minute, and asks
    {at:P.mor,place:"faculty",keys:[[P.mor,960,540,1]],push:0.025,draw:(x,tt)=>gk_anil(x,tt,{anil:{expr:tt>P.found+0.6?"smile":"calm"},
      draw:q=>gk_search(q,tt,{q:clamp((tt-P.mor-0.5)/1.2,0,1),res:fin(tt,P.found,0.6),lift:fin(tt,P.found+0.5,0.6),ask:clamp((tt-P.asked)/0.8,0,1)})})},
    // Planning: Clara, its owner, says yes by the afternoon; the key, until the end of January
    {at:P.yes,place:"planClose",keys:[[P.yes,960,540,1]],push:0.025,draw:(x,tt)=>{gk_planDesk(x,tt,{clara:{expr:tt>P.sy?"smile":"calm"},
      draw:q=>gk_reqScreen(q,tt,{yes:clamp((tt-P.sy)/0.8,0,1)})});gu_nameCard(x,1240,96,"Clara Jensen","Planning",gv_io(tt,P.yes+0.5,P.agr-0.4,0.4));
      gk_rise(x,fin(tt,P.jan,0.6),()=>gk_key(x,1220,836,0.1,"until 31 Jan 2027",{flat:1}),10);}},
    // her table agrees with the census report: two
    {at:P.agr,place:"desk",keys:[[P.agr,960,540,1]],push:0.02,draw:(x,tt)=>gk_agree(x,tt,{agree:0.5+0.5*clamp((tt-P.ag)/1.2,0,1)})},
    // a second place, and the second learner steps forward
    {at:P.sec,place:"desk",keys:[[P.sec,960,540,1]],push:0.02,draw:(x,tt)=>gk_placement(x,tt,{n:1+fin(tt,P.sp,0.6),back:1-clamp((tt-P.nw)/1.4,0,1),fwd:1})},
    // the old copy, deleted
    {at:P.del,place:"facBig",keys:[[P.del,960,540,1]],push:0.02,draw:(x,tt)=>gk_inbox(x,tt,{del:clamp((tt-P.dl)/1.0,0,1)})},
    // the data team's board, close: the series' six cards; the sixth lights and lifts, and becomes the title
    {at:P.board,place:"board",keys:[[P.board,960,470,1]],push:0.02,draw:(x,tt)=>{if(tt<P.title+0.8)gu_board(x,{lit:[0,0,0,0,0,fin(tt,P.board+0.3,0.8)],
      lift:[0,0,0,0,0,fin(tt,P.board+1.0,1.0)]});}}],sc.dur));
  wc_year(ctx,56,72,"Today",gv_io(t,0.3,P.sept-0.2,0.4));wc_year(ctx,56,72,"September",gv_io(t,P.sept+0.2,P.inb,0.4));
  wc_year(ctx,56,72,"Today",gv_io(t,P.mor+0.2,P.del,0.4));
  gv_title(ctx,S,t,P.title,"The marketplace","find data, and ask for it","Film 6 of 6 · data governance");});

// ---- 2 · A shop window: the catalogue is Ontos, on Sam's screens; its marketplace, every live product with its domain and its
// owner; nothing sold; near award typed, an idea on Noor's map; the product linked to it found, Clara's ----
scene("window",(ctx,S,t,sc)=>{const c=sc.cues,P=gk_once(sc,"P",()=>({on:wAt(sc,"ontos","Ontos"),runs:wAt(sc,"ontos","the platform team"),sh:c.shows-0.3,
    mk:wAt(sc,"shows","every product"),dom:wAt(sc,"shows","its domain"),own:wAt(sc,"shows","its owner"),sold:c.sold,ns:wAt(sc,"sold","nothing is sold"),ty:c.types,
    idea:wAt(sc,"types","an idea"),fd:c.finds-0.3,lk:wAt(sc,"finds","linked to it"),lna:wAt(sc,"finds","Learners near an award")}));
  gv_shots(ctx,S,t,sc.dur,gk_run([
    // the platform team's room: Sam, and on his screens Ontos's marketplace beside Unity Catalog
    {at:0,place:"platform",keys:[[0,960,540,1]],push:0.025,draw:(x,tt)=>{gk_samDesk(x,tt,{u:clamp((tt-P.on)/1.6,0,1)});
      gk_plate(x,tt,P.runs,P.sh-0.3,1570,296,["Sam Okafor","platform team"]);}},
    // its marketplace on the big screen: every live product, its domain, its owner; a price tag, crossed out; near award typed
    {at:P.sh,place:"facBig",keys:[[P.sh,960,540,1]],push:0.02,draw:(x,tt)=>gk_market(x,tt,{u:[0,1,2,3,4,5].map(i=>fin(tt,P.mk+0.25*i,0.6)),dom:fin(tt,P.dom,0.8),
      own:fin(tt,P.own,0.8),price:gv_io(tt,P.sold+0.2,P.ty+0.2,0.5),cross:clamp((tt-P.ns)/0.8,0,1),q:clamp((tt-P.ty-0.3)/1.0,0,1)})},
    // the idea on Noor's map
    {at:P.idea-0.2,place:"mapClose",keys:[[P.idea-0.2,960,540,1]],push:0.02,draw:(x,tt)=>gk_mapIdea(x,tt,{a:fin(tt,P.idea,0.6),
      lit:fin(tt,P.idea+0.7,0.8)})},
    // the catalogue finds the product linked to it, owned by Clara, in Planning
    {at:P.fd,place:"facBig",keys:[[P.fd,960,540,1]],push:0.02,draw:(x,tt)=>gk_market(x,tt,{dom:1,own:1,q:1,idea:fin(tt,P.fd+0.3,0.6),thr:clamp((tt-P.lk)/1.2,0,1),
      find:fin(tt,P.lna,0.8)})}],sc.dur,1));});

// ---- 3 · Read before you ask: the product's page, its promise from the files in the project: what it's for, how it counts, when it's
// ready, where to ask; its contract, the two columns that can lead back to a learner; a purpose and an end date ----
scene("read",(ctx,S,t,sc)=>{const c=sc.cues,P=gk_once(sc,"P",()=>({fr:wAt(sc,"before","from the files"),f:c.for,cn:c.counts,rd:c.ready,wh:wAt(sc,"ready","where to ask"),
    ct:c.contract-0.3,tw:c.two,pp:wAt(sc,"purpose","a purpose")}));
  gv_shots(ctx,S,t,sc.dur,gk_run([
    // the product's page: each part of its promise lit as it's named
    {at:0,place:"facBig",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>gk_prodPage(x,tt,{from:fin(tt,P.fr,0.6),tag:fin(tt,P.fr+0.5,0.6),
      lit:[gv_io(tt,P.f,P.cn-0.2,0.4),gv_io(tt,P.cn,P.rd-0.2,0.4),gv_io(tt,P.rd,P.ct,0.4),gv_io(tt,P.wh,P.ct,0.4)]})},
    // its contract, column by column: the two that can lead back to a learner; a purpose, and an end date
    {at:P.ct,place:"facBig",keys:[[P.ct,960,540,1]],push:0.02,draw:(x,tt)=>gk_contractTab(x,tt,{two:fin(tt,P.tw,0.8),card:fin(tt,P.pp,0.8)})}],sc.dur,1));});

// ---- 4 · Ask, with a purpose: Request access on the product's page; the form's two questions; his reason; ninety days; on the
// platform, its button in preview sends him to the same form; every request in one place ----
scene("ask",(ctx,S,t,sc)=>{const c=sc.cues,P=gk_once(sc,"P",()=>({as:c.asks,why:wAt(sc,"form","why"),hl:wAt(sc,"form","for how long"),wr:wAt(sc,"writes","to plan"),
    nd:wAt(sc,"ninety","ninety days"),pl:c.platform-0.3,btn:wAt(sc,"platform","its request button"),pv:wAt(sc,"platform","in preview"),
    here:wAt(sc,"platform","brought him here"),one:c.one}));
  gv_shots(ctx,S,t,sc.dur,gk_run([
    // he asks, on the product's page: the form, why and for how long; his reason typed; ninety days; Submit
    {at:0,place:"facBig",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>gk_form(x,tt,{press:clamp((tt-P.as-0.3)/0.8,0,1),open:fin(tt,P.as+1.1,0.6),
      lit:[gv_io(tt,P.why,P.wr-0.2,0.4),gv_io(tt,P.hl,P.wr-0.2,0.4)],why:clamp((tt-P.wr)/3.4,0,1),days:fin(tt,P.nd,0.5),sub:clamp((tt-P.nd-0.9)/0.8,0,1)})},
    // the platform's own button, in preview, sends people to the catalogue's form; every request comes to one place
    {at:P.pl,place:"desk",keys:[[P.pl,960,540,1]],push:0.02,draw:(x,tt)=>gk_onePlace(x,tt,{plat:fin(tt,P.pl+0.4,0.6),press:clamp((tt-P.btn)/0.8,0,1),
      pv:fin(tt,P.pv,0.6),redir:clamp((tt-P.here)/1.2,0,1),tray:clamp((tt-P.one)/1.6,0,1)})}],sc.dur));});

// ---- 5 · The owner decides: the request comes to Clara, not to whoever built the table; governance's promise, five working days;
// her answer by the afternoon; his reason is the product's purpose, so yes, ninety days, until the 31st of January; or fewer, or no,
// with a reason; the request, the record ----
scene("owner",(ctx,S,t,sc)=>{const c=sc.cues,P=gk_once(sc,"P",()=>({cl:c.clara,ow:wAt(sc,"clara","the product's owner"),nt:wAt(sc,"clara","not to whoever"),
    fv:c.five-0.3,fw:wAt(sc,"five","five working days"),af:c.afternoon-0.3,an:c.afternoon,rs:c.reason-0.3,wf:wAt(sc,"reason","what the product is for"),
    so:wAt(sc,"reason","so she says"),yes:wAt(sc,"reason","says yes"),d31:wAt(sc,"reason","thirty-first"),fe:c.fewer,rc:c.record-0.3,
    rows:["who asked","why","who said yes","until when"].map(w=>wAt(sc,"record",w))}));
  gv_shots(ctx,S,t,sc.dur,gk_run([
    // Planning's office: who builds the table, and who owns it; the request passes the first and comes to the second
    {at:0,place:"planClose",keys:[[0,960,540,1]],push:0.025,draw:(x,tt)=>{gk_planDesk(x,tt,{draw:q=>gk_reqScreen(q,tt,{})});
      gk_route(x,tt,{who:clamp((tt-P.cl-0.2)/1.2,0,1),go:clamp((tt-P.ow)/1.8,0,1),tag:fin(tt,P.nt+0.6,0.6)});}},
    // what you can ask data governance for: let me see this data, in five working days
    {at:P.fv,place:"desk",keys:[[P.fv,960,540,1]],push:0.02,draw:(x,tt)=>gk_service(x,tt,{lit:fin(tt,P.fw,0.8),tag:fin(tt,P.fv+0.8,0.6)})},
    // she answers by the afternoon: his reason, lit; the clock on her wall
    {at:P.af,place:"planClose",keys:[[P.af,960,540,1]],push:0.025,draw:(x,tt)=>{gk_planDesk(x,tt,{clara:{expr:"smile"},
      draw:q=>gk_reqScreen(q,tt,{why:fin(tt,P.an+0.4,0.6)})});gk_clock(x,1800,150,74,fin(tt,P.an,0.6));}},
    // her page: his reason beside the product's purpose; ninety days granted; Approve; the key, until the 31st; Reject, with a reason
    {at:P.rs,place:"bigPlan",keys:[[P.rs,960,540,1]],push:0.02,draw:(x,tt)=>gk_approval(x,tt,{match:clamp((tt-P.wf)/1.0,0,1),grant:clamp((tt-P.so)/0.8,0,1),
      yes:clamp((tt-P.yes-0.1)/0.8,0,1),date:fin(tt,P.d31,0.6),alt:gv_io(tt,P.fe,P.rc+0.2,0.5)})},
    // the request is the record: who asked, why, who said yes, until when
    {at:P.rc,place:"desk",keys:[[P.rc,960,540,1]],push:0.02,draw:(x,tt)=>gk_record(x,tt,{rows:P.rows.map(w=>fin(tt,w,0.5))})}],sc.dur));});

// ---- 6 · A key with a date: access to a group, never one person; Anil's card into the product's readers' drawer, in the
// university's directory, until his date, and the key; the group given the table once, when the product went live; a week before, the
// reminder; on the date, his card out and the key grey; Clara sees every reader ----
scene("key",(ctx,S,t,sc)=>{const c=sc.cues,P=gk_once(sc,"P",()=>({gr:wAt(sc,"group","a group"),nv:wAt(sc,"group","never"),op:wAt(sc,"group","one person"),
    rd:c.readers,pu:wAt(sc,"readers","puts Anil"),hd:wAt(sc,"readers","until his date"),on:c.once-0.3,gv:wAt(sc,"once","was given"),
    live:wAt(sc,"once","when the product went live"),wk:c.week-0.3,rem:wAt(sc,"week","reminds him"),dt:c.date-0.3,out:wAt(sc,"date","takes him out"),
    ends:wAt(sc,"date","his access ends"),ev:c.every-0.3,er:wAt(sc,"every","every reader")}));
  gv_shots(ctx,S,t,sc.dur,gk_run([
    // the university's directory: a drawer for each product's readers; never one person by name; Anil's card into the product's
    // drawer, until his date; the sync to the platform; his key
    {at:0,place:"index",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>gk_index(x,tt,{lit:[fin(tt,P.gr,0.6),0,0],one:gv_io(tt,P.nv,P.rd+0.6,0.4),
      x:clamp((tt-P.op)/0.6,0,1),card:clamp((tt-P.pu)/1.2,0,1),sync:clamp((tt-P.hd)/1.0,0,1),key:fin(tt,P.hd+0.6,0.6)})},
    // on the platform: the group was given the table once, when the product went live
    {at:P.on,place:"bigPlat",keys:[[P.on,960,540,1]],push:0.02,draw:(x,tt)=>gk_perms(x,tt,{lit:fin(tt,P.gv,0.6),note:clamp((tt-P.live)/1.0,0,1),tag:fin(tt,P.on+0.8,0.6)})},
    // a week before the date: the catalogue's reminder on Anil's screen, his key on the desk
    {at:P.wk,place:"faculty",keys:[[P.wk,960,540,1]],push:0.025,draw:(x,tt)=>gk_anil(x,tt,{draw:q=>{gk_reminder(q,tt,{u:clamp((tt-P.rem)/1.2,0,1)});
      gk_key(q,1130,836,0.1,"until 31 Jan 2027",{flat:1});}})},
    // on the date: the directory takes him out of the group, and his access ends
    {at:P.dt,place:"index",keys:[[P.dt,960,540,1]],push:0.02,draw:(x,tt)=>gk_index(x,tt,{card:1,out:clamp((tt-P.out)/1.4,0,1),sync:fin(tt,P.out+0.8,0.6),key:1,
      grey:clamp((tt-P.ends)/1.0,0,1)})},
    // Clara sees every reader, why, and until when
    {at:P.ev,place:"planClose",keys:[[P.ev,960,540,1]],push:0.025,draw:(x,tt)=>gk_planDesk(x,tt,{draw:q=>gk_readers(q,tt,{past:1,lit:fin(tt,P.er,0.6)})})}],sc.dur));
  wc_year(ctx,56,72,"24 January 2027",gv_io(t,P.wk+0.2,P.dt-0.2,0.4));wc_year(ctx,56,72,"31 January 2027",gv_io(t,P.dt+0.2,sc.dur-0.4,0.4));});

// ---- 7 · A known reader: the faculty's plan written into the record of who uses what; the next change to Clara's table, and the
// impact check naming the faculty beside the census dashboard; both told before it ships ----
scene("reader",(ctx,S,t,sc)=>{const c=sc.cues,P=gk_once(sc,"P",()=>({ad:c.adds,wu:wAt(sc,"adds","who uses what"),ip:wAt(sc,"adds","in the project"),nx:c.next-0.3,
    nm:wAt(sc,"next","names the Faculty"),cd:wAt(sc,"next","census dashboard"),bo:c.both-0.3,bt:c.both}));
  gv_shots(ctx,S,t,sc.dur,gk_run([
    // the record of who uses what: the faculty's plan, a new file in the project
    {at:0,place:"desk",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>gk_exposure(x,tt,{u:fin(tt,0.2,0.8),p:clamp((tt-P.ad-0.2)/3.6,0,1),
      lit:[fin(tt,P.ad+3.2,0.6),fin(tt,Math.max(P.wu,P.ad+4.0),0.6)],hand:fin(tt,P.ip,0.8),tag:fin(tt,P.ip+0.6,0.6)})},
    // the next change to Clara's table: the impact check names the faculty's plan beside the census dashboard, and who to ask
    {at:P.nx,place:"big",keys:[[P.nx,960,540,1]],push:0.02,draw:(x,tt)=>gk_impact(x,tt,{u:clamp((tt-P.nx-0.2)/1.2,0,1),who:fin(tt,P.nm,0.6),ask:fin(tt,P.cd+0.4,0.6)})},
    // both asked before the change ships: a letter to each
    {at:P.bo,place:"campus",keys:[[P.bo,960,540,1]],push:0.02,draw:(x,tt)=>gk_tell(x,tt,{go:clamp((tt-P.bt)/2.2,0,1)})}],sc.dur,1));});

// ---- 8 · Outside the university: a partner far off; its request for Mei's Awards; each award, its credit points and its faculty, no
// one's personal data; Mei's yes; Sam shares it through OpenSharing; the partner reads the table where it lives, not a copy, with a key
// that ends and the same contract; a private exchange, a shop window only partners see ----
scene("outside",(ctx,S,t,sc)=>{const c=sc.cues,P=gk_once(sc,"P",()=>({sm:c.same,pt:c.partner-0.3,ho:c.holds-0.3,aw:wAt(sc,"holds","each award"),
    cp:wAt(sc,"holds","its credit points"),fc:wAt(sc,"holds","its faculty"),no:wAt(sc,"holds","no one's personal data"),my0:sc.ends.holds+0.3,my:wAt(sc,"share","says yes"),
    sam:wAt(sc,"share","Sam shares"),org:wAt(sc,"share","another organisation"),any:wAt(sc,"share","on any platform"),itself:wAt(sc,"reads","the table itself"),
    nc:wAt(sc,"reads","not a copy"),ky:wAt(sc,"reads","a key"),con:wAt(sc,"reads","the same contract"),ex:c.exchange-0.3,fi:wAt(sc,"exchange","find it"),
    pe:wAt(sc,"exchange","a private exchange"),only:wAt(sc,"exchange","only they see")}));
  gv_shots(ctx,S,t,sc.dur,gk_run([
    // the campus, and far off, a partner university
    {at:0,place:"campus",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>gk_far(x,tt,{far:fin(tt,0.4,1.0),thr:clamp((tt-P.sm-0.4)/1.4,0,1)})},
    // the registrar's office: Mei, and on her screen the partner's request for Awards
    {at:P.pt,place:"registrar",keys:[[P.pt,960,540,1]],push:0.025,draw:(x,tt)=>{gk_mei(x,tt,{draw:q=>gk_meiScreen(q,tt,{})});
      gu_nameCard(x,1140,190,"Mei Tanaka","registrar's office",gv_io(tt,P.pt+0.5,P.ho-0.4,0.4));}},
    // Awards' contract: each award, its credit points and its faculty; no one's personal data
    {at:P.ho,place:"bigReg",keys:[[P.ho,960,540,1]],push:0.02,draw:(x,tt)=>gk_awards(x,tt,{lit:[fin(tt,P.aw,0.5),fin(tt,P.cp,0.5),fin(tt,P.fc,0.5)],
      none:clamp((tt-P.no)/1.0,0,1)})},
    // Mei says yes
    {at:P.my0,place:"registrar",keys:[[P.my0,960,540,1]],push:0.025,draw:(x,tt)=>gk_mei(x,tt,{mei:{expr:tt>P.my?"smile":"calm"},
      draw:q=>gk_meiScreen(q,tt,{yes:clamp((tt-P.my)/0.8,0,1)})})},
    // Sam shares it through OpenSharing, to a partner university, on any platform
    {at:P.sam-0.2,place:"bigPlat",keys:[[P.sam-0.2,960,540,1]],push:0.02,draw:(x,tt)=>{gk_share(x,tt,{rec:fin(tt,P.org,0.8)});
      gk_plate(x,tt,P.sam+0.2,null,1480,196,["Sam Okafor","platform team"]);}},
    // the partner reads the table where it lives: not a copy; a key that ends; the same contract
    {at:P.any-0.3,place:"desk",keys:[[P.any-0.3,960,540,1]],push:0.02,draw:(x,tt)=>gk_reads(x,tt,{read:clamp((tt-P.any)/1.0,0,1),thr:clamp((tt-P.itself)/1.0,0,1),
      copy:clamp((tt-P.nc)/0.8,0,1),x:clamp((tt-P.nc-0.6)/0.6,0,1),key:fin(tt,P.ky,0.6),con:clamp((tt-P.con)/0.9,0,1)})},
    // partners on Databricks: a private exchange, a shop window only they see
    {at:P.ex,place:"exchange",keys:[[P.ex,960,540,1]],push:0.02,draw:(x,tt)=>gk_exchange(x,tt,{u:fin(tt,P.fi,0.8),sign:fin(tt,P.pe,0.6),
      only:clamp((tt-P.only)/1.4,0,1)})}],sc.dur));});

// ---- 9 · Part of governance: this morning, asked and answered; a place for each learner; the old copy gone, and the key with its
// date; Clara knows who reads her table; the shop window; the series' six cards; the end card ----
scene("close",(ctx,S,t,sc)=>{const c=sc.cues,P=gk_once(sc,"P",()=>({of:c.offers-0.3,gn:c.gone-0.3,d31:wAt(sc,"gone","thirty-first"),sn:c.seen-0.3,
    wr:wAt(sc,"seen","who reads"),ls:c.last-0.3,board:c.breath-0.3,end:c.breath+1.6}));
  gv_shots(ctx,S,t,sc.dur,gk_run([
    // this morning: Anil's request, approved, until its date
    {at:0,place:"faculty",keys:[[0,960,540,1]],push:0.025,draw:(x,tt)=>gk_anil(x,tt,{anil:{expr:"smile"},draw:q=>gk_today(q,tt,{})})},
    // a place for each learner a unit from finishing
    {at:P.of,place:"desk",keys:[[P.of,960,540,1]],push:0.02,draw:(x,tt)=>gk_placement(x,tt,{n:2,back:0})},
    // the copy gone; the key on his desk, until the 31st of January
    {at:P.gn,place:"faculty",keys:[[P.gn,960,540,1]],push:0.025,draw:(x,tt)=>gk_anil(x,tt,{anil:{expr:"smile"},draw:q=>{gk_today(q,tt,{mail:1});
      gk_key(q,1130,836,0.1,"until 31 Jan 2027",{flat:1,lit:fin(tt,P.d31,0.6)});}})},
    // Clara knows who reads her table, why, and until when
    {at:P.sn,place:"planClose",keys:[[P.sn,960,540,1]],push:0.025,draw:(x,tt)=>gk_planDesk(x,tt,{clara:{expr:"smile"},draw:q=>gk_readers(q,tt,{lit:fin(tt,P.wr,0.6)})})},
    // finding and getting data: the shop window, every product with its owner
    {at:P.ls,place:"shop",keys:[[P.ls,960,540,1]],push:0.02,draw:(x,tt)=>gk_shop(x,tt,{own:1})},
    // the data team's board: the series' six cards, each lit in turn
    {at:P.board,place:"board",keys:[[P.board,960,470,1]],push:0.02,draw:(x,tt)=>{if(tt<P.end+0.8)gu_board(x,{lit:[0,1,2,3,4,5].map(i=>fin(tt,P.board+0.3+0.3*i,0.6))});}}],
    sc.dur));
  wc_year(ctx,56,72,"Today",gv_io(t,0.3,P.sn-0.2,0.4));
  gv_end(ctx,S,t,P.end,"The marketplace","Finding and getting data is part of governance.","Film 6 of 6");});
