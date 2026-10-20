/* ===== When strategy moves: the film's own pictures (prefixed d10_) =====
   Kenya, 2007: a sketch map of Kenya and its neighbours (the coast, Lake Victoria, Lake Turkana, the Rift Valley's lakes, the
   highlands and Mount Kenya, and the road west from Nairobi), with no borders drawn (PLAYBOOK §2); a bus carrying a man's wages
   upcountry, and the notes that don't arrive; a phone of the time, held in a hand, with its short menu and the text message that
   confirms the money; an agent's counter, from above, with the agent's ledger, the cash and the hands that exchange it; and the
   network's strategy, a sentence on a note, walked down six layers to that counter.
   Then the utility: the direction from its owner; the map's six layers, walked down from a new driver to the technology, each
   element the change touches lit with its owner's tag; the agency and the agreement that asks it for the least; the wall between
   the network and retail, and Tomás's first draft that crossed it; a decision record; rules with homes; a catalogue page with a
   column mask; a household's bill with its new line, the letter and the call centre's answer; the tenants an automatic match
   misses; a data product's new column, its contract still at version 1, and its readers found through lineage; the path in plateaus; and the page
   the minister's office reads in the morning.
   In Kenya, people are icons on the map, as on any map; up close, the story is told by hands, a phone, the cash and a ledger. */

const MOT=LAY6[0][1],STR=LAY6[1][1],BUS=LAY6[2][1],INF=LAY6[3][1],APL=LAY6[4][1],TEC=LAY6[5][1];
// the two sides of the wall, as in Who does it: the network in blue, retail in rose; red, for what stops; the path's pink, as in
// Today, and where it's going; and the phones' signal
const D10_NET=[132,176,255],D10_RET=[255,150,186],D10_RED=[232,96,84],D10_MIG=[248,184,226],D10_SIG=[150,222,255],D10_CASH=[196,170,132];
// someone standing at the right of the frame, drawn facing the other way: the "explain" gesture then points at what they explain
function d10_personR(ctx,id,x,y,s,o){ctx.save();ctx.translate(x,0);ctx.scale(-1,1);ctx.translate(-x,0);person(ctx,id,x,y,s,o);ctx.restore();}
// no-break spaces: words a note should keep on one line
const d10_nb=s=>s.replace(/ /g,"\u00a0");
// a tag that ends at x (its right edge) instead of starting there
const d10_tagR=(ctx,x,y,s,col,sz)=>tag(ctx,x-(tw(ctx,s,sz||28,700)+26),y,s,col,{size:sz||28});
// a tag, as the series draws one, that can also be texture (o.deco: drawn small, from afar, and not meant to be read there)
function d10_tag(ctx,x,y,s,c,o){o=o||{};const ts=o.size||28,w=tw(ctx,s,ts,700)+26,h=ts+16,X=o.align==="center"?x-w/2:o.align==="right"?x-w:x;
  glass(ctx,X,y-h/2,w,h,h/2,c,{fill:"rgba(7,12,24,0.88)",glow:10,ea:0.8});T(ctx,s,X+13,y+ts*0.36,{w:700,size:ts,color:rgba(c,1),deco:o.deco});}
// where an eased move reaches v (0..1): its time, from 0 to 1 (for things that happen when a moving thing passes a point)
function d10_inv(f,v){let a=0,b=1;for(let i=0;i<24;i++){const m=(a+b)/2;if(f(m)<v)a=m;else b=m;}return(a+b)/2;}

/* ---------- Kenya, from above ---------- */
// Longitude and latitude, projected simply (a sketch, not a survey): 110 px to a degree, centred on Kenya. Kenya lies across the
// equator, so a degree of longitude is drawn as long as a degree of latitude.
const D10_S=110,d10_pr=([lo,la])=>[960+(lo-37.9)*D10_S,540-(la-0.2)*D10_S];
// the coast of the Indian Ocean, north to south: Somalia's, from beyond Mogadishu, then Kenya's, from Ras Kamboni to Vanga, then
// Tanzania's, past Tanga
const D10_COAST=[[47.9,5.6],[47.0,3.9],[46.3,3.0],[45.7,2.4],[45.34,2.04],[44.77,1.71],[44.3,1.35],[44.06,1.11],[43.5,0.65],[43.0,0.15],[42.54,-0.36],[42.2,-0.75],[41.9,-1.15],
  [41.56,-1.65],[41.48,-1.75],[41.3,-1.97],[41.05,-2.15],[40.9,-2.27],[40.7,-2.4],[40.53,-2.53],[40.25,-2.75],[40.18,-3.0],[40.12,-3.22],[40.02,-3.36],[39.85,-3.63],[39.75,-3.95],[39.67,-4.05],
  [39.58,-4.3],[39.38,-4.65],[39.22,-4.66],[39.1,-5.07],[38.98,-5.43],[38.85,-6.4]].map(d10_pr);
const D10_SEA=D10_COAST.concat([[56,-6.4],[56,5.6]].map(d10_pr));
// Lake Victoria, round from Kenya's shore: the Winam Gulf to Kisumu and back, south past Musoma and Mwanza, up the west shore past
// Bukoba, and along the north shore past Entebbe and Jinja
const D10_VIC=[[33.97,0.1],[34.05,-0.12],[34.3,-0.1],[34.55,-0.12],[34.75,-0.09],[34.72,-0.22],[34.64,-0.36],[34.46,-0.53],[34.2,-0.42],[34.1,-0.6],[34.15,-0.85],[34.05,-1.05],[33.8,-1.5],
  [33.6,-1.95],[33.4,-2.1],[33.0,-2.3],[32.9,-2.5],[32.5,-2.62],[32.0,-2.6],[31.7,-2.2],[31.65,-1.6],[31.82,-1.33],[31.75,-0.9],[31.85,-0.4],[32.1,-0.1],[32.45,0.05],[32.75,0.3],[33.2,0.43],
  [33.5,0.3],[33.75,0.25]].map(d10_pr);
const D10_TURK=[[35.95,4.6],[35.85,4.3],[35.92,3.9],[36.0,3.6],[36.1,3.25],[36.22,2.9],[36.45,2.55],[36.62,2.42],[36.72,2.55],[36.6,2.9],[36.42,3.3],[36.3,3.7],[36.22,4.1],[36.18,4.45],[36.1,4.65]].map(d10_pr);
// the Rift Valley's small lakes, north to south: Baringo, Bogoria, Nakuru, Naivasha, Magadi and Natron ([lon, lat, radius in degrees])
const D10_RLAKES=[[36.08,0.63,0.09],[36.1,0.25,0.045],[36.08,-0.36,0.05],[36.35,-0.77,0.075],[36.27,-1.9,0.06],[36.0,-2.4,0.11]];
// the Rift's walls, as lines of relief, and the highlands either side of it; Mount Kenya and Kilimanjaro, with snow on their tops
const D10_RIFT=[[[35.55,2.4],[35.62,1.6],[35.6,0.9],[35.62,0.3],[35.7,-0.2],[35.85,-0.9],[35.95,-1.6],[35.9,-2.4]],[[36.55,2.2],[36.45,1.4],[36.4,0.7],[36.45,0.1],[36.55,-0.5],[36.6,-1.1],[36.55,-1.8],[36.4,-2.5]]].map(L=>L.map(d10_pr));
const D10_PEAKS=[[37.31,-0.15,0.42],[37.35,-3.07,0.5],[36.7,-0.4,0.3],[35.4,1.1,0.26],[34.55,1.13,0.3]];
// lights: Nairobi; the towns on the road west; the town upcountry where the man's family lives (unnamed, as the story is a
// composite); and other towns, near and over the borders, which are not drawn
const D10_NAI=d10_pr([36.82,-1.29]),D10_UP=d10_pr([34.75,0.28]);
const D10_TOWNS=[[39.67,-4.05,1.1],[34.76,-0.09,0.9],[36.07,-0.3,0.8],[35.27,0.52,0.8],[37.07,-1.03,0.6],[37.26,-1.52,0.5],[36.95,-0.42,0.5],[37.65,0.05,0.5],[34.77,-0.68,0.5],[39.65,-0.45,0.4],
  [40.9,-2.27,0.4],[40.12,-3.22,0.5],[32.58,0.35,0.9],[36.68,-3.37,0.6],[37.34,-3.35,0.5],[35.29,-0.37,0.5],[36.43,-0.72,0.5],[38.0,3.5,0.3],[39.05,3.52,0.3],[40.06,1.75,0.3],[37.6,2.3,0.3],[45.34,2.04,0.6]];
// the road west, from Nairobi up to the town upcountry, through Naivasha, Nakuru, Kericho and Kisumu
const D10_ROAD=[[36.82,-1.29],[36.62,-1.06],[36.43,-0.72],[36.22,-0.47],[36.07,-0.3],[35.7,-0.24],[35.29,-0.37],[35.0,-0.24],[34.76,-0.09],[34.74,0.1],[34.75,0.28]].map(d10_pr);
const D10_RL=(()=>{const L=[0];for(let i=1;i<D10_ROAD.length;i++)L.push(L[i-1]+Math.hypot(D10_ROAD[i][0]-D10_ROAD[i-1][0],D10_ROAD[i][1]-D10_ROAD[i-1][1]));return L;})();
// a point along the road (u, 0..1, from Nairobi), with its heading
function d10_roadAt(u){const L=D10_RL,s=L[L.length-1]*clamp(u,0,1);let i=1;while(i<L.length-1&&L[i]<s)i++;const a=D10_ROAD[i-1],b=D10_ROAD[i],f=clamp((s-L[i-1])/((L[i]-L[i-1])||1),0,1);
  return{x:lerp(a[0],b[0],f),y:lerp(a[1],b[1],f),an:Math.atan2(b[1]-a[1],b[0]-a[0])};}
// the camera over the map: keys are [time, x, y, zoom, seconds]; zoom glides at an even pace, in log space, and the centre follows it
function d10_camAt(t,keys){let x=keys[0][1],y=keys[0][2],z=keys[0][3];for(let i=1;i<keys.length;i++){const k=keys[i],u=easeCam(clamp((t-k[0])/(k[4]||1.6),0,1));if(u<=0)break;
    const z1=Math.exp(lerp(Math.log(z),Math.log(k[3]),u)),w=Math.abs(k[3]-z)<1e-3?u:(1/z-1/z1)/(1/z-1/k[3]);x=lerp(x,k[1],w);y=lerp(y,k[2],w);z=z1;}return{x,y,z};}
const d10_camApply=(ctx,c)=>{ctx.translate(960,540);ctx.scale(c.z,c.z);ctx.translate(-c.x,-c.y);};
const d10_toS=(c,x,y)=>[960+(x-c.x)*c.z,540+(y-c.y)*c.z];
// a closed outline through the midpoints of L's sides, curving at its corners
function d10_smooth(ctx,L,open){const n=L.length,m=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];ctx.beginPath();
  if(open){ctx.moveTo(L[0][0],L[0][1]);for(let i=1;i<n-1;i++){const q=m(L[i],L[i+1]);ctx.quadraticCurveTo(L[i][0],L[i][1],q[0],q[1]);}ctx.lineTo(L[n-1][0],L[n-1][1]);return;}
  const p=m(L[n-1],L[0]);ctx.moveTo(p[0],p[1]);for(let i=0;i<n;i++){const q=m(L[i],L[(i+1)%n]);ctx.quadraticCurveTo(L[i][0],L[i][1],q[0],q[1]);}ctx.closePath();}
// a name on the map, with a dark halo so it reads over land and water; drawn at its size on screen, whatever the camera's zoom
function d10_name(ctx,c,s,x,y,sz,col,a,al){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.95)";ctx.shadowBlur=10/c.z;T(ctx,s,x,y,{w:800,size:sz/c.z,align:al||"center",color:col||"rgba(255,244,226,0.98)"});ctx.restore();});}

