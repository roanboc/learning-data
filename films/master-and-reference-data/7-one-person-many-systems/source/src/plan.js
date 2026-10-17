/* ===== One person, many systems: the places and the pictures =====
   The places are painted once and kept (post.js): the valley in 1874, the campus today, Noor's office, and paper with a little sky
   and land for the chapters that explain. The pictures are the film's own things: the seven post offices, the treaties between pairs,
   a letter and its stamps, the treaty of Bern and the territory it made; the university's systems, the application, and the stamp
   that would make a third number; the four ways, as cards on Noor's wall; the doors where people are created; a bank's hub and a
   country's register; the search and its three outcomes; who may create a person; the second Linh Nguyen; and the person as a data
   product. Every name starts with m7_ (this film) or M7_. */

// the tools' logos (style2.js), for chapter 11: the series' finishing pass doesn't load them
loadLogos();

// the second Linh Nguyen: as unlike the first as two people are, younger, with long hair and a cardigan; no side, as Linh has none
PEOPLE.linh2={name:"Linh Nguyen",role:"Applicant",side:"Person",does:"uses",edge:[236,232,226],seed:23,
  skin:[222,182,146],hair:{style:"long",c:[22,18,20]},
  top:{kind:"cardigan",c:[196,180,150],inner:[246,242,234]},bottom:{c:[64,70,92]},shoe:[244,242,238],build:{sh:60,hip:56,h:0.9}};

/* ---------- the places ---------- */
// 1874: a wide valley under the Alps, a river, and in the middle a town with a clock tower. The post offices stand on it, drawn over
// it (m7_po), so they can move. The peaks are pointed and craggy; their snow is the paper left bare, down to a ragged line, and with
// the sun on the right, each peak's left face is in shade
const M7_ALPS=[[40,176,200],[290,222,240],[560,158,180],[820,204,220],[1090,240,260],[1370,170,190],[1620,214,230],[1880,182,210]];
const m7_peak=(L,x)=>L.reduce((a,[c,h,w])=>Math.max(a,h*Math.pow(Math.max(0,1-Math.abs(x-c)/w),1.4)),0);
const M7_CRAG=x=>(4*Math.sin(x/31)+3*Math.sin(x/12+1)+1.6*Math.sin(x/5.3+2))*Math.min(1,m7_peak(M7_ALPS,x)/60);
const M7_RIDGE=x=>548-m7_peak(M7_ALPS,x)+M7_CRAG(x);
const M7_SNOW=x=>{const h=m7_peak(M7_ALPS,x);if(h<112)return 0;const f=18*Math.pow(Math.max(0,Math.sin(x/13)),3)+8*Math.pow(Math.max(0,Math.sin(x/7+1)),4);return (h-112)*0.6+f*Math.min(1,(h-112)/40);};
// the foothills, rounded, and the valley floor, nearer and nearer
const M7_R2=x=>574-[[320,96,200],[1000,72,230],[1530,104,210]].reduce((a,[c,h,w])=>Math.max(a,h*Math.exp(-Math.pow((x-c)/w,2))),0)+4*Math.sin(x/53);
const M7_G1=x=>604+7*Math.sin(x/230+1)+3*Math.sin(x/70);
const M7_G2=x=>640+9*Math.sin(x/310+2)+4*Math.sin(x/110);
const M7_G3=x=>790+14*Math.sin((x+260)/360)+6*Math.sin(x/130);
const M7_RIVER=wc_smooth([[-60,712],[300,694],[640,680],[960,676],[1280,682],[1620,696],[1980,712]],8);
function m7_valley(ctx){const P=WCP;wc_sky(ctx,580,9,{sun:[1610,150],clouds:4,cy:60,ch:130});
  // a farther range, paler, between the peaks
  wc_land(ctx,x=>530-m7_peak([[180,128,230],[700,150,250],[1240,138,240],[1760,132,230]],x)+2*Math.sin(x/19),[196,206,228],0.1,{line:false});
  wc_land(ctx,M7_RIDGE,[168,178,208],0.2,{line:false});
  const top=[],bot=[];for(let x=-60;x<=W+60;x+=6){top.push([x,M7_RIDGE(x)-1]);bot.push([x,M7_RIDGE(x)+M7_SNOW(x)]);}
  wc_wash(ctx,top.concat(bot.reverse()),[244,246,250],{kind:"snow",line:false,seed:4});
  // each peak's left face in shade, from its summit down a spine to the foot of its left slope
  M7_ALPS.forEach(([c,h,w],k)=>{const pts=[];for(let x=c-0.6*w;x<=c;x+=6)pts.push([x,M7_RIDGE(x)]);pts.push([c,M7_RIDGE(c)],[c-0.12*w,M7_RIDGE(c)+0.7*h]);
    wc_wash(ctx,pts,[128,142,184],{kind:"chipwash",a:0.42,seed:20+k});});
  wc_land(ctx,M7_R2,[152,180,170],0.26,{line:false});
  wc_forest(ctx,x=>M7_G1(x)-2,P.farForest,0.3,13,{h:24,w:15});wc_land(ctx,M7_G1,P.far,0.32);
  wc_fieldStrips(ctx,M7_G1,4,34,3,[P.far,P.field],0.34,6);
  wc_land(ctx,M7_G2,P.mid,0.5);
  for(const [x,h] of [[70,120],[110,150],[1830,130],[1870,110]])wc_spruce(ctx,x,M7_G2(x)+4,h,0.5);
  wc_wash(ctx,wc_band(M7_RIVER,26,40),P.water,{depth:0.56,kind:"water",line:false});
  // the town: steep roofs round the clock tower, behind the office in the middle
  const R=wc_rng(31);for(let i=0;i<14;i++){const x=770+i*30+R()*8,w=34+R()*14,h=26+R()*16,y=M7_G2(x)-2;if(x>880&&x<990)continue;
    wc_part(ctx,wc_rect(x-w/2,y-h,w,h),[[240,228,206],[236,220,196],[244,236,220]][i%3],0.48);wc_part(ctx,[[x-w/2-4,y-h],[x+w/2+4,y-h],[x,y-h-w*0.7]],[178,122,104],0.48);}
  const tx=1096,ty=M7_G2(1096)-2;wc_part(ctx,wc_rect(tx-24,ty-176,48,176),[236,222,196],0.5);wc_part(ctx,[[tx-30,ty-176],[tx+30,ty-176],[tx,ty-238]],[150,104,92],0.5);
  wc_flat(ctx,wc_rect(tx-2,ty-262,4,26),[110,104,112],0.5,"cross");wc_wash(ctx,wc_ell(tx,ty-142,15,15,24),WC_PAPER,{depth:0.5,kind:"clock",lw:1.4});
  ctx.save();ctx.strokeStyle=rgba(WC_INK,0.8);ctx.lineWidth=2.4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(tx,ty-142);ctx.lineTo(tx,ty-152);ctx.moveTo(tx,ty-142);ctx.lineTo(tx+8,ty-139);ctx.stroke();ctx.restore();
  wc_land(ctx,M7_G3,P.near,0.8);wc_tufts(ctx,M7_G3,0,W,64,0.92,12);
  for(const [x,h,c] of [[40,230],[1890,250,P.leaf2],[470,170,P.leaf2],[1460,180]])wc_roundTree(ctx,x,M7_G3(x)+12,h,0.82,c);
  const F=wc_rng(8);for(let i=0;i<54;i++){const x=F()*W,y=M7_G3(x)+60+F()*(H-M7_G3(x)-60),r=3+F()*3+(y-880)/60;wc_wash(ctx,wc_ell(x,y,r,r*0.9,12),[P.flowerA,P.flowerB,P.flowerA][i%3],{kind:"dab",flat:true});}}
