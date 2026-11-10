/* ===== The hidden factory: the eight chapters =====
   Each chapter is a few shots (the agent films' ag_shots): a place painted once, a slow camera, and what's drawn live over it. Between
   places a shot dissolves in, or cuts where the two show the same people or words. In one room the camera never jumps: the next shot
   glides on from where the camera is, and a later moment there (later:true) lets what was there leave before what comes next comes in.
   Times inside a chapter come from its cues (when each line starts) and the words of its lines (wAt), so the pictures stay with the
   voice if it's recorded again. Words on screen are on the module's cards, tags and pages, at least 28 px as seen, and above the
   captions (y 890). Every name here starts with hf_ or HF_. */

// made once per chapter, the first time it draws: its cues are known by then
const hf_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// a card that springs in at t0 and goes at t1 (or stays): its k and a
const hf_pop=(t,t0,t1,d)=>({k:clamp(ag_spr(t,t0,0.8),0,1.2),a:t1==null?ag_in(t,t0,d||0.35):ag_io(t,t0,t1,d||0.35)});
// a value from a to b as t goes from t0 over d seconds, eased
const hf_go=(t,t0,d,a,b)=>lerp(a,b,ag_sine((t-t0)/(d||1)));
const HF_TITLE="The hidden factory",HF_LINE="Quality as a habit · Film 1 of 4";
// the bare places, for a later moment in them
AG_BARE.hfRoom=null;AG_BARE.bench=null;AG_BARE.benchTop=null;AG_BARE.hfOffice=null;
// the chapters that open on what the one before ends on (after the last scene)
const HF_CUTS=["hand","back","born"];

/* ---------------------------------------------------------------- 1 · Dead letters
   Washington, 1899: the street; the reading room, its letters by the basket; three envelopes on a reading table; the clerks; Patti
   Lyle Collins at her desk by the window, writing "Hyde Park, Mass." beside "Aj tpar, Mass."; the next basket; the letters destroyed;
   where the change has to be. 1943: a case of numbered holes, a letter sorted by its zone. 1963: an envelope with the ZIP Code in the
   sender's hand; the case by the first digit and a sorting machine; 1969. The two envelopes side by side. Then the university, 2025:
   the graduations office, the same pencil marks in the same cells every year; the title card. */
const HF_ENV={
  moved:[["Miss E. Carter"],["214 Elm Street"],["Albany, N.Y."]],
  hale:[["Mr. J. Hale"],["Boston"]],
  aj:[["Mrs. A. Lowell"],["Aj tpar, Mass."]],
  zone:[["Mr. C. Olsen"],["2418 Fremont Ave."],["Minneapolis 16, Minn."]],
  zip:[["Mrs. D. Walsh"],["15 River Street"],["Hyde Park, Mass."]]
};
scene("dead",(ctx,S,t,sc)=>{const c=sc.cues,P=hf_once(sc,"P",()=>({six:wAt(sc,"mail","six"),office:wAt(sc,"mail","Dead Letter"),
    desk:c.means-0.5,dead:wAt(sc,"means","dead letter"),moved:wAt(sc,"moved","moved"),addr:wAt(sc,"moved","address"),street:wAt(sc,"street","street"),spelt:wAt(sc,"street","spelt"),
    room:c.room-0.4,clerks:wAt(sc,"room","clerks"),coll:c.collins-0.2,thou:wAt(sc,"collins","thousand"),unseen:c.unseen-0.2,next:wAt(sc,"unseen","next"),
    lost:c.lost-0.2,news:wAt(sc,"lost","news"),change:c.change,where:wAt(sc,"change","where"),
    zones:c.zones-0.3,war:wAt(sc,"zones","war"),number:wAt(sc,"zones","a number"),sortz:wAt(sc,"zones","sort by it"),
    zip:c.zip-0.4,five:wAt(sc,"zip","five digits"),sender:wAt(sc,"zip","written by"),sort:c.sort-0.3,anyone:wAt(sc,"sort","anyone"),machines:wAt(sc,"sort","machines"),
    used:wAt(sc,"used","eighty-three"),billions:wAt(sc,"used","billions"),start:c.start-0.4,once:wAt(sc,"start","written once"),knows:wAt(sc,"start","knows"),
    campus:c.campus-0.5,hand:wAt(sc,"campus","by hand"),copy:wAt(sc,"campus","in a copy"),same:wAt(sc,"same","new list"),back:wAt(sc,"same","back"),
    count:wAt(sc,"promise","Count"),born:wAt(sc,"promise","born"),title:c.breath+0.1}));
  // an envelope on the desk, drawn on the shot's own canvas c (in a dissolve, the picture the shot is drawn on)
  const env=(c,x,y,w,lines,o)=>hf_env(c,x,y,w,lines,Object.assign({on:"desk"},o));
  ag_shots(ctx,S,t,sc.dur,[
    // the street in morning light; on "six million", the camera glides in towards a window of the long front
    {at:0,place:"hfStreet",keys:[[0,960,540,1.0],[P.six-0.6,HF_WIN[0],HF_WIN[1],1.7]],d:2.6,push:0.02,draw:(x,tt)=>hf_streetLife(x,tt,1)},
    // the reading room, its letters by the basket and the sack; the count a year
    {at:P.six+1.3,dis:1.0,place:"hfRoom",keys:[[P.six+1.3,960,540,1.06],[P.six+1.4,960,540,1.0]],d:2.4,push:0.02,draw:(x,tt)=>{
      hf_basket(x,240,1010,0.9,3);hf_basket(x,520,1040,0.8,5);hf_sack(x,1620,1030,0.9);hf_sack(x,1790,1050,0.8);
      const p=hf_pop(tt,P.six+2.2);dq_textCard(x,1000,96,460,{kick:"Sent to the office",title:"6,312,731 a year",sub:"letters and parcels"},{edge:"steel",icon:"mail",k:p.k,a:p.a});}},
    // a reading table, close: an envelope that can't be delivered or sent back; why: moved on, no street, a town spelt as it sounds
    {at:P.desk,dis:0.8,place:"hfDesk",keys:[[P.desk,960,540,1.04],[P.desk+0.1,960,540,1.0]],d:2.2,push:0.02,draw:(x,tt)=>{
      const sl=(t0,dx)=>({x:dx*(1-ag_eo((tt-t0)/0.9)),a:ag_in(tt,t0,0.3)});
      const e1=sl(P.dead-0.6,700),e2=sl(P.street-0.5,700),e3=sl(P.spelt-0.4,700);
      env(x,500+e1.x,360,560,HF_ENV.moved,{a:e1.a,rot:-0.03,note:"moved · no address left",noteP:ag_sine((tt-P.addr+0.6)/1.6)});
      env(x,1290+e2.x,380,560,HF_ENV.hale,{a:e2.a,rot:0.035});
      env(x,880+e3.x,712,560,HF_ENV.aj,{a:e3.a,rot:-0.02});
      const p=hf_pop(tt,P.dead+0.2);dq_textCard(x,1060,40,720,{kick:"A dead letter",title:"can't deliver · can't send back"},{k:p.k,a:p.a});}},
    // the room again: the clerks at the tables, Collins at her desk by the window. One shot, so nothing shows twice: the camera glides in
    // to her, close, as she reads "Aj tpar, Mass." and writes beside it in pencil, "Hyde Park, Mass."; her name, the envelope and the
    // card leave, and the camera glides back out, wide, as a new basket comes in with the same kinds of address
    {at:P.room,dis:0.9,place:"hfRoom",keys:[[P.room,960,540,1.04],[P.room+0.1,960,540,1.0],[P.coll,1545,560,1.6],[P.unseen,960,540,1.0]],d:2.4,push:0.0,draw:(x,tt)=>{
      hf_roomLife(x,tt,P,{clerks:ag_in(tt,P.clerks-0.6,1.0),basket:ag_eo((tt-P.next+1.0)/2.0)});
      const out=1-ag_in(tt,P.unseen-0.7,0.5);if(out>0&&tt>P.coll)hf_scr(x,S,()=>{const i0=ag_in(tt,P.coll+2.0,0.5),ia=i0*out,nm=ag_in(tt,P.coll+1.2,0.5)*out;
        dq_nameTag(x,1860,170,HF_P.collins,{role:"Dead Letter Office",align:"right",a:nm});
        hf_env(x,520,602,580,HF_ENV.aj,{a:ia,k:i0<1?ag_in(tt,P.coll+2.0,0.6):null,on:"wall",rot:-0.02,note:"Hyde Park, Mass.",noteP:ag_sine((tt-P.coll-2.8)/1.8),noteSize:32});
        const p=hf_pop(tt,P.thou-0.2);dq_textCard(x,96,780,420,{kick:"She works out",title:"about 1,000 a day"},{edge:"steel",icon:"count",k:p.k,a:p.a*out});});}},
    // nearly three million destroyed: the sacks go; one letter left on the table
    {at:P.lost,place:"hfRoom",keys:[[P.lost,900,560,1.08]],d:2.2,push:0.01,draw:(x,tt)=>{hf_roomLife(x,tt,P,{clerks:1,basket:1,sacks:ag_sine((tt-P.lost-0.2)/2.2),plain:ag_in(tt,P.news-0.6,0.8)});
      hf_scr(x,S,()=>{const p=hf_pop(tt,P.lost+0.6);dq_textCard(x,1380,90,440,{kick:"Destroyed, a year",title:"2,973,987"},{edge:"steel",icon:"cross",k:p.k,a:p.a});});}},
    // where the change has to be: the room steps back under a pale veil, and a card
    {at:P.change,place:"hfRoom",keys:[[P.change,960,540,1.0]],d:2.0,push:0,draw:(x,tt)=>{hf_roomLife(x,tt,P,{clerks:1,basket:1,sacks:1,plain:1});
      hf_scr(x,S,()=>{x.fillStyle="rgba(244,238,226,"+(0.72*ag_in(tt,P.change+0.2,0.9))+")";x.fillRect(0,0,W,H);
        const p=hf_pop(tt,P.where-0.3);dq_textCard(x,610,400,700,{kick:"Something has to change",title:"where the address is written"},{edge:"brass",k:p.k,a:p.a});});}},
    // 1943: the zones; a young clerk sorts by the number the sender wrote
    {at:P.zones,dis:1.0,place:"hfCase",keys:[[P.zones,960,540,1.04],[P.zones+0.1,960,540,1.0]],d:2.4,push:0.02,draw:(x,tt)=>hf_caseLife(x,tt,P)},
    // 1963: the ZIP Code, in the sender's hand
    {at:P.zip,dis:1.0,place:"hfDesk63",keys:[[P.zip,960,540,1.04],[P.zip+0.1,960,540,1.0]],d:2.2,push:0.02,draw:(x,tt)=>{
      env(x,900,470,760,HF_ENV.zip,{size:40,code:["02136",ag_sine((tt-P.five+0.2)/1.4)],a:ag_in(tt,P.zip,0.5)});
      const p=hf_pop(tt,P.sender-0.2);dq_textCard(x,1300,760,520,{kick:"Written by",title:"the sender, once"},{edge:"brass",icon:"person",k:p.k,a:p.a});}},
    // anyone, and soon machines: the case by the first digit, then the machine; 1969
    {at:P.sort,dis:1.0,place:"hfMachine",keys:[[P.sort,560,560,1.35],[P.machines-0.3,1180,560,1.25],[P.used-0.6,960,540,1.0]],d:2.2,push:0.0,draw:(x,tt)=>{
      hf_machineLife(x,tt,{run:ag_in(tt,P.machines,1.0),first:ag_in(tt,P.anyone-0.3,0.6)});
      hf_scr(x,S,()=>{const p1=hf_pop(tt,P.used-0.1),p2=hf_pop(tt,P.billions-0.3);
        dq_textCard(x,120,90,420,{kick:"1969",title:"83% use it"},{edge:"steel",icon:"people",k:p1.k,a:p1.a});
        dq_textCard(x,580,90,560,{kick:"Since",title:"saved the post billions"},{edge:"steel",icon:"count",k:p2.k,a:p2.a});});}},
    // the fix moved to the start: the two envelopes side by side, the pencil at the end, the pen at the start
    {at:P.start,dis:1.0,place:"hfDesk63",keys:[[P.start,960,540,1.0]],d:2.0,push:0.02,draw:(x,tt)=>{
      env(x,560,430,660,HF_ENV.zip,{code:["02136",1],size:34});
      const s9=ag_eo((tt-P.start-0.2)/1.2);env(x,1360+300*(1-s9),430,660,HF_ENV.aj,{a:ag_in(tt,P.start+0.1,0.4),note:"Hyde Park, Mass.",noteP:1,rot:0.02,paper:[236,226,204]});
      const ar=ag_sine((tt-P.once+0.4)/1.6);if(ar>0){x.save();x.strokeStyle=rgba(HF.pencil,0.9);x.lineWidth=5;x.lineCap="round";const bz=[1320,700,1140,800,820,800,640,700];ag_bzPath(x,bz,0,ar);x.stroke();
        if(ar>0.97){x.beginPath();x.moveTo(668,690);x.lineTo(640,700);x.lineTo(664,722);x.stroke();}x.restore();}
      dq_chip(x,560,800,"at the start · 1963",{align:"center",a:ag_in(tt,P.once-0.2,0.5)});dq_chip(x,1360,800,"at the end · 1899",{align:"center",a:ag_in(tt,P.start+0.9,0.5)});}},
    // the university, 2025: the graduations office; pencil marks in the copy's cells, and the same ones the next time
    {at:P.campus,dis:1.0,place:"hfOffice",keys:[[P.campus,960,540,1.04],[P.campus+0.1,960,540,1.0]],d:2.2,push:0.02,draw:(x,tt)=>{
      const again=tt>P.same-0.2,u=again?ag_in(tt,P.same-0.2,0.9):ag_in(tt,P.campus+0.6,1.2),m0=again?P.same+0.6:P.hand-0.2;
      hf_offScreen(x,u,{ticks:0,marks:HF_MARKS.map((m,i)=>[m[0],m[1],ag_in(tt,m0+i*0.35,0.4)])});hf_office(x,tt,{});
      const tg=ag_in(tt,P.count-0.2,0.6);if(tg>0)dq_tag(x,712,236,"none",{to:[724,474],text:"HOURS · NOT COUNTED",k:ag_in(tt,P.count-0.2,0.9),a:tg,angle:0.03});
      const p=hf_pop(tt,P.born-0.6);dq_textCard(x,1250,96,560,{kick:"So",title:"count it, fix it where it's born"},{edge:"brass",k:p.k,a:p.a});}}
  ]);
  hf_tags(ctx,S,t,[[0.4,"Washington · 1899"],[P.zones,"1943",1.0],[P.zip,"1963",1.0],[P.start,"1899 and 1963",1.0],[P.campus,"The university · 2025",1.0]],1-ag_in(t,P.title,0.6));
  dq_title(ctx,S,t,P.title,HF_TITLE,null,HF_LINE);});
