/* ===== One copy, one platform: the scenes =====
   Six chapters, each timed to its narration: wAt(sc, "line", "word") is the moment a word is said. Amsterdam's places are painted once
   (ledger.js), the map is the module's; what moves is drawn live in the shots of ag_shots. In one room the camera never jumps: it glides
   from one framing to the next and only what changes fades; a later moment in the same room (later: true) lets what was there leave before
   what comes next comes in. Between rooms the whole picture changes, so the shots dissolve. Cards, tags and the kicker are drawn in the
   frame (oc_scr), so their words keep their size whatever the camera does. */

const oc_see=(cam,x,y)=>[960+(x-cam.x)*cam.z,540+(y-cam.y)*cam.z];
// a card that springs in at t0 and leaves at t1 (or stays), in the frame
function oc_cardAt(ctx,x,y,w,words,tt,t0,t1,o){o=o||{};const a=ag_in(tt,t0,0.4)*(t1==null?1:1-ag_in(tt,t1,0.4));if(a<=0.004)return null;
  return md_textCard(ctx,x,y,w,words,Object.assign({a,k:Math.min(1,ag_spr(tt,t0,0.5))},o));}
function oc_tagAt(ctx,x,y,text,tt,t0,t1,o){const a=ag_in(tt,t0,0.4)*(t1==null?1:1-ag_in(tt,t1,0.4));if(a<=0.004)return;md_tag(ctx,x,y,text,Object.assign({a},o||{}));}
function oc_pillAt(ctx,x,y,text,tt,t0,t1,o){const a=ag_in(tt,t0,0.4)*(t1==null?1:1-ag_in(tt,t1,0.4));if(a<=0.004)return;md_pill(ctx,x,y,text,Object.assign({a,k:Math.min(1,ag_spr(tt,t0,0.5)),size:28},o||{}));}
// the kicker, in the frame
function oc_kick(ctx,S,num,title,a){if(a<=0.004)return;oc_scr(ctx,S,()=>md_kicker(ctx,num,title,{a}));}

/* ---------------------------------------------------------------- the counting table: coins of every kind, a balance, a bag */
const OC_COUNT={scale:[470,800,1.1],clipped:[1240,520,70],worn:[1460,520,70]};
function oc_countRoom(c,tt,o){o=o||{};const K=OC_COUNT;
  oc_coins(c,700,170,1120,660,96,{k:o.k==null?1:o.k});
  const [sx,sy,ss]=K.scale;oc_scale(c,sx,sy,ss,{tip:o.tip||0,left:(c2,x,y)=>oc_bag(c2,x,y-42*ss,0.62*ss,{open:0.5}),right:(c2,x,y)=>{oc_weight(c2,x-20*ss,y,1.1*ss);oc_weight(c2,x+18*ss,y,0.9*ss);}});
  const [cx,cy,cr]=K.clipped,cl=o.clip||0;oc_coin(c,cx,cy,cr,{metal:"silver",motif:3,clip:cl,seed:5});
  // the silver shaved from its edge: a few bright flecks falling away while it's clipped
  if(cl>0&&cl<1)for(let i=0;i<7;i++){const u=clamp(cl*1.4-i*0.06,0,1),an=-0.6+i*0.17,r0=cr*1.02;c.fillStyle=rgba(ag_lt(OC.silver,0.3),0.9*(1-u));
    c.beginPath();c.arc(cx+Math.cos(an)*(r0+u*40),cy+Math.sin(an)*(r0*0.86)+u*u*60,2.4+(i%3),0,TAU);c.fill();}
  const [wx,wy,wr]=K.worn;oc_coin(c,wx,wy,wr,{metal:"silver",motif:1,worn:o.worn==null?0.9:o.worn,seed:9});}
// what a merchant owed, and what the coin was worth: two bars, the gap between them in red. In the frame
function oc_owed(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const w=1000,h=344;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  md_card(ctx,x,y,w,h,{r:20});md_T(ctx,"A merchant owed 1,000 guilders",x+40,y+66,{w:800,size:36});
  const bx=x+40,bw=800,b1=clamp(o.b1==null?1:o.b1,0,1),b2=clamp(o.b2==null?1:o.b2,0,1),gap=clamp(o.gap||0,0,1);
  const bar=(yy,u,col,label)=>{if(u<=0)return;rr(ctx,bx,yy,bw*u,58,12);ctx.fillStyle=rgba(col,1);ctx.fill();withA(ctx,ag_in(u,0.6,0.4),()=>md_T(ctx,label,bx+24,yy+40,{w:800,size:30,col:MD.navy}));};
  bar(y+104,b1,MD.agreed,"owed: 1,000");bar(y+190,b2*0.9,OC.silver,"coin worth about 900");
  if(gap>0){ctx.save();ctx.globalAlpha*=gap;ctx.setLineDash([8,7]);ctx.strokeStyle=rgba(MD.fail,1);ctx.lineWidth=2.6;rr(ctx,bx+bw*0.9+4,y+190,bw*0.1-4,58,10);ctx.stroke();ctx.restore();
    md_T(ctx,"about 9% less",bx+bw*0.95,y+300,{w:800,size:30,align:"center",col:MD.fail,a:gap});}
  ctx.restore();}

