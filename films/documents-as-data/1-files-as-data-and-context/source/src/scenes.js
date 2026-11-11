/* ===== Files as data and as context: the scenes =====
   Five chapters, each timed to its narration: wAt(sc, "line", "word") is the moment a word is said. The opening moves between three
   rooms of the 1840s and 1850s (the Navy's office, the chart of the oceans, the hall in Brussels), each painted once, and comes to the
   university's night map for its last lines and the title card. The four chapters after it each stay in one room, the map, where the
   camera holds and only what changes fades; the chapters open on the one before (ag_cutInto), and the last goes back to the chart,
   then to the map for its end. Words over the chart are drawn in the frame itself (fd_scr), so they stay put while the camera moves. */

const fd_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
const fd_k=(tt,t0)=>clamp(tt-t0,0,1);
// the film's name at the top left, and the chapter's case under it
function fd_top(ctx,a){md_label(ctx,96,100,"Files as data and as context",{col:MD.soft,a});}
function fd_case(ctx,text,a,col){md_tag(ctx,96,166,text,{col:col||MD.soft,a});}
// a person, faded as one picture
function fd_who(ctx,who,x,y,s,a,o){if(a<=0.004)return null;let h=null;withA(ctx,a,()=>{h=md_person(ctx,who,x,y,s,o);});return h;}
// a lane of the map's light from a to b, drawn as far as u, with what moves along it
function fd_link(ctx,a,b,u,t,o){o=o||{};if(u<=0)return;const pts=o.pts||md_curve(a,b,{bend:o.bend==null?0.5:o.bend});md_lane(ctx,pts,o.col||MD.flow,o.a==null?0.85:o.a,{u,dash:o.dash,t});
  if(u>=1&&o.flow!==false)md_flow(ctx,pts,t,{kind:o.kind||"events",col:o.col||MD.flow,a:o.a==null?1:o.a,every:o.every||1.1,off:o.off||0});}
// numbers counted up: from 0 to n over d seconds from t0, written with thousands separators
const fd_count=(tt,t0,d,n)=>Math.round(n*ag_eo((tt-t0)/d)).toLocaleString("en-US");

