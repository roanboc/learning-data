/* ===== Context and memory, governed: the repository and the platform =====
   The team's context as code (the example project, films/analytics-engineering/project/, as its files are named there), how a change
   comes in (a pull request, its owner's review, a second person's approval for production), and where agents read it on Databricks.
     cm_repo(ctx, x, y, w, rows, o)     the repository: rows [{name, note, folder, lit, a}], each a file or a folder; returns each row's box
     cm_owners(ctx, x, y, w, lines, o)  CODEOWNERS: lines [[path, owner], ...], written from the project's metadata
     cm_pr(ctx, x, y, w, o)             a pull request: o.title, o.by, o.files, o.rows [{text, state: "tick"|"wait"|"lock"|"no", a}]
     cm_history(ctx, x, y, w, rows, o)  the history: rows [[who and when, why], ...]
     cm_zone(ctx, x, y, w, h, label, o) a soft panel for a place the agents read from (on Databricks), its name at the top
     cm_table(ctx, x, y, w, o)          a table in Unity Catalog with its comments
     cm_skill(ctx, x, y, w, o)          a skill in Unity Gateway: a Unity Catalog object, with its owner, permissions and audit
     cm_quote(ctx, x, y, w, text, src, o)  a line quoted from the docs, with where it comes from
     cm_bin(ctx, x, y, s, col, open)    a bin, for deleting */

function cm_fileIcon(ctx,x,y,col,folder){ctx.save();ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=2.6;ctx.lineJoin="round";
  if(folder){ctx.beginPath();ctx.moveTo(x-14,y-8);ctx.lineTo(x-14,y+12);ctx.lineTo(x+16,y+12);ctx.lineTo(x+16,y-6);ctx.lineTo(x+1,y-6);ctx.lineTo(x-3,y-11);ctx.lineTo(x-14,y-11);ctx.closePath();ctx.stroke();}
  else{ctx.beginPath();ctx.moveTo(x-11,y-14);ctx.lineTo(x+5,y-14);ctx.lineTo(x+12,y-7);ctx.lineTo(x+12,y+14);ctx.lineTo(x-11,y+14);ctx.closePath();ctx.stroke();
    ctx.beginPath();ctx.moveTo(x+5,y-14);ctx.lineTo(x+5,y-7);ctx.lineTo(x+12,y-7);ctx.stroke();}
  ctx.restore();}
const CM_ROW=58;
function cm_repo(ctx,x,y,w,rows,o){o=o||{};const a=o.a==null?1:o.a,nameW=o.nameW||470,h=118+rows.length*CM_ROW+18,bb={x,y,w,h};
  const out=rows.map((r,i)=>({x:x+18,y:y+112+i*CM_ROW,w:w-36,h:CM_ROW-6}));if(a<=0)return{bb,rows:out};
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,o.k));
  ag_box(ctx,x,y,w,h,22,{edge:AG.blue,edgeA:0.7});
  ag_T(ctx,"REPOSITORY",x+28,y+50,{w:700,size:28,ls:4,col:AG.blue});ag_T(ctx,o.title||"The team's project",x+28,y+94,{w:700,size:36});
  rows.forEach((r,i)=>{const ra=r.a==null?1:r.a;if(ra<=0)return;const b=out[i],lit=r.lit||0;ctx.save();ctx.globalAlpha*=ra;
    if(lit>0){ctx.fillStyle=rgba(r.col||AG.blue,0.1*lit);rr(ctx,b.x,b.y,b.w,b.h,12);ctx.fill();ctx.strokeStyle=rgba(r.col||AG.blue,0.55*lit);ctx.lineWidth=2;rr(ctx,b.x,b.y,b.w,b.h,12);ctx.stroke();}
    cm_fileIcon(ctx,b.x+30,b.y+b.h/2,rgba(r.col||AG.blue,0.9),r.folder);
    ag_T(ctx,r.name,b.x+62,b.y+b.h/2+10,{w:500,size:28,f:"mono",col:r.strike?AG.mut:AG.ink});
    if(r.strike>0){const tw=ag_tw(ctx,r.name,{w:500,size:28,f:"mono"});ctx.strokeStyle=rgba(AG.amber,0.9);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(b.x+58,b.y+b.h/2);ctx.lineTo(b.x+62+(tw+4)*clamp(r.strike,0,1),b.y+b.h/2);ctx.stroke();}
    if(r.note)ag_T(ctx,r.note,b.x+62+nameW,b.y+b.h/2+10,{w:600,size:28,col:r.noteCol||AG.mut,a:r.noteA==null?1:r.noteA});ctx.restore();});
  ctx.restore();return{bb,rows:out};}