// today: the university, as One person, many roles paints it
const M7_LAWN=x=>664+5*Math.sin(x/300);
function m7_campus(ctx){const P=WCP;wc_sky(ctx,716,2,{sun:[1560,170]});
  wc_skyline(ctx,624,P.city,0.1,5);wc_treeRow(ctx,()=>640,-40,1980,58,70,0.24,21,P.leaf2);wc_land(ctx,M7_LAWN,P.lawn,0.42);
  wc_contact(ctx,140,770,668,0.46,0.22);wc_quad(ctx,150,668,0.46,0.62);wc_glassWing(ctx,762,668,150,170,0.48);
  [[1210,P.plaster],[1410,P.brickHouse,P.blueDoor],[1610,P.blueHouse],[1810,P.plaster]].forEach(([x,c,d])=>wc_terrace(ctx,x,742,232,c,0.56,{k:0.86,door:d}));
  wc_wash(ctx,[[1180,742],[W+60,742],[W+60,770],[1170,770]],P.hedge,{depth:0.6,kind:"hedge",lw:1.5});
  wc_roundTree(ctx,70,700,250,0.5);wc_roundTree(ctx,990,690,226,0.5,P.leaf2);wc_roundTree(ctx,1120,706,196,0.52);
  wc_wash(ctx,[[-60,782],[W+60,770],[W+60,H+60],[-60,H+60]],P.paving,{depth:0.72,kind:"ground",line:false});
  wc_wash(ctx,wc_band(wc_smooth([[540,668],[560,720],[620,800],[740,900],[880,1090]],8),30,240),wc_lit(P.paving,0.08),{depth:0.62,kind:"path",line:false});
  ctx.save();ctx.strokeStyle=rgba(wc_dim(P.paving,0.14),0.55);ctx.lineWidth=2;for(let i=0;i<8;i++){const y=800+i*i*5;ctx.beginPath();ctx.moveTo(-20,y);ctx.lineTo(W+20,y-10);ctx.stroke();}
  for(let i=-10;i<24;i++){ctx.beginPath();ctx.moveTo(960+i*54,782);ctx.lineTo(960+i*190,1080);ctx.stroke();}ctx.restore();
  wc_lamp(ctx,1186,846,300,0.72);}
// paper, with a little sky and a strip of land, for the chapters that explain; a second, for the other organisations
function m7_plain(ctx){wc_sky(ctx,836,3,{clouds:3});wc_land(ctx,x=>826+16*Math.sin(x/320+1),WCP.far,0.35,{line:false});wc_land(ctx,x=>882+10*Math.sin(x/240),WCP.near,0.75,{line:false});}
function m7_plainB(ctx){wc_sky(ctx,846,7,{clouds:4,cx:120,cw:1680});wc_land(ctx,x=>842+20*Math.sin(x/380+2),WCP.far,0.35,{line:false});wc_land(ctx,x=>898+12*Math.sin(x/260+1),WCP.near,0.75,{line:false});}
// Noor's office: a warm wall, a tall window onto the campus, a floor
function m7_office(ctx){const P=WCP;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,900),P.wallIn,{kind:"plaster",line:false});wc_wash(ctx,wc_rect(-40,858,W+80,260),P.floor,{kind:"ground",line:false});
  wc_wash(ctx,wc_rect(-40,846,W+80,18),wc_dim(P.wallIn,0.14),{kind:"trim",line:false,flat:true});
  ctx.save();ctx.beginPath();ctx.rect(72,112,436,560);ctx.clip();wc_sky(ctx,560,4,{clouds:2,cx:80,cw:380,cy:150,ch:120});
  wc_land(ctx,x=>600+8*Math.sin(x/90),P.lawn,0.42,{line:false});wc_part(ctx,wc_rect(330,330,70,270),WCP.stone,0.4);wc_part(ctx,[[322,330],[408,330],[365,250]],WCP.slate,0.4);
  wc_roundTree(ctx,150,640,220,0.5);wc_roundTree(ctx,460,650,190,0.5,P.leaf2);ctx.restore();
  for(const r of [wc_rect(60,100,460,16),wc_rect(60,100,16,584),wc_rect(504,100,16,584),wc_rect(282,100,16,584),wc_rect(60,384,460,12)])wc_wash(ctx,r,WC_PAPER,{kind:"trim",lw:1.4});
  wc_wash(ctx,wc_rect(40,676,500,22),wc_dim(P.wallIn,0.1),{kind:"trim",lw:1.5});}
const WC_PLACES={valley:m7_valley,campus:m7_campus,office:m7_office,plain:m7_plain,plainB:m7_plainB};
function m7_place(ctx,key,a){if(a==null||a>=1)return ctx.drawImage(wc_place(key),0,0,W,H);if(a>0.01)withA(ctx,a,()=>ctx.drawImage(wc_place(key),0,0,W,H));}
// a veil of paper over the whole frame, so what's drawn after it stands out
function m7_hush(ctx,a){if(a<=0.01)return;ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle=rgba(WC_PAPER,a);ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);ctx.restore();}

/* ---------- 1. the post offices of 1874 ---------- */
// the seven offices, standing for the countries, none of them named: where each stands (its door's foot), its size, and how far off
// it is; each is its own kind of house, with a post horn on a sign over the door
const M7_PO=[[220,752,0.84,0.62],[540,640,0.62,0.5],[930,642,0.6,0.5],[1380,640,0.62,0.5],[1700,752,0.84,0.62],[1240,862,1,0.72],[690,862,1,0.72]];
// the top of each kind of house, above its foot, at full size
const M7_POA=[-164,-142,-170,-166,-124,-180,-162];
function m7_win(q,list,d,w,h){w=w||24;h=h||30;for(const [x,y] of list){wc_flat(q,wc_rect(x-3,y-3,w+6,h+6),WC_PAPER,d);wc_wash(q,wc_rect(x,y,w,h),WCP.pane,{depth:d,kind:"window",line:false});wc_bars(q,x,y,w,h,WC_PAPER,2,d);}}
function m7_door(q,x,d,col){wc_wash(q,wc_arched(x-15,-54,30,54),col||WCP.door,{depth:d,kind:"door",lw:1.4});}
// the sign, and its post horn: a coiled horn with a flared bell
function m7_horn(q,x,y,d){wc_wash(q,wc_rect(x-30,y-12,60,24),[246,238,214],{depth:d,kind:"trim",lw:1.2});q.save();q.strokeStyle=rgba(WC_INK,0.85);q.lineWidth=2;q.lineCap="round";
  q.beginPath();q.ellipse(x-6,y,8,6,0,0,TAU);q.stroke();q.beginPath();q.moveTo(x+2,y-1);q.lineTo(x+14,y-2);q.stroke();q.beginPath();q.moveTo(x-14,y+3);q.lineTo(x-21,y+5);q.stroke();
  q.fillStyle=rgba(WC_INK,0.85);q.beginPath();q.moveTo(x+13,y-4);q.lineTo(x+23,y-9);q.lineTo(x+23,y+5);q.lineTo(x+13,y+1);q.closePath();q.fill();q.restore();}
