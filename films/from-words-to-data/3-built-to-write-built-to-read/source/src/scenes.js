/* ===== Built to write, built to read: scenes =====
   Eight chapters, as in ../script.md. In Venice in 1494, merchants write each transaction into a journal, in time order, and post it
   to a ledger, by account, where it's read and balanced. Five centuries later, the university writes awards one by one and reads
   ten years of them at once: normalised tables and transactions for writing, a star for reading, each fast at its own job. */
const BW_QW=["How","many","awards,","by","faculty","and","by","year,","for","the","last","ten","years?"];

/* ---------- 1. Journal and ledger ---------- */
scene("ledger",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),B=c("breath");histBg(ctx,S,t);
  const tp=fin(t,c("today")-0.3,1.2),cJ=c("journal"),cP=c("post"),cT=c("two");
  if(tp<1)withA(ctx,1-tp,()=>{bw_venice(ctx,820,0.55);
    yearTag(ctx,120,110,"1494 · Venice",CLAY,fin(t,0.3,0.6));
    const pm=fin(t,cJ-0.6,1.2);bw_plate(ctx,960,lerp(480,110,pm),"Summa de arithmetica","Luca Pacioli · Venice, 1494",fin(t,c("venice")+0.3,0.8),lerp(1.25,0.62,pm));
    // the journal: every transaction, as it happened, one after another
    const jA=fin(t,cJ-0.4,0.8);bw_book(ctx,BW_JX,BW_JY,BW_JW,BW_JH,{a:jA,title:"Journal",top:96,lh:34,margin:78});
    let qx=null,qy=null;
    withA(ctx,jA,()=>BW_J.forEach((e,i)=>{const t0=cJ+0.4+i*1.0,p=clamp((t-t0)/0.8,0,1);if(p<=0)return;const y=bw_entryY(i),p1=clamp(p/0.62,0,1),p2=clamp((p-0.62)/0.2,0,1),p3=clamp((p-0.8)/0.2,0,1);
      bw_ink(ctx,e[0],BW_JX+14,y,{size:17,w:700,color:"rgba(120,50,30,0.9)",p:p1});bw_ink(ctx,e[1],BW_JX+92,y,{size:22,p:p1});
      bw_ink(ctx,e[2]+" ducats",BW_JX+BW_JW-24,y,{size:22,w:800,align:"right",p:p2});bw_ink(ctx,"debit "+e[3]+" · credit "+e[4],BW_JX+92,y+32,{size:16,color:"rgba(90,60,36,0.8)",p:p3});
      if(p<1){qx=BW_JX+92+bw_inkW(ctx,typeOn(e[1],p1),22);qy=y;if(p1>=1){qx=BW_JX+BW_JW-24;}}
      const done=BW_POST.filter(q=>q.i===i).every(q=>t>cP+0.7+q.i*1.1+q.side*0.18+0.8);if(done)withA(ctx,fin(t,cP+0.7+i*1.1+1.0,0.3),()=>T(ctx,"✓",BW_JX+BW_JW-10,y+32,{w:800,size:18,align:"right",color:"rgba(40,110,60,0.9)"}));}));
    if(qx!=null)bw_quill(ctx,qx+4,qy+4,0.62,jA,t);
    // the ledger: the same entries, grouped by account, with a debit side and a credit side
    const lA=fin(t,cP-0.5,0.8);bw_book(ctx,BW_LX,BW_LY,BW_LW,BW_LH,{a:lA,pages:2,title:"Ledger",top:96,lh:38,margin:28});
    const miss=fin(t,cT+4.4,0.3)*(1-fin(t,cT+7.3,0.5));
    withA(ctx,lA,()=>{Object.keys(BW_ACC).forEach((k,n)=>{const A=BW_ACC[k],ap=fin(t,cP-0.2+n*0.2,0.5);withA(ctx,ap,()=>{
        bw_ink(ctx,k,A.x+(k==="Cash"?0:0),A.y+(k==="Cash"?0:30),{size:26,w:800,color:"rgba(90,40,20,0.95)"});const hy=A.y+(k==="Cash"?0:30)+34;
        T(ctx,"debit",A.x+20,hy+18,{w:700,size:15,color:"rgba(110,80,50,0.9)"});T(ctx,"credit",A.x+260,hy+18,{w:700,size:15,color:"rgba(110,80,50,0.9)"});
        ctx.strokeStyle="rgba(110,70,40,0.4)";ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(A.x+240,hy);ctx.lineTo(A.x+240,hy+(k==="Cash"?120:90));ctx.moveTo(A.x+10,hy+26);ctx.lineTo(A.x+440,hy+26);ctx.stroke();});});
      // each entry posted twice: once to the account it debits, once to the account it credits
      BW_POST.forEach(q=>{const tf=cP+0.7+q.i*1.1+q.side*0.18,u=clamp((t-tf)/0.8,0,1);if(u<=0)return;const A=BW_ACC[q.acc],dy=q.acc==="Cash"?0:30,tx=A.x+(q.side?260:20),ty=A.y+dy+34+62+q.k*36;
        if(u<1){const sx=BW_JX+BW_JW-60,sy=bw_entryY(q.i)-6,e=ease(u),mx=(sx+tx)/2,my=Math.min(sy,ty)-140,x=(1-e)*(1-e)*sx+2*(1-e)*e*mx+e*e*tx,y=(1-e)*(1-e)*sy+2*(1-e)*e*my+e*e*ty;
          glow(ctx,x,y,40,BW_INK,0.5);ctx.fillStyle="rgba(240,226,196,0.95)";rr(ctx,x-30,y-18,60,30,8);ctx.fill();bw_ink(ctx,String(q.amt),x,y+5,{size:18,w:800,align:"center"});return;}
        const wrong=q.acc==="Cash"&&q.side===0&&q.k===1&&miss>0.5;
        bw_ink(ctx,q.date,tx,ty,{size:16,color:"rgba(110,70,40,0.85)"});bw_ink(ctx,wrong?"50":String(q.amt),tx+170,ty,{size:21,w:800,align:"right",color:wrong?"rgba(190,40,30,0.95)":undefined});
        if(wrong){ctx.strokeStyle="rgba(200,50,40,"+(0.8*miss)+")";ctx.lineWidth=2.4;ctx.beginPath();ctx.ellipse(tx+152,ty-7,34,20,0,0,TAU);ctx.stroke();}});
      // the balance: every debit has its credit, so the two sides must match
      const bA=fin(t,cT+0.2,0.6);if(bA>0)withA(ctx,bA,()=>{const x=BW_ACC.Cash.x,y=BW_LY+372,dS=150-(miss>0.5?5:0),ok=dS===150;
        ctx.strokeStyle="rgba(110,70,40,0.45)";ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(x,y-34);ctx.lineTo(x+440,y-34);ctx.stroke();
        bw_ink(ctx,"all debits",x+10,y,{size:20});bw_ink(ctx,String(dS),x+220,y,{size:24,w:800,align:"right",color:ok?undefined:"rgba(190,40,30,0.95)"});
        bw_ink(ctx,"all credits",x+10,y+42,{size:20});bw_ink(ctx,"150",x+220,y+42,{size:24,w:800,align:"right"});
        const cx=x+330,cy=y+14,col=ok?[40,130,70]:[200,50,40];ctx.fillStyle="rgba(240,228,200,0.9)";ctx.beginPath();ctx.arc(cx,cy,30,0,TAU);ctx.fill();ring(ctx,cx,cy,30,col,1,3);
        if(ok)tick_(ctx,cx,cy+1,34,col,1);else cross_(ctx,cx,cy,34,col,1);T(ctx,ok?"balanced":"doesn't balance",cx+44,cy+7,{w:800,size:18,color:rgba(col,1)});});});
    // the correction, with the quill
    const fx=fin(t,cT+6.6,0.4)*(1-fin(t,cT+7.8,0.5));if(fx>0){const A=BW_ACC.Cash;bw_quill(ctx,A.x+176,A.y+34+62+36+2,0.62,fx,t);}
    // two shapes for one set of facts
    withA(ctx,fin(t,cT+2.0,0.5),()=>{tag(ctx,BW_JX+BW_JW/2,BW_JY+BW_JH+48,"one shape for writing",BW_W,{align:"center",size:22});T(ctx,"in time order, as it happens",BW_JX+BW_JW/2,BW_JY+BW_JH+92,{w:600,size:18,align:"center",color:rgba(PARCH,0.85)});});
    withA(ctx,fin(t,cT+3.2,0.5),()=>{tag(ctx,BW_LX+BW_LW/2,BW_JY+BW_JH+48,"one shape for reading",BW_R,{align:"center",size:22});T(ctx,"by account, where it's read and balanced",BW_LX+BW_LW/2,BW_JY+BW_JH+92,{w:600,size:18,align:"center",color:rgba(PARCH,0.85)});});});
  // five centuries later: graduation day, and planning day
  if(tp>0)withA(ctx,tp,()=>{bg2(ctx);const cy=c("today");
    const gA=fin(t,cy+0.6,0.6),pA=fin(t,cy+1.4,0.6);
    withA(ctx,gA,()=>{glass(ctx,110,170,800,640,22,BW_W,{glow:14,ea:0.45,fill:"rgba(10,18,36,0.5)"});tag(ctx,140,216,"Graduation day",BW_W,{size:22});T(ctx,"written one by one",880,224,{w:600,size:18,align:"right",color:rgba(SOFT,1)});});
    withA(ctx,pA,()=>{glass(ctx,1010,170,800,640,22,BW_R,{glow:14,ea:0.45,fill:"rgba(8,20,22,0.5)"});tag(ctx,1040,216,"Planning day",BW_R,{size:22});T(ctx,"read ten years at once",1780,224,{w:600,size:18,align:"right",color:rgba(SOFT,1)});});
    // awards issued, each complete: a fast stream of tiles
    const s0=cy+3.8,n=Math.floor(clamp((t-s0)/0.075,0,42));
    for(let i=0;i<42;i++){const tt=s0+i*0.075,u=clamp((t-tt)/0.3,0,1);if(u<=0)continue;const col_=i%7,row=Math.floor(i/7),tx=150+col_*104,ty=272+row*74,x=lerp(170,tx,ease(u)),y=lerp(760,ty,ease(u));
      bw_awardTile(ctx,x,y,94,60,u,pulseAt(t,tt+0.25,0.5));if(t>tt+0.5)withA(ctx,fin(t,tt+0.5,0.2),()=>tick_(ctx,x+80,y+14,14,GOOD,0.9));}
    withA(ctx,fin(t,s0,0.4),()=>{T(ctx,"awards issued today",150,772,{w:700,size:20,color:rgba(SOFT,1)});T(ctx,fmtNum(lerp(0,4380,clamp((t-s0)/4.6,0,1))+(t>s0+4.6?(t-s0-4.6)*38:0)),880,778,{w:800,size:40,align:"right",color:rgba(BW_W,1)});});
    withA(ctx,fin(t,cy+6.4,0.5),()=>tag(ctx,510,834,"each one complete and right",BW_W,{align:"center",size:18}));
    // ten years, read at once
    const lit=fin(t,cy+9.6,0.5);
    for(let i=0;i<10;i++){const a=fin(t,cy+8.2+i*0.06,0.4);bw_slab(ctx,1070,712-i*46,470,36,BW_R,a,String(2017+i),lit*(0.75+0.25*Math.sin(t*2+i)));}
    if(lit>0){withA(ctx,lit*(1-fin(t,cy+11.4,1.2))*0.7,()=>{const g=ctx.createLinearGradient(0,240,0,740);g.addColorStop(0,rgba(BW_R,0));g.addColorStop(0.5,rgba(BW_R,0.35));g.addColorStop(1,rgba(BW_R,0));ctx.fillStyle=g;ctx.fillRect(1060,240,560,500);});}
    withA(ctx,fin(t,cy+10.2,0.5),()=>tag(ctx,1410,772,"ten years, read at once",BW_R,{align:"center",size:20}));});
  seriesTitle(ctx,S,t,B,"Built to write, built to read","why the same award is stored twice",BW_W);
  fadeIn(ctx,S,t);vign(ctx,S);});

