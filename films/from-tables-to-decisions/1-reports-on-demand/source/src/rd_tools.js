/* ===== Reports on demand: today's places, and the tools' pages =====
   Drawn with the module's kit (films/data-that-moves/shared/), with the film's own prefix, rd_. Finance's office and a tutorial room,
   painted once in the map's cool light; Genie One, with Rohan's question in his own words, its answer, what it counted and the query
   it ran; a report request and the week it took; the fortnightly pay report, its 40 pages and the three figures on its first; the
   Genie Agent the data team set up, its data, its owners' rules, its examples and its tests; the dashboard of the fortnightly figures,
   with its Ask Genie button; and a statement over a veil. The tools' pages are drawn at the level of architecture, never a tour of
   clicks. Every word is 28 px or more as seen, drawn live with md_T. */

/* ---------------------------------------------------------------- today's places, painted once */
// Finance's office: the map's night, a tall window at the left with the morning in it, a shelf of files in the dark at the right, and
// the long glass desk along the foot of the frame. Whoever sits at it is cut at its back edge (o.cut: RD_OFF.desk)
const RD_OFF={desk:852};
function rd_paintOffice(c){md_paintNight(c,{grid:false});
  const wx=90,wy=96,ww=480,wh=640;let q=c.createRadialGradient(wx+ww/2,wy+wh*0.4,0,wx+ww/2,wy+wh*0.4,ww*1.3);q.addColorStop(0,rgba(MD.flow,0.09));q.addColorStop(1,rgba(MD.flow,0));c.fillStyle=q;c.fillRect(0,0,W,H);
  for(let i=0;i<3;i++){const x=wx+i*(ww/3)+8,g=c.createLinearGradient(0,wy,0,wy+wh);g.addColorStop(0,"rgba(150,190,240,0.15)");g.addColorStop(1,"rgba(150,190,240,0.03)");c.fillStyle=g;rr(c,x,wy,ww/3-16,wh,6);c.fill();}
  c.strokeStyle="rgba(170,200,245,0.16)";c.lineWidth=2;rr(c,wx,wy,ww,wh,8);c.stroke();
  for(let r=0;r<3;r++){const y=190+r*180;c.fillStyle="rgba(170,200,245,0.07)";c.fillRect(1370,y+124,480,5);
    for(let k=0;k<12;k++){const x=1392+k*37+((k*7)%5),dh=((k*5)%3)*9;c.fillStyle="rgba(120,140,170,"+(0.05+((k*13)%7)*0.008)+")";rr(c,x,y+22+dh,26,100-dh,3);c.fill();}}
  const d=RD_OFF.desk,g=c.createLinearGradient(0,d,0,H);g.addColorStop(0,"rgba(28,42,72,0.97)");g.addColorStop(1,"rgba(7,11,22,1)");c.fillStyle=g;c.fillRect(0,d,W,H-d);
  c.fillStyle=rgba(MD.flow,0.32);c.fillRect(0,d,W,2);const e=c.createLinearGradient(0,d,0,d+44);e.addColorStop(0,"rgba(170,210,255,0.13)");e.addColorStop(1,"rgba(170,210,255,0)");c.fillStyle=e;c.fillRect(0,d,W,44);}
AG_PLACES.rdOffice=rd_paintOffice;
// a tutorial room: a glass board on the wall with a lesson's diagram on it (boxes and lines, no words), and the room's soft light
function rd_paintTute(c){md_paintNight(c,{grid:false});
  const bx=820,by=120,bw=960,bh=560;let q=c.createRadialGradient(bx+bw/2,by+bh/2,0,bx+bw/2,by+bh/2,bw*0.8);q.addColorStop(0,rgba(MD.flow,0.07));q.addColorStop(1,rgba(MD.flow,0));c.fillStyle=q;c.fillRect(0,0,W,H);
  c.fillStyle="rgba(150,180,230,0.06)";rr(c,bx,by,bw,bh,14);c.fill();c.strokeStyle="rgba(170,200,245,0.2)";c.lineWidth=2;rr(c,bx,by,bw,bh,14);c.stroke();
  c.strokeStyle="rgba(190,215,250,0.16)";c.lineWidth=3;c.lineCap="round";
  for(const [x,y,w,h] of [[900,200,220,110],[900,420,220,110],[1260,310,240,120],[1580,200,140,90],[1580,450,140,90]]){rr(c,x,y,w,h,12);c.stroke();}
  for(const [a,b] of [[[1120,255],[1260,350]],[[1120,475],[1260,390]],[[1500,350],[1580,245]],[[1500,390],[1580,495]]]){c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();}
  c.fillStyle="rgba(170,200,245,0.08)";c.fillRect(bx+20,by+bh+14,bw-40,8);}
