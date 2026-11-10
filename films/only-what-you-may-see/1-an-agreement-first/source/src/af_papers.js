/* ===== An agreement first: the papers =====
   The film's own pieces, on the kit's glass (films/locks-before-the-data/shared/src/glass.js): papers of frosted glass with a folded
   corner, set down line by line, each line a label and its words, with lines to sign on and the gold chip that says a signed paper is
   genuine; the agreement's contract; the registers Yusuf keeps; a group's badge; the study's own space on the platform; the totals that
   may leave. Every word at least 28 px and in ice white or a meaning's colour on frosted glass; the papers' rims are ice (a paper is
   neither allowed nor denied), and only their lines take a meaning's colour: green what the study may have, violet what it never gets,
   coral what's closed. Prefixed af_. */

const AF_ICE=[190,245,245];
/* ---------------------------------------------------------------- a pane of frosted glass with a folded corner
   As the kit's dp_panel, but its top right corner folded down: the place behind it frosted, a dark film and a faint tint, light along
   its top edge, a rim; the fold a small triangle of lighter glass. */
function af_foldPath(c,x,y,w,h,r,f){c.moveTo(x+r,y);c.lineTo(x+w-f,y);c.lineTo(x+w,y+f);c.lineTo(x+w,y+h-r);c.arcTo(x+w,y+h,x+w-r,y+h,r);c.lineTo(x+r,y+h);c.arcTo(x,y+h,x,y+h-r,r);
  c.lineTo(x,y+r);c.arcTo(x,y,x+r,y,r);c.closePath();}
function af_panelFold(ctx,x,y,w,h,o){o=o||{};const col=o.col?dp_f(o.col):AF_ICE,r=18,f=o.fold==null?48:o.fold,a=o.a==null?1:o.a;if(!(a>0.003))return;
  ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor=rgba(col,0.26);ctx.shadowBlur=44;ctx.beginPath();af_foldPath(ctx,x,y,w,h,r,f);ctx.fillStyle="rgba(6,20,26,0.74)";ctx.fill();ctx.restore();
  ctx.save();ctx.beginPath();af_foldPath(ctx,x,y,w,h,r,f);ctx.clip();dp_behind(ctx,o.behind);ctx.fillStyle="rgba(6,20,26,0.3)";ctx.fillRect(x,y,w,h);
  let g=ctx.createLinearGradient(x,y,x+w*0.4,y+h);g.addColorStop(0,"rgba(160,220,225,0.15)");g.addColorStop(1,"rgba(160,220,225,0.05)");ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
  g=ctx.createLinearGradient(0,y,0,y+70);g.addColorStop(0,"rgba(225,250,250,0.14)");g.addColorStop(1,"rgba(255,255,255,0)");ctx.fillStyle=g;ctx.fillRect(x,y,w,70);ctx.restore();
  g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,rgba(mix(col,[255,255,255],0.45),1));g.addColorStop(0.5,rgba(col,0.75));g.addColorStop(1,rgba(col,0.95));
  ctx.beginPath();af_foldPath(ctx,x+1,y+1,w-2,h-2,r,f);ctx.strokeStyle=g;ctx.lineWidth=2.2;ctx.stroke();
  // the fold: the corner turned down, lighter glass, its crease catching the light
  ctx.beginPath();ctx.moveTo(x+w-f,y);ctx.lineTo(x+w-f+4,y+f-4);ctx.lineTo(x+w,y+f);ctx.closePath();ctx.fillStyle="rgba(200,240,240,0.30)";ctx.fill();
  ctx.strokeStyle=rgba(mix(col,[255,255,255],0.5),0.9);ctx.lineWidth=1.6;ctx.stroke();
  ctx.restore();}

/* ---------------------------------------------------------------- a paper: a title, lines of a label and its words, places to sign
   af_paper(ctx, x, y, w, {kick, title, sub, rows: [{label, text, col, a, strike, glow, lines}], foot}, {a, k, behind, measure,
   labelW}): the rows' words wrap within the paper; each row comes in by its own a (0 to 1), rising a little; col colours its words
   (a meaning: "allowed", "hidden"); strike (0 to 1) draws a violet line through them; glow (0 to 1) lights the row. foot(ctx, x, y, w)
   draws what goes under the rows (signatures) and returns its height. Returns the paper's box, and each row's box (rows). */
