/* ===== Owning the outcome: the university, 2027 and after (imagined) =====
   The places are the people kit's (films/people-first/shared/src/places.js): the team's room, Helena's corner, the campus and a
   teaching room. This file holds what is this film's own in them: who sits where, the seedling Helena gives Ivy on her first day
   as owner (it grows on the window's sill behind her desk through the film), what Ivy's screen shows and the small cards that come
   out of it, the sensor's count by a teaching room's door, someone who passes on the campus, and the letters of a RACI chart worn
   by the people they belong to. */
AG_PLACES.ooTeam=PK.place.team;AG_PLACES.ooCorner=PK.place.corner;AG_PLACES.ooCampus=PK.place.campus;AG_PLACES.ooRoom=PK.place.lecture;
const OO_T=PK.ROOMS.team,OO_L=PK.ROOMS.lecture,OO_CA=PK.ROOMS.campus,OO_CO=PK.ROOMS.corner;
const OO_HI=PK.hAt(OO_T.mid,OO_T.eye),OO_HB=PK.hAt(OO_T.back,OO_T.eye),OO_HC=PK.hAt(OO_CA.near,OO_CA.eye),OO_IVY={x:560,floor:OO_T.mid};
const oo_hT=fl=>PK.hAt(fl,OO_T.eye),oo_hL=fl=>PK.hAt(fl,OO_L.eye);
const OO_TEACHER=PK.extra(21),OO_ORDER=[5,9,6,8,10,4,7,1,0,2,3];
// a face that speaks from t0 to t1, on a base expression
const oo_says=(base,tt,t0,t1)=>{const e=PK.exprMix(base,base,0);e.open=Math.max(e.open||0,PK.talk(tt,t0,t1)*0.75);return e;};

/* ---------------------------------------------------------------- the team's room
   o.clock: the time on the wall (null: no hands); o.sam, o.jun, o.ivy: what PK.atDesk takes for each (null: the desk stands empty);
   o.pot: how grown the seedling on the sill is (null: none yet); o.show: what her screen shows; o.behind(x): what stands between
   the back desks and hers (someone at the board); o.away: Ivy has got up, and her chair stands as o.ivy left it (turned); o.bare:
   the room with nobody in it and nothing going on (a blank screen, no steam). Returns {ivy, sam, jun}: their joints. */
function oo_team(x,tt,o){o=o||{};const r={};PK.clock(x,OO_T.clock[0],OO_T.clock[1],OO_T.clock[2],o.clock===undefined?9:o.clock);
  if(o.pot!=null){PK.S.begin(x,{lw:2.6,sh:3});PK.potted(x,OO_T.sill[0],OO_T.sill[1],1.3+0.5*o.pot,0.6+0.4*o.pot);}
  r.sam=PK.atDesk(x,o.sam===null?null:"sam",1230,OO_T.back,OO_HB,Object.assign({t:tt,w:0.45*OO_HB},o.sam||{}));
  r.jun=PK.atDesk(x,o.jun===null?null:"jun",1808,OO_T.back,OO_HB,Object.assign({t:tt+3,flip:true,w:0.45*OO_HB},o.jun||{}));
  if(o.behind)o.behind(x);
  r.ivy=PK.atDesk(x,o.ivy===null||o.away?null:"ivy",OO_IVY.x,OO_IVY.floor,OO_HI,Object.assign({t:tt+1,flip:true,w:0.84*OO_HI,sx:205,screen:"monitor",show:o.bare?null:o.show||oo_scrTicks(1),
    on:(c,D)=>{PK.S.begin(c,{lw:2.6,sh:3});PK.mug(c,D.x1+34,D.top,0.7,PK.col("mug"),tt,!o.bare&&o.steam!==false);}},o.ivy||{}));return r;}
// the room with nobody in it: what a later moment in it passes through (the agent films' AG_BARE)
AG_BARE.ooTeam=(x,tt)=>oo_team(x,tt,{sam:null,jun:null,ivy:null,clock:null,bare:true});
// the seedling in its pot, carried in a hand (PK.person's hold); g how grown
const oo_potHold=g=>(c,h,deg,J)=>{PK.S.begin(c,{lw:2.6,sh:3});PK.potted(c,h[0]+14*J.u,h[1]+34*J.u,1.3+0.5*g,0.6+0.4*g);};
/* what Ivy's screen shows: the refresh's checks, one row each, with its tick; k: how many are ticked (0 to 1); warn: the rows turn
   amber (0 to 1), as when she holds the refresh; no words: the screen is too small for them */
