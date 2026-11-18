/* ===== When someone falls behind: the university, 2027 (imagined) =====
   The places are the people kit's (films/people-first/shared/src/places.js): the team's room, Helena's corner, a teaching room and
   the campus; and, apart from the scenes, a board seen close and two notebooks' pages (concepts.js). This film adds two of its own:
   a seminar room, where Carmen Vidal runs a session for the university's data and IT managers, and Helena's corner on a December
   evening. This file holds what is this film's own in them: who sits where; the binders of the old warehouse's reports on Tomás's
   desk, which Helena carries away; what the screens show and the small cards that come out of them (the team's days from a request
   to first use, Tomás's weeks, the gap between his days and the team's); what Carmen writes on the board; what Tomás writes in his
   plan and Helena in her notebook; and the chat in which Jun sends a report back. Tomás's reasons are on no board, page or screen:
   the film says only that he has a hard time at home, and nobody says it aloud. */
AG_PLACES.fbTeam=PK.place.team;AG_PLACES.fbCorner=PK.place.corner;AG_PLACES.fbCornerDec=c=>fb_cornerDec(c);AG_PLACES.fbSeminar=c=>fb_seminarPlace(c);
AG_PLACES.fbRoom=PK.place.lecture;AG_PLACES.fbCampus=PK.place.campus;AG_PLACES.fbBoard=PK.place.board;
AG_PLACES.fbNotesH=c=>PK.place.notes(c,{});AG_PLACES.fbNotesT=c=>PK.place.notes(c,{cover:FB_TCOVER});
// the corner by day and on a December evening is one room: a later moment there glides on, and only what changes fades
AG_ROOMS.fbCornerDec="fbCorner";
const FB_T=PK.ROOMS.team,FB_LEC=PK.ROOMS.lecture,FB_CA=PK.ROOMS.campus,FB_CO=PK.ROOMS.corner;
const FB_HT=PK.hAt(FB_T.mid,FB_T.eye),FB_HB=PK.hAt(FB_T.back,FB_T.eye),FB_TOM={x:560,floor:FB_T.mid};
const fb_hT=fl=>PK.hAt(fl,FB_T.eye),fb_hL=fl=>PK.hAt(fl,FB_LEC.eye);
// Tomás's notebook: a cover of its own, so his page is never taken for Helena's
const FB_TCOVER=[150,84,74];
// a face that speaks from t0 to t1, on a base expression
const fb_says=(base,tt,t0,t1)=>{const e=PK.exprMix(base,base,0);e.open=Math.max(e.open||0,PK.talk(tt,t0,t1)*0.75);return e;};

/* ---------------------------------------------------------------- the team's room
   Tomás sits at the front desk, turned to the window side; Sam and Jun at the back desks. o.clock: the time on the wall; o.tomas,
   o.sam, o.jun: what PK.atDesk takes for each (null: the desk stands empty); o.show: what Tomás's screen shows; o.binders (0 to 1):
   the old warehouse's reports, upright at the near end of his desk (1), or gone (0); o.notes (0 to 1): how far the team's sticky
   notes have moved across its board, from the old warehouse's side to the platform's; o.behind(x): what stands between the back
   desks and his; o.front(x): what comes in front of everything; o.away: Tomás has got up. Returns {tomas, sam, jun}. */
function fb_team(x,tt,o){o=o||{};const r={};PK.clock(x,FB_T.clock[0],FB_T.clock[1],FB_T.clock[2],o.clock===undefined?9:o.clock);
  fb_stickies(x,o.notes==null?1:o.notes,o.lift);
  r.sam=PK.atDesk(x,o.sam===null?null:"sam",1230,FB_T.back,FB_HB,Object.assign({t:tt,w:0.45*FB_HB},o.sam||{}));
  r.jun=PK.atDesk(x,o.jun===null?null:"jun",1808,FB_T.back,FB_HB,Object.assign({t:tt+3,flip:true,w:0.45*FB_HB},o.jun||{}));
  if(o.behind)o.behind(x);
  r.tomas=PK.atDesk(x,o.tomas===null||o.away?null:"tomas",FB_TOM.x,FB_TOM.floor,FB_HT,Object.assign({t:tt+1,flip:true,w:0.84*FB_HT,sx:205,screen:"monitor",show:o.show||fb_scrCode(),
    on:(c,D)=>{if(o.binders)fb_binders(c,FB_BINDX,D.top,1,o.binders);}},o.tomas||{}));
  if(o.front)o.front(x);
  return r;}
// the room with nobody in it, for a later moment there
AG_BARE.fbTeam=(x,tt)=>fb_team(x,tt,{sam:null,jun:null,tomas:null,clock:null,binders:0,notes:0});
/* the team's planning board: sticky notes, one for each report, in two groups: the old warehouse's (left) and the platform's
   (right). k (0 to 1): how many have moved across; lift: the one in Helena's hand (0 to 1 of its way), drawn by her */
const FB_STICK=[[0,0],[1,0],[0,1],[1,1],[0,2],[1,2],[2,0],[2,1]];
function fb_stickies(c,k,lift){const S=PK.S,U=PK.u,b=FB_T.board,n=FB_STICK.length,m=Math.round(U.clamp(k,0,1)*n);S.begin(c,{lw:2,far:0.1,sh:3});
  // a line down the board's middle, between the two sides
  S.line(c,cc=>{cc.moveTo(b.x+b.w/2,b.y+26);cc.lineTo(b.x+b.w/2,b.y+b.h-24);},PK.C.mut,0.8);
  FB_STICK.forEach(([i,j],q)=>{const moved=q<m,col=PK.col("note",q%4),x0=moved?b.x+b.w/2+36+i*64:b.x+30+i*64,y0=b.y+36+j*92;
    if(lift!=null&&q===m)return;c.save();c.translate(x0+26,y0+26);c.rotate((U.hash(q,5)-0.5)*0.12);S.fill(c,cc=>U.rrect(cc,-26,-26,52,52,3),col,{w:0.6,sa:0.2});c.restore();});}