/* ---------------------------------------------------------------- 1 · Logbooks into charts */
// the three logbooks, small, side by side: where each sits, then its kind
const FD_THREE=[[110,250,520,0,-0.02],[700,226,520,1,0.015],[1290,256,520,2,-0.01]];
const FD_WAYS=["In columns","In sentences","In its own short hand"];
scene("logs",(ctx,S,t,sc)=>{const c=sc.cues,T=fd_once(sc,"T",()=>({
    wash:wAt(sc,"place","Washington"),navy:wAt(sc,"place","United States Navy"),charts:wAt(sc,"place","charts"),logbooks:wAt(sc,"place","logbooks"),
    record:wAt(sc,"logbook","daily record"),where:wAt(sc,"logbook","where it was"),wind:wAt(sc,"logbook","the wind"),weather:wAt(sc,"logbook","the weather"),current:wAt(sc,"logbook","the current"),flow:wAt(sc,"logbook","the sea's own flow"),
    thousands:wAt(sc,"unread","Thousands"),ownWay:wAt(sc,"unread","in its own way"),nobody:wAt(sc,"unread","nobody"),
    routes:wAt(sc,"habit","routes they knew"),winds:wAt(sc,"habit","winds and currents"),there:wAt(sc,"habit","really there"),
    weeks:wAt(sc,"weeks","weeks longer"),crews:wAt(sc,"weeks","the crews"),food:wAt(sc,"weeks","food and water"),cargo:wAt(sc,"weeks","cargo"),
    read:wAt(sc,"read","read its old logs"),tables:wAt(sc,"read","tables"),patch:wAt(sc,"read","each patch"),month:wAt(sc,"read","month by month"),
    drew:wAt(sc,"charts","drew"),free:wAt(sc,"charts","free"),captain:wAt(sc,"charts","any captain"),oneForm:wAt(sc,"charts","one set form"),back:wAt(sc,"charts","send it back"),
    y1853:wAt(sc,"brussels","eighteen fifty-three"),brussels:wAt(sc,"brussels","Brussels"),ten:wAt(sc,"brussels","ten nations"),quetelet:wAt(sc,"brussels","Adolphe Quetelet"),agreed:wAt(sc,"brussels","agreed one log"),flag:wAt(sc,"brussels","every flag"),
    count:wAt(sc,"saved","own count"),california:wAt(sc,"saved","California"),horn:wAt(sc,"saved","Cape Horn"),d183:wAt(sc,"saved","a hundred and eighty-three"),d135:wAt(sc,"saved","a hundred and thirty-five"),
    share:wAt(sc,"shared","share their weather data"),today:wAt(sc,"shared","still do today"),
    docs:wAt(sc,"same","Documents today"),people:wAt(sc,"same","written for people"),own2:wAt(sc,"same","in its own way"),
    readInto:wAt(sc,"answer","read into data"),worth:wAt(sc,"answer","worth it"),write:wAt(sc,"answer","what we write"),start:wAt(sc,"answer","from the start")}));
  const sea0=T.routes-1.1,hall0=T.y1853-0.9,sea1=T.count-0.9,map0=T.docs-0.9;
  // the race: the charts' ship arrives as 135 is said, the habit's 183/135 of the way later
  const r0=T.california-0.4,rD=(T.d135-r0)*183/135;
  ag_shots(ctx,S,t,sc.dur,[
    // the office in Washington: its shelves of logbooks, its chart on the wall; a logbook opens, then three, each kept its own way
    {at:0,place:"fdOffice",keys:[[0,960,560,1.0],[T.record-1.4,1010,570,1.05]],d:4.2,push:0.02,draw:(cx,tt)=>{
      glow(cx,420,470,560,FD.lamp,0.22*ag_io(tt,T.logbooks-0.1,T.record-0.3,0.6));glow(cx,1230,330,460,MD.flow,0.2*ag_io(tt,T.charts-0.1,T.logbooks+0.4,0.5));
      fd_scr(cx,S,()=>{const lA=ag_io(tt,0.5,T.record-0.6,0.7);md_label(cx,96,118,"Washington, 1842",{col:MD.soft,a:lA});md_T(cx,"The Navy's Depot of Charts and Instruments",96,166,{w:700,size:36,a:lA*ag_in(tt,T.navy-0.3,0.7)});
        // one logbook, open, close up; then it steps back beside two others
        const pA=ag_in(tt,T.record-0.7,0.6)*(1-ag_in(tt,sea0-1.0,0.6));if(pA<=0)return;cx.fillStyle="rgba(4,8,18,"+(0.5*pA)+")";cx.fillRect(0,0,1920,1080);
        const m=ag_sine((tt-T.thousands+0.3)/1.1),dim=ag_in(tt,T.nobody,1.2),sink=24*ag_sine((tt-T.nobody)/1.8);
        fd_logPage(cx,lerp(460,FD_THREE[0][0],m),lerp(170,FD_THREE[0][1],m)+sink,lerp(1000,520,m),0,{a:pA,rot:lerp(0,FD_THREE[0][4],m),dim,k:fd_k(tt,T.record-0.7),
          heads:[ag_in(tt,T.where-0.15,0.4),ag_in(tt,T.wind-0.15,0.4),ag_in(tt,T.weather-0.15,0.4),ag_in(tt,T.current-0.15,0.4)]});
        if(m<0.05){const fr=ag_io(tt,T.flow-0.1,T.thousands-0.4,0.4);if(fr>0)fd_ring(cx,{x:460+60+0.74*880-6,y:170+142,w:170,h:46},MD.flow,fr*pA,6);}
        for(let i=1;i<3;i++){const [x,y,w,kind,rot]=FD_THREE[i],q=ag_in(tt,T.thousands+0.15+i*0.3,0.6);if(q<=0)continue;fd_logPage(cx,x+(1-ag_eo(q))*260,y+sink,w,kind,{a:q*pA,rot,dim});}
        FD_WAYS.forEach((s,i)=>{const [x,y,w]=FD_THREE[i],q=ag_io(tt,T.ownWay+i*0.35,T.nobody-0.1,0.4)*pA;md_T(cx,s,x+w/2,y+w*0.6+56,{w:700,size:30,align:"center",col:MD.soft,a:q});});
        if(dim>0)md_T(cx,"Kept, and never read again",960,840,{w:700,size:32,align:"center",col:MD.soft,a:dim*pA*ag_in(tt,T.nobody+0.4,0.6)});});}},
    // the oceans: the habit's road against the winds and currents that were there; the weeks it cost; the logs read into five-degree
    // squares, month by month; the charts drawn from them, free to any captain who keeps the one log and sends it back
    {at:sea0,place:"fdSea",dis:0.9,keys:[[0,800,525,1.2],[T.read-0.6,676,284,1.9],[T.drew-0.2,690,372,1.45]],d:2.4,push:0.015,draw:(cx,tt,cam)=>{
      const habA=1-0.6*ag_in(tt,c.change,1.0)-0.4*ag_in(tt,T.read-0.5,1.0),wA=0.45+0.55*ag_in(tt,T.winds-0.2,1.0),cA=ag_in(tt,T.winds+0.3,1.2)*(1-0.5*ag_in(tt,T.read-0.4,0.8))+0.5*ag_in(tt,T.drew,1.2);
      const month=5+clamp(Math.floor((tt-T.month)/0.55),0,5);
      fd_land(cx,{cam});fd_winds(cx,tt,{cam,a:wA*(1-0.6*ag_io(tt,T.read,T.drew,0.8)),calm:ag_io(tt,T.weeks,T.read,0.8),month:tt>T.month?month:5});fd_currents(cx,tt,{a:cA});
      fd_route(cx,"habit",ag_sine((tt-T.routes)/2.6),{a:habA,dash:true,t:tt});
      // the ship on the habit's road: it sails slowly, then lies in the calms for weeks
      const sp=clamp((tt-T.routes-0.4)/9,0,1),su=0.28*ag_eo(sp)+0.06*ag_sine((tt-T.weeks)/6),shA=ag_in(tt,T.routes+0.2,0.6)*(1-ag_in(tt,T.read-0.6,0.6));
      if(shA>0){const q=fd_along("habit",su);fd_ship(cx,q.x,q.y-4/cam.z,34/cam.z,q.dx<0,{a:shA});}
      for(const [k,side] of [["ny","left"],["sf","right"],["horn","left"]])fd_port(cx,cam,k,{side,a:ag_in(tt,T.routes,0.6)*(1-ag_in(tt,T.read-0.6,0.6))});
      fd_squares(cx,tt,{cam,a:ag_io(tt,T.tables-0.3,T.drew+0.2,0.6),u:ag_sine((tt-T.tables+0.2)/3.2),month:tt>T.month?month:5});
      fd_scr(cx,S,()=>{
        // what the weeks cost, and who paid
        [["More weeks at sea","clock",T.crews],["Food and water running low","warn",T.food],["Cargo and letters late","doc",T.cargo]].forEach(([s,ic,at_],i)=>md_tag(cx,1290,300+i*92,s,{col:MD.ink,icon:ic,a:ag_io(tt,at_-0.25,c.change-0.1,0.4)}));
        // the logs, read into the squares
        const lp=ag_io(tt,T.read-0.3,T.tables+0.8,0.4);for(let i=0;i<3;i++){const fly=ag_sine((tt-T.tables+0.3-i*0.12)/0.9);if(lp<=0)break;
          fd_logPage(cx,lerp(110+i*30,700,fly),lerp(170+i*40,330,fly),lerp(300,60,fly),i,{a:lp*(1-fly),rot:(i-1)*0.04});}
        const tA=ag_io(tt,T.patch-0.2,T.drew,0.5);if(tA>0){const mn=["June","July","August","September","October","November"][month-5]||"June",mm=tt>T.month?mn:"June";
          md_card(cx,1010,560,830,286,{edge:MD.flow,a:tA,glow:0.6});md_T(cx,"EACH PATCH OF OCEAN, MONTH BY MONTH",1038,610,{w:800,size:28,ls:4,col:MD.flow,a:tA});
          withA(cx,tA,()=>md_rows(cx,1032,630,[{h:"Patch",w:250},{h:"Month",w:200},{h:"Wind",w:150},{h:"Current",w:200}],
            [["35°N 70°W",mm,"SW","NE, 2 knots"],["25°N 50°W",mm,"NE","W, ½ knot"],["5°N 30°W",mm,"Calm","E, 1 knot"]],{rh:50}));}
        // the charts, free, for the one log sent back
        const chA=ag_in(tt,T.drew-0.1,0.6);md_tag(cx,96,120,"Wind and current chart",{col:MD.flow,icon:"doc",a:chA});
        const cpA=ag_in(tt,T.free-0.6,0.8);if(cpA>0)withA(cx,cpA,()=>fd_period(cx,"captain",330,590,1.0,{t:tt,gaze:[3,0],light:{warm:0.2},paper:(c2,x,y)=>fd_heldForm(c2,x,y,{gold:ag_in(tt,T.oneForm,0.6)})}));
        if(cpA>0)withA(cx,cpA,()=>{md_nameTag(cx,96,246,{name:"A captain"},{role:"Who keeps the log",col:MD.agreed});});
        md_tag(cx,560,330,"The charts, free",{col:MD.agreed,icon:"doc",a:ag_in(tt,T.free-0.1,0.5)});
        md_tag(cx,560,420,"The log, in one set form, sent back",{col:MD.agreed,icon:"contract",a:ag_in(tt,T.oneForm-0.1,0.5)});
        const bk=ag_sine((tt-T.back)/1.4);if(bk>0&&bk<1){const p=at(mk(md_curve([520,560],[260,140],{bend:0.4}).map(q=>P(q[0],q[1]))),bk);md_icon(cx,"contract",p.x,p.y,44,MD.agreed,{a:Math.sin(Math.PI*bk)});}});}},
    // Brussels, 1853: ten nations, Quetelet in the chair, and the one log they agreed
    {at:hall0,place:"fdHall",dis:0.9,keys:[[0,960,540,1.0]],push:0.025,draw:(cx,tt)=>{
      md_label(cx,96,118,"Brussels, 1853",{col:MD.soft,a:ag_in(tt,T.brussels-0.3,0.6)});
      md_person(cx,FD_P.quetelet,600,470,0.9,{t:tt,cut:792,gaze:[3,0],pose:"hold",holdBack:(c2,h)=>fd_heldForm(c2,h.near[0]-26,h.near[1]-58,{gold:ag_in(tt,T.agreed,0.8)}),front:c2=>fd_stock(c2)});
      md_nameTag(cx,730,262,{name:"Adolphe Quetelet"},{role:"Statistician, in the chair",col:MD.agreed,a:ag_in(tt,T.quetelet-0.2,0.6)});
      const nA=ag_in(tt,T.ten-0.3,0.6);if(nA>0){md_card(cx,1100,150,720,322,{a:nA});md_T(cx,"TEN NATIONS",1128,200,{w:800,size:28,ls:4,col:MD.soft,a:nA});
        const N=["Belgium","Denmark","France","Great Britain","The Netherlands","Norway","Portugal","Russia","Sweden","The United States"];
        N.forEach((s,i)=>md_T(cx,s,1128+(i>4?340:0),250+(i%5)*46,{w:600,size:28,a:nA*ag_in(tt,T.ten-0.1+i*0.08,0.3)}));}
      fd_form53(cx,1060,500,760,{a:ag_in(tt,T.agreed-0.3,0.5),k:fd_k(tt,T.agreed-0.3)});}},
    // the charts' count: two roads to California round Cape Horn, then the data the nations began to share
    {at:sea1,place:"fdSea",dis:0.9,keys:[[0,835,530,1.15],[T.share-0.7,760,337,1.6]],d:2.4,push:0.015,draw:(cx,tt,cam)=>{
      const rA=1-ag_in(tt,T.share-0.6,0.8);fd_land(cx,{cam});fd_winds(cx,tt,{cam,a:0.5});fd_currents(cx,tt,{a:0.35*rA});
      const dd=tt-r0,uH=clamp(dd/rD,0,1),uC=clamp(dd/(rD*135/183),0,1);
      fd_route(cx,"habit",ag_in(tt,sea1+0.3,1.4),{a:0.75*rA,dash:true,t:tt});fd_route(cx,"charted",ag_in(tt,T.count,1.4),{a:rA,col:MD.pass});
      if(dd>0&&rA>0){const h=fd_along("habit",uH),g=fd_along("charted",uC);fd_ship(cx,h.x,h.y-4/cam.z,30/cam.z,h.dx<0,{a:rA});fd_ship(cx,g.x,g.y-4/cam.z,30/cam.z,g.dx<0,{a:rA,col:MD.pass});}
      for(const [k,side] of [["ny","left"],["sf","right"],["horn","left"]])fd_port(cx,cam,k,{side,a:ag_in(tt,sea1+0.4,0.6)*rA});
      // the ports that began to share, and the lanes between them
      const pA=ag_in(tt,T.share-0.2,0.8);if(pA>0){const L=[["wash","london"],["ny","lisbon"],["wash","brussels"],["brest","rio"],["lisbon","rio"],["ny","hamburg"],["london","copen"]];
        L.forEach(([a_,b_],i)=>{const A=fd_xy(FD_PORT[a_][0],FD_PORT[a_][1]),B=fd_xy(FD_PORT[b_][0],FD_PORT[b_][1]),u=ag_sine((tt-T.share-i*0.15)/1.2);fd_link(cx,A,B,u,tt,{a:0.8*pA,bend:0.35,off:i*0.37,every:1.6});});
        for(const [k,side,dy] of [["wash","left",14],["ny","left",-26],["brussels","right",0],["london","left",-22],["lisbon","left",8],["hamburg","right",-14],["copen","right",-30],["brest","left",24],["rio","left",0]])fd_port(cx,cam,k,{side,dy,a:pA,size:28});}
      fd_scr(cx,S,()=>{const cA=ag_in(tt,T.count-0.3,0.6)*rA;if(cA>0){md_card(cx,1190,220,620,262,{edge:MD.pass,a:cA,glow:0.5});
          md_T(cx,"THE OFFICE'S OWN COUNT",1218,272,{w:800,size:28,ls:4,col:MD.pass,a:cA});md_T(cx,"New York to California,",1218,322,{w:600,size:28,col:MD.soft,a:cA});md_T(cx,"round Cape Horn",1218,358,{w:600,size:28,col:MD.soft,a:cA});
          md_T(cx,"183",1218,436,{w:800,size:48,col:FD.habit,a:cA*ag_in(tt,T.d183-0.1,0.4)});
          const ar=ag_in(tt,T.d135-0.5,0.4);if(ar>0){md_T(cx,"→",1326,436,{w:800,size:48,col:MD.soft,a:cA*ar});md_T(cx,"135 days",1400,436,{w:800,size:48,col:MD.pass,a:cA*ag_in(tt,T.d135-0.1,0.4)});}}
        md_tag(cx,1360,800,"Still shared today",{col:MD.flow,icon:"share",a:ag_in(tt,T.today-0.2,0.5)});});}},
    // today: documents written for people, each its own way; read into data where it's worth it, or written as data from the start
    {at:map0,place:"map",dis:0.9,keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
      const D=[[250,150,340,"invoice","An invoice"],[790,130,340,"contract","A contract"],[1310,200,400,"sheet","A claim for hours"]];
      D.forEach(([x,y,w,kind,lab],i)=>{const q=ag_in(tt,T.docs-0.4+i*0.35,0.6);if(q<=0)return;const rot=[-0.02,0.012,-0.015][i]*ag_in(tt,T.own2,0.8);
        if(kind==="invoice")fd_invoice(cx,x,y+(1-ag_eo(q))*30,w,0,{a:q,rot});else if(kind==="contract")fd_contract(cx,x,y+(1-ag_eo(q))*30,w,{a:q,rot,kind:"signed"});else fd_sheet(cx,x,y+(1-ag_eo(q))*30,w,0,{a:q,rot});
        md_T(cx,lab,x+w/2,620,{w:700,size:30,align:"center",col:MD.soft,a:q*ag_in(tt,T.people-0.3,0.5)});});
      fd_link(cx,[420,640],[420,690],ag_sine((tt-T.readInto+0.1)/0.7),tt,{col:MD.flow,pts:[[420,640],[420,700]],flow:false});
      md_table(cx,190,700,460,{name:"invoices",kind:"read into data",a:ag_in(tt,T.readInto,0.5),k:fd_k(tt,T.readInto)});
      md_tag(cx,700,752,"Where it's worth it",{col:MD.flow,a:ag_in(tt,T.worth-0.2,0.5)});
      fd_link(cx,[1510,520],[1510,690],ag_sine((tt-T.write+0.1)/0.7),tt,{col:MD.agreed,pts:[[1510,520],[1510,700]],flow:false});
      md_table(cx,1280,700,460,{name:"claims",kind:"written as data",col:MD.agreed,a:ag_in(tt,T.write,0.5),k:fd_k(tt,T.write)});
      md_tag(cx,1000,840,"From the start",{col:MD.agreed,a:ag_in(tt,T.start-0.2,0.5)});}}
  ],0.9);
  md_title(ctx,S,t,c.breath,"Files as data and as context","Read them, keep them, or write them as data","Documents and closing remarks · Modern data basics");});

