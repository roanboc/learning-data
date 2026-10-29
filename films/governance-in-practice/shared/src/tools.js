/* ===== Governance you can use: the series' own pictures =====
   Painted once for the series' six films, which bundle this file (each film.json's src) beside data governance's shared rooms
   (rooms.js), which stay as they are. Files as paper sheets, copied from the example project; a pull request's checks as a strip of
   lights; a tool's page drawn as a form, in no product's colours; a report written in Markdown; the data team's board with the series'
   six cards; the team's poster with Yusuf's gold pins; the agent's star; name cards and tags. Every name starts with gu_ or GU_. */

/* ---------- words ---------- */
// code is IBM Plex Mono, at 28 px or more; its weight is always 500
const GU_MONO=28;
const gu_mw=(ctx,s,size)=>tw(ctx,s,size||GU_MONO,500,"mono");
// a line of code, coloured as the series reads it: in YAML, a key (to its colon) in dark ink and its value in ink; a comment (# or --)
// muted; a "…" in pencil. Returns its width
function gu_code(ctx,s,x,y,o){o=o||{};const size=o.size||GU_MONO,a=o.a==null?1:o.a,col=o.col;
  const T_=(t,x_,c)=>{wc_T(ctx,t,x_,y,{w:500,size,f:"mono",col:col||c,a,deco:o.deco});return gu_mw(ctx,t,size);};
  if(s==="…")return T_(s,x,WC_PENCIL);
  const cm=/(^|\s)(#|--)\s/.exec(s),code=cm?s.slice(0,cm.index+cm[1].length):s,rest=cm?s.slice(cm.index+cm[1].length):"";let w=0;
  const m=o.lang==="yaml"?/^(\s*(?:- )?)([\w.+\-"'$]+:)(?=\s|$)/.exec(code):null;
  if(m){w+=T_(m[1]+m[2],x,WC_DARK);w+=T_(code.slice(m[0].length),x+w,WC_INK);}else w+=T_(code,x,WC_INK);
  if(rest)w+=T_(rest,x+w,WC_MUTED);return w;}
// a line of Markdown as a page shows it: `code` in the typeface, **bold** heavier, the rest in the page's words. Returns its width
function gu_md(ctx,s,x,y,o){o=o||{};const size=o.size||28;let w=0;
  s.split(/(`[^`]*`|\*\*[^*]+\*\*)/).forEach(p=>{if(!p)return;const code=p[0]==="`",bold=p.startsWith("**"),t=code?p.slice(1,-1):bold?p.slice(2,-2):p,
    wt=code?500:bold?800:(o.w||600);wc_T(ctx,t,x+w,y,{w:wt,size,f:code?"mono":undefined,col:o.col||(bold?WC_DARK:WC_INK),a:o.a,deco:o.deco});w+=tw(ctx,t,size,wt,code?"mono":undefined);});
  return w;}
// a name card: a person's name and what they do
function gu_nameCard(ctx,x,y,name,role,a){if(a<=0.01)return;const w=Math.round(Math.max(tw(ctx,name,32,800),tw(ctx,role,28,600))+60);
  withA(ctx,a,()=>{ctx.save();ctx.translate(0,12*(1-a));wc_panel(ctx,x,y,w,112,{kind:"card",seed:5});wc_T(ctx,name,x+30,y+48,{w:800,size:32,col:WC_DARK});
    wc_T(ctx,role,x+30,y+90,{w:600,size:28,col:WC_MUTED});ctx.restore();});}
// a tag that springs in at t0 and goes at t1 (or stays); o.wash colours it
function gu_tagAt(ctx,t,t0,t1,x,y,s,o){const a=t1==null?fin(t,t0,0.35):gv_io(t,t0,t1,0.35);if(a<=0.01)return;const k=0.9+0.1*spring(fin(t,t0,0.5));
  ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,a,()=>wc_tag(ctx,0,0,s,Object.assign({align:"center"},o||{})));ctx.restore();}
// a film this one builds on, by its title: a tag with a small frame of film drawn in pencil before it (a, 0 to 1); y is its middle
function gu_filmTag(ctx,x,y,title,a,o){if(a<=0.01)return;o=o||{};const size=30,w=Math.round(tw(ctx,title,size,700)+92),h=size+24,x0=o.align==="right"?x-w:o.align==="center"?x-w/2:x,
    k=0.9+0.1*spring(clamp(a,0,1));
  ctx.save();ctx.translate(x0+w/2,y);ctx.scale(k,k);ctx.translate(-x0-w/2,-y);withA(ctx,clamp(a*1.6,0,1),()=>{wc_panel(ctx,x0,y-h/2,w,h,{kind:"tag",seed:title.length+11});
    ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.85);ctx.lineWidth=2.4;ctx.lineJoin="round";const fx=x0+18,fy=y-13;ctx.strokeRect(fx,fy,34,26);
    for(let i=0;i<3;i++){ctx.fillStyle=rgba(WC_PENCIL,0.85);ctx.fillRect(fx+4+i*11,fy+3,5,4);ctx.fillRect(fx+4+i*11,fy+19,5,4);}ctx.restore();
    wc_T(ctx,title,x0+68,y+size*0.36,{w:700,size,col:WC_INK});});ctx.restore();return w;}
