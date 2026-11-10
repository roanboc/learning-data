/* ===== Files as data and as context: the documents of today =====
   Pages are pictures: what they say is drawn small, as decoration ({deco:1}), and what matters on them is said on a card beside them,
   at 28 px or more. A page's parts are returned in its own coordinates, so a scene can point at them, box them or send them on.
     fd_invoice(ctx, x, y, w, v, o)   a supplier's invoice, in its own layout (v 0 to 3); o.hl {supplier, number, date, total, lines}
                                      (each 0 to 1) rings what Finance checks; o.parse (0 to 1) boxes what ai_parse_document finds
     fd_pdf(ctx, x, y, s, o)          a file, s px tall, its name under it (o.name, in mono), o.col (its edge), o.a
     fd_contract(ctx, x, y, w, o)     a contract's page: o.kind "offer" or "signed", o.ends (the end date it gives), o.sign (0 to 1)
     fd_sheet(ctx, x, y, w, v, o)     a spreadsheet of claims, as a tutor made it, each its own way
     fd_kv(ctx, x, y, w, rows, o)     a card of fields and values, in mono: o.kick, o.edge, o.rowA(i), o.lit (a row's index)
     fd_code(ctx, x, y, w, lines, o)  a file of code or YAML, its lines in mono: o.kick, o.edge, o.lineA(i)
     fd_suppliers                     the four suppliers and their invoices, invented
   Colours keep the module's meanings: the map's light for data and structure, gold for what people agree, green for a check that
   passes, amber for a person's turn, red for an error, lilac with a lock for personal data. */

const FD_INV=[
  {supplier:"Larkspur Catering",number:"LC-20931",date:"28 Oct 2026",iso:"2026-10-28",total:"1,284.00",lines:[["Open day catering","1,050.00"],["Coffee cart","117.27"],["GST","116.73"]],head:[176,88,74]},
  {supplier:"Northfield Lab Supply",number:"NLS-118402",date:"27 Oct 2026",iso:"2026-10-27",total:"3,910.50",lines:[["Pipette tips, 40 boxes","2,180.00"],["Nitrile gloves, 60 boxes","1,375.00"],["GST","355.50"]],head:[52,96,140]},
  {supplier:"Tidewater Print",number:"TP-7716",date:"27 Oct 2026",iso:"2026-10-27",total:"642.40",lines:[["Posters, A2, 120","484.00"],["Banners, 2","100.00"],["GST","58.40"]],head:[40,120,110]},
  {supplier:"Corella Cleaning",number:"CC-0459",date:"31 Oct 2026",iso:"2026-10-31",total:"2,816.00",lines:[["Windows, Building C","1,960.00"],["Carpets, Library","600.00"],["GST","256.00"]],head:[110,96,150]}];
const fd_tiny=(ctx,s,x,y,size,o)=>{o=o||{};T(ctx,s,x,y,{w:o.w||600,size,color:rgba(o.col||[60,66,80],o.a==null?0.95:o.a),align:o.align||"left",f:o.f,deco:1});};
// a ring of the map's light round a part of a page, with an inner glow: col, a
function fd_ring(ctx,r,col,a,pad){if(a<=0.004)return;pad=pad==null?6:pad;ctx.save();ctx.globalAlpha*=a;ctx.shadowColor=rgba(col,0.8);ctx.shadowBlur=14;ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3;
  rr(ctx,r.x-pad,r.y-pad,r.w+pad*2,r.h+pad*2,8);ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle=rgba(col,0.08);rr(ctx,r.x-pad,r.y-pad,r.w+pad*2,r.h+pad*2,8);ctx.fill();ctx.restore();}