/* ---------------------------------------------------------------- 2 · Invoices, read into data */
const FD_PATH="/Volumes/finance/supplier_invoices/incoming/LC-20931.pdf";
scene("invoices",(ctx,S,t,sc)=>{const c=sc.cues,T=fd_once(sc,"T",()=>({
    readThem:wAt(sc,"three","read them"),keepThem:wAt(sc,"three","keep them"),writeThem:wAt(sc,"three","write them as data"),
    n3860:wAt(sc,"october","three thousand"),pdf:wAt(sc,"october","P D F files"),layout:wAt(sc,"october","own layout"),
    team:wAt(sc,"check","team checks"),paid:wAt(sc,"check","before it's paid"),who:wAt(sc,"check","who sent it"),num:wAt(sc,"check","its number"),date:wAt(sc,"check","its date"),tot:wAt(sc,"check","its total"),line:wAt(sc,"check","each line"),
    hand:wAt(sc,"typed","typed them in by hand"),sept:wAt(sc,"typed","September"),twice:wAt(sc,"typed","sent twice"),paidTwice:wAt(sc,"typed","paid twice"),
    lands:wAt(sc,"volume","lands in a volume"),place:wAt(sc,"volume","a place for files"),gov:wAt(sc,"volume","governed in Unity Catalog"),asTables:wAt(sc,"volume","as tables are"),
    parse:wAt(sc,"parse","A I parse document"),reads:wAt(sc,"parse","reads each file"),words:wAt(sc,"parse","its words"),tables:wAt(sc,"parse","its tables"),sits:wAt(sc,"parse","where each sits"),
    extract:wAt(sc,"extract","A I extract"),fields:wAt(sc,"extract","the fields Finance names"),row:wAt(sc,"extract","one row for each invoice"),
    path:wAt(sc,"path","the path of its file"),open:wAt(sc,"path","open the invoice"),
    model:wAt(sc,"model","An AI model"),checked:wAt(sc,"model","checked like any other data"),film:wAt(sc,"model","Promises and proofs"),
    jun:wAt(sc,"checks","Jun Park's"),every:wAt(sc,"checks","every field read"),add:wAt(sc,"checks","add up to the total"),
    rules:wAt(sc,"rules","Finance's own rules"),before:wAt(sc,"rules","sent before"),know:wAt(sc,"rules","know the supplier"),
    n3734:wAt(sc,"passed","seven hundred and thirty-four"),passed:wAt(sc,"passed","passed every check"),
    person:wAt(sc,"person","went to a person"),reason:wAt(sc,"person","each with its reason"),nine:wAt(sc,"person","Nine"),
    fn:wAt(sc,"decides","The function reads"),sort:wAt(sc,"decides","the checks sort"),decides:wAt(sc,"decides","Rohan's team decides"),approves:wAt(sc,"decides","approves every payment")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"map",keys:[[0,960,540,1.0]],push:0.012,draw:(cx,tt)=>{
    fd_top(cx,1);
    // three kinds of documents, three answers
    const thA=1-ag_in(tt,c.october-0.9,0.6);
    [[150,"Supplier invoices","Read them","doc",MD.flow,T.readThem],[730,"Signed contracts","Keep them","contract",null,T.keepThem],[1310,"Claims for hours","Write them as data","table",MD.agreed,T.writeThem]].forEach(([x,k,ti,ic,ed,at_])=>{
      md_textCard(cx,x,330,460,{kick:k,title:ti},{icon:ic,edge:ed,a:ag_in(tt,at_-0.3,0.5)*thA,k:fd_k(tt,at_-0.3)});});
    fd_case(cx,"Supplier invoices · read them",ag_in(tt,c.october-0.6,0.6),MD.flow);
    // October's invoices, each in its supplier's layout
    const ocA=ag_io(tt,c.october-0.3,c.check-1.3,0.5);if(ocA>0){md_system(cx,96,420,440,"fin",{sub:"Receives the invoices",a:ocA});
      md_T(cx,"OCTOBER 2026",1200,240,{w:800,size:28,ls:4,col:MD.soft,a:ocA});md_T(cx,fd_count(tt,T.n3860-0.2,1.6,3860),1200,330,{w:800,size:84,a:ocA*ag_in(tt,T.n3860-0.3,0.4)});
      md_T(cx,"supplier invoices",1200,376,{w:600,size:30,col:MD.soft,a:ocA*ag_in(tt,T.n3860,0.5)});
      for(let i=0;i<4;i++){const q=ag_in(tt,T.pdf-0.4+i*0.25,0.5);if(q<=0)continue;fd_invoice(cx,640+i*300+(1-ag_eo(q))*60,440+(i%2)*26,260,i,{a:q*ocA,rot:[-0.03,0.02,-0.012,0.028][i]*ag_in(tt,T.layout,0.6)});}}
    // Rohan's team checks every one: the five things, read off the page
    const ckA=ag_io(tt,c.check-0.7,c.volume-0.9,0.6),wv=ag_io(tt,T.sept-0.4,c.volume-0.9,0.5);
    fd_who(cx,"rohan",300,590,0.98,ckA,{t:tt,gaze:[3,0]});md_nameTag(cx,420,400,"rohan",{role:"Finance",col:MD.dom.finance,a:ckA});
    if(ckA>0){const H={supplier:ag_in(tt,T.who-0.1,0.4),number:ag_in(tt,T.num-0.1,0.4),date:ag_in(tt,T.date-0.1,0.4),total:ag_in(tt,T.tot-0.1,0.4),lines:ag_in(tt,T.line-0.1,0.4)};
      fd_invoice(cx,640,190,460,0,{a:ckA,hl:H});
      const rA=ckA*(1-wv),V=[["Who sent it","Larkspur Catering"],["Number","LC-20931"],["Date","28 Oct 2026"],["Total","A$1,284.00"],["Lines","3"]],at_=[T.who,T.num,T.date,T.tot,T.line];
      // typed in by hand: the values go again, letter by letter
      const ty=k=>{const s=V[k][1],u=clamp((tt-T.hand-0.1-k*0.42)/0.4,0,1);return tt<T.hand-0.1?s:s.slice(0,Math.round(s.length*u))+(u<1&&u>0?"|":"");};
      if(rA>0){md_card(cx,1170,190,660,350,{a:rA});withA(cx,rA,()=>md_rows(cx,1190,200,[{h:"Finance checks",w:260},{h:"",w:360}],V.map((r,k)=>[r[0],{s:ty(k),f:k===1||k===3?"mono":undefined}]),{rh:56,rowA:(r,k)=>ag_in(tt,at_[k]-0.1,0.4)}));
        md_tag(cx,1190,600,"Typed in by hand",{col:MD.ink,icon:"person",a:rA*ag_in(tt,T.hand-0.2,0.5)});}
      // and in September, one invoice sent twice was paid twice
      if(wv>0){for(let i=0;i<2;i++){const q=ag_in(tt,T.twice-0.4+i*0.4,0.5)*wv;fd_invoice(cx,1190+i*330,210+i*20,290,2,{a:q,rot:i?0.03:-0.02});
          const st=ag_in(tt,T.paidTwice-0.2+i*0.25,0.3)*wv;if(st>0){cx.save();cx.globalAlpha*=st;cx.translate(1335+i*330,470+i*20);cx.rotate(-0.2);cx.strokeStyle=rgba(MD.fail,0.95);cx.lineWidth=4;rr(cx,-70,-26,140,52,8);cx.stroke();
            md_T(cx,"PAID",0,12,{w:800,size:32,ls:4,align:"center",col:MD.fail});cx.restore();}}
        md_T(cx,"September 2026",1190,180,{w:700,size:28,col:MD.soft,a:wv*ag_in(tt,T.sept-0.3,0.5)});md_pill(cx,1520,700,"Paid twice",{col:MD.fail,icon:"cross",a:wv*ag_in(tt,T.paidTwice,0.4),k:fd_k(tt,T.paidTwice)});}}
    // the volume: every file lands there, governed in Unity Catalog as tables are
    const voA=ag_io(tt,c.volume-0.6,c.parse-0.6,0.6);if(voA>0){md_window(cx,120,240,940,560,{logo:"databricks",product:"Databricks",title:"Catalog",a:voA,draw:(c2,b)=>{
        md_tree(c2,b.x+20,b.y+16,[{name:"finance",kind:"catalog",depth:0},{name:"supplier_invoices",kind:"schema",depth:1},{name:"incoming",kind:"volume",depth:2,col:MD.flow}],{rh:58});
        ["LC-20931.pdf","NLS-118402.pdf","TP-7716.pdf","CC-0459.pdf"].forEach((f,i)=>{const q=ag_in(tt,T.lands-0.2+i*0.35,0.5);if(q<=0)return;const yy=b.y+16+(3+i)*58,xx=b.x+20+3*40+(1-ag_eo(q))*-80;
          c2.save();c2.globalAlpha*=q;md_icon(c2,"doc",xx+16,yy+25,30,MD.ink);md_T(c2,f,xx+42,yy+35,{w:500,size:28,f:"mono"});c2.restore();});}});
      md_textCard(cx,1140,280,660,{kick:"A volume",title:"A place for files"},{icon:"volume",edge:MD.flow,a:voA*ag_in(tt,T.place-0.3,0.5),k:fd_k(tt,T.place-0.3)});
      md_textCard(cx,1140,470,660,{kick:"Unity Catalog",title:"Governed as tables are"},{icon:"lock",edge:MD.flow,a:voA*ag_in(tt,T.gov-0.3,0.5),k:fd_k(tt,T.gov-0.3)});}
    // the functions read it: the page's parts, then the fields Finance names, one row for each invoice, each with its file's path
    const fnA=ag_io(tt,c.parse-0.5,c.checks-0.7,0.6),pgA=fnA*(1-ag_in(tt,c.model-0.4,0.6));
    if(pgA>0){const inv=fd_invoice(cx,110,200,400,0,{a:pgA,parse:ag_in(tt,T.reads,1.6),hl:{total:0}}),R=inv.R;
      // a page too faint to draw has no parts to point at (fd_invoice returns no boxes), and its tags are as faint
      if(R.supplier){const tagA=pgA*(1-ag_in(tt,c.extract-0.3,0.5));md_tag(cx,R.supplier.x+R.supplier.w+20,R.supplier.y+R.supplier.h/2,"Words",{col:MD.flow,a:tagA*ag_in(tt,T.words-0.1,0.4)});
      md_tag(cx,R.lines.x+R.lines.w+20,R.lines.y+R.lines.h/2,"A table",{col:MD.flow,a:tagA*ag_in(tt,T.tables-0.1,0.4)});
      md_tag(cx,R.total.x+R.total.w+20,R.total.y+R.total.h/2,"Where it sits: page 1",{col:MD.flow,a:tagA*ag_in(tt,T.sits-0.1,0.4)});
      // the fields leave the page for their row
      const fl=ag_sine((tt-T.fields)/1.0);if(fl>0&&fl<1)["supplier","number","date","total"].forEach((nm,j)=>{const a_=[R[nm].x+R[nm].w/2,R[nm].y+R[nm].h/2],b_=[660+[195,545,815,1020][j],530],p=at(mk(md_curve(a_,b_,{bend:0.5}).map(q=>P(q[0],q[1]))),fl);
        glow(cx,p.x,p.y,26,MD.flow,0.7*Math.sin(Math.PI*fl));});
      // the path, followed back to the file
      const op=ag_io(tt,T.open-0.2,c.model-0.4,0.4);if(op>0)fd_link(cx,[600,770],[510,460],1,tt,{a:op,dash:true,flow:false,bend:0.3});}}
    if(fnA>0){md_textCard(cx,620,180,560,{kick:"A function",title:"ai_parse_document",sub:"Reads each file"},{mono:true,icon:"doc",edge:MD.flow,a:fnA*ag_in(tt,T.parse-0.3,0.5),k:fd_k(tt,T.parse-0.3)});
      md_textCard(cx,1240,180,580,{kick:"Another",title:"ai_extract",sub:"Takes out the fields"},{mono:true,icon:"table",edge:MD.flow,a:fnA*ag_in(tt,T.extract-0.3,0.5),k:fd_k(tt,T.extract-0.3)});
      const tbA=fnA*ag_in(tt,T.fields-0.2,0.5);if(tbA>0){md_card(cx,620,430,1200,250,{a:tbA});fd_rowsTable(cx,650,446,{a:tbA,rowA:i=>ag_in(tt,(i?T.row+0.1:T.fields+0.7)+i*0.3,0.4),lit:tt>T.path-0.2&&tt<c.checks?0:-1});}
      fd_kv(cx,620,710,1200,[["file_path",FD_PATH]],{fw:200,a:fnA*ag_in(tt,T.path-0.3,0.5),edge:MD.flow,rh:56});}
    // the reading is a model's, so it's checked like any other data
    const moA=ag_io(tt,c.model-0.3,c.checks-0.7,0.6);if(moA>0){withA(cx,moA,()=>ag_model(cx,310,400,96,{t:tt,think:0.4+0.4*ag_io(tt,T.model,T.checked,0.5),label:"AI model"}));
      md_tag(cx,310,600,"Checked like any other data",{align:"center",col:MD.pass,icon:"tick",a:moA*ag_in(tt,T.checked-0.2,0.5)});
      md_textCard(cx,96,680,430,{kick:"The film",title:"Promises and proofs"},{icon:"doc",a:moA*ag_in(tt,T.film-0.3,0.5),k:fd_k(tt,T.film-0.3)});}
    // Jun's data project checks each one; then Finance's own rules
    const jA=ag_io(tt,c.checks-0.6,c.passed-0.8,0.6);fd_who(cx,"jun",300,590,0.98,jA,{t:tt,gaze:[3,0]});md_nameTag(cx,420,400,"jun",{col:MD.flow,a:jA});
    if(jA>0){md_card(cx,620,180,580,236,{edge:MD.pass,a:jA*ag_in(tt,T.jun-0.2,0.5),glow:0.5});md_T(cx,"DATA TESTS",648,232,{w:800,size:28,ls:4,col:MD.pass,a:jA*ag_in(tt,T.jun-0.2,0.5)});
      [["Every field read",T.every],["The lines add up to the total",T.add]].forEach(([s,at_],i)=>{const q=jA*ag_in(tt,at_-0.1,0.4);md_icon(cx,"tick",668,292+i*70,32,MD.pass,{a:q});md_T(cx,s,700,302+i*70,{w:600,size:30,a:q});});
      md_card(cx,1240,180,580,236,{edge:MD.agreed,a:jA*ag_in(tt,T.rules-0.2,0.5),glow:0.5});md_T(cx,"FINANCE'S RULES",1268,232,{w:800,size:28,ls:4,col:MD.agreed,a:jA*ag_in(tt,T.rules-0.2,0.5)});
      [["Number sent before?",T.before],["Supplier known?",T.know]].forEach(([s,at_],i)=>{const q=jA*ag_in(tt,at_-0.1,0.4);md_icon(cx,"warn",1288,292+i*70,32,MD.agreed,{a:q});md_T(cx,s,1320,302+i*70,{w:600,size:30,a:q});});}
    // what passed, and what went to a person, each with its reason
    const sA=ag_io(tt,c.passed-0.6,c.decides-0.8,0.6);if(sA>0){const x0=640,w0=1180,fr=3734/3860,bar=ag_sine((tt-T.n3734+0.3)/1.2);
      md_T(cx,"OCTOBER'S 3,860 INVOICES",x0,236,{w:800,size:28,ls:4,col:MD.soft,a:sA});
      cx.save();cx.globalAlpha*=sA;rr(cx,x0,270,w0,40,20);cx.fillStyle="rgba(170,200,245,0.12)";cx.fill();if(bar>0){rr(cx,x0,270,w0*fr*bar,40,20);cx.fillStyle=rgba(MD.pass,0.9);cx.fill();}
        const pb=ag_in(tt,T.person-0.2,0.6);if(pb>0){rr(cx,x0+w0*fr+4,270,w0*(1-fr)-4,40,12);cx.fillStyle=rgba(MD.wait,0.95*pb);cx.fill();}cx.restore();
      md_T(cx,"3,734",x0,400,{w:800,size:64,col:MD.pass,a:sA*ag_in(tt,T.n3734-0.2,0.5)});md_T(cx,"passed every check",x0+200,400,{w:600,size:30,col:MD.soft,a:sA*ag_in(tt,T.passed-0.2,0.5)});
      const pA=sA*ag_in(tt,T.person-0.2,0.5);md_T(cx,"126",1340,400,{w:800,size:64,col:MD.wait,a:pA});md_T(cx,"to a person",1480,400,{w:600,size:30,col:MD.soft,a:pA});
      const rs=[["A field the function couldn't read","72"],["A supplier Finance doesn't know yet","31"],["Lines that don't add up to the total","14"],["Sent before: the same supplier and number","9"]];
      const lA=sA*ag_in(tt,T.reason-0.2,0.5);if(lA>0){md_card(cx,x0,450,w0,300,{edge:MD.wait,a:lA,glow:0.4});
        withA(cx,lA,()=>md_rows(cx,x0+20,456,[{h:"The first reason",w:960},{h:"",w:180}],rs.map(r=>[r[0],{s:r[1],f:"mono"}]),{rh:58,lit:tt>T.nine-0.2?3:-1,litCol:MD.wait,rowA:(r,i)=>ag_in(tt,T.reason+i*0.2,0.4)}));}}
    // the function reads, the checks sort, Rohan's team decides
    const dA=ag_in(tt,c.decides-0.6,0.6);fd_who(cx,"rohan",300,590,0.98,dA,{t:tt,gaze:[3,0]});md_nameTag(cx,420,400,"rohan",{role:"Finance",col:MD.dom.finance,a:dA});
    if(dA>0){[["The function reads","doc",MD.flow,T.fn],["The checks sort","tick",MD.pass,T.sort],["Rohan's team decides","person",MD.wait,T.decides]].forEach(([s,ic,col,at_],i)=>{
        md_textCard(cx,640+i*410,300,370,{title:s},{icon:ic,edge:col,a:dA*ag_in(tt,at_-0.2,0.5),k:fd_k(tt,at_-0.2)});
        if(i)fd_link(cx,[640+i*410-40,352],[640+i*410,352],ag_in(tt,at_-0.3,0.4),tt,{col,flow:false});});
      md_pill(cx,1230,600,"Every payment approved by a person",{col:MD.wait,icon:"person",a:dA*ag_in(tt,T.approves-0.2,0.5),k:fd_k(tt,T.approves-0.2)});}
    }}],0.6);});