// the agent's sign: a small four-pointed star that turns a little, back and forth, as the series draws an agent: software, never a person
const GU_CYAN=[26,100,156];
function gu_star(ctx,x,y,s,t,a){if(a==null)a=1;if(a<=0.01)return;ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(t*0.8)*0.15);ctx.scale(s,s);withA(ctx,a,()=>{
  ctx.save();ctx.globalCompositeOperation="multiply";wc_glowAt(ctx,0,0,34,[170,214,246],0.55);ctx.restore();ctx.beginPath();
  for(let i=0;i<8;i++){const r=i%2?6:18,an=i*Math.PI/4-Math.PI/2;ctx.lineTo(Math.cos(an)*r,Math.sin(an)*r);}ctx.closePath();ctx.fillStyle=rgba(GU_CYAN,1);ctx.fill();});ctx.restore();}

/* ---------- a file, as a sheet of paper ---------- */
// A file from the example project on a sheet: its path at the top, a narrow gutter of line numbers, its lines in the typeface at 28 px
// (fewer lines rather than smaller ones). o.lines: each a string, or {s, n (its line number), fold (a pencil "…" for the lines left
// out), add / del (a line added or removed, washed green or red, with + or − in the gutter), lit (0 to 1, a wash in o.lit's colour,
// gold by default, as a governance line is named), col (its ink), p (0 to 1, typed in, with a caret)}. o.lang "yaml" colours keys.
// Drawn at (x,y), w wide, turned by o.rot about its centre; its height is gu_fileH(o). Returns where each line's middle is, and where
// its text starts, so a scene can point at one.
const GU_F={top:118,lh:46,gut:96};
const gu_fileH=o=>GU_F.top+(o.lines.length-1)*(o.lh||GU_F.lh)+40;
function gu_file(ctx,x,y,w,o){o=o||{};const lh=o.lh||GU_F.lh,h=o.h||gu_fileH(o),a=o.a==null?1:o.a,tx=x+GU_F.gut+(o.gutW||0),rows=[];if(a<=0.01)return{rows,tx,h};
  withA(ctx,a,()=>{ctx.save();if(o.rot){ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot);ctx.translate(-x-w/2,-y-h/2);}
    gv_sheet(ctx,x,y,w,h,{col:o.paper});
    wc_T(ctx,o.path,x+30,y+54,{w:500,size:28,f:"mono",col:WC_MUTED});
    ctx.strokeStyle=rgba(WC_PENCIL,0.35);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+24,y+76);ctx.lineTo(x+w-24,y+76);ctx.stroke();
    o.lines.forEach((L,i)=>{if(typeof L==="string")L={s:L};const by=y+GU_F.top+i*lh,cy=by-10;rows.push(cy);
      if(L.fold){wc_T(ctx,"…",tx,by,{w:500,size:28,f:"mono",col:WC_PENCIL});return;}
      if(L.add||L.del)gv_tint(ctx,x+14,cy-lh/2+3,w-28,lh-6,L.add?GV.green:GV.red,0.5*(L.dA==null?1:L.dA));
      const ind=gu_mw(ctx,L.s.match(/^\s*/)[0]);
      if(L.lit>0.01)gv_tint(ctx,tx+ind-12,cy-lh/2+4,Math.min(w-(tx+ind-x)-10,gu_mw(ctx,L.s.trim())+24),lh-8,L.litCol||o.litCol||GV.gold,0.9*L.lit);
      const g=L.add?"+":L.del?"−":L.n==null?"":String(L.n);
      if(g)wc_T(ctx,g,tx-26,by,{w:500,size:28,f:"mono",col:L.add?GV.greenInk:L.del?GV.redInk:WC_MUTED,align:"right"});
      const p=L.p==null?1:clamp(L.p,0,1),s=p<1?L.s.slice(0,Math.ceil(L.s.length*p)):L.s,lw=gu_code(ctx,s,tx,by,{lang:o.lang,col:L.col,a:L.del?0.7:1});
      if(L.del){ctx.strokeStyle=rgba(GV.redInk,0.7);ctx.lineWidth=2.5;const sx=tx+gu_mw(ctx,s.match(/^\s*/)[0]);ctx.beginPath();ctx.moveTo(sx,cy);ctx.lineTo(tx+lw,cy);ctx.stroke();}
      if(p<1&&p>0){ctx.fillStyle=rgba(WC_DARK,0.8);ctx.fillRect(tx+lw+3,by-26,3,32);}});
    ctx.restore();});
  return{rows,tx,h};}