// an invoice: its parts in four layouts (the supplier's block, the invoice's number and date, who it's to, the lines, the total)
function fd_invoice(ctx,x,y,w,v,o){o=o||{};const I=FD_INV[v%4],k=w/600,h=780*k,a=o.a==null?1:o.a,L=v%4;const R={};if(a<=0.004)return{x,y,w,h,R};
  ctx.save();ctx.globalAlpha*=a;if(o.rot){ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot);ctx.translate(-x-w/2,-y-h/2);}
  fd_paper(ctx,x,y,w,h,{col:[242,243,246],white:true,r:4});const X=u=>x+u*k,Y=u=>y+u*k,box=(nm,u,v_,uw,vh)=>R[nm]={x:X(u),y:Y(v_),w:uw*k,h:vh*k};
  const hc=I.head,dark=[40,46,60];
  // the supplier's block: a mark and a name, where each layout puts it
  if(L===0){ctx.fillStyle=rgba(hc,1);ctx.beginPath();ctx.arc(X(76),Y(82),28*k,0,TAU);ctx.fill();fd_tiny(ctx,I.supplier,X(118),Y(92),30*k,{w:800,col:dark});box("supplier",40,46,380,74);
    fd_tiny(ctx,"TAX INVOICE",X(560),Y(150),24*k,{w:800,col:hc,align:"right"});fd_tiny(ctx,"Invoice "+I.number,X(560),Y(186),20*k,{align:"right",f:"mono"});box("number",330,166,236,30);
    fd_tiny(ctx,I.date,X(560),Y(218),20*k,{align:"right"});box("date",400,198,166,30);}
  else if(L===1){ctx.fillStyle=rgba(hc,1);ctx.fillRect(x,y,w,110*k);fd_tiny(ctx,I.supplier,X(40),Y(70),32*k,{w:800,col:[255,255,255]});box("supplier",30,30,420,60);
    fd_tiny(ctx,"Invoice",X(40),Y(170),24*k,{w:800,col:dark});fd_tiny(ctx,"No. "+I.number,X(40),Y(206),20*k,{f:"mono"});box("number",34,186,240,30);fd_tiny(ctx,"Issued "+I.date,X(330),Y(206),20*k);box("date",324,186,220,30);}
  else if(L===2){fd_tiny(ctx,"INVOICE",X(40),Y(92),40*k,{w:800,col:hc});fd_tiny(ctx,I.supplier,X(560),Y(70),26*k,{w:800,col:dark,align:"right"});fd_tiny(ctx,"Printers since 1998",X(560),Y(100),18*k,{align:"right"});box("supplier",300,40,266,70);
    ctx.fillStyle=rgba(hc,0.12);ctx.fillRect(X(40),Y(130),520*k,64*k);fd_tiny(ctx,"Number",X(56),Y(156),16*k);fd_tiny(ctx,I.number,X(56),Y(182),20*k,{f:"mono",w:500});box("number",48,136,160,54);
    fd_tiny(ctx,"Date",X(300),Y(156),16*k);fd_tiny(ctx,I.date,X(300),Y(182),20*k);box("date",292,136,170,54);}
  else{fd_tiny(ctx,I.supplier,X(300),Y(80),30*k,{w:800,col:hc,align:"center"});ctx.strokeStyle=rgba(hc,0.8);ctx.lineWidth=3*k;ctx.beginPath();ctx.moveTo(X(60),Y(104));ctx.lineTo(X(540),Y(104));ctx.stroke();box("supplier",90,44,420,70);
    fd_tiny(ctx,I.date,X(40),Y(150),20*k);box("date",34,130,170,30);fd_tiny(ctx,"Tax invoice "+I.number,X(560),Y(150),20*k,{align:"right",f:"mono"});box("number",320,130,246,30);}
  // who it's to
  const ty=L===1?250:L===2?236:L===0?262:200;fd_tiny(ctx,"To: Finance, accounts payable",X(40),Y(ty),18*k);fd_tiny(ctx,"The university",X(40),Y(ty+26),18*k);
  // the lines
  const ly=ty+80;ctx.fillStyle=rgba(L===1?hc:dark,L===1?0.9:0.08);ctx.fillRect(X(40),Y(ly-28),520*k,38*k);fd_tiny(ctx,"Description",X(56),Y(ly-2),17*k,{w:800,col:L===1?[255,255,255]:dark});fd_tiny(ctx,"Amount",X(544),Y(ly-2),17*k,{w:800,col:L===1?[255,255,255]:dark,align:"right"});
  I.lines.forEach((ln,i)=>{const yy=Y(ly+46+i*44);fd_tiny(ctx,ln[0],X(56),yy,19*k);fd_tiny(ctx,ln[1],X(544),yy,19*k,{align:"right",f:"mono",w:500});
    ctx.strokeStyle="rgba(120,130,150,0.3)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(X(40),yy+16*k);ctx.lineTo(X(560),yy+16*k);ctx.stroke();});box("lines",40,ly-30,520,44*3+60);
  // the total
  const tyy=ly+46+3*44+30;ctx.fillStyle=rgba(hc,L===3?0.16:0.1);ctx.fillRect(X(330),Y(tyy-30),230*k,52*k);fd_tiny(ctx,"Total A$",X(344),Y(tyy+4),20*k,{w:800,col:dark});fd_tiny(ctx,I.total,X(548),Y(tyy+4),22*k,{w:800,f:"mono",align:"right",col:dark});box("total",330,tyy-30,230,52);
  // the footer
  fd_tiny(ctx,"Payment terms: 30 days",X(40),Y(740),16*k);ctx.fillStyle=rgba(hc,0.5);ctx.fillRect(x,y+h-10*k,w,10*k);
  // what Finance checks, ringed
  if(o.hl)for(const nm of ["supplier","number","date","total","lines"]){const q=o.hl[nm]||0;if(q>0&&R[nm])fd_ring(ctx,R[nm],o.hlCol||MD.flow,q);}
  // what the function finds: a box round each part of the page, in the map's light, the table's in its own
  if(o.parse>0){const p=o.parse;const parts=["supplier","number","date","lines","total"];parts.forEach((nm,i)=>{const q=clamp(p*6-i,0,1);if(q>0&&R[nm]){ctx.save();ctx.globalAlpha*=q;ctx.setLineDash([8,6]);ctx.strokeStyle=rgba(MD.flow,0.95);ctx.lineWidth=2.4;
      rr(ctx,R[nm].x-4,R[nm].y-4,R[nm].w+8,R[nm].h+8,6);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle=rgba(MD.flow,0.07);ctx.fill();ctx.restore();}});}
  ctx.restore();return{x,y,w,h,R};}
// a file: a page with a folded corner, a band naming its kind, and its name under it in mono (28 px, or decoration when smaller)
function fd_pdf(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const w=s*0.78,col=o.col||MD.soft;ctx.save();ctx.globalAlpha*=a;
  ctx.shadowColor=rgba(o.col||[0,0,0],o.col?0.5:0.4);ctx.shadowBlur=o.col?18:10;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w-s*0.22,y);ctx.lineTo(x+w,y+s*0.22);ctx.lineTo(x+w,y+s);ctx.lineTo(x,y+s);ctx.closePath();ctx.fillStyle="rgba(236,240,248,0.97)";ctx.fill();ctx.shadowBlur=0;ctx.shadowColor="transparent";
  ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2;ctx.stroke();ctx.fillStyle="rgba(170,180,200,0.6)";ctx.beginPath();ctx.moveTo(x+w-s*0.22,y);ctx.lineTo(x+w-s*0.22,y+s*0.22);ctx.lineTo(x+w,y+s*0.22);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba([90,100,124],1);rr(ctx,x+w*0.12,y+s*0.56,w*0.76,s*0.2,3);ctx.fill();T(ctx,o.kind||"PDF",x+w/2,y+s*0.71,{w:800,size:s*0.15,color:"rgba(255,255,255,0.95)",align:"center",deco:1});
  ctx.strokeStyle="rgba(120,130,150,0.55)";ctx.lineWidth=1.5;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(x+w*0.14,y+s*(0.2+i*0.1));ctx.lineTo(x+w*(i===2?0.6:0.72),y+s*(0.2+i*0.1));ctx.stroke();}
  if(o.name){const sz=o.size||28;md_T(ctx,o.name,x+w/2,y+s+sz+12,{w:500,size:sz,f:"mono",align:"center",col:o.nameCol||MD.ink,deco:sz<28?1:0});}
  ctx.restore();}
