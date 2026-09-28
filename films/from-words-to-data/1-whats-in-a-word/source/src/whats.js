/* ===== What's in a word: the film's own pictures =====
   The icon every creature is drawn with, the pigeons' photos, the bees' cards, a dolphin's whistle, three portraits, a roll of names,
   and LV, the pictures of the labs and scenarios. The living world has files of its own: land.js (the ground, plants, rock and clay),
   beasts.js (the mammals and the snake), birds.js (the birds and the bee) and body.js (a baby, a pointing arm, a hand with a stylus, a brain).
   The labs and the scenarios draw with all of them. */
const WA_INK=[255,190,110],LEO=[255,176,64],EAG=[120,190,255],SNK=[120,230,140],NAMEC=[190,150,255];

// an icon: a path in its own units (about 100 tall), drawn at (x,y) and size s, filled dark and outlined in light
function icon(ctx,x,y,s,path,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s*(o.flip?-1:1),s);if(o.rot)ctx.rotate(o.rot);
  ctx.beginPath();path(ctx);const g=ctx.createLinearGradient(-50,-60,50,60);g.addColorStop(0,rgba(mix(col,[20,26,40],0.55),0.95));g.addColorStop(1,"rgba(8,12,22,0.95)");ctx.fillStyle=o.fill||g;ctx.fill(o.rule||"nonzero");
  ctx.shadowColor=rgba(col,0.9);ctx.shadowBlur=(o.glow||12);ctx.strokeStyle=rgba(col,1);ctx.lineWidth=(o.lw||2.4)/s;ctx.lineJoin="round";ctx.lineCap="round";ctx.stroke();ctx.shadowBlur=0;
  if(o.detail){ctx.beginPath();o.detail(ctx);ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=(o.dlw||1.8)/s;ctx.stroke();}
  if(o.eye){ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(o.eye[0],o.eye[1],o.eye[2]||2.6,0,TAU);ctx.fill();}
  ctx.restore();}


// a photo in a pigeon experiment: a landscape, with or without a person in it
function photoTile(ctx,x,y,w,h,k,person_,a,mark){withA(ctx,a,()=>{ctx.save();rr(ctx,x,y,w,h,8);ctx.clip();const sky=[[92,130,190],[200,150,110],[110,160,170],[150,140,200]][k%4],gr=[[70,110,70],[120,96,70],[80,120,110],[96,110,70]][k%4];
  let g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,rgba(sky,1));g.addColorStop(0.62,rgba(mix(sky,[255,255,255],0.3),1));g.addColorStop(0.62,rgba(gr,1));g.addColorStop(1,rgba(mix(gr,[0,0,0],0.4),1));ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
  if(hash(k,3)>0.4){ctx.fillStyle="rgba(40,60,40,0.8)";ctx.beginPath();ctx.arc(x+w*(0.2+0.6*hash(k,4)),y+h*0.58,w*0.14,0,TAU);ctx.fill();}
  if(person_){const px=x+w*(0.3+0.4*hash(k,5)),py=y+h*0.6,ps=h/140;ctx.fillStyle="rgba(30,24,30,0.95)";ctx.beginPath();ctx.arc(px,py-38*ps,9*ps,0,TAU);ctx.fill();rr(ctx,px-10*ps,py-28*ps,20*ps,34*ps,8*ps);ctx.fill();ctx.fillRect(px-8*ps,py+4*ps,6*ps,18*ps);ctx.fillRect(px+2*ps,py+4*ps,6*ps,18*ps);}
  ctx.restore();ctx.strokeStyle="rgba(230,240,255,0.5)";ctx.lineWidth=1.5;rr(ctx,x,y,w,h,8);ctx.stroke();
  if(mark)withA(ctx,mark,()=>{ctx.strokeStyle=rgba(GOOD,1);ctx.lineWidth=4;ctx.shadowColor=rgba(GOOD,0.9);ctx.shadowBlur=12;rr(ctx,x-4,y-4,w+8,h+8,10);ctx.stroke();ctx.shadowBlur=0;});});}