// where the next sticky note to move is, and where it goes (for Helena's hand)
const fb_stickyAt=k=>{const b=FB_T.board,q=Math.round(PK.u.clamp(k,0,1)*FB_STICK.length),[i,j]=FB_STICK[Math.min(q,FB_STICK.length-1)];
  return{from:[b.x+30+i*64+26,b.y+36+j*92+26],to:[b.x+b.w/2+36+i*64+26,b.y+36+j*92+26],col:PK.col("note",q%4)};};
// a sticky note held in a hand (PK.person's hold), as large as on the board: the hand at its lower left corner
const fb_stickyHold=col=>(c,h,deg,J)=>{const S=PK.S,U=PK.u;S.begin(c,{lw:2,far:0.1,sh:3});c.save();c.translate(h[0]+18,h[1]-18);c.rotate(-0.04);S.fill(c,cc=>U.rrect(cc,-26,-26,52,52,3),col,{w:0.6,sa:0.2});c.restore();};
// where the hand holds a note whose middle is at m
const fb_stickyHand=m=>[m[0]-18,m[1]+18];
/* the old warehouse's reports: binders standing at the near end of Tomás's desk, by his elbow (x their middle, top the desk's top);
   k scales them; a fades them */
const FB_BINDX=446;
function fb_binders(c,x,top,k,a){if(a<=0.004)return;const S=PK.S,U=PK.u,cols=[[176,120,104],[110,132,150],[196,170,110],[132,150,120],[150,120,150]];c.save();c.globalAlpha*=U.clamp(a,0,1);S.begin(c,{lw:2.2,sh:3});
  cols.forEach((col,i)=>{const bx=x-40*k+i*16*k,bh=(104+(i%2)*10)*k;S.fill(c,cc=>U.rrect(cc,bx,top-bh,15*k,bh,2),col,{w:0.6});S.fill(c,cc=>U.ell(cc,bx+7.5*k,top-bh*0.3,4*k,4*k),U.dk(col,0.3),{line:false,flat:true});});c.restore();}
// the same binders in both arms, carried
const fb_bindersHold=(c,h,deg,J)=>{const S=PK.S,U=PK.u,u=J.u,cols=[[176,120,104],[110,132,150],[196,170,110],[132,150,120],[150,120,150]];S.begin(c,{lw:U.clamp(J.u*2.6,1.2,3.2),sh:3});
  cols.forEach((col,i)=>{const bx=h[0]-70*u+i*28*u,bh=(176+(i%2)*14)*u;S.fill(c,cc=>U.rrect(cc,bx,h[1]-bh+30*u,26*u,bh,3*u),col,{w:0.7});});};
// the same binders carried in both arms: they sit between the two hands, so neither hand reaches past them
const fb_bindersArms=(c,h,deg,J)=>fb_bindersHold(c,[(J.hdN[0]+J.hdF[0])/2,(J.hdN[1]+J.hdF[1])/2],deg,J);
// a mug, carried in a hand
const fb_mugHold=tt=>(c,h,deg,J)=>{PK.S.begin(c,{lw:PK.u.clamp(J.u*2.4,1.2,3),sh:3});PK.mug(c,h[0]+4*J.u,h[1]+30*J.u,0.8*J.u/0.83,PK.col("mug2"),tt,true);};
// a printout, a few sheets in a hand
const fb_print=(c,h,deg,J)=>{const S=PK.S,U=PK.u,u=J.u;S.begin(c,{lw:U.clamp(J.u*2.4,1.2,3),sh:3});
  S.poly(c,[[h[0]-12*u,h[1]-104*u,1],[h[0]+64*u,h[1]-110*u,1],[h[0]+70*u,h[1]-6*u,1],[h[0]-4*u,h[1],1]],PK.col("board"),{exact:true});
  S.line(c,cc=>{for(let i=0;i<4;i++){cc.moveTo(h[0]+4*u,h[1]-(86-i*20)*u);cc.lineTo(h[0]+54*u,h[1]-(91-i*20)*u);}},PK.C.mut,0.5);};

/* ---------------------------------------------------------------- what the screens show (too small for words: shapes only) */
// code: indented lines in a few colours; k (0 to 1): how far it is written
const fb_scrCode=k=>(c,x,y,w,h)=>{const U=PK.u,R=U.rnd(9),n=7;k=k==null?1:k;for(let i=0;i<n;i++){const ind=[0,1,1,2,2,1,0][i],len=0.3+R()*0.4;if(i/n>k)break;
    c.fillStyle=U.css(i%3===0?[150,120,190]:i%3===1?[90,140,190]:[206,208,204]);c.beginPath();U.rrect(c,x+w*(0.08+0.07*ind),y+h*(0.12+i*0.115),w*len,h*0.06,3);c.fill();}};
