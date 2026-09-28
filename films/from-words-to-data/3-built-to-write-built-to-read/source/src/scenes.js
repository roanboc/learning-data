/* ===== Built to write, built to read: scenes =====
   Eight chapters, as in ../script.md. In Venice in 1494, merchants write each transaction into a journal, in time order, and post it
   to a ledger, by account, where it's read and balanced. Five centuries later, the university writes awards one by one and reads
   ten years of them at once: normalised tables and transactions for writing, a star for reading, each fast at its own job. */
const BW_QW=["How","many","awards,","by","faculty","and","by","year,","for","the","last","ten","years?"];
const bw_label=(ctx,t,s,col)=>withA(ctx,fin(t,0.2,0.6),()=>tag(ctx,110,66,s,col,{size:22}));

/* ---------- 1. Journal and ledger ---------- */
scene("ledger",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),B=c("breath");histBg(ctx,S,t);
  const tp=fin(t,c("today")-0.3,1.2),cJ=c("journal"),cP=c("post"),cT=c("two");
  const postT=q=>cP+0.7+q.i*1.1+q.side*0.18;
  if(tp<1)withA(ctx,1-tp,()=>{bw_venice(ctx,830,0.55,t);
    yearTag(ctx,110,96,"1494 · Venice",CLAY,fin(t,0.3,0.6));
    const pm=fin(t,cJ-0.6,1.2);bw_plate(ctx,lerp(960,1305,pm),lerp(470,96,pm),"Summa de arithmetica","Luca Pacioli · Venice, 1494",fin(t,c("venice")+0.3,0.8),lerp(1.3,0.78,pm),t);
    // the journal: every transaction, as it happened, one after another
    const jA=fin(t,cJ-0.4,0.8);bw_book(ctx,BW_JX,BW_JY,BW_JW,BW_JH,{a:jA,t,title:"Journal",top:100,lh:37,margin:84});
    let qx=null,qy=null;
    withA(ctx,jA,()=>BW_J.forEach((e,i)=>{const t0=cJ+0.4+i*1.0,p=clamp((t-t0)/0.8,0,1);if(p<=0)return;const y=bw_entryY(i),p1=clamp(p/0.62,0,1),p2=clamp((p-0.62)/0.2,0,1),p3=clamp((p-0.8)/0.2,0,1);
      const bl=bw_fresh(t,t0,0.8);
      bw_ink(ctx,e[0],BW_JX+12,y,{size:19,w:700,color:"rgba(120,50,30,0.9)",p:p1,bleed:bl});bw_ink(ctx,e[1],BW_JX+98,y,{size:26,p:p1,bleed:bl});
      bw_ink(ctx,e[2]+" ducats",BW_JX+BW_JW-22,y,{size:26,w:800,align:"right",p:p2,bleed:bl});bw_ink(ctx,"debit "+e[3]+" · credit "+e[4],BW_JX+98,y+38,{size:20,color:"rgba(90,60,36,0.85)",p:p3,bleed:bl});
      if(p<1){qx=p1<1?BW_JX+98+bw_inkW(ctx,typeOn(e[1],p1),26):BW_JX+BW_JW-40;qy=y;}
      const last=Math.max(...BW_POST.filter(q=>q.i===i).map(postT))+0.8;withA(ctx,fin(t,last,0.3),()=>T(ctx,"✓",BW_JX+BW_JW-18,y+38,{w:800,size:24,align:"right",color:"rgba(40,110,60,0.95)"}));}));
    if(qx!=null)bw_quill(ctx,qx+4,qy+4,0.85,jA,t);
    // the ledger: the same entries, grouped by account, with a debit side and a credit side
    const lA=fin(t,cP-0.5,0.8);bw_book(ctx,BW_LX,BW_LY,BW_LW,BW_LH,{a:lA,t,pages:2,title:"Ledger",top:100,lh:40,margin:26});
    const miss=fin(t,cT+4.4,0.3)*(1-fin(t,cT+7.3,0.5));
    withA(ctx,lA,()=>{Object.keys(BW_ACC).forEach((k,n)=>{const A=BW_ACC[k],ap=fin(t,cP-0.2+n*0.2,0.5);withA(ctx,ap,()=>{
        bw_ink(ctx,k,A.x,A.y,{size:30,w:800,color:"rgba(90,40,20,0.95)"});const hy=A.y+22;
        T(ctx,"debit",A.x+14,hy+30,{w:700,size:19,color:"rgba(110,80,50,0.95)"});T(ctx,"credit",A.x+248,hy+30,{w:700,size:19,color:"rgba(110,80,50,0.95)"});
        ctx.strokeStyle="rgba(110,70,40,0.45)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(A.x+232,hy+8);ctx.lineTo(A.x+232,hy+(k==="Cash"?138:98));ctx.moveTo(A.x,hy+44);ctx.lineTo(A.x+460,hy+44);ctx.stroke();});});
      // each entry posted twice: once to the account it debits, once to the account it credits
      BW_POST.forEach(q=>{const tf=postT(q),u=clamp((t-tf)/0.8,0,1);if(u<=0)return;const C=bw_cell(q.acc,q.side,q.k);
        if(u<1){const sx=BW_JX+BW_JW-70,sy=bw_entryY(q.i)-8,tx=C.r-40,ty=C.y-8,e=ease(u),mx=(sx+tx)/2,my=Math.min(sy,ty)-150,x=(1-e)*(1-e)*sx+2*(1-e)*e*mx+e*e*tx,y=(1-e)*(1-e)*sy+2*(1-e)*e*my+e*e*ty;
          glow(ctx,x,y,46,BW_INK,0.5);ctx.fillStyle="rgba(240,226,196,0.97)";rr(ctx,x-34,y-21,68,36,9);ctx.fill();bw_ink(ctx,String(q.amt),x,y+7,{size:22,w:800,align:"center"});return;}
        const wrong=q.acc==="Cash"&&q.side===0&&q.k===1&&miss>0.5;
        const bl=bw_fresh(t,tf+0.8,0);bw_ink(ctx,q.date,C.x,C.y,{size:19,color:"rgba(110,70,40,0.9)",bleed:bl});bw_ink(ctx,wrong?"50":String(q.amt),C.r,C.y,{size:26,w:800,align:"right",color:wrong?"rgba(190,40,30,0.95)":undefined,bleed:Math.max(bl,wrong?0:bw_fresh(t,cT+7.3,0.3))});
        if(wrong){ctx.strokeStyle="rgba(200,50,40,"+(0.85*miss)+")";ctx.lineWidth=2.6;ctx.beginPath();ctx.ellipse(C.r-16,C.y-9,36,22,0,0,TAU);ctx.stroke();}});
      // the balance: every debit has its credit, so the two sides must match
      const bA=fin(t,cT+0.2,0.6);if(bA>0)withA(ctx,bA,()=>{const x=BW_ACC.Cash.x,y=BW_LY+410,dS=150-(miss>0.5?5:0),ok=dS===150;
        ctx.strokeStyle="rgba(110,70,40,0.5)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x,y-44);ctx.lineTo(x+460,y-44);ctx.stroke();
        bw_ink(ctx,"all debits",x+10,y,{size:24});bw_ink(ctx,String(dS),x+250,y,{size:28,w:800,align:"right",color:ok?undefined:"rgba(190,40,30,0.95)"});
        bw_ink(ctx,"all credits",x+10,y+48,{size:24});bw_ink(ctx,"150",x+250,y+48,{size:28,w:800,align:"right"});
        const cx=x+370,cy=y+14,col=ok?[40,130,70]:[200,50,40];ctx.fillStyle="rgba(244,232,206,0.95)";ctx.beginPath();ctx.arc(cx,cy,34,0,TAU);ctx.fill();ring(ctx,cx,cy,34,col,1,3);
        if(ok)tick_(ctx,cx,cy+1,40,col,1);else cross_(ctx,cx,cy,38,col,1);T(ctx,ok?"balanced":"doesn't balance",cx,cy+68,{w:800,size:21,align:"center",color:rgba(col,1)});});});
    // the correction, with the quill
    const fx=fin(t,cT+6.6,0.4)*(1-fin(t,cT+7.8,0.5));if(fx>0){const C=bw_cell("Cash",0,1);bw_quill(ctx,C.r-8,C.y-4,0.85,fx,t);}
    // two shapes for one set of facts
    withA(ctx,fin(t,cT+2.0,0.5),()=>{tag(ctx,BW_JX+BW_JW/2,BW_JY+BW_JH+46,"one shape for writing",BW_W,{align:"center",size:26});T(ctx,"in time order, as it happens",BW_JX+BW_JW/2,BW_JY+BW_JH+96,{w:600,size:22,align:"center",color:rgba(PARCH,0.9)});});
    withA(ctx,fin(t,cT+3.2,0.5),()=>{tag(ctx,BW_LX+BW_LW/2,BW_JY+BW_JH+46,"one shape for reading",BW_R,{align:"center",size:26});T(ctx,"by account, where it's read and balanced",BW_LX+BW_LW/2,BW_JY+BW_JH+96,{w:600,size:22,align:"center",color:rgba(PARCH,0.9)});});});
  // five centuries later: graduation day, and planning day
  if(tp>0)withA(ctx,tp,()=>{bg2(ctx);const cy=c("today");
    const gA=fin(t,cy+0.6,0.6),pA=fin(t,cy+1.4,0.6);
    withA(ctx,gA,()=>{glass(ctx,100,150,820,650,22,BW_W,{glow:14,ea:0.45,fill:"rgba(10,18,36,0.5)"});tag(ctx,130,200,"Graduation day",BW_W,{size:26});T(ctx,"written one by one",890,210,{w:600,size:22,align:"right",color:rgba(SOFT,1)});});
    withA(ctx,pA,()=>{glass(ctx,1000,150,820,650,22,BW_R,{glow:14,ea:0.45,fill:"rgba(8,20,22,0.5)"});tag(ctx,1030,200,"Planning day",BW_R,{size:26});T(ctx,"read ten years at once",1790,210,{w:600,size:22,align:"right",color:rgba(SOFT,1)});});
    // awards issued, each complete: a fast stream of tiles
    const s0=cy+3.8;
    for(let i=0;i<42;i++){const tt=s0+i*0.075,u=clamp((t-tt)/0.3,0,1);if(u<=0)continue;const col_=i%7,row=Math.floor(i/7),tx=136+col_*110,ty=250+row*72,x=lerp(150,tx,ease(u)),y=lerp(740,ty,ease(u));
      bw_awardTile(ctx,x,y,98,60,u,pulseAt(t,tt+0.25,0.5));if(t>tt+0.5)withA(ctx,fin(t,tt+0.5,0.2),()=>tick_(ctx,x+84,y+15,16,GOOD,0.95));}
    withA(ctx,fin(t,s0,0.4),()=>{T(ctx,"awards issued today",136,712,{w:700,size:24,color:rgba(SOFT,1)});T(ctx,fmtNum(lerp(0,4380,clamp((t-s0)/4.6,0,1))+(t>s0+4.6?(t-s0-4.6)*38:0)),890,720,{w:800,size:46,align:"right",color:rgba(BW_W,1)});});
    withA(ctx,fin(t,cy+6.4,0.5),()=>tag(ctx,510,768,"each one complete and right",BW_W,{align:"center",size:22}));
    // ten years, read at once
    const lit=fin(t,cy+9.6,0.5);
    for(let i=0;i<10;i++){const a=fin(t,cy+8.2+i*0.06,0.4);bw_slab(ctx,1060,700-i*46,480,36,BW_R,a,String(2017+i),lit*(0.75+0.25*Math.sin(t*2+i)));}
    if(lit>0){withA(ctx,lit*(1-fin(t,cy+11.4,1.2))*0.7,()=>{const g=ctx.createLinearGradient(0,240,0,730);g.addColorStop(0,rgba(BW_R,0));g.addColorStop(0.5,rgba(BW_R,0.35));g.addColorStop(1,rgba(BW_R,0));ctx.fillStyle=g;ctx.fillRect(1050,240,570,490);});}
    withA(ctx,fin(t,cy+10.2,0.5),()=>tag(ctx,1410,768,"ten years, read at once",BW_R,{align:"center",size:22}));});
  seriesTitle(ctx,S,t,B,"Built to write, built to read","why the same award is stored twice",BW_W);
  fadeIn(ctx,S,t);vign(ctx,S);});

/* ---------- 2. Built to write ---------- */
const BW_LEARN={name:"learner",cols:[["learner_id","pk"],["name",""],["email",""]],rows:[["L-204","Aisha Karim","aisha.k@uni.edu"],["L-311","Ben Okafor","ben.o@uni.edu"]]};
const BW_COURSE={name:"course",cols:[["course_id","pk"],["title",""]],rows:[["BSC-DS","BSc Data Science"],["MC-ML","Machine learning basics"],["MC-VIS","Data visualisation"],["MC-ETH","Data ethics"]]};
const BW_AWARD={name:"award",cols:[["award_id","pk"],["learner_id","fk"],["course_id","fk"],["awarded_on",""]],rows:[["A-9001","L-204","BSC-DS","2025-12-10"],["A-9002","L-204","MC-ML","2026-05-02"],["A-9003","L-311","MC-ETH","2026-06-20"]]};
scene("write",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const cO=c("once"),cK=c("keys"),cA=c("all"),cN=c("name");
  bw_label(ctx,t,"built to write",BW_W);
  // the tables, which move up to make room for the transaction
  const g=fin(t,cA-0.2,1.2),k=lerp(1,0.55,g);ctx.save();ctx.translate(960,lerp(150,96,g));ctx.scale(k,k);ctx.translate(-960,-150);
  const nameHi=fin(t,cO+3.4,0.5)*(1-fin(t,cK-0.4,0.8)),keyP=pulseAt(t,cK+0.4,1.6),fkA=fin(t,cK+2.4,0.5),relP=clamp((t-cK-2.5)/1.0,0,1);
  const kA=0.55+0.45*fin(t,cK,0.4);
  const Lg=bw_tbl(ctx,110,150,Object.assign({a:fin(t,cO+0.2,0.6),keyA:kA,hi:keyP*0.5,cell:(j,i)=>j===0&&i===1&&nameHi>0.01?{hi:nameHi,col:mix(INK,BW_W,nameHi)}:null},BW_LEARN));
  const Cg=bw_tbl(ctx,1300,150,Object.assign({a:fin(t,cO+0.6,0.6),keyA:kA,hi:keyP*0.5},BW_COURSE));
  const rej=fin(t,cK+4.6,0.4)*(1-fin(t,cK+6.8,0.6)),bad=fin(t,cK+5.6,0.3);
  const Ag=bw_tbl(ctx,620,500,Object.assign({a:fin(t,cO+1.0,0.6),keyA:kA,fkA:0.3+0.7*fkA,hi:keyP*0.5,rowA:j=>fin(t,cO+1.2+j*0.25,0.4),
    cell:(j,i)=>i===1&&j<2&&nameHi>0.01?{hi:nameHi,col:mix(INK,BW_W,nameHi)}:null},BW_AWARD));
  // each award points to one learner, and to one course
  bw_rel(ctx,Lg.colX(0),Lg.y+Lg.h,Ag.colX(1),Ag.y,BW_W,fkA,{p:relP,ym:440});
  bw_rel(ctx,Cg.colX(0),Cg.y+Cg.h,Ag.colX(2),Ag.y,BW_W,fkA,{p:relP,ym:470});
  // the name, stored once: the awards point to it
  if(nameHi>0.01){withA(ctx,nameHi,()=>{[0,1].forEach(j=>arrowTo(ctx,Ag.cx[1]+20,Ag.rowY(j)-6,Lg.colX(1)+10,Lg.rowY(0)+20,BW_W,0.85,{bend:-0.16,head:14,lw:2.4,p:clamp((t-cO-3.6-j*0.2)/0.8,0,1)}));
    tag(ctx,Lg.colX(1),112,"stored once",BW_W,{align:"center",size:24});});
    withA(ctx,nameHi*fin(t,cO+5.0,0.5),()=>tag(ctx,Ag.x+Ag.w+24,Ag.rowY(1),"not on every award",BW_W,{size:24}));}
  // keys and a rule the data must meet
  withA(ctx,fin(t,cK+0.4,0.5)*(1-fin(t,cA-0.4,0.6)),()=>tag(ctx,1000,240,"a key identifies each row",REF,{align:"center",size:24}));
  withA(ctx,fin(t,cK+2.4,0.5)*(1-fin(t,cA-0.4,0.6)),()=>tag(ctx,1000,300,"rules the data must meet",BW_W,{align:"center",size:24}));
  if(rej>0.01){const y=Ag.y+Ag.h+14+(1-ease(fin(t,cK+4.6,0.5)))*30+ease(fin(t,cK+6.8,0.6))*40;withA(ctx,rej,()=>{const bc=bad>0.5?BAD:BW_W;
    glass(ctx,Ag.x,y,Ag.w,52,10,bc,{glow:10,ea:0.01,fill:"rgba(7,12,24,0.95)"});ctx.save();ctx.setLineDash([8,6]);ctx.strokeStyle=rgba(bc,0.9);ctx.lineWidth=2;rr(ctx,Ag.x,y,Ag.w,52,10);ctx.stroke();ctx.restore();
    ["A-9009","L-999","MC-ML","2026-09-28"].forEach((v,i)=>T(ctx,v,Ag.cx[i]+14,y+34,{f:"mono",w:500,size:22,color:i===1&&bad>0.5?rgba(BAD,1):rgba(INK,0.8)}));
    if(bad>0.01)withA(ctx,bad,()=>{cross_(ctx,Ag.x+Ag.w+34,y+26,38,BAD,1);tag(ctx,Ag.x+Ag.w+66,y+26,"no learner L-999: rejected",BAD,{size:24});});});}
  ctx.restore();
  // a transaction: three writes that all happen, or none do
  const bx=230,bw=1460,wA=fin(t,cA+0.3,0.6)*(1-0.86*fin(t,cN+0.1,0.6));
  const W3=[["1 · award","+ row A-9004"],["2 · learner record","credit points 312 → 324"],["3 · transcript","+ Data visualisation"]];
  const box=(y,label,st,res,resCol,a)=>withA(ctx,a,()=>{glass(ctx,bx,y,bw,176,18,BW_W,{glow:8,ea:0.01,fill:"rgba(10,18,36,0.55)"});ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(BW_W,0.75);ctx.lineWidth=2;rr(ctx,bx,y,bw,176,18);ctx.stroke();ctx.restore();
    T(ctx,label,bx+24,y+36,{f:"mono",w:500,size:22,color:rgba(BW_W,1)});
    st.forEach((s,i)=>{if(s)bw_write(ctx,bx+24+i*476,y+56,460,106,W3[i][0],W3[i][1],s,1);});
    if(res)withA(ctx,res[1],()=>tag(ctx,bx+bw-18-(tw(ctx,res[0],24,700)+26),y+30,res[0],resCol,{size:24}));});
  if(wA>0.01){const a0=cA,s1=[t>a0+2.7?"pend":null,t>a0+3.5?"pend":null,t>a0+4.4?"pend":null].map(s=>s&&t>a0+5.7?"done":s);
    box(452,"transaction · issue award A-9004",s1,["commit ✓",fin(t,a0+5.7,0.4)],GOOD,wA);
    const b2=fin(t,a0+6.3,0.5);if(b2>0){const s2=[t>a0+6.6?"pend":null,t>a0+6.9?"pend":null,t>a0+7.3?"fail":null].map((s,i)=>s&&i<2&&t>a0+7.9?"back":s);
      box(648,"transaction · issue award A-9005",s2,["roll back · nothing saved",fin(t,a0+8.2,0.4)],BAD,wA*b2);}}
  // what it's called
  const NM=[["normalisation",BW_W,0.5],["keys",REF,1.5],["constraints",BW_W,2.1],["transactions",BW_W,2.8]],ws=NM.map(q=>tw(ctx,q[0],34,700)+26),tot=ws.reduce((p,v)=>p+v,0)+3*44;
  NM.forEach(([s,col,d],i)=>{const a=fin(t,cN+d,0.4);if(a<=0)return;let x=960-tot/2;for(let k2=0;k2<i;k2++)x+=ws[k2]+44;
    withA(ctx,a,()=>tag(ctx,x,640,s,col,{size:34}));if(i<3)withA(ctx,fin(t,cN+NM[i+1][2],0.4),()=>T(ctx,"·",x+ws[i]+22,652,{w:800,size:34,align:"center",color:rgba(SOFT,1)}));});
  vign(ctx,S);});

/* ---------- 3. What goes wrong without it ---------- */
const BW_WIDE={name:"awards · the name on every row",cols:[["award_id","pk"],["learner_name",""],["course_title",""],["credits",""],["awarded_on",""]],
  rows:[["A-9001","Aisha Karim","BSc Data Science","240","2025-12-10"],["A-9002","Aisha Karim","Machine learning basics","12","2026-05-02"],["A-9004","Aisha Karim","Data visualisation","12","2026-09-28"],["A-9003","Ben Okafor","Data ethics","6","2026-06-20"]]};
scene("wrong",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const c3=c("three"),cC=c("change"),cPr=c("print"),cD=c("delete"),cAn=c("anomaly");
  bw_label(ctx,t,"the name on every award",BW_AMB);
  const three=fin(t,c3+2.4,0.5),fix=[fin(t,cC+1.5,0.3),fin(t,cC+2.0,0.3)],missed=fin(t,cC+2.7,0.4),gone=fin(t,cD+3.4,0.5),col_=fin(t,cD+4.0,0.6),out=fin(t,cD-0.4,0.6);
  const Tg=bw_tbl(ctx,70,140,Object.assign({a:fin(t,c3+0.2,0.6),rowA:j=>j===3?1-col_:fin(t,c3+0.4+j*0.2,0.4),
    rowBg:j=>j===3?[BAD,fin(t,cD+1.0,0.5)]:null,
    cell:(j,i)=>{if(i===1&&j<3){if(j<2&&fix[j]>0.5)return{text:"Aisha Salem",hi:three*(1-out)*0.8,col:BW_W,hiCol:BW_W};if(j===2&&missed>0.01)return{hi:missed*(1-fin(t,cAn+2.6,0.8)*0.5),col:mix(INK,BAD,missed),hiCol:BAD};return{hi:three*(1-out),col:mix(INK,BW_AMB,three),hiCol:BW_AMB};}
      if(j===3&&(i===2||i===3))return{hi:fin(t,cD+1.0,0.5)*(1-gone),hiCol:BAD,strike:gone};if(j===3)return{strike:gone};return null;}},BW_WIDE));
  const under=Tg.y+Tg.h+40;
  withA(ctx,three*(1-fin(t,cC-0.2,0.5)),()=>tag(ctx,Tg.colX(1),under,"3 copies of one name",BW_AMB,{align:"center",size:24}));
  withA(ctx,missed*(1-out),()=>tag(ctx,Tg.colX(1),under,"2 corrected, 1 missed",BAD,{align:"center",size:24}));
  // she changes her name: two copies corrected, one missed
  const nc=fin(t,cC+0.2,0.5)*(1-out);withA(ctx,nc,()=>{glass(ctx,1100,140,740,140,18,BW_W,{glow:14,ea:0.8,fill:"rgba(7,12,24,0.94)"});T(ctx,"name change",1130,186,{w:700,size:24,color:rgba(SOFT,1)});
    T(ctx,"Aisha Karim  →  Aisha Salem",1130,246,{w:800,size:38,color:rgba(INK,1)});});
  fix.forEach((f,j)=>{if(f>0&&f<1)glow(ctx,Tg.colX(1),Tg.rowY(j),120,BW_W,0.5*pulseAt(t,cC+1.5+j*0.5,0.6));if(f>0.5)withA(ctx,(1-out)*f,()=>tick_(ctx,Tg.x-26,Tg.rowY(j),26,GOOD,1));});
  withA(ctx,missed*(1-out),()=>cross_(ctx,Tg.x-26,Tg.rowY(2),26,BAD,1));
  // her next certificate prints the old name
  const pr=fin(t,cPr+0.1,0.6)*(1-out);if(pr>0){const u=ease(fin(t,cPr+0.1,0.7)),y=lerp(Tg.rowY(2),310,u);
    const ch=bw_cert(ctx,1140,y,660,{a:pr,t,issuer:"the university",holder:"Aisha Karim",claim:"Data visualisation",date:"28 Sep 2026",bad:fin(t,cPr+0.8,0.4)});
    withA(ctx,pr*fin(t,cPr+0.8,0.4),()=>tag(ctx,1140+330,y+ch+40,"the old name",BAD,{align:"center",size:26}));}
  // a course described only on its awards
  const cl=fin(t,cD+0.3,0.6);if(cl>0){const x=1100,y=140,list=[["BSc Data Science","240 cp"],["Machine learning basics","12 cp"],["Data visualisation","12 cp"],["Data ethics","6 cp"]];
    withA(ctx,cl,()=>{glass(ctx,x,y,740,350,18,BW_AMB,{glow:12,ea:0.7,fill:"rgba(7,12,24,0.94)"});T(ctx,"courses, as the awards describe them",x+26,y+46,{w:700,size:24,color:rgba(BW_AMB,1)});
      list.forEach(([n,cp],i)=>{const last=i===3,yy=y+110+i*62,dead=last?col_:0;withA(ctx,1-0.6*dead,()=>{if(last&&fin(t,cD+1.0,0.5)>0){ctx.fillStyle=rgba(BAD,0.14*fin(t,cD+1.0,0.5));rr(ctx,x+14,yy-38,712,54,8);ctx.fill();}
        T(ctx,n,x+30,yy,{w:700,size:28,color:rgba(dead>0.3?BAD:INK,1)});T(ctx,cp,x+710,yy,{f:"mono",w:500,size:22,align:"right",color:rgba(SOFT,1)});});
        if(last&&dead>0.01)withA(ctx,dead,()=>{ctx.strokeStyle=rgba(BAD,0.9);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+26,yy-9);ctx.lineTo(x+30+tw(ctx,n,28,700)*dead,yy-9);ctx.stroke();tag(ctx,x+420,yy-9,"gone",BAD,{size:22});});});
      withA(ctx,fin(t,cD+1.2,0.5)*(1-col_),()=>tag(ctx,x+370,y+350+40,"described only on its award",BW_AMB,{align:"center",size:24}));});
    withA(ctx,fin(t,cD+2.4,0.4)*(1-fin(t,cD+3.6,0.4)),()=>tag(ctx,Tg.colX(1),under,"delete award A-9003",BAD,{align:"center",size:24}));}
  // the names of the two mistakes
  withA(ctx,fin(t,cAn+0.5,0.5),()=>tag(ctx,Tg.colX(1),under,"update anomaly",BAD,{align:"center",size:28}));
  withA(ctx,fin(t,cAn+1.4,0.5),()=>tag(ctx,1470,530,"delete anomaly",BAD,{align:"center",size:28}));
  // each fact once: the name in one place, the course in its own row
  const fx=fin(t,cAn+3.0,0.6);if(fx>0)withA(ctx,fx,()=>{glass(ctx,70,590,1780,248,22,BW_W,{glow:14,ea:0.55,fill:"rgba(10,18,36,0.7)"});tag(ctx,100,626,"each fact once",BW_W,{size:24});
    const L=bw_tbl(ctx,110,662,{cols:[["learner_id","pk"],["name",""]],rows:[["L-204","Aisha Salem"]],cell:(j,i)=>i===1?{hi:fin(t,cAn+3.8,0.5),col:BW_W}:null});
    for(let i=0;i<3;i++){const x=560+i*150;glass(ctx,x,690,130,54,10,BW_W,{glow:6,ea:0.6,fill:"rgba(8,14,30,0.94)"});T(ctx,"award",x+65,725,{f:"mono",w:500,size:20,align:"center",color:rgba(SOFT,1)});
      arrowTo(ctx,x+30,690,L.x+L.w-40,L.rowY(0)-10,BW_W,0.75*fin(t,cAn+3.6+i*0.15,0.4),{bend:0.14,head:12,lw:2});}
    withA(ctx,fin(t,cAn+4.2,0.4),()=>T(ctx,"1 edit, no copy to miss",560,800,{w:700,size:26,color:rgba(GOOD,1)}));
    const C=bw_tbl(ctx,1120,662,{cols:[["course_id","pk"],["title",""],["cp",""]],rows:[["MC-ETH","Data ethics","6"]],cell:(j,i)=>({hi:fin(t,cAn+4.6,0.5),col:BW_W})});
    withA(ctx,fin(t,cAn+4.8,0.4),()=>{tick_(ctx,C.x+C.w+40,C.rowY(0),36,GOOD,1);T(ctx,"the course keeps its own row",1120,800,{w:700,size:26,color:rgba(GOOD,1)});});});
  vign(ctx,S);});

