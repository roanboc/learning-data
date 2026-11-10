/* ===== Proof it held: the agreement, its four proofs, and the tools' pages =====
   The agreement as An agreement first draws it, its four promises (Who, Never, Where, Ends) word for word from the module's shared
   numbers; the compact card of its four proofs, each a dashed slot until a record proves it, then a green tick; and the pages the
   proofs are read from, drawn as the tools lay them out on 5 November 2026 and named as their docs name them: Databricks (Catalog
   Explorer's Permissions and Lineage, the SQL editor, an alert) and Microsoft Entra ID (an access package and its access review, in
   My Access). Every name starts with ph_ or PH_; the place is phHall, the hall, where the people stand and the pages
   come up on the glass. */

AG_PLACES.phHall=c=>dp_paintHall(c,{seed:17,horizon:700,vx:980,pools:[[330,960,520,0.11],[1600,930,560,0.09]]});

/* ---------------------------------------------------------------- the agreement
   Its card, as An agreement first sets it down (a glass card with a folded corner and the gold chip of its signature): the number and
   what it's for, then the four lines this film proves, word for word; o.lit (0 to 3) lights one line, o.dim the others, o.proof[k]
   (0 to 2) brings in line k's slot: 0 none, 0 to 1 a dashed "proof?" slot, 1 to 2 the slot fills with a green tick */
const PH_LINES=[["Who","The study's group, “Health progress study”, each member with a signed confidentiality agreement"],
  ["Never","Anything that names a learner; anything about their health"],
  ["Where","On the platform, in the study's own space; nothing downloaded"],
  ["Ends","30 June 2027; then the study's copy is deleted, and the totals stay"]];
function ph_agreement(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,lw=w-260,L=[];let yy=y+150;
  PH_LINES.forEach((ln,k)=>{const ls=ag_wrap(ctx,ln[1],lw,{w:600,size:28});L.push({k,y:yy,ls});yy+=ls.length*40+26;});
  const h=yy-y+16,bb={x,y,w,h,rows:L};if(a<=0||o.measure)return bb;ctx.save();ctx.globalAlpha*=a;
  dp_panel(ctx,x,y,w,h,{col:"cyan",r:20,behind:o.behind,glowR:40});
  // the folded corner
  ctx.save();ctx.beginPath();ctx.moveTo(x+w-46,y);ctx.lineTo(x+w,y+46);ctx.lineTo(x+w-46,y+46);ctx.closePath();ctx.fillStyle="rgba(190,245,245,0.22)";ctx.fill();ctx.strokeStyle=rgba(DP.ice,0.6);ctx.lineWidth=1.5;ctx.stroke();ctx.restore();
  dp_T(ctx,"DATA SHARING AGREEMENT 2026-14",x+32,y+52,{w:800,size:28,ls:3,col:"cyan"});
  dp_T(ctx,"For a study in the Faculty of Health",x+32,y+100,{w:700,size:34});
  dp_chip(ctx,x+w-118,y+66);
  for(const r of L){const lit=o.lit===r.k,dim=o.lit!=null&&!lit?(o.dim==null?0.45:o.dim):1;ctx.save();ctx.globalAlpha*=dim;
    if(lit){ctx.save();ctx.fillStyle=rgba(dp_f("cyan"),0.10);rr(ctx,x+16,r.y-34,w-32,r.ls.length*40+18,12);ctx.fill();ctx.restore();}
    dp_T(ctx,PH_LINES[r.k][0],x+32,r.y,{w:800,size:28,col:lit?"cyan":"mut"});
    r.ls.forEach((l,i)=>dp_T(ctx,l,x+180,r.y+i*40,{w:600,size:28}));ctx.restore();
    const p=o.proof?o.proof[r.k]||0:0;if(p>0)ph_proofSlot(ctx,x+w-60,r.y-10,p);}
  ctx.restore();return bb;}
