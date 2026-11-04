/* ===== How it goes wrong: Lisbon, 1755, and the lower town today =====
   The opening's own pictures, drawn once in the module's matte language (soft gradients, matte shapes, the light from the right, the
   same calm palette as the room), all prefixed hw_ / HW_:
     places (painted once): the city from across the river in the morning; the same city in ruins, at dusk under the fires' glow, and
     in the grey morning after; a church's open doors; the engineers' room with the plan on its wall; the plan on its table; the street
     where a house is cut open; three houses in a row; a desk for the sheet of questions and the map; a parish priest's room; the
     lower town's street today, by day and at evening; and an archive today;
     live pieces: the city's tremble and its dust, the river drawn back and the wave, the fires' glow and smoke, the old lanes and the
     new plan drawing itself in blue, the cutaway house and its timber cage (it sways once and settles), the flame stopped at the
     wall, the sheet of questions writing itself, the map of Portugal with its parishes and the letters, three parishes' answers, and
     the people of 1755 (a woman in a dark mantle, a man in a long coat, a child, three engineers in long military coats, a parish
     priest in a black cassock) and of today.
   No tiles, flags, royal arms or symbols of Portugal: the corner names the place and the year. The fire's red-orange is the fire's
   own, the only red in the film; the wave is grey-green, not the series' blue. No one is shown hurt. */

const HWC={sky0:[176,194,210],sky1:[240,231,214],sun:[255,244,222],haze:[208,210,208],far:[172,180,178],
  river0:[166,182,186],river1:[128,148,158],wall:[238,233,222],wallSh:[196,190,178],ochre:[230,212,176],rose:[230,210,194],
  roof:[172,126,102],roofHi:[204,160,132],stone:[218,210,196],stoneDk:[170,162,150],mud:[150,138,118],
  dust:[226,216,198],wave:[112,134,124],foam:[234,236,228],fire:[232,98,40],fireHi:[255,186,96],smoke:[64,60,62],
  paper:[238,230,210],paperDk:[208,196,170],ink:[78,58,44],plaster:[230,222,206]};
const HW_WATER=648;

/* ---------------------------------------------------------------- people of 1755, and of today
   ag_person specs. The clothes of 1755 are painted over the body and the head in figure space (who.top.paint, who.hat.paint): a dark
   mantle over a woman's head and shoulders, for church; a white neckcloth and a waistcoat's buttons for the men's long coats; hair
   tied back at the nape with a ribbon; a cassock's buttons. Each has its own key, so it's painted once. */
function hw_mantle(col){return(c,P)=>{const lt=ag_lt(col,0.22),dk=ag_dk(col,0.45);
  // the cloth over the head, standing a little off the hair, and down over the shoulders and the chest; its edge frames the face
  const cloth=cc=>{cc.moveTo(380,336);cc.bezierCurveTo(374,298,340,268,296,264);cc.bezierCurveTo(244,260,202,290,190,338);
    cc.bezierCurveTo(178,390,180,440,170,488);cc.bezierCurveTo(158,540,126,580,96,614);cc.bezierCurveTo(78,650,76,700,82,760);
    cc.bezierCurveTo(180,806,360,806,454,760);cc.bezierCurveTo(454,700,446,650,420,626);cc.bezierCurveTo(394,604,360,592,336,566);
    cc.bezierCurveTo(300,536,284,500,282,456);cc.bezierCurveTo(281,420,288,392,304,372);cc.bezierCurveTo(322,352,352,342,380,336);cc.closePath();};
  ag_soft(c,cloth,col,lt,330,300,260,rgba(dk,0.5),18);
  c.strokeStyle=rgba(ag_lt(col,0.32),0.85);c.lineWidth=5;c.lineCap="round";c.beginPath();c.moveTo(378,338);c.bezierCurveTo(350,344,318,356,302,376);
  c.bezierCurveTo(288,394,282,424,283,456);c.bezierCurveTo(285,498,302,536,338,566);c.stroke();
  ag_folds(c,cloth,[[[204,560],[172,640],[150,740]],[[404,640],[424,690],[428,752]],[[300,640],[296,700],[302,770]]],rgba(dk,0.5),rgba(lt,0.35));};}
// the men's long coats: a white neckcloth tied at the throat, and the waistcoat's buttons down the opening
function hw_coat(neck,btn){return(c,P)=>{c.save();ag_shape(c,AG_F.torso);c.clip();
  ag_soft(c,cc=>{cc.moveTo(254,570);cc.bezierCurveTo(280,600,328,608,356,598);cc.bezierCurveTo(352,620,346,640,338,662);
    cc.bezierCurveTo(326,692,300,692,290,664);cc.bezierCurveTo(280,636,266,604,254,570);cc.closePath();},neck,ag_lt(neck,0.5),326,600,70,rgba(ag_dk(neck,0.4),0.3),6);
  if(btn)for(let i=0;i<5;i++){const y=700+i*40,x=318+(y-640)*0.04;c.fillStyle=rgba(btn,1);c.beginPath();c.arc(x,y,5.5,0,TAU);c.fill();
    c.fillStyle="rgba(255,255,255,0.45)";c.beginPath();c.arc(x+1.5,y-1.5,2,0,TAU);c.fill();}
  c.restore();};}
// hair tied back at the nape, with a dark ribbon
function hw_queue(col){return(c,P)=>{const hc=P.hair.c;
  ag_soft(c,cc=>{cc.moveTo(226,444);cc.bezierCurveTo(206,462,196,494,200,528);cc.bezierCurveTo(204,544,214,546,218,532);cc.bezierCurveTo(216,500,222,474,238,456);cc.closePath();},
    hc,ag_lt(hc,0.3),214,470,40,null);
  c.fillStyle=rgba(col,1);c.beginPath();c.ellipse(224,458,13,8,0.5,0,TAU);c.fill();};}
// a cassock's small buttons, all the way down
function hw_cassock(btn){return(c,P)=>{c.save();ag_shape(c,AG_F.torso);c.clip();
  for(let y=650;y<1100;y+=34){c.fillStyle=rgba(btn,1);c.beginPath();c.arc(306+(y-616)*0.02,y,4.2,0,TAU);c.fill();}c.restore();};}
const HW_P={
  woman:{key:"hw_woman",name:"a woman in a dark mantle",skin:[232,198,170],hair:{style:"side",c:[58,44,36]},top:{kind:"tunic",c:[66,60,70]},hat:{paint:hw_mantle([48,44,54])},breath:0.3},
  man:{key:"hw_man",name:"a man in a long coat",skin:[222,184,152],hair:{style:"side",c:[74,56,44]},top:{kind:"suit",c:[98,80,62],inner:[214,198,166],paint:hw_coat([240,236,226],[176,146,96])},hat:{paint:hw_queue([40,36,34])},breath:0.27},
  child:{key:"hw_child",name:"a child",skin:[236,202,174],hair:{style:"side",c:[92,66,46]},top:{kind:"tunic",c:[132,116,94]},breath:0.34},
  eldest:{key:"hw_eldest",name:"the eldest engineer",skin:[226,190,162],hair:{style:"cropped",c:[234,232,228]},top:{kind:"suit",c:[52,60,78],inner:[212,196,160],paint:hw_coat([242,238,228],[196,164,96])},breath:0.23},
  eng2:{key:"hw_eng2",name:"an engineer",skin:[218,180,146],hair:{style:"side",c:[204,200,192]},top:{kind:"suit",c:[58,64,76],inner:[210,194,160],paint:hw_coat([240,236,226],[196,164,96])},hat:{paint:hw_queue([36,34,32])},breath:0.27},
  eng3:{key:"hw_eng3",name:"a young engineer",skin:[224,186,150],hair:{style:"side",c:[96,72,52]},top:{kind:"suit",c:[60,68,74],inner:[214,198,164],paint:hw_coat([240,236,226],[196,164,96])},hat:{paint:hw_queue([36,34,32])},breath:0.3},
  priest:{key:"hw_priest",name:"a parish priest",skin:[220,182,150],hair:{style:"cropped",c:[88,74,64]},top:{kind:"tunic",c:[40,38,42],paint:hw_cassock([74,72,76])},breath:0.25},
  sci:{key:"hw_sci",name:"a scientist",skin:[196,148,118],hair:{style:"long",c:[44,34,30]},glasses:[50,48,54],top:{kind:"cardigan",c:[118,128,140],inner:[236,234,228]},breath:0.28},
  walkA:{key:"hw_walkA",name:"a woman walking",skin:[226,188,160],hair:{style:"bob",c:[52,40,34]},earrings:[220,206,180],top:{kind:"blazer",c:[170,150,120],inner:[232,228,220]},breath:0.3},
  walkB:{key:"hw_walkB",name:"a man walking",skin:[150,104,78],hair:{style:"cropped",c:[30,26,26]},top:{kind:"overshirt",c:[96,110,104],inner:[220,224,226]},breath:0.27}
};

/* ---------------------------------------------------------------- the corner tag: where and when, at the top left */
function hw_corner(ctx,text,a){if(a<=0)return;const w=ag_tw(ctx,text.toUpperCase(),{w:700,size:30,ls:3})+56;
  ag_box(ctx,72,64,w,62,31,{a:a*0.92});ag_T(ctx,text.toUpperCase(),100,106,{w:700,size:30,ls:3,col:AG.kick,a});}

/* ---------------------------------------------------------------- sky, far hills */
function hw_sky(c,top,bot,y1,sun,sunA){const g=c.createLinearGradient(0,0,0,y1);g.addColorStop(0,rgba(top,1));g.addColorStop(1,rgba(bot,1));c.fillStyle=g;c.fillRect(0,0,W,y1);
  if(sunA>0){const s=c.createRadialGradient(sun[0],sun[1],10,sun[0],sun[1],1000);s.addColorStop(0,rgba(HWC.sun,0.5*sunA));s.addColorStop(0.45,rgba(HWC.sun,0.16*sunA));s.addColorStop(1,rgba(HWC.sun,0));c.fillStyle=s;c.fillRect(0,0,W,y1);}}
