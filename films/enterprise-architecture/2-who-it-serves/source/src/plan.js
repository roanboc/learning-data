/* ===== Who it serves, and how it pays: the film's own pictures (prefixed d2_) =====
   1882: Pearl Street at dusk, its windows lighting one by one; a gas lamp beside an electric bulb; Edison's chemical meter, two zinc
   plates in a jar, one of them on a balance. Today: the annual report, the people who pay, use and decide, the segments' icons, the
   canvases' notes and the table of what each offering earns and costs. */

const WARM=[255,214,150],GASC=[255,160,80],ZINC=[176,184,196];

/* ---------- 1882 ---------- */
// a street of brick buildings at dusk; lit (0..1) turns their windows on, one after another, with a steady electric light
function d2_street(ctx,t,lit,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const base=820;
  for(let i=0;i<7;i++){const x=40+i*270,w=250,h=360+hash(i,3)*170,y=base-h,col=mix([92,52,40],[60,40,36],hash(i,4));
    ctx.fillStyle=rgba(col,1);ctx.fillRect(x,y,w,h);ctx.fillStyle="rgba(30,18,14,0.6)";ctx.fillRect(x,y,w,10);ctx.fillRect(x+w-6,y,6,h);
    // brick courses
    ctx.strokeStyle="rgba(40,22,16,0.35)";ctx.lineWidth=1;for(let yy=y+18;yy<base;yy+=14){ctx.beginPath();ctx.moveTo(x,yy);ctx.lineTo(x+w,yy);ctx.stroke();}
    const rows=Math.floor((h-80)/90);for(let r=0;r<rows;r++)for(let c=0;c<3;c++){const wx=x+24+c*76,wy=y+40+r*90,on=clamp(lit*2.4-hash(i*9+r*3+c,5)*1.4,0,1);
      ctx.fillStyle="rgba(20,16,20,0.95)";ctx.fillRect(wx,wy,50,62);if(on>0){ctx.fillStyle="rgba(255,236,190,"+0.9*on+")";ctx.fillRect(wx+3,wy+3,44,56);glow(ctx,wx+25,wy+31,60,WARM,0.18*on);}
      ctx.strokeStyle="rgba(200,180,150,0.35)";ctx.strokeRect(wx,wy,50,62);ctx.beginPath();ctx.moveTo(wx+25,wy);ctx.lineTo(wx+25,wy+62);ctx.stroke();}}
  ctx.fillStyle="rgba(26,20,18,1)";ctx.fillRect(0,base,W,H-base);ctx.fillStyle="rgba(120,100,80,0.25)";ctx.fillRect(0,base,W,3);
  // overhead wires, strung along the street
  withA(ctx,0.4+0.6*lit,()=>{ctx.strokeStyle=rgba(mix([90,80,70],WARM,lit),0.7);ctx.lineWidth=1.6;[0,14].forEach(d=>{ctx.beginPath();ctx.moveTo(0,300+d);for(let x=0;x<=W;x+=320)ctx.quadraticCurveTo(x+160,330+d,x+320,300+d);ctx.stroke();});});});}
// a gas lamp beside an electric bulb, at (x,y); g and e fade each in
function d2_lamps(ctx,x,y,t,g,e){withA(ctx,g,()=>{const fx=x,fy=y;ctx.strokeStyle="rgba(150,140,120,0.9)";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(fx,fy+40);ctx.lineTo(fx,fy+220);ctx.stroke();
    ctx.strokeStyle="rgba(200,190,160,0.8)";ctx.lineWidth=2;ctx.strokeRect(fx-34,fy-40,68,80);const fl=1+0.12*Math.sin(t*9)+0.08*Math.sin(t*23);glow(ctx,fx,fy,110*fl,GASC,0.35);
    ctx.fillStyle="rgba(255,190,90,0.95)";ctx.beginPath();ctx.ellipse(fx,fy+6,10*fl,22*fl,0,0,TAU);ctx.fill();
    // smoke, curling up
    for(let k=0;k<6;k++){const u=((t*0.35+k/6)%1),sx=fx+Math.sin(u*6+k)*16,sy=fy-50-u*170;ctx.fillStyle="rgba(90,80,76,"+0.28*(1-u)+")";ctx.beginPath();ctx.arc(sx,sy,10+u*24,0,TAU);ctx.fill();}});
  withA(ctx,e,()=>{const bx=x+360,by=y;ctx.strokeStyle="rgba(150,140,120,0.9)";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(bx,by+40);ctx.lineTo(bx,by+220);ctx.stroke();glow(ctx,bx,by,120,[255,240,200],0.4);
    ctx.fillStyle="rgba(255,250,230,0.35)";ctx.beginPath();ctx.arc(bx,by-6,34,0,TAU);ctx.fill();ctx.strokeStyle="rgba(255,250,235,0.9)";ctx.lineWidth=2;ctx.stroke();
    ctx.strokeStyle="rgba(255,236,170,1)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(bx-10,by+10);ctx.lineTo(bx-6,by-16);ctx.quadraticCurveTo(bx,by-30,bx+6,by-16);ctx.lineTo(bx+10,by+10);ctx.stroke();
    ctx.fillStyle="rgba(160,150,130,1)";ctx.fillRect(bx-16,by+26,32,16);});}
