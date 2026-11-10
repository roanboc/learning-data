/* ===== From a branch to production: the chapters =====
   Each chapter is a few shots (ag_shots). In one room the camera glides from framing to framing and only what changes fades; between
   rooms a shot cuts where both show the same people or words, and dissolves where the whole picture changes. Times inside a chapter
   come from its cues and the words of its lines (wAt), so the pictures stay with the voice if it's recorded again. Words on screen are
   on cards, slips, pills, tags and pages, at least 28 px as seen, and above the captions. */

DP_PEOPLE.push("sam","jun","noor","mei");
const BP_FILM="From a branch to production";
// the kicker, its top line held while each title comes and goes in turn: titles [[text, from, to], ...]
function bp_kickers(ctx,S,t,top,titles,o){o=o||{};const t0=titles[0][1],t1=titles[titles.length-1][2],a=bp_io(t,t0,t1,0.6);if(a<=0)return;setScreen(ctx,S);
  dp_kicker(ctx,top,"",{a});for(const [s,f,u] of titles){const b=ag_io(t,f,u,0.45);if(b>0)dp_T(ctx,s,72,172,{w:700,size:46,a:b});}}
// the opening's lessons, small at the top right of the frame (in the frame's own space, so they hold still while the camera glides)
function bp_lessonsAt(ctx,S,t,o){setScreen(ctx,S);bp_lessons(ctx,Object.assign({u:1},o));}
// a person in the hall, at the left of the track, facing it; on a page shot, at the right of the page, facing it
// (a person fades as one picture: drawn whole, then laid on at that opacity)
function bp_left(x,who,t,a,o){if(!(a>0))return;x.save();x.globalAlpha*=a;dp_person(x,who,220,662,0.86,Object.assign({t},o||{}));x.restore();}
function bp_right(x,who,t,a,o){if(!(a>0))return;x.save();x.globalAlpha*=a;dp_person(x,who,1660,662,0.86,Object.assign({t,flip:true},o||{}));x.restore();}
// a university chapter's kicker: "The university" and the chapter's name, in at 0.3 s and out at t1, before its first page or card
function bp_kickU(ctx,S,t,title,t1){bp_kickers(ctx,S,t,"The university",[[title,0.3,t1==null?5.4:t1]]);}

// ---- 1 · Principles first: South Africa, 1993. The parties negotiating the end of apartheid must agree how a constitution will be
//          written; the smaller parties fear what a majority could write, the larger won't accept a text nobody elected; so the
//          principles come first, fixed, and the text will count only once a court that didn't write it certifies it ----
scene("principles",(ctx,S,t,sc)=>{const c=sc.cues,P=bp_once(sc,"P",()=>({
    fear:wAt(sc,"fear","rights a later"),courts:wAt(sc,"fear","courts"),nobody:wAt(sc,"elected","negotiators"),
    rights:wAt(sc,"first","rights for"),judges:wAt(sc,"first","judges"),temp:wAt(sc,"fixed","temporary"),fixedN:wAt(sc,"fixed","nobody may"),
    assemblyW:wAt(sc,"assembly","Constitutional Assembly"),which:wAt(sc,"court","which"),certifies:wAt(sc,"court","certifies")}));
  ag_shots(ctx,S,t,sc.dur,[
    // the negotiating table at night: chairs, papers, microphones; no one's face
    {at:0,place:"bpTable",keys:[[0,960,600,1.18],[0.4,960,560,1.06]],d:9,draw:(x,t)=>{}},
    // April 1994: at dawn, a queue up the road to the hall where the votes are cast
    {at:c.vote-0.4,place:"bpRoad",keys:[[c.vote-0.4,760,690,1.32],[c.vote,980,580,1.04]],d:6.5,draw:(x,t)=>{bp_voters(x,t-c.vote+40,{});}},
    // the parliament to come: its seats lit block by block, most in one shade; what the smaller parties fear, and what the larger won't accept
    {at:c.seats-0.3,place:"bpChamber",keys:[[c.seats-0.3,600,560,1.30],[c.fear+0.2,760,520,1.12]],d:2.4,draw:(x,t)=>{
      const lit=BP_PARTY.map((n,i)=>ag_in(t,c.seats+1.0+i*0.32,0.6)),dim=1-0.55*ag_in(t,c.change+0.4,1.2);
      const edge=ag_io(t,c.fear,c.elected,0.6),big=ag_io(t,c.elected,c.change+0.6,0.6);
      bp_seatsLit(x,{blocks:lit.map(v=>v*lerp(0.55,1,dim)),boost:[big,edge,edge,edge,edge,edge,edge]});
      const k1=ag_in(t,P.fear-0.2,0.5),k2=ag_in(t,P.courts-0.2,0.5),k3=ag_in(t,P.nobody-0.4,0.5);
      if(k1>0)dp_card(x,1010,236,480,{title:"Rights a later vote could take away"},{col:"coral",a:k1*dim,k:ag_spr(t,P.fear-0.2,0.6)});
      if(k2>0)dp_card(x,1010,400,480,{title:"Courts that answer to a party"},{col:"coral",a:k2*dim,k:ag_spr(t,P.courts-0.2,0.6)});
      if(k3>0)dp_card(x,1010,564,480,{title:"Written by negotiators nobody elected?"},{col:"coral",a:k3*dim,k:ag_spr(t,P.nobody-0.4,0.6)});}},
    // back at the table: the principles first, 34 of them, written into a temporary constitution that nobody may change
    {at:c.first-0.3,place:"bpTable",keys:[[c.first-0.3,960,520,1.0]],d:2.0,draw:(x,t)=>{
      const up=ag_spr(t,c.first+0.2,1.1),a=ag_in(t,c.first+0.1,0.6),ty=lerp(420,250,clamp(up,0,1.1));
      const sp=bp_tablet(x,680,ty,{a,lit:[ag_in(t,P.rights-0.2,0.5),ag_in(t,P.judges-0.2,0.5)]});
      if(sp){const r1=ag_in(t,P.rights-0.1,0.5),r2=ag_in(t,P.judges-0.1,0.5);
        if(r1>0)dp_tag(x,250,ty+40,"Rights for everyone","ink",{a:r1,to:sp[0],p:ag_in(t,P.rights,0.5)});
        if(r2>0)dp_tag(x,1300,ty+40,"Judges no party controls","ink",{a:r2,to:sp[1],p:ag_in(t,P.judges,0.5)});}
      const tg=ag_in(t,P.temp-0.2,0.5);if(tg>0)dp_slip(x,960,ty+452,"The interim Constitution · in force 27 April 1994","grey",{a:tg,ink:true,align:"center"});
      const nb=ag_in(t,P.fixedN-0.2,0.5);if(nb>0){x.save();x.globalAlpha*=nb;const pw=dp_tw(x,"Nobody may change them",{w:700,size:28})+36,gx=960-(pw+56)/2,by=ty+330;
        dp_lock(x,gx+18,by+29,34,"coral",0);dp_pill(x,gx+56,by+44,"Nobody may change them","coral",{size:28});x.restore();}}},
    // the Assembly will write the text; it counts only once the Court, which didn't write it, certifies it keeps every principle
    {at:c.assembly-0.3,place:"bpChamber",cut:true,keys:[[c.assembly-0.3,960,540,1.0]],d:2.0,draw:(x,t)=>{
      const all=ag_in(t,c.assembly+0.2,1.4);bp_seatsLit(x,{blocks:BP_PARTY.map(()=>0.6),all});
      bp_tablet(x,680,70,{a:1});
      const la=ag_in(t,P.assemblyW-0.3,0.5);if(la>0)dp_slip(x,560,792,"The Constitutional Assembly · 490 members","grey",{a:la,ink:true,align:"center"});
      const ba=ag_in(t,c.court-0.2,0.6);if(ba>0){bp_book(x,430,330,{a:ba});}
      const ca=ag_in(t,P.which-0.4,0.6);bp_benchLit(x,ca);if(ca>0)dp_slip(x,1560,700,"The Constitutional Court","grey",{a:ca,ink:true,align:"center"});
      const pa=ag_in(t,P.certifies-0.2,1.6);if(pa>0)bp_poly(x,[[700,520],[1000,560],[1290,520]],pa,"cyan",{dash:[12,10],alpha:0.8});}}],0.6);
  bp_kickers(ctx,S,t,"Opening story",[["South Africa, 1993",0.6,c.vote-0.7],["April 1994",c.vote,c.seats-0.6],["South Africa, 1993",c.seats,c.assembly-0.6],["South Africa, 1994",c.assembly,sc.dur+5]]);});

