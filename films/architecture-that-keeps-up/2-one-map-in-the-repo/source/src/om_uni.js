/* ===== One map, in the repo: the university, 2027 =====
   The film's own pictures for the data team's year (prefix om_). The module's kit draws the rooms, the people, the sheets and the things
   in them, and is never changed for this film; what is here is this film's alone:
     omCouncil, omMorning, omLate             the room where the data council meets, on a grey day; the team's room on a summer morning;
                                              and late on a December afternoon
     om_target(ctx, x, y, w, h, o)            a small picture of the platform's target: the sources, the platform, the products, and the
                                              old warehouse where a copy still shows it
     om_repo(ctx, x, y, w, h, o)              the data team's repository on a screen: the map's files beside the platform's code
     om_code(ctx, x, y, w, h, lines, o)       lines of text in the typewriter face, with their numbers: a diagram kept as text, or a
                                              change to it
     om_flow(ctx, x, y, s, o)                 the diagram drawn from that text: the sources, the platform, the products and the pages
     om_fan(ctx, o)                           the repository, and everything made from it each night, a sheet each
     om_pr(ctx, x, y, w, h, o)                a pull request on a screen: its title, its reason, the files it changes, who reviews it and
                                              the check
     om_lanes(ctx, x, y, w, o)                two ways to keep the map: saved up for a funded project, or updated with every change
     om_history(ctx, x, y, w, h, o)           the map's history: each change, its date and its reason
   Colour keeps the module's meaning: blue the map, its diagrams and its changes (a design); orange the data and the platform's code;
   green done or agreed; amber a copy that disagrees, a wrong line or a wait; violet only the agent. Every word is at least 28 px. */

/* ---------------------------------------------------------------- the places */
AG_PLACES.omCouncil=c=>lp_paintRoom(c,{light:"grey",seed:11});
AG_PLACES.omMorning=c=>lp_paintRoom(c,{light:"morning",seed:12});
AG_PLACES.omLate=c=>lp_paintRoom(c,{light:"late",seed:13});

const OM_MONO={w:500,size:28,f:"mono"};
// a small box with a label, centred on (x, y); o: col (its edge and band), w, h, a, fill (0 to 1: tinted with its colour), dash
function om_box(ctx,x,y,label,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const w=o.w||(label?lp_tw(ctx,label,{w:700,size:28})+44:80),h=o.h||58,col=o.col||LP.mut;
  ctx.save();ctx.globalAlpha*=a;ctx.fillStyle=rgba(o.fill?mix(LP.paper,col,0.14*o.fill):LP.paper,1);rr(ctx,x-w/2,y-h/2,w,h,10);ctx.fill();
  if(o.dash)ctx.setLineDash([9,7]);ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3;rr(ctx,x-w/2,y-h/2,w,h,10);ctx.stroke();ctx.setLineDash([]);
  if(label)lp_T(ctx,label,x,y+10,{w:700,size:28,align:"center",col:o.tcol||LP.ink});ctx.restore();return{x:x-w/2,y:y-h/2,w,h};}
// an arrow from (x0, y0) to (x1, y1), drawn out to u; o: col, w, dash, a
function om_arrow(ctx,x0,y0,x1,y1,u,o){o=o||{};u=ag_sine(u==null?1:u);const a=o.a==null?1:o.a;if(u<=0||a<=0.004)return;const x=lerp(x0,x1,u),y=lerp(y0,y1,u),an=Math.atan2(y1-y0,x1-x0);
  ctx.save();ctx.globalAlpha*=a*clamp(u*6,0,1);ctx.strokeStyle=rgba(o.col||LP.mut,1);ctx.fillStyle=rgba(o.col||LP.mut,1);ctx.lineWidth=o.w||4;ctx.lineCap="round";
  if(o.dash)ctx.setLineDash(o.dash);ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x-Math.cos(an)*10,y-Math.sin(an)*10);ctx.stroke();ctx.setLineDash([]);
  ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-Math.cos(an-0.45)*20,y-Math.sin(an-0.45)*20);ctx.lineTo(x-Math.cos(an+0.45)*20,y-Math.sin(an+0.45)*20);ctx.closePath();ctx.fill();ctx.restore();}