/* ---------------------------------------------------------------- 3 · Contracts, kept as signed */
const FD_CDIR="/Volumes/hr/contracts/files/";
// Linh's contract as two files, and what the HR system wrote of each as it made it: its version, its kind, the day it was signed
const FD_CFILES=[["T-26188_v1.pdf","1","offer","null"],["T-26188_v2.pdf","2","signed","2026-07-14"]];
// the folder: its path, its two files, and once o.meta comes in, each file's metadata beside it, in mono, as code keeps its case.
// o.a, o.rowsA (its files come in), o.meta (0 to 1), o.lit and o.litA (a row glows, in o.litCol), o.dim and o.dimA (a row greys); returns where its rows are
function fd_folder(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,w=800,h=270,rows=[y+150,y+216];if(a<=0.004)return{x,y,w,h,rows};ctx.save();ctx.globalAlpha*=a;
  md_card(ctx,x,y,w,h,{glow:0.4});md_T(ctx,FD_CDIR,x+28,y+52,{w:500,size:28,f:"mono",col:MD.soft});md_icon(ctx,"volume",x+w-48,y+44,38,MD.flow);
  const m=o.meta||0,cols=[330,470,592];
  if(m>0)["version","kind","signed_on"].forEach((s,j)=>md_T(ctx,s,x+cols[j],y+108,{w:500,size:28,f:"mono",col:MD.soft,a:m}));
  FD_CFILES.forEach((r,i)=>{const yy=rows[i];ctx.save();ctx.globalAlpha*=o.rowsA==null?1:o.rowsA;if(o.dim===i)ctx.globalAlpha*=1-0.6*(o.dimA==null?1:o.dimA);
    if(o.lit===i&&o.litA>0){const lc=o.litCol||MD.agreed;ctx.save();ctx.globalAlpha*=o.litA;ctx.fillStyle=rgba(lc,0.13);rr(ctx,x+14,yy-30,w-28,60,10);ctx.fill();
      ctx.strokeStyle=rgba(lc,0.85);ctx.lineWidth=1.8;rr(ctx,x+14,yy-30,w-28,60,10);ctx.stroke();ctx.restore();}
    md_icon(ctx,"doc",x+46,yy,32,MD.ink);md_T(ctx,r[0],x+72,yy+10,{w:500,size:28,f:"mono"});
    if(m>0)[r[1],r[2],r[3]].forEach((s,j)=>md_T(ctx,s,x+cols[j],yy+10,{w:500,size:28,f:"mono",col:s==="null"?MD.dim:MD.ink,a:m}));ctx.restore();});
  ctx.restore();return{x,y,w,h,rows};}