const M7_POK=[
  // a gabled house, cream, with a slate roof
  (q,d)=>{wc_part(q,wc_rect(-82,-98,164,98),[244,232,206],d);wc_part(q,[[-94,-98],[94,-98],[0,-164]],[134,144,164],d);m7_win(q,[[-64,-80],[40,-80]],d);m7_door(q,0,d);m7_horn(q,0,-74,d);},
  // a hipped roof over ochre walls
  (q,d)=>{wc_part(q,wc_rect(-86,-92,172,92),[232,206,152],d);wc_part(q,[[-98,-92],[98,-92],[56,-142],[-56,-142]],[168,120,104],d);m7_win(q,[[-70,-74],[-38,-74],[14,-74],[46,-74]],d,22,28);
    m7_door(q,-4,d);m7_horn(q,-4,-70,d);},
  // a tall town house with a mansard roof and dormers
  (q,d)=>{wc_part(q,wc_rect(-70,-124,140,124),[238,226,206],d);wc_part(q,[[-80,-124],[80,-124],[66,-150],[40,-170],[-40,-170],[-66,-150]],[118,126,146],d);
    m7_win(q,[[-56,-110],[32,-110],[-56,-58],[32,-58]],d,24,32);m7_win(q,[[-12,-158]],d,24,20);m7_door(q,0,d);m7_horn(q,0,-70,d);},
  // a stepped gable, in tan brick
  (q,d)=>{wc_part(q,[[-66,0],[-66,-116],[-48,-116],[-48,-134],[-30,-134],[-30,-150],[-12,-150],[-12,-166],[12,-166],[12,-150],[30,-150],[30,-134],[48,-134],[48,-116],[66,-116],[66,0]],[212,172,142],d);
    m7_win(q,[[-50,-104],[26,-104],[-12,-140]],d,24,30);m7_door(q,0,d);m7_horn(q,0,-68,d);},
  // a flat roof behind a parapet, pale pink-grey, with arched windows
  (q,d)=>{wc_part(q,wc_rect(-90,-106,180,106),[230,210,200],d);wc_wash(q,wc_rect(-96,-116,192,12),[244,236,228],{depth:d,kind:"trim",lw:1.3});wc_part(q,wc_rect(-86,-124,172,10),[224,204,194],d);
    for(const x of [-72,-40,18,50])wc_wash(q,wc_arched(x,-88,22,36),WCP.pane,{depth:d,kind:"window",lw:1.2});m7_door(q,0,d);m7_horn(q,0,-74,d);},
  // timber framing under a steep roof
  (q,d)=>{wc_part(q,wc_rect(-76,-94,152,94),[246,240,228],d);q.save();q.strokeStyle=rgba(wc_haze([112,92,78],d),0.95);q.lineWidth=5;q.lineCap="square";q.beginPath();
    for(const x of [-74,-26,26,74]){q.moveTo(x,-92);q.lineTo(x,-2);}q.moveTo(-74,-48);q.lineTo(74,-48);q.moveTo(-74,-92);q.lineTo(-26,-48);q.moveTo(74,-92);q.lineTo(26,-48);q.stroke();q.restore();
    wc_part(q,[[-88,-94],[88,-94],[0,-180]],[160,112,92],d);m7_win(q,[[-58,-84],[38,-84]],d,22,28);m7_door(q,0,d,[120,92,74]);m7_horn(q,0,-68,d);},
  // a low hipped roof with a small tower on it
  (q,d)=>{wc_part(q,wc_rect(-82,-92,164,92),[206,214,226],d);wc_part(q,wc_rect(-16,-138,32,32),[214,220,230],d);wc_part(q,[[-92,-92],[92,-92],[72,-114],[-72,-114]],[128,134,152],d);
    wc_part(q,[[-21,-138],[21,-138],[0,-162]],[128,134,152],d);m7_win(q,[[-66,-76],[-36,-76],[16,-76],[46,-76]],d,22,28);m7_door(q,-2,d);m7_horn(q,-2,-72,d);}];
// an office, painted once at twice its full size, its foot at (130, 236) in a 260-pixel square
function m7_poPaint(i){return wc_kept("po"+i,520,520,q=>{q.scale(2,2);q.translate(130,236);wc_contact(q,-104,104,2,M7_PO[i][3],0.32);M7_POK[i](q,M7_PO[i][3]);});}
// office i where it stands: o.bob (0 to 1) lifts it and settles it again, o.a fades it
function m7_po(ctx,i,o){o=o||{};const [x,y,s]=M7_PO[i],a=o.a==null?1:o.a;if(a<=0.01)return;const b=o.bob||0,z=1+0.07*Math.sin(Math.PI*clamp(b,0,1));
  ctx.save();ctx.translate(x,y);ctx.scale(s*z,s/z*(1+0.05*Math.sin(Math.PI*clamp(b,0,1))));withA(ctx,a,()=>ctx.drawImage(m7_poPaint(i),-130,-236,260,260));ctx.restore();}
// the top of office i's roof, where its treaties meet
function m7_poTop(i){const [x,y,s]=M7_PO[i];return[x,y+(M7_POA[i]-10)*s];}
// a treaty between two offices: a pencil arc from roof to roof, bowing up, with a dot of sealing wax at its middle; drawn neighbours first
function m7_arc(a,b){const L=Math.hypot(b[0]-a[0],b[1]-a[1]),mx=(a[0]+b[0])/2,my=Math.min(a[1],b[1])-(18+L*0.12),o=[];
  for(let i=0;i<=16;i++){const t=i/16,u=1-t;o.push([u*u*a[0]+2*u*t*mx+t*t*b[0],u*u*a[1]+2*u*t*my+t*t*b[1]]);}return o;}
const M7_PAIRS=(()=>{const o=[];for(let i=0;i<7;i++)for(let j=i+1;j<7;j++){const a=m7_poTop(i),b=m7_poTop(j);o.push({i,j,pts:m7_arc(a,b),L:Math.hypot(a[0]-b[0],a[1]-b[1])});}
  return o.sort((p,q)=>p.L-q.L);})();
const M7_WAX=[150,36,48];
function m7_wax(ctx,x,y,s){if(s<=0.01)return;ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle=rgba(M7_WAX,0.92);ctx.beginPath();
  for(let i=0;i<12;i++){const a=i/12*TAU,r=7+(i%2?1.4:0);ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);}ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba([255,226,214],0.5);ctx.beginPath();ctx.arc(-2,-2.5,2.2,0,TAU);ctx.fill();ctx.restore();}
// the treaties, each drawn on from its start t0 plus its place in the order, every gap seconds; lift (0 to 1) takes them away
function m7_treaties(ctx,t,t0,gap,lift){if(t<t0)return;const la=1-ease(clamp(lift||0,0,1));if(la<=0.01)return;ctx.save();ctx.translate(0,-36*ease(clamp(lift||0,0,1)));
  withA(ctx,la,()=>M7_PAIRS.forEach((pr,k)=>{const p=clamp((t-t0-k*gap)/0.55,0,1);if(p<=0)return;wc_pencil(ctx,pr.pts,p,{col:WC_PENCIL,lw:2.2,a:0.62,seed:k+3,amp:0.8});
    const w=clamp((t-t0-k*gap-0.5)/0.25,0,1);if(w>0){const m=pr.pts[8];m7_wax(ctx,m[0],m[1],lerp(1.5,1,ease(w))*Math.min(1,w*3));}}));ctx.restore();}
