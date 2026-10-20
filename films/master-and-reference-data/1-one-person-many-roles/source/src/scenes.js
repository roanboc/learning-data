/* ===== One person, many roles: scenes =====
   Twelve chapters, as in ../script.md: the parish book of 1686, and one person followed from parish to parish; Linh back to study,
   with a new student number that nothing links to the one she graduated with; her five records, the transcript her application asks
   for and the alumni office's invitation; the kinds of data; the university's model, with a learner and no person; the person, her
   roles, her contact points and her identifiers kept apart, and the same in enterprise architecture's notation; who keeps what; the
   same four things in a hospital, a bank and an energy company; DAMA's name for it and its four ways to keep it; the other master
   entities and the four questions; the nine films, in four parts; and her application again, this time finding her first.
   Drawn in watercolour (shared/src/wash.js), made to read on a phone (tools/legible.py): text is at least 28 px in the frame. The camera
   moves in on whatever the narration is about, and every shot drifts slowly; things arrive with a spring. Sound: every effect in
   tools/score.py fires at the same moment as the thing it belongs to here, so keep the two in step. */

// the camera, as The map before the data moves it (keys are [time, x, y, zoom], each move eased over d seconds), kept inside the place
function m1_focus(ctx,t,keys,d){d=d||1.4;let x=keys[0][1],y=keys[0][2],z=keys[0][3];for(let i=1;i<keys.length;i++){const u=easeCam(clamp((t-keys[i][0])/d,0,1));if(u<=0)break;
    x=lerp(x,keys[i][1],u);y=lerp(y,keys[i][2],u);z=lerp(z,keys[i][3],u);}
  z=Math.max(1,z);x=clamp(x,960/z,W-960/z);y=clamp(y,540/z,H-540/z);ctx.translate(960,540);ctx.scale(z,z);ctx.translate(-x,-y);return{x,y,z};}
// every scene's start and end: the place under the camera, and over it all, the paper
function m1_open(ctx,S,t,sc,place,keys,o){o=o||{};setScreen(ctx,S);ctx.save();const cam=m1_focus(ctx,t,keys,o.d||1.6);drift(ctx,t,sc,{z:o.z==null?0.018:o.z,x:o.dx||960,y:o.dy||560});
  if(place)m1_place(ctx,place);return cam;}
function m1_close(ctx,S){ctx.restore();setScreen(ctx,S);}

/* ---------- 1. One record, wherever you go ---------- */
// the household's book, and the next parish's
const M1_B1=[460,730],M1_B2=[1590,230],M1_BW=840,M1_BH=350;
scene("parish",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tBook=w("book","keep a book"),tHouse=w("book","every household"),tWho=w("book","who lived"),tRead=w("book","whether they"),
    tMv=c("moved"),tCarry=w("moved","carried"),tNew=w("moved","new parish"),tNext=w("moved","the next book"),tNum=c("number"),tStamp=w("number","a number"),tOnce=c("once"),tFol=w("once","followed");
  // the camera: the parish; in on the book as it's written; out for the road to Uppsala; up to the card of 1947; out to both books
  m1_open(ctx,S,t,sc,"parish",[[0,960,540,1],[tBook-0.6,738,650,1.3],[tCarry-0.5,960,540,1],[tNum-0.4,960,440,1.25],[tOnce-0.3,960,540,1]]);
  // while the card of 1947 is the subject, the books step back, and the parish goes quiet under a veil of paper
  const hush=fin(t,tNum-0.7,0.5)*(1-fin(t,tOnce+0.6,0.7)),tq=1-fin(t,B+0.5,0.8);
  withA(ctx,(1-0.6*hush)*tq,()=>{
    // the household's book, written as the narration names what it holds
    arrive(ctx,M1_B1[0],M1_B1[1],t,tBook-0.4,()=>m1_bookRows(ctx,t,M1_B1[0],M1_B1[1],{head:tHouse,names:tWho-0.15,moved:tMv,read:tRead}),{dy:40,d:0.9});
    arrive(ctx,1000,452,t,tHouse,()=>withA(ctx,1-fin(t,tMv-0.6,0.5),()=>wc_tag(ctx,1000,452,"every household",{align:"center"})),{dy:10});
    // the certificate leaves the page, and is carried along the road to Uppsala
    const lift=clamp((t-tCarry)/0.9,0,1),walk=clamp((t-tCarry-0.9)/(tNext-tCarry+0.6),0,1),wp=wc_along(M1_ROAD,walk);
    if(lift>0&&lift<1)m1_cert(ctx,lerp(M1_B1[0]+190,1040,ease(lift)),lerp(M1_B1[1]-40,660,ease(lift))-Math.sin(lift*Math.PI)*120,lerp(0.9,0.42,ease(lift)),lerp(-0.1,0.2,lift),1);
    m1_walker(ctx,wp[0],wp[1]+6,t,fin(t,tCarry+0.8,0.3)*(1-fin(t,tNext+1.2,0.6)));
    arrive(ctx,1700,480,t,tNew-0.2,()=>withA(ctx,1-fin(t,tNum-0.6,0.5),()=>wc_tag(ctx,1700,480,"Uppsala parish",{align:"center"})),{dy:10});
    // the next parish's book takes the name in
    arrive(ctx,M1_B2[0],M1_B2[1],t,tNext-0.3,()=>m1_book2(ctx,t,M1_B2[0],M1_B2[1],tNext),{dy:30,d:0.9});});
  m1_hush(ctx,0.45*hush);
  // 1947: a number, stamped on a card, for life
  const k47=1-fin(t,tOnce-0.2,0.6);
  if(k47>0.01)withA(ctx,k47,()=>{arrive(ctx,960,330,t,tNum+0.1,()=>m1_card47(ctx,t,960,330,tStamp),{dy:30,d:0.9});
    arrive(ctx,960,530,t,tStamp+0.6,()=>wc_tag(ctx,960,530,"a number for life",{align:"center"}),{dy:10});});
  // one person, written down once, followed: a line from his name in one book to his name in the next
  const lk=clamp((t-tOnce-0.9)/1.4,0,1);withA(ctx,tq,()=>{if(lk>0)wc_link(ctx,M1_B1[0]+382,M1_B1[1]-M1_BH/2+108,M1_B2[0]+16,M1_B2[1]-77,WC_ROLE.student,{p:lk,a:0.9,lw:3.6,dash:[3,10]});
    arrive(ctx,1228,410,t,tFol,()=>wc_tag(ctx,1228,410,"one person, followed",{align:"center",col:WC_ROLEINK.student}),{dy:10});});
  m1_close(ctx,S);
  // the year, in the corner
  wc_year(ctx,64,80,"1686 · Sweden",fin(t,0.4,0.6)*(1-fin(t,tNum-0.3,0.4)));wc_year(ctx,64,80,"1947 · Sweden",fin(t,tNum-0.1,0.5)*(1-fin(t,tOnce-0.3,0.4)));
  wc_paperOver(ctx,S);wc_fadeIn(ctx,S,t,1.4);
  wc_title(ctx,S,t,B+0.6,"One person, many roles","the person, the roles, and who keeps what","Film 1 of 9 · master and reference data");});
