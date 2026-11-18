/* ===== Growing people: the university, a year from now (imagined) =====
   The places are the people kit's (films/people-first/shared/src/places.js): the team's room, Helena's corner, the campus; and,
   apart from the scene, a board seen close and a page of a notebook (concepts.js). This film adds one of its own: Helena's corner
   on a December evening, the sky dark over the campus and her lamp on. What this file holds is the film's own in those places:
   who sits where, Ivy's first day, the seedling Helena gives her on 1 July (it grows on the window's sill behind her desk until the
   end), what Ivy's screen shows and the small cards that come out of it, the page Ivy shows Helena, the call in which Graham asks
   his question and the chat in which he thanks Helena, what Carmen writes on the board, and what Ivy writes in her notebook and
   Helena in hers, whose cover is her own colour. */
AG_PLACES.gpTeam=PK.place.team;AG_PLACES.gpCorner=PK.place.corner;AG_PLACES.gpCampus=PK.place.campus;AG_PLACES.gpUniBoard=PK.place.board;
AG_PLACES.gpNotes=c=>PK.place.notes(c,{});AG_PLACES.gpNotesH=c=>PK.place.notes(c,{cover:PK.CAST.helena.top.c});
const GP_T=PK.ROOMS.team,GP_CO=PK.ROOMS.corner,GP_CA=PK.ROOMS.campus;
const GP_HI=PK.hAt(GP_T.mid,GP_T.eye),GP_HB=PK.hAt(GP_T.back,GP_T.eye),GP_HC=PK.hAt(GP_CA.near,GP_CA.eye),GP_IVY={x:560,floor:GP_T.mid};
const gp_hT=fl=>PK.hAt(fl,GP_T.eye);
// a face that speaks from t0 to t1, on a base expression
const gp_says=(base,tt,t0,t1)=>{const e=PK.exprMix(base,base,0);e.open=Math.max(e.open||0,PK.talk(tt,t0,t1)*0.75);return e;};

/* ---------------------------------------------------------------- Helena's corner on a December evening
   The corner as the kit paints it, then the window's view at dusk (the building's windows lit), the room a little dimmer, and the
   lamp on the shelf lit, with its light round it */
function gp_duskView(ctx,x,y,w,h){const U=PK.u,S=PK.S,k=w/640;PK.view.campus(ctx,x,y,w,h,{});
  const g=ctx.createLinearGradient(0,y,0,y+h);g.addColorStop(0,"rgba(38,42,88,0.66)");g.addColorStop(0.7,"rgba(88,66,108,0.46)");g.addColorStop(1,"rgba(140,92,96,0.34)");ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
  const bx=x+w*0.52,by=y+h*0.47;S.begin(ctx,{lw:1.6,far:0.5,sh:3});
  for(let i=0;i<4;i++)for(let j=0;j<2;j++)if((i*3+j)%4!==2)S.fill(ctx,c=>U.rrect(c,bx+32*k+i*68*k,by+40*k+j*84*k,36*k,52*k,4),[246,212,146],{w:0.5,flat:true});}
function gp_duskPlace(ctx){const U=PK.u,S=PK.S,[wx,wy,ww,wh]=GP_CO.win;PK.place.corner(ctx);
  ctx.save();ctx.beginPath();ctx.rect(0,0,1920,1080);ctx.rect(wx,wy,ww,wh);ctx.clip("evenodd");ctx.fillStyle="rgba(52,44,78,0.16)";ctx.fillRect(0,0,1920,1080);ctx.restore();
  ctx.save();ctx.beginPath();ctx.rect(wx,wy,ww,wh);ctx.clip();gp_duskView(ctx,wx,wy,ww,wh);ctx.restore();
  S.begin(ctx,{lw:3,far:0.1,sh:5});PK.windowFrame(ctx,wx,wy,ww,wh,{});ctx.fillStyle="rgba(52,44,78,0.16)";ctx.beginPath();U.rrect(ctx,wx-40,wy-18,ww+80,wh+80,6);ctx.fill();
  // the lamp on the shelf, lit
  const g=ctx.createRadialGradient(1758,350,20,1758,350,460);g.addColorStop(0,"rgba(255,224,156,0.42)");g.addColorStop(1,"rgba(255,224,156,0)");ctx.fillStyle=g;ctx.fillRect(1298,0,622,820);
  S.begin(ctx,{lw:3,far:0.1,sh:5});S.poly(ctx,[[1710,374,1],[1806,374,1],[1786,304,1],[1730,304,1]],[252,226,164],{exact:true});}
AG_PLACES.gpCornerDusk=gp_duskPlace;

/* ---------------------------------------------------------------- the team's room
   As Owning the outcome's (oo_team): o.clock: the time on the wall (null: no hands); o.sam, o.jun, o.ivy: what PK.atDesk takes for
   each (null: the desk stands empty); o.pot: how grown the seedling on the sill is (null: none yet); o.show: what her screen shows;
   o.behind(x): what stands between the back desks and hers; o.away: Ivy has got up; o.bare: nobody, nothing going on; o.book: her
   notebook on her desk (0 shut, 1 open in front of her: give her PK.atDesk's keysBack; 2 shut where it lay open); o.mug false:
   nothing on her desk yet, as on her first day. Returns {ivy, sam, jun}: their joints. */
