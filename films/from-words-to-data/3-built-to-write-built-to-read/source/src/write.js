/* ===== Built to write, built to read: the film's own pictures =====
   The merchants' books of 1494 (a journal written in time order, a ledger read by account), tables with their keys, a transaction,
   a signed document, a star with its facts and dimensions, a dimension that keeps its history, and the two shapes side by side.
   Blue is the shape built to write; green is the shape built to read; warm ink is 1494. The labs and the scenarios draw with these too. */
const BW_W=[110,190,255],BW_R=[120,225,170],BW_INK=[240,196,120],BW_AMB=[255,190,90];
const BW_FAC={sci:{n:"Science",c:[255,176,110]},eng:{n:"Engineering",c:[178,158,255]},arts:{n:"Arts",c:[240,130,180]}};
const BW_TEN=[10480,10760,10990,11120,11300,11520,11640,11730,11810,11890];   // credentials awarded, 2017 to 2026: 113,240 in ten years

/* ---------- ink, paper and a quill: 1494 ---------- */
// handwriting: Manrope, slanted, in brown ink, written out as p goes from 0 to 1
function bw_ink(ctx,s,x,y,o){o=o||{};const p=o.p==null?1:o.p;if(p<=0)return;ctx.save();ctx.font="italic "+(o.w||600)+" "+(o.size||24)+"px "+FT.sans;ctx.textAlign=o.align||"left";
  ctx.fillStyle=o.color||"rgba(64,38,20,0.92)";ctx.fillText(typeOn(s,p),x,y);ctx.restore();}
function bw_inkW(ctx,s,size,w){ctx.save();ctx.font="italic "+(w||600)+" "+size+"px "+FT.sans;const m=ctx.measureText(s).width;ctx.restore();return m;}
// a book, open: one page or a spread of two, on a leather cover, with faint ruled lines
function bw_book(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();
  ctx.shadowColor="rgba(0,0,0,0.65)";ctx.shadowBlur=34;ctx.shadowOffsetY=12;ctx.fillStyle="#3e2414";rr(ctx,x-16,y-14,w+32,h+30,12);ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  ctx.strokeStyle="rgba(214,160,90,0.45)";ctx.lineWidth=1.5;rr(ctx,x-9,y-7,w+18,h+16,9);ctx.stroke();
  const n=o.pages||1,pw=w/n;
  for(let i=0;i<n;i++){const px=x+i*pw,g=ctx.createLinearGradient(px,y,px+pw,y+h);g.addColorStop(0,"#f0e3c6");g.addColorStop(1,"#d6c29a");ctx.fillStyle=g;ctx.fillRect(px,y,pw,h);
    if(n===2){const gx=i?px:px+pw-46,sg=ctx.createLinearGradient(gx,0,gx+46,0);sg.addColorStop(i?0:1,"rgba(80,50,20,0.34)");sg.addColorStop(i?1:0,"rgba(80,50,20,0)");ctx.fillStyle=sg;ctx.fillRect(gx,y,46,h);}}
  ctx.strokeStyle="rgba(120,80,40,0.14)";ctx.lineWidth=1;for(let yy=y+(o.top||96);yy<y+h-16;yy+=(o.lh||40)){ctx.beginPath();ctx.moveTo(x+24,yy);ctx.lineTo(x+w-24,yy);ctx.stroke();}
  ctx.strokeStyle="rgba(170,60,40,0.22)";for(let i=0;i<n;i++){const mx=x+i*pw+(o.margin||70);ctx.beginPath();ctx.moveTo(mx,y+12);ctx.lineTo(mx,y+h-12);ctx.stroke();}
  if(o.title)bw_ink(ctx,o.title,x+(o.titleX||40),y+54,{size:34,w:800,color:"rgba(90,40,20,0.95)"});
  ctx.restore();});}
// a quill, its nib at (x,y), leaning up and to the right
function bw_quill(ctx,x,y,s,a,t){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin((t||0)*9)*0.03);ctx.scale(s,s);
  glow(ctx,90,-160,120,BW_INK,0.12);
  ctx.beginPath();ctx.moveTo(26,-44);ctx.quadraticCurveTo(10,-150,176,-300);ctx.quadraticCurveTo(150,-170,54,-40);ctx.closePath();
  const g=ctx.createLinearGradient(20,-40,176,-300);g.addColorStop(0,"#d9c9a8");g.addColorStop(1,"#fbf5e8");ctx.fillStyle=g;ctx.fill();
  ctx.strokeStyle="rgba(255,230,180,0.9)";ctx.lineWidth=1.6;ctx.shadowColor=rgba(BW_INK,0.8);ctx.shadowBlur=10;ctx.stroke();ctx.shadowBlur=0;
  ctx.strokeStyle="rgba(150,120,80,0.5)";ctx.lineWidth=1;for(let i=1;i<9;i++){const u=i/9,px=lerp(18,168,u),py=lerp(-30,-288,u);ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px-22+u*8,py-10-u*6);ctx.moveTo(px,py);ctx.lineTo(px+20-u*6,py+2);ctx.stroke();}
  ctx.strokeStyle="#8a6a44";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(40,-80,176,-300);ctx.stroke();
  ctx.fillStyle="#2a1a10";ctx.beginPath();ctx.moveTo(-2,2);ctx.lineTo(8,-20);ctx.lineTo(16,-16);ctx.closePath();ctx.fill();
  ctx.restore();});}
