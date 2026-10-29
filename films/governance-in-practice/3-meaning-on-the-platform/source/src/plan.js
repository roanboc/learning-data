/* ===== Meaning on the platform: the places and the pictures =====
   The places are painted once and kept (data governance's shared/src/finish.js): the registrar's office, wide and close up, and Mei's
   screen close; Yusuf's board and his desk; a big screen on a desk, on the data team's, the registrar's office's or Planning's wall,
   and the data team's at night; the data team's room at night, and Jun's screen; the data team's desk from above for the files;
   Planning's office; the floor of offices; Noor's map close up; and the data team's board. The pictures are the film's own things,
   drawn with the series' pieces (shared/src/tools.js): award's words before and since Monday; the five glossaries; the two reports and
   the envelope; the term's page on the platform; the data team's copy and its source; a table's comment in the catalog; the nightly
   check and the pull request it opened; the setting, as a dial; the count, as a ledger, and its metric view; Genie One's answers and
   a Genie agent's; and three layers of meaning, on Noor's map. Every name starts with gm_ or GM_. */

/* ---------- helpers ---------- */
// made once per chapter, the first time it draws: its cues are known by then
const gm_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// shots in a row in the same place share one camera, so a dissolve between them never lays the place over itself at another size or
// framing: if each holds still, one slow push over the whole run; if one moves, all follow the same keys. hold: no push on the last
// run, when the next chapter opens in the same place
function gm_run(shots,end,hold){const out=shots.map(s=>Object.assign({},s));
  for(let i=0;i<out.length;){let j=i;while(j+1<out.length&&out[j+1].place===out[i].place)j++;const R=out.slice(i,j+1),last=j===out.length-1;
    if(j>i||(hold&&last)){const t1=last?end:out[j+1].at,keys=[].concat(...R.map(s=>s.keys)).sort((a,b)=>a[0]-b[0]),k0=keys[0],
        still=keys.every(k=>k[1]===k0[1]&&k[2]===k0[2]&&k[3]===k0[3]),push=hold&&last?0:R[0].push==null?0.025:R[0].push;
      const cam=still?{keys:[k0,[k0[0]+0.01,k0[1],k0[2],k0[3]*(1+push)]],d:Math.max(1.4,t1-k0[0]),push:0}:{keys,d:Math.max(...R.map(s=>s.d||1.6)),push:0};
      R.forEach(s=>Object.assign(s,cam));}
    i=j+1;}
  return out;}
// a pencil arrow along a curve from a to b, bowed by bend (px, up when negative; o.bx bows it sideways), drawn on as p goes 0 to 1
function gm_arrow(ctx,a,b,bend,p,o){o=o||{};if(p<=0)return;const c=[(a[0]+b[0])/2+(o.bx||0),(a[1]+b[1])/2+bend],n=28,m=Math.max(2,Math.round(n*clamp(p,0,1))),pt=u=>{const v=1-u;
    return[v*v*a[0]+2*v*u*c[0]+u*u*b[0],v*v*a[1]+2*v*u*c[1]+u*u*b[1]];};
  ctx.save();ctx.strokeStyle=rgba(o.col||WC_PENCIL,o.a==null?0.9:o.a);ctx.lineWidth=o.lw||4;ctx.lineCap="round";ctx.lineJoin="round";if(o.dash)ctx.setLineDash(o.dash);ctx.beginPath();
  for(let i=0;i<=m;i++){const [x,y]=pt(i/n);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();ctx.setLineDash([]);
  if(p>=1&&o.head!==false){const [x1,y1]=pt(1),[x0,y0]=pt(0.93),an=Math.atan2(y1-y0,x1-x0);ctx.beginPath();ctx.moveTo(x1-16*Math.cos(an-0.5),y1-16*Math.sin(an-0.5));
    ctx.lineTo(x1,y1);ctx.lineTo(x1-16*Math.cos(an+0.5),y1-16*Math.sin(an+0.5));ctx.stroke();}ctx.restore();}
// a red question mark, settling with a spring
function gm_redQ(ctx,x,y,s,p){if(p<=0)return;const k=spring(p);ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,clamp(p*2,0,1),()=>wc_T(ctx,"?",0,0,{w:800,size:s,align:"center",col:GV.redInk}));ctx.restore();}
// a speech bubble that springs in at t0 and goes at t1
function gm_say(ctx,t,t0,t1,x,y,lines,tx,ty,o){return gv_say(ctx,x,y,lines,tx,ty,Object.assign({a:gv_io(t,t0,t1,0.35),k:0.92+0.08*spring(fin(t,t0,0.5)),size:36},o||{}));}
// until now: the colours fade a little, warmer and paler (as Who may see it draws a memory)
function gm_memory(ctx,a){if(a<=0.01)return;ctx.save();ctx.globalCompositeOperation="saturation";ctx.fillStyle=rgba([128,128,128],0.6*a);ctx.fillRect(-W,-H,3*W,3*H);
  ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba([248,230,204],0.7*a);ctx.fillRect(-W,-H,3*W,3*H);ctx.globalCompositeOperation="source-over";ctx.fillStyle=rgba(WC_PAPER,0.22*a);ctx.fillRect(-W,-H,3*W,3*H);ctx.restore();}
// a thing coming in: it rises a little and settles (a, 0 to 1); fn draws it
function gm_rise(ctx,a,fn,dy){if(a<=0.01)return;ctx.save();ctx.translate(0,(dy==null?14:dy)*(1-easeCam(clamp(a,0,1))));withA(ctx,clamp(a*1.6,0,1),fn);ctx.restore();}
// a soft gold glow round something as it's named (a, 0 to 1), hugging its edges; drawn before the thing, which covers its middle
function gm_lit(ctx,x,y,w,h,a,col){if(a<=0.01)return;const m=ctx.getTransform(),k=Math.hypot(m.a,m.b),c=wc_lit(col||GV.gold,0.2);a=clamp(a,0,1);
  ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba(c,0.6*a);[[44,0.95],[14,0.8]].forEach(([b,al])=>{ctx.shadowColor=rgba(c,al*a);ctx.shadowBlur=b*k;ctx.fillRect(x-4,y-4,w+8,h+8);});ctx.restore();}

/* ---------- award's words, in their colours ---------- */
// the three meanings of award, as every film colours them: violet the glossary's words, rose the old words, olive degrees only
const GM_V=GV_MEAN.violet,GM_VI=GV_MEANINK.violet,GM_R=GV_MEAN.rose,GM_RI=GV_MEANINK.rose,GM_O=GV_MEAN.olive,GM_OI=GV_MEANINK.olive,GM_M=[GM_V,GM_R,GM_O],GM_MI=[GM_VI,GM_RI,GM_OI];
// award's words: the glossary's since Monday, and the ones before, as the data team's copy keeps them (synced on 14 October)
const GM_NEW="A qualification the university confers, such as a graduate certificate, a master or a microcredential, for at least 6 credit points. When it's conferred on a learner, it's a credential too.",
  GM_OLD="A qualification the university confers, such as a graduate certificate or a master, for a set number of credit points. When it's conferred on a learner, it's a credential too.";
// the change, as the sync's report writes it: the words kept, those removed ("del", struck through) and those added ("add", in bold)
const GM_DIFF=[["A qualification the university confers, such as a graduate certificate,"],["a master","add"],["or a"],["master,","del"],["microcredential,","add"],["for"],
  ["a set number of","del"],["at least 6","add"],["credit points. When it's conferred on a learner, it's a credential too."]];
// words wrapped to a width, as a page sets them: each line's text, and where it starts in s
function gm_lines(ctx,s,size,maxW,wt){const out=[],re=/\S+/g;let cur=null,m;
  while((m=re.exec(s))){if(!cur){cur={s:m[0],i:m.index};continue;}const t_=cur.s+" "+m[0];if(tw(ctx,t_,size,wt)>maxW){out.push(cur);cur={s:m[0],i:m.index};}else cur.s=t_;}
  if(cur)out.push(cur);return out;}
// a paragraph wrapped to w: o.lit, [[phrase, 0 to 1, colour]], washes a phrase behind its words as it's named; o.strike, [[phrase, 0 to
// 1]], strikes one through; o.p (0 to 1) shows it up to a share of its letters. Returns its lines' count
function gm_para(ctx,s,x,y,w,o){o=o||{};const size=o.size||32,wt=o.w||600,lh=o.lh||Math.round(size*1.4),L=gm_lines(ctx,s,size,w,wt),n=o.p==null?s.length:Math.ceil(s.length*clamp(o.p,0,1));
  const seg=(ph,f)=>{const k=s.indexOf(ph);if(k<0)return;L.forEach((l,j)=>{const a=Math.max(k,l.i),b=Math.min(k+ph.length,l.i+l.s.length);if(b<=a)return;
    f(x+tw(ctx,s.slice(l.i,a),size,wt),x+tw(ctx,s.slice(l.i,b),size,wt),y+j*lh);});};
  (o.lit||[]).forEach(([ph,v,col])=>{if(v>0.01)seg(ph,(x0,x1,by)=>gv_tint(ctx,x0-6,by-size*0.92,x1-x0+12,size*1.24,col||GV.gold,0.9*clamp(v,0,1)));});
  L.forEach((l,j)=>{const vis=clamp(n-l.i,0,l.s.length);if(vis<=0)return;wc_T(ctx,l.s.slice(0,vis),x,y+j*lh,{w:wt,size,col:o.col||WC_INK,a:o.a,deco:o.deco});});
  (o.strike||[]).forEach(([ph,v])=>{if(v>0.01)seg(ph,(x0,x1,by)=>{ctx.save();ctx.strokeStyle=rgba(o.sCol||GV.redInk,0.85);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x0,by-size*0.3);
    ctx.lineTo(lerp(x0,x1,easeCam(clamp(v,0,1))),by-size*0.3);ctx.stroke();ctx.restore();});});
  return L.length;}
// the change in words of its own styles, wrapped to w: the words kept in ink, the removed ones in rose, struck through, the added ones
// in violet and bold, washed; o.v (0 to 1) brings the strikes and the washes in; o.six (0 to 1) lights "at least 6" gold. Returns lines
function gm_diff(ctx,toks,x,y,w,o){o=o||{};const size=o.size||30,lh=o.lh||Math.round(size*1.45),v=o.v==null?1:clamp(o.v,0,1),words=[],sp=tw(ctx," ",size,600);
  toks.forEach(([s,k])=>{const ws=s.split(" ");ws.forEach((t_,j)=>words.push([t_,k||"",s,j===0,j===ws.length-1]));});let cx=x,line=0;
  words.forEach(([t_,k,s,first,last])=>{const wt=k==="add"?800:600,ww=tw(ctx,t_,size,wt);if(cx>x&&cx+ww>x+w){cx=x;line++;}const by=y+line*lh,x0=first?cx-4:cx,x1=last?cx+ww+4:cx+ww+sp;
    if(k==="add"){gv_tint(ctx,x0,by-size*0.92,x1-x0,size*1.24,s==="at least 6"&&o.six>0.01?GV.gold:GM_V,s==="at least 6"&&o.six>0.01?0.9*clamp(o.six,0,1):0.5*v);
      wc_T(ctx,t_,cx,by,{w:800,size,col:GM_VI});}
    else if(k==="del"){wc_T(ctx,t_,cx,by,{w:600,size,col:GM_RI});if(v>0.01){ctx.save();ctx.strokeStyle=rgba(GM_RI,0.9);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x0,by-size*0.3);
      ctx.lineTo(x0+(x1-x0)*easeCam(v),by-size*0.3);ctx.stroke();ctx.restore();}}
    else wc_T(ctx,t_,cx,by,{w:600,size,col:WC_INK});cx+=ww+sp;});return line+1;}

