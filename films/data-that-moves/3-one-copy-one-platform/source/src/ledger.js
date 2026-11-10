/* ===== One copy, one platform: Amsterdam's ledger =====
   What only this film draws of Amsterdam around 1600, each name with the prefix oc_ (or OC_): the quay at dusk, a merchant's counting
   table and the exchange bank's room in the town hall, painted once as places; the coins, a coin bag, a balance, the bank's ledger and
   the bills it paid, drawn live so they stay sharp however close the camera comes; and the people of 1609, dressed for their time.
   Nobody of the past is drawn as a likeness, and nothing here is a copy of a painting. The night and its light are the module's
   (look.js): lamplight on wood and paper, the navy of the map everywhere else, and the module's colours only where they mean something
   (a payment moving is data moving, light blue; what the ledger shows each merchant holds is agreed, gold). */

const OC={paper:[236,224,196],paperDk:[204,186,150],paperEdge:[176,156,120],ink:[52,38,28],
  wood:[78,54,36],woodDk:[40,28,20],woodLt:[122,88,58],cloth:[30,56,48],clothDk:[18,36,30],
  silver:[204,208,214],gold:[226,186,92],copper:[190,122,82],brass:[206,166,92],
  lamp:[255,196,120],window:[255,200,126],stone:[30,34,50],stoneLt:[46,52,72],linen:[196,178,146],seal:[128,46,40]};

/* ---------------------------------------------------------------- small helpers */
// draw in the frame, whatever the camera is doing
function oc_scr(ctx,S,fn){ctx.save();setScreen(ctx,S);fn();ctx.restore();}
// a value worked out once per chapter (the times of its words)
function oc_once(sc,k,f){const m=sc.__oc||(sc.__oc={});return m[k]||(m[k]=f());}
// soft shadows without a blur filter, which paints slowly every frame: an ellipse of fading dark, and a rectangle in a few soft steps
function oc_shadowE(ctx,x,y,rx,ry,a){ctx.save();ctx.translate(x,y);ctx.scale(1,ry/rx);const g=ctx.createRadialGradient(0,0,rx*0.3,0,0,rx*1.15);
  g.addColorStop(0,"rgba(0,0,0,"+a+")");g.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,rx*1.15,0,TAU);ctx.fill();ctx.restore();}
function oc_shadowR(ctx,x,y,w,h,a,sp){for(let i=3;i>=1;i--){const d=sp*i/3;ctx.fillStyle="rgba(0,0,0,"+(a/3.2)+")";rr(ctx,x-d,y-d,w+2*d,h+2*d,d+2);ctx.fill();}}
// lines of handwriting as decoration: wavy strokes in rows inside a box, p (0 to 1) how much is written; too small to read, on purpose
function oc_hand(ctx,x,y,w,rows,pitch,p,o){o=o||{};const R=ag_rnd(o.seed||5),n=Math.min(rows,Math.max(0,p*rows));if(n<=0)return;ctx.save();
  ctx.strokeStyle=rgba(o.col||OC.ink,o.a==null?0.75:o.a);ctx.lineWidth=o.lw||2.2;ctx.lineCap="round";ctx.lineJoin="round";
  for(let r=0;r<Math.ceil(n);r++){const f=Math.min(1,n-r),yy=y+r*pitch,len=w*(r===rows-1?0.55:0.9+R()*0.1)*f;let xx=x;
    while(xx<x+len){const wl=10+R()*34;ctx.beginPath();for(let k=0;k<=wl;k+=3){const X=xx+k,Y=yy+Math.sin((X+r*7)*0.55)*pitch*0.12-(R()<0.12?pitch*0.22:0);if(X>x+len)break;k?ctx.lineTo(X,Y):ctx.moveTo(X,Y);}
      ctx.stroke();xx+=wl+9+R()*6;}}
  ctx.restore();}
// a soft pool of light
function oc_pool(c,x,y,rx,ry,col,a){c.save();c.translate(x,y);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,rgba(col,a));g.addColorStop(0.5,rgba(col,a*0.4));
  g.addColorStop(1,rgba(col,0));c.fillStyle=g;c.fillRect(-rx,-rx,rx*2,rx*2);c.restore();}
// the place and year at the top left, in the frame
function oc_where(ctx,S,text,a){if(a<=0.004)return;oc_scr(ctx,S,()=>md_tag(ctx,96,100,text,{col:MD.ink,a}));}

/* ---------------------------------------------------------------- the people of 1609
   Specs for md_person. Their dress is Amsterdam's around 1600: a dark doublet buttoned close down the front (top.paint), a white ruff
   (drawn as film 2.3's, over the neck, the head left in front of it), and for one a moustache and a small pointed beard. No hat: the
   tall hats of the time would reach past the head's picture. A ruff is drawn after the person, so oc_person lights it as md_person lights
   the person, and lays the two on the frame as one picture. */
function oc_doubletFront(btn){return (c,P)=>{c.save();ag_shape(c,AG_F.torso);c.clip();
  // the doublet's front seam and its small round buttons, close together, and the seam at the waist
  c.strokeStyle=rgba(ag_dk(P.top.c,0.45),0.8);c.lineWidth=2.4;c.beginPath();c.moveTo(312,612);c.bezierCurveTo(316,760,322,900,326,1100);c.stroke();
  for(let i=0;i<11;i++){const u=i/10,y=lerp(640,1000,u),x=lerp(316,325,u)+3;ag_soft(c,cc=>cc.arc(x,y,4.6,0,TAU),btn,ag_lt(btn,0.5),x+2,y-2,6,null);}
  c.strokeStyle=rgba(ag_dk(P.top.c,0.5),0.5);c.lineWidth=3;c.beginPath();c.moveTo(118,1010);c.quadraticCurveTo(270,1030,412,1006);c.stroke();
  c.restore();};}
// a moustache and a small pointed beard
function oc_pointed(col){return (c,P)=>{
  ag_soft(c,cc=>{cc.moveTo(352,476);cc.bezierCurveTo(358,468,374,466,388,470);cc.bezierCurveTo(394,466,398,460,400,456);cc.bezierCurveTo(400,466,394,474,386,476);
    cc.bezierCurveTo(374,476,362,478,352,480);cc.closePath();},col,ag_lt(col,0.3),380,468,20,null);
  ag_soft(c,cc=>{cc.moveTo(338,518);cc.bezierCurveTo(346,526,360,528,370,520);cc.bezierCurveTo(368,536,360,550,352,558);cc.bezierCurveTo(344,546,338,532,338,518);cc.closePath();},
    col,ag_lt(col,0.3),360,526,24,"rgba(0,0,0,0.3)",4);};}
/* a ruff: a wheel of pleated white linen round the neck, seen nearly edge on, over the doublet's high collar: its top, foreshortened and
   folded, and its rim with the figure-of-eight pleats, both scalloped; the head stays in front of it, and it hides the neck (film 2.3's) */