function hw_ridge(c,base,amp,col,y1,seed,fr,hazeA){const R=ag_rnd(seed),ph=[R()*9,R()*9,R()*9];c.beginPath();c.moveTo(0,y1);
  for(let x=0;x<=W;x+=12)c.lineTo(x,base-amp*(0.55*Math.sin(x*fr+ph[0])+0.3*Math.sin(x*fr*2.3+ph[1])+0.15*Math.sin(x*fr*5.1+ph[2])));
  c.lineTo(W,y1);c.closePath();const g=c.createLinearGradient(0,base-amp,0,y1);g.addColorStop(0,rgba(mix(col,HWC.haze,hazeA),1));g.addColorStop(1,rgba(col,1));c.fillStyle=g;c.fill();}

/* ---------------------------------------------------------------- the city on its hills
   Seen from across the river: two hills with the lower town in the valley between them, down to the water. Rows of houses run from
   the crest down to the quay, the farthest first; churches stand among them. hw_town(ctx, {ruin}) draws it whole, or in ruins: the same
   houses from the same numbers, a quarter of them fallen to heaps of stone, the rest roofless, their walls torn off at the top; the
   towers halved, the dome gone. */
function hw_crest(x){return 604-268*Math.exp(-Math.pow((x-560)/300,2))-238*Math.exp(-Math.pow((x-1500)/330,2))-50*Math.exp(-Math.pow((x-120)/240,2));}
function hw_rowY(x,u){return lerp(hw_crest(x)+16,HW_WATER-4,Math.pow(u,0.85));}
const HW_CH=[[290,5,"tower"],[600,2,"dome"],[860,8,"towers"],[1090,10,"front"],[1300,6,"tower"],[1590,3,"towers"],[1790,7,"tower"]];
function hw_windows(c,x,top,w,h,k,a){const fl=Math.max(1,Math.floor(h/(12*k))),nw=Math.max(1,Math.floor((w-4*k)/(10*k))),sx=(w-nw*10*k)/2+3*k;
  c.fillStyle="rgba(64,58,54,"+a+")";for(let f=0;f<fl;f++){const y=top+5*k+f*12*k;for(let i=0;i<nw;i++)c.fillRect(x+sx+i*10*k,y,3.6*k,5.6*k);}}
function hw_house(c,x,yb,w,h,k,tone,ri){const wall=tone<0.58?HWC.wall:tone<0.84?HWC.ochre:HWC.rose,top=yb-h;
  if(ri>=0){if(hash(ri,3)<0.24){const mh=h*(0.2+0.22*hash(ri,5));c.fillStyle=rgba(mix(HWC.stone,HWC.stoneDk,0.35+0.3*hash(ri,8)),1);c.beginPath();c.moveTo(x-3*k,yb);
      for(let i=0;i<=8;i++)c.lineTo(x+w*i/8,yb-mh*Math.sin(Math.PI*i/8)*(0.65+0.35*hash(ri*9+i,11)));c.lineTo(x+w+3*k,yb);c.closePath();c.fill();return;}
    const torn=i=>top+h*(0.12+0.5*hash(ri*7+i,4));c.fillStyle=rgba(mix(wall,HWC.stoneDk,0.42),1);c.beginPath();c.moveTo(x,yb);c.lineTo(x,torn(0));
    for(let i=1;i<=5;i++)c.lineTo(x+w*i/5,torn(i));c.lineTo(x+w,yb);c.closePath();c.fill();
    c.save();c.clip();hw_windows(c,x,top,w,h,k,0.95);c.fillStyle=rgba(HWC.wallSh,0.55);c.fillRect(x,top,Math.max(2,w*0.16),h);
    // the house open to the sky: its dark inside, over the line of a fallen floor
    const fl=top+h*(0.42+0.3*hash(ri,6));c.fillStyle="rgba(70,60,56,0.55)";c.fillRect(x+w*0.18,top,w*0.64,fl-top);c.restore();return;}
  c.fillStyle=rgba(wall,1);c.fillRect(x,top,w,h);hw_windows(c,x,top,w,h,k,0.5);
  c.fillStyle=rgba(HWC.wallSh,0.38);c.fillRect(x,top,Math.max(2,w*0.16),h);
  const rh=Math.max(4,h*0.26);c.fillStyle=rgba(HWC.roof,1);c.beginPath();c.moveTo(x-2*k,top+1);c.lineTo(x+w*0.2,top-rh);c.lineTo(x+w*0.8,top-rh);c.lineTo(x+w+2*k,top+1);c.closePath();c.fill();
  c.fillStyle=rgba(HWC.roofHi,0.55);c.beginPath();c.moveTo(x+w*0.8,top-rh);c.lineTo(x+w+2*k,top+1);c.lineTo(x+w*0.55,top+1);c.closePath();c.fill();}
function hw_church(c,x,yb,k,kind,ri){const ruin=ri>=0,st=HWC.stone,sh=HWC.stoneDk,fw=(kind==="front"?96:70)*k,fh=72*k,x0=x-fw/2,top=yb-fh;
  const tower=(tx,tw,th)=>{const tt=yb-th;if(ruin){const cut=tt+th*0.45;c.fillStyle=rgba(mix(st,sh,0.2),1);c.beginPath();c.moveTo(tx,yb);c.lineTo(tx,cut+8*k);c.lineTo(tx+tw*0.3,cut);
      c.lineTo(tx+tw*0.55,cut+12*k);c.lineTo(tx+tw*0.8,cut+3*k);c.lineTo(tx+tw,cut+10*k);c.lineTo(tx+tw,yb);c.closePath();c.fill();return;}
    c.fillStyle=rgba(st,1);c.fillRect(tx,tt,tw,th);c.fillStyle=rgba(sh,0.45);c.fillRect(tx,tt,tw*0.22,th);
    c.fillStyle="rgba(70,62,58,0.6)";c.fillRect(tx+tw*0.3,tt+10*k,tw*0.4,14*k);
    c.fillStyle=rgba(HWC.roof,1);c.beginPath();c.moveTo(tx-2*k,tt);c.lineTo(tx+tw/2,tt-22*k);c.lineTo(tx+tw+2*k,tt);c.closePath();c.fill();
    c.fillStyle=rgba(HWC.roofHi,0.6);c.beginPath();c.moveTo(tx+tw/2,tt-22*k);c.lineTo(tx+tw+2*k,tt);c.lineTo(tx+tw/2,tt);c.closePath();c.fill();};
  if(kind==="dome"){const cx=x,cy=top-24*k,dr=26*k;
    if(!ruin){c.fillStyle=rgba(st,1);c.fillRect(cx-dr,cy,dr*2,26*k);const g=c.createRadialGradient(cx+dr*0.4,cy-dr*0.6,2,cx,cy,dr*1.3);g.addColorStop(0,"rgb(240,234,222)");g.addColorStop(1,rgba(sh,1));
      c.fillStyle=g;c.beginPath();c.arc(cx,cy,dr,Math.PI,0);c.closePath();c.fill();c.fillStyle=rgba(st,1);c.fillRect(cx-3*k,cy-dr-12*k,6*k,12*k);}
    else{c.fillStyle=rgba(mix(st,sh,0.25),1);c.beginPath();c.moveTo(cx-dr,cy+26*k);c.lineTo(cx-dr,cy+8*k);c.lineTo(cx-dr*0.3,cy+14*k);c.lineTo(cx+dr*0.1,cy+4*k);c.lineTo(cx+dr,cy+12*k);c.lineTo(cx+dr,cy+26*k);c.closePath();c.fill();}}
  if(ruin){c.fillStyle=rgba(mix(st,sh,0.15),1);c.beginPath();c.moveTo(x0,yb);c.lineTo(x0,top+fh*0.35);c.lineTo(x0+fw*0.25,top+fh*0.2);c.lineTo(x0+fw*0.45,top+fh*0.42);
    c.lineTo(x0+fw*0.7,top+fh*0.15);c.lineTo(x0+fw,top+fh*0.38);c.lineTo(x0+fw,yb);c.closePath();c.fill();}
  else{c.fillStyle=rgba(st,1);c.fillRect(x0,top,fw,fh);c.beginPath();c.moveTo(x0-2*k,top);c.lineTo(x,top-22*k);c.lineTo(x0+fw+2*k,top);c.closePath();c.fill();
    c.fillStyle=rgba(sh,0.4);c.fillRect(x0,top,fw*0.14,fh);c.fillStyle="rgba(70,62,58,0.55)";c.beginPath();c.moveTo(x-8*k,yb);c.lineTo(x-8*k,yb-24*k);c.arc(x,yb-24*k,8*k,Math.PI,0);
    c.lineTo(x+8*k,yb);c.closePath();c.fill();c.beginPath();c.arc(x,top+20*k,6*k,0,TAU);c.fill();}
  if(kind==="tower")tower(x0-20*k,22*k,128*k);
  if(kind==="towers"){tower(x0-16*k,22*k,120*k);tower(x0+fw-6*k,22*k,120*k);}
  if(kind==="front")tower(x-11*k,22*k,104*k);}
// the waterfront: a long arcaded front along the quay
function hw_front(c,ruin){const y=HW_WATER-4,x0=760,x1=1280,h=40;
  if(!ruin){c.fillStyle=rgba(HWC.ochre,1);c.fillRect(x0,y-h,x1-x0,h);c.fillStyle="rgba(80,70,60,0.5)";
    for(let x=x0+10;x<x1-20;x+=22){c.beginPath();c.moveTo(x,y);c.lineTo(x,y-12);c.arc(x+7,y-12,7,Math.PI,0);c.lineTo(x+14,y);c.closePath();c.fill();}
    hw_windows(c,x0,y-h,x1-x0,h-16,1,0.45);c.fillStyle=rgba(HWC.roof,1);c.fillRect(x0-4,y-h-6,x1-x0+8,7);return;}
  c.fillStyle=rgba(mix(HWC.ochre,HWC.stoneDk,0.3),1);c.beginPath();c.moveTo(x0,y);for(let i=0;i<=26;i++)c.lineTo(lerp(x0,x1,i/26),y-h*(0.3+0.6*hash(i,21)));c.lineTo(x1,y);c.closePath();c.fill();}
