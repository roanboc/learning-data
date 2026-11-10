/* ===== Learning while doing: the university, a year from now (imagined) =====
   The team's rooms in the module's light, and what is on their walls and screens (prefix lw_):
     lwMorning, lwLate, lwGrey      the team's room in the morning, late in the day, and on a grey day
     lw_tree(c, x, y, w, h, o)      the team's project on a screen: its models, folder by folder (o.u comes in, o.hl lights a file)
     lw_change(c, x, y, w, words, o) one small change, finished: a sheet, who wrote it, and who reviewed it (a pill, o.rev)
     lw_weeks(c, x, y, o)           six weeks of small changes, a square for each, reviewed (o.n: how many are in)
     lw_week(c, x, y, w, h, o)      a week in the calendar: meetings in grey, the learning time on Thursday afternoon in blue (o.learn)
     lw_ask(c, x, y, text, o)       a meeting asked for, on a slip, moving to another time (o.at 0 to 1: from where to where)
     lw_docs(c, x, y, w, h, o)      a screen: the tools' own docs on the left, the work on the right
     lw_notes(c, x, y, w, h, o)     the team's notes, beside the code: a note a week, each by someone else
     lw_counts(c, x, y, w, h, o)    a week of one room's counts, hour by hour (o.scan: the hour she's reading)
     lw_page(c, x, y, w, o)         Ivy's one page: what one count means, in three parts (o.rows)
     lw_jobs(c, x, y, w, o)         the nine jobs that must keep running, and who can run each (o.one, o.second, o.ivy)
     lw_runbook(c, x, y, w, o)      one job, written down step by step
     lw_ring(c, cx, cy, r, o)       Lave and Wenger: a newcomer at the edge of the work, moving in (o.in)
     lw_split(c, x, y, w, o)        the rule of thumb: 70, 20 and 10 (o.u, o.soft: dashed, a rule of thumb, not a measurement)
     lw_tutorial(c, x, y, w, h, o)  a tutorial about nothing in the job: an imaginary shop's orders
   Colour keeps the module's meaning: the sensors' counts in orange; the learning time in blue; a change reviewed, a second name and
   a page the team shares in green; a job only one person can run in amber. */

AG_PLACES.lwMorning=c=>lp_paintRoom(c,{light:"morning",seed:2});
AG_PLACES.lwLate=c=>lp_paintRoom(c,{light:"late",seed:4});
AG_PLACES.lwGrey=c=>lp_paintRoom(c,{light:"grey",seed:5});

// a small folder or file mark, before a name in a tree
function lw_mark(c,x,y,folder,col){c.save();c.fillStyle=rgba(col,1);if(folder){rr(c,x,y-16,30,22,4);c.fill();c.fillRect(x,y-20,13,6);}
  else{c.fillRect(x+4,y-20,22,28);c.fillStyle="rgba(255,255,255,0.7)";for(const k of [0,1,2])c.fillRect(x+8,y-13+k*7,14,2.5);}c.restore();}
// the project's models on a screen, folder by folder: the staging models from each source, then the mart people use
const LW_TREE=[["models",0,1],["staging",1,1],["stg_timetabling__bookings",2,0],["stg_sensors__room_counts",2,0],["marts",1,1],["mart_space__room_use",2,0]];
function lw_tree(c,x,y,w,h,o){o=o||{};const u=o.u==null?1:o.u;lp_T(c,"The team's project",x+40,y+62,{w:800,size:32});
  c.fillStyle=rgba(LP.mut,0.25);c.fillRect(x+40,y+84,w-80,2);
  LW_TREE.forEach(([name,d,f],i)=>{const a=clamp(u*LW_TREE.length-i,0,1);if(a<=0.004)return;const ly=y+142+i*56,lx=x+48+d*44,hl=o.hl===i;
    if(hl){c.fillStyle=rgba(LP.orange,0.12*a);c.fillRect(x+24,ly-36,w-48,52);}
    c.save();c.globalAlpha*=a;lw_mark(c,lx,ly,f,f?LP.mut:LP.orange);c.restore();lp_T(c,name,lx+46,ly,{w:500,size:28,f:"mono",a,col:hl?LP.orange:LP.ink});});}