// a parchment plate with a title, for the book the scene comes from
function bw_plate(ctx,x,y,s,sub,a,k){if(a<=0.01)return;k=k||1;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(k,k);const w=Math.max(bw_inkW(ctx,s,40,800),sub?tw(ctx,sub,20,600):0)+80,h=sub?112:74;
  ctx.shadowColor="rgba(0,0,0,0.6)";ctx.shadowBlur=24;ctx.fillStyle="#e7d6b0";rr(ctx,-w/2,-h/2,w,h,10);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle="rgba(120,80,40,0.55)";ctx.lineWidth=2;rr(ctx,-w/2+7,-h/2+7,w-14,h-14,6);ctx.stroke();
  bw_ink(ctx,s,0,sub?-4:14,{size:40,w:800,align:"center",color:"rgba(80,36,18,0.95)"});if(sub)T(ctx,sub,0,34,{w:600,size:20,align:"center",color:"rgba(90,60,36,0.9)"});ctx.restore();});}
// Venice, in silhouette, low on the horizon
function bw_venice(ctx,y,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.fillStyle="rgba(40,24,14,0.9)";ctx.beginPath();ctx.moveTo(0,y+40);
  const B=[[0,30],[120,20],[160,-30],[200,-30],[210,20],[330,10],[360,-60],[372,-160],[384,-170],[396,-160],[408,-60],[430,10],[520,0],[540,-40],[560,-70],[600,-80],[640,-70],[660,-40],[700,0],[760,-20],[800,-20],[820,10],
    [980,20],[1040,-10],[1060,-50],[1090,-60],[1120,-50],[1140,-10],[1300,10],[1340,-40],[1350,-110],[1362,-118],[1374,-110],[1384,-40],[1420,10],[1560,0],[1600,-30],[1680,-30],[1700,10],[1920,20],[1920,60]];
  B.forEach(([bx,by])=>ctx.lineTo(bx,y+by));ctx.lineTo(1920,1080);ctx.lineTo(0,1080);ctx.closePath();ctx.fill();
  [[600,-80,40],[1090,-60,30]].forEach(([bx,by,r])=>{ctx.beginPath();ctx.arc(bx,y+by+6,r,Math.PI,TAU);ctx.fill();});
  ctx.fillStyle="rgba(255,200,130,0.10)";ctx.fillRect(0,y+40,1920,2);ctx.restore();});}

/* ---------- the journal and the ledger ---------- */
// four entries, as they happened: date, what happened, ducats, the account debited, the account credited
const BW_J=[["8 Nov","Cloth bought for cash",40,"Cloth","Cash"],["9 Nov","Spices sold for cash",25,"Cash","Spices"],["11 Nov","Spices bought for cash",30,"Spices","Cash"],["12 Nov","Cloth sold for cash",55,"Cash","Cloth"]];
const BW_JX=100,BW_JY=180,BW_JW=620,BW_JH=570;         // the journal
const BW_LX=790,BW_LY=180,BW_LW=1030,BW_LH=570;        // the ledger, a spread of two pages
// where each account sits on the ledger's pages
const BW_ACC={Cloth:{x:BW_LX+36,y:BW_LY+96},Spices:{x:BW_LX+36,y:BW_LY+330},Cash:{x:BW_LX+BW_LW/2+30,y:BW_LY+96}};
function bw_entryY(i){return BW_JY+132+i*112;}
// the ledger line an entry lands on: side 0 is debit, 1 is credit; k counts the lines already on that side of the account
function bw_cell(acc,side,k){const A=BW_ACC[acc];return{x:A.x+(side?248:14),r:A.x+(side?448:214),y:A.y+108+k*40};}
function bw_postings(){const L=[];const cnt={};BW_J.forEach((e,i)=>{[[e[3],0],[e[4],1]].forEach(([acc,side])=>{const key=acc+side;cnt[key]=cnt[key]||0;L.push({i,acc,side,k:cnt[key]++,amt:e[2],date:e[0]});});});return L;}
const BW_POST=bw_postings();

/* ---------- today: awards written one by one, and ten years read at once ---------- */
function bw_awardTile(ctx,x,y,w,h,a,flash){if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,8,BW_W,{glow:6+14*(flash||0),ea:0.5+0.5*(flash||0),fill:"rgba(8,16,34,0.92)"});
  ctx.fillStyle=rgba(TRUST,0.9);ctx.beginPath();ctx.arc(x+16,y+h/2-4,7,0,TAU);ctx.fill();ctx.fillRect(x+12,y+h/2+1,3,10);ctx.fillRect(x+18,y+h/2+1,3,10);
  ctx.fillStyle=rgba(INK,0.55);rr(ctx,x+30,y+h/2-8,w-42,5,2);ctx.fill();ctx.fillStyle=rgba(SOFT,0.35);rr(ctx,x+30,y+h/2+4,(w-42)*0.6,5,2);ctx.fill();
  if(flash)glow(ctx,x+w/2,y+h/2,w*0.8,BW_W,0.35*flash);});}
// a slab of one year's data, drawn in depth; lit (0..1) when it's being read
function bw_slab(ctx,x,y,w,d,col,a,label,lit){if(a<=0.01)return;withA(ctx,a,()=>{const th=16,sk=70;lit=lit||0;
  ctx.fillStyle=rgba(mix([14,26,30],col,0.18+0.35*lit),0.95);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w,y);ctx.lineTo(x+w+sk,y-d);ctx.lineTo(x+sk,y-d);ctx.closePath();ctx.fill();
  ctx.strokeStyle=rgba(col,0.45+0.5*lit);ctx.lineWidth=1.6;ctx.stroke();
  ctx.fillStyle=rgba(mix([8,16,20],col,0.10+0.3*lit),0.95);ctx.fillRect(x,y,w,th);ctx.strokeRect(x,y,w,th);
  for(let i=0;i<14;i++){ctx.fillStyle=rgba(col,(0.15+0.55*lit)*(0.5+0.5*hash(i,label.length)));ctx.fillRect(x+sk*0.5+14+i*(w-40)/14,y-d*0.5-3,(w-40)/14-6,6);}
  if(lit>0.02)glow(ctx,x+w/2+sk/2,y-d/2,w*0.55,col,0.18*lit);
  T(ctx,label,x+w+sk+20,y-d/2+7,{f:"mono",w:500,size:18,color:rgba(col,0.6+0.4*lit)});});}