// the household's rows, one after another: the name, then the year; a tick for those who can read; Olof, the farmhand, on the right
// page, struck through when he moves, and where he went
function m1_bookRows(ctx,t,cx,cy,o){const w=M1_BW,h=M1_BH,L=cx-w/2+40,R=cx+30,top=cy-h/2,ink=WCP.parchInk;m1_bookAt(ctx,cx,cy,w,h,126,46);
  m1_write(ctx,t,"Backa farm · 1686",L,top+60,o.head,0.9);ctx.save();ctx.strokeStyle=rgba(ink,0.5*clamp((t-o.head-0.6)/0.4,0,1));ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(L,top+76);ctx.lineTo(cx-30,top+76);ctx.stroke();ctx.restore();
  M1_HOUSE.concat([["Olof, farmhand","1664",1]]).forEach(([n,yr,rd],i)=>{const r0=o.names+i*0.5,right=i===5,x=right?R:L,xr=right?cx+w/2-50:cx-52,yy=top+118+(right?0:i*46);
    m1_write(ctx,t,n,x,yy,r0,0.32);m1_write(ctx,t,yr,xr,yy,r0+0.34,0.14,{align:"right"});if(rd&&!right)wc_tick(ctx,cx-26,yy-10,24,ink,clamp((t-Math.max(r0+0.5,o.read+i*0.12))/0.3,0,1),3);});
  const mv=clamp((t-o.moved)/0.5,0,1);if(mv>0){ctx.save();ctx.strokeStyle=rgba(ink,0.8);ctx.lineWidth=2.4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(R-6,top+108);ctx.lineTo(lerp(R-6,cx+w/2-44,mv),top+106);ctx.stroke();ctx.restore();}
  m1_write(ctx,t,"moved to",R,top+164,o.moved+0.5,0.6,{col:WC_ROLEINK.student});m1_write(ctx,t,"Uppsala parish",R,top+210,o.moved+1.15,0.9,{col:WC_ROLEINK.student});
  const lg=clamp((t-o.read-0.8)/0.5,0,1);if(lg>0)withA(ctx,lg,()=>{wc_tick(ctx,R+12,top+h-56,24,ink,1,3);wc_T(ctx,"can read",R+36,top+h-46,{w:600,size:28,col:ink,a:0.8});});}

/* ---------- 2. Back to study ---------- */
scene("back",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tToday=c("today"),tName=w("today","Linh Nguyen"),tGrad=w("today","graduated"),tHI=w("back","health"),tAp=c("applies"),tOnl=w("applies","online"),
    tNum=w("applies","number"),tNo=c("nothing"),tLnk=w("nothing","linked"),tWith=w("nothing","graduated with");
  // the camera ends where the next chapter's starts, with no drift, so the campus and her records don't double as the chapters cross
  m1_open(ctx,S,t,sc,"campus",[[0,960,540,1],[tToday+0.6,880,560,1.08],[tAp-0.3,900,520,1.05],[tNo-0.3,960,540,1]],{z:0});
  // each record joined to her by a line in its role's colour
  [["old",tGrad+0.2],["new",tOnl+0.3]].forEach(([k,t0])=>{const e=m1_recEnd(k),h=m1_toLinh(e);wc_link(ctx,e[0],e[1],h[0],h[1],WC_ROLE.student,{p:clamp((t-t0)/0.6,0,1),a:0.8});});
  // nothing links the new number to the old one: a line from one towards the other that stops halfway, at a cross
  m1_noLink(ctx,t,tLnk,tWith);
  // Linh, on the path; she takes out her phone to apply, and puts it away
  const ph=ease(fin(t,tAp-0.1,0.6))*(1-ease(fin(t,tNo+0.2,0.7)));
  arrive(ctx,M1_LX,M1_LY-300,t,tToday-0.5,()=>person(ctx,"linh",M1_LX,M1_LY,1.02,{pose:"stand",pose2:"phone",mix:ph,expr:"calm",t}),{d:0.9,from:0.97});
  arrive(ctx,230,494,t,tName-0.2,()=>{wc_panel(ctx,60,440,360,112,{kind:"card"});wc_T(ctx,"Linh Nguyen",90,488,{w:800,size:32,col:WC_DARK});
    withA(ctx,fin(t,tHI,0.5),()=>wc_T(ctx,"health informatics",90,530,{w:600,size:28,col:WC_MUTED}));},{dy:12});
  // her record from her first degree, under the number she graduated with; then the new one, its number stamped on
  const [ox,oy,ow,oh]=M1_REC.old,[nx,ny,nw,nh]=M1_REC.new;
  arrive(ctx,ox+ow/2,oy+oh/2,t,tGrad,()=>m1_rec(ctx,t,"old"),{dy:16});
  arrive(ctx,nx+nw/2,ny+nh/2,t,tOnl,()=>m1_rec(ctx,t,"new",{ts:tNum-0.05}),{dy:16});
  m1_close(ctx,S);
  wc_year(ctx,64,80,"today · the university",fin(t,0.3,0.6));wc_paperOver(ctx,S);});