// one small change, finished: the sheet says what it is and who wrote it; once it's reviewed, a green pill under it says by whom
function lw_change(c,x,y,w,words,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return null;c.save();c.globalAlpha*=a;
  const b=lp_textSheet(c,x,y,w,words,{light:o.light,col:o.col,k:o.k,pin:o.pin});
  if(o.rev>0)lp_pill(c,x+w/2,b.y+b.h+44,o.by||"Reviewed",{col:LP.green,icon:"tick",a:o.rev,k:o.revK});c.restore();return b;}
// six weeks of small changes: a square for each, by week, filled green as it goes in reviewed
const LW_PERWEEK=[3,4,5,4,4,5];
function lw_weeks(c,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const n=o.n==null?25:o.n,cw=150,sz=46,gp=10;c.save();c.globalAlpha*=a;let k=0;
  LW_PERWEEK.forEach((m,wk)=>{const cx=x+wk*cw;lp_T(c,"Week "+(wk+1),cx+sz/2+14,y+44,{w:600,size:28,align:"center",col:LP.mut});
    for(let i=0;i<m;i++,k++){const sy=y+64+i*(sz+gp),f=clamp(n-k,0,1);c.fillStyle="rgba(250,247,240,0.95)";rr(c,cx+14-sz/2+sz/2,sy,sz,sz,8);c.fill();
      c.strokeStyle=rgba(LP.mut,0.35);c.lineWidth=2;rr(c,cx+14,sy,sz,sz,8);c.stroke();
      if(f>0){c.save();c.globalAlpha*=f;c.fillStyle=rgba(LP.green,1);rr(c,cx+17,sy+3,sz-6,sz-6,6);c.fill();lp_icon(c,"tick",cx+14+sz/2,sy+sz/2,28,[255,255,255]);c.restore();}}});
  c.restore();}
// a week in the calendar: five days, 9:00 to 17:00; meetings (MTG) in grey; the learning time, Thursday 14:00 to 16:00, in blue
const LW_MTG=[[0,9,1],[0,13,1],[1,10,1],[1,15,1],[2,11,1],[3,9.5,1],[3,14.5,1],[4,10,1],[4,13,1.5]];
function lw_week(c,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;c.save();const g0=c.globalAlpha;
  if(o.k!=null)ag_about(c,x+w/2,y+h/2,lerp(0.7,1,ag_spr(o.k,0,0.5)));
  // a week laid over another (o.cover) has its paper whole almost at once, so the week under it never shows through as it comes in
  c.save();c.globalAlpha=g0*(o.cover?Math.min(1,3*a):a);c.shadowColor="rgba(52,36,30,0.28)";c.shadowBlur=18;c.shadowOffsetX=LP.sdx;c.shadowOffsetY=10;
  c.fillStyle=rgba(LP.paper,1);c.fillRect(x,y,w,h);c.restore();c.globalAlpha=g0*a;
  const top=y+(o.title?110:70),dw=(w-110)/5,hh=(y+h-30-top)/8,X=d=>x+90+d*dw,Y=t=>top+(t-9)*hh;
  if(o.title)lp_T(c,o.title,x+36,y+56,{w:800,size:32});
  // a week laid under another (o.back, 0 to 1) lets its days and hours go as the one on top covers them, so no words show through it
  const la0=1-(o.back||0);if(la0>0.004){c.save();c.globalAlpha*=la0;
    ["Mon","Tue","Wed","Thu","Fri"].forEach((d,i)=>lp_T(c,d,X(i)+dw/2,top-16,{w:700,size:28,align:"center",col:i===3&&o.learn>0?LP.blue:LP.mut}));
    for(const t of [9,11,13,15])lp_T(c,String(t),x+64,Y(t)+10,{w:600,size:28,align:"right",col:LP.mut});c.restore();}
  for(const t of [9,11,13,15]){c.fillStyle=rgba(LP.mut,0.15);c.fillRect(x+82,Y(t),w-110,2);}
  // the meetings: grey blocks; the one that would sit in the learning time moves (o.skip: its index, gone)
  LW_MTG.forEach(([d,t,l],i)=>{if(o.skip===i)return;c.fillStyle=rgba(o.full?mix([176,168,158],LP.amber,0.18):[186,178,168],0.95);rr(c,X(d)+6,Y(t)+3,dw-12,l*hh-6,6);c.fill();});
  if(o.extra)for(const [d,t,l] of o.extra){c.fillStyle="rgba(186,178,168,0.95)";rr(c,X(d)+6,Y(t)+3,dw-12,l*hh-6,6);c.fill();}
  const la=o.learn||0;if(la>0.004){c.save();c.globalAlpha*=la;c.fillStyle=rgba(LP.blue,1);rr(c,X(3)+4,Y(14)+2,dw-8,2*hh-4,8);c.fill();
    lp_T(c,"Learning",X(3)+dw/2,Y(15)+10,{w:800,size:28,align:"center",color:"rgb(255,255,255)"});c.restore();}
  c.restore();}
