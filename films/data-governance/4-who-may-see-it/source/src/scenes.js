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

scene("counted",(ctx,S,t,sc)=>{const c=sc.cues,P=ws_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{lift:c.answer+0.2,plan:[w("answer","housing"),w("answer","schools"),w("answer","transport")],tb:c.correct-0.3,link:w("correct","correct"),
      reg:w("correct","register"),st:c.boycott-0.4,hl:c.stops-0.5,down:w("stops","stops"),tie:w("stops","stops",0.9),ct:c.rules-0.4,dec:w("rules","decides"),
      tbl:c.insig-0.4,slip:w("insig","computers"),slipBack:c.forbid+0.1,count:w("forbid","counting"),line:c.line+0.05,split:w("apart","kept"),rem:w("apart","removed"),
      th:c.back-0.2,arrow:w("back","given"),cross:w("back","don't"),y87:c.y1987-0.1,one:c.one,two:c.another,betw:c.between-0.2,uni:w("between","university's"),
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
    // the same law lets the town hall correct its register from the answers: the form beside a card from the register, the names linked
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
      const sp87=0.5*easeCam(fin(tt,P.y87+1.6,0.5)),box87=fin(tt,P.y87+2.1,1.2),open=y87?gv_io(tt,P.y87+1.9,P.morph-0.4,0.4):gv_io(tt,P.split+0.3,P.rem+1.4,0.4);
      withA(x,fin(tt,P.split,0.5)*(1-gone),()=>ws_tinBox(x,WS_BOX[0],WS_BOX[1],open,0));
      const shr=gv_io(tt,P.rem-0.6,P.y87,0.5);if(shr>0.01)withA(x,shr,()=>ws_shredder(x,WS_SHR[0],WS_SHR[1],clamp((tt-P.rem-0.7)/1.4,0,1)));
      const tal=fin(tt,P.count-0.3,0.5)*(1-gone);if(tal>0.01)withA(x,tal,()=>ws_tally(x,WS_TAL[0],WS_TAL[1],clamp((tt-P.count)/0.8,0,1)*5+clamp((tt-P.y87-2.0)/2.6,0,1)*20));
      // 1983's form: its answers lift off and come back; the line; the strip to the box, then to the shredder; the answers stay, counted
      if(nf<1){ws_form(x,fx,fy,fw,fh,{cut:true,ticks:true});if(sp83<=0)ws_line(x,[fx-fw/2-30,ws_cutY(0)],[fx+fw/2+30,ws_cutY(0)],fin(tt,P.line,0.9));
        else if(!y87)ws_line(x,[fx-fw/2-30,ws_cutY(sp83)],[fx+fw/2+30,ws_cutY(sp83)],1);}
      if(!y87)ws_stripWay(x,sp83,box83,shred83);
      ws_townHall(x,gv_io(tt,P.th,P.y87,0.4),fin(tt,P.arrow,0.7),fin(tt,P.cross,0.5));
      // 1987: a new form slides in over the old, the same line, the same split, its strip into the box
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
  gv_title(ctx,S,t,P.title,"Who may see it","classify once, protect everywhere","Film 4 of 19 · data governance");
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
// Planning's wall screen, as Clara reads the learner table there: the key, the stars, the status
function ws_planScreen(x,pulse){const [sx,sy,sw,sh]=GV_PL.screen;gv_screen(x,sx,sy,sw,sh,"learner table",null,{barH:46,titleSize:28});
  [[30,"learner_key"],[270,"full_name"],[500,"status"]].forEach(([cx,s2])=>wc_T(x,s2,sx+cx,sy+92,{w:500,size:28,f:"mono",col:WC_MUTED}));
  WS_LT.slice(0,3).forEach(([k,st],i)=>{const y=sy+160+i*70;wc_T(x,k,sx+30,y,{w:500,size:28,f:"mono",col:WC_INK});gv_mask(x,sx+270,y-34,190,48,1,{size:28});wc_T(x,st,sx+500,y,{w:500,size:28,f:"mono",col:WC_INK});});
  if(pulse>0.01){x.save();x.globalCompositeOperation="screen";wc_glowAt(x,sx+365,sy+230,200,[255,200,240],0.3*pulse);x.restore();}}
// the list of student IDs and the keys they give, side by side on the desk: the keys written down row by row (f, rows done), the last
// row's match lit (m); the row going through now lit on the IDs' list
function ws_idLists(x,f,m,a){if(a<=0.01)return;const rows=WS_IDS.slice(-8);withA(x,a,()=>{
  [[110,"student IDs",0],[1410,"keys",1]].forEach(([sx,title,k])=>{gv_sheet(x,sx,300,400,470);wc_T(x,title,sx+30,352,{w:600,size:30,col:WC_DARK});
    rows.forEach((r,i)=>{const show=k?clamp(f-i-0.5,0,1)*2:1,yy=410+i*44;if(i===7&&m>0)gv_tint(x,sx+16,yy-32,368,42,WS_HI,0.8*m);
      if(show>0.01)wc_T(x,r[k],sx+30,yy,{w:500,size:28,f:"mono",col:WC_INK,a:Math.min(1,show)});});});
  if(f>0&&f<8)gv_tint(x,126,410+Math.floor(f)*44-32,368,42,WS_HI,0.45);});}
// a scrap of paper on its way into the scrambler or out of it
function ws_paperBit(x,px,py,on){if(!on)return;x.save();x.translate(px,py);x.rotate(-0.04);wc_flat(x,wc_rect(-46,-14,92,28),[250,248,240],1,"bit");x.strokeStyle=rgba(WC_PENCIL,0.5);x.lineWidth=1.5;x.strokeRect(-46,-14,92,28);x.restore();}
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
    // his office: Yusuf takes the next binder off the shelf, its label the film's title
    {at:0,place:"office",keys:[[0,1250,560,1.3],[0.2,1270,540,1.36]],d:3,draw:(x,tt)=>{const out=fin(tt,P.take,0.5),has=tt>=P.take+0.55;
      ws_binders(x,{out,taken:has});
      person(x,"yusuf",1370,905,0.8,{pose:has?"hold":"listen",pose2:has?null:"reach",mix:has?0:gv_io(tt,P.take-0.5,P.take+0.6,0.4),t:tt,carry:has?ws_heldTitled(["Who may","see it"],ws_bindCol(5)):null});
      ws_nameCard(x,880,600,"Yusuf Demir","data governance lead",gv_io(tt,0.5,P.desk-0.3,0.4));}},
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

// ---- 4 · At the column: every column other teams read carries a class, written beside it and checked on every change ----
scene("column",(ctx,S,t,sc)=>{const c=sc.cues,P=ws_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{list:c.class-0.4,chip:[w("pseudo","Pseudonymous"),w("direct","identifies"),w("direct","name"),w("direct","email"),w("none","none")],
      yaml:c.written-0.3,beside:w("written","beside"),chk:w("written","a check")-0.3,stops:w("written","stops"),own:c.owners-0.4,surp:w("owners","surprised"),
      keys:c.looks-0.4,most:w("looks","most"),id:w("holds","student's"),ring:c.nothing,mei:c.mei,line:w("mei","court's"),ok:c.mei+3.6};});
  gv_shots(ctx,S,t,sc.dur,[
    // the registrar's office: Mei at her desk, the learner table on her screen
    {at:0,place:"registrar",keys:[[0,900,540,1],[0.1,960,520,1.06]],d:3.4,draw:(x,tt)=>{ws_mei(x,tt);x.drawImage(gv_place("registrarDesk"),0,0,W,H);ws_regScreen(x,"learner table");
      ws_nameCard(x,830,560,"Mei Tanaka","registrar's office",gv_io(tt,0.6,P.list-0.3,0.4));}},
    // her screen, close: each column's class, as it's said
    {at:P.list,place:"screenReg",keys:[[P.list,960,440,1.04],[P.list+0.1,960,430,1.07]],d:4,push:0.01,draw:(x,tt)=>
      ws_colList(x,{t:tt,chip:i=>P.chip[i],hi:i=>gv_io(tt,P.chip[i]-0.1,P.chip[i]+1.2,0.3)})},
    // written beside the column, in the project's own file
    {at:P.yaml,place:"screenReg",keys:[[P.yaml,960,440,1.04],[P.yaml+0.1,980,430,1.08]],d:3,push:0.01,draw:(x,tt)=>ws_yaml(x,fin(tt,P.beside,0.6))},
    // the governance check, on every change: a column with no class stops it
    {at:P.chk,place:"screen",keys:[[P.chk,960,440,1.04],[P.chk+0.1,960,430,1.07]],d:3,push:0.01,draw:(x,tt)=>ws_check(x,fin(tt,P.stops,0.4),0)},
    // each owner classed their own; one surprised them
    {at:P.own,place:"registrar",keys:[[P.own,1000,520,1.06],[P.own+0.1,980,500,1.1]],d:3,draw:(x,tt)=>{ws_mei(x,tt,{pose:"listen",expr:tt>P.surp?"worried":"calm"});
      x.drawImage(gv_place("registrarDesk"),0,0,W,H);ws_regScreen(x,"credentials");}},
    // the credentials' keys: codes, most of them; an award's holds the student's ID; the court's line, drawn at the column
    {at:P.keys,place:"screenReg",keys:[[P.keys,960,440,1.04],[P.keys+0.1,960,430,1.07]],d:4,push:0.01,draw:(x,tt)=>
      ws_keys(x,{t:tt,ticks:i=>fin(tt,P.most+i*0.25,0.4),id:fin(tt,P.id,0.6),ring:fin(tt,P.ring,0.8),line:fin(tt,P.line,1.0),chip:P.mei+0.6})},
    // and the check passes
    {at:P.ok-0.4,place:"screen",keys:[[P.ok-0.4,960,440,1.04],[P.ok,960,430,1.07]],d:2,push:0.01,draw:(x,tt)=>ws_check(x,1,fin(tt,P.ok+0.2,0.8))}]);
  wc_paperOver(ctx,S);});

// ---- 5 · The mask follows: the class goes with its column to the platform as a tag, and one rule there reads it ----
scene("mask",(ctx,S,t,sc)=>{const c=sc.cues,P=ws_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{lift:w("stay","stay"),plat:c.built-0.3,tag:w("built","as a tag"),rule:c.rule,stars:w("rule","stars"),board:c.bytag-0.3,bytag:w("bytag","by tag"),
      every:w("every","every"),tom:w("every","tables built"),never:c.never};});
  const B=WS_BD;
  gv_shots(ctx,S,t,sc.dur,[
    // the class, in the file; it lifts off with its column and goes
    {at:0,place:"screenReg",keys:[[0,960,440,1.04],[0.1,980,430,1.08]],d:3,push:0.01,draw:(x,tt)=>{ws_yaml(x,1);const u=fin(tt,P.lift,1.0),e=easeCam(u);if(u<=0)return;
      const [X,Y]=GV_SC;x.save();x.translate(lerp(X+300,X+1600,e*e),lerp(Y+510,Y+380,e)-90*Math.sin(Math.PI*e));withA(x,1-clamp((u-0.85)/0.15,0,1),()=>gv_classChip(x,0,0,"direct",{size:32}));x.restore();}},
    // the platform team's desk: the tag arrives with the column; the one rule that reads it
    {at:P.plat,place:"platform",keys:[[P.plat,900,540,1],[P.plat+0.1,880,530,1.05]],d:3,draw:(x,tt)=>{ws_sam(x,tt,{pose:"write"});x.drawImage(gv_place("platformDesk"),0,0,W,H);
      ws_tagScreen(x,tt,P.tag);ws_ruleScreen(x,fin(tt,P.rule,0.5),fin(tt,P.stars,0.8));}},
    // the data team's board: the email masked in the learner table, in the wallet built from it, and in a table built tomorrow; Planning's list
    // never had it
    {at:P.board,place:"boardData",keys:[[P.board,960,500,1.06],[P.board+0.1,960,490,1.1]],d:3,push:0.01,draw:(x,tt)=>{
      const lt=ws_bdAnchor(B.lt,-1),ltR=ws_bdAnchor(B.lt,1),tomA=ws_bdAnchor(B.tom,-1),tu=fin(tt,P.tom-0.2,0.6);
      B.src.forEach(s2=>{ws_srcCard(x,s2);ws_string(x,ws_bdAnchor(s2,1),lt,1);});
      ws_string(x,ltR,ws_bdAnchor(B.wal,-1),1);ws_string(x,ltR,ws_bdAnchor(B.near,-1),1);ws_string(x,ltR,tomA,clamp((tt-P.tom-0.2)/0.6,0,1));
      ws_bdCard(x,B.lt,{mask:r=>r===1?fin(tt,P.bytag,0.8):0});ws_bdCard(x,B.wal,{mask:r=>r===1?fin(tt,P.every+0.9,0.8):0});
      if(fin(tt,P.never,0.5)>0.01){const h=ws_bdH(B.near);gv_tint(x,B.near.x+8,B.near.y+8,B.near.w-16,h-16,WS_HI,0.5*gv_io(tt,P.never,sc.dur+1,0.5));}
      ws_bdCard(x,B.near);
      if(tu>0.01){x.save();x.translate(0,(1-easeCam(tu))*-40);withA(x,tu,()=>ws_bdCard(x,B.tom,{mask:r=>r===1?fin(tt,P.tom+0.9,0.8):0}));x.restore();}
      ws_bead(x,ltR,ws_bdAnchor(B.wal,-1),(tt-P.every)/0.9,WS_DIRECT,11);ws_bead(x,ltR,tomA,(tt-P.tom-0.2)/0.9,WS_DIRECT,11);}}]);
  wc_paperOver(ctx,S);});