/* ---------- tables, keys and links: the shape built to write ---------- */
// a key, for the column that identifies each row
function bw_key(ctx,x,y,s,col,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2.4;ctx.shadowColor=rgba(col,0.8);ctx.shadowBlur=6;
  ctx.beginPath();ctx.arc(-5,0,5.5,0,TAU);ctx.moveTo(0.5,0);ctx.lineTo(12,0);ctx.moveTo(8,0);ctx.lineTo(8,5);ctx.moveTo(12,0);ctx.lineTo(12,5);ctx.stroke();ctx.restore();});}
// an arrow out of a cell: this column points to a row in another table
function bw_fkMark(ctx,x,y,s,col,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2.2;ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(-7,6);ctx.lineTo(6,-7);ctx.moveTo(-1,-7);ctx.lineTo(6,-7);ctx.lineTo(6,0);ctx.stroke();ctx.restore();});}
/* a table of rows. o: name, cols [[name,"pk"|"fk"|""]], rows, col, a, cw (column widths), size, rh (row height), keyA, fkA,
   rowA(j) (a row's opacity), rowBg(j) ([colour, alpha] behind a row), cell(j,i) ({text, col, hi, strike, bold}). Returns its geometry. */
function bw_tbl(ctx,x,y,o){const cols=o.cols,rows=o.rows,sz=o.size||22,rh=o.rh||50,hh=o.name?48:0,ch=o.ch||44,col=o.col||BW_W,a=o.a==null?1:o.a;
  const cw=o.cw||cols.map((c,i)=>Math.max(tw(ctx,c[0],sz-2,500,"mono")+(c[1]?30:0),...rows.map(r=>tw(ctx,String(r[i]),sz,500,"mono")))+30);
  const w=cw.reduce((p,v)=>p+v,0),h=hh+ch+rh*rows.length,cx=[];let acc=x;cw.forEach(v=>{cx.push(acc);acc+=v;});
  const G={x,y,w,h,cx,cw,rh,rowY:j=>y+hh+ch+rh*j+rh/2,colX:i=>cx[i]+cw[i]/2,headY:y+hh+ch/2};if(a<=0.01)return G;
  withA(ctx,a,()=>{if(o.hi)glow(ctx,x+w/2,y+h/2,Math.max(w,h)*0.7,o.hiCol||col,0.25*o.hi);
    glass(ctx,x,y,w,h,12,col,{glow:(o.glow||14)+12*(o.hi||0),ea:0.7+0.3*(o.hi||0),fill:"rgba(7,12,24,0.95)",lw:o.dash?0.01:1.6});
    if(o.dash){ctx.save();ctx.setLineDash([9,7]);ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=1.8;rr(ctx,x,y,w,h,12);ctx.stroke();ctx.restore();}
    if(o.name)T(ctx,o.name,x+16,y+33,{f:"mono",w:500,size:Math.max(18,sz-2),color:rgba(col,1)});
    ctx.fillStyle=rgba(col,0.07);ctx.fillRect(x+1,y+hh,w-2,ch);
    cols.forEach((c,i)=>{let tx=cx[i]+14;if(c[1]==="pk"){bw_key(ctx,tx+7,G.headY,1.1,REF,o.keyA==null?1:o.keyA);tx+=28;}if(c[1]==="fk"){bw_fkMark(ctx,tx+7,G.headY,1.1,col,o.fkA==null?1:o.fkA);tx+=28;}
      T(ctx,c[0],tx,G.headY+7,{f:"mono",w:500,size:sz-2,color:rgba(c[1]==="pk"?REF:SOFT,1)});});
    ctx.strokeStyle="rgba(170,200,245,0.16)";ctx.lineWidth=1;for(let j=0;j<=rows.length;j++){ctx.beginPath();ctx.moveTo(x+8,y+hh+ch+rh*j);ctx.lineTo(x+w-8,y+hh+ch+rh*j);ctx.stroke();}
    rows.forEach((r,j)=>{const ra=o.rowA?o.rowA(j):1;if(ra<=0.01)return;withA(ctx,ra,()=>{const ry=G.rowY(j);
      if(o.rowBg){const b=o.rowBg(j);if(b&&b[1]>0.01){ctx.fillStyle=rgba(b[0],0.16*b[1]);rr(ctx,x+4,ry-rh/2+2,w-8,rh-4,6);ctx.fill();}}
      r.forEach((v,i)=>{const st=(o.cell&&o.cell(j,i))||{},s=st.text!=null?st.text:String(v),c=st.col||INK;
        if(st.hi>0.01){ctx.fillStyle=rgba(st.hiCol||c,0.2*st.hi);rr(ctx,cx[i]+5,ry-rh/2+4,cw[i]-10,rh-8,6);ctx.fill();ctx.strokeStyle=rgba(st.hiCol||c,0.85*st.hi);ctx.lineWidth=2;rr(ctx,cx[i]+5,ry-rh/2+4,cw[i]-10,rh-8,6);ctx.stroke();}
        T(ctx,s,cx[i]+14,ry+sz*0.36,{f:"mono",w:500,size:sz,color:rgba(c,st.dim?0.45:0.95)});
        if(st.strike>0.01){const sw=tw(ctx,s,sz,500,"mono");ctx.strokeStyle=rgba(BAD,st.strike);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(cx[i]+10,ry);ctx.lineTo(cx[i]+18+sw*st.strike,ry);ctx.stroke();}});});});});
  return G;}
