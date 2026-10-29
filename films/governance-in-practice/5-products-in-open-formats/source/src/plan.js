/* ===== Products in open formats: the places and the pictures =====
   The places are painted once and kept (data governance's shared/src/finish.js): Noor's room, wide, its map close, and a board and a
   screen on its wall; the Faculty of Health, close at Anil's desk, by day and at dawn; Planning's office, close at Clara's desk; the
   data team's desk from above, for the files; a big screen on a desk, on Noor's, the data team's, the platform team's or the faculty's
   wall; the platform team's room, close at Sam's desk; and the data team's board. The pictures are the film's own things, drawn with
   the series' pieces (shared/src/tools.js): the six products, as stalls under their awnings, as A product with an owner drew them; a
   catalogue's card, typed by hand; files from the example project, with their line numbers; a pull request's checks, and the impact
   check's report; the two standards, as books; Ontos's pages, drawn as forms; and the copy that goes one way. Every name starts with
   gp_ or GP_. */

/* ---------- helpers ---------- */
// made once per chapter, the first time it draws: its cues are known by then
const gp_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// shots in a row in the same place share one camera, so a dissolve between them never lays the place over itself at another size or
// framing: if each holds still, one slow push over the whole run; if one moves, all follow the same keys. hold: no push on the last
// run, when the next chapter opens in the same place
function gp_run(shots,end,hold){const out=shots.map(s=>Object.assign({},s));
  for(let i=0;i<out.length;){let j=i;while(j+1<out.length&&out[j+1].place===out[i].place)j++;const R=out.slice(i,j+1),last=j===out.length-1;
    if(j>i||(hold&&last)){const t1=last?end:out[j+1].at,keys=[].concat(...R.map(s=>s.keys)).sort((a,b)=>a[0]-b[0]),k0=keys[0],
        still=keys.every(k=>k[1]===k0[1]&&k[2]===k0[2]&&k[3]===k0[3]),push=hold&&last?0:R[0].push==null?0.025:R[0].push;
      const cam=still?{keys:[k0,[k0[0]+0.01,k0[1],k0[2],k0[3]*(1+push)]],d:Math.max(1.4,t1-k0[0]),push:0}:{keys,d:Math.max(...R.map(s=>s.d||1.6)),push:0};
      R.forEach(s=>Object.assign(s,cam));}
    i=j+1;}
  return out;}
// a pencil arrow along a curve from a to b, bowed by bend (px, up when negative; o.bx bows it sideways), drawn on as p goes 0 to 1
function gp_arrow(ctx,a,b,bend,p,o){o=o||{};if(p<=0)return;const c=[(a[0]+b[0])/2+(o.bx||0),(a[1]+b[1])/2+bend],n=28,m=Math.max(2,Math.round(n*clamp(p,0,1))),pt=u=>{const v=1-u;
    return[v*v*a[0]+2*v*u*c[0]+u*u*b[0],v*v*a[1]+2*v*u*c[1]+u*u*b[1]];};
  ctx.save();ctx.strokeStyle=rgba(o.col||WC_PENCIL,o.a==null?0.9:o.a);ctx.lineWidth=o.lw||4;ctx.lineCap="round";ctx.lineJoin="round";if(o.dash)ctx.setLineDash(o.dash);ctx.beginPath();
  for(let i=0;i<=m;i++){const [x,y]=pt(i/n);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();ctx.setLineDash([]);
  if(p>=1&&o.head!==false){const [x1,y1]=pt(1),[x0,y0]=pt(0.93),an=Math.atan2(y1-y0,x1-x0);ctx.beginPath();ctx.moveTo(x1-16*Math.cos(an-0.5),y1-16*Math.sin(an-0.5));
    ctx.lineTo(x1,y1);ctx.lineTo(x1-16*Math.cos(an+0.5),y1-16*Math.sin(an+0.5));ctx.stroke();}ctx.restore();}
// a red question mark, settling with a spring
function gp_redQ(ctx,x,y,s,p){if(p<=0)return;const k=spring(p);ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,clamp(p*2,0,1),()=>wc_T(ctx,"?",0,0,{w:800,size:s,align:"center",col:GV.redInk}));ctx.restore();}
// until now: the colours fade a little, warmer and paler (as Who may see it draws a memory)
function gp_memory(ctx,a){if(a<=0.01)return;ctx.save();ctx.globalCompositeOperation="saturation";ctx.fillStyle=rgba([128,128,128],0.6*a);ctx.fillRect(-W,-H,3*W,3*H);
  ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba([248,230,204],0.7*a);ctx.fillRect(-W,-H,3*W,3*H);ctx.globalCompositeOperation="source-over";ctx.fillStyle=rgba(WC_PAPER,0.22*a);ctx.fillRect(-W,-H,3*W,3*H);ctx.restore();}
// a paper veil: the picture steps back (a, 0 to 1), as something had to change
function gp_veil(ctx,a){if(a<=0.01)return;ctx.save();ctx.fillStyle=rgba(WC_PAPER,0.45*clamp(a,0,1));ctx.fillRect(-W,-H,3*W,3*H);ctx.restore();}
// a thing coming in: it rises a little and settles (a, 0 to 1); fn draws it
function gp_rise(ctx,a,fn,dy){if(a<=0.01)return;ctx.save();ctx.translate(0,(dy==null?14:dy)*(1-easeCam(clamp(a,0,1))));withA(ctx,clamp(a*1.6,0,1),fn);ctx.restore();}
// a thread from a to b, drawn on as p goes 0 to 1, with a knot at each end: gold, unless o.col says
function gp_thread(ctx,a,b,p,o){o=o||{};if(p<=0)return;const col=o.col||GV.goldInk,al=o.a==null?1:o.a;
  gp_arrow(ctx,a,b,o.bend==null?-30:o.bend,p,{col,lw:o.lw||4.5,head:false,a:0.85*al,bx:o.bx,dash:o.dash});
  ctx.save();ctx.globalAlpha*=al;ctx.fillStyle=rgba(col,0.95);ctx.beginPath();ctx.arc(a[0],a[1],6,0,TAU);ctx.fill();if(p>=1&&!o.open){ctx.beginPath();ctx.arc(b[0],b[1],6,0,TAU);ctx.fill();}ctx.restore();}
// a pill: words on a rounded card, as wide as they are; x its left, y its middle; o.wash colours it. Returns its width
function gp_pill(ctx,x,y,s,o){o=o||{};const size=o.size||28,wt=o.w||700,w=Math.round(tw(ctx,s,size,wt,o.f)+44),h=size+22;
  wc_panel(ctx,x,y-h/2,w,h,{kind:"pill",wash:o.wash,washA:o.washA==null?0.35:o.washA,seed:o.seed||s.length+7});wc_T(ctx,s,x+22,y+size*0.36,{w:wt,size,f:o.f,col:o.col||WC_DARK});return w;}
// a name plate, as Fixed where it starts sets one: springs in at t0, goes at t1
function gp_plate(ctx,t,t0,t1,x,y,lines){const a=t1==null?fin(t,t0,0.4):gv_io(t,t0,t1,0.4);if(a<=0.01)return;
  const w=Math.round(Math.max(tw(ctx,lines[0],30,800),tw(ctx,lines[1],28,600))+48),h=96,k=0.92+0.08*spring(fin(t,t0,0.5));
  ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,a,()=>{wc_panel(ctx,-w/2,-h/2,w,h,{kind:"card",seed:w});wc_T(ctx,lines[0],0,-6,{w:800,size:30,align:"center",col:WC_DARK});
    wc_T(ctx,lines[1],0,32,{w:600,size:28,align:"center",col:WC_MUTED});});ctx.restore();}
// a file sheet sliding up from below the frame to y as u goes 0 to 1; o passes on to gu_file
function gp_file(ctx,x,y,w,u,o){if(u<=0.01)return{rows:[],tx:x+GU_F.gut,h:0};u=clamp(u,0,1);
  return gu_file(ctx,x,y+36*(1-easeCam(u)),w,Object.assign({},o,{a:clamp(u*1.6,0,1)*(o.a==null?1:o.a)}));}
// a small tag on a generated file, "generated", in the technical side's cyan (a, 0 to 1); x its right
function gp_gen(ctx,x,y,a){if(a<=0.01)return;withA(ctx,clamp(a,0,1),()=>wc_tag(ctx,x,y,"generated",{align:"right",size:28,wash:GU_CYAN,washA:0.22,seed:301}));}
// a word marked in a line of code on a sheet: a wash behind the part of s that is sub (line's text from tx, its middle cy)
function gp_mark(ctx,tx,cy,s,sub,a,col){if(a<=0.01)return;const i=s.indexOf(sub);if(i<0)return;gv_tint(ctx,tx+gu_mw(ctx,s.slice(0,i))-6,cy-21,gu_mw(ctx,sub)+12,42,col||GV.gold,0.85*clamp(a,0,1));}
// a card with a heading on a pin, like the series' head on the data team's board, with its own words
function gp_head(ctx,s,a){if(a<=0.01)return;const hw=Math.max(250,tw(ctx,s,52,700)/2+60);ctx.save();ctx.translate(960,192);ctx.rotate(0.01);
  withA(ctx,a,()=>{wc_panel(ctx,-hw,-60,hw*2,120,{kind:"card",seed:63});gv_pin(ctx,0,-46,GV.red,1.2);wc_hand(ctx,s,0,20,{size:52,w:700,align:"center",col:WC_INK});});ctx.restore();}
// a screen's window drawn on the desk, as a plain form: its bar, and what fn draws in it
function gp_win(ctx,x,y,w,h,title,fn,bar){ctx.save();ctx.filter="blur(10px)";ctx.fillStyle="rgba(60,50,40,0.22)";ctx.fillRect(x+8,y+14,w,h);ctx.restore();
  gv_screen(ctx,x,y,w,h,title,fn,{barH:46,titleSize:28,bar});ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.5);ctx.lineWidth=2;ctx.strokeRect(x,y,w,h);ctx.restore();}
// a catalogue's bar, and another's: plain colours, in no product's
const GP_CATBAR=[84,112,96],GP_NEWBAR=[110,84,120];

/* ---------- the six products, as A product with an owner drew them ---------- */
// each product, its owner as its card names them, and the colour of its awning (A product with an owner's)
const GP_SIX=[["Learner records","Mei Tanaka",[104,128,170]],["Awards","Mei Tanaka",[176,104,88]],["Learners near an award","Clara Jensen",[204,150,64]],
  ["Learner wallet","Wallet app team",[110,146,104]],["Tuition forgone","Finance",[138,112,150]],["Short-course follow-ups","Learning team",[86,146,142]]];
// the ten tables other teams read, and the product each is in (governance/4-data-products/, each product's outputs)
const GP_TEN=[["core_learner_v1",0],["core_credential_v2",0],["core_credential_v1",0],["core_credit_towards_award_v1",0],["core_award_v1",1],
  ["mart_planning__near_award",2],["mart_wallet__learners",3],["mart_wallet__credentials",3],["mart_finance__tuition_forgone",4],["mart_learning__enrolments_to_follow_up",5]];
// an awning w wide, kept: stripes of its colour and a paler one, the edge scalloped, a soft shadow under it
function gp_awningC(col,w){return wc_kept("gpAwn"+col.join(",")+"|"+w,w+40,90,q=>{q.translate(20,14);const sw=w/Math.round(w/34),n=Math.round(w/sw),pale=mix(col,[255,250,240],0.62);
  q.save();q.filter="blur(5px)";q.fillStyle="rgba(60,44,30,0.18)";q.fillRect(4,30,w-8,22);q.restore();
  for(let k=0;k<n;k++){const x0=k*sw,P=[[x0,0],[x0+sw,0],[x0+sw,34]];for(let j=1;j<12;j++){const a=j/12*Math.PI;P.push([x0+sw/2+sw/2*Math.cos(a),34+sw/2*Math.sin(a)*0.8]);}P.push([x0,34]);
    wc_flat(q,P,k%2?pale:col,1,"awning");}
  wc_ink(q,[[0,0],[w,0]],false,2,WC_PENCIL,0.7,61,0.6);});}
// a product's card, as a stall (top left x,y, w by h): its awning, its name (as large as fits, 28 px or more), its owner. o.lit: a gold ring
// round it; o.own: its owner washed gold; o.n (0 to 1): how many of the ten tables it holds, on a chip at its top right; o.a; o.size: the
// name's largest size
function gp_stall(ctx,i,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const [name,own,col]=GP_SIX[i],sz=o.size||32,ns=Math.max(28,Math.min(sz,sz*(w-40)/tw(ctx,name,sz,700)));
  withA(ctx,a,()=>{wc_panel(ctx,x,y,w,h,{kind:"card",seed:700+i});ctx.drawImage(gp_awningC(col,w+12),x-26,y-20);
    const lit=clamp(o.lit||0,0,1);if(lit>0.01){ctx.save();ctx.strokeStyle=rgba(GV.gold,0.95*lit);ctx.lineWidth=5;rr(ctx,x-6,y-6,w+12,h+12,14);ctx.stroke();ctx.restore();}
    const ny=y+Math.max(h*0.5+8,92);wc_T(ctx,name,x+20,ny,{w:700,size:ns,col:WC_DARK});const oy=ny+(o.gap||48),os=o.ownSize||28,ow=tw(ctx,"owner: "+own,os,600);
    const g=clamp(o.own||0,0,1);if(g>0.01)wc_panel(ctx,x+12,oy-os*0.95,Math.round((ow+16)*easeCam(g))+2,Math.round(os*1.4),{kind:"tag",wash:GV.gold,washA:0.42,seed:720+i});
    wc_T(ctx,"owner: ",x+20,oy,{w:600,size:os,col:WC_MUTED});wc_T(ctx,own,x+20+tw(ctx,"owner: ",os,600),oy,{w:600,size:os,col:WC_INK});
    const nv=clamp(o.n||0,0,1);if(nv>0.01){const k=GP_TEN.filter(([,p])=>p===i).length,s=k+(k>1?" tables":" table");
      gp_rise(ctx,nv,()=>{const pw=Math.round(tw(ctx,s,28,700)+40);wc_panel(ctx,x+w-pw-10,y+44,pw,46,{kind:"pill",wash:GV.gold,washA:0.5,seed:740+i});
        wc_T(ctx,s,x+w-pw+10,y+77,{w:700,size:28,col:WC_DARK});},8);}});}