/* ---------------------------------------------------------------- a small picture of the platform's target, with no words in it
   Three sources (orange), the platform (blue), two products and a page. o: a; warehouse (0 to 1: the old warehouse still in it, amber,
   beside the platform); u (0 to 1: drawn in); col (the platform's edge: blue, the target) */
function om_target(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const u=o.u==null?1:o.u,wh=ag_sine(o.warehouse||0);ctx.save();ctx.globalAlpha*=a;
  const sx=x+w*0.12,px=x+w*0.5,qx=x+w*0.86,cy=y+h*0.42,bw=w*0.16,bh=h*0.14;
  const box=(bx,by,ww,hh,col,k,fill)=>{const v=ag_sine(clamp(u*4-k,0,1));if(v<=0)return;ctx.save();ctx.globalAlpha*=v;ctx.fillStyle=rgba(mix(LP.paper,col,fill||0.18),1);
    rr(ctx,bx-ww/2,by-hh/2,ww,hh,6);ctx.fill();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3;rr(ctx,bx-ww/2,by-hh/2,ww,hh,6);ctx.stroke();ctx.restore();};
  const ln=(x0,y0,x1,y1,k,col)=>{const v=ag_sine(clamp(u*4-k,0,1));if(v<=0)return;ctx.strokeStyle=rgba(col||LP.mut,0.8*v);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(lerp(x0,x1,v),lerp(y0,y1,v));ctx.stroke();};
  for(const k of [-1,0,1]){ln(sx+bw/2,cy+k*h*0.24,px-bw*0.7,cy,1);box(sx,cy+k*h*0.24,bw,bh,LP.orange,0.3);}
  box(px,cy,bw*1.4,bh*1.6,o.col||LP.blue,1.2,0.2);
  for(const k of [-0.5,0.5]){ln(px+bw*0.7,cy,qx-bw/2,cy+k*h*0.3,2);box(qx,cy+k*h*0.3,bw,bh,LP.green,2.4,0.16);}
  if(wh>0){ctx.save();ctx.globalAlpha*=wh;ln(sx+bw/2,cy+h*0.24,px-bw*0.6,y+h*0.86,0,LP.amber);box(px,y+h*0.86,bw*1.4,bh,LP.amber,0,0.3);ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- the data team's repository, on a screen
   Drawn inside lp_screen's draw. Rows: a folder or a file, its name, and a note. o: u (0 to 1: the rows come in); hl (a row's index, or
   null); hlA (0 to 1); rows (the list; OM_REPO by default) */
const OM_REPO=[
  {d:0,name:"data-team/",dir:true},
  {d:1,name:"platform/",dir:true,note:"the platform's code",col:LP.orange},
  {d:1,name:"architecture/",dir:true,note:"the map's source",col:LP.blue},
  {d:2,name:"model.xml",note:"ArchiMate exchange format",col:LP.blue},
  {d:2,name:"owners.yml",note:"what's the team's own",col:LP.blue},
  {d:2,name:"views/target.mmd",note:"a diagram, as text",col:LP.blue},
  {d:2,name:"views/delivery.drawio",note:"who does what",col:LP.blue},
  {d:2,name:"decisions/",dir:true,note:"decision records",col:LP.blue}];
function om_repo(c,x,y,w,h,o){o=o||{};const u=o.u==null?1:o.u,R=o.rows||OM_REPO;
  lp_T(c,"Repository · data-team",x+36,y+56,{w:800,size:30});c.fillStyle=rgba(mix(LP.paper,LP.mut,0.14),1);c.fillRect(x+24,y+78,w-48,2);
  R.forEach((r,i)=>{const v=ag_sine(clamp(u*R.length-i,0,1));if(v<=0)return;const ry=y+130+i*58,rx=x+40+r.d*44;c.save();c.globalAlpha*=v;
    if(o.hl===i&&o.hlA>0){c.fillStyle=rgba(r.col||LP.blue,0.12*o.hlA);rr(c,x+24,ry-40,w-48,54,8);c.fill();c.strokeStyle=rgba(r.col||LP.blue,o.hlA);c.lineWidth=3;rr(c,x+24,ry-40,w-48,54,8);c.stroke();}
    // a folder, or a page with a corner turned
    c.fillStyle=rgba(r.col||LP.mut,0.9);c.strokeStyle=rgba(r.col||LP.mut,0.9);c.lineWidth=2.5;
    if(r.dir){c.beginPath();c.moveTo(rx,ry-24);c.lineTo(rx+12,ry-24);c.lineTo(rx+16,ry-19);c.lineTo(rx+30,ry-19);c.lineTo(rx+30,ry);c.lineTo(rx,ry);c.closePath();c.fill();}
    else{c.beginPath();c.moveTo(rx+3,ry-26);c.lineTo(rx+19,ry-26);c.lineTo(rx+27,ry-18);c.lineTo(rx+27,ry);c.lineTo(rx+3,ry);c.closePath();c.stroke();}
    lp_T(c,r.name,rx+44,ry,OM_MONO);if(r.note)lp_T(c,r.note,x+w-40,ry,{w:600,size:28,align:"right",col:LP.mut});c.restore();});}

/* ---------------------------------------------------------------- lines of text in the typewriter face, with their numbers
   o: u (0 to 1: typed in, line by line); hl ({i, col, a}: a line picked out); swap ({i, text, u}: a line typed over with new words);
   head (a line over them, such as the file's name) */
function om_code(c,x,y,w,h,lines,o){o=o||{};const u=o.u==null?1:o.u,n=lines.length,lh=50,y0=y+(o.head?118:70);
  if(o.head){lp_T(c,o.head,x+36,y+56,{w:800,size:30});c.fillStyle=rgba(mix(LP.paper,LP.mut,0.14),1);c.fillRect(x+24,y+78,w-48,2);}
  lines.forEach((s,i)=>{const v=clamp(u*n-i,0,1);if(v<=0)return;const ly=y0+i*lh;
    const hl=o.hl&&o.hl.i===i?ag_sine(o.hl.a==null?1:o.hl.a):0;if(hl>0){c.fillStyle=rgba(o.hl.col,0.13*hl);rr(c,x+20,ly-36,w-40,50,8);c.fill();c.strokeStyle=rgba(o.hl.col,hl);c.lineWidth=3;rr(c,x+20,ly-36,w-40,50,8);c.stroke();}
    lp_T(c,String(i+1),x+70,ly,{w:500,size:28,f:"mono",align:"right",col:LP.mut});
    let txt=s;const sw=o.swap&&o.swap.i===i?ag_sine(o.swap.u):0;
    c.save();c.beginPath();c.rect(x+90,ly-40,(w-110)*ag_sine(v),60);c.clip();
    if(sw>0){c.save();c.globalAlpha*=1-sw;lp_T(c,txt,x+96,ly,OM_MONO);c.restore();c.save();c.globalAlpha*=sw;lp_T(c,o.swap.text,x+96,ly,OM_MONO);c.restore();}
    else lp_T(c,txt,x+96,ly,OM_MONO);c.restore();});}

/* ---------------------------------------------------------------- the diagram drawn from that text
   The sources (orange), the platform (blue), the products (green) and the pages; and the old warehouse with payroll's reports when the
   change that retires it is drawn. Centred on (x, y), at scale s. o: u (0 to 1: drawn in, node by node); bad (0 to 1: payroll's reports
   still drawn from the old warehouse, amber); fixed (0 to 1: the line moved to the platform, green); retire (0 to 1: the old warehouse
   crossed out, dashed); a */
function om_flow(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const u=o.u==null?1:o.u;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);
  const k=i=>clamp(u*5-i,0,1),ret=ag_sine(o.retire||0);
  const L=[{l:"Timetable",x:-330,y:-150},{l:"Sensors",x:-330,y:-50},{l:"Payroll",x:-330,y:50}];
  if(o.retire!=null||o.bad!=null){const bd=ag_sine(o.bad||0),fx=ag_sine(o.fixed||0);
    // payroll's reports, and the line they read from: the old warehouse (wrong, once it's gone) or the platform
    om_arrow(ctx,40,40,250,150,k(3),{col:LP.mut});
    om_box(ctx,330,150,"Payroll reports",{col:LP.green,a:ag_sine(k(3)),fill:0.5});
    if(bd>0)om_arrow(ctx,-120,210,190,165,1,{col:LP.amber,a:bd*(1-fx),w:5});
    if(fx>0)om_arrow(ctx,90,60,240,128,fx,{col:LP.green,w:5});
    const wa=ag_sine(k(2));om_box(ctx,-150,210,"Old warehouse",{col:LP.amber,a:wa*(1-0.55*ret),dash:ret>0.5,fill:0.4});
    if(ret>0){ctx.save();ctx.globalAlpha*=ret*wa;ctx.strokeStyle=rgba(LP.amber,1);ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-270,190);ctx.lineTo(-30,230);ctx.stroke();ctx.restore();}}
  L.forEach((n,i)=>{om_box(ctx,n.x,n.y,n.l,{col:LP.orange,w:200,a:ag_sine(k(0)),fill:0.5});om_arrow(ctx,n.x+104,n.y,-104,n.y*0.25,k(1),{col:LP.mut});});
  om_box(ctx,0,-25,"Platform",{col:LP.blue,w:200,h:90,a:ag_sine(k(1)),fill:0.6});
  om_arrow(ctx,104,-40,250,-120,k(2),{col:LP.mut});om_box(ctx,330,-120,"Room use",{col:LP.green,w:200,a:ag_sine(k(2)),fill:0.5});
  ctx.restore();}

