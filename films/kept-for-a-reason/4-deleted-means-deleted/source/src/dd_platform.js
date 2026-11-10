/* ===== Deleted means deleted: the university's hall and its platform =====
   The places of the university, painted once in the module's hall (hall.js): ddHall, the hall at night, the platform a tall block of
   clear glass on the right with one lit door, and across the hall on the left a smaller block, "a place apart", its door shut, where
   the locked copies are; ddInside, inside the platform, where its pages stand as panes; ddVault, deeper in it, the cold archive under
   heavier frost. What is shown on them is drawn live with the kit's glass (glass.js, pages.js): the tables as Databricks' pages, the
   table's history, its files as small tablets of glass (the opening's tablets, made of the module's glass), queries and code, the
   lineage, the mailing tool, the copies, the archive's boxes, the logs, the agent's trace, the ticket and the timeline.
   Every top-level name starts with dd_ or DD_. */

/* ---------------------------------------------------------------- the places */
// the platform: a tall block of clear glass, its edges lit, a few lights inside, and one lit door at its foot
function dd_block(c,x,y,w,h,o){o=o||{};const ice=DP.ice,cy=DP.F.cyan;c.save();
  const g=c.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,"rgba(150,220,225,0.10)");g.addColorStop(0.5,"rgba(150,220,225,0.03)");g.addColorStop(1,"rgba(150,220,225,0.08)");c.fillStyle=g;c.fillRect(x,y,w,h);
  if(o.frosted){c.save();c.beginPath();c.rect(x,y,w,h);c.clip();dp_blurDraw(c,c.canvas,x-20,y-20,w+40,h+40,x-20,y-20,w+40,h+40,14);c.fillStyle="rgba(150,215,220,0.08)";c.fillRect(x,y,w,h);c.restore();}
  // floors inside, faint, and small lights on them
  const R=ag_rnd(o.seed||5);for(let k=1;k<(o.floors||6);k++){const fy=y+h*k/(o.floors||6);c.fillStyle="rgba(170,235,240,0.07)";c.fillRect(x+6,fy,w-12,1.5);
    for(let i=0;i<(o.lights==null?5:o.lights);i++){const lx=x+20+R()*(w-40),r=6+R()*16,lg=c.createRadialGradient(lx,fy-14,0,lx,fy-14,r);lg.addColorStop(0,rgba(R()<0.25?DP.F.violet:cy,0.35));lg.addColorStop(1,rgba(cy,0));c.fillStyle=lg;c.fillRect(lx-r,fy-14-r,2*r,2*r);}}
  c.shadowColor=rgba(cy,0.8);c.shadowBlur=14;c.fillStyle=rgba(mix(cy,[255,255,255],0.5),0.9);c.fillRect(x,y,w,2.4);c.fillRect(x,y,2.4,h);c.fillRect(x+w-2.4,y,2.4,h);c.shadowBlur=0;
  c.fillStyle=rgba(ice,0.18);c.fillRect(x+w*0.08,y,2,h);
  // its door: lit from inside, or shut
  if(o.door){const [dx,dw,dh]=o.door,dy=y+h-dh;if(o.shut){c.fillStyle="rgba(10,30,36,0.9)";c.fillRect(dx,dy,dw,dh);c.strokeStyle=rgba(cy,0.55);c.lineWidth=2;c.strokeRect(dx,dy,dw,dh);c.fillStyle=rgba(cy,0.5);c.fillRect(dx+dw-16,dy+dh*0.55,4,18);}
    else{const dg=c.createLinearGradient(0,dy,0,dy+dh);dg.addColorStop(0,"rgba(200,250,250,0.85)");dg.addColorStop(1,"rgba(120,230,240,0.55)");c.fillStyle=dg;c.fillRect(dx,dy,dw,dh);
      c.save();c.globalCompositeOperation="lighter";const lg=c.createRadialGradient(dx+dw/2,dy+dh,0,dx+dw/2,dy+dh,dh*1.6);lg.addColorStop(0,"rgba(120,230,240,0.28)");lg.addColorStop(1,"rgba(120,230,240,0)");c.fillStyle=lg;c.fillRect(dx-dh*1.6,dy-dh*0.6,dw+dh*3.2,dh*2.4);c.restore();}}
  // its gloss on the floor
  const rg=c.createLinearGradient(0,y+h,0,y+h+h*0.25);rg.addColorStop(0,"rgba(120,220,230,0.10)");rg.addColorStop(1,"rgba(120,220,230,0)");c.fillStyle=rg;c.fillRect(x,y+h,w,h*0.25);
  c.restore();}