// a proof's slot: a dashed ring that comes in (p 0 to 1), then a green tick that draws in it (p 1 to 2)
function ph_proofSlot(ctx,cx,cy,p){const u=clamp(p,0,1),v=clamp(p-1,0,1);ctx.save();ctx.globalAlpha*=ag_in(u,0,0.6);
  if(v<1){ctx.save();ctx.globalAlpha*=1-v;ctx.setLineDash([6,6]);ctx.strokeStyle=rgba(DP.T.mut,0.9);ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(cx,cy,21,0,TAU);ctx.stroke();ctx.restore();}
  if(v>0)dp_tick(ctx,cx,cy,"green",v);ctx.restore();}

/* ph_proofs(ctx, x, y, o): the agreement's four proofs, compact: "Agreement 2026-14" and a row for each promise, its slot (o.proof[k],
   as ph_proofSlot) and, once it's proved, what proved it (o.by[k], quieter); o.lit (0 to 3) lights a row. 520 wide; returns its box */
const PH_BY=["the grants, and the access review","the morning check, and lineage","lineage, and the audit log","the end date, checked on 1 July"];
function ph_proofs(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,w=o.w||540,rowH=o.by?96:66,h=96+4*rowH+10,bb={x,y,w,h};if(a<=0||o.measure)return bb;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  dp_panel(ctx,x,y,w,h,{col:"cyan",r:20,behind:o.behind,glowR:36});
  dp_T(ctx,"AGREEMENT 2026-14",x+30,y+50,{w:800,size:28,ls:3,col:"cyan"});
  ctx.fillStyle=rgba(DP.T.mut,0.35);ctx.fillRect(x+30,y+72,w-60,1.4);
  PH_LINES.forEach((ln,k)=>{const ry=y+96+k*rowH+34,lit=o.lit===k;
    if(lit){ctx.save();ctx.fillStyle=rgba(dp_f("cyan"),0.12);rr(ctx,x+12,ry-36,w-24,rowH-8,12);ctx.fill();ctx.restore();}
    dp_T(ctx,ln[0],x+30,ry,{w:800,size:30,col:lit?"cyan":"ink"});
    const p=o.proof?o.proof[k]||0:0;if(p>0)ph_proofSlot(ctx,x+w-50,ry-10,p);
    if(o.by&&p>1)dp_T(ctx,PH_BY[k],x+30,ry+38,{w:600,size:28,col:"mut",a:ag_in(p,1.2,0.6)});});
  ctx.restore();return bb;}

// a calendar card: the day, and what it is
function ph_calendar(ctx,x,y,day,what,o){o=o||{};const a=o.a==null?1:o.a,w=Math.max(dp_tw(ctx,day,{w:800,size:40}),dp_tw(ctx,what,{w:600,size:28}))+64,h=128;if(a<=0)return{x,y,w,h};
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));dp_panel(ctx,x,y,w,h,{col:o.col||"cyan",r:18,behind:o.behind,glowR:30});
  ctx.fillStyle=rgba(dp_f(o.col||"cyan"),1);rr(ctx,x+32,y-8,12,26,5);ctx.fill();rr(ctx,x+w-44,y-8,12,26,5);ctx.fill();
  dp_T(ctx,day,x+32,y+62,{w:800,size:40});dp_T(ctx,what,x+32,y+104,{w:600,size:28,col:"mut"});ctx.restore();return{x,y,w,h};}
// a person's name card: their name, and what they do
function ph_name(ctx,x,y,name,role,o){o=o||{};const a=o.a==null?1:o.a,w=Math.max(dp_tw(ctx,name,{w:700,size:30}),dp_tw(ctx,role,{w:600,size:28}))+48,h=104,x0=o.align==="center"?x-w/2:x;if(a<=0)return{x:x0,y,w,h};
  ctx.save();ctx.globalAlpha*=a;dp_panel(ctx,x0,y,w,h,{col:"cyan",r:16,behind:o.behind,glowR:26});dp_T(ctx,name,x0+24,y+44,{w:700,size:30});dp_T(ctx,role,x0+24,y+82,{w:600,size:28,col:"mut"});ctx.restore();return{x:x0,y,w,h};}