/* ---------------------------------------------------------------- the repository, and everything made from it each night
   The repository's sheet on the left; an arrow out to each of the things made from it, each a small sheet. o: a; u (0 to 1: the
   repository's sheet); lit (one per output, 0 to 1: its arrow drawn, its sheet in); ticks (0 to 1: a green tick on each); x0 */
const OM_OUT=[{t:"The architecture tool",s:"Its views"},{t:"The wiki",s:"Its pages"},{t:"The monthly page",s:"Its picture"},{t:"Who does what",s:"When, and how"}];
function om_fan(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;const rx=o.x0||200,ry=300,rw=520;
  const ru=o.u==null?1:o.u;if(ru>0)lp_textSheet(ctx,rx,ry,rw,{kick:"The repository",title:"The map's source",lines:["model.xml · views · owners.yml"]},{col:LP.blue,light:o.light,a:ag_sine(ru),k:o.k});
  OM_OUT.forEach((p,i)=>{const v=(o.lit||[])[i]||0;if(v<=0)return;const oy=150+i*170,ox=1180;
    om_arrow(ctx,rx+rw+20,ry+110,ox-24,oy+60,clamp(v*1.6,0,1),{col:LP.blue,w:4});
    const sv=ag_in(v,0.45,0.55);if(sv>0)lp_textSheet(ctx,ox,oy,560,{title:p.t,sub:p.s},{light:o.light,a:sv,pin:false});
    const tk=(o.ticks||0);if(tk>0)om_tickAt(ctx,ox+560-40,oy+48,tk);});
  ctx.restore();}