// a link between two tables: from a key (one) to the rows that point to it (many), as a bar and a crow's foot, along an elbow
function bw_rel(ctx,x0,y0,x1,y1,col,a,o){o=o||{};const p=o.p==null?1:o.p;if(a<=0.01||p<=0)return;const ym=o.ym==null?(y0+y1)/2:o.ym,pts=[[x0,y0],[x0,ym],[x1,ym],[x1,y1]];
  const L=[0];for(let i=1;i<4;i++)L.push(L[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));const tot=L[3]*clamp(p,0,1);
  ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=o.lw||2.2;ctx.shadowColor=rgba(col,0.8);ctx.shadowBlur=8;if(o.dash)ctx.setLineDash(o.dash);
  ctx.beginPath();ctx.moveTo(x0,y0);for(let i=1;i<4;i++){if(L[i]<=tot)ctx.lineTo(pts[i][0],pts[i][1]);else{const f=(tot-L[i-1])/((L[i]-L[i-1])||1);ctx.lineTo(lerp(pts[i-1][0],pts[i][0],f),lerp(pts[i-1][1],pts[i][1],f));break;}}ctx.stroke();ctx.setLineDash([]);
  if(p>=1){const d0=Math.sign(ym-y0)||1,d1=Math.sign(y1-ym)||1;ctx.beginPath();ctx.moveTo(x0-11,y0+d0*12);ctx.lineTo(x0+11,y0+d0*12);ctx.stroke();
    if(o.one1){ctx.beginPath();ctx.moveTo(x1-11,y1-d1*12);ctx.lineTo(x1+11,y1-d1*12);ctx.stroke();}
    else{ctx.beginPath();ctx.moveTo(x1-12,y1);ctx.lineTo(x1,y1-d1*18);ctx.lineTo(x1+12,y1);ctx.moveTo(x1,y1);ctx.lineTo(x1,y1-d1*18);ctx.stroke();}}
  ctx.restore();}
// one write inside a transaction: pending (dashed), done (solid), failed (red) or rolled back (struck through)
function bw_write(ctx,x,y,w,h,title,line,st,a){if(a<=0.01)return;withA(ctx,a,()=>{const c=st==="fail"?BAD:st==="back"?SOFT:st==="done"?BW_W:BW_W;
  glass(ctx,x,y,w,h,12,c,{glow:st==="done"?16:8,ea:st==="pend"?0.01:0.85,fill:st==="done"?"rgba(12,26,52,0.95)":"rgba(7,12,24,0.9)"});
  if(st==="pend"||st==="back"){ctx.save();ctx.setLineDash([7,6]);ctx.strokeStyle=rgba(c,0.8);ctx.lineWidth=1.8;rr(ctx,x,y,w,h,12);ctx.stroke();ctx.restore();}
  T(ctx,title,x+20,y+38,{w:800,size:25,color:rgba(c,1)});T(ctx,line,x+20,y+78,{f:"mono",w:500,size:20,color:rgba(INK,st==="back"?0.4:0.9)});
  if(st==="back"){ctx.strokeStyle=rgba(BAD,0.8);ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(x+14,y+71);ctx.lineTo(x+w-14,y+71);ctx.stroke();T(ctx,"↺",x+w-34,y+40,{w:800,size:30,align:"center",color:rgba(BW_AMB,1)});}
  if(st==="fail")cross_(ctx,x+w-34,y+32,30,BAD,1);if(st==="done")tick_(ctx,x+w-34,y+34,30,GOOD,1);});}

/* ---------- a document: one credential, written and signed as one piece ---------- */
// o: p (how much is written), hl {claim, evidence} (0..1), sign (0..1), check (0..1), col, a. Returns its height.
function bw_doc(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,col=o.col||BW_W,hl=o.hl||{},p=o.p==null?1:o.p,h=o.h||620;if(a<=0.01)return h;
  const part=k=>clamp(p*7-k,0,1);
  withA(ctx,a,()=>{const f=40;ctx.save();ctx.shadowColor=rgba(col,0.55);ctx.shadowBlur=18+14*(o.glow||0);ctx.fillStyle="rgba(8,14,30,0.95)";ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w-f,y);ctx.lineTo(x+w,y+f);ctx.lineTo(x+w,y+h);ctx.lineTo(x,y+h);ctx.closePath();ctx.fill();ctx.shadowBlur=0;
    ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=1.8;ctx.stroke();ctx.fillStyle=rgba(col,0.25);ctx.beginPath();ctx.moveTo(x+w-f,y);ctx.lineTo(x+w-f,y+f);ctx.lineTo(x+w,y+f);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
    const kv=(k,v,xx,yy,q)=>withA(ctx,q,()=>{T(ctx,k,xx,yy,{f:"mono",w:500,size:21,color:rgba(REF,1)});T(ctx,v,xx+190,yy,{w:700,size:25,color:rgba(INK,0.95)});});
    withA(ctx,part(0),()=>{T(ctx,"credential",x+30,y+52,{w:800,size:32,color:rgba(TRUST,1)});T(ctx,"one document",x+w-62,y+50,{f:"mono",w:500,size:19,align:"right",color:rgba(SOFT,1)});});
    kv("type","Microcredential",x+30,y+104,part(1));kv("issuer","the university",x+30,y+144,part(1.5));kv("holder","Aisha Salem",x+30,y+184,part(2));
    const blk=(yy,name,rowsK,q,hi)=>withA(ctx,q,()=>{const bh=48+rowsK.length*40;if(hi>0.01)glow(ctx,x+w/2,yy+bh/2,w*0.5,TRUST,0.2*hi);
      glass(ctx,x+26,yy,w-52,bh,12,hi>0.01?TRUST:col,{glow:6+12*hi,ea:0.45+0.5*hi,fill:"rgba(14,24,46,0.9)"});T(ctx,name,x+46,yy+32,{w:800,size:23,color:rgba(hi>0.01?TRUST:col,1)});
      rowsK.forEach(([k,v],i)=>kv(k,v,x+66,yy+72+i*40,1));});
    blk(y+212,"claim",[["achieved","Data visualisation"],["credit points","12"]],part(3),hl.claim||0);
    blk(y+358,"evidence",[["project","a dashboard, passed"],["assessed","20 Sep 2026"]],part(4),hl.evidence||0);
    const sg=o.sign||0;if(sg>0.01)withA(ctx,sg,()=>{const sx=x+w-74,sy=y+h-56,r=26+8*(1-ease(sg));ctx.strokeStyle=rgba(TRUST,0.95);ctx.lineWidth=2.6;ctx.beginPath();for(let i=0;i<6;i++){const an=i/6*TAU+Math.PI/6;ctx.lineTo(sx+Math.cos(an)*r,sy+Math.sin(an)*r);}ctx.closePath();ctx.stroke();
      T(ctx,"✓",sx,sy+9,{w:800,size:26,align:"center",color:rgba(TRUST,1)});T(ctx,"proof · signed as one piece",x+30,y+h-46,{f:"mono",w:500,size:20,color:rgba(TRUST,1)});});
    const ck=o.check||0;if(ck>0.01)withA(ctx,ck,()=>{glow(ctx,x+w-74,y+h-56,70,GOOD,0.4*ck);ring(ctx,x+w-74,y+h-56,40,GOOD,1,3);});});
  return h;}
