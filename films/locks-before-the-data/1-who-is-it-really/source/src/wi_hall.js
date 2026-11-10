/* ===== Who is it, really?: the university's chapters, in the module's hall =====
   The film's own pictures for its chapters at the university, all prefixed wi_: the hall where they happen (wiHall, one room for
   every chapter there, so the camera glides from one moment to the next and never cuts), and what is shown in it, drawn with the
   module's glass: a disc of glass round a small picture (a person, a job's gear, the agent), rows of checks, a card with a band
   and rows, the platform, the wall round the network, the 41 who could read the learner table, the confidentiality agreement and
   a request. Colours as the module sets them: cyan an identity (a badge, a name, a role), green allowed, coral denied or closed,
   amber power (the order to raise troops; the beacon fire), violet a secret, always sealed, or personal data, grey a plain fact. */

AG_PLACES.wiHall=c=>dp_paintHall(c,{seed:11,horizon:700,vx:1120,pools:[[380,990,520,0.12],[1240,820,760,0.07]]});
DP_PEOPLE.push("sam","jun","mei");

// draws fn on the frame itself, not in the place (a kicker, which the camera must not move or scale)
function wi_screen(ctx,S,fn){ctx.save();setScreen(ctx,S);fn(ctx);ctx.restore();}
// where a person's head is, for a tag's line: (x, y) and s as dp_person takes them; flip for one facing left
function wi_head(x,y,s,flip){return[x+(flip?-18:18)*s,y-262*s];}

/* ---------------------------------------------------------------- a disc of glass round a small picture
   wi_disc(ctx, x, y, pic, {r, col, a, k, ring}): pic(ctx, x, y) draws the picture at the disc's middle, at the size the kit's badge
   pictures are drawn (dp_personPic, dp_gearPic, or wi_agentPic); r the disc's radius (60); col its colour (cyan); k (0 to 1) springs it in;
   ring a second colour for its edge (a check's colour: "green" while its rights hold, "coral" once they're gone) */
function wi_agentPic(c,x,y){dp_sphereIcon(c,x,y-4,46,1.2);}
function wi_disc(ctx,x,y,pic,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const r=o.r||60,c=dp_f(o.col||"cyan"),rc=o.ring?dp_f(o.ring):c;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x,y,lerp(0.5,1,o.k));
  ctx.save();ctx.shadowColor=rgba(rc,o.ring?0.6:0.36);ctx.shadowBlur=o.ring?30:24;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fillStyle="rgba(6,20,26,0.84)";ctx.fill();ctx.restore();
  ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.clip();const g=ctx.createRadialGradient(x,y-r*0.3,4,x,y,r);g.addColorStop(0,rgba(c,0.26));g.addColorStop(1,rgba(c,0.04));
  ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);const k=r/86;ctx.translate(x,y);ctx.scale(k,k);pic(ctx,0,6,o.col);ctx.restore();
  ctx.beginPath();ctx.arc(x,y,r-1,0,TAU);ctx.strokeStyle=rgba(mix(rc,[255,255,255],0.3),0.95);ctx.lineWidth=o.ring?3.2:2.2;ctx.stroke();ctx.restore();}
const WI_PIC={person:(c,x,y,col)=>dp_personPic(c,x,y,col),gear:(c,x,y,col)=>dp_gearPic(c,x,y,col),agent:(c,x,y)=>wi_agentPic(c,x,y)};
// an empty place for one kind of who: a dashed ring of light
function wi_slot(ctx,x,y,r,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.setLineDash([10,12]);ctx.strokeStyle=rgba(DP.F.cyan,0.7);ctx.lineWidth=2.4;ctx.shadowColor=rgba(DP.F.cyan,0.6);ctx.shadowBlur=10;
  ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.stroke();ctx.restore();}

/* ---------------------------------------------------------------- marks and rows
   wi_mark(ctx, x, y, kind, col, p): "tick", "cross", "q" (a question still open: a cyan disc with a question mark), "dot" (a disc of
   solid colour), or a number (1 to 9, in a cyan disc); p draws it on */
