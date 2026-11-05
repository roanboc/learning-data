/* ===== A mandate, written and enforced: the page, the map, and where each line is held =====
     WM_ROWS            the mandate, as one page: each row a line of governance/8-mandates/workload-agent.yml, said plainly
     wm_page(ctx, x, y, w, o)   the page: its file at the top, its title, and its rows; o.show(i) 0..1 brings row i in, o.lit(i) 0..1
                        lights it (o.litCol(i) its colour), o.sign 0..1 draws Anil's signature, o.approve 0..1 Noor's tick, o.blank
                        0..1 the page still empty (a dashed edge, nothing written), o.a, o.k; returns {x, y, w, h, rows: [{x, y, w, h}]}
     wm_detail(ctx, x, y, w, o) a row of the page, opened up: a kicker, a title and its items, one under another, each with a mark
                        ("n" its number, "tick", "no", "lock", "warn", "undo", "gear", or none); o.items [{text, mark, a, col, f}]
     wm_place(ctx, x, y, w, o)  where a line is held: a tool's card (its mark, kicker, title) and its settings as rows, the name above
                        and its value under it in mono; o.rows [{name, value, a, col, lit, mark}]
     wm_mark(ctx, k, x, y, h)   a tool's official mark, h tall, its left edge at x and its middle at y: Databricks' and dbt's as they
                        are; GitHub's white Invertocat on a graphite tile
     wm_report(ctx, x, y, w, o) the workload agent's report, as Anil found it: the night build, the cause, the fix, the pull request,
                        the question it asked, and (o.measures) its measures
     wm_pr(ctx, x, y, w, o)     a pull request: its title, who opened it, its rows (who reviewed, who approved)
     wm_code(ctx, x, y, w, o)   the agent's own model, its lines in mono: o.gap 0..1 opens room for the line it put back, o.fix 0..1
                        types it in, green; o.bad 0..1 lights where the line is missing, amber
     wm_switches(ctx, x, y, w, o) the switch: two of them, one in each tool, both on
     wm_versions(ctx, x, y, w, o) a table's versions, with who wrote each one and when, and the one before marked
     wm_el, wm_assign, wm_owns  the map's notation, as A place on the map draws it: an element (a person, a role, the agent, a
                        requirement), an assignment, who owns it
     wm_onMap(ctx, o)           the workload agent on the map: Anil, who owns it, and its role, which it's assigned to
     wm_stageList(ctx, x, y, w, o) its stage beside each kind of task, as its assignment holds them; o.mandate 0..1 the mandate's line
     wm_folders(ctx, x, y, w, o) governance/ and its folders, 8-mandates/ the new one
     wm_yaml(ctx, x, y, w, o)   the mandate file's first lines, in mono
     wm_checks(ctx, x, y, w, o) the project's check, scripts/check/mandates.py: each place against the page
     wm_law(ctx, x, y, w, o)    Europe's AI law on human oversight: four things a person must be able to do
     wm_nights(ctx, x, y, o)    the nights in test before the mandate, one mark each */

// the page's rows: what each says, in the order the voice names them; the last two are the signature and the approval
const WM_ROWS=[["In test","Find why the night build failed, and fix it"],["In production","Read, find the cause, and draft the fix"],
  ["Folders","models/marts/workload/ · models/intermediate/workload/ · analyses/workload/"],["Never","A test, a seed, a contract or a definition"],
  ["Checks","First: has tonight's copy arrived?"],["Limits","10 rounds · 1 hour · a set budget"],
  ["Switch","Off in both tools, at any hour"],["Undo","Revert the change, restore the table"],
  ["Signed","Anil Kurian, owner · 30 October 2026"],["Approved","Noor Rahman, as a second person"]];
const WM_SIGN=8,WM_APPROVE=9,WM_FILE="governance/8-mandates/workload-agent.yml";
const WM_PG={lab:228,rowH:58,top:132};
function wm_pageRows(ctx,x,y,w){const P=WM_PG,vw=w-P.lab-40,out=[];let yy=y+P.top;
  WM_ROWS.forEach((r,i)=>{const ls=wm_wrap(ctx,r[1],vw,{w:600,size:28}),h=P.rowH+(ls.length-1)*36;out.push({x:x+14,y:yy,w:w-28,h,ls});yy+=h;});
  return{rows:out,h:yy-y+20};}
