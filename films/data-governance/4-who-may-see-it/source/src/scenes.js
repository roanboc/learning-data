/* ===== Who may see it: the eight chapters =====
   Each chapter is a few shots in the places of plan.js and the series' rooms.js, cut together with short dissolves (gv_shots). Times
   inside a chapter come from its cues (when each line starts) and the words of its lines (wAt), so the pictures stay with the voice if
   it's recorded again. Words on screen are on paper, screens, boards, tags and speech bubbles, at least 28 px as seen, and above the
   captions. */

// made once per chapter, the first time it draws: its cues are known by then
const ws_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// the year and the place in the top corner: the latest one passed, dissolving from the one before
function ws_pill(ctx,t,mk,a){if(a<=0.01)return;let i=0;for(let k=1;k<mk.length;k++)if(t>=mk[k][0])i=k;const u=i>0?fin(t,mk[i][0],0.35):1;
  if(u<1)wc_year(ctx,56,72,mk[i-1][1],a*(1-u));wc_year(ctx,56,72,mk[i][1],a*u);}
// a tag that springs in at t0 and goes at t1 (or stays)
function ws_tagAt(ctx,t,t0,t1,x,y,s,o){const a=t1==null?fin(t,t0,0.35):gv_io(t,t0,t1,0.35);if(a<=0.01)return;const k=0.9+0.1*spring(fin(t,t0,0.5));
  ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,a,()=>wc_tag(ctx,0,0,s,Object.assign({align:"center"},o||{})));ctx.restore();}
// a name card, as the series introduces people: the name, then the role; it rises a little as it comes
function ws_nameCard(ctx,x,y,name,role,a){if(a<=0.01)return;const w=Math.round(Math.max(tw(ctx,name,32,800),tw(ctx,role,28,600))+60);
  withA(ctx,a,()=>{ctx.save();ctx.translate(0,12*(1-a));wc_panel(ctx,x,y,w,112,{kind:"card",seed:3});wc_T(ctx,name,x+30,y+48,{w:800,size:32,col:WC_DARK});
    wc_T(ctx,role,x+30,y+90,{w:600,size:28,col:WC_MUTED});ctx.restore();});}
// a pencil, lying at an angle, its point at (x,y): it draws the lines of 1983
function ws_pencil(ctx,x,y,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(-0.7);ctx.fillStyle="rgba(60,44,30,0.2)";ctx.fillRect(14,10,230,22);
  ctx.fillStyle=rgba([236,190,70],1);ctx.fillRect(34,-11,200,22);ctx.fillStyle=rgba([206,160,52],1);ctx.fillRect(34,-1,200,4);ctx.fillStyle=rgba([226,200,160],1);
  ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(34,-11);ctx.lineTo(34,11);ctx.closePath();ctx.fill();ctx.fillStyle=rgba(WC_PENCIL,1);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(10,-3.3);ctx.lineTo(10,3.3);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba([200,150,150],1);ctx.fillRect(234,-11,26,22);ctx.restore();});}

// ---- 1 · Counted, not known: a census in West Germany, stopped in 1983 and counted in 1987 ----
// the bundles of forms on the counter (x, width), the first at the clerk's side; three cards from her form to the town's map: housing,
// schools, transport
const WS_BUN=[[1000,230],[1250,240],[640,180]],WS_PLAN=[[996,300],[1090,268],[1184,318]];
// the clerk behind the counter: arms as given, a form in her hands once she has one
const ws_clerk=(x,tt,po,form)=>gv_behind(x,"ws_clerk",WS_HL.clerk[0],WS_HL.top,WS_HL.clerk[1],Object.assign({standing:true,t:tt,carry:form?ws_heldForm:null},po));
// the bundles on the counter: hers loose (tied 0) once she has taken a form from it
const ws_bundles=(x,tied)=>WS_BUN.forEach(([bx,bw],i)=>ws_bundle(x,bx,WS_HL.top+18,bw,i?1:tied));
// the posters going up on the column: which, where and how big
const WS_PST=[[0,790,372,118,168],[1,915,352,130,184],[2,1046,384,112,160]];
// the table: where the form lies (centre, width, height), the tin box where names are kept apart, the shredder, the tally, the town
// hall's card; the form's line, in the gap the name strip leaves as it lifts (split 0 to 1)
const WS_F=[960,500,520,700],WS_BOX=[320,300],WS_SHR=[320,690],WS_TAL=[1460,380],WS_TH=[1580,160];
const ws_cutY=split=>WS_F[1]-WS_F[3]/2+WS_F[3]*WS_FCUT-split*WS_F[3]*0.12;
// the name strip, wherever it is: its centre at (x,y), at scale k
function ws_strip(ctx,x,y,k,a){if(a<=0.01)return;const [fx,fy,fw,fh]=WS_F,sy=fy-fh/2+fh*WS_FCUT/2;ctx.save();ctx.translate(x,y);ctx.scale(k,k);ctx.translate(-fx,-sy);
  withA(ctx,a,()=>ws_form(ctx,fx,fy,fw,fh,{top:true}));ctx.restore();}
// the strip's way: lifted off the form (split), carried into the box (box), and from the box into the shredder (shred); each 0 to 1
function ws_stripWay(ctx,split,box,shred){const [fx,fy,fw,fh]=WS_F,sy=fy-fh/2+fh*WS_FCUT/2-split*fh*0.24;if(shred>=1)return;
  if(box<=0)return ws_strip(ctx,fx,sy,1,1);const e=easeCam(clamp(box,0,1)),k=lerp(1,0.42,e);
  if(shred<=0)return ws_strip(ctx,lerp(fx,WS_BOX[0],e),lerp(sy,WS_BOX[1],e)+30*Math.sin(Math.PI*e),k,1);
  const v=easeCam(clamp(shred/0.6,0,1));ws_strip(ctx,WS_BOX[0],lerp(WS_BOX[1],WS_SHR[1]-90,v),0.42,1-clamp((shred-0.6)/0.4,0,1));}
// four answers lift off the form and come together round the outline of a person (u 0 to 1); ring draws the outline
const WS_SLIPF=[[1050,370],[1070,470],[1035,575],[1060,680]],WS_SLIPT=[[1440,400],[1700,410],[1450,566],[1690,580]],WS_OUT=[1570,480];
function ws_slipsMove(ctx,u,ring){const e=easeCam(clamp(u,0,1));if(ring>0)withA(ctx,clamp(ring,0,1),()=>{const [cx,cy]=WS_OUT;ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.85);ctx.lineWidth=5;ctx.setLineDash([4,12]);
    ctx.lineCap="round";ctx.beginPath();ctx.arc(cx,cy-200,78,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(cx-240,cy+300);ctx.quadraticCurveTo(cx-240,cy-90,cx,cy-100);ctx.quadraticCurveTo(cx+240,cy-90,cx+240,cy+300);ctx.stroke();ctx.restore();});
  WS_SLIPS.forEach(([s],i)=>{if(u<=0)return;const [x0,y0]=WS_SLIPF[i],[x1,y1]=WS_SLIPT[i],x=lerp(x0,x1,e),y=lerp(y0,y1,e)-80*Math.sin(Math.PI*e),r=(i%2?0.05:-0.04)*(1-e);
    ctx.save();ctx.translate(x,y);ctx.rotate(r);withA(ctx,clamp(u*4,0,1),()=>{const w=Math.round(tw(ctx,s,34,700)+60);wc_panel(ctx,-w/2,-36,w,72,{kind:"card",seed:80+i});wc_T(ctx,s,0,12,{w:700,size:34,align:"center",col:WC_DARK});});ctx.restore();});}
