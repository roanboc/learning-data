/* ===== Strategy is a habit: the Montreal Protocol, from 1974 =====
   The film's own places and pictures for its opening story, in the module's matte, sunlit language, lit from the right as its rooms are
   (prefix sih_). Nothing here is a likeness of a real person, place or photograph: a kitchen of the 1970s, the sky cut open like the
   module's section of the teaching building, a station on the Antarctic ice and a meeting hall are drawn plainly, from what is known of
   them, and the delegates are dressed for their time.
     sihHome       a kitchen wall of the 1970s in late light: a fridge, and a shelf with a spray can and foam
     sihSky        the sky cut open: the ground, the clouds, and high above them the band where the ozone layer is drawn live
     sih_sky       on it: the ozone layer (o.thick, 0 to 1), the sun's ultraviolet light (o.rays, 0 to 1; o.pass, the share that gets
                   through to the ground) and the gases drifting up to the layer (o.rise: seconds since they start, or null)
     sihIce        Antarctica in spring: the ice shelf, a low station on it and its instrument, under a pale sky
     sih_chart     the station's October readings on one sheet, 1957 to 1984, falling to about two thirds
     sihHall       a meeting hall, 1987: the delegates sit behind its table
     SIH_DELEGATES four delegates, dressed for their time, never likenesses
     sih_plan      the plan for the main CFCs on one sheet: 1987, 1990, 1992, each line the plan moved, and the years it looks again
   Colour keeps the module's meaning: the treaty and its plan in blue, what got better in green; the gases, the thinning layer and the
   light that gets through in amber. The sky, the ice and the people wear none of the five. */

const SIH_K={sky0:[164,186,210],sky1:[238,232,218],ground:[150,146,108],groundDk:[118,112,84],cloud:[248,246,240],cloudSh:[214,212,212],
  ozone:[176,208,206],ozoneDk:[130,170,170],ray:[255,224,150],ice:[238,242,244],iceSh:[200,212,222],iceSky0:[186,202,220],iceSky1:[242,238,230],
  hut:[188,170,146],hutDk:[124,110,96],metal:[96,98,104],fridge:[240,234,218],fridgeDk:[206,198,180]};

/* ---------------------------------------------------------------- the kitchen, 1970s */
// a fridge of the time: tall, its top corners round, its door's seam and a long handle, lit from the right
function sih_fridge(c,x,y,w,h){c.save();c.shadowColor="rgba(52,36,30,0.28)";c.shadowBlur=26;c.shadowOffsetX=LP.sdx*1.6;c.shadowOffsetY=10;
  c.fillStyle=rgba(SIH_K.fridge,1);c.beginPath();c.moveTo(x,y+h);c.lineTo(x,y+40);c.quadraticCurveTo(x,y,x+40,y);c.lineTo(x+w-40,y);c.quadraticCurveTo(x+w,y,x+w,y+40);c.lineTo(x+w,y+h);c.closePath();c.fill();c.restore();
  let g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,rgba(LP.shade,0.16));g.addColorStop(0.55,rgba(LP.shade,0));g.addColorStop(1,rgba(LP.sun,0.16));c.fillStyle=g;
  c.beginPath();c.moveTo(x,y+h);c.lineTo(x,y+40);c.quadraticCurveTo(x,y,x+40,y);c.lineTo(x+w-40,y);c.quadraticCurveTo(x+w,y,x+w,y+40);c.lineTo(x+w,y+h);c.closePath();c.fill();
  c.fillStyle=rgba(SIH_K.fridgeDk,1);c.fillRect(x+8,y+h*0.34,w-16,4);c.fillRect(x+12,y+h-26,w-24,10);
  c.fillStyle=rgba(LP.graphite,0.85);rr(c,x+w-46,y+h*0.12,12,h*0.16,6);c.fill();rr(c,x+w-46,y+h*0.42,12,h*0.22,6);c.fill();}