// a meeting asked for: a slip with its time, which glides from where it was asked (o.from) to the time offered (o.to)
function lw_ask(c,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const u=ag_sine(o.at||0),x=lerp(o.from[0],o.to[0],u),y=lerp(o.from[1],o.to[1],u);
  c.save();c.globalAlpha*=a;const w=lp_tw(c,text,{w:700,size:28})+56;c.save();c.shadowColor="rgba(52,36,30,0.32)";c.shadowBlur=16;c.shadowOffsetX=LP.sdx;c.shadowOffsetY=8;
  c.fillStyle="rgb(255,251,242)";rr(c,x-w/2,y-30,w,60,10);c.fill();c.restore();c.strokeStyle=rgba(LP.mut,0.5);c.lineWidth=2;rr(c,x-w/2,y-30,w,60,10);c.stroke();
  lp_T(c,text,x,y+10,{w:700,size:28,align:"center"});c.restore();}
// a screen: the tools' own docs on the left, the work on the right
function lw_docs(c,x,y,w,h,o){o=o||{};const m=x+w*0.5,tab=o.tab||0;c.fillStyle="rgba(240,236,228,1)";c.fillRect(x,y,w*0.5,h);
  // the two docs, each a tab
  [["dbt docs",0],["Databricks docs",1]].forEach(([s,i])=>{const tx=x+30+i*230,on=Math.round(tab)===i;c.fillStyle=on?"rgb(251,249,244)":"rgba(220,214,204,1)";rr(c,tx,y+24,i?240:180,56,8);c.fill();
    lp_T(c,s,tx+(i?120:90),y+62,{w:700,size:28,align:"center",col:on?LP.ink:LP.mut});});
  c.fillStyle="rgb(251,249,244)";c.fillRect(x+20,y+80,w*0.5-40,h-100);
  lp_T(c,o.title||"Testing your models",x+50,y+140,{w:800,size:32});
  c.fillStyle=rgba(LP.mut,0.35);for(let k=0;k<6;k++)c.fillRect(x+50,y+180+k*40,(w*0.5-120)*(k%3===2?0.6:0.9),10);
  // the work: the project's code, a line being added
  c.fillStyle="rgb(251,249,244)";c.fillRect(m,y,w*0.5,h);lp_T(c,o.work||"The team's project",m+40,y+62,{w:800,size:28,col:LP.mut});
  const cols=[LP.mut,LP.ink,LP.ink,LP.mut,LP.ink];for(let k=0;k<7;k++){c.fillStyle=rgba(cols[k%5],0.45);c.fillRect(m+40+(k%3)*30,y+120+k*44,(w*0.5-140)*(0.4+((k*37)%50)/100),12);}
  if(o.add>0){c.fillStyle=rgba(LP.green,0.16*o.add);c.fillRect(m+20,y+120+7*44-26,w*0.5-40,44);c.fillStyle=rgba(LP.green,0.8*o.add);c.fillRect(m+40,y+120+7*44,(w*0.5-140)*0.7*o.add,12);}
  c.fillStyle=rgba(LP.mut,0.25);c.fillRect(m-1,y,2,h);}
// the team's notes, beside the code: a note a week, each by whoever learned it
const LW_NOTES=[["docs/learning",0,""],["tests.md",1,"Jun"],["time-travel.md",1,"Sam"],["sensor-counts.md",1,"Ivy"]];
function lw_notes(c,x,y,w,h,o){o=o||{};const u=o.u==null?1:o.u;lp_T(c,"The team's notes",x+40,y+62,{w:800,size:32});c.fillStyle=rgba(LP.mut,0.25);c.fillRect(x+40,y+84,w-80,2);
  LW_NOTES.forEach(([name,d,who],i)=>{const a=clamp(u*LW_NOTES.length-i,0,1);if(a<=0.004)return;const ly=y+146+i*60,lx=x+48+d*44,hl=o.hl===i;
    if(hl){c.fillStyle=rgba(LP.green,0.12*a);c.fillRect(x+24,ly-38,w-48,54);}
    c.save();c.globalAlpha*=a;lw_mark(c,lx,ly,!d,d?LP.green:LP.mut);c.restore();lp_T(c,name,lx+46,ly,{w:500,size:28,f:"mono",a});
    if(who)lp_T(c,who,x+w-44,ly,{w:600,size:28,align:"right",col:LP.mut,a});});}
