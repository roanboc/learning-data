/* ===== Day one: the film's own pictures (prefixed d1_) =====
   The Domesday survey: a map of England in ink, counties washing in as they're surveyed (not the far north, and not Wales), an entry
   written out, and the pages bound into a book. The utility's region at night. The pile of day one: a badge, an org chart, a list of
   140 systems, an invitation, a process manual and a strategy slide. Jigsaw pieces from different puzzles, the methods' glyphs, and a bill. */

const INKP=[70,46,28],PARCHP="#e8d9b8";

/* ---------- 1085: the survey ---------- */
// England and Wales, as (longitude, latitude), clockwise from Berwick; the land border with Scotland closes it
const D1_COAST=[[-2.0,55.77],[-1.7,55.6],[-1.42,55.0],[-1.15,54.6],[-0.6,54.48],[-0.08,54.12],[0.12,53.58],[0.34,53.14],[0.2,52.88],[0.5,52.95],[1.3,52.93],[1.75,52.48],[1.58,52.08],[1.35,51.96],[0.95,51.78],[0.7,51.53],[1.38,51.39],[1.31,51.12],[0.95,50.93],[0.25,50.73],[-0.79,50.72],[-1.1,50.78],[-1.7,50.72],[-2.45,50.6],[-3.0,50.68],[-3.5,50.55],[-3.64,50.22],[-4.14,50.36],[-4.7,50.32],[-5.2,49.96],[-5.7,50.07],[-5.48,50.21],[-4.95,50.55],[-4.53,51.02],[-4.2,51.1],[-3.47,51.2],[-3.0,51.32],[-2.7,51.5],[-3.17,51.46],[-3.94,51.61],[-4.3,51.67],[-5.1,51.72],[-5.3,51.88],[-4.66,52.1],[-4.08,52.41],[-4.05,52.7],[-4.42,52.89],[-4.75,52.8],[-4.35,53.05],[-4.55,53.3],[-4.2,53.42],[-3.83,53.32],[-3.3,53.35],[-3.0,53.4],[-3.05,53.82],[-2.9,54.07],[-3.23,54.11],[-3.6,54.49],[-3.5,54.71],[-3.1,54.95],[-2.6,55.15],[-2.2,55.45],[-2.0,55.77]];
const D1_K=0.6;
function d1_xy(lon,lat,x0,y0,k){return[x0+(lon+5.8)*D1_K*k,y0+(55.9-lat)*k];}
// surveyed: England south of the Tees and the Ribble, and not Wales (to the west of the border, north of the Bristol Channel)
const d1_surveyed=(lon,lat)=>lat<54.45&&(lat<51.35||lon>-3.05);
let D1_CELLS=null;
function d1_cells(){if(D1_CELLS)return D1_CELLS;const c=document.createElement("canvas").getContext("2d"),P=new Path2D(),k=100;D1_COAST.forEach(([lo,la],i)=>{const[x,y]=d1_xy(lo,la,0,0,k);i?P.lineTo(x,y):P.moveTo(x,y);});P.closePath();
  const out=[],st=7;for(let y=0;y<620;y+=st)for(let x=0;x<470;x+=st){if(!c.isPointInPath(P,x+st/2,y+st/2))continue;const lon=(x+st/2)/(D1_K*k)-5.8,lat=55.9-(y+st/2)/k;
    // counties: a coarse grid, each surveyed in its own moment, roughly from the south upwards
    const cx=Math.floor(x/56),cy=Math.floor(y/48),order=clamp((1-(y/620))*0.7+hash(cx*7+cy,61)*0.3,0,1);out.push([x,y,st,d1_surveyed(lon,lat),order,hash(cx*7+cy,62)]);}
  // settlements: a few dots inside the surveyed land
  const dots=[];for(let i=0;i<60&&dots.length<34;i++){const lon=-4.8+hash(i,71)*6.2,lat=50.4+hash(i,72)*3.9,px=(lon+5.8)*D1_K*k,py=(55.9-lat)*k;if(d1_surveyed(lon,lat)&&c.isPointInPath(P,px,py))dots.push([lon,lat]);}
  return D1_CELLS={P,cells:out,dots};}