// the line that doesn't link the two numbers, between the two records, and the cross on it
const M1_NOX=595,M1_NOY=188;
function m1_noLink(ctx,t,t0,tx){const [nx]=M1_REC.new,[ox,,ow]=M1_REC.old;
  wc_link(ctx,nx-6,M1_NOY,ox+ow+6,M1_NOY,WC_PENCIL,{p:clamp((t-t0)/0.7,0,1)*0.5,a:0.75});
  wc_cross(ctx,M1_NOX,M1_NOY,46,WC_NO,clamp((t-tx)/0.5,0,1));}

/* ---------- 3. Five records, five Linhs ---------- */
scene("five",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tFive=w("now","five records"),tOldN=w("students","the old number"),tNewN=w("students","the new"),tAo=w("alumni","alumni office"),tOnly=w("alumni","only the old"),
    tHr=w("hr","HR"),tRo=w("research","research office"),tApp=w("transcript","her application"),tTr=w("transcript","a transcript"),tGave=w("transcript","the university gave"),
    tInv=w("invite","invites her"),tAlr=w("invite","already doing"),tNb=w("none","nobody"),tOne=w("none","one person");
  m1_open(ctx,S,t,sc,"campus",[[0,960,540,1]]);
  // when each of the other three records is named; the lines to her fade as the chapter ends: nobody sees they're one person
  const named={alumna:tAo,tutor:tHr,researcher:tRo},rest=["alumna","tutor","researcher"],la=1-fin(t,tNb,1.4);
  withA(ctx,la,()=>["old","new"].concat(rest).forEach((k,i)=>{const e=m1_recEnd(k),h=m1_toLinh(e),p=i<2?1:clamp((t-tFive-0.2-(i-2)*0.15)/0.6,0,1);
    wc_link(ctx,e[0],e[1],h[0],h[1],WC_ROLE[M1_RECI[k][0]],{p,a:0.8});}));
  m1_noLink(ctx,t,-10,-10);
  person(ctx,"linh",M1_LX,M1_LY,1.02,{pose:"stand",expr:t>tGave+0.4?"concerned":"calm",t});
  // the two student records, already here; three more, blank as they're counted, each named in turn
  m1_rec(ctx,t,"old");m1_rec(ctx,t,"new");
  rest.forEach((k,i)=>{const [x,y,ww,hh]=M1_REC[k],nm=fin(t,named[k],0.4);arrive(ctx,x+ww/2,y+hh/2,t,tFive+i*0.15,()=>{withA(ctx,1-nm,()=>m1_blank(ctx,k));withA(ctx,nm,()=>m1_rec(ctx,t,k));},{dy:16});});
  // the old number and the new; the alumni office's, the old one
  const off=(t1,d)=>1-fin(t,t1,d||0.5);
  withA(ctx,off(tAo-0.2),()=>{m1_ringId(ctx,"old",clamp((t-tOldN)/0.7,0,1),31);m1_ringId(ctx,"new",clamp((t-tNewN)/0.7,0,1),33);});
  withA(ctx,off(tHr-0.2),()=>m1_ringId(ctx,"alumna",clamp((t-tOnly)/0.7,0,1),35));
  // her application asks for a transcript of the degree her own record holds; the alumni office invites her to the master's she's doing
  withA(ctx,off(tNb,0.8),()=>{m1_ringNote(ctx,"old",clamp((t-tGave)/0.8,0,1),37);m1_ringNote(ctx,"new",clamp((t-tAlr)/0.8,0,1),39);});
  arrive(ctx,M1_FX+M1_APPW/2,254,t,tApp-0.2,()=>m1_app(ctx,M1_FX,144,{id:"S-20436",ida:1,ask:clamp((t-tTr)/1.0,0,1),req:fin(t,tTr+1.0,0.4)}),{dy:16});
  arrive(ctx,M1_FX+M1_MAILW/2,494,t,tInv-0.2,()=>m1_mail(ctx,M1_FX,404,{}),{dy:16});
  arrive(ctx,930,660,t,tOne-0.3,()=>wc_tag(ctx,930,660,"five records, one person",{align:"center"}),{dy:8});
  m1_close(ctx,S);
  wc_year(ctx,64,80,"today · the university",1);wc_paperOver(ctx,S);});
// the column on the right, for her application and the alumni office's email
const M1_FX=1210;