function gp_team(x,tt,o){o=o||{};const r={};PK.clock(x,GP_T.clock[0],GP_T.clock[1],GP_T.clock[2],o.clock===undefined?9:o.clock);
  if(o.pot!=null){PK.S.begin(x,{lw:2.6,sh:3});PK.potted(x,GP_T.sill[0],GP_T.sill[1],1.3+0.5*o.pot,0.6+0.4*o.pot);}
  r.sam=PK.atDesk(x,o.sam===null?null:"sam",1230,GP_T.back,GP_HB,Object.assign({t:tt,w:0.45*GP_HB},o.sam||{}));
  r.jun=PK.atDesk(x,o.jun===null?null:"jun",1808,GP_T.back,GP_HB,Object.assign({t:tt+3,flip:true,w:0.45*GP_HB},o.jun||{}));
  if(o.behind)o.behind(x);
  r.ivy=PK.atDesk(x,o.ivy===null||o.away?null:"ivy",GP_IVY.x,GP_IVY.floor,GP_HI,Object.assign({t:tt+1,flip:true,w:0.84*GP_HI,sx:205,screen:"monitor",show:o.bare||o.mug===false?null:o.show||gp_scrCode(),
    on:(c,D)=>{PK.S.begin(c,{lw:2.6,sh:3});if(o.mug!==false)PK.mug(c,D.x1+34,D.top,0.7,PK.col("mug"),tt,!o.bare&&o.steam!==false);
      const lie=(a,f)=>{if(a<=0.004)return;c.save();c.globalAlpha*=Math.min(1,a);PK.S.begin(c,{lw:2.2,sh:3});f();c.restore();};
      if(o.book!=null){if(o.book<=0)lie(1,()=>PK.notebook(c,GP_IVY.x-314,D.top,0.86,{}));
        else{lie(2-o.book,()=>PK.notebook(c,GP_IVY.x-164,D.top-2,0.86,{open:true}));lie(o.book-1,()=>PK.notebook(c,GP_IVY.x-214,D.top,0.86,{}));}}
      if(o.pen)lie(o.pen,()=>PK.S.fill(c,cc=>PK.u.capsule(cc,[GP_IVY.x-104,D.top-3],[GP_IVY.x-66,D.top-4],3.2,2.6),PK.C.blue,{w:0.6}));}},o.ivy||{}));return r;}
AG_BARE.gpTeam=(x,tt)=>gp_team(x,tt,{sam:null,jun:null,ivy:null,clock:null,bare:true});
// the seedling in its pot, carried in a hand (PK.person's hold); g how grown
const gp_potHold=g=>(c,h,deg,J)=>{PK.S.begin(c,{lw:2.6,sh:3});PK.potted(c,h[0]+14*J.u,h[1]+34*J.u,1.3+0.5*g,0.6+0.4*g);};
// what her screen shows as she works: a model's code, too small for words; k (0 to 1) how much of it is there
const gp_scrCode=k=>(c,x,y,w,h)=>{const U=PK.u,n=6,rh=h/(n+1),m=Math.round(U.clamp(k==null?1:k,0,1)*n);c.fillStyle=U.css([250,250,246]);c.fillRect(x,y,w,h);
  for(let i=0;i<m;i++){const ind=[0,1,1,2,1,0][i],len=[0.5,0.6,0.36,0.46,0.3,0.4][i],col=i===2?PK.C.blue:i===4?PK.C.green:[196,200,204];
    c.fillStyle=U.css(col,i===2||i===4?0.75:1);c.beginPath();U.rrect(c,x+w*(0.08+0.08*ind),y+rh*(i+0.66),w*len,rh*0.38,3);c.fill();}};
// two panes side by side, too small for words: the agent's draft, and the glossary's entry beside it; ok (0 to 1): the draft fixed
const gp_scrTwo=ok=>(c,x,y,w,h)=>{const U=PK.u;c.fillStyle=U.css([250,250,246]);c.fillRect(x,y,w,h);c.fillStyle=U.css([210,214,216]);c.fillRect(x+w/2-1,y+h*0.08,2,h*0.84);
  for(let i=0;i<4;i++){c.fillStyle=U.css(i===1?U.mix(PK.C.amber,PK.C.green,ok):[196,200,204],i===1?0.8:1);c.beginPath();U.rrect(c,x+w*0.06,y+h*(0.16+i*0.19),w*[0.34,0.3,0.36,0.22][i],h*0.08,3);c.fill();
    c.fillStyle=U.css(i===0?PK.C.green:[196,200,204],i===0?0.8:1);c.beginPath();U.rrect(c,x+w*0.56,y+h*(0.16+i*0.19),w*[0.32,0.36,0.28,0.3][i],h*0.08,3);c.fill();}};