// stamps of the countries a letter crossed before the union, each its own colour; a stamp lands a little large and settles
const M7_STAMPS=[[72,96,150],[146,104,72],[104,122,98]];
function m7_stamp(ctx,x,y,w,h,col,p){if(p<=0)return;const z=lerp(1.5,1,1-Math.pow(1-clamp(p,0,1),3));ctx.save();ctx.translate(x,y);ctx.scale(z,z);ctx.globalAlpha*=clamp(p*3,0,1);
  ctx.fillStyle=rgba(WC_CARD,1);ctx.fillRect(-w/2-2.5,-h/2-2.5,w+5,h+5);ctx.fillStyle=rgba(col,0.9);ctx.fillRect(-w/2,-h/2,w,h);
  ctx.fillStyle=rgba(wc_lit(col,0.5),0.9);ctx.beginPath();ctx.ellipse(0,0,w*0.24,h*0.28,0,0,TAU);ctx.fill();ctx.restore();}
// a letter: the envelope and its stamps in the corner, each [colour, how far it has landed]
function m7_letter(ctx,x,y,s,rot,st){ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);wc_envelope(ctx,0,0,s,0);
  (st||[]).forEach(([col,p],k)=>m7_stamp(ctx,(42-k*24)*s,-22*s,18*s,22*s,col,p));ctx.restore();}
// the union's letter: one stamp, the one rate, 25 centimes; k scales it
function m7_letter25(ctx,x,y,p,rot,k){ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);if(k)ctx.scale(k,k);wc_envelope(ctx,0,0,2.1,0);const q=clamp(p,0,1);
  if(q>0){const z=lerp(1.4,1,1-Math.pow(1-q,3));ctx.save();ctx.translate(72,-26);ctx.scale(z,z);ctx.globalAlpha*=clamp(q*3,0,1);ctx.fillStyle=rgba(WC_CARD,1);ctx.fillRect(-46,-40,92,80);
    ctx.fillStyle=rgba([206,222,236],1);ctx.fillRect(-42,-36,84,72);ctx.strokeStyle=rgba([70,96,140],0.9);ctx.lineWidth=2.4;ctx.strokeRect(-36,-30,72,60);
    // once the letter shrinks to fly to the offices, its stamp is a picture, not something to read
    wc_T(ctx,"25 c",0,10,{w:800,size:30,align:"center",col:WC_DARK,deco:k&&k<0.95?1:0});ctx.restore();}ctx.restore();}
// the treaty of Bern: parchment with a deckled edge, what it makes and where and when, in ink, twenty-one signatures, one for each
// country, and the seal
const M7_TW=600,M7_TH=372;
// a signature: a tall first letter, then a few joined loops, and a stroke back under the name
// (some loops rise tall, some drop below the line, and each hand slants its own way)
const M7_SIG=(()=>{const R=wc_rng(77),o=[];for(let k=0;k<21;k++){const n=3+Math.floor(R()*2),adv=9+R()*2.5,r=4.5+R()*2,h=9+R()*5,sl=0.12+R()*0.36,hs=[],pts=[];
  for(let j=0;j<n;j++){const q=R();hs.push(j===0?h*(1.7+R()*0.6):q<0.2?-h*1.3:q<0.4?h*1.8:h*(0.75+0.5*R()));}
  for(let u=0;u<=n*TAU+1e-6;u+=0.3){const j=Math.min(n-1,Math.floor(u/TAU)),y=-(hs[j]/2)*(1-Math.cos(u));pts.push([adv*u/TAU-r*Math.sin(u)-y*sl,y]);}
  const e=pts[pts.length-1][0];pts.push([e+5,3],[e+1,7],[e*0.5,8.5],[-2,6]);o.push(pts);}return o;})();
const m7_sigAt=k=>[48+(k%7)*72,236+Math.floor(k/7)*52];
const M7_EDGE=(()=>{const R=wc_rng(12),o=[],side=(x0,y0,x1,y1,n)=>{for(let i=0;i<n;i++){const t=i/n;o.push([lerp(x0,x1,t)+(R()-0.5)*3.4,lerp(y0,y1,t)+(R()-0.5)*3.4]);}};
  side(0,0,M7_TW,0,44);side(M7_TW,0,M7_TW,M7_TH,28);side(M7_TW,M7_TH,0,M7_TH,44);side(0,M7_TH,0,0,28);return o;})();
function m7_treatyPaper(){return wc_kept("treaty",(M7_TW+40)*2,(M7_TH+40)*2,q=>{q.scale(2,2);q.translate(20,20);
  wc_wash(q,M7_EDGE,WCP.parchment,{kind:"page",lw:2,seed:12});
  // older at the edges
  q.save();wc_tr(q,M7_EDGE);q.clip();const g=q.createRadialGradient(M7_TW/2,M7_TH/2,M7_TH*0.3,M7_TW/2,M7_TH/2,M7_TW*0.62);
  g.addColorStop(0,rgba([214,190,140],0));g.addColorStop(1,rgba([196,164,112],0.34));q.fillStyle=g;q.fillRect(0,0,M7_TW,M7_TH);q.restore();
  q.strokeStyle=rgba(WCP.parchInk,0.3);q.lineWidth=1.4;q.beginPath();q.moveTo(48,172);q.lineTo(M7_TW-48,172);q.stroke();});}
// the seal, pressed on at the corner as p goes 0 to 1, over two ends of ribbon
function m7_seal(ctx,x,y,p){if(p<=0)return;const z=lerp(1.5,1,1-Math.pow(1-clamp(p,0,1),3));ctx.save();ctx.translate(x,y);ctx.scale(z,z);ctx.globalAlpha*=clamp(p*3,0,1);
  ctx.fillStyle=rgba(wc_lit(M7_WAX,0.18),0.9);for(const [a,l] of [[0.5,40],[0.95,36]]){ctx.save();ctx.rotate(a);ctx.beginPath();ctx.moveTo(-6,0);ctx.lineTo(6,0);ctx.lineTo(7,l);ctx.lineTo(0,l-6);ctx.lineTo(-7,l);ctx.closePath();ctx.fill();ctx.restore();}
  m7_wax(ctx,0,0,3.4);ctx.strokeStyle=rgba(wc_dim(M7_WAX,0.3),0.7);ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(0,0,14,0,TAU);ctx.stroke();ctx.restore();}
// the treaty, its top left at (0, 0): the words written in as o.title and o.date go 0 to 1, the signatures as o.sig does, then the seal
function m7_treatyBody(ctx,o){ctx.drawImage(m7_treatyPaper(),-20,-20,M7_TW+40,M7_TH+40);
  wc_hand(ctx,"General Postal Union",48,94,{p:o.title==null?1:o.title,size:44,w:700,col:WCP.parchInk});wc_hand(ctx,"Bern, 9 October 1874",50,148,{p:o.date==null?1:o.date,size:32,w:600,col:WCP.parchInk});
  M7_SIG.forEach((pts,k)=>{const p=clamp((o.sig==null?1:o.sig)*21-k,0,1);if(p<=0)return;const [sx,sy]=m7_sigAt(k);ctx.save();ctx.translate(sx,sy);
    wc_pencil(ctx,pts,p,{col:WCP.parchInk,lw:1.9,a:0.88,seed:k+40,amp:0.3});ctx.restore();});
  m7_seal(ctx,M7_TW-34,M7_TH-30,o.seal==null?1:o.seal);}
