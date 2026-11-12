/* ===== Between the business and the systems: this film's pictures =====
   Chile in 1971, in lamp-light: the night over the country, a calendar and a factory's figures arriving six months late, the people
   who started Cybersyn as silhouettes, and inside a textile mill, the looms the engineers walked past. Then the utility: the three
   sheets that "information architecture" means (a website's menus, an analyst's model, TOGAF's method), DAMA's one discipline,
   TOGAF's four domains and ArchiMate's two layers with nothing between; one word, connection point, and its six records; the storm
   in January, the texts that went out and the households that got none; the systems' lifetimes and the decision on the network's ID.
   Everything is drawn to read on a phone: text at least 28 px in the frame, unless it's marked as texture. */

/* ---------- 1. Before any computer ---------- */
// the story's room: Chile at night, in lamp-light, a dark blue-grey with a warm haze near the ground, and dust in the air
function d1_night(ctx,S,t,o){o=o||{};setScreen(ctx,S);const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"#10151f");g.addColorStop(0.62,"#181d29");g.addColorStop(1,"#26201b");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  glow(ctx,960,1180,900,CY_LAMP,0.06);motes(ctx,t,{col:CY_LAMP,a:0.6,n:40});}
// a wall calendar on paper, its month turning as m goes from 0 (January) to 6 (July); each page flips over the one before
const D1_MONTHS=["January","February","March","April","May","June","July"];
function d1_calendar(ctx,x,y,m,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const w=300,h=250,i=clamp(Math.floor(m),0,6),f=m-Math.floor(m);
  sheet(ctx,x,y,w,h,{rot:-0.015,fill:CY_PAPER});ctx.fillStyle="rgba(150,52,40,0.9)";ctx.fillRect(x,y,w,56);
  for(let k=0;k<6;k++){ctx.fillStyle="#2a2624";ctx.beginPath();ctx.arc(x+40+k*44,y+10,6,0,TAU);ctx.fill();}
  T(ctx,"month",x+w/2,y+40,{f:"mono",w:500,size:28,align:"center",color:"rgba(250,240,225,0.95)"});
  const nm=D1_MONTHS[i];T(ctx,nm,x+w/2,y+150,{w:800,size:daFit(ctx,nm,52,800,w-40),align:"center",color:"rgba(46,42,40,0.95)"});
  // the page turning over to the next month, for a moment
  if(f>0.75&&i<6){const q=(f-0.75)/0.25;ctx.save();ctx.fillStyle=CY_PAPER;ctx.globalAlpha*=1-q;ctx.fillRect(x,y+56,w,(h-56)*(1-q));ctx.restore();}
  if(o.ring>0.01)ring(ctx,x+w/2,y+138,120,o.rcol||BAD,o.ring,3);});}
// a factory's figures on paper: a few bars and the month they're for, stamped; x, y its top-left
function d1_report(ctx,x,y,month,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const w=260,h=190;sheet(ctx,x,y,w,h,{rot:o.rot==null?0.02:o.rot,fill:"#f2ead6"});
  T(ctx,"output",x+24,y+46,{w:700,size:30,color:"rgba(52,48,46,0.92)"});
  for(let i=0;i<5;i++){const bh=20+hash(i,41)*60;ctx.fillStyle="rgba(80,90,110,0.6)";ctx.fillRect(x+30+i*36,y+h-30-bh,22,bh);}
  // the stamp: the month the figures are for
  ctx.save();ctx.translate(x+w-70,y+h-70);ctx.rotate(-0.18);ctx.strokeStyle="rgba(150,52,40,0.9)";ctx.lineWidth=3;rr(ctx,-62,-24,124,48,6);ctx.stroke();
  T(ctx,month,0,10,{w:800,size:28,align:"center",color:"rgba(150,52,40,0.95)"});ctx.restore();});}