/* ---------------------------------------------------------------- Databricks: the grants
   Catalog Explorer's Permissions, for the study's group: what it may use and read, on which shelf, each grant made from the contract.
   o.hand (0 to 1) brings in the line under the table, o.code the line the grants are made from. */
function ph_grants(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  const b=dp_page(ctx,x,y,w,h,{tool:"databricks",name:"Databricks",where:"Catalog Explorer · Permissions",title:"Grants to the study's group",behind:o.behind});
  // a row for each grant: the principal and the object on one line, the privileges under the object
  const R=[["registrar.core","USE SCHEMA · SELECT"],["studies.health_progress","USE SCHEMA · SELECT · CREATE TABLE · MODIFY"]],ox=b.x+430;
  dp_T(ctx,"Principal",b.x,b.y+30,{w:700,size:28,col:"mut"});dp_T(ctx,"Object, and its privileges",ox,b.y+30,{w:700,size:28,col:"mut"});
  ctx.fillStyle=rgba(DP.T.mut,0.4);ctx.fillRect(b.x,b.y+44,w-64,1.4);
  R.forEach((r,i)=>{const ra=o.rows==null?1:clamp(o.rows-i,0,1);if(ra<=0)return;const yy=b.y+44+i*108;ctx.save();ctx.globalAlpha*=ra;
    dp_T(ctx,"health_progress_study",b.x,yy+46,{w:500,size:28,f:"mono",col:"cyan"});dp_T(ctx,r[0],ox,yy+46,{w:500,size:28,f:"mono"});
    dp_T(ctx,r[1],ox,yy+88,{w:600,size:28,col:"mut"});if(i<R.length-1){ctx.fillStyle=rgba(DP.T.mut,0.22);ctx.fillRect(b.x,yy+108,w-64,1.2);}ctx.restore();});
  const yb=b.y+44+2*108;
  if(o.code>0){ctx.save();ctx.globalAlpha*=o.code;dp_T(ctx,"Made from the agreement's contract, as code:",b.x,yb+50,{w:600,size:28,col:"mut"});
    dp_T(ctx,"# Data sharing agreement 2026-14, until 30 June 2027",b.x,yb+94,{w:500,size:28,f:"mono",col:"green"});ctx.restore();}
  if(o.hand>0){const pw=dp_tw(ctx,"no grant names a person",{w:700,size:28})+36;dp_pill(ctx,b.x,yb+164,"no grant names a person","green",{a:o.hand});dp_pill(ctx,b.x+pw+20,yb+164,"made by hand: 0","green",{a:o.hand2==null?o.hand:o.hand2});}
  ctx.restore();}

/* ---------------------------------------------------------------- Microsoft Entra ID: the group, its access package and its review
   ph_review: the review as Mei sees it in My Access: its settings, and a row for each member with her decision (o.dec[k]: 0 to 1
   brings in "Approve" or "Deny"); o.note (0 to 1) Elena's move, o.closed (0 to 1) the review's close, o.out (0 to 1) Elena's row
   leaving the group as the results are applied */