const AF_PAD=36,AF_LH=40,AF_ROWGAP=16;
function af_paper(ctx,x,y,w,P,o){o=o||{};const lw=o.labelW||210,tw=w-2*AF_PAD-lw,F={w:600,size:28},rows=(P.rows||[]).map(r=>({r,lines:r.lines||ag_wrap(ctx,r.text,tw,F)}));
  // where everything goes, from the top
  let yy=y+AF_PAD;const L=[];
  if(P.kick){yy+=22;L.push(["kick",yy]);}
  if(P.title){yy+=P.kick?52:30;L.push(["title",yy]);}
  if(P.sub){yy+=40;L.push(["sub",yy]);}
  yy+=30;const top=yy;const RB=[];
  rows.forEach((q,i)=>{const h=q.lines.length*AF_LH;RB.push({x,y:yy,w,h:h+AF_ROWGAP,base:yy+30,lines:q.lines,r:q.r});yy+=h+AF_ROWGAP;});
  const footH=P.footH||0;const h=Math.round(yy-y+footH+AF_PAD-6),bb={x,y,w,h,rows:RB,footY:yy};if(o.measure)return bb;
  const a=o.a==null?1:o.a;if(!(a>0.003))return bb;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  af_panelFold(ctx,x,y,w,h,{behind:o.behind,col:o.col});
  for(const [k,by] of L){if(k==="kick"){dp_T(ctx,String(P.kick).toUpperCase(),x+AF_PAD,by,{w:800,size:28,ls:4,col:P.kickCol||"cyan"});
      if(o.date&&o.dateA>0)dp_T(ctx,o.date,x+w-AF_PAD-56,by,{w:600,size:28,align:"right",col:"mut",a:o.dateA});}
    else if(k==="title")dp_T(ctx,P.title,x+AF_PAD,by,{w:800,size:40});else dp_T(ctx,P.sub,x+AF_PAD,by,{w:600,size:28,col:"mut"});}
  if(rows.length){ctx.save();ctx.fillStyle="rgba(190,245,245,0.16)";ctx.fillRect(x+AF_PAD,top-14,w-2*AF_PAD,1.6);ctx.restore();}
  RB.forEach(b=>{const r=b.r,ra=r.a==null?1:r.a;if(!(ra>0.003))return;ctx.save();ctx.globalAlpha*=ra;const dy=(1-ag_eo(ra))*10;
    if(r.glow>0){ctx.save();ctx.globalAlpha*=r.glow;ctx.fillStyle=rgba(dp_f(r.glowCol||"cyan"),0.16);rr(ctx,x+12,b.y-6,w-24,b.h-4,12);ctx.fill();ctx.fillStyle=rgba(dp_f(r.glowCol||"cyan"),1);rr(ctx,x+12,b.y-6,5,b.h-4,2.5);ctx.fill();ctx.restore();}
    dp_T(ctx,r.label,x+AF_PAD,b.base+dy,{w:700,size:28,col:r.labelCol||"mut"});
    b.lines.forEach((l,i)=>dp_T(ctx,l,x+AF_PAD+lw,b.base+dy+i*AF_LH,{w:600,size:28,col:r.col||"ink"}));
    if(r.strike>0){const c=dp_f(r.strikeCol||"violet");ctx.save();ctx.strokeStyle=rgba(c,1);ctx.lineWidth=3;ctx.lineCap="round";ctx.shadowColor=rgba(c,0.7);ctx.shadowBlur=6;
      b.lines.forEach((l,i)=>{const lwid=dp_tw(ctx,l,F),yy2=b.base+dy+i*AF_LH-9,u=clamp(r.strike*b.lines.length-i,0,1);if(u<=0)return;ctx.beginPath();ctx.moveTo(x+AF_PAD+lw-4,yy2);ctx.lineTo(x+AF_PAD+lw-4+(lwid+8)*ag_sine(u),yy2);ctx.stroke();});ctx.restore();}
    ctx.restore();});
  if(P.foot)P.foot(ctx,x,yy,w);
  ctx.restore();return bb;}