AG_PLACES.rdTute=rd_paintTute;

/* ---------------------------------------------------------------- small things */
// a phase that comes in at t0 over d and leaves at t1 over d2
const rd_io=(t,t0,t1,d,d2)=>ag_in(t,t0,d||0.5)*(1-ag_in(t,t1,d2||0.4));
// a spring for a card from t0
const rd_k=(t,t0)=>Math.min(1,ag_spr(t,t0,0.55));
// typed words: the first u of s
const rd_typed=(s,u)=>s.slice(0,Math.round(clamp(u,0,1)*s.length));
// draw in the frame, whatever the camera is doing
function rd_scr(ctx,S,fn){ctx.save();setScreen(ctx,S);fn();ctx.restore();}
// a statement on its own, in the frame over a veil: its lines centred, each in its colour (o.cols), o.n how many show (fractional
// while the next comes in), o.k its spring
function rd_statement(ctx,S,a,lines,o){o=o||{};if(a<=0.004)return;md_veil(ctx,S,0.72*a);setScreen(ctx,S);const f={w:700,size:42},n=o.n==null?lines.length:o.n;
  const w=Math.max(...lines.map(l=>md_tw(ctx,l,f)))+128,h=72+lines.length*62,x=960-w/2,y=o.y||(470-h/2);
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,960,y+h/2,lerp(0.85,1,Math.min(1,ag_spr(o.k,0,0.5))));md_card(ctx,x,y,w,h,{edge:o.edge,r:26});
  lines.forEach((l,i)=>{const la=clamp(n-i,0,1);if(la<=0.004)return;md_T(ctx,l,960,y+36+46+i*62,Object.assign({align:"center",col:(o.cols&&o.cols[i])||MD.ink,a:ag_sine(la)},f));});ctx.restore();}

/* ---------------------------------------------------------------- Genie One: the question, the answer, what it counted, the query
   rd_genie(c, x, y, w, h, o): the window, its bar naming Genie One beside the platform's logo; in it Rohan's question, typed in his own
   words (o.q, 0 to 1), the answer (o.ans), what it counted (o.cnt), on-costs (o.on), the query it ran (o.code); then the conversation
   closes (o.code back to 0) before his next question (o.q2) and its answer (o.ans2) come in under the first. Its bubbles keep their
   size while their words are typed, so nothing below them moves. */
const RD_Q1="What has casual teaching cost Health this semester, so far?",RD_Q2="And Semester 1?";
const RD_SQL=["SELECT faculty_name, MEASURE(casual_teaching_cost)","FROM university.prod_marts.casual_teaching_cost","WHERE faculty_name = 'Faculty of Health'","  AND teaching_period = '2026-S2'","GROUP BY faculty_name"];
// a question in a bubble at the right of the body, its right edge at x; u how much is typed. Returns its height
function rd_bubble(c,x,y,maxW,s,u,a){const f={w:600,size:32},ls=md_wrap(c,s,maxW-56,f),bw=Math.max(...ls.map(l=>md_tw(c,l,f)))+56,bh=ls.length*44+36;if(a<=0.004)return bh;
  c.save();c.globalAlpha*=a;c.fillStyle="rgba(120,200,255,0.13)";rr(c,x-bw,y,bw,bh,24);c.fill();c.strokeStyle=rgba(MD.flow,0.55);c.lineWidth=1.6;rr(c,x-bw,y,bw,bh,24);c.stroke();
  let left=Math.round(clamp(u,0,1)*s.length);ls.forEach((l,i)=>{if(left<=0)return;md_T(c,l.slice(0,left),x-bw+28,y+50+i*44,f);left-=l.length+1;});c.restore();return bh;}
