/* ===== Small, every week: the film's own helpers =====
   Timing, the corner that names the place and the year, the opening's live pictures (the team in the wheat, the field book's calendar
   of generations, the map's dots, lines, sacks and wheat, a certificate, a folder held open), and the bench's cards (the four steps of
   plan, do, check, act; the order of measure, simplify, standardise, automate; the year's ledger; the week on the dashboard; the films'
   cards). All prefixed sw_; the module's colours keep their meanings (look.js): steel for a measure taken, brass for what good means,
   amber for a check that holds names. */

// made once per chapter, the first time it draws: its cues are known by then
const sw_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// a card that springs in at t0 and goes at t1 (or stays): its k and a
const sw_pop=(t,t0,t1)=>({k:clamp(ag_spr(t,t0,0.8),0,1.2),a:t1==null?ag_in(t,t0,0.35):ag_io(t,t0,t1,0.35)});
// the corner, in screen space: the latest of [[t, words, d], ...] passed; where the words change, the old ones leave over d/2, then the
// new ones come in over d/2 (never both at once); null words hide it
function sw_tags(ctx,S,t,list){let i=-1;for(let k=0;k<list.length;k++)if(t>=list[k][0])i=k;if(i<0)return;setScreen(ctx,S);
  const d=list[i][2]==null?0.7:list[i][2],t0=list[i][0],prev=i>0?list[i-1][1]:null,cur=list[i][1];
  if(prev===cur){if(cur)sw_corner(ctx,cur,1);return;}
  if(prev&&d>0)sw_corner(ctx,prev,1-ag_in(t,t0,d/2));if(cur)sw_corner(ctx,cur,d>0?ag_in(t,t0+(prev?d/2:0),d/2):1);}

/* ---------------------------------------------------------------- people in the wheat
   list: [[who, x, y, s, flip, a], ...], each drawn whole and faded as one picture, standing in the wheat (covered: the near wheat is
   drawn over them after). o.each(m) adds to a person's o (a pose, a hold, a nod). */
function sw_people(ctx,list,t,a,o){o=o||{};if(a<=0.004)return;for(const m of list){const pa=a*(m[5]==null?1:m[5]);if(pa<=0.004)continue;ctx.save();ctx.globalAlpha*=pa;
  ag_person(ctx,typeof m[0]==="string"?SW_P[m[0]]:m[0],m[1],m[2],m[3],Object.assign({t,flip:m[4],covered:true},o.each?o.each(m):null));ctx.restore();}}
// the team, 1945: three young agronomists on the left, Borlaug on the right, facing them
const SW_TEAM=[["agr2",400,598,0.66,false],["agr1",630,590,0.68,false],["agr3",860,600,0.66,false],["borlaug",1290,594,0.68,true]];

/* ---------------------------------------------------------------- the field book's calendar of generations
   Years across, in slots 150 px wide from x 330; rows of sprigs below, one sprig a generation. o.years (the slots' labels), o.head (its
   heading), o.rows [{label, y (the sprigs' foot), h, items: [[slot, dx, t0, {rust, ripe}], ...]}], o.mark (the slot being sown, may be
   fractional) with o.markA, o.br {s0, s1, y, text, u}: a bracket under slots s0 to s1 with its words to its right, o.a. */