// Edison's chemical meter: two zinc plates in a jar; as w goes from 0 to 1, one plate is lifted onto a balance and weighed
function d2_meter(ctx,x,y,s,w,t){const lift=ease(clamp(w*1.5,0,1)),tip=ease(clamp(w*2-0.8,0,1));
  ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  ctx.strokeStyle="rgba(220,230,240,0.8)";ctx.lineWidth=3;ctx.fillStyle="rgba(150,190,210,0.18)";ctx.beginPath();ctx.moveTo(-70,-60);ctx.lineTo(-70,90);ctx.quadraticCurveTo(-70,110,-50,110);ctx.lineTo(50,110);ctx.quadraticCurveTo(70,110,70,90);ctx.lineTo(70,-60);ctx.stroke();ctx.fillRect(-68,-10,136,118);
  const plate=(px,py)=>{ctx.fillStyle=rgba(ZINC,1);ctx.fillRect(px-9,py,18,110);ctx.fillStyle="rgba(255,255,255,0.25)";ctx.fillRect(px-9,py,5,110);};
  plate(-28,-40);plate(lerp(28,250,lift),lerp(-40,-30-tip*14,lift));
  // the balance
  withA(ctx,clamp(w*3,0,1),()=>{ctx.strokeStyle="rgba(222,190,130,0.95)";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(340,140);ctx.lineTo(340,-60);ctx.stroke();ctx.save();ctx.translate(340,-60);ctx.rotate(-0.12*tip);
    ctx.beginPath();ctx.moveTo(-110,0);ctx.lineTo(110,0);ctx.stroke();ctx.beginPath();ctx.moveTo(-110,0);ctx.lineTo(-110,40);ctx.moveTo(110,0);ctx.lineTo(110,40);ctx.stroke();
    ctx.fillStyle="rgba(222,190,130,0.95)";ctx.fillRect(-140,40,60,6);ctx.fillRect(80,40,60,6);ctx.fillStyle="rgba(200,170,110,1)";ctx.fillRect(98,22,24,18);ctx.restore();});
  ctx.restore();}

/* ---------- today ---------- */
function d2_report(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=20;ctx.fillStyle="rgba(244,246,250,0.98)";ctx.fillRect(x,y,w,h);ctx.restore();
  ctx.fillStyle="rgba(60,170,150,0.95)";ctx.fillRect(x,y,w,h*0.32);T(ctx,"Annual report 2025",x+28,y+h*0.2,{w:800,size:26,color:"rgba(255,255,255,1)"});
  ["Safe.","Affordable.","Reliable.","Clean.","Ours."].forEach((s_,i)=>{const on=o.words?o.words[i]||0:1;withA(ctx,0.25+0.75*on,()=>T(ctx,s_,x+28,y+h*0.45+i*36,{w:800,size:26,color:"rgba(30,34,44,1)"}));});
  if(o.whom)withA(ctx,o.whom,()=>{T(ctx,"for whom?",x+w-28,y+h-30,{w:800,size:28,align:"right",color:"rgba(200,80,60,1)"});});});}
