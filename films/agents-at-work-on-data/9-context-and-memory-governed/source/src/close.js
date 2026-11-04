/* ===== Context and memory, governed: what an agent reads, and the series' close =====
     cm_context(ctx, o)           what an agent reads, as Context engineering draws it: the sphere in the middle, four cards at its corners
                                  (Code, Metadata, Skills, Tools, in that film's words), blue kickers, an arm reaching each as it comes
                                  (o.show(i)), orange coming back along it (o.back(i), o.backMem); o.memory 0..1 adds the fifth, the memory,
                                  under the sphere; o.gov 0..1 gives each card the mark of what's governed; o.at, o.r, o.think, o.a, o.t
     cm_govTable(ctx, x, y, o)    the five questions as a table: a row for each kind of context and the memory, a column for each
                                  question (o.cols 0..1 each lit as it's asked), and o.chat (a note in one person's chat) as a last row
     CM_LESSONS                   the series' nine films, each with its lesson, as each film's end card says it
     cm_lessons(ctx, o)           the nine cards, three by three: o.show(i) 0..1 for each; o.slots, their empty places, dashed;
                                  o.deco when the camera makes them small
     cm_shelves(ctx, o)           the module's road: four series on an oak rail; o.lit (the next one), o.a */

// the four cards as Context engineering draws them (its CE_KINDS and ce_context, as merged on 4 November 2026): 520 wide at x 80 and
// 1320, y 150 and 560, the sphere at (960, 470), blue kickers; each card's arm reaches from the sphere to the middle of its inner edge
const CM_CTX=[{kick:"Code",title:"The repository",sub:"Recipes, tests, AGENTS.md",x:80,y:150},{kick:"Metadata",title:"What words mean",sub:"Data models, contracts, lineage",x:1320,y:150},
  {kick:"Skills",title:"How the team does a job",sub:"Step by step",x:80,y:560},{kick:"Tools",title:"What it can reach and do",sub:"Catalog, Query, Docs: read only",x:1320,y:560}];
const CM_KW=520;
function cm_context(ctx,o){o=o||{};const a=o.a==null?1:o.a,[cx,cy]=o.at||[960,470],r=o.r||96,t=o.t||0,mem=o.memory||0,gov=o.gov||0,show=o.show||(()=>1);if(a<=0)return;
  ctx.save();ctx.globalAlpha*=a;ag_modelLight(ctx,cx,cy,r,1,cy+260);
  // the arms first, so the sphere hides their roots and each card covers the gripper at its edge; orange runs back along each (o.back(i))
  CM_CTX.forEach((k,i)=>{const u=clamp(show(i),0,1);if(u<=0)return;const b=ag_textCard(ctx,k.x,k.y,CM_KW,k,{measure:true}),left=k.x<cx,ex=left?k.x+CM_KW+4:k.x-4,ey=k.y+b.h/2,
    sx=cx+(left?-r*0.92:r*0.92),sy=cy+(ey<cy?-r*0.35:r*0.35);
    ag_reach(ctx,[sx,sy,lerp(sx,ex,0.45),sy,lerp(sx,ex,0.55),ey,ex,ey],ag_sine(clamp(u*1.4,0,1)),{data:o.back?o.back(i):0,grip:1});});
  // this film adds the memory under the sphere, its arm straight down (o.backMem)
  const mw=440,mx=cx-mw/2,my=cy+190;
  if(mem>0)ag_reach(ctx,[cx,cy+r*0.92,cx,cy+r+30,cx,my-30,cx,my-4],ag_sine(clamp(mem*1.4,0,1)),{data:o.backMem||0,grip:1});
  ag_model(ctx,cx,cy,r,{t,core:o.core==null?1:o.core,think:o.think||0,label:o.label});
  CM_CTX.forEach((k,i)=>{const u=clamp(show(i),0,1);if(u<=0)return;ag_textCard(ctx,k.x,k.y,CM_KW,{kick:k.kick,title:k.title,sub:k.sub},{a:clamp(u*2,0,1),k:clamp(ag_spr(u,0,0.5),0,1.2),kickCol:AG.blue});
    if(gov>0)cm_govMark(ctx,k.x+CM_KW-44,k.y+44,clamp(gov*1.6-i*0.15,0,1));});
  if(mem>0){ag_textCard(ctx,mx,my,mw,{kick:"Memory",sub:"The session it's in, and what the team keeps"},{a:clamp(mem*2,0,1),k:clamp(ag_spr(mem,0,0.5),0,1.2),kickCol:AG.blue});
    if(gov>0)cm_govMark(ctx,mx+mw-44,my+44,clamp(gov*1.6-0.6,0,1));}
  ctx.restore();}
