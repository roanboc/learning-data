/* ===== One row of what, and when: the film's own pictures (prefixed rw_) =====
   The past: the United States census of 1890. A calendar page pinned at June 1 while the weeks of counting run past; a wooden
   house, its door, and the census taker in a wool frock coat and bowler hat, writing the family's schedule (one column of
   answers per person); a rocking cradle for a baby born too late to count; then, in Washington, a clerk's hand on a pantograph
   punch, a manila card for each person, the cards stacking, and Hollerith's tabulator dial. Living things and the materials of
   the past are drawn with tapering outlines, a light side and a shadow side, and a little life (breath, a rocking cradle).
   The present: code cards from the project (rw_code, with the label "runs on dbt Core · DuckDB"), the grain sentence, the
   consumers' badges and date pins, tests that pass or stop, result tables, versions as stacked cards, Aisha's credit as a
   staircase, three sources' timelines cut and stitched into one, and the small loop of ten steps. */

const RW_RUN="runs on dbt Core · DuckDB",RW_CON=[120,215,155],RW_TIME=[230,184,255],RW_INK=[44,34,26],RW_AMB=[255,190,90],RW_RED=[255,96,86];
const RW_GRAIN="One row per learner per award",RW_ASAT="as at census date";
const RW_KS={SIS:SRC3[0][1],LMS:SRC3[1][1],SC:SRC3[2][1]},RW_KC=[255,200,150];  // a credential, amber, on the stairs and in their legend

/* ---------- the past: 1890 ---------- */
// handwriting: Manrope, slanted, in iron-gall ink
function rw_hand_(ctx,s,x,y,sz,col,o){o=o||{};ctx.save();ctx.translate(x,y);ctx.transform(1,0,-0.18,1,0,0);ctx.font=(o.w||600)+" "+sz+"px "+FT.sans;ctx.textAlign=o.align||"left";ctx.fillStyle=col||rgba(RW_INK,0.9);ctx.fillText(s,0,0);ctx.restore();}
// a calendar page, pinned: a red band with the month, the day large, the year and the weekday; o.sway rocks it on its pin
function rw_calendar(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x+w/2,y+10);ctx.rotate(0.012*Math.sin(t*0.9)+(o.rot||0));ctx.translate(-w/2,-10);
  kt_paper(ctx,0,0,w,h,t,{col:[240,232,212],seed:7,curl:0.4,age:0.2});
  const g=ctx.createLinearGradient(0,0,0,70);g.addColorStop(0,"rgb(170,52,44)");g.addColorStop(1,"rgb(128,34,30)");ctx.fillStyle=g;ctx.fillRect(6,22,w-12,62);
  T(ctx,o.month||"JUNE",w/2,66,{w:800,size:32,align:"center",color:"rgba(250,236,214,0.96)"});
  T(ctx,o.day||"1",w/2,h*0.68,{w:800,size:h*0.42,align:"center",color:rgba(RW_INK,0.92)});
  T(ctx,o.year||"1890",w/2,h-26,{w:700,size:22,align:"center",color:rgba(RW_INK,0.7)});
  // the brass pin, and its shadow
  ctx.fillStyle="rgba(0,0,0,0.3)";ctx.beginPath();ctx.ellipse(w/2+5,14,9,5,0,0,TAU);ctx.fill();const pg=ctx.createRadialGradient(w/2-3,6,1,w/2,9,10);pg.addColorStop(0,"rgb(255,236,180)");pg.addColorStop(1,"rgb(140,96,40)");ctx.fillStyle=pg;ctx.beginPath();ctx.arc(w/2,9,9,0,TAU);ctx.fill();
  ctx.restore();});}
// a small calendar leaf, for one of the days of June running past
function rw_leaf(ctx,x,y,day,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.4)";ctx.shadowBlur=10;ctx.shadowOffsetY=4;ctx.fillStyle="rgb(232,222,198)";ctx.fillRect(x-38,y-46,76,92);ctx.restore();
  ctx.fillStyle="rgb(150,44,38)";ctx.fillRect(x-38,y-46,76,22);T(ctx,"June",x,y-29,{w:700,size:16,align:"center",color:"rgba(250,236,214,0.95)"});T(ctx,String(day),x,y+30,{w:800,size:40,align:"center",color:rgba(RW_INK,0.88)});});}

// the 1890 family schedule: one sheet per family, one column of answers per person. o.wr[i] (0..1) writes person i's column;
// o.lift: a column lifted out (it fades from the sheet); o.note (0..1): Ruth's later note; o.hiCol: a column lit
const RW_SCH_ROWS=["Name","Relation","Sex","Age","Born in"],RW_SCH=[["William","Head","M","41","Ohio"],["Sarah","Wife","F","38","Penn."],["Ellen","Daughter","F","9","Ohio"],["Ruth","Mother","F","72","Ireland"]];
function rw_schCol(x,y,i){return[x+150+i*118,y+150,112,5*62+20];}
function rw_schedule(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{kt_paper(ctx,x,y,w,h,t,{col:[236,226,200],seed:11,curl:0.5,age:0.25});
  T(ctx,"SCHEDULE No. 1 · POPULATION",x+w/2,y+46,{w:800,size:20,align:"center",color:rgba(RW_INK,0.85)});
  T(ctx,"one sheet per family · 1890",x+w/2,y+76,{w:600,size:18,align:"center",color:rgba(RW_INK,0.6)});
  ctx.strokeStyle="rgba(120,80,50,0.45)";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x+24,y+100);ctx.lineTo(x+w-24,y+100);ctx.stroke();
  RW_SCH_ROWS.forEach((r,j)=>{const yy=y+150+j*62+38;T(ctx,r,x+30,yy,{w:700,size:18,color:rgba(RW_INK,0.7)});ctx.strokeStyle="rgba(120,80,50,0.25)";ctx.beginPath();ctx.moveTo(x+24,yy+18);ctx.lineTo(x+w-24,yy+18);ctx.stroke();});
  for(let i=0;i<4;i++){const[cx,cy,cw,ch]=rw_schCol(x,y,i);ctx.strokeStyle="rgba(120,80,50,0.3)";ctx.beginPath();ctx.moveTo(cx-4,y+112);ctx.lineTo(cx-4,y+h-30);ctx.stroke();
    if(o.hiCol===i&&(o.hi||0)>0){withA(ctx,o.hi,()=>{ctx.fillStyle="rgba(255,214,140,0.28)";ctx.fillRect(cx-2,cy,cw,ch);});}
    const q=o.wr?o.wr[i]||0:1,lf=o.lift===i?1:0;if(lf)continue;
    RW_SCH[i].forEach((v,j)=>{const qq=clamp(q*5-j,0,1);if(qq<=0)return;rw_hand_(ctx,typeOn(v,qq),cx+6,cy+38+j*62,22,rgba([36,30,60],0.9));});}
  if((o.note||0)>0){const[cx,cy]=rw_schCol(x,y,3);rw_hand_(ctx,typeOn("died June 20",o.note),cx-2,cy+5*62+42,18,rgba([36,30,60],0.85));}});}