const DD_HALL={platform:[1236,150,500,650],door:[1436,104,190],apart:[150,420,300,330],apartDoor:[256,90,150]};
AG_PLACES.ddHall=c=>dp_paintHall(c,{seed:21,horizon:690,vx:900,panes:7,pools:[[420,980,520,0.12],[1180,900,520,0.09],[300,800,360,0.06]],after:c=>{
  const [px,py,pw,ph]=DD_HALL.platform,[ax,ay,aw,ah]=DD_HALL.apart;
  dd_block(c,ax,ay,aw,ah,{frosted:true,floors:3,lights:1,seed:9,door:[DD_HALL.apartDoor[0],DD_HALL.apartDoor[1],DD_HALL.apartDoor[2]],shut:true});
  dd_block(c,px,py,pw,ph,{floors:7,lights:6,seed:5,door:[DD_HALL.door[0],DD_HALL.door[1],DD_HALL.door[2]]});}});
// inside the platform: the hall's dark, nearer panes of glass, a floor of light lines; where the pages stand
AG_PLACES.ddInside=c=>dp_paintHall(c,{seed:33,horizon:760,vx:960,lights:14,panes:5,haze:0.07,pools:[[960,900,900,0.07],[320,960,420,0.08],[1600,960,420,0.08]],after:c=>{
  c.save();for(const x of [60,1860]){const g=c.createLinearGradient(x-40,0,x+40,0);g.addColorStop(0,"rgba(150,220,225,0)");g.addColorStop(0.5,"rgba(150,220,225,0.10)");g.addColorStop(1,"rgba(150,220,225,0)");c.fillStyle=g;c.fillRect(x-40,0,80,760);
    c.fillStyle=rgba(DP.ice,0.3);c.fillRect(x,0,2,760);}c.restore();}});
