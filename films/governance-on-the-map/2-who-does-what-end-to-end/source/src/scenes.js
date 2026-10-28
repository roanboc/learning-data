/* ===== Who does what, end to end: the eight chapters =====
   Each chapter is a few shots in the places of plan.js, uni.js, map.js and the series' rooms.js, cut together with short dissolves
   (gv_shots). Times inside a chapter come from its cues (when each line starts) and the words of its lines (wAt), so the pictures stay with
   the voice if it's recorded again. Words on screen are on paper, cards, boards, tags and speech bubbles, at least 28 px as seen, and above
   the captions. */

// ---- 1 · Words that weren't in it: Madrid in 1892, Lima, Mexico City in 1951, the academies today; then the university ----
// the academy by night: its members at the table and Palma near its end (o.pose(id), o.stand(id)), the table over them, what's on it
// (o.on), then the night's veil over everything, so they all stand in the lamps' light; o.after draws over the veil (a name card, a tag)
const EE_NIGHT=[["eeHead",0],["eeM1",1],["eeM2",2],["eeM3",3],["eeM4",4],["eeM5",5],["eePalma",6]];
function ee_acadNight(x,tt,o){o=o||{};x.drawImage(ee_placeHi("acad"),0,0,W,H);ee_seated(x,tt,EE_NIGHT,{pose:o.pose,stand:o.stand});
  x.drawImage(ee_acadTable(false),0,0,W,H);ee_bigDict(x,330,694,1.3);if(o.on)o.on(x);
  x.save();x.globalCompositeOperation="multiply";x.drawImage(ee_nightVeil(),0,0,W,H);x.restore();if(o.after)o.after(x);}
// the academy by day (1956, and today): who sits where, and what's on the table
function ee_acadDay(x,tt,cast,o){o=o||{};x.drawImage(ee_placeHi("acadDay"),0,0,W,H);ee_seated(x,tt,cast,{pose:o.pose,stand:o.stand});
  x.drawImage(ee_acadTable(true),0,0,W,H);if(o.on)o.on(x);}