// the town hall's card, its tag, and the arrow from the answers to it (p), crossed out (x)
function ws_townHall(ctx,a,p,x){if(a<=0.01)return;const [tx,ty]=WS_TH;withA(ctx,a,()=>{ws_regCard(ctx,tx,ty,240,150,0.03);wc_tag(ctx,tx,ty+104,"town hall",{align:"center",size:30,seed:21});
  const A=[WS_F[0]+WS_F[2]/2+14,470],B=[tx-130,ty+50];if(p>0){ws_line(ctx,A,[lerp(A[0],B[0],p),lerp(A[1],B[1],p)],1,4);
    if(p>=1){ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.92);ctx.lineWidth=4;ctx.lineCap="round";const an=Math.atan2(B[1]-A[1],B[0]-A[0]);
      for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(B[0],B[1]);ctx.lineTo(B[0]-26*Math.cos(an+s*0.5),B[1]-26*Math.sin(an+s*0.5));ctx.stroke();}ctx.restore();}}
  wc_cross(ctx,(A[0]+B[0])/2,(A[1]+B[1])/2,80,WC_PENCIL,x);});}
// a question in pencil, in the form's left margin, level with the gap between the name and the answers: the country still needs a way
// to count without knowing who said what. Drawn p of the way (0 to 1): the hook and the stem, then the dot; ws_qAt says where the
// pencil's point is on the way. It gives way to the court's line, drawn in the same gap
const WS_QX=622;
function ws_qPts(){const qy=ws_cutY(0),pts=[];for(let i=0;i<=28;i++){const a=Math.PI*(0.86+1.54*i/28);pts.push([WS_QX+Math.cos(a)*30,qy-37+Math.sin(a)*30]);}
  pts.push([WS_QX+2,qy-3],[WS_QX,qy+10],[WS_QX,qy+22]);return pts;}
function ws_qAt(p){const q=ws_qPts();if(p>0.88)return[WS_QX,ws_cutY(0)+47];let tot=0;const L=q.map((v,i)=>i?(tot+=Math.hypot(v[0]-q[i-1][0],v[1]-q[i-1][1])):0),d=clamp(p/0.88,0,1)*tot;
  for(let i=1;i<q.length;i++)if(L[i]>=d){const u=(d-L[i-1])/(L[i]-L[i-1]||1);return[lerp(q[i-1][0],q[i][0],u),lerp(q[i-1][1],q[i][1],u)];}return q[q.length-1];}
function ws_question(ctx,p,a){if(p<=0||a<=0.01)return;withA(ctx,a,()=>{wc_pencil(ctx,ws_qPts(),clamp(p/0.88,0,1),{lw:6,seed:33,amp:1.2});
  const d=clamp((p-0.9)/0.1,0,1);if(d>0){ctx.fillStyle=rgba(WC_PENCIL,0.9*d);ctx.beginPath();ctx.arc(WS_QX,ws_cutY(0)+47,6.5,0,TAU);ctx.fill();}});}