// a card a bee chooses from: a colour or a pattern of stripes
function beeCard(ctx,x,y,s,kind,a,hi){withA(ctx,a,()=>{glass(ctx,x-s/2,y-s/2,s,s,12,hi?GOOD:[170,200,245],{glow:hi?16:0,ea:hi?0.9:0.4,fill:"rgba(10,16,30,0.9)"});ctx.save();rr(ctx,x-s/2+10,y-s/2+10,s-20,s-20,8);ctx.clip();
  if(kind==="blue"||kind==="yellow"){ctx.fillStyle=kind==="blue"?"rgb(90,140,255)":"rgb(255,210,70)";ctx.fillRect(x-s/2,y-s/2,s,s);}
  else{ctx.fillStyle="rgb(20,24,36)";ctx.fillRect(x-s/2,y-s/2,s,s);ctx.fillStyle="rgb(230,236,250)";for(let i=-6;i<6;i++){if(kind==="hstripes")ctx.fillRect(x-s/2,y+i*16,s,8);else ctx.fillRect(x+i*16,y-s/2,8,s);}}
  ctx.restore();});}
// a signature: a whistle's shape, the same every time, like a name
function nameWave(ctx,x,y,w,h,seed,col,a,p){if(a<=0.01)return;withA(ctx,a,()=>{ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3;ctx.shadowColor=rgba(col,0.9);ctx.shadowBlur=10;ctx.beginPath();const n=60,q=p==null?1:p;
  for(let i=0;i<=n*q;i++){const u=i/n,v=Math.sin(u*Math.PI*(2+seed))*Math.sin(u*Math.PI)*0.8+0.2*Math.sin(u*Math.PI*9*(1+seed*0.3));const px=x+u*w,py=y-v*h/2;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.stroke();ctx.shadowBlur=0;});}

// three forms of one person: a photo, a drawing, a written name
const PORTRAIT={};
function portraitBmp(kind){if(PORTRAIT[kind])return PORTRAIT[kind];const c=mkCanvas(240,280),x=c.getContext("2d");
  if(kind==="name"){x.fillStyle="#f3ecdc";x.fillRect(0,0,240,280);x.fillStyle="#2a2420";x.font=font(700,34);x.textAlign="center";x.fillText("Mei",120,130);x.fillText("Tanaka",120,172);}
  else{const g=x.createLinearGradient(0,0,0,280);g.addColorStop(0,kind==="photo"?"#6f86ad":"#f3ecdc");g.addColorStop(1,kind==="photo"?"#2d3a52":"#e6dcc8");x.fillStyle=g;x.fillRect(0,0,240,280);
    if(typeof person==="function"){x.save();if(kind==="drawing")x.filter="grayscale(1) contrast(1.6) brightness(1.35)";person(x,"mei",120,860,1.45,{t:0.4,expr:"calm"});x.restore();}}
  PORTRAIT[kind]=c;return c;}
function portrait(ctx,x,y,kind,a,hi){withA(ctx,a,()=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.6)";ctx.shadowBlur=18;ctx.drawImage(portraitBmp(kind),x,y,200,234);ctx.restore();ctx.strokeStyle=hi?rgba([255,236,160],1):"rgba(230,236,250,0.6)";ctx.lineWidth=hi?4:2;ctx.strokeRect(x,y,200,234);
  if(hi)glow(ctx,x+100,y+117,150,[255,236,160],0.2*hi);});}

/* ---------- things for the end ---------- */
// a scroll with names on it: to enrol was to write a name on the roll
function roll(ctx,x,y,w,h,names,p,a){withA(ctx,a,()=>{ctx.fillStyle="#e8dcc0";ctx.fillRect(x,y,w,h);[y,y+h].forEach(yy=>{const g=ctx.createLinearGradient(x,yy-10,x,yy+10);g.addColorStop(0,"#b89a6a");g.addColorStop(0.5,"#f0e2c4");g.addColorStop(1,"#8a6c44");ctx.fillStyle=g;rr(ctx,x-12,yy-12,w+24,24,12);ctx.fill();});
  names.forEach((nm,i)=>withA(ctx,clamp(p*names.length-i,0,1),()=>T(ctx,nm,x+28,y+44+i*34,{w:600,size:22,color:"rgba(60,44,30,0.92)"})));});}

/* ---------- pictures for the labs and the scenarios (site/assets/whats-in-a-word/learn.*.js name them in "vis") ----------
   Each draws on a canvas of w × h, with the lab's state and the page's words (window.FW); any text it draws comes from FW.vis,
   so the Spanish pages show Spanish. Lab pictures are shown at about half size: text is 22 px or more. */
