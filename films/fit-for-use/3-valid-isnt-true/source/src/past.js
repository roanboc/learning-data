/* ===== Valid isn't true: Japan, 1800 to 1821 =====
   The opening's places and things, painted in the module's look: matte, softly lit, daylight from the right, no outlines. Edo at dawn;
   a map of the time; Ezo's shore by day and by night; the map of all Japan. The people of 1800 are seen from behind or far off, dressed
   for their time (short travel jackets, leggings, straw hats), with no face and no likeness. Nothing is borrowed from Japanese art:
   the houses, the ship, the quadrant and the compass are drawn plainly, and the map is a plain outline in the module's ink.
   Colours keep the module's meanings: brass is the reference (the stars, a star's height, the line of latitude, where a cape really
   lay); steel blue a measure taken (the walked line); each stretch's tick is green (its own check passes). Nothing else means anything.
   The map of Japan is Natural Earth's 1:50m land (public domain), from the world-atlas package, projected for this frame (longitudes
   128 to 145.9, latitudes 30 to 45.9, x scaled by cos 38°, 47.8 px to a degree of latitude) and simplified to within 1 px; NOTICE.md
   credits it. Every top-level name here starts with vt_ or VT_. */

/* ---------------------------------------------------------------- the land of Japan, projected for the frame */
const VT_LAND=[[1498,326,1500,327,1507,325,1505,340,1506,357,1507,363,1514,369,1520,378,1527,402,1526,419,1524,435,1515,441,1510,451,1507,468,1494,471,1488,480,1487,490,1491,513,1490,530,1488,535,1482,543,1480,548,1476,559,1474,572,1475,580,1485,596,1476,599,1469,607,1468,618,1465,622,1454,629,1449,630,1442,625,1444,610,1438,602,1430,607,1418,607,1405,618,1396,625,1383,632,1383,642,1371,640,1362,650,1349,647,1342,652,1336,665,1324,660,1314,663,1308,670,1299,682,1305,672,1302,668,1290,671,1279,679,1271,665,1265,651,1258,653,1256,656,1238,651,1229,652,1225,662,1219,666,1217,673,1203,668,1196,666,1190,673,1176,676,1167,688,1153,697,1141,703,1133,700,1125,696,1123,690,1113,689,1109,682,1112,673,1120,673,1129,671,1129,669,1149,660,1158,660,1168,653,1179,653,1191,642,1204,635,1220,634,1232,629,1250,626,1265,615,1278,613,1287,616,1294,608,1295,597,1305,590,1312,583,1321,582,1326,573,1337,572,1338,577,1350,571,1363,565,1369,555,1371,546,1379,543,1386,532,1388,525,1386,518,1388,513,1399,508,1408,501,1416,484,1422,479,1424,465,1428,457,1430,443,1434,437,1439,432,1450,427,1456,417,1455,411,1456,402,1462,392,1461,371,1472,366,1474,358,1474,343,1478,330,1475,322,1489,324],[1532,197,1540,213,1563,227,1575,237,1590,242,1599,247,1612,245,1618,238,1626,233,1635,232,1640,227,1650,228,1662,225,1672,224,1672,228,1663,231,1661,236,1666,240,1653,239,1649,245,1626,254,1617,260,1609,269,1603,282,1600,280,1594,275,1583,273,1567,268,1556,262,1541,256,1525,257,1509,265,1504,273,1495,274,1491,277,1483,283,1475,292,1466,289,1458,293,1461,301,1457,302,1449,298,1446,291,1447,284,1458,279,1461,274,1466,262,1478,260,1474,254,1471,245,1480,236,1478,231,1475,227,1477,216,1476,203,1478,195,1474,182,1476,178,1488,167,1488,160,1486,152,1488,140,1485,129,1494,135,1507,152,1524,174],[1100,680,1110,690,1123,691,1124,696,1126,699,1136,701,1141,704,1141,712,1134,721,1136,731,1142,742,1143,751,1141,763,1144,770,1138,775,1132,786,1131,797,1123,797,1117,797,1120,786,1114,785,1110,790,1113,800,1107,797,1105,786,1097,780,1093,775,1095,766,1086,758,1078,756,1076,746,1081,744,1084,742,1094,744,1103,743,1094,728,1088,728,1076,719,1070,718,1069,710,1066,705,1069,696,1077,696,1079,699,1089,697,1088,689],[1219,663,1226,671,1228,676,1237,678,1239,682,1235,687,1229,686,1220,693,1220,702,1224,712,1220,717,1210,716,1204,728,1203,738,1199,738,1193,727,1189,723,1183,730,1184,733,1173,730,1163,733,1160,727,1166,713,1169,699,1161,697,1167,687,1176,681,1187,674,1193,676,1204,670,1214,666],[1388,477,1398,473,1393,481,1389,486,1394,486,1393,495,1385,493,1387,489],[1076,748,1081,756,1076,764,1074,762,1074,751],[1262,653,1258,663,1251,669,1255,660],[1022,637,1028,640,1025,644,1018,636],[1100,848,1101,853,1095,854,1090,849,1096,848],[1051,646,1056,658,1052,664,1051,659,1048,653],[1116,831,1114,852,1108,844,1110,835],[1031,739,1034,745,1031,746,1025,738]];
// a longitude and latitude, in the frame
const vt_ll=(lon,lat)=>[(lon-128)*Math.cos(38*Math.PI/180)*47.8+1000,(45.9-lat)*47.8+110];
// the land's outlines as point lists, and a closed path through one, or through part of one (u0 to u1 along it)
const VT_RINGS=VT_LAND.map(a=>{const p=[];for(let i=0;i<a.length;i+=2)p.push([a[i],a[i+1]]);p.push(p[0]);const L=[0];for(let i=1;i<p.length;i++)L.push(L[i-1]+Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]));return{p,L,tot:L[L.length-1]};});
function vt_ringPath(c,R,u0,u1,m){m=m||[1,0,0];const s=m[0],dx=m[1],dy=m[2],d0=R.tot*clamp(u0,0,1),d1=R.tot*clamp(u1,0,1);let started=false;
  for(let i=1;i<R.p.length;i++){const a=R.L[i-1],b=R.L[i];if(b<d0)continue;if(a>d1)break;const f0=clamp((d0-a)/((b-a)||1),0,1),f1=clamp((d1-a)/((b-a)||1),0,1),P0=R.p[i-1],P1=R.p[i],
    x0=lerp(P0[0],P1[0],f0)*s+dx,y0=lerp(P0[1],P1[1],f0)*s+dy,x1=lerp(P0[0],P1[0],f1)*s+dx,y1=lerp(P0[1],P1[1],f1)*s+dy;if(!started){c.moveTo(x0,y0);started=true;}c.lineTo(x1,y1);}}

/* ---------------------------------------------------------------- small helpers */
// a Catmull-Rom spline through the points, n steps between each (open)
function vt_smooth(pts,n){const out=[],Q=[pts[0]].concat(pts,[pts[pts.length-1]]);
  for(let i=1;i<Q.length-2;i++)for(let k=0;k<n;k++){const u=k/n,u2=u*u,u3=u2*u,f=(a,b,c,d)=>0.5*(2*b+(-a+c)*u+(2*a-5*b+4*c-d)*u2+(-a+3*b-3*c+d)*u3);
    out.push([f(Q[i-1][0],Q[i][0],Q[i+1][0],Q[i+2][0]),f(Q[i-1][1],Q[i][1],Q[i+1][1],Q[i+2][1])]);}out.push(pts[pts.length-1]);return out;}