// the old warehouse's tool: a grey grid
const fb_scrOld=(c,x,y,w,h)=>{const U=PK.u;c.fillStyle=U.css([214,214,210]);c.fillRect(x,y,w,h);c.strokeStyle=U.css([170,170,166]);c.lineWidth=1.5;c.beginPath();
  for(let i=1;i<6;i++){c.moveTo(x,y+h*i/6);c.lineTo(x+w,y+h*i/6);}for(let j=1;j<4;j++){c.moveTo(x+w*j/4,y);c.lineTo(x+w*j/4,y+h);}c.stroke();
  c.fillStyle=U.css([120,124,150]);c.fillRect(x,y,w,h/6);};
// a lesson: a video's frame, its play mark and its progress
const fb_scrLesson=k=>(c,x,y,w,h)=>{const U=PK.u;c.fillStyle=U.css([226,234,240]);c.fillRect(x,y,w,h);c.fillStyle=U.css([90,140,190]);c.beginPath();c.moveTo(x+w*0.42,y+h*0.26);c.lineTo(x+w*0.42,y+h*0.6);c.lineTo(x+w*0.6,y+h*0.43);c.closePath();c.fill();
  c.fillStyle=U.css([200,204,210]);c.fillRect(x+w*0.08,y+h*0.82,w*0.84,h*0.05);c.fillStyle=U.css(PK.C.green);c.fillRect(x+w*0.08,y+h*0.82,w*0.84*U.clamp(k==null?0.4:k,0,1),h*0.05);};

/* ---------------------------------------------------------------- the small cards that come out of a screen
   Each draws inside a callout's box (x, y, w, h); p (0 to 1) how far it has filled. Every number is the voice's */
// the team's days from a request to first use: 41 in February, 24 by June
function fb_daysCard(c,x,y,w,h,p){const U=PK.u,x0=x+70,x1=x+w-110,y0=y+h-80,y1=y+104,px=i=>U.lerp(x0,x1,i/4),py=v=>U.lerp(y0,y1,(v-18)/26),v=[41,37,33,27,24];
  ag_T(c,"DAYS TO FIRST USE",x+30,y+52,{w:800,size:28,ls:3,col:PK.C.mut});
  c.save();c.lineCap="round";c.lineJoin="round";c.strokeStyle=U.css(PK.C.mut,0.5);c.lineWidth=3;c.beginPath();c.moveTo(x0,y0+8);c.lineTo(x1,y0+8);c.stroke();
  const n=U.clamp(p,0,1)*4;c.strokeStyle=U.css(PK.C.orange);c.lineWidth=6;c.beginPath();c.moveTo(px(0),py(v[0]));for(let i=0;i<4&&i<n;i++){const u=Math.min(1,n-i);c.lineTo(U.lerp(px(i),px(i+1),u),U.lerp(py(v[i]),py(v[i+1]),u));}c.stroke();
  c.fillStyle=U.css(PK.C.orange);c.beginPath();c.arc(px(0),py(41),9,0,U.TAU);if(n>=4){c.moveTo(px(4)+9,py(24));c.arc(px(4),py(24),9,0,U.TAU);}c.fill();c.restore();
  ag_T(c,"41",px(0)+18,py(41)-14,{w:800,size:34,col:PK.C.orange});ag_T(c,"24",px(4)+18,py(24)+12,{w:800,size:34,col:PK.C.orange,a:U.pin(p,0.9,0.15)});
  ag_T(c,"Feb",px(0),y+h-24,{w:700,size:28,align:"center",col:PK.C.mut});ag_T(c,"June",px(4),y+h-24,{w:700,size:28,align:"center",col:PK.C.mut,a:U.pin(p,0.85,0.15)});}
// Tomás's weeks: those that kept pace with the team (a tick) and those that went back for changes (a turn back); k: how many shown
const FB_WEEKS=[1,0,1,1,0,1,0,1];
function fb_weeksCard(c,x,y,w,h,k){const U=PK.u,n=FB_WEEKS.length,gx=(w-60)/n;ag_T(c,"TOMÁS'S WEEKS",x+30,y+52,{w:800,size:28,ls:3,col:PK.C.mut});
  FB_WEEKS.forEach((ok,i)=>{const a=U.clamp(k*n-i,0,1);if(a<=0.004)return;const cx=x+30+gx*(i+0.5),cy=y+118;
    if(ok)PK.tick(c,cx,cy,20,a,PK.C.green);
    else{c.save();c.globalAlpha*=a;c.fillStyle=U.css(PK.C.amber);c.beginPath();c.arc(cx,cy,20,0,U.TAU);c.fill();c.strokeStyle="#fff";c.lineWidth=3.4;c.lineCap="round";c.lineJoin="round";
      c.beginPath();c.arc(cx+1,cy+2,8,-0.2,Math.PI*1.25);c.stroke();c.beginPath();c.moveTo(cx-11,cy-3);c.lineTo(cx-6,cy+4);c.lineTo(cx-1,cy-4);c.stroke();c.restore();}});
  const a=U.pin(k,0.9,0.1);ag_T(c,"kept pace",x+30,y+h-26,{w:700,size:28,col:PK.C.green,a});ag_T(c,"went back",x+w-30,y+h-26,{w:700,size:28,col:PK.C.amber,a,align:"right"});}
/* the gap: the team's days (orange) and Tomás's own (ink), February to June, or on to December. o.name: what his line is called
   ("One person" when Helena first reads the team, dotted); o.to "june" or "dec"; o.tom, o.team: how far each line has come to
   each month (0 to 1: [Feb, June, Dec]), so each point comes as the voice says it; o.gap (0 to 1): the gap at the last month, in
   amber, with its size. Each number sits by its point: the higher of the two above, the lower below. The card is 400 high */
