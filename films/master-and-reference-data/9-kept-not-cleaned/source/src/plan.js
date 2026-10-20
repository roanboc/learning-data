/* ===== Kept, not cleaned: the places and the pictures =====
   The places are painted once and kept (post.js): Dujiangyan in the flood season and in the dry season, the campus, the paper with a
   little sky and land for the chapters that explain, a second one for the industries, and three offices: Mei's, the admissions
   office and Yusuf's. The pictures are the film's own things: the river's channels, its gravel, the tripods that close the inner
   channel, the diggers, the cut through the riverbed with its stone horse and iron bars, and the rule; the clean-up's board and the
   chart of duplicates waiting; the intakes' new duplicates and the two applications that made them; the search before create; the
   steward's five gauges, each with an iron bar at its limit; the alert and its case; the government's list of visa types and the
   change an agent drafts; the governance scorecard; and a bank's duplicates, cleaned up every three years. Every name starts with
   m9_ (this film) or M9_. */

// Yusuf Demir, the data governance lead, as the series on data governance draws him (its shared people.js)
if(!PEOPLE.yusuf)PEOPLE.yusuf={name:"Yusuf Demir",role:"Data governance lead",side:"Business",does:"uses",edge:BIZ,seed:15,
  skin:[204,160,124],hair:{style:"side",c:[38,30,28]},beard:[44,34,30],
  top:{kind:"blazer",c:[150,84,62],inner:[236,232,222]},bottom:{c:[52,56,70]},shoe:[70,48,36],build:{sh:74,hip:60,h:1.0}};


/* ---------- lines ---------- */
// a line's length, kept on it
function m9_lens(line){if(line._c)return line._c;const c=[0];for(let i=1;i<line.length;i++)c.push(c[i-1]+Math.hypot(line[i][0]-line[i-1][0],line[i][1]-line[i-1][1]));return line._c=c;}
// the point at u (0..1) of a line's length, and the line's heading there
function m9_at(line,u){const c=m9_lens(line),L=c[c.length-1],d=clamp(u,0,1)*L;let i=1;while(i<c.length-1&&c[i]<d)i++;const k=(d-c[i-1])/((c[i]-c[i-1])||1),a=line[i-1],b=line[i];
  return[lerp(a[0],b[0],k),lerp(a[1],b[1],k),Math.atan2(b[1]-a[1],b[0]-a[0])];}
// the part of a line from u0 to u1 of its length
function m9_sub(line,u0,u1){const c=m9_lens(line),L=c[c.length-1],d0=clamp(u0,0,1)*L,d1=clamp(u1,0,1)*L,o=[m9_at(line,u0).slice(0,2)];
  for(let i=1;i<line.length-1;i++)if(c[i]>d0&&c[i]<d1)o.push(line[i]);o.push(m9_at(line,u1).slice(0,2));return o;}

/* ---------- Dujiangyan ---------- */
// from above the plain, looking up the valley: the Min comes out of a gorge and splits at the levee's head, the fish mouth, and runs on
// past the bottom right as the outer channel; the inner channel runs down the levee's other side, round the foot of the hill, through
// the cut in the rock, and fans out into the plain's canals. Each is a centre line with a width (nearer is wider), so the water, the
// gravel and the diggers can follow it
const M9_MAIN=wc_smooth([[1052,322],[1036,360],[1022,396],[1016,430],[1046,478],[1084,528],[1120,580],[1158,636],[1210,692],[1306,750],[1474,810],[1702,864],[2030,914]],8),
  M9_WMAIN=u=>u<0.188?lerp(74,142,u/0.188):u<0.262?lerp(142,108,(u-0.188)/0.074):lerp(108,300,(u-0.262)/0.738),M9_SPLIT=0.21,M9_SEEN=0.05,M9_HEAD=0.088;
const M9_IN=wc_smooth([[998,428],[968,470],[944,520],[922,568],[896,612],[850,644],[782,662],[706,672],[640,676],[590,680]],8),
  M9_WIN=u=>u<0.06?lerp(14,56,u/0.06):lerp(56,38,(u-0.06)/0.94);
// the canals the inner channel fans into on the plain, each leaving another (the first leaves the cut) and dividing again, a little
// uneven, as dug. Each keeps its line (p), its width (w: nearer is wider), its length (L), and how far the water has come from the cut
// when it reaches its head (d0), so the water can fill them in order, and drain them
const M9_CAN=(()=>{const net=[[-1,0,[[624,678],[590,680],[540,688],[470,700],[400,716]]],[0,1,[[320,704],[220,688],[100,676],[-60,668]]],
  [0,1,[[352,754],[292,804],[200,866]]],[2,1,[[110,880],[-60,902]]],[2,1,[[172,940],[134,1020],[96,1100]]],
  [0,0.36,[[512,756],[498,846],[482,960],[468,1100]]],[1,0.42,[[196,648],[100,626],[-60,612]]],[5,0.5,[[440,830],[352,862],[250,908],[150,960],[60,1020]]]],o=[];
  net.forEach(([pa,f,pts],i)=>{const head=pa<0?pts[0]:m9_at(o[pa].p,f).slice(0,2),p=wc_jitter(wc_smooth(pa<0?pts:[head].concat(pts),10),2.4,60+i,0.02);p[0]=head;
    const c={p,L:m9_lens(p)[p.length-1],d0:pa<0?0:o[pa].d0+o[pa].L*f,lv:pa<0?0:o[pa].lv+1};
    c.w=u=>(c.lv?[0,11,8,7][Math.min(3,c.lv)]:u<0.15?37:lerp(37,13,(u-0.15)/0.85))*(1+clamp((m9_at(p,u)[1]-690)/410,0,1)*0.55);o.push(c);});return o;})(),
  M9_CDMAX=Math.max(...M9_CAN.map(c=>c.d0+c.L));