function cm_owners(ctx,x,y,w,lines,o){o=o||{};const a=o.a==null?1:o.a,h=132+lines.length*92+10;if(a<=0)return{x,y,w,h};
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,o.k));ag_box(ctx,x,y,w,h,22,{edge:AG.blue,edgeA:0.6});
  ag_T(ctx,"CODEOWNERS",x+28,y+50,{w:700,size:28,ls:4,col:AG.blue,f:"mono"});ag_T(ctx,o.sub||"Written from the project's own metadata",x+28,y+94,{w:600,size:28,col:AG.mut,a:o.subA==null?1:o.subA});
  lines.forEach((l,i)=>{const la=l[2]==null?1:l[2];if(la<=0)return;const yy=y+156+i*92;ctx.save();ctx.globalAlpha*=la;
    if(l[3]){ctx.fillStyle=rgba(AG.blue,0.1*l[3]);rr(ctx,x+14,yy-36,w-28,88,12);ctx.fill();}
    ag_T(ctx,l[0],x+28,yy,{w:500,size:28,f:"mono",col:AG.ink});ag_T(ctx,l[1],x+64,yy+42,{w:500,size:28,f:"mono",col:AG.blue});ctx.restore();});
  ctx.restore();return{x,y,w,h};}

// a pull request: who opened it, what it changes, and who must approve it
function cm_pr(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,rows=o.rows||[],files=o.files||[],tl=ag_wrap(ctx,o.title||"",w-56,{w:700,size:34});
  const h=76+tl.length*42+(o.by?44:0)+files.length*42+(files.length?14:0)+rows.length*52+22,bb={x,y,w,h};if(a<=0)return bb;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,o.k));ag_box(ctx,x,y,w,h,22,{edge:o.edge||AG.blue,edgeA:0.75});
  cm_branchIcon(ctx,x+42,y+42,rgba(AG.blue,1));ag_T(ctx,o.kick||"PULL REQUEST",x+72,y+52,{w:700,size:28,ls:4,col:AG.blue});
  let yy=y+60;tl.forEach(l=>{yy+=42;ag_T(ctx,l,x+28,yy,{w:700,size:34});});
  if(o.by){yy+=42;if(o.byGlow>0){ctx.fillStyle=rgba(AG.violet,0.12*o.byGlow);rr(ctx,x+14,yy-34,w-28,46,10);ctx.fill();}
    if(o.byPen)ag_pen(ctx,x+40,yy-10,24,rgba(o.byGlow>0?mix(AG.mut,AG.violet,o.byGlow):AG.mut,1));ag_T(ctx,o.by,x+(o.byPen?62:28),yy,{w:600,size:28,col:o.byGlow>0?mix(AG.mut,AG.violet,o.byGlow):AG.mut});}
  files.forEach(f=>{yy+=42;const fa=f[1]==null?1:f[1];ag_T(ctx,f[0],x+28,yy,{w:500,size:28,f:"mono",col:f[2]||AG.ink,a:fa});});if(files.length)yy+=14;
  rows.forEach(r=>{const ra=r.a==null?1:r.a;yy+=52;if(ra<=0)return;ctx.save();ctx.globalAlpha*=ra;const ix=x+44,iy=yy-10,c=r.state==="tick"?AG.green:r.state==="no"?AG.amber:r.state==="lock"?AG.mut:AG.mut;
    const tk=r.state==="tick"?1:r.state==="wait"?clamp(r.tick||0,0,1):0;
    if(tk>0){ctx.save();ctx.globalAlpha*=tk;ag_about(ctx,ix,iy,lerp(0.6,1,Math.min(1,ag_spr(tk,0,0.5))));ag_tick(ctx,ix,iy,24,rgba(AG.green,1),4);ctx.restore();}
    if(r.state==="lock")ag_lock(ctx,ix,iy+4,26,rgba(AG.mut,1));else if(r.state==="no")ag_warn(ctx,ix,iy,28,rgba(AG.amber,1));
    else if(r.state==="wait"&&tk<1){ctx.save();ctx.globalAlpha*=1-tk;ctx.strokeStyle=rgba(AG.mut,0.7);ctx.lineWidth=3;ctx.beginPath();ctx.arc(ix,iy,12,0,TAU);ctx.stroke();ctx.restore();}
    ag_T(ctx,r.text,x+76,yy,{w:600,size:28,col:r.state==="no"?AG.ink:mix(AG.mut,AG.ink,tk)});ctx.restore();});
  ctx.restore();return bb;}
