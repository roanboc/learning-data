/* ===== A map people and agents can read: the film's own pictures (prefixed d11_) =====
   The Pacific, May 1976: a night sky that turns slowly, the sea's long swells, and Hōkūleʻa, a double-hulled voyaging canoe with
   two crab-claw sails, drawn as a dark shape against the stars with the starlight on its edges; its navigator, a figure at the stern;
   the star compass he holds in memory, as a ring on the sea around the canoe with a point wherever a star rises or sets; dawn, the
   atoll of Mataiva on the horizon, and Papeʻete's crowd on the shore; and a chart of the Pacific with a light for each person who
   holds the knowledge, passed on. Then, on the films' dark glass and on the wall: the map kept as text (files, each element once,
   with its ID, owner, evidence and status), the repository and its versions, a change proposed line by line, the checks on the map,
   the views generated from it one way (with dbt's YAML and Databricks' catalogue), the map's agent and its rights, the retail code
   changing, and a newcomer's first day.
   The Pacific is drawn in the series' own style, not in the style of Pacific art: the canoe and the people aboard are silhouettes,
   and the real people of the story (Mau Piailug, Nainoa Thompson) are never given a face. The star compass is a diagram, not a
   copy of anyone's teaching chart: its points are where fifteen bright stars rise and set at Satawal's latitude, unnamed. */

const MOT=LAY6[0][1],STR=LAY6[1][1],BUS=LAY6[2][1],INF=LAY6[3][1],APL=LAY6[4][1],TEC=LAY6[5][1];
// the two sides of the wall, as in Who does it: the network in blue, retail in rose; red, for what fails; green, for a check that passes
const D11_NET=[132,176,255],D11_RET=[255,150,186],D11_RED=[232,96,84],D11_OK=[132,226,160];
// a data rule, as this series draws one (ruleCard), and the warm light of a navigator's knowledge, passed on
const D11_RULE=[170,205,255],D11_KNOW=[255,232,196];
// someone standing at the right of the frame, drawn facing the other way: the "explain" gesture then points at what they explain
function d11_personR(ctx,id,x,y,s,o){ctx.save();ctx.translate(x,0);ctx.scale(-1,1);ctx.translate(-x,0);person(ctx,id,x,y,s,o);ctx.restore();}
// no-break spaces: words a label should keep on one line
const d11_nb=s=>s.replace(/ /g," ");

/* ---------- the newcomer ---------- */
// Zofia, a data engineer who joins next spring (cyan, the technical side, like Tomás), with a lanyard for her first day's badge
PEOPLE.zofia={name:"Zofia Nowak",role:"Data engineer",side:"Technical",does:"uses",edge:TECH,seed:21,
  skin:[230,192,160],hair:{style:"bob",c:[122,72,44],streak:[168,112,74]},lanyard:TECH,
  top:{kind:"sweater",c:[176,120,74]},bottom:{c:[48,56,74]},shoe:[44,38,40],build:{sh:66,hip:58,h:0.95}};

/* ---------- the Pacific at night: sky, sea and stars ---------- */
const D11_HOR=560;
// the stars: fixed, seeded; a few bright ones; a faint band of the Milky Way across the sky
const D11_STARS=(()=>{const S=[];for(let i=0;i<420;i++){const m=Math.pow(hash(i,401),3.2);S.push({x:hash(i,402)*2400-240,y:hash(i,403)*900-260,m,ph:hash(i,404)*TAU,f:0.6+hash(i,405)*1.8});}
  for(let i=0;i<520;i++){const u=hash(i,411),v=(hash(i,412)+hash(i,413)+hash(i,414))/3-0.5;S.push({x:-200+u*2300,y:420-u*720+v*260,m:Math.pow(hash(i,415),5)*0.35,ph:hash(i,416)*TAU,f:1+hash(i,417),mw:1});}return S;})();
// the night sky over the horizon at hy; dawn (0..1) warms it from the horizon up; the sky turns slowly (turn, in radians) about a
// point far below the frame, as it does through a night
function d11_sky(ctx,S,t,o){o=o||{};const hy=o.hy==null?D11_HOR:o.hy,dw=o.dawn||0,day=o.day||0,X0=-1600,X1=3500,Y0=-1400;
  const g=ctx.createLinearGradient(0,0,0,hy);g.addColorStop(0,rgba(mix(mix([4,8,22],[70,110,160],day),[30,40,86],dw*0.5),1));g.addColorStop(0.62,rgba(mix(mix([10,16,40],[130,160,190],day),[86,74,120],dw*0.7),1));g.addColorStop(1,rgba(mix(mix([22,30,62],[210,200,186],day),[255,170,118],dw),1));
  ctx.fillStyle=g;ctx.fillRect(X0,Y0,X1-X0,hy+2-Y0);
  const sa=(o.stars==null?1:o.stars)*(1-dw*0.85)*(1-sstep(0,0.35,day));
  if(sa>0.01){ctx.save();ctx.beginPath();ctx.rect(X0,Y0,X1-X0,hy-2-Y0);ctx.clip();
    // the Milky Way: a soft glow along the band
    withA(ctx,sa*0.5,()=>{for(let k=0;k<15;k++){const u=k/14,x=-200+u*2300+(hash(k,418)-0.5)*120,y=420-u*720+(hash(k,419)-0.5)*90;glow(ctx,x,y,200+120*hash(k,420),[160,170,220],0.07+0.05*hash(k,421));}});
    const tr=o.turn||0,px=960,py=2600,c=Math.cos(tr),s=Math.sin(tr);
    D11_STARS.forEach((st,i)=>{const dx=st.x-px,dy=st.y-py,x=px+dx*c-dy*s,y=py+dx*s+dy*c;if(y>hy)return;
      const tw_=0.72+0.28*Math.sin(t*st.f+st.ph),fade=clamp((hy-y)/60,0,1),a=sa*(0.25+0.75*st.m)*tw_*fade;if(a<0.02)return;
      const r=st.mw?0.9:0.8+st.m*2.2;ctx.fillStyle=rgba([220,232,255],a);ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
      if(st.m>0.55&&!st.mw)glow(ctx,x,y,8+st.m*12,[200,220,255],a*0.5);});
    ctx.restore();}
  // the horizon: a thin line of light
  ctx.save();const hl=ctx.createLinearGradient(0,hy-14,0,hy+6);hl.addColorStop(0,rgba(mix([60,80,140],[255,190,140],dw),0));hl.addColorStop(0.7,rgba(mix([90,120,190],[255,200,150],dw),0.22+0.3*dw));hl.addColorStop(1,rgba([0,0,0],0));ctx.fillStyle=hl;ctx.fillRect(X0,hy-14,X1-X0,20);ctx.restore();}
// the sea below the horizon: dark, with rows of long swells that move as the night goes on; dawn and day light it from the sky.
// Like the sky, it's drawn in the camera's world, wider and deeper than the frame.
function d11_sea(ctx,t,o){o=o||{};const hy=o.hy==null?D11_HOR:o.hy,dw=o.dawn||0,day=o.day||0,X0=-1600,X1=3500,Y1=2400,g=ctx.createLinearGradient(0,hy,0,H+200);
  g.addColorStop(0,rgba(mix(mix([14,22,46],[96,120,146],day),[120,90,96],dw),1));g.addColorStop(0.25,rgba(mix([7,13,30],[46,74,104],day),1));g.addColorStop(1,rgba(mix([2,5,13],[18,40,66],day),1));ctx.fillStyle=g;ctx.fillRect(X0,hy,X1-X0,Y1-hy);
  // the sky's light, laid on the water near the horizon
  const rl=ctx.createLinearGradient(0,hy,0,hy+140);rl.addColorStop(0,rgba(mix([80,100,160],[255,180,130],dw),0.10+0.18*dw));rl.addColorStop(1,rgba([0,0,0],0));ctx.fillStyle=rl;ctx.fillRect(X0,hy,X1-X0,140);
  const N=18,sp=o.speed==null?1:o.speed;ctx.save();ctx.lineCap="round";
  for(let i=1;i<=N;i++){const u=i/N,y=hy+(H+160-hy)*Math.pow(u,1.75),amp=1+u*u*10,k=0.0045/(0.35+u),ph=hash(i,431)*TAU+t*0.55*sp*(0.6+u),al=(0.035+0.2*u*u)*(1+dw*0.6)*(1+(o.hi||0)*1.6);
    ctx.strokeStyle=rgba(mix(mix([110,150,210],[255,220,190],Math.max(dw*0.6,day*0.5)),[190,220,255],(o.hi||0)*0.5),al);ctx.lineWidth=(0.8+u*1.8)*(1+(o.hi||0)*0.4);ctx.beginPath();
    for(let x=-700;x<=2620;x+=24){const yy=y+Math.sin(x*k+ph)*amp+Math.sin(x*k*2.3+ph*1.3)*amp*0.35;x===-700?ctx.moveTo(x,yy):ctx.lineTo(x,yy);}ctx.stroke();}
  ctx.restore();}
// a swell's height under a point of the sea, for the canoe to ride on
const d11_swell=(x,t)=>Math.sin(x*0.004+t*0.9)*5+Math.sin(x*0.009+t*1.4+1)*2;

/* ---------- Hōkūleʻa ---------- */
// One hull of a double-hulled voyaging canoe, side on, bow to the right, waterline at y = 0: slender, its ends sweeping up to a point.
function d11_hullPath(ctx){ctx.beginPath();ctx.moveTo(-352,-92);ctx.quadraticCurveTo(-336,-44,-298,-36);ctx.lineTo(298,-36);ctx.quadraticCurveTo(336,-44,352,-92);
  ctx.quadraticCurveTo(360,-42,322,0);ctx.lineTo(-322,0);ctx.quadraticCurveTo(-360,-42,-352,-92);ctx.closePath();}
// a crab-claw sail: two spars from one foot (the mast leaning forward, the boom leaning aft) and the cloth between them, its top
// edge curving in; lit faintly along its forward edge by the stars, or the dawn
function d11_sail(ctx,fx,fy,h,lean,lit,col){const mx=fx+h*0.1,my=fy-h,bx=fx-h*0.42,by=fy-h*0.8,cx=fx-h*0.1,cy=fy-h*0.5;
  ctx.beginPath();ctx.moveTo(fx,fy);ctx.quadraticCurveTo(fx+h*0.09,fy-h*0.5,mx,my);ctx.quadraticCurveTo(cx,cy,bx,by);ctx.quadraticCurveTo(fx-h*0.24,fy-h*0.36,fx,fy);ctx.closePath();
  const g=ctx.createLinearGradient(bx,by,mx,fy-h*0.3);g.addColorStop(0,rgba(mix([12,14,22],col,0.03),1));g.addColorStop(1,rgba(mix([22,26,38],col,0.08+0.14*lit),1));ctx.fillStyle=g;ctx.fill();
  // the cloth's panels, sewn from the foot
  ctx.save();ctx.clip();ctx.strokeStyle=rgba(mix([40,46,64],col,0.15),0.4);ctx.lineWidth=1.3;for(let k=1;k<6;k++){const u=k/6;ctx.beginPath();ctx.moveTo(fx,fy);ctx.lineTo(lerp(mx,bx,u),lerp(my,by,u)+Math.sin(u*Math.PI)*h*0.3);ctx.stroke();}ctx.restore();
  ctx.lineCap="round";ctx.strokeStyle="rgba(10,12,18,1)";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(fx,fy);ctx.quadraticCurveTo(fx+h*0.09,fy-h*0.5,mx,my);ctx.stroke();ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(fx,fy);ctx.quadraticCurveTo(fx-h*0.24,fy-h*0.36,bx,by);ctx.stroke();
  // the light on the forward edge and along the top of the cloth
  ctx.strokeStyle=rgba(col,0.16+0.42*lit);ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(fx+2,fy-6);ctx.quadraticCurveTo(fx+h*0.09+2,fy-h*0.5,mx+2,my);ctx.stroke();
  ctx.strokeStyle=rgba(col,0.08+0.25*lit);ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(mx,my+3);ctx.quadraticCurveTo(cx,cy+3,bx,by+3);ctx.stroke();}
// someone aboard, as a small dark figure: sitting (sit 1) or standing, facing the bow; lit (0..1) catches the light on the edges
function d11_crew(ctx,x,y,s,sit,lit,col){ctx.save();ctx.translate(x,y);ctx.scale(s,s);const h=sit?46:84,hr=8.4;ctx.fillStyle="rgba(8,10,16,1)";
  ctx.beginPath();ctx.moveTo(-8,0);ctx.quadraticCurveTo(-10,-h*0.45,-12,-h*0.84);ctx.quadraticCurveTo(-12,-h,-4,-h);ctx.lineTo(6,-h);ctx.quadraticCurveTo(14,-h,14,-h*0.84);ctx.quadraticCurveTo(12,-h*0.45,10,0);ctx.closePath();ctx.fill();
  ctx.fillRect(-2,-h-4,6,6);
  if(sit){ctx.beginPath();ctx.moveTo(4,-8);ctx.quadraticCurveTo(24,-12,28,0);ctx.lineTo(8,0);ctx.closePath();ctx.fill();}
  ctx.beginPath();ctx.arc(1,-h-hr-2,hr,0,TAU);ctx.fill();
  if(lit>0.01){ctx.strokeStyle=rgba(col,0.65*lit);ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(1,-h-hr-2,hr,-Math.PI*0.95,-Math.PI*0.05);ctx.stroke();ctx.beginPath();ctx.moveTo(-4,-h);ctx.quadraticCurveTo(-12,-h,-12,-h*0.84);ctx.quadraticCurveTo(-10,-h*0.45,-8,0);ctx.stroke();}
  ctx.restore();}