scene("counted",(ctx,S,t,sc)=>{const c=sc.cues,P=ws_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{lift:c.answer+0.2,plan:[w("answer","housing"),w("answer","schools"),w("answer","transport")],tb:c.correct-0.3,link:w("correct","check"),
      reg:w("correct","town"),st:c.boycott-0.4,hl:c.stops-0.5,down:w("stops","stops"),tie:w("stops","stops",0.9),need:w("need","still",-0.1),q:w("need","without",-0.1),ct:c.rules-0.4,dec:w("rules","decides"),
      tbl:c.insig-0.4,slip:w("insig","computers"),slipBack:c.forbid+0.1,count:w("forbid","counting"),line:c.line+0.05,split:w("apart","kept"),rem:w("apart","removed"),
      th:c.back-0.2,arrow:w("back","given"),cross:w("back","don't"),y87:c.y1987-0.1,num:w("y1987","country"),priv:w("y1987","privacy"),one:c.one,two:c.another,betw:c.between-0.2,uni:w("between","university's"),
      morph:w("between","between"),title:c.breath+0.7};});
  const mk=[[0,"West Germany · 1983"],[P.ct,"Karlsruhe · 1983"],[P.tbl,"West Germany · 1983"],[P.y87,"West Germany · 1987"]];
  gv_shots(ctx,S,t,sc.dur,[
    // a town hall's register office: the census forms in bundles on the counter; the clerk lifts one, and the country's plans come off it
    {at:0,place:"hall83",keys:[[0,880,460,1.18],[0.2,860,425,1.28]],d:4.4,draw:(x,tt)=>{const lift=fin(tt,P.lift,0.6);
      ws_clerk(x,tt,{pose:"listen",pose2:"hold",mix:lift},lift>0.5);x.drawImage(gv_place("counter83"),0,0,W,H);ws_bundles(x,1-fin(tt,P.lift-0.5,0.4));
      ws_tagAt(x,tt,P.lift+0.6,null,590,480,"census form");
      // housing, schools, transport: each card lifts off the form and flies to the town's map
      P.plan.forEach((t0,k)=>{const u=clamp((tt-t0+0.15)/0.9,0,1);if(u<=0)return;const e=easeCam(u),[mx,my]=WS_PLAN[k],px=lerp(800,mx,e),py=lerp(585,my,e)-110*Math.sin(Math.PI*e);
        ws_planCard(x,k,px,py,lerp(0.4,0.6,e));});}},
    // the same law lets the town hall use the answers to check up on its residents, by name: the form beside a card from the register,
    // the names linked
    {at:P.tb,place:"table83",keys:[[P.tb,960,540,1],[P.tb+0.1,980,520,1.06]],d:3,draw:(x,tt)=>{ws_form(x,790,520,440,600,{rot:-0.03,ticks:true});ws_regCard(x,1250,400,360,220,0.04);
      wc_link(x,860,262,1170,314,WC_PENCIL,{p:fin(tt,P.link-0.1,0.8),lw:4,a:0.85});ws_tagAt(x,tt,P.tb+0.4,null,790,170,"census form");
      ws_tagAt(x,tt,P.reg-0.1,null,1250,236,"register of residents");}},
    // hundreds of groups call for a boycott: poster after poster goes up on the column; people stop to look
    {at:P.st,place:"street83",keys:[[P.st,960,560,1],[P.st+0.1,980,530,1.07]],d:3.2,draw:(x,tt)=>{const w=gv_walk(tt,P.st+0.2,180,640,280);
      WS_PST.forEach(([k,px,py,pw,ph],i)=>ws_poster(x,k,px,py,pw,ph,(tt-(c.boycott+0.15+0.6*i))/0.7));
      person(x,"ws_keeper",1560,944,0.74,{pose:"listen",t:tt,flip:true});person(x,"ws_pensioner",1265,950,0.76,{pose:"listen",t:tt,flip:true});
      gv_walker(x,"ws_student",w,952,0.77,{t:tt,pose:w.moving?null:"listen"});}},
    // two weeks before census day the court stops it: the form goes back on its bundle, and the bundle is tied again
    {at:P.hl,place:"hall83",keys:[[P.hl,860,425,1.28],[P.hl+0.1,850,425,1.32]],d:3,draw:(x,tt)=>{const down=fin(tt,P.down,0.6);
      ws_clerk(x,tt,{pose:"hold",pose2:"listen",mix:down,expr:tt>P.down?"concerned":"calm"},down<0.5);x.drawImage(gv_place("counter83"),0,0,W,H);ws_bundles(x,fin(tt,P.tie,0.6));
      ws_tagAt(x,tt,P.down+0.1,null,1110,150,"13 April 1983 · census stopped",{size:30});}},
    // the country still needs a way to count without knowing who said what: the form alone on the table, and the pencil asks it, in the
    // margin, level with the gap between the name and the answers
    {at:P.need,place:"table83",keys:[[P.need,960,540,1],[P.need+0.1,860,480,1.1]],d:2.4,draw:(x,tt)=>{const [fx,fy,fw,fh]=WS_F,q=fin(tt,P.q,1.1);
      ws_form(x,fx,fy,fw,fh,{ticks:true});ws_question(x,q,1);const [px,py]=ws_qAt(q);ws_pencil(x,px,py,gv_io(tt,P.q-0.35,P.q+1.4,0.25));}},
    // December: the court's judges at their bench, and the judgment's words over them
    {at:P.ct,place:"court",keys:[[P.ct,960,500,1.1],[P.ct+0.1,960,470,1.16]],d:4,draw:(x,tt)=>{const C=WS_CT;
      C.judges.forEach((jx,i)=>gv_behind(x,"ws_judge"+i,jx,C.top,C.s,{pose:"listen",t:tt+i*0.7,flip:jx>960}));x.drawImage(gv_place("bench"),0,0,W,H);
      ws_judgment(x,960,110,(tt-P.dec+0.2)/0.9);}},
    // the table: no answer is insignificant once answers are put together; counting is allowed; the court's line across the form; names
    // kept apart and removed, answers counted, and none sent back to the town hall; 1987, counted that way; then the line, between columns
    {at:P.tbl,place:"table83",keys:[[P.tbl,960,540,1],[P.slip+0.4,1040,520,1.04],[P.slipBack,1040,520,1.04],[P.line-0.6,960,440,1.2],[P.split+0.3,960,540,1],[P.uni,960,520,1.05]],d:1.8,push:0.02,draw:(x,tt)=>{
      const [fx,fy,fw,fh]=WS_F,y87=tt>=P.y87,gone=fin(tt,P.morph-0.2,0.8),nf=y87?easeCam(fin(tt,P.y87,0.8)):0;
      // the box, the shredder and the tally come when they're needed; the box opens for each strip
      const sp83=0.5*easeCam(fin(tt,P.split,0.6)),box83=fin(tt,P.split+0.6,1.3),shred83=clamp((tt-P.rem)/1.2,0,1);
      const sp87=0.5*easeCam(fin(tt,P.y87+1.6,0.5)),box87=fin(tt,P.y87+2.1,1.2),open=y87?gv_io(tt,P.y87+1.9,P.priv-0.3,0.4):gv_io(tt,P.split+0.3,P.rem+1.4,0.4);
      withA(x,fin(tt,P.split,0.5)*(1-gone),()=>ws_tinBox(x,WS_BOX[0],WS_BOX[1],open,y87?fin(tt,P.priv+0.2,0.5):0));
      const shr=gv_io(tt,P.rem-0.6,P.y87,0.5);if(shr>0.01)withA(x,shr,()=>ws_shredder(x,WS_SHR[0],WS_SHR[1],clamp((tt-P.rem-0.7)/1.4,0,1)));
      const tal=fin(tt,P.count-0.3,0.5)*(1-gone);if(tal>0.01)withA(x,tal,()=>ws_tally(x,WS_TAL[0],WS_TAL[1],clamp((tt-P.count)/0.8,0,1)*5+clamp((tt-P.num)/(P.priv-P.num-0.2),0,1)*20));
      // 1983's form: its answers lift off and come back; the line; the strip to the box, then to the shredder; the answers stay, counted
      if(nf<1){ws_form(x,fx,fy,fw,fh,{cut:true,ticks:true});if(sp83<=0)ws_line(x,[fx-fw/2-30,ws_cutY(0)],[fx+fw/2+30,ws_cutY(0)],fin(tt,P.line,0.9));
        else if(!y87)ws_line(x,[fx-fw/2-30,ws_cutY(sp83)],[fx+fw/2+30,ws_cutY(sp83)],1);}
      if(!y87)ws_stripWay(x,sp83,box83,shred83);
      // the question asked before the court ruled, until the line answers it
      ws_question(x,1,1-fin(tt,P.line-0.2,0.4));
      ws_townHall(x,gv_io(tt,P.th,P.y87,0.4),fin(tt,P.arrow,0.7),fin(tt,P.cross,0.5));
      // 1987: a new form slides in over the old, the same line, the same split, its strip into the box; the country gets its numbers, the
      // tally filling, and people keep their privacy, the box shut and locked
      if(y87){const dy=(1-nf)*760,fade=1-fin(tt,P.morph+0.6,0.9);
        if(fade>0.01)withA(x,fade,()=>{x.save();x.translate(0,dy);ws_form(x,fx,fy,fw,fh,{cut:true,ticks:true});if(box87<=0)ws_stripWay(x,sp87,0,0);x.restore();});
        if(box87>0&&(box87<1||open>0.5))ws_stripWay(x,0.5,box87,0);
        const lp=fin(tt,P.y87+0.9,0.6);if(lp>0&&nf>=1){const [a,b]=gone>0?ws_lineAt(fin(tt,P.morph,1.6),[fx,fy-sp87*fh*0.12,fw,fh]):[[fx-fw/2-30,ws_cutY(sp87)],[fx+fw/2+30,ws_cutY(sp87)]];ws_line(x,a,b,lp);}
        ws_colsTable(x,fin(tt,P.morph+0.4,1.0),0);
        if(gone>0){const [a,b]=ws_lineAt(fin(tt,P.morph,1.6),[fx,fy-sp87*fh*0.12,fw,fh]);if(fin(tt,P.morph+0.4,1.0)>0)ws_line(x,a,b,1);}}
      // the four answers, put together, are someone
      const su=clamp((tt-P.slip)/1.3,0,1)*(1-clamp((tt-P.slipBack)/1.0,0,1));ws_slipsMove(x,su,clamp((tt-P.slip-1.1)/0.7,0,1)*(1-fin(tt,P.slipBack,0.5)));
      ws_pencil(x,lerp(fx-fw/2-30,fx+fw/2+30,easeCam(fin(tt,P.line,0.9))),ws_cutY(0),gv_io(tt,P.line-0.4,P.line+1.3,0.3));
      ws_pencil(x,lerp(fx-fw/2-30,fx+fw/2+30,easeCam(fin(tt,P.y87+0.9,0.6))),ws_cutY(0),gv_io(tt,P.y87+0.6,P.y87+1.7,0.25));
      ws_tagAt(x,tt,P.one+0.1,P.betw,WS_TAL[0]+180,WS_TAL[1]-40,"counting",{size:32});ws_tagAt(x,tt,P.two+0.1,P.betw,WS_BOX[0],WS_BOX[1]+150,"knowing who",{size:32});}}]);
  ws_pill(ctx,t,mk,fin(t,0.6,0.5)*(1-fin(t,P.betw,0.5)));
  gv_title(ctx,S,t,P.title,"Who may see it","classify once, protect it everywhere","Film 4 of 19 · data governance");
  wc_paperOver(ctx,S);});


/* ---- today: the people, where they are ---- */
// the floor of offices: who is in which, and what they're doing; the glass over them, and the offices' names as far as they're in view
const WS_AT={clara:0,mei:1,yusuf:2,jun:3,sam:4};
function ws_floor(x,tt,o){o=o||{};const F=GV_FL;Object.keys(WS_AT).forEach(id=>{const i=WS_AT[id];if((o.out||[]).includes(id))return;
    person(x,id,F.spot(i),806,0.5,Object.assign({pose:"listen",t:tt+i,flip:i%2===1},(o.pose||{})[id]||{}));});
  if(o.under)o.under(x);gv_floorGlass(x);const m=x.getTransform(),vl=-m.e/m.a,vr=(x.canvas.width-m.e)/m.a,a=o.names==null?1:o.names;
  F.rooms.forEach((r,i)=>{const cx=F.x(i)+F.w/2,hw=tw(x,r[1],30,800)/2+6;gv_floorName(x,i,a*clamp(Math.min(cx-hw-vl,vr-cx-hw)/30,0,1));});}
// someone at a desk close up, seated behind its front layer: Mei at the registrar's, Sam at the platform team's
const ws_mei=(x,tt,o)=>gv_behind(x,"mei",GV_RX.seat[0],GV_RX.top,GV_RX.seat[1],Object.assign({pose:"listen",t:tt},o||{}));
const ws_sam=(x,tt,o)=>gv_behind(x,"sam",GV_PX.seat[0],GV_PX.top,GV_PX.seat[1],Object.assign({pose:"listen",t:tt},o||{}));
// a table on a screen, too small to read: a header, then n rows of values in four columns
function ws_gridRows(x,sx,sy,sw,n){x.save();for(let r=0;r<=n;r++)for(let k=0;k<4;k++){x.fillStyle=rgba(r?[150,150,166]:[90,96,120],r?0.55:0.8);
  x.fillRect(sx+k*sw/4,sy+r*34,(sw/4-28)*(r?0.5+0.45*hash(r*4+k,5):0.8),r?7:9);}x.restore();}