/* ---------- threads, the moon, the night ---------- */
// a thread from a copy to its home, in its meaning's colour: violet while it's in step, rose when it's behind; drawn on as p goes 0 to
// 1, with a knot at each end
function gm_thread(ctx,a,b,p,o){o=o||{};if(p<=0)return;const col=o.col||GM_VI,al=o.a==null?1:o.a;
  gm_arrow(ctx,a,b,o.bend==null?-30:o.bend,p,{col,lw:o.lw||4.5,head:false,a:0.85*al,bx:o.bx,dash:o.dash});
  ctx.save();ctx.globalAlpha*=al;ctx.fillStyle=rgba(col,0.95);ctx.beginPath();ctx.arc(a[0],a[1],6,0,TAU);ctx.fill();if(p>=1){ctx.beginPath();ctx.arc(b[0],b[1],6,0,TAU);ctx.fill();}ctx.restore();}
// a crescent moon, gold: the night, as a small sign beside a check that runs every night
function gm_moon(ctx,x,y,r,a){if(a<=0.01)return;ctx.save();ctx.globalAlpha*=clamp(a,0,1);ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.clip();ctx.beginPath();ctx.rect(x-r-2,y-r-2,2*r+4,2*r+4);
  ctx.arc(x+r*0.5,y-r*0.3,r*0.86,0,TAU,true);ctx.fillStyle=rgba([222,168,48],1);ctx.fill("evenodd");ctx.restore();}
// the night, as One word, one home draws it: a deep blue over a place, the screens still lit (drawn after), a small moon in its window
function gm_night(ctx,a,moon){if(a<=0.01)return;ctx.save();ctx.globalCompositeOperation="multiply";ctx.globalAlpha=a;ctx.fillStyle="rgb(96,104,150)";ctx.fillRect(-W,-H,3*W,3*H);ctx.restore();
  if(moon){const [mx,my,r]=moon;ctx.save();ctx.globalAlpha=a;wc_glowAt(ctx,mx,my,r*4,[230,236,255],0.35);ctx.fillStyle=rgba([246,242,222],1);ctx.beginPath();ctx.arc(mx,my,r,0,TAU);ctx.fill();
    ctx.fillStyle=rgba([150,156,196],1);ctx.beginPath();ctx.arc(mx+r*0.42,my-r*0.18,r*0.86,0,TAU);ctx.fill();ctx.restore();}}
// at night a screen is the room's one light: a bloom round it, and its spill on the desk below
function gm_nightGlow(c,r){const [sx,sy,sw,sh]=r;c.save();c.beginPath();c.rect(-W,-H,3*W,3*H);c.rect(sx,sy,sw,sh);c.clip("evenodd");c.globalCompositeOperation="screen";
  wc_glowAt(c,sx+sw/2,sy+sh/2,sw*0.72,[96,104,160],0.5);wc_glowAt(c,sx+sw/2,sy+sh+Math.min(300,sh),sw*0.55,[110,116,168],0.4);c.restore();}

/* ---------- the places ---------- */
function gm_paintNightScreen(c){gv_paintScreenDesk(c,GV_ROOM.data);gm_night(c,0.9);gm_nightGlow(c,GV_SC);}
function gm_paintBigNight(c){gu_paintScreenBig(c,GV_ROOM.data);gm_night(c,0.9);gm_nightGlow(c,GU_BIG);}
// the data team's room at night: nobody in it, the series' board on its cork board, the moon in the window, and Jun's two screens lit
function gm_paintNightRoom(c){gv_paintData(c,{words:true});gu_boardSmall(c,0);gm_night(c,0.92,[200,250,26]);GV_DT.mon.forEach(r=>{gm_nightGlow(c,r);const [x,y,w,h]=r,g=c.createLinearGradient(0,y,0,y+h);
  g.addColorStop(0,rgba([166,176,220],1));g.addColorStop(1,rgba([132,140,188],1));c.fillStyle=g;c.fillRect(x,y,w,h);});}

/* ---------- Monday, in the registrar's office ---------- */
// Mei at her desk, close (GV_RX), as Who may see it seats her; the desk in front, and her screen, with what o.draw puts on it
function gm_regDesk(x,tt,o){o=o||{};gv_behind(x,"mei",GV_RX.seat[0],GV_RX.top,GV_RX.seat[1],Object.assign({pose:"listen",t:tt},o.mei||{}));x.drawImage(gv_place("registrarDesk"),0,0,W,H);
  const [sx,sy,sw,sh]=GV_RX.screen;gv_screen(x,sx,sy,sw,sh,o.bar||"Award · page",null,{barH:44,titleSize:28});if(o.draw)o.draw(x,sx,sy,sw,sh);}
// award on her screen, small: its name, its owner (lit gold as she's named, own), and a band of its words in their meaning's colour (m)
function gm_meiTerm(own,m){return(q,sx,sy,sw)=>{wc_T(q,"Award",sx+30,sy+102,{w:800,size:40,col:WC_DARK});const os="Owner · Mei Tanaka";
  if(own>0.01)gv_tint(q,sx+20,sy+122,tw(q,os,28,600)+20,44,GV.gold,0.9*own);wc_T(q,os,sx+30,sy+154,{w:600,size:28,col:WC_INK});
  gv_tint(q,sx+20,sy+184,sw-40,132,GM_M[m||0],0.45);gv_lines(q,sx+38,sy+218,sw-96,3,36,0.9);};}
// award's page, close up on her screen (GV_SC): its owner (o.own); its words before Monday, in rose, struck through as Monday's come
// (o.ch); the new words, violet (o.nw), "a master or a microcredential" (o.mc) and "at least 6 credit points" (o.six) lit as they're
// said; and when it was published (o.pub)
function gm_termScreen(ctx,o){o=o||{};const [x,y,w,h]=GV_SC;gv_screen(ctx,x,y,w,h,"Databricks · Unity Catalog · Pages · beta",null,{barH:54,titleSize:30});
  wc_T(ctx,"Award",x+56,y+140,{w:800,size:56,col:WC_DARK});const own=clamp(o.own||0,0,1),os="Owner · Mei Tanaka";
  if(own>0.01)gv_tint(ctx,x+46,y+170,tw(ctx,os,30,600)+20,46,GV.gold,0.9*own);wc_T(ctx,os,x+56,y+204,{w:600,size:30,col:WC_INK});
  const pub=clamp(o.pub||0,0,1);if(pub>0.01){const s="published Monday",pw=Math.round(tw(ctx,s,28,700)+44);gm_rise(ctx,pub,()=>{wc_panel(ctx,x+w-56-pw,y+102,pw,48,{kind:"pill",wash:GM_V,washA:0.4,seed:411});
    wc_T(ctx,s,x+w-56-pw+22,y+136,{w:700,size:28,col:WC_DARK});});}
  wc_T(ctx,"Description",x+56,y+276,{w:700,size:28,col:WC_MUTED});const ch=clamp(o.ch||0,0,1),nw=clamp(o.nw||0,0,1);
  gm_para(ctx,GM_OLD,x+56,y+330,w-112,{size:34,lh:50,col:GM_RI,a:1-0.45*ch,strike:[[GM_OLD,ch]],sCol:GM_RI});
  if(nw>0.01)gm_para(ctx,GM_NEW,x+56,y+500,w-112,{size:34,lh:50,col:GM_VI,w:700,p:nw,lit:[["a master or a microcredential",o.mc||0,GM_V],["at least 6 credit points",o.six||0,GV.gold]]});}
// Mei in her office, standing by her desk, and Yusuf, as Off the shelf drew them (o.mei, o.yusuf: their poses)
function gm_meiYusuf(x,tt,o){o=o||{};person(x,"mei",860,905,0.8,Object.assign({pose:"explain",t:tt},o.mei||{}));person(x,"yusuf",1450,905,0.8,Object.assign({pose:"listen",t:tt,flip:true},o.yusuf||{}));}
// her line from Off the shelf, in the same hand, and the same line as it reads now, with a tick (tick, 0 to 1)
const GM_SAID=["I approve the words,","then never see them used."],GM_NOW=["I approve the words,","and see them used."];
function gm_meiLine(ctx,a,k,lines,tick){if(a<=0.01)return;const x=560,y=262,w=gv_say(ctx,x,y,lines,850,456,{a,k,size:34});
  if(tick>0.01)withA(ctx,a,()=>wc_tick(ctx,x+w+52,y+70,62,GV.greenInk,tick,8));}

/* ---------- until now: five glossaries, three meanings ---------- */
// on Yusuf's board (GV_BC), as One word, one home pinned them: a card for each, its name, award's head in its meaning's colour, a few
// lines, the word that differs; and a tag under each, who made it and why
const GM_GL=[{m:0,name:["Business","glossary"],tag:["the data team","for its tables"],word:"microcredentials"},
  {m:1,name:["Planning's","spreadsheet"],tag:["Planning","for the census"]},{m:1,name:["Policy","appendix"],tag:["registrar's office","for the policy"]},
  {m:2,name:["Faculty","dashboards"],tag:["each faculty","for dashboards"],word:"degrees"},{m:1,name:["Glossary","tool · 2019"],tag:["bought in 2019","for everyone"]}];
const GM_BX={cx:i=>360+i*300,top:190,w:272,h:330,tag:564};
// a meaning's head on paper: a band washed in its colour, its word in its ink; lit (0 to 1) deepens it as it's named
function gm_head(ctx,x,y,w,h,m,lit,o){o=o||{};ctx.save();ctx.globalAlpha*=0.22+0.42*clamp(lit||0,0,1);ctx.fillStyle=rgba(wc_lit(GM_M[m],0.3),1);ctx.fillRect(x,y,w,h);ctx.restore();
  ctx.save();ctx.fillStyle=rgba(GM_M[m],0.85);ctx.fillRect(x,y+h-3,w,3);ctx.restore();wc_T(ctx,o.word||"award",x+(o.pad||14),y+h*0.5+(o.size||28)*0.36,{w:800,size:o.size||28,col:GM_MI[m]});}
function gm_glCard(ctx,i,o){o=o||{};const G=GM_GL[i],x=GM_BX.cx(i)-GM_BX.w/2,y=GM_BX.top,w=GM_BX.w,h=GM_BX.h,a=o.a==null?1:o.a;if(a<=0.01)return;
  gm_rise(ctx,a,()=>{ctx.save();ctx.translate(x+w/2,y);ctx.rotate(((i*37)%7-3)*0.005);ctx.translate(-x-w/2,-y);wc_panel(ctx,x,y,w,h,{kind:"card",seed:300+i});gv_pin(ctx,x+w/2,y+14,GV.red,1.1);
    G.name.forEach((l,j)=>wc_T(ctx,l,x+20,y+64+j*36,{w:800,size:28,col:WC_DARK}));gm_head(ctx,x+12,y+118,w-24,50,G.m,o.lit||0,{size:30});gv_lines(ctx,x+24,y+200,w-60,G.word?2:4,24,0.9);
    if(G.word)wc_T(ctx,G.word,x+24,y+290,{w:700,size:28,col:GM_MI[G.m]});ctx.restore();});}
function gm_glTag(ctx,i,a){if(a<=0.01)return;const G=GM_GL[i],w=GM_BX.w,x=GM_BX.cx(i)-w/2,y=GM_BX.tag,k=0.92+0.08*spring(clamp(a,0,1));
  ctx.save();ctx.translate(x+w/2,y);ctx.scale(k,k);ctx.translate(-x-w/2,-y);withA(ctx,clamp(a*2,0,1),()=>{wc_panel(ctx,x,y,w,96,{kind:"tag",seed:320+i});
    wc_T(ctx,G.tag[0],x+18,y+40,{w:800,size:28,col:WC_DARK});wc_T(ctx,G.tag[1],x+18,y+78,{w:600,size:28,col:WC_INK});});ctx.restore();}