// a contract's page: the university's letterhead, its terms in lines, the end date, and for the signed one, two signatures and a seal
function fd_contract(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,k=w/600,h=780*k;if(a<=0.004)return{x,y,w,h};const signed=o.kind!=="offer";ctx.save();ctx.globalAlpha*=a;
  if(o.rot){ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot);ctx.translate(-x-w/2,-y-h/2);}
  fd_paper(ctx,x,y,w,h,{col:[243,243,240],white:true,r:4});const X=u=>x+u*k,Y=u=>y+u*k,dark=[40,46,60];
  ctx.fillStyle=rgba(MD.sys.hr,0.85);ctx.fillRect(x,y,w,12*k);fd_tiny(ctx,"The university · Human Resources",X(40),Y(64),20*k,{w:800,col:dark});
  fd_tiny(ctx,signed?"Casual academic contract":"Offer of a casual academic contract",X(40),Y(122),28*k,{w:800,col:dark});fd_tiny(ctx,"Contract T-26188"+(signed?" · version 2":" · version 1"),X(40),Y(158),20*k,{f:"mono"});
  fd_tiny(ctx,"Linh Nguyen · Tutor, HI101",X(40),Y(204),20*k);
  ctx.strokeStyle="rgba(120,130,150,0.45)";ctx.lineWidth=2*k;for(let i=0;i<7;i++){const yy=Y(250+i*36);ctx.beginPath();ctx.moveTo(X(40),yy);ctx.lineTo(X(i%3===2?420:560),yy);ctx.stroke();}
  fd_tiny(ctx,"Starts 20 July 2026",X(40),Y(536),20*k,{w:700});fd_tiny(ctx,"Ends "+(o.ends||(signed?"20 November 2026":"13 November 2026")),X(40),Y(568),20*k,{w:700});
  if(o.endsHl>0)fd_ring(ctx,{x:X(34),y:Y(548),w:300*k,h:30*k},o.endsCol||MD.flow,o.endsHl,4);
  const sg=o.sign==null?(signed?1:0):o.sign;ctx.strokeStyle="rgba(120,130,150,0.6)";ctx.lineWidth=1.5*k;for(const sx of[40,330]){ctx.beginPath();ctx.moveTo(X(sx),Y(690));ctx.lineTo(X(sx+230),Y(690));ctx.stroke();}
  fd_tiny(ctx,"For the university",X(40),Y(716),16*k);fd_tiny(ctx,"Accepted",X(330),Y(716),16*k);
  if(sg>0){ctx.save();ctx.strokeStyle=rgba([30,44,96],0.9);ctx.lineWidth=2.6*k;ctx.lineCap="round";const sig=(sx,u)=>{const n=40;ctx.beginPath();for(let i=0;i<=n*u;i++){const q=i/n,px=X(sx+q*200),py=Y(676-Math.sin(q*TAU*2.2+sx)*12-q*8+Math.sin(q*31)*3);i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.stroke();};
    sig(50,clamp(sg*2,0,1));sig(340,clamp(sg*2-1,0,1));ctx.restore();}
  if(signed&&sg>0.98){ctx.save();ctx.globalAlpha*=0.85;ctx.strokeStyle=rgba(MD.sys.hr,0.9);ctx.lineWidth=3*k;ctx.beginPath();ctx.arc(X(500),Y(600),40*k,0,TAU);ctx.stroke();ctx.beginPath();ctx.arc(X(500),Y(600),30*k,0,TAU);ctx.stroke();ctx.restore();}
  ctx.restore();return{x,y,w,h};}
