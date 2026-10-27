/* ===== One word, one home: the university's pictures =====
   Only the university's own places, from the series' rooms.js: Mei's desk, Yusuf's board and desk, the stewards' meeting room,
   Planning, the faculty analyst's desk, the data team's room by day and by night, and the floor of offices. The pictures are the
   film's own things: the five glossaries (the glossary on the platform on Mei's screen, Planning's printed spreadsheet, the policy's
   appendix, a faculty's dashboard on a tablet, the 2019 tool's printout), the board of five cards, the tool's login page, the
   term card, the glossary, the dictionary and the catalog side by side, the links that replace the copies, the data team's
   copy, the change notice Mei signs, the business rule, the workshop's notes, and binder 12. In plain words: the series' first pack
   shows no file, code or technical screen. Every name starts with ow_ or OW. */

/* ---------- helpers ---------- */
// made once per chapter, the first time it draws: its cues are known by then
const ow_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// the year and the place in the top corner: the latest one passed, dissolving from the one before
function ow_pill(ctx,t,mk,a){if(a<=0.01)return;let i=0;for(let k=1;k<mk.length;k++)if(t>=mk[k][0])i=k;const u=i>0?fin(t,mk[i][0],0.35):1;
  if(u<1)wc_year(ctx,56,72,mk[i-1][1],a*(1-u));wc_year(ctx,56,72,mk[i][1],a*u);}
// a tag that springs in at t0 and goes at t1 (or stays)
function ow_tagAt(ctx,t,t0,t1,x,y,s,o){const a=t1==null?fin(t,t0,0.35):gv_io(t,t0,t1,0.35);if(a<=0.01)return;const k=0.9+0.1*spring(fin(t,t0,0.5));
  ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,a,()=>wc_tag(ctx,0,0,s,Object.assign({align:"center"},o||{})));ctx.restore();}
// the words on a thing the camera closes in on: read when it's close, and only a texture of words while it's far, so they're
// marked as decoration while smaller than 28 px as seen. Each of them is read somewhere in its chapter, close. o.max shrinks a
// line to fit a width.
function ow_T(ctx,s,x,y,o){o=Object.assign({},o||{});let sz=o.size||28;if(o.max){const w=tw(ctx,s,sz,o.w||600,o.f);if(w>o.max)sz*=o.max/w;}o.size=sz;
  const m=ctx.getTransform(),k=Math.sqrt(Math.abs(m.a*m.d-m.b*m.c))*W/ctx.canvas.width;if(sz*k<27)o.deco=1;wc_T(ctx,s,x,y,o);}
// a name card, as the series introduces people: the name, then the role; it rises a little as it comes
function ow_nameCard(ctx,x,y,name,role,a){if(a<=0.01)return;const w=Math.round(Math.max(tw(ctx,name,32,800),tw(ctx,role,28,600))+60);
  withA(ctx,a,()=>{ctx.save();ctx.translate(0,12*(1-a));wc_panel(ctx,x,y,w,112,{kind:"card",seed:3});wc_T(ctx,name,x+30,y+48,{w:800,size:32,col:WC_DARK});
    wc_T(ctx,role,x+30,y+90,{w:600,size:28,col:WC_MUTED});ctx.restore();});}
// a meaning's head on paper or a screen: a band washed in its colour, "award" in its ink; lit (0 to 1) deepens it as it's named
function ow_head(ctx,x,y,w,h,m,lit,o){o=o||{};const a=0.22+0.42*(lit||0);ctx.save();ctx.globalAlpha*=a;ctx.fillStyle=rgba(wc_lit(OW_MEAN[m],0.3),1);ctx.fillRect(x,y,w,h);ctx.restore();
  ctx.save();ctx.fillStyle=rgba(OW_MEAN[m],0.85);ctx.fillRect(x,y+h-3,w,3);ctx.restore();
  wc_T(ctx,o.word||"award",x+(o.pad||14),y+h*0.5+(o.size||28)*0.36,{w:800,size:o.size||28,col:OW_MEANINK[m]});}
// a screen's own bar, its title in white (ow_T, so it's read when the camera is close)
function ow_bar(ctx,x,y,w,h,title,col,size){ctx.save();ctx.fillStyle=rgba(col||[70,96,140],1);ctx.fillRect(x,y,w,h);ctx.restore();if(title)ow_T(ctx,title,x+14,y+h*0.5+size*0.36,{w:700,size,col:[255,255,255]});}
// a mouse pointer, and the ring of a click
function ow_cursor(ctx,x,y,s,click){s=s||1;ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle="#ffffff";ctx.strokeStyle=rgba(WC_DARK,0.9);ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,34);ctx.lineTo(9,26);ctx.lineTo(16,40);ctx.lineTo(22,37);ctx.lineTo(15,23);ctx.lineTo(26,23);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
  if(click>0&&click<1){ctx.save();ctx.strokeStyle=rgba(GV.cyanInk,0.7*(1-click));ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,10+30*click,0,TAU);ctx.stroke();ctx.restore();}}
// a hand-drawn underline under a run of words, drawn on with p
function ow_under(ctx,x,y,w,col,p,lw){if(p<=0)return;wc_pencil(ctx,[[x,y],[x+w*0.5,y+2],[x+w,y-1]],p,{col,lw:lw||4,seed:(x|0)+7});}
// the night: a deep blue over a place, the screens still lit (drawn after), and a small moon in its window
function ow_night(ctx,a,moon){if(a<=0.01)return;ctx.save();ctx.globalCompositeOperation="multiply";ctx.globalAlpha=a;ctx.fillStyle="rgb(96,104,150)";ctx.fillRect(-W,-H,3*W,3*H);ctx.restore();
  if(moon){const [mx,my,r]=moon;ctx.save();ctx.globalAlpha=a;wc_glowAt(ctx,mx,my,r*4,[230,236,255],0.35);ctx.fillStyle=rgba([246,242,222],1);ctx.beginPath();ctx.arc(mx,my,r,0,TAU);ctx.fill();
    ctx.fillStyle=rgba([150,156,196],1);ctx.beginPath();ctx.arc(mx+r*0.42,my-r*0.18,r*0.86,0,TAU);ctx.fill();ctx.restore();}}

/* ---------- the five glossaries ---------- */
// what each glossary is, says, and who made it: the meaning (0 violet, 1 rose, 2 olive), its name on Yusuf's board, the tag for who
// made it and why, the word that differs
const OW_GL=[{k:"screen",m:0,name:["Business","glossary"],tag:["the data team","for its tables"],word:"microcredentials"},
  {k:"sheet",m:1,name:["Planning's","spreadsheet"],tag:["Planning","for the census"]},
  {k:"policy",m:1,name:["Policy","appendix"],tag:["registrar's office","for the policy"]},
  {k:"tab",m:2,name:["Faculty","dashboards"],tag:["each faculty","for dashboards"],word:"degrees"},
  {k:"print",m:1,name:["Glossary","tool · 2019"],tag:["bought in 2019","for everyone"]}];