// ---- 2 · Sent back: adopted in May 1996; on 6 September the Court declines to certify it, on nine points; five weeks later the
//          Assembly has fixed all nine; certified on 4 December, signed on 10 December, in force from 4 February 1997; every side
//          could trust it, because no side could put it into force alone; the title ----
scene("sent",(ctx,S,t,sc)=>{const c=sc.cues,P=bp_once(sc,"P",()=>({
    members:wAt(sc,"adopts","members"),agree:wAt(sc,"declines","all agreeing"),decl:wAt(sc,"declines","decline"),
    fixes:wAt(sc,"weeks","fixes"),amended:wAt(sc,"weeks","amended"),cert:wAt(sc,"certifies","certifies"),
    signs:wAt(sc,"signs","signs"),force:wAt(sc,"signs","comes into force"),
    judges:wAt(sc,"both","judges"),promises:wAt(sc,"both","promises"),counted:wAt(sc,"both","counted")}));
  // where the text is: at the Assembly, gliding to the bench, back to the Assembly, and to the bench again; each glide starts with
  // the camera's and moves as it does (its ease, over the shot's d), so the camera keeps the text in the frame all the way
  const AX=430,BX=1430,TY=330,go=t0=>easeCam(clamp((t-t0)/2.4,0,1));
  const bx=()=>{let x=AX;x=lerp(x,BX,go(P.members+0.6));x=lerp(x,AX,go(c.weeks+0.2));x=lerp(x,BX,go(P.amended+0.6));return x;};
  const marks=()=>{const on=ag_in(t,c.nine+0.2,0.4);return Array.from({length:9},(_,i)=>{const g=clamp((t-(P.fixes+0.3+i*0.42))/0.5,0,1);return on>0?(g>0?g:-on):0;});};
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"bpChamber",keys:[[0,960,540,1.0],[0.5,640,500,1.18],[P.members+0.6,1300,470,1.28],[c.weeks+0.2,700,470,1.22],[P.amended+0.6,1240,470,1.24]],d:2.4,draw:(x,t)=>{
      bp_seatsLit(x,{blocks:BP_PARTY.map(()=>0.6),all:1-0.4*ag_in(t,P.members+0.4,1.0)+0.4*ag_in(t,c.weeks+0.2,0.8)-0.4*ag_in(t,P.amended+0.6,1.0)});
      bp_benchLit(x,1);bp_tablet(x,680,70,{a:1-ag_in(t,0.3,0.8)});
      const X=bx();bp_book(x,X,TY,{marks:marks(),glow:ag_in(t,P.cert,1.2)*(1-ag_in(t,P.cert+1.4,0.8))});
      const ad=ag_io(t,0.9,P.members+1.4,0.5);if(ad>0)dp_card(x,700,230,520,{kick:"Adopted · 8 May 1996",title:"86% of members"},{col:"grey",a:ad,k:ag_spr(t,0.9,0.6)});
      const nc=ag_io(t,P.decl,c.weeks+0.2,0.4);if(nc>0)bp_stamp(x,BX+130,TY+250,"Not certified · 6 September 1996","coral",{a:nc,k:ag_spr(t,P.decl,0.5)});
      const ag=ag_io(t,P.agree-0.2,c.nine+1.6,0.5);if(ag>0)dp_slip(x,BX-30,TY-112,"All the judges agreeing","grey",{a:ag,ink:true});
      const r1=ag_io(t,c.rights,c.weeks,0.5),r2=ag_io(t,c.officials,c.weeks,0.5);
      if(r1>0)dp_card(x,BX-560,TY+10,500,{title:"Rights changed too easily"},{col:"coral",a:r1,k:ag_spr(t,c.rights,0.6)});
      if(r2>0)dp_card(x,BX-560,TY+160,500,{title:"The officials who check the government, not protected enough"},{col:"coral",a:r2,k:ag_spr(t,c.officials,0.6)});
      const am=ag_io(t,P.amended-0.2,c.certifies,0.5);if(am>0)dp_card(x,AX+300,TY-150,440,{kick:"Amended text",title:"11 October 1996"},{col:"grey",a:am,k:ag_spr(t,P.amended-0.2,0.6)});
      const ce=ag_in(t,P.cert,0.4);if(ce>0)bp_stamp(x,BX+130,TY+250,"Certified · 4 December 1996","green",{a:ce,k:ag_spr(t,P.cert,0.5)});}},
    // signed, and in force: the text open at its last page, a pen, the seal; then closed, still the constitution today
    {at:c.signs-0.3,place:"bpSigning",cut:true,keys:[[c.signs-0.3,960,540,1.08],[c.still,960,560,1.0]],d:4,draw:(x,t)=>{
      bp_openBook(x,960,540,{close:clamp((t-c.still-0.2)/1.4,0,1)});bp_pen(x,1430,700,1-ag_in(t,c.still,0.8));bp_goldSeal(x,1470,420,46,1);
      const s1=ag_in(t,P.signs-0.2,0.5),s2=ag_in(t,P.force-0.2,0.5);
      if(s1>0)dp_slip(x,560,120,"Signed · 10 December 1996","grey",{a:s1,ink:true});if(s2>0)dp_slip(x,1000,120,"In force · 4 February 1997","green",{a:s2,ink:true});}},
    // every side could trust it: the Assembly and the Court both lit, the text between them, and what that gave them
    {at:c.trust-0.3,place:"bpChamber",cut:true,keys:[[c.trust-0.3,960,500,1.0]],d:2.0,draw:(x,t)=>{
      bp_seatsLit(x,{blocks:BP_PARTY.map(()=>0.6),all:ag_in(t,c.trust+0.5,1.0)});bp_benchLit(x,ag_in(t,c.trust+0.9,1.0));
      bp_book(x,830,200,{glow:0});}},
    // a change to production can work the same way: the hall, and the three lessons with it
    {at:c.same-0.2,place:"bpHall",cut:true,keys:[[c.same-0.2,960,540,1.0]],d:2.0,draw:(x,t)=>{bp_hall(x,t,{rooms:ag_in(t,c.same+0.4,0.8)});}}],0.6);
  // the three lessons, in the frame's own space so they hold still across the cut into the hall
  const la=ag_in(t,P.judges-0.3,0.4)*(1-ag_in(t,c.breath-0.6,0.5));
  if(la>0){setScreen(ctx,S);bp_lessons(ctx,{a:la,u:0,each:[ag_in(t,P.promises-0.3,0.5),ag_in(t,P.judges-0.3,0.5),ag_in(t,P.counted-0.3,0.5)],lit:[1,1,1],behind:false});}
  bp_kickers(ctx,S,t,"Opening story",[["South Africa, 1994",-1,0.2],["South Africa, 1996",0.7,c.same-0.4]]);
  dp_title(ctx,S,t,c.breath,BP_FILM,"","FILM 8 OF 9 · LOCKS BEFORE THE DATA");});