// the treaty as it's signed, at its full size about (cx, cy), or kept, signed, for when it's small
function m7_treaty(ctx,cx,cy,k,o){ctx.save();ctx.translate(cx-M7_TW*k/2,cy-M7_TH*k/2);ctx.scale(k,k);
  if(o)m7_treatyBody(ctx,o);else ctx.drawImage(wc_kept("treatyDone",(M7_TW+40)*2,(M7_TH+40)*2,q=>{q.scale(2,2);q.translate(20,20);m7_treatyBody(q,{});}),-20,-20,M7_TW+40,M7_TH+40);ctx.restore();}
// the territory the treaty made: one line round the valley, and the paper inside it brightened a little
const M7_LOOP=wc_smooth([[96,806],[120,652],[300,540],[620,500],[960,488],[1300,500],[1620,540],[1820,652],[1846,806],[1640,872],[1240,890],[700,890],[290,872],[96,806]],6);
function m7_territory(ctx,p,glow){if(p<=0)return;if(glow>0.01){ctx.save();wc_tr(ctx,M7_LOOP);ctx.fillStyle=rgba([255,253,246],0.3*glow);ctx.fill();ctx.restore();}
  wc_pencil(ctx,M7_LOOP,p,{col:WC_PENCIL,lw:3.6,a:0.85,seed:61,amp:1.2});}
// the post office for the world that nobody built: a great hall with columns, a pediment and a dome, in faint, dashed pencil
const M7_GHOST=(()=>{const cx=960,by=660,o=[[[cx-380,by],[cx-380,by-170],[cx+380,by-170],[cx+380,by]],[[cx-220,by-170],[cx,by-246],[cx+220,by-170]]];
  const dome=[];for(let i=0;i<=16;i++){const a=Math.PI+i/16*Math.PI;dome.push([cx+Math.cos(a)*112,by-246+Math.sin(a)*96]);}o.push(dome,[[cx-12,by-342],[cx-12,by-370],[cx+12,by-370],[cx+12,by-342]]);
  for(let k=0;k<6;k++){const x=cx-150+k*60;o.push([[x,by-150],[x,by-10]]);}o.push([[cx-404,by],[cx+404,by]]);return o;})();
function m7_ghost(ctx,p,a){if(p<=0||a<=0.01)return;withA(ctx,a,()=>M7_GHOST.forEach((pts,k)=>{const q=clamp(p*M7_GHOST.length*0.6-k*0.6,0,1);if(q>0)wc_pencil(ctx,pts,q,{col:WC_PENCIL,lw:2.6,a:0.6,seed:70+k,dash:[12,10],amp:0.6});}));}
// a coin for each office, which it keeps: it spins down beside the door, bounces once, and stays
function m7_coin(ctx,i,p){if(p<=0)return;const [x,y,s]=M7_PO[i],f=clamp(p/0.5,0,1),gy=y-14*s,y0=y-200*s,
    yy=p<0.5?lerp(y0,gy,f*f):gy-Math.abs(Math.sin(Math.PI*clamp((p-0.5)/0.3,0,1)))*14*s*(1-clamp((p-0.5)/0.5,0,1)),spin=p<0.62?Math.abs(Math.cos(p*14)):1;
  ctx.save();ctx.translate(x+46*s,yy);ctx.scale(s*Math.max(0.16,spin),s);ctx.fillStyle=rgba([228,186,82],1);ctx.beginPath();ctx.arc(0,0,15,0,TAU);ctx.fill();
  ctx.strokeStyle=rgba([150,110,38],0.95);ctx.lineWidth=2.4;ctx.stroke();ctx.strokeStyle=rgba([168,126,48],0.7);ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(0,0,10,0,TAU);ctx.stroke();
  ctx.fillStyle=rgba([255,246,206],0.85);ctx.beginPath();ctx.arc(-5,-5,3.4,0,TAU);ctx.fill();ctx.restore();}
// the valley as chapter 1 leaves it, kept: the offices inside one line, and the treaty above the town with a line to each
function m7_bernKept(){return wc_kept("bern",W,H,q=>{m7_place(q,"valley");for(let i=0;i<7;i++)m7_po(q,i);m7_territory(q,1,1);m7_rules(q,1);m7_treaty(q,960,M7_PINY,M7_PINK);});}
// the treaty's place once it's agreed: above the town; and a dotted line from it to each office, the rules they share
const M7_PINY=212,M7_PINK=0.36;
function m7_rules(ctx,p){if(p<=0)return;for(let i=0;i<7;i++){const [x,y]=m7_poTop(i);wc_link(ctx,960,M7_PINY+M7_TH*M7_PINK/2+4,x,y-8,WC_PENCIL,{p:clamp(p*1.6-i*0.1,0,1),vertical:true,a:0.7,lw:2.6});}}
// the valley, small and framed, for when a later chapter looks back at it
function m7_inset(ctx,x,y,w,a){if(a<=0.01)return;const h=Math.round(w*H/W);withA(ctx,a,()=>{wc_panel(ctx,x-12,y-12,w+24,h+24,{kind:"card",seed:5});ctx.drawImage(m7_bernKept(),x,y,w,h);
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.6);ctx.lineWidth=1.6;ctx.strokeRect(x,y,w,h);ctx.restore();});}

/* ---------- 2. the university ---------- */
// the stamp that numbers a record: its knob, its neck, its base and the inked rubber; kept at twice the size, its face at (x, y)
const M7_STAMP=[58,52,120];
function m7_stamper(ctx,x,y,s,a){if(a<=0.01)return;const c=wc_kept("stamper",260,300,q=>{q.scale(2,2);q.translate(65,140);const P=WCP;
    wc_wash(q,wc_rect(-46,-36,92,26),P.wood,{kind:"trim",lw:1.5});wc_wash(q,wc_rect(-42,-11,84,11),M7_STAMP,{kind:"trim",lw:1.2,a:0.9});
    wc_wash(q,wc_rect(-8,-82,16,48),wc_dim(P.wood,0.12),{kind:"trim",lw:1.3});wc_wash(q,wc_ell(0,-96,22,18,24),wc_lit(P.wood,0.06),{kind:"trim",lw:1.5});});
  withA(ctx,a,()=>ctx.drawImage(c,x-65*s,y-140*s,130*s,150*s));}
// a number stamped on at ts, centred at (cx, cy), k times the size of 1947's in One person, many roles: it lands a little large and settles
function m7_stampOn(ctx,t,cx,cy,ts,s,k){const p=clamp((t-ts)/0.2,0,1);if(p<=0)return;const z=k*lerp(1.32,1,1-Math.pow(1-p,3));
  ctx.save();ctx.translate(cx,cy);ctx.rotate(-0.035);ctx.scale(z,z);withA(ctx,p,()=>{ctx.drawImage(m7_stampRule(),-210,-60,420,120);
    wc_T(ctx,s,0,20,{f:"mono",w:500,size:56,col:M7_STAMP,a:0.88,align:"center"});});ctx.restore();}
function m7_stampRule(){return wc_kept("stampRule",840,240,q=>{q.scale(2,2);q.translate(4,4);
  wc_ink(q,wc_rrPts(0,0,412,112,10),true,3.6,M7_STAMP,0.9,41,0.6);wc_ink(q,wc_rrPts(9,9,394,94,6),true,1.8,M7_STAMP,0.85,43,0.6);
  q.globalCompositeOperation="destination-out";q.globalAlpha=0.5;q.drawImage(WC.blotch,-40,-30,520,300);});}