// an answer: its figure in gold, the measure's colour, a line under it, and a gold bar at its left; k its spring. Returns its height
function rd_answer(c,x,y,fig,sub,a,k){if(a<=0.004)return 118;c.save();c.globalAlpha*=a;if(k!=null)ag_about(c,x,y+50,lerp(0.8,1,k));
  c.fillStyle=rgba(MD.agreed,0.9);rr(c,x,y+4,6,104,3);c.fill();md_T(c,fig,x+32,y+62,{w:800,size:60,col:MD.agreed});md_T(c,sub,x+32,y+104,{w:500,size:28,col:MD.soft});c.restore();return 118;}
function rd_genie(c,x,y,w,h,o){o=o||{};return md_window(c,x,y,w,h,{logo:"databricks",product:"Genie One",title:"Ask a question",a:o.a,k:o.k,draw:(cc,b)=>{
  const R=b.x+b.w-24,L=b.x+28;let yy=b.y+28;
  const h1=rd_bubble(cc,R,yy,b.w-48,RD_Q1,o.q||0,ag_in(o.q||0,0,0.06));yy+=h1+34;
  rd_answer(cc,L,yy,"A$1.84 million","so far · Semester 2 2026",ag_in(o.ans||0,0,0.5),o.ans==null?null:rd_k(o.ans,0));yy+=152;
  const cn=ag_in(o.cnt||0,0,0.5);if(cn>0){cc.save();cc.globalAlpha*=cn;md_T(cc,"Counted:",L+32,yy,{w:700,size:28});md_T(cc,"claims approved for casual teaching, plus on-costs",L+32+md_tw(cc,"Counted:",{w:700,size:28})+12,yy,{w:500,size:28,col:MD.soft});cc.restore();}
  yy+=38;md_tag(cc,L+32,yy+20,"on-costs: paid on top of pay",{col:MD.agreed,a:ag_in(o.on||0,0,0.5)});yy+=70;const y2=yy+12;
  // the query it ran, under Show code
  const cd=ag_in(o.code||0,0,0.5);if(cd>0){cc.save();cc.globalAlpha*=cd;md_T(cc,"Show code",L+32,yy+10,{w:700,size:28,col:MD.flow});
    const ph=RD_SQL.length*40+36,py=yy+30;cc.fillStyle="rgba(3,7,16,0.85)";rr(cc,L+20,py,b.w-76,ph,14);cc.fill();cc.strokeStyle="rgba(170,200,245,0.22)";cc.lineWidth=1.2;rr(cc,L+20,py,b.w-76,ph,14);cc.stroke();
    RD_SQL.forEach((l,i)=>{const la=clamp((o.code||0)*RD_SQL.length*1.2-i,0,1);if(la>0)md_T(cc,l,L+44,py+46+i*40,{w:500,size:28,f:"mono",col:i===3||i===4?MD.ink:MD.soft,a:la});});cc.restore();}
  // the next question, and its answer
  yy=y2;
  if((o.q2||0)>0){const h2=rd_bubble(cc,R,yy,b.w*0.6,RD_Q2,o.q2,ag_in(o.q2,0,0.06));yy+=h2+34;
    rd_answer(cc,L,yy,"A$2.21 million","Semester 1 2026 · every claim in",ag_in(o.ans2||0,0,0.5),o.ans2==null?null:rd_k(o.ans2,0));}}});}

/* ---------------------------------------------------------------- a report, and the week it took
   rd_week(c, x, y, u, o): a report request, to the data team, and five working days filling with amber, a wait (u 0 to 1).
   rd_report(c, x, y, s, o): the fortnightly pay report, a stack of 40 pages; on its first page its title and its three figures, lit
   in gold as people read them (o.hl), the other lines dim; o.ret (0 to 1) retires it: the stack greys, and a stamp says retired. */
