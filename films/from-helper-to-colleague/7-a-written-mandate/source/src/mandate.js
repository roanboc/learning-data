/* ===== A mandate, written and enforced: the page, and where each line is held =====
     WM_ROWS            the mandate, as one page: each row a line of governance/8-mandates/census-agent.yml, said plainly
     wm_page(ctx, x, y, w, o)   the page: its file at the top, its title, and its rows; o.show(i) 0..1 brings row i in, o.lit(i) 0..1
                        lights it (o.litCol(i) its colour), o.sign 0..1 draws Jun's signature, o.approve 0..1 Noor's tick, o.a, o.k;
                        returns {x, y, w, h, rows: [{x, y, w, h}]}, each row's box
     wm_detail(ctx, x, y, w, o) a row of the page, opened up: a kicker, a title and its items, one under another, each with a mark
                        ("n" its number, "tick", "no", "lock", "warn", or none); o.items [{text, mark, a, col, f}]; returns its box
     wm_place(ctx, x, y, w, o)  where a line is held: a tool's card (kicker, title) and its settings as rows, the name at the left and its
                        value at the right in mono; o.rows [{name, value, a, col, lit}]
     wm_report(ctx, x, y, w, o) the census agent's report, as Jun found it: its time, the night build, the cause, the fix, the pull
                        request, and (o.measures) the measures
     wm_pr(ctx, x, y, w, o)     a pull request: its title, who opened it, its rows (who reviewed, who approved)
     wm_code(ctx, x, y, w, o)   the line of code that left three students out: valid_from < census_date, then valid_from <= census_date
     wm_switches(ctx, x, y, w, o) the switch: two of them, one in each tool, both on
     wm_versions(ctx, x, y, w, o) a table's versions, with who wrote each one and when, and the one before restored
     wm_stageTable(ctx, x, y, w, o) the census agent's kinds of task, each with its stage (numbers.md) */

// the page's rows: what each says, in the order the voice names them; the last two are the signature and the approval
const WM_ROWS=[["In test","Find why the night build failed, and fix it"],["In production","Find the cause, and draft the fix"],
  ["Folders","models/ and macros/, on its own branch"],["Never","A test, a seed, a contract or a definition"],
  ["Checks","First: has tonight's copy arrived?"],["Limits","10 rounds · 1 hour · a set budget"],
  ["Switch","Sam turns it off, in both tools"],["Undo","Revert the change, restore the table"],
  ["Signed","Jun Park, owner · 30 October 2026"],["Approved","Noor Rahman, as a second person"]];
const WM_SIGN=8,WM_APPROVE=9,WM_FILE="governance/8-mandates/census-agent.yml";
const WM_PG={lab:228,rowH:58,top:132};
function wm_pageRows(ctx,x,y,w){const P=WM_PG,vw=w-P.lab-40,out=[];let yy=y+P.top;
  WM_ROWS.forEach((r,i)=>{const ls=wm_wrap(ctx,r[1],vw,{w:600,size:28}),h=P.rowH+(ls.length-1)*36;out.push({x:x+14,y:yy,w:w-28,h,ls});yy+=h;});
  return{rows:out,h:yy-y+20};}
