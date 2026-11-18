/* ===== Owning the outcome: the university, 2027 and after (imagined) =====
   The places are the people kit's (films/people-first/shared/src/places.js): the team's room, Helena's corner, the campus and a
   teaching room; and, apart from the scene, a board seen close and a page of Ivy's notebook (concepts.js). This file holds what
   is this film's own in them: who sits where, the seedling Helena gives Ivy on her first day as owner (it grows on the window's
   sill behind her desk through the film), what Ivy's screen shows and the small cards that come out of it, the sensor's count by
   a teaching room's door, someone who passes on the campus, what Carmen writes on the board and what Ivy writes in her notebook,
   and what Ivy, Graham and Mei say to each other in a call and in a chat. */
AG_PLACES.ooTeam=PK.place.team;AG_PLACES.ooCorner=PK.place.corner;AG_PLACES.ooCampus=PK.place.campus;AG_PLACES.ooRoom=PK.place.lecture;
AG_PLACES.ooBoard=PK.place.board;AG_PLACES.ooNotes=c=>PK.place.notes(c,{});
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
   the room with nobody in it and nothing going on (a blank screen, no steam); o.book: her notebook lies on her desk: shut, between
   her screen and her keys (0); open in front of her, the keys pushed back (1: give her PK.atDesk's keysBack, as oo_jot does); or
   shut where it lay open (2; between 1 and 2 it closes); o.pen (0 to 1): her pen lies beside it. Returns {ivy, sam, jun}: their
   joints. */
function oo_team(x,tt,o){o=o||{};const r={};PK.clock(x,OO_T.clock[0],OO_T.clock[1],OO_T.clock[2],o.clock===undefined?9:o.clock);
  if(o.pot!=null){PK.S.begin(x,{lw:2.6,sh:3});PK.potted(x,OO_T.sill[0],OO_T.sill[1],1.3+0.5*o.pot,0.6+0.4*o.pot);}
  r.sam=PK.atDesk(x,o.sam===null?null:"sam",1230,OO_T.back,OO_HB,Object.assign({t:tt,w:0.45*OO_HB},o.sam||{}));
  r.jun=PK.atDesk(x,o.jun===null?null:"jun",1808,OO_T.back,OO_HB,Object.assign({t:tt+3,flip:true,w:0.45*OO_HB},o.jun||{}));
  if(o.behind)o.behind(x);
  r.ivy=PK.atDesk(x,o.ivy===null||o.away?null:"ivy",OO_IVY.x,OO_IVY.floor,OO_HI,Object.assign({t:tt+1,flip:true,w:0.84*OO_HI,sx:205,screen:"monitor",show:o.bare?null:o.show||oo_scrTicks(1),
    on:(c,D)=>{PK.S.begin(c,{lw:2.6,sh:3});PK.mug(c,D.x1+34,D.top,0.7,PK.col("mug"),tt,!o.bare&&o.steam!==false);
      const lie=(a,f)=>{if(a<=0.004)return;c.save();c.globalAlpha*=Math.min(1,a);PK.S.begin(c,{lw:2.2,sh:3});f();c.restore();};
      if(o.book!=null){if(o.book<=0)lie(1,()=>PK.notebook(c,OO_IVY.x-314,D.top,0.86,{}));
        else{lie(2-o.book,()=>PK.notebook(c,OO_IVY.x-164,D.top-2,0.86,{open:true}));lie(o.book-1,()=>PK.notebook(c,OO_IVY.x-214,D.top,0.86,{}));}}
      if(o.pen)lie(o.pen,()=>PK.S.fill(c,cc=>PK.u.capsule(cc,[OO_IVY.x-104,D.top-3],[OO_IVY.x-66,D.top-4],3.2,2.6),PK.C.blue,{w:0.6}));}},o.ivy||{}));return r;}
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
/* what her screen says, as a card that comes out of it: rows of [words, how far each has come in (0 to 1), its colour], each with
   its tick. y: the card's top; a: how far the card is there */
function oo_screen(x,y,a,rows){const U=PK.u,wd=Math.max(...rows.map(r=>ag_tw(x,r[0],{w:700,size:30})));
  PK.callout(x,40,y,wd+118,34+58*rows.length,[205,474],a,(c,bx,by)=>rows.forEach(([s,k,col],i)=>{const yy=by+46+58*i,q=U.clamp(k==null?1:k,0,1);PK.tick(c,bx+46,yy,20,q);ag_T(c,s,bx+82,yy+11,{w:700,size:30,col:col||PK.C.ink,a:q});}));}
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
function oo_toSeat(x,tt,who,seat,t0,d){if(tt<t0)return 0;const x0=OO_L.door.x+24,o={expr:"neutral",shade:0,a:PK.u.pin(tt,t0,0.4)};
  if(tt<t0+d)PK.walk(x,who,tt,{x0,x1:seat.x,t0,t1:t0+d,floor:xx=>PK.u.lerp(812,seat.fl,PK.u.clamp((xx-x0)/(seat.x-x0),0,1)),h:oo_hL},o);
  else PK.person(x,who,seat.x,seat.fl,oo_hL(seat.fl),PK.poseSit(PK.u.pin(tt,t0+d,0.7)),Object.assign(o,{t:tt}));
  return PK.u.pio(tt,t0+0.1,t0+0.9,0.25);}

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
// a round mark with two bars: something held, not stopped for good
function oo_pause(c,x,y,r,a,col){if(a<=0.004)return;const U=PK.u;c.save();c.globalAlpha*=U.clamp(a,0,1);c.fillStyle=U.css(col||PK.C.amber);c.beginPath();c.arc(x,y,r,0,U.TAU);c.fill();
  c.strokeStyle="#fff";c.lineWidth=r*0.26;c.lineCap="round";c.beginPath();c.moveTo(x-r*0.26,y-r*0.38);c.lineTo(x-r*0.26,y+r*0.38);c.moveTo(x+r*0.26,y-r*0.38);c.lineTo(x+r*0.26,y+r*0.38);c.stroke();c.restore();}
// the check Ivy adds, as a card from her screen: its three lines come one by one (la: how far each has come in)
function oo_checkCard(c,x,y,w,h,la){const U=PK.u;ag_T(c,"IVY'S NEW CHECK",x+30,y+52,{w:800,size:28,ls:3,col:PK.C.blue});
  ag_T(c,"A drop like this one",x+30,y+104,{w:700,size:30,a:U.clamp(la[0],0,1)});oo_pause(c,x+48,y+138,18,la[1]);ag_T(c,"holds the refresh",x+80,y+148,{w:800,size:30,col:PK.C.amber,a:U.clamp(la[1],0,1)});
  ag_T(c,"before anyone reads it",x+30,y+192,{w:700,size:30,a:U.clamp(la[2],0,1)});}

/* ---------------------------------------------------------------- the key ideas, apart from the scene
   Carmen Vidal, a consultant who works with the team now and then, explains each idea at the team's board (PK.teach). The film
   cuts between the room, where its board shows her lines small, and the board seen close (the place ooBoard), where they are
   large enough to read: both draw the same rows at the same times, so she is at the same line in both. What Ivy keeps from each
   part of the story goes in her notebook (PK.notes, the place ooNotes). Every time comes from the voice: sc is the chapter, w
   a word's time in a line. Colour means what it means in the film: blue a plan or a rule, green done or of value, amber a risk. */
const OO_RB={x:742,y:262,k:0.35,deco:true,floor:848,rest:1212};
// the team's board in a wide shot: the same rows, small; who: "carmen", or null when she has gone and her lines are still up
const oo_roomBoard=(cx,tt,rows,who,o)=>PK.teach(cx,who,tt,rows,Object.assign({},OO_RB,{h:oo_hT(OO_RB.floor)},o||{}));
/* Each row has the time the voice says it; PK.pace then makes a row wait until Carmen can have walked to it. So the boards are
   laid out for someone who walks: a row goes on to the right of the one before where it can (words in another colour on the
   same line; the short row under a long one where the long one ended), what is added to rows that are there goes to their
   right, and nothing is underlined or struck back along its words, which would leave her standing on the rows above. */
// 1. what a data product owner is, and the product's promise
const oo_boardA=(sc,w)=>[
  {s:"Zhamak Dehghani, data mesh",x:70,y:92,size:42,col:"mut",at:sc.cues.mesh+0.1,d:1.0},
  {s:"Data product owner",x:70,y:188,size:76,w:700,col:"blue",at:w("mesh","data product",-0.5),d:1.2},
  {s:"answers for what the product does",x:70,y:296,size:50,at:w("mesh","answers",-0.1),d:1.5},
  {s:"for its readers",size:50,w:700,col:"green",at:w("mesh","for its",-0.1),d:0.8},
  // what comes later, when she has stepped clear, goes at the right: a short walk, and the heading stays in view as she writes it
  {s:"Its promise:",x:730,y:404,size:52,at:w("promise","promise",-0.3),d:0.8},
  {s:"every Monday by 7:00",x:730,y:476,size:50,w:700,col:"blue",at:w("promise","every",-0.1),d:1.3}];
/* 2. many do part of the work, one answers for the outcome: a RACI chart's letters, in a column to the right of the names. An R
   for each who does part of the work, as the voice names the chart; then the one A, ringed, beside Ivy */
const oo_boardB=(sc,w)=>{const tr=w("one","Ray-see",-0.15),ta=w("one","A,",-0.3),R=(y,i)=>({s:"R",x:780,y,size:56,w:700,col:"mut",at:tr+i*0.36,d:0.3});return[
  {s:"Many do the work",x:70,y:104,size:58,at:w("many","Many",-0.1),d:1.2},
  {s:"Facilities: the sensors",x:120,y:176,size:50,at:w("many","Facilities",0.1),d:1.0},
  {s:"Sam: the platform",x:120,y:240,size:50,at:w("many","Sam",0.1),d:0.8},
  {s:"Jun: reviews her changes",x:120,y:304,size:50,at:w("many","Jun",0.1),d:1.1},
  {s:"Ivy: the outcome",x:120,y:392,size:50,w:700,col:"blue",at:w("one","One",-0.1),d:1.1},
  R(176,0),R(240,1),R(304,2),
  {s:"A",x:776,y:392,size:64,w:700,col:"blue",at:ta,d:0.3},{k:"ring",x:797,y:372,rx:44,ry:44,col:"blue",at:ta+0.4,d:0.45},
  {s:"accountable:",x:880,y:392,size:50,at:w("one","accountable",-0.1),d:0.6},
  {s:"only one",x:880,y:462,size:54,w:700,col:"blue",at:w("one","only one",-0.1),d:0.6}];};
/* 3. the review: each part was right (Carmen ticks each as the room hears it), and what failed lies between them; then a just
   culture's questions: two to ask, and one not to */
const oo_boardC=(sc,w)=>{const rows=[],tk=[w("each","better",0.4),w("each","count",0.4),w("each","built",0.5)];
  ["Sensors","Platform","The step"].forEach((s,i)=>rows.push({k:"box",x:70+i*360,y:44,w:300,h:96,col:"ink"},{s,x:96+i*360,y:110,size:54},{k:"tick",x:328+i*360,y:94,r:20,col:"green",at:tk[i]}));
  return rows.concat([
    {s:"What failed: how the parts fit",x:236,y:216,size:52,w:700,col:"amber",at:w("fit","What failed",-0.1),d:1.4},
    // the two joins, ringed from where she stands: the nearer one first
    {k:"ring",x:760,y:92,rx:38,ry:62,col:"amber",at:w("fit","parts",0.1),d:0.5},{k:"ring",x:400,y:92,rx:38,ry:62,col:"amber",at:w("fit","together",0.1),d:0.5},
    {s:"Sidney Dekker:",x:70,y:316,size:42,col:"mut",at:sc.cues.dekker+0.1,d:0.9},
    {s:"a just culture",size:72,w:700,col:"blue",at:w("dekker","just",-0.3),d:1.0},
    {k:"tick",x:92,y:376,r:18,col:"green",at:w("dekker","what happened",-0.35),d:0.25},{s:"What happened?",x:128,y:394,size:54,at:w("dekker","what happened",-0.1),d:0.8},
    {k:"tick",x:602,y:376,r:18,col:"green",at:w("dekker","what must",-0.35),d:0.25},{s:"What must change?",x:638,y:394,size:54,at:w("dekker","what must",-0.1),d:0.8},
    {k:"cross",x:742,y:452,r:15,col:"amber",at:w("dekker","not who",-0.2),d:0.25},{s:"Who is to blame?",x:778,y:470,size:54,col:"mut",at:w("dekker","not who",0.1),d:0.8}]);};
/* the team's room when Carmen explains at its board: Sam has pulled a chair round, Jun turns from her desk, and Ivy sits turned
   to the board with her notebook open on her knee and a pen in her hand. o.rows: the board's rows; o.say: when Carmen speaks
   ([[t0, t1], …]); o.events: PK.face's, for her; o.note (0 to 1): Ivy looks down and writes; o.ivy, o.sam, o.jun: their faces
   (PK.face's result); o.clock, o.pot. Returns {ivy, sam, jun, carmen}. */
const OO_KNEE={mode:"sit",lean:8,head:6,aN:[30,78,"grip"],aF:[26,70,"grip"],lN:[86,4],lF:[82,-4]};
function oo_lesson(x,tt,o){o=o||{};const wr=o.note||0,lis=(g)=>PK.face(tt,{expr:"listen",gaze:[1,g]},[]);let Jc=null;
  const R=oo_team(x,tt,{clock:o.clock,pot:o.pot,sam:null,jun:Object.assign({work:0,pose:"sit"},o.jun||lis(-0.2)),
    behind:cx=>{if(o.behind)o.behind(cx);Jc=oo_roomBoard(cx,tt,o.rows||[],"carmen",{say:o.say,events:o.events});},
    ivy:Object.assign({turn:1,work:0,pose:OO_KNEE,underF:PK.inHand.notebook({}),hold:PK.inHand.pen("blue"),holds:true},o.ivy||lis(-0.3),wr>0.004?{gaze:[1,-0.3+0.9*wr],nod:0.22*wr}:{})});
  R.sam=PK.seated(x,"sam",1500,940,oo_hT(940),PK.poseMix("sit","sitBack",0.5),Object.assign({t:tt+2,flip:true},o.sam||lis(-0.25)));R.carmen=Jc;return R;}

/* Ivy writes in the notebook on her desk (oo_team's book: 1), a pen in her hand: what PK.atDesk takes for her. wr (0 to 1): how
   far she is bent to the page and writing; at 0 she sits up, the hand with the pen at rest beside the book */
const OO_JOT={mode:"sit",lean:13,head:11,aN:[30,84,"grip"],aF:[30,80,"flat"],lN:[86,4],lF:[82,-4]};
const oo_pen=k=>(c,hd,deg,J)=>{if(k<=0.004)return;c.save();c.globalAlpha*=Math.min(1,k);PK.inHand.pen("blue")(c,hd,deg,J);c.restore();};
const oo_jot=(tt,wr,o)=>{const U=PK.u,top=OO_IVY.floor-0.43*OO_HI;return Object.assign({work:0,keysBack:1,pose:PK.poseMix("sit",OO_JOT,wr),hold:oo_pen(1),holds:true,
  reachN:[U.lerp(OO_IVY.x-96,OO_IVY.x-128+Math.sin(tt*9)*3,wr),U.lerp(top-9,top-13,wr)],reachNk:1,reachF:[OO_IVY.x-72,top-6],reachFk:wr},o||{});};

/* ---------------------------------------------------------------- Ivy's notebook: what she keeps (the page's own px)
   One pen writes a page, so its strokes come one after the other, each with the time to cross to it: the film gives each row the
   time the voice says it, in the order the pen writes them, and paces the page (PK.pace(ctx, null, rows)), which moves a row
   that would start before the one before it has ended. A row is written fast, in under a second: the voice doesn't wait. */
// what she owns: not Monday's job
const oo_note1=(sc,w)=>[
  {s:"What I own",x:70,y:124,size:84,w:700,col:"blue",at:sc.cues.truly-0.3,d:0.8,marks:[["under","blue",null,0.3]]},
  {s:"Monday's job",x:140,y:268,size:68,at:w("truly","Monday's",-0.3),d:0.7,marks:[["strike","amber",w("truly","job",0.3),0.35]]},
  {k:"cross",x:96,y:246,r:15,col:"amber",at:w("truly","job",0.7),d:0.25},
  {k:"tick",x:96,y:372,r:18,col:"green",at:w("truly","timetable",-0.1),d:0.25},
  {s:"The timetable change,",x:140,y:392,size:68,at:w("truly","timetable",0.2),d:0.9},
  {s:"judged on",x:140,y:490,size:68,at:w("truly","judged",-0.1),d:0.5},
  {s:"true counts",x:444,y:490,size:68,w:700,at:w("truly","true",-0.1),d:0.7,marks:[["hl","green"]]}];
// say it first: she goes back to highlight "before the fix" once the page is written
const oo_note2=(sc,w)=>[
  {s:"Say it first,",x:70,y:176,size:96,w:700,col:"blue",at:sc.cues.first-0.1,d:0.8},
  {s:"before the fix.",x:70,y:310,size:84,at:w("first","before",-0.1),d:0.7,marks:[["hl","amber",sc.ends.first+0.3]]},
  {k:"arrow",x:92,y:404,x1:168,y1:440,bow:-16,col:"blue",at:w("first","is part",-0.2),d:0.3},
  {s:"that's part of owning it",x:190,y:456,size:60,at:w("first","is part",0.1),d:1.0},
  {k:"star",x:1000,y:150,r:32,col:"amber",at:sc.ends.first+0.9,d:0.45}];
// fix it, or raise it: written in the pause that ends the chapter
const oo_note3=sc=>{const b=sc.cues.breath;return[
  {s:"Mine?",x:70,y:176,size:84,at:b+0.2,d:0.4},{k:"arrow",x:330,y:150,x1:444,y1:150,col:"green",at:b+0.65,d:0.35},{s:"Fix it.",x:474,y:176,size:84,w:700,at:b+1.05,d:0.5,marks:[["hl","green",null,0.4]]},
  {s:"Not mine?",x:70,y:330,size:84,at:b+2.3,d:0.55},{k:"arrow",x:474,y:304,x1:588,y1:304,col:"blue",at:b+3.0,d:0.35},{s:"Raise it.",x:618,y:330,size:84,w:700,col:"blue",at:b+3.4,d:0.55,marks:[["under","blue",null,0.3]]}];};
// being accountable: giving an account
const oo_note4=(sc,w)=>[
  {s:"Nobody blamed",x:70,y:112,size:58},{k:"arrow",x:462,y:92,x1:548,y1:92,col:"green"},{s:"safe to say it early",x:574,y:112,size:58,marks:[["hl","green"]]},
  {s:"Accountable",x:70,y:270,size:92,w:700,col:"blue",at:w("account","accountable",-0.4),d:0.7,marks:[["under","blue",null,0.25]]},
  {s:"= giving an account",x:70,y:388,size:68,at:w("account","giving",-0.2),d:0.75},
  {k:"dot",x:100,y:476,r:9,col:"blue",at:w("account","what happened",-0.3),d:0.12},{s:"what happened",x:140,y:494,size:64,at:w("account","what happened",-0.1),d:0.65},
  {k:"dot",x:100,y:576,r:9,col:"green",at:w("account","how",-0.3),d:0.12},{s:"how next time goes better",x:140,y:594,size:64,at:w("account","how",-0.1),d:1.0,marks:[["hl","green"]]}];
// on Monday: the four things to keep, and beside each, in one column, what it means (inside the page: 1,100 px wide)
const oo_note5=(sc,w)=>{const c=sc.cues,dot=(y,col,at)=>({k:"dot",x:92,y:y-18,r:9,col,at,d:0.15});return[
  {s:"On Monday",x:70,y:122,size:88,w:700,col:"blue",at:c.know-0.45,d:0.6,marks:[["under","blue",null,0.3]]},
  dot(250,"blue",w("know","know",0)),{s:"Know who uses it",x:128,y:250,size:62,at:w("know","know",0.1),d:0.9},
  {s:"for which decision?",x:680,y:250,size:42,col:"mut",at:w("know","for which",-0.1),d:0.8},
  dot(366,"green",w("watch","Watch",-0.3)),{s:"Watch what it's for",x:128,y:366,size:62,at:w("watch","Watch",-0.1),d:1.0,marks:[["hl","green"]]},
  {s:"not only: did it run?",x:680,y:366,size:42,col:"mut",at:w("watch","not only",0.4),d:0.85},
  dot(482,"amber",w("say","say so",-0.4)),{s:"Say so first",x:128,y:482,size:62,at:w("say","say so",-0.2),d:0.8,marks:[["hl","amber"]]},
  {s:"even before the fix",x:680,y:482,size:42,col:"mut",at:w("say","even",0.2),d:0.8},
  // the last has no dot: the ring round it would run through one
  {s:"Fix, raise, mend",x:128,y:598,size:62,at:w("mend","Fix",-0.1),d:w("mend","mend",0.6)-w("mend","Fix",-0.1),marks:[["ring","blue",w("mend","mend",0.8)]]},
  {s:"never blame a person",x:680,y:598,size:42,col:"mut",at:w("mend","never",0),d:0.9},
  {k:"star",x:1010,y:104,r:30,col:"amber",at:sc.ends.mend+0.05,d:0.45}];};

/* ---------------------------------------------------------------- what they write to each other
   Ivy's chat with Graham and Mei, as her screen has it (f1, f2, f3: when the voice says each of her three lines; te: when it
   ends), and as Graham's phone has it, where he answers at ta */
const OO_SAID=[{s:"Forty rooms look wrong."},{s:"Don't use them yet."},{lines:["The right counts","come tomorrow."]}];
const oo_chat=(f1,f2,f3,te)=>({title:"Graham, Mei",who:["graham","mei"],me:"ivy",msgs:[[f2-0.3,f1-0.1],[f3-0.3,f2-0.1],[te+0.1,f3-0.1]].map(([at,from],i)=>Object.assign({who:"ivy",at,type:at-from},OO_SAID[i]))});
const oo_chat2=ta=>({title:"Ivy Reyes",who:["ivy"],me:"graham",msgs:OO_SAID.map(m=>Object.assign({who:"ivy",at:-1e3},m)).concat([{who:"graham",s:"Thanks. We'll hold off.",at:ta,type:1.7}])});