// Mexico City, 1951: five delegates, a card in front of each with their country; the chair at the end is empty
const EE_DELS=[["eeD1",0,"Peru"],["eeD2",1,"Mexico"],["eeD3",2,"Argentina"],["eeD4",3,"Colombia"],["eeD5",4,"Chile"]];
scene("words",(ctx,S,t,sc)=>{const c=sc.cues,P=ee_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{ricardo:w("palma","Ricardo"),joins:w("palma","joins"),dict:w("palma","the dictionary"),more:w("brings","more than"),asks:w("brings","and asks"),
      among:w("down","among"),budget:w("down","to budget"),words:w("wrong","so words"),wrongW:w("wrong","count as wrong"),use:w("millions","who use"),noway:w("millions","no way"),
      asking:w("later","asking"),became:w("later","what became"),assoc:w("y1951","form an association"),spain:w("y1951","Spain"),where:w("propose","from where"),
      approves:w("drafts","approves"),view:w("drafts","gives its view"),six:w("twenty","more than six"),free:w("twenty","free online"),lists:w("update","lists")};});
  const s1b=P.dict-0.4,s2=c.brings-0.3,s4=c.wrong-0.3,s4b=P.words-0.3,s5=c.millions-0.5,s6=P.noway-0.3,s7=c.later-0.3,s8=c.y1951-0.3,s9=P.spain+0.05,
    s10=c.today-0.3,s11=c.drafts-0.3,s12=P.approves-0.4,s13=P.view-0.4,s14=P.free-0.4,s15=c.update-0.3,s16=c.same-0.3;
  // Palma's slips: up the table one after another, then most of them back to his elbow; the last one back, he picks up
  const up0=P.more+0.9,dn0=c.down+0.15,pick=P.among-0.2,slipUp=i=>clamp((t-up0-i*0.42)/1.5,0,1),slipBack=i=>clamp((t-dn0-i*0.16)/0.9,0,1);
  gv_shots(ctx,S,t,sc.dur,[
    // the academy at night; Palma stands at his place near the table's end, his bundle of slips in his hands, and sits as he joins them
    {at:0,keys:[[0,960,540,1.0],[P.ricardo-0.2,1290,500,1.3]],d:2.4,push:0,draw:(x,tt)=>ee_acadNight(x,tt,{
      pose:id=>id==="eePalma"?{pose:"ee_bundle",carry:ee_heldBundle({open:0})}:id==="eeHead"?{pose:"listen",flip:false}:null,
      stand:id=>id==="eePalma"?1-clamp((tt-P.joins)/1.2,0,1):0,
      after:q=>ee_nameCard(q,1660,380,"Ricardo Palma","writer, from Lima",gv_io(tt,P.ricardo+0.1,s1b-0.1,0.4))})},
    // the head of the table: the director lays a hand on the thick dictionary
    {at:s1b,keys:[[s1b,440,590,1.85],[s1b+0.1,430,592,1.88]],d:3,push:0,draw:(x,tt)=>ee_acadNight(x,tt,{
      pose:id=>id==="eeHead"?{pose:"listen",pose2:"ee_hand",mix:clamp((tt-P.dict+0.2)/0.7,0,1),flip:false}:id==="eePalma"?{pose:"ee_bundle",carry:ee_heldBundle({open:0})}:null,
      on:q=>{if(tt>P.dict+0.35)ee_handOn(q,368,692,0.9,PEOPLE.eeHead.skin,EE_FROCK[0],0.1);}})},
    // Palma unties the bundle and passes the slips up the table; they go back down, most to a pile at his elbow; he holds one up to the lamp
    {at:s2,keys:[[s2,1450,560,1.7],[P.more+0.3,960,540,1.0],[c.down-0.3,1330,520,1.45]],d:2.4,push:0,draw:(x,tt)=>{const op=clamp((tt-c.brings-0.3)/0.8,0,1),hold=tt<up0-0.3,
      lamp=clamp((tt-pick)/0.7,0,1);
      ee_acadNight(x,tt,{pose:id=>{if(id==="eePalma")return hold?{pose:"ee_bundle",carry:ee_heldBundle({open:op})}:tt<pick?{pose:"listen"}:{pose:"listen",pose2:"ee_toLamp",mix:lamp,carry:lamp>0.45?ee_heldSlip:null,expr:"concerned"};
          if(id==="eeHead")return{pose:"listen",flip:false};return null;},
        on:q=>ee_slips(q,slipUp,slipBack,lamp>0.45),
        after:q=>{ee_tagAt(q,tt,P.more+0.6,c.down-0.6,760,446,"more than 300 words",{size:32});ee_tagAt(q,tt,P.budget,s4+0.3,1513,424,"to budget",Object.assign({size:32},EE_GOLDTAG));}});}},
    // Lima: a schoolroom, the pupil at his desk, the thick dictionary open beside his notebook, the teacher standing by
    {at:s4,keys:[[s4,960,560,1.06]],push:0.02,draw:(x,tt)=>ee_school(x,tt,{teacher:true})},
    // close: the teacher's pen strikes a word in red, and the pupil looks up
    {at:s4b,keys:[[s4b,800,640,1.6],[s4b+0.1,780,630,1.66]],d:4,push:0,draw:(x,tt)=>{const st=clamp((tt-P.wrongW-0.1)/0.7,0,1);
      ee_school(x,tt,{strike:st,look:tt>P.wrongW+0.6,pen:gv_io(tt,P.wrongW-0.7,s5-0.2,0.5)});}},
    // the millions who use the words, one after another: a shopkeeper doing his accounts, a clerk at a high desk, a market seller
    {at:s5,keys:[[s5,960,540,1.0]],push:0.02,draw:(x,tt)=>{ee_paper(x);[["shop",500,400,-0.03],["clerk",1000,520,0.025],["market",1430,390,-0.02]].forEach(([k,cx,cy,r],i)=>{const t0=s5+0.15+i*0.5;
      ee_vign(x,k,cx,cy,1.0,tt,clamp((tt-t0)/0.6,0,1),fin(tt,t0,0.35),{say:clamp((tt-t0-0.5)/0.5,0,1),sayDx:k==="market"?-60:40,rot:r});});}},
    // far away, down a corridor, the academy's tall door closes
    {at:s6,place:"hall",keys:[[s6,960,500,1.0]],push:0.04,draw:(x,tt)=>ee_door(x,clamp((tt-P.noway-0.2)/1.7,0,1))},
    // Lima, 1909: Palma, older, at his desk in the National Library, writes to a friend in Madrid; then seals the letter, and holds it
    {at:s7,keys:[[s7,960,560,1.0],[P.asking-0.3,960,600,1.3]],d:2.6,push:0,draw:(x,tt)=>{x.drawImage(gv_place("lib"),0,0,W,H);const sl=tt>=c.change-0.2,
      L=EE_LB;x.save();x.beginPath();x.rect(-W,-H,3*W,L.dk.bk+H);x.clip();
      person(x,"eePalmaOld",L.seat[0],L.dk.bk+GV_SIT*L.seat[1]*PEOPLE.eePalmaOld.build.h,L.seat[1],sl?{pose:"ee_bundle",t:tt,flip:false,carry:ee_heldLetter({seal:clamp((tt-c.change-0.4)/0.5,0,1)})}:
        {pose:"write",t:tt,flip:false,carry:ee_heldWriting(clamp((tt-s7-0.6)/6.5,0,1))});x.restore();x.drawImage(ee_libDesk(),0,0,W,H);
      ee_tagAt(x,tt,P.became,s8-0.3,1250,560,"to budget?",Object.assign({size:32},EE_GOLDTAG));}},
    // Mexico City, 1951: the academies of the Americas at one table; they stand as the line names them, and shake hands as they form the
    // association; the camera closes in on them
    {at:s8,place:"mex",keys:[[s8,960,560,1.06],[P.assoc-0.6,960,600,1.2]],d:2.2,push:0,draw:(x,tt)=>{const st=id=>clamp((tt-P.assoc+0.9-EE_DELS.findIndex(d=>d[0]===id)*0.12)/0.9,0,1),
        sh=clamp((tt-P.assoc-0.15)/0.5,0,1),bob=sh>0?Math.sin((tt-P.assoc-0.15)*7)*0.12:0;
      ee_seated(x,tt,EE_DELS.map(d=>[d[0],d[1]]),{T:EE_MX,stand:st,x:id=>{const i=EE_DELS.findIndex(d=>d[0]===id);return i<4?EE_MX.seats[i]+(i%2?-1:1)*30*sh:null;},
        pose:id=>{const i=EE_DELS.findIndex(d=>d[0]===id);if(sh<=0)return{pose:"listen",flip:i>=3};
          return i<4?{pose:"listen",pose2:"ee_shake",mix:clamp(sh+bob,0,1),flip:i%2===1,expr:"smile"}:{pose:"listen",pose2:"wave",mix:sh,flip:true,expr:"smile"};}});
      x.drawImage(ee_mexTable(),0,0,W,H);EE_DELS.forEach(([,i,n])=>ee_tent(x,EE_MX.seats[i],744,n,1));}},
    // Madrid, 1956: at a table like the first, a card for Spain is set down beside theirs
    {at:s9,keys:[[s9,1170,640,1.6]],push:0.02,draw:(x,tt)=>ee_acadDay(x,tt,[["eeD3",2],["eeD1",3],["eeD4",4],["eeD6",5],["eeD7",6]],{
      pose:id=>id==="eeD7"?{pose:"listen",expr:"smile"}:null,
      on:q=>{[[740,"Mexico"],[960,"Peru"],[1180,"Argentina"],[1400,"Chile"]].forEach(([X,n])=>ee_tent(q,X,744,n,1));ee_tent(q,1612,744,"Spain",clamp((tt-P.spain-0.2)/0.8,0,1),{drop:true});}})},
    // today: a member writes a word on a card at her desk in a city of the Americas, large in the middle; as the line says "from where they
    // live", her picture moves aside for a member in another city doing the same
    {at:s10,keys:[[s10,960,540,1.0]],push:0.02,draw:(x,tt)=>{ee_paper(x);const m=easeCam(clamp((tt-P.where+0.5)/1.2,0,1));
      ee_vign(x,"deskA",lerp(960,540,m),lerp(520,500,m),lerp(1.6,1.15,m),tt,clamp((tt-s10-0.1)/0.6,0,1),fin(tt,s10+0.1,0.35),{write:clamp((tt-c.today-0.3)/4.0,0,1)});
      ee_vign(x,"deskB",lerp(1560,1380,m),500,1.15,tt,clamp((tt-P.where+0.3)/0.6,0,1),fin(tt,P.where-0.3,0.35),{write:clamp((tt-P.where)/1.8,0,1)});}},
    // a commission at the academy's table reads the cards and drafts the change: two read the cards held at the chest, one explains, one
    // reads a card on the table
    {at:s11,keys:[[s11,620,560,1.5]],push:0.03,draw:(x,tt)=>ee_acadDay(x,tt,[["eeC1",0],["eeC2",1],["eeC3",2],["eeC4",3]],{
      pose:id=>id==="eeC2"?{pose:"listen",pose2:"ee_explain",mix:gv_io(tt,s11+0.6,c.drafts+3.2,0.6),expr:"smile",flip:false}:id==="eeC3"?{pose:"ee_down",flip:true}:
        {pose:"ee_read",carry:ee_heldCardLow,flip:id==="eeC4"},
      on:q=>{ee_slipAt(q,752,708,92,0.06,{col:[255,253,246]});ee_slipAt(q,640,714,80,-0.1,{col:[255,253,246]});}})},
    // the Spanish Academy approves it: a show of hands
    {at:s12,keys:[[s12,960,540,1.0]],push:0.02,draw:(x,tt)=>ee_acadDay(x,tt,[["eeC5",0],["eeC1",1],["eeC2",2],["eeC6",3],["eeC3",4],["eeC4",5],["eeC7",6]],{
      pose:id=>{const i=["eeC5","eeC1","eeC2","eeC6","eeC3","eeC4","eeC7"].indexOf(id),v=ease(clamp((tt-P.approves-0.1-((i*3)%7)*0.1)/0.8,0,1));
        return v<0.5?{pose:"listen",pose2:"ee_voteUp",mix:v*2}:{pose:"ee_voteUp",pose2:"ee_vote",mix:(v-0.5)*2};}})},
    // every other academy gives its view: the change goes out to twenty-two cards in a ring, and comes back ticked; then all twenty-three
    // light, and one dictionary is in the middle
    {at:s13,keys:[[s13,960,540,1.0]],push:0.02,draw:(x,tt)=>{ee_paper(x);const o0=s13+0.9,b0=o0+1.5;
      ee_ring(x,{card:i=>clamp((tt-s13-0.1-i*0.03)/0.5,0,1),out:i=>clamp((tt-o0-i*0.03)/0.9,0,1),back:i=>clamp((tt-b0-i*0.04)/0.9,0,1),tick:i=>clamp((tt-b0-0.9-i*0.04)/0.4,0,1),
        all:fin(tt,c.twenty,0.6),book:fin(tt,c.twenty+0.5,0.8)});}},
    // free online: someone at a bus stop looks up a word on a phone
    {at:s14,place:"bus",keys:[[s14,960,540,1.0]],push:0.03,draw:(x,tt)=>{person(x,"eeBus",1040,EE_BS.shelter[1]+EE_BS.shelter[3]-4,0.86,{pose:"phone",t:tt,flip:false});
      ee_phoneCard(x,1500,470,clamp((tt-s14-0.4)/0.7,0,1));ee_tagAt(x,tt,P.six,s15,1500,152,"more than 600 million people",{size:32});}},
    // each year's update: the list of what's new; the camera goes in to one line, "to budget", lit gold
    {at:s15,keys:[[s15,960,540,1.0],[c.isin-0.3,900,600,1.9]],d:1.8,push:0,draw:(x,tt)=>{ee_paper(x);ee_whatsNew(x,{hi:fin(tt,c.isin+0.2,0.6)});
      ee_tagAt(x,tt,P.lists-0.2,c.isin-0.9,1650,240,"this year's update",{size:32});ee_tagAt(x,tt,c.isin+0.5,null,1250,560,"to budget",Object.assign({size:30},EE_GOLDTAG));}},
    // the same with data: the university's floor, people at their desks behind the glass
    {at:s16,place:"floor",keys:[[s16,960,540,1.0]],push:0.03,draw:(x,tt)=>ee_floor(x,tt)}]);
  setScreen(ctx,S);ee_pill(ctx,t,[[0,"Madrid · 1892"],[s4,"Lima"],[s5,null],[s7,"Lima · 1909"],[s8,"Mexico City · 1951"],[s9,"Madrid · 1956"],[s10,"Today"],[s13,null],[s14,"Today"]],
    fin(t,0.4,0.5)*(1-fin(t,c.breath,0.4)));
  gv_title(ctx,S,t,c.breath+0.3,"Who does what, end to end","one request, followed","Film 2 of 3 · data governance");
  wc_paperOver(ctx,S);});
