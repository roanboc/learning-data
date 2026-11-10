/* ===== The hidden factory: the bench's own pieces =====
   What this film lays on the quality bench, in the module's look: sheets of paper drawn on in pencil (Redman's two teams and the
   room behind the second, Feigenbaum's line and its second line that redoes the parts, the fishbone), the team's calendar, bars of
   hours, stopwatches, the copy against the list, Beatriz's record, the five whys, the tools' pages (Databricks' system tables and
   lineage, dbt's checks) and the scorecard. Pencil means nothing: it is graphite. Steel blue is a measure, brass what good means for
   this use, and the verdicts are the module's. Every word is drawn with dq_T or hf_hand, at least 28 px as seen.
     hf_sheet(ctx, x, y, w, h, o)          a sheet of paper on the granite (o.a, o.k, o.rot)
     hf_pBox(ctx, x, y, w, h, p, o)        a box drawn in pencil, its outline drawn on as p goes 0 to 1
     hf_pLine(ctx, pts, p, o)              a pencil line through the points, drawn on as p goes 0 to 1; o.arrow
     hf_pText(ctx, s, x, y, o)             pencil words: hf_hand in graphite
     hf_bar(ctx, x, y, w, label, o)        a bar of hours in steel, w long, its label after it (o.k grows it, o.a)
     hf_watch(ctx, x, y, r, min, o)        a stopwatch, its hand at min minutes of an hour's dial (o.u turns it on)
     hf_fishbone(ctx, s)                   the fishbone, drawn on as it's said (HF_FB) */

const HF_PENCIL=HF.pencil;
function hf_sheet(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;if(o.rot){ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot);ctx.translate(-x-w/2,-y-h/2);}
  dq_card(ctx,x,y,w,h,{on:"granite",r:4});const g=ctx.createLinearGradient(x,0,x+w,0);g.addColorStop(0,"rgba(120,90,50,0.07)");g.addColorStop(1,"rgba(255,250,236,0.1)");ctx.fillStyle=g;ctx.fillRect(x,y,w,h);ctx.restore();}
function hf_pBox(ctx,x,y,w,h,p,o){o=o||{};if(p<=0)return;const per=2*(w+h),L=per*clamp(p,0,1),pts=[[x,y],[x+w,y],[x+w,y+h],[x,y+h],[x,y]];ctx.save();ctx.globalAlpha*=o.a==null?1:o.a;
  ctx.strokeStyle=rgba(o.col||HF_PENCIL,0.9);ctx.lineWidth=o.lw||3.5;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(x,y);let left=L;
  for(let i=1;i<pts.length&&left>0;i++){const [ax,ay]=pts[i-1],[bx,by]=pts[i],d=Math.hypot(bx-ax,by-ay),u=Math.min(1,left/d);ctx.lineTo(ax+(bx-ax)*u,ay+(by-ay)*u);left-=d;}ctx.stroke();ctx.restore();}
function hf_pLine(ctx,pts,p,o){o=o||{};if(p<=0)return;let tot=0;for(let i=1;i<pts.length;i++)tot+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);let left=tot*clamp(p,0,1),ex=pts[0][0],ey=pts[0][1],dx=1,dy=0;
  ctx.save();ctx.globalAlpha*=o.a==null?1:o.a;ctx.strokeStyle=rgba(o.col||HF_PENCIL,0.9);ctx.lineWidth=o.lw||3.5;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(ex,ey);
  for(let i=1;i<pts.length&&left>0;i++){const [ax,ay]=pts[i-1],[bx,by]=pts[i],d=Math.hypot(bx-ax,by-ay),u=Math.min(1,left/d);ex=ax+(bx-ax)*u;ey=ay+(by-ay)*u;dx=(bx-ax)/d;dy=(by-ay)/d;ctx.lineTo(ex,ey);left-=d;}ctx.stroke();
  if(o.arrow&&p>=0.98){const s=o.arrow;ctx.beginPath();ctx.moveTo(ex-dx*s-dy*s*0.6,ey-dy*s+dx*s*0.6);ctx.lineTo(ex,ey);ctx.lineTo(ex-dx*s+dy*s*0.6,ey-dy*s-dx*s*0.6);ctx.stroke();}ctx.restore();}
function hf_pText(ctx,s,x,y,o){hf_hand(ctx,s,x,y,Object.assign({col:HF_PENCIL,size:32,w:500},o||{}));}
function hf_bar(ctx,x,y,w,label,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const k=o.k==null?1:clamp(o.k,0,1),h=o.h||40;ctx.save();ctx.globalAlpha*=a;
  ctx.fillStyle=rgba(o.col?dq_tone(o.col).col:DQ.steel,o.fill==null?1:o.fill);rr(ctx,x,y,Math.max(2,w*k),h,6);ctx.fill();
  if(label&&k>0.6)dq_T(ctx,label,x+w*k+20,y+h/2+10,{w:700,size:30,col:o.lcol||"steel",dark:o.dark,a:ag_in(k,0.6,0.4)});ctx.restore();}