function hw_town(c,o){o=o||{};const R=ag_rnd(1755),rows=13,ruin=!!o.ruin;let n=0;
  for(let r=0;r<rows;r++){const u=r/(rows-1),k=lerp(0.5,1.04,u);let x=-30+R()*24;
    while(x<W+30){const w=(26+R()*30)*k,h=(22+R()*24)*k,gap=(1+R()*3)*k,tone=R();hw_house(c,x,hw_rowY(x+w/2,u),w,h,k,tone,ruin?n:-1);x+=w+gap;n++;}
    for(const ch of HW_CH)if(ch[1]===r)hw_church(c,ch[0],hw_rowY(ch[0],u),k,ch[2],ruin?ch[0]:-1);}
  hw_front(c,ruin);}
// the river in front of the city, in the hour's light: its quay, long soft streaks of light, the city's pale reflection
function hw_water(L){return L==="dusk"?[[58,58,82],[34,34,52]]:L==="grey"?[[178,180,180],[150,154,156]]:[HWC.river0,HWC.river1];}
function hw_riverBed(c,L){const [a,b]=hw_water(L);let g=c.createLinearGradient(0,HW_WATER,0,H);g.addColorStop(0,rgba(a,1));g.addColorStop(1,rgba(b,1));c.fillStyle=g;c.fillRect(0,HW_WATER,W,H-HW_WATER);
  c.fillStyle=rgba(L==="dusk"?[70,64,74]:HWC.stone,1);c.fillRect(0,HW_WATER-4,W,6);
  const R=ag_rnd(9);for(let i=0;i<46;i++){const y=HW_WATER+12+Math.pow(R(),1.6)*(H-HW_WATER-20),x=R()*W,w=60+R()*260,al=(L==="morning"?0.16:L==="grey"?0.08:0.05)*(0.4+0.6*x/W);
    c.fillStyle="rgba(255,255,250,"+al+")";c.fillRect(x,y,w,1.5+(y-HW_WATER)/180);}
  g=c.createLinearGradient(0,HW_WATER,0,HW_WATER+70);g.addColorStop(0,L==="dusk"?"rgba(40,30,40,0.35)":"rgba(240,232,214,0.22)");g.addColorStop(1,"rgba(240,232,214,0)");c.fillStyle=g;c.fillRect(0,HW_WATER,W,70);}