// the map on its parchment: the coast in ink (p), then the counties wash in as they're surveyed (q); the north and Wales stay blank
function d1_england(ctx,x,y,s,p,q,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const D=d1_cells(),k=s;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(k/100,k/100);
  D.cells.forEach(([cx,cy,st,on,ord,h])=>{if(!on)return;const v=clamp((q-ord*0.85)*6,0,1);if(v<=0)return;ctx.fillStyle="rgba(150,96,52,"+(0.16+0.16*h)*v+")";ctx.fillRect(cx,cy,st+0.6,st+0.6);});
  ctx.restore();
  // the coast, drawn round as p goes from 0 to 1
  const pts=D1_COAST.map(([lo,la])=>d1_xy(lo,la,x,y,k));marker(ctx,pts,p,{col:rgba(INKP,0.9),lw:2.6,seed:9});
  // settlements, as the counties fill
  withA(ctx,clamp(q*2-0.6,0,1),()=>{D.dots.forEach(([lo,la])=>{const[px,py]=d1_xy(lo,la,x,y,k);ctx.fillStyle=rgba(INKP,0.75);ctx.beginPath();ctx.arc(px,py,2.6,0,TAU);ctx.fill();});});
  withA(ctx,fin(q,0.85,0.15),()=>{const[nx,ny]=d1_xy(-1.95,54.85,x,y,k);T(ctx,"not surveyed",nx,ny,{w:700,size:28,align:"center",color:rgba(INKP,0.7)});const[wx,wy]=d1_xy(-4.0,52.35,x,y,k);T(ctx,"Wales",wx,wy,{w:700,size:28,align:"center",color:rgba(INKP,0.6)});});});}
// a page of the survey, an entry written out line by line as p goes from 0 to 1; o.hi[i] marks a line
const D1_ENTRY=["Ralph holds Estone from the king.","Land for 4 ploughs. 2 ploughs there now.","1 mill. 6 acres of meadow. Woodland, 40 pigs.","Worth then 40 shillings; now 60."];
function d1_entry(ctx,x,y,w,h,p,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{rot:0.008,fill:PARCHP});
  T(ctx,"ESTONE · in the hundred of Wicham",x+44,y+66,{w:800,size:28,color:rgba(INKP,0.75)});ctx.fillStyle=rgba(INKP,0.25);ctx.fillRect(x+44,y+80,w-88,2);
  const n=D1_ENTRY.length*p;D1_ENTRY.forEach((l,i)=>{if(i>=n)return;const yy=y+146+i*66,hi=o.hi?o.hi[i]||0:0;
    if(hi>0)withA(ctx,hi,()=>{ctx.fillStyle="rgba(200,120,40,0.18)";rr(ctx,x+30,yy-36,w-60,50,8);ctx.fill();});
    T(ctx,typeOn(l,n-i),x+44,yy,{w:600,size:31,color:rgba(INKP,0.95)});});
  // the quill's point, where the writing is
  if(p>0&&p<1){const i=Math.floor(n),l=D1_ENTRY[i]||"",tw_=tw(ctx,typeOn(l,n-i),31,600);const qx=x+44+tw_+6,qy=y+146+i*66-6;ctx.save();ctx.strokeStyle=rgba(INKP,0.9);ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(qx,qy);ctx.lineTo(qx+70,qy-90);ctx.stroke();
    ctx.fillStyle="rgba(240,234,220,0.85)";ctx.beginPath();ctx.moveTo(qx+70,qy-90);ctx.quadraticCurveTo(qx+120,qy-150,qx+150,qy-200);ctx.quadraticCurveTo(qx+90,qy-150,qx+56,qy-80);ctx.closePath();ctx.fill();ctx.restore();}});}