/* ---------- 1 · a promise in a file ---------- */
// Noor's room, wide: Clara with her product's card, as A product with an owner gave it her, and Noor at her map; their name cards (o.cards)
function gp_noorRoom(x,tt,o){o=o||{};person(x,"clara",700,905,0.8,Object.assign({pose:"listen",t:tt,carry:heldNotebook},o.clara||{}));
  person(x,"noor",1240,905,0.8,Object.assign({pose:"point",t:tt,flip:true},o.noor||{}));
  gu_nameCard(x,450,250,"Clara Jensen","Planning",clamp(o.cards||0,0,1));gu_nameCard(x,1110,250,"Noor Rahman","data architect",clamp(o.cards||0,0,1));}
// on a board in Noor's room: "Data products", and the six, each with its owner (o.u[i] brings card i in; o.own washes the owners gold);
// o.open (0 to 1): Clara's card comes forward, larger, and its owner and its promise read (o.rows[k], 0 to 1)
const GP_TCX=[505,960,1415],GP_TCY=[440,712],GP_BIGC=[400,262,1120,500];
function gp_board6(ctx,o){o=o||{};gp_head(ctx,"Data products",1);const op=clamp(o.open||0,0,1),u=easeCam(op);
  GP_SIX.forEach((_,i)=>{const v=clamp((o.u||[])[i]==null?1:o.u[i],0,1);if(v<=0.01||(i===2&&op>0.01))return;const w=410,h=236,cx=GP_TCX[i%3],cy=GP_TCY[Math.floor(i/3)];
    gp_rise(ctx,v,()=>gp_stall(ctx,i,cx-w/2,cy-h/2,w,h,{size:34,own:o.own||0,a:1-0.7*u}),18);});
  if(op<=0.01)return;const [gx,gy,gw,gh]=GP_BIGC,r=[lerp(GP_TCX[2]-205,gx,u),lerp(GP_TCY[0]-118,gy,u),lerp(410,gw,u),lerp(236,gh,u)];
  ctx.save();ctx.filter="blur(14px)";ctx.fillStyle=`rgba(40,40,50,${0.22*u})`;ctx.fillRect(r[0]+10,r[1]+18,r[2],r[3]);ctx.restore();
  wc_panel(ctx,r[0],r[1],r[2],r[3],{kind:"card",seed:731});ctx.drawImage(gp_awningC(GP_SIX[2][2],Math.round(r[2])+12),r[0]-26,r[1]-20);
  ctx.save();ctx.strokeStyle=rgba(GV.gold,0.95*u);ctx.lineWidth=5;rr(ctx,r[0]-6,r[1]-6,r[2]+12,r[3]+12,14);ctx.stroke();ctx.restore();
  if(u<0.5)wc_T(ctx,GP_SIX[2][0],r[0]+20,r[1]+r[3]*0.5+8,{w:700,size:30,col:WC_DARK,a:1-u*2});
  if(u>0.9)withA(ctx,clamp((u-0.9)/0.1,0,1),()=>{const [x,y]=GP_BIGC;wc_T(ctx,"Learners near an award",x+52,y+150,{w:800,size:52,col:WC_DARK});
    [["owner:","Clara Jensen, Planning"],["promise:","ready by 7 a.m. on census day"]].forEach(([l,v],k)=>{const p=clamp((o.rows||[])[k]==null?1:o.rows[k],0,1);if(p<=0.01)return;
      const ry=y+262+k*92;withA(ctx,p,()=>{if(k===0)wc_panel(ctx,x+40,ry-44,Math.round(tw(ctx,l+" "+v,36,700)+36),62,{kind:"tag",wash:GV.gold,washA:0.42*p,seed:733});
        wc_T(ctx,l,x+56,ry,{w:600,size:36,col:WC_MUTED});wc_T(ctx,v,x+56+tw(ctx,l+" ",36,600)+14*(1-easeCam(p)),ry,{w:700,size:36,col:WC_DARK});});});});}
// until now, on Noor's screen (GV_SC): the catalogue, where people look for data, its card for Clara's product typed in by hand (o.type,
// 0 to 1) with the columns as they were typed; beside it, the table on the platform, week by week (o.wk, 1 to 6), faculty_code renamed in
// week 4; the catalogue's faculty_code lit red (o.miss), its thread to the table ending in the air, and a red question mark (o.q)
const GP_CATL=[["Learners near an award",32,800],["owner: Clara Jensen",28,600],["ready by 7 a.m. on census day",28,600]],
  GP_COLS=["learner_award_key","census_date","faculty_code","is_near_award"];
function gp_typed(ctx,t,o){o=o||{};const [sx,sy,sw,sh]=GV_SC,lx=sx+20,rx=sx+sw/2+10,ww=sw/2-30,wy=sy+20,wh=sh-40,ty=clamp(o.type==null?1:o.type,0,1);
  const all=GP_CATL.map(l=>l[0]).concat(GP_COLS),tot=all.reduce((s,l)=>s+l.length,0);let left=Math.ceil(tot*ty),caret=null;
  const shown=all.map(s=>{const n=clamp(left,0,s.length);left-=n;return n;});
  gv_screen(ctx,lx,wy,ww,wh,"Catalogue",q=>{GP_CATL.forEach(([s,sz,wt],i)=>{const n=shown[i];if(n<=0)return;const yy=wy+110+i*48;wc_T(q,s.slice(0,n),lx+30,yy,{w:wt,size:sz,col:i?WC_INK:WC_DARK});
      if(n<s.length)caret=[lx+30+tw(q,s.slice(0,n),sz,wt),yy];});
    wc_T(q,"columns",lx+30,wy+290,{w:700,size:28,col:WC_MUTED});
    GP_COLS.forEach((s,i)=>{const n=shown[3+i],yy=wy+346+i*50;if(n<=0)return;if(i===2&&o.miss>0.01)gv_tint(q,lx+18,yy-34,gu_mw(q,s)+24,46,GV.red,0.55*clamp(o.miss,0,1));
      wc_T(q,s.slice(0,n),lx+30,yy,{w:500,size:28,f:"mono",col:i===2&&o.miss>0.5?GV.redInk:WC_DARK});if(n<s.length)caret=[lx+30+gu_mw(q,s.slice(0,n)),yy];});
    if(caret&&Math.sin(t*9)>-0.3){q.fillStyle=rgba(WC_DARK,0.85);q.fillRect(caret[0]+3,caret[1]-26,3,32);}},{barH:46,titleSize:28,bar:GP_CATBAR});
  const wk=clamp(o.wk||1,1,6),ren=wk>=4;
  gv_screen(ctx,rx,wy,ww,wh,"Platform · the table",q=>{wc_T(q,"mart_planning__near_award",rx+30,wy+110,{w:500,size:28,f:"mono",col:WC_DARK});
    gp_pill(q,rx+30,wy+178,"week "+Math.floor(wk),{size:28,wash:GV.grey,washA:0.25,seed:311});
    wc_T(q,"columns",rx+30,wy+290,{w:700,size:28,col:WC_MUTED});
    GP_COLS.forEach((s,i)=>{const yy=wy+346+i*50,fl=i===2?clamp(1-Math.abs(wk-4.2)*1.6,0,1):0;if(fl>0.01)gv_tint(q,rx+18,yy-34,gu_mw(q,"faculty_code")+24,46,GV.gold,0.7*fl);
      wc_T(q,i===2&&ren?"faculty":s,rx+30,yy,{w:500,size:28,f:"mono",col:WC_DARK});});
    wc_T(q,"…",rx+30,wy+346+4*50,{w:500,size:28,f:"mono",col:WC_PENCIL});},{barH:46,titleSize:28});
  const m=clamp(o.miss||0,0,1);if(m>0.01){const y2=wy+346+2*50-10,x0=lx+30+gu_mw(ctx,"faculty_code")+16;
    gp_arrow(ctx,[x0,y2],[x0+lerp(0,250,easeCam(m)),y2-6],-26,1,{col:GV.redInk,lw:4,head:false,dash:[12,10],a:0.85});gp_redQ(ctx,x0+290,y2+18,64,clamp(o.q||0,0,1));}}
// the Faculty of Health, close: Anil behind his desk; the calendar on the wall at census day; what o.draw puts on his screen
function gp_calendar(ctx,x,y){const w=250,h=232;gv_sheet(ctx,x,y,w,h);gv_pin(ctx,x+w/2,y+14,GV.red,1.1);
  ctx.save();ctx.fillStyle=rgba(GV.red,0.85);ctx.fillRect(x+16,y+34,w-32,54);ctx.restore();wc_T(ctx,"March",x+w/2,y+72,{w:800,size:32,col:[255,255,255],align:"center"});
  wc_hand(ctx,"census day",x+w/2,y+170,{size:36,w:700,col:GV.redInk,align:"center"});}
function gp_anil(x,tt,o){o=o||{};gv_behind(x,"anil",GV_FX.seat[0],GV_FX.top,GV_FX.seat[1],Object.assign({pose:"listen",t:tt,flip:true},o.anil||{}));
  x.drawImage(gv_place(o.desk||"facDesk"),0,0,W,H);gp_calendar(x,1146,48);if(o.draw)o.draw(x);}
// the report that plans next semester's places, on his screen (GV_FX.screen): its bars, then, broken (o.err, 0 to 1), the error
function gp_report(ctx,o){o=o||{};const [x,y,w,h]=GV_FX.screen,e=clamp(o.err||0,0,1);gv_screen(ctx,x,y,w,h,"Places next semester",q=>{
  if(e<1)withA(q,1-e,()=>{for(let i=0;i<5;i++){q.fillStyle=rgba([104,150,112],0.8);q.fillRect(x+40,y+90+i*44,(w-120)*(0.3+0.6*hash(i,8)),24);}});
  if(e>0.01)withA(q,e,()=>{wc_panel(q,x+22,y+64,w-44,h-86,{kind:"card",wash:GV.red,washA:0.16,seed:91});
    wc_T(q,"The report didn't load",x+48,y+126,{w:800,size:30,col:WC_DARK});wc_T(q,"column not found:",x+48,y+186,{w:700,size:28,col:GV.redInk});
    wc_T(q,"faculty_code",x+48,y+232,{w:500,size:28,f:"mono",col:GV.redInk});});},{barH:46,titleSize:28});}
// each catalogue in its own shape, on Noor's big screen: the one in use (left, a form), crossed as the university changes catalogue
// (o.x); the new one (right), its fields named its own way, each promise typed into it again, one after another (o.re, 0 to 6), and how
// many so far
function gp_formats(ctx,t,o){o=o||{};const L=[150,96,790,600],R=[980,96,790,600],xs=clamp(o.x||0,0,1),re=clamp(o.re||0,0,6);
  gp_win(ctx,L[0],L[1],L[2],L[3],"Catalogue · in use",q=>{[["Product","Learners near an award"],["Owner","Clara Jensen"],["Ready by","7 a.m., census day"],["Columns","17"]].forEach(([k,v],i)=>{
    const yy=L[1]+130+i*96;wc_T(q,k,L[0]+40,yy,{w:600,size:28,col:WC_MUTED});wc_T(q,v,L[0]+250,yy,{w:700,size:30,col:WC_DARK});
    q.fillStyle=rgba(WC_PENCIL,0.25);q.fillRect(L[0]+30,yy+30,L[2]-60,2);});},GP_CATBAR);
  if(xs>0.01){gv_tint(ctx,L[0]+6,L[1]+52,L[2]-12,L[3]-58,GV.grey,0.45*xs);wc_cross(ctx,L[0]+L[2]/2,L[1]+L[3]/2+20,200,GV.redInk,xs);}
  gp_win(ctx,R[0],R[1],R[2],R[3],"Catalogue · the new one",q=>{if(re<=0.01)return;const k=Math.min(5,Math.floor(re)),f=re>=6?1:re-Math.floor(re),[nm,own]=GP_SIX[k];
    gv_tint(q,R[0]+24,R[1]+70,R[2]-48,96,GP_SIX[k][2],0.35);
    const lines=[["Name",nm],["Data steward",own]],tot=lines.reduce((s,[,v])=>s+v.length,0);let left=Math.ceil(tot*clamp(f*1.3,0,1)),car=null;
    lines.forEach(([kk,v],i)=>{const yy=R[1]+132+i*120;if(i)wc_T(q,kk,R[0]+40,yy-48,{w:600,size:28,col:WC_MUTED});const n=clamp(left,0,v.length);left-=n;
      if(!i)wc_T(q,kk+":",R[0]+40,yy,{w:600,size:28,col:WC_MUTED});const vx=i?R[0]+40:R[0]+40+tw(q,kk+": ",28,600);
      if(n>0)wc_T(q,v.slice(0,n),vx,i?yy+6:yy,{w:700,size:i?32:30,col:WC_DARK});if(n<v.length&&car==null)car=[vx+tw(q,v.slice(0,n),i?32:30,700),i?yy+6:yy];});
    if(car&&Math.sin(t*9)>-0.3){q.fillStyle=rgba(WC_DARK,0.85);q.fillRect(car[0]+3,car[1]-28,3,34);}
    const cnt="typed again: "+Math.max(1,Math.min(6,Math.ceil(re)))+" of 6";gp_pill(q,R[0]+40,R[1]+R[3]-70,cnt,{size:30,wash:GV.amber,washA:0.35,seed:321});},GP_NEWBAR);}