// where the tripods close the inner channel, near its head
const M9_CLOSE=0.12;
// a band along a line, its width wf(u) at u of the way along, times k
function m9_band(line,wf,k){k=k||1;const L=[],R=[],n=line.length;for(let i=0;i<n;i++){const a=line[Math.max(0,i-1)],b=line[Math.min(n-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,
  w=(typeof wf==="function"?wf(i/(n-1)):wf)*k/2;L.push([line[i][0]-dy/l*w,line[i][1]+dx/l*w]);R.push([line[i][0]+dy/l*w,line[i][1]-dx/l*w]);}return L.concat(R.reverse());}
// a line's edge, at w/2 to its left (s=1) or right (s=-1), plus pad
function m9_edge(line,wf,s,pad){const n=line.length;return line.map((p,i)=>{const a=line[Math.max(0,i-1)],b=line[Math.min(n-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,
  ww=((typeof wf==="function"?wf(i/(n-1)):wf)/2+(pad||0))*s;return[p[0]-dy/l*ww,p[1]+dx/l*ww];});}
// the hill the inner channel runs along, ending at the cut; the separated rock across the cut
const M9_HILLTOP=[[598,636],[584,596],[594,552],[622,512],[668,476],[724,450],[782,434],[836,428],[882,436],[918,450],[948,462]];
// the hill's edge along the inner channel: close to the water, but higher at the cut, where its rock wall stands over the water
function m9_cutPad(x){return lerp(12,30,clamp((722-x)/60,0,1));}
function m9_hillPts(){const n=M9_IN.length;return M9_HILLTOP.concat(M9_IN.map((p,i)=>m9_edge(M9_IN,M9_WIN,1,m9_cutPad(p[0]))[i]).filter(p=>p[1]>468&&p[0]>612));}
const M9_ROCK=wc_smooth([[620,704],[652,692],[704,690],[744,698],[764,714],[740,734],[680,742],[634,734]],4);
// the levee between the channels, from the fish mouth down, where its trees stand
const M9_LEVEE=wc_smooth([[1004,470],[1004,506],[1008,540],[1014,572],[1024,606]],6);
// how far up the valley's floor reaches, below the mountains
const m9_floor=x=>338+0.074*Math.abs(x-1030)+6*Math.sin(x/140);
// the colours of the two seasons
const M9_WET={far:[176,198,210],range:[146,178,172],flank:[124,162,136],forest:[98,140,112],floor:[170,200,136],
  fields:[[156,194,112],[178,204,124],[222,206,104],[146,184,116],[196,206,134],[170,196,150]],tree:[92,142,92],hill:[124,166,110],crown:[[86,138,88],[110,160,98],[140,182,112]],
  bank:[228,216,184],rock:[178,164,146]};
const M9_DRY={far:[192,200,208],range:[172,184,180],flank:[160,172,152],forest:[134,152,128],floor:[208,204,166],
  fields:[[214,206,168],[202,198,154],[186,196,144],[220,208,176],[198,192,162],[180,192,150]],tree:[112,146,104],hill:[152,170,128],crown:[[112,140,100],[134,158,112],[164,180,132]],
  bank:[216,208,188],rock:[184,172,156]};
const M9_GRAVEL=[[176,168,156],[198,188,170],[150,144,138],[214,204,186]];

// the mountains: three ranges, paler as they go back, forest on the nearer slopes, and the gorge the Min comes out of
function m9_mountains(ctx,C){
  wc_land(ctx,x=>222-70*Math.exp(-Math.pow((x-250)/170,2))-98*Math.exp(-Math.pow((x-770)/150,2))-60*Math.exp(-Math.pow((x-1270)/200,2))-94*Math.exp(-Math.pow((x-1690)/150,2))+5*Math.sin(x/37),C.far,0.16,{line:false});
  const rg=x=>268-84*Math.exp(-Math.pow((x-470)/220,2))-56*Math.exp(-Math.pow((x-1010)/110,2))-104*Math.exp(-Math.pow((x-1480)/230,2))+6*Math.sin(x/53+1);
  wc_land(ctx,rg,C.range,0.32,{line:false});wc_forest(ctx,x=>rg(x)+18,C.range,0.36,41,{h:20,w:14});
  const fl=x=>318-150*Math.exp(-Math.pow((x-470)/260,2))-170*Math.exp(-Math.pow((x-1560)/290,2))-30*Math.exp(-Math.pow((x-900)/80,2))-30*Math.exp(-Math.pow((x-1180)/80,2))+7*Math.sin(x/61);
  wc_land(ctx,fl,C.flank,0.5,{line:false});wc_forest(ctx,x=>fl(x)+22,C.forest,0.52,43,{h:26,w:16});}
// M9_SEEN: how far along the Min it comes out from behind the ridges; M9_HEAD: where the inner channel leaves it
// the gorge's two sides: nearer ridges, darker, conifers along their crests and trees down to the water; the right one first, the left
// one over it and over the Min, so the river comes out from behind it. Each is its crest, then its foot from right to left
const M9_GORGE=[[wc_smooth([[1500,352],[1420,318],[1330,282],[1240,262],[1160,266],[1100,290],[1062,322],[1046,348]],5),[[1046,348],[1090,362],[1200,366],[1340,362],[1500,358]]],
  [wc_smooth([[600,356],[690,330],[780,294],[858,266],[930,270],[990,294],[1040,322],[1084,350]],5),[[1084,350],[1060,368],[1010,378],[930,376],[800,370],[680,366],[600,362]]]];
function m9_gorge(ctx,C){M9_GORGE.forEach(([crest,foot],i)=>{const R=wc_rng(81+i),top=[],cr=wc_resampleOpen(crest,9);
  cr.forEach((p,k)=>{top.push(k%2?[p[0],p[1]-(8+R()*12)]:[p[0],p[1]+2]);});
  wc_wash(ctx,top.concat(foot.slice(1)),C.forest,{kind:"forest",line:false,depth:0.66,seed:301+i*40});
  // darker towards the water and the valley, where the trees stand thicker
  ctx.save();wc_tr(ctx,top.concat(foot.slice(1)));ctx.clip();ctx.globalCompositeOperation="multiply";const b=wc_bbox(foot.concat(crest)),g=ctx.createLinearGradient(0,b.y0,0,b.y1+6);
  g.addColorStop(0,rgba(wc_dim(C.forest,0.3),0));g.addColorStop(1,rgba(wc_dim(C.forest,0.3),0.42));ctx.fillStyle=g;ctx.fillRect(b.x0-20,b.y0-30,b.w+40,b.h+60);ctx.restore();
  // broadleaf trees along the foot, thicker by the water
  const ft=wc_smooth(foot,4);m9_canopy(ctx,wc_band(ft,30,12),[wc_dim(C.crown[0],0.08),C.crown[0]],Math.round(m9_lens(ft)[ft.length-1]/16),311+i,0.62,0.7);});}
// the plots of the valley and the plain, in perspective towards the gorge: rows that widen as they come nearer, cut into plots, a few
// of them split again; the nearest show their furrows
function m9_fields(ctx,C,seed){const R=wc_rng(seed),yh=262,vx=1030,yr=800,rows=[];for(let b=0;;b++){const y=yh+64*Math.pow(1.2,b)+(b?R()*10:0);rows.push(y);if(y>H+60)break;}
  const X=(u,y)=>vx+(u-vx)*(y-yh)/(yr-yh);
  for(let r=0;r<rows.length-1;r++){const y0=rows[r],y1=rows[r+1],us=[];for(let u=-3800+R()*200;u<4600;u+=170+R()*260)us.push(u);
    for(let k=0;k<us.length-1;k++){const g=0.8+0.16*r,x00=X(us[k],y0)+g,x01=X(us[k+1],y0)-g,x10=X(us[k],y1)+g,x11=X(us[k+1],y1)-g;
      if(Math.max(x01,x11)<-60||Math.min(x00,x10)>W+60)continue;const dp=0.45+0.55*clamp((y0-340)/560,0,1);
      const plot=(a,b,c,d,col,sd)=>wc_wash(ctx,[a,b,c,d],col,{kind:"field",line:false,depth:dp,a:0.72+R()*0.22,seed:sd});
      const c1=C.fields[Math.floor(R()*C.fields.length)];
      if(r>3&&R()<0.3){const m0=lerp(x00,x01,0.5),m1=lerp(x10,x11,0.5);plot([x00,y0+g],[m0-g,y0+g],[m1-g,y1-g],[x10,y1-g],c1,r*31+k);
        plot([m0+g,y0+g],[x01,y0+g],[x11,y1-g],[m1+g,y1-g],C.fields[Math.floor(R()*C.fields.length)],r*37+k);}
      else plot([x00,y0+g],[x01,y0+g],[x11,y1-g],[x10,y1-g],c1,r*31+k);
      if(y0>640&&R()<0.5){ctx.save();ctx.strokeStyle=rgba(wc_dim(c1,0.25),0.22);ctx.lineWidth=1.2;for(let f=0.15;f<1;f+=0.17){ctx.beginPath();ctx.moveTo(lerp(x00,x01,f),y0+g+2);ctx.lineTo(lerp(x10,x11,f),y1-g-2);ctx.stroke();}ctx.restore();}}}}
// the plain's villages: clumps of trees and bamboo, a low house showing here and there; nearer is larger
const M9_CLUMPS=[[70,470],[250,452],[420,500],[150,560],[330,590],[70,650],[460,610],[240,690],[420,760],[120,800],[300,830],[660,770],[800,820],[960,760],[1120,820],[1180,700],
  [1330,660],[1500,620],[1640,700],[1800,640],[1600,540],[1420,520],[1260,560],[1760,500],[860,380],[1180,400],[1340,440],[560,440],[740,840],[1020,880],[1880,780]];
function m9_clumps(ctx,C){const R=wc_rng(19);M9_CLUMPS.forEach(([x,y],i)=>{const s=0.42+clamp((y-400)/500,0,1)*1.05,dp=0.55+0.4*clamp((y-400)/500,0,1),col=i%3?C.tree:wc_lit(C.tree,0.08);
  m9_clump(ctx,x,y,s,col,dp,200+i*7);
  // a low house showing at the clump's foot: white walls, a grey tiled roof
  if(R()<0.45){const hx=x+(R()-0.5)*36*s,hy=y+2*s;wc_flat(ctx,wc_rect(hx-14*s,hy-11*s,28*s,11*s),[244,240,230],dp,"wall");wc_flat(ctx,[[hx-18*s,hy-10*s],[hx+18*s,hy-10*s],[hx+12*s,hy-19*s],[hx-12*s,hy-19*s]],[112,114,124],dp,"roof");}});}
// a clump of trees: one silhouette whose edge is its crowns, a few crowns' shaded sides, darker underneath, and its shadow on the field
function m9_clump(ctx,x,y,s,col,dp,seed){const R=wc_rng(seed),rx=(34+R()*20)*s,ry=(22+R()*10)*s,hull=[];
  for(let i=0;i<=12;i++){const a=Math.PI+i/12*Math.PI;hull.push([x+Math.cos(a)*rx,y-ry*0.2+Math.sin(a)*ry*(0.82+0.3*Math.sin(i*1.7+seed))]);}hull.push([x+rx*0.9,y+ry*0.06],[x-rx*0.9,y+ry*0.06]);
  ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba(wc_haze(wc_dim(col,0.4),dp),0.26);ctx.beginPath();ctx.ellipse(x+rx*0.28,y+ry*0.16,rx*1.04,ry*0.26,0,0,TAU);ctx.fill();ctx.restore();
  wc_wash(ctx,m9_scallop(hull,10*s+5,seed),col,{kind:"land",line:false,depth:dp,seed});
  const sh=[m9_crescent(x,y-ry*0.42,rx*0.92,ry*0.62)];for(let k=0,n=2+Math.floor(R()*3);k<n;k++)sh.push(m9_crescent(x+(R()-0.5)*rx*1.2,y-ry*(0.45+R()*0.45),rx*0.3,ry*0.36));
  wc_wash(ctx,sh,wc_dim(col,0.24),{kind:"dab",flat:true,depth:dp,a:0.5,seed:seed+3});}
// a shape's edge, resampled every s px, each step bulging outward in an arc: the edge of a wood is its trees' crowns. Turned the way
// wc_ell turns, so it joins with crowns in one wash
function m9_scallop(pts,s,seed){const R=wc_rng(seed),p=wc_resample(pts,s);let A=0;for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length];A+=a[0]*b[1]-b[0]*a[1];}
  const sg=A>0?1:-1,o=[];for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,h=l*(0.28+R()*0.22);
    for(let k=0;k<6;k++){const t=k/6,bu=Math.sin(Math.PI*t)*h;o.push([a[0]+dx*t+dy/l*sg*bu,a[1]+dy*t-dx/l*sg*bu]);}}return A>0?o:o.reverse();}
// a crown's shaded side, away from the light at the top left: a crescent, thick at the bottom right, thin at the left
function m9_crescent(x,y,rx,ry){const o=[],a0=-0.35,da=Math.PI+0.2;for(let i=0;i<=10;i++){const a=a0+i/10*da;o.push([x+Math.cos(a)*rx,y+Math.sin(a)*ry]);}
  for(let i=10;i>=0;i--){const a=a0+i/10*da;o.push([x-rx*0.18+Math.cos(a)*rx*0.8,y-ry*0.3+Math.sin(a)*ry*0.72]);}return o;}
// a wood over an area: one wash whose edge is the crowns', then each crown's shaded side, the crescents joining where they meet, so the
// trees read as a wood, not as spots. cols: [shade, body]; n crowns of size sz (nearer, lower ones a little larger)
function m9_canopy(ctx,pts,cols,n,seed,sz,dp){dp=dp||0.75;sz=sz||1;const R=wc_rng(seed),b=wc_bbox(pts),sh=[],M=ctx.getTransform();ctx.save();wc_tr(ctx,pts);
  // (the path test is in the canvas's own pixels, so each point goes through the drawing's transform first, for a valley painted larger)
  for(let i=0,tries=0;i<n&&tries<n*20;tries++){const x=b.x0+R()*b.w,y=b.y0+R()*b.h,d=M.transformPoint(new DOMPoint(x,y));if(!ctx.isPointInPath(d.x,d.y))continue;i++;
    const s=sz*(0.75+clamp((y-b.y0)/Math.max(1,b.h),0,1)*0.5)*(0.8+R()*0.4);sh.push(m9_crescent(x,y,17*s,14*s));}ctx.restore();
  wc_wash(ctx,m9_scallop(pts,24*sz,seed),cols[1],{kind:"land",line:false,depth:dp,seed});wc_wash(ctx,sh,cols[0],{kind:"dab",flat:true,depth:dp,a:0.62,seed:seed+1});}
// a thin shape washed flat: cleared to paper and filled along the same edge, so no paper shows round it
function m9_flat(ctx,pts,col,a,seed,gran){const p=wc_jitter(wc_resample(pts,8),0.8,seed||5,0.08);ctx.save();wc_tr(ctx,p);ctx.fillStyle=rgba(WC_PAPER,1);ctx.fill();
  ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba(col,a==null?0.85:a);ctx.fill();if(gran){ctx.clip();ctx.globalAlpha*=0.55;ctx.drawImage(WC.gran,0,0,W,H);}ctx.restore();}
// a channel's banks of sand and gravel, then its water (lower in the dry season: k of its width)
function m9_bank(ctx,line,wf,C,pad){wc_wash(ctx,m9_band(line,u=>wf(u)+pad[0]+(pad[1]-pad[0])*u),C.bank,{kind:"ground",line:false,seed:11});}
// a bed of gravel, bare: the dry inner channel, pebbles and all
function m9_bed(ctx,line,wf,seed){const R=wc_rng(seed||23);wc_wash(ctx,m9_band(line,wf),M9_GRAVEL[1],{kind:"ground",line:false,seed:29});
  for(let i=0;i<300;i++){const u=0.04+R()*0.96,p=m9_at(line,u),ww=wf(u)*0.46,o=(R()*2-1)*ww,x=p[0]-Math.sin(p[2])*o,y=p[1]+Math.cos(p[2])*o,r=1.4+R()*2.2;
    wc_wash(ctx,wc_ell(x,y,r*1.3,r,8),M9_GRAVEL[i%4],{kind:"dab",flat:true,a:0.8});}}
// where two segments cross: [how far along the first, along the second, the point], or null
function m9_cross(p,q,a,b){const d=(q[0]-p[0])*(b[1]-a[1])-(q[1]-p[1])*(b[0]-a[0]);if(Math.abs(d)<1e-9)return null;
  const s=((a[0]-p[0])*(b[1]-a[1])-(a[1]-p[1])*(b[0]-a[0]))/d,t=((a[0]-p[0])*(q[1]-p[1])-(a[1]-p[1])*(q[0]-p[0]))/d;return s>=0&&s<1&&t>=0&&t<1?[s,t,[p[0]+(q[0]-p[0])*s,p[1]+(q[1]-p[1])*s]]:null;}
function m9_inside(pts,x,y){let c=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const a=pts[i],b=pts[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])c=!c;}return c;}
// two shapes turned the same way as one outline, when the second's outline leaves the first once and comes back once (a channel leaving
// a river): the second's outline outside the first, then the first's, so the water is one wash with no edge where the channel leaves
function m9_merge(A,B){const X=[],n=A.length,m=B.length;for(let j=0;j<m;j++)for(let i=0;i<n;i++){const h=m9_cross(B[j],B[(j+1)%m],A[i],A[(i+1)%n]);if(h)X.push({j,i,s:h[0],t:h[1],pt:h[2]});}
  if(X.length!==2)return[A,B];X.sort((u,v)=>(u.j+u.s)-(v.j+v.s));const [X0,X1]=X,mid=X0.j<X1.j?B[X0.j+1]:[(X0.pt[0]+X1.pt[0])/2,(X0.pt[1]+X1.pt[1])/2];
  let P,Q,part=[];if(!m9_inside(A,mid[0],mid[1])){P=X0;Q=X1;for(let j=X0.j+1;j<=X1.j;j++)part.push(B[j]);}else{P=X1;Q=X0;for(let j=X1.j+1;j<X1.j+1+((X0.j-X1.j+m)%m);j++)part.push(B[j%m]);}
  const o=[P.pt].concat(part,[Q.pt]);let k=Q.i;do{k=(k+1)%n;o.push(A[k]);}while(k!==P.i);return o;}