// a spray can: a tall cylinder with its cap; foam: a cup and a tray, white and soft
function sih_can(c,x,base,r,h){let g=c.createLinearGradient(x-r,0,x+r,0);g.addColorStop(0,"#8E8A86");g.addColorStop(0.6,"#D8D4CC");g.addColorStop(1,"#B4AEA6");
  c.fillStyle=g;c.fillRect(x-r,base-h,2*r,h);c.beginPath();c.ellipse(x,base,r,r*0.28,0,0,TAU);c.fill();
  c.fillStyle="#C9C3BA";c.beginPath();c.ellipse(x,base-h,r,r*0.28,0,0,TAU);c.fill();
  c.fillStyle="#9C968E";c.fillRect(x-r*0.62,base-h-r*0.9,r*1.24,r*0.9);c.beginPath();c.ellipse(x,base-h-r*0.9,r*0.62,r*0.2,0,0,TAU);c.fill();
  c.fillStyle="#E8E4DC";c.fillRect(x-r,base-h*0.66,2*r,h*0.3);}
function sih_foam(c,x,base){c.fillStyle="#F4F2EC";c.beginPath();c.moveTo(x-34,base-110);c.lineTo(x+34,base-110);c.lineTo(x+24,base);c.lineTo(x-24,base);c.closePath();c.fill();
  c.fillStyle="rgba(52,44,52,0.12)";c.beginPath();c.moveTo(x-34,base-110);c.lineTo(x-14,base-110);c.lineTo(x-8,base);c.lineTo(x-24,base);c.closePath();c.fill();
  c.fillStyle="#E6E2DA";c.beginPath();c.ellipse(x,base-110,34,8,0,0,TAU);c.fill();
  c.fillStyle="#F4F2EC";rr(c,x+70,base-26,170,26,6);c.fill();c.fillStyle="rgba(52,44,52,0.1)";rr(c,x+70,base-8,170,8,4);c.fill();}
AG_PLACES.sihHome=c=>{lp_paintRoom(c,{light:"late",seed:31,base:[230,218,196]});
  // a timber shelf on the wall, with a spray can and foam on it; the fridge by the window's light
  c.save();c.shadowColor="rgba(52,36,30,0.3)";c.shadowBlur=16;c.shadowOffsetX=LP.sdx;c.shadowOffsetY=8;c.fillStyle=rgba(LP.timber,1);c.fillRect(250,600,620,22);c.restore();
  c.fillStyle=rgba(mix(LP.timber,LP.shade,0.3),1);c.fillRect(250,616,620,6);
  sih_can(c,370,600,30,150);sih_foam(c,520,600);
  sih_fridge(c,1180,330,330,606);};

/* ---------------------------------------------------------------- the sky, cut open */
const SIH_SKY={ground:830,band:190,bh:76,sun:[1790,40]};
// a cloud: one soft shape, rounded on top and flat underneath, a little warmer on the sun's side and greyer at its base
function sih_cloud(c,x,y,s,R){const base=y+22*s,B=[];
  for(let k=0;k<5;k++){const u=k/4,r=(30+40*Math.sin(Math.PI*(0.12+0.76*u))+R()*12)*s;B.push([x+(u-0.5)*240*s,base-r*0.6,r]);}
  c.save();c.beginPath();c.rect(x-300*s,base-220*s,600*s,220*s);c.clip();
  const shape=()=>{c.beginPath();for(const [bx,by,r] of B){c.moveTo(bx+r,by);c.arc(bx,by,r,0,TAU);}};
  shape();let g=c.createLinearGradient(0,base-100*s,0,base);g.addColorStop(0,rgba(SIH_K.cloud,0.97));g.addColorStop(0.6,rgba(SIH_K.cloud,0.94));g.addColorStop(1,rgba(SIH_K.cloudSh,0.94));c.fillStyle=g;c.fill();
  g=c.createLinearGradient(x-170*s,0,x+170*s,0);g.addColorStop(0,"rgba(110,122,146,0.12)");g.addColorStop(0.55,"rgba(255,255,255,0)");g.addColorStop(1,"rgba(255,244,220,0.26)");c.fillStyle=g;shape();c.fill();
  c.restore();}