// the pages bound into a book: as p goes from 0 to 1, loose pages settle into a stack and a cover closes over them
function d1_book(ctx,cx,cy,s,p,t){if(p<=0)return;const bw=300*s,bh=380*s,cl=ease(clamp((p-0.45)/0.55,0,1));
  for(let i=0;i<9;i++){const q=ease(clamp(p*1.8-i*0.08,0,1)),sx=cx+(hash(i,81)-0.5)*700*(1-q),sy=cy+(hash(i,82)-0.5)*400*(1-q)-i*2*s,r=(hash(i,83)-0.5)*0.5*(1-q);
    withA(ctx,clamp(q*3,0,1),()=>{ctx.save();ctx.translate(sx,sy);ctx.rotate(r);ctx.shadowColor="rgba(0,0,0,0.45)";ctx.shadowBlur=12;ctx.fillStyle=PARCHP;ctx.fillRect(-bw/2,-bh/2,bw,bh);ctx.shadowBlur=0;
      ctx.fillStyle=rgba(INKP,0.25);for(let j=0;j<9;j++)ctx.fillRect(-bw/2+24*s,-bh/2+40*s+j*34*s,bw-48*s-hash(i*9+j,84)*80*s,3*s);ctx.restore();});}
  if(cl>0){ctx.save();ctx.translate(cx,cy-18*s);ctx.scale(lerp(0.05,1,cl),1);ctx.shadowColor="rgba(0,0,0,0.6)";ctx.shadowBlur=24;const g=ctx.createLinearGradient(-bw/2,0,bw/2,0);g.addColorStop(0,"#4a2a18");g.addColorStop(1,"#6b3d22");ctx.fillStyle=g;rr(ctx,-bw/2-10*s,-bh/2-10*s,bw+20*s,bh+20*s,8*s);ctx.fill();ctx.shadowBlur=0;
    ctx.strokeStyle="rgba(222,180,110,0.85)";ctx.lineWidth=3*s;rr(ctx,-bw/2+8*s,-bh/2+8*s,bw-16*s,bh-16*s,6*s);ctx.stroke();ctx.restore();
    withA(ctx,fin(cl,0.6,0.4),()=>{T(ctx,"DOMESDAY",cx,cy-30*s,{w:800,size:40*s,align:"center",color:"rgba(232,196,128,0.95)"});T(ctx,"1086",cx,cy+24*s,{f:"mono",w:500,size:30*s,align:"center",color:"rgba(232,196,128,0.8)"});});}}