/* ---------- a pull request's checks ---------- */
// The checks a pull request runs, as a strip of lights on a card: each a pill with its light and its name, grey while it waits or runs
// (the light turning), red when it fails, amber when it warns, green when it passes. Over them, "Checks" and how it stands; under them,
// what a check said, a line at a time in its colour (o.msg: [{s, col, p}], p 0 to 1 writing it). o.items: [{name, st}], st one of wait,
// run, fail, warn, pass; o.pop[i] (0 to 1) as an item changes, a soft halo. Drawn at (x,y), w wide, o.h high. Returns each pill's
// place and where the messages start.
const GU_CK={wait:[GV.grey,GV.greyInk],run:[GV.grey,GV.greyInk],fail:[GV.red,GV.redInk],warn:[GV.amber,GV.amberInk],pass:[GV.green,GV.greenInk]};
function gu_ckSummary(items){const n=k=>items.filter(i=>i.st===k).length,f=n("fail"),w=n("warn"),p=n("pass"),r=n("run")+n("wait");
  if(r)return[r+" running",GV.greyInk];if(f)return[f+" failed · "+(p+w)+" passed",GV.redInk];if(w)return["all passed · "+w+" with a warning",GV.amberInk];return["all checks passed",GV.greenInk];}
function gu_light(ctx,x,y,st,t,a){const [col,ink]=GU_CK[st]||GU_CK.wait;ctx.save();ctx.globalAlpha*=a==null?1:a;
  if(st==="run"){ctx.strokeStyle=rgba(ink,0.9);ctx.lineWidth=4;ctx.lineCap="round";const r0=t*5;ctx.beginPath();ctx.arc(x,y,11,r0,r0+TAU*0.7);ctx.stroke();}
  else if(st==="wait"){ctx.strokeStyle=rgba(ink,0.7);ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,10,0,TAU);ctx.stroke();}
  else{ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(x,y,12,0,TAU);ctx.fill();ctx.strokeStyle="rgba(255,255,255,0.95)";ctx.lineWidth=3.2;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();
    if(st==="pass"){ctx.moveTo(x-5.5,y+0.5);ctx.lineTo(x-1.5,y+4.5);ctx.lineTo(x+6,y-4.5);}else if(st==="fail"){ctx.moveTo(x-4.5,y-4.5);ctx.lineTo(x+4.5,y+4.5);ctx.moveTo(x+4.5,y-4.5);ctx.lineTo(x-4.5,y+4.5);}
    else{ctx.moveTo(x,y-6);ctx.lineTo(x,y+1.5);ctx.moveTo(x,y+5.5);ctx.lineTo(x,y+6);}ctx.stroke();}ctx.restore();}