function vt_line(c,Q){c.moveTo(Q[0][0],Q[0][1]);for(let i=1;i<Q.length;i++)c.lineTo(Q[i][0],Q[i][1]);}
// a ridge or a shore: a smooth edge through the points, filled down to bottom
function vt_ridge(c,pts,bottom,col,a){const S=vt_smooth(pts,12);c.beginPath();c.moveTo(S[0][0],bottom);for(const p of S)c.lineTo(p[0],p[1]);c.lineTo(S[S.length-1][0],bottom);c.closePath();
  c.fillStyle=typeof col==="string"?col:rgba(col,a==null?1:a);c.fill();}
// the place and year, on a small card at the top left, in screen space
function vt_tag(ctx,S,s,a){if(!(a>0.004)||!s)return;ctx.save();setScreen(ctx,S);const f={w:500,size:28,f:"mono"},w=dq_tw(ctx,s,f)+48,x=64,y=52,h=56;ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor="rgba(40,30,20,0.22)";ctx.shadowBlur=18;ctx.shadowOffsetX=-5;ctx.shadowOffsetY=6;rr(ctx,x,y,w,h,10);ctx.fillStyle=rgba(DQ.paper,0.96);ctx.fill();ctx.restore();
  ctx.strokeStyle="rgba(110,90,66,0.3)";ctx.lineWidth=1.2;rr(ctx,x,y,w,h,10);ctx.stroke();dq_T(ctx,s,x+24,y+38,f);ctx.restore();}
// the latest of [[t, words], ...] that has begun: the one before leaves over the first half of d seconds, then it comes in over the
// second (never two words in one place at once); null words hide it
function vt_tags(ctx,S,t,list,a,d){a=a==null?1:a;d=d||0.6;let i=-1;for(let k=0;k<list.length;k++)if(t>=list[k][0])i=k;if(i<0)return;
  const h=d/2,u=(t-list[i][0])/h;if(i>0&&u<1){vt_tag(ctx,S,list[i-1][1],a*(1-ag_sine(u)));return;}vt_tag(ctx,S,list[i][1],a*ag_sine(i>0?u-1:(t-list[0][0])/0.6));}
// light from the right over a whole place, the left a little darker, and the bottom
function vt_light(c,k){k=k==null?1:k;let g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(30,24,18,"+0.16*k+")");g.addColorStop(0.55,"rgba(30,24,18,0)");g.addColorStop(1,"rgba(255,244,224,"+0.08*k+")");
  c.fillStyle=g;c.fillRect(0,0,W,H);g=c.createLinearGradient(0,880,0,H);g.addColorStop(0,"rgba(30,24,18,0)");g.addColorStop(1,"rgba(30,24,18,"+0.2*k+")");c.fillStyle=g;c.fillRect(0,880,W,H-880);}
// a soft round crown of leaves (an irregular blob, lit from the right)
function vt_crown(c,x,y,rx,ry,seed,col){const R=ag_rnd(seed);for(let i=0;i<9;i++){const a=R()*TAU,r=R()*0.6;c.fillStyle=rgba(mix(col,[0,0,0],0.25),1);
    c.beginPath();c.ellipse(x+Math.cos(a)*rx*r,y+Math.sin(a)*ry*r,rx*(0.45+R()*0.3),ry*(0.45+R()*0.3),0,0,TAU);c.fill();}
  for(let i=0;i<7;i++){const a=R()*TAU,r=R()*0.5;c.fillStyle=rgba(mix(col,[255,246,226],0.12+0.12*R()),0.9);c.beginPath();c.ellipse(x+rx*0.2+Math.cos(a)*rx*r,y-ry*0.15+Math.sin(a)*ry*r,rx*(0.3+R()*0.2),ry*(0.28+R()*0.2),0,0,TAU);c.fill();}}

/* ---------------------------------------------------------------- Edo, 1800, at dawn: low wooden houses on the near bank, the road
   in front of them, the river behind, and the far bank in the haze; the sun coming up on the right */
const VT_EDO={road:[786,876],river:[566,712]};
function vt_house(c,x,base,w,h,seed){const R=ag_rnd(seed),wall=[98,76,58],roofH=h*0.42,wallH=h-roofH;
  // the walls: dark timber boards, lit a little on the right; a doorway and a slatted window
  let g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,rgba(mix(wall,[0,0,0],0.18),1));g.addColorStop(1,rgba(mix(wall,[255,236,210],0.12),1));c.fillStyle=g;c.fillRect(x,base-wallH,w,wallH);
  c.fillStyle="rgba(40,28,20,0.22)";for(let bx=x+12;bx<x+w-6;bx+=18+R()*6)c.fillRect(bx,base-wallH+4,2,wallH-6);
  c.fillStyle="rgba(30,22,16,0.85)";const dw=w*0.18,dx=x+w*(0.22+R()*0.4);c.fillRect(dx,base-wallH*0.82,dw,wallH*0.82);
  c.fillStyle="rgba(232,214,184,0.55)";const wx=x+w*0.08,ww=w*0.16;c.fillRect(wx,base-wallH*0.7,ww,wallH*0.32);c.fillStyle="rgba(60,44,32,0.7)";for(let k=1;k<5;k++)c.fillRect(wx+ww*k/5-1,base-wallH*0.7,2,wallH*0.32);
  // the roof: a plain pitched roof seen from the front, its eaves overhanging, dark shingles, the ridge catching the dawn
  const ov=w*0.07;c.fillStyle="rgb(74,68,66)";c.beginPath();c.moveTo(x-ov,base-wallH+6);c.lineTo(x+w+ov,base-wallH+6);c.lineTo(x+w*0.86,base-h);c.lineTo(x+w*0.14,base-h);c.closePath();c.fill();
  c.save();c.beginPath();c.moveTo(x-ov,base-wallH+6);c.lineTo(x+w+ov,base-wallH+6);c.lineTo(x+w*0.86,base-h);c.lineTo(x+w*0.14,base-h);c.closePath();c.clip();
  c.fillStyle="rgba(30,26,26,0.35)";for(let ry=base-h+10;ry<base-wallH;ry+=12)c.fillRect(x-ov,ry,w+2*ov,2);c.restore();
  c.fillStyle="rgba(255,226,186,0.35)";c.fillRect(x+w*0.14,base-h,w*0.72,3);
  c.fillStyle="rgba(20,14,10,0.35)";c.fillRect(x-ov,base-wallH+6,w+2*ov,5);
  g=c.createLinearGradient(0,base-6,0,base+16);g.addColorStop(0,"rgba(40,30,20,0.4)");g.addColorStop(1,"rgba(40,30,20,0)");c.fillStyle=g;c.fillRect(x-ov,base-2,w+2*ov,18);}
