/* ===== Copies that keep the rules: the hall's pieces =====
   The film's own pieces for the chapters in the hall, prefixed cp_, drawn with the module's kit as it is (glass.js, hall.js, pages.js):
     cpHall       the hall, with pools of light where people stand, on the left and on the right
     cp_record    one row of a table on a card: each column, its value and its class's gold chip (as Show the least and Proof it held
                  show classes); a value can turn into what a reader is shown (*** where a policy masks it whole)
     cp_agree     an agreement's card: its number on a band, its sub-title, then its lines, each a label and its words
     cp_hospital  the teaching hospital, a building drawn in light with an "H" over its door, never a red cross (an emblem the law keeps
                  for the medical services of armed forces and the Red Cross)
     cp_thumb     a small window on a place of the opening (the cave, Lascaux II), where the film comes back to the story
     cp_who       a person's name and role, beside them; for Elena, who isn't drawn, a card with a person drawn in light
     cp_cols      the names of a table's columns over frosted rows: what a clean room lets the other side see
     cp_code      lines as a tool writes them (code, settings), in the mono face
     cp_laptop    a laptop with a file on its screen, for a download
     cp_phone     a phone held up to a screen, for a photo of one
     cp_strike    a coral line drawn through what isn't made
   Every word is at least 28 px and nothing goes below y 890. */

AG_PLACES.cpHall=c=>dp_paintHall(c,{seed:16,horizon:700,vx:1000,pools:[[330,980,520,0.11],[1610,980,520,0.11],[960,800,760,0.06]]});

const CP_GOLD=[236,182,62];
// a class's chip, gold, its words dark; y is the words' baseline; returns its width
function cp_chip(ctx,x,y,cls,o){o=o||{};return dp_pill(ctx,x,y,cls,CP_GOLD,{size:28,glow:8,a:o.a,align:o.align});}

/* cp_record(ctx, x, y, {name, rows, w, col, a, k, behind, cw, sub}): rows [{c, v, v2, u, cls, ca, vc, v2c, a}]: the column c (mono), its
   value v, turning into v2 as u goes from 0 to 1, each in its colour (vc, v2c: a meaning's key), and its class cls on a gold chip at ca;
   name is the table's name, in the mono face; cw where the values start; returns its box */
function cp_record(ctx,x,y,o){o=o||{};const w=o.w||900,lh=58,rows=o.rows||[],top=o.sub?120:86,h=top+rows.length*lh+18,bb={x,y,w,h},a=o.a==null?1:o.a;
  if(a<=0||o.measure)return bb;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  dp_panel(ctx,x,y,w,h,{col:o.col||"cyan",r:20,behind:o.behind,glowR:36});
  dp_T(ctx,o.name,x+30,y+54,{w:500,size:28,f:"mono",col:o.nameCol||o.col||"cyan"});
  if(o.sub)dp_T(ctx,o.sub,x+30,y+96,{w:600,size:28,col:"mut"});
  ctx.fillStyle=rgba(DP.T.mut,0.35);ctx.fillRect(x+24,y+top-6,w-48,1.4);
  const cw=o.cw==null?300:o.cw;
  rows.forEach((r,i)=>{const by=y+top+i*lh+40,ra=r.a==null?1:r.a;if(ra<=0)return;ctx.save();ctx.globalAlpha*=ra;
    dp_T(ctx,r.c,x+30,by,{w:500,size:28,f:"mono",col:"mut"});
    const u=clamp(r.u||0,0,1);
    if(r.v!=null&&u<1)dp_T(ctx,r.v,x+30+cw,by,{w:600,size:28,col:r.vc||"ink",a:1-u});
    if(r.v2!=null&&u>0)dp_T(ctx,r.v2,x+30+cw,by,{w:600,size:28,col:r.v2c||"violet",a:u});
    if(r.cls&&(r.ca==null||r.ca>0))cp_chip(ctx,x+w-28,by,r.cls,{a:r.ca==null?1:r.ca,align:"right"});
    ctx.restore();});
  ctx.restore();return bb;}

/* cp_agree(ctx, x, y, w, {kind, sub, lines, lw, a, k, behind, hi}): an agreement, its number on a band of the identity's cyan (who may),
   its sub-title, then lines [label, words, colour], the labels lw wide; hi [index, 0 to 1] lights one line; returns its box */