const SW_CAL={x0:330,sw:150,yYears:262,top:290,bot:842};
function sw_calendar(ctx,t,o){const a=o.a==null?1:o.a;if(a<=0.004)return;const C=SW_CAL,n=o.years.length,X=i=>C.x0+C.sw*i+C.sw/2;ctx.save();ctx.globalAlpha*=a;
  if(o.head)dq_label(ctx,140,182,o.head,{});
  dq_label(ctx,140,C.yYears,"Year",{});
  for(let i=0;i<n;i++)dq_T(ctx,o.years[i],X(i),C.yYears,{w:600,size:28,align:"center",f:"mono",col:DQ.soft});
  ctx.fillStyle="rgba(96,80,60,0.2)";for(let i=0;i<=n;i++)ctx.fillRect(C.x0+C.sw*i-0.75,C.top,1.5,C.bot-C.top);ctx.fillRect(140,C.top-1,C.x0+C.sw*n-140,2);
  if(o.mark!=null&&(o.markA||0)>0.004){ctx.fillStyle=rgba([222,206,170],0.6*o.markA);rr(ctx,C.x0+C.sw*o.mark+4,C.top+4,C.sw-8,C.bot-C.top-8,6);ctx.fill();}
  for(const r of o.rows||[]){const ra=r.a==null?1:r.a;if(ra<=0.004)continue;ctx.save();ctx.globalAlpha*=ra;
    if(r.label)dq_T(ctx,r.label,140,r.y-r.h*0.42,{w:700,size:30,col:r.labelCol||DQ.ink});
    for(const it of r.items){const k=ag_spr(t,it[2],0.7);if(k<=0.01)continue;sw_sprig(ctx,X(it[0])+(it[1]||0),r.y,r.h,Object.assign({k:clamp(k,0,1.12)},it[3]||{}));}ctx.restore();}
  if(o.br&&o.br.u>0){const b=o.br,x0=C.x0+C.sw*b.s0+10,x1=C.x0+C.sw*(b.s1+1)-10,xm=(x0+x1)/2,u=ag_sine(b.u),l0=lerp(xm,x0,u),l1=lerp(xm,x1,u);
    ctx.strokeStyle=rgba(DQ.ink,0.85);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(l0,b.y-14);ctx.lineTo(l0,b.y);ctx.lineTo(l1,b.y);ctx.lineTo(l1,b.y-14);ctx.stroke();
    if(b.text)dq_T(ctx,b.text,x1+28,b.y+11,{w:800,size:32,a:sstep(0.5,1,b.u)});}
  ctx.restore();}

/* ---------------------------------------------------------------- on the map
   sw_dot(ctx, p, a): a place, an ink dot ringed in paper; sw_route(ctx, p0, p1, u, a): a dashed line drawn on from p0 (u 0 to 1);
   sw_leader(ctx, p0, p1, a): a fine line from a place to its card; sw_wash(ctx, a): the wheat's gold laid over Mexico's land. */
function sw_dot(ctx,p,a,r){if(a<=0.004)return;r=r||9;ctx.save();ctx.globalAlpha*=a;ctx.fillStyle=rgba(DQ.paper,1);ctx.beginPath();ctx.arc(p[0],p[1],r+4.5,0,TAU);ctx.fill();
  ctx.fillStyle=rgba(SWC.ink,1);ctx.beginPath();ctx.arc(p[0],p[1],r,0,TAU);ctx.fill();ctx.restore();}
function sw_route(ctx,p0,p1,u,a){if(a<=0.004||u<=0)return;u=clamp(u,0,1);ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(SWC.ink,0.85);ctx.lineWidth=3;ctx.lineCap="round";ctx.setLineDash([12,10]);
  ctx.beginPath();ctx.moveTo(p0[0],p0[1]);ctx.lineTo(lerp(p0[0],p1[0],u),lerp(p0[1],p1[1],u));ctx.stroke();ctx.restore();}
function sw_leader(ctx,p0,p1,a){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(SWC.ink,0.6);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p0[0],p0[1]);ctx.lineTo(p1[0],p1[1]);ctx.stroke();ctx.restore();}
function sw_wash(ctx,a){if(a<=0.004)return;ctx.save();sw_path(ctx,SW_MEX);ctx.clip();ctx.globalAlpha*=a;ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba([232,206,136],1);ctx.fillRect(0,0,W,H);ctx.restore();}
// sacks on the move: each [from, to, t0, d], at s; arrived ones stay where they stopped
function sw_sacks(ctx,t,list,s,a){if(a<=0.004)return;for(const q of list){const u=ag_eo((t-q[2])/q[3]);if(t<q[2])continue;
  sw_sack(ctx,lerp(q[0][0],q[1][0],u),lerp(q[0][1],q[1][1],u),s,{a:a*ag_in(t,q[2],0.35)*(q[4]?1-ag_in(t,q[2]+q[3]-0.4,0.4):1)});}}

/* ---------------------------------------------------------------- a degree certificate
   Cream card, a fine double border, a plain round seal, lines of print. w at least 900 with o.name: the award and the name typed large
   enough to read (o.marks: the letters to mark in brass under the name, as indexes into it, drawn on by o.mu); smaller, a picture. */
