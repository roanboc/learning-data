/* ===== Rules that let people decide: Bali, the 1970s and 1980s =====
   The film's own places and pictures for its opening story, in the module's matte, sunlit language, lit from the right as its rooms are
   (prefix rd_). Nothing here is a likeness or a copy of a photograph or a painting: the terraces, the water temple and the clothes are
   drawn from what is known of them (Lansing 1991 and 2007; Lansing and Kremer 1993), in this film's own style. The temple is drawn
   plainly, as a place where farmers meet: a stone wall with a split gate, a shrine of stacked thatched roofs, an open pavilion; no
   ornament copied from Balinese art. People are farmers of the time, in plain shirts, never likenesses; the researchers are named, never
   drawn.
     rdTerraces                  a terraced hillside across a valley, the volcano behind in haze, a canal coming down on the left
     RD_TER, rd_terraces(c, o)   the terraces' fields (rows of polygons, three subaks stacked down the hill) and what's in each now:
                                 water, young rice, ripe rice, bare after the harvest, or dry; the canal's water, the pests
     rdTemple                    a water temple's court: the wall and its split gate, the shrine, the pavilion where the groups meet
     rdModel                     the model, from above: two rivers and the 172 subaks between them, on a printed map
     RD_CELLS, rd_cells(c, o)    the 172 subaks as cells, each coloured by its planting calendar, and the copying rule run year by year
     rd_hopper(c, x, y, s, a)    the brown planthopper, drawn large: a small insect, with tapering curves
     RD_FARMERS                  three farmers of the time
   Colour keeps the module's meaning: the temples' calendar in blue (a plan), the harvest that comes of it in green, the pests and the
   lost water in amber; the land itself wears none of the five (its rice a sage, its water the sky's grey). */

const RD_B={sky0:[192,208,218],sky1:[246,236,214],haze:[232,226,214],volc:[150,156,168],volcHi:[190,192,196],volcDk:[118,122,138],
  forest:[92,104,82],forestHi:[132,140,104],forestDk:[64,74,60],palm:[70,78,58],trunk:[110,96,80],
  water:[168,192,204],waterHi:[214,228,232],waterDk:[160,176,180],sage:[150,166,112],sageHi:[186,196,140],sageDk:[110,126,82],
  ripe:[206,180,112],ripeHi:[230,208,146],ripeDk:[164,138,80],bare:[152,128,100],bareHi:[184,160,126],mud:[134,114,92],
  dry:[202,180,144],dryDk:[162,138,104],riser:[118,116,84],riserDk:[84,86,62],bund:[176,170,128],
  stone:[178,170,158],stoneHi:[214,206,192],stoneDk:[128,120,110],thatch:[58,52,50],thatchHi:[98,90,84],wood:[128,96,70],woodHi:[168,130,96],
  paper:[244,238,226],ink:[96,88,80],river:[150,176,184],riverHi:[200,216,220]};
const RD_PEST=LP.amber;

/* ---------------------------------------------------------------- small things */
const rd_wob=(u,s)=>Math.sin(u*1.7+s*3.1)*0.6+Math.sin(u*3.9+s*1.3)*0.4;
function rd_blob(c,x,y,r,col,a){if(a<=0.004||r<=0)return;const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,rgba(col,a));g.addColorStop(0.6,rgba(col,a*0.4));g.addColorStop(1,rgba(col,0));
  c.fillStyle=g;c.fillRect(x-r,y-r,2*r,2*r);}
function rd_poly(c,pts){c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)c.lineTo(pts[i][0],pts[i][1]);c.closePath();}

/* ---------------------------------------------------------------- the terraces
   Nine rows of fields step down the hill towards us, the far ones small and high, the near ones wide and low. Each row's band, between
   its top edge and the next row's, is the field's water or rice (the upper part) and the earth wall that drops to the row below (the
   lower part), with a bund along the field's front. Rows 0 to 2 are the first subak, 3 to 5 the second, 6 to 8 the third: the canal
   reaches the first before the second, and the second before the third. */
const RD_TER=(()=>{const n=9,Y=[446],H=[];for(let r=0;r<n;r++){H.push(30*Math.pow(1.215,r));Y.push(Y[r]+H[r]);}
  const hh=r=>r<n?H[r]:H[n-1]*1.215;
  // contour lines of a hill: the same rolling shape for every row, a little shifted from row to row, deeper for the near rows
  const raw=(r,x)=>Y[r]+hh(r)*0.62*(0.62*Math.sin(x*0.0029+0.5+r*0.16)+0.38*Math.sin(x*0.0067+1.9+r*0.31))+0.3*hh(r)*(x-960)/960;
  const edge=(r,x)=>{let y=raw(0,x);for(let k=1;k<=r;k++)y=Math.max(raw(k,x),y+0.55*hh(k-1));return y;};
  const left=r=>300-r*22,R=ag_rnd(1979),rows=[];
  for(let r=0;r<n;r++){const fw=150*H[r]/30*0.62+60,xs=[left(r)];while(xs[xs.length-1]<1960){xs.push(xs[xs.length-1]+fw*(0.6+R()*0.8));}
    const fields=[];for(let i=0;i+1<xs.length;i++){const x0=xs[i],x1=Math.min(xs[i+1],2000),top=[],bot=[],face=[];
      for(let k=0;k<=8;k++){const x=lerp(x0,x1,k/8),y0=edge(r,x),y2=edge(r+1,x),y1=lerp(y0,y2,0.6);top.push([x,y0]);bot.push([x,y1]);face.push([x,y2]);}
      fields.push({r,i,x0,x1,top,bot,face,cx:(x0+x1)/2,cy:(top[4][1]+bot[4][1])/2,subak:r<3?0:r<6?1:2,seed:R()});}
    rows.push({r,fields,h:H[r]});}
  return{n,rows,edge,left,Y,H,all:rows.flatMap(q=>q.fields)};})();

