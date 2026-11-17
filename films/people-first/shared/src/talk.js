/* ===== The people kit: people who talk from where they are =====
   People don't only walk over to each other (the author, 17 November 2026: "show sometimes people communicate with others via
   chat or call, so not only jumping in personally. But personally always at least once should be shown"). A film shows a chat or
   a call where the story has people in two places, and still brings people face to face at least once.
   A chat and a call are panels that come out of a screen or a phone someone in the scene is using: the person stays in the
   picture, whole, at their desk or on the path, and the panel shows what is on their screen, large enough to read.

     PK.callout(ctx, x, y, w, h, tail, a, draw, o)   a panel that comes out of a screen or a phone at tail [x, y]: a box w by h at
                              (x, y), with a tail towards it; draw(ctx, x, y, w, h) fills it. o.col
     PK.chat(ctx, x, y, w, h, d, t, o)   a chat, to draw in a callout (or anywhere): d {title, who: [names] (the others, for the
                              header), me (whose screen it is), msgs: [{who, s (a line) or lines, at, type}]}. A message comes in
                              at its time (at). The others' are on the left, with their picture; me's on the right, and for
                              type seconds before it is sent its words are typed in the field at the foot. The others' typing
                              shows as three dots for o.dots seconds (0.9) before theirs. Words are 30 px (o.size).
                              PK.chatSize(ctx, d, o) -> {w, h}: the panel its words need, as they are drawn
     PK.call(ctx, x, y, w, h, people, t, o)   a video call, to draw in a callout: a tile for each of people: [{who, face
                              (PK.face's base), events (PK.face's), say ([[t0, t1], …]), pose, hold, bg, flip, name, role, a (0 to 1: they join)}].
                              Each is drawn whole and cut by their tile, as a camera frames them. Side by side, their first
                              name is at the tile's foot; o.stack: one above the other, each with their name and what they do
                              (their role; 26 px: keep the camera at 1.1 or closer) beside them, and whoever speaks can say it
                              to the panel's side. -> their joints, one for each: PK.say brings what they say out of their tile
     PK.avatar(ctx, who, x, y, r, a)   someone's picture in a round frame: who they are in a chat
     PK.onScreen.chat(k, o), PK.onScreen.call(n, stack)   what a small screen in the scene shows meanwhile (PK.atDesk's o.show): no words
     PK.inHand.phone(o)       a phone in a hand (PK.person's o.hold); PK.POSES.phone: reading it, PK.POSES.onPhone: at the ear
   Everyone in a tile is on a screen: the kit's checks know (they aren't held to the room's eye line), and still follow their
   faces. A panel is a box of words: keep it off the heads of the people in the scene. */