// a week of one room's counts, Monday to Friday, 8:00 to 20:00: an orange bar for each hour; an hour with no count sent is a gap,
// a dashed outline; the hour she's reading lit (o.scan: 0 to 1 across the week)
const LW_CNT=(()=>{const R=ag_rnd(2027),v=[];for(let d=0;d<5;d++)for(let hh=0;hh<12;hh++){const peak=hh>=2&&hh<=6?1:hh>=7&&hh<=9?0.6:0.25;
  v.push(d===2&&hh===10?null:d===4&&hh>=10?0:Math.round((8+R()*30)*peak+(R()<0.15?0:3)));}return v;})();
function lw_counts(c,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;c.save();c.globalAlpha*=a;const n=LW_CNT.length,dw=w/5,bw=dw/12,base=y+h-50,mx=42,u=o.u==null?1:o.u,sc=o.scan;
  for(let d=0;d<5;d++)lp_T(c,["Mon","Tue","Wed","Thu","Fri"][d],x+d*dw+dw/2,y+h-6,{w:700,size:28,align:"center",col:LP.mut});
  c.fillStyle=rgba(LP.mut,0.4);c.fillRect(x,base,w,2);
  LW_CNT.forEach((v,i)=>{const bx=x+i*bw+3,f=clamp(u*n-i,0,1);if(f<=0)return;const lit=sc!=null&&Math.abs(sc*n-i-0.5)<0.5;
    if(v==null){c.save();c.setLineDash([6,5]);c.strokeStyle=rgba(LP.amber,0.9*f);c.lineWidth=2.5;c.strokeRect(bx,base-60,bw-6,60);c.restore();return;}
    const bh=Math.max(3,(h-110)*v/mx*f);c.fillStyle=rgba(LP.orange,lit?1:0.72);c.fillRect(bx,base-bh,bw-6,bh);});
  c.restore();}
// Ivy's one page: what one count means, in three parts, each with a small picture
function lw_page(c,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return null;const r=o.rows||[1,1,1],h=640;c.save();c.globalAlpha*=a;
  if(o.k!=null)ag_about(c,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));const b=lp_sheet(c,x,y,w,h,{col:LP.orange,light:o.light});lp_label(c,x+40,y+64,"Ivy's page",{col:LP.orange});lp_T(c,"What one count means",x+40,y+118,{w:800,size:40});
  const row=(i,ry,draw,text)=>{const ra=r[i]||0;if(ra<=0.004)return;c.save();c.globalAlpha*=ra;draw(x+40,ry);c.restore();lp_wrap(c,text,w-380,{w:700,size:30}).forEach((l,k)=>lp_T(c,l,x+340,ry+46+k*40,{w:700,size:30,a:ra}));};
  // 1. the most people at once in the hour: people in the room minute by minute, its highest point marked
  row(0,y+160,(px,py)=>{c.fillStyle="rgba(204,88,32,0.12)";c.fillRect(px,py,260,130);c.strokeStyle=rgba(LP.orange,1);c.lineWidth=4;c.beginPath();
      const pts=[0,6,14,22,31,29,24,18,12,8,3,0];pts.forEach((v,i)=>{const X=px+10+i*22,Y=py+120-v*3.2;i?c.lineTo(X,Y):c.moveTo(X,Y);});c.stroke();
      c.fillStyle=rgba(LP.orange,1);c.beginPath();c.arc(px+10+4*22,py+120-31*3.2,8,0,TAU);c.fill();lp_T(c,"31",px+10+4*22+18,py+40,{w:800,size:32,col:LP.orange});},
    "The most people the sensor saw at once in that hour");
  // 2. a zero is not a gap
  row(1,y+320,(px,py)=>{c.fillStyle="rgba(250,247,240,1)";c.strokeStyle=rgba(LP.orange,1);c.lineWidth=3;rr(c,px,py+20,110,90,8);c.fill();c.stroke();lp_T(c,"0",px+55,py+82,{w:800,size:40,align:"center",col:LP.orange});
      c.save();c.setLineDash([8,6]);c.strokeStyle=rgba(LP.amber,1);rr(c,px+150,py+20,110,90,8);c.stroke();c.restore();},
    "0: it saw nobody. A gap: it sent nothing. Never the same");
  // 3. heads, never whose: three heads under the sensor, no names
  row(2,y+480,(px,py)=>{c.fillStyle=rgba(LP.graphite,1);rr(c,px+100,py+4,60,22,6);c.fill();c.strokeStyle=rgba(LP.orange,0.6);c.lineWidth=2.5;
      for(const k of [-1,0,1]){c.beginPath();c.moveTo(px+130,py+28);c.lineTo(px+130+k*80,py+76);c.stroke();}
      for(const k of [-1,0,1]){c.fillStyle=rgba(LP.mut,0.8);c.beginPath();c.arc(px+130+k*80,py+96,18,0,TAU);c.fill();c.fillRect(px+130+k*80-26,py+116,52,22);}},
    "It counts heads, and never knows whose");
  c.restore();return b;}