// a long change, scrolling past as someone reads it fast: k how far
const gp_scrDiff=k=>(c,x,y,w,h)=>{const U=PK.u;c.fillStyle=U.css([250,250,246]);c.fillRect(x,y,w,h);c.save();c.beginPath();c.rect(x,y,w,h);c.clip();const rh=h/7,off=(k*30)%1;
  for(let i=-1;i<8;i++){const j=i+Math.floor(k*30),col=j%5===1?PK.C.green:j%7===3?PK.C.amber:[196,200,204];c.fillStyle=U.css(col,j%5===1||j%7===3?0.6:1);
    c.beginPath();U.rrect(c,x+w*0.08,y+rh*(i+0.4-off),w*(0.3+0.4*PK.u.hash(j,4)),rh*0.4,3);c.fill();}c.restore();};
/* what her screen says, as a card that comes out of it: a heading in capitals (kick, its colour col), then rows of [words, how far
   each has come in (0 to 1), its colour, its mark: "tick", "cross" or none]. y: the card's top; a: how far the card is there */
function gp_screen(x,y,a,kick,col,rows){const U=PK.u,wd=Math.max(ag_tw(x,kick,{w:800,size:28,ls:3}),...rows.map(r=>ag_tw(x,r[0],{w:700,size:30})+(r[3]?50:0)));
  PK.callout(x,40,y,wd+92,82+54*rows.length,[205,474],a,(c,bx,by)=>{ag_T(c,kick,bx+36,by+48,{w:800,size:28,ls:3,col:col||PK.C.mut});
    rows.forEach(([s,k,cl,mk],i)=>{const yy=by+102+54*i,q=U.clamp(k==null?1:k,0,1);let tx=bx+36;
      if(mk==="tick"){PK.tick(c,bx+56,yy-11,20,q);tx+=50;}else if(mk==="cross"){gp_cross(c,bx+56,yy-11,15,q);tx+=50;}
      ag_T(c,s,tx,yy,{w:700,size:30,col:cl||PK.C.ink,a:q});});});}
// a cross in amber, drawn as two strokes (p: how far)
function gp_cross(c,x,y,r,p){if(p<=0.004)return;const U=PK.u,a=U.clamp(p*2,0,1),b=U.clamp(p*2-1,0,1);c.save();c.strokeStyle=U.css(PK.C.amber);c.lineWidth=5;c.lineCap="round";c.beginPath();
  c.moveTo(x-r,y-r);c.lineTo(x-r+2*r*a,y-r+2*r*a);if(b>0){c.moveTo(x+r,y-r);c.lineTo(x+r-2*r*b,y-r+2*r*b);}c.stroke();c.restore();}

/* ---------------------------------------------------------------- the page Ivy shows Helena: her first goal, met
   The whole route of Graham's question on one sheet, from his decision back to the sensors: four boxes, one under the other, with
   the way the data comes up between them. In her hand it is a sheet with lines too small to read (gp_sheet); the card that comes
   out of it says what is on it. p (0 to 1): how far the card has filled, a box at a time, from the top */
const gp_sheet=(c,h,deg,J)=>{const U=PK.u,u=J.u;PK.S.begin(c,{lw:2.2,sh:3});PK.S.poly(c,[[h[0]-18*u,h[1]-118*u,1],[h[0]+66*u,h[1]-126*u,1],[h[0]+74*u,h[1]-6*u,1],[h[0]-10*u,h[1]+2*u,1]],PK.col("board"),{exact:true});
  [[0,PK.C.blue],[1,PK.C.orange],[2,[196,200,204]],[3,[196,200,204]]].forEach(([i,col])=>{c.fillStyle=U.css(col,0.75);c.beginPath();U.rrect(c,h[0]-2*u,h[1]-(104-i*25)*u,56*u,15*u,3*u);c.fill();});};
const GP_ROUTE=[["Graham: build or not?",PK.C.blue],["Counts per room",PK.C.orange],["Jun's models",PK.C.ink],["The door sensors",PK.C.ink]];
// the page Ivy holds up, seen close in a callout: Graham's decision at the top, the sensors at the foot; rows spread to fill h
function gp_route(c,x,y,w,h,p){const U=PK.u,rh=56,pitch=(h-80-rh)/3;ag_T(c,"THE WHOLE ROUTE",x+30,y+48,{w:800,size:28,ls:3,col:PK.C.mut});
  GP_ROUTE.forEach(([s,col],i)=>{const a=U.pin(p,0.08+i*0.2,0.16),by=y+66+i*pitch;if(a<=0.004)return;c.save();c.globalAlpha*=a;
    PK.box(c,x+30,by,w-60,rh,12,PK.col("board"),1);c.fillStyle=U.css(col);c.fillRect(x+30,by+7,8,rh-14);ag_T(c,s,x+56,by+39,{w:700,size:28,col:col===PK.C.ink?PK.C.ink:U.dk(col,0.08)});
    // the data comes up from the box below: a small arrow between two boxes
    if(i){const g=pitch-rh,m=by-g/2;c.fillStyle=U.css(PK.C.mut);c.beginPath();c.moveTo(x+w/2,m-7);c.lineTo(x+w/2-11,m+5);c.lineTo(x+w/2+11,m+5);c.closePath();c.fill();c.fillRect(x+w/2-3,m+3,6,g/2-5);}
    c.restore();});}