// the cells of the copy where pencil marks come, each year the same: [row, column]
const HF_MARKS=[[2,2],[5,3],[6,1],[9,2],[11,3],[14,2]];
// the room's life: the clerks (a, 0 to 1, faded as one picture with Collins), the baskets, the sacks leaving (0 to 1), the new basket
// coming in (0 to 1) and the plain letter left on the near table
function hf_roomLife(ctx,t,P,o){o=o||{};hf_group(ctx,o.clerks==null?1:o.clerks,"hfRoomPeople",x=>{hf_clerks(x,t,1);const D=HF_ROOM.desk;
    dq_person(x,HF_P.collins,1640,D.y,D.s,{t,flip:true,nod:0.28+0.02*Math.sin(t*0.5),gaze:[-3,9],smile:0,cut:D.top+2});});
  hf_basket(ctx,240,1010,0.9,3);hf_basket(ctx,520,1040,0.8,5);
  if(o.basket>0)hf_basket(ctx,lerp(-260,780,o.basket),1050,0.84,9);
  const sk=o.sacks||0;hf_sack(ctx,1620+sk*520,1030,0.9,{a:1-ag_in(sk,0.7,0.3)});hf_sack(ctx,1790+sk*420,1050,0.8,{a:1-ag_in(sk,0.75,0.25)});
  if(o.plain>0){ctx.save();ctx.globalAlpha*=o.plain;ctx.translate(820,792);ctx.transform(1,0,-0.6,0.42,0,0);ctx.fillStyle="rgba(40,24,10,0.3)";ctx.fillRect(-58,-26,116,58);
    ctx.fillStyle=rgba(HF.paper,1);ctx.fillRect(-60,-32,120,64);ctx.strokeStyle="rgba(110,90,60,0.4)";ctx.lineWidth=2;ctx.strokeRect(-60,-32,120,64);ctx.restore();}}
// 1943: the case's labels, the clerk at its left, the envelope coming in and going into hole 16
function hf_caseLife(ctx,t,P){const n16=hf_caseHole(16),fly=ag_sine((t-P.sortz+0.2)/1.4),lit=ag_in(t,P.sortz+0.9,0.5);
  hf_caseLabels(ctx,{n:16,lit});
  ag_person(ctx,HF_Y43,300,600,0.96,{t,nod:0.06,gaze:[5,-1]});
  const a=ag_in(t,P.zones+0.4,0.6);if(a<=0)return;const w=lerp(700,96,fly),x=lerp(1080,n16[0],fly),y=lerp(640,n16[1]-10,fly);
  if(fly<0.98)hf_env(ctx,x,y,w,HF_ENV.zone,{a:a*(1-ag_in(fly,0.9,0.1)),on:"wall",size:lerp(36,6,fly),deco:fly>0.05,top:w*0.56*0.3});
  // the zone number the sender wrote, underlined in pencil as it's said
  if(fly<0.05){const u=ag_sine((t-P.number+0.2)/0.8);if(u>0){ctx.save();ctx.strokeStyle=rgba(HF.pencil,0.9);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(1112,y+124);ctx.lineTo(1112+64*u,y+124);ctx.stroke();ctx.restore();}}
  if(fly>=0.98){ctx.save();ctx.fillStyle=rgba(HF.paper,1);ctx.fillRect(n16[0]-48,n16[1]-30,96,30);ctx.restore();}}
const HF_Y43={key:"hf_y43",name:"a young clerk",skin:HF_SKIN[3],hair:{style:"bob",c:[120,86,56]},top:{kind:"cardigan",c:[120,100,92],inner:[236,232,222]},breath:0.32};

/* ---------------------------------------------------------------- 2 · Every name, by hand
   The graduations office, October 2025: Malia and her colleague; the platform's SQL editor, and the list downloaded into the copy; a
   name checked against the document seen at enrolment, and a call; three names corrected; the due time, and the copy goes to the
   printer. December's Great Hall: empty folders at the side of the stage, 41 certificates printed again. The bench, February 2026:
   a hundred records looked at closely, 21 with an error; "21 in 100" against "41 in 2,031". Then 1899 and 2025 side by side. */