scene("contracts",(ctx,S,t,sc)=>{const c=sc.cues,T=fd_once(sc,"T",()=>({
    official:wAt(sc,"official","official document"),kept:wAt(sc,"official","kept just as it was signed"),
    rewrites:wAt(sc,"beside","rewrites"),table:wAt(sc,"beside","as a table"),meta:wAt(sc,"beside","its metadata"),id:wAt(sc,"beside","the contract's ID"),version:wAt(sc,"beside","its version"),day:wAt(sc,"beside","the day it was signed"),file:wAt(sc,"beside","where its file is"),
    hr:wAt(sc,"writes","The HR system"),writes:wAt(sc,"writes","writes that metadata"),makes:wAt(sc,"writes","as it makes the document"),nobody:wAt(sc,"writes","nobody has to read it back"),
    num:wAt(sc,"linh","T two six one eight eight"),two:wAt(sc,"linh","two files"),offer:wAt(sc,"linh","the offer"),jul9:wAt(sc,"linh","ninth of July"),signed:wAt(sc,"linh","she signed"),jul14:wAt(sc,"linh","fourteenth"),
    nov13:wAt(sc,"week","thirteenth of November"),added:wAt(sc,"week","added a week"),marking:wAt(sc,"week","for marking"),
    alike:wAt(sc,"alike","look alike"),byMeta:wAt(sc,"alike","By their metadata"),
    asks:wAt(sc,"ends","Linh asks"),finder:wAt(sc,"ends","a person or an agent"),finds:wAt(sc,"ends","finds the signed version"),cites:wAt(sc,"ends","cites its file"),nov20:wAt(sc,"ends","the twentieth of November"),
    ce:wAt(sc,"context","Context engineering"),cm:wAt(sc,"context","Context and memory"),agentCtx:wAt(sc,"context","an agent's context"),
    ingrid:wAt(sc,"who","Ingrid Holm's"),dp:wAt(sc,"who","Data protection")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"map",keys:[[0,960,540,1.0]],push:0.012,draw:(cx,tt)=>{
    fd_top(cx,1);fd_case(cx,"Signed contracts · keep them",ag_in(tt,0.2,0.6),MD.ink);
    // the signed contract, kept as it was signed: no table of its terms, but its metadata beside it, which the HR system writes as it makes it
    const p1=1-ag_in(tt,c.linh-1.0,0.6);
    if(p1>0){const px=lerp(770,150,ag_sine((tt-c.beside+1.1)/1.3));fd_contract(cx,px,230,380,{a:ag_in(tt,c.official-0.6,0.6)*p1,kind:"signed",sign:ag_sine((tt-T.official+0.2)/1.6)});
      md_tag(cx,px,786,"Kept as it was signed",{col:MD.agreed,icon:"contract",a:p1*ag_in(tt,T.kept-0.2,0.5)});
      const gh=ag_io(tt,T.rewrites-0.3,T.meta-0.5,0.4)*p1;if(gh>0){md_table(cx,640,330,560,{name:"contract_terms",kind:"its terms, as a table",ghost:true,col:MD.soft,a:gh});
        const cr=ag_in(tt,T.table-0.1,0.35);if(cr>0){cx.save();cx.globalAlpha*=gh;cx.strokeStyle=rgba(MD.fail,0.95);cx.lineWidth=5;cx.lineCap="round";cx.beginPath();cx.moveTo(656,348);cx.lineTo(lerp(656,1184,ag_eo(cr)),lerp(348,416,ag_eo(cr)));cx.stroke();cx.restore();}}
      const at_=[T.id,T.version,T.day,T.file],mA=ag_in(tt,T.meta-0.3,0.5)*p1,lit=at_.findIndex((q,i)=>tt>=q-0.15&&tt<(i<3?at_[i+1]-0.15:q+1.6));
      fd_link(cx,[530,420],[640,420],ag_sine((tt-T.meta+0.1)/0.6),tt,{pts:[[530,420],[640,420]],dash:true,flow:false,a:0.8*p1});
      fd_kv(cx,640,260,980,[["contract_id","T-26188"],["version","2"],["signed_on","2026-07-14"],["file_path",FD_CDIR+"T-26188_v2.pdf"]],
        {kick:"Its metadata",edge:MD.flow,fw:210,rh:56,a:mA,k:fd_k(tt,T.meta-0.3),lit,rowA:i=>ag_in(tt,at_[i]-0.2,0.4)});
      const hA=ag_in(tt,T.hr-0.2,0.5)*p1;md_system(cx,640,680,460,"hr",{a:hA,lit:ag_io(tt,T.writes-0.2,T.nobody,0.5)});
      fd_link(cx,[640,735],[530,690],ag_sine((tt-T.makes+0.2)/0.8),tt,{pts:[[640,735],[586,735],[530,690]],col:MD.sys.hr,a:0.85*hA,every:1.3});
      fd_link(cx,[1000,680],[1000,580],ag_sine((tt-T.writes)/0.7),tt,{pts:[[1000,680],[1000,580]],col:MD.flow,a:0.85*hA,every:1.1});
      md_tag(cx,1140,735,"Nobody has to read it back",{col:MD.pass,icon:"tick",a:p1*ag_in(tt,T.nobody-0.2,0.5)});}
    // Linh's contract this semester, as two files: the offer, and the contract she signed a week longer
    const LA=ag_in(tt,c.linh-0.5,0.7);fd_who(cx,"linh",300,590,0.98,LA,{t:tt,gaze:[3,0]});md_nameTag(cx,420,400,"linh",{a:LA});
    const out=1-ag_in(tt,c.who-1.0,0.6),fnd=ag_in(tt,T.finds-0.2,0.5);
    fd_folder(cx,1000,220,{a:ag_in(tt,T.alike-0.6,0.5)*out,rowsA:ag_in(tt,T.alike+0.2,0.4),meta:ag_in(tt,T.byMeta-0.2,0.6),lit:1,litA:fnd,litCol:MD.agreed,dim:0,dimA:fnd});
    const fly=ag_sine((tt-T.alike+0.5)/1.1),pgA=ag_in(tt,c.linh-0.2,0.6)*(1-ag_in(tt,T.alike+0.3,0.4)),capA=pgA*(1-ag_in(tt,T.alike-0.7,0.4));
    [[760,"offer"],[1180,"signed"]].forEach(([x0,kind],i)=>{const q=pgA*ag_in(tt,T.two-0.3+i*0.3,0.5);if(q<=0)return;
      fd_contract(cx,lerp(x0,1034,fly),lerp(250,[350,416][i],fly),lerp(320,24,fly),{a:q,kind,endsCol:i?MD.agreed:MD.flow,
        endsHl:i?ag_io(tt,T.added-0.2,T.alike-0.7,0.4):ag_io(tt,T.nov13-0.2,T.alike-0.7,0.4)});});
    md_T(cx,"Contract T-26188",760,226,{w:700,size:30,col:MD.soft,a:capA*ag_in(tt,T.num-0.2,0.5)});
    md_T(cx,"The offer · sent 9 July",920,712,{w:600,size:30,align:"center",col:MD.soft,a:capA*ag_in(tt,T.jul9-0.2,0.5)});
    md_T(cx,"Signed · 14 July",1340,712,{w:600,size:30,align:"center",col:MD.soft,a:capA*ag_in(tt,T.jul14-0.2,0.5)});
    md_T(cx,"Ends 13 November",920,756,{w:700,size:30,align:"center",a:capA*ag_in(tt,T.nov13-0.2,0.5)});
    md_T(cx,"Ends 20 November",1340,756,{w:700,size:30,align:"center",col:MD.agreed,a:capA*ag_in(tt,T.added-0.2,0.5)});
    md_tag(cx,1130,836,"A week added for marking",{align:"center",col:MD.agreed,icon:"clock",a:capA*ag_in(tt,T.marking-0.3,0.5)});
    // in a folder the two look alike; by their metadata they don't. A person or an agent finds the signed one, and cites its file
    const eA=ag_in(tt,c.ends-0.4,0.5)*(1-ag_in(tt,c.context-0.6,0.5)),qA=eA*ag_in(tt,T.asks-0.3,0.5);
    md_textCard(cx,560,560,400,{kick:"Linh asks",title:"When does my contract end?"},{edge:MD.wait,a:qA,k:fd_k(tt,T.asks-0.3)});
    const fA=ag_in(tt,T.finder-0.3,0.5)*out,pA=fA*(1-ag_in(tt,c.context-0.6,0.5));
    md_icon(cx,"person",1080,650,64,MD.ink,{a:pA});withA(cx,fA,()=>ag_model(cx,1186,650,44,{t:tt,think:0.3+0.5*ag_io(tt,T.finds-0.3,T.nov20,0.5)}));
    md_T(cx,"A person or an agent",1134,744,{w:600,size:28,align:"center",col:MD.soft,a:pA});
    fd_link(cx,[960,652],[1042,650],ag_sine((tt-T.finder)/0.5),tt,{pts:[[960,652],[1042,650]],col:MD.wait,a:0.85*qA,flow:false});
    fd_link(cx,[1186,604],[1186,490],ag_sine((tt-T.finds+0.1)/0.6),tt,{pts:[[1186,604],[1186,490]],col:MD.agreed,a:0.9*eA,every:0.9});
    const aA=eA*ag_in(tt,T.cites-0.2,0.5);
    fd_link(cx,[1232,652],[1320,672],ag_sine((tt-T.cites)/0.6),tt,{pts:[[1232,652],[1320,672]],col:MD.agreed,a:0.9*aA,flow:false});
    if(aA>0){cx.save();cx.globalAlpha*=aA;ag_about(cx,1570,673,lerp(0.7,1,ag_spr(fd_k(tt,T.cites-0.2),0,0.5)));md_card(cx,1320,580,500,186,{edge:MD.agreed,glow:0.7});
      md_T(cx,"CITED FROM ITS FILE",1348,632,{w:800,size:28,ls:4,col:MD.agreed});md_T(cx,"Ends 20 November 2026",1348,686,{w:700,size:36,a:ag_in(tt,T.nov20-0.2,0.5)});
      md_icon(cx,"doc",1362,728,30,MD.soft);md_T(cx,"T-26188_v2.pdf",1388,738,{w:500,size:28,f:"mono",col:MD.soft});cx.restore();}
    // the films that show how a document becomes an agent's context
    const cA=ag_in(tt,c.context-0.3,0.5)*out;
    md_textCard(cx,560,560,480,{kick:"The film",title:"Context engineering"},{icon:"doc",a:cA*ag_in(tt,T.ce-0.3,0.5),k:fd_k(tt,T.ce-0.3)});
    md_textCard(cx,1320,560,500,{kick:"The film",title:"Context and memory, governed"},{icon:"doc",a:cA*ag_in(tt,T.cm-0.3,0.5),k:fd_k(tt,T.cm-0.3)});
    fd_link(cx,[1186,490],[1186,604],1,tt,{pts:[[1186,490],[1186,604]],col:MD.flow,a:cA*ag_in(tt,T.agentCtx-0.4,0.5),every:0.8});
    md_T(cx,"An agent's context",1186,744,{w:600,size:28,align:"center",col:MD.flow,a:cA*ag_in(tt,T.agentCtx-0.3,0.5)});
    // who may read it is HR's to decide
    const wA=ag_in(tt,c.who-0.6,0.7);fd_who(cx,"ingrid",1620,590,0.98,wA,{t:tt,gaze:[-3,0],flip:true});md_nameTag(cx,1500,400,"ingrid",{align:"right",col:MD.sys.hr,a:wA});
    md_textCard(cx,690,230,600,{kick:"Who may read a contract",title:"Ingrid Holm decides, in HR"},{edge:MD.personal,icon:"lock",a:wA*ag_in(tt,c.who,0.5),k:fd_k(tt,c.who)});
    md_tag(cx,990,520,"Data protection · a module of its own",{align:"center",col:MD.personal,icon:"lock",a:wA*ag_in(tt,T.dp-0.2,0.5)});
    }}],0.6);});