/* ---------- 2. Built to write ---------- */
const BW_LEARN={name:"learner",cols:[["learner_id","pk"],["name",""],["email",""]],rows:[["L-204","Aisha Karim","aisha.k@uni.edu"],["L-311","Ben Okafor","ben.o@uni.edu"]]};
const BW_COURSE={name:"course",cols:[["course_id","pk"],["title",""]],rows:[["BSC-DS","BSc Data Science"],["MC-ML","Machine learning basics"],["MC-VIS","Data visualisation"],["MC-ETH","Data ethics"]]};
const BW_AWARD={name:"award",cols:[["award_id","pk"],["learner_id","fk"],["course_id","fk"],["awarded_on",""]],rows:[["A-9001","L-204","BSC-DS","2025-12-10"],["A-9002","L-204","MC-ML","2026-05-02"],["A-9003","L-311","MC-ETH","2026-06-20"]]};
scene("write",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const cO=c("once"),cK=c("keys"),cA=c("all"),cN=c("name");
  withA(ctx,fin(t,0.2,0.6),()=>tag(ctx,120,70,"built to write",BW_W,{size:20}));
  // the tables, which move up to make room for the transaction
  const g=fin(t,cA-0.2,1.2),k=lerp(1,0.62,g);ctx.save();ctx.translate(960,lerp(0,-50,g)+160);ctx.scale(k,k);ctx.translate(-960,-160);
  const nameHi=fin(t,cO+3.4,0.5)*(1-fin(t,cK-0.4,0.8)),keyP=pulseAt(t,cK+0.4,1.6),fkA=fin(t,cK+2.4,0.5),relP=clamp((t-cK-2.5)/1.0,0,1);
  const Lg=bw_tbl(ctx,140,160,Object.assign({a:fin(t,cO+0.2,0.6),keyA:0.55+0.45*fin(t,cK,0.4),hi:keyP*0.5,cell:(j,i)=>j===0&&i===1&&nameHi>0.01?{hi:nameHi,col:mix(INK,BW_W,nameHi)}:null},BW_LEARN));
  const Cg=bw_tbl(ctx,1260,160,Object.assign({a:fin(t,cO+0.6,0.6),keyA:0.55+0.45*fin(t,cK,0.4),hi:keyP*0.5},BW_COURSE));
  const rej=fin(t,cK+4.6,0.4)*(1-fin(t,cK+6.8,0.6)),bad=fin(t,cK+5.6,0.3);
  const Ag=bw_tbl(ctx,680,480,Object.assign({a:fin(t,cO+1.0,0.6),keyA:0.55+0.45*fin(t,cK,0.4),fkA:0.3+0.7*fkA,hi:keyP*0.5,rowA:j=>fin(t,cO+1.2+j*0.25,0.4),
    cell:(j,i)=>i===1&&j<2&&nameHi>0.01?{hi:nameHi,col:mix(INK,BW_W,nameHi)}:null},BW_AWARD));
  // each award points to one learner, and to one course
  bw_rel(ctx,Lg.colX(0),Lg.y+Lg.h,Ag.colX(1),Ag.y,BW_W,fkA,{p:relP,ym:420});
  bw_rel(ctx,Cg.colX(0),Cg.y+Cg.h,Ag.colX(2),Ag.y,BW_W,fkA,{p:relP,ym:446});
  // the name, stored once: the awards point to it
  if(nameHi>0.01){withA(ctx,nameHi,()=>{[0,1].forEach(j=>arrowTo(ctx,Ag.colX(1)-40,Ag.rowY(j)-8,Lg.colX(1)+20,Lg.rowY(0)+16,BW_W,0.8,{bend:-0.18,head:12,lw:2,p:clamp((t-cO-3.6-j*0.2)/0.8,0,1)}));
    tag(ctx,Lg.colX(1),122,"stored once",BW_W,{align:"center",size:20});});
    withA(ctx,nameHi*fin(t,cO+5.0,0.5),()=>tag(ctx,Ag.x+Ag.w+26,Ag.rowY(1),"not on every award",BW_W,{size:20}));}
  // keys and a rule the data must meet
  withA(ctx,fin(t,cK+0.4,0.5)*(1-fin(t,cA-0.4,0.6)),()=>tag(ctx,940,250,"a key identifies each row",REF,{align:"center",size:20}));
  withA(ctx,fin(t,cK+2.4,0.5)*(1-fin(t,cA-0.4,0.6)),()=>tag(ctx,940,300,"rules the data must meet",BW_W,{align:"center",size:20}));
  if(rej>0.01){const y=Ag.y+Ag.h+14+(1-ease(fin(t,cK+4.6,0.5)))*30+ease(fin(t,cK+6.8,0.6))*40;withA(ctx,rej,()=>{
    glass(ctx,Ag.x,y,Ag.w,44,10,bad>0.5?BAD:BW_W,{glow:10,ea:0.01,fill:"rgba(7,12,24,0.95)"});ctx.save();ctx.setLineDash([8,6]);ctx.strokeStyle=rgba(bad>0.5?BAD:BW_W,0.9);ctx.lineWidth=1.8;rr(ctx,Ag.x,y,Ag.w,44,10);ctx.stroke();ctx.restore();
    ["A-9009","L-999","MC-ML","2026-09-28"].forEach((v,i)=>T(ctx,v,Ag.cx[i]+14,y+29,{f:"mono",w:500,size:17,color:i===1&&bad>0.5?rgba(BAD,1):rgba(INK,0.8)}));
    if(bad>0.01){withA(ctx,bad,()=>{cross_(ctx,Ag.x+Ag.w+30,y+22,34,BAD,1);tag(ctx,Ag.x+Ag.w+60,y+22,"no learner L-999: rejected",BAD,{size:20});});}});}
  ctx.restore();
  // a transaction: three writes that all happen, or none do
  const bx=300,bw=1320,wA=fin(t,cA+0.3,0.6)*(1-0.78*fin(t,cN+0.1,0.6));
  const box=(y,label,st,res,resCol,a)=>withA(ctx,a,()=>{glass(ctx,bx,y,bw,160,18,BW_W,{glow:8,ea:0.01,fill:"rgba(10,18,36,0.55)"});ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(BW_W,0.75);ctx.lineWidth=2;rr(ctx,bx,y,bw,160,18);ctx.stroke();ctx.restore();
    T(ctx,label,bx+24,y+30,{f:"mono",w:500,size:17,color:rgba(BW_W,1)});
    const W3=[["1 · award","+ row A-9004"],["2 · learner record","credit points 312 → 324"],["3 · transcript","+ Data visualisation, 12 cp"]];
    st.forEach((s,i)=>{if(s)bw_write(ctx,bx+24+i*430,y+48,410,96,W3[i][0],W3[i][1],s,1);});
    if(res)withA(ctx,res[1],()=>tag(ctx,bx+bw-18-(tw(ctx,res[0],20,700)+26),y+26,res[0],resCol,{size:20}));});
  if(wA>0.01){const a0=cA,s1=[t>a0+2.7?"pend":null,t>a0+3.5?"pend":null,t>a0+4.4?"pend":null].map(s=>s&&t>a0+5.7?"done":s);
    box(470,"transaction · issue award A-9004",s1,["commit ✓",fin(t,a0+5.7,0.4)],GOOD,wA);
    const b2=fin(t,a0+6.3,0.5);if(b2>0){const s2=[t>a0+6.6?"pend":null,t>a0+6.9?"pend":null,t>a0+7.3?"fail":null].map((s,i)=>s&&i<2&&t>a0+7.9?"back":s);
      box(660,"transaction · issue award A-9005",s2,["roll back · nothing saved",fin(t,a0+8.2,0.4)],BAD,wA*b2);}}
  // what it's called
  [["normalisation",BW_W,0.5],["keys",REF,1.5],["constraints",BW_W,2.1],["transactions",BW_W,2.8]].forEach(([s,col,d],i,arr)=>{const a=fin(t,cN+d,0.4);if(a<=0)return;
    const ws=arr.map(q=>tw(ctx,q[0],30,700)+26),tot=ws.reduce((p,v)=>p+v,0)+3*40;let x=960-tot/2;for(let k2=0;k2<i;k2++)x+=ws[k2]+40;
    withA(ctx,a,()=>tag(ctx,x,640,s,col,{size:30}));if(i<3)withA(ctx,fin(t,cN+arr[i+1][2],0.4),()=>T(ctx,"·",x+ws[i]+20,650,{w:800,size:30,align:"center",color:rgba(SOFT,1)}));});
  vign(ctx,S);});