// the schoolroom in Lima: the pupil behind his desk (o.look: he looks up), the desk, the notebook (o.strike), the dictionary; the teacher
// standing at the desk's end with a hand on the dictionary (o.teacher), or only his hand and pen, in close (o.pen, 0 to 1)
function ee_school(x,tt,o){o=o||{};const S_=EE_SC,k=S_.pupil[1];x.drawImage(ee_placeHi("school"),0,0,W,H);
  x.save();x.beginPath();x.rect(-W,-H,3*W,S_.dk.bk+H);x.clip();person(x,"eePupil",S_.pupil[0],S_.dk.bk+GV_SIT*k*PEOPLE.eePupil.build.h,k,{pose:o.look?"ee_lookUp":"ee_down",t:tt,expr:o.look?"worried":"calm"});x.restore();
  x.drawImage(ee_schoolDesk(),0,0,W,H);ee_notebook(x,{strike:o.strike||0});ee_bigDict(x,1000,712,1.25);
  if(o.teacher)person(x,"eeTeacher",1280,S_.dk.ft-6,0.96,{pose:"ee_onBook",t:tt,flip:true});
  if((o.pen||0)>0.01){const st=clamp(o.strike||0,0,1),[nx,ny,nw,nh]=S_.note,sx=nx+nw/2+22-4+64*st,sy=ny+3*nh/6-3,k2=1-o.pen;
    ee_penHand(x,sx+k2*300,sy-k2*160,0.9,PEOPLE.eeTeacher.skin,PEOPLE.eeTeacher.top.c);}}
// ---- 2 · Three ways to count: Clara's report in January; each faculty counts a completion its own way; before, emails; now, a service ----
scene("three",(ctx,S,t,sc)=>{const c=sc.cues,P=ee_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{clara:w("compares","Clara"),fac:w("compares","faculty by"),nineW:w("nine","nine points"),less:w("nine","less likely"),nobody:w("email","nobody"),
      define:w("service","define"),ten:w("service","ten working"),asks:w("asks","asks")};});
  const rp=P.fac-0.7,em=c.email-0.3,sv=c.service-0.3,rq=P.ten+0.2;
  gv_shots(ctx,S,t,sc.dur,[
    // Planning's room: Clara with this year's report, the faculties' rates on the screen behind her
    {at:0,place:"planning",keys:[[0,800,520,1.22],[0.1,760,540,1.3]],d:4,draw:(x,tt)=>{ee_planScreen(x);person(x,"clara",500,905,0.8,{pose:"hold",carry:ee_heldReport,t:tt,flip:false});
      ee_nameCard(x,1000,720,"Clara Jensen","Planning",gv_io(tt,P.clara-0.1,rp-0.2,0.4));}},
    // her report, close: the three faculties' rates; the note of how each counts, as it's said; one learner's year across the desk, and
    // Health's row ringed: nine points lower
    {at:rp,place:"desk",keys:[[rp,960,540,1.0]],push:0.02,draw:(x,tt)=>{ee_report(x,{row:i=>clamp((tt-P.fac+0.1-i*0.35)/0.6,0,1),note:i=>fin(tt,[c.business,c.science,c.health][i]-0.1,0.45),
        ring:clamp((tt-P.less)/0.9,0,1)});
      ee_yearStrip(x,clamp((tt-c.nine+0.2)/0.9,0,1),{dot:i=>fin(tt,P.nineW-0.4+i*0.3,0.4),amber:fin(tt,P.less,0.4)});}},
    // before: the emails that went round, on the shelf, dusty; 23 replies, and no decision
    {at:em,place:"desk",keys:[[em,960,500,1.0],[em+0.1,960,520,1.06]],d:4,draw:(x,tt)=>ee_emails(x,fin(tt,P.nobody-0.2,0.5))},
    // now: the page pinned on her board, what you can ask data governance for; one line lights
    {at:sv,place:"boardPlan",keys:[[sv,960,500,1.0],[P.define-0.4,900,380,1.25]],d:1.8,push:0,draw:(x,tt)=>ee_servicePage(x,fin(tt,P.define,0.6))},
    // she asks: her request card, written as she says it; the date; and it goes
    {at:rq,place:"desk",keys:[[rq,960,520,1.0]],push:0.02,draw:(x,tt)=>ee_reqCard(x,960,460,{w:i=>clamp((tt-rq-0.3-i*0.8)/0.8,0,1),date:fin(tt,P.asks+0.2,0.4),go:clamp((tt-P.asks-1.0)/1.0,0,1)})}]);
  setScreen(ctx,S);ee_pill(ctx,t,[[0,"January"]],fin(t,0.3,0.5));
  wc_paperOver(ctx,S);});