/* ---------- two reports, and the envelope ---------- */
// a report, printed, on Yusuf's desk: its name and who ran it, when; award's meaning it counted by, in its colour (m: 1 rose,
// Planning's; 0 violet, the glossary's); and the awards it counted. o.m and o.num change them on submission day (o.sw, 0 to 1, the
// change); o.tick, a green tick once the two agree
const GM_MEANS=[["with microcredentials of","6 credit points or more"],["graduate certificates,","masters and doctorates"]];
const GM_REP=[{name:"Census report",by:"Planning · Friday",m:1,n:"4,812"},{name:"Draft submission",by:"registrar's office · Wednesday",m:0,n:"4,867"}];
function gm_report(ctx,k,x,y,rot,o){o=o||{};const R=GM_REP[k],w=520,h=560,a=o.a==null?1:o.a;if(a<=0.01)return;const sw=clamp(o.sw||0,0,1);
  ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(rot);ctx.translate(-w/2,-h/2);gm_rise(ctx,a,()=>{gv_sheet(ctx,0,0,w,h);
    wc_T(ctx,R.name,36,72,{w:800,size:40,col:WC_DARK});wc_T(ctx,o.by||R.by,36,118,{w:600,size:28,col:WC_MUTED});
    const one=(m,num,al)=>withA(ctx,al,()=>{gm_head(ctx,24,150,w-48,56,m,o.lit||0,{size:30});GM_MEANS[m].forEach((l,j)=>wc_T(ctx,l,36,256+j*40,{w:600,size:28,col:GM_MI[m]}));
      wc_T(ctx,num,w/2,436,{w:800,size:120,align:"center",col:GM_MI[m]});});
    if(sw<1)one(R.m,R.n,1-sw);if(sw>0)one(o.m==null?R.m:o.m,o.num||R.n,sw);
    wc_T(ctx,"awards conferred · 2026",w/2,496,{w:600,size:28,align:"center",col:WC_MUTED});if(o.tick>0.01)wc_tick(ctx,w-64,68,60,GV.greenInk,o.tick,8);});ctx.restore();}
// the submission's envelope, addressed to the government, between them: what it holds, a box for the number, a red question mark while
// nobody can say which number it holds (o.q), the number once it's one (o.n), a seal (o.seal) and the stamp "sent" (o.sent)
function gm_envelope(ctx,cx,cy,o){o=o||{};const w=500,h=270,a=o.a==null?1:o.a;if(a<=0.01)return;const x=cx-w/2,y=cy-h/2;
  gm_rise(ctx,a,()=>{ctx.save();ctx.filter="blur(8px)";ctx.fillStyle="rgba(70,60,50,0.2)";ctx.fillRect(x+8,y+12,w,h);ctx.restore();wc_panel(ctx,x,y,w,h,{kind:"envelope",fill:[246,238,218],seed:77});
    ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.6);ctx.lineWidth=2.4;ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(x+8,y+8);ctx.lineTo(cx,y+92);ctx.lineTo(x+w-8,y+8);ctx.stroke();
    ctx.strokeStyle=rgba([196,96,74],0.8);ctx.lineWidth=2;ctx.strokeRect(x+w-98,y+22,66,74);for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(x+w-88,y+44+i*16);ctx.lineTo(x+w-42,y+44+i*16);ctx.stroke();}ctx.restore();
    wc_T(ctx,"Department of Education",x+40,y+138,{w:800,size:32,col:WC_DARK});wc_T(ctx,"award completions · 2026",x+40,y+178,{w:600,size:28,col:WC_MUTED});
    ctx.save();ctx.strokeStyle=rgba(WC_MUTED,0.6);ctx.lineWidth=2;ctx.strokeRect(x+40,y+198,260,54);ctx.restore();wc_T(ctx,"awards",x+56,y+235,{w:600,size:28,col:WC_MUTED});
    if(o.n>0.01)wc_hand(ctx,"4,867",x+168,y+238,{size:36,w:700,col:GM_VI,p:o.n});gm_redQ(ctx,x+360,y+240,64,clamp(o.q||0,0,1));
    const sl=clamp(o.seal||0,0,1);if(sl>0.01){const k=lerp(1.3,1,spring(sl));ctx.save();ctx.translate(cx,y+92);ctx.scale(k,k);withA(ctx,clamp(sl*2,0,1),()=>wc_wash(ctx,wc_ell(0,0,22,22,22),[186,52,44],{kind:"thing",lw:1.2,seed:78}));ctx.restore();}
    if(o.sent>0.01)gv_stamp(ctx,x+w-110,y+214,"sent",o.sent,{col:GV.greenInk,size:34,rot:-0.08});});}
// both reports on Yusuf's desk and the envelope between them; o.day, submission day: the census report counts by the glossary's words
const GM_RP=[[190,124,-0.03],[1210,112,0.025]],GM_ENV=[960,736];
function gm_reports(ctx,o){o=o||{};const d=clamp(o.day||0,0,1);GM_RP.forEach(([x,y,r],k)=>gm_report(ctx,k,x,y,r,{a:(o.a||[1,1])[k],lit:(o.lit||[])[k],sw:k===0?d:0,m:0,num:"4,867",
    by:d>0.5?["Planning · submission day","registrar's office · submission day"][k]:null,tick:o.tick}));gm_envelope(ctx,GM_ENV[0],GM_ENV[1],{a:o.env==null?1:o.env,q:o.q,n:o.n,seal:o.seal,sent:o.sent});}

/* ---------- now: one page, a setting, one count ---------- */
// a dial, as a setting is drawn: its face kept once, ticks for 0 to 12, numbers inside them, the needle at v, short of the numbers so
// none hides under it; o.ghost, a pencil needle where it could go (o.ga, 0 to 1); o.label and o.sub under it
function gm_dial(ctx,cx,cy,r,v,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const a0=Math.PI*0.75,span=Math.PI*1.5,ang=x=>a0+span*clamp(x/12,0,1),
    face=wc_kept("gmDial|"+r,2*r+40,2*r+40,q=>{q.translate(r+20,r+20);wc_wash(q,wc_ell(0,0,r,r,40),[246,242,232],{kind:"thing",lw:1.6,seed:91});q.strokeStyle=rgba(WC_PENCIL,0.7);q.lineCap="round";
      for(let i=0;i<=12;i++){const an=ang(i),r0=r*(i%3===0?0.8:0.85),r1=r*0.94;q.lineWidth=i%3===0?3.4:2;q.beginPath();q.moveTo(Math.cos(an)*r0,Math.sin(an)*r0);q.lineTo(Math.cos(an)*r1,Math.sin(an)*r1);q.stroke();}});
  gm_rise(ctx,a,()=>{ctx.drawImage(face,cx-r-20,cy-r-20);[0,3,6,9,12].forEach(n=>{const an=ang(n),q=r*0.58;wc_T(ctx,String(n),cx+Math.cos(an)*q,cy+Math.sin(an)*q+10,{w:700,size:28,align:"center",
      col:n===6?GM_VI:WC_MUTED,deco:r<100?1:0});});
    const nd=(x_,col,lw,dash,al)=>{const an=ang(x_);ctx.save();ctx.globalAlpha*=al;ctx.strokeStyle=rgba(col,1);ctx.lineWidth=lw;ctx.lineCap="round";if(dash)ctx.setLineDash(dash);ctx.beginPath();ctx.moveTo(cx,cy);
      ctx.lineTo(cx+Math.cos(an)*r*0.4,cy+Math.sin(an)*r*0.4);ctx.stroke();ctx.restore();};
    if(o.ghost!=null&&o.ga>0.01)nd(o.ghost,WC_PENCIL,5,[10,9],clamp(o.ga,0,1));nd(v,GM_VI,7,null,1);ctx.save();ctx.fillStyle=rgba(WC_DARK,0.9);ctx.beginPath();ctx.arc(cx,cy,10,0,TAU);ctx.fill();ctx.restore();
    if(o.label)wc_T(ctx,o.label,cx,cy+r+46,{w:o.mono?500:800,size:o.mono?28:30,f:o.mono?"mono":undefined,align:"center",col:WC_DARK});
    if(o.sub)wc_T(ctx,o.sub,cx,cy+r+86,{w:600,size:28,align:"center",col:WC_MUTED});});}
// an open ledger, its paper kept once per size: two ruled pages, the gutter's shade, a cover round them; o.draw writes on it
function gm_book(ctx,x,y,w,h,o){o=o||{};const c=wc_kept("gmBook|"+w+"x"+h,w+100,h+100,q=>{q.translate(50,50);const pw=w/2;q.save();q.filter="blur(12px)";q.fillStyle="rgba(60,40,20,0.3)";q.fillRect(10,16,w,h);q.restore();
    wc_wash(q,wc_rrPts(-14,-10,w+28,h+24,12),[124,74,60],{kind:"cover",lw:1.6,seed:93});for(const px of [0,pw])wc_wash(q,wc_rect(px,0,pw,h),[250,246,234],{kind:"page",lw:1.3,seed:94+(px?1:0)});
    const g=q.createLinearGradient(pw-40,0,pw+40,0);g.addColorStop(0,"rgba(90,70,50,0)");g.addColorStop(0.5,"rgba(90,70,50,0.24)");g.addColorStop(1,"rgba(90,70,50,0)");q.fillStyle=g;q.fillRect(pw-40,0,80,h);
    q.strokeStyle=rgba([150,170,200],0.42);q.lineWidth=1.4;for(let ly=(o.rule0||110);ly<h-20;ly+=(o.lh||46)){q.beginPath();q.moveTo(24,ly);q.lineTo(pw-30,ly);q.moveTo(pw+30,ly);q.lineTo(w-24,ly);q.stroke();}
    q.strokeStyle=rgba([204,96,90],0.4);q.beginPath();q.moveTo(70,0);q.lineTo(70,h);q.moveTo(pw+70,0);q.lineTo(pw+70,h);q.stroke();});
  ctx.drawImage(c,x-50,y-50);if(o.draw)o.draw(x,y,w/2,h);}
// a card pinned to a board: what it is, and a second line under it
function gm_card(ctx,x,y,w,h,l1,l2,o){o=o||{};wc_panel(ctx,x,y,w,h,{kind:"card",seed:o.seed||((x+y)|0)});if(o.pin!==false)gv_pin(ctx,x+w/2,y+14,GV.red,1.1);
  wc_T(ctx,l1,x+28,y+(l2?62:h/2+12),{w:800,size:o.size||30,col:WC_DARK,f:o.mono?"mono":undefined});if(l2)wc_T(ctx,l2,x+28,y+106,{w:600,size:28,col:WC_MUTED});}
// on Yusuf's board (GV_BC): award's page, pinned, a violet thread to the data team's copy (checked each night: a moon, a tick) and on to
// the tables' words in the catalog (written by each build); the setting, a dial at 6; the count, a ledger, and threads to what reads
// it: the draft submission, Planning's census report and Genie One. o: page, copy, check, cat, dial, v, book, read[3], each 0 to 1
const GM_NB={page:[250,104,540,330],copy:[900,124,420,150],cat:[1400,124,300,150],dial:[250,500,400,340],book:[700,500,520,340],read:[[1300,500],[1300,620],[1300,740]],
  rn:["draft submission","census report","Genie One"]};