AG_PLACES.rdTerraces=c=>rd_paintValley(c,{});
function rd_paintValley(c,o){const R=ag_rnd(o.seed||12);
  // the sky, the soft clouds
  let g=c.createLinearGradient(0,0,0,480);g.addColorStop(0,rgba(RD_B.sky0,1));g.addColorStop(1,rgba(RD_B.sky1,1));c.fillStyle=g;c.fillRect(0,0,W,H);
  for(let i=0;i<9;i++)rd_blob(c,160+i*210+R()*80,70+R()*120,120+R()*90,[252,248,240],0.5);
  // the mountain, far off in haze: a broad volcano with a broken rim, its near flank catching the light
  const base=476,pk=[[-80,base],[220,base-40],[470,330],[640,214],[700,186],[738,198],[772,176],[812,190],[858,184],[940,236],[1130,342],[1440,base-46],[2000,base-8],[2000,base+30],[-80,base+30]];
  c.beginPath();c.moveTo(pk[0][0],pk[0][1]);for(let i=1;i<pk.length;i++){const p0=pk[i-1],p1=pk[i];c.quadraticCurveTo(p0[0],p0[1],(p0[0]+p1[0])/2,(p0[1]+p1[1])/2);}c.closePath();
  g=c.createLinearGradient(380,0,1240,0);g.addColorStop(0,rgba(RD_B.volcDk,1));g.addColorStop(0.55,rgba(RD_B.volc,1));g.addColorStop(1,rgba(RD_B.volcHi,1));c.fillStyle=g;c.fill();
  c.save();c.clip();for(const [x0,y0,x1,y1,w] of [[700,200,560,400,26],[790,190,820,420,20],[870,200,1040,420,24]]){c.strokeStyle="rgba(240,236,228,0.16)";c.lineWidth=w;c.lineCap="round";c.beginPath();c.moveTo(x0,y0);c.quadraticCurveTo((x0+x1)/2+30,(y0+y1)/2,x1,y1);c.stroke();}c.restore();
  rd_blob(c,760,196,140,[250,246,238],0.55);rd_blob(c,960,250,160,[250,246,238],0.4);
  g=c.createLinearGradient(0,290,0,480);g.addColorStop(0,rgba(RD_B.haze,0));g.addColorStop(1,rgba(RD_B.haze,0.9));c.fillStyle=g;c.fillRect(0,290,W,200);
  // the forest along the ridge, a few palms standing out of it
  const ridge=x=>430+14*Math.sin(x*0.006+1.2)+9*Math.sin(x*0.017);
  c.beginPath();c.moveTo(0,H);for(let x=0;x<=W;x+=12)c.lineTo(x,ridge(x)-8-14*Math.abs(Math.sin(x*0.031))-10*Math.abs(Math.sin(x*0.013+2)));c.lineTo(W,H);c.closePath();
  g=c.createLinearGradient(0,390,0,480);g.addColorStop(0,rgba(RD_B.forestHi,1));g.addColorStop(1,rgba(RD_B.forest,1));c.fillStyle=g;c.fill();
  for(let i=0;i<70;i++){const x=R()*W,y=ridge(x)-6-R()*16;rd_blob(c,x,y,18+R()*22,i%3?RD_B.forestDk:RD_B.forestHi,0.35);}
  for(const [x,h,l] of [[140,150,-0.3],[420,120,0.2],[1210,140,-0.15],[1530,110,0.25],[1760,150,0.1]])rd_palm(c,x,ridge(x)+6,h,l);
  // the terraces: each field's ground, its earth wall and its bund; what grows in it is drawn live (rd_terraces)
  c.fillStyle=rgba(RD_B.riserDk,1);c.fillRect(0,RD_TER.Y[0]-6,W,H);
  for(const row of RD_TER.rows)for(const f of row.fields){
    g=c.createLinearGradient(0,f.bot[4][1],0,f.face[4][1]);g.addColorStop(0,rgba(RD_B.riser,1));g.addColorStop(1,rgba(RD_B.riserDk,1));c.fillStyle=g;
    rd_poly(c,f.bot.concat(f.face.slice().reverse()));c.fill();
    c.strokeStyle="rgba(176,176,126,0.32)";c.lineWidth=1.4;const nT=Math.round((f.x1-f.x0)/(26-row.r*1.5));
    for(let k=0;k<nT;k++){const u=(k+0.5)/nT,x=lerp(f.x0,f.x1,u),yb=lerp(f.bot[0][1],f.bot[8][1],u),yf=lerp(f.face[0][1],f.face[8][1],u),y=lerp(yb,yf,0.35+0.5*Math.abs(rd_wob(k,f.seed*9)));
      c.beginPath();c.moveTo(x,y);c.lineTo(x+2,y-row.h*0.08);c.stroke();}
    c.fillStyle=rgba(RD_B.mud,1);rd_poly(c,f.top.concat(f.bot.slice().reverse()));c.fill();}
  // the gully on the left, wooded, the canal coming down it
  c.beginPath();c.moveTo(-10,RD_TER.Y[0]-10);for(let r=0;r<=RD_TER.n;r++){const y=r<RD_TER.n?RD_TER.edge(r,RD_TER.left(r)):H+10;c.lineTo((r<RD_TER.n?RD_TER.left(r):RD_TER.left(RD_TER.n-1)-20)+6,y);}c.lineTo(-10,H+10);c.closePath();
  g=c.createLinearGradient(0,440,0,H);g.addColorStop(0,rgba(RD_B.forest,1));g.addColorStop(1,rgba(RD_B.forestDk,1));c.fillStyle=g;c.fill();
  c.save();c.clip();for(let i=0;i<90;i++){const y=440+R()*660,x=R()*(RD_TER.left(Math.min(8,Math.floor((y-440)/70)))+10);rd_blob(c,x,y,22+R()*36,i%3?RD_B.forestHi:RD_B.forestDk,0.45);}c.restore();
  c.save();c.lineCap="round";c.lineJoin="round";c.strokeStyle=rgba(RD_B.riserDk,0.9);c.lineWidth=20;c.beginPath();rd_canalPath(c);c.stroke();
  c.strokeStyle=rgba(RD_B.waterDk,1);c.lineWidth=10;c.beginPath();rd_canalPath(c);c.stroke();c.restore();
  // the near shade, and the warm light from the right
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(52,44,52,0.16)");g.addColorStop(0.5,"rgba(52,44,52,0)");g.addColorStop(1,"rgba(255,214,150,0.08)");c.fillStyle=g;c.fillRect(0,0,W,H);}
// a coconut palm: a thin leaning trunk and a crown of drooping, tapering fronds
function rd_palm(c,x,y,h,lean){const tx=x+lean*h*0.3,ty=y-h;c.strokeStyle=rgba(RD_B.trunk,1);c.lineWidth=Math.max(3,h*0.04);c.lineCap="round";
  c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+lean*h*0.05,y-h*0.6,tx,ty);c.stroke();
  for(let k=0;k<7;k++){const an=-Math.PI/2+(k-3)*0.5,l=h*0.46,dir=Math.cos(an),ex=tx+dir*l,ey=ty+l*(0.18+0.5*Math.abs(dir)),mx=tx+dir*l*0.55,my=ty-l*(0.32-0.25*Math.abs(dir));
    const nx=-(ey-ty),ny=ex-tx,nl=Math.hypot(nx,ny)||1,wd=h*0.05;
    c.fillStyle=rgba(k%2?RD_B.palm:RD_B.forestDk,1);c.beginPath();c.moveTo(tx,ty);c.quadraticCurveTo(mx+nx/nl*wd,my+ny/nl*wd,ex,ey);c.quadraticCurveTo(mx-nx/nl*wd*0.4,my-ny/nl*wd*0.4,tx,ty);c.fill();}}