// what the registrar's screen shows at her desk, small: a title and lines nobody needs to read
function ws_regScreen(x,title,a){const [sx,sy,sw,sh]=GV_RX.screen;gv_screen(x,sx,sy,sw,sh,title,null,{barH:44,titleSize:28});withA(x,a==null?1:a,()=>gv_lines(x,sx+30,sy+90,sw-80,6,36,0.8));}
// Planning's wall screen, as Clara reads the learner table there: the code, the stars, the status
function ws_planScreen(x,pulse){const [sx,sy,sw,sh]=GV_PL.screen;gv_screen(x,sx,sy,sw,sh,"learner table",null,{barH:46,titleSize:28});
  [[30,"learner code"],[270,"name"],[500,"status"]].forEach(([cx,s2])=>wc_T(x,s2,sx+cx,sy+92,{w:600,size:28,col:WC_MUTED}));
  WS_LT.slice(0,3).forEach(([k,st],i)=>{const y=sy+160+i*70;wc_T(x,k,sx+30,y,{w:500,size:28,f:"mono",col:WC_INK});gv_mask(x,sx+270,y-34,190,48,1,{size:28});wc_T(x,st,sx+500,y,{w:600,size:28,col:WC_INK});});
  if(pulse>0.01){x.save();x.globalCompositeOperation="screen";wc_glowAt(x,sx+365,sy+230,200,[255,200,240],0.3*pulse);x.restore();}}
// Clara's plan for next term on Planning's wall screen: places by faculty, as bars (the film doesn't need the numbers), on the right of
// the screen, where Clara standing in front of it doesn't hide them
function ws_planChart(x){const [sx,sy,sw,sh]=GV_PL.screen;gv_screen(x,sx,sy,sw,sh,"next term · places",null,{barH:46,titleSize:28});
  ["AED","BUS","EIT","HLT"].forEach((f,i)=>{const bx=sx+250+i*112,bh=[110,160,200,130][i];x.fillStyle=rgba([140,176,210],0.95);x.fillRect(bx,sy+sh-74-bh,72,bh);
    wc_T(x,f,bx+36,sy+sh-30,{w:500,size:28,f:"mono",align:"center",col:WC_MUTED});});}
// a speech bubble that springs in at t0 and goes at t1
function ws_say(x,tt,t0,t1,bx,by,lines,tx,ty,o){gv_say(x,bx,by,lines,tx,ty,Object.assign({a:gv_io(tt,t0,t1,0.35),k:0.92+0.08*spring(fin(tt,t0,0.5)),size:32},o||{}));}

// ---- 2 · The census list: Planning counts without names; Clara needs to know who is still studying ----
scene("census",(ctx,S,t,sc)=>{const c=sc.cues,P=ws_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{none:w("counts","no names"),clara:w("term","Clara"),still:w("term","still"),card:c.status-0.2,stat:w("status","status")};});
  gv_shots(ctx,S,t,sc.dur,[
    // Planning's office: the list of learners near an award on the wall screen, with no column for a name; Clara, and what she wants to know
    {at:0,place:"planning",keys:[[0,900,470,1.08],[c.counts-0.6,910,390,1.4],[c.term-0.4,860,470,1.1]],d:2.2,draw:(x,tt)=>{ws_nearList(x,clamp((tt-P.none+0.2)/1.4,0,1));
      ws_ltCard(x,110,120,fin(tt,P.card,0.6),fin(tt,P.stat,0.7));
      person(x,"clara",440,905,0.8,{pose:"listen",pose2:"point",mix:gv_io(tt,P.still-0.3,c.status+0.4,0.45),t:tt});
      ws_sticky(x,1380,262,["still","studying?"],{rot:0.05,a:fin(tt,P.still,0.35),k:0.94+0.06*spring(fin(tt,P.still,0.5)),p:fin(tt,P.still+0.2,1.0),col:0});
      ws_nameCard(x,560,620,"Clara Jensen","Planning",gv_io(tt,P.clara,c.status-0.4,0.4));}}]);
  wc_year(ctx,56,72,"Today",fin(t,0.3,0.5)*(1-fin(t,c.counts,0.4)));
  wc_paperOver(ctx,S);});