// ---- 6 · A purpose and a date: the owner says yes, for a purpose, to a group, until a date; even keys are still personal data ----
scene("purpose",(ctx,S,t,sc)=>{const c=sc.cues,P=ws_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{req:c.yes-0.3,yes:w("yes","yes"),pl:w("yes","to plan"),until:w("yes","until"),fl:c.group-0.3,grp:w("group","a Planning"),name:w("group","not to"),ends:w("group","ends"),
      scr:c.sees-0.3,ks:w("sees","key"),stars:w("stars","stars"),desk:c.key-0.3,scram:w("key","scrambled"),back:w("back","Anyone"),keys:w("back","so even"),end:w("back","end date"),
      agent:c.agent-0.3,ag:w("agent","agent")};});
  const F=GV_FL,cardTo=[F.x(0)+F.w/2,F.top+250];
  gv_shots(ctx,S,t,sc.dur,[
    // the registrar's office: the request comes to the table's owner
    {at:0,place:"registrar",keys:[[0,960,540,1],[0.1,980,520,1.06]],d:3,draw:(x,tt)=>{ws_mei(x,tt);x.drawImage(gv_place("registrarDesk"),0,0,W,H);ws_regScreen(x,"access request",fin(tt,0.6,0.6));}},
    // her screen: who asks, what for, until when; yes, for her office
    {at:P.req,place:"screenReg",keys:[[P.req,960,440,1.04],[P.req+0.1,960,430,1.07]],d:4,push:0.01,draw:(x,tt)=>{const [X,Y]=GV_SC;ws_request(x,1,fin(tt,P.yes,0.8));
      gv_tint(x,X+44,Y+262,560,54,WS_HI,0.6*gv_io(tt,P.pl-0.1,P.until-0.1,0.3));gv_tint(x,X+44,Y+324,440,54,WS_HI,0.6*gv_io(tt,P.until-0.1,P.fl,0.3));}},
    // the floor: the access goes to Planning's group, not to Clara by name, and ends on its date by itself
    {at:P.fl,place:"floor",keys:[[P.fl,738,480,1.3],[P.fl+0.1,730,480,1.32]],d:4,push:0,draw:(x,tt)=>{ws_floor(x,tt,{out:["yusuf"],pose:{mei:{pose:"listen",pose2:"point",mix:gv_io(tt,P.grp-0.6,P.grp+0.6,0.4),flip:true}}});
      const u=fin(tt,P.grp-0.2,1.0),e=easeCam(u),from=[F.x(1)+F.w/2,F.top+300];if(u<=0)return;
      ws_accessCard(x,lerp(from[0],cardTo[0],e),lerp(from[1],cardTo[1],e)-90*Math.sin(Math.PI*e),{rot:lerp(0.08,-0.03,e),pin:u>=1,glow:fin(tt,P.ends,0.6)});}},
    // Clara's screen: the key and status as they are, names and emails as stars
    {at:P.scr,place:"screenPlan",keys:[[P.scr,960,440,1.04],[P.scr+0.1,960,430,1.07]],d:4,push:0.01,draw:(x,tt)=>ws_maskTable(x,{hi:gv_io(tt,P.ks-0.2,P.stars,0.3),pulse:gv_io(tt,P.stars,P.desk,0.4)})},
    // his desk: a key is the student's ID, scrambled; with the list of IDs it can be worked back, so keys too come with a purpose and an end date
    {at:P.desk,place:"desk",keys:[[P.desk,960,540,1],[P.back,960,520,1.04]],d:2.4,draw:(x,tt)=>{const S_=WS_SCR,L=S_.x-S_.w/2,R=S_.x+S_.w/2;
      wc_T(x,"learner_key",S_.x,170,{w:600,size:30,f:"mono",align:"center",col:WC_MUTED});ws_slip(x,S_.x,236,"0905e6e2…",{size:40,glow:gv_io(tt,P.back+2.9,P.agent,0.3)});
      // the student's ID goes in and its key comes out
      const g=clamp((tt-P.scram+0.6)/1.6,0,1);ws_scrambler(x,(tt-P.desk)*0.6);
      if(g<1){ws_slip(x,lerp(L-260,L+120,easeCam(clamp(g*1.6,0,1))),S_.y,"SIS|S-20417",{size:34,cutL:L});}
      const o1=clamp((tt-P.scram-0.2)/0.9,0,1)*(1-fin(tt,P.back,0.4));if(o1>0)ws_slip(x,lerp(R-120,R+230,easeCam(o1)),S_.y,"0905e6e2…",{size:34,cutR:R});
      // anyone with the list of IDs: each one through it in turn, its key written down, until one matches the key above
      const f=clamp((tt-P.back-0.3)/2.6,0,1)*8,m=fin(tt,P.back+2.9,0.4);ws_idLists(x,f,m,gv_io(tt,P.back-0.3,P.agent,0.4));
      if(f>0&&f<8){const v=f-Math.floor(f),ry=410+Math.floor(f)*44-12;ws_paperBit(x,lerp(510,L+40,easeCam(clamp(v*2,0,1))),lerp(ry,S_.y,easeCam(clamp(v*2,0,1))),v<0.5);
        ws_paperBit(x,lerp(R-40,1410,easeCam(clamp(v*2-1,0,1))),lerp(S_.y,ry,easeCam(clamp(v*2-1,0,1))),v>=0.5);}
      if(m>0)wc_link(x,S_.x+150,236,1404,708,WC_PENCIL,{p:m,lw:4,a:0.85*(1-fin(tt,P.agent-0.4,0.4))});
      ws_tagAt(x,tt,P.keys,P.agent,S_.x,800,"pseudonymous: still personal data",{size:30,wash:WS_PSEUDO,washA:0.4});
      ws_accessCard(x,1640,182,{rot:0.03,a:fin(tt,P.keys,0.5),glow:fin(tt,P.end,0.6)});}},
    // the data team's screen: their agent reads stars too, and works from counts and samples
    {at:P.agent,place:"screen",keys:[[P.agent,960,440,1.04],[P.agent+0.1,960,450,1.07]],d:4,push:0.01,draw:(x,tt)=>{ws_maskTable(x,{title:"learner table, as the agent reads it"});
      const [X,Y]=GV_SC;ws_agentCard(x,X+50,Y+556,fin(tt,P.ag,0.5));}}]);
  wc_paperOver(ctx,S);});