function wm_page(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,L=wm_pageRows(ctx,x,y,w),h=L.h,bb={x,y,w,h,rows:L.rows};if(a<=0)return bb;
  const blank=clamp(o.blank||0,0,1);
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,o.k));
  // an empty page: only a dashed edge, where nothing is written yet
  if(blank>0){ctx.save();ctx.globalAlpha*=blank;ctx.fillStyle="rgba(250,249,246,0.55)";rr(ctx,x,y,w,h,22);ctx.fill();wm_dash(ctx,x-5,y-5,w+10,h+10,26,AG.mut,1);ctx.restore();}
  if(blank<1){ctx.save();ctx.globalAlpha*=1-blank;
    ag_box(ctx,x,y,w,h,22,{edge:AG.blue,edgeA:0.7});
    wm_fileIcon(ctx,x+40,y+46,rgba(AG.blue,0.95),false);ag_T(ctx,WM_FILE,x+70,y+56,{w:500,size:28,f:"mono",col:AG.blue});
    ag_T(ctx,"The workload agent's mandate",x+28,y+108,{w:700,size:36});
    L.rows.forEach((b,i)=>{const s=o.show?o.show(i):1;if(s<=0)return;const lit=o.lit?o.lit(i):0,col=(o.litCol&&o.litCol(i))||AG.blue;ctx.save();ctx.globalAlpha*=clamp(s*1.6,0,1);
      const dx=(1-ag_eo(clamp(s,0,1)))*-18;ctx.translate(dx,0);
      if(lit>0){ctx.fillStyle=rgba(col,0.11*lit);rr(ctx,b.x,b.y+4,b.w,b.h-8,12);ctx.fill();ctx.strokeStyle=rgba(col,0.5*lit);ctx.lineWidth=2;rr(ctx,b.x,b.y+4,b.w,b.h-8,12);ctx.stroke();}
      if(i>0){ctx.strokeStyle="rgba(60,50,40,0.1)";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(b.x+14,b.y+2);ctx.lineTo(b.x+b.w-14,b.y+2);ctx.stroke();}
      const sg=i===WM_SIGN||i===WM_APPROVE;
      ag_T(ctx,WM_ROWS[i][0].toUpperCase(),b.x+16,b.y+39,{w:700,size:28,ls:3,col:sg?AG.kick:mix(AG.blue,col,lit)});
      b.ls.forEach((l,j)=>ag_T(ctx,l,x+WM_PG.lab,b.y+39+j*36,{w:600,size:28,col:AG.ink}));
      // Anil's signature: a pen line drawn after his name; Noor's approval: a green tick
      if(i===WM_SIGN&&o.sign>0){const sx=x+w-138,sy=b.y+34;ctx.save();ctx.strokeStyle=rgba(AG.ink,0.8);ctx.lineWidth=2.6;ctx.lineCap="round";ctx.lineJoin="round";
        const pts=[];for(let k=0;k<=40;k++){const u=k/40;pts.push([sx-6+u*112,sy+Math.sin(u*TAU*2.2)*9*(1-u*0.5)-u*8]);}
        ctx.beginPath();pts.slice(0,1+Math.round(40*clamp(o.sign,0,1))).forEach((p,k)=>k?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();ctx.restore();}
      if(i===WM_APPROVE&&o.approve>0){ctx.save();ctx.globalAlpha*=clamp(o.approve,0,1);const tx=x+w-80,ty=b.y+28;ag_about(ctx,tx,ty,lerp(0.6,1,Math.min(1,ag_spr(o.approve,0,0.5))));ag_tick(ctx,tx,ty,30,rgba(AG.green,1),4.4);ctx.restore();}
      ctx.restore();});
    ctx.restore();}
  ctx.restore();return bb;}

// a row of the page opened up, beside the page
function wm_detail(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,items=o.items||[],inner=w-56-(o.marks===false?0:52);
  const tl=o.title?wm_wrap(ctx,o.title,w-56,{w:700,size:36}):[],L=items.map(it=>wm_wrap(ctx,it.text,inner,{w:600,size:it.size||30,f:it.f}));
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
    else if(mk==="undo")wm_undoIcon(ctx,mx,my,34,rgba(it.mcol||AG.blue,1));else if(mk==="gear")wm_gear(ctx,mx,my,16,rgba(it.mcol||AG.blue,1),it.turn||0);
    else if(mk==="file")wm_fileIcon(ctx,mx,my,rgba(it.mcol||AG.blue,1),!!it.folder);
    L[i].forEach((l,j)=>ag_T(ctx,l,tx,b.y+40+j*40,{w:600,size:it.size||30,col,f:it.f}));ctx.restore();});
  ctx.restore();return bb;}

/* a tool's official mark, h tall, its left edge at x, its middle at y; returns its width. Databricks' and dbt's marks (The Inner Life of
   Data's logos.js) as they are; GitHub's white Invertocat (marks.js) on a graphite tile, so it keeps its contrast on the pale cards */
function wm_mark(ctx,k,x,y,h){if(typeof logo!=="function")return 0;
  if(k==="github"){const tw=h*1.18;ctx.save();ctx.fillStyle="#24292F";rr(ctx,x,y-tw/2,tw,tw,tw*0.22);ctx.fill();ctx.restore();logo(ctx,"github",x+(tw-h*0.72*98/96)/2,y-h*0.36,h*0.72);return tw;}
  return logo(ctx,k,x,y-h/2,h);}