// the whole view: o.ruin, o.light "morning" (the default), "dusk" (the city dark, under a sky the fires light from below) or "grey"
function hw_paintCity(c,o){o=o||{};const L=o.light||"morning",ruin=!!o.ruin;
  const SK={morning:[HWC.sky0,HWC.sky1,1],dusk:[[52,56,84],[150,100,92],0],grey:[[184,186,188],[214,212,206],0]}[L];
  hw_sky(c,SK[0],SK[1],HW_WATER,[1700,140],SK[2]);
  hw_ridge(c,372,40,L==="dusk"?[70,66,86]:L==="grey"?[178,180,180]:HWC.far,HW_WATER,17,0.0028,L==="morning"?0.5:0.25);
  // the city, painted apart so the hour's light falls on it alone
  const tc=mkCanvas(W,H),tx=tc.getContext("2d");hw_town(tx,{ruin});tx.globalCompositeOperation="source-atop";
  if(L==="dusk"){tx.fillStyle="rgba(34,30,58,0.62)";tx.fillRect(0,0,W,H);const g=tx.createLinearGradient(0,330,0,HW_WATER);g.addColorStop(0,"rgba(255,140,70,0)");g.addColorStop(1,"rgba(255,140,70,0.22)");tx.fillStyle=g;tx.fillRect(0,0,W,H);}
  else if(L==="grey"){tx.fillStyle="rgba(196,194,190,0.26)";tx.fillRect(0,0,W,H);}
  else{const g=tx.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(60,52,44,0.16)");g.addColorStop(0.55,"rgba(60,52,44,0)");g.addColorStop(1,"rgba(255,246,226,0.14)");tx.fillStyle=g;tx.fillRect(0,0,W,H);}
  c.drawImage(tc,0,0);
  // the dust settled over the ruins of the lower town
  if(ruin&&L!=="dusk")for(const [x,y,r,a] of [[1010,600,360,0.2],[700,560,300,0.13],[1380,590,300,0.12]]){const g=c.createRadialGradient(x,y,10,x,y,r);
    g.addColorStop(0,rgba(L==="grey"?[214,212,206]:HWC.dust,a));g.addColorStop(1,rgba(HWC.dust,0));c.save();c.translate(x,y);c.scale(1.6,0.6);c.translate(-x,-y);c.fillStyle=g;c.fillRect(x-r,y-r,2*r,2*r);c.restore();}
  hw_riverBed(c,L);}

/* ---------------------------------------------------------------- the city's live pieces: the tremble, the dust, the river and the wave, the fires */
// a place drawn as a picture that trembles: amp in px; drawn a little larger, so its edges never show; a gentle tremble, never a flash
function hw_shaken(x,key,tt,amp,a){const dx=amp*(0.6*Math.sin(tt*37)+0.4*Math.sin(tt*61+1)),dy=amp*0.4*Math.sin(tt*47+2),z=1+amp*0.0034;
  x.save();if(a!=null)x.globalAlpha*=a;x.translate(960+dx,540+dy);x.scale(z,z);x.translate(-960,-540);x.drawImage(ag_place(key),0,0,W,H);x.restore();}
const HW_DUST=(()=>{const R=ag_rnd(31),d=[];for(let i=0;i<22;i++){const x=lerp(560,1500,R());d.push({x,y:hw_crest(x)*0.35+HW_WATER*0.65-R()*40,r:50+R()*60,v:20+R()*30,dx:(R()-0.5)*16,t:R()*1.2});}return d;})();
// pale dust rising from the lower town from t0, slowly spreading
function hw_dust(x,tt,t0,a){if(a<=0)return;for(const d of HW_DUST){const u=tt-t0-d.t;if(u<=0)continue;const al=a*clamp(u/0.8,0,1)*0.42,r=d.r+u*26,y=d.y-u*d.v,px=d.x+u*d.dx;
  const g=x.createRadialGradient(px,y,r*0.1,px,y,r);g.addColorStop(0,rgba(HWC.dust,al));g.addColorStop(1,rgba(HWC.dust,0));x.fillStyle=g;x.fillRect(px-r,y-r,2*r,2*r);}}
// the river, drawn live: o.back (0 to 1) the sea draws the water back from the quay and the mud shows; o.wave (0 to 1) a long
// grey-green wave runs in from the left, its front from off the left edge to past the right; behind it the water stands over the quay
function hw_river(x,tt,o){const back=clamp(o.back||0,0,1),fx=lerp(-300,W+500,o.wave||0),low=HW_WATER+46*back,high=HW_WATER-44;
  if(back>0){x.fillStyle=rgba(HWC.mud,1);x.fillRect(0,HW_WATER-2,W,low-HW_WATER+6);x.fillStyle="rgba(255,255,240,0.12)";for(let i=0;i<8;i++)x.fillRect(0,HW_WATER+6+i*5*back,W,1.2);}
  const top=px=>{const d=fx-px;if(d<-150)return low+3*Math.sin(px*0.02+tt*2);const crestTop=high-26;
    if(d<0)return lerp(low,crestTop,ag_sine((d+150)/150));const settle=clamp(d/1100,0,1);
    return lerp(high-26*Math.exp(-Math.pow(d/90,2)),HW_WATER+4,settle*settle)+6*Math.sin(px*0.035-tt*5)*(1-settle*0.5);};
  x.save();x.beginPath();x.moveTo(-10,H);for(let px=-10;px<=W+10;px+=8)x.lineTo(px,top(px));x.lineTo(W+10,H);x.closePath();
  let g=x.createLinearGradient(0,HW_WATER,0,H);g.addColorStop(0,rgba(HWC.river0,1));g.addColorStop(1,rgba(HWC.river1,1));x.fillStyle=g;x.fill();
  g=x.createLinearGradient(fx-260,0,fx+60,0);g.addColorStop(0,rgba(HWC.wave,0.95));g.addColorStop(1,rgba(HWC.wave,0));x.fillStyle=g;x.fill();
  g=x.createLinearGradient(0,HW_WATER-60,0,H);g.addColorStop(0,"rgba(30,40,40,0)");g.addColorStop(1,"rgba(30,40,40,0.3)");x.fillStyle=g;x.fill();
  if(fx>-200&&fx<W+300){x.strokeStyle=rgba(HWC.foam,0.85);x.lineWidth=6;x.lineCap="round";x.beginPath();let first=true;
    for(let px=Math.max(-10,fx-520);px<=Math.min(W+10,fx+20);px+=8){const y=top(px);if(first){x.moveTo(px,y);first=false;}else x.lineTo(px,y);}x.stroke();
    x.fillStyle=rgba(HWC.foam,0.9);x.beginPath();x.ellipse(fx-8,top(fx)+6,52,14,-0.22,0,TAU);x.fill();
    x.fillStyle=rgba(HWC.foam,0.35);for(let i=0;i<6;i++){const sx=fx-80-i*90;x.fillRect(sx-30,top(sx)+14+i*3,60+i*8,3);}}
  x.restore();}
const HW_FIRE=[[760,560],[880,600],[990,590],[1080,612],[1170,585],[1270,600],[640,520],[1420,560],[540,470]];
// the fires' glow over the dark ruins, flickering slowly, and their smoke leaning with the wind; their light on the water
function hw_fires(x,tt,a){if(a<=0)return;x.save();x.globalCompositeOperation="screen";
  HW_FIRE.forEach(([fx,fy],i)=>{const fl=0.78+0.22*Math.sin(tt*(2.1+i*0.37)+i*1.7)*Math.sin(tt*(1.3+i*0.21)+i),r=130+40*hash(i,2);
    let g=x.createRadialGradient(fx,fy,4,fx,fy,r);g.addColorStop(0,rgba(HWC.fireHi,0.7*a*fl));g.addColorStop(0.35,rgba(HWC.fire,0.4*a*fl));g.addColorStop(1,rgba(HWC.fire,0));x.fillStyle=g;x.fillRect(fx-r,fy-r,2*r,2*r);
    x.save();x.translate(fx,HW_WATER+60);x.scale(0.4,1.6);g=x.createRadialGradient(0,0,2,0,0,70);g.addColorStop(0,rgba(HWC.fire,0.22*a*fl));g.addColorStop(1,rgba(HWC.fire,0));x.fillStyle=g;x.fillRect(-70,-70,140,140);x.restore();});
  x.restore();
  for(let i=0;i<5;i++){const [fx,fy]=HW_FIRE[i*2];for(let j=0;j<7;j++){const age=((tt*0.12+j/7+i*0.13)%1),r=34+age*130,px=fx-age*190,py=fy-30-age*440,al=a*0.3*Math.sin(Math.PI*age);
    if(al<=0)continue;const g=x.createRadialGradient(px,py,2,px,py,r);g.addColorStop(0,rgba(HWC.smoke,al));g.addColorStop(1,rgba(HWC.smoke,0));x.fillStyle=g;x.fillRect(px-r,py-r,2*r,2*r);}}}

/* ---------------------------------------------------------------- a church's open doors (the place "hwChurch")
   Close to the front: pale stone in courses, the tall round-arched doorway at the right standing open, the nave dim and warm inside,
   candles at the altar, and the people already inside, dark against its light. Steps lead up to it. The people going in are live. */
function hw_paintChurch(c){let g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgb(190,182,168)");g.addColorStop(0.6,"rgb(222,216,204)");g.addColorStop(1,"rgb(234,228,216)");c.fillStyle=g;c.fillRect(0,0,W,H);
  c.strokeStyle="rgba(120,108,92,0.16)";c.lineWidth=2;for(let y=60,i=0;y<900;y+=74,i++){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();for(let x=(i%2)*90;x<W;x+=180){c.beginPath();c.moveTo(x,y);c.lineTo(x,y+74);c.stroke();}}
  const D={x0:1110,x1:1590,top:200,bot:900},cx=(D.x0+D.x1)/2,rad=(D.x1-D.x0)/2;
  const door=(cc,m)=>{cc.moveTo(D.x0-m,D.bot);cc.lineTo(D.x0-m,D.top+rad);cc.arc(cx,D.top+rad,rad+m,Math.PI,0);cc.lineTo(D.x1+m,D.bot);};
  // the moulding round the doorway, a band of lighter stone
  ag_soft(c,cc=>{door(cc,48);cc.lineTo(D.x1,D.bot);cc.lineTo(D.x1,D.top+rad);cc.arc(cx,D.top+rad,rad,0,Math.PI,true);cc.lineTo(D.x0,D.bot);cc.closePath();},[228,222,208],[250,246,236],1500,260,500,"rgba(80,70,56,0.3)",10);
  c.save();c.beginPath();door(c,0);c.closePath();c.clip();g=c.createLinearGradient(0,D.top,0,D.bot);g.addColorStop(0,"rgb(40,32,30)");g.addColorStop(1,"rgb(70,52,40)");c.fillStyle=g;c.fillRect(D.x0,D.top,D.x1-D.x0,D.bot-D.top);
  const al=c.createRadialGradient(cx,610,10,cx,610,280);al.addColorStop(0,"rgba(255,206,140,0.55)");al.addColorStop(1,"rgba(255,206,140,0)");c.fillStyle=al;c.fillRect(D.x0,D.top,D.x1-D.x0,D.bot-D.top);
  for(const [px,py] of [[1270,600],[1310,590],[1350,585],[1390,590],[1430,600],[1200,640],[1500,640]]){const cg=c.createRadialGradient(px,py,1,px,py,26);cg.addColorStop(0,"rgba(255,236,190,0.9)");cg.addColorStop(1,"rgba(255,220,160,0)");
    c.fillStyle=cg;c.fillRect(px-26,py-26,52,52);c.fillStyle="rgb(255,244,214)";c.beginPath();c.ellipse(px,py,2.6,5,0,0,TAU);c.fill();}
  for(let i=0;i<9;i++){const px=D.x0+46+i*50+(i%2)*12,py=770+(i%3)*24,s=0.8+0.2*hash(i,4);c.fillStyle="rgba(26,20,18,0.94)";c.beginPath();c.arc(px,py-62*s,19*s,0,TAU);c.fill();
    c.beginPath();c.ellipse(px,py+10,42*s,58*s,0,Math.PI,0);c.fill();c.fillRect(px-42*s,py+10,84*s,200);c.strokeStyle="rgba(255,206,150,0.35)";c.lineWidth=2;c.beginPath();c.arc(px,py-62*s,19*s,-1.2,0.4);c.stroke();}
  // the doors, swung in, at each side of the opening
  for(const sd of [-1,1]){const ex=sd<0?D.x0:D.x1,ix=ex-sd*70;c.fillStyle="rgb(96,70,52)";c.beginPath();c.moveTo(ex,D.top+rad*0.55);c.lineTo(ix,D.top+rad*0.75);c.lineTo(ix,D.bot-40);c.lineTo(ex,D.bot);c.closePath();c.fill();
    c.strokeStyle="rgba(40,26,18,0.5)";c.lineWidth=3;for(let k=1;k<4;k++){const u=k/4;c.beginPath();c.moveTo(lerp(ex,ix,u),lerp(D.top+rad*0.55,D.top+rad*0.75,u));c.lineTo(lerp(ex,ix,u),lerp(D.bot,D.bot-40,u));c.stroke();}}
  c.restore();
  for(let i=0;i<3;i++){const y=900+i*60;c.fillStyle=rgba(mix([206,198,182],[234,228,216],i/2),1);c.fillRect(0,y,W,60);c.fillStyle="rgba(255,255,255,0.35)";c.fillRect(0,y,W,3);c.fillStyle="rgba(80,70,60,0.15)";c.fillRect(0,y+52,W,8);}
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,34,28,0.18)");g.addColorStop(0.5,"rgba(40,34,28,0)");g.addColorStop(1,"rgba(255,248,232,0.1)");c.fillStyle=g;c.fillRect(0,0,W,H);}
// the people going in: a child, a woman in her mantle, a man in his long coat, all facing the door, walking slowly towards it (u 0 to 1)
function hw_churchgoers(x,tt,u){const d=lerp(0,70,u),bob=i=>2.5*Math.sin(tt*3.4+i*1.3)*clamp(u*4,0,1);
  ag_person(x,HW_P.child,260+d,800+bob(0),0.66,{t:tt,gaze:[4,-1]});ag_person(x,HW_P.woman,530+d,690+bob(1),0.9,{t:tt+0.6,gaze:[4,0]});ag_person(x,HW_P.man,800+d,684+bob(2),0.92,{t:tt+1.1,gaze:[4,-1]});}

/* ---------------------------------------------------------------- the engineers' room (the place "hwDraft"), and the plan
   A plastered wall in daylight from a tall window at the right; a board on the wall where the plan of the lower town is pinned: the old
   lanes in faint graphite and, drawing itself over them, the new plan in blue. The engineers are live, in front of it. */
function hw_paintDraft(c){let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgb(226,218,202)");g.addColorStop(1,"rgb(206,196,178)");c.fillStyle=g;c.fillRect(0,0,W,H);
  ag_soft(c,cc=>ag_rect(cc,1800,90,140,700,6),[238,236,228],[255,255,252],1860,200,300,"rgba(80,70,56,0.25)",10);
  g=c.createLinearGradient(1800,0,900,0);g.addColorStop(0,"rgba(255,250,236,0.35)");g.addColorStop(1,"rgba(255,250,236,0)");c.fillStyle=g;c.beginPath();c.moveTo(1800,90);c.lineTo(900,300);c.lineTo(900,980);c.lineTo(1800,790);c.closePath();c.fill();
  c.fillStyle="rgb(176,156,128)";c.fillRect(0,780,W,10);g=c.createLinearGradient(0,790,0,H);g.addColorStop(0,"rgb(150,118,88)");g.addColorStop(1,"rgb(118,90,66)");c.fillStyle=g;c.fillRect(0,790,W,H-790);
  ag_soft(c,cc=>ag_rect(cc,520,88,820,660,10),[148,116,86],[196,164,128],1200,120,520,"rgba(60,40,24,0.4)",14);
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,34,28,0.16)");g.addColorStop(0.5,"rgba(40,34,28,0)");g.addColorStop(1,"rgba(255,248,232,0.12)");c.fillStyle=g;c.fillRect(0,0,W,H);}
// the plan's oak table, close (the place "hwPlanTable")
function hw_paintPlanTable(c){const R=ag_rnd(77);for(let y=0;y<H;y+=150){const t=R();c.fillStyle=rgba(mix([172,138,104],[196,162,124],t),1);c.fillRect(0,y,W,150);
    c.strokeStyle="rgba(90,62,40,0.18)";c.lineWidth=2;for(let k=0;k<7;k++){const yy=y+12+R()*126;c.beginPath();c.moveTo(0,yy);for(let x=0;x<=W;x+=60)c.lineTo(x,yy+6*Math.sin(x*0.004+k));c.stroke();}
    c.fillStyle="rgba(60,40,24,0.35)";c.fillRect(0,y+148,W,2);}
  const g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,30,20,0.25)");g.addColorStop(0.5,"rgba(40,30,20,0)");g.addColorStop(1,"rgba(255,248,232,0.14)");c.fillStyle=g;c.fillRect(0,0,W,H);}
// the plan: old lanes (normalised, wandering) and the new plan's blocks between straight streets, a square by the river (the sheet's
// foot) and one at the top
const HW_LANES=(()=>{const R=ag_rnd(1756),L=[];for(let i=0;i<74;i++){let px=0.06+R()*0.88,py=0.04+R()*0.86,a=R()*TAU;const pts=[[px,py]];const n=4+Math.floor(R()*8);
  for(let j=0;j<n;j++){a+=(R()-0.5)*1.4;px=clamp(px+Math.cos(a)*0.035,0.03,0.97);py=clamp(py+Math.sin(a)*0.035,0.03,0.93);pts.push([px,py]);}L.push(pts);}return L;})();
const HW_STREETS={x:[0.14,0.255,0.37,0.5,0.63,0.745,0.86],hx:[0.012,0.012,0.012,0.02,0.012,0.012,0.012],y:[0.12,0.22,0.32,0.42,0.52,0.62,0.72],hy:0.01};
const HW_BLOCKS=(()=>{const S=HW_STREETS,B=[];for(let r=0;r<S.y.length-1;r++)for(let i=0;i<S.x.length-1;i++)B.push([S.x[i]+S.hx[i],S.y[r]+S.hy,S.x[i+1]-S.hx[i+1]-S.x[i]-S.hx[i],S.y[r+1]-S.hy-S.y[r]-S.hy]);
  for(const i of [0,5])B.push([S.x[i]+S.hx[i],0.73,S.x[i+1]-S.hx[i+1]-S.x[i]-S.hx[i],0.18]);return B;})();
function hw_plan(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const old=o.old==null?1:o.old,p=clamp(o.p||0,0,1),lw=Math.max(1.5,w/700);
  ctx.save();ctx.globalAlpha*=a;
  // the sheet, pinned at its corners
  ctx.save();ctx.shadowColor="rgba(46,38,28,0.3)";ctx.shadowBlur=24;ctx.shadowOffsetX=-6;ctx.shadowOffsetY=12;ctx.fillStyle=rgba(HWC.paper,1);ctx.fillRect(x,y,w,h);ctx.restore();
  let g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,"rgba(255,255,250,0.25)");g.addColorStop(1,"rgba(160,130,90,0.12)");ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
  if(o.pins)for(const [px,py] of [[x+16,y+16],[x+w-16,y+16],[x+16,y+h-16],[x+w-16,y+h-16]]){ctx.fillStyle="rgb(150,120,70)";ctx.beginPath();ctx.arc(px,py,7,0,TAU);ctx.fill();}
  const X=u=>x+u*w,Y=v=>y+v*h;
  // the river along its foot
  ctx.fillStyle="rgba(120,140,150,0.18)";ctx.fillRect(x,Y(0.94),w,h*0.06);
  if(old>0){ctx.strokeStyle="rgba(70,72,78,"+(0.38*old)+")";ctx.lineWidth=lw*1.3;ctx.lineJoin="round";ctx.lineCap="round";
    for(const L of HW_LANES){ctx.beginPath();L.forEach((q,i)=>i?ctx.lineTo(X(q[0]),Y(q[1])):ctx.moveTo(X(q[0]),Y(q[1])));ctx.stroke();}}
  if(p>0){const n=HW_BLOCKS.length,f=p*n;ctx.strokeStyle=rgba(AG.blue,0.95);ctx.lineWidth=lw*2.2;ctx.lineJoin="round";
    for(let i=0;i<n;i++){const u=clamp(f-i,0,1);if(u<=0)break;const [bx,by,bw,bh]=HW_BLOCKS[i],x0=X(bx),y0=Y(by),x1=X(bx+bw),y1=Y(by+bh),per=2*(x1-x0)+2*(y1-y0);
      if(u>=1){ctx.fillStyle=rgba(AG.blue,0.08);ctx.fillRect(x0,y0,x1-x0,y1-y0);}
      let r=per*u;const pts=[[x0,y0],[x1,y0],[x1,y1],[x0,y1],[x0,y0]];ctx.beginPath();ctx.moveTo(x0,y0);
      for(let k=1;k<5&&r>0;k++){const d=Math.hypot(pts[k][0]-pts[k-1][0],pts[k][1]-pts[k-1][1]),v=Math.min(1,r/d);ctx.lineTo(lerp(pts[k-1][0],pts[k][0],v),lerp(pts[k-1][1],pts[k][1],v));r-=d;}ctx.stroke();}
    // the squares: by the river, and at the top
    const sq=ag_in(p,0.85,0.15);if(sq>0){ctx.globalAlpha*=sq;ctx.setLineDash([lw*6,lw*5]);ctx.strokeRect(X(0.27),Y(0.74),X(0.73)-X(0.27),Y(0.92)-Y(0.74));ctx.strokeRect(X(0.38),Y(0.02),X(0.62)-X(0.38),Y(0.095)-Y(0.02));ctx.setLineDash([]);}}
  ctx.restore();
  // the long streets lit, the full height of the plan
  const hl=o.hl||0;if(hl>0){ctx.save();ctx.globalAlpha*=a*hl;ctx.strokeStyle=rgba(AG.blue,0.35);ctx.lineCap="round";
    HW_STREETS.x.forEach((sx,i)=>{ctx.lineWidth=HW_STREETS.hx[i]*2*w*0.8;ctx.beginPath();ctx.moveTo(X(sx),Y(0.13));ctx.lineTo(X(sx),Y(0.72)+(sx>0.2&&sx<0.8?0:0));ctx.stroke();});ctx.restore();}}