// The map, in the camera's transform (c, from d10_camAt; lines keep their width on screen). o.dim (0..1) darkens it behind
// what's drawn over it; o.labs: the region's names; o.road (0..1): the road drawn from Nairobi; o.lights (0..1): towns lit at dusk;
// o.many (0..1): phones in use everywhere, years later
function d10_map(ctx,t,c,o){o=o||{};const z=c.z,k=1/z;ctx.save();
  // the land: dry country in the north and east, greener in the highlands and the west, by the lake
  const x0=c.x-1000*k,x1=c.x+1000*k,y0=c.y-600*k,y1=c.y+600*k;let g=ctx.createLinearGradient(0,d10_pr([0,5])[1],0,d10_pr([0,-5])[1]);g.addColorStop(0,"#5a4630");g.addColorStop(0.55,"#4d4a32");g.addColorStop(1,"#3f4a34");
  ctx.fillStyle=g;ctx.fillRect(x0,y0,x1-x0,y1-y0);
  [[[35.4,0.0],2.6,[64,92,52],0.55],[[37.0,-0.6],1.6,[70,98,56],0.5],[[34.6,0.4],1.4,[66,104,56],0.5],[[39.4,-3.6],0.9,[60,96,58],0.4],[[39.5,2.6],3.4,[118,92,58],0.35]].forEach(([q,r,col,a])=>{const[x,y]=d10_pr(q),R=r*D10_S;
    const rg=ctx.createRadialGradient(x,y,0,x,y,R);rg.addColorStop(0,rgba(col,a));rg.addColorStop(1,rgba(col,0));ctx.fillStyle=rg;ctx.fillRect(x-R,y-R,2*R,2*R);});
  // the highlands and their peaks: soft relief, lit from the west by the evening sun, with snow on the two highest
  D10_PEAKS.forEach(([lo,la,r],i)=>{const[x,y]=d10_pr([lo,la]),R=r*D10_S;const rg=ctx.createRadialGradient(x-R*0.25,y-R*0.25,0,x,y,R);rg.addColorStop(0,"rgba(170,150,110,0.38)");rg.addColorStop(0.5,"rgba(110,100,72,0.18)");rg.addColorStop(1,"rgba(40,40,30,0)");
    ctx.fillStyle=rg;ctx.beginPath();ctx.arc(x,y,R,0,TAU);ctx.fill();if(i<2){ctx.fillStyle="rgba(240,244,250,0.85)";ctx.beginPath();ctx.ellipse(x,y,R*0.08,R*0.06,0,0,TAU);ctx.fill();}});
  // the Rift: its floor a little darker, and its walls drawn as maps draw an escarpment, with short hachures down the slope (the
  // western wall faces away from the evening sun, the eastern catches it)
  ctx.save();ctx.beginPath();D10_RIFT[0].forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));D10_RIFT[1].slice().reverse().forEach(([x,y])=>ctx.lineTo(x,y));ctx.closePath();ctx.fillStyle="rgba(22,18,10,0.14)";ctx.fill();
  ctx.lineCap="round";ctx.lineJoin="round";D10_RIFT.forEach((L,wi)=>{const dir=wi?-1:1;ctx.fillStyle=wi?"rgba(214,194,146,0.2)":"rgba(26,20,12,0.32)";ctx.beginPath();
    for(let i=1;i<L.length;i++){const a=L[i-1],b=L[i],d=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(1,Math.round(d/9)),ux=(b[0]-a[0])/d,uy=(b[1]-a[1])/d;
      for(let j=0;j<n;j++){const f=(j+0.5*hash(i*17+j,1051))/n,qx=lerp(a[0],b[0],f),qy=lerp(a[1],b[1],f),len=4+5*hash(i*31+j,1050),hw=1.6*k+0.8;
        ctx.moveTo(qx-ux*hw,qy-uy*hw);ctx.lineTo(qx+ux*hw,qy+uy*hw);ctx.lineTo(qx+uy*dir*len,qy-ux*dir*len);ctx.closePath();}}ctx.fill();
    ctx.strokeStyle=wi?"rgba(214,194,146,0.22)":"rgba(26,20,12,0.3)";ctx.lineWidth=2.2*k;d10_smooth(ctx,L,1);ctx.stroke();});ctx.restore();
  // the sea and the lakes: deep water with a little swell, and a pale line of shore
  const water=(L,smooth)=>{ctx.save();smooth?d10_smooth(ctx,L):(ctx.beginPath(),L.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y)),ctx.closePath());
    const wg=ctx.createLinearGradient(0,y0,0,y1);wg.addColorStop(0,"#16304a");wg.addColorStop(1,"#0f2338");ctx.fillStyle=wg;ctx.fill();ctx.clip();
    ctx.strokeStyle="rgba(170,206,236,0.07)";ctx.lineWidth=1.4*k;for(let yy=Math.floor(y0/(30*k))*30*k;yy<=y1;yy+=30*k){ctx.beginPath();for(let xx=x0;xx<=x1;xx+=40*k){const w_=yy+Math.sin(xx*0.012*z+yy*0.05+t*0.4)*3*k;xx===x0?ctx.moveTo(xx,w_):ctx.lineTo(xx,w_);}ctx.stroke();}
    ctx.restore();ctx.save();smooth?d10_smooth(ctx,L):(ctx.beginPath(),L.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y)),ctx.closePath());ctx.strokeStyle="rgba(226,206,164,0.55)";ctx.lineWidth=2*k;ctx.stroke();ctx.restore();};
  water(D10_SEA,false);water(D10_VIC,true);water(D10_TURK,true);
  D10_RLAKES.forEach(([lo,la,r])=>{const[x,y]=d10_pr([lo,la]);ctx.fillStyle="#1b3a56";ctx.beginPath();ctx.ellipse(x,y,r*D10_S*0.7,r*D10_S,0,0,TAU);ctx.fill();ctx.strokeStyle="rgba(226,206,164,0.5)";ctx.lineWidth=1.4*k;ctx.stroke();});
  // the road west
  const rp=o.road||0;if(rp>0.01){ctx.save();ctx.strokeStyle="rgba(236,214,170,0.55)";ctx.lineWidth=2.6*k;ctx.setLineDash([10*k,7*k]);ctx.lineCap="round";ctx.beginPath();const e=d10_roadAt(rp);
    let i=0;ctx.moveTo(D10_ROAD[0][0],D10_ROAD[0][1]);while(i+1<D10_ROAD.length&&D10_RL[i+1]<=D10_RL[D10_RL.length-1]*rp){i++;ctx.lineTo(D10_ROAD[i][0],D10_ROAD[i][1]);}ctx.lineTo(e.x,e.y);ctx.stroke();ctx.restore();}
  // towns at dusk, and, years later, phones everywhere
  const li=o.lights==null?1:o.lights,sy=Math.pow(z,-0.55);D10_TOWNS.forEach(([lo,la,s],i)=>{const[x,y]=d10_pr([lo,la]),tw_=0.75+0.25*Math.sin(t*1.3+i*2.1);glow(ctx,x,y,(10+14*s)*sy,[255,214,150],0.5*li*tw_);
    ctx.fillStyle=rgba([255,236,200],0.9*li);ctx.beginPath();ctx.arc(x,y,(1.6+1.6*s)*sy,0,TAU);ctx.fill();});
  const mn=o.many||0;if(mn>0.01)for(let i=0;i<260;i++){const q=clamp(mn*1.6-hash(i,1003)*0.6,0,1);if(q<=0)continue;const lo=33.9+hash(i,1001)*7.6,la=-4.4+hash(i,1002)*9.2;
    // most of Kenya's people live in the south and west, so most of the phones are there, and few in the dry north
    if(hash(i,1004)>(la>1.2?0.12:lo>39.2?0.3:0.95))continue;const[x,y]=d10_pr([lo,la]);if(x>D10_COASTX(y))continue;glow(ctx,x,y,7*sy,D10_SIG,0.55*q);ctx.fillStyle=rgba([220,246,255],0.85*q);ctx.beginPath();ctx.arc(x,y,1.5*sy,0,TAU);ctx.fill();}
  // Nairobi and the town upcountry, brighter
  const nb=o.city==null?1:o.city;glow(ctx,D10_NAI[0],D10_NAI[1],40*sy,[255,206,140],0.75*nb);ctx.fillStyle=rgba([255,244,220],nb);ctx.beginPath();ctx.arc(D10_NAI[0],D10_NAI[1],4.5*sy,0,TAU);ctx.fill();
  glow(ctx,D10_UP[0],D10_UP[1],24*sy,[255,214,150],0.6*nb);ctx.fillStyle=rgba([255,244,220],nb);ctx.beginPath();ctx.arc(D10_UP[0],D10_UP[1],3.4*sy,0,TAU);ctx.fill();
  // the region's names, from afar
  const la=o.labs||0;if(la>0.01){d10_name(ctx,c,"Kenya",...d10_pr([38.3,1.5]),46,"rgba(244,232,206,0.95)",la);d10_name(ctx,c,"Indian Ocean",...d10_pr([42.6,-3.0]),32,"rgba(176,210,236,0.9)",la);
    d10_name(ctx,c,"Lake Victoria",...d10_pr([32.9,-1.25]),30,"rgba(176,210,236,0.9)",la);}
  if(o.dim)withA(ctx,o.dim,()=>{ctx.fillStyle="rgba(4,6,12,1)";ctx.fillRect(x0,y0,x1-x0,y1-y0);});
  ctx.restore();}
// where the sea begins, at the height y (so phones aren't drawn in the sea)
function D10_COASTX(y){for(let i=1;i<D10_COAST.length;i++){const a=D10_COAST[i-1],b=D10_COAST[i];if((y-a[1])*(y-b[1])<=0){const f=(y-a[1])/((b[1]-a[1])||1);return lerp(a[0],b[0],f);}}return 1e9;}

// a bus, from above, as a map draws one: long and pale, with a stripe along it, windows down both sides and luggage on the roof
// rack. an: its heading; s: its length
function d10_bus(ctx,x,y,an,s,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(an);
  ctx.fillStyle="rgba(0,0,0,0.35)";rr(ctx,-s*0.5+s*0.04,-s*0.15+s*0.05,s,s*0.3,s*0.06);ctx.fill();
  const g=ctx.createLinearGradient(0,-s*0.15,0,s*0.15);g.addColorStop(0,"#efe8d8");g.addColorStop(1,"#b9b0a0");ctx.fillStyle=g;rr(ctx,-s*0.5,-s*0.15,s,s*0.3,s*0.07);ctx.fill();
  ctx.fillStyle="#6e8fb6";ctx.fillRect(-s*0.5,-s*0.035,s,s*0.07);ctx.fillStyle="rgba(40,52,70,0.85)";rr(ctx,s*0.4,-s*0.12,s*0.07,s*0.24,s*0.03);ctx.fill();
  ctx.strokeStyle="rgba(60,56,50,0.7)";ctx.lineWidth=Math.max(0.6,s*0.012);for(let i=0;i<7;i++){const xx=-s*0.36+i*s*0.1;ctx.beginPath();ctx.moveTo(xx,-s*0.15);ctx.lineTo(xx,s*0.15);ctx.stroke();}
  [[-0.3,-0.06,0.14,0.08,"#8a6a4a"],[-0.12,0.02,0.12,0.09,"#5d6d4f"],[0.06,-0.07,0.1,0.07,"#9a5a44"],[0.18,0.01,0.1,0.08,"#7a7466"]].forEach(([u,v,w_,h_,col])=>{ctx.fillStyle=col;rr(ctx,s*u,s*v,s*w_,s*h_,s*0.02);ctx.fill();});
  ctx.restore();});}
// money in an envelope, small, on the map: what the man sends
function d10_envelope(ctx,x,y,s,a,col){if(a<=0.01)return;withA(ctx,a,()=>{glow(ctx,x,y,s*1.6,col||[255,224,160],0.45);ctx.save();ctx.translate(x,y);ctx.fillStyle="#efe3c8";rr(ctx,-s*0.6,-s*0.4,s*1.2,s*0.8,s*0.08);ctx.fill();
  ctx.strokeStyle="rgba(120,96,60,0.9)";ctx.lineWidth=Math.max(0.8,s*0.06);ctx.beginPath();ctx.moveTo(-s*0.6,-s*0.4);ctx.lineTo(0,s*0.06);ctx.lineTo(s*0.6,-s*0.4);ctx.stroke();ctx.restore();});}
// a bank note, in no country's design: a soft colour, a pale oval where a portrait would be, and a few lines (s: its length)
function d10_note(ctx,x,y,an,s,col,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(an);ctx.shadowColor="rgba(0,0,0,0.35)";ctx.shadowBlur=s*0.12;ctx.shadowOffsetY=s*0.04;
  const g=ctx.createLinearGradient(-s/2,0,s/2,0);g.addColorStop(0,rgba(mix(col,[255,255,255],0.18),1));g.addColorStop(1,rgba(mix(col,[40,30,20],0.18),1));ctx.fillStyle=g;ctx.fillRect(-s/2,-s*0.24,s,s*0.48);ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  ctx.strokeStyle=rgba(mix(col,[30,24,16],0.45),0.7);ctx.lineWidth=Math.max(0.6,s*0.015);ctx.strokeRect(-s/2+s*0.04,-s*0.2,s*0.92,s*0.4);ctx.fillStyle=rgba(mix(col,[255,250,236],0.55),0.8);ctx.beginPath();ctx.ellipse(s*0.22,0,s*0.12,s*0.14,0,0,TAU);ctx.fill();
  ctx.beginPath();for(let k=0;k<3;k++){ctx.moveTo(-s*0.36,-s*0.08+k*s*0.08);ctx.lineTo(-s*0.02,-s*0.08+k*s*0.08);}ctx.stroke();ctx.restore();});}