// where a line is held: a tool's own card, its settings as rows (a name, and its value in mono)
function wm_place(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,rows=o.rows||[],tl=o.title?wm_wrap(ctx,o.title,w-56,{w:700,size:34}):[],rh=o.rowH||92;
  const h=28+40+tl.length*44+12+rows.length*rh+16,bb={x,y,w,h,rows:[]};let yy=y+28+40+tl.length*44+12;
  rows.forEach(r=>{bb.rows.push({x:x+14,y:yy,w:w-28,h:rh-8});yy+=rh;});if(a<=0)return bb;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,o.k));ag_box(ctx,x,y,w,h,22,{edge:o.edge||AG.blue,edgeA:0.75});
  let kx=x+28;if(o.mark){kx+=wm_mark(ctx,o.mark,x+28,y+44,o.mark==="github"?34:40)+18;}
  ag_T(ctx,String(o.kick||"").toUpperCase(),kx,y+54,{w:700,size:28,ls:3.5,col:o.kickCol||AG.blue});
  let ty=y+72;tl.forEach(l=>{ty+=40;ag_T(ctx,l,x+28,ty,{w:700,size:34});ty+=4;});
  rows.forEach((r,i)=>{const ra=r.a==null?1:r.a;if(ra<=0)return;const b=bb.rows[i];ctx.save();ctx.globalAlpha*=clamp(ra,0,1);
    if(r.lit>0){ctx.fillStyle=rgba(r.col||AG.blue,0.1*r.lit);rr(ctx,b.x,b.y,b.w,b.h,12);ctx.fill();ctx.strokeStyle=rgba(r.col||AG.blue,0.45*r.lit);ctx.lineWidth=2;rr(ctx,b.x,b.y,b.w,b.h,12);ctx.stroke();}
    ag_T(ctx,r.name,b.x+16,b.y+34,{w:600,size:28,col:AG.mut});ag_T(ctx,r.value,b.x+16,b.y+72,{w:500,size:30,f:"mono",col:r.vcol||AG.ink});
    if(r.mark==="tick")ag_tick(ctx,b.x+b.w-34,b.y+b.h/2,26,rgba(AG.green,1),4.2);else if(r.mark==="lock")ag_lock(ctx,b.x+b.w-34,b.y+b.h/2+4,28,rgba(AG.blue,1));
    else if(r.mark==="warn")ag_warn(ctx,b.x+b.w-34,b.y+b.h/2,30,rgba(AG.amber,1));ctx.restore();});
  ctx.restore();return bb;}

/* the report the workload agent left for Anil: o.lines (how many of its lines show, 0..5, eased), o.measures (0..1, its measures under
   them), o.tail ([px, py], where its tail points), o.a, o.k */
const WM_REPORT=[["Failed at 23:14","each contract counts once: 3 twice",AG.amber],["Cause","the day's change read every version",AG.violet],
  ["Fixed","on its own branch: Nursing 64 and 38",AG.green],["Then","a pull request, for Jun to review",AG.blue],["A question","for HR: where a tutor who moved counts",AG.violet]];
function wm_report(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,m=o.measures||0,n=WM_REPORT.length,h=128+n*82+(m>0?88*ag_sine(clamp(m*2,0,1)):0)+8,bb={x,y,w,h};if(a<=0)return bb;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,o.tail?o.tail[0]:x+w/2,o.tail?o.tail[1]:y+h/2,lerp(0.6,1,o.k));
  let tail=null;if(o.tail){const ty=y+h-70;tail={side:"left",a:ty-24,b:ty+24,px:o.tail[0],py:o.tail[1]};}
  ag_card(ctx,c=>ag_cardPath(c,x,y,w,h,22,tail),bb,{edge:AG.violet,edgeA:0.6});
  ag_T(ctx,"REPORT · 23:34",x+28,y+50,{w:700,size:28,ls:3.5,col:AG.violet});ag_T(ctx,"workload agent",x+w-28,y+50,{w:500,size:28,f:"mono",col:AG.mut,align:"right"});
  ag_T(ctx,"Why the night build failed",x+28,y+98,{w:700,size:36});
  WM_REPORT.forEach((r,i)=>{const la=clamp((o.lines==null?n:o.lines)-i,0,1);if(la<=0)return;const yy=y+128+i*82;ctx.save();ctx.globalAlpha*=la;
    ctx.fillStyle=rgba(r[2],0.9);ctx.beginPath();ctx.arc(x+38,yy+30,7,0,TAU);ctx.fill();
    ag_T(ctx,r[0],x+58,yy+40,{w:700,size:28,col:AG.ink});ag_T(ctx,r[1],x+58,yy+76,{w:500,size:28,col:AG.mut});ctx.restore();});
  if(m>0){const yy=y+128+n*82;ctx.save();ctx.globalAlpha*=clamp(m*2-0.6,0,1);ctx.strokeStyle="rgba(60,50,40,0.14)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+28,yy+6);ctx.lineTo(x+w-28,yy+6);ctx.stroke();
    ag_T(ctx,"MEASURES",x+28,yy+44,{w:700,size:28,ls:3.5,col:AG.kick});ag_T(ctx,"3 of 10 rounds · 20 minutes · within its limits",x+28,yy+80,{w:600,size:28,col:AG.ink});ctx.restore();}
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

/* the agent's own model, mart_workload__teaching_staff.sql, as four lines in mono: the line that reads HR's contracts, then the line the
   day's change dropped (only the version of each contract that holds today), in two parts. o.bad 0..1 lights the place it's missing,
   amber; o.gap 0..1 opens room for it (so nothing below jumps), o.fix 0..1 types it in, green; o.kick, o.note */