/* ---------------------------------------------------------------- Helena's corner: Helena and Ivy at the round table
   As Owning the outcome's (oo_corner): o.lean (0 to 1): Helena leans in; o.up (0 to 1): Ivy looks up from her mug and sits up (1 by
   default); o.H, o.I: what PK.face gives for each (expr, gaze, nod), or just an expression; o.ask (0 to 1): Helena's open hand;
   o.t0: when the shot starts (two people cross the lawn outside once, from then); o.dusk: the December evening (nobody outside);
   o.hbook (0 to 1): Helena's own notebook lies open in front of her, and o.hwrite (0 to 1): she writes in it, a pen in her hand;
   o.ibook (0 to 1): Ivy's notebook lies open on the table, and o.show (0 to 1): she pushes it over for Helena to read, her hands on
   it, her mug set down; o.mugDown: her mug is on the table from the start, her hands on her book (a later moment that starts
   there, so nothing switches from one hold to the other in a frame). Returns {helena, ivy}. */
const GP_SITH={mode:"sit",lean:2,head:0,aN:[24,76],aF:[28,80],lN:[86,3],lF:[82,-5]},GP_SITH2={mode:"sit",lean:13,head:-5,aN:[40,80,"open"],aF:[36,78],lN:[86,5],lF:[82,-6]};
const GP_WRITEH={mode:"sit",lean:14,head:12,aN:[34,84,"grip"],aF:[30,80,"flat"],lN:[86,4],lF:[82,-4]};
const GP_SITI={mode:"sit",lean:9,head:17,aN:[26,74,"grip"],aF:[30,78,"grip"],lN:[86,8],lF:[82,-2]},GP_SITI2={mode:"sit",lean:1,head:-3,aN:[24,74,"grip"],aF:[28,78,"grip"],lN:[86,6],lF:[82,-3]};
const GP_SHOWI={mode:"sit",lean:12,head:6,aN:[34,80,"flat"],aF:[36,84,"flat"],lN:[86,6],lF:[82,-3]};
const gp_pad=(c,x,y)=>{const S=PK.S,c0=PK.col("laptop");S.poly(c,[[x-86,y-6,1],[x+70,y-12,1],[x+92,y+6,1],[x-70,y+14,1]],c0,{exact:true});S.poly(c,[[x-84,y-12,1],[x+68,y-18,1],[x+70,y-12,1],[x-86,y-6,1]],PK.u.lt(c0,0.25),{w:0.6,flat:true,exact:true});};
// a notebook lying open on the table, seen from the side: its spine at x
const gp_openBook=(c,x,y,k,cover)=>{const S=PK.S,U=PK.u,w=78*k,page=PK.col("page");S.fill(c,cc=>U.pg(cc,[[x-w,y-3*k],[x+w,y-3*k],[x+w+4*k,y+5*k],[x-w-4*k,y+5*k]]),S.tone(cover||PK.PAL.cover),{w:0.7});
  S.fill(c,cc=>U.pg(cc,[[x-w+4*k,y-9*k],[x,y-6*k],[x,y-1*k],[x-w+4*k,y-3*k]]),page,{w:0.6});S.fill(c,cc=>U.pg(cc,[[x+w-4*k,y-9*k],[x,y-6*k],[x,y-1*k],[x+w-4*k,y-3*k]]),U.dk(page,0.04),{w:0.6});};