function cm_branchIcon(ctx,x,y,col){ctx.save();ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x-8,y-14);ctx.lineTo(x-8,y+14);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x+8,y-8);ctx.bezierCurveTo(x+8,y+4,x-8,y+2,x-8,y+10);ctx.stroke();for(const [px,py] of [[x-8,y-14],[x-8,y+14],[x+8,y-10]]){ctx.beginPath();ctx.arc(px,py,4.5,0,TAU);ctx.fill();}ctx.restore();}

function cm_history(ctx,x,y,w,rows,o){o=o||{};const a=o.a==null?1:o.a,h=96+rows.length*84;if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,o.k));
  ag_box(ctx,x,y,w,h,22,{});ag_T(ctx,(o.kick||"History").toUpperCase(),x+28,y+50,{w:700,size:28,ls:4,col:AG.kick});
  ctx.strokeStyle=rgba(AG.mut,0.35);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+40,y+92);ctx.lineTo(x+40,y+h-34);ctx.stroke();
  rows.forEach((r,i)=>{const ra=r[2]==null?1:r[2];if(ra<=0)return;const yy=y+108+i*84;ctx.save();ctx.globalAlpha*=ra;ctx.fillStyle=rgba(r[3]||AG.mut,1);ctx.beginPath();ctx.arc(x+40,yy-8,8,0,TAU);ctx.fill();
    ag_T(ctx,r[0],x+68,yy,{w:700,size:28});ag_T(ctx,r[1],x+68,yy+38,{w:500,size:28,col:AG.mut});ctx.restore();});ctx.restore();return{x,y,w,h};}

// a soft panel: where the agents read the team's context on the platform
function cm_zone(ctx,x,y,w,h,label,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.fillStyle="rgba(250,249,246,0.42)";rr(ctx,x,y,w,h,30);ctx.fill();
  ctx.setLineDash([3,9]);ctx.lineCap="round";ctx.strokeStyle=rgba(AG.blue,0.45);ctx.lineWidth=3;rr(ctx,x,y,w,h,30);ctx.stroke();ctx.setLineDash([]);
  ag_label(ctx,x+30,y+52,label,{col:o.col||AG.blue});ctx.restore();}

