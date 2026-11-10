/* ===== Tags that travel: the tools' pages, and the pieces of the rooms =====
   Drawn with the module's kit as it is (pages.js, glass.js). The tools' pages are drawn as their docs show them on 5 November 2026,
   each with its logo, unaltered, and its name beside it (the film's "logos": true), and never with a release status:
     tt_name        a person's name and role, on a card beside them in their room (cyan: who they are)
     tt_classCard   chapter 2: Mei's classes and levels, from Know what you hold (its chips are drawn by the scene, so they can fly
                    into the page; tt_classAt says where each sits)
     tt_tagsPage    Databricks' Governed tags: personal_data, level and faculty, and their allowed values (tt_tagSlot: where each
                    value lands), and a value typed by hand, refused
     tt_permits     the tags' permissions: ASSIGN to registrar_owners, whose one member is registrar-loader; anyone else may not
     tt_scanPage    Databricks' Data classification results: the classes it detected in the registrar's catalog
     tt_prPage      GitHub's pull request: each class written beside its column in the learner table's file, and its owner's review
     tt_dbtRun      dbt's build: the learner table built, then its classes, its faculty tag and its level set
     tt_propDialog  Databricks' tag propagation, tag by tag: on for personal_data (its default propagation value special) and for
                    faculty, off for level
     tt_mini        the opening's small panes: a table's name and a few rows, each with its value and its class
     tt_room        the studies' workspace: a room of clear glass, its door at the right, which can frost shut
     tt_file        a file, downloaded: its class chips fall off at the glass
     tt_thumb       a small window on a place of the opening (the bin of mixed wood), where the film comes back to the story
   Every word is at least 28 px; nothing goes below y 890. Prefixed tt_. */

function tt_name(ctx,x,y,w,role,name,o){o=o||{};return dp_card(ctx,x,y,w,{kick:role,title:name},{col:"cyan",a:o.a,k:o.k,measure:o.measure});}
// a small picture of a group (two people drawn in light), for an identity chip that is a group
function tt_groupPic(c,x,y,col){c.save();c.translate(-22,4);c.scale(0.86,0.86);dp_personPic(c,x,y,col);c.restore();c.save();c.translate(26,-2);dp_personPic(c,x,y,col);c.restore();}

/* ---------------------------------------------------------------- chapter 2: from the classes to governed tags */
const TT_KW_CLS=["special","direct","pseudonymous","indirect","noneIce"],TT_KW_LVL=["public","internal","confidential","restricted"];
const tt_lvlW=(ctx,s)=>dp_tw(ctx,s,{w:700,size:28})+36;
// where each chip of the class card sits: its left, and the words' baseline
function tt_classAt(ctx,x,y){let cx=x+200;const chips=TT_KW_CLS.map(c=>{const p=[cx,y+124];cx+=tt_chipW(ctx,c)+14;return p;});
  cx=x+200;const levels=TT_KW_LVL.map(l=>{const p=[cx,y+196];cx+=tt_lvlW(ctx,l)+14;return p;});return{chips,levels};}
// the classes and levels from Know what you hold, 1080 x 236, their chips drawn by the scene (at tt_classAt); o.titleA, the title's
// opacity: it goes before the chips fly up across it
function tt_classCard(ctx,x,y,o){o=o||{};const w=1080,h=236,a=o.a==null?1:o.a;if(!(a>0.003))return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,clamp(o.k,0,1.2)));
  dp_panel(ctx,x,y,w,h,{col:TT_ICE,r:20,glowR:36});
  dp_T(ctx,"FROM KNOW WHAT YOU HOLD",x+30,y+54,{w:800,size:28,ls:4,col:TT_ICE,a:o.titleA==null?1:o.titleA});
  dp_T(ctx,"Class",x+30,y+124,{w:600,size:28,col:"mut"});dp_T(ctx,"Level",x+30,y+196,{w:600,size:28,col:"mut"});ctx.restore();}

