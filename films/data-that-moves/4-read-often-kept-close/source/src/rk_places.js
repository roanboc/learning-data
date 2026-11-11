/* ===== Hot, warm, cold: the film's own places =====
   Painted once each (AG_PLACES; check.py times them), in the module's night:
     rkWorld   the opening's map: the world as a globe of dots, from Svalbard down to the Mediterranean, centred on 57° N, 14° E. Its
               land is the GLOBE land mask (NOAA, public domain, through the global-land-mask package), read on a 9 px grid of the
               frame and kept here as bits (RK_LAND: one bit a dot, row by row). rk_geo(lat, lon) is where a place is on it.
     rkVault   the seed vault on Svalbard, cut open: the night over the mountain, its snow, its rock, and the permafrost the store sits
               in; the tunnel, the halls and the boxes in them are drawn live over it (rk_vaultLive, in rk_look.js), so they can light
     rkFields  a field at first light, its rows running away to the hills, for the seeds sown in Lebanon and Morocco; what grows in it
               is drawn live (rk_shoots), so it can grow
   Every top-level name starts with rk_ or RK_. */

const RK_GLOBE={lon0:14,lat0:57,R:980,cx:760,cy:475,G:9,cols:213,rows:120,rowBytes:27};
const RK_LAND="///Bn8f/gB/+4AAAAAH//////////wAAAAAA//+UH8f/AB//8AAAAAH//////////wAAAAAA//9ef8/4AD//8AAAAAH//////////6AAAAAA/////5/wAH//0AAAQAB//////////8AAAAAA/////x9wAf//8AABQAB///////////AAAAAA"+
  "/////z5gAf//+AACAAB//////////+gAAAAA/////CzgD///+AACAAB///////////AAAAAA////+ClgA///wAAAAIBb//////////AAAAAA////8AAAT///gAAAAIA///////////kAAAAA////8AAAb///AAAAAIB///////////gAAAAA"+
  "/////gAAP///AAcAAII///////////yAAAAA/////AAF///+ABwAAYH///////////wAAAAA/////AAG///6AA4AAYDuf/////////5AAAAA////+AAf///4AAUAAID5//////////4AAAAA////8AAf///4AAQAAMD8//////////4AAAAA"+
  "/+f/wAB////wAAAAAIA/f/////////8AAAAA//v/wAD///6gAAAAAMAHf/////////8AAAAAH/z/gAD///7AAAAAAGAff/////////8AAAAAG/z/gAH///+AAAAAAHD/f/////////+AAAAAEf7/gAH///0AAAAAADD///////////+AAAAA"+
  "APl+gAP///sAAAAAAAB///////////+AAAAAAGF/gAP9//wAAAAAAAD///////////+AAAAAAGF/AAP8MDAAAAAAAAH////////////AAAAAAcA/AAHwAAAAAAAAACf///////////+gAAAAAFAMAAOAAAAAAAAAAC////////////+gAAAA"+
  "AGAAAAMAAAAAAAAAAA/////////////AAAAAADLwAAAAAAAAAAA2AM/////////////AAAAAABHgAAAAAAAAAABvIE/////////////AAAAAAAHAAAAAAOAAAAH//H/////////////gAAAAAAHgAAAAABgAAAP//z/////////////gAAAA"+
  "AAHgAAAAAH4AAAf//1/////////////kAAAAAAHAAAAAAH4AAAv//3/////////////8AAAAAABAAAAAAH4AAAf/wP/////////////+AAAAAAGAAAAAAH4AAAP/8H/////////////+AAAAAAAAAAAAAAAAAA//83/////////////+AAAA"+
  "AAAAAAAAAAAAAA//+P/////////////+AAAAAAAAAAAAAAAAAB/H/v/////////////+AAAAAAAAAAAAAAAAAD/H///////////////+AAAAAAAAAAAAAAAAAD/v////////////////AAAAAAAAAAAAAAAAAH/P////////////////AAAA"+
  "AAAAAAAAAAAAAb+f////////////////AAAAAAAAAAAAAAAAA/8f////////////////AAAAAAAAAAAAAAAAB/8f////////////////AAAAAAAAAAAAAAAAB/4f///////////////+AAAAAAAAAAAAAAACB/4f///////////////+AAAA"+
  "AAAAAAAAAAAAD/8fD//////////////8AAAAAAAAAAAAAAAAD/+MP//////////////2AAAAAAAAAAAAAACwD/+D///////////////yAAAAAAAAAAAAAAAgB/+D//////////////2yAAAAAAAAAAAAAADwDz8L//////////////4QAAAA"+
  "AAAAAAAAAADwBD4J//////////////4RgAAAAAAAAAAAAADgAD4N//////////////wBgAAAAAAAAAAAAARgAZ8P//////////////wBAAAAAAAAAAAAAAbwA54P//////////////wAAAAAAAAAAAAAAD4wA7gP//////////////wAAAAA"+
  "AAAAAAAAABxwAfgP//////////////gAAAAAAAAAAAAAADw4AQQf//////////////gIAAAAAAAAAAAAAHz4AwH///////////////wAAAAAAAAAAAAAAGD4A7f///////////////wAgAAAAAAAAAAAAAP8H/////////////////wAgAAA"+
  "AAAAAAAAAAD8H/////////////////wAAAAAAAAAAAAAAAH4f/////////////////wAAAAAAAAAAAAAAAUc//////////////////wAAAAAAAAAAAAAAAAD//////////////////wAAAAAAAAAAAAAAAAH//////////////////wAAAAA"+
  "AAAAAAAAAAB///////////////////gAAAAAAAAAAAAAAAf////////f//////////gAAAAAAAAAAAAAAAP///////+f//////////gAAAAAAAAAAAAAAAH///////8f//////////gAAAAAAAAAAAAAAAD//////+4f//////////gAAAAA"+
  "AAAAAAAAAAD//////8ff//////////gAAAAAAAAAAAAAAAD//////4MB//////////gAAAAAAAAAAAAAAAD//////4IAP/////////AAAAAAAAAAAAAABQD//////4AAP/////////gAAAAAAAAAAAAAB8D//+///wAAP/////////gAAAAA"+
  "AAAAAAAAB/3//8v//wAAf/////////wAAAAAAAAAAAAAB///+8f//wBB////////7/wAAAAAAAAAAAAAB//84eP//wH////////ez/wAAAAAAAAAAAAAD//4APB//wP////////Bx/wAAAAAAAAAAAAAD//4BPD//wf///////+AA/2AAAAA"+
  "AAAAAAAAH//wBHgP//////////8AA/2AAAAAAAAAAAAAH//ABD4P/j////////4AAf0AAAAAAAAAAAAAH/8ABA+Pwf////////wAAHkAAAAAAAAAAAAAH/8IDAPPi/////////gAADgAAAAAAAAAAAAAD/8IDAMng////////+AAABgAAAAA"+
  "AAAAAAAAA/4ADAGDwf///////cAAAAAAAAAAAAAAAAAAA/4AAACB8P/n/////QAAAAAAAAAAAAAAAAAAAAAAAAED0HiD///H8AAAAAAAAAAAAAAAAAAAAgAAADwAwBgj//+D4gAAAAAAAAAAAAAAAAAAB4H+JgwAQEBD//+AB3gAAAAAAAAA"+
  "AAAAAAAAD////wQAAAAD///AB/gAAAAAAAAAAAAAAAAA/////gAAEgAH///gB/AAAAAAAAAAAAAAAAAA/////wAAAAAH///9D/AAAAAAAAAAAAAAAAAB/////wAAAAAH///9n+AAAAAAAAAAAAAAAAAB/////gAAAAAH////v+AAAAAAAAAA"+
  "AAAAAAEB/////QAAAAAP//////AAAAAAAAAAAAAAAAAH/////wAAQAH//////+AAAAAAAAAAAAAAAAD///////AB9AP//////8AAAAAAAAAAAAAAAAH///////4D///f/////8AAAAAAAAAAAAAAAAf///////4D///v/////4AAAAAAAAAA"+
  "AAAAAAf////////j///0/////4AAAAAAAAAAAAAAAB/////////////8f////4AAAAAAAAAAAAAAAD/////////////8P////gAAAAAAAAAAAAAAAP/////////////8H////AAAAAAAAAAAAAAAAP/////////////+D///+AAAAAAAAAAA"+
  "AAAAAH//////////////A///+AAAAAAAAAAAAAAAAH//////////////gf//+AAAAAAAAAAAAAAAAP//////////////gf//8AAAAAAAAAAAAAAAAH//////////////8P//4IAAAAAAAAAAAAAAAH//////////////8B//wAAAAAAAAAAA"+
  "AAAAAP//////////////+A//gAAAAAAAAAAAAAAAAP//////////////+Af/AAAAAAAAAAAAAAAAAf//////////////+AH+CAAAAAAAAAAAAAAAA////////////////wH8GAAAAAAAAAAAAAAAA////////////////yHwOAAAAAAAAAAA"+
  "AAAAA////////////////6Dg+AAAAAAAAAAAgAAAA/////////////////jB8AAAAAAAAAAAwAAAAf////////////////4D8AAAAAAAAAAA4AAAAP////////////////8P4AAAAAAAAAAA4AAAAP////////////////7f4AAAAAAAAAAA";