// deeper in the platform, the cold archive: a quieter, colder hall under heavier frost
AG_PLACES.ddVault=c=>dp_paintHall(c,{seed:57,horizon:800,vx:960,lights:10,panes:8,haze:0.12,pools:[[960,960,900,0.06],[360,980,420,0.07]],after:c=>{
  c.save();c.globalCompositeOperation="multiply";c.fillStyle="rgb(196,218,236)";c.fillRect(0,0,W,H);
  // a cold light from above, where the archive's boxes stand, and frost on the panes' feet
  c.globalCompositeOperation="lighter";let g=c.createRadialGradient(1060,520,40,1060,520,820);g.addColorStop(0,"rgba(150,205,235,0.16)");g.addColorStop(1,"rgba(150,205,235,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  g=c.createLinearGradient(0,620,0,820);g.addColorStop(0,"rgba(190,230,245,0)");g.addColorStop(1,"rgba(190,230,245,0.07)");c.fillStyle=g;c.fillRect(0,620,W,200);c.restore();
  g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgba(170,220,240,0.10)");g.addColorStop(1,"rgba(170,220,240,0)");c.fillStyle=g;c.fillRect(0,0,W,H);}});

/* ---------------------------------------------------------------- what is shown */
// words in the frame, for a close shot: drawn under the frame's own transform; the frost behind them is the place as the camera sees it
const DD_VIEWS={};
function dd_view(place,cam){let v=DD_VIEWS[place];if(!v)v=DD_VIEWS[place]={c:mkCanvas(480,270),key:""};const key=cam.x.toFixed(1)+","+cam.y.toFixed(1)+","+cam.z.toFixed(4);
  if(v.key!==key){v.key=key;const x=v.c.getContext("2d"),src=dp_place0(place),w=W/cam.z,h=H/cam.z;x.drawImage(src,cam.x-w/2,cam.y-h/2,w,h,0,0,480,270);
    if(DD_WARM[place]){x.fillStyle=DD_WASH;x.fillRect(0,0,480,270);}DP_FROSTED.delete(v.c);}return v.c;}
// the opening story's rooms are lit by a lamp and the sun: glass there is smoked, darker than the room, so its words read on it
const DD_WARM={ddRoom:1,ddAshur:1,ddRoad:1},DD_WASH="rgba(14,8,4,0.7)",DD_DARK={};
// a whole warm place, smoked, for glass drawn under the shot's camera (behind: dd_dark(place))
function dd_dark(place){let c=DD_DARK[place];if(c)return c;c=DD_DARK[place]=mkCanvas(480,270);const x=c.getContext("2d");x.imageSmoothingQuality="high";
  x.drawImage(dp_place0(place),0,0,W,H,0,0,480,270);x.fillStyle=DD_WASH;x.fillRect(0,0,480,270);return c;}
function dd_scr(ctx,S,fn){ctx.save();setScreen(ctx,S);fn();ctx.restore();}
// a phase: 0 before t0, rising to 1 over d
const dd_k=(t,t0,d)=>clamp((t-t0)/(d||0.5),0,1);
// in at t0, out at t1 (each over d)
const dd_io=(t,t0,t1,d)=>ag_in(t,t0,d||0.4)*(1-ag_in(t,t1,d||0.4));
// a card that springs in at t0 (and out at t1): its box
function dd_cardAt(ctx,x,y,w,words,t,t0,t1,o){o=o||{};const a=t1==null?ag_in(t,t0,0.4):dd_io(t,t0,t1,0.4);if(a<=0)return null;return dp_card(ctx,x,y,w,words,Object.assign({col:"cyan"},o,{a:a*(o.a==null?1:o.a),k:Math.min(1,ag_spr(t,t0,0.5))}));}
// a pill that comes in at t0: o.align, o.size, out at t1
function dd_pillAt(ctx,x,y,text,col,t,t0,t1,o){o=o||{};const a=t1==null?ag_in(t,t0,0.35):dd_io(t,t0,t1,0.35);if(a<=0)return;ctx.save();const k=Math.min(1.04,ag_spr(t,t0,0.45));
  ag_about(ctx,x,y-12,lerp(0.7,1,Math.min(1,k)));dp_pill(ctx,x,y,text,col,Object.assign({},o,{a:a*(o.a==null?1:o.a)}));ctx.restore();}

/* a data file, drawn as a small tablet of glass: lines for its rows, one of them hers (violet), which a mark can say is deleted.
   o: a, mine (0 to 1, her line shows), mark (0 to 1, a coral mark beside her line), grey (0 to 1, an old file stepping back),
   crack (0 to 1, it breaks into shards that fade), lines (how many rows), behind */
function dd_file(ctx,x,y,s,o){o=o||{};const a=(o.a==null?1:o.a)*(1-clamp(o.crack||0,0,1));if(a<=0.003)return;const w=96*s,h=120*s,cr=o.crack||0,g=o.grey||0;ctx.save();ctx.globalAlpha*=a;
  if(cr>0){// the cracked file: four pieces parting
    const e=ag_eo(cr);[[0,0,0.55,0.5,-1,-1],[0.55,0,0.45,0.55,1,-1],[0,0.5,0.5,0.5,-1,1],[0.5,0.55,0.5,0.45,1,1]].forEach(([px,py,pw,ph,dx,dy])=>{ctx.save();ctx.translate(dx*22*s*e,dy*14*s*e+30*s*e*e);ctx.rotate(dx*0.18*e);
      ctx.beginPath();ctx.rect(x-w/2+px*w,y-h+py*h,pw*w,ph*h);ctx.clip();dd_fileBody(ctx,x,y,w,h,s,o,g);ctx.restore();});}
  else dd_fileBody(ctx,x,y,w,h,s,o,g);
  ctx.restore();}
function dd_fileBody(ctx,x,y,w,h,s,o,g){dp_panel(ctx,x-w/2,y-h,w,h,{col:g>0.5?"grey":"cyan",r:14*s,glowA:0.6*(1-g*0.6),glowR:22,behind:o.behind});
  const n=o.lines||5,mine=o.mine||0;for(let i=0;i<n;i++){const ly=y-h+h*0.2+i*h*0.62/(n-1),her=i===2&&mine>0;ctx.fillStyle=her?rgba(DP.F.violet,0.25+0.75*mine):rgba(DP.T.mut,0.55*(1-g*0.5));
    rr(ctx,x-w/2+w*0.16,ly-3*s,w*0.68*(i===n-1?0.6:1),6*s,3*s);ctx.fill();}
  if(o.mark>0){const mx=x+w/2-8*s,my=y-h+h*0.2+2*h*0.62/(n-1);ctx.save();ctx.globalAlpha*=o.mark;ctx.strokeStyle=rgba(DP.F.coral,1);ctx.lineWidth=3*s;ctx.shadowColor=rgba(DP.F.coral,0.8);ctx.shadowBlur=8;
    ctx.beginPath();ctx.moveTo(x-w/2+w*0.12,my);ctx.lineTo(x-w/2+w*0.12+w*0.76*ag_sine(o.mark),my);ctx.stroke();ctx.restore();}
  if(g>0){ctx.fillStyle="rgba(6,16,20,"+(0.45*g).toFixed(3)+")";rr(ctx,x-w/2,y-h,w,h,14*s);ctx.fill();}}

/* a table as Databricks shows it, drawn: a page with the tool's logo and name, the table's name, its columns and rows.
   rows: [{cells: [...], a, dx, dash}]: a row can fade (a), slide out (dx) or be dashed (a row that would come back) */
function dd_tablePage(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return null;const box=dp_page(ctx,x,y,w,h,{tool:"databricks",name:"Databricks",where:o.where||"Catalog",title:null,a,behind:o.behind});
  ctx.save();ctx.globalAlpha*=a;dp_T(ctx,o.name,x+32,y+76+56,{w:500,size:30,f:"mono"});const cols=o.cols,top=y+76+84;let cx=x+32;
  cols.forEach(c=>{dp_T(ctx,c.t,cx,top+32,{w:700,size:28,col:"mut"});cx+=c.w;});ctx.fillStyle=rgba(DP.T.mut,0.4);ctx.fillRect(x+32,top+46,w-64,1.4);
  (o.rows||[]).forEach((r,j)=>{const ra=r.a==null?1:r.a;if(ra<=0)return;const ry=top+46+(j+1)*56-14+(r.dy||0);ctx.save();ctx.globalAlpha*=ra;ctx.translate(r.dx||0,0);
    if(r.dash){ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(DP.F.coral,0.9);ctx.lineWidth=2;rr(ctx,x+20,ry-38,w-40,52,10);ctx.stroke();ctx.restore();}
    if(r.hl){ctx.save();ctx.globalAlpha*=r.hl;ctx.fillStyle=rgba(DP.F.violet,0.16);rr(ctx,x+20,ry-38,w-40,52,10);ctx.fill();ctx.restore();}
    let cx2=x+32;r.cells.forEach((cell,i)=>{const cw=cols[i].w;if(cell&&cell.chip){dp_pill(ctx,cx2,ry,cell.chip,cell.col||"violet",{size:28,glow:8});}
      else if(cell!=null){const t=typeof cell==="string"?cell:cell.t;dp_T(ctx,t,cx2,ry,{w:500,size:28,f:"mono",col:typeof cell==="string"?"ink":(cell.col||"ink")});}cx2+=cw;});ctx.restore();});
  ctx.restore();return box;}
// a short card of lines of code (mono), each [text, colour]; hl [line, from, to] lights part of a line; p (0 to 1) types the lines in
function dd_code(ctx,x,y,w,lines,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return null;const lh=44,h=lines.length*lh+56+(o.head?50:0);ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,Math.min(1,o.k)));
  dp_panel(ctx,x,y,w,h,{col:o.col||"cyan",r:18,behind:o.behind,glowR:30});let yy=y+28+(o.head?50:0);
  if(o.head){if(o.tool&&typeof LOGO!=="undefined"&&LOGO[o.tool]&&LOGO[o.tool].width){const im=LOGO[o.tool],lh2=32;ctx.drawImage(im,x+28,y+18,lh2*im.width/im.height,lh2);dp_T(ctx,o.head,x+36+lh2*im.width/im.height,y+46,{w:700,size:28,col:"mut"});}
    else dp_T(ctx,o.head,x+28,y+46,{w:700,size:28,col:"mut"});ctx.fillStyle=rgba(DP.T.mut,0.3);ctx.fillRect(x+20,y+64,w-40,1.2);}
  const p=o.p==null?1:o.p,n=lines.length;lines.forEach((l,i)=>{const [txt,col]=Array.isArray(l)?l:[l,"ink"],u=clamp(p*n-i,0,1);if(u<=0)return;const shown=u<1?txt.slice(0,Math.ceil(txt.length*u)):txt,by=yy+i*lh+30;
    if(o.hl&&o.hl[0]===i&&o.hlA>0){const pre=dp_tw(ctx,txt.slice(0,o.hl[1]),{w:500,size:28,f:"mono"}),mid=dp_tw(ctx,txt.slice(o.hl[1],o.hl[2]),{w:500,size:28,f:"mono"});
      ctx.save();ctx.globalAlpha*=o.hlA;ctx.fillStyle=rgba(DP.F.cyan,0.22);ctx.strokeStyle=rgba(DP.F.cyan,0.9);ctx.lineWidth=2;rr(ctx,x+26+pre,by-30,mid+12,40,8);ctx.fill();ctx.stroke();ctx.restore();}
    dp_T(ctx,shown,x+32,by,{w:500,size:28,f:"mono",col:col||"ink"});});
  ctx.restore();return{x,y,w,h};}
// the history beside a table: "History", and its lines, each [text, colour], typed in by p
function dd_history(ctx,x,y,w,lines,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const h=86+lines.length*44;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,Math.min(1,o.k)));
  dp_panel(ctx,x,y,w,h,{col:"cyan",r:18,behind:o.behind,glowR:30});dp_T(ctx,"HISTORY",x+28,y+48,{w:800,size:28,ls:4,col:"cyan"});
  lines.forEach((l,i)=>{const [txt,col,p]=l,u=p==null?1:p;if(u<=0)return;dp_T(ctx,u<1?txt.slice(0,Math.ceil(txt.length*u)):txt,x+28,y+100+i*44,{w:600,size:28,col:col||"ink"});});ctx.restore();}