// a tutor's spreadsheet of hours, each its own way: a grid, a header in its own colour, a few cells filled
function fd_sheet(ctx,x,y,w,v,o){o=o||{};const a=o.a==null?1:o.a,h=w*0.72;if(a<=0.004)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;if(o.rot){ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot);ctx.translate(-x-w/2,-y-h/2);}
  const hc=[[60,140,90],[200,140,60],[90,110,190]][v%3];fd_paper(ctx,x,y,w,h,{col:[244,245,247],white:true,r:4});const cols=[5,4,6][v%3],rows=[7,6,8][v%3],cw=(w-24)/cols,rh=(h-24)/rows;
  ctx.fillStyle=rgba(hc,0.85);ctx.fillRect(x+12,y+12,w-24,rh);ctx.strokeStyle="rgba(130,140,160,0.45)";ctx.lineWidth=1;
  for(let i=0;i<=cols;i++){ctx.beginPath();ctx.moveTo(x+12+i*cw,y+12);ctx.lineTo(x+12+i*cw,y+h-12);ctx.stroke();}for(let j=0;j<=rows;j++){ctx.beginPath();ctx.moveTo(x+12,y+12+j*rh);ctx.lineTo(x+w-12,y+12+j*rh);ctx.stroke();}
  const r=ag_rnd(77+v);ctx.fillStyle="rgba(60,70,90,0.55)";for(let j=1;j<rows;j++)for(let i=0;i<cols;i++)if(r()<0.7)ctx.fillRect(x+18+i*cw,y+12+j*rh+rh*0.4,cw*(0.3+0.5*r()),rh*0.22);
  ctx.restore();return{x,y,w,h};}