// the mark of something governed: a small green tick in a ring
function cm_govMark(ctx,x,y,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const k=Math.min(1,ag_spr(a,0,0.5));ag_about(ctx,x,y,lerp(0.4,1,k));
  ctx.fillStyle="rgba(244,246,242,0.95)";ctx.beginPath();ctx.arc(x,y,20,0,TAU);ctx.fill();ctx.strokeStyle=rgba(AG.green,0.9);ctx.lineWidth=2.6;ctx.stroke();ag_tick(ctx,x,y+1,18,rgba(AG.green,1),3.4);ctx.restore();}

const CM_GOV={rows:["Code","Metadata","Skills","Tools","Memory"],cols:["Owner","Read, change","Review","Keeping","Deleting"],lab:330,cw:236,rh:70,hh:84};
function cm_govTable(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const G=CM_GOV,w=G.lab+G.cols.length*G.cw,rows=G.rows.length+(o.chat?1:0),h=G.hh+rows*G.rh+16;
  ctx.save();ctx.globalAlpha*=a;ag_box(ctx,x,y,w,h,22,{});
  G.cols.forEach((c,j)=>{const lit=o.cols?o.cols[j]||0:0,cx=x+G.lab+j*G.cw;if(lit>0){ctx.fillStyle=rgba(AG.blue,0.1*lit);rr(ctx,cx+6,y+10,G.cw-12,h-20,14);ctx.fill();}
    ag_T(ctx,c,cx+G.cw/2,y+56,{w:700,size:28,align:"center",col:mix(AG.mut,AG.blue,lit)});});
  ctx.strokeStyle="rgba(60,50,40,0.12)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+20,y+G.hh);ctx.lineTo(x+w-20,y+G.hh);ctx.stroke();
  G.rows.forEach((r,i)=>{const ry=y+G.hh+i*G.rh,ra=o.rowA?o.rowA[i]:1;if(ra<=0)return;ctx.save();ctx.globalAlpha*=ra;ag_T(ctx,r.toUpperCase(),x+30,ry+46,{w:700,size:28,ls:4,col:AG.blue});
    G.cols.forEach((c,j)=>{const v=o.cells?o.cells(i,j):0;if(v>0){const cx=x+G.lab+j*G.cw+G.cw/2;ctx.save();ctx.globalAlpha*=clamp(v,0,1);ag_tick(ctx,cx,ry+36,24,rgba(AG.green,1),4);ctx.restore();}});
    ctx.restore();});
  if(o.chat){const ry=y+G.hh+G.rows.length*G.rh,ca=o.chat;ctx.save();ctx.globalAlpha*=ca;ctx.strokeStyle="rgba(60,50,40,0.12)";ctx.beginPath();ctx.moveTo(x+20,ry+4);ctx.lineTo(x+w-20,ry+4);ctx.stroke();
    cm_bubble(ctx,x+46,ry+36,rgba(AG.amber,1));ag_T(ctx,"A note in a chat",x+80,ry+46,{w:600,size:28,col:AG.ink});
    G.cols.forEach((c,j)=>{const v=o.chatCell?o.chatCell(j):1;if(v<=0)return;const cx=x+G.lab+j*G.cw+G.cw/2;ctx.save();ctx.globalAlpha*=v;ag_T(ctx,"?",cx,ry+48,{w:800,size:34,align:"center",col:AG.amber});ctx.restore();});ctx.restore();}
  ctx.restore();return{x,y,w,h};}