/* ---------------------------------------------------------------- the bank's room: the clerk, the ledger, the balance, the merchant */
const OC_HAND=[317.9,776.4];   // the near hand's wrist, in figure space, when a person holds something (AG_POSES.hold)
function oc_hallRoom(c,tt,o){o=o||{};const Hh=OC_HALL,[mx,my,ms]=Hh.merchant,[sx,sy]=Hh.scale,ss=0.8,tip=o.tip||0;
  oc_person(c,"clerk",Hh.clerk[0],Hh.clerk[1],Hh.clerk[2],{t:tt+0.6,flip:true,cut:Hh.table+6,gaze:o.clerkGaze||[3,3],light:{key:[560,420],shade:0.42,ground:0.12}});
  const L=oc_ledger(c,...Hh.ledger,{pages:o.pages});
  // the bag: in the merchant's hand, on its way to the balance, or in its pan
  const fly=clamp(o.fly||0,0,1),held=[mx+(OC_HAND[0]+40-AG_FIG.anchor[0])*ms,my+(OC_HAND[1]+30-AG_FIG.anchor[1])*ms],an=tip*0.16,half=170*ss,
    pan=[sx-Math.cos(an)*half,sy-240*ss+Math.sin(an)*half+150*ss-6*ss-34*ss*0.75];
  oc_scale(c,sx,sy,ss,{tip,left:fly>=1?(c2,x,y)=>oc_bag(c2,x,y-34*ss*0.75,0.6,{}):null,right:(c2,x,y)=>{oc_weight(c2,x-16*ss,y,ss);if(o.weights>0)withA(c2,o.weights,()=>oc_weight(c2,x+16*ss,y,0.8*ss));}});
  if(fly>0&&fly<1){const u=ag_sine(fly),bx=lerp(held[0],pan[0],u),by=lerp(held[1],pan[1],u)-Math.sin(Math.PI*u)*120;oc_bag(c,bx,by,lerp(1.25*ms,0.6,u),{});}
  const hold=fly<=0?1:0,mix=fly<=0?0:ag_in(fly,0,0.45);
  oc_person(c,"merchant",mx,my,ms,{t:tt,pose:"hold",pose2:"hang",mix,hold:hold?(c2,h)=>oc_bag(c2,h.near[0]+40,h.near[1]+30,1.25,{}):null,gaze:o.gaze||[4,1]});
  return L;}
// a line moving from page to page: a small chip of light carrying its sum, along an arc over the spine, in the room's coordinates
function oc_lineMoves(c,L,u,text){if(!L||L.length<2||u<=0||u>=1)return;const a=L[0].rows[1],b=L[1].rows[1],p0=[a[2]-60,a[1]],p1=[b[0]+60,b[1]],e=ag_sine(u);
  const x=lerp(p0[0],p1[0],e),y=lerp(p0[1],p1[1],e)-Math.sin(Math.PI*e)*150,f=sstep(0,0.1,u)*(1-sstep(0.9,1,u));
  // the path behind it, fading
  c.save();c.globalAlpha*=f;c.strokeStyle=rgba(MD.flow,0.6);c.lineWidth=3;c.setLineDash([6,8]);c.beginPath();for(let k=0;k<=24;k++){const q=k/24*e,X=lerp(p0[0],p1[0],q),Y=lerp(p0[1],p1[1],q)-Math.sin(Math.PI*q)*150;k?c.lineTo(X,Y):c.moveTo(X,Y);}c.stroke();c.restore();
  glow(c,x,y,70,MD.flow,0.7*f);c.save();c.globalAlpha*=f;rr(c,x-34,y-12,68,24,12);c.fillStyle=rgba(MD.flow,1);c.fill();
  c.fillStyle="rgba(255,255,255,0.5)";rr(c,x-26,y-8,52,6,3);c.fill();c.restore();}
// the bills from all over Europe, flying in to be paid in the ledger: n of them, from the frame's edges, each in its turn
// the bills from all over Europe, paid in the ledger: each flies in from the frame's right, lands on a page's empty lines, is marked
// paid, and is taken into the page as a line; never more than two at once, and none over the ledger's words once it has landed
const OC_BILLS=[[2200,240,1410,722,0.1],[2180,900,975,722,-0.08],[2220,560,1410,722,-0.05],[2200,1000,975,722,0.07],[2240,380,1410,722,0.09]];
function oc_bills(c,tt,t0,o){o=o||{};OC_BILLS.forEach(([x0,y0,x1,y1,r],i)=>{const s0=t0+i*0.7,u=clamp((tt-s0)/1.0,0,1),v=clamp((tt-s0-1.5)/0.6,0,1);if(u<=0||v>=1)return;const e=ag_eo(u);
  const x=lerp(x0,x1,e),y=lerp(y0,y1,e)-Math.sin(Math.PI*e)*90,k=lerp(1,0.35,ag_sine(v));c.save();c.globalAlpha*=1-ag_sine(v);c.translate(x,y);c.scale(k,k);c.translate(-x,-y);
  oc_bill(c,x,y,150,{rot:r*(1-e*0.6),seed:i+3,a:o.a});c.restore();
  // marked paid as it lands: the mark keeps its size while the bill is taken into the page, and leaves with it
  const tk=(tt-s0-1.0)/0.4;if(tk>0)md_pill(c,x1,y1-8,"paid",{col:MD.pass,icon:"tick",size:28,a:(o.a==null?1:o.a)*ag_in(tk,0,0.4)*(1-ag_sine(v)),k:Math.min(1,ag_spr(tk,0,0.5))});});}

/* ---------------------------------------------------------------- the copies: the same data in every system, each a little different */
const OC_COPIES=[[1180,180,"1,000 rows",0],[1180,340,"998 rows",1],[1180,500,"1,003 rows",1],[1180,660,"991 rows",1]];
function oc_copies(c,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;c.save();c.globalAlpha*=a;
  const src=md_table(c,190,430,460,{name:"the data",kind:"1,000 rows",col:MD.flow});
  OC_COPIES.forEach(([x,y,kind,bad],i)=>{const k=clamp((o.copy||0)*1.6-i*0.25,0,1);if(k<=0)return;
    md_way(c,"batch",src.r,[x,y+52],t,{u:ag_in(k,0,0.6),bend:0.6,a:1-0.6*clamp(o.diff||0,0,1)});
    const col=bad&&o.diff>0?mix(MD.flow,MD.fail,ag_in(o.diff,0,0.5)):MD.flow;md_table(c,x,y,520,{name:"a copy",kind,col,a:ag_in(k,0.3,0.5),lit:bad?ag_in(o.diff||0,0,0.5):0});});
  c.restore();}
/* the claims before the app: tutors' spreadsheets by email to payroll and to Finance, each keeping a copy that never quite agreed; then
   one claims table, written once, and payroll and Finance reading it where it's written. o.mail, o.copies, o.agree (0 to 1); o.one (0 to 1)
   the two copies give way to one */