const PH_MEM=[["Anil Kurian","Faculty of Health · member since 12 Oct 2026"],["Elena Lindgren","Research assistant · member since 9 Nov 2026"]];
function ph_review(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  const b=dp_page(ctx,x,y,w,h,{tool:"entra",name:"Microsoft Entra ID",where:"My Access · Access reviews",title:"Health progress study: access review",behind:o.behind});
  const F=[["Review frequency","Quarterly"],["Duration","7 days"],["Reviewer","Mei Tanaka"],["If reviewers don't respond","Remove access"]],cw=(w-64)/2;
  F.forEach((f,i)=>{const fa=o.fields==null?1:clamp(o.fields*4-i,0,1);if(fa<=0)return;ctx.save();ctx.globalAlpha*=fa;const fx=b.x+(i%2)*cw,fy=b.y+Math.floor(i/2)*92;dp_field(ctx,fx,fy+20,f[0],f[1],{col:i===3?"coral":"ink"});ctx.restore();});
  const ry=b.y+204;ctx.fillStyle=rgba(DP.T.mut,0.35);ctx.fillRect(b.x,ry,w-64,1.4);
  PH_MEM.forEach((m,k)=>{const ma=o.members==null?1:clamp(o.members*2-k,0,1),out=k===1?clamp(o.out||0,0,1):0;if(ma<=0)return;const yy=ry+30+k*120;
    ctx.save();ctx.globalAlpha*=ma*(1-0.75*out);dp_personPic(ctx,b.x+36,yy+44,"cyan");
    dp_T(ctx,m[0],b.x+100,yy+38,{w:700,size:32});dp_T(ctx,m[1],b.x+100,yy+80,{w:600,size:28,col:"mut"});
    const d=o.dec?o.dec[k]||0:0;if(d>0)dp_pill(ctx,b.x+w-64,yy+56,k===0?"Approve":"Deny",k===0?"green":"coral",{align:"right",a:ag_in(d,0,0.5)});
    if(k===1&&o.note>0){const nx=b.x+100+dp_tw(ctx,m[0],{w:700,size:32})+28;dp_pill(ctx,nx,yy+40,"moved to another project · 14 Dec","grey",{a:o.note,size:28});}
    if(k===1&&o.acct>0)dp_pill(ctx,b.x+w-64,yy+82,"her account: still active","cyan",{align:"right",a:o.acct,size:28});
    ctx.restore();});
  if(o.closed>0)dp_T(ctx,"Closes Tue 19 Jan · results applied",b.x,y+h-34,{w:700,size:28,col:"green",a:o.closed});
  ctx.restore();}
// the group, in the directory: its members, each with when their place ends (o.until 0 to 1), and who's left in it
function ph_group(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,rows=o.rows||PH_MEM.map(m=>m[0]),h=150+rows.length*84+(o.foot?60:0);if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  dp_panel(ctx,x,y,w,h,{col:"cyan",r:20,behind:o.behind,glowR:36});
  const im=typeof LOGO!=="undefined"&&LOGO.groups;if(im&&im.width)ctx.drawImage(im,x+28,y+24,44*im.width/im.height,44);
  dp_T(ctx,"Group · Microsoft Entra ID",x+90,y+56,{w:600,size:28,col:"mut"});dp_T(ctx,"Health progress study",x+28,y+112,{w:700,size:36});
  rows.forEach((r,k)=>{const ra=o.rowA?o.rowA(k):1;if(ra<=0)return;const yy=y+150+k*84;ctx.save();ctx.globalAlpha*=ra;dp_personPic(ctx,x+60,yy+46,"cyan");
    dp_T(ctx,r,x+120,yy+56,{w:700,size:30});if(o.until)dp_T(ctx,"until 30 Jun 2027",x+w-28,yy+56,{w:600,size:28,col:"green",align:"right",a:o.until});ctx.restore();});
  if(o.foot)dp_T(ctx,o.foot,x+28,y+h-30,{w:700,size:28,col:o.footCol||"green",a:o.footA==null?1:o.footA});
  ctx.restore();return{x,y,w,h};}
/* ---------------------------------------------------------------- the morning check
   A Databricks SQL alert: the query that looks for the two gaps every morning at 07:00, and how many it finds today (o.n1, o.n2);
   a gap found turns its row coral and sends the alert (o.sent 0 to 1) */