function hf_watch(ctx,x,y,r,min,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const u=o.u==null?1:clamp(o.u,0,1);ctx.save();ctx.globalAlpha*=a;
  ctx.fillStyle=rgba(DQ.graphite,1);ctx.fillRect(x-10,y-r-26,20,18);ctx.beginPath();ctx.arc(x,y-r-30,12,0,TAU);ctx.fill();
  ctx.save();ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=20;ctx.shadowOffsetX=-6;ctx.shadowOffsetY=8;ctx.fillStyle=rgba(DQ.graphite,1);ctx.beginPath();ctx.arc(x,y,r+12,0,TAU);ctx.fill();ctx.restore();
  ctx.fillStyle=rgba(DQ.paper,1);ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
  ctx.strokeStyle=rgba(DQ.soft,0.8);ctx.lineWidth=2;for(let k=0;k<60;k++){const an=-Math.PI/2+k*TAU/60,l=k%5?6:14;ctx.beginPath();ctx.moveTo(x+Math.cos(an)*(r-4),y+Math.sin(an)*(r-4));ctx.lineTo(x+Math.cos(an)*(r-4-l),y+Math.sin(an)*(r-4-l));ctx.stroke();}
  // the minutes it took, swept in steel, and the hand
  const an1=-Math.PI/2+TAU*min/60*u;ctx.fillStyle=rgba(DQ.steel,0.28);ctx.beginPath();ctx.moveTo(x,y);ctx.arc(x,y,r-20,-Math.PI/2,an1);ctx.closePath();ctx.fill();
  ctx.strokeStyle=rgba(DQ.steel,1);ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(an1)*(r-18),y+Math.sin(an1)*(r-18));ctx.stroke();
  ctx.fillStyle=rgba(DQ.graphite,1);ctx.beginPath();ctx.arc(x,y,8,0,TAU);ctx.fill();ctx.restore();}

/* ---------------------------------------------------------------- the fishbone
   A large sheet on the bench, drawn in pencil as it's said: the problem at the head, on the right; the spine running left to its tail;
   two bones above and two below, each named at its end; and the causes, each a small card pinned to its bone by a short pencil line,
   its count in steel, a measure. HF_FB holds where each bone meets the spine and where it ends, and where each cause's card lies.
     hf_cause(ctx, x, y, w, c, o)     a cause's card: c.t (what), c.s (more, soft), c.n (its count, in steel; o.n 0 to 1 brings it in)
     hf_fishbone(ctx, s)              the whole sheet, each part brought in by s: sheet, spine, head, bones {people, ...}, note, cards
                                      {pa, ...}, counts {pa, ...}, line (the words along the spine), owners {pa, ...} (ch 7) */
const HF_FB={spine:[120,455,1440],head:[1440,361,400],
  bones:{people:[[640,455],[360,92]],process:[[1240,455],[960,92]],systems:[[640,455],[360,818]],interfaces:[[1240,455],[960,818]]},
  causes:{pa:{bone:"people",x:465,y:110,w:500,t:"paper forms before 2015",s:"one box for the whole name",n:"35 swapped",own:"registrar's office"},
    pb:{bone:"people",x:600,y:300,w:420,t:"names typed by hand",n:"14 spellings",own:"registrar's office"},
    pr:{bone:"process",x:1065,y:130,w:520,t:"every fix made in a copy",s:"no way back",own:"registrar's office"},
    sa:{bone:"systems",x:600,y:488,w:440,t:"family name field",s:"30 characters",n:"39 cut",own:"student system team"},
    sb:{bone:"systems",x:455,y:668,w:460,t:"online form until 2019",s:"A to Z, in capitals",n:"312 names",own:"registrar's office"},
    in:{bone:"interfaces",x:1100,y:600,w:560,t:"nightly file",s:"old encoding · é → e",n:"143 lost on the way in",own:"student system team · with Sam"}}};
function hf_cause(ctx,x,y,w,c,o){o=o||{};const a=o.a==null?1:o.a,h=c.s&&c.n?152:c.s||c.n?114:76,bb={x,y,w,h};if(a<=0.01)return bb;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));dq_card(ctx,x,y,w,h,{fill:"rgb(253,251,246)"});
  dq_T(ctx,c.t,x+26,y+48,{w:700,size:30,col:DQ.ink});let yy=y+48;if(c.s){yy+=38;dq_T(ctx,c.s,x+26,yy,{w:500,size:28,col:DQ.soft});}
  if(c.n){yy+=40;dq_T(ctx,c.n,x+26,yy,{w:800,size:30,col:"steel",a:o.n==null?1:clamp(o.n,0,1)});}
  ctx.restore();return bb;}