// the engineers at the plan: the young one at the left, the other two at the right, facing it; the eldest, white-haired, nearest the window
function hw_engineers(x,tt){ag_person(x,HW_P.eng3,330,724,0.86,{t:tt,gaze:[4,-3]});
  ag_person(x,HW_P.eldest,1760,742,0.82,{t:tt+0.8,flip:true,gaze:[4,-2]});ag_person(x,HW_P.eng2,1540,720,0.86,{t:tt+1.5,flip:true,gaze:[4,-3]});}

/* ---------------------------------------------------------------- the cutaway house: stone walls, and inside them a cage of timber
   hw_cutaway(ctx, x, y, s, o): the house's ground at (x, y), s its size (1: 600 px wide); o.sway leans it (a shear about the ground,
   positive to the right), o.a. Four floors; the side walls in section; the front's left part still whole, with its windows; the rest
   cut away to show the cage: oak posts, beams at every floor and half floor, and in each panel a cross; behind it the inside wall. */
function hw_oakBar(ctx,x0,y0,x1,y1,w){ctx.lineCap="butt";ctx.strokeStyle=rgba(AG_OAK.dark,1);ctx.lineWidth=w+3;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();
  ctx.strokeStyle=rgba(AG_OAK.base,1);ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();
  const nx=-(y1-y0),ny=x1-x0,l=Math.hypot(nx,ny)||1,ox=nx/l*w*0.28,oy=ny/l*w*0.28;ctx.strokeStyle=rgba(AG_OAK.hi,0.8);ctx.lineWidth=w*0.22;ctx.beginPath();ctx.moveTo(x0-ox,y0-oy);ctx.lineTo(x1-ox,y1-oy);ctx.stroke();}
const HW_CAGE={posts:[-250,-150,-50,50,150,250],floors:[0,-145,-290,-435,-580]};
function hw_cutaway(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_floorShadow(ctx,x+AG.sdx*6,y+12*s,330*s,26*s,0.28);
  ctx.translate(x,y);ctx.scale(s,s);const k=o.sway||0;ctx.transform(1,0,k,1,0,0);const C=HW_CAGE;
  // the inside wall, in shade
  let g=ctx.createLinearGradient(-266,0,266,0);g.addColorStop(0,"rgb(176,166,152)");g.addColorStop(1,"rgb(206,198,184)");ctx.fillStyle=g;ctx.fillRect(-266,-580,532,580);
  // the cage's panels, filled with rubble stone, faint, so the timber reads
  ctx.save();ctx.globalAlpha*=0.45;const R=ag_rnd(12);for(let i=0;i<C.posts.length-1;i++)for(let f=0;f<4;f++){const x0=C.posts[i],y0=C.floors[f+1];for(let n=0;n<6;n++){ctx.fillStyle=rgba(mix([214,206,190],[184,176,162],R()),1);
    ctx.beginPath();ctx.ellipse(x0+12+R()*76,y0+12+R()*120,8+R()*10,6+R()*7,R()*3,0,TAU);ctx.fill();}}ctx.restore();
  // the crosses, then the half-floor beams, then the posts, then the floors
  for(let i=0;i<C.posts.length-1;i++)for(let f=0;f<4;f++){const x0=C.posts[i]+8,x1=C.posts[i+1]-8,yA=C.floors[f]-8,yM=(C.floors[f]+C.floors[f+1])/2,yB=C.floors[f+1]+8;
    hw_oakBar(ctx,x0,yA,x1,yM+5,9);hw_oakBar(ctx,x0,yM+5,x1,yA,9);hw_oakBar(ctx,x0,yM-5,x1,yB,9);hw_oakBar(ctx,x0,yB,x1,yM-5,9);}
  for(let f=0;f<4;f++){const yM=(C.floors[f]+C.floors[f+1])/2;hw_oakBar(ctx,-266,yM,266,yM,12);}
  for(const px of C.posts)hw_oakBar(ctx,px,0,px,-580,15);
  for(const fy of C.floors)if(fy<0){ctx.fillStyle=rgba(AG_OAK.dark,1);ctx.fillRect(-266,fy-9,532,18);ctx.fillStyle=rgba(AG_OAK.base,1);ctx.fillRect(-266,fy-8,532,14);ctx.fillStyle=rgba(AG_OAK.hi,0.7);ctx.fillRect(-266,fy-8,532,3);}
  // the side walls, cut through: thick pale stone, a little darker where cut
  for(const sx of [-300,266]){g=ctx.createLinearGradient(sx,0,sx+34,0);g.addColorStop(0,"rgb(204,196,182)");g.addColorStop(1,"rgb(226,220,208)");ctx.fillStyle=g;ctx.fillRect(sx,-590,34,590);
    ctx.strokeStyle="rgba(120,108,92,0.25)";ctx.lineWidth=1.5;for(let yy=-570;yy<0;yy+=38){ctx.beginPath();ctx.moveTo(sx,yy);ctx.lineTo(sx+34,yy);ctx.stroke();}}
  // the front's left part, still whole: plastered stone with its windows, torn off where it's cut away
  const cut=yy=>-150+40*Math.sin(yy*0.05)+18*Math.sin(yy*0.13+1)+(yy+580)*0.08;
  ctx.beginPath();ctx.moveTo(-266,0);ctx.lineTo(-266,-580);for(let yy=-580;yy<=0;yy+=20)ctx.lineTo(cut(yy),yy);ctx.closePath();
  g=ctx.createLinearGradient(-266,0,-100,0);g.addColorStop(0,"rgb(226,218,202)");g.addColorStop(1,"rgb(240,234,222)");ctx.fillStyle=g;ctx.fill();
  ctx.save();ctx.clip();for(let f=0;f<4;f++){const wy=C.floors[f+1]+32;ctx.fillStyle="rgb(232,226,214)";ctx.fillRect(-232,wy-8,72,104);ctx.fillStyle="rgb(86,80,76)";ctx.fillRect(-224,wy,56,88);ctx.fillStyle="rgba(255,255,255,0.18)";ctx.fillRect(-224,wy,14,88);}ctx.restore();
  ctx.strokeStyle="rgba(150,140,124,0.9)";ctx.lineWidth=3;ctx.beginPath();for(let yy=-580;yy<=0;yy+=20)yy===-580?ctx.moveTo(cut(yy),yy):ctx.lineTo(cut(yy),yy);ctx.stroke();
  // the roof, whole, and the ground under the house
  ag_soft(ctx,cc=>{cc.moveTo(-322,-576);cc.lineTo(-250,-676);cc.lineTo(250,-676);cc.lineTo(322,-576);cc.closePath();},HWC.roof,HWC.roofHi,200,-660,300,"rgba(80,40,20,0.3)",10);
  ctx.fillStyle="rgba(80,50,30,0.25)";for(let i=1;i<6;i++){const yy=-576-i*16.6;ctx.fillRect(-322+i*12,yy,644-i*24,2);}
  ctx.fillStyle="rgb(196,188,172)";ctx.fillRect(-330,0,660,26);ctx.restore();}