// ---- 3 · The old path: a policy that says what, not which or how; a form, an email, a whole table, and no end ----
// the old path's things on the desk, in the order they came: the form, the approval, the calendar, the printout, the key with her name
const WS_OLD={form:[420,350,-0.05],mail:[820,300,0.04],cal:[1590,280],print:[220,610],key:[1150,470,0.12]};
// the calendar's pages: three weeks of March, then the months that went by with nothing ended
const WS_MONTHS=[["March","3"],["March","10"],["March","17"],["March","24"],["June","24"],["September","24"],["December","24"],["March","24"],["June","24"]];
scene("path",(ctx,S,t,sc)=>{const c=sc.cues,P=ws_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{take:c.binder+0.3,desk:c.policy-0.3,which:w("which","which"),how:w("which","how"),mem:c.until-0.1,later:c.weeks,whole:w("weeks","whole"),
      grant:w("weeks","granted"),ended:w("ended","ended"),plat:c.checks-0.4,list:w("checks","today")-0.3,forty:w("checks","forty"),nine:c.nine,back:c.nobody-0.4,noend:c.noend};});
  gv_shots(ctx,S,t,sc.dur,[
    // his office: Yusuf takes the next binder off the shelf, its label the film's title; the newest DMBOK stands on his desk, as in every film
    {at:0,place:"office",keys:[[0,1250,560,1.3],[0.2,1270,540,1.36]],d:3,draw:(x,tt)=>{const out=fin(tt,P.take,0.5),has=tt>=P.take+0.55;
      ws_binders(x,{out,taken:has});gv_deskBook(x);
      person(x,"yusuf",1370,905,0.8,{pose:has?"hold":"listen",pose2:has?null:"reach",mix:has?0:gv_io(tt,P.take-0.5,P.take+0.6,0.4),t:tt,carry:has?ws_heldTitled(["Who may","see it"],ws_bindCol(5)):null});
      ws_nameCard(x,700,390,"Yusuf Demir","data governance lead",gv_io(tt,0.5,P.desk-0.3,0.4));}},
    // the binder open on his desk: policy 6, what it says; and what it doesn't
    {at:P.desk,place:"desk",keys:[[P.desk,1152,432,1.25],[P.mem,960,540,1]],d:2.4,draw:(x,tt)=>{ws_openBinder(x,1);
      gv_qmark(x,1205,300,46,fin(tt,P.which,0.6));gv_qmark(x,1372,418,46,fin(tt,P.how,0.6));
      // until now: the colours of a memory, and the old path's papers over the binder, one after another
      const m=fin(tt,P.mem,0.8);ws_memory(x,m);if(m<=0.01)return;const O=WS_OLD,slide=(t0,dy)=>[easeCam(fin(tt,t0,0.6)),(1-easeCam(fin(tt,t0,0.6)))*dy];
      let [u,dy]=slide(c.form,90);ws_reqForm(x,O.form[0],O.form[1]+dy,O.form[2],u);[u,dy]=slide(c.approval,90);ws_emailPrint(x,O.mail[0],O.mail[1]+dy,O.mail[2],u);
      // three weeks of March, then month after month
      const ca=fin(tt,P.later-0.3,0.5);if(ca>0.01){const f=clamp((tt-P.later)/1.2,0,3)+clamp((tt-P.ended)/1.8,0,5),i=Math.min(WS_MONTHS.length-2,Math.floor(f)),fl=Math.min(1,f-i);
        withA(x,ca,()=>ws_calendar(x,O.cal[0],O.cal[1],WS_MONTHS[i],WS_MONTHS[i+1],i>=WS_MONTHS.length-2?0:fl));}
      ws_printout(x,O.print[0],O.print[1],(tt-P.whole+0.2)/1.4,1);ws_keyTag(x,O.key[0],O.key[1]+(1-easeCam(fin(tt,P.grant,0.6)))*-60,O.key[2],"Clara Jensen",fin(tt,P.grant,0.5));}},
    // the platform team's desk: Yusuf asks Sam who can read the learner table today
    {at:P.plat,place:"platform",keys:[[P.plat,1000,540,1],[P.plat+0.1,1040,520,1.06]],d:2.6,draw:(x,tt)=>{
      gv_behind(x,"yusuf",1790,GV_PX.top,1.55,{standing:true,pose:"listen",t:tt,flip:true});ws_sam(x,tt,{pose:"write"});x.drawImage(gv_place("platformDesk"),0,0,W,H);
      const [sx,sy,sw,sh]=GV_PX.screens[0];gv_screen(x,sx,sy,sw,sh,"who can read",null,{barH:44,titleSize:28});gv_lines(x,sx+30,sy+90,sw-120,6,34,0.8);
      const [rx,ry,rw,rh]=GV_PX.screens[1];gv_screen(x,rx,ry,rw,rh,"learner table",null,{barH:44,titleSize:28});ws_gridRows(x,rx+30,ry+84,rw-60,6);
      ws_nameCard(x,1000,676,"Sam Okafor","platform team",gv_io(tt,P.plat+0.4,P.list-0.2,0.4));}},
    // Sam's screen, close: forty-one names, and nine of them gone to other jobs
    {at:P.list,place:"screenPlat",keys:[[P.list,960,440,1.04],[P.list+0.1,960,430,1.08]],d:4,push:0.01,draw:(x,tt)=>ws_whoList(x,clamp((tt-P.forty+0.3)/1.6,0,1),fin(tt,P.nine+0.3,0.8),0,false)},
    // back at the desk: nobody did anything wrong; the path just had no end
    {at:P.back,place:"platform",keys:[[P.back,1040,520,1.06],[P.back+0.1,1060,520,1.1]],d:3,draw:(x,tt)=>{
      gv_behind(x,"yusuf",1790,GV_PX.top,1.55,{standing:true,pose:"listen",pose2:"explain",mix:gv_io(tt,P.noend-0.2,P.noend+1.6,0.4),t:tt,flip:true});
      ws_sam(x,tt,{pose:"listen",pose2:"ws_shrugSeat",mix:gv_io(tt,c.nobody+0.2,c.nobody+1.8,0.4)});x.drawImage(gv_place("platformDesk"),0,0,W,H);
      const [sx,sy,sw,sh]=GV_PX.screens[0];gv_screen(x,sx,sy,sw,sh,"who can read",null,{barH:44,titleSize:28});gv_lines(x,sx+30,sy+90,sw-120,6,34,0.8);
      const [rx,ry,rw,rh]=GV_PX.screens[1];gv_screen(x,rx,ry,rw,rh,"learner table",null,{barH:44,titleSize:28});ws_gridRows(x,rx+30,ry+84,rw-60,6);}}]);
  wc_year(ctx,56,72,"until now",gv_io(t,P.mem+0.3,P.plat,0.4));
  wc_paperOver(ctx,S);});

// ---- 4 · At the column: every column other teams read carries a class, which its owner writes in a register; a change that leaves
// one empty goes back to its owner, with a question ----
// where the register lies shut on Mei's desk, seen from the front: its left edge, its foot, its width
const WS_RGF=[400,804,420];
// the register's row lit gold while its class lands: the latest chip in, for a second and a half. Returns [row, how lit]
function ws_chipHi(tt,ts){let i=-1;ts.forEach((t0,k)=>{if(tt>=t0-0.1&&(i<0||t0>ts[i]))i=k;});return i<0?[null,0]:[i,fin(tt,ts[i]-0.1,0.3)*(1-fin(tt,ts[i]+1.4,0.4))];}
scene("column",(ctx,S,t,sc)=>{const c=sc.cues,P=ws_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{top:c.class-1.6,open:c.class+0.4,head:w("class","a class"),chip:[w("pseudo","Pseudonymous"),w("direct","identifies"),w("direct","name"),w("direct","email"),w("none","none")],
      init:w("register","writes"),every:w("checked","every"),no:w("checked","no class"),goes:w("checked","goes"),ask:w("checked","with a"),held:c.reached-0.4,
      codes:c.looks-0.45,most:w("looks","most"),id:w("holds","student"),ring:c.nothing,classed:w("mei","classed"),page:w("mei","drawn")-0.1,line:w("mei","drawn")+0.3};});
  gv_shots(ctx,S,t,sc.dur,[
    // the registrar's office: Mei at her desk, the register shut in front of her, the learner table on her screen
    {at:0,place:"registrar",keys:[[0,900,540,1],[0.1,940,520,1.06]],d:3,draw:(x,tt)=>{ws_mei(x,tt);x.drawImage(gv_place("registrarDesk"),0,0,W,H);ws_regFlat(x,...WS_RGF);
      ws_regScreen(x,"learner table");ws_nameCard(x,830,560,"Mei Tanaka","registrar's office",gv_io(tt,0.5,P.top-0.3,0.4));}},
    // the register on her desk, from above: its cover opens on the learner table's page; each column's class lands as it's said, and she
    // initials the page. Then a change comes back to her on the series' sign-off sheet: its class empty, with a question
    {at:P.top,place:"regTop",keys:[[P.top,960,540,1],[P.open,960,520,1.12]],d:1.6,draw:(x,tt)=>{const [hi,hiA]=ws_chipHi(tt,P.chip),fp=fin(tt,P.init,1.4),open=fin(tt,P.open,1.4);
      // the page is drawn once the cover starts to open, and its words give way as the sheet comes over it (the paper under them stays)
      if(open>0){const g=fin(tt,P.every,0.5);if(g>0)gv_sheet(x,WS_RG.x,WS_RG.y,WS_RG.w,WS_RG.h);withA(x,1-0.65*g,()=>{
        const r=ws_regPage(x,"learner table",WS_RGL,{chips:i=>fin(tt,P.chip[i],0.5),hi,hiA,foot:"classed by Mei Tanaka",footP:fp});
        gv_tint(x,r.cols[2]+4,WS_RG.y+160,WS_RG.x+952-r.cols[2]-8,46,WS_HI,0.7*gv_io(tt,P.head-0.1,P.chip[1]-0.3,0.3));});}
      ws_regCover(x,open);
      const [px,py]=ws_penAt(x,"classed by Mei Tanaka",WS_RG.x+56,WS_RG.y+GV_REG.head+22+GV_REG.row*WS_RGL.length+64,32,fp);ws_pen(x,px,py,gv_io(tt,P.init-0.4,P.init+1.6,0.3));
      const u=fin(tt,P.every,0.9);if(u>0)ws_sheet(x,lerp(1980,480,easeCam(u)),226,{p:fin(tt,P.every+0.4,1.2),missA:fin(tt,P.no,0.4),sent:fin(tt,P.goes,0.4),askP:fin(tt,P.ask,1.2)});}},
    // Mei at her desk, the sheet in her hands
    {at:P.held,place:"registrar",keys:[[P.held,940,520,1.06],[P.held+0.1,880,520,1.12]],d:2.4,draw:(x,tt)=>{
      ws_mei(x,tt,{pose:"hold",expr:tt>P.held+1.2?"concerned":"calm",carry:ws_heldSheet});x.drawImage(gv_place("registrarDesk"),0,0,W,H);ws_regFlat(x,...WS_RGF);ws_regScreen(x,"learner table");}},
    // on her desk: the sheet, and a card of three credentials and their codes. Most are only codes; an award's holds the student number;
    // a pencil ring round it. She classes it direct, signs, and it's stamped
    {at:P.codes,place:"regTop",keys:[[P.codes,960,540,1],[P.codes+0.1,980,520,1.04]],d:2.4,draw:(x,tt)=>{const sp=fin(tt,P.classed+0.4,0.7);
      const r=ws_sheet(x,110,200,{sent:1,chip:fin(tt,P.classed,0.5),signP:sp,ok:fin(tt,P.classed+1.15,0.35)});
      const kx=lerp(1980,1180,easeCam(fin(tt,P.codes+0.15,0.8))),ky=250,rp=fin(tt,P.ring,0.9);ws_codes(x,kx,ky,{ticks:i=>fin(tt,P.most+0.3*i,0.4),id:fin(tt,P.id,0.6),ring:rp});
      const [qx,qy]=ws_ringAt(...ws_codeRing(x,kx,ky),rp);ws_pencil(x,qx,qy,gv_io(tt,P.ring-0.3,P.ring+1.2,0.3));
      const [px,py]=ws_penAt(x,"Mei Tanaka",r.sign[0],r.sign[1],38,sp);ws_pen(x,px,py,gv_io(tt,P.classed+0.15,P.classed+1.2,0.25));}},
    // the register again, open at the credentials table's page: the code and its class; and under its row, the court's line, drawn in
    // pencil across the page as 1983's was drawn across the form
    {at:P.page,place:"regTop",keys:[[P.page,960,520,1.12],[P.page+0.1,940,540,1.2]],d:2,draw:(x,tt)=>{ws_regLeft(x,true);
      const r=ws_regPage(x,"credentials table",WS_RGCR,{chips:i=>i===2?fin(tt,P.page+0.3,0.5):1,foot:"classed by Mei Tanaka"});
      const ly=r.rows[2]+GV_REG.row/2+12,x0=WS_RG.x+30,x1=WS_RG.x+970,lp=fin(tt,P.line,1.0);ws_line(x,[x0,ly],[x1,ly],lp,5);ws_pencil(x,lerp(x0,x1,lp),ly,gv_io(tt,P.line-0.3,P.line+1.3,0.3));}}]);
  wc_paperOver(ctx,S);});