function hf_fishbone(ctx,s){const F=HF_FB,[x0,y,x1]=F.spine,sa=s.sheet==null?1:s.sheet;if(sa<=0.01)return;ctx.save();ctx.globalAlpha*=sa;
  hf_sheet(ctx,30,26,1860,856,{rot:-0.002});
  hf_pLine(ctx,[[x1,y],[x0,y]],s.spine||0,{lw:5});hf_pLine(ctx,[[x0+40,y],[x0-10,y-62]],ag_sine(((s.spine||0)-0.8)/0.2),{lw:4});hf_pLine(ctx,[[x0+40,y],[x0-10,y+62]],ag_sine(((s.spine||0)-0.85)/0.15),{lw:4});
  // the head: the problem, on a card with a pencil outline round it
  const ha=s.head||0;if(ha>0){const [hx,hy,hw]=F.head,hh=188;dq_card(ctx,hx,hy,hw,hh,{a:ha,fill:"rgb(253,251,246)"});ctx.save();ctx.globalAlpha*=ha;
    dq_T(ctx,"THE PROBLEM",hx+28,hy+52,{w:800,size:28,ls:4,col:DQ.soft});dq_T(ctx,"a name wrong",hx+28,hy+110,{w:700,size:36});dq_T(ctx,"on the list",hx+28,hy+156,{w:700,size:36});ctx.restore();
    hf_pBox(ctx,hx-14,hy-14,hw+28,hh+28,ha,{lw:3});}
  const bn=s.bones||{};for(const k in F.bones){const [[ax,ay],[bx,by]]=F.bones[k],p=bn[k]||0;hf_pLine(ctx,[[ax,ay],[bx,by]],ag_sine(p/0.6),{lw:4.5});
    const la=ag_in(p,0.5,0.4);if(la>0)dq_chip(ctx,bx,by+(by<y?-26:30),k,{align:"center",a:la});}
  const na=s.note||0;if(na>0){hf_pText(ctx,"where data passes",1084,836,{size:28,p:ag_in(na,0,0.55)});hf_pText(ctx,"between systems",1084,870,{size:28,p:ag_in(na,0.45,0.55)});}
  // the causes: a short line from the bone to the card, then the card
  const cs=s.cards||{},cn=s.counts||{},ow=s.owners||{};for(const k in F.causes){const c=F.causes[k],p=cs[k]||0;if(p<=0)continue;const [[ax,ay],[bx,by]]=F.bones[c.bone],h=c.s&&c.n?152:c.s||c.n?114:76,cy=c.y+h/2,
      u=(cy-ay)/(by-ay),jx=ax+(bx-ax)*u;hf_pLine(ctx,[[jx,cy],[c.x,cy]],ag_sine(p/0.5),{lw:3});
    const pp=clamp((p-0.3)/0.7,0,1);hf_cause(ctx,c.x,c.y,c.w,c,{a:ag_in(pp,0,0.4),k:pp,n:cn[k]==null?1:cn[k]});
    const oa=ow[k]||0;if(oa>0){const cw=dq_tw(ctx,c.own,{w:700,size:28})+84;dq_chip(ctx,c.x+c.w-cw+10,c.y-4,c.own,{icon:"person",a:ag_in(oa,0,0.5)});}}
  if(s.line)hf_pText(ctx,"each made sense when it was made",668,444,{size:32,p:s.line});
  ctx.restore();}

/* ---------------------------------------------------------------- the Great Hall's side table, and the hundred records
   hf_folders(ctx, x, y, n, o): a table in oak at the side of the stage, its top at y from x to x + 660, with n certificate folders
   lying open on it, each empty: the certificate printed again isn't there yet (o.a).
   hf_hundred(ctx, x, y, o): a hundred small record cards in ten rows, too small to read (decoration), from the measure of
   February; o.marked (0 to 1) circles in pencil, one by one, the 21 with an error (HF_ERR, the same cards every time); o.a. */
function hf_folders(ctx,x,y,n,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;const oak=DQ.oak,x1=W+40,d=150;
  // the table, seen from a little above: its top a band in perspective, its front edge and apron, a leg; lit from the window side
  ctx.fillStyle=rgba(ag_dk(oak,0.45),1);ctx.fillRect(x+60,y+d+60,34,H-y-d-60);
  ctx.fillStyle=rgba(ag_dk(oak,0.3),1);ctx.fillRect(x-20,y+d+14,x1-x+20,52);
  const g=ctx.createLinearGradient(x,0,x1,0);g.addColorStop(0,rgba(ag_dk(oak,0.02),1));g.addColorStop(1,rgba(ag_lt(oak,0.16),1));ctx.fillStyle=g;
  ctx.beginPath();ctx.moveTo(x+70,y);ctx.lineTo(x1,y);ctx.lineTo(x1,y+d);ctx.lineTo(x-20,y+d);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba(ag_lt(oak,0.3),1);ctx.fillRect(x-20,y+d,x1-x+20,14);ctx.fillStyle="rgba(255,240,214,0.3)";ctx.fillRect(x-20,y+d,x1-x+20,2);
  // the folders, lying open on it: dark board covers, cream inside, and nothing in them
  const fw=(x1-x-120)/n;for(let i=0;i<n;i++){const fx=x+40+i*fw+fw*0.08,w2=fw*0.84,top=y+26,bot=y+d-22,sk=0.42*(bot-top);ctx.save();
    const P=(u,v)=>[fx+u*w2+sk*(1-v),top+v*(bot-top)];const quad=(u0,u1,v0,v1)=>{const q=[P(u0,v0),P(u1,v0),P(u1,v1),P(u0,v1)];ctx.beginPath();ctx.moveTo(q[0][0],q[0][1]);for(let k=1;k<4;k++)ctx.lineTo(q[k][0],q[k][1]);ctx.closePath();};
    ctx.save();ctx.shadowColor="rgba(20,10,4,0.45)";ctx.shadowBlur=12;ctx.shadowOffsetX=-5;ctx.shadowOffsetY=5;ctx.fillStyle=rgba([38,40,50],1);quad(-0.02,1.02,-0.04,1.04);ctx.fill();ctx.restore();
    ctx.fillStyle=rgba([240,234,220],1);quad(0.05,0.47,0.06,0.94);ctx.fill();quad(0.53,0.95,0.06,0.94);ctx.fill();
    ctx.strokeStyle="rgba(120,96,64,0.3)";ctx.lineWidth=1.4;quad(0.09,0.43,0.12,0.88);ctx.stroke();quad(0.57,0.91,0.12,0.88);ctx.stroke();
    ctx.strokeStyle="rgba(10,10,14,0.6)";ctx.lineWidth=2;const m0=P(0.5,0),m1=P(0.5,1);ctx.beginPath();ctx.moveTo(m0[0],m0[1]);ctx.lineTo(m1[0],m1[1]);ctx.stroke();ctx.restore();}
  ctx.restore();}