function sw_cert(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const h=Math.round(w*0.68);ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,ag_spr(o.k,0,0.5)));
  if(o.angle){ctx.translate(x+w/2,y+h/2);ctx.rotate(o.angle);ctx.translate(-x-w/2,-y-h/2);}
  dq_card(ctx,x,y,w,h,{r:Math.max(3,w*0.008),on:o.on,fill:"rgb(250,246,236)"});const m=w*0.04;
  ctx.strokeStyle="rgba(120,96,60,0.55)";ctx.lineWidth=Math.max(1,w*0.003);ctx.strokeRect(x+m,y+m,w-2*m,h-2*m);ctx.lineWidth=Math.max(0.7,w*0.0012);ctx.strokeRect(x+m*1.35,y+m*1.35,w-2.7*m,h-2.7*m);
  // the seal, plain: rings, no symbol
  const sx=x+w*0.5,sy=y+h*0.8,sr=w*0.055;ctx.fillStyle="rgba(150,118,70,0.22)";ctx.beginPath();ctx.arc(sx,sy,sr,0,TAU);ctx.fill();ctx.strokeStyle="rgba(130,100,56,0.6)";ctx.lineWidth=Math.max(1,w*0.002);
  for(const k of [1,0.78])ctx.beginPath(),ctx.arc(sx,sy,sr*k,0,TAU),ctx.stroke();
  if(o.name&&w>=880){const nf={w:700,size:Math.round(w*0.062)},af={w:600,size:Math.round(w*0.034)};
    dq_T(ctx,o.award||"",x+w/2,y+h*0.3,Object.assign({align:"center",col:DQ.soft},af));dq_T(ctx,o.name,x+w/2,y+h*0.52,Object.assign({align:"center"},nf));
    if(o.marks&&(o.mu||0)>0){const x0=x+w/2-dq_tw(ctx,o.name,nf)/2;ctx.fillStyle=rgba(DQ.brass,1);for(const i of o.marks){const l0=x0+dq_tw(ctx,o.name.slice(0,i),nf),l1=x0+dq_tw(ctx,o.name.slice(0,i+1),nf),lm=(l0+l1)/2,u=ag_sine(o.mu);
      ctx.fillRect(lerp(lm,l0,u),y+h*0.52+nf.size*0.26,lerp(0,l1-l0,u),Math.max(4,w*0.005));}}}
  else{ctx.fillStyle="rgba(96,80,60,0.35)";for(const [yy,ww] of [[0.28,0.42],[0.42,0.62],[0.53,0.5],[0.64,0.3]])rr(ctx,x+w*(0.5-ww/2),y+h*yy,w*ww,Math.max(2,h*0.028),2),ctx.fill();}
  ctx.restore();}

/* ---------------------------------------------------------------- an empty folder, held open, in figure space
   Its cover dark, its lining cream, nothing in it: drawn at the near hand (pose "hold"). */
function sw_folder(c,hands){if(!hands||!hands.near)return;const h=hands.near;c.save();c.translate(h[0]+36,h[1]-138);c.rotate(-0.06);
  const cover=[46,38,44],lin=[240,232,214];
  c.fillStyle=rgba(ag_dk(cover,0.3),0.5);rr(c,-8,10,276,186,10);c.fill();
  c.fillStyle=rgba(cover,1);rr(c,0,0,270,180,10);c.fill();c.fillStyle=rgba(ag_lt(cover,0.25),1);c.fillRect(132,4,6,172);
  c.fillStyle=rgba(lin,1);rr(c,12,12,114,156,5);c.fill();rr(c,144,12,114,156,5);c.fill();
  c.fillStyle="rgba(120,96,64,0.12)";c.fillRect(126,12,6,156);c.restore();}

/* ---------------------------------------------------------------- plan, do, check, act
   A ring of four cards with arrows round it (u 0), or the same four as a row along the top of the wall (u 1), moving between the two
   (each card glides, so its word never shows twice); o.lits ([4], how lit each step is, 0 to 1: its card in ink, its word in chalk), o.wheat
   (0 to 1: the team's words beside each step: sow again, sow, look, keep the best), o.a. */
