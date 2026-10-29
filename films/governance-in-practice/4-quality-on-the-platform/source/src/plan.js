/* ===== Quality on the platform: the places and the pictures =====
   The places are painted once and kept (data governance's shared/src/finish.js): Planning's office, wide, and close at Clara's desk;
   Yusuf's board and his desk; a big screen on a desk, on the data team's, the platform team's, the learning team's or Planning's wall,
   and the data team's at night; Jun's screen at night; the data team's desk from above, for the files; the platform team's room, close
   at Sam's desk; the learning team's office, close at Tom's desk, with a clock on its wall; the campus; and the data team's board. The
   pictures are the film's own things, drawn with the series' pieces (shared/src/tools.js): a night's log; a shared inbox; the survey;
   the census envelope; a check's card, with its owner, its dimension and its level; the scorecard and an owner's issue, as the
   Markdown the two scripts write; a decision, as a card; a pull request's checks; the data's way, with its four places to check; an
   email as typed; the loading pipeline, and the rows it keeps out; the badges, their quality page and their profile; the alert. Every
   name starts with gq_ or GQ_. */

/* ---------- helpers ---------- */
// made once per chapter, the first time it draws: its cues are known by then
const gq_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// shots in a row in the same place share one camera, so a dissolve between them never lays the place over itself at another size or
// framing: if each holds still, one slow push over the whole run; if one moves, all follow the same keys. hold: no push on the last
// run, when the next chapter opens in the same place
function gq_run(shots,end,hold){const out=shots.map(s=>Object.assign({},s));
  for(let i=0;i<out.length;){let j=i;while(j+1<out.length&&out[j+1].place===out[i].place)j++;const R=out.slice(i,j+1),last=j===out.length-1;
    if(j>i||(hold&&last)){const t1=last?end:out[j+1].at,keys=[].concat(...R.map(s=>s.keys)).sort((a,b)=>a[0]-b[0]),k0=keys[0],
        still=keys.every(k=>k[1]===k0[1]&&k[2]===k0[2]&&k[3]===k0[3]),push=hold&&last?0:R[0].push==null?0.025:R[0].push;
      const cam=still?{keys:[k0,[k0[0]+0.01,k0[1],k0[2],k0[3]*(1+push)]],d:Math.max(1.4,t1-k0[0]),push:0}:{keys,d:Math.max(...R.map(s=>s.d||1.6)),push:0};
      R.forEach(s=>Object.assign(s,cam));}
    i=j+1;}
  return out;}
// a pencil arrow along a curve from a to b, bowed by bend (px, up when negative; o.bx bows it sideways), drawn on as p goes 0 to 1
function gq_arrow(ctx,a,b,bend,p,o){o=o||{};if(p<=0)return;const c=[(a[0]+b[0])/2+(o.bx||0),(a[1]+b[1])/2+bend],n=28,m=Math.max(2,Math.round(n*clamp(p,0,1))),pt=u=>{const v=1-u;
    return[v*v*a[0]+2*v*u*c[0]+u*u*b[0],v*v*a[1]+2*v*u*c[1]+u*u*b[1]];};
  ctx.save();ctx.strokeStyle=rgba(o.col||WC_PENCIL,o.a==null?0.9:o.a);ctx.lineWidth=o.lw||4;ctx.lineCap="round";ctx.lineJoin="round";if(o.dash)ctx.setLineDash(o.dash);ctx.beginPath();
  for(let i=0;i<=m;i++){const [x,y]=pt(i/n);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();ctx.setLineDash([]);
  if(p>=1&&o.head!==false){const [x1,y1]=pt(1),[x0,y0]=pt(0.93),an=Math.atan2(y1-y0,x1-x0);ctx.beginPath();ctx.moveTo(x1-16*Math.cos(an-0.5),y1-16*Math.sin(an-0.5));
    ctx.lineTo(x1,y1);ctx.lineTo(x1-16*Math.cos(an+0.5),y1-16*Math.sin(an+0.5));ctx.stroke();}ctx.restore();}
// where something carried along that curve is, as u goes 0 to 1
function gq_along(a,b,bend,u){const c=[(a[0]+b[0])/2,(a[1]+b[1])/2+bend],v=1-u;return[v*v*a[0]+2*v*u*c[0]+u*u*b[0],v*v*a[1]+2*v*u*c[1]+u*u*b[1]];}
// a red question mark, settling with a spring
function gq_redQ(ctx,x,y,s,p){if(p<=0)return;const k=spring(p);ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,clamp(p*2,0,1),()=>wc_T(ctx,"?",0,0,{w:800,size:s,align:"center",col:GV.redInk}));ctx.restore();}
// a speech bubble that springs in at t0 and goes at t1
function gq_say(ctx,t,t0,t1,x,y,lines,tx,ty,o){return gv_say(ctx,x,y,lines,tx,ty,Object.assign({a:gv_io(t,t0,t1,0.35),k:0.92+0.08*spring(fin(t,t0,0.5)),size:36},o||{}));}
// until now: the colours fade a little, warmer and paler (as Who may see it draws a memory)
function gq_memory(ctx,a){if(a<=0.01)return;ctx.save();ctx.globalCompositeOperation="saturation";ctx.fillStyle=rgba([128,128,128],0.6*a);ctx.fillRect(-W,-H,3*W,3*H);
  ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba([248,230,204],0.7*a);ctx.fillRect(-W,-H,3*W,3*H);ctx.globalCompositeOperation="source-over";ctx.fillStyle=rgba(WC_PAPER,0.22*a);ctx.fillRect(-W,-H,3*W,3*H);ctx.restore();}
// a paper veil: the picture steps back (a, 0 to 1), as something had to change
function gq_veil(ctx,a){if(a<=0.01)return;ctx.save();ctx.fillStyle=rgba(WC_PAPER,0.45*clamp(a,0,1));ctx.fillRect(-W,-H,3*W,3*H);ctx.restore();}
// a thing coming in: it rises a little and settles (a, 0 to 1); fn draws it
function gq_rise(ctx,a,fn,dy){if(a<=0.01)return;ctx.save();ctx.translate(0,(dy==null?14:dy)*(1-easeCam(clamp(a,0,1))));withA(ctx,clamp(a*1.6,0,1),fn);ctx.restore();}
// a table cell lit: a ring in its colour's ink, with a soft glow round it, that leaves the cell's words as they are (a, 0 to 1)
const GQ_INK=new Map([[GV.red,GV.redInk],[GV.amber,GV.amberInk],[GV.grey,GV.greyInk],[GV.green,GV.greenInk],[GV.gold,GV.goldInk]]);
function gq_ring(ctx,x,y,w,h,a,col){if(a<=0.01)return;const m=ctx.getTransform(),k=Math.hypot(m.a,m.b),ink=GQ_INK.get(col)||col;a=clamp(a,0,1);
  ctx.save();ctx.strokeStyle=rgba(ink,0.95*a);ctx.lineWidth=5;ctx.lineJoin="round";ctx.shadowColor=rgba(col,0.85*a);ctx.shadowBlur=20*k;
  ctx.strokeRect(x-2,y-2,w+4,h+4);ctx.restore();}
// a soft glow round something as it's named (a, 0 to 1), hugging its edges, pale enough that words on it stay clear; drawn before the thing
function gq_lit(ctx,x,y,w,h,a,col){if(a<=0.01)return;const m=ctx.getTransform(),k=Math.hypot(m.a,m.b),c=wc_lit(col||GV.gold,0.5);a=clamp(a,0,1);
  ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba(c,0.5*a);ctx.shadowColor=rgba(c,0.75*a);ctx.shadowBlur=28*k;ctx.fillRect(x,y,w,h);ctx.restore();}
// a thread from a to b, drawn on as p goes 0 to 1, with a knot at each end: gold from a result to its owner, unless o.col says
function gq_thread(ctx,a,b,p,o){o=o||{};if(p<=0)return;const col=o.col||GV.goldInk,al=o.a==null?1:o.a;
  gq_arrow(ctx,a,b,o.bend==null?-30:o.bend,p,{col,lw:o.lw||4.5,head:false,a:0.85*al,bx:o.bx,dash:o.dash});
  ctx.save();ctx.globalAlpha*=al;ctx.fillStyle=rgba(col,0.95);ctx.beginPath();ctx.arc(a[0],a[1],6,0,TAU);ctx.fill();if(p>=1){ctx.beginPath();ctx.arc(b[0],b[1],6,0,TAU);ctx.fill();}ctx.restore();}
// words wrapped to a width, as a page sets them: each line's text, and where it starts in s
function gq_lines(ctx,s,size,maxW,wt){const out=[],re=/\S+/g;let cur=null,m;
  while((m=re.exec(s))){if(!cur){cur={s:m[0],i:m.index};continue;}const t_=cur.s+" "+m[0];if(tw(ctx,t_,size,wt)>maxW){out.push(cur);cur={s:m[0],i:m.index};}else cur.s=t_;}
  if(cur)out.push(cur);return out;}
// a paragraph wrapped to w; o.p (0 to 1) shows it up to a share of its letters. Returns its lines' count
function gq_para(ctx,s,x,y,w,o){o=o||{};const size=o.size||30,wt=o.w||600,lh=o.lh||Math.round(size*1.4),L=gq_lines(ctx,s,size,w,wt),n=o.p==null?s.length:Math.ceil(s.length*clamp(o.p,0,1));
  L.forEach((l,j)=>{const vis=clamp(n-l.i,0,l.s.length);if(vis<=0)return;wc_T(ctx,l.s.slice(0,vis),x,y+j*lh,{w:wt,size,col:o.col||WC_INK,a:o.a,deco:o.deco});});return L.length;}
// a line of Markdown wrapped to w, as a page sets it: `code` in the typeface, kept whole; **bold** heavier; the rest in the page's
// words (o.w their weight). o.p (0 to 1) shows it up to a share of its words; o.measure only counts. Returns its lines' count
function gq_md(ctx,s,x,y,w,o){o=o||{};const size=o.size||28,lh=o.lh||40,toks=[];
  s.split(/(`[^`]*`|\*\*[^*]+\*\*)/).forEach(p=>{if(!p)return;const code=p[0]==="`",bold=p.startsWith("**"),t=code?p.slice(1,-1):bold?p.slice(2,-2):p;
    if(code)toks.push({t,f:"mono",wt:500,col:WC_DARK});else t.split(" ").map((u,j,a)=>j<a.length-1?u+" ":u).forEach(u=>{if(u)toks.push({t:u,wt:bold?800:(o.w||600),col:bold?WC_DARK:(o.col||WC_INK)});});});
  const n=o.p==null?toks.length:Math.ceil(toks.length*clamp(o.p,0,1));let cx=x,line=0;
  toks.forEach((k,i)=>{let t_=cx===x?k.t.replace(/^ +/,""):k.t;if(!t_)return;const core=tw(ctx,t_.replace(/ +$/,""),size,k.wt,k.f);
    if(cx>x&&cx+core>x+w){cx=x;line++;t_=t_.replace(/^ +/,"");}
    if(!o.measure&&i<n)wc_T(ctx,t_,cx,y+line*lh,{w:k.wt,size,f:k.f,col:o.ink||k.col,a:o.a,deco:o.deco});cx+=tw(ctx,t_,size,k.wt,k.f);});
  return line+1;}
// a pill: words on a rounded card, as wide as they are; x its left, y its middle; o.wash colours it. Returns its width
function gq_pill(ctx,x,y,s,o){o=o||{};const size=o.size||28,wt=o.w||700,w=Math.round(tw(ctx,s,size,wt,o.f)+44),h=size+22;
  wc_panel(ctx,x,y-h/2,w,h,{kind:"pill",wash:o.wash,washA:o.washA==null?0.35:o.washA,seed:o.seed||s.length+7});wc_T(ctx,s,x+22,y+size*0.36,{w:wt,size,f:o.f,col:o.col||WC_DARK});return w;}

/* ---------- the night ---------- */
// a crescent moon, gold: the night, as a small sign beside what runs every night
function gq_moon(ctx,x,y,r,a){if(a<=0.01)return;ctx.save();ctx.globalAlpha*=clamp(a,0,1);ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.clip();ctx.beginPath();ctx.rect(x-r-2,y-r-2,2*r+4,2*r+4);
  ctx.arc(x+r*0.5,y-r*0.3,r*0.86,0,TAU,true);ctx.fillStyle=rgba([222,168,48],1);ctx.fill("evenodd");ctx.restore();}
// the night, as One word, one home draws it: a deep blue over a place, the screens still lit (drawn after)
function gq_night(ctx,a){if(a<=0.01)return;ctx.save();ctx.globalCompositeOperation="multiply";ctx.globalAlpha=a;ctx.fillStyle="rgb(96,104,150)";ctx.fillRect(-W,-H,3*W,3*H);ctx.restore();}
// at night a screen is the room's one light: a bloom round it, and its spill on the desk below
function gq_nightGlow(c,r){const [sx,sy,sw,sh]=r;c.save();c.beginPath();c.rect(-W,-H,3*W,3*H);c.rect(sx,sy,sw,sh);c.clip("evenodd");c.globalCompositeOperation="screen";
  wc_glowAt(c,sx+sw/2,sy+sh/2,sw*0.72,[96,104,160],0.5);wc_glowAt(c,sx+sw/2,sy+sh+Math.min(300,sh),sw*0.55,[110,116,168],0.4);c.restore();}
function gq_paintNightScreen(c){gv_paintScreenDesk(c,GV_ROOM.data);gq_night(c,0.9);gq_nightGlow(c,GV_SC);}
function gq_paintBigNight(c){gu_paintScreenBig(c,GV_ROOM.data);gq_night(c,0.9);gq_nightGlow(c,GU_BIG);}

/* ---------- results, in their colours ---------- */
// a result's colours, as the series keeps them: green passed, amber a warning, red a failure, grey not run
const GQ_ST={pass:[GV.green,GV.greenInk],warn:[GV.amber,GV.amberInk],fail:[GV.red,GV.redInk],skip:[GV.grey,GV.greyInk]};
// a scorecard cell's state, from its words: "6/7 (1 fail)" failed, "7/7 (2 warn)" warned, "4/9 (5 not run)" didn't run
const gq_cellSt=s=>!s?null:/fail/.test(s)?"fail":/warn/.test(s)?"warn":/not run/.test(s)?"skip":"pass";
// a cell's words, a line each: how many passed, of how many; then what's in its brackets, wrapped at its commas to fit maxW
function gq_cellLines(ctx,s,maxW,size){if(!s)return[];const i=s.indexOf(" (");if(i<0)return[s];const out=[s.slice(0,i)],parts=s.slice(i+1).split(", ").map((p,j,a)=>j<a.length-1?p+",":p);
  let cur=parts[0];for(let j=1;j<parts.length;j++){const c=cur+" "+parts[j];if(tw(ctx,c,size,600)<=maxW)cur=c;else{out.push(cur);cur=parts[j];}}out.push(cur);return out;}