// at Mei's desk (the registrar's desk close, GV_RX), where Who decides leaves them: her screen, and four more round her on the wall and
// the shelves, from right to left Planning's spreadsheet, printed; the registrar's policy, stapled, at its appendix; a faculty's
// dashboard on a tablet; the 2019 tool's printout, yellowed. OW_FIVE: each one's box [x, y, w, h], its tilt and its meaning. Drawn as
// that film draws them, so this film opens on its last picture; here each one's grey lines resolve into its words (r, 0 to 1) as it's read
const OW_FIVE=[[GV_RX.screen,0,0],[[880,98,300,228],0.03,1],[[650,34,232,280],-0.04,1],[[186,84,292,200],0.035,2],[[22,336,272,300],-0.06,1]],OW_YELLOW=[238,224,176];
// each one's head, "award" in its meaning's colour: where it sits in its box [x, y, inset], and where it is on the wall, for a halo
const OW_FIVEHEAD=[[18,62,36],[12,12,24],[14,46,28],[16,18,32],[12,16,24]];
function ow_fiveHead(ctx,x,y,w,m){gv_tint(ctx,x,y,w,58,OW_MEAN[m],0.9);wc_T(ctx,"award",x+16,y+43,{w:800,size:40,col:OW_MEANINK[m]});}
function ow_fiveHeadBox(k){const [[x,y,w]]=OW_FIVE[k],[hx,hy,hw]=OW_FIVEHEAD[k];return [x+hx,y+hy,w-hw,58];}
// grey lines giving way to words as r goes from 0 to 1
function ow_resolve(ctx,r,lines,words){if(r<0.99)withA(ctx,1-r,lines);if(r>0.01)withA(ctx,r,words);}
function ow_five(ctx,k,r,o){o=o||{};const [[x,y,w,h],rot,m]=OW_FIVE[k],[hx,hy,hw]=OW_FIVEHEAD[k];
  // her screen: the glossary on the platform, what counts, its owner, and that the data team copies it (o.copy, 0 to 1)
  if(k===0){gv_screen(ctx,x,y,w,h,"Business glossary",q=>{ow_fiveHead(q,x+hx,y+hy,w-hw,m);ow_resolve(q,r,()=>gv_lines(q,x+30,y+160,w-90,4,36,0.9),()=>{
      ["graduate certificates,","masters and doctorates,"].forEach((l,i)=>ow_T(q,l,x+30,y+164+i*34,{size:24,col:WC_INK}));
      ow_T(q,"microcredentials of 6 credit points or more",x+30,y+232,{size:24,w:700,col:OW_MEANINK[0],max:w-60});ow_T(q,"owner · Mei Tanaka",x+30,y+270,{size:22,col:WC_MUTED});
      const c=o.copy||0;if(c>0.01)withA(q,c,()=>{const s="copied by the data team",sw=tw(q,s,20,600)+32;q.save();q.fillStyle=rgba(wc_lit(GV.cyanInk,0.8),1);rr(q,x+26,y+292,sw,36,18);q.fill();q.restore();
        ow_T(q,s,x+42,y+317,{size:20,col:GV.cyanInk});});});},{titleSize:28});return;}
  ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(rot);ctx.translate(-w/2,-h/2);
  // Planning's spreadsheet, printed: a grid; read, its tab of definitions and award's rows, across the merged cells
  if(k===1){gv_sheet(ctx,0,0,w,h);const g0=78,rh=26,cs=[12,36,124,214,w-12];ctx.save();ctx.fillStyle=rgba([226,229,234],1);ctx.fillRect(12,g0,w-24,18);ctx.fillRect(12,g0,24,h-g0-12);
    ctx.strokeStyle=rgba(WC_PENCIL,0.45);ctx.lineWidth=1.2;for(let yy=g0;yy<=h-12;yy+=rh){ctx.beginPath();ctx.moveTo(12,yy);ctx.lineTo(w-12,yy);ctx.stroke();}
    cs.forEach((cx,j)=>{ctx.save();if(j===2||j===3)ctx.globalAlpha*=1-r;ctx.beginPath();ctx.moveTo(cx,g0);ctx.lineTo(cx,h-12);ctx.stroke();ctx.restore();});ctx.restore();ow_fiveHead(ctx,hx,hy,w-hw,m);
    ow_resolve(ctx,r,()=>{for(let i=0;i<3;i++)for(let j=1;j<4;j++)gv_lines(ctx,cs[j]+8,g0+18+i*rh+10,cs[j+1]-cs[j]-22,1,0,0.9);},()=>{ow_T(ctx,"Planning · tab: Definitions",44,g0+14,{size:14,col:WC_MUTED});
      ow_T(ctx,"award",44,g0+45,{size:20,w:800,col:OW_MEANINK[1]});["graduate certificates,","masters and doctorates"].forEach((l,i)=>ow_T(ctx,l,44,g0+71+i*26,{size:20,col:WC_INK,max:w-60}));});}
  // the registrar's policy, stapled, open at its appendix, a page behind; read, its definition of award
  if(k===2){ctx.save();ctx.translate(16,10);ctx.rotate(0.05);gv_sheet(ctx,0,0,w,h);ctx.restore();gv_sheet(ctx,0,0,w,h);
    ctx.save();ctx.strokeStyle=rgba([120,124,134],0.95);ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(14,34);ctx.lineTo(40,10);ctx.stroke();ctx.restore();ow_fiveHead(ctx,hx,hy,w-hw,m);
    ow_resolve(ctx,r,()=>{ctx.save();ctx.fillStyle=rgba(WC_INK,0.5);ctx.fillRect(56,22,w-100,7);ctx.fillStyle=rgba(WC_MUTED,0.4);ctx.fillRect(w/2-10,h-24,20,5);ctx.restore();gv_lines(ctx,28,134,w-60,4,30,0.9);},()=>{
      ow_T(ctx,"Appendix B · Definitions",56,30,{size:15,w:700,col:WC_MUTED,max:w-70});
      ["Award: a graduate","certificate, master's","degree or doctorate","conferred by the","University."].forEach((l,i)=>ow_T(ctx,l,24,136+i*26,{size:20,col:WC_INK,max:w-36}));});}
  // a faculty's dashboard on a tablet, four bars; read, the description it gives, in a box over the bars
  if(k===3){ctx.save();ctx.fillStyle=rgba(GV.bezel,1);rr(ctx,0,0,w,h,22);ctx.fill();ctx.fillStyle=rgba(GV.screen,1);ctx.fillRect(16,16,w-32,h-32);ctx.restore();ow_fiveHead(ctx,hx,hy,w-hw,m);
    [0.55,0.8,0.4,0.68].forEach((v,j)=>{ctx.save();ctx.fillStyle=rgba([140,168,200],0.9);ctx.fillRect(36+j*58,h-28-v*96,38,v*96);ctx.restore();});
    if(r>0.01)withA(ctx,r,()=>{const bx=26,by=84,bw=w-52,bh=h-104;ctx.save();ctx.fillStyle=rgba([250,250,246],0.97);ctx.strokeStyle=rgba(WC_MUTED,0.5);ctx.lineWidth=1.5;rr(ctx,bx,by,bw,bh,8);ctx.fill();ctx.stroke();ctx.restore();
      ow_T(ctx,"About this measure",bx+14,by+24,{size:15,w:700,col:WC_MUTED});ow_T(ctx,"Awards: degrees",bx+14,by+54,{size:22,w:800,col:OW_MEANINK[2]});ow_T(ctx,"conferred this year.",bx+14,by+80,{size:18,col:WC_INK,max:bw-28});});}
  // the 2019 tool's printout, yellowed; read, the tool's name and award's entry
  if(k===4){ctx.save();ctx.shadowColor="rgba(70,60,40,0.25)";ctx.shadowBlur=12;ctx.shadowOffsetY=6;ctx.fillStyle=rgba(OW_YELLOW,1);ctx.fillRect(0,0,w,h);ctx.restore();
    ctx.save();const g=ctx.createRadialGradient(w/2,h/2,h*0.2,w/2,h/2,h*0.8);g.addColorStop(0,"rgba(214,190,120,0)");g.addColorStop(1,"rgba(196,166,96,0.4)");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);ctx.restore();
    ow_fiveHead(ctx,hx,hy,w-hw,m);ow_resolve(ctx,r,()=>gv_lines(ctx,24,104,w-50,5,32,0.75),()=>{ow_T(ctx,"Glossary · 600 terms",24,110,{size:20,w:800,col:WC_DARK,max:w-48});ow_T(ctx,"printed 2019",24,136,{size:17,col:WC_MUTED});
      ow_T(ctx,"award",24,182,{size:20,w:800,col:OW_MEANINK[1]});["graduate certificates,","masters and doctorates"].forEach((l,i)=>ow_T(ctx,l,24,208+i*26,{size:19,col:WC_INK,max:w-48}));gv_lines(ctx,24,262,w-50,1,0,0.75);});}
  ctx.restore();}

/* ---------- Yusuf's board: the five as cards ---------- */
// on the cork board close (GV_BC): a card for each, its name, award's head in its colour, a few lines of it, the word that differs;
// a tag pinned under each, who made it and why
const OW_BX={cx:i=>360+i*300,top:190,w:272,h:330,tag:564};
function ow_boardCard(ctx,i,o){o=o||{};const G=OW_GL[i],x=OW_BX.cx(i)-OW_BX.w/2,y=OW_BX.top,w=OW_BX.w,h=OW_BX.h,a=o.a==null?1:o.a;if(a<=0.01)return;
  withA(ctx,a,()=>{ctx.save();ctx.translate(x+w/2,y);ctx.rotate(((i*37)%7-3)*0.005);ctx.translate(-x-w/2,-y);
    wc_panel(ctx,x,y,w,h,{kind:"card",seed:300+i});gv_pin(ctx,x+w/2,y+14,GV.red,1.1);
    G.name.forEach((l,j)=>wc_T(ctx,l,x+20,y+64+j*36,{w:800,size:28,col:WC_DARK}));ow_head(ctx,x+12,y+118,w-24,50,G.m,o.lit||0,{size:30});
    gv_lines(ctx,x+24,y+200,w-60,G.word?2:4,24,0.9);
    if(G.word){wc_T(ctx,G.word,x+24,y+290,{w:700,size:28,col:OW_MEANINK[G.m]});ow_under(ctx,x+22,y+300,tw(ctx,G.word,28,700)+4,OW_MEANINK[G.m],o.under||0);}
    ctx.restore();});}
function ow_boardTag(ctx,i,a){if(a<=0.01)return;const G=OW_GL[i],w=OW_BX.w,x=OW_BX.cx(i)-w/2,y=OW_BX.tag,k=0.92+0.08*spring(a);
  ctx.save();ctx.translate(x+w/2,y);ctx.scale(k,k);ctx.translate(-x-w/2,-y);withA(ctx,clamp(a*2,0,1),()=>{wc_panel(ctx,x,y,w,96,{kind:"tag",seed:320+i});
    wc_T(ctx,G.tag[0],x+18,y+40,{w:800,size:28,col:WC_DARK});wc_T(ctx,G.tag[1],x+18,y+78,{w:600,size:28,col:WC_INK});});ctx.restore();}