function gu_checks(ctx,x,y,w,o){o=o||{};const h=o.h||250,items=o.items||[],t=o.t||0,pills=[];
  wc_panel(ctx,x,y,w,h,{kind:"card",seed:o.seed||61});wc_T(ctx,o.title||"Checks",x+32,y+52,{w:800,size:32,col:WC_DARK});
  const [sum,sink]=gu_ckSummary(items);if(items.length&&o.summary!==false)wc_T(ctx,sum,x+w-32,y+52,{w:700,size:28,col:sink,align:"right"});
  let px=x+32;const py=y+112;
  items.forEach((it,i)=>{const nw=gu_mw(ctx,it.name),pw=Math.round(nw+76),[col]=GU_CK[it.st]||GU_CK.wait,pop=(o.pop||[])[i]||0;
    if(pop>0.01)gv_halo(ctx,px-10,py-36,pw+20,72,col,0.8*pop);
    wc_panel(ctx,px,py-27,pw,54,{kind:"pill",wash:it.st==="wait"||it.st==="run"?null:col,washA:0.22,seed:30+i});
    gu_light(ctx,px+30,py,it.st,t);wc_T(ctx,it.name,px+54,py+10,{w:500,size:28,f:"mono",col:WC_DARK});pills.push({x:px,y:py,w:pw});px+=pw+16;});
  const my=py+(o.msgGap||78);(o.msg||[]).forEach((m,i)=>{const p=m.p==null?1:clamp(m.p,0,1);if(p<=0)return;const s=m.s.slice(0,Math.ceil(m.s.length*p));
    (m.md?gu_md:gu_code)(ctx,s,x+32+(m.dx||0),my+i*(o.msgLh||42),{col:m.col||WC_INK,size:28});});
  return{pills,my};}

/* ---------- a tool's page ---------- */
// A tool's page on a screen, drawn as a form: the screen's bar with the tool's name and what the page is ("GitHub · pull request"),
// a title, a pill for its state, a line under the title, and tabs, the open one underlined. o.state: [word, colour] or null. Returns
// where the page's body starts.
function gu_page(ctx,x,y,w,h,o){o=o||{};const bh=o.barH||52;let top=y+bh;
  gv_screen(ctx,x,y,w,h,o.bar,null,{barH:bh,titleSize:30});
  if(o.title){const ty=y+bh+72;wc_T(ctx,o.title,x+48,ty,{w:800,size:o.titleSize||44,col:WC_DARK});
    if(o.state){const [s,col]=o.state,sx=x+48+tw(ctx,o.title,o.titleSize||44,800)+28,sw=Math.round(tw(ctx,s,28,700)+44);
      withA(ctx,o.stateA==null?1:o.stateA,()=>{wc_panel(ctx,sx,ty-38,sw,48,{kind:"pill",wash:col,washA:0.45,seed:s.length+40});wc_T(ctx,s,sx+22,ty-4,{w:700,size:28,col:WC_DARK});});}
    if(o.sub)wc_T(ctx,o.sub,x+48,ty+44,{w:600,size:28,col:WC_MUTED});top=ty+(o.sub?64:24);}
  if(o.tabs){const ty=top+50;let tx=x+48;o.tabs.forEach((s,i)=>{const tw_=tw(ctx,s,28,700);wc_T(ctx,s,tx,ty,{w:700,size:28,col:i===o.tab?WC_DARK:WC_MUTED});
      if(i===o.tab){ctx.fillStyle=rgba(WC_DARK,0.85);ctx.fillRect(tx,ty+14,tw_,4);}tx+=tw_+56;});
    ctx.fillStyle=rgba(WC_PENCIL,0.3);ctx.fillRect(x+30,ty+18,w-60,2);top=ty+24;}
  return top;}