/* ---------- up close: a phone of the time, held in a hand ---------- */
// A hand holding a phone of 2007, close up, at about the size a hand is beside a phone: a small, sturdy handset with a backlit
// screen and a keypad, cradled in a left hand whose palm shows either side of it and whose wrist goes down out of the frame; the
// thumb rests on the front, by the keys, and four fingers curl round the right edge. o.lines: what the screen shows (o.hi: the line
// picked, lit), o.title: a line above them; o.clock: the time, large, on a phone at rest; o.env: an envelope on the screen, for a
// message that has arrived; o.skin: the hand's colour; o.sleeve: the cuff's; o.lab: the panel's name; o.bg: the light behind (a
// room in town, or outside upcountry)
function d10_phone(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x-8,y-8,w+16,h+16,22,D10_SIG,{glow:18,ea:0.75,fill:"rgba(8,12,24,0.95)"});
  ctx.save();rr(ctx,x,y,w,h,16);ctx.clip();ctx.translate(x,y);
  // behind: a warm room in town in the evening, or the light outside a shop upcountry, out of focus
  let g=ctx.createLinearGradient(0,0,0,h);if(o.bg==="out"){g.addColorStop(0,"#8a9cb4");g.addColorStop(0.6,"#c8a88a");g.addColorStop(1,"#6a5440");}else{g.addColorStop(0,"#3a2e2a");g.addColorStop(0.6,"#5a4232");g.addColorStop(1,"#2a1e18");}ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  for(let i=0;i<7;i++){const bx=w*hash(i,1010),by=h*(0.15+0.45*hash(i,1011)),br=30+50*hash(i,1012);const rg=ctx.createRadialGradient(bx,by,0,bx,by,br);rg.addColorStop(0,o.bg==="out"?"rgba(255,240,210,0.18)":"rgba(255,200,130,0.22)");rg.addColorStop(1,"rgba(255,200,130,0)");ctx.fillStyle=rg;ctx.fillRect(bx-br,by-br,2*br,2*br);}
  const pw=300,ph=520,px=w*0.5,py=h*0.42+Math.sin(t*1.1)*3;ctx.save();ctx.translate(px,py);ctx.rotate(-0.05+Math.sin(t*0.7)*0.008);
  const skin=o.skin||[112,72,50],skL=mix(skin,[255,226,196],0.26),skD=mix(skin,[20,10,6],0.36),lit=(x0,y0,x1,y1)=>{const q=ctx.createLinearGradient(x0,y0,x1,y1);q.addColorStop(0,rgba(skL,1));q.addColorStop(0.5,rgba(skin,1));q.addColorStop(1,rgba(skD,1));return q;};
  const edge=(al)=>{ctx.strokeStyle=rgba(skD,al==null?0.55:al);ctx.lineWidth=1.6;ctx.stroke();};
  // the forearm, going down out of the frame, and the cuff of a sleeve
  ctx.fillStyle=lit(-170,0,210,0);ctx.beginPath();ctx.moveTo(-170,ph*0.36);ctx.bezierCurveTo(-160,ph*0.62,-140,ph*0.85,-130,ph*1.3);ctx.lineTo(200,ph*1.3);ctx.bezierCurveTo(212,ph*0.85,222,ph*0.6,214,ph*0.34);ctx.closePath();ctx.fill();
  const sl=o.sleeve||[70,92,120];ctx.fillStyle=lit(-170,0,210,0);ctx.fillStyle=rgba(sl,1);ctx.beginPath();ctx.moveTo(-150,ph*0.84);ctx.quadraticCurveTo(30,ph*0.78,206,ph*0.82);ctx.lineTo(214,ph*1.3);ctx.lineTo(-150,ph*1.3);ctx.closePath();ctx.fill();
  ctx.strokeStyle=rgba(mix(sl,[0,0,0],0.4),0.8);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-150,ph*0.84);ctx.quadraticCurveTo(30,ph*0.78,206,ph*0.82);ctx.stroke();
  // the palm, behind the phone and wider than it: the heel of the thumb on the left, the little finger's side on the right
  ctx.save();ctx.shadowColor="rgba(0,0,0,0.35)";ctx.shadowBlur=24;ctx.shadowOffsetY=10;ctx.fillStyle=lit(-260,-60,250,ph*0.6);ctx.beginPath();ctx.moveTo(-pw*0.56,-ph*0.06);
  ctx.bezierCurveTo(-pw*0.84,ph*0.08,-pw*0.92,ph*0.4,-pw*0.6,ph*0.58);ctx.bezierCurveTo(-pw*0.24,ph*0.74,pw*0.42,ph*0.72,pw*0.64,ph*0.5);ctx.bezierCurveTo(pw*0.78,ph*0.3,pw*0.74,ph*0.02,pw*0.6,-ph*0.14);ctx.closePath();ctx.fill();ctx.restore();
  // the phone: a dark body, rounded, a little worn at the edges
  ctx.save();ctx.shadowColor="rgba(0,0,0,0.55)";ctx.shadowBlur=18;ctx.shadowOffsetX=6;ctx.shadowOffsetY=8;g=ctx.createLinearGradient(-pw/2,0,pw/2,0);g.addColorStop(0,"#565b64");g.addColorStop(0.5,"#3a3e46");g.addColorStop(1,"#22252b");ctx.fillStyle=g;
  rr(ctx,-pw/2,-ph/2,pw,ph,46);ctx.fill();ctx.restore();ctx.strokeStyle="rgba(255,255,255,0.16)";ctx.lineWidth=2;rr(ctx,-pw/2+3,-ph/2+3,pw-6,ph-6,44);ctx.stroke();
  ctx.fillStyle="rgba(10,10,12,0.8)";for(let k=0;k<6;k++){rr(ctx,-30+k*11,-ph/2+20,6,3,1.5);ctx.fill();}
  // the screen: backlit, pale blue, with dark text
  const sx=-pw*0.42,sy=-ph/2+42,sw_=pw*0.84,shh=206;ctx.fillStyle="#141619";rr(ctx,sx-6,sy-6,sw_+12,shh+12,10);ctx.fill();g=ctx.createLinearGradient(0,sy,0,sy+shh);g.addColorStop(0,"#d6e6ee");g.addColorStop(1,"#a9c4d2");ctx.fillStyle=g;rr(ctx,sx,sy,sw_,shh,6);ctx.fill();
  glow(ctx,0,sy+shh/2,sw_*0.6,[200,236,255],0.22);
  for(let k=0;k<4;k++){ctx.fillStyle=k<(o.bars==null?4:o.bars)?"rgba(16,26,36,0.95)":"rgba(16,26,36,0.18)";ctx.fillRect(sx+10+k*9,sy+30-k*5,6,6+k*5);}ctx.fillStyle="rgba(16,26,36,0.95)";ctx.fillRect(sx+sw_-32,sy+14,20,10);ctx.fillRect(sx+sw_-12,sy+17,3,4);
  const ink="rgba(14,24,34,0.96)";let ly=sy+76;if(o.title){T(ctx,o.title,sx+14,ly,{f:"mono",w:700,size:28,color:ink});ly+=38;}
  if(o.clock)T(ctx,o.clock,0,sy+shh*0.62,{f:"mono",w:500,size:58,align:"center",color:ink});
  (o.lines||[]).forEach((l,i)=>{const hi=o.hi===i?(o.hiA==null?1:o.hiA):0;if(hi>0.01)withA(ctx,hi,()=>{ctx.fillStyle="rgba(14,24,34,0.92)";ctx.fillRect(sx+6,ly-30,sw_-12,40);});
    T(ctx,l,sx+14,ly,{f:"mono",w:500,size:28,color:hi>0.5?"rgba(214,232,240,1)":ink});ly+=40;});
  if(o.env>0.01)withA(ctx,o.env,()=>{ctx.save();ctx.translate(sx+sw_-40,sy+64);ctx.strokeStyle=ink;ctx.lineWidth=3;ctx.strokeRect(-20,-13,40,26);ctx.beginPath();ctx.moveTo(-20,-13);ctx.lineTo(0,3);ctx.lineTo(20,-13);ctx.stroke();ctx.restore();});
  // keys
  const ky0=sy+shh+30;ctx.fillStyle="#9aa0a8";rr(ctx,-pw*0.36,ky0-10,pw*0.24,20,9);ctx.fill();rr(ctx,pw*0.12,ky0-10,pw*0.24,20,9);ctx.fill();ctx.fillStyle="#c9ced6";rr(ctx,-26,ky0-15,52,30,13);ctx.fill();
  for(let r=0;r<4;r++)for(let c=0;c<3;c++){const kx=-pw*0.3+c*pw*0.3,ky=ky0+46+r*40;ctx.fillStyle="#b7bcc4";rr(ctx,kx-27,ky-13,54,26,11);ctx.fill();T(ctx,["1","2","3","4","5","6","7","8","9","*","0","#"][r*3+c],kx,ky+6,{w:700,size:15,align:"center",color:"rgba(40,44,52,0.85)",deco:1});}
  // four fingers round the right edge, from the index at the top to the little finger: each comes from behind the phone and its
  // tip rests on the front, lit from above
  [[-0.08,30,46],[0.06,31,50],[0.2,29,46],[0.33,25,36]].forEach(([fy,r,over])=>{const yy=ph*fy,x1=pw/2+70,x0=pw/2-over+r;
    ctx.save();ctx.shadowColor="rgba(0,0,0,0.4)";ctx.shadowBlur=10;ctx.shadowOffsetX=-3;ctx.shadowOffsetY=5;ctx.fillStyle=lit(0,yy-r,0,yy+r);ctx.beginPath();ctx.moveTo(x1,yy-r);ctx.lineTo(x0,yy-r*0.94);
    ctx.arc(x0,yy,r*0.94,-Math.PI/2,Math.PI/2,true);ctx.lineTo(x1,yy+r);ctx.closePath();ctx.fill();ctx.restore();ctx.beginPath();ctx.moveTo(x1,yy-r);ctx.lineTo(x0,yy-r*0.94);ctx.arc(x0,yy,r*0.94,-Math.PI/2,Math.PI/2,true);ctx.lineTo(x1,yy+r);edge(0.5);
    ctx.fillStyle=rgba(mix(skL,[255,240,226],0.3),0.35);ctx.beginPath();ctx.ellipse(x0+r*0.5,yy-r*0.45,r*0.9,r*0.22,0,0,TAU);ctx.fill();
    ctx.strokeStyle=rgba(skD,0.4);ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(pw/2+12,yy-r*0.7);ctx.quadraticCurveTo(pw/2+18,yy,pw/2+12,yy+r*0.7);ctx.stroke();});
  // the thumb, on the front, from the heel of the hand to a tip by the keys, with its nail
  ctx.save();ctx.translate(-pw*0.6,ph*0.44);ctx.rotate(-0.8);const TL=196,t0w=46,t1w=34;
  ctx.save();ctx.shadowColor="rgba(0,0,0,0.45)";ctx.shadowBlur=16;ctx.shadowOffsetX=6;ctx.shadowOffsetY=8;ctx.fillStyle=lit(0,-t0w,0,t0w);
  const thumb=()=>{ctx.beginPath();ctx.moveTo(-30,-t0w);ctx.bezierCurveTo(TL*0.35,-t0w*1.04,TL*0.7,-t1w*1.06,TL-t1w,-t1w);ctx.arc(TL-t1w,0,t1w,-Math.PI/2,Math.PI/2,false);ctx.bezierCurveTo(TL*0.7,t1w*1.08,TL*0.35,t0w*1.1,-30,t0w*1.15);ctx.closePath();};
  thumb();ctx.fill();ctx.restore();thumb();edge(0.5);
  ctx.fillStyle=rgba(mix(skL,[255,236,224],0.45),0.75);ctx.beginPath();ctx.ellipse(TL-t1w*0.95,-t1w*0.12,t1w*0.72,t1w*0.56,0,0,TAU);ctx.fill();ctx.strokeStyle=rgba(skD,0.35);ctx.lineWidth=1.2;ctx.stroke();
  ctx.strokeStyle=rgba(skD,0.35);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(TL*0.5,-t1w*0.9);ctx.quadraticCurveTo(TL*0.53,0,TL*0.5,t1w*0.95);ctx.stroke();
  ctx.fillStyle=rgba(skL,0.25);ctx.beginPath();ctx.ellipse(TL*0.45,-t0w*0.55,TL*0.32,t0w*0.18,0,0,TAU);ctx.fill();ctx.restore();
  ctx.restore();ctx.restore();
  if(o.lab)tag(ctx,x+18,y+h-34,o.lab,D10_SIG,{size:28});});}