/* ---------- the scorecard, as a page shows it ---------- */
// the scorecard's table, as a page shows the Markdown scorecard.py writes: a header row; a row for each domain, its name in the
// typeface; each cell how many tests passed, of how many, washed in its state's colour, and under it, in brackets, what didn't pass or
// didn't run. cols: [[head, width]]; rows: [cells], the first the domain; {fold:1} for rows left out; {all:1, cells} for the total, in
// bold. o.wash (0 to 1) brings the washes in; o.lit: [[row, col, a, colour]] lights a cell with a ring (colour null: no ring, only kept
// forward); o.dim (0 to 1) steps back every cell but the lit ones; o.pins (0 to 1) pins a gold pin on each domain, one after another (its owner's). Returns each row's top and height, each column's left
const GQ_RH={head:54,fold:36,line:34,pad:12};
function gq_table(ctx,x,y,cols,rows,o){o=o||{};const R=GQ_RH,X=[],rowsAt=[];let cx=x;cols.forEach(([,w])=>{X.push(cx);cx+=w;});const tw_=cx-x,wash=o.wash==null?1:clamp(o.wash,0,1),
    lit=o.lit||[],litAt=(ri,ci)=>lit.reduce((m,[r,c,a])=>r===ri&&c===ci?Math.max(m,clamp(a,0,1)):m,0);
  cols.forEach(([hd],i)=>wc_T(ctx,hd,X[i]+16,y+36,{w:700,size:28,col:WC_DARK}));
  const rule=(ry,a)=>{ctx.save();ctx.fillStyle=rgba(WC_PENCIL,a);ctx.fillRect(x,ry,tw_,2);ctx.restore();};rule(y+R.head-4,0.5);
  let ry=y+R.head;
  rows.forEach((r,ri)=>{if(r.fold){wc_T(ctx,"…",X[0]+16,ry+26,{w:500,size:28,f:"mono",col:WC_PENCIL});rowsAt.push([ry,R.fold]);ry+=R.fold;rule(ry-1,0.18);return;}
    const cells=r.cells||r,ls=cells.map((s,ci)=>ci===0?[s]:gq_cellLines(ctx,s,cols[ci][1]-32,28)),n=Math.max(1,...ls.map(l=>l.length)),rh=R.pad*2+n*R.line;
    cells.forEach((s,ci)=>{const cw=cols[ci][1],l=litAt(ri,ci),st=ci>0?gq_cellSt(s):null,dm=o.dim?1-0.6*clamp(o.dim,0,1)*(1-l):1;
      if(st)gv_tint(ctx,X[ci]+4,ry+4,cw-8,rh-8,GQ_ST[st][0],(st==="pass"?0.32:0.5)*wash*dm);
      const lc=l>0.01?lit.find(([a,b])=>a===ri&&b===ci)[3]:null;if(lc!==null)gq_ring(ctx,X[ci]+4,ry+4,cw-8,rh-8,l,lc||(st?GQ_ST[st][0]:GV.gold));
      withA(ctx,dm,()=>{if(ci===0){if(r.all)wc_T(ctx,s,X[0]+16,ry+R.pad+26,{w:800,size:28,col:WC_DARK});else wc_T(ctx,s,X[0]+16,ry+R.pad+26,{w:500,size:28,f:"mono",col:WC_DARK});return;}
        ls[ci].forEach((t_,j)=>wc_T(ctx,t_,X[ci]+16,ry+R.pad+26+j*R.line,{w:j?600:(r.all?800:700),size:28,col:j&&st?GQ_ST[st][1]:WC_DARK}));});});
    const pn=clamp((o.pins||0)*rows.length-ri,0,1);if(pn>0.01&&!r.all)withA(ctx,clamp(pn*2,0,1),()=>gv_pin(ctx,X[1]-14,ry+R.pad+16-10*(1-easeCam(pn)),GV.gold,1.1));
    rowsAt.push([ry,rh]);ry+=rh;rule(ry-1,0.18);});
  return{X,rows:rowsAt,w:tw_,h:ry-y};}
// the scorecard's columns: the domain, the five dimensions the project's tests check, and all of them
const GQ_COLS=[["Domain",200],["completeness",230],["uniqueness",230],["validity",230],["consistency",230],["accuracy",200],["All",300]];
// the night of 19 October, as scorecard.py wrote it from the run (the rows the film names; the others, all passed, left out)
const GQ_RED=[{fold:1},["finance","1/1","2/4 (2 not run)","1/2 (1 not run)","0/1 (1 not run)","0/1 (1 not run)","4/9 (5 not run)"],{fold:1},
  ["learning","6/7 (1 fail)","5/5","7/7 (2 warn)","3/3","","21/22 (2 warn, 1 fail)"],["planning","","1/3 (2 not run)","0/1 (1 not run)","0/1 (1 not run)","0/1 (1 not run)","1/6 (5 not run)"],{fold:1},
  ["student","17/21 (4 not run)","10/16 (6 not run)","4/8 (4 not run)","10/18 (8 not run)","","41/63 (22 not run)"],{fold:1},
  {all:1,cells:["All","49/54 (1 fail, 4 not run)","30/42 (12 not run)","21/28 (2 warn, 7 not run)","23/34 (11 not run)","0/2 (2 not run)","123/160 (2 warn, 1 fail, 36 not run)"]}];
// last night, as docs/scorecard.md has it now
const GQ_LAST=[{fold:1},["finance","1/1","4/4","2/2","1/1","1/1","9/9"],{fold:1},["learning","7/7 (1 warn)","5/5","7/7","3/3","","22/22 (1 warn)"],
  ["planning","","3/3","1/1","1/1","1/1","6/6"],{fold:1},["student","21/21","16/16","8/8","18/18","","63/63"],{fold:1},
  {all:1,cells:["All","54/54 (1 warn)","42/42","28/28","34/34","2/2","160/160 (1 warn)"]}];
// the scorecard on a page: the table from the top of its body; o passes on to gq_table. Returns the table's places
function gq_scorePage(ctx,o){o=o||{};const [x,y,w,h]=GU_BIG;gu_page(ctx,x,y,w,h,{bar:o.bar||"GitHub · docs/scorecard.md · Data quality scorecard"});
  return gq_table(ctx,150,o.y||122,GQ_COLS,o.rows||GQ_RED,o);}
// the scorecard's Not passed table, last night: its one row, a warning (o.lit lights it)
const GQ_NPC=[["Status",116],["Domain",156],["Dimension",210],["Test",864],["Owner",214],["Rows",84]];
function gq_notPassed(ctx,y,o){o=o||{};wc_T(ctx,"Not passed",150,y,{w:800,size:32,col:WC_DARK});const ty=y+24,X=[];let cx=150;GQ_NPC.forEach(([,w])=>{X.push(cx);cx+=w;});
  GQ_NPC.forEach(([hd],i)=>wc_T(ctx,hd,X[i]+12,ty+36,{w:700,size:28,col:WC_DARK}));ctx.save();ctx.fillStyle=rgba(WC_PENCIL,0.5);ctx.fillRect(150,ty+50,cx-150,2);ctx.restore();
  const ry=ty+54,l=clamp(o.lit||0,0,1);if(l>0.01)gq_lit(ctx,154,ry+4,cx-158,42,l,GV.amber);gv_tint(ctx,X[0]+4,ry+4,GQ_NPC[0][1]-8,42,GV.amber,0.5);
  wc_T(ctx,"warn",X[0]+12,ry+36,{w:700,size:28,col:GV.amberInk});wc_T(ctx,"learning",X[1]+12,ry+36,{w:500,size:28,f:"mono",col:WC_DARK});
  wc_T(ctx,"completeness",X[2]+12,ry+36,{w:600,size:28,col:WC_INK});wc_T(ctx,GQ_TN,X[3]+12,ry+36,{w:500,size:28,f:"mono",col:WC_DARK});
  wc_T(ctx,"Learning team",X[4]+12,ry+36,{w:600,size:28,col:WC_INK});wc_T(ctx,"1",X[5]+12,ry+36,{w:600,size:28,col:WC_INK});}

/* ---------- an owner's issue, as a page shows it ---------- */
// an issue, as scripts/generate/issues.py writes it in Markdown, on a page (GU_BIG): its heading, who it's for, a section for each test
// or check, its lines as a list. items: {h1}, {p}, {h2}, {li}, {fold}; o.lit[i] (0 to 1) washes item i (o.litCol[i], gold by default);
// o.u[i] (0 to 1) brings item i in
function gq_issue(ctx,items,o){o=o||{};const [x,y,w,h]=GU_BIG,top=gu_page(ctx,x,y,w,h,{bar:o.bar||"target/issues/learning-team.md"}),lx=150,lw=1600;let by=top+64;
  items.forEach((it,i)=>{const v=o.u?clamp(o.u[i]==null?1:o.u[i],0,1):1,l=clamp((o.lit||[])[i]||0,0,1);
    if(it.fold){withA(ctx,v,()=>wc_T(ctx,"…",lx,by,{w:500,size:28,f:"mono",col:WC_PENCIL}));by+=46;return;}
    const s=it.h1||it.h2||it.p||it.li,size=it.h1?38:it.h2?30:28,lh=it.h1?54:it.h2?48:40,tx=lx+(it.li?36:0),ww=lw-(it.li?36:0),wt=it.h1?800:600;
    if(it.h2)by+=10;const n=gq_md(ctx,s,tx,by,ww,{size,lh,w:wt,measure:true});
    if(l>0.01)gv_tint(ctx,lx-16,by-size-8,lw+32,n*lh+10,(o.litCol||[])[i]||GV.gold,0.75*l);
    withA(ctx,v,()=>{if(it.li)wc_T(ctx,"•",lx+6,by,{w:800,size:28,col:WC_INK});gq_md(ctx,s,tx,by,ww,{size,lh,w:wt,col:it.h1?WC_DARK:WC_INK});});
    by+=n*lh+(it.h1?18:it.h2?6:4);});}
// the issue the learning team was sent on 19 October: three tests to answer, the failure first
const GQ_TN="not_null_stg_short_courses__enrolments_customer_bk";
const GQ_WHY="The customer who enrolled, by email. An enrolment with no email can't be matched to a learner. The learning team agreed: warn when any current enrolment has none, stop the build when more than five do (see DEC-SC-01 and LIM-SC-02).";
const GQ_ISSUE=[{h1:"Data quality: 3 tests to answer, by 20 October 2026"},{p:"**Owner:** Learning team · **To:** learning@uni.example · **From the run of** 19 October 2026"},
  {h2:"`"+GQ_TN+"`"},{li:"**Status:** fail, 6 rows"},{li:"**Domain:** `learning` · **Dimension:** completeness"},{li:"**Why the limit is there:** "+GQ_WHY},
  {li:"**Cause:** (the owner writes it in)"},{li:"**Due:** 20 October 2026"},{li:"**Closed when:** `"+GQ_TN+"` passes (…)"},{fold:1}];
// the learning team's issue from the night two enrolments were kept out (examples/platform-results/issue_two_kept_out.md)
const GQ_ISSUE2=[{h1:"Data quality: 1 test and 1 check to answer, by 4 November 2026"},{p:"**Owner:** Learning team · **To:** learning@uni.example · **From the run of** 28 October 2026"},
  {h2:"`has_an_id` on `short_courses.enrolments`"},{li:"**Status:** warn, 2 rows · **Checked by** the platform's pipeline expectation"},{li:"**Domain:** `learning` · **Dimension:** completeness"},
  {li:"**Why the limit is there:** A row with no system key can't be told apart from another, or versioned: it's kept out at loading, and counted, until it's fixed where it's kept."},
  {li:"**Cause:** (the owner writes it in)"},{li:"**Due:** 4 November 2026"},{li:"**Closed when:** the platform's check passes, on the next night's results"},{fold:1}];

/* ---------- Planning, close: Clara's desk ---------- */
// Planning's office, close, the camera at the height of someone sitting (as Fixed where it starts drew the learning team's): a pale green
// wall, a window, a chart pinned up; the desk (its front layer) with a screen, a keyboard and a mug
const GQ_PX={top:800,seat:[1480,1.7],screen:[380,236,800,450],win:[60,56,250,420],chart:[1250,60,440,286]};
function gq_paintPlan(ctx){const X=GQ_PX,wall=GV_ROOM.plan;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),wall,{kind:"plaster",line:false,seed:131});
  gv_lightGlow(ctx,880,-60,760);const [wx,wy,ww,wh]=X.win;gv_window(ctx,wx,wy,ww,wh,{wall,seed:33,tx:0.35});
  // the chart: enrolments by term, as bars (decoration)
  const [cx,cy,cw,ch]=X.chart;wc_wash(ctx,wc_rect(cx,cy,cw,ch),[251,250,245],{kind:"paper",lw:1.4,seed:132});for(const gx of [cx+24,cx+cw-24])gv_pin(ctx,gx,cy+20,GV.red,1);
  gv_lines(ctx,cx+34,cy+58,cw*0.42,1,0,1);for(let i=0;i<7;i++){const bh=50+120*hash(i,17);wc_flat(ctx,wc_rect(cx+40+i*56,cy+ch-28-bh,38,bh),[104,150,112],0.75,"bar");}
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.5);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx+30,cy+ch-26);ctx.lineTo(cx+cw-30,cy+ch-26);ctx.stroke();ctx.restore();}
function gq_paintPlanDesk(ctx){const X=GQ_PX,top=X.top;gv_deskFront(ctx,top,[200,184,156],[[60,330],[1560,330]]);
  const [sx,sy,sw,sh]=X.screen;gv_deskScreen(ctx,sx,sy,sw,sh,top);gv_keys(ctx,sx+90,top,sw-180,sx+sw+40);gv_mug(ctx,1780,top+10,[226,160,70]);}
// Clara at her desk, close: she sits behind it, turned to her screen; the screen's bar, and what o.draw puts on it
function gq_planDesk(x,tt,o){o=o||{};gv_behind(x,"clara",GQ_PX.seat[0],GQ_PX.top,GQ_PX.seat[1],Object.assign({pose:"listen",t:tt,flip:true},o.clara||{}));
  x.drawImage(gv_place("planDesk"),0,0,W,H);const [sx,sy,sw,sh]=GQ_PX.screen;gv_screen(x,sx,sy,sw,sh,o.bar||"Census 2026",null,{barH:46,titleSize:28});if(o.draw)o.draw(x,sx,sy,sw,sh);}
// the census on her screen: a row for each number, the first readable, the others bars, as a page reads from her chair; o.lit lights
// the first as she checks it; o.tick[i] ticks a row (0 to 1)
const GQ_CEN=[["awards conferred","4,867"],["learners enrolled",0.55],["credit points earned",0.7],["near-award learners",0.4]];
function gq_census(o){o=o||{};return(q,sx,sy,sw)=>{wc_T(q,"Census numbers",sx+36,sy+104,{w:800,size:36,col:WC_DARK});
  GQ_CEN.forEach(([l,v],i)=>{const ry=sy+182+i*66,lt=i===0?clamp(o.lit||0,0,1):0,tk=clamp((o.tick||[])[i]||0,0,1);if(lt>0.01)gv_tint(q,sx+20,ry-42,sw-40,60,GV.gold,0.8*lt);
    wc_T(q,l,sx+36,ry,{w:600,size:30,col:WC_INK});if(typeof v==="string")wc_T(q,v,sx+sw-110,ry,{w:800,size:32,col:WC_DARK,align:"right"});
    else{q.save();q.fillStyle=rgba(WC_MUTED,0.4);q.fillRect(sx+sw-110-220*v,ry-18,220*v,12);q.restore();}
    if(tk>0.01)wc_tick(q,sx+sw-58,ry-12,40,GV.greenInk,tk,6);});};}