function om_tickAt(ctx,x,y,u){if(u<=0)return;const f=lerp(0.6,1,ag_spr(u*0.9,0,0.5));ctx.save();ctx.globalAlpha*=ag_in(u,0,0.4);ctx.fillStyle=rgba(LP.green,1);
  ctx.beginPath();ctx.arc(x,y,22*f,0,TAU);ctx.fill();lp_icon(ctx,"tick",x,y,30*f,[255,255,255]);ctx.restore();}
function om_crossAt(ctx,x,y,u){if(u<=0)return;const f=lerp(0.6,1,ag_spr(u*0.9,0,0.5));ctx.save();ctx.globalAlpha*=ag_in(u,0,0.4);ctx.fillStyle=rgba(LP.amber,1);
  ctx.beginPath();ctx.arc(x,y,22*f,0,TAU);ctx.fill();lp_icon(ctx,"cross",x,y,28*f,[255,255,255]);ctx.restore();}

/* ---------------------------------------------------------------- a pull request, on a screen
   Drawn inside lp_screen's draw. o: num, title, by (who opened it), agent (0 to 1: drafted by the agent, a violet band), why (its reason),
   files ([{name, note, col}]), fu (0 to 1: the files come in), fhl (a file's index, picked out), reviewers ([names]), ru (0 to 1),
   check ({text, state: "pass" or "fail", u}), approved ({text, u}) */