AG_PLACES.vt_edo=c=>{const E=VT_EDO;
  let g=c.createLinearGradient(0,0,0,E.river[0]);g.addColorStop(0,"rgb(124,138,162)");g.addColorStop(0.5,"rgb(188,186,194)");g.addColorStop(0.86,"rgb(234,212,184)");g.addColorStop(1,"rgb(244,222,190)");
  c.fillStyle=g;c.fillRect(0,0,W,E.river[0]+2);dq_pool(c,1720,E.river[0]-10,760,[255,224,176],0.32,0.42);
  // two thin bands of cloud lit from below
  c.fillStyle="rgba(255,232,206,0.22)";c.beginPath();c.ellipse(1260,300,520,16,-0.02,0,TAU);c.fill();c.beginPath();c.ellipse(1500,372,380,10,0.01,0,TAU);c.fill();
  // the far bank: hills in the haze, then a lower, nearer line of trees
  vt_ridge(c,[[0,486],[240,456],[470,476],[700,440],[930,470],[1160,452],[1400,480],[1640,462],[1920,486]],E.river[0]+2,[168,170,178]);
  vt_ridge(c,[[0,530],[180,518],[400,534],[640,512],[880,530],[1120,516],[1360,532],[1600,520],[1920,534]],E.river[0]+2,[146,146,152]);
  c.fillStyle="rgb(132,128,128)";for(let x=-20;x<W;x+=70){const R=ag_rnd(x+9);c.beginPath();c.ellipse(x+R()*30,E.river[0]-6,34+R()*20,12+R()*8,0,Math.PI,0);c.fill();}
  // the river: the sky in it, still, darker towards us; the dawn's light lying on it in long streaks
  g=c.createLinearGradient(0,E.river[0],0,E.river[1]);g.addColorStop(0,"rgb(214,204,192)");g.addColorStop(1,"rgb(146,152,158)");c.fillStyle=g;c.fillRect(0,E.river[0],W,E.river[1]-E.river[0]+2);
  const R=ag_rnd(1800);for(let i=0;i<60;i++){const y=lerp(E.river[0]+4,E.river[1]-8,Math.pow(R(),1.4)),x=lerp(700,1900,R()),w=40+R()*220;c.fillStyle="rgba(255,236,206,"+(0.08+0.18*R())*(1-(y-E.river[0])/180)+")";c.fillRect(x-w/2,y,w,1.6+R()*1.6);}
  c.fillStyle="rgba(70,64,60,0.18)";for(let i=0;i<30;i++){const y=lerp(E.river[0]+20,E.river[1]-4,R()),x=R()*W,w=60+R()*200;c.fillRect(x,y,w,1.4);}
  // the near bank: a grassy edge along the water, the road of packed earth, the verge in front
  vt_ridge(c,[[0,712],[300,706],[640,716],[980,704],[1320,714],[1660,706],[1920,712]],H,[118,112,92]);
  g=c.createLinearGradient(0,E.road[0]-40,0,H);g.addColorStop(0,"rgb(150,136,112)");g.addColorStop(0.3,"rgb(186,168,136)");g.addColorStop(0.7,"rgb(170,150,118)");g.addColorStop(1,"rgb(112,98,78)");c.fillStyle=g;
  c.beginPath();c.moveTo(0,E.road[0]-30);c.bezierCurveTo(600,E.road[0]-50,1200,E.road[0]-20,W,E.road[0]-36);c.lineTo(W,H);c.lineTo(0,H);c.closePath();c.fill();
  c.fillStyle="rgba(90,74,56,0.25)";for(let i=0;i<70;i++){const x=R()*W,y=lerp(E.road[0]-10,E.road[1]+60,R());c.fillRect(x,y,8+R()*40,1.6);}
  vt_ridge(c,[[0,E.road[1]+70],[400,E.road[1]+58],[900,E.road[1]+76],[1400,E.road[1]+60],[1920,E.road[1]+72]],H,[104,96,74]);
  // the houses, on the left behind the road, and a tree among them
  vt_crown(c,330,600,120,90,7,[92,104,82]);vt_crown(c,980,650,90,70,11,[96,106,84]);
  vt_house(c,-40,E.road[0]-34,330,210,3);vt_house(c,320,E.road[0]-40,300,190,5);vt_house(c,660,E.road[0]-36,250,170,8);
  vt_light(c,0.8);};

/* ---------------------------------------------------------------- the map of the time: a coast drawn largely from estimates, in
   faded ink on old paper. VT_OLD.cape is the cape as drawn; VT_OLD.real, where it really lay */
const VT_OLD={coast:[[300,-20],[340,140],[420,260],[470,380],[560,470],[760,520],[1000,500],[1150,540],[1180,600],[1060,640],[900,690],[820,780],[760,900],[700,1100]],
  cape:[1180,600],real:[1420,470]};
function vt_paper(c,o){o=o||{};const base=o.base||[232,218,188],nz=dq_noise(o.seed||61);
  dq_field(c,0,0,W,H,3,(px,py,out)=>{const m=nz(px/500,py/500,3),f=nz(px/60,py/60,2),st=nz(px/220+40,py/220,3),edge=Math.min(px,W-px,py,H-py),e=1-sstep(0,160,edge),
      k=0.94+0.07*m+0.03*(f-0.5)-0.1*Math.max(0,st-0.62)*(o.stains==null?1:o.stains)-0.12*e;out[0]=Math.min(255,base[0]*k+4);out[1]=base[1]*k;out[2]=base[2]*k-4*e;});}
AG_PLACES.vt_oldmap=c=>{vt_paper(c,{base:[230,214,182],seed:63});const ink=[110,86,62],S_=vt_smooth(VT_OLD.coast,10);
  // the sea's side shaded with fine lines along the coast, as maps of the time did, then the coast itself
  c.save();c.beginPath();vt_line(c,S_);c.lineTo(W+40,1100);c.lineTo(W+40,-20);c.closePath();c.clip();for(let k=1;k<6;k++){c.strokeStyle=rgba(ink,0.16-0.022*k);c.lineWidth=1.6;c.beginPath();vt_line(c,S_.map(p=>[p[0]+k*14,p[1]-k*4]));c.stroke();}c.restore();
  c.strokeStyle=rgba(ink,0.78);c.lineWidth=3.4;c.lineJoin="round";c.lineCap="round";c.beginPath();vt_line(c,S_);c.stroke();
  // hills inland, a few soft strokes each
  const R=ag_rnd(64);for(let i=0;i<14;i++){const x=80+R()*560,y=200+R()*700;if(x>S_.find(p=>p[1]>=y)[0]-80)continue;c.strokeStyle=rgba(ink,0.4);c.lineWidth=2.2;c.beginPath();c.moveTo(x-26,y+10);c.quadraticCurveTo(x,y-22,x+26,y+10);c.stroke();}
  vt_light(c,0.5);};
// what the old map shows live: the cape picked out (u), where it really lay (v), and how far apart (w)
function vt_oldLife(ctx,u,v,w){const [cx,cy]=VT_OLD.cape,[rx,ry]=VT_OLD.real;
  if(u>0.004){ctx.save();ctx.globalAlpha*=u;ctx.strokeStyle=rgba([110,86,62],0.9);ctx.lineWidth=3;ctx.setLineDash([10,8]);ctx.beginPath();ctx.arc(cx,cy,46,0,TAU);ctx.stroke();ctx.setLineDash([]);ctx.restore();
    dq_T(ctx,"a cape, as drawn",cx-60,cy+92,{w:700,size:30,align:"center",col:[96,74,52],a:u});}
  if(w>0.004){const e=ag_sine(w),mx=lerp(cx,rx,e),my=lerp(cy,ry,e);ctx.save();ctx.strokeStyle=rgba(DQ_TONE.brass.word,0.9);ctx.lineWidth=3;ctx.setLineDash([12,10]);ctx.beginPath();ctx.moveTo(cx+30,cy-18);ctx.lineTo(lerp(cx+30,rx-34,e),lerp(cy-18,ry+20,e));ctx.stroke();ctx.setLineDash([]);ctx.restore();
    dq_tag(ctx,(cx+rx)/2+30,(cy+ry)/2+64,"brass",{text:"miles",icon:false,size:30,a:sstep(0.6,1,w),angle:0.02});}
  if(v>0.004){const k=ag_spr(v,0,0.6);ctx.save();ctx.globalAlpha*=clamp(v*2,0,1);ctx.translate(rx,ry);ctx.scale(lerp(0.5,1,clamp(k,0,1.1)),lerp(0.5,1,clamp(k,0,1.1)));
    ctx.strokeStyle=rgba(DQ.brass,1);ctx.lineWidth=7;ctx.beginPath();ctx.arc(0,0,40,0,TAU);ctx.stroke();ctx.fillStyle=rgba(DQ.brass,1);ctx.beginPath();ctx.arc(0,0,9,0,TAU);ctx.fill();ctx.restore();
    dq_tag(ctx,rx+70,ry-70,"brass",{text:"where it really lay",icon:false,size:30,a:clamp(v*1.5-0.3,0,1),angle:-0.02});}}