// ---- 3 · No gate yet: the nightly job at two; its three rooms (Walls, doors and keys) and its own identity (Workloads without
//          secrets); but whatever reaches main goes straight to production, pushed by anyone, read by no one, or by whoever stole a
//          sign-in; production needs one way in, with a gate ----
scene("nogate",(ctx,S,t,sc)=>{const c=sc.cues,P=bp_once(sc,"P",()=>({
    loads:wAt(sc,"job","loads"),two:wAt(sc,"job","two"),dev:wAt(sc,"walls","development"),test:wAt(sc,"walls","test"),prod:wAt(sc,"walls","production"),
    noSecret:wAt(sc,"key","no secret"),own:wAt(sc,"key","own identity"),gh:wAt(sc,"main","GitHub"),straight:wAt(sc,"main","goes straight"),
    push:wAt(sc,"anyone","push"),nobody:wAt(sc,"anyone","nobody else"),stop:wAt(sc,"unread","stop"),send:wAt(sc,"unread","send"),
    stole:wAt(sc,"stole","stole"),way:wAt(sc,"gate","one way in")}));
  const out=1-ag_in(t,P.way-0.2,0.8);   // at "one way in", the team, their lines and the harm leave, and the track lays itself
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"bpHall",d:2.2,keys:[[0,960,540,1.0],[P.loads,1209,470,1.35],[c.walls+0.1,960,540,1.0],[c.key+0.2,1209,470,1.35],[c.guards-0.3,960,540,1.0]],draw:(x,t)=>{
    bp_hall(x,t,{rooms:1,glow:[ag_io(t,P.dev-0.2,P.dev+1.4,0.4),ag_io(t,P.test-0.2,P.test+1.4,0.4),ag_io(t,P.prod-0.2,P.prod+1.6,0.4)],
      doorLit:ag_in(t,P.loads,0.6),two:{a:ag_io(t,P.two-0.4,c.walls+0.1,0.5),text:"02:00"},
      recs:{a:1,flow:ag_in(t,P.loads+0.2,3.2),lit:1-0.6*ag_in(t,P.stop,0.8)*out},leak:ag_in(t,P.send+0.2,1.4)*out,
      repo:ag_in(t,P.gh-0.4,0.8)*out,mainLine:ag_in(t,P.straight-0.2,1.6)*out,
      team:{a:ag_in(t,c.anyone-0.2,0.6)*out,lines:ag_in(t,P.push-0.2,1.0),thief:ag_in(t,P.stole-0.2,0.6)},noGate:ag_in(t,P.nobody,0.5)*out,
      track:{a:ag_in(t,P.way-0.3,0.4),lay:ag_in(t,P.way,2.4)},main:ag_in(t,P.way+0.6,0.5),
      badge:{a:ag_io(t,P.own-0.5,c.guards+0.1,0.5),x:700,y:100,s:0.76}});
    const w=ag_io(t,c.walls+0.4,c.key-0.2,0.5);if(w>0)dp_tag(x,720,196,"From Walls, doors and keys","grey",{a:w});
    const ws=ag_io(t,c.key+0.3,c.guards+0.1,0.5);if(ws>0)dp_tag(x,700,500,"From Workloads without secrets","grey",{a:ws});
    const ns=ag_io(t,P.noSecret-0.2,c.guards+0.1,0.5);if(ns>0)dp_pill(x,720,462,"No secret stored","green",{size:28,a:ns});}}]);
  bp_kickU(ctx,S,t,"No gate yet");});