const HF_SQL=[[["select ",DQ.soft],["given_name, family_name, award_name",null]],[["  from ",DQ.soft],["mart_graduations__graduation_list",null]],[[" where ",DQ.soft],["ceremony_id like 'DEC25-%'",null]]];
scene("hand",(ctx,S,t,sc)=>{const c=sc.cues,P=hf_once(sc,"P",()=>({before:wAt(sc,"malia","Before"),coll:wAt(sc,"malia","colleague"),byhand:wAt(sc,"malia","by hand"),
    down:c.down,dl:wAt(sc,"down","download"),plat:wAt(sc,"down","platform"),spread:wAt(sc,"down","spreadsheet"),names:wAt(sc,"down","two thousand"),
    docs:c.docs,seen:wAt(sc,"docs","documents"),match:wAt(sc,"docs","doesn't match"),phone:wAt(sc,"docs","phone"),
    sent:c.sent,thir:wAt(sc,"sent","thirteenth"),printer:wAt(sc,"sent","printer"),printed:c.printed-0.3,again:wAt(sc,"printed","printed again"),
    hundred:c.hundred-0.3,feb:wAt(sc,"hundred","February"),found:wAt(sc,"hundred","found"),twenty:wAt(sc,"hundred","twenty-one"),
    five:c.five,only:wAt(sc,"five","but only"),like:c.like-0.3,end:wAt(sc,"like","at the end"),unseen:wAt(sc,"like","unseen")}));
  ag_shots(ctx,S,t,sc.dur,[
    // the office, gliding on from the opening's last shot: Malia and her colleague; the copy's rows ticked one by one, by hand; the
    // camera keeps Malia at the left while the pages stand at the right, and comes closer while she phones
    {at:0,place:"hfOffice",keys:[[0,960,540,1.0],[P.before-0.6,820,560,1.14],[P.dl-0.8,700,540,1.3],[P.phone-0.6,680,520,1.42],[P.sent-0.2,700,540,1.3]],d:2.2,push:0,draw:(x,tt)=>{
      const sql=tt>P.dl-0.4&&tt<P.spread+0.2,u=sql?1:tt<P.dl?1:ag_in(tt,P.spread,0.8);
      hf_offScreen(x,u,{sql,ticks:tt<P.dl?ag_in(tt,P.byhand-0.6,3.2)*0.9:ag_in(tt,P.seen,5.0)});
      hf_office(x,tt,{malia:{talk:tt>P.phone-0.1&&tt<P.sent-0.6?1:0,nod:0.04}});
      hf_scr(x,S,()=>{dq_nameTag(x,860,210,HF_MALIA,{role:"Graduations officer",a:ag_io(tt,c.malia+0.5,P.dl-0.6,0.5)});
        // the platform's SQL editor, as Malia's screen shows it: the list for December's ceremonies, 2,031 rows
        const q=hf_pop(tt,P.dl-0.5,P.spread-0.3);dq_window(x,990,120,880,410,{logo:"databricks",product:"Databricks",title:"SQL editor",k:q.k,a:q.a,draw:(cc,b)=>{
          dq_code(cc,b.x+12,b.y+6,HF_SQL,{lineA:(l,i)=>ag_in(tt,P.dl-0.3+i*0.35,0.3)});
          cc.fillStyle="rgba(110,90,66,0.22)";cc.fillRect(b.x,b.y+150,b.w,1.5);
          dq_icon(cc,"table",b.x+30,b.y+196,34,"steel",{a:ag_in(tt,P.plat,0.4)});dq_T(cc,"2,031 rows",b.x+62,b.y+206,{w:700,size:30,col:"steel",a:ag_in(tt,P.plat,0.4)});
          dq_chip(cc,b.x+b.w-236,b.y+196,"Download",{icon:"sheet",a:ag_in(tt,P.plat+0.3,0.4)});}});
        // the copy: the list in a spreadsheet; its rows ticked against the documents; three names corrected; the due time
        const fx=tt<P.sent?{}:{"0,2":ag_in(tt,P.sent+0.3,0.9),"1,1":ag_in(tt,P.sent+1.0,0.6),"1,2":ag_in(tt,P.sent+1.0,0.8),"3,2":ag_in(tt,P.sent+1.7,1.2)};
        const out=ag_sine((tt-c.printed+1.1)/1.0),cp=hf_pop(tt,P.spread-0.1);
        if(cp.a>0&&out<1){x.save();x.translate(out*1000,0);x.globalAlpha*=1-ag_in(out,0.6,0.4);
          const B=hf_copy(x,990,120,880,{title:"December 2025 · 2,031 names",k:cp.k,a:cp.a,fix:fx,ticks:ag_in(tt,P.seen,5.0),lit:tt>P.seen-0.2&&tt<P.sent?1:null});
          const ra=ag_io(tt,P.seen-0.2,P.sent-0.4,0.5);if(ra>0){dq_textCard(x,990,B.y+B.h+30,560,{kick:"Seen at enrolment",title:"Chloé Lefèvre"},{edge:"brass",icon:"form",k:ag_in(tt,P.seen-0.2,0.9),a:ra});}
          const ca=ag_io(tt,P.phone+0.4,P.sent-0.4,0.4);if(ca>0)dq_chip(x,1728,B.y+B.h+96,"call back · 2 pm",{icon:"clock",align:"center",a:ca});
          const da=ag_in(tt,P.thir-0.6,0.5);if(da>0)dq_tag(x,1040,B.y+B.h+70,"brass",{to:[1010,B.y+B.h-6],text:"TO THE PRINTER · THU 13 NOV · 5 PM",k:ag_in(tt,P.thir-0.6,0.9),a:da,angle:0.02,size:28});
          x.restore();}});}},
    // December's Great Hall: at the side of the stage, folders lying open and empty; 41 certificates printed again
    {at:P.printed,dis:1.0,place:"hall",keys:[[P.printed,960,540,1.0]],d:2.0,push:0.02,draw:(x,tt)=>{hf_folders(x,820,700,4);
      hf_scr(x,S,()=>{const p=hf_pop(tt,P.again-0.6);dq_textCard(x,140,160,560,{kick:"Printed again",title:"41 certificates",sub:"December 2025"},{edge:"steel",icon:"certificate",k:p.k,a:p.a});});}},
    // the bench, February 2026: a hundred records looked at closely, the 21 with an error circled; then the two counts side by side
    {at:P.hundred,dis:1.0,place:"benchTop",keys:[[P.hundred,700,500,1.2],[P.five-0.4,960,540,1.0]],d:2.4,push:0.0,draw:(x,tt)=>{
      hf_hundred(x,120,130,{marked:ag_in(tt,P.found-0.2,2.6),rowA:i=>ag_in(tt,P.hundred+0.2+Math.floor(i/10)*0.12+(i%10)*0.03,0.4)});
      const p1=hf_pop(tt,P.twenty-0.1),p2=hf_pop(tt,P.only-0.1);
      dq_textCard(x,1300,150,540,{kick:"A close look",title:"21 in 100",sub:"records with an error"},{edge:"steel",icon:"lens",on:"granite",k:p1.k,a:p1.a});
      dq_textCard(x,1300,560,540,{kick:"Printed again",title:"41 in 2,031",sub:"certificates"},{edge:"steel",icon:"certificate",on:"granite",k:p2.k,a:p2.a});
      hf_pText(x,"?",1556,500,{size:72,w:700,col:DQ.chalk,p:ag_in(tt,P.only+0.9,0.6)});}},
    // 1899 and 2025 side by side: each puts the rest right at the end, unseen
    {at:P.like,dis:1.0,room:"hfSplit",keys:[[P.like,960,540,1.0]],d:2.0,push:0,draw:(x,tt)=>hf_scr(x,S,()=>hf_split(x,S,tt,P))}
  ]);
  hf_tags(ctx,S,t,[[0.3,"The university · October 2025"],[P.printed,"The Great Hall · December 2025",1.0],[P.hundred,"The quality bench · February 2026",1.0],[P.like,null,1.0]]);});
// 1899 at the left and 2025 at the right, each framed close: Collins at her desk by the window, Malia at her copy; a thin paper line
// between them; "at the end" under each, and both rest under a light veil
function hf_split(ctx,S,t,P){const half=(x0,fn)=>{ctx.save();ctx.beginPath();ctx.rect(x0,0,954,H);ctx.clip();fn();ctx.restore();};
  half(0,()=>{ctx.translate(477,540);ctx.scale(1.5,1.5);ctx.translate(-1560,-560);ctx.drawImage(ag_place("hfRoom"),0,0,W,H);hf_roomLife(ctx,t,{},{clerks:1,basket:1});});
  half(966,()=>{ctx.translate(1443,540);ctx.scale(1.35,1.35);ctx.translate(-660,-560);ctx.drawImage(ag_place("hfOffice"),0,0,W,H);
    hf_offScreen(ctx,1,{ticks:0.6,marks:HF_MARKS.map(m=>[m[0],m[1],1])});hf_office(ctx,t,{col:0});});
  ctx.fillStyle=rgba(DQ.paper,1);ctx.fillRect(954,0,12,H);
  const v=0.22*ag_in(t,P.unseen,1.2);if(v>0){ctx.fillStyle="rgba(244,238,226,"+v+")";ctx.fillRect(0,0,W,H);}
  const ea=ag_in(t,P.end-0.3,0.5);dq_chip(ctx,477,800,"1899 · at the end",{align:"center",a:ea});dq_chip(ctx,1443,800,"2025 · at the end",{align:"center",a:ea});}

/* ---------------------------------------------------------------- 3 · Nobody counts it
   The bench from above. Redman's two teams, drawn in pencil on a sheet, and the room behind the second where it puts right what the
   first made; the page turns to Feigenbaum's line and the second, smaller line that redoes its parts; the page turns again to the
   team's copy, careful and needed; three grey tags (not counted, hidden, never reached), the printer's 41, the cause not reached;
   Redman's advice. */