const SW_STEPS=["Plan","Do","Check","Act"],SW_WHEAT=["sow again","sow","look","keep the best"];
// Plan stands at the ring's left, then Do, Check and Act clockwise, so the ring opens into the row without two pills crossing: Plan, Do
// and Check rise to the row together, Act after them, moving right before it rises
function sw_cycle(ctx,t,o){const a=o.a==null?1:o.a;if(a<=0.004)return;const u0=clamp(o.u||0,0,1),u=ag_sine(u0),R=220,cx=960,cy=430;ctx.save();ctx.globalAlpha*=a;
  const ring=i=>{const an=Math.PI+i*Math.PI/2;return[cx+Math.cos(an)*R,cy+Math.sin(an)*R];},row=i=>[960+(i-1.5)*236,104],
    own=i=>i<3?ag_sine(clamp(u0/0.6,0,1)):ag_sine(clamp((u0-0.5)/0.5,0,1));
  // the ring's arrows, clockwise, fading as it becomes the row
  if(u<1){ctx.save();ctx.globalAlpha*=1-sstep(0,0.5,u);ctx.strokeStyle=rgba(DQ.graphite,0.9);ctx.lineWidth=4;ctx.lineCap="round";ctx.fillStyle=rgba(DQ.graphite,0.9);
    for(let i=0;i<4;i++){const a0=-Math.PI/2+i*Math.PI/2+0.5,a1=a0+Math.PI/2-1.0;ctx.beginPath();ctx.arc(cx,cy,R,a0,a1);ctx.stroke();
      const ex=cx+Math.cos(a1)*R,ey=cy+Math.sin(a1)*R,d=a1+Math.PI/2;ctx.beginPath();ctx.moveTo(ex+Math.cos(d)*14,ey+Math.sin(d)*14);ctx.lineTo(ex+Math.cos(d+2.5)*12,ey+Math.sin(d+2.5)*12);ctx.lineTo(ex+Math.cos(d-2.5)*12,ey+Math.sin(d-2.5)*12);ctx.closePath();ctx.fill();}
    ctx.restore();}
  // the row's small arrows between the pills
  if(u>0){ctx.save();ctx.globalAlpha*=sstep(0.5,1,u);ctx.strokeStyle=rgba(DQ.dim,1);ctx.lineWidth=3;ctx.lineCap="round";for(let i=0;i<3;i++){const x=row(i)[0]+118;ctx.beginPath();ctx.moveTo(x-6,96);ctx.lineTo(x+4,104);ctx.lineTo(x-6,112);ctx.stroke();}ctx.restore();}
  for(let i=0;i<4;i++){const p0=ring(i),p1=row(i),ui=own(i),ux=i<3?ui:ag_sine(clamp(ui*1.6,0,1)),x=lerp(p0[0],p1[0],ux),y=lerp(p0[1],p1[1],ui),w=lerp(250,196,ui),h=lerp(96,62,ui),size=Math.round(lerp(40,30,ui)),
      lit=o.lits?clamp(o.lits[i]||0,0,1):0;
    ctx.save();dq_shadow(ctx,"wall",0.8);rr(ctx,x-w/2,y-h/2,w,h,h/2);ctx.fillStyle=rgba(mix(DQ.paper,DQ.ink,lit),1);ctx.fill();ctx.restore();
    ctx.lineWidth=1.4;ctx.strokeStyle="rgba(110,90,66,0.4)";rr(ctx,x-w/2+0.5,y-h/2+0.5,w-1,h-1,h/2);ctx.stroke();
    dq_T(ctx,SW_STEPS[i],x,y+size*0.36,{w:800,size,align:"center",color:rgba(mix(DQ.ink,DQ.chalk,lit),1)});}
  if((o.wheat||0)>0){const wa=o.wheat*(1-sstep(0,0.3,u0)),f={w:600,size:30,col:DQ.soft,a:wa};   // gone before any pill reaches its words
    dq_T(ctx,SW_WHEAT[0],cx-R-150,cy+11,Object.assign({align:"right"},f));dq_T(ctx,SW_WHEAT[1],cx,cy-R-70,Object.assign({align:"center"},f));
    dq_T(ctx,SW_WHEAT[2],cx+R+150,cy+11,Object.assign({},f));dq_T(ctx,SW_WHEAT[3],cx,cy+R+90,Object.assign({align:"center"},f));}
  ctx.restore();}

/* ---------------------------------------------------------------- measure, simplify, standardise, automate
   Four step cards in a row (slots 440 apart from x 120), arrows between them; o.order (which step stands in each slot, eased between
   orders by o.mix from o.from), o.lit[i] (0 to 1: a step's card comes in), o.dim (0 to 1: the steps not first fade back), o.a. */