// a section of a page: a card with a heading, and what fn draws in it
function gu_box(ctx,x,y,w,h,head,o){o=o||{};wc_panel(ctx,x,y,w,h,{kind:"card",wash:o.wash,washA:o.washA,seed:o.seed||(x+y)|0});
  if(head)wc_T(ctx,head,x+30,y+48,{w:800,size:30,col:WC_DARK});}

/* ---------- the series' screens and places ---------- */
// a big screen on a desk, the wall behind it in a room's colour: for pages too full for the series' screen close-up (GV_SC)
const GU_BIG=[110,56,1700,812];
function gu_paintScreenBig(c,wall){c.fillStyle=rgba(WC_PAPER,1);c.fillRect(0,0,W,H);wc_wash(c,wc_rect(-40,-40,W+80,970),wall,{kind:"plaster",line:false,seed:73});
  wc_wash(c,wc_rect(-40,930,W+80,190),GV.oak,{kind:"plaster",line:false,seed:74});wc_wash(c,wc_rect(-40,924,W+80,14),wc_dim(GV.oak,0.25),{kind:"trim",line:false,flat:true});
  const [x,y,w,h]=GU_BIG;wc_part(c,[[x+w/2-50,y+h+12],[x+w/2+50,y+h+12],[x+w/2+62,936],[x+w/2-62,936]],GV.metal,1);gv_monitor(c,x,y,w,h,{stand:false});}
// the data team's desk from above, for the files laid on it: pale ash, its grain, a notebook and a mug at its edges
function gu_paintFilesDesk(c){const wood=[214,196,168];c.fillStyle=rgba(WC_PAPER,1);c.fillRect(0,0,W,H);wc_wash(c,wc_rect(-40,-40,W+80,H+80),wood,{kind:"plaster",line:false,seed:57});
  c.save();c.globalCompositeOperation="multiply";const R=wc_rng(7);for(let i=0;i<60;i++){const y=R()*H;c.strokeStyle=rgba(wc_dim(wood,0.18+R()*0.1),0.16+R()*0.12);c.lineWidth=1+R()*2;c.beginPath();c.moveTo(-20,y);
    for(let x=0;x<=W+40;x+=80)c.lineTo(x,y+5*Math.sin(x/280+i)+3*Math.sin(x/70+i*2));c.stroke();}c.restore();
  wc_wash(c,wc_ell(1830,120,80,80,40),[232,236,240],{kind:"thing",lw:1.6});wc_wash(c,wc_ell(1830,120,60,60,40),[96,70,60],{kind:"thing",line:false});
  wc_part(c,wc_rect(-60,820,300,330),[96,84,120],1,{seed:3});wc_flat(c,wc_rect(170,820,18,330),[236,226,200],1,"band");}

/* ---------- the data team's board: the series and its six films ---------- */
// The series' name on a card, and its six films, a card each, as Off the shelf first pinned them on the data team's board (close, GV_BC):
// each with its number, the tools' logos and its title. o.lit[i] (0 to 1) washes a card gold, as its film begins; o.lift[i] lifts it
// towards us.
const GU_SERIES="Governance you can use";
const GU_FILMS=[["Governed in dbt",["dbt"]],["Governed in Unity Catalog",["databricks"]],["Meaning on the platform",["databricks"]],
  ["Quality on the platform",["dbt","databricks"]],["Products in open formats",["databricks"]],["The marketplace",["databricks"]]];