function wm_page(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,L=wm_pageRows(ctx,x,y,w),h=L.h,bb={x,y,w,h,rows:L.rows};if(a<=0)return bb;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,o.k));
  ag_box(ctx,x,y,w,h,22,{edge:AG.blue,edgeA:0.7});
  wm_fileIcon(ctx,x+40,y+46,rgba(AG.blue,0.95),false);ag_T(ctx,WM_FILE,x+70,y+56,{w:500,size:28,f:"mono",col:AG.blue});
  ag_T(ctx,"The census agent's mandate",x+28,y+108,{w:700,size:36});
  L.rows.forEach((b,i)=>{const s=o.show?o.show(i):1;if(s<=0)return;const lit=o.lit?o.lit(i):0,col=(o.litCol&&o.litCol(i))||AG.blue;ctx.save();ctx.globalAlpha*=clamp(s*1.6,0,1);
    const dx=(1-ag_eo(clamp(s,0,1)))*-18;ctx.translate(dx,0);
    if(lit>0){ctx.fillStyle=rgba(col,0.11*lit);rr(ctx,b.x,b.y+4,b.w,b.h-8,12);ctx.fill();ctx.strokeStyle=rgba(col,0.5*lit);ctx.lineWidth=2;rr(ctx,b.x,b.y+4,b.w,b.h-8,12);ctx.stroke();}
    if(i>0){ctx.strokeStyle="rgba(60,50,40,0.1)";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(b.x+14,b.y+2);ctx.lineTo(b.x+b.w-14,b.y+2);ctx.stroke();}
    const sg=i===WM_SIGN||i===WM_APPROVE;
    ag_T(ctx,WM_ROWS[i][0].toUpperCase(),b.x+16,b.y+39,{w:700,size:28,ls:3,col:sg?AG.kick:mix(AG.blue,col,lit)});
    b.ls.forEach((l,j)=>ag_T(ctx,l,x+WM_PG.lab,b.y+39+j*36,{w:600,size:28,col:AG.ink,f:i===2&&j===0&&l.indexOf("/")>0?undefined:undefined}));
    // Jun's signature: a pen line drawn under his name; Noor's approval: a green tick
    if(i===WM_SIGN&&o.sign>0){const sx=x+w-150,sy=b.y+34;ctx.save();ctx.strokeStyle=rgba(AG.ink,0.8);ctx.lineWidth=2.6;ctx.lineCap="round";ctx.lineJoin="round";
      const pts=[];for(let k=0;k<=40;k++){const u=k/40;pts.push([sx-6+u*118,sy+Math.sin(u*TAU*2.2)*9*(1-u*0.5)-u*8]);}
      ctx.beginPath();pts.slice(0,1+Math.round(40*clamp(o.sign,0,1))).forEach((p,k)=>k?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();ctx.restore();}
    if(i===WM_APPROVE&&o.approve>0){ctx.save();ctx.globalAlpha*=clamp(o.approve,0,1);const tx=x+w-92,ty=b.y+28;ag_about(ctx,tx,ty,lerp(0.6,1,Math.min(1,ag_spr(o.approve,0,0.5))));ag_tick(ctx,tx,ty,30,rgba(AG.green,1),4.4);ctx.restore();}
    ctx.restore();});
  ctx.restore();return bb;}

// a row of the page opened up, at the right of the page
function wm_detail(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,items=o.items||[],inner=w-56-(o.marks===false?0:52);
  const tl=o.title?wm_wrap(ctx,o.title,w-56,{w:700,size:36}):[],L=items.map(it=>wm_wrap(ctx,it.text,inner,{w:600,size:it.size||30}));
  let h=28+(o.kick?40:0)+tl.length*46+(tl.length?10:0);L.forEach(ls=>h+=ls.length*40+18);h+=18;const bb={x,y,w,h,items:[]};
  let yy=y+28+(o.kick?40:0)+tl.length*46+(tl.length?10:0);L.forEach((ls,i)=>{bb.items.push({x,y:yy,w,h:ls.length*40+18});yy+=ls.length*40+18;});
  if(a<=0)return bb;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,o.k));
  ag_box(ctx,x,y,w,h,22,{edge:o.edge||null,edgeA:o.edgeA==null?0.75:o.edgeA});if(o.dashed)wm_dash(ctx,x,y,w,h,22,o.dashCol||AG.mut,o.dashed);
  let ty=y+28;if(o.kick){ag_T(ctx,String(o.kick).toUpperCase(),x+28,ty+22,{w:700,size:28,ls:3.5,col:o.kickCol||AG.blue});ty+=40;}
  tl.forEach(l=>{ty+=40;ag_T(ctx,l,x+28,ty,{w:700,size:36});ty+=6;});
  items.forEach((it,i)=>{const ia=it.a==null?1:it.a;if(ia<=0)return;const b=bb.items[i],col=it.col||AG.ink,mk=it.mark;ctx.save();ctx.globalAlpha*=clamp(ia,0,1);
    const mx=x+46,my=b.y+30,tx=o.marks===false?x+28:x+80;
    if(it.lit>0){ctx.fillStyle=rgba(it.litCol||AG.blue,0.1*it.lit);rr(ctx,x+14,b.y+2,w-28,b.h-4,12);ctx.fill();}
    if(mk==="n"){ctx.fillStyle=rgba(it.mcol||AG.blue,0.14);ctx.beginPath();ctx.arc(mx,my,19,0,TAU);ctx.fill();ag_T(ctx,String(it.n||i+1),mx,my+10,{w:700,size:28,align:"center",col:it.mcol||AG.blue});}
    else if(mk==="tick")ag_tick(ctx,mx,my,26,rgba(it.mcol||AG.green,1),4.2);else if(mk==="no"){ctx.save();ctx.strokeStyle=rgba(it.mcol||AG.amber,1);ctx.lineWidth=4;ctx.lineCap="round";
      ctx.beginPath();ctx.moveTo(mx-11,my-11);ctx.lineTo(mx+11,my+11);ctx.moveTo(mx+11,my-11);ctx.lineTo(mx-11,my+11);ctx.stroke();ctx.restore();}
    else if(mk==="lock")ag_lock(ctx,mx,my+4,28,rgba(it.mcol||AG.blue,1));else if(mk==="warn")ag_warn(ctx,mx,my,30,rgba(it.mcol||AG.amber,1));
    else if(mk==="undo")wm_undoIcon(ctx,mx,my,34,rgba(it.mcol||AG.blue,1));else if(mk==="gear")wm_gear(ctx,mx,my,16,rgba(it.mcol||AG.blue,1),0);
    L[i].forEach((l,j)=>ag_T(ctx,l,tx,b.y+40+j*40,{w:600,size:it.size||30,col,f:it.f}));ctx.restore();});
  ctx.restore();return bb;}