// where a place is on the globe, in the frame: orthographic, as the land mask was read
function rk_geo(lat,lon){const r=Math.PI/180,G=RK_GLOBE,la=lat*r,lo=(lon-G.lon0)*r,l0=G.lat0*r;
  return[G.cx+G.R*Math.cos(la)*Math.sin(lo),G.cy-G.R*(Math.cos(l0)*Math.sin(la)-Math.sin(l0)*Math.cos(la)*Math.cos(lo))];}
// the places the opening names: the vault, the gene bank at Tel Hadya near Aleppo, its new homes at Terbol (Lebanon) and Rabat (Morocco)
const RK_AT={svalbard:rk_geo(78.236,15.491),aleppo:rk_geo(36.017,36.94),terbol:rk_geo(33.81,35.98),rabat:rk_geo(33.97,-6.85)};
let RK_BITS=null;
function rk_bits(){if(RK_BITS)return RK_BITS;const s=atob(RK_LAND),b=new Uint8Array(s.length);for(let i=0;i<s.length;i++)b[i]=s.charCodeAt(i);return RK_BITS=b;}
const rk_land=(r,c)=>{const b=rk_bits(),G=RK_GLOBE;return r>=0&&r<G.rows&&c>=0&&c<G.cols&&((b[r*G.rowBytes+(c>>3)]>>(7-(c&7)))&1)===1;};