// ---- 5 · The mask follows: the class travels with its column as a label, and one rule reads the label ----
// the data team's board: the systems, the learner table, what's built from it. o: the label on the learner table's and the wallet's
// email (lt, wal) and the masks over them (ltM, walM), each 0 to 1; the near-award list lit (near); the card built tomorrow (tom: its
// card, string, label and mask, each 0 to 1)
function ws_board(x,o){const B=WS_BD,lt=ws_bdAnchor(B.lt,-1),ltR=ws_bdAnchor(B.lt,1),T=o.tom||{};
  B.src.forEach(s=>{ws_srcCard(x,s);ws_string(x,ws_bdAnchor(s,1),lt,1);});
  ws_string(x,ltR,ws_bdAnchor(B.wal,-1),1);ws_string(x,ltR,ws_bdAnchor(B.near,-1),1);if(T.str>0)ws_string(x,ltR,ws_bdAnchor(B.tom,-1),T.str);
  ws_bdCard(x,B.lt,{label:r=>r===1?o.lt||0:0,mask:r=>r===1?o.ltM||0:0});ws_bdCard(x,B.wal,{label:r=>r===1?o.wal||0:0,mask:r=>r===1?o.walM||0:0});
  ws_bdCard(x,B.near);if(o.near>0.01)gv_tint(x,B.near.x+8,B.near.y+8,B.near.w-16,ws_bdH(B.near)-16,WS_HI,0.5*o.near);
  if(T.a>0.01){x.save();x.translate(0,(1-easeCam(T.a))*-40);withA(x,clamp(T.a*2,0,1),()=>ws_bdCard(x,B.tom,{label:r=>r===1?T.label||0:0,mask:r=>r===1?T.mask||0:0}));x.restore();}}
scene("mask",(ctx,S,t,sc)=>{const c=sc.cues,P=ws_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{lift:w("stay","stay"),board:c.travels-0.4,tie:w("travels","label"),every:w("travels","every"),plat:c.rule-0.3,one:w("rule","one"),stars:w("rule","stars"),
      board2:c.bylabel-0.3,by:w("bylabel","by"),tom:w("every","tables")-0.2,near:sc.ends.every+0.6};});
  const B=WS_BD;
  gv_shots(ctx,S,t,sc.dur,[
    // the register, as chapter 4 left it: a label lifts off the email's class, which stays where it is, and goes
    {at:0,place:"regTop",keys:[[0,960,520,1.12],[0.1,980,520,1.14]],d:2,draw:(x,tt)=>{ws_regLeft(x);const r=ws_regPage(x,"learner table",WS_RGL,{foot:"classed by Mei Tanaka"});
      const u=clamp((tt-P.lift+0.2)/1.6,0,1);if(u<=0||u>=1)return;const x0=r.cols[2]+28,y0=r.rows[3],a1=easeCam(clamp(u/0.35,0,1)),b=Math.pow(clamp((u-0.35)/0.65,0,1),2);
      ws_label(x,lerp(x0,x0+170,a1)+(2160-x0-170)*b,lerp(y0,y0-6,a1)-90*b,{a:clamp(u*5,0,1),rot:-0.03*a1+0.06*b,k:lerp(1,1.1,a1)});}},
    // the data team's board: the label comes in from the left and ties on to the learner table's email; it runs along the string to the
    // wallet, built from it, and ties on there too
    {at:P.board,place:"boardData",keys:[[P.board,960,540,1]],d:2,push:0.01,draw:(x,tt)=>{ws_board(x,{lt:fin(tt,P.tie,1.0),wal:fin(tt,P.every+0.9,1.0)});
      const u=clamp((tt-P.tie+1.6)/1.6,0,1);if(u>0&&u<1){const [hx,hy]=ws_bdTie(x,B.lt,1),e=easeCam(u);ws_label(x,lerp(-180,hx,e),lerp(hy-240,hy,e)-70*Math.sin(Math.PI*e),{rot:0.25*(1-e)});}
      ws_bead(x,ws_bdAnchor(B.lt,1),ws_bdAnchor(B.wal,-1),(tt-P.every)/0.9,WS_DIRECT,11);}},
    // the platform team's desk: Sam pins the one rule up over it, and its band of stars slides in. He's mirrored, so the arm that goes up
    // and comes down swings over the screens, not out of the frame
    {at:P.plat,place:"platform",keys:[[P.plat,1000,540,1],[P.plat+0.1,1010,520,1.05]],d:2.4,draw:(x,tt)=>{const u=fin(tt,P.one-0.3,0.3);
      if(u>0){x.save();const k=lerp(0.96,1,u),{x:rx,y:ry,w:rw,h:rh}=WS_RC;x.translate(rx+rw/2,ry+rh/2);x.scale(k,k);x.translate(-rx-rw/2,-ry-rh/2);ws_ruleCard(x,fin(tt,P.stars,0.8),u);x.restore();}
      ws_sam(x,tt,{pose:"listen",pose2:"ws_pinUp",mix:gv_io(tt,P.one-0.7,P.one+0.9,0.45),flip:true});x.drawImage(gv_place("platformDesk"),0,0,W,H);
      const [sx,sy,sw,sh]=GV_PX.screens[0];gv_screen(x,sx,sy,sw,sh,"learner table",null,{barH:44,titleSize:28});ws_gridRows(x,sx+30,sy+84,sw-60,6);
      const [rx,ry,rw,rh]=GV_PX.screens[1];gv_screen(x,rx,ry,rw,rh,"wallet",null,{barH:44,titleSize:28});ws_gridRows(x,rx+30,ry+84,rw-60,6);}},
    // the board again: the masks slide over both labelled emails at once. A card built tomorrow: its string, the label along it, its
    // email masked. The near-award list had no email, and nothing to mask
    {at:P.board2,place:"boardData",keys:[[P.board2,960,540,1]],d:2,push:0.01,draw:(x,tt)=>{const m=fin(tt,P.by,0.8);
      ws_board(x,{lt:1,wal:1,ltM:m,walM:m,near:fin(tt,P.near,0.6),tom:{a:fin(tt,P.tom,0.5),str:clamp((tt-P.tom-0.2)/0.6,0,1),label:fin(tt,P.tom+1.3,1.0),mask:fin(tt,P.tom+1.6,0.8)}});
      ws_bead(x,ws_bdAnchor(B.lt,1),ws_bdAnchor(B.tom,-1),(tt-P.tom-0.4)/0.9,WS_DIRECT,11);}}]);
  wc_paperOver(ctx,S);});