function wi_mark(ctx,x,y,kind,col,p){p=p==null?1:p;if(p<=0)return;if(kind==="tick"){dp_tick(ctx,x,y,col||"green",p);return;}if(kind==="cross"){dp_cross(ctx,x,y,col||"coral",p);return;}
  const c=dp_f(col||(kind==="dot"?"amber":"cyan"));ctx.save();ctx.shadowColor=rgba(c,0.75);ctx.shadowBlur=14;ctx.fillStyle=rgba(c,1);ctx.beginPath();ctx.arc(x,y,20*ag_eo(Math.min(1,p*1.6)),0,TAU);ctx.fill();ctx.restore();
  const q=clamp((p-0.35)/0.65,0,1);if(q<=0||kind==="dot")return;dp_T(ctx,kind==="q"?"?":String(kind),x,y+10,{w:800,size:28,col:DP.on,align:"center",a:q});}
/* wi_rows(ctx, x, y, rows, {lh, size}): one row each: [mark, words, p, colour of the mark, a]; the mark's middle at x + 20, the words at
   x + 56; the first row's words on y; lh apart (60). A row may be null (left out) */
function wi_rows(ctx,x,y,rows,o){o=o||{};const lh=o.lh||60,size=o.size||30;rows.forEach((r,i)=>{if(!r)return;const [mark,s,p,col,a]=r,ra=a==null?1:a;if(ra<=0)return;const yy=y+i*lh;
  ctx.save();ctx.globalAlpha*=ra;if(mark)wi_mark(ctx,x+20,yy-10,mark,col,p);dp_T(ctx,s,x+(mark?56:0),yy,{w:600,size,col:o.col||"ink"});ctx.restore();});}
/* wi_list(ctx, x, y, w, {kick, title, rows, col, a, k, lh, measure}): a card of glass with its kind on a band of solid colour (kick), a
   title (36 px) and rows of checks under it; returns its box */
function wi_list(ctx,x,y,w,o){o=o||{};const col=o.col||"cyan",lh=o.lh||60,rows=o.rows||[],hb=o.kick?62:0,tt=o.title?ag_wrap(ctx,o.title,w-60,{w:700,size:36}):[];
  let top=y+hb;const tb=[];tt.forEach((l,i)=>{tb.push(top+(i?46:58));});if(tt.length)top=tb[tb.length-1]+16;
  const h=Math.round(top-y+42+(rows.length-1)*lh+32),bb={x,y,w,h},a=o.a==null?1:o.a;if(o.measure||a<=0)return bb;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  dp_panel(ctx,x,y,w,h,{col,r:22,behind:o.behind,glowR:36});if(o.kick)dp_band(ctx,x,y,w,hb,22,col,o.kick);
  tt.forEach((l,i)=>dp_T(ctx,l,x+30,tb[i],{w:700,size:36}));
  wi_rows(ctx,x+28,top+42,rows,{lh,size:o.size||30});ctx.restore();return bb;}

/* ---------------------------------------------------------------- the platform, before: one workspace, open to the internet
   wi_platform(ctx, x, y, w, h, {a, records, signed, open, t}): a panel of glass with a grey band; the registrar's records (records, 0
   to 1), who it sees signed in (signed: the words, in cyan, with a person's picture), and its one workspace's door to the internet
   (open, 0 to 1: a grey slip, and a dashed line out to the globe) */
