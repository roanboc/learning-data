/* ===== Report, fix, tell: the cards of the university's chapters =====
   Everything here is paper, a tool's page or an instrument in the module's look (the kit's cards.js and tools.js), arranged for this film:
   the place-and-date tag, the report as a row of data, the ledger of reports (a dbt model of its own), the alert that tells the owner what
   is due, a framed picture of the village on the stone wall, the line a fix travels from the student system to every copy, the month's
   count, the note to the people who make the data, the check a person's report becomes, the names it holds, the letter, the issue log,
   and the certificate. Colours mean what they always mean: brass the requirement (the due date, the promise, the rule), steel a measure,
   amber holds for a person, green passes, grey wasn't checked. Every word is at least 28 px as drawn. Every name starts with rf_ or RF_. */

// the place and the date of a scene, on a small cream card at the top left, in the frame (screen) space; o.y to sit lower, o.dark on a
// dark place (the card is cream either way, so it reads)
function rf_tag(ctx,S,text,a,o){o=o||{};if(a<=0.004)return;setScreen(ctx,S);const F={w:500,size:28,f:"mono"},w=dq_tw(ctx,text,F)+48,x=o.x||64,y=o.y||52,h=56;
  ctx.save();ctx.globalAlpha*=a;dq_card(ctx,x,y,w,h,{r:12,on:o.dark?"granite":"wall"});dq_T(ctx,text,x+24,y+38,F);ctx.restore();}
// the chapter's number and title, at the top left, for its first seconds
function rf_kick(ctx,S,t,num,title,o){o=o||{};const a=ag_io(t,0.3,o.till||6,0.6);if(a<=0.004)return;setScreen(ctx,S);dq_kicker(ctx,num,title,{a,dark:o.dark,x:o.x,y:o.y});}

/* ---------------------------------------------------------------- the report, a row of data */
const RF_REPORT={head:"Report",id:"Mon 12 Oct, 19:42",rows:[{k:"Who",v:"S-16874"},{k:"Shown",v:"Andres Penaloza"},{k:"Given",v:"Andrés Peñaloza"},{k:"Owner",v:"Registrar's office"}]};
// o.rowA(row, i) brings its rows in; o.n how many of its rows (3 without the owner)
function rf_report(ctx,x,y,w,o){o=o||{};const rec=Object.assign({},RF_REPORT,{rows:RF_REPORT.rows.slice(0,o.n||RF_REPORT.rows.length)});
  return dq_record(ctx,x,y,w,rec,Object.assign({labW:150,fixed:true},o));}

/* ---------------------------------------------------------------- the ledger of reports: a dbt model of its own
   rows: [came, name given, due, answered, told]; o.n rows shown (each comes in over 0.4 s from o.rowAt(i)), o.ans and o.told (0 to 1)
   fill Andrés's last two cells, o.kind (0 to 1) turns the owner's column into where each error was born; o.lit a row's index. */
const RF_LEDGER=[["12 Oct 19:42","Andrés Peñaloza","Old online form","14 Oct"],["12 Oct 20:05","Siobhán Kelly","Old online form","14 Oct"],["12 Oct 21:30","Min-jun Kim","Paper form, swapped","14 Oct"],
  ["13 Oct 07:58","Zoë Hartmann","Old online form","15 Oct"],["13 Oct 09:12","Mariana dos Anjos Vasconcelos Pereira","Cut at 30","15 Oct"],["13 Oct 12:40","Joaquín Muñoz","Old online form","15 Oct"]];
function rf_ledger(ctx,x,y,w,h,o){o=o||{};const kind=o.kind||0,n=o.n==null?RF_LEDGER.length:o.n;
  return dq_window(ctx,x,y,w,h,{logo:"dbt",product:"dbt",title:"Name reports · October",on:o.on,a:o.a,k:o.k,draw:(c,b)=>{
    const cols=[{h:"CAME",w:220,f:"mono"},{h:"NAME GIVEN",w:300},{h:kind>0.5?"BORN IN":"OWNER",w:280},{h:"DUE",w:120,f:"mono"},{h:"ANSWERED",w:190,f:"mono"},{h:"TOLD",w:150,f:"mono"}];
    const rows=RF_LEDGER.slice(0,6).map((r,i)=>{const nm=r[1].length>18?r[1].slice(0,17)+"…":r[1],own=kind>0.5?r[2]:"Registrar's office";
      const done=i===0?[o.ans||0,o.told||0]:[0,0];return[r[0],nm,own,r[3],{s:done[0]>0.5?"14 Oct":"",mark:done[0]>0.5?"pass":undefined},{s:done[1]>0.5?"14 Oct":"",mark:done[1]>0.5?"pass":undefined}];});
    dq_rows(c,b.x,b.y+4,cols,rows,{rh:58,lit:o.lit,litCol:o.litCol,rowA:(r,i)=>i<n?(o.rowAt?ag_in(o.t||0,o.rowAt(i),0.4):1):0});}});}

