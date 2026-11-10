/* ===== The draft and the decision: chess, from New York in 1997 to an online tournament in 2005 =====
   The film's own pictures for its opening (prefix dd_), in the module's matte language and lit from the right like its rooms, so the
   light carries across into the team's room. Nothing is a likeness: the players are drawn as people of their time (suits and ties in
   1997 and 1998, everyday clothes at home in 2005), never as portraits; the machines are drawn as machines of their years (tall dark
   cabinets and a beige monitor in 1997, beige monitors and keyboards in 1998, three flat screens in 2005), with no maker named or shown.
     ddHall, ddLeon, ddHome                       the hall in New York, May 1997; the stage in León, 1998; a room at home, an evening in 2005
     DD_PEOPLE                                    the champion, his opponent in León, and the two amateurs of 2005, as specs for lp_person
     dd_board(ctx, cx, y, w, o)                   a chessboard lying on a table, its near edge's middle at (cx, y), w wide, its pieces
     dd_crt(ctx, x, y, w, o)                      a monitor of the 1990s, its foot's middle at (x, y), a small board on its glass
     dd_cabinets(ctx, x, y, o)                    the machine of 1997: two tall dark cabinets, their feet at y, from x
     dd_lcd(ctx, x, y, w, o)                      a flat screen of 2005 on its stand, its foot at (x, y): a small board and the move its
                                                  program would play (o.from, o.to: squares like "e2"), drawn as an arrow
     dd_bracket(ctx, x, y, w, o)                  the tournament of 2005 on a sheet: three of its entries, how far each got, and the winner
   Colour keeps the module's meaning: nothing in the halls wears the five colours; the amateurs' first prize is green (done, or value),
   the supercomputer's early exit amber (a risk come true); the machines' suggested moves are graphite, never violet, which is only the
   agent's. */

/* ---------------------------------------------------------------- the people of the opening: drawn as people of their time, never as likenesses */
const DD_PEOPLE={
  champ:{key:"ddChamp",name:"",skin:[230,196,168],hair:{style:"side",c:[40,32,30]},top:{kind:"suit",c:[44,44,52],inner:[236,236,240],tie:[112,54,60]},breath:0.27},
  rival:{key:"ddRival",name:"",skin:[226,190,158],hair:{style:"cropped",c:[60,46,38]},top:{kind:"suit",c:[82,80,86],inner:[232,234,238],tie:[94,82,68]},breath:0.25},
  am1:{key:"ddAm1",name:"",skin:[236,206,182],hair:{style:"cropped",c:[150,118,86]},glasses:[60,54,50],top:{kind:"overshirt",c:[100,106,98],inner:[222,222,214]},breath:0.29},
  am2:{key:"ddAm2",name:"",skin:[218,180,148],hair:{style:"side",c:[72,54,42]},beard:[84,64,50],top:{kind:"sweater",c:[126,114,104]},breath:0.31}
};