function cm_bubble(ctx,x,y,col){ctx.save();ctx.strokeStyle=col;ctx.lineWidth=3;ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(x-16,y-12);ctx.lineTo(x+16,y-12);ctx.quadraticCurveTo(x+20,y-12,x+20,y-8);
  ctx.lineTo(x+20,y+6);ctx.quadraticCurveTo(x+20,y+10,x+16,y+10);ctx.lineTo(x-4,y+10);ctx.lineTo(x-12,y+17);ctx.lineTo(x-11,y+10);ctx.lineTo(x-16,y+10);ctx.quadraticCurveTo(x-20,y+10,x-20,y+6);
  ctx.lineTo(x-20,y-8);ctx.quadraticCurveTo(x-20,y-12,x-16,y-12);ctx.stroke();ctx.restore();}

/* the nine films of Agents at work on data and their lessons, as their briefs (4 November 2026) and end cards give them */
const CM_LESSONS=[["Context engineering","Write it down once, and people and agents both use it."],
  ["Skills and workflows","Solve it once, write it down, reuse it."],
  ["Tools are hands, and every hand is a permission","Read-only by default. Write only drafts, somewhere safe."],
  ["Memory: from one chat to the team","Let the agent learn from the team, not from one person."],
  ["Plan, define the check, do, check","Decide how you'll check before the agent starts."],
  ["How it goes wrong","Expect these, and design for them."],
  ["Working with agents on Databricks","The platform gives agents the same data and tools people use, in one place."],
  ["Why Unity Catalog and Unity Gateway govern them","One set of rules for people and agents, enforced where the data and the models live."],
  ["Context and memory, governed","The team's context and memory are governed assets, not private notes."]];
const CM_GRID={x:80,y:110,w:568,gx:28,gy:22};
// the cards' sizes: each row as tall as its tallest card
function cm_gridLayout(ctx){const G=CM_GRID,cells=[];const meas=CM_LESSONS.map(l=>({tl:cm_wrap(ctx,l[0],G.w-56,{w:600,size:28}),ll:cm_wrap(ctx,l[1],G.w-56,{w:700,size:30})}));
  let y=G.y;for(let r=0;r<3;r++){let h=0;for(let c=0;c<3;c++){const m=meas[r*3+c];h=Math.max(h,26+m.tl.length*36+14+m.ll.length*40+20);}
    for(let c=0;c<3;c++)cells.push({x:G.x+c*(G.w+G.gx),y,w:G.w,h,tl:meas[r*3+c].tl,ll:meas[r*3+c].ll});y+=h+G.gy;}
  return cells;}
function cm_lessons(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const cells=cm_gridLayout(ctx),deco=o.deco?1:0;ctx.save();ctx.globalAlpha*=a;
  // o.slots: the nine places, dashed, each going as its lesson comes in
  if(o.slots>0)cells.forEach((c,i)=>{const s=o.show?o.show(i):1;cm_dash(ctx,c.x,c.y,c.w,c.h,20,AG.mut,o.slots*0.7*(1-clamp(s*2,0,1)));});
  cells.forEach((c,i)=>{const s=o.show?o.show(i):1;if(s<=0)return;const k=Math.min(1.03,ag_spr(s,0,0.55));ctx.save();ctx.globalAlpha*=clamp(s*2,0,1);ag_about(ctx,c.x+c.w/2,c.y+c.h/2,lerp(0.85,1,clamp(k,0,1.1)));
    const last=i===8;ag_box(ctx,c.x,c.y,c.w,c.h,20,{edge:last?AG.blue:null,edgeA:0.7});
    let yy=c.y+26;c.tl.forEach((l,j)=>{yy+=(j?36:26);ag_T(ctx,l,c.x+28,yy,{w:600,size:28,col:AG.mut,deco});});yy+=14;
    c.ll.forEach((l,j)=>{yy+=(j?40:38);ag_T(ctx,l,c.x+28,yy,{w:700,size:30,col:AG.ink,deco});});ctx.restore();});
  ctx.restore();return cells;}
// the grid's bounds, for moving it into its place on the road
function cm_gridBox(ctx){const c=cm_gridLayout(ctx),l=c[c.length-1];return{x:CM_GRID.x,y:CM_GRID.y,w:l.x+l.w-CM_GRID.x,h:l.y+l.h-CM_GRID.y};}