/* ---------- 4. Another way to write ---------- */
scene("docs",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const cDo=c("doc"),cTo=c("together"),cSh=c("shine"),cTr=c("trade"),many=fin(t,cTr+2.6,0.8);
  bw_label(ctx,t,"another way to write",BW_W);
  withA(ctx,1-many,()=>{const dx=140,dw=720;
    // the whole credential appears at once, then its claim, its evidence, and the signature over all of it
    const dA=fin(t,cDo+0.6,0.4);if(t<cDo+1.4)withA(ctx,dA*(1-fin(t,cDo+1.2,0.2)),()=>{ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(BW_W,0.6);ctx.lineWidth=2;rr(ctx,dx,150,dw,620,6);ctx.stroke();ctx.restore();});
    bw_doc(ctx,dx,150,dw,{a:fin(t,cDo+1.2,0.3),p:clamp((t-cDo-1.2)/0.9,0,1),hl:{claim:pulseAt(t,cDo+5.4,2.2),evidence:pulseAt(t,cDo+6.4,2.2)},sign:fin(t,cDo+7.8,0.5),check:fin(t,cTr+1.4,0.5),glow:fin(t,cTo,0.5)*(1-fin(t,cSh+1,0.6)),h:620});
    withA(ctx,fin(t,cDo+2.2,0.5)*(1-fin(t,cTo,0.4)),()=>tag(ctx,dx+dw+40,250,"one write: the whole thing",BW_W,{size:26}));
    withA(ctx,fin(t,cDo+5.4,0.4)*(1-fin(t,cTo,0.4)),()=>tag(ctx,dx+dw+40,420,"claim and evidence inside",TRUST,{size:26}));
    // written and signed together
    const tg=fin(t,cTo+0.1,0.5);if(tg>0)withA(ctx,tg*(1-fin(t,cSh-0.3,0.5)),()=>{ctx.save();ctx.strokeStyle=rgba(TRUST,0.9);ctx.lineWidth=3;ctx.shadowColor=rgba(TRUST,0.8);ctx.shadowBlur=14;
      ctx.beginPath();ctx.moveTo(dx+dw+10,160);ctx.lineTo(dx+dw+34,160);ctx.lineTo(dx+dw+34,760);ctx.lineTo(dx+dw+10,760);ctx.stroke();ctx.restore();tag(ctx,dx+dw+60,460,"written together, signed together",TRUST,{size:28});});
    // a document database: whole documents in, whole documents out
    const st=fin(t,cSh+0.2,0.6);bw_store(ctx,1240,270,560,440,BW_W,st,t);
    withA(ctx,fin(t,cSh+0.4,0.5),()=>tag(ctx,1520,210,"document databases",BW_W,{align:"center",size:28}));
    const wIn=clamp((t-cSh-1.6)/1.0,0,1),rOut=clamp((t-cSh-3.4)/1.0,0,1);
    if(wIn>0&&wIn<1){const e=ease(wIn);bw_miniDoc(ctx,lerp(dx+600,1420,e),lerp(300,420,e)-Math.sin(e*Math.PI)*80,66,88,BW_W,1);}
    if(rOut>0&&rOut<1){const e=ease(rOut);bw_miniDoc(ctx,lerp(1560,dx+600,e),lerp(420,560,e)+Math.sin(e*Math.PI)*80,66,88,BW_R,1);}
    withA(ctx,fin(t,cSh+1.8,0.4),()=>{arrowTo(ctx,dx+dw+30,350,1226,350,BW_W,0.85,{bend:-0.08,head:14});T(ctx,"written whole",1050,318,{w:700,size:24,align:"center",color:rgba(BW_W,1)});});
    withA(ctx,fin(t,cSh+3.6,0.4),()=>{arrowTo(ctx,1226,620,dx+dw+30,620,BW_R,0.85,{bend:-0.08,head:14});T(ctx,"read whole",1050,676,{w:700,size:24,align:"center",color:rgba(BW_R,1)});});
    withA(ctx,fin(t,cTr+1.0,0.4),()=>tag(ctx,dx+dw/2,812,"easy to write, easy to check",GOOD,{align:"center",size:26}));});
  // a million of them, and a count that has to open each one
  if(many>0)withA(ctx,many,()=>{const cols=40,rows=15,x0=150,y0=196,cw=40.5,ch=38,f=clamp((t-cTr-3.0)/24,0,1),sx=x0+f*cols*cw;
    T(ctx,"a million credentials, one document each",960,146,{w:800,size:34,align:"center",color:rgba(BW_W,1)});
    for(let r=0;r<rows;r++)for(let k=0;k<cols;k++){const x=x0+k*cw,y=y0+r*ch,done=x+14<sx;bw_miniDoc(ctx,x,y,28,32,done?BW_AMB:BW_W,done?0.75:0.35+0.15*hash(r*cols+k,5));}
    ctx.fillStyle=rgba(BW_AMB,0.9);ctx.fillRect(sx-2,y0-12,4,rows*ch+16);glow(ctx,sx,y0+rows*ch/2,180,BW_AMB,0.25);
    tag(ctx,960,812,"to count them, open every one · "+fmtNum(Math.floor(f*1000)*1000)+" so far",BW_AMB,{align:"center",size:26});});
  vign(ctx,S);});