function rd_week(c,x,y,u,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const w=620,h=232;c.save();c.globalAlpha*=a;if(o.k!=null)ag_about(c,x+w/2,y+h/2,lerp(0.7,1,o.k));
  md_card(c,x,y,w,h,{edge:MD.wait,glow:0.5});md_icon(c,"doc",x+56,y+60,40,MD.wait);md_T(c,o.title||"A report request",x+96,y+56,{w:700,size:32});md_T(c,o.sub||"to the data team",x+96,y+94,{w:500,size:28,col:MD.soft});
  const days=["Thu","Fri","Mon","Tue","Wed"],bw=96,gap=14,x0=x+32;days.forEach((d,i)=>{const bx=x0+i*(bw+gap),by=y+130,f=clamp(u*5-i,0,1);
    c.fillStyle="rgba(255,255,255,0.04)";rr(c,bx,by,bw,56,10);c.fill();c.strokeStyle=rgba(MD.wait,0.35);c.lineWidth=1.4;rr(c,bx,by,bw,56,10);c.stroke();
    if(f>0){c.save();c.beginPath();rr(c,bx,by,bw*f,56,10);c.clip();c.fillStyle=rgba(MD.wait,0.9);rr(c,bx,by,bw,56,10);c.fill();c.restore();}
    md_T(c,d,bx+bw/2,by+38,{w:700,size:28,align:"center",col:f>0.6?MD.navy:MD.soft});});
  md_T(c,"a week",x+w-32,y+56,{w:700,size:28,align:"right",col:MD.wait,a:ag_in(u,0.7,0.3)});c.restore();}
// the one number he needs, as a card: its question, and under it (o.wk, 0 to 1) the week a report used to take, five working days
// filling with amber, a wait
function rd_need(c,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const w=o.w||760,q=o.q||RD_Q1,ql=md_wrap(c,q,w-56,{w:700,size:36}),top=62+ql.length*46+58,wk=o.wk||0,h=top+(wk>0?150*ag_sine(ag_in(wk,0,0.3)):0);c.save();c.globalAlpha*=a;if(o.k!=null)ag_about(c,x+w/2,y+106,lerp(0.7,1,Math.min(1,ag_spr(o.k,0,0.5))));
  const ec=o.edge===undefined?MD.agreed:o.edge;md_card(c,x,y,w,h,{edge:ec,glow:0.5});md_label(c,x+28,y+52,o.kick||"First, one number",{col:ec||MD.soft});
  ql.forEach((l,i)=>md_T(c,l,x+28,y+108+i*46,{w:700,size:36}));
  if(wk>0){const wa=ag_in(wk,0.15,0.3),yy=y+top;c.save();c.globalAlpha*=wa;c.strokeStyle="rgba(170,200,245,0.18)";c.lineWidth=1.2;c.beginPath();c.moveTo(x+24,yy);c.lineTo(x+w-24,yy);c.stroke();
    md_T(c,o.before||"Before: a report from the data team",x+28,yy+46,{w:600,size:28,col:MD.soft});md_T(c,"a week",x+w-28,yy+46,{w:700,size:28,align:"right",col:MD.wait,a:ag_in(wk,0.8,0.2)});
    ["Thu","Fri","Mon","Tue","Wed"].forEach((d,i)=>{const bw=128,bx=x+28+i*(bw+12),by=yy+70,f=clamp((wk-0.2)*1.25*5-i,0,1);
      c.fillStyle="rgba(255,255,255,0.04)";rr(c,bx,by,bw,52,10);c.fill();c.strokeStyle=rgba(MD.wait,0.35);c.lineWidth=1.4;rr(c,bx,by,bw,52,10);c.stroke();
      if(f>0){c.save();c.beginPath();c.rect(bx,by,bw*f,52);c.clip();c.fillStyle=rgba(MD.wait,0.9);rr(c,bx,by,bw,52,10);c.fill();c.restore();}
      md_T(c,d,bx+bw/2,by+36,{w:700,size:28,align:"center",col:f>0.6?MD.navy:MD.soft});});c.restore();}
  c.restore();}