// a small document, for stacks of them
function bw_miniDoc(ctx,x,y,w,h,col,a){if(a<=0.01)return;const f=w*0.3;ctx.save();ctx.globalAlpha*=a;ctx.fillStyle=rgba(mix([8,14,30],col,0.2),0.95);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w-f,y);ctx.lineTo(x+w,y+f);ctx.lineTo(x+w,y+h);ctx.lineTo(x,y+h);ctx.closePath();ctx.fill();
  ctx.strokeStyle=rgba(col,0.8);ctx.lineWidth=1;ctx.stroke();ctx.restore();}
// a document database: a cabinet of whole documents
function bw_store(ctx,x,y,w,h,col,a,t){if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,20,col,{glow:18,ea:0.8,fill:"rgba(8,14,30,0.92)"});
  for(let r=0;r<3;r++)for(let c=0;c<5;c++)bw_miniDoc(ctx,x+40+c*(w-80)/5,y+100+r*(h-130)/3,44,60,col,0.5+0.4*hash(r*5+c,3));});}

/* ---------- the star: the shape built to read ---------- */
// the fact at the centre: its grain, its measures (what you add up) and its keys; o.g (grain), o.m (measures), o.k (keys), each 0..1
function bw_fact(ctx,cx,cy,o){o=o||{};const a=o.a==null?1:o.a,w=o.w||440,h=o.h||280,x=cx-w/2,y=cy-h/2,col=BW_R;if(a<=0.01)return{x:cx,y:cy,w,h};
  withA(ctx,a,()=>{if(o.hi)glow(ctx,cx,cy,w*0.8,col,0.3*o.hi);glass(ctx,x,y,w,h,16,col,{glow:18+10*(o.hi||0),ea:0.9,fill:"rgba(8,20,22,0.95)"});
    T(ctx,"FACT",x+24,y+36,{f:"mono",w:500,size:18,color:rgba(SOFT,1)});T(ctx,"credential awarded",x+24,y+72,{w:800,size:32,color:rgba(col,1)});
    withA(ctx,o.g==null?1:o.g,()=>{if(o.gHi)glow(ctx,cx,y+110,w*0.5,TRUST,0.3*o.gHi);T(ctx,"one row per credential awarded",x+24,y+114,{f:"mono",w:500,size:19,color:rgba(TRUST,0.75+0.25*(o.gHi||0))});});
    ctx.strokeStyle=rgba(col,0.3);ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x+14,y+136);ctx.lineTo(x+w-14,y+136);ctx.stroke();
    [["award","count"],["credit points","sum"]].forEach(([m,how],i)=>withA(ctx,clamp((o.m==null?1:o.m)*2-i,0,1),()=>{const yy=y+178+i*40;
      T(ctx,"Σ",x+34,yy,{w:800,size:28,align:"center",color:rgba(col,1)});T(ctx,m,x+60,yy,{w:700,size:25});T(ctx,how,x+w-24,yy,{f:"mono",w:500,size:19,align:"right",color:rgba(SOFT,1)});}));
    withA(ctx,o.k==null?1:o.k,()=>T(ctx,"+ a key to each dimension",x+24,y+h-18,{f:"mono",w:500,size:18,color:rgba(SOFT,0.9)}));});
  return{x:cx,y:cy,w,h};}