function oc_ruff(c,P,big,o){const cx=big?304:302,cy=big?531:533,rx=big?120:100,ry=big?14:12,th=big?28:24,gc=P.top.c,nP=big?26:22;
  c.save();c.beginPath();c.rect(-200,-200,1100,1500);oc_headPath(c,o);c.clip("evenodd");
  // the doublet's standing collar under it
  const col=cc=>{cc.moveTo(cx-78,cy);cc.bezierCurveTo(cx-80,cy+20,cx-84,cy+th,cx-88,cy+th+12);cc.bezierCurveTo(cx-40,cy+th+22,cx+40,cy+th+24,cx+74,cy+th+10);
    cc.bezierCurveTo(cx+70,cy+th,cx+66,cy+20,cx+64,cy);cc.closePath();};
  ag_soft(c,col,ag_dk(gc,0.1),ag_lt(gc,0.18),cx+50,cy+40,90,"rgba(0,0,0,0.35)",8);
  // its soft shadow on the doublet, a flattened glow of dark (no blur filter: it paints every frame)
  c.save();c.translate(cx-6,cy+th+16);c.scale(1,(ry+14)/rx);let g=c.createRadialGradient(0,0,rx*0.55,0,0,rx*1.02);g.addColorStop(0,"rgba(22,16,12,0.3)");g.addColorStop(1,"rgba(22,16,12,0)");
  c.fillStyle=g;c.beginPath();c.arc(0,0,rx*1.02,0,TAU);c.fill();c.restore();
  // the pleats round the front, closer together toward the sides as the ring turns away
  const fx=k=>cx-rx*Math.cos(Math.PI*k/nP),ey=(x,dy)=>{const u=(x-cx)/rx;return cy+dy+Math.sqrt(Math.max(0,1-u*u))*ry;};
  // the band of pleats: its top edge where they fold over, its bottom edge one soft scallop to a pleat
  const band=cc=>{cc.moveTo(fx(0),cy);for(let k=1;k<=nP;k++){const x0=fx(k-1),x1=fx(k),xm=(x0+x1)/2;cc.quadraticCurveTo(xm,ey(xm,-3),x1,ey(x1,0));}
    for(let k=nP;k>=1;k--){const x0=fx(k),x1=fx(k-1),xm=(x0+x1)/2;cc.lineTo(x0,ey(x0,th));cc.quadraticCurveTo(xm,ey(xm,th+9),x1,ey(x1,th));}cc.closePath();};
  ag_shape(c,band);c.fillStyle=rgba([218,210,194],1);c.fill();
  c.save();ag_shape(c,band);c.clip();
  // each pleat a rounded tube of linen: lit on its left, in its own shadow on its right
  for(let k=0;k<nP;k++){const x0=fx(k),x1=fx(k+1);if(x1-x0<0.8)continue;g=c.createLinearGradient(x0,0,x1,0);
    g.addColorStop(0,"rgba(92,82,70,0.36)");g.addColorStop(0.28,"rgba(255,252,244,0.55)");g.addColorStop(0.55,"rgba(255,252,244,0.1)");g.addColorStop(1,"rgba(92,82,70,0.44)");
    c.fillStyle=g;c.fillRect(x0,cy-ry-8,x1-x0,th+2*ry+18);}
  g=c.createLinearGradient(0,cy,0,cy+th+ry+6);g.addColorStop(0,"rgba(255,255,255,0.1)");g.addColorStop(1,"rgba(70,62,54,0.3)");c.fillStyle=g;c.fillRect(cx-rx-4,cy-ry-8,2*rx+8,th+2*ry+20);
  c.restore();
  // the top of the ring, round the neck: the pleats seen from above, a figure of eight of folds
  const top=cc=>{cc.moveTo(cx+rx,cy);cc.ellipse(cx,cy,rx,ry,0,0,TAU);};
  ag_soft(c,top,[206,198,182],[248,244,234],cx-rx*0.3,cy-ry*0.4,rx*1.1,null,0,0.6);
  c.save();ag_shape(c,top);c.clip();
  // the folds as lobes round the ring, turned alternately to the light and away from it
  for(let k=0;k<nP*2;k++){const a0=k/(nP*2)*TAU,a1=(k+1)/(nP*2)*TAU;c.fillStyle=k%2?"rgba(255,252,244,0.2)":"rgba(96,86,74,0.2)";c.beginPath();
    c.ellipse(cx,cy,rx,ry,0,a0,a1);c.ellipse(cx,cy,rx*0.46,ry*0.46,0,a1,a0,true);c.closePath();c.fill();}
  c.lineCap="round";c.lineWidth=1.8;
  for(let k=0;k<nP*2;k++){const a=(k+0.5)/(nP*2)*TAU,ca=Math.cos(a),sa=Math.sin(a),bend=(k%2?1:-1)*rx*0.035;c.strokeStyle="rgba(112,102,90,"+(0.24+0.1*sa)+")";
    c.beginPath();c.moveTo(cx+ca*rx*0.42,cy+sa*ry*0.42);c.quadraticCurveTo(cx+ca*rx*0.72-sa*bend,cy+sa*ry*0.72,cx+ca*rx,cy+sa*ry);c.stroke();}
  c.restore();
  // the seams where the pleats turn over, along the top edge and round the bottom
  c.lineCap="round";c.strokeStyle="rgba(112,102,90,0.42)";c.lineWidth=1.6;c.beginPath();
  for(let k=1;k<nP;k++){const x0=fx(k);c.moveTo(x0,ey(x0,-1));c.lineTo(x0,ey(x0,3));}c.stroke();
  c.strokeStyle="rgba(100,90,78,0.4)";c.beginPath();for(let k=1;k<=nP;k++){const x0=fx(k-1),x1=fx(k),xm=(x0+x1)/2;if(k===1)c.moveTo(x0,ey(x0,th));c.quadraticCurveTo(xm,ey(xm,th+9),x1,ey(x1,th));}c.stroke();
  c.restore();}
// the head's outline as ag_person turns it (o.nod) and breathes it (a little less than the body), in the collar's figure space
function oc_headPath(c,o){const br=o&&o.br||0;c.save();c.translate(AG_FIG.piv[0],AG_FIG.piv[1]-br*0.3);c.rotate(o&&o.nod||0);c.translate(-AG_FIG.piv[0],-AG_FIG.piv[1]);AG_F.head(c);c.restore();}