// the river's water, the Min on as the outer channel (k: how full it is below the split), and the inner channel's down to u1 of its
// length, as one wash; the inner channel and its canals also on their own, kept, so in the dry season the water can drain and come back
function m9_mainBand(k){return m9_band(M9_MAIN,u=>M9_WMAIN(u)*lerp(1,k,clamp((u-M9_SPLIT)/0.1,0,1)));}
function m9_rivers(ctx,k,u1){const inner=u1>=1?m9_band(M9_IN,M9_WIN):m9_band(m9_sub(M9_IN,0,u1),u=>M9_WIN(u*u1));ctx.save();m9_beforeEnd(ctx);
  wc_wash(ctx,m9_merge(m9_mainBand(k),inner),WCP.water,{kind:"water",line:false,seed:M9_WSEED});ctx.restore();}
const M9_WSEED=33;
// not past the cut's end, where the canals take the water on
function m9_beforeEnd(ctx){ctx.beginPath();ctx.rect(596,-80,W,H+160);ctx.clip();}
// a channel's water: cleared to paper a little inside its edge, then washed, so the edge darkens on the bank instead of showing paper
function m9_water(ctx,line,wf,seed){m9_clear(ctx,m9_band(line,u=>Math.max(0,wf(u)-6)));wc_wash(ctx,m9_band(line,wf),WCP.water,{kind:"water",bare:true,line:false,seed});}
function m9_clear(ctx,pts){ctx.save();wc_tr(ctx,pts);ctx.fillStyle=rgba(WC_PAPER,1);ctx.fill();ctx.restore();}
function m9_innerWaterPaint(ctx){m9_flat(ctx,M9_CAN.map(c=>m9_band(c.p,c.w)),M9_CANW,0.97,35,true);ctx.save();m9_beforeEnd(ctx);m9_water(ctx,M9_IN,M9_WIN,M9_WSEED);ctx.restore();}
// the canals' water, flat, as dark as the washed channels' (whose three layers, blotches and grain darken WCP.water)
const M9_CANW=[124,168,212];
function m9_innerWater(){return wc_kept("innerWater",W,H,m9_innerWaterPaint);}
// the fish mouth: the levee's head, faced with stone, pointing upstream where the river splits
const M9_FISH=[[1003,434],[1018,456],[1018,494],[1008,516],[994,516],[986,494],[986,458]];
// the cut's wall on the hill's side, facing us: rock, between the hill's trees and the water, its top broken, its layers sloping, a few
// cracks down it, and darker where it meets the water
function m9_cutWall(ctx,C){const seg=m9_sub(M9_IN,0.78,1),wf=u=>M9_WIN(0.78+0.22*u),R=wc_rng(9),n=seg.length,lo=m9_edge(seg,wf,1,-3),
  top=seg.map((p,i)=>m9_edge(seg,wf,1,-3+(m9_cutPad(p[0])+6)*clamp((p[0]-590)/22,0,1)*clamp((736-p[0])/26,0,1))[i]).map(([x,y],i)=>[x,y+(i%2?-3:2)*R()]),face=top.concat(lo.slice().reverse()),rk=wc_dim(C.rock,0.08);
  wc_wash(ctx,face,rk,{kind:"ground",line:false,seed:9});
  const at=(i,k)=>[lerp(lo[i][0],top[i][0],k),lerp(lo[i][1],top[i][1],k)],st=[];
  for(const [k0,k1,a] of [[0.22,0.3,0.05],[0.5,0.56,-0.04],[0.74,0.8,0.03]]){let i=Math.floor(R()*4);while(i<n-3){const j=Math.min(n-1,i+3+Math.floor(R()*6)),L=[],U=[];
    for(let q=i;q<=j;q++){const sl=(q-i)/(n-1)*a*8;L.push(at(q,k0+sl));U.push(at(q,k1+sl));}st.push(L.concat(U.reverse()));i=j+2+Math.floor(R()*3);}}
  wc_wash(ctx,st,wc_dim(C.rock,0.3),{kind:"dab",flat:true,a:0.42,seed:10});
  ctx.save();ctx.strokeStyle=rgba(wc_dim(C.rock,0.5),0.55);ctx.lineWidth=1.4;ctx.lineCap="round";
  for(const k of [0.14,0.37,0.55,0.83]){const i=Math.round(k*(n-1)),a=at(i,0.05),b=at(Math.min(n-1,i+1),0.5),c=at(i,0.9);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0]+R()*3,b[1]);ctx.lineTo(c[0]-R()*2,c[1]);ctx.stroke();}ctx.restore();
  wc_wash(ctx,m9_band(m9_edge(seg,wf,1,1),5),wc_dim(C.rock,0.4),{kind:"dab",flat:true,a:0.4,seed:12});}
// the stretches of canal lined with trees: which canal, from u0 to u1 of it, a seed, and which side
const M9_CANTREES=[[0,0.3,0.62,1,1],[1,0.18,0.5,2,1],[5,0.12,0.42,3,-1],[2,0.2,0.75,4,-1],[7,0.3,0.6,5,1],[1,0.62,0.86,6,-1]];
const cc0=C=>[C.crown[0],C.crown[1]];
// the valley, in the flood season or the dry one
function m9_valley(ctx,o){o=o||{};const dry=!!o.dry,C=dry?M9_DRY:M9_WET;
  wc_sky(ctx,340,dry?13:9,{clouds:dry?4:3,cx:140,cw:1640,cy:30,ch:110,sun:dry?null:[1660,92]});m9_mountains(ctx,C);
  // the valley's floor, its fields and villages
  wc_land(ctx,m9_floor,C.floor,0.5,{line:false});ctx.save();const fp=[];for(let x=-60;x<=W+60;x+=10)fp.push([x,m9_floor(x)+4]);fp.push([W+60,H+60],[-60,H+60]);wc_tr(ctx,fp);ctx.clip();
  m9_fields(ctx,C,dry?7:5);ctx.restore();m9_clumps(ctx,C);
  // the Min, on as the outer channel, lower in the dry season, then the gorge's sides over where it comes from
  m9_bank(ctx,M9_IN,M9_WIN,C,[14,16]);m9_bank(ctx,M9_MAIN,M9_WMAIN,C,[20,64]);
  // the inner channel: in the flood season, its water and its canals'; in the dry season, its bed and its canals bare, the water held
  // back at the tripods
  if(dry){m9_flat(ctx,M9_CAN.map(c=>m9_band(c.p,c.w)),M9_GRAVEL[1],0.85,50,true);ctx.save();m9_beforeEnd(ctx);m9_bed(ctx,M9_IN,M9_WIN,23);ctx.restore();}
  else m9_flat(ctx,M9_CAN.map(c=>m9_band(c.p,c.w)),M9_CANW,0.97,35,true);
  m9_rivers(ctx,dry?0.62:1,dry?M9_CLOSE:1);m9_gorge(ctx,C);
  M9_CANTREES.forEach(([c,u0,u1,sd,sg])=>{const cn=M9_CAN[c],R=wc_rng(400+sd);for(let u=u0;u<u1;u+=(16+R()*14)/cn.L){const p=m9_at(cn.p,u),w=cn.w(u)/2+8,
    x=p[0]-Math.sin(p[2])*w*sg,y=p[1]+Math.cos(p[2])*w*sg,s=0.24+clamp((y-600)/500,0,1)*0.22;if(R()<0.85)m9_clump(ctx,x,y,s*(0.8+R()*0.4),C.tree,0.6+0.3*clamp((y-600)/500,0,1),500+sd*31+Math.round(u*97));}});
  // the hill, wooded, with the cut at its end; the separated rock across the cut
  const hp=m9_hillPts(),cc=[C.crown[0],C.crown[1]];m9_cutWall(ctx,C);m9_canopy(ctx,hp,cc,170,37,1.0,0.8);
  wc_wash(ctx,M9_ROCK,C.rock,{kind:"build",lw:1.3,seed:17});m9_canopy(ctx,M9_ROCK.map(([x,y])=>[x,y-12]),cc,8,39,0.7,0.8);
  // the levee between the channels, tree-lined, and its head, the fish mouth, faced with courses of stone
  m9_canopy(ctx,wc_band(M9_LEVEE,12,34),cc,16,41,0.72,0.8);wc_wash(ctx,M9_FISH,[208,198,178],{kind:"build",lw:1.4,seed:23});
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.35);ctx.lineWidth=1.2;for(const y of [470,486,502]){ctx.beginPath();ctx.moveTo(990,y);ctx.lineTo(1014,y-2);ctx.stroke();}ctx.restore();
}

/* ---------- the university's places ---------- */
// today: the university's old building and its glass wing, a lawn, terraced houses across the street, a lamp (as in film 1)
const M9_LAWN=x=>664+5*Math.sin(x/300);
function m9_campus(ctx){const P=WCP;wc_sky(ctx,716,2,{sun:[1560,170]});
  wc_skyline(ctx,624,P.city,0.1,5);wc_treeRow(ctx,()=>640,-40,1980,58,70,0.24,21,P.leaf2);wc_land(ctx,M9_LAWN,P.lawn,0.42);
  wc_contact(ctx,140,770,668,0.46,0.22);wc_quad(ctx,150,668,0.46,0.62);wc_glassWing(ctx,762,668,150,170,0.48);
  [[1210,P.plaster],[1410,P.brickHouse,P.blueDoor],[1610,P.blueHouse],[1810,P.plaster]].forEach(([x,c,d])=>wc_terrace(ctx,x,742,232,c,0.56,{k:0.86,door:d}));
  wc_wash(ctx,[[1180,742],[W+60,742],[W+60,770],[1170,770]],P.hedge,{depth:0.6,kind:"hedge",lw:1.5});
  wc_roundTree(ctx,70,700,250,0.5);wc_roundTree(ctx,990,690,226,0.5,P.leaf2);wc_roundTree(ctx,1120,706,196,0.52);
  wc_wash(ctx,[[-60,782],[W+60,770],[W+60,H+60],[-60,H+60]],P.paving,{depth:0.72,kind:"ground",line:false});
  wc_wash(ctx,wc_band(wc_smooth([[540,668],[560,720],[620,800],[740,900],[880,1090]],8),30,240),wc_lit(P.paving,0.08),{depth:0.62,kind:"path",line:false});
  ctx.save();ctx.strokeStyle=rgba(wc_dim(P.paving,0.14),0.55);ctx.lineWidth=2;for(let i=0;i<8;i++){const y=800+i*i*5;ctx.beginPath();ctx.moveTo(-20,y);ctx.lineTo(W+20,y-10);ctx.stroke();}
  for(let i=-10;i<24;i++){ctx.beginPath();ctx.moveTo(960+i*54,782);ctx.lineTo(960+i*190,1080);ctx.stroke();}ctx.restore();
  wc_lamp(ctx,1186,846,300,0.72);}