// a card in the story: a name and a line under it, on dark glass in lamp-light
function d1_card(ctx,x,y,w,title,sub,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const h=sub?124:76;glass(ctx,x,y,w,h,18,o.col||CY_LAMP,{glow:14,ea:0.75,fill:"rgba(20,16,12,0.92)"});
  T(ctx,title,x+28,y+50,{w:800,size:o.size||36,color:rgba(o.col||CY_LAMP,1)});if(sub)T(ctx,sub,x+28,y+96,{w:600,size:28,color:rgba(INK,0.92)});});}
// a loom of the time, from the side: its iron frame, the warp threads running from the back beam to the cloth, lit by the lamp above;
// x, y: the middle of its feet; s: scale (1 = 250 px wide); t moves its reed
function d1_loom(ctx,x,y,s,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  ctx.strokeStyle="#26262c";ctx.lineWidth=9;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-110,0);ctx.lineTo(-100,-170);ctx.lineTo(100,-170);ctx.lineTo(110,0);ctx.moveTo(-104,-80);ctx.lineTo(104,-80);ctx.stroke();
  // the warp: fine threads from the back beam to the cloth, catching the light
  ctx.strokeStyle=rgba(mix(CY_PAPER===""?[0,0,0]:[230,220,196],CY_LAMP,0.3),0.42);ctx.lineWidth=1;for(let i=0;i<14;i++){ctx.beginPath();ctx.moveTo(-86,-128+i*1.6);ctx.lineTo(70,-118+i*1.2);ctx.stroke();}
  // the beams, and the cloth rolled at the front, pale
  ctx.fillStyle="#1c1c20";ctx.beginPath();ctx.arc(-88,-124,16,0,TAU);ctx.fill();ctx.fillStyle="#e8dcc0";ctx.beginPath();ctx.arc(80,-112,20,0,TAU);ctx.fill();ctx.fillStyle="rgba(160,140,110,0.5)";ctx.beginPath();ctx.arc(80,-112,9,0,TAU);ctx.fill();
  // the reed, beating the weft in, back and forth
  const rx=-6+Math.sin(t*5.5+(o.ph||0))*16;ctx.strokeStyle="#3a3a42";ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(rx,-160);ctx.lineTo(rx+8,-96);ctx.stroke();
  ctx.restore();});}
// inside a textile mill: a long hall under a sawtooth roof, its skylights pale, lamps hanging over a row of looms; the engineers walk
// its aisle in front of them. o.t moves the looms
function d1_mill(ctx,S,t,o){o=o||{};setScreen(ctx,S);const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"#1b1a1e");g.addColorStop(0.7,"#2a231e");g.addColorStop(1,"#191512");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
function d1_hall(ctx,t,o){o=o||{};
  // the roof's teeth, their glass pale with the day outside
  for(let i=0;i<7;i++){const x=-120+i*330;ctx.fillStyle="#141317";ctx.beginPath();ctx.moveTo(x,140);ctx.lineTo(x+250,40);ctx.lineTo(x+330,40);ctx.lineTo(x+330,140);ctx.closePath();ctx.fill();
    ctx.fillStyle="rgba(150,170,200,0.16)";ctx.fillRect(x+262,48,62,86);}
  ctx.fillStyle="#18161a";ctx.fillRect(-200,140,2400,26);
  // lamps hanging over the looms, each with its pool of light
  for(let i=0;i<6;i++){const lx=170+i*330;ctx.strokeStyle="rgba(30,28,30,1)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(lx,166);ctx.lineTo(lx,420);ctx.stroke();
    ctx.fillStyle="#2c2a2c";ctx.beginPath();ctx.moveTo(lx-34,446);ctx.lineTo(lx+34,446);ctx.lineTo(lx+14,420);ctx.lineTo(lx-14,420);ctx.closePath();ctx.fill();
    const cg=ctx.createLinearGradient(0,446,0,900);cg.addColorStop(0,rgba(CY_LAMP,0.16));cg.addColorStop(1,rgba(CY_LAMP,0));ctx.fillStyle=cg;ctx.beginPath();ctx.moveTo(lx-30,446);ctx.lineTo(lx+30,446);ctx.lineTo(lx+170,900);ctx.lineTo(lx-170,900);ctx.closePath();ctx.fill();
    glow(ctx,lx,452,60,CY_LAMP,0.5);}
  // the floor, and the row of looms along the far side of the aisle
  ctx.fillStyle="rgba(40,32,26,0.9)";ctx.fillRect(-200,830,2400,300);
  for(let i=0;i<7;i++)d1_loom(ctx,40+i*330,830,0.95,t,{ph:i*1.3});}