function oc_twoCopies(c,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;c.save();c.globalAlpha*=a;const one=clamp(o.one||0,0,1),two=1-ag_sine(one);
  const tut=md_reader(c,90,420,440,{title:"Tutors' claims",sub:"spreadsheets by email",icon:"person",col:MD.ink});
  const P=[[1240,250,"payroll's copy"],[1240,610,"Finance's copy"]];
  if(two>0)P.forEach(([x,y,kind],i)=>{const k=clamp((o.copies||0)*1.5-i*0.3,0,1);if(k<=0)return;withA(c,two,()=>{
      const pts=md_curve(tut.port.map((v,j)=>j?v:v+440),[x,y+52],{bend:0.55});md_lane(c,pts,MD.flow,0.7,{u:ag_in(k,0,0.6)});
      // emails along the lane, one after another
      if(k>=1&&o.mail>0){const pm=mk(pts.map(q=>P_(q)));spawn(t,1.3,1.4,i*0.6,(u)=>{const q=at(pm,ease(u));oc_mail(c,q.x,q.y,44,{a:sstep(0,0.15,u)*(1-sstep(0.85,1,u))});});}
      md_table(c,x,y,520,{name:"claims",kind,col:o.agree>0?mix(MD.flow,MD.fail,ag_in(o.agree,0,0.5)):MD.flow,a:ag_in(k,0.3,0.5),lit:ag_in(o.agree||0,0,0.5)});});});
  if(two>0&&o.agree>0)withA(c,two,()=>md_pill(c,1500,500,"never quite agreed",{col:MD.fail,icon:"cross",size:28,a:ag_in(o.agree,0,0.4),k:Math.min(1,ag_spr(o.agree,0,0.5))}));
  // one table, written once; payroll and Finance read it where it's written
  if(one>0){const k=ag_in(one,0.2,0.6);withA(c,k,()=>{const tb=md_table(c,760,420,480,{name:"claims",kind:"written once",col:MD.agreed,lit:ag_in(one,0.6,0.5)});
      md_way(c,"api",tut.port.map((v,j)=>j?v:v+440),tb.l,t,{u:ag_in(one,0.4,0.6)});
      [[1440,250,"Payroll"],[1440,610,"Finance"]].forEach(([x,y,title],i)=>{const r=md_reader(c,x,y,400,{title,sub:"reads that one copy",icon:"query",col:i?MD.dom.finance:MD.flow,a:ag_in(o.read||0,i*0.2,0.5)});
        md_way(c,"query",tb.r,r.port,t,{u:ag_in(o.read||0,i*0.2+0.2,0.6),a:ag_in(o.read||0,i*0.2,0.3)});});});}
  c.restore();}
const P_=q=>P(q[0],q[1]);
// a claim's row, as one glass card: its claim ID, unit, duty, hours and status. o.stamps: who does what with it, each 0 to 1. In the frame
function oc_rowCard(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const w=1000,h=104,cells=["CL-104233","HI101","tutorial","1.00 hour",o.status||"approved"],xs=[34,268,420,610,800];
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));if(o.glow>0)glow(ctx,x+w/2,y+h/2,w*0.6,MD.agreed,0.25*o.glow);
  md_card(ctx,x,y,w,h,{edge:o.glow>0?mix(MD.flow,MD.agreed,o.glow):MD.flow,glow:0.8,r:18});
  cells.forEach((s,i)=>{const st=i===4,col=st?(s==="approved"?MD.pass:MD.wait):MD.ink;if(st)md_icon(ctx,s==="approved"?"tick":"clock",x+xs[i]+14,y+h/2-2,30,col);
    md_T(ctx,s,x+xs[i]+(st?40:0),y+h/2+11,{w:i===0?500:600,size:30,f:i===0?"mono":undefined,col});});
  ctx.restore();}