function gm_nowBoard(ctx,t,o){o=o||{};const B=GM_NB,u=k=>clamp(o[k]||0,0,1);
  gm_rise(ctx,u("page"),()=>{const [x,y,w,h]=B.page;wc_panel(ctx,x,y,w,h,{kind:"card",seed:401});gv_pin(ctx,x+w/2,y+16,GV.red,1.2);gm_head(ctx,x+18,y+48,w-36,76,0,o.lit||0,{size:46,word:"Award"});
    wc_T(ctx,"one page, on the platform",x+30,y+178,{w:800,size:32,col:WC_DARK});wc_T(ctx,"owner · Mei Tanaka",x+30,y+228,{w:600,size:30,col:WC_MUTED});
    wc_T(ctx,"for at least 6 credit points",x+30,y+282,{w:600,size:28,col:GM_VI});});
  const [px,py,pw]=B.page,[cx,cy,cw,ch]=B.copy,[kx,ky,kw,kh]=B.cat;
  gm_thread(ctx,[px+pw-10,py+150],[cx+10,cy+ch/2],u("copy"),{bend:-40});gm_rise(ctx,u("copy"),()=>gm_card(ctx,cx,cy,cw,ch,"the data team's copy","beside the models",{seed:402}));
  const ck=u("check");gm_moon(ctx,(px+pw+cx)/2,py+70,20,ck);if(ck>0.01){wc_tick(ctx,cx+cw-46,cy+50,48,GV.greenInk,clamp(ck*1.5-0.3,0,1),6);wc_hand(ctx,"checked each night",cx+28,cy+ch+46,{size:30,w:700,col:WC_PENCIL,p:ck});}
  gm_thread(ctx,[cx+cw-10,cy+ch/2],[kx+10,ky+kh/2],u("cat"),{bend:-30});gm_rise(ctx,u("cat"),()=>gm_card(ctx,kx,ky,kw,kh,"the catalog","each table's words",{seed:403}));
  if(u("cat")>0.5)wc_hand(ctx,"each build",kx+28,ky+kh+46,{size:30,w:700,col:WC_PENCIL,p:clamp(u("cat")*2-1,0,1)});
  gm_rise(ctx,u("dial"),()=>{const [x,y,w,h]=B.dial;wc_panel(ctx,x,y,w,h,{kind:"card",seed:404});gv_pin(ctx,x+w/2,y+14,GV.red,1.1);});
  if(u("dial")>0.01){const [x,y,w]=B.dial;gm_dial(ctx,x+w/2,y+136,96,o.v==null?6:o.v,{a:u("dial"),label:"6 credit points",sub:"kept once, as a setting"});}
  gm_rise(ctx,u("book"),()=>{const [x,y,w,h]=B.book;wc_panel(ctx,x,y,w,h,{kind:"card",seed:405});gv_pin(ctx,x+w/2,y+14,GV.red,1.1);wc_T(ctx,"awards conferred",x+30,y+70,{w:800,size:34,col:WC_DARK});
    gm_book(ctx,x+50,y+104,w-100,160,{rule0:44,lh:30});ctx.save();ctx.strokeStyle=rgba(GM_VI,0.9);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x+80,y+136);ctx.lineTo(x+w/2-20,y+136);ctx.stroke();ctx.restore();
    wc_T(ctx,"counted once",x+30,y+h-30,{w:600,size:28,col:WC_MUTED});});
  const [bx,by,bw,bh]=B.book;B.read.forEach(([rx,ry],i)=>{const v=clamp((o.read||[])[i]||0,0,1);if(v<=0.01)return;gm_thread(ctx,[bx+bw-10,by+bh/2],[rx+10,ry+46],v,{bend:0});
    gm_rise(ctx,v,()=>{wc_panel(ctx,rx,ry,400,92,{kind:"card",seed:406+i});wc_T(ctx,B.rn[i],rx+(i===2?78:28),ry+58,{w:800,size:30,col:WC_DARK});if(i===2)gu_star(ctx,rx+42,ry+46,1,t,1);});});}

/* ---------- that night, and Tuesday morning ---------- */
// Jun's screens at night, across the data team's room: the left one quiet, and a pull request opening by itself on the right one (p, 0
// to 1); as seen from across the room, too small to read, on purpose
function gm_nightMon(ctx,p){const [[lx,ly,lw],[rx,ry,rw,rh]]=GV_DT.mon;gv_lines(ctx,lx+18,ly+30,lw-40,4,22,0.8);if(p<=0.01)return;const e=easeCam(clamp(p,0,1)),w=(rw-24)*e,h=(rh-24)*e;
  ctx.save();ctx.fillStyle=rgba([252,252,255],1);ctx.fillRect(rx+12,ry+12,w,h);ctx.fillStyle=rgba([60,64,78],1);ctx.fillRect(rx+12,ry+12,w,14);ctx.restore();
  if(p>0.6)withA(ctx,clamp(p*2.5-1.5,0,1),()=>{gv_tint(ctx,rx+20,ry+36,w-20,14,GM_R,0.9);gv_tint(ctx,rx+20,ry+56,w-20,14,GM_V,0.9);gv_lines(ctx,rx+20,ry+84,w-40,2,14,0.8);});}
// what award's new words touch, as tags over Mei's screen, each lit by a violet thread from it (o.u[i], 0 to 1)
const GM_TT=[["3 tables",1160,104],["8 definitions",1470,104],["the code",1160,214],["3 reports and apps",1420,214]];
function gm_touchTags(ctx,o){o=o||{};const [sx,sy,sw]=GV_RX.screen;GM_TT.forEach(([s,x,y],i)=>{const v=clamp((o.u||[])[i]||0,0,1);if(v<=0.01)return;const w=tw(ctx,s,30,700)+40;
  gm_thread(ctx,[sx+sw/2,sy-6],[x+w/2,y+30],clamp(v*1.6,0,1),{bend:10});gm_rise(ctx,clamp(v*1.6-0.4,0,1),()=>wc_tag(ctx,x,y,s,{size:30,seed:430+i}));});}

/* ---------- one term, one page ---------- */
// award's page on the platform, as Databricks lays a page out (Pages, in beta), drawn as a form: its title; its description, the
// glossary's words in violet (o.six lights "at least 6 credit points"); its owner; its domain; the tables and the column that hold it,
// and the count (related assets); and where its words come from (sources). o.lit: [words, owner, domain, assets, sources], each 0 to
// 1 as it's named; o.al[i] lights one asset; o.beta brings in the page's state, beta
const GM_ASSETS=[["core_award","table"],["core_credential · counts_as_award","table · column"],["awards_conferred","metric view"]];
function gm_awardPage(ctx,o){o=o||{};const [x,y,w,h]=GU_BIG,L=o.lit||[],v=i=>clamp(L[i]||0,0,1),AL=o.al||[];
  const top=gu_page(ctx,x,y,w,h,{bar:"Databricks · Unity Catalog · Pages · beta",title:"Award",state:["beta",GV.amber],stateA:o.beta==null?1:o.beta,sub:"a page of the business glossary"});
  const dx=x+40,dy=top+24,dw=1000,rx=x+1080,rw=w-1120;
  gm_lit(ctx,dx,dy,dw,300,v(0),GM_V);gu_box(ctx,dx,dy,dw,300,"Description",{seed:301});gm_para(ctx,GM_NEW,dx+30,dy+100,dw-60,{size:31,lh:46,col:GM_VI,lit:[["at least 6 credit points",o.six||0,GV.gold]]});
  const ay=dy+320;gm_lit(ctx,dx,ay,dw,250,v(3));gu_box(ctx,dx,ay,dw,250,"Related assets",{seed:302});
  GM_ASSETS.forEach(([s,k],i)=>{const by=ay+104+i*56,l=clamp(AL[i]||0,0,1),sw=gu_mw(ctx,s);if(l>0.01)gv_tint(ctx,dx+18,by-34,sw+24,46,GV.gold,0.9*l);
    gu_md(ctx,"`"+s.split(" · ").join("` · `")+"`",dx+30,by,{size:28});wc_T(ctx,k,dx+dw-30,by,{w:600,size:28,col:WC_MUTED,align:"right"});});
  gm_lit(ctx,rx,dy,rw,150,v(1));gu_box(ctx,rx,dy,rw,150,"Owner",{seed:303});if(v(1)>0.01)gv_tint(ctx,rx+20,dy+66,tw(ctx,"Mei Tanaka",32,800)+20,48,GV.gold,0.9*v(1));
  wc_T(ctx,"Mei Tanaka",rx+30,dy+102,{w:800,size:32,col:WC_DARK});wc_T(ctx,"registrar's office",rx+30+tw(ctx,"Mei Tanaka",32,800)+18,dy+102,{w:600,size:28,col:WC_MUTED});
  const my=dy+170;gm_lit(ctx,rx,my,rw,130,v(2));gu_box(ctx,rx,my,rw,130,"Domain",{seed:304});wc_T(ctx,"Course",rx+30,my+96,{w:800,size:32,col:WC_DARK});
  gm_lit(ctx,rx,ay,rw,250,v(4));gu_box(ctx,rx,ay,rw,250,"Sources",{seed:305});wc_T(ctx,"architecture map",rx+30,ay+100,{w:800,size:30,col:WC_DARK});
  wc_T(ctx,"business term · Award",rx+30,ay+148,{w:600,size:28,col:WC_INK});wc_T(ctx,"published by data governance",rx+30,ay+196,{w:600,size:28,col:WC_MUTED});}
// Noor's map, close: a sheet pinned over it, award's business term at home on the map (gold) and the page it's published to (violet),
// one way (o.pub); a pencil reaching to change the page stops (o.reach), crossed (o.stop): the change is made at home (o.home)
const GM_MS={x:300,y:150,w:1320,h:640};
function gm_mapHome(ctx,t,o){o=o||{};const S=GM_MS,a=clamp(o.a==null?1:o.a,0,1);if(a<=0.01)return;
  gm_rise(ctx,a,()=>{gv_sheet(ctx,S.x,S.y,S.w,S.h,{rot:-0.006});gv_pin(ctx,S.x+S.w/2,S.y+22,GV.red,1.3);wc_T(ctx,"Where each term is kept",S.x+60,S.y+96,{w:800,size:36,col:WC_DARK});
    const hx=S.x+70,hy=S.y+170,hw=440,hh=260;gm_lit(ctx,hx,hy,hw,hh,o.hl||0);wc_panel(ctx,hx,hy,hw,hh,{kind:"card",seed:611});gv_tint(ctx,hx+8,hy+8,hw-16,64,GV.gold,0.5);
    wc_T(ctx,"Noor's map",hx+28,hy+52,{w:800,size:30,col:GV.goldInk});wc_T(ctx,"Award",hx+28,hy+140,{w:800,size:46,col:WC_DARK});wc_T(ctx,"business term",hx+28,hy+186,{w:600,size:28,col:WC_MUTED});
    wc_tag(ctx,hx+28,hy+228,"home",{size:28,wash:GV.gold,washA:0.5,seed:612});
    const gx=S.x+S.w-70-440,gy=hy;wc_panel(ctx,gx,gy,440,hh,{kind:"card",seed:613});gv_tint(ctx,gx+8,gy+8,424,64,GM_V,0.45);wc_T(ctx,"the glossary",gx+28,gy+52,{w:800,size:30,col:GM_VI});
    wc_T(ctx,"Award",gx+28,gy+140,{w:800,size:46,col:WC_DARK});wc_T(ctx,"its page, on the platform",gx+28,gy+186,{w:600,size:28,col:WC_MUTED});
    const pb=clamp(o.pub||0,0,1);gm_arrow(ctx,[hx+hw+16,hy+hh/2],[gx-16,gy+hh/2],-36,pb,{col:GM_VI,lw:5});if(pb>0.6)wc_hand(ctx,"published, one way",(hx+hw+gx)/2,hy+hh/2-60,{size:30,w:700,align:"center",col:GM_VI,p:clamp(pb*2.5-1.5,0,1)});
    const r=clamp(o.reach||0,0,1);if(r>0.01){const e=easeCam(r),tx=lerp(gx+500,gx+330,e),ty=lerp(gy+hh+200,gy+hh+30,e);ctx.save();ctx.translate(tx,ty);ctx.rotate(-0.7);
      wc_part(ctx,[[0,0],[20,-8],[150,-8],[150,8],[20,8]],[244,196,80],1);wc_flat(ctx,[[0,0],[20,-8],[20,8]],[60,54,58],1,"tip");ctx.restore();}
    const st=clamp(o.stop||0,0,1);if(st>0.01){wc_cross(ctx,gx+300,gy+hh+30,64,GV.redInk,st);wc_hand(ctx,"change it at home",gx+40,gy+hh+110,{size:32,w:700,col:WC_PENCIL,p:clamp(st*1.6-0.4,0,1)});}});}