// a clapboard house front: weathered planks, a window with warm light, a panelled door, two stone steps
function rw_house(ctx,x,y,w,h,t,a){if(a<=0.01)return;withA(ctx,a,()=>{
  const g=ctx.createLinearGradient(x,y,x+w,y);g.addColorStop(0,"rgb(150,126,96)");g.addColorStop(1,"rgb(98,80,60)");ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
  for(let yy=y+6;yy<y+h;yy+=26){ctx.fillStyle="rgba(255,236,200,0.16)";ctx.fillRect(x,yy,w,2);ctx.fillStyle="rgba(30,20,10,0.35)";ctx.fillRect(x,yy+22,w,3);
    for(let k=0;k<3;k++){const gx=x+hash(yy,k+3)*w;ctx.strokeStyle="rgba(60,40,24,0.25)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(gx,yy+8);ctx.bezierCurveTo(gx+40,yy+6,gx+80,yy+14,gx+130,yy+10);ctx.stroke();}}
  // the eave's shadow
  const e=ctx.createLinearGradient(0,y,0,y+60);e.addColorStop(0,"rgba(0,0,0,0.55)");e.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=e;ctx.fillRect(x,y,w,60);
  // the window: warm light behind four panes, a curtain, the frame
  const wx=x+40,wy=y+200,ww=150,wh=190,lg=ctx.createRadialGradient(wx+ww*0.6,wy+wh*0.4,10,wx+ww/2,wy+wh/2,wh);lg.addColorStop(0,"rgb(255,214,140)");lg.addColorStop(1,"rgb(150,96,44)");ctx.fillStyle=lg;ctx.fillRect(wx,wy,ww,wh);
  ctx.fillStyle="rgba(240,226,200,0.55)";ctx.beginPath();ctx.moveTo(wx,wy);ctx.bezierCurveTo(wx+40,wy+40,wx+30+4*Math.sin(t*0.8),wy+130,wx+18,wy+wh);ctx.lineTo(wx,wy+wh);ctx.closePath();ctx.fill();
  ctx.strokeStyle="rgb(232,220,196)";ctx.lineWidth=8;ctx.strokeRect(wx,wy,ww,wh);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(wx+ww/2,wy);ctx.lineTo(wx+ww/2,wy+wh);ctx.moveTo(wx,wy+wh/2);ctx.lineTo(wx+ww,wy+wh/2);ctx.stroke();
  // the door: four panels, light from the left, a brass knob
  const dx=x+w-230,dy=y+h-400,dw=150,dh=400,dg=ctx.createLinearGradient(dx,0,dx+dw,0);dg.addColorStop(0,"rgb(108,58,36)");dg.addColorStop(1,"rgb(62,32,20)");
  ctx.fillStyle="rgb(222,210,186)";ctx.fillRect(dx-12,dy-14,dw+24,dh+14);ctx.fillStyle=dg;ctx.fillRect(dx,dy,dw,dh);
  [[14,20],[80,20],[14,210],[80,210]].forEach(([px,py])=>{ctx.fillStyle="rgba(0,0,0,0.22)";ctx.fillRect(dx+px,dy+py,56,170);ctx.fillStyle="rgba(255,220,180,0.1)";ctx.fillRect(dx+px,dy+py,56,4);ctx.fillRect(dx+px,dy+py,4,170);});
  const kg=ctx.createRadialGradient(dx+dw-26,dy+dh*0.52,1,dx+dw-24,dy+dh*0.53,9);kg.addColorStop(0,"rgb(255,230,160)");kg.addColorStop(1,"rgb(120,80,30)");ctx.fillStyle=kg;ctx.beginPath();ctx.arc(dx+dw-24,dy+dh*0.53,8,0,TAU);ctx.fill();
  // the steps
  ctx.fillStyle="rgb(132,126,116)";ctx.fillRect(dx-40,y+h,dw+80,18);ctx.fillStyle="rgb(110,104,96)";ctx.fillRect(dx-60,y+h+18,dw+120,18);ctx.fillStyle="rgba(255,255,255,0.12)";ctx.fillRect(dx-40,y+h,dw+80,3);
  // the ground
  const gg=ctx.createLinearGradient(0,y+h+36,0,y+h+120);gg.addColorStop(0,"rgba(70,52,34,0.95)");gg.addColorStop(1,"rgba(30,20,12,0)");ctx.fillStyle=gg;ctx.fillRect(x-200,y+h+30,w+400,90);});}

// the census taker: a wool frock coat, waistcoat and bowler hat, a ledger in the crook of his arm, writing with a pencil.
// (x,y) is between his feet; s his scale. He breathes, and his pencil moves while he writes (o.write, 0..1)
function rw_taker(ctx,x,y,s,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  const br=Math.sin(t*1.5),wr=o.write||0;
  ctx.fillStyle="rgba(0,0,0,0.35)";ctx.beginPath();ctx.ellipse(4,4,78,12,0,0,TAU);ctx.fill();
  const lit=(x0,x1,c,k)=>{const g=ctx.createLinearGradient(x0,0,x1,0);g.addColorStop(0,rgba(mix(c,[255,255,255],0.14*(k||1)),1));g.addColorStop(0.55,rgba(c,1));g.addColorStop(1,rgba(mix(c,[0,0,0],0.38),1));return g;};
  // legs and shoes
  ctx.fillStyle=lit(-40,40,[64,58,56]);ctx.beginPath();ctx.moveTo(-34,-200);ctx.bezierCurveTo(-38,-130,-34,-60,-32,-14);ctx.lineTo(-8,-14);ctx.bezierCurveTo(-6,-70,-4,-140,-2,-196);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(4,-196);ctx.bezierCurveTo(8,-140,14,-70,18,-14);ctx.lineTo(42,-14);ctx.bezierCurveTo(40,-70,38,-130,34,-200);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgb(24,20,20)";ctx.beginPath();ctx.moveTo(-36,-16);ctx.bezierCurveTo(-46,-6,-52,2,-40,4);ctx.lineTo(-6,4);ctx.bezierCurveTo(-4,-4,-6,-12,-8,-16);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(16,-16);ctx.bezierCurveTo(14,-6,16,4,26,4);ctx.lineTo(62,4);ctx.bezierCurveTo(70,0,58,-10,44,-16);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgba(255,255,255,0.18)";ctx.beginPath();ctx.ellipse(48,-6,8,2.5,0,0,TAU);ctx.fill();
  // the frock coat, flaring to the knee; it rises a little with each breath
  ctx.save();ctx.translate(0,-330);ctx.scale(1,1+0.008*br);ctx.translate(0,330);
  ctx.fillStyle=lit(-70,70,[44,50,70]);ctx.beginPath();ctx.moveTo(-50,-336);ctx.bezierCurveTo(-64,-300,-66,-240,-70,-140);ctx.bezierCurveTo(-40,-128,40,-128,72,-140);ctx.bezierCurveTo(66,-240,64,-300,50,-336);ctx.bezierCurveTo(20,-346,-20,-346,-50,-336);ctx.fill();
  // the waistcoat and shirt in the V of the lapels, a dark tie, brass buttons
  ctx.fillStyle="rgb(104,80,56)";ctx.beginPath();ctx.moveTo(-18,-338);ctx.lineTo(18,-338);ctx.lineTo(10,-226);ctx.lineTo(-10,-226);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgb(236,230,214)";ctx.beginPath();ctx.moveTo(-12,-340);ctx.lineTo(12,-340);ctx.lineTo(0,-300);ctx.closePath();ctx.fill();ctx.fillStyle="rgb(30,26,34)";ctx.beginPath();ctx.moveTo(-4,-334);ctx.lineTo(4,-334);ctx.lineTo(6,-300);ctx.lineTo(0,-292);ctx.lineTo(-6,-300);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgba(255,255,255,0.1)";ctx.beginPath();ctx.moveTo(-50,-336);ctx.lineTo(-18,-338);ctx.lineTo(-8,-226);ctx.bezierCurveTo(-24,-270,-40,-300,-50,-336);ctx.fill();
  [-260,-244,-228].forEach(by=>{ctx.fillStyle="rgb(200,160,80)";ctx.beginPath();ctx.arc(0,by,3,0,TAU);ctx.fill();});
  ctx.strokeStyle="rgba(10,12,20,0.6)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-2,-222);ctx.bezierCurveTo(-4,-190,-2,-160,0,-132);ctx.stroke();
  // the left arm hangs; the right arm holds the ledger against his chest, the hand writing
  ctx.fillStyle=lit(-80,-40,[46,52,72]);ctx.beginPath();ctx.moveTo(-50,-332);ctx.bezierCurveTo(-74,-300,-80,-250,-76,-200);ctx.lineTo(-56,-198);ctx.bezierCurveTo(-56,-250,-50,-290,-38,-320);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgb(224,190,156)";ctx.beginPath();ctx.ellipse(-66,-188,11,14,0.1,0,TAU);ctx.fill();
  ctx.fillStyle="rgb(96,62,38)";ctx.save();ctx.translate(14,-262);ctx.rotate(-0.22);rr(ctx,-50,-46,100,80,4);ctx.fill();ctx.fillStyle="rgb(236,228,206)";ctx.fillRect(-44,-40,88,66);
  ctx.strokeStyle="rgba(40,30,60,0.6)";ctx.lineWidth=1.4;for(let k=0;k<5;k++){const L=clamp(wr*5-k,0,1)*70;if(L<=0)continue;ctx.beginPath();ctx.moveTo(-36,-30+k*12);for(let xx=0;xx<=L;xx+=6)ctx.lineTo(-36+xx,-30+k*12+Math.sin(xx*0.7+k)*1.4);ctx.stroke();}ctx.restore();
  const px=-14+ (wr>0&&wr<1? 50*((wr*5)%1):30),py=-282+Math.floor(clamp(wr,0,0.99)*5)*12;
  ctx.fillStyle=lit(40,80,[46,52,72]);ctx.beginPath();ctx.moveTo(50,-332);ctx.bezierCurveTo(74,-300,78,-262,70,-240);ctx.bezierCurveTo(56,-232,40,-240,px+16,py+10);ctx.lineTo(px+8,py-6);ctx.bezierCurveTo(36,-256,52,-262,54,-280);ctx.bezierCurveTo(52,-300,46,-316,38,-326);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgb(232,226,212)";ctx.beginPath();ctx.ellipse(px+14,py+2,7,9,0.6,0,TAU);ctx.fill();
  ctx.fillStyle="rgb(224,190,156)";ctx.beginPath();ctx.ellipse(px+4,py-2,10,8,0.4,0,TAU);ctx.fill();
  ctx.strokeStyle="rgb(160,120,60)";ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(px-2,py-4);ctx.lineTo(px-14,py+14);ctx.stroke();
  ctx.restore();
  // the head: a light side and a shadow side, an ear, a moustache, an eye looking down at the ledger
  ctx.save();ctx.translate(0,-372+0.8*br);ctx.rotate(0.06+0.02*Math.sin(t*0.6));
  ctx.fillStyle="rgb(214,178,146)";ctx.fillRect(-10,18,20,20);
  const hg=ctx.createLinearGradient(-30,0,34,0);hg.addColorStop(0,"rgb(236,202,168)");hg.addColorStop(1,"rgb(188,148,116)");ctx.fillStyle=hg;
  ctx.beginPath();ctx.moveTo(-24,-30);ctx.bezierCurveTo(-34,-8,-30,20,-14,32);ctx.bezierCurveTo(-2,40,16,38,24,28);ctx.bezierCurveTo(30,20,34,8,38,2);ctx.lineTo(30,-2);ctx.bezierCurveTo(32,-16,26,-34,6,-40);ctx.bezierCurveTo(-8,-42,-20,-38,-24,-30);ctx.fill();
  ctx.fillStyle="rgb(196,156,124)";ctx.beginPath();ctx.ellipse(-22,0,6,10,0,0,TAU);ctx.fill();
  ctx.fillStyle="rgb(74,52,34)";ctx.beginPath();ctx.moveTo(8,14);ctx.bezierCurveTo(16,10,28,12,34,18);ctx.bezierCurveTo(26,22,16,22,8,20);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgb(40,30,24)";ctx.beginPath();ctx.ellipse(18,-6,3,1.8,0.2,0,TAU);ctx.fill();ctx.strokeStyle="rgba(70,50,34,0.9)";ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(10,-14);ctx.quadraticCurveTo(18,-18,26,-14);ctx.stroke();
  ctx.fillStyle="rgb(70,50,36)";ctx.beginPath();ctx.moveTo(-26,-24);ctx.bezierCurveTo(-30,-10,-28,6,-24,10);ctx.lineTo(-20,-16);ctx.closePath();ctx.fill();
  // the bowler: a curled brim, a round crown, a band
  const bg=ctx.createLinearGradient(-30,-80,30,-30);bg.addColorStop(0,"rgb(64,60,62)");bg.addColorStop(1,"rgb(18,16,18)");ctx.fillStyle=bg;
  ctx.beginPath();ctx.ellipse(2,-34,44,9,-0.04,0,TAU);ctx.fill();ctx.beginPath();ctx.moveTo(-28,-36);ctx.bezierCurveTo(-30,-74,34,-74,32,-36);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgb(40,36,40)";ctx.fillRect(-28,-44,60,7);ctx.fillStyle="rgba(255,255,255,0.14)";ctx.beginPath();ctx.ellipse(-8,-58,10,5,-0.5,0,TAU);ctx.fill();
  ctx.restore();ctx.restore();});}