// tags over her screen, each on a thread from a point on its top edge (o.u[i], 0 to 1): where the numbers go, or who answers for each
const GQ_GO=[["census numbers, to the government",330,70,520],["near-award lists, to the faculties",660,160,940]],
  GQ_WHO=[["Registrar's office",340,120,560],["Learning team",700,120,800],["Planning",1000,120,1040]];
function gq_tags(ctx,tags,o){o=o||{};const [,sy]=GQ_PX.screen;tags.forEach(([s,x,y,fx],i)=>{const v=clamp((o.u||[])[i]||0,0,1);if(v<=0.01)return;const w=tw(ctx,s,30,700)+40;
  gq_thread(ctx,[fx,sy-6],[x+w/2,y+26],clamp(v*1.6,0,1),{bend:10,col:o.col||WC_PENCIL});
  gq_rise(ctx,clamp(v*1.6-0.4,0,1),()=>wc_tag(ctx,x,y,s,{size:30,wash:o.wash,washA:o.wash?0.45:undefined,seed:640+i}));});}
// Clara and Yusuf in Planning's office, as Off the shelf drew them; the wall screen with two tables of numbers
function gq_planWide(x,tt,o){o=o||{};const [sx,sy,sw,sh]=GV_PL.screen;gv_screen(x,sx,sy,sw,sh,"Census 2026",null,{barH:46,titleSize:28});
  for(let r=0;r<=7;r++)for(let k=0;k<5;k++){x.save();x.fillStyle=rgba(r?[150,150,166]:[90,96,120],r?0.55:0.8);x.fillRect(sx+40+k*130,sy+76+r*38,100*(r?0.5+0.45*hash(r*5+k,9):0.8),r?7:9);x.restore();}
  person(x,"clara",440,905,0.8,Object.assign({pose:"listen",pose2:"shrug",mix:0,expr:"concerned",t:tt},o.clara||{}));
  person(x,"yusuf",1270,905,0.8,Object.assign({pose:"write",carry:heldNotebook,flip:true,t:tt},o.yusuf||{}));}

/* ---------- until now ---------- */
// a night's log, on Jun's screen at night (GV_SC): dbt's results, a line each as it comes (o.n, how many shown), the failed one red,
// lit (o.red); a dashed card with no name on it (o.who, 0 to 1), the data it was about nobody's
const GQ_LOG=["102 of 209 PASS not_null_tuition_rates_rate_per_credit_point",
  "103 of 209 PASS unique_combination_tuition_rates_award_type__rate_year","…","112 of 209 FAIL 6 "+GQ_TN,
  "113 of 209 PASS not_null_stg_short_courses__enrolments_enrolment_bk","114 of 209 PASS not_null_stg_short_courses__learners_customer_bk"];
function gq_log(ctx,o){o=o||{};const [x,y,w,h]=GV_SC;gv_screen(ctx,x,y,w,h,"Terminal · dbt build, every night",null,{barH:54,titleSize:30});
  const n=o.n==null?GQ_LOG.length:o.n;GQ_LOG.forEach((s,i)=>{const v=clamp(n-i,0,1);if(v<=0.01)return;const ly=y+124+i*56,fail=s.indexOf("FAIL")>0;
    if(fail&&o.red>0.01)gv_tint(ctx,x+24,ly-38,w-48,52,GV.red,0.45*clamp(o.red,0,1));
    wc_T(ctx,s,x+40,ly,{w:500,size:28,f:"mono",col:s==="…"?WC_PENCIL:fail?GV.redInk:WC_INK,a:v});});
  gq_whose(ctx,x+700,y+490,o.who,"whose data?");}
// a dashed card, no name on it, a red question mark beside it (a, 0 to 1)
function gq_whose(ctx,x,y,a,s){a=clamp(a||0,0,1);if(a<=0.01)return;gq_rise(ctx,a,()=>{wc_panel(ctx,x,y,460,150,{kind:"card",dashed:true,role:WC_PENCIL,seed:651});
  wc_hand(ctx,s,x+40,y+92,{size:40,w:700,col:WC_PENCIL});});gq_redQ(ctx,x+400,y+108,72,clamp(a*1.4-0.4,0,1));}
// a date, as a mail list writes it, k days after base [y, m, d]
const GQ_MON=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function gq_date(base,k){const d=new Date(Date.UTC(base[0],base[1],base[2]+k));return d.getUTCDate()+" "+GQ_MON[d.getUTCMonth()]+" "+d.getUTCFullYear();}
// a shared inbox on Jun's screen (GV_SC): the nightly warning, a row a night, newest at the top, none read; a year of nights going by as
// o.d goes 0 to 364; who reads it, fourteen people; its owner: nobody (o.none, 0 to 1)
function gq_inbox(ctx,o){o=o||{};const [x,y,w,h]=GV_SC,d=clamp(o.d||0,0,364),n=Math.floor(d),f=d-n,rh=66,top=y+196;
  gv_screen(ctx,x,y,w,h,"Mail · data-alerts",null,{barH:54,titleSize:30});wc_T(ctx,"data-alerts",x+40,y+120,{w:800,size:40,col:WC_DARK});
  wc_T(ctx,"a shared inbox · 14 people · "+(n+1)+" unread",x+40,y+164,{w:600,size:28,col:WC_MUTED});
  const ox=x+w-460,oy=y+110;wc_T(ctx,"Owner",ox,oy+10,{w:700,size:28,col:WC_MUTED});ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.6);ctx.lineWidth=2;ctx.setLineDash([8,8]);
  ctx.strokeRect(ox+110,oy-30,250,56);ctx.restore();gq_redQ(ctx,ox+410,oy+20,64,clamp(o.none||0,0,1));
  ctx.save();ctx.fillStyle=rgba(WC_PENCIL,0.3);ctx.fillRect(x+30,top-6,w-60,2);ctx.beginPath();ctx.rect(x+20,top,w-40,y+h-top-14);ctx.clip();
  for(let j=-1;j<9;j++){const k=n-j;if(k<0)continue;const ry=top+(j+f)*rh,a=j<0?f:1;if(ry>y+h)break;withA(ctx,a,()=>{
    ctx.fillStyle=rgba([60,110,190],0.9);ctx.beginPath();ctx.arc(x+52,ry+34,8,0,TAU);ctx.fill();
    const sb="Nightly build: 2 warnings";wc_T(ctx,sb,x+80,ry+44,{w:800,size:30,col:WC_DARK});
    wc_T(ctx,"emails as typed",x+104+tw(ctx,sb,30,800),ry+44,{w:600,size:28,col:WC_MUTED});
    wc_T(ctx,gq_date([2025,9,19],k),x+w-40,ry+44,{w:700,size:28,col:WC_INK,align:"right"});
    ctx.fillStyle=rgba(WC_PENCIL,0.18);ctx.fillRect(x+30,ry+rh-4,w-60,2);});}ctx.restore();}
// the survey, as people filled it in: a sheet each, fanned on Yusuf's desk, a box ringed in pencil on each; and what it came to, on a
// card (o.avg, 0 to 1)
const GQ_SV=[[70,240,-0.04,4],[530,200,0.025,4],[990,250,-0.02,3]];
function gq_surveySheet(ctx,x,y,rot,ring,a){if(a<=0.01)return;const w=440,h=560;ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(rot);ctx.translate(-w/2,-h/2);
  gq_rise(ctx,a,()=>{gv_sheet(ctx,0,0,w,h);wc_T(ctx,"Data quality survey",30,70,{w:800,size:32,col:WC_DARK});
    ["Rate your system's","data quality"].forEach((l,i)=>wc_T(ctx,l,30,134+i*40,{w:600,size:28,col:WC_INK}));
    for(let k=1;k<=5;k++){const bx=30+(k-1)*78,by=244;ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.6);ctx.lineWidth=2;ctx.strokeRect(bx,by,60,60);ctx.restore();
      wc_T(ctx,String(k),bx+30,by+42,{w:700,size:30,col:WC_INK,align:"center"});}
    wc_T(ctx,"poor",30,350,{w:600,size:28,col:WC_MUTED});wc_T(ctx,"very good",w-30,350,{w:600,size:28,col:WC_MUTED,align:"right"});
    wc_ring(ctx,30+(ring-1)*78+30,274,46,44,clamp(a*1.4-0.3,0,1),{col:WC_PENCIL,lw:4});gv_lines(ctx,30,420,w-60,3,32,0.8);});ctx.restore();}
function gq_survey(ctx,o){o=o||{};GQ_SV.forEach(([x,y,r,ring],i)=>gq_surveySheet(ctx,x,y,r,ring,clamp((o.u||[])[i]||0,0,1)));
  const v=clamp(o.avg||0,0,1);if(v<=0.01)return;const x=1480,y=300,w=380,h=420;gq_rise(ctx,v,()=>{wc_panel(ctx,x,y,w,h,{kind:"card",seed:661});gv_pin(ctx,x+w/2,y+16,GV.red,1.2);
    wc_T(ctx,"average",x+40,y+84,{w:700,size:30,col:WC_MUTED});wc_hand(ctx,"3.9",x+40,y+250,{size:150,w:700,col:WC_DARK,p:clamp(v*1.6-0.3,0,1)});
    wc_T(ctx,"out of 5",x+40,y+330,{w:600,size:32,col:WC_INK});});
  const x_=clamp(o.cross||0,0,1);if(x_>0.01)wc_cross(ctx,x+w/2,y+190,120,GV.redInk,x_);}
// the census envelope, addressed to the government: what it holds, a box for its number in pencil (o.n, 0 to 1), struck through (o.x)
// with a red question mark (o.q) as the number changes; a seal (o.seal), and a tick once it's right (o.ok)
function gq_envelope(ctx,cx,cy,o){o=o||{};const w=500,h=270,a=o.a==null?1:o.a;if(a<=0.01)return;const x=cx-w/2,y=cy-h/2;
  gq_rise(ctx,a,()=>{ctx.save();ctx.filter="blur(8px)";ctx.fillStyle="rgba(70,60,50,0.2)";ctx.fillRect(x+8,y+12,w,h);ctx.restore();wc_panel(ctx,x,y,w,h,{kind:"envelope",fill:[246,238,218],seed:77});
    ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.6);ctx.lineWidth=2.4;ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(x+8,y+8);ctx.lineTo(cx,y+92);ctx.lineTo(x+w-8,y+8);ctx.stroke();
    ctx.strokeStyle=rgba([196,96,74],0.8);ctx.lineWidth=2;ctx.strokeRect(x+w-98,y+22,66,74);for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(x+w-88,y+44+i*16);ctx.lineTo(x+w-42,y+44+i*16);ctx.stroke();}ctx.restore();
    wc_T(ctx,"Department of Education",x+40,y+138,{w:800,size:32,col:WC_DARK});wc_T(ctx,"census numbers · 2026",x+40,y+178,{w:600,size:28,col:WC_MUTED});
    ctx.save();ctx.strokeStyle=rgba(WC_MUTED,0.6);ctx.lineWidth=2;ctx.strokeRect(x+40,y+198,260,54);ctx.restore();wc_T(ctx,"awards",x+56,y+235,{w:600,size:28,col:WC_MUTED});
    const np=o.n==null?1:clamp(o.n,0,1);if(np>0.01)wc_hand(ctx,"4,867",x+168,y+238,{size:36,w:700,col:WC_DARK,p:np});
    const xs=clamp(o.x||0,0,1);if(xs>0.01){ctx.save();ctx.strokeStyle=rgba(GV.redInk,0.9);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x+160,y+226);ctx.lineTo(x+160+(130*easeCam(xs)),y+226);ctx.stroke();ctx.restore();}
    gq_redQ(ctx,x+360,y+240,64,clamp(o.q||0,0,1));if(o.ok>0.01)wc_tick(ctx,x+380,y+226,56,GV.greenInk,o.ok,7);
    const sl=clamp(o.seal||0,0,1);if(sl>0.01){const k=lerp(1.3,1,spring(sl));ctx.save();ctx.translate(cx,y+92);ctx.scale(k,k);withA(ctx,clamp(sl*2,0,1),()=>wc_wash(ctx,wc_ell(0,0,22,22,22),[186,52,44],{kind:"thing",lw:1.2,seed:78}));ctx.restore();}});}
// the failed line, printed on a strip of paper on Yusuf's desk
function gq_strip(ctx,x,y,a){if(a<=0.01)return;gq_rise(ctx,a,()=>{gv_sheet(ctx,x,y,1240,110,{rot:-0.01});wc_T(ctx,"112 of 209 FAIL 6 "+GQ_TN,x+40,y+66,{w:500,size:28,f:"mono",col:GV.redInk});});}

/* ---------- now: a check with an owner, a dimension and a level ---------- */
// a check, pinned to Yusuf's board, and what it names now: its owner (gold), the kind of quality it checks (cyan), and the level its
// owner chose; each on a thread from it (o.card, o.own, o.dim, o.lvl, 0 to 1)
function gq_checkCard(ctx,o){o=o||{};const u=k=>clamp(o[k]||0,0,1),cx=430,cy=140,cw=1060,ch=200;
  gq_rise(ctx,u("card"),()=>{wc_panel(ctx,cx,cy,cw,ch,{kind:"card",seed:601});gv_pin(ctx,cx+cw/2,cy+16,GV.red,1.2);wc_T(ctx,"a check",cx+40,cy+78,{w:700,size:30,col:WC_MUTED});
    wc_T(ctx,GQ_TN,cx+40,cy+144,{w:500,size:28,f:"mono",col:WC_DARK});});
  [["own","owner","Learning team",GV.gold,GV.goldInk,290],["dim","dimension","completeness",GU_CYAN,GU_CYAN,770],["lvl","level",null,GV.amber,GV.amberInk,1250]].forEach(([k,hd,s,col,ink,x],i)=>{
    const v=u(k);if(v<=0.01)return;const y=470,w=380,hh=i===2?220:170;gq_thread(ctx,[cx+cw/2+(i-1)*320,cy+ch-8],[x+w/2,y+12],clamp(v*1.6,0,1),{col:ink,bend:-10});
    gq_rise(ctx,clamp(v*1.6-0.4,0,1),()=>{wc_panel(ctx,x,y,w,hh,{kind:"card",wash:col,washA:0.28,seed:610+i});gv_pin(ctx,x+w/2,y+14,GV.red,1.1);
      wc_T(ctx,hd,x+32,y+72,{w:700,size:28,col:WC_MUTED});
      if(s)wc_T(ctx,s,x+32,y+128,{w:800,size:38,col:ink});
      else{wc_T(ctx,"warn on any",x+32,y+128,{w:800,size:34,col:GV.amberInk});wc_T(ctx,"stop above 5",x+32,y+180,{w:800,size:34,col:GV.redInk});}});});}