const GU_TC={w:410,h:236,x:[505,960,1415],y:[440,712],rot:[-0.018,0.012,-0.008,0.016,-0.012,0.008]};
function gu_wrap(ctx,s,size,mw){if(tw(ctx,s,size,800)<=mw)return[s];const ws=s.split(" ");for(let i=ws.length-1;i>0;i--){const a=ws.slice(0,i).join(" ");
  if(tw(ctx,a,size,800)<=mw)return[a,ws.slice(i).join(" ")];}return[s];}
function gu_seriesHead(ctx,a){if(a<=0.01)return;const s=GU_SERIES,hw=Math.max(250,tw(ctx,s,52,700)/2+60);ctx.save();ctx.translate(960,192);ctx.rotate(0.01);
  withA(ctx,a,()=>{wc_panel(ctx,-hw,-60,hw*2,120,{kind:"card",seed:63});gv_pin(ctx,0,-46,GV.red,1.2);wc_hand(ctx,s,0,20,{size:52,w:700,align:"center",col:WC_INK});});ctx.restore();}
function gu_filmCard(ctx,k,o){o=o||{};const T_=GU_TC,[s,tools]=GU_FILMS[k],w=T_.w,h=T_.h,lift=easeCam(clamp(o.lift||0,0,1)),lit=clamp(o.lit||0,0,1),sc=1+0.08*lift;
  ctx.save();ctx.translate(T_.x[k%3],T_.y[Math.floor(k/3)]-16*lift);ctx.rotate(T_.rot[k]*(1-lift));ctx.scale(sc,sc);
  if(lift>0.01){ctx.save();ctx.filter="blur(10px)";ctx.fillStyle=rgba([70,60,50],0.22*lift);ctx.fillRect(-w/2+10,-h/2+18,w,h);ctx.restore();}
  if(lit>0.01)gv_halo(ctx,-w/2-30,-h/2-30,w+60,h+60,GV.gold,0.9*lit);
  wc_panel(ctx,-w/2,-h/2,w,h,{kind:"card",seed:110+k});if(lit>0.01)gv_tint(ctx,-w/2+8,-h/2+8,w-16,h-16,GV.gold,0.55*lit);gv_pin(ctx,0,-h/2+18,GV.red,1.1);
  wc_wash(ctx,wc_ell(-w/2+56,-h/2+72,28,28,24),wc_lit(GV.cyanInk,0.25),{kind:"thing",lw:1.2,seed:120+k});
  wc_T(ctx,String(k+1),-w/2+56,-h/2+83,{w:800,size:28,align:"center",col:[255,255,255]});
  let lx=-w/2+104;tools.forEach(id=>{lx+=logo(ctx,id,lx,-h/2+48,48)+18;});
  gu_wrap(ctx,s,36,w-64).forEach((l,i,a)=>wc_T(ctx,l,-w/2+32,-h/2+(a.length>1?160:178)+i*46,{w:800,size:36,col:WC_DARK}));ctx.restore();}
function gu_board(ctx,o){o=o||{};gu_seriesHead(ctx,1);for(let k=0;k<6;k++)gu_filmCard(ctx,k,{lit:(o.lit||[])[k],lift:(o.lift||[])[k]});}
// the same board seen across the data team's room, on its cork board (GV_DT.board): kept as a picture, too small to read, on purpose
function gu_boardSmall(ctx,lit){const [bx,by,bw,bh]=GV_DT.board,k=bw/GV_BC[2],c=wc_kept("guBoard|"+(lit||0),GV_BC[2],GV_BC[3],q=>{q.translate(-GV_BC[0],-GV_BC[1]);
    gu_board(q,{lit:[lit||0]});});
  ctx.drawImage(c,bx,by+(bh-GV_BC[3]*k)/2,bw,GV_BC[3]*k);}