// the university's systems, each in the colour of the role it keeps, and who it keeps
const M7_SYS={student:["student","student system","students, applicants"],hr:["tutor","HR","staff, tutors"],research:["researcher","research office","researchers"],alumni:["alumna","alumni office","graduates"]};
const M7_SK=["student","hr","research","alumni"],M7_SH=112;
function m7_sys(ctx,k,x,y,w,o){o=o||{};const [r,title,sub]=M7_SYS[k],tW=tw(ctx,title,30,800);
  wc_panel(ctx,x,y,w,M7_SH,{kind:"card",role:WC_ROLE[r],sw:tW+36,seed:M7_SK.indexOf(k)+11});wc_T(ctx,title,x+32,y+48,{w:800,size:30,col:WC_DARK});
  if(o.sub!==false)wc_T(ctx,sub,x+32,y+92,{w:600,size:28,col:WC_MUTED});}
// Linh's roles, as bands on her white figure, in the order One person, many roles gave them; the applicant's is the fifth
const M7_BANDS=["student","tutor","researcher","alumna","applicant"];
const m7_bands=a=>M7_BANDS.map((r,i)=>({col:WC_ROLE[r],a:a[i]==null?1:a[i],i}));
// an application, in the student system: its title, what it's for, and four fields. Each field is [value, how far it's typed (0 to 1),
// how lit (0 to 1), its mark (1 a tick, -1 a cross), how far the mark is drawn]; o.found writes what the search found, at the foot
const M7_FIELDS=["name","birth date","email","number from before"],M7_FH=58;
function m7_appH(o){return o&&o.nof?124:128+M7_FIELDS.length*M7_FH+(o&&o.foot?62:16);}
function m7_app(ctx,x,y,w,o){o=o||{};const h=m7_appH(o),tW=tw(ctx,"Application",30,800);
  wc_panel(ctx,x,y,w,h,{kind:"card",role:WC_ROLE.applicant,sw:tW+36,seed:6});wc_T(ctx,"Application",x+32,y+48,{w:800,size:30,col:WC_DARK});
  if(o.sub)wc_T(ctx,o.sub,x+32,y+96,{w:600,size:28,col:WC_MUTED});
  if(!o.nof)M7_FIELDS.forEach((lab,i)=>{const f=(o.fields||[])[i]||[],yy=y+128+i*M7_FH,lit=f[2]||0;
    if(lit>0.01)withA(ctx,lit,()=>wc_panel(ctx,x+18,yy+2,w-36,M7_FH-8,{kind:"chip",role:WC_ROLE.applicant,seed:i+5}));
    else wc_panel(ctx,x+18,yy+2,w-36,M7_FH-8,{kind:"card",dashed:true,seed:i+5});
    wc_T(ctx,lab,x+42,yy+40,{w:600,size:28,col:lit>0.5?WC_DARK:WC_MUTED});
    if(f[0]&&f[1]>0)wc_T(ctx,typeOn(f[0],clamp(f[1],0,1)),x+316,yy+40,{w:500,size:28,f:"mono",col:WC_DARK});
    if(f[3]&&f[4]>0){if(f[3]>0)wc_tick(ctx,x+w-48,yy+22,32,WC_ROLEINK.alumna,f[4],4.5);else wc_cross(ctx,x+w-48,yy+26,28,WC_NO,f[4]);}});
  if(o.foot){const p=o.found||0,yy=y+h-24;if(p>0){wc_tick(ctx,x+50,yy-10,30,WC_ROLEINK.alumna,clamp(p/0.3,0,1),4);
    wc_T(ctx,typeOn(o.foot,clamp((p-0.25)/0.75,0,1)),x+82,yy,{w:800,size:28,col:WC_ROLEINK.alumna});}}}
// an empty record waiting for a number: dashed, in the applicant's colour, its number's place blank until the stamp lands
function m7_ghostRec(ctx,x,y,w,note,o){if(o&&o.paper){ctx.save();ctx.fillStyle=rgba(WC_CARD,0.94);ctx.beginPath();rr(ctx,x,y,w,120,10);ctx.fill();ctx.restore();}
  wc_roleCard(ctx,x,y,w,120,"applicant","Applicant",null,null,{note,dashed:true});
  ctx.save();ctx.strokeStyle=rgba(WC_ROLE.applicant,0.9);ctx.setLineDash([8,8]);ctx.lineWidth=2.4;ctx.beginPath();rr(ctx,x+w-228,y+16,204,44,8);ctx.stroke();ctx.restore();}

/* ---------- 3 to 5. the four ways ---------- */
// the four ways to give many systems one person, as One person, many roles drew them small, here as cards on Noor's wall, each with a
// chip for each system under its diagram
const M7_WAYS=[["registry","only links"],["consolidation","a copy for analysis"],["coexistence","systems read it back"],["centralised","people created here"]];
const M7_WX=[560,900,1240,1580],M7_WY=112,M7_WW=320,M7_WH=478,M7_CY=300;
const m7_chipX=(i,k)=>M7_WX[i]+52+k*72;
function m7_arrow(ctx,x0,y0,x1,y1,p,o){o=o||{};if(p<=0)return;const ex=lerp(x0,x1,ease(clamp(p,0,1))),ey=lerp(y0,y1,ease(clamp(p,0,1))),an=Math.atan2(y1-y0,x1-x0),hs=o.head||15;ctx.save();
  ctx.strokeStyle=rgba(o.col||WC_INK,o.a==null?0.9:o.a);ctx.fillStyle=rgba(o.col||WC_INK,o.a==null?0.9:o.a);ctx.lineWidth=o.lw||3;ctx.lineCap="round";if(o.dash)ctx.setLineDash(o.dash);
  ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(ex,ey);ctx.stroke();ctx.setLineDash([]);
  const head=(x,y,a)=>{ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-hs*Math.cos(a-0.45),y-hs*Math.sin(a-0.45));ctx.lineTo(x-hs*Math.cos(a+0.45),y-hs*Math.sin(a+0.45));ctx.closePath();ctx.fill();};
  if(p>=1){if(o.end!==false)head(x1,y1,an);if(o.start)head(x0,y0,an+Math.PI);}ctx.restore();}