const WA_NUM=(n,L)=>String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,L.lang==="es"?".":",");
const WA_HEX=h=>h.match(/\w\w/g).map(q=>parseInt(q,16));
const LV={
  // Count the credentials: what's ticked, as one bar, with each office's answer marked under it
  count:(c,w,h,st,L)=>{const lab=L.labs.find(x=>x.kind==="count"),it=lab.w.items,max=it.reduce((a,x)=>a+x.n,0),x0=30,x1=w-30,y=110,bh=86,sc=v=>x0+(x1-x0)*v/max;let acc=0;
    T(c,lab.w.unit+": "+WA_NUM(st.total,L),x0,70,{w:800,size:44,color:rgba(TRUST,1)});
    it.forEach((x,i)=>{const on=st.on.has(x.k),a=sc(acc),b=sc(acc+x.n),col=[TRUST,OFFICE.short.c,OFFICE.careers.c,[150,120,200],OFFICE.lms.c][i];c.fillStyle=rgba(col,on?0.85:0.14);rr(c,a+1,y,b-a-2,bh,10);c.fill();c.strokeStyle=rgba(col,0.8);c.lineWidth=2;rr(c,a+1,y,b-a-2,bh,10);c.stroke();
      if(b-a>90)T(c,WA_NUM(x.n,L),(a+b)/2,y+bh/2+9,{w:800,size:24,align:"center",color:on?"#0a1020":rgba(SOFT,0.9)});acc+=x.n;});
    lab.w.targets.forEach((tg,i)=>{const v=it.filter(x=>tg.set.includes(x.k)).reduce((a,x)=>a+x.n,0),xx=sc(v),col=WA_HEX(tg.c),yy=y+bh+46+i*44,right=xx>w*0.6;
      c.strokeStyle=rgba(col,0.9);c.lineWidth=3;c.setLineDash([6,6]);c.beginPath();c.moveTo(xx,y-6);c.lineTo(xx,yy-10);c.stroke();c.setLineDash([]);T(c,tg.name,xx+(right?-10:10),yy,{w:800,size:24,align:right?"right":"left",color:rgba(col,1)});});},
  // Same word, same thing? One word, two ideas, two birds
  trio:(c,w,h,st,L)=>{const V=L.vis,wx=w/2,wy=h-40;
    [[200,V.ideaUK,[140,200,255],200],[w-200,V.ideaUS,[255,170,120],w-200]].forEach(([ix,lab,col,bx],i)=>{c.strokeStyle=rgba(col,0.9);c.lineWidth=3;c.beginPath();c.moveTo(wx,wy-30);c.lineTo(ix,90);c.stroke();
      glow(c,ix,90,70,col,0.5);c.fillStyle=rgba(mix(col,[255,255,255],0.5),1);c.beginPath();c.arc(ix,90,16,0,TAU);c.fill();T(c,lab,ix,48,{w:800,size:26,align:"center",color:rgba(col,1)});
      c.beginPath();c.moveTo(ix,106);c.lineTo(bx+(i?-150:150),h-110);c.stroke();robin(c,bx+(i?-150:150),h-90,i?1.5:1.2,i?{col:[200,150,120],american:true}:{});});
    const ww=tw(c,V.word,34,800)+50;glass(c,wx-ww/2,wy-30,ww,56,14,KIND,{glow:12,ea:0.9,fill:"rgba(7,12,24,0.95)"});T(c,V.word,wx,wy+9,{w:800,size:34,align:"center"});},
  // What counts as one? Three rabbits, and what one row stands for
  grain:(c,w,h,st,L)=>{const g=c.createLinearGradient(0,h*0.62,0,h);g.addColorStop(0,"rgba(40,56,34,0.9)");g.addColorStop(1,"rgba(8,12,8,0.9)");c.fillStyle=g;c.fillRect(0,h*0.62,w,h*0.38);grass(c,0,w,h*0.62+4,1,0.8);
    [[w*0.2,h*0.6],[w*0.5,h*0.62],[w*0.8,h*0.58]].forEach(([x,y],i)=>{rabbit(c,x,y,1.3,[235,225,205],0.2+i*0.3,{run:0.4});
      if(st.pick==="rabbit")ring(c,x,y-12,86,KIND,0.9,4);
      if(st.pick==="ear"){ring(c,x+32,y-72,22,KIND,0.9,4);ring(c,x+48,y-76,22,KIND,0.9,4);}
      if(st.pick==="second"){for(let k=0;k<12;k++){c.fillStyle=rgba(KIND,0.8);c.fillRect(x-90+k*15,y+50,10,18);}}});
    T(c,(L.vis.grain||{})[st.pick]||"",30,56,{w:800,size:34,color:rgba(TRUST,1)});},
  // scenarios (600 × 320)
  two:(c,w,h,st,L)=>{const V=L.vis.two;officeCard(c,20,40,270,"lms","9,800".replace(",",L.lang==="es"?".":","),{name:V[0],big:56,h:210,meaning:V[1]});officeCard(c,310,40,270,"reg","9,350".replace(",",L.lang==="es"?".":","),{name:V[2],big:56,h:210,meaning:V[3]});T(c,V[4],300,296,{w:800,size:22,align:"center",color:rgba(TRUST,1)});},
  learner:(c,w,h,st,L)=>{const V=L.vis.learner;fuzzyRing(c,300,170,140,KIND,0.5,30);ring(c,300,170,140,KIND,0.9,3);ring(c,300,200,68,TRUST,0.9,3);T(c,V[0],300,58,{w:800,size:26,align:"center",color:rgba(KIND,1)});T(c,V[1],300,208,{w:800,size:24,align:"center",color:rgba(TRUST,1)});T(c,V[2],440,140,{w:700,size:18,align:"center",color:rgba(SOFT,1)});},
  rows:(c,w,h,st,L)=>{const V=L.vis.rows;table(c,40,16,V[0],[V[1],V[2]],[["Aisha K.","DS101"],["Aisha K.","STAT110"],["Aisha K.","WRIT100"],["Ben O.","DS101"],["Ben O.","MATH120"]],{col:KIND});T(c,V[3],360,290,{w:800,size:22,color:rgba(EDGE_,1)});},
  gloss:(c,w,h,st,L)=>{const V=L.vis.gloss;glass(c,30,30,540,260,18,TRUST,{glow:14,ea:0.8,fill:"rgba(7,12,24,0.94)"});T(c,V[0],60,88,{w:800,size:32,color:rgba(TRUST,1)});wrapT(c,V[1],60,140,480,{w:600,size:24});T(c,V[2],60,260,{w:800,size:24,color:rgba(EDGE_,1)});},
  badges:(c,w,h,st,L)=>{const V=L.vis.badges;credCard(c,20,40,270,{era:"badge",title:V[0],holder:"Aisha K.",claim:V[1],evidence:V[2],h:230,col:OFFICE.careers.c,rh:40});credCard(c,310,40,270,{era:"badge",title:V[3],holder:"Aisha K.",claim:V[4],evidence:V[5],h:230,col:[150,140,170],rh:40});},
  owner:(c,w,h,st,L)=>{const V=L.vis.owner;person(c,"mei",120,320,0.44,{t:1,pose:"explain"});glass(c,230,60,340,160,18,TRUST,{glow:14,ea:0.8,fill:"rgba(7,12,24,0.94)"});T(c,V[0],260,118,{w:800,size:34,color:rgba(TRUST,1)});T(c,V[1],260,164,{w:700,size:22});stamp(c,570,262,V[2],TRUST,1);},
  drift:(c,w,h,st,L)=>{const V=L.vis.drift;c.strokeStyle=rgba(CLAY,0.7);c.lineWidth=4;c.beginPath();c.moveTo(80,200);c.lineTo(520,200);c.stroke();[[80,"2015",V[1]],[520,"2026",V[2]]].forEach(([x,y_,m])=>{c.fillStyle=rgba(CLAY,1);c.beginPath();c.arc(x,200,9,0,TAU);c.fill();T(c,y_,x,246,{f:"mono",w:500,size:22,align:"center",color:rgba(CLAY,1)});wrapT(c,m,x-110,130,220,{w:700,size:20,align:"left"});});tag(c,300,64,V[0],KIND,{align:"center",size:28});},
  paper:(c,w,h,st,L)=>{sheet(c,60,16,480,290,{rot:-0.02});L.vis.paper.forEach((s,i)=>pencilText(c,(i+1)+". "+s,96,66+i*50,{size:21}));}
};