// ---- 4 · Rules first: Sam sets them before the next change is written, as South Africa fixed its principles; GitHub's ruleset on
//          main, nobody to bypass it; the code owners file, read from main, never from a pull request; the ruleset in Settings,
//          not in the code; back in the hall, the first gates stand on the track ----
scene("rules",(ctx,S,t,sc)=>{const c=sc.cues,P=bp_once(sc,"P",()=>({
    principles:wAt(sc,"sets","principles"),pr:wAt(sc,"ruleset","pull request"),rewrites:wAt(sc,"ruleset","rewrites"),deletes:wAt(sc,"ruleset","deletes"),
    owner:wAt(sc,"owner","code owner"),last:wAt(sc,"owner","last push"),nobody:wAt(sc,"bypass","nobody"),whoD:wAt(sc,"decides","Who decides"),
    platform:wAt(sc,"file","platform team"),gov:wAt(sc,"both","data governance"),fromMain:wAt(sc,"reads","from main"),notPR:wAt(sc,"reads","not from"),
    code:wAt(sc,"loosen","in the code")}));
  const back=Math.min(sc.ends.loosen+0.5,sc.dur-1.8),hall={rooms:1,doorLit:1,recs:{a:1,flow:1,lit:1},track:{a:1},main:1};
  ag_shots(ctx,S,t,sc.dur,[
    // Sam, at the left of the track, sets the rules before the next change is written
    {at:0,place:"bpHall",keys:[[0,960,540,1.0]],draw:(x,t)=>{bp_hall(x,t,hall);bp_left(x,"sam",t,ag_in(t,0.5,0.6));}},
    // GitHub's ruleset on main, each rule ticked as it's said; then the code owners file, read from main, never from a pull request
    {at:c.ruleset-0.3,place:"bpDesk",cut:true,keys:[[0,960,540,1.0]],draw:(x,t)=>{
      bp_ghRuleset(x,80,60,{a:1-ag_in(t,c.decides-0.2,0.5),ticks:[ag_in(t,P.pr,0.5),ag_in(t,P.rewrites,0.5),ag_in(t,P.deletes,0.5),ag_in(t,P.owner,0.5),ag_in(t,P.last,0.5),ag_in(t,c.checks+0.3,0.5)],bypass:ag_in(t,P.nobody,0.5)});
      bp_ghOwners(x,80,60,{a:ag_in(t,c.decides+0.5,0.5),lines:[ag_in(t,P.platform-0.2,0.5),ag_in(t,P.gov-0.2,0.5)],main:ag_in(t,P.fromMain,0.5)});
      const wd=ag_io(t,P.whoD-0.2,c.reads-0.2,0.5);if(wd>0)dp_tag(x,80,500,"From Who decides","grey",{a:wd});
      bp_ghOwnersCopy(x,80,520,{a:ag_in(t,P.notPR-0.2,0.6),not:ag_in(t,P.notPR+0.9,0.5)});
      const cd=ag_in(t,P.code-0.2,0.6);if(cd>0)dp_card(x,740,520,480,{kick:"In Settings",title:"main: every change through review",sub:"Not in the code"},{col:"cyan",a:cd,k:ag_spr(t,P.code-0.2,0.6)});
      bp_right(x,"sam",t,1);}},
    // back in the hall: the gates stand on the track, at main
    {at:back,place:"bpHall",cut:true,keys:[[0,960,540,1.0]],draw:(x,t)=>{const g0=[0,1,2].map(i=>back+0.3+i*0.35);
      bp_hall(x,t,Object.assign({},hall,{gates:bp_gates(t,{a:[...g0.map(g=>ag_in(t,g,0.25)),0],k:[...g0.map(g=>ag_spr(t,g,0.7)),1]})}));bp_left(x,"sam",t,1);}}]);
  bp_kickU(ctx,S,t,"Rules first");
  // the opening's first lesson, lit: the rules set before the change
  const la=ag_in(t,P.principles-0.2,0.5)*(1-ag_in(t,c.file,0.5));if(la>0)bp_lessonsAt(ctx,S,t,{a:la,lit:[ag_in(t,P.principles+0.4,0.5),0,0]});});

// ---- 5 · Sent back, fixed, checked again: Jun's change (set an unreadable row aside, load the rest), tried in his own copy in
//          development on made-up records; his pull request, its checks; Sam finds the line that logs names, Jun takes it out, Sam
//          approves the last push; merged ----
scene("review",(ctx,S,t,sc)=>{const c=sc.cues,P=bp_once(sc,"P",()=>({
    read:wAt(sc,"morning","couldn't read"),admin:wAt(sc,"switched","admin account"),asideW:wAt(sc,"aside","aside"),
    branchW:wAt(sc,"branch","branch"),dev:wAt(sc,"branch","development"),madeUp:wAt(sc,"branch","made-up records"),
    tests:wAt(sc,"run","tests"),scan:wAt(sc,"run","code scanning"),names:wAt(sc,"line","names and all"),
    out:wAt(sc,"again","takes it out"),pushes:wAt(sc,"again","pushes again"),approves:wAt(sc,"again","approves")}));
  const gates=bp_gates(t,{a:[1,1,1,0]});
  ag_shots(ctx,S,t,sc.dur,[
    // the hall: Jun at the left; the morning the load stopped on a row it couldn't read; now the job sets such a row aside
    {at:0,place:"bpHall",d:2.2,keys:[[0,960,540,1.0],[c.branch+0.3,800,600,1.2]],draw:(x,t)=>{const dv=ag_in(t,P.dev+0.2,0.6);
      // (the development and test rooms' names are under Jun's page, so they leave as it comes in; production's leaves as the camera
      // glides in, before the frame's edge cuts it; the tray's name comes once the row is in it)
      bp_hall(x,t,{rooms:[1-dv,1-dv,1-ag_in(t,c.branch+0.3,1.0)],doorLit:1,track:{a:1},main:1,gates,branch:ag_in(t,P.branchW-0.2,1.6),
        recs:{a:1,flow:1,lit:1,bad:[3,ag_in(t,P.read-0.2,0.5)],aside:[3,ag_in(t,P.asideW,1.1)]},tray:ag_in(t,P.asideW-0.5,0.5),trayName:ag_in(t,P.asideW+1.0,0.5)});
      bp_left(x,"sam",t,1-ag_in(t,0,0.5));bp_left(x,"jun",t,ag_in(t,0.7,0.6));
      const am=ag_io(t,P.admin-0.4,c.aside+0.2,0.5);if(am>0)dp_card(x,700,110,560,{kick:"Power you switch on",title:"Jun's admin account",sub:"Switched on to read last night's file"},{col:"amber",a:am,k:ag_spr(t,P.admin-0.4,0.6)});
      // in development: Jun's own copy of the job, its schedule paused, on made-up records
      if(dv>0){const b=bp_dbJob(x,380,180,830,250,{a:dv,where:"development",title:"[dev jun_park] registrar_nightly_load"});
        dp_pill(x,b.x,b.y+46,"Schedule paused","grey",{size:28,a:dv});
        const mu=ag_in(t,P.madeUp-0.2,0.5);if(mu>0)dp_tag(x,420,470,"Made-up records","green",{a:mu,to:[805,560]});}}},
    // his pull request: its checks; Sam's review of one line; changes requested, the line taken out, the last push approved; merged
    {at:c.opens-0.2,place:"bpDesk",keys:[[0,960,540,1.0]],draw:(x,t)=>{
      const b=bp_ghPR(x,80,60,{}),ca=ag_in(t,c.run,0.4);
      bp_check(x,b.x,b.y+70,"Tests",ag_in(t,P.tests+0.6,0.5),ca);bp_check(x,b.x,b.y+122,"CodeQL",ag_in(t,P.scan+0.9,0.5),ca);
      const la=ag_in(t,c.line-0.1,0.5)*(1-ag_in(t,P.out+0.8,0.5));
      if(la>0){dp_T(x,"registrar/src/load.py",b.x,b.y+186,{w:500,size:28,f:"mono",col:"mut",a:la});
        bp_code(x,b.x+20,b.y+244,'print(f"set aside: {row}")',{a:la,rim:"violet",rimA:ag_in(t,P.names-0.2,0.5),strike:ag_in(t,P.out,0.6)});}
      const nm=ag_io(t,P.names-0.2,P.out,0.5);if(nm>0)dp_slip(x,640,b.y+200,"Names and all","violet",{a:nm,ink:true});
      const lg=ag_io(t,c.log+0.3,P.out,0.5);if(lg>0)dp_card(x,700,b.y+6,460,{title:"A log keeps it 30 days",sub:"Outside the table's masks"},{col:"violet",a:lg,k:ag_spr(t,c.log+0.3,0.6)});
      const nc=ag_in(t,P.pushes,0.5);if(nc>0){x.save();x.globalAlpha*=nc;x.fillStyle=rgba(DP.F.cyan,1);x.beginPath();x.arc(b.x+20,b.y+300,9,0,TAU);x.fill();x.restore();
        dp_T(x,"1 new commit · the log line taken out",b.x+56,b.y+310,{w:600,size:28,a:nc});}
      const rq=ag_io(t,c.asks+0.3,P.approves-0.3,0.4);if(rq>0)dp_pill(x,b.x,b.y+380,"Changes requested · Sam Okafor","coral",{size:28,a:rq});
      const ok=ag_in(t,P.approves,0.5);if(ok>0){dp_tick(x,b.x+20,b.y+370,"green",ok);dp_T(x,"Approved · the last push · Sam Okafor",b.x+56,b.y+380,{w:700,size:28,a:ok});}
      const mb=ag_io(t,c.merges-0.8,c.merges+0.7,0.3);if(mb>0)bp_button(x,b.x,b.y+440,"Squash and merge","green",{a:mb,press:ag_in(t,c.merges+0.2,0.4)});
      const md=ag_in(t,c.merges+0.9,0.4);if(md>0)dp_pill(x,b.x,b.y+482,"Merged","green",{size:28,a:md});
      bp_right(x,"sam",t,ag_in(t,c.sam-0.1,0.6));}}]);
  bp_kickU(ctx,S,t,"Sent back, fixed, checked again");
  // the opening's second lesson, lit: checked by someone who didn't write it
  const la=ag_in(t,c.fixed-0.3,0.5)*(1-ag_in(t,c.merges-0.4,0.5));if(la>0)bp_lessonsAt(ctx,S,t,{a:la,lit:[1,ag_in(t,c.fixed+0.3,0.5),0]});});