const oo_scrTicks=(k,warn)=>(c,x,y,w,h)=>{const U=PK.u,n=4,rh=h/(n+0.6);warn=warn||0;for(let i=0;i<n;i++){const yy=y+rh*(i+0.55),on=U.clamp(k*n-i,0,1),col=U.mix(PK.C.green,PK.C.amber,warn);
    c.fillStyle=U.css([206,208,204]);c.beginPath();U.rrect(c,x+w*0.1,yy-rh*0.16,w*(0.44+0.1*((i*3)%3)),rh*0.32,4);c.fill();
    c.fillStyle=U.css(U.mix([206,208,204],col,on));c.beginPath();c.arc(x+w*0.84,yy,rh*0.3,0,U.TAU);c.fill();
    // the mark on each round: a tick, which gives way to two bars (a pause) as the row turns amber
    c.strokeStyle="#fff";c.lineWidth=2.4;c.lineCap="round";c.lineJoin="round";
    if(on>0.5&&warn<0.999){c.save();c.globalAlpha*=1-warn;c.beginPath();c.moveTo(x+w*0.84-5,yy);c.lineTo(x+w*0.84-1.5,yy+4);c.lineTo(x+w*0.84+5.5,yy-4);c.stroke();c.restore();}
    if(on>0.5&&warn>0.001){c.save();c.globalAlpha*=warn;c.beginPath();c.moveTo(x+w*0.84-3,yy-5);c.lineTo(x+w*0.84-3,yy+5);c.moveTo(x+w*0.84+3,yy-5);c.lineTo(x+w*0.84+3,yy+5);c.stroke();c.restore();}}};
/* a small card that comes out of Ivy's screen: a box w by h at (bx, by), with a tail to the screen at (tx, ty); draw(c, x, y, w, h)
   fills it. The chart stays small: it is something Ivy looks at, not the picture. */
function oo_callout(c,bx,by,w,h,tx,ty,a,draw){if(a<=0.004)return;const U=PK.u,S=PK.S,col=PK.col("board");c.save();c.globalAlpha*=a;const k=0.94+0.06*a;c.translate(tx,ty);c.scale(k,k);c.translate(-tx,-ty);
  const mx=U.clamp(tx,bx+50,bx+w-50);c.beginPath();U.pg(c,[[mx-20,by+h-6],[mx+20,by+h-6],[U.lerp(mx,tx,0.8),U.lerp(by+h,ty,0.8)]]);c.lineJoin="round";c.lineWidth=5;c.strokeStyle=U.css(S.ink);c.stroke();c.fillStyle=U.css(col);c.fill();
  PK.box(c,bx,by,w,h,18,col,1);c.fillStyle=U.css(col);c.beginPath();U.pg(c,[[mx-17,by+h-6],[mx+17,by+h-6],[mx+15,by+h+3],[mx-15,by+h+3]]);c.fill();draw(c,bx,by,w,h);c.restore();}
// the forty rooms' counts, week by week: level, then down to about a quarter; p: how far the line is drawn
function oo_dropChart(c,x,y,w,h,p){const U=PK.u,v=[1,0.96,1.03,1,0.97,1.02,0.27,0.24,0.25],x0=x+38,x1=x+w-38,y0=y+h-84,y1=y+76,px=i=>U.lerp(x0,x1,i/(v.length-1)),py=q=>U.lerp(y0,y1,q/1.1);
  ag_T(c,"FORTY ROOMS",x+30,y+52,{w:800,size:28,ls:3,col:PK.C.mut});
  c.save();c.lineCap="round";c.lineJoin="round";c.strokeStyle=U.css(PK.C.mut,0.5);c.lineWidth=3;c.beginPath();c.moveTo(x0,y0+6);c.lineTo(x1,y0+6);c.stroke();
  c.setLineDash([6,8]);c.beginPath();c.moveTo(x0,py(1));c.lineTo(x1,py(1));c.stroke();c.setLineDash([]);
  const n=U.clamp(p,0,1)*(v.length-1);c.lineWidth=6;
  for(let i=0;i<v.length-1&&i<n;i++){const u=Math.min(1,n-i);c.strokeStyle=U.css(i>=5?PK.C.amber:PK.C.orange);c.beginPath();c.moveTo(px(i),py(v[i]));c.lineTo(U.lerp(px(i),px(i+1),u),U.lerp(py(v[i]),py(v[i+1]),u));c.stroke();}
  c.restore();ag_T(c,"Down to about a quarter",x+30,y+h-28,{w:700,size:28,col:PK.C.amber,a:U.pin(p,0.8,0.2)});}