AG_PLACES.sihSky=c=>{const R=ag_rnd(1974),gr=SIH_SKY.ground;let g=c.createLinearGradient(0,0,0,gr);g.addColorStop(0,rgba(SIH_K.sky0,1));g.addColorStop(1,rgba(SIH_K.sky1,1));
  c.fillStyle=g;c.fillRect(0,0,W,gr);
  g=c.createRadialGradient(SIH_SKY.sun[0],SIH_SKY.sun[1],20,SIH_SKY.sun[0],SIH_SKY.sun[1],760);g.addColorStop(0,"rgba(255,244,214,0.75)");g.addColorStop(1,"rgba(255,244,214,0)");c.fillStyle=g;c.fillRect(0,0,W,gr);
  c.fillStyle="rgba(255,248,226,0.95)";c.beginPath();c.arc(SIH_SKY.sun[0],SIH_SKY.sun[1],58,0,TAU);c.fill();
  for(const [x,y,s] of [[300,650,1.0],[880,610,0.75],[1500,665,1.1],[1890,620,0.7]])sih_cloud(c,x,y,s,R);
  // fields and far hills, low and quiet
  c.fillStyle=rgba(mix(SIH_K.ground,SIH_K.sky1,0.45),1);c.beginPath();c.moveTo(0,gr);for(let x=0;x<=W;x+=60)c.lineTo(x,gr-24-18*Math.sin(x/260)-10*Math.sin(x/97));c.lineTo(W,gr);c.closePath();c.fill();
  g=c.createLinearGradient(0,gr,0,H);g.addColorStop(0,rgba(SIH_K.ground,1));g.addColorStop(1,rgba(SIH_K.groundDk,1));c.fillStyle=g;c.fillRect(0,gr,W,H-gr);
  c.strokeStyle=rgba(SIH_K.groundDk,0.5);c.lineWidth=2;for(let k=0;k<7;k++){const y=gr+18+k*k*6;c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}};
// the layer, the light and the gases, live over sihSky
function sih_sky(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;const S=SIH_SKY,th=clamp(o.thick==null?1:o.thick,0,1);
  // the ozone layer: a soft band, thinner and paler as it's broken down
  const bh=S.bh*(0.35+0.65*th),y0=S.band-bh/2;let g=ctx.createLinearGradient(0,y0,0,y0+bh);
  g.addColorStop(0,rgba(SIH_K.ozone,0));g.addColorStop(0.3,rgba(SIH_K.ozone,0.5+0.45*th));g.addColorStop(0.7,rgba(SIH_K.ozoneDk,0.45+0.4*th));g.addColorStop(1,rgba(SIH_K.ozoneDk,0));
  ctx.fillStyle=g;ctx.fillRect(0,y0,W,bh);
  // the sun's ultraviolet light: rays down to the layer, most stopped there; those that get through, in amber, reach the ground
  const n=9,ru=clamp(o.rays||0,0,1),pass=clamp(o.pass||0,0,1),dx=-0.42;
  for(let i=0;i<n;i++){const k=clamp(ru*n*1.3-i*0.9,0,1);if(k<=0)continue;const x0=760+i*130,yb=S.band-bh*0.3,xb=x0+dx*yb;
    ctx.strokeStyle=rgba(SIH_K.ray,0.85*k);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x0,0);ctx.lineTo(lerp(x0,xb,k),lerp(0,yb,k));ctx.stroke();
    const through=i%3===1?pass*3>=1:i%3===0?pass*3>=2:pass>=1;const pk=i%3===1?clamp(pass*3,0,1):i%3===0?clamp(pass*3-1,0,1):clamp(pass*3-2,0,1);
    if(pk>0&&k>=1){const yg=S.ground-10,xg=x0+dx*yg;ctx.strokeStyle=rgba(LP.amber,0.9*pk);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(xb,yb);ctx.lineTo(lerp(xb,xg,pk),lerp(yb,yg,pk));ctx.stroke();}
    else if(k>=1){const gl=ctx.createRadialGradient(xb,yb,1,xb,yb,26);gl.addColorStop(0,rgba(SIH_K.ray,0.8));gl.addColorStop(1,rgba(SIH_K.ray,0));ctx.fillStyle=gl;ctx.beginPath();ctx.arc(xb,yb,26,0,TAU);ctx.fill();}
    void through;}
  // the gases drifting up from the ground to the layer, over years: small amber specks, each fading into the layer as it gets there
  if(o.rise!=null&&o.rise>0){const R=ag_rnd(77),T=7;for(let j=0;j<34;j++){const x=140+R()*1640,d=R(),r=5+R()*3;let u=o.rise/T-d;if(u<0)continue;u-=Math.floor(u);
    const k=sstep(0,0.12,u)*(1-sstep(0.8,1,u));if(k<=0.01)continue;const yy=lerp(S.ground-20,S.band+bh*0.15,u),xx=x+Math.sin(u*5+j)*26*u;
    ctx.fillStyle=rgba(LP.amber,0.85*k);ctx.beginPath();ctx.arc(xx,yy,r,0,TAU);ctx.fill();}}
  ctx.restore();}