// ---- 6 · A purpose and a date: the owner says yes, for a purpose, to a group, until a date; even codes are still personal data ----
scene("purpose",(ctx,S,t,sc)=>{const c=sc.cues,P=ws_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{req:w("goes","request"),form:c.yes-0.45,yes:w("yes","yes"),pl:w("yes","to plan"),until:w("yes","until"),fl:c.group-0.3,grp:w("group","a Planning"),ends:w("group","ends"),
      scr:c.sees-0.3,code:w("sees","code"),stars:w("stars","stars"),desk:c.code-0.3,list:w("list","registrar's"),leads:w("list","leads"),still:w("personal","still"),
      end:w("personal","end date"),agent:c.agent-0.3,ag:w("agent","agent")};});
  const F=GV_FL,cardTo=[F.x(0)+F.w/2,F.top+250];
  gv_shots(ctx,S,t,sc.dur,[
    // the registrar's office: Clara's request comes to the table's owner, on the university's form
    {at:0,place:"registrar",keys:[[0,960,540,1],[0.1,980,520,1.06]],d:3,draw:(x,tt)=>{const h=fin(tt,P.req-0.3,0.6);
      ws_mei(x,tt,{pose:"listen",pose2:"hold",mix:h,carry:h>0.5?ws_heldReq:null});x.drawImage(gv_place("registrarDesk"),0,0,W,H);ws_regFlat(x,...WS_RGF);ws_regScreen(x,"learner table");}},
    // on her desk, the request close: her yes, for her office; what for, and until when
    {at:P.form,place:"regTop",keys:[[P.form,960,540,1],[P.form+0.1,960,560,1.04]],d:2.4,draw:(x,tt)=>{const X=460,Y=170,ok=fin(tt,P.yes,1.6);
      ws_reqPaper(x,X,Y,{ok,hi:i=>i===1?gv_io(tt,P.pl-0.1,P.until-0.1,0.3):i===2?gv_io(tt,P.until-0.1,P.fl+0.5,0.3):0});
      const [px,py]=ws_penAt(x,"Mei Tanaka",X+144,Y+648,38,clamp(ok*2-1,0,1));ws_pen(x,px,py,gv_io(tt,P.yes+0.6,P.yes+1.75,0.25),0.25);}},
    // the floor: the access goes to Planning's group, not to Clara by name, and ends on its date by itself
    {at:P.fl,place:"floor",keys:[[P.fl,738,480,1.3],[P.fl+0.1,730,480,1.32]],d:4,push:0,draw:(x,tt)=>{ws_floor(x,tt,{out:["yusuf"],pose:{mei:{pose:"listen",pose2:"point",mix:gv_io(tt,P.grp-0.6,P.grp+0.6,0.4),flip:true}}});
      const u=fin(tt,P.grp-0.2,1.0),e=easeCam(u),from=[F.x(1)+F.w/2,F.top+300];if(u<=0)return;
      ws_accessCard(x,lerp(from[0],cardTo[0],e),lerp(from[1],cardTo[1],e)-90*Math.sin(Math.PI*e),{rot:lerp(0.08,-0.03,e),pin:u>=1,glow:fin(tt,P.ends,0.6)});}},
    // Clara's screen: the code and status as they are, student numbers, names and emails as stars
    {at:P.scr,place:"screenPlan",keys:[[P.scr,960,440,1.04],[P.scr+0.1,960,430,1.07]],d:4,push:0.01,draw:(x,tt)=>ws_maskTable(x,{rows:6,hi:gv_io(tt,P.code-0.2,P.stars,0.3),pulse:gv_io(tt,P.stars,P.desk,0.4)})},
    // his desk: a learner code on a slip names no one, close; the camera draws back as the registrar's list comes in beside it and leads
    // back to a person. So a code is still personal data, and comes with a purpose and an end date
    {at:P.desk,place:"desk",keys:[[P.desk,565,400,1.7],[P.list-0.6,980,520,1.04]],d:1.6,draw:(x,tt)=>{const lk=fin(tt,P.leads,0.8),u=fin(tt,P.list-0.2,0.8);
      wc_T(x,"learner code",360,300,{w:600,size:30,align:"center",col:WC_MUTED});ws_slip(x,360,370,"0905e6e2…",{size:40,glow:gv_io(tt,P.leads+0.6,P.agent,0.3)});
      if(u>0){x.save();x.translate((1-easeCam(u))*1300,0);ws_regList(x,700,260,{hi:fin(tt,P.leads+0.6,0.5)});x.restore();}
      if(lk>0)wc_link(x,514,370,728,ws_rlRow(260,2)-12,WC_PENCIL,{p:lk,lw:4,a:0.85*(1-fin(tt,P.agent-0.4,0.4))});
      ws_tagAt(x,tt,P.still,P.agent,960,800,"pseudonymous: still personal data",{size:30,wash:WS_PSEUDO,washA:0.4});
      ws_accessCard(x,1720,190,{rot:0.03,a:fin(tt,P.still+0.4,0.5),glow:fin(tt,P.end,0.6)});}},
    // the data team's screen: their agent reads stars too, and works from counts and samples
    {at:P.agent,place:"screen",keys:[[P.agent,960,440,1.04],[P.agent+0.1,960,450,1.07]],d:4,push:0.01,draw:(x,tt)=>{ws_maskTable(x,{title:"learner table, as the agent reads it"});
      const [X,Y]=GV_SC;ws_agentCard(x,X+50,Y+556,fin(tt,P.ag,0.5));}}]);
  wc_paperOver(ctx,S);});

// ---- 7 · Why the stars: Yusuf tells Clara why, and the way to more ----
scene("stars",(ctx,S,t,sc)=>{const c=sc.cues,P=ws_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{ask:c.asks,why:w("why","why"),yb:w("why","Planning",-0.2),more:w("more","the way"),fl:c.no-0.3,copied:w("no","copied")};});
  gv_shots(ctx,S,t,sc.dur,[
    // Planning: Clara asks why the names are stars; Yusuf tells her why, and shows her the way to more
    {at:0,place:"planning",keys:[[0,960,500,1.08],[0.1,960,490,1.1]],d:4,draw:(x,tt)=>{ws_planScreen(x,gv_io(tt,P.ask+1.0,c.why,0.4));
      person(x,"clara",440,905,0.8,{pose:"point",pose2:"listen",mix:fin(tt,c.why,0.6),t:tt});
      person(x,"yusuf",1320,905,0.8,{pose:"listen",pose2:"explain",mix:gv_io(tt,P.why-0.3,P.fl,0.5),t:tt,flip:true});
      ws_say(x,tt,P.ask+0.6,P.yb,90,250,["Why stars?"],420,468);
      ws_say(x,tt,P.yb,P.more-0.2,1236,128,["Planning counts learners.","It doesn't need to know who they are."],1320,466,{size:28});
      const n=fin(tt,P.more,0.45);if(n>0.01){x.save();x.translate(0,14*(1-n));withA(x,n,()=>gv_card(x,1236,124,560,196,["Need names?","Ask the registrar's office,","and say what for."],{size:30,wash:GV.gold,washA:0.18,pin:true}));x.restore();}}},
    // the floor: a no without a way forward, and the table copied into spreadsheets, office after office
    {at:P.fl,place:"floor",keys:[[P.fl,960,540,1],[P.fl+0.1,960,530,1.02]],d:4,push:0.01,draw:(x,tt)=>{ws_floor(x,tt,{under:x=>{
      [[0,0.0],[3,0.35],[4,0.6],[1,0.85],[0,1.1],[3,1.3],[4,1.5],[1,1.7]].forEach(([r,dt],k)=>{const u=fin(tt,P.copied-0.2+dt,0.35)*(1-fin(tt,sc.dur-1.4,0.8));if(u<=0.01)return;
        const F=GV_FL,cx=F.x(r)+70+((k*97)%190),cy=F.top+190+((k*53)%160);x.save();x.translate(cx,cy);x.rotate(((k*37)%11-5)*0.012);x.scale(0.8+0.2*spring(u),0.8+0.2*spring(u));
        withA(x,u,()=>x.drawImage(ws_copyC(),-85,-105));x.restore();});}});}}]);
  wc_paperOver(ctx,S);});