// Stafford Beer and CORFO's people at a table, as silhouettes: he was a big man with a beard; nobody's face is drawn. A lamp hangs over
// the table and lights its top and the papers on it, so the table reads in the dark
function d1_table(ctx,x,y,a){if(a<=0.01)return;withA(ctx,a,()=>{const ty=y-150;
  ctx.strokeStyle="rgba(30,28,30,1)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,ty-420);ctx.lineTo(x,ty-250);ctx.stroke();
  ctx.fillStyle="#2c2a2c";ctx.beginPath();ctx.moveTo(x-40,ty-222);ctx.lineTo(x+40,ty-222);ctx.lineTo(x+16,ty-250);ctx.lineTo(x-16,ty-250);ctx.closePath();ctx.fill();glow(ctx,x,ty-226,70,CY_LAMP,0.55);
  const cg=ctx.createLinearGradient(0,ty-222,0,ty);cg.addColorStop(0,rgba(CY_LAMP,0.14));cg.addColorStop(1,rgba(CY_LAMP,0.03));ctx.fillStyle=cg;ctx.beginPath();ctx.moveTo(x-36,ty-222);ctx.lineTo(x+36,ty-222);ctx.lineTo(x+250,ty);ctx.lineTo(x-250,ty);ctx.closePath();ctx.fill();
  ctx.fillStyle="#3a2e24";rr(ctx,x-260,ty,520,22,6);ctx.fill();ctx.fillStyle=rgba(CY_LAMP,0.42);ctx.fillRect(x-254,ty,508,3);ctx.fillStyle="#2a221c";ctx.fillRect(x-240,ty+22,14,128);ctx.fillRect(x+226,ty+22,14,128);
  ctx.fillStyle=CY_PAPER;[[-90,0.05],[30,-0.08]].forEach(([dx,r])=>{ctx.save();ctx.translate(x+dx,ty-4);ctx.rotate(r);ctx.fillRect(-54,-5,108,7);ctx.restore();});});}
// the people of the mill, in the engineers' drawing: a box under the flow, ringed like the steps, and named by what was counted
function d1_people(ctx,x,y,w,p,m){if(p<=0.01)return;pencilBox(ctx,x,y,w,80,"the people who work there",p,{size:30});
  if(m>0.01)withA(ctx,clamp(m*2,0,1),()=>{ctx.save();ctx.strokeStyle="rgba(178,62,46,0.9)";ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(x+w/2,y+40,w/2+14,54,0,-Math.PI/2,-Math.PI/2+TAU*clamp(m*1.3,0,1));ctx.stroke();ctx.restore();
    pencilText(ctx,"workers absent",x+w+44,y+52,{size:30,w:700,p:clamp(m*1.6-0.4,0,1),color:"rgba(150,52,40,0.95)"});});}

/* ---------- 3. Three meanings ---------- */
// a pinned sheet: paper on the wall, with a pin at the top
function d1_pin(ctx,x,y,w,h,a,rot,fn){if(a<=0.01)return;withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{rot:rot||0,fill:"#efe8da"});fn&&fn();ctx.fillStyle="#c44";ctx.beginPath();ctx.arc(x+w/2,y+14,7,0,TAU);ctx.fill();});}
// what the web team means: a website drawn in pencil, its menu, its pages and its search box
function d1_web(ctx,x,y,w,p){const ink="rgba(52,48,46,0.9)";pencilBox(ctx,x+30,y+60,w-60,300,"",clamp(p*2,0,1),{});
  withA(ctx,fin(p,0.3,0.3),()=>{ctx.strokeStyle=ink;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+30,y+110);ctx.lineTo(x+w-30,y+110);ctx.stroke();
    pencilBox(ctx,x+w-210,y+72,160,28,"",1,{});T(ctx,"search",x+w-196,y+95,{w:600,size:28,color:ink,deco:1});});
  ["Outages","Pay a bill","Moving home"].forEach((m,i)=>withA(ctx,fin(p,0.45+i*0.12,0.2),()=>T(ctx,m,x+56,y+170+i*58,{w:700,size:32,color:ink})));
  withA(ctx,fin(p,0.8,0.2),()=>{ctx.strokeStyle="rgba(52,48,46,0.4)";ctx.lineWidth=2;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(x+300,y+160+i*44);ctx.lineTo(x+w-60-(i%2)*50,y+160+i*44);ctx.stroke();}});}