// small icons, drawn in line: a house, a heart, a shop, solar panels, the government, the regulator's scales, a key, a bill
function d2_icon(ctx,kind,x,y,s,col){ctx.save();ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);ctx.lineWidth=Math.max(2,s*0.08);ctx.lineJoin="round";ctx.lineCap="round";
  const house=()=>{ctx.beginPath();ctx.moveTo(x-s*0.7,y-s*0.05);ctx.lineTo(x,y-s*0.7);ctx.lineTo(x+s*0.7,y-s*0.05);ctx.moveTo(x-s*0.55,y-s*0.15);ctx.lineTo(x-s*0.55,y+s*0.6);ctx.lineTo(x+s*0.55,y+s*0.6);ctx.lineTo(x+s*0.55,y-s*0.15);ctx.stroke();ctx.strokeRect(x-s*0.15,y+s*0.2,s*0.3,s*0.4);};
  if(kind==="house")house();
  else if(kind==="hardship"){house();ctx.beginPath();const hx=x+s*0.55,hy=y-s*0.55,r=s*0.18;ctx.moveTo(hx,hy+r*1.4);ctx.bezierCurveTo(hx-r*2,hy,hx-r*0.9,hy-r*1.5,hx,hy-r*0.5);ctx.bezierCurveTo(hx+r*0.9,hy-r*1.5,hx+r*2,hy,hx,hy+r*1.4);ctx.fill();}
  else if(kind==="shop"){ctx.strokeRect(x-s*0.65,y-s*0.2,s*1.3,s*0.8);ctx.beginPath();for(let i=0;i<5;i++){const x0=x-s*0.75+i*s*0.3;ctx.moveTo(x0,y-s*0.55);ctx.lineTo(x0+s*0.3,y-s*0.55);ctx.lineTo(x0+s*0.3,y-s*0.25);ctx.arc(x0+s*0.15,y-s*0.25,s*0.15,0,Math.PI);}ctx.stroke();ctx.strokeRect(x-s*0.2,y+s*0.15,s*0.4,s*0.45);}
  else if(kind==="solar"){house();ctx.save();ctx.translate(x-s*0.2,y-s*0.42);ctx.rotate(-0.72);ctx.strokeRect(-s*0.28,-s*0.1,s*0.56,s*0.2);ctx.restore();ctx.beginPath();ctx.moveTo(x+s*0.85,y-s*0.1);ctx.lineTo(x+s*1.15,y-s*0.1);ctx.lineTo(x+s*1.05,y-s*0.2);ctx.moveTo(x+s*1.15,y+s*0.15);ctx.lineTo(x+s*0.85,y+s*0.15);ctx.lineTo(x+s*0.95,y+s*0.25);ctx.stroke();}
  else if(kind==="gov"){ctx.beginPath();ctx.moveTo(x-s*0.75,y-s*0.3);ctx.lineTo(x,y-s*0.7);ctx.lineTo(x+s*0.75,y-s*0.3);ctx.closePath();ctx.stroke();for(let i=0;i<4;i++){const cx=x-s*0.5+i*s*0.33;ctx.beginPath();ctx.moveTo(cx,y-s*0.2);ctx.lineTo(cx,y+s*0.45);ctx.stroke();}ctx.beginPath();ctx.moveTo(x-s*0.8,y+s*0.6);ctx.lineTo(x+s*0.8,y+s*0.6);ctx.stroke();}
  else if(kind==="scales"){ctx.beginPath();ctx.moveTo(x,y-s*0.7);ctx.lineTo(x,y+s*0.6);ctx.moveTo(x-s*0.4,y+s*0.6);ctx.lineTo(x+s*0.4,y+s*0.6);ctx.moveTo(x-s*0.7,y-s*0.45);ctx.lineTo(x+s*0.7,y-s*0.45);ctx.stroke();
    [-1,1].forEach(d=>{ctx.beginPath();ctx.moveTo(x+d*s*0.7,y-s*0.45);ctx.lineTo(x+d*s*0.45,y+s*0.05);ctx.moveTo(x+d*s*0.7,y-s*0.45);ctx.lineTo(x+d*s*0.95,y+s*0.05);ctx.stroke();ctx.beginPath();ctx.arc(x+d*s*0.7,y+s*0.05,s*0.25,0,Math.PI);ctx.stroke();});}
  else if(kind==="key"){ctx.beginPath();ctx.arc(x-s*0.35,y,s*0.25,0,TAU);ctx.moveTo(x-s*0.1,y);ctx.lineTo(x+s*0.7,y);ctx.moveTo(x+s*0.45,y);ctx.lineTo(x+s*0.45,y+s*0.22);ctx.moveTo(x+s*0.65,y);ctx.lineTo(x+s*0.65,y+s*0.2);ctx.stroke();}
  else if(kind==="bill"){ctx.strokeRect(x-s*0.45,y-s*0.65,s*0.9,s*1.3);for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(x-s*0.28,y-s*0.35+i*s*0.25);ctx.lineTo(x+s*(i===3?0.05:0.28),y-s*0.35+i*s*0.25);ctx.stroke();}}
  ctx.restore();}
// a card for someone who pays, uses or decides, with an icon and two lines
function d2_who(ctx,x,y,w,kind,name,line,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,150,18,col,{glow:12+12*(o.hi||0),ea:0.8,fill:"rgba(7,12,24,0.94)",});
  d2_icon(ctx,kind,x+64,y+78,44,col);T(ctx,name,x+130,y+64,{w:800,size:28});wrapT(ctx,line,x+130,y+102,w-150,{w:600,size:20,color:rgba(SOFT,1)});});}
// a small table, in glass: rows of cells, the first row a header
function d2_table(ctx,x,y,cols,rows,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const rh=o.rh||52,w=cols.reduce((s,c)=>s+c,0),h=rh*rows.length+12,col=o.col||[200,210,230];
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,14,col,{glow:12,ea:0.6,fill:"rgba(7,12,24,0.95)"});rows.forEach((r,i)=>{const on=o.on?o.on[i]==null?1:o.on[i]:1;withA(ctx,on,()=>{let cx=x;r.forEach((c,j)=>{T(ctx,c,cx+18,y+rh*(i+0.62)+6,{w:i===0?800:600,size:i===0?18:21,f:i===0?undefined:undefined,color:i===0?rgba(SOFT,1):rgba(INK,0.95)});cx+=cols[j];});
      if(i>0){ctx.fillStyle="rgba(200,210,230,0.12)";ctx.fillRect(x+12,y+rh*i+6,w-24,1.2);}});});});}