const WM_CODE=["from {{ ref('stg_hr_system__contracts') }}","where {{ valid_at(as_is_date(),","    'cast(recorded_from as date)',","    'cast(recorded_to as date)') }}"];
function wm_code(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,F={w:500,size:28,f:"mono"},gap=ag_sine(clamp(o.gap||0,0,1)),fx=clamp(o.fix||0,0,1),bad=clamp(o.bad||0,0,1),
    lh=42,h=96+lh+lh*3*gap+(o.note?58:0)+24,bb={x,y,w,h};if(a<=0)return bb;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,o.k));ag_box(ctx,x,y,w,h,22,{edge:fx>0.5?AG.green:AG.amber,edgeA:0.3+0.45*Math.max(bad,fx)});
  ag_T(ctx,o.kick||"mart_workload__teaching_staff.sql",x+28,y+52,{w:500,size:28,f:"mono",col:AG.violet});
  const lx=x+28,ly=y+104;ag_T(ctx,WM_CODE[0],lx,ly,Object.assign({},F,{col:AG.mut}));
  // where the line belongs: an amber mark while it's missing, then the room it needs, then the line typed in, green
  if(bad>0&&gap<0.5){ctx.save();ctx.globalAlpha*=bad*(1-gap*2);ctx.fillStyle=rgba(AG.amber,0.9);ctx.fillRect(lx,ly+16,ag_tw(ctx,"where",F),4);
    ag_T(ctx,"no line keeps only today's version",lx+ag_tw(ctx,"where ",F),ly+28,{w:600,size:28,col:AG.amber});ctx.restore();}
  if(gap>0.01&&(fx>0||bad>0)){const top=ly+16,hh=lh*3*gap;ctx.fillStyle=rgba(fx>0?AG.green:AG.amber,0.08+0.06*Math.max(fx,bad));rr(ctx,lx-12,top,w-32,hh,10);ctx.fill();}
  if(fx>0){const all=WM_CODE.slice(1).join("").length,shown=Math.round(all*fx);let left=shown;
    WM_CODE.slice(1).forEach((l,j)=>{if(left<=0)return;const s=l.slice(0,Math.min(l.length,left));left-=l.length;ctx.save();ctx.globalAlpha*=gap;ag_T(ctx,s,lx,ly+lh*(j+1),Object.assign({},F,{col:AG.green}));ctx.restore();});
    if(fx<1){const j=Math.min(2,WM_CODE.slice(1).findIndex((l,k)=>WM_CODE.slice(1,k+2).join("").length>=shown)),pre=WM_CODE.slice(1,j+1).join("").length,
        cx=lx+ag_tw(ctx,WM_CODE[j+1].slice(0,shown-pre),F);ctx.fillStyle=rgba(AG.green,0.8);ctx.fillRect(cx+2,ly+lh*(j+1)-24,3,30);}}
  if(o.note)ag_T(ctx,o.note,x+28,y+h-34,{w:600,size:28,col:o.noteCol||AG.mut,a:o.noteA==null?1:o.noteA});
  ctx.restore();return bb;}

/* the switch: one in each tool, both on (o.off(i) 0..1 would show it off: the film never uses it), each with its words; o.glow(i) */
const WM_SW=[["Databricks","Its service principal","active","databricks"],["GitHub","Its App's installation","active","github"]];
function wm_switches(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=96+WM_SW.length*136,bb={x,y,w,h};if(a<=0)return bb;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,o.k));ag_box(ctx,x,y,w,h,22,{edge:AG.blue,edgeA:0.7});
  ag_T(ctx,"THE SWITCH",x+28,y+52,{w:700,size:28,ls:4,col:AG.blue});ag_T(ctx,"workload agent",x+w-28,y+52,{w:500,size:28,f:"mono",col:AG.mut,align:"right"});
  WM_SW.forEach((s,i)=>{const ra=o.show?o.show(i):1;if(ra<=0)return;const yy=y+84+i*136;ctx.save();ctx.globalAlpha*=clamp(ra,0,1);
    if(i){ctx.strokeStyle="rgba(60,50,40,0.1)";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x+24,yy);ctx.lineTo(x+w-24,yy);ctx.stroke();}
    const mw=wm_mark(ctx,s[3],x+28,yy+38,s[3]==="github"?30:36);
    ag_T(ctx,s[0].toUpperCase(),x+28+mw+16,yy+48,{w:700,size:28,ls:3,col:AG.kick});ag_T(ctx,s[1],x+28,yy+98,{w:600,size:30,col:AG.ink});
    // a rocker switch on a small plate, on (green): the film shows it, never turns it
    const off=o.off?clamp(o.off(i),0,1):0,sx=x+w-196,sy=yy+28,lit=o.glow?o.glow(i):0;ctx.save();ctx.shadowColor="rgba(40,32,24,0.24)";ctx.shadowBlur=10;ctx.shadowOffsetY=4;
    ctx.fillStyle="#E8E5DF";rr(ctx,sx,sy,168,76,16);ctx.fill();ctx.restore();ctx.strokeStyle=lit>0?rgba(AG.blue,0.4+0.5*lit):"rgba(60,50,40,0.18)";ctx.lineWidth=lit>0?3:1.5;rr(ctx,sx,sy,168,76,16);ctx.stroke();
    const kx=lerp(sx+92,sx+12,ag_sine(off));ctx.fillStyle=rgba(mix(AG.green,AG.mut,off),0.9);rr(ctx,sx+8,sy+8,152,60,12);ctx.fill();
    ctx.save();ctx.shadowColor="rgba(40,32,24,0.3)";ctx.shadowBlur=6;ctx.shadowOffsetY=2;ctx.fillStyle="#FBFAF7";rr(ctx,kx,sy+12,64,52,10);ctx.fill();ctx.restore();
    ag_T(ctx,off>0.5?"off":"on",kx<sx+50?sx+122:sx+46,sy+50,{w:700,size:28,align:"center",col:[250,250,248]});ctx.restore();});
  ctx.restore();return bb;}