// The canoe at (x, y) on the water, scale s, riding the swells at time t. o.lit: the light on its edges (starlight, or warmer at
// dawn: o.col); o.nav (0..1) picks out the navigator at the stern, and o.app (0..1) the one learning beside them; o.crew: how many
// sail with them; o.refl: its reflection on the water.
function d11_canoe(ctx,x,y,s,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=o.col||[170,200,240],lit=o.lit==null?0.5:o.lit,nav=o.nav||0;
  const bob=d11_swell(x,t)*0.8,roll=Math.sin(t*0.7+x*0.002)*0.012;
  withA(ctx,a,()=>{ctx.save();ctx.translate(x,y+bob);ctx.scale(s,s);
    // its reflection: the sails, faint and broken by the swells
    if(o.refl!==0)withA(ctx,0.07,()=>{ctx.save();ctx.scale(1,-0.55);ctx.translate(0,10);[[-90,330],[120,380]].forEach(([fx,h])=>{d11_sail(ctx,fx,-48,h,0,0,col);});ctx.restore();});
    ctx.rotate(roll);
    // the far hull, a little higher and darker, then the platform between the hulls, the masts and sails, the crew, the near hull
    ctx.save();ctx.translate(22,-16);d11_hullPath(ctx);ctx.fillStyle="rgba(6,8,13,1)";ctx.fill();ctx.restore();
    ctx.fillStyle="rgba(9,11,17,1)";ctx.fillRect(-262,-56,504,16);for(let k=0;k<9;k++){ctx.fillRect(-240+k*58,-62,10,12);}
    ctx.strokeStyle="rgba(10,12,18,1)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-250,-80);ctx.lineTo(236,-80);ctx.stroke();for(let k=0;k<7;k++){ctx.beginPath();ctx.moveTo(-232+k*76,-56);ctx.lineTo(-232+k*76,-80);ctx.stroke();}
    d11_sail(ctx,-90,-56,330,0,lit,col);d11_sail(ctx,120,-56,380,0,lit,col);
    // the steering paddle at the stern
    ctx.strokeStyle="rgba(8,10,16,1)";ctx.lineWidth=7;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-250,-104);ctx.lineTo(-352,22);ctx.stroke();
    const cr=o.crew==null?3:o.crew,pos=[[-196,-60,1],[-6,-60,0],[54,-60,1],[196,-60,0],[-130,-60,1],[260,-60,1]];
    for(let k=0;k<cr&&k<pos.length;k++){const[px,py,sit]=pos[k],ap=k===0?(o.app||0):0;if(ap>0.01)glow(ctx,px+2,py-54,84,D11_KNOW,0.5*ap);d11_crew(ctx,px,py,1.2,sit,Math.max(lit*0.6,ap),mix(col,[255,236,200],ap*0.5));}
    // the navigator, at the stern, sitting where he can see the whole horizon
    if(nav>0.01)glow(ctx,-282,-118,92,D11_KNOW,0.55*nav);d11_crew(ctx,-282,-66,1.25,1,Math.max(lit*0.6,nav),mix(col,[255,236,200],nav*0.5));
    d11_hullPath(ctx);const hg=ctx.createLinearGradient(0,-92,0,0);hg.addColorStop(0,"rgba(14,16,24,1)");hg.addColorStop(1,"rgba(4,6,10,1)");ctx.fillStyle=hg;ctx.fill();
    ctx.strokeStyle=rgba(col,0.22+0.45*lit);ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(-352,-92);ctx.quadraticCurveTo(-336,-44,-298,-36);ctx.lineTo(298,-36);ctx.quadraticCurveTo(336,-44,352,-92);ctx.stroke();
    ctx.restore();
    // the water at the hulls: a little foam where they meet the sea
    ctx.save();ctx.strokeStyle=rgba(mix([150,180,230],col,0.4),0.22+0.2*lit);ctx.lineWidth=2;for(let k=0;k<5;k++){const xx=x+(-300+k*150+Math.sin(t*1.3+k)*14)*s;ctx.beginPath();ctx.moveTo(xx-36*s,y+bob+2);ctx.quadraticCurveTo(xx,y+bob-3,xx+36*s,y+bob+2);ctx.stroke();}ctx.restore();});}
// a seabird (a tern), flapping: wings as two curves from the body, at (x, y), size s, heading right (dir 1) or left (dir -1)
function d11_bird(ctx,x,y,s,t,dir,a){if(a<=0.01)return;const f=Math.sin(t*9+x*0.01),lift=f*0.6;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s*(dir||1),s);ctx.strokeStyle="rgba(200,214,236,0.85)";ctx.lineWidth=2.4;ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(-22,-6-lift*10);ctx.quadraticCurveTo(-10,-10-lift*12,0,0);ctx.quadraticCurveTo(10,-10-lift*12,22,-6-lift*10);ctx.stroke();ctx.fillStyle="rgba(200,214,236,0.9)";ctx.beginPath();ctx.ellipse(1,1,4,2,0,0,TAU);ctx.fill();ctx.restore();});}

/* ---------- the star compass ---------- */
// The Carolinian star compass is a ring of points on the horizon, named for where stars rise and set: uneven, because the stars
// are. Here, the points are where fifteen bright stars rise (and, opposite, set) at Satawal's latitude, about 7° north, with the
// pole star in the north and the Southern Cross upright in the south: 32 in all. Their declinations, in degrees (unnamed on screen):
// Kochab, Dubhe, Schedar, Capella, Vega, Arcturus, the Pleiades, Aldebaran, Altair, Orion's belt, Gienah in Corvus, Antares, Shaula,
// Gacrux and Acrux. The Hawaiian star compass that Nainoa Thompson made from it has 32 equal houses instead (o.equal).
const D11_DEC=[74.2,61.8,56.5,46.0,38.8,19.2,24.1,16.5,8.9,-0.3,-17.5,-26.4,-37.1,-57.1,-63.1];
const D11_AZ=(()=>{const cl=Math.cos(7.4*Math.PI/180),A=[0,180];D11_DEC.forEach(d=>{const r=Math.acos(clamp(Math.sin(d*Math.PI/180)/cl,-1,1))*180/Math.PI;A.push(r,360-r);});return A.sort((p,q)=>p-q);})();
const D11_AZEQ=Array.from({length:32},(_,i)=>i*11.25);
// The ring lies on the sea around the canoe at (cx, cy): seen from the side, an ellipse rx by ry. The camera looks east, so north is
// to the left, east (where stars rise) is the far side, south is to the right, and west (where they set) is the near side.
// Draw the far half (o.half "back") before the canoe and the near half ("front") after it. o.p draws the ring round from the
// north; o.pts shows its points; o.rise lifts a star above each far point, as if rising.
function d11_ringXY(cx,cy,rx,ry,az){const r=az*Math.PI/180;return[cx-rx*Math.cos(r),cy-ry*Math.sin(r)];}
function d11_compass(ctx,cx,cy,rx,ry,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=o.col||D11_KNOW,p=o.p==null?1:o.p,back=o.half==="back",AZ=o.equal?D11_AZEQ:D11_AZ;
  withA(ctx,a,()=>{ctx.save();ctx.lineCap="round";
    // the ring itself, drawn round from the north (az 0) as p goes from 0 to 1, on its half
    const n=120,a1=360*p;ctx.strokeStyle=rgba(col,0.55);ctx.lineWidth=2.2;ctx.shadowColor=rgba(col,0.6);ctx.shadowBlur=10;ctx.beginPath();let on=false;
    for(let k=0;k<=n;k++){const az=a1*k/n,isBack=az%360<180;if(isBack!==back){on=false;continue;}const[x,y]=d11_ringXY(cx,cy,rx,ry,az);on?ctx.lineTo(x,y):ctx.moveTo(x,y);on=true;}ctx.stroke();ctx.shadowBlur=0;
    const pa=o.pts==null?1:o.pts,ri=o.rise||0;
    if(pa>0.01)AZ.forEach((az,i)=>{if(az>a1+0.01)return;const far=az>0&&az<180,side=az===0||az===180;if(back?!(far||side):!(az>180))return;
      const[x,y]=d11_ringXY(cx,cy,rx,ry,az),depth=(y-(cy-ry))/(2*ry),r=2.6+depth*2.4,q=clamp(pa*AZ.length*0.5-i*0.5,0,1);if(q<=0)return;
      withA(ctx,q,()=>{glow(ctx,x,y,14+depth*10,col,0.5);ctx.fillStyle=rgba(mix(col,[255,255,255],0.4),1);ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
        ctx.strokeStyle=rgba(col,0.6);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x,y-6-depth*4);ctx.lineTo(x,y-16-depth*10);ctx.stroke();});
      // a star rising above its point, on the far side, where the stars rise
      if(far&&ri>0.01){const cyc=(t*3+hash(i,452)*40)%40,sx=x+cyc*0.08,sy=y-26-cyc*1.6;withA(ctx,ri*q*(1-cyc/40),()=>{glow(ctx,sx,sy,12,[220,232,255],0.6);ctx.fillStyle="rgba(235,242,255,0.95)";ctx.beginPath();ctx.arc(sx,sy,2.2,0,TAU);ctx.fill();});}});
    ctx.restore();});}

/* ---------- landfall ---------- */
// Mataiva, an atoll: a low line of land and trees on the horizon at (x, hy), w wide
function d11_atoll(ctx,x,hy,w,a,dw){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.fillStyle=rgba(mix([10,14,24],[60,40,50],dw||0),1);ctx.beginPath();ctx.moveTo(x,hy+1);
  for(let k=0;k<=24;k++){const u=k/24,xx=x+u*w,h=(3+Math.sin(u*Math.PI)*7)*(0.7+0.6*hash(k,461));ctx.lineTo(xx,hy-h);}ctx.lineTo(x+w,hy+1);ctx.closePath();ctx.fill();ctx.restore();});}
// Tahiti from the sea at Papeʻete: steep peaks behind a low shore, tapering into the sea on the left, and the waterfront lined with
// people, thousands of them, in rows, some waving; o.p fills the waterfront from the harbour outwards
function d11_harbour(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const hy=o.hy==null?D11_HOR:o.hy;withA(ctx,a,()=>{ctx.save();
  const pk=[[620,hy+4],[760,hy-40],[900,hy-150],[1010,hy-120],[1120,hy-300],[1210,hy-250],[1290,hy-390],[1380,hy-310],[1470,hy-350],[1580,hy-210],[1700,hy-230],[1820,hy-120],[2000,hy-90],[2300,hy-60]];
  ctx.beginPath();ctx.moveTo(560,hy+40);pk.forEach(([x,y],i)=>{const px=i?pk[i-1][0]:560;ctx.quadraticCurveTo((px+x)/2,y+30*hash(i,471),x,y);});ctx.lineTo(2300,hy+40);ctx.closePath();
  const pg=ctx.createLinearGradient(0,hy-390,0,hy+40);pg.addColorStop(0,"rgba(62,86,92,1)");pg.addColorStop(1,"rgba(24,38,44,1)");ctx.fillStyle=pg;ctx.fill();
  // the waterfront, nearer than the peaks
  const qy=hy+56;ctx.fillStyle="rgba(28,34,40,1)";ctx.fillRect(700,qy-6,1700,40);ctx.fillStyle="rgba(60,66,70,1)";ctx.fillRect(700,qy-8,1700,4);
  const p=o.p==null?1:o.p,n=1500;for(let i=0;i<n;i++){const u=hash(i,481),row=Math.floor(hash(i,482)*5),sc=0.7+row*0.16,x=760+u*1600,y=qy-4-(4-row)*6.5+hash(i,483)*3;if(u>p*1.02)continue;
    const sw=Math.sin(t*2+i)*0.8,c=mix([34,30,36],[[214,120,96],[226,190,120],[120,160,200],[236,226,210]][i%4],0.35+0.25*hash(i,484));ctx.fillStyle=rgba(c,1);
    ctx.beginPath();ctx.arc(x+sw,y-13*sc,3.6*sc,0,TAU);ctx.fill();rr(ctx,x-4.6*sc+sw,y-9*sc,9.2*sc,11*sc,3*sc);ctx.fill();
    if(hash(i,485)<0.07){ctx.strokeStyle=rgba(c,1);ctx.lineWidth=2.2*sc;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x+3*sc,y-8*sc);ctx.lineTo(x+(7+Math.sin(t*6+i)*3)*sc,y-22*sc);ctx.stroke();}}
  ctx.restore();});}