(K=>{
const {TAU,rad,lerp,clamp,sine,pin,pio,mix,dk,lt,css,hash,polar,capsule,pg,rrect,ell}=K.u,C=K.col;
const tw=(ctx,s,w,size)=>ag_tw(ctx,s,{w,size}),tx=(ctx,s,x,y,o)=>ag_T(ctx,s,x,y,Object.assign({},o,{color:css(o.col||K.C.ink)}));
Object.assign(K.PAL,{chatMe:[226,236,230],chatThem:[255,253,247],tile:[[222,230,226],[238,226,212],[226,224,236]],hang:[204,92,78],phone:[60,64,78]});
Object.assign(K.POSES,{phone:{lean:3,head:9,aN:[22,112,"grip"],aF:[4,14],lN:[-2,-2],lF:[5,4]},onPhone:{lean:0,head:-2,aN:[38,168,"grip"],aF:[4,14],lN:[-2,-2],lF:[5,4]}});

K.callout=(ctx,x,y,w,h,tail,a,draw,o)=>{o=o||{};a=a==null?1:a;if(a<=0.004)return;const S=K.S,col=o.col||C("board"),k=0.94+0.06*a;ctx.save();ctx.globalAlpha*=a;
  if(tail){ctx.translate(tail[0],tail[1]);ctx.scale(k,k);ctx.translate(-tail[0],-tail[1]);
    // the tail, from the side of the box that faces the screen
    const below=tail[1]>y+h,above=tail[1]<y,left=tail[0]<x,pts=below||above?(()=>{const m=clamp(tail[0],x+50,x+w-50),e=below?y+h:y,d=below?1:-1;return{t:[[m-20,e-d*6],[m+20,e-d*6],[lerp(m,tail[0],0.8),lerp(e,tail[1],0.8)]],j:[[m-17,e-d*6],[m+17,e-d*6],[m+15,e+d*3],[m-15,e+d*3]]};})():
      (()=>{const m=clamp(tail[1],y+50,y+h-50),e=left?x:x+w,d=left?-1:1;return{t:[[e-d*6,m-20],[e-d*6,m+20],[lerp(e,tail[0],0.8),lerp(m,tail[1],0.8)]],j:[[e-d*6,m-17],[e-d*6,m+17],[e+d*3,m+15],[e+d*3,m-15]]};})();
    ctx.beginPath();pg(ctx,pts.t);ctx.lineJoin="round";ctx.lineWidth=5;ctx.strokeStyle=css(S.ink);if(S.id==="line")ctx.stroke();ctx.fillStyle=css(col);ctx.fill();
    K.box(ctx,x,y,w,h,18,col,1);ctx.fillStyle=css(col);ctx.beginPath();pg(ctx,pts.j);ctx.fill();}
  else K.box(ctx,x,y,w,h,18,col,1);
  if(draw)draw(ctx,x,y,w,h);ctx.restore();};

/* someone's picture in a round frame, painted once for each size: their head and shoulders, facing us a little */
K.avatar=(ctx,who,x,y,r,a)=>{a=a==null?1:a;if(a<=0.004)return;const P=typeof who==="string"?K.CAST[who]:who,S=K.S,q=3,d=Math.ceil(r*2+8),key="pk:av:"+S.key+":"+(P.key||P.name)+":"+Math.round(r);
  const pic=ag_kept(key,d*q,d*q,c=>{c.scale(q,q);const cx=d/2,h=r*7.4,J0=K.rig(P,0,0,h,"stand",{life:0,flip:0.3}),bg=lt(S.tone(P.top.c),0.62);
    c.save();c.beginPath();c.arc(cx,cx,r,0,TAU);c.clip();c.fillStyle=css(bg);c.fillRect(0,0,d,d);
    K.person(c,P,cx-J0.hc[0]-r*0.06,cx-r*0.08-J0.hc[1],h,"stand",{life:0,flip:0.3,shade:0,part:"upper",expr:"smile",icon:true});c.restore();
    c.lineWidth=Math.max(2,r*0.1);c.strokeStyle=css(S.ink);c.beginPath();c.arc(cx,cx,r,0,TAU);c.stroke();});
  ctx.save();ctx.globalAlpha*=a;ctx.drawImage(pic,x-d/2,y-d/2,d,d);ctx.restore();};

/* ---------------------------------------------------------------- a chat */
const CH={pad:22,head:78,gap:14,size:30,lh:40,bp:[20,13],av:24,field:64};
const bubbleOf=(ctx,m,size)=>{size=size||CH.size;const lines=m.lines||[m.s],lh=size+10,bw=Math.max(...lines.map(l=>tw(ctx,l,600,size)))+CH.bp[0]*2,bh=lines.length*lh+CH.bp[1]*2-6;return{lines,bw,bh,size,lh};};
const THEM=CH.av*2+12;
K.chatSize=(ctx,d,o)=>{const bs=d.msgs.map(m=>[m,bubbleOf(ctx,m,o&&o.size)]),head=CH.av*(1.5*(d.who||[]).length+0.8)+(d.title?tw(ctx,d.title,800,30):0);
  return{w:Math.ceil(Math.max(head,...bs.map(([m,b])=>b.bw+(m.who===d.me?0:THEM)))+CH.pad*2+4),h:Math.ceil(CH.head+CH.field+CH.pad+bs.reduce((s,[m,b])=>s+b.bh+CH.gap,0)+8)};};
K.chat=(ctx,x,y,w,h,d,t,o)=>{o=o||{};if(K.watch)K.watch({talk:"chat",a:1,ctx});const S=K.S,me=d.me,ink=S.ink,dots=o.dots==null?0.9:o.dots,body={x:x+CH.pad,y:y+CH.head,w:w-CH.pad*2,h:h-CH.head-CH.field-10};
  // the header: who the chat is with
  let hx=x+CH.pad+CH.av;(d.who||[]).forEach((n,i)=>{K.avatar(ctx,n,hx,y+CH.head/2,CH.av);hx+=CH.av*1.5;});
  if(d.title)tx(ctx,d.title,hx+CH.av*0.3,y+CH.head/2+11,{w:800,size:30});
  ctx.save();ctx.strokeStyle=css(K.C.mut,0.35);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x+12,y+CH.head);ctx.lineTo(x+w-12,y+CH.head);ctx.stroke();ctx.restore();
  // the messages that have come, the newest at the foot; when they are more than the panel holds, the oldest go up and out
  const ms=d.msgs.map((m,i)=>Object.assign({b:bubbleOf(ctx,m,o.size),k:pin(t,m.at,0.28),mine:m.who===me,first:!i||d.msgs[i-1].who!==m.who},m)),shown=ms.filter(m=>m.k>0);
  let tot=0;for(const m of shown)tot+=(m.b.bh+CH.gap)*m.k;const typing=ms.find(m=>!m.mine&&t>=m.at-dots&&t<m.at),tk=typing?pio(t,typing.at-dots,typing.at,0.15):0;tot+=tk*(46+CH.gap);
  let yy=body.y+12-Math.max(0,tot+12-body.h);ctx.save();ctx.beginPath();ctx.rect(x+4,body.y+2,w-8,body.h);ctx.clip();
  const bub=(m,by,k)=>{const b=m.b,bx=m.mine?body.x+body.w-b.bw:body.x+THEM,col=S.tone(K.PAL[m.mine?"chatMe":"chatThem"]);ctx.save();ctx.globalAlpha*=k;const sc=0.9+0.1*k,ax=m.mine?bx+b.bw:bx,ay=by+b.bh;ctx.translate(ax,ay);ctx.scale(sc,sc);ctx.translate(-ax,-ay);
    if(!m.mine&&m.first)K.avatar(ctx,m.who,body.x+CH.av,by+CH.av+2,CH.av);
    ctx.beginPath();rrect(ctx,bx,by,b.bw,b.bh,20);ctx.fillStyle=css(col);ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=css(ink);ctx.stroke();
    b.lines.forEach((l,i)=>tx(ctx,l,bx+CH.bp[0],by+CH.bp[1]+b.lh*(i+0.5)+b.size*0.36-3,{w:600,size:b.size}));ctx.restore();};
  for(const m of shown){bub(m,yy,m.k);yy+=(m.b.bh+CH.gap)*m.k;}
  if(tk>0){const bx=body.x+THEM;ctx.save();ctx.globalAlpha*=tk;K.avatar(ctx,typing.who,body.x+CH.av,yy+46-CH.av+2,CH.av);ctx.beginPath();rrect(ctx,bx,yy,92,46,20);ctx.fillStyle=css(S.tone(K.PAL.chatThem));ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=css(ink);ctx.stroke();
    ctx.fillStyle=css(K.C.mut);for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(bx+26+i*20,yy+23-Math.max(0,Math.sin(t*7-i*0.9))*6,5,0,TAU);ctx.fill();}ctx.restore();}
  ctx.restore();
  // the field at the foot: what me is typing, until it is sent
  const fy=y+h-CH.field-6,fx=x+CH.pad,fw=w-CH.pad*2-66;ctx.beginPath();rrect(ctx,fx,fy,fw,CH.field-10,(CH.field-10)/2);ctx.fillStyle=css(lt(C("board"),0.5));ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=css(K.C.mut,0.6);ctx.stroke();
  const ty=ms.find(m=>m.mine&&m.type&&t>=m.at-m.type&&t<m.at+0.05);
  if(ty){const s=(ty.lines||[ty.s]).join(" "),p=clamp((t-(ty.at-ty.type))/(ty.type*0.86),0,1),vis=fw-44,typed=s.slice(0,Math.round(s.length*p));let k=0;
    // a line longer than the field moves on a word at a time: what shows starts at a word, never at a cut letter
    while(tw(ctx,typed.slice(k),600,28)>vis){const n=typed.indexOf(" ",k);if(n<0)break;k=n+1;}
    const now=typed.slice(k),W=Math.min(vis,tw(ctx,now,600,28));ctx.save();ctx.beginPath();ctx.rect(fx+20,fy,vis+4,CH.field-10);ctx.clip();tx(ctx,now,fx+22,fy+(CH.field-10)/2+10,{w:600,size:28});ctx.restore();
    if(Math.sin(t*9)>0){ctx.fillStyle=css(ink);ctx.fillRect(fx+24+Math.min(vis-4,W),fy+12,3,CH.field-34);}}
  const sx=x+w-CH.pad-25,sy=fy+(CH.field-10)/2,sent=ms.some(m=>m.mine&&Math.abs(t-m.at)<0.18);ctx.beginPath();ctx.arc(sx,sy,25*(sent?0.9:1),0,TAU);ctx.fillStyle=css(K.C.blue);ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=css(ink);ctx.stroke();
  ctx.fillStyle="#fff";ctx.beginPath();pg(ctx,[[sx-9,sy-11],[sx+13,sy],[sx-9,sy+11],[sx-4,sy]]);ctx.fill();};