function rd_report(c,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const pw=500*s,ph=660*s,ret=o.ret||0,fan=o.fan==null?1:o.fan;c.save();c.globalAlpha*=a;if(o.k!=null)ag_about(c,x+pw/2,y+ph/2,lerp(0.7,1,o.k));
  // the pages under it, fanned a little: forty of them, as a thick stack's edges
  for(let i=7;i>=1;i--){const dx=i*9*fan,dy=i*7*fan;c.fillStyle="rgba("+(205-i*6)+","+(214-i*6)+","+(230-i*6)+","+(0.9-ret*0.4)+")";rr(c,x+dx,y+dy,pw,ph,10);c.fill();c.strokeStyle="rgba(40,50,70,0.5)";c.lineWidth=1;rr(c,x+dx,y+dy,pw,ph,10);c.stroke();}
  c.save();c.shadowColor="rgba(0,0,0,0.5)";c.shadowBlur=24;c.fillStyle=ret>0?rgba(mix([236,240,248],[150,156,170],ret),1):"rgba(236,240,248,1)";rr(c,x,y,pw,ph,10);c.fill();c.restore();
  const ink=[24,30,44],m=40*s;md_T(c,"The fortnightly pay report",x+m,y+m+30,{w:800,size:Math.max(28,32*s),col:ink});md_T(c,"page 1 of 40",x+m,y+m+72,{w:500,size:28,col:[90,98,116]});
  // its three figures, and the other lines, dim (decoration: thin bars, not words)
  const F=["Pay run total","Casual hours, by faculty","Claims waiting"],hl=o.hl||0;F.forEach((f,i)=>{const fy=y+m+130+i*96*s;
    if(hl>0){c.fillStyle=rgba(MD.agreed,0.35*clamp(hl*3-i,0,1));rr(c,x+m-12,fy-6,pw-2*m+24,74,10);c.fill();}
    md_T(c,f,x+m,fy+28,{w:700,size:28,col:ink});c.fillStyle="rgba(24,30,44,0.35)";rr(c,x+m,fy+44,pw*0.42,10,5);c.fill();});
  c.fillStyle="rgba(24,30,44,"+(0.14-0.06*hl)+")";for(let i=0;i<7;i++){const ly=y+m+430*s+i*30*s;if(ly>y+ph-m)break;rr(c,x+m,ly,(pw-2*m)*(0.6+((i*37)%40)/100),10,5);c.fill();}
  if(ret>0){const sc=[64,74,96];c.save();c.globalAlpha*=ag_in(ret,0.2,0.6);c.translate(x+pw/2,y+ph*0.8);c.rotate(-0.12);const sw=330*Math.max(0.8,s),sh=88;c.strokeStyle=rgba(sc,1);c.lineWidth=5;rr(c,-sw/2,-sh/2,sw,sh,12);c.stroke();
    md_T(c,"RETIRED",0,16,{w:800,size:44,ls:8,align:"center",col:sc});c.restore();}
  c.restore();}

/* ---------------------------------------------------------------- the Genie Agent the data team set up
   rd_agent(c, x, y, w, h, o): the window, its bar naming the Genie Agent and its subject; four tabs, Data, Rules, Examples and Tests,
   and one tab's page at a time: o.tab (0 to 3) the tab, lit over o.tabA as o.prev's light goes, o.pg (0 to 1) its page comes in, o.out
   (0 to 1) it leaves, so two pages
   never show at once. What each page shows comes in by o.p: data {m, f, def}, rules {r, i, reads}, examples {n}, tests {n, run}. */