/* ---------------------------------------------------------------- Antarctica, 1985 */
AG_PLACES.sihIce=c=>{const R=ag_rnd(1985),hz=700;let g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,rgba(SIH_K.iceSky0,1));g.addColorStop(1,rgba(SIH_K.iceSky1,1));
  c.fillStyle=g;c.fillRect(0,0,W,hz);
  g=c.createRadialGradient(1760,380,10,1760,380,700);g.addColorStop(0,"rgba(255,240,214,0.7)");g.addColorStop(1,"rgba(255,240,214,0)");c.fillStyle=g;c.fillRect(0,0,W,hz);
  c.fillStyle="rgba(255,246,226,0.9)";c.beginPath();c.arc(1760,380,40,0,TAU);c.fill();
  // the ice shelf, flat to the horizon, its low drifts in soft blue shade
  g=c.createLinearGradient(0,hz,0,H);g.addColorStop(0,rgba(SIH_K.iceSh,1));g.addColorStop(0.25,rgba(SIH_K.ice,1));g.addColorStop(1,rgba(mix(SIH_K.ice,SIH_K.iceSh,0.4),1));c.fillStyle=g;c.fillRect(0,hz,W,H-hz);
  for(let k=0;k<9;k++){const y=hz+30+k*k*5,x=R()*W;c.fillStyle=rgba(SIH_K.iceSh,0.35);c.beginPath();c.ellipse(x,y,300+R()*300,6+k*1.4,0,0,TAU);c.fill();}
  // a low station on the ice, raised a little on its legs, with small dark windows; its shadow falls to the left
  const hx=1180,hy=600,hw=420,hh=120;c.fillStyle=rgba(LP.shade,0.18);c.beginPath();c.ellipse(hx+hw/2-60,hy+hh+44,hw*0.62,16,0,0,TAU);c.fill();
  c.fillStyle=rgba(SIH_K.hutDk,1);for(let i=0;i<5;i++)c.fillRect(hx+20+i*(hw-40)/4-5,hy+hh,10,40);
  g=c.createLinearGradient(hx,0,hx+hw,0);g.addColorStop(0,rgba(ag_dk(SIH_K.hut,0.18),1));g.addColorStop(1,rgba(ag_lt(SIH_K.hut,0.12),1));c.fillStyle=g;c.fillRect(hx,hy,hw,hh);
  c.fillStyle=rgba(SIH_K.hutDk,1);c.fillRect(hx-8,hy-10,hw+16,12);
  c.fillStyle=rgba([62,66,74],1);for(let i=0;i<4;i++)c.fillRect(hx+46+i*92,hy+34,44,30);
  c.fillStyle=rgba(SIH_K.ice,1);c.fillRect(hx-8,hy-16,hw+16,7);
  // the instrument outside, a box on a stand that looks at the sun
  const ix=980,iy=650;c.strokeStyle=rgba(SIH_K.metal,1);c.lineWidth=5;c.beginPath();c.moveTo(ix,iy);c.lineTo(ix-34,iy+90);c.moveTo(ix,iy);c.lineTo(ix+34,iy+90);c.moveTo(ix,iy);c.lineTo(ix,iy+96);c.stroke();
  c.fillStyle=rgba([128,124,118],1);rr(c,ix-56,iy-58,112,62,8);c.fill();c.fillStyle=rgba([96,92,88],1);c.save();c.translate(ix+30,iy-58);c.rotate(-0.5);c.fillRect(-10,-50,22,56);c.restore();
  c.fillStyle=rgba(LP.shade,0.16);c.beginPath();c.ellipse(ix-50,iy+98,70,9,0,0,TAU);c.fill();};