/* the badge of the deletion job: its own identity, owned by Sam (dp_badge, with a workload's gear) */
function dd_jobBadge(ctx,x,y,o){o=o||{};dp_badge(ctx,x,y,600,372,{kind:"Job",chip:false,title:"privacy-deleter",lines:[["owned by Sam Okafor"],["every night at 01:00"]],t:o.t,pic:(c,cx,cy)=>dp_gearPic(c,cx,cy,"cyan"),
  a:o.a,behind:o.behind,mrz:"JOB<<PRIVACY<DELETER<<<<<<<<<<<<<<"});}

/* a copy in the place apart: a slab of glass with a lock and its days; mine (0 to 1) shows her row in it, frosted violet */
function dd_copy(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.003)return;const w=o.w||250,h=o.h||82;ctx.save();ctx.globalAlpha*=a;
  dp_panel(ctx,x,y,w,h,{col:o.col||"cyan",r:14,behind:o.behind,glowR:22,glowA:0.7});dp_lock(ctx,x+38,y+h/2+2,36,"cyan",0);
  for(let i=0;i<3;i++){ctx.fillStyle=i===1&&o.mine>0?rgba(DP.F.violet,0.3+0.7*o.mine):rgba(DP.T.mut,0.45);rr(ctx,x+70,y+20+i*17,(w-96)*(i===2?0.6:1),6,3);ctx.fill();}
  if(o.label)dp_T(ctx,o.label,x+w+18,y+h/2+10,{w:600,size:28,col:o.labelCol||"mut"});ctx.restore();}