/* ---------------------------------------------------------------- 1 · One ledger */
scene("ledger",(ctx,S,t,sc)=>{
  const T=oc_once(sc,"T",()=>({tShips:wAt(sc,"quays","Ships"),tMerch:wAt(sc,"quays","merchants pay"),tCoin:wAt(sc,"quays","in coin"),
    tKinds:sc.cues.kinds,tKindsW:wAt(sc,"kinds","kinds"),tClipped:wAt(sc,"kinds","clipped"),tShaved:wAt(sc,"kinds","shaved"),tWorn:wAt(sc,"kinds","worn thin"),
    tWeigh:sc.cues.weigh,tWeighW:wAt(sc,"weigh","weighing"),tWorth:wAt(sc,"weigh","nobody knows"),
    tOwed:sc.cues.owed,tLess:wAt(sc,"owed","nine per cent"),tOwedM:wAt(sc,"owed","a merchant owed"),tNine:wAt(sc,"owed","nine hundred"),
    tChange:sc.cues.change,tSlow:wAt(sc,"change","slow"),tDisp:wAt(sc,"change","disputed"),tRisky:wAt(sc,"change","risky"),tHad:wAt(sc,"change","Something"),
    tBank:sc.cues.bank,tJan:wAt(sc,"bank","January"),tWissel:wAt(sc,"bank","Wisselbank"),tHall:wAt(sc,"bank","town hall"),
    tDep:sc.cues.deposit,tOnce:wAt(sc,"deposit","once"),tWeighs:wAt(sc,"deposit","weighs it"),tWrites:wAt(sc,"deposit","writes its value"),tOwn:wAt(sc,"deposit","own page"),
    tLine:sc.cues.line,tMoved:wAt(sc,"line","a line moved"),tNoCoin:wAt(sc,"line","no coin"),tHolds:wAt(sc,"line","what each merchant holds"),
    tTrust:sc.cues.trust,tFive:wAt(sc,"trust","five per cent"),tCentury:wAt(sc,"century","over a century"),tBills:wAt(sc,"century","bills"),
    tData:sc.cues.data,tBags:wAt(sc,"data","bags of coin"),tCopied:wAt(sc,"data","copied"),tDiff:wAt(sc,"data","a little different"),
    tClaims:sc.cues.claims,tEmail:wAt(sc,"claims","email"),tPF:wAt(sc,"claims","payroll and Finance"),tAgree:wAt(sc,"claims","never quite agreed"),
    tNow:sc.cues.now,tOnceN:wAt(sc,"now","written once"),tRead:wAt(sc,"now","read that one copy"),tBreath:sc.cues.breath}));
  const tTitle=T.tBreath+1.7;
  ag_shots(ctx,S,t,sc.dur,[
    // Amsterdam, around 1600: the harbour at dusk, ships from all over Europe, two merchants, one paying the other in coin
    {at:0,place:"ocQuay",keys:[[0,960,560,1.0]],push:0.04,draw:(c,tt)=>{const op=ag_in(tt,T.tCoin-0.5,0.7);
      oc_person(c,"merchant",560,650,0.92,{t:tt,pose:"hold",hold:(c2,h)=>{oc_bag(c2,h.near[0]+40,h.near[1]+30,1.25,{open:op});
        // the coins counted out: a few glints rising from the bag's neck
        if(op>0)spawn(tt,0.7,1.2,0,(u,i)=>{const R=ag_rnd(i*13+5),x=h.near[0]+40+(R()-0.5)*50,y=h.near[1]-40-u*70;glow(c2,x,y,16,OC.gold,0.8*op*Math.sin(Math.PI*u));});},gaze:[3,1]});
      oc_person(c,"trader",1380,650,0.92,{t:tt+0.7,flip:true,gaze:[3,2]});
      oc_scr(c,S,()=>oc_where(c,S,"Amsterdam, around 1600",ag_in(tt,0.4,0.6)));}},
    // 800 to 1,000 kinds of coin, many clipped or worn thin; the camera goes close on one of each, then to the balance, which swings and never
    // settles, then back for what a merchant owed is paid; slow, disputed and risky. One room: the camera glides, and only what changes fades
    {at:T.tKinds-0.25,place:"ocCount",keys:[[0,1000,520,1.0],[T.tClipped-0.3,1350,530,2.0],[T.tWeigh-0.2,640,600,1.5],[T.tOwed-0.2,960,600,1.0]],d:1.8,draw:(c,tt,cam)=>{
      const sw=ag_in(tt,T.tWeighW-0.3,0.5);
      oc_countRoom(c,tt,{k:clamp((tt-T.tKinds+0.1)/1.4,0,1),clip:clamp((tt-T.tShaved+0.2)/0.9,0,1),tip:sw*0.55*Math.sin((tt-T.tWeighW)*2.4)*Math.exp(-0.05*Math.max(0,tt-T.tWeighW))});
      oc_scr(c,S,()=>{oc_cardAt(c,96,96,660,{kick:"Around 1600",title:"800 to 1,000 kinds of coin"},tt,T.tKindsW-0.4,T.tClipped-0.6,{edge:OC.gold});
        const a=oc_see(cam,1240,520),b=oc_see(cam,1460,520);oc_tagAt(c,a[0],a[1]+190,"clipped",tt,T.tClipped+0.3,T.tWeigh-0.6,{col:MD.ink,align:"center"});
        oc_tagAt(c,b[0],b[1]+190,"worn thin",tt,T.tWorn,T.tWeigh-0.6,{col:MD.ink,align:"center"});
        const p=oc_see(cam,OC_COUNT.scale[0]-187,560);oc_tagAt(c,p[0],p[1]-170,"what is it worth?",tt,T.tWorth,T.tOwed-0.6,{col:MD.wait,icon:"warn",align:"center"});
        const k=(tt-T.tOwedM+0.6)/0.5,ou=1-ag_in(tt,T.tChange-0.3,0.4);
        if(ou>0&&k>0)oc_owed(c,460,110,{a:ag_in(k,0,0.3)*ou,k,b1:clamp((tt-T.tOwedM)/0.8,0,1),b2:clamp((tt-T.tNine+0.4)/0.8,0,1),gap:ag_in(tt,T.tNine+0.6,0.5)});
        oc_pillAt(c,560,300,"slow",tt,T.tSlow-0.1,null,{col:MD.fail,icon:"clock"});oc_pillAt(c,960,300,"disputed",tt,T.tDisp-0.1,null,{col:MD.fail,icon:"warn"});
        oc_pillAt(c,1360,300,"risky",tt,T.tRisky-0.1,null,{col:MD.fail,icon:"cross"});
        md_veil(c,S,0.5*ag_in(tt,T.tHad,0.8));});}},
    // 31 January 1609: the city opens an exchange bank, the Wisselbank, in its town hall. A merchant brings his coin once; the bank weighs it
    // and writes its value on his own page; a payment is a line moved from page to page; for over a century, bills from all Europe are paid there
    {at:T.tBank-0.3,place:"ocHall",keys:[[0,960,540,1],[T.tMoved-0.6,1190,720,1.72],[T.tHolds+0.8,960,540,1.0]],d:1.8,push:0.02,draw:(c,tt,cam)=>{
      const fly=clamp((tt-T.tOnce+0.05)/0.9,0,1),settle=fly>=1?ag_spr(tt,T.tOnce+0.85,0.9):0,tip=fly>=1?lerp(0.9,0.06,Math.min(1,settle)):0;
      const mv=clamp((tt-T.tMoved-0.2)/1.6,0,1),lit=ag_in(tt,T.tHolds,0.5);
      const pages=[{head:"Page 112",lines:[{s:"Coin in",n:"1,000",w:clamp((tt-T.tWrites)/0.9,0,1)},{s:"To page 87",n:"300",col:[28,78,140],w:clamp((tt-T.tMoved+0.1)/0.6,0,1)}],
          bal:["1,000","700",clamp((mv-0.75)/0.25,0,1)],balA:ag_in(tt,T.tWrites+0.6,0.4),glow:Math.max(ag_in(tt,T.tOwn-0.1,0.4)*(1-ag_in(tt,T.tMoved-0.6,0.5)),lit)},
        {head:"Page 87",lines:[{s:"Coin in",n:"450"},{s:"From page 112",n:"300",col:[28,78,140],w:clamp((mv-0.8)/0.2,0,1)}],bal:["450","750",clamp((mv-0.85)/0.15,0,1)],glow:lit}];
      const L=oc_hallRoom(c,tt,{fly,tip,weights:ag_in(tt,T.tWeighs,0.4),pages,gaze:fly>0?[4,3]:[4,1]});
      oc_lineMoves(c,L,mv,"300 guilders");
      oc_bills(c,tt,T.tBills-0.2);
      oc_scr(c,S,()=>{const out=1-ag_in(tt,T.tDep-0.2,0.5);
        if(out>0)oc_cardAt(c,96,140,640,{kick:"31 January 1609",title:"The Wisselbank",sub:"Amsterdam's exchange bank, in its town hall"},tt,T.tJan-0.2,T.tDep-0.2,{edge:MD.agreed});
        const v=oc_see(cam,OC_HALL.scale[0],OC_HALL.scale[1]-300);oc_pillAt(c,v[0],v[1],"1,000 guilders",tt,T.tWeighs+0.5,T.tMoved-0.8,{col:MD.agreed});
        const pg=oc_see(cam,OC_HALL.ledger[0]+215,OC_HALL.ledger[1]-34);oc_tagAt(c,pg[0],pg[1],"the merchant's own page",tt,T.tOwn-0.1,T.tMoved-0.8,{col:MD.agreed,align:"center"});
        oc_tagAt(c,960,96,"no coin carried",tt,T.tNoCoin,T.tHolds-0.5,{col:MD.pass,icon:"tick",align:"center"});
        oc_tagAt(c,960,96,"what each merchant holds",tt,T.tHolds,T.tTrust-0.4,{col:MD.agreed,align:"center"});
        oc_cardAt(c,96,96,700,{kick:"Trusted",title:"About 5% more",sub:"for a guilder in the ledger than one in coin"},tt,T.tFive-0.2,null,{edge:MD.agreed});
        oc_tagAt(c,470,310,"for over a century",tt,T.tCentury,null,{col:MD.ink,icon:"clock"});});}},
    // data has its bags of coin too: the same data copied into every system, each copy a little different
    {at:T.tData-0.3,place:"map",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{oc_copies(c,tt,{copy:clamp((tt-T.tCopied+0.3)/1.4,0,1),diff:ag_in(tt,T.tDiff-0.1,0.5)});}},
    // at the university: tutors' claims by email, payroll's copy and Finance's, never quite agreeing; then one copy, read by both
    {at:T.tClaims-0.3,later:true,dis:0.45,place:"map",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{const end=1-ag_in(tt,T.tBreath+0.9,0.6);
      withA(c,end,()=>oc_twoCopies(c,tt,{copies:clamp((tt-T.tEmail+0.4)/1.2,0,1),mail:ag_in(tt,T.tEmail,0.4),agree:ag_in(tt,T.tAgree,0.5),one:clamp((tt-T.tOnceN+0.3)/1.2,0,1),read:clamp((tt-T.tRead+0.2)/1.0,0,1)}));
      // the breath: the ledger's line becomes the claims app's row
      oc_scr(c,S,()=>{const b=tt-T.tBreath;if(b<-0.2)return;const pa=ag_in(b,-0.2,0.5)*(1-ag_in(b,1.0,0.5)),ra=ag_in(b,0.9,0.5)*(1-ag_in(tt,tTitle+0.2,0.4));
        md_veil(c,S,0.55*ag_in(b,-0.2,0.6));oc_pageCard(c,560,440,800,{a:pa,s:"To page 87",n:"300 guilders"});oc_rowCard(c,460,440,{a:ra,k:(b-0.9)/0.5});});}}
  ],0.6);
  md_title(ctx,S,t,tTitle,"One copy, one platform","Written once, read where it's written","FILM 3 OF 3 · DATA THAT MOVES");
});