// way i's card: q (0 to 1) draws its diagram in; o.ask sends each system a question along its link (registry); o.chart (consolidation)
function m7_way(ctx,t,i,q,o){o=o||{};const x=M7_WX[i],y=M7_WY,fx=x+160,cy=y+M7_CY;
  wc_panel(ctx,x,y,M7_WW,M7_WH,{kind:"card",seed:60+i});
  if(!o.frame)M7_SK.forEach((k,j)=>wc_panel(ctx,m7_chipX(i,j)-29,cy,58,40,{kind:"chip",role:WC_ROLE[M7_SYS[k][0]],seed:j+i*4}));
  const na=o.na==null?1:o.na;if(na>0.01)withA(ctx,na,()=>{wc_T(ctx,M7_WAYS[i][0],fx,y+404,{w:800,size:32,align:"center",col:WC_DARK});wc_T(ctx,M7_WAYS[i][1],fx,y+446,{w:600,size:28,align:"center",col:WC_MUTED});});
  if(q<=0||o.frame)return;const xs=M7_SK.map((k,j)=>m7_chipX(i,j)),pk=j=>clamp(q*1.6-j*0.2,0,1);
  if(i===0){withA(ctx,clamp(q*3,0,1),()=>{wc_panel(ctx,fx-50,y+56,100,118,{kind:"card",seed:7});ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.6);ctx.lineWidth=2.4;
      for(let k=0;k<4;k++){ctx.beginPath();ctx.moveTo(fx-30,y+86+k*24);ctx.lineTo(fx+30,y+86+k*24);ctx.stroke();}ctx.restore();});
    xs.forEach((sx,j)=>wc_link(ctx,fx,y+178,sx,cy-4,WC_PENCIL,{p:pk(j),vertical:true,a:0.85,lw:2.8}));
    // a question runs down each link and its answer back up
    if(o.ask>0)xs.forEach((sx,j)=>{const u=((t-o.ask)*0.7-j*0.18),ph=u-Math.floor(u);if(u<0)return;const d=ph<0.5?ph*2:2-ph*2,cx0=fx,cy0=y+178,cx1=sx,cy1=cy-4;
      const bx=Math.pow(1-d,3)*cx0+3*Math.pow(1-d,2)*d*cx0+3*(1-d)*d*d*cx1+d*d*d*cx1,by=Math.pow(1-d,3)*cy0+3*Math.pow(1-d,2)*d*(cy0+cy1)/2+3*(1-d)*d*d*(cy0+cy1)/2+d*d*d*cy1;
      ctx.save();ctx.fillStyle=rgba(ph<0.5?WC_INK:WC_ROLE[M7_SYS[M7_SK[j]][0]],0.95*clamp(u*3,0,1));ctx.beginPath();ctx.arc(bx,by,6,0,TAU);ctx.fill();ctx.restore();});}
  else if(i===1){withA(ctx,clamp(q*3,0,1),()=>{wc_panel(ctx,x+34,y+30,196,214,{kind:"card",seed:9,wash:[132,182,222],washA:0.28});
      wc_T(ctx,"lakehouse",x+132,y+70,{w:700,size:28,align:"center",col:WC_DARK});wc_white(ctx,"linh",x+132,y+236,0.15,m7_bands([1,1,1,1,0]),{a:ease(q),shadow:false});});
    xs.forEach((sx,j)=>m7_arrow(ctx,sx,cy-6,x+132+(sx-fx)*0.35,y+250,pk(j),{lw:2.6}));
    if(o.chart>0)withA(ctx,clamp(o.chart,0,1),()=>{ctx.save();ctx.fillStyle=rgba(WC_PENCIL,0.8);[[0,34],[16,52],[32,26]].forEach(([dx,hh])=>ctx.fillRect(x+252+dx,y+236-hh*ease(clamp(o.chart,0,1)),11,hh*ease(clamp(o.chart,0,1))));
      ctx.strokeStyle=rgba(WC_PENCIL,0.7);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+246,y+238);ctx.lineTo(x+300,y+238);ctx.stroke();ctx.restore();});}
  else{wc_white(ctx,"linh",fx,y+232,0.2,m7_bands([1,1,1,1,0]),{a:ease(q),shadow:false});
    xs.forEach((sx,j)=>{const a0=[sx,cy-6],a1=[fx+(sx-fx)*0.3,y+238];if(i===2)m7_arrow(ctx,a0[0],a0[1],a1[0],a1[1],pk(j),{start:true,lw:2.6});else m7_arrow(ctx,a1[0],a1[1],a0[0],a0[1],pk(j),{lw:2.6});});}}
// the soft shadow a white figure stands on, as wc_white draws it, at (0, 0) and alpha a: for a figure drawn at a scale that changes
function m7_shadow(ctx,id,s,a){if(a<=0.01)return;const k=s*PEOPLE[id].build.h,g=ctx.createRadialGradient(0,-4,4,0,-4,110*k);g.addColorStop(0,rgba([90,80,96],a));g.addColorStop(1,rgba([90,80,96],0));
  ctx.save();ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(0,-4,110*k,18*k,0,0,TAU);ctx.fill();ctx.restore();}
// a door, where people are created, washed in the colour of who comes in through it
function m7_door2(ctx,x,y,col,s){const c=wc_kept("door"+col.join(","),180,200,q=>{q.scale(2,2);q.translate(45,92);
    wc_wash(q,wc_arched(-30,-84,60,84),wc_lit(col,0.25),{kind:"door",lw:1.8});wc_wash(q,wc_arched(-22,-74,44,74),col,{kind:"door",lw:1.4,a:0.9});
    q.fillStyle=rgba(WC_INK,0.85);q.beginPath();q.arc(13,-36,3.4,0,TAU);q.fill();wc_wash(q,wc_rect(-38,-4,76,8),[214,204,190],{kind:"trim",lw:1.2});});
  ctx.save();ctx.translate(x,y);ctx.scale(s||1,s||1);ctx.drawImage(c,-45,-92,90,100);ctx.restore();}

/* ---------- 6. elsewhere ---------- */
// two panels, a bank and a country, each with its own heavier way: a hub its product systems read, a register its agencies ask
const M7_PAN=[[80,"bank","a bank","customer hub",["current account","card","mortgage"]],[1000,"public","a country","population register",["tax office","health service","schools"]]],M7_PY=150,M7_PW=840,M7_PH=560;
function m7_panel(ctx,i){const [x,ind,title]=M7_PAN[i];wc_panel(ctx,x,M7_PY,M7_PW,M7_PH,{kind:"card",seed:20+i});
  wc_panel(ctx,x+12,M7_PY+12,M7_PW-24,62,{kind:"card",wash:WC_IND[ind],washA:0.62,seed:30+i});wc_T(ctx,title,x+36,M7_PY+55,{w:800,size:32,col:WC_DARK});}
// the hub or the register: a box with someone in it, in white paper
function m7_hub(ctx,i,a){const [x,ind,,name]=M7_PAN[i];withA(ctx,a,()=>{wc_panel(ctx,x+36,M7_PY+110,330,410,{kind:"card",wash:WC_IND[ind],washA:0.18,seed:40+i});
  wc_T(ctx,name,x+201,M7_PY+160,{w:800,size:28,align:"center",col:WC_DARK});wc_white(ctx,i?"noor":"minh",x+201,M7_PY+492,0.42,[],{a:1});});}
// a system or an agency: a chip in the panel's colour, with its name at 28 px
function m7_rchip(ctx,x,y,ind,label){const w=Math.round(tw(ctx,label,28,800)+48);wc_panel(ctx,x,y,w,56,{kind:"chip",role:WC_IND[ind],seed:label.length});
  wc_T(ctx,label,x+24,y+38,{w:800,size:28,col:WC_DARK});return w;}

/* ---------- 7. search before create ---------- */
// the search's three outcomes, in lanes: found, likely, nobody
const M7_LANES=[["found: add a role",228],["likely: Mei's office decides",428],["nobody: a new person",628]];
// a likely match, as a gold card in Mei's queue: a tray with two cards already waiting
function m7_queue(ctx,x,y,p,t){wc_panel(ctx,x,y,170,96,{kind:"card",seed:14,fill:[244,238,226]});
  for(let k=0;k<2;k++)wc_panel(ctx,x+16+k*10,y+18-k*8,120,52,{kind:"tag",seed:16+k});
  if(p>0){const u=ease(clamp(p,0,1)),cx=lerp(x-120,x+46,u),cy=lerp(y-60,y+2,u);wc_panel(ctx,cx,cy,120,52,{kind:"chip",role:WC_SIDE.biz,seed:18});}}