function ph_alert(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  const b=dp_page(ctx,x,y,w,h,{tool:"databricks",name:"Databricks",where:"SQL · Alerts",title:"Morning check · every day at 07:00",behind:o.behind});
  const G=[["A column classification finds personal, with no class",o.n1||0],["A class to hide, with no policy for it",o.n2||0]];
  G.forEach((g,k)=>{const ga=o.rows==null?1:clamp(o.rows*2-k,0,1);if(ga<=0)return;const yy=b.y+26+k*104,bad=g[1]>0;ctx.save();ctx.globalAlpha*=ga;
    if(bad){ctx.save();ctx.fillStyle=rgba(dp_f("coral"),0.14);rr(ctx,b.x-12,yy-6,w-40,88,12);ctx.fill();ctx.restore();}
    dp_T(ctx,(k+1)+".",b.x,yy+50,{w:800,size:30,col:"cyan"});dp_T(ctx,g[0],b.x+46,yy+50,{w:600,size:30});
    const n=String(g[1]);dp_pill(ctx,b.x+w-64,yy+52,n+(g[1]===1?" found":" found"),bad?"coral":"green",{align:"right"});ctx.restore();});
  if(o.day)dp_T(ctx,o.day,b.x,b.y+280,{w:700,size:30,col:o.dayCol||"mut",a:o.dayA==null?1:o.dayA});
  if(o.sent>0){const t="Alert sent to Yusuf Demir and Sam Okafor";dp_slip(ctx,b.x,b.y+316,t,"coral",{ink:true,a:o.sent,size:28,behind:o.behind});}
  ctx.restore();}

/* the new column, on its table: the exam support table (Tags that travel's registrar.support.exam_support, loaded straight in each
   night by registrar-loader, its classes set from the registrar's own file, which Mei owns) as Catalog Explorer lists its columns,
   with mobile at the foot: o.found (0 to 1) classification's finding, o.cls (0 to 1) the class Mei gives it (direct); o.slot (0 to 1)
   the empty class slot, o.q its question mark. Special has a second rim, as Know what you hold draws it */
const PH_SUP=[["student_number","direct"],["exam_support","special"],["mobile",null]];
function ph_columns(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  const b=dp_page(ctx,x,y,w,h,{tool:"databricks",name:"Databricks",where:"Catalog Explorer · Columns",title:"registrar.support.exam_support",behind:o.behind});
  dp_T(ctx,"Column",b.x,b.y+30,{w:700,size:28,col:"mut"});dp_T(ctx,"Class",b.x+390,b.y+30,{w:700,size:28,col:"mut"});dp_T(ctx,"Classification",b.x+640,b.y+30,{w:700,size:28,col:"mut"});
  ctx.fillStyle=rgba(DP.T.mut,0.4);ctx.fillRect(b.x,b.y+48,w-64,1.4);
  PH_SUP.forEach((r,k)=>{const yy=b.y+110+k*76,isNew=r[1]===null,ra=isNew?(o.newA==null?1:o.newA):1;if(ra<=0)return;ctx.save();ctx.globalAlpha*=ra;
    if(isNew&&o.hl>0){ctx.save();ctx.fillStyle=rgba(dp_f(o.cls>0.5?"violet":"coral"),0.14*o.hl);rr(ctx,b.x-12,yy-38,w-40,56,10);ctx.fill();ctx.restore();}
    dp_T(ctx,r[0],b.x,yy,{w:500,size:30,f:"mono"});
    if(!isNew){const pw=dp_pill(ctx,b.x+390,yy+2,r[1],r[1]==="indirect"?"violet2":"violet",{size:28,glow:6});
      if(r[1]==="special"){ctx.save();ctx.strokeStyle=rgba(mix(dp_f("violet"),[255,255,255],0.45),0.9);ctx.lineWidth=1.6;rr(ctx,b.x+390-5,yy+2-48+12-5,pw+10,58,29);ctx.stroke();ctx.restore();}}
    else{const c=clamp(o.cls||0,0,1);if(c<1&&(o.slot||0)>0){ctx.save();ctx.globalAlpha*=(o.slot||0)*(1-c);ctx.setLineDash([7,6]);ctx.strokeStyle=rgba(DP.T.mut,0.9);ctx.lineWidth=2;rr(ctx,b.x+390,yy-30,150,44,22);ctx.stroke();ctx.restore();
        if(o.q>0)dp_T(ctx,"?",b.x+465,yy+2,{w:800,size:32,align:"center",col:"cyan",a:o.q*(1-c)});}
      if(c>0)dp_pill(ctx,b.x+390,yy+2,"direct","violet",{size:28,glow:6,a:c});
      if(o.found>0)dp_T(ctx,"phone number",b.x+640,yy,{w:700,size:30,col:"cyan",a:o.found});}
    ctx.restore();});
  ctx.restore();}