// ---- 3 · A request, followed: over the floor; Mei's draft; the agent's check and its note; the registrar decides; once, on Noor's map,
// and every copy follows; the request's path through the rooms ----
// the request's flight on the floor, from Clara's hands, out past the glass and along, into Mei's
const EE_FLY=ee_smooth([[262,646],[322,700],[420,724],[548,700],[528,652]],10);
scene("request",(ctx,S,t,sc)=>{const c=sc.cues,P=ee_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{drafts:w("mei","drafts"),ex:w("mei","with an"),checks:w("agent","checks"),needs:w("agent","needs"),lists:w("agent","lists"),three:w("agent","three"),two:w("agent","two dash"),
      reg:w("owner","registrar"),decides:w("owner","decides"),once:w("once","once"),pub:w("once","publishes"),gloss:w("once","glossary"),
      dt:w("copies","data team"),dash:w("copies","the dashboards"),asst:w("copies","the assistant"),
      st:["Ask","draft","check","decide","publish","follow"].map(s=>w("steps",s))};});
  const s2=c.mei-0.3,s3=P.drafts+0.4,s4=c.agent-0.3,s6=c.owner-0.3,s7=c.once-0.3,s8=P.once+1.0,s9=c.steps-0.3,
    // the gold line on the map: to the glossary as it's named, then on to each copy as it's named
    gTo=i=>{const pts=ee_goldPath();let L=0,at=0;for(let k=1;k<pts.length;k++){L+=Math.hypot(pts[k][0]-pts[k-1][0],pts[k][1]-pts[k-1][1]);if(k===i)at=L;}return at/L;},
    gold=tt=>{const G=[[P.pub-0.1,0],[P.gloss,gTo(2)],[P.dt-0.7,gTo(2)],[P.dt,gTo(5)],[P.dash-0.5,gTo(5)],[P.dash,gTo(8)],[P.asst-0.5,gTo(8)],[P.asst,gTo(11)]];
      if(tt<=G[0][0])return 0;for(let k=1;k<G.length;k++)if(tt<G[k][0])return lerp(G[k-1][1],G[k][1],easeCam((tt-G[k-1][0])/(G[k][0]-G[k-1][0])));return 1;};
  gv_shots(ctx,S,t,sc.dur,[
    // the floor: Clara's request leaves her hands, small and bright, and goes along to Mei's room; Noor and Yusuf walk behind it
    {at:0,keys:[[0,768,560,1.25],[1.4,640,600,1.5]],d:5.2,draw:(x,tt)=>{x.drawImage(ee_placeHi("floor"),0,0,W,H);const fly=clamp((tt-1.0)/2.6,0,1),got=fly>=1,
        nw=gv_walk(tt,0.6,-120,676,230),yw=gv_walk(tt,0.8,-220,812,230);
      ee_floor(x,tt,{out:["yusuf"],names:1-fin(tt,1.3,1.2),pose:{clara:fly<=0?{pose:"hold",carry:ee_heldReq}:{pose:"hold",pose2:"stand",mix:clamp((tt-1.0)/0.6,0,1),carry:null},
        mei:got?{pose:"hold",carry:ee_heldReq}:{pose:"listen",carry:null}}});
      if(fly>0&&!got){const [fx,fy]=ee_along(EE_FLY,easeCam(fly));ee_flyCard(x,fx,fy,0.6,Math.sin(fly*Math.PI)*0.12,1);}
      gv_walker(x,"yusuf",yw,905,0.58,{t:tt});gv_walker(x,"noor",nw,905,0.58,Object.assign({t:tt,carry:heldNotebook},nw.moving?{}:{pose:"write"}));}},
    // Mei's desk: the request lands in her hands; she reads it, and turns to her screen, and starts the draft
    {at:s2,place:"regClose",keys:[[s2,900,520,1.0],[s2+0.1,860,540,1.06]],d:2.4,draw:(x,tt)=>{const turn=fin(tt,P.drafts-0.1,0.5);
      gv_behind(x,"mei",GV_RX.seat[0],GV_RX.top,GV_RX.seat[1],{pose:"hold",pose2:"ee_toScreen",mix:turn,carry:turn<0.5?ee_heldReq:null,t:tt});
      x.drawImage(gv_place("regDesk"),0,0,W,H);ee_onScreen(x,GV_RX.screen,q=>ee_draft(q,tt,{line:i=>clamp((tt-P.drafts-0.1-i*0.3)/0.5,0,1)}));
      ee_nameCard(x,900,640,"Mei Tanaka","steward, registrar's office",gv_io(tt,s2+0.3,s3-0.1,0.35));}},
    // her draft, close: the term, what it means, an example, its owner, its status
    {at:s3,place:"screenReg",keys:[[s3,925,440,1.04]],push:0.02,draw:(x,tt)=>ee_draft(x,tt,{line:i=>i===0?1:i===1?clamp((tt-s3+0.1)/0.9,0,1):i===2?clamp((tt-P.ex+0.1)/0.8,0,1):clamp((tt-P.ex-0.75-(i-3)*0.3)/0.35,0,1)})},
    // the data team's room: on a screen, the agent reads her draft row by row, and ticks what a term needs; then its note slides up:
    // the three reports and two dashboards the change touches
    {at:s4,place:"screenData",keys:[[s4,925,440,1.04]],push:0.02,draw:(x,tt)=>{const r0=P.checks+0.15,rd=(P.lists-0.5-r0)/4;
      ee_draft(x,tt,{agent:fin(tt,s4+0.25,0.5),read:(tt-r0)/rd,readA:gv_io(tt,r0-0.1,P.lists-0.45,0.3),tick:i=>fin(tt,r0+(i+1)*rd-0.1,0.35),
        note:clamp((tt-P.lists+0.3)/0.7,0,1),touch:i=>fin(tt,i<3?P.three-0.15+i*0.3:P.two-0.15+(i-3)*0.35,0.45)});}},
    // the registrar's office: she reads the draft and the agent's note, and decides; her decision, written in, dated and signed
    {at:s6,place:"registrar",keys:[[s6,1047,520,1.06],[s6+0.1,1047,510,1.1]],d:3.4,draw:(x,tt)=>{
      person(x,"ee_reg",930,905,0.82,{pose:"ee_read",carry:ee_heldDraft,t:tt,expr:tt>P.decides+0.4?"smile":"calm"});
      ee_nameCard(x,600,330,"the registrar","owner",gv_io(tt,P.reg-0.1,P.decides+0.2,0.35));
      ee_decision(x,fin(tt,P.decides-0.25,0.5),{w:i=>clamp((tt-P.decides-0.05-i*0.3)/0.45,0,1),date:fin(tt,P.decides+0.9,0.4),sign:clamp((tt-P.decides-1.1)/0.6,0,1)});}},
    // Noor's room: Mei pins the definition on the map, once, in the information band
    {at:s7,place:"noor",keys:[[s7,900,520,1.04]],push:0.015,draw:(x,tt)=>{const pin=fin(tt,P.once-0.1,0.5);
      ee_roomTerm(x,pin);person(x,"noor",1420,905,0.8,{pose:"hold",carry:heldNotebook,t:tt,flip:true});
      person(x,"mei",1090,905,0.8,{pose:"hold",pose2:"ee_pin",mix:pin,carry:pin<0.5?ee_heldReq:null,t:tt,flip:true});}},
    // the map, close: the map publishes the term to the glossary, a gold line from it; and on along it, every copy, each from the glossary
    {at:s8,place:"eeMap",keys:[[s8,960,600,1.08],[P.dt-1.6,815,650,1.35]],d:2.0,push:0,draw:(x,tt)=>ee_fadeCut(x,()=>ee_map(x,{term:1,
      app:i=>i===4?fin(tt,P.pub-0.45,0.5):fin(tt,P.gloss-0.55,0.5),glossLit:fin(tt,P.gloss,0.5),gold:gold(tt),copy:j=>fin(tt,[P.dt,P.dash,P.asst][j]-0.08,0.5),t:tt}))},
    // the floor again, the camera drawing back: the request's path through the rooms, a tag at each step as it's said
    {at:s9,keys:[[s9,540,560,1.45],[P.st[0]+0.1,960,540,1.0]],d:2.4,push:0,draw:(x,tt)=>{x.drawImage(ee_placeHi("floor"),0,0,W,H);
      ee_floor(x,tt,{out:[],pose:{clara:{pose:"reach"},mei:{pose:"hold",carry:heldNotebook}},
        extra:q=>{person(q,"ee_reg",690,806,0.5,{pose:"listen",t:tt,flip:true});person(q,"noor",890,806,0.5,{pose:"hold",carry:heldNotebook,t:tt});}});
      const T_=P.st,hop=[[T_[0]+0.02,T_[1]],[T_[1]+0.04,T_[2]],[T_[2]+0.05,T_[3]-0.02],[T_[2]+0.05,T_[3]],[T_[3]+0.04,T_[4]],[T_[4]+0.04,T_[5]-0.25],[T_[5]-0.25,T_[5]]];
      ee_thread(x,k=>clamp((tt-hop[k][0])/(hop[k][1]-hop[k][0]),0,1),s=>fin(tt,T_[["ask","draft","check","decide","publish","follow"].indexOf(s)]-0.05,0.4));}}]);
  setScreen(ctx,S);ee_pill(ctx,t,[[0,null],[s2,"13 January"],[s4,"14 January"],[s6,"21 January"],[s9,null]],1);
  wc_paperOver(ctx,S);});
// the definition, pinned on the map in Noor's room as the room's view sees it: a small gold card in the information band (pin, 0 to 1)
function ee_roomTerm(ctx,pin){if(pin<=0.01)return;const cx=968,cy=476,k=0.86+0.14*spring(clamp(pin,0,1));ctx.save();ctx.translate(cx,cy);ctx.scale(k,k);
  withA(ctx,clamp(pin*2,0,1),()=>{wc_panel(ctx,-85,-39,170,78,{kind:"card",wash:GV.gold,washA:0.5,seed:221});gv_pin(ctx,0,-30,GV.red,0.7);gv_lines(ctx,-56,-6,112,2,16,1);});ctx.restore();}