const RD_TABS=["Data","Rules","Examples","Tests"];
function rd_agent(c,x,y,w,h,o){o=o||{};const p=o.p||{};return md_window(c,x,y,w,h,{logo:"databricks",product:"Genie Agent",title:"Casual teaching cost",a:o.a,k:o.k,draw:(cc,b)=>{
  // the tabs: the one open lit
  let tx=b.x+16;RD_TABS.forEach((s,i)=>{const ta=o.tabA==null?1:o.tabA,on=i===o.tab?ta:i===o.prev?1-ta:0,tw=md_tw(cc,s,{w:700,size:28})+44;
    if(on>0){cc.fillStyle=rgba(MD.flow,0.14*on);rr(cc,tx,b.y+6,tw,52,12);cc.fill();cc.fillStyle=rgba(MD.flow,on);cc.fillRect(tx+12,b.y+56,tw-24,3);}
    md_T(cc,s,tx+22,b.y+42,{w:700,size:28,col:on>0.5?MD.ink:MD.soft});tx+=tw+12;});
  cc.strokeStyle="rgba(170,200,245,0.16)";cc.lineWidth=1.2;cc.beginPath();cc.moveTo(b.x,b.y+62);cc.lineTo(b.x+b.w,b.y+62);cc.stroke();
  const pa=ag_sine(o.pg==null?1:o.pg)*(1-ag_sine(o.out||0));if(pa<=0.004)return;cc.save();cc.globalAlpha*=pa;const X=b.x+16,Y=b.y+100,BW=b.w-32;
  if(o.tab===0)rd_pageData(cc,X,Y,BW,p.data||{});else if(o.tab===1)rd_pageRules(cc,X,Y,BW,p.rules||{});else if(o.tab===2)rd_pageExamples(cc,X,Y,BW,p.examples||{});else if(o.tab===3)rd_pageTests(cc,X,Y,BW,p.tests||{});
  cc.restore();}});}
// its data: one metric view, its measure and its fields; then who defined it, and when
function rd_pageData(c,x,y,w,p){const m=ag_in(p.m||0,0,0.5);if(m<=0.004)return;c.save();c.globalAlpha*=m;
  md_card(c,x,y,w,150,{edge:MD.agreed,glow:0.5});md_icon(c,"contract",x+52,y+52,40,MD.agreed);md_T(c,"casual_teaching_cost",x+96,y+62,{w:600,size:32,f:"mono"});
  md_T(c,"metric view · university.prod_marts",x+96,y+108,{w:500,size:28,col:MD.soft});
  md_label(c,x,y+218,"Its one measure, by",{});const fs=["faculty_name","unit_code","teaching_period"];let fx=x;fs.forEach((s,i)=>{const fa=clamp((p.f||0)*3-i,0,1);const r=md_tag(c,fx,y+280,s,{col:MD.flow,a:fa});fx+=r.w+16;});
  const d=ag_in(p.def||0,0,0.5);if(d>0){md_tag(c,x,y+380,"defined once · September 2026 · Rohan Desai",{col:MD.agreed,icon:"contract",a:d});md_T(c,"how: the next film, Defined in the open",x+4,y+460,{w:500,size:28,col:MD.soft,a:ag_in(p.def,0.4,0.5)});}
  c.restore();}
// its rules, in their owners' words: Rohan's, in gold; Ingrid's, personal data, in lilac with a lock; then the claims it never reads
function rd_pageRules(c,x,y,w,p){const cw=(w-24)/2;
  const r=ag_in(p.r||0,0,0.5);if(r>0){c.save();c.globalAlpha*=r;md_card(c,x,y,cw,300,{edge:MD.agreed,glow:0.5});md_label(c,x+28,y+52,"Rohan Desai · Finance",{col:MD.agreed});
    ["Cost: claims approved for","casual teaching, plus on-costs.","This semester: the teaching","period now running."].forEach((l,i)=>md_T(c,l,x+28,y+108+i*42,{w:500,size:28}));c.restore();}
  const i_=ag_in(p.i||0,0,0.5);if(i_>0){const ix=x+cw+24;c.save();c.globalAlpha*=i_;md_card(c,ix,y,cw,300,{edge:MD.personal,glow:0.5});md_label(c,ix+28,y+52,"Ingrid Holm · HR",{col:MD.personal});
    md_icon(c,"lock",ix+cw-44,y+44,34,MD.personal);["Totals only, never","one person's pay."].forEach((l,k)=>md_T(c,l,ix+28,y+108+k*42,{w:500,size:28}));c.restore();}
  const rd=ag_in(p.reads||0,0,0.5);if(rd>0){c.save();c.globalAlpha*=rd;const gy=y+340;md_card(c,x,gy,w,110,{dash:true,edge:MD.personal});md_icon(c,"table",x+52,gy+55,38,MD.personal);
    md_T(c,"casual claims · one row per claim",x+96,gy+64,{w:600,size:28,col:MD.soft});const nw=md_tw(c,"not in its data",{w:700,size:28})+88;md_tag(c,x+w-24-nw,gy+55,"not in its data",{col:MD.personal,icon:"lock"});c.restore();}}