/* ---------------------------------------------------------------- a call */
K.call=(ctx,x,y,w,h,people,t,o)=>{o=o||{};if(K.watch)K.watch({talk:"call",a:1,ctx});const S=K.S,n=people.length,pad=18,bar=o.bar===false?0:(o.stack?54:64),gap=o.stack?12:14,stack=!!o.stack,
    tw_=stack?w-pad*2:(w-pad*2-gap*(n-1))/n,th=stack?(h-pad*2-bar-gap*(n-1))/n:h-pad*2-bar,out=[];
  people.forEach((p,i)=>{const P=typeof p.who==="string"?K.CAST[p.who]:p.who,X=stack?x+pad:x+pad+i*(tw_+gap),Y=stack?y+pad+i*(th+gap):y+pad,pose=p.pose||"stand",
      fl=p.flip==null?(stack?0.4:n===1?0.42:lerp(0.36,0.64,i/(n-1))):p.flip,hh=p.h||th*(stack?3.5:2.5),
      J0=K.rig(P,0,0,hh,pose,{life:0,flip:fl}),cx=(stack?X+th*0.5:X+tw_/2)-J0.hc[0],fy=Y+th*(stack?0.48:0.4)-J0.hc[1];
    ctx.save();ctx.beginPath();rrect(ctx,X,Y,tw_,th,14);ctx.fillStyle=css(S.tone(p.bg||K.PAL.tile[i%3]));ctx.fill();ctx.clip();
    const F=K.face(t,p.face||{expr:"listen"},(p.events||[]).concat((p.say||[]).map(([a,b])=>[a,"say",b-a])));
    const pa=p.a==null?1:clamp(p.a,0,1),J=K.person(ctx,P,cx,fy,hh,pose,Object.assign({t:t+i*1.3,flip:fl,shade:0,screen:true,hold:p.hold,holds:!!p.hold,a:pa},F));ctx.restore();
    ctx.beginPath();rrect(ctx,X,Y,tw_,th,14);ctx.lineWidth=3;ctx.strokeStyle=css(S.ink);ctx.stroke();
    // a ring round the tile of whoever speaks; their name: beside them in a wide tile, with what they do, or at a tall tile's foot
    const sp=(p.say||[]).reduce((m,[a,b])=>Math.max(m,pio(t,a,b,0.2)),0);if(sp>0){ctx.save();ctx.globalAlpha*=sp;ctx.beginPath();rrect(ctx,X+5,Y+5,tw_-10,th-10,10);ctx.lineWidth=5;ctx.strokeStyle=css(K.C.green);ctx.stroke();ctx.restore();}
    ctx.save();ctx.globalAlpha*=pa;if(p.name!==false){if(stack){const nm=p.name||P.name,nx=X+th*1.02,role=p.role===undefined?P.role:p.role;tx(ctx,nm,nx,Y+th/2+(role?-6:11),{w:800,size:30});if(role)tx(ctx,role,nx,Y+th/2+30,{w:600,size:26,col:K.C.mut});}
      else{const nm=p.name||P.name.split(" ")[0],nw=tw(ctx,nm,700,28)+32;ctx.beginPath();rrect(ctx,X+12,Y+th-56,nw,44,22);ctx.fillStyle=css(C("board"));ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=css(S.ink);ctx.stroke();tx(ctx,nm,X+28,Y+th-24,{w:700,size:28});}}ctx.restore();
    J.tile={x:X,y:Y,w:tw_,h:th,panel:{x,y,w,h}};out.push(J);});
  // the call's own buttons: a microphone, a camera, and the one that ends it
  if(bar){const by=y+h-pad-bar/2+(stack?8:6),bx=x+w/2;[[-70,C("board")],[0,C("board")],[70,S.tone(K.PAL.hang)]].forEach(([dx,c],i)=>{ctx.beginPath();ctx.arc(bx+dx,by,23,0,TAU);ctx.fillStyle=css(c);ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=css(S.ink);ctx.stroke();
      ctx.save();ctx.strokeStyle=css(i===2?[255,255,255]:S.ink);ctx.fillStyle=ctx.strokeStyle;ctx.lineWidth=3.2;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();
      if(i===0){rrect(ctx,bx+dx-4.5,by-12,9,15,4.5);ctx.fill();ctx.beginPath();ctx.arc(bx+dx,by-2,9,0.15,Math.PI-0.15);ctx.moveTo(bx+dx,by+7);ctx.lineTo(bx+dx,by+12);ctx.stroke();}
      else if(i===1){rrect(ctx,bx+dx-12,by-7,15,14,3);ctx.fill();ctx.beginPath();pg(ctx,[[bx+dx+5,by],[bx+dx+12,by-6],[bx+dx+12,by+6]]);ctx.fill();}
      else{ctx.lineWidth=5.5;ctx.arc(bx+dx,by+10,13,Math.PI*1.2,Math.PI*1.8);ctx.stroke();}ctx.restore();});}
  return out;};