function wi_globe(ctx,x,y,r,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const c=DP.F.grey;ctx.strokeStyle=rgba(mix(c,[255,255,255],0.3),0.9);ctx.lineWidth=2.2;ctx.shadowColor=rgba(c,0.6);ctx.shadowBlur=10;
  ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.stroke();ctx.beginPath();ctx.ellipse(x,y,r*0.45,r,0,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(x-r,y);ctx.lineTo(x+r,y);
  ctx.moveTo(x-r*0.86,y-r*0.5);ctx.lineTo(x+r*0.86,y-r*0.5);ctx.moveTo(x-r*0.86,y+r*0.5);ctx.lineTo(x+r*0.86,y+r*0.5);ctx.stroke();ctx.restore();}
function wi_tables(ctx,x,y,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const c=DP.F.grey;for(let i=0;i<3;i++){const tx=x+i*58;rr(ctx,tx,y,46,40,6);ctx.fillStyle=rgba(c,0.18);ctx.fill();
  ctx.strokeStyle=rgba(mix(c,[255,255,255],0.35),0.9);ctx.lineWidth=1.6;ctx.stroke();ctx.fillStyle=rgba(c,0.55);ctx.fillRect(tx,y+12,46,1.4);ctx.fillRect(tx,y+25,46,1.4);ctx.fillRect(tx+15,y,1.4,40);}ctx.restore();}
function wi_platform(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  dp_panel(ctx,x,y,w,h,{col:"grey",r:22,glowR:40});dp_band(ctx,x,y,w,62,22,"grey","Data platform");
  const ra=o.records||0;wi_tables(ctx,x+32,y+96,ra);dp_T(ctx,"The registrar's records",x+222,y+128,{w:600,size:30,a:ra});
  const sa=o.signed?ag_eo(o.signedP==null?1:o.signedP):0;if(sa>0){wi_disc(ctx,x+70,y+218,WI_PIC.person,{r:38,a:sa});dp_T(ctx,"Signed in:",x+128,y+208,{w:600,size:28,col:"mut",a:sa});
    dp_T(ctx,o.signed,x+128,y+246,{w:700,size:32,col:"cyan",a:sa});}
  const oa=o.open||0;if(oa>0){const bx=x+32,by=y+h-130,bw=w-64;ctx.save();ctx.globalAlpha*=oa;rr(ctx,bx,by,bw,100,14);ctx.strokeStyle=rgba(DP.F.grey,0.7);ctx.lineWidth=2;ctx.stroke();
    dp_T(ctx,"One workspace",bx+24,by+42,{w:700,size:30});dp_T(ctx,"Open to the internet",bx+24,by+80,{w:600,size:28,col:"mut"});
    // its door, open: a gap in its right edge, and a dashed line out of it to the internet
    ctx.fillStyle="rgba(6,20,26,0.9)";ctx.fillRect(bx+bw-3,by+28,6,44);ctx.restore();
    if(o.globe){const [gx,gy]=o.globe;dp_link(ctx,[bx+bw,by+50],[gx,gy+48],"grey",ag_sine(oa),{dash:[8,10],dot:false,lw:2});wi_globe(ctx,gx,gy,40,oa);}}
  ctx.restore();}

/* ---------------------------------------------------------------- the wall round the network
   wi_ring(ctx, x, y, w, h, p, {a, dash, label}): a rounded wall of light, drawn on (p 0 to 1) from the top middle both ways round */
function wi_ring(ctx,x,y,w,h,p,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0||p<=0)return;ctx.save();ctx.globalAlpha*=a;const c=DP.F.grey,r=70;
  ctx.strokeStyle=rgba(mix(c,[255,255,255],0.25),0.95);ctx.lineWidth=7;ctx.lineCap="round";ctx.shadowColor=rgba(DP.ice,0.55);ctx.shadowBlur=18;if(o.dash)ctx.setLineDash([26,22]);
  const L=2*(w+h)-8*r+TAU*r;ctx.setLineDash(o.dash?[26,22]:[L*ag_sine(p),L+10]);ctx.lineDashOffset=0;
  // from the top middle, round to the right and back
  ctx.beginPath();ctx.moveTo(x+w/2,y);ctx.lineTo(x+w-r,y);ctx.arcTo(x+w,y,x+w,y+r,r);ctx.lineTo(x+w,y+h-r);ctx.arcTo(x+w,y+h,x+w-r,y+h,r);ctx.lineTo(x+r,y+h);ctx.arcTo(x,y+h,x,y+h-r,r);
  ctx.lineTo(x,y+r);ctx.arcTo(x,y,x+r,y,r);ctx.lineTo(x+w/2,y);ctx.stroke();ctx.restore();
  if(o.label)dp_slip(ctx,x+w/2,y-35,o.label,"grey",{align:"center",ink:true,a:a*ag_in(p,0.4,0.4)});}