/* ---------- 3. What goes wrong without it ---------- */
const BW_WIDE={name:"awards · the name on every row",cols:[["award_id","pk"],["learner_name",""],["course_title",""],["credits",""],["awarded_on",""]],
  rows:[["A-9001","Aisha Karim","BSc Data Science","240","2025-12-10"],["A-9002","Aisha Karim","Machine learning basics","12","2026-05-02"],["A-9004","Aisha Karim","Data visualisation","12","2026-09-28"],["A-9003","Ben Okafor","Data ethics","6","2026-06-20"]]};
scene("wrong",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const c3=c("three"),cC=c("change"),cPr=c("print"),cD=c("delete"),cAn=c("anomaly");
  withA(ctx,fin(t,0.2,0.6),()=>tag(ctx,120,70,"the name on every award",BW_AMB,{size:20}));
  const three=fin(t,c3+2.4,0.5),fix=[fin(t,cC+1.5,0.3),fin(t,cC+2.0,0.3)],missed=fin(t,cC+2.7,0.4),gone=fin(t,cD+3.4,0.5),col_=fin(t,cD+4.0,0.6);
  const Tg=bw_tbl(ctx,120,170,Object.assign({a:fin(t,c3+0.2,0.6),rowA:j=>j===3?1-col_:fin(t,c3+0.4+j*0.2,0.4),
    rowBg:j=>j===3?[BAD,fin(t,cD+1.0,0.5)]:null,
    cell:(j,i)=>{if(i===1&&j<3){if(j<2&&fix[j]>0.5)return{text:"Aisha Salem",hi:three*(1-fin(t,cD-0.4,0.6))*0.8,col:BW_W,hiCol:BW_W};if(j===2&&missed>0.01)return{hi:missed*(1-fin(t,cAn+2.6,0.8)*0.5),col:mix(INK,BAD,missed),hiCol:BAD};return{hi:three*(1-fin(t,cD-0.4,0.6)),col:mix(INK,BW_AMB,three),hiCol:BW_AMB};}
      if(j===3&&(i===2||i===3))return{hi:fin(t,cD+1.0,0.5)*(1-gone),hiCol:BAD,strike:gone};if(j===3)return{strike:gone};return null;}},BW_WIDE));
  withA(ctx,three*(1-fin(t,cC-0.2,0.5)),()=>tag(ctx,Tg.colX(1),Tg.y+Tg.h+36,"3 copies of one name",BW_AMB,{align:"center",size:20}));
  // she changes her name: two copies corrected, one missed
  const nc=fin(t,cC+0.2,0.5)*(1-fin(t,cD-0.4,0.6));withA(ctx,nc,()=>{glass(ctx,1010,170,560,110,18,BW_W,{glow:14,ea:0.8,fill:"rgba(7,12,24,0.94)"});T(ctx,"name change",1036,208,{w:700,size:18,color:rgba(SOFT,1)});
    T(ctx,"Aisha Karim  →  Aisha Salem",1036,252,{w:800,size:28,color:rgba(INK,1)});});
  fix.forEach((f,j)=>{if(f>0&&f<1)glow(ctx,Tg.colX(1),Tg.rowY(j),110,BW_W,0.5*pulseAt(t,cC+1.5+j*0.5,0.6));if(f>0.5)withA(ctx,(1-fin(t,cD-0.4,0.6))*f,()=>tick_(ctx,Tg.cx[1]+Tg.cw[1]-18,Tg.rowY(j),20,GOOD,1));});
  withA(ctx,missed*(1-fin(t,cD-0.4,0.6)),()=>{cross_(ctx,Tg.cx[1]+Tg.cw[1]-18,Tg.rowY(2),20,BAD,1);tag(ctx,Tg.x+Tg.w+22,Tg.rowY(2),"missed",BAD,{size:20});});
  // her next certificate prints the old name
  const pr=fin(t,cPr+0.1,0.6)*(1-fin(t,cD-0.4,0.6));if(pr>0){const y=lerp(Tg.rowY(2),330,ease(fin(t,cPr+0.1,0.7)));
    const h=credCard(ctx,1060,y,540,{a:pr,era:"paper",title:"Certificate",issuer:"the university",holder:"Aisha Karim",claim:"Data visualisation",date:"28 Sep 2026",rh:38});
    withA(ctx,pr*fin(t,cPr+0.8,0.4),()=>{ctx.strokeStyle=rgba(BAD,0.95);ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(1060+220,y+58+38-7,120,24,0,0,TAU);ctx.stroke();tag(ctx,1060+360,y+58+38-7,"old name",BAD,{size:20});});}
  // a course described only on its awards
  const cl=fin(t,cD+0.3,0.6);if(cl>0){const x=1060,y=170,list=[["BSc Data Science","240 cp"],["Machine learning basics","12 cp"],["Data visualisation","12 cp"],["Data ethics","6 cp"]];
    withA(ctx,cl,()=>{glass(ctx,x,y,560,300,18,BW_AMB,{glow:12,ea:0.7,fill:"rgba(7,12,24,0.94)"});T(ctx,"courses, as the awards describe them",x+24,y+40,{w:700,size:19,color:rgba(BW_AMB,1)});
      list.forEach(([n,cp],i)=>{const last=i===3,yy=y+92+i*50,dead=last?col_:0;withA(ctx,1-0.7*dead,()=>{if(last&&fin(t,cD+1.0,0.5)>0){ctx.fillStyle=rgba(BAD,0.14*fin(t,cD+1.0,0.5));rr(ctx,x+14,yy-30,532,44,8);ctx.fill();}
        T(ctx,n,x+30,yy,{w:700,size:22,color:rgba(dead>0.3?BAD:INK,1)});T(ctx,cp,x+530,yy,{f:"mono",w:500,size:17,align:"right",color:rgba(SOFT,1)});});
        if(last&&dead>0.01){withA(ctx,dead,()=>{ctx.strokeStyle=rgba(BAD,0.9);ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(x+26,yy-7);ctx.lineTo(x+30+tw(ctx,n,22,700)*dead,yy-7);ctx.stroke();tag(ctx,x+290,yy-8,"gone",BAD,{size:18});});}});
      withA(ctx,fin(t,cD+1.2,0.5)*(1-col_),()=>tag(ctx,x+290,y+300+30,"described only on its award",BW_AMB,{align:"center",size:18}));});
    withA(ctx,fin(t,cD+2.4,0.4)*(1-fin(t,cD+3.6,0.4)),()=>tag(ctx,Tg.x+Tg.w+22,Tg.rowY(3),"delete the award",BAD,{size:20}));}
  // the names of the two mistakes
  withA(ctx,fin(t,cAn+0.5,0.5),()=>tag(ctx,Tg.colX(1)+60,Tg.y+Tg.h-10+50,"update anomaly",BAD,{align:"center",size:24}));
  withA(ctx,fin(t,cAn+1.4,0.5),()=>tag(ctx,1340,532,"delete anomaly",BAD,{align:"center",size:24}));
  // each fact once: the name in one place, the course in its own row
  const fx=fin(t,cAn+3.0,0.6);if(fx>0)withA(ctx,fx,()=>{glass(ctx,120,590,1680,240,22,BW_W,{glow:14,ea:0.55,fill:"rgba(10,18,36,0.6)"});tag(ctx,150,620,"each fact once",BW_W,{size:20});
    const L=bw_tbl(ctx,170,660,{cols:[["learner_id","pk"],["name",""]],rows:[["L-204","Aisha Salem"]],size:17,cell:(j,i)=>i===1?{hi:fin(t,cAn+3.8,0.5),col:BW_W}:null});
    for(let i=0;i<3;i++){const x=640+i*140;glass(ctx,x,700,120,50,10,BW_W,{glow:6,ea:0.6,fill:"rgba(8,14,30,0.94)"});T(ctx,"award",x+60,731,{f:"mono",w:500,size:16,align:"center",color:rgba(SOFT,1)});
      arrowTo(ctx,x+20,700,L.x+L.w-30,L.rowY(0)-4,BW_W,0.7*fin(t,cAn+3.6+i*0.15,0.4),{bend:0.12,head:10,lw:1.8});}
    withA(ctx,fin(t,cAn+4.2,0.4),()=>T(ctx,"1 edit, no copy to miss",640,800,{w:700,size:20,color:rgba(GOOD,1)}));
    const C=bw_tbl(ctx,1150,660,{cols:[["course_id","pk"],["title",""],["cp",""]],rows:[["MC-ETH","Data ethics","6"]],size:17,cell:(j,i)=>({hi:fin(t,cAn+4.6,0.5),col:BW_W})});
    withA(ctx,fin(t,cAn+4.8,0.4),()=>{tick_(ctx,C.x+C.w+34,C.rowY(0),30,GOOD,1);T(ctx,"the course keeps its own row",1150,800,{w:700,size:20,color:rgba(GOOD,1)});});});
  vign(ctx,S);});