// Databricks' Governed tags page, 1180 x 500: a row for each tag, its allowed values landing in it (drawn by the scene, at tt_tagSlot)
const TT_TP={w:1180,h:500},TT_TVALS=[["special","direct","pseudonymous","indirect"],["public","internal","confidential","restricted"]];
// where value k of row i lands (i 0 personal_data, 1 level). The card waits under the page, so each value flies up into its row over
// empty rows only, never over the page's words
function tt_tagSlot(ctx,x,y,i,k){let cx=x+360;for(let j=0;j<k;j++)cx+=(i===0?tt_chipW(ctx,TT_TVALS[0][j]):tt_lvlW(ctx,TT_TVALS[1][j]))+14;return [cx,y+200+i*84];}
function tt_tagsPage(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(!(a>0.003))return;const {w,h}=TT_TP;ctx.save();ctx.globalAlpha*=a;
  dp_page(ctx,x,y,w,h,{tool:"databricks",name:"Azure Databricks",where:"Catalog › Governed tags",col:TT_ICE});
  const hy=y+128;dp_T(ctx,"Tag",x+32,hy,{w:700,size:28,col:"mut"});dp_T(ctx,"Allowed values",x+360,hy,{w:700,size:28,col:"mut"});
  ctx.fillStyle=rgba(DP.T.mut,0.35);ctx.fillRect(x+28,hy+18,w-56,1.4);
  ["personal_data","level","faculty"].forEach((s,i)=>{const ra=o.rowA?o.rowA(i):1;if(!(ra>0.003))return;const ry=y+200+i*84;ctx.save();ctx.globalAlpha*=ra;
    dp_T(ctx,s,x+32,ry,{w:500,size:30,f:"mono"});if(i<2){ctx.fillStyle=rgba(DP.T.mut,0.18);ctx.fillRect(x+28,ry+44,w-56,1.2);}ctx.restore();});
  // on tables only: said beside the tag's name, in its own row
  if(o.onlyA>0)dp_T(ctx,"tables only",x+32+dp_tw(ctx,"level",{w:400,size:30,f:"mono"})+22,y+284,{w:600,size:28,col:"mut",a:o.onlyA});
  if(o.noneA>0)dp_T(ctx,"no values",x+360,y+368,{w:600,size:28,col:"mut",a:o.noneA});
  // a value typed by hand into personal_data, refused: it isn't one of its values
  if(o.typeA>0){const fy=y+448;ctx.save();ctx.globalAlpha*=o.typeA;rr(ctx,x+32,fy-40,300,56,10);ctx.fillStyle="rgba(4,16,20,0.7)";ctx.fill();ctx.strokeStyle=rgba(DP.T.mut,0.6);ctx.lineWidth=1.6;ctx.stroke();
    const n=Math.round(8*clamp(o.type||0,0,1));if(n>0)dp_T(ctx,"my class".slice(0,n),x+52,fy-2,{w:500,size:28,f:"mono"});
    if(o.no>0){dp_cross(ctx,x+372,fy-12,"coral",o.no);dp_T(ctx,"not an allowed value",x+408,fy-2,{w:700,size:28,col:"coral",a:clamp(o.no*1.6-0.6,0,1)});}ctx.restore();}
  ctx.restore();}

// the tags' permissions, 1180 x 236: ASSIGN to the group registrar_owners; its one member, registrar-loader; anyone else may not
function tt_permits(ctx,x,y,o){o=o||{};const w=1180,h=236,a=o.a==null?1:o.a;if(!(a>0.003))return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,clamp(o.k,0,1.2)));
  dp_panel(ctx,x,y,w,h,{col:TT_ICE,r:20,glowR:36});
  dp_T(ctx,"Permissions",x+30,y+54,{w:700,size:32});dp_T(ctx,"personal_data · level · faculty",x+w-30,y+54,{w:500,size:28,f:"mono",col:"mut",align:"right"});
  dp_T(ctx,"ASSIGN",x+30,y+128,{w:500,size:30,f:"mono"});
  const g=tt_who(ctx,x+190,y+86,"registrar_owners",{pic:"group",mono:true,a:o.groupA==null?1:o.groupA,k:o.groupK});
  if(o.loaderA>0){const la=o.loaderA;ctx.save();ctx.globalAlpha*=la;dp_T(ctx,"member",g.x+g.w+22,y+128,{w:600,size:28,col:"mut"});ctx.restore();
    tt_who(ctx,g.x+g.w+150,y+86,"registrar-loader",{pic:"gear",mono:true,a:la,k:o.loaderK});}
  if(o.byHandA>0){const ba=o.byHandA;dp_T(ctx,"anyone else, by hand",x+30,y+206,{w:600,size:28,col:"mut",a:ba});
    ctx.save();ctx.globalAlpha*=ba;dp_cross(ctx,x+346,y+196,"coral",o.byHand==null?1:o.byHand);ctx.restore();
    dp_T(ctx,"may not assign",x+382,y+206,{w:700,size:28,col:"coral",a:ba*clamp((o.byHand==null?1:o.byHand)*1.6-0.6,0,1)});}
  ctx.restore();}