// ---- 4 · Roles, not people: on Noor's map, a role over each step and who fills it; the agent's rights; the academies' steps ----
// the whole map, every word on it above the captions; the agent's rights, close
const EE_MAPV=[922,527,1.14],EE_RIGHTSV=[812,360,1.5];
// the academy's table today: who sits where
const EE_TODAY=[["eeC5",0],["eeC1",1],["eeC2",2],["eeC6",3],["eeC3",4],["eeC4",5],["eeC7",6]];
// the steps the academies share with the service, in a row low in the frame that holds still while the people change behind it: each
// springs in (u(i)), and turns gold as its picture shows it (lit(i))
const EE_ACST=["ask","draft","decide"];
function ee_stepTags(ctx,u,lit){const sz=34,gap=80,ws=EE_ACST.map(s=>Math.round(tw(ctx,s,sz,700)+40)),tot=ws.reduce((p,q)=>p+q,0)+gap*(ws.length-1),y=846;let x=960-tot/2;
  EE_ACST.forEach((s,i)=>{const a=clamp(u(i),0,1),cx=x+ws[i]/2;
    if(i>0&&a>0.01)withA(ctx,a,()=>{ctx.save();ctx.lineCap="round";ctx.lineJoin="round";const ax=x-gap+14,bx=x-14;
      for(const [col,lw] of [[[40,36,30],8],[[255,250,236],4]]){ctx.strokeStyle=rgba(col,col[0]>100?0.95:0.35);ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(ax,y);ctx.lineTo(bx,y);ctx.moveTo(bx-12,y-9);ctx.lineTo(bx,y);ctx.lineTo(bx-12,y+9);ctx.stroke();}ctx.restore();});
    if(a>0.01){const l=clamp(lit(i),0,1),k=(0.9+0.1*spring(a))*(1+0.07*Math.sin(Math.PI*l));ctx.save();ctx.translate(cx,y);ctx.scale(k,k);
      withA(ctx,clamp(a*2,0,1),()=>{wc_tag(ctx,0,0,s,{align:"center",size:sz});if(l>0.01)withA(ctx,l,()=>wc_tag(ctx,0,0,s,Object.assign({align:"center",size:sz},EE_GOLDTAG)));});ctx.restore();}
    x+=ws[i]+gap;});}
scene("roles",(ctx,S,t,sc)=>{const c=sc.cues,P=ee_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{r:["the one","the steward","the reviewer","the owner"].map(s=>w("role",s)),actor:w("actor","an actor"),team:w("actor","a team"),come:w("actor","Actors come"),
      stay:w("actor","roles stay"),rights:w("software","rights"),read:w("may","read"),who:w("may","who uses"),not:w("maynot","may not"),
      same:w("academies","same way"),members:w("academies","members"),stays:w("academies","the steps stay")};});
  const s2=c.academies-0.3,s3=P.members-0.3,pub=sc.ends.role+0.1,V=sc.ends.academies+0.15,AK=[[s2,960,540,1.0],[s2,960,562,1.07]];
  gv_shots(ctx,S,t,sc.dur,[
    // Noor's map: the service and its six steps; a role over each of the first four, as it's named; under publish and follow, the map and
    // the glossary light; who fills each role clips on, and the team the registrar answers for; the chips lift, and settle. Then close on
    // the reviewer: the agent's chip, and its rights hung from it, line by line; the rights fold away into the chip, and the owner's card
    // turns gold
    {at:0,keys:[[0,...EE_MAPV],[c.software-0.1,...EE_RIGHTSV]],d:1.6,push:0,draw:(x,tt)=>{x.drawImage(ee_placeHi("eeMap"),0,0,W,H);
      ee_fadeCut(x,()=>ee_map(x,{service:fin(tt,0.15,0.5),step:i=>fin(tt,0.45+i*0.13,0.5),role:i=>fin(tt,P.r[i]-0.12,0.5),roleLit:gv_io(tt,P.stay-0.1,P.stay+1.1,0.4),
        app:1,term:1,termLit:0.35,gold:1,copy:1,copyLit:0,appLine:i=>clamp((tt-pub-(i-4)*0.4)/0.6,0,1),appLit:i=>0.9*gv_io(tt,pub+(i-4)*0.4,pub+2.2,0.4),
        chip:i=>fin(tt,P.actor+0.05+i*0.2,0.5),team:fin(tt,P.team-0.05,0.5),lift:clamp((tt-P.come-0.1)/1.6,0,1),
        rights:fin(tt,P.rights-0.1,0.6),may:i=>fin(tt,i===0?P.read-0.05:P.who-0.1,0.45),mayNot:fin(tt,P.not,0.45),rightsOut:clamp((tt-c.people+1.0)/1.0,0,1),
        owner:fin(tt,c.people+0.05,0.6),t:tt}));}},
    // Madrid, 1892: the academy's table by lamplight, its members in frock coats, Palma at the end with his slips, lit as he asks
    {at:s2,keys:AK,d:6.8,push:0,draw:(x,tt)=>ee_acadNight(x,tt,{pose:id=>id==="eePalma"?{pose:"ee_bundle",carry:ee_heldBundle({open:0})}:id==="eeHead"?{pose:"listen",flip:false}:null,
      after:q=>{const g=fin(tt,P.same+0.1,0.6);if(g>0.01){q.save();q.globalCompositeOperation="screen";wc_glowAt(q,1616,622,130,[255,214,140],0.8*g);q.restore();}}})},
    // today, at the same table: other members; the commission reads the cards, one explains; then the show of hands
    {at:s3,keys:AK,d:6.8,push:0,draw:(x,tt)=>{const down=clamp((tt-V+0.7)/0.5,0,1);ee_acadDay(x,tt,EE_TODAY,{
      pose:id=>{const i=EE_TODAY.findIndex(d=>d[0]===id),v=ease(clamp((tt-V-((i*3)%7)*0.08)/0.8,0,1));
        if(v>0)return v<0.5?{pose:"listen",pose2:"ee_voteUp",mix:v*2}:{pose:"ee_voteUp",pose2:"ee_vote",mix:(v-0.5)*2};
        if(id==="eeC1"||id==="eeC4")return{pose:"ee_read",pose2:"listen",mix:down,carry:down<0.5?ee_heldCardLow:null,flip:id==="eeC4"};
        if(id==="eeC2")return{pose:"listen",pose2:"ee_explain",mix:gv_io(tt,s3+0.4,V-0.5,0.5),expr:"smile",flip:false};return null;},
      on:q=>{ee_slipAt(q,752,708,92,0.06,{col:[255,253,246]});ee_slipAt(q,640,714,80,-0.1,{col:[255,253,246]});
        if(down>=0.5){ee_slipAt(q,500,712,84,0.05,{col:[255,253,246]});ee_slipAt(q,1420,712,84,-0.06,{col:[255,253,246]});}}});}}]);
  setScreen(ctx,S);
  // the steps hold still, low in the frame, while the people change behind them
  ee_stepTags(ctx,i=>fin(t,P.same-0.5+i*0.15,0.45),i=>fin(t,[P.same+0.1,s3+0.75,V][i],0.4));
  ee_pill(ctx,t,[[0,null],[s2,"Madrid · 1892"],[s3,"Today"]],1);
  wc_paperOver(ctx,S);});