/* ---------- today: the region ---------- */
// the utility's region at night: hills, a dam and its lake, wind turbines, pylons carrying lines into town, a substation and houses
function d1_region(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const li=o.lines||0,ho=o.homes||0,ge=o.gen||0;withA(ctx,a,()=>{
  const hill=(y0,amp,seed,col)=>{ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(0,H);for(let x=0;x<=W;x+=40)ctx.lineTo(x,y0-amp*(0.5+0.5*Math.sin(x*0.004+seed))-amp*0.3*Math.sin(x*0.011+seed*2));ctx.lineTo(W,H);ctx.closePath();ctx.fill();};
  hill(520,90,1.3,"rgba(16,24,44,0.95)");hill(600,60,4.1,"rgba(10,16,32,0.98)");
  // the dam and its lake, on the left
  withA(ctx,0.5+0.5*ge,()=>{ctx.fillStyle="rgba(60,110,170,0.35)";ctx.beginPath();ctx.ellipse(250,520,190,26,0,0,TAU);ctx.fill();ctx.fillStyle="rgba(150,170,200,0.55)";ctx.beginPath();ctx.moveTo(400,500);ctx.lineTo(440,500);ctx.lineTo(460,590);ctx.lineTo(380,590);ctx.closePath();ctx.fill();
    if(ge>0)glow(ctx,420,560,90,[120,190,255],0.25*ge);});
  // wind turbines, on the ridge to the right
  [[1500,430,1],[1610,452,0.85],[1720,440,0.95]].forEach(([x,y,s],i)=>{withA(ctx,0.55+0.45*ge,()=>{ctx.strokeStyle="rgba(200,215,235,0.8)";ctx.lineWidth=4*s;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+150*s);ctx.stroke();
    const an=t*1.2+i*1.7;ctx.lineWidth=3*s;for(let b=0;b<3;b++){const q=an+b*TAU/3;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(q)*70*s,y+Math.sin(q)*70*s);ctx.stroke();}ctx.fillStyle="rgba(220,230,245,0.9)";ctx.beginPath();ctx.arc(x,y,5*s,0,TAU);ctx.fill();});});
  // pylons and lines, from the generators into town; the lines glow as li rises
  const PY=[[470,560],[700,600],[930,620],[1160,610],[1390,590]];PY.forEach(([x,y],i)=>{ctx.strokeStyle="rgba(170,190,220,0.7)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-16,y+70);ctx.lineTo(x,y-50);ctx.lineTo(x+16,y+70);ctx.moveTo(x-28,y-30);ctx.lineTo(x+28,y-30);ctx.moveTo(x-22,y-10);ctx.lineTo(x+22,y-10);ctx.stroke();});
  for(let i=0;i<PY.length-1;i++){const[x0,y0]=PY[i],[x1,y1]=PY[i+1];[-28,28].forEach(d=>{ctx.strokeStyle=rgba(mix([120,140,170],[255,220,140],li),0.5+0.4*li);ctx.lineWidth=1.6;ctx.shadowColor="rgba(255,220,140,"+0.8*li+")";ctx.shadowBlur=10*li;ctx.beginPath();ctx.moveTo(x0+d,y0-30);ctx.quadraticCurveTo((x0+x1)/2+d,(y0+y1)/2-6,x1+d,y1-30);ctx.stroke();ctx.shadowBlur=0;});}
  // the substation and the town
  ctx.fillStyle="rgba(120,140,170,0.5)";ctx.fillRect(1010,660,90,40);ctx.strokeStyle="rgba(170,190,220,0.7)";ctx.strokeRect(1010,660,90,40);
  for(let i=0;i<26;i++){const hx=560+hash(i,91)*820,hy=720+hash(i,92)*120,hw=34+hash(i,93)*30,hh=22+hash(i,94)*18,on=clamp(ho*1.6-hash(i,95)*0.6,0,1);
    ctx.fillStyle="rgba(22,30,50,0.98)";ctx.fillRect(hx,hy,hw,hh);ctx.beginPath();ctx.moveTo(hx-4,hy);ctx.lineTo(hx+hw/2,hy-14);ctx.lineTo(hx+hw+4,hy);ctx.closePath();ctx.fill();
    if(on>0){ctx.fillStyle="rgba(255,214,140,"+0.85*on+")";ctx.fillRect(hx+6,hy+6,8,8);if(hw>48)ctx.fillRect(hx+hw-14,hy+6,8,8);glow(ctx,hx+hw/2,hy+10,30,[255,210,140],0.12*on);}}});}

/* ---------- day one: the pile ---------- */
function d1_badge(ctx,x,y,s,o){o=o||{};withA(ctx,o.a==null?1:o.a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(o.rot||-0.06);ctx.strokeStyle="rgba(120,200,255,0.7)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-40*s,-150*s);ctx.lineTo(0,-70*s);ctx.lineTo(40*s,-150*s);ctx.stroke();
  glass(ctx,-90*s,-70*s,180*s,240*s,14*s,CYAN,{glow:14,ea:0.8,fill:"rgba(236,240,246,0.97)"});ctx.fillStyle="rgba(78,96,128,0.9)";rr(ctx,-50*s,-36*s,100*s,100*s,50*s);ctx.fill();
  T(ctx,"TOMÁS HERRERA",0,96*s,{w:800,size:17*s,align:"center",color:"rgba(30,34,44,1)",deco:1});T(ctx,"Enterprise architect",0,122*s,{w:600,size:14*s,align:"center",color:"rgba(70,76,90,1)",deco:1});
  ctx.fillStyle="rgba(60,170,150,0.9)";ctx.fillRect(-90*s,142*s,180*s,14*s);ctx.restore();});}