// a wooden cradle on rockers, a blanket and a sleeping baby; it rocks gently
function rw_cradle(ctx,x,y,s,t,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.rotate(0.05*Math.sin(t*1.2));
  ctx.fillStyle="rgba(0,0,0,0.3)";ctx.beginPath();ctx.ellipse(0,40,110,10,0,0,TAU);ctx.fill();
  const wg=ctx.createLinearGradient(0,-60,0,40);wg.addColorStop(0,"rgb(170,112,66)");wg.addColorStop(1,"rgb(96,58,30)");
  ctx.strokeStyle="rgb(110,68,36)";ctx.lineWidth=8;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-110,22);ctx.quadraticCurveTo(0,52,110,22);ctx.stroke();
  ctx.fillStyle=wg;ctx.beginPath();ctx.moveTo(-96,-40);ctx.lineTo(96,-40);ctx.bezierCurveTo(92,0,80,26,60,30);ctx.lineTo(-60,30);ctx.bezierCurveTo(-80,26,-92,0,-96,-40);ctx.fill();
  ctx.beginPath();ctx.moveTo(-96,-40);ctx.bezierCurveTo(-100,-70,-84,-84,-70,-80);ctx.lineTo(-70,-40);ctx.closePath();ctx.fill();
  ctx.strokeStyle="rgba(60,34,16,0.5)";ctx.lineWidth=2;for(let k=-3;k<=3;k++){ctx.beginPath();ctx.moveTo(k*24,-36);ctx.lineTo(k*20,26);ctx.stroke();}
  ctx.fillStyle="rgba(255,230,190,0.25)";ctx.fillRect(-96,-42,192,4);
  // the blanket and the baby's head
  ctx.fillStyle="rgb(214,206,226)";ctx.beginPath();ctx.moveTo(-70,-38);ctx.bezierCurveTo(-40,-60,40,-58,74,-40);ctx.lineTo(74,-34);ctx.lineTo(-70,-34);ctx.closePath();ctx.fill();
  const bh=ctx.createRadialGradient(-50,-58,2,-46,-52,20);bh.addColorStop(0,"rgb(246,214,186)");bh.addColorStop(1,"rgb(206,164,132)");ctx.fillStyle=bh;ctx.beginPath();ctx.arc(-48,-50,17,0,TAU);ctx.fill();
  ctx.strokeStyle="rgba(90,60,40,0.7)";ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(-44,-50,3,0.2,Math.PI-0.2);ctx.stroke();
  ctx.restore();});}

// a punched card, manila, with its cut corner; holes[k] = [column, row] punched as hp[k] goes 0 to 1
function rw_card(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.4)";ctx.shadowBlur=12;ctx.shadowOffsetY=4;
  const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,"rgb(234,216,172)");g.addColorStop(1,"rgb(206,186,140)");ctx.fillStyle=g;const c=Math.min(w,h)*0.14;
  ctx.beginPath();ctx.moveTo(x+c,y);ctx.lineTo(x+w,y);ctx.lineTo(x+w,y+h);ctx.lineTo(x,y+h);ctx.lineTo(x,y+c);ctx.closePath();ctx.fill();ctx.restore();
  if(o.grid!==false){ctx.fillStyle="rgba(120,96,60,0.22)";for(let i=0;i<12;i++)for(let j=0;j<5;j++){ctx.beginPath();ctx.arc(x+w*(0.1+i*0.07),y+h*(0.18+j*0.16),Math.max(1,w*0.005),0,TAU);ctx.fill();}}
  (o.holes||[]).forEach(([i,j],k)=>{const q=o.hp?o.hp[k]||0:1;if(q<=0)return;ctx.fillStyle="rgba(24,16,10,"+(0.9*q)+")";ctx.beginPath();ctx.arc(x+w*(0.1+i*0.07),y+h*(0.18+j*0.16),Math.max(2,w*0.016)*clamp(q*1.5,0,1),0,TAU);ctx.fill();});});}
const RW_HOLES=[[0,1],[2,3],[4,0],[7,2],[10,4]];
// a stack of cards, n of them, slightly askew
function rw_stack(ctx,x,y,w,h,n,a){if(a<=0.01)return;withA(ctx,a,()=>{for(let k=0;k<n;k++){const dx=(hash(k,31)-0.5)*10,dy=-k*3.2;ctx.save();ctx.translate(x+w/2+dx,y+h/2+dy);ctx.rotate((hash(k,32)-0.5)*0.05);
  rw_card(ctx,-w/2,-h/2,w,h,{holes:RW_HOLES.map(([i,j])=>[(i+k*3)%12,(j+k)%5]),grid:false});ctx.restore();}});}
// the pantograph punch: a wooden base, a brass plate of holes, a lever on a pivot with its stylus; at (0..1, 0..1) points into the plate
function rw_punch(ctx,x,y,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const w=560,h=300;
  ctx.save();ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=24;ctx.shadowOffsetY=10;const wg=ctx.createLinearGradient(x,y,x,y+h);wg.addColorStop(0,"rgb(126,78,44)");wg.addColorStop(1,"rgb(72,42,22)");ctx.fillStyle=wg;rr(ctx,x,y,w,h,12);ctx.fill();ctx.restore();
  ctx.strokeStyle="rgba(40,22,10,0.35)";ctx.lineWidth=1.2;for(let k=0;k<9;k++){ctx.beginPath();ctx.moveTo(x+10,y+20+k*31);for(let xx=0;xx<=w-20;xx+=40)ctx.lineTo(x+10+xx,y+20+k*31+Math.sin(xx*0.03+k)*3);ctx.stroke();}
  // the brass plate: a grid of holes, where the operator points
  const px=x+40,py=y+30,pw=300,ph=150,bg=ctx.createLinearGradient(px,py,px+pw,py+ph);bg.addColorStop(0,"rgb(236,200,120)");bg.addColorStop(1,"rgb(150,104,40)");ctx.fillStyle=bg;rr(ctx,px,py,pw,ph,6);ctx.fill();
  ctx.fillStyle="rgba(50,30,10,0.7)";for(let i=0;i<12;i++)for(let j=0;j<5;j++){ctx.beginPath();ctx.arc(px+20+i*23.5,py+20+j*27,4,0,TAU);ctx.fill();}
  // the card holder, under the punches, at the front
  ctx.fillStyle="rgb(46,28,16)";rr(ctx,x+40,y+200,w-80,80,6);ctx.fill();ctx.fillStyle="rgba(255,230,180,0.1)";ctx.fillRect(x+40,y+200,w-80,3);
  // the lever, pivoting at the right; its stylus over the plate
  const at=o.at||[0.5,0.5],sx=px+20+at[0]*11*23.5,sy=py+20+at[1]*4*27-(1-(o.press||0))*6,pvx=x+w-50,pvy=y+90;
  ctx.strokeStyle="rgb(70,70,74)";ctx.lineWidth=12;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(pvx,pvy);ctx.lineTo(sx+10,sy-14);ctx.stroke();ctx.strokeStyle="rgba(255,255,255,0.25)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(pvx,pvy-4);ctx.lineTo(sx+10,sy-18);ctx.stroke();
  ctx.fillStyle="rgb(40,40,44)";ctx.beginPath();ctx.moveTo(sx+4,sy-18);ctx.lineTo(sx+16,sy-10);ctx.lineTo(sx,sy);ctx.closePath();ctx.fill();
  const kg=ctx.createRadialGradient(pvx-4,pvy-4,2,pvx,pvy,18);kg.addColorStop(0,"rgb(200,200,206)");kg.addColorStop(1,"rgb(60,60,66)");ctx.fillStyle=kg;ctx.beginPath();ctx.arc(pvx,pvy,16,0,TAU);ctx.fill();
  return[sx,sy];});return null;}
function rw_stylus(x,y,at,press){const px=x+40,py=y+30;return[px+20+at[0]*11*23.5,py+20+at[1]*4*27-(1-(press||0))*6];}
// a clerk's right hand on the lever's knob, with a white cuff and a dark sleeve, coming in from the upper right
function rw_clerkHand(ctx,x,y,t,a,press){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y-(1-(press||0))*4);
  const sg=ctx.createLinearGradient(20,-120,90,-40);sg.addColorStop(0,"rgb(70,64,70)");sg.addColorStop(1,"rgb(30,28,34)");ctx.fillStyle=sg;
  ctx.beginPath();ctx.moveTo(30,-30);ctx.bezierCurveTo(60,-60,110,-120,160,-170);ctx.lineTo(220,-110);ctx.bezierCurveTo(160,-70,110,-30,70,6);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgb(238,234,224)";ctx.beginPath();ctx.moveTo(22,-24);ctx.lineTo(42,-44);ctx.lineTo(74,-8);ctx.lineTo(54,10);ctx.closePath();ctx.fill();
  const hg=ctx.createLinearGradient(-30,-30,40,20);hg.addColorStop(0,"rgb(238,204,170)");hg.addColorStop(1,"rgb(186,146,114)");ctx.fillStyle=hg;
  ctx.beginPath();ctx.moveTo(30,-30);ctx.bezierCurveTo(10,-40,-18,-30,-26,-10);ctx.bezierCurveTo(-30,4,-22,18,-8,20);ctx.bezierCurveTo(10,26,34,20,50,6);ctx.closePath();ctx.fill();
  ctx.strokeStyle="rgba(120,80,60,0.6)";ctx.lineWidth=1.4;[[-20,-6,-4,-16],[-18,4,0,-4],[-12,14,6,6]].forEach(([a0,b0,a1,b1])=>{ctx.beginPath();ctx.moveTo(a0,b0);ctx.quadraticCurveTo((a0+a1)/2,(b0+b1)/2-4,a1,b1);ctx.stroke();});
  ctx.fillStyle="rgb(220,184,150)";ctx.beginPath();ctx.ellipse(-4,-30,16,8,-0.5,0,TAU);ctx.fill();
  ctx.restore();});}
// Hollerith's tabulator dial: a brass bezel, a face of a hundred divisions, a hand that advances to v (cards counted)
function rw_dial(ctx,x,y,r,v,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=20;ctx.shadowOffsetY=8;
  const bg=ctx.createLinearGradient(x-r,y-r,x+r,y+r);bg.addColorStop(0,"rgb(240,206,130)");bg.addColorStop(1,"rgb(120,82,30)");ctx.fillStyle=bg;ctx.beginPath();ctx.arc(x,y,r+12,0,TAU);ctx.fill();ctx.restore();
  ctx.fillStyle="rgb(238,232,214)";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
  for(let k=0;k<100;k++){const an=-Math.PI/2+k/100*TAU,r0=r*(k%10?0.88:0.8);ctx.strokeStyle=rgba(RW_INK,k%10?0.5:0.85);ctx.lineWidth=k%10?1:2;ctx.beginPath();ctx.moveTo(x+Math.cos(an)*r0,y+Math.sin(an)*r0);ctx.lineTo(x+Math.cos(an)*r*0.95,y+Math.sin(an)*r*0.95);ctx.stroke();}
  for(let k=0;k<10;k++){const an=-Math.PI/2+k/10*TAU;T(ctx,String(k*10),x+Math.cos(an)*r*0.64,y+Math.sin(an)*r*0.64+6,{w:700,size:Math.max(14,r*0.15),align:"center",color:rgba(RW_INK,0.8)});}
  const an=-Math.PI/2+v/100*TAU;ctx.strokeStyle="rgb(40,30,24)";ctx.lineWidth=3.5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x-Math.cos(an)*r*0.12,y-Math.sin(an)*r*0.12);ctx.lineTo(x+Math.cos(an)*r*0.86,y+Math.sin(an)*r*0.86);ctx.stroke();
  ctx.fillStyle="rgb(60,44,30)";ctx.beginPath();ctx.arc(x,y,6,0,TAU);ctx.fill();
  ctx.fillStyle="rgba(255,255,255,0.18)";ctx.beginPath();ctx.ellipse(x-r*0.35,y-r*0.45,r*0.4,r*0.16,-0.6,0,TAU);ctx.fill();});}