/* ---------- 4. Another way to write ---------- */
scene("docs",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const cDo=c("doc"),cTo=c("together"),cSh=c("shine"),cTr=c("trade"),many=fin(t,cTr+2.6,0.8);
  withA(ctx,fin(t,0.2,0.6),()=>tag(ctx,120,70,"another way to write",BW_W,{size:20}));
  withA(ctx,1-many*0.92,()=>{
    const dx=lerp(200,160,fin(t,cSh-0.2,0.8));
    bw_doc(ctx,dx,160,640,{a:fin(t,cDo+1.0,0.4),p:clamp((t-cDo-1.2)/1.0,0,1),hl:{claim:pulseAt(t,cDo+5.4,2.2),evidence:pulseAt(t,cDo+6.4,2.2)},sign:fin(t,cDo+7.8,0.5),check:fin(t,cTr+1.4,0.5),glow:fin(t,cTo,0.5)*(1-fin(t,cSh+1,0.6)),h:560});
    withA(ctx,fin(t,cDo+2.4,0.5)*(1-fin(t,cTo,0.4)),()=>tag(ctx,dx+660,230,"one write, the whole thing",BW_W,{size:20}));
    // written and signed together
    const tg=fin(t,cTo+0.1,0.5);if(tg>0)withA(ctx,tg*(1-fin(t,cSh+0.6,0.6)),()=>{ctx.save();ctx.strokeStyle=rgba(TRUST,0.9);ctx.lineWidth=3;ctx.shadowColor=rgba(TRUST,0.8);ctx.shadowBlur=14;
      ctx.beginPath();ctx.moveTo(dx+668,172);ctx.lineTo(dx+690,172);ctx.lineTo(dx+690,708);ctx.lineTo(dx+668,708);ctx.stroke();ctx.restore();tag(ctx,dx+712,440,"written together, signed together",TRUST,{size:22});});
    // a document database: whole documents in, whole documents out
    const st=fin(t,cSh+0.2,0.6);bw_store(ctx,1250,250,460,380,BW_W,st,t);
    withA(ctx,fin(t,cSh+0.4,0.5),()=>tag(ctx,1480,190,"document databases",BW_W,{align:"center",size:24}));
    const wIn=clamp((t-cSh-1.6)/1.0,0,1),rOut=clamp((t-cSh-3.4)/1.0,0,1);
    if(wIn>0&&wIn<1){const e=ease(wIn);bw_miniDoc(ctx,lerp(dx+560,1380,e),lerp(300,380,e)-Math.sin(e*Math.PI)*80,60,80,BW_W,1);}
    if(rOut>0&&rOut<1){const e=ease(rOut);bw_miniDoc(ctx,lerp(1520,dx+560,e),lerp(380,560,e)+Math.sin(e*Math.PI)*80,60,80,BW_R,1);}
    withA(ctx,fin(t,cSh+1.8,0.4),()=>{arrowTo(ctx,dx+700,330,1236,330,BW_W,0.8,{bend:-0.08,head:12});T(ctx,"written whole",1020,300,{w:700,size:19,align:"center",color:rgba(BW_W,1)});});
    withA(ctx,fin(t,cSh+3.6,0.4),()=>{arrowTo(ctx,1236,560,dx+700,560,BW_R,0.8,{bend:-0.08,head:12});T(ctx,"read whole",1020,612,{w:700,size:19,align:"center",color:rgba(BW_R,1)});});
    withA(ctx,fin(t,cTr+1.0,0.4),()=>tag(ctx,dx+320,760,"easy to write, easy to check",GOOD,{align:"center",size:20}));});
  // a million of them, and a count that has to open each one
  if(many>0)withA(ctx,many,()=>{const cols=48,rows=20,x0=150,y0=190,cw=33,ch=29,s0=cTr+3.0,scan=Math.max(0,(t-s0)/(sc.dur-cTr-3.0+14)),sx=x0+scan*cols*cw;
    T(ctx,"1,000,000 credentials, one document each",960,140,{w:800,size:28,align:"center",color:rgba(BW_W,1)});
    for(let r=0;r<rows;r++)for(let k=0;k<cols;k++){const x=x0+k*cw,y=y0+r*ch,done=x<sx;bw_miniDoc(ctx,x,y,22,24,done?BW_AMB:BW_W,done?0.7:0.35+0.15*hash(r*cols+k,5));}
    ctx.fillStyle=rgba(BW_AMB,0.9);ctx.fillRect(sx-2,y0-12,3,rows*ch+16);glow(ctx,sx,y0+rows*ch/2,160,BW_AMB,0.25);
    tag(ctx,960,800,"counting: open every one · "+fmtNum(scan*cols*rows/(cols*rows)*1000000/48*1.0)+" so far",BW_AMB,{align:"center",size:22});});
  vign(ctx,S);});