/* ---------- an agent's counter, from above ---------- */
// A hand, seen from above, its wrist at (0,0) and its fingers pointing up (−y), drawn as a living thing: a palm that widens to the
// knuckles and four fingers held together in one outline (each with its own length and a rounded tip, a notch where they part), and
// a thumb, lit from the upper left, with a soft shadow under it. side: 1 or −1 mirrors it (the thumb on the left, or the right);
// o.palm: palm up, the lighter palm showing; o.curl (0..1) closes the fingers; o.sleeve: the cuff's colour
function d10_hand(ctx,x,y,an,s,skin,side,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(an);ctx.scale(s*side,s);
  const palm=!!o.palm,base=palm?mix(skin,[226,170,138],0.22):skin,skL=mix(base,[255,232,206],0.3),skD=mix(base,[24,12,8],0.32),curl=clamp(o.curl||0,0,1),K=-70;
  const lit=(x0,y0,x1,y1)=>{const g=ctx.createLinearGradient(x0,y0,x1,y1);g.addColorStop(0,rgba(skL,1));g.addColorStop(0.55,rgba(base,1));g.addColorStop(1,rgba(skD,1));return g;};
  // the fingers: [knuckle x, length, half width, angle]; curled, they're drawn shorter, as they bend away from us
  const F=[[-22,60,8.4,-0.06],[-7.2,68,8.6,-0.015],[7.6,63,8.2,0.03],[21.4,49,7.2,0.09]].map(([bx,L,r,ang])=>{const l=L*(1-curl*(palm?0.55:0.45)),d=[Math.sin(ang),-Math.cos(ang)],n=[Math.cos(ang),Math.sin(ang)];
    return{bx,r:r*(1+curl*0.1),ang,d,n,tx:bx+d[0]*l,ty:K+d[1]*l,l};});
  const shape=()=>{ctx.beginPath();ctx.moveTo(-21,0);ctx.bezierCurveTo(-27,-22,-32,-46,-30.5,K+2);
    F.forEach((f,i)=>{ctx.lineTo(f.tx-f.n[0]*f.r,f.ty-f.n[1]*f.r);ctx.arc(f.tx,f.ty,f.r,f.ang-Math.PI,f.ang,false);
      if(i<3){const g=F[i+1],cx=(f.bx+g.bx)/2,cy=K-Math.min(f.l,g.l)*0.3;ctx.lineTo(cx,cy);}});
    const f=F[3];ctx.lineTo(f.bx+f.r*1.2,K+8);ctx.bezierCurveTo(32,-48,29,-20,21,0);ctx.closePath();};
  const thumb=()=>{ctx.save();ctx.translate(-25,-26);ctx.rotate(-0.9+curl*0.38);const TL=50*(1-curl*0.22);ctx.beginPath();ctx.moveTo(-10.5,6);ctx.bezierCurveTo(-11.5,-TL*0.45,-9.5,-TL*0.85,-8,-TL);ctx.arc(0,-TL,8,Math.PI,TAU);
    ctx.bezierCurveTo(9.5,-TL*0.8,11.5,-TL*0.4,10.5,8);ctx.closePath();ctx.restore();};
  // the forearm, and the cuff of a sleeve
  const arm=palm?mix(skin,[226,170,138],0.08):skin,aL=mix(arm,[255,232,206],0.26),aD=mix(arm,[24,12,8],0.32),ag=ctx.createLinearGradient(-30,0,30,0);ag.addColorStop(0,rgba(aL,1));ag.addColorStop(0.55,rgba(arm,1));ag.addColorStop(1,rgba(aD,1));
  ctx.save();ctx.shadowColor="rgba(0,0,0,0.38)";ctx.shadowBlur=14;ctx.shadowOffsetX=6;ctx.shadowOffsetY=8;ctx.fillStyle=ag;ctx.beginPath();ctx.moveTo(-22,0);ctx.bezierCurveTo(-25,60,-29,120,-31,220);ctx.lineTo(31,220);ctx.bezierCurveTo(29,120,25,60,22,0);ctx.closePath();ctx.fill();ctx.restore();
  if(o.sleeve){ctx.fillStyle=rgba(o.sleeve,1);ctx.beginPath();ctx.moveTo(-34,90);ctx.quadraticCurveTo(0,82,34,90);ctx.lineTo(40,230);ctx.lineTo(-40,230);ctx.closePath();ctx.fill();ctx.strokeStyle=rgba(mix(o.sleeve,[0,0,0],0.35),0.8);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-34,90);ctx.quadraticCurveTo(0,82,34,90);ctx.stroke();}
  // the thumb under the hand's edge, then the hand, in one outline, with its shadow
  ctx.save();ctx.shadowColor="rgba(0,0,0,0.38)";ctx.shadowBlur=14;ctx.shadowOffsetX=6;ctx.shadowOffsetY=8;ctx.fillStyle=lit(-36,-60,24,0);thumb();ctx.fill();ctx.fillStyle=lit(-34,K-60,34,0);shape();ctx.fill();ctx.restore();
  thumb();ctx.strokeStyle=rgba(skD,0.5);ctx.lineWidth=1.2;ctx.stroke();shape();ctx.stroke();
  // where the fingers part, below the notches, and their joints
  ctx.strokeStyle=rgba(skD,0.32);ctx.lineWidth=1;for(let i=0;i<3;i++){const f=F[i],g=F[i+1],cx=(f.bx+g.bx)/2,cy=K-Math.min(f.l,g.l)*0.3;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx,K-2);ctx.stroke();}
  F.forEach(f=>{[0.42,0.72].forEach(q=>{const jx=f.bx+f.d[0]*f.l*q,jy=K+f.d[1]*f.l*q;ctx.beginPath();ctx.moveTo(jx-f.n[0]*f.r*0.6,jy-f.n[1]*f.r*0.6);ctx.lineTo(jx+f.n[0]*f.r*0.6,jy+f.n[1]*f.r*0.6);ctx.stroke();});});
  // nails, or the pads of the fingertips; the thumb's too
  F.forEach(f=>{const ex=f.tx-f.d[0]*f.r*0.55,ey=f.ty-f.d[1]*f.r*0.55;ctx.fillStyle=rgba(mix(base,[255,236,220],palm?0.25:0.45),palm?0.4:0.7);ctx.beginPath();ctx.ellipse(ex,ey,f.r*0.62,f.r*(palm?0.7:0.95),f.ang,0,TAU);ctx.fill();});
  if(!palm){ctx.save();ctx.translate(-25,-26);ctx.rotate(-0.9+curl*0.38);ctx.fillStyle=rgba(mix(base,[255,236,220],0.45),0.7);ctx.beginPath();ctx.ellipse(0,-50*(1-curl*0.22)+3,5.2,7,0,0,TAU);ctx.fill();ctx.restore();}
  // the light: knuckles catching it, or the palm's creases
  if(palm){ctx.strokeStyle=rgba(skD,0.38);ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(-26,-54);ctx.quadraticCurveTo(0,-46,28,-60);ctx.moveTo(-27,-38);ctx.quadraticCurveTo(-6,-32,16,-16);ctx.moveTo(-14,-8);ctx.quadraticCurveTo(-20,-30,-28,-44);ctx.stroke();}
  else{ctx.fillStyle=rgba(mix(base,[255,240,226],0.35),0.35);F.forEach(f=>{ctx.beginPath();ctx.ellipse(f.bx,K+1,5.5,3.5,0,0,TAU);ctx.fill();});}
  ctx.restore();});}
// An agent's counter, from above, close up: a wooden counter, the agent's ledger (each customer signs for what they take), the
// agent's phone, a pile of notes, and airtime cards, what the shop sold before it became an agent. The agent's hand rests at the top,
// the customer's at the bottom. o.in (0..1): cash going into mobile money (the customer's notes go to the agent, and the agent's
// phone lights as the money is sent); o.give (0..1): cash out (the agent takes notes from the pile and counts them into the
// customer's palm, which closes round them and draws back); o.lab: the panel's name
function d10_counter(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x-8,y-8,w+16,h+16,22,[255,206,160],{glow:18,ea:0.75,fill:"rgba(12,10,8,0.95)"});
  ctx.save();rr(ctx,x,y,w,h,16);ctx.clip();ctx.translate(x,y);
  // the counter's top: warm, worn wood, with its grain, lit from the shop's door
  let g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,"#8a5a34");g.addColorStop(0.5,"#74482a");g.addColorStop(1,"#5a3820");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  ctx.strokeStyle="rgba(40,22,10,0.22)";ctx.lineWidth=1.4;for(let i=0;i<34;i++){const yy=i*h/30+Math.sin(i*1.7)*6;ctx.beginPath();for(let xx=-10;xx<=w+10;xx+=20){const v=yy+Math.sin(xx*0.012+i*0.9)*5+Math.sin(xx*0.05+i)*1.5;xx<0?ctx.moveTo(xx,v):ctx.lineTo(xx,v);}ctx.stroke();}
  ctx.fillStyle="rgba(255,230,190,0.07)";ctx.fillRect(0,0,w,h*0.5);
  // the counter's far edge, the agent's side, in shadow, and the near edge, the customer's
  g=ctx.createLinearGradient(0,0,0,h*0.16);g.addColorStop(0,"rgba(10,6,4,0.85)");g.addColorStop(1,"rgba(10,6,4,0)");ctx.fillStyle=g;ctx.fillRect(0,0,w,h*0.16);
  g=ctx.createLinearGradient(0,h*0.86,0,h);g.addColorStop(0,"rgba(10,6,4,0)");g.addColorStop(1,"rgba(10,6,4,0.7)");ctx.fillStyle=g;ctx.fillRect(0,h*0.86,w,h*0.14);
  // the ledger, open, with ruled lines and signatures, and a pen
  ctx.save();ctx.translate(w*0.22,h*0.42);ctx.rotate(-0.08);ctx.shadowColor="rgba(0,0,0,0.45)";ctx.shadowBlur=14;ctx.shadowOffsetY=6;ctx.fillStyle="#efe6d2";ctx.fillRect(-w*0.16,-h*0.17,w*0.32,h*0.34);ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  ctx.fillStyle="rgba(120,96,60,0.25)";ctx.fillRect(-1.5,-h*0.17,3,h*0.34);ctx.strokeStyle="rgba(90,120,170,0.35)";ctx.lineWidth=1;for(let k=0;k<9;k++){const yy=-h*0.13+k*h*0.032;ctx.beginPath();ctx.moveTo(-w*0.145,yy);ctx.lineTo(-w*0.01,yy);ctx.moveTo(w*0.01,yy);ctx.lineTo(w*0.145,yy);ctx.stroke();}
  ctx.strokeStyle="rgba(40,44,90,0.6)";ctx.lineWidth=1.4;for(let k=0;k<6;k++){const yy=-h*0.135+k*h*0.032,xx=-w*0.13+hash(k,1020)*w*0.02;ctx.beginPath();ctx.moveTo(xx,yy);for(let j=1;j<10;j++)ctx.lineTo(xx+j*w*0.008,yy-Math.sin(j*2.1+k)*3);ctx.stroke();}
  ctx.strokeStyle="#1e2a50";ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(w*0.04,h*0.1);ctx.lineTo(w*0.15,h*0.02);ctx.stroke();ctx.restore();
  // airtime cards, fanned, in three colours, each with its silver strip to scratch
  [[0.13,[76,160,98]],[0.03,[232,146,64]],[-0.08,[74,124,204]],[-0.18,[76,160,98]]].forEach(([r,col],k)=>{ctx.save();ctx.translate(w*0.86,h*0.58);ctx.rotate(r);ctx.shadowColor="rgba(0,0,0,0.4)";ctx.shadowBlur=8;ctx.shadowOffsetY=3;
    ctx.fillStyle=rgba(col,1);rr(ctx,-34,-58,68,46,5);ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;ctx.fillStyle="rgba(214,218,226,0.9)";rr(ctx,-24,-30,48,9,3);ctx.fill();ctx.fillStyle="rgba(255,255,255,0.5)";ctx.fillRect(-26,-50,22,5);ctx.restore();});
  // the agent's phone, and the pile of notes beside it
  ctx.save();ctx.translate(w*0.82,h*0.26);ctx.rotate(0.18);ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=12;ctx.shadowOffsetY=5;ctx.fillStyle="#2c3036";rr(ctx,-34,-64,68,128,16);ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  g=ctx.createLinearGradient(0,-50,0,-6);g.addColorStop(0,"#d6e6ee");g.addColorStop(1,"#a9c4d2");ctx.fillStyle=g;rr(ctx,-25,-52,50,42,4);ctx.fill();glow(ctx,0,-31,46,[200,236,255],0.2+0.45*(o.lit||0));
  ctx.fillStyle="#9aa0a8";for(let r=0;r<4;r++)for(let c=0;c<3;c++){rr(ctx,-22+c*16,0+r*13,12,9,3);ctx.fill();}ctx.restore();
  const PILE=[w*0.6,h*0.2];for(let k=0;k<5;k++)d10_note(ctx,PILE[0]+k*3,PILE[1]-k*2,0.1+k*0.03,w*0.17,k%2?[150,112,104]:[132,118,96],1);
  // the hands: where each rests, where they meet, and where the agent's goes for the notes
  const gv=clamp(o.give||0,0,1),cin=clamp(o.in||0,0,1),sk1=o.skinA||[96,60,40],sk2=o.skinB||[124,82,58],L=(A,B,u)=>[lerp(A[0],B[0],u),lerp(A[1],B[1],u)];
  const AR=[w*0.5,h*0.12],AP=[PILE[0]+6,PILE[1]+10],AX=[w*0.5,h*0.46],CR=[w*0.46,h*1.0],CX=[w*0.47,h*0.66],CW=[w*0.44,h*0.86];
  let ah=AR,ch=CR,cc=0.12,ac=0.3,nt=null,under=false;
  if(cin>0&&cin<1){ch=cin<0.45?L(CR,CX,sstep(0,0.3,cin)):L(CX,CR,sstep(0.45,0.75,cin));ah=cin<0.5?L(AR,AX,sstep(0.22,0.42,cin)):cin<0.76?L(AX,AP,sstep(0.5,0.72,cin)):L(AP,AR,sstep(0.78,1,cin));
    nt=cin<0.44?[ch[0],ch[1]-8]:cin<0.74?[ah[0]-6,ah[1]+28]:[AP[0]-4,AP[1]+4];under=cin>=0.44&&cin<0.74;}
  if(gv>0){ah=gv<0.2?L(AR,AP,sstep(0,0.18,gv)):gv<0.55?L(AP,AX,sstep(0.2,0.42,gv)):L(AX,AR,sstep(0.58,0.85,gv));ch=gv<0.64?L(CR,CX,sstep(0.22,0.44,gv)):L(CX,CW,sstep(0.66,0.95,gv));cc=0.12+0.66*sstep(0.5,0.62,gv);
    nt=gv<0.18?null:gv<0.5?[ah[0]-6,ah[1]+28]:[ch[0],ch[1]-8];under=gv<0.5||cc>0.5;}
  const notes=()=>{if(!nt)return;d10_note(ctx,nt[0],nt[1],-0.2,w*0.17,[150,112,104],1);d10_note(ctx,nt[0]+8,nt[1]-6,-0.12,w*0.17,[132,118,96],1);};
  const sway=Math.sin(t*1.4)*2;
  // the customer's hand, palm up from the bottom; the agent's, from the top, fingers down
  if(under&&nt&&nt[1]>h*0.5)notes();
  d10_hand(ctx,ch[0],ch[1]+80+sway,0,1.25,sk2,1,{palm:true,curl:cc,sleeve:o.sleeveB||[150,64,72]});
  if(!under&&nt&&nt[1]>h*0.5)notes();
  if(under&&nt&&nt[1]<=h*0.5)notes();
  d10_hand(ctx,ah[0],ah[1]-120-sway,Math.PI,1.2,sk1,-1,{curl:ac,sleeve:o.sleeveA||[64,86,116]});
  if(!under&&nt&&nt[1]<=h*0.5)notes();
  ctx.restore();
  if(o.lab)tag(ctx,x+18,y+34,o.lab,[255,214,170],{size:28});});}