/* ---------- the present: cards ---------- */
// a file from the project: its name, the label saying where it runs, and its lines, typed as p goes from 0 to 1.
// o.lit {line: 0..1} lights lines; o.seg [[line, text, a, colour]] lights a phrase; o.wrap wraps long lines under a hanging indent;
// o.mark {line: [glyph drawer, a]} draws an icon in the margin
function rw_code(ctx,x,y,w,name,lines,o){o=o||{};const a=o.a==null?1:o.a,sz=o.size||19,lh=o.lh||30,col=o.edge||[170,205,255],cw=tw(ctx,"M",sz,500,"mono"),lab=o.label===undefined?RW_RUN:o.label;
  const V=[];lines.forEach((l,i)=>{if(!o.wrap||l.length<=o.wrap){V.push({i,s:l});return;}const ind=o.hang===0?"":" ".repeat(l.match(/^\s*/)[0].length+3);let rest=l,first=true;
    while(rest.length){const lim0=first?o.wrap:o.wrap-ind.length,lim=o.balance?Math.min(lim0,Math.ceil(rest.length/Math.ceil(rest.length/lim0))+4):lim0;if(rest.length<=lim){V.push({i,s:(first?"":ind)+rest});break;}let cut=rest.lastIndexOf(" ",lim);if(cut<=0)cut=lim;V.push({i,s:(first?"":ind)+rest.slice(0,cut)});rest=rest.slice(cut).replace(/^ /,"");first=false;}});
  const lb=lab&&36+tw(ctx,name,18,500,"mono")+tw(ctx,lab,18,700)+44>w,h=o.h||(76+V.length*lh+(lb?30:0));if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,14,col,{glow:12+10*(o.hi||0),ea:0.65,fill:"rgba(6,10,20,0.95)"});
    ctx.fillStyle=rgba(col,0.9);rr(ctx,x+16,y+17,10,10,3);ctx.fill();T(ctx,name,x+36,y+29,{f:"mono",w:500,size:18,color:rgba(col,1)});
    if(lab)T(ctx,lab,x+w-20,lb?y+h-16:y+29,{w:700,size:18,align:"right",color:rgba(mix(SOFT,WEED,0.35),1)});
    ctx.fillStyle="rgba(170,200,245,0.14)";ctx.fillRect(x+14,y+46,w-28,1.2);
    const n=o.p==null?V.length:V.length*o.p;V.forEach((v,j)=>{if(j>=n)return;const yy=y+80+j*lh,q=clamp(n-j,0,1),src=lines[v.i],cm=/^\s*(--|#|<!--|\{#)/.test(src),on=o.lit?o.lit[v.i]||0:0;
      if(on>0)withA(ctx,on,()=>{ctx.fillStyle=rgba(o.litCol||TRUST,0.16);rr(ctx,x+12,yy-lh*0.7,w-24,lh*0.95,6);ctx.fill();});
      const c0=cm?rgba(SOFT,0.8):rgba(mix([200,225,255],o.litCol||TRUST,on*0.6),0.95);T(ctx,typeOn(v.s,q),x+22,yy,{f:"mono",w:500,size:sz,color:c0});
      (o.seg||[]).forEach(([li,s,sa,sc])=>{if(li!==v.i||sa<=0)return;const k=v.s.indexOf(s);if(k<0)return;const sx=x+22+cw*k,sw=cw*s.length;
        withA(ctx,sa,()=>{ctx.fillStyle=rgba(sc,0.2);rr(ctx,sx-4,yy-lh*0.68,sw+8,lh*0.9,6);ctx.fill();T(ctx,s,sx,yy,{f:"mono",w:500,size:sz,color:rgba(sc,1)});});});});});return h;}
// a result table, as dbt show prints it: o.cols [[header, width, "l"|"r"]], rows of strings; o.on[i] (0..1) reveals row i;
// o.lit {row: colour}; o.title; o.label
function rw_table(ctx,x,y,cols,rows,o){o=o||{};const a=o.a==null?1:o.a,sz=o.size||19,lh=o.lh||32,w=cols.reduce((s,c)=>s+c[1],0)+40,top=o.title?44:0,h=top+56+rows.length*lh;if(a<=0.01)return[w,h];const col=o.edge||[150,180,220];
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,14,col,{glow:10,ea:0.6,fill:"rgba(6,10,20,0.95)"});
    if(o.title){T(ctx,o.title,x+20,y+30,{f:o.titleMono?"mono":undefined,w:o.titleMono?500:700,size:18,color:rgba(col,1)});if(o.label)T(ctx,o.label,x+w-20,y+30,{w:700,size:18,align:"right",color:rgba(o.labelCol||mix(SOFT,WEED,0.35),1)});}
    let cx=x+20;cols.forEach(([hd,cw,al])=>{T(ctx,hd,al==="r"?cx+cw-10:cx,y+top+34,{f:"mono",w:500,size:sz-1,align:al==="r"?"right":"left",color:rgba(SOFT,0.9)});cx+=cw;});
    ctx.fillStyle="rgba(170,200,245,0.16)";ctx.fillRect(x+14,y+top+48,w-28,1.2);
    rows.forEach((r,i)=>{const q=o.on?o.on[i]==null?1:o.on[i]:1;if(q<=0.01)return;const yy=y+top+56+i*lh+lh*0.68,lc=o.lit&&o.lit[i];
      withA(ctx,q,()=>{if(lc){ctx.fillStyle=rgba(lc,0.16);rr(ctx,x+10,yy-lh*0.72,w-20,lh*0.96,6);ctx.fill();}let cx=x+20;
        cols.forEach(([hd,cw,al],k)=>{T(ctx,r[k],al==="r"?cx+cw-10:cx,yy,{f:"mono",w:500,size:sz,align:al==="r"?"right":"left",color:rgba(lc&&o.litText?lc:INK,0.95)});cx+=cw;});});});});
  return[w,h];}
// a test: its name and what it checks, with a tick (state 1, green), a cross (state -1, red) or nothing (0); s blends between
function rw_test(ctx,x,y,w,name,note,st,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=st>0?mix(SOFT,GOOD,st):st<0?mix(SOFT,RW_RED,-st):SOFT,h=o.h||60;
  withA(ctx,a,()=>{if(Math.abs(st)>0.05)glow(ctx,x+w-34,y+h/2,60,col,0.25*Math.abs(st));glass(ctx,x,y,w,h,h/2,col,{glow:8+10*Math.abs(st),ea:0.75,fill:"rgba(7,12,24,0.95)"});
    T(ctx,name,x+26,y+h/2+7,{f:"mono",w:500,size:19,color:rgba(INK,0.95)});if(note)T(ctx,note,x+w-70,y+h/2+7,{w:700,size:19,align:"right",color:rgba(col,1)});
    if(st>0)tick_(ctx,x+w-34,y+h/2,26,GOOD,st);if(st<0)cross_(ctx,x+w-34,y+h/2,22,RW_RED,-st);});}
// the grain, as one sentence: what a row is in white, and which day in the clock's colour; returns the two parts' centres
function rw_sentence(ctx,cx,cy,sz,o){o=o||{};const a=o.a==null?1:o.a,A=RW_GRAIN+", ",B=o.asat||RW_ASAT,wa=tw(ctx,A,sz,800),wb=tw(ctx,B,sz,800),x0=cx-(wa+wb)/2;
  const pos=[[x0+wa/2-tw(ctx,", ",sz,800)/2,cy],[x0+wa+wb/2,cy]];if(a<=0.01)return pos;
  withA(ctx,a,()=>{if(o.card!==false){const pw=wa+wb+80,ph=sz*2.4;glass(ctx,cx-pw/2,cy-ph/2-sz*0.3,pw,ph,ph/2.4,o.edge||RW_TIME,{glow:14+16*(o.hi||0),ea:0.8,fill:"rgba(7,12,24,0.95)"});}
    const l1=o.l1==null?1:o.l1,l2=o.l2==null?1:o.l2;T(ctx,typeOn(A,o.p1==null?1:o.p1),x0,cy+sz*0.36,{w:800,size:sz,color:rgba(mix(SOFT,INK,l1),1)});
    T(ctx,typeOn(B,o.p2==null?1:o.p2),x0+wa,cy+sz*0.36,{w:800,size:sz,color:rgba(mix(SOFT,RW_TIME,l2),1)});});return pos;}
// a consumer's badge: a round seal in the consumers' green with its icon; under it the name and the word "consumer"
function rw_badge(ctx,x,y,r,kind,name,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glow(ctx,x,y,r*2,RW_CON,0.18+0.2*(o.hi||0));
  ctx.fillStyle="rgba(7,14,18,0.96)";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ring(ctx,x,y,r,RW_CON,1,2.6);ring(ctx,x,y,r-6,RW_CON,0.35,1.2);
  ctx.save();ctx.translate(x,y);const s=r/40;ctx.scale(s,s);ctx.strokeStyle=rgba(RW_CON,1);ctx.fillStyle=rgba(RW_CON,0.9);ctx.lineWidth=2.6;ctx.lineJoin="round";
  if(kind==="planning"){[[-14,6,8],[-2,-2,16],[10,-10,24]].forEach(([bx,by,bh])=>{rr(ctx,bx-4,by-bh/2+8,9,bh,2);ctx.fill();});ctx.beginPath();ctx.moveTo(-20,20);ctx.lineTo(22,20);ctx.stroke();}
  else{rr(ctx,-20,-13,40,28,5);ctx.stroke();ctx.beginPath();ctx.moveTo(-20,-5);ctx.lineTo(20,-5);ctx.stroke();rr(ctx,6,1,16,10,3);ctx.fill();}
  ctx.restore();if(name){const side=o.side;if(side){T(ctx,name,side<0?x-r-16:x+r+16,y+2,{w:800,size:o.size||22,align:side<0?"right":"left"});if(o.sub!==false)T(ctx,o.sub||"consumer",side<0?x-r-16:x+r+16,y+28,{w:600,size:18,align:side<0?"right":"left",color:rgba(SOFT,1)});}
    else{T(ctx,name,x,y+r+30,{w:800,size:o.size||22,align:"center"});if(o.sub!==false)T(ctx,o.sub||"consumer",x,y+r+54,{w:600,size:18,align:"center",color:rgba(SOFT,1)});}}});}