/* ---------------------------------------------------------------- 2 · The usual design */
scene("usual",(ctx,S,t,sc)=>{
  const T=oc_once(sc,"T",()=>({tThu:wAt(sc,"payday","Thursday"),tPD:wAt(sc,"payday","pay day"),tLinh:wAt(sc,"linh","Linh"),tContract:wAt(sc,"linh","casual contract"),tHours:wAt(sc,"linh","hours she claims"),
    tSheets:sc.cues.sheets,tEmail:wAt(sc,"sheets","sent by email"),tTyped:wAt(sc,"sheets","typed again"),tTally:wAt(sc,"tally","its own tally"),tFin:wAt(sc,"tally","Finance saw"),
    tReady:sc.cues.ready,tApp:wAt(sc,"ready","an app"),tDesign:sc.cues.design,tOwnDB:wAt(sc,"design","its own database"),tPipe:wAt(sc,"design","a pipeline"),tPlat:wAt(sc,"design","an analytics platform"),tRep:wAt(sc,"design","reports"),
    tCost:sc.cues.cost,tTwo:wAt(sc,"cost","Two platforms"),tBetween:wAt(sc,"cost","a pipeline between"),tPerm:wAt(sc,"cost","two sets"),tBehind:wAt(sc,"cost","always a little behind")}));
  ag_shots(ctx,S,t,sc.dur,[
    // pay day; Linh, a casual tutor on HI101, paid for the hours she claims; and how claims used to go round
    {at:0,place:"map",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{
      md_person(c,"linh",330,640,0.95,{t:tt,gaze:[4,1]});
      oc_scr(c,S,()=>{oc_tagAt(c,96,100,"Thursday 5 November 2026 · pay day",tt,T.tThu-0.2,null,{col:MD.ink,icon:"clock"});
        const nt=ag_in(tt,T.tLinh-0.1,0.4);if(nt>0)md_nameTag(c,640,250,"linh",{a:nt,col:[200,206,216]});
        oc_cardAt(c,640,356,620,{kick:"Her claims",title:"HI101 · tutorial · 1.00 hour",sub:"the hours she worked, by day"},tt,T.tHours-0.3,T.tSheets-0.3,{edge:MD.flow,icon:"doc"});
        // before the app: a spreadsheet by email, typed again by payroll; the faculty's own tally; Finance seeing the hours after pay day
        const sa=ag_in(tt,T.tSheets-0.1,0.4);if(sa>0)oc_sheet(c,660,330,250,180,{a:sa,k:(tt-T.tSheets+0.1)/0.5});
        if(tt>T.tEmail-0.2){const u=clamp((tt-T.tEmail)/1.0,0,1);md_lane(c,md_curve([920,420],[1160,330],{bend:0.5}),MD.flow,0.8,{u});if(u>0&&u<1){const q=md_cut(md_curve([920,420],[1160,330],{bend:0.5}),u);const e=q[q.length-1];oc_mail(c,e[0],e[1],46,{});}}
        oc_cardAt(c,1160,250,620,{kick:"Payroll",title:"Typed in again"},tt,T.tTyped-0.2,null,{edge:MD.sys.hr});
        oc_cardAt(c,1160,450,620,{kick:"The faculty",title:"Its own tally"},tt,T.tTally-0.2,null,{});
        oc_cardAt(c,1160,650,620,{kick:"Finance",title:"The hours, after pay day"},tt,T.tFin-0.2,null,{edge:MD.dom.finance,icon:"clock"});});}},
    // the usual design: the app on its own database, a pipeline copying each change to an analytics platform, reports on the copy; what it costs
    {at:T.tReady-0.2,later:true,dis:0.45,place:"map",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{
      oc_usual(c,tt,{parts:{app:ag_in(tt,T.tApp-0.2,0.5),pipe:clamp((tt-T.tPipe+0.1)/0.9,0,1),plat:ag_in(tt,T.tPlat-0.2,0.5),copy:ag_in(tt,T.tPlat+0.5,0.5),rep:clamp((tt-T.tRep+0.1)/0.8,0,1)},
        cost:{two:ag_in(tt,T.tTwo,0.4),pipe:ag_in(tt,T.tBetween,0.4),perm:ag_in(tt,T.tPerm,0.4),behind:ag_in(tt,T.tBehind,0.4)}});
      oc_scr(c,S,()=>{oc_kick(c,S,"2","The usual design",ag_in(tt,0.2,0.6));
        oc_pillAt(c,960,850-60,"two platforms · a pipeline · two sets of permissions · a copy behind",tt,T.tBehind+1.0,null,{col:MD.soft,size:28});});}}
  ],0.6);
});