// a signature: a line to sign on, and a hand's loops written along it (u 0 to 1), in ice: a run of loops (a trochoid, its loops
// growing and shrinking), rising a little, and a stroke back under it at the end; seed makes each person's hand their own
function af_signature(ctx,x,y,w,u,seed){seed=seed||0;ctx.save();ctx.fillStyle="rgba(190,245,245,0.4)";ctx.fillRect(x,y+6,w,1.6);
  if(u>0){ctx.beginPath();ctx.rect(x-4,y-56,w*clamp(u,0,1)+8,76);ctx.clip();ctx.strokeStyle=rgba(DP.T.ink,1);ctx.lineWidth=2.6;ctx.lineCap="round";ctx.lineJoin="round";
    ctx.shadowColor="rgba(190,245,245,0.6)";ctx.shadowBlur=6;const L=w*0.78,T=TAU*(4.6+(seed*1.7)%2),a=L/T,n=220;ctx.beginPath();
    for(let i=0;i<=n;i++){const v=i/n,th=v*T,b=a*(1.5+0.7*Math.sin(v*TAU*1.3+seed*2.1))*(v<0.08?v/0.08:1),xx=x+10+a*th-b*Math.sin(th),yy=y-16-v*8-b*Math.cos(th)*0.9;
      i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}
    ctx.moveTo(x+10+L+8,y-14);ctx.quadraticCurveTo(x+w*0.55,y+2,x+16,y-6);ctx.stroke();}
  ctx.restore();}

/* ---------------------------------------------------------------- the confidentiality agreement, each person's own
   Six lines in the signer's voice, as numbers.md has them, and a line to sign; show(i) brings in line i (0 to 5); sign (0 to 1) writes
   the signature; who names the signer under it; chip (0 to 1) the gold chip */
const AF_PROMISE=["I keep what I see to myself","I use it only for the work it's given for","I keep no copy where it isn't allowed","I answer for the data I'm given",
  "I report anything that goes wrong, at once","It holds after I leave"];
function af_promise(ctx,x,y,w,o){o=o||{};const show=o.show||(()=>1),glow=o.glow||(()=>0),sg=o.sign||0;
  return af_paper(ctx,x,y,w,{kick:o.kick===undefined?"Each person's own":o.kick,title:"Confidentiality agreement",
    rows:AF_PROMISE.map((t,i)=>({label:String(i+1),text:t,a:show(i),glow:glow(i),labelCol:"cyan"})),footH:o.who?112:0,
    foot:o.who?(c,x0,y0,ww)=>{const fa=o.footA==null?1:o.footA;if(!(fa>0.003))return;c.save();c.globalAlpha*=fa;af_signature(c,x0+AF_PAD,y0+38,420,sg,o.seed||0);
      dp_T(c,o.who,x0+AF_PAD,y0+86,{w:600,size:28,col:"mut"});const ch=o.chip||0;if(ch>0){c.save();c.globalAlpha*=ch;dp_chip(c,x0+ww-AF_PAD-72,y0+18);c.restore();}c.restore();}:null},
    {a:o.a,k:o.k,behind:o.behind,measure:o.measure,labelW:58});}

/* ---------------------------------------------------------------- the data sharing agreement, 2026-14, word for word (numbers.md)
   show(k) brings in each line by its key; hi(k) lights it; may (0 to 1) turns what it may have green; never (0 to 1) turns what it
   never gets violet (hidden); signs {mei, anil, chip, a} write the signatures (0 to 1) and set the gold chip; date (dateA 0 to 1) the
   day it was signed, on the kick's row */
const AF_AGREE=[["purpose","Purpose","How learners in the Faculty of Health progress, and where they need support"],
  ["from","From","The registrar's learner records: 2,614 learners"],
  ["may","May have","Each learner's course and results; their year of birth; a code in place of who they are"],
  ["never","Never","Anything that names a learner; anything about their health"],
  ["who","Who","The study's group, “Health progress study”, each member with a signed confidentiality agreement"],
  ["where","Where","On the platform, in the study's own space; nothing downloaded"],
  ["leave","May leave","Totals, with any count under 10 hidden"],
  ["ends","Ends","30 June 2027; then the study's copy is deleted, and the totals stay"]];