// a date pin: a round head on a short needle, and the date beside it in the clock's colour
function rw_pin(ctx,x,y,label,a,o){o=o||{};if(a<=0.01)return;const col=o.col||RW_TIME;withA(ctx,a,()=>{ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+26);ctx.stroke();
  glow(ctx,x,y,30,col,0.3);ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(x,y,10,0,TAU);ctx.fill();ctx.fillStyle="rgba(255,255,255,0.5)";ctx.beginPath();ctx.arc(x-3,y-3,3,0,TAU);ctx.fill();
  tag(ctx,o.align==="right"?x-22-tw(ctx,label,o.size||20,700)-26:x+22,y+4,label,col,{size:o.size||20});});}
// a person's face in a round frame, outlined in their side's colour
function rw_face(ctx,id,x,y,r,a,o){o=o||{};if(a<=0.01)return;const P=PEOPLE[id],k=r/100;withA(ctx,a,()=>{glow(ctx,x,y,r*1.8,P.edge,0.2+0.25*(o.hi||0));
  ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fillStyle="rgba(12,18,30,0.97)";ctx.fill();ctx.clip();person(ctx,id,x,y-0.1*r+505*k,k/P.build.h,{t:o.t||0,expr:o.expr||"calm",glow:0.2});ctx.restore();
  ring(ctx,x,y,r,P.edge,1,2.6);});}
// the loop of ten steps, small and without its labels; on[i] lights each station
// the ten steps as a small loop: a dashed ellipse of rx by ry, a ring per step, the lit ones filled and glowing
function rw_loop(ctx,x,y,rx,ry,t,on,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(WEED,0.35);ctx.lineWidth=1.6;ctx.setLineDash([4,7]);ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,TAU);ctx.stroke();ctx.restore();
  STEPS10.forEach((_,i)=>{const q=on[i]||0,[px,py]=stepPos(i,x,y,rx,ry),r=10+2*q;if(q>0)glow(ctx,px,py,r*4,WEED,0.45*q);ctx.fillStyle="rgba(7,12,24,0.96)";ctx.beginPath();ctx.arc(px,py,r,0,TAU);ctx.fill();
    if(q>0){ctx.fillStyle=rgba(WEED,0.9*q);ctx.beginPath();ctx.arc(px,py,r*0.62,0,TAU);ctx.fill();}ring(ctx,px,py,r,mix(SOFT,WEED,q),0.55+0.45*q,2);});});}
// a small eye ("seen") and a small clock ("true")
function rw_eye(ctx,x,y,s,col,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(x-s,y);ctx.quadraticCurveTo(x,y-s*0.9,x+s,y);ctx.quadraticCurveTo(x,y+s*0.9,x-s,y);ctx.stroke();ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(x,y,s*0.32,0,TAU);ctx.fill();});}
function rw_clock(ctx,x,y,s,col,a){if(a<=0.01)return;withA(ctx,a,()=>{ring(ctx,x,y,s,col,1,2.2);ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2.2;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-s*0.62);ctx.moveTo(x,y);ctx.lineTo(x+s*0.48,y+s*0.2);ctx.stroke();});}

/* ---------- versions ---------- */
// one award, as stacked versions: [from, to, name]; o.split (0..1) separates the second version from the first; o.lit[i] lights one, o.dim[i] dims one
const RW_GCHI=[["1 Nov 2024","2 Jul 2026","Health Information Management"],["2 Jul 2026","(open)","Health Informatics"]];
function rw_award(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const sp=ease(o.split||0),h=74;withA(ctx,a,()=>{
  [1,0].forEach(i=>{if(i===1&&sp<=0.01)return;const yy=y+(i===1?sp*(h+14):0),lit=o.lit?o.lit[i]||0:0,dim=o.dim?o.dim[i]||0:0,col=mix(KIND,TRUST,lit);
    withA(ctx,(i===1?clamp(sp*3,0,1):1)*(1-0.6*dim),()=>{if(lit>0)glow(ctx,x+w/2,yy+h/2,w*0.5,TRUST,0.22*lit);glass(ctx,x,yy,w,h,14,col,{glow:10+12*lit,ea:0.75,fill:"rgba(7,12,24,0.96)"});
      T(ctx,"SIS|GCHI",x+20,yy+30,{f:"mono",w:500,size:19,color:rgba(RW_KS.SIS,1)});T(ctx,sp>0.5||i===1?RW_GCHI[i][0]+" → "+RW_GCHI[i][1]:"",x+w-20,yy+30,{f:"mono",w:500,size:18,align:"right",color:rgba(RW_TIME,0.95)});
      T(ctx,"Graduate Certificate in "+RW_GCHI[i][2],x+20,yy+60,{w:700,size:20});});});});return y+h+sp*(h+14);}
// the eight learners in Health's certificate, with the credit each held at census (real rows, keys shortened)
const RW_FAN=[["be24d334…",5],["b2620e50…",5],["dfed4e0e…",35],["4d0508d9…",5],["8cb33ef0…",5],["372b5006…",45],["fd6af2a0…",40],["7275464d…",45]];
// Aisha's credit towards her certificate: the six versions the core builds, each from a result (+15) or a credential (+5)
const RW_STEPS=[["2025-10-14","2025-12-05",5,"credential"],["2025-12-05","2026-01-20",20,"result"],["2026-01-20","2026-02-12",25,"credential"],["2026-02-12","2026-02-27",30,"credential"],["2026-02-27","2026-07-03",45,"result"],["2026-07-03","(open)",60,"result"]];
function rw_day(s){const d=new Date(s+"T00:00:00Z");return(d-Date.UTC(2025,9,1))/86400000;}
// the staircase: x from 1 Oct 2025 to 1 Oct 2026; o.p (0..6) steps drawn; o.at: a date line ("YYYY-MM-DD") and its a; o.upTo: steps after it greyed
function rw_stair(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const X=d=>x+w*rw_day(d)/365,Y=v=>y+h-h*v/60,p=o.p==null?6:o.p,col=o.col||TRUST,sz=o.size||20;
  withA(ctx,a,()=>{ctx.strokeStyle=rgba(SOFT,0.4);ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x,y+h);ctx.lineTo(x+w,y+h);ctx.stroke();
    if(o.axis!==false){["Oct","Nov","Dec","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep"].forEach((m,i)=>{const xx=x+w*(i*30.4+15)/365;T(ctx,m,xx,y+h+28,{w:600,size:18,align:"center",color:rgba(SOFT,0.85)});});
      [15,30,45,60].forEach(v=>{ctx.strokeStyle=rgba(SOFT,0.12);ctx.beginPath();ctx.moveTo(x,Y(v));ctx.lineTo(x+w,Y(v));ctx.stroke();T(ctx,String(v),x-12,Y(v)+6,{w:600,size:18,align:"right",color:rgba(SOFT,0.8)});});}
    const lim=o.upTo?rw_day(o.upTo):999;
    RW_STEPS.forEach(([f,to,v,k],i)=>{const q=clamp(p-i,0,1);if(q<=0)return;const x0=X(f),x1=to==="(open)"?x+w:X(to),past=rw_day(f)<=lim,c=past?col:SOFT,yy=Y(v),xe=lerp(x0,x1,ease(q));
      withA(ctx,past?1:0.4,()=>{ctx.fillStyle=rgba(c,0.13);ctx.fillRect(x0,yy,xe-x0,y+h-yy);ctx.strokeStyle=rgba(c,1);ctx.lineWidth=3.2;ctx.beginPath();const pv=i?Y(RW_STEPS[i-1][2]):y+h;ctx.moveTo(x0,pv);ctx.lineTo(x0,yy);ctx.lineTo(xe,yy);ctx.stroke();
        if(o.labels!==false)withA(ctx,clamp(q*2,0,1),()=>T(ctx,String(v),x0+6,yy-10,{w:800,size:sz,color:rgba(c,1)}));
        if(o.kinds&&(o.kinds[i]||0)>0)withA(ctx,o.kinds[i],()=>{const kc=k==="result"?RW_KS.SIS:RW_KC;ctx.fillStyle=rgba(kc,1);ctx.beginPath();ctx.arc(x0,pv,6,0,TAU);ctx.fill();});});});
    if(o.at&&(o.atA||0)>0){const xx=X(o.at);withA(ctx,o.atA,()=>{ctx.save();ctx.setLineDash([6,6]);ctx.strokeStyle=rgba(o.atCol||RW_TIME,0.95);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(xx,y-20);ctx.lineTo(xx,y+h);ctx.stroke();ctx.restore();});}});
  return{X,Y};}
// stacked version cards, as a source keeps them: n behind one front card that names the four version columns
function rw_srcStack(ctx,x,y,w,k,n,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=SRC3[k][1];withA(ctx,a,()=>{
  for(let v=n-1;v>0;v--){withA(ctx,clamp((o.p==null?1:o.p)*n-(n-v),0,1),()=>{ctx.fillStyle="rgba(10,14,24,0.95)";rr(ctx,x+v*10,y-v*10,w,84,12);ctx.fill();ctx.strokeStyle=rgba(col,0.35);ctx.lineWidth=1.5;rr(ctx,x+v*10,y-v*10,w,84,12);ctx.stroke();});}
  glass(ctx,x,y,w,84,12,col,{glow:10,ea:0.8,fill:"rgba(7,12,24,0.97)"});ctx.fillStyle=rgba(col,1);rr(ctx,x+14,y+14,6,24,3);ctx.fill();T(ctx,SRC3[k][0],x+30,y+34,{w:700,size:20});
  ["_valid_from","_valid_to","_is_current","_loaded_at"].forEach((c,i)=>{const cx=x+20+i*(w-40)/4,on=o.cols?o.cols[i]||0:0;T(ctx,c,cx,y+68,{f:"mono",w:500,size:18,color:rgba(mix(mix(SOFT,col,0.4),INK,on),1)});});});}