// an org chart: one box, then four, then twelve
function d1_org(ctx,x,y,w,h,o){o=o||{};withA(ctx,o.a==null?1:o.a,()=>{const col=o.col||[180,200,230],bx=(cx,cy,bw)=>{ctx.fillStyle="rgba(20,30,52,0.95)";rr(ctx,cx-bw/2,cy-12,bw,24,5);ctx.fill();ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=1.6;rr(ctx,cx-bw/2,cy-12,bw,24,5);ctx.stroke();};
  const r0=y+h*0.15,r1=y+h*0.5,r2=y+h*0.85;ctx.strokeStyle=rgba(col,0.5);ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(x+w/2,r0);ctx.lineTo(x+w/2,(r0+r1)/2);
  for(let i=0;i<4;i++){const cx=x+w*(0.14+i*0.24);ctx.moveTo(x+w*0.14,(r0+r1)/2);ctx.lineTo(x+w*0.86,(r0+r1)/2);ctx.moveTo(cx,(r0+r1)/2);ctx.lineTo(cx,r1);ctx.moveTo(cx,r1);ctx.lineTo(cx,(r1+r2)/2);for(let j=0;j<3;j++){const dx=cx+(j-1)*w*0.075;ctx.moveTo(cx,(r1+r2)/2);ctx.lineTo(dx,(r1+r2)/2);ctx.lineTo(dx,r2);}}ctx.stroke();
  bx(x+w/2,r0,w*0.22);for(let i=0;i<4;i++){const cx=x+w*(0.14+i*0.24);bx(cx,r1,w*0.18);for(let j=0;j<3;j++)bx(cx+(j-1)*w*0.075,r2,w*0.06);}});}
// the list of systems, scrolling; o.n counts how many have gone by
const D1_SYS=["OMS · outages","CIS · customers","SCADA · network control","GIS · network map","AMI head-end · meters","MDM · meter data","Billing","ERP · finance","EAM · assets","DMS · distribution","CRM","Field mobility","Data warehouse","HR · payroll","Spreadsheet · ops roster","Market gateway","Document store","Spreadsheet · tariffs"];
function d1_sysList(ctx,x,y,w,h,o){o=o||{};withA(ctx,o.a==null?1:o.a,()=>{glass(ctx,x,y,w,h,14,[170,205,255],{glow:12,ea:0.7,fill:"rgba(6,10,20,0.95)"});T(ctx,"systems",x+20,y+40,{f:"mono",w:500,size:26,color:"rgba(170,205,255,1)",deco:1});
  T(ctx,(o.count==null?140:o.count)+"",x+w-20,y+44,{w:800,size:38,align:"right",color:rgba(INK,1)});ctx.save();ctx.beginPath();ctx.rect(x+10,y+62,w-20,h-72);ctx.clip();const sc=(o.scroll||0)*30,rh=30;
  for(let i=0;i<Math.ceil((h-58)/rh)+2;i++){const k=Math.floor(sc/rh)+i,yy=y+72+i*rh-(sc%rh);T(ctx,D1_SYS[k%D1_SYS.length],x+22,yy+14,{f:"mono",w:500,size:16,color:rgba(SOFT,0.95),deco:1});}ctx.restore();});}
function d1_invite(ctx,x,y,w,o){o=o||{};withA(ctx,o.a==null?1:o.a,()=>{glass(ctx,x,y,w,130,14,EAC,{glow:12,ea:0.8,fill:"rgba(6,10,20,0.95)"});ctx.fillStyle=rgba(EAC,1);rr(ctx,x+16,y+18,8,94,4);ctx.fill();
  T(ctx,"Tue 10:00 · boardroom 2",x+40,y+46,{f:"mono",w:500,size:20,color:rgba(EAC,1),deco:1});T(ctx,"The transition program",x+40,y+100,{w:800,size:32});});}
function d1_manual(ctx,x,y,w,h,o){o=o||{};withA(ctx,o.a==null?1:o.a,()=>{for(let i=5;i>=0;i--){ctx.fillStyle=i?"rgba(225,220,205,0.95)":"rgba(48,72,110,1)";rr(ctx,x+i*5,y+i*5,w,h,8);ctx.fill();}
  ctx.strokeStyle="rgba(220,230,245,0.5)";ctx.lineWidth=1.5;rr(ctx,x+12,y+12,w-24,h-24,6);ctx.stroke();T(ctx,"Process manual",x+w/2,y+h*0.42,{w:800,size:24,align:"center",color:"rgba(236,240,248,1)",deco:1});
  T(ctx,"412 pages",x+w/2,y+h*0.62,{f:"mono",w:500,size:16,align:"center",color:"rgba(200,212,232,0.9)",deco:1});T(ctx,"revised 6 years ago",x+w/2,y+h*0.76,{f:"mono",w:500,size:16,align:"center",color:"rgba(200,212,232,0.9)",deco:1});});}
