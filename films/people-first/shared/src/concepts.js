/* ===== The people kit: key ideas, apart from the scene =====
   A film moves between people and its key ideas (the author, 17 November 2026). Two devices hold the ideas, both written by hand
   (hand.js), and both keep a person in the picture:
     a board   the ideas a film opens with, explained by someone at a board: a consultant, a teacher, a colleague. They write
               each line as the voice says it, then turn to the room.
     a book    what to remember: a remark, a conclusion, the film's takeaway, as someone's colourful notes in their notebook,
               seen from above, their hand writing them.
   A scene shows who writes and where (the consultant at the room's board; Ivy opening her notebook at her desk); then the film
   cuts or dissolves to the board or the page, close enough to read, and back to the people.

     PK.place.board      a wall with a wide board, close enough to read, and floor enough for whoever explains to stand whole.
                         PK.ROOMS.board: eye, floor, h (their height), board {x, y, w, h}, rest (where they stand aside),
                         reach [y0, y1] (the band of the board's own px a hand reaches: keep every line's baseline inside it)
     PK.teach(ctx, who, t, items, o)   someone explains at a board. items: PK.ink's rows, in the board's own px from its top left
                         corner. The explainer faces the board to write, standing to the right of the marker so that what they
                         write stays in view, and walks along as a line grows. Then they turn to the room and step to the right
                         of all that is written, so nobody has to read round them: at once after the last line, and between
                         two lines when the next leaves the time to come back. They start at o.rest, beyond the board.
                         o: x, y (the board's corner), k (the writing's scale), floor, h, rest, face (how far they turn to the
                         room: 0.66), stand ("clasp"), say ([[t0, t1], …]: when they speak), events (PK.face's), deco, a (fades
                         the writing). who null: only the writing. -> their joints, with J.pen (PK.ink's result) and J.late
                         On a board far off (the room's own, in a wide shot) give k and deco: the words are too small to read
                         there on purpose, since the close view shows them.
     PK.pace(ctx, who, rows)   the rows, each moved as much later as whoever writes them needs to walk to it. Give each row the
                         time the voice says it, pace them once, and hand the result to every PK.teach that shows them.
     Lay a board out for someone who walks (the check, people.py, lists what goes against these):
       - they walk about 0.95 of their height a second, so a new row costs its walk back: about 0.8 s for a row 500 px long.
         PK.pace makes the row wait for it, and a row that waits is written after the voice has said it. So write on from left
         to right: a few words in another colour go on along their line (a row with no x); a short row under a long one starts
         where the long one ended, not at the left again; what the voice says first is written first;
       - writing below the top of their head (the board's y 130 and below) is hidden while they stand in front of it. They step
         clear by themselves (about 1 s for 600 px): leave that, and a second to read, before the film cuts away;
       - a line drawn back along words (under them, or through them) leaves the writer at the words' start, in front of the
         rows above. Words in a colour need no walk; a tick or a cross before a row, made before it, needs none either;
       - what is added later to rows that are there (a letter beside each) goes to their right, never to their left, where the
         writer would stand on the rows;
       - a board is written with markers: words in a colour, a line under, a ring, a box, a tick, a cross, an arrow. A
         highlighter's band belongs to a notebook.
     PK.place.notes      a desk seen from above, an open notebook on it: PK.ROOMS.notes: page {x, y, w, h} (the page to write
                         on, in the picture's px), rot (how the book is turned), rest (where the hand waits)
     PK.notes(ctx, who, t, items, o)   someone's notes: items are PK.ink's rows in the page's own px; who gives the hand its skin
                         and its sleeve. The hand writes each item, and waits at the page's corner between two that are far
                         apart. o.a fades the writing; o.hand false: the notes without the hand. -> PK.ink's result
     PK.penHand(ctx, who, tip, o)      a hand holding a pen, seen from above, the pen's point at tip; o.k its size, o.col the pen's
                                       colour, o.lift (0 to 1: raised off the page)
     PK.notebook(ctx, x, y, k, o)      a notebook as a thing, seen from the side: closed on a desk (its near corner at x, y), or
                                       o.open: held open on a knee or a hand; o.rot, o.cover (its colour)
     PK.inHand.pen(col), PK.inHand.marker(col), PK.inHand.notebook(o)   what a hand holds, for PK.person's o.hold and o.underF
   Writing takes a hand: a pen or a marker in it is what the hand holds. Nothing here goes below y 890 but the desk, the floor
   and the hand: the captions are there. */