// frosted glass over a card that only its own team can find, and what it says on it
function ow_frost(ctx,i,a,lines){if(a<=0.01)return;const w=OW_BX.w+20,x=OW_BX.cx(i)-w/2,y=OW_BX.top-10,h=OW_BX.h+20;withA(ctx,a,()=>{
  ctx.save();ctx.fillStyle="rgba(236,242,248,0.78)";rr(ctx,x,y,w,h,14);ctx.fill();ctx.globalCompositeOperation="screen";for(const [o_,ww] of [[0.18,46],[0.42,18],[0.7,34]]){const g=ctx.createLinearGradient(x+w*o_,0,x+w*o_+ww,0);
    g.addColorStop(0,"rgba(255,255,255,0)");g.addColorStop(0.5,"rgba(255,255,255,0.55)");g.addColorStop(1,"rgba(255,255,255,0)");ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x+w*o_,y);ctx.lineTo(x+w*o_+ww,y);ctx.lineTo(x+w*o_+ww-90,y+h);ctx.lineTo(x+w*o_-90,y+h);ctx.closePath();ctx.fill();}ctx.restore();
  ctx.save();ctx.strokeStyle=rgba(GV.metal,0.9);ctx.lineWidth=2;rr(ctx,x,y,w,h,14);ctx.stroke();ctx.restore();
  lines.forEach((l,j)=>wc_T(ctx,l,x+w/2,y+h*0.42+j*40,{w:800,size:28,align:"center",col:WC_DARK}));});}

/* ---------- the 2019 tool's login page ---------- */
// on a screen close (GV_SC): the tool's name, its 600 terms, a sign-in, nobody signed in for fourteen months, and a cobweb in its corner
function ow_login(ctx,x,y,w,h,o){o=o||{};ctx.save();ctx.fillStyle=rgba([238,236,230],1);ctx.fillRect(x,y,w,h);ctx.restore();ow_bar(ctx,x,y,w,48,"",[150,120,120],28);
  wc_T(ctx,"Glossary",x+w/2,y+190,{w:800,size:72,align:"center",col:[120,70,86]});wc_T(ctx,"600 terms · since 2019",x+w/2,y+250,{w:600,size:32,align:"center",col:WC_MUTED});
  for(const [fy,lab] of [[300,"user name"],[380,"password"]]){ctx.save();ctx.fillStyle="#ffffff";ctx.strokeStyle=rgba(WC_MUTED,0.5);ctx.lineWidth=2;ctx.fillRect(x+w/2-240,y+fy,480,56);ctx.strokeRect(x+w/2-240,y+fy,480,56);ctx.restore();
    wc_T(ctx,lab,x+w/2-220,y+fy+38,{w:500,size:28,col:[168,168,176]});}
  ctx.save();ctx.fillStyle=rgba([150,120,120],1);rr(ctx,x+w/2-120,y+470,240,64,10);ctx.fill();ctx.restore();wc_T(ctx,"sign in",x+w/2,y+512,{w:700,size:30,align:"center",col:[255,255,255]});
  // the cobweb, spun across the screen's top right corner
  const p=o.web==null?1:o.web;if(p>0){const cx=x+w,cy=y+48,R=[230,170,110,60];ctx.save();ctx.strokeStyle=rgba([120,120,130],0.55*p);ctx.lineWidth=1.6;for(let s=0;s<6;s++){const a=Math.PI/2+s*Math.PI/10;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx-Math.sin(a-Math.PI/2)*260*p,cy+Math.cos(a-Math.PI/2)*260*p);ctx.stroke();}
    R.forEach(r=>{ctx.beginPath();for(let s=0;s<6;s++){const a=s*Math.PI/10,px=cx-Math.sin(a)*r*p,py=cy+Math.cos(a)*r*p;if(s)ctx.quadraticCurveTo(cx-Math.sin(a-0.15)*r*0.9*p,cy+Math.cos(a-0.15)*r*0.9*p,px,py);else ctx.moveTo(px,py);}ctx.stroke();});ctx.restore();}}

/* ---------- the stewards' meeting room: its screen ---------- */
// the five on the meeting room's wall screen (GV_MT.screen), small; the 2019 tool's the biggest. aside (0 to 1) moves it away; pick
// (0 to 1) lifts the glossary on the platform to the middle and dims the rest
function ow_meetFive(ctx,aside,pick){const [sx,sy,sw,sh]=GV_MT.screen;ctx.save();ctx.fillStyle=rgba(GV.screen,1);ctx.fillRect(sx,sy,sw,sh);ctx.restore();
  ow_bar(ctx,sx,sy,sw,30,"award · in five glossaries",[70,96,140],17);const lab=["glossary","Planning","policy","dashboards","2019 tool"],xs=[sx+20,sx+118,sx+216,sx+314,sx+412];
  [1,2,3,4,0].forEach(i=>{const G=OW_GL[i],big=i===4,cw=big?108:86,ch=big?150:118;let x=xs[i],y=sy+64,k=1,a=1;
    if(big){x+=60*easeCam(aside);y+=40*easeCam(aside);a=1-0.55*aside;}
    if(i===0){const e=easeCam(pick);x=lerp(x,sx+sw/2-cw*0.75,e);y=lerp(y,sy+52,e);k=1+0.5*e;}else a*=1-0.6*pick;
    withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(k,k);ctx.fillStyle="rgba(40,40,60,0.12)";ctx.fillRect(3,4,cw,ch);ctx.fillStyle=rgba(i===3?[60,64,76]:i===4?[240,228,190]:[253,253,250],1);ctx.fillRect(0,0,cw,ch);
      ctx.fillStyle=rgba(wc_lit(OW_MEAN[G.m],0.35),1);ctx.fillRect(i===3?5:0,i===3?5:0,cw-(i===3?10:0),22);gv_lines(ctx,8,36,cw-22,big?6:4,14,0.8);ctx.restore();
      ow_T(ctx,lab[i],x+cw*k/2,y+ch*k+22,{size:16,w:700,align:"center",col:WC_INK});});});}
// the meeting room's screen close: the wall round it, the screen filling the frame (what it shows is drawn every frame)
const OW_MS=[150,64,1620,790];
function ow_paintMeetScreen(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),GV_ROOM.meet,{kind:"plaster",line:false,seed:83});
  gv_lightGlow(ctx,960,-60,900);const [x,y,w,h]=OW_MS;wc_part(ctx,wc_rect(x-18,y-18,w+36,h+36),GV.bezel,1,{kind:"thing"});wc_flat(ctx,wc_rect(x,y,w,h),[230,234,240],1,"screen");}
// a term as the glossary keeps it: its definition, its owner, its status, when it last changed; each line fills in at its time (u[])
function ow_termCard(ctx,x,y,w,u,o){o=o||{};const rows=[["definition","A qualification the university confers, such as a graduate certificate, a master or a microcredential, for at least 6 credit points."],
    ["owner","Mei Tanaka, registrar's office"],["status","approved"],["last changed","Monday"]],h=o.h||560;
  wc_panel(ctx,x,y,w,h,{kind:"card",seed:401});ow_head(ctx,x+16,y+16,w-32,70,0,1,{size:44,pad:24});
  const L=ow_wrap(ctx,rows[0][1],36,w-380,600),dy=i=>i?76:L.length*50+44;let yy=y+150;rows.forEach(([k,v],i)=>{const a=fin(u[i]==null?0:u[i],0,1);if(a<=0.01){yy+=dy(i);return;}
    withA(ctx,a,()=>{ctx.save();ctx.translate(14*(1-a),0);wc_T(ctx,k,x+40,yy,{w:700,size:32,col:WC_MUTED});
      if(i===0)L.forEach((l,j)=>wc_T(ctx,l,x+320,yy+j*50,{w:600,size:36,col:WC_INK}));
      else wc_T(ctx,v,x+320,yy,{w:i===1?700:600,size:36,col:i===2?GV.greenInk:WC_INK});ctx.restore();});yy+=dy(i);});}