// an envelope, for what came by email
function fd_envelope(ctx,x,y,s,col,a){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;rr(ctx,x-s/2,y-s*0.32,s,s*0.64,4);ctx.fillStyle="rgba(10,17,35,0.95)";ctx.fill();ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=2.4;ctx.stroke();
  ctx.beginPath();ctx.moveTo(x-s/2+3,y-s*0.3);ctx.lineTo(x,y+s*0.05);ctx.lineTo(x+s/2-3,y-s*0.3);ctx.stroke();ctx.restore();}
// a card of fields and their values, in mono: the field soft, its value white. rows [[field, value, colour?], ...]; o.kick, o.edge,
// o.icon, o.rowA(i), o.lit (a row's index: it glows), o.litCol, o.fw (the fields' column), o.a, o.k; returns its box
function fd_kv(ctx,x,y,w,rows,o){o=o||{};const a=o.a==null?1:o.a,rh=o.rh||52,top=o.kick?78:30,h=top+rows.length*rh+18,fw=o.fw||260;if(a<=0.004)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,ag_spr(o.k,0,0.5)));md_card(ctx,x,y,w,h,{edge:o.edge,glow:o.edge?0.7:0.3});
  if(o.kick)md_T(ctx,String(o.kick).toUpperCase(),x+28,y+52,{w:800,size:28,ls:4,col:o.kickCol||o.edge||MD.soft});if(o.icon)md_icon(ctx,o.icon,x+w-48,y+44,38,o.edge||MD.ink);
  rows.forEach((r,i)=>{const ra=o.rowA?o.rowA(i):1;if(ra<=0.004)return;const yy=y+top+i*rh;ctx.save();ctx.globalAlpha*=ra;
    if(o.lit===i||(Array.isArray(o.lit)&&o.lit.includes(i))){const lc=o.litCol||MD.flow;ctx.fillStyle=rgba(lc,0.13);rr(ctx,x+14,yy+4,w-28,rh-6,10);ctx.fill();ctx.strokeStyle=rgba(lc,0.85);ctx.lineWidth=1.8;rr(ctx,x+14,yy+4,w-28,rh-6,10);ctx.stroke();}
    md_T(ctx,r[0],x+28,yy+rh/2+10,{w:500,size:28,f:"mono",col:MD.soft});md_T(ctx,r[1],x+28+fw,yy+rh/2+10,{w:500,size:28,f:"mono",col:r[2]||MD.ink});ctx.restore();});
  ctx.restore();return{x,y,w,h};}