/* ---------------------------------------------------------------- the owner's morning alert, on Databricks */
function rf_alert(ctx,x,y,w,o){o=o||{};const h=o.h||340;
  return dq_window(ctx,x,y,w,h,{logo:"databricks",product:"Databricks",title:"SQL alert",a:o.a,k:o.k,on:o.on,draw:(c,b)=>{
    dq_T(c,"Reports due today",b.x+4,b.y+42,{w:800,size:40});
    dq_icon(c,"clock",b.x+20,b.y+100,34,DQ.ink);dq_T(c,"Every morning at 8:00, to the registrar's office",b.x+52,b.y+111,{w:600,size:28,col:DQ.soft});
    const ra=o.row==null?1:o.row;if(ra>0.01){c.save();c.globalAlpha*=ra;rr(c,b.x,b.y+150,b.w,72,10);c.fillStyle=rgba(mix(DQ.paper,DQ.brass,0.12),1);c.fill();c.strokeStyle=rgba(DQ.brass,0.9);c.lineWidth=2.4;c.stroke();
      dq_T(c,"Wed 14 Oct",b.x+24,b.y+196,{w:600,size:28,f:"mono"});dq_T(c,"Andrés Peñaloza",b.x+260,b.y+197,{w:700,size:32});dq_T(c,"due today",b.x+b.w-24,b.y+197,{w:700,size:28,col:dq_col("brass"),align:"right"});c.restore();}}});}

/* ---------------------------------------------------------------- a picture of the village, framed on the stone wall
   kind: "visited" (the health worker writes the report at her door), "guards" (the plan: guards at the door, the ring drawn), "paid"
   (the reward held out to her); the picture inside is the film's own scene, drawn small; its line under the frame in a chip */
function rf_frame(ctx,x,y,w,kind,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const h=w*9/16,fw=22,mat=14;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.85,1,ag_eo(o.k)));
  ctx.save();dq_shadow(ctx,"wall",1);ctx.fillStyle="rgb(74,52,36)";ctx.fillRect(x-fw-mat,y-fw-mat,w+2*(fw+mat),h+2*(fw+mat));ctx.restore();
  let g=ctx.createLinearGradient(x-fw,0,x+w+fw,0);g.addColorStop(0,"rgb(66,46,32)");g.addColorStop(1,"rgb(112,82,58)");ctx.fillStyle=g;ctx.fillRect(x-fw-mat,y-fw-mat,w+2*(fw+mat),h+2*(fw+mat));
  ctx.fillStyle=rgba(DQ.paper,1);ctx.fillRect(x-mat,y-mat,w+2*mat,h+2*mat);ctx.fillStyle="rgba(80,60,40,0.25)";ctx.fillRect(x-1,y-1,w+2,h+2);
  ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.translate(x,y);ctx.scale(w/W,w/W);rf_village(ctx,kind,t,1);ctx.restore();
  ctx.restore();if(o.line)dq_chip(ctx,x+w/2,y+h+fw+mat+46,o.line,{align:"center",a:a*(o.lineA==null?1:o.lineA)});}
// the village scenes the film shows, and the frames recall: at the door (who reports, the register, the reward) and on the plan
const RF_AT={worker:[640,590],mother:[1380,590]};
function rf_door(ctx,t,o){o=o||{};ctx.drawImage(ag_place(o.dusk?"rfDoorDusk":"rfDoor"),0,0,W,H);
  if(o.poster)rf_poster(ctx,120,150,300,o.poster,{a:o.posterA==null?1:o.posterA});
  const nt=o.note||0,wr=o.write||0,hold=(c,hd)=>{if(nt<1){c.save();c.globalAlpha*=1-nt;rf_register(c,hd,{write:wr});c.restore();}if(nt>0){c.save();c.globalAlpha*=nt;rf_note(c,hd);c.restore();}};
  dq_person(ctx,RF_PEOPLE.worker,RF_AT.worker[0]+(o.wx||0),RF_AT.worker[1],1,{t,pose:"hold",hold,gaze:[0.5,0.2],covered:o.covered});
  dq_person(ctx,RF_PEOPLE.mother,RF_AT.mother[0],RF_AT.mother[1],1,{t,flip:true,talk:o.talk||0,gaze:[0.4,0.1],covered:o.covered});}