/* ---------------------------------------------------------------- chapter 3: the scan proposes */
// Databricks' Data classification results, 1180 x 440: the classes it detected in the registrar's catalog, each with how many columns
function tt_scanPage(ctx,x,y,o){o=o||{};const w=1180,h=440,a=o.a==null?1:o.a;if(!(a>0.003))return;ctx.save();ctx.globalAlpha*=a;
  dp_page(ctx,x,y,w,h,{tool:"databricks",name:"Azure Databricks",where:"registrar › Data classification",title:"Data classification",col:TT_ICE});
  const hy=y+212;dp_T(ctx,"Class",x+32,hy,{w:700,size:28,col:"mut"});dp_T(ctx,"Detected columns",x+760,hy,{w:700,size:28,col:"mut"});
  ctx.fillStyle=rgba(DP.T.mut,0.35);ctx.fillRect(x+28,hy+18,w-56,1.4);
  ["class.name","class.email_address","class.date_of_birth"].forEach((s,i)=>{const ra=o.rowA?o.rowA(i):1;if(!(ra>0.003))return;const ry=hy+70+i*62;ctx.save();ctx.globalAlpha*=ra;
    dp_T(ctx,s,x+32,ry,{w:500,size:30,f:"mono",col:"violet"});dp_T(ctx,"1",x+760,ry,{w:700,size:30});ctx.restore();});
  ctx.restore();}

/* ---------------------------------------------------------------- chapter 4: written once, in the project */
// the change in GitHub: lines added to the learner table's file, each column's class beside it
const TT_PR=["- name: email","  config:","    meta: {personal_data: direct}","- name: date_of_birth","  config:","    meta: {personal_data: indirect}","- name: course","  config: {meta: {personal_data: none}}"];
// GitHub's pull request, 1180 x 740: o.typed(i) 0 to 1 types line i; o.flick (0 to 1) shows the change to one line, and back;
// o.reviewA its review asked of Mei, o.approved (0 to 1) her approval
function tt_prPage(ctx,x,y,o){o=o||{};const w=1180,h=740,a=o.a==null?1:o.a;if(!(a>0.003))return;ctx.save();ctx.globalAlpha*=a;
  dp_page(ctx,x,y,w,h,{tool:"github",name:"GitHub",where:"Pull request",title:"Classes for the learner table",col:TT_ICE});
  dp_T(ctx,"models/core/student/_core_student__models.yml",x+32,y+190,{w:500,size:28,f:"mono",col:"mut"});
  rr(ctx,x+28,y+214,w-56,TT_PR.length*44+28,12);ctx.fillStyle="rgba(4,16,20,0.55)";ctx.fill();ctx.strokeStyle=rgba(DP.T.mut,0.35);ctx.lineWidth=1.4;ctx.stroke();
  TT_PR.forEach((s,i)=>{const u=o.typed?clamp(o.typed(i),0,1):1;if(u<=0)return;const ly=y+254+i*44;let txt=s.slice(0,Math.max(1,Math.round(s.length*u)));
    if(i===2&&o.flick>0){const f=o.flick;dp_T(ctx,"+",x+52,ly,{w:500,size:28,f:"mono",col:"mut"});dp_T(ctx,"    meta: {personal_data: direct}",x+88,ly,{w:500,size:28,f:"mono",a:1-f});
      dp_T(ctx,"    meta: {personal_data: special}",x+88,ly,{w:500,size:28,f:"mono",col:"violet",a:f});return;}
    dp_T(ctx,"+",x+52,ly,{w:500,size:28,f:"mono",col:"mut"});dp_T(ctx,txt,x+88,ly,{w:500,size:28,f:"mono"});});
  const ra=o.reviewA||0,ap=clamp(o.approved||0,0,1);
  if(ra>0)dp_T(ctx,"Review required · Mei Tanaka",x+32,y+648,{w:600,size:28,col:"mut",a:ra*(1-clamp(ap/0.45,0,1))});   // leaves, then the approval comes in
  if(ap>0.55){ctx.save();ctx.globalAlpha*=clamp((ap-0.55)/0.45,0,1);const pw=dp_pill(ctx,x+32,y+648,"Approved","green");dp_T(ctx,"Mei Tanaka · owner of the file",x+52+pw,y+648,{w:600,size:28});ctx.restore();}
  if(o.mergedA>0)dp_T(ctx,"Merged into main",x+32,y+704,{w:600,size:28,col:"mut",a:o.mergedA});
  ctx.restore();}