/* something said by someone in a tile of a call (J: one of PK.call's joints; PK.say does this by itself for such a J): the words
   stand beside the call's panel, on the tile's side of it where there is room (o.side "left" or "right" asks for one), with a
   tail into the tile. Put whoever speaks in the tile nearest the free side. o.cam, o.dx, o.dy as PK.say's */
K.sayFrom=(ctx,J,lines,a,o)=>{o=o||{};const T=J.tile,P=T.panel||T,size=o.size||34,w=Math.max(...lines.map(l=>tw(ctx,l,o.weight||700,size)))+56,h=lines.length*size*1.3+32,
    cm=o.cam,m=cm?40/cm.z:40,vx0=cm?cm.x-960/cm.z:0,vx1=cm?cm.x+960/cm.z:1920,vy0=cm?cm.y-540/cm.z:0;
  const want=o.side||(T.x+T.w/2>=P.x+P.w/2?"right":"left"),fits=sd=>sd==="right"?P.x+P.w+46+w<=vx1-m:P.x-46-w>=vx0+m,side=fits(want)?want:(want==="right"?"left":"right"),right=side==="right";
  const x=(right?P.x+P.w+46+w/2:P.x-46-w/2)+(o.dx||0),y=Math.max(vy0+h/2+m,T.y+T.h*0.36+(o.dy||0)),tail=[right?T.x+T.w-10:T.x+10,clamp(T.y+T.h*0.4,y-h/2+12,y+h/2-12)];
  return K.bubble(ctx,x,y,lines,tail,a,o);};