// paper, with a little sky and a strip of land, for the chapters that explain; a second, for the industries
function m9_plain(ctx){wc_sky(ctx,836,3,{clouds:3});wc_land(ctx,x=>826+16*Math.sin(x/320+1),WCP.far,0.35,{line:false});wc_land(ctx,x=>882+10*Math.sin(x/240),WCP.near,0.75,{line:false});}
function m9_plainB(ctx){wc_sky(ctx,846,7,{clouds:4,cx:120,cw:1680});wc_land(ctx,x=>842+20*Math.sin(x/380+2),WCP.far,0.35,{line:false});wc_land(ctx,x=>898+12*Math.sin(x/260+1),WCP.near,0.75,{line:false});}
// an office: a wall, a tall window onto the campus at wx, a floor; each office has its own wall
function m9_room(ctx,wall,wx,seed){const P=WCP;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,900),wall,{kind:"plaster",line:false,seed});wc_wash(ctx,wc_rect(-40,858,W+80,260),P.floor,{kind:"ground",line:false,seed:seed+1});
  wc_wash(ctx,wc_rect(-40,846,W+80,18),wc_dim(wall,0.14),{kind:"trim",line:false,flat:true});
  ctx.save();ctx.beginPath();ctx.rect(wx+12,112,436,560);ctx.clip();wc_sky(ctx,560,seed+3,{clouds:2,cx:wx+20,cw:380,cy:150,ch:120});
  wc_land(ctx,x=>600+8*Math.sin(x/90),P.lawn,0.42,{line:false});wc_part(ctx,wc_rect(wx+270,330,70,270),WCP.stone,0.4);wc_part(ctx,[[wx+262,330],[wx+348,330],[wx+305,250]],WCP.slate,0.4);
  wc_roundTree(ctx,wx+90,640,220,0.5);wc_roundTree(ctx,wx+400,650,190,0.5,P.leaf2);ctx.restore();
  for(const r of [wc_rect(wx,100,460,16),wc_rect(wx,100,16,584),wc_rect(wx+444,100,16,584),wc_rect(wx+222,100,16,584),wc_rect(wx,384,460,12)])wc_wash(ctx,r,WC_PAPER,{kind:"trim",lw:1.4});
  wc_wash(ctx,wc_rect(wx-20,676,500,22),wc_dim(wall,0.1),{kind:"trim",lw:1.5});}
const WC_PLACES={river:ctx=>m9_valley(ctx,{}),riverDry:ctx=>m9_valley(ctx,{dry:true}),campus:m9_campus,plain:m9_plain,plainB:m9_plainB,
  office:ctx=>m9_room(ctx,WCP.wallIn,1400,4),admissions:ctx=>m9_room(ctx,[232,236,226],1400,8),gov:ctx=>m9_room(ctx,[240,228,222],60,12)};
// a place, under the camera
function m9_place(ctx,key){ctx.drawImage(wc_place(key),0,0,W,H);}
// a veil of paper over the whole frame, so the one thing drawn after it stands out
function m9_hush(ctx,a){if(a<=0.01)return;ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle=rgba(WC_PAPER,a);ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);ctx.restore();}
// a person facing the other way when o.flip: someone who points at what's on their left, so the hand stays in the frame
function m9_person(ctx,id,x,y,s,o){if(!o.flip)return person(ctx,id,x,y,s,o);ctx.save();ctx.translate(x,0);ctx.scale(-1,1);person(ctx,id,0,y,s,o);ctx.restore();}

/* ---------- 1. the river at work ---------- */
// the current: light lifted off the water, n streaks moving down a line at speed px a second, within k of its width
function m9_flow(ctx,t,line,w,n,speed,seed,a,k,ua){if(a<=0.01)return;ua=ua||0;const c=m9_lens(line),L=c[c.length-1],R=wc_rng(seed);ctx.save();ctx.lineCap="round";
  for(let i=0;i<n;i++){const u0=R(),off=(R()*2-1)*(k||0.34),len=14+R()*26,sp=speed*(0.8+R()*0.4),u=((u0*L+t*sp)%L)/L;if(u<ua)continue;const p=m9_at(line,u),ww=w(u),
    ox=-Math.sin(p[2])*off*ww,oy=Math.cos(p[2])*off*ww,f=Math.sin(Math.PI*clamp((u-ua)*8,0,1))*Math.sin(Math.PI*clamp((1-u)*8,0,1));
    ctx.strokeStyle=rgba([255,255,255],0.55*a*clamp(f+0.4,0,1));ctx.lineWidth=2+ww/60;ctx.beginPath();ctx.moveTo(p[0]+ox,p[1]+oy);ctx.lineTo(p[0]+ox-Math.cos(p[2])*len*(0.6+ww/300),p[1]+oy-Math.sin(p[2])*len*(0.6+ww/300));ctx.stroke();}
  ctx.restore();}
// the gravel the river carries: grains down the Min, most of them turning down the outer channel; one in five takes the inner (none, when
// the inner channel is closed: outer)
function m9_gravel(ctx,t,t0,a,outer){if(a<=0.01)return;const R=wc_rng(61),n=26;for(let i=0;i<n;i++){const ph=R()*3.6,inner=i%5===2,off=(R()*2-1)*0.3,r=4.5+R()*3,col=M9_GRAVEL[i%3];
  if(outer&&inner)continue;
  const u=((t-t0)+ph)/3.6;if(u<0)continue;const k=u%1,cyc=Math.floor(u);if((t-t0)+ph<3.6*cyc)continue;
  let p,w,of=off;if(k<0.42||!inner){const v=inner?lerp(M9_SEEN,M9_HEAD,k/0.42):lerp(M9_SEEN,0.62,k);p=m9_at(M9_MAIN,v);w=M9_WMAIN(v);if(inner)of=lerp(off,0.17,clamp(k/0.3,0,1));}
  else{const v=(k-0.42)/0.58*0.7;p=m9_at(M9_IN,v);w=M9_WIN(v);of=0;}
  const x=p[0]-Math.sin(p[2])*of*w,y=p[1]+Math.cos(p[2])*of*w,fa=a*clamp(k*12,0,1)*clamp((1-k)*10,0,1);if(fa<=0.01)continue;
  withA(ctx,fa,()=>{ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.ellipse(x,y,r*1.25,r,p[2],0,TAU);ctx.fill();ctx.strokeStyle=rgba(WC_PENCIL,0.7);ctx.lineWidth=1.3;ctx.stroke();});}}
// the inner channel's water, drawn over the dry season's bare bed, from u0 to u1 of its length; its canals' water, from D0 to D1 px
// along them from the cut
function m9_waterIn(ctx,u0,u1,D0,D1){const im=m9_innerWater();
  // each clipped a little inside its edge, so the kept wash's rim doesn't show over the bank: the bed's edge reads as the waterline
  const clip=(line,a,b,wf)=>{if(b-a<0.002)return;ctx.save();wc_tr(ctx,m9_band(m9_sub(line,a,b),u=>wf(lerp(a,b,u))));ctx.clip();ctx.drawImage(im,0,0,W,H);ctx.restore();};
  clip(M9_IN,u0,u1,u=>M9_WIN(u)-3);M9_CAN.forEach(c=>clip(c.p,clamp((D0-c.d0)/c.L,0,1),clamp((D1-c.d0)/c.L,0,1),u=>c.w(u)+2));}
// a tripod of poles lashed at the top, with a long basket of stones against it: a row of them closes the inner channel; kept, at twice the size
function m9_tripodPic(){return wc_kept("tripod",200,200,q=>{q.scale(2,2);q.translate(50,86);const wd=[150,112,74],P=WC_PENCIL;q.lineCap="round";
  wc_wash(q,[[-36,-2],[34,-6],[40,8],[-30,12]],[196,172,110],{kind:"thing",lw:1.2,seed:3});
  q.strokeStyle=rgba(wc_dim([196,172,110],0.35),0.8);q.lineWidth=1;for(let i=-30;i<36;i+=7){q.beginPath();q.moveTo(i,-3);q.lineTo(i+5,10);q.stroke();}
  for(const [x,y] of [[-20,4],[-6,3],[10,2],[24,1]]){q.fillStyle=rgba([150,144,138],0.9);q.beginPath();q.arc(x,y,3,0,TAU);q.fill();}
  for(const [x,y,w] of [[-26,0,4],[22,-2,4],[4,-8,3.2]]){q.strokeStyle=rgba(wc_dim(wd,0.3),1);q.lineWidth=w+1.6;q.beginPath();q.moveTo(0,-62);q.lineTo(x,y);q.stroke();q.strokeStyle=rgba(wd,1);q.lineWidth=w;q.stroke();}
  q.strokeStyle=rgba([220,204,160],1);q.lineWidth=3;q.beginPath();q.moveTo(-5,-56);q.lineTo(5,-58);q.stroke();q.strokeStyle=rgba(P,0.5);q.lineWidth=1;q.stroke();});}
// the row across the inner channel, each tripod arriving at t0 (staggered) and lifted away at t1
function m9_tripods(ctx,t,t0,t1){const p=m9_at(M9_IN,M9_CLOSE),nx=-Math.sin(p[2]),ny=Math.cos(p[2]),im=m9_tripodPic();
  for(let i=0;i<5;i++){const o=(i-2)*26,x=p[0]+nx*o,y=p[1]+ny*o,a=fin(t,t0+i*0.18,0.4)*(1-fin(t,t1+i*0.15,0.5)),up=ease(fin(t,t1+i*0.15,0.6))*30;if(a<=0.01)continue;
    arrive(ctx,x,y,t,t0+i*0.18,()=>withA(ctx,a,()=>ctx.drawImage(im,x-25,y-43-up,50,50)),{dy:-14,d:0.6});}}
// someone digging out the bed in the dry season, in plain hemp, belted, a cloth tied round the head; a wooden spade (dig) or a basket
// of gravel on the shoulder (carry). s: their height over 100; ph: where in the work they are
const M9_HEMP=[206,188,154],M9_HEMPD=[150,128,98],M9_SKIN=[214,170,132],M9_CLOTH=[238,232,216];
function m9_digger(ctx,x,y,s,t,ph,kind,flip){const k=s,cyc=(t*0.62+ph)%1,dig=kind==="dig",b=dig?Math.sin(cyc*TAU):0,lean=dig?0.18+0.16*Math.max(0,b):0.05,step=dig?0:Math.sin(cyc*TAU*2);
  ctx.save();ctx.translate(x,y);ctx.scale(flip?-k:k,k);ctx.lineCap="round";ctx.lineJoin="round";const ink=rgba(WC_PENCIL,0.8);
  ctx.fillStyle=rgba([110,100,90],0.18);ctx.beginPath();ctx.ellipse(0,0,16,4,0,0,TAU);ctx.fill();
  // legs, then the tunic, belted; the head and its cloth
  ctx.strokeStyle=rgba(M9_HEMPD,1);ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(-3,-42);ctx.lineTo(-7-step*5,-2);ctx.moveTo(3,-42);ctx.lineTo(8+step*5,-2);ctx.stroke();
  ctx.save();ctx.translate(0,-40);ctx.rotate(lean);ctx.beginPath();ctx.moveTo(-10,0);ctx.lineTo(-8,-36);ctx.quadraticCurveTo(0,-40,8,-36);ctx.lineTo(11,0);ctx.closePath();
  ctx.fillStyle=rgba(M9_HEMP,1);ctx.fill();ctx.strokeStyle=ink;ctx.lineWidth=1.2;ctx.stroke();ctx.fillStyle=rgba(M9_HEMPD,1);ctx.fillRect(-10,-16,21,4);
  ctx.beginPath();ctx.arc(1,-45,7,0,TAU);ctx.fillStyle=rgba(M9_SKIN,1);ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(1,-47,7.4,Math.PI*1.05,Math.PI*1.95);ctx.lineTo(8,-46);ctx.lineTo(-6,-46);ctx.closePath();ctx.fillStyle=rgba(M9_CLOTH,1);ctx.fill();ctx.stroke();
  if(dig){// the spade: down into the gravel, then up with a load
    const a=-0.5+0.75*Math.max(0,b);ctx.save();ctx.translate(6,-30);ctx.rotate(a);ctx.strokeStyle=rgba([150,112,74],1);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(26,34);ctx.stroke();
      ctx.beginPath();ctx.moveTo(22,32);ctx.lineTo(34,30);ctx.lineTo(36,44);ctx.lineTo(26,46);ctx.closePath();ctx.fillStyle=rgba([170,132,92],1);ctx.fill();ctx.strokeStyle=ink;ctx.lineWidth=1;ctx.stroke();ctx.restore();
    ctx.strokeStyle=rgba(M9_SKIN,1);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-6,-30);ctx.lineTo(8,-26+a*6);ctx.stroke();}
  else{// a basket on the shoulder
    wc_wash(ctx,[[4,-48],[24,-46],[22,-30],[6,-32]],[196,172,110],{kind:"dab",flat:true});ctx.strokeStyle=ink;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(4,-48);ctx.lineTo(24,-46);ctx.lineTo(22,-30);ctx.lineTo(6,-32);ctx.closePath();ctx.stroke();
    for(const [px,py] of [[10,-48],[16,-49],[21,-47]]){ctx.fillStyle=rgba(M9_GRAVEL[2],1);ctx.beginPath();ctx.arc(px,py,2.6,0,TAU);ctx.fill();}
    ctx.strokeStyle=rgba(M9_SKIN,1);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(6,-30);ctx.lineTo(12,-44);ctx.stroke();}
  ctx.restore();ctx.restore();}