// one room, one hour: four counts now arrive, and the model kept only the first; p: how far the card has filled
function oo_hourCard(c,x,y,w,h,p){const U=PK.u,n=["9","31","34","33"],tm=[":00",":15",":30",":45"],cx=i=>x+68+i*((w-136)/3);
  ag_T(c,"ONE ROOM, ONE HOUR",x+30,y+52,{w:800,size:28,ls:3,col:PK.C.mut});
  n.forEach((s,i)=>{const a=U.pin(p,0.1+i*0.12,0.15);ag_T(c,s,cx(i),y+124,{w:800,size:44,align:"center",col:i?PK.C.orange:PK.C.amber,a:i?a*(1-0.55*U.pin(p,0.75,0.2)):a});ag_T(c,tm[i],cx(i),y+166,{w:600,size:28,align:"center",col:PK.C.mut,a});});
  const k=U.pin(p,0.62,0.2);if(k>0){c.save();c.globalAlpha*=k;c.strokeStyle=U.css(PK.C.amber);c.lineWidth=5;c.beginPath();c.ellipse(cx(0),y+110,44,36,0,0,U.TAU);c.stroke();c.restore();}
  ag_T(c,"kept",cx(0),y+h-26,{w:700,size:28,align:"center",col:PK.C.amber,a:k});ag_T(c,"dropped",(cx(1)+cx(3))/2,y+h-26,{w:700,size:28,align:"center",col:PK.C.mut,a:U.pin(p,0.78,0.2)});}

/* ---------------------------------------------------------------- a teaching room
   o.n: how many seats are taken (11: full); o.a fades the class, all of it as one picture, as the counts would have it; o.open: the
   door (0 to 1); o.seen: the sensor has just seen someone (0 to 1); o.teacher: false, nobody at the board; o.between: PK.audience's,
   for someone on the way to a seat. oo_count writes what the sensor counts beside it. */
const OO_NOTES={lean:2,head:3,aN:[24,74,"grip"],aF:[6,14],lN:[-2,-2],lF:[4,3]},OO_NOTES2={lean:3,head:-4,aN:[28,86,"grip"],aF:[8,18],lN:[-2,-2],lF:[5,4]};
// the teacher's notes, a sheet in her hand
const oo_notes=(c,h,deg,J)=>{const u=J.u;PK.S.begin(c,{lw:2.2,sh:3});PK.S.poly(c,[[h[0]-14*u,h[1]-104*u,1],[h[0]+62*u,h[1]-112*u,1],[h[0]+70*u,h[1]-8*u,1],[h[0]-6*u,h[1],1]],PK.col("board"),{exact:true});
  PK.S.line(c,cc=>{for(let i=0;i<4;i++){cc.moveTo(h[0]+2*u,h[1]-(88-i*20)*u);cc.lineTo(h[0]+52*u,h[1]-(93-i*20)*u);}},PK.C.mut,0.5);};