function af_agreement(ctx,x,y,w,o){o=o||{};const show=o.show||(()=>1),hi=o.hi||(()=>0),S=o.signs||null;
  return af_paper(ctx,x,y,w,{kick:"Data sharing agreement",title:"2026-14 · For a study in the Faculty of Health",
    rows:AF_AGREE.map(([k,l,t])=>({label:l,text:t,a:show(k),glow:hi(k),col:k==="may"&&o.may>0?mix(DP.T.ink,DP.T.green,o.may):k==="never"&&o.never>0?mix(DP.T.ink,DP.T.violet,o.never):null,
      labelCol:k==="may"&&o.may>0?"green":k==="never"&&o.never>0?"violet":"mut"})),footH:S?120:0,
    foot:S?(c,x0,y0,ww)=>{const fa=S.a==null?1:S.a;if(!(fa>0.003))return;c.save();c.globalAlpha*=fa;const cx=x0+AF_PAD,half=(ww-2*AF_PAD-120)/2;
      af_signature(c,cx,y0+40,half-40,S.mei||0,1.3);af_signature(c,cx+half,y0+40,half-40,S.anil||0,2.1);
      withA(c,ag_in(S.mei||0,0.3,0.5),()=>{dp_T(c,"Mei Tanaka · for the registrar's office",cx,y0+88,{w:600,size:28,col:"mut"});});
      withA(c,ag_in(S.anil||0,0.3,0.5),()=>{dp_T(c,"Anil Kurian · for the study",cx+half,y0+88,{w:600,size:28,col:"mut"});});
      if(S.chip>0){c.save();c.globalAlpha*=S.chip;dp_chip(c,x0+ww-AF_PAD-72,y0+26);c.restore();}c.restore();}:null},
    {a:o.a,k:o.k,behind:o.behind,measure:o.measure,labelW:200,date:o.date,dateA:o.dateA});}

/* ---------------------------------------------------------------- the agreement's contract: its terms where the platform reads them */
function af_contract(ctx,x,y,w,o){o=o||{};const show=o.show||(()=>1),hi=o.hi||(()=>0);
  return af_paper(ctx,x,y,w,{kick:"Contract · 2026-14",kickCol:"cyan",rows:[{label:"Columns",text:"course · results · year of birth · learner code",lines:["course · results ·","year of birth · learner code"],a:show(0),glow:hi(0)},
    {label:"Group",text:"Health progress study",a:show(1),glow:hi(1)},{label:"Until",text:"30 June 2027",a:show(2),glow:hi(2),col:o.ended?"coral":null}]},
    {a:o.a,k:o.k,behind:o.behind,measure:o.measure,labelW:160,col:"cyan"});}

/* ---------------------------------------------------------------- a register: a book of frosted glass, open, its rows
   af_register(ctx, x, y, w, {title, rows: [[text, {col, a, frost, tick, tickCol, note}]], a, open}): the book's two pages, its title on
   the left page; each row a line of its own on the right page; frost hides a row's words under violet (another person's), tick (0 to 1)
   draws a tick in tickCol, note a pill beside it */