const OC_PEOPLE={
  // a merchant of Amsterdam: a black doublet, a large ruff, a moustache and a small pointed beard
  merchant:{key:"oc-merchant",name:"A merchant",skin:[226,188,156],hair:{style:"side",c:[82,60,42]},top:{kind:"tunic",c:[34,32,38],paint:oc_doubletFront([96,90,84])},
    hat:{paint:oc_pointed([88,64,46])},ruff:"big",breath:0.26},
  // another merchant, older: a dark brown doublet, a smaller ruff, a short grey beard
  trader:{key:"oc-trader",name:"Another merchant",skin:[212,170,136],hair:{style:"cropped",c:[136,124,112]},beard:[146,134,122],top:{kind:"tunic",c:[70,52,40],paint:oc_doubletFront([150,128,96])},
    ruff:"small",breath:0.24},
  // the exchange bank's clerk, younger: a dark brown doublet, so he reads against the hall's dark wall, and a small ruff
  clerk:{key:"oc-clerk",name:"The bank's clerk",skin:[232,198,170],hair:{style:"side",c:[118,90,62]},top:{kind:"tunic",c:[76,60,50],paint:oc_doubletFront([150,126,102])},
    ruff:"small",breath:0.3}
};
/* a person of 1609: md_person, then the ruff in figure space, breathing with the body and lit as md_person lights the person (the far side
   sinks into the night, the side towards the light keeps its colour); both drawn whole, then laid on the frame at the opacity asked for */
function oc_person(ctx,who,x,y,s,o){o=o||{};const P=typeof who==="string"?OC_PEOPLE[who]:who,a=ctx.globalAlpha;if(a<0.004)return null;
  const cw=ctx.canvas.width,ch=ctx.canvas.height,m=ctx.getTransform(),[bc,bx]=ag_buf("ocWhole",cw,ch);bx.setTransform(m);
  const light=Object.assign({rim:OC.window,rimA:0.3,rimW:6,warm:0.18},o.light||{}),h=md_person(bx,P,x,y,s,Object.assign({},o,{light}));
  if(P.ruff){const t=o.t||0,br=Math.sin(t*TAU*(P.breath||1/3.6))*2.2,A=AG_FIG.anchor,[rc,rx]=ag_buf("ocRuff",cw,ch);
    rx.setTransform(m);rx.translate(x,y);rx.scale(o.flip?-s:s,s);rx.translate(-A[0],-A[1]+br);oc_ruff(rx,P,P.ruff==="big",{nod:o.nod||0,br});
    // the light, as md_person's: from in front of the face, a little above; the side away from it sinks into the navy
    const L0=Object.assign({key:[560,360],reach:780,shade:0.62},light),M=rx.getTransform(),K=[M.a*L0.key[0]+M.c*L0.key[1]+M.e,M.b*L0.key[0]+M.d*L0.key[1]+M.f],k=Math.hypot(M.a,M.b);
    rx.setTransform(1,0,0,1,0,0);rx.globalCompositeOperation="source-atop";const g=rx.createRadialGradient(K[0],K[1],0,K[0],K[1],L0.reach*k);
    g.addColorStop(0,rgba(MD.navy,0.14));g.addColorStop(0.45,rgba(MD.navy,0.14+L0.shade*0.45));g.addColorStop(1,rgba(MD.navy,Math.min(0.85,0.14+L0.shade*0.9)));rx.fillStyle=g;rx.fillRect(0,0,cw,ch);
    // and the lamplight's warmth on the linen
    rx.fillStyle="rgba(255,206,150,0.12)";rx.fillRect(0,0,cw,ch);
    rx.globalCompositeOperation="source-over";bx.setTransform(1,0,0,1,0,0);bx.drawImage(rc,0,0);}
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=a;ctx.drawImage(bc,0,0);ctx.restore();return h;}

/* ---------------------------------------------------------------- the places
   "ocQuay": Amsterdam's harbour at dusk, across the water a row of gabled houses with lit windows, ships moored before them, and the
   near quay's stones, where the merchants stand. "ocCount": a merchant's counting table under a lamp. "ocHall": the exchange bank's room
   in the town hall at night: a stone wall, two tall windows of small leaded panes, a wooden wainscot and a long table under a green cloth. */