// what the analyst means: the company's information as boxes, and how it flows between them, in pencil
function d1_model(ctx,x,y,w,p){const B=[["customer",24,90],["account",214,90],["bill",214,250],["payment",24,250]];
  B.forEach(([n,bx,by],i)=>pencilBox(ctx,x+bx,y+by,166,72,n,clamp(p*4-i*0.6,0,1),{size:30}));
  [[190,126,214,126],[297,162,297,250],[214,286,190,286]].forEach(([x0,y0,x1,y1],i)=>{const q=clamp(p*4-1.6-i*0.5,0,1);if(q>0)arrowTo(ctx,x+x0,y+y0,x+lerp(x0,x1,1),y+lerp(y0,y1,1),[52,48,46],0.85,{p:q,lw:2.2});});}
// what Tomás means: TOGAF's method as its wheel of phases, A to H round the requirements, with phase C, information systems, lit
function d1_adm(ctx,cx,cy,r,p,hi){const L=["A","B","C","D","E","F","G","H"];withA(ctx,fin(p,0,0.3),()=>{ring(ctx,cx,cy,r,[52,48,46],0.5,2);
  ctx.fillStyle="rgba(52,48,46,0.08)";ctx.beginPath();ctx.arc(cx,cy,r*0.42,0,TAU);ctx.fill();ring(ctx,cx,cy,r*0.42,[52,48,46],0.7,2);T(ctx,"needs",cx,cy+10,{w:700,size:28,align:"center",color:"rgba(52,48,46,0.9)"});});
  L.forEach((l,i)=>{const q=clamp(p*10-1-i,0,1);if(q<=0)return;const an=-Math.PI/2+i*TAU/8,px=cx+Math.cos(an)*r,py=cy+Math.sin(an)*r,on=l==="C";
    withA(ctx,q,()=>{ctx.fillStyle=on&&hi>0?rgba(mix([239,232,218],[255,186,150],hi),1):"#efe8da";ctx.beginPath();ctx.arc(px,py,34,0,TAU);ctx.fill();ctx.strokeStyle=on&&hi>0?rgba([200,90,60],0.6+0.4*hi):"rgba(52,48,46,0.8)";ctx.lineWidth=on&&hi>0?3.5:2;ctx.stroke();
      T(ctx,l,px,py+11,{w:800,size:32,align:"center",color:"rgba(46,42,40,0.95)"});});});}

/* ---------- 4. One discipline ---------- */
// a book of knowledge, closed, its title on the cover
function d1_book(ctx,x,y,title,a){if(a<=0.01)return;withA(ctx,a,()=>{const w=240,h=300;ctx.save();ctx.shadowColor="rgba(0,0,0,0.6)";ctx.shadowBlur=24;ctx.fillStyle="#2c3a52";rr(ctx,x,y,w,h,10);ctx.fill();ctx.restore();
  ctx.fillStyle="#22304a";ctx.fillRect(x,y,26,h);ctx.fillStyle="#e8dfcc";ctx.fillRect(x+w-10,y+10,8,h-20);ctx.strokeStyle="rgba(255,226,180,0.6)";ctx.lineWidth=2;ctx.strokeRect(x+44,y+36,w-72,h-72);
  const[t1,t2]=title.split("-");T(ctx,t1,x+w/2+12,y+124,{size:30,w:800,align:"center",color:"rgba(255,232,196,0.9)"});T(ctx,t2,x+w/2+12,y+176,{size:40,w:800,align:"center",color:"rgba(255,232,196,0.97)"});
  ctx.fillStyle="rgba(255,226,180,0.5)";ctx.fillRect(x+w/2-40,y+200,104,2);});}