/* ---------------------------------------------------------------- the street where the house stands (the place "hwStreet"), and the three houses in a row ("hwRow") */
function hw_paintStreet(c){hw_sky(c,[184,200,214],[238,232,220],H,[1700,120],1);
  // the neighbours at the edges, houses of the same kind and size as the one cut open: four floors of plastered stone, a band at each
  // floor, the same windows over doors at the street, and a terracotta roof sloping down towards it; each runs on past the frame
  for(const [x0,x1,col,dir] of [[0,440,HWC.ochre,1],[1480,W,HWC.rose,-1]]){const yb=836,ye=yb-580,yr=yb-664;
    let g=c.createLinearGradient(x0,0,x1,0);g.addColorStop(0,rgba(mix(col,HWC.wallSh,0.22),1));g.addColorStop(1,rgba(col,1));c.fillStyle=g;c.fillRect(x0,ye,x1-x0,yb-ye);
    c.fillStyle="rgba(150,136,116,0.2)";for(let f=1;f<4;f++)c.fillRect(x0,yb-145*f-5,x1-x0,7);
    const xs=[];if(dir>0)for(let wx=x1-140;wx>x0-72;wx-=124)xs.push(wx);else for(let wx=x0+68;wx<x1;wx+=124)xs.push(wx);
    for(const wx of xs)for(let f=0;f<4;f++){const wy=yb-145*(f+1)+32,top=f?wy:yb-122,h=f?88:122;
      c.fillStyle="rgb(234,228,216)";c.fillRect(wx-8,top-8,72,h+8+(f?8:0));c.fillStyle=f?"rgb(92,86,82)":"rgb(104,86,70)";c.fillRect(wx,top,56,h);
      c.fillStyle="rgba(255,255,255,0.16)";c.fillRect(wx,top,12,h);}
    c.fillStyle="rgb(236,230,218)";c.fillRect(x0,ye-6,x1-x0,12);
    const ex=dir>0?x1+14:x0-14,rx=dir>0?x1-70:x0+70,far=dir>0?x0-20:x1+20;
    ag_soft(c,cc=>{cc.moveTo(far,ye);cc.lineTo(ex,ye);cc.lineTo(rx,yr);cc.lineTo(far,yr);cc.closePath();},HWC.roof,HWC.roofHi,dir>0?x1-120:x0+120,yr+10,300,"rgba(80,40,20,0.28)",10);
    c.fillStyle="rgba(80,50,30,0.22)";for(let i=1;i<5;i++){const yy=ye-i*16.6,t=i*16.6/(ye-yr),xe=lerp(ex,rx,t);c.fillRect(Math.min(far,xe),yy,Math.abs(xe-far),2);}}
  let g=c.createLinearGradient(0,836,0,H);g.addColorStop(0,"rgb(206,200,188)");g.addColorStop(1,"rgb(184,178,166)");c.fillStyle=g;c.fillRect(0,836,W,H-836);
  c.fillStyle="rgba(255,255,255,0.4)";c.fillRect(0,836,W,3);
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,34,28,0.14)");g.addColorStop(0.5,"rgba(40,34,28,0)");g.addColorStop(1,"rgba(255,248,232,0.12)");c.fillStyle=g;c.fillRect(0,0,W,H);}
// three houses side by side, their walls rising above the roofs; the flame is live
const HW_ROW={x0:300,house:400,wall:30,eaves:380,ridge:300,top:258,ground:860};
function hw_paintRow(c){hw_sky(c,[184,200,214],[238,232,220],H,[1700,120],1);const R_=HW_ROW;
  let g=c.createLinearGradient(0,R_.ground,0,H);g.addColorStop(0,"rgb(206,200,188)");g.addColorStop(1,"rgb(184,178,166)");c.fillStyle=g;c.fillRect(0,R_.ground,W,H-R_.ground);
  for(let i=0;i<3;i++){const x0=R_.x0+R_.wall+i*(R_.house+R_.wall),x1=x0+R_.house,col=[HWC.wall,HWC.ochre,HWC.rose][i];
    c.fillStyle=rgba(col,1);c.fillRect(x0,R_.eaves,R_.house,R_.ground-R_.eaves);
    for(let f=0;f<3;f++)for(let j=0;j<3;j++){const wx=x0+46+j*124,wy=R_.eaves+46+f*150;c.fillStyle="rgb(232,226,214)";c.fillRect(wx-8,wy-8,76,112);c.fillStyle="rgb(90,84,80)";c.fillRect(wx,wy,60,96);c.fillStyle="rgba(255,255,255,0.2)";c.fillRect(wx,wy,14,96);}
    ag_soft(c,cc=>{cc.moveTo(x0,R_.eaves+2);cc.lineTo(x0,R_.ridge);cc.lineTo(x1,R_.ridge);cc.lineTo(x1,R_.eaves+2);cc.closePath();},HWC.roof,HWC.roofHi,x1-60,R_.ridge+10,260,"rgba(80,40,20,0.25)",8);
    c.fillStyle="rgba(80,50,30,0.22)";for(let k=1;k<5;k++)c.fillRect(x0,R_.ridge+k*16,R_.house,2);}
  for(let i=0;i<4;i++){const wx=R_.x0+i*(R_.house+R_.wall);ag_soft(c,cc=>cc.rect(wx,R_.top,R_.wall,R_.ground-R_.top),[214,206,192],[240,236,226],wx+24,R_.top+30,200,"rgba(80,70,56,0.3)",6);
    c.fillStyle="rgb(196,188,174)";c.fillRect(wx-6,R_.top-10,R_.wall+12,12);}
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,34,28,0.14)");g.addColorStop(0.5,"rgba(40,34,28,0)");g.addColorStop(1,"rgba(255,248,232,0.12)");c.fillStyle=g;c.fillRect(0,0,W,H);}
// one flame: a tongue of fire on a roof at (x, y), h tall, flickering; the fire's own colour
function hw_flame(ctx,x,y,h,tt,seed,a){if(a<=0||h<=1)return;const fl=0.86+0.14*Math.sin(tt*9+seed*3)*Math.sin(tt*5.3+seed),hh=h*fl,sw=7*Math.sin(tt*6+seed*2),w=h*0.42;
  ctx.save();ctx.globalAlpha*=a;let g=ctx.createRadialGradient(x,y-hh*0.4,2,x,y-hh*0.4,hh*1.4);g.addColorStop(0,rgba(HWC.fire,0.35));g.addColorStop(1,rgba(HWC.fire,0));ctx.fillStyle=g;ctx.fillRect(x-hh*1.4,y-hh*1.8,hh*2.8,hh*2.8);
  const tongue=(ww,hh2,col)=>{ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(x-ww/2,y);ctx.bezierCurveTo(x-ww/2,y-hh2*0.5,x+sw*0.5-ww*0.2,y-hh2*0.7,x+sw,y-hh2);ctx.bezierCurveTo(x+sw*0.4+ww*0.25,y-hh2*0.65,x+ww/2,y-hh2*0.4,x+ww/2,y);ctx.closePath();ctx.fill();};
  tongue(w,hh,rgba(HWC.fire,0.92));tongue(w*0.55,hh*0.62,rgba(HWC.fireHi,0.95));ctx.restore();}
// the fire on the first house's roof: it spreads from u0 along the roof, and stops at the wall
function hw_roofFire(ctx,tt,t0,a){const R_=HW_ROW,x0=R_.x0+R_.wall+40,x1=R_.x0+R_.wall+R_.house-26;for(let i=0;i<8;i++){const fx=lerp(x0,x1,i/7),g=ag_eo((tt-t0-i*0.28)/0.9);if(g<=0)continue;
  hw_flame(ctx,fx,R_.ridge+18+(i%2)*14,lerp(10,70+18*hash(i,4),g),tt,i,a);}}

/* ---------------------------------------------------------------- a desk (the place "hwDesk"), the sheet of questions, the map and its letters, three parishes' answers */
function hw_paintDesk(c){const R=ag_rnd(41);for(let y=0;y<H;y+=180){const t=R();c.fillStyle=rgba(mix([150,114,82],[176,138,100],t),1);c.fillRect(0,y,W,180);
    c.strokeStyle="rgba(80,54,34,0.2)";c.lineWidth=2;for(let k=0;k<8;k++){const yy=y+10+R()*160;c.beginPath();c.moveTo(0,yy);for(let x=0;x<=W;x+=60)c.lineTo(x,yy+5*Math.sin(x*0.005+k*2));c.stroke();}
    c.fillStyle="rgba(50,32,20,0.4)";c.fillRect(0,y+178,W,2);}
  const g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(30,22,14,0.28)");g.addColorStop(0.5,"rgba(30,22,14,0)");g.addColorStop(1,"rgba(255,246,226,0.16)");c.fillStyle=g;c.fillRect(0,0,W,H);}
// a sheet of the period's paper, x, y its top left, w by h, turned r; its shadow on the desk
function hw_paper(ctx,x,y,w,h,r){ctx.translate(x+w/2,y+h/2);ctx.rotate(r||0);ctx.translate(-w/2,-h/2);
  ctx.save();ctx.shadowColor="rgba(40,26,14,0.35)";ctx.shadowBlur=26;ctx.shadowOffsetX=-8;ctx.shadowOffsetY=14;ctx.fillStyle=rgba(HWC.paper,1);ctx.fillRect(0,0,w,h);ctx.restore();
  const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,"rgba(255,255,248,0.3)");g.addColorStop(1,"rgba(170,140,96,0.16)");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);}