/* ---------- 5. Built to read ---------- */
const BW_SX=1040,BW_SY=500,BW_SP={learner:[-340,-230],kind:[340,-230],faculty:[-340,240],date:[340,240]};
scene("read",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),B=c("breath");setScreen(ctx,S);bg2(ctx);
  const cQ=c("q"),cG=c("grain"),cF=c("facts"),cD=c("dims"),cW=c("words"),cS=c("star");
  withA(ctx,fin(t,0.2,0.6),()=>tag(ctx,120,70,"Planning day · built to read",BW_R,{size:20}));
  person(ctx,"ana",190,884,0.52,{t,pose:t>cQ&&t<cG?"explain":"stand",expr:t>cS?"relieved":"calm"});
  const wA=fin(t,cW+3.4,0.5),fA=fin(t,cW+1.8,0.5);
  bw_qBubble(ctx,54,370,470,BW_QW,{a:fin(t,cQ+0.3,0.5),size:26,hi:i=>i===2?fA:(i===4||i===7)?wA:(i===3||i===6)?wA*0.6:0,hiCol:i=>i===2?GOOD:TRUST});
  // the star: the grain first, the facts in the middle, the dimensions around them
  const fa=fin(t,cG+0.2,0.6),dimA={learner:fin(t,cD+3.0,0.5),kind:fin(t,cD+3.8,0.5),faculty:fin(t,cD+4.6,0.5),date:fin(t,cD+5.3,0.5)};
  const sj=fin(t,cS+1.2,0.5),jn={faculty:sj,date:sj};
  const dimHi={faculty:Math.max(wA,sj),date:Math.max(wA,sj)};
  if(sj>0)Object.keys(dimA).forEach(k=>{if(!jn[k])dimA[k]*=1-0.5*sj;});
  const starP=pulseAt(t,cS+0.2,1.4);
  if(starP>0.01)withA(ctx,starP,()=>{Object.values(BW_SP).forEach(([dx,dy])=>{ctx.save();ctx.strokeStyle=rgba(BW_R,0.6);ctx.lineWidth=10;ctx.shadowColor=rgba(BW_R,1);ctx.shadowBlur=30;ctx.beginPath();ctx.moveTo(BW_SX,BW_SY);ctx.lineTo(BW_SX+dx,BW_SY+dy);ctx.stroke();ctx.restore();});});
  bw_star(ctx,BW_SX,BW_SY,1,{P:BW_SP,dimA,join:jn,dimHi,fact:{a:fa,g:fin(t,cG+1.8,0.5),gHi:pulseAt(t,cG+2.0,2.0),m:clamp((t-cF-1.8)/1.6,0,1),k:fin(t,cD+2.6,0.5),hi:fin(t,cF+1.6,0.5)*(1-fin(t,cD+2.2,0.6))+pulseAt(t,cS+0.2,1.4)}});
  // one row per credential awarded
  const rw=fin(t,cG+2.2,0.5)*(1-fin(t,cD+2.2,0.6));if(rw>0)withA(ctx,rw,()=>{for(let i=0;i<4;i++){const x=BW_SX-210+i*108,y=660;bw_awardTile(ctx,x,y,96,52,fin(t,cG+2.2+i*0.2,0.3),pulseAt(t,cG+2.2+i*0.2,0.6));}
    T(ctx,"each credential awarded = one row",BW_SX,748,{w:700,size:20,align:"center",color:rgba(TRUST,1)});});
  // labels
  withA(ctx,fin(t,cF+1.8,0.5)*(1-fin(t,cS,0.5)),()=>tag(ctx,BW_SX,334,"facts · the numbers you add up",BW_R,{align:"center",size:20}));
  withA(ctx,fin(t,cD+2.0,0.5)*(1-fin(t,cS,0.5)),()=>tag(ctx,BW_SX,160,"dimensions · what you filter or group by",BW_R,{align:"center",size:20}));
  withA(ctx,fin(t,cS+0.3,0.5),()=>tag(ctx,BW_SX,334,"a star",BW_R,{align:"center",size:24}));
  withA(ctx,wA,()=>{tag(ctx,BW_SX+BW_SP.faculty[0],BW_SY+BW_SP.faculty[1]+64,"by faculty",TRUST,{align:"center",size:18});tag(ctx,BW_SX+BW_SP.date[0],BW_SY+BW_SP.date[1]+64,"by year",TRUST,{align:"center",size:18});});
  if(sj>0)withA(ctx,sj,()=>{[["faculty","1"],["date","2"]].forEach(([k,n])=>{const x=BW_SX+BW_SP[k][0]*0.5,y=BW_SY+BW_SP[k][1]*0.5;ctx.fillStyle="rgba(7,14,18,0.95)";ctx.beginPath();ctx.arc(x,y,20,0,TAU);ctx.fill();ring(ctx,x,y,20,BW_R,1,2.4);T(ctx,n,x,y+8,{w:800,size:22,align:"center",color:rgba(BW_R,1)});});
    tag(ctx,BW_SX,160,"two joins, not seven",BW_R,{align:"center",size:22});});
  // the test: facts are what you add up; dimensions are the words after "by"
  const tc=fin(t,cW+0.3,0.5);if(tc>0)withA(ctx,tc,()=>{const x=1540,y=150,w=340;glass(ctx,x,y,w,236,18,BW_R,{glow:14,ea:0.8,fill:"rgba(7,14,18,0.94)"});T(ctx,"a simple test",x+22,y+38,{w:800,size:20,color:rgba(BW_R,1)});
    withA(ctx,0.4+0.6*fA,()=>{T(ctx,"facts",x+22,y+90,{w:800,size:22,color:rgba(GOOD,1)});T(ctx,"what you add up",x+22,y+120,{w:600,size:19});});
    withA(ctx,0.4+0.6*wA,()=>{T(ctx,"dimensions",x+22,y+166,{w:800,size:22,color:rgba(TRUST,1)});T(ctx,"the words after “by”",x+22,y+196,{w:600,size:19});});});
  // the answer, read in two steps
  bw_chart(ctx,1540,420,340,330,clamp((t-B-0.1)/1.6,0,1),fin(t,B-0.2,0.6));
  vign(ctx,S);});