function gp_corner(x,tt,o){o=o||{};const U=PK.u,S=PK.S,{F,H,hx,ix,tx,rx,ty,win}=GP_CO,lean=o.lean||0,up=o.up==null?1:o.up,ask=o.ask||0,t0=o.t0||0,lw={lw:3.4,far:0,sh:5},
    hw=o.hwrite||0,sh=o.show||0,face=f=>f==null?{}:f.expr!=null||f.gaze!=null?f:{expr:f};
  if(!o.dusk){x.save();x.beginPath();x.rect(win[0],win[1],win[2],win[3]);x.clip();
    for(const [i,ts,d,left,dy,h] of [[7,t0+1,22,false,34,92],[12,t0+7,26,true,24,96]]){if(tt<ts||tt>ts+d)continue;
      PK.walk(x,PK.extra(i),tt,{x0:left?win[0]+win[2]+40:win[0]-40,x1:left?win[0]-40:win[0]+win[2]+40,t0:ts,t1:ts+d,floor:win[1]+win[3]-dy,h},{far:0.55,shade:0});}
    x.restore();PK.windowFrame(x,win[0],win[1],win[2],win[3],{});}
  const hp=PK.poseMix(PK.poseMix(GP_SITH,GP_SITH2,lean),GP_WRITEH,hw),ip=PK.poseMix(PK.poseMix(GP_SITI,GP_SITI2,up),GP_SHOWI,sh);
  S.begin(x,lw);PK.chair(x,hx-10,F,H,false,{});PK.chair(x,ix+10,F,H,true,{col:PK.PAL.chair2});
  PK.person(x,"helena",hx,F,H,hp,{t:tt,part:"lower"});PK.person(x,"ivy",ix,F,H,ip,{t:tt+1,flip:true,part:"lower"});
  S.begin(x,lw);PK.table(x,tx,ty,rx,F);
  const lie=(a,f)=>{if(a<=0.004)return;x.save();x.globalAlpha*=Math.min(1,a);S.begin(x,{lw:2.6,far:0,sh:3});f();x.restore();};
  if(!o.hbook)gp_pad(x,tx+52,ty-8);
  lie(o.hbook||0,()=>gp_openBook(x,792,ty-2,1.2,PK.CAST.helena.top.c));
  const bx=U.lerp(1104,990,sh);lie(o.ibook||0,()=>gp_openBook(x,bx,ty-2,1.2));
  S.begin(x,{lw:2.6,far:0,sh:3});PK.mug(x,tx-60+(o.hbook?96:0),ty+10,0.9,PK.col("mug2"),tt,!o.dusk||true);
  // Ivy's mug, in both her hands: drawn under them, in her own mirrored picture; set down on the table when her hands are on her book
  const mx=1140,my=ty+8-8*up,held=!o.mugDown&&sh<0.5,mug=(c,h,deg,J)=>{S.begin(c,{lw:2.6,far:0,sh:3});PK.mug(c,2*ix-mx,my,0.9,PK.col("mug"),tt,true);S.begin(c,{lw:U.clamp(H*0.0056,1.4,6.5),sh:U.clamp(H*0.0078,1.5,8.5)});};
  if(!held){S.begin(x,{lw:2.6,far:0,sh:3});PK.mug(x,1196,ty+12,0.9,PK.col("mug"),tt,true);}
  const hr=hw>0.004?{reachN:[U.lerp(U.lerp(790,838,ask),784+Math.sin(tt*9)*3*hw,hw),U.lerp(ty-4-40*ask,ty-12,hw)],reachF:[U.lerp(806,736,hw),U.lerp(ty-12,ty-8,hw)],hold:gp_penHold(hw),holds:true}
    :{reachN:[U.lerp(790,838,ask),ty-4-40*ask],reachF:[806,ty-12]};
  const helena=PK.person(x,"helena",hx,F,H,hp,Object.assign({t:tt,part:"upper",gaze:[1,U.lerp(0.2,0.8,hw)]},hr,face(o.H)));
  const ir=held?{under:mug,reachN:[mx+20,my-30],reachF:[mx-22,my-28]}:{reachN:[bx+34,ty-10],reachF:[bx-30,ty-12]};
  const ivy=PK.person(x,"ivy",ix,F,H,ip,Object.assign({t:tt+1,flip:true,part:"upper",gaze:[1,U.lerp(1,-0.2,up)]},ir,face(o.I)));
  return{helena,ivy};}
// what stays in the corner while time passes between two meetings there (a later moment): its two chairs and the table
AG_BARE.gpCorner=(x,tt)=>{const {F,H,hx,ix,tx,rx,ty}=GP_CO;PK.S.begin(x,{lw:3.4,far:0,sh:5});PK.chair(x,hx-10,F,H,false,{});PK.chair(x,ix+10,F,H,true,{col:PK.PAL.chair2});
  PK.S.begin(x,{lw:3.4,far:0,sh:5});PK.table(x,tx,ty,rx,F);};
// a pen in a hand, which comes in as the hand takes it up (k: 0 to 1)
const gp_penHold=k=>(c,hd,deg,J)=>{if(k<=0.004)return;c.save();c.globalAlpha*=Math.min(1,k*2);PK.inHand.pen("blue")(c,hd,deg,J);c.restore();};

/* ---------------------------------------------------------------- someone who passes on the campus
   As Owning the outcome's (oo_passer): in from the right along the front path, then up the path to the entrance (o.out: the other
   way). They keep one pace in the picture's depth too, so their feet don't slide. */
const GP_WAY={a:[2040,884],b:[1300,884],d:[1478,606],v:190,n2:5,t2:7};
function gp_passer(x,tt,who,t0,o){o=o||{};const U=PK.u,W=GP_WAY,e=GP_CA.eye,d1=(W.a[0]-W.b[0])/W.v,T=d1+W.t2,amp=PK.ampOf(who);let u=tt-t0;if(u<0||u>T)return null;if(o.out)u=T-u;
  const n1=(W.a[0]-W.b[0])/PK.strideOf(PK.hAt(W.a[1],e),amp);let px,fl,step,k=0;
  if(u<d1){px=U.lerp(W.a[0],W.b[0],u/d1);fl=W.a[1];step=n1*u/d1;}
  else{k=(u-d1)/W.t2;fl=e+1/U.lerp(1/(W.b[1]-e),1/(W.d[1]-e),k);px=U.lerp(W.b[0],W.d[0],(W.b[1]-fl)/(W.b[1]-W.d[1]));step=n1+W.n2*k;}
  const turn=U.pin(u,d1-0.25,0.5);
  return PK.person(x,who,px,fl,PK.hAt(fl,e),PK.poseWalk(o.out?n1+W.n2-step:step,1,amp),{t:tt,flip:o.out?turn:1-turn,far:0.1+0.3*k,a:1-U.pin(u,T-0.7,0.7),expr:"neutral"});}