function af_register(ctx,x,y,w,o){o=o||{};const h=o.h||420,a=o.a==null?1:o.a;if(!(a>0.003))return;const op=o.open==null?1:o.open;ctx.save();ctx.globalAlpha*=a;
  const mid=x+w*0.36;
  // the covers' edge and the pages: the left one narrower, the right one wider, both frosted
  dp_panel(ctx,x,y,w,h,{col:AF_ICE,r:18,behind:o.behind,glowR:40});
  ctx.save();ctx.strokeStyle="rgba(190,245,245,0.35)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(mid,y+14);ctx.lineTo(mid,y+h-14);ctx.stroke();
  const sg=ctx.createLinearGradient(mid-30,0,mid+30,0);sg.addColorStop(0,"rgba(0,0,0,0)");sg.addColorStop(0.5,"rgba(0,0,0,0.25)");sg.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=sg;ctx.fillRect(mid-30,y+4,60,h-8);ctx.restore();
  dp_T(ctx,String(o.kick||"Register").toUpperCase(),x+34,y+70,{w:800,size:28,ls:4,col:"cyan"});
  ag_wrap(ctx,o.title||"",mid-x-60,{w:800,size:36}).forEach((l,i)=>dp_T(ctx,l,x+34,y+124+i*46,{w:800,size:36}));
  if(o.keeper){const kl=ag_wrap(ctx,o.keeper,mid-x-60,{w:600,size:28});kl.forEach((l,i)=>dp_T(ctx,l,x+34,y+h-40-(kl.length-1-i)*38,{w:600,size:28,col:"mut"}));}
  const rx=mid+34,rw=x+w-34-rx;let ry=y+64;
  (o.rows||[]).forEach(([text,q])=>{q=q||{};const ra=(q.a==null?1:q.a)*op;if(q.ghost){ctx.save();ctx.globalAlpha*=ra;ctx.fillStyle="rgba(190,245,245,0.16)";rr(ctx,rx,ry-20,rw*0.8,10,5);ctx.fill();rr(ctx,rx,ry,rw*0.55,10,5);ctx.fill();ctx.restore();ry+=46;return;}
    if(ra<=0.003){ry+=q.h||58;return;}ctx.save();ctx.globalAlpha*=ra;
    const lines=ag_wrap(ctx,text,rw-(q.tick!=null?60:0),{w:600,size:28}),rh=lines.length*38+20;
    if(q.frost){dp_frost(ctx,rx-10,ry-30,rw+10,rh-6,c=>{lines.forEach((l,i)=>ag_T(c,l,rx,ry+i*38,{w:600,size:28,col:[240,240,250],deco:1}));},{behind:o.behind});}
    else lines.forEach((l,i)=>dp_T(ctx,l,rx,ry+i*38,{w:600,size:28,col:q.col||"ink"}));
    if(q.tick!=null&&q.tick>0)dp_tick(ctx,x+w-56,ry-10+(lines.length-1)*19,q.tickCol||"green",q.tick);
    if(q.note)dp_T(ctx,q.note,rx,ry+lines.length*38+4,{w:700,size:28,col:q.noteCol||"grey",a:q.noteA==null?1:q.noteA});
    if(q.glow>0){ctx.save();ctx.globalAlpha*=q.glow;ctx.fillStyle=rgba(dp_f(q.glowCol||"cyan"),0.14);rr(ctx,rx-16,ry-36,rw+22,rh,10);ctx.fill();ctx.restore();}
    ctx.restore();ry+=rh+10+(q.note?42:0);});
  ctx.restore();}

/* ---------------------------------------------------------------- a register as a table: what was agreed, by whom, until when
   af_ledger(ctx, x, y, w, {h, kick, title, head: [[label, dx]], ghosts, rows: [{cells, col, a, glow, pill, pillCol, pillA}], a, behind}):
   its title, a row of headings, older entries as frosted bars that can't be read (ghosts), then the rows, each cell under its heading;
   pill (a closed entry's coral pill) sits at the row's right end, under it */
function af_ledger(ctx,x,y,w,o){o=o||{};const h=o.h||480,a=o.a==null?1:o.a;if(!(a>0.003))return;ctx.save();ctx.globalAlpha*=a;
  dp_panel(ctx,x,y,w,h,{col:AF_ICE,r:18,behind:o.behind,glowR:40});
  dp_T(ctx,String(o.kick||"Register").toUpperCase(),x+34,y+66,{w:800,size:28,ls:4,col:"cyan"});
  dp_T(ctx,o.title||"",x+34,y+118,{w:900,size:36});
  const H=o.head||[],hy=y+190;H.forEach(([s,dx])=>dp_T(ctx,s,x+34+dx,hy,{w:500,size:28,col:"mut"}));
  ctx.save();ctx.fillStyle="rgba(190,245,245,0.22)";ctx.fillRect(x+34,hy+22,w-68,1.6);ctx.restore();
  let ry=hy+80;
  for(let g=0;g<(o.ghosts||0);g++){ctx.save();ctx.fillStyle="rgba(190,245,245,0.13)";H.forEach(([s,dx],k)=>{rr(ctx,x+34+dx,ry-18,[300,250,150][k%3]-g*30,12,6);ctx.fill();});ctx.restore();ry+=54;}
  (o.rows||[]).forEach(r=>{const ra=r.a==null?1:r.a;if(ra>0.003){ctx.save();ctx.globalAlpha*=ra;
    if(r.glow>0){ctx.save();ctx.globalAlpha*=r.glow;ctx.fillStyle=rgba(dp_f(r.glowCol||"cyan"),0.16);rr(ctx,x+16,ry-42,w-32,62,12);ctx.fill();ctx.fillStyle=rgba(dp_f(r.glowCol||"cyan"),1);rr(ctx,x+16,ry-42,5,62,2.5);ctx.fill();ctx.restore();}
    r.cells.forEach((s,k)=>dp_T(ctx,s,x+34+H[k][1],ry,{w:600,size:28,col:r.col||"ink"}));
    if(r.pill)dp_pill(ctx,x+w-34,ry+62,r.pill,r.pillCol||"coral",{align:"right",a:r.pillA==null?1:r.pillA});
    ctx.restore();}ry+=64;});
  ctx.restore();}