/* ---------- 5. Built to read ---------- */
const BW_SX=1000,BW_SY=500,BW_SP={learner:[-370,-250],kind:[370,-250],faculty:[-370,250],date:[370,250]};
scene("read",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),B=c("breath");setScreen(ctx,S);bg2(ctx);
  const cQ=c("q"),cG=c("grain"),cF=c("facts"),cD=c("dims"),cW=c("words"),cS=c("star");
  bw_label(ctx,t,"Planning day · built to read",BW_R);
  person(ctx,"ana",170,886,0.5,{t,pose:t>cQ&&t<cG?"explain":"stand",expr:t>cS?"relieved":"calm"});
  const wA=fin(t,cW+3.4,0.5),fA=fin(t,cW+1.8,0.5);
  bw_qBubble(ctx,40,312,470,BW_QW,{a:fin(t,cQ+0.3,0.5),size:31,hi:i=>i===2?fA:(i===4||i===7)?wA:(i===3||i===6)?wA*0.6:0,hiCol:i=>i===2?GOOD:TRUST});
  // the star: the grain first, the facts in the middle, the dimensions around them
  const fa=fin(t,cG+0.2,0.6),dimA={learner:fin(t,cD+3.0,0.5),kind:fin(t,cD+3.8,0.5),faculty:fin(t,cD+4.6,0.5),date:fin(t,cD+5.3,0.5)};
  const sj=fin(t,cS+1.2,0.5),jn={faculty:sj,date:sj},dimHi={faculty:Math.max(wA,sj),date:Math.max(wA,sj)};
  if(sj>0)Object.keys(dimA).forEach(k=>{if(!jn[k])dimA[k]*=1-0.5*sj;});
  const starP=pulseAt(t,cS+0.2,1.4);
  if(starP>0.01)withA(ctx,starP,()=>{Object.values(BW_SP).forEach(([dx,dy])=>{ctx.save();ctx.strokeStyle=rgba(BW_R,0.6);ctx.lineWidth=10;ctx.shadowColor=rgba(BW_R,1);ctx.shadowBlur=30;ctx.beginPath();ctx.moveTo(BW_SX,BW_SY);ctx.lineTo(BW_SX+dx,BW_SY+dy);ctx.stroke();ctx.restore();});});
  bw_star(ctx,BW_SX,BW_SY,1,{P:BW_SP,ds:1.2,dimA,join:jn,dimHi,fact:{a:fa,g:fin(t,cG+1.8,0.5),gHi:pulseAt(t,cG+2.0,2.0),m:clamp((t-cF-1.8)/1.6,0,1),k:fin(t,cD+2.6,0.5),hi:fin(t,cF+1.6,0.5)*(1-fin(t,cD+2.2,0.6))+pulseAt(t,cS+0.2,1.4)}});
  // one row per credential awarded
  const rw=fin(t,cG+2.2,0.5)*(1-fin(t,cD+2.2,0.6));if(rw>0)withA(ctx,rw,()=>{for(let i=0;i<4;i++){const x=BW_SX-222+i*114,y=666;bw_awardTile(ctx,x,y,102,56,fin(t,cG+2.2+i*0.2,0.3),pulseAt(t,cG+2.2+i*0.2,0.6));}
    T(ctx,"each credential awarded = one row",BW_SX,770,{w:700,size:26,align:"center",color:rgba(TRUST,1)});});
  // labels
  withA(ctx,fin(t,cF+1.8,0.5)*(1-fin(t,cS,0.5)),()=>tag(ctx,BW_SX,318,"facts · the numbers you add up",BW_R,{align:"center",size:24}));
  withA(ctx,fin(t,cD+2.0,0.5)*(1-fin(t,cS,0.5)),()=>tag(ctx,BW_SX,140,"dimensions · what you filter or group by",BW_R,{align:"center",size:24}));
  withA(ctx,fin(t,cS+0.3,0.5),()=>tag(ctx,BW_SX,318,"a star",BW_R,{align:"center",size:28}));
  withA(ctx,wA,()=>{tag(ctx,BW_SX+BW_SP.faculty[0],BW_SY+BW_SP.faculty[1]-82,"by faculty",TRUST,{align:"center",size:22});tag(ctx,BW_SX+BW_SP.date[0],BW_SY+BW_SP.date[1]-82,"by year",TRUST,{align:"center",size:22});});
  if(sj>0)withA(ctx,sj,()=>{[["faculty","1"],["date","2"]].forEach(([k,n])=>{const x=BW_SX+BW_SP[k][0]*0.52,y=BW_SY+BW_SP[k][1]*0.52;ctx.fillStyle="rgba(7,14,18,0.95)";ctx.beginPath();ctx.arc(x,y,22,0,TAU);ctx.fill();ring(ctx,x,y,22,BW_R,1,2.6);T(ctx,n,x,y+9,{w:800,size:24,align:"center",color:rgba(BW_R,1)});});
    tag(ctx,BW_SX,140,"two joins, not seven",BW_R,{align:"center",size:26});});
  // the test: facts are what you add up; dimensions are the words after "by"
  const tc=fin(t,cW+0.3,0.5);if(tc>0)withA(ctx,tc,()=>{const x=1540,y=140,w=350;glass(ctx,x,y,w,262,18,BW_R,{glow:14,ea:0.8,fill:"rgba(7,14,18,0.94)"});T(ctx,"a simple test",x+24,y+42,{w:800,size:24,color:rgba(BW_R,1)});
    withA(ctx,0.4+0.6*fA,()=>{T(ctx,"facts",x+24,y+98,{w:800,size:26,color:rgba(GOOD,1)});T(ctx,"what you add up",x+24,y+132,{w:600,size:22});});
    withA(ctx,0.4+0.6*wA,()=>{T(ctx,"dimensions",x+24,y+188,{w:800,size:26,color:rgba(TRUST,1)});T(ctx,"the words after “by”",x+24,y+222,{w:600,size:22});});});
  // the answer, read in two steps
  bw_chart(ctx,1540,432,350,340,clamp((t-B-0.1)/1.6,0,1),fin(t,B-0.2,0.6));
  vign(ctx,S);});