// in a frame, the picture is clipped at the frame's foot, where the people's waists are: covered
function rf_village(ctx,kind,t){if(kind==="visited")rf_door(ctx,t,{write:0.8,poster:"Rs 50",covered:true});else if(kind==="paid")rf_door(ctx,t,{note:1,poster:"Rs 50",covered:true});
  else{ctx.drawImage(ag_place("rfPlan"),0,0,W,H);rf_planState(ctx,t,{chain:1,toMissed:1,ticks:1,missed:1,guards:1,ring:1,inside:1,stop:1});}}

/* ---------------------------------------------------------------- the plan's story, drawn over the plan
   The chain passes along RF_CHAIN (three houses, then a fourth the vaccinators missed); the ring is drawn round that house, RF_RING. st:
   chain (0 to 1, the first three), toMissed (0 to 1, on to the missed one), ticks (0 to 1, the houses vaccinated, a wave across the
   village), missed (the grey ones show), found (the chain's marks outlined: found), need (the ring dashed: what must happen), guards (0
   to 1: two by day, then two by night), ring (0 to 1, drawn), inside (every house inside it ticked), stop (the chain held at the ring) */
const RF_CHAIN=[1,2,10,11],RF_MISSED=[11,13,17],RF_RING={x:0,y:0,r:300};
(()=>{const c=rf_houseC(11);RF_RING.x=c[0];RF_RING.y=c[1];})();
const rf_inRing=i=>{const c=rf_houseC(i);return Math.hypot(c[0]-RF_RING.x,c[1]-RF_RING.y)<RF_RING.r-30;};
function rf_planState(ctx,t,st){const n=RF_HOUSES.length,ticks=st.ticks||0,miss=st.missed||0,ins=st.inside||0;
  for(let i=0;i<n;i++){if(RF_CHAIN.slice(0,3).includes(i))continue;const c=rf_houseC(i),wave=clamp((ticks*2200-c[0]+100)/300,0,1),inside=rf_inRing(i)?ins:0;
    if(RF_MISSED.includes(i)){rf_grey(ctx,i,miss*(1-inside));rf_tick(ctx,i,inside);}else rf_tick(ctx,i,Math.max(wave,inside));}
  const p=(st.chain||0)*(2/3)+(st.toMissed||0)/3;rf_chain(ctx,RF_CHAIN,p,1-0.6*(st.stop||0),t);
  const f=st.found||0;if(f>0.01){const k=Math.min(3,Math.floor(p*3+1e-6));for(let i=0;i<=k;i++){const [x,y]=rf_houseC(RF_CHAIN[i]);ctx.save();ctx.globalAlpha*=f;ctx.strokeStyle=rgba(DQ.brass,0.95);ctx.lineWidth=4;
    ctx.beginPath();ctx.arc(x,y,28,0,TAU);ctx.stroke();ctx.restore();}}
  const g=st.guards||0,hx=RF_RING.x,hh=RF_HOUSES[11];if(g>0){const day=clamp(g*2,0,1),night=clamp(g*2-1,0,1),gy=hh[1]+hh[3]+40;
    rf_guard(ctx,hx-34,gy,day);rf_guard(ctx,hx+34,gy,day);rf_sun(ctx,hx,gy+62,40,day*(1-night));rf_moon(ctx,hx,gy+62,40,night);}
  const nd=(st.need||0)*(1-clamp((st.ring||0)*3,0,1));if(nd>0.01){ctx.save();ctx.globalAlpha*=nd;ctx.setLineDash([16,14]);ctx.strokeStyle=rgba(DQ.brass,0.9);ctx.lineWidth=5;ctx.beginPath();ctx.arc(RF_RING.x,RF_RING.y,RF_RING.r,0,TAU);ctx.stroke();ctx.restore();}
  rf_ring(ctx,RF_RING.x,RF_RING.y,RF_RING.r,st.ring||0,1);}