const HF_ERR=(()=>{const r=ag_rnd(2026),s=new Set();while(s.size<21)s.add(Math.floor(r()*100));return [...s];})();
function hf_hundred(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const cw=96,ch=56,gx=14,gy=14;ctx.save();ctx.globalAlpha*=a;
  for(let i=0;i<100;i++){const cx=x+(i%10)*(cw+gx),cy=y+Math.floor(i/10)*(ch+gy),ia=o.rowA?o.rowA(i):1;if(ia<=0.01)continue;ctx.save();ctx.globalAlpha*=ia;
    dq_card(ctx,cx,cy,cw,ch,{on:"granite",r:3});ctx.fillStyle="rgba(92,82,72,0.35)";ctx.fillRect(cx+10,cy+12,cw*0.5,4);for(let k=0;k<3;k++)ctx.fillRect(cx+10,cy+24+k*9,cw*(0.36+((i*7+k*3)%5)*0.09),3);ctx.restore();}
  // the 21 with an error, circled in pencil one by one
  const m=o.marked||0;HF_ERR.forEach((i,k)=>{const p=clamp(m*21-k,0,1);if(p<=0)return;const cx=x+(i%10)*(cw+gx)+cw/2,cy=y+Math.floor(i/10)*(ch+gy)+ch/2;
    ctx.save();ctx.strokeStyle=rgba(DQ.chalk,0.9);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.ellipse(cx,cy,cw*0.62,ch*0.72,-0.08,-1.2,-1.2+TAU*1.04*ag_sine(p));ctx.stroke();ctx.restore();});
  ctx.restore();}

/* ---------------------------------------------------------------- the count's own pieces
   hf_cal(ctx, x, y, u, o): the graduations team's calendar for October and November 2025 on a card 820 wide: two months of days (a
   grid too small to read: decoration), and the days of December's round, Monday 20 October to Thursday 13 November, filled one by
   one in steel as u goes 0 to 1: the hours of the hand check, a measure; its key, "hand check" (o.a, o.on).
   hf_twoLists(ctx, x, y, o): the list as the platform built it the night before, and the copy as it went to the printer, side by side,
   each a card 820 wide; o.scan (0 to 1) runs a line down both and lights each name changed by hand; o.past (0 to 1) lights the name
   that got past (still wrong in the copy). */
const HF_CAL={oct:{off:2,n:31},nov:{off:5,n:30},days:[[10,20],[10,21],[10,22],[10,23],[10,24],[10,27],[10,28],[10,29],[10,30],[10,31],[11,3],[11,4],[11,5],[11,6],[11,7],[11,10],[11,11],[11,12],[11,13]]};
function hf_cal(ctx,x,y,u,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const w=820,h=430,cw=50,ch=44,g=4;ctx.save();ctx.globalAlpha*=a;
  dq_card(ctx,x,y,w,h,{on:o.on});dq_icon(ctx,"calendar",x+w-50,y+46,38,DQ.ink);
  const month=(gx,label,M,mo)=>{dq_T(ctx,label,gx,y+58,{w:700,size:30});for(let d=1;d<=M.n;d++){const i=M.off+d-1,cx=gx+(i%7)*(cw+g),cy=y+86+Math.floor(i/7)*(ch+g),we=i%7>4;
      ctx.fillStyle=we?"rgba(120,104,84,0.08)":"rgba(120,104,84,0.16)";ctx.fillRect(cx,cy,cw,ch);
      const k=HF_CAL.days.findIndex(q=>q[0]===mo&&q[1]===d);if(k>=0){const p=clamp(u*HF_CAL.days.length-k,0,1);if(p>0){ctx.fillStyle=rgba(DQ.steel,0.85*p);ctx.fillRect(cx,cy+ch*(1-p),cw,ch*p);}}}};
  month(x+28,"October 2025",HF_CAL.oct,10);month(x+424,"November 2025",HF_CAL.nov,11);
  ctx.fillStyle=rgba(DQ.steel,0.85);ctx.fillRect(x+28,y+h-58,30,26);dq_T(ctx,"hand check",x+70,y+h-35,{w:600,size:28,col:"steel",a:ag_in(u,0.05,0.2)});
  ctx.restore();}
const HF_TWO=[["Sofia MARTINEZ","Sofia Martínez"],["Chloe Lefevre","Chloé Lefèvre"],["Tom Ashby","Tom Ashby"],["Kowalska Anna","Anna Kowalska"],
  ["Eleni Hatzigeorgiou-Konstantinopoulo","Eleni Hatzigeorgiou-Konstantinopoulou"],["Jose Garcia","Jose Garcia"],["Aroha Ngata","Aroha Ngata"]];