// its examples: questions Finance asks, each with the query that answers it
const RD_EX=[["Casual teaching cost for Health, this semester?",["SELECT MEASURE(casual_teaching_cost)","WHERE faculty_name = 'Faculty of Health' …"]],
  ["Each faculty's casual teaching cost, Semester 1?",["SELECT faculty_name, MEASURE(…)","WHERE teaching_period = '2026-S1' …"]]];
function rd_pageExamples(c,x,y,w,p){RD_EX.forEach(([q,sql],i)=>{const a=clamp((p.n||0)-i,0,1);if(a<=0.004)return;const ey=y+i*226;c.save();c.globalAlpha*=ag_sine(a);
  md_card(c,x,ey,w,204,{});md_icon(c,"query",x+46,ey+48,34,MD.flow);md_T(c,q,x+84,ey+58,{w:700,size:30});
  sql.forEach((l,k)=>md_T(c,l,x+84,ey+112+k*40,{w:500,size:28,f:"mono",col:MD.soft}));c.restore();});}
// its tests: questions with known answers, run after every change, each one Good
const RD_TESTS=[["Health, Semester 1 2026","A$2.21 million"],["Each faculty, Semester 1 2026","four totals, as known"]];
function rd_pageTests(c,x,y,w,p){md_label(c,x,y+28,"Question",{});md_label(c,x+w*0.5,y+28,"Known answer",{});
  RD_TESTS.forEach(([q,k],i)=>{const a=clamp((p.n||0)-i,0,1);if(a<=0.004)return;const ty=y+60+i*96;c.save();c.globalAlpha*=ag_sine(a);
    md_card(c,x,ty,w,80,{});md_T(c,q,x+24,ty+50,{w:600,size:28});md_T(c,k,x+w*0.5,ty+50,{w:600,size:28,col:MD.agreed});
    const g=clamp((p.run||0)*2-i,0,1);if(g>0)md_pill(c,x+w-80,ty+40,"Good",{col:MD.pass,size:28,a:ag_sine(g),k:g});c.restore();});
  const r=ag_in(p.run||0,0,0.4);if(r>0){md_icon(c,"refresh",x+24,y+300,34,MD.pass,{a:r});md_T(c,"run after every change",x+60,y+310,{w:600,size:28,col:MD.pass,a:r});}}

/* ---------------------------------------------------------------- the dashboard of the fortnightly figures
   rd_dash(c, x, y, w, h, o): an AI/BI dashboard; three tiles, one for each question asked every pay day, each titled with its
   question (o.tiles 0 to 3 come in), their figures (o.fig 0 to 3), the Refreshed chip (o.ref), and the Ask Genie button (o.ask, lit
   with o.askLit); the window round them, its bar naming it, comes in on its own (o.frame), once the questions are there. Its figures
   are totals only. */