/* ---------- Sam's desk, on the platform ---------- */
// Sam at the platform team's desk, close (GV_PX), and what o.draw puts on his two screens
function gq_samDesk(x,tt,o){o=o||{};gv_behind(x,"sam",GV_PX.seat[0],GV_PX.top,GV_PX.seat[1],Object.assign({pose:"listen",t:tt,flip:true},o.sam||{}));
  x.drawImage(gv_place("platformDesk"),0,0,W,H);if(o.draw)o.draw(x);}
// monitoring, on his screens: the tables it watches, each with its light; and a table's rows by day, inside the band it has learned
// (o.u, 0 to 1, draws the line)
function gq_samWatch(ctx,t,o){o=o||{};const [[lx,ly,lw,lh],[rx,ry,rw,rh]]=GV_PX.screens;
  gv_screen(ctx,lx,ly,lw,lh,"Monitoring",q=>{["learners","badges","enrolments"].forEach((s,i)=>{const yy=ly+112+i*64;wc_T(q,s,lx+36,yy,{w:500,size:28,f:"mono",col:WC_DARK});
    gu_light(q,lx+lw-56,yy-10,"pass",t);});},{barH:46,titleSize:28});
  gv_screen(ctx,rx,ry,rw,rh,"Rows by day",q=>{const bx=rx+30,bw=rw-60,by=ry+90,bh=rh-120,u=clamp(o.u==null?1:o.u,0,1),f=i=>by+bh*(0.42+0.1*Math.sin(i*0.9)+0.05*hash(i,3));
    q.save();q.fillStyle=rgba(GV.green,0.16);q.beginPath();for(let i=0;i<=20;i++)q.lineTo(bx+bw*i/20,f(i)-34);for(let i=20;i>=0;i--)q.lineTo(bx+bw*i/20,f(i)+34);q.fill();
    q.strokeStyle=rgba(GV.greenInk,0.9);q.lineWidth=4;q.lineJoin="round";q.beginPath();for(let i=0;i<=Math.round(20*u);i++){const px=bx+bw*i/20,py=f(i)+8*Math.sin(i*2.3);i?q.lineTo(px,py):q.moveTo(px,py);}q.stroke();q.restore();},{barH:46,titleSize:28});}

/* ---------- each morning ---------- */
// the scorecard, a sheet on the data team's desk, its cells in their colours, read as a whole (o.u brings it in); an issue for each
// owner, an envelope sliding out from under it to each (o.env[i], 0 to 1)
const GQ_OWN=["Learning team","Registrar's office","Planning"];
function gq_morning(ctx,o){o=o||{};const u=clamp(o.u==null?1:o.u,0,1),x=170,y=110,w=1000,h=660;
  GQ_OWN.forEach((s,i)=>{const v=clamp((o.env||[])[i]||0,0,1);if(v<=0.01)return;const e=easeCam(v),ex=lerp(x+w-520,1300,e),ey=lerp(y+200+i*140,130+i*230,e),ew=480,eh=190;
    ctx.save();ctx.translate(ex,ey);ctx.rotate((i-1)*0.02*e);withA(ctx,clamp(v*3,0,1),()=>{wc_panel(ctx,0,0,ew,eh,{kind:"envelope",fill:[246,238,218],seed:671+i});
      ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.55);ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(8,8);ctx.lineTo(ew/2,70);ctx.lineTo(ew-8,8);ctx.stroke();ctx.restore();
      wc_T(ctx,s,36,124,{w:800,size:34,col:GV.goldInk});wc_T(ctx,"an issue to answer",36,166,{w:600,size:28,col:WC_MUTED});});ctx.restore();});
  gq_rise(ctx,u,()=>{gv_sheet(ctx,x,y,w,h,{rot:-0.012});wc_T(ctx,"Data quality scorecard",x+50,y+86,{w:800,size:40,col:WC_DARK});
    for(let r=0;r<11;r++)for(let c=0;c<6;c++){if(hash(r*7+c,4)<0.18&&c<5)continue;const amber=r===4&&c===0,cx=x+250+c*118,cy=y+150+r*44;
      ctx.save();ctx.fillStyle=rgba(amber?GV.amber:GV.green,amber?0.75:0.42);ctx.fillRect(cx,cy,100,32);ctx.restore();}
    for(let r=0;r<11;r++){ctx.save();ctx.fillStyle=rgba(WC_MUTED,0.4);ctx.fillRect(x+60,y+160+r*44,120*(0.6+0.4*hash(r,6)),12);ctx.restore();}});}

/* ---------- that Monday ---------- */
// on Yusuf's board: short-course enrolments with no email, the one from February (o.one) and the night's five (o.six), six over the five
// the learning team allows (o.lim); a thread to each thing built from them (o.down[i]), which stops, greyed and stamped (o.stop);
// Planning's keeps the day before's numbers (o.kept)
const GQ_DOWN=[["Planning's census","built from them"],["Finance's tuition","built from them"],["Student records","built from them"],["Wallet app","built from them"]];
function gq_monday(ctx,o){o=o||{};const x=250,y=200,w=560,h=470,a=clamp(o.a==null?1:o.a,0,1),six=clamp(o.six||0,0,1);
  gq_rise(ctx,a,()=>{wc_panel(ctx,x,y,w,h,{kind:"card",seed:681});gv_pin(ctx,x+w/2,y+16,GV.red,1.2);wc_T(ctx,"short-course enrolments",x+36,y+80,{w:800,size:34,col:WC_DARK});
    for(let i=0;i<6;i++){const ry=y+130+i*40,v=i?clamp(six*5-(i-1),0,1):clamp(o.one||0,0,1);ctx.save();ctx.fillStyle=rgba(WC_MUTED,0.4);ctx.fillRect(x+40,ry,260,12);ctx.restore();
      if(v>0.01)withA(ctx,v,()=>wc_T(ctx,"no email",x+330,ry+14,{w:700,size:28,col:GV.redInk}));}
    const lim=clamp(o.lim||0,0,1);if(lim>0.01)withA(ctx,lim,()=>{gv_tint(ctx,x+24,y+384,w-48,58,GV.gold,0.5);wc_T(ctx,"the learning team allows 5",x+40,y+424,{w:700,size:28,col:GV.goldInk});});});
  const k=clamp(o.kept||0,0,1);
  GQ_DOWN.forEach(([s,s2],i)=>{const v=clamp((o.down||[])[i]||0,0,1);if(v<=0.01)return;const cx=1000,cy=110+i*176,cw=580,ch=i?124:156,st=clamp(o.stop||0,0,1);
    gq_thread(ctx,[x+w-8,y+h/2],[cx+8,cy+ch/2],clamp(v*1.6,0,1),{col:WC_PENCIL,bend:-20});
    gq_rise(ctx,clamp(v*1.6-0.4,0,1),()=>{wc_panel(ctx,cx,cy,cw,ch,{kind:"card",seed:690+i});if(st>0.01)gv_tint(ctx,cx+6,cy+6,cw-12,ch-12,GV.grey,0.5*st);
      wc_T(ctx,s,cx+32,cy+54,{w:800,size:32,col:WC_DARK});wc_T(ctx,s2,cx+32,cy+96,{w:600,size:28,col:WC_MUTED});
      gv_stamp(ctx,cx+cw-100,cy+56,"stopped",clamp(st*3-i*0.5,0,1),{col:GV.greyInk,size:28,rot:-0.06});
      if(!i&&k>0.01){wc_tick(ctx,cx+50,cy+128,34,GV.greenInk,k,5);withA(ctx,clamp(k*1.6-0.3,0,1),()=>wc_T(ctx,"kept the day before's numbers",cx+82,cy+138,{w:700,size:28,col:GV.greenInk}));}});});}

/* ---------- the learning team's office, close: Tom's desk ---------- */
// as Fixed where it starts drew it (copied here, so the film keeps its own): apricot walls, a window onto the campus, a poster of this
// term's short courses, a shelf of brochures; a clock, whose hands are drawn each frame; the desk (its front layer) with a screen, a
// keyboard, a mug, a stack of leaflets
const GQ_TX={top:800,seat:[1450,1.7],screen:[430,286,660,388],win:[70,60,300,440],poster:[1180,64,520,300],clock:[810,150,70]};
function gq_paintTom(ctx){const X=GQ_TX,wall=GV_ROOM.learn;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),wall,{kind:"plaster",line:false,seed:101});
  gv_lightGlow(ctx,900,-60,760);const [wx,wy,ww,wh]=X.win;gv_window(ctx,wx,wy,ww,wh,{wall,seed:30,tx:0.55});
  const [px,py,pw,ph]=X.poster;wc_wash(ctx,wc_rect(px,py,pw,ph),[251,250,245],{kind:"paper",lw:1.4,seed:102});for(const gx of [px+26,px+pw-26])gv_pin(ctx,gx,py+22,GV.red,1);
  for(let i=0;i<6;i++){const tx=px+30+(i%3)*160,ty=py+110+Math.floor(i/3)*90;wc_flat(ctx,wc_rect(tx,ty,140,72),[[236,170,34],[96,160,176],[150,120,190],[200,110,90],[120,170,110],[110,140,200]][i],0.6,"tile");}
  gv_bookcase(ctx,1760,X.top+40,280,X.top-60,[300,520],{col:[176,140,104]});for(const sy of [300,520])for(let i=0;i<4;i++)wc_part(ctx,wc_rect(1790+i*38,sy-120,30,120),[[236,170,34],[96,160,176],[200,110,90],[150,120,190]][i],1,{lw:1});
  // the clock's face and its hour marks
  const [cx,cy,r]=X.clock;wc_wash(ctx,wc_ell(cx,cy,r+8,r+8,40),[120,92,70],{kind:"thing",lw:1.4,seed:141});wc_wash(ctx,wc_ell(cx,cy,r,r,40),[248,246,238],{kind:"thing",lw:1.2,seed:142});
  ctx.save();ctx.strokeStyle=rgba(WC_DARK,0.75);ctx.lineCap="round";for(let i=0;i<12;i++){const an=i/12*TAU,r0=r*(i%3===0?0.74:0.82);ctx.lineWidth=i%3===0?4:2.4;ctx.beginPath();
    ctx.moveTo(cx+Math.cos(an)*r0,cy+Math.sin(an)*r0);ctx.lineTo(cx+Math.cos(an)*r*0.92,cy+Math.sin(an)*r*0.92);ctx.stroke();}ctx.restore();}
function gq_paintTomDesk(ctx){const X=GQ_TX,top=X.top;gv_deskFront(ctx,top,[214,178,138],[[60,330],[1560,330]]);
  const [sx,sy,sw,sh]=X.screen;gv_deskScreen(ctx,sx,sy,sw,sh,top);gv_keys(ctx,sx+80,top,sw-160,sx+sw+40);
  for(let i=0;i<5;i++)wc_flat(ctx,wc_rect(1200+i*3,top-8-i*8,220,10),[[236,170,34],[250,250,246],[96,160,176],[250,250,246],[200,110,90]][i],1,"leaflet");gv_mug(ctx,250,top+10,[96,160,176]);}
// the clock's hands, at h o'clock (12 is noon)
function gq_clock(ctx,h){const [cx,cy,r]=GQ_TX.clock;ctx.save();ctx.strokeStyle=rgba(WC_DARK,0.9);ctx.lineCap="round";
  [[h/12*TAU,r*0.5,6],[(h%1)*TAU,r*0.76,4]].forEach(([an,l,lw])=>{ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.sin(an)*l,cy-Math.cos(an)*l);ctx.stroke();});
  ctx.fillStyle=rgba(WC_DARK,0.9);ctx.beginPath();ctx.arc(cx,cy,6,0,TAU);ctx.fill();ctx.restore();}
// the poster's heading, drawn every frame so it reads
function gq_tomPoster(ctx){const [px,py,pw]=GQ_TX.poster;wc_T(ctx,"Short courses",px+30,py+74,{w:800,size:40,col:WC_DARK});wc_T(ctx,"this term",px+pw-30,py+74,{w:600,size:30,align:"right",col:WC_MUTED});}
// Tom behind his desk, the desk and its screen, what the screen shows, the poster's heading, and the clock (o.clock, its hour)
function gq_tomDesk(x,tt,o,screen){o=o||{};gv_behind(x,"tom",GQ_TX.seat[0],GQ_TX.top,GQ_TX.seat[1],Object.assign({pose:"listen",t:tt,flip:true},o.tom||{}));
  x.drawImage(gv_place("tomDesk"),0,0,W,H);if(screen)screen(x);gq_tomPoster(x);gq_clock(x,o.clock==null?10.25:o.clock);}
// a name plate, as Fixed where it starts sets one: springs in at t0, goes at t1
function gq_plate(ctx,t,t0,t1,x,y,lines){const a=t1==null?fin(t,t0,0.4):gv_io(t,t0,t1,0.4);if(a<=0.01)return;
  const w=Math.round(Math.max(tw(ctx,lines[0],30,800),tw(ctx,lines[1],28,600))+48),h=96,k=0.92+0.08*spring(fin(t,t0,0.5));
  ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,a,()=>{wc_panel(ctx,-w/2,-h/2,w,h,{kind:"card",seed:w});wc_T(ctx,lines[0],0,-6,{w:800,size:30,align:"center",col:WC_DARK});
    wc_T(ctx,lines[1],0,32,{w:600,size:28,align:"center",col:WC_MUTED});});ctx.restore();}
// an email in the normal type, each space shown as a small grey bar where it was left (as Fixed where it starts draws one); returns
// where each letter starts
function gq_email(ctx,s,x,y,o){o=o||{};const sz=o.size||28,wt=o.w||600,a=o.a==null?1:o.a,sp=Math.max(tw(ctx," ",sz,wt),sz*0.5),xs=[];let cx=x,rx=x,run="";
  const flush=()=>{if(run&&a>0.01)wc_T(ctx,run,rx,y,{w:wt,size:sz,col:o.col||WC_INK,a,deco:o.deco});run="";};
  for(const ch of s){xs.push(cx);if(ch===" "){flush();if(a>0.01){ctx.fillStyle=rgba(WC_MUTED,0.65*a);ctx.fillRect(cx+2,y+4,sp-4,Math.max(5,sz*0.2));}cx+=sp;rx=cx;}
    else{if(!run)rx=cx;run+=ch;cx=rx+tw(ctx,run,sz,wt);}}
  flush();xs.push(cx);return xs;}