function cp_agree(ctx,x,y,w,o){o=o||{};const lw=o.lw==null?170:o.lw,inner=w-60-lw,L=[];let yy=y+62+(o.sub?52:12);
  (o.lines||[]).forEach((l,i)=>{const ws=ag_wrap(ctx,l[1],inner,{w:600,size:28});ws.forEach((s,j)=>{yy+=j?38:46;L.push([j?"":l[0],s,l[2],yy,i]);});});
  const h=Math.round(yy-y+28),bb={x,y,w,h},a=o.a==null?1:o.a;if(a<=0||o.measure)return bb;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  dp_panel(ctx,x,y,w,h,{col:"cyan",r:20,behind:o.behind,glowR:36});dp_band(ctx,x,y,w,62,20,"cyan",o.kind);
  if(o.sub)dp_T(ctx,o.sub,x+30,y+62+40,{w:600,size:28,col:"mut"});
  if(o.hi&&o.hi[1]>0){const rows=L.filter(l=>l[4]===o.hi[0]);if(rows.length){const y0=rows[0][3]-34,y1=rows[rows.length-1][3]+12;
    ctx.save();ctx.globalAlpha*=o.hi[1];rr(ctx,x+14,y0,w-28,y1-y0,10);ctx.fillStyle=rgba(dp_f(o.hiCol||"cyan"),0.16);ctx.fill();ctx.strokeStyle=rgba(dp_f(o.hiCol||"cyan"),0.9);ctx.lineWidth=2;ctx.stroke();ctx.restore();}}
  for(const [lab,s,col,by] of L){if(lab)dp_T(ctx,lab,x+30,by,{w:700,size:28,col:"mut"});dp_T(ctx,s,x+30+lw,by,{w:600,size:28,col:col||"ink"});}
  ctx.restore();return bb;}

// the teaching hospital: a building drawn in light, its windows lit, an "H" over its door, its name under it; 320 x 300
function cp_hospital(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,w=320,h=300;if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  dp_panel(ctx,x,y,w,h,{col:"cyan",r:22,behind:o.behind,glowR:36});
  const c=DP.F.cyan,li=mix(c,[255,255,255],0.45),cx=x+w/2,by=y+214;
  ctx.save();ctx.lineJoin="round";ctx.shadowColor=rgba(c,0.8);ctx.shadowBlur=10;ctx.strokeStyle=rgba(li,1);ctx.lineWidth=3;ctx.fillStyle=rgba(c,0.14);
  ctx.beginPath();ctx.rect(cx-110,by-120,220,120);ctx.fill();ctx.stroke();                     // the long block
  ctx.beginPath();ctx.rect(cx-44,by-162,88,162);ctx.fill();ctx.stroke();                       // the tower over the door
  ctx.shadowBlur=0;ctx.fillStyle=rgba([255,226,170],0.85);
  for(const sx of [-1,1])for(let r=0;r<3;r++)for(let k=0;k<2;k++){ctx.fillRect(cx+sx*(62+k*28)-9,by-104+r*32,18,18);}
  ctx.fillStyle=rgba(li,1);ctx.fillRect(cx-16,by-36,32,36);                                    // the door
  rr(ctx,cx-26,by-148,52,52,8);ctx.fillStyle=rgba(c,1);ctx.fill();                              // the sign, an H
  ctx.fillStyle=rgba(DP.on,1);ctx.fillRect(cx-14,by-138,8,32);ctx.fillRect(cx+6,by-138,8,32);ctx.fillRect(cx-6,by-126,12,8);
  ctx.restore();
  dp_T(ctx,"Teaching hospital",cx,y+h-30,{w:700,size:30,align:"center"});ctx.restore();return{x,y,w,h};}

/* cp_thumb(ctx, x, y, w, h, place, {view, draw, label, a, col}): a small window on a place; view [x, y, w, h] the part of it shown (the
   window's shape), draw(ctx) what's drawn over it, in the place's coordinates; label under it */
function cp_thumb(ctx,x,y,w,h,place,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const v=o.view||[0,0,W,H],col=dp_f(o.col||"cyan");ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ctx.save();ctx.shadowColor=rgba(col,0.35);ctx.shadowBlur=34;rr(ctx,x,y,w,h,16);ctx.fillStyle="rgb(6,16,20)";ctx.fill();ctx.restore();
  ctx.save();rr(ctx,x,y,w,h,16);ctx.clip();ctx.translate(x,y);ctx.scale(w/v[2],h/v[3]);ctx.translate(-v[0],-v[1]);ctx.drawImage(ag_place(place),0,0);if(o.draw)o.draw(ctx);ctx.restore();
  rr(ctx,x+1,y+1,w-2,h-2,16);ctx.strokeStyle=rgba(mix(col,[255,255,255],0.35),0.95);ctx.lineWidth=2.2;ctx.stroke();
  if(o.label)dp_slip(ctx,x+w/2,y+h+18,o.label,o.col||"cyan",{align:"center",ink:true,behind:o.behind});
  ctx.restore();}