/* ---------- 6. Keeping history for reading ---------- */
const BW_TX0=250,BW_TX1=1690,BW_TY=250;
const bw_dayX=d=>lerp(BW_TX0,BW_TX1,d/365);
const BW_DIM={name:"learner dimension",cols:[["learner_key","pk"],["learner_id",""],["name",""],["faculty",""],["valid_from",""],["valid_to",""]],rows:[["1","L-204","Aisha Salem","Science","2024-02-01","2026-06-30"],["2","L-204","Aisha Salem","Engineering","2026-07-01","—"]]};
scene("history",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const cM=c("moved"),cB=c("both"),cR=c("revoked"),cC=c("choice"),cS=c("scd");
  bw_label(ctx,t,"history, for reading",BW_R);
  const aA=1-fin(t,cR-0.4,0.7),aB=fin(t,cR-0.1,0.6)*(1-fin(t,cC-0.4,0.7)),aC=fin(t,cC-0.1,0.6);
  // a year, and a move in the middle of it
  if(aA>0.01)withA(ctx,aA,()=>{const ta=fin(t,cM+0.3,0.6);withA(ctx,ta,()=>{ctx.strokeStyle=rgba(SOFT,0.6);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(BW_TX0,BW_TY);ctx.lineTo(BW_TX1,BW_TY);ctx.stroke();
      "JFMAMJJASOND".split("").forEach((m,i)=>{const x=bw_dayX(i*30.4+15);T(ctx,m,x,BW_TY+36,{f:"mono",w:500,size:23,align:"center",color:rgba(SOFT,0.9)});ctx.fillStyle=rgba(SOFT,0.5);ctx.fillRect(bw_dayX(i*30.4)-1,BW_TY-6,2,12);});
      T(ctx,"2026",BW_TX0-20,BW_TY+8,{f:"mono",w:500,size:22,align:"right",color:rgba(SOFT,1)});});
    const sciP=clamp((t-cM-1.0)/1.2,0,1),engP=clamp((t-cM-2.6)/1.4,0,1),mv=bw_dayX(181);
    const band=(x0,x1,col,name)=>{if(x1<=x0+2)return;ctx.fillStyle=rgba(col,0.22);rr(ctx,x0,BW_TY-78,x1-x0,46,10);ctx.fill();ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2;rr(ctx,x0,BW_TY-78,x1-x0,46,10);ctx.stroke();
      if(x1-x0>190)T(ctx,name,x0+18,BW_TY-46,{w:800,size:25,color:rgba(col,1)});};
    band(BW_TX0,lerp(BW_TX0,mv,sciP),BW_FAC.sci.c,"Science");band(mv+4,lerp(mv+4,BW_TX1,engP),BW_FAC.eng.c,"Engineering");
    withA(ctx,fin(t,cM+2.4,0.4),()=>{ctx.strokeStyle=rgba(INK,0.8);ctx.setLineDash([6,6]);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(mv,BW_TY-100);ctx.lineTo(mv,BW_TY+8);ctx.stroke();ctx.setLineDash([]);tag(ctx,mv,BW_TY-122,"Aisha moves faculty · 1 July",INK,{align:"center",size:24});});
    // two awards, one on each side of the move
    const AW=[[122,"Machine learning basics","2 May",BW_FAC.sci],[270,"Data visualisation","28 Sep",BW_FAC.eng]];
    AW.forEach(([d,n,ds,F],i)=>{const x=bw_dayX(d),a=fin(t,cM+4.0+i*0.3,0.4);if(a<=0)return;withA(ctx,a,()=>{glow(ctx,x,BW_TY,44,TRUST,0.5);ctx.fillStyle=rgba(TRUST,1);ctx.beginPath();ctx.arc(x,BW_TY,10,0,TAU);ctx.fill();
      T(ctx,n,x,BW_TY+74,{w:700,size:24,align:"center",color:rgba(TRUST,1)});T(ctx,"awarded "+ds,x,BW_TY+102,{f:"mono",w:500,size:19,align:"center",color:rgba(SOFT,1)});
      const ans=fin(t,cB+3.6+i*2.0,0.5);withA(ctx,1-ans,()=>T(ctx,"?",x,BW_TY+152,{w:800,size:38,align:"center",color:rgba(BW_AMB,1)}));
      withA(ctx,ans,()=>tag(ctx,x,BW_TY+144,"counts for "+F.n,F.c,{align:"center",size:22}));});});
    // the learner dimension: a row for each faculty, with the dates each was true
    const D=bw_tbl(ctx,440,470,Object.assign({a:fin(t,cB+0.4,0.6),col:BW_R,rowA:j=>fin(t,cB+0.8+j*0.8,0.4),
      cell:(j,i)=>i===3?{col:j?BW_FAC.eng.c:BW_FAC.sci.c,hi:pulseAt(t,cB+3.6+j*2.0,1.6)}:(i>=4?{hi:fin(t,cB+2.0,0.5)*(1-fin(t,cB+3.4,0.5)),col:BW_R}:null)},BW_DIM));
    withA(ctx,fin(t,cB+2.0,0.5),()=>tag(ctx,D.cx[4]+D.cw[4],D.y+D.h+42,"each row: the dates it was true",BW_R,{align:"center",size:24}));
    AW.forEach(([d],i)=>{const p=clamp((t-cB-3.6-i*2.0)/0.8,0,1);if(p>0)arrowTo(ctx,bw_dayX(d),BW_TY+168,D.colX(3)+(i?40:-40),D.rowY(i)-16,TRUST,0.85,{p,bend:i?0.1:-0.1,head:14,lw:2.4});});});
  // an award revoked and reissued: every status kept, each with its date
  if(aB>0.01)withA(ctx,aB,()=>{const fr=[{s:"issued",d:"2 May 2026",col:BW_R},{s:"revoked",d:"9 May 2026",col:BAD},{s:"reissued",d:"12 May 2026",col:BW_R}].map((f,i)=>Object.assign(f,{a:fin(t,cR+0.6+i*0.9,0.4),hi:pulseAt(t,cR+0.6+i*0.9,1.2)}));
    T(ctx,"award A-9002 · Machine learning basics",960,170,{w:800,size:32,align:"center",color:rgba(TRUST,1)});
    ctx.save();ctx.translate(960-552*1.4/2,204);ctx.scale(1.4,1.4);filmStrip(ctx,0,0,fr,1,0,t);ctx.restore();
    const H=bw_tbl(ctx,560,440,{name:"award status history",col:BW_R,cols:[["award_id",""],["status",""],["from",""],["to",""]],rows:[["A-9002","issued","2026-05-02","2026-05-08"],["A-9002","revoked","2026-05-09","2026-05-11"],["A-9002","reissued","2026-05-12","—"]],
      rowA:j=>fin(t,cR+0.8+j*0.9,0.4),cell:(j,i)=>i===1?{col:j===1?BAD:BW_R}:(i>=2?{hi:fin(t,cR+4.6,0.5),col:BW_R}:null)});
    withA(ctx,fin(t,cR+3.0,0.5),()=>tag(ctx,H.x+H.w+30,H.rowY(0),"nothing overwritten",BW_R,{size:26}));
    withA(ctx,fin(t,cR+4.6,0.5),()=>tag(ctx,H.x+H.w+30,H.rowY(2),"each change has a date",BW_R,{size:26}));});
  // overwrite, or keep history: decided for each attribute
  if(aC>0.01)withA(ctx,aC,()=>{const t1=fin(t,cC+2.4,0.6),t2=fin(t,cC+4.6,0.6),ty=fin(t,cS+0.3,0.5);
    glass(ctx,130,150,800,380,22,BW_W,{glow:14,ea:0.75,fill:"rgba(7,12,24,0.94)"});T(ctx,"overwrite",164,208,{w:800,size:36,color:rgba(BW_W,1)});T(ctx,"a typo",164,246,{w:600,size:26,color:rgba(SOFT,1)});
    bw_tbl(ctx,164,284,{cols:[["learner_id",""],["name",""]],rows:[["L-204",t1>0.5?"Aisha Salem":"Aisha Slaem"]],size:28,rh:58,cell:(j,i)=>i===1?{hi:pulseAt(t,cC+2.6,1.2)+(t1<0.5?0.6:0),hiCol:t1<0.5?BAD:BW_W,col:t1<0.5?BAD:BW_W}:null});
    withA(ctx,t1,()=>T(ctx,"one row, fixed in place",164,476,{w:700,size:26,color:rgba(GOOD,1)}));
    withA(ctx,ty,()=>tag(ctx,870,204,"type 1",BW_W,{size:24,align:"center"}));
    glass(ctx,990,150,800,380,22,BW_R,{glow:14,ea:0.75,fill:"rgba(7,14,18,0.94)"});T(ctx,"keep history",1024,208,{w:800,size:36,color:rgba(BW_R,1)});T(ctx,"a move",1024,246,{w:600,size:26,color:rgba(SOFT,1)});
    bw_tbl(ctx,1024,284,{col:BW_R,cols:[["faculty",""],["valid_from",""],["valid_to",""]],rows:[["Science","2024-02-01",t2>0.5?"2026-06-30":"—"],["Engineering","2026-07-01","—"]],size:25,rh:52,rowA:j=>j?t2:1,cell:(j,i)=>i===0?{col:j?BW_FAC.eng.c:BW_FAC.sci.c}:(j===0&&i===2?{hi:pulseAt(t,cC+4.8,1.2),col:BW_R}:null)});
    withA(ctx,t2,()=>T(ctx,"a new row; the old one closed",1024,500,{w:700,size:26,color:rgba(GOOD,1)}));
    withA(ctx,ty,()=>tag(ctx,1730,204,"type 2",BW_R,{size:24,align:"center"}));
    const sp=fin(t,cC+6.4,0.6);if(sp>0){bw_paper(ctx,560,566,800,270,{a:sp,t,rot:-0.01,seed:9,lines:70,lh:40,base:"#efe8da"});pencilText(ctx,"decided, and written down:",610,622,{size:28,p:clamp((t-cC-6.6)/0.6,0,1)});
      [["name","overwrite"],["email","overwrite"],["faculty","keep history"],["award status","keep history"]].forEach(([a,b],i)=>{const p=clamp((t-cC-7.0-i*0.45)/0.5,0,1);pencilText(ctx,a,630,670+i*40,{size:26,p});pencilText(ctx,b,1000,670+i*40,{size:26,p,color:b==="overwrite"?"rgba(40,90,170,0.95)":"rgba(30,120,80,0.95)"});});}});
  withA(ctx,fin(t,cS+0.2,0.5),()=>tag(ctx,960,100,"slowly changing dimension",BW_R,{align:"center",size:34}));
  vign(ctx,S);});