/* ---------------------------------------------------------------- the key ideas, apart from the scene
   Carmen Vidal, the consultant who works with the team now and then, explains what research says about feedback at the team's
   board (PK.teach). The film cuts between the room, where its board shows her lines small, and the board seen close (the place
   gpUniBoard), where they are large enough to read: both draw the same rows at the same times. What Ivy keeps goes in her notebook
   (PK.notes, the place gpNotes), and once what Helena keeps goes in hers (gpNotesH). Every time comes from the voice: sc is the
   chapter, w a word's time in a line. Colour means what it means in the film: blue a plan or a rule, green done or of value, amber
   a risk. Laid out for someone who walks, as the kit asks: on from left to right, what comes later at its right. */
const GP_RB={x:742,y:206,k:0.35,deco:true,floor:848,rest:1212};
const gp_roomBoard=(cx,tt,rows,who,o)=>PK.teach(cx,who,tt,rows,Object.assign({},GP_RB,{h:gp_hT(GP_RB.floor)},o||{}));
// A. what more than six hundred results on feedback found. Laid out for someone who walks: each finding starts under the end of
// the row above and goes on along its line, so she never walks back over the board to start a row at its left
const gp_boardA=(sc,w)=>[
  {s:"Kluger and DeNisi, 1996",x:70,y:100,size:42,col:"mut",at:w("kluger","Kluger",-0.1),d:1.2},
  {s:"600+ results",x:70,y:200,size:68,w:700,col:"blue",at:w("kluger","six hundred",-0.3),d:0.8},
  {s:"on feedback",size:52,at:w("kluger","feedback",-0.3),d:0.7},
  {s:"helped, on average",x:470,y:300,size:52,col:"green",at:w("third","average",-0.3),d:1.0},
  {s:"1 in 3: worse",size:52,w:700,col:"amber",at:w("third","third",-0.4),d:0.8},
  {s:"least",x:470,y:410,size:52,at:w("person","least",-0.4),d:0.5},
  {s:"when about the person",size:52,w:700,col:"amber",at:w("person","turned",-0.1),d:1.1}];
// B. hard feedback, as Kim Scott puts it: care personally, and challenge directly
// the heading at the left, as the voice says it first; then the source and its two parts in a column at its right, so she never
// walks back over the heading
const gp_boardB=(sc,w)=>[
  {s:"Hard feedback",x:70,y:200,size:76,w:700,col:"blue",at:w("scott","Hard",-0.2),d:0.9},
  {s:"Kim Scott, Radical Candor, 2017",x:640,y:110,size:42,col:"mut",at:w("scott","Kim",-0.1),d:1.3},
  {k:"tick",x:666,y:282,r:18,col:"green",at:w("scott","care",-0.35),d:0.25},
  {s:"Care personally",x:702,y:300,size:56,w:700,col:"green",at:w("scott","care",-0.1),d:0.8},
  {k:"tick",x:666,y:392,r:18,col:"blue",at:w("scott","challenge",-0.35),d:0.25},
  {s:"challenge directly",x:702,y:410,size:56,w:700,col:"blue",at:w("scott","challenge",-0.1),d:0.9}];
/* the team's room when Carmen explains at its board: Sam has pulled a chair round, Jun turns from her desk, and Ivy sits turned to
   the board with her notebook open on her knee and a pen in her hand; Helena stands by the wall, listening. o.rows: the board's
   rows; o.say: when Carmen speaks ([[t0, t1], …]); o.events: PK.face's, for her; o.note (0 to 1): Ivy looks down and writes; o.ivy,
   o.sam, o.jun, o.helena: their faces (PK.face's result); o.clock. Returns {ivy, sam, jun, carmen, helena}. */
const GP_KNEE={mode:"sit",lean:8,head:6,aN:[30,78,"grip"],aF:[26,70,"grip"],lN:[86,4],lF:[82,-4]};
function gp_lesson(x,tt,o){o=o||{};const wr=o.note||0,lis=(g)=>PK.face(tt,{expr:"listen",gaze:[1,g]},[]);let Jc=null;
  const R=gp_team(x,tt,{clock:o.clock,pot:o.pot,book:o.book,sam:null,jun:Object.assign({work:0,pose:"sit"},o.jun||lis(-0.2)),
    behind:cx=>{if(o.behind)o.behind(cx);Jc=gp_roomBoard(cx,tt,o.rows||[],"carmen",{say:o.say,events:o.events});},
    ivy:Object.assign({turn:1,work:0,pose:GP_KNEE,underF:PK.inHand.notebook({}),hold:PK.inHand.pen("blue"),holds:true},o.ivy||lis(-0.3),wr>0.004?{gaze:[1,-0.3+0.9*wr],nod:0.22*wr}:{})});
  R.sam=PK.seated(x,"sam",1500,940,gp_hT(940),PK.poseMix("sit","sitBack",0.5),Object.assign({t:tt+2,flip:true},o.sam||lis(-0.25)));
  R.helena=o.helena===null?null:PK.person(x,"helena",1690,900,gp_hT(900),"clasp",Object.assign({t:tt+4,flip:true},o.helena||lis(0.1)));
  R.carmen=Jc;return R;}

/* Ivy writes in the notebook on her desk (gp_team's book: 1), a pen in her hand: what PK.atDesk takes for her. wr (0 to 1): how
   far she is bent to the page and writing */