// ---- 7 · Why the stars: Yusuf tells Clara why, and the way to more ----
scene("stars",(ctx,S,t,sc)=>{const c=sc.cues,P=ws_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{ask:c.asks,why:w("why","why"),more:w("more","the way"),fl:c.no-0.3,copied:w("no","copied")};});
  gv_shots(ctx,S,t,sc.dur,[
    // Planning: Clara asks why the names are stars; Yusuf tells her why, and shows her the way to more
    {at:0,place:"planning",keys:[[0,960,500,1.08],[0.1,960,490,1.1]],d:4,draw:(x,tt)=>{ws_planScreen(x,gv_io(tt,P.ask+1.0,c.rule,0.4));
      person(x,"clara",440,905,0.8,{pose:"point",pose2:"listen",mix:fin(tt,c.rule,0.6),t:tt});
      person(x,"yusuf",1320,905,0.8,{pose:"listen",pose2:"explain",mix:gv_io(tt,P.why-0.3,P.fl,0.5),t:tt,flip:true});
      ws_say(x,tt,P.ask+0.6,c.rule+0.6,90,250,["Why stars?"],420,468);
      ws_say(x,tt,P.why,P.more-0.2,1236,128,["Planning counts learners.","It doesn't need to know who they are."],1320,466,{size:28});
      const n=fin(tt,P.more,0.45);if(n>0.01){x.save();x.translate(0,14*(1-n));withA(x,n,()=>gv_card(x,1236,124,560,196,["Need names?","Ask the registrar's office,","and say what for."],{size:30,wash:GV.gold,washA:0.18,pin:true}));x.restore();}}},
    // the floor: a no without a way forward, and the table copied into spreadsheets, office after office
    {at:P.fl,place:"floor",keys:[[P.fl,960,540,1],[P.fl+0.1,960,530,1.02]],d:4,push:0.01,draw:(x,tt)=>{ws_floor(x,tt,{under:x=>{
      [[0,0.0],[3,0.35],[4,0.6],[1,0.85],[0,1.1],[3,1.3],[4,1.5],[1,1.7]].forEach(([r,dt],k)=>{const u=fin(tt,P.copied-0.2+dt,0.35)*(1-fin(tt,sc.dur-1.4,0.8));if(u<=0.01)return;
        const F=GV_FL,cx=F.x(r)+70+((k*97)%190),cy=F.top+190+((k*53)%160);x.save();x.translate(cx,cy);x.rotate(((k*37)%11-5)*0.012);x.scale(0.8+0.2*spring(u),0.8+0.2*spring(u));
        withA(x,u,()=>x.drawImage(ws_copyC(),-85,-105));x.restore();});}});}}]);
  wc_paperOver(ctx,S);});