// Planning: Clara at her wall screen, award's page open beside her table
function gm_planWall(ctx,tt,o){o=o||{};const [sx,sy,sw,sh]=GV_PL.screen;gv_screen(ctx,sx,sy,sw,sh,o.bar||"Census 2026 · Award",null,{barH:46,titleSize:28});
  if(o.genie){o.genie(ctx,sx,sy,sw,sh);}else{const pw=290;ctx.save();ctx.fillStyle=rgba([246,244,252],1);ctx.fillRect(sx+16,sy+62,pw,sh-78);ctx.restore();gv_tint(ctx,sx+16,sy+62,pw,44,GM_V,0.6);
    wc_T(ctx,"Award",sx+30,sy+96,{w:800,size:28,col:GM_VI});gv_lines(ctx,sx+30,sy+140,pw-50,5,32,0.9);
    for(let r=0;r<=7;r++)for(let k=0;k<3;k++){ctx.save();ctx.fillStyle=rgba(r?[150,150,166]:[90,96,120],r?0.55:0.8);ctx.fillRect(sx+pw+44+k*112,sy+76+r*36,(84)*(r?0.5+0.45*hash(r*3+k,7):0.8),r?7:9);ctx.restore();}}
  person(ctx,"clara",440,905,0.8,Object.assign({pose:"point",pose2:"listen",mix:0,t:tt},o.clara||{}));}
// Genie One, the platform's assistant, as a chat on a page (GU_BIG): a question, typed in (o.q, 0 to 1); the answer, with the agent's
// star (o.a): a big line (o.big) and words under it (o.words, violet when they're award's); its sources as chips under it (o.cites:
// [[kind, name]], o.ci[i] 0 to 1, o.cl[i] lights one); a guess of its own in pencil, olive (o.guess), struck through, a cross before it
// (o.no), as the page's words win
function gm_genie(ctx,t,o){o=o||{};const [x,y,w,h]=GU_BIG;gu_page(ctx,x,y,w,h,{bar:o.bar||"Databricks · Genie One",title:o.title||"Genie One",titleSize:40,sub:o.sub||"Clara Jensen · Planning"});
  const q=o.question,qp=clamp(o.q==null?1:o.q,0,1);if(q&&qp>0.01){const qw=Math.round(tw(ctx,q,34,600)+64),qx=x+w-50-qw,qy=y+250;wc_panel(ctx,qx,qy,qw,84,{kind:"card",wash:GV.gold,washA:0.18,seed:701});
    wc_T(ctx,q.slice(0,Math.ceil(q.length*qp)),qx+32,qy+54,{w:600,size:34,col:WC_DARK});}
  const ap=clamp(o.a||0,0,1);if(ap<=0.01)return;const ax=x+150,ay=y+370;gu_star(ctx,x+90,ay+30,1.2,t,ap);
  withA(ctx,ap,()=>{let by=ay+40;if(o.big){wc_T(ctx,o.big,ax,by,{w:800,size:52,col:WC_DARK});by+=64;}
    if(o.words){const n=gm_para(ctx,o.words,ax,by,o.ww||1100,{size:30,lh:44,col:o.wordsCol||WC_INK,p:clamp(ap*1.4-0.2,0,1)});by+=n*44;}
    let cx=ax;(o.cites||[]).forEach(([k,s],i)=>{const v=clamp((o.ci||[])[i]||0,0,1);if(v<=0.01)return;const lw=tw(ctx,k+" · ",28,600),sw=gu_mw(ctx,s),cw=Math.round(lw+sw+60),cy=by+14;
      gm_rise(ctx,v,()=>{wc_panel(ctx,cx,cy,cw,56,{kind:"pill",wash:i===(o.violet==null?-1:o.violet)?GM_V:GU_CYAN,washA:0.2,seed:710+i});if((o.cl||[])[i]>0.01)gv_tint(ctx,cx+6,cy+6,cw-12,44,GV.gold,0.9*o.cl[i]);
        wc_T(ctx,k+" · ",cx+30,cy+38,{w:600,size:28,col:WC_MUTED});wc_T(ctx,s,cx+30+lw,cy+38,{w:500,size:28,f:"mono",col:WC_DARK});});cx+=cw+20;});});
  const g=clamp(o.guess||0,0,1),no=clamp(o.no||0,0,1),gs="degrees only?",gx=x+w-420,gy=y+h-70;if(g<=0.01)return;wc_hand(ctx,gs,gx,gy,{size:36,w:700,col:GM_OI,a:g});
  if(no>0.01){withA(ctx,g,()=>{ctx.save();ctx.strokeStyle=rgba(GV.redInk,0.9);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(gx-10,gy-12);
    ctx.lineTo(gx-10+(tw(ctx,gs,36,700)+16)*easeCam(no),gy-12);ctx.stroke();ctx.restore();});wc_cross(ctx,gx-50,gy-12,44,GV.redInk,no*g);}}

/* ---------- the data team's copy ---------- */
// the course domain's conceptual model, as the project keeps it (models/core/course/_course__conceptual.yml): award, its words as
// synced on 14 October, its owner, and its source (lines 27 to 31), lit as it's named (o.src, 0 to 1); o.def lights the words; o.u, 0
// to 1, slides it in
const GM_CON=[{n:18,s:"  - name: award"},{n:19,s:"    definition: >"},{n:20,s:"      A qualification the university confers, such as a graduate certificate or a master, for"},
  {n:21,s:"      a set number of credit points. When it's conferred on a learner, it's a credential too."},{n:22,s:"    owner: Mei Tanaka, registrar's office"},{fold:1},
  {n:27,s:"    source:"},{n:28,s:"      glossary: the university's Unity Catalog Glossary, on Databricks"},{n:29,s:"      term: Award"},{n:30,s:"      named_by: data governance"},{n:31,s:"      synced_on: 2026-10-14"}];
function gm_copySheet(ctx,o){o=o||{};const rows=o.rows||GM_CON.length,e=easeCam(clamp(o.u==null?1:o.u,0,1)),y=lerp(H+40,o.y||60,e),src=o.src||[];
  return gu_file(ctx,90,y,1740,{path:"models/core/course/_course__conceptual.yml",lang:"yaml",lines:GM_CON.slice(0,rows).map((L,i)=>L.fold?L:Object.assign({},L,
    {lit:i>=6?clamp(src[i-6]||0,0,1):i===2||i===3?clamp(o.def||0,0,1):0,litCol:i===2||i===3?GM_V:GV.gold}))});}
// beside it, the table's model, whose description shows the doc block written from those words (_core_course__models.yml, lines 3 to 6)
const GM_MOD=[{n:3,s:"  - name: core_award"},{n:4,s:"    description: >"},{n:5,s:"      An award the university offers, as it stood from valid_from until valid_to."},{n:6,s:"      {{ doc(\"award\") }}"}];
function gm_modSheet(ctx,o){o=o||{};const e=easeCam(clamp(o.u||0,0,1));if(e<=0.01)return null;const y=lerp(H+40,o.y||452,e);
  return gu_file(ctx,330,y,1500,{path:"models/core/course/_core_course__models.yml",lang:"yaml",lines:GM_MOD.map((L,i)=>i===3?Object.assign({},L,{lit:clamp(o.doc||0,0,1),litCol:GM_V}):L)});}
// a table's page in the catalog, as Catalog Explorer lays one out, drawn as a form
function gm_tablePage(ctx,o){const [x,y,w,h]=GU_BIG;return gu_page(ctx,x,y,w,h,{bar:"Databricks · Unity Catalog",title:o.title,titleSize:o.titleSize,sub:o.sub,tabs:o.tabs||["Overview","Columns","Lineage"],tab:o.tab==null?0:o.tab});}
// core_award's Overview: its comment, written by the build from the project's words (o.c, 0 to 1, as it arrives); an arrow from the
// project, "each build" (o.ar); and one back, crossed through (o.back): never back
function gm_comment(ctx,t,o){o=o||{};const top=gm_tablePage(ctx,{title:"core_award_v1",sub:"university · prod_core · table"}),x=150,y=top+30,w=900,c=clamp(o.c==null?1:o.c,0,1);
  gu_box(ctx,x,y,w,500,"Comment",{seed:321});withA(ctx,c,()=>{gm_para(ctx,"An award the university offers, as it stood from valid_from until valid_to.",x+30,y+100,w-60,{size:30,lh:44});
    gm_para(ctx,"Award. "+GM_OLD,x+30,y+210,w-60,{size:30,lh:44,col:WC_INK});wc_T(ctx,"…",x+30,y+430,{w:500,size:28,f:"mono",col:WC_PENCIL});});
  const px=1300,py=y+60,pw=460,ph=230;wc_panel(ctx,px,py,pw,ph,{kind:"card",seed:322});wc_T(ctx,"dbt project",px+30,py+62,{w:800,size:32,col:WC_DARK});
  wc_T(ctx,"+persist_docs",px+30,py+112,{w:500,size:28,f:"mono",col:WC_INK});wc_T(ctx,"dbt_project.yml, lines 28 to 30",px+30,py+160,{w:600,size:28,col:WC_MUTED});
  const ar=clamp(o.ar||0,0,1);gm_arrow(ctx,[px-16,py+90],[x+w+18,py+90],-20,ar,{col:GU_CYAN,lw:5});if(ar>0.5)wc_hand(ctx,"each build",(x+w+px)/2,py+40,{size:30,w:700,align:"center",col:GU_CYAN,p:clamp(ar*2-1,0,1)});
  const bk=clamp(o.back||0,0,1);if(bk>0.01){gm_arrow(ctx,[x+w+18,py+190],[px-16,py+190],20,bk,{col:WC_PENCIL,lw:4,dash:[10,10]});wc_cross(ctx,(x+w+px)/2,py+200,52,GV.redInk,clamp(bk*1.6-0.6,0,1));
    wc_hand(ctx,"never back",(x+w+px)/2,py+290,{size:30,w:700,align:"center",col:GV.redInk,p:clamp(bk*1.6-0.6,0,1)});}}