// now: the project's folders on a card, the product descriptor and the contract each in its folder (o.tree, o.d, o.c, 0 to 1); each
// file's standard on a tag beside it (o.std[0], o.std[1])
const GP_TREE=[["models/",0],["governance/",0],["4-data-products/",1],["5-data-contracts/",1],["6-product-descriptors/",1]];
function gp_treeCard(ctx,x,y,o){o=o||{};const w=520,h=420;wc_panel(ctx,x,y,w,h,{kind:"card",seed:331});gv_pin(ctx,x+w/2,y+16,GV.red,1.1);
  wc_hand(ctx,"the project",x+36,y+78,{size:38,w:700,col:WC_INK});
  GP_TREE.forEach(([s,ind],i)=>{const yy=y+150+i*54,l=clamp((o.lit||[])[i]||0,0,1),tx=x+40+ind*40;if(l>0.01)gv_tint(ctx,tx-10,yy-34,gu_mw(ctx,s)+20,46,o.litCol&&o.litCol[i]||GV.gold,0.8*l);
    wc_T(ctx,s,tx,yy,{w:500,size:28,f:"mono",col:WC_DARK});});}
const GP_DESC=[{n:3,s:"apiVersion: v1.0.0"},{n:4,s:"kind: DataProduct"},{fold:1},{n:6,s:"name: Learners near an award"}],
  GP_CON=[{n:3,s:"apiVersion: v3.1.0"},{n:4,s:"kind: DataContract"},{fold:1},{n:6,s:"name: mart_planning__near_award"},{fold:1},{n:10,s:"dataProduct: learners_near_an_award"}];
function gp_nowFiles(ctx,t,o){o=o||{};gp_rise(ctx,clamp(o.tree==null?1:o.tree,0,1),()=>gp_treeCard(ctx,60,120,{lit:[0,0,0,o.c||0,o.d||0],litCol:[0,0,0,GU_CYAN,GU_CYAN]}));
  const d=gp_file(ctx,620,70,1240,o.d||0,{path:"governance/6-product-descriptors/learners_near_an_award.yaml",lang:"yaml",lines:GP_DESC});
  if(d.rows.length)withA(ctx,clamp((o.std||[])[0]||0,0,1),()=>wc_tag(ctx,1830,d.rows[1],"Open Data Product Standard",{align:"right",size:30,wash:GU_CYAN,washA:0.25,seed:341}));
  const c=gp_file(ctx,620,410,1240,o.c||0,{path:"governance/5-data-contracts/mart_planning__near_award.yaml",lang:"yaml",lines:GP_CON});
  if(c.rows.length)withA(ctx,clamp((o.std||[])[1]||0,0,1),()=>wc_tag(ctx,1830,c.rows[1],"Open Data Contract Standard",{align:"right",size:30,wash:GU_CYAN,washA:0.25,seed:342}));}
// written from the model: the model's lines (left) and the contract's (right), the script between them (o.u, 0 to 1), threads joining
// matching lines (o.thr, 0 to 1); then a change that would break it: the checks, the impact check red, and what it said (o.ck, 0 to 1)
const GP_WM=[{n:36,s:"      - name: learner_award_key"},{fold:1},{n:38,s:"        data_type: string"},{n:39,s:"        constraints: [{type: not_null}]"}],
  GP_WC=[{n:31,s:"  - name: learner_award_key"},{n:32,s:"    logicalType: string"},{fold:1},{n:34,s:"    required: true"}],GP_IMP="breaking change to mart_planning__near_award with no new version";
function gp_written(ctx,t,o){o=o||{};const u=clamp(o.u==null?1:o.u,0,1),ck=clamp(o.ck||0,0,1),dm=1-0.55*ck;
  withA(ctx,dm,()=>{const M=gu_file(ctx,50,60,880,{path:"models/marts/planning/_planning__models.yml",lang:"yaml",lines:GP_WM}),
      C=gp_file(ctx,990,60,880,u,{path:"…/5-data-contracts/mart_planning__near_award.yaml",lang:"yaml",lines:GP_WC});gp_gen(ctx,1850,30,u);
    const pw=gp_pill(ctx,703,440,"scripts/generate/products.py",{f:"mono",w:500,size:28,wash:GU_CYAN,washA:0.2,seed:351});
    gp_arrow(ctx,[490,362],[700,426],10,clamp(u*2,0,1),{col:GU_CYAN,lw:4});gp_arrow(ctx,[703+pw,426],[1430,362],10,clamp(u*2-0.6,0,1),{col:GU_CYAN,lw:4});
    if(C.rows.length)[[0,0],[2,1],[3,3]].forEach(([a,b],k)=>gp_thread(ctx,[912,M.rows[a]],[1008,C.rows[b]],clamp((o.thr||0)*3-k,0,1),{bend:0,lw:4}));});
  if(ck<=0.01)return;gp_rise(ctx,ck,()=>{const its=["build","governance","products","reviewers","impact"].map(n=>({name:n,st:n==="impact"?(ck>0.5?"fail":"run"):"pass"}));
    gu_checks(ctx,150,520,1620,{h:300,items:its,t,msg:[{s:GP_IMP,col:GV.redInk,p:clamp(ck*2-1,0,1)}],pop:[0,0,0,0,clamp(ck*2-1,0,1)],summary:true});});}
// Jun's column on credentials: the contract of core_credential version 2 (governance/5-data-contracts/core_credential_v2.yaml), its new
// property written in by the script (o.add, 0 to 1); its readers, each still whole (o.read, o.ok); the film it comes from (o.tag)
const GP_CV=[{n:140,s:"  - name: credit_points"},{fold:1},{s:"  - name: counts_as_award",add:1},{s:"    logicalType: boolean",add:1},{s:"    physicalType: boolean",add:1},
  {s:"    required: false",add:1},{s:"    classification: none",add:1},{n:147,s:"  - name: issued_on"}],
  GP_RD=[["census_report","Planning"],["draft_submission","registrar's office"],["wallet_app","Wallet app team"]];
function gp_junCol(ctx,t,o){o=o||{};const ad=clamp(o.add||0,0,1),rows=GP_CV.map((r,i)=>r.add?Object.assign({},r,{dA:ad,p:clamp(ad*6-(i-2),0,1)}):r).filter((r,i)=>!r.add||ad>0.01||i===7);
  const f=gu_file(ctx,90,60,1180,{path:"governance/5-data-contracts/core_credential_v2.yaml",lang:"yaml",lines:ad>0.01?rows:[GP_CV[0],GP_CV[1],GP_CV[7]]});gp_gen(ctx,1250,30,1);
  if(ad>0.01&&f.rows.length>6)gp_mark(ctx,f.tx,f.rows[2],GP_CV[2].s,"counts_as_award",clamp(ad*2-1,0,1),GV.green);
  const rd=clamp(o.read==null?1:o.read,0,1),ok=clamp(o.ok||0,0,1),my=f.rows.length>6?(f.rows[2]+f.rows[6])/2:f.rows[1];
  GP_RD.forEach(([n,w],i)=>{const v=clamp(rd*3-i,0,1);if(v<=0.01)return;const x=1340,y=70+i*170,cw=490,ch=132;
    gp_thread(ctx,[1250,my],[x+4,y+ch/2],clamp(v*1.6,0,1),{col:WC_PENCIL,bend:-20+i*20,lw:3.5});
    gp_rise(ctx,clamp(v*1.6-0.4,0,1),()=>{wc_panel(ctx,x,y,cw,ch,{kind:"card",seed:361+i});wc_T(ctx,n,x+30,y+56,{w:500,size:28,f:"mono",col:WC_DARK});
      wc_T(ctx,w,x+30,y+100,{w:600,size:28,col:WC_MUTED});wc_tick(ctx,x+cw-56,y+44,34,GV.greenInk,clamp(ok*3-i,0,1),5);});});
  if(o.tag)gu_filmTag(ctx,90,620,o.tagTitle||"Governed in dbt",clamp(o.tag,0,1));}
// the ten tables other teams read, on the data team's board, each with its product's colour (o.u, 0 to 1, brings them in) and a tick
// (o.tick, 0 to 1, one after another); the products check, passing, on every change (o.ck)
function gp_ten(ctx,t,o){o=o||{};const u=clamp(o.u==null?1:o.u,0,1);withA(ctx,clamp(u*3,0,1),()=>wc_tag(ctx,960,116,"the ten tables other teams read",{align:"center",size:32,seed:371}));
  GP_TEN.forEach(([s,p],i)=>{const v=clamp(u*10-i,0,1);if(v<=0.01)return;const x=i<5?230:970,y=168+(i%5)*104,w=720,h=86;
    gp_rise(ctx,v,()=>{wc_panel(ctx,x,y,w,h,{kind:"card",seed:380+i});ctx.save();ctx.fillStyle=rgba(GP_SIX[p][2],0.9);ctx.fillRect(x+8,y+8,14,h-16);ctx.restore();
      wc_T(ctx,s,x+76,y+54,{w:500,size:28,f:"mono",col:WC_DARK});wc_tick(ctx,x+46,y+38,30,GV.greenInk,clamp((o.tick||0)*10-i,0,1),5);},10);});
  const ck=clamp(o.ck||0,0,1);if(ck>0.01)gp_rise(ctx,ck,()=>{const pw=Math.round(gu_mw(ctx,"products")+80);wc_panel(ctx,560,724,pw,56,{kind:"pill",wash:GV.green,washA:0.25,seed:391});
    gu_light(ctx,592,752,"pass",t);wc_T(ctx,"products",618,762,{w:500,size:28,f:"mono",col:WC_DARK});wc_hand(ctx,"checked on every change",580+pw,768,{size:38,w:700,col:WC_PENCIL});});}
// whichever catalogue shows them: two catalogues' windows on the desk, the same card in each (o.cards, 0 to 1), each reading the same file
// (o.read); the file is the university's (o.own)
function gp_card(q,x,y,w){wc_T(q,"Learners near an award",x+40,y+120,{w:800,size:36,col:WC_DARK});wc_T(q,"owner: Clara Jensen, Planning",x+40,y+190,{w:600,size:30,col:WC_INK});
  wc_T(q,"ready by 7 a.m. on census day",x+40,y+244,{w:600,size:30,col:WC_INK});}
function gp_stay(ctx,t,o){o=o||{};const cd=clamp(o.cards==null?1:o.cards,0,1),rd=clamp(o.read||0,0,1);
  [[150,"Catalogue · today",GP_CATBAR],[1010,"Another catalogue",GP_NEWBAR]].forEach(([x,ttl,bar],i)=>gp_rise(ctx,clamp(cd*2-i,0,1),()=>gp_win(ctx,x,96,760,330,ttl,q=>gp_card(q,x,96,760),bar),16));
  const f=gu_file(ctx,360,560,1200,{path:"governance/6-product-descriptors/learners_near_an_award.yaml",lang:"yaml",lines:[{n:6,s:"name: Learners near an award"}]});
  [[[760,556],[530,440]],[[1160,556],[1390,440]]].forEach(([a,b],i)=>gp_arrow(ctx,a,b,-10,clamp(rd*2-i*0.5,0,1),{col:GU_CYAN,lw:4}));
  if(o.own>0.01)wc_hand(ctx,"the university's, kept in its project",960,800,{size:38,w:700,col:GV.goldInk,align:"center",p:clamp(o.own,0,1)});}

/* ---------- 2 · written by its owner ---------- */
// Clara's product file, as she wrote it (governance/4-data-products/learners_near_an_award.yml): o.lit[k] lights its parts as they're
// named: 0 what it's for, 1 how to use it, 2 its owner, 3 the table it offers, 4 its service levels, 5 built every night, 6 ready by seven,
// 7 where to ask; o.u slides it in; o.note, the pencil's "written by its owner"
const GP_PF=[{n:6,s:"name: learners_near_an_award"},{fold:1},{n:8,s:"owner: \"Clara Jensen, Planning\""},{fold:1},
  {n:13,s:"  purpose: How many learners are near a graduate certificate …"},{fold:1},{n:16,s:"  usage: Count learners with is_near_award. …"},{fold:1},
  {n:18,s:"outputs:"},{n:19,s:"  - {model: mart_planning__near_award}"},{n:20,s:"service_levels:"},{n:21,s:"  - {property: latency, value: 1, unit: d, description: Built every night.}"},
  {n:22,s:"  - {property: timeOfAvailability, value: \"07:00\", description: Ready by 7 a.m. on census day.}"},{n:23,s:"support:"},
  {n:24,s:"  - {channel: planning-data, tool: email, url: \"mailto:planning@uni.example\", scope: issues}"}],
  GP_PFL=[[4],[6],[2],[8,9],[10],[11],[12],[13,14]];
function gp_prodFile(ctx,o){o=o||{};const L=o.lit||[],lit=new Array(GP_PF.length).fill(0);GP_PFL.forEach((rs,k)=>rs.forEach(r=>{lit[r]=Math.max(lit[r],clamp(L[k]||0,0,1));}));
  const f=gp_file(ctx,70,50,1780,o.u==null?1:o.u,{path:"governance/4-data-products/learners_near_an_award.yml",lang:"yaml",lines:GP_PF.map((r,i)=>lit[i]>0.01?Object.assign({},r,{lit:lit[i]}):r)});
  if(f.rows.length&&o.note>0.01)wc_hand(ctx,"written by its owner",1820,f.rows[0]-58,{size:38,w:700,col:WC_PENCIL,align:"right",p:clamp(o.note,0,1)});}