// where a line is held: a tool's own card, its settings as rows (a name, and its value in mono)
function wm_place(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,rows=o.rows||[],tl=o.title?wm_wrap(ctx,o.title,w-56,{w:700,size:34}):[];
  const h=28+40+tl.length*44+12+rows.length*(o.rowH||92)+16,bb={x,y,w,h,rows:[]};let yy=y+28+40+tl.length*44+12;
  rows.forEach(r=>{bb.rows.push({x:x+14,y:yy,w:w-28,h:(o.rowH||92)-8});yy+=o.rowH||92;});if(a<=0)return bb;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,o.k));ag_box(ctx,x,y,w,h,22,{edge:o.edge||AG.blue,edgeA:0.75});
  ag_T(ctx,String(o.kick||"").toUpperCase(),x+28,y+50,{w:700,size:28,ls:3.5,col:o.kickCol||AG.blue});
  let ty=y+68;tl.forEach(l=>{ty+=40;ag_T(ctx,l,x+28,ty,{w:700,size:34});ty+=4;});
  rows.forEach((r,i)=>{const ra=r.a==null?1:r.a;if(ra<=0)return;const b=bb.rows[i];ctx.save();ctx.globalAlpha*=clamp(ra,0,1);
    if(r.lit>0){ctx.fillStyle=rgba(r.col||AG.blue,0.1*r.lit);rr(ctx,b.x,b.y,b.w,b.h,12);ctx.fill();ctx.strokeStyle=rgba(r.col||AG.blue,0.45*r.lit);ctx.lineWidth=2;rr(ctx,b.x,b.y,b.w,b.h,12);ctx.stroke();}
    ag_T(ctx,r.name,b.x+16,b.y+34,{w:600,size:28,col:AG.mut});ag_T(ctx,r.value,b.x+16,b.y+72,{w:500,size:30,f:"mono",col:r.vcol||AG.ink});
    if(r.mark==="tick")ag_tick(ctx,b.x+b.w-34,b.y+b.h/2,26,rgba(AG.green,1),4.2);else if(r.mark==="lock")ag_lock(ctx,b.x+b.w-34,b.y+b.h/2+4,28,rgba(AG.blue,1));
    else if(r.mark==="warn")ag_warn(ctx,b.x+b.w-34,b.y+b.h/2,30,rgba(AG.amber,1));ctx.restore();});
  ctx.restore();return bb;}

/* the report the census agent left for Jun: o.lines (how many of its lines show, 0..4, eased), o.measures (0..1, its measures under
   them), o.tail ([px, py], where its tail points: Jun's screen), o.a, o.k */
const WM_REPORT=[["Failed at 23:00","18,409 in test, not 18,412",AG.amber],["Cause","a change read records before census day",AG.violet],
  ["Fixed","on its own branch: 18,412, every test",AG.green],["Then","a pull request, for Jun to review",AG.blue]];