/* ---------------------------------------------------------------- 4 · Written as data */
// Linh's claim for her tutorial of 20 October, as the claims app wrote it (the example project's row; never its amount, a person's pay),
// and what it wrote with it
const FD_CLAIM=[["claim_id","CL-103807"],["unit_code","HI101"],["duty","tutorial"],["work_date","2026-10-20"],["hours","1.00"]];
const FD_CLAIM_META=[["staff_id","E-4417"],["contract_id","T-26188"],["status","approved"],["approved_at","2026-10-23 14:02"]];
// what each field means, in the claims app's data contract: the Open Data Contract Standard, cut to the field the film follows
const FD_YAML=["apiVersion: v3.1.0","kind: DataContract","id: claims","version: 1.0.0","status: active","schema:","- name: claims","  properties:","  - name: hours","    logicalType: number","    description: Hours worked, in decimal hours"];
scene("written",(ctx,S,t,sc)=>{const c=sc.cues,T=fd_once(sc,"T",()=>({
    best:wAt(sc,"best","nobody has to read back"),
    sheets:wAt(sc,"before","spreadsheets by email"),email:wAt(sc,"before","by email"),typed:wAt(sc,"before","someone typed"),payroll:wAt(sc,"before","into payroll"),
    app:wAt(sc,"json","the claims app"),made:wAt(sc,"json","the moment it's made"),row:wAt(sc,"json","a row any system can read"),
    who:wAt(sc,"meta","who claimed"),contract:wAt(sc,"meta","on which contract"),approved:wAt(sc,"meta","whether it's approved"),when:wAt(sc,"meta","and when"),
    means:wAt(sc,"yaml","What each field means"),its:wAt(sc,"yaml","its contract"),yaml:wAt(sc,"yaml","a YAML file"),open:wAt(sc,"yaml","an open standard"),code:wAt(sc,"yaml","the app's code"),
    log:wAt(sc,"log","the log of eighteen fifty-three"),one:wAt(sc,"log","one form"),everyone:wAt(sc,"log","kept by everyone"),nobody:wAt(sc,"log","nobody has to read it back")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"map",keys:[[0,960,540,1.0]],push:0.012,draw:(cx,tt)=>{
    fd_top(cx,1);fd_case(cx,"Claims for hours · write them as data",ag_in(tt,0.2,0.6),MD.agreed);
    // the three answers again: this is the third, the best
    const bA=ag_in(tt,0.4,0.6)*(1-ag_in(tt,c.before-0.6,0.5));
    [[150,"Supplier invoices","Read them","doc",MD.flow],[730,"Signed contracts","Keep them","contract",null]].forEach(([x,k,ti,ic,ed])=>md_textCard(cx,x,330,460,{kick:k,title:ti},{icon:ic,edge:ed,a:bA*0.35}));
    md_textCard(cx,1310,330,460,{kick:"Claims for hours",title:"Write them as data",sub:"Nobody has to read them back"},{icon:"table",edge:MD.agreed,glow:1.2,a:bA,k:fd_k(tt,0.4)});
    // before: spreadsheets by email, each one typed into payroll by hand
    const fA=ag_in(tt,c.before-0.4,0.5)*(1-ag_in(tt,c.json-0.7,0.5));
    if(fA>0){md_label(cx,96,250,"Until February 2026",{a:fA});
      for(let i=0;i<3;i++)fd_sheet(cx,110+i*60,300+i*70,300,i,{a:fA*ag_in(tt,c.before+0.2+i*0.3,0.5),rot:[-0.04,0.03,-0.02][i]});
      const pay=md_system(cx,1360,420,420,{n:"Payroll",s:"Pays casual staff",c:MD.sys.hr},{a:fA*ag_in(tt,T.payroll-0.3,0.5)});
      fd_link(cx,[560,500],[900,470],ag_sine((tt-T.email+0.3)/0.8),tt,{bend:0.2,col:MD.soft,a:0.7*fA,flow:false});
      for(let i=0;i<3;i++){const u=((tt-T.email-0.4)/1.6+i/3)%1;if(tt<T.email+0.4)break;const p=at(mk(md_curve([560,500],[900,470],{bend:0.2}).map(q=>P(q[0],q[1]))),u);fd_envelope(cx,p.x,p.y,46,MD.soft,fA*Math.sin(Math.PI*u));}
      md_icon(cx,"person",960,462,72,MD.ink,{a:fA*ag_in(tt,T.typed-0.3,0.5)});
      md_tag(cx,960,560,"Typed in by hand",{align:"center",col:MD.ink,icon:"clock",a:fA*ag_in(tt,T.typed,0.5)});
      fd_link(cx,[1010,466],[1360,475],ag_sine((tt-T.payroll+0.2)/0.8),tt,{bend:0.15,col:MD.sys.hr,a:0.8*fA,every:1.4});}
    // now the claims app writes each claim as data, as it's made: a row any system can read, and its metadata with it
    const slide=ag_sine((tt-c.yaml+0.5)/1.1),kx=lerp(660,96,slide),appA=ag_in(tt,c.json-0.4,0.5)*(1-ag_in(tt,c.yaml-1.1,0.5)),dA=1-ag_in(tt,c.log-1.0,0.5);
    md_system(cx,120,330,440,{n:"Claims app",s:"Built on Lakebase",c:MD.flow},{a:appA,lit:ag_io(tt,T.made-0.3,T.row,0.5)});
    fd_link(cx,[560,385],[660,385],ag_sine((tt-T.made+0.3)/0.5),tt,{pts:[[560,385],[660,385]],col:MD.flow,a:0.9*appA,every:0.9});
    fd_link(cx,[560,420],[660,700],ag_sine((tt-T.who+0.3)/0.6),tt,{pts:[[560,420],[610,420],[610,700],[660,700]],col:MD.flow,a:0.9*appA,every:1.1});
    fd_kv(cx,kx,220,560,FD_CLAIM,{kick:"One claim, as data",rh:46,fw:220,a:dA*ag_in(tt,T.made-0.5,0.5),k:fd_k(tt,T.made-0.5),rowA:i=>ag_in(tt,T.made-0.2+i*0.12,0.4),lit:tt>T.means-0.3&&tt<c.log-1?4:-1,litCol:MD.agreed});
    const rdA=ag_io(tt,T.row-0.3,c.yaml-1.1,0.5);
    [["Payroll",MD.sys.hr,"store"],["Finance",MD.sys.fin,"store"],["Reports",MD.flow,"view"]].forEach(([s,col,ic],i)=>{const q=rdA*ag_in(tt,T.row-0.3+i*0.25,0.5);
      md_reader(cx,1340,240+i*112,440,{title:s,icon:ic,col,a:q});fd_link(cx,[1220,388],[1340,282+i*112],q>0?1:0,tt,{bend:0.3,col:MD.flow,a:0.85*q,every:1.2,off:i*0.3});});
    fd_kv(cx,kx,572,560,FD_CLAIM_META,{kick:"Its metadata",edge:MD.flow,rh:46,fw:220,a:dA*ag_in(tt,T.who-0.3,0.5),k:fd_k(tt,T.who-0.3),
      rowA:i=>ag_in(tt,[T.who,T.contract,T.approved,T.when][i]-0.2,0.4)});
    // what each field means is in its contract: a YAML file, in an open standard, kept with the app's code
    const yA=ag_in(tt,c.yaml+0.5,0.5);
    fd_code(cx,820,220,860,FD_YAML,{kick:"claims.yaml",edge:MD.agreed,icon:"contract",a:yA,k:fd_k(tt,c.yaml+0.5),lineA:i=>ag_in(tt,T.its-0.2+i*0.09,0.3)});
    fd_link(cx,[kx+560,505],[820,638],ag_sine((tt-T.means-0.6)/0.8)*dA,tt,{bend:0.25,col:MD.agreed,dash:true,flow:false,a:0.85*yA});
    const tgA=1-ag_in(tt,c.log-1.0,0.5);
    md_tag(cx,820,800,"Open Data Contract Standard",{col:MD.agreed,icon:"contract",a:tgA*ag_in(tt,T.open-0.2,0.5)});
    md_tag(cx,1350,800,"Kept with the app's code",{col:MD.ink,icon:"doc",a:tgA*ag_in(tt,T.code-0.2,0.5)});
    // it's the log of 1853 again: one form, kept by everyone
    const gA=ag_in(tt,T.log-0.4,0.5);fd_form53(cx,96,260,680,{a:gA,k:fd_k(tt,T.log-0.4)});
    fd_link(cx,[776,440],[820,440],ag_sine((tt-T.one+0.2)/0.6),tt,{pts:[[776,440],[820,440]],col:MD.agreed,a:0.9*gA,flow:false});
    md_tag(cx,436,690,"One form, kept by everyone",{align:"center",col:MD.agreed,icon:"contract",a:gA*ag_in(tt,T.everyone-0.3,0.5)});
    md_tag(cx,436,770,"Nobody has to read it back",{align:"center",col:MD.pass,icon:"tick",a:gA*ag_in(tt,T.nobody-0.3,0.5)});
    }}],0.6);});