// lines of text wrapped to a width, at a size
function ow_wrap(ctx,s,size,maxW,wt){const words=s.split(" "),out=[];let cur="";words.forEach(w_=>{const t_=cur?cur+" "+w_:w_;if(tw(ctx,t_,size,wt||600)>maxW&&cur){out.push(cur);cur=w_;}else cur=t_;});if(cur)out.push(cur);return out;}
// the business glossary, the data dictionary and the catalog, side by side on the screen; each comes in at its time (u[])
function ow_three(ctx,u){const [sx,sy]=OW_MS,pw=520,ph=690,gap=20,x0=sx+(OW_MS[2]-3*pw-2*gap)/2;
  const panel=(i,head,sub,fn)=>{const a=fin(u[i]||0,0,1);if(a<=0.01)return;const x=x0+i*(pw+gap),y=sy+52;withA(ctx,a,()=>{ctx.save();ctx.translate(0,20*(1-a));
    wc_panel(ctx,x,y,pw,ph,{kind:"card",seed:410+i});wc_T(ctx,head,x+28,y+64,{w:800,size:36,col:WC_DARK});fn(x,y);wc_T(ctx,sub,x+28,y+ph-36,{w:600,size:28,col:WC_MUTED});ctx.restore();});};
  panel(0,"business glossary","the business's words",(x,y)=>{ow_head(ctx,x+20,y+100,pw-40,64,0,1,{size:38,pad:18});
    ["what counts:","graduate certificates","masters and doctorates","microcredentials,","6 credit points or more"].forEach((l,j)=>wc_T(ctx,l,x+28,y+214+j*44,{w:j>2?700:600,size:28,col:j>2?OW_MEANINK[0]:WC_INK}));
    wc_T(ctx,"owner · Mei Tanaka",x+28,y+460,{w:700,size:28,col:WC_INK});});
  // the table and three of its columns, each with what it holds, in plain words: the series' first pack names no column as code does
  panel(1,"data dictionary","each table and column",(x,y)=>{wc_T(ctx,"Awards",x+28,y+144,{w:700,size:34,col:GV.cyanInk});
    wc_T(ctx,"each award the university offers",x+28,y+190,{w:600,size:28,col:WC_MUTED});
    ctx.save();ctx.strokeStyle=rgba(WC_MUTED,0.35);ctx.lineWidth=1.5;for(let r=0;r<4;r++){ctx.beginPath();ctx.moveTo(x+24,y+222+r*62);ctx.lineTo(x+pw-24,y+222+r*62);ctx.stroke();}ctx.restore();
    [["award code","text"],["award type","text"],["credit points required","a number"]].forEach(([c,ty],j)=>{wc_T(ctx,c,x+28,y+266+j*62,{w:600,size:28,col:WC_INK});
      wc_T(ctx,ty,x+pw-28,y+266+j*62,{w:600,size:28,align:"right",col:WC_MUTED});});});
  panel(2,"catalog","find the data · shows both",(x,y)=>{ctx.save();ctx.fillStyle="#ffffff";ctx.strokeStyle=rgba(WC_MUTED,0.6);ctx.lineWidth=2;rr(ctx,x+24,y+104,pw-48,64,32);ctx.fill();ctx.stroke();ctx.restore();
    ctx.save();ctx.strokeStyle=rgba(WC_MUTED,0.9);ctx.lineWidth=3;ctx.beginPath();ctx.arc(x+62,y+134,12,0,TAU);ctx.moveTo(x+71,y+143);ctx.lineTo(x+82,y+154);ctx.stroke();ctx.restore();
    wc_T(ctx,"award",x+96,y+146,{w:600,size:30,col:WC_DARK});
    [[0,"award","business glossary"],[1,"Awards","table"]].forEach(([j,a_,b_])=>{const ry=y+200+j*130;wc_panel(ctx,x+24,ry,pw-48,110,{kind:"tag",seed:420+j});
      ctx.save();ctx.fillStyle=rgba(j?GV.cyanInk:OW_MEAN[0],0.85);ctx.fillRect(x+40,ry+22,10,66);ctx.restore();
      wc_T(ctx,a_,x+66,ry+50,{w:700,size:30,col:j?GV.cyanInk:OW_MEANINK[0]});wc_T(ctx,b_,x+66,ry+90,{w:600,size:28,col:WC_MUTED});});});}

/* ---------- every tool reads it ---------- */
// the 2019 tool's terms with an owner, flying across into the glossary's card; the rest dropping into an archive box
const OW_MOVE=[["enrolment","registrar's office"],["credit point","registrar's office"],["unit","the faculties"]];
function ow_flyCard(ctx,j,u){if(u<=0||u>=1.6)return;const e=easeCam(clamp(u,0,1)),x0=OW_BX.cx(4)-90,y0=OW_BX.top+150+j*10,x1=OW_BX.cx(0)-90+j*14,y1=OW_BX.top+200-j*18,
    x=lerp(x0,x1,e),y=lerp(y0,y1,e)-220*Math.sin(Math.PI*e),a=u<1?1:1-(u-1)/0.6;
  withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(0.06*Math.sin(e*5+j));wc_panel(ctx,0,0,190,84,{kind:"tag",seed:430+j});wc_T(ctx,OW_MOVE[j][0],16,36,{w:800,size:28,col:WC_DARK});
    ow_T(ctx,OW_MOVE[j][1],16,68,{size:20,col:WC_MUTED});ctx.restore();});}
// the archive box, at the foot of the board: cardboard, a label; the cards that drop into it
const OW_AB=[1500,690,230,150];
function ow_archive(ctx,a,drop){if(a<=0.01)return;const [x,y,w,h]=OW_AB;withA(ctx,a,()=>{wc_contact(ctx,x-10,x+w+10,y+h+4,0.9,0.3);
  for(let j=0;j<4;j++){const u=clamp((drop-j*0.18)/0.6,0,1);if(u<=0)continue;const yy=lerp(y-260,y+20,easeCam(u));ctx.save();ctx.beginPath();ctx.rect(x-40,-H,w+80,y+30+H);ctx.clip();
    wc_panel(ctx,x+30+j*22,yy,150,70,{kind:"tag",seed:440+j});gv_lines(ctx,x+46+j*22,yy+26,110,2,18,0.9);ctx.restore();}
  wc_wash(ctx,wc_rect(x,y+20,w,h-20),[196,160,112],{kind:"thing",lw:1.4,seed:451});wc_wash(ctx,wc_rect(x-6,y+8,w+12,26),[210,176,128],{kind:"thing",lw:1.3,seed:452});
  wc_flat(ctx,wc_rect(x+w/2-60,y+60,120,50),WC_CARD,1,"label");wc_T(ctx,"archive",x+w/2,y+95,{w:700,size:28,align:"center",col:WC_INK});});}
// Planning's spreadsheet on Clara's screen: its tab of definitions; award's cell becomes a link (u), and the term opens over it (op)
function ow_planSheet(ctx,x,y,w,h,u,op){ctx.save();ctx.fillStyle=rgba(GV.screen,1);ctx.fillRect(x,y,w,h);ctx.restore();ow_bar(ctx,x,y,w,44,"Planning · census 2026",[70,120,86],26);
  const gx=x+30,gy=y+80,cw=[300,w-360],rh=62;ctx.save();ctx.strokeStyle=rgba(WC_MUTED,0.3);ctx.lineWidth=1.5;for(let r=0;r<=7;r++){ctx.beginPath();ctx.moveTo(gx,gy+r*rh);ctx.lineTo(gx+cw[0]+cw[1],gy+r*rh);ctx.stroke();}
  for(const cx_ of [gx,gx+cw[0],gx+cw[0]+cw[1]]){ctx.beginPath();ctx.moveTo(cx_,gy);ctx.lineTo(cx_,gy+7*rh);ctx.stroke();}ctx.restore();
  wc_T(ctx,"term",gx+16,gy+42,{w:700,size:28,col:WC_MUTED});wc_T(ctx,"meaning",gx+cw[0]+16,gy+42,{w:700,size:28,col:WC_MUTED});
  const ry=gy+rh;wc_T(ctx,"award",gx+16,ry+42,{w:800,size:30,col:WC_DARK});
  withA(ctx,1-u,()=>wc_T(ctx,"graduate certificates, masters and doctorates",gx+cw[0]+16,ry+42,{w:600,size:28,col:OW_MEANINK[1]}));
  withA(ctx,u,()=>{const s="award · in the business glossary";wc_T(ctx,s,gx+cw[0]+16,ry+42,{w:700,size:28,col:GV.cyanInk});ctx.save();ctx.strokeStyle=rgba(GV.cyanInk,0.9);ctx.lineWidth=2.5;
    ctx.beginPath();ctx.moveTo(gx+cw[0]+16,ry+50);ctx.lineTo(gx+cw[0]+16+tw(ctx,s,28,700),ry+50);ctx.stroke();ctx.restore();});
  for(let r=2;r<7;r++)gv_lines(ctx,gx+16,gy+r*rh+28,cw[0]+cw[1]-60,1,0,0.7);
  // the tabs along the bottom
  [["census",0],["Definitions",1],["notes",0]].forEach(([s,on],i)=>{const tx=x+30+i*230;ctx.save();ctx.fillStyle=rgba(on?[255,255,255]:[226,230,236],1);ctx.fillRect(tx,y+h-56,220,48);ctx.restore();
    wc_T(ctx,s,tx+20,y+h-22,{w:on?800:600,size:28,col:on?WC_DARK:WC_MUTED});});
  if(op>0.01){const k=0.94+0.06*spring(op);ctx.save();ctx.translate(gx+cw[0]+80,ry+70);ctx.scale(k,k);withA(ctx,clamp(op*2,0,1),()=>{wc_panel(ctx,0,0,640,250,{kind:"card",seed:461});
    ow_head(ctx,14,14,612,56,0,1,{size:34,pad:18});["microcredentials, 6 credit points or more,","graduate certificates, masters and doctorates"].forEach((l,j)=>wc_T(ctx,l,24,112+j*40,{w:600,size:28,col:j?WC_INK:OW_MEANINK[0]}));
    wc_T(ctx,"owner · Mei Tanaka",24,204,{w:700,size:28,col:WC_INK});});ctx.restore();}}