/* ---------- the chart: the Pacific, with the people who hold the knowledge ---------- */
// An equirectangular sketch from about 138° E to 148° W and 23° N to 19° S, 18 px to a degree: only the islands the story
// passes, as small dots, and no coastlines. D11_PAC[name] = [longitude east, latitude]
const D11_PAC={"Satawal":[147.03,7.35],"Puluwat":[149.18,7.36],"Pulap":[149.43,7.62],"Lamotrek":[146.37,7.48],"Woleai":[143.9,7.37],"Pulusuk":[149.32,6.69],
  "Kauaʻi":[200.5,22.05],"Oʻahu":[202.0,21.47],"Molokaʻi":[203.0,21.13],"Maui":[203.74,20.8],"Hawaiʻi":[204.5,19.6],
  "Tahiti":[210.57,-17.65],"Moʻorea":[210.17,-17.53],"Mataiva":[211.3,-14.88],"Rangiroa":[212.4,-15.12],"Nuku Hiva":[219.9,-8.86],"Rarotonga":[200.23,-21.23],
  "Upolu":[188.3,-13.9],"Tongatapu":[184.8,-21.17],"Viti Levu":[178.0,-17.8],"Majuro":[171.2,7.1],"Pohnpei":[158.2,6.88],"Chuuk":[151.8,7.4],"Guam":[144.8,13.44],"Yap":[138.1,9.5]};
// the other islands on the chart, unnamed, as smaller dots: [longitude east, latitude]
const D11_ISL=[[144.45,7.25],[143.05,6.68],[146.17,7.5],[144.5,8.6],[147.65,8.1],[146.7,8.08],[146.0,9.2],[149.4,8.7],[139.7,10.0],[140.5,9.77],[140.4,8.13],
  [152.6,5.5],[155.0,3.85],[154.8,1.07],[163.0,5.3],[167.7,9.2],[169.6,5.9],[173.0,1.4],[179.2,-8.5],[166.9,-0.5],[187.6,-13.6],[190.1,-19.05],[200.2,-18.85],
  [208.6,-16.8],[208.25,-16.5],[208.95,-16.75],[214.4,-16.3],[216.4,-16.6],[214.5,-17.35],[219.1,-18.1],[221.0,-9.8],[202.6,1.9],[200.6,3.86],[199.85,21.9],
  [203.07,20.83],[203.4,20.55],[184.2,-15.9],[181.4,-16.6],[176.2,-13.3],[145.7,15.2],[145.75,14.15],[188.3,-14.3],[195.0,-21.2],[192.2,-11.05],[210.0,-23.4]];
function d11_pac(name){const[lo,la]=D11_PAC[name];return[200+(lo-138)*18,80+(23-la)*18];}
// the chart's ground: a dark sea (in screen space); then, in the camera's world, a faint graticule, the equator dashed, and the
// islands; o.labM, o.labH and o.labT (0..1) name Micronesia, Hawaiʻi and Tahiti, at the same size on screen whatever the zoom (o.z)
function d11_chartBg(ctx,S){setScreen(ctx,S);const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"#050a18");g.addColorStop(1,"#02050c");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
function d11_chart(ctx,t,o){o=o||{};const z=o.z||1;ctx.save();ctx.strokeStyle="rgba(120,160,230,0.07)";ctx.lineWidth=1/z;for(let lo=110;lo<=250;lo+=10){const x=200+(lo-138)*18;ctx.beginPath();ctx.moveTo(x,-800);ctx.lineTo(x,1900);ctx.stroke();}
  for(let la=50;la>=-60;la-=10){const y=80+(23-la)*18;ctx.beginPath();ctx.moveTo(-800,y);ctx.lineTo(2800,y);ctx.stroke();}
  const ey=80+23*18;ctx.setLineDash([6/z,10/z]);ctx.strokeStyle="rgba(150,180,230,0.18)";ctx.beginPath();ctx.moveTo(-800,ey);ctx.lineTo(2800,ey);ctx.stroke();ctx.setLineDash([]);
  D11_ISL.forEach(([lo,la])=>{ctx.fillStyle="rgba(170,190,225,0.34)";ctx.beginPath();ctx.arc(200+(lo-138)*18,80+(23-la)*18,2.2/Math.sqrt(z),0,TAU);ctx.fill();});
  Object.keys(D11_PAC).forEach(k=>{const[x,y]=d11_pac(k);ctx.fillStyle="rgba(190,210,240,0.55)";ctx.beginPath();ctx.arc(x,y,(k==="Hawaiʻi"?4.5:2.8)/Math.sqrt(z),0,TAU);ctx.fill();});
  const[sx,sy]=d11_pac("Satawal"),[mx,my]=d11_pac("Maui"),[tx,ty]=d11_pac("Tahiti"),L={size:30/z,w:700,color:"rgba(200,214,236,0.85)"};
  d11_name(ctx,"Micronesia",sx-6,sy+96/z,"center",o.labM||0,L);d11_name(ctx,"Hawaiʻi",mx+56/z,my+18/z,"left",o.labH||0,L);d11_name(ctx,"Tahiti",tx+34/z,ty+12/z,"left",o.labT||0,L);
  ctx.restore();}
// a person who holds the knowledge, as a warm light at (x, y); o.k (0..1) kindles it; o.dim (0..1) lets it fade to a ring that stays
function d11_light(ctx,x,y,r,t,o){o=o||{};const k=o.k==null?1:o.k;if(k<=0.01)return;const col=o.col||D11_KNOW,dim=o.dim||0,br=0.85+0.15*Math.sin(t*1.3+x*0.01);
  const v=k*(1-0.8*dim);glow(ctx,x,y,r*4.2*(0.6+0.4*k),col,0.5*v*br);ctx.fillStyle=rgba(mix(col,[255,255,255],0.5),0.95*v);ctx.beginPath();ctx.arc(x,y,r*(0.6+0.4*k),0,TAU);ctx.fill();
  if(dim>0.01)ring(ctx,x,y,r*2.2,col,0.55*dim*k,1.6);}
// knowledge passed on, along an arc from (x0, y0) to (x1, y1): p carries a small light along it, and leaves a faint trail
function d11_pass(ctx,x0,y0,x1,y1,p,col,o){o=o||{};if(p<=0)return;const bend=o.bend==null?0.25:o.bend,mx=(x0+x1)/2-(y1-y0)*bend,my=(y0+y1)/2+(x1-x0)*bend,q=ease(clamp(p,0,1)),at_=u=>[(1-u)*(1-u)*x0+2*(1-u)*u*mx+u*u*x1,(1-u)*(1-u)*y0+2*(1-u)*u*my+u*u*y1];
  ctx.save();ctx.strokeStyle=rgba(col||D11_KNOW,(o.trail==null?0.35:o.trail));ctx.lineWidth=o.lw||1.8;ctx.setLineDash([4,7]);ctx.beginPath();for(let k=0;k<=40;k++){const[x,y]=at_(q*k/40);k?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();ctx.restore();
  if(p<1){const[x,y]=at_(q);glow(ctx,x,y,20,col||D11_KNOW,0.8);ctx.fillStyle="rgba(255,250,236,1)";ctx.beginPath();ctx.arc(x,y,3.5,0,TAU);ctx.fill();}}
// a name on the chart or the sea, with a dark halo so it reads over anything
function d11_name(ctx,s,x,y,al,a,o){if(a<=0.01)return;o=o||{};withA(ctx,a,()=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.95)";ctx.shadowBlur=10;T(ctx,s,x,y,{w:o.w||800,size:o.size||30,align:al,color:o.color||"rgba(255,244,226,0.98)"});ctx.restore();});}

/* ---------- the map, as the wall knows it ---------- */
// The map as a small picture: six rows in the layers' colours, each with a few elements and the lines between them. It's texture
// (no words), so it can be drawn small. o.stale (0..1) greys it and lets it fade; o.fill (0..1) fills it in, row by row from the
// top; o.missing and o.wrong pick one element of a copy (by number) that's gone, or wrong; o.hi[i] lights a row.
const D11_MAP=(()=>{const R=[];LAY6.forEach(([,],i)=>{const n=[3,4,5,4,5,3][i],row=[];for(let k=0;k<n;k++)row.push({u:(k+0.5)/n+(hash(i*7+k,501)-0.5)*0.06,w:0.13+0.05*hash(i*7+k,502)});R.push(row);});
  const L=[];for(let i=0;i<5;i++)R[i].forEach((e,k)=>{const j=Math.floor(hash(i*11+k,503)*R[i+1].length);L.push([i,k,i+1,j]);});return{R,L};})();
function d11_mini(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const st=o.stale||0,fl=o.fill==null?1:o.fill,rh=h/6,grey=[150,150,156],cnt=D11_MAP.R.reduce((s,r)=>s+r.length,0);
  withA(ctx,a*(1-0.35*st),()=>{ctx.save();ctx.lineWidth=1.4;
    D11_MAP.L.forEach(([i,k,i2,k2])=>{const q=clamp(fl*6.5-i2,0,1);if(q<=0)return;const e=D11_MAP.R[i][k],f=D11_MAP.R[i2][k2];ctx.strokeStyle=rgba(mix([170,190,230],grey,st),0.28*q);ctx.beginPath();ctx.moveTo(x+e.u*w,y+rh*(i+0.72));ctx.lineTo(x+f.u*w,y+rh*(i2+0.28));ctx.stroke();});
    let n=0;D11_MAP.R.forEach((row,i)=>{const col=mix(LAY6[i][1],grey,st),hi=o.hi?o.hi[i]||0:0,q=clamp(fl*6.5-i,0,1);
      if(hi>0.01){ctx.fillStyle=rgba(col,0.10*hi);rr(ctx,x-6,y+rh*i+2,w+12,rh-4,6);ctx.fill();}
      row.forEach((e,k)=>{const idx=n++;if(q<=0)return;const bw=e.w*w,bh=rh*0.5,bx=x+e.u*w-bw/2,by=y+rh*i+rh*0.25;
        if(o.missing===idx){ctx.save();ctx.setLineDash([5,5]);ctx.strokeStyle=rgba(col,0.6*q);rr(ctx,bx,by,bw,bh,4);ctx.stroke();ctx.restore();return;}
        const bad=o.wrong===idx;ctx.fillStyle=rgba(bad?D11_RED:col,(0.16+0.14*(1-st))*q);rr(ctx,bx,by,bw,bh,4);ctx.fill();ctx.strokeStyle=rgba(bad?D11_RED:col,(0.85-0.35*st)*q);ctx.lineWidth=bad?2.6:1.6;rr(ctx,bx,by,bw,bh,4);ctx.stroke();});});
    ctx.restore();});return cnt;}
// the map in its glass frame, with its name; o.dust (0..1) lays a grey film over it: nobody has touched it
function d11_mapCard(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const st=o.stale||0,col=mix(EAC,[150,150,156],st);
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,col,{glow:14+12*(o.glow||0),ea:0.85-0.4*st,fill:"rgba(7,12,24,0.95)"});
    if(o.title!==false)T(ctx,o.title||"the map",x+26,y+46,{f:"mono",w:500,size:28,color:rgba(col,1)});
    d11_mini(ctx,x+30,y+(o.title===false?24:70),w-60,h-(o.title===false?48:96),{stale:st,fill:o.fill,missing:o.missing,wrong:o.wrong,hi:o.hi});
    if(st>0.01){ctx.save();ctx.fillStyle=rgba([120,116,110],0.16*st);rr(ctx,x,y,w,h,18);ctx.fill();for(let i=0;i<60;i++){ctx.fillStyle=rgba([200,196,186],0.12*st*hash(i,511));ctx.beginPath();ctx.arc(x+hash(i,512)*w,y+hash(i,513)*h,0.8+1.6*hash(i,514),0,TAU);ctx.fill();}ctx.restore();}});}
// a slide, as decks copy the map: white, a heading bar, the map printed small (o.missing / o.wrong: how this copy has drifted)
function d11_slide(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot||0);ctx.translate(-w/2,-h/2);
  ctx.save();ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=16;ctx.shadowOffsetY=5;ctx.fillStyle="rgba(240,242,246,0.98)";ctx.fillRect(0,0,w,h);ctx.restore();ctx.fillStyle="rgba(60,170,150,0.9)";ctx.fillRect(0,0,w,Math.max(6,h*0.05));
  if(o.head)T(ctx,o.head,18,h*0.05+30,{w:800,size:o.headSize||28,color:"rgba(40,44,56,1)",deco:o.headDeco});
  ctx.fillStyle="rgba(16,22,36,0.94)";const py=o.head?h*0.05+46:h*0.1;rr(ctx,14,py,w-28,h-py-14,6);ctx.fill();d11_mini(ctx,30,py+10,w-60,h-py-36,{missing:o.missing,wrong:o.wrong,stale:o.stale});
  if(o.stamp)withA(ctx,o.stampA==null?1:o.stampA,()=>kt_rstamp(ctx,w-110,h-60,o.stamp,o.stampCol||[110,110,120],1,1,{size:28,rot:-0.1}));ctx.restore();});}