// the diggers in the bed: where each works along the inner channel (u), across it (o), and what they do; the carriers walk to the bank
const M9_DIG=[[0.22,-0.2,"dig",0],[0.26,0.24,"dig",0.4],[0.33,0,"carry",0.1],[0.4,-0.26,"dig",0.7],[0.46,0.18,"dig",0.2],[0.52,0,"carry",0.6],[0.6,-0.1,"dig",0.5],[0.67,0.24,"dig",0.9]];
function m9_diggers(ctx,t,t0,a){if(a<=0.01)return;M9_DIG.forEach(([u,o,kind,ph],i)=>{const p=m9_at(M9_IN,u),w=M9_WIN(u),c=kind==="carry"?Math.sin(t*0.5+ph*6):0,
    x=p[0]-Math.sin(p[2])*(o+c*0.3)*w,y=p[1]+Math.cos(p[2])*(o+c*0.3)*w;arrive(ctx,x,y,t,t0+i*0.12,()=>withA(ctx,a,()=>m9_digger(ctx,x,y+8,0.46,t,ph,kind,i%2===1)),{dy:-6,d:0.6});});}

/* ---------- 1. the cut through the riverbed ---------- */
// the panel: the riverbed in section, gravel down to the mark, and below it the firm old bed; the trench is dug out from tDig to tDug,
// down to the mark and no deeper; the stone horse lies there, then gives way to the iron bars (tBars)
const M9_SEC={x:1068,y:132,w:772,h:540},M9_SURF=178,M9_MARK=384;
function m9_secPaper(){const S=M9_SEC;return wc_kept("section",(S.w+40)*2,(S.h+40)*2,q=>{q.scale(2,2);q.translate(20,20);const w=S.w,h=S.h,R=wc_rng(71);
  wc_wash(q,wc_rect(0,0,w,h),[250,248,240],{kind:"page",lw:2,seed:4});
  // the firm old bed below the mark, then the gravel above it
  wc_wash(q,[[10,M9_MARK+10],[w-10,M9_MARK+14],[w-10,h-10],[10,h-10]],[188,160,128],{kind:"ground",line:false,seed:5});
  wc_wash(q,[[10,M9_SURF],[w*0.3,M9_SURF-6],[w*0.6,M9_SURF+4],[w-10,M9_SURF-2],[w-10,M9_MARK+14],[10,M9_MARK+10]],M9_GRAVEL[1],{kind:"ground",line:false,seed:7});
  for(let i=0;i<420;i++){const x=16+R()*(w-32),y=M9_SURF+6+R()*(M9_MARK-M9_SURF),r=2+R()*4.5;wc_wash(q,wc_ell(x,y,r*1.3,r,9),M9_GRAVEL[i%4],{kind:"dab",flat:true,a:0.85});}
  wc_ink(q,[[10,M9_SURF],[w*0.3,M9_SURF-6],[w*0.6,M9_SURF+4],[w-10,M9_SURF-2]],false,2.2,WC_PENCIL,0.8,5,1);});}
// the trench, d (0..1) of the way down to the mark: its gravel taken out, back to paper
const M9_TR=[330,214];
function m9_trench(d){const S=M9_SEC,cx=S.x+S.w/2,top=S.y+M9_SURF,bot=top+(M9_MARK-M9_SURF-4)*d,tw=M9_TR[0]/2,bw=lerp(M9_TR[0],M9_TR[1],d)/2;
  return[[cx-tw,top-8],[cx+tw,top-8],[cx+bw,bot],[cx-bw,bot]];}
// a stone horse, lying in the bed with its legs folded under it, its head up; kept, at twice the size (280 by 120)
function m9_horsePic(){return wc_kept("horse",560,240,q=>{q.scale(2,2);q.translate(10,10);const st=[166,164,158],ln={kind:"build",lw:1.5};
  const legs=[[[56,76],[98,86],[100,96],[52,92]],[[148,78],[190,86],[192,96],[146,94]]],body=wc_ell(112,62,72,27,28),
    neck=[[150,44],[190,12],[212,20],[188,66],[156,72]],head=[[192,8],[214,10],[236,28],[238,38],[224,42],[202,30]];
  legs.forEach((p,i)=>wc_wash(q,p,wc_dim(st,0.08),Object.assign({seed:21+i},ln)));[[body,23],[neck,25],[head,27]].forEach(([p,sd])=>wc_wash(q,p,st,Object.assign({seed:sd},ln)));
  q.strokeStyle=rgba(WC_PENCIL,0.7);q.lineWidth=1.5;q.lineCap="round";q.beginPath();q.moveTo(198,9);q.lineTo(202,-2);q.lineTo(208,8);q.moveTo(160,40);q.quadraticCurveTo(176,24,192,10);
  q.moveTo(42,54);q.quadraticCurveTo(30,64,34,84);q.stroke();q.fillStyle=rgba(WC_PENCIL,0.85);q.beginPath();q.arc(214,20,2.2,0,TAU);q.fill();
  wc_wash(q,wc_ell(112,76,62,10,20),wc_dim(st,0.3),{kind:"dab",flat:true,a:0.32,seed:29});});}
// the iron bars, lying end to end at the mark; kept
function m9_barsPic(){return wc_kept("ironBars",700,80,q=>{q.scale(2,2);q.translate(8,8);const ir=[92,94,104];
  [[0,10,150],[158,6,150],[0,24,150],[158,22,150]].forEach(([x,y,l],i)=>{wc_wash(q,wc_rrPts(x,y,l,12,5),i%2?wc_lit(ir,0.08):ir,{kind:"iron",lw:1.2,seed:3+i});});});}
function m9_section(ctx,t,o){const S=M9_SEC,cx=S.x+S.w/2;ctx.drawImage(m9_secPaper(),S.x-20,S.y-20,S.w+40,S.h+40);
  const d=ease(clamp((t-o.tDig)/(o.tDug-o.tDig),0,1)),bars=fin(t,o.tBars,0.7),my=S.y+M9_MARK;
  // the trench, then the mark in it: under the gravel until the trench reaches it
  if(d>0){ctx.save();wc_tr(ctx,m9_trench(d));ctx.fillStyle=rgba([250,248,240],0.94);ctx.fill();ctx.strokeStyle=rgba(WC_PENCIL,0.7);ctx.lineWidth=2;ctx.stroke();ctx.restore();}
  withA(ctx,1-bars,()=>ctx.drawImage(m9_horsePic(),cx-152,my-74,280,120));withA(ctx,bars,()=>ctx.drawImage(m9_barsPic(),cx-175,my-12,350,40));
  if(d<1){ctx.save();ctx.beginPath();ctx.rect(cx-190,my-72,380,112);ctx.clip();ctx.globalAlpha*=1-clamp((d-0.82)/0.18,0,1);
    ctx.drawImage(m9_secPaper(),(S.x-20),(S.y-20),S.w+40,S.h+40);ctx.restore();}
  // the diggers on the bed, at the trench's edge
  const a=fin(t,o.tDig-0.4,0.5);if(a>0.01){m9_digger(ctx,cx-200,S.y+M9_SURF-6,1.0,t,0.1,"dig",false);m9_digger(ctx,cx+214,S.y+M9_SURF-6,1.0,t,0.6,"carry",true);}
  // how deep: a pencil line down the trench from the bed, its arrow stopping on the mark
  const ln=clamp((t-o.tLine)/0.9,0,1);if(ln>0){const x=cx-34,y0=S.y+M9_SURF+12,ye=lerp(my-36,my-10,bars),y1=lerp(y0,ye,ease(ln));wc_pencil(ctx,[[x,y0],[x,y1]],1,{dash:[8,8],lw:2.6});
    if(ln>=1){ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.9);ctx.lineWidth=2.6;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(x-12,ye-13);ctx.lineTo(x,ye);ctx.lineTo(x+12,ye-13);ctx.stroke();ctx.restore();}}}

/* ---------- 1. the rule ---------- */
// a strip of paper that unrolls from the left as p goes 0 to 1, the rule written along it; kept
const M9_RULE="Dig the riverbed deep, keep the weir low";
function m9_rule(ctx,cx,cy,p){if(p<=0)return;const w=1180,h=96,x0=cx-w/2,vis=w*ease(clamp(p,0,1));
  const c=wc_kept("ruleStrip",(w+40)*2,(h+40)*2,q=>{q.scale(2,2);q.translate(20,20);wc_wash(q,[[0,4],[w,0],[w-2,h-2],[2,h]],[248,240,220],{kind:"paper",lw:1.6,seed:11});
    q.strokeStyle=rgba(WCP.parchInk,0.14);q.lineWidth=1.2;q.beginPath();q.moveTo(24,h-18);q.lineTo(w-24,h-20);q.stroke();});
  ctx.save();ctx.beginPath();ctx.rect(x0-20,cy-h/2-20,vis+20,h+40);ctx.clip();ctx.drawImage(c,x0-20,cy-h/2-20,w+40,h+40);
  wc_hand(ctx,M9_RULE,cx,cy+15,{size:46,w:700,col:WCP.parchInk,align:"center"});ctx.restore();
  // the roll, moving right as it unrolls
  if(p<1){const rx=x0+vis;ctx.save();ctx.fillStyle=rgba([236,226,198],1);ctx.beginPath();ctx.ellipse(rx,cy,13,h/2+4,0,0,TAU);ctx.fill();ctx.strokeStyle=rgba(WC_PENCIL,0.7);ctx.lineWidth=1.6;ctx.stroke();ctx.restore();}}

/* ---------- 2 to 10: things on paper ---------- */
// a pencil arrow from one point to another, drawn on as p goes from 0 to 1
function m9_arrow(ctx,x0,y0,x1,y1,p,o){o=o||{};if(p<=0)return;const q=ease(clamp(p,0,1)),ex=lerp(x0,x1,q),ey=lerp(y0,y1,q),an=Math.atan2(y1-y0,x1-x0),c=rgba(o.col||WC_PENCIL,o.a==null?0.85:o.a);
  ctx.save();ctx.strokeStyle=c;ctx.fillStyle=c;ctx.lineWidth=o.lw||3;ctx.lineCap="round";if(o.dash)ctx.setLineDash(o.dash);ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(ex,ey);ctx.stroke();ctx.setLineDash([]);
  if(p>=1){ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x1-16*Math.cos(an-0.45),y1-16*Math.sin(an-0.45));ctx.lineTo(x1-16*Math.cos(an+0.45),y1-16*Math.sin(an+0.45));ctx.closePath();ctx.fill();}ctx.restore();}