// one dimension: a name, and what you can filter or group by
function bw_dim(ctx,x,y,name,sub,o){o=o||{};return ent(ctx,{x,y,name,sub,col:o.col||BW_R,a:o.a,s:o.s||1,hi:o.hi||0,subA:1});}
const BW_DIMS={learner:["Learner","name · faculty · dates"],kind:["Credential kind","award · micro · badge"],faculty:["Faculty","name · school"],date:["Date","day · month · year"]};
// a whole star, at (cx,cy): P maps each dimension to its place; o.dimA, o.join (0..1 per dimension: a join lit), o.hi
function bw_star(ctx,cx,cy,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const P=o.P||{learner:[-340,-230],kind:[340,-230],faculty:[-340,240],date:[340,240]},da=o.dimA||{},jn=o.join||{},ds=o.ds||s;
  withA(ctx,a,()=>{const F={x:cx,y:cy,w:(o.fw||440)*s,h:(o.fh||280)*s};
    Object.keys(P).forEach(k=>{const q=da[k]==null?1:da[k];if(q<=0.01)return;const D=entBox(ctx,{x:cx+P[k][0]*s,y:cy+P[k][1]*s,name:BW_DIMS[k][0],sub:o.nosub?null:BW_DIMS[k][1],s:ds});
      relLine(ctx,F,D,"*","1",{col:jn[k]>0.01?mix(BW_R,[255,255,255],0.4*jn[k]):BW_R,a:q*(o.relA==null?1:o.relA),s:ds,lw:2.2+2.4*(jn[k]||0)});
      if(jn[k]>0.01)glow(ctx,(F.x+D.x)/2,(F.y+D.y)/2,90*s,BW_R,0.35*jn[k]);});
    if(o.small){const w=F.w,h=F.h;glass(ctx,cx-w/2,cy-h/2,w,h,14*s,BW_R,{glow:16,ea:0.9,fill:"rgba(8,20,22,0.95)"});T(ctx,"credential awarded",cx,cy-2*s,{w:800,size:30*s,align:"center",color:rgba(BW_R,1)});
      T(ctx,"Σ count · credit points",cx,cy+34*s,{f:"mono",w:500,size:21*s,align:"center",color:rgba(SOFT,1)});}
    else bw_fact(ctx,cx,cy,Object.assign({w:F.w,h:F.h},o.fact||{}));
    Object.keys(P).forEach(k=>{const q=da[k]==null?1:da[k];bw_dim(ctx,cx+P[k][0]*s,cy+P[k][1]*s,BW_DIMS[k][0],o.nosub?null:BW_DIMS[k][1],{a:q,s:ds,hi:(o.dimHi||{})[k]||0});});});}
// small signs of each shape, for the end: a web of small tables, and a star
function bw_normIcon(ctx,x,y,s,a,col){if(a<=0.01)return;col=col||BW_W;withA(ctx,a,()=>{const B=[[-70,-40],[20,-56],[80,10],[-10,30],[-80,40],[60,62]],E=[[0,1],[1,2],[1,3],[3,4],[3,5],[0,3]];
  ctx.strokeStyle=rgba(col,0.8);ctx.lineWidth=2;E.forEach(([i,j])=>{ctx.beginPath();ctx.moveTo(x+B[i][0]*s,y+B[i][1]*s);ctx.lineTo(x+B[j][0]*s,y+B[j][1]*s);ctx.stroke();});
  B.forEach(([bx,by])=>{glass(ctx,x+bx*s-20*s,y+by*s-12*s,40*s,24*s,5*s,col,{glow:8,ea:0.9,fill:"rgba(8,14,30,0.95)"});ctx.fillStyle=rgba(col,0.6);ctx.fillRect(x+bx*s-12*s,y+by*s-2*s,24*s,3*s);});});}
function bw_starIcon(ctx,x,y,s,a,col){if(a<=0.01)return;col=col||BW_R;withA(ctx,a,()=>{const B=[[-72,-44],[72,-44],[-72,44],[72,44]];ctx.strokeStyle=rgba(col,0.8);ctx.lineWidth=2;
  B.forEach(([bx,by])=>{ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+bx*s,y+by*s);ctx.stroke();});
  B.forEach(([bx,by])=>{glass(ctx,x+bx*s-20*s,y+by*s-12*s,40*s,24*s,5*s,col,{glow:8,ea:0.9,fill:"rgba(8,20,22,0.95)"});});
  glass(ctx,x-30*s,y-18*s,60*s,36*s,7*s,col,{glow:14,ea:1,fill:"rgba(10,30,26,0.95)"});T(ctx,"Σ",x,y+8*s,{w:800,size:20*s,align:"center",color:rgba(col,1)});});}
// the planners' answer: awards by faculty, stacked, one bar a year
function bw_chart(ctx,x,y,w,h,p,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,BW_R,{glow:14,ea:0.8,fill:"rgba(7,14,18,0.94)"});
  T(ctx,o.title||"awards, by faculty and year",x+20,y+38,{w:800,size:22,color:rgba(BW_R,1)});const bx=x+22,by=y+h-40,bw=(w-44)/10,mh=h-130,mx=12000;
  BW_TEN.forEach((v,i)=>{const q=clamp(p*10-i*0.6,0,1),sh=[0.44,0.34,0.22];let acc=0;["sci","eng","arts"].forEach((k,j)=>{const hh=v/mx*mh*sh[j]*ease(q);ctx.fillStyle=rgba(BW_FAC[k].c,0.85);rr(ctx,bx+i*bw+4,by-acc-hh,bw-8,hh,3);ctx.fill();acc+=hh;});
    if(i===0||i===9)T(ctx,String(2017+i),bx+i*bw+bw/2,by+26,{f:"mono",w:500,size:18,align:"center",color:rgba(SOFT,1)});});
  let lx=x+20;["sci","eng","arts"].forEach(k=>{ctx.fillStyle=rgba(BW_FAC[k].c,1);ctx.fillRect(lx,y+58,14,14);T(ctx,BW_FAC[k].n,lx+20,y+72,{w:600,size:18,color:rgba(SOFT,1)});lx+=tw(ctx,BW_FAC[k].n,18,600)+44;});});}