/* ---------- the map as text: files ---------- */
// each kind of element: its folder, its colour (the layers', and the data series' blue for a rule), and how it's drawn as a glyph
const D11_KIND={capability:["strategy",STR,"capability"],step:["business",BUS,"process"],domain:["domains",D11_NET,"domain"],object:["information",INF,"object"],
  rule:["motivation",D11_RULE,"requirement"],measure:["information",INF,"measure"],decision:["decisions",[236,170,206],"decision"],actor:["business",BUS,"actor"],obligation:["motivation",MOT,"requirement"],node:["technology",TEC,"node"],app:["application",APL,"component"]};
// glyphs this film adds: a requirement (a slanted box, as ArchiMate draws one), a domain (a region with its edge), a measure (a
// gauge) and a decision (a fork); the rest are the series'
function d11_glyph(ctx,kind,x,y,s,col){if(["capability","process","actor","object","goal","principle","node","component"].includes(kind)){archGlyph(ctx,kind,x,y,s,col);return;}
  ctx.save();ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);ctx.lineWidth=Math.max(1.4,s*0.1);ctx.lineJoin="round";ctx.lineCap="round";
  if(kind==="requirement"){ctx.beginPath();ctx.moveTo(x-s*0.55,y-s*0.5);ctx.lineTo(x+s*0.85,y-s*0.5);ctx.lineTo(x+s*0.55,y+s*0.5);ctx.lineTo(x-s*0.85,y+s*0.5);ctx.closePath();ctx.stroke();}
  else if(kind==="domain"){ctx.beginPath();ctx.moveTo(x-s*0.8,y-s*0.3);ctx.quadraticCurveTo(x-s*0.6,y-s*0.85,x,y-s*0.6);ctx.quadraticCurveTo(x+s*0.85,y-s*0.7,x+s*0.75,y);ctx.quadraticCurveTo(x+s*0.7,y+s*0.75,x,y+s*0.6);ctx.quadraticCurveTo(x-s*0.9,y+s*0.6,x-s*0.8,y-s*0.3);ctx.stroke();}
  else if(kind==="measure"){ctx.beginPath();ctx.arc(x,y+s*0.3,s*0.75,Math.PI,0);ctx.stroke();ctx.beginPath();ctx.moveTo(x,y+s*0.3);ctx.lineTo(x+s*0.45,y-s*0.2);ctx.stroke();}
  else if(kind==="decision"){ctx.beginPath();ctx.moveTo(x-s*0.8,y);ctx.lineTo(x-s*0.1,y);ctx.lineTo(x+s*0.7,y-s*0.55);ctx.moveTo(x-s*0.1,y);ctx.lineTo(x+s*0.7,y+s*0.55);ctx.stroke();ctx.beginPath();ctx.arc(x+s*0.7,y-s*0.55,s*0.16,0,TAU);ctx.fill();}
  ctx.restore();}
// a stable id, as a small chip in mono: o.col its colour, o.hi lights it
function d11_id(ctx,x,y,id,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return 0;const sz=o.size||28,col=o.col||EAC,w=tw(ctx,id,sz,500,"mono")+28,h=sz+18,X=o.align==="center"?x-w/2:o.align==="right"?x-w:x;
  withA(ctx,a,()=>{glass(ctx,X,y-h/2,w,h,8,col,{glow:8+14*(o.hi||0),ea:0.85,fill:"rgba(6,10,20,0.95)"});ctx.fillStyle=rgba(col,0.12+0.14*(o.hi||0));rr(ctx,X,y-h/2,w,h,8);ctx.fill();T(ctx,id,X+14,y+sz*0.36,{f:"mono",w:500,size:sz,color:rgba(mix(col,INK,0.25),1)});});return w;}
// An element's file, small: its kind, its id and its name. kind is a key of D11_KIND.
function d11_fileMini(ctx,x,y,w,kind,id,name,o){o=o||{};const a=o.a==null?1:o.a,h=o.h||170;if(a<=0.01)return h;const[,col,gk]=D11_KIND[kind];
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,14,col,{glow:10+14*(o.hi||0),ea:0.8,fill:"rgba(6,10,20,0.95)"});ctx.fillStyle=rgba(col,0.06+0.08*(o.hi||0));rr(ctx,x,y,w,h,14);ctx.fill();
    T(ctx,o.label||kind.replace("object","business object"),x+24,y+44,{f:"mono",w:500,size:28,color:rgba(col,1)});d11_glyph(ctx,gk,x+w-34,y+34,15,col);
    T(ctx,id,x+24,y+96,{f:"mono",w:500,size:30,color:rgba(INK,0.96)});T(ctx,name,x+24,y+142,{w:700,size:tw(ctx,name,30,700)>w-48?28:30,color:rgba(mix(col,INK,0.55),1)});});return h;}
// An element's file, open: its path, then "key: value" lines in mono. lines: [key, value, opts] (a null key: text that carries on, indented
// by opts.ind); opts.tick: an owner's gold tick
// after the value; opts.from: an old value the new one replaces as opts.u goes 0..1; opts.col: the key's colour. o.rows[i] shows
// each line (0..1), o.hi[i] lights it. Returns its height.
function d11_file(ctx,x,y,w,path,lines,o){o=o||{};const a=o.a==null?1:o.a,lh=o.lh||48,sz=o.size||28,col=o.col||EAC,h=o.h||(84+lines.length*lh);if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,14,col,{glow:12+14*(o.glow||0),ea:0.75,fill:"rgba(6,10,20,0.96)"});
    ctx.fillStyle=rgba(col,0.9);ctx.beginPath();ctx.moveTo(x+20,y+22);ctx.lineTo(x+32,y+22);ctx.lineTo(x+38,y+28);ctx.lineTo(x+38,y+42);ctx.lineTo(x+20,y+42);ctx.closePath();ctx.fill();
    T(ctx,path,x+52,y+42,{f:"mono",w:500,size:sz,color:rgba(col,1)});ctx.fillStyle="rgba(170,200,245,0.14)";ctx.fillRect(x+14,y+62,w-28,1.2);
    lines.forEach((ln,i)=>{const q=o.rows?(o.rows[i]==null?1:o.rows[i]):1;if(q<=0.01)return;const[k,v,op]=ln,O=op||{},yy=y+66+i*lh+lh*0.66,hi=o.hi?o.hi[i]||0:0,kc=O.col||mix(col,INK,0.2);
      withA(ctx,clamp(q*1.6,0,1),()=>{if(hi>0.01){ctx.fillStyle=rgba(O.hiCol||col,0.16*hi);rr(ctx,x+12,yy-lh*0.7,w-24,lh*0.92,6);ctx.fill();ctx.fillStyle=rgba(O.hiCol||col,0.9*hi);rr(ctx,x+12,yy-lh*0.7,5,lh*0.92,2);ctx.fill();}
        const kx=x+26+(O.ind||0)*34;if(k!=null)T(ctx,k+":",kx,yy,{f:"mono",w:500,size:sz,color:rgba(kc,0.95)});const vx=k==null?kx:kx+tw(ctx,k+": ",sz,500,"mono"),vs=typeOn(v,clamp(q*1.4-0.2,0,1));
        if(O.from!=null&&(O.u||0)<1){const u=ease(clamp(O.u||0,0,1));withA(ctx,1-u,()=>T(ctx,O.from,vx,yy-u*14,{f:"mono",w:500,size:sz,color:rgba(INK,0.9)}));withA(ctx,u,()=>T(ctx,v,vx,yy+(1-u)*14,{f:"mono",w:500,size:sz,color:rgba(INK,0.96)}));}
        else T(ctx,vs,vx,yy,{f:"mono",w:500,size:sz,color:rgba(O.vcol||INK,0.96)});
        if(O.tick&&O.tick>0.01)kt_gtick(ctx,vx+tw(ctx,v,sz,500,"mono")+30,yy-sz*0.34,15,O.tick);});});});return h;}

/* ---------- the repository: folders and versions ---------- */
const D11_TREE=[["motivation",MOT,24],["strategy",STR,31],["business",BUS,46],["information",INF,38],["application",APL,27],["technology",TEC,19],["decisions",[236,170,206],12]];
// the repository's folders, one per layer and one for decisions, with how many files each holds; o.p opens it from the top.
// o.scan (0..1) sweeps a check down the folders; o.warn[i] (0..1) marks a folder amber; o.plus[i] adds to a folder's count
function d11_tree(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,rh=o.rh||56,h=110+D11_TREE.length*rh;if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,EAC,{glow:12+14*(o.glow||0),ea:0.8,fill:"rgba(6,10,20,0.95)"});T(ctx,o.title||"the map · repository",x+26,y+48,{f:"mono",w:500,size:28,color:rgba(EAC,1)});
    const sc=o.scan,sy=sc>0&&sc<1?y+92+sc*D11_TREE.length*rh:null;
    if(sy!=null){const g=ctx.createLinearGradient(x,0,x+w,0);g.addColorStop(0,"rgba(170,205,255,0)");g.addColorStop(0.5,"rgba(170,205,255,0.75)");g.addColorStop(1,"rgba(170,205,255,0)");ctx.fillStyle=g;ctx.fillRect(x+12,sy-1.5,w-24,3);}
    D11_TREE.forEach(([nm,col,n],i)=>{const q=o.p==null?1:clamp(o.p*D11_TREE.length-i,0,1);if(q<=0)return;const yy=y+92+i*rh+rh*0.5,wa=o.warn?o.warn[i]||0:0,hi=Math.max(o.hi?o.hi[i]||0:0,sy!=null?clamp(1-Math.abs(sy-yy)/rh,0,1)*0.8:0);
      withA(ctx,q,()=>{if(hi>0.01){ctx.fillStyle=rgba(col,0.14*hi);rr(ctx,x+12,yy-rh*0.45,w-24,rh*0.9,8);ctx.fill();}
        if(wa>0.01){withA(ctx,wa,()=>{ctx.fillStyle=rgba(AMBER,0.13);rr(ctx,x+12,yy-rh*0.45,w-24,rh*0.9,8);ctx.fill();glass(ctx,x+w-124,yy-18,36,36,18,AMBER,{glow:10,ea:0.85,fill:"rgba(30,20,6,0.95)"});T(ctx,"!",x+w-106,yy+11,{w:800,size:28,align:"center",color:rgba(AMBER,1)});});}
        ctx.fillStyle=rgba(col,0.85);ctx.beginPath();ctx.moveTo(x+30,yy-12);ctx.lineTo(x+42,yy-12);ctx.lineTo(x+47,yy-7);ctx.lineTo(x+62,yy-7);ctx.lineTo(x+62,yy+12);ctx.lineTo(x+30,yy+12);ctx.closePath();ctx.fill();
        T(ctx,nm+"/",x+78,yy+10,{f:"mono",w:500,size:28,color:rgba(mix(col,INK,0.3),1)});if(o.counts!==false){const pl=o.plus?o.plus[i]||0:0;T(ctx,(n+Math.round(pl))+"",x+w-28,yy+10,{f:"mono",w:500,size:28,align:"right",color:rgba(mix(SOFT,KT_AI,clamp(pl,0,1)),0.85+0.15*clamp(pl,0,1))});}});});});return h;}
// the versions, as a line of dots, oldest on the left, each number above its dot; the first and the newest show their dates.
// o.n shows them one by one; o.la fades the numbers and dates; o.warn[i] (0..1) turns a dot into the check's amber mark
function d11_vline(ctx,x,y,w,vers,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const n=o.n==null?vers.length:o.n,dx=w/Math.max(1,vers.length-1),la=o.la==null?1:o.la;
  withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(EAC,0.35);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+dx*Math.max(0,Math.min(vers.length-1,n-1)),y);ctx.stroke();ctx.restore();
    vers.forEach(([v,d],i)=>{const q=clamp(n-i,0,1);if(q<=0)return;const xx=x+i*dx,top=clamp(1-Math.abs(n-1-i),0,1),wa=o.warn?o.warn[i]||0:0,col=mix(EAC,TRUST,top);withA(ctx,q,()=>{
      withA(ctx,1-wa,()=>{glow(ctx,xx,y,14+12*top,col,0.3+0.2*top);ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(xx,y,7+2*top,0,TAU);ctx.fill();});
      if(wa>0.01)withA(ctx,wa,()=>{glass(ctx,xx-18,y-18,36,36,18,AMBER,{glow:10,ea:0.85,fill:"rgba(30,20,6,0.95)"});T(ctx,"!",xx,y+11,{w:800,size:28,align:"center",color:rgba(AMBER,1)});});
      if(la>0.01)withA(ctx,la,()=>{T(ctx,v,xx,y-34,{f:"mono",w:500,size:28,align:"center",color:rgba(mix(mix(EAC,INK,0.3),TRUST,top),1)});
        const da=i===0?1:top;if(da>0.01)withA(ctx,da,()=>T(ctx,d,xx,y+52,{w:700,size:28,align:"center",color:rgba(SOFT,0.9)}));});});});});}