// the canal: from the forest on the left, down the hill past each row's first field
function rd_canalPath(c){const p=rd_canalPts();c.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length;i++)c.lineTo(p[i][0],p[i][1]);}
const RD_CANAL=(()=>{const p=[[300,400]];for(let r=0;r<RD_TER.n;r++){const x=RD_TER.left(r)-18,y0=RD_TER.edge(r,x)+RD_TER.H[r]*0.3;p.push([x+10,y0-RD_TER.H[r]*0.2],[x,y0+RD_TER.H[r]*0.6]);}p.push([110,1090]);return p;})();
function rd_canalPts(){return RD_CANAL;}

/* what grows in each field now. st(f) returns {kind, u} for field f: kind "water" (flooded, just planted: u how far the water has
   spread), "young", "ripe", "bare" (after the harvest), "dry"; u (0 to 1) blends from the field's last kind (f.was). o.pests: an
   array of pests [{x, y, a}]; o.flow: 0 to 1, the canal's water running; o.dryFrom: rows from here down get no water (0 to 1) */
const RD_COL={water:[RD_B.water,RD_B.waterHi],young:[RD_B.sage,RD_B.sageHi],ripe:[RD_B.ripe,RD_B.ripeHi],bare:[RD_B.bare,RD_B.bareHi],dry:[RD_B.dry,RD_B.dryDk]};
function rd_fieldCol(kind,hi){const q=RD_COL[kind]||RD_COL.bare;return hi?q[1]:q[0];}
function rd_terraces(c,t,o){o=o||{};const st=o.st||(()=>({kind:"water",u:1}));
  for(const f of RD_TER.all){const s=st(f,t),k0=s.from||s.kind,u=s.u==null?1:s.u;
    const col=mix(rd_fieldCol(k0),rd_fieldCol(s.kind),ag_sine(u)),hi=mix(rd_fieldCol(k0,1),rd_fieldCol(s.kind,1),ag_sine(u));
    const yT=f.top[4][1],yB=f.bot[4][1],g=c.createLinearGradient(f.x0,yT,f.x1,yB);g.addColorStop(0,rgba(col,1));g.addColorStop(1,rgba(hi,1));c.fillStyle=g;
    rd_poly(c,f.top.concat(f.bot.slice().reverse()));c.fill();
    // the water's shine, or the rice's rows, or the cracks of dry earth, following the terrace's curve
    const kind=ag_sine(u)>0.5?s.kind:k0,hh=yB-yT;c.save();rd_poly(c,f.top.concat(f.bot.slice().reverse()));c.clip();
    if(kind==="water"){c.strokeStyle="rgba(255,255,255,0.35)";c.lineWidth=Math.max(1,hh*0.06);for(let j=0;j<3;j++){const v=0.25+j*0.25+0.05*Math.sin(t*0.6+f.seed*10+j);
      c.beginPath();for(let k=0;k<=8;k++){const x=f.top[k][0],y=lerp(f.top[k][1],f.bot[k][1],v);k?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();}
      // seedlings, just planted: faint dots in rows
      if(s.seed){c.fillStyle=rgba(RD_B.sageDk,0.35*s.seed);const nr=Math.max(2,Math.round(hh/12));for(let j=1;j<nr;j++){const v=j/nr,nk=Math.round((f.x1-f.x0)/16);for(let k=0;k<nk;k++){const uu=(k+0.5)/nk,x=lerp(f.x0,f.x1,uu),
        y=lerp(lerp(f.top[0][1],f.top[8][1],uu),lerp(f.bot[0][1],f.bot[8][1],uu),v);c.fillRect(x,y,Math.max(1,hh*0.035),Math.max(1,hh*0.035));}}}}
    else if(kind==="young"||kind==="ripe"){c.strokeStyle=rgba(kind==="young"?RD_B.sageDk:RD_B.ripeDk,0.45);c.lineWidth=Math.max(1,hh*0.05);const nr=Math.max(3,Math.round(hh/6));
      for(let j=1;j<nr;j++){const v=j/nr;c.beginPath();for(let k=0;k<=8;k++){const x=f.top[k][0],y=lerp(f.top[k][1],f.bot[k][1],v);k?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();}}
    else if(kind==="dry"){c.strokeStyle=rgba(RD_B.dryDk,0.7);c.lineWidth=Math.max(1,hh*0.035);const R=ag_rnd(Math.floor(f.seed*1e4));
      for(let j=0;j<(f.x1-f.x0)/26;j++){let x=lerp(f.x0,f.x1,R()),y=lerp(yT,yB,R());c.beginPath();c.moveTo(x,y);for(let k=0;k<3;k++){x+=(R()-0.5)*hh*0.9;y+=(R()-0.5)*hh*0.5;c.lineTo(x,y);}c.stroke();}}
    else if(kind==="bare"){c.strokeStyle=rgba(RD_B.bareHi,0.5);c.lineWidth=Math.max(1,hh*0.04);for(let k=0;k<(f.x1-f.x0)/14;k++){const uu=(k+0.5)/((f.x1-f.x0)/14),x=lerp(f.x0,f.x1,uu),
      y0=lerp(lerp(f.top[0][1],f.top[8][1],uu),lerp(f.bot[0][1],f.bot[8][1],uu),0.3+0.4*((k*7)%5)/5);c.beginPath();c.moveTo(x,y0);c.lineTo(x+1,y0-hh*0.12);c.stroke();}}
    c.restore();
    // the bund along the field's front
    c.strokeStyle=rgba(RD_B.bund,0.9);c.lineWidth=Math.max(1.4,hh*0.07);c.beginPath();for(let k=0;k<=8;k++){const [x,y]=f.bot[k];k?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();
    // a short bund between fields
    c.lineWidth=Math.max(1.2,hh*0.05);c.beginPath();c.moveTo(f.top[0][0],f.top[0][1]);c.lineTo(f.bot[0][0],f.bot[0][1]);c.stroke();
    // a field outlined in a colour that means something (a subak's calendar in blue, a lost field in amber)
    if(o.edge){const e=o.edge(f);if(e&&e.a>0.004){c.strokeStyle=rgba(e.col,e.a);c.lineWidth=e.w||4;rd_poly(c,f.top.concat(f.bot.slice().reverse()));c.stroke();}}}
  // the canal's water, running down: bright flecks moving along it
  if(o.flow>0){const P=RD_CANAL;let L=0;const seg=[];for(let i=1;i<P.length;i++){const d=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);seg.push([L,d,i]);L+=d;}
    const reach=o.reach==null?1:o.reach;c.save();c.lineCap="round";c.strokeStyle=rgba(RD_B.water,o.flow);c.lineWidth=12;c.beginPath();let drawn=0;
    for(const [l0,d,i] of seg){if(l0>L*reach)break;const u=Math.min(1,(L*reach-l0)/d);if(!drawn){c.moveTo(P[i-1][0],P[i-1][1]);drawn=1;}c.lineTo(lerp(P[i-1][0],P[i][0],u),lerp(P[i-1][1],P[i][1],u));}c.stroke();
    c.fillStyle=rgba(RD_B.waterHi,0.9*o.flow);for(let k=0;k<26;k++){const l=((t*90+k*L/26)%L);if(l>L*reach)continue;const s=seg.find(q=>l>=q[0]&&l<q[0]+q[1]);if(!s)continue;const u=(l-s[0])/s[1],i=s[2];
      c.beginPath();c.arc(lerp(P[i-1][0],P[i][0],u),lerp(P[i-1][1],P[i][1],u),3.2,0,TAU);c.fill();}c.restore();}
  if(o.pests)for(const p of o.pests)rd_pest(c,p.x,p.y,p.s||1,p.a,p.ph||0,t);}
// a pest on the rice: a small amber insect, wings folded like a roof, seen from above
function rd_pest(c,x,y,s,a,ph,t){if(a<=0.004)return;c.save();c.globalAlpha*=a;c.translate(x,y);c.rotate(0.4*Math.sin(t*2+ph));c.scale(s,s);
  c.fillStyle=rgba(ag_dk(RD_PEST,0.2),1);c.beginPath();c.ellipse(0,0,4,9,0,0,TAU);c.fill();c.fillStyle=rgba(ag_lt(RD_PEST,0.25),0.9);c.beginPath();c.moveTo(0,-5);c.lineTo(5,9);c.lineTo(0,7);c.lineTo(-5,9);c.closePath();c.fill();c.restore();}
// where the pests are at t: a swarm in the fields st marks hungry (a field's u: how many it feeds), each one hopping from field to field
function rd_swarm(t,fields,n,a,seed){const R=ag_rnd(seed||5),out=[];if(!fields.length||a<=0.004)return out;
  for(let i=0;i<n;i++){const hop=2.6+R()*2.2,k=Math.floor((t+R()*hop)/hop),f0=fields[Math.floor((k*7+i*13+Math.floor(R()*99))%fields.length)],f1=fields[Math.floor(((k+1)*7+i*13+Math.floor(R()*99))%fields.length)];
    const u=ag_sine(clamp(((t+R()*hop)%hop)/hop*3-1.6,0,1)),jx=(R()-0.5)*0.7,jy=(R()-0.5)*0.4,
      p0=[lerp(f0.x0,f0.x1,0.5+jx*0.8),f0.cy+jy*(f0.bot[4][1]-f0.top[4][1])],p1=[lerp(f1.x0,f1.x1,0.5+jx*0.8),f1.cy+jy*(f1.bot[4][1]-f1.top[4][1])];
    const sc=0.6+0.9*(f0.r/8);out.push({x:lerp(p0[0],p1[0],u),y:lerp(p0[1],p1[1],u)-Math.sin(u*Math.PI)*30*sc,s:sc,a,ph:i});}
  return out;}

/* ---------------------------------------------------------------- the water temple */
AG_PLACES.rdTemple=c=>rd_paintTemple(c);
function rd_paintTemple(c){const R=ag_rnd(31);
  let g=c.createLinearGradient(0,0,0,700);g.addColorStop(0,rgba(RD_B.sky0,1));g.addColorStop(1,rgba(RD_B.sky1,1));c.fillStyle=g;c.fillRect(0,0,W,H);
  for(let i=0;i<7;i++)rd_blob(c,200+i*260+R()*60,90+R()*90,140+R()*80,[252,248,240],0.5);
  // trees behind the wall
  for(let i=0;i<40;i++){const x=R()*W,y=520+R()*80;rd_blob(c,x,y,60+R()*60,i%2?RD_B.forest:RD_B.forestHi,0.7);}
  rd_palm(c,240,600,300,-0.3);rd_palm(c,1720,600,280,0.25);
  // the shrine of stacked roofs, behind the wall on the left
  rd_meru(c,560,600,{tiers:5,w:300});
  // the court's wall, and the split gate in it
  const wy=640;g=c.createLinearGradient(0,wy-90,0,wy+30);g.addColorStop(0,rgba(RD_B.stoneHi,1));g.addColorStop(1,rgba(RD_B.stone,1));c.fillStyle=g;c.fillRect(0,wy-90,W,140);
  c.fillStyle=rgba(RD_B.stoneDk,1);c.fillRect(0,wy-96,W,10);c.fillStyle=rgba(ag_lt(RD_B.stoneHi,0.3),1);c.fillRect(0,wy-96,W,3);
  c.strokeStyle="rgba(90,80,70,0.18)";c.lineWidth=1.5;for(let y=wy-80;y<wy+40;y+=22)for(let x=(y/22%2)*30;x<W;x+=60){c.beginPath();c.moveTo(x,y);c.lineTo(x+56,y);c.stroke();}
  rd_gate(c,1080,wy+40,{w:120,h:330,gap:110});
  // the court's ground, packed earth with a stone path to the gate
  g=c.createLinearGradient(0,wy+40,0,H);g.addColorStop(0,rgba([196,178,150],1));g.addColorStop(1,rgba([160,140,114],1));c.fillStyle=g;c.fillRect(0,wy+40,W,H-wy-40);
  c.fillStyle="rgba(214,204,186,0.6)";c.beginPath();c.moveTo(1035,wy+40);c.lineTo(1125,wy+40);c.lineTo(1360,H);c.lineTo(800,H);c.closePath();c.fill();
  // the pavilion where the groups meet, on the right: a raised floor, four posts, a thatched roof
  rd_bale(c,1480,wy+120,{w:560,h:260});
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(52,44,52,0.18)");g.addColorStop(0.5,"rgba(52,44,52,0)");g.addColorStop(1,"rgba(255,214,150,0.08)");c.fillStyle=g;c.fillRect(0,0,W,H);}
// a shrine of stacked thatched roofs on a stone base, each roof smaller than the one under it
function rd_meru(c,cx,base,o){const tiers=o.tiers||5,w=o.w||280,bh=90;let g=c.createLinearGradient(cx-w*0.32,0,cx+w*0.32,0);g.addColorStop(0,rgba(RD_B.stoneDk,1));g.addColorStop(1,rgba(RD_B.stoneHi,1));
  c.fillStyle=g;c.fillRect(cx-w*0.3,base-bh,w*0.6,bh);c.fillStyle=rgba(RD_B.wood,1);c.fillRect(cx-w*0.07,base-bh-tiers*46-40,w*0.14,tiers*46+40);
  for(let k=0;k<tiers;k++){const tw=w*(1-k*0.14),y=base-bh-18-k*46,th=34;g=c.createLinearGradient(cx-tw/2,0,cx+tw/2,0);g.addColorStop(0,rgba(ag_dk(RD_B.thatch,0.2),1));g.addColorStop(1,rgba(RD_B.thatchHi,1));
    c.fillStyle=g;c.beginPath();c.moveTo(cx-tw/2,y+th*0.5);c.quadraticCurveTo(cx-tw*0.3,y-th*0.6,cx,y-th*0.8);c.quadraticCurveTo(cx+tw*0.3,y-th*0.6,cx+tw/2,y+th*0.5);c.closePath();c.fill();
    c.strokeStyle="rgba(150,140,130,0.25)";c.lineWidth=1.2;for(let j=0;j<10;j++){const u=(j+0.5)/10,x=lerp(cx-tw/2,cx+tw/2,u);c.beginPath();c.moveTo(x,y+th*0.45);c.lineTo(lerp(x,cx,0.3),y-th*0.4);c.stroke();}}
  c.fillStyle=rgba(RD_B.thatch,1);c.beginPath();c.moveTo(cx-12,base-bh-18-tiers*46);c.lineTo(cx,base-bh-18-tiers*46-34);c.lineTo(cx+12,base-bh-18-tiers*46);c.closePath();c.fill();}
// a split gate: two tall stone towers, each stepping in towards its top, the faces between them cut straight; lit from the right
function rd_gate(c,cx,base,o){const w=o.w,h=o.h,gap=o.gap,T=[[0,0],[0.36,0.16],[0.56,0.32],[0.72,0.5],[0.85,0.66],[1,0.9]];
  for(const side of [-1,1]){const inner=side<0?cx-gap/2:cx+gap/2,outer=k=>inner+side*w*(1-T[k][1]);
    for(let k=0;k<T.length-1;k++){const y0=base-h*T[k][0],y1=base-h*T[k+1][0],xo=outer(k),xa=Math.min(xo,inner),xb=Math.max(xo,inner);
      const g=c.createLinearGradient(xa,0,xb,0);g.addColorStop(0,rgba(side<0?RD_B.stoneDk:RD_B.stone,1));g.addColorStop(1,rgba(side<0?RD_B.stone:RD_B.stoneHi,1));c.fillStyle=g;
      if(k<T.length-2)c.fillRect(xa,y1,xb-xa,y0-y1);else{c.beginPath();c.moveTo(xo,y0);c.lineTo(inner+side*w*0.08,y1);c.lineTo(inner,y1+10);c.lineTo(inner,y0);c.closePath();c.fill();}
      // a cornice at the top of each step: a lip catching the light, its shadow under it
      if(k<T.length-2){const lip=10;c.fillStyle=rgba(RD_B.stoneHi,1);c.fillRect(xa-(side<0?6:0),y1,xb-xa+6,lip*0.5);c.fillStyle="rgba(70,60,52,0.35)";c.fillRect(xa,y1+lip*0.5,xb-xa,lip*0.6);}
      c.fillStyle="rgba(70,60,52,0.12)";for(let y=y0-24;y>y1+14;y-=24)c.fillRect(xa,y,xb-xa,1.4);}
    // the straight inner face, in the gap: lit on the left tower, in shade on the right one
    c.fillStyle=rgba(side<0?RD_B.stoneHi:RD_B.stoneDk,0.8);c.fillRect(side<0?inner-5:inner,base-h*T[T.length-2][0],5,h*T[T.length-2][0]);}
  c.fillStyle="rgba(70,60,52,0.22)";c.fillRect(cx-gap/2,base-6,gap,6);}
// an open pavilion: a raised stone floor, four timber posts, a deep hipped roof of thatch
function rd_bale(c,cx,floor,o){const w=o.w,h=o.h,x0=cx-w/2,x1=cx+w/2;let g=c.createLinearGradient(x0,0,x1,0);g.addColorStop(0,rgba(RD_B.stoneDk,1));g.addColorStop(1,rgba(RD_B.stoneHi,1));
  c.fillStyle=g;c.fillRect(x0-20,floor-56,w+40,56);c.fillStyle="rgba(255,250,240,0.45)";c.fillRect(x0-20,floor-56,w+40,3);c.fillStyle="rgba(70,60,52,0.25)";c.fillRect(x0-20,floor-30,w+40,2);
  const ry=floor-56-h;
  for(const u of [0.04,0.36,0.64,0.96]){const x=lerp(x0,x1,u);g=c.createLinearGradient(x-10,0,x+10,0);g.addColorStop(0,rgba(ag_dk(RD_B.wood,0.25),1));g.addColorStop(1,rgba(RD_B.woodHi,1));c.fillStyle=g;c.fillRect(x-10,ry+20,20,h-20);}
  // the roof: its eaves wide and low, its ridge short, the thatch thick at the edge
  const ex=150,rh=170,rw=w*0.34;g=c.createLinearGradient(x0-ex,0,x1+ex,0);g.addColorStop(0,rgba(ag_dk(RD_B.thatch,0.25),1));g.addColorStop(0.6,rgba(RD_B.thatch,1));g.addColorStop(1,rgba(RD_B.thatchHi,1));c.fillStyle=g;
  c.beginPath();c.moveTo(x0-ex,ry+36);c.quadraticCurveTo(cx-rw-40,ry-rh*0.55,cx-rw,ry-rh);c.lineTo(cx+rw,ry-rh);c.quadraticCurveTo(cx+rw+40,ry-rh*0.55,x1+ex,ry+36);c.closePath();c.fill();
  c.strokeStyle="rgba(160,150,140,0.2)";c.lineWidth=1.4;for(let j=0;j<40;j++){const u=(j+0.5)/40,xb=lerp(x0-ex,x1+ex,u),xt=lerp(cx-rw,cx+rw,u);c.beginPath();c.moveTo(xb,ry+32);c.lineTo(lerp(xb,xt,0.8),lerp(ry+32,ry-rh,0.8));c.stroke();}
  c.fillStyle=rgba(ag_dk(RD_B.thatch,0.3),1);c.fillRect(x0-ex+10,ry+30,w+2*ex-20,14);c.fillStyle=rgba(RD_B.thatchHi,1);c.fillRect(cx-rw-6,ry-rh-8,rw*2+12,10);
  c.fillStyle="rgba(40,32,30,0.2)";c.fillRect(x0-ex+10,ry+44,w+2*ex-20,8);}
/* ---------------------------------------------------------------- the model: two rivers and 172 subaks, from above */
const RD_RIV={a:y=>300+90*Math.sin(y*0.0042+0.6)+30*Math.sin(y*0.011),b:y=>1150+80*Math.sin(y*0.0038+2.1)+34*Math.sin(y*0.009+1)};
const RD_HEX=33,RD_CELLS=(()=>{const r=RD_HEX,dx=Math.sqrt(3)*r,dy=1.5*r,cells=[];
  // rows from the hills down to just above the captions
  for(let row=0;;row++){const y=150+row*dy;if(y>866-r)break;for(let col=-2;col<40;col++){const x=120+col*dx+(row%2)*dx/2,m=Math.min(x-RD_RIV.a(y),RD_RIV.b(y)-x);if(m>r)cells.push({x,y,row,col,m});}}
  // keep 172: drop those nearest a river's bank
  cells.sort((p,q)=>q.m-p.m);cells.length=Math.min(cells.length,172);cells.sort((p,q)=>p.y-q.y||p.x-q.x);
  for(const c of cells){c.nb=cells.filter(o=>o!==c).map(o=>[o,Math.hypot(o.x-c.x,o.y-c.y)]).sort((p,q)=>p[1]-q[1]).slice(0,4).map(p=>cells.indexOf(p[0]));}
  return cells;})();
// the copying rule, run year by year: each subak plants on one of six calendars; its harvest falls with pests (fewer when its
// neighbours rest when it rests) and with water shared too widely (more when too many upstream plant when it plants). Each year
// every subak looks at its four nearest neighbours and copies the calendar of the one with the best harvest, if it beat its own.
const RD_YEARS=(()=>{const R=ag_rnd(1993),n=RD_CELLS.length,K=6;let cal=RD_CELLS.map(()=>Math.floor(R()*K));const years=[cal.slice()],harv=[];
  const harvest=cal=>RD_CELLS.map((c,i)=>{const same=c.nb.filter(j=>cal[j]===cal[i]).length;let up=0;for(let j=0;j<n;j++)if(cal[j]===cal[i]&&RD_CELLS[j].y<c.y-20&&Math.abs(RD_CELLS[j].x-c.x)<240)up++;
    return 5+0.95*same-0.07*Math.max(0,up-5);});
  for(let y=0;y<10;y++){const h=harvest(cal);harv.push(h.reduce((s,v)=>s+v,0)/n);const next=cal.slice();
    for(let i=0;i<n;i++){let best=i;for(const j of RD_CELLS[i].nb)if(h[j]>h[best]+0.1)best=j;if(best!==i&&R()<0.5)next[i]=cal[best];}cal=next;years.push(cal.slice());}
  harv.push(harvest(cal).reduce((s,v)=>s+v,0)/n);return{years,harv};})();
const RD_CALCOL=[[28,72,132],[64,118,184],[132,172,220],[40,56,96],[176,200,232],[92,130,170]];
AG_PLACES.rdModel=c=>rd_paintMap(c);
function rd_paintMap(c){const R=ag_rnd(88);
  // the printout on the table: warm paper, its edge, a soft shadow
  c.fillStyle=rgba([204,190,168],1);c.fillRect(0,0,W,H);c.save();c.shadowColor="rgba(52,36,30,0.3)";c.shadowBlur=30;c.shadowOffsetX=-12;c.shadowOffsetY=14;
  c.fillStyle=rgba(RD_B.paper,1);c.fillRect(100,60,1180,960);c.restore();
  c.strokeStyle="rgba(96,88,80,0.12)";c.lineWidth=1;for(let i=0;i<18;i++){const y=90+R()*900;c.beginPath();c.moveTo(170,y);c.lineTo(1260,y+R()*4-2);c.stroke();}
  // hills, hatched, at the top: where the rivers start
  c.strokeStyle="rgba(96,88,80,0.28)";c.lineWidth=1.4;for(let i=0;i<16;i++){const x=150+R()*1060,y=96+R()*44;c.beginPath();c.moveTo(x,y);c.lineTo(x+18,y-22);c.lineTo(x+36,y);c.stroke();}
  for(const f of [RD_RIV.a,RD_RIV.b]){c.strokeStyle=rgba(RD_B.river,1);c.lineWidth=12;c.lineCap="round";c.beginPath();for(let y=120;y<=1000;y+=10){const x=f(y);y===120?c.moveTo(x,y):c.lineTo(x,y);}c.stroke();
    c.strokeStyle=rgba(RD_B.riverHi,1);c.lineWidth=4;c.beginPath();for(let y=120;y<=1000;y+=10){const x=f(y)+2;y===120?c.moveTo(x,y):c.lineTo(x,y);}c.stroke();}
  // the cells' outlines, faint, so the subaks show even before they're coloured
  for(const q of RD_CELLS){c.strokeStyle="rgba(96,88,80,0.3)";c.lineWidth=1.2;rd_hex(c,q.x,q.y,RD_HEX-1);c.stroke();}}
function rd_hex(c,x,y,r){c.beginPath();for(let k=0;k<6;k++){const an=Math.PI/6+k*Math.PI/3,px=x+Math.cos(an)*r,py=y+Math.sin(an)*r;k?c.lineTo(px,py):c.moveTo(px,py);}c.closePath();}
// the cells at year yr (a fraction blends into the next year), coloured by calendar; o.a; o.pick (index -> 0 to 1: lifted)
function rd_cells(c,yr,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const Y=RD_YEARS.years,y0=clamp(Math.floor(yr),0,Y.length-1),y1=Math.min(Y.length-1,y0+1),u=ag_sine(clamp(yr-y0,0,1));
  c.save();c.globalAlpha*=a;RD_CELLS.forEach((q,i)=>{const col=mix(RD_CALCOL[Y[y0][i]],RD_CALCOL[Y[y1][i]],u);c.fillStyle=rgba(col,0.92);rd_hex(c,q.x,q.y,RD_HEX-2);c.fill();});c.restore();}

/* ---------------------------------------------------------------- the brown planthopper, drawn large */
function rd_hopper(c,x,y,s,a){if(a<=0.004)return;c.save();c.globalAlpha*=a;c.translate(x,y);c.scale(s,s);const body=[122,86,52],bodyHi=[176,134,86],wing=[222,206,170];
  // three short legs, jointed, under the body
  c.strokeStyle=rgba(ag_dk(body,0.25),1);c.lineWidth=4;c.lineCap="round";c.lineJoin="round";
  for(const [sx,kx,ky,ex,ey] of [[-38,-52,30,-46,52],[-12,-20,34,-30,56],[14,22,32,30,56]]){c.beginPath();c.moveTo(sx,14);c.lineTo(kx,ky);c.lineTo(ex,ey);c.stroke();}
  // the body, a wedge tapering to the tail, under the wings
  let g=c.createLinearGradient(0,-10,0,30);g.addColorStop(0,rgba(bodyHi,1));g.addColorStop(1,rgba(ag_dk(body,0.15),1));c.fillStyle=g;
  c.beginPath();c.moveTo(-64,4);c.bezierCurveTo(-50,-14,30,-12,70,10);c.bezierCurveTo(30,26,-50,26,-64,4);c.fill();
  // the head: blunt, broad, with the eye on its side and short feelers
  g=c.createRadialGradient(-76,0,2,-74,2,24);g.addColorStop(0,rgba(bodyHi,1));g.addColorStop(1,rgba(body,1));c.fillStyle=g;c.beginPath();c.ellipse(-74,4,20,17,0.2,0,TAU);c.fill();
  c.fillStyle=rgba([70,44,30],1);c.beginPath();c.ellipse(-80,-2,6,7,0,0,TAU);c.fill();c.fillStyle="rgba(255,240,220,0.7)";c.beginPath();c.arc(-82,-4,1.8,0,TAU);c.fill();
  c.strokeStyle=rgba(body,1);c.lineWidth=2;c.beginPath();c.moveTo(-90,-6);c.quadraticCurveTo(-100,-12,-104,-22);c.stroke();
  // the wings, folded like a roof over the back and past the tail, clear and veined
  g=c.createLinearGradient(0,-40,0,14);g.addColorStop(0,rgba(ag_lt(wing,0.2),0.85));g.addColorStop(1,rgba(wing,0.7));c.fillStyle=g;
  c.beginPath();c.moveTo(-58,-6);c.bezierCurveTo(-30,-34,60,-36,128,-4);c.bezierCurveTo(100,8,20,8,-58,-6);c.fill();
  c.strokeStyle=rgba(ag_dk(wing,0.4),0.75);c.lineWidth=1.8;for(const k of [0.2,0.45,0.7]){c.beginPath();c.moveTo(-50,-8);c.quadraticCurveTo(30,lerp(-30,-4,k),124,lerp(-6,-2,k));c.stroke();}
  c.strokeStyle=rgba(ag_dk(wing,0.45),0.8);c.lineWidth=2.4;c.beginPath();c.moveTo(-58,-6);c.bezierCurveTo(-30,-34,60,-36,128,-4);c.stroke();
  c.restore();}

/* ---------------------------------------------------------------- farmers of the time: plain shirts, bare heads, never likenesses */
const RD_FARMERS={
  f1:{name:"Farmer one",role:"",skin:[166,116,82],hair:{style:"cropped",c:[24,20,20]},top:{kind:"shirt",c:[226,220,204]},breath:0.27},
  f2:{name:"Farmer two",role:"",skin:[150,104,74],hair:{style:"side",c:[70,64,60]},top:{kind:"shirt",c:[152,128,100]},breath:0.25},
  f3:{name:"Farmer three",role:"",skin:[178,128,94],hair:{style:"bun",c:[28,22,22]},earrings:[214,196,150],top:{kind:"tunic",c:[150,120,124]},breath:0.3}
};