// a sheet that turns: in from the right at t0, out to the left at t1 (null: it stays); returns its x offset and alpha
const hf_turn=(t,t0,t1)=>{const i=ag_sine((t-t0)/1.0),o=t1==null?0:ag_sine((t-t1)/1.0);return{dx:(1-i)*1500-o*1500,a:i>0&&o<1?1:0};};
scene("hidden",(ctx,S,t,sc)=>{const c=sc.cues,P=hf_once(sc,"P",()=>({red:c.redman,steps:c.steps,one:wAt(sc,"steps","one team"),another:wAt(sc,"steps","another"),
    plant:c.plant,feig:wAt(sc,"plant","Feigenbaum"),hp:wAt(sc,"plant","hidden plant"),needed:c.needed,until:wAt(sc,"needed","until"),three:c.three,
    hours:c.hours,rate:c.rate,printer:wAt(sc,"rate","printer"),past:wAt(sc,"rate","gets past"),cause:c.cause,born:wAt(sc,"cause","born"),advice:c.advice,take:wAt(sc,"advice","take")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"benchTop",keys:[[0,960,540,1.0],[P.needed-0.6,960,540,1.0]],d:2.0,push:0.012,draw:(x,tt)=>{
    // Redman's sheet: two teams, and the room behind the second
    const s1=hf_turn(tt,0.2,P.plant-0.5);if(s1.a>0){x.save();x.translate(s1.dx,0);hf_sheet(x,120,150,1080,640,{rot:-0.006});
      const d=(t0,dd)=>ag_in(tt,t0,dd||1.0);
      hf_pBox(x,200,250,330,170,d(P.red+0.6));hf_pText(x,"Team A",232,316,{p:d(P.red+1.0,0.6)});hf_pText(x,"makes the data",232,366,{size:30,p:d(P.red+1.3,0.8)});
      hf_pLine(x,[[540,335],[770,335]],d(P.red+2.0,0.8),{arrow:20});
      hf_pBox(x,780,250,330,170,d(P.red+2.4));hf_pText(x,"Team B",812,316,{p:d(P.red+2.8,0.6)});hf_pText(x,"uses it",812,366,{size:30,p:d(P.red+3.1,0.6)});
      // the room behind Team B: three steps in it, and its name over the door
      hf_pBox(x,700,520,490,230,d(P.one-0.2,1.2));hf_pLine(x,[[860,420],[860,516]],d(P.one+0.6,0.5),{arrow:16});hf_pLine(x,[[1040,516],[1040,424]],d(P.another,0.5),{arrow:16});
      hf_pText(x,"the hidden data factory",736,576,{size:30,w:700,p:d(P.one+0.2,1.2)});
      hf_pText(x,"find",760,628,{size:30,p:d(P.one+0.6,0.5)});hf_pText(x,"correct",760,676,{size:30,p:d(P.one+1.0,0.5)});hf_pText(x,"deal with what gets past",760,724,{size:30,p:d(P.one+1.4,0.8)});
      x.restore();}
    const p1=hf_pop(tt,P.red+0.3,P.plant-0.5);dq_textCard(x,1290,150,540,{kick:"Thomas Redman",title:"the hidden data factory",sub:"Harvard Business Review, 2016"},{on:"granite",icon:"person",k:p1.k,a:p1.a});
    // Feigenbaum's line, drawn plainly: a line of benches, and in one corner a second, smaller line that redoes the parts
    const s2=hf_turn(tt,P.plant-0.5,P.needed-0.6);if(s2.a>0){x.save();x.translate(s2.dx,0);hf_sheet(x,120,150,1080,640,{rot:0.004});
      const d=(t0,dd)=>ag_in(tt,t0,dd||1.0),bx=[200,370,540,710,880];
      bx.forEach((b,i)=>hf_pBox(x,b,280,120,90,d(P.plant+0.2+i*0.25,0.6)));hf_pLine(x,[[160,325],[1150,325]],d(P.plant+0.4,1.6),{arrow:20});
      hf_pText(x,"the line",200,250,{size:30,p:d(P.plant+0.6,0.6)});
      hf_pLine(x,[[770,375],[770,520]],d(P.hp-0.6,0.5),{arrow:16});hf_pBox(x,560,530,120,80,d(P.hp-0.3,0.5));hf_pBox(x,720,530,120,80,d(P.hp-0.1,0.5));
      hf_pLine(x,[[555,570],[480,570],[480,380]],d(P.hp+0.2,0.7),{arrow:16});hf_pText(x,"redo",880,585,{size:30,w:700,p:d(P.hp,0.6)});
      x.restore();}
    const p2=hf_pop(tt,P.hp-0.4,P.needed-0.6);dq_textCard(x,1290,150,540,{kick:"Armand Feigenbaum",title:"the hidden plant",sub:"Total Quality Control, 1961"},{on:"granite",icon:"person",k:p2.k,a:p2.a});
    // the team's copy: careful and needed; then what it hides
    const s3=hf_turn(tt,P.needed-0.6,null);if(s3.a>0){x.save();x.translate(s3.dx,0);
      const B=hf_copy(x,100,150,880,{title:"December 2025",on:"granite",ticks:1,fix:{"0,2":1,"1,1":1,"1,2":1,"3,2":1}});
      // the printer sees only what gets past: the cells put right stay behind a pale veil
      const va=0.86*ag_in(tt,P.past-0.4,0.8);if(va>0){x.fillStyle="rgba(232,226,212,"+va+")";for(const r of [0,1,3])x.fillRect(B.x+24+56+184+2,B.row(r)-26,536,52);}
      x.restore();
      const p3=hf_pop(tt,P.needed+0.2,P.three-0.3);dq_textCard(x,1180,170,560,{kick:"Careful work",title:"needed",sub:"until the errors stop"},{on:"granite",k:p3.k,a:p3.a});
      const tag=(t0,y,text)=>{const a=ag_in(tt,t0,0.5);if(a>0)dq_tag(x,1060,y,"none",{to:[984,y-34],text,k:ag_in(tt,t0,0.9),a,on:"granite",angle:0.02});};
      tag(P.hours,320,"HOURS · NOT COUNTED");tag(P.rate,440,"HOW GOOD · HIDDEN");tag(P.cause,560,"CAUSE · NOT REACHED");
      const p4=hf_pop(tt,P.printer-0.2);dq_textCard(x,1540,404,340,{kick:"Printer",title:"41 reprints"},{edge:"steel",icon:"printer",on:"granite",k:p4.k,a:p4.a});
      // where the errors are born: a card that isn't there, and a chalk line towards it that never arrives
      const da=ag_in(tt,P.born-0.6,0.6);if(da>0){dq_card(x,100,680,520,96,{dash:true,on:"granite",a:da});dq_T(x,"where the errors are born",128,740,{w:700,size:32,dark:true,col:DQ.chalkSoft,a:da});
        x.save();x.setLineDash([10,12]);hf_pLine(x,[[360,610],[360,672]],ag_in(tt,P.born-0.4,0.8)*0.55,{col:DQ.chalkSoft,lw:3});x.restore();}
      const p5=hf_pop(tt,P.advice+0.2);dq_textCard(x,1000,668,820,{kick:"Redman's advice",title:"Count it",sub:"then take it to the people who make the data"},{on:"granite",icon:"count",k:p5.k,a:p5.a});}}}]);});

/* ---------------------------------------------------------------- 4 · Count it
   The bench, August 2026: Noor and Malia, and the three ways. The bench from above: the team's calendar and its hours as bars; the
   platform's system tables, the query history and the audit log on three Mondays; the list against the copy, the names changed by
   hand counted, and those that got past; two stopwatches, and December's hours split; the rule of ten. */