(K=>{
const {TAU,rad,lerp,clamp,sine,pin,mix,dk,lt,css,hash,polar,capsule,pg,rrect,ell}=K.u,C=K.col;
Object.assign(K.PAL,{page:[254,251,244],dot:[204,210,220],ring:[96,100,112],cover:[70,120,134],tab:[250,214,122],desk:[214,170,124]});

/* ---------------------------------------------------------------- a board someone explains at */
K.ROOMS.board={eye:300,floor:960,h:725,board:{x:150,y:118,w:1250,h:524},rest:1640,reach:[96,470]};
const marker=(c,a,b,col,u)=>{const S=K.S;S.fill(c,cc=>capsule(cc,a,b,9*u,8*u),[70,74,90],{w:0.6});S.fill(c,cc=>capsule(cc,[lerp(a[0],b[0],0.8),lerp(a[1],b[1],0.8)],b,8*u,6*u),col,{w:0.6,flat:true});};
K.place.board=ctx=>{const S=K.S,R=K.ROOMS.board,b=R.board;K.paint.wall(ctx,C("wall"),900);
  S.begin(ctx,{lw:4,far:0.05,sh:6});K.board(ctx,b.x,b.y,b.w,b.h);
  // the markers on its tray, one for each colour the writing uses
  [K.C.blue,K.C.green,K.C.amber].forEach((c,i)=>marker(ctx,[b.x+b.w*0.5-150+i*112,b.y+b.h+3],[b.x+b.w*0.5-150+i*112+84,b.y+b.h+3],c,1));
  K.paint.floorAt(ctx,900,C("floor"),true);K.paint.skirting(ctx,878);};
K.inHand={
  marker:col=>(c,hd,deg,J)=>marker(c,polar(hd,deg,-8*J.u),polar(hd,deg,60*J.u),K.inkCol(col),J.u),
  pen:col=>(c,hd,deg,J)=>{const S=K.S,a=polar(hd,deg-150,34*J.u),b=polar(hd,deg+30,30*J.u);S.fill(c,cc=>capsule(cc,a,b,5.5*J.u,4.5*J.u),K.inkCol(col||"blue"),{w:0.6});},
  notebook:o=>(c,hd,deg,J)=>K.notebook(c,hd[0],hd[1],J.u*1.5,Object.assign({open:true,held:true},o||{}))
};
/* whoever writes at a board, as a body that walks: where they stand for each stroke, and how fast they get there */
/* for the check: the rows written near an edge of their board or page, or past it, each {s, room}: the px left between its ink
   and the nearest edge (less than nothing: past it), in the surface's own px (w by h) */
const nearEdge=(ctx,items,w,h)=>{const out=[];for(const s of K.inkPlan(ctx,items,{},true)){if(!s.box)continue;const room=Math.min(s.box[0],w-s.box[2],s.box[1],h-s.box[3]);
  if(room<60)out.push({s:String(items[s.i].s||items[s.i].k||"a drawing"),room});}return out;};
const boardOf=o=>{const R=K.ROOMS.board;return Object.assign({x:R.board.x,y:R.board.y,k:1,floor:R.floor,h:R.h,rest:R.rest,face:0.66,stand:"clasp",lw:7},o||{});};
const walker=(P,o)=>{const h=o.h,u=h/1000,fl=o.floor,J0=K.rig(P,0,fl,h,"stand",{flip:true,life:0}),sdx=J0.shF[0],sy=J0.shF[1],A=(J0.p.uarm+J0.p.farm+J0.p.hand*0.45)*u,near=0.14*h,
    // where they stand for the marker to be at q: the shoulder as far from it as an arm reaches with ease, and never so near that they hide it
    standX=q=>q[0]-sdx+Math.max(near+sdx,Math.sqrt(Math.max(0.09*A*A,0.7*A*A-(q[1]-sy)*(q[1]-sy)))),
    toPic=q=>[o.x+q[0]*o.k,o.y+q[1]*o.k],box=s=>{const a=toPic([s.box[0],s.box[1]]),b=toPic([s.box[2],s.box[3]]);return[a[0],a[1],b[0],b[1]];},
    // the furthest to the right of q their shoulder can be for the marker to reach it
    far=q=>q[0]-sdx+Math.sqrt(Math.max(0.04*A*A,0.85*A*A-(q[1]-sy)*(q[1]-sy))),
    /* where they stand as a stroke starts, coming from px. Words, and a line drawn along something, they walk along, to the right
       of the marker; a mark of its own (a tick, a ring) they make from one place, to the right of all of it. Where they are
       already will do, or a hand's width from it, when the marker reaches from there and they don't hide the mark: nobody
       walks for a tick */
    stay=(px,lo,hi,best)=>{if(px==null)return best;const c=clamp(px,lo,Math.max(lo,hi));return Math.abs(c-px)<0.06*h?c:best;},
    from=(s,px)=>{if(s.text||s.line){const q=toPic(s.at(0));return stay(px,q[0]+near,far(q),standX(q));}
      const b=box(s),m=[(b[0]+b[2])/2,(b[1]+b[3])/2],lo=b[2]+near,hi=Math.max(lo,far([b[0],m[1]]));return stay(px,lo,hi,Math.max(lo,Math.min(standX(m),hi)));};
  // how long a walk of d px takes at a speed: a step of a hand's width takes no time, since the arm reaches; a real walk has a turn in it
  return{h,u,fl,sdx,sy,A,near,standX,toPic,box,speed:0.95*h,side:0.9*h,dur:(d,sp)=>Math.abs(d)<0.06*h?0:Math.max(0.3,Math.abs(d)/sp+0.1),
    // what they could hide: writing that reaches below the top of their head
    hid:s=>box(s)[3]>fl-0.95*h,from,to:(s,a)=>s.text||s.line?standX(toPic(s.at(1))):a};};
/* PK.pace(ctx, who, rows, o) -> the rows, each line and mark that has a time moved as much later as whoever writes them needs to
   walk to it from where the one before ended, and never earlier than its own at. So give each row the time the voice says it,
   pace the rows once, and hand the result to PK.teach, for the board seen close and for the room's own board alike: both are
   then at the same line at every moment. It paces for the board seen close (PK.ROOMS.board), where the walks are longest. A row
   keeps how far its words were moved as lag (seconds): the check lists a row that comes long after the voice.
   The hand needs time too: between two strokes the pen crosses to the next one's start, and a stroke that began the moment the
   last one ended, a row below, would throw the arm there in one frame. So a stroke also waits until the hand can have crossed.
   With who null it paces a page of notes (PK.notes), where only a hand moves: PK.pace(ctx, null, rows). There one stroke also
   waits for the one before to end, since one pen writes them all. */
K.pace=(ctx,who,items,o)=>{const P=typeof who==="string"?K.CAST[who]:who,out=items.map(it=>Object.assign({},it,it.marks?{marks:it.marks.map(m=>m.slice())}:{})),moved={};
  if(P)o=boardOf(o);
  const G=P?walker(P,o):null,S_=K.inkPlan(ctx,items,P?{x:o.x,y:o.y,k:o.k,lw:o.lw,walk:true}:{}),at=(s,p)=>G?G.toPic(s.at(p)):s.at(p),hand=G?0.7*G.h:1500;
  let px=P?o.rest:0,pt=-1e9,pq=null;
  for(const s of S_){const a=G?G.from(s,px):0,t0=s.t0+(s.own?0:moved[s.i]||0),q0=at(s,0),hop=pq?Math.min(0.35,Math.hypot(q0[0]-pq[0],q0[1]-pq[1])/hand):0,
      t=Math.max(t0,pt+Math.max(G?G.dur(a-px,G.speed)+0.06:0.05,hop)),it=out[s.i];
    if(s.m==null){if(t>t0+1e-6){it.at=t;it.lag=(it.lag||0)+t-t0;}moved[s.i]=t-s.t0;}
    else if(s.own||t>t0+1e-6){const m=it.marks[s.m];m[2]=t;if(m[3]==null)m[3]=s.t1-s.t0;}
    if(G)px=G.to(s,a);pt=t+(s.t1-s.t0);pq=at(s,1);}
  return out;};
/* PK.written(ctx, who, rows) -> every stroke of rows as PK.pace gave them, in the order the pen draws them: {s (a row's words, or
   a mark's kind), mark (true for a pen's mark), t0, t1 (the scene's seconds), x, y (its middle in the picture: on the board seen
   close, or on the page)}. A film's score asks for it (tools/pens.py), so a marker's or a pen's sound falls where the picture
   writes: a paced row's moment isn't a word's time plus an offset. who: as for PK.pace (null for a page of notes) */
K.written=(ctx,who,items)=>{const P=typeof who==="string"?K.CAST[who]:who,o=P?boardOf():null;
  return K.inkPlan(ctx,items,P?{x:o.x,y:o.y,k:o.k,lw:o.lw,walk:true}:{}).map(s=>{const q=s.at(0.5),p=P?[o.x+q[0]*o.k,o.y+q[1]*o.k]:pageAt(K.ROOMS.notes,q),it=items[s.i];
    return{s:s.m!=null?String(it.marks[s.m][0]):String(it.s||it.k||"drawing"),mark:s.m!=null||!it.s,t0:s.t0,t1:s.t1,x:p[0],y:p[1]};});};
K.teach=(ctx,who,t,items,o)=>{o=boardOf(o);
  const io={x:o.x,y:o.y,k:o.k,lw:o.lw,deco:o.deco,a:o.a,walk:true},pen=K.ink(ctx,items,t,io),P=typeof who==="string"?K.CAST[who]:who;if(!P)return{pen};
  const G=walker(P,o),{h,u,fl,sdx,sy,A,toPic,box,hid,from,to,speed,side,dur}=G,all=K.inkPlan(ctx,items,io,true),S_=all.filter(s=>s.t1>-1e8).sort((a,b)=>a.t0-b.t0),
    amp=K.ampOf(P),stride=K.strideOf(h,amp),mv=[],busyAt=[],late=[];
  /* their feet: moves [t0, t1, x0, x1, eased]; between two, they stay where they are. To write, they walk to the line's start,
     facing the board, and along it as it grows. Then they turn to the room, and never stay in front of what is written: they step
     to the right of all of it (right: its right edge, as far as they could hide it) as soon as the next line leaves the time to
     come back; and when the next is written from beyond the words, they go there at once. A line that starts before their legs
     can bring them to it is late: PK.pace moves it, and the check lists one that is left (people.py). */
  let px=o.rest,pt=-1e9,right=-1e9;for(const s of all)if(s.t1<=-1e8&&hid(s))right=Math.max(right,box(s)[2]);
  const go=(t1,x1,sp,busy)=>{if(Math.abs(x1-px)<=0.5)return Math.max(pt,t1);const d=Math.max(0.12,dur(x1-px,sp)),t0=Math.max(pt,t1-d),te=Math.max(t1,t0+0.72*d);mv.push([t0,te,px,x1,1]);if(busy)busyAt.push([t0,te]);px=x1;pt=te;return te;};
  S_.forEach((s,j)=>{const a=from(s,px),b=to(s,a),ta=go(s.t0-0.05,a,speed,true);if(ta>s.t0+0.2)late.push({i:s.i,t:s.t0,by:ta-s.t0});
    if(b!==a&&ta<s.t1-0.05){mv.push([Math.max(s.t0,ta),s.t1,a,b,0]);px=b;}
    pt=Math.max(pt,s.t1);busyAt.push([s.t0-0.2,s.t1+0.1]);if(hid(s))right=Math.max(right,box(s)[2]);
    const nx=S_[j+1],clear=Math.max(px,right+0.26*h);if(clear-px<=0.03*h)return;
    // the hand comes down and they turn, then they go
    if(!nx){go(pt+0.2+dur(clear-px,side),clear,side,false);return;}
    const aN=from(nx,px);
    if(aN>=clear-0.02*h){if(nx.t0-pt>0.5+dur(aN-px,speed))go(pt+0.2+dur(aN-px,speed),aN,speed,false);}
    else if(aN!==px&&nx.t0-0.05-pt>=0.2+dur(clear-px,side)+0.3+dur(aN-clear,speed))go(pt+0.2+dur(clear-px,side),clear,side,false);});
  const xAt=tt=>{let x=o.rest;for(const [t0,t1,x0,x1,e] of mv){if(tt<=t0)break;const q=clamp((tt-t0)/(t1-t0),0,1);x=lerp(x0,x1,e?sine(q):q);}return x;};
  let busy=0;for(const [t0,t1] of busyAt)busy=Math.max(busy,pin(t,t0-0.35,0.4)*(1-pin(t,t1+0.1,0.45)));
  // off: they walk away from the board, to the right, and face the way they go
  const x=xAt(t),vs=(xAt(t+0.04)-xAt(t-0.04))/0.08,v=Math.abs(vs),off=clamp(vs/(0.3*h),0,1)*(1-busy),wr=pen.on*busy,q=pen.pen||[x-0.2*h,sy],
    walk=K.poseMix(K.poseMix(o.stand,"ease",Math.max(busy,off)),K.poseWalk(Math.abs(x-o.rest)/stride,1,amp*lerp(1,0.42,wr)),clamp(v/180,0,1)*0.85),low=clamp((q[1]-sy-0.5*A)/(0.45*A),0,1.3)*wr,
    pose=Object.assign({},walk,{lean:(walk.lean||0)+14*low,aF:[walk.aF[0],walk.aF[1],"grip"]}),
    // the hand, so that the marker's point is on the writing: the marker lies along the forearm, which points about where the shoulder does
    sh=[x+sdx,sy],dl=Math.hypot(q[0]-sh[0],q[1]-sh[1])||1,tg=[q[0]-(q[0]-sh[0])/dl*58*u,q[1]-(q[1]-sh[1])/dl*58*u+Math.sin(t*23)*2.2*(1-pen.lift)*wr],
    F=K.face(t,{expr:o.expr||"neutral",gaze:[lerp(0.1,1,busy),lerp(0,q[1]<sy?-0.4:0.3,wr)]},(o.events||[]).concat((o.say||[]).map(([a,b])=>[a,"say",b-a])));
  const J=K.person(ctx,who,x,fl,h,pose,Object.assign({t:o.t==null?t:o.t,flip:lerp(lerp(o.face,0.25,off),1,busy),reachF:tg,reachFk:wr,underF:K.inHand.marker(pen.col)},F));
  /* for the check: are they in front of words that are written, close enough to read, while they aren't writing; the lines that
     start before they can be there; and the lines PK.pace moved long after the voice */
  if(K.watch){const name=i=>String(items[i].s||items[i].k||"a drawing"),
      over=!o.deco&&busy<0.5&&all.some(s=>{if(!hid(s)||s.t0>t)return false;const b=box(s),x1=s.t1>t&&(s.text||s.line)?toPic(s.at(clamp((t-s.t0)/((s.t1-s.t0)||1),0,1)))[0]:b[2];return b[0]<x+0.1*h&&Math.max(x1,b[0])>x-0.1*h;});
    K.watch({teach:typeof who==="string"?who:(P.key||P.name||"someone"),over,late:o.deco?[]:late.map(l=>({s:name(l.i),t:l.t,by:l.by})),
      lag:o.deco?[]:items.map((it,i)=>it.lag?{s:name(i),t:it.at,by:it.lag}:null).filter(Boolean),
      edge:o.deco?[]:nearEdge(ctx,items,K.ROOMS.board.board.w,K.ROOMS.board.board.h),
      // a board seen close that is only writing: one of the film's people explains at it, and nothing on it is drawn as a designer
      // would (PK.sk.drawn). A board of a story's own folk (who: a row of theirs) is as plain as its time
      plain:!o.deco&&typeof who==="string"&&!items.some(it=>it&&it.drawn),a:1,ctx});}
  J.pen=pen;J.writing=wr;J.late=late;return J;};

/* ---------------------------------------------------------------- a notebook someone writes in
   The desk is seen from straight above; the book lies a little turned, its right page large in the picture, its left page mostly
   out of it. What is written goes on the right page, in the page's own px. */
K.ROOMS.notes={rot:-0.03,pivot:[960,540],page:{x:420,y:70,w:1100,h:1160},rest:[1610,960]};
// the page's own px to the picture's, and back to draw on it
const pageAt=(R,q)=>{const c=Math.cos(R.rot),s=Math.sin(R.rot),x=R.page.x+q[0]-R.pivot[0],y=R.page.y+q[1]-R.pivot[1];return[R.pivot[0]+x*c-y*s,R.pivot[1]+x*s+y*c];};
const onBook=(ctx,R)=>{ctx.translate(R.pivot[0],R.pivot[1]);ctx.rotate(R.rot);ctx.translate(-R.pivot[0],-R.pivot[1]);};
/* o.cover: the book's colour; o.left(ctx, page): what is on the left page (page: its {x, y, w, h}, in the turned book's px; the
   part of it in the picture is about 330 px wide); o.on(ctx): what else lies on the desk, in the picture's px */
K.place.notes=(ctx,o)=>{o=o||{};const S=K.S,R=K.ROOMS.notes,p=R.page,desk=C("desk"),cover=S.tone(o.cover||K.PAL.cover),page=C("page"),g=40,lp={x:p.x-g-1000,y:p.y,w:1000,h:p.h};
  ctx.fillStyle=css(desk);ctx.fillRect(0,0,1920,1080);
  // the desk's grain: a few long lines
  ctx.save();ctx.strokeStyle=css(dk(desk,0.16),0.55);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();
  for(let i=0;i<9;i++){const y=40+i*128+(hash(i,3)-0.5)*40,x0=hash(i,5)*600-100,x1=x0+500+hash(i,7)*900;ctx.moveTo(x0,y);ctx.bezierCurveTo(lerp(x0,x1,0.3),y+7,lerp(x0,x1,0.7),y-7,x1,y+3);}ctx.stroke();ctx.restore();
  // the highlighters the notes are coloured with, lying beside the book (o.things false: a bare desk)
  if(o.things!==false){S.begin(ctx,{lw:3.4,sh:6});[["blue",1668,196,82],["green",1752,236,97],["amber",1836,188,88]].forEach(([n,x,y,deg])=>{const c0=mix(K.C[n],[255,255,255],0.3);
      ctx.save();ctx.translate(x,y);ctx.rotate(rad(deg));ctx.fillStyle="rgba(84,52,36,0.2)";ctx.beginPath();capsule(ctx,[8,10],[212,10],24,24);ctx.fill();
      S.poly(ctx,[[-30,-9,1],[2,-15,1],[2,15,1],[-30,4,1]],dk(c0,0.42),{exact:true,w:0.8});S.fill(ctx,c=>capsule(c,[0,0],[206,0],23,23),c0,{});S.fill(ctx,c=>capsule(c,[150,0],[208,0],24,24),dk(c0,0.2),{w:0.8});ctx.restore();});}
  if(o.on)o.on(ctx);
  ctx.save();onBook(ctx,R);S.begin(ctx,{lw:4,sh:8});
  // its shadow on the desk, the cover, the pages under the two that show, the two pages
  ctx.fillStyle="rgba(84,52,36,0.22)";ctx.beginPath();rrect(ctx,lp.x-10,p.y+4,lp.w+g+p.w+44,p.h+30,22);ctx.fill();
  S.fill(ctx,c=>rrect(c,lp.x-22,p.y-18,lp.w+g+p.w+46,p.h+40,20),cover,{});
  S.fill(ctx,c=>rrect(c,p.x-6,p.y-4,p.w+18,p.h+12,10),dk(page,0.1),{w:0.7});S.fill(ctx,c=>rrect(c,p.x-6,p.y-4,p.w+10,p.h+8,10),dk(page,0.05),{w:0.7});
  S.fill(ctx,c=>rrect(c,lp.x,lp.y,lp.w,lp.h,10),dk(page,0.025),{});S.fill(ctx,c=>rrect(c,p.x,p.y,p.w,p.h,10),page,{});
  // a grid of dots to write on
  ctx.fillStyle=css(C("dot"));ctx.beginPath();for(const q of [lp,p])for(let y=q.y+52;y<Math.min(q.y+q.h-20,1240);y+=46)for(let x=q.x+(q===p?46:lp.w-22-46*Math.floor((lp.w-40)/46));x<q.x+q.w-24;x+=46){if(x<-40)continue;ctx.moveTo(x+2.4,y);ctx.arc(x,y,2.4,0,TAU);}ctx.fill();
  if(o.left)o.left(ctx,lp);
  // a tab that marks the page
  S.fill(ctx,c=>rrect(c,p.x+p.w-8,p.y+150,40,84,8),C("tab"),{w:0.7});
  // the rings that hold the pages
  for(let y=p.y+44;y<1240;y+=62){ctx.fillStyle=css(dk(page,0.4));ctx.beginPath();ell(ctx,p.x-g-14,y,7,7);ell(ctx,p.x+14,y,7,7);ctx.fill();
    S.fill(ctx,c=>rrect(c,p.x-g-16,y-6.5,g+32,13,6.5),C("ring"),{w:0.7});}
  ctx.restore();};
/* a hand holding a pen, from above: the pen's point at tip, the hand behind it, the forearm away to the lower right */
K.penHand=(ctx,who,tip,o)=>{o=o||{};const S=K.S,P=typeof who==="string"?K.CAST[who]:(who||{}),k=o.k||1.45,sk=S.tone(P.skin||[230,188,156]),sl=S.tone((P.top&&P.top.c)||[104,112,130]),col=K.inkCol(o.col),lift=clamp(o.lift||0,0,1);
  const a=rad(o.deg==null?54:o.deg),d=[Math.cos(a),Math.sin(a)],n=[-d[1],d[0]],T=[tip[0]+lift*10*k,tip[1]-lift*16*k],at=(u,v)=>[T[0]+(d[0]*u+n[0]*v)*k,T[1]+(d[1]*u+n[1]*v)*k];
  // a soft shadow on the page, under the hand: nearer the hand when it is down
  ctx.save();ctx.fillStyle="rgba(84,60,60,0.085)";ctx.beginPath();const s0=at(158,10);ctx.ellipse(s0[0]+(6+lift*14)*k,s0[1]+(10+lift*18)*k,104*k,70*k,a,0,TAU);ctx.fill();ctx.restore();
  S.begin(ctx,{lw:3.2*k/1.45+0.6,sh:6});
  // the sleeve and its cuff, the back of the hand, the fingers that curl under it
  const w0=at(262,-6),fa=rad((o.deg==null?54:o.deg)+9),w1=[w0[0]+Math.cos(fa)*1500,w0[1]+Math.sin(fa)*1500];
  S.fill(ctx,c=>capsule(c,at(236,-6),w1,62*k,70*k),sl,{});S.fill(ctx,c=>capsule(c,at(232,-52),at(240,42),15*k,15*k),lt(sl,0.12),{w:0.8});
  S.poly(ctx,[at(84,-58),at(128,-84),at(190,-82),at(236,-56),at(252,-4),at(236,46),at(186,62),at(128,52),at(96,20),at(78,-20)],sk,{exact:true});
  S.fill(ctx,c=>{capsule(c,at(132,-74),at(92,-70),17*k,15*k);capsule(c,at(112,-52),at(66,-44),18*k,15*k);},dk(sk,0.04),{w:0.8});
  // the pen, over the hand's web; then the finger and the thumb that hold it
  S.fill(ctx,c=>capsule(c,at(30,0),at(318,0),8.5*k,8.5*k),lt(col,0.82),{w:0.8});
  S.fill(ctx,c=>capsule(c,at(292,0),at(318,0),8.5*k,8.5*k),col,{w:0.8});S.fill(ctx,c=>capsule(c,at(26,0),at(84,0),8*k,9*k),col,{w:0.8});
  S.poly(ctx,[[...at(2,0),1],[...at(28,-7),1],[...at(28,7),1]],dk(col,0.5),{exact:true,w:0.7});
  S.fill(ctx,c=>capsule(c,at(160,-34),at(56,-13),19*k,14*k),sk,{w:0.8});
  S.fill(ctx,c=>capsule(c,at(150,44),at(70,16),20*k,15*k),sk,{w:0.8});
  S.line(ctx,c=>{const p0=at(148,-58),p1=at(186,-50),q0=at(172,30),q1=at(206,14);c.moveTo(p0[0],p0[1]);c.quadraticCurveTo(...at(170,-62),p1[0],p1[1]);c.moveTo(q0[0],q0[1]);c.quadraticCurveTo(...at(192,30),q1[0],q1[1]);},null,0.6);};
K.notes=(ctx,who,t,items,o)=>{o=o||{};const R=K.ROOMS.notes;ctx.save();onBook(ctx,R);const r=K.ink(ctx,items,t,{x:R.page.x,y:R.page.y,lw:o.lw||5.5,a:o.a,aside:o.aside});ctx.restore();
  // the pen's point, turned with the book; the hand waits at the page's corner when nothing is written for a while
  const pic=r.pen?pageAt(R,[r.pen[0]-R.page.x,r.pen[1]-R.page.y]):R.rest,on=r.pen?r.on:0,tip=[lerp(R.rest[0],pic[0],on),lerp(R.rest[1],pic[1],on)];r.tip=tip;
  // for the check: that notes are in the picture, the rows written near the page's edge, and where the hand is
  if(K.watch)K.watch({note:true,who:typeof who==="string"?who:"someone",edge:nearEdge(ctx,items,R.page.w,R.page.h),tip:o.hand!==false?tip:null,
    // a page of the film's own people that is only writing; a page a story's own folk keep (who: a row of theirs) is as plain as its time
    plain:typeof who==="string"&&!items.some(it=>it&&it.drawn),a:1,ctx});
  if(o.hand!==false)K.penHand(ctx,who,[tip[0]+(on>0.98?Math.sin(t*21)*1.6*(1-r.lift):0),tip[1]+(on>0.98?Math.cos(t*17)*1.2*(1-r.lift):0)],{col:r.col,lift:Math.max(r.lift*0.8,(1-on)*0.5),k:o.k});
  return r;};

/* a notebook as a thing, seen from the side: closed, lying flat, its near corner at (x, y); or o.open, held open: (x, y) is then
   under its middle. k scales it; o.rot turns it; o.cover its colour */
K.notebook=(ctx,x,y,k,o)=>{o=o||{};const S=K.S,cover=S.tone(o.cover||K.PAL.cover),page=C("page");ctx.save();ctx.translate(x,y);ctx.rotate(o.rot||0);
  if(o.open){const w=78*k;S.fill(ctx,c=>pg(c,[[-w,-3*k],[w,-3*k],[w+4*k,7*k],[-w-4*k,7*k]]),cover,{w:0.7});
    S.fill(ctx,c=>pg(c,[[-w+3*k,-12*k],[0,-8*k],[0,-1*k],[-w+3*k,-3*k]]),page,{w:0.6});S.fill(ctx,c=>pg(c,[[w-3*k,-12*k],[0,-8*k],[0,-1*k],[w-3*k,-3*k]]),dk(page,0.04),{w:0.6});}
  else{const w=112*k,h=16*k;S.fill(ctx,c=>rrect(c,0,-h,w,h,3*k),cover,{w:0.7});S.fill(ctx,c=>rrect(c,5*k,-h+4*k,w-3*k,h-8*k,2*k),page,{w:0.5,flat:true});
    S.fill(ctx,c=>rrect(c,w*0.72,-h-1*k,8*k,h+2*k,2*k),C("tab"),{w:0.5,flat:true});}
  ctx.restore();};
})(PK);