// a rubber stamp landing at ts: its words inside a double rule, in the stamp's ink, pressed unevenly; the rule is kept for each size
const M9_STAMP=[46,78,132];
function m9_stampRule(w,h,col){return wc_kept("stamp"+w+"x"+h+"|"+col.join(","),(w+16)*2,(h+16)*2,q=>{q.scale(2,2);q.translate(8,8);
  wc_ink(q,wc_rrPts(0,0,w,h,10),true,3.4,col,0.9,41,0.6);wc_ink(q,wc_rrPts(8,8,w-16,h-16,6),true,1.6,col,0.85,43,0.6);
  q.globalCompositeOperation="destination-out";q.globalAlpha=0.45;q.drawImage(WC.blotch,-30,-20,w+60,h+40);});}
function m9_stamp(ctx,t,cx,cy,ts,s,o){o=o||{};const p=clamp((t-ts)/0.2,0,1);if(p<=0)return;const size=o.size||36,col=o.col||M9_STAMP,
  w=Math.round(tw(ctx,s,size,500,"mono")+52),h=Math.round(size+38),z=lerp(1.3,1,1-Math.pow(1-p,3));
  ctx.save();ctx.translate(cx,cy);ctx.rotate(o.rot==null?-0.04:o.rot);ctx.scale(z,z);withA(ctx,p*(o.a==null?1:o.a),()=>{ctx.drawImage(m9_stampRule(w,h,col),-w/2-8,-h/2-8,w+16,h+16);
    wc_T(ctx,s,0,size*0.36,{f:"mono",w:500,size,col,a:0.9,align:"center"});});ctx.restore();}
// someone's name, and where they work
function m9_name(ctx,x,y,name,role){const w=Math.round(Math.max(tw(ctx,name,32,800),tw(ctx,role,28,600))+56);wc_panel(ctx,x-w/2,y,w,108,{kind:"card",seed:name.length});
  wc_T(ctx,name,x-w/2+28,y+46,{w:800,size:32,col:WC_DARK});wc_T(ctx,role,x-w/2+28,y+86,{w:600,size:28,col:WC_MUTED});}
// someone no one has met yet: only ever drawn as a white figure, so only the outline matters
if(!PEOPLE.newcomer)PEOPLE.newcomer={name:"A new person",role:"Applicant",side:"Person",does:"uses",edge:[236,232,226],seed:23,
  skin:[200,160,128],hair:{style:"curly",c:[40,32,30]},top:{kind:"sweater",c:[120,140,120]},bottom:{c:[60,64,80]},shoe:[50,50,56],build:{sh:72,hip:58,h:0.98}};

/* ---------- 2 to 4. the clean-up's board, and the charts of duplicates ---------- */
// the clean-up's board: fifteen pairs of records, each pair sliding together and becoming one white card as o.merge goes 0 to 1, a
// counter running to 2,000 (o.count), its months from June to December filling (o.months)
const M9_BD={x:150,y:130,w:880,h:470},M9_BPAIRS=[["student","applicant"],["alumna","student"],["tutor","student"],["applicant","applicant"],["student","alumna"],
  ["researcher","tutor"],["student","student"],["applicant","alumna"],["tutor","tutor"],["student","applicant"],["alumna","alumna"],["student","researcher"],["applicant","student"],["tutor","alumna"],["student","student"]],
  M9_BORDER=[3,11,7,0,13,5,9,1,14,6,2,10,4,12,8];
function m9_board(ctx,t,o){const B=M9_BD;wc_panel(ctx,B.x,B.y,B.w,B.h,{kind:"sheet",seed:8});
  wc_T(ctx,"Duplicate clean-up · 2024",B.x+36,B.y+60,{w:800,size:34,col:WC_DARK});
  const n=Math.round(2000*clamp(o.count,0,1)/10)*10,mw=tw(ctx," merged",30,700);
  wc_T(ctx,"merged",B.x+B.w-36,B.y+60,{w:700,size:30,align:"right",col:WC_MUTED});wc_T(ctx,n.toLocaleString("en-US"),B.x+B.w-36-mw,B.y+61,{w:500,size:40,f:"mono",align:"right",col:WC_DARK});
  M9_BPAIRS.forEach(([r1,r2],i)=>{const cx=B.x+118+(i%5)*161,cy=B.y+148+Math.floor(i/5)*88,s0=M9_BORDER[i]/15*0.78,k=ease(clamp((o.merge-s0)/0.2,0,1)),sl=30*k,wa=clamp((k-0.55)/0.35,0,1);
    if(wa<1)withA(ctx,1-wa,()=>{wc_panel(ctx,cx-68+sl,cy-20,62,40,{kind:"chip",role:WC_ROLE[r1],seed:i});wc_panel(ctx,cx+6-sl,cy-20,62,40,{kind:"chip",role:WC_ROLE[r2],seed:i+20});});
    if(wa>0)withA(ctx,wa,()=>{wc_panel(ctx,cx-40,cy-24,80,48,{kind:"card",seed:i+40});[r1,r2].forEach((r,j)=>{ctx.fillStyle=rgba(WC_ROLE[r],1);ctx.beginPath();ctx.arc(cx-20+j*16,cy,6,0,TAU);ctx.fill();});});});
  // the six months, as a strip that fills from June to December
  const sy=B.y+B.h-62,sx=B.x+250,sw=330,f=ease(clamp(o.months,0,1));wc_T(ctx,"Jun–Dec 2024",B.x+36,sy+10,{w:700,size:28,col:WC_INK});
  ctx.save();wc_tr(ctx,wc_rrPts(sx,sy-16,sw,32,10));ctx.fillStyle=rgba([244,240,230],1);ctx.fill();ctx.clip();if(f>0){ctx.fillStyle=rgba(wc_lit(WC_ROLE.student,0.35),0.9);ctx.fillRect(sx,sy-16,sw*f,32);}
  ctx.strokeStyle=rgba(WC_PENCIL,0.35);ctx.lineWidth=1.5;for(let i=1;i<6;i++){ctx.beginPath();ctx.moveTo(sx+sw*i/6,sy-16);ctx.lineTo(sx+sw*i/6,sy+16);ctx.stroke();}ctx.restore();
  wc_ink(ctx,wc_rrPts(sx,sy-16,sw,32,10),true,1.8,WC_PENCIL,0.8,17,0.6);}
// the sheet a chart is drawn on: kept when it's still; while it grows, drawn each frame, with a plain pencil edge
function m9_sheet(ctx,b,still){if(still)return wc_panel(ctx,b.x,b.y,b.w,b.h,{kind:"sheet",seed:5});ctx.save();wc_tr(ctx,wc_rrPts(b.x,b.y,b.w,b.h,12));
  ctx.fillStyle=rgba(WC_CARD,0.95);ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=rgba(WC_PENCIL,0.8);ctx.stroke();ctx.restore();}
// where things sit on a chart: months from June 2024 (0) to mEnd across, and duplicates from 0 to top up
function m9_plot(b,mEnd,top){const x0=b.x+136,x1=b.x+b.w-48,y0=b.y+108,y1=b.y+b.h-82;return{x0,x1,y0,y1,X:m=>lerp(x0,x1,m/mEnd),Y:n=>lerp(y1,y0,n/top)};}
function m9_axes(ctx,P,grid){ctx.save();if(grid){ctx.strokeStyle=rgba(WC_PENCIL,0.22);ctx.lineWidth=1.5;ctx.setLineDash([6,8]);grid.forEach(n=>{ctx.beginPath();ctx.moveTo(P.x0,P.Y(n));ctx.lineTo(P.x1,P.Y(n));ctx.stroke();});}
  ctx.setLineDash([]);ctx.strokeStyle=rgba(WC_PENCIL,0.8);ctx.lineWidth=2.2;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(P.x0,P.y0-12);ctx.lineTo(P.x0,P.y1);ctx.lineTo(P.x1,P.y1);ctx.stroke();ctx.restore();}
// duplicates waiting, month by month: the clean-up takes them from 2,000 to none by December 2024; each intake of 2025 brings more
const M9_WAIT=[[0,2000],[1,1720],[2,1390],[3,1020],[4,660],[5,310],[6,0],[8,0],[8.25,640],[13,640],[13.25,1100],[18,1100]];
// a block of new duplicates: small record cards in twos, stacked in the roles' colours; kept, then clipped to each block (cut: it runs
// off the top of the chart, torn)
function m9_pairsTex(){return wc_kept("pairs",112,1200,q=>{q.scale(2,2);const R=wc_rng(83),cols=["student","applicant","alumna","tutor","researcher"];
  for(let r=0;r<50;r++)for(let k=0;k<2;k++){const y=588-r*12,x=3+k*26,c=WC_ROLE[cols[Math.floor(R()*5)]];
    for(const xx of [x,x+12]){q.fillStyle=rgba(wc_lit(c,0.2),0.92);q.fillRect(xx,y,10,9);q.strokeStyle=rgba(WC_PENCIL,0.45);q.lineWidth=0.8;q.strokeRect(xx+0.5,y+0.5,9,8);}}});}
function m9_block(ctx,x,yTop,yBot,w,cut){if(yBot-yTop<1)return;const top=[];if(cut)for(let i=0;i<=6;i++)top.push([x+w*(1-i/6),yTop+(i%2?0:9)]);else top.push([x+w,yTop],[x,yTop]);
  const pts=[[x,yBot],[x+w,yBot]].concat(top);ctx.save();wc_tr(ctx,pts);ctx.fillStyle=rgba(WC_CARD,1);ctx.fill();ctx.clip();ctx.drawImage(m9_pairsTex(),x+(w-56)/2,yBot-600,56,600);ctx.restore();
  ctx.save();wc_tr(ctx,pts);ctx.strokeStyle=rgba(WC_PENCIL,0.75);ctx.lineWidth=2;ctx.lineJoin="round";ctx.stroke();ctx.restore();}
// the chart of duplicates waiting, in box b, months 0 to o.mEnd; its line drawn to month o.mL; the 2025 blocks risen as far as o.rise;
// each label's alpha in o
const M9_BW=48,m9_bx=(P,m)=>P.X(m+0.25)+6;
function m9_waiting(ctx,t,b,o){const P=m9_plot(b,o.mEnd,2000);m9_sheet(ctx,b,o.still);
  wc_T(ctx,"duplicates waiting",b.x+36,b.y+62,{w:800,size:32,col:WC_DARK});m9_axes(ctx,P,[1000,2000]);
  [["2,000",2000],["0",0]].forEach(([s,n])=>wc_T(ctx,s,P.x0-16,P.Y(n)+10,{w:600,size:28,align:"right",col:WC_MUTED}));
  const xl=(s,m,a)=>{if(a>0.01)withA(ctx,a,()=>wc_T(ctx,s,m,P.y1+46,{w:600,size:28,align:"center",col:WC_MUTED}));};
  xl("Jun 2024",P.X(0),1);xl("Dec 2024",P.X(6),o.dec==null?1:o.dec);
  // the blocks of 2025, one for each intake, stacked on what was already waiting
  const r=o.rise||[0,0];[[8,0,640,0],[13,640,460,1]].forEach(([m,n0,dn,i])=>{if(r[i]<=0)return;const x=m9_bx(P,m);m9_block(ctx,x,P.Y(n0+dn*ease(r[i])),P.Y(n0),M9_BW);
    xl(["Feb 2025","Jul 2025"][i],x+M9_BW/2,clamp(r[i]*2,0,1));const la=(o.vals||[0,0])[i];
    if(la>0.01)withA(ctx,la,()=>wc_T(ctx,String(dn),x-14,P.Y(n0+dn/2)+10,{w:800,size:30,align:"right",col:WC_DARK}));});
  // the line, as far as it's been drawn; the months with none waiting, marked while they're the subject
  const mL=clamp(o.mL,0,18);if(o.hi>0.01){ctx.save();ctx.strokeStyle=rgba(WC_BADGE,0.55*o.hi);ctx.lineWidth=18;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(P.X(6),P.y1-2);ctx.lineTo(P.X(Math.min(mL,8)),P.y1-2);ctx.stroke();ctx.restore();}
  if(mL>0){const pts=[];for(let i=0;i<M9_WAIT.length;i++){const [m,n]=M9_WAIT[i];if(m<=mL)pts.push([P.X(m),P.Y(n)]);else{const [m0,n0]=M9_WAIT[i-1];pts.push([P.X(mL),P.Y(lerp(n0,n,(mL-m0)/(m-m0)))]);break;}}
    ctx.save();ctx.strokeStyle=rgba(WC_INK,0.9);ctx.lineWidth=4.5;ctx.lineCap="round";ctx.lineJoin="round";wc_trOpen(ctx,pts);ctx.stroke();ctx.restore();}
  if(o.end>0.01)withA(ctx,o.end,()=>wc_T(ctx,"1,100 new",P.x1,P.Y(1100)-24,{w:800,size:30,align:"right",col:WC_DARK}));
  return P;}