/* ---------- the team's poster, and Yusuf's gold pins ---------- */
// where a decision enters the team's loop: the step, and what Yusuf writes there (Off the shelf first pinned them; "a class" is Who may
// see it's word)
const GU_PINS=[[0,["a term"]],[1,["a class"]],[3,["an owner","a contract"]],[4,["a rule"]],[7,["an approval"]],[9,["a version"]]];
// the loop going round on the poster (x,y,w,h), from the first step (u 0) back to the first (u 1): a firmer line along it, and each
// step darkening, with a little lift, as the line reaches it
function gu_loopRun(ctx,x,y,w,h,u){if(u<=0)return;const k=w/1260,cx=x+w/2,cy=y+h*450/810,a0=-Math.PI/2,gap=0.13;
  ctx.save();ctx.strokeStyle=rgba(wc_dim(GV_LOOPC,0.15),0.8);ctx.lineWidth=6*k;ctx.lineCap="round";
  for(let i=0;i<10;i++){const s=a0+i/10*TAU+gap,e=Math.min(a0+(i+1)/10*TAU-gap,a0+u*TAU);if(e<=s)break;ctx.beginPath();ctx.ellipse(cx,cy,330*k,270*k,0,s,e);ctx.stroke();}
  ctx.restore();
  for(let i=0;i<10;i++){const v=clamp((u-i/10)*12,0,1);if(v<=0)break;const [sx,sy]=gv_loopPos(i,x,y,w,h),r=30*k*(1+0.14*Math.sin(Math.PI*clamp(v*1.4,0,1)));
    ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba(wc_lit(GV_LOOPC,0.25),0.6*v);ctx.beginPath();ctx.arc(sx,sy,r,0,TAU);ctx.fill();ctx.restore();}}
// at step i of the poster: a gold pin pushed in at its edge (u), a gold ring drawn round it (ring), and Yusuf's words there, a line at a
// time (lab, 0 to 1 for each): under the step's name or, for the first step, inside the loop
function gu_goldPin(ctx,i,x,y,w,h,u,ring,lines,lab){const k=w/1260,[sx,sy]=gv_loopPos(i,x,y,w,h),c=Math.cos(-Math.PI/2+i/10*TAU);
  if(ring>0){ctx.save();ctx.strokeStyle=rgba(GV.gold,0.95);ctx.lineWidth=Math.max(2,5*k);ctx.lineCap="round";ctx.beginPath();
    ctx.arc(sx,sy,38*k,-Math.PI/2,-Math.PI/2+TAU*easeCam(clamp(ring,0,1)));ctx.stroke();ctx.restore();}
  if(u>0){const d=easeCam(clamp(u,0,1));withA(ctx,clamp(u*3,0,1),()=>gv_pin(ctx,sx+26*k,sy-30*k-(1-d)*40*k,GV.gold,lerp(2.4,1.6,d)*k));}
  if(!lab)return;const top=i===0,al=top?"center":c>0?"left":"right",nx=top?sx:sx+(c>0?1:-1)*(i===1||i===9?100:46)*k,ny=top?sy+80*k:sy+56*k;
  lines.forEach((s,j)=>{const p=lab[j]==null?1:lab[j];if(p>0)wc_hand(ctx,s,nx,ny+j*38*k,{size:32*k,w:700,align:al,col:GV.goldInk,p});});}
// every pin on the poster at once: o.pin[j], o.ring[j] and o.lab[j] (0 to 1) for the j-th of GU_PINS
function gu_pins(ctx,x,y,w,h,o){o=o||{};GU_PINS.forEach(([i,lines],j)=>{const v=k=>((o[k]||[])[j]);
  gu_goldPin(ctx,i,x,y,w,h,v("pin")==null?1:v("pin"),v("ring")==null?1:v("ring"),lines,lines.map(()=>v("lab")==null?1:v("lab")));});}
// where step i's pin sits on the poster, for a line drawn from it
function gu_pinAt(i,x,y,w,h){const k=w/1260,[sx,sy]=gv_loopPos(i,x,y,w,h);return[sx+26*k,sy-30*k];}