// the policy on Mei's screen: the appendix's line struck through (s), and the new one written under it (p)
function ow_policyScreen(ctx,x,y,w,h,s,p){ctx.save();ctx.fillStyle=rgba(GV.screen,1);ctx.fillRect(x,y,w,h);ctx.restore();ow_bar(ctx,x,y,w,44,"Academic awards policy",[70,96,140],26);
  ctx.save();ctx.fillStyle=rgba([246,246,242],1);ctx.fillRect(x+150,y+64,w-300,h-80);ctx.restore();const px=x+190;
  wc_T(ctx,"Appendix B · Definitions",px,y+130,{w:800,size:34,col:WC_DARK});gv_lines(ctx,px,y+170,w-420,2,26,0.8);
  const old=["Award: a graduate certificate, master's degree","or doctorate conferred by the University."];old.forEach((l,i)=>wc_T(ctx,l,px,y+268+i*44,{w:600,size:30,col:mix(WC_INK,OW_MEANINK[1],0.6*s)}));
  if(s>0){ctx.save();ctx.strokeStyle=rgba(OW_MEANINK[1],0.9);ctx.lineWidth=3.5;ctx.lineCap="round";old.forEach((l,i)=>{const ww=tw(ctx,l,30,600)*clamp(s*2-i,0,1);if(ww<=0)return;ctx.beginPath();ctx.moveTo(px-4,y+258+i*44);ctx.lineTo(px-4+ww+8,y+256+i*44);ctx.stroke();});ctx.restore();}
  if(p>0){const t_="Award: as defined in the business glossary.",n=Math.ceil(t_.length*clamp(p,0,1));wc_T(ctx,t_.slice(0,n),px,y+394,{w:700,size:30,col:OW_MEANINK[0]});
    if(p>=1){const ww=tw(ctx,"business glossary",30,700),x0=px+tw(ctx,"Award: as defined in the ",30,700);ctx.save();ctx.strokeStyle=rgba(OW_MEANINK[0],0.8);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x0,y+402);ctx.lineTo(x0+ww,y+402);ctx.stroke();ctx.restore();}}
  gv_lines(ctx,px,y+450,w-420,4,26,0.8);}
// a faculty's dashboard on Anil's screen: awards by year, and its info panel; words: "own" (each faculty's own description) or
// "glossary" (the glossary's words, read from the platform, tagged)
function ow_dash(ctx,x,y,w,h,words,tag){ctx.save();ctx.fillStyle=rgba(GV.screen,1);ctx.fillRect(x,y,w,h);ctx.restore();ow_bar(ctx,x,y,w,30,"Faculty of Health · awards",[96,70,80],17);
  [0.46,0.55,0.52,0.66,0.72,0.7].forEach((v,j)=>wc_flat(ctx,wc_rect(x+24+j*34,y+230-v*150,24,v*150),j===5?OW_MEAN[2]:[170,190,210],1,"bar"));
  ctx.save();ctx.strokeStyle=rgba(WC_MUTED,0.5);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+18,y+232);ctx.lineTo(x+230,y+232);ctx.stroke();ctx.restore();
  const px=x+248,pw=w-262;ctx.save();ctx.fillStyle=rgba([244,244,236],1);ctx.strokeStyle=rgba(WC_MUTED,0.4);ctx.lineWidth=1.4;ctx.fillRect(px,y+44,pw,h-58);ctx.strokeRect(px,y+44,pw,h-58);ctx.restore();
  ow_T(ctx,"About this measure",px+12,y+72,{size:17,w:700,col:WC_MUTED});
  const L=words==="glossary"?[["award",800,OW_MEANINK[0]],["what counts:",600,WC_MUTED],["graduate certificates",600,WC_INK],["masters and doctorates",600,WC_INK],["microcredentials, 6",700,OW_MEANINK[0]],["credit points or more",700,OW_MEANINK[0]]]
    :[["Awards: degrees",600,WC_INK],["conferred this year.",600,WC_INK]];
  L.forEach(([l,wt,col],i)=>ow_T(ctx,l,px+12,y+102+i*25,{size:18,w:wt,col,max:pw-24}));
  if(tag>0.01)withA(ctx,tag,()=>{const s="from the glossary",sw=tw(ctx,s,17,700)+28;ctx.save();ctx.fillStyle=rgba(wc_lit(OW_MEAN[0],0.7),1);rr(ctx,px+12,y+h-50,sw,30,15);ctx.fill();ctx.restore();ow_T(ctx,s,px+26,y+h-29,{size:17,w:700,col:OW_MEANINK[0]});});}
// the data team's copy of award on Jun's screen: the words of its Awards table, as the glossary has them, where they came from and
// whose they are. o.m: the meaning they're in (0, the new words; 1, the words before Monday), in two lines, the second the part that
// changed on Monday; o.lit (0 to 1) lights where they came from; o.ring (0 to 1), a gold ring drawn round the part that changed, when the
// nightly check finds the copy out of date
const OW_DEF=[["A qualification the university confers, such as a graduate certificate,","a master or a microcredential, for at least 6 credit points."],
  ["A qualification the university confers, such as a graduate certificate","or a master, for a set number of credit points."]];
function ow_copy(ctx,x,y,w,h,o){o=o||{};const m=o.m||0,lit=o.lit||0;ctx.save();ctx.fillStyle=rgba([250,250,252],1);ctx.fillRect(x,y,w,h);ctx.restore();
  ow_bar(ctx,x,y,w,44,"Data team · Awards table",[60,64,78],26);ow_head(ctx,x+30,y+78,w-60,70,m,1,{size:44,pad:24});
  const L=OW_DEF[m],ly=y+212;L.forEach((l,j)=>wc_T(ctx,l,x+40,ly+j*50,{w:600,size:34,col:m?OW_MEANINK[1]:WC_INK}));
  if(o.ring>0){const rw=tw(ctx,L[1],34,600);ow_ring(ctx,x+40+rw/2,ly+40,rw/2+22,28,o.ring,GV.goldInk,507);}
  const ry=ly+L.length*50+60;if(lit>0)gv_tint(ctx,x+24,ry-42,w-48,58,GV.gold,0.55*lit);
  [["from","the business glossary"],["owner","Mei Tanaka, registrar's office"]].forEach(([k,v],i)=>{wc_T(ctx,k,x+40,ry+i*70,{w:600,size:30,col:WC_MUTED});wc_T(ctx,v,x+220,ry+i*70,{w:600,size:34,col:WC_DARK});});}
// a ring round a run of words, as a pencil draws it (p, 0 to 1): an ellipse, a little more than once round, its start overrun
function ow_ring(ctx,cx,cy,rx,ry,p,col,seed){if(p<=0)return;const n=56,pts=[];for(let i=0;i<=n;i++){const a=-2.3+TAU*1.07*i/n,k=1+0.025*Math.sin(i*0.7);pts.push([cx+Math.cos(a)*rx*k,cy+Math.sin(a)*ry*k]);}
  wc_pencil(ctx,pts,p,{col,lw:4.5,seed:seed||507});}
// the floor with the glossary in the middle: a card over the data governance office, and an arrow from it to each office's screen, one
// way (p: how far each has come)
const OW_SCR=[274,516,1042,1284,1810].map(x=>[x,519]);
function ow_floorCard(ctx,x,y,a,o){if(a<=0.01)return;o=o||{};const k=o.k||1;ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,a,()=>{wc_panel(ctx,-170,-58,340,116,{kind:"card",seed:471});
  ow_head(ctx,-156,-44,312,60,0,1,{size:40,pad:16});wc_T(ctx,"the business glossary",-150,44,{w:600,size:28,col:WC_INK});});ctx.restore();}