// a word on a chip of glass: data, information, or the discipline that holds them both
function d1_word(ctx,cx,cy,word,sub,col,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const w=Math.max(tw(ctx,word,40,800),sub?tw(ctx,sub,28,600):0)+80,h=sub?120:80;
  glass(ctx,cx-w/2,cy-h/2,w,h,20,col,{glow:14+16*(o.hi||0),ea:0.85,fill:"rgba(8,12,22,0.94)"});T(ctx,word,cx,cy+(sub?-6:14),{w:800,size:40,align:"center"});
  if(sub)T(ctx,sub,cx,cy+38,{w:600,size:28,align:"center",color:rgba(mix(col,INK,0.4),1)});});}
// TOGAF's four domains, as boxes in a row, with data and applications held together as information systems
function d1_domains(ctx,x,y,p,br){const D=[["business",BUSC],["data",INFC],["applications",APPC],["technology",TECC]],w=300,g=30;
  D.forEach(([n,c],i)=>{const q=clamp(p*5-i,0,1);if(q<=0)return;arrive(ctx,x+i*(w+g)+w/2,y+50,q*0.75,0,()=>{glass(ctx,x+i*(w+g),y,w,100,14,c,{glow:12,ea:0.85,fill:"rgba(7,12,24,0.94)"});
    T(ctx,n,x+i*(w+g)+w/2,y+62,{w:800,size:34,align:"center",color:rgba(mix(c,INK,0.3),1)});});});
  if(br>0.01){const x0=x+w+g-8,x1=x+3*w+2*g+8,c=mix(INFC,APPC,0.5);withA(ctx,br,()=>{ctx.save();ctx.strokeStyle=rgba(c,0.95);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x0,y+122);ctx.lineTo(x0,y+142);
    ctx.lineTo(lerp(x0,x1,ease(clamp(br*1.4,0,1))),y+142);if(br>0.7)ctx.lineTo(x1,y+122);ctx.stroke();ctx.restore();T(ctx,"information systems architectures",(x0+x1)/2,y+192,{w:700,size:32,align:"center",color:rgba(c,1)});});}}
// a layer as ArchiMate draws its two: a long band with its name, and an element in it
function d1_band(ctx,x,y,w,h,name,col,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.fillStyle=rgba(col,0.07+0.08*(o.hi||0));ctx.strokeStyle=rgba(col,0.6+0.3*(o.hi||0));ctx.lineWidth=2;if(o.dash)ctx.setLineDash(o.dash);
  rr(ctx,x,y,w,h,14);ctx.fill();ctx.stroke();ctx.restore();T(ctx,name,x+26,y+46,{w:800,size:30,color:rgba(mix(col,INK,0.35),1)});});}