// what Tom's screen shows (GQ_TX.screen): the six enrolments with no email (the walk-in from February and the night's five, as Rules
// that run lists them), their emails added one by one (o.fix, 0 to 6); the
// sign-up form, an email typed into its box, trimmed and in lower case as it's typed (o.p), ticked (o.ok); the two enrolments the
// pipeline kept out, given their IDs (o.fix, 0 to 2); the notice of the alert (o.u); the learning team's list to follow up, its one
// enrolment with no email (o.u)
const GQ_SIX=[["E-7010","Excel for Everyone"],["E-7021","First Aid"],["E-7022","First Aid"],["E-7023","First Aid"],["E-7024","First Aid"],["E-7025","First Aid"]];
function gq_tomScreen(ctx,mode,o){o=o||{};const [x,y,w,h]=GQ_TX.screen;
  if(mode==="six")gv_screen(ctx,x,y,w,h,"Short-course platform · with no email",q=>{wc_T(q,"email",x+w-40,y+86,{w:700,size:28,col:WC_MUTED,align:"right"});
    GQ_SIX.forEach(([id,c],i)=>{const yy=y+136+i*42,f=clamp((o.fix||0)-i,0,1);wc_T(q,id,x+30,yy,{w:500,size:28,f:"mono",col:WC_DARK});wc_T(q,c,x+160,yy,{w:600,size:28,col:WC_INK});
      if(f<0.5)wc_T(q,"—",x+w-60,yy,{w:800,size:30,col:GV.redInk,align:"center"});else wc_tick(q,x+w-60,yy-10,30,GV.greenInk,clamp(f*2-1,0,1),5);});},{titleSize:28,barH:46});
  if(mode==="form")gv_screen(ctx,x,y,w,h,"Sign-up form",q=>{wc_T(q,"Sign up for a short course",x+40,y+92,{w:800,size:32,col:WC_DARK});
    [["Name","Aisha K."],["Email",""]].forEach(([l,v],i)=>{const yy=y+136+i*96;wc_T(q,l,x+40,yy,{w:600,size:28,col:WC_MUTED});q.fillStyle="#fff";q.fillRect(x+40,yy+10,w-80,48);
      q.strokeStyle=rgba(i===1?(o.ok>0.5?GV.greenInk:GV.goldInk):WC_PENCIL,i===1?0.9:0.4);q.lineWidth=i===1?3:2;q.strokeRect(x+40,yy+10,w-80,48);if(v)wc_T(q,v,x+56,yy+44,{w:600,size:28,col:WC_INK});});
    const em="aisha.k@mail.example",p=clamp(o.p||0,0,1);if(p>0.01)wc_T(q,em.slice(0,Math.ceil(em.length*p)),x+56,y+276,{w:600,size:28,col:WC_DARK});
    if(o.ok>0.01)wc_tick(q,x+w-80,y+260,32,GV.greenInk,o.ok,5);
    if(o.tag>0.01)withA(q,clamp(o.tag,0,1),()=>wc_tag(q,x+w/2,y+h-50,"trimmed, lower case, checked",{align:"center",size:28,wash:GV.green,washA:0.3}));},{titleSize:28,barH:46});
  if(mode==="two")gv_screen(ctx,x,y,w,h,"Short-course platform · enrolments",q=>{wc_T(q,"enrolment ID",x+30,y+92,{w:700,size:28,col:WC_MUTED});
    [0,1].forEach(i=>{const yy=y+160+i*80,f=clamp((o.fix||0)-i,0,1),id=["E-7029","E-7030"][i];if(f<1)gv_tint(q,x+20,yy-38,w-40,56,GV.amber,0.55*(1-f));
      if(f>0.01)wc_T(q,id.slice(0,Math.ceil(id.length*clamp(f*1.6,0,1))),x+30,yy,{w:500,size:28,f:"mono",col:WC_DARK});else wc_T(q,"(none)",x+30,yy,{w:600,size:28,col:GV.amberInk});
      wc_T(q,"First Aid",x+230,yy,{w:600,size:28,col:WC_INK});if(f>0.7)wc_tick(q,x+w-60,yy-10,30,GV.greenInk,clamp(f*3-2,0,1),5);});},{titleSize:28,barH:46});
  if(mode==="alert")gv_screen(ctx,x,y,w,h,"Notice · the learning platform's badges",q=>{const u=o.u==null?1:o.u;withA(q,u,()=>{wc_panel(q,x+36,y+80,w-72,h-120,{kind:"card",wash:GV.amber,washA:0.3,seed:181});
    wc_T(q,"to: Learning team, the owner",x+66,y+140,{w:700,size:28,col:WC_MUTED});wc_T(q,"Badges with no credit:",x+66,y+200,{w:800,size:34,col:WC_DARK});
    wc_T(q,"1 in 2 last night",x+66,y+250,{w:800,size:34,col:GV.amberInk});wc_T(q,"(usually 1 in 12)",x+66,y+298,{w:600,size:30,col:WC_INK});});},{titleSize:28,barH:46});
  if(mode==="follow")gv_screen(ctx,x,y,w,h,"Learning team · to follow up",q=>{const u=o.u==null?1:clamp(o.u,0,1);wc_T(q,"Enrolments to follow up",x+30,y+100,{w:800,size:32,col:WC_DARK});
    withA(q,u,()=>{gv_tint(q,x+20,y+148,w-40,64,GV.amber,0.5);wc_T(q,"1 enrolment, no email yet",x+40,y+192,{w:700,size:30,col:GV.amberInk});
      gq_pill(q,x+30,y+290,"owner: Learning team",{size:28,wash:GV.gold,washA:0.4,seed:883});});},{titleSize:28,barH:46});}

/* ---------- that night ---------- */
// on Jun's screen at night: the scorecard's total, every test passed, two with a warning; the moon in its corner (o.u, 0 to 1)
function gq_allNight(ctx,o){o=o||{};const [x,y,w,h]=GV_SC,u=clamp(o.u==null?1:o.u,0,1);gv_screen(ctx,x,y,w,h,"docs/scorecard.md",null,{barH:54,titleSize:30});
  wc_T(ctx,"Data quality scorecard",x+60,y+140,{w:800,size:40,col:WC_DARK});gq_moon(ctx,x+w-90,y+122,34,1);
  gq_rise(ctx,u,()=>{const bx=x+60,by=y+200,bw=w-120,bh=400;gv_tint(ctx,bx,by,bw,bh,GV.green,0.35);wc_T(ctx,"All",bx+40,by+80,{w:800,size:36,col:WC_DARK});
    wc_T(ctx,"160/160",bx+40,by+250,{w:800,size:140,col:GV.greenInk});wc_T(ctx,"(2 warn)",bx+40+tw(ctx,"160/160",140,800)+40,by+250,{w:700,size:48,col:GV.amberInk});
    wc_T(ctx,"tests passed, of all the tests that ran",bx+40,by+340,{w:600,size:30,col:WC_INK});});}

/* ---------- an owner, a dimension, a level ---------- */
// the test, as the project writes it (models/staging/short_courses/_short_courses__models.yml, lines 47 to 57): o.test lights it; its
// level lit as it's said (o.lvl: [where, warn, error], 0 to 1); o.u slides it in
const GQ_NN=[{n:47,s:"      - name: customer_bk"},{n:48,s:"        description: >"},{fold:1},{n:52,s:"        data_tests:"},{n:53,s:"          - not_null:"},
  {n:54,s:"              config:"},{n:55,s:"                where: is_current_version"},{n:56,s:"                warn_if: \">0\""},{n:57,s:"                error_if: \">5\""}];
function gq_nnSheet(ctx,o){o=o||{};const e=easeCam(clamp(o.u==null?1:o.u,0,1)),y=lerp(H+40,o.y||80,e),L=o.lvl||[];
  return gu_file(ctx,90,y,o.w||1200,{path:"models/staging/short_courses/_short_courses__models.yml",lang:"yaml",
    lines:GQ_NN.map((r,i)=>i===4?Object.assign({},r,{lit:clamp(o.test||0,0,1)}):i>=6?Object.assign({},r,{lit:clamp(L[i-6]||0,0,1),litCol:[GV.gold,GV.amber,GV.red][i-6]}):r)});}
// dbt_project.yml: who owns each test, by folder (lines 102 to 113); the rule's three lines lit (o.head), then the short-course folders (o.lit)
const GQ_DP=[{n:102,s:"# Who owns each test: the owner of the data it checks, by folder. A test whose data has another"},
  {n:103,s:"# owner names its own in its meta, which wins. Each kind of test names its quality dimension where"},
  {n:104,s:"# it's defined (tests/generic/). The governance check fails on a test with no owner or dimension."},{n:105,s:"data_tests:"},{n:106,s:"  credentials:"},
  {fold:1},{n:109,s:"    short_courses: {+meta: {owner: Learning team}}"},{n:110,s:"    staging:"},{fold:1},{n:113,s:"      short_courses: {+meta: {owner: Learning team}}"}];
function gq_dpSheet(ctx,o){o=o||{};const e=easeCam(clamp(o.u==null?1:o.u,0,1)),y=lerp(H+40,70,e),l=clamp(o.lit||0,0,1);
  return gu_file(ctx,70,y,1780,{path:"dbt_project.yml",lang:"yaml",lines:GQ_DP.map((r,i)=>i===6||i===9?Object.assign({},r,{lit:l}):i<3?Object.assign({},r,{lit:clamp(o.head||0,0,1)}):r)});}
// tests/generic/builtin.sql: dbt's not_null, with the dimension it checks (lines 7 to 13); line 11 lit cyan (o.lit)
const GQ_BI=[{n:7,s:"    The dimensions are DAMA's: completeness, uniqueness, validity, consistency, accuracy and",col:WC_MUTED},
  {n:8,s:"    timeliness. Each test's owner is set by folder, in dbt_project.yml.",col:WC_MUTED},{n:9,s:"-#}",col:WC_MUTED},{n:10,s:"{% test not_null(model, column_name) %}"},
  {n:11,s:"    {{ config(meta={'dimension': 'completeness'}) }}"},{n:12,s:"    {{ adapter.dispatch('test_not_null', 'dbt')(model, column_name) }}"},{n:13,s:"{% endtest %}"}];
function gq_biSheet(ctx,o){o=o||{};const e=easeCam(clamp(o.u==null?1:o.u,0,1)),y=lerp(H+40,90,e);
  return gu_file(ctx,70,y,1780,{path:"tests/generic/builtin.sql",lines:GQ_BI.map((r,i)=>i===4?Object.assign({},r,{lit:clamp(o.lit||0,0,1),litCol:GU_CYAN}):r)});}
// the decision, as the log keeps it (sources/short_courses/_short_courses__decisions.yml, lines 10 to 20), drawn as a card: who chose
// it and when (o.who), and why (o.why), lit as they're said
const GQ_DWHY="One or two walk-ins a term are expected, and the learning team follows them up. More means something broke.";
function gq_decision(ctx,o){o=o||{};const x=230,y=100,w=1460,h=660;gq_rise(ctx,clamp(o.a==null?1:o.a,0,1),()=>{gv_sheet(ctx,x,y,w,h,{rot:-0.006});
  wc_T(ctx,"sources/short_courses/_short_courses__decisions.yml",x+60,y+70,{w:500,size:28,f:"mono",col:WC_MUTED});
  wc_T(ctx,"DEC-SC-01",x+60,y+150,{w:500,size:36,f:"mono",col:WC_DARK});wc_T(ctx,"Warn on an enrolment with no email; stop above five",x+60,y+214,{w:800,size:36,col:WC_DARK});
  [["decided by","The learning team","who"],["on","9 October 2026","who"],["why",null,"why"]].forEach(([k,v,lk],i)=>{const ry=y+310+i*76,l=clamp(o[lk]||0,0,1),lh=i===2?2*44:44;
    if(l>0.01)gv_tint(ctx,x+40,ry-40,w-80,lh+12,GV.gold,0.75*l);wc_T(ctx,k,x+60,ry,{w:700,size:30,col:WC_MUTED});
    if(v)wc_T(ctx,v,x+300,ry,{w:800,size:32,col:WC_DARK});else gq_para(ctx,GQ_DWHY,x+300,ry,w-380,{size:30,lh:44,col:WC_DARK});});});}
// Jun's pull request: a test that every badge has a name. Its checks, and what governance said (o.items, o.msg); the change that fixes
// it, one line in dbt_project.yml, typed in (o.fix, 0 to 1)
const GQ_PR={ck:["build","governance","products","reviewers","impact"],m:["tests: sources/learning_platform/_learning_platform__sources.yml:",
  "source_not_null_learning_platform_badges_badge_name has no meta.owner","(how to: docs/how-to/give-a-test-an-owner.md)","1 problem(s): governance's rules aren't met"],
  g:["Governance's rules are met: every owner, glossary term, column class, test and","description is in place."]};
function gq_pr(ctx,t,o){o=o||{};const [x,y,w,h]=GU_BIG;gu_page(ctx,x,y,w,h,{bar:"GitHub · pull request",title:"A test that every badge has a name",titleSize:40,sub:"Jun Park wants to merge into main"});
  gu_checks(ctx,150,262,1620,{h:330,items:o.items||GQ_PR.ck.map(n=>({name:n,st:"wait"})),t,msg:o.msg,pop:o.pop,msgGap:74,summary:true});
  const fx=clamp(o.fix||0,0,1),fy=612;gu_box(ctx,150,fy,1620,240,"Files changed · dbt_project.yml",{seed:621});
  const rows=[[109,"    short_courses: {+meta: {owner: Learning team}}"],[null,"    learning_platform: {+meta: {owner: Learning team}}"],[110,"    staging:"]];
  rows.forEach(([n,s],i)=>{const ry=fy+104+i*46;if(n==null){if(fx<=0.01)return;gv_tint(ctx,164,ry-32,1592,42,GV.green,0.5);wc_T(ctx,"+",230,ry,{w:500,size:28,f:"mono",col:GV.greenInk,align:"right"});
      gu_code(ctx,s.slice(0,Math.ceil(s.length*fx)),250,ry,{lang:"yaml"});return;}
    const ry2=n===110&&fx<=0.01?ry-46:ry;wc_T(ctx,String(n),230,ry2,{w:500,size:28,f:"mono",col:WC_MUTED,align:"right"});gu_code(ctx,s,250,ry2,{lang:"yaml"});});}

/* ---------- written from the run ---------- */
// the terminal on the data team's big screen, after the night's build: a card for dbt's results, a pencil arrow from it to each script
// (o.res; o.ar draws the arrows, after it by default); the two scripts, typed in (o.c[0], o.c[1]), and what each wrote (o.out[0], o.out[1])
const GQ_RUN=[["$ python scripts/generate/scorecard.py","wrote docs/scorecard.md"],["$ python scripts/generate/issues.py","1 issue(s) in target/issues/, from the run of 2026-10-19: Learning team"]];
function gq_term(ctx,o){o=o||{};const [x,y,w,h]=GU_BIG;gu_page(ctx,x,y,w,h,{bar:"Terminal · after the night's build"});const res=clamp(o.res||0,0,1);
  gq_rise(ctx,res,()=>{wc_panel(ctx,1000,170,720,140,{kind:"card",wash:GU_CYAN,washA:0.15,seed:631});wc_T(ctx,"dbt's results",1040,226,{w:800,size:34,col:WC_DARK});
    wc_T(ctx,"target/run_results.json",1040,276,{w:500,size:28,f:"mono",col:WC_MUTED});});
  GQ_RUN.forEach(([c,out],i)=>{const cy=440+i*220,cv=clamp((o.c||[])[i]||0,0,1),ov=clamp((o.out||[])[i]||0,0,1);
    gq_arrow(ctx,[1200,318],[150+gu_mw(ctx,c)+44,cy-12],-10+i*30,clamp((o.ar==null?res:o.ar)*1.6-0.2-0.3*i,0,1),{col:GU_CYAN,lw:4,bx:-60});
    if(cv>0.01)wc_T(ctx,c.slice(0,Math.ceil(c.length*cv)),150,cy,{w:500,size:28,f:"mono",col:WC_DARK});if(ov>0.01)withA(ctx,ov,()=>wc_T(ctx,out,150,cy+56,{w:500,size:28,f:"mono",col:WC_INK}));});}