/* ---------- Kenya's change, down six layers ---------- */
// a short line on a layer: what the idea needed there, as a chip of glass in the layer's colour (o.hi lights it)
function d10_chip(ctx,x,y,s,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return 0;const sz=o.size||28,w=tw(ctx,s,sz,700)+36,h=sz+24;withA(ctx,a,()=>{glass(ctx,x,y-h/2,w,h,12,col,{glow:10+14*(o.hi||0),ea:0.85,fill:"rgba(7,12,24,0.94)"});
  ctx.fillStyle=rgba(col,0.14+0.12*(o.hi||0));rr(ctx,x,y-h/2,w,h,12);ctx.fill();T(ctx,s,x+18,y+sz*0.36,{w:700,size:sz,color:rgba(INK,0.96)});});return w;}

/* ---------- the utility: the direction, the map's six layers, owners ---------- */
// a home, as a list or a map draws one: a roof and walls with a door, standing on (x, y) (s: its width). o.lit (0..1) lights it in
// gold: a home on the tariff, or one the agency knows is eligible; o.col: its lines; o.dim (0..1) greys it, as a home the match misses
function d10_house(ctx,x,y,s,a,o){o=o||{};if(a<=0.01)return;const lit=o.lit||0,col=mix(o.col||[226,232,246],[110,116,130],o.dim||0);withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);
  if(lit>0.01)glow(ctx,0,-s*0.35,s*1.05,TRUST,0.42*lit);
  ctx.beginPath();ctx.moveTo(-s*0.52,-s*0.4);ctx.lineTo(0,-s*0.82);ctx.lineTo(s*0.52,-s*0.4);ctx.lineTo(s*0.4,-s*0.4);ctx.lineTo(s*0.4,0);ctx.lineTo(-s*0.4,0);ctx.lineTo(-s*0.4,-s*0.4);ctx.closePath();
  ctx.fillStyle=rgba(mix([10,14,26],[90,70,20],lit),0.95);ctx.fill();ctx.strokeStyle=rgba(mix(col,TRUST,lit),0.92);ctx.lineWidth=Math.max(1.6,s*0.06);ctx.lineJoin="round";ctx.stroke();
  ctx.fillStyle=rgba(mix(col,TRUST,lit),0.85);ctx.fillRect(-s*0.09,-s*0.24,s*0.18,s*0.24);ctx.restore();});}
// the film's own glyphs, beside the series' (archGlyph): a requirement, as ArchiMate 4 draws one (a parallelogram), for a rule; a
// data product, a hexagon (as in Now the questions appear); a measure, a dial; a decision, a diamond
function d10_glyph(ctx,kind,x,y,s,col,v){ctx.save();ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);ctx.lineWidth=Math.max(1.4,s*0.1);ctx.lineJoin="round";ctx.lineCap="round";
  if(kind==="requirement"){ctx.beginPath();ctx.moveTo(x-s*0.55,y-s*0.5);ctx.lineTo(x+s*0.85,y-s*0.5);ctx.lineTo(x+s*0.55,y+s*0.5);ctx.lineTo(x-s*0.85,y+s*0.5);ctx.closePath();ctx.stroke();}
  else if(kind==="product"){ctx.beginPath();for(let k=0;k<6;k++){const an=Math.PI/6+k*TAU/6;ctx.lineTo(x+Math.cos(an)*s*0.85,y+Math.sin(an)*s*0.85);}ctx.closePath();ctx.stroke();ctx.beginPath();ctx.arc(x,y,s*0.25,0,TAU);ctx.fill();}
  else if(kind==="measure"){const cy=y+s*0.38;ctx.beginPath();ctx.arc(x,cy,s*0.85,Math.PI,0);ctx.stroke();for(let k=0;k<=4;k++){const an=Math.PI+k*Math.PI/4;ctx.beginPath();ctx.moveTo(x+Math.cos(an)*s*0.85,cy+Math.sin(an)*s*0.85);ctx.lineTo(x+Math.cos(an)*s*0.62,cy+Math.sin(an)*s*0.62);ctx.stroke();}
    const an=Math.PI*(1.15+0.7*clamp(v==null?0.55:v,0,1));ctx.beginPath();ctx.moveTo(x,cy);ctx.lineTo(x+Math.cos(an)*s*0.7,cy+Math.sin(an)*s*0.7);ctx.stroke();ctx.beginPath();ctx.arc(x,cy,s*0.14,0,TAU);ctx.fill();}
  else if(kind==="decision"){ctx.beginPath();ctx.moveTo(x,y-s*0.8);ctx.lineTo(x+s*0.8,y);ctx.lineTo(x,y+s*0.8);ctx.lineTo(x-s*0.8,y);ctx.closePath();ctx.stroke();}
  else archGlyph(ctx,kind,x,y,s,col);ctx.restore();}
// an element of the model with the film's glyphs as well as the series': archEl, then the glyph where archEl puts its own
function d10_el(ctx,x,y,w,h,name,col,kind,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const own=["requirement","product","measure","decision"].includes(kind);
  archEl(ctx,x,y,w,h,name,col,own?"none":kind,o);if(own){const gs=o.gs||13;withA(ctx,a,()=>d10_glyph(ctx,kind,x+w-gs-11,y+gs+9,gs,col,o.v));}}
// an owner, named on a gold tag with ArchiMate's actor glyph (as in Now the questions appear)
function d10_owner(ctx,x,y,name,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const s=(o.pre==null?"owner · ":o.pre)+name,ts=o.size||28,w=tw(ctx,s,ts,700)+70,h=ts+20,X=o.align==="center"?x-w/2:o.align==="right"?x-w:x;
  glass(ctx,X,y-h/2,w,h,h/2,TRUST,{glow:10+12*(o.hi||0),ea:0.85,fill:"rgba(20,16,6,0.92)"});archGlyph(ctx,"actor",X+26,y-2,13,TRUST);T(ctx,s,X+48,y+ts*0.36,{w:700,size:ts,color:rgba(TRUST,1),deco:o.deco});});}
// a "new" badge, on an element the change adds (as in Today, and where it's going)
function d10_new(ctx,x,y,a,deco){if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x-44,y-20,88,40,20,[150,240,170],{glow:10,ea:0.8,fill:"rgba(6,16,12,0.95)"});T(ctx,"new",x,y+10,{w:800,size:28,align:"center",color:"rgba(170,245,190,1)",deco});});}
// a line traced through points, drawn up to p, with a bright head while it's drawing (o.lw, o.a, o.dash, o.nohead)
function d10_trace(ctx,pts,p,col,o){o=o||{};if(p<=0)return;const L=[0];for(let i=1;i<pts.length;i++)L.push(L[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));const d=L[L.length-1]*clamp(p,0,1);
  ctx.save();ctx.globalAlpha*=o.a==null?1:o.a;ctx.strokeStyle=rgba(col,1);ctx.lineWidth=o.lw||3;ctx.lineCap="round";ctx.lineJoin="round";if(o.dash)ctx.setLineDash(o.dash);ctx.shadowColor=rgba(col,0.7);ctx.shadowBlur=10;ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);let hx=pts[0][0],hy=pts[0][1];
  for(let i=1;i<pts.length;i++){if(L[i]<=d){ctx.lineTo(pts[i][0],pts[i][1]);hx=pts[i][0];hy=pts[i][1];}else{const f=(d-L[i-1])/((L[i]-L[i-1])||1);hx=lerp(pts[i-1][0],pts[i][0],f);hy=lerp(pts[i-1][1],pts[i][1],f);ctx.lineTo(hx,hy);break;}}ctx.stroke();ctx.restore();
  if(p<1&&!o.nohead){glow(ctx,hx,hy,22,col,0.8);ctx.fillStyle=rgba(mix(col,[255,255,255],0.6),1);ctx.beginPath();ctx.arc(hx,hy,4.5,0,TAU);ctx.fill();}}
// someone on the map, drawn as a map draws people: a head and shoulders (s: its height)
function d10_icon(ctx,x,y,s,col,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(x,y-s*0.72,s*0.22,0,TAU);ctx.fill();ctx.beginPath();ctx.moveTo(x-s*0.36,y);ctx.quadraticCurveTo(x-s*0.36,y-s*0.44,x,y-s*0.46);ctx.quadraticCurveTo(x+s*0.36,y-s*0.44,x+s*0.36,y);ctx.closePath();ctx.fill();});}

/* ---------- once only: the agreement that asks for the least ---------- */
// a principle, as a card of glass in motivation's colour, as Why it moves draws one: its glyph, its name and what it says (o.p,
// 0..1, shows what it says; o.kicker: what kind of card it is)
function d10_principle(ctx,x,y,w,title,line,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return 0;const sz=o.size||30,ls=wrapT(ctx,line,0,0,w-80,{size:sz,w:700,measure:true}),h=150+ls.length*sz*1.3;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,MOT,{glow:14+14*(o.hi||0),ea:0.85,fill:"rgba(10,8,24,0.95)"});ctx.fillStyle=rgba(MOT,0.12+0.1*(o.hi||0));rr(ctx,x,y,w,h,18);ctx.fill();
    archGlyph(ctx,"principle",x+48,y+44,14,MOT);T(ctx,o.kicker||"principle",x+74,y+54,{f:"mono",w:500,size:28,color:rgba(MOT,1)});
    T(ctx,title,x+40,y+110,{w:800,size:40,color:rgba(INK,0.97)});
    withA(ctx,o.p==null?1:clamp(o.p,0,1),()=>ls.forEach((l,i)=>T(ctx,l,x+40,y+156+i*sz*1.3,{w:700,size:sz,color:rgba(SOFT,0.96)})));});return h;}