// a person's name and role on a small panel (o.align "right" puts its right edge at x); returns its box
function cp_who(ctx,x,y,name,role,o){o=o||{};const w=Math.max(dp_tw(ctx,name,{w:700,size:30}),role?dp_tw(ctx,role,{w:600,size:28}):0)+48,h=role?104:70,
  x0=o.align==="right"?x-w:x,a=o.a==null?1:o.a,bb={x:x0,y,w,h};if(a<=0)return bb;ctx.save();ctx.globalAlpha*=a;
  dp_panel(ctx,x0,y,w,h,{col:"cyan",r:16,glowR:28,behind:o.behind});dp_T(ctx,name,x0+24,y+46,{w:700,size:30});if(role)dp_T(ctx,role,x0+24,y+84,{w:600,size:28,col:"mut"});
  ctx.restore();return bb;}
// a person who isn't drawn: a card with a person drawn in light, the name and the role; 600 wide
function cp_person(ctx,x,y,name,role,o){o=o||{};const w=o.w||600,h=168,a=o.a==null?1:o.a;if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  dp_panel(ctx,x,y,w,h,{col:"cyan",r:20,behind:o.behind,glowR:36});
  ctx.save();rr(ctx,x+24,y+20,128,128,14);ctx.fillStyle="rgba(6,26,32,0.9)";ctx.fill();ctx.clip();dp_personPic(ctx,x+88,y+94,"cyan");ctx.restore();
  rr(ctx,x+24.6,y+20.6,126.8,126.8,14);ctx.strokeStyle=rgba(DP.F.cyan,0.85);ctx.lineWidth=1.8;ctx.stroke();
  dp_T(ctx,name,x+180,y+74,{w:700,size:36});if(role)ag_wrap(ctx,role,w-210,{w:600,size:28}).forEach((s,i)=>dp_T(ctx,s,x+180,y+116+i*36,{w:600,size:28,col:"mut"}));
  ctx.restore();return{x,y,w,h};}

/* cp_cols(ctx, x, y, w, {name, sub, cols, col, a, k, lh}): a table as the other side of a clean room sees it: its owner, its name, and
   the names of its columns, each beside a frosted bar where its values would be; returns its box */
function cp_cols(ctx,x,y,w,o){o=o||{};const cols=o.cols||[],lh=o.lh||44,top=o.sub?112:72,h=top+cols.length*lh+14,a=o.a==null?1:o.a,bb={x,y,w,h};if(a<=0)return bb;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  dp_panel(ctx,x,y,w,h,{col:o.col||"cyan",r:18,behind:o.behind,glowR:30});
  dp_T(ctx,o.name,x+26,y+48,{w:700,size:30});if(o.sub)dp_T(ctx,o.sub,x+26,y+88,{w:500,size:28,f:"mono",col:"mut"});
  cols.forEach((c,i)=>{const by=y+top+i*lh+30;dp_T(ctx,c,x+26,by,{w:500,size:28,f:"mono",col:"cyan"});dp_frost(ctx,x+284,by-24,w-284-22,30,null,{r:8,behind:o.behind});});
  ctx.restore();return bb;}

// lines as a tool writes them: [text, colour], in the mono face, lh apart, the first's baseline at y; hi [index, 0 to 1] lights a line
function cp_code(ctx,x,y,lines,o){o=o||{};const lh=o.lh||46,a=o.a==null?1:o.a;if(a<=0)return y;ctx.save();ctx.globalAlpha*=a;
  lines.forEach((l,i)=>{const s=typeof l==="string"?l:l[0],col=typeof l==="string"?"ink":l[1]||"ink",la=typeof l==="string"?1:(l[2]==null?1:l[2]);if(la<=0)return;
    if(o.hi&&o.hi[0]===i&&o.hi[1]>0){ctx.save();ctx.globalAlpha*=o.hi[1];rr(ctx,x-14,y+i*lh-34,(o.w||800),lh,8);ctx.fillStyle=rgba(dp_f(o.hiCol||"green"),0.16);ctx.fill();
      ctx.strokeStyle=rgba(dp_f(o.hiCol||"green"),0.9);ctx.lineWidth=2;ctx.stroke();ctx.restore();}
    dp_T(ctx,s,x,y+i*lh,{w:500,size:28,f:"mono",col,a:la});});
  ctx.restore();return y+(lines.length-1)*lh;}