/* ---------- the data's way ---------- */
// on a sheet pinned to Yusuf's board: the data's way, from where it's typed to the reports read; a pin at each of the four places to
// check (o.pin[i], in the order the film names them: the data team's models, then where it's typed, loaded and kept), what each
// catches (o.cat[i]), a gold thread from each to the data's owner (o.own); the three words, each lighting its places (o.w[k]); o.all
// lights the four pins together; o.tag brings in the film the places come from
const GQ_WAY=[["the sign-up","form"],["the loading","pipeline"],["the platform's","tables"],["the data","team's models"],["reports",""]],GQ_WX=[390,700,1010,1320,1590],GQ_WY=410;
const GQ_CATCH=[["an email","typed wrong"],["a row","with no ID"],["a table not","as usual"],["more than five","with no email"]],GQ_PIN=[3,0,1,2];
const GQ_WORD=[["Prevent",[0]],["Check",[1,3]],["Watch",[2]]];
function gq_way(ctx,t,o){o=o||{};const S={x:240,y:84,w:1440,h:760};gv_sheet(ctx,S.x,S.y,S.w,S.h,{rot:0.004});gv_pin(ctx,S.x+S.w/2,S.y+22,GV.red,1.3);
  wc_T(ctx,"The data's way",S.x+60,S.y+96,{w:800,size:40,col:WC_DARK});gu_filmTag(ctx,S.x+60,S.y+150,"Fixed where it starts",clamp(o.tag||0,0,1));
  const own=clamp(o.own||0,0,1),ox=1250,oy=120,ow=380,oh=120,lit=k=>GQ_WORD.reduce((m,[,st],j)=>st.includes(k)?Math.max(m,clamp((o.w||[])[j]||0,0,1)):m,0);
  // the way: a pencil line with an arrow, and a station at each place
  gq_arrow(ctx,[GQ_WX[0]-90,GQ_WY],[GQ_WX[4]+70,GQ_WY],0,1,{col:WC_PENCIL,lw:4,a:0.7});
  GQ_WAY.forEach(([l1,l2],k)=>{const sx=GQ_WX[k],li=lit(k),al=clamp(o.all||0,0,1);if(li>0.01)gq_lit(ctx,sx-110,GQ_WY-110,220,240,li,GV.gold);
    wc_wash(ctx,wc_ell(sx,GQ_WY,22,22,24),k===4?[236,232,222]:wc_lit(GV_LOOPC,0.4),{kind:"thing",lw:1.4,seed:700+k});
    wc_T(ctx,l1,sx,GQ_WY+70,{w:800,size:30,col:WC_DARK,align:"center"});if(l2)wc_T(ctx,l2,sx,GQ_WY+108,{w:600,size:30,col:WC_INK,align:"center"});
    const pi=GQ_PIN.indexOf(k);if(pi<0)return;const v=clamp((o.pin||[])[pi]||0,0,1);if(v<=0.01)return;const d=easeCam(v);
    if(al>0.01||li>0.01)gv_halo(ctx,sx-60,GQ_WY-110,120,120,GV.gold,0.9*Math.max(al,li));
    withA(ctx,clamp(v*3,0,1),()=>gv_pin(ctx,sx,GQ_WY-56-(1-d)*60,GV.red,lerp(2.6,1.8,d)));
    gq_thread(ctx,[sx,GQ_WY-56],[ox+ow/2+(k-1.5)*40,oy+oh],own*clamp(v*2,0,1),{bend:-40-20*k});
    const c=clamp((o.cat||[])[pi]||0,0,1);if(c>0.01)gq_rise(ctx,c,()=>{wc_panel(ctx,sx-135,GQ_WY+150,270,104,{kind:"tag",seed:710+k});
      GQ_CATCH[k].forEach((s,j)=>wc_T(ctx,s,sx,GQ_WY+192+j*40,{w:j?600:700,size:28,col:WC_DARK,align:"center"}));});});
  if(own>0.01)gq_rise(ctx,own,()=>{wc_panel(ctx,ox,oy,ow,oh,{kind:"card",wash:GV.gold,washA:0.35,seed:720});wc_T(ctx,"the data's owner",ox+30,oy+48,{w:700,size:28,col:WC_MUTED});
    wc_T(ctx,"Learning team",ox+30,oy+96,{w:800,size:36,col:GV.goldInk});});
  GQ_WORD.forEach(([s,st],j)=>{const v=clamp((o.w||[])[j]||0,0,1);if(v<=0.01)return;st.forEach(k=>wc_hand(ctx,s,GQ_WX[k],GQ_WY+340,{size:46,w:700,align:"center",col:GV.goldInk,p:v}));});}

/* ---------- where it's typed ---------- */
// the clean-up, as staging writes it (models/staging/short_courses/stg_short_courses__learners.sql, lines 11 and 12), lit (o.lit),
// struck through as it goes (o.go)
const GQ_CL=[{n:11,s:"    select"},{n:12,s:"        nullif(lower(trim(customer_email)), '') as email,"}];
function gq_clSheet(ctx,x,y,w,o){o=o||{};const go=clamp(o.go||0,0,1),f=gu_file(ctx,x,y,w,{path:"models/staging/short_courses/stg_short_courses__learners.sql",
    lines:GQ_CL.map((r,i)=>i===1?Object.assign({},r,{lit:clamp(o.lit||0,0,1)*(1-go)}):r)});
  if(go>0.01&&f.rows.length>1){const s=GQ_CL[1].s,x0=f.tx+gu_mw(ctx,s.match(/^\s*/)[0]),x1=f.tx+gu_mw(ctx,s);ctx.save();ctx.strokeStyle=rgba(GV.redInk,0.85);ctx.lineWidth=4;ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(x0,f.rows[1]);ctx.lineTo(lerp(x0,x1,easeCam(go)),f.rows[1]);ctx.stroke();ctx.restore();}return f;}
// an email as typed, on a card, and as staging writes it every night (o.u, 0 to 1, brings the clean one in; o.night, the pencil note)
function gq_emailCard(ctx,o){o=o||{};const x=250,y=420,w=1420,h=360;wc_panel(ctx,x,y,w,h,{kind:"card",seed:731});gv_pin(ctx,x+w/2,y+16,GV.red,1.2);
  wc_T(ctx,"as typed",x+60,y+96,{w:700,size:30,col:WC_MUTED});gq_email(ctx," Aisha.K@Mail.example ",x+60,y+168,{size:48,w:700,col:WC_DARK});
  const u=clamp(o.u||0,0,1);gq_arrow(ctx,[x+300,y+200],[x+300,y+250],0,u,{col:GU_CYAN,lw:4});
  if(u>0.01)withA(ctx,u,()=>{wc_T(ctx,"as staging writes it",x+360,y+236,{w:700,size:30,col:WC_MUTED});wc_T(ctx,"aisha.k@mail.example",x+60,y+310,{w:700,size:48,col:GU_CYAN});});
  if(o.night>0.01)wc_hand(ctx,"every night, for a year",x+w-60,y+310,{size:34,w:700,col:WC_PENCIL,align:"right",p:clamp(o.night,0,1)});}
// the test on the source (sources/short_courses/_short_courses__sources.yml, lines 35 to 40): the test lit (o.test), and since when it
// checks (o.since, or struck through as it goes, o.gone)
const GQ_EC=[{n:35,s:"          - name: customer_email"},{fold:1},{n:37,s:"            data_tests:"},{n:38,s:"              - entered_clean:"},
  {n:39,s:"                  name: short_courses_learners_email_entered_clean"},{n:40,s:"                  arguments: {since: \"2026-11-02\", case: lower, pattern: \"%_@_%._%\"}"}];
function gq_ecSheet(ctx,x,y,w,o){o=o||{};const f=gu_file(ctx,x,y,w,{path:"sources/short_courses/_short_courses__sources.yml",lang:"yaml",
    lines:GQ_EC.map((r,i)=>i===3?Object.assign({},r,{lit:clamp(o.test||0,0,1)}):r)});if(f.rows.length<6)return f;
  const s=GQ_EC[5].s,a=s.indexOf("since"),b=s.indexOf(", case"),x0=f.tx+gu_mw(ctx,s.slice(0,a)),x1=f.tx+gu_mw(ctx,s.slice(0,b+2)),sn=clamp(o.since||0,0,1),gn=clamp(o.gone||0,0,1);
  if(sn>0.01)gv_tint(ctx,x0-8,f.rows[5]-20,x1-x0+4,40,GV.gold,0.85*sn);
  if(gn>0.01){ctx.save();ctx.strokeStyle=rgba(GV.redInk,0.85);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x0,f.rows[5]);ctx.lineTo(lerp(x0,x1-12,easeCam(gn)),f.rows[5]);ctx.stroke();ctx.restore();}
  return f;}
// what the source's test means: it stops the build if an email recorded since isn't clean (o.stop); it should never fail: a tick, and if
// it ever does, the form has broken (o.never)
function gq_never(ctx,f,o){o=o||{};const st=clamp(o.stop||0,0,1);if(st>0.01)gq_rise(ctx,st,()=>gq_pill(ctx,180,520,"error: stops the build if one isn't clean",{size:30,wash:GV.red,washA:0.3,seed:741}));
  const nv=clamp(o.never||0,0,1);if(nv<=0.01||f.rows.length<4)return;wc_tick(ctx,f.tx+gu_mw(ctx,GQ_EC[3].s)+50,f.rows[3]-6,46,GV.greenInk,nv,6);
  wc_hand(ctx,"should never fail",f.tx+gu_mw(ctx,GQ_EC[3].s)+100,f.rows[3]+6,{size:34,w:700,col:GV.greenInk,p:nv});
  const bk=clamp(o.broke||0,0,1);if(bk<=0.01)return;const x=1180,y=600,w=560,h=230;gq_rise(ctx,bk,()=>{wc_panel(ctx,x,y,w,h,{kind:"card",dashed:true,role:WC_PENCIL,seed:742});
    wc_hand(ctx,"if it fails:",x+36,y+64,{size:32,w:700,col:WC_PENCIL});wc_hand(ctx,"the form has broken",x+36,y+108,{size:32,w:700,col:GV.redInk});
    ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.6);ctx.lineWidth=2;ctx.strokeRect(x+36,y+140,w-72,52);ctx.strokeStyle=rgba(GV.redInk,0.9);ctx.lineWidth=4;ctx.beginPath();
    [[0,0],[40,26],[70,4],[110,40],[150,14]].forEach(([dx,dy],i)=>{const px=x+200+dx,py=y+146+dy;i?ctx.lineTo(px,py):ctx.moveTo(px,py);});ctx.stroke();ctx.restore();});}
// the requirement that's still open (requirements/sources/short_courses/_short_courses__requirements.yml, lines 8 to 21), drawn as a
// card: its title, its owner and its state
function gq_req(ctx,x,y,a){if(a<=0.01)return;gq_rise(ctx,a,()=>{const w=620,h=300;wc_panel(ctx,x,y,w,h,{kind:"card",seed:751});gv_pin(ctx,x+w/2,y+16,GV.red,1.1);
  wc_T(ctx,"REQ-SC-01",x+36,y+70,{w:500,size:30,f:"mono",col:WC_DARK});["Emails typed before the fix,","corrected at the source"].forEach((l,i)=>wc_T(ctx,l,x+36,y+124+i*42,{w:800,size:30,col:WC_DARK}));
  const pw=gq_pill(ctx,x+36,y+240,"owner: Learning team",{size:28,wash:GV.gold,washA:0.4,seed:752});gq_pill(ctx,x+52+pw,y+240,"in progress",{size:28,wash:GV.amber,washA:0.4,seed:753});});}

/* ---------- where it's loaded ---------- */
// the platform team's loading pipeline, as Lakeflow draws one, drawn as a form: each system's files, and the seven tables it loads them
// into (o.u, 0 to 1, draws the arrows), each with its expectation (o.ex, 0 to 1)
const GQ_SYS=[["student_system/",["learners","awards","results"]],["learning_platform/",["users","badges"]],["short_courses/",["learners","enrolments"]]];
function gq_pipe(ctx,t,o){o=o||{};const [x,y,w,h]=GU_BIG;gu_page(ctx,x,y,w,h,{bar:"Databricks · Lakeflow pipeline",title:"The nightly load",titleSize:40,sub:"a pipeline · each night, before the build"});
  const u=clamp(o.u==null?1:o.u,0,1),ex=clamp(o.ex||0,0,1);let k=0;
  GQ_SYS.forEach(([sys,tabs],si)=>{const c0=k;tabs.forEach(()=>k++);const ty=i=>288+i*80,fy=(ty(c0)+ty(k-1))/2;
    wc_panel(ctx,160,fy-34,380,68,{kind:"card",seed:760+si});wc_T(ctx,sys,190,fy+10,{w:500,size:28,f:"mono",col:WC_DARK});
    tabs.forEach((tb,j)=>{const i=c0+j,yy=ty(i),s=sys.slice(0,-1)+"."+tb,v=clamp(u*7-i,0,1);gq_arrow(ctx,[548,fy],[712,yy],0,v,{col:WC_PENCIL,lw:3.5});
      if(v<=0.01)return;withA(ctx,clamp(v*2,0,1),()=>{wc_panel(ctx,720,yy-30,520,60,{kind:"card",wash:GU_CYAN,washA:0.12,seed:770+i});wc_T(ctx,s,750,yy+10,{w:500,size:28,f:"mono",col:WC_DARK});});
      const e=clamp(ex*7-i,0,1);if(e>0.01)gq_rise(ctx,e,()=>{wc_panel(ctx,1270,yy-27,250,54,{kind:"pill",wash:GV.green,washA:0.2,seed:780+i});gu_light(ctx,1300,yy,"pass",t);
        wc_T(ctx,"has_an_id",1324,yy+10,{w:500,size:28,f:"mono",col:WC_DARK});});});});}