const HF_QH=[["Mon 20 Oct 2025","graduations team","select … from mart_graduations__graduation_list"],["Mon 23 Feb 2026","graduations team","select … from mart_graduations__graduation_list"],["Mon 8 Jun 2026","graduations team","select … from mart_graduations__graduation_list"]];
const HF_AU=[["Mon 20 Oct 2025","databrickssql","downloadQueryResult"],["Mon 23 Feb 2026","databrickssql","downloadQueryResult"],["Mon 8 Jun 2026","databrickssql","downloadQueryResult"]];
const HF_FIX=[["out of capitals","312","26 with accents too"],["accents put back","129",""],["cut names written in full","32",""],["given and family put back in order","30",""],["spellings","14",""]];
scene("count",(ctx,S,t,sc)=>{const c=sc.cues,P=hf_once(sc,"P",()=>({three:wAt(sc,"august","three ways"),noor:wAt(sc,"august","Noor"),malia:wAt(sc,"august","Malia"),
    cal:c.cal,dec:wAt(sc,"cal","two hundred"),mar:wAt(sc,"cal","fifty"),jul:wAt(sc,"cal","thirty"),year:c.year,months:wAt(sc,"year","two months"),
    rounds:c.rounds,query:c.query,audit:wAt(sc,"query","audit log"),mondays:wAt(sc,"query","three Mondays"),copy:c.copy,night:wAt(sc,"copy","the list the platform"),
    changed:c.changed,more:wAt(sc,"changed","twenty-six"),again:wAt(sc,"changed","printed again"),quarter:c.quarter,four:wAt(sc,"quarter","one in four"),
    minutes:c.minutes,wrong1:wAt(sc,"minutes","A wrong one"),find:wAt(sc,"minutes","find"),wrong:c.wrong,ten:c.ten,thumb:wAt(sc,"ten","rule of thumb")}));
  ag_shots(ctx,S,t,sc.dur,[
    // the bench: Noor and Malia, and the three ways they count it
    {at:0,place:"bench",keys:[[0,960,540,1.0]],d:2.0,push:0.02,draw:(x,tt)=>{
      dq_person(x,"noor",330,590,0.98,{t:tt,cut:DQ_BENCH.back,gaze:[4,2],nod:0.04});dq_person(x,"malia",1600,590,0.98,{t:tt+1.1,flip:true,cut:DQ_BENCH.back,gaze:[-4,2],nod:0.03});
      dq_nameTag(x,500,300,"noor",{a:ag_in(tt,P.noor-0.3,0.5)});dq_nameTag(x,1420,300,"malia",{align:"right",a:ag_in(tt,P.malia-0.2,0.5)});
      [["the hours","calendar"],["the rounds","table"],["the corrections","sheet"]].forEach(([w_,ic],i)=>dq_chip(x,960,470+i*76,w_,{icon:ic,col:"steel",align:"center",a:ag_in(tt,P.three-0.2+i*0.3,0.4)}));}},
    // the bench from above
    {at:c.cal-0.5,dis:1.0,place:"benchTop",keys:[[c.cal-0.5,960,540,1.0]],d:2.0,push:0.01,draw:(x,tt)=>{
      // the hours: the calendar's round, then a bar for each list, then the year
      const g1=hf_turn(tt,c.cal-0.5,P.rounds-0.6);if(g1.a>0){x.save();x.translate(g1.dx,0);
        hf_cal(x,100,120,ag_in(tt,c.cal+0.6,2.4),{on:"granite"});
        const yr=ag_sine((tt-P.year+0.2)/1.2),bar=(i,yy,h_,label,t0)=>{const k=ag_eo((tt-t0)/1.1);if(k<=0)return;const y_=lerp(yy,640,yr),x_=1000+(i===1?600*yr:i===2?725*yr:0);
          x.fillStyle=rgba(DQ.steel,1);rr(x,x_,y_,Math.max(2,h_*2.5*k),48,6);x.fill();if(yr<0.5)dq_T(x,label,1000,yy-16,{w:700,size:30,dark:true,col:"steel",a:ag_in(tt,t0+0.4,0.4)*(1-ag_in(yr,0,0.4))});};
        bar(0,200,240,"December · about 240 h",P.dec-0.4);bar(1,370,50,"March · 50 h",P.mar-0.3);bar(2,500,30,"July · 30 h",P.jul-0.3);
        const ya=ag_in(tt,P.year+0.6,0.5);if(ya>0){dq_T(x,"320 h a year",1000,622,{w:800,size:34,dark:true,col:"steel",a:ya});
          const p=hf_pop(tt,P.months-0.2);dq_textCard(x,1000,740,800,{title:"about two months of one person's work"},{edge:"steel",icon:"person",on:"granite",k:p.k,a:p.a});}
        x.restore();}
      // the rounds: the platform's system tables, the same query and its result downloaded, on three Mondays
      const g2=hf_turn(tt,P.rounds-0.6,c.copy-0.6);if(g2.a>0){x.save();x.translate(g2.dx,0);
        dq_window(x,100,110,1720,690,{logo:"databricks",product:"Databricks",title:"System tables",on:"granite",draw:(cc,b)=>{
          dq_T(cc,"system.query.history",b.x+14,b.y+34,{w:600,size:30,f:"mono"});
          dq_rows(cc,b.x,b.y+56,[{h:"start_time",w:300},{h:"executed_by",w:340,},{h:"statement_text",w:1000,f:"mono"}],HF_QH,{rh:52,lit:[0,1,2].filter(i=>tt>P.query+0.6+i*0.6),litCol:"steel",rowA:(r,i)=>ag_in(tt,P.query+0.2+i*0.6,0.4)});
          dq_T(cc,"system.access.audit",b.x+14,b.y+318,{w:600,size:30,f:"mono",a:ag_in(tt,P.audit-0.4,0.4)});
          dq_rows(cc,b.x,b.y+340,[{h:"event_date",w:300},{h:"service_name",w:340,f:"mono"},{h:"action_name",w:600,f:"mono"}],HF_AU,{rh:52,a:ag_in(tt,P.audit-0.4,0.4),lit:[0,1,2].filter(i=>tt>P.audit+0.4+i*0.6),litCol:"steel",rowA:(r,i)=>ag_in(tt,P.audit+i*0.6,0.4)});}});
        const p=hf_pop(tt,P.mondays);dq_chip(x,1560,744,"3 Mondays · 3 rounds",{icon:"calendar",col:"steel",align:"center",a:p.a});
        x.restore();}
      // the corrections: the list against the copy, the names changed by hand counted, those that got past; one in four
      const g3=hf_turn(tt,c.copy-0.6,P.minutes-0.6);if(g3.a>0){x.save();x.translate(g3.dx,0);
        hf_twoLists(x,100,90,{on:"granite",scan:ag_in(tt,P.changed-0.6,2.4),past:ag_in(tt,P.more,0.5)});
        const n=Math.round(517*ag_in(tt,P.changed-0.6,2.6)),fa=ag_io(tt,P.changed+0.6,P.quarter-0.4,0.5);
        if(fa>0){dq_card(x,100,600,900,270,{on:"granite",a:fa});x.save();x.globalAlpha*=fa;HF_FIX.forEach((r,i)=>{const yy=642+i*48;dq_T(x,r[0],128,yy,{w:600,size:28,col:DQ.ink});
          dq_T(x,r[1],690,yy,{w:700,size:30,f:"mono",col:"steel",align:"right"});if(r[2])dq_T(x,r[2],712,yy,{w:500,size:28,col:DQ.soft});});x.restore();}
        const p1=hf_pop(tt,P.changed-0.6,P.quarter-0.4);dq_textCard(x,1030,600,430,{kick:"Changed by hand",title:String(n)},{edge:"steel",icon:"sheet",on:"granite",k:p1.k,a:p1.a});
        const p2=hf_pop(tt,P.more,P.quarter-0.4);dq_textCard(x,1490,600,350,{kick:"Got past",title:"26",sub:"printed again"},{edge:"steel",icon:"printer",on:"granite",k:p2.k,a:p2.a});
        const p3=hf_pop(tt,P.quarter+0.2);dq_textCard(x,100,620,900,{kick:"Wrong when the list left the platform",title:"543 of 2,031",sub:"about 1 in 4"},{edge:"steel",icon:"count",on:"granite",k:p3.k,a:p3.a});
        const p4=hf_pop(tt,P.four);dq_textCard(x,1040,620,440,{kick:"Printed again",title:"41"},{edge:"steel",icon:"certificate",on:"granite",k:p4.k,a:p4.a});
        x.restore();}
      // two stopwatches, and December's 240 hours split; the rule of ten
      const g4=hf_turn(tt,P.minutes-0.6,null);if(g4.a>0){x.save();x.translate(g4.dx,0);
        hf_watch(x,560,370,130,2,{u:ag_in(tt,P.minutes+0.2,1.0)});hf_watch(x,1360,370,130,20,{u:ag_in(tt,P.wrong1,1.6)});
        dq_T(x,"right name · about 2 min",560,566,{w:700,size:30,dark:true,col:DQ.chalk,align:"center",a:ag_in(tt,P.minutes+0.6,0.5)});
        dq_T(x,"wrong name · about 20 min",1360,566,{w:700,size:30,dark:true,col:DQ.chalk,align:"center",a:ag_in(tt,P.wrong1+0.4,0.5)});
        dq_T(x,"find · phone · type again",1360,608,{w:600,size:28,dark:true,col:DQ.chalkSoft,align:"center",a:ag_in(tt,P.find,0.5)});
        const sa=ag_in(tt,P.wrong-0.2,0.6);if(sa>0){const X0=260,k=1400/240,seg=[[50,0.45,"1,514 right names · about 50 h"],[170,1,"517 wrong names · about 170 h"],[20,0.25,"calls and callbacks · the rest"]];let xx=X0;
          seg.forEach(([hrs,al,label],i)=>{const ww=hrs*k*ag_eo((tt-P.wrong+0.2-i*0.5)/1.0);if(ww<=0)return;x.fillStyle=rgba(DQ.steel,al*sa);rr(x,xx,700,Math.max(2,ww-4),50,6);x.fill();
            const la=ag_in(tt,P.wrong+0.4+i*0.5,0.5)*sa;if(la>0){if(i===0)dq_T(x,label,X0,680,{w:600,size:28,dark:true,col:DQ.chalk,a:la});else if(i===1)dq_T(x,label,X0+50*k,792,{w:700,size:30,dark:true,col:"steel",a:la});else dq_T(x,label,X0+1400,680,{w:600,size:28,dark:true,col:DQ.chalkSoft,align:"right",a:la});}
            xx+=hrs*k;});}
        x.restore();
        const p=hf_pop(tt,P.ten+0.2);dq_textCard(x,560,24,800,{kick:"Redman's rule of ten",title:"about ten times the work",sub:"a rule of thumb"},{icon:"clock",on:"granite",k:p.k,a:p.a});}}}
  ]);
  hf_tags(ctx,S,t,[[0.3,"The quality bench · August 2026"],[c.cal-0.5,null,1.0]]);});

/* ---------------------------------------------------------------- 5 · Cut short again
   The bench from above: Beatriz's name as she writes it, in brass, and its 33 characters measured; her two graduations; the portal in
   February, her name cut short, and her correction; March's certificate, right; December's list in August, cut again, and the list's
   check holds it. The bench: Noor, Jun, Mei and Malia ask why. From above again: the student system's record and the five whys, each
   a step back, and the two causes; Unity Catalog's lineage, the same path, column by column. The bench: what the platform can't see,
   before it and after it. */
const HF_WHY=[["Why is it cut?","The list takes the student system's name, unless she confirms it"],
  ["Why is it still cut there?","Her correction went to March's list, not to the student system"],
  ["Why?","Only the registrar's office changes it, and nothing sent it there"],
  ["Why was it cut at all?","The family name field holds 30 characters"],
  ["Why 30?","Set when the system was built: it fitted most names then"]];