/* ---------------------------------------------------------------- 3 · One copy */
scene("copy",(ctx,S,t,sc)=>{
  const T=oc_once(sc,"T",()=>({tNoor:sc.cues.noor,tChose:wAt(sc,"noor","chose one copy"),tLb:sc.cues.lakebase,tLbW:wAt(sc,"lakebase","Lakebase"),tPg:wAt(sc,"lakebase","Postgres database"),
    tOnce:sc.cues.once,tRow:wAt(sc,"once","as a row"),tAppr:wAt(sc,"once","approves"),tSame:wAt(sc,"once","that same row"),
    tEng:sc.cues.engines,tServes:wAt(sc,"engines","serves the app"),tLh:wAt(sc,"engines","the lakehouse"),tPlace:wAt(sc,"engines","in place"),tSlow:wAt(sc,"engines","without slowing"),
    tReaders:sc.cues.readers,tList:wAt(sc,"readers","Payroll's list"),tJob:wAt(sc,"readers","the job"),tCost:wAt(sc,"finance","casual teaching cost"),tUC:wAt(sc,"finance","Unity Catalog"),
    tWr:sc.cues.writer,tWrApp:wAt(sc,"writer","The app writes"),tCon:sc.cues.contracts,tHRw:wAt(sc,"contracts","HR system"),tServe:wAt(sc,"contracts","serves them"),tCheck:wAt(sc,"contracts","checks each claim"),
    tWritten:sc.cues.written,tWO:wAt(sc,"written","written once"),tWhere:wAt(sc,"written","read where")}));
  ag_shots(ctx,S,t,sc.dur,[
    // Noor, the data architect, chose one copy on one platform
    {at:0,later:true,dis:0.45,place:"map",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{
      md_person(c,"noor",330,640,0.95,{t:tt,gaze:[4,1]});
      oc_scr(c,S,()=>{const nt=ag_in(tt,0.3,0.4);if(nt>0)md_nameTag(c,640,330,"noor",{a:nt,col:MD.flow});
        oc_cardAt(c,640,440,820,{kick:"Noor's choice",title:"One copy, on one platform"},tt,T.tChose-0.2,null,{edge:MD.agreed});});}},
    // the claims app on Lakebase; Linh writes a claim as a row and her coordinator approves it in that same row; Postgres serves the app and
    // the lakehouse reads the same rows; the readers; one writer for each table; the contracts; written once, read where it's written
    {at:T.tLb-0.25,later:true,dis:0.45,place:"map",keys:[[0,960,540,1],[T.tReaders-0.2,970,540,1.03],[T.tCon-0.2,860,540,1.08],[T.tWritten-0.1,960,540,1]],d:1.8,draw:(c,tt)=>{
      const win=ag_in(tt,T.tOnce-0.3,0.5)*(1-ag_in(tt,T.tEng-0.5,0.5));
      oc_one(c,tt,{a:1-0.85*win,parts:{plat:ag_in(tt,T.tLbW-0.3,0.6),app:ag_in(tt,T.tLb+0.2,0.5),lakebase:ag_in(tt,T.tLbW,0.5),copy:ag_in(tt,T.tPg,0.6),
          write:clamp((tt-T.tServes+0.2)/0.9,0,1),lakehouse:ag_in(tt,T.tLh-0.2,0.5),read:clamp((tt-T.tPlace+0.2)/0.8,0,1),readers:clamp((tt-T.tList+0.2)/1.8,0,1),uc:ag_in(tt,T.tUC-0.1,0.6),
          hr:ag_in(tt,T.tHRw-0.3,0.5),contracts:clamp((tt-T.tHRw+0.1)/1.0,0,1),serve:clamp((tt-T.tServe+0.1)/1.0,0,1),check:clamp((tt-T.tCheck)/0.6,0,1)},
        writer:{claims:ag_in(tt,T.tWrApp,0.3),contracts:ag_in(tt,T.tCon+0.3,0.3)},
        lit:[tt>T.tServes&&tt<T.tLh?"lakebase":"",tt>T.tLh&&tt<T.tReaders?"lakehouse":"",tt>T.tWrApp&&tt<T.tCon?"claims":"",tt>T.tCon+0.3&&tt<T.tWritten?"contracts":"",tt>T.tWO?"once":""]});
      oc_scr(c,S,()=>{oc_kick(c,S,"3","One copy",ag_in(tt,T.tLb,0.6));
        if(win>0){if(tt<T.tEng)withA(c,win,()=>md_person(c,"linh",250,660,0.9,{t:tt,gaze:[4,0]}));
          oc_claimsWin(c,500,250,{a:win,k:(tt-T.tOnce+0.3)/0.5,write:clamp((tt-T.tOnce-0.4)/(T.tRow-T.tOnce+0.4),0,1),ok:ag_in(tt,T.tAppr+0.3,0.3),lit:1});}
        oc_tagAt(c,820,804,"read in place: the app isn't slowed",tt,T.tSlow,T.tReaders-0.3,{col:MD.pass,icon:"tick",align:"center"});
        oc_tagAt(c,960,96,"written once, read where it's written",tt,T.tWO,null,{col:MD.agreed,icon:"doc",align:"center"});});}}
  ],0.6);
});