function wm_report(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,m=o.measures||0,h=128+WM_REPORT.length*82+(m>0?88*ag_sine(clamp(m*2,0,1)):0)+8,bb={x,y,w,h};if(a<=0)return bb;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,o.tail?o.tail[0]:x+w/2,o.tail?o.tail[1]:y+h/2,lerp(0.6,1,o.k));
  let tail=null;if(o.tail){const ty=y+h-70;tail={side:"left",a:ty-24,b:ty+24,px:o.tail[0],py:o.tail[1]};}
  ag_card(ctx,c=>ag_cardPath(c,x,y,w,h,22,tail),bb,{edge:AG.violet,edgeA:0.6});
  ag_T(ctx,"REPORT · 23:22",x+28,y+50,{w:700,size:28,ls:3.5,col:AG.violet});ag_T(ctx,"census agent",x+w-28,y+50,{w:500,size:28,f:"mono",col:AG.mut,align:"right"});
  ag_T(ctx,"Why the night build failed",x+28,y+98,{w:700,size:36});
  WM_REPORT.forEach((r,i)=>{const la=clamp((o.lines==null?4:o.lines)-i,0,1);if(la<=0)return;const yy=y+128+i*82;ctx.save();ctx.globalAlpha*=la;
    ctx.fillStyle=rgba(r[2],0.9);ctx.beginPath();ctx.arc(x+38,yy+30,7,0,TAU);ctx.fill();
    ag_T(ctx,r[0],x+58,yy+40,{w:700,size:28,col:AG.ink});ag_T(ctx,r[1],x+58,yy+76,{w:500,size:28,col:AG.mut});ctx.restore();});
  if(m>0){const yy=y+128+WM_REPORT.length*82;ctx.save();ctx.globalAlpha*=clamp(m*2-0.6,0,1);ctx.strokeStyle="rgba(60,50,40,0.14)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+28,yy+6);ctx.lineTo(x+w-28,yy+6);ctx.stroke();
    ag_T(ctx,"MEASURES",x+28,yy+44,{w:700,size:28,ls:3.5,col:AG.kick});ag_T(ctx,"3 of 10 rounds · 22 minutes · within its budget",x+28,yy+80,{w:600,size:28,col:AG.ink});ctx.restore();}
  ctx.restore();return bb;}

// a pull request: who opened it, from which branch, and who must review and approve it
function wm_pr(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,rows=o.rows||[],tl=wm_wrap(ctx,o.title||"",w-56,{w:700,size:34});
  const h=76+tl.length*42+(o.by?44:0)+(o.branch?42:0)+rows.length*52+22,bb={x,y,w,h};if(a<=0)return bb;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,o.k));ag_box(ctx,x,y,w,h,22,{edge:o.edge||AG.blue,edgeA:0.75});
  if(o.dashed)wm_dash(ctx,x,y,w,h,22,AG.mut,o.dashed);
  wm_branchIcon(ctx,x+42,y+42,rgba(AG.blue,1));ag_T(ctx,o.kick||"PULL REQUEST",x+72,y+52,{w:700,size:28,ls:4,col:AG.blue});
  let yy=y+60;tl.forEach(l=>{yy+=42;ag_T(ctx,l,x+28,yy,{w:700,size:34});});
  if(o.by){yy+=44;ag_T(ctx,o.by,x+28,yy,{w:600,size:28,col:AG.mut});}
  if(o.branch){yy+=42;ag_T(ctx,o.branch,x+28,yy,{w:500,size:28,f:"mono",col:AG.mut});}
  rows.forEach(r=>{const ra=r.a==null?1:r.a;yy+=52;if(ra<=0)return;ctx.save();ctx.globalAlpha*=ra;const ix=x+44,iy=yy-10;
    const tk=r.state==="tick"?1:r.state==="wait"?clamp(r.tick||0,0,1):0;
    if(tk>0){ctx.save();ctx.globalAlpha*=tk;ag_about(ctx,ix,iy,lerp(0.6,1,Math.min(1,ag_spr(tk,0,0.5))));ag_tick(ctx,ix,iy,24,rgba(AG.green,1),4);ctx.restore();}
    if(r.state==="lock")ag_lock(ctx,ix,iy+4,26,rgba(AG.mut,1));else if(r.state==="no")ag_warn(ctx,ix,iy,28,rgba(AG.amber,1));
    else if(r.state==="wait"&&tk<1){ctx.save();ctx.globalAlpha*=1-tk;ctx.strokeStyle=rgba(AG.mut,0.7);ctx.lineWidth=3;ctx.beginPath();ctx.arc(ix,iy,12,0,TAU);ctx.stroke();ctx.restore();}
    ag_T(ctx,r.text,x+76,yy,{w:600,size:28,col:r.state==="no"?AG.ink:mix(AG.mut,AG.ink,Math.max(tk,r.state==="lock"?0.6:0))});ctx.restore();});
  ctx.restore();return bb;}