// (q, when given, sends a soft light along each arrow, one after another: a sync reaching every screen)
function ow_oneWay(ctx,x,y,p,a,q){if(a<=0.01)return;withA(ctx,a,()=>{OW_SCR.forEach(([sx,sy],i)=>{const u=clamp(p-i*0.08,0,1);if(u<=0)return;const ex=sx,ey=sy-34,x0=x+(sx-x)*0.12,y0=y+60;
  const pts=[];for(let j=0;j<=24;j++){const v=j/24*u;pts.push([lerp(x0,ex,v),lerp(y0,ey,v)-60*Math.sin(Math.PI*v)]);}
  ctx.save();ctx.strokeStyle=rgba(OW_MEANINK[0],0.85);ctx.lineWidth=4;ctx.setLineDash([10,9]);ctx.lineCap="round";ctx.beginPath();pts.forEach((q,j)=>j?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.stroke();ctx.restore();
  if(u>=1){const [ax,ay]=pts[pts.length-1],[bx,by]=pts[pts.length-3],an=Math.atan2(ay-by,ax-bx);ctx.save();ctx.translate(ax,ay);ctx.rotate(an);ctx.fillStyle=rgba(OW_MEANINK[0],0.95);ctx.beginPath();ctx.moveTo(4,0);ctx.lineTo(-16,-10);ctx.lineTo(-16,10);ctx.closePath();ctx.fill();ctx.restore();}
  const v=q==null?0:clamp(q-i*0.06,0,1);if(v>0&&v<1){const px=lerp(x0,ex,v),py=lerp(y0,ey,v)-60*Math.sin(Math.PI*v),f=Math.sin(Math.PI*v);
    wc_glowAt(ctx,px,py,42,wc_lit(OW_MEAN[0],0.6),0.85*f);ctx.save();ctx.fillStyle=rgba(wc_lit(OW_MEAN[0],0.25),f);ctx.beginPath();ctx.arc(px,py,9,0,TAU);ctx.fill();ctx.restore();}});});}
// a small "award" on an office's screen, in violet, as it reads the glossary's words
function ow_screenWord(ctx,i,a){if(a<=0.01)return;const [x,y]=OW_SCR[i];withA(ctx,a,()=>{ctx.save();ctx.fillStyle=rgba(wc_lit(OW_MEAN[0],0.55),1);ctx.fillRect(x-40,y-21,80,40);ctx.restore();
  wc_T(ctx,"award",x,y+8,{w:800,size:22,align:"center",col:OW_MEANINK[0],deco:1});});}

/* ---------- when a word changes ---------- */
// a dashboard without a nightly check: awards a month, and the step where the new meaning arrived unannounced; q (0 to 1) asks about it
function ow_stepChart(ctx,x,y,w,h,p,q){ctx.save();ctx.fillStyle=rgba(GV.screen,1);ctx.fillRect(x,y,w,h);ctx.restore();ow_bar(ctx,x,y,w,44,"Awards conferred, by month",[96,70,80],26);
  const gx=x+90,gy=y+90,gw=w-180,gh=h-200,n=12;ctx.save();ctx.strokeStyle=rgba(WC_MUTED,0.35);ctx.lineWidth=1.5;for(let r=0;r<=4;r++){ctx.beginPath();ctx.moveTo(gx,gy+gh*r/4);ctx.lineTo(gx+gw,gy+gh*r/4);ctx.stroke();}ctx.restore();
  const v=i=>0.42+0.03*Math.sin(i*1.7)+(i>=8?0.2:0),pts=[];for(let i=0;i<n;i++)pts.push([gx+gw*i/(n-1),gy+gh*(1-v(i))]);const m=Math.max(1,Math.round(1+(n-1)*clamp(p,0,1)));
  ctx.save();ctx.strokeStyle=rgba([96,70,80],0.95);ctx.lineWidth=5;ctx.lineJoin="round";ctx.beginPath();for(let i=0;i<m;i++)i?ctx.lineTo(pts[i][0],pts[i][1]):ctx.moveTo(pts[i][0],pts[i][1]);ctx.stroke();
  for(let i=0;i<m;i++){ctx.fillStyle=rgba([96,70,80],1);ctx.beginPath();ctx.arc(pts[i][0],pts[i][1],6,0,TAU);ctx.fill();}ctx.restore();
  ["Jan","Mar","May","Jul","Sep","Nov"].forEach((s,i)=>wc_T(ctx,s,gx+gw*(i*2)/(n-1),gy+gh+44,{w:600,size:28,align:"center",col:WC_MUTED}));
  if(q>0){const [sx,sy]=pts[8];gv_halo(ctx,sx-60,sy-40,120,160,GV.red,0.6*q);const k=spring(q);ctx.save();ctx.translate(sx+64,sy+10);ctx.scale(k,k);wc_T(ctx,"?",0,0,{w:800,size:84,align:"center",col:GV.redInk});ctx.restore();}}
// Monday's change notice, which the nightly check sends: its title; what changed, the old words struck and the new in bold; what the
// new words touch, with each part's owner as it's named (o.rows[]); and who signs, the meaning's owner and data governance (o.owners)
const OW_NT={x:360,y:96,w:1200,h:700,rows:[["learners near an award","Planning"],["wallet app","Wallet app team"],["census dashboard","Planning"]],own:[["the meaning","Mei Tanaka"],["the term still applies","data governance"]]};
function ow_notice(ctx,x,y,w,o){o=o||{};const h=OW_NT.h;wc_panel(ctx,x,y,w,h,{kind:"card",seed:481});wc_T(ctx,"Change notice · award",x+28,y+64,{w:800,size:36,col:WC_DARK});
  // what changed: the old words and the new, the parts that differ struck in the old words' rose and set in the new words' violet
  const c=o.changed||0;if(c>0.01)withA(ctx,c,()=>{wc_T(ctx,"what changed",x+28,y+130,{w:700,size:28,col:WC_MUTED});
    [["was",[["…or a master, for ",0],["a set number of",-1],[" credit points",0]]],["now",[["…a master or ",0],["a microcredential",1],[", for ",0],["at least 6",1],[" credit points",0]]]].forEach(([lab,seg],j)=>{
      const yy=y+180+j*46;wc_T(ctx,lab,x+28,yy,{w:600,size:28,col:WC_MUTED});let xx=x+100;
      seg.forEach(([s,k])=>{const wt=k>0?800:600,ww=tw(ctx,s,30,wt);wc_T(ctx,s,xx,yy,{w:wt,size:30,col:k<0?OW_MEANINK[1]:k>0?OW_MEANINK[0]:j?WC_INK:WC_MUTED});
        if(k<0){ctx.save();ctx.strokeStyle=rgba(OW_MEANINK[1],0.9);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(xx,yy-10);ctx.lineTo(xx+ww,yy-11);ctx.stroke();ctx.restore();}xx+=ww;});});});
  const t_=o.touch||0;if(t_>0.01)withA(ctx,t_,()=>wc_T(ctx,"what the new words touch",x+28,y+292,{w:700,size:28,col:WC_MUTED}));
  const rows=o.rows||[];OW_NT.rows.forEach(([a,b],i)=>{const u=rows[i]||0;if(u<=0.01)return;const yy=y+342+i*58;
    withA(ctx,u,()=>{ctx.save();ctx.translate(16*(1-u),0);ctx.fillStyle=rgba(GV.cyanInk,0.8);ctx.beginPath();ctx.arc(x+40,yy-10,6,0,TAU);ctx.fill();
      wc_T(ctx,a,x+62,yy,{w:700,size:30,col:WC_DARK});wc_T(ctx,b,x+w-28,yy,{w:600,size:28,align:"right",col:WC_MUTED});ctx.restore();});});
  const ow_=o.owners||0;if(ow_>0.01)withA(ctx,ow_,()=>{ctx.save();ctx.strokeStyle=rgba(WC_MUTED,0.35);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+28,y+508);ctx.lineTo(x+w-28,y+508);ctx.stroke();ctx.restore();
    wc_T(ctx,"who signs",x+28,y+554,{w:700,size:28,col:WC_MUTED});
    OW_NT.own.forEach(([a,b],i)=>{const yy=y+604+i*50;wc_T(ctx,a,x+28,yy,{w:600,size:28,col:WC_INK});wc_T(ctx,b,x+w-28,yy,{w:700,size:28,align:"right",col:i?GV.goldInk:OW_MEANINK[0]});});});}
// a stylus, its tip at (x, y), held as a right hand holds a pen
function ow_pen(ctx,x,y){ctx.save();ctx.translate(x,y);ctx.rotate(-0.8);ctx.fillStyle=rgba([196,198,208],1);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(14,-5);ctx.lineTo(14,5);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba(GV_SIGN.ink,0.95);rr(ctx,13,-5,70,10,5);ctx.fill();ctx.restore();}
// Mei's screen on Tuesday morning: the notice, where her words go, and her line, which she signs with a stylus (sign: 0 to 1 as her
// name is written in; ok: 0 to 1, the tick once it's signed)
function ow_signNotice(ctx,x,y,w,h,o){o=o||{};ctx.save();ctx.fillStyle=rgba(GV.screen,1);ctx.fillRect(x,y,w,h);ctx.restore();ow_bar(ctx,x,y,w,30,"Change notice · award",[60,64,78],17);
  ow_T(ctx,"your words go to:",x+20,y+62,{size:17,col:WC_MUTED});
  OW_NT.rows.forEach(([a],i)=>{const g=o.glow?o.glow[i]||0:0,yy=y+96+i*34;if(g>0)gv_tint(ctx,x+12,yy-24,w-24,32,GV.green,0.6*g);ow_T(ctx,"· "+a,x+20,yy,{size:19,w:700,col:WC_DARK});});
  const ly=y+h-48,sx=x+122,sg=o.sign||0,nm="Mei Tanaka";ow_T(ctx,"signed",x+20,ly,{size:17,col:WC_MUTED});
  ctx.save();ctx.strokeStyle=rgba(WC_MUTED,0.55);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(sx-8,ly+8);ctx.lineTo(sx+250,ly+8);ctx.stroke();ctx.restore();
  if(sg>0){wc_hand(ctx,nm,sx,ly,{size:28,w:600,col:GV_SIGN.ink,p:sg});if(sg<1)ow_pen(ctx,sx+tw(ctx,nm.slice(0,Math.ceil(nm.length*sg)),28,600)-4,ly-6);}
  if(o.ok>0)wc_tick(ctx,sx+300,ly-12,36,GV.greenInk,o.ok,5);}