// the map's history, newest first: [version, date, what changed, who confirmed it]. o.rows[i] shows each row; o.nov hides the
// version numbers (while they fly to the line of versions)
function d11_history(ctx,x,y,w,rows,o){o=o||{};const a=o.a==null?1:o.a,lh=64,h=96+rows.length*lh;if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,EAC,{glow:12,ea:0.75,fill:"rgba(6,10,20,0.96)"});T(ctx,o.title||"the map · history",x+26,y+46,{f:"mono",w:500,size:28,color:rgba(EAC,1)});
    rows.forEach(([v,d,s,who],i)=>{const q=o.rows?o.rows[i]||0:1;if(q<=0.01)return;const yy=y+96+i*lh+lh*0.5;withA(ctx,q,()=>{
      if(i>0){ctx.fillStyle="rgba(170,200,245,0.10)";ctx.fillRect(x+20,yy-lh*0.5,w-40,1.2);}
      if(!o.nov)T(ctx,v,x+26,yy+10,{f:"mono",w:500,size:28,color:rgba(i===0?TRUST:mix(EAC,INK,0.3),1)});
      T(ctx,d,x+124,yy+10,{w:700,size:28,color:rgba(SOFT,0.95)});T(ctx,s,x+250,yy+10,{f:"mono",w:500,size:28,color:rgba(INK,0.95)});
      kt_gtick(ctx,x+w-170,yy,15,1);T(ctx,who,x+w-144,yy+10,{w:800,size:30,color:rgba(TRUST,1)});});});});return h;}

/* ---------- a change, proposed line by line ---------- */
// A pull request: what it changes, line by line (- removed, + added), the file it's in, and who must review it.
// o.diff: [sign, text]; o.rows (0..1) shows each diff line; o.rev: [[name, side, tick 0..1]]; o.state: a word for where it stands;
// o.fold (0..1) folds it to its title once merged
function d11_pr(ctx,x,y,w,title,file,o){o=o||{};const a=o.a==null?1:o.a,D=o.diff||[],R=o.rev||[],lh=50,fo=ease(clamp(o.fold||0,0,1)),h=lerp(196+D.length*lh+(R.length?36+R.length*58:0),124,fo);if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,EAC,{glow:12+14*(o.glow||0),ea:0.8,fill:"rgba(6,10,20,0.96)"});
    T(ctx,o.kicker||"pull request",x+26,y+46,{f:"mono",w:500,size:28,color:rgba(EAC,1)});if(o.state)tag(ctx,x+w-24-tw(ctx,o.state,28,700)-26,y+38,o.state,o.stateCol||EAC,{size:28});
    T(ctx,title,x+26,y+100,{w:800,size:38});ctx.save();ctx.beginPath();ctx.rect(x,y,w,h-8);ctx.clip();withA(ctx,1-fo,()=>{T(ctx,file,x+26,y+152,{f:"mono",w:500,size:28,color:rgba(SOFT,0.95)});
    D.forEach(([sg,s],i)=>{const q=o.rows?o.rows[i]||0:1;if(q<=0.01)return;const yy=y+176+i*lh,col=sg==="-"?D11_RED:sg==="+"?D11_OK:[150,165,190];withA(ctx,clamp(q*2,0,1),()=>{
      ctx.fillStyle=rgba(col,sg===" "?0.0:0.13);ctx.fillRect(x+14,yy,w-28,lh-4);T(ctx,sg,x+30,yy+35,{f:"mono",w:500,size:28,color:rgba(col,1)});T(ctx,typeOn(s,clamp(q*1.5-0.3,0,1)),x+62,yy+35,{f:"mono",w:500,size:28,color:rgba(mix(col,INK,0.55),1)});
      if(sg==="-"&&q>0.6){const sw=tw(ctx,s,28,500,"mono");ctx.strokeStyle=rgba(D11_RED,0.7);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+62,yy+26);ctx.lineTo(x+62+sw*clamp((q-0.6)/0.4,0,1),yy+26);ctx.stroke();}});});
    if(R.length){const ry=y+196+D.length*lh+10;T(ctx,"review",x+26,ry+20,{f:"mono",w:500,size:28,color:rgba(SOFT,0.9)});
      R.forEach(([nm,side,tk,ra],i)=>{const q=ra==null?1:ra;if(q<=0.01)return;const yy=ry+64+i*58;withA(ctx,q,()=>{archGlyph(ctx,"actor",x+40,yy-10,13,TRUST);T(ctx,nm,x+66,yy,{w:800,size:30,color:rgba(TRUST,1)});
        T(ctx,side,x+66+tw(ctx,nm,30,800)+16,yy,{w:700,size:28,color:rgba(SOFT,0.95)});if(tk>0.01){kt_gtick(ctx,x+w-50,yy-10,17,tk);withA(ctx,tk,()=>T(ctx,"approved",x+w-80,yy,{w:700,size:28,align:"right",color:rgba(TRUST,1)}));}});});}});ctx.restore();});return h;}
// the checks that run on the map, on every change: each row is running (0), passed (1) or flagged (2), with a note
function d11_checks(ctx,x,y,w,rows,o){o=o||{};const a=o.a==null?1:o.a,lh=62,h=92+rows.length*lh;if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,[170,205,255],{glow:12+12*(o.glow||0),ea:0.75,fill:"rgba(6,10,20,0.96)"});T(ctx,o.title||"checks on the map · every change",x+26,y+46,{f:"mono",w:500,size:28,color:rgba([170,205,255],1)});
    rows.forEach(([s,st,note,ra],i)=>{const q=ra==null?1:ra;if(q<=0.01)return;const yy=y+92+i*lh+lh*0.55;withA(ctx,q,()=>{
      if(st===0){ctx.save();ctx.strokeStyle=rgba(SOFT,0.9);ctx.lineWidth=3;ctx.lineCap="round";const an=(o.t||0)*5;ctx.beginPath();ctx.arc(x+44,yy-10,12,an,an+Math.PI*1.4);ctx.stroke();ctx.restore();}
      else if(st===1){glow(ctx,x+44,yy-10,22,D11_OK,0.3);tick_(ctx,x+44,yy-8,26,D11_OK,1);}
      else{glass(ctx,x+26,yy-28,36,36,18,AMBER,{glow:10,ea:0.85,fill:"rgba(30,20,6,0.95)"});T(ctx,"!",x+44,yy-1,{w:800,size:28,align:"center",color:rgba(AMBER,1)});}
      T(ctx,s,x+80,yy,{w:700,size:30,color:rgba(INK,0.95)});if(note)T(ctx,note,x+w-26,yy,{w:700,size:28,align:"right",color:rgba(st===2?AMBER:SOFT,1)});});});});return h;}

/* ---------- one map, many views ---------- */
// the six views generated from the map, then dbt and Databricks, which carry it too
const D11_VIEWS=["ArchiMate views","glossary","conceptual model","ontology · OWL","checks","heat map","dbt","Databricks"],D11_VCOL=[170,205,255];
// a view's icon, a small picture of what it holds, with no words, in the box (x, y, w, h)
function d11_vicon(ctx,k,x,y,w,h,col){ctx.save();ctx.lineWidth=1.6;
  if(k===0){LAY6.forEach(([,c],i)=>{const yy=y+i*h/6,n=2+i%2,bw=(w-8)/n;for(let j=0;j<n;j++){ctx.fillStyle=rgba(c,0.6);rr(ctx,x+4+j*bw,yy+1.5,bw-5,h/6-3.5,2.5);ctx.fill();}});}
  else if(k===1){for(let i=0;i<3;i++){const yy=y+6+i*h/3;ctx.fillStyle=rgba(INF,0.9);rr(ctx,x+2,yy,w*0.34,7,3.5);ctx.fill();ctx.fillStyle=rgba(SOFT,0.5);rr(ctx,x+2,yy+12,w*0.92,5,2.5);ctx.fill();}}
  else if(k===2){const B=[[0.2,0.22],[0.8,0.22],[0.5,0.8]];ctx.strokeStyle=rgba(col,0.7);[[0,1],[0,2],[1,2]].forEach(([i,j])=>{ctx.beginPath();ctx.moveTo(x+B[i][0]*w,y+B[i][1]*h);ctx.lineTo(x+B[j][0]*w,y+B[j][1]*h);ctx.stroke();});
    B.forEach(([u,v])=>{ctx.fillStyle="rgba(10,16,30,1)";rr(ctx,x+u*w-17,y+v*h-10,34,20,4);ctx.fill();ctx.strokeStyle=rgba(INF,0.95);rr(ctx,x+u*w-17,y+v*h-10,34,20,4);ctx.stroke();});}
  else if(k===3){const N=[[0.14,0.5],[0.5,0.16],[0.5,0.84],[0.88,0.5]];ctx.strokeStyle=rgba(col,0.7);[[0,1],[0,2],[1,3],[2,3],[1,2]].forEach(([i,j])=>{ctx.beginPath();ctx.moveTo(x+N[i][0]*w,y+N[i][1]*h);ctx.lineTo(x+N[j][0]*w,y+N[j][1]*h);ctx.stroke();});
    N.forEach(([u,v],i)=>{ctx.fillStyle=rgba(i===0?INF:col,0.95);ctx.beginPath();ctx.arc(x+u*w,y+v*h,6.5,0,TAU);ctx.fill();});}
  else if(k===4){for(let i=0;i<3;i++){const yy=y+10+i*h/3;if(i<2)tick_(ctx,x+9,yy+2,15,D11_OK,1);else{ctx.fillStyle=rgba(AMBER,1);ctx.beginPath();ctx.arc(x+9,yy-1,6,0,TAU);ctx.fill();}ctx.fillStyle=rgba(i<2?SOFT:AMBER,0.55);rr(ctx,x+24,yy-4,w*0.7,6,3);ctx.fill();}}
  else if(k===5){const cw=w/3,ch=h/3;for(let i=0;i<3;i++)for(let j=0;j<3;j++){const c_=(i===2&&j===0)?D11_RED:(i+j)%3===1?AMBER:D11_OK;ctx.fillStyle=rgba(c_,0.38);rr(ctx,x+i*cw+2,y+j*ch+2,cw-4,ch-4,3);ctx.fill();ctx.strokeStyle=rgba(c_,0.9);rr(ctx,x+i*cw+2,y+j*ch+2,cw-4,ch-4,3);ctx.stroke();}}
  ctx.restore();}
// one view as a card (x, y, w, h): its icon, its name and, when o.rd shows it, who reads it (o.reader). dbt and Databricks
// (k 6, 7) show their logos. o.hi lights it; o.fl flashes it as the map's change arrives
function d11_vcard(ctx,k,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=k===6?[255,150,120]:k===7?[255,120,90]:D11_VCOL,hi=Math.max(o.hi||0,o.fl||0);
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,14,col,{glow:10+16*hi,ea:0.7+0.25*hi,fill:"rgba(6,10,20,0.95)"});if(hi>0.01){ctx.fillStyle=rgba(o.fl>0.01?D11_OK:col,0.12*hi);rr(ctx,x,y,w,h,14);ctx.fill();}
    const fill=o.fill==null?1:o.fill;if(fill<=0.01)return;withA(ctx,fill,()=>{const ih=Math.min(h-32,64),iw=ih*1.35,ix=x+18,iy=y+(h-ih)/2;let nx=ix+iw+20;
      if(k<6)d11_vicon(ctx,k,ix,iy,iw,ih,col);else{const lh_=Math.min(36,h-30),lw_=logo(ctx,k===6?"dbt":"databricks",ix,y+(h-lh_)/2,lh_);nx=ix+lw_+16;}
      T(ctx,D11_VIEWS[k],nx,y+h/2+11,{w:800,size:h<90?28:30,color:rgba(mix(col,INK,0.45),1)});
      if(o.rd>0.01&&o.reader)withA(ctx,o.rd,()=>tag(ctx,x+w-26-tw(ctx,o.reader,28,700)-26,y+h/2,o.reader,[200,215,240],{size:28}));});});}