// the sheet of thirteen questions: its heading and four of its lines, each writing itself as p[i] goes from 0 to 1; the others faint rules
const HW_Q=[["1","When did it begin, and how long did it last?"],["3","How many houses were ruined?"],["5","What was seen in the sea?"],["10","Had there been another before?"]];
function hw_sheet(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const h=540;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,o.k));
  hw_paper(ctx,x,y,w,h,o.r||-0.012);ag_T(ctx,"13 QUESTIONS",44,74,{w:700,size:30,ls:4,col:HWC.ink});ctx.fillStyle=rgba(HWC.ink,0.35);ctx.fillRect(44,96,w-88,2);
  HW_Q.forEach(([n,q],i)=>{const ly=166+i*96,p=o.p?clamp(o.p[i],0,1):1;ctx.fillStyle=rgba(HWC.ink,0.14);ctx.fillRect(44,ly+16,w-88,2);if(p<=0)return;
    ctx.save();ctx.beginPath();ctx.rect(30,ly-50,(w-30)*p+10,80);ctx.clip();ag_T(ctx,n,44,ly,{w:700,size:32,col:HWC.ink});ag_T(ctx,q,112,ly,{w:600,size:32,col:HWC.ink});ctx.restore();});
  ctx.restore();}
// the sheet carried across the cut from the minister's desk to the parish: at the cut just where the desk shot leaves it (at 190, 200,
// as wide, under that shot's camera, which ends 3% closer about the frame's centre), then gliding in 1.6 s to the priest's side
function hw_sheetAcross(ctx,tt,t0,o){const u=ag_sine((tt-t0)/1.6),k=lerp(1.03,1,u);ctx.save();
  ctx.translate(lerp(960+(190-960)*1.03,90,u),lerp(540+(200-540)*1.03,150,u));ctx.scale(k,k);hw_sheet(ctx,0,0,820,o);ctx.restore();}
// the map of Portugal: its outline (longitude, latitude), its parishes as dots, Lisbon ringed; letters out to them (o.out 0 to 1) and back (o.back)
const HW_PT=[[-8.87,41.87],[-8.6,42.05],[-8.2,42.15],[-7.9,41.92],[-7.4,41.86],[-7.2,41.98],[-6.85,41.95],[-6.55,41.67],[-6.19,41.58],[-6.33,41.4],[-6.69,41.2],[-6.93,41.02],
  [-6.8,40.85],[-6.86,40.55],[-6.81,40.34],[-7.0,40.18],[-6.87,40.0],[-7.02,39.68],[-7.33,39.6],[-7.5,39.44],[-7.25,39.25],[-7.12,38.98],[-7.32,38.72],[-7.27,38.44],[-7.0,38.2],
  [-7.1,38.0],[-7.3,37.88],[-7.5,37.6],[-7.45,37.2],[-7.9,37.0],[-8.3,37.08],[-8.62,37.12],[-8.99,37.02],[-8.79,37.4],[-8.8,37.9],[-8.88,38.3],[-9.19,38.42],[-9.12,38.6],
  [-9.3,38.67],[-9.5,38.78],[-9.42,39.08],[-9.35,39.36],[-9.05,39.65],[-8.88,40.1],[-8.75,40.6],[-8.67,41.1],[-8.78,41.5],[-8.87,41.87]];
const HW_LIS=[-9.14,38.72];
function hw_inPT(lon,lat){let ins=false;for(let i=0,j=HW_PT.length-1;i<HW_PT.length;j=i++){const [xi,yi]=HW_PT[i],[xj,yj]=HW_PT[j];if(((yi>lat)!==(yj>lat))&&(lon<(xj-xi)*(lat-yi)/(yj-yi)+xi))ins=!ins;}return ins;}
const HW_PARISH=(()=>{const R=ag_rnd(1756),d=[];let n=0;while(d.length<46&&n<4000){n++;const lon=-9.5+R()*3.3,lat=37+R()*5.1;if(hw_inPT(lon,lat)&&Math.hypot(lon-HW_LIS[0],lat-HW_LIS[1])>0.3)d.push([lon,lat,R()]);}return d;})();
function hw_map(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const k=96,w=440,h=760,P=q=>[x+60+(q[0]+9.6)*k,y+86+(42.25-q[1])*k*1.3];
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,o.k));ctx.save();hw_paper(ctx,x,y,w,h,0.01);ctx.restore();
  ctx.fillStyle="rgba(150,130,96,0.14)";ctx.beginPath();HW_PT.forEach((q,i)=>{const p=P(q);i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);});ctx.closePath();ctx.fill();
  ctx.strokeStyle=rgba(HWC.ink,0.75);ctx.lineWidth=3;ctx.lineJoin="round";ctx.stroke();
  ag_T(ctx,"Portugal",x+w-36,y+70,{w:700,size:32,col:HWC.ink,align:"right"});
  for(const q of HW_PARISH){const p=P(q);ctx.fillStyle=rgba(HWC.ink,0.8);ctx.beginPath();ctx.arc(p[0],p[1],4.5,0,TAU);ctx.fill();}
  const L=P(HW_LIS);ctx.strokeStyle=rgba(HWC.ink,0.9);ctx.lineWidth=3;ctx.beginPath();ctx.arc(L[0],L[1],11,0,TAU);ctx.stroke();ctx.fillStyle=rgba(HWC.ink,1);ctx.beginPath();ctx.arc(L[0],L[1],4.5,0,TAU);ctx.fill();
  // the letters: small folded sheets, out along a curve to each parish, then back
  const letter=(px,py,al)=>{if(al<=0)return;ctx.save();ctx.globalAlpha*=al;ctx.fillStyle="rgb(250,246,234)";ctx.strokeStyle=rgba(HWC.ink,0.6);ctx.lineWidth=1.5;ctx.fillRect(px-12,py-8,24,16);ctx.strokeRect(px-12,py-8,24,16);
    ctx.beginPath();ctx.moveTo(px-12,py-8);ctx.lineTo(px,py+1);ctx.lineTo(px+12,py-8);ctx.stroke();ctx.restore();};
  for(const [dir,v] of [[1,o.out||0],[-1,o.back||0]]){if(v<=0||v>=1.6)continue;HW_PARISH.forEach((q,i)=>{const u=clamp(v*1.6-q[2]*0.6,0,1);if(u<=0||u>=1)return;const T_=P(q),s=dir>0?u:1-u,e=ag_sine(s);
    const mx=(L[0]+T_[0])/2+(T_[1]-L[1])*0.2,my=(L[1]+T_[1])/2-(T_[0]-L[0])*0.2,px=lerp(lerp(L[0],mx,e),lerp(mx,T_[0],e),e),py=lerp(lerp(L[1],my,e),lerp(my,T_[1],e),e);letter(px,py,Math.sin(Math.PI*u)*1.6);});}
  ctx.restore();}
// a line of handwriting in iron-gall ink: loops along a line, broken into words; hand h {f, size, slant}
function hw_scribble(ctx,x,y,w,seed,hd){ctx.save();ctx.translate(x,y);ctx.transform(1,0,-hd.slant,1,0,0);ctx.strokeStyle=rgba(HWC.ink,0.85);ctx.lineWidth=2.2;ctx.lineCap="round";ctx.lineJoin="round";
  let on=false;ctx.beginPath();for(let u=0;u<=w;u+=2.5){const gap=hash(Math.floor(u/(38*hd.size))+seed*31,seed)<0.18;if(gap){on=false;continue;}
    const yy=-hd.size*(0.3+0.7*Math.abs(Math.sin(u*0.21*hd.f+seed)))*(0.5+0.5*hash(Math.floor(u/9)+seed,7));if(!on){ctx.moveTo(u,yy);on=true;}else ctx.lineTo(u,yy);}ctx.stroke();ctx.restore();}
// three parishes' answers side by side on the desk: the same numbered questions, in three hands
const HW_HANDS=[{f:1,size:13,slant:0.28},{f:1.4,size:10,slant:0.08},{f:0.8,size:15,slant:0.4}];
function hw_answers(ctx,tt,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;[[190,140,-0.03],[750,120,0.012],[1310,150,0.028]].forEach(([x,y,r],i)=>{const k=ag_spr(tt,(o.t0||0)+i*0.25);if(k<=0)return;
  ctx.save();ctx.globalAlpha*=a*clamp(k*2,0,1);ag_about(ctx,x+210,y+300,lerp(0.8,1,k));hw_paper(ctx,x,y,420,620,r);
  hw_scribble(ctx,40,64,300,i*7+1,HW_HANDS[i]);
  ["1","2","3","4","5"].forEach((n,j)=>{const ly=146+j*98;ag_T(ctx,n,36,ly,{w:700,size:32,col:HWC.ink});hw_scribble(ctx,80,ly-4,300-(j%2)*60,i*13+j,HW_HANDS[i]);hw_scribble(ctx,80,ly+38,220+(j%3)*40,i*17+j+5,HW_HANDS[i]);});
  ctx.restore();});}

/* ---------------------------------------------------------------- a parish priest's room (the place "hwParish"), and the archive today ("hwArchive")
   The priest writes his answers at a table: the table is drawn first and he is cut at its back edge, so the hand that writes, which
   holds the quill, shows over the paper. */