const SW_ORDER=["Measure","Simplify","Standardise","Automate"];
function sw_order(ctx,t,o){const a=o.a==null?1:o.a;if(a<=0.004)return;const slot=i=>120+i*440,posOf=(ord,k)=>ord.indexOf(k),mixU=ag_sine(clamp(o.mix||0,0,1));ctx.save();ctx.globalAlpha*=a;
  ctx.strokeStyle=rgba(DQ.dim,1);ctx.lineWidth=3.4;ctx.lineCap="round";for(let i=0;i<3;i++){const x=slot(i)+380+30;ctx.save();ctx.globalAlpha*=Math.min(o.lit[i]||0,o.lit[i+1]||0);
    ctx.beginPath();ctx.moveTo(x-16,241);ctx.lineTo(x+14,241);ctx.moveTo(x+4,231);ctx.lineTo(x+14,241);ctx.lineTo(x+4,251);ctx.stroke();ctx.restore();}
  for(let k=0;k<4;k++){const la=o.lit[k]||0;if(la<=0.004)continue;const x=lerp(slot(posOf(o.from||o.order,k)),slot(posOf(o.order,k)),o.from?mixU:1),
      lift=o.from?Math.sin(Math.PI*mixU)*(k===3?-160:10):0,dim=k===3?0:(o.dim||0);
    dq_textCard(ctx,x,170+lift,380,{kick:String(k+1),title:SW_ORDER[k]},{a:la*(1-0.6*dim),k:o.k?o.k[k]:null});}
  ctx.restore();}

/* ---------------------------------------------------------------- the year's ledger: each change, and what keeps it */
const SW_LEDGER=[["Good enough for what?","The uses and their levels, in the list's contract"],["A hundred records","The checks the profile led to"],
  ["Valid isn't true","Each graduate's confirmation; the reconciliation with the boards"],["Late is wrong too","Each source's age, shown on the list and checked before the send"],
  ["The hidden factory","Names fixed and checked at the source, each night"],["Report, fix, tell","Every report answered in two working days; the old form's check"],
  ["Read by an agent","What empty means, written down; two columns that must agree"],["Small, every week","The hand checks, kept by the hundred records"]];
function sw_ledger(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const rh=70,h=92+SW_LEDGER.length*rh+18;ctx.save();ctx.globalAlpha*=a;
  dq_card(ctx,x,y,w,h,{});dq_label(ctx,x+DQ_PAD,y+56,"The year's changes, each with its keeper",{});
  SW_LEDGER.forEach((r,i)=>{const ra=o.rowA?o.rowA(i):1;if(ra<=0.004)return;const yy=y+92+i*rh;ctx.save();ctx.globalAlpha*=ra;
    ctx.fillStyle="rgba(120,104,84,0.16)";ctx.fillRect(x+DQ_PAD,yy,w-2*DQ_PAD,1.5);
    if(o.lit===i){ctx.fillStyle="rgba(178,138,62,0.12)";ctx.fillRect(x+6,yy+2,w-12,rh-4);}
    dq_T(ctx,r[0],x+DQ_PAD,yy+46,{w:600,size:28,col:DQ.soft});dq_T(ctx,r[1],x+DQ_PAD+380,yy+46,{w:600,size:28});ctx.restore();});
  ctx.restore();}

/* ---------------------------------------------------------------- the week, on the dashboard
   In a tool page's body b: names held each night, Thursday to Wednesday, for three checks: two steady (in the frame's quiet line) and
   one that holds more each night (amber: a check that holds names), drawn on by o.u, its words by o.wa; and o.tiles, what people count. */