/* a table's versions, in production: each with who wrote it and when; o.show(i), o.lit (the one a person could restore, lit green) */
const WM_VER=[["Version 41","release","3 November, 09:12"],["Version 42","release","4 November, 09:05"],["Version 43","release","5 November, 09:40"]];
function wm_versions(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,n=WM_VER.length,h=136+n*78+20,bb={x,y,w,h};if(a<=0)return bb;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,o.k));ag_box(ctx,x,y,w,h,22,{edge:AG.orange,edgeA:0.6});
  const mw=wm_mark(ctx,"databricks",x+28,y+42,36);ag_T(ctx,"A TABLE'S VERSIONS",x+28+mw+16,y+52,{w:700,size:28,ls:3.5,col:AG.orange});
  ag_T(ctx,o.table||"mart_workload__teaching_staff",x+28,y+102,{w:500,size:30,f:"mono",col:AG.ink});
  ctx.strokeStyle=rgba(AG.mut,0.35);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+42,y+146);ctx.lineTo(x+42,y+h-38);ctx.stroke();
  WM_VER.forEach((v,i)=>{const s=o.show?o.show(i):1;if(s<=0)return;const yy=y+136+i*78,lit=o.lit===i?(o.litA==null?1:o.litA):0;ctx.save();ctx.globalAlpha*=clamp(s,0,1);
    if(lit>0){ctx.fillStyle=rgba(AG.green,0.12*lit);rr(ctx,x+14,yy+2,w-28,70,12);ctx.fill();}
    ctx.fillStyle=rgba(lit>0?mix(AG.mut,AG.green,lit):AG.mut,1);ctx.beginPath();ctx.arc(x+42,yy+38,8,0,TAU);ctx.fill();
    ag_T(ctx,v[0],x+72,yy+48,{w:700,size:28});ag_T(ctx,v[1],x+272,yy+48,{w:500,size:28,f:"mono",col:AG.mut});ag_T(ctx,v[2],x+w-28,yy+48,{w:600,size:28,col:AG.mut,align:"right"});ctx.restore();});
  ctx.restore();return bb;}

/* ---------------------------------------------------------------- the map's notation, as A place on the map draws it
   A person (a small figure), a role (a short cylinder on its side, a blue edge: the map's structure), an agent (a small sphere with its
   band), and a requirement (a parallelogram, the symbol Rules with a home puts on every rule). */
function wm_icon(ctx,kind,x,y,s,col){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=3;ctx.lineCap="round";ctx.lineJoin="round";
  if(kind==="person"){ctx.beginPath();ctx.arc(0,-12,7,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(0,-5);ctx.lineTo(0,10);ctx.moveTo(-10,0);ctx.lineTo(10,0);ctx.moveTo(0,10);ctx.lineTo(-8,22);ctx.moveTo(0,10);ctx.lineTo(8,22);ctx.stroke();}
  else if(kind==="role"){ctx.beginPath();ctx.moveTo(-10,-10);ctx.lineTo(8,-10);ctx.moveTo(-10,10);ctx.lineTo(8,10);ctx.stroke();ctx.beginPath();ctx.ellipse(-10,0,5,10,0,Math.PI/2,Math.PI*1.5);ctx.stroke();
    ctx.beginPath();ctx.ellipse(8,0,5,10,0,0,TAU);ctx.stroke();}
  else if(kind==="agent"){ctx.beginPath();ctx.arc(0,0,13,0,TAU);ctx.stroke();ctx.fillStyle=rgba(AG.violet,0.85);ctx.beginPath();ag_rect(ctx,-9,-5,18,6,3);ctx.fill();}
  else if(kind==="requirement"){ctx.beginPath();ctx.moveTo(-10,-11);ctx.lineTo(16,-11);ctx.lineTo(10,11);ctx.lineTo(-16,11);ctx.closePath();ctx.stroke();}
  ctx.restore();}
// an element: o.kind ("person", "role", "agent", "requirement"), o.name, o.sub (a line under it), o.a, o.k, o.edge, o.glow; returns its box
function wm_el(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,F={w:700,size:30},lines=ag_wrap(ctx,o.name,w-92,F),h=Math.max(76,40+lines.length*38+(o.sub?36:0)),b={x,y,w,h};
  if(a<=0.01||o.measure)return b;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,clamp(o.k,0,1.2)));
  const role=o.kind==="role",edge=o.edge||(role?AG.blue:null);
  ag_box(ctx,x,y,w,h,role?h/2.6:14,{edge,edgeA:o.edgeA==null?(role?0.75:0.8):o.edgeA,glow:o.glow,glowA:o.glowA});
  wm_icon(ctx,o.kind||"agent",x+40,y+h/2-(o.sub?16:0),1,rgba(o.kind==="agent"?AG.violet:(role||o.kind==="requirement")?AG.blue:AG.mut,0.95));
  const y0=y+h/2-((lines.length-1)*38+(o.sub?36:0))/2+11;lines.forEach((l,i)=>ag_T(ctx,l,x+72,y0+i*38,F));
  if(o.sub)ag_T(ctx,o.sub,x+72,y0+lines.length*38-2,{w:600,size:28,col:o.subCol||AG.mut});
  ctx.restore();return b;}
// an assignment from p to q, drawn as far as u: a dot where it starts, an arrowhead at the role, in the map's blue
function wm_assign(ctx,p,q,u,o){o=o||{};if(u<=0.01)return;const a=o.a==null?1:o.a,col=o.col||AG.blue,e=[lerp(p[0],q[0],u),lerp(p[1],q[1],u)];ctx.save();ctx.globalAlpha*=a;
  ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=3.5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(e[0],e[1]);ctx.stroke();
  ctx.fillStyle=rgba(col,0.95);ctx.beginPath();ctx.arc(p[0],p[1],7,0,TAU);ctx.fill();if(u>0.92)ag_arrowHead(ctx,q[0],q[1],Math.atan2(q[1]-p[1],q[0]-p[0]),13,rgba(col,clamp((u-0.92)/0.08,0,1)*0.95));ctx.restore();}