function hw_paintParish(c){let g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgb(212,206,194)");g.addColorStop(1,"rgb(238,234,224)");c.fillStyle=g;c.fillRect(0,0,W,H);
  ag_soft(c,cc=>ag_rect(cc,1620,170,240,360,6),[206,214,220],[246,248,244],1810,200,200,"rgba(60,60,70,0.35)",16);
  c.strokeStyle="rgba(120,100,80,0.5)";c.lineWidth=6;c.beginPath();c.moveTo(1740,170);c.lineTo(1740,530);c.moveTo(1620,350);c.lineTo(1860,350);c.stroke();
  g=c.createLinearGradient(1620,0,800,0);g.addColorStop(0,"rgba(255,250,236,0.3)");g.addColorStop(1,"rgba(255,250,236,0)");c.fillStyle=g;c.beginPath();c.moveTo(1620,170);c.lineTo(800,420);c.lineTo(800,1000);c.lineTo(1620,530);c.closePath();c.fill();
  c.fillStyle="rgb(132,104,80)";c.fillRect(0,700,W,12);
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,34,28,0.16)");g.addColorStop(0.5,"rgba(40,34,28,0)");c.fillStyle=g;c.fillRect(0,0,W,H);}
function hw_paintArchive(c){let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgb(228,228,224)");g.addColorStop(1,"rgb(210,210,206)");c.fillStyle=g;c.fillRect(0,0,W,H);
  // shelves of grey archive boxes along the back wall
  for(let r=0;r<4;r++){const y=120+r*150;c.fillStyle="rgb(170,172,170)";c.fillRect(80,y+128,1760,10);for(let x=96;x<1830;){const bw=70+hash(x+r*13,3)*40;
    c.fillStyle=rgba(mix([196,196,192],[214,212,206],hash(x,r)),1);c.fillRect(x,y+20,bw-6,108);c.fillStyle="rgba(255,255,255,0.5)";c.fillRect(x+bw/2-16,y+40,26,16);x+=bw;}}
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,34,28,0.12)");g.addColorStop(0.5,"rgba(40,34,28,0)");g.addColorStop(1,"rgba(255,250,240,0.1)");c.fillStyle=g;c.fillRect(0,0,W,H);}
// a table seen from the front and a little above: its top from back edge yb to front edge yf, between x0 and x1
function hw_table(ctx,x0,x1,yb,yf,col){col=col||[176,140,104];const d=(yf-yb)*0.3;ag_floorShadow(ctx,(x0+x1)/2+AG.sdx*3,yf+120,(x1-x0)*0.55,30,0.2);
  let g=ctx.createLinearGradient(0,yb,0,yf);g.addColorStop(0,rgba(ag_lt(col,0.18),1));g.addColorStop(1,rgba(col,1));ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x0+d,yb);ctx.lineTo(x1-d,yb);ctx.lineTo(x1,yf);ctx.lineTo(x0,yf);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba(ag_dk(col,0.35),1);ctx.fillRect(x0,yf,x1-x0,22);ctx.fillStyle=rgba(ag_dk(col,0.5),1);ctx.fillRect(x0+30,yf+22,26,H);ctx.fillRect(x1-56,yf+22,26,H);}
// the quill in the priest's hand, in figure space: its feather leaning back over his wrist
function hw_quill(c,h){if(!h||!h.near)return;const [x,y]=h.near;c.save();c.strokeStyle="rgb(70,60,52)";c.lineWidth=3;c.lineCap="round";c.beginPath();c.moveTo(x+40,y+24);c.lineTo(x-20,y-92);c.stroke();
  // a short feather, warm grey, its barbs drawn in: it stops well short of the shoulder
  const vane=cc=>{cc.moveTo(x+2,y-46);cc.bezierCurveTo(x-18,y-62,x-34,y-92,x-34,y-124);cc.bezierCurveTo(x-18,y-104,x-2,y-84,x+10,y-60);cc.closePath();};
  ag_soft(c,vane,[196,186,170],[226,218,204],x-10,y-90,50,"rgba(60,50,40,0.5)",3);
  c.strokeStyle="rgba(110,96,80,0.55)";c.lineWidth=1.5;for(let i=1;i<5;i++){const u=i/5,px=lerp(x+4,x-30,u),py=lerp(y-52,y-118,u);c.beginPath();c.moveTo(px,py);c.lineTo(px-10,py+6);c.stroke();}c.restore();}
// the papers on a table: a few sheets, slightly askew, at (x, y), and the inkwell beside
function hw_papers(ctx,x,y,o){o=o||{};ctx.save();for(let i=0;i<(o.n||3);i++){ctx.save();ctx.translate(x+i*4,y-i*3);ctx.rotate(-0.04+i*0.03);ctx.fillStyle=rgba(mix(HWC.paper,HWC.paperDk,i*0.3),1);ctx.fillRect(-120,-36,240,72);
    if(i===(o.n||3)-1){ctx.strokeStyle=rgba(HWC.ink,0.45);ctx.lineWidth=1.5;for(let l=0;l<4;l++){ctx.beginPath();ctx.moveTo(-100,-20+l*13);ctx.lineTo(80-l*12,-20+l*13);ctx.stroke();}}ctx.restore();}
  if(o.ink){ctx.fillStyle="rgb(40,36,38)";ctx.beginPath();ctx.ellipse(x+190,y-6,22,10,0,0,TAU);ctx.fill();ctx.fillRect(x+170,y-34,40,28);ctx.fillStyle="rgba(255,255,255,0.25)";ctx.fillRect(x+196,y-30,6,22);}ctx.restore();}

/* ---------------------------------------------------------------- the lower town today (the places "hwToday", and "hwEvening" at evening)
   A long straight street of the rebuilt town in one-point perspective: the same plain fronts on both sides, four floors of windows
   over arcaded shops, iron balconies; the sky at the street's far end. The fronts on the left take the light. People of today are live. */
function hw_paintToday(c,o){o=o||{};const eve=!!o.eve,VP=[960,470],f=900,h=1.6,P=(X,Y,Z)=>[VP[0]+X*f/Z,VP[1]+(h-Y)*f/Z];
  hw_sky(c,eve?[132,136,168]:[176,200,220],eve?[246,204,166]:[236,232,222],H,eve?[960,470]:[1500,100],eve?1.3:0.8);
  const quad=(a,b,cc,d,col)=>{c.fillStyle=col;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(cc[0],cc[1]);c.lineTo(d[0],d[1]);c.closePath();c.fill();};
  const Z0=2.3,Z1=170;
  // the paving, running away from us
  let g=c.createLinearGradient(0,P(0,0,Z1)[1],0,H);g.addColorStop(0,eve?"rgb(196,176,156)":"rgb(214,208,196)");g.addColorStop(1,eve?"rgb(168,150,134)":"rgb(190,184,172)");
  c.fillStyle=g;c.fillRect(0,P(0,0,Z1)[1],W,H);c.strokeStyle="rgba(120,110,96,0.22)";c.lineWidth=2;for(let X=-9;X<=9;X+=1.5){const a=P(X,0,Z0),b=P(X,0,Z1);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();}
  for(const sd of [-1,1]){const X=sd*9,lit=sd<0,wall=eve?(lit?[236,196,150]:[170,150,140]):(lit?[240,226,184]:[198,188,160]);
    quad(P(X,0,Z0),P(X,19,Z0),P(X,19,Z1),P(X,0,Z1),rgba(wall,1));
    for(let Z=4;Z<Z1;Z+=4.2){// a bay: the shop's arch, then four floors of windows with balconies
      const sh=P(X,0,Z+0.6),st=P(X,3.2,Z+0.6),sh2=P(X,0,Z+3),st2=P(X,3.2,Z+3);quad(sh,st,st2,sh2,rgba(ag_dk(wall,0.42),1));
      for(let fl=0;fl<4;fl++){const y0=4.4+fl*3.4;quad(P(X,y0,Z+1.2),P(X,y0+2,Z+1.2),P(X,y0+2,Z+2.6),P(X,y0,Z+2.6),rgba(ag_dk(wall,0.55),1));
        const b0=P(X,y0+0.05,Z+0.9),b1=P(X,y0+0.05,Z+2.9);c.strokeStyle=rgba(ag_dk(wall,0.7),0.8);c.lineWidth=Math.max(1,30/Z);c.beginPath();c.moveTo(b0[0],b0[1]);c.lineTo(b1[0],b1[1]);c.stroke();}}
    const r0=P(X,19,Z0),r1=P(X,19,Z1);c.strokeStyle=rgba(ag_dk(wall,0.25),1);c.lineWidth=12;c.beginPath();c.moveTo(r0[0],r0[1]);c.lineTo(r1[0],r1[1]);c.stroke();}
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,eve?"rgba(255,190,120,0.1)":"rgba(255,248,232,0.08)");g.addColorStop(0.5,"rgba(40,34,28,0)");g.addColorStop(1,"rgba(40,34,28,0.16)");c.fillStyle=g;c.fillRect(0,0,W,H);}
// two people of today walking along it, slowly
function hw_walkers(x,tt){const b=i=>2.2*Math.sin(tt*3.2+i*1.7);ag_person(x,HW_P.walkA,640+tt*9,808+b(0),0.55,{t:tt,gaze:[4,0]});ag_person(x,HW_P.walkB,1330-tt*8,836+b(1),0.5,{t:tt+0.9,flip:true,gaze:[4,0]});}

/* ---------------------------------------------------------------- the places, painted once */
AG_PLACES.hwCity=c=>hw_paintCity(c,{});
AG_PLACES.hwRuin=c=>hw_paintCity(c,{ruin:true});
AG_PLACES.hwDusk=c=>hw_paintCity(c,{ruin:true,light:"dusk"});
AG_PLACES.hwGrey=c=>hw_paintCity(c,{ruin:true,light:"grey"});
AG_PLACES.hwChurch=c=>hw_paintChurch(c);
AG_PLACES.hwDraft=c=>hw_paintDraft(c);
AG_PLACES.hwPlanTable=c=>hw_paintPlanTable(c);
AG_PLACES.hwStreet=c=>hw_paintStreet(c);
AG_PLACES.hwRow=c=>hw_paintRow(c);
AG_PLACES.hwDesk=c=>hw_paintDesk(c);
AG_PLACES.hwParish=c=>hw_paintParish(c);
AG_PLACES.hwToday=c=>hw_paintToday(c,{});
AG_PLACES.hwEvening=c=>hw_paintToday(c,{eve:true});
AG_PLACES.hwArchive=c=>hw_paintArchive(c);