// the form a household would have filled in to claim the tariff, on paper; o.x (0..1) crosses it out in red marker
function d10_form(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const rot=o.rot==null?0.03:o.rot;withA(ctx,a,()=>{ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(rot);ctx.translate(-x-w/2,-y-h/2);
  sheet(ctx,x,y,w,h,{rot:0,plain:true});T(ctx,"application",x+28,y+56,{w:800,size:32,color:"rgba(40,38,40,0.95)"});
  ["proof of income","benefit letter","signature"].forEach((s,i)=>{const yy=y+112+i*74;T(ctx,s,x+28,yy,{w:700,size:28,color:"rgba(96,86,76,0.95)"});ctx.strokeStyle="rgba(96,86,76,0.45)";ctx.lineWidth=2;ctx.strokeRect(x+28,yy+12,w-56,28);});
  const xp=o.x||0;if(xp>0){marker(ctx,[[x+18,y+22],[x+w*0.5,y+h*0.5],[x+w-18,y+h-22]],clamp(xp*2,0,1),{col:rgba(D10_RED,0.95),lw:9,seed:3});marker(ctx,[[x+w-18,y+22],[x+w*0.5,y+h*0.5],[x+18,y+h-22]],clamp(xp*2-1,0,1),{col:rgba(D10_RED,0.95),lw:9,seed:4});}
  ctx.restore();});}
// a timeline from today, November 2026, to 1 July 2027, a tick a month; rows are [name, from, to (months from today), colour, the
// time its bar grows]
function d10_gantt(ctx,x,y,w,t,rows,a){if(a<=0.01)return;const X=m=>x+w*m/8;withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(SOFT,0.45);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y+112);ctx.lineTo(x+w,y+112);ctx.stroke();
  for(let m=0;m<=8;m++){ctx.beginPath();ctx.moveTo(X(m),y+105);ctx.lineTo(X(m),y+119);ctx.stroke();}ctx.restore();
  rows.forEach(([nm,m0,m1,col,t0],i)=>{const yy=y+i*56,p=ease(clamp((t-t0)/1.3,0,1));if(p<=0)return;const bw=Math.max(44,(X(m1)-X(m0))*p);
    glass(ctx,X(m0),yy,bw,44,22,col,{glow:12,ea:0.85,fill:"rgba(7,12,24,0.94)"});ctx.fillStyle=rgba(col,0.24);rr(ctx,X(m0),yy,bw,44,22);ctx.fill();
    withA(ctx,fin(t,t0+0.4,0.4),()=>T(ctx,nm,X(m0)+22,yy+32,{w:700,size:28,color:rgba(INK,0.96)}));});
  // today, and the first of July, each a line across the rows with its name above
  [[0,"today",SOFT],[8,"1 July 2027",TRUST]].forEach(([m,s,col])=>{ctx.save();ctx.strokeStyle=rgba(col,0.8);ctx.lineWidth=2.5;ctx.setLineDash([7,6]);ctx.beginPath();ctx.moveTo(X(m),y-10);ctx.lineTo(X(m),y+119);ctx.stroke();ctx.restore();
    T(ctx,s,X(m),y-22,{f:"mono",w:500,size:28,align:"center",color:rgba(col,1)});});});}

/* ---------- the wall holds ---------- */
// the network and retail, either side of the wall, as Who does it, and where meaning changes draws them: the network's side tinted
// blue, retail's rose, each named at the top (o.lab fades the names)
function d10_sides(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const lg=ctx.createLinearGradient(0,0,960,0);lg.addColorStop(0,rgba(D10_NET,0.0));lg.addColorStop(1,rgba(D10_NET,0.08));ctx.fillStyle=lg;ctx.fillRect(0,0,960,H);
  const rg=ctx.createLinearGradient(960,0,W,0);rg.addColorStop(0,rgba(D10_RET,0.08));rg.addColorStop(1,rgba(D10_RET,0.0));ctx.fillStyle=rg;ctx.fillRect(960,0,960,H);
  withA(ctx,o.lab==null?1:o.lab,()=>{T(ctx,"network",480,112,{w:800,size:40,align:"center",color:rgba(D10_NET,1)});T(ctx,"retail",1440,112,{w:800,size:40,align:"center",color:rgba(D10_RET,1)});});});}
// the wall between them; o.red (0..1) reddens it round o.ry, where something would cross; o.hi lights it all, as it holds
function d10_wall(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const y0=150,y1=880,red=o.red||0,hi=o.hi||0;withA(ctx,a,()=>{const col=mix([226,232,246],TRUST,hi*0.5);ctx.save();ctx.shadowColor=rgba(col,0.7);ctx.shadowBlur=18+20*hi;
  ctx.fillStyle=rgba(col,0.12+0.12*hi);ctx.fillRect(948,y0,24,y1-y0);ctx.shadowBlur=0;ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.5;ctx.beginPath();[948,972].forEach(x=>{ctx.moveTo(x,y0);ctx.lineTo(x,y1);});ctx.stroke();ctx.restore();
  if(red>0.01){const ry=o.ry||520;glow(ctx,960,ry,150,D10_RED,0.55*red);ctx.save();const g=ctx.createLinearGradient(0,ry-170,0,ry+170);g.addColorStop(0,rgba(D10_RED,0));g.addColorStop(0.5,rgba(D10_RED,0.9*red));g.addColorStop(1,rgba(D10_RED,0));
    ctx.strokeStyle=g;ctx.lineWidth=4;ctx.beginPath();[948,972].forEach(x=>{ctx.moveTo(x,ry-170);ctx.lineTo(x,ry+170);});ctx.stroke();ctx.restore();}});}
// the utility's three principles, from Why it moves, on one card: o.hi[i] lights principle i, o.tick[i] (0..1) ticks it, as each is
// checked
function d10_principles(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return 0;const L=D10_PRS.map(s=>wrapT(ctx,s,0,0,w-150,{size:28,w:700,measure:true})),hs=L.map(l=>14+l.length*36),h=84+hs.reduce((s,v)=>s+v,0)+14;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,MOT,{glow:14,ea:0.85,fill:"rgba(10,8,24,0.95)"});ctx.fillStyle=rgba(MOT,0.1);rr(ctx,x,y,w,h,18);ctx.fill();
    archGlyph(ctx,"principle",x+44,y+44,14,MOT);T(ctx,"principles",x+70,y+54,{f:"mono",w:500,size:28,color:rgba(MOT,1)});
    let yy=y+84;L.forEach((ls,i)=>{const hi=o.hi?o.hi[i]||0:0,tk=o.tick?o.tick[i]||0:0,dim=o.dim==null?0:o.dim;withA(ctx,1-dim*(1-clamp(hi,0,1)),()=>{
      if(hi>0.01)withA(ctx,clamp(hi,0,1),()=>{ctx.fillStyle=rgba(MOT,0.16);rr(ctx,x+14,yy-4,w-28,hs[i]-2,10);ctx.fill();});
      ctx.save();ctx.strokeStyle=rgba(MOT,1);ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(x+50,yy+22,17,0,TAU);ctx.stroke();ctx.restore();T(ctx,String(i+1),x+50,yy+32,{w:800,size:28,align:"center",color:rgba(MOT,1)});
      ls.forEach((l,j)=>T(ctx,l,x+86,yy+32+j*36,{w:700,size:28,color:rgba(INK,0.95)}));if(tk>0.01)kt_gtick(ctx,x+w-40,yy+22,16,tk);});yy+=hs[i];});});return h;}
const D10_PRS=["use what we have before we build","cost every option for the customers who pay","customer information stays with the business that collected it"];
// a decision record, on paper, as Today, and where it's going writes one: a number and a title, then its rows ([key, value, height]),
// written in as p goes to 1; o.hi outlines it in gold
function d10_adr(ctx,x,y,w,title,rows,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return 0;const h=150+rows.reduce((s,r)=>s+r[2],0);withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{rot:o.rot==null?-0.008:o.rot,plain:true});
  if(o.hi)withA(ctx,clamp(o.hi,0,1),()=>{ctx.save();ctx.strokeStyle=rgba(TRUST,0.95);ctx.lineWidth=4;ctx.shadowColor=rgba(TRUST,0.8);ctx.shadowBlur=18;rr(ctx,x-8,y-8,w+16,h+16,10);ctx.stroke();ctx.restore();});
  T(ctx,"decision record",x+30,y+48,{f:"mono",w:500,size:28,color:"rgba(150,60,110,0.95)"});T(ctx,title,x+30,y+100,{w:800,size:36,color:"rgba(40,38,40,0.97)"});
  let yy=y+150;rows.forEach(([k,v,hh],i)=>{const q=o.p==null?1:clamp(o.p*rows.length-i,0,1);if(q>0)withA(ctx,q,()=>{T(ctx,k,x+30,yy+30,{w:800,size:28,color:"rgba(110,90,60,0.95)"});wrapT(ctx,v,x+220,yy+30,w-250,{size:28,w:700,color:"rgba(40,38,40,0.92)",lh:34});});yy+=hh;});});return h;}

/* ---------- new rules, with homes ---------- */
// a rule, in the form Rules with a home sets for it: dark glass with motivation's purple edge (ArchiMate 4 draws a rule as a
// requirement: the parallelogram, top right), a stripe down its left edge in its home domain's colour, its kind (o.kind: a data rule,
// unless it's about what the business does) and id, then six rows, each a label and a value. vals: the six values (o.ra[i], 0..1,
// writes value i in); o.ghost draws the empty form, its labels only (o.lit[i] lights label i)
const D10_RL6=["applies to","must be true","owner","reason","home","when it fails"];
function d10_rule(ctx,x,y,w,id,vals,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return 0;const vw=w-300,L=D10_RL6.map((_,i)=>vals?wrapT(ctx,vals[i],0,0,vw,{size:28,w:700,measure:true}):[""]),
  hs=L.map(l=>Math.max(1,l.length)*36+18),h=88+hs.reduce((s,v)=>s+v,0)+10;
  withA(ctx,a,()=>{if(o.ghost){ctx.save();ctx.fillStyle="rgba(9,8,22,0.6)";rr(ctx,x,y,w,h,16);ctx.fill();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(MOT,0.75);ctx.lineWidth=2.5;rr(ctx,x,y,w,h,16);ctx.stroke();ctx.restore();}
    else{glass(ctx,x,y,w,h,16,MOT,{glow:14+12*(o.hi||0),ea:0.85,fill:"rgba(9,8,22,0.96)"});ctx.fillStyle=rgba(D10_RET,0.9);rr(ctx,x+7,y+16,7,h-32,3.5);ctx.fill();}
    d10_glyph(ctx,"requirement",x+w-44,y+44,14,MOT);T(ctx,(o.kind||"data rule")+(id?" · "+id:""),x+40,y+54,{f:"mono",w:500,size:28,color:rgba(MOT,1),deco:o.deco});
    let yy=y+88;D10_RL6.forEach((lab,i)=>{const lit=o.lit?clamp(o.lit[i]||0,0,1):0;if(lit>0.01)withA(ctx,lit,()=>{ctx.fillStyle=rgba(MOT,0.16);rr(ctx,x+24,yy-4,236,44,10);ctx.fill();});
      T(ctx,lab,x+40,yy+28,{f:"mono",w:500,size:28,color:rgba(mix([160,178,205],[236,228,255],lit),0.95),deco:o.deco});
      if(vals){const q=o.ra?clamp(o.ra[i]||0,0,1):1;if(q>0.01)withA(ctx,q,()=>{const col=[INK,INK,TRUST,MOT,D10_RET,D10_RED][i];let vx=x+270;
        if(i===2){archGlyph(ctx,"actor",vx+10,yy+16,12,TRUST);vx+=34;}L[i].forEach((l,j)=>T(ctx,l,vx,yy+28+j*36,{w:700,size:28,color:rgba(col,i<2?0.96:1),deco:o.deco}));});}
      yy+=hs[i];});});return h;}
// the same rule, small, on the map: a requirement, its id and a short name (s scales it, from where it was a card)
function d10_ruleMini(ctx,x,y,w,id,name,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,92,12,MOT,{glow:12+12*(o.hi||0),ea:0.85,fill:"rgba(9,8,22,0.96)"});
  ctx.fillStyle=rgba(D10_RET,0.9);rr(ctx,x+6,y+12,6,68,3);ctx.fill();d10_glyph(ctx,"requirement",x+w-34,y+28,11,MOT);
  T(ctx,id,x+28,y+38,{f:"mono",w:500,size:28,color:rgba(MOT,1),deco:o.deco});T(ctx,name,x+28,y+76,{w:700,size:28,color:rgba(INK,0.96),deco:o.deco});});}