/* ---------- words the planner types, with some of them lit ---------- */
// a question in a bubble, laid out word by word so single words can light up; hi(word index) gives 0..1
function bw_qBubble(ctx,x,y,w,words,o){o=o||{};const sz=o.size||28,lh=sz*1.36,a=o.a==null?1:o.a,col=o.col||BW_R;const pos=[];let cx=0,row=0;
  ctx.save();ctx.font=font(700,sz);const sp=ctx.measureText(" ").width;words.forEach(wd=>{const ww=ctx.measureText(wd).width;if(cx>0&&cx+ww>w-56){cx=0;row++;}pos.push([cx,row,ww]);cx+=ww+sp;});ctx.restore();
  const h=(row+1)*lh+40,B={x,y,w,h,pos:pos.map(([px,r,ww])=>[x+28+px,y+20+sz*1.05+r*lh,ww])};if(a<=0.01)return B;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,col,{glow:16,ea:0.75,fill:"rgba(7,12,24,0.93)"});ctx.fillStyle="rgba(7,12,24,0.93)";ctx.strokeStyle=rgba(col,0.75);ctx.lineWidth=1.6;
    const tx=x+50;ctx.beginPath();ctx.moveTo(tx,y+h-1);ctx.lineTo(tx-8,y+h+26);ctx.lineTo(tx+30,y+h-1);ctx.fill();ctx.stroke();
    words.forEach((wd,i)=>{const[px,py,ww]=B.pos[i],q=o.hi?o.hi(i):0;if(q>0.01){ctx.fillStyle=rgba(o.hiCol?o.hiCol(i):TRUST,0.22*q);rr(ctx,px-6,py-sz*0.95,ww+12,sz*1.3,8);ctx.fill();}
      T(ctx,wd,px,py,{w:700,size:sz,color:q>0.01?rgba(mix(INK,o.hiCol?o.hiCol(i):TRUST,q),1):rgba(INK,1)});});});
  return B;}

/* ---------- pictures for the labs and the scenarios (site/assets/built-to-write-built-to-read/learn.*.js name them in "vis") ----------
   Each draws on a canvas of w × h, with the lab's state and the page's words (window.FW). The scenarios' canvases are 600 × 320. */