// the station's readings each October, on one sheet: steady from 1957, then falling, by 1984 to about two thirds (in amber)
function sih_chart(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const h=520;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.amber,light:o.light});
  lp_label(ctx,x+40,y+76,"Above the station, each October",{col:LP.amber});lp_T(ctx,"The ozone layer, 1957 to 1984",x+40,y+128,{w:800,size:36});
  const px=x+70,py=y+190,pw=w-140,ph=240,yr=v=>px+(v-1957)/(1984-1957)*pw,lv=v=>py+ph*(1-v/320);
  ctx.strokeStyle=rgba(LP.mut,0.6);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(px,py+ph);ctx.lineTo(px+pw,py+ph);ctx.stroke();
  for(const v of [1957,1970,1984])lp_T(ctx,String(v),yr(v),py+ph+44,{w:600,size:28,align:v===1957?"left":v===1984?"right":"center",col:LP.mut});
  // the readings: about level until the mid-1970s, then down each year
  const pts=[];for(let v=1957;v<=1984;v++){const base=v<1975?300+8*Math.sin(v*1.3):300-(v-1975)*11.5+6*Math.sin(v*1.7);pts.push([yr(v),lv(base)]);}
  const u=clamp(o.u==null?1:o.u,0,1),m=Math.max(2,Math.round(pts.length*u));
  ctx.lineWidth=5;ctx.lineJoin="round";ctx.lineCap="round";
  ctx.strokeStyle=rgba(LP.ink,0.85);ctx.beginPath();pts.slice(0,Math.min(m,19)).forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();
  if(m>18){ctx.strokeStyle=rgba(LP.amber,1);ctx.beginPath();pts.slice(18,m).forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();}
  const lab=clamp(o.lab||0,0,1);if(lab>0){ctx.save();ctx.globalAlpha*=lab;const e=pts[pts.length-1];ctx.fillStyle=rgba(LP.amber,1);ctx.beginPath();ctx.arc(e[0],e[1],9,0,TAU);ctx.fill();
    lp_T(ctx,"About two thirds",e[0]-24,e[1]+44,{w:800,size:30,align:"right",col:LP.amber});ctx.restore();}
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- Montreal, 1987 */
AG_PLACES.sihHall=c=>lp_paintRoom(c,{light:"day",seed:33,base:[228,220,206]});
// delegates of 1987: jackets and shirts in quiet colours that mean nothing; each painted once (its key)
const SIH_DELEGATES=[
  {key:"sihDel1",name:"",skin:[236,202,174],hair:{style:"side",c:[96,74,58]},glasses:[60,52,46],top:{kind:"suit",c:[80,78,86],inner:[236,234,230],tie:[110,84,72]},breath:0.27},
  {key:"sihDel2",name:"",skin:[118,80,58],hair:{style:"cropped",c:[30,26,24]},top:{kind:"suit",c:[98,86,74],inner:[232,230,224],tie:[72,78,96]},breath:0.25},
  {key:"sihDel3",name:"",skin:[212,170,136],hair:{style:"bun",c:[42,32,28]},earrings:[214,200,170],top:{kind:"blazer",c:[124,114,108],inner:[238,234,228]},breath:0.3},
  {key:"sihDel4",name:"",skin:[226,188,160],hair:{style:"cropped",c:[168,164,160]},glasses:[64,56,50],top:{kind:"blazer",c:[66,68,74],inner:[230,228,224]},breath:0.24}];
const SIH_DX=[520,860,1200,1540];
function sih_delegates(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const ty=814;
  const cut=ty-6;SIH_DELEGATES.forEach((p,i)=>lp_person(ctx,p,SIH_DX[i],ty-170,0.75,{t,flip:i>=2,cut,a,light:{light:"day"}}));
  lp_table(ctx,300,ty,1460,{a,depth:56});
  // a folded card on the table in front of each, left blank: the film names no country
  ctx.save();ctx.globalAlpha*=a;for(const cx of SIH_DX){const by=ty-12,cw=110,ch=40;ctx.fillStyle="rgba(52,36,30,0.16)";ctx.beginPath();ctx.ellipse(cx-6,by+2,cw*0.55,6,0,0,TAU);ctx.fill();
    let g=ctx.createLinearGradient(0,by-ch,0,by);g.addColorStop(0,"#FBF8F2");g.addColorStop(1,"#E9E3D8");ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(cx-cw/2+6,by-ch);ctx.lineTo(cx+cw/2-6,by-ch);ctx.lineTo(cx+cw/2,by);ctx.lineTo(cx-cw/2,by);ctx.closePath();ctx.fill();
    ctx.fillStyle="rgba(255,250,236,0.6)";ctx.fillRect(cx-cw/2+6,by-ch,cw-12,3);}ctx.restore();}