// in the lane, side on: the mark passing from one doorway to the next (u, 0 to 1, along the first four doors)
function rf_laneChain(ctx,u,t,a){if(a<=0.01||u<=0)return;const D=RF_ROW.slice(0,4).map(h=>[h[0]+h[4]+h[5]/2,RF_BASE-110]),n=D.length-1,k=Math.min(n,u*n);ctx.save();ctx.globalAlpha*=a;
  ctx.strokeStyle=rgba(RF.umber,0.6);ctx.lineWidth=6;ctx.lineCap="round";ctx.setLineDash([2,13]);ctx.beginPath();
  for(let i=0;i<=Math.floor(k);i++){const [x,y]=D[i];i?ctx.quadraticCurveTo((D[i-1][0]+x)/2,y-90,x,y):ctx.moveTo(x,y);}
  if(k<n){const i=Math.floor(k),f=k-i,[x0,y0]=D[i],[x1,y1]=D[i+1],mx=(x0+x1)/2,my=y0-90,q=(a0,a1,a2,s)=>(1-s)*(1-s)*a0+2*(1-s)*s*a1+s*s*a2;
    for(let j=1;j<=12;j++){const s2=f*j/12;ctx.lineTo(q(x0,mx,x1,s2),q(y0,my,y1,s2));}}ctx.stroke();ctx.setLineDash([]);
  for(let i=0;i<=Math.floor(k);i++){const [x,y]=D[i],pu=0.85+0.15*Math.sin((t||0)*3+i);ctx.fillStyle=rgba(RF.umber,0.85*pu*clamp((k-i)*3+1,0,1));ctx.beginPath();ctx.arc(x,y,16,0,TAU);ctx.fill();}
  ctx.restore();}

/* ---------------------------------------------------------------- where a fix travels: from the student system to every copy
   Five cards, left to right and branching; the corrected name moves along (u, 0 to 1) and appears on each card as it reaches it. o.a,
   o.cardA(i), o.u; o.list (0 to 1): the list card's own fix, undone by the night's update (o.undo 0 to 1) */
const RF_LINE=[{k:"Source",t:"Student system",x:80,y:250},{k:"Every night, 03:00",t:"The night's update",x:520,y:250},{k:"Built from it",t:"Graduation list",x:960,y:250},
  {k:"Shows it",t:"Portal",x:1400,y:130},{k:"Prints it",t:"Printer's file",x:1400,y:390}];
function rf_line(ctx,o){o=o||{};const a=o.a==null?1:o.a,u=o.u||0;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;const w=380,B=[];
  RF_LINE.forEach((L,i)=>{B.push(dq_textCard(ctx,L.x,L.y,w,{kick:L.k,title:L.t},{measure:true}));});
  // the arrows between them, drawn first
  const arrow=(x0,y0,x1,y1,al)=>{if(al<=0.01)return;ctx.save();ctx.globalAlpha*=al;ctx.strokeStyle=rgba(DQ.ink,0.6);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x0,y0);ctx.bezierCurveTo((x0+x1)/2,y0,(x0+x1)/2,y1,x1,y1);ctx.stroke();
    ctx.fillStyle=rgba(DQ.ink,0.6);ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x1-14,y1-8);ctx.lineTo(x1-14,y1+8);ctx.closePath();ctx.fill();ctx.restore();};
  const ca=i=>o.cardA?o.cardA(i):1,mid=i=>B[i].y+B[i].h/2;
  arrow(80+w,mid(0),520,mid(1),Math.min(ca(0),ca(1)));arrow(520+w,mid(1),960,mid(2),Math.min(ca(1),ca(2)));arrow(960+w,mid(2),1400,mid(3),Math.min(ca(2),ca(3)));arrow(960+w,mid(2),1400,mid(4),Math.min(ca(2),ca(4)));
  RF_LINE.forEach((L,i)=>{const reach=[0,0.25,0.5,0.85,0.85][i],got=u>=reach?clamp((u-reach)/0.08,0,1):0;const bb=dq_textCard(ctx,L.x,L.y,w,{kick:L.k,title:L.t},{a:ca(i)});
    // the name each one holds: the old one, then the corrected one when the fix reaches it
    if(ca(i)>0.01){const nx=L.x+DQ_PAD,ny=bb.y+bb.h+44;ctx.save();ctx.globalAlpha*=ca(i);
      let old="Andres Penaloza",oldA=1-got;if(i===2&&o.list>0){oldA=Math.max(0,oldA-o.list*(1-(o.undo||0)));}
      if(oldA>0.01)dq_T(ctx,old,nx,ny,{w:600,size:30,f:"mono",col:DQ.soft,a:oldA});
      const newA=Math.max(got,i===2?(o.list||0)*(1-(o.undo||0)):0);if(newA>0.01)dq_T(ctx,"Andrés Peñaloza",nx,ny,{w:700,size:30,f:"mono",col:dq_col("pass"),a:newA});ctx.restore();}});
  ctx.restore();}