function om_pr(c,x,y,w,h,o){o=o||{};const ag=ag_sine(o.agent||0);
  if(ag>0){c.fillStyle=rgba(LP.violet,0.9*ag);c.fillRect(x,y,w,10);}
  lp_T(c,o.title,x+36,y+62,{w:800,size:34});
  lp_T(c,"#"+o.num+" · opened by "+o.by,x+36,y+108,{w:600,size:28,col:ag>0.5?LP.violet:LP.mut});
  let yy=y+164;if(o.why){lp_T(c,"Why: "+o.why,x+36,yy,{w:600,size:28});yy+=58;}
  c.fillStyle=rgba(mix(LP.paper,LP.mut,0.14),1);c.fillRect(x+24,yy-28,w-48,2);yy+=24;
  (o.files||[]).forEach((f,i)=>{const v=ag_sine(clamp((o.fu==null?1:o.fu)*(o.files.length)-i,0,1));if(v<=0){yy+=58;return;}c.save();c.globalAlpha*=v;
    if(o.fhl===i){c.fillStyle=rgba(f.col||LP.blue,0.12);rr(c,x+24,yy-38,w-48,54,8);c.fill();c.strokeStyle=rgba(f.col||LP.blue,1);c.lineWidth=3;rr(c,x+24,yy-38,w-48,54,8);c.stroke();}
    c.fillStyle=rgba(f.col||LP.blue,1);c.beginPath();c.arc(x+50,yy-10,8,0,TAU);c.fill();lp_T(c,f.name,x+72,yy,OM_MONO);
    if(f.note)lp_T(c,f.note,x+w-40,yy,{w:600,size:28,align:"right",col:LP.mut});c.restore();yy+=58;});
  if(o.reviewers){const v=ag_sine(o.ru==null?1:o.ru);if(v>0){c.save();c.globalAlpha*=v;lp_T(c,"Reviewers",x+36,yy+20,{w:700,size:28,col:LP.mut});let rx=x+220;
    for(const r of o.reviewers){const tw=lp_tw(c,r,{w:700,size:28})+40;c.fillStyle=rgba(mix(LP.paper,LP.blue,0.12),1);rr(c,rx,yy-16,tw,48,24);c.fill();lp_T(c,r,rx+20,yy+18,{w:700,size:28});rx+=tw+14;}
    c.restore();}yy+=74;}
  if(o.check){const v=ag_sine(o.check.u==null?1:o.check.u);if(v>0){c.save();c.globalAlpha*=v;const pass=o.check.state==="pass",col=pass?LP.green:LP.amber;
    c.fillStyle=rgba(col,1);c.beginPath();c.arc(x+52,yy-10,20,0,TAU);c.fill();lp_icon(c,pass?"tick":"cross",x+52,yy-10,26,[255,255,255]);
    lp_T(c,o.check.text,x+88,yy,{w:600,size:28});c.restore();}yy+=64;}
  if(o.approved&&o.approved.u>0)lp_pill(c,x+w-40-lp_tw(c,o.approved.text,{w:800,size:30})/2-50,y+h-56,o.approved.text,{col:LP.green,icon:"tick",a:ag_sine(o.approved.u),k:o.approved.k});}

/* ---------------------------------------------------------------- two ways to keep the map, on a sheet the film draws first
   Two lanes along a year. Saved up: the map stays as it was while the platform changes, then a funded project redraws it late, the gap
   between them shaded amber. With every change: the map steps with the platform. o: u (0 to 1: the year goes by), a, top (the first
   lane's label), bot (the second's) */