// who owns it: a dashed line from the owner (p) to what they own (q), as far as u, and "owner" by its middle
function wm_owns(ctx,p,q,u,o){o=o||{};if(u<=0.01)return;const a=o.a==null?1:o.a,e=[lerp(p[0],q[0],clamp(u,0,1)),lerp(p[1],q[1],clamp(u,0,1))];
  ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(AG.ink,0.55);ctx.lineWidth=3;ctx.setLineDash([10,9]);ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(e[0],e[1]);ctx.stroke();ctx.setLineDash([]);
  const la=clamp((u-0.6)/0.4,0,1);if(la>0)ag_pill(ctx,(p[0]+q[0])/2+(o.lx||0),(p[1]+q[1])/2+(o.ly||0),"owner",{a:la,size:28});ctx.restore();}

/* the workload agent on the map, as A place on the map placed it on 26 October: Anil Kurian (a person, Faculty of Health) owns it, and
   it's assigned to its role, workload contributor. o.show(key) 0..1 for "anil", "agent", "role", "owner", "assign"; o.at [x, y] moves it
   (the agent's top left), o.glow(key) a colour; returns each element's box */
const WM_MAP={anil:{x:0,y:0,w:400,kind:"person",name:"Anil Kurian",sub:"Faculty of Health"},agent:{x:0,y:236,w:400,kind:"agent",name:"workload agent"},
  role:{x:560,y:236,w:470,kind:"role",name:"workload contributor"}};
function wm_onMap(ctx,o){o=o||{};const a=o.a==null?1:o.a,[ox,oy]=o.at||[0,0],show=o.show||(()=>1),out={};
  for(const k in WM_MAP){const e=WM_MAP[k];out[k]=wm_el(ctx,ox+e.x,oy+e.y,e.w,Object.assign({},e,{measure:true}));}
  if(a<=0.01)return out;ctx.save();ctx.globalAlpha*=a;
  const an=out.anil,ag=out.agent,ro=out.role;
  wm_owns(ctx,[an.x+an.w/2,an.y+an.h],[ag.x+ag.w/2,ag.y],clamp(show("owner"),0,1),{lx:70});
  wm_assign(ctx,[ag.x+ag.w,ag.y+ag.h/2],[ro.x,ro.y+ro.h/2],clamp(show("assign"),0,1),{});
  for(const k in WM_MAP){const e=WM_MAP[k],s=clamp(show(k),0,1);if(s<=0.01)continue;
    wm_el(ctx,ox+e.x,oy+e.y,e.w,Object.assign({},e,{a:s,k:ag_eo(clamp(s*1.2,0,1)),glow:o.glow?o.glow(k):null,glowA:0.9}));}
  ctx.restore();return out;}

/* its stage beside each kind of task, as its assignment holds them (A place on the map's lines, word for word), the night task's line
   lit (o.lit(i) 0..1, o.litCol(i)), and under the stage-5 line its mandate's line (o.mandate 0..1), with a bracket that ties it to that
   line. o.show(i) 0..1 each line in; returns {x, y, w, h, rows} */
const WM_STAGES=[["what a word about staff means",1],["a new question about teaching staff",3],["fix a model",4],["find why the night build failed, in test",5],
  ["find why the night build failed, in production",4]];
function wm_stageList(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,rh=62,m=ag_sine(clamp(o.mandate||0,0,1)),n=WM_STAGES.length,h=96+n*rh+m*(rh+24)+18,bb={x,y,w,h,rows:[]};
  for(let i=0;i<n;i++)bb.rows.push({x:x+14,y:y+84+i*rh+(i>3?m*(rh+24):0),w:w-28,h:rh-6});if(a<=0)return bb;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+40,lerp(0.85,1,o.k));ag_box(ctx,x,y,w,h,22,{edge:AG.blue,edgeA:0.5});
  ag_T(ctx,"ITS STAGE, FOR EACH KIND OF TASK",x+28,y+52,{w:700,size:28,ls:3.5,col:AG.blue});
  WM_STAGES.forEach((r,i)=>{const s=o.show?clamp(o.show(i),0,1):1;if(s<=0.01)return;const b=bb.rows[i],lit=o.lit?clamp(o.lit(i),0,1):0,col=(o.litCol&&o.litCol(i))||(r[1]===5?AG.blue:r[1]===1?AG.violet:AG.blue);
    ctx.save();ctx.globalAlpha*=s;if(lit>0){ctx.fillStyle=rgba(col,0.1*lit);rr(ctx,b.x,b.y,b.w,b.h,12);ctx.fill();ctx.strokeStyle=rgba(col,0.45*lit);ctx.lineWidth=2;rr(ctx,b.x,b.y,b.w,b.h,12);ctx.stroke();}
    ag_T(ctx,r[0],b.x+18,b.y+40,{w:600,size:28,col:AG.ink});
    const cx=b.x+b.w-38,cy=b.y+b.h/2;ctx.fillStyle=rgba(mix(AG.mut,col,0.3+0.7*lit),0.14+0.2*lit);ctx.beginPath();ctx.arc(cx,cy,22,0,TAU);ctx.fill();
    ag_T(ctx,String(r[1]),cx,cy+10,{w:800,size:28,align:"center",col:mix(AG.mut,col,0.5+0.5*lit)});ctx.restore();});
  // the mandate's line, under the stage-5 line, and the bracket from it up to that line
  if(m>0.01){const b4=bb.rows[3],my=b4.y+b4.h+12;ctx.save();ctx.globalAlpha*=clamp((o.mandate-0.3)/0.5,0,1);
    ctx.fillStyle=rgba(AG.blue,0.1);rr(ctx,x+60,my,w-88,rh,12);ctx.fill();ctx.strokeStyle=rgba(AG.blue,0.6);ctx.lineWidth=2.2;rr(ctx,x+60,my,w-88,rh,12);ctx.stroke();
    ctx.strokeStyle=rgba(AG.blue,0.7);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+40,b4.y+b4.h/2);ctx.lineTo(x+30,b4.y+b4.h/2);ctx.lineTo(x+30,my+rh/2);ctx.lineTo(x+56,my+rh/2);ctx.stroke();
    wm_icon(ctx,"requirement",x+96,my+rh/2,0.95,rgba(AG.blue,1));
    ag_T(ctx,"mandate:",x+128,my+40,{w:700,size:28,col:AG.blue});ag_T(ctx,"8-mandates/workload-agent.yml",x+128+ag_tw(ctx,"mandate: ",{w:700,size:28}),my+40,{w:500,size:28,f:"mono",col:AG.ink});ctx.restore();}
  ctx.restore();return bb;}