/* ---------------------------------------------------------------- a group's badge, and the people in it
   af_group(ctx, x, y, w, {title, members: [{name, state, a}], a, behind}): a cyan band "Group" (who it lets in is an identity), its
   name, and a row for each member: a person's picture, the name, and a pill for the state of their confidentiality agreement: "signed"
   (green, "Signed · current"), "renew" (frosted, "Renew by February"), "lapsed" (coral, "Lapsed"), with paused (0 to 1) greying the
   member, "Paused" */
function af_group(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(!(a>0.003))return null;const M=o.members||[],h=128+M.length*104;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  dp_panel(ctx,x,y,w,h,{col:"cyan",r:22,behind:o.behind});dp_band(ctx,x,y,w,58,22,"cyan","Group");
  dp_T(ctx,o.title||"",x+30,y+108,{w:800,size:36});
  M.forEach((m,i)=>{const my=y+150+i*104,ma=m.a==null?1:m.a;if(!(ma>0.003))return;ctx.save();ctx.globalAlpha*=ma;const p=clamp(m.paused||0,0,1);
    ctx.save();ctx.globalAlpha*=1-0.55*p;ctx.save();ctx.beginPath();ctx.arc(x+62,my+38,34,0,TAU);ctx.fillStyle="rgba(6,26,32,0.9)";ctx.fill();ctx.clip();
    ctx.translate(x+62,my+38);ctx.scale(0.55,0.55);dp_personPic(ctx,0,0,p>0.5?"grey":"cyan");ctx.restore();
    ctx.beginPath();ctx.arc(x+62,my+38,34,0,TAU);ctx.strokeStyle=rgba(dp_f(p>0.5?"grey":"cyan"),0.9);ctx.lineWidth=2;ctx.stroke();
    dp_T(ctx,m.name,x+116,my+48,{w:700,size:30,col:p>0.5?"grey":"ink"});ctx.restore();
    if(p>0.003)dp_T(ctx,"Paused",x+116+dp_tw(ctx,m.name,{w:700,size:30})+18,my+48,{w:700,size:28,col:"grey",a:ag_in(p,0.3,0.7)});
    const st=m.state||"signed",txt=st==="renew"?"Renew by February":st==="lapsed"?"Lapsed":st==="paused"?"Paused":"Signed · current",pa=m.pillA==null?1:m.pillA;
    // a date coming up means nothing yet: frosted glass and ice words; lapsed is closed (coral), signed and current allowed (green)
    if(st==="renew"){const pw=dp_tw(ctx,txt,{w:700,size:28})+36;if(pa>0.003){ctx.save();ctx.globalAlpha*=pa;dp_panel(ctx,x+w-30-pw,my+50-36,pw,48,{col:AF_ICE,r:24,glowR:16,behind:o.behind});dp_T(ctx,txt,x+w-30-pw+18,my+50,{w:700,size:28});ctx.restore();}}
    else dp_pill(ctx,x+w-30,my+50,txt,st==="lapsed"||st==="paused"?"coral":"green",{align:"right",a:pa});
    ctx.restore();});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the totals that may leave, published */
const AF_TOTALS=[["Nursing","38"],["Midwifery","fewer than 10","hidden"],["Public health","21"],["Health sciences","hidden","hidden"],["Faculty of Health","80"]];
function af_totals(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(!(a>0.003))return null;const h=118+AF_TOTALS.length*46+20;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  dp_panel(ctx,x,y,w,h,{col:"grey",r:22,behind:o.behind});
  dp_T(ctx,"TOTALS · PUBLIC",x+30,y+52,{w:800,size:28,ls:4,col:"grey"});dp_T(ctx,"Left after first year · by course",x+30,y+98,{w:700,size:32});
  AF_TOTALS.forEach(([c,n,k],i)=>{const yy=y+152+i*46;dp_T(ctx,c,x+30,yy,{w:600,size:28,col:i===AF_TOTALS.length-1?"ink":"mut"});
    dp_T(ctx,n,x+w-30,yy,{w:700,size:28,align:"right",col:k||"ink"});});
  ctx.restore();return{x,y,w,h};}