// ---- 8 · Read from the access list: the plan goes out, the access ends on its date, the review reads the access list itself, and
// binder 6 now says which data, how, and who decides and who acts ----
// Clara's plan for next term, on a clipboard in her hands, before it goes in the faculties' tray: held low, below her chin, so her face
// shows (the series' held board is big enough to hide it at this size)
function ws_heldPlan(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2,w=190,h=210;cx.save();cx.translate(mx,my+30);
  cx.fillStyle=rgba(GV_HOLD.walnut,1);rr(cx,-w/2,-h/2,w,h,10);cx.fill();cx.fillStyle="#fffdf6";rr(cx,-w/2+10,-h/2+14,w-20,h-24,5);cx.fill();
  cx.fillStyle="rgba(170,176,190,1)";rr(cx,-26,-h/2-8,52,20,5);cx.fill();cx.fillStyle=rgba(WC_DARK,1);cx.textAlign="center";cx.font=font(800,30);cx.fillText("next term",0,-h/2+52);
  cx.fillStyle=rgba([140,176,210],0.9);[0.5,0.8,0.6,0.9].forEach((v,j)=>cx.fillRect(-62+j*34,h/2-22-v*90,24,v*90));cx.restore();fingers(cx,P_,[[mx-w/2+2,my+20],[mx+w/2-2,my+16]]);}
// how long each of Yusuf's three lines in binder 6 takes to write
const WS_OBD=[1.6,1.6,1.2];
scene("grants",(ctx,S,t,sc)=>{const c=sc.cues,P=ws_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{tray:w("plan","faculties"),dec:w("plan","fifteenth"),ends:w("plan","ends"),rev:c.review-0.3,sweep:w("review","access"),two:w("two","two"),bind:c.policy-0.4,
      notes:[w("policy","owners",0.1),w("platform","platform"),w("platform","reviews")],tb:c.like-0.3,morph:w("like","Planning",-0.1),
      num:w("like","numbers"),who:w("like","learners"),band:w("like","privacy"),once:w("classify","once"),end:c.breath-0.2};});
  gv_shots(ctx,S,t,sc.dur,[
    // Planning: the plan goes to the faculties; the calendar turns to the 15th, and the access card on the wall goes by itself
    {at:0,place:"planning",keys:[[0,700,520,1.12],[0.1,680,520,1.16]],d:4,draw:(x,tt)=>{const put=fin(tt,P.tray-0.4,0.6);ws_planChart(x);
      ws_accessCard(x,250,275,{rot:0.03,a:1-fin(tt,P.ends,1.0),glow:gv_io(tt,P.dec,P.ends+0.6,0.4)});
      ws_tray(x,165,668,1);ws_tent(x,500,668,"Dec",tt<P.dec+0.3?"14":"15");
      person(x,"clara",700,905,0.8,{pose:put<0.5?"hold":"listen",pose2:put<0.5?"reach":null,mix:put*2,t:tt,carry:put<0.5?ws_heldPlan:null});
      const s2=clamp((tt-P.tray)/0.6,0,1);if(s2>0&&s2<1){const e=easeCam(s2);gv_sheet(x,lerp(640,105,e),lerp(560,600,e),130,100,{rot:-0.04});}
      if(s2>=1)gv_sheet(x,105,600,130,40,{rot:-0.02});}},
    // Sam's screen, in December: the access list itself, read through once; two groups now, each with a reason to be there
    {at:P.rev,place:"screenPlat",keys:[[P.rev,960,440,1.04],[P.rev+0.1,960,430,1.07]],d:4,push:0.01,draw:(x,tt)=>
      ws_whoList(x,1,1,clamp((tt-P.two+0.3)/2.2,0,1),true,clamp((tt-P.sweep)/1.4,0,1))},
    // his desk: binder 6 again, its two questions answered in his hand, which data and how, and the access under them; a green tick
    {at:P.bind,place:"desk",keys:[[P.bind,1152,432,1.25]],d:2,draw:(x,tt)=>{const n=P.notes.map((t0,i)=>clamp((tt-t0)/WS_OBD[i],0,1));
      ws_openBinder(x,1,{notes:n,tick:fin(tt,P.notes[2]+1.0,0.5)});
      [[1205,300],[1372,418]].forEach(([qx,qy],i)=>withA(x,1-0.75*clamp(n[i]*1.5,0,1),()=>gv_qmark(x,qx,qy,46,1)));
      P.notes.forEach((t0,i)=>{const a=gv_io(tt,t0-0.3,t0+WS_OBD[i]+0.25,0.25);if(a<=0.01)return;const [px,py]=ws_penAt(x,WS_OBN[i],ws_obNoteX(),ws_obNoteY(i),ws_obNoteS(x),n[i]);ws_pen(x,px,py,a,0.3);});}},
    // the census of 1987 again, as the first chapter left it: the tally full, the box shut and locked, the court's line across the answers.
    // Then, as in the first chapter, the line becomes the line between the table's columns: counting on one side; the side that says who
    // masked; the class on it
    {at:P.tb,place:"table83",keys:[[P.tb,960,540,1],[P.tb+0.1,960,520,1.04]],d:4,push:0.02,draw:(x,tt)=>{const [fx,fy,fw,fh]=WS_F,f87=[fx,fy-0.5*fh*0.12,fw,fh];
      const gone=fin(tt,P.morph-0.2,0.8),fade=1-fin(tt,P.morph+0.6,0.9);
      if(gone<1)withA(x,1-gone,()=>{ws_tinBox(x,WS_BOX[0],WS_BOX[1],0,1);ws_tally(x,WS_TAL[0],WS_TAL[1],25);});
      if(fade>0.01)withA(x,fade,()=>ws_form(x,fx,fy,fw,fh,{cut:true,ticks:true}));
      ws_colsTable(x,fin(tt,P.morph+0.4,1.0),fin(tt,P.band,0.9));const [a,b]=ws_lineAt(fin(tt,P.morph,1.6),f87);ws_line(x,a,b,1);
      ws_tagAt(x,tt,P.num,null,(WS_TB.x+WS_TB.div)/2,WS_TB.y-60,"counting",{size:32});ws_tagAt(x,tt,P.who,null,(WS_TB.div+WS_TB.x+WS_TB.w)/2,WS_TB.y-60,"knowing who",{size:32});
      gv_classChipAt(x,tt,P.once,WS_TB.div+30,WS_TB.y+140,"direct",{size:28});}}]);
  wc_year(ctx,56,72,"December 2026",fin(t,0.3,0.5)*(1-fin(t,P.rev,0.4)));wc_year(ctx,56,72,"West Germany · 1987",gv_io(t,P.tb,P.morph,0.4));
  gv_end(ctx,S,t,P.end,"Who may see it","Classify once; protect it everywhere.","Film 4 of 19");
  wc_paperOver(ctx,S);});