/* the line of code: valid_from < census_date, its "<" lit amber (o.bad 0..1), then the "=" added (o.fix 0..1), lit green; o.kick, o.note */
function wm_code(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=o.note?212:168,bb={x,y,w,h};if(a<=0)return bb;const F={w:500,size:36,f:"mono"};
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,o.k));ag_box(ctx,x,y,w,h,22,{edge:o.fix>0.5?AG.green:AG.amber,edgeA:0.35+0.4*Math.max(o.bad||0,o.fix||0)});
  ag_T(ctx,String(o.kick||"The census count's filter").toUpperCase(),x+28,y+50,{w:700,size:28,ls:3.5,col:AG.violet});
  const a0="valid_from ",op="<",eq="=",b0=" census_date",fx=clamp(o.fix||0,0,1),wa=ag_tw(ctx,a0,F),wo=ag_tw(ctx,op,F),we=ag_tw(ctx,eq,F),ly=y+118,lx=x+28;
  ag_T(ctx,a0,lx,ly,F);
  const hl=Math.max(o.bad||0,fx);if(hl>0){ctx.fillStyle=rgba(mix(AG.amber,AG.green,fx),0.16*hl);rr(ctx,lx+wa-8,ly-40,wo+we*ag_sine(fx)+16,54,10);ctx.fill();}
  ag_T(ctx,op,lx+wa,ly,Object.assign({},F,{col:hl>0?mix(AG.ink,mix(AG.amber,AG.green,fx),hl):AG.ink}));
  if(fx>0){ctx.save();ctx.globalAlpha*=clamp(fx*1.6-0.3,0,1);ag_T(ctx,eq,lx+wa+wo,ly,Object.assign({},F,{col:AG.green}));ctx.restore();}
  ag_T(ctx,b0,lx+wa+wo+we*ag_sine(fx),ly,F);
  if(o.note)ag_T(ctx,o.note,x+28,y+176,{w:600,size:28,col:o.noteCol||AG.mut,a:o.noteA==null?1:o.noteA});
  ctx.restore();return bb;}

/* the switch: one in each tool, both on (o.off 0..1 would show it off: the film never uses it), each with its words */
const WM_SW=[["Databricks","Its service principal","active"],["GitHub","Its App's installation","active"]];
function wm_switches(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=96+WM_SW.length*136,bb={x,y,w,h};if(a<=0)return bb;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,o.k));ag_box(ctx,x,y,w,h,22,{edge:AG.blue,edgeA:0.7});
  ag_T(ctx,"THE SWITCH",x+28,y+52,{w:700,size:28,ls:4,col:AG.blue});ag_T(ctx,"census agent",x+w-28,y+52,{w:500,size:28,f:"mono",col:AG.mut,align:"right"});
  WM_SW.forEach((s,i)=>{const ra=o.show?o.show(i):1;if(ra<=0)return;const yy=y+84+i*136;ctx.save();ctx.globalAlpha*=clamp(ra,0,1);
    if(i){ctx.strokeStyle="rgba(60,50,40,0.1)";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x+24,yy);ctx.lineTo(x+w-24,yy);ctx.stroke();}
    ag_T(ctx,s[0].toUpperCase(),x+28,yy+46,{w:700,size:28,ls:3,col:AG.kick});ag_T(ctx,s[1],x+28,yy+92,{w:600,size:30,col:AG.ink});
    // a rocker switch on a small plate, on (green): the film shows it, never turns it
    const off=o.off?clamp(o.off(i),0,1):0,sx=x+w-196,sy=yy+28,lit=o.glow?o.glow(i):0;ctx.save();ctx.shadowColor="rgba(40,32,24,0.24)";ctx.shadowBlur=10;ctx.shadowOffsetY=4;
    ctx.fillStyle="#E8E5DF";rr(ctx,sx,sy,168,76,16);ctx.fill();ctx.restore();ctx.strokeStyle=lit>0?rgba(AG.blue,0.4+0.5*lit):"rgba(60,50,40,0.18)";ctx.lineWidth=lit>0?3:1.5;rr(ctx,sx,sy,168,76,16);ctx.stroke();
    const kx=lerp(sx+92,sx+12,ag_sine(off));ctx.fillStyle=rgba(mix(AG.green,AG.mut,off),0.9);rr(ctx,sx+8,sy+8,152,60,12);ctx.fill();
    ctx.save();ctx.shadowColor="rgba(40,32,24,0.3)";ctx.shadowBlur=6;ctx.shadowOffsetY=2;ctx.fillStyle="#FBFAF7";rr(ctx,kx,sy+12,64,52,10);ctx.fill();ctx.restore();
    ag_T(ctx,off>0.5?"off":"on",kx<sx+50?sx+122:sx+46,sy+50,{w:700,size:28,align:"center",col:[250,250,248]});ctx.restore();});
  ctx.restore();return bb;}