/* the nine jobs that must keep running, and who can run each, in May; by 30 June the five that had one name (amber, o.one) have a
   second (o.second, 0 to 1) and turn green: the night alerts three, Noor, Jun and Erin, who paired with Sam on them through June (film 9's
   rota of four from 5 July). Ivy's two second names are lit with o.ivy */
const LW_JOBS=[["The sensors' feed",["Sam"],"Ivy"],["The timetable feed",["Sam","Jun"]],["Night alerts",["Sam"],["Noor","Jun","Erin"]],["The room models",["Jun"],"Ivy"],
  ["The quality checks",["Jun","Noor"]],["The reports",["Tomás"],"Jun"],["Access requests",["Yusuf","Noor"]],["The catalog",["Noor","Yusuf"]],["Restoring a table",["Sam"],"Jun"]];
function lw_chip(c,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return 0;const w=lp_tw(c,s,{w:700,size:28})+36;c.save();c.globalAlpha*=a;
  c.fillStyle=o.fill?rgba(o.fill,1):"rgba(255,255,255,0.9)";rr(c,x,y-22,w,44,22);c.fill();c.strokeStyle=rgba(o.col||LP.mut,0.8);c.lineWidth=2;rr(c,x,y-22,w,44,22);c.stroke();
  lp_T(c,s,x+w/2,y+10,{w:700,size:28,align:"center",color:o.fill?"rgb(255,255,255)":undefined,col:o.fill?undefined:(o.col||LP.ink)});c.restore();return w;}
function lw_jobs(c,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return null;const rh=58,h=150+LW_JOBS.length*rh;c.save();c.globalAlpha*=a;
  if(o.k!=null)ag_about(c,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));const b=lp_sheet(c,x,y,w,h,{light:o.light});lp_T(c,"Jobs that must keep running",x+40,y+72,{w:800,size:40});lp_T(c,"Who can run it",x+w*0.52,y+124,{w:600,size:28,col:LP.mut});
  const u=o.u==null?1:o.u,one=o.one||0,sec=o.second||0,ivy=o.ivy||0;
  LW_JOBS.forEach(([job,names,add],i)=>{const ra=clamp(u*LW_JOBS.length-i,0,1);if(ra<=0.004)return;const ry=y+178+i*rh,single=names.length===1,hot=o.hot&&o.hot.includes(i)?o.hot.length&&o.hotA||0:0;
    if(single&&one>0){c.fillStyle=rgba(LP.amber,(0.14+0.1*hot)*one*(1-sec)*ra);c.fillRect(x+16,ry-30,w-32,rh-4);}
    if(single&&sec>0){c.fillStyle=rgba(LP.green,0.12*sec*ra);c.fillRect(x+16,ry-30,w-32,rh-4);}
    lp_T(c,job,x+40,ry+8,{w:700,size:28,a:ra});let cx=x+w*0.52;
    names.forEach(nm=>{cx+=lw_chip(c,cx,ry,nm,{a:ra})+12;});
    if(add&&sec>0)[].concat(add).forEach(nm=>{const iv=nm==="Ivy"?ivy:0;cx+=lw_chip(c,cx,ry,nm,{a:ra*sec,col:LP.green,fill:iv>0.5?LP.green:null})+12;});});
  c.restore();return b;}