function oo_class(x,tt,o){o=o||{};const d=OO_L.door,n=o.n==null?11:o.n,a=o.a==null?1:o.a,A={order:OO_ORDER,look:o.look==null?0.6:o.look};
  if(o.open)PK.door(x,d.x,800,d.w,d.h,{col:PK.col("doorCool"),glass:true,open:o.open,beyond:[196,190,180]});
  PK.sensor(x,OO_L.sensor[0],OO_L.sensor[1],o.seen||0);
  const who=c=>{PK.audience(c,tt,n,Object.assign({between:o.between},A));
    if(o.teacher!==false)PK.person(c,OO_TEACHER,1560,856,oo_hL(856),PK.poseMix(OO_NOTES,OO_NOTES2,0.5+0.5*Math.sin(tt*0.7)),{t:tt,flip:true,hold:oo_notes,expr:{brow:0.3,smile:0.45,open:PK.talk(tt,0,1e9)*0.5}});};
  if(a>=0.999){who(x);return;}
  // the empty chairs, then everyone over them as one picture, so nobody shows through anybody
  PK.audience(x,tt,0,A);if(a<=0.004)return;
  const cv=x.canvas,[bc,bx]=ag_buf("ooClass",cv.width,cv.height);bx.setTransform(x.getTransform());who(bx);
  x.save();x.setTransform(1,0,0,1,0,0);x.globalAlpha*=a;x.drawImage(bc,0,0);x.restore();}
AG_BARE.ooRoom=(x,tt)=>oo_class(x,tt,{n:0,teacher:false});
const oo_count=(x,text,a,col)=>PK.tag(x,OO_L.sensor[0]+62,OO_L.sensor[1],text,a==null?1:a,{align:"left",col:col||PK.C.orange,weight:800});
// someone who comes in at the door and walks to a seat in the back row, then sits: from t0, over d seconds
function oo_toSeat(x,tt,who,seat,t0,d){if(tt<t0)return 0;const x0=OO_L.door.x+24;
  PK.walk(x,who,tt,{x0,x1:seat.x,t0,t1:t0+d,floor:xx=>PK.u.lerp(812,seat.fl,PK.u.clamp((xx-x0)/(seat.x-x0),0,1)),h:oo_hL,then:"sit"},{expr:"neutral",shade:0,a:PK.u.pin(tt,t0,0.4)});return PK.u.pio(tt,t0+0.1,t0+0.9,0.25);}

/* ---------------------------------------------------------------- the campus
   Someone who passes, away from the people the film follows: in from the right along the front path, then up the path to the
   entrance, where they go in (o.out: the other way: out of the entrance, down the path and off to the right). t0: when they set
   off. They keep one pace in the picture's depth too (t2 seconds and n2 strides up the path), so their feet don't slide. */
const OO_WAY={a:[2040,884],b:[1300,884],d:[1478,606],v:190,n2:5,t2:7};
function oo_passer(x,tt,who,t0,o){o=o||{};const U=PK.u,W=OO_WAY,e=OO_CA.eye,d1=(W.a[0]-W.b[0])/W.v,T=d1+W.t2,amp=PK.ampOf(who);let u=tt-t0;if(u<0||u>T)return null;if(o.out)u=T-u;
  const n1=(W.a[0]-W.b[0])/PK.strideOf(PK.hAt(W.a[1],e),amp);let px,fl,step,k=0;
  if(u<d1){px=U.lerp(W.a[0],W.b[0],u/d1);fl=W.a[1];step=n1*u/d1;}
  else{k=(u-d1)/W.t2;fl=e+1/U.lerp(1/(W.b[1]-e),1/(W.d[1]-e),k);px=U.lerp(W.b[0],W.d[0],(W.b[1]-fl)/(W.b[1]-W.d[1]));step=n1+W.n2*k;}
  const turn=U.pin(u,d1-0.25,0.5);
  return PK.person(x,who,px,fl,PK.hAt(fl,e),PK.poseWalk(o.out?n1+W.n2-step:step,1,amp),{t:tt,flip:o.out?turn:1-turn,far:0.1+0.3*k,a:1-U.pin(u,T-0.7,0.7),expr:"neutral"});}

/* ---------------------------------------------------------------- Helena's corner: Helena and Ivy at the round table
   o.lean (0 to 1): Helena leans in to ask; o.up (0 to 1): Ivy looks up, and sits up; o.he, o.ie: their faces; o.ask (0 to 1):
   Helena's open hand; o.t0: when the shot starts (two people cross the lawn outside once, from then). Returns {helena, ivy}. */