// Planning's office, close, the camera at the height of someone sitting (as Quality on the platform drew it): a pale green wall, a
// window, a chart pinned up; the desk (its front layer) with a screen, a keyboard and a mug
const GP_PX={top:800,seat:[1480,1.7],screen:[380,236,800,450],win:[60,56,250,420],chart:[1250,60,440,286]};
function gp_paintPlan(ctx){const X=GP_PX,wall=GV_ROOM.plan;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),wall,{kind:"plaster",line:false,seed:131});
  gv_lightGlow(ctx,880,-60,760);const [wx,wy,ww,wh]=X.win;gv_window(ctx,wx,wy,ww,wh,{wall,seed:33,tx:0.35});
  const [cx,cy,cw,ch]=X.chart;wc_wash(ctx,wc_rect(cx,cy,cw,ch),[251,250,245],{kind:"paper",lw:1.4,seed:132});for(const gx of [cx+24,cx+cw-24])gv_pin(ctx,gx,cy+20,GV.red,1);
  gv_lines(ctx,cx+34,cy+58,cw*0.42,1,0,1);for(let i=0;i<7;i++){const bh=50+120*hash(i,17);wc_flat(ctx,wc_rect(cx+40+i*56,cy+ch-28-bh,38,bh),[104,150,112],0.75,"bar");}
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.5);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx+30,cy+ch-26);ctx.lineTo(cx+cw-30,cy+ch-26);ctx.stroke();ctx.restore();}
function gp_paintPlanDesk(ctx){const X=GP_PX,top=X.top;gv_deskFront(ctx,top,[200,184,156],[[60,330],[1560,330]]);
  const [sx,sy,sw,sh]=X.screen;gv_deskScreen(ctx,sx,sy,sw,sh,top);gv_keys(ctx,sx+90,top,sw-180,sx+sw+40);gv_mug(ctx,1780,top+10,[226,160,70]);}
// Clara at her desk, close, her file open on her screen; over it, who does what, each on a thread from the screen (o.who[i], 0 to 1)
const GP_WHO=[["the data team · builds the table",330,92,560,GU_CYAN],["Clara · keeps the promise",660,186,880,GV.gold]];
function gp_planDesk(x,tt,o){o=o||{};gv_behind(x,"clara",GP_PX.seat[0],GP_PX.top,GP_PX.seat[1],Object.assign({pose:"listen",t:tt,flip:true},o.clara||{}));
  x.drawImage(gv_place("planDesk"),0,0,W,H);const [sx,sy,sw,sh]=GP_PX.screen;gv_screen(x,sx,sy,sw,sh,"learners_near_an_award.yml",null,{barH:46,titleSize:28});
  ["title: Learners near an award","owner: \"Clara Jensen, Planning\"","domain: planning","status: active"].forEach((s,i)=>{const yy=sy+110+i*52;if(i===1&&o.own>0.01)gv_tint(x,sx+24,yy-34,gu_mw(x,s)+24,46,GV.gold,0.8*clamp(o.own,0,1));
    gu_code(x,s,sx+36,yy,{lang:"yaml"});});
  GP_WHO.forEach(([s,tx,ty,fx,col],i)=>{const v=clamp((o.who||[])[i]||0,0,1);if(v<=0.01)return;const w=tw(x,s,30,700)+40;
    gp_thread(x,[fx,sy-6],[tx+w/2,ty+26],clamp(v*1.6,0,1),{bend:10,col:WC_PENCIL});
    gp_rise(x,clamp(v*1.6-0.4,0,1),()=>wc_tag(x,tx,ty,s,{size:30,wash:col,washA:0.4,seed:401+i}));});}

/* ---------- 3 · the contract, from the model ---------- */
// the contract on the desk (governance/5-data-contracts/mart_planning__near_award.yaml): its header, the column learner_award_key and its
// quality rule. What each part says, in pencil at its left, on a thread to its line (o.note[k], 0 to 1); a pencil that stops short of it
// (o.pen), the file's own warning lit (o.warn) and its tag (o.gen); then the model's lines and the product's file (o.src), the script
// that writes the contract from them (o.scr), its standard on a tag (o.std), and threads joining each line of the model to its line in
// the contract (o.thr[k])
const GP_CT=[{n:1,s:"# Generated by … Don't edit it:"},{n:3,s:"apiVersion: v3.1.0"},{n:4,s:"kind: DataContract"},{fold:1},{n:31,s:"  - name: learner_award_key"},
  {n:32,s:"    logicalType: string"},{n:34,s:"    required: true"},{n:35,s:"    classification: pseudonymous"},{fold:1},{n:40,s:"    quality:"},{fold:1},
  {n:42,s:"      metric: duplicateValues"},{n:43,s:"      mustBe: 0"},{fold:1},{n:45,s:"      dimension: uniqueness"}],
  GP_NOTES=[["each column",4],["its type",5],["always there?",6],["can it identify a person?",7],["the tests it must pass",9]],
  GP_MD=[{n:36,s:"      - name: learner_award_key"},{fold:1},{n:38,s:"        data_type: string"},{n:39,s:"        constraints: [{type: not_null}]"},
  {n:40,s:"        data_tests: [unique]"},{fold:1},{n:42,s:"          meta: {personal_data: pseudonymous}"}],GP_PAIRS=[[0,4],[2,5],[3,6],[6,7],[4,11]];
// a pencil, kept, its point at (0,0) and its body along +x
function gp_pencilC(){return wc_kept("gpPencil",440,48,q=>{q.translate(10,24);wc_part(q,[[0,0],[40,-13],[40,13]],[236,206,160],1,{lw:1.2});
  wc_part(q,[[0,0],[12,-4],[12,4]],[60,60,64],1,{lw:1});wc_part(q,wc_rect(40,-13,300,26),[236,186,52],1,{lw:1.2});
  wc_part(q,wc_rect(340,-13,34,26),[190,190,196],1,{lw:1.2});wc_part(q,wc_rect(374,-13,44,26),[226,140,150],1,{lw:1.2});});}
function gp_pencil(ctx,x,y,rot,a){if(a<=0.01)return;ctx.save();ctx.translate(x,y);ctx.rotate(rot);withA(ctx,a,()=>ctx.drawImage(gp_pencilC(),-10,-24));ctx.restore();}
function gp_contractDesk(ctx,t,o){o=o||{};const C=gu_file(ctx,990,50,880,{path:"…/5-data-contracts/mart_planning__near_award.yaml",lang:"yaml",
    lines:GP_CT.map((r,i)=>i===0&&o.warn>0.01?Object.assign({},r,{lit:clamp(o.warn,0,1),litCol:GU_CYAN}):r)});
  gp_gen(ctx,1850,22,clamp(o.gen||0,0,1));
  if(o.std>0.01)withA(ctx,clamp(o.std,0,1),()=>wc_tag(ctx,1850,C.rows[1],"Open Data Contract Standard",{align:"right",size:28,wash:GU_CYAN,washA:0.25,seed:342}));
  const src=clamp(o.src||0,0,1),out=1-clamp(src*2.5,0,1);
  if(out>0.01)GP_NOTES.forEach(([s,r],k)=>{const v=clamp((o.note||[])[k]||0,0,1)*out;if(v<=0.01)return;const ry=C.rows[r];
    gp_arrow(ctx,[938,ry-6],[C.tx-10,ry-6],0,clamp(v*2,0,1),{col:WC_PENCIL,lw:3,a:0.7*out});wc_hand(ctx,s,920,ry+6,{size:38,w:700,col:WC_PENCIL,align:"right",p:v});});
  const pn=clamp(o.pen||0,0,1);if(pn>0.01){const e=easeCam(clamp(pn*1.6,0,1)),x=lerp(-80,940,e)+(pn>0.7?Math.sin(t*16)*3*(1-pn):0);gp_pencil(ctx,x,C.rows[0]+14,-0.18,clamp(pn*4,0,1)*out);}
  if(src<=0.01)return;const e=easeCam(src),ma=clamp(src*2.2-0.9,0,1),dy=24*(1-e);
  const M=gu_file(ctx,50,60+dy,880,{path:"models/marts/planning/_planning__models.yml",lang:"yaml",lines:GP_MD,a:ma});
  const P=gu_file(ctx,50,540+dy,880,{path:"…/4-data-products/learners_near_an_award.yml",lang:"yaml",lines:[{n:8,s:"owner: \"Clara Jensen, Planning\""}],a:clamp(src*2.2-1.1,0,1)});
  const sc=clamp(o.scr||0,0,1);if(sc>0.01){gp_rise(ctx,sc,()=>gp_pill(ctx,330,792,"scripts/generate/products.py",{f:"mono",w:500,size:28,wash:GU_CYAN,washA:0.2,seed:411}));
    gp_arrow(ctx,[300,494],[440,766],-10,clamp(sc*2-0.4,0,1),{col:GU_CYAN,lw:4});gp_arrow(ctx,[620,700],[620,766],0,clamp(sc*2-0.6,0,1),{col:GU_CYAN,lw:4});
    gp_arrow(ctx,[850,800],[982,720],-20,clamp(sc*2-1,0,1),{col:GU_CYAN,lw:4});}
  if(M.rows.length)GP_PAIRS.forEach(([a,b],k)=>gp_thread(ctx,[912,M.rows[a]],[C.tx-14,C.rows[b]],clamp((o.thr||[])[k]||0,0,1),{bend:0,lw:4}));}
// on every pull request: Jun's, which changed the contract by hand. Its file (o.files), its checks: the products check fails, out of date
// (o.fail), and, once the change is made in the model, passes, valid against the standards (o.pass); "valid" and the standards lit (o.std),
// washes laid over the words, which show through them
const GP_JUNPR={title:"Describe the census date",sub:"Jun Park wants to merge into main"},
  GP_OOD=["out of date: run python scripts/generate/products.py","governance/5-data-contracts/mart_planning__near_award.yaml"],
  GP_OK16=["16 files are up to date and valid: 6 products (product standard v1.0.0),","10 contracts (contract standard v3.1.0)"];
function gp_prCheck(ctx,t,o){o=o||{};const [x,y,w,h]=GU_BIG;gu_page(ctx,x,y,w,h,{bar:"GitHub · pull request",title:GP_JUNPR.title,titleSize:40,state:["Open",GV.green],sub:GP_JUNPR.sub});
  const fl=clamp(o.fail||0,0,1),ps=clamp(o.pass||0,0,1);gu_box(ctx,150,256,1620,272,"Files changed",{seed:421});
  wc_T(ctx,"governance/5-data-contracts/mart_planning__near_award.yaml",182,342,{w:500,size:28,f:"mono",col:WC_MUTED});
  [["    description: 'Planning''s census date: the date the numbers are as at. …'",1],["    description: 'The date the numbers are counted at.'",0]].forEach(([s,del],i)=>{const ry=402+i*46;
    gv_tint(ctx,166,ry-32,1588,44,del?GV.red:GV.green,0.45);wc_T(ctx,del?"−":"+",226,ry,{w:500,size:28,f:"mono",col:del?GV.redInk:GV.greenInk,align:"right"});gu_code(ctx,s,246,ry,{lang:"yaml"});});
  wc_hand(ctx,"edited by hand",1740,504,{size:34,w:700,col:WC_PENCIL,align:"right",p:clamp(o.hand==null?1:o.hand,0,1)*(1-clamp(ps*3,0,1))});
  if(ps>0.34)wc_hand(ctx,"then made in the model, and the script run",1740,504,{size:34,w:700,col:GV.greenInk,align:"right",p:clamp(ps*1.5-0.5,0,1)});
  const st=k=>k==="products"?(ps>0.5?"pass":fl>0.5?"fail":fl>0.01?"run":"wait"):(fl>0.01||ps>0.01?"pass":"wait"),
    its=["build","governance","products","reviewers","impact"].map(n=>({name:n,st:st(n)}));
  const msg=ps>0.5?GP_OK16.map(s=>({s,col:GV.greenInk,p:clamp(ps*2-1,0,1)})):GP_OOD.map(s=>({s,col:GV.redInk,p:clamp(fl*2-1,0,1)}));
  const r=gu_checks(ctx,150,544,1620,{h:314,items:its,t,msg,pop:[0,0,ps>0.5?clamp(ps*2-1,0,1):clamp(fl*2-1,0,1),0,0],msgGap:72,summary:true});
  const sd=clamp(o.std||0,0,1);if(sd>0.01&&ps>0.5){gp_mark(ctx,182,r.my-10,GP_OK16[0],"valid",sd);gp_mark(ctx,182,r.my-10,GP_OK16[0],"(product standard v1.0.0)",sd);
    gp_mark(ctx,182,r.my+32,GP_OK16[1],"(contract standard v3.1.0)",sd);}}

/* ---------- 4 · every shared table, in one product ---------- */
// the data team's thirty-three tables, as small cards on its board, coming in one after another (o.u, 0 to 1); the ten other teams read,
// each with its product's colour, ringed in gold (o.ten); then the six products' stalls rise (o.st) as the rest go, each of the ten flies
// into its own (o.fly), and each stall says how many it holds (o.n[i]). The board's heading: the count, then "Data products" (o.head)
const GP_33={cols:11,w:112,h:150,gx:18,gy:26,x0:265,y0:300},GP_TENAT=[2,6,9,13,16,19,23,25,29,31];
const gp_33pos=k=>[GP_33.x0+(k%GP_33.cols)*(GP_33.w+GP_33.gx),GP_33.y0+Math.floor(k/GP_33.cols)*(GP_33.h+GP_33.gy)];
function gp_tableCard(ctx,x,y,w,h,col,seed,lit){wc_panel(ctx,x,y,w,h,{kind:"card",seed});if(col){ctx.save();ctx.fillStyle=rgba(col,0.9);ctx.fillRect(x+8,y+8,w-16,14);ctx.restore();}
  gv_lines(ctx,x+16,y+48,w-32,4,22,0.9);if(lit>0.01){ctx.save();ctx.strokeStyle=rgba(GV.gold,0.95*lit);ctx.lineWidth=5;rr(ctx,x-6,y-6,w+12,h+12,12);ctx.stroke();ctx.restore();}}