// a laptop, its screen showing a file (name under it); col the light it's drawn in (coral: a copy that keeps no rules); w 360
function cp_laptop(ctx,cx,cy,name,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const c=dp_f(o.col||"coral"),li=mix(c,[255,255,255],0.4);ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,cx,cy,lerp(0.6,1,o.k));
  ctx.save();ctx.shadowColor=rgba(c,0.7);ctx.shadowBlur=14;ctx.strokeStyle=rgba(li,1);ctx.lineWidth=3;ctx.lineJoin="round";
  rr(ctx,cx-170,cy-200,340,214,14);ctx.fillStyle="rgba(10,18,22,0.92)";ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx-200,cy+22);ctx.lineTo(cx+200,cy+22);ctx.lineTo(cx+226,cy+52);ctx.lineTo(cx-226,cy+52);ctx.closePath();ctx.fillStyle="rgba(10,18,22,0.92)";ctx.fill();ctx.stroke();ctx.restore();
  // the file on the screen: a sheet with its corner folded, rows of a table
  ctx.save();const fx=cx-52,fy=cy-170;ctx.beginPath();ctx.moveTo(fx,fy);ctx.lineTo(fx+76,fy);ctx.lineTo(fx+104,fy+28);ctx.lineTo(fx+104,fy+136);ctx.lineTo(fx,fy+136);ctx.closePath();
  ctx.fillStyle=rgba(c,0.18);ctx.fill();ctx.strokeStyle=rgba(li,1);ctx.lineWidth=2.4;ctx.stroke();ctx.beginPath();ctx.moveTo(fx+76,fy);ctx.lineTo(fx+76,fy+28);ctx.lineTo(fx+104,fy+28);ctx.stroke();
  ctx.fillStyle=rgba(li,0.8);for(let r=0;r<4;r++)ctx.fillRect(fx+14,fy+48+r*20,76,6);ctx.restore();
  if(name)dp_T(ctx,name,cx,cy-8,{w:500,size:28,f:"mono",align:"center",col:o.col||"coral"});
  ctx.restore();}
// a phone held up to take a photo: its outline, its lens, a flash of light; coral, like the laptop: a copy that keeps no rules; w 150, h 280
function cp_phone(ctx,cx,cy,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const c=dp_f(o.col||"coral"),li=mix(c,[255,255,255],0.45);ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor=rgba(c,0.7);ctx.shadowBlur=14;rr(ctx,cx-75,cy-140,150,280,24);ctx.fillStyle="rgba(10,18,22,0.92)";ctx.fill();ctx.strokeStyle=rgba(li,1);ctx.lineWidth=3;ctx.stroke();ctx.restore();
  ctx.strokeStyle=rgba(li,1);ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,cy-60,26,0,TAU);ctx.stroke();ctx.beginPath();ctx.arc(cx,cy-60,10,0,TAU);ctx.fillStyle=rgba(li,0.9);ctx.fill();
  rr(ctx,cx-40,cy+60,80,10,5);ctx.fillStyle=rgba(li,0.6);ctx.fill();
  if(o.flash>0){dp_halo(ctx,cx,cy-60,180,o.col||"coral",0.5*o.flash);}
  ctx.restore();}
// a coral line through what isn't made, from (x0, y0) to (x1, y1), drawn on as p goes from 0 to 1
function cp_strike(ctx,x0,y0,x1,y1,p){p=clamp(p||0,0,1);if(p<=0)return;const c=dp_f("coral");ctx.save();ctx.strokeStyle=rgba(c,1);ctx.shadowColor=rgba(c,0.85);ctx.shadowBlur=12;
  ctx.lineWidth=5;ctx.lineCap="round";const u=ag_sine(p);ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(lerp(x0,x1,u),lerp(y0,y1,u));ctx.stroke();ctx.restore();}
// a day's date, top left, over a chapter's name: the module's kicker
function cp_day(ctx,t,top,title,t0,t1){const a=ag_in(t,t0==null?0.2:t0,0.6)*(1-ag_in(t,t1==null?9:t1,0.8));if(a>0)dp_kicker(ctx,top,title,{a});}