/* ---------- 8. who may create a person ---------- */
// the sheet Noor and Mei write: each system, with its dot of colour, and what it may do; Mei's tick at the foot
const M7_RS={x:470,y:96,w:980,h:640},M7_RC=[520,980];
const M7_RULE=[["applicant","the application","creates, after a search",1],["tutor","HR","creates, after a search",1],["researcher","research office","adds roles",0],["alumna","alumni office","adds roles",0]];
function m7_rule(ctx,t,o){const K=M7_RS,[c1,c2]=M7_RC;wc_panel(ctx,K.x,K.y,K.w,K.h,{kind:"sheet",seed:3});wc_T(ctx,"who may create a person",c1,K.y+70,{w:800,size:38,col:WC_DARK});
  withA(ctx,fin(t,o.rows[0]-0.4,0.4),()=>{wc_T(ctx,"system",c1,K.y+150,{w:600,size:28,col:WC_MUTED});wc_T(ctx,"may it create a person?",c2,K.y+150,{w:600,size:28,col:WC_MUTED});
    ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.45);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(c1,K.y+166);ctx.lineTo(K.x+K.w-40,K.y+166);ctx.stroke();ctx.restore();});
  M7_RULE.forEach(([r,s,does,may],i)=>{const k=fin(t,o.rows[i],0.35);if(k<=0.01)return;const y=K.y+226+i*76;withA(ctx,k,()=>{ctx.save();ctx.fillStyle=rgba(WC_ROLE[r],1);ctx.beginPath();ctx.arc(c1+10,y-10,10,0,TAU);ctx.fill();ctx.restore();
    wc_T(ctx,s,c1+34,y,{w:700,size:30,col:WC_DARK});if(may){wc_tick(ctx,c2+14,y-10,30,WC_ROLEINK.alumna,clamp((t-o.rows[i]-0.3)/0.4,0,1),4.5);wc_T(ctx,does,c2+46,y,{w:700,size:30,col:WC_DARK});}
    else wc_T(ctx,does,c2+46,y,{w:600,size:30,col:WC_INK});});});
  const ma=fin(t,o.mei,0.5);if(ma>0.01)withA(ctx,ma,()=>{const y=K.y+K.h-74;wc_panel(ctx,K.x+20,y-40,K.w-40,64,{kind:"card",wash:WC_BADGE,washA:0.5,seed:2});
    wc_T(ctx,"agreed by Mei's office",c1,y+3,{w:800,size:30,col:WC_DARK});wc_tick(ctx,c1+tw(ctx,"agreed by Mei's office",30,800)+40,y-8,40,[176,124,10],clamp((t-o.tick)/0.45,0,1),5.5);});}

/* ---------- 10. kept apart ---------- */
// the search lays the new application beside the person it might be: each value, a mark, and the application's value
const M7_CMP=[["Linh Nguyen","Linh Nguyen",1],["14 Mar 2001","9 Aug 2007",-1],["linh.nguyen@mail.example","linh.n07@mail.example",-1],["S-20436","none",-1]];
const M7_CX=480,M7_CW=904,M7_CT=150;
function m7_compare(ctx,t,o){const x=M7_CX,y=M7_CT,w=M7_CW,h=146+M7_CMP.length*70,c1=x+32,cm=x+476,c2=x+516;wc_panel(ctx,x,y,w,h,{kind:"card",seed:33});
  wc_T(ctx,"already here",c1,y+52,{w:700,size:28,col:WC_MUTED});wc_T(ctx,"applying",c2,y+52,{w:700,size:28,col:WC_MUTED});
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.4);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x+24,y+72);ctx.lineTo(x+w-24,y+72);ctx.stroke();ctx.restore();
  M7_CMP.forEach(([a,b,m],i)=>{const yy=y+124+i*70,p=clamp((t-o.rows[i])/0.5,0,1);wc_T(ctx,a,c1,yy,{w:500,size:28,f:"mono",col:WC_DARK});
    if(p>0)withA(ctx,clamp(p*2,0,1),()=>wc_T(ctx,b,c2,yy,{w:500,size:28,f:"mono",col:WC_DARK}));const mp=clamp((t-o.rows[i]-0.35)/0.4,0,1);
    if(mp>0){if(m>0)wc_tick(ctx,cm,yy-10,32,WC_ROLEINK.alumna,mp,4.5);else wc_cross(ctx,cm,yy-8,28,WC_NO,mp);}});}

/* ---------- 11. the person, published ---------- */
// the person as a data product: who it is, and what it promises, each line lit as it's said
const M7_PROD=[["owner","Mei's office"],["contract","enforced"],["version","1"],["access","public"]];
function m7_product(ctx,t,x,y,o){const w=640,h=600;wc_panel(ctx,x,y,w,h,{kind:"card",seed:51});wc_T(ctx,"the person",x+36,y+62,{w:800,size:38,col:WC_DARK});
  withA(ctx,fin(t,o.badge,0.4),()=>wc_badge(ctx,x+w-36-Math.round(tw(ctx,"data product",28,700)+28),y+50,"data product"));
  wc_white(ctx,"linh",x+150,y+540,0.62,m7_bands([1,1,1,1,1]),{a:1});
  M7_PROD.forEach(([k,v],i)=>{const yy=y+150+i*96,lit=o.lit[i]||0,col=i?WC_SIDE.tech:WC_SIDE.biz;wc_panel(ctx,x+300,yy-44,300,72,{kind:"tag",seed:i+60});
    if(lit>0.01)withA(ctx,lit,()=>wc_panel(ctx,x+300,yy-44,300,72,{kind:"chip",role:col,seed:i+60}));
    wc_T(ctx,k,x+324,yy-10,{w:600,size:28,col:lit>0.5?WC_DARK:WC_MUTED});wc_T(ctx,v,x+324,yy+22,{w:800,size:28,col:WC_DARK});});}
// the model's settings in dbt, one line lit at a time
const M7_YAML=["group: person","access: public","contract: {enforced: true}","latest_version: 1"];
function m7_yaml(ctx,t,x,y,o){const w=980,h=330;wc_panel(ctx,x,y,w,h,{kind:"card",seed:52});const lw=logo(ctx,"dbt",x+32,y+26,52);
  wc_T(ctx,"dbt",x+40+Math.max(lw,50),y+64,{w:800,size:32,col:WC_DARK});wc_T(ctx,"builds and tests it",x+w-36,y+64,{w:600,size:28,align:"right",col:WC_MUTED,a:fin(t,o.tests,0.5)});
  M7_YAML.forEach((s,i)=>{const yy=y+140+i*48,lit=o.lit[i]||0;if(lit>0.01)withA(ctx,lit,()=>wc_panel(ctx,x+24,yy-34,Math.round(tw(ctx,s,28,500,"mono")+40),46,{kind:"chip",role:WC_SIDE.tech,seed:i+70}));
    wc_T(ctx,s,x+44,yy,{w:500,size:28,f:"mono",col:WC_DARK});});}
// Databricks: Unity Catalog's grant, who may read the person
function m7_grant(ctx,t,x,y,o){const w=980,h=150;wc_panel(ctx,x,y,w,h,{kind:"card",seed:53});const lw=logo(ctx,"databricks",x+32,y+24,50);
  wc_T(ctx,"Unity Catalog",x+44+Math.max(lw,46),y+60,{w:800,size:32,col:WC_DARK});wc_T(ctx,"governs who may read it",x+w-36,y+60,{w:600,size:28,align:"right",col:WC_MUTED});
  withA(ctx,fin(t,o.read,0.5),()=>wc_T(ctx,"may read: student system, HR",x+44,y+116,{w:500,size:28,f:"mono",col:WC_DARK}));}