/* ---------------------------------------------------------------- Ezo's shore, 1800: a grey northern sea, a dark headland on the
   left, the beach in front; by day under a pale sky, and by night under a deep one (one room: the camera glides on between them) */
const VT_SH={hz:430,beach:650};
function vt_paintShore(c,night){const S_=VT_SH,n=night?1:0;
  let g=c.createLinearGradient(0,0,0,S_.hz);if(n){g.addColorStop(0,"rgb(14,17,30)");g.addColorStop(0.7,"rgb(30,36,56)");g.addColorStop(1,"rgb(52,58,78)");}
  else{g.addColorStop(0,"rgb(170,180,188)");g.addColorStop(0.75,"rgb(206,208,204)");g.addColorStop(1,"rgb(222,220,212)");}c.fillStyle=g;c.fillRect(0,0,W,S_.hz+2);
  if(!n){dq_pool(c,1600,200,800,[255,248,232],0.18,0.6);c.fillStyle="rgba(150,158,166,0.3)";c.beginPath();c.ellipse(700,180,600,40,0.02,0,TAU);c.fill();c.beginPath();c.ellipse(1300,250,500,26,-0.02,0,TAU);c.fill();}
  // the sea: grey and green, darker towards us, long low swells catching the light
  g=c.createLinearGradient(0,S_.hz,0,S_.beach);if(n){g.addColorStop(0,"rgb(40,46,62)");g.addColorStop(1,"rgb(20,24,34)");}else{g.addColorStop(0,"rgb(150,160,160)");g.addColorStop(1,"rgb(104,118,118)");}
  c.fillStyle=g;c.fillRect(0,S_.hz,W,S_.beach-S_.hz+2);const R=ag_rnd(1801);
  for(let i=0;i<90;i++){const y=lerp(S_.hz+6,S_.beach-10,Math.pow(R(),1.3)),x=R()*W,w=(60+R()*240)*(0.5+(y-S_.hz)/400);c.fillStyle=n?"rgba(150,160,190,"+(0.04+0.06*R())+")":"rgba(236,240,236,"+(0.1+0.16*R())+")";c.fillRect(x-w/2,y,w,1.4+R()*1.6);}
  // the headland on the left, rocky and dark, falling into the sea
  const hd=[[-40,330],[90,318],[220,350],[330,392],[430,424],[540,446],[660,462],[720,470]];vt_ridge(c,hd,S_.hz+48,n?[22,24,30]:[92,98,96]);
  vt_ridge(c,[[-40,392],[120,384],[260,410],[380,436],[480,456],[560,470]],S_.hz+52,n?[16,18,24]:[74,80,80]);
  c.fillStyle=n?"rgba(150,160,190,0.12)":"rgba(236,240,236,0.5)";c.beginPath();c.ellipse(380,S_.hz+50,360,5,0.0,0,TAU);c.fill();
  // the surf along the beach, and the wet sand
  vt_ridge(c,[[0,S_.beach-6],[400,S_.beach-14],[900,S_.beach-2],[1400,S_.beach-12],[1920,S_.beach-4]],H,n?[40,40,44]:[150,146,134]);
  c.strokeStyle=n?"rgba(170,176,200,0.18)":"rgba(240,242,238,0.75)";c.lineWidth=3;c.beginPath();vt_line(c,vt_smooth([[0,S_.beach-8],[400,S_.beach-16],[900,S_.beach-4],[1400,S_.beach-14],[1920,S_.beach-6]],12));c.stroke();
  c.strokeStyle=n?"rgba(170,176,200,0.1)":"rgba(240,242,238,0.4)";c.lineWidth=2;c.beginPath();vt_line(c,vt_smooth([[0,S_.beach-30],[500,S_.beach-36],[1000,S_.beach-24],[1500,S_.beach-34],[1920,S_.beach-26]],12));c.stroke();
  g=c.createLinearGradient(0,S_.beach,0,H);if(n){g.addColorStop(0,"rgb(50,50,54)");g.addColorStop(1,"rgb(28,28,30)");}else{g.addColorStop(0,"rgb(176,168,148)");g.addColorStop(0.4,"rgb(196,186,162)");g.addColorStop(1,"rgb(160,150,128)");}
  c.fillStyle=g;c.beginPath();c.moveTo(0,S_.beach+10);c.bezierCurveTo(500,S_.beach-6,1100,S_.beach+18,W,S_.beach+2);c.lineTo(W,H);c.lineTo(0,H);c.closePath();c.fill();
  for(let i=0;i<120;i++){const x=R()*W,y=lerp(S_.beach+20,H,R());c.fillStyle=n?"rgba(0,0,0,0.12)":"rgba(110,100,82,0.16)";c.fillRect(x,y,6+R()*30,1.4);}
  // rocks on the beach, bottom left, lit from the right
  for(const [x,y,rx,ry] of [[90,1000,170,90],[260,1040,120,70],[1840,1010,150,80]]){c.fillStyle=n?"rgb(26,26,28)":"rgb(96,90,84)";c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.fill();
    const gg=c.createRadialGradient(x+rx*0.35,y-ry*0.4,0,x+rx*0.35,y-ry*0.4,rx);gg.addColorStop(0,n?"rgba(120,130,160,0.18)":"rgba(236,228,212,0.4)");gg.addColorStop(1,"rgba(0,0,0,0)");c.fillStyle=gg;c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.fill();}
  vt_light(c,n?0.6:0.8);}
AG_PLACES.vt_shore=c=>vt_paintShore(c,false);
AG_PLACES.vt_shoreNight=c=>vt_paintShore(c,true);
AG_ROOMS.vt_shoreNight="vt_shore";

/* ---------------------------------------------------------------- the page the map of all Japan is drawn on: plain cream paper */
AG_PLACES.vt_page=c=>{vt_paper(c,{base:[240,232,212],seed:67,stains:0.4});vt_light(c,0.4);};

/* ---------------------------------------------------------------- people of 1800, far off, seen from behind or from the side
   vt_figure(ctx, x, y, h, o): a person standing or walking, their feet at (x, y), h px tall (straw hat included), no face shown.
   o: walk (the stride's phase, in turns; none: standing), dir (1: facing or walking right, -1 left), jacket and legs (colours), load
   ("rope", a coil over the shoulder; "chest", a wooden box carried on the back; "pole", a long pole held upright; "box", the compass box
   held before them), lean (radians, forward), a. Arms hang or hold the load; nobody gestures. */