// dbt's build, 1100 x 470: the learner table built, then three steps after it, each lit in turn (o.built, o.step(i): 0 to 1)
function tt_dbtRun(ctx,x,y,o){o=o||{};const w=1100,h=470,a=o.a==null?1:o.a;if(!(a>0.003))return;ctx.save();ctx.globalAlpha*=a;
  dp_page(ctx,x,y,w,h,{tool:"dbt",name:"dbt",where:"dbt build",col:TT_ICE});
  dp_T(ctx,"dbt build --select core_learner_v1",x+32,y+136,{w:500,size:28,f:"mono",col:"mut"});
  const b=clamp(o.built||0,0,1);if(b>0){dp_tick(ctx,x+52,y+186,"green",b);dp_T(ctx,"core_learner_v1 · built",x+88,y+196,{w:700,size:30,a:ag_in(b,0.2,0.5)});}
  dp_T(ctx,"AFTER THE BUILD",x+32,y+268,{w:800,size:28,ls:4,col:"mut"});
  [["classes","each column's class, from the file"],["faculty","on faculty_code"],["level","the table's, last"]].forEach(([s,n],i)=>{const u=o.step?clamp(o.step(i),0,1):0,ry=y+330+i*56;
    if(u>0)dp_tick(ctx,x+52,ry-10,"green",u);dp_T(ctx,s,x+88,ry,{w:700,size:30,col:u>0.5?"ink":"mut"});dp_T(ctx,n,x+300,ry,{w:600,size:28,col:"mut",a:0.4+0.6*ag_in(u,0,0.5)});});
  ctx.restore();}

/* ---------------------------------------------------------------- chapter 5: propagation, switched on */
// Databricks' tag propagation, 1180 x 460, a row for each tag: its switch (o.sw(i), 0 off to 1 on, green) and its default value
function tt_propDialog(ctx,x,y,o){o=o||{};const w=1180,h=460,a=o.a==null?1:o.a;if(!(a>0.003))return;ctx.save();ctx.globalAlpha*=a;
  dp_page(ctx,x,y,w,h,{tool:"databricks",name:"Azure Databricks",where:"Governed tags › Configure",title:"Tag propagation",col:TT_ICE});
  const hy=y+204;dp_T(ctx,"Tag",x+32,hy,{w:700,size:28,col:"mut"});dp_T(ctx,"Propagation",x+390,hy,{w:700,size:28,col:"mut"});dp_T(ctx,"Default propagation value",x+640,hy,{w:700,size:28,col:"mut"});
  ctx.fillStyle=rgba(DP.T.mut,0.35);ctx.fillRect(x+28,hy+18,w-56,1.4);
  ["personal_data","faculty","level"].forEach((s,i)=>{const ry=hy+76+i*72,u=o.sw?clamp(o.sw(i),0,1):0,ra=o.rowA?o.rowA(i):1;if(!(ra>0.003))return;ctx.save();ctx.globalAlpha*=ra;
    dp_T(ctx,s,x+32,ry,{w:500,size:30,f:"mono"});dp_switch(ctx,x+390,ry-30,u,{col:"green"});
    if(i===0){const da=o.defA==null?1:o.defA;if(da>0)tt_chip(ctx,x+640,ry,"special",{a:da,glow:o.defGlow||0});}
    else dp_T(ctx,i===1?"key only":"off",x+640,ry,{w:600,size:28,col:"mut"});ctx.restore();});
  ctx.restore();}