// Jun's screen: the notice's new words, the number in them underlined, the notice's note, and the business rule that keeps the number
// in one place (card: 0 to 1 as it comes in; green: 0 to 1 once it's the rule; read: 0 to 1, its line that every report reads it)
function ow_ruleScreen(ctx,x,y,w,h,o){o=o||{};ctx.save();ctx.fillStyle=rgba([250,250,252],1);ctx.fillRect(x,y,w,h);ctx.restore();ow_bar(ctx,x,y,w,44,"Change notice · award · the words",[60,64,78],26);
  const s0="…a master or a microcredential, for at least ",s1="6 credit points",s2=".",yy=y+120;let xx=x+40;wc_T(ctx,s0,xx,yy,{w:600,size:30,col:WC_INK});xx+=tw(ctx,s0,30,600);
  wc_T(ctx,s1,xx,yy,{w:800,size:30,col:WC_DARK});const uw=tw(ctx,s1,30,800),gr=o.green||0;wc_T(ctx,s2,xx+uw,yy,{w:600,size:30,col:WC_INK});
  if(o.under>0)ow_under(ctx,xx-2,yy+12,uw+4,mix(GV.goldInk,GV.greenInk,gr),o.under,5);
  if(o.note>0.01)withA(ctx,o.note,()=>{ctx.save();ctx.translate(14*(1-o.note),0);wc_panel(ctx,x+40,yy+46,700,70,{kind:"tag",seed:491,wash:GV.gold,washA:0.3});
    wc_T(ctx,"a number in the meaning: a rule?",x+64,yy+92,{w:600,size:28,col:WC_INK});ctx.restore();});
  const cd=o.card||0;if(cd<=0.01)return;const cx=x+40,cy=y+262,cw=w-80,ch=392,e=easeCam(clamp(cd,0,1));
  withA(ctx,clamp(cd*1.6,0,1),()=>{ctx.save();ctx.translate(0,44*(1-e));wc_panel(ctx,cx,cy,cw,ch,{kind:"card",seed:497});
    if(gr>0)gv_tint(ctx,cx+14,cy+14,cw-28,64,GV.green,0.5*gr);wc_T(ctx,"Business rule · award",cx+28,cy+58,{w:700,size:30,col:mix(WC_MUTED,GV.greenInk,gr)});
    // the rule, its number in the new meaning's ink, as the words have it
    const r0="A microcredential counts as an award from ",r1="6 credit points",r2=".",ry=cy+140;let rx=cx+28;wc_T(ctx,r0,rx,ry,{w:600,size:36,col:WC_DARK});rx+=tw(ctx,r0,36,600);
    wc_T(ctx,r1,rx,ry,{w:800,size:36,col:OW_MEANINK[0]});wc_T(ctx,r2,rx+tw(ctx,r1,36,800),ry,{w:600,size:36,col:WC_DARK});
    wc_T(ctx,"owner",cx+28,cy+228,{w:600,size:30,col:WC_MUTED});wc_T(ctx,"Mei Tanaka, registrar's office",cx+200,cy+228,{w:600,size:32,col:WC_DARK});
    const rd=o.read||0;if(rd>0.01)withA(ctx,rd,()=>{ctx.save();ctx.translate(14*(1-rd),0);wc_T(ctx,"read by",cx+28,cy+306,{w:600,size:30,col:WC_MUTED});
      wc_T(ctx,"every report that counts awards",cx+200,cy+306,{w:600,size:32,col:WC_DARK});ctx.restore();});ctx.restore();});}

/* ---------- agreed by people ---------- */
// the workshop's notes on the meeting room's whiteboard: big enough to read when the camera is close; circled (0 to 1) when agreed
// (at and sc move and shrink a note as it flies to the screen)
const OW_WN=[["a micro-","credential?",GV_NOTE[0],[245,262],-0.04],["3 points?","",GV_NOTE[1],[322,452],0.05],["6 points?","",GV_NOTE[2],[494,452],-0.03]];
function ow_wsNote(ctx,j,a,ring,at,sc){if(a<=0.01)return;const [l1,l2,col,p0,rot]=OW_WN[j],[x,y]=at||p0,s=136,k=(0.9+0.1*spring(a))*(sc||1);ctx.save();ctx.translate(x,y);ctx.scale(k,k);ctx.rotate(rot);withA(ctx,clamp(a*2,0,1),()=>{
  ctx.fillStyle="rgba(70,60,50,0.16)";ctx.fillRect(-s/2+3,-s/2+5,s,s);wc_wash(ctx,wc_rect(-s/2,-s/2,s,s),col,{kind:"swatch",seed:500+j});
  const d=sc&&sc<1?1:0;ow_hand(ctx,l1,-s/2+8,l2?-8:8,{size:23,col:WC_DARK,deco:d});if(l2)ow_hand(ctx,l2,-s/2+8,24,{size:23,col:WC_DARK,deco:d});});ctx.restore();
  if(ring>0)wc_ring(ctx,x,y+2,92,80,ring,{col:GV.goldInk,lw:4});}
// handwriting as wc_hand writes it, that can be marked as decoration (a note in flight, already read on the board)
function ow_hand(ctx,s,x,y,o){ctx.save();ctx.translate(x,y);ctx.transform(1,0,-0.2,1,0,0);wc_T(ctx,s,0,0,{size:o.size||32,w:o.w||600,col:o.col,deco:o.deco});ctx.restore();}
// the agreed words, written on the last note: "at least 6"
function ow_wsAgreed(ctx,a){if(a<=0.01)return;const [x,y]=OW_WN[2][3];withA(ctx,a,()=>wc_hand(ctx,"at least 6",x+100,y+12,{size:26,col:GV.goldInk}));}
// the glossary's term on the meeting room's screen (GV_MT.screen): the words before the workshop, then what it agreed (nw, 0 to 1),
// lit where the workshop's words went in (g)
function ow_meetTerm(ctx,g,nw){const [sx,sy,sw,sh]=GV_MT.screen;nw=nw||0;ctx.save();ctx.fillStyle=rgba(GV.screen,1);ctx.fillRect(sx,sy,sw,sh);ctx.restore();ow_bar(ctx,sx,sy,sw,30,"Business glossary",[70,96,140],17);
  ow_head(ctx,sx+12,sy+40,sw-24,48,0,1,{size:30});
  const L0=["A qualification the university confers,","such as a graduate certificate","or a master,","for a set number of credit points."],
    L1=["A qualification the university confers,","such as a graduate certificate, a master","or a microcredential,","for at least 6 credit points."];
  L1.forEach((l,i)=>{const yy=sy+120+i*34,o={size:22,w:i===3?700:400,col:WC_INK},lit=g>0.01&&i>=2;if(lit)gv_tint(ctx,sx+14,yy-26,tw(ctx,l,22,o.w)+16,34,GV.gold,0.7*g);
    if(L0[i]===l){ow_T(ctx,l,sx+20,yy,o);return;}if(nw<0.99)withA(ctx,1-nw,()=>ow_T(ctx,L0[i],sx+20,yy,o));
    if(nw>0.01)withA(ctx,nw,()=>ow_T(ctx,l,sx+20,yy,Object.assign({},o,{col:lit&&g>0.5?GV.goldInk:WC_INK})));});
  ow_T(ctx,"owner · Mei Tanaka",sx+20,sy+270,{size:19,col:WC_MUTED});}
// Clara's spreadsheet's Definitions tab, on Planning's wall screen (GV_PL.screen): the definitions she wrote
function ow_planDefs(ctx){const [sx,sy,sw,sh]=GV_PL.screen;ctx.save();ctx.fillStyle=rgba(GV.screen,1);ctx.fillRect(sx,sy,sw,sh);ctx.restore();ow_bar(ctx,sx,sy,sw,42,"Planning · Definitions",[70,120,86],25);
  [["award","graduate certificates, masters…"],["census date","the day the count is taken"],["load","credit points a term"],["near an award","within 15 credit points"]].forEach(([a,b],i)=>{const yy=sy+100+i*76;
    ctx.save();ctx.strokeStyle=rgba(WC_MUTED,0.3);ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(sx+16,yy+26);ctx.lineTo(sx+sw-16,yy+26);ctx.stroke();ctx.restore();
    ow_T(ctx,a,sx+24,yy,{size:27,w:800,col:WC_DARK});ow_T(ctx,b,sx+262,yy,{size:25,col:WC_INK,max:sw-282});});}