const HF_PAST=5;
function hf_twoLists(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const w=820,rh=50,h=96+rh*HF_TWO.length+20,sc=o.scan||0,past=o.past||0;ctx.save();ctx.globalAlpha*=a;
  [[x,"The list","built the night before",0],[x+w+80,"The copy","as sent · 13 Nov 2025",1]].forEach(([cx,head,sub,k])=>{
    dq_card(ctx,cx,y,w,h,{on:o.on});dq_T(ctx,head.toUpperCase(),cx+28,y+46,{w:800,size:28,ls:4,col:DQ.soft});dq_T(ctx,sub,cx+w-28,y+46,{w:600,size:28,col:DQ.soft,align:"right"});
    ctx.fillStyle="rgba(120,96,70,0.5)";ctx.fillRect(cx+16,y+70,w-32,2.2);
    HF_TWO.forEach((r,i)=>{const ry=y+80+i*rh,changed=r[0]!==r[1],lit=changed?ag_in(sc*HF_TWO.length,i+0.4,0.4):0,pl=i===HF_PAST?past:0;
      if(lit>0){ctx.fillStyle="rgba(196,172,128,"+(0.26*lit)+")";ctx.fillRect(cx+12,ry+3,w-24,rh-6);ctx.fillStyle=rgba(DQ.steel,lit);ctx.fillRect(cx+12,ry+3,6,rh-6);}
      // the name that got past: still wrong in the copy, outlined in steel
      if(pl>0){ctx.save();ctx.strokeStyle=rgba(DQ.steel,pl);ctx.lineWidth=3;ctx.setLineDash([10,7]);rr(ctx,cx+12,ry+3,w-24,rh-6,6);ctx.stroke();ctx.restore();}
      dq_T(ctx,r[k],cx+32,ry+rh/2+10,{w:500,size:28,f:"mono",col:DQ.ink});});
    // the line running down the sheet
    if(sc>0&&sc<1){const ly=y+80+sc*rh*HF_TWO.length;ctx.fillStyle=rgba(DQ.steel,0.7);ctx.fillRect(cx+12,ly-1.5,w-24,3);}});
  ctx.restore();return{x,y,w:2*w+80,h};}

/* ---------------------------------------------------------------- Beatriz's name, and where it goes
   hf_portal(ctx, x, y, w, o): the student portal's page in a window 400 tall, the module's portal words: "Your name, as it will be
   printed", the name in its field, and two buttons; o.name (as the list holds it), o.typed (her name, typed over it as o.tu goes 0
   to 1), o.press (2: "This isn't my name") and o.pu (the press, 0 to 1), o.title, o.on, o.a, o.k.
   hf_ruler(ctx, x0, x1, y, p, o): a measure in steel under a line of words, from x0 to x1 with a tick at each end, drawn on as p goes
   0 to 1 (o.a).
   hf_lineage(ctx, x, y, o): Unity Catalog's lineage for the graduation list, drawn for the film: the portal's and the student
   system's tables, their staging models and the list, a line for each column that feeds another; o.lit (0 to 1) runs the path from
   the list's family_name back through the staging model's to the student system's, lighting each column as it reaches it (o.a, o.k).
   hf_pill(ctx, x, y, text, o): a chip, solid, or dashed for what the platform can't see (o.dash); x its middle (o.a, o.on). */
function hf_portal(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const h=400;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  dq_window(ctx,x,y,w,h,{product:"Student portal",title:o.title,on:o.on,draw:(c,b)=>{
    dq_T(c,"Your name, as it will be printed",b.x+6,b.y+40,{w:700,size:32});
    // the name as the portal shows it; what she types (o.add) follows it in brass, letter by letter, with a caret while she types
    const fy=b.y+66,u=clamp(o.tu||0,0,1),typing=!!o.add&&u>0;c.strokeStyle=typing?rgba(DQ.ink,0.75):"rgba(110,90,66,0.5)";c.lineWidth=typing?2.6:1.8;rr(c,b.x+4,fy,b.w-8,72,12);c.stroke();
    const nf={w:500,size:28,f:"mono"},nx=b.x+26;if(o.name)dq_T(c,o.name,nx,fy+46,Object.assign({col:DQ.ink},nf));
    if(typing){const s=o.add.slice(0,Math.max(1,Math.ceil(o.add.length*u))),ax=nx+(o.name?dq_tw(c,o.name,nf):0);dq_T(c,s,ax,fy+46,Object.assign({},nf,{col:"brass",w:700}));
      if(u<1){const cx=ax+dq_tw(c,s,Object.assign({},nf,{w:700}))+3;c.fillStyle=rgba(DQ.ink,0.8);c.fillRect(cx,fy+18,2.5,36);}}
    // the two buttons: the one pressed fills with ink, and its words turn cream
    const bw=(b.w-28)/2;[["This is my name",1],["This isn't my name",2]].forEach(([s,i],k)=>{const bx=b.x+4+k*(bw+20),by=fy+104,p=o.press===i?clamp(o.pu==null?1:o.pu,0,1):0;
      c.fillStyle=rgba(mix([252,250,245],DQ.ink,0.92*p),1);rr(c,bx,by,bw,72,36);c.fill();c.strokeStyle=rgba(DQ.ink,0.7);c.lineWidth=2;rr(c,bx,by,bw,72,36);c.stroke();
      dq_T(c,s,bx+bw/2,by+46,{w:700,size:30,align:"center",color:rgba(mix(DQ.ink,DQ.paper,p),1)});});}});
  ctx.restore();return{x,y,w,h};}