const FB_DAYS={team:[41,24,14],tomas:[40,35,20],at:["Feb","June","Dec"]};
function fb_gapCard(c,x,y,w,h,o){const U=PK.u,last=o.to==="dec"?2:1,x0=x+74,x1=x+w-196,y1=y+160,y0=y+300,px=i=>U.lerp(x0,x1,i/last),py=v=>U.lerp(y0,y1,(v-6)/36),
    dot=o.name==="One person"?[1,13]:null,full=[1,1,1],tm=o.tom||full,te=o.team||full;
  ag_T(c,"DAYS TO FIRST USE",x+30,y+52,{w:800,size:28,ls:3,col:PK.C.mut});
  // which line is whose: a short stroke of each, under the title
  c.save();c.lineCap="round";const key=(kx,col,d,s)=>{c.strokeStyle=U.css(col);c.lineWidth=6;c.setLineDash(d||[]);c.beginPath();c.moveTo(kx,y+88);c.lineTo(kx+36,y+88);c.stroke();c.setLineDash([]);
    ag_T(c,s,kx+48,y+98,{w:800,size:28,col:col===PK.C.orange?PK.C.orange:PK.C.ink});return kx+48+ag_tw(c,s,{w:800,size:28})+34;};
  key(key(x+30,PK.C.ink,dot,o.name||"Tomás"),PK.C.orange,null,"Team");
  c.strokeStyle=U.css(PK.C.mut,0.5);c.lineWidth=3;c.beginPath();c.moveTo(x0-20,y0+36);c.lineTo(x1+20,y0+36);c.stroke();c.lineJoin="round";
  const line=(vs,ks,col,d)=>{c.strokeStyle=U.css(col);c.lineWidth=6;c.setLineDash(d||[]);c.beginPath();c.moveTo(px(0),py(vs[0]));
      for(let i=1;i<=last;i++){const u=U.clamp(ks[i]||0,0,1);if(u<=0)break;c.lineTo(U.lerp(px(i-1),px(i),u),U.lerp(py(vs[i-1]),py(vs[i]),u));if(u<1)break;}
      if(ks[0]>0.004)c.stroke();c.setLineDash([]);
    c.fillStyle=U.css(col);for(let i=0;i<=last;i++){const a=i?U.pin(ks[i]||0,0.9,0.1):U.clamp(ks[0],0,1);if(a<=0.004)continue;c.save();c.globalAlpha*=a;c.beginPath();c.arc(px(i),py(vs[i]),9,0,U.TAU);c.fill();c.restore();}};
  line(FB_DAYS.tomas,tm,PK.C.ink,dot);line(FB_DAYS.team,te,PK.C.orange);c.restore();
  for(let i=0;i<=last;i++){const ta=i?U.pin(tm[i]||0,0.85,0.15):U.clamp(tm[0],0,1),ea=i?U.pin(te[i]||0,0.85,0.15):U.clamp(te[0],0,1),up=FB_DAYS.tomas[i]>FB_DAYS.team[i];
    ag_T(c,String(FB_DAYS.tomas[i]),px(i),py(FB_DAYS.tomas[i])+(up?-20:44),{w:800,size:30,align:"center",col:PK.C.ink,a:ta});
    ag_T(c,String(FB_DAYS.team[i]),px(i),py(FB_DAYS.team[i])+(up?44:-20),{w:800,size:30,align:"center",col:PK.C.orange,a:ea});
    ag_T(c,FB_DAYS.at[i],px(i),y0+74,{w:700,size:28,align:"center",col:PK.C.mut,a:Math.max(ta,ea)});}
  // the gap at the last month: a bracket to the right of its two points, and its size
  const g=U.clamp(o.gap||0,0,1);if(g>0.004){const ya=py(FB_DAYS.tomas[last]),yb=py(FB_DAYS.team[last]),gx=x1+30;c.save();c.globalAlpha*=g;c.strokeStyle=U.css(PK.C.amber);c.lineWidth=5;c.lineCap="round";c.lineJoin="round";
    c.beginPath();c.moveTo(gx-8,ya);c.lineTo(gx,ya);c.lineTo(gx,yb);c.lineTo(gx-8,yb);c.stroke();c.restore();
    ag_T(c,(FB_DAYS.tomas[last]-FB_DAYS.team[last])+" days",gx+18,(ya+yb)/2+11,{w:800,size:30,col:PK.C.amber,a:g});}}
// a review's outcome, as a card from a screen: approved (green) or back for changes (amber)
function fb_reviewCard(c,x,y,w,h,ok,a){const U=PK.u;if(ok)PK.tick(c,x+46,y+h/2,20,a==null?1:a,PK.C.green);
  else{c.save();c.globalAlpha*=a==null?1:a;c.fillStyle=U.css(PK.C.amber);c.beginPath();c.arc(x+46,y+h/2,20,0,U.TAU);c.fill();c.strokeStyle="#fff";c.lineWidth=3.4;c.lineCap="round";c.lineJoin="round";
    c.beginPath();c.arc(x+47,y+h/2+2,8,-0.2,Math.PI*1.25);c.stroke();c.beginPath();c.moveTo(x+35,y+h/2-3);c.lineTo(x+40,y+h/2+4);c.lineTo(x+45,y+h/2-4);c.stroke();c.restore();}
  ag_T(c,ok?"Review: approved":"Review: back for changes",x+82,y+h/2+11,{w:700,size:30,col:ok?PK.C.green:PK.C.amber,a:a==null?1:a});}