// a faculty's dashboard with the descriptions Anil wrote, on his screen (GV_FX.screen)
function ow_anilDefs(ctx){const [sx,sy,sw,sh]=GV_FX.screen;ctx.save();ctx.fillStyle=rgba(GV.screen,1);ctx.fillRect(sx,sy,sw,sh);ctx.restore();ow_bar(ctx,sx,sy,sw,32,"Faculty of Health · about these measures",[96,70,80],18);
  [["intake","new learners, each February and July"],["award","degrees conferred this year"],["load","credit points a learner takes"]].forEach(([a,b],i)=>{const yy=sy+82+i*82;
    ctx.save();ctx.fillStyle=rgba([244,244,236],1);ctx.fillRect(sx+14,yy-30,sw-28,72);ctx.restore();ow_T(ctx,a,sx+28,yy,{size:21,w:800,col:WC_DARK});ow_T(ctx,b,sx+28,yy+28,{size:19,col:WC_INK,max:sw-56});});}
// a card held in both hands, gold, "thank you" on it
function ow_heldThanks(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my-10);cx.rotate(-0.05);cx.fillStyle="rgba(60,40,10,0.2)";rr(cx,-112,-70,230,150,10);cx.fill();
  cx.fillStyle=rgba([250,226,150],1);rr(cx,-118,-78,236,150,10);cx.fill();cx.strokeStyle=rgba(GV.goldInk,0.7);cx.lineWidth=3;rr(cx,-106,-66,212,126,6);cx.stroke();
  cx.fillStyle=rgba(GV.goldInk,1);cx.textAlign="center";cx.font=font(800,46);cx.fillText("thank you",0,12);cx.restore();fingers(cx,P_,[[mx-110,my+30],[mx+110,my+26]]);}
// the glossary on the meeting room's screen close: its terms, and the keepers' best definitions coming in with their names (u[])
function ow_glossList(ctx,u){const [x,y,w,h]=OW_MS;ctx.save();ctx.fillStyle=rgba(GV.screen,1);ctx.fillRect(x,y,w,h);ctx.restore();ow_bar(ctx,x,y,w,56,"Business glossary · on the platform",[70,96,140],32);
  [["award","Mei Tanaka, registrar's office"],["credential","Mei Tanaka, registrar's office"],["learner","data governance"]].forEach(([a,b],i)=>{const yy=y+152+i*116;
    wc_T(ctx,a,x+64,yy,{w:800,size:40,col:i?WC_DARK:OW_MEANINK[0]});wc_T(ctx,b,x+560,yy,{w:600,size:34,col:WC_MUTED});ctx.save();ctx.strokeStyle=rgba(WC_MUTED,0.25);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+40,yy+40);ctx.lineTo(x+w-40,yy+40);ctx.stroke();ctx.restore();});
  [["census date","from Planning's sheet · Clara Jensen"],["intake","from the Faculty of Health · Anil Kurian"]].forEach(([a,b],i)=>{const v=u[i]||0;if(v<=0.01)return;const e=easeCam(clamp(v,0,1)),yy=y+152+(3+i)*116;
    withA(ctx,clamp(v*2,0,1),()=>{ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.translate(lerp(w*0.6,0,e),0);gv_tint(ctx,x+40,yy-60,w-80,96,GV.gold,0.5*(1-fin(v,1.6,1)));
      wc_T(ctx,a,x+64,yy,{w:800,size:40,col:WC_DARK});wc_T(ctx,b,x+560,yy,{w:700,size:34,col:GV.goldInk});ctx.restore();});});}

/* ---------- one word, one home ---------- */
// binder 12, open on Yusuf's desk (from above): policy 12's lines, 12.4 ticked (p), and what he writes beside it (hand)
function ow_binder12(ctx,x,y,p,hand){const w=1180,h=760;ctx.save();ctx.translate(x,y);ctx.save();ctx.filter="blur(16px)";ctx.fillStyle="rgba(60,40,20,0.3)";ctx.fillRect(14,22,w,h);ctx.restore();
  wc_wash(ctx,wc_rect(-20,-16,w+40,h+32),[96,118,150],{kind:"cover",lw:1.6,seed:511});for(const px of [0,w/2+12])gv_sheet(ctx,px,0,w/2-12,h);
  for(let i=0;i<4;i++){ctx.fillStyle=rgba([150,154,166],1);ctx.beginPath();ctx.arc(w/2,140+i*160,13,0,TAU);ctx.fill();}
  wc_T(ctx,"Data policies",60,110,{w:600,size:28,col:WC_MUTED,deco:1});wc_T(ctx,"Policy 12",60,210,{w:800,size:66,col:WC_DARK});wc_T(ctx,"Data definitions",60,270,{w:700,size:36,col:WC_INK});
  gv_lines(ctx,60,330,w/2-160,4,30,0.8);
  const R=w/2+60,L=[["12.1","Each term has a named owner."],["12.2","Each term used in a report is in the glossary."],["12.3","Terms about people are marked as personal data."],["12.4","Reports count by the glossary's definitions."],["12.5","Each term's owner decides its definition, and how it maps to the government's."],["12.6","Each decision is written down with the term."],["12.7","Staff take care to use terms correctly."]];
  L.forEach(([n,s],i)=>{const yy=110+i*92+(i>3?48:0),on=i===3;if(on){gv_tint(ctx,R-20,yy-40,w/2-60,72,GV.green,0.45*p);wc_T(ctx,n,R,yy,{w:800,size:30,col:WC_DARK});
      ow_wrap(ctx,s,30,w/2-200,700).forEach((l,j)=>wc_T(ctx,l,R+80,yy+j*38,{w:700,size:30,col:WC_DARK}));}
    else{wc_T(ctx,n,R,yy,{w:700,size:22,col:WC_MUTED,deco:1});gv_lines(ctx,R+70,yy-12,w/2-220,1,0,0.9);}});
  if(p>0)wc_tick(ctx,w-70,110+3*92-6,52,GV.greenInk,p,6);if(hand>0)wc_hand(ctx,"one glossary, on the platform",R+80,110+3*92+92,{size:30,col:GV.greenInk,p:hand});ctx.restore();}

/* ---------- the places ---------- */
// the screen desks close, by room; the data team's at night; the faculty's dashboard close
// at night the screen is the room's one light: lit itself, with a bloom round it and its spill on the desk
function ow_paintNightScreen(ctx){gv_paintScreenDesk(ctx,GV_ROOM.data);ow_night(ctx,0.9);const [sx,sy,sw,sh]=GV_SC;
  ctx.save();ctx.beginPath();ctx.rect(-W,-H,3*W,3*H);ctx.rect(sx,sy,sw,sh);ctx.clip("evenodd");ctx.globalCompositeOperation="screen";
  wc_glowAt(ctx,sx+sw/2,sy+sh/2,sw*0.72,[96,104,160],0.5);wc_glowAt(ctx,sx+sw/2,H+40,sw*0.55,[110,116,168],0.45);ctx.restore();
  ctx.save();const g=ctx.createLinearGradient(0,sy,0,sy+sh);g.addColorStop(0,rgba([136,146,188],1));g.addColorStop(1,rgba([114,122,164],1));ctx.fillStyle=g;ctx.fillRect(sx,sy,sw,sh);ctx.restore();}
function ow_paintNightRoom(ctx){gv_paintData(ctx);ow_night(ctx,0.92,[200,250,26]);}
const WC_PLACES={road:ow_paintRoad,gate:ow_paintGate,slips:ow_paintSlips,county:ow_paintOffice,countyTables:ow_paintOfficeTables,boardThen:ow_paintBoardThen,
  boardFound:ow_paintBoardFound,floor:gv_paintFloor,regClose:gv_paintRegistrarClose,regDesk:gv_paintRegistrarDesk,boardGov:c=>gv_paintBoardClose(c,GV_ROOM.gov),
  screenGov:c=>gv_paintScreenDesk(c,GV_ROOM.gov),meeting:gv_paintMeeting,meetingTable:gv_paintMeetingTable,meetScreen:ow_paintMeetScreen,
  screenPlan:c=>gv_paintScreenDesk(c,GV_ROOM.plan),screenReg:c=>gv_paintScreenDesk(c,GV_ROOM.reg),faculty:gv_paintFaculty,facultyDesk:gv_paintFacultyDesk,
  dataNight:ow_paintNightRoom,screenNight:ow_paintNightScreen,screenData:c=>gv_paintScreenDesk(c,GV_ROOM.data),screenFac:c=>gv_paintScreenDesk(c,GV_ROOM.fac),
  planning:gv_paintPlanning,desk:gv_paintDesk};