const VT_CLOTH={leader:[84,64,50],a:[70,76,88],b:[98,80,62],c:[60,56,52],legs:[52,50,50],straw:[204,188,150],hair:[34,28,26],skin:[178,134,104]};
function vt_figure(ctx,x,y,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const s=h/200,dir=o.dir||1,ph=o.walk==null?null:o.walk*TAU,J=o.jacket||VT_CLOTH.a,L=o.legs||VT_CLOTH.legs;
  ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s*dir,s);
  // a soft shadow on the ground, falling a little left (the light is on the right)
  ag_floorShadow(ctx,-10*dir,0,44,7,0.3);
  const bob=ph==null?0:-Math.abs(Math.sin(ph))*2.2,sw=ph==null?0:Math.sin(ph)*0.36;ctx.translate(0,bob);
  // legs in close trousers, a pale wrap round each shin, each tapering to the ankle, a straw sandal under it
  const leg=(hx,ang,sh)=>{ctx.save();ctx.translate(hx,-86);ctx.rotate(ang);const c0=sh?mix(L,[0,0,0],0.25):L;ctx.fillStyle=rgba(c0,1);
    ctx.beginPath();ctx.moveTo(-12,0);ctx.bezierCurveTo(-13,26,-9,58,-7,82);ctx.lineTo(7,82);ctx.bezierCurveTo(9,58,13,26,12,0);ctx.closePath();ctx.fill();
    ctx.fillStyle=rgba(sh?[150,140,124]:[184,174,156],1);ctx.beginPath();ctx.moveTo(-9.5,46);ctx.lineTo(9.5,46);ctx.lineTo(7.6,80);ctx.lineTo(-7.6,80);ctx.closePath();ctx.fill();
    ctx.fillStyle="rgba(60,50,40,0.25)";for(let k=0;k<3;k++)ctx.fillRect(-9,52+k*9,18,1.6);
    ctx.fillStyle=rgba([128,108,78],1);ctx.beginPath();ctx.ellipse(4,85,11,3.4,0,0,TAU);ctx.fill();ctx.restore();};
  leg(-6,-sw,true);leg(7,sw,false);
  // the body leans from the hips; the jacket, short, to the upper thigh, its sleeves to the wrists, lit on the right
  ctx.save();ctx.translate(0,-86);ctx.rotate(o.lean||0);ctx.translate(0,86);
  const jk=c=>{c.moveTo(-23,-160);c.bezierCurveTo(-31,-148,-31,-110,-27,-74);c.lineTo(27,-74);c.bezierCurveTo(31,-110,31,-148,23,-160);c.bezierCurveTo(10,-167,-10,-167,-23,-160);c.closePath();};
  ctx.beginPath();jk(ctx);let g=ctx.createLinearGradient(-30,0,30,0);g.addColorStop(0,rgba(mix(J,[0,0,0],0.3),1));g.addColorStop(0.6,rgba(J,1));g.addColorStop(1,rgba(mix(J,[255,240,220],0.16),1));ctx.fillStyle=g;ctx.fill();
  ctx.fillStyle="rgba(20,14,10,0.28)";ctx.fillRect(-27,-102,54,6);ctx.fillStyle="rgba(20,14,10,0.12)";ctx.fillRect(-1,-158,2,84);
  // the arms, hanging close (or holding what they carry)
  const arm=(sx,ang,sh)=>{ctx.save();ctx.translate(sx,-154);ctx.rotate(ang);ctx.fillStyle=rgba(sh?mix(J,[0,0,0],0.32):mix(J,[0,0,0],0.08),1);ctx.beginPath();ctx.moveTo(-7,0);ctx.bezierCurveTo(-9,22,-8,44,-6,58);ctx.lineTo(6,58);ctx.bezierCurveTo(8,44,9,22,7,0);ctx.closePath();ctx.fill();
    ctx.fillStyle=rgba(VT_CLOTH.skin,1);ctx.beginPath();ctx.ellipse(0,61,4.8,5.6,0,0,TAU);ctx.fill();ctx.restore();};
  const ld=o.load;
  if(ld==="box"){arm(-19,0.55,true);arm(19,-0.55,false);}else if(ld==="rope2"){arm(-21,0.05,true);arm(21,-0.42,false);}
  else{arm(-22,ph==null?0.05:-sw*0.3+0.05,true);arm(22,ph==null?-0.05:sw*0.3-0.05,false);}
  // what they carry: a coil of rope over the shoulder, or a wooden box on the back
  if(ld==="rope"){ctx.lineCap="round";ctx.strokeStyle=rgba([118,98,68],1);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-15,-170);ctx.quadraticCurveTo(4,-150,16,-128);ctx.stroke();
    for(let k=0;k<4;k++){ctx.strokeStyle=rgba(k%2?[146,124,88]:[178,156,116],1);ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(19+k*1.4,-104+k*1.4,13-k*0.9,25-k*1.4,0.12,0,TAU);ctx.stroke();}}
  if(ld==="chest"){ctx.fillStyle=rgba([108,80,56],1);rr(ctx,-24,-176,48,66,4);ctx.fill();ctx.fillStyle="rgba(255,236,206,0.18)";ctx.fillRect(10,-174,12,62);ctx.fillStyle="rgba(30,20,12,0.4)";ctx.fillRect(-24,-148,48,3);}
  if(ld==="box"){ctx.fillStyle=rgba([104,80,58],1);rr(ctx,-18,-108,36,22,3);ctx.fill();ctx.fillStyle="rgba(255,236,206,0.25)";ctx.fillRect(-16,-108,32,3);}
  if(ld==="pole"){ctx.fillStyle=rgba([150,130,96],1);ctx.fillRect(28,-270,5,262);ctx.fillStyle="rgba(255,240,214,0.3)";ctx.fillRect(31,-270,2,262);}
  // the neck and the back of the head, dark hair tied back, then the straw hat, wide and shallow, its shadow on the shoulders
  ctx.fillStyle=rgba(mix(VT_CLOTH.skin,[0,0,0],0.2),1);ctx.fillRect(-5,-174,10,14);
  ctx.fillStyle=rgba(VT_CLOTH.hair,1);ctx.beginPath();ctx.ellipse(0,-184,12,14,0,0,TAU);ctx.fill();
  ctx.fillStyle="rgba(30,20,10,0.25)";ctx.beginPath();ctx.ellipse(-2,-164,28,6,0,0,TAU);ctx.fill();
  g=ctx.createLinearGradient(-36,0,36,0);g.addColorStop(0,rgba(mix(VT_CLOTH.straw,[0,0,0],0.28),1));g.addColorStop(0.65,rgba(VT_CLOTH.straw,1));g.addColorStop(1,rgba(mix(VT_CLOTH.straw,[255,250,236],0.25),1));
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-38,-188);ctx.quadraticCurveTo(0,-214,38,-188);ctx.quadraticCurveTo(0,-182,-38,-188);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgba(60,44,24,0.3)";ctx.beginPath();ctx.ellipse(0,-187.5,37,2.6,0,0,TAU);ctx.fill();
  ctx.restore();ctx.restore();}

/* ---------------------------------------------------------------- a ship of the time, far out on the horizon: a hull and three masts
   of square sails, no flag; x, y its waterline's middle, h its height */