// a contract on a short card, as the list after the walk draws one: what changes in it (mono) over its name, wrapped, with its
// element's glyph. Returns its height
function d10_conMini(ctx,x,y,w,kick,name,kind,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return 0;const L=wrapT(ctx,name,0,0,w-44,{size:28,w:700,measure:true}),h=58+L.length*36;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,12,INF,{glow:12+12*(o.hi||0),ea:0.85,fill:"rgba(16,10,9,0.96)"});ctx.fillStyle=rgba(INF,0.9);rr(ctx,x+6,y+12,6,h-24,3);ctx.fill();
    if(kind==="product")d10_glyph(ctx,"product",x+w-34,y+28,11,INF);else archGlyph(ctx,kind,x+w-34,y+28,11,INF);
    T(ctx,kick,x+28,y+38,{f:"mono",w:500,size:28,color:rgba(INF,1),deco:o.deco});L.forEach((l,j)=>T(ctx,l,x+28,y+76+j*36,{w:700,size:28,color:rgba(INK,0.96),deco:o.deco}));});return h;}
// a realisation line, dotted, with a hollow triangle where it ends (the element realises the requirement): drawn up to p
function d10_realise(ctx,x0,y0,x1,y1,col,p,a){if(p<=0||a<=0.01)return;const e=clamp(p,0,1),ex=lerp(x0,x1,e),ey=lerp(y0,y1,e),an=Math.atan2(y1-y0,x1-x0);withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.5;ctx.setLineDash([3,6]);ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(ex-Math.cos(an)*16*(e>=1?1:0),ey-Math.sin(an)*16*(e>=1?1:0));ctx.stroke();ctx.setLineDash([]);
  if(e>=1){ctx.lineWidth=2.5;ctx.fillStyle="rgba(9,8,22,1)";ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x1-Math.cos(an)*18+Math.sin(an)*10,y1-Math.sin(an)*18-Math.cos(an)*10);ctx.lineTo(x1-Math.cos(an)*18-Math.sin(an)*10,y1-Math.sin(an)*18+Math.cos(an)*10);ctx.closePath();ctx.fill();ctx.stroke();}
  ctx.restore();});}
// the catalogue's page for eligibility, as Databricks shows a table: its columns, the two dates that only billing reads behind a
// column mask, and the table as the call centre sees it (o.cc, 0..1: that view; o.yes lights "yes"; o.mask lights what's masked)
function d10_catalogue(ctx,x,y,w,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const h=600;withA(ctx,a,()=>{glass(ctx,x-12,y-12,w+24,h+24,22,[170,205,255],{glow:18,ea:0.45,fill:"rgba(8,14,28,0.95)"});
  ctx.save();rr(ctx,x,y,w,h,12);ctx.clip();ctx.fillStyle=DB.canvas;ctx.fillRect(x,y,w,h);ctx.fillStyle=DB.card;ctx.fillRect(x,y,w,72);ctx.fillStyle=DB.line;ctx.fillRect(x,y+72,w,1.2);
  const lw=logo(ctx,"databricks",x+24,y+21,30);T(ctx,"retail.eligibility",x+44+lw,y+48,{f:"mono",w:600,size:28,color:DB.text});
  T(ctx,"columns",x+32,y+122,{w:700,size:28,color:DB.muted});dbCard(ctx,x+24,y+140,w-48,218);
  [["account_id","string",0],["eligible_from","date",1],["eligible_until","date",1],["on_social_tariff","boolean",0]].forEach(([c,ty,m],i)=>{const yy=y+186+i*50;
    T(ctx,c,x+50,yy,{f:"mono",w:500,size:28,color:DB.text});T(ctx,ty,x+370,yy,{f:"mono",w:500,size:28,color:DB.muted});
    if(m){const mx=x+520;withA(ctx,1,()=>{ctx.save();ctx.strokeStyle=rgba(mix([200,45,76],[255,255,255],0.2*(1-(o.mask||0))),1);ctx.lineWidth=2.5;rr(ctx,mx,yy-21,16,14,3);ctx.stroke();ctx.beginPath();ctx.arc(mx+8,yy-22,6,Math.PI,TAU);ctx.stroke();ctx.restore();
      T(ctx,"mask: billing only",mx+30,yy,{w:600,size:28,color:DB.red});});}
    if(i<3){ctx.fillStyle=DB.line;ctx.fillRect(x+40,yy+17,w-80,1.2);}});
  withA(ctx,o.cc==null?1:o.cc,()=>{T(ctx,"as the call centre sees it",x+32,y+410,{w:700,size:28,color:DB.muted});dbCard(ctx,x+24,y+428,w-48,148);
    [["account_id",x+50],["eligible_from",x+330],["on_social_tariff",x+590]].forEach(([c,cx])=>T(ctx,c,cx,y+474,{f:"mono",w:500,size:28,color:DB.muted}));ctx.fillStyle=DB.line;ctx.fillRect(x+40,y+492,w-80,1.2);
    T(ctx,"4410-2291",x+50,y+540,{f:"mono",w:500,size:28,color:DB.text});
    const mk=o.mask||0;if(mk>0.01)withA(ctx,mk,()=>{ctx.fillStyle=DB.warnBg;rr(ctx,x+322,y+508,150,46,6);ctx.fill();});T(ctx,"•••",x+330,y+540,{f:"mono",w:700,size:28,color:DB.muted});
    const ys=o.yes||0;if(ys>0.01)withA(ctx,ys,()=>{ctx.fillStyle=DB.greenBg;rr(ctx,x+582,y+508,96,46,6);ctx.fill();});T(ctx,"yes",x+590,y+540,{f:"mono",w:700,size:28,color:DB.green});});
  ctx.restore();});}

/* ---------- down to the counter ---------- */
// a household's bill, on paper: its lines, with the new one (o.hi lights it) and the amount due
const D10_BILL=[["energy used","$118.40"],["network charge","$46.20"],["social tariff discount","−$32.92"]];
function d10_bill(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const ink="rgba(40,38,40,0.96)",soft="rgba(96,86,76,0.95)";withA(ctx,a,()=>{ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot==null?-0.015:o.rot);ctx.translate(-x-w/2,-y-h/2);
  sheet(ctx,x,y,w,h,{rot:0,plain:true});T(ctx,"your bill",x+32,y+58,{deco:o.deco,f:"mono",w:500,size:28,color:"rgba(150,60,60,0.95)"});T(ctx,"July 2027",x+w-32,y+58,{deco:o.deco,f:"mono",w:500,size:28,align:"right",color:soft});
  ctx.fillStyle="rgba(96,86,76,0.35)";ctx.fillRect(x+32,y+84,w-64,2);
  D10_BILL.forEach(([k,v],i)=>{const yy=y+150+i*70,nw=i===2;if(nw){const hi=clamp(o.hi||0,0,1);ctx.fillStyle="rgba(255,206,84,"+(0.18+0.4*hi)+")";ctx.fillRect(x+22,yy-40,w-44,58);}
    T(ctx,k,x+32,yy,{deco:o.deco,w:nw?800:600,size:30,color:ink});T(ctx,v,x+w-32,yy,{deco:o.deco,w:nw?800:600,size:30,align:"right",color:nw?"rgba(30,110,60,1)":ink});});
  ctx.fillStyle="rgba(40,38,40,0.6)";ctx.fillRect(x+32,y+356,w-64,2.5);T(ctx,"amount due",x+32,y+410,{deco:o.deco,w:800,size:34,color:ink});T(ctx,"$131.68",x+w-32,y+410,{deco:o.deco,w:800,size:34,align:"right",color:ink});
  ctx.restore();});}
// the letter that tells a household it has the tariff
function d10_letter(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const ink="rgba(40,38,40,0.96)";withA(ctx,a,()=>{ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot==null?0.02:o.rot);ctx.translate(-x-w/2,-y-h/2);
  sheet(ctx,x,y,w,h,{rot:0,plain:true});T(ctx,"letter",x+32,y+58,{deco:o.deco,f:"mono",w:500,size:28,color:"rgba(150,60,60,0.95)"});T(ctx,"You have the social tariff",x+32,y+120,{deco:o.deco,w:800,size:32,color:ink});
  wrapT(ctx,"From 1 July, your bill is 20% lower. You don't need to do anything.",x+32,y+178,w-64,{deco:o.deco,size:28,w:600,color:"rgba(60,56,58,0.95)",lh:38});ctx.restore();});}
// the call centre's answer, as a script on paper: the household's question, and the answer from what the catalogue lets the call
// centre see (o.q, o.ans: each, 0..1)
function d10_call(ctx,x,y,w,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const ink="rgba(40,38,40,0.96)",h=420;withA(ctx,a,()=>{ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot==null?-0.012:o.rot);ctx.translate(-x-w/2,-y-h/2);
  sheet(ctx,x,y,w,h,{rot:0,plain:true});
  // a headset, drawn simply, in ink
  ctx.strokeStyle="rgba(40,60,110,0.9)";ctx.fillStyle="rgba(40,60,110,0.9)";ctx.lineWidth=3.5;ctx.lineCap="round";ctx.beginPath();ctx.arc(x+54,y+58,20,Math.PI*1.05,Math.PI*1.95);ctx.stroke();rr(ctx,x+30,y+54,9,18,4);ctx.fill();rr(ctx,x+69,y+54,9,18,4);ctx.fill();
  ctx.beginPath();ctx.moveTo(x+74,y+72);ctx.quadraticCurveTo(x+72,y+88,x+58,y+90);ctx.stroke();T(ctx,"call centre",x+96,y+68,{deco:o.deco,f:"mono",w:500,size:28,color:"rgba(150,60,60,0.95)"});
  const q=o.q==null?1:o.q,an=o.ans==null?1:o.ans;
  withA(ctx,q,()=>{T(ctx,"asked",x+30,y+148,{deco:o.deco,f:"mono",w:500,size:28,color:"rgba(110,90,60,0.95)"});T(ctx,"Am I on the social tariff?",x+30,y+190,{deco:o.deco,w:700,size:30,color:ink});});
  withA(ctx,an,()=>{T(ctx,"answer",x+30,y+262,{deco:o.deco,f:"mono",w:500,size:28,color:"rgba(110,90,60,0.95)"});T(ctx,"Yes, you are.",x+30,y+304,{deco:o.deco,w:800,size:30,color:ink});
    T(ctx,"from: on the social tariff, yes",x+30,y+370,{deco:o.deco,w:600,size:28,color:"rgba(40,60,110,0.9)"});});ctx.restore();});}
// an application, for those the match misses: a tenant asks, and agrees that the utility checks with the agency
function d10_apply(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const ink="rgba(40,38,40,0.96)",soft="rgba(96,86,76,0.95)";withA(ctx,a,()=>{ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot==null?-0.02:o.rot);ctx.translate(-x-w/2,-y-h/2);
  sheet(ctx,x,y,w,h,{rot:0,plain:true});T(ctx,"application",x+30,y+56,{f:"mono",w:500,size:28,color:"rgba(150,60,60,0.95)"});T(ctx,"The social tariff, for tenants",x+30,y+112,{w:800,size:30,color:ink});
  ["tenant's name","address"].forEach((s,i)=>{const yy=y+172+i*76;T(ctx,s,x+30,yy,{w:700,size:28,color:soft});ctx.strokeStyle="rgba(96,86,76,0.45)";ctx.lineWidth=2;ctx.strokeRect(x+30,yy+12,w-60,28);});
  const yy=y+330;ctx.strokeStyle="rgba(96,86,76,0.7)";ctx.lineWidth=2.5;ctx.strokeRect(x+30,yy-24,28,28);if(o.tick)withA(ctx,o.tick,()=>tick_(ctx,x+44,yy-10,26,[40,110,60],1));
  wrapT(ctx,"I agree that the utility checks with the agency",x+74,yy,w-104,{size:28,w:600,color:ink,lh:34});ctx.restore();});}

/* ---------- where the data lands ---------- */
// a data product, as Now the questions appear draws one: glass in information's colour, a stripe in its side's colour (retail's
// rose), the hexagon, its name and the capabilities it serves (o.hi lights it)
function d10_product(ctx,x,y,w,h,name,caps,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,INF,{glow:14+14*(o.hi||0),ea:0.85,fill:"rgba(12,10,14,0.95)"});
  ctx.fillStyle=rgba(INF,0.12+0.1*(o.hi||0));rr(ctx,x,y,w,h,18);ctx.fill();ctx.fillStyle=rgba(D10_RET,0.9);rr(ctx,x,y+14,6,h-28,3);ctx.fill();
  d10_glyph(ctx,"product",x+w-34,y+34,15,INF);T(ctx,name,x+28,y+52,{w:800,size:34,color:rgba(INK,0.97)});T(ctx,caps,x+28,y+h-24,{w:700,size:28,color:rgba(STR,0.95)});});}