const OC_QUAY={water:566,quay:812};
AG_PLACES.ocQuay=c=>{const R=ag_rnd(1609),wy=OC_QUAY.water,qy=OC_QUAY.quay;
  let g=c.createLinearGradient(0,0,0,wy);g.addColorStop(0,"#070c1c");g.addColorStop(0.55,"#111a33");g.addColorStop(0.86,"#262a48");g.addColorStop(1,"#3a3350");c.fillStyle=g;c.fillRect(0,0,W,wy+4);
  oc_pool(c,1180,wy-20,900,180,[255,170,120],0.16);
  for(let i=0;i<90;i++){const x=R()*W,y=R()*300,r=R()<0.1?1.6:1;c.fillStyle="rgba(220,230,255,"+(0.15+R()*0.35)+")";c.beginPath();c.arc(x,y,r,0,TAU);c.fill();}
  // the houses across the water, each with its gable: stepped, a bell or a plain point; a few windows lit
  const lit=[];let x=-30;
  while(x<W+30){const w=64+R()*64,h=150+R()*120,base=wy-6,top=base-h,kind=R(),col=mix([12,18,36],[22,26,46],R());c.fillStyle=rgba(col,1);c.beginPath();
    const gh=w*0.55;c.moveTo(x,base);c.lineTo(x,top+gh);
    if(kind<0.45){const n=4,sw=w/(2*n+1);for(let k=0;k<n;k++){const y0=top+gh-k*gh/n,y1=top+gh-(k+1)*gh/n;c.lineTo(x+k*sw,y1);c.lineTo(x+(k+1)*sw,y1);}c.lineTo(x+w-n*sw,top);
      for(let k=n-1;k>=0;k--){const y1=top+gh-(k+1)*gh/n,y0=top+gh-k*gh/n;c.lineTo(x+w-(k+1)*sw,y1);c.lineTo(x+w-k*sw,y1);c.lineTo(x+w-k*sw,y0);}}
    else if(kind<0.8){c.bezierCurveTo(x,top+gh*0.4,x+w*0.3,top+gh*0.5,x+w*0.32,top+gh*0.15);c.lineTo(x+w*0.4,top);c.lineTo(x+w*0.6,top);c.lineTo(x+w*0.68,top+gh*0.15);
      c.bezierCurveTo(x+w*0.7,top+gh*0.5,x+w,top+gh*0.4,x+w,top+gh);}
    else{c.lineTo(x+w/2,top);c.lineTo(x+w,top+gh);}
    c.lineTo(x+w,base);c.closePath();c.fill();c.strokeStyle="rgba(120,150,210,0.10)";c.lineWidth=1.5;c.stroke();
    const cols=Math.max(2,Math.floor(w/26)),rows=Math.max(2,Math.floor((h-gh*0.6)/40));
    for(let r=0;r<rows;r++)for(let q=0;q<cols;q++){const wx=x+(w-cols*26)/2+q*26+7,wy2=top+gh*0.75+r*40+8;if(wy2>base-26)continue;const on=R()<0.34;
      c.fillStyle=on?rgba(OC.window,0.55+R()*0.4):"rgba(40,52,80,0.5)";c.fillRect(wx,wy2,12,20);if(on)lit.push([wx+6,wy2+10]);}
    x+=w+2+R()*6;}
  for(const [lx,ly] of lit)oc_pool(c,lx,ly,22,22,OC.window,0.22);
  // ships moored along the far quay: hulls, masts with their yards, furled sails, rigging, a pennant
  for(const [sx,sz] of [[250,1.0],[760,1.18],[1270,0.95],[1700,1.1]]){const hb=wy+6,hl=260*sz;c.fillStyle="#070b17";c.beginPath();c.moveTo(sx-hl/2,hb-46*sz);
      c.lineTo(sx+hl/2+20*sz,hb-58*sz);c.quadraticCurveTo(sx+hl/2,hb,sx+hl/2-30*sz,hb+4);c.lineTo(sx-hl/2+20*sz,hb+4);c.quadraticCurveTo(sx-hl/2-6,hb-10,sx-hl/2,hb-46*sz);c.fill();
    c.strokeStyle="rgba(150,170,210,0.18)";c.lineWidth=1.5;c.beginPath();c.moveTo(sx-hl/2+6,hb-40*sz);c.lineTo(sx+hl/2+14*sz,hb-52*sz);c.stroke();
    const masts=[[sx-hl*0.22,300*sz],[sx+hl*0.08,360*sz],[sx+hl*0.34,250*sz]];
    for(const [mx,mh] of masts){const top=hb-50*sz-mh;c.strokeStyle="#0a0f1e";c.lineWidth=5*sz;c.beginPath();c.moveTo(mx,hb-40*sz);c.lineTo(mx,top);c.stroke();
      // its yards, each with its sail furled along it: a thin bundle, thicker in the middle
      for(const f of [0.3,0.62]){const yy=top+mh*f,yw=(78-f*36)*sz;c.lineWidth=3*sz;c.beginPath();c.moveTo(mx-yw,yy);c.lineTo(mx+yw,yy);c.stroke();
        c.fillStyle="rgba(120,118,124,0.30)";c.beginPath();c.moveTo(mx-yw*0.9,yy+1);c.quadraticCurveTo(mx,yy+11*sz,mx+yw*0.9,yy+1);c.quadraticCurveTo(mx,yy+4*sz,mx-yw*0.9,yy+1);c.fill();}
      c.strokeStyle="rgba(150,170,210,0.13)";c.lineWidth=1;c.beginPath();c.moveTo(mx,top);c.lineTo(sx-hl/2,hb-46*sz);c.moveTo(mx,top);c.lineTo(sx+hl/2+20*sz,hb-58*sz);c.stroke();
      c.fillStyle="rgba(230,214,170,0.55)";c.beginPath();c.moveTo(mx,top);c.lineTo(mx+34*sz,top+6*sz);c.lineTo(mx,top+12*sz);c.fill();}}
  // the water: dark, the windows' lights drawn down it in wavering streaks
  g=c.createLinearGradient(0,wy,0,qy);g.addColorStop(0,"#151b36");g.addColorStop(1,"#060a16");c.fillStyle=g;c.fillRect(0,wy,W,qy-wy);
  for(const [lx,ly] of lit){if(R()<0.4)continue;const len=60+R()*120;for(let k=0;k<len;k+=6){const yy=wy+8+k*1.1,ww=(6+R()*14)*(1-k/len*0.4);c.fillStyle=rgba(OC.window,0.16*(1-k/len));c.fillRect(lx-ww/2+Math.sin(k*0.4)*4,yy,ww,2.4);}}
  c.strokeStyle="rgba(150,175,230,0.06)";c.lineWidth=2;for(let i=0;i<140;i++){const xx=R()*W,yy=wy+10+Math.pow(R(),0.7)*(qy-wy-14),ww=20+R()*90;c.beginPath();c.moveTo(xx,yy);c.lineTo(xx+ww,yy);c.stroke();}
  // the near quay: a stone kerb, and cobbles going into the dark
  g=c.createLinearGradient(0,qy,0,H);g.addColorStop(0,"#262a38");g.addColorStop(1,"#0a0d16");c.fillStyle=g;c.fillRect(0,qy,W,H-qy);
  c.fillStyle="#3a3d4c";c.fillRect(0,qy,W,16);c.fillStyle="rgba(255,255,255,0.08)";c.fillRect(0,qy,W,3);
  for(let i=0;i<46;i++){const xx=i*44+R()*6;c.strokeStyle="rgba(0,0,0,0.3)";c.lineWidth=2;c.beginPath();c.moveTo(xx,qy);c.lineTo(xx,qy+16);c.stroke();}
  for(let r=0;r<7;r++){const yy=qy+34+r*r*6+r*20,sz=14+r*5;for(let xx=-20+(r%2)*sz;xx<W+20;xx+=sz*(1.9+R()*0.8)){c.fillStyle="rgba(150,160,190,"+(0.02+R()*0.04)+")";c.beginPath();c.ellipse(xx+R()*8,yy+R()*6,sz*(0.8+R()*0.4),sz*(0.34+R()*0.14),R()*0.3-0.15,0,TAU);c.fill();}}
  oc_pool(c,960,qy+40,900,160,OC.lamp,0.07);
  const v=c.createRadialGradient(W/2,H/2,H*0.32,W/2,H/2,W*0.74);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(0,0,0,0.5)");c.fillStyle=v;c.fillRect(0,0,W,H);};

AG_PLACES.ocCount=c=>{const R=ag_rnd(1606);c.fillStyle=rgba(OC.woodDk,1);c.fillRect(0,0,W,H);
  // boards running across, each a little different, with their grain
  for(let b=0;b<9;b++){const y0=b*124-20,col=mix(OC.wood,OC.woodDk,0.25+R()*0.35);c.fillStyle=rgba(col,1);c.fillRect(0,y0,W,124);
    c.strokeStyle="rgba(20,12,8,0.6)";c.lineWidth=3;c.beginPath();c.moveTo(0,y0);c.lineTo(W,y0);c.stroke();
    for(let k=0;k<26;k++){const yy=y0+8+R()*110,amp=2+R()*5,ph=R()*TAU,fr=0.004+R()*0.006;c.strokeStyle=R()<0.5?"rgba(20,12,8,0.18)":"rgba(160,120,80,0.10)";c.lineWidth=1+R()*1.6;c.beginPath();
      for(let xx=0;xx<=W;xx+=24){const Y=yy+Math.sin(xx*fr+ph)*amp;xx?c.lineTo(xx,Y):c.moveTo(xx,Y);}c.stroke();}}
  oc_pool(c,900,470,1000,620,OC.lamp,0.22);
  const v=c.createRadialGradient(900,480,H*0.25,W/2,H/2,W*0.7);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(0,0,0,0.72)");c.fillStyle=v;c.fillRect(0,0,W,H);};

// the bank's room: where its parts are, for the scenes
const OC_HALL={table:640,front:780,win:[[250,520],[1300,1570]],ledger:[760,470,860,404],scale:[580,640],merchant:[300,664,1.0],clerk:[1190,430,0.82]};
AG_PLACES.ocHall=c=>{const R=ag_rnd(31),ty=OC_HALL.table,fy=OC_HALL.front;
  let g=c.createLinearGradient(0,0,0,ty);g.addColorStop(0,"#0b1020");g.addColorStop(1,"#1a1f30");c.fillStyle=g;c.fillRect(0,0,W,ty);
  // the stone wall's blocks
  for(let r=0;r<10;r++){const y0=r*52;c.strokeStyle="rgba(0,0,0,0.35)";c.lineWidth=2;c.beginPath();c.moveTo(0,y0);c.lineTo(W,y0);c.stroke();
    for(let xx=(r%2)*70;xx<W;xx+=140){c.beginPath();c.moveTo(xx,y0);c.lineTo(xx,y0+52);c.stroke();c.fillStyle="rgba(140,150,190,"+(0.015+R()*0.03)+")";c.fillRect(xx+2,y0+2,136,48);}}
  // two tall windows, round-headed, of small leaded panes, the night outside
  for(const [x0,x1] of OC_HALL.win){const w=x1-x0,y0=70,y1=470,rad=w/2,path=cc=>{cc.moveTo(x0,y1);cc.lineTo(x0,y0+rad);cc.arc(x0+rad,y0+rad,rad,Math.PI,0);cc.lineTo(x1,y1);cc.closePath();};
    c.save();c.beginPath();path(c);c.lineWidth=26;c.strokeStyle="#262b3c";c.stroke();g=c.createLinearGradient(0,y0,0,y1);g.addColorStop(0,"#26406e");g.addColorStop(1,"#101c38");c.fillStyle=g;c.fill();
    c.clip();oc_pool(c,x0+w*0.6,y0+120,w*0.9,200,[150,180,240],0.18);
    c.strokeStyle="rgba(10,14,26,0.9)";c.lineWidth=2.4;for(let d=-600;d<600;d+=34){c.beginPath();c.moveTo(x0+d,y0);c.lineTo(x0+d+420,y0+420);c.stroke();c.beginPath();c.moveTo(x1-d,y0);c.lineTo(x1-d-420,y0+420);c.stroke();}
    c.lineWidth=9;c.strokeStyle="#1a1f2e";c.beginPath();c.moveTo((x0+x1)/2,y0);c.lineTo((x0+x1)/2,y1);c.moveTo(x0,y0+rad+60);c.lineTo(x1,y0+rad+60);c.stroke();c.restore();
    c.fillStyle="#2c3142";c.fillRect(x0-24,y1,w+48,18);c.fillStyle="rgba(255,255,255,0.06)";c.fillRect(x0-24,y1,w+48,3);}
  // the wainscot: dark wooden panels to the table's height
  c.fillStyle=rgba(mix(OC.woodDk,[10,10,16],0.3),1);c.fillRect(0,488,W,ty-488);c.fillStyle="rgba(255,220,170,0.06)";c.fillRect(0,488,W,4);
  for(let xx=20;xx<W;xx+=180){c.strokeStyle="rgba(0,0,0,0.45)";c.lineWidth=3;c.strokeRect(xx,506,150,ty-524);c.strokeStyle="rgba(255,210,160,0.05)";c.lineWidth=1.5;c.strokeRect(xx+6,512,138,ty-536);}
  oc_pool(c,1100,ty-60,1100,300,OC.lamp,0.16);
  // the table, under a green cloth: its top going back to the wall, then its front falling in folds
  g=c.createLinearGradient(0,ty,0,fy);g.addColorStop(0,rgba(OC.clothDk,1));g.addColorStop(1,rgba(OC.cloth,1));c.fillStyle=g;c.fillRect(0,ty,W,fy-ty);
  oc_pool(c,1100,ty+70,1000,120,OC.lamp,0.2);
  g=c.createLinearGradient(0,fy,0,H);g.addColorStop(0,rgba(mix(OC.cloth,[0,0,0],0.2),1));g.addColorStop(1,"#05090e");c.fillStyle=g;c.fillRect(0,fy,W,H-fy);
  c.fillStyle="rgba(255,255,255,0.07)";c.fillRect(0,fy,W,3);
  for(let xx=-40;xx<W+40;xx+=62+R()*30){g=c.createLinearGradient(xx-30,0,xx+30,0);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(0.5,"rgba(0,0,0,0.32)");g.addColorStop(1,"rgba(0,0,0,0)");c.fillStyle=g;c.fillRect(xx-30,fy+4,60,H-fy);}
  const v=c.createRadialGradient(W/2,H/2,H*0.32,W/2,H/2,W*0.74);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(0,0,0,0.5)");c.fillStyle=v;c.fillRect(0,0,W,H);};

/* ---------------------------------------------------------------- coins, a bag, a balance
   oc_coin(ctx, x, y, r, o): a coin lying on the table, seen a little from above (o.tilt, its height over its width), in o.metal ("silver",
   "gold", "copper"), its stamp o.motif (0 to 4: a cross, a shield, a rosette, a ship, a star in a ring of beads); o.clip (0 to 1) how much
   of its edge is shaved away, in bites; o.worn (0 to 1) how much of its stamp and rim is worn away; o.rot; o.a. */
const OC_METAL={silver:OC.silver,gold:OC.gold,copper:OC.copper};
function oc_coinPath(c,r,clip,seed){const R=ag_rnd(seed||3),bites=[];if(clip>0)for(let i=0;i<3;i++)bites.push([R()*TAU,0.5+R()*0.6,(0.10+R()*0.12)*clip]);
  c.beginPath();for(let i=0;i<=72;i++){const an=i/72*TAU;let rr2=r;for(const [b,w,d] of bites){let da=Math.abs(((an-b+Math.PI)%TAU+TAU)%TAU-Math.PI);if(da<w)rr2=Math.min(rr2,r*(1-d*(1-Math.pow(da/w,2))));}
    const X=Math.cos(an)*rr2,Y=Math.sin(an)*rr2;i?c.lineTo(X,Y):c.moveTo(X,Y);}c.closePath();}
function oc_coin(ctx,x,y,r,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const base=OC_METAL[o.metal||"silver"],tilt=o.tilt||0.86,worn=o.worn||0,clip=o.clip||0;
  ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(1,tilt);ctx.rotate(o.rot||0);
  // its shadow on the table, then its edge's thickness, then its face
  const sg=ctx.createRadialGradient(r*0.12,r*0.22,r*0.55,r*0.12,r*0.22,r*1.25);sg.addColorStop(0,"rgba(0,0,0,0.55)");sg.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=sg;ctx.fillRect(-r*1.3,-r*1.2,r*2.9,r*2.9);
  ctx.save();ctx.translate(0,r*0.09);ctx.fillStyle=rgba(ag_dk(base,0.55),1);oc_coinPath(ctx,r,clip,o.seed);ctx.fill();ctx.restore();
  const g=ctx.createLinearGradient(-r,-r,r,r);g.addColorStop(0,rgba(ag_lt(base,0.35),1));g.addColorStop(0.45,rgba(base,1));g.addColorStop(0.7,rgba(ag_dk(base,0.18),1));g.addColorStop(1,rgba(ag_dk(base,0.42),1));
  ctx.fillStyle=g;oc_coinPath(ctx,r,clip,o.seed);ctx.fill();
  const hg=ctx.createRadialGradient(-r*0.38,-r*0.42,0,-r*0.38,-r*0.42,r*0.8);hg.addColorStop(0,"rgba(255,250,236,0.45)");hg.addColorStop(1,"rgba(255,250,236,0)");ctx.fillStyle=hg;oc_coinPath(ctx,r,clip,o.seed);ctx.fill();
  ctx.save();oc_coinPath(ctx,r,clip,o.seed);ctx.clip();
  // the rim, raised; worn away it barely shows
  ctx.lineWidth=r*0.1;ctx.strokeStyle=rgba(ag_dk(base,0.3),0.7*(1-worn*0.8));ctx.beginPath();ctx.arc(0,0,r*0.86,0,TAU);ctx.stroke();
  ctx.strokeStyle=rgba(ag_lt(base,0.5),0.5*(1-worn*0.8));ctx.lineWidth=r*0.03;ctx.beginPath();ctx.arc(-r*0.02,-r*0.03,r*0.92,Math.PI*1.05,Math.PI*1.75);ctx.stroke();
  // the stamp
  const sa=0.85*(1-worn*0.85),ink=rgba(ag_dk(base,0.42),sa),hi=rgba(ag_lt(base,0.4),sa*0.6);ctx.lineCap="round";ctx.lineJoin="round";
  const stroke=(fn,w)=>{ctx.lineWidth=w*r;ctx.strokeStyle=hi;ctx.save();ctx.translate(-r*0.02,-r*0.02);ctx.beginPath();fn();ctx.stroke();ctx.restore();ctx.strokeStyle=ink;ctx.beginPath();fn();ctx.stroke();};
  switch((o.motif||0)%5){
    case 0:stroke(()=>{ctx.moveTo(0,-r*0.55);ctx.lineTo(0,r*0.55);ctx.moveTo(-r*0.55,0);ctx.lineTo(r*0.55,0);},0.1);for(const [dx,dy] of [[1,1],[1,-1],[-1,1],[-1,-1]]){ctx.fillStyle=ink;ctx.beginPath();ctx.arc(dx*r*0.3,dy*r*0.3,r*0.07,0,TAU);ctx.fill();}break;
    case 1:stroke(()=>{ctx.moveTo(-r*0.38,-r*0.42);ctx.lineTo(r*0.38,-r*0.42);ctx.lineTo(r*0.38,0);ctx.quadraticCurveTo(r*0.36,r*0.36,0,r*0.52);ctx.quadraticCurveTo(-r*0.36,r*0.36,-r*0.38,0);ctx.closePath();ctx.moveTo(-r*0.38,-r*0.05);ctx.lineTo(r*0.38,-r*0.05);},0.08);break;
    case 2:for(let k=0;k<6;k++){const an=k/6*TAU;stroke(()=>{ctx.ellipse(Math.cos(an)*r*0.28,Math.sin(an)*r*0.28,r*0.2,r*0.11,an,0,TAU);},0.06);}ctx.fillStyle=ink;ctx.beginPath();ctx.arc(0,0,r*0.1,0,TAU);ctx.fill();break;
    case 3:stroke(()=>{ctx.moveTo(-r*0.5,r*0.1);ctx.quadraticCurveTo(0,r*0.45,r*0.5,r*0.1);ctx.moveTo(-r*0.5,r*0.1);ctx.lineTo(r*0.5,r*0.1);ctx.moveTo(0,r*0.1);ctx.lineTo(0,-r*0.55);ctx.moveTo(0,-r*0.5);ctx.lineTo(r*0.32,-r*0.05);ctx.lineTo(0,-r*0.05);},0.08);break;
    default:for(let k=0;k<20;k++){const an=k/20*TAU;ctx.fillStyle=ink;ctx.beginPath();ctx.arc(Math.cos(an)*r*0.68,Math.sin(an)*r*0.68,r*0.05,0,TAU);ctx.fill();}
      stroke(()=>{for(let k=0;k<5;k++){const an=-Math.PI/2+k*TAU*2/5;k?ctx.lineTo(Math.cos(an)*r*0.42,Math.sin(an)*r*0.42):ctx.moveTo(Math.cos(an)*r*0.42,Math.sin(an)*r*0.42);}ctx.closePath();},0.07);}
  // a worn coin's face: smoothed and dulled
  if(worn>0){ctx.fillStyle=rgba(mix(base,[150,150,150],0.3),0.35*worn);ctx.fillRect(-r,-r,2*r,2*r);}
  ctx.restore();
  // a shaved edge shows bright where it was cut
  if(clip>0){ctx.strokeStyle=rgba(ag_lt(base,0.6),0.5*clip);ctx.lineWidth=Math.max(1,r*0.035);oc_coinPath(ctx,r,clip,o.seed);ctx.stroke();}
  ctx.restore();}
// a scatter of coins on the table: n coins in a box, each its own metal, stamp, size and wear, the same every frame; o.k (0 to 1) they fall into place
function oc_coins(ctx,x,y,w,h,n,o){o=o||{};const R=ag_rnd(o.seed||1600),k=o.k==null?1:o.k,list=[];
  for(let i=0;i<n;i++){const m=R(),metal=m<0.6?"silver":m<0.82?"copper":"gold",r=18+R()*20,cx=x+R()*w,cy=y+R()*h,motif=Math.floor(R()*5),worn=R()<0.3?0.4+R()*0.5:R()*0.2,clip=R()<0.35?0.4+R()*0.6:0,rot=R()*TAU,d=R();
    list.push({metal,r,cx,cy,motif,worn,clip,rot,d,seed:i+7});}
  list.sort((p,q)=>p.cy-q.cy);
  for(const c of list){const f=ag_spr(k*1.6-c.d*0.6,0,0.5);if(f<=0.01)continue;oc_coin(ctx,c.cx,c.cy-(1-Math.min(1,f))*40,c.r*Math.min(1.04,f),{metal:c.metal,motif:c.motif,worn:c.worn,clip:c.clip,rot:c.rot,seed:c.seed,a:Math.min(1,f*1.5)*(o.a==null?1:o.a)});}
  return list;}
// a coin bag of linen, its neck tied with a cord; o.open (0 to 1) its neck opens and coins show; s its size (1: 120 px tall)
function oc_bag(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);const L=OC.linen,op=o.open||0;
  oc_shadowE(ctx,6,58,62,12,0.45);
  const body=c=>{c.moveTo(-22,-34);c.bezierCurveTo(-58,-24,-70,20,-60,44);c.bezierCurveTo(-50,64,50,64,60,44);c.bezierCurveTo(70,20,58,-24,22,-34);c.closePath();};
  ag_soft(ctx,body,ag_dk(L,0.25),ag_lt(L,0.2),20,-10,90,"rgba(30,20,10,0.5)",14);
  ag_folds(ctx,body,[[[-30,-20],[-40,10],[-34,40]],[[10,-26],[16,8],[8,44]]],"rgba(60,44,28,0.3)","rgba(255,240,210,0.12)");
  if(op>0){ctx.save();ctx.globalAlpha*=op;for(const [cx,cy,m] of [[-10,-40,"silver"],[8,-44,"gold"],[22,-38,"silver"],[-24,-36,"copper"]])oc_coin(ctx,cx,cy,11,{metal:m,tilt:0.5,motif:2});ctx.restore();}
  const neck=c=>{c.moveTo(-24,-34);c.bezierCurveTo(-30,-52-op*6,-20,-62-op*8,-30,-72-op*6);c.lineTo(30,-72-op*6);c.bezierCurveTo(20,-62-op*8,30,-52-op*6,24,-34);c.closePath();};
  ag_soft(ctx,neck,ag_dk(L,0.2),ag_lt(L,0.25),10,-60,50,"rgba(30,20,10,0.4)",8);
  ctx.strokeStyle=rgba(ag_dk(OC.wood,0.1),1);ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-26,-44);ctx.quadraticCurveTo(0,-38,26,-44);ctx.stroke();
  ctx.beginPath();ctx.moveTo(10,-42);ctx.quadraticCurveTo(26,-26,20,-10);ctx.stroke();ctx.restore();}
/* a balance on a stand: a brass post with its beam, two pans hung on cords. (x, y) is the foot of its stand on the table; s its size
   (1: the post 240 px tall); o.tip (-1 to 1) how far the beam tips (positive: the left pan down); o.left / o.right (ctx, x, y) draw what
   lies in each pan, in the frame's units, centred on the pan */
function oc_scale(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const B=OC.brass,tip=clamp(o.tip||0,-1,1)*0.16;ctx.save();ctx.globalAlpha*=a;
  const px=x,py=y-240*s,half=170*s,dx=Math.cos(tip)*half,dy=Math.sin(tip)*half,ends=[[px-dx,py+dy],[px+dx,py-dy]],drop=150*s;
  oc_shadowE(ctx,x+8*s,y+4*s,190*s,16*s,0.45);
  ag_soft(ctx,c=>{ag_rect(c,x-60*s,y-26*s,120*s,30*s,6*s);},OC.wood,OC.woodLt,x+20*s,y-26*s,80*s,"rgba(0,0,0,0.4)",8);
  ctx.lineCap="round";const brass=(w,pts)=>{ctx.strokeStyle=rgba(ag_dk(B,0.35),1);ctx.lineWidth=w*s;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();
    ctx.strokeStyle=rgba(ag_lt(B,0.35),0.8);ctx.lineWidth=w*s*0.35;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0]-w*s*0.18,p[1]-w*s*0.18):ctx.moveTo(p[0]-w*s*0.18,p[1]-w*s*0.18));ctx.stroke();};
  brass(12,[[x,y-26*s],[px,py]]);
  for(const [ex,ey] of ends){ctx.strokeStyle="rgba(200,190,170,0.55)";ctx.lineWidth=1.6;ctx.beginPath();for(const k of [-1,0,1]){ctx.moveTo(ex,ey);ctx.lineTo(ex+k*58*s,ey+drop);}ctx.stroke();}
  brass(9,[ends[0],[px,py],ends[1]]);ctx.fillStyle=rgba(B,1);ctx.beginPath();ctx.arc(px,py,12*s,0,TAU);ctx.fill();ctx.fillStyle=rgba(ag_lt(B,0.5),1);ctx.beginPath();ctx.arc(px-3*s,py-3*s,4*s,0,TAU);ctx.fill();
  // the pointer, standing up from the beam's middle, turning with it
  ctx.save();ctx.translate(px,py);ctx.rotate(tip);ctx.strokeStyle=rgba(ag_lt(B,0.2),1);ctx.lineWidth=4*s;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-54*s);ctx.stroke();ctx.restore();
  ends.forEach(([ex,ey],i)=>{const cx=ex,cy=ey+drop;if(i===0&&o.left)o.left(ctx,cx,cy-6*s);if(i===1&&o.right)o.right(ctx,cx,cy-6*s);
    ag_soft(ctx,c=>{c.ellipse(cx,cy,64*s,13*s,0,0,TAU);},ag_dk(B,0.15),ag_lt(B,0.4),cx-20*s,cy-6*s,70*s,"rgba(0,0,0,0.35)",6);
    ctx.save();ctx.beginPath();ctx.ellipse(cx,cy,64*s,13*s,0,0,TAU);ctx.clip();ctx.fillStyle="rgba(0,0,0,0.12)";ctx.fillRect(cx-70*s,cy-14*s,140*s,10*s);ctx.restore();});
  ctx.restore();}