/* ---------------------------------------------------------------- the places */
// a hall's wall and floor, lit from the right; "ny": a dark stage with a curtain and a pool of light on the table; "leon": a stage of warm
// stone with two arches
function dd_paintHall(c,kind){const R=ag_rnd(kind==="ny"?1997:1998),hz=kind==="ny"?744:760;
  if(kind==="ny"){
    let g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,"rgb(30,28,32)");g.addColorStop(1,"rgb(52,46,46)");c.fillStyle=g;c.fillRect(0,0,W,hz);
    // the curtain's folds: soft vertical bands, lighter where the light from the right catches them
    for(let x=0;x<W;x+=48){const k=0.5+0.5*Math.sin(x/48*1.9+R()*0.6),lt=0.35+0.65*(x/W);
      g=c.createLinearGradient(x,0,x+48,0);g.addColorStop(0,"rgba(96,80,72,0)");g.addColorStop(0.5,"rgba(110,92,82,"+(0.10+0.16*k*lt)+")");g.addColorStop(1,"rgba(96,80,72,0)");
      c.fillStyle=g;c.fillRect(x,60,48,hz-60);}
    c.fillStyle="rgb(26,24,28)";c.fillRect(0,0,W,64);c.fillStyle="rgba(0,0,0,0.25)";c.fillRect(0,64,W,10);
    // the stage floor, dark timber, its boards running back
    g=c.createLinearGradient(0,hz,0,H);g.addColorStop(0,"rgb(66,52,44)");g.addColorStop(1,"rgb(42,34,30)");c.fillStyle=g;c.fillRect(0,hz,W,H-hz);
    c.strokeStyle="rgba(20,14,12,0.35)";c.lineWidth=2;for(let i=-12;i<=12;i++){c.beginPath();c.moveTo(960+i*70,hz);c.lineTo(960+i*190,H);c.stroke();}
    // the pool of light on the table, from above and to the right
    g=c.createRadialGradient(1000,600,40,1000,600,760);g.addColorStop(0,"rgba(255,226,180,0.30)");g.addColorStop(0.5,"rgba(255,214,160,0.10)");g.addColorStop(1,"rgba(255,214,160,0)");
    c.fillStyle=g;c.fillRect(0,0,W,H);
  }else{
    let g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgb(160,140,118)");g.addColorStop(1,"rgb(206,186,158)");c.fillStyle=g;c.fillRect(0,0,W,hz);
    // ashlar: courses of stone, each block a little lighter or darker
    for(let y=0;y<hz;y+=86){const off=(y/86)%2?0:70;for(let x=-off;x<W;x+=140){c.fillStyle="rgba("+(R()<0.5?"255,250,240":"80,60,44")+","+(0.02+R()*0.05)+")";c.fillRect(x+2,y+2,136,82);}
      c.fillStyle="rgba(90,70,54,0.18)";c.fillRect(0,y,W,2);for(let x=-off;x<W;x+=140)c.fillRect(x,y,2,86);}
    // two arches, their recesses in shade
    for(const ax of [330,1590]){c.save();c.beginPath();c.moveTo(ax-170,hz);c.lineTo(ax-170,330);c.arc(ax,330,170,Math.PI,0);c.lineTo(ax+170,hz);c.closePath();
      g=c.createLinearGradient(ax-170,0,ax+170,0);g.addColorStop(0,"rgba(70,54,42,0.62)");g.addColorStop(1,"rgba(96,76,60,0.46)");c.fillStyle=g;c.fill();
      c.strokeStyle="rgba(232,214,188,0.5)";c.lineWidth=6;c.stroke();c.restore();}
    g=c.createLinearGradient(0,hz,0,H);g.addColorStop(0,"rgb(120,90,66)");g.addColorStop(1,"rgb(84,62,46)");c.fillStyle=g;c.fillRect(0,hz,W,H-hz);
    c.strokeStyle="rgba(40,26,18,0.3)";c.lineWidth=2;for(let i=-12;i<=12;i++){c.beginPath();c.moveTo(960+i*70,hz);c.lineTo(960+i*190,H);c.stroke();}
    // the light from the right, warm on the stone
    g=c.createRadialGradient(1500,300,60,1500,300,1400);g.addColorStop(0,"rgba(255,230,190,0.22)");g.addColorStop(1,"rgba(255,230,190,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  }
  // the room's shade on the side away from the light, as in the module's rooms
  const g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(30,24,30,0.32)");g.addColorStop(0.5,"rgba(30,24,30,0.08)");g.addColorStop(1,"rgba(30,24,30,0)");c.fillStyle=g;c.fillRect(0,0,W,H);}
AG_PLACES.ddHall=c=>dd_paintHall(c,"ny");
AG_PLACES.ddLeon=c=>dd_paintHall(c,"leon");
AG_PLACES.ddHome=c=>lp_paintRoom(c,{light:"evening",seed:9});

/* ---------------------------------------------------------------- a chessboard on a table, and its pieces
   o.pieces: [[square, kind, side], ...] (square "e4"; kind "p", "n", "b", "r", "q", "k"; side "w" or "b"); o.a. The board lies on the
   table, its near edge at y, its far edge o.d (40) up the frame and a little narrower. */
const DD_POS=[["g1","k","w"],["f2","p","w"],["g2","p","w"],["h3","p","w"],["e4","p","w"],["d4","n","w"],["c3","p","w"],["e1","r","w"],["d2","q","w"],
  ["g8","k","b"],["f7","p","b"],["g6","p","b"],["h7","p","b"],["e5","p","b"],["d6","p","b"],["c6","n","b"],["e8","r","b"],["d8","q","b"]];
function dd_sq(cx,y,w,d,f,r){const fw=w*0.86,u=(f+0.5)/8,v=(r+0.5)/8,yy=y-v*d,wd=lerp(w,fw,v);return{x:cx-wd/2+u*wd,y:yy,s:wd/8};}
function dd_board(ctx,cx,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const d=o.d||40,fw=w*0.86;ctx.save();ctx.globalAlpha*=a;
  // the board's edge and its squares
  ctx.fillStyle="rgb(92,64,44)";ctx.beginPath();ctx.moveTo(cx-w/2-8,y+8);ctx.lineTo(cx+w/2+8,y+8);ctx.lineTo(cx+fw/2+6,y-d-5);ctx.lineTo(cx-fw/2-6,y-d-5);ctx.closePath();ctx.fill();
  for(let r=0;r<8;r++)for(let f=0;f<8;f++){const v0=r/8,v1=(r+1)/8,w0=lerp(w,fw,v0),w1=lerp(w,fw,v1),y0=y-v0*d,y1=y-v1*d;
    ctx.fillStyle=(f+r)%2?"rgb(232,218,190)":"rgb(150,112,80)";ctx.beginPath();ctx.moveTo(cx-w0/2+f/8*w0,y0);ctx.lineTo(cx-w0/2+(f+1)/8*w0,y0);ctx.lineTo(cx-w1/2+(f+1)/8*w1,y1);ctx.lineTo(cx-w1/2+f/8*w1,y1);ctx.closePath();ctx.fill();}
  // the pieces, far ones first so near ones stand in front
  const ps=(o.pieces||DD_POS).map(p=>({p,f:"abcdefgh".indexOf(p[0][0]),r:+p[0][1]-1})).sort((A,B)=>B.r-A.r);
  for(const {p,f,r} of ps){const q=dd_sq(cx,y,w,d,f,r);dd_piece(ctx,q.x,q.y+q.s*0.08,q.s*0.95,p[1],p[2]);}
  ctx.restore();}
// one piece standing on its square: a small turned shape, ivory or ebony, lit from the right
function dd_piece(ctx,x,y,s,kind,side){const hgt={p:0.9,n:1.15,b:1.25,r:1.05,q:1.4,k:1.5}[kind]*s,base=side==="w"?[238,228,206]:[52,44,42],g=ctx.createLinearGradient(x-s/2,0,x+s/2,0);
  g.addColorStop(0,rgba(mix(base,[0,0,0],0.28),1));g.addColorStop(0.65,rgba(base,1));g.addColorStop(1,rgba(mix(base,[255,255,255],0.25),1));ctx.fillStyle=g;
  ctx.beginPath();ctx.ellipse(x,y,s*0.36,s*0.12,0,0,TAU);ctx.fill();
  ctx.beginPath();ctx.moveTo(x-s*0.3,y);ctx.quadraticCurveTo(x-s*0.12,y-hgt*0.45,x-s*0.1,y-hgt*0.72);ctx.lineTo(x+s*0.1,y-hgt*0.72);ctx.quadraticCurveTo(x+s*0.12,y-hgt*0.45,x+s*0.3,y);ctx.closePath();ctx.fill();
  if(kind==="n"){ctx.beginPath();ctx.moveTo(x-s*0.14,y-hgt*0.7);ctx.quadraticCurveTo(x-s*0.2,y-hgt*1.02,x+s*0.04,y-hgt);ctx.lineTo(x+s*0.2,y-hgt*0.84);ctx.lineTo(x+s*0.12,y-hgt*0.7);ctx.closePath();ctx.fill();}
  else if(kind==="r"){ctx.fillRect(x-s*0.17,y-hgt,s*0.34,hgt*0.3);}
  else{ctx.beginPath();ctx.arc(x,y-hgt*0.8,s*(kind==="p"?0.15:0.17),0,TAU);ctx.fill();if(kind==="k"){ctx.fillRect(x-s*0.03,y-hgt*1.04,s*0.06,hgt*0.14);ctx.fillRect(x-s*0.08,y-hgt*0.99,s*0.16,s*0.05);}
    if(kind==="q"){ctx.beginPath();ctx.arc(x,y-hgt*0.99,s*0.06,0,TAU);ctx.fill();}}}

/* ---------------------------------------------------------------- the machines of their years */
// a small board on a screen, and the move its program would play as an arrow (o.from, o.to, o.arrow 0 to 1)
function dd_miniBoard(ctx,x,y,s,o){o=o||{};for(let r=0;r<8;r++)for(let f=0;f<8;f++){ctx.fillStyle=(f+r)%2?"rgb(214,212,204)":"rgb(122,124,120)";ctx.fillRect(x+f*s/8,y+(7-r)*s/8,s/8+0.5,s/8+0.5);}
  for(const p of DD_POS){const f="abcdefgh".indexOf(p[0][0]),r=+p[0][1]-1;ctx.fillStyle=p[2]==="w"?"rgb(250,248,240)":"rgb(36,34,36)";ctx.beginPath();ctx.arc(x+(f+0.5)*s/8,y+(7.5-r)*s/8,s/24,0,TAU);ctx.fill();}
  const u=o.arrow==null?0:o.arrow;if(u>0&&o.from){const sq=q=>[x+("abcdefgh".indexOf(q[0])+0.5)*s/8,y+(7.5-(+q[1]-1))*s/8],[x0,y0]=sq(o.from),[x1,y1]=sq(o.to),xe=lerp(x0,x1,u),ye=lerp(y0,y1,u);
    ctx.save();ctx.strokeStyle="rgba(40,40,44,0.9)";ctx.fillStyle="rgba(40,40,44,0.9)";ctx.lineWidth=s/22;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(xe,ye);ctx.stroke();
    if(u>0.6){const an=Math.atan2(ye-y0,xe-x0),hs=s/10;ctx.beginPath();ctx.moveTo(xe+Math.cos(an)*hs*0.4,ye+Math.sin(an)*hs*0.4);ctx.lineTo(xe-Math.cos(an-0.5)*hs,ye-Math.sin(an-0.5)*hs);ctx.lineTo(xe-Math.cos(an+0.5)*hs,ye-Math.sin(an+0.5)*hs);ctx.closePath();ctx.fill();}
    ctx.restore();}}
// a monitor of the 1990s: a deep beige case, a curved dark glass; o.board (0 to 1) shows the board on it, o.from/o.to/o.arrow its move
function dd_crt(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const h=w*0.82;ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor="rgba(30,20,16,0.35)";ctx.shadowBlur=18;ctx.shadowOffsetX=-8;ctx.shadowOffsetY=8;
  ctx.fillStyle="rgb(196,188,170)";rr(ctx,x-w*0.32,y-h*0.16,w*0.64,h*0.16,6);ctx.fill();ctx.restore();
  let g=ctx.createLinearGradient(x-w/2,0,x+w/2,0);g.addColorStop(0,"rgb(176,168,150)");g.addColorStop(1,"rgb(222,214,196)");ctx.fillStyle=g;rr(ctx,x-w/2,y-h-h*0.12,w,h,w*0.05);ctx.fill();
  const gx=x-w*0.4,gy=y-h*1.04,gw=w*0.8,gh=h*0.66;g=ctx.createRadialGradient(gx+gw*0.4,gy+gh*0.4,10,gx+gw/2,gy+gh/2,gw*0.7);g.addColorStop(0,"rgb(46,52,54)");g.addColorStop(1,"rgb(22,26,28)");
  ctx.fillStyle=g;rr(ctx,gx,gy,gw,gh,w*0.04);ctx.fill();
  if((o.board||0)>0){ctx.save();ctx.globalAlpha*=o.board;const s=gh*0.84;dd_miniBoard(ctx,gx+(gw-s)/2,gy+gh*0.08,s,o);ctx.restore();}
  ctx.fillStyle="rgba(255,255,255,0.08)";rr(ctx,gx+6,gy+6,gw*0.5,gh*0.3,w*0.03);ctx.fill();
  ctx.restore();}
// the machine of 1997: two tall dark cabinets, a few pale lights on each
function dd_cabinets(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  for(const [cx,ch] of [[x,470],[x+190,430]]){ctx.save();ctx.shadowColor="rgba(0,0,0,0.45)";ctx.shadowBlur=30;ctx.shadowOffsetX=-12;ctx.shadowOffsetY=12;
    const g=ctx.createLinearGradient(cx,0,cx+170,0);g.addColorStop(0,"rgb(26,26,30)");g.addColorStop(1,"rgb(58,58,64)");ctx.fillStyle=g;ctx.fillRect(cx,y-ch,170,ch);ctx.restore();
    ctx.strokeStyle="rgba(255,255,255,0.06)";ctx.lineWidth=2;for(let vy=y-ch+40;vy<y-30;vy+=22){ctx.beginPath();ctx.moveTo(cx+24,vy);ctx.lineTo(cx+146,vy);ctx.stroke();}
    const t=o.t||0;for(let i=0;i<6;i++){const on=0.4+0.6*(0.5+0.5*Math.sin(t*1.1+i*2.3+cx));ctx.fillStyle="rgba(232,236,228,"+(0.35+0.4*on)+")";ctx.beginPath();ctx.arc(cx+34+i*20,y-ch+26,3.5,0,TAU);ctx.fill();}}
  ctx.restore();}
// a flat screen of 2005 on its stand: a black bezel, a small board, its program's move
function dd_lcd(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const h=w*0.8;ctx.save();ctx.globalAlpha*=a;
  ctx.fillStyle="rgb(150,150,156)";ctx.fillRect(x-w*0.05,y-h*0.3,w*0.1,h*0.3);ctx.beginPath();ctx.ellipse(x,y,w*0.24,w*0.05,0,0,TAU);ctx.fill();
  ctx.save();ctx.shadowColor="rgba(10,8,8,0.5)";ctx.shadowBlur=20;ctx.shadowOffsetX=-8;ctx.shadowOffsetY=8;ctx.fillStyle="rgb(30,30,34)";rr(ctx,x-w/2,y-h*0.3-h,w,h,8);ctx.fill();ctx.restore();
  const gx=x-w/2+w*0.05,gy=y-h*0.3-h+w*0.05,gw=w*0.9,gh=h-w*0.1;ctx.fillStyle="rgb(234,236,232)";ctx.fillRect(gx,gy,gw,gh);
  const s=Math.min(gw,gh)*0.86;dd_miniBoard(ctx,gx+(gw-s)/2,gy+(gh-s)/2,s,o);
  // the screen's own light on the room
  const g=ctx.createRadialGradient(x,gy+gh/2,10,x,gy+gh/2,w*1.2);g.addColorStop(0,"rgba(236,242,255,0.10)");g.addColorStop(1,"rgba(236,242,255,0)");ctx.fillStyle=g;ctx.fillRect(x-w*1.2,gy-w,w*2.4,w*2.4);
  ctx.restore();}

/* ---------------------------------------------------------------- the tournament of 2005, on a sheet
   o: a; field (0 to 1: the field comes in, small teams of people and screens, anyone who entered; it gives way to the three entries
   the film follows as they come in); u (0 to 1: the entries come in, one by one); reach (0 to 1: the lines run on towards the last eight); out (0 to 1: the
   supercomputer's line stops short, and its tag comes in); final (0 to 1: the two teams that reach the final meet); win (0 to 1:
   the winners' line runs on to first prize); light. Columns: the entries, the last eight, the final, the winner. */
// the field's teams, row by row, each at its place across the sheet (dx from the sheet's left), with a gap between them
const DD_FIELD=(()=>{const R=ag_rnd(2005),f=[];for(let r=0;r<4;r++){let dx=56+(r%2)*40;for(;;){const m={r,n:1+((R()*3)|0),p:R()<0.45?1:2,d:R()*0.5};
  const wd=(m.p+m.n)*24+8;if(dx+wd>1560)break;m.dx=dx;f.push(m);dx+=wd+46;}}return f;})();
// one small team of the field: one or two people and one to three screens, in graphite (no colour: they mean nothing yet)
function dd_team(ctx,x,y,m,a){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ctx.fillStyle=rgba(LP.ink,0.5);
  for(let i=0;i<m.p;i++){const px=x+i*24;ctx.beginPath();ctx.arc(px,y-22,8,0,TAU);ctx.fill();ctx.beginPath();ctx.moveTo(px-14,y);ctx.quadraticCurveTo(px-13,y-12,px,y-12);ctx.quadraticCurveTo(px+13,y-12,px+14,y);ctx.closePath();ctx.fill();}
  for(let i=0;i<m.n;i++){const sx=x+m.p*24+8+i*24;ctx.fillRect(sx,y-24,20,15);ctx.fillRect(sx+8,y-9,4,9);}
  ctx.restore();}
const DD_BR={x:150,y:150,w:1620,cols:[0,0.5,0.7,0.88],rows:[{y:250,text:"Grandmasters, with computers"},{y:380,text:"A supercomputer, alone"},{y:510,text:"Two amateurs, three computers"}]};
function dd_bracket(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const B=DD_BR,X=f=>B.x+B.w*f,h=560;ctx.save();ctx.globalAlpha*=a;
  lp_sheet(ctx,B.x,B.y,B.w,h,{light:o.light==null?null:o.light,pin:false,k:o.k});
  lp_label(ctx,X(0)+36,B.y+64,"Freestyle, 2005 · online",{col:LP.mut});
  for(const [f,s] of [[B.cols[1],"Last eight"],[B.cols[2],"Final"],[B.cols[3],"Winner"]])lp_T(ctx,s,X(f),B.y+64,{w:700,size:28,align:"center",col:LP.mut});
  const u=o.u==null?1:o.u,fa=(o.field||0)*(1-ag_in(u,0,0.3));
  if(fa>0.004)DD_FIELD.forEach(m=>dd_team(ctx,X(0)+m.dx,B.y+170+m.r*100,m,fa*ag_in(o.field,m.d,0.5)));
  const reach=o.reach||0,out=o.out||0,fin=o.final||0,win=o.win||0,ln=(x0,y0,x1,y1,p,col,wd)=>{if(p<=0)return;ctx.strokeStyle=rgba(col,1);ctx.lineWidth=wd||6;ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(lerp(x0,x1,p),lerp(y0,y1,p));ctx.stroke();};
  B.rows.forEach((r,i)=>{const ra=ag_in(u,i/3,1/3);if(ra<=0.004)return;ctx.save();ctx.globalAlpha*=ra;lp_T(ctx,r.text,X(0)+36,B.y+r.y+10,{w:700,size:32});ctx.restore();});
  const x0=X(0.36),xq=X(B.cols[1]),xf=X(B.cols[2]),xw=X(B.cols[3]),yg=B.y+B.rows[0].y,ys=B.y+B.rows[1].y,ya=B.y+B.rows[2].y,yfin=(yg+ya)/2;
  // the grandmasters' team and the amateurs reach the last eight; the supercomputer's line stops short of it
  ln(x0,yg,xq,yg,ag_in(reach,0,0.8),LP.ink);ln(x0,ya,xq,ya,ag_in(reach,0.1,0.9),LP.ink);ln(x0,ys,lerp(x0,xq,0.55),ys,ag_in(reach,0,0.8),mix(LP.ink,LP.amber,out));
  if(out>0){ctx.save();ctx.globalAlpha*=out;const ex=lerp(x0,xq,0.55)+30;ctx.strokeStyle=rgba(LP.amber,1);ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(ex-14,ys-14);ctx.lineTo(ex+14,ys+14);ctx.moveTo(ex+14,ys-14);ctx.lineTo(ex-14,ys+14);ctx.stroke();ctx.restore();
    lp_tag(ctx,ex+40,ys+12,"Out before the last eight",{col:LP.amber,a:out});}
  for(const yy of [yg,ya])if(reach>0.5){ctx.fillStyle=rgba(LP.ink,ag_in(reach,0.6,0.3));ctx.beginPath();ctx.arc(xq,yy,9,0,TAU);ctx.fill();}
  // the final: the two lines meet; the amateurs run on to first prize
  ln(xq,yg,xf,yfin,ag_in(fin,0,0.6),LP.ink);ln(xq,ya,xf,yfin,ag_in(fin,0.1,0.7),LP.ink);
  if(fin>0.6){ctx.fillStyle=rgba(LP.ink,ag_in(fin,0.7,0.3));ctx.beginPath();ctx.arc(xf,yfin,10,0,TAU);ctx.fill();}
  ln(xf,yfin,xw-70,yfin,win,LP.green,8);
  if(win>0.6)lp_pill(ctx,xw+10,yfin,"First prize",{col:LP.green,icon:"tick",a:ag_in(win,0.6,0.4),k:(win-0.6)*3});
  if(fin>0.4)lp_tag(ctx,xf,yfin+70,"Against a grandmaster's team",{align:"center",a:ag_in(fin,0.4,0.4)});
  ctx.restore();}