function om_lanes(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const u=ag_sine(o.u==null?1:o.u),x0=x+40,x1=x+w-40,xe=lerp(x0,x1,u);ctx.save();ctx.globalAlpha*=a;
  const lane=(ly,label,col,steps)=>{lp_T(ctx,label,x0,ly-70,{w:700,size:30});
    // the platform, as it changes: a grey line that rises step by step
    ctx.strokeStyle=rgba(LP.mut,0.6);ctx.lineWidth=4;ctx.beginPath();for(let i=0;i<=40;i++){const xx=lerp(x0,x1,i/40);if(xx>xe)break;const yy=ly-Math.floor(i/5)*7;i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.stroke();
    // the map, as it's kept
    ctx.strokeStyle=rgba(col,1);ctx.lineWidth=6;ctx.beginPath();for(let i=0;i<=40;i++){const xx=lerp(x0,x1,i/40);if(xx>xe)break;const yy=ly-steps(i)*7;i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.stroke();};
  lane(y+120,o.top||"Saved up for a funded project",LP.amber,i=>i<36?0:Math.floor(i/5));
  // the gap between the platform and a map kept that way
  if(u>0.1){ctx.save();ctx.globalAlpha*=0.18;ctx.fillStyle=rgba(LP.amber,1);ctx.beginPath();ctx.moveTo(x0,y+120);for(let i=0;i<=40;i++){const xx=lerp(x0,x1,i/40);if(xx>xe)break;ctx.lineTo(xx,y+120-Math.floor(i/5)*7);}
    for(let i=40;i>=0;i--){const xx=lerp(x0,x1,i/40);if(xx>xe)continue;ctx.lineTo(xx,y+120-(i<36?0:Math.floor(i/5))*7);}ctx.closePath();ctx.fill();ctx.restore();}
  lane(y+300,o.bot||"Updated with every change",LP.green,i=>Math.floor(i/5));
  ctx.restore();}

/* ---------------------------------------------------------------- the map's history, on a screen
   Drawn inside lp_screen's draw: the newest change at the top, each with its date and its reason. o: u (0 to 1: the list scrolls from
   the year's first change to its last), n (the count shown at the foot, rising with u) */
const OM_LOG=[["17 Dec","Retire the old warehouse"],["9 Dec","Payroll reports read from the platform"],["24 Nov","A data partner for Science"],
  ["2 Nov","Owner for the room-use product"],["14 Oct","Timetable changes, every hour"],["21 Sep","Three data partners join"],["31 Aug","Agent drafts, with a mandate"],
  ["27 Jul","The sensor feed, as events"],["13 Jul","Add the rooms' sensor feed"],["29 Jun","HR's reports move in August"],["14 Jun","Who does what: the build procedure"],
  ["7 Jun","One front door"],["1 Jun","First map in the repository"]];
function om_history(c,x,y,w,h,o){o=o||{};const u=o.u==null?1:o.u,lh=60,n=OM_LOG.length,top=y+100,rows=Math.floor((h-170)/lh);
  lp_T(c,"The map's history · 2027",x+36,y+56,{w:800,size:30});c.fillStyle=rgba(mix(LP.paper,LP.mut,0.14),1);c.fillRect(x+24,y+78,w-48,2);
  const off=lerp(n-rows,0,ag_sine(u));c.save();c.beginPath();c.rect(x,top,w,rows*lh);c.clip();
  OM_LOG.forEach((r,i)=>{const ry=top+40+(i-off)*lh;if(ry<top-20||ry>top+rows*lh+40)return;c.fillStyle=rgba(LP.blue,1);c.beginPath();c.arc(x+50,ry-10,8,0,TAU);c.fill();
    lp_T(c,r[0],x+76,ry,{w:600,size:28,col:LP.mut});lp_T(c,r[1],x+230,ry,{w:600,size:28});});c.restore();
  if(o.n!=null)lp_T(c,o.n+" changes, each with its reason",x+36,y+h-36,{w:700,size:28,col:LP.blue});}