/* ---------------------------------------------------------------- the month's count, in steel: a measure */
function rf_month(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const lines=[["64","reports in October"],["61","put right within two working days"],["3","waiting for a document"],["64","told"]],
    h=DQ_PAD*2+56+lines.length*70;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,ag_spr(o.k,0,0.5)));
  dq_card(ctx,x,y,w,h,{edge:"steel"});dq_label(ctx,x+DQ_PAD,y+DQ_PAD+26,"October",{col:dq_col("steel")});
  lines.forEach((L,i)=>{const la=o.lineA?o.lineA(i):1;if(la<=0.01)return;const yy=y+DQ_PAD+56+i*70+44;ctx.save();ctx.globalAlpha*=la;
    dq_T(ctx,L[0],x+DQ_PAD+90,yy,{w:800,size:48,col:dq_col("steel"),align:"right"});dq_T(ctx,L[1],x+DQ_PAD+120,yy-4,{w:600,size:32});ctx.restore();});ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the note to the admissions team, once a month
   What it cost first (o.costA, then its words o.gradA, 0 to 1), then "Every month" (o.everyA) and the month's counts, one line at a time (o.lineA(i)): the October
   heading, then the names each form made. */
function rf_adNote(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,P=DQ_PAD,rows=[["Names from the old online form","38"],["Names from the paper forms","11"]],h=P*2+352+rows.length*54;
  if(a<=0.004)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,ag_spr(o.k,0,0.5)));
  dq_card(ctx,x,y,w,h,{});dq_icon(ctx,"mail",x+P+22,y+P+22,40,DQ.ink);dq_label(ctx,x+P+62,y+P+32,"To the admissions team");
  const ea=o.everyA==null?1:o.everyA;if(ea>0.01){const cw=dq_tw(ctx,"Every month",{w:700,size:28})+84;dq_chip(ctx,x+w-P-cw,y+P+22,"Every month",{icon:"calendar",a:ea});}
  const ca=o.costA==null?1:o.costA;if(ca>0.01){dq_T(ctx,"What it cost",x+P,y+P+106,{w:600,size:28,col:DQ.soft,a:ca});
    const ga=ca*(o.gradA==null?1:o.gradA);dq_T(ctx,"A graduate who had to find",x+P,y+P+156,{w:700,size:36,a:ga});dq_T(ctx,"their own name wrong",x+P,y+P+204,{w:700,size:36,a:ga});}
  const l0=o.lineA?o.lineA(0):1;if(l0>0.01){ctx.fillStyle=rgba([110,90,66],0.3*l0);ctx.fillRect(x+P,y+P+240,w-2*P,1.5);dq_T(ctx,"October",x+P,y+P+300,{w:800,size:36,a:l0});}
  rows.forEach((r,i)=>{const la=o.lineA?o.lineA(i+1):1;if(la<=0.01)return;const yy=y+P+356+i*54;dq_T(ctx,r[0],x+P,yy,{w:600,size:30,a:la});
    dq_T(ctx,r[1],x+w-P,yy,{w:700,size:36,f:"mono",col:dq_col("steel"),align:"right",a:la});});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the check a person's report becomes
   A card with the inspector's gauge, its brass rule (what good means here) in three lines, and its tag, amber: it holds each name it
   finds for a person; its owner. o.lineA(i), o.tagA, o.rule (0 to 1, the brass draws), o.k */