/* ---------------------------------------------------------------- 4 · Fewer platforms */
const OC_GLUE=[["ingestion",240,520,"connector",1],["change capture",1700,300,"event",-1],["scheduling",1700,420,"clock",-1]];
scene("fewer",(ctx,S,t,sc)=>{
  const T=oc_once(sc,"T",()=>({tPipeG:wAt(sc,"gone","the pipeline"),tDB:wAt(sc,"gone","the second database"),tStep:wAt(sc,"gone","keeping two copies"),
    tTog:sc.cues.together,tSep:wAt(sc,"together","separate platforms"),tOne:wAt(sc,"together","come together"),
    tCat:sc.cues.catalog,tWho:wAt(sc,"catalog","who may read"),tPerms:wAt(sc,"catalog","permissions"),tLin:wAt(sc,"catalog","lineage"),tAud:wAt(sc,"catalog","audit"),tEvery:wAt(sc,"catalog","every other table"),
    tMoves:sc.cues.moves,tPS:wAt(sc,"moves","a payroll system"),tNot:wAt(sc,"moves","isn't on the platform"),
    tTue:sc.cues.tuesday,tLeave:wAt(sc,"tuesday","leave the platform"),tNoon:wAt(sc,"tuesday","by noon"),tUnder:wAt(sc,"tuesday","under a contract"),
    tPurp:sc.cues.purpose,tOneT:wAt(sc,"purpose","One thing moves"),tInst:wAt(sc,"purpose","instead of a copy"),
    tNight:sc.cues.night,tLater:wAt(sc,"night","comes later"),tTitle:wAt(sc,"night","A platform")}));
  const full={plat:1,app:1,lakebase:1,lakehouse:1,copy:1,write:1,read:1,readers:1,uc:1,hr:1,contracts:1,serve:1};
  ag_shots(ctx,S,t,sc.dur,[
    // what's gone: the usual design's pipeline, its second database, and the work of keeping two copies in step
    {at:0,later:true,dis:0.45,place:"map",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{
      oc_usual(c,tt,{gone:{pipe:clamp((tt-T.tPipeG+0.1)/1.0,0,1),plat:clamp((tt-T.tDB+0.1)/1.0,0,1),sync:clamp((tt-T.tStep+0.1)/1.0,0,1)}});
      oc_scr(c,S,()=>{oc_kick(c,S,"4","Fewer platforms",ag_in(tt,0.2,0.6));oc_tagAt(c,960,230,"what's gone",tt,0.3,null,{col:MD.soft,align:"center"});});}},
    // the integration services that ran between separate platforms come together on one; one catalog governs who may read the claims
    {at:T.tTog-0.25,later:true,dis:0.45,place:"map",keys:[[0,960,540,1],[T.tCat-0.2,960,560,1.04],[T.tMoves-0.2,960,540,1]],d:1.8,draw:(c,tt)=>{
      const cat=ag_in(tt,T.tWho-0.2,0.5)*(1-ag_in(tt,T.tMoves,0.5)),purp=ag_in(tt,T.tOneT-0.1,0.6);
      const gone=1-ag_in(tt,T.tLater-0.5,0.5);if(gone>0.004)withA(c,gone,()=>oc_one(c,tt,{parts:Object.assign({},full,{payroll:ag_in(tt,T.tPS-0.2,0.5),tuesday:clamp((tt-T.tLeave+0.1)/1.0,0,1)}),ucText:cat>0.5?"Unity Catalog · permissions, lineage, audit":undefined,
        lit:[cat>0?"claims":"",cat>0?"uc":"",tt>T.tLeave?"tuesday":""],dim:purp}));
      // the separate services, each its own small platform, glide in and become part of the one
      OC_GLUE.forEach(([name,x0,y0,icon,dir],i)=>{const u=clamp((tt-T.tOne+0.1-i*0.15)/1.1,0,1),a=ag_in(tt,T.tSep-0.4+i*0.15,0.4)*(1-ag_in(u,0.35,0.6));if(a<=0.004)return;
        md_tag(c,x0+dir*70*ag_sine(u),y0,name,{col:MD.soft,icon,align:"center",a});});
      oc_scr(c,S,()=>{oc_kick(c,S,"4","Fewer platforms",1);
        oc_tagAt(c,960,96,"like every other table",tt,T.tEvery-0.1,T.tMoves,{col:MD.flow,icon:"table",align:"center"});
        oc_tagAt(c,1711,590,"by noon on Tuesday",tt,T.tNoon-0.1,T.tLater-0.5,{col:MD.ink,icon:"clock",align:"center"});
        oc_tagAt(c,1711,880-24,"a contract with payroll",tt,T.tUnder-0.1,T.tLater-0.5,{col:MD.agreed,icon:"contract",align:"center"});
        oc_pillAt(c,960,96,"one thing moves, on purpose",tt,T.tOneT,T.tLater-0.5,{col:MD.agreed});
        oc_cardAt(c,560,380,800,{kick:"Later in this module",title:"A platform that watches itself"},tt,T.tLater+0.1,null,{edge:MD.flow,icon:"eye"});});}}
  ],0.6);
});

/* ---------------------------------------------------------------- 5 · What to choose */
const OC_ADVICE=[[110,250,"1 · One copy","Keep one copy where you can","move data only when a reader needs it elsewhere","store",MD.flow],
  [980,250,"2 · One writer","Decide which system writes each table","and let the others read it","doc",MD.flow],
  [110,550,"3 · A system you buy","Agree the contract at its interface","as in Moving is easy, agreeing is the work","contract",MD.agreed],
  [980,550,"4 · One platform","One copy serves a whole platform","as Both at once did for one database","store",MD.flow]];