/* ---------------------------------------------------------------- the 41 who could read the whole learner table
   WI_41 places each person's picture: seven across, six down, the last place empty; WI_9 are the nine who had moved to other jobs */
const WI_41=(()=>{const L=[];for(let i=0;i<41;i++)L.push([140+(i%7)*90,262+Math.floor(i/7)*90]);return L;})();
const WI_9=[3,8,12,17,22,25,30,34,39];

/* ---------------------------------------------------------------- the confidentiality agreement: each person's own, six lines in
   the signer's voice (An agreement first sets it; the module's numbers.md has the words) */
const WI_AGREE=["I keep what I see to myself","I use it only for the work it's given for","I keep no copy where it isn't allowed","I answer for the data I'm given",
  "I report anything that goes wrong, at once","It holds after I leave"];
// p (0 to 6) brings the lines in one by one; signed (0 to 1) draws the signature's line under them
function wi_agreement(ctx,x,y,w,p,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const lh=52,h=62+76+WI_AGREE.length*lh+84;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  dp_panel(ctx,x,y,w,h,{col:"cyan",r:22,glowR:40});dp_band(ctx,x,y,w,62,22,"cyan","Before any access");dp_T(ctx,"Confidentiality agreement",x+30,y+62+56,{w:700,size:36});
  WI_AGREE.forEach((s,i)=>{const q=clamp(p-i,0,1);if(q<=0)return;const yy=y+62+76+40+i*lh;ctx.save();ctx.globalAlpha*=ag_eo(q);ctx.translate((1-ag_eo(q))*16,0);
    ctx.fillStyle=rgba(DP.F.cyan,0.95);ctx.beginPath();ctx.arc(x+44,yy-10,5,0,TAU);ctx.fill();dp_T(ctx,s,x+66,yy,{w:600,size:30});ctx.restore();});
  const sg=o.signed||0;if(sg>0){const yy=y+h-40;ctx.save();ctx.strokeStyle=rgba(DP.F.cyan,0.9);ctx.lineWidth=2.4;ctx.lineCap="round";ctx.shadowColor=rgba(DP.F.cyan,0.7);ctx.shadowBlur=8;
    // a signature: one flowing line, drawn on
    const P=[];for(let i=0;i<=40;i++){const u=i/40;P.push([x+w-330+u*230,yy-8-10*Math.sin(u*TAU*2.2)*(1-u*0.6)-6*Math.sin(u*TAU*5)]);}
    const n=Math.max(2,Math.round(P.length*ag_sine(sg)));ctx.beginPath();ctx.moveTo(...P[0]);for(let i=1;i<n;i++)ctx.lineTo(...P[i]);ctx.stroke();ctx.restore();
    dp_T(ctx,"Signed",x+30,yy,{w:700,size:28,col:"mut",a:ag_in(sg,0.2,0.4)});}
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- a request: one line on a small panel, an arrow at its front */
function wi_request(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const b=dp_slip(ctx,x,y,text,"grey",{ink:true,a,measure:true});ctx.save();ctx.globalAlpha*=a;
  dp_slip(ctx,x,y,text,"grey",{ink:true});const ax=b.x+b.w+10,ay=y+b.h/2;ctx.fillStyle=rgba(mix(DP.F.grey,[255,255,255],0.3),0.9);ctx.beginPath();ctx.moveTo(ax,ay-12);ctx.lineTo(ax+18,ay);ctx.lineTo(ax,ay+12);ctx.closePath();ctx.fill();
  ctx.restore();return b;}