/* ---------- one timeline from three ---------- */
// the four dates on which one of Aisha's systems changed, placed on a schematic axis (not to scale: two are six days apart)
const RW_TL=[["15 Jul 2025",340],["21 Jul 2025",480],["6 Jan 2026",700],["20 Jul 2026",900]],RW_TLX=[300,1100];
// a band for one source: from its first date to the end of the axis, each segment with its value; p (0..1) draws it from the left
function rw_band(ctx,y,k,segs,p,a,o){o=o||{};if(a<=0.01)return;const col=SRC3[k][1],x0=segs[0][0],xe=lerp(x0,RW_TLX[1],ease(p));withA(ctx,a,()=>{
  ctx.fillStyle=rgba(col,0.2);rr(ctx,x0,y-28,Math.max(0,xe-x0),56,10);ctx.fill();ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2;rr(ctx,x0,y-28,Math.max(0,xe-x0),56,10);ctx.stroke();
  segs.forEach(([sx,v,lx],i)=>{const ex=i+1<segs.length?segs[i+1][0]:RW_TLX[1];if(xe<(lx==null?sx+30:lx+20))return;if(i>0){ctx.strokeStyle=rgba(col,0.9);ctx.beginPath();ctx.moveTo(sx,y-28);ctx.lineTo(sx,y+28);ctx.stroke();}
    T(ctx,v,lx==null?(sx+Math.min(ex,xe))/2:lx,y+7,{f:"mono",w:500,size:20,align:"center",color:rgba(INK,0.95)});});});}

/* ---------- the labs' and scenarios' pictures ----------
   Added to the film bundle's LV registry (Keeping it true's true.js defines it; these keys are prefixed rw_ so they never clash).
   assets/from-words-to-data/learn.js calls each as f(ctx, w, h, state, L): a lab passes its state (compose: {pick}; steps: {step};
   pick: {pick}), a scenario passes {q}. Any words come from L.vis (the page's learn.en.js or learn.es.js), so each language draws its own.
   Each draws in the units the page gives it (a lab: its vw x vh, 960 wide; a scenario: 600 x 320), so its words are sized for the width
   the page really shows: about 640 px for a lab and 470 px for a scenario on a laptop, 356 px on a phone. Labs keep their words at 17
   units or more (about 11 px on a laptop); on a phone (rw_nar) they switch to fewer, bigger words, 30 units or more. Scenarios keep
   theirs at 17 units or more, which stays above 10 px on a phone. */
// a phone: the canvas shows under 560 CSS px wide
function rw_nar(c){const el=c&&c.canvas;return!!el&&(el.clientWidth||960)<560;}
// a pill for a test: its name, its columns under it (one per line), a tick (st 1) or a cross (st -1), and a note; returns its height
function rw_l_test(c,x,y,w,name,cols,st,o){o=o||{};const s=o.size||17,lh=s+5,n=(cols||[]).length,h=s+24+n*lh,col=st>0?GOOD:st<0?RW_RED:SOFT;
  glass(c,x,y,w,h,Math.min(18,h/2),col,{glow:6+8*Math.abs(st),ea:0.8,fill:"rgba(7,12,24,0.95)"});
  T(c,name,x+14,y+s+9,{f:"mono",w:500,size:s});(cols||[]).forEach((l,i)=>T(c,l,x+14,y+s+9+(i+1)*lh,{f:"mono",w:500,size:s,color:rgba(SOFT,1)}));
  if(o.note)T(c,o.note,x+w-s*2.4,y+s+9,{w:700,size:s,align:"right",color:rgba(col,1)});
  if(st>0)tick_(c,x+w-s*1.2,y+h/2,s*1.5,GOOD,1);if(st<0)cross_(c,x+w-s*1.2,y+h/2,s*1.3,RW_RED,1);return h;}
// one version of an award, as a card: its dates (o.fs) and its name (o.ns); lit (gold) or dim, dashed when it's only supposed
function rw_l_ver(c,x,y,w,h,from,to,name,o){o=o||{};const lit=o.lit||0,col=o.col||KIND,fs=o.fs||17,ns=o.ns||19;withA(c,o.dim?0.4:1,()=>{
  if(o.dash){c.save();c.setLineDash([10,8]);c.strokeStyle=rgba(col,0.9);c.lineWidth=2;rr(c,x,y,w,h,12);c.stroke();c.restore();}
  else{if(lit)glow(c,x+w/2,y+h/2,w*0.4,TRUST,0.22);glass(c,x,y,w,h,12,lit?TRUST:col,{glow:8+10*lit,ea:0.8,fill:"rgba(7,12,24,0.96)"});}
  c.fillStyle=rgba(col,1);rr(c,x+10,y+12,6,h-24,3);c.fill();
  T(c,from+" → "+to,x+28,y+h*0.42,{f:"mono",w:500,size:fs,color:rgba(RW_TIME,1)});T(c,name,x+28,y+h*0.42+ns+6,{w:700,size:ns});});}