const say0=K.say;K.say=(ctx,J,lines,a,o)=>J&&J.tile?K.sayFrom(ctx,J,lines,a,o):say0(ctx,J,lines,a,o);

/* what a small screen in the scene shows meanwhile: the same chat or call, too small for words (PK.atDesk's o.show).
   chat(k, o): k (0 to 1) how many of its messages have come; o.rows: its messages, each [where it starts, how wide (both a share
   of the screen's width), 1 for mine], when they aren't two people's in turn. Who it is with, at the top, and the field at the
   foot are there before any message is, so an empty chat still reads as one, not as a blank screen */
K.onScreen={
  chat:(k,o)=>(c,x,y,w,h)=>{const rows=(o&&o.rows)||[[0.12,0.5,0],[0.4,0.48,1],[0.2,0.4,0],[0.5,0.38,1]],n=Math.round(clamp(k==null?1:k,0,1)*rows.length),grey=[214,216,212];c.fillStyle=css(lt(C("board"),0.3));c.fillRect(x,y,w,h);
    c.fillStyle=css(grey);c.beginPath();c.arc(x+w*0.1,y+h*0.1,h*0.055,0,TAU);c.fill();c.beginPath();rrect(c,x+w*0.18,y+h*0.065,w*0.3,h*0.07,h*0.035);c.fill();c.fillRect(x+w*0.04,y+h*0.185,w*0.92,Math.max(1.5,h*0.012));
    c.beginPath();rrect(c,x+w*0.06,y+h*0.86,w*0.7,h*0.09,h*0.045);c.fill();c.fillStyle=css(K.C.blue);c.beginPath();c.arc(x+w*0.88,y+h*0.905,h*0.05,0,TAU);c.fill();
    rows.slice(0,n).forEach(([fx,fw,me],i)=>{c.fillStyle=css(me?mix(K.C.green,[255,255,255],0.62):grey);c.beginPath();rrect(c,x+w*fx,y+h*(0.23+i*0.15),w*fw,h*0.1,h*0.05);c.fill();});},
  call:(n,stack)=>(c,x,y,w,h)=>{n=n||2;c.fillStyle=css([70,74,90]);c.fillRect(x,y,w,h);const g=w*0.04,tw2=stack?w-g*2:(w-g*(n+1))/n,H=stack?(h*0.78-g*(n+1))/n:h*0.66;
    for(let i=0;i<n;i++){const X=stack?x+g:x+g+i*(tw2+g),Y=stack?y+g+i*(H+g):y+h*0.1,hx=stack?X+H*0.62:X+tw2/2;c.save();c.beginPath();rrect(c,X,Y,tw2,H,5);c.fillStyle=css(K.S.tone(K.PAL.tile[i%3]));c.fill();c.clip();
      c.fillStyle=css([120,112,116]);c.beginPath();c.arc(hx,Y+H*0.4,H*0.19,0,TAU);c.fill();c.beginPath();c.ellipse(hx,Y+H*1.02,H*0.36,H*0.36,0,Math.PI,TAU);c.fill();
      if(stack){c.fillStyle=css([150,146,150]);c.beginPath();rrect(c,X+H*1.3,Y+H*0.3,tw2*0.34,H*0.14,H*0.07);rrect(c,X+H*1.3,Y+H*0.56,tw2*0.24,H*0.12,H*0.06);c.fill();}c.restore();}
    c.fillStyle=css(K.S.tone(K.PAL.hang));c.beginPath();c.arc(x+w/2,y+h*0.9,h*0.06,0,TAU);c.fill();}
};
/* a phone in a hand: its back to us when it is read (o.back), or its lit face */
K.inHand.phone=o=>(c,hd,deg,J)=>{o=o||{};const S=K.S,u=J.u,a=polar(hd,deg-176,10*u),b=polar(hd,deg+4,o.ear?70*u:86*u),g=Math.atan2(b[1]-a[1],b[0]-a[0]);
  c.save();c.translate(a[0],a[1]);c.rotate(g);const L=Math.hypot(b[0]-a[0],b[1]-a[1]),w=46*u;S.fill(c,cc=>rrect(cc,0,-w/2,L,w,7*u),S.tone(K.PAL.phone),{w:0.8});
  if(!o.back)S.fill(c,cc=>rrect(cc,5*u,-w/2+4*u,L-10*u,w-8*u,4*u),C("screenLit"),{line:false,flat:true});c.restore();};
})(PK);