// the product's columns that the bill's new line touches, each with what it means and what it comes to on this bill: amount due,
// whose meaning is kept (o.keep, 0..1, lights it and says so), and the discount, a new column (o.nw, 0..1, brings it in)
function d10_cols(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const h=290,nw=clamp(o.nw||0,0,1),kp=clamp(o.keep||0,0,1),GR=[150,240,170],mx=x+300;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,INF,{glow:12,ea:0.75,fill:"rgba(12,10,14,0.95)"});
    T(ctx,"columns",x+30,y+56,{f:"mono",w:500,size:28,color:rgba(INF,1)});T(ctx,"on this bill",x+w-30,y+56,{w:600,size:28,align:"right",color:rgba(SOFT,0.95)});
    ctx.fillStyle=rgba(INF,0.25);ctx.fillRect(x+24,y+82,w-48,1.5);
    if(kp>0.01)withA(ctx,kp,()=>{ctx.fillStyle=rgba(GR,0.12);rr(ctx,x+14,y+106,w-28,68,10);ctx.fill();});
    T(ctx,"amount_due",x+30,y+150,{f:"mono",w:500,size:30,color:rgba(INK,0.97)});T(ctx,"what the household pays",mx,y+150,{w:700,size:28,color:rgba(INK,0.96)});
    T(ctx,"$131.68",x+w-30,y+150,{f:"mono",w:500,size:30,align:"right",color:rgba(INK,0.97)});
    if(kp>0.01)withA(ctx,kp,()=>{const kx=mx+tw(ctx,"what the household pays",28,700)+34;kt_gtick(ctx,kx+14,y+140,13,1);T(ctx,"meaning kept",kx+40,y+150,{w:700,size:28,color:rgba(GR,1)});});
    if(nw>0.01)withA(ctx,nw,()=>{ctx.save();ctx.translate(0,(1-ease(nw))*18);T(ctx,"discount",x+30,y+236,{f:"mono",w:500,size:30,color:rgba(GR,1)});d10_new(ctx,x+30+tw(ctx,"discount",30,500,"mono")+62,y+226,1,0);
      T(ctx,"the social tariff's discount",mx,y+236,{w:700,size:28,color:rgba(INK,0.96)});T(ctx,"$32.92",x+w-30,y+236,{f:"mono",w:500,size:30,align:"right",color:rgba(GR,1)});ctx.restore();});});}
// a version of the product's contract: its number, then rows [label, value, colour, how far it's shown]; o.badge shows "new"; o.ghost
// (a colour) draws a version that isn't made, only considered: a dashed outline in that colour, no glass
function d10_ver(ctx,x,y,w,v,rows,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return 0;const h=86+rows.length*92,gc=o.ghost;withA(ctx,a,()=>{
  if(gc){ctx.save();ctx.fillStyle="rgba(12,10,14,0.9)";rr(ctx,x,y,w,h,16);ctx.fill();ctx.strokeStyle=rgba(gc,0.85);ctx.lineWidth=2.5;ctx.setLineDash([10,8]);rr(ctx,x,y,w,h,16);ctx.stroke();ctx.restore();}
  else{glass(ctx,x,y,w,h,16,INF,{glow:12+12*(o.hi||0),ea:0.8,fill:"rgba(12,10,14,0.95)"});ctx.fillStyle=rgba(INF,0.1+0.08*(o.hi||0));rr(ctx,x,y,w,h,16);ctx.fill();}
  d10_glyph(ctx,"product",x+w-34,y+38,13,gc||INF);T(ctx,"version "+v,x+26,y+52,{f:"mono",w:500,size:30,color:rgba(gc||INF,1)});
  ctx.fillStyle=rgba(gc||INF,0.22);ctx.fillRect(x+20,y+76,w-40,1.2);
  rows.forEach(([k,val,col,q],i)=>{const yy=y+86+i*92;withA(ctx,q==null?1:clamp(q,0,1),()=>{T(ctx,k,x+26,yy+32,{f:"mono",w:500,size:28,color:rgba(col||SOFT,0.95)});T(ctx,val,x+26,yy+72,{w:700,size:28,color:rgba(col||INK,0.96)});});});
  if(o.badge)d10_new(ctx,x+w-64,y-8,o.badge,0);});return h;}
// a properties file, as dbt reads it: dbt's logo and the file's name, then its lines, each {s, at (its row, which can move), a,
// hi (0..1, lit), col (the light's colour)}: keys in blue, values in ink
function d10_yml(ctx,x,y,w,h,name,lines,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,[170,205,255],{glow:12,ea:0.6,fill:"rgba(6,10,20,0.95)"});
  const lw=logo(ctx,"dbt",x+26,y+21,32);T(ctx,name,x+44+lw,y+48,{f:"mono",w:500,size:28,color:rgba(SOFT,1)});ctx.fillStyle="rgba(170,200,245,0.15)";ctx.fillRect(x+14,y+74,w-28,1.2);
  const cw=tw(ctx,"0",28,500,"mono");lines.forEach(l=>{const q=l.a==null?1:clamp(l.a,0,1);if(q<=0.01)return;const ind=l.s.match(/^ */)[0].length,s=l.s.slice(ind),yy=y+126+l.at*44,x0=x+30+ind*cw,ci=s.indexOf(":"),
    k=ci<0?s:s.slice(0,ci+1),v=ci<0?"":s.slice(ci+1);withA(ctx,q,()=>{const hi=clamp(l.hi||0,0,1);if(hi>0.01)withA(ctx,hi,()=>{const col=l.col||TRUST;ctx.fillStyle=rgba(col,0.2);rr(ctx,x0-12,yy-31,tw(ctx,s,28,500,"mono")+24,42,8);ctx.fill();ctx.fillStyle=rgba(col,1);rr(ctx,x0-12,yy-31,4,42,2);ctx.fill();});
      T(ctx,k,x0,yy,{f:"mono",w:500,size:28,color:"rgba(150,200,255,0.98)"});if(v)T(ctx,v,x0+tw(ctx,k,28,500,"mono"),yy,{f:"mono",w:500,size:28,color:rgba(INK,0.96)});});});});}
// what reads the product, downstream, as the catalogue's lineage finds it: [kind, name, the node's centre y, its owner]
const D10_LIN=[["dashboard","households falling behind",292,"head of retail"],["table","report for the regulator",482,"Ama"],["job","collections",672,"head of retail"]];
// where the lineage panel draws its table, and its readers
const D10_LSRC=[140,420,540,124],D10_LNX=960,D10_LNW=520;
// a point on the edge from the table to reader i (u, 0..1)
function d10_linAt(i,u){const x0=D10_LSRC[0]+D10_LSRC[2],y0=D10_LSRC[1]+D10_LSRC[3]/2,x1=D10_LNX,y1=D10_LIN[i][2],f=clamp(u,0,1),g=1-f;
  return[g*g*g*x0+3*g*g*f*(x0+130)+3*g*f*f*(x1-130)+f*f*f*x1,g*g*g*y0+3*g*g*f*y0+3*g*f*f*y1+f*f*f*y1];}
// a node's icon, as Databricks marks a table, a dashboard or a job
function d10_dbIcon(ctx,kind,x,y,s,col){ctx.save();ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=2.4;ctx.lineJoin="round";ctx.lineCap="round";
  if(kind==="table"){rr(ctx,x-s,y-s*0.8,2*s,1.6*s,3);ctx.stroke();ctx.beginPath();ctx.moveTo(x-s,y-s*0.27);ctx.lineTo(x+s,y-s*0.27);ctx.moveTo(x-s,y+s*0.27);ctx.lineTo(x+s,y+s*0.27);ctx.moveTo(x-s*0.3,y-s*0.27);ctx.lineTo(x-s*0.3,y+s*0.8);ctx.stroke();}
  else if(kind==="dashboard"){rr(ctx,x-s,y-s*0.8,2*s,1.6*s,3);ctx.stroke();[[-0.62,0.15],[-0.15,-0.2],[0.32,-0.48]].forEach(([dx,top])=>ctx.fillRect(x+dx*s,y+top*s,s*0.3,(0.55-top)*s));}
  else{[[-0.5,-0.42],[0.5,0.42]].forEach(([dx,dy])=>{rr(ctx,x+dx*s-s*0.45,y+dy*s-s*0.33,s*0.9,s*0.66,3);ctx.stroke();});ctx.beginPath();ctx.moveTo(x-s*0.05,y-s*0.42);ctx.lineTo(x+s*0.5,y-s*0.42);ctx.lineTo(x+s*0.5,y+s*0.09);ctx.stroke();}
  ctx.restore();}
// the lineage panel, as Databricks draws it: its logo and the table's name; the table, focused; and each reader downstream, with
// its edge, as lineage finds it (o.e[i], 0..1; o.draft: the measure's "draft" label)
function d10_lineage(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x-12,y-12,w+24,h+24,22,[170,205,255],{glow:18,ea:0.45,fill:"rgba(8,14,28,0.95)"});
  ctx.save();rr(ctx,x,y,w,h,12);ctx.clip();ctx.fillStyle=DB.canvas;ctx.fillRect(x,y,w,h);ctx.fillStyle="rgba(95,114,129,0.22)";for(let gx=x+24;gx<x+w;gx+=36)for(let gy=y+100;gy<y+h;gy+=36)ctx.fillRect(gx,gy,2.4,2.4);
  ctx.fillStyle=DB.card;ctx.fillRect(x,y,w,72);ctx.fillStyle=DB.line;ctx.fillRect(x,y+72,w,1.2);
  const lw=logo(ctx,"databricks",x+24,y+21,30);T(ctx,"Lineage",x+44+lw,y+48,{w:700,size:28,color:DB.text});T(ctx,"retail.accounts_and_bills",x+70+lw+tw(ctx,"Lineage",28,700),y+48,{f:"mono",w:500,size:28,color:DB.muted});
  // the edges, each drawn as it's found, with its arrow
  D10_LIN.forEach((_,i)=>{const p=clamp(o.e?o.e[i]||0:0,0,1);if(p<=0)return;const P=[];for(let k=0;k<=30;k++)P.push(d10_linAt(i,k/30*p));ctx.save();ctx.strokeStyle=rgba([7,122,157],0.9);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();
    P.forEach(([px,py],k)=>k?ctx.lineTo(px,py):ctx.moveTo(px,py));ctx.stroke();if(p>=1){const[ex,ey]=d10_linAt(i,1);ctx.fillStyle=rgba([7,122,157],0.9);ctx.beginPath();ctx.moveTo(ex,ey);ctx.lineTo(ex-16,ey-8);ctx.lineTo(ex-16,ey+8);ctx.closePath();ctx.fill();}
    else{const[hx,hy]=P[P.length-1];glow(ctx,hx,hy,22,[7,122,157],0.5);}ctx.restore();});
  // the table, focused, as the panel opens on it
  const[sx,sy,sw,sh]=D10_LSRC;dbCard(ctx,sx,sy,sw,sh);ctx.save();ctx.strokeStyle=rgba([7,122,157],1);ctx.lineWidth=3;rr(ctx,sx,sy,sw,sh,8);ctx.stroke();ctx.restore();
  d10_dbIcon(ctx,"table",sx+46,sy+sh/2,17,DB.blue);T(ctx,"table",sx+86,sy+50,{w:600,size:28,color:DB.muted});T(ctx,"accounts_and_bills",sx+86,sy+94,{f:"mono",w:500,size:28,color:DB.text});
  // the readers, each as its edge reaches it
  D10_LIN.forEach(([kind,nm,cy],i)=>{const q=clamp(o.e?(o.e[i]||0)*3-2:0,0,1);if(q<=0.01)return;withA(ctx,q,()=>{const nx=D10_LNX,ny=cy-56;dbCard(ctx,nx,ny,D10_LNW,112);d10_dbIcon(ctx,kind,nx+46,cy,17,DB.blue);
    T(ctx,kind,nx+86,cy-10,{w:600,size:28,color:DB.muted});T(ctx,nm,nx+86,cy+30,{w:700,size:28,color:DB.text});
    if(i===0&&o.draft){const dx=nx+86+tw(ctx,kind,28,600)+20;ctx.fillStyle=rgba(NOTEC[0],1);rr(ctx,dx,cy-40,92,40,6);ctx.fill();T(ctx,"draft",dx+46,cy-11,{w:700,size:28,align:"center",color:"rgba(60,48,20,0.95)"});}});});
  ctx.restore();});}
// draws fn(c) through a CSS filter (such as "grayscale(0.5)") applied once, to a copy of all it draws, not to each stroke: a filter
// on each of the hundreds of strokes in the answer's map and list took about 41 s a frame to render. With no filter, fn draws as it is
function d10_filtered(ctx,filter,fn){ctx.save();if(!filter){fn(ctx);ctx.restore();return;}const cv=ctx.canvas;let L=d10_filtered.L;
  if(!L||L.width!==cv.width||L.height!==cv.height)L=d10_filtered.L=mkCanvas(cv.width,cv.height);
  const g=L.getContext("2d");g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,L.width,L.height);g.save();g.setTransform(ctx.getTransform());g.globalAlpha=ctx.globalAlpha;fn(g);g.restore();
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.filter=filter;ctx.drawImage(L,0,0);ctx.restore();}