/* ---------------------------------------------------------------- Helena's corner: Helena and Tomás at the round table
   o.lean (0 to 1): Helena leans in to ask; o.up (0 to 1): Tomás looks up, and sits up; o.he, o.te: their faces; o.ask (0 to 1):
   Helena's open hand; o.hf, o.tf: their faces as PK.face gives them; o.laptop (0 to 1): her laptop open on the table, her hands on it (o.type: how far); o.tomas null: she is
   alone; o.write (0 to 1): Tomás writes in his notebook, open on the table in front of him; o.book (0 to 1): the notebook pushed
   across to the table's middle, where both read it (o.read: they lean in over it); o.t0: when the shot starts. Nobody crosses
   the lawn outside: the window sits behind their heads, and someone small out there showed between a neck and a shoulder.
   Returns {helena, tomas, laptop: where its screen is}. */
const FB_SITH={mode:"sit",lean:2,head:0,aN:[24,76],aF:[28,80],lN:[86,3],lF:[82,-5]},FB_SITH2={mode:"sit",lean:13,head:-5,aN:[40,80,"open"],aF:[36,78],lN:[86,5],lF:[82,-6]};
const FB_SITT={mode:"sit",lean:9,head:15,aN:[26,74,"grip"],aF:[30,78,"grip"],lN:[86,8],lF:[82,-2]},FB_SITT2={mode:"sit",lean:1,head:-3,aN:[24,74,"grip"],aF:[28,78,"grip"],lN:[86,6],lF:[82,-3]};
const FB_LEAN={mode:"sit",lean:16,head:6,aN:[30,84,"grip"],aF:[30,80,"flat"],lN:[86,4],lF:[82,-4]};
function fb_corner(x,tt,o){o=o||{};const U=PK.u,S=PK.S,{F,H,hx,ix,tx,rx,ty,win}=FB_CO,lean=o.lean||0,up=o.up||0,ask=o.ask||0,t0=o.t0||0,lw={lw:3.4,far:0,sh:5},
    lap=U.clamp(o.laptop||0,0,1),ty_=o.type==null?lap:o.type,wr=U.clamp(o.write||0,0,1),bk=U.clamp(o.book||0,0,1),rd=U.clamp(o.read||0,0,1),tom=o.tomas!==null;
  const hp=PK.poseMix(PK.poseMix(FB_SITH,FB_SITH2,lean),FB_LEAN,0.6*rd),tp=PK.poseMix(PK.poseMix(PK.poseMix(FB_SITT,FB_SITT2,up),FB_LEAN,wr),FB_LEAN,0.6*rd);
  S.begin(x,lw);PK.chair(x,hx-10,F,H,false,{});if(tom)PK.chair(x,ix+10,F,H,true,{col:PK.PAL.chair2});
  PK.person(x,"helena",hx,F,H,hp,{t:tt,part:"lower"});if(tom)PK.person(x,"tomas",ix,F,H,tp,{t:tt+1,flip:true,part:"lower"});
  S.begin(x,lw);PK.table(x,tx,ty,rx,F);
  S.begin(x,{lw:2.6,far:0,sh:3});PK.mug(x,tx-150,ty+12,0.9,PK.col("mug2"),tt,!o.dec||true);if(tom)PK.mug(x,tx+150,ty+14,0.9,PK.col("mug"),tt,true);
  // her laptop, opening towards her
  let scr=null;if(lap>0.004){const lx=tx-70;x.save();x.globalAlpha*=Math.min(1,lap*1.5);S.begin(x,{lw:2.6,far:0,sh:3});PK.laptop(x,lx,ty-6,{k:1.2,glow:true});x.restore();scr=[lx+96,ty-70];}
  // his notebook: in front of him as he writes, then across the table's middle, where both read it
  const bx=U.lerp(tx+150,tx+20,bk);if(o.write!=null||o.book!=null){S.begin(x,{lw:2.4,far:0,sh:3});PK.notebook(x,bx,ty+6,1.5,{open:true,cover:FB_TCOVER});}
  const helena=PK.person(x,"helena",hx,F,H,hp,Object.assign({t:tt,part:"upper",expr:o.he,gaze:o.hg||[1,0.2+0.5*rd]},o.hf||{},{
    reachN:lap>0.004?[U.lerp(790,tx-120,ty_),ty-12]:[U.lerp(790,838,ask),ty-4-40*ask],reachF:lap>0.004?[U.lerp(806,tx-150,ty_),ty-8]:[806,ty-12]}));
  let tomas=null;if(tom){const pen=wr>0.004||o.pen,hand=[U.lerp(tx+120,bx-20+Math.sin(tt*9)*3*wr,Math.max(wr,0.8*bk)),ty-10];
    tomas=PK.person(x,"tomas",ix,F,H,tp,Object.assign({t:tt+1,flip:true,part:"upper",expr:o.te,gaze:o.tg||[1,U.lerp(U.lerp(1,-0.2,up),0.9,Math.max(wr,rd))]},o.tf||{},{
      reachN:hand,reachNk:1,reachF:[tx+190,ty-10],hold:pen?PK.inHand.pen("blue"):null,holds:!!pen}));}
  return{helena,tomas,laptop:scr};}