/* ---------- 6. Keeping history for reading ---------- */
const BW_TX0=240,BW_TX1=1680,BW_TY=270;
const bw_dayX=d=>lerp(BW_TX0,BW_TX1,d/365);
const BW_DIM={name:"learner dimension",cols:[["learner_key","pk"],["learner_id",""],["name",""],["faculty",""],["valid_from",""],["valid_to",""]],rows:[["1","L-204","Aisha Salem","Science","2024-02-01","2026-06-30"],["2","L-204","Aisha Salem","Engineering","2026-07-01","—"]]};
scene("history",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const cM=c("moved"),cB=c("both"),cR=c("revoked"),cC=c("choice"),cS=c("scd");
  withA(ctx,fin(t,0.2,0.6),()=>tag(ctx,120,70,"history, for reading",BW_R,{size:20}));
  const aA=1-fin(t,cR-0.4,0.7),aB=fin(t,cR-0.1,0.6)*(1-fin(t,cC-0.4,0.7)),aC=fin(t,cC-0.1,0.6);
  // a year, and a move in the middle of it
  if(aA>0.01)withA(ctx,aA,()=>{const ta=fin(t,cM+0.3,0.6);withA(ctx,ta,()=>{ctx.strokeStyle=rgba(SOFT,0.6);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(BW_TX0,BW_TY);ctx.lineTo(BW_TX1,BW_TY);ctx.stroke();
      "JFMAMJJASOND".split("").forEach((m,i)=>{const x=bw_dayX(i*30.4+15);T(ctx,m,x,BW_TY+34,{f:"mono",w:500,size:16,align:"center",color:rgba(SOFT,0.9)});ctx.fillStyle=rgba(SOFT,0.5);ctx.fillRect(bw_dayX(i*30.4)-1,BW_TY-6,2,12);});
      T(ctx,"2026",BW_TX0-20,BW_TY+6,{f:"mono",w:500,size:18,align:"right",color:rgba(SOFT,1)});});
    const sciP=clamp((t-cM-1.0)/1.2,0,1),engP=clamp((t-cM-2.6)/1.4,0,1),mv=bw_dayX(181);
    const band=(x0,x1,col,name)=>{if(x1<=x0+2)return;ctx.fillStyle=rgba(col,0.22);rr(ctx,x0,BW_TY-70,x1-x0,40,10);ctx.fill();ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2;rr(ctx,x0,BW_TY-70,x1-x0,40,10);ctx.stroke();
      if(x1-x0>160)T(ctx,name,x0+18,BW_TY-43,{w:800,size:20,color:rgba(col,1)});};
    band(BW_TX0,lerp(BW_TX0,mv,sciP),BW_FAC.sci.c,"Science");band(mv+4,lerp(mv+4,BW_TX1,engP),BW_FAC.eng.c,"Engineering");
    withA(ctx,fin(t,cM+2.4,0.4),()=>{ctx.strokeStyle=rgba(INK,0.8);ctx.setLineDash([6,6]);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(mv,BW_TY-96);ctx.lineTo(mv,BW_TY+8);ctx.stroke();ctx.setLineDash([]);tag(ctx,mv,BW_TY-116,"Aisha moves faculty · 1 July",INK,{align:"center",size:18});});
    // two awards, one on each side of the move
    const AW=[[122,"Machine learning basics","2 May",BW_FAC.sci],[270,"Data visualisation","28 Sep",BW_FAC.eng]];
    AW.forEach(([d,n,ds,F],i)=>{const x=bw_dayX(d),a=fin(t,cM+4.0+i*0.3,0.4);if(a<=0)return;withA(ctx,a,()=>{glow(ctx,x,BW_TY,40,TRUST,0.5);ctx.fillStyle=rgba(TRUST,1);ctx.beginPath();ctx.arc(x,BW_TY,9,0,TAU);ctx.fill();
      T(ctx,n,x,BW_TY+66,{w:700,size:18,align:"center",color:rgba(TRUST,1)});T(ctx,"award · "+ds,x,BW_TY+90,{f:"mono",w:500,size:15,align:"center",color:rgba(SOFT,1)});
      const ans=fin(t,cB+3.6+i*2.0,0.5);withA(ctx,1-ans,()=>T(ctx,"?",x,BW_TY+128,{w:800,size:30,align:"center",color:rgba(BW_AMB,1)}));
      withA(ctx,ans,()=>tag(ctx,x,BW_TY+128,"counts for "+F.n,F.c,{align:"center",size:18}));});});
    // the learner dimension: a row for each faculty, with the dates each was true
    const D=bw_tbl(ctx,480,470,Object.assign({a:fin(t,cB+0.4,0.6),col:BW_R,rowA:j=>fin(t,cB+0.8+j*0.8,0.4),
      cell:(j,i)=>i===3?{col:j?BW_FAC.eng.c:BW_FAC.sci.c,hi:pulseAt(t,cB+3.6+j*2.0,1.6)}:(i>=4?{hi:fin(t,cB+2.0,0.5)*(1-fin(t,cB+3.4,0.5)),col:BW_R}:null)},BW_DIM));
    withA(ctx,fin(t,cB+2.0,0.5),()=>tag(ctx,D.cx[4]+D.cw[4],D.y+D.h+36,"each row: the dates it was true",BW_R,{align:"center",size:20}));
    AW.forEach(([d],i)=>{const p=clamp((t-cB-3.6-i*2.0)/0.8,0,1);if(p>0)arrowTo(ctx,bw_dayX(d),BW_TY+146,D.colX(3),D.rowY(i)-12,TRUST,0.85,{p,bend:i?0.12:-0.12,head:12,lw:2.2});});});
  // an award revoked and reissued: every status kept, each with its date
  if(aB>0.01)withA(ctx,aB,()=>{const fr=[{s:"issued",d:"2 May 2026",col:BW_R},{s:"revoked",d:"9 May 2026",col:BAD},{s:"reissued",d:"12 May 2026",col:BW_R}].map((f,i)=>Object.assign(f,{a:fin(t,cR+0.6+i*0.9,0.4),hi:pulseAt(t,cR+0.6+i*0.9,1.2)}));
    T(ctx,"award A-9002 · Machine learning basics",960,190,{w:800,size:26,align:"center",color:rgba(TRUST,1)});
    filmStrip(ctx,684,230,fr,1,0,t);
    const H=bw_tbl(ctx,560,430,{name:"award status history",col:BW_R,cols:[["award_id",""],["status",""],["from",""],["to",""]],rows:[["A-9002","issued","2026-05-02","2026-05-08"],["A-9002","revoked","2026-05-09","2026-05-11"],["A-9002","reissued","2026-05-12","—"]],
      rowA:j=>fin(t,cR+0.8+j*0.9,0.4),cell:(j,i)=>i===1?{col:j===1?BAD:BW_R}:(i>=2?{hi:fin(t,cR+4.6,0.5),col:BW_R}:null)});
    withA(ctx,fin(t,cR+3.0,0.5),()=>tag(ctx,H.x+H.w+30,H.rowY(0),"nothing overwritten",BW_R,{size:20}));
    withA(ctx,fin(t,cR+4.6,0.5),()=>tag(ctx,H.x+H.w+30,H.rowY(2),"each change has a date",BW_R,{size:20}));});
  // overwrite, or keep history: decided for each attribute
  if(aC>0.01)withA(ctx,aC,()=>{const t1=fin(t,cC+2.4,0.6),t2=fin(t,cC+4.6,0.6),ty=fin(t,cS+0.3,0.5);
    glass(ctx,160,160,760,360,22,BW_W,{glow:14,ea:0.75,fill:"rgba(7,12,24,0.94)"});T(ctx,"overwrite",190,210,{w:800,size:28,color:rgba(BW_W,1)});T(ctx,"a typo",190,244,{w:600,size:20,color:rgba(SOFT,1)});
    bw_tbl(ctx,190,280,{cols:[["learner_id",""],["name",""]],rows:[["L-204",t1>0.5?"Aisha Salem":"Aisha Slaem"]],size:18,cell:(j,i)=>i===1?{hi:pulseAt(t,cC+2.6,1.2)+(t1<0.5?0.6:0),hiCol:t1<0.5?BAD:BW_W,col:t1<0.5?BAD:BW_W}:null});
    withA(ctx,t1,()=>T(ctx,"one row, fixed in place",190,440,{w:700,size:20,color:rgba(GOOD,1)}));
    withA(ctx,ty,()=>tag(ctx,890,210,"type 1",BW_W,{size:18,align:"center"}));
    glass(ctx,1000,160,760,360,22,BW_R,{glow:14,ea:0.75,fill:"rgba(7,14,18,0.94)"});T(ctx,"keep history",1030,210,{w:800,size:28,color:rgba(BW_R,1)});T(ctx,"a move",1030,244,{w:600,size:20,color:rgba(SOFT,1)});
    bw_tbl(ctx,1030,280,{col:BW_R,cols:[["faculty",""],["valid_from",""],["valid_to",""]],rows:[["Science","2024-02-01",t2>0.5?"2026-06-30":"—"],["Engineering","2026-07-01","—"]],size:18,rowA:j=>j?t2:1,cell:(j,i)=>i===0?{col:j?BW_FAC.eng.c:BW_FAC.sci.c}:(j===0&&i===2?{hi:pulseAt(t,cC+4.8,1.2),col:BW_R}:null)});
    withA(ctx,t2,()=>T(ctx,"a new row, and the old one closed",1030,470,{w:700,size:20,color:rgba(GOOD,1)}));
    withA(ctx,ty,()=>tag(ctx,1730,210,"type 2",BW_R,{size:18,align:"center"}));
    const sp=fin(t,cC+6.4,0.6);if(sp>0){sheet(ctx,620,560,680,260,{a:sp,rot:-0.01});pencilText(ctx,"decided, and written down:",660,612,{size:22,p:clamp((t-cC-6.6)/0.6,0,1)});
      [["name","overwrite"],["email","overwrite"],["faculty","keep history"],["award status","keep history"]].forEach(([a,b],i)=>{const p=clamp((t-cC-7.0-i*0.45)/0.5,0,1);pencilText(ctx,a,680,660+i*38,{size:22,p});pencilText(ctx,b,1000,660+i*38,{size:22,p,color:b==="overwrite"?"rgba(40,90,170,0.95)":"rgba(30,120,80,0.95)"});});}});
  withA(ctx,fin(t,cS+0.2,0.5),()=>tag(ctx,960,110,"slowly changing dimension",BW_R,{align:"center",size:30}));
  vign(ctx,S);});