const OO_SITH={mode:"sit",lean:2,head:0,aN:[24,76],aF:[28,80],lN:[86,3],lF:[82,-5]},OO_SITH2={mode:"sit",lean:13,head:-5,aN:[40,80,"open"],aF:[36,78],lN:[86,5],lF:[82,-6]};
const OO_SITI={mode:"sit",lean:9,head:17,aN:[26,74,"grip"],aF:[30,78,"grip"],lN:[86,8],lF:[82,-2]},OO_SITI2={mode:"sit",lean:1,head:-3,aN:[24,74,"grip"],aF:[28,78,"grip"],lN:[86,6],lF:[82,-3]};
// a closed notebook lying on the table
const oo_pad=(c,x,y)=>{const S=PK.S,c0=PK.col("laptop");S.poly(c,[[x-86,y-6,1],[x+70,y-12,1],[x+92,y+6,1],[x-70,y+14,1]],c0,{exact:true});S.poly(c,[[x-84,y-12,1],[x+68,y-18,1],[x+70,y-12,1],[x-86,y-6,1]],PK.u.lt(c0,0.25),{w:0.6,flat:true,exact:true});};
function oo_corner(x,tt,o){o=o||{};const U=PK.u,S=PK.S,{F,H,hx,ix,tx,rx,ty,win}=OO_CO,lean=o.lean||0,up=o.up||0,ask=o.ask||0,t0=o.t0||0,lw={lw:3.4,far:0,sh:5};
  x.save();x.beginPath();x.rect(win[0],win[1],win[2],win[3]);x.clip();
  for(const [i,ts,d,left,dy,h] of [[7,t0+1,22,false,34,92],[12,t0+7,26,true,24,96]]){if(tt<ts||tt>ts+d)continue;
    PK.walk(x,PK.extra(i),tt,{x0:left?win[0]+win[2]+40:win[0]-40,x1:left?win[0]-40:win[0]+win[2]+40,t0:ts,t1:ts+d,floor:win[1]+win[3]-dy,h},{far:0.55,shade:0});}
  x.restore();PK.windowFrame(x,win[0],win[1],win[2],win[3],{});
  const hp=PK.poseMix(OO_SITH,OO_SITH2,lean),ip=PK.poseMix(OO_SITI,OO_SITI2,up);
  S.begin(x,lw);PK.chair(x,hx-10,F,H,false,{});PK.chair(x,ix+10,F,H,true,{col:PK.PAL.chair2});
  PK.person(x,"helena",hx,F,H,hp,{t:tt,part:"lower"});PK.person(x,"ivy",ix,F,H,ip,{t:tt+1,flip:true,part:"lower"});
  S.begin(x,lw);PK.table(x,tx,ty,rx,F);oo_pad(x,tx+52,ty-8);
  S.begin(x,{lw:2.6,far:0,sh:3});PK.mug(x,tx-60,ty+10,0.9,PK.col("mug2"),tt,true);
  // Ivy's mug, in both her hands: drawn under them, in her own mirrored picture
  const mx=1140,my=ty+8-8*up,mug=(c,h,deg,J)=>{S.begin(c,{lw:2.6,far:0,sh:3});PK.mug(c,2*ix-mx,my,0.9,PK.col("mug"),tt,true);S.begin(c,{lw:U.clamp(H*0.0056,1.4,6.5),sh:U.clamp(H*0.0078,1.5,8.5)});};
  const helena=PK.person(x,"helena",hx,F,H,hp,{t:tt,part:"upper",expr:o.he,gaze:[1,0.2],reachN:[U.lerp(790,838,ask),ty-4-40*ask],reachF:[806,ty-12]});
  const ivy=PK.person(x,"ivy",ix,F,H,ip,{t:tt+1,flip:true,part:"upper",expr:o.ie,gaze:[1,U.lerp(1,-0.2,up)],under:mug,reachN:[mx+20,my-30],reachF:[mx-22,my-28]});
  return{helena,ivy};}