/* the corner on a December evening: dark outside, the lamp on the shelf lit, the room a little warmer and dimmer */
function fb_cornerDec(c){const U=PK.u,R=FB_CO,[wx,wy,ww,wh]=R.win;PK.place.corner(c);
  c.save();c.beginPath();c.rect(wx,wy,ww,wh);c.clip();const g=c.createLinearGradient(0,wy,0,wy+wh);g.addColorStop(0,"rgb(36,46,82)");g.addColorStop(1,"rgb(112,96,120)");c.fillStyle=g;c.fillRect(wx,wy,ww,wh);
  PK.S.begin(c,{lw:2,far:0.5,sh:3});PK.S.fill(c,cc=>U.rrect(cc,wx+300,wy+250,360,260,3),[70,66,86],{flat:true});
  c.fillStyle="rgba(255,226,150,0.9)";for(let i=0;i<4;i++)for(let j=0;j<2;j++)if((i+j)%3!==1)c.fillRect(wx+330+i*80,wy+290+j*96,40,56);
  PK.S.fill(c,cc=>U.rrect(cc,wx-10,wy+wh-40,ww+20,60,0),[60,70,62],{flat:true,line:false});c.restore();PK.windowFrame(c,wx,wy,ww,wh,{});
  c.fillStyle="rgba(40,30,60,0.14)";c.fillRect(0,0,1920,1080);
  const gl=c.createRadialGradient(1750,360,10,1750,360,420);gl.addColorStop(0,"rgba(255,214,140,0.5)");gl.addColorStop(1,"rgba(255,214,140,0)");c.fillStyle=gl;c.fillRect(1300,0,620,900);}

/* ---------------------------------------------------------------- a seminar room
   Where Carmen Vidal runs a session for the university's data and IT managers: a window on the campus at the left, the board in
   the middle, a door at the right; the chairs come with the people. Its eye line is FB_SE.eye. */
const FB_SE={eye:380,board:{x:640,y:180,w:470,h:330}};
const fb_hS=fl=>PK.hAt(fl,FB_SE.eye);
function fb_seminarPlace(c){const S=PK.S,P=PK.paint,b=FB_SE.board;P.wall(c,PK.col("wallCool"),800);
  PK.window(c,110,170,330,400,PK.view.campus,{bld:0.62,light:false,trees:[[0.18,0.76,90,0],[0.5,0.84,70,1]]});
  S.begin(c,{lw:3,far:0.1,sh:5});PK.board(c,b.x,b.y,b.w,b.h);PK.clock(c,1665,196,40,10.0);
  P.floorAt(c,800,PK.col("carpet"),false);P.skirting(c,780);
  PK.door(c,1560,800,210,500,{col:PK.col("doorCool"),glass:true});
  S.begin(c,{lw:3,far:0.1,sh:5});PK.pot(c,1408,802,92,80);PK.plant(c,1408,722,1.0,6,0);}
// Carmen's board in the room: the same rows as the board seen close, small
const FB_SB={x:656,y:216,k:0.35,deco:true,floor:850,rest:1236};
const fb_roomBoard=(cx,tt,rows,who,o)=>PK.teach(cx,who,tt,rows,Object.assign({},FB_SB,{h:fb_hS(FB_SB.floor)},o||{}));
/* the session: two managers at the back, and Helena nearest, her notebook on her knee and a pen in her hand, all turned to the board.
   o.rows: the board's rows; o.say: when Carmen speaks; o.events: PK.face's, for her; o.note (0 to 1): Helena looks down and writes;
   o.he, o.m1, o.m2: their faces (PK.face's result); o.book: two books on the table by the board. Returns {carmen, helena}. */
const FB_KNEE={mode:"sit",lean:8,head:6,aN:[30,78,"grip"],aF:[26,70,"grip"],lN:[86,4],lF:[82,-4]};
const FB_M1=PK.extra(25),FB_M2=PK.extra(18);
function fb_session(x,tt,o){o=o||{};const U=PK.u,S=PK.S,wr=o.note||0,lis=g=>PK.face(tt,{expr:"listen",gaze:[1,g]},[]);
  // a low table by the board, with Carmen's two books on it
  S.begin(x,{lw:3,sh:4});PK.desk(x,1240,700,240,850,{k:0.8});S.begin(x,{lw:2.4,sh:3});
  if(o.books!==false){S.fill(x,c=>U.rrect(c,1170,676,110,24,3),[74,114,144],{});S.fill(x,c=>U.rrect(c,1180,652,96,24,3),[194,94,84],{});}
  const Jc=fb_roomBoard(x,tt,o.rows||[],"carmen",{say:o.say,events:o.events});
  PK.seated(x,FB_M1,236,872,fb_hS(872),PK.poseMix("sit","sitBack",0.4),Object.assign({t:tt+2},o.m1||lis(-0.25)));
  PK.seated(x,FB_M2,90,936,fb_hS(936),PK.poseMix("sit","sitBack",0.6),Object.assign({t:tt+4},o.m2||lis(-0.3)));
  const Jh=PK.seated(x,"helena",452,1000,fb_hS(1000),FB_KNEE,Object.assign({t:tt,underF:PK.inHand.notebook({}),hold:PK.inHand.pen("blue"),holds:true},o.he||lis(-0.35),wr>0.004?{gaze:[1,-0.35+0.9*wr],nod:0.22*wr}:{}));
  return{carmen:Jc,helena:Jh};}
AG_BARE.fbSeminar=(x,tt)=>{};

/* ---------------------------------------------------------------- a teaching room: Tomás trains the reports' readers
   He stands by the board, his notes in his hand; the readers sit in the rows, Graham and Mei among them. o.n: how many seats are
   taken; o.te: his face; o.say: when he speaks. Returns {tomas}. */