/* the audit log: a query on system.access.audit in the SQL editor, and its rows; o.rows the rows ([when, who, what]), o.n how many show
   (0 to rows), o.foot a line under them */
function ph_audit(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  const b=dp_page(ctx,x,y,w,h,{tool:"databricks",name:"Databricks",where:"SQL editor · system.access.audit",title:o.title||"Who read it",behind:o.behind});
  const rows=(o.rows||[]).map((r,i)=>{const ra=o.n==null?1:clamp(o.n-i,0,1);return[{t:r[0],a:ra},{t:r[1],a:ra,col:r[3]||"cyan",w:700},{t:r[2],a:ra,col:"mut"}];});
  const yb=dp_rows(ctx,b.x,b.y,[{t:"When",w:330},{t:"Who",w:420},{t:"Read",w:w-64-750}],rows,{lh:62});
  if(o.foot)dp_pill(ctx,b.x,yb+50,o.foot,o.footCol||"green",{a:o.footA==null?1:o.footA});
  ctx.restore();}

// the check on the agreement's end: three lines, each ticked in turn (o.p[k] 0 to 1)
const PH_END=["The study's group: empty","Grants naming 2026-14: none","The study's space: gone"];
function ph_endCheck(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=126+PH_END.length*66,bb={x,y,w,h};if(a<=0)return bb;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));dp_panel(ctx,x,y,w,h,{col:"green",r:20,behind:o.behind,glowR:36});
  dp_T(ctx,"THU 1 JUL 2027 · YUSUF'S CHECK",x+30,y+52,{w:800,size:28,ls:3,col:"green"});ctx.fillStyle=rgba(DP.T.mut,0.35);ctx.fillRect(x+30,y+74,w-60,1.4);
  PH_END.forEach((l,k)=>{const p=o.p?o.p[k]||0:0,yy=y+124+k*66;dp_tick(ctx,x+52,yy-10,"green",p);dp_T(ctx,l,x+94,yy,{w:700,size:30,a:0.35+0.65*clamp(p*2,0,1)});});
  ctx.restore();return bb;}

/* Yusuf's register of agreements: the agreement filed, and behind it, its proofs one by one (o.n how many, 0 to 5) */
const PH_FILED=["Access reviews, every quarter","Morning checks, every day","Lineage of the protected columns","Who read the study's tables","The end, checked on 1 July"];
function ph_register(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=150+PH_FILED.length*56,bb={x,y,w,h};if(a<=0)return bb;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));dp_panel(ctx,x,y,w,h,{col:"cyan",r:20,behind:o.behind,glowR:36});
  dp_T(ctx,"REGISTER OF AGREEMENTS",x+30,y+52,{w:800,size:28,ls:3,col:"cyan"});dp_T(ctx,"2026-14 · ended 30 June 2027",x+30,y+100,{w:700,size:32});
  PH_FILED.forEach((l,k)=>{const p=clamp((o.n||0)-k,0,1);if(p<=0)return;const yy=y+150+k*56+20;ctx.save();ctx.globalAlpha*=ag_in(p,0,0.7);
    ctx.fillStyle=rgba(dp_f("green"),1);rr(ctx,x+32,yy-22,10,28,4);ctx.fill();dp_T(ctx,l,x+60,yy,{w:600,size:28});ctx.restore();});
  ctx.restore();return bb;}