const RD_FAC=[["Arts",1950],["Business",3120],["Engineering",2380],["Health",2640]];
function rd_dash(c,x,y,w,h,o){o=o||{};const A=o.a==null?1:o.a,b={x:x+20,y:y+84,w:w-40,h:h-104};if(A<=0.004)return b;
  md_window(c,x,y,w,h,{logo:"databricks",product:"AI/BI dashboard",title:"The fortnightly figures",a:A*(o.frame==null?1:o.frame)});
  const cc=c;cc.save();cc.globalAlpha*=A;{
  const tl=o.tiles||0,fig=o.fig||0,gap=20,tw=(b.w-gap*2)/3,th=b.h-110,ty=b.y+90;
  // the chips along the top: refreshed after each pay run; and Ask Genie
  const rf=ag_in(o.ref||0,0,0.5);if(rf>0)md_tag(cc,b.x,b.y+34,"Refreshed after each pay run",{col:MD.flow,icon:"refresh",a:rf});
  const ak=ag_in(o.ask||0,0,0.5);if(ak>0){const bw2=md_tw(cc,"Ask Genie",{w:700,size:28})+96,bx=b.x+b.w-bw2,by=b.y+6,lit=o.askLit||0;cc.save();cc.globalAlpha*=ak;
    if(lit>0)glow(cc,bx+bw2/2,by+28,160,MD.flow,0.35*lit);cc.fillStyle=rgba(mix([20,34,60],MD.flow,0.25+0.5*lit),1);rr(cc,bx,by,bw2,56,28);cc.fill();cc.strokeStyle=rgba(MD.flow,0.9);cc.lineWidth=2;rr(cc,bx,by,bw2,56,28);cc.stroke();
    md_icon(cc,"query",bx+38,by+28,30,lit>0.5?MD.ink:MD.flow);md_T(cc,"Ask Genie",bx+66,by+38,{w:700,size:28});cc.restore();}
  const Q=["What did the pay run cost?","Casual hours, in each faculty?","Claims still waiting?"];
  Q.forEach((q,i)=>{const a=clamp(tl-i,0,1);if(a<=0.004)return;const tx=b.x+i*(tw+gap);cc.save();cc.globalAlpha*=ag_sine(a);ag_about(cc,tx+tw/2,ty+th/2,lerp(0.85,1,ag_sine(a)));
    md_card(cc,tx,ty,tw,th,{r:16});const ql=md_wrap(cc,q,tw-48,{w:700,size:30});ql.forEach((l,k)=>md_T(cc,l,tx+24,ty+48+k*40,{w:700,size:30}));
    const fa=clamp(fig-i,0,1),fy=ty+48+ql.length*40+30;if(fa>0){cc.save();cc.globalAlpha*=ag_sine(fa);
      if(i===0){md_T(cc,"A$9.6 million",tx+24,fy+64,{w:800,size:56,col:MD.agreed});md_T(cc,"paid to 2,960 people",tx+24,fy+108,{w:500,size:28,col:MD.soft});md_T(cc,"pay day · 5 November",tx+24,fy+146,{w:500,size:28,col:MD.soft});}
      else if(i===1){const mx=3120,bwm=tw-48-150;RD_FAC.forEach(([f,n],k)=>{const yy=fy+20+k*58,u=clamp(fa*1.5-k*0.15,0,1);md_T(cc,f,tx+24,yy+20,{w:600,size:28});
          cc.fillStyle=rgba(MD.agreed,0.85);rr(cc,tx+24,yy+30,bwm*n/mx*ag_sine(u),12,6);cc.fill();md_T(cc,n.toLocaleString("en-AU"),tx+tw-24,yy+20,{w:600,size:28,align:"right",col:MD.soft});});
        md_T(cc,"10,090 hours in all",tx+24,fy+20+4*58+30,{w:600,size:28,col:MD.soft});}
      else{md_T(cc,"143",tx+24,fy+64,{w:800,size:56,col:MD.wait});md_T(cc,"claims waiting for approval",tx+24,fy+108,{w:500,size:28,col:MD.soft});md_T(cc,"for the pay run of 19 November",tx+24,fy+146,{w:500,size:28,col:MD.soft});}
      cc.restore();}
    cc.restore();});}
  cc.restore();return b;}
// who it goes to: a row of three tags, each with a person
function rd_subs(c,x,y,a){if(a<=0.004)return;let xx=x;md_T(c,"Sent to",xx,y+10,{w:700,size:28,col:MD.soft,a});xx+=md_tw(c,"Sent to",{w:700,size:28})+20;
  ["payroll","Finance","the four faculties"].forEach((s,i)=>{const r=md_tag(c,xx,y,s,{col:MD.ink,icon:"person",a:a*ag_in(a,i*0.15,0.4)});xx+=r.w+14;});}