// the plan for the main CFCs, against 1986: each line the plan as it stood; an older line goes grey and dashed when the plan moves
// o.u: [1987, 1990, 1992], each 0 to 1 (drawn on); o.look (0 to 1): the years it looks again, from 1990, at least every four years;
// o.fund (0 to 1): London's fund for poorer countries, under the plan's lines
function sih_plan(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const h=660;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.blue,light:o.light});
  lp_label(ctx,x+44,y+76,"The Montreal Protocol",{col:LP.blue});lp_T(ctx,"The main CFCs, against 1986",x+44,y+130,{w:800,size:40});
  const px=x+130,py=y+190,pw=w-520,ph=330,yr=v=>px+(v-1986)/(2000-1986)*pw,lv=v=>py+ph*(1-v/100);
  ctx.strokeStyle=rgba(LP.mut,0.6);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px,py+ph);ctx.lineTo(px+pw,py+ph);ctx.stroke();
  lp_T(ctx,"All",px-14,py+10,{w:600,size:28,align:"right",col:LP.mut});lp_T(ctx,"None",px-14,py+ph+10,{w:600,size:28,align:"right",col:LP.mut});
  for(const v of [1986,1990,1996,2000])lp_T(ctx,String(v),yr(v),py+ph+46,{w:600,size:28,align:"center",col:LP.mut});
  const L=[[1998,50,"1987: half by 1998"],[2000,0,"1990: none by 2000"],[1996,0,"1992: none by 1996"]],u=o.u||[0,0,0];
  L.forEach(([ye,ve,lab],i)=>{const k=clamp(u[i],0,1);if(k<=0)return;const old=i<2&&clamp(u[i+1],0,1)>0.5,x0=yr(1989),y0=lv(100),x1=yr(ye),y1=lv(ve);
    ctx.save();ctx.lineCap="round";ctx.lineWidth=old?4:6;ctx.strokeStyle=old?rgba(LP.mut,0.55):rgba(LP.blue,1);if(old)ctx.setLineDash([12,12]);
    ctx.beginPath();ctx.moveTo(yr(1986),y0);ctx.lineTo(x0,y0);ctx.lineTo(lerp(x0,x1,k),lerp(y0,y1,k));if(k>=1&&ye<2000)ctx.lineTo(yr(2000),y1);ctx.stroke();ctx.restore();
    if(k>=0.98){const ly=y+250+i*96;ctx.save();ctx.globalAlpha*=clamp((k-0.98)*50,0,1);
      ctx.fillStyle=old?rgba(LP.mut,0.6):rgba(LP.blue,1);ctx.beginPath();ctx.arc(x+w-360,ly-10,10,0,TAU);ctx.fill();
      lp_T(ctx,lab,x+w-336,ly,{w:old?600:800,size:30,col:old?LP.mut:LP.ink});ctx.restore();}});
  // the years it looks again: from 1990, at least every four years
  const lk=clamp(o.look||0,0,1);if(lk>0){[1990,1994,1998].forEach((v,i)=>{const kk=clamp(lk*3-i,0,1);if(kk<=0)return;ctx.fillStyle=rgba(LP.blue,kk);
      ctx.beginPath();ctx.arc(yr(v),py+ph,11,0,TAU);ctx.fill();});
    lp_T(ctx,"Look again",yr(1990)-24,py+ph-16,{w:800,size:28,align:"right",col:LP.blue,a:lk});}
  // from London, 1990: a fund to help poorer countries follow
  const fd=clamp(o.fund||0,0,1);if(fd>0)lp_T(ctx,"And a fund to help poorer countries follow",x+44,y+h-34,{w:600,size:28,col:LP.ink,a:fd});
  ctx.restore();return{x,y,w,h};}