// ---- 6 · The key fits one door: merging doesn't deploy; GitHub's machines inside the university's network, by the private path;
//          test first, as registrar-loader-test; production waits for Noor, who sees what changed and approves; Databricks lets in
//          only this repository's job in the environment production; the bundle deploys, the job runs as registrar-loader, people
//          only look; two people said yes, and a machine did the rest ----
scene("door",(ctx,S,t,sc)=>{const c=sc.cues,P=bp_once(sc,"P",()=>({
    prodW:wAt(sc,"merging","production"),machines:wAt(sc,"runner","machines"),inside:wAt(sc,"runner","inside"),
    privW:wAt(sc,"private","private path"),nsk:wAt(sc,"private","Network"),
    loaderT:wAt(sc,"signs","registrar loader test"),bundle:wAt(sc,"signs","bundle"),runsW:wAt(sc,"signs","runs the job"),
    noorW:wAt(sc,"waits","Noor Rahman"),cant:wAt(sc,"self","can't approve"),onlyMain:wAt(sc,"self","only main"),
    changed:wAt(sc,"noor","what changed"),reviewed:wAt(sc,"noor","who reviewed"),testRun:wAt(sc,"noor","test run"),approves:wAt(sc,"noor","approves"),
    letsIn:wAt(sc,"only","lets in only"),thisRepo:wAt(sc,"only","this repository's"),waited:wAt(sc,"only","waited"),
    prodMode:wAt(sc,"deploys","production mode"),never:wAt(sc,"look","never change"),two:wAt(sc,"machine","Two people"),machineW:wAt(sc,"machine","a machine")}));
  const gates=bp_gates(t,{a:[1,1,1,0]}),base={rooms:1,doorLit:1,recs:{a:1,flow:1,lit:1},main:1};
  ag_shots(ctx,S,t,sc.dur,[
    // merged into main, which doesn't open production; the runner, inside the university's network; the private path to the rooms
    {at:0,place:"bpHall",keys:[[0,960,540,1.0]],draw:(x,t)=>{
      bp_hall(x,t,Object.assign({},base,{track:{a:1},gates,branch:1,branchJoin:Math.max(1e-3,ag_in(t,0.4,1.4)),lock:{a:ag_in(t,P.prodW,0.5),lit:0},
        outline:ag_in(t,P.inside-0.2,0.8),runner:{a:ag_in(t,P.machines-0.2,0.4),u:ag_in(t,P.machines-0.2,1.4)},priv:ag_in(t,P.privW-0.1,1.8)}));
      const rt=ag_io(t,P.machines+0.6,c.private+0.4,0.5);if(rt>0)dp_tag(x,362,140,"Runner group · university-network","cyan",{a:rt,to:[425,520]});
      const nk=ag_io(t,P.nsk-0.2,c.test-0.4,0.5);if(nk>0)dp_tag(x,1100,140,"From Network, storage and keys","grey",{a:nk,to:[1300,214]});}},
    // GitHub's run: test first, as registrar-loader-test; production waits for a release approver; the box that asks Noor
    // (a cut, both ways: the run's jobs are named test and production, as the hall's rooms are, and a dissolve would show both)
    {at:c.test-0.2,place:"bpDesk",cut:true,keys:[[0,960,540,1.0]],draw:(x,t)=>{
      // the run leaves before the box that asks a release approver comes in, so the two pages' words never show at once
      const ro=ag_in(t,c.self-0.7,0.45);x.save();x.globalAlpha*=1-ro;
      const b=bp_ghRun(x,80,60,{}),tp=ag_in(t,c.passes,0.5),pw=ag_in(t,c.waits+0.2,0.4);
      bp_job(x,b.x,b.y+30,"test",{col:tp>0.5?"green":"grey",wait:ag_in(t,c.test+0.3,0.4)*(1-tp),spin:t*0.9,tick:tp});
      x.save();x.strokeStyle=rgba(DP.T.mut,0.6);x.lineWidth=2.4;x.beginPath();x.moveTo(b.x+360,b.y+105);x.lineTo(b.x+500,b.y+105);x.stroke();x.restore();
      bp_job(x,b.x+500,b.y+30,"production",{col:"grey",wait:pw,spin:t*0.9,sub:"Waiting for review",subA:pw});
      const lt=ag_in(t,P.loaderT-0.3,0.5);if(lt>0)dp_slip(x,b.x,b.y+220,"registrar-loader-test","cyan",{a:lt,ink:true});
      const bu=ag_in(t,P.bundle-0.2,0.5);if(bu>0)dp_card(x,b.x+500,b.y+210,520,{title:"Declarative Automation Bundle",sub:"The job and its settings, as files"},{col:"cyan",a:bu,k:ag_spr(t,P.bundle-0.2,0.6)});
      const rj=ag_in(t,P.runsW,0.5);if(rj>0)dp_T(x,"Ran once on test's records",b.x,b.y+340,{w:600,size:28,col:"mut",a:rj});x.restore();
      // the box that asks a release approver
      const rv=ag_in(t,c.self-0.25,0.5);if(rv>0){
        const r=bp_ghReview(x,120,100,{a:rv,k:ag_spr(t,c.self-0.25,0.6)});
        const p1=ag_in(t,P.cant-0.2,0.5),p2=ag_in(t,P.onlyMain-0.2,0.5),w1=dp_tw(x,"Prevent self-review",{w:700,size:28})+56;
        if(p1>0)dp_pill(x,r.x,r.y+40,"Prevent self-review","cyan",{size:28,a:p1*rv});if(p2>0)dp_pill(x,r.x+w1,r.y+40,"Deploys from main only","cyan",{size:28,a:p2*rv});
        [["Set unreadable rows aside",P.changed],["Approved by Sam Okafor",P.reviewed],["test · passed",P.testRun]].forEach(([s,w],i)=>{const u=ag_in(t,w-0.2,0.5);if(u<=0)return;
          dp_tick(x,r.x+20,r.y+110+i*50,"green",u);dp_T(x,s,r.x+56,r.y+120+i*50,{w:600,size:28,a:u*rv});});
        const bt=rv*(1-ag_in(t,P.approves+0.5,0.4));bp_button(x,r.x,r.y+300,"Reject",null,{a:bt});bp_button(x,r.x+170,r.y+300,"Approve and deploy","green",{a:bt,press:ag_in(t,P.approves,0.4)});
        const ok=ag_in(t,P.approves+0.8,0.5);if(ok>0){dp_tick(x,r.x+20,r.y+330,"green",ok);dp_T(x,"Approved · Noor Rahman",r.x+56,r.y+340,{w:700,size:30,a:ok*rv});}}
      bp_right(x,"noor",t,ag_in(t,P.noorW-0.2,0.6),{nod:0.07*Math.sin(Math.PI*clamp((t-P.approves)/0.9,0,1))});}},
    // the hall: the note for one sign-in fits production's lock; one from another branch stops short; the bundle deploys, the job
    // runs as registrar-loader, and people may only look
    {at:c.asks-0.3,place:"bpHall",cut:true,d:2.2,keys:[[c.asks-0.3,1209,570,1.35],[c.deploys-0.3,1209,590,1.35],[P.two-0.4,960,540,1.0]],draw:(x,t)=>{
      const nu=ag_sine(clamp((t-c.asks-0.2)/2.2,0,1)),inn=ag_in(t,c.deploys-0.4,0.8),ou=ag_sine(clamp((t-P.thisRepo)/1.6,0,1)),pg=ag_io(t,P.prodMode-0.4,P.two-0.4,0.6);
      // (production's name is under Databricks' page while it shows; main's, off the frame while the camera is close, comes in once
      // the camera has glided back far enough to show all of it)
      bp_hall(x,t,Object.assign({},base,{rooms:[1,1,1-pg],main:ag_in(t,P.two+0.3,0.8),outline:1,runner:{a:1,u:1},priv:0.35,track:{a:1,lit:[0,ag_in(t,P.machineW,1.6),1]},
        gates:bp_gates(t,{lit:[0,1,2,3].map(i=>ag_in(t,P.two+i*0.3,0.5))}),lock:{a:1,lit:ag_in(t,P.letsIn,0.6),open:ag_in(t,c.deploys-0.2,0.6)},
        note:{a:1-inn,x:lerp(640,1110,nu),y:524,sub:"Environment production"},
        other:{a:ag_in(t,P.thisRepo-0.2,0.5)*(1-ag_in(t,P.waited+0.4,0.6)),x:lerp(560,1120,ou),y:392,stop:ag_in(t,P.thisRepo+1.7,0.5)}}));
      if(pg>0){const b=bp_dbJob(x,1115,225,750,420,{a:pg,where:"production",title:"registrar_nightly_load"});
        dp_field(x,b.x,b.y+10,"Run as","registrar-loader",{mono:true,a:pg});dp_field(x,b.x+380,b.y+10,"Owner","registrar-loader",{mono:true,a:pg});
        const cv=ag_in(t,P.never-0.2,0.6);dp_T(x,"Platform team",b.x,b.y+170,{w:700,size:30,a:pg});dp_pill(x,b.x+250,b.y+170,"Can view",cv>0.5?"green":"grey",{size:28,a:pg});}}}]);
  bp_kickU(ctx,S,t,"The key fits one door",3.4);
  // the opening's third lesson, lit: in force only once both are done
  const la=ag_in(t,P.machineW-0.2,0.5);if(la>0)bp_lessonsAt(ctx,S,t,{a:la,lit:[1,1,ag_in(t,P.machineW+0.4,0.5)]});});