/* ---------- 7. Side by side ---------- */
// the shape built to write: eight tables, seven joins, and a history table to puzzle over
const BW_NE={award:[490,500,"award"],status:[490,330,"award_status"],learner:[215,410,"learner"],lf:[215,580,"learner_faculty"],faculty:[215,745,"faculty"],course:[765,410,"course"],kind:[765,580,"credential_kind"],cal:[490,690,"calendar"]};
const BW_NJ=[["award","status","1","*"],["award","learner","*","1"],["learner","lf","1","*"],["lf","faculty","*","1"],["award","course","*","1"],["course","kind","*","1"],["award","cal","*","1"]];
scene("side",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const cQ=c("q"),cW=c("write"),cR=c("read"),cN=c("name"),cJ=c("job");
  const nm=fin(t,cN+0.2,0.6)*(1-fin(t,cJ-1.0,0.7)),dg=1-0.9*nm;
  withA(ctx,fin(t,0.1,0.5),()=>{glass(ctx,40,150,900,700,24,BW_W,{glow:14,ea:0.45,fill:"rgba(10,18,36,0.5)"});glass(ctx,980,150,900,700,24,BW_R,{glow:14,ea:0.45,fill:"rgba(8,20,22,0.5)"});
    T(ctx,"built to write",490,212,{w:800,size:36,align:"center",color:rgba(BW_W,1)});T(ctx,"built to read",1430,212,{w:800,size:36,align:"center",color:rgba(BW_R,1)});});
  const q=fin(t,cQ+0.2,0.5);withA(ctx,q*(1-nm),()=>tag(ctx,960,92,"awards by faculty and by year, for ten years",TRUST,{align:"center",size:28}));
  withA(ctx,nm,()=>tag(ctx,960,92,"correct a name:  “Enginering” → “Engineering”",TRUST,{align:"center",size:28}));
  // left: seven joins, drawn one by one
  const la=lerp(0.4,1,fin(t,cW-0.2,0.5))*fin(t,cQ+0.4,0.6)*dg,s=0.8;
  withA(ctx,la,()=>{const Bx={};Object.keys(BW_NE).forEach(k=>{Bx[k]=entBox(ctx,{x:BW_NE[k][0],y:BW_NE[k][1],name:BW_NE[k][2],s});});
    BW_NJ.forEach(([a,b,ca,cb],i)=>{const p=clamp((t-cW-0.2-i*0.26)/0.26,0,1);if(p<=0)return;relLine(ctx,Bx[a],Bx[b],ca,cb,{col:BW_W,s,f:p});
      if(p>=1){const x=(Bx[a].x+Bx[b].x)/2,y=(Bx[a].y+Bx[b].y)/2;ctx.fillStyle="rgba(7,12,24,0.95)";ctx.beginPath();ctx.arc(x,y,17,0,TAU);ctx.fill();ring(ctx,x,y,17,BW_W,1,2);T(ctx,String(i+1),x,y+7,{w:800,size:20,align:"center",color:rgba(BW_W,1)});}});
    const pz=fin(t,cW+2.4,0.5);
    Object.keys(BW_NE).forEach(k=>ent(ctx,{x:BW_NE[k][0],y:BW_NE[k][1],name:BW_NE[k][2],s,col:k==="lf"&&pz>0?mix(BW_W,BW_AMB,pz):BW_W,hi:k==="lf"?pz*(0.6+0.4*Math.sin(t*3)):0,dash:k==="lf"&&pz>0}));
    withA(ctx,pz,()=>{tag(ctx,620,806,"a puzzle: which faculty, on the award date?",BW_AMB,{align:"center",size:22});ctx.strokeStyle=rgba(BW_AMB,0.7);ctx.setLineDash([5,6]);ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(Bx.lf.x+Bx.lf.w/2,Bx.lf.y+10);ctx.quadraticCurveTo(380,720,450,786);ctx.stroke();ctx.setLineDash([]);});
    withA(ctx,fin(t,cW+1.8,0.4),()=>tag(ctx,765,300,"7 joins",BW_W,{align:"center",size:26}));});
  // right: two joins
  const ra=lerp(0.4,1,fin(t,cR-0.3,0.5))*fin(t,cQ+0.4,0.6)*dg,rj=fin(t,cR+0.5,0.5),ss=0.85;
  withA(ctx,ra,()=>{bw_star(ctx,1430,500,ss,{nosub:true,small:true,fw:390,fh:190,join:{faculty:rj,date:rj},dimA:{learner:1-0.55*rj,kind:1-0.55*rj,faculty:1,date:1},dimHi:{faculty:rj,date:rj}});
    if(rj>0)withA(ctx,rj,()=>{[["faculty","1",-340,240],["date","2",340,240]].forEach(([k,n,dx,dy])=>{const x=1430+dx*ss*0.55,y=500+dy*ss*0.55;ctx.fillStyle="rgba(7,14,18,0.95)";ctx.beginPath();ctx.arc(x,y,19,0,TAU);ctx.fill();ring(ctx,x,y,19,BW_R,1,2.2);T(ctx,n,x,y+8,{w:800,size:22,align:"center",color:rgba(BW_R,1)});});
      tag(ctx,1430,806,"2 joins",BW_R,{align:"center",size:26});});});
  // a name correction: one cell on the left, many rows on the right
  if(nm>0.01)withA(ctx,nm,()=>{const fx=fin(t,cN+1.4,0.4);
    const F=bw_tbl(ctx,150,300,{name:"faculty",cols:[["faculty_id","pk"],["name",""]],rows:[["F-SCI","Science"],["F-ENG",fx>0.5?"Engineering":"Enginering"],["F-ART","Arts"]],size:26,rh:56,
      cell:(j,i)=>j===1&&i===1?{hi:0.4+0.6*pulseAt(t,cN+1.4,1.2),col:fx>0.5?BW_W:mix(INK,BAD,0.6),hiCol:fx>0.5?BW_W:BAD}:null});
    withA(ctx,fin(t,cN+1.8,0.4),()=>{tick_(ctx,F.x+F.w+40,F.rowY(1),36,GOOD,1);tag(ctx,F.x+F.w/2,F.y+F.h+56,"stored once: 1 edit",GOOD,{align:"center",size:26});});
    const names=["Aisha Salem","Ben Okafor","Chen Wei","Dara Singh","Eli Moreau","Farah Aziz","Gus Lind","Hana Sato"],u0=cN+2.8;
    const R=bw_tbl(ctx,1030,250,{name:"learner dimension",col:BW_R,cols:[["learner",""],["faculty",""]],rows:names.map(n=>[n,"Enginering"]),size:21,rh:44,
      cell:(j,i)=>i===1?(t>u0+j*0.3?{text:"Engineering",col:BW_R,hi:pulseAt(t,u0+j*0.3,0.6),hiCol:BW_AMB}:{col:mix(INK,BAD,0.6)}):null});
    const done=Math.min(4812,Math.floor(clamp((t-u0)/2.6,0,1)*4812));
    withA(ctx,fin(t,u0,0.4),()=>{T(ctx,"… and every other",R.x+R.w+24,R.y+R.h-60,{w:600,size:22,color:rgba(SOFT,1)});T(ctx,"Engineering learner",R.x+R.w+24,R.y+R.h-30,{w:600,size:22,color:rgba(SOFT,1)});
      tag(ctx,1430,806,"repeated on purpose: "+fmtNum(done)+" of 4,812 rows",BW_AMB,{align:"center",size:24});});});
  // each shape, fast at its own job
  withA(ctx,fin(t,cJ+0.1,0.5),()=>{tag(ctx,490,262,"fast to write: issue, correct",BW_W,{align:"center",size:26});tag(ctx,1430,262,"fast to read: add up, compare",BW_R,{align:"center",size:26});});
  vign(ctx,S);});