function vt_ship(ctx,x,y,h,a){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);const s=h/100;ctx.scale(s,s);
  ctx.fillStyle="rgb(70,72,76)";ctx.beginPath();ctx.moveTo(-60,-8);ctx.lineTo(56,-8);ctx.lineTo(46,2);ctx.lineTo(-52,2);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgb(80,80,84)";for(const [mx,mh] of [[-34,74],[0,92],[30,70]])ctx.fillRect(mx-1.2,-8-mh,2.4,mh);
  ctx.fillStyle="rgba(222,220,210,0.92)";for(const [mx,mh] of [[-34,74],[0,92],[30,70]])for(let k=0;k<3;k++){const sy=-8-mh+6+k*mh*0.3,sw=lerp(14,24,k/2);ctx.beginPath();ctx.moveTo(mx-sw,sy);ctx.lineTo(mx+sw,sy);ctx.lineTo(mx+sw*1.05,sy+mh*0.24);ctx.lineTo(mx-sw*1.05,sy+mh*0.24);ctx.closePath();ctx.fill();}
  ctx.fillStyle="rgba(120,120,124,0.35)";for(const [mx,mh] of [[-34,74],[0,92],[30,70]])ctx.fillRect(mx-24,-8-mh+6,10,mh*0.8);
  ctx.restore();}

/* ---------------------------------------------------------------- the survey on the beach by day: two poles, the rope stretched
   between them by two of the team, and a third sighting along it over a compass box on a short stand. VT_TEAM holds where they stand */
const VT_TEAM={y:830,p0:250,p1:820,box:540};
function vt_pole(ctx,x,y,h,a){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ag_floorShadow(ctx,x-8,y,16,4,0.3);const g=ctx.createLinearGradient(x-4,0,x+4,0);g.addColorStop(0,"rgb(120,104,76)");g.addColorStop(1,"rgb(196,178,140)");
  ctx.fillStyle=g;ctx.fillRect(x-3.5,y-h,7,h);ctx.fillStyle="rgba(60,48,30,0.4)";for(let k=1;k<6;k++)ctx.fillRect(x-3.5,y-h+k*h/6,7,2);ctx.restore();}
// the team: u0 the far pole set (0 to 1), taut the rope pulled straight (0 to 1), sight the compass man bent to his box (0 to 1)
function vt_team(ctx,t,o){o=o||{};const T_=VT_TEAM,a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  const set=clamp(o.set==null?1:o.set,0,1),taut=clamp(o.taut==null?1:o.taut,0,1),hp=T_.y-122;
  vt_pole(ctx,T_.p0,T_.y,300,1);vt_pole(ctx,T_.p1,lerp(T_.y-40,T_.y,ag_eo(set)),300,set>0?1:0);
  // the rope, from one man's hands to the other's, sagging until it's pulled taut
  const x0=T_.p0+52,x1=T_.p1-52,sag=lerp(46,3,ag_sine(taut));ctx.strokeStyle="rgb(176,152,112)";ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x0,hp);ctx.quadraticCurveTo((x0+x1)/2,hp+sag*2,x1,hp);ctx.stroke();
  vt_figure(ctx,T_.p0+26,T_.y,230,{dir:1,jacket:VT_CLOTH.b,load:"rope2",lean:0.03});
  vt_figure(ctx,T_.p1-26,T_.y,226,{dir:-1,jacket:VT_CLOTH.c,load:"rope2",lean:0.06*ag_sine(taut)});
  // the compass box on its short stand, and the man sighting along the rope over it
  const bx=T_.box,by=T_.y-4;ctx.fillStyle="rgb(96,76,56)";ctx.fillRect(bx-3,by-92,6,92);ctx.fillRect(bx-26,by-4,52,4);ctx.fillStyle="rgb(110,86,62)";rr(ctx,bx-22,by-108,44,18,3);ctx.fill();ctx.fillStyle="rgba(255,236,206,0.3)";ctx.fillRect(bx-20,by-108,40,3);
  vt_figure(ctx,bx+58,T_.y,232,{dir:-1,jacket:VT_CLOTH.leader,lean:0.22*ag_sine(clamp(o.sight==null?1:o.sight,0,1))});
  ctx.restore();}
// the leader and his team setting out from Edo along the road, seen from behind as they walk away to the right: go 0 to 1, how far
function vt_party(ctx,t,go,a){if(a<=0.004)return;const y=VT_EDO.road[0]+58,list=[[0,VT_CLOTH.leader,"none",208],[90,VT_CLOTH.a,"rope",200],[170,VT_CLOTH.b,"chest",204],[250,VT_CLOTH.c,"pole",198],[320,VT_CLOTH.a,"rope",196]];
  const d=go*520;for(const [off,col,ld,h] of list){const walking=go>0&&go<1,x=760-off+d;vt_figure(ctx,x,y+off*0.04,h*0.9,{dir:1,jacket:col,load:ld,walk:walking?(t*0.85+off/170):null,a});}}

/* ---------------------------------------------------------------- the sheet laid over the scene: the coast as the walk measured it
   VT_SHEET is the card; the true shore runs up it (VT_TRUE); the walk's stretches go up it one by one in steel blue, each with its own
   green tick, and drift a little more with each, so the end is miles out; the pale wedge behind them is the error piling up. At night a
   brass line of latitude crosses it where the stars put the walk's end, and the end is pulled to it: the wedge closes north to south,
   and a band of it is left east to west, which the stars can't see */
const VT_SHEET={x:1110,y:100,w:720,h:760};
const VT_TRUE=[[1250,800],[1262,742],[1290,690],[1300,630],[1336,578],[1350,520],[1386,470],[1400,412],[1436,360],[1450,306],[1478,256]];
const VT_WALK=(()=>{const out=[[1250,800]];let ang=0,len=1;for(let i=1;i<VT_TRUE.length;i++){const dx=VT_TRUE[i][0]-VT_TRUE[i-1][0],dy=VT_TRUE[i][1]-VT_TRUE[i-1][1];
  ang+=0.016;len*=1.03;const c=Math.cos(ang),s=Math.sin(ang),p=out[out.length-1];out.push([p[0]+(dx*c-dy*s)*len,p[1]+(dx*s+dy*c)*len]);}return out;})();