/* ---------- 5. One word, six records ---------- */
// the six records of a connection point: what each system calls it, and the system; [name, system]
const D1_REC=[["service point","network map"],["metering point","meter data"],["premise","billing"],["supply address","customer service"],["service location","outage system"],["connection_point","data platform"]];
// where each record sits, relative to the model's left edge: four in the upper row, and two in the lower row, each under a gap of the
// row above, so that every line runs clear to the business object without crossing a record or another line
const D1_RW=360,D1_RH=118,D1_POS=[[90,400],[550,400],[1010,400],[1470,400],[320,588],[1240,588]];
const d1_recXY=i=>D1_POS[i];
// where each record's line meets the business object's lower edge, left to right in the order the lines arrive there
const D1_AT=[800,930,990,1120,870,1050];
// a record's line, as points from the record up to the business object: straight up from the upper row; from the lower row, straight
// up through the gap first. And where its owner's mark sits on it, all at one height
function d1_route(i,X,by){const[rx,ry]=D1_POS[i],cx=X+rx+D1_RW/2,ax=X+D1_AT[i];return ry>500?[[cx,ry],[cx,380],[ax,by]]:[[cx,ry],[ax,by]];}
function d1_mark(i,X,by){const P=d1_route(i,X,by),[a,b]=P.slice(-2),f=(a[1]-290)/(a[1]-b[1]);return[lerp(a[0],b[0],f),290];}
// a line drawn along points, dotted, as realisation is: p (0..1) draws it from the record; the hollow arrowhead where it arrives
function d1_real(ctx,P,p,o){o=o||{};if(p<=0.01)return;const L=[];let tot=0;for(let k=1;k<P.length;k++){const d=Math.hypot(P[k][0]-P[k-1][0],P[k][1]-P[k-1][1]);L.push(d);tot+=d;}
  let left=p*tot;for(let k=1;k<P.length;k++){const last=k===P.length-1,seg=L[k-1];if(left<=0)break;const q=clamp(left/seg,0,1);
    if(last)daReal(ctx,P[k-1][0],P[k-1][1],P[k][0],P[k][1],q,o);else{withA(ctx,o.a==null?1:o.a,()=>{ctx.save();ctx.strokeStyle=rgba(o.col||mix(BUSC,INFC,0.5),0.9);ctx.lineWidth=o.lw||2.6;ctx.setLineDash([3,7]);ctx.lineCap="round";
      ctx.beginPath();ctx.moveTo(P[k-1][0],P[k-1][1]);ctx.lineTo(lerp(P[k-1][0],P[k][0],q),lerp(P[k-1][1],P[k][1],q));ctx.stroke();ctx.restore();});}
    left-=seg;}}
// the same route, faint and dashed: a line nobody has drawn yet
function d1_faint(ctx,P,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(SOFT,0.6);ctx.lineWidth=2.2;ctx.setLineDash([3,9]);ctx.beginPath();P.forEach(([x,y],k)=>k?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();ctx.restore();});}
// a storm over the network: rain, and a flash of lightning at f
function d1_storm(ctx,x,y,w,h,t,f,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.beginPath();rr(ctx,x,y,w,h,18);ctx.clip();ctx.fillStyle="rgba(10,14,22,0.95)";ctx.fillRect(x,y,w,h);
  ctx.strokeStyle="rgba(160,180,210,0.25)";ctx.lineWidth=1.4;for(let i=0;i<60;i++){const rx=x+((hash(i,61)*w+t*40)%w),ry=y+((hash(i,62)*h+t*520)%h);ctx.beginPath();ctx.moveTo(rx,ry);ctx.lineTo(rx-6,ry+18);ctx.stroke();}
  if(f>0&&f<1){ctx.fillStyle="rgba(220,230,255,"+(0.3*(1-f))+")";ctx.fillRect(x,y,w,h);ctx.strokeStyle="rgba(235,240,255,"+(1-f)+")";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+w*0.6,y);ctx.lineTo(x+w*0.52,y+h*0.35);ctx.lineTo(x+w*0.6,y+h*0.4);ctx.lineTo(x+w*0.48,y+h*0.8);ctx.stroke();}
  ctx.restore();glass(ctx,x,y,w,h,18,[150,170,210],{glow:8,ea:0.5,fill:"rgba(0,0,0,0)"});});}
// a home on a street: its roof, its windows dark or lit; a tick or a cross over it once the text has come or hasn't
function d1_home(ctx,x,y,s,lit,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle="#2a2e38";ctx.fillRect(-40,-50,80,50);ctx.fillStyle="#1e2128";ctx.beginPath();ctx.moveTo(-48,-48);ctx.lineTo(0,-86);ctx.lineTo(48,-48);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba(mix([22,26,34],CY_LAMP,lit),1);ctx.fillRect(-28,-38,20,18);ctx.fillRect(8,-38,20,18);ctx.fillStyle="#15171c";ctx.fillRect(-8,-24,16,24);ctx.restore();
  if(o.mark>0.01){if(o.ok)kt_gtick(ctx,x,y-110*s,18,o.mark);else kt_rcross(ctx,x,y-110*s,18,o.mark);}});}
