/* ===== The people kit: words on the frame =====
   People carry these films; words hold a place, a name, something said, or one line to keep. Every piece of text is drawn with the
   agent films' ag_T (The Inner Life of Data's T), at 28 px or more, and every box is made from its words as they are drawn, so
   the words can't leave it (site-tools/fits.py). Nothing goes below y 890, where the captions are. a (0 to 1) brings a thing in.
     PK.card(ctx, x, y, d, a, o)        where and when, or a number: d {kick, title, sub, col (the kick's colour)}; its width
                                        comes from its words (o.w sets a wider one); o.align "center" or "right" places it by x
     PK.tag(ctx, x, y, text, a, o)      a few words in a pill, centred on (x, y); o.col its words' colour, o.fill its own
     PK.nameTag(ctx, x, y, name, role, a)   a person's name and role, centred on (x, y): put it over their head
     PK.bubble(ctx, x, y, lines, tail, a, o)  something said: lines of words centred on (x, y), a tail towards tail [x, y] (the
                                        speaker's mouth or head); o.size (34), o.weight, o.ink, o.col, o.strike (a line through it:
                                        what isn't said), o.think (no tail: three small rounds, for a thought), o.la (how far
                                        each line has come in, 0 to 1: lines that come one by one in a box that doesn't change)
     PK.say(ctx, J, lines, a, o)        the same, placed over the head of whoever PK.person returned as J; o.dx, o.dy move it;
                                        o.cam (the shot's camera, draw's third argument) keeps it inside what the camera sees
     PK.kicker(ctx, num, title, a)      the film's number and title, top left, from the second chapter on
     PK.sceneTag(ctx, text, a)          where and when an imagined scene is set, top right ("The university, 2027 · imagined")
     PK.mark(ctx, cx, cy, r, p, a)      the module's mark: five people in a ring, which draws itself as p goes from 0 to 1
     PK.title(ctx, S, t, t0, title, sub, line, o)   the title card, over the picture from t0: the picture's right side stays
                                        clear, so whoever is there stays in view (o.side "right" puts the words there instead)
     PK.end(ctx, S, t, t0, title, line, n, series, o)   the end card, the same way: the film ends on a person, with its last line
                                        (on two lines, it breaks evenly, after a comma where one falls near the middle) */