function hf_ruler(ctx,x0,x1,y,p,o){o=o||{};if(p<=0.01)return;const a=o.a==null?1:o.a,xe=lerp(x0,x1,ag_sine(clamp(p,0,1)));ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(DQ.steel,1);ctx.lineWidth=3.5;ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(x0,y-12);ctx.lineTo(x0,y+4);ctx.moveTo(x0,y);ctx.lineTo(xe,y);if(p>=0.98){ctx.moveTo(x1,y-12);ctx.lineTo(x1,y+4);}ctx.stroke();ctx.restore();}
// the lineage's tables: where each sits in the window's body, its columns, and which column feeds which
const HF_LIN={nodes:{
    pSrc:{x:0,y:24,w:470,name:"portal.name_confirmations",cols:["student_id","family_name"]},
    sSrc:{x:0,y:262,w:470,name:"student_system.graduations",cols:["student_id","given_name","family_name"]},
    pStg:{x:540,y:24,w:570,name:"stg_portal__name_confirmations",cols:["student_bk","family_name"]},
    sStg:{x:540,y:262,w:570,name:"stg_student_system__graduations",cols:["student_bk","given_name","family_name"]},
    mart:{x:1172,y:142,w:580,name:"mart_graduations__graduation_list",cols:["given_name","family_name","name_as_printed"]}},
  head:62,rh:48,
  links:[["pSrc",0,"pStg",0],["pSrc",1,"pStg",1],["sSrc",0,"sStg",0],["sSrc",1,"sStg",1],["sSrc",2,"sStg",2],["pStg",1,"mart",1],["sStg",1,"mart",0],["sStg",2,"mart",1],["sStg",1,"mart",2],["sStg",2,"mart",2]],
  // the path the film follows, from the list back: [node, column] in order
  path:[["mart",1],["sStg",2],["sSrc",2]]};
function hf_lineage(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const L=HF_LIN,w=1800,h=620,lit=clamp(o.lit||0,0,1);ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  dq_window(ctx,x,y,w,h,{logo:"databricks",product:"Databricks",title:"Unity Catalog · lineage",on:o.on,draw:(c,b)=>{
    const N=k=>{const n=L.nodes[k];return{x:b.x+n.x,y:b.y+n.y,n};},rowY=(k,i)=>N(k).y+L.head+i*L.rh+L.rh/2;
    // how far along the path the light is: segment s (0, 1) lights at s / 2 of lit; each column lights as the line reaches it
    const seg=s=>clamp(lit*2-s,0,1),colLit=(k,i)=>{const j=L.path.findIndex(q=>q[0]===k&&q[1]===i);return j<0?0:j===0?ag_in(lit,0,0.08):clamp(seg(j-1)*1.3-0.3,0,1);};
    const curve=(k1,i1,k2,i2)=>{const A=N(k1),B=N(k2),x1=A.x+A.n.w,y1=rowY(k1,i1),x2=B.x,y2=rowY(k2,i2),m=(x2-x1)*0.5;return [x1,y1,x1+m,y1,x2-m,y2,x2,y2];};
    // every link, thin; then the path, in ink, drawn from the list back
    c.lineCap="round";for(const [k1,i1,k2,i2] of L.links){const q=curve(k1,i1,k2,i2);c.strokeStyle="rgba(110,90,66,0.38)";c.lineWidth=2.2;c.beginPath();c.moveTo(q[0],q[1]);c.bezierCurveTo(q[2],q[3],q[4],q[5],q[6],q[7]);c.stroke();}
    for(const k in L.nodes){const {x:nx,y:ny,n}=N(k),nh=L.head+n.cols.length*L.rh+12;
      c.save();c.shadowColor="rgba(60,40,20,0.16)";c.shadowBlur=10;c.shadowOffsetY=3;c.fillStyle="rgb(255,253,248)";rr(c,nx,ny,n.w,nh,10);c.fill();c.restore();
      c.strokeStyle="rgba(110,90,66,0.4)";c.lineWidth=1.5;rr(c,nx,ny,n.w,nh,10);c.stroke();
      dq_icon(c,"table",nx+30,ny+31,28,DQ.soft);dq_T(c,n.name,nx+54,ny+41,{w:700,size:28});c.fillStyle="rgba(110,90,66,0.22)";c.fillRect(nx+12,ny+L.head-2,n.w-24,1.4);
      n.cols.forEach((col,i)=>{const cy=rowY(k,i),l=colLit(k,i);if(l>0){c.fillStyle="rgba(196,172,128,"+(0.3*l)+")";rr(c,nx+8,cy-L.rh/2+4,n.w-16,L.rh-8,6);c.fill();c.fillStyle=rgba(DQ.ink,l);rr(c,nx+8,cy-L.rh/2+4,6,L.rh-8,3);c.fill();}
        dq_T(c,col,nx+30,cy+10,{w:l>0.5?700:500,size:28,col:l>0.5?DQ.ink:DQ.soft});});}
    // the path, over the nodes' edges: from the list's family_name back, segment by segment
    for(let s=0;s<L.path.length-1;s++){const u=seg(s);if(u<=0)break;const [k2,i2]=L.path[s],[k1,i1]=L.path[s+1],q=curve(k1,i1,k2,i2);
      // drawn from its right end (the list's side) leftwards
      c.strokeStyle=rgba(DQ.ink,0.9);c.lineWidth=4.5;c.beginPath();const P=v=>{const t1=1-v,b0=t1*t1*t1,b1=3*t1*t1*v,b2=3*t1*v*v,b3=v*v*v;return [b0*q[0]+b1*q[2]+b2*q[4]+b3*q[6],b0*q[1]+b1*q[3]+b2*q[5]+b3*q[7]];};
      const steps=40;let first=true;for(let j=0;j<=steps;j++){const v=1-j/steps*u,[px,py]=P(v);if(first){c.moveTo(px,py);first=false;}else c.lineTo(px,py);}c.stroke();
      const [hx,hy]=P(1-u);c.fillStyle=rgba(DQ.ink,1);c.beginPath();c.arc(hx,hy,6,0,TAU);c.fill();}}});
  ctx.restore();}