// ---- 5 · What each step needs: on the map, what each step reads and writes, dropped into the information band; the copies' card,
// opened; a home for each; in Noor's room, the next film's card ----
// the next film's card, pinned at the top corner of the map on Noor's wall, over its frame (u); its pin goes in (pin)
function ee_roomNext(ctx,u,pin){if(u<=0.01)return;const cx=1160,cy=150,s="Next: Where each piece lives",w=Math.round(tw(ctx,s,32,700)+56),h=78;
  ee_land(ctx,u,cx,cy,()=>{ctx.save();ctx.translate(cx,cy);ctx.rotate(-0.025);ctx.fillStyle="rgba(40,30,20,0.2)";ctx.fillRect(-w/2+8,-h/2+10,w,h);
    wc_panel(ctx,-w/2,-h/2,w,h,{kind:"card",wash:GV.gold,washA:0.35,seed:251});wc_T(ctx,s,0,12,{w:700,size:32,align:"center",col:WC_DARK});
    const p=clamp(pin,0,1);if(p>0.01)withA(ctx,clamp(p*3,0,1),()=>gv_pin(ctx,0,-h/2+12,GV.red,0.9*lerp(1.8,1,easeCam(p))));ctx.restore();});}
// the map as chapter 4 left it
const ee_mapSoFar=tt=>({service:1,step:1,role:1,chip:1,team:1,app:1,term:1,gold:1,copy:1,copyLit:0,appLine:1,t:tt});
scene("needs",(ctx,S,t,sc)=>{const c=sc.cues,P=ee_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{writes:w("reads","writes"),term:w("term","the term"),copies:w("term","its copies"),each:w("term","each saying"),info:w("home","information"),home:w("home","a home")};});
  const drop=[c.req,c.draft,c.note,c.decision,null,P.copies].map(v=>v==null?null:v-0.1),s2=P.home+1.35;
  gv_shots(ctx,S,t,sc.dur,[
    // the map: a light along the steps; what each reads and writes drops into the information band as it's named, and the definition is
    // named the term; the copies' card opens: each copy, from the glossary, on 21 January; then a home marked at each card's corner
    {at:0,keys:[[0,906,527,1.14],[0.01,924,527,1.14]],d:26,push:0,draw:(x,tt)=>{x.drawImage(ee_placeHi("eeMap"),0,0,W,H);
      ee_fadeCut(x,()=>{ee_map(x,Object.assign(ee_mapSoFar(tt),{flow:clamp((tt-P.writes+0.2)/1.8,0,1),info:i=>drop[i]==null?0:fin(tt,drop[i],0.6),
        termHead:fin(tt,P.term-0.05,0.6),termLit:0.35+0.55*gv_io(tt,P.term-0.1,P.term+2.0,0.4),infoLit:i=>0.9*gv_io(tt,P.info-0.2+i*0.12,P.info+1.6,0.35),
        house:i=>fin(tt,P.home+0.1+i*0.15,0.4)}));
        ee_copiesBig(x,clamp((tt-P.each+0.3)/0.6,0,1)*(1-clamp((tt-c.home+0.5)/0.5,0,1)),j=>fin(tt,P.each+0.25+j*0.4,0.4),1-clamp((tt-c.home+0.7)/0.2,0,1));});}},
    // Noor's room: Noor and Yusuf at her map; at its top corner, the next film's card, and its pin goes in
    {at:s2,place:"noor",keys:[[s2,900,520,1.04]],push:0.015,draw:(x,tt)=>{ee_roomTerm(x,1);
      person(x,"noor",1420,905,0.8,{pose:"hold",carry:heldNotebook,t:tt,flip:true});person(x,"yusuf",1130,905,0.8,{pose:"listen",t:tt,flip:true});
      ee_roomNext(x,fin(tt,s2+0.5,0.5),clamp((tt-s2-1.0)/0.4,0,1));}}]);
  setScreen(ctx,S);wc_paperOver(ctx,S);});
// ---- 6 · A chart that follows: Yusuf's office on his first day, and the chart he found there; the chart now, drawn from the map, on his
// screen beside the wall calendar; Mei's leave, and the colleague who fills her role, on the map and on the chart; the old chart, retired;
// a steward's time ----
scene("chart",(ctx,S,t,sc)=>{const c=sc.cues,P=ee_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{chart:w("first","chart"),half:w("first","half"),drawn:w("drawn","drawn"),col:["step","role","who"].map(s=>w("drawn",s)),feb:w("feb","February"),
      three:w("feb","three"),coll:w("colleague","colleague"),chg:w("colleague","chart"),back:w("colleague","back"),ret:w("colleague","returns"),
      nobody:w("retype","Nobody"),time:w("time","time")};});
  const s2=P.half-0.65,s3=c.drawn+0.3,s4=c.colleague-0.35,s5=P.chg-0.55,s6=c.retype-0.35,s7=c.time-0.35,s8=sc.ends.time+0.15,go=P.nobody+0.15,
    // the chart on his screen and the calendar beside it, as they stand at tt
    wall=(x,tt,o)=>ee_fadeCut(x,()=>{ee_chartScreen(x,Object.assign({page:fin(tt,s3+0.15,0.5),tag:fin(tt,P.drawn+0.25,0.5),col:i=>fin(tt,P.col[i]-0.12,0.45)},o));
      ee_wallCal(x,{turn:clamp((tt-P.feb-0.05)/0.7,0,1),ring:clamp((tt-P.three+0.1)/1.0,0,1),back:fin(tt,P.back,0.5)});}),
    // Yusuf in the office, the old chart folded in his hands, and where it leaves them
    YO={pose:"hold",flip:true},YX=800;
  gv_shots(ctx,S,t,sc.dur,[
    // his office on his first day: the chart on the board, half its cells marked in red; he stands and looks at it
    {at:0,place:"office",keys:[[0,960,500,1.16],[0.1,975,495,1.21]],d:4.4,draw:(x,tt)=>{const [bx,by,bw,bh]=GV_OFF.board;
      ee_oldChartSmall(x);gv_halo(x,bx-24,by-24,bw+48,bh+48,GV.gold,0.7*gv_io(tt,P.chart-0.2,s2+0.5,0.5));ee_score(x);ee_binders(x);ee_deskBook(x);
      person(x,"yusuf",1180,905,0.8,{pose:"ee_lookUp",t:tt,flip:true});}},
    // the chart, close, as he found it: who's responsible for what; each TBC lit red as half its names are said to be unknown; then, now,
    // it's taken down
    {at:s2,place:"boardGov",keys:[[s2,960,450,1.03],[s2+0.1,960,440,1.07]],d:4,push:0,draw:(x,tt)=>ee_oldChart(x,{pulse:k=>gv_io(tt,P.half-0.15+k*0.14,c.drawn-0.7,0.35),
      off:clamp((tt-c.drawn+0.4)/0.9,0,1)})},
    // his desk now: the chart on his screen, drawn from the map, its columns as they're said, and the calendar beside it; the camera goes
    // to the calendar as it turns to February, and three weeks are ringed for Mei's leave
    {at:s3,place:"chartWall",keys:[[s3,960,540,1.0],[P.feb-1.6,1280,520,1.5]],d:1.7,push:0,draw:(x,tt)=>wall(x,tt)},
    // Noor's map, the rest of it dimmed: the steward's chip turns to the colleague who fills her role while she's away
    {at:s4,keys:[[s4,922,527,1.14],[s4+0.1,890,524,1.16]],d:2.4,push:0,draw:(x,tt)=>{x.drawImage(ee_placeHi("eeMap"),0,0,W,H);const v=gv_io(tt,P.coll-0.3,s5+0.5,0.5);
      ee_fadeCut(x,()=>{ee_map(x,Object.assign(ee_mapSoFar(tt),{info:1,termHead:1,termLit:0.35,house:1,swap:clamp((tt-P.coll-0.3)/0.7,0,1),
        roleLit:i=>i===1?gv_io(tt,P.coll-0.1,s5,0.4):0,chipLit:i=>i===1?0.9*gv_io(tt,P.coll+0.4,s5,0.4):0}));
        if(v>0.01){const hx=ee_mx(1)-140,hy=140,hw=280,hh=320,r=24;x.save();x.fillStyle=rgba([70,58,46],0.32*v);x.beginPath();x.rect(-W,-H,3*W,3*H);
          x.moveTo(hx+r,hy);x.arcTo(hx,hy,hx,hy+hh,r);x.arcTo(hx,hy+hh,hx+hw,hy+hh,r);x.arcTo(hx+hw,hy+hh,hx+hw,hy,r);x.arcTo(hx+hw,hy,hx,hy,r);x.closePath();x.fill("evenodd");x.restore();}});}},
    // his desk again: the chart's steward row turns to her colleague, until 19 February; and back to Mei on the Monday she returns
    {at:s5,place:"chartWall",keys:[[s5,960,540,1.0],[s5+0.1,960,536,1.02]],d:5,push:0,draw:(x,tt)=>wall(x,tt,{who:clamp((tt-P.chg+0.05)/0.7,0,1)*(1-clamp((tt-P.ret+0.05)/0.7,0,1)),
      rowLit:0.8*Math.max(gv_io(tt,P.chg-0.2,P.chg+1.3,0.35),gv_io(tt,P.ret-0.2,P.ret+1.3,0.35))})},
    // the office: nobody retypes it; Yusuf tosses the old chart, folded, into the box marked retired, and smiles
    {at:s6,place:"officeNow",keys:[[s6,700,560,1.32],[s6+0.1,690,566,1.36]],d:3,push:0,draw:(x,tt)=>{const h=ee_handsAt("yusuf",YX,905,0.8,Object.assign({t:go},YO));
      ee_binders(x);ee_deskBook(x);person(x,"yusuf",YX,905,0.8,Object.assign({},YO,{pose2:"listen",mix:fin(tt,go+0.1,0.6),carry:tt<go?ee_heldFolded:null,t:tt,expr:tt>go+0.7?"smile":"calm"}));
      ee_box(x,{drop:clamp((tt-go)/0.6,0,1),from:[(h[0][0]+h[1][0])/2,(h[0][1]+h[1][1])/2-14]});}},
    // Mei's calendar, March: her owner's two hours on Tuesdays, and now a steward's two hours on Thursdays
    {at:s7,place:"meiCal",keys:[[s7,960,540,1.0],[s7+0.1,950,530,1.04]],d:3.6,push:0,draw:(x,tt)=>ee_meiCal(x,k=>fin(tt,P.time-0.05+0.28*k,0.5))},
    // her desk: Mei, at her work, nods
    {at:s8,place:"regClose",keys:[[s8,960,540,1.04],[s8+0.1,990,520,1.1]],d:2.6,draw:(x,tt)=>{
      gv_behind(x,"mei",GV_RX.seat[0],GV_RX.top,GV_RX.seat[1],{pose:"listen",nod:ee_nod(tt,s8+0.6)+ee_nod(tt,s8+1.25),expr:"smile",t:tt});
      x.drawImage(gv_place("regDesk"),0,0,W,H);ee_meiWork(x);}}]);
  setScreen(ctx,S);ee_pill(ctx,t,[[0,null],[s5,"1 February"],[P.back-0.05,"22 February"],[s6,null]],1);
  wc_paperOver(ctx,S);});