// the glossary, large, as the map generates it: each term, the element it comes from, and its definition; o.fix (0..1)
// types the change that arrives from the map into the first definition
const D11_GLOSS=[["reading","OBJ-003","a meter's record of energy used"],["bill","OBJ-007","what a customer owes for a period"],["eligibility","OBJ-011","who can get the social tariff"]];
function d11_gloss(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,rh=100,h=104+D11_GLOSS.length*rh;if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,D11_VCOL,{glow:12+14*(o.glow||0),ea:0.75,fill:"rgba(6,10,20,0.96)"});T(ctx,"glossary",x+28,y+52,{w:800,size:34,color:rgba(mix(D11_VCOL,INK,0.45),1)});
    T(ctx,"generated from the map",x+w-28,y+50,{f:"mono",w:500,size:28,align:"right",color:rgba(EAC,1)});ctx.fillStyle="rgba(170,200,245,0.14)";ctx.fillRect(x+16,y+78,w-32,1.2);
    D11_GLOSS.forEach(([tm,id,df],i)=>{const yy=y+104+i*rh+40,fx=i===0?o.fix||0:0,hi=i===0?o.hi||0:0;
      if(hi>0.01||fx>0.01){ctx.fillStyle=rgba(fx>0.01?D11_OK:D11_VCOL,0.12*Math.max(hi,fx>0.01?1-fin(fx,0.7,0.3):0));rr(ctx,x+14,yy-34,w-28,rh-8,8);ctx.fill();}
      T(ctx,tm,x+28,yy,{w:800,size:30,color:rgba(INF,1)});T(ctx,id,x+w-28,yy,{f:"mono",w:500,size:28,align:"right",color:rgba(SOFT,0.9)});
      T(ctx,df,x+28,yy+42,{w:600,size:28,color:rgba(INK,0.92)});if(fx>0.01)T(ctx,typeOn(" or exported",fx),x+28+tw(ctx,df,28,600),yy+42,{w:700,size:28,color:rgba(D11_OK,1)});});});return h;}
// a thread from the map to a view, one way: a line with a head, and a light that runs along it as p goes 0..1
function d11_thread(ctx,x0,y0,x1,y1,p,col,o){o=o||{};if(p<=0.01)return;const q=ease(clamp(p,0,1)),mx=(x0+x1)/2,c1=[mx,y0],c2=[mx,y1],at_=u=>{const v=1-u;return[v*v*v*x0+3*v*v*u*c1[0]+3*v*u*u*c2[0]+u*u*u*x1,v*v*v*y0+3*v*v*u*c1[1]+3*v*u*u*c2[1]+u*u*u*y1];};
  ctx.save();ctx.strokeStyle=rgba(col,o.a==null?0.55:o.a);ctx.lineWidth=o.lw||2.2;ctx.beginPath();for(let k=0;k<=40;k++){const[x,y]=at_(q*k/40);k?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
  if(q>0.98){const[xa,ya]=at_(0.97);const an=Math.atan2(y1-ya,x1-xa);ctx.fillStyle=rgba(col,o.a==null?0.8:o.a);ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x1-13*Math.cos(an-0.4),y1-13*Math.sin(an-0.4));ctx.lineTo(x1-13*Math.cos(an+0.4),y1-13*Math.sin(an+0.4));ctx.closePath();ctx.fill();}
  ctx.restore();if(o.pulse!=null&&o.pulse>0&&o.pulse<1){const[x,y]=at_(o.pulse);glow(ctx,x,y,22,col,0.8);ctx.fillStyle="rgba(255,255,255,0.95)";ctx.beginPath();ctx.arc(x,y,4,0,TAU);ctx.fill();}}
// dbt's YAML for one model, as the map generates it: o.lit[i] lights a line
const D11_DBT=["models:","  - name: readings","    description: one row per meter reading","    config:","      meta:","        owner: Grace Achieng","        domain: network","        rules: [RUL-020, RUL-021]"];
function d11_dbt(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,lh=46,h=92+D11_DBT.length*lh;if(a<=0.01)return h;const col=[255,150,120];
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,col,{glow:12+12*(o.glow||0),ea:0.75,fill:"rgba(8,8,14,0.96)"});const lw_=logo(ctx,"dbt",x+24,y+18,34);T(ctx,"models/network/readings.yml",x+36+lw_,y+46,{f:"mono",w:500,size:28,color:rgba(SOFT,0.95)});
    ctx.fillStyle="rgba(255,190,170,0.16)";ctx.fillRect(x+14,y+66,w-28,1.2);
    D11_DBT.forEach((l,i)=>{const yy=y+70+i*lh+lh*0.68,on=o.lit?o.lit[i]||0:0,q=o.p==null?1:clamp(o.p*D11_DBT.length-i,0,1);if(q<=0)return;
      if(on>0.01)withA(ctx,on,()=>{ctx.fillStyle=rgba(TRUST,0.16);rr(ctx,x+12,yy-lh*0.72,w-24,lh*0.94,6);ctx.fill();});
      const m=l.match(/^(\s*-?\s*)([a-z_]+:)(.*)$/);if(m){const x0=x+26+tw(ctx,m[1],28,500,"mono");T(ctx,m[1],x+26,yy,{f:"mono",w:500,size:28,color:rgba(SOFT,0.8)});T(ctx,m[2],x0,yy,{f:"mono",w:500,size:28,color:rgba(mix(col,INK,0.25),1)});T(ctx,m[3],x0+tw(ctx,m[2],28,500,"mono"),yy,{f:"mono",w:500,size:28,color:rgba(mix(INK,TRUST,on*0.5),0.96)});}
      else T(ctx,l,x+26,yy,{f:"mono",w:500,size:28,color:rgba(INK,0.9)});});});return h;}
// Databricks' catalogue page for the table: its name, owner, tags and description, and its lineage; o.lit[k] lights a part
function d11_dbx(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=o.h||520;if(a<=0.01)return h;const col=[255,120,90],L=o.lit||{};
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,col,{glow:12+12*(o.glow||0),ea:0.75,fill:"rgba(10,10,16,0.96)"});const lw_=logo(ctx,"databricks",x+24,y+20,30);T(ctx,"Catalog",x+38+lw_,y+46,{w:700,size:28,color:rgba(SOFT,0.95)});
    ctx.fillStyle="rgba(255,190,170,0.16)";ctx.fillRect(x+14,y+66,w-28,1.2);T(ctx,"network.metering.readings",x+26,y+116,{f:"mono",w:500,size:30,color:rgba(INK,0.97)});
    const row=(k,ty,lab,fn)=>{const on=L[k]||0;if(on>0.01)withA(ctx,on,()=>{ctx.fillStyle=rgba(TRUST,0.14);rr(ctx,x+12,ty-36,w-24,52,6);ctx.fill();});T(ctx,lab,x+26,ty,{w:700,size:28,color:rgba(SOFT,0.95)});fn(x+190,ty);};
    row("owner",y+180,"Owner",(xx,yy)=>{archGlyph(ctx,"actor",xx+10,yy-10,12,TRUST);T(ctx,"Grace Achieng",xx+32,yy,{w:700,size:28,color:rgba(INK,0.95)});});
    row("tags",y+244,"Tags",(xx,yy)=>{let cx=xx;["domain: network","RUL-020","RUL-021"].forEach(s_=>{const tw_=tw(ctx,s_,28,500,"mono")+24;ctx.fillStyle=rgba([120,170,255],0.16);rr(ctx,cx,yy-30,tw_,42,21);ctx.fill();ctx.strokeStyle=rgba([150,190,255],0.7);ctx.lineWidth=1.4;rr(ctx,cx,yy-30,tw_,42,21);ctx.stroke();T(ctx,s_,cx+12,yy,{f:"mono",w:500,size:28,color:rgba([200,220,255],1)});cx+=tw_+12;});});
    row("desc",y+308,"About",(xx,yy)=>T(ctx,"one row per meter reading",xx,yy,{w:700,size:28,color:rgba(INK,0.92)}));
    // its lineage: where the rows come from and where they go
    const ly=y+h-62,on=L.lineage||0;if(on>0.01)withA(ctx,on,()=>{ctx.fillStyle=rgba(TRUST,0.14);rr(ctx,x+12,ly-94,w-24,128,6);ctx.fill();});T(ctx,"Lineage",x+26,ly-46,{w:700,size:28,color:rgba(SOFT,0.95)});
    let nx=x+26;const N=["ami.events","readings","billing.bills"].map(n=>{const bw=tw(ctx,n,28,500,"mono")+24,r=[n,nx,bw];nx+=bw+64;return r;});
    N.forEach(([n,bx,bw],i)=>{if(i<2){const x2=N[i+1][1];ctx.strokeStyle=rgba(mix([150,190,255],TRUST,on),0.7);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(bx+bw+6,ly);ctx.lineTo(x2-8,ly);ctx.stroke();ctx.fillStyle=rgba(mix([150,190,255],TRUST,on),0.8);ctx.beginPath();ctx.moveTo(x2-5,ly);ctx.lineTo(x2-16,ly-7);ctx.lineTo(x2-16,ly+7);ctx.closePath();ctx.fill();}
      ctx.fillStyle=i===1?rgba(mix([60,90,150],TRUST,on*0.4),0.5):"rgba(30,40,60,0.9)";rr(ctx,bx,ly-24,bw,48,8);ctx.fill();ctx.strokeStyle=rgba(i===1?mix([150,190,255],TRUST,on):[120,140,180],0.9);ctx.lineWidth=1.6;rr(ctx,bx,ly-24,bw,48,8);ctx.stroke();T(ctx,n,bx+12,ly+10,{f:"mono",w:500,size:28,color:rgba(INK,0.92)});});});return h;}
// a pencil, for an edit: tip at (x, y)
function d11_pencil(ctx,x,y,s,a,rot){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(rot==null?-0.7:rot);ctx.scale(s,s);ctx.fillStyle="rgba(255,214,120,1)";ctx.fillRect(14,-7,70,14);ctx.fillStyle="rgba(240,170,170,1)";ctx.fillRect(84,-7,12,14);ctx.fillStyle="rgba(200,200,210,1)";ctx.fillRect(80,-7,5,14);
  ctx.fillStyle="rgba(236,214,180,1)";ctx.beginPath();ctx.moveTo(14,-7);ctx.lineTo(0,0);ctx.lineTo(14,7);ctx.closePath();ctx.fill();ctx.fillStyle="rgba(40,40,48,1)";ctx.beginPath();ctx.moveTo(5,-2.5);ctx.lineTo(0,0);ctx.lineTo(5,2.5);ctx.closePath();ctx.fill();ctx.restore();});}

/* ---------- the map, written out ---------- */
// the map's elements as lines of text, one per element, in the layers' order: what the slide's boxes become
const D11_LINES=[["GOL-002","keep bills affordable"],["PRN-003","customer information stays put"],["DRV-001","the energy transition"],
  ["CAP-001","operate the network"],["CAP-004","connect customers"],["CAP-007","manage outages"],["CAP-009","generate power"],
  ["STP-004","read"],["STP-005","bill"],["STP-006","paid"],["ROL-001","call-taker"],["ROL-002","duty controller"],
  ["OBJ-003","reading"],["OBJ-007","bill"],["OBJ-011","eligibility"],["MSR-002","working days to connect new solar"],
  ["APP-001","meter data"],["APP-004","billing"],["APP-006","outage system"],["APP-009","customer records"],["APP-012","network model"],
  ["TEC-002","meter network"],["TEC-005","data platform"],["TEC-008","control system"]];
// the rule's file, as Tomás writes it: RUL-021, the network's half of day one's rule (from Rules with a home)
const D11_RUL021=[["id","RUL-021"],["name","estimate replaced by actual"],["kind","requirement"],["definition",">"],[null,"An estimate is replaced when the actual reading arrives,",{ind:1}],[null,"and the replacement is sent to the retailer.",{ind:1}],
  ["owner","Grace Achieng"],["relationships",""],[null,"- realization: STP-004 · read",{ind:1}],[null,"- association: OBJ-003 · reading",{ind:1}],["evidence","metering rules 7.4 · 14 Mar 2027"],["status","confirmed"]];
// a decision, as a file: film 7's, written down with why
const D11_DEC007=[["id","DEC-007"],["name","one outage system"],["decided","keep the newest outage system"],["why","three systems, three versions"],[null,"of every outage",{ind:2}],["decided by","Grace · October 2026"],["status","accepted"]];

/* ---------- an agent reads the map ---------- */
// what someone gives the agent: a kicker that says what it is, and its words
function d11_ask(ctx,x,y,w,kick,text,o){o=o||{};const a=o.a==null?1:o.a,h=o.h||124;if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,KT_AI,{glow:12+14*(o.glow||0),ea:0.8,fill:"rgba(6,12,20,0.96)"});T(ctx,kick,x+28,y+46,{f:"mono",w:500,size:28,color:rgba(KT_AI,1)});
    T(ctx,text,x+28,y+96,{w:800,size:o.size||34,color:rgba(INK,0.97)});if(o.note&&o.noteA>0.01)withA(ctx,o.noteA,()=>tag(ctx,x+w-26-tw(ctx,o.note,28,700)-26,y+h/2,o.note,[200,215,240],{size:28}));});return h;}