// the end the stars give: the walk's end at the latitude of the true end (the stars fix how far north, not how far east)
const VT_FIX=[VT_WALK[VT_WALK.length-1][0],VT_TRUE[VT_TRUE.length-1][1]];
function vt_sheet(ctx,t,o){o=o||{};const a=o.a==null?1:o.a,Sh=VT_SHEET;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  dq_card(ctx,Sh.x,Sh.y,Sh.w,Sh.h,{r:6});
  // the true shore, faint, as we know it now
  ctx.save();ctx.strokeStyle=rgba(DQ.dim,0.9);ctx.lineWidth=2.4;ctx.setLineDash([3,9]);ctx.lineCap="round";ctx.beginPath();vt_line(ctx,vt_smooth(VT_TRUE,8));ctx.stroke();ctx.restore();
  dq_T(ctx,"Ezo's coast, as the walk measured it",Sh.x+28,Sh.y+52,{w:700,size:28,col:DQ.soft});
  const n=VT_WALK.length-1,k=clamp(o.n==null?n:o.n,0,n),pull=ag_sine(clamp(o.pull||0,0,1)),end=VT_WALK[n];
  // the walk's points, the end pulled from where the walk put it to where the stars do, and the stretches between pulled with it
  const P_=VT_WALK.map((p,i)=>{const f=i/n;return[p[0]+(VT_FIX[0]-end[0])*pull*f,p[1]+(VT_FIX[1]-end[1])*pull*f];});
  const kk=Math.floor(k),fr=k-kk,tip=kk<n?[lerp(P_[kk][0],P_[kk+1][0],fr),lerp(P_[kk][1],P_[kk+1][1],fr)]:P_[n];
  // the wedge: from the start, widening along the walk; once corrected, only its east-west band is left, along the latitude line
  const wd=clamp(o.wedge||0,0,1);if(wd>0.004&&k>0.2){const st=P_[0],dx=tip[0]-st[0],dy=tip[1]-st[1],L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L,spread=L*0.2*wd,band=pull;
    ctx.save();ctx.beginPath();ctx.rect(Sh.x+6,Sh.y+72,Sh.w-12,Sh.h-78);ctx.clip();
    if(band<0.999){ctx.fillStyle=rgba(DQ.steel,0.13*(1-band));ctx.beginPath();ctx.moveTo(st[0],st[1]);ctx.lineTo(tip[0]+nx*spread,tip[1]+ny*spread);ctx.lineTo(tip[0]-nx*spread,tip[1]-ny*spread);ctx.closePath();ctx.fill();}
    // once corrected: north to south it closes on the line of latitude, and only a band east to west is left
    if(band>0.004){const hw=spread*1.05,hh=lerp(spread*0.55,15,band);ctx.fillStyle=rgba(DQ.steel,0.17*band*(o.bandK==null?1:o.bandK));rr(ctx,tip[0]-hw,tip[1]-hh,hw*2,hh*2,hh);ctx.fill();}
    ctx.restore();}
  // the brass line of latitude, across the sheet
  const lat=clamp(o.lat||0,0,1);if(lat>0.004){const e=ag_sine(lat),y=VT_FIX[1],x0=Sh.x+24,x1=Sh.x+Sh.w-24;ctx.fillStyle=rgba(DQ.brass,0.95);ctx.fillRect(lerp((x0+x1)/2,x0,e),y-2.5,(x1-x0)*e,5);}
  // the stretches, drawn one by one, each with its tick
  ctx.strokeStyle=rgba(DQ.steel,1);ctx.lineWidth=6;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(P_[0][0],P_[0][1]);for(let i=1;i<=kk;i++)ctx.lineTo(P_[i][0],P_[i][1]);if(kk<n)ctx.lineTo(tip[0],tip[1]);ctx.stroke();
  ctx.fillStyle=rgba(DQ.steel,1);ctx.beginPath();ctx.arc(P_[0][0],P_[0][1],8,0,TAU);ctx.fill();
  for(let i=1;i<=kk;i++){const ta=ag_in(k,i,0.5),m=[(P_[i-1][0]+P_[i][0])/2,(P_[i-1][1]+P_[i][1])/2];if(ta<=0.004)continue;ctx.fillStyle=rgba(DQ.steel,1);ctx.beginPath();ctx.arc(P_[i][0],P_[i][1],5,0,TAU);ctx.fill();
    dq_icon(ctx,"tick",m[0]-30,m[1]+4,26,"pass",{a:ta*(o.ticks==null?1:o.ticks),lw:6});}
  if(kk>=n){ctx.fillStyle=rgba(DQ.steel,1);ctx.beginPath();ctx.arc(P_[n][0],P_[n][1],10,0,TAU);ctx.fill();}
  ctx.restore();}
// where on the sheet the walk's end is, as drawn (pull: how far it has been corrected)
function vt_sheetEnd(pull){const e=VT_WALK[VT_WALK.length-1],p=ag_sine(clamp(pull||0,0,1));return[lerp(e[0],VT_FIX[0],p),lerp(e[1],VT_FIX[1],p)];}

/* ---------------------------------------------------------------- by night: the stars, brass, coming out one by one; one crossing
   the south, its height above the horizon marked with a brass arc; the quadrant on its stand, turned to the south */
const VT_STARS=(()=>{const R=ag_rnd(1816),out=[];for(let i=0;i<46;i++){const x=R()*1060+20,y=40+Math.pow(R(),1.3)*340;out.push([x,y,1.4+R()*2.6,R()]);}return out;})();
// the star that crosses the south: from the left it rises to its highest over the meridian (VT_STAR.x) and goes on to the right
function vt_stars(ctx,t,o){o=o||{};const out=clamp(o.out||0,0,1),a=o.a==null?1:o.a;if(a<=0.004||out<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  for(const [x,y,r,q] of VT_STARS){const sa=sstep(q*0.8,q*0.8+0.2,out);if(sa<=0.004)continue;ctx.fillStyle=rgba(DQ_TONE.brass.dark,0.85*sa);ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();glow(ctx,x,y,r*5,[230,196,118],0.1*sa);}
  ctx.restore();}
const VT_STAR={x:400,y0:206,dx:110};
function vt_starAt(cross){return[VT_STAR.x+lerp(-VT_STAR.dx,VT_STAR.dx,cross),VT_STAR.y0+Math.pow(lerp(-1,1,cross),2)*16];}
function vt_bigStar(ctx,x,y,a,k){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;const r=12*(k||1);glow(ctx,x,y,r*7,[230,196,118],0.32);ctx.fillStyle=rgba(DQ_TONE.brass.dark,1);ctx.beginPath();
  for(let i=0;i<10;i++){const an=-Math.PI/2+i*Math.PI/5,rr_=i%2?r*0.42:r;ctx.lineTo(x+Math.cos(an)*rr_,y+Math.sin(an)*rr_);}ctx.closePath();ctx.fill();ctx.restore();}
// the quadrant: a quarter circle on a stand, facing left (south, over the sea), its sight tube turned up by ang (radians above the
// horizontal); VT_Q.x, VT_Q.y the stand's foot; its pivot is VT_Q.y - 150
const VT_Q={x:860,y:850};
const vt_qPivot=()=>[VT_Q.x,VT_Q.y-150];
function vt_quadrant(ctx,ang,a){if(a<=0.004)return;const Q=VT_Q;ctx.save();ctx.globalAlpha*=a;ag_floorShadow(ctx,Q.x-10,Q.y,64,8,0.35);
  ctx.fillStyle="rgb(70,56,42)";ctx.fillRect(Q.x-4,Q.y-150,8,150);ctx.fillRect(Q.x-46,Q.y-6,92,6);ctx.fillRect(Q.x-42,Q.y-8,6,8);ctx.fillRect(Q.x+36,Q.y-8,6,8);
  const [cx,cy]=vt_qPivot(),R_=124;ctx.strokeStyle="rgb(88,72,54)";ctx.lineWidth=7;ctx.beginPath();ctx.arc(cx,cy,R_,Math.PI,Math.PI*1.5);ctx.stroke();ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx-R_,cy);ctx.moveTo(cx,cy);ctx.lineTo(cx,cy-R_);ctx.stroke();
  ctx.strokeStyle="rgba(214,204,184,0.4)";ctx.lineWidth=2;for(let k=0;k<=9;k++){const an=Math.PI+k*Math.PI/18;ctx.beginPath();ctx.moveTo(cx+Math.cos(an)*(R_-10),cy+Math.sin(an)*(R_-10));ctx.lineTo(cx+Math.cos(an)*R_,cy+Math.sin(an)*R_);ctx.stroke();}
  // the sight tube, along which the star is seen
  ctx.save();ctx.translate(cx,cy);ctx.rotate(Math.PI+ang);ctx.fillStyle="rgb(104,86,64)";rr(ctx,-6,-7,R_+34,14,5);ctx.fill();ctx.fillStyle="rgba(255,236,206,0.24)";ctx.fillRect(-4,4,R_+30,3);ctx.restore();
  ctx.fillStyle="rgb(44,36,28)";ctx.beginPath();ctx.arc(cx,cy,8,0,TAU);ctx.fill();ctx.restore();}