function hf_pill(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return null;const size=28,w=dq_tw(ctx,text,{w:700,size})+(o.icon?84:48),h=size+28,bx=x-w/2,by=y-h/2;ctx.save();ctx.globalAlpha*=a;
  if(o.dash){ctx.fillStyle="rgba(250,246,236,0.42)";rr(ctx,bx,by,w,h,h/2);ctx.fill();ctx.setLineDash([9,8]);ctx.strokeStyle=rgba(DQ.soft,0.95);ctx.lineWidth=2.4;rr(ctx,bx+1,by+1,w-2,h-2,h/2);ctx.stroke();ctx.setLineDash([]);}
  else{ctx.save();dq_shadow(ctx,o.on,0.45);ctx.shadowBlur=10;rr(ctx,bx,by,w,h,h/2);ctx.fillStyle=rgba(DQ.paper,1);ctx.fill();ctx.restore();ctx.strokeStyle=rgba(DQ.ink,0.75);ctx.lineWidth=2.4;rr(ctx,bx+1,by+1,w-2,h-2,h/2);ctx.stroke();}
  if(o.icon)dq_icon(ctx,o.icon,bx+38,y,30,o.dash?DQ.soft:DQ.ink);dq_T(ctx,text,bx+(o.icon?64:24),y+size*0.36,{w:700,size,col:o.dash?DQ.soft:DQ.ink});ctx.restore();return{x:bx,y:by,w,h};}
// a "Why?" card: the question as its kick, then its answer as it's said (o.ansA, 0 to 1); o.back (0 to 1) steps it back under a dark
// veil once the next one comes; returns its box
function hf_why(ctx,x,y,w,q,ans,o){o=o||{};const a=o.a==null?1:o.a,tf={w:700,size:34},lines=dq_wrap(ctx,ans,w-DQ_PAD*2,tf),h=DQ_PAD+40+lines.length*44+DQ_PAD-2,bb={x,y,w,h};if(a<=0.01)return bb;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));dq_card(ctx,x,y,w,h,{on:o.on});
  dq_T(ctx,String(q).toUpperCase(),x+DQ_PAD,y+DQ_PAD+24,{w:800,size:28,ls:4,col:DQ.soft});dq_icon(ctx,"why",x+w-DQ_PAD-18,y+DQ_PAD+16,36,DQ.soft);
  const aa=o.ansA==null?1:clamp(o.ansA,0,1);if(aa>0)lines.forEach((l,i)=>dq_T(ctx,l,x+DQ_PAD,y+DQ_PAD+40+44*(i+1)-6,Object.assign({col:DQ.ink,a:aa},tf)));
  const bk=clamp(o.back||0,0,1);if(bk>0){ctx.fillStyle="rgba(26,22,20,"+(0.42*bk)+")";rr(ctx,x,y,w,h,8);ctx.fill();}
  ctx.restore();return bb;}

/* ---------------------------------------------------------------- the night the fix goes in
   "hf_dusk": the bench at night, a place of its own: the same wall with no sun, darker, and the lamp's warm pool on it (the lamp
   itself, dq_lamp, is drawn live over it). HF_YML: the three checks as they're written in the example project's tests, the lines the
   film shows of tests/rules/_rules__tests.yml (each check's description left out). */
AG_PLACES.hf_dusk=c=>{dq_paintBench(c,{sun:0,base:[188,170,144]});
  let g=c.createLinearGradient(0,0,0,DQ_BENCH.back);g.addColorStop(0,"rgba(16,18,28,0.62)");g.addColorStop(1,"rgba(16,18,28,0.36)");c.fillStyle=g;c.fillRect(0,0,W,DQ_BENCH.back);
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(16,18,28,0)");g.addColorStop(1,"rgba(16,18,28,0.28)");c.fillStyle=g;c.fillRect(0,0,W,H);
  dq_pool(c,640,620,820,[255,212,160],0.3,0.75);};
AG_BARE.hf_dusk=null;
const HF_YML=[[["  - name: ",DQ.soft],["family_name_may_be_cut_short",null]],[["    config:",DQ.soft]],[["      severity: ",DQ.soft],["warn",null]],[["      meta: ",DQ.soft],["{owner: Mei Tanaka}",null]],
  [["  - name: ",DQ.soft],["family_name_in_capitals_only",null]],[["    config:",DQ.soft]],[["      severity: ",DQ.soft],["warn",null]],[["      meta: ",DQ.soft],["{owner: Mei Tanaka}",null]],
  [["  - name: ",DQ.soft],["night_file_keeps_every_letter",null]],[["    config:",DQ.soft]],[["      severity: ",DQ.soft],["error",null]],[["      meta: ",DQ.soft],["{owner: Mei Tanaka}",null]]];

/* ---------------------------------------------------------------- the morning after, and the scorecard
   hf_listBack(ctx, x, y, w, u, o): December's list as a card, its names as the platform holds them; as u goes 0 to 1 the names that
   lost their accents on the way in take them back, one by one, each lit in steel as it does (a measure: the count runs with it).
   hf_score(ctx, x, y, o): the graduation list's scorecard: the checks at the source, by year, and the new row, the hand-check hours;
   o.rows (0 to 1: the checks' rows), o.hours (0 to 1: the new row), o.lit (0 to 1: the checks' rows lit), o.a, o.k, o.on. */