/* ---------- 8. Pull back ---------- */
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),B=c("breath");setScreen(ctx,S);bg2(ctx);
  const cO=c("one"),cM=c("medal"),cF=c("often"),cX=c("next");
  const top=1-fin(t,cM-0.2,0.8);
  // one sketch, two shapes from the same logical model
  if(top>0.01)withA(ctx,top,()=>{bw_paper(ctx,600,60,720,260,{a:fin(t,cO+0.1,0.5),t,rot:-0.008,seed:4,lines:60,lh:40,base:"#efe8da"});
    const bx=[[640,190,"Learner"],[870,210,"Credential"],[1120,160,"Course"]];bx.forEach(([x,w,n],i)=>pencilBox(ctx,x,120,w,70,n,clamp((t-cO-0.3-i*0.3)/0.6,0,1),{size:28}));
    [[830,870],[1080,1120]].forEach(([a,b],i)=>{const p=clamp((t-cO-1.0-i*0.2)/0.4,0,1);if(p>0){ctx.strokeStyle="rgba(58,54,52,0.85)";ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(a,155);ctx.lineTo(lerp(a,b,p),155);ctx.stroke();}});
    withA(ctx,fin(t,cO+0.8,0.4),()=>pencilText(ctx,"one sketch · one logical model",960,272,{size:30,align:"center"}));
    const sp=fin(t,cO+1.4,0.6);
    arrowTo(ctx,840,330,600,430,BW_W,sp,{bend:0.1,head:16,lw:3});arrowTo(ctx,1080,330,1320,430,BW_R,sp,{bend:-0.1,head:16,lw:3});
    bw_normIcon(ctx,560,570,2.0,fin(t,cO+1.8,0.5),BW_W);bw_starIcon(ctx,1360,570,2.0,fin(t,cO+2.2,0.5),BW_R);
    withA(ctx,fin(t,cO+1.8,0.5),()=>tag(ctx,560,780,"built to write",BW_W,{align:"center",size:30}));withA(ctx,fin(t,cO+2.2,0.5),()=>tag(ctx,1360,780,"built to read",BW_R,{align:"center",size:30}));});
  // bronze, silver and gold: how refined, not what shape
  const V=[["bronze",170,"raw, as it arrived"],["silver",720,"cleaned, joined"],["gold",1270,"ready to use"]],vy=240,vw=480,vh=480;
  V.forEach(([k,x,sub],i)=>{const a=fin(t,cM+0.5+i*0.35,0.6);if(a<=0.01)return;withA(ctx,a,()=>{const col=LAYER[k];
    vault(ctx,x,vy,vw,vh,col,(r,cc)=>{if(r>3)return null;if(k==="bronze")return hash(r*31+cc,4)>0.25?(hash(r*7+cc,9)>0.85?BAD:col):null;if(k==="silver")return col;return (cc+r)%2?col:null;},k[0].toUpperCase()+k.slice(1),sub);});});
  // the confusion: layers mistaken for shapes
  const cf=fin(t,cM+1.2,0.5)*(1-fin(t,cM+5.4,0.6)),strike=fin(t,cM+3.6,0.5);
  if(cf>0.01)withA(ctx,cf,()=>{[["normalised here?",170],["stars here?",1270]].forEach(([s,x])=>{const cx=x+vw/2,cy=vy+340;tag(ctx,cx,cy,s,BW_AMB,{align:"center",size:28});
    if(strike>0.01){const w=tw(ctx,s,28,700)+26;ctx.strokeStyle=rgba(BAD,0.95);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(cx-w/2-6,cy);ctx.lineTo(cx-w/2-6+(w+12)*strike,cy);ctx.stroke();}});});
  withA(ctx,fin(t,cM+3.6,0.5),()=>{const g=ctx.createLinearGradient(260,0,1660,0);g.addColorStop(0,rgba(LAYER.bronze,0.9));g.addColorStop(0.5,rgba(LAYER.silver,0.9));g.addColorStop(1,rgba(LAYER.gold,0.9));
    ctx.strokeStyle=g;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(260,768);ctx.lineTo(1650,768);ctx.stroke();ctx.fillStyle=rgba(LAYER.gold,0.9);ctx.beginPath();ctx.moveTo(1674,768);ctx.lineTo(1648,754);ctx.lineTo(1648,782);ctx.closePath();ctx.fill();
    T(ctx,"how refined the data is",960,816,{w:700,size:28,align:"center",color:rgba(INK,0.95)});});
  withA(ctx,fin(t,cM+5.0,0.5)*(1-fin(t,cF-0.2,0.5)),()=>tag(ctx,960,160,"not what shape it has",TRUST,{align:"center",size:30}));
  // a normalised shape in silver, stars in gold: one choice among several
  const iy=vy+350,sil=720+vw/2,gol=1270+vw/2,brz=170+vw/2;
  const nIn=fin(t,cF+2.0,0.8),sIn=fin(t,cF+4.0,0.8),any=fin(t,cX+0.4,0.6);
  const ks=lerp(1.3,0.95,any),off=110*ease(any);
  if(nIn>0)bw_normIcon(ctx,lerp(560,sil-off,ease(nIn)),lerp(120,iy,ease(nIn)),ks,nIn,BW_W);
  if(sIn>0)bw_starIcon(ctx,lerp(1360,gol+off,ease(sIn)),lerp(120,iy,ease(sIn)),ks,sIn,BW_R);
  withA(ctx,fin(t,cF+5.6,0.5)*(1-fin(t,cX-0.2,0.5)),()=>tag(ctx,960,160,"a choice, not a rule",TRUST,{align:"center",size:30}));
  if(any>0){const fa=any*0.5;bw_normIcon(ctx,brz-110,iy,0.95,fa,BW_W);bw_starIcon(ctx,brz+110,iy,0.95,fa,BW_R);bw_starIcon(ctx,sil+110,iy,0.95,fa,BW_R);bw_normIcon(ctx,gol-110,iy,0.95,fa,BW_W);
    withA(ctx,any*(1-fin(t,cX+2.2,0.5)),()=>tag(ctx,960,160,"any layer can hold either shape",TRUST,{align:"center",size:30}));}
  // the next question: which shapes, for reading?
  const nx=fin(t,cX+2.6,0.6);if(nx>0)withA(ctx,nx,()=>{tag(ctx,960,96,"which shapes, for reading?",BW_R,{align:"center",size:30});
    [[640,"a star"],[960,"one wide table"],[1280,"hubs and links"]].forEach(([x,n],i)=>{const a=fin(t,cX+3.2+i*0.4,0.5);withA(ctx,a,()=>{const y=168;glass(ctx,x-140,y-28,280,56,14,BW_R,{glow:10,ea:0.6,fill:"rgba(7,14,18,0.92)"});T(ctx,n,x,y+9,{w:700,size:24,align:"center",color:rgba(BW_R,1)});});});});
  endCard(ctx,S,t,B+0.3,"Built to write, built to read",BW_R,"One logical model, a shape for each job.");
  vign(ctx,S);});