// the angle from the horizontal to the star, in radians, as the quadrant sees the star at cross
function vt_starAng(cross){const [sx,sy]=vt_starAt(cross),[cx,cy]=vt_qPivot();return Math.atan2(cy-sy,cx-sx);}
// the star's height marked in brass: the level line and the sight line from the pivot, and the angle between them (u draws it on)
function vt_height(ctx,ang,u,a){if(a<=0.004||u<=0.004)return;const [cx,cy]=vt_qPivot(),e=ag_sine(u),L=300;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(DQ_TONE.brass.dark,0.95);ctx.lineCap="round";
  ctx.lineWidth=3;ctx.setLineDash([10,9]);ctx.beginPath();ctx.moveTo(cx-140,cy);ctx.lineTo(cx-140-L*e,cy);ctx.stroke();ctx.setLineDash([]);
  ctx.lineWidth=6;ctx.beginPath();ctx.arc(cx,cy,212,Math.PI,Math.PI+ang*e);ctx.stroke();ctx.restore();}

/* ---------------------------------------------------------------- the map of all Japan: the coasts drawn as the survey walked them,
   north to south, 1800 to 1816, each pinned by brass points where the stars were measured; then the finished outline, 1821 */
// each island's order in the walk: [island, start (0 to 1 along the years), end]
const VT_WALKS=[[1,0.0,0.22],[0,0.12,0.62],[3,0.5,0.7],[2,0.6,0.86],[4,0.7,0.76],[5,0.78,0.84],[6,0.66,0.72],[7,0.72,0.78],[8,0.84,0.9],[9,0.8,0.86],[10,0.86,0.92],[11,0.88,0.94]];
function vt_japan(ctx,o){o=o||{};const a=o.a==null?1:o.a,walk=clamp(o.walk==null?1:o.walk,0,1),ink=clamp(o.ink||0,0,1),m=o.m;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ctx.lineJoin="round";ctx.lineCap="round";
  // the finished map: the land a little darker than the page, its outline in ink
  if(ink>0.004){ctx.save();ctx.globalAlpha*=ink;ctx.fillStyle="rgba(196,178,146,0.42)";for(const R of VT_RINGS){ctx.beginPath();vt_ringPath(ctx,R,0,1,m);ctx.closePath();ctx.fill();}
    ctx.strokeStyle=rgba(DQ.ink,0.85);ctx.lineWidth=2.6;for(const R of VT_RINGS){ctx.beginPath();vt_ringPath(ctx,R,0,1,m);ctx.closePath();ctx.stroke();}ctx.restore();}
  // the survey's lines, in steel, along each coast as the years go on, with a brass point every so often
  if(walk>0.004&&(o.lines==null||o.lines>0.004)){ctx.save();ctx.globalAlpha*=o.lines==null?1:o.lines;ctx.strokeStyle=rgba(DQ.steel,1);ctx.lineWidth=4;
    for(const [i,u0,u1] of VT_WALKS){const R=VT_RINGS[i];if(!R)continue;const u=clamp((walk-u0)/(u1-u0),0,1);if(u<=0)continue;ctx.beginPath();vt_ringPath(ctx,R,0,u,m);ctx.stroke();
      if(R.tot>300){const step=R.tot/Math.max(3,Math.round(R.tot/150));for(let d=step/2;d<R.tot*u;d+=step){const f=d/R.tot;let j=1;while(j<R.L.length-1&&R.L[j]<d)j++;const g=clamp((d-R.L[j-1])/((R.L[j]-R.L[j-1])||1),0,1),
        s=m?m[0]:1,px=lerp(R.p[j-1][0],R.p[j][0],g)*s+(m?m[1]:0),py=lerp(R.p[j-1][1],R.p[j][1],g)*s+(m?m[2]:0);ctx.fillStyle=rgba(DQ.brass,1);ctx.beginPath();ctx.arc(px,py,5.5,0,TAU);ctx.fill();}}}
    ctx.restore();}
  ctx.restore();}

// the map of all Japan, small, on a card: Edo marked, Ezo picked out, and the route north between them; x, y its card's top left
function vt_inset(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const sc=0.44,w=600,h=450,m=[sc,x+40-1018*sc,y+96-129*sc];ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,ag_spr(o.k,0,0.6)));dq_card(ctx,x,y,w,h,{});dq_label(ctx,x+28,y+52,"Japan",{});
  ctx.save();ctx.fillStyle="rgba(196,178,146,0.5)";ctx.strokeStyle=rgba(DQ.ink,0.7);ctx.lineWidth=1.8;ctx.lineJoin="round";for(let i=0;i<VT_RINGS.length;i++){const R=VT_RINGS[i];ctx.beginPath();vt_ringPath(ctx,R,0,1,m);ctx.closePath();
    ctx.fillStyle=i===1?rgba(mix([196,178,146],[96,80,60],0.45*(o.ezo||0)),0.5+0.4*(o.ezo||0)):"rgba(196,178,146,0.5)";ctx.fill();ctx.stroke();}ctx.restore();
  const P=(lon,lat)=>{const q=vt_ll(lon,lat);return[q[0]*sc+m[1],q[1]*sc+m[2]];},edo=P(139.77,35.68),hak=P(140.73,41.77),mid=P(141.6,38.6);
  const r=clamp(o.route||0,0,1);if(r>0.004){ctx.save();ctx.strokeStyle=rgba(DQ.ink,0.8);ctx.lineWidth=3;ctx.setLineDash([8,8]);ctx.beginPath();const n=24;for(let k=0;k<=n*r;k++){const u=k/n,q=[(1-u)*(1-u)*edo[0]+2*(1-u)*u*mid[0]+u*u*hak[0],(1-u)*(1-u)*edo[1]+2*(1-u)*u*mid[1]+u*u*hak[1]];k?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);}ctx.stroke();ctx.restore();}
  ctx.fillStyle=rgba(DQ.ink,1);ctx.beginPath();ctx.arc(edo[0],edo[1],7,0,TAU);ctx.fill();dq_T(ctx,"Edo",edo[0]+16,edo[1]+10,{w:700,size:28});
  dq_T(ctx,"Ezo",x+352,y+150,{w:800,size:30,a:clamp(o.ezo||0,0,1)});dq_T(ctx,"today's Hokkaido",x+352,y+190,{w:600,size:28,col:DQ.soft,a:clamp(o.hok==null?(o.ezo||0)*1.4-0.4:o.hok,0,1)});
  ctx.restore();}
// one degree of latitude, north to south: his length (steel, a measure) and today's (brass, the reference), as two bars on a card
function vt_degree(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const w=700,h=330,L=w-280,u1=ag_sine(clamp(o.his||0,0,1)),u2=ag_sine(clamp(o.today||0,0,1));ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,ag_spr(o.k,0,0.6)));dq_card(ctx,x,y,w,h,{});dq_label(ctx,x+28,y+52,"One degree, north to south",{});
  const bar=(yy,len,col,word,u)=>{if(u<=0.004)return;dq_T(ctx,word,x+28,yy+12,{w:700,size:32,col});ctx.fillStyle=rgba(dq_tone(col).col,1);rr(ctx,x+220,yy-12,len*u,26,6);ctx.fill();};
  bar(y+130,L*110.75/110.95,"steel","his",u1);bar(y+200,L,"brass","today's",u2);
  dq_T(ctx,"within a fraction of 1%",x+28,y+h-40,{w:700,size:30,a:clamp(o.frac||0,0,1)});ctx.restore();}