const HF_NAME="Fonseca de Albuquerque Cavalcanti",HF_CUT="Fonseca de Albuquerque Cavalca";
scene("back",(ctx,S,t,sc)=>{const c=sc.cues,P=hf_once(sc,"P",()=>({march:wAt(sc,"beatriz","March"),decm:wAt(sc,"beatriz","December"),
    c33:wAt(sc,"long","thirty-three"),feb:c.feb,cut:wAt(sc,"feb","cut short"),corr:wAt(sc,"feb","corrected"),cert:wAt(sc,"feb","March's certificate"),
    joins:wAt(sc,"cutagain","December's list"),again:wAt(sc,"cutagain","cut short again"),
    ask:c.ask,mei:wAt(sc,"ask","Mei"),malia:wAt(sc,"ask","Malia"),noor:wAt(sc,"ask","Noor"),jun:wAt(sc,"ask","Jun"),
    why:[1,2,3,4,5].map(i=>c["why"+i]),ans:[wAt(sc,"why1","The list"),wAt(sc,"why2","Her correction"),wAt(sc,"why3","Only"),wAt(sc,"why4","The family"),wAt(sc,"why5","It was set")],
    f30:wAt(sc,"why4","thirty"),causes:c.causes,field:wAt(sc,"causes","a field"),noway:wAt(sc,"causes","no way back"),
    lin:c.lineage,col:wAt(sc,"lineage","column by column"),path:c.path,tell:c.tell,after:wAt(sc,"tell","after it"),people:wAt(sc,"tell","people")}));
  ag_shots(ctx,S,t,sc.dur,[
    // the bench from above: her name, its length, her two graduations; the portal, the certificate; December's list
    {at:0,place:"benchTop",later:true,dis:0.7,keys:[[0,960,540,1.0]],d:2.0,push:0.012,draw:(x,tt)=>{
      const p0=hf_pop(tt,c.beatriz+0.1),B=dq_textCard(x,100,80,880,{kick:"Beatriz · as she writes it",title:HF_NAME},{edge:"brass",mono:true,on:"granite",k:p0.k,a:p0.a});
      const rx1=128+dq_tw(x,HF_NAME,{w:700,size:36,f:"mono"}),ry=B.y+B.h+22;hf_ruler(x,128,rx1,ry,ag_in(tt,c.long+0.2,1.4));
      const ta=ag_in(tt,P.c33-0.3,0.4);if(ta>0)dq_tag(x,rx1,ry+66,"steel",{to:[rx1,ry],text:"33 CHARACTERS",k:ag_in(tt,P.c33-0.3,0.9),a:ta,on:"granite",flip:true,angle:0.03});
      // her two graduations this year
      dq_chip(x,1060,120,"March · graduate certificate",{icon:"cap",a:ag_in(tt,P.march-0.3,0.4)});dq_chip(x,1060,196,"December · master's",{icon:"cap",a:ag_in(tt,P.decm-0.3,0.4)});
      // February: the portal shows her name cut short; she presses "This isn't my name" and writes it in full
      const pp=hf_pop(tt,P.feb-0.3,P.cert+0.2);hf_portal(x,1020,290,820,{title:"February 2026",name:"Beatriz "+HF_CUT,add:HF_NAME.slice(HF_CUT.length),tu:ag_in(tt,P.corr-0.3,0.9),press:2,pu:ag_in(tt,P.cut+0.3,0.4),on:"granite",k:pp.k,a:pp.a});
      // March: the certificate, her name in full, once the portal has gone
      const pc=hf_pop(tt,P.cert+0.6);dq_textCard(x,1020,300,820,{kick:"MAR26-2 · Certificate",title:"Beatriz "+HF_NAME,sub:"Graduate Certificate in Data Analytics"},{icon:"certificate",on:"granite",k:pc.k,a:pc.a});
      // August: her master's joins December's list, cut short again; the list's check holds it
      const pr=hf_pop(tt,P.joins-0.4),R=dq_record(x,100,380,860,{head:"December's list",id:"S-19733",rows:[{k:"ceremony_id",v:"DEC26-4"},{k:"award_name",v:"Master of Data Analytics"},{k:"family_name",v:HF_CUT}]},{on:"granite",k:pr.k,a:pr.a,lit:tt>P.again?[2]:[]});
      const ha=ag_in(tt,P.again+0.2,0.4);if(ha>0)dq_tag(x,R.x+R.w-40,R.rows[2].cy+120,"hold",{to:[R.x+R.w-40,R.rows[2].cy+16],text:"HOLD · MAY BE CUT SHORT",k:ag_in(tt,P.again+0.2,0.9),a:ha,on:"granite",flip:true,angle:0.03});}},
    // the bench: Noor, Jun, Mei and Malia ask why
    {at:P.ask-0.5,dis:1.0,place:"bench",keys:[[P.ask-0.5,960,540,1.0]],d:2.0,push:0.02,draw:(x,tt)=>{
      const cast=[["noor",300,false,P.noor],["jun",740,false,P.jun],["mei",1180,true,P.mei],["malia",1620,true,P.malia]];
      cast.forEach(([who,px,fl],i)=>dq_person(x,who,px,600,0.9,{t:tt+i*0.7,flip:fl,cut:DQ_BENCH.back,gaze:[fl?-4:4,2],nod:0.03}));
      cast.forEach(([who,px,fl,tw])=>dq_nameTag(x,px,236,who,{align:"center",a:ag_in(tt,tw-0.3,0.5)}));}},
    // from above: the student system's record, and the five whys, each a step back from the list; the two causes
    {at:P.why[0]-0.6,dis:1.0,place:"benchTop",keys:[[P.why[0]-0.6,960,540,1.0]],d:2.0,push:0.01,draw:(x,tt)=>{
      const pr=hf_pop(tt,P.ans[0]+0.6),R=dq_record(x,60,30,780,{head:"Student system",id:"S-19733",rows:[{k:"given_name",v:"Beatriz"},{k:"family_name",v:HF_CUT}]},{on:"granite",k:pr.k,a:pr.a});
      // the field, drawn to its size: the name ends where the box does; its measure in steel
      const lab=Math.max(dq_tw(x,"given_name",{w:600,size:28}),dq_tw(x,"family_name",{w:600,size:28}))+30,vx=R.x+DQ_PAD+lab,vw=dq_tw(x,HF_CUT,{w:500,size:30,f:"mono"}),cy=R.rows[1].cy;
      if(pr.a>0.5){hf_pBox(x,vx-8,cy-24,vw+16,48,ag_in(tt,P.f30-0.9,1.0));const fa=ag_in(tt,P.f30-0.2,0.4);if(fa>0)dq_tag(x,vx+vw+8,R.y+R.h+54,"steel",{to:[vx+vw+8,cy+24],text:"30",k:ag_in(tt,P.f30-0.2,0.9),a:fa,on:"granite",flip:true,angle:0.03});}
      P.why.forEach((t0,i)=>{const nx=i<4?P.why[i+1]:P.causes,p=hf_pop(tt,t0-0.2);
        hf_why(x,1100-235*i,26+168*i,780,HF_WHY[i][0],HF_WHY[i][1],{on:"granite",k:p.k,a:p.a,ansA:ag_in(tt,P.ans[i]-0.2,0.5),back:ag_in(tt,nx-0.4,0.6)});});
      // two causes: a field too short, and no way back
      const c1=hf_pop(tt,P.field-0.2),c2=hf_pop(tt,P.noway-0.2);
      dq_textCard(x,1260,572,580,{kick:"Cause",title:"a field too short"},{on:"granite",icon:"flag",k:c1.k,a:c1.a});dq_textCard(x,1260,732,580,{kick:"Cause",title:"no way back"},{on:"granite",icon:"flag",k:c2.k,a:c2.a});}},
    // Unity Catalog's lineage: the same path, column by column, from the list's family_name back to the student system's
    {at:P.lin-0.6,place:"benchTop",later:true,dis:0.6,keys:[[P.lin-0.6,960,540,1.0]],d:2.0,push:0.01,draw:(x,tt)=>{
      const pl=hf_pop(tt,P.lin+0.1);hf_lineage(x,60,130,{on:"granite",k:pl.k,a:pl.a,lit:ag_sine((tt-P.col+0.3)/(P.path+3.4-P.col))});}},
    // the bench: what the platform can't see, the forms before it and the copy and the printer after it; people have to tell you
    {at:P.tell-0.6,dis:1.0,place:"bench",keys:[[P.tell-0.6,960,540,1.0]],d:2.0,push:0.02,draw:(x,tt)=>{
      dq_person(x,"mei",330,600,0.94,{t:tt,cut:DQ_BENCH.back,gaze:[4,2],nod:0.03});dq_person(x,"malia",1600,600,0.94,{t:tt+1.1,flip:true,cut:DQ_BENCH.back,gaze:[-4,2],nod:0.03});
      const ia=k=>ag_in(tt,P.tell-0.3+k*0.22,0.4);
      hf_pill(x,250,150,"paper forms",{icon:"form",dash:true,a:ia(0)});hf_pill(x,560,150,"online form",{icon:"form",dash:true,a:ia(1)});hf_pill(x,960,150,"the platform",{icon:"table",a:ia(2)});
      hf_pill(x,1360,150,"spreadsheet",{icon:"sheet",dash:true,a:ia(3)});hf_pill(x,1660,150,"printer",{icon:"printer",dash:true,a:ia(4)});
      hf_pLine(x,[[700,150],[812,150]],ag_in(tt,P.tell+0.1,0.5),{arrow:16,col:DQ.soft});hf_pLine(x,[[1108,150],[1220,150]],ag_in(tt,P.tell+0.5,0.5),{arrow:16,col:DQ.soft});
      dq_T(x,"before",405,226,{w:700,size:28,col:DQ.soft,align:"center",a:ag_in(tt,P.tell+0.2,0.5)});dq_T(x,"after",1510,226,{w:700,size:28,col:DQ.soft,align:"center",a:ag_in(tt,P.after-0.2,0.5)});
      const p=hf_pop(tt,P.people-0.2);dq_textCard(x,650,420,620,{title:"people have to tell you"},{icon:"people",k:p.k,a:p.a});}}
  ]);});

/* ---------------------------------------------------------------- 6 · Four bones
   A large sheet on the bench: the fishbone drawn in pencil as it's said, and Ishikawa's card; the four bones; the camera goes to each
   bone in turn as its causes land, each a card pinned to it with its count in steel; then it eases back, and a line along the spine. */
scene("bones",(ctx,S,t,sc)=>{const c=sc.cues,P=hf_once(sc,"P",()=>({draws:wAt(sc,"fish","draws"),ish:wAt(sc,"fish","Kaoru Ishikawa"),prob:wAt(sc,"fish","the problem"),
    bp:wAt(sc,"four","people"),bpr:wAt(sc,"four","process"),bs:wAt(sc,"four","systems"),bi:wAt(sc,"four","interfaces"),where:wAt(sc,"four","where data"),
    paper:wAt(sc,"people","paper forms"),n35:wAt(sc,"people","thirty-five"),every:wAt(sc,"process","every fix"),
    field:wAt(sc,"systems","the thirty-character"),n39:wAt(sc,"systems","thirty-nine"),until:wAt(sc,"systems","until"),n312:wAt(sc,"systems","three hundred"),
    nightly:wAt(sc,"inter","the nightly"),each:wAt(sc,"nobody","Each cause")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"benchTop",keys:[[0,960,540,1.0],[c.people-0.9,740,400,1.4],[c.process-0.7,1182,415,1.3],[c.systems-0.7,740,640,1.4],[c.inter-0.7,1182,665,1.3],[c.nobody-0.3,960,540,1.0]],d:1.8,push:0,draw:(x,tt)=>{
    const g=(t0,d)=>ag_in(tt,t0,d||1.0);
    hf_fishbone(x,{spine:g(P.draws-0.2,2.0),head:g(P.prob-0.3,0.6),bones:{people:g(P.bp-0.3),process:g(P.bpr-0.3),systems:g(P.bs-0.3),interfaces:g(P.bi-0.3)},note:g(P.where-0.2,1.4),
      cards:{pa:g(P.paper-0.4),pb:g(P.n35+0.5),pr:g(P.every-0.4),sa:g(P.field-0.4),sb:g(P.until-0.3),in:g(P.nightly-0.4)},
      counts:{pa:g(P.n35-0.2,0.5),pb:g(P.n35+1.0,0.5),sa:g(P.n39-0.2,0.5),sb:g(P.n312-0.2,0.5),in:g(c.accents-0.1,0.5)},line:g(P.each-0.3,2.4)});
    const pi=hf_pop(tt,P.ish-0.2,c.four-0.3);dq_textCard(x,1400,90,460,{kick:"Kaoru Ishikawa",title:"cause and effect",sub:"Guide to Quality Control"},{icon:"person",k:pi.k,a:pi.a});}}]);});

/* ---------------------------------------------------------------- 7 · Where it's born
   The fishbone under a dark veil, and the card of Fixed where it starts; each cause gets its owner. The bench at night, Monday 14
   September: Sam, the nightly file that keeps every letter, Beatriz's field from 30 to 100. The bench by day: a correction goes from
   Malia to Mei's office, made once in the student system; the copy goes; old names, as each graduate confirms. Jun and the checks in
   dbt, each with its level. From above: the names held for Mei's office, a list to work through; a night's file losing its letters,
   stopped, the list keeping the night before's names, and Sam told; the two levels side by side. */