function gp_33(ctx,t,o){o=o||{};const u=clamp(o.u==null?1:o.u,0,1),ten=clamp(o.ten||0,0,1),st=clamp(o.st||0,0,1),fly=clamp(o.fly||0,0,1),hd=clamp(o.head||0,0,1),G=GP_33;
  if(hd<0.99)gp_head(ctx,"The data team's 33 tables",(1-hd)*clamp(u*4,0,1));if(hd>0.01)gp_head(ctx,"Data products",hd);
  GP_SIX.forEach((_,i)=>{const v=clamp(st*3-i*0.4,0,1);if(v<=0.01)return;const w=410,h=236,cx=GP_TCX[i%3],cy=GP_TCY[Math.floor(i/3)];
    gp_rise(ctx,v,()=>gp_stall(ctx,i,cx-w/2,cy-h/2,w,h,{size:34,n:(o.n||[])[i]||0}),18);});
  for(let k=0;k<33;k++){const v=clamp(u*33-k*0.7,0,1);if(v<=0.01)continue;const j=GP_TENAT.indexOf(k),[x,y]=gp_33pos(k);
    if(j<0){const a=v*(1-0.55*ten)*(1-clamp(st*1.6,0,1));if(a>0.01)withA(ctx,a,()=>gp_tableCard(ctx,x,y,G.w,G.h,null,500+k,0));continue;}
    const p=GP_TEN[j][1],e=easeCam(clamp(fly*1.8-j*0.08,0,1)),tx=GP_TCX[p%3],ty=GP_TCY[Math.floor(p/3)],cx=lerp(x+G.w/2,tx,e),cy=lerp(y+G.h/2,ty,e)-90*Math.sin(Math.PI*e),
      s=lerp(1,0.45,e)*(1+0.06*ten*(1-e)),a=v*(1-clamp((e-0.8)/0.2,0,1));if(a<=0.01)continue;
    ctx.save();ctx.translate(cx,cy-10*ten*(1-e));ctx.scale(s,s);withA(ctx,a,()=>gp_tableCard(ctx,-G.w/2,-G.h/2,G.w,G.h,ten>0.01?mix([236,232,224],GP_SIX[p][2],ten):null,500+k,ten*(1-e)));ctx.restore();}}
// Jun's pull request for Planning's completions, as the products check sees it: a table other teams will read, in no product. The files it
// changes, its checks: the products check fails, and says what to do (o.fail); a product takes it in, its file added (o.prod, 0 to 1, line
// by line), and the check passes (o.pass). The film it comes from (o.tag)
const GP_NEWPR={title:"Completions for Planning",sub:"Jun Park wants to merge into main"},
  GP_NOPROD=["mart_planning__completions is shared but in no product: add it to a","product's outputs in governance/4-data-products/"],
  GP_OK18=["18 files are up to date and valid: 7 products (product standard v1.0.0),","11 contracts (contract standard v3.1.0)"],
  GP_NEWF=[[null,"models/marts/planning/mart_planning__completions.sql",0],[null,"models/marts/planning/_planning__models.yml",0],[null,"governance/4-data-products/completions.yml",1],
    [6,"name: completions",2],[8,"owner: \"Clara Jensen, Planning\"",3],[18,"  - {model: mart_planning__completions}",4]];
function gp_newPR(ctx,t,o){o=o||{};const [x,y,w,h]=GU_BIG,fl=clamp(o.fail||0,0,1),pr=clamp(o.prod||0,0,1),ps=clamp(o.pass||0,0,1);
  gu_page(ctx,x,y,w,h,{bar:"GitHub · pull request",title:GP_NEWPR.title,titleSize:40,state:["Open",GV.green],sub:GP_NEWPR.sub});
  gu_box(ctx,150,248,1620,352,"Files changed",{seed:431});
  GP_NEWF.forEach(([n,s,k],i)=>{const v=k?clamp(pr*4-(k-1),0,1):1;if(v<=0.01)return;const ry=350+i*44;withA(ctx,v,()=>{
    if(n==null){if(k)gv_tint(ctx,166,ry-31,1588,42,GV.green,0.4*v);wc_T(ctx,"+",196,ry,{w:500,size:28,f:"mono",col:GV.greenInk});wc_T(ctx,s,226,ry,{w:500,size:28,f:"mono",col:WC_DARK});}
    else{wc_T(ctx,String(n),330,ry,{w:500,size:28,f:"mono",col:WC_MUTED,align:"right"});gu_code(ctx,s,352,ry,{lang:"yaml"});}});});
  const st=n=>n==="products"?(ps>0.5?"pass":pr>0.3?"run":fl>0.5?"fail":"run"):"pass",its=["build","governance","products","reviewers","impact"].map(n=>({name:n,st:st(n)}));
  const msg=ps>0.5?GP_OK18.map(s=>({s,col:GV.greenInk,p:clamp(ps*2-1,0,1)})):pr>0.3?[]:GP_NOPROD.map(s=>({s,col:GV.redInk,p:clamp(fl*2-1,0,1)}));
  gu_checks(ctx,150,612,1620,{h:250,items:its,t,msg,pop:[0,0,ps>0.5?clamp(ps*2-1,0,1):clamp(fl*2-1,0,1)*(1-pr),0,0],msgGap:58,summary:true});
  if(o.tag>0.01)gu_filmTag(ctx,1750,180,"Governed in dbt",clamp(o.tag,0,1),{align:"right"});}

/* ---------- 5 · a change that would break it ---------- */
// on the desk: the model's line for faculty_code (left) and the contract's (right). The column renamed in the model, faculty_code to
// faculty (o.ren, 0 to 1); the contract following, by itself (o.fol), a thread from one to the other; the census dashboard, which reads the
// column (o.rd), its thread breaking (o.brk)
const GP_RNM=["      - name: faculty_code","        data_type: string"],GP_RNC=["  - name: faculty_code","    logicalType: string"];
const gp_renamed=(s,u)=>u<=0?s:u>=1?s.replace("faculty_code","faculty"):u<0.5?s.slice(0,s.length-Math.round(5*u*2)):s.replace("faculty_code","faculty");
function gp_renameDesk(ctx,t,o){o=o||{};const rn=clamp(o.ren||0,0,1),fo=clamp(o.fol||0,0,1),rd=clamp(o.rd||0,0,1),bk=clamp(o.brk||0,0,1);
  const M=gu_file(ctx,60,200,860,{path:"models/marts/planning/_planning__models.yml",lang:"yaml",lines:[{n:81,s:gp_renamed(GP_RNM[0],rn),lit:clamp(rn*3,0,1)},{fold:1},{n:83,s:GP_RNM[1]}]});
  const C=gu_file(ctx,1000,200,860,{path:"…/mart_planning__near_award.yaml",lang:"yaml",lines:[{n:103,s:gp_renamed(GP_RNC[0],fo),lit:clamp(fo*3,0,1),litCol:GU_CYAN},{n:104,s:GP_RNC[1]}]});
  gp_gen(ctx,1850,176,1);
  const caret=(F,s,u)=>{if(u>0.01&&u<0.99&&Math.sin(t*9)>-0.3){ctx.fillStyle=rgba(WC_DARK,0.85);ctx.fillRect(F.tx+gu_mw(ctx,s)+3,F.rows[0]-16,3,32);}};
  caret(M,gp_renamed(GP_RNM[0],rn),rn);caret(C,gp_renamed(GP_RNC[0],fo),fo);
  gp_arrow(ctx,[M.tx+gu_mw(ctx,GP_RNM[0])+30,M.rows[0]],[990,C.rows[0]-6],-40,clamp(fo*1.6,0,1),{col:GU_CYAN,lw:4});
  if(rd<=0.01)return;const cx=1300,cy=600,cw=520,ch=136,ax=C.tx+gu_mw(ctx,gp_renamed(GP_RNC[0],fo))-60,ay=C.rows[0]+22;
  gp_rise(ctx,rd,()=>{wc_panel(ctx,cx,cy,cw,ch,{kind:"card",wash:bk>0.3?GV.red:null,washA:0.14*bk,seed:451});wc_T(ctx,"census_dashboard",cx+30,cy+58,{w:500,size:28,f:"mono",col:WC_DARK});
    wc_T(ctx,"Planning",cx+30,cy+102,{w:600,size:28,col:WC_MUTED});},12);
  if(bk<0.5)gp_thread(ctx,[cx+cw/2,cy],[ax,ay],clamp(rd*1.6-0.4,0,1)*(1-clamp(bk*2,0,1)),{col:WC_PENCIL,bend:-20,lw:3.5});
  if(bk>0.01){const e=easeCam(bk),ex=lerp(cx+cw/2,ax,0.55),ey=lerp(cy,ay,0.55);gp_arrow(ctx,[cx+cw/2,cy],[ex,ey+12*e],-10,1,{col:GV.redInk,lw:4,head:false,dash:[12,10],a:0.9*clamp(bk*2,0,1)});
    wc_cross(ctx,ex,ey+12*e,34,GV.redInk,clamp(bk*2-0.6,0,1));}}
// the rename's pull request: the impact check's report, as its description shows it, and its checks; the impact check fails and says
// why (o.fail); the report's breaking line lit (o.lit), and who uses it (o.who)
const GP_RNPR={title:"Rename faculty_code to faculty",sub:"Jun Park wants to merge into main"},
  GP_RNR=[{h:1,s:"What this change touches"},{fold:1},{h:2,s:"Contracts"},
    {li:"`mart_planning__near_award`: **breaking**: removed faculty_code, added faculty. Needs a new",col:GV.redInk,litCol:GV.red},
    {cont:1,s:"version, with a deprecation date for this one",col:GV.redInk,litCol:GV.red},{h:2,s:"Who uses it"},{li:"`census_dashboard`, owned by Planning"}];
// a report in Markdown, as a page shows it (A Governed in dbt's gd_md): items {h:1 or 2, s}, {li:s}, {cont:1, s}, {s}, {fold:1}, each with p
// (0 to 1, shown), lit (a wash in litCol) and col (its ink); drawn from (x,y), w wide; returns each item's baseline and where it ends
function gp_md(ctx,x,y,w,items){let by=y+54;const out=[];items.forEach(it=>{const p=it.p==null?1:clamp(it.p,0,1),sz=it.h===1?36:it.h===2?30:28,lh=it.h===1?56:it.h===2?50:it.fold?36:40;
    if(p>0.01){const tx=x+30+(it.li!=null||it.cont?32:0),s=it.li!=null?it.li:it.s;
      if(it.lit>0.01)gv_tint(ctx,x+16,by-32,w-32,lh-2,it.litCol||GV.gold,0.8*clamp(it.lit,0,1));
      withA(ctx,p,()=>{if(it.fold)wc_T(ctx,"…",x+30,by,{w:500,size:28,f:"mono",col:WC_PENCIL});
        else if(it.h)wc_T(ctx,s,x+30,by,{w:800,size:sz,col:WC_DARK});
        else{if(it.li!=null)wc_T(ctx,"•",x+34,by,{w:800,size:28,col:it.col||WC_INK});gu_md(ctx,s,tx,by,{size:28,col:it.col});}});}
    out.push(by);by+=lh;});return{rows:out,end:by};}
function gp_renamePR(ctx,t,o){o=o||{};const [x,y,w,h]=GU_BIG,f=clamp(o.fail||0,0,1);
  gu_page(ctx,x,y,w,h,{bar:"GitHub · pull request",title:GP_RNPR.title,titleSize:40,state:["Open",GV.green],sub:GP_RNPR.sub});
  gu_box(ctx,150,248,1620,380,null,{seed:441});
  gp_md(ctx,150,248,1620,GP_RNR.map((it,i)=>Object.assign({},it,{lit:i===3||i===4?clamp(o.lit||0,0,1):i===6?clamp(o.who||0,0,1)*0.6:0,litCol:i===6?GV.gold:it.litCol})));
  const its=["build","governance","products","reviewers","impact"].map(n=>({name:n,st:n==="impact"?(f>0.5?"fail":"run"):"pass"}));
  gu_checks(ctx,150,644,1620,{h:216,items:its,t,msg:[{s:GP_IMP,col:GV.redInk,p:clamp(f*2-1,0,1)}],pop:[0,0,0,0,clamp(f*2-1,0,1)],msgGap:58,summary:true});}
// on the data team's board, Clara's table in two versions: version 1 stays, with a date to go (o.v1, o.date); version 2 goes in beside it
// (o.v2); the census dashboard still reads version 1 (o.rd)
function gp_verCard(ctx,x,y,w,h,ver,col,seed,lit){wc_panel(ctx,x,y,w,h,{kind:"card",seed});gv_pin(ctx,x+w/2,y+18,GV.red,1.1);
  wc_T(ctx,"version "+ver,x+40,y+104,{w:800,size:44,col:WC_DARK});wc_T(ctx,"mart_planning__near_award",x+40,y+160,{w:500,size:28,f:"mono",col:WC_MUTED});
  if(lit>0.01)gv_tint(ctx,x+28,y+194,gu_mw(ctx,col,30)+24,48,GV.gold,0.8*lit);wc_T(ctx,col,x+40,y+230,{w:500,size:30,f:"mono",col:WC_DARK});}
function gp_editions(ctx,t,o){o=o||{};const v1=clamp(o.v1==null?1:o.v1,0,1),v2=clamp(o.v2||0,0,1),dt=clamp(o.date||0,0,1),rd=clamp(o.rd||0,0,1);
  gp_head(ctx,"Clara's table",clamp(v1*2,0,1));
  gp_rise(ctx,v1,()=>gp_verCard(ctx,260,300,600,290,"1","faculty_code",461,0),16);
  if(dt>0.01){wc_hand(ctx,"a date to go",700,672,{size:44,w:700,col:GV.redInk,align:"center",p:dt});wc_ring(ctx,700,656,170,44,clamp(dt*1.4-0.3,0,1),{col:GV.redInk,lw:4});}
  if(v2>0.01){const e=easeCam(v2);withA(ctx,clamp(v2*1.6,0,1),()=>gp_verCard(ctx,lerp(1340,1060,e),300,600,290,"2","faculty",462,clamp(v2*2-1,0,1)));}
  if(rd>0.01){const x=240,y=730,w=440,h=96;gp_thread(ctx,[x+w/2,y],[x+w/2,596],clamp(rd*1.6,0,1),{col:WC_PENCIL,bend:0,lw:3.5});
    gp_rise(ctx,clamp(rd*1.6-0.4,0,1),()=>{wc_panel(ctx,x,y,w,h,{kind:"card",seed:463});wc_T(ctx,"census_dashboard",x+30,y+60,{w:500,size:28,f:"mono",col:WC_DARK});},10);}}