// a small brass weight: a cup weight seen from the side
function oc_weight(ctx,x,y,s){ag_soft(ctx,c=>{c.moveTo(x-16*s,y);c.lineTo(x-13*s,y-26*s);c.lineTo(x+13*s,y-26*s);c.lineTo(x+16*s,y);c.closePath();},ag_dk(OC.brass,0.1),ag_lt(OC.brass,0.4),x-6*s,y-20*s,30*s,"rgba(0,0,0,0.35)",4);
  ctx.fillStyle=rgba(ag_lt(OC.brass,0.2),1);ctx.beginPath();ctx.ellipse(x,y-26*s,13*s,3.5*s,0,0,TAU);ctx.fill();}

/* ---------------------------------------------------------------- the bank's ledger, and the bills it paid
   oc_ledger(ctx, x, y, w, h, o): the ledger open on the table, tilted towards us so its pages read: two pages side by side, each an
   account, a merchant's own page. o.pages [{head, lines: [{s, n, col, a, w}], bal, balA, glow}, {...}]: each page's heading, its lines
   (words on the left, a number on the right; w (0 to 1) how much of the line is written), and what the merchant holds (bal), lit gold
   with glow; o.a. Words 30 px. Returns where each page's lines are, for a line moving from page to page. */
function oc_ledger(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a,pw=w/2,out=[];if(a<=0.004)return out;ctx.save();ctx.globalAlpha*=a;
  // the cover and the pages' edges under the open pages
  oc_shadowR(ctx,x-6,y+24,w+12,h,0.55,16);
  ag_soft(ctx,c=>{ag_rect(c,x-18,y-10,w+36,h+30,10);},[70,40,30],[110,70,50],x+w*0.7,y,w,"rgba(0,0,0,0.4)",10);
  for(let k=4;k>=1;k--){ctx.fillStyle=rgba(mix(OC.paperEdge,OC.paperDk,k/4),1);ctx.beginPath();ctx.moveTo(x-6+k,y+k*2);ctx.lineTo(x+w+6-k,y+k*2);ctx.lineTo(x+w+6-k,y+h+8-k);ctx.lineTo(x-6+k,y+h+8-k);ctx.fill();}
  for(let side=0;side<2;side++){const px=x+side*pw,pg=(o.pages||[])[side]||{};
    // a page, a little curved where it meets the spine
    const page=c=>{if(side===0){c.moveTo(px,y+6);c.quadraticCurveTo(px+pw*0.5,y-4,px+pw,y+10);c.lineTo(px+pw,y+h);c.quadraticCurveTo(px+pw*0.5,y+h-8,px,y+h-2);}
      else{c.moveTo(px,y+10);c.quadraticCurveTo(px+pw*0.5,y-4,px+pw,y+6);c.lineTo(px+pw,y+h-2);c.quadraticCurveTo(px+pw*0.5,y+h-8,px,y+h);}c.closePath();};
    ctx.beginPath();page(ctx);const g=ctx.createLinearGradient(px,0,px+pw,0);
    if(side===0){g.addColorStop(0,rgba(OC.paperDk,1));g.addColorStop(0.12,rgba(OC.paper,1));g.addColorStop(0.86,rgba(OC.paper,1));g.addColorStop(1,rgba(ag_dk(OC.paperDk,0.3),1));}
    else{g.addColorStop(0,rgba(ag_dk(OC.paperDk,0.3),1));g.addColorStop(0.14,rgba(OC.paper,1));g.addColorStop(0.88,rgba(OC.paper,1));g.addColorStop(1,rgba(OC.paperDk,1));}
    ctx.fillStyle=g;ctx.fill();
    if(pg.glow>0){ctx.save();ctx.beginPath();page(ctx);ctx.clip();ctx.fillStyle=rgba(MD.agreed,0.16*pg.glow);ctx.fillRect(px,y,pw,h);ctx.restore();ctx.save();ctx.beginPath();page(ctx);ctx.strokeStyle=rgba(MD.agreed,0.9*pg.glow);ctx.lineWidth=3;ctx.shadowColor=rgba(MD.agreed,0.8);ctx.shadowBlur=18*pg.glow;ctx.stroke();ctx.restore();}
    // ruled lines, and the columns' rules
    const lx=px+(side?44:36),rx=px+pw-(side?36:44);ctx.strokeStyle="rgba(140,110,80,0.35)";ctx.lineWidth=1.4;for(let r=0;r<7;r++){const yy=y+104+r*48;ctx.beginPath();ctx.moveTo(lx,yy);ctx.lineTo(rx,yy);ctx.stroke();}
    ctx.strokeStyle="rgba(150,60,50,0.3)";ctx.beginPath();ctx.moveTo(rx-96,y+80);ctx.lineTo(rx-96,y+h-96);ctx.stroke();
    if(pg.head)md_T(ctx,pg.head,lx,y+62,{w:700,size:32,color:rgba(OC.ink,0.95)});
    const rows=[];(pg.lines||[]).forEach((L,i)=>{const yy=y+142+i*48,la=(L.a==null?1:L.a)*(L.w==null?1:clamp(L.w*1.6,0,1));rows.push([lx,yy-10,rx,yy-10]);if(la<=0.004)return;
      ctx.save();ctx.globalAlpha*=la;if(L.w!=null&&L.w<1){ctx.beginPath();ctx.rect(lx-4,yy-40,(rx-lx+8)*clamp(L.w,0,1),56);ctx.clip();}
      md_T(ctx,L.s,lx,yy,{w:600,size:30,color:rgba(L.col||OC.ink,0.92)});if(L.n!=null)md_T(ctx,L.n,rx,yy,{w:700,size:30,align:"right",color:rgba(L.col||OC.ink,0.92)});ctx.restore();});
    if(pg.bal!=null){const by=y+h-44,ba=pg.balA==null?1:pg.balA;ctx.strokeStyle=rgba(OC.ink,0.5);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(rx-150,by-40);ctx.lineTo(rx,by-40);ctx.stroke();
      md_T(ctx,"Holds",lx,by,{w:700,size:30,color:rgba(OC.ink,0.85)});
      // what it holds, or, while a line moves, the old sum giving way to the new one ([old, new, u])
      const bl=Array.isArray(pg.bal)?pg.bal:[pg.bal,pg.bal,1],u=clamp(bl[2],0,1);
      if(u<1)withA(ctx,ba*(1-ag_sine(u*2)),()=>md_T(ctx,bl[0],rx,by,{w:800,size:32,align:"right",color:rgba(OC.ink,1)}));
      if(u>0)withA(ctx,ba*ag_sine(u*2-1),()=>md_T(ctx,bl[1],rx,by,{w:800,size:32,align:"right",color:rgba(OC.ink,1)}));}
    out.push({x:px,y,w:pw,h,rows,lx,rx});}
  // the spine's shadow
  const sg=ctx.createLinearGradient(x+pw-30,0,x+pw+30,0);sg.addColorStop(0,"rgba(60,40,20,0)");sg.addColorStop(0.5,"rgba(60,40,20,0.45)");sg.addColorStop(1,"rgba(60,40,20,0)");ctx.fillStyle=sg;ctx.fillRect(x+pw-30,y,60,h);
  ctx.restore();return out;}