/* ---------------------------------------------------------------- the opening's small panes
   tt_mini(ctx, x, y, w, title, sub, rows, o): rows [{c, v, v2, u, vc, v2c, cls, ca, ck}]: the column c, its value v turning into v2 as
   u goes from 0 to 1, and its class chip (cls, at ca, springing in with ck) at the right; returns each row's baseline (o.measure: only that) */
function tt_mini(ctx,x,y,w,title,sub,rows,o){o=o||{};const lh=60,top=sub?122:86,h=top+rows.length*lh+14,a=o.a==null?1:o.a,ys=rows.map((r,i)=>y+top+i*lh+40),ld=o.lead||0;
  if(o.measure||!(a>0.003))return{x,y,w,h,ys};ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,clamp(o.k,0,1.2)));
  dp_panel(ctx,x,y,w,h,{col:TT_ICE,r:20,glowR:36});dp_T(ctx,title,x+28,y+54,{w:700,size:34});if(sub)dp_T(ctx,sub,x+28,y+96,{w:600,size:28,col:"mut"});
  ctx.fillStyle=rgba(DP.T.mut,0.35);ctx.fillRect(x+24,y+top-6,w-48,1.4);
  rows.forEach((r,i)=>{const ry=ys[i],u=clamp(r.u||0,0,1);dp_T(ctx,r.c,x+28+ld,ry,{w:500,size:28,f:"mono",col:"mut"});
    if(r.v!=null&&u<1)dp_T(ctx,r.v,x+170+ld,ry,{w:600,size:30,col:r.vc||"ink",a:1-u});if(r.v2!=null&&u>0)dp_T(ctx,r.v2,x+170+ld,ry,{w:600,size:30,col:r.v2c||"violet",a:u});
    if(r.cls&&(r.ca==null||r.ca>0)){const cw=tt_chipW(ctx,r.cls);tt_chip(ctx,ld?x+24:x+w-24-cw,ry,r.cls,{a:r.ca==null?1:r.ca,k:r.ck});}});
  ctx.restore();return{x,y,w,h,ys};}

/* ---------------------------------------------------------------- the studies' workspace
   A room of clear glass on the hall's floor, its name over it; its door is the pane at its right, which can frost shut (o.shut 0 to 1);
   p draws its edges on (0 to 1) */