// credentials' two versions: the model's YAML, version 2 and version 1, and version 1's date to go, ringed (o.two, o.date, o.ring); then
// version 1's contract, written by the script, which says it's deprecated (o.c, o.dep), on its way out (o.out)
const GP_CRV=[{n:233,s:"    versions:"},{n:234,s:"      - v: 2"},{fold:1},{n:240,s:"      - v: 1"},{n:241,s:"        deprecation_date: 2027-03-31"}],
  GP_CR1=[{n:6,s:"name: core_credential_v1"},{n:7,s:"version: 1.0.0"},{n:8,s:"status: deprecated"}];
function gp_credVers(ctx,t,o){o=o||{};const A=gp_file(ctx,80,60,1100,o.u==null?1:o.u,{path:"models/core/student/_core_student__models.yml",lang:"yaml",
    lines:GP_CRV.map((r,i)=>i===1||i===3?Object.assign({},r,{lit:clamp(o.two||0,0,1)}):i===4?Object.assign({},r,{lit:clamp(o.date||0,0,1),litCol:GV.red}):r)});
  if(A.rows.length&&o.ring>0.01){const s=GP_CRV[4].s,i0=s.indexOf("2027"),x0=A.tx+gu_mw(ctx,s.slice(0,i0)),x1=A.tx+gu_mw(ctx,s);
    wc_ring(ctx,(x0+x1)/2,A.rows[4],(x1-x0)/2+30,34,clamp(o.ring,0,1),{col:GV.redInk,lw:4});}
  const c=clamp(o.c||0,0,1),C=gp_file(ctx,760,500,1100,c,{path:"governance/5-data-contracts/core_credential_v1.yaml",lang:"yaml",
    lines:GP_CR1.map((r,i)=>i===2?Object.assign({},r,{lit:clamp(o.dep||0,0,1),litCol:GV.amber}):r)});gp_gen(ctx,1850,470,c);
  if(C.rows.length&&o.out>0.01)wc_hand(ctx,"on its way out",C.tx+gu_mw(ctx,GP_CR1[2].s)+60,C.rows[2]+12,{size:40,w:700,col:GV.amberInk,p:clamp(o.out,0,1)});}

/* ---------- 6 · who reads it ---------- */
// Clara's product descriptor: who reads it, from dbt's exposures, the record of who uses what (o.rd): the census dashboard, owned by
// Planning, on a card at its right; and what it's built from (o.built): its input ports, two of Mei's products, each port lit in its
// product's colour, on threads to the products' stalls
const GP_RDS=[{n:16,s:"inputPorts:"},{n:17,s:"- name: core_learner_v1",pr:0},{fold:1},{n:20,s:"- name: core_award_v1",pr:1},{fold:1},{n:23,s:"- name: core_credit_towards_award_v1",pr:0},{fold:1},
  {n:26,s:"outputPorts:"},{n:27,s:"- name: mart_planning__near_award"},{fold:1},{n:45,s:"- property: consumers"},{n:46,s:"  value:"},{n:47,s:"  - exposure census_dashboard"}];
function gp_readers(ctx,t,o){o=o||{};const rd=clamp(o.rd||0,0,1),bl=clamp(o.built||0,0,1);
  const F=gp_file(ctx,60,70,1100,o.u==null?1:o.u,{path:"governance/6-product-descriptors/learners_near_an_award.yaml",lang:"yaml",
    lines:GP_RDS.map((r,i)=>i>=10?Object.assign({},r,{lit:rd}):r.pr!=null?Object.assign({},r,{lit:bl,litCol:GP_SIX[r.pr][2]}):i===0?Object.assign({},r,{lit:bl}):r)});
  if(!F.rows.length)return;gp_gen(ctx,1150,46,clamp((o.u==null?1:o.u)*1.6,0,1));
  if(rd>0.01){const x=1250,y=600,w=600,h=140,end=[F.tx+gu_mw(ctx,GP_RDS[12].s)+18,F.rows[12]];
    gp_thread(ctx,end,[x,y+h/2],clamp(rd*1.6,0,1),{col:WC_PENCIL,bend:-10,lw:3.5});
    gp_rise(ctx,clamp(rd*1.6-0.4,0,1),()=>{wc_panel(ctx,x,y,w,h,{kind:"card",seed:471});wc_T(ctx,"census_dashboard",x+30,y+58,{w:500,size:28,f:"mono",col:WC_DARK});
      wc_T(ctx,"owned by Planning",x+30,y+104,{w:600,size:28,col:WC_MUTED});},12);
    wc_hand(ctx,"from dbt's exposures: who uses what",x+w,y+h+52,{size:34,w:700,col:WC_PENCIL,align:"right",p:clamp(rd*1.6-0.6,0,1)});}
  if(bl>0.01)[[0,70],[1,330]].forEach(([p,y],k)=>{const v=clamp(bl*2-k*0.5,0,1);if(v<=0.01)return;
    gp_rise(ctx,v,()=>gp_stall(ctx,p,1250,y,600,200,{size:34,own:clamp(v*1.4-0.4,0,1)}),16);
    GP_RDS.forEach((r,i)=>{if(r.pr!==p)return;gp_thread(ctx,[F.tx+gu_mw(ctx,r.s)+18,F.rows[i]],[1244,y+100],clamp(v*1.6-0.3,0,1),{col:mix(GP_SIX[p][2],WC_DARK,0.3),bend:-20,lw:3.5});});});}
// when one of Mei's products changes, she knows who to tell: learner_records' descriptor, the products that read it (o.lit); Mei's card
// (o.mei); and a letter from her to each of their owners (o.tell, 0 to 1, one after another). The film it comes from (o.tag)
const GP_MEIL=[{n:50,s:"customProperties:"},{n:51,s:"- property: consumers"},{n:52,s:"  value:"},{n:53,s:"  - product learner_wallet"},{n:54,s:"  - product learners_near_an_award"},
  {n:55,s:"  - product tuition_forgone"}],GP_TELL=[["Wallet app team",3],["Clara Jensen, Planning",2],["Finance",4]];
function gp_env(ctx,x,y,s,a){if(a<=0.01)return;ctx.save();ctx.translate(x,y);ctx.scale(s,s);withA(ctx,a,()=>{wc_panel(ctx,-46,-30,92,60,{kind:"envelope",seed:481});
  ctx.strokeStyle=rgba(WC_PENCIL,0.7);ctx.lineWidth=2.4;ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(-44,-28);ctx.lineTo(0,4);ctx.lineTo(44,-28);ctx.stroke();});ctx.restore();}
function gp_meiTells(ctx,t,o){o=o||{};const L=clamp(o.lit||0,0,1),tl=clamp(o.tell||0,0,1);
  const F=gp_file(ctx,60,60,1000,o.u==null?1:o.u,{path:"governance/6-product-descriptors/learner_records.yaml",lang:"yaml",
    lines:GP_MEIL.map((r,i)=>i>=3?Object.assign({},r,{lit:clamp(L*3-(i-3),0,1),litCol:GP_SIX[GP_TELL[i-3][1]][2]}):r)});
  if(F.rows.length)gp_gen(ctx,1050,36,clamp((o.u==null?1:o.u)*1.6,0,1));gu_nameCard(ctx,90,560,"Mei Tanaka","registrar's office",clamp(o.mei||0,0,1));
  GP_TELL.forEach(([who,p],k)=>{const v=clamp(tl*3-k,0,1);if(v<=0.01)return;const x=1220,y=80+k*190,w=620,h=150;
    if(F.rows.length)gp_thread(ctx,[F.tx+gu_mw(ctx,GP_MEIL[3+k].s)+18,F.rows[3+k]],[x,y+h/2],clamp(v*2,0,1),{col:mix(GP_SIX[p][2],WC_DARK,0.3),bend:-14,lw:3.5});
    gp_rise(ctx,clamp(v*2-0.3,0,1),()=>{wc_panel(ctx,x,y,w,h,{kind:"card",seed:490+k});ctx.save();ctx.fillStyle=rgba(GP_SIX[p][2],0.9);ctx.fillRect(x+8,y+8,14,h-16);ctx.restore();
      wc_T(ctx,who,x+44,y+64,{w:800,size:32,col:WC_DARK});wc_T(ctx,GP_SIX[p][0],x+44,y+112,{w:600,size:28,col:WC_MUTED});},12);
    const e=easeCam(clamp(v*1.4-0.3,0,1)),sx=420,sy=616,ex=x-60,ey=y+h/2;if(e>0.01&&e<0.999)gp_env(ctx,lerp(sx,ex,e),lerp(sy,ey,e)-80*Math.sin(Math.PI*e),0.8,1);
    if(e>=0.999)gp_env(ctx,ex,ey,0.8,1);});
  if(o.tag>0.01)gu_filmTag(ctx,90,790,"A product with an owner",clamp(o.tag,0,1));}

/* ---------- 7 · open standards ---------- */
// the two standards, as books on the desk, each with its title, its version on a tab (o.ver), and who keeps it, printed at its foot
// (o.who); a newer edition behind each (o.newer); between them, the licence that makes them free to use (o.lic). Under each, a file written
// in it, its apiVersion on a thread to its book's version (o.files, o.thr)
const GP_BOOK=[{t:["Open Data","Product Standard"],v:"v1.0.0",nv:"v1.1.0",col:[38,96,132],x:150,f:"…/learners_near_an_award.yaml",k:"DataProduct"},
  {t:["Open Data","Contract Standard"],v:"v3.1.0",nv:"v3.2.0",col:[30,72,110],x:1070,f:"…/mart_planning__near_award.yaml",k:"DataContract"}],GP_BK={y:120,w:700,h:320};
function gp_bookC(col){const {w,h}=GP_BK;return wc_kept("gpBook"+col.join(","),w+40,h+40,q=>{q.translate(20,20);q.save();q.filter="blur(8px)";q.fillStyle="rgba(50,40,30,0.25)";q.fillRect(8,14,w,h);q.restore();
  wc_part(q,wc_rect(0,0,w,h),col,1,{lw:1.4});wc_part(q,wc_rect(0,0,40,h),wc_dim(col,0.25),1,{lw:1});q.save();q.strokeStyle="rgba(255,255,255,0.35)";q.lineWidth=2;q.strokeRect(64,22,w-86,h-44);q.restore();});}
function gp_vtab(ctx,x,y,s,a){if(a<=0.01)return;withA(ctx,a,()=>{const w=Math.round(gu_mw(ctx,s)+36);wc_panel(ctx,x-w,y,w,50,{kind:"pill",wash:[250,246,236],washA:0.95,seed:s.length+500});
  wc_T(ctx,s,x-w+18,y+35,{w:500,size:28,f:"mono",col:WC_DARK});});}
function gp_books(ctx,t,o){o=o||{};const {y,w,h}=GP_BK,cream=[250,246,236];
  GP_BOOK.forEach((b,i)=>{const v=clamp(o.u==null?1:(o.u[i]==null?1:o.u[i]),0,1);if(v>0.01){
    const nw=clamp((o.newer||0)*1.6-i*0.3,0,1);if(nw>0.01)withA(ctx,clamp(nw*1.6,0,1),()=>{const e=easeCam(nw),bx=b.x+60*e,by=y-70*e;
      ctx.drawImage(gp_bookC(mix(b.col,[255,255,255],0.18)),bx-20,by-20);gp_vtab(ctx,bx+w-30,by+12,b.nv,1);});
    gp_rise(ctx,v,()=>{ctx.drawImage(gp_bookC(b.col),b.x-20,y-20);b.t.forEach((s,k)=>wc_T(ctx,s,b.x+90,y+118+k*58,{w:800,size:46,col:cream}));
      withA(ctx,clamp(o.who||0,0,1),()=>wc_T(ctx,"Bitol · Linux Foundation",b.x+90,y+h-50,{w:600,size:28,col:mix(cream,b.col,0.25)}));
      gp_vtab(ctx,b.x+w-30,y+30,b.v,clamp(o.ver==null?1:o.ver,0,1));},18);}
    const fv=clamp(o.files||0,0,1);if(fv<=0.01)return;const F=gp_file(ctx,b.x,560,w,fv,{path:b.f,lang:"yaml",lines:[{n:3,s:"apiVersion: "+b.v},{n:4,s:"kind: "+b.k}]});
    if(F.rows.length&&v>0.5)gp_thread(ctx,[F.tx+gu_mw(ctx,"apiVersion: "+b.v)+18,F.rows[0]],[b.x+w-60,y+82],clamp((o.thr||0)*1.6-i*0.4,0,1),{col:GU_CYAN,bend:-40,lw:3.5});});
  const lc=clamp(o.lic||0,0,1);if(lc>0.01){const k=0.9+0.1*spring(lc);ctx.save();ctx.translate(960,500);ctx.scale(k,k);
    withA(ctx,clamp(lc*1.6,0,1),()=>wc_tag(ctx,0,0,"Apache License 2.0",{align:"center",size:32,wash:GV.green,washA:0.3,seed:511}));ctx.restore();}}
// tools that know the standard read the file: three tools' windows, plain, each showing the contract it read (o.read, one after another);
// then the check, run in a terminal: every file up to date, and valid against its standard (o.chk, o.valid)
const GP_TL=["a catalogue","a quality tool","a schema editor"];
function gp_tools(ctx,t,o){o=o||{};const rd=clamp(o.read||0,0,1),ck=clamp(o.chk||0,0,1),dm=1-0.35*ck;
  withA(ctx,dm,()=>{const F=gu_file(ctx,60,70,860,{path:"…/5-data-contracts/mart_planning__near_award.yaml",lang:"yaml",
      lines:[{n:3,s:"apiVersion: v3.1.0"},{n:4,s:"kind: DataContract"},{fold:1},{n:6,s:"name: mart_planning__near_award"}]});
    GP_TL.forEach((s,i)=>{const v=clamp(rd*3-i,0,1);if(v<=0.01)return;const x=1060,y=50+i*190,w=780,h=160;
      gp_arrow(ctx,[F.tx+gu_mw(ctx,"name: mart_planning__near_award")+24,F.rows[3]],[x-14,y+h/2],-20+i*30,clamp(v*1.8,0,1),{col:GU_CYAN,lw:4});
      gp_rise(ctx,clamp(v*1.8-0.5,0,1),()=>gp_win(ctx,x,y,w,h,s,q=>{wc_T(q,"mart_planning__near_award",x+30,y+98,{w:500,size:28,f:"mono",col:WC_DARK});
        wc_T(q,"17 columns",x+w-30,y+98,{w:700,size:28,col:WC_MUTED,align:"right"});},[96,104,112]),12);});});
  if(ck<=0.01)return;gp_rise(ctx,ck,()=>gp_win(ctx,60,610,1460,250,"Terminal",q=>{wc_T(q,"$ python scripts/generate/products.py --check",96,704,{w:500,size:28,f:"mono",col:WC_DARK});
    const p=clamp(ck*2-0.8,0,1);GP_OK16.forEach((s,i)=>{const n=Math.ceil(s.length*p);if(n<=0)return;const yy=752+i*44;
      if(i===0&&o.valid>0.01&&p>=1)gp_mark(q,96,yy-10,s,"up to date and valid",clamp(o.valid,0,1),GV.green);wc_T(q,s.slice(0,n),96,yy,{w:500,size:28,f:"mono",col:GV.greenInk});});},[60,66,74]),14);}