/* a box of the cold archive: a year's pay records, under heavy frost; its year on it, the records as chips in it */
function dd_box(ctx,x,y,w,h,year,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.003)return;ctx.save();ctx.globalAlpha*=a;
  dp_frost(ctx,x,y,w,h,null,{col:"violet2",r:16,behind:o.behind});dp_T(ctx,year,x+24,y+44,{w:700,size:30,col:"ink"});ctx.restore();}
// a record's chip: its contract number, in a small slip
function dd_chip(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.003)return;ctx.save();ctx.globalAlpha*=a;dp_slip(ctx,x,y,text,o.col||"violet2",{size:28,ink:true,behind:o.behind});ctx.restore();}

/* the timeline of the end: dates along a line, each ticking green as it passes */
function dd_timeline(ctx,x0,x1,y,marks,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const c=DP.F.cyan;
  ctx.strokeStyle=rgba(c,0.8);ctx.lineWidth=2.4;ctx.shadowColor=rgba(c,0.8);ctx.shadowBlur=8;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(lerp(x0,x1,ag_sine(o.draw==null?1:o.draw)),y);ctx.stroke();ctx.shadowBlur=0;
  marks.forEach(m=>{const k=ag_in(t,m.t0,0.4);if(k<=0)return;ctx.save();ctx.globalAlpha*=k;dp_T(ctx,m.text,m.x,y-34,{w:700,size:32,align:"center"});
    if(m.tick!=null&&t>=m.tick)dp_tick(ctx,m.x,y,"green",clamp((t-m.tick)/0.5,0,1));else{ctx.fillStyle=rgba(DP.F.cyan,1);ctx.beginPath();ctx.arc(m.x,y,8,0,TAU);ctx.fill();}ctx.restore();});ctx.restore();}