const TT_ROOM={x:120,y:200,w:1360,h:640,door:[1480,330,96,510]};
function tt_room(ctx,o){o=o||{};const R=TT_ROOM,a=o.a==null?1:o.a,p=clamp(o.p==null?1:o.p,0,1);if(!(a>0.003)||p<=0)return;ctx.save();ctx.globalAlpha*=a;
  const ice=TT_ICE,e=ag_sine(p);ctx.save();ctx.globalAlpha*=e;const g=ctx.createLinearGradient(R.x,R.y,R.x+R.w,R.y+R.h);g.addColorStop(0,"rgba(200,245,245,0.07)");g.addColorStop(0.5,"rgba(200,245,245,0.02)");g.addColorStop(1,"rgba(200,245,245,0.05)");
  ctx.fillStyle=g;ctx.fillRect(R.x,R.y,R.w,R.h);ctx.restore();
  // its edges drawn on: the top, then down each side; the floor's line
  ctx.save();ctx.strokeStyle=rgba(mix(ice,[255,255,255],0.3),0.9);ctx.lineWidth=2.2;ctx.shadowColor=rgba(ice,0.8);ctx.shadowBlur=12;ctx.lineCap="round";
  const L=R.w+2*R.h,d=L*e;ctx.beginPath();const hw=R.w/2,cx=R.x+hw;
  const side=(dir)=>{let r=d/2;ctx.moveTo(cx,R.y);const m=Math.min(r,hw);ctx.lineTo(cx+dir*m,R.y);r-=m;if(r>0)ctx.lineTo(cx+dir*hw,R.y+Math.min(r,R.h));};side(-1);side(1);ctx.stroke();ctx.restore();
  ctx.fillStyle=rgba(ice,0.3*e);ctx.fillRect(R.x,R.y+R.h,R.w+R.door[2],2);
  dp_T(ctx,"studies · health_progress",R.x+4,R.y-22,{w:500,size:28,f:"mono",col:ice,a:ag_in(p,0.5,0.5)});
  // the door: a pane at the right, clear while it's open, frosted when shut
  const [dx,dy,dw,dh]=R.door,sh=clamp(o.shut||0,0,1);dp_wall(ctx,dx,dy,dw,dh,{col:ice,a:e*(1-sh)});if(sh>0)dp_wall(ctx,dx,dy,dw,dh,{col:ice,frosted:true,a:e*sh});
  ctx.restore();}
// a file, downloaded: a sheet with its name; its chips (cls) ride on it until the glass (drop 0 to 1 lets them fall and fade); bare,
// it's ringed coral (ring 0 to 1)
function tt_file(ctx,x,y,name,o){o=o||{};const a=o.a==null?1:o.a;if(!(a>0.003))return;ctx.save();ctx.globalAlpha*=a;const w=dp_tw(ctx,name,{w:500,size:28,f:"mono"})+120,h=76;
  dp_panel(ctx,x,y,w,h,{col:TT_ICE,r:14,glowR:22});const fx=x+22,fy=y+14;ctx.beginPath();ctx.moveTo(fx,fy);ctx.lineTo(fx+28,fy);ctx.lineTo(fx+40,fy+12);ctx.lineTo(fx+40,fy+48);ctx.lineTo(fx,fy+48);ctx.closePath();
  ctx.fillStyle=rgba(TT_ICE,0.18);ctx.fill();ctx.strokeStyle=rgba(TT_ICE,0.95);ctx.lineWidth=2;ctx.stroke();
  dp_T(ctx,name,x+80,y+48,{w:500,size:28,f:"mono"});
  (o.cls||[]).forEach((c,i)=>{const dr=clamp(o.drop||0,0,1),cx=x+20+i*30,cy=y+h+46+dr*dr*110+i*10*dr;tt_chip(ctx,x+20+i*(tt_chipW(ctx,c)+12),cy,c,{a:1-ag_in(dr,0.3,0.7)});});
  if(o.ring>0)tt_ring(ctx,x,y,w,h,o.ring,{});
  ctx.restore();return w;}
// a small window on a place: view [x, y, w, h] the part of it shown; label under it
function tt_thumb(ctx,x,y,w,h,place,o){o=o||{};const a=o.a==null?1:o.a;if(!(a>0.003))return;const v=o.view||[0,0,W,H];ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,clamp(o.k,0,1.2)));
  ctx.save();ctx.shadowColor=rgba(TT_ICE,0.35);ctx.shadowBlur=34;rr(ctx,x,y,w,h,16);ctx.fillStyle="rgb(6,16,20)";ctx.fill();ctx.restore();
  ctx.save();rr(ctx,x,y,w,h,16);ctx.clip();ctx.translate(x,y);ctx.scale(w/v[2],h/v[3]);ctx.translate(-v[0],-v[1]);ctx.drawImage(ag_place(place),0,0);if(o.draw)o.draw(ctx);ctx.restore();
  rr(ctx,x+1,y+1,w-2,h-2,16);ctx.strokeStyle=rgba(mix(TT_ICE,[255,255,255],0.35),0.95);ctx.lineWidth=2.2;ctx.stroke();
  if(o.label)dp_slip(ctx,x+w/2,y+h+16,o.label,TT_ICE,{align:"center",ink:true});
  ctx.restore();}