scene("choose",(ctx,S,t,sc)=>{
  const T=oc_once(sc,"T",()=>({tKeep:sc.cues.keep,tDecide:sc.cues.decide,tBought:sc.cues.bought,tBoth:sc.cues.both,tHere:wAt(sc,"both","Here"),
    tWheel:sc.cues.wheel,tStd:wAt(sc,"wheel","standards"),tReinv:wAt(sc,"wheel","reinvent"),tDocs:sc.cues.docs,tInv:wAt(sc,"docs","Investigate"),tAd:wAt(sc,"docs","adapt"),
    tImp:wAt(sc,"docs","implement"),tIt:wAt(sc,"docs","iterate"),tOff:wAt(sc,"docs","official docs")}));
  const at=[T.tKeep,T.tDecide,T.tBought,T.tBoth];
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,later:true,dis:0.45,place:"map",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{
      oc_scr(c,S,()=>{oc_kick(c,S,"5","What to choose",ag_in(tt,0.2,0.6));const out=1-ag_in(tt,T.tWheel-0.3,0.5);
        if(out>0)withA(c,out,()=>OC_ADVICE.forEach(([x,y,kick,title,sub,icon,edge],i)=>oc_cardAt(c,x,y,830,{kick,title,sub},tt,at[i]-0.2,null,{edge,icon})));
        // standards already exist: the module's wheel draws itself; then the four steps, starting from the official docs
        const wa=ag_in(tt,T.tWheel-0.1,0.5);if(wa>0){md_mark(c,960,330,96,(tt-T.tWheel)/1.8,wa);md_T(c,"Don't reinvent the wheel",960,520,{w:800,size:40,align:"center",a:ag_in(tt,T.tReinv-0.2,0.5)});}
        [["Investigate",T.tInv],["Adapt",T.tAd],["Implement",T.tImp],["Iterate",T.tIt]].forEach(([s,t0],i)=>oc_pillAt(c,330+i*420,630,s,tt,t0-0.1,null,{col:i===3?MD.pass:MD.flow,size:30}));
        const da=ag_in(tt,T.tOff-0.2,0.5);if(da>0)md_window(c,560,700,800,150,{logo:"databricks",product:"Databricks",title:"the official docs",edge:MD.flow,a:da,k:Math.min(1,ag_spr(tt,T.tOff-0.2,0.5)),
          draw:(c2,b)=>md_T(c2,"docs.databricks.com",b.x+20,b.y+44,{w:500,size:28,f:"mono",col:MD.flow})});});}}
  ],0.6);
});

/* ---------------------------------------------------------------- 6 · The same row */
scene("row",(ctx,S,t,sc)=>{
  const T=oc_once(sc,"T",()=>({tMoved:wAt(sc,"amsterdam","a line moved"),tShowed:wAt(sc,"amsterdam","the same ledger"),
    tOneRow:sc.cues.onerow,tOneR:wAt(sc,"onerow","one row"),tShe:wAt(sc,"onerow","she writes it"),tCoord:wAt(sc,"onerow","her coordinator approves"),tPay:wAt(sc,"onerow","payroll pays"),tFin:wAt(sc,"onerow","Finance counts"),
    tPaid:sc.cues.paid,t856:wAt(sc,"paid","eight hundred"),tRows:wAt(sc,"paid","rows like hers"),tNot:wAt(sc,"paid","not one claim"),tTake:sc.cues.takeaway,tBreath:sc.cues.breath}));
  ag_shots(ctx,S,t,sc.dur,[
    // in Amsterdam, a payment became a line moved in one ledger, and the same ledger showed what everyone held
    {at:0,place:"ocHall",keys:[[0,1190,720,1.72]],push:0.03,draw:(c,tt)=>{const mv=clamp((tt-T.tMoved)/1.6,0,1),lit=ag_in(tt,T.tShowed,0.5);
      const pages=[{head:"Page 112",lines:[{s:"Coin in",n:"1,000"},{s:"To page 87",n:"300",col:[28,78,140],w:clamp((tt-T.tMoved+0.2)/0.6,0,1)}],bal:["1,000","700",clamp((mv-0.75)/0.25,0,1)],glow:lit},
        {head:"Page 87",lines:[{s:"Coin in",n:"450"},{s:"From page 112",n:"300",col:[28,78,140],w:clamp((mv-0.8)/0.2,0,1)}],bal:["450","750",clamp((mv-0.85)/0.15,0,1)],glow:lit}];
      const L=oc_hallRoom(c,tt,{fly:1,tip:0.06,weights:1,pages});oc_lineMoves(c,L,mv,"300 guilders");}},
    // at the university, Linh's claim is one row: she writes it, her coordinator approves it, payroll pays it, Finance counts it; 856 paid
    {at:T.tOneRow-0.3,place:"map",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{
      md_person(c,"linh",300,650,0.92,{t:tt,gaze:[4,1],smile:0.3+0.4*ag_in(tt,T.tPaid,0.8)});
      oc_scr(c,S,()=>withA(c,1-ag_in(tt,T.tTake-1.0,0.5),()=>{const k=(tt-T.tOneR+0.2)/0.5;oc_rowCard(c,620,330,{a:ag_in(k,0,0.3),k,glow:ag_in(tt,T.tFin+0.4,0.5),status:tt<T.tCoord+0.3?"submitted":"approved"});
        [["she writes it",T.tShe,MD.ink,"person"],["her coordinator approves it",T.tCoord,MD.wait,"tick"],["payroll pays it",T.tPay,MD.pass,"tick"],["Finance counts it",T.tFin,MD.dom.finance,"contract"]]
          .forEach(([s,t0,col,icon],i)=>oc_tagAt(c,i%2?1140:640,i<2?250:520,s,tt,t0-0.1,null,{col,icon}));
        const na=ag_in(tt,T.t856-0.2,0.5);if(na>0){md_T(c,"856",900,720,{w:800,size:84,align:"right",col:MD.agreed,a:na});md_T(c,"casual staff paid from rows like hers",930,700,{w:700,size:32,a:na});}
        oc_pillAt(c,1240,800,"not one claim copied",tt,T.tNot,null,{col:MD.pass,icon:"tick"});}));}}
  ],0.6);
  md_end(ctx,S,t,T.tTake-0.8,"One copy, one platform","Keep one copy, governed once.","Film 3 of 3","Data that moves");
});

// chapters that open in the room the one before ends in: the end leaves, and the new chapter's first moment comes in (later: true)
ag_cutInto(["usual","copy","fewer","choose"]);