function d1_slide(ctx,x,y,w,h,o){o=o||{};withA(ctx,o.a==null?1:o.a,()=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=18;ctx.fillStyle="rgba(244,246,250,0.97)";ctx.fillRect(x,y,w,h);ctx.restore();
  ctx.fillStyle="rgba(60,170,150,0.9)";ctx.fillRect(x,y,w,10);T(ctx,"Our strategy",x+24,y+48,{w:800,size:18,color:"rgba(90,96,110,1)",deco:1});
  T(ctx,"Safe. Affordable. Reliable.",x+24,y+h*0.55,{w:800,size:Math.min(26,w*0.075),color:"rgba(30,34,44,1)",deco:1});T(ctx,"Clean. Ours.",x+24,y+h*0.55+40,{w:800,size:Math.min(26,w*0.075),color:"rgba(30,34,44,1)",deco:1});});}

/* ---------- pieces from different puzzles ---------- */
// a jigsaw piece's outline round (x,y,w,h); tabs [top, right, bottom, left]: 1 sticks out, -1 cuts in, 0 is flat
function d1_jigsaw(ctx,x,y,w,h,tabs){const edge=(x0,y0,x1,y1,tb)=>{const dx=x1-x0,dy=y1-y0,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,nx=uy,ny=-ux,r=Math.min(w,h)*0.13;
  if(!tb){ctx.lineTo(x1,y1);return;}const m0=0.38,m1=0.62;ctx.lineTo(x0+dx*m0,y0+dy*m0);
  ctx.bezierCurveTo(x0+dx*m0+nx*r*tb*0.2,y0+dy*m0+ny*r*tb*0.2,x0+dx*(m0-0.06)+nx*r*1.8*tb,y0+dy*(m0-0.06)+ny*r*1.8*tb,x0+dx*0.5+nx*r*1.9*tb,y0+dy*0.5+ny*r*1.9*tb);
  ctx.bezierCurveTo(x0+dx*(m1+0.06)+nx*r*1.8*tb,y0+dy*(m1+0.06)+ny*r*1.8*tb,x0+dx*m1+nx*r*tb*0.2,y0+dy*m1+ny*r*tb*0.2,x0+dx*m1,y0+dy*m1);ctx.lineTo(x1,y1);};
  ctx.beginPath();ctx.moveTo(x,y);edge(x,y,x+w,y,tabs[0]);edge(x+w,y,x+w,y+h,tabs[1]);edge(x+w,y+h,x,y+h,tabs[2]);edge(x,y+h,x,y,tabs[3]);ctx.closePath();}