/* a table's versions: each with who wrote it and when; o.show(i), o.lit (the version restored to, lit green), o.restore (0..1, the
   restore drawn as a new version on top) */
const WM_VER=[["Version 41","release","4 November, 02:10"],["Version 42","release","5 November, 02:10"],["Version 43","release","6 November, 02:10"]];
function wm_versions(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,n=WM_VER.length,h=136+n*78+20,bb={x,y,w,h};if(a<=0)return bb;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,o.k));ag_box(ctx,x,y,w,h,22,{edge:AG.orange,edgeA:0.6});
  ag_T(ctx,"A TABLE'S VERSIONS",x+28,y+50,{w:700,size:28,ls:3.5,col:AG.orange});ag_T(ctx,o.table||"census_day_students",x+28,y+100,{w:500,size:30,f:"mono",col:AG.ink});
  ctx.strokeStyle=rgba(AG.mut,0.35);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+42,y+146);ctx.lineTo(x+42,y+h-38);ctx.stroke();
  WM_VER.forEach((v,i)=>{const s=o.show?o.show(i):1;if(s<=0)return;const yy=y+136+i*78,lit=o.lit===i?(o.litA==null?1:o.litA):0;ctx.save();ctx.globalAlpha*=clamp(s,0,1);
    if(lit>0){ctx.fillStyle=rgba(AG.green,0.12*lit);rr(ctx,x+14,yy+2,w-28,70,12);ctx.fill();}
    ctx.fillStyle=rgba(lit>0?mix(AG.mut,AG.green,lit):AG.mut,1);ctx.beginPath();ctx.arc(x+42,yy+38,8,0,TAU);ctx.fill();
    ag_T(ctx,v[0],x+72,yy+48,{w:700,size:28});ag_T(ctx,v[1],x+300,yy+48,{w:500,size:28,f:"mono",col:AG.mut});ag_T(ctx,v[2],x+w-28,yy+48,{w:600,size:28,col:AG.mut,align:"right"});ctx.restore();});
  ctx.restore();return bb;}

/* the census agent's kinds of task, each with its stage (numbers.md, The census agent's stages): o.lit(i) 0..1 lights row i, o.a, o.k */
const WM_TASKS=[["Find why the night build failed","Test",5],["The same, in production","Production",5],["Fix a model","Its own branch",4],
  ["A new question about the count","Its own schema",3],["What a census word means","Nowhere: it runs nothing",1]];
function wm_stageTable(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=96+WM_TASKS.length*76+16,bb={x,y,w,h};if(a<=0)return bb;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,o.k));ag_box(ctx,x,y,w,h,22,{});
  ag_T(ctx,"THE CENSUS AGENT'S TASKS",x+28,y+52,{w:700,size:28,ls:3.5,col:AG.kick});ag_T(ctx,"STAGE",x+w-28,y+52,{w:700,size:28,ls:3.5,col:AG.kick,align:"right"});
  WM_TASKS.forEach((r,i)=>{const yy=y+84+i*76,lit=o.lit?o.lit(i):0,col=r[2]===5?AG.blue:r[2]===1?AG.violet:AG.mut;ctx.save();
    if(lit>0){ctx.fillStyle=rgba(col,0.1*lit);rr(ctx,x+14,yy,w-28,68,12);ctx.fill();}
    ag_T(ctx,r[0],x+28,yy+44,{w:600,size:30,col:AG.ink});ag_T(ctx,r[1],x+w-120,yy+44,{w:500,size:28,col:AG.mut,align:"right"});
    ctx.fillStyle=rgba(col,0.14+0.2*lit);ctx.beginPath();ctx.arc(x+w-56,yy+34,24,0,TAU);ctx.fill();ag_T(ctx,String(r[2]),x+w-56,yy+45,{w:800,size:30,align:"center",col:mix(AG.mut,col,0.6+0.4*lit)});
    ctx.restore();});
  ctx.restore();return bb;}