const HF_FB_DONE={spine:1,head:1,bones:{people:1,process:1,systems:1,interfaces:1},note:1,cards:{pa:1,pb:1,pr:1,sa:1,sb:1,in:1},line:1};
const HF_HELD=[{k:"S-19733",v:"Fonseca de Albuquerque Cavalca",mark:"hold"},{k:"S-19655",v:"Venkatasubramanian Gopalakrish",mark:"hold"},{k:"S-17090",v:"NOVAK",mark:"hold"},{k:"S-16702",v:"O'CONNELL",mark:"hold"},{k:"S-17305",v:"MARQUES",mark:"hold"}];
const HF_DEC=[["Joaquin Ibanez","Joaquín Ibáñez"],["Zoe Marchand","Zoé Marchand"],["Ana Lucia Brandao","Ana Lúcia Brandão"],["Therese Lavoie","Thérèse Lavoie"]];
scene("born",(ctx,S,t,sc)=>{const c=sc.cues,P=hf_once(sc,"P",()=>({owner:wAt(sc,"fixed","with its owner"),team:wAt(sc,"night","the student system team"),sam:wAt(sc,"night","Sam"),
    keeps:wAt(sc,"file","keeps every letter"),field:wAt(sc,"file","family name field"),hundred:wAt(sc,"file","a hundred"),
    once:wAt(sc,"mei","made once"),office:wAt(sc,"mei","Mei's office"),nocopy:wAt(sc,"mei","keeps no copy"),confirms:wAt(sc,"old","confirms"),first:wAt(sc,"old","graduating first"),
    dbt:wAt(sc,"jun","in dbt"),records:wAt(sc,"jun","on the student"),nightly:wAt(sc,"jun","each night"),owned:wAt(sc,"jun","owned by Mei"),
    caps:wAt(sc,"hold","or in capitals"),holds:wAt(sc,"hold","holds for"),list:wAt(sc,"hold","a list"),
    stops:wAt(sc,"stop","stops the update"),keepsN:wAt(sc,"stop","the list keeps"),told:wAt(sc,"stop","Sam is told"),file2:wAt(sc,"levels","a file losing")}));
  ag_shots(ctx,S,t,sc.dur,[
    // the fishbone: the film before, then each cause's owner
    {at:0,place:"benchTop",keys:[[0,960,540,1.0]],d:2.0,push:0,draw:(x,tt)=>{
      const ow=k=>ag_in(tt,P.owner-0.2+["pr","sa","in","pa","pb","sb"].indexOf(k)*0.22,0.4);
      hf_fishbone(x,Object.assign({},HF_FB_DONE,{owners:{pa:ow("pa"),pb:ow("pb"),pr:ow("pr"),sa:ow("sa"),sb:ow("sb"),in:ow("in")}}));
      const v=ag_io(tt,c.fixed-0.2,P.owner-0.3,0.5);if(v>0){x.fillStyle="rgba(26,22,20,"+(0.55*v)+")";x.fillRect(0,0,W,H);}
      const p=hf_pop(tt,c.fixed,P.owner-0.3);dq_textCard(x,620,390,680,{kick:"Governance principles",title:"Fixed where it starts",sub:"fix it where it starts, with its owner"},{on:"granite",k:p.k,a:p.a});}},
    // the bench at night: Sam with the student system team; the nightly file keeps every letter; the field holds 100
    {at:c.night-0.4,dis:1.0,place:"hf_dusk",keys:[[c.night-0.4,960,540,1.0]],d:2.0,push:0.02,draw:(x,tt)=>{
      dq_lamp(x,640,210,0.9,{on:1});
      dq_person(x,"sam",330,600,0.94,{t:tt,cut:DQ_BENCH.back,gaze:[4,2],nod:0.03});dq_nameTag(x,520,330,"sam",{dark:true,a:ag_in(tt,P.sam-0.3,0.5)});
      dq_chip(x,1300,96,"student system team · with Sam",{icon:"people",align:"center",a:ag_in(tt,P.team-0.2,0.5)});
      // the nightly file, between the student system and the platform: a letter with its accent goes through it, and stays
      const fa=ag_in(tt,P.keeps-0.8,0.5);if(fa>0){hf_pill(x,930,214,"student system",{icon:"table",a:fa});hf_pill(x,1690,214,"the platform",{icon:"table",a:fa});
        hf_pLine(x,[[1060,214],[1146,214]],fa,{col:DQ.chalkSoft,arrow:14});hf_pLine(x,[[1458,214],[1544,214]],fa,{col:DQ.chalkSoft,arrow:14});
        dq_textCard(x,1158,148,290,{kick:"Nightly file",title:"every letter"},{a:fa});
        const u=(tt-P.keeps+0.2)/2.2,lx=u<0.5?lerp(960,1300,ag_sine(u/0.5)):lerp(1300,1660,ag_sine((u-0.5)/0.5)),la=ag_io(tt,P.keeps-0.2,P.keeps+2.2,0.3);
        if(la>0){x.save();x.globalAlpha*=la;x.fillStyle=rgba(DQ.paper,1);x.beginPath();x.arc(lx,290,34,0,TAU);x.fill();x.strokeStyle=rgba(DQ.ink,0.6);x.lineWidth=2;x.stroke();dq_T(x,"é",lx,303,{w:800,size:40,align:"center"});x.restore();}}
      // Beatriz's record: the family name field, its box drawn to its size, made longer; its measure from 30 to 100
      const ra=ag_in(tt,P.field-0.6,0.5),R=dq_record(x,780,430,1060,{head:"Student system",id:"S-19733",rows:[{k:"family_name",v:HF_CUT}]},{fixed:true,a:ra});
      if(ra>0){const vx=R.x+DQ_PAD+dq_tw(x,"family_name",{w:600,size:28})+30,vw=dq_tw(x,HF_CUT,{w:500,size:30,f:"mono"}),cy=R.rows[0].cy,gw=ag_sine((tt-P.hundred+0.3)/1.6),bx1=lerp(vx+vw+8,R.x+R.w-24,gw);
        x.save();x.globalAlpha*=ra;hf_pBox(x,vx-8,cy-24,bx1-vx+8,48,1);x.restore();
        const t30=ra*(1-ag_in(tt,P.hundred-0.1,0.4)),t100=ag_in(tt,P.hundred+0.2,0.4);
        if(t30>0)dq_tag(x,bx1,R.y+R.h+56,"steel",{to:[bx1,cy+24],text:"30",a:t30,flip:true,angle:0.03});if(t100>0)dq_tag(x,bx1,R.y+R.h+56,"steel",{to:[bx1,cy+24],text:"100",a:t100,flip:true,angle:0.03});}}},
    // the bench by day: a correction goes from Malia to Mei's office, made once in the student system; the copy goes; old names
    {at:c.mei-0.6,dis:1.0,place:"bench",keys:[[c.mei-0.6,960,540,1.0]],d:2.0,push:0.02,draw:(x,tt)=>{
      dq_person(x,"mei",330,600,0.94,{t:tt,cut:DQ_BENCH.back,gaze:[4,2],nod:0.03});dq_person(x,"malia",1600,600,0.94,{t:tt+1.1,flip:true,cut:DQ_BENCH.back,gaze:[-4,2],nod:0.03});
      dq_nameTag(x,520,330,"mei",{a:ag_in(tt,c.mei,0.5)});dq_nameTag(x,1420,330,"malia",{align:"right",a:ag_in(tt,c.mei+0.3,0.5)});
      // the student system, at Mei's office: the correction goes in, made once
      const sa=ag_in(tt,c.mei+0.4,0.5);dq_textCard(x,96,90,520,{kick:"Student system",title:ag_in(tt,P.once-0.2,0.3)>0.5?"made once":" "},{icon:"table",a:sa});
      // the copy at the graduations office: it goes
      const ca=ag_in(tt,c.mei+0.4,0.5)*(1-ag_in(tt,P.nocopy-0.2,0.8));if(ca>0)dq_textCard(x,1304,90,520,{kick:"Spreadsheet",title:"the copy"},{icon:"sheet",a:ca});
      const na=ag_in(tt,P.nocopy+0.2,0.5);if(na>0){dq_card(x,1304,90,520,142,{dash:true,a:na});dq_T(x,"no copy",1332,180,{w:700,size:32,col:DQ.soft,a:na});}
      // a correction: from Malia's side to Mei's, then up into the student system
      const u=(tt-c.mei-0.6)/(P.once-c.mei-0.2);if(u>0&&u<1.25){const k=ag_sine(u),px=lerp(1380,560,k),py=u<1?470:lerp(470,200,ag_sine((u-1)/0.25));
        dq_chip(x,px,py,"a correction",{icon:"form",align:"center",a:ag_in(u,0,0.1)*(1-ag_in(u,1.15,0.1))});}
      // old names, put right as each graduate confirms theirs, those graduating first
      const p=hf_pop(tt,c.old-0.2);dq_textCard(x,650,470,620,{kick:"Old names",title:"put right as each graduate confirms",sub:"those graduating first"},{icon:"list",k:p.k,a:p.a});}},
    // Jun and the checks in dbt, where the names are born: each night, owned by Mei; two hold, one stops
    {at:c.jun-0.6,place:"bench",later:true,dis:0.6,keys:[[c.jun-0.6,960,540,1.0]],d:2.0,push:0.02,draw:(x,tt)=>{
      dq_person(x,"jun",330,600,0.94,{t:tt,cut:DQ_BENCH.back,gaze:[4,2],nod:0.03});dq_nameTag(x,96,170,"jun",{a:ag_in(tt,c.jun,0.5)});
      const wa=hf_pop(tt,P.dbt-0.4);dq_window(x,780,70,1080,720,{logo:"dbt",product:"dbt",title:"tests/rules/_rules__tests.yml",k:wa.k,a:wa.a,draw:(cc,b)=>{
        dq_T(cc,"# each night, on stg_student_system__graduations",b.x+8,b.y+34,{w:500,size:28,f:"mono",col:DQ.soft,a:ag_in(tt,P.records-0.2,0.5)});
        dq_code(cc,b.x+8,b.y+56,HF_YML,{lh:44,lit:tt>P.owned?[3,7,11]:[],w:b.w-16,lineA:(ln,i)=>ag_in(tt,P.dbt+0.2+Math.floor(i/4)*0.5,0.4)});}});
      const tg=(i,v,t0)=>{const a=ag_in(tt,t0,0.4);if(a>0)dq_tag(x,1500,70+68+18+56+i*176+110,v,{to:[1440,70+68+18+56+i*176+110],a,k:ag_in(tt,t0,0.9),angle:0.03});};
      tg(0,"hold",P.dbt+0.8);tg(1,"hold",P.dbt+1.3);tg(2,"stop",P.dbt+1.8);}},
    // from above: the names held for Mei's office; a night's file that lost its letters, stopped; the two levels
    {at:c.hold-0.6,dis:1.0,place:"benchTop",keys:[[c.hold-0.6,960,540,1.0]],d:2.0,push:0.01,draw:(x,tt)=>{
      const g1=hf_turn(tt,c.hold-0.6,c.stop-0.6);if(g1.a>0){x.save();x.translate(g1.dx,0);
        dq_tag(x,560,96,"hold",{text:"HOLD · EXACTLY 30 LONG",on:"granite",a:ag_in(tt,c.hold+0.75,0.35),k:ag_in(tt,c.hold+0.4,0.9),angle:0.03});
        dq_tag(x,1180,96,"hold",{text:"HOLD · CAPITALS ONLY",on:"granite",a:ag_in(tt,P.caps+0.15,0.35),k:ag_in(tt,P.caps-0.2,0.9),angle:0.03});
        const pl=hf_pop(tt,P.holds-0.2);dq_record(x,500,180,920,{head:"To work through",id:"Mei Tanaka",rows:HF_HELD},{on:"granite",k:pl.k,a:pl.a,rowA:(r,i)=>ag_in(tt,P.list-0.4+i*0.25,0.4)});
        x.restore();}
      const g2=hf_turn(tt,c.stop-0.6,c.levels-0.6);if(g2.a>0){x.save();x.translate(g2.dx,0);
        const F=dq_record(x,100,150,660,{head:"A night's file",rows:HF_DEC.map(d=>({k:"",v:d[0]}))},{on:"granite",labW:1});
        dq_chip(x,100,F.y+F.h+50,"letters outside A to Z · 0",{col:"steel",a:ag_in(tt,c.stop+1.0,0.5)});
        const sa=ag_in(tt,P.stops-0.3,0.4);if(sa>0)dq_tag(x,560,F.y+F.h+140,"stop",{to:[600,F.y+F.h-8],on:"granite",a:sa,k:ag_in(tt,P.stops-0.3,0.9),angle:0.03});
        // the update's line, stopped before the list
        hf_pLine(x,[[790,300],[1000,300]],ag_in(tt,P.stops-0.6,0.6),{col:DQ.chalk,lw:4});const ba=ag_in(tt,P.stops,0.3);if(ba>0){x.fillStyle=rgba(DQ.stop,ba);rr(x,1012,252,12,96,4);x.fill();}
        const L=dq_record(x,1100,150,720,{head:"December's list",rows:HF_DEC.map(d=>({k:"",v:d[1]}))},{on:"granite",labW:1});
        dq_chip(x,1100,L.y+L.h+50,"names · the night before's",{icon:"clock",a:ag_in(tt,P.keepsN,0.5)});
        dq_chip(x,1100,L.y+L.h+130,"to Sam · stopped · the night's file",{icon:"mail",a:ag_in(tt,P.told-0.2,0.5)});
        x.restore();}
      const g3=hf_turn(tt,c.levels-0.6,null);if(g3.a>0){x.save();x.translate(g3.dx,0);
        dq_T(x,"a doubt about one name",230,420,{w:700,size:32,dark:true,col:DQ.chalk,a:ag_in(tt,c.levels+0.2,0.5)});
        dq_tag(x,270,510,"hold",{text:"ONE NAME · A PERSON DECIDES",size:34,on:"granite",a:ag_in(tt,c.levels+0.95,0.35),k:ag_in(tt,c.levels+0.6,0.9),angle:0.02});
        dq_T(x,"a file losing letters",1150,420,{w:700,size:32,dark:true,col:DQ.chalk,a:ag_in(tt,P.file2-0.2,0.5)});
        dq_tag(x,1190,510,"stop",{text:"EVERY NAME · STOP",size:34,on:"granite",a:ag_in(tt,P.file2+0.95,0.35),k:ag_in(tt,P.file2+0.6,0.9),angle:0.02});
        x.restore();}}}
  ]);
  hf_tags(ctx,S,t,[[c.night-0.1,"The quality bench · Monday 14 September 2026 · night"],[c.mei-0.6,null,1.0]]);});