// ---- 7 · Someone else's code: two actions run beside the production key; a tag or a branch can be moved; code scanning flags the
//          one that isn't GitHub's own; Sam pins both to the commit he checked; Dependabot proposes each new version and each fix, as
//          a pull request reviewed like any other; the workflow's token only reads, and only the deploying jobs may ask to sign in ----
scene("supply",(ctx,S,t,sc)=>{const c=sc.cues,P=bp_once(sc,"P",()=>({
    nobodyU:wAt(sc,"miss","nobody at the university"),fetches:wAt(sc,"actions","fetches"),installs:wAt(sc,"actions","installs"),
    key:wAt(sc,"beside","production key"),moved:wAt(sc,"tag","moved"),flagsW:wAt(sc,"flags","flags"),samW:wAt(sc,"pins","Sam"),
    checked:wAt(sc,"pins","checked"),version:wAt(sc,"pins","version"),flaw:wAt(sc,"dependabot","known flaw"),reviewedW:wAt(sc,"dependabot","reviewed"),
    readW:wAt(sc,"token","only read"),jobs:wAt(sc,"token","two deploying jobs")}));
  const hall={rooms:1,doorLit:1,recs:{a:1,flow:1,lit:1},main:1,outline:1,runner:{a:1,u:1},priv:0.35,track:{a:1,lit:[0,1,1]},gates:bp_gates(t,{lit:[1,1,1,1]}),lock:{a:1,lit:1,open:1}};
  ag_shots(ctx,S,t,sc.dur,[
    // one way in is easy to miss: code from outside the university, running on the runner
    {at:0,place:"bpHall",keys:[[0,960,540,1.0]],draw:(x,t)=>{bp_hall(x,t,hall);
      const ou=ag_in(t,P.nobodyU-0.3,1.4);if(ou>0){bp_poly(x,[[0,575],[348,575]],ou,"grey",{dash:[10,9],alpha:0.9,lw:2.6});
        dp_slip(x,40,396,"Code nobody at the university wrote","grey",{a:ag_in(t,P.nobodyU,0.5),size:28,ink:true});}}},
    // the workflow on GitHub: two actions beside the production key; a tag that moves; CodeQL's flag; pinned to commits; then
    // Dependabot's pull requests; then what the workflow's token may do
    // (a cut: the page names the branch main, as the hall's track does)
    {at:c.actions-0.2,place:"bpDesk",cut:true,keys:[[0,960,540,1.0]],draw:(x,t)=>{
      const f1=1-ag_in(t,c.dependabot-0.2,0.5);
      if(f1>0){const b=bp_ghFile(x,80,60,".github/workflows/deploy.yml",{a:f1,h:700}),fl=ag_io(t,P.flagsW-0.2,c.pins-0.1,0.5),old=1-ag_in(t,c.pins+1.0,0.4),nw=ag_in(t,c.pins+1.4,0.5),gl=ag_io(t,c.commit,c.commit+1.6,0.5);
        const hi=(w)=>ag_in(t,w-0.2,0.5)*(1-fl);
        bp_file(x,b.x,b.y+30,["jobs:","  production:","    environment: production","    runs-on:","      group: university-network","    steps:",
          old>0?{t:"      - uses: actions/checkout@v7",rim:"cyan",rimA:hi(P.fetches),strike:ag_in(t,c.pins+0.4,0.5),a:old}:{t:"      - uses: actions/checkout@3d3c42e5…",rim:"green",rimA:gl,a:nw},
          old>0?{t:"      - uses: databricks/setup-cli@main",rim:fl>0.02?"coral":"cyan",rimA:fl>0.02?fl:hi(P.installs),strike:ag_in(t,c.pins+0.4,0.5),a:old}:{t:"      - uses: databricks/setup-cli@9625fdde…",rim:"green",rimA:gl,a:nw},
          "      - run: databricks bundle deploy -t production"],{a:f1});
        // the version each pin was checked at, written beside it
        const vc=ag_in(t,P.version-0.2,0.5)*nw*f1;if(vc>0&&old<=0){const w6=dp_tw(x,"      - uses: actions/checkout@3d3c42e5…",{w:500,size:28,f:"mono"}),w7=dp_tw(x,"      - uses: databricks/setup-cli@9625fdde…",{w:500,size:28,f:"mono"});
          dp_T(x,"# v7.0.1",b.x+w6+64,b.y+30+6*46,{w:500,size:28,f:"mono",col:"green",a:vc});dp_T(x,"# v1.23.0",b.x+w7+64,b.y+30+7*46,{w:500,size:28,f:"mono",col:"green",a:vc});}
        const pn=ag_in(t,P.checked+0.6,0.5)*f1;if(pn>0)dp_pill(x,800,214,"Pinned to a commit","green",{size:28,a:pn});
        if(fl>0)dp_slip(x,812,520,"CodeQL · Unpinned tag for a non-immutable Action","coral",{a:fl*f1,ink:true,size:28});
        const ky=ag_in(t,P.key-0.3,0.5)*f1;if(ky>0)dp_sealed(x,1260,140,580,"registrar-loader",{sub:"The production key",a:ky});
        // a tag is a name: it points at one commit today, and it can be moved to another
        const tg=ag_io(t,c.tag,c.flags-0.3,0.5)*f1;if(tg>0){x.save();x.globalAlpha*=tg;x.strokeStyle=rgba(DP.T.mut,0.7);x.lineWidth=2.4;x.beginPath();x.moveTo(1300,470);x.lineTo(1800,470);x.stroke();
          for(const cx of [1340,1560,1780]){x.fillStyle=rgba(DP.F.cyan,0.9);x.beginPath();x.arc(cx,470,12,0,TAU);x.fill();}
          const mv=clamp(ag_in(t,P.moved,1.0)-ag_in(t,P.moved+1.8,1.0),0,1);dp_pill(x,lerp(1340,1780,ag_sine(mv)),436,"v7","grey",{size:28,align:"center"});
          dp_T(x,"Commits",1300,540,{w:600,size:28,col:"mut"});x.restore();}}
      // Dependabot's pull requests: a new version of an action, and a fix for a known flaw in a library; each approved
      const pa=ag_in(t,c.dependabot+0.4,0.5)*(1-ag_in(t,c.token-0.3,0.5));
      if(pa>0){const b=dp_page(x,80,60,BP_PW,520,{tool:"github",name:"GitHub",where:"Pull requests",title:"Opened by Dependabot",a:pa});
        [["Bump databricks/setup-cli","dependabot · GitHub Actions",c.dependabot+0.5,"Approved · Jun Park"],["Bump a library with a known flaw","dependabot · Security update",P.flaw-0.3,"Approved · Sam Okafor"]].forEach(([ti,sub,w,ap],i)=>{
          const ra=ag_in(t,w,0.5)*pa;if(ra<=0)return;const ry=b.y+40+i*130;dp_T(x,ti,b.x,ry,{w:700,size:32,a:ra});dp_T(x,sub,b.x,ry+44,{w:600,size:28,col:"mut",a:ra});
          const ok=ag_in(t,P.reviewedW+i*0.4,0.5)*pa;if(ok>0){dp_tick(x,b.x+668,ry+12,"green",ok);dp_T(x,ap,b.x+704,ry+22,{w:700,size:28,a:ok});}});}
      // the workflow's own token reads; only the two deploying jobs may ask GitHub for a sign-in note
      const ta=ag_in(t,c.token+0.3,0.5);
      if(ta>0){const b=bp_ghFile(x,80,60,".github/workflows/deploy.yml",{a:ta,h:740}),rd=ag_in(t,P.readW-0.2,0.5),jb=ag_in(t,P.jobs-0.2,0.5);
        bp_file(x,b.x,b.y+30,[{t:"permissions:",rim:"green",rimA:rd},{t:"  contents: read",rim:"green",rimA:rd},"jobs:","  test:","    permissions:","      contents: read",
          {t:"      id-token: write",rim:"cyan",rimA:jb},"  production:","    permissions:","      contents: read",{t:"      id-token: write",rim:"cyan",rimA:ag_in(t,P.jobs+0.1,0.5)}],{lh:42,a:ta});}
      bp_right(x,"sam",t,ag_in(t,P.samW-0.1,0.6));}}]);
  bp_kickU(ctx,S,t,"Someone else's code");});