// ---- 7 · The glossary, run as a product: its product card on Yusuf's board, each line lit as it's said; the week's list on Clara's
// screen; who reads each term; nine terms retired with their owners' yes; the dictionary's list of what's new today, and the week's ----
scene("product",(ctx,S,t,sc)=>{const c=sc.cues,P=ee_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{gl:w("itself","glossary"),own:w("owner","owner"),users:["people","reports","tables","agents"].map(s=>w("users",s)),prom:w("promise","promise"),
      pr:["owner","definition","example","status","change","ten"].map(s=>w("promise",s)),week:w("week","week"),counts:w("counts","counts"),
      retired:w("nine","retired"),yes:w("nine","yes"),wk:w("yearly","week"),every:w("yearly","everyone")};});
  const s2=c.owner-0.35,s3=c.week-0.35,s4=c.counts-0.3,s5=c.nine-0.2,s6=P.yes-0.1,s7=c.yearly-0.3,s8=P.wk-0.2,U=P.users,R=P.pr,ask=sc.ends.promise+0.35,
    // when each piece of the card is said, and how long its field glows
    at=[[[P.own]],[[U[0],U[1]],[U[2],U[3]]],[[R[0],R[1]],[R[2],R[3]],[R[4],R[5]-0.9]],[[ask]]],
    band=(tt,i)=>gv_io(tt,[P.own,U[0],P.prom,ask][i]-0.25,[c.users-0.3,c.promise-0.3,sc.ends.promise+0.2,s3][i],0.35),
    YO={pose:"hold",flip:true},YX=800,go=s6+0.55;
  gv_shots(ctx,S,t,sc.dur,[
    // Yusuf's office: he pins the glossary's product card on his board, where the old chart was
    {at:0,place:"officeNow",keys:[[0,980,420,1.4],[0.1,960,425,1.44]],d:4.4,draw:(x,tt)=>{const up=fin(tt,0.7,0.6)*(1-fin(tt,2.9,0.6));
      ee_binders(x);ee_cardSmall(x,fin(tt,P.gl-0.15,0.5));ee_deskBook(x);person(x,"yusuf",1150,905,0.8,{pose:"listen",pose2:"ee_pin",mix:up,t:tt,flip:true});}},
    // the card, close: each line lit as it's said
    {at:s2,place:"boardGov",keys:[[s2,960,500,1.0],[s2+0.1,960,505,1.04]],d:18,push:0,draw:(x,tt)=>ee_productCard(x,{seg:(i,j,k)=>fin(tt,at[i][j][k]-0.1,0.4),
      band:i=>band(tt,i)})},
    // Clara's screen: the glossary's list of what changed this week; completion first, lit
    {at:s3,place:"screenPlan",keys:[[s3,960,420,1.26],[s3+0.1,960,425,1.29]],d:3,push:0,draw:(x,tt)=>ee_weekPage(x,{row:i=>fin(tt,P.week+0.05+i*0.25,0.4),lit:fin(tt,c.week+1.1,0.5)})},
    // Yusuf's screen: who reads each term; and the nine nobody read
    {at:s4,keys:[[s4,619,430,1.55],[s4+0.1,612,428,1.58]],d:3,push:0,draw:(x,tt)=>{x.drawImage(ee_placeHi("chartWall"),0,0,W,H);
      ee_readers(x,{left:i=>fin(tt,s4+0.35+i*0.12,0.35),right:i=>fin(tt,P.counts+0.6+i*0.1,0.3)});}},
    // his desk: the nine, each on a card, sent to its owner, and back with their yes
    {at:s5,place:"desk",keys:[[s5,960,500,1.0],[s5+0.1,960,505,1.03]],d:5,push:0,draw:(x,tt)=>ee_retireCards(x,{card:i=>fin(tt,s5+0.35+i*0.1,0.5),
      yes:i=>clamp((tt-P.retired-0.1-i*0.18)/0.6,0,1)})},
    // the office: he tosses them into the box marked retired, with the old chart
    {at:s6,place:"officeNow",keys:[[s6,700,560,1.32],[s6+0.1,690,566,1.36]],d:2,push:0,draw:(x,tt)=>{const h=ee_handsAt("yusuf",YX,905,0.8,Object.assign({t:go},YO));
      ee_binders(x);ee_cardSmall(x,1);ee_deskBook(x);person(x,"yusuf",YX,905,0.8,Object.assign({},YO,{pose2:"listen",mix:fin(tt,go+0.1,0.6),carry:tt<go?ee_heldStack:null,t:tt,expr:tt>go+0.6?"smile":"calm"}));
      ee_box(x,{drop:1,cards:clamp((tt-go)/0.7,0,1),cardsFrom:[(h[0][0]+h[1][0])/2,(h[0][1]+h[1][1])/2-14]});}},
    // today: at the bus stop, someone reads the dictionary's list of what's new on a phone
    {at:s7,place:"bus",keys:[[s7,960,540,1.0]],push:0.03,draw:(x,tt)=>{person(x,"eeBus",1040,EE_BS.shelter[1]+EE_BS.shelter[3]-4,0.86,{pose:"phone",t:tt,flip:false});
      ee_phoneNew(x,1500,470,clamp((tt-s7-0.3)/0.7,0,1));}},
    // the floor: the week's list on every screen, from the middle out
    {at:s8,place:"floor",keys:[[s8,960,540,1.0]],push:0.02,draw:(x,tt)=>{ee_floorScreens(x,i=>fin(tt,P.every-0.2+[0.24,0.12,0,0.12,0.24][i],0.4));ee_floor(x,tt);
      ee_tagAt(x,tt,s8+0.45,null,960,94,"What changed this week",Object.assign({size:32},EE_GOLDTAG));}}]);
  setScreen(ctx,S);ee_pill(ctx,t,[[0,null],[s7,"Today"],[s8,null]],1);
  wc_paperOver(ctx,S);});