// a bill of exchange: a slip of paper with a few lines of writing and a seal; (x, y) its middle, w its width, o.rot, o.a, o.tick (0 to 1) paid
function oc_bill(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const h=w*0.56;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(o.rot||0);
  // its shadow: two soft steps, no blur filter, which would paint slowly every frame
  ctx.fillStyle="rgba(0,0,0,0.18)";ctx.fillRect(-w/2+3,-h/2+7,w+6,h+6);ctx.fillStyle="rgba(0,0,0,0.22)";ctx.fillRect(-w/2+5,-h/2+9,w,h);
  ctx.fillStyle=rgba(mix(OC.paper,[255,250,240],0.2),1);ctx.fillRect(-w/2,-h/2,w,h);ctx.strokeStyle=rgba(OC.paperEdge,0.9);ctx.lineWidth=1.5;ctx.strokeRect(-w/2,-h/2,w,h);
  oc_hand(ctx,-w/2+16,-h/2+24,w-80,4,h*0.18,1,{seed:o.seed||4,lw:Math.max(1.4,w*0.012)});
  ctx.fillStyle=rgba(OC.seal,1);ctx.beginPath();ctx.arc(w/2-28,h/2-24,w*0.075,0,TAU);ctx.fill();ctx.fillStyle="rgba(255,200,180,0.25)";ctx.beginPath();ctx.arc(w/2-31,h/2-27,w*0.03,0,TAU);ctx.fill();
  ctx.restore();
  if(o.tick>0)md_pill(ctx,x,y-h*0.1,"paid",{col:MD.pass,icon:"tick",size:28,a:a*ag_in(o.tick,0,0.4),k:Math.min(1,ag_spr(o.tick,0,0.5))});}