// new duplicates per intake, against the limit of 50: 2025's run off the top; o.rise: how far each of 2026's has risen
const M9_INTAKES=[[8,640,"Feb 2025"],[13,460,"Jul 2025"],[20,44,"Feb 2026"],[25,29,"Jul 2026"]],M9_IRON=[92,96,112];
// (months counted from Jan 2025, so the four intakes spread across the chart)
function m9_intakes(ctx,t,b,o){const P=m9_plot(b,23,100);m9_sheet(ctx,b,true);wc_T(ctx,"new duplicates per intake",b.x+36,b.y+62,{w:800,size:32,col:WC_DARK});m9_axes(ctx,P);
  wc_T(ctx,"0",P.x0-16,P.Y(0)+10,{w:600,size:28,align:"right",col:WC_MUTED});
  M9_INTAKES.forEach(([m,n,s],i)=>{const r=i<2?1:ease(clamp((o.rise||[0,0])[i-2],0,1)),x=P.X(m-5+0.5)-26,cut=n>100,top=cut?P.Y(91):P.Y(n*r);if(r<=0)return;
    m9_block(ctx,x,top,P.y1,52,cut);wc_T(ctx,s,x+26,P.y1+46,{w:600,size:28,align:"center",col:WC_MUTED});
    withA(ctx,clamp(r*3-2,0,1),()=>wc_T(ctx,String(n),x+26,top-(cut?8:14),{w:800,size:30,align:"center",col:WC_DARK}));});
  // the limit, dashed in the iron bars' grey, drawn on, with its name
  const lp=clamp(o.lim||0,0,1);if(lp>0){ctx.save();ctx.strokeStyle=rgba(M9_IRON,0.95);ctx.lineWidth=3.5;ctx.setLineDash([16,10]);ctx.beginPath();ctx.moveTo(P.x0,P.Y(50));ctx.lineTo(lerp(P.x0,P.x1,ease(lp)),P.Y(50));ctx.stroke();ctx.restore();
    withA(ctx,clamp(lp*2-1,0,1),()=>wc_T(ctx,"limit: 50",P.x1,P.Y(50)-16,{w:800,size:30,align:"right",col:M9_IRON}));}
  return P;}
// an application, in amber, and its route
function m9_app(ctx,x,y,w,h,sub,seed){const tW=tw(ctx,"Application",30,800);wc_panel(ctx,x,y,w,h,{kind:"card",role:WC_ROLE.applicant,sw:tW+36,seed});
  wc_T(ctx,"Application",x+32,y+48,{w:800,size:30,col:WC_DARK});wc_T(ctx,sub,x+32,y+96,{w:600,size:28,col:WC_MUTED});}
// the number it gives whoever applies, a new one each beat from t0, stamped in the student's ink
function m9_stamping(ctx,t,cx,cy,t0,base,beat){if(t<t0)return;const k=Math.floor((t-t0)/beat);m9_stamp(ctx,t,cx,cy,t0+k*beat,"S-"+(base+k),{size:30,col:WC_ROLEINK.student,rot:-0.05+0.03*(k%3)});}
// the step the application gains: it looks for the person first, the glass moving over what's already known
function m9_glass(ctx,x,y,s,col){ctx.save();ctx.strokeStyle=rgba(col||WC_INK,0.9);ctx.lineWidth=4*s;ctx.lineCap="round";ctx.beginPath();ctx.arc(x,y,15*s,0,TAU);ctx.stroke();
  ctx.lineWidth=6*s;ctx.beginPath();ctx.moveTo(x+11*s,y+11*s);ctx.lineTo(x+24*s,y+24*s);ctx.stroke();ctx.restore();}
function m9_search(ctx,t,x,y,w,h,sweep){wc_panel(ctx,x,y,w,h,{kind:"card",seed:12});const k=Math.sin(t*3.2)*sweep;m9_glass(ctx,x+54+k*8,y+h/2-4+Math.cos(t*3.2)*sweep*4,1.1);
  wc_T(ctx,"search first",x+100,y+h/2+11,{w:800,size:30,col:WC_DARK});}
// Mei's queue: a few cases, each a pair of records waiting for her to decide, stacked
function m9_stack(ctx,x,y,n){for(let i=n-1;i>=0;i--){const ox=i*12,oy=-i*12;wc_panel(ctx,x+ox,y+oy,156,86,{kind:"card",seed:30+i});
  wc_panel(ctx,x+ox+16,y+oy+23,56,40,{kind:"chip",role:WC_ROLE.applicant,seed:i});wc_panel(ctx,x+ox+84,y+oy+23,56,40,{kind:"chip",role:WC_ROLE.student,seed:i+5});}}
// a small picture of the river's split, in the dry season, cut from the valley: the river going down the outer channel, the inner one
// closed and being dug out; returns where a point of the valley lands in it
const M9_INSET={x:600,y:338,w:700,h:394};
// (the valley under it is painted at twice the inset's size, so it stays sharp drawn large)
function m9_insetTex(){const C=M9_INSET;return wc_kept("insetDry",C.w*2,C.h*2,q=>{q.scale(2,2);q.translate(-C.x,-C.y);m9_valley(q,{dry:true});});}
function m9_inset(ctx,t,x,y,w,h){const C=M9_INSET,s=w/C.w;wc_panel(ctx,x-12,y-12,w+24,h+24,{kind:"sheet",seed:19});
  ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.translate(x,y);ctx.scale(s,s);ctx.translate(-C.x,-C.y);ctx.drawImage(m9_insetTex(),C.x,C.y,C.w,C.h);
  m9_tripods(ctx,t,-9,1e9);m9_diggers(ctx,t,-9,1);m9_flow(ctx,t,M9_MAIN,M9_WMAIN,40,80,3,1,0.34,M9_SEEN);m9_gravel(ctx,t,-9,1,true);ctx.restore();
  wc_ink(ctx,wc_rect(x,y,w,h),true,1.8,WC_PENCIL,0.7,23,0.5);return(px,py)=>[x+(px-C.x)*s,y+(py-C.y)*s];}

/* ---------- 5, 6 and 10. the steward's measures ---------- */
// the dashboard on Mei's wall: six places, five gauges and two cards; each gauge is a column with its level, and an iron bar lying across
// it at its limit, as in the river's bed; beside it, what it measures, its value and limit, what it's read from, and whether it's within
// its limit (a tick in green ink) or past it (a cross in red ink), said in words too
const M9_DB={x:60,y:70,w:1300,h:780};
function m9_cell(i){return[80+(i%3)*424,92+Math.floor(i/3)*364,414,350];}
const M9_G=[{l:["new duplicates","this intake"],v:"29",lim:"limit: 50",src:"from the queue",max:80,n:29,bar:50},
  {l:["oldest case","in the queue"],v:"3 days",lim:"limit: 7 days",src:"from the queue",max:16,n:3,bar:7},
  {l:["roles past","their end date"],v:"0",lim:"limit: 0",src:"from the role table",max:4,n:0,bar:0},
  {l:["values with","no source"],v:"0",lim:"limit: 0",src:"from the tests",max:4,n:0,bar:0},
  {l:["requests","answered on time"],v:"14 of 14",lim:"limit: all of them",src:"from the request log",max:16,n:14,bar:14}];
const M9_LEVEL=[150,172,204];
function m9_levelTex(){return wc_kept("level",160,520,q=>{q.scale(2,2);wc_wash(q,wc_rect(4,4,72,252),M9_LEVEL,{kind:"swatch",line:false,a:0.8,seed:13});});}
function m9_barPic(){return wc_kept("ironBar",248,48,q=>{q.scale(2,2);q.translate(6,6);[[0,0],[58,1]].forEach(([x,y],i)=>wc_wash(q,wc_rrPts(x,y,54,11,5),i?wc_lit(M9_IRON,0.08):M9_IRON,{kind:"iron",lw:1.2,seed:7+i}));});}
function m9_gauge(ctx,t,i,o){o=o||{};const g=Object.assign({},M9_G[i],o.g||{}),[x,y,w,h]=o.box||m9_cell(i),lit=o.lit||0,n=o.n==null?g.n:o.n;
  wc_panel(ctx,x,y,w,h,{kind:"card",seed:40+i});if(lit>0.01)withA(ctx,lit,()=>wc_panel(ctx,x,y,w,h,{kind:"card",wash:WC_BADGE,washA:0.34,seed:40+i}));
  const cx=x+30,cy=y+52,cw=66,ch=250,lv=clamp(n/g.max,0,1),by=cy+ch-ch*g.bar/g.max;
  ctx.save();wc_tr(ctx,wc_rrPts(cx,cy,cw,ch,8));ctx.fillStyle=rgba([246,243,234],1);ctx.fill();ctx.clip();if(lv>0)ctx.drawImage(m9_levelTex(),0,260*(1-lv),80,260*lv,cx-6,cy+ch*(1-lv),80,ch*lv+4);ctx.restore();
  wc_ink(ctx,wc_rrPts(cx,cy,cw,ch,8),true,2,WC_PENCIL,0.8,11+i,0.8);
  // the iron bar, laid across at its limit (o.barIn: as it's laid)
  const bi=o.barIn==null?1:o.barIn;if(bi>0)withA(ctx,clamp(bi*3,0,1),()=>ctx.drawImage(m9_barPic(),cx+cw/2-62,by-12-26*(1-ease(bi)),124,24));
  const tx=x+126;g.l.forEach((s,k)=>wc_T(ctx,s,tx,y+66+k*36,{w:800,size:30,col:WC_DARK}));wc_T(ctx,g.v,tx,y+172,{w:800,size:48,col:WC_DARK});
  wc_T(ctx,g.lim,tx,y+216,{w:600,size:28,col:WC_INK});wc_T(ctx,g.src,tx,y+256,{w:600,size:28,col:WC_MUTED});
  const ok=o.ok==null?1:o.ok,past=o.past||0;
  if(past>0.01){wc_cross(ctx,tx+18,y+298,30,WC_NO,clamp(past/0.4,0,1));withA(ctx,clamp((past-0.3)/0.5,0,1),()=>wc_T(ctx,"past its limit",tx+46,y+308,{w:700,size:28,col:WC_NO}));}
  else if(ok>0){wc_tick(ctx,tx+18,y+296,30,WC_ROLEINK.alumna,clamp(ok/0.4,0,1),4);withA(ctx,clamp((ok-0.3)/0.5,0,1),()=>wc_T(ctx,"within its limit",tx+46,y+308,{w:700,size:28,col:WC_ROLEINK.alumna}));}}