/* governance/, the project's governance folder, its folders one under another (the governance README's table), 8-mandates/ the new
   one (o.lit 0..1); o.show(i); returns the box and each row's */
const WM_GOV=["1-glossary/","2-owners/","3-architecture-map/","4-data-products/","5-data-contracts/","6-product-descriptors/","7-standards/","8-mandates/"];
function wm_folders(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,rh=52,h=96+WM_GOV.length*rh+14,bb={x,y,w,h,rows:[]};
  WM_GOV.forEach((f,i)=>bb.rows.push({x:x+14,y:y+86+i*rh,w:w-28,h:rh-4}));if(a<=0)return bb;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.8,1,o.k));ag_box(ctx,x,y,w,h,22,{});
  wm_fileIcon(ctx,x+44,y+46,rgba(AG.kick,1),true);ag_T(ctx,"governance/",x+76,y+56,{w:500,size:30,f:"mono",col:AG.ink});
  WM_GOV.forEach((f,i)=>{const s=o.show?clamp(o.show(i),0,1):1;if(s<=0.01)return;const b=bb.rows[i],last=i===WM_GOV.length-1,lit=last?clamp(o.lit||0,0,1):0;ctx.save();ctx.globalAlpha*=s;
    if(lit>0){ctx.fillStyle=rgba(AG.blue,0.11*lit);rr(ctx,b.x,b.y,b.w,b.h,10);ctx.fill();ctx.strokeStyle=rgba(AG.blue,0.5*lit);ctx.lineWidth=2;rr(ctx,b.x,b.y,b.w,b.h,10);ctx.stroke();}
    wm_fileIcon(ctx,x+70,b.y+b.h/2,rgba(last?mix(AG.mut,AG.blue,lit):AG.mut,0.9),true);
    ag_T(ctx,f,x+100,b.y+b.h/2+10,{w:500,size:28,f:"mono",col:last?mix(AG.mut,AG.ink,0.4+0.6*lit):AG.mut});
    if(last&&lit>0)ag_T(ctx,"new",x+w-30,b.y+b.h/2+10,{w:700,size:28,align:"right",col:AG.blue,a:lit});ctx.restore();});
  ctx.restore();return bb;}

/* the mandate file's first lines, in mono (governance/8-mandates/workload-agent.yml): o.show(i) 0..1 each line, o.lit(i) */
const WM_YAML=[["name","the workload agent's mandate"],["kind","requirement"],["owner","Anil Kurian, Faculty of Health"],["task","find why the night build failed, in test"],
  ["status","in force"]];
function wm_yaml(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,rh=50,h=100+WM_YAML.length*rh+16,bb={x,y,w,h};if(a<=0)return bb;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.8,1,o.k));ag_box(ctx,x,y,w,h,22,{edge:AG.blue,edgeA:0.6});
  wm_icon(ctx,"requirement",x+48,y+48,0.95,rgba(AG.blue,1));ag_T(ctx,"workload-agent.yml",x+84,y+58,{w:500,size:28,f:"mono",col:AG.blue});
  WM_YAML.forEach((r,i)=>{const s=o.show?clamp(o.show(i),0,1):1;if(s<=0.01)return;const yy=y+96+i*rh,lit=o.lit?clamp(o.lit(i),0,1):0;ctx.save();ctx.globalAlpha*=s;
    if(lit>0){ctx.fillStyle=rgba(AG.blue,0.1*lit);rr(ctx,x+14,yy,w-28,rh-4,10);ctx.fill();}
    const k=r[0]+": ";ag_T(ctx,k,x+28,yy+34,{w:600,size:28,f:"mono",col:AG.blue});ag_T(ctx,r[1],x+28+ag_tw(ctx,k,{w:600,size:28,f:"mono"}),yy+34,{w:500,size:28,f:"mono",col:AG.ink});ctx.restore();});
  ctx.restore();return bb;}

/* the project's check, scripts/check/mandates.py: each place where a line is held, against the page; o.rows(i) 0..1, o.fail (0..1)
   a grant that allows more (the last row turns amber, and the check fails before anything merges) */