AG_PLACES.rkWorld=c=>{md_paintNight(c,{grid:false});const G=RK_GLOBE;
  // the sea: a faint glow where the route runs, so the land reads from the night
  let g=c.createRadialGradient(780,520,0,780,520,760);g.addColorStop(0,"rgba(60,96,150,0.10)");g.addColorStop(1,"rgba(60,96,150,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  // the land: a dot every 9 px, brighter near the route and fading towards the frame's far corners
  for(let r=0;r<G.rows;r++)for(let q=0;q<G.cols;q++){if(!rk_land(r,q))continue;const x=q*G.G+G.G/2,y=r*G.G+G.G/2,d=Math.hypot((x-800)/1150,(y-500)/700),
    coast=!(rk_land(r-1,q)&&rk_land(r+1,q)&&rk_land(r,q-1)&&rk_land(r,q+1)),a=clamp(0.62-0.42*d,0.1,0.62)*(coast?1.25:1);
    c.fillStyle=rgba(coast?[150,172,212]:[112,132,170],clamp(a,0,0.8));c.beginPath();c.arc(x,y,coast?2.5:2.2,0,TAU);c.fill();}
  // the Arctic Circle, faint: the vault is far north of it
  c.save();c.strokeStyle="rgba(150,180,230,0.16)";c.lineWidth=1.4;c.setLineDash([3,7]);c.beginPath();for(let lon=-40;lon<=70;lon+=1){const [x,y]=rk_geo(66.56,lon);lon===-40?c.moveTo(x,y):c.lineTo(x,y);}c.stroke();c.restore();
  const v=c.createRadialGradient(W/2,H/2,H*0.4,W/2,H/2,W*0.75);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(0,0,0,0.5)");c.fillStyle=v;c.fillRect(0,0,W,H);};

/* ---------------------------------------------------------------- the vault, cut open
   The mountain in section: its snowy slope rises steeply from the fjord's shore on the left to a plateau on the right; the entrance
   stands out of the slope at RK_VAULT.door, and the tunnel runs from it deep into the rock (RK_VAULT.tunnel) to the store's three
   halls (RK_VAULT.halls), in the permafrost. Not to scale. The painted night holds only what never changes. */
const RK_VAULT={door:[548,668],tunnel:[[566,700],[1196,730]],halls:[[1232,630,196,190],[1446,630,196,190],[1660,630,196,190]],
  surface:[[0,782],[200,776],[360,752],[470,712],[560,660],[660,560],[760,440],[860,346],[980,286],[1140,256],[1400,242],[1920,236]]};
function rk_surface(c,S){c.moveTo(S[0][0],S[0][1]);for(let i=1;i<S.length;i++){const a=S[i-1],b=S[i];c.quadraticCurveTo(a[0],a[1],(a[0]+b[0])/2,(a[1]+b[1])/2);}c.lineTo(S[S.length-1][0],S[S.length-1][1]);}
AG_PLACES.rkVault=c=>{md_paintNight(c,{grid:false});const rnd=ag_rnd(2008),S=RK_VAULT.surface;
  // a twilight band low in the sky: February, the sun only just back
  let g=c.createLinearGradient(0,0,0,800);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(0.75,"rgba(70,100,150,0.12)");g.addColorStop(1,"rgba(130,160,210,0.26)");c.fillStyle=g;c.fillRect(0,0,W,800);
  for(let i=0;i<190;i++){const x=rnd()*W,y=rnd()*620,s=0.6+rnd()*1.3;c.fillStyle="rgba(220,232,255,"+((0.15+rnd()*0.5)*(1-y/800)).toFixed(3)+")";c.beginPath();c.arc(x,y,s,0,TAU);c.fill();}
  // the far shore of the fjord, low and dark, and the water before it
  c.beginPath();c.moveTo(0,790);[[0,700],[90,690],[200,708],[300,694],[400,716],[470,730]].forEach(p=>c.lineTo(p[0],p[1]));c.lineTo(470,790);c.closePath();c.fillStyle="#141d34";c.fill();
  // the mountain: rock in section, under its snow
  c.beginPath();rk_surface(c,S);c.lineTo(W,H);c.lineTo(0,H);c.closePath();
  g=c.createLinearGradient(0,240,0,H);g.addColorStop(0,"#202940");g.addColorStop(0.45,"#161d2f");g.addColorStop(1,"#0b0f1b");c.fillStyle=g;c.fill();
  c.save();c.clip();
  // the rock's layers: strata that dip gently, broken here and there
  for(let k=0;k<14;k++){const y0=300+k*58;c.strokeStyle="rgba(160,172,205,"+(0.04+0.025*(k%3===0))+")";c.lineWidth=2+((k*7)%5);c.beginPath();
    for(let x=0;x<=W;x+=30){const y=y0+0.07*x+9*Math.sin(x/140+k*1.7)+5*Math.sin(x/47+k);x===0?c.moveTo(x,y):c.lineTo(x,y);}c.stroke();}
  for(let i=0;i<60;i++){const x=rnd()*W,y=300+rnd()*760,l=20+rnd()*60,an=0.3+rnd()*0.9;c.strokeStyle="rgba(150,165,200,0.06)";c.lineWidth=1.5;c.beginPath();c.moveTo(x,y);c.lineTo(x+Math.cos(an)*l,y+Math.sin(an)*l);c.stroke();}
  // the permafrost: rock frozen all year round, the store's own cold; a faint frost in it
  g=c.createLinearGradient(0,300,0,H);g.addColorStop(0,"rgba(190,215,250,0.02)");g.addColorStop(0.4,"rgba(190,215,250,0.07)");g.addColorStop(1,"rgba(190,215,250,0.03)");c.fillStyle=g;c.fillRect(0,240,W,H);
  for(let i=0;i<1400;i++){const x=rnd()*W,y=280+rnd()*800,z=1+rnd()*2.2;c.fillStyle="rgba(214,230,255,"+(0.03+rnd()*0.08).toFixed(3)+")";c.fillRect(x,y,z,z);}
  c.restore();
  // the snow: a layer along the surface, thick on the plateau, lit along its top
  c.save();c.beginPath();rk_surface(c,S);c.lineTo(W,S[S.length-1][1]+40);for(let i=S.length-1;i>=0;i--){const [x,y]=S[i];c.lineTo(x,y+(x>900?34:x>500?22:16));}c.closePath();
  g=c.createLinearGradient(0,230,0,800);g.addColorStop(0,"rgba(196,210,236,0.55)");g.addColorStop(1,"rgba(150,168,204,0.35)");c.fillStyle=g;c.fill();c.restore();
  c.save();c.lineJoin="round";c.lineCap="round";c.beginPath();rk_surface(c,S);c.strokeStyle="rgba(214,226,248,0.4)";c.lineWidth=8;c.stroke();c.strokeStyle="rgba(244,248,255,0.9)";c.lineWidth=2.2;c.stroke();c.restore();
  // the entrance: a narrow wedge of concrete standing out of the slope, its door facing the fjord, its edge catching the light
  const [dx,dy]=RK_VAULT.door;c.beginPath();c.moveTo(dx-50,dy+40);c.lineTo(dx-50,dy-46);c.lineTo(dx+56,dy-160);c.lineTo(dx+128,dy-160);c.lineTo(dx+128,dy-70);c.lineTo(dx+12,dy+40);c.closePath();
  g=c.createLinearGradient(dx-50,0,dx+128,0);g.addColorStop(0,"#6b7893");g.addColorStop(0.35,"#46526d");g.addColorStop(1,"#262f45");c.fillStyle=g;c.fill();
  c.strokeStyle="rgba(230,240,255,0.65)";c.lineWidth=1.8;c.beginPath();c.moveTo(dx-50,dy+40);c.lineTo(dx-50,dy-46);c.lineTo(dx+56,dy-160);c.stroke();
  c.fillStyle="#090d1a";c.fillRect(dx-38,dy-16,30,56);c.strokeStyle="rgba(210,235,255,0.75)";c.lineWidth=1.6;c.strokeRect(dx-38,dy-16,30,56);
  const v=c.createRadialGradient(W/2,H/2,H*0.4,W/2,H/2,W*0.75);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(0,0,0,0.5)");c.fillStyle=v;c.fillRect(0,0,W,H);};

/* ---------------------------------------------------------------- a field at first light
   The sky pales over low hills; rows of tilled earth run away to them from the foot of the frame (their vanishing point RK_FIELD.vp).
   The shoots in the rows are drawn live by rk_shoots, at any height, so the field can be sown and grow. */
const RK_FIELD={vp:[960,560],horizon:560,rows:15};
AG_PLACES.rkFields=c=>{const hz=RK_FIELD.horizon;let g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,"#070c1c");g.addColorStop(0.55,"#1a2140");g.addColorStop(0.85,"#4a4458");g.addColorStop(1,"#8a7568");c.fillStyle=g;c.fillRect(0,0,W,hz+2);
  // the first light, low and soft on the horizon
  g=c.createRadialGradient(1240,hz,0,1240,hz,820);g.addColorStop(0,"rgba(255,214,170,0.35)");g.addColorStop(1,"rgba(255,214,170,0)");c.fillStyle=g;c.fillRect(0,0,W,hz+2);
  // low hills
  for(const [base,amp,col,seed] of [[hz-34,26,"#2a2b42",3],[hz-12,18,"#1d2034",7]]){c.beginPath();c.moveTo(0,hz+2);for(let x=0;x<=W;x+=24){c.lineTo(x,base-amp*(0.5+0.5*Math.sin(x/260+seed))-8*Math.sin(x/90+seed*2));}c.lineTo(W,hz+2);c.closePath();c.fillStyle=col;c.fill();}
  // the earth, darker towards us
  g=c.createLinearGradient(0,hz,0,H);g.addColorStop(0,"#2c2630");g.addColorStop(0.4,"#1d1820");g.addColorStop(1,"#0f0c12");c.fillStyle=g;c.fillRect(0,hz,W,H-hz);
  // the rows: low ridges of tilled earth running to the vanishing point, each lit a little on its far side, the furrows between darker
  const [vx,vy]=RK_FIELD.vp,n=RK_FIELD.rows;for(let i=0;i<n;i++){const x0=-900+i*(3720/n),x1=-900+(i+1)*(3720/n),xm=(x0+x1)/2,top=[vx,vy+2];
    c.beginPath();c.moveTo(top[0]+(x0-vx)*0.004,top[1]);c.lineTo(x0,H);c.lineTo(xm,H);c.lineTo(top[0]+(xm-vx)*0.004,top[1]);c.closePath();
    g=c.createLinearGradient(0,vy,0,H);g.addColorStop(0,"rgba(60,48,58,0.0)");g.addColorStop(1,"rgba(70,56,62,0.55)");c.fillStyle=g;c.fill();
    c.beginPath();c.moveTo(top[0]+(xm-vx)*0.004,top[1]);c.lineTo(xm,H);c.lineTo(x1,H);c.lineTo(top[0]+(x1-vx)*0.004,top[1]);c.closePath();
    g=c.createLinearGradient(0,vy,0,H);g.addColorStop(0,"rgba(10,8,12,0.0)");g.addColorStop(1,"rgba(10,8,12,0.5)");c.fillStyle=g;c.fill();}
  const rnd=ag_rnd(77);for(let i=0;i<2600;i++){const y=RK_FIELD.horizon+Math.pow(rnd(),1.4)*(H-RK_FIELD.horizon),x=rnd()*W,z=0.6+((y-RK_FIELD.horizon)/(H-RK_FIELD.horizon))*2.4;c.fillStyle="rgba(150,126,120,"+(0.05+rnd()*0.08).toFixed(3)+")";c.fillRect(x,y,z,z*0.7);}
  g=c.createLinearGradient(0,hz,0,hz+120);g.addColorStop(0,"rgba(120,100,110,0.5)");g.addColorStop(1,"rgba(120,100,110,0)");c.fillStyle=g;c.fillRect(0,hz,W,120);
  const v=c.createRadialGradient(W/2,H/2,H*0.4,W/2,H/2,W*0.75);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(0,0,0,0.5)");c.fillStyle=v;c.fillRect(0,0,W,H);};
// where row i (0 to RK_FIELD.rows) is at depth u (0 at the horizon, 1 at the foot of the frame)
function rk_rowAt(i,u){const [vx,vy]=RK_FIELD.vp,xb=-900+i*(3720/RK_FIELD.rows),k=Math.pow(u,1.6);return[vx+(xb-vx)*Math.max(0.004,k),vy+2+(H-vy-2)*k];}
// the shoots in the rows: g (0 to 1) how far they've grown; nearer shoots larger; ripe (0 to 1) turns them from green to the gold of grain
function rk_shoots(ctx,g,o){o=o||{};if(g<=0)return;const ripe=o.ripe||0,col=mix([120,184,118],[214,190,120],ripe),rnd=ag_rnd(1115);
  for(let i=0;i<=RK_FIELD.rows;i++)for(let j=0;j<26;j++){const u=0.06+0.94*Math.pow(j/25,1.05),[x,y]=rk_rowAt(i,u),s=(2+u*30)*g,sway=(rnd()-0.5)*0.5;if(x<-40||x>W+40)continue;
    ctx.strokeStyle=rgba(col,0.55+0.35*u);ctx.lineWidth=Math.max(1,u*3.4);ctx.lineCap="round";
    for(const dx of[-0.5,0,0.5]){ctx.beginPath();ctx.moveTo(x+dx*u*10,y);ctx.quadraticCurveTo(x+dx*u*12+sway*s*0.3,y-s*0.6,x+dx*u*20+sway*s*0.5,y-s);ctx.stroke();}}}