// ---- 8 · In force at two: the reviewed code runs at two; a week later a row is unreadable again: set aside, every other record in
//          by 02:15, fixed by the registrar's office by 09:30, and no power switched on; the three lessons; an emergency takes the
//          same path, faster, or an admin account switched on and recorded; an agent's change takes the same path; the end ----
scene("force",(ctx,S,t,sc)=>{const c=sc.cues,P=bp_once(sc,"P",()=>({
    reviewedC:wAt(sc,"two","reviewed code"),unread:wAt(sc,"week","unreadable"),setsAside:wAt(sc,"rest","sets it aside"),quarter:wAt(sc,"rest","quarter past two"),
    fixesW:wAt(sc,"office","fixes the row"),nine:wAt(sc,"office","half past nine"),power:wAt(sc,"office","switched on"),
    rules:wAt(sc,"africa","rules came first"),someone:wAt(sc,"africa","someone"),counted:wAt(sc,"africa","counted"),
    faster:wAt(sc,"emergency","faster"),adminW:wAt(sc,"emergency","admin account"),recorded:wAt(sc,"emergency","recorded"),
    agentW:wAt(sc,"agent","agent's change"),ecr:wAt(sc,"agent","Every change"),onlyW:wAt(sc,"path","only through")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"bpHall",d:2.2,keys:[[0,960,540,1.0],[c.two+0.4,1209,570,1.35],[c.office-0.4,960,540,1.0],[c.agent-0.3,760,600,1.15],[P.onlyW-0.3,960,540,1.0]],draw:(x,t)=>{
      const n2=t>=c.week+0.2,ra=n2?1:1-ag_in(t,c.week-0.3,0.5),fl=n2?ag_in(t,c.week+0.3,2.4):ag_in(t,P.reviewedC-0.3,2.6);
      const sl=ag_in(t,P.setsAside,1.1)-ag_in(t,P.fixesW+0.4,1.1),bad=n2?ag_in(t,P.unread-0.2,0.5)*(1-ag_in(t,P.fixesW+0.8,0.6)):0;
      const two=t<c.week+0.25?{a:ag_io(t,0.4,c.week-0.3,0.5),text:"Wednesday 11 November · 02:00",y:215}:{a:ag_io(t,c.week+0.3,c.office-0.3,0.5),text:"Wednesday 18 November · 02:00",y:215};
      // (main's name leaves as the camera glides in past it, and comes back as it glides out; the rooms' names leave under the end card)
      bp_hall(x,t,{rooms:1-ag_in(t,c.breath,0.6),doorLit:1,main:clamp(1-ag_in(t,c.two+0.4,1.2)+ag_in(t,c.office+0.4,0.8),0,1),track:{a:1,lit:[0,1,1]},gates:bp_gates(t,{lit:[1,1,1,1]}),lock:{a:1,lit:1,open:1},two,
        recs:{a:ra,flow:fl,lit:1,bad:[5,bad],aside:[5,clamp(sl,0,1)]},tray:ag_in(t,P.setsAside-0.5,0.5)*(1-ag_in(t,P.nine+0.6,0.6)),trayName:ag_in(t,P.setsAside+1.0,0.5)*(1-ag_in(t,P.fixesW+0.2,0.4)),
        pulse:{u:t<P.ecr?ag_in(t,P.faster-0.2,1.8):ag_in(t,P.ecr+0.6,3.4),a:ag_io(t,P.faster-0.2,P.faster+1.8,0.3)+ag_io(t,P.ecr+0.6,P.ecr+4.0,0.3)},
        agent:ag_in(t,P.agentW-0.2,0.6)});
      const ev=ag_io(t,P.quarter-0.3,c.office-0.4,0.5);if(ev>0)dp_card(x,620,200,660,{kick:"Wednesday 18 November",title:"Every other record in by 02:15"},{col:"green",a:ev,k:ag_spr(t,P.quarter-0.3,0.6)});
      const of=ag_io(t,P.nine-0.3,c.africa-0.4,0.5);if(of>0)dp_card(x,440,96,560,{kick:"The registrar's office",title:"Row fixed by 09:30"},{col:"green",a:of,k:ag_spr(t,P.nine-0.3,0.6)});
      const pw=ag_io(t,P.power-0.2,c.africa-0.4,0.5);if(pw>0)dp_switch(x,1300,140,0,{col:"amber",label:"No power switched on",a:pw});
      bp_left(x,"mei",t,ag_in(t,c.office+0.4,0.6)*(1-ag_in(t,c.agent-0.9,0.5)));
      const em=ag_io(t,P.adminW-0.3,c.agent-0.4,0.5);if(em>0){dp_card(x,440,110,620,{kick:"In an emergency",title:"An admin account",sub:"Switched on, approved and recorded"},{col:"amber",a:em,k:ag_spr(t,P.adminW-0.3,0.6)});
        dp_tag(x,1100,120,"From Power you switch on","grey",{a:em});dp_tag(x,1100,200,"From Who did what","grey",{a:em*ag_in(t,P.recorded-0.2,0.5)});}
      const ag=ag_io(t,P.ecr-0.2,P.onlyW-0.3,0.5);if(ag>0)dp_tag(x,120,300,"From Every change through review","grey",{a:ag,to:[330,632]});}}]);
  // the opening's three lessons, all lit, beside the track
  const la=ag_in(t,P.rules-0.4,0.4)*(1-ag_in(t,c.emergency-0.3,0.5));
  if(la>0){setScreen(ctx,S);bp_lessons(ctx,{a:la,u:0,by:96,each:[ag_in(t,P.rules-0.4,0.5),ag_in(t,P.someone-0.3,0.5),ag_in(t,P.counted-0.3,0.5)],lit:[1,1,1]});}
  bp_kickU(ctx,S,t,"In force at two");
  dp_end(ctx,S,t,c.breath,BP_FILM,"Production changes only through a reviewed path.","Film 8 of 9","Locks before the data");});

ag_cutInto(["sent","nogate","rules","review","supply","force"]);