/* ---------- the nightly sync ---------- */
// on Jun's screen at night (GV_SC): the check, comparing award in the glossary (violet, changed on Monday) with the data team's copy
// (synced on 14 October): a line sweeping down both (o.scan, 0 to 1), then the sign between them, = turning ≠ (o.diff)
function gm_compare(ctx,o){o=o||{};const [x,y,w,h]=GV_SC;gv_screen(ctx,x,y,w,h,"Sync from the glossary · every night",null,{barH:54,titleSize:30});
  const pw=566,ph=580,ly=y+84,lx=x+34,rx=x+w-34-pw,sc=clamp(o.scan||0,0,1),d=clamp(o.diff||0,0,1);
  [[lx,"In the glossary","Award",GM_NEW,GM_VI,"changed on Monday",false],[rx,"The data team's copy","award",GM_OLD,d>0.5?GM_RI:WC_INK,"synced_on: 2026-10-14",true]].forEach(([px,hd,nm,s,col,ft,mono],k)=>{
    wc_panel(ctx,px,ly,pw,ph,{kind:"card",seed:421+k});if(k===1&&d>0.01)gv_tint(ctx,px+8,ly+8,pw-16,ph-16,GM_R,0.3*d);if(k===0)gv_tint(ctx,px+8,ly+8,pw-16,ph-16,GM_V,0.12);
    wc_T(ctx,hd,px+30,ly+50,{w:700,size:28,col:WC_MUTED});wc_T(ctx,nm,px+30,ly+110,{w:mono?500:800,size:mono?40:44,f:mono?"mono":undefined,col:WC_DARK});
    gm_para(ctx,s,px+30,ly+172,pw-60,{size:30,lh:42,col});wc_T(ctx,ft,px+30,ly+ph-34,{w:mono?500:600,size:28,f:mono?"mono":undefined,col:WC_MUTED});
    if(sc>0.01&&sc<1){const sy=ly+130+(ph-190)*sc;ctx.save();ctx.strokeStyle=rgba(GU_CYAN,0.6);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(px+16,sy);ctx.lineTo(px+pw-16,sy);ctx.stroke();ctx.restore();}});
  const sx=x+w/2,sy=ly+ph/2;if(sc>0.01)wc_T(ctx,d>0.5?"≠":"=",sx,sy+22,{w:800,size:64,align:"center",col:d>0.5?GM_RI:WC_MUTED,a:d>0.5?1:clamp(sc*3,0,1)});
  if(d>0.5)gv_halo(ctx,sx-40,sy-40,80,80,GM_R,0.9*clamp(d*2-1,0,1));}
// the pull request the check opened, as GitHub lays one out, drawn as a form (GU_BIG)
function gm_prHead(ctx,o){o=o||{};const [x,y,w,h]=GU_BIG;return gu_page(ctx,x,y,w,h,{bar:"GitHub · pull request",title:"Sync from the glossary: 1 term(s) drifted",titleSize:38,
  sub:o.sub||"opened by the nightly sync · Monday night"});}
// its body, the sync's report: what changed, the old words and the new (o.v brings the strikes and the bold in), the line that says it
// may change the meaning, lit amber (o.flag); then what it touches, folded (o.wt)
function gm_changed(ctx,o){o=o||{};gm_prHead(ctx,o);const x=150,w=1620;gu_box(ctx,x,268,w,330,"What changed",{seed:431});
  gm_diff(ctx,GM_DIFF,x+30,372,w-60,{size:30,lh:46,v:o.v==null?1:o.v,six:o.six});const f=clamp(o.flag||0,0,1);if(f>0.01)gv_tint(ctx,x+18,516,w-36,54,GV.amber,0.85*f);
  gu_md(ctx,"**May change the meaning:** a number changed; another entity is named or dropped: microcredential",x+30,552,{size:28});
  const wt=clamp(o.wt||0,0,1);gm_rise(ctx,wt,()=>{gu_box(ctx,x,618,w,230,"What it touches",{seed:432});wc_T(ctx,"…",x+30,718,{w:500,size:28,f:"mono",col:WC_PENCIL});
    gu_md(ctx,"Models and columns · names it in its definition or rules · code · exposures to tell",x+30,776,{size:28,col:WC_MUTED});});}
// what it touches, opened: each list in a box of its own, lit as it's said (o.lit[i], 0 to 1; o.u[i] fills it)
const GM_TCH=[{h:"Models and columns · 3",i:["core_award","mart_finance__tuition_forgone","mart_planning__near_award"]},
  {h:"Names it in its definition or rules · 8",i:["role","learner","credential","credit_towards_award","counts_towards","tuition_forgone","near_award","learner_wallet"],two:1},
  {h:"Code that builds them · 8 files",i:["models/core/course/core_award.sql","macros/planning/near_award.sql","macros/shared/keys.sql"],more:"and 5 more"},
  {h:"Exposures to tell · 3",i:[["wallet_app","Wallet app team"],["revenue_forecast","Finance"],["census_dashboard","Planning"]]}];
const GM_TB=[[150,268],[970,268],[150,568],[970,568]];
function gm_touches(ctx,o){o=o||{};gm_prHead(ctx,o);GM_TCH.forEach((B,k)=>{const [bx,by]=GM_TB[k],bw=800,bh=280,u=clamp((o.u||[])[k]==null?1:o.u[k],0,1),l=clamp((o.lit||[])[k]||0,0,1);
  gm_lit(ctx,bx,by,bw,bh,l);gu_box(ctx,bx,by,bw,bh,B.h,{seed:440+k});B.i.forEach((it,j)=>{const v=clamp(u*B.i.length-j,0,1);if(v<=0.01)return;
    const col=B.two?Math.floor(j/4):0,row=B.two?j%4:j,ix=bx+30+col*390,iy=by+100+row*44;
    withA(ctx,v,()=>{if(Array.isArray(it)){wc_T(ctx,it[0],ix,iy,{w:500,size:28,f:"mono",col:WC_DARK});wc_T(ctx," · "+it[1],ix+gu_mw(ctx,it[0]),iy,{w:600,size:28,col:WC_INK});}
      else wc_T(ctx,it,ix,iy,{w:500,size:28,f:"mono",col:WC_DARK});});});
  if(B.more&&u>0.99)wc_T(ctx,B.more,bx+30,by+100+3*44,{w:600,size:28,col:WC_MUTED});});}
// Tuesday morning: the rule at the top of the report, and the reviews: Mei approves the meaning, data governance confirms the term
// (o.mei, o.yus, 0 to 1)
function gm_reviews(ctx,o){o=o||{};gm_prHead(ctx,{sub:"Tuesday · reviewed by the owner and data governance"});const x=150,w=1620;gu_box(ctx,x,268,w,140,null,{seed:451});
  gu_md(ctx,"Approve: the owner of each meaning; confirm the term: data governance (DEC-PRJ-11).",x+30,354,{size:30});gu_box(ctx,x,428,w,320,"Reviews",{seed:452});
  [["Mei Tanaka","registrar's office","approved the meaning",o.mei||0],["Yusuf Demir","data governance","confirmed the term",o.yus||0]].forEach(([n,r,s,v],i)=>{const ry=428+136+i*104;
    wc_T(ctx,n,x+30,ry,{w:800,size:32,col:WC_DARK});wc_T(ctx,r,x+30+tw(ctx,n,32,800)+20,ry,{w:600,size:28,col:WC_MUTED});v=clamp(v,0,1);
    if(v>0.01){const sx=x+w-30-tw(ctx,s,30,700);gv_tint(ctx,sx-74,ry-40,tw(ctx,s,30,700)+96,56,GV.gold,0.6*v);wc_tick(ctx,sx-40,ry-12,44,GV.goldInk,v,6);
      withA(ctx,clamp(v*2,0,1),()=>wc_T(ctx,s,sx,ry,{w:700,size:30,col:GV.goldInk}));}});}

/* ---------- a number is a setting ---------- */
// the report again, on Jun's screen by day: the number in the words (o.six), and its line on vars (o.vars): a number in the meaning may
// belong in one
function gm_varsReport(ctx,o){o=o||{};gm_prHead(ctx,{sub:"Tuesday · Jun Park reads what it touches"});const x=150,w=1620;gu_box(ctx,x,268,w,250,"What changed",{seed:461});
  gm_diff(ctx,GM_DIFF,x+30,372,w-60,{size:30,lh:46,six:o.six||0});gu_box(ctx,x,538,w,310,"What it touches",{seed:462});wc_T(ctx,"…",x+30,634,{w:500,size:28,f:"mono",col:WC_PENCIL});
  const v=clamp(o.vars||0,0,1);if(v>0.01)gv_tint(ctx,x+18,664,w-36,112,GV.gold,0.85*v);
  gu_md(ctx,"**Vars** that code reads, in `dbt_project.yml`: a number in the meaning may belong in one:",x+30,702,{size:28});
  gu_md(ctx,"`as_is_date`, `census_date`, `near_award_credit_points`, `personal_data_policy`, …",x+30,752,{size:28});}
// dbt_project.yml's vars, with the setting the new words need (line 23), lit violet (o.lit); o.u slides it in
const GM_VARS=[{n:17,s:"# Stated once, used everywhere. Override one for a run with --vars."},{n:18,s:"vars:"},{fold:1},
  {n:21,s:"  near_award_credit_points: 15       # \"within 15 credit points\" of an award"},{n:22,s:"  microcredentials_per_award: 4      # an award accepts up to four microcredentials …"},
  {n:23,s:"  min_award_credit_points: 6         # a microcredential of 6 credit points or more counts …"},{n:24,s:"  passing_grades: [\"P\", \"C\", \"D\", \"HD\"]"}];
function gm_varsSheet(ctx,o){o=o||{};const e=easeCam(clamp(o.u==null?1:o.u,0,1)),y=lerp(H+40,70,e);
  return gu_file(ctx,90,y,1700,{path:"dbt_project.yml",lang:"yaml",lines:GM_VARS.map((L,i)=>i===5?Object.assign({},L,{lit:clamp(o.lit||0,0,1),litCol:GM_V}):L)});}
// core_credential version 2, with Jun's column (lines 46 to 48, added on Tuesday), its var lit (o.lit) and the column (o.col)
const GM_CC=[{n:36,s:"select"},{fold:1},{n:44,s:"    credential_name,"},{n:45,s:"    credit_points,"},{n:46,s:"    credential_kind = 'award'",add:1},
  {n:47,s:"        or (… = 'microcredential' and credit_points >= {{ var('min_award_credit_points') }})",add:1},{n:48,s:"        as counts_as_award,",add:1},{n:49,s:"    issued_on,"}];
function gm_credSheet(ctx,o){o=o||{};const e=easeCam(clamp(o.u==null?1:o.u,0,1)),y=lerp(H+40,60,e);
  return gu_file(ctx,94,y,1732,{path:"models/core/student/core_credential_v2.sql",lines:GM_CC.map((L,i)=>i===5?Object.assign({},L,{lit:clamp(o.lit||0,0,1),litCol:GM_V}):i===6?Object.assign({},L,{lit:clamp(o.col||0,0,1),litCol:GM_V}):L)});}
// if Mei and the faculties ever agree on another number: one line, in a pull request she reviews, drawn in pencil because it's only a
// maybe (o.a, 0 to 1); o.rev fills its reviewers
function gm_maybe(ctx,o){o=o||{};const a=clamp(o.a||0,0,1);if(a<=0.01)return;const x=1000,y=150,w=780,h=520;
  gm_rise(ctx,a,()=>{wc_panel(ctx,x,y,w,h,{kind:"card",dashed:true,role:WC_PENCIL,seed:471});wc_hand(ctx,"if they ever agree",x+36,y+66,{size:34,w:700,col:WC_PENCIL});
    wc_T(ctx,"min_award_credit_points: 6 → 8",x+36,y+150,{w:500,size:30,f:"mono",col:WC_DARK});wc_T(ctx,"one line changes, in dbt_project.yml",x+36,y+204,{w:600,size:28,col:WC_INK});
    ctx.save();ctx.fillStyle=rgba(WC_PENCIL,0.3);ctx.fillRect(x+30,y+240,w-60,2);ctx.restore();wc_T(ctx,"Reviewers",x+36,y+300,{w:700,size:28,col:WC_MUTED});
    const r=clamp(o.rev||0,0,1);[["Mei Tanaka","registrar's office"],["the faculties","each faculty's steward"]].forEach(([n,s],i)=>{const v=clamp(r*2-i,0,1);if(v<=0.01)return;
      withA(ctx,v,()=>{wc_T(ctx,n,x+36,y+356+i*56,{w:800,size:30,col:WC_DARK});wc_T(ctx,s,x+36+tw(ctx,n,30,800)+18,y+356+i*56,{w:600,size:28,col:WC_MUTED});});});
    if(r>0.99)withA(ctx,clamp(o.req||0,0,1),()=>{const s="review requested",pw=Math.round(tw(ctx,s,28,700)+44);wc_panel(ctx,x+w-36-pw,y+440,pw,48,{kind:"pill",wash:GV.amber,washA:0.4,seed:472});
      wc_T(ctx,s,x+w-36-pw+22,y+474,{w:700,size:28,col:WC_DARK});});});}