const RF_RULE=["A name the old form made","still in plain letters, A to Z","not yet confirmed by its graduate"];
function rf_check(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;const h=DQ_PAD*2+70+RF_RULE.length*50+20;if(a<=0.004)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,ag_spr(o.k,0,0.5)));dq_card(ctx,x,y,w,h,{edge:"brass",on:o.on});
  dq_icon(ctx,"gauge",x+DQ_PAD+24,y+DQ_PAD+22,44,dq_col("brass"));dq_label(ctx,x+DQ_PAD+66,y+DQ_PAD+34,"Check",{col:dq_col("brass")});
  RF_RULE.forEach((l,i)=>{const la=o.lineA?o.lineA(i):1;if(la<=0.01)return;dq_T(ctx,l,x+DQ_PAD,y+DQ_PAD+104+i*50,{w:i?600:800,size:i?32:36,a:la});});
  const r=o.rule==null?1:o.rule;if(r>0.01){ctx.fillStyle=rgba(DQ.brass,0.9);ctx.fillRect(x+DQ_PAD,y+DQ_PAD+66,(w-2*DQ_PAD)*ag_sine(r),3);}
  ctx.restore();const ta=o.tagA||0;if(ta>0.01)dq_tag(ctx,x+w-420,y+h+4,"hold",{text:"Holds for a person",to:[x+w-440,y+h-26],a:a*ta,k:o.tagK});
  return{x,y,w,h};}

/* ---------------------------------------------------------------- the names it holds
   A deep stack of cream record cards, each an old-form name in plain letters, the top one showing its name, an amber tag tied on (it holds
   for a person); o.tagA (0 to 1), o.n (the cards drawn, a few px apart). rf_seven: seven of them, four over three, each one's name
   gaining the accents the old form took (o.turn(i), 0 to 1) as its edge turns from amber (held) to green. */
const RF_SEVEN=[["Joaquin Munoz","Joaquín Muñoz"],["Chloe Lefevre","Chloé Lefèvre"],["Lukasz Wojcik","Łukasz Wójcik"],["Monica Ibanez","Mónica Ibáñez"],
  ["Bjorn Akesson","Björn Åkesson"],["Gulsen Yilmaz","Gülşen Yılmaz"],["Ines Conceicao","Inês Conceição"]];
function rf_stack(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const n=o.n||14,w=520,h=150;ctx.save();ctx.globalAlpha*=a;
  for(let i=n-1;i>=0;i--)dq_card(ctx,x+i*3,y+i*9,w,h,{on:o.on,r:6});
  dq_card(ctx,x,y,w,h,{on:o.on,r:6,ruled:40,ruleTop:66});dq_T(ctx,"First recorded · 2016 · online form",x+24,y+44,{w:600,size:28,col:DQ.soft});
  dq_T(ctx,"Joaquin Munoz",x+24,y+106,{w:700,size:36,f:"mono"});ctx.restore();
  const ta=o.tagA==null?1:o.tagA;if(ta>0.01)dq_tag(ctx,x+w-30,y+h-26,"hold",{to:[x+w-56,y+h-52],a:a*ta,k:o.tagK,angle:0.12});}
function rf_seven(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const cw=300,ch=104,gx=24,gy=26;
  RF_SEVEN.forEach((nm,i)=>{const ca=o.cardA?o.cardA(i):1;if(ca<=0.01)return;const col=i%4,row=(i/4)|0,cx=x+col*(cw+gx)+(row?(cw+gx)/2:0),cy=y+row*(ch+gy),u=o.turn?o.turn(i):0;
    ctx.save();ctx.globalAlpha*=a*ca;dq_card(ctx,cx,cy,cw,ch,{on:o.on,r:6,edge:"hold"});if(u>0.01){ctx.lineWidth=3;ctx.strokeStyle=rgba(dq_tone("pass").col,u);rr(ctx,cx+1.5,cy+1.5,cw-3,ch-3,6);ctx.stroke();}
    if(u<1){ctx.save();ctx.globalAlpha*=1-u;dq_T(ctx,nm[0],cx+22,cy+64,{w:700,size:30,f:"mono",col:DQ.soft});ctx.restore();}
    if(u>0){ctx.save();ctx.globalAlpha*=u;dq_T(ctx,nm[1],cx+22,cy+64,{w:700,size:30,f:"mono"});ctx.restore();}ctx.restore();});
  return{x,y,w:4*cw+3*gx,h:2*ch+gy};}

/* ---------------------------------------------------------------- the letter the registrar's office sends to each of the 83 */
function rf_letter(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const h=330;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,ag_spr(o.k,0,0.5)));
  dq_card(ctx,x,y,w,h,{});dq_icon(ctx,"mail",x+DQ_PAD+22,y+DQ_PAD+22,40,DQ.ink);dq_label(ctx,x+DQ_PAD+62,y+DQ_PAD+32,"From the registrar's office");
  dq_T(ctx,"Our old form dropped accents.",x+DQ_PAD,y+DQ_PAD+120,{w:700,size:40});dq_T(ctx,"Please look closely at your name.",x+DQ_PAD,y+DQ_PAD+182,{w:700,size:40});
  dq_T(ctx,"Your name, as it will be printed",x+DQ_PAD,y+DQ_PAD+250,{w:600,size:28,col:DQ.soft});ctx.restore();}