function cm_table(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,inner=w-56,tl=o.comment?ag_wrap(ctx,o.comment,inner,{w:600,size:28}):[],
    cols=(o.cols||[]).map(c=>[c[0],ag_wrap(ctx,c[1],inner,{w:600,size:28}),c[2]==null?1:c[2]]);
  const h=112+(tl.length?44+tl.length*38:0)+cols.reduce((s,c)=>s+50+c[1].length*38,0)+28;if(a<=0)return{x,y,w,h};
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,o.k));ag_box(ctx,x,y,w,h,22,{edge:AG.blue,edgeA:0.6});
  ag_T(ctx,"TABLE IN UNITY CATALOG",x+28,y+50,{w:700,size:28,ls:4,col:AG.blue});ag_T(ctx,o.name||"",x+28,y+94,{w:500,size:28,f:"mono"});
  let yy=y+94;const ca=o.commentA==null?1:o.commentA;
  if(tl.length){yy+=44;ag_T(ctx,"Comment",x+28,yy,{w:700,size:28,col:AG.mut,a:ca});tl.forEach(l=>{yy+=38;ag_T(ctx,l,x+28,yy,{w:600,size:28,a:ca});});}
  cols.forEach(c=>{yy+=50;ag_T(ctx,c[0],x+28,yy,{w:500,size:28,f:"mono",col:AG.blue,a:c[2]});c[1].forEach(l=>{yy+=38;ag_T(ctx,l,x+28,yy,{w:600,size:28,a:c[2]});});});
  ctx.restore();return{x,y,w,h};}

function cm_skill(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,rows=o.rows||[],h=150+rows.length*48+14;if(a<=0)return{x,y,w,h};
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,o.k));ag_box(ctx,x,y,w,h,22,{edge:AG.blue,edgeA:0.6});
  ag_T(ctx,"SKILL IN UNITY GATEWAY",x+28,y+50,{w:700,size:28,ls:4,col:AG.blue});ag_T(ctx,o.name||"",x+28,y+96,{w:500,size:32,f:"mono"});
  rows.forEach((r,i)=>{const ra=r[1]==null?1:r[1];if(ra<=0)return;const yy=y+150+i*48;ctx.save();ctx.globalAlpha*=ra;ctx.fillStyle=rgba(AG.blue,0.85);ctx.beginPath();ctx.arc(x+40,yy-10,6,0,TAU);ctx.fill();
    ag_T(ctx,r[0],x+60,yy,{w:600,size:28});ctx.restore();});ctx.restore();return{x,y,w,h};}

function cm_quote(ctx,x,y,w,text,src,o){o=o||{};const a=o.a==null?1:o.a,lines=ag_wrap(ctx,text,w-96,{w:600,size:32}),h=64+lines.length*44+58;if(a<=0)return{x,y,w,h};
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,o.k));ag_box(ctx,x,y,w,h,22,{edge:o.edge||null,edgeA:0.6});
  ag_T(ctx,"“",x+26,y+86,{w:800,size:72,col:AG.blue,deco:1});lines.forEach((l,i)=>ag_T(ctx,l,x+72,y+70+i*44,{w:600,size:32}));
  ag_T(ctx,src,x+72,y+70+lines.length*44+24,{w:500,size:28,col:AG.mut});ctx.restore();return{x,y,w,h};}

function cm_bin(ctx,x,y,s,col,open){ctx.save();ctx.strokeStyle=col;ctx.lineWidth=s*0.09;ctx.lineJoin="round";ctx.lineCap="round";
  ctx.save();ctx.translate(x-s*0.38,y-s*0.3);ctx.rotate(-(open||0)*0.5);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(s*0.76,0);ctx.stroke();ctx.beginPath();ctx.moveTo(s*0.26,0);ctx.lineTo(s*0.3,-s*0.12);ctx.lineTo(s*0.46,-s*0.12);ctx.lineTo(s*0.5,0);ctx.stroke();ctx.restore();
  ctx.beginPath();ctx.moveTo(x-s*0.3,y-s*0.2);ctx.lineTo(x-s*0.24,y+s*0.42);ctx.lineTo(x+s*0.24,y+s*0.42);ctx.lineTo(x+s*0.3,y-s*0.2);ctx.stroke();
  for(const f of [-0.1,0.1]){ctx.beginPath();ctx.moveTo(x+s*f,y-s*0.08);ctx.lineTo(x+s*f*0.9,y+s*0.3);ctx.stroke();}ctx.restore();}