// a small card on the dashboard, its name and two lines: each measure has a test for its limit; the platform works them out every night,
// keeps them and shows them. No tool is named (the series' rule, 20 October 2026)
function m9_tool(ctx,x,y,w,h,k,name,lines){wc_panel(ctx,x,y,w,h,{kind:"card",seed:k.length+50});wc_T(ctx,name,x+24,y+56,{w:800,size:32,col:WC_DARK});
  lines.forEach((s,i)=>wc_T(ctx,s,x+24,y+104+i*36,{w:600,size:28,col:WC_INK}));}
// a tutor's role, its term contract ended, still active: the kind of thing the third measure finds; o.ring draws the pencil round it, o.close
// closes it
function m9_tutor(ctx,t,x,y,o){const cl=o.close||0,a=clamp(1-cl*2,0,1),b=clamp(cl*2-1,0,1);withA(ctx,1-0.45*cl,()=>wc_chip(ctx,x,y,346,58,"tutor","term contract ended",null,{seed:3}));
  // one word, then the other: "still active" goes before "closed" comes, so the two never show at once
  if(a>0.01)withA(ctx,a,()=>wc_badge(ctx,x,y+110,"still active"));if(b>0.01)withA(ctx,b,()=>{wc_tick(ctx,x+22,y+108,30,WC_ROLEINK.alumna,b,4);wc_badge(ctx,x+48,y+110,"closed");});
  wc_ring(ctx,x+173,y+72,236,98,o.ring||0,{seed:5});}
// the alert, as it arrives on Monday at seven: which measure, how far it's gone, and its limit
function m9_bell(ctx,x,y){ctx.save();ctx.strokeStyle=rgba(WC_INK,0.9);ctx.fillStyle=rgba(wc_lit(WC_NO,0.55),1);ctx.lineWidth=2.6;ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(x-13,y+8);
  ctx.quadraticCurveTo(x-12,y-14,x,y-15);ctx.quadraticCurveTo(x+12,y-14,x+13,y+8);ctx.lineTo(x+16,y+11);ctx.lineTo(x-16,y+11);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.arc(x,y+15,4,0,TAU);ctx.stroke();ctx.restore();}
function m9_alert(ctx,x,y){const w=520,h=196,tW=tw(ctx,"alert · Monday 7:00",30,800);wc_panel(ctx,x,y,w,h,{kind:"card",role:WC_NO,sw:tW+92,seed:61});m9_bell(ctx,x+50,y+38);
  wc_T(ctx,"alert · Monday 7:00",x+80,y+48,{w:800,size:30,col:WC_DARK});wc_T(ctx,"the queue's oldest case: 12 days",x+32,y+112,{w:600,size:28,col:WC_INK});
  wc_T(ctx,"its limit: 7",x+32,y+156,{w:600,size:28,col:WC_MUTED});}
// the case: two records the queue couldn't decide alone, their birth dates one digit apart; the note on it, and its stamp
function m9_case(ctx,t,x,y,o){wc_panel(ctx,x,y,900,380,{kind:"sheet",seed:66});
  [["student","Student","S-21388","born 3 June"],["researcher","Researcher","E-5263","born 8 June"]].forEach(([r,title,id,bd],i)=>{const cx=x+30+i*440;
    wc_roleCard(ctx,cx,y+36,400,180,r,title,id,null,{note:"Daniel Okoye",seed:i+3});wc_T(ctx,bd,cx+32,y+180,{w:600,size:28,col:WC_INK});
    wc_ring(ctx,cx+32+tw(ctx,"born ",28,600)+tw(ctx,bd.slice(5),28,600)/2,y+170,62,26,o.ring||0,{seed:7+i,col:WC_NO});});
  // the note: waiting, then what HR said
  const nx=x+30,ny=y+252,nw=360;wc_panel(ctx,nx,ny,nw,92,{kind:"card",wash:WC_BADGE,washA:0.5,seed:68});const hr=o.hr||0;
  withA(ctx,1-hr,()=>wc_hand(ctx,"waiting for HR",nx+26,ny+58,{size:32,w:700,col:WC_INK}));withA(ctx,hr,()=>wc_hand(ctx,"HR: 3 June, a typo",nx+26,ny+58,{size:32,w:700,col:WC_INK,p:clamp(hr*1.4,0,1)}));
  m9_stamp(ctx,t,x+664,y+302,o.ts==null?1e9:o.ts,"linked · reason kept",{size:30});}

/* ---------- 7. a list from outside, and a change to the university's ---------- */
// the government's list of visa types, its title on the public sector's green-blue; its new row, when it's added (o.add)
function m9_govList(ctx,t,x,y,o){wc_panel(ctx,x,y,680,370,{kind:"card",role:WC_IND.public,sw:648,sh:92,seed:73});
  wc_T(ctx,"visa types",x+36,y+54,{w:800,size:32,col:WC_DARK});wc_T(ctx,"the government's list",x+36,y+92,{w:600,size:28,col:WC_DARK});
  ["student visa","graduate visa","visitor visa"].forEach((s,i)=>wc_T(ctx,s,x+40,y+156+i*48,{w:600,size:28,col:WC_INK}));
  const a=o.add||0;if(a>0.01)arrive(ctx,x+200,y+300,t,o.tAdd,()=>{wc_T(ctx,"graduate research visa",x+40,y+310,{w:700,size:28,col:WC_DARK});
    wc_badge(ctx,x+60+tw(ctx,"graduate research visa",28,700),y+300,"new");},{dy:10});}
// the university's own list: each visa type with its fee category; the new row joins it (o.join), carried from the change
const M9_UNIROWS=[["student visa","international fees"],["graduate visa","international fees"],["visitor visa","not eligible"]];
function m9_uniList(ctx,t,x,y,o){wc_panel(ctx,x,y,680,330,{kind:"card",role:WC_IND.uni,sw:648,sh:92,seed:75});
  wc_T(ctx,"visa types",x+36,y+54,{w:800,size:32,col:WC_DARK});wc_T(ctx,"the university's list",x+36,y+92,{w:600,size:28,col:WC_DARK});
  M9_UNIROWS.forEach(([a,b],i)=>{wc_T(ctx,a,x+40,y+156+i*44,{w:600,size:28,col:WC_INK});wc_T(ctx,b,x+640,y+156+i*44,{w:600,size:28,align:"right",col:WC_INK});});}
// the change an agent drafts, typed in as o.type goes 0 to 1: what, its evidence, and whose decision it is; the owner's tick (o.ok)
const M9_CHG=[["Map a new visa type",34,800,WC_DARK],["graduate research visa",30,700,WC_DARK],["→ international fees",30,700,WC_DARK],
  ["the government's notice",28,600,WC_MUTED],["closest value: student visa",28,600,WC_MUTED],["for: the admissions office",28,600,WC_INK]],M9_CHGY=[112,166,206,268,306,358];
function m9_change(ctx,t,x,y,o){wc_panel(ctx,x,y,620,476,{kind:"card",seed:71});wc_badge(ctx,x+32,y+44,"drafted by an agent");
  const n=M9_CHG.length,ty=clamp(o.type||0,0,1)*n;M9_CHG.forEach(([s,size,wt,col],i)=>{const p=clamp(ty-i,0,1);if(p>0)wc_T(ctx,typeOn(s,p),x+32,y+M9_CHGY[i],{w:wt,size,col});});
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.3);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+32,y+232);ctx.lineTo(x+588,y+232);ctx.stroke();ctx.restore();
  const ok=o.ok||0;if(ok>0){wc_tick(ctx,x+52,y+418,34,WC_ROLEINK.alumna,clamp(ok/0.4,0,1),4.5);withA(ctx,clamp((ok-0.3)/0.5,0,1),()=>wc_T(ctx,"approved by the admissions office",x+84,y+430,{w:700,size:28,col:WC_ROLEINK.alumna}));}}

/* ---------- 8. the governance scorecard ---------- */
// a row for each domain: its owner, and how many of its measures are within their limits; the person's row arrives (o.row), lit
const M9_SC=[["course","academic registrar","6 of 6"],["fees","finance office","4 of 4"],["research","research office","5 of 6"]],M9_SCX=[40,260,660];
function m9_scorecard(ctx,t,x,y,o){wc_panel(ctx,x,y,1240,560,{kind:"sheet",seed:81});wc_T(ctx,"governance scorecard",x+40,y+66,{w:800,size:36,col:WC_DARK});
  ["domain","owner","within limits"].forEach((s,i)=>wc_T(ctx,s,x+M9_SCX[i],y+132,{w:600,size:28,col:WC_MUTED}));
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.35);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+36,y+152);ctx.lineTo(x+1204,y+152);ctx.stroke();ctx.restore();
  M9_SC.forEach((r,i)=>r.forEach((s,k)=>wc_T(ctx,s,x+M9_SCX[k],y+204+i*60,{w:k?600:800,size:30,col:WC_INK})));
  const ra=o.row||0;if(ra>0.01)arrive(ctx,x+620,y+410,t,o.tRow,()=>{wc_panel(ctx,x+20,y+364,1200,76,{kind:"card",wash:WC_BADGE,washA:0.4,seed:83});
    ["person","Mei's office","5 of 5"].forEach((s,k)=>wc_T(ctx,s,x+M9_SCX[k],y+414,{w:800,size:30,col:WC_DARK}));},{dy:14});}

/* ---------- 9. elsewhere ---------- */
// a bank's duplicate customers over twelve years: they climb, and a clean-up every three years takes them back down; after one check at
// entry, they stay down. The line is drawn to year p*12; the chart's title is on the right, clear of the tag over the clean-ups
function m9_bankAt(y){if(y>=9.4)return 0.07+0.02*Math.sin(y*5);const k=y%3;return y<0.02?0.04:lerp(0.06,0.94,Math.pow(k/3,0.8));}
function m9_bankLine(ctx,t,b,p){const x0=b.x+60,x1=b.x+b.w-60,y0=b.y+120,y1=b.y+b.h-60,X=v=>lerp(x0,x1,v/12),Y=v=>lerp(y1,y0,v);wc_panel(ctx,b.x,b.y,b.w,b.h,{kind:"sheet",seed:91});
  wc_T(ctx,"a bank's duplicate customers",b.x+b.w-40,b.y+64,{w:800,size:32,col:wc_dim(WC_IND.bank,0.25),align:"right"});
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.8);ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(x0,y0-12);ctx.lineTo(x0,y1);ctx.lineTo(x1,y1);ctx.stroke();ctx.restore();
  const yE=clamp(p,0,1)*12;if(yE<=0)return{X,Y};const pts=[];for(let v=0;v<=yE+1e-6;v+=0.05){if(v>0&&Math.abs(v%3)<0.05&&v<9.2){pts.push([X(v-0.001),Y(m9_bankAt(v-0.06))]);}pts.push([X(v),Y(m9_bankAt(v))]);}
  ctx.save();ctx.strokeStyle=rgba(WC_IND.bank,0.95);ctx.lineWidth=5;ctx.lineCap="round";ctx.lineJoin="round";wc_trOpen(ctx,pts);ctx.stroke();ctx.restore();return{X,Y};}
// another industry with the same picture: a chip in its colour, with the same climb and fall, small, beside its name
function m9_indChip(ctx,x,y,ind,label){const w=Math.round(tw(ctx,label,30,800)+150);wc_chip(ctx,x,y,w,60,WC_IND[ind],label,null,{seed:label.length});
  const sx=x+w-104,sy=y+44;ctx.save();ctx.strokeStyle=rgba(wc_dim(WC_IND[ind],0.3),0.95);ctx.lineWidth=3;ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(sx,sy);
  for(let i=0;i<3;i++){ctx.lineTo(sx+i*26+22,sy-26);ctx.lineTo(sx+i*26+24,sy);}ctx.lineTo(sx+90,sy-2);ctx.stroke();ctx.restore();return w;}