// the pipeline's file, as the platform team keeps it (scripts/setup/loading_pipeline.sql): three of its seven tables, each with its
// expectation; the expectations lit (o.lit)
const GQ_LP=[{n:19,s:"create or refresh streaming table student_system.learners ("},{n:20,s:"  constraint has_an_id expect (student_id is not null) on violation drop row"},{fold:1},
  {n:35,s:"create or refresh streaming table learning_platform.badges ("},{n:36,s:"  constraint has_an_id expect (badge_id is not null) on violation drop row"},{fold:1},
  {n:43,s:"create or refresh streaming table short_courses.enrolments ("},{n:44,s:"  constraint has_an_id expect (enrolment_id is not null) on violation drop row"},{n:45,s:") as select * from stream read_files(…);"}];
function gq_lpSheet(ctx,o){o=o||{};const e=easeCam(clamp(o.u==null?1:o.u,0,1)),y=lerp(H+40,70,e);
  return gu_file(ctx,90,y,1740,{path:"scripts/setup/loading_pipeline.sql",lines:GQ_LP.map((r,i)=>i===1||i===4||i===7?Object.assign({},r,{lit:clamp((o.lit||[])[i===1?0:i===4?1:2]||0,0,1),litCol:GV.green}):r)});}
// at a table's door: the night's enrolments, from their file into short_courses.enrolments, a row at a time (o.flow, 0 to 1), each on
// a strip of paper in its own lane, turning into its place in the table only past the gate; two with no ID stop at the expectation,
// can't be told apart, and are turned aside under the gate, kept out (o.out), and counted
const GQ_ROWS=[["E-7026","SC-EXCEL"],["","SC-FA"],["E-7027","SC-AGILE"],["","SC-FA"],["E-7028","SC-DVE"]];
function gq_door(ctx,t,o){o=o||{};const [x,y,w,h]=GU_BIG;gu_page(ctx,x,y,w,h,{bar:"Databricks · Lakeflow pipeline",title:"enrolments",titleSize:40,sub:"short_courses · a streaming table · each night"});
  const fl=clamp(o.flow||0,0,1),out=clamp(o.out||0,0,1),gx=930;
  // the file, the gate, the table, the tray
  wc_panel(ctx,150,260,600,420,{kind:"card",seed:791});wc_T(ctx,"enrolments.csv",180,312,{w:500,size:28,f:"mono",col:WC_MUTED});
  ctx.save();ctx.strokeStyle=rgba(GV.greenInk,0.9);ctx.lineWidth=8;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(gx,270);ctx.lineTo(gx,640);ctx.stroke();ctx.restore();
  wc_T(ctx,"has_an_id",gx,250,{w:500,size:28,f:"mono",col:GV.greenInk,align:"center"});
  wc_panel(ctx,1060,260,680,400,{kind:"card",wash:GU_CYAN,washA:0.12,seed:792});wc_T(ctx,"short_courses.enrolments",1090,312,{w:500,size:28,f:"mono",col:WC_DARK});
  const go2=k=>clamp(out*2-k,0,1),kept=(go2(0)>=1?1:0)+(go2(1)>=1?1:0);
  wc_panel(ctx,1060,690,680,150,{kind:"card",wash:GV.amber,washA:out>0.01?0.3:0.1,seed:793});wc_T(ctx,"kept out, and counted",1090,744,{w:800,size:30,col:GV.amberInk});
  wc_T(ctx,String(kept),1700,812,{w:800,size:72,col:GV.amberInk,align:"right"});
  const SW=476,stop=gx-16-SW+12;let inside=0,nb=0;GQ_ROWS.forEach(([id,c],i)=>{const v=clamp(fl*GQ_ROWS.length*1.2-i*1.2,0,1),bad=!id,fy0=360+i*58,k=bad?nb++:0;
    let rx=180,ry=fy0,al=1,strip=v>0.01?1:0;
    if(v>0){if(bad){const g=clamp(v*1.4,0,1);rx=lerp(180,stop,easeCam(g));if(g>=1&&out<=0.01)rx+=Math.sin(t*28)*4;
        const o2=go2(k);if(o2>0){const p=gq_along([stop,fy0],[1100,806],200,easeCam(o2));rx=p[0];ry=p[1];al=1-clamp((o2-0.7)/0.3,0,1);}}
      else{rx=lerp(180,1090,easeCam(v));ry=lerp(fy0,360+inside*58,easeCam(clamp((v-0.7)/0.3,0,1)));strip=1-clamp((v-0.85)/0.15,0,1);inside++;}}
    if(al<=0.01)return;withA(ctx,al,()=>{if(strip>0.01)withA(ctx,strip,()=>{ctx.save();ctx.fillStyle=rgba([252,250,244],1);ctx.strokeStyle=rgba(WC_PENCIL,0.6);ctx.lineWidth=1.6;
        ctx.beginPath();ctx.rect(rx-12,ry-34,SW,48);ctx.fill();ctx.stroke();ctx.restore();if(bad)gv_tint(ctx,rx-12,ry-34,SW,48,GV.amber,0.55);});
      wc_T(ctx,bad?"(no ID)":id,rx,ry,{w:500,size:28,f:"mono",col:bad?GV.amberInk:WC_DARK});wc_T(ctx,c+"  enrolled",rx+150,ry,{w:500,size:28,f:"mono",col:WC_INK});});});}

/* ---------- what no rule names ---------- */
// the badges that arrived one night, as the catalog's sample data shows them (at night, on the data team's big screen): half with no
// credit, washed amber (o.lit)
const GQ_BADGES=[["BD-WELCOME","Welcome to Online Learning",0],["MC-PY","Python Foundations",0],["MC-SQL","SQL for Analysis",5],["MC-VIZ","Data Visualisation",0],
  ["MC-STATS","Statistics Refresher",5],["MC-LEAD","Leading Teams",0],["MC-HDATA","Health Data Essentials",5],["MC-SEC","Security Fundamentals",5]];
function gq_badges(ctx,o){o=o||{};const [x,y,w,h]=GU_BIG;gu_page(ctx,x,y,w,h,{bar:"Databricks · Unity Catalog",title:"badges",titleSize:40,sub:"university · learning_platform · table",tabs:["Overview","Sample data","Quality","Lineage"],tab:1});
  const cx=[160,560,1200],ty=356,l=clamp(o.lit||0,0,1),u=clamp(o.u==null?1:o.u,0,1);[["badge_code",0],["badge_name",1],["credit_points",2]].forEach(([s,i])=>wc_T(ctx,s,cx[i],ty,{w:500,size:28,f:"mono",col:WC_MUTED}));
  GQ_BADGES.forEach(([c,n,cp],i)=>{const v=clamp(u*8-i,0,1);if(v<=0.01)return;const ry=ty+60+i*56,mc=cp===0;withA(ctx,v,()=>{if(mc&&l>0.01)gv_tint(ctx,150,ry-38,1600,52,GV.amber,0.6*l);
    wc_T(ctx,c,cx[0],ry,{w:500,size:28,f:"mono",col:WC_DARK});wc_T(ctx,n,cx[1],ry,{w:600,size:28,col:WC_INK});wc_T(ctx,String(cp),cx[2]+60,ry,{w:800,size:30,col:mc&&l>0.3?GV.amberInk:WC_DARK,align:"center"});});});}
// credit_points' tests, as staging writes them (models/staging/learning_platform/_learning_platform__models.yml, lines 64 to 71): not
// null, passing (o.pass); and, once the surprise was confirmed, the rule it became, added (o.add, 0 to 1, lit as it's said)
const GQ_CP=[{n:64,s:"      - name: credit_points"},{fold:1},{n:66,s:"        data_tests:"},{n:67,s:"          - not_null"},{n:68,s:"          # A microcredential badge carries credit (DEC-LMS-03)."},
  {n:69,s:"          - positive:"},{n:70,s:"              config:"},{n:71,s:"                where: \"badge_code like 'MC-%'\""}];
function gq_cpSheet(ctx,o){o=o||{};const ad=clamp(o.add||0,0,1),rows=ad>0.01?GQ_CP:GQ_CP.slice(0,4),e=easeCam(clamp(o.u==null?1:o.u,0,1)),y=lerp(H+40,o.y||80,e);
  const f=gu_file(ctx,90,y,o.w||1180,{path:"models/staging/learning_platform/_learning_platform__models.yml",lang:"yaml",lines:rows.map((r,i)=>i>=4?Object.assign({},r,{add:1,dA:ad,p:clamp(ad*4-(i-4)*0.6,0,1)}):r)});
  const ps=clamp(o.pass||0,0,1);if(ps>0.01&&f.rows.length>3){const px=f.tx+gu_mw(ctx,GQ_CP[3].s)+40;gu_light(ctx,px,f.rows[3],"pass",0,ps);
    wc_hand(ctx,"0 isn't empty: it passes",px+40,f.rows[3]+10,{size:32,w:700,col:GV.greenInk,p:ps});}
  return f;}
// the badges' quality, on the platform: anomaly detection (in preview), what it learned, each table's freshness and rows (o.ad lights
// it); a profile of credit_points, the share of a day's badges with no credit (o.pr lights it; o.u draws the line; o.last brings the
// last night's point up to one in two; o.usual, the line at about one in twelve); the page's state, an alert (o.st), and the alert (o.al)
function gq_quality(ctx,t,o){o=o||{};const [x,y,w,h]=GU_BIG,al=clamp(o.al||0,0,1);gu_page(ctx,x,y,w,h,{bar:"Databricks · Unity Catalog",title:"badges",titleSize:40,sub:"university · learning_platform · table",
    tabs:["Overview","Sample data","Quality","Lineage"],tab:2,state:["1 alert",GV.amber],stateA:clamp(o.st==null?al:o.st,0,1)});
  const ax=150,ay=390,aw=640,ah=450;gq_lit(ctx,ax,ay,aw,ah,o.ad||0);gu_box(ctx,ax,ay,aw,ah,"Anomaly detection",{seed:801});gq_pill(ctx,ax+aw-170,ay+40,"preview",{size:28,wash:GV.amber,washA:0.35,seed:802});
  [["freshness","arrived as usual"],["rows","as many as usual"]].forEach(([k,s],i)=>{const ry=ay+130+i*96;gu_light(ctx,ax+50,ry-10,"pass",t);wc_T(ctx,k,ax+84,ry,{w:800,size:30,col:WC_DARK});
    wc_T(ctx,s,ax+84,ry+40,{w:600,size:28,col:WC_INK});});wc_T(ctx,"learned from the table's history,",ax+40,ay+ah-80,{w:600,size:28,col:WC_MUTED});wc_T(ctx,"with no rule written",ax+40,ay+ah-40,{w:600,size:28,col:WC_MUTED});
  const px=820,py=390,pw=950,ph=450;gq_lit(ctx,px,py,pw,ph,o.pr||0);gu_box(ctx,px,py,pw,ph,"Data profile · credit_points",{seed:803});
  wc_T(ctx,"badges with no credit, of a day's badges",px+30,py+92,{w:600,size:28,col:WC_MUTED});
  const cx=px+80,cw=pw-140,cy=py+130,ch=260,yv=v=>cy+ch-ch*v/0.6,u=clamp(o.u==null?1:o.u,0,1),last=clamp(o.last||0,0,1),pts=[];
  for(let i=0;i<11;i++){const v=i===10?lerp(1/12,0.5,easeCam(last)):1/12*(0.8+0.4*hash(i,5));pts.push([cx+cw*i/10,yv(v)]);}
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.4);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx,cy+ch);ctx.lineTo(cx+cw,cy+ch);ctx.stroke();ctx.restore();
  const us=clamp(o.usual||0,0,1);if(us>0.01){gq_arrow(ctx,[cx,yv(1/12)],[cx+cw,yv(1/12)],0,us,{col:WC_PENCIL,lw:3,dash:[10,10],head:false,a:0.7});
    wc_hand(ctx,"about 1 in 12: the welcome badges",cx+cw-10,yv(1/12)-24,{size:30,w:700,col:WC_PENCIL,align:"right",p:us});}
  const n=Math.max(1,Math.round(10*u));ctx.save();ctx.strokeStyle=rgba(GV.greenInk,0.9);ctx.lineWidth=4;ctx.lineJoin="round";ctx.beginPath();for(let i=0;i<=n;i++){const [a,b]=pts[i];i?ctx.lineTo(a,b):ctx.moveTo(a,b);}ctx.stroke();ctx.restore();
  for(let i=0;i<=n;i++){const [a,b]=pts[i],am=i===10&&last>0.3;ctx.save();ctx.fillStyle=rgba(am?GV.amber:GV.green,1);ctx.beginPath();ctx.arc(a,b,am?13:8,0,TAU);ctx.fill();ctx.restore();}
  if(last>0.3){const [a,b]=pts[10];gv_halo(ctx,a-60,b-60,120,120,GV.amber,0.9*clamp(last*2-0.6,0,1));wc_T(ctx,"1 in 2",a-24,b-30,{w:800,size:34,col:GV.amberInk,align:"right",a:clamp(last*2-0.6,0,1)});}
  if(al>0.01){const s="Alert · Badges with no credit · above 20 in 100";gq_rise(ctx,al,()=>gq_pill(ctx,px+30,py+ph+0,s,{size:28,wash:GV.amber,washA:0.45,seed:804}));}}
// the alert crossing the campus to the learning team's door: an envelope along the path (u, 0 to 1), "Badges with no credit" on it
function gq_flyAlert(ctx,u){if(u<=0.01||u>=1)return;const e=easeCam(u),a=[260,560],b=[GV_CP.door[0],GV_CP.door[1]-110],[ex,ey]=gq_along(a,b,-220,e),k=lerp(1.2,0.85,e),ew=420,eh=170;
  ctx.save();ctx.translate(ex,ey);ctx.scale(k,k);ctx.rotate(-0.08+0.1*e);withA(ctx,clamp((1-u)*8,0,1),()=>{ctx.save();ctx.filter="blur(10px)";ctx.fillStyle="rgba(70,60,50,0.22)";ctx.fillRect(-ew/2+10,-eh/2+16,ew,eh);ctx.restore();
    wc_panel(ctx,-ew/2,-eh/2,ew,eh,{kind:"envelope",fill:[250,236,206],seed:811});ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.55);ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(-ew/2+8,-eh/2+8);ctx.lineTo(0,-eh/2+60);ctx.lineTo(ew/2-8,-eh/2+8);ctx.stroke();ctx.restore();
    wc_T(ctx,"Badges with no credit",-ew/2+30,eh/2-56,{w:800,size:30,col:GV.amberInk});wc_T(ctx,"to: Learning team",-ew/2+30,eh/2-18,{w:600,size:30,col:WC_MUTED});});ctx.restore();}
// the decision the surprise became (sources/learning_platform/_learning_platform__decisions.yml, lines 34 to 47), drawn as a card
function gq_lmsDec(ctx,x,y,a){if(a<=0.01)return;gq_rise(ctx,a,()=>{const w=560,h=330;wc_panel(ctx,x,y,w,h,{kind:"card",seed:821});gv_pin(ctx,x+w/2,y+16,GV.red,1.1);
  wc_T(ctx,"DEC-LMS-03",x+36,y+74,{w:500,size:30,f:"mono",col:WC_DARK});["A microcredential badge","carries credit points"].forEach((l,i)=>wc_T(ctx,l,x+36,y+130+i*42,{w:800,size:30,col:WC_DARK}));
  ["Learning team, with","data governance · 20 October"].forEach((l,i)=>wc_T(ctx,l,x+36,y+236+i*40,{w:600,size:28,col:WC_MUTED}));});}