(K=>{
const {TAU,lerp,clamp,sine,pin,mix,dk,lt,css,pg,rrect}=K.u;
const INKC=()=>K.C.ink,tw=(ctx,s,w,size,ls)=>ag_tw(ctx,s,{w,size,ls});
const tx=(ctx,s,x,y,o)=>ag_T(ctx,s,x,y,Object.assign({},o,{color:css(o.col||K.C.ink)}));
// a card's body, by the look in use: a soft shadow, a hard one under an ink line, or a cut sheet
K.box=(ctx,x,y,w,h,r,col,a)=>{const S=K.S;if(K.watch)K.watch({box:[x,y,w,h],a:a==null?1:a,ctx});ctx.save();ctx.globalAlpha*=a==null?1:a;
  if(S.id==="line"){ctx.fillStyle=css(S.self?dk(S.ink,0.1):S.ink,S.self?0.34:0.9);ctx.beginPath();rrect(ctx,x+4,y+6,w,h,r);ctx.fill();ctx.beginPath();rrect(ctx,x,y,w,h,r);ctx.fillStyle=css(col);ctx.fill();ctx.lineWidth=S.self?2.5:3;ctx.strokeStyle=css(S.ink);ctx.stroke();}
  else if(S.id==="paper"){ctx.fillStyle="rgba(58,36,30,0.26)";ctx.beginPath();rrect(ctx,x+4,y+6,w,h,r*0.5);ctx.fill();ctx.beginPath();rrect(ctx,x,y,w,h,r*0.5);ctx.fillStyle=css(col);ctx.fill();}
  else{for(let i=3;i>=1;i--){ctx.fillStyle="rgba(70,44,40,0.05)";ctx.beginPath();rrect(ctx,x-i*2,y+4+i*3,w+i*4,h,r+i*2);ctx.fill();}ctx.beginPath();rrect(ctx,x,y,w,h,r);ctx.fillStyle=css(col);ctx.fill();}
  ctx.restore();};
const settle=(ctx,x,y,a)=>{const k=0.94+0.06*a;ctx.translate(x,y);ctx.scale(k,k);ctx.translate(-x,-y);};
K.card=(ctx,x,y,d,a,o)=>{o=o||{};a=a==null?1:a;const kick=d.kick?String(d.kick).toUpperCase():"",wk=kick?tw(ctx,kick,800,28,3):0,wt=d.title?tw(ctx,d.title,800,d.size||40):0,ws=d.sub?tw(ctx,d.sub,600,30):0,
    w=Math.max(o.w||0,Math.max(wk,wt,ws)+64),h=28+(kick?44:0)+(d.title?52:0)+(d.sub?44:0)+12,bx=o.align==="center"?x-w/2:o.align==="right"?x-w:x,bb={x:bx,y,w,h};
  if(a<=0.004)return bb;ctx.save();ctx.globalAlpha*=a;settle(ctx,bx+w/2,y+h/2,a);K.box(ctx,bx,y,w,h,K.S.id==="soft"?22:16,K.col("board"),1);
  let ty=y+28;if(kick){ty+=24;tx(ctx,kick,bx+32,ty,{w:800,size:28,ls:3,col:d.col||K.C.amber});ty+=20;}
  if(d.title){ty+=38;tx(ctx,d.title,bx+32,ty,{w:800,size:d.size||40});ty+=14;}
  if(d.sub){ty+=32;tx(ctx,d.sub,bx+32,ty,{w:600,size:30,col:K.C.mut});}
  ctx.restore();return bb;};
K.tag=(ctx,x,y,text,a,o)=>{o=o||{};a=a==null?1:a;const size=o.size||28,w=tw(ctx,text,o.weight||700,size)+48,h=size+26,bx=o.align==="left"?x:o.align==="right"?x-w:x-w/2,bb={x:bx,y:y-h/2,w,h};
  if(a<=0.004)return bb;ctx.save();ctx.globalAlpha*=a;settle(ctx,bx+w/2,y,a);K.box(ctx,bx,y-h/2,w,h,h/2,o.fill||K.col("board"),1);
  tx(ctx,text,bx+w/2,y+size*0.35,{w:o.weight||700,size,align:"center",col:o.col||K.C.ink});ctx.restore();return bb;};
K.nameTag=(ctx,x,y,name,role,a)=>{a=a==null?1:a;const w=Math.max(tw(ctx,name,800,30),role?tw(ctx,role,600,28):0)+52,h=role?96:58,bb={x:x-w/2,y:y-h/2,w,h};
  if(a<=0.004)return bb;ctx.save();ctx.globalAlpha*=a;settle(ctx,x,y,a);K.box(ctx,x-w/2,y-h/2,w,h,K.S.id==="soft"?20:14,K.col("board"),1);
  tx(ctx,name,x,role?y-8:y+11,{w:800,size:30,align:"center"});if(role)tx(ctx,role,x,y+29,{w:600,size:28,align:"center",col:dk(K.C.mut,0.2)});ctx.restore();return bb;};
/* something said. The bubble's body is a box of its own, made from its lines; its tail is drawn first, under it */
K.bubble=(ctx,x,y,lines,tail,a,o)=>{o=o||{};a=a==null?1:a;const S=K.S,size=o.size||34,wt=o.weight||700,lh=size*1.3,w=Math.max(...lines.map(l=>tw(ctx,l,wt,size)))+56,h=lines.length*lh+32,bx=x-w/2,by=y-h/2,bb={x:bx,y:by,w,h};
  if(a<=0.004)return bb;ctx.save();ctx.globalAlpha*=a;settle(ctx,tail?tail[0]:x,tail?tail[1]:y,a);
  const col=o.col||[255,253,247],ink=S.id==="line"?S.ink:null;
  if(tail){const below=tail[1]>y,base=below?by+h:by,dir=below?1:-1,tcx=clamp(tail[0],bx+44,bx+w-44),tip=[lerp(tcx,tail[0],0.85),lerp(base,tail[1],0.72)];
    if(o.think){for(const [f,r] of [[0.3,11],[0.62,8],[0.9,5]]){ctx.beginPath();ctx.arc(lerp(tcx,tip[0],f),lerp(base+dir*8,tip[1],f),r,0,TAU);ctx.fillStyle=css(col);ctx.fill();if(ink){ctx.lineWidth=2.5;ctx.strokeStyle=css(ink);ctx.stroke();}}}
    else{ctx.beginPath();pg(ctx,[[tcx-18,base-dir*6],[tcx+18,base-dir*6],tip]);ctx.lineJoin="round";if(ink){ctx.lineWidth=5;ctx.strokeStyle=css(ink);ctx.stroke();}
      else if(S.id==="paper"){ctx.save();ctx.translate(4,6);ctx.fillStyle="rgba(58,36,30,0.26)";ctx.fill();ctx.restore();ctx.beginPath();pg(ctx,[[tcx-18,base-dir*6],[tcx+18,base-dir*6],tip]);}
      ctx.fillStyle=css(col);ctx.fill();}
    K.box(ctx,bx,by,w,h,26,col,1);
    // the join: the body's line doesn't cross the tail's mouth
    if(!o.think){ctx.fillStyle=css(col);ctx.beginPath();pg(ctx,[[tcx-15,base-dir*5],[tcx+15,base-dir*5],[tcx+13,base+dir*3],[tcx-13,base+dir*3]]);ctx.fill();}}
  else K.box(ctx,bx,by,w,h,26,col,1);
  lines.forEach((l,i)=>{const la=o.la?clamp(o.la[i]==null?1:o.la[i],0,1):1;if(la<=0.004)return;ctx.save();ctx.globalAlpha*=la;tx(ctx,l,x,by+16+lh*(i+0.5)+size*0.35,{w:wt,size,align:"center",col:o.ink||K.C.ink});ctx.restore();});
  if(o.strike){ctx.strokeStyle=css(K.C.amber);ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(bx+22,y+3);ctx.lineTo(bx+22+(w-44)*clamp(o.strike===true?1:o.strike,0,1),y-3);ctx.stroke();}
  ctx.restore();return bb;};
// over the head of the person who says it (J: what PK.person returned); it leans the way they face, and stays in the frame
K.say=(ctx,J,lines,a,o)=>{o=o||{};const size=o.size||34,hh=J.p.head*J.u,sg=J.sgn||1,tail=[J.hc[0]+sg*hh*0.42,J.hc[1]-hh*0.56],w=Math.max(...lines.map(l=>tw(ctx,l,o.weight||700,size)))+56,h=lines.length*size*1.3+32;
  // what the camera sees, when the shot gives it (o.cam): the bubble stays inside that
  const cm=o.cam,m=cm?40/cm.z:40,vx0=cm?cm.x-960/cm.z:0,vx1=cm?cm.x+960/cm.z:1920,vy0=cm?cm.y-540/cm.z:0;
  const x=clamp(tail[0]+sg*(o.lean==null?w*0.22:o.lean)+(o.dx||0),vx0+w/2+m,vx1-w/2-m),y=Math.max(vy0+h/2+m,tail[1]-h/2-(o.rise==null?54:o.rise)+(o.dy||0));return K.bubble(ctx,x,y,lines,tail,a,o);};
K.kicker=(ctx,num,title,a)=>{if(a<=0.004)return;const s=String(title).toUpperCase(),w=tw(ctx,s,800,28,3)+tw(ctx,String(num),800,28)+84,h=56,x=72,y=64;
  ctx.save();ctx.globalAlpha*=a;K.box(ctx,x,y,w,h,h/2,K.col("board"),1);tx(ctx,String(num),x+28,y+38,{w:800,size:28,col:K.C.amber});tx(ctx,s,x+28+tw(ctx,String(num),800,28)+22,y+38,{w:800,size:28,ls:3,col:K.C.mut});ctx.restore();};
K.sceneTag=(ctx,text,a)=>K.tag(ctx,1848,92,text||"The university, 2027 · imagined",a,{align:"right",col:K.C.mut});
// the module's mark: five people in a ring; the ring that joins them draws itself, from the top, clockwise
K.mark=(ctx,cx,cy,r,p,a)=>{if(a<=0.01)return;p=clamp(p,0,1);ctx.save();ctx.globalAlpha*=a;const ring=sine(p/0.75);ctx.lineCap="round";
  ctx.strokeStyle=css(K.C.ink);ctx.lineWidth=Math.max(2,r*0.07);ctx.beginPath();ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+TAU*ring);ctx.stroke();
  const cols=[[150,70,88],[98,128,160],[226,190,112],[66,158,138],[204,124,112]];
  for(let i=0;i<5;i++){const an=-Math.PI/2+i*TAU/5,f=clamp(p*5-i*0.6,0,1);if(f<=0)continue;const px=cx+Math.cos(an)*r,py=cy+Math.sin(an)*r,r2=r*0.22*sine(f);
    ctx.fillStyle=css(K.col("board"));ctx.beginPath();ctx.arc(px,py,r2+r*0.07,0,TAU);ctx.fill();ctx.fillStyle=css(cols[i]);ctx.beginPath();ctx.arc(px,py,r2,0,TAU);ctx.fill();ctx.lineWidth=Math.max(1.5,r*0.045);ctx.strokeStyle=css(K.C.ink);ctx.stroke();}
  ctx.restore();};
// a sheet of the card's colour over the picture, clear on one side, where the person the film follows stays in view
const veil=(ctx,S,a,side)=>{if(a<=0)return;setScreen(ctx,S);const c=K.col("board"),g=ctx.createLinearGradient(0,0,1920,0),st=side==="right"?[[0,0],[0.3,0],[0.56,0.94],[1,0.97]]:[[0,0.97],[0.46,0.94],[0.72,0],[1,0]];
  for(const [o,v] of st)g.addColorStop(o,css(c,v*clamp(a,0,1)));ctx.fillStyle=g;ctx.fillRect(0,0,1920,1080);};
K.title=(ctx,S,t,t0,title,sub,line,o)=>{o=o||{};const oA=pin(t,t0,0.8),tA=pin(t,t0+0.5,0.8);if(oA<=0)return;veil(ctx,S,oA,o.side);setScreen(ctx,S);const x=o.side==="right"?1060:150;
  ctx.save();ctx.globalAlpha*=tA;K.mark(ctx,x+64,300,64,(t-t0-0.4)/1.8,1);tx(ctx,title,x,500,{w:800,size:o.size||76});if(sub)tx(ctx,sub,x,572,{w:600,size:36,col:K.C.mut});
  // the module and the series, in capitals: on one line where it fits the frame, else a line for each part
  const cap=String(line).toUpperCase(),parts=tw(ctx,cap,800,28,3)<=1920-80-x?[cap]:cap.split(" · ");
  ctx.globalAlpha*=pin(t,t0+1.2,0.8);parts.forEach((p,i)=>tx(ctx,p,x,660+i*44,{w:800,size:28,ls:3,col:K.C.mut}));ctx.restore();};
// a line that needs two lines breaks where it reads best: as evenly as it can, and after a comma or a stop where one falls near the middle,
// never leaving a word or two alone on the second line ("Own what it's for, / not only what you did.")
const even=(ctx,s,maxW,o)=>{const g=ag_wrap(ctx,s,maxW,o);if(g.length!==2)return g;const ws=String(s).split(" ");let best=g,sc=Infinity;
  for(let i=1;i<ws.length;i++){const a=ws.slice(0,i).join(" "),b=ws.slice(i).join(" "),wa=ag_tw(ctx,a,o),wb=ag_tw(ctx,b,o);if(wa>maxW||wb>maxW)continue;
    const v=Math.abs(wa-wb)-(/[,;:.!?]$/.test(a)?maxW*0.25:0);if(v<sc){sc=v;best=[a,b];}}return best;};
K.end=(ctx,S,t,t0,title,line,n,series,o)=>{o=o||{};const oA=pin(t,t0,1.0),tA=pin(t,t0+0.6,0.9);if(oA<=0)return;veil(ctx,S,oA,o.side);setScreen(ctx,S);const x=o.side==="right"?1060:150;
  ctx.save();ctx.globalAlpha*=tA;if(line){const ls=even(ctx,line,760,{w:700,size:46});ls.forEach((l,i)=>tx(ctx,l,x,330+i*62-(ls.length-1)*31,{w:700,size:46}));}
  K.mark(ctx,x+56,490,56,(t-t0-0.7)/1.6,1);tx(ctx,title,x,640,{w:800,size:44});tx(ctx,(n?n+" · ":"")+(series||"Leading data people")+" · Learning Data",x,698,{w:600,size:28,col:K.C.mut});ctx.restore();};
})(PK);