/* ---------- the methods, named once ---------- */
const D1_METHODS=[["TOGAF","a way to do the work"],["ArchiMate","a language to draw it"],["Zachman","a grid to sort it"],["Business architecture","capabilities, value streams"],["Process frameworks","process catalogues"],["Domain-driven design","where meaning changes"],["Data management","who looks after data"]];
function d1_glyph(ctx,i,x,y,s,col){ctx.save();ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);ctx.lineWidth=Math.max(2,s*0.07);ctx.lineCap="round";ctx.lineJoin="round";
  if(i===0){for(let k=0;k<4;k++){const a0=k*TAU/4+0.25,a1=a0+TAU/4-0.5;ctx.beginPath();ctx.arc(x,y,s*0.8,a0,a1);ctx.stroke();const hx=x+Math.cos(a1)*s*0.8,hy=y+Math.sin(a1)*s*0.8,d=a1+Math.PI/2;ctx.beginPath();ctx.moveTo(hx,hy);ctx.lineTo(hx-Math.cos(d-0.5)*s*0.25,hy-Math.sin(d-0.5)*s*0.25);ctx.moveTo(hx,hy);ctx.lineTo(hx-Math.cos(d+0.5)*s*0.25,hy-Math.sin(d+0.5)*s*0.25);ctx.stroke();}}
  else if(i===1){[0,1,2].forEach(k=>{rhomb(ctx,x,y-s*0.5+k*s*0.5,s*1.8,s*0.6);ctx.stroke();});}
  else if(i===2){for(let r=0;r<6;r++)for(let c=0;c<6;c++)ctx.strokeRect(x-s*0.9+c*s*0.3,y-s*0.9+r*s*0.3,s*0.3,s*0.3);}
  else if(i===3){ctx.strokeRect(x-s*0.95,y-s*0.8,s*1.9,s*1.6);[[0,0],[1,0],[0,1],[1,1],[2,0],[2,1]].forEach(([c,r])=>ctx.strokeRect(x-s*0.8+c*s*0.55,y-s*0.6+r*s*0.62,s*0.45,s*0.5));}
  else if(i===4){const n=[[x,y-s*0.8]],L=[[x-s*0.7,y],[x,y],[x+s*0.7,y]];ctx.beginPath();L.forEach(([lx,ly])=>{ctx.moveTo(x,y-s*0.65);ctx.lineTo(lx,ly-s*0.15);});L.forEach(([lx,ly])=>{ctx.moveTo(lx,ly+s*0.15);ctx.lineTo(lx-s*0.2,ly+s*0.6);ctx.moveTo(lx,ly+s*0.15);ctx.lineTo(lx+s*0.2,ly+s*0.6);});ctx.stroke();
    [...n,...L].forEach(([px,py])=>{ctx.beginPath();ctx.arc(px,py,s*0.13,0,TAU);ctx.fill();});}
  else if(i===5){ctx.beginPath();ctx.arc(x-s*0.42,y,s*0.62,0,TAU);ctx.stroke();ctx.beginPath();ctx.arc(x+s*0.42,y,s*0.62,0,TAU);ctx.stroke();ctx.setLineDash([4,5]);ctx.beginPath();ctx.moveTo(x,y-s*0.9);ctx.lineTo(x,y+s*0.9);ctx.stroke();}
  else{ctx.beginPath();ctx.arc(x,y,s*0.85,0,TAU);ctx.stroke();for(let k=0;k<10;k++){const an=k*TAU/10;ctx.beginPath();ctx.moveTo(x+Math.cos(an)*s*0.3,y+Math.sin(an)*s*0.3);ctx.lineTo(x+Math.cos(an)*s*0.85,y+Math.sin(an)*s*0.85);ctx.stroke();}ctx.beginPath();ctx.arc(x,y,s*0.3,0,TAU);ctx.stroke();}
  ctx.restore();}
function d1_methodCard(ctx,i,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=o.col||[190,205,240];withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,col,{glow:12+10*(o.hi||0),ea:0.75,fill:"rgba(7,12,24,0.94)"});
  d1_glyph(ctx,i,x+58,y+h/2,30,col);T(ctx,D1_METHODS[i][0],x+110,y+h/2-8,{w:800,size:32});T(ctx,D1_METHODS[i][1],x+110,y+h/2+32,{w:600,size:28,color:rgba(SOFT,1)});});}

/* ---------- a bill, and the data rule ---------- */
function d1_bill(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,236,18,[200,210,230],{glow:12,ea:0.7,fill:"rgba(236,240,246,0.97)"});
  T(ctx,"Your bill",x+26,y+48,{w:800,size:30,color:"rgba(40,44,56,1)"});T(ctx,"$"+(o.amount||"412.80"),x+26,y+116,{w:800,size:52,color:rgba(o.bad?[200,50,50]:[40,44,56],1)});
  T(ctx,o.note||"an estimated reading",x+26,y+162,{w:600,size:28,color:"rgba(90,96,110,1)"});if(o.bad)withA(ctx,o.bad,()=>tag(ctx,x+26,y+204,"wrong",BAD,{size:28}));});}