const WM_CHK=[["Unity Catalog's grants","only its own schema, in test"],["GitHub's push rules","only its three folders"],["the run's timeout","60 minutes"],["Unity Gateway's limit","50,000 tokens a minute"]];
function wm_checks(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,rh=84,fl=clamp(o.fail||0,0,1),h=100+WM_CHK.length*rh+(fl>0?96*ag_sine(fl):0)+16,bb={x,y,w,h};if(a<=0)return bb;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.8,1,o.k));ag_box(ctx,x,y,w,h,22,{edge:fl>0.5?AG.amber:AG.green,edgeA:0.35+0.4*Math.max(fl,o.pass||0)});
  ag_T(ctx,"THE PROJECT'S CHECK",x+28,y+52,{w:700,size:28,ls:3.5,col:AG.kick});ag_T(ctx,"scripts/check/mandates.py",x+w-28,y+52,{w:500,size:28,f:"mono",col:AG.mut,align:"right"});
  WM_CHK.forEach((r,i)=>{const s=o.rows?clamp(o.rows(i),0,1):1;if(s<=0.01)return;const yy=y+84+i*rh;ctx.save();ctx.globalAlpha*=s;
    if(i){ctx.strokeStyle="rgba(60,50,40,0.1)";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x+24,yy);ctx.lineTo(x+w-24,yy);ctx.stroke();}
    ag_T(ctx,r[0],x+28,yy+38,{w:700,size:28,col:AG.ink});ag_T(ctx,r[1],x+28,yy+72,{w:500,size:28,f:"mono",col:AG.mut});
    ag_tick(ctx,x+w-46,yy+rh/2,26,rgba(AG.green,clamp(s*2-1,0,1)),4.2);ctx.restore();});
  if(fl>0.01){const yy=y+84+WM_CHK.length*rh+6;ctx.save();ctx.globalAlpha*=clamp(fl*2-0.4,0,1);ctx.fillStyle=rgba(AG.amber,0.1);rr(ctx,x+14,yy,w-28,84,12);ctx.fill();
    ag_warn(ctx,x+50,yy+42,30,rgba(AG.amber,1));ag_T(ctx,"a grant allows more than the page:",x+82,yy+34,{w:700,size:28,col:AG.ink});
    ag_T(ctx,"the check fails, before anything merges",x+82,yy+70,{w:600,size:28,col:AG.amber});ctx.restore();}
  ctx.restore();return bb;}

/* Europe's AI law, the EU AI Act, on human oversight of what it counts as high-risk (Article 14): people able to understand it, watch
   it, reverse what it does and stop it; o.show(i) 0..1 each, o.a, o.k */
const WM_LAW=[["understand it","what it can do, and its limits"],["watch it","while it works"],["reverse it","undo what it did"],["stop it","at any time"]];
function wm_law(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=212+2*120,bb={x,y,w,h};if(a<=0)return bb;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.8,1,o.k));ag_box(ctx,x,y,w,h,22,{});
  ag_T(ctx,"THE EU AI ACT · ARTICLE 14",x+28,y+52,{w:700,size:28,ls:3.5,col:AG.kick});ag_T(ctx,"Human oversight, where it counts as high-risk",x+28,y+104,{w:700,size:34});
  ag_T(ctx,"people who can",x+28,y+154,{w:600,size:28,col:AG.mut});
  const cw=(w-56-24)/2;WM_LAW.forEach((r,i)=>{const s=o.show?clamp(o.show(i),0,1):1;if(s<=0.01)return;const cx=x+28+(i%2)*(cw+24),cy=y+178+Math.floor(i/2)*120;ctx.save();ctx.globalAlpha*=s;
    ag_about(ctx,cx+cw/2,cy+50,lerp(0.85,1,Math.min(1,ag_spr(s,0,0.5))));ag_box(ctx,cx,cy,cw,100,16,{edge:AG.green,edgeA:0.5});
    ag_T(ctx,r[0],cx+24,cy+44,{w:700,size:32,col:AG.ink});ag_T(ctx,r[1],cx+24,cy+82,{w:500,size:28,col:AG.mut});ctx.restore();});
  ctx.restore();return bb;}

/* the nights in test before the mandate: n marks in a row, each a small moon with a green tick under it (o.n, o.u 0..1 how many shown) */
function wm_nights(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,n=o.n||14,u=clamp(o.u==null?1:o.u,0,1);if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  for(let i=0;i<n;i++){const s=clamp(u*n*1.15-i,0,1);if(s<=0.01)continue;const cx=x+i*64;ctx.save();ctx.globalAlpha*=s;ag_about(ctx,cx,y,lerp(0.6,1,Math.min(1,ag_spr(s,0,0.5))));
    ctx.fillStyle="#E9E6DF";ctx.beginPath();ctx.arc(cx,y,22,0,TAU);ctx.fill();ctx.strokeStyle="rgba(60,50,40,0.18)";ctx.lineWidth=1.5;ctx.stroke();
    ctx.fillStyle="rgba(84,88,106,0.7)";ctx.beginPath();ctx.arc(cx-3,y-2,11,0,TAU);ctx.fill();ctx.fillStyle="#E9E6DF";ctx.beginPath();ctx.arc(cx+3,y-6,10,0,TAU);ctx.fill();
    ag_tick(ctx,cx,y+44,20,rgba(AG.green,1),3.6);ctx.restore();}
  ctx.restore();}