const HF_BACK=[["Joaquin Ibanez","Joaquín Ibáñez"],["Rangi Parata","Rangi Parata"],["Zoe Marchand","Zoé Marchand"],["Ana Lucia Brandao","Ana Lúcia Brandão"],["Daniel Okoro","Daniel Okoro"],["Therese Lavoie","Thérèse Lavoie"]];
function hf_listBack(ctx,x,y,w,u,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const rh=58,n=HF_BACK.length,h=70+rh*n+22,ch=HF_BACK.map((r,i)=>r[0]!==r[1]?i:-1).filter(i=>i>=0);ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  dq_card(ctx,x,y,w,h,{on:o.on});dq_T(ctx,"DECEMBER'S LIST",x+DQ_PAD,y+46,{w:800,size:28,ls:3.5,col:DQ.soft});dq_T(ctx,"DEC26",x+w-DQ_PAD,y+46,{w:500,size:28,f:"mono",col:DQ.soft,align:"right"});
  ctx.fillStyle="rgba(120,96,70,0.5)";ctx.fillRect(x+16,y+66,w-32,2.2);
  HF_BACK.forEach((r,i)=>{const ry=y+70+i*rh,cy=ry+rh/2,k=ch.indexOf(i),p=k<0?0:clamp(u*ch.length-k,0,1);ctx.fillStyle="rgba(120,104,84,0.2)";ctx.fillRect(x+16,ry+rh-1,w-32,1.4);
    if(p>0){ctx.fillStyle="rgba(196,172,128,"+(0.22*p)+")";ctx.fillRect(x+10,ry+4,w-20,rh-8);ctx.fillStyle=rgba(DQ.steel,p);ctx.fillRect(x+10,ry+4,6,rh-8);}
    const nf={w:500,size:30,f:"mono",col:DQ.ink};if(p<1)dq_T(ctx,r[0],x+DQ_PAD+8,cy+10,Object.assign({a:1-p},nf));if(p>0)dq_T(ctx,r[1],x+DQ_PAD+8,cy+10,Object.assign({a:p},nf));});
  ctx.restore();return{x,y,w,h};}
const HF_SCORE={cols:["2025–26","2026–27","2027–28"],rows:[["Names may be cut short","none","hold"],["Names in capitals only","none","hold"],["Night's file keeps every letter","none","pass"]]};
function hf_score(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const w=1500,rh=78,h=150+rh*4+30,cx=[x+w-650,x+w-410,x+w-170],ra=o.rows==null?1:o.rows,ha=o.hours||0;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  dq_card(ctx,x,y,w,h,{on:o.on});dq_T(ctx,"SCORECARD · GRADUATION LIST",x+DQ_PAD,y+52,{w:800,size:28,ls:4,col:DQ.soft});dq_icon(ctx,"gauge",x+w-DQ_PAD-20,y+44,38,DQ.ink);
  HF_SCORE.cols.forEach((c_,i)=>dq_T(ctx,c_,cx[i],y+124,{w:700,size:28,col:DQ.soft,align:"center"}));ctx.fillStyle="rgba(120,96,70,0.5)";ctx.fillRect(x+16,y+142,w-32,2.2);
  const cell=(i,ry)=>{ctx.strokeStyle="rgba(110,90,66,0.3)";ctx.lineWidth=1.4;rr(ctx,cx[i]-90,ry+10,180,rh-20,8);ctx.stroke();};
  HF_SCORE.rows.forEach((r,j)=>{const ry=y+150+j*rh,cy=ry+rh/2;ctx.save();ctx.globalAlpha*=ra;
    const l=clamp(o.lit||0,0,1);if(l>0){ctx.fillStyle="rgba(196,172,128,"+(0.2*l)+")";ctx.fillRect(x+10,ry+4,w-20,rh-8);}
    dq_T(ctx,r[0],x+DQ_PAD,cy+10,{w:600,size:30,col:DQ.ink});for(let i=0;i<3;i++){cell(i,ry);const m=r[i+1];if(m)dq_stampMark(ctx,cx[i],cy,m,19);}
    ctx.fillStyle="rgba(120,104,84,0.2)";ctx.fillRect(x+16,ry+rh-1,w-32,1.4);ctx.restore();});
  // the new row: the hand-check hours, a measure; last year's 320, and the years to come, empty
  if(ha>0){const ry=y+150+3*rh,cy=ry+rh/2;ctx.save();ctx.globalAlpha*=ha;ctx.translate(0,(1-ag_eo(ha))*24);ctx.fillStyle="rgba(196,172,128,0.24)";ctx.fillRect(x+10,ry+4,w-20,rh-8);ctx.fillStyle=rgba(DQ.steel,1);ctx.fillRect(x+10,ry+4,6,rh-8);
    dq_T(ctx,"Hand-check hours",x+DQ_PAD,cy+10,{w:700,size:30,col:DQ.ink});cell(0,ry);dq_T(ctx,"320",cx[0],cy+12,{w:800,size:34,col:"steel",align:"center"});
    for(const i of [1,2]){ctx.save();ctx.setLineDash([8,7]);ctx.strokeStyle=rgba(DQ.steel,0.7);ctx.lineWidth=2;rr(ctx,cx[i]-90,ry+10,180,rh-20,8);ctx.stroke();ctx.restore();}ctx.restore();}
  ctx.restore();return{x,y,w,h};}