const FB_NOTES={lean:2,head:3,aN:[24,74,"grip"],aF:[6,14],lN:[-2,-2],lF:[4,3]},FB_NOTES2={lean:3,head:-4,aN:[28,86,"grip"],aF:[8,18],lN:[-2,-2],lF:[5,4]};
const fb_notesHold=(c,h,deg,J)=>{const u=J.u;PK.S.begin(c,{lw:2.2,sh:3});PK.S.poly(c,[[h[0]-14*u,h[1]-104*u,1],[h[0]+62*u,h[1]-112*u,1],[h[0]+70*u,h[1]-8*u,1],[h[0]-6*u,h[1],1]],PK.col("board"),{exact:true});
  PK.S.line(c,cc=>{for(let i=0;i<4;i++){cc.moveTo(h[0]+2*u,h[1]-(88-i*20)*u);cc.lineTo(h[0]+52*u,h[1]-(93-i*20)*u);}},PK.C.mut,0.5);};
function fb_training(x,tt,o){o=o||{};const who=i=>i===5?"graham":i===9?"mei":null;
  PK.audience(x,tt,o.n==null?7:o.n,{order:[5,9,1,6,2,8,10],who,look:0.7});
  const J=PK.person(x,"tomas",1560,856,fb_hL(856),PK.poseMix(FB_NOTES,FB_NOTES2,0.5+0.5*Math.sin(tt*0.7)),{t:tt,flip:true,hold:fb_notesHold,holds:true,expr:o.te||{brow:0.3,smile:0.5,open:PK.talk(tt,0,1e9)*0.5}});
  return{tomas:J};}
AG_BARE.fbRoom=(x,tt)=>PK.audience(x,tt,0,{});

/* ---------------------------------------------------------------- the key ideas, apart from the scenes
   Carmen Vidal, a consultant who works with the university now and then, explains each idea at the board of a seminar room, to the
   managers who came (PK.teach). The film cuts between the room, where its board shows her lines small, and the board seen close (the
   place fbBoard), where they are large enough to read: both draw the same rows at the same times. What Tomás plans goes in his own
   notebook, and what Helena keeps in hers (PK.notes, the places fbNotesT and fbNotesH). Every time comes from the voice: sc is the
   chapter, w a word's time in a line. Colour means what it means in the film: blue a question or a rule, green what is of value or
   cleared, amber what isn't so, orange data.
   The boards are laid out for someone who walks: each question on the left with its answers under it, and what comes later at the
   right; nothing is underlined or struck back along its words. */
// 1. two old books, and their questions: Mager and Pipe at the left, Gilbert at the right
const fb_boardA=(sc,w)=>[
  {s:"Mager and Pipe, 1970",x:60,y:96,size:42,col:"mut",at:sc.cues.mager+0.1,d:1.0},
  {s:"Could they do it",x:60,y:184,size:52,w:700,col:"blue",at:w("mager","could they",-0.1),d:0.9},
  {s:"if they had to?",x:60,y:258,size:52,w:700,col:"blue",at:w("mager","if they had",-0.1),d:0.8},
  {s:"No:",x:60,y:346,size:48,w:700,col:"amber",at:w("mager","If not",-0.1),d:0.25},{s:"a skill to learn",size:48,at:w("mager","a skill",-0.2),d:0.7},
  {s:"Yes:",x:60,y:430,size:48,w:700,col:"green",at:w("mager","something",-0.6),d:0.25},{s:"something's in the way",size:48,at:w("mager","something",0.2),d:0.9},
  {s:"Thomas Gilbert, 1978",x:650,y:96,size:42,col:"mut",at:sc.cues.gilbert+0.1,d:1.0},
  {s:"What surrounds the work?",x:650,y:184,size:46,w:700,col:"blue",at:w("gilbert","what surrounds",-0.1),d:1.2},
  {s:"information, tools, rewards",x:650,y:270,size:46,at:w("gilbert","information",-0.1),d:1.2},
  {s:"then, the person",x:650,y:356,size:50,w:700,at:w("gilbert","before you",0),d:0.8}];
// 2. why people say what's wrong: Amy Edmondson's name for it
const fb_boardB=(sc,w)=>[
  {s:"Amy Edmondson, 1999",x:60,y:100,size:42,col:"mut",at:sc.cues.safe+0.1,d:1.0},
  {s:"Psychological safety",x:60,y:206,size:66,w:700,col:"blue",at:w("safe","psychological",-0.1),d:1.1},
  {s:"people say what's wrong",x:200,y:318,size:52,at:w("safe","people say",-0.1),d:1.1},
  {s:"when it's safe to",size:52,w:700,col:"green",at:w("safe","when it's",-0.1),d:0.8}];
// 3. how far behind: not behind your expectations, behind the team; later, read against its own change, never against a colleague
const fb_boardC=(sc,w)=>[
  {s:"How far behind?",x:60,y:118,size:66,w:700,col:"blue",at:w("far","How far",0.05),d:0.9},
  {k:"cross",x:96,y:220,r:17,col:"amber",at:w("far","Not behind",-0.2),d:0.3},{s:"behind your expectations",x:140,y:238,size:52,col:"mut",at:w("far","Not behind",0.1),d:1.1},
  {k:"tick",x:96,y:324,r:19,col:"green",at:w("far","behind the team",-0.3),d:0.3},{s:"behind the team",x:140,y:342,size:52,w:700,at:w("far","behind the team",0),d:0.8},
  {s:"against its own change",size:52,col:"green",at:w("own","against the team's",-0.1),d:1.1},
  {k:"cross",x:480,y:428,r:17,col:"amber",at:w("own","never",-0.2),d:0.3},{s:"never against a colleague",x:524,y:446,size:52,col:"mut",at:w("own","never",0.1),d:1.2}];