/* ---------- 7. Side by side ---------- */
// the shape built to write: eight tables, seven joins, and a history table to puzzle over
const BW_NE={award:[480,500,"award"],status:[480,330,"award_status"],learner:[230,400,"learner"],lf:[230,570,"learner_faculty"],faculty:[230,735,"faculty"],course:[730,400,"course"],kind:[730,570,"credential_kind"],cal:[480,690,"calendar"]};
const BW_NJ=[["award","status"],["award","learner"],["learner","lf"],["lf","faculty"],["award","course"],["course","kind"],["award","cal"]];
scene("side",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const cQ=c("q"),cW=c("write"),cR=c("read"),cN=c("name"),cJ=c("job");
  const nm=fin(t,cN+0.2,0.6)*(1-fin(t,cJ-0.2,0.6)),dg=1-0.85*nm;
  withA(ctx,fin(t,0.1,0.5),()=>{glass(ctx,40,150,900,690,24,BW_W,{glow:14,ea:0.45,fill:"rgba(10,18,36,0.5)"});glass(ctx,980,150,900,690,24,BW_R,{glow:14,ea:0.45,fill:"rgba(8,20,22,0.5)"});
    T(ctx,"built to write",490,206,{w:800,size:30,align:"center",color:rgba(BW_W,1)});T(ctx,"built to read",1430,206,{w:800,size:30,align:"center",color:rgba(BW_R,1)});});
  const q=fin(t,cQ+0.2,0.5);withA(ctx,q*(1-nm),()=>tag(ctx,960,96,"awards by faculty and by year, for ten years",TRUST,{align:"center",size:24}));
  withA(ctx,nm,()=>tag(ctx,960,96,"correct a name:  “Enginering” → “Engineering”",TRUST,{align:"center",size:24}));
  // left: seven joins, drawn one by one
  const la=lerp(0.4,1,fin(t,cW-0.2,0.5))*fin(t,cQ+0.4,0.6)*dg,s=0.62;
  withA(ctx,la,()=>{const Bx={};Object.keys(BW_NE).forEach(k=>{Bx[k]=entBox(ctx,{x:BW_NE[k][0],y:BW_NE[k][1],name:BW_NE[k][2],s});});
    BW_NJ.forEach(([a,b],i)=>{const p=clamp((t-cW-0.2-i*0.26)/0.26,0,1);if(p<=0)return;relLine(ctx,Bx[a],Bx[b],a==="award"||a==="course"?"*":"*","1",{col:BW_W,s,f:p});
      if(p>=1){const x=(Bx[a].x+Bx[b].x)/2,y=(Bx[a].y+Bx[b].y)/2;ctx.fillStyle="rgba(7,12,24,0.95)";ctx.beginPath();ctx.arc(x,y,14,0,TAU);ctx.fill();ring(ctx,x,y,14,BW_W,1,2);T(ctx,String(i+1),x,y+6,{w:800,size:16,align:"center",color:rgba(BW_W,1)});}});
    const pz=fin(t,cW+2.4,0.5);
    Object.keys(BW_NE).forEach(k=>ent(ctx,{x:BW_NE[k][0],y:BW_NE[k][1],name:BW_NE[k][2],s,col:k==="lf"&&pz>0?mix(BW_W,BW_AMB,pz):BW_W,hi:k==="lf"?pz*(0.6+0.4*Math.sin(t*3)):0,dash:k==="lf"&&pz>0}));
    withA(ctx,pz,()=>{tag(ctx,630,790,"a puzzle: which faculty, on the award date?",BW_AMB,{align:"center",size:18});ctx.strokeStyle=rgba(BW_AMB,0.7);ctx.setLineDash([5,6]);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(Bx.lf.x+Bx.lf.w/2,Bx.lf.y+8);ctx.quadraticCurveTo(400,700,470,774);ctx.stroke();ctx.setLineDash([]);});
    withA(ctx,fin(t,cW+1.8,0.4),()=>tag(ctx,730,270,"7 joins",BW_W,{align:"center",size:22}));});
  // right: two joins
  const ra=lerp(0.4,1,fin(t,cR-0.3,0.5))*fin(t,cQ+0.4,0.6)*dg,rj=fin(t,cR+0.5,0.5);
  withA(ctx,ra,()=>{bw_star(ctx,1430,510,0.62,{nosub:true,small:true,fw:360,fh:190,join:{faculty:rj,date:rj},dimA:{learner:1-0.55*rj,kind:1-0.55*rj,faculty:1,date:1},dimHi:{faculty:rj,date:rj}});
    if(rj>0)withA(ctx,rj,()=>{[["faculty","1",-340,240],["date","2",340,240]].forEach(([k,n,dx,dy])=>{const x=1430+dx*0.62*0.5,y=510+dy*0.62*0.5;ctx.fillStyle="rgba(7,14,18,0.95)";ctx.beginPath();ctx.arc(x,y,16,0,TAU);ctx.fill();ring(ctx,x,y,16,BW_R,1,2);T(ctx,n,x,y+6,{w:800,size:17,align:"center",color:rgba(BW_R,1)});});
      tag(ctx,1430,790,"2 joins",BW_R,{align:"center",size:22});});});
  // a name correction: one cell on the left, many rows on the right
  if(nm>0.01)withA(ctx,nm,()=>{const fx=fin(t,cN+1.4,0.4);
    const F=bw_tbl(ctx,200,300,{name:"faculty",cols:[["faculty_id","pk"],["name",""]],rows:[["F-SCI","Science"],["F-ENG",fx>0.5?"Engineering":"Enginering"],["F-ART","Arts"]],size:19,rh:44,
      cell:(j,i)=>j===1&&i===1?{hi:0.4+0.6*pulseAt(t,cN+1.4,1.2),col:fx>0.5?BW_W:BW_AMB,hiCol:fx>0.5?BW_W:BW_AMB}:null});
    withA(ctx,fin(t,cN+1.8,0.4),()=>{tick_(ctx,F.x+F.w+34,F.rowY(1),30,GOOD,1);tag(ctx,F.x+F.w/2,F.y+F.h+50,"stored once: 1 edit",GOOD,{align:"center",size:22});});
    const names=["Aisha Salem","Ben Okafor","Chen Wei","Dara Singh","Eli Moreau","Farah Aziz","Gus Lindqvist","Hana Sato"],u0=cN+2.8;
    const R=bw_tbl(ctx,1080,256,{name:"learner dimension",col:BW_R,cols:[["learner",""],["faculty",""]],rows:names.map(n=>[n,"Enginering"]),size:17,rh:38,
      cell:(j,i)=>i===1?(t>u0+j*0.3?{text:"Engineering",col:BW_AMB,hi:pulseAt(t,u0+j*0.3,0.6),hiCol:BW_AMB}:{col:mix(INK,BW_AMB,0.5)}):null});
    const done=Math.min(4812,Math.floor(clamp((t-u0)/2.6,0,1)*4812));
    withA(ctx,fin(t,u0,0.4),()=>{T(ctx,"… and every other Engineering learner",R.x+R.w+30,R.y+R.h-20,{w:600,size:18,color:rgba(SOFT,1)});tag(ctx,1430,790,"repeated on purpose: "+fmtNum(done)+" of 4,812 rows",BW_AMB,{align:"center",size:20});});});
  // each shape, fast at its own job
  withA(ctx,fin(t,cJ+0.2,0.5),()=>{tag(ctx,490,256,"fast to write: issue, correct",BW_W,{align:"center",size:22});tag(ctx,1430,256,"fast to read: add up, compare",BW_R,{align:"center",size:22});});
  vign(ctx,S);});