/* ---------------------------------------------------------------- 8 · Put right once
   The bench in the morning, Tuesday 15 September: December's list on the wall, its names taking back their accents one by one, with no
   hand near them, and the count to 161. From above: Beatriz's record, held by the check; Mei's office writes her name in full, once,
   and the tag turns green; it goes to December's list and every list after. The scorecard and its new row, the hand-check hours.
   1963's envelope, its code written at the start, beside her name written once. The graduations office, the spreadsheet gone from
   Malia's screen, as the takeaway is said; then the end card. */
scene("once",(ctx,S,t,sc)=>{const c=sc.cues,P=hf_once(sc,"P",()=>({n161:wAt(sc,"morning","a hundred and sixty-one"),nobody:wAt(sc,"morning","nobody typed"),
    holds:wAt(sc,"written","holds"),office:wAt(sc,"written","Mei's office"),full:wAt(sc,"written","in full"),once:wAt(sc,"written","once"),every:wAt(sc,"written","for every list after"),
    hours:wAt(sc,"score","hours"),beside:wAt(sc,"score","beside the checks"),code:wAt(sc,"post","put a code"),knew:wAt(sc,"post","written by")}));
  ag_shots(ctx,S,t,sc.dur,[
    // the morning after: December's list, its names taking back their accents, nobody typing; the count
    {at:0,place:"bench",keys:[[0,960,540,1.0]],d:2.0,push:0.02,draw:(x,tt)=>{
      const u=ag_sine((tt-P.n161+0.6)/3.6),pl=hf_pop(tt,0.6);hf_listBack(x,300,150,760,u,{k:pl.k,a:pl.a});
      const pc=hf_pop(tt,P.n161-0.6);dq_textCard(x,1180,190,500,{kick:"Accents back",title:String(Math.round(161*u))},{edge:"steel",icon:"count",k:pc.k,a:pc.a});
      dq_chip(x,1180,420,"typed by hand · 0",{icon:"person",a:ag_in(tt,P.nobody-0.2,0.5)});}},
    // from above: the check holds Beatriz's name; Mei's office writes it in full, once; the tag turns green; every list after
    {at:c.written-0.6,dis:1.0,place:"benchTop",keys:[[c.written-0.6,960,540,1.0]],d:2.0,push:0.012,draw:(x,tt)=>{
      const n=Math.ceil(3*ag_in(tt,P.full-0.3,0.7)),fam=HF_CUT+"nti".slice(0,n),pr=hf_pop(tt,c.written-0.4);
      const R=dq_record(x,360,190,1200,{head:"Student system",id:"S-19733",rows:[{k:"given_name",v:"Beatriz"},{k:"family_name",v:fam}]},{fixed:true,on:"granite",k:pr.k,a:pr.a});
      const lab=Math.max(dq_tw(x,"given_name",{w:600,size:28}),dq_tw(x,"family_name",{w:600,size:28}))+30,vx=R.x+DQ_PAD+lab,cy=R.rows[1].cy;
      if(pr.a>0.5){x.save();x.globalAlpha*=pr.a;hf_pBox(x,vx-8,cy-24,R.x+R.w-24-vx+8,48,1);x.restore();}
      const tx=R.x+R.w-40,ty=R.y+R.h+100,ok=ag_in(tt,P.once,0.4),ha=ag_in(tt,P.holds-0.2,0.4)*(1-ok);
      if(ha>0)dq_tag(x,tx,ty,"hold",{to:[tx,cy+24],text:"HOLD · MAY BE CUT SHORT",a:ha,k:ag_in(tt,P.holds-0.2,0.9),on:"granite",flip:true,angle:0.03});
      if(ok>0){dq_tag(x,tx,ty,"pass",{to:[tx,cy+24],a:ok,on:"granite",flip:true,angle:0.03});dq_chip(x,tx-730,ty,"Wednesday 16 September 2026",{icon:"calendar",a:ag_in(tt,P.once+0.2,0.5)});}
      const oc=dq_tw(x,"registrar's office · once",{w:700,size:28})+84;dq_chip(x,R.x+R.w-oc,150,"registrar's office · once",{icon:"person",a:ag_in(tt,P.office-0.2,0.5)});
      const aw=ag_in(tt,P.every-0.3,0.9);if(aw>0){hf_pLine(x,[[900,R.y+R.h+170],[660,740]],aw,{col:DQ.chalkSoft,arrow:16});hf_pLine(x,[[1020,R.y+R.h+170],[1260,740]],aw,{col:DQ.chalkSoft,arrow:16});}
      dq_chip(x,640,790,"December's list",{icon:"list",align:"center",a:ag_in(tt,P.every+0.3,0.5)});dq_chip(x,1280,790,"every list after",{icon:"list",align:"center",a:ag_in(tt,P.every+0.6,0.5)});}},
    // the scorecard: the checks at the source, and the new row, the hand-check hours
    {at:c.score-0.6,place:"benchTop",later:true,dis:0.6,keys:[[c.score-0.6,960,540,1.0]],d:2.0,push:0.01,draw:(x,tt)=>{
      const ps=hf_pop(tt,c.score-0.1);hf_score(x,210,200,{on:"granite",k:ps.k,a:ps.a,hours:ag_in(tt,P.hours+0.2,0.7),lit:ag_io(tt,P.beside-0.2,P.beside+1.8,0.4)});}},
    // 1963: the code written at the start, by the person who knew; beside it, her name written once
    {at:c.post-0.6,dis:1.0,place:"hfDesk63",keys:[[c.post-0.6,960,540,1.0]],d:2.0,push:0.02,draw:(x,tt)=>{
      hf_env(x,560,430,660,HF_ENV.zip,{on:"desk",size:34,code:["02136",ag_sine((tt-P.code+0.2)/1.4)]});
      const s=ag_eo((tt-P.knew+0.4)/1.2),pa=ag_in(tt,P.knew-0.4,0.4);dq_textCard(x,1080+300*(1-s),330,660,{kick:"Student system · S-19733",title:"Beatriz Fonseca de Albuquerque Cavalcanti"},{icon:"card",a:pa});
      dq_chip(x,560,800,"at the start · 1963",{align:"center",a:ag_in(tt,P.code+0.6,0.5)});dq_chip(x,1410,800,"at the start · 2026",{align:"center",a:ag_in(tt,P.knew+0.6,0.5)});}},
    // the graduations office: the spreadsheet gone from Malia's screen; the platform's page in its place
    {at:c.names-0.6,dis:1.0,place:"hfOffice",keys:[[c.names-0.6,960,540,1.04],[c.names-0.5,960,540,1.0]],d:2.2,push:0.02,draw:(x,tt)=>{
      hf_offScreen(x,1,{sql:true});hf_office(x,tt,{malia:{nod:0.05}});}}
  ]);
  hf_tags(ctx,S,t,[[0.3,"The quality bench · Tuesday 15 September 2026 · morning"],[c.written-0.6,null,1.0],[c.names-0.6,"The graduations office · September 2026",1.0],[c.breath,null,0.8]]);
  dq_end(ctx,S,t,c.breath,HF_TITLE,"Count the work spent fixing data by hand. Then fix where it's born.","Film 1 of 4","Quality as a habit");});
ag_cutInto(HF_CUTS);