// a horizontal date axis between two days: X(day as "YYYY-MM-DD") -> x
function rw_l_axis(x0,x1,d0,d1){const a=Date.parse(d0+"T00:00:00Z"),b=Date.parse(d1+"T00:00:00Z");return d=>x0+(x1-x0)*(Date.parse(d+"T00:00:00Z")-a)/(b-a);}
function rw_l_dash(c,x,y0,y1,col,a){c.save();c.globalAlpha*=a==null?1:a;c.setLineDash([7,6]);c.strokeStyle=rgba(col,0.95);c.lineWidth=2;c.beginPath();c.moveTo(x,y0);c.lineTo(x,y1);c.stroke();c.restore();}
// Aisha's credit and status on a day, from the core's versions (credit: core_credit_towards_award_v1; status: core_learner_v1)
function rw_l_aisha(d){let cr=0;RW_STEPS.forEach(([f,to,v])=>{if(f<=d&&(to==="(open)"||to>d))cr=v;});const done=d>="2026-07-20",rem=60-cr;return{cr,rem,done,near:!done&&rem>0&&rem<=15};}
const RW_L_DAYS=["2025-10-14","2026-02-26","2026-03-31","2026-07-03","2026-07-20","2026-09-30"];
// the four changes of the "When was it true?" lab: [took effect, recorded], and the date each way of dating uses (0: took effect, 1: recorded, -1: none to give)
const RW_L_CH=[["2026-03-27","2026-04-03"],["2026-04-20","2026-04-21"],[null,"2026-07-02"],[null,"2026-08-12"]];
const RW_L_BY={rec:[1,1,1,1],eff:[0,0,1,1],all:[0,0,-1,-1],load:[1,1,1,1]};
const RW_L_MON=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
// a date written "1 Nov 2024", with its month in the page's language
function rw_l_d(s,V){return String(s).replace(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/,m=>V.mon[RW_L_MON.indexOf(m)]);}
function rw_l_short(d,V){const m=+d.slice(5,7)-1;return +d.slice(8,10)+" "+V.mon[m];}
const RW_L_TESTS={la:["unique_combination",["learner_key, award_key"]],l:["unique",["learner_key"]],c:["unique",["credential_key"]],lav:["unique_combination",["learner_key,","award_key, valid_from"]]};
Object.assign(LV,{
  // Declare the grain: three outputs, each with the grain sentence built so far, the test it becomes, and Aisha's rows
  rw_l_grain:(c,w,h,st,L)=>{const V=L.vis,pick=st.pick||[],lab=(L.labs||[]).find(x=>x.id==="grain");if(!lab)return;const S=lab.w.slots;
    const opt=i=>pick[i]==null?null:S[i].opts[pick[i]];
    const notes=k=>{const a=opt(k*2),d=opt(k*2+1);return[a&&!a.ok?V.whatNote[k][a.k]:null,d&&!d.ok?V.dayNote[k][d.k]:null].filter(Boolean);};
    const okOf=k=>{const a=opt(k*2),d=opt(k*2+1);return a&&d?(a.ok&&d.ok?1:-1):0;};
    if(rw_nar(c)){let y=8;[0,1,2].forEach(k=>{const a=opt(k*2),ok=okOf(k),col=ok>0?GOOD:ok<0?RW_RED:RW_CON,ts=a?RW_L_TESTS[a.k]:null,nt=notes(k).slice(0,1);
        const nl=nt.length?wrapT(c,nt[0],28,0,900,{w:700,size:30,measure:true}).length:0,bh=62+(ts?44:0)+nl*38+(nl?10:0);
        glass(c,6,y,948,bh,16,col,{glow:6,ea:0.7,fill:"rgba(7,12,24,0.92)"});T(c,V.outputs[k],28,y+46,{w:800,size:34});
        if(ok>0)tick_(c,910,y+34,40,GOOD,1);if(ok<0)cross_(c,910,y+34,32,RW_RED,1);let yy=y+46;
        if(ts){yy+=44;const full=ts[0]+" "+ts[1].join(" ");T(c,tw(c,full,30,500,"mono")<=900?full:ts[1].join(" "),28,yy,{f:"mono",w:500,size:30,color:rgba(SOFT,1)});}
        if(nl){wrapT(c,nt[0],28,yy+42,900,{w:700,size:30,lh:38,color:rgba(EDGE_,1)});}
        y+=bh+10;});return;}
    [0,1,2].forEach(k=>{const x=6+k*318,y=6,cw=306,a=opt(k*2),d=opt(k*2+1);glass(c,x,y,cw,h-12,16,RW_CON,{glow:8,ea:0.6,fill:"rgba(7,12,24,0.92)"});
      rw_badge(c,x+28,y+32,17,k?"wallet":"planning","",{});T(c,V.outputs[k],x+54,y+39,{w:800,size:Math.max(17,Math.min(20,20*(cw-66)/tw(c,V.outputs[k],20,800)))});
      let yy=y+88;yy+=27*wrapT(c,V.perRow+" "+(a?V.what[a.k]:"…")+",",x+16,yy,cw-32,{w:800,size:22,lh:27,color:rgba(a?(a.ok?INK:EDGE_):SOFT,1)}).length;
      yy+=27*wrapT(c,d?V.day[d.k]:"…",x+16,yy,cw-32,{w:800,size:22,lh:27,color:rgba(d?(d.ok?RW_TIME:EDGE_):SOFT,1)}).length-8;
      const ts=a?RW_L_TESTS[a.k]:["…",[]];yy+=rw_l_test(c,x+12,yy,cw-24,ts[0],ts[1],okOf(k),{size:17})+30;
      T(c,V.aisha[k],x+16,yy,{w:700,size:17,color:rgba(SOFT,1)});yy+=26;
      const R=a?V.rows[k][a.k]||[]:[];R.forEach((r,i)=>{const gone=r[0]==="-",s=gone?r.slice(1):r,ry=yy+i*22;withA(c,gone?0.6:1,()=>{T(c,s,x+16,ry,{f:"mono",w:500,size:17,color:rgba(gone?EDGE_:INK,1)});
        if(gone){c.strokeStyle=rgba(EDGE_,0.9);c.lineWidth=2;c.beginPath();c.moveTo(x+14,ry-6);c.lineTo(x+18+tw(c,s,17,500,"mono"),ry-6);c.stroke();}});});
      yy+=R.length*22+12;notes(k).forEach(s=>{yy+=21*wrapT(c,s,x+16,yy,cw-32,{w:700,size:17,lh:21,color:rgba(EDGE_,1)}).length+6;});});},
  // Fan-out: the award's versions on the left, Health's eight learners on the right, a chip for each version a learner meets
  rw_l_fan:(c,w,h,st,L)=>{const V=L.vis,k=st.step||0;
    const VC=[KIND,RW_AMB,EDGE_],mode=["one","key","at","key","latest"][k],nv=k===0?1:k===3?3:2,meets=mode==="key"?nv:1,which=mode==="latest"?1:0;
    const vers=[[rw_l_d("1 Nov 2024",V),k===0?"(open)":rw_l_d("2 Jul 2026",V),V.names[0]],[rw_l_d("2 Jul 2026",V),k===3?V.later:"(open)",V.names[1]],[V.later,"(open)",V.names[2]]];
    const lit=i=>(mode==="at"&&i===0)||(mode==="latest"&&i===1),dim=i=>(mode==="at"||mode==="latest")&&!lit(i),mcol=mode==="key"?RW_RED:mode==="one"?SOFT:mode==="at"?GOOD:RW_AMB;
    const rows=8*meets,pts=RW_FAN.reduce((s,[,cp])=>s+cp,0)*meets,bad=rows>8,note=bad?rows+" "+V.rows_+" · 8 "+V.learners:"";
    const note2=mode==="at"?[V.validAt,TRUST]:mode==="latest"?[V.wrongName,RW_AMB]:k===3?[V.stillEight,SOFT]:null;
    if(rw_nar(c)){for(let i=0;i<nv;i++)withA(c,dim(i)?0.4:1,()=>T(c,vers[i][2],24,48+i*44,{w:700,size:30,color:rgba(lit(i)?TRUST:VC[i],1)}));
      tag(c,24,200,V.modes[mode],mcol,{size:30});
      [[rows,V.rows_],[8,V.learners],[pts,V.points]].forEach(([n,s],i)=>{const x=24+i*310;T(c,String(n),x,306,{w:800,size:58,color:rgba(i!==1&&bad?RW_RED:INK,1)});T(c,s,x,346,{w:600,size:30,color:rgba(SOFT,1)});});
      rw_l_test(c,16,374,928,"unique_combination",[],bad?-1:1,{size:30,note});return;}
    T(c,"SIS|GCHI",16,30,{f:"mono",w:500,size:20,color:rgba(RW_KS.SIS,1)});T(c,V.versionsOf,130,30,{w:700,size:18,color:rgba(SOFT,1)});
    for(let i=0;i<nv;i++)rw_l_ver(c,16,46+i*74,424,66,vers[i][0],vers[i][1],vers[i][2],{col:VC[i],lit:lit(i)?1:0,dim:dim(i),dash:i===2});
    tag(c,16,292,V.modes[mode],mcol,{size:18});if(note2)wrapT(c,note2[0],16,336,424,{w:700,size:18,lh:23,color:rgba(note2[1],1)});
    RW_FAN.forEach(([key,cp],i)=>{const y=44+i*33;T(c,key,470,y+6,{f:"mono",w:500,size:17,color:rgba(INK,0.9)});
      for(let j=0;j<meets;j++){const vi=mode==="key"?j:which,x=600+j*64;glass(c,x,y-14,56,27,8,VC[vi],{glow:5,ea:0.8,fill:"rgba(7,12,24,0.95)"});T(c,String(cp),x+28,y+6,{f:"mono",w:500,size:17,align:"center",color:rgba(VC[vi],1)});}});
    [[rows,V.rows_],[8,V.learners],[pts,V.points]].forEach(([n,s],i)=>{const x=470+i*160;T(c,String(n),x,334,{w:800,size:36,color:rgba(i!==1&&bad?RW_RED:INK,1)});T(c,s,x,358,{w:600,size:17,color:rgba(SOFT,1)});});
    rw_l_test(c,470,378,476,"unique_combination",["learner_key, award_key"],bad?-1:1,{size:17,note});},
  // As at census: Aisha's credit staircase with a date line on the step's day; her credit, status and whether she counts beside it
  rw_l_asat:(c,w,h,st,L)=>{const V=L.vis,k=st.step||0,d=RW_L_DAYS[k],A=rw_l_aisha(d),cc=A.near?GOOD:SOFT;
    if(rw_nar(c)){const P=rw_stair(c,40,40,400,350,0,{at:d,atA:1,upTo:d,axis:false,labels:false});rw_l_dash(c,P.X("2026-03-31"),24,390,RW_TIME,k===2?0:0.45);
      let y=52;y+=36*wrapT(c,V.dayLabel[k],480,y,460,{w:800,size:30,lh:36,color:rgba(RW_TIME,1)}).length+48;
      T(c,A.cr+" "+V.of60,480,y,{w:800,size:60});y+=42;T(c,A.rem>0?A.rem+" "+V.toGo:V.none,480,y,{w:600,size:30,color:rgba(SOFT,1)});
      y+=56;T(c,A.done?V.completed:V.studying,480,y,{w:800,size:34});tag(c,480,y+62,A.near?V.counted:V.notCounted,cc,{size:28});return;}
    wrapT(c,V.credit,16,30,928,{w:800,size:19});const X0=56,Y0=80,W0=540,H0=280;
    const P=rw_stair(c,X0,Y0,W0,H0,0,{at:d,atA:1,upTo:d,axis:false,size:17});
    V.months.forEach((m,i)=>T(c,m,X0+W0*(i*30.4+15)/365,Y0+H0+26,{w:600,size:17,align:"center",color:rgba(SOFT,0.9)}));
    [15,30,45,60].forEach(v=>{c.strokeStyle=rgba(SOFT,0.12);c.lineWidth=1;c.beginPath();c.moveTo(X0,P.Y(v));c.lineTo(X0+W0,P.Y(v));c.stroke();T(c,String(v),X0-10,P.Y(v)+6,{w:600,size:17,align:"right",color:rgba(SOFT,0.85)});});
    rw_l_dash(c,P.X("2026-03-31"),Y0-18,Y0+H0,RW_TIME,k===2?0:0.45);if(k!==2)T(c,V.census,P.X("2026-03-31"),Y0-24,{w:700,size:17,align:"center",color:rgba(RW_TIME,0.8)});
    const x=626,y=52;glass(c,x,y,320,h-60,16,cc,{glow:8,ea:0.7,fill:"rgba(7,12,24,0.95)"});
    let yy=y+36;yy+=24*wrapT(c,V.dayLabel[k],x+20,yy,284,{w:800,size:20,lh:24,color:rgba(RW_TIME,1)}).length+34;
    T(c,A.cr+" "+V.of60,x+20,yy,{w:800,size:40});yy+=28;T(c,A.rem>0?A.rem+" "+V.toGo:V.none,x+20,yy,{w:600,size:18,color:rgba(SOFT,1)});
    yy+=40;T(c,V.status,x+20,yy,{w:600,size:17,color:rgba(SOFT,1)});yy+=28;T(c,A.done?V.completed:V.studying,x+20,yy,{w:800,size:22});
    yy+=42;tag(c,x+20,yy,A.near?V.counted:V.notCounted,cc,{size:18});
    if(k===5)wrapT(c,V.wallet,x+20,yy+44,284,{w:700,size:17,lh:21,color:rgba(RW_CON,1)});},
  // When was it true? Four changes on one axis: a clock where the system says when it took effect, an eye where it was recorded;
  // the date the chosen rule uses, lit; and Business's count on census day against the report
  rw_l_when:(c,w,h,st,L)=>{const V=L.vis,by=RW_L_BY[st.pick]||RW_L_BY.rec,load=st.pick==="load",n=load?"?":by[0]===0?3:4,ok=n===3;
    if(rw_nar(c)){RW_L_CH.forEach(([eff,rec],i)=>{const y=56+i*70,u=by[i],dd=u===0?eff:u===1?rec:null;T(c,V.changes[i],16,y,{w:700,size:30});
        if(dd){if(u===0)rw_clock(c,790,y-10,13,TRUST,1);else rw_eye(c,790,y-10,15,TRUST,1);T(c,rw_l_short(dd,V),944,y,{w:800,size:30,align:"right",color:rgba(TRUST,1)});}
        else T(c,"?",944,y,{w:800,size:36,align:"right",color:rgba(RW_AMB,1)});});
      glass(c,8,326,944,126,16,ok?GOOD:RW_RED,{glow:10,ea:0.8,fill:"rgba(7,12,24,0.95)"});T(c,V.business,30,374,{w:700,size:30,color:rgba(SOFT,1)});
      T(c,V.report+" 3",30,426,{w:700,size:30,color:rgba(SOFT,1)});T(c,String(n),700,416,{w:800,size:72,align:"center",color:rgba(ok?GOOD:RW_AMB,1)});
      if(ok)tick_(c,880,388,48,GOOD,1);else cross_(c,880,388,40,RW_RED,1);return;}
    const X=rw_l_axis(250,716,"2026-03-15","2026-08-31");
    ["2026-04-01","2026-05-01","2026-06-01","2026-07-01","2026-08-01"].forEach(d=>{c.strokeStyle=rgba(SOFT,0.14);c.lineWidth=1;c.beginPath();c.moveTo(X(d),48);c.lineTo(X(d),380);c.stroke();T(c,V.mon[+d.slice(5,7)-1],X(d)+5,404,{w:600,size:17,color:rgba(SOFT,0.9)});});
    rw_l_dash(c,X("2026-03-31"),40,384,RW_TIME,1);T(c,V.census,X("2026-03-31"),30,{w:700,size:17,align:"center",color:rgba(RW_TIME,1)});
    RW_L_CH.forEach(([eff,rec],i)=>{const y=86+i*84,u=by[i];const nl=wrapT(c,V.changes[i],12,0,224,{w:700,size:17,measure:true}).length;wrapT(c,V.changes[i],12,y+6-(nl-1)*11,224,{w:700,size:17,lh:22});
      c.strokeStyle=rgba(SOFT,0.3);c.lineWidth=1.5;c.beginPath();c.moveTo(250,y);c.lineTo(716,y);c.stroke();
      if(eff)rw_clock(c,X(eff),y-22,9,u===0?TRUST:SOFT,1);rw_eye(c,X(rec),y+22,10,u===1?TRUST:SOFT,1);
      const dd=u===0?eff:u===1?rec:null;
      if(dd){glow(c,X(dd),y,24,TRUST,0.4);c.fillStyle=rgba(TRUST,1);c.beginPath();c.arc(X(dd),y,6,0,TAU);c.fill();
        const lf=i===3||dd<"2026-03-31";T(c,rw_l_short(dd,V),X(dd)+(lf?-14:14),y-6,{w:800,size:17,align:lf?"right":"left",color:rgba(TRUST,1)});}
      else T(c,"?",X(rec)+16,y+6,{w:800,size:24,color:rgba(RW_AMB,1)});
      if(load&&i<2)T(c,V.loaded[i],X(rec)+16,y+28,{w:600,size:17,color:rgba(RW_AMB,1)});});
    glass(c,738,48,210,212,16,ok?GOOD:RW_RED,{glow:10,ea:0.8,fill:"rgba(7,12,24,0.95)"});
    const bl=wrapT(c,V.business,756,80,180,{w:700,size:18,lh:22,color:rgba(SOFT,1)}).length;
    T(c,String(n),756,150+bl*10,{w:800,size:54,color:rgba(ok?GOOD:RW_AMB,1)});T(c,V.report+" 3",756,236,{w:700,size:18,color:rgba(SOFT,1)});
    if(ok)tick_(c,910,134+bl*10,30,GOOD,1);else cross_(c,910,134+bl*10,26,RW_RED,1);
    rw_clock(c,752,300,9,SOFT,1);T(c,V.tookEffect,770,306,{w:600,size:17,color:rgba(SOFT,1)});rw_eye(c,752,334,10,SOFT,1);T(c,V.recorded,770,340,{w:600,size:17,color:rgba(SOFT,1)});
    c.fillStyle=rgba(TRUST,1);c.beginPath();c.arc(752,368,6,0,TAU);c.fill();T(c,V.dates,770,374,{w:600,size:17,color:rgba(SOFT,1)});},
  // the scenarios, drawn in the 600 x 320 the page gives them
  rw_q_double:(c,w,h,st,L)=>{const V=L.vis;
    RW_FAN.forEach(([key,cp],i)=>{const y=38+i*35;T(c,key,24,y+6,{f:"mono",w:500,size:17});[KIND,RW_AMB].forEach((col,j)=>{const x=160+j*64;glass(c,x,y-14,56,27,8,col,{glow:5,ea:0.8,fill:"rgba(7,12,24,0.95)"});T(c,String(cp),x+28,y+6,{f:"mono",w:500,size:17,align:"center",color:rgba(col,1)});});});
    T(c,"370",440,110,{w:800,size:60,align:"center",color:rgba(RW_RED,1)});T(c,V.dashboard,440,140,{w:600,size:18,align:"center",color:rgba(SOFT,1)});
    T(c,"185",440,232,{w:800,size:60,align:"center",color:rgba(GOOD,1)});T(c,V.byHand,440,262,{w:600,size:18,align:"center",color:rgba(SOFT,1)});},
  rw_q_app:(c,w,h,st,L)=>{const V=L.vis;
    rw_badge(c,150,70,36,"planning",V.planning,{sub:false,size:20});rw_pin(c,100,170,rw_l_d("31 Mar 2026",V),1,{size:18});T(c,"12",150,276,{w:800,size:48,align:"center",color:rgba(RW_TIME,1)});
    rw_badge(c,450,70,36,"wallet",V.walletApp,{sub:false,size:20});rw_pin(c,410,170,V.today,1,{size:18});T(c,"?",450,276,{w:800,size:48,align:"center",color:rgba(RW_AMB,1)});
    arrowTo(c,206,260,404,260,RW_AMB,0.8,{head:12});},
  rw_q_rename:(c,w,h,st,L)=>{const V=L.vis;
    rw_l_ver(c,20,24,350,70,rw_l_d("1 Nov 2024",V),rw_l_d("2 Jul 2026",V),V.names[0],{col:KIND,fs:17,ns:17});rw_l_ver(c,20,108,350,70,rw_l_d("2 Jul 2026",V),"(open)",V.names[1],{col:RW_AMB,lit:1,fs:17,ns:17});
    glass(c,400,24,180,154,14,TRUST,{glow:8,ea:0.7,fill:"rgba(7,12,24,0.95)"});T(c,V.report,416,54,{w:800,size:20});T(c,rw_l_d("31 Mar 2026",V),416,80,{f:"mono",w:500,size:17,color:rgba(RW_TIME,1)});
    wrapT(c,V.names[1]+"?",416,114,150,{w:700,size:19,lh:23,color:rgba(RW_AMB,1)});arrowTo(c,372,150,398,132,RW_AMB,0.8,{head:10});
    T(c,V.rebuilt,300,250,{w:700,size:22,align:"center",color:rgba(SOFT,1)});},
  rw_q_backdate:(c,w,h,st,L)=>{const V=L.vis,X=rw_l_axis(40,560,"2026-03-15","2026-04-30");
    c.strokeStyle=rgba(SOFT,0.4);c.lineWidth=1.5;c.beginPath();c.moveTo(40,206);c.lineTo(560,206);c.stroke();
    [["2026-03-31",V.census,RW_TIME,"right",8],["2026-04-14",V.published,TRUST,"left",-8]].forEach(([d,s,col,al,dx])=>{rw_l_dash(c,X(d),48,216,col,1);T(c,s,X(d)+dx,36,{w:700,size:18,align:al,color:rgba(col,1)});});
    rw_clock(c,X("2026-03-25"),186,12,SOFT,1);T(c,rw_l_short("2026-03-25",V),X("2026-03-25"),236,{w:700,size:18,align:"center",color:rgba(SOFT,1)});
    rw_eye(c,X("2026-04-20"),186,13,SOFT,1);T(c,rw_l_short("2026-04-20",V),X("2026-04-20"),236,{w:700,size:18,align:"center",color:rgba(SOFT,1)});
    glass(c,X("2026-04-20")-44,74,88,40,10,RW_AMB,{glow:8,ea:0.8,fill:"rgba(7,12,24,0.95)"});T(c,"WD",X("2026-04-20"),101,{f:"mono",w:500,size:20,align:"center",color:rgba(RW_AMB,1)});
    arrowTo(c,X("2026-04-20")-48,104,X("2026-03-25")+14,172,RW_AMB,0.8,{head:10,bend:0.15});
    T(c,V.mart+" 1",160,290,{w:800,size:20,align:"center",color:rgba(RW_AMB,1)});T(c,V.report+" 2",440,290,{w:800,size:20,align:"center",color:rgba(TRUST,1)});},
  rw_q_months:(c,w,h,st,L)=>{const V=L.vis,P=rw_stair(c,50,70,500,190,0,{axis:false,labels:false});
    ["2025-10-31","2025-11-30","2025-12-31","2026-01-31","2026-02-28","2026-03-31","2026-04-30","2026-05-31","2026-06-30","2026-07-31","2026-08-31"].forEach(d=>{const x=P.X(d),A=rw_l_aisha(d);rw_l_dash(c,x,58,260,RW_TIME,0.6);
      c.fillStyle=rgba(RW_TIME,1);c.beginPath();c.arc(x,P.Y(A.cr),5,0,TAU);c.fill();});
    T(c,V.monthEnds,300,40,{w:800,size:22,align:"center",color:rgba(RW_TIME,1)});T(c,V.oneDay,300,298,{w:700,size:19,align:"center",color:rgba(SOFT,1)});},
  rw_q_current:(c,w,h,st,L)=>{const V=L.vis,card=(x,y,cw,name,lines,edge,lab,lit)=>{const ch=46+lines.length*26+(lab?28:0);glass(c,x,y,cw,ch,12,edge,{glow:8,ea:0.7,fill:"rgba(6,10,20,0.95)"});
      T(c,name,x+14,y+26,{f:"mono",w:500,size:17,color:rgba(edge,1)});c.fillStyle="rgba(170,200,245,0.14)";c.fillRect(x+10,y+36,cw-20,1);
      lines.forEach((l,i)=>{const ly=y+62+i*26;if(lit===i){c.fillStyle=rgba(RW_AMB,0.16);rr(c,x+8,ly-19,cw-16,25,5);c.fill();}T(c,l,x+14,ly,{f:"mono",w:500,size:17,color:rgba(lit===i?RW_AMB:[200,225,255],1)});});
      if(lab)T(c,lab,x+cw-14,y+ch-12,{w:700,size:17,align:"right",color:rgba(mix(SOFT,WEED,0.35),1)});return ch;};
    card(16,12,330,"stg_student_system__learners",["status_code     WD","effective_date  "+V.nextWeek,"_is_current     true"],SRC3[0][1],null,2);
    rw_pin(c,380,40,V.today,1,{size:18});rw_clock(c,392,104,12,RW_TIME,1);wrapT(c,V.notYet,412,110,180,{w:700,size:18,lh:22,color:rgba(RW_TIME,1)});
    card(16,172,568,"models/core/core_learner.sql",["{{ valid_at(as_is_date(), 'timeline.valid_from',","    'timeline.valid_to') }} as is_current,"],TRUST,RW_RUN);},
  rw_q_fixes:(c,w,h,st,L)=>{const V=L.vis;
    rw_l_ver(c,20,20,350,70,rw_l_d("1 Nov 2024",V),rw_l_d("2 Jul 2026",V),V.names[0],{col:KIND,fs:17,ns:17});rw_l_ver(c,20,102,350,70,rw_l_d("2 Jul 2026",V),"(open)",V.names[1],{col:RW_AMB,fs:17,ns:17});
    rw_l_test(c,20,196,350,"unique_combination",["learner_key, award_key"],-1,{size:17});T(c,"16",480,110,{w:800,size:60,align:"center",color:rgba(RW_RED,1)});
    T(c,V.rowsFor8,480,140,{w:600,size:18,align:"center",color:rgba(SOFT,1)});T(c,"?",480,250,{w:800,size:52,align:"center",color:rgba(RW_AMB,1)});},
  rw_q_overlap:(c,w,h,st,L)=>{const V=L.vis,X=rw_l_axis(40,560,"2026-03-01","2026-05-01");
    glass(c,X("2026-03-01"),40,X("2026-04-04")-X("2026-03-01"),48,10,SRC3[0][1],{glow:6,ea:0.8,fill:"rgba(7,12,24,0.95)"});T(c,V.version+" 1",X("2026-03-01")+14,71,{w:700,size:19});
    glass(c,X("2026-04-03"),104,X("2026-05-01")-X("2026-04-03"),48,10,SRC3[0][1],{glow:6,ea:0.8,fill:"rgba(7,12,24,0.95)"});T(c,V.version+" 2",X("2026-04-03")+20,135,{w:700,size:19});
    c.fillStyle=rgba(RW_RED,0.35);c.fillRect(X("2026-04-03"),30,X("2026-04-04")-X("2026-04-03"),132);rw_l_dash(c,X("2026-04-03"),24,170,RW_RED,1);
    T(c,V.overlap,X("2026-04-03"),200,{w:800,size:20,align:"center",color:rgba(RW_RED,1)});rw_l_test(c,130,236,340,"versions_do_not_overlap",[],-1,{size:17});}
});