/* ---------- 8. Pull back ---------- */
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),B=c("breath");setScreen(ctx,S);bg2(ctx);
  const cO=c("one"),cM=c("medal"),cF=c("often"),cX=c("next");
  const top=1-fin(t,cM-0.2,0.8);
  // one sketch, two shapes from the same logical model
  if(top>0.01)withA(ctx,top,()=>{sheet(ctx,640,70,640,230,{a:fin(t,cO+0.1,0.5),rot:-0.008});
    const bx=[[690,"Learner"],[880,"Credential"],[1080,"Course"]];bx.forEach(([x,n],i)=>pencilBox(ctx,x,140,160,60,n,clamp((t-cO-0.3-i*0.3)/0.6,0,1),{size:22}));
    [[850,880],[1040,1080]].forEach(([a,b],i)=>{const p=clamp((t-cO-1.0-i*0.2)/0.4,0,1);if(p>0){ctx.strokeStyle="rgba(58,54,52,0.85)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(a,170);ctx.lineTo(lerp(a,b,p),170);ctx.stroke();}});
    withA(ctx,fin(t,cO+0.8,0.4),()=>pencilText(ctx,"one sketch · one logical model",960,262,{size:22,align:"center"}));
    const sp=fin(t,cO+1.4,0.6);
    arrowTo(ctx,860,310,600,420,BW_W,sp,{bend:0.1,head:14});arrowTo(ctx,1060,310,1320,420,BW_R,sp,{bend:-0.1,head:14});
    bw_normIcon(ctx,560,560,1.6,fin(t,cO+1.8,0.5),BW_W);bw_starIcon(ctx,1360,560,1.6,fin(t,cO+2.2,0.5),BW_R);
    withA(ctx,fin(t,cO+1.8,0.5),()=>tag(ctx,560,740,"built to write",BW_W,{align:"center",size:24}));withA(ctx,fin(t,cO+2.2,0.5),()=>tag(ctx,1360,740,"built to read",BW_R,{align:"center",size:24}));});
  // bronze, silver and gold: how refined, not what shape
  const V=[["bronze",170,"raw, as it arrived"],["silver",720,"cleaned, joined"],["gold",1270,"ready to use"]];
  const vy=250,vw=480,vh=470;
  V.forEach(([k,x,sub],i)=>{const a=fin(t,cM+2.2+i*0.45,0.6);if(a<=0.01)return;withA(ctx,a,()=>{const col=LAYER[k];
    vault(ctx,x,vy,vw,vh,col,(r,cc)=>{if(r>3)return null;if(k==="bronze")return hash(r*31+cc,4)>0.25?(hash(r*7+cc,9)>0.85?BAD:col):null;if(k==="silver")return col;return (cc+r)%2?col:null;},k[0].toUpperCase()+k.slice(1),sub);});});
  withA(ctx,fin(t,cM+3.6,0.5),()=>{const g=ctx.createLinearGradient(260,0,1660,0);g.addColorStop(0,rgba(LAYER.bronze,0.9));g.addColorStop(0.5,rgba(LAYER.silver,0.9));g.addColorStop(1,rgba(LAYER.gold,0.9));
    ctx.strokeStyle=g;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(260,770);ctx.lineTo(1650,770);ctx.stroke();ctx.fillStyle=rgba(LAYER.gold,0.9);ctx.beginPath();ctx.moveTo(1670,770);ctx.lineTo(1648,758);ctx.lineTo(1648,782);ctx.closePath();ctx.fill();
    T(ctx,"how refined the data is",960,810,{w:700,size:22,align:"center",color:rgba(INK,0.95)});});
  withA(ctx,fin(t,cM+5.0,0.5)*(1-fin(t,cF-0.2,0.5)),()=>tag(ctx,960,180,"not what shape it has",TRUST,{align:"center",size:26}));
  // a normalised shape in silver, stars in gold: one choice among several
  const iy=vy+340,sil=720+vw/2,gol=1270+vw/2,brz=170+vw/2;
  const nIn=fin(t,cF+2.0,0.8),sIn=fin(t,cF+4.0,0.8),any=fin(t,cX+0.4,0.6);
  if(nIn>0)bw_normIcon(ctx,lerp(560,sil,ease(nIn)),lerp(180,iy,ease(nIn)),1.1,nIn,BW_W);
  if(sIn>0)bw_starIcon(ctx,lerp(1360,gol,ease(sIn)),lerp(180,iy,ease(sIn)),1.1,sIn,BW_R);
  withA(ctx,fin(t,cF+5.6,0.5)*(1-fin(t,cX-0.2,0.5)),()=>tag(ctx,960,180,"a choice, not a rule",TRUST,{align:"center",size:26}));
  if(any>0){bw_normIcon(ctx,brz-90,iy,0.9,any*0.55,BW_W);bw_starIcon(ctx,brz+100,iy,0.9,any*0.55,BW_R);bw_starIcon(ctx,sil+130,iy,0.8,any*0.55,BW_R);bw_normIcon(ctx,gol-130,iy,0.8,any*0.55,BW_W);
    withA(ctx,any*(1-fin(t,cX+2.2,0.5)),()=>tag(ctx,960,180,"any layer can hold either shape",TRUST,{align:"center",size:26}));}
  // the next question: which shapes, for reading?
  const nx=fin(t,cX+2.6,0.6);if(nx>0)withA(ctx,nx,()=>{tag(ctx,960,120,"which shapes, for reading?",BW_R,{align:"center",size:26});
    [[700,"star"],[960,"one wide table"],[1220,"hubs and links"]].forEach(([x,n],i)=>{const a=fin(t,cX+3.2+i*0.4,0.5);withA(ctx,a,()=>{const y=192;glass(ctx,x-110,y-26,220,52,14,BW_R,{glow:10,ea:0.6,fill:"rgba(7,14,18,0.92)"});T(ctx,n,x,y+7,{w:700,size:19,align:"center",color:rgba(BW_R,1)});});});});
  endCard(ctx,S,t,B+0.3,"Built to write, built to read",BW_R,"One logical model, a shape for each job.");
  vign(ctx,S);});