/* ---------------------------------------------------------------- 5 · Keep the file */
const FD_THREEWAYS=[["If we write it","Write it as data","In a standard structure, such as JSON or YAML, with its metadata","table",MD.agreed],
  ["If it's official","Keep it as it is","Its metadata beside it","contract",null],
  ["If it's written for people","Read it, where a use case needs it","With the platform's functions or a scraper, and keep the file","doc",MD.flow]];
scene("close",(ctx,S,t,sc)=>{const c=sc.cues,T=fd_once(sc,"T",()=>({
    kept:wAt(sc,"kept","were kept"),century:wAt(sc,"kept","More than a century later"),sci:wAt(sc,"kept","climate scientists"),again:wAt(sc,"kept","read them again"),million:wAt(sc,"kept","a million weather reports"),
    keep:wAt(sc,"again","Keep the file"),better:wAt(sc,"again","better readers"),
    noor:wAt(sc,"rule","Noor Rahman"),three:wAt(sc,"rule","one of three answers"),
    ifw:wAt(sc,"write","If we write it"),ifo:wAt(sc,"official","If it's official"),ifr:wAt(sc,"read","If it's written for people"),
    differ:wAt(sc,"docs","documents differ"),standards:wAt(sc,"docs","the standards"),wheel:wAt(sc,"docs","reinvent the wheel"),
    offDocs:wAt(sc,"iterate","the official docs"),inv:wAt(sc,"iterate","Investigate"),adapt:wAt(sc,"iterate","adapt"),impl:wAt(sc,"iterate","implement"),iter:wAt(sc,"iterate","iterate"),
    readThem:wAt(sc,"data","read documents"),keepIt:wAt(sc,"data","keep the file"),writeYours:wAt(sc,"data","write what's yours")}));
  const map0=T.noor-1.4;
  ag_shots(ctx,S,t,sc.dur,[
    // the logs were kept, and read again over a century later, into over a million weather reports
    {at:0,place:"fdSea",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt,cam)=>{
      fd_land(cx,{cam});fd_winds(cx,tt,{cam,a:0.3});fd_currents(cx,tt,{a:0.25});
      fd_reports(cx,tt,{u:ag_sine((tt-T.again+0.4)/(T.million-T.again+1.6)),a:ag_in(tt,T.sci-0.4,0.8)});
      fd_scr(cx,S,()=>{const kA=ag_in(tt,c.kept-0.4,0.7);
        [[96,58,38],[70,44,34],[108,74,46],[60,48,40],[86,40,34]].forEach((col,i)=>fd_book(cx,110+i*64,640+[10,0,16,4,12][i],56,[190,200,174,196,182][i],{col,a:kA*ag_in(tt,c.kept-0.4+i*0.12,0.5)}));
        md_T(cx,"The logs, kept",270,606,{w:600,size:30,align:"center",col:MD.soft,a:kA*ag_in(tt,T.kept-0.2,0.5)});
        md_textCard(cx,1180,600,640,{kick:"Over a century later",title:"Over a million weather reports",sub:"Read again by climate scientists"},
          {edge:MD.flow,icon:"refresh",a:ag_in(tt,T.million-0.4,0.5),k:fd_k(tt,T.million-0.4)});
        md_pill(cx,960,140,"Keep the file and its metadata",{col:MD.flow,icon:"doc",a:ag_in(tt,T.keep-0.2,0.5),k:fd_k(tt,T.keep-0.2)});});}},
    // Noor's rule: every document gets one of three answers; start from the standards, and the official docs
    {at:map0,place:"map",dis:0.9,keys:[[0,960,540,1.0]],push:0.012,draw:(cx,tt)=>{
      fd_top(cx,1);const nA=ag_in(tt,map0+0.3,0.7);
      fd_who(cx,"noor",300,590,0.98,nA,{t:tt,gaze:[3,0]});md_nameTag(cx,420,400,"noor",{col:MD.flow,a:nA});
      const rA=1-ag_in(tt,c.docs-0.6,0.5);
      fd_case(cx,"Every document · one of three answers",ag_in(tt,T.three-0.3,0.6)*rA,MD.ink);
      FD_THREEWAYS.forEach(([k,ti,sub,ic,ed],i)=>md_textCard(cx,760,250+i*200,1060,{kick:k,title:ti,sub},{icon:ic,edge:ed,a:rA*ag_in(tt,[T.ifw,T.ifo,T.ifr][i]-0.3,0.5),k:fd_k(tt,[T.ifw,T.ifo,T.ifr][i]-0.3)}));
      // every organisation's documents differ, and the standards are there already: don't reinvent the wheel
      const dA=ag_in(tt,c.docs-0.3,0.5)*(1-ag_in(tt,c.iterate-0.6,0.5));
      if(dA>0){fd_invoice(cx,800,262,240,2,{a:dA*ag_in(tt,T.differ-0.5,0.5),rot:-0.06});fd_contract(cx,910,246,240,{a:dA*ag_in(tt,T.differ-0.3,0.5),rot:0.02,kind:"offer"});
        fd_sheet(cx,1000,340,300,2,{a:dA*ag_in(tt,T.differ-0.1,0.5),rot:0.07});
        let x=800;[["PDF","doc"],["JSON","table"],["YAML","contract"],["Open Data Contract Standard","contract"]].forEach(([s,ic],i)=>{const r=i<3?660:740;if(i===3)x=800;
          const b=md_tag(cx,x,r,s,{col:MD.agreed,icon:ic,a:dA*ag_in(tt,T.standards-0.2+i*0.15,0.4)});x+=b.w+20;});}
      const wh=ag_in(tt,T.wheel-0.6,0.5)*(1-ag_in(tt,c.iterate-0.7,0.5)),cy_=lerp(450,470,ag_sine((tt-c.iterate+0.6)/1.0));
      if(wh>0){md_mark(cx,1560,cy_,100,(tt-T.wheel+0.6)/1.4,wh);md_T(cx,"Don't reinvent the wheel",1560,cy_+160,{w:700,size:30,align:"center",a:wh*(1-ag_in(tt,c.iterate-0.6,0.5))});}
      // start from the official docs: investigate, adapt, implement, iterate
      const iA=ag_in(tt,c.iterate-0.4,0.5)*(1-ag_in(tt,c.data-0.7,0.5));
      if(iA>0){md_textCard(cx,760,400,460,{kick:"Start from",title:"The official docs"},{icon:"doc",edge:MD.flow,a:iA*ag_in(tt,T.offDocs-0.3,0.5),k:fd_k(tt,T.offDocs-0.3)});
        const R=190,ring=[];for(let i=0;i<=64;i++){const an=-Math.PI/2+i/64*TAU;ring.push([1560+Math.cos(an)*R,470+Math.sin(an)*R]);}
        const ru=ag_sine((tt-T.inv+0.2)/2.4);md_lane(cx,ring,MD.flow,0.8*iA,{u:ru,t:tt});if(ru>=1)md_flow(cx,ring,tt,{kind:"events",col:MD.flow,a:iA,every:0.9});
        fd_link(cx,[1220,470],[1296,470],ag_sine((tt-T.offDocs)/0.7),tt,{pts:[[1220,470],[1296,470]],col:MD.flow,a:0.85*iA,flow:false});
        [["Investigate",1560,280,T.inv],["Adapt",1750,470,T.adapt],["Implement",1560,660,T.impl],["Iterate",1370,470,T.iter]].forEach(([s,x,y,at_])=>
          md_tag(cx,x,y,s,{align:"center",col:MD.flow,a:iA*ag_in(tt,at_-0.2,0.4)}));}
      // in short: read documents, keep the file, write what's yours
      const eA=ag_in(tt,c.data-0.4,0.5)*(1-ag_in(tt,c.breath-0.2,0.8));fd_case(cx,"In short",ag_in(tt,c.data-0.1,0.5),MD.ink);
      [["Read documents","Where a use case needs it","doc",MD.flow,T.readThem],["Keep the file","And its metadata","contract",null,T.keepIt],["Write what's yours","As data","table",MD.agreed,T.writeYours]].forEach(([ti,sub,ic,ed,at_],i)=>
        md_textCard(cx,760,260+i*180,1060,{title:ti,sub},{icon:ic,edge:ed,a:eA*ag_in(tt,at_-0.3,0.5),k:fd_k(tt,at_-0.3)}));}}
  ],0.9);
  md_end(ctx,S,t,c.breath,"Files as data and as context","Read it, keep it, or write it as data","Film 1 of 2 · Documents and closing remarks","Modern data basics");});

ag_cutInto(["invoices","contracts","written"]);