// one job written down, step by step
const LW_STEPS=["Check the night's files came in","Run the load, then its tests","Look at any room with no count","Tell its readers if it's late"];
function lw_runbook(c,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return null;const u=o.u==null?1:o.u;c.save();c.globalAlpha*=a;
  const b=lp_textSheet(c,x,y,w,{kick:"Written down",title:"Running the sensors' feed",lines:LW_STEPS.map((s,i)=>(i+1)+". "+s)},{col:LP.green,light:o.light,k:o.k,u});c.restore();return b;}
// Lave and Wenger: the work as rings, the people who know it at the middle; a newcomer starts at the edge with small tasks that matter,
// and moves in as they take on more
function lw_ring(c,cx,cy,r,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;c.save();c.globalAlpha*=a;
  for(const [k,al] of [[1,0.1],[0.66,0.14],[0.33,0.2]]){c.fillStyle=rgba(LP.mut,al);c.beginPath();c.arc(cx,cy,r*k,0,TAU);c.fill();}
  // the people who know it, at the middle
  for(let i=0;i<5;i++){const an=i/5*TAU-0.4;c.fillStyle=rgba(LP.ink,0.75);c.beginPath();c.arc(cx+Math.cos(an)*r*0.17,cy+Math.sin(an)*r*0.17,13,0,TAU);c.fill();}
  // the newcomer, from the edge inwards, a path of small tasks behind them
  const u=ag_sine(o.in||0),an=-0.65,rr0=lerp(r*0.94,r*0.42,u),px=cx+Math.cos(an)*rr0,py=cy+Math.sin(an)*rr0;
  c.strokeStyle=rgba(LP.green,0.8);c.lineWidth=4;c.setLineDash([2,12]);c.lineCap="round";c.beginPath();c.moveTo(cx+Math.cos(an)*r*0.94,cy+Math.sin(an)*r*0.94);c.lineTo(px,py);c.stroke();c.setLineDash([]);
  c.fillStyle=rgba(LP.green,1);c.beginPath();c.arc(px,py,17,0,TAU);c.fill();c.restore();}
// the rule of thumb: about 70 from doing the work, 20 from other people, 10 from courses; dashed once it's called a rule of thumb
function lw_split(c,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const u=o.u||[1,1,1],soft=o.soft||0,hh=96;c.save();c.globalAlpha*=a;
  const parts=[[0.7,"Doing it","70"],[0.2,"Other people","20"],[0.1,"Courses","10"]],cols=[[120,96,80],[150,126,108],[182,160,140]];let px=x;
  parts.forEach(([f,lab,num],i)=>{const pw=w*f,pa=u[i]||0;if(pa>0.004){c.save();c.globalAlpha*=pa;c.fillStyle=rgba(cols[i],1-0.55*soft);c.fillRect(px+2,y,pw-4,hh);
      if(soft>0){c.setLineDash([10,8]);c.strokeStyle=rgba(cols[i],soft);c.lineWidth=3;c.strokeRect(px+2,y,pw-4,hh);c.setLineDash([]);}
      lp_T(c,num,px+pw/2,y+64,{w:800,size:40,align:"center",color:soft>0.5?rgba(LP.ink,1):"rgb(255,255,255)"});c.restore();
      lp_T(c,lab,i===2?px+pw:px+pw/2,y+hh+48,{w:700,size:28,align:i===2?"right":"center",col:LP.mut,a:pa});}
    px+=pw;});c.restore();}
// a tutorial about nothing in the job: an imaginary shop's orders
function lw_tutorial(c,x,y,w,h,o){lp_T(c,"Tutorial 1",x+40,y+62,{w:800,size:28,col:LP.mut});lp_T(c,"An imaginary shop's orders",x+40,y+118,{w:800,size:36});
  [["Socks","12"],["Mugs","7"],["Hats","3"]].forEach(([k,v],i)=>{const ry=y+190+i*58;c.fillStyle=i%2?"rgba(0,0,0,0)":"rgba(52,44,52,0.05)";c.fillRect(x+40,ry-38,w-80,54);
    lp_T(c,k,x+64,ry,{w:600,size:28,f:"mono"});lp_T(c,v,x+w-64,ry,{w:600,size:28,f:"mono",align:"right"});});}