/* ---------------------------------------------------------------- words this film puts in the picture */
// a letter of the RACI chart, worn over the head of the person it belongs to: a round badge; big: the one A
function oo_letter(x,J,s,a,big){if(a<=0.004)return;const U=PK.u,r=big?40:30,cx=J.hc[0],cy=J.hc[1]-J.p.head*J.u*0.62-r-14,k=0.6+0.4*U.clamp(a,0,1);x.save();x.globalAlpha*=U.clamp(a,0,1);
  x.fillStyle=U.css(big?PK.C.blue:PK.col("board"));x.beginPath();x.arc(cx,cy,r*k,0,U.TAU);x.fill();x.lineWidth=3;x.strokeStyle=U.css(big?U.dk(PK.C.blue,0.3):PK.S.ink);x.stroke();
  ag_T(x,s,cx,cy+(big?15:12),{w:800,size:big?44:34,align:"center",col:big?PK.C.white:PK.C.ink});x.restore();}
// where a mark worn over someone's head goes: [x, y]
const oo_over=(J,r)=>[J.hc[0],J.hc[1]-J.p.head*J.u*0.62-r-14];
// a line between two marks worn over two heads, bowed upwards: what joins two people's parts of the work; p: how far it is drawn
function oo_link(x,A,B,p,col,a){if(a<=0.004||p<=0)return;const U=PK.u,mx=(A[0]+B[0])/2,my=Math.min(A[1],B[1])-70,n=24;x.save();x.globalAlpha*=U.clamp(a,0,1);x.strokeStyle=U.css(col||PK.C.amber);x.lineWidth=5;x.lineCap="round";x.setLineDash([14,13]);x.beginPath();
  for(let i=0;i<=n*U.clamp(p,0,1);i++){const u=i/n,q=[(1-u)*(1-u)*A[0]+2*u*(1-u)*mx+u*u*B[0],(1-u)*(1-u)*A[1]+2*u*(1-u)*my+u*u*B[1]];i?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1]);}x.stroke();x.restore();}
// a round mark with two bars: something held, not stopped for good
function oo_pause(c,x,y,r,a,col){if(a<=0.004)return;const U=PK.u;c.save();c.globalAlpha*=U.clamp(a,0,1);c.fillStyle=U.css(col||PK.C.amber);c.beginPath();c.arc(x,y,r,0,U.TAU);c.fill();
  c.strokeStyle="#fff";c.lineWidth=r*0.26;c.lineCap="round";c.beginPath();c.moveTo(x-r*0.26,y-r*0.38);c.lineTo(x-r*0.26,y+r*0.38);c.moveTo(x+r*0.26,y-r*0.38);c.lineTo(x+r*0.26,y+r*0.38);c.stroke();c.restore();}
// the check Ivy adds, as a card from her screen: its three lines come one by one (la: how far each has come in)
function oo_checkCard(c,x,y,w,h,la){const U=PK.u;ag_T(c,"IVY'S NEW CHECK",x+30,y+52,{w:800,size:28,ls:3,col:PK.C.blue});
  ag_T(c,"A drop like this one",x+30,y+104,{w:700,size:30,a:U.clamp(la[0],0,1)});oo_pause(c,x+48,y+138,18,la[1]);ag_T(c,"holds the refresh",x+80,y+148,{w:800,size:30,col:PK.C.amber,a:U.clamp(la[1],0,1)});
  ag_T(c,"before anyone reads it",x+30,y+192,{w:700,size:30,a:U.clamp(la[2],0,1)});}
// a sheet pinned to the whiteboard, with a kick and a line of words; a: how far it has come in
function oo_pinned(x,bx,by,kick,title,a,col){if(a<=0.004)return;const U=PK.u,w=Math.max(ag_tw(x,kick.toUpperCase(),{w:800,size:28,ls:3}),ag_tw(x,title,{w:800,size:32}))+52,h=112;x.save();x.globalAlpha*=U.clamp(a,0,1);const k=0.94+0.06*a;x.translate(bx+w/2,by);x.scale(k,k);x.translate(-bx-w/2,-by);
  PK.S.begin(x,{lw:2.4,sh:4});PK.sheet(x,bx,by,w,h,{col:PK.col("board"),pin:col||PK.C.blue,r:6});ag_T(x,kick.toUpperCase(),bx+26,by+50,{w:800,size:28,ls:3,col:col||PK.C.blue});ag_T(x,title,bx+26,by+92,{w:800,size:32});x.restore();}