const SW_NIGHTS=["Thu","Fri","Sat","Sun","Mon","Tue","Wed"];
function sw_week(ctx,b,t,o){const a=o.a==null?1:o.a;if(a<=0.004)return;const L=b.x+96,R=b.x+b.w*0.6,T0=b.y+70,B=b.y+b.h-82,X=i=>lerp(L,R,i/6),Y=v=>lerp(B,T0,v/20);ctx.save();ctx.globalAlpha*=a;
  dq_label(ctx,b.x+8,b.y+34,"Names held each night",{});
  ctx.fillStyle="rgba(96,80,60,0.18)";for(const v of [0,5,10,15,20])ctx.fillRect(L,Y(v)-0.75,R-L,1.5);
  for(const v of [0,10,20])dq_T(ctx,String(v),L-22,Y(v)+10,{w:600,size:28,align:"right",col:DQ.soft});
  SW_NIGHTS.forEach((n,i)=>dq_T(ctx,n,X(i),B+44,{w:600,size:28,align:"center",col:DQ.soft}));
  const line=(vals,col,lw,u)=>{if(u<=0)return;const n=(vals.length-1)*clamp(u,0,1);ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.lineJoin="round";ctx.lineCap="round";ctx.beginPath();
    for(let i=0;i<=Math.floor(n);i++)i?ctx.lineTo(X(i),Y(vals[i])):ctx.moveTo(X(i),Y(vals[i]));const f=n-Math.floor(n);if(f>0){const i=Math.floor(n);ctx.lineTo(lerp(X(i),X(i+1),f),lerp(Y(vals[i]),Y(vals[i+1]),f));}ctx.stroke();
    for(let i=0;i<=Math.floor(n);i++){ctx.fillStyle=col;ctx.beginPath();ctx.arc(X(i),Y(vals[i]),lw*1.4,0,TAU);ctx.fill();}};
  line([2,1,2,1,2,1,1],rgba(DQ.dim,1),4,o.base==null?1:o.base);line([4,3,4,3,3,4,3],rgba(DQ.dim,1),4,o.base==null?1:o.base);
  line([1,2,4,6,9,12,16],rgba(DQ.hold,1),6,o.u||0);
  // its words end over its last night, so the tiles beside the chart never cover them
  if((o.wa||0)>0){const cw=dq_tw(ctx,"more each night",{w:700,size:28})+44;dq_chip(ctx,X(6)+18-cw,Y(16)-46,"more each night",{col:"hold",a:o.wa});}
  // what people count, beside it: three tiles, their values in steel (a measure taken)
  const tx=b.x+b.w*0.66,tw=b.x+b.w-tx;(o.tiles||[]).forEach((tl,i)=>{if(tl.a<=0.004)return;const ty=b.y+12+i*(b.h-12)/3,th=(b.h-12)/3-18;ctx.save();ctx.globalAlpha*=tl.a;
    dq_card(ctx,tx,ty,tw,th,{edge:"steel"});dq_T(ctx,tl.label,tx+DQ_PAD,ty+46,{w:600,size:28,col:DQ.soft});dq_T(ctx,tl.value,tx+DQ_PAD,ty+th-30,{w:800,size:44,col:"steel"});ctx.restore();});
  ctx.restore();}

/* ---------------------------------------------------------------- the films' cards, at the end: each film's title, in a row under its series' name
   (never a number: the site doesn't number its films, and each series numbers its own as "Film 2 of 4") */
const SW_FILMS=["Good enough for what?","A hundred records","Valid isn't true","Late is wrong too","The hidden factory","Report, fix, tell","Read by an agent","Small, every week"];
const SW_SERIES=["Fit for use","Quality as a habit"];
function sw_filmCard(ctx,i,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;dq_textCard(ctx,x,y,400,{title:SW_FILMS[i]},{a,k:o.k,edge:o.edge});}
function sw_seriesLabel(ctx,j,x,y,a){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;dq_T(ctx,SW_SERIES[j].toUpperCase(),x,y,{w:800,size:28,ls:4,col:DQ.soft});ctx.restore();}

/* ---------------------------------------------------------------- a list's card: its heading and names, typed */
function sw_listCard(ctx,x,y,w,head,names,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const h=86+names.length*56+14;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,ag_spr(o.k,0,0.5)));dq_card(ctx,x,y,w,h,{ruled:56,ruleTop:72,on:o.on});dq_label(ctx,x+DQ_PAD,y+50,head,{});
  names.forEach((n,i)=>{const na=o.rowA?o.rowA(i):1;if(na>0.004)dq_T(ctx,n,x+DQ_PAD,y+112+i*56,{w:500,size:28,f:"mono",a:na});});ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- a year of Thursdays: a small card for each week on the wall, each with
   its measure (a steel dot) once it's taken. o.n (48), o.t0 (they come in, left to right, over o.d), o.dot (the dots, the same way), o.a */
function sw_strip(ctx,t,o){const a=o.a==null?1:o.a;if(a<=0.004)return;const n=o.n||48,x0=176,step=(1744-x0)/(n-1),y=o.y||200;ctx.save();ctx.globalAlpha*=a;
  for(let i=0;i<n;i++){const u=ag_in(t,o.t0+i*(o.d||2.4)/n,0.3);if(u<=0.004)continue;const x=x0+i*step;ctx.save();ctx.globalAlpha*=u;
    ctx.save();dq_shadow(ctx,"wall",0.5);ctx.shadowBlur=8;rr(ctx,x-11,y,22,40,3);ctx.fillStyle=rgba(DQ.paper,1);ctx.fill();ctx.restore();
    if(o.dot!=null){const v=ag_in(t,o.dot+i*(o.d||2.4)/n,0.25);if(v>0){ctx.fillStyle=rgba(DQ.steel,v);ctx.beginPath();ctx.arc(x,y+20,5.5,0,TAU);ctx.fill();}}ctx.restore();}
  ctx.restore();}