// what the agent finds, step by step: rows of [glyph, label, name, colour], shown by o.rows[i] and joined down the left
function d11_trace(ctx,x,y,w,rows,o){o=o||{};const a=o.a==null?1:o.a,rh=76,h=40+rows.length*rh;if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,KT_AI,{glow:10,ea:0.6,fill:"rgba(6,12,20,0.94)"});
    rows.forEach(([g,lab,nm,col],i)=>{const q=o.rows?o.rows[i]||0:1;if(q<=0.01)return;const yy=y+58+i*rh;withA(ctx,q,()=>{
      if(i>0){ctx.strokeStyle=rgba(KT_AI,0.5);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+50,yy-rh+24);ctx.lineTo(x+50,yy-24);ctx.stroke();}
      glow(ctx,x+50,yy-1,24,col,0.25);d11_glyph(ctx,g,x+50,yy-2,15,col);T(ctx,lab,x+86,yy+9,{f:"mono",w:500,size:28,color:rgba(SOFT,0.95)});
      T(ctx,nm,x+86+tw(ctx,lab,28,500,"mono")+20,yy+10,{w:800,size:30,color:rgba(mix(col,INK,0.35),1)});});});});return h;}
// one element a change touches: its glyph, its ID and name, and its owner on the right
function d11_hit(ctx,x,y,w,kind,id,name,owner,o){o=o||{};const a=o.a==null?1:o.a,h=70;if(a<=0.01)return h;const[,col,gk]=D11_KIND[kind];
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,14,col,{glow:10,ea:0.75,fill:"rgba(6,10,20,0.95)"});d11_glyph(ctx,gk,x+38,y+h/2,14,col);T(ctx,id,x+72,y+h/2+10,{f:"mono",w:500,size:28,color:rgba(SOFT,0.95)});
    T(ctx,name,x+72+tw(ctx,id,28,500,"mono")+18,y+h/2+10,{w:800,size:30,color:rgba(mix(col,INK,0.5),1)});const ow=tw(ctx,owner,28,700);archGlyph(ctx,"actor",x+w-ow-50,y+h/2-1,12,TRUST);
    T(ctx,owner,x+w-24,y+h/2+10,{w:700,size:28,align:"right",color:rgba(TRUST,1)});});return h;}
// the owners who must agree to a change, each with a ring that a tick fills when they do
function d11_agree(ctx,x,y,w,names,o){o=o||{};const a=o.a==null?1:o.a,h=110;if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,TRUST,{glow:10+12*(o.glow||0),ea:0.7,fill:"rgba(20,16,6,0.94)"});T(ctx,o.kicker||"must agree",x+28,y+64,{f:"mono",w:500,size:28,color:rgba(TRUST,1)});
    let cx=x+28+tw(ctx,o.kicker||"must agree",28,500,"mono")+44;names.forEach((nm,i)=>{const q=o.rows?o.rows[i]||0:1;if(q<=0.01)return;withA(ctx,q,()=>{ring(ctx,cx+14,y+h/2,14,TRUST,0.9,2.2);
      T(ctx,nm,cx+40,y+h/2+10,{w:800,size:30,color:rgba(TRUST,1)});});cx+=40+tw(ctx,nm,30,800)+48;});});return h;}
// the catalogue, open at one column: the table, then the column with its type and its values; o.hi lights the column
function d11_col(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=180;if(a<=0.01)return h;const col=[255,120,90];
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,col,{glow:12+12*(o.glow||0),ea:0.75,fill:"rgba(10,10,16,0.96)"});const lw_=logo(ctx,"databricks",x+26,y+20,30);
    T(ctx,"a column in the catalogue",x+40+lw_,y+46,{f:"mono",w:500,size:28,color:rgba(KT_AI,1)});T(ctx,"network.metering.readings",x+28,y+100,{f:"mono",w:500,size:30,color:rgba(SOFT,0.95)});
    const hi=o.hi||0;if(hi>0.01){ctx.fillStyle=rgba(KT_AI,0.14*hi);rr(ctx,x+14,y+118,w-28,50,8);ctx.fill();}
    T(ctx,"read_type",x+28,y+154,{f:"mono",w:500,size:30,color:rgba(mix(KT_AI,INK,0.3),1)});T(ctx,"string",x+260,y+154,{f:"mono",w:500,size:28,color:rgba(SOFT,0.9)});
    T(ctx,"actual · estimated",x+420,y+154,{f:"mono",w:500,size:28,color:rgba(INK,0.9)});});return h;}
// the agent's answer, which cites what it found: o.ul (0..1) underlines each citation as a link; o.chk ticks the source once checked
function d11_answer(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=164;if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,KT_AI,{glow:12+14*(o.glow||0),ea:0.85,fill:"rgba(6,12,20,0.97)"});kt_agent(ctx,x+40,y+40,15,o.t||0,{});T(ctx,"the agent's answer",x+72,y+50,{f:"mono",w:500,size:28,color:rgba(KT_AI,1)});
    const L=[[["read_type keeps ",0],["RUL-020",1],[", owned by Grace Achieng.",0]],[["Its reason: ",0],["the metering rules, 7.2",2],[".",0]]];
    L.forEach((ln,i)=>{let cx=x+28;const yy=y+100+i*44;ln.forEach(([s_,k])=>{const sw=tw(ctx,s_,30,700),u=k?(o.ul||0):0;T(ctx,s_,cx,yy,{w:700,size:30,color:rgba(k&&u>0.01?mix(INK,KT_AI,u):INK,0.96)});
      if(u>0.01){ctx.fillStyle=rgba(KT_AI,0.9);ctx.fillRect(cx,yy+7,sw*u,2.2);}if(k===2){o.linkAt&&o.linkAt(cx+sw/2,yy-10);if(o.chk>0.01){glow(ctx,cx+sw+30,yy-10,20,D11_OK,0.3*o.chk);withA(ctx,o.chk,()=>tick_(ctx,cx+sw+30,yy-8,24,D11_OK,1));}}cx+=sw;});});});return h;}
// a mouse pointer, tip at (x, y); press (0..1) dips it and rings the spot
function d11_cursor(ctx,x,y,s,a,press){if(a<=0.01)return;const pr=press||0;withA(ctx,a,()=>{if(pr>0.01&&pr<1){ctx.save();ctx.strokeStyle=rgba(KT_AI,1-pr);ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(x,y,8+pr*26,0,TAU);ctx.stroke();ctx.restore();}
  ctx.save();ctx.translate(x,y);ctx.scale(s*(1-0.12*Math.sin(Math.PI*clamp(pr*2,0,1))),s*(1-0.12*Math.sin(Math.PI*clamp(pr*2,0,1))));ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,26);ctx.lineTo(6.5,20);ctx.lineTo(11,30);ctx.lineTo(15,28);ctx.lineTo(10.5,18.5);ctx.lineTo(19,18.5);ctx.closePath();
  ctx.shadowColor="rgba(0,0,0,0.6)";ctx.shadowBlur=6;ctx.fillStyle="rgba(250,250,252,1)";ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle="rgba(20,24,32,1)";ctx.lineWidth=1.4;ctx.stroke();ctx.restore();});}
// the source itself: a page of the metering rules, open at the clause
function d11_source(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{kt_paper(ctx,x,y,w,h,t,{seed:7,curl:0.4});const ink=[44,38,32];
  T(ctx,"Metering rules",x+30,y+52,{w:800,size:30,color:rgba(ink,1)});T(ctx,"14 March 2027",x+w-30,y+52,{w:700,size:28,align:"right",color:rgba(ink,0.75)});
  ctx.fillStyle=rgba(ink,0.25);ctx.fillRect(x+28,y+74,w-56,1.4);const hl=o.hl||0;if(hl>0.01){ctx.fillStyle=`rgba(255,214,90,${0.45*hl})`;ctx.fillRect(x+84,y+96,(w-120)*hl,82);}
  T(ctx,"7.2",x+30,y+124,{w:800,size:28,color:rgba(ink,1)});T(ctx,"Every reading is marked",x+90,y+124,{w:700,size:28,color:rgba(ink,1)});T(ctx,"actual or estimated.",x+90,y+166,{w:700,size:28,color:rgba(ink,1)});});}

/* ---------- an agent on the map ---------- */
// the outage agent, from Who does it: its ID, its owner and its rights, for comparison
function d11_outage(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=150;if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,APL,{glow:10,ea:0.7,fill:"rgba(10,10,14,0.95)"});T(ctx,"like the outage agent's",x+28,y+44,{f:"mono",w:500,size:28,color:rgba(SOFT,0.95)});
    d11_glyph(ctx,"component",x+42,y+86,13,APL);T(ctx,"APP-015",x+68,y+96,{f:"mono",w:500,size:28,color:rgba(SOFT,0.95)});T(ctx,"outage agent",x+68+tw(ctx,"APP-015",28,500,"mono")+16,y+96,{w:800,size:30,color:rgba(mix(APL,INK,0.5),1)});
    archGlyph(ctx,"actor",x+w-tw(ctx,"owner: Grace Achieng",28,700)-50,y+86,12,TRUST);T(ctx,"owner: Grace Achieng",x+w-28,y+96,{w:700,size:28,align:"right",color:rgba(TRUST,1)});
    T(ctx,"may: group reports, propose  ·  may not: send a crew",x+28,y+136,{w:700,size:28,color:rgba(SOFT,0.95)});});return h;}
// two sources that disagree: the metering rules (paper) and the meter data system's setting (a screen)
function d11_disagree(ctx,x,y,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const ink=[44,38,32];withA(ctx,a,()=>{
  const pa=o.pa==null?1:o.pa,pb=o.pb==null?1:o.pb,ne=o.ne||0;
  if(pa>0.01)withA(ctx,pa,()=>{kt_paper(ctx,x,y,360,150,t,{seed:4,curl:0.3});T(ctx,"Metering rules · 7.4",x+24,y+48,{w:800,size:28,color:rgba(ink,0.85)});T(ctx,"2 working days",x+24,y+108,{w:800,size:36,color:rgba(ink,1)});});
  if(pb>0.01)withA(ctx,pb,()=>{glass(ctx,x+424,y,360,150,14,APL,{glow:10,ea:0.75,fill:"rgba(6,10,20,0.96)"});T(ctx,"meter data system",x+448,y+48,{f:"mono",w:500,size:28,color:rgba(APL,1)});T(ctx,"3 days",x+448,y+108,{f:"mono",w:500,size:36,color:rgba(INK,0.95)});});
  if(ne>0.01)withA(ctx,ne,()=>{glow(ctx,x+392,y+75,26,AMBER,0.35);T(ctx,"≠",x+392,y+92,{w:800,size:44,align:"center",color:rgba(AMBER,1)});});});}
// the agent's question, to the owner, when sources disagree
function d11_question(ctx,x,y,w,t,o){o=o||{};const a=o.a==null?1:o.a,h=150;if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,KT_AI,{glow:12+12*(o.glow||0),ea:0.85,fill:"rgba(6,12,20,0.97)"});kt_agent(ctx,x+38,y+40,14,t,{});T(ctx,"asks the owner",x+64,y+50,{f:"mono",w:500,size:28,color:rgba(KT_AI,1)});
    archGlyph(ctx,"actor",x+38,y+92,12,TRUST);T(ctx,"Grace Achieng",x+62,y+102,{w:800,size:30,color:rgba(TRUST,1)});T(ctx,"which is right?",x+28,y+138,{w:700,size:28,color:rgba(INK,0.92)});});return h;}
// the rule from Keeping it true: agents draft, people confirm, every version is kept; o.sw (0..1) swaps "data models" for "the map"
function d11_rule3(ctx,x,y,w,t,o){o=o||{};const a=o.a==null?1:o.a,h=150;if(a<=0.01)return h;const R=o.rows||[1,1,1],sw=ease(clamp(o.sw||0,0,1));
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,TRUST,{glow:12+14*(o.glow||0),ea:0.75,fill:"rgba(16,14,8,0.95)"});
    const t1="the rule that keeps ",t3=" true",w1=tw(ctx,t1,30,700);T(ctx,t1,x+28,y+50,{w:700,size:30,color:rgba(INK,0.92)});
    const wa=tw(ctx,"data models",30,800),wb=tw(ctx,"the map",30,800),wm=lerp(wa,wb,sw);withA(ctx,1-sw,()=>T(ctx,"data models",x+28+w1,y+50-sw*16,{w:800,size:30,color:rgba(SOFT,1)}));withA(ctx,sw,()=>T(ctx,"the map",x+28+w1,y+50+(1-sw)*16,{w:800,size:30,color:rgba(EAC,1)}));
    if(sw>0.02&&sw<0.98){ctx.strokeStyle=rgba(SOFT,0.6*(1-sw));ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+28+w1,y+40);ctx.lineTo(x+28+w1+wa,y+40);ctx.stroke();}
    T(ctx,t3,x+28+w1+wm,y+50,{w:700,size:30,color:rgba(INK,0.92)});
    const S3=[["agents draft",0],["people confirm",1],["every version kept",2]];let cx=x+28;S3.forEach(([s_,k],i)=>{const q=R[i]||0;const sw_=tw(ctx,s_,30,800);if(q>0.01)withA(ctx,q,()=>{
      if(k===0)kt_agent(ctx,cx+16,y+106,13,t,{});else if(k===1)kt_gtick(ctx,cx+16,y+106,15,1);else{for(let j=0;j<3;j++){ctx.fillStyle=rgba(j===2?TRUST:EAC,1);ctx.beginPath();ctx.arc(cx+4+j*14,y+106,5,0,TAU);ctx.fill();}}
      T(ctx,s_,cx+46,y+116,{w:800,size:30,color:rgba(k===1?TRUST:k===0?KT_AI:mix(EAC,INK,0.3),1)});if(i<2&&(R[i+1]||0)>0.01)withA(ctx,R[i+1],()=>arrowTo(ctx,cx+46+sw_+18,y+106,cx+46+sw_+62,y+106,SOFT,0.8));});cx+=46+sw_+84;});});return h;}