/* ---------- counted once ---------- */
// the count, as a ledger on Yusuf's desk: "awards conferred" at the top of its first page, and under it the rule that says what it
// counts, a line at a time (o.r1: which credentials; o.r2: in which year); on the facing page, this year's line (o.yr)
function gm_ledger(ctx,o){o=o||{};const x=290,y=140,w=1340,h=680;gm_book(ctx,x,y,w,h,{rule0:150,lh:52});const L=x+96,R=x+w/2+96;
  wc_hand(ctx,"awards conferred",L,y+92,{size:52,w:700,col:WC_DARK});
  [[["which credentials count:","those that count as an award"],o.r1],[["in which year:","the year they were issued"],o.r2]].forEach(([ls,v],k)=>{v=clamp(v||0,0,1);const ry=y+200+k*156;
    if(v>0.01)gv_tint(ctx,L-20,ry-44,w/2-150,124,GM_V,0.6*v);ls.forEach((s,j)=>wc_hand(ctx,s,L,ry+j*52,{size:34,w:j?600:700,col:j?GM_VI:WC_DARK,p:clamp(v*2-j*0.5,0,1)||(o.all?1:0)}));});
  wc_T(ctx,"the rule",L,y+h-60,{w:600,size:28,col:WC_MUTED});
  wc_T(ctx,"year issued",R,y+92,{w:700,size:30,col:WC_MUTED});wc_T(ctx,"awards",x+w-90,y+92,{w:700,size:30,col:WC_MUTED,align:"right"});
  const yr=clamp(o.yr||0,0,1);if(yr>0.01){wc_hand(ctx,"2026",R,y+252,{size:40,w:700,col:WC_DARK,p:yr});wc_hand(ctx,"4,867",x+w-90-150,y+252,{size:44,w:700,col:GM_VI,p:clamp(yr*1.5-0.5,0,1)});}}
// models/core/course/awards_conferred.sql: the metric view, its config and its YAML; o.lit lights its lines as they're said: [config,
// source, filter, dimension, measure]
const GM_MV=[{n:6,s:"{{ config("},{n:7,s:"    materialized='metric_view',"},{n:8,s:"    enabled=target.type == 'databricks',"},{fold:1},{n:12,s:"version: 1.1"},{fold:1},
  {n:14,s:"source: \"{{ ref('core_credential', v=2) }}\""},{n:15,s:"filter: counts_as_award"},{n:16,s:"dimensions:"},{n:17,s:"  - name: year_issued"},{n:18,s:"    expr: year(issued_on)"},
  {n:19,s:"measures:"},{n:20,s:"  - name: awards_conferred"},{n:21,s:"    expr: count(1)"},{n:22,s:"    synonyms: [awards, awards granted]"}];
const GM_MVL={1:0,6:1,7:2,9:3,10:3,12:4,13:4};
function gm_mvSheet(ctx,o){o=o||{};const e=easeCam(clamp(o.u==null?1:o.u,0,1)),y=lerp(H+40,46,e),L=o.lit||[];
  return gu_file(ctx,110,y,1000,{path:"models/core/course/awards_conferred.sql",lang:"yaml",lh:44,lines:GM_MV.map((r,i)=>GM_MVL[i]==null?r:Object.assign({},r,{lit:clamp(L[GM_MVL[i]]||0,0,1),litCol:GM_MVL[i]===4?GM_V:GV.gold}))});}
// its pull request, small, beside it: who wants to merge it, the build that tested it, and its owner's approval (o.ok, 0 to 1)
function gm_mvPR(ctx,t,o){o=o||{};const a=clamp(o.a||0,0,1);if(a<=0.01)return;const x=1180,y=150,w=640,h=520;gm_rise(ctx,a,()=>{wc_panel(ctx,x,y,w,h,{kind:"card",seed:481});
  wc_T(ctx,"pull request",x+32,y+54,{w:600,size:28,col:WC_MUTED});["Course: awards conferred,","counted once, as a metric","view on Databricks"].forEach((l,i)=>wc_T(ctx,l,x+32,y+108+i*42,{w:800,size:32,col:WC_DARK}));
  wc_T(ctx,"Jun Park wants to merge into main",x+32,y+258,{w:600,size:28,col:WC_INK});ctx.save();ctx.fillStyle=rgba(WC_PENCIL,0.3);ctx.fillRect(x+28,y+292,w-56,2);ctx.restore();
  const ck=clamp(o.ck||0,0,1);gu_light(ctx,x+50,y+352,ck>0.99?"pass":ck>0.01?"run":"wait",t);wc_T(ctx,"dbt build",x+80,y+362,{w:500,size:28,f:"mono",col:WC_DARK});
  wc_T(ctx,ck>0.99?"passed":"tests and builds it",x+80+gu_mw(ctx,"dbt build")+20,y+362,{w:600,size:28,col:ck>0.99?GV.greenInk:WC_MUTED});
  const ok=clamp(o.ok||0,0,1);if(ok>0.01){wc_tick(ctx,x+50,y+432,44,GV.goldInk,ok,6);withA(ctx,clamp(ok*2,0,1),()=>{wc_T(ctx,"Mei Tanaka",x+80,y+444,{w:800,size:30,col:WC_DARK});
    wc_T(ctx,"approved",x+80+tw(ctx,"Mei Tanaka",30,800)+16,y+444,{w:700,size:28,col:GV.goldInk});});}});}
// the metric view's page in the catalog: its owner, and its lineage: core_credential version 2 upstream, and the reports that read it
// downstream (o.r[i], 0 to 1); o.own lights its owner
const GM_LN=[["core_credential_v2","table",180,520],["awards_conferred","metric view",730,520],["draft submission","report · Mei Tanaka",1290,410],["census report","report · Planning",1290,630]];
function gm_lineage(ctx,t,o){o=o||{};gm_tablePage(ctx,{title:"awards_conferred",sub:"university · prod_core · metric view",tabs:["Overview","Lineage"],tab:1});
  const own="Owner · Mei Tanaka",ow=Math.round(tw(ctx,own,28,700)+44),ox=1770-ow;gm_lit(ctx,ox,200,ow,48,o.own||0);wc_panel(ctx,ox,200,ow,48,{kind:"pill",wash:GV.gold,washA:0.35,seed:491});
  wc_T(ctx,own,ox+22,234,{w:700,size:28,col:WC_DARK});
  const node=(i,v)=>{const [s,k,x,y]=GM_LN[i],mono=i<2,w=Math.round(Math.max(mono?gu_mw(ctx,s):tw(ctx,s,30,800),tw(ctx,k,28,600))+64),hh=118;
    gm_rise(ctx,v,()=>{wc_panel(ctx,x,y-hh/2,w,hh,{kind:"card",seed:492+i});if(i===1)gv_tint(ctx,x+8,y-hh/2+8,w-16,hh-16,GM_V,0.28);
      wc_T(ctx,s,x+32,y-6,{w:mono?500:800,size:mono?28:30,f:mono?"mono":undefined,col:WC_DARK});wc_T(ctx,k,x+32,y+36,{w:600,size:28,col:WC_MUTED});});return[x,y,w];};
  const [ax,ay,aw]=node(0,1),[bx,by,bw]=node(1,1);gm_arrow(ctx,[ax+aw+10,ay],[bx-10,by],0,1,{col:WC_PENCIL,lw:3.5});
  [2,3].forEach(i=>{const v=clamp((o.r||[])[i-2]||0,0,1);if(v<=0.01)return;const [,,x,y]=GM_LN[i];gm_thread(ctx,[bx+bw+10,by],[x-12,y],clamp(v*1.6,0,1),{bend:0});node(i,clamp(v*1.6-0.4,0,1));});}
// Planning's census report, its awards: until now its own count, in rose, struck through (o.x); now the metric's, violet (o.nw)
function gm_census(ctx,o){o=o||{};const [x,y,w,h]=GU_BIG;gu_page(ctx,x,y,w,h,{bar:"Databricks · SQL editor",title:"Census report · awards",titleSize:40,sub:"Planning · Clara Jensen"});
  const bx=150,bw=1620,xs=clamp(o.x||0,0,1),nw=clamp(o.nw||0,0,1);gu_box(ctx,bx,268,bw,260,"Until now: its own count",{seed:501});
  ["select count(*) as awards","from core_credential","where credential_kind = 'award'"].forEach((s,i)=>{const by=268+104+i*46;wc_T(ctx,s,bx+30,by,{w:500,size:28,f:"mono",col:GM_RI,a:1-0.4*xs});
    if(xs>0.01){ctx.save();ctx.strokeStyle=rgba(GM_RI,0.9);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(bx+26,by-9);ctx.lineTo(bx+26+(gu_mw(ctx,s)+8)*easeCam(clamp(xs*1.4-i*0.2,0,1)),by-9);ctx.stroke();ctx.restore();}});
  gm_rise(ctx,nw,()=>{gm_lit(ctx,bx,548,bw,290,o.lit||0,GM_V);gu_box(ctx,bx,548,bw,290,"Now: the metric's",{seed:502});gv_tint(ctx,bx+8,556,bw-16,274,GM_V,0.16);
    ["select measure(awards_conferred) as awards","from awards_conferred","where year_issued = 2026"].forEach((s,i)=>gu_code(ctx,s,bx+30,548+104+i*46,{col:GM_VI}));
    wc_T(ctx,"4,867",bx+bw-40,548+190,{w:800,size:72,align:"right",col:GM_VI});});}

/* ---------- agents read the same meaning ---------- */
// on Planning's wall screen: Genie One, and Clara's question, typed in as she asks it (p, 0 to 1), as the big screen shows it next
const GM_ASK="How many awards did we confer this year?";
function gm_genieAsk(p){return(q,sx,sy,sw)=>{wc_T(q,"Genie One",sx+30,sy+104,{w:800,size:32,col:WC_DARK});if(p<=0.01)return;const bw=Math.round(tw(q,GM_ASK,28,600)+48),bx=sx+sw-24-bw;
  wc_panel(q,bx,sy+140,bw,64,{kind:"card",wash:GV.gold,washA:0.18,seed:701});wc_T(q,GM_ASK.slice(0,Math.ceil(GM_ASK.length*p)),bx+24,sy+182,{w:600,size:28,col:WC_DARK});};}