/* ---------------------------------------------------------------- the issue log, as Rules that run draws it, in this module's look */
function rf_issueLog(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const h=330;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,ag_spr(o.k,0,0.5)));
  dq_card(ctx,x,y,w,h,{ruled:58,ruleTop:150});dq_label(ctx,x+DQ_PAD,y+DQ_PAD+26,"Issue log · Data quality");
  const cols=[["OPENED",0],["ISSUE",210],["OWNER",900],["DUE",1250]];cols.forEach(([s,cx])=>dq_T(ctx,s,x+DQ_PAD+cx,y+DQ_PAD+96,{w:700,size:28,ls:2,col:DQ.soft}));
  const ra=o.row==null?1:o.row;if(ra>0.01){const yy=y+DQ_PAD+170;ctx.save();ctx.globalAlpha*=ra;dq_T(ctx,"14 Oct",x+DQ_PAD,yy,{w:600,size:30,f:"mono"});
    dq_T(ctx,"Names from the old form, in plain letters",x+DQ_PAD+210,yy,{w:700,size:30});dq_T(ctx,"Registrar's office",x+DQ_PAD+900,yy,{w:600,size:30});
    dq_T(ctx,"12 Nov",x+DQ_PAD+1250,yy,{w:700,size:30,f:"mono",col:dq_col("brass")});ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- the certificate
   A degree certificate's proof: the university's shield, the award, and the name; o.name, o.award; o.wrong marks the name printed wrong
   (a grey line under it: nobody checked it with its graduate); on the granite or the wall (o.on) */
function rf_cert(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const h=w*0.7;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.8,1,ag_spr(o.k,0,0.5)));
  if(o.angle){ctx.translate(x+w/2,y+h/2);ctx.rotate(o.angle);ctx.translate(-x-w/2,-y-h/2);}
  dq_card(ctx,x,y,w,h,{on:o.on,r:4,fill:"rgb(248,244,234)"});ctx.strokeStyle="rgba(120,96,64,0.5)";ctx.lineWidth=3;ctx.strokeRect(x+20,y+20,w-40,h-40);ctx.lineWidth=1.2;ctx.strokeRect(x+30,y+30,w-60,h-60);
  const s=w/900,cx=x+w/2;ctx.fillStyle=rgba(DQ.ink,0.8);ctx.beginPath();ctx.moveTo(cx-26*s,y+64*s);ctx.lineTo(cx+26*s,y+64*s);ctx.lineTo(cx+26*s,y+100*s);ctx.quadraticCurveTo(cx+26*s,y+120*s,cx,y+130*s);ctx.quadraticCurveTo(cx-26*s,y+120*s,cx-26*s,y+100*s);ctx.closePath();ctx.fill();
  dq_T(ctx,"This is to certify that",cx,y+200*s,{w:500,size:Math.max(28,Math.round(28*s)),align:"center",col:DQ.soft});
  const nm=o.name||"Andrés Peñaloza",ns=Math.round(64*s);dq_T(ctx,nm,cx,y+300*s,{w:800,size:ns,align:"center"});
  if(o.ring>0.01){const x0=cx-dq_tw(ctx,nm,{w:800,size:ns})/2,lx=rf_letterAt(ctx,nm,o.ringK||0,x0,ns);ctx.save();ctx.strokeStyle=rgba(DQ_TONE.hold.col,0.95*clamp(o.ring*1.4,0,1));ctx.lineWidth=5;
    ctx.beginPath();ctx.arc(lx,y+300*s-ns*0.27,ns*0.42,-Math.PI/2,-Math.PI/2+TAU*clamp(o.ring*1.2,0,1));ctx.stroke();ctx.restore();}
  dq_T(ctx,o.award||"Master of Data Analytics",cx,y+400*s,{w:700,size:Math.max(28,Math.round(36*s)),align:"center"});
  ctx.restore();}