const BW_ES=L=>L&&L.lang==="es";
const LV={
  // Break the update: the same name change, on three ways of storing the name
  update:(c,w,h,st,L)=>{const es=BW_ES(L),k=st.pick||"once",s=0.8;c.save();c.scale(s,s);const W_=w/s;
    const nm=es?["nombre","cambio de nombre"]:["name","name change"];
    if(k==="once"){const A=bw_tbl(c,40,40,{name:"learner",cols:[["learner_id","pk"],["name",""]],rows:[["L-204","Aisha Salem"]],cell:(j,i)=>i===1?{hi:1,col:BW_W}:null});
      const B=bw_tbl(c,40,230,{name:"award",cols:[["award_id","pk"],["learner_id","fk"],["course",""]],rows:[["A-9001","L-204","BSc Data Science"],["A-9002","L-204","Machine learning"],["A-9004","L-204","Data visualisation"]]});
      [0,1,2].forEach(j=>arrowTo(c,B.cx[1]+B.cw[1]-14,B.rowY(j),A.x+A.w+10,A.rowY(0),BW_W,0.7,{bend:-0.12,head:10,lw:1.8}));
      tag(c,A.x+A.w+60,A.rowY(0),es?"1 edición":"1 edit",GOOD,{size:20});}
    else if(k==="every"){const R=[["A-9001","Aisha Salem","BSc Data Science"],["A-9002","Aisha Salem","Machine learning"],["A-9004","Aisha Karim","Data visualisation"]];
      bw_tbl(c,40,60,{name:"awards",cols:[["award_id","pk"],["learner_name",""],["course",""]],rows:R,cell:(j,i)=>i===1?{hi:1,col:j===2?BAD:BW_W,hiCol:j===2?BAD:BW_W}:null});
      tag(c,560,360,es?"3 ediciones · 1 se pasó":"3 edits · 1 missed",BAD,{size:20});}
    else{[0,1,2].forEach(i=>{const x=40+i*300,y=40+i*14;c.save();bw_doc(c,x,y,280,{h:300,a:1,p:1,sign:1});c.restore();});
      tag(c,560,390,es?"cada documento guarda el nombre con que se emitió":"each document keeps the name it was issued with",TRUST,{size:18});}
    c.restore();},
  // Declare the grain: rows of the fact table at the chosen grain
  grain:(c,w,h,st,L)=>{const es=BW_ES(L),k=st.pick||"cred";const G={
      cred:{name:es?"una fila por credencial otorgada":"one row per credential awarded",cols:[["award_id","pk"],["learner",""],["kind",""],["faculty",""],["date",""],["cp",""]],rows:[["A-9001","L-204","award","Science","2025-12-10","240"],["A-9002","L-204","micro","Science","2026-05-02","12"],["A-9004","L-204","micro","Engineering","2026-09-28","12"],["A-9003","L-311","micro","Arts","2026-06-20","6"]]},
      year:{name:es?"una fila por aprendiz por año":"one row per learner per year",cols:[["learner",""],["year",""],["faculty",""],["awards",""],["cp",""]],rows:[["L-204","2025","Science","1","240"],["L-204","2026","Science?","2","24"],["L-311","2026","Arts","1","6"]]},
      learner:{name:es?"una fila por aprendiz":"one row per learner",cols:[["learner",""],["awards",""],["cp",""]],rows:[["L-204","3","264"],["L-311","1","6"]]}}[k];
    T(c,G.name,40,48,{w:800,size:24,color:rgba(TRUST,1)});
    bw_tbl(c,40,72,{cols:G.cols,rows:G.rows,col:BW_R,size:16,rh:36,cell:(j,i)=>k==="year"&&j===1&&i===2?{col:BW_AMB,hi:1,hiCol:BW_AMB}:null});},
  // Which shape answers this faster? The two shapes, side by side
  shapes:(c,w,h,st,L)=>{const es=BW_ES(L);bw_normIcon(c,w*0.27,h*0.52,1.5,1,BW_W);bw_starIcon(c,w*0.73,h*0.52,1.5,1,BW_R);
    T(c,es?"hecha para escribir":"built to write",w*0.27,50,{w:800,size:24,align:"center",color:rgba(BW_W,1)});T(c,es?"hecha para leer":"built to read",w*0.73,50,{w:800,size:24,align:"center",color:rgba(BW_R,1)});
    c.strokeStyle="rgba(170,200,245,0.2)";c.beginPath();c.moveTo(w/2,30);c.lineTo(w/2,h-30);c.stroke();
    if(st.checked)T(c,es?"cada forma es rápida en su propio trabajo":"each shape is fast at its own job",w/2,h-30,{w:700,size:20,align:"center",color:rgba(GOOD,1)});},
  // scenarios
  anomaly:(c,w,h)=>{bw_tbl(c,24,40,{cols:[["table",""],["email",""]],rows:[["enrolment","aisha.s@mail.com"],["award","aisha.s@mail.com"],["alumni","aisha.k@uni.edu"]],size:16,rh:38,cell:(j,i)=>i===1?{col:j===2?BAD:BW_W,hi:j===2?1:0,hiCol:BAD}:null});
    tag(c,440,270,"newsletter → old address",BAD,{align:"center",size:16});},
  half:(c,w,h)=>{c.save();c.scale(0.62,0.62);glass(c,20,40,920,200,18,BW_W,{glow:10,ea:0.01,fill:"rgba(7,12,24,0.6)"});c.save();c.setLineDash([9,7]);c.strokeStyle=rgba(BW_W,0.7);c.lineWidth=2;rr(c,20,40,920,200,18);c.stroke();c.restore();
    bw_write(c,44,90,280,110,"award","A-9004 saved","done",1);bw_write(c,340,90,280,110,"learner record","324 cp","done",1);bw_write(c,636,90,280,110,"transcript","crashed","fail",1);c.restore();
    T(c,"saved: 2 of 3",300,230,{w:800,size:24,align:"center",color:rgba(BAD,1)});},
  rush:(c,w,h)=>{glass(c,30,40,260,240,18,BW_W,{glow:14,ea:0.8,fill:"rgba(7,12,24,0.94)"});T(c,"student system",160,84,{w:800,size:20,align:"center",color:rgba(BW_W,1)});T(c,"9:00 · enrolment day",160,114,{f:"mono",w:500,size:14,align:"center",color:rgba(SOFT,1)});
    for(let i=0;i<6;i++){c.fillStyle=rgba(BW_W,0.5);rr(c,56+i*36,150,24,24,5);c.fill();}T(c,"queue: 2,140 waiting",160,230,{w:700,size:16,align:"center",color:rgba(BAD,1)});
    glass(c,320,40,250,240,18,BW_R,{glow:10,ea:0.6,fill:"rgba(7,14,18,0.94)"});T(c,"10-year report",445,84,{w:800,size:20,align:"center",color:rgba(BW_R,1)});T(c,"7 joins · 10 years",445,120,{f:"mono",w:500,size:15,align:"center",color:rgba(SOFT,1)});
    arrowTo(c,320,170,292,170,BAD,0.9,{head:10});T(c,"running…",445,200,{w:700,size:18,align:"center",color:rgba(BW_AMB,1)});},
  mixed:(c,w,h)=>{bw_tbl(c,24,30,{name:"fact_awards",cols:[["row",""],["learner",""],["awards",""]],rows:[["A-9001","L-204","1"],["A-9002","L-204","1"],["2025 total","L-204","2"],["A-9003","L-311","1"]],size:16,rh:36,col:BW_R,cell:(j,i)=>j===2?{col:BAD,hi:1,hiCol:BAD}:null});
    T(c,"sum = 5 · true count = 3",440,290,{w:800,size:20,align:"center",color:rgba(BAD,1)});},
  docstack:(c,w,h)=>{for(let r=0;r<9;r++)for(let k=0;k<26;k++)bw_miniDoc(c,20+k*22,40+r*28,16,21,BW_W,0.35+0.4*(k<5?1:0));c.fillStyle=rgba(BW_AMB,0.9);c.fillRect(20+5*22-4,34,3,260);
    T(c,"scanning 212,400 of 1,000,000…",300,306,{w:700,size:18,align:"center",color:rgba(BW_AMB,1)});},
  overwrite:(c,w,h)=>{bw_tbl(c,24,40,{name:"learner",cols:[["learner",""],["faculty",""]],rows:[["Aisha Salem","Engineering"]],size:16,rh:38,cell:(j,i)=>i===1?{hi:1,col:BW_AMB,hiCol:BW_AMB}:null});
    T(c,"Science",346,146,{f:"mono",w:500,size:16,color:rgba(SOFT,0.6)});c.strokeStyle=rgba(BAD,0.8);c.lineWidth=2;c.beginPath();c.moveTo(342,141);c.lineTo(420,141);c.stroke();
    numCard(c,300,110,280,"2025 report","−1",null,BAD);},
  medal:(c,w,h)=>{c.save();c.scale(0.5,0.5);[["bronze",20],["silver",420],["gold",820]].forEach(([k,x])=>{vault(c,x,40,360,440,LAYER[k],(r,cc)=>r<3?LAYER[k]:null,k[0].toUpperCase()+k.slice(1),null);});
    bw_normIcon(c,600,340,1.3,1,BW_W);bw_starIcon(c,1000,340,1.3,1,BW_R);bw_normIcon(c,200,340,1.3,0.35,BW_W);c.restore();
    T(c,"layers: how refined · shapes: any layer",300,300,{w:700,size:18,align:"center",color:rgba(SOFT,1)});},
  star:(c,w,h)=>{c.save();c.translate(w/2,h/2+10);c.scale(0.42,0.42);c.translate(-960,-520);bw_star(c,960,520,1,{nosub:false});c.restore();}
};