/* ---------------------------------------------------------------- the notebooks' pages (the page's own px)
   One pen writes a page, so its strokes come one after the other: the film gives each row the time the voice says it, in the order
   the pen writes them, and paces the page (PK.pace(ctx, null, rows)). A row is written in about a second. */
const fb_dot=(y,col,at)=>({k:"dot",x:92,y:y-18,r:9,col,at,d:0.15});
// Tomás's plan, in his hand: what he'll learn, by when, and what he needs
const fb_plan=(sc,w)=>[
  {s:"My plan",x:70,y:128,size:92,w:700,col:"blue",at:sc.cues.plan-0.3,d:0.6,marks:[["under","blue",null,0.3]]},
  fb_dot(262,"blue",w("plan","what he'll",-0.25)),{s:"Learn reports as code",x:128,y:262,size:64,at:w("plan","what he'll",-0.05),d:1.0},
  {s:"by September",x:780,y:262,size:44,col:"mut",at:w("plan","by when",0),d:0.6},
  fb_dot(378,"green",w("plan","what he needs",-0.25)),{s:"Pair with Jun",x:128,y:378,size:64,at:w("plan","what he needs",-0.05),d:0.8},
  {s:"Tue and Fri",x:780,y:378,size:44,col:"mut",at:w("plan","what he needs",0.85),d:0.5},
  fb_dot(494,"green",w("plan","what he needs",1.45)),{s:"Thursdays kept clear",x:128,y:494,size:64,at:w("plan","what he needs",1.65),d:1.0}];
// Helena's notebook, in December: give it time, and what stays his
const fb_note1=(sc,w)=>[
  {s:"Give it time",x:70,y:128,size:92,w:700,col:"blue",at:sc.cues.years-0.3,d:0.7,marks:[["under","blue",null,0.3]]},
  {s:"months, even years",x:128,y:262,size:64,at:w("years","months",-0.1),d:0.9},
  {s:"patience is part of the plan",x:128,y:378,size:64,at:w("years","Patience",-0.1),d:1.2,marks:[["hl","green",null,0.45]]},
  fb_dot(512,"blue",w("private","his measures",-0.3)),{s:"His numbers stay his",x:128,y:512,size:62,at:w("private","his measures",-0.1),d:1.0},
  fb_dot(628,"blue",w("private","his reasons",-0.3)),{s:"His reasons stay private",x:128,y:628,size:62,at:w("private","his reasons",-0.1),d:1.1},
  {k:"star",x:1000,y:150,r:30,col:"amber",at:sc.ends.private+0.3,d:0.45}];
// Helena's notebook, on Monday: three things, and beside each, in one column, what it means. The fourth, the plan read each month,
// the film shows: Helena and Tomás at her table, over his plan (a chapter stays its people's, kit README)
const fb_note2=(sc,w)=>{const c=sc.cues;return[
  {s:"On Monday",x:70,y:122,size:88,w:700,col:"blue",at:c.team-0.5,d:0.6,marks:[["under","blue",null,0.3]]},
  fb_dot(250,"blue",w("team","read the team's",-0.3)),{s:"Read the team first",x:128,y:250,size:62,at:w("team","read the team's",-0.1),d:0.9},
  {s:"then one person",x:700,y:250,size:42,col:"mut",at:w("team","before",0),d:0.8},
  fb_dot(366,"green",c.cause-0.25),{s:"Ask before you judge",x:128,y:366,size:62,at:c.cause-0.05,d:1.0},
  {s:"find the cause",x:700,y:366,size:42,col:"mut",at:w("cause","look for",0),d:0.7},
  fb_dot(482,"amber",c.clear-0.25),{s:"Clear the blockers",x:128,y:482,size:62,at:c.clear-0.05,d:0.9,marks:[["hl","amber"]]},
  {s:"against the team",x:700,y:482,size:42,col:"mut",at:w("clear","measure",0),d:0.8},
  {k:"star",x:1010,y:104,r:30,col:"amber",at:sc.ends.clear+0.3,d:0.45}];};

/* ---------------------------------------------------------------- what they write to each other
   October: Jun sends a report back to Tomás twice, from wherever she is; he answers. As his screen has it (j1, j2: when each of hers
   comes in; ta: when he sends his), and as her phone has it, where she answers at tb */
const FB_SAID=[{s:"Sent back: see my notes."},{s:"Back once more, sorry."}];
const fb_chat=(j1,j2,ta)=>({title:"Jun Park",who:["jun"],me:"tomas",msgs:[Object.assign({who:"jun",at:j1},FB_SAID[0]),Object.assign({who:"jun",at:j2},FB_SAID[1]),{who:"tomas",s:"On it. Thanks, Jun.",at:ta,type:1.5}]});
const fb_chat2=tb=>({title:"Tomás Ortega",who:["tomas"],me:"jun",msgs:FB_SAID.map(m=>Object.assign({who:"jun",at:-1e3},m)).concat([{who:"tomas",s:"On it. Thanks, Jun.",at:-1e3},{who:"jun",s:"No rush.",at:tb,type:0.9}])});