// a Genie agent the data team builds on the metric, drawn as its page: its data source, the metric view (o.src lights it), and a
// chat with the same question and answer (o.q, o.a)
function gm_agent(ctx,t,o){o=o||{};const [x,y,w,h]=GU_BIG;gu_page(ctx,x,y,w,h,{bar:"Databricks · Genie agent",title:"Awards",titleSize:40,sub:"built by the data team on the metric"});
  const lx=150,lw=600;gm_lit(ctx,lx,268,lw,220,o.src||0);gu_box(ctx,lx,268,lw,220,"Data sources",{seed:511});gv_tint(ctx,lx+20,268+68,lw-40,106,GM_V,0.25);
  wc_T(ctx,"awards_conferred",lx+40,268+118,{w:500,size:30,f:"mono",col:WC_DARK});wc_T(ctx,"metric view · owner Mei Tanaka",lx+40,268+160,{w:600,size:28,col:WC_MUTED});
  gu_box(ctx,lx,508,lw,340,"Instructions",{seed:512});gv_lines(ctx,lx+40,508+100,lw-90,5,40,0.9);
  const cx=800,cw=970;gu_box(ctx,cx,268,cw,580,"Ask the agent",{seed:513});const q=GM_ASK,qp=clamp(o.q||0,0,1);
  if(qp>0.01){const qw=Math.round(tw(ctx,q,30,600)+56);wc_panel(ctx,cx+cw-30-qw,268+90,qw,76,{kind:"card",wash:GV.gold,washA:0.18,seed:514});wc_T(ctx,q.slice(0,Math.ceil(q.length*qp)),cx+cw-30-qw+28,268+140,{w:600,size:30,col:WC_DARK});}
  const ap=clamp(o.a||0,0,1);if(ap>0.01){gu_star(ctx,cx+60,268+250,1,t,ap);withA(ctx,ap,()=>{wc_T(ctx,"4,867 awards conferred in 2026",cx+110,268+266,{w:800,size:44,col:WC_DARK});
    const s="metric · ",lw_=tw(ctx,s,28,600),mw=gu_mw(ctx,"awards_conferred"),pw=Math.round(lw_+mw+60);wc_panel(ctx,cx+110,268+310,pw,56,{kind:"pill",wash:GU_CYAN,washA:0.2,seed:515});
    wc_T(ctx,s,cx+140,268+348,{w:600,size:28,col:WC_MUTED});wc_T(ctx,"awards_conferred",cx+140+lw_,268+348,{w:500,size:28,f:"mono",col:WC_DARK});});}}
// one meaning, one number: award's page and the metric at the top, and three that read them below, each saying 4,867: Planning's census
// report, read by people; Genie One; and the data team's agent (o.u[i], 0 to 1); violet threads from the page and the metric to each
const GM_ONE=[["census report","read by people",250],["Genie One","the platform's assistant",760],["Awards","the data team's agent",1270]];
function gm_oneNumber(ctx,t,o){o=o||{};const pg=[560,150],mt=[1360,150];
  [[pg,"page · Award",GM_V],[mt,"metric · awards_conferred",GU_CYAN]].forEach(([[x,y],s,col],k)=>{const w=Math.round(tw(ctx,s,30,700)+60);wc_panel(ctx,x-w/2,y-34,w,68,{kind:"pill",wash:col,washA:0.3,seed:521+k});
    wc_T(ctx,s,x,y+11,{w:700,size:30,align:"center",col:WC_DARK});});
  GM_ONE.forEach(([n,s,x],i)=>{const v=clamp((o.u||[])[i]||0,0,1);if(v<=0.01)return;const w=400,y=440,cx=x+w/2;gm_thread(ctx,[pg[0],pg[1]+36],[cx-40,y-8],clamp(v*1.6,0,1),{bend:-20});
    gm_thread(ctx,[mt[0],mt[1]+36],[cx+40,y-8],clamp(v*1.6,0,1),{bend:-20,col:GU_CYAN});
    gm_rise(ctx,clamp(v*1.6-0.4,0,1),()=>{wc_panel(ctx,x,y,w,330,{kind:"card",seed:530+i});if(i>0)gu_star(ctx,x+50,y+56,1,t,1);wc_T(ctx,n,x+(i>0?96:32),y+68,{w:800,size:34,col:WC_DARK});
      wc_T(ctx,s,x+32,y+118,{w:600,size:28,col:WC_MUTED});wc_T(ctx,"4,867",x+w/2,y+246,{w:800,size:96,align:"center",col:GM_VI});});});}

/* ---------- three layers, one home each ---------- */
// on Noor's map, close, a sheet pinned over it (as Governed in Unity Catalog pinned one): the three layers of meaning, a row each, in the
// order the film says them: what a word means, how a number is counted, how things relate. Each row's home, gold, and its copies, each on
// a thread from what it's synced from, as the map's business objects say (governance/3-architecture-map/4-information/): the glossary
// from the map, the data team's copy from the glossary, the conceptual models from the map; a tick on its corner where a copy is
// checked for drift, "built" where it's built from its home. o.row[i] brings a row in, o.home lights the homes (o.hw[i], 0.3 to 1, how much each), o.c[i]
// its copies, o.ck the ticks
const GM_LAY=[["what a word means","Noor's map",[["the glossary","its page"],["the dbt project","its copy"]],"check"],
  ["how a number is counted","the dbt project",[["the platform","a metric view"]],"build"],
  ["how things relate","Noor's map",[["the dbt project","conceptual models"]],"check"]];
const GM_LS={x:140,y:96,w:1640,h:770};
function gm_layers(ctx,t,o){o=o||{};const S=GM_LS;gv_sheet(ctx,S.x,S.y,S.w,S.h,{rot:0.004});gv_pin(ctx,S.x+S.w/2,S.y+22,GV.red,1.3);
  wc_T(ctx,"Three layers of meaning",S.x+60,S.y+96,{w:800,size:40,col:WC_DARK});gu_filmTag(ctx,S.x+S.w-50,S.y+86,"Where each piece lives",clamp(o.tag||0,0,1),{align:"right"});
  GM_LAY.forEach(([nm,home,cps,how],i)=>{const v=clamp((o.row||[])[i]||0,0,1);if(v<=0.01)return;const ry=S.y+170+i*196,hx=S.x+500,hw=300,hh=150,hm=clamp(o.home||0,0,1);
    gm_rise(ctx,v,()=>{wc_T(ctx,nm,S.x+60,ry+hh/2+12,{w:800,size:32,col:WC_DARK});gm_lit(ctx,hx,ry,hw,hh,hm*(o.hw?clamp(o.hw[i],0,1):1));wc_panel(ctx,hx,ry,hw,hh,{kind:"card",seed:540+i});
      gv_tint(ctx,hx+8,ry+8,hw-16,hh-16,GV.gold,0.2+0.35*hm);wc_T(ctx,home,hx+28,ry+66,{w:800,size:32,col:WC_DARK});wc_tag(ctx,hx+28,ry+108,"home",{size:28,wash:GV.gold,washA:0.5,seed:545+i});
      cps.forEach(([c1,c2],j)=>{const u=clamp((o.c||[])[i]==null?0:o.c[i]*cps.length-j,0,1),cw=290,cx=S.x+870+j*(cw+80),fx=j?cx-72:hx+hw+8;if(u<=0.01)return;
        gm_thread(ctx,[fx,ry+hh/2],[cx-8,ry+hh/2],clamp(u*1.6,0,1),{bend:-16,col:i===1?GU_CYAN:GM_VI});
        gm_rise(ctx,clamp(u*1.6-0.4,0,1),()=>{wc_panel(ctx,cx,ry+10,cw,hh-20,{kind:"card",seed:550+i*3+j});wc_T(ctx,c1,cx+24,ry+64,{w:800,size:30,col:WC_DARK});wc_T(ctx,c2,cx+24,ry+106,{w:600,size:28,col:WC_MUTED});});
        const ck=clamp(o.ck||0,0,1);if(ck>0.01&&u>0.99){if(how==="check")wc_tick(ctx,cx+cw-14,ry+18,40,GV.greenInk,ck,6);else wc_hand(ctx,"built",cx+cw+18,ry+hh/2+10,{size:30,w:700,col:GU_CYAN,a:ck});}});});});}

/* ---------- one meaning ---------- */
// what Mei's words reach, as tags over her screen, each on a violet thread from it (o.u[i], 0 to 1)
const GM_USED=[["core_award",1150,104,1],["awards_conferred",1470,104,1],["census report",1150,214],["Genie One",1460,214,0,1]];
function gm_used(ctx,t,o){o=o||{};const [sx,sy,sw]=GV_RX.screen;GM_USED.forEach(([s,x,y,mono,star],i)=>{const v=clamp((o.u||[])[i]||0,0,1);if(v<=0.01)return;
  const w=(mono?gu_mw(ctx,s):tw(ctx,s,30,700))+40+(star?50:0);gm_thread(ctx,[sx+sw/2,sy-6],[x+w/2,y+30],clamp(v*1.6,0,1),{bend:10});
  gm_rise(ctx,clamp(v*1.6-0.4,0,1),()=>{if(star){wc_panel(ctx,x,y-26,w,52,{kind:"tag",seed:560+i});gu_star(ctx,x+32,y,0.8,t,1);wc_T(ctx,s,x+66,y+11,{w:700,size:30,col:WC_INK});}
    else wc_tag(ctx,x,y,s,{size:mono?28:30,f:mono?"mono":undefined,w:mono?500:700,seed:560+i});});});}
// the floor of offices, each person in theirs (as One word, one home sets them): a violet thread from the registrar's office to each
// office in turn (o.u[i], 0 to 1), rising with how far it goes, so none crosses another, and the office takes a soft violet light; then
// the glass, and the names on it
const GM_AT={clara:0,mei:1,yusuf:2,jun:3,sam:4},GM_WORK={clara:{pose:"reach"},mei:{pose:"hold",carry:heldNotebook},jun:{pose:"reach"},sam:{pose:"phone"}};
function gm_floor(x,tt,o){o=o||{};const F=GV_FL;F.rooms.forEach((r,i)=>{const v=i===1?clamp(o.home||0,0,1):clamp((o.u||[])[i<1?0:i-1]||0,0,1);if(v>0.01)gv_tint(x,F.x(i),F.top,F.w,F.fy-F.top,GM_V,0.45*v);});
  Object.keys(GM_AT).forEach(id=>{const i=GM_AT[id];person(x,id,F.spot(i),806,0.5,Object.assign({pose:"stand",t:tt,flip:i%2===1},GM_WORK[id]||{},(o.pose||{})[id]||{}));});
  gv_floorGlass(x);const m=x.getTransform(),vl=-m.e/m.a,vr=(x.canvas.width-m.e)/m.a;
  F.rooms.forEach((r,i)=>{const cx=F.x(i)+F.w/2,hw=tw(x,r[1],30,800)/2+6;gv_floorName(x,i,clamp(Math.min(cx-hw-vl,vr-cx-hw)/30,0,1));});
  const hx=F.x(1)+F.w/2;[0,2,3,4].forEach((i,k)=>{const v=clamp((o.u||[])[k]||0,0,1);if(v<=0.01)return;const tx=F.x(i)+F.w/2;gm_thread(x,[hx,128],[tx,128],v,{bend:-0.175*Math.abs(tx-hx)});});}

/* ---------- the places ---------- */
const WC_PLACES={regRoom:gv_paintRegistrar,registrar:gv_paintRegistrarClose,registrarDesk:gv_paintRegistrarDesk,regScreen:c=>gv_paintScreenDesk(c,GV_ROOM.reg),
  boardGov:c=>gv_paintBoardClose(c,GV_ROOM.gov),deskGov:gv_paintDesk,big:c=>gu_paintScreenBig(c,GV_ROOM.data),bigReg:c=>gu_paintScreenBig(c,GV_ROOM.reg),
  bigPlan:c=>gu_paintScreenBig(c,GV_ROOM.plan),bigNight:gm_paintBigNight,dataNight:gm_paintNightRoom,nightScreen:gm_paintNightScreen,desk:gu_paintFilesDesk,
  planning:gv_paintPlanning,floor:gv_paintFloor,mapClose:gv_paintMapClose,board:c=>gv_paintBoardClose(c,GV_ROOM.data)};