// ---- 8 · Where it is: Clara's request, each step lit with its date; eight working days; one way to count, and the nine points gone;
// Palma in 1909, sealing his letter; Clara, today; the service on Noor's map, lit; the end card ----
scene("where",(ctx,S,t,sc)=>{const c=sc.cues,P=ee_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{could:w("along","could"),decided:w("eight","decided"),days:w("eight","days"),one:w("oneway","one"),nine:w("oneway","nine"),gone:w("oneway","gone"),
      ask:w("palma","ask"),became:w("palma","became"),hers:w("hers","hers"),anyone:w("gives","anyone"),step:w("gives","step"),role:w("gives","role"),
      words:w("gives","words"),everyone:w("gives","everyone"),use:w("gives","use")};});
  const s3=c.oneway-0.3,s4=c.palma-0.35,s5=c.hers-0.35,s6=c.gives-0.4,dd=i=>P.could-0.15+i*0.42,CX=470;
  gv_shots(ctx,S,t,sc.dur,[
    // Clara's screen: her request, its six steps lit one by one, each with its date; then the days it took, each working day ticked
    {at:0,place:"screenPlan",keys:[[0,960,500,1.06],[0.1,960,505,1.1]],d:9,push:0,draw:(x,tt)=>ee_trackPage(x,{dot:i=>fin(tt,dd(i),0.4),
      days:clamp((tt-c.eight+0.3)/0.8,0,1),tick:k=>fin(tt,P.decided+0.25+k*0.13,0.3),n:fin(tt,P.days+0.1,0.4)})},
    // her report: each faculty's note turns to the examiners' day; Health's rate rises to sit beside the others; the ring fades
    {at:s3,place:"desk",keys:[[s3,960,540,1.0]],push:0.02,draw:(x,tt)=>{const mv=easeCam(clamp((tt-P.nine+0.1)/1.3,0,1));
      ee_report(x,{note:()=>1,one:i=>clamp((tt-P.one+0.25-i*0.15)/0.5,0,1),rate:i=>[lerp(84,83,mv),83,lerp(75,82,mv)][i],ring:1,ringA:1-clamp((tt-P.gone+0.7)/0.7,0,1)});}},
    // Lima, 1909: Palma, at his desk in the National Library, seals his letter to a friend in Madrid, and holds it; what became of his word
    {at:s4,keys:[[s4,960,590,1.26],[s4+0.1,960,600,1.3]],d:4,push:0,draw:(x,tt)=>{x.drawImage(ee_placeHi("lib"),0,0,W,H);const L=EE_LB;
      x.save();x.beginPath();x.rect(-W,-H,3*W,L.dk.bk+H);x.clip();
      person(x,"eePalmaOld",L.seat[0],L.dk.bk+GV_SIT*L.seat[1]*PEOPLE.eePalmaOld.build.h,L.seat[1],{pose:"ee_bundle",t:tt,flip:false,carry:ee_heldLetter({seal:clamp((tt-P.ask+0.2)/0.5,0,1)})});
      x.restore();x.drawImage(ee_libDesk(),0,0,W,H);ee_tagAt(x,tt,P.became-0.1,s5-0.3,1250,560,"to budget?",Object.assign({size:32},EE_GOLDTAG));}},
    // today, Planning: her request on the wall screen, its six steps lit; Clara looks up at it, smiles, and turns back to her desk
    {at:s5,place:"planning",keys:[[s5,860,480,1.2],[s5+0.1,846,486,1.24]],d:3,push:0,draw:(x,tt)=>{ee_onScreen(x,EE_PLS,q=>ee_trackPage(q,{days:1,n:1}));
      const tn=clamp((tt-P.hers-0.6)/0.3,0,1),sx=Math.max(0.04,Math.abs(Math.cos(Math.PI*tn)));x.save();x.translate(CX,0);x.scale(sx,1);x.translate(-CX,0);
      person(x,"clara",CX,905,0.8,{pose:"listen",t:tt,flip:tn>=0.5,expr:tt>P.hers-0.4?"smile":"calm"});x.restore();}},
    // Noor's map: the service, a way in for anyone; its steps and the roles that do them; the words in the information band; then all of
    // it; it fades back as the end card comes over it
    {at:s6,place:"eeMap",keys:[[s6,EE_MAPV[0],EE_MAPV[1],EE_MAPV[2]],[s6+0.1,EE_MAPV[0]-8,EE_MAPV[1]+2,EE_MAPV[2]+0.02]],d:7,push:0,draw:(x,tt)=>{
      withA(x,1-0.6*fin(tt,c.breath+0.2,1.0),()=>ee_fadeCut(x,()=>{ee_map(x,Object.assign(ee_mapSoFar(tt),{info:1,termHead:1,house:1,svcLit:fin(tt,P.anyone-0.2,0.5),stepLit:i=>fin(tt,P.step-0.2+i*0.1,0.5),
        roleLit:i=>fin(tt,P.role-0.3+i*0.1,0.5),chipLit:i=>0.8*fin(tt,P.role-0.1+i*0.1,0.5),infoLit:i=>fin(tt,P.words-0.2+i*0.08,0.5),
        termLit:Math.max(0.35,fin(tt,P.words-0.2,0.5)),glossLit:fin(tt,P.everyone-0.1,0.5),copyLit:j=>fin(tt,P.everyone+j*0.1,0.5),lit:fin(tt,P.use+0.3,0.8)}));}));}}]);
  setScreen(ctx,S);ee_pill(ctx,t,[[0,null],[s4,"Lima · 1909"],[s5,null]],1);
  gv_end(ctx,S,t,c.breath+0.2,"Who does what, end to end","Anyone can ask. Everyone can see where it is.","Film 2 of 3");
  if(t>c.breath+1.4)withA(ctx,fin(t,c.breath+1.6,0.8),()=>wc_tag(ctx,960,780,"Next: Where each piece lives",{align:"center",size:30,w:600}));
  wc_paperOver(ctx,S);});
const WC_PLACES={acad:c=>ee_paintAcad(c,{}),acadDay:c=>ee_paintAcad(c,{day:true}),school:ee_paintSchool,hall:ee_paintHall,lib:ee_paintLib,mex:ee_paintMex,bus:ee_paintBus,floor:gv_paintFloor,
  planning:gv_paintPlanning,desk:gv_paintDesk,boardPlan:c=>gv_paintBoardClose(c,GV_ROOM.plan),
  regClose:gv_paintRegistrarClose,regDesk:gv_paintRegistrarDesk,registrar:gv_paintRegistrar,screenReg:c=>gv_paintScreenDesk(c,GV_ROOM.reg),
  screenData:c=>gv_paintScreenDesk(c,GV_ROOM.data),noor:gv_paintNoor,eeMap:ee_paintMap,office:gv_paintOffice,boardGov:c=>gv_paintBoardClose(c,GV_ROOM.gov),
  officeNow:ee_paintOfficeNow,chartWall:ee_paintChartWall,meiCal:ee_paintMeiCal,screenPlan:c=>gv_paintScreenDesk(c,GV_ROOM.plan)};