/* ---------- people confirm ---------- */
// the regulator's retail code, amended: clause 4.2 says why, as in Rules with a home, and a new sentence is written in after it (o.nw 0..1),
// underlined as an amendment is
function d11_code(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const ink=[44,38,32],red=[176,52,44];withA(ctx,a,()=>{kt_paper(ctx,x,y,w,h,t,{seed:9,curl:0.35});
  T(ctx,"Retail code",x+32,y+52,{w:800,size:34,color:rgba(ink,1)});T(ctx,"the energy regulator · amended, January 2028",x+w-32,y+50,{w:700,size:28,align:"right",color:rgba(ink,0.72)});
  ctx.fillStyle=rgba(ink,0.25);ctx.fillRect(x+30,y+74,w-60,1.4);const hl=o.hl||0;if(hl>0.01){ctx.fillStyle=`rgba(255,214,90,${0.4*hl})`;ctx.fillRect(x+86,y+140,w-120,94);}
  T(ctx,"4.2",x+32,y+124,{w:800,size:28,color:rgba(ink,1)});T(ctx,"A bill must reflect actual readings.",x+92,y+124,{w:700,size:28,color:rgba(ink,1)});
  const L1="When an actual reading replaces an estimate,",L2="the bill must be corrected within ten working days.",n=Math.round(clamp(o.nw||0,0,1)*(L1.length+L2.length));
  [[L1.slice(0,n),y+172],[L2.slice(0,Math.max(0,n-L1.length)),y+216]].forEach(([s_,yy])=>{if(!s_)return;T(ctx,s_,x+92,yy,{w:800,size:28,color:rgba(red,1)});ctx.fillStyle=rgba(red,0.75);ctx.fillRect(x+92,yy+7,tw(ctx,s_,28,800),2);});});}
// what a change touches: a check and the views generated from the rule, as chips after a kicker
function d11_touches(ctx,x,y,items,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{T(ctx,"it touches",x,y+10,{f:"mono",w:500,size:28,color:rgba(KT_AI,1)});let cx=x+tw(ctx,"it touches",28,500,"mono")+24;
  items.forEach(([k,s_],i)=>{const q=o.rows?o.rows[i]||0:1;if(q<=0.01)return;const sw=tw(ctx,s_,28,700)+(k?64:30);withA(ctx,q,()=>{const col=k===1?D11_OK:D11_VCOL;glass(ctx,cx,y-24,sw,48,24,col,{glow:8,ea:0.75,fill:"rgba(6,10,20,0.95)"});
    if(k===1)tick_(ctx,cx+26,y+2,22,D11_OK,1);else if(k===2)d11_vicon(ctx,0,cx+12,y-12,30,24,D11_VCOL);else if(k===3)d11_vicon(ctx,3,cx+12,y-12,30,24,D11_VCOL);T(ctx,s_,cx+(k?50:15),y+10,{w:700,size:28,color:rgba(mix(col,INK,0.5),1)});});cx+=sw+16;});});}
// dbt's YAML for the bills, changed with the rule: a diff, with the dbt mark
function d11_dbtdiff(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,L=[[" ","models:"],[" ","  - name: bills"],[" ","    data_tests:"],["-","      - rul_022_corrected_on_next_bill"],["+","      - rul_022_corrected_within_ten_working_days"],[" ","    config: {meta: {rules: [RUL-022]}}"]],lh=46,h=92+L.length*lh;if(a<=0.01)return h;const col=[255,150,120];
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,col,{glow:12+12*(o.glow||0),ea:0.75,fill:"rgba(8,8,14,0.96)"});const lw_=logo(ctx,"dbt",x+24,y+18,34);T(ctx,"models/retail/bills.yml",x+36+lw_,y+46,{f:"mono",w:500,size:28,color:rgba(SOFT,0.95)});
    ctx.fillStyle="rgba(255,190,170,0.16)";ctx.fillRect(x+14,y+66,w-28,1.2);
    L.forEach(([sg,s_],i)=>{const q=o.rows?o.rows[i]==null?1:o.rows[i]:1;if(q<=0.01)return;const yy=y+70+i*lh,c2=sg==="-"?D11_RED:sg==="+"?D11_OK:null;withA(ctx,q,()=>{
      if(c2){ctx.fillStyle=rgba(c2,0.13);ctx.fillRect(x+14,yy+2,w-28,lh-4);T(ctx,sg,x+28,yy+lh*0.7,{f:"mono",w:500,size:28,color:rgba(c2,1)});}
      T(ctx,c2?typeOn(s_,clamp(q*1.5-0.3,0,1)):s_,x+56,yy+lh*0.7,{f:"mono",w:500,size:28,color:rgba(c2?mix(c2,INK,0.55):INK,c2?1:0.9)});
      if(sg==="-"&&q>0.6){const sw=tw(ctx,s_.trimStart(),28,500,"mono"),x0=x+56+tw(ctx,s_.length-s_.trimStart().length?" ".repeat(s_.length-s_.trimStart().length):"",28,500,"mono");ctx.strokeStyle=rgba(D11_RED,0.7);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0,yy+lh*0.7-9);ctx.lineTo(x0+sw*clamp((q-0.6)/0.4,0,1),yy+lh*0.7-9);ctx.stroke();}});});});return h;}

/* ---------- day one, again ---------- */
// Zofia's badge, on its lanyard, as Tomás's was on his first day
function d11_badge(ctx,x,y,s,o){o=o||{};withA(ctx,o.a==null?1:o.a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(o.rot||-0.06);ctx.strokeStyle=rgba(TECH,0.7);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-40*s,-150*s);ctx.lineTo(0,-70*s);ctx.lineTo(40*s,-150*s);ctx.stroke();
  glass(ctx,-90*s,-70*s,180*s,240*s,14*s,CYAN,{glow:14,ea:0.8,fill:"rgba(236,240,246,0.97)"});ctx.fillStyle="rgba(176,120,74,0.9)";rr(ctx,-50*s,-36*s,100*s,100*s,50*s);ctx.fill();
  T(ctx,"ZOFIA NOWAK",0,96*s,{w:800,size:17*s,align:"center",color:"rgba(30,34,44,1)",deco:1});T(ctx,"Data engineer",0,122*s,{w:600,size:14*s,align:"center",color:"rgba(70,76,90,1)",deco:1});
  ctx.fillStyle="rgba(60,170,150,0.9)";ctx.fillRect(-90*s,142*s,180*s,14*s);ctx.restore();});}
// a page of acronyms, the organisation's language
function d11_acr(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const ink=[44,38,32];withA(ctx,a,()=>{kt_paper(ctx,x,y,w,h,t,{seed:15,curl:0.4});
  T(ctx,"Acronyms",x+28,y+46,{w:800,size:30,color:rgba(ink,1)});ctx.fillStyle=rgba(ink,0.25);ctx.fillRect(x+26,y+64,w-52,1.4);
  ["AMI","CIS","OMS","MDM","RAB","DUoS","SCADA","GIS"].forEach((s_,i)=>T(ctx,s_,x+30+(i>>2)*(w/2-10),y+106+(i&3)*40,{f:"mono",w:500,size:28,color:rgba(ink,0.95)}));});}
// the list of systems, scrolling, with how many there are
const D11_SYS=["OMS · outages","CIS · customers","SCADA · network control","GIS · network map","AMI head-end · meters","MDM · meter data","Billing","ERP · finance","EAM · assets","Field mobility","Data platform","HR · payroll"];
function d11_sys(ctx,x,y,w,h,o){o=o||{};withA(ctx,o.a==null?1:o.a,()=>{glass(ctx,x,y,w,h,14,[170,205,255],{glow:12,ea:0.7,fill:"rgba(6,10,20,0.95)"});T(ctx,"systems",x+20,y+42,{f:"mono",w:500,size:28,color:"rgba(170,205,255,1)"});
  T(ctx,(o.count==null?138:o.count)+"",x+w-20,y+46,{w:800,size:38,align:"right",color:rgba(INK,1)});ctx.save();ctx.beginPath();ctx.rect(x+10,y+62,w-20,h-72);ctx.clip();const sc=(o.scroll||0)*30,rh=30;
  for(let i=0;i<Math.ceil((h-58)/rh)+2;i++){const k=Math.floor(sc/rh)+i,yy=y+72+i*rh-(sc%rh);T(ctx,D11_SYS[k%D11_SYS.length],x+22,yy+14,{f:"mono",w:500,size:16,color:rgba(SOFT,0.95),deco:1});}ctx.restore();});}
// Zofia asks the agent; back come an owner and two rules, each with its reason and a link to check it
function d11_chat(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,KT_AI,{glow:12,ea:0.7,fill:"rgba(6,12,20,0.95)"});
  kt_agent(ctx,x+40,y+42,15,t,{busy:o.busy||0});T(ctx,"map agent",x+70,y+52,{f:"mono",w:500,size:28,color:rgba(KT_AI,1)});ctx.fillStyle="rgba(130,230,215,0.16)";ctx.fillRect(x+16,y+76,w-32,1.2);
  const q=o.q||0;if(q>0.01)withA(ctx,clamp(q*3,0,1),()=>{const bx=x+w-640-24,by=y+96;glass(ctx,bx,by,640,112,16,TECH,{glow:10,ea:0.7,fill:"rgba(10,18,30,0.96)"});
    T(ctx,"Zofia",bx+24,by+36,{w:800,size:28,color:rgba(TECH,1)});const L=["Who owns the readings data,","and which rules does it keep?"],n=Math.round(clamp(q,0,1)*(L[0].length+L[1].length));
    T(ctx,L[0].slice(0,Math.min(n,L[0].length)),bx+24,by+72,{w:700,size:28,color:rgba(INK,0.96)});if(n>L[0].length)T(ctx,L[1].slice(0,n-L[0].length),bx+24,by+104,{w:700,size:28,color:rgba(INK,0.96)});});
  if(o.dots>0.01&&o.dots<1)withA(ctx,1,()=>{for(let i=0;i<3;i++){ctx.fillStyle=rgba(KT_AI,0.4+0.6*Math.max(0,Math.sin(t*6-i*0.9)));ctx.beginPath();ctx.arc(x+50+i*22,y+262,6,0,TAU);ctx.fill();}});
  const R=o.rows||[0,0,0],ay=y+244;
  if(R[0]>0.01)withA(ctx,R[0],()=>{archGlyph(ctx,"actor",x+46,ay+4,14,TRUST);T(ctx,"Grace Achieng",x+76,ay+14,{w:800,size:30,color:rgba(TRUST,1)});T(ctx,"owner · network operations",x+76+tw(ctx,"Grace Achieng",30,800)+18,ay+14,{w:700,size:28,color:rgba(SOFT,1)});});
  [["RUL-020","every reading is marked actual or estimated","the metering rules, 7.2"],["RUL-021","estimate replaced by actual","the metering rules, 7.4"]].forEach(([id,nm,src],i)=>{const q_=R[i+1]||0;if(q_<=0.01)return;const yy=ay+82+i*104;withA(ctx,q_,()=>{
    d11_glyph(ctx,"requirement",x+46,yy-8,13,D11_RULE);T(ctx,id,x+76,yy,{f:"mono",w:500,size:28,color:rgba(SOFT,0.95)});T(ctx,nm,x+76+tw(ctx,id,28,500,"mono")+16,yy,{w:800,size:30,color:rgba(mix(D11_RULE,INK,0.4),1)});
    T(ctx,"reason:",x+76,yy+44,{w:700,size:28,color:rgba(SOFT,1)});const lx=x+76+tw(ctx,"reason: ",28,700),sw=tw(ctx,src,28,700),u=o.ul||0;T(ctx,src,lx,yy+44,{w:700,size:28,color:rgba(mix(INK,KT_AI,u),1)});
    if(u>0.01){ctx.fillStyle=rgba(KT_AI,0.9);ctx.fillRect(lx,yy+51,sw*u,2.2);withA(ctx,u,()=>{ctx.save();ctx.strokeStyle=rgba(KT_AI,1);ctx.lineWidth=2.4;ctx.lineCap="round";const ex=lx+sw+22,ey=yy+32;ctx.beginPath();ctx.moveTo(ex-8,ey+8);ctx.lineTo(ex+6,ey-6);ctx.moveTo(ex-3,ey-6);ctx.lineTo(ex+6,ey-6);ctx.lineTo(ex+6,ey+3);ctx.stroke();ctx.restore();});}});});});}