/* ---------- one scorecard ---------- */
// what the platform found last night, a row for each check on each table, as analyses/quality/platform_results.sql returns it (some of
// its 22 rows), in the SQL editor; o.u (0 to 1) brings the rows in
const GQ_PRC=[["kind",150],["schema_name",470],["table_name",780],["check_name",1010],["dimension",1400],["status",1620]];
const GQ_PRR=[["pipeline expectation","short_courses","enrolments","has_an_id","completeness","pass"],["monitor","short_courses","enrolments","freshness","timeliness","pass"],
  ["monitor","short_courses","enrolments","rows in the last 24 hours","completeness","pass"],["pipeline expectation","learning_platform","badges","has_an_id","completeness","pass"],
  ["monitor","learning_platform","badges","freshness","timeliness","pass"],["monitor","learning_platform","badges","badges with no credit","validity","pass"],
  ["pipeline expectation","student_system","learners","has_an_id","completeness","pass"]];
function gq_results(ctx,t,o){o=o||{};const [x,y,w,h]=GU_BIG,u=clamp(o.u==null?1:o.u,0,1);gu_page(ctx,x,y,w,h,{bar:"Databricks · SQL editor",title:"platform_results",titleSize:40,sub:"analyses/quality/platform_results.sql · last night · 22 rows"});
  const ty=300;GQ_PRC.forEach(([s,cx])=>wc_T(ctx,s,cx,ty,{w:500,size:28,f:"mono",col:WC_MUTED}));ctx.save();ctx.fillStyle=rgba(WC_PENCIL,0.4);ctx.fillRect(140,ty+16,1640,2);ctx.restore();
  GQ_PRR.forEach((r,i)=>{const v=clamp(u*GQ_PRR.length-i,0,1);if(v<=0.01)return;const ry=ty+64+i*62;withA(ctx,v,()=>{if(o.tab&&i<3)gv_tint(ctx,140,ry-40,1640,56,GV.gold,0.5*clamp(o.tab,0,1));
    r.forEach((s,j)=>{const [,cx]=GQ_PRC[j];if(j===5){gu_light(ctx,cx+14,ry-10,"pass",t);wc_T(ctx,s,cx+40,ry,{w:600,size:28,col:GV.greenInk});}
      else wc_T(ctx,s,cx,ry,{w:j===1||j===2?500:600,size:28,f:j===1||j===2?"mono":undefined,col:j===1||j===2?WC_DARK:WC_INK});});});});
  if(u>=1)wc_T(ctx,"…",150,ty+64+GQ_PRR.length*62,{w:500,size:28,f:"mono",col:WC_PENCIL});}
// the scorecard with the platform's results: the tests' table (the rows the film names), and under it, the platform's (o.on brings it
// in; o.lit lights its learning row); the source's meta, on a card, a gold thread from it to that row (o.meta)
const GQ_TOP=[{fold:1},["learning","7/7 (1 warn)","5/5","7/7","3/3","","22/22 (1 warn)"],{fold:1},{all:1,cells:["All","54/54 (1 warn)","42/42","28/28","34/34","2/2","160/160 (1 warn)"]}];
const GQ_PCOLS=[["Domain",230],["completeness",260],["validity",230],["timeliness",230],["All",230]],
  GQ_PLAT=[["learning","8/8","1/1","4/4","13/13"],["registrar","6/6","","3/3","9/9"],{all:1,cells:["All","14/14","1/1","7/7","22/22"]}];
function gq_platCard(ctx,o){o=o||{};const [x,y,w,h]=GU_BIG;gu_page(ctx,x,y,w,h,{bar:"Data quality scorecard · with the platform's results"});
  const t1=gq_table(ctx,150,122,GQ_COLS,GQ_TOP,{lit:o.litTop||[]}),on=clamp(o.on==null?1:o.on,0,1);if(on<=0.01)return;
  const hy=122+t1.h+56;gq_rise(ctx,on,()=>{wc_T(ctx,"On the platform",150,hy,{w:800,size:34,col:WC_DARK});const t2=gq_table(ctx,150,hy+20,GQ_PCOLS,GQ_PLAT,{lit:[[0,0,o.lit||0,GV.gold],[2,4,o.all||0]]});
    const m=clamp(o.meta||0,0,1);if(m<=0.01)return;const mx=1370,my=hy+20,mw=400,mh=220,[ry,rh]=t2.rows[0];
    gq_thread(ctx,[mx+6,my+mh/2],[150+t2.w-6,ry+rh/2],clamp(m*1.6,0,1),{bend:-10});
    gq_rise(ctx,clamp(m*1.6-0.4,0,1),()=>{wc_panel(ctx,mx,my,mw,mh,{kind:"card",wash:GV.gold,washA:0.2,seed:831});wc_T(ctx,"the source's meta",mx+28,my+56,{w:700,size:28,col:WC_MUTED});
      wc_T(ctx,"owner: Learning team",mx+28,my+116,{w:500,size:28,f:"mono",col:WC_DARK});wc_T(ctx,"domain: learning",mx+28,my+168,{w:500,size:28,f:"mono",col:WC_DARK});});});}
// every result to one owner, not a shared inbox: the shared inbox, greyed and crossed (o.x); an owner's card for each, gold, an envelope
// landing on each (o.u[i], 0 to 1)
function gq_toOwners(ctx,o){o=o||{};const ix=290,iy=300,iw=520,ih=280,xs=clamp(o.x||0,0,1);wc_panel(ctx,ix,iy,iw,ih,{kind:"card",seed:841});gv_pin(ctx,ix+iw/2,iy+16,GV.red,1.2);
  withA(ctx,1-0.5*xs,()=>{wc_T(ctx,"data-alerts",ix+40,iy+96,{w:800,size:40,col:WC_DARK});wc_T(ctx,"a shared inbox",ix+40,iy+148,{w:600,size:30,col:WC_MUTED});wc_T(ctx,"14 people",ix+40,iy+196,{w:600,size:30,col:WC_MUTED});});
  if(xs>0.01){gv_tint(ctx,ix+8,iy+8,iw-16,ih-16,GV.grey,0.4*xs);wc_cross(ctx,ix+iw/2,iy+ih/2,150,GV.redInk,xs);}
  GQ_OWN.forEach((s,i)=>{const v=clamp((o.u||[])[i]||0,0,1),cx=1050,cy=130+i*240,cw=560,ch=180;wc_panel(ctx,cx,cy,cw,ch,{kind:"card",wash:GV.gold,washA:0.3,seed:850+i});gv_pin(ctx,cx+cw/2,cy+14,GV.red,1.1);
    wc_T(ctx,s,cx+36,cy+84,{w:800,size:36,col:GV.goldInk});wc_T(ctx,"its results, its issue",cx+36,cy+134,{w:600,size:28,col:WC_MUTED});
    if(v<=0.01)return;const e=easeCam(v),ex=lerp(820,cx+cw-150,e),ey=lerp(450,cy+ch-40,e)-Math.sin(e*Math.PI)*80;ctx.save();ctx.translate(ex,ey);ctx.rotate(-0.1+0.12*e);
    wc_panel(ctx,-80,-48,160,96,{kind:"envelope",fill:[246,238,218],seed:860+i});ctx.strokeStyle=rgba(WC_PENCIL,0.55);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-74,-42);ctx.lineTo(0,0);ctx.lineTo(74,-42);ctx.stroke();ctx.restore();});}
// measured, not surveyed, on Yusuf's desk: the survey, its average crossed in pencil (o.x); the scorecard's totals, last night, on a
// printed sheet: the tests (o.tests) and the platform's checks (o.plat)
function gq_measured(ctx,o){o=o||{};gq_surveySheet(ctx,290,170,-0.04,4,1);const sx=370,sy=670;wc_panel(ctx,sx-40,sy-70,380,190,{kind:"card",seed:871});
  wc_T(ctx,"average",sx,sy-10,{w:700,size:28,col:WC_MUTED});wc_hand(ctx,"3.9",sx,sy+80,{size:84,w:700,col:WC_DARK});const xs=clamp(o.x||0,0,1);if(xs>0.01)wc_cross(ctx,sx+60,sy+40,110,GV.redInk,xs);
  gu_filmTag(ctx,300,110,"Rules that run",clamp(o.tag||0,0,1));
  const x=780,y=110,w=1000,h=680,te=clamp(o.tests||0,0,1),pl=clamp(o.plat||0,0,1);gv_sheet(ctx,x,y,w,h,{rot:0.008});wc_T(ctx,"Data quality scorecard",x+50,y+86,{w:800,size:40,col:WC_DARK});
  wc_T(ctx,"last night",x+50,y+134,{w:600,size:30,col:WC_MUTED});
  [["the tests","160/160","(1 warn)",te,GV.green,GV.greenInk],["on the platform","22/22","",pl,GV.green,GV.greenInk]].forEach(([l,v,n,a,col,ink],i)=>{const by=y+190+i*230;
    gq_lit(ctx,x+40,by,w-80,190,a,col);gv_tint(ctx,x+40,by,w-80,190,col,0.3);wc_T(ctx,l,x+70,by+56,{w:700,size:30,col:WC_INK});wc_T(ctx,"All",x+70,by+150,{w:800,size:34,col:WC_DARK});
    wc_T(ctx,v,x+190,by+156,{w:800,size:96,col:ink});if(n)wc_T(ctx,n,x+210+tw(ctx,v,96,800),by+150,{w:700,size:36,col:GV.amberInk});});}
// the governance check's measures, as it prints them (python scripts/check/governance.py --measures), on the data team's big screen;
// the tests' line lit (o.lit), with a note: 160 tests on the data, and one on the project's own graph (tests/governance/)
const GQ_MEAS=["| Measure | Meets it | Of | |","|---|---|---|---|","| Domains, entities and shared models with an owner | 37 | 37 | 100% |",
  "| Core entities and public models with a glossary term, or none confirmed | 13 | 13 | 100% |","| Columns of shared models classified | 119 | 119 | 100% |",
  "| Tests with an owner and a dimension | 161 | 161 | 100% |","| Columns of shared models described | 119 | 119 | 100% |"];
function gq_measures(ctx,o){o=o||{};const [x,y,w,h]=GU_BIG,u=clamp(o.u==null?1:o.u,0,1);gu_page(ctx,x,y,w,h,{bar:"Terminal · the governance check, with its measures"});
  wc_T(ctx,"$ python scripts/check/governance.py --measures",150,190,{w:500,size:28,f:"mono",col:WC_DARK});
  GQ_MEAS.forEach((s,i)=>{const v=clamp(u*GQ_MEAS.length-i,0,1);if(v<=0.01)return;const ry=260+i*52;if(i===5&&o.lit>0.01)gv_tint(ctx,140,ry-36,1640,50,GV.gold,0.8*clamp(o.lit,0,1));
    wc_T(ctx,s,150,ry,{w:500,size:28,f:"mono",col:WC_INK,a:v});
    if(i===5&&o.lit>0.01)wc_hand(ctx,"160 on the data, 1 on the project",1150,ry+2,{size:30,w:700,col:WC_PENCIL,p:clamp(o.lit*1.4-0.4,0,1)});});
  if(u>=1)wc_T(ctx,"Governance's rules are met: every owner, glossary term, column class, test and",150,260+7*52+30,{w:500,size:28,f:"mono",col:GV.greenInk});
  if(u>=1)wc_T(ctx,"description is in place.",150,260+8*52+30,{w:500,size:28,f:"mono",col:GV.greenInk});
  gu_filmTag(ctx,1770,180,"Teachers of data",clamp(o.tag||0,0,1),{align:"right"});}

/* ---------- this morning ---------- */
// the scorecard, small, on Clara's screen: its cells in their colours, one amber; o.lit lights that one
function gq_cardSmall(o){o=o||{};return(q,sx,sy,sw)=>{wc_T(q,"Data quality scorecard",sx+36,sy+100,{w:800,size:34,col:WC_DARK});
  for(let r=0;r<8;r++)for(let c=0;c<6;c++){if(hash(r*7+c,4)<0.16&&c<5)continue;const amber=r===3&&c===0,cx=sx+60+c*118,cy=sy+136+r*36;if(amber&&o.lit>0.01)gv_halo(q,cx-20,cy-20,140,72,GV.amber,0.9*o.lit);
    q.save();q.fillStyle=rgba(amber?GV.amber:GV.green,amber?0.8:0.45);q.fillRect(cx,cy,100,26);q.restore();}};}

/* ---------- the places ---------- */
// the series' desk of files, as gu_paintFilesDesk paints it, with its mug at the bottom right: this film's sheets run the frame's whole width
function gq_paintFilesDesk(c){const wood=[214,196,168];c.fillStyle=rgba(WC_PAPER,1);c.fillRect(0,0,W,H);wc_wash(c,wc_rect(-40,-40,W+80,H+80),wood,{kind:"plaster",line:false,seed:57});
  c.save();c.globalCompositeOperation="multiply";const R=wc_rng(7);for(let i=0;i<60;i++){const y=R()*H;c.strokeStyle=rgba(wc_dim(wood,0.18+R()*0.1),0.16+R()*0.12);c.lineWidth=1+R()*2;c.beginPath();c.moveTo(-20,y);
    for(let x=0;x<=W+40;x+=80)c.lineTo(x,y+5*Math.sin(x/280+i)+3*Math.sin(x/70+i*2));c.stroke();}c.restore();
  wc_wash(c,wc_ell(1826,1000,80,80,40),[232,236,240],{kind:"thing",lw:1.6});wc_wash(c,wc_ell(1826,1000,60,60,40),[96,70,60],{kind:"thing",line:false});
  wc_part(c,wc_rect(-60,820,300,330),[96,84,120],1,{seed:3});wc_flat(c,wc_rect(170,820,18,330),[236,226,200],1,"band");}
const WC_PLACES={planClose:gq_paintPlan,planDesk:gq_paintPlanDesk,planning:gv_paintPlanning,nightScreen:gq_paintNightScreen,big:c=>gu_paintScreenBig(c,GV_ROOM.data),
  bigNight:gq_paintBigNight,screen:c=>gv_paintScreenDesk(c,GV_ROOM.data),bigPlat:c=>gu_paintScreenBig(c,GV_ROOM.plat),bigLearn:c=>gu_paintScreenBig(c,GV_ROOM.learn),bigPlan:c=>gu_paintScreenBig(c,GV_ROOM.plan),
  deskGov:gv_paintDesk,desk:gq_paintFilesDesk,boardGov:c=>gv_paintBoardClose(c,GV_ROOM.gov),board:c=>gv_paintBoardClose(c,GV_ROOM.data),
  platform:gv_paintPlatformClose,platformDesk:gv_paintPlatformDesk,tom:gq_paintTom,tomDesk:gq_paintTomDesk,campus:gv_paintCampus};