/* ---------- 4. The kinds of data ---------- */
// four shelves: master data, reference data, transactional data, metadata; the first two stay lit
const M1_KX=[270,730,1190,1650],M1_SHELF=784;
const M1_KINDS=[["master data","the things it's about"],["reference data","the lists that sort them"],["transactional data","what happens to them"],["metadata","what it all means"]];
scene("kinds",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tM=c("master"),tSh=w("master","shared by"),tR=c("reference"),tCas=w("reference","casual tutor"),tCo=w("reference","or a country"),
    tT=c("trans"),tEn=w("trans","an enrolment"),tPay=w("trans","a payslip"),tMe=c("meta"),tDef=w("meta","the definition"),tTwo=w("apart","the first two"),tTell=w("apart","tells them");
  // the camera: the four shelves; then in on the first two, which the series is about
  m1_open(ctx,S,t,sc,"plain",[[0,960,540,1],[tTwo-0.3,768,500,1.25]]);
  const on=[tM,tR,tT,tMe],dim=fin(t,tTwo-0.2,0.8);
  M1_KX.forEach((x,i)=>{if(t<on[i]-0.3)return;withA(ctx,i>=2?1-0.75*dim:1,()=>{m1_shelf(ctx,x,M1_SHELF,(t-on[i]+0.3)/0.7);
    arrive(ctx,x,230,t,on[i]-0.3,()=>{wc_T(ctx,M1_KINDS[i][0],x,216,{w:800,size:40,align:"center",col:WC_DARK});wc_T(ctx,M1_KINDS[i][1],x,260,{w:600,size:28,align:"center",col:WC_MUTED});},{dy:12});});});
  // master data: Linh, as the master record, in white paper; her roles' colours arrive as she's shared by every process and system
  wc_white(ctx,"linh",M1_KX[0],M1_SHELF-2,0.6,m1_bands([0,1,2,3].map(i=>fin(t,tSh+i*0.22,0.4))),{a:fin(t,tM+0.1,0.7)});
  // reference data: two short lists, each with the value that sorts her lit
  arrive(ctx,730,487,t,tR+0.2,()=>m1_list(ctx,560,366,340,"role type",["student","casual tutor","researcher","alumna"],1,WC_ROLE.tutor,fin(t,tCas,0.5)),{dy:16});
  arrive(ctx,730,699,t,tR+0.6,()=>m1_list(ctx,560,622,340,"country",["Australia","Vietnam"],1,WC_BADGE,fin(t,tCo+0.3,0.5)),{dy:16});
  withA(ctx,1-0.75*dim,()=>{
    // transactional data: what happens to her, slip after slip
    [[tT+0.4,"student","enrolled","Jul 2025"],[tEn+0.3,"student","result","Nov 2025"],[tPay+0.1,"tutor","payslip","Apr 2026"]].forEach(([t0,r,n,d],i)=>
      arrive(ctx,1190,744-i*92,t,t0,()=>m1_slip(ctx,1000,712-i*92,r,n,d),{dy:-30}));
    // metadata: what a learner means, in the glossary
    arrive(ctx,1650,671,t,tDef-0.2,()=>m1_term(ctx,1470,566,360,"learner",["a person enrolled","to study"]),{dy:16});});
  // the first two, which the next film tells apart
  m1_dArrow(ctx,404,203,556,clamp((t-tTell)/0.6,0,1));
  arrive(ctx,480,128,t,tTell+0.3,()=>wc_tag(ctx,480,128,"the next film",{align:"center",size:28,w:600}),{dy:8});
  m1_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 5. The role, called the person ---------- */
// Noor's hand: pencil writing that writes itself from t0 over d seconds
function m1_note(ctx,t,s,x,y,t0,d,o){o=o||{};const p=clamp((t-t0)/d,0,1);if(p>0)wc_hand(ctx,s,x,y,{p,size:o.size||34,w:700,col:o.col||WC_INK});}
scene("role",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tOp=c("opens"),tMod=w("opens","own model"),tL=c("learner"),tKeys=w("learner","with keys"),tSo=c("someone"),tRel=w("someone","It's how"),tN=c("none"),tWr=w("none","writes it");
  // the camera: Noor and the map; in on the learner, Noor at the edge of the shot; back out to the whole model
  m1_open(ctx,S,t,sc,"office",[[0,960,540,1],[tL-0.3,1120,450,1.2],[tN-0.3,960,540,1]]);
  // the university's own model, pinned up as she opens it; the rest of it fades while we look at the learner
  const sp=fin(t,tL+0.2,0.6)*(1-fin(t,tN-0.3,0.6));
  arrive(ctx,1230,456,t,tMod-0.5,()=>m1_map(ctx,{hi:fin(t,tL+0.3,0.5),spot:sp}),{d:0.9,from:0.97});
  // the learner: a good one, with keys from three systems and a decision for every match
  const kA=1-fin(t,tSo-0.3,0.5),[lx,ly,lw,lh]=m1_ent("learner");
  if(kA>0.01)withA(ctx,kA,()=>{wc_link(ctx,lx+lw+8,ly+lh/2,1174,ly+lh/2,WC_ROLE.student,{p:clamp((t-tKeys+0.5)/0.5,0,1),a:0.85});
    arrive(ctx,1490,321,t,tKeys-0.2,()=>m1_keys(ctx,1180,190),{dy:16});});
  // but a learner is a role: Noor circles it, and says so in pencil
  wc_ring(ctx,lx+lw/2,ly+lh/2,lw/2+30,lh/2+18,clamp((t-tSo-0.3)/0.8,0,1),{seed:21});
  m1_note(ctx,t,"a role, not someone",lx+lw+44,ly+36,tRel-0.4,1.2);
  // the model has no person: the other roles too, and a gap where the person should be
  ["applicant","staff member"].forEach((e,i)=>{const [ex,ey,ew,eh]=m1_ent(e);wc_ring(ctx,ex+ew/2,ey+eh/2,ew/2+26,eh/2+16,clamp((t-tN-0.4-i*0.4)/0.7,0,1),{seed:23+i,a:0.65});});
  const gp=fin(t,tN+0.2,0.6);if(gp>0.01)withA(ctx,gp,()=>{wc_panel(ctx,650,108,170,56,{kind:"card",dashed:true,role:WC_PENCIL});wc_T(ctx,"person?",735,147,{w:800,size:30,align:"center",col:WC_INK});});
  arrive(ctx,1038,136,t,tN+0.6,()=>wc_tag(ctx,840,136,"the model has no person",{}),{dy:8});
  // she writes the decision down, on a card where her name was, pinned behind her
  arrive(ctx,220,772,t,tWr-0.6,()=>m1_decision(ctx,30,674,clamp((t-tWr+0.2)/1.6,0,1)),{dy:16});
  // Noor, and her name until the camera moves in; she says so, a hand out to the roles
  const ex=fin(t,tN-0.1,0.6)*(1-fin(t,tWr-0.6,0.6)),na=1-fin(t,tL-0.3,0.5);
  arrive(ctx,470,700,t,tOp-0.6,()=>person(ctx,"noor",470,1010,0.95,{pose:"stand",pose2:"explain",mix:ex,expr:"calm",t}),{d:0.9,from:0.97});
  if(na>0.01)withA(ctx,na,()=>arrive(ctx,210,784,t,tOp,()=>{wc_panel(ctx,30,730,360,108,{kind:"card"});wc_T(ctx,"Noor Rahman",58,776,{w:800,size:32,col:WC_DARK});wc_T(ctx,"data architect",58,816,{w:600,size:28,col:WC_MUTED});},{dy:12}));
  m1_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 6. Four things, kept apart ---------- */
// a lane's name, faint until it's named; what it holds, once it is
function m1_laneHead(ctx,y,head,sub,ha,sa){withA(ctx,ha,()=>wc_T(ctx,head,M1_AX,y,{w:800,size:36,col:WC_DARK}));if(sa>0.01)withA(ctx,sa,()=>wc_T(ctx,sub,M1_AX+tw(ctx,head,36,800)+20,y,{w:600,size:28,col:WC_MUTED}));}
scene("apart",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tD=c("draws"),tP=c("person"),tR=c("roles"),tRole={student:w("roles","student"),tutor:w("roles","tutor"),researcher:w("roles","researcher"),alumna:w("roles","each with")+0.5},
    tC=c("contacts"),tEm=w("contacts","an email"),tPu=w("contacts","each with"),tSh=w("contacts","some shared"),tI=c("ids"),tSn=w("ids","a student number"),tSf=w("ids","a staff number"),
    tN=c("none"),tE=c("ea"),tAct=w("ea","is an actor"),tAs=w("ea","assigned to"),tTime=w("ea","for a time");
  // the camera: down the lanes as each is named; out for the person; across for enterprise architecture's picture
  m1_open(ctx,S,t,sc,"plain",[[0,960,540,1],[tR-0.3,1032,470,1.1],[tC-0.3,1032,500,1.1],[tI-0.3,1032,520,1.1],[tN-0.3,960,540,1]]);
  // enterprise architecture's picture comes in over the lower lanes once they've stepped back, and leaves before they return
  const [fx,fy,fs]=M1_FIG,eIn=fin(t,tE,0.7),ea=eIn*(1-fin(t,B+0.2,0.4)),dl=fin(t,tE-0.3,0.5)*(1-fin(t,B+0.5,0.6)),wp=fin(t,tP,0.9),bandY=i=>wc_bandY("linh",fs,fy,i);
  // the lanes' names, faint as she draws four things apart, full as each is named
  const lanes=[[140,"roles","a start, an end, an owner",tR],[412,"contact points","a purpose, sometimes shared",tC],[654,"identifiers","issued by a system",tI]];
  lanes.forEach(([y,h,sub,t1],i)=>withA(ctx,i?1-0.85*dl:1,()=>arrive(ctx,M1_AX+150,y-12,t,tD+0.3+i*0.3,()=>m1_laneHead(ctx,y,h,sub,0.4+0.6*fin(t,t1-0.2,0.5),fin(t,t1+0.3,0.5)),{dy:10})));
  // the links from her to each lane
  [[0,204,tR],[1,500,tEm],[2,742,tSn]].forEach(([i,ly,t1])=>withA(ctx,i?1-0.85*dl:1,()=>wc_link(ctx,fx+92,bandY(i),M1_AX-16,ly,WC_PENCIL,{p:clamp((t-t1)/0.8,0,1),a:0.55})));
  // roles: each dated, each with an owner
  M1_ROLES.forEach(([r,n,d,x,y])=>arrive(ctx,x+280,y+36,t,tRole[r],()=>wc_chip(ctx,x,y,560,72,r,n,d,{}),{dy:12}));
  withA(ctx,1-0.85*dl,()=>{
    // contact points: each with a purpose, and one shared by two people
    arrive(ctx,980,501,t,tEm,()=>wc_info(ctx,700,440,560,122,"linh.nguyen@mail.example","personal · Linh",{bigSize:28}),{dy:12});
    arrive(ctx,1564,501,t,tPu,()=>wc_info(ctx,1284,440,560,122,"7 Hill Road","home · Linh and her brother",{bigSize:28,badge:"shared",ba:fin(t,tSh,0.4)}),{dy:12});
    // identifiers: each issued by a system
    M1_IDS.forEach(([k,by,x,iw],i)=>arrive(ctx,x+iw/2,743,t,[tSn,tSf,tSf+1.1][i],()=>wc_info(ctx,x,682,iw,122,k,by),{dy:12}));});
  // the person: someone, once, in white paper, wearing her roles' colours
  if(wp<1)withA(ctx,1-wp,()=>arrive(ctx,fx,fy-250,t,-0.3,()=>person(ctx,"linh",fx,fy,fs,{pose:"ease",t:1.2}),{d:0.8}));
  wc_white(ctx,"linh",fx,fy,fs,m1_bands(M1_BANDS.map(r=>fin(t,tRole[r],0.5))),{a:wp});
  arrive(ctx,fx,254,t,tP+0.3,()=>{wc_panel(ctx,fx-130,196,260,116,{kind:"card"});wc_T(ctx,"the person",fx,246,{w:800,size:36,align:"center",col:WC_DARK});
    wc_T(ctx,"someone, once",fx,290,{w:600,size:28,align:"center",col:WC_MUTED});},{dy:10});
  arrive(ctx,fx,140,t,tN+0.1,()=>withA(ctx,1-fin(t,tE+0.4,0.6),()=>wc_tag(ctx,fx,140,"none of them is the person",{align:"center"})),{dy:8});
  // enterprise architects draw it the same way: an actor, assigned to roles, for a time
  if(ea>0.01){ctx.save();ctx.translate((1-ease(eIn))*260,0);withA(ctx,ea,()=>m1_ea(ctx,t,M1_AX,384,tAct,tAs,tTime));ctx.restore();}
  m1_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 7. Who keeps what ---------- */
scene("keeps",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tW=c("write"),tR=c("roles"),tA=c("attrs"),tL=c("legal"),tO=c("own"),tOe=w("own","home address"),tH=c("hr"),tM=c("mei"),tWho=w("mei","who someone");
  // the camera: the sheet as it's written, down its rows; up to the person, and Mei
  m1_open(ctx,S,t,sc,"office",[[0,960,540,1],[tR-0.3,980,450,1.08],[tA-0.3,980,560,1.08],[tM-0.4,1000,482,1.06]]);
  arrive(ctx,940,433,t,tW+0.3,()=>m1_keeps(ctx,t,{roles:[0,1,2,3].map(i=>tR+0.3+i*0.45),dets:[0,1,2,3].map(i=>tA+0.3+i*0.4),keep:[tL+0.3,tO+0.3,tOe,tH+0.3],person:tM+0.2,tick:tWho}),{d:0.9,from:0.97});
  // Noor, who writes it down with Mei; Mei, whose office looks after the person
  arrive(ctx,230,700,t,-0.3,()=>person(ctx,"noor",230,1010,0.95,{pose:"stand",expr:"calm",t}),{d:0.8});
  arrive(ctx,1700,700,t,tW+0.4,()=>m1_person(ctx,"mei",1700,1010,0.95,{pose:"stand",pose2:"explain",mix:fin(t,tM-0.2,0.6),expr:t>tWho+0.6?"relieved":"calm",t,flip:true}),{d:0.9,from:0.96});
  arrive(ctx,1675,304,t,tW+0.9,()=>{wc_panel(ctx,1510,250,330,108,{kind:"card"});wc_T(ctx,"Mei Tanaka",1538,296,{w:800,size:32,col:WC_DARK});wc_T(ctx,"registrar's office",1538,336,{w:600,size:28,col:WC_MUTED});},{dy:12});
  m1_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 8. Elsewhere ---------- */
// a role in another industry, as a chip in the industry's colour, its name at 28 px
function m1_rchip(ctx,x,y,ind,label,o){o=o||{};const w=Math.round(tw(ctx,label,28,800)+48);wc_panel(ctx,x,y,w,56,{kind:"chip",role:WC_IND[ind],dashed:o.dashed,seed:label.length});
  wc_T(ctx,label,x+24,y+38,{w:800,size:28,col:WC_DARK});return w;}
scene("elsewhere",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tE=c("every"),tNu=c("nurse"),tPa=w("nurse","as a patient"),tB=c("bank"),tG=w("bank","guarantees"),tLo=w("bank","a friend's loan"),
    tH=c("home"),tAh=w("home","the account holder"),tOut=w("home","moved out"),tSt=w("home","the person who stays"),tPow=w("home","the power on"),tS=c("same");
  m1_open(ctx,S,t,sc,"plainB",[[0,960,540,1]]);
  const on=[tNu,tB,tH],[X0,X1,X2]=M1_PAN.map(p=>p[0]),FY=M1_PY+520;
  // the industry being told stands out; the others step back until the last line, which is about all three
  const any=fin(t,tNu-0.3,0.5)*(1-fin(t,tS-0.3,0.5)),act=[fin(t,tNu-0.3,0.5)*(1-fin(t,tB-0.3,0.5)),fin(t,tB-0.3,0.5)*(1-fin(t,tH-0.3,0.5)),fin(t,tH-0.3,0.5)],pa=i=>1-0.6*any*(1-act[i]);
  // in each, someone like Linh, in white paper
  M1_PAN.forEach(([x],i)=>withA(ctx,pa(i),()=>{arrive(ctx,x+M1_PW/2,M1_PY+M1_PH/2,t,tE+0.2+i*0.25,()=>m1_panel(ctx,i),{dy:16});
    wc_white(ctx,"linh",x+150,FY,0.48,[],{a:fin(t,on[i]-0.2,0.6)});}));
  // a hospital: a nurse, admitted as a patient, with a wall between the two records
  withA(ctx,pa(0),()=>{arrive(ctx,X0+400,328,t,tNu+0.4,()=>m1_rchip(ctx,X0+268,300,"health","a nurse"),{dy:10});
    arrive(ctx,X0+410,393,t,tPa,()=>m1_wall(ctx,X0+268,382,270),{dy:6});
    arrive(ctx,X0+400,446,t,tPa+0.2,()=>m1_rchip(ctx,X0+268,418,"health","a patient"),{dy:10});});
  // a bank: a customer, who guarantees a friend's loan
  withA(ctx,pa(1),()=>{arrive(ctx,X1+400,328,t,tB+0.3,()=>m1_rchip(ctx,X1+268,300,"bank","a customer"),{dy:10});
    arrive(ctx,X1+400,446,t,tG,()=>m1_rchip(ctx,X1+268,418,"bank","a guarantor"),{dy:10});
    wc_link(ctx,X1+340,476,X1+420,540,WC_IND.bank,{p:clamp((t-tLo)/0.6,0,1),vertical:true,a:0.9});
    arrive(ctx,X1+420,566,t,tLo+0.3,()=>wc_tag(ctx,X1+420,566,"a friend's loan",{align:"center",size:28,w:600}),{dy:8});});
  // an energy company: the account holder moves out; the occupant stays, and needs the power on
  withA(ctx,pa(2),()=>{withA(ctx,fin(t,tH,0.5),()=>m1_meter(ctx,X2+40,186));
    const walk=clamp((t-tOut)/1.8,0,1),mx=X2+440+ease(walk)*190,ma=fin(t,tAh-0.3,0.5)*(1-clamp((walk-0.35)/0.5,0,1)),ca=fin(t,tAh-0.3,0.5)*(1-0.62*clamp(walk/0.6,0,1));
    if(ma>0.01){ctx.save();ctx.beginPath();ctx.rect(X2,M1_PY,M1_PW,M1_PH);ctx.clip();wc_white(ctx,"minh",mx,FY,0.44,[],{a:ma});ctx.restore();}
    // his role stays behind, dashed and faint, when he moves out
    if(ca>0.01)withA(ctx,ca,()=>m1_rchip(ctx,X2+280,206,"energy","an account holder",{dashed:walk>0}));
    arrive(ctx,X2+400,328,t,tSt,()=>m1_rchip(ctx,X2+268,300,"energy","an occupant"),{dy:10});
    arrive(ctx,X2+400,410,t,tPow,()=>{wc_tag(ctx,X2+300,410,"life support",{size:28,w:600});m1_heart(ctx,X2+284,412,1.1);},{dy:8});});
  // different words, the same four things
  const sa=fin(t,tS-0.1,0.5);if(sa>0.01)withA(ctx,sa,()=>{const items=["the person","roles","contact points","identifiers"],lead="the same four things:",lw=tw(ctx,lead,32,800),
      ws=items.map(s=>Math.round(tw(ctx,s,28,700)+40)),tot=lw+28+ws.reduce((a,b)=>a+b,0)+(items.length-1)*16;let x=960-tot/2;
    wc_T(ctx,lead,x,742,{w:800,size:32,col:WC_DARK});x+=lw+28;items.forEach((s,i)=>{const xx=x;arrive(ctx,xx+ws[i]/2,733,t,tS+0.3+i*0.2,()=>{wc_panel(ctx,xx,707,ws[i],52,{kind:"tag",seed:i+9});
      wc_T(ctx,s,xx+20,743,{w:700,size:28,col:WC_DARK});},{dy:8});x+=ws[i]+16;});});
  m1_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 9. Named once ---------- */
scene("dama",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tD=c("dama"),tRM=w("dama","reference and master"),tF=c("four"),tSt=[w("four","a registry"),w("four","a copy"),w("four","a master that"),w("four","one place")],tLa=c("later");
  // the camera: the wheel; across to the four ways; out
  m1_open(ctx,S,t,sc,"plain",[[0,835,500,1.15],[tF-0.3,1010,500,1.1],[tLa-0.3,1000,520,1.04]]);
  arrive(ctx,440,150,t,tD-0.2,()=>{wc_T(ctx,"DAMA",440,134,{w:800,size:44,align:"center",col:WC_DARK});wc_T(ctx,"the data management body of knowledge",440,176,{w:600,size:28,align:"center",col:WC_MUTED});},{dy:10});
  m1_wheel(ctx,t,tD+0.2,tRM);
  const [cx,cy,r]=M1_WH,an=-Math.PI/2+(M1_LITW+0.5)*TAU/10,tx=cx+Math.cos(an)*(r+40),ty=cy+Math.sin(an)*(r+40);
  arrive(ctx,tx+60,ty,t,tRM+0.3,()=>wc_tag(ctx,tx+60,ty,"reference and master data",{align:"center",col:WC_ROLEINK.student}),{dy:8});
  // its four ways to keep master data, one by one
  M1_STYLES.forEach((s,i)=>m1_style(ctx,t,i,tSt[i]-0.2));
  arrive(ctx,1460,96,t,tLa+0.4,()=>wc_tag(ctx,1460,96,"chosen in Film 7 of 9",{align:"center"}),{dy:8});
  m1_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 10. Not only people ---------- */
// the checklist: four questions, and three things put to them, a tick or a cross landing as each question is asked
function m1_check(ctx,t,tQ,tY,t0){wc_panel(ctx,110,136,1700,668,{kind:"sheet",seed:8});wc_T(ctx,"four questions",150,240,{w:800,size:36,col:WC_DARK});
  M1_EX.forEach(([ind,label],j)=>{const x=M1_QX[j],cw=Math.round(tw(ctx,label,30,800)+56),col=typeof ind==="string"?WC_IND[ind]:ind,white=j===0?fin(t,tY+0.3,0.6):0;
    arrive(ctx,x,226,t,t0+0.5+j*0.2,()=>{withA(ctx,1-white,()=>wc_chip(ctx,x-cw/2,196,cw,60,col,label,null,{seed:j+4}));
      if(white>0.01)withA(ctx,white,()=>{wc_panel(ctx,x-cw/2,196,cw,60,{kind:"tag",seed:j});wc_T(ctx,label,x-cw/2+28,237,{w:800,size:30,col:WC_DARK});});},{dy:10});});
  M1_QS.forEach((q,i)=>{const y=M1_QY[i];withA(ctx,0.4+0.6*fin(t,tQ[i]-0.2,0.4),()=>{ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.8);ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(176,y-2,22,0,TAU);ctx.stroke();ctx.restore();
      wc_T(ctx,String(i+1),176,y+8,{w:800,size:28,align:"center",col:WC_DARK});wc_T(ctx,q,222,y+11,{w:700,size:32,col:WC_DARK});});
    M1_EX.forEach(([ind,label,ans],j)=>{if(i>=ans.length)return;const p=clamp((t-tQ[i]-0.6-j*0.35)/0.4,0,1);if(p<=0)return;
      if(ans[i])wc_tick(ctx,M1_QX[j],y-6,46,WC_ROLEINK.alumna,p,5.5);else wc_cross(ctx,M1_QX[j],y-4,40,WC_NO,p);});});
  M1_EX.forEach(([ind,label,ans,v],j)=>{const tv=j===0?tY:tQ[ans.length-1]+1.6;arrive(ctx,M1_QX[j],738,t,tv,()=>wc_T(ctx,v,M1_QX[j],750,{w:800,size:30,align:"center",col:j===0?WC_ROLEINK.alumna:WC_INK}),{dy:8});});}
scene("entities",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tO=c("only"),tWh=c("which"),tAsk=w("which","Ask four"),tQ=["q1","q2","q3","q4"].map(c),tY=c("yes");
  // when each row's line starts, and the word each thing is named on
  const lines=["uni","health","bank","utility","shop"],words=[["employers","partner universities","awards","units","campuses","rooms"],["patients","practitioners","wards"],
    ["customers","accounts","firms"],["meters","connection points","poles"],["products","suppliers","stores"]];
  m1_open(ctx,S,t,sc,"plain",[[0,960,540,1],[tAsk-0.3,960,500,1.04]]);
  // a gallery round Linh: the other things a business is about, by industry; it stays while "which of them" is asked, and gives way to the questions
  const gal=1-fin(t,tAsk-0.5,0.6);
  if(gal>0.01)withA(ctx,gal,()=>{wc_white(ctx,"linh",200,840,0.66,m1_bands([1,1,1,1]),{a:fin(t,tO-0.2,0.6)});
    arrive(ctx,200,436,t,tO+0.3,()=>wc_tag(ctx,200,436,"a person",{align:"center"}),{dy:8});
    M1_GAL.forEach(([ind,name,items],i)=>{const y=168+i*128,t1=c(lines[i]);if(t<t1-0.3)return;
      arrive(ctx,580,y,t,t1-0.2,()=>wc_T(ctx,name,580,y+11,{w:800,size:30,align:"right",col:wc_dim(WC_IND[ind],0.45)}),{dy:8});
      let x=610;items.forEach((it,k)=>{const cw=Math.round(tw(ctx,it,30,800)+56),xx=x;arrive(ctx,xx+cw/2,y,t,w(lines[i],words[i][k])-0.1,()=>wc_chip(ctx,xx,y-30,cw,60,WC_IND[ind],it,null,{seed:k+i*7}),{dy:10});x+=cw+16;});});});
  // which need mastering: four questions
  const qa=fin(t,tAsk-0.3,0.7);if(qa>0.01)withA(ctx,qa,()=>m1_check(ctx,t,tQ,tY,tAsk));
  m1_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 11. The series ---------- */
scene("series",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tFour=w("parts","four parts"),tp=[w("names","Who someone"),w("names","Roles and"),w("names","Sharing"),w("names","keeping")];
  // the whole line in frame, and this film on it; the four parts, blank as they're counted, each named in turn, with its two films
  m1_open(ctx,S,t,sc,"plain",[[0,960,540,1]]);
  const lp=clamp(t/1.6,0,1);ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.7);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(90,540);ctx.lineTo(lerp(90,1830,ease(lp)),540);ctx.stroke();ctx.restore();
  arrive(ctx,200,366,t,0.2,()=>m1_film(ctx,0,true),{dy:-16});
  M1_PX.forEach((x,g)=>{arrive(ctx,x,540,t,tFour+g*0.12,()=>m1_part(ctx,g,fin(t,tp[g]-0.1,0.4)),{dy:8});
    [1,2].forEach(k=>{const i=g*2+k,up=k===1;arrive(ctx,x,up?366:714,t,tp[g]+(up?0.15:0.4),()=>m1_film(ctx,i,false),{dy:up?-16:16});});});
  m1_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 12. Found first ---------- */
scene("found",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tAp=w("now","Linh applies"),tFind=w("now","finds her"),tRole=w("adds","a role"),tDeg=w("there","Her degree"),tAl=w("there","the alumni"),tSee=w("there","sees"),tK=c("know");
  m1_open(ctx,S,t,sc,"campus",[[0,960,540,1],[tK-0.3,960,530,1.03]]);
  m1_hush(ctx,0.45);
  // the cards step back while the line is said, so it, and the person, read on their own
  const rb=1-0.65*fin(t,tK-0.4,0.6),AY=196,MY=486,BY=wc_bandY("linh",1.02,M1_LY,0);
  withA(ctx,rb,()=>{
    // this time the university looks for her first, and finds her
    wc_link(ctx,M1_FX-6,AY+150,M1_LX+40,M1_LY-520,WC_ROLE.applicant,{p:clamp((t-tFind)/0.8,0,1),a:0.85});
    // the role it adds, beside her
    wc_link(ctx,M1_LX+72,BY,694,BY,WC_ROLE.student,{p:clamp((t-tRole-0.2)/0.4,0,1),a:0.85});});
  // Linh, as the person, as she was in July 2025: a tutor and an alumna, and now a student again
  wc_white(ctx,"linh",M1_LX,M1_LY,1.02,m1_july(fin(t,tRole,0.6)),{});
  withA(ctx,rb,()=>{
    arrive(ctx,M1_FX+M1_APPW/2,AY+118,t,tAp-0.3,()=>m1_app(ctx,M1_FX,AY,{found:clamp((t-tFind-0.7)/1.0,0,1),file:clamp((t-tDeg)/1.2,0,1)}),{dy:16});
    arrive(ctx,920,BY,t,tRole+0.3,()=>wc_chip(ctx,700,BY-28,440,56,"student","Student","from Jul 2025",{}),{dy:10});
    arrive(ctx,M1_FX+M1_MAILW/2,MY+90,t,tAl-0.3,()=>m1_mail(ctx,M1_FX,MY,{back:clamp((t-tSee)/1.0,0,1)}),{dy:16});});
  m1_close(ctx,S);
  wc_year(ctx,64,80,"July 2025 · the university",fin(t,0.3,0.6)*(1-fin(t,tK-0.4,0.6)));wc_paperOver(ctx,S);
  // the line, then carried down onto the end card, above the veil, landing where the card's own line fades in and takes it over
  const KL="Know the person, not just the role.",kl=fin(t,tK-0.1,0.6),ky=lerp(128,420,fin(t,B+0.3,1.1)),kg=kl*(1-fin(t,B+0.8,0.9));
  if(kg>0.01){setScreen(ctx,S);withA(ctx,kg,()=>{ctx.save();ctx.translate(960,ky-16);ctx.scale(1,0.2);const g=ctx.createRadialGradient(0,0,10,0,0,640);
    g.addColorStop(0,rgba(WC_PAPER,0.94));g.addColorStop(0.7,rgba(WC_PAPER,0.7));g.addColorStop(1,rgba(WC_PAPER,0));ctx.fillStyle=g;ctx.fillRect(-640,-640,1280,1280);ctx.restore();});}
  wc_end(ctx,S,t,B+0.8,"One person, many roles",KL,"Film 1 of 9");
  if(kl>0.01&&t<B+2.4){setScreen(ctx,S);withA(ctx,kl,()=>wc_T(ctx,KL,960,ky,{w:700,size:48,align:"center",col:WC_DARK}));}});