/* the module's road, seen from further off: an oak rail, and on it the four series of AI agents in data work, the two that are made
   with their nine films, the two still to come in a dashed outline */
const CM_ROAD={y:676,shelves:[["What an agent is",1],["Agents at work on data",1],["From helper to colleague",0],["A colleague that isn't a person",0]],x:84,w:408,gap:32,top:300,h:320};
function cm_shelf(i){const R=CM_ROAD;return{x:R.x+i*(R.w+R.gap),y:R.top,w:R.w,h:R.h};}
function cm_shelves(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const R=CM_ROAD;ctx.save();ctx.globalAlpha*=a;
  // the rail, and its arrow onward
  const x0=40,x1=1880,y=R.y;ctx.save();ctx.shadowColor="rgba(46,38,28,0.25)";ctx.shadowBlur=14;ctx.shadowOffsetX=AG.sdx;ctx.shadowOffsetY=8;
  const g=ctx.createLinearGradient(0,y,0,y+22);g.addColorStop(0,rgba(mix(AG_OAK.base,[255,255,255],0.2),1));g.addColorStop(1,rgba(AG_OAK.dark,1));ctx.fillStyle=g;rr(ctx,x0,y,x1-x0-30,22,6);ctx.fill();ctx.restore();
  ctx.strokeStyle=rgba(AG_OAK.hi,0.9);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0+6,y+1.5);ctx.lineTo(x1-36,y+1.5);ctx.stroke();ag_arrowHead(ctx,x1-16,y+11,0,22,rgba(AG_OAK.dark,1));
  R.shelves.forEach((s,i)=>{const b=cm_shelf(i),made=s[1],sa=o.shelfA?o.shelfA(i):1;if(sa<=0)return;ctx.save();ctx.globalAlpha*=sa;
    const lit=o.lit===i?(o.litA==null?1:o.litA):0;
    if(made){ag_box(ctx,b.x,b.y,b.w,b.h,22,{});}
    else{ctx.fillStyle="rgba(250,249,246,0.5)";rr(ctx,b.x,b.y,b.w,b.h,22);ctx.fill();cm_dash(ctx,b.x-5,b.y-5,b.w+10,b.h+10,26,lit>0?mix(AG.mut,AG.blue,lit):AG.mut,1);}
    if(lit>0){ctx.save();ctx.shadowColor=rgba(AG.blue,0.6*lit);ctx.shadowBlur=26;ctx.strokeStyle=rgba(AG.blue,0.8*lit);ctx.lineWidth=3;rr(ctx,b.x,b.y,b.w,b.h,22);ctx.stroke();ctx.restore();}
    const tl=cm_wrap(ctx,s[0],b.w-48,{w:700,size:30});tl.forEach((l,j)=>ag_T(ctx,l,b.x+24,b.y+50+j*38,{w:700,size:30,col:made?AG.ink:AG.mut}));
    // a made series: its nine films, as small cards (decoration: the voice and the titles say what they are)
    if(made&&!(i===1&&o.skip2)){for(let k=0;k<9;k++){const cx=b.x+28+(k%3)*120,cy=b.y+132+(k/3|0)*58;ctx.save();ctx.shadowColor="rgba(46,38,28,0.14)";ctx.shadowBlur=8;ctx.shadowOffsetY=3;
        ctx.fillStyle="#EEEBE5";rr(ctx,cx,cy,110,48,8);ctx.fill();ctx.restore();ctx.strokeStyle=AG.card.edge;ctx.lineWidth=1;rr(ctx,cx,cy,110,48,8);ctx.stroke();
        ctx.fillStyle="rgba(86,92,100,0.22)";rr(ctx,cx+12,cy+14,70,7,3.5);ctx.fill();rr(ctx,cx+12,cy+28,52,7,3.5);ctx.fill();}}
    // the oak post from the shelf down to the rail
    ctx.fillStyle=rgba(AG_OAK.dark,0.8);ctx.fillRect(b.x+b.w/2-5,b.y+b.h,10,R.y-b.y-b.h);ctx.restore();});
  ctx.restore();}