// ---- 8 · Read from the grants: the plan goes out, the access ends on its date, and the review reads the grants ----
// Clara's plan for next term, on a sheet in her hands, before it goes in the faculties' tray
const ws_heldPlan=heldBoard(cx=>{cx.fillStyle=rgba(WC_DARK,1);cx.textAlign="center";cx.font=font(800,34);cx.fillText("next term",0,-70);cx.fillStyle=rgba([140,176,210],0.9);
  [0.5,0.8,0.6,0.9].forEach((v,j)=>cx.fillRect(-70+j*38,90-v*130,26,v*130));});
scene("grants",(ctx,S,t,sc)=>{const c=sc.cues,P=ws_once(sc,"P",()=>{const w=(id,s,o)=>wAt(sc,id,s,o);
    return{tray:w("plan","faculties"),dec:w("plan","fifteenth"),ends:w("plan","ends"),rev:c.review-0.3,two:w("two","two"),tb:c.one-0.6,band:w("another","another"),
      once:w("write","once"),end:c.breath-0.2};});
  gv_shots(ctx,S,t,sc.dur,[
    // Planning: the plan goes to the faculties; the calendar turns to the 15th, and the access card on the wall goes by itself
    {at:0,place:"planning",keys:[[0,700,520,1.12],[0.1,680,520,1.16]],d:4,draw:(x,tt)=>{const put=fin(tt,P.tray-0.4,0.6);ws_planChart(x);
      ws_accessCard(x,250,275,{rot:0.03,a:1-fin(tt,P.ends,1.0),glow:gv_io(tt,P.dec,P.ends+0.6,0.4)});
      ws_tray(x,165,668,1);ws_tent(x,500,668,"Dec",tt<P.dec+0.3?"14":"15");
      person(x,"clara",700,905,0.8,{pose:put<0.5?"hold":"listen",pose2:put<0.5?"reach":null,mix:put*2,t:tt,carry:put<0.5?ws_heldPlan:null});
      const s2=clamp((tt-P.tray)/0.6,0,1);if(s2>0&&s2<1){const e=easeCam(s2);gv_sheet(x,lerp(640,105,e),lerp(560,600,e),130,100,{rot:-0.04});}
      if(s2>=1)gv_sheet(x,105,600,130,40,{rot:-0.02});}},
    // Sam's screen, in December: who can read the learner table now, two groups, each with a reason to be there
    {at:P.rev,place:"screenPlat",keys:[[P.rev,960,440,1.04],[P.rev+0.1,960,430,1.07]],d:4,push:0.01,draw:(x,tt)=>ws_whoList(x,1,1,clamp((tt-P.two+0.3)/2.2,0,1),true)},
    // the table: the court's line, between columns; the mask over the side that says who
    {at:P.tb,place:"table83",keys:[[P.tb,960,540,1],[P.tb+0.1,960,520,1.04]],d:4,push:0.02,draw:(x,tt)=>{const [fx,fy,fw,fh]=WS_F,m=fin(tt,P.tb+0.2,1.6);
      ws_colsTable(x,1,fin(tt,P.band,0.9));const [a,b]=ws_lineAt(1,[fx,fy,fw,fh]);ws_line(x,a,b,1);
      ws_tagAt(x,tt,c.one+0.2,null,(WS_TB.x+WS_TB.div)/2,WS_TB.y-60,"counting",{size:32});ws_tagAt(x,tt,c.another+0.2,null,(WS_TB.div+WS_TB.x+WS_TB.w)/2,WS_TB.y-60,"knowing who",{size:32});
      gv_classChipAt(x,tt,P.once,WS_TB.div+30,WS_TB.y+140,"direct",{size:28});}}]);
  wc_year(ctx,56,72,"December 2026",fin(t,0.3,0.5)*(1-fin(t,P.rev,0.4)));
  gv_end(ctx,S,t,P.end,"Who may see it","Classify once; let the platform protect it everywhere.","Film 4 of 19");
  wc_paperOver(ctx,S);});