// the versions the project keeps: governance/7-standards/, the two schemas it checks the files against (o.dir), and what its README says
// about them (o.u): the catalogue reads contract standard 3.1.0 (o.lit), and how to move to a newer one (o.move)
const GP_7R=[{n:12,s:"… The contract standard's 3.2.0 and the product standard's 1.1.0"},{n:13,s:"are newer. Contract standard 3.1.0 is the version Ontos reads and writes (checked on …"},
  {n:14,s:"and product standard 1.0.0 is the release of the same time. To move to a newer version, copy its"},{n:15,s:"schema here and change the versions in the script."}];
function gp_kept(ctx,t,o){o=o||{};const dv=clamp(o.dir==null?1:o.dir,0,1);
  gp_rise(ctx,dv,()=>{const x=60,y=470,w=1000,h=300;wc_panel(ctx,x,y,w,h,{kind:"card",seed:521});gv_pin(ctx,x+w/2,y+16,GV.red,1.1);
    wc_T(ctx,"governance/7-standards/",x+40,y+92,{w:500,size:30,f:"mono",col:WC_DARK});
    ["open-data-contract-standard-3.1.0.schema.json","open-data-product-standard-1.0.0.schema.json"].forEach((s,i)=>{const yy=y+164+i*54;
      if(o.lit>0.01){const v=i?"1.0.0":"3.1.0";gp_mark(ctx,x+80,yy-10,s,v,clamp(o.lit,0,1),GV.gold);}wc_T(ctx,s,x+80,yy,{w:500,size:28,f:"mono",col:WC_INK});});},16);
  const R=gp_file(ctx,60,60,1800,o.u==null?1:o.u,{path:"governance/7-standards/README.md",lines:GP_7R});
  if(!R.rows.length)return;gp_mark(ctx,R.tx,R.rows[1],GP_7R[1].s,"Contract standard 3.1.0 is the version Ontos reads and writes",clamp(o.lit||0,0,1),GV.gold);
  gp_mark(ctx,R.tx,R.rows[2],GP_7R[2].s,"To move to a newer version, copy its",clamp(o.move||0,0,1),GU_CYAN);gp_mark(ctx,R.tx,R.rows[3],GP_7R[3].s,"schema here and change the versions in the script.",clamp(o.move||0,0,1),GU_CYAN);}

/* ---------- 8 · a catalogue over the platform ---------- */
// the platform team's room, close: Sam behind his desk, and on his two screens Ontos, the catalogue, with its products and contracts
// counted (o.u), and Unity Catalog's tables
function gp_samDesk(x,tt,o){o=o||{};gv_behind(x,"sam",GV_PX.seat[0],GV_PX.top,GV_PX.seat[1],Object.assign({pose:"listen",t:tt,flip:true},o.sam||{}));
  x.drawImage(gv_place("platformDesk"),0,0,W,H);if(o.draw)o.draw(x);}
function gp_ontosScreens(ctx,t,o){o=o||{};const [[lx,ly,lw,lh],[rx,ry,rw,rh]]=GV_PX.screens,u=clamp(o.u==null?1:o.u,0,1);
  gv_screen(ctx,lx,ly,lw,lh,"Ontos · Databricks Labs",q=>{[["Data Products","6"],["Data Contracts","10"]].forEach(([k,v],i)=>{const yy=ly+124+i*72,a=clamp(u*2-i*0.6,0,1);if(a<=0.01)return;
    withA(q,a,()=>{wc_T(q,k,lx+36,yy,{w:700,size:30,col:WC_DARK});wc_T(q,v,lx+lw-40,yy,{w:800,size:34,col:WC_DARK,align:"right"});});});},{barH:46,titleSize:28,bar:GP_CATBAR});
  gv_screen(ctx,rx,ry,rw,rh,"Unity Catalog",q=>{["core_learner_v1","core_award_v1","mart_planning__near_award"].forEach((s,i)=>wc_T(q,s,rx+36,ry+116+i*58,{w:500,size:28,f:"mono",col:WC_DARK}));},
    {barH:46,titleSize:28});}
// Ontos imports a contract from its file: the file uploaded (o.up), then the contract as Ontos read it, its columns and the fields it
// took from the file (o.rev)
const GP_IMPF=[["Status","active"],["Domain","planning"],["Data Product","learners_near_an_award"]];
function gp_import(ctx,t,o){o=o||{};const [x,y,w,h]=GU_BIG,up=clamp(o.up||0,0,1),rv=clamp(o.rev||0,0,1);
  gu_page(ctx,x,y,w,h,{bar:"Ontos · Contracts",title:"Import",titleSize:40,tabs:["Upload ODCS YAML file","Review parsed contract"],tab:rv>0.3?1:0});
  wc_panel(ctx,150,300,1620,140,{kind:"card",dashed:true,seed:531});
  if(up>0.01)gp_rise(ctx,up,()=>{gv_sheet(ctx,190,322,70,94);gv_lines(ctx,204,346,42,4,16,0.9);wc_T(ctx,"mart_planning__near_award.yaml",290,382,{w:500,size:28,f:"mono",col:WC_DARK});
    wc_tick(ctx,1720,366,34,GV.greenInk,clamp(up*2-1,0,1),5);},12);
  if(rv<=0.01)return;gp_rise(ctx,rv,()=>{gu_box(ctx,150,470,1620,380,"mart_planning__near_award",{seed:532});wc_T(ctx,"17 columns",900,518,{w:700,size:28,col:WC_MUTED,align:"right"});
    ["learner_award_key","census_date","faculty_code","…","is_near_award"].forEach((s_,i)=>wc_T(ctx,s_,190,580+i*54,{w:500,size:28,f:"mono",col:s_==="…"?WC_PENCIL:WC_INK}));
    ctx.fillStyle=rgba(WC_PENCIL,0.3);ctx.fillRect(960,500,2,320);
    GP_IMPF.forEach(([k,v],i)=>{const yy=580+i*80,a=clamp(rv*3-0.6-i*0.4,0,1);withA(ctx,a,()=>{wc_T(ctx,k,1000,yy,{w:600,size:28,col:WC_MUTED});
      wc_T(ctx,v,1000,yy+38,{w:500,size:28,f:"mono",col:WC_DARK});});});},14);}
// Ontos lays the products out by domain, each with its owner team, as its product form names the two (o.u, row by row)
const GP_DOM=[[0,"student"],[1,"course"],[2,"planning"],[3,"wallet"],[4,"finance"],[5,"learning"]],
  GP_TEAM=["Mei Tanaka, registrar's office","Mei Tanaka, registrar's office","Clara Jensen, Planning","Wallet app team","Finance","Learning team"];
function gp_domains(ctx,t,o){o=o||{};const [x,y,w,h]=GU_BIG,u=clamp(o.u==null?1:o.u,0,1);
  gu_page(ctx,x,y,w,h,{bar:"Ontos · Data Products",title:"Data Products",titleSize:40});
  const cx=[230,760,1060],hy=300;["Name","Domain","Owner Team"].forEach((s,i)=>wc_T(ctx,s,cx[i],hy,{w:700,size:28,col:WC_MUTED}));
  ctx.fillStyle=rgba(WC_PENCIL,0.3);ctx.fillRect(170,hy+20,1580,2);
  GP_DOM.forEach(([p,d],i)=>{const v=clamp(u*6-i,0,1);if(v<=0.01)return;const ry=hy+86+i*82;withA(ctx,v,()=>{ctx.save();ctx.fillStyle=rgba(GP_SIX[p][2],0.9);ctx.fillRect(184,ry-34,12,46);ctx.restore();
    wc_T(ctx,GP_SIX[p][0],cx[0],ry,{w:700,size:30,col:WC_DARK});gp_pill(ctx,cx[1]-8,ry-10,d,{size:28,w:600,wash:GV.grey,washA:0.25,seed:540+i});
    const g=clamp(o.team||0,0,1);if(g>0.01)gv_tint(ctx,cx[2]-12,ry-34,tw(ctx,GP_TEAM[i],28,600)+24,46,GV.gold,0.7*g);wc_T(ctx,GP_TEAM[i],cx[2],ry,{w:600,size:28,col:WC_INK});});});}
// a product's page: its domain and owner team, and where it is on its way to being published, as Ontos's guide sets the steps out
// (o.step, 0 to 4, moving along); who acts at each: a data steward reviews and approves (o.stw), its owner publishes (o.pub)
const GP_LIFE=["Draft","Proposed","Under Review","Approved","Active"];
function gp_lifecycle(ctx,t,o){o=o||{};const [x,y,w,h]=GU_BIG,st=clamp(o.step||0,0,4),cur=Math.round(st),stc=[GV.grey,GV.grey,GV.amber,GV.gold,GV.green][cur];
  gu_page(ctx,x,y,w,h,{bar:"Ontos · Data Products",title:"Learners near an award",titleSize:40,state:[GP_LIFE[cur],stc]});
  [["Domain","planning"],["Owner Team","Clara Jensen, Planning"]].forEach(([k,v],i)=>{const yy=300+i*52;wc_T(ctx,k,170,yy,{w:600,size:28,col:WC_MUTED});wc_T(ctx,v,420,yy,{w:700,size:30,col:WC_DARK});});
  let px=170;const py=520,xs=[];GP_LIFE.forEach((s,i)=>{const pw=Math.round(tw(ctx,s,30,700)+48),on=clamp(1-Math.abs(st-i)*1.4,0,1),done=st>i+0.5;xs.push([px,pw]);
    if(on>0.01)gv_halo(ctx,px-14,py-44,pw+28,88,i===4?GV.green:GV.gold,0.9*on);
    wc_panel(ctx,px,py-30,pw,60,{kind:"pill",wash:done||on>0.5?(i===4?GV.green:i>=2?GV.gold:GV.grey):null,washA:0.3,seed:550+i});wc_T(ctx,s,px+24,py+11,{w:700,size:30,col:WC_DARK});
    if(i<4)gp_arrow(ctx,[px+pw+10,py],[px+pw+54,py],0,1,{col:WC_PENCIL,lw:3,a:0.7});px+=pw+64;});
  wc_T(ctx,"…",px-6,py+11,{w:700,size:30,col:WC_PENCIL});
  const who=(i0,i1,s,v,col)=>{if(v<=0.01)return;const a=xs[i0][0],b=xs[i1][0]+xs[i1][1],m=(a+b)/2;withA(ctx,clamp(v*1.6,0,1),()=>{ctx.save();ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=3;
    ctx.beginPath();ctx.moveTo(a+8,py+52);ctx.lineTo(a+8,py+66);ctx.lineTo(b-8,py+66);ctx.lineTo(b-8,py+52);ctx.stroke();ctx.restore();});
    const al=i0===4?"left":"right";wc_hand(ctx,s,al==="left"?a+8:b-8,py+122,{size:36,w:700,col:col,align:al,p:v});};
  who(2,3,"a Data Steward reviews, and approves",clamp(o.stw||0,0,1),GV.goldInk);who(4,4,"its owner publishes",clamp(o.pub||0,0,1),GV.greenInk);}
// a policy that runs every night: Data Product Ownership, as Ontos's guide writes it, with the university's address; its lines lit as
// they're said (o.lit[k]); its schedule (o.sch)
const GP_POL=["MATCH (prod:data_product)","WHERE prod.status IN ['active', 'certified']","ASSERT prod.owner != 'unknown' AND LENGTH(prod.owner) > 0",
  "ON_FAIL FAIL 'Active data products must have a valid owner assigned'","ON_FAIL ASSIGN_TAG needs_attention: 'missing_owner'","ON_FAIL NOTIFY 'data.governance@uni.example'",
  "ON_PASS REMOVE_TAG needs_attention"];
function gp_policy(ctx,t,o){o=o||{};const [x,y,w,h]=GU_BIG,L=o.lit||[];
  gu_page(ctx,x,y,w,h,{bar:"Ontos · Compliance",title:"Data Product Ownership",titleSize:40,sub:"Policy"});
  gu_box(ctx,150,280,1620,420,null,{seed:561});
  GP_POL.forEach((s,i)=>{const yy=346+i*48,l=clamp(L[i]||0,0,1),kw=s.match(/^\w+/)[0];if(l>0.01)gv_tint(ctx,170,yy-33,gu_mw(ctx,s)+40,44,i>=3&&i<=5?GV.amber:GV.gold,0.75*l);
    wc_T(ctx,kw,190,yy,{w:700,size:28,f:"mono",col:WC_DARK});wc_T(ctx,s.slice(kw.length),190+gu_mw(ctx,kw),yy,{w:500,size:28,f:"mono",col:WC_INK});});
  const sc=clamp(o.sch==null?1:o.sch,0,1);if(sc>0.01)withA(ctx,sc,()=>{wc_T(ctx,"Schedule",170,770,{w:700,size:30,col:WC_DARK});
    const pw=gp_pill(ctx,330,760,"Daily",{size:30,wash:GU_CYAN,washA:0.25,seed:562});wc_T(ctx,"02:00",330+pw+24,770,{w:500,size:30,f:"mono",col:WC_DARK});});}