const GP_JOT={mode:"sit",lean:13,head:11,aN:[30,84,"grip"],aF:[30,80,"flat"],lN:[86,4],lF:[82,-4]};
const gp_pen=k=>(c,hd,deg,J)=>{if(k<=0.004)return;c.save();c.globalAlpha*=Math.min(1,k);PK.inHand.pen("blue")(c,hd,deg,J);c.restore();};
const gp_jot=(tt,wr,o)=>{const U=PK.u,top=GP_IVY.floor-0.43*GP_HI;return Object.assign({work:0,keysBack:1,pose:PK.poseMix("sit",GP_JOT,wr),hold:gp_pen(1),holds:true,
  reachN:[U.lerp(GP_IVY.x-96,GP_IVY.x-128+Math.sin(tt*9)*3,wr),U.lerp(top-9,top-13,wr)],reachNk:1,reachF:[GP_IVY.x-72,top-6],reachFk:wr},o||{});};

/* ---------------------------------------------------------------- the notebooks: what Ivy keeps, and once what Helena keeps
   In the page's own px (1,100 wide; nothing written below y 790, which is over the captions). One pen writes a page: the film
   gives each row the time the voice says it, in the order the pen writes them, and paces the page once (PK.pace(ctx, null, rows));
   a page shown twice has its later rows written while the film is elsewhere. */
// 1. her three goals, by when; then, as the voice says they are hers, the team's measures set apart
const gp_note1=(sc,w)=>[
  {s:"My goals",x:70,y:124,size:88,w:700,col:"blue",at:sc.cues.route-0.5,d:0.7,marks:[["under","blue",sc.cues.route+0.22,0.3]]},
  {s:"1",x:76,y:262,size:60,w:700,col:"blue",at:w("route","One",0.3),d:0.2},{s:"Know one question's whole route",x:136,y:262,size:56,at:w("route","whole",-0.6),d:1.0},
  {s:"by Easter",x:136,y:330,size:42,col:"mut",at:w("route","Easter",-0.2),d:0.5},
  {s:"2",x:76,y:432,size:60,w:700,col:"blue",at:w("pr","Two",-0.1),d:0.2},{s:"A pull request merged",x:136,y:432,size:56,at:w("pr","pull",-0.2),d:0.8},
  {s:"by May",x:136,y:500,size:42,col:"mut",at:w("pr","May",-0.2),d:0.4},
  {s:"3",x:76,y:602,size:60,w:700,col:"blue",at:w("own","Three",-0.1),d:0.2},{s:"Own a data product",x:136,y:602,size:56,at:w("own","own",-0.1),d:0.8},
  {s:"by the middle of the year",x:136,y:670,size:42,col:"mut",at:w("own","middle",-0.2),d:0.9},
  {s:"mine",x:560,y:124,size:64,w:700,col:"green",at:w("hers","own",-0.4),d:0.5,marks:[["ring","green",null,0.4]]},
  {s:"Team's measures: the team's,",x:70,y:770,size:44,col:"mut",at:w("hers","team's measures",-0.1),d:1.0},
  {s:"never my targets",size:44,w:700,col:"amber",at:w("hers","never",-0.1),d:0.8}];
// 2. feedback in three parts, and what Helena told her: ask for a review when it works
const gp_note2=(sc,w)=>[
  {s:"Three parts",x:70,y:124,size:88,w:700,col:"blue",at:w("sbi","three parts",-0.4),d:0.7,marks:[["under","blue",null,0.3]]},
  {s:"Center for Creative Leadership",x:70,y:222,size:42,col:"mut",at:w("sbi","Center",-0.1),d:1.2},
  {s:"Situation",x:70,y:330,size:62,w:700,col:"blue",at:w("sbi","situation",-0.2),d:0.6},
  {s:"Behaviour",x:410,y:330,size:62,w:700,col:"blue",at:w("sbi","behaviour",-0.2),d:0.6},
  {s:"Impact",x:756,y:330,size:62,w:700,col:"blue",at:w("sbi","impact",-0.2),d:0.5},
  {s:"what I did",x:410,y:392,size:42,col:"mut",at:w("not","what she did",-0.1),d:0.6},{s:"what it changed",x:756,y:392,size:42,col:"mut",at:w("not","what it changed",-0.1),d:0.7},
  {s:"Ask for a review when it works,",x:70,y:520,size:56,at:w("works","Ask",-0.1),d:1.0,marks:[["hl","green",w("works","perfect",0.4),0.4]]},
  {s:"not when it's perfect",x:70,y:600,size:56,at:w("works","not when",-0.1),d:0.8},
  {s:"Small and often,",x:70,y:718,size:62,w:700,col:"green",at:w("fresh","Small",-0.1),d:0.8},
  {s:"while it's fresh",size:52,at:w("fresh","fresh",-0.4),d:0.7}];