// a file of code or YAML: o.kick (its name), o.edge, o.lineA(i), o.a, o.k; each line [text, colour?], indents kept
function fd_code(ctx,x,y,w,lines,o){o=o||{};const a=o.a==null?1:o.a,lh=40,top=o.kick?80:32,h=top+lines.length*lh+22;if(a<=0.004)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,ag_spr(o.k,0,0.5)));md_card(ctx,x,y,w,h,{edge:o.edge,glow:o.edge?0.8:0.3,fill:"rgba(8,13,28,0.96)"});
  if(o.kick)md_T(ctx,o.kick,x+28,y+52,{w:500,size:28,f:"mono",col:o.kickCol||o.edge||MD.soft});if(o.icon)md_icon(ctx,o.icon,x+w-48,y+44,38,o.edge||MD.ink);
  lines.forEach((l,i)=>{const la=o.lineA?o.lineA(i):1;if(la<=0.004)return;const s=typeof l==="string"?l:l[0],c=typeof l==="string"?null:l[1],m=/^(\s*-?\s*)([\w.]+:)?(.*)$/.exec(s),yy=y+top+i*lh+28;
    ctx.save();ctx.globalAlpha*=la;let xx=x+28;const lead=m[1]||"",key=m[2]||"",rest=m[3]||"";if(lead){md_T(ctx,lead,xx,yy,{w:500,size:28,f:"mono",col:MD.dim});xx+=md_tw(ctx,lead,{w:500,size:28,f:"mono"});}
    if(key){md_T(ctx,key,xx,yy,{w:500,size:28,f:"mono",col:c||MD.flow});xx+=md_tw(ctx,key,{w:500,size:28,f:"mono"});}
    if(rest)md_T(ctx,rest,xx,yy,{w:500,size:28,f:"mono",col:c&&!key?c:MD.ink});ctx.restore();});
  ctx.restore();return{x,y,w,h};}
// the extracted rows: the fields Finance names, one row for each invoice, and the path of its file; o.rowA(i), o.pathA, o.cols (how many
// of the four columns show), o.lit, o.a. Its own table, as the field names are code and keep their case
const FD_FIELDS=[["supplier_name",410],["invoice_number",290],["invoice_date",250],["total",160]];
function fd_rowsTable(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const rh=58,nc=o.cols==null?4:o.cols;ctx.save();ctx.globalAlpha*=a;
  let cx=x;FD_FIELDS.forEach((f,i)=>{if(i>=nc)return;md_T(ctx,f[0],cx+14,y+36,{w:500,size:28,f:"mono",col:MD.soft});cx+=f[1];});const W_=FD_FIELDS.reduce((s,f)=>s+f[1],0);
  ctx.strokeStyle="rgba(170,200,245,0.25)";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x,y+54);ctx.lineTo(x+W_,y+54);ctx.stroke();
  for(let i=0;i<3;i++){const ra=o.rowA?o.rowA(i):1;if(ra<=0.004)continue;const I=FD_INV[i],ry=y+54+i*rh;ctx.save();ctx.globalAlpha*=ra;
    if(o.lit===i){ctx.fillStyle=rgba(MD.flow,0.12);rr(ctx,x-6,ry+5,W_+12,rh-8,10);ctx.fill();ctx.strokeStyle=rgba(MD.flow,0.8);ctx.lineWidth=1.8;rr(ctx,x-6,ry+5,W_+12,rh-8,10);ctx.stroke();}
    const cells=[I.supplier,I.number,I.iso,I.total.replace(",","")];let xx=x;cells.forEach((c,j)=>{if(j<nc){const cA=o.cellA?o.cellA(i,j):1;if(cA>0)md_T(ctx,c,xx+14,ry+rh/2+10,{w:500,size:28,f:"mono",col:MD.ink,a:cA});}xx+=FD_FIELDS[j][1];});ctx.restore();}
  ctx.restore();}