// the folder a graduate is handed on the stage, open: dark cloth outside, cream card inside, and, where the certificate should be, only
// the dashed outline of a card that isn't there
function rf_folder(c,hands){const [hx,hy]=hands.near,x=hx+20,y=hy-30,w=250,h=170;
  ag_soft(c,cc=>{cc.moveTo(x-w/2,y);cc.lineTo(x+w/2,y);cc.lineTo(x+w/2-6,y-h);cc.lineTo(x-w/2+6,y-h);cc.closePath();},[40,34,44],[78,70,84],x+60,y-h,220,"rgba(10,8,12,0.4)",8);
  ag_soft(c,cc=>{cc.moveTo(x-w/2+12,y-12);cc.lineTo(x+w/2-12,y-12);cc.lineTo(x+w/2-16,y-h+12);cc.lineTo(x-w/2+16,y-h+12);cc.closePath();},[232,224,206],[250,246,236],x+40,y-h,180,"rgba(80,60,30,0.2)",6);
  c.strokeStyle="rgba(60,48,40,0.35)";c.lineWidth=2;c.beginPath();c.moveTo(x,y-12);c.lineTo(x,y-h+12);c.stroke();
  c.save();c.setLineDash([9,8]);c.strokeStyle=rgba(DQ.soft,0.8);c.lineWidth=2.4;c.strokeRect(x+14,y-h+30,w/2-40,h-60);c.restore();}
// draw fn(ctx, hands) in a person's figure space after they're drawn, so it lies over what's worn over them (the gown's hood)
function rf_holdOver(ctx,x,y,s,flip,hands,fn){if(!hands)return;const A=AG_FIG.anchor;ctx.save();ctx.translate(x,y);ctx.scale(flip?-s:s,s);ctx.translate(-A[0],-A[1]);fn(ctx,hands);ctx.restore();}
// a graduate on the stage, in a plain black gown (no one the film names): the agent films' person, dressed for the ceremony
const RF_GRAD={key:"rf_grad",name:"A graduate",skin:[176,124,96],hair:{style:"bob",c:[40,30,26]},top:{kind:"suit",c:[30,29,33],inner:[238,238,240],tie:[60,56,60],hood:[226,220,206]},over:dq_hood,breath:0.3};

/* ---------------------------------------------------------------- the portal's button, on a card of its own (the opening's last moment) */
function rf_button(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const w=620,h=190;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,ag_spr(o.k,0,0.5)));
  dq_card(ctx,x,y,w,h,{on:o.on});dq_label(ctx,x+DQ_PAD,y+DQ_PAD+26,"Your name, as it will be printed");
  rr(ctx,x+DQ_PAD,y+86,w-2*DQ_PAD,76,14);ctx.fillStyle="rgb(250,248,244)";ctx.fill();ctx.strokeStyle=rgba(DQ.ink,0.7);ctx.lineWidth=2.5;ctx.stroke();
  dq_T(ctx,"This isn't my name",x+w/2,y+136,{w:700,size:32,align:"center"});ctx.restore();}
// the folder Mei keeps closed under her hand: what was seen at enrolment, never opened on screen; its tab says what it holds
function rf_closedFolder(c,hands){const [hx,hy]=hands.near,x=hx+40,y=hy-10,w=300,h=200;
  ag_soft(c,cc=>{cc.moveTo(x-w/2,y);cc.lineTo(x+w/2,y);cc.lineTo(x+w/2,y-h);cc.lineTo(x-w/2,y-h);cc.closePath();},[196,170,126],[226,204,160],x+80,y-h,240,"rgba(80,60,30,0.3)",8);
  c.fillStyle="rgb(214,190,146)";rr(c,x-w/2+20,y-h-44,236,48,8);c.fill();dq_T(c,"Seen at enrolment",x-w/2+36,y-h-11,{w:700,size:28});}
// dbt's stored failures: the names the check holds, kept in a table the registrar's office reads
function rf_kept(ctx,x,y,w,o){o=o||{};const h=300;return dq_window(ctx,x,y,w,h,{logo:"dbt",product:"dbt",title:"Kept for the registrar's office",a:o.a,k:o.k,on:o.on,draw:(c,b)=>{
    const n=o.n==null?83:o.n;dq_T(c,String(Math.round(n)),b.x+170,b.y+130,{w:800,size:112,col:dq_col("steel"),align:"right"});
    dq_T(c,"names held for a person",b.x+210,b.y+86,{w:700,size:36});dq_T(c,"Thursday 15 October, 03:00",b.x+210,b.y+134,{w:500,size:30,f:"mono",col:DQ.soft});}});}