// 3. Helena's own page: what Ivy told her, and what she does from then on
const gp_note3=(sc,w)=>[
  {s:"From Ivy",x:70,y:124,size:84,w:700,col:"blue",marks:[["under","blue"]]},
  {s:"I answer at once,",x:70,y:250,size:58},{s:"and she stops looking",x:70,y:330,size:58,marks:[["hl","amber"]]},
  {k:"arrow",x:96,y:408,x1:168,y1:452,bow:-16,col:"green",at:w("thanks","From then",-0.2),d:0.3},
  {s:"First ask:",x:190,y:470,size:66,w:700,col:"green",at:w("thanks","first asks",-0.1),d:0.6},
  {s:"what have you tried?",x:190,y:566,size:66,w:700,at:w("thanks","tried",-0.5),d:0.9,marks:[["hl","green",sc.ends.thanks+0.2,0.4]]}];
// 4. her half year, looked back on and forward
const gp_note4=(sc,w)=>[
  {s:"Half a year",x:70,y:124,size:88,w:700,col:"blue",at:w("mid","half year",-0.2),d:0.7,marks:[["under","blue",w("mid","and forward",0.05),0.3]]},
  {k:"tick",x:94,y:228,r:18,col:"green",at:w("mid","All three",-0.2),d:0.2},{k:"tick",x:146,y:228,r:18,col:"green",at:w("mid","three",0),d:0.2},{k:"tick",x:198,y:228,r:18,col:"green",at:w("mid","goals",0),d:0.2},
  {s:"all three goals met",x:240,y:246,size:58,col:"green",at:w("mid","met",-0.3),d:0.8},
  {s:"Went well:",x:70,y:366,size:44,col:"mut",at:w("well","went well",-0.2),d:0.5},{s:"Graham's page",x:290,y:366,size:62,w:700,at:w("well","Graham's",-0.1),d:0.7,marks:[["hl","green"]]},
  {s:"Differently:",x:70,y:476,size:44,col:"mut",at:w("well","differently",-0.3),d:0.5},{s:"ask for review earlier",x:320,y:476,size:58,w:700,col:"amber",at:w("well","ask",-0.1),d:0.9},
  {s:"Next:",x:70,y:586,size:44,col:"mut",at:w("wants","next",-0.2),d:0.3},{s:"a better Monday refresh",x:190,y:586,size:58,w:700,col:"blue",at:w("wants","Monday",-0.5),d:0.9},
  {s:"and teach what I learn",x:190,y:676,size:58,w:700,col:"blue",at:w("wants","teach",-0.3),d:0.9},
  {k:"star",x:1000,y:118,r:30,col:"amber",at:sc.ends.wants+0.2,d:0.45}];
// 5. on Monday: four things to keep, each with what it means under it
const gp_note5=(sc,w)=>{const c=sc.cues,dot=(y,col,at)=>({k:"dot",x:92,y:y-18,r:9,col,at,d:0.15});return[
  {s:"On Monday",x:70,y:122,size:88,w:700,col:"blue",at:c.goals-0.45,d:0.6,marks:[["under","blue",null,0.3]]},
  dot(244,"blue",w("goals","write",-0.4)),{s:"Their own goals",x:128,y:244,size:62,at:w("goals","write",-0.2),d:0.8},
  {s:"they write them, then you agree",x:128,y:302,size:42,col:"mut",at:w("goals","agree",-0.6),d:1.0},
  dot(404,"green",w("feedback","every",-0.5)),{s:"Feedback every week",x:128,y:404,size:62,at:w("feedback","every",-0.3),d:0.9,marks:[["hl","green"]]},
  {s:"the situation, what they did, its effect",x:128,y:462,size:42,col:"mut",at:w("feedback","situation",-0.2),d:1.4},
  dot(564,"amber",w("ask","Ask",-0.3)),{s:"Ask for feedback on you",x:128,y:564,size:62,at:w("ask","Ask",-0.1),d:0.9},
  {s:"and act on it",x:128,y:622,size:42,col:"mut",at:w("ask","act",-0.2),d:0.5},
  {s:"Look forward",x:128,y:724,size:62,at:w("forward","Look",-0.1),d:0.6,marks:[["ring","blue",w("forward","conversations",0.1)]]},
  {s:"credit the team, in public",x:520,y:724,size:42,col:"mut",at:w("forward","credit",-0.1),d:0.9},
  {k:"star",x:1010,y:104,r:30,col:"amber",at:sc.ends.forward+0.05,d:0.45}];};

/* ---------------------------------------------------------------- what they say to each other from where they are
   Graham's question, in a call from Ivy's desk; and his thanks to Helena, which he writes on his phone on the campus */
const GP_THANKS=["Thank you. Your team's page","let the University Council decide."];
const gp_chatG=(ta,d)=>({title:"Helena Novak",who:["helena"],me:"graham",msgs:[{who:"graham",lines:GP_THANKS,at:ta,type:d}]});
// the role under Ivy's name, as her steps go by: crossfades between the tags (a: how far it is there; at: when each role comes)
function gp_steps(x,px,py,tt,a,at){const U=PK.u,R=["Data analyst","Data product owner","Coach, from 2028"];
  R.forEach((r,i)=>{const on=U.pin(tt,at[i]-0.15,0.3)*(i<R.length-1?1-U.pin(tt,at[i+1]-0.15,0.3):1);PK.nameTag(x,px,py,"Ivy Reyes",r,a*on);});}