// a contract's page: its schema, and a column linked to the business term it holds, its authoritative definition (o.link); the term, on a
// card at the right, as Planning's conceptual model defines it (o.term)
function gp_link(ctx,t,o){o=o||{};const [x,y,w,h]=GU_BIG,lk=clamp(o.link||0,0,1),tm=clamp(o.term||0,0,1),V=GV_MEAN.violet,VI=GV_MEANINK.violet;
  gu_page(ctx,x,y,w,h,{bar:"Ontos · Contracts",title:"mart_planning__near_award",titleSize:40,tabs:["Schema"],tab:0});
  gu_box(ctx,150,300,1000,540,null,{seed:571});
  [["census_date","date"],["faculty_code","string"],["…",""],["is_near_award","boolean"]].forEach(([n,ty],i)=>{const yy=370+i*60;if(i===3&&lk>0.01)gv_tint(ctx,170,yy-34,960,48,V,0.45*lk);
    wc_T(ctx,n,190,yy,{w:500,size:28,f:"mono",col:n==="…"?WC_PENCIL:WC_DARK});if(ty)wc_T(ctx,ty,1110,yy,{w:600,size:28,col:WC_MUTED,align:"right"});});
  const ly=640;wc_T(ctx,"Authoritative Definition",190,ly,{w:700,size:28,col:WC_MUTED});
  if(lk>0.01){const k=0.9+0.1*spring(lk);ctx.save();ctx.translate(190,ly+64);ctx.scale(k,k);withA(ctx,clamp(lk*1.6,0,1),()=>gp_pill(ctx,0,0,"learner near an award",{size:30,wash:V,washA:0.4,seed:572}));ctx.restore();}
  if(tm<=0.01)return;const cx=1190,cy=300,cw=600,ch=380;gp_thread(ctx,[190+tw(ctx,"learner near an award",30,700)+50,ly+64],[cx,cy+ch-70],clamp(tm*1.6,0,1),{col:VI,bend:-20,lw:3.5});
  gp_rise(ctx,clamp(tm*1.6-0.4,0,1),()=>{wc_panel(ctx,cx,cy,cw,ch,{kind:"card",seed:573});ctx.save();ctx.fillStyle=rgba(V,0.85);ctx.fillRect(cx+8,cy+8,cw-16,14);ctx.restore();
    // its label and its definition, word for word, as Planning's conceptual model has them (models/marts/planning/_planning__conceptual.yml)
    wc_T(ctx,"learner near an award",cx+36,cy+92,{w:800,size:34,col:VI});["A learner who, on the census date, was","studying, enrolled in an award, and had","more than none and no more than 15","credit points left to earn towards it."].forEach((s,i)=>
      wc_T(ctx,s,cx+36,cy+150+i*44,{w:600,size:28,col:WC_INK}));wc_T(ctx,"owner: Planning",cx+36,cy+ch-40,{w:600,size:28,col:WC_MUTED});},14);}
// what Databricks says of every Labs project, on its Labs page, lit as it's said (o.lit[k])
const GP_LABS=["Please note that all projects in the https://github.com/databrickslabs account are provided for your",
  "exploration only, and are not formally supported by Databricks with service level agreements (SLAs).","They are provided AS IS and we do not make any guarantees of any kind."],
  GP_LABSLIT=[[0,"provided for your"],[1,"exploration only"],[1,"not formally supported by Databricks"],[2,"provided AS IS"]];
function gp_markP(ctx,x,cy,s,sub,a,col,size,wt){if(a<=0.01)return;const i=s.indexOf(sub);if(i<0)return;gv_tint(ctx,x+tw(ctx,s.slice(0,i),size,wt)-6,cy-21,tw(ctx,sub,size,wt)+12,42,col,0.85*clamp(a,0,1));}
function gp_labs(ctx,t,o){o=o||{};const [x,y,w,h]=GU_BIG,L=o.lit||[];
  gu_page(ctx,x,y,w,h,{bar:"databricks.com · Databricks Labs",title:"Databricks Labs Projects",titleSize:40});
  gu_box(ctx,150,330,1620,300,null,{seed:581});
  GP_LABS.forEach((s,i)=>{const yy=420+i*64;GP_LABSLIT.forEach(([r,sub],k)=>{if(r===i)gp_markP(ctx,190,yy-10,s,sub,clamp(L[k]||0,0,1),GV.amber,28,600);});
    wc_T(ctx,s,190,yy,{w:600,size:28,col:WC_INK});});
  wc_T(ctx,"Ontos · Databricks Labs",190,720,{w:700,size:30,col:WC_DARK,a:clamp(o.ontos==null?1:o.ontos,0,1)});}
// on Noor's map, in the application layer's free part: the files' home, the project's governance/ folder, drawn solid with a house at its
// corner (o.home); a copy in Ontos, dashed (o.copy); an arrow from one to the other, one way (o.arr). The film it comes from (o.tag)
function gp_house(ctx,x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle=rgba([255,253,246],0.95);ctx.strokeStyle=rgba(WC_DARK,0.8);ctx.lineWidth=2.6;ctx.lineJoin="round";
  ctx.beginPath();ctx.moveTo(-16,-2);ctx.lineTo(0,-16);ctx.lineTo(16,-2);ctx.lineTo(16,16);ctx.lineTo(-16,16);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.moveTo(-5,16);ctx.lineTo(-5,5);ctx.lineTo(5,5);ctx.lineTo(5,16);ctx.stroke();ctx.restore();}
function gp_home(ctx,t,o){o=o||{};const [bx,by,bw,bh]=gv_mapFree(GV_MC[0],GV_MC[1],GV_MC[2],GV_MC[3],4),cy=by+bh/2,hm=clamp(o.home||0,0,1),cp=clamp(o.copy||0,0,1),ar=clamp(o.arr||0,0,1);
  const s1="governance/",w1=Math.round(gu_mw(ctx,s1)+92),x1=bx+20,s2="Ontos",w2=Math.round(tw(ctx,s2,30,700)+40),x2=x1+w1+170;
  if(hm>0.01)gp_rise(ctx,hm,()=>{wc_panel(ctx,x1,cy-30,w1,60,{kind:"chip",wash:[255,253,246],washA:0.9,seed:591});gp_house(ctx,x1+34,cy+1,0.9);
    wc_T(ctx,s1,x1+64,cy+10,{w:500,size:28,f:"mono",col:WC_DARK});},10);
  if(ar>0.01){gp_arrow(ctx,[x1+w1+16,cy],[x2-16,cy],0,clamp(ar*1.4,0,1),{col:WC_PENCIL,lw:4});wc_hand(ctx,"copy",(x1+w1+x2)/2,cy-42,{size:32,w:700,col:WC_PENCIL,align:"center",p:clamp(ar*1.6-0.4,0,1)});}
  if(cp>0.01)gp_rise(ctx,cp,()=>{wc_panel(ctx,x2,cy-30,w2,60,{kind:"chip",dashed:true,seed:592});wc_T(ctx,s2,x2+20,cy+11,{w:700,size:30,col:WC_MUTED});},10);
  if(o.tag>0.01)gu_filmTag(ctx,bx+bw-10,by+bh+64,"Where each piece lives",clamp(o.tag,0,1),{align:"right"});}

/* ---------- 9 · outlives the tool ---------- */
// census day next March, at dawn: the faculty's room in the first light, and the desk in front of Anil, in the same light
function gp_dawn(c,o){o=o||{};c.save();if(o.atop){c.globalCompositeOperation="source-atop";c.fillStyle="rgba(96,92,140,0.16)";c.fillRect(0,0,W,H);c.restore();return;}
  c.globalCompositeOperation="multiply";const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,rgba([200,196,228],1));g.addColorStop(0.6,rgba([236,214,214],1));g.addColorStop(1,rgba([214,206,220],1));
  c.fillStyle=g;c.fillRect(0,0,W,H);c.globalCompositeOperation="screen";wc_glowAt(c,GV_FX.win[0]+GV_FX.win[2]/2,GV_FX.win[1]+GV_FX.win[3]*0.66,520,[255,200,160],0.35);c.restore();}
function gp_paintDawn(c){gv_paintFaculty(c);gp_dawn(c);}
function gp_paintFacDeskDawn(c){gv_paintFacultyDesk(c);gp_dawn(c,{atop:true});}
// on Anil's screen: the catalogue's page for Clara's product, its promise lit as he reads it (o.read); then the report he plans from
// (o.plan); the time in the screen's corner (o.time, "6:58" to "7:00")
function gp_dawnScreen(ctx,t,o){o=o||{};const [x,y,w,h]=GV_FX.screen,pl=clamp(o.plan||0,0,1);
  if(pl<0.99)withA(ctx,1-pl,()=>gv_screen(ctx,x,y,w,h,"Catalogue",q=>{wc_T(q,"Learners near an award",x+32,y+108,{w:800,size:32,col:WC_DARK});
    wc_T(q,"owner: Clara Jensen, Planning",x+32,y+170,{w:600,size:28,col:WC_INK});const r=clamp(o.read||0,0,1);if(r>0.01)gv_tint(q,x+20,y+202,tw(q,"ready by 7 a.m. on census day",28,600)+24,46,GV.gold,0.8*r);
    wc_T(q,"ready by 7 a.m. on census day",x+32,y+236,{w:600,size:28,col:WC_INK});},{barH:46,titleSize:28,bar:GP_CATBAR}));
  if(pl>0.01)withA(ctx,pl,()=>gp_report(ctx,{}));
  if(o.time)wc_T(ctx,o.time,x+w-20,y+33,{w:700,size:28,col:[255,255,255],align:"right"});}
// the promise outlives the catalogue: the catalogue's window, then another's in its place (o.swap), the same card in each; the file it's
// read from, in the open standard, its owner lit (o.file, o.own, o.std); the window reading the file (o.read); then the window goes, and
// the file stays (o.go)
const GP_FR=[{n:3,s:"apiVersion: v1.0.0"},{n:4,s:"kind: DataProduct"},{n:6,s:"name: Learners near an award"},{fold:1},{n:33,s:"team:"},{n:34,s:"  name: Clara Jensen, Planning"}];
function gp_frames(ctx,t,o){o=o||{};const sw=clamp(o.swap||0,0,1),go=clamp(o.go||0,0,1),wx=580,wy=40,ww=760,wh=330;
  withA(ctx,1-go,()=>{if(sw<0.99)withA(ctx,1-sw,()=>gp_win(ctx,wx,wy,ww,wh,"Catalogue · today",q=>gp_card(q,wx,wy,ww),GP_CATBAR));
    if(sw>0.01)withA(ctx,sw,()=>gp_win(ctx,wx,wy,ww,wh,"Another catalogue",q=>gp_card(q,wx,wy,ww),GP_NEWBAR));});
  const F=gp_file(ctx,360,450,1200,o.file||0,{path:"governance/6-product-descriptors/learners_near_an_award.yaml",lang:"yaml",
    lines:GP_FR.map((r,i)=>i>=4?Object.assign({},r,{lit:clamp(o.own||0,0,1)}):r)});
  if(!F.rows.length)return;gp_gen(ctx,1550,424,clamp((o.file||0)*1.6,0,1));
  withA(ctx,clamp(o.std||0,0,1),()=>wc_tag(ctx,1530,F.rows[1],"Open Data Product Standard",{align:"right",size:30,wash:GU_CYAN,washA:0.25,seed:341}));
  gp_arrow(ctx,[960,442],[960,wy+wh+14],0,clamp(o.read||0,0,1)*(1-go),{col:GU_CYAN,lw:4});}

/* ---------- the places ---------- */
// the series' desk of files, as gu_paintFilesDesk paints it, with its mug at the bottom right: this film's sheets run the frame's whole width
function gp_paintFilesDesk(c){const wood=[214,196,168];c.fillStyle=rgba(WC_PAPER,1);c.fillRect(0,0,W,H);wc_wash(c,wc_rect(-40,-40,W+80,H+80),wood,{kind:"plaster",line:false,seed:57});
  c.save();c.globalCompositeOperation="multiply";const R=wc_rng(7);for(let i=0;i<60;i++){const y=R()*H;c.strokeStyle=rgba(wc_dim(wood,0.18+R()*0.1),0.16+R()*0.12);c.lineWidth=1+R()*2;c.beginPath();c.moveTo(-20,y);
    for(let x=0;x<=W+40;x+=80)c.lineTo(x,y+5*Math.sin(x/280+i)+3*Math.sin(x/70+i*2));c.stroke();}c.restore();
  wc_wash(c,wc_ell(1826,1000,80,80,40),[232,236,240],{kind:"thing",lw:1.6});wc_wash(c,wc_ell(1826,1000,60,60,40),[96,70,60],{kind:"thing",line:false});
  wc_part(c,wc_rect(-60,820,300,330),[96,84,120],1,{seed:3});wc_flat(c,wc_rect(170,820,18,330),[236,226,200],1,"band");}
const WC_PLACES={noor:gv_paintNoor,mapClose:gv_paintMapClose,noorBoard:c=>gv_paintBoardClose(c,GV_ROOM.noor),noorScreen:c=>gv_paintScreenDesk(c,GV_ROOM.noor),
  noorBig:c=>gu_paintScreenBig(c,GV_ROOM.noor),faculty:gv_paintFaculty,facDesk:gv_paintFacultyDesk,facultyDawn:gp_paintDawn,facDeskDawn:gp_paintFacDeskDawn,
  desk:gp_paintFilesDesk,big:c=>gu_paintScreenBig(c,GV_ROOM.data),board:c=>gv_paintBoardClose(c,GV_ROOM.data),planClose:gp_paintPlan,planDesk:gp_paintPlanDesk,
  platform:gv_paintPlatformClose,platformDesk:gv_paintPlatformDesk,bigPlat:c=>gu_paintScreenBig(c,GV_ROOM.plat)};