// a text message, as a phone shows one: a bubble with its words
function d1_text(ctx,x,y,w,s,a){if(a<=0.01)return;withA(ctx,a,()=>{const h=88;glass(ctx,x,y,w,h,22,[150,220,190],{glow:10,ea:0.8,fill:"rgba(10,22,20,0.94)"});
  T(ctx,s,x+24,y+56,{w:600,size:28,color:rgba(INK,0.95)});});}
// two ways of writing one address, one line each, as the two systems keep it
function d1_addr(ctx,x,y,a,hi){if(a<=0.01)return;withA(ctx,a,()=>{const w=700;glass(ctx,x,y,w,190,16,BAD,{glow:10+10*hi,ea:0.7,fill:"rgba(16,8,10,0.94)"});
  T(ctx,"outage system",x+26,y+48,{f:"mono",w:500,size:28,color:rgba(SOFT,0.95)});T(ctx,"Unit 3, 12 Mill Road",x+300,y+48,{f:"mono",w:500,size:28,color:rgba(INK,1)});
  T(ctx,"customer service",x+26,y+98,{f:"mono",w:500,size:28,color:rgba(SOFT,0.95)});T(ctx,"3/12 MILL RD",x+300,y+98,{f:"mono",w:500,size:28,color:rgba(INK,1)});
  T(ctx,"no match: no text",x+26,y+156,{w:800,size:30,color:rgba(BAD,1)});});}

/* ---------- 6. An architecture of its own ---------- */
// how long each thing has lived: the connection points since the network was built, and the systems that came and went; years on a line
const D1_LIFE=[["connection points",1958,2026.9,INFC],["network map",2004,2026.9,APPC],["meter data",2016,2026.9,APPC],["old billing",1998,2026.2,APPC],["new billing",2026.2,2026.9,APPC],["outage system",2011,2026.9,APPC]];
function d1_life(ctx,x,y,w,p,mar,a){if(a<=0.01)return;withA(ctx,a,()=>{const y0=1955,y1=2027,X=v=>x+250+(v-y0)/(y1-y0)*(w-250);
  T(ctx,"1960",X(1960),y-14,{f:"mono",w:500,size:28,align:"center",color:rgba(SOFT,0.85)});T(ctx,"1990",X(1990),y-14,{f:"mono",w:500,size:28,align:"center",color:rgba(SOFT,0.85)});T(ctx,"2026",X(2026),y-14,{f:"mono",w:500,size:28,align:"center",color:rgba(SOFT,0.85)});
  D1_LIFE.forEach(([n,a0,a1,c],i)=>{const q=clamp(p*7-i,0,1);if(q<=0)return;const ry=y+20+i*52,isNew=n==="new billing",qq=isNew?mar:q;if(qq<=0.01)return;
    withA(ctx,clamp(qq*2,0,1),()=>{T(ctx,n,x,ry+30,{w:700,size:28,color:rgba(mix(c,INK,0.35),1)});const xe=lerp(X(a0),X(a1),ease(clamp(qq*1.2,0,1)));ctx.fillStyle=rgba(c,0.75);rr(ctx,X(a0),ry+12,Math.max(4,xe-X(a0)),22,11);ctx.fill();
      if(n==="old billing"&&mar>0.01)withA(ctx,mar,()=>T(ctx,"March",X(a1)+14,ry+32,{w:700,size:28,color:rgba(BAD,0.95)}));});});});}
// the network's ID for one connection point, on a small chip
function d1_id(ctx,x,y,a,hi){if(a<=0.01)return;withA(ctx,a,()=>{const s="CP-0048213",w=tw(ctx,s,28,500,"mono")+36;glass(ctx,x,y-22,w,44,10,TRUST,{glow:8+12*(hi||0),ea:0.8,fill:"rgba(20,16,6,0.94)"});
  T(ctx,s,x+18,y+10,{f:"mono",w:500,size:28,color:rgba(TRUST,1)});});}
