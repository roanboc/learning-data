/* ===== Keeping it true: scenes =====
   Ten chapters, as in ../script.md. A dictionary is never finished; then, at the university, three changes arrive in one month,
   and the model starts to drift from the data. An AI agent watches and flags the drift, with evidence, and drafts the change;
   people decide, and tests and contracts check everyone's work. One change is followed end to end, and the sketch's stamp reads v3. Then what remains as the shapes keep changing: meaning, identity, grain and time. */

/* ---------- on a phone ----------
   Text is drawn at least 28 px high in the frame (../../shared/src/phone.js). These redraw this film's pictures from true.js that
   hold text, so they make room for it; true.js is shared with other series and stays as it is. Each is the original when the
   phone rule is off (the labs). Pictures that are texture (the dictionary's cover and pages, the patterns' glyphs, the small
   diplomas, the icons of the four answers) are drawn as decoration. */
kt_book=phDeco(kt_book);kt_glyph=phDeco(kt_glyph);kt_diploma=phDeco(kt_diploma);kt_four=phDeco(kt_four);
// the Planck constant: the exponent is placed after the number at the size it's drawn
kt_planck=(f=>function(ctx,x,y,sz,col){const m=phMin(ctx);if(!m)return f.apply(this,arguments);const S=Math.max(sz,m),E=Math.max(sz*0.6,m),a="h = 6.626 070 15 × 10",b="−34",c=" J s",
  wa=tw(ctx,a,S,700,"mono"),wb=tw(ctx,b,E,700,"mono"),wc=tw(ctx,c,S,700,"mono"),x0=x-(wa+wb+wc)/2;
  T(ctx,a,x0,y,{f:"mono",w:700,size:S,color:col});T(ctx,b,x0+wa+2,y-S*0.5,{f:"mono",w:700,size:E,color:col});T(ctx,c,x0+wa+wb+4,y,{f:"mono",w:700,size:S,color:col});})(kt_planck);
// the OED page: shorter senses, one to a line, with the same revisions in blue pencil
kt_oed=(f=>function(ctx,x,y,w,h,t,o){const m=phMin(ctx);if(!m)return f.apply(this,arguments);o=o||{};const a=o.a==null?1:o.a,p=o.p||0;if(a<=0.01)return;withA(ctx,a,()=>{
  [2,1].forEach(k=>{ctx.save();ctx.translate(x+w/2+k*7,y+h/2+k*6);ctx.rotate(0.018*k);kt_paper(ctx,-w/2,-h/2,w,h,t,{seed:k+4,col:k===2?[222,215,200]:[232,226,214],curl:0,age:0.1});ctx.restore();});
  kt_paper(ctx,x,y,w,h,t,{seed:3,col:[246,242,233],age:0.08});
  const S=Math.max(17,m),LH=S*1.36,ink="rgba(34,36,44,0.95)",gray="rgba(52,56,68,0.86)",blue=rgba(KT_BLUE,1),rev=k=>fin(p,k*0.18,0.2),L=x+34;
  T(ctx,"OXFORD ENGLISH DICTIONARY",x+w/2,y+44,{w:800,size:14,align:"center",color:"rgba(40,50,70,0.7)"});ctx.fillStyle="rgba(40,50,70,0.25)";ctx.fillRect(x+30,y+60,w-60,1.5);
  const pencil=(pts,lw)=>{ctx.strokeStyle=blue;ctx.lineCap="round";ctx.lineJoin="round";ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length-1;i++)ctx.quadraticCurveTo(pts[i][0],pts[i][1],(pts[i][0]+pts[i+1][0])/2,(pts[i][1]+pts[i+1][1])/2);const E=pts[pts.length-1];ctx.lineTo(E[0],E[1]);ctx.stroke();};
  const head=(s,yy)=>T(ctx,s,x+30,yy,{w:800,size:24,color:ink}),sense=(s,yy,xx)=>T(ctx,s,xx||L,yy,{w:500,size:S,color:gray});
  // credential: "on paper" struck, "digital, too" written in above a caret
  let yy=y+108;head("credential, n.",yy);sense("1. a letter that vouches for its bearer",yy+LH);
  const s2="2. proof of learning, ",s2b="on paper",wA=tw(ctx,s2,S,500),wB=tw(ctx,s2b,S,500),l2=yy+LH*3;sense(s2+s2b,l2);
  const r0=rev(0);if(r0>0){const x0=L+wA-3,x1=x0+(wB+6)*r0;pencil([[x0,l2-S*0.33],[lerp(x0,x1,0.35),l2-S*0.4],[lerp(x0,x1,0.7),l2-S*0.26],[x1,l2-S*0.36]],3);}
  withA(ctx,rev(1),()=>{const cx=L+wA+wB/2;pencil([[cx-8,l2+8],[cx,l2-2],[cx+8,l2+8]],2.5);T(ctx,"digital, too",cx,l2-LH*0.98,{w:700,size:21,align:"center",color:blue});});
  // credit: "a unit of study" circled
  yy=l2+LH*1.7;head("credit, n.",yy);sense("1. trust in what someone says",yy+LH);
  const c1="2. ",c2="a unit of study",wc1=tw(ctx,c1,S,500),wc2=tw(ctx,c2,S,500),l3=yy+LH*2;sense(c1+c2,l3);sense("counted toward a qualification",l3+LH,L+wc1);
  withA(ctx,rev(2),()=>{const cx=L+wc1+wc2/2,cy=l3-S*0.3,rx=wc2/2+14,ry=S*0.78,q=clamp(rev(2)*1.2,0,1);ctx.strokeStyle=blue;ctx.lineWidth=2.5;ctx.lineCap="round";ctx.beginPath();
    for(let k=0;k<=48*q;k++){const an=-2.4+k/48*TAU*1.04,r_=1+0.03*Math.sin(k*0.9);ctx.lineTo(cx+Math.cos(an)*rx*r_,cy+Math.sin(an)*ry*r_+k*0.04);}ctx.stroke();});
  // curriculum: a new sense, written in and highlighted
  yy=l3+LH*2.7;head("curriculum, n.",yy);sense("1. the subjects of a course of study",yy+LH);const l5=yy+LH*2.25;
  withA(ctx,rev(3),()=>{ctx.fillStyle=rgba(KT_BLUE,0.1);ctx.beginPath();ctx.moveTo(L-10,l5-S*1.05);ctx.quadraticCurveTo(x+w/2,l5-S*1.15,x+w-30,l5-S);ctx.quadraticCurveTo(x+w-24,l5-S*0.3,x+w-30,l5+S*0.45);ctx.quadraticCurveTo(x+w/2,l5+S*0.6,L-10,l5+S*0.42);ctx.quadraticCurveTo(L-15,l5-S*0.3,L-10,l5-S*1.05);ctx.fill();
    T(ctx,"3. short, stackable courses",L,l5,{w:700,size:S,color:blue});T(ctx,"new sense",x+w-40,l5,{w:700,size:18,align:"right",color:blue});});
  withA(ctx,rev(1.5),()=>{ctx.save();ctx.translate(x+w-20,y+170);ctx.rotate(-Math.PI/2);T(ctx,"revised",0,0,{w:700,size:18,align:"center",color:blue});ctx.restore();});});})(kt_oed);
// the government's form: a taller header, the fields' names over their boxes, and the new field's values as words
kt_form=(f=>function(ctx,x,y,w,o){const m=phMin(ctx);if(!m)return f.apply(this,arguments);o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;
  const F=["Provider code","Microcredential code","Learner ID","Volume of learning (hours)"],rh=m+30,top=m*3.4,ob=m*3.6,h=top+F.length*rh+ob;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,[200,215,240],{glow:14,ea:0.55,fill:"rgba(8,14,28,0.94)"});ctx.fillStyle="rgba(200,215,240,0.12)";rr(ctx,x+2,y+2,w-4,top-10,16);ctx.fill();
    T(ctx,"Government",x+24,y+m*1.2,{w:700,size:15,color:rgba(SOFT,1)});T(ctx,"Microcredential report 2027",x+24,y+m*2.4,{w:800,size:21});
    F.forEach((f_,i)=>{const yy=y+top+m+i*rh;T(ctx,f_,x+24,yy,{w:600,size:16,color:rgba(SOFT,1)});ctx.strokeStyle="rgba(170,200,245,0.35)";ctx.lineWidth=1.5;rr(ctx,x+24,yy+7,w-48,18,5);ctx.stroke();});
    const hi=o.hi||0,yy=y+top+F.length*rh+m*1.2;withA(ctx,0.3+0.7*hi,()=>{ctx.fillStyle=rgba(AMBER,0.14*hi);rr(ctx,x+12,yy-m*1.1,w-24,ob-12,10);ctx.fill();ctx.strokeStyle=rgba(AMBER,0.9);ctx.lineWidth=2.5;rr(ctx,x+12,yy-m*1.1,w-24,ob-12,10);ctx.stroke();
      T(ctx,"Outcome",x+24,yy,{w:800,size:17,color:rgba(AMBER,1)});wrapT(ctx,"completed · withdrawn · enrolled",x+24,yy+m*1.2,w-48,{w:500,size:18,color:rgba(INK,0.9)});});
    if(hi>0.5)withA(ctx,fin(hi,0.5,0.5),()=>tag(ctx,x+w-80,yy-m*0.35,"new",AMBER,{align:"center",size:16}));});return h;})(kt_form);
// a dashboard: drawn small, it's a picture of one (its number still reads); a formula that won't fit in type is set in the sans
kt_dash=(f=>function(ctx,x,y,w,h,o){const m=phMin(ctx);if(!m)return f.apply(this,arguments);o=o||{};const s=h/230;
  if(s<0.75)return phAsDeco(true,()=>f(ctx,x,y,w,h,o));if(!o.formula||tw(ctx,o.formula,m,500,"mono")<=w-40*s)return f(ctx,x,y,w,h,o);
  f(ctx,x,y,w,h,Object.assign({},o,{fA:0}));withA(ctx,(o.a==null?1:o.a)*(o.fA==null?1:o.fA),()=>T(ctx,o.formula,x+20*s,y+h-22*s,{w:600,size:18,color:o.fCol||DB.muted}));})(kt_dash);
// a glossary entry and a file of code: the highlight is placed at the size the line is drawn
kt_gloss=(f=>function(ctx,x,y,w,o){const m=phMin(ctx);if(!m||!o||!o.hi||!(o.hiA>0))return f.apply(this,arguments);const h=f(ctx,x,y,w,Object.assign({},o,{hiA:0})),S=Math.max(22,m),l=o.lines[o.hi[0]],yy=y+120+o.hi[0]*38,
  p0=l.indexOf(o.hi[1]),x0=x+24+tw(ctx,l.slice(0,p0),S,600),x1=x0+tw(ctx,o.hi[1],S,600);
  withA(ctx,(o.a==null?1:o.a)*o.hiA,()=>{ctx.fillStyle=rgba(o.hiCol||EDGE_,0.2);rr(ctx,x0-4,yy-S*1.05,x1-x0+8,S*1.4,6);ctx.fill();ctx.strokeStyle=rgba(o.hiCol||EDGE_,1);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x0,yy+8);ctx.lineTo(x1,yy+8);ctx.stroke();});return h;})(kt_gloss);
kt_code=(f=>function(ctx,x,y,w,name,lines,o){const m=phMin(ctx);if(!m||!o||!o.hi||!(o.hiA>0))return f.apply(this,arguments);const h=f(ctx,x,y,w,name,lines,Object.assign({},o,{hiA:0})),S=Math.max(18,m),l=lines[o.hi[0]],yy=y+84+o.hi[0]*34,
  p0=l.indexOf(o.hi[1]),x0=x+22+tw(ctx,l.slice(0,p0),S,500,"mono"),x1=x0+tw(ctx,o.hi[1],S,500,"mono");
  withA(ctx,(o.a==null?1:o.a)*o.hiA,()=>{ctx.fillStyle=rgba(o.hiCol||EDGE_,0.22);rr(ctx,x0-4,yy-S*1.0,x1-x0+8,S*1.36,6);ctx.fill();ctx.strokeStyle=rgba(o.hiCol||EDGE_,1);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x0,yy+8);ctx.lineTo(x1,yy+8);ctx.stroke();});return h;})(kt_code);
// a card of the change package: its third line, in type, reads if it fits the card and is a texture if it doesn't
kt_pcard=(f=>function(ctx,x,y,w,h,k,o){const m=phMin(ctx);if(!m)return f.apply(this,arguments);o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const [lay,l1,l2]=KT_PKG[k],col=o.col||KT_AI;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,12,col,{glow:10+10*(o.hi||0),ea:0.75,fill:"rgba(6,16,20,0.95)"});ctx.fillStyle=rgba(col,0.9);rr(ctx,x+12,y+14,5,h-28,2);ctx.fill();
    T(ctx,lay,x+30,y+34,{w:700,size:17,color:rgba(col,1)});T(ctx,l1,x+30,y+68,{w:700,size:23});
    if(h>100&&l2)phAsDeco(tw(ctx,l2,m,500,"mono")>w-44,()=>T(ctx,l2,x+30,y+102,{f:"mono",w:500,size:16,color:rgba(SOFT,1)}));
    if(o.tick)kt_gtick(ctx,x+w-22,y+22,13,o.tick);});})(kt_pcard);
// the stack of versions: wide enough for the newest one's name
kt_versions=(f=>function(ctx,x,y,n,o){const m=phMin(ctx);if(!m)return f.apply(this,arguments);o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const cw=Math.max(220,o.sub?tw(ctx,o.sub,Math.max(18,m),600)+48:0);
  withA(ctx,a,()=>{for(let i=0;i<n;i++){const k=clamp((o.p==null?n:o.p)-i,0,1);if(k<=0)continue;const top=i===n-1,xx=x+i*16,yy=y-i*26;
    withA(ctx,k,()=>{glass(ctx,xx,yy,cw,110,14,top?(o.col||TRUST):[150,165,190],{glow:top?16:6,ea:top?0.9:0.5,fill:"rgba(8,12,24,0.96)"});T(ctx,"v"+(i+1),xx+22,yy+44,{f:"mono",w:500,size:26,color:top?rgba(o.col||TRUST,1):rgba(SOFT,1)});
      T(ctx,(o.dates||["2019","2025","2026"])[i]||"",xx+cw-22,yy+42,{f:"mono",w:500,size:18,align:"right",color:rgba(SOFT,0.9)});if(top&&o.sub)T(ctx,o.sub,xx+22,yy+88,{w:600,size:18,color:rgba(INK,0.85)});});}});})(kt_versions);
// a proposal on its way: the card fits its name at the size it's drawn
kt_prop=(f=>function(ctx,x,y,s,col,a,o){const m=phMin(ctx);if(!m)return f.apply(this,arguments);o=o||{};const S=Math.max(17,m),w=tw(ctx,s,S,700)+36,h=S+20;
  withA(ctx,a,()=>{glass(ctx,x-w/2,y-h/2,w,h,12,col,{glow:14,ea:0.85,fill:"rgba(8,12,24,0.95)",lw:o.dash?2:1.6});if(o.dash){ctx.save();ctx.setLineDash([6,5]);ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2;rr(ctx,x-w/2,y-h/2,w,h,12);ctx.stroke();ctx.restore();}
    T(ctx,s,x,y+S*0.36,{w:700,size:S,align:"center",color:rgba(col,1)});});})(kt_prop);
// one change, end to end: a name that doesn't fit its box goes on two lines, broken at " · " or "."
kt_chain=(f=>function(ctx,x,y,w,o){const m=phMin(ctx);if(!m)return f.apply(this,arguments);o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;
  const n=KT_CHAIN.length,gap=o.gap||16,bw=(w-gap*(n-1))/n,lit=o.lit||0,S=m,fit=(s,wt)=>{if(tw(ctx,s,S,wt)<=bw-14)return[s];const i=s.indexOf(" · ")>0?s.indexOf(" · "):s.indexOf(".");return i>0?[s.slice(0,i+(s[i]==="."?1:0)),s.slice(i+(s[i]==="."?1:3))]:[s];};
  const L=KT_CHAIN.map(([t1,t2],i)=>[fit(t1,800),fit((o.sub||[])[i]||t2,600)]),nl=Math.max(...L.map(q=>q[0].length+q[1].length)),lh=S*1.12,bh=Math.max(o.h||110,nl*lh+30);
  withA(ctx,a,()=>{const cy=y+bh/2;ctx.strokeStyle="rgba(170,200,245,0.25)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+bw/2,cy);ctx.lineTo(x+w-bw/2,cy);ctx.stroke();
    if(lit>0){const e=x+bw/2+(bw+gap)*Math.min(n-1,lit-0.5);beam(ctx,[{x:x+bw/2,y:cy},{x:Math.max(x+bw/2+1,e),y:cy}],TRUST,[[18,0.06],[7,0.18],[2.6,0.8],[1.2,1]]);}
    L.forEach(([l1,l2],i)=>{const bx=x+i*(bw+gap),on=clamp(lit-i,0,1),hi=o.hiK===i?1:0,col=mix([150,165,190],TRUST,on),k=l1.length+l2.length,y0=y+bh/2-(k-1)*lh/2+S*0.36;
      glass(ctx,bx,y,bw,bh,14,col,{glow:6+16*on+10*hi,ea:0.35+0.6*on,fill:"rgba(8,12,24,0.95)"});
      l1.forEach((s,j)=>T(ctx,s,bx+bw/2,y0+j*lh,{w:800,size:S,align:"center",color:on>0.5?rgba(INK,1):rgba(SOFT,0.8)}));
      withA(ctx,0.4+0.6*on,()=>l2.forEach((s,j)=>T(ctx,s,bx+bw/2,y0+(l1.length+j)*lh,{w:600,size:S,align:"center",color:on>0.5?rgba(TRUST,1):rgba(SOFT,0.8)})));
      if(o.ticks&&on>0.9)kt_gtick(ctx,bx+bw-14,y+2,11,fin(on,0.9,0.1));});});return bh;})(kt_chain);
// a pattern's card: its name and its author fit the card (a long list of authors is shortened)
kt_patCard=(f=>function(ctx,k,x,y,w,h,t,o){const m=phMin(ctx);if(!m||k<0||k==="star")return f.apply(this,arguments);o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=KT_PAT[k][2];
  let sub=KT_PAT[k][1];if(tw(ctx,sub,m,500)>w-20)sub={"Rönnbäck and others":"Rönnbäck et al.","Puppini and Inmon":"Puppini, Inmon"}[sub]||sub;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,col,{glow:12+10*(o.hi||0),ea:0.75,fill:"rgba(7,12,24,0.93)"});
    T(ctx,KT_PAT[k][0],x+w/2,y+42,{w:800,size:22,align:"center",color:rgba(col,1)});T(ctx,sub,x+w/2,y+78,{w:500,size:15,align:"center",color:rgba(SOFT,1)});
    kt_glyph(ctx,k,x+w/2,y+(o.four?162:170),o.gs||1,t);
    if(o.four)KT_FOUR.forEach((f_,j)=>kt_four(ctx,j,x+w/2+(j-1.5)*48,y+h-34,17,o.four[j]||0));});})(kt_patCard);

/* ---------- 1. A dictionary is never finished ---------- */
scene("dict",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),B=c("breath"),ph=phMin(ctx)>0;histBg(ctx,S,t);
  const cA=c("admit"),cP=c("planet"),cK=c("kilo"),cM=c("moves");
  const bookA=1-fin(t,cP-0.7,0.8),plA=fin(t,cP,0.8)*(1-fin(t,cK-0.6,0.7)),kgA=fin(t,cK-0.5,0.7)*(1-fin(t,cM+0.1,0.7)),mvA=fin(t,cM+0.3,0.8);
  // 1755: a heavy book, opened; Johnson hoped to fix the language. Then the words lift off the page, and the OED is still being revised
  withA(ctx,bookA,()=>{const oT=kt_w(sc,"admit","The Oxford"),oA=fin(t,oT-0.4,0.9),oeA=fin(t,oT+0.4,0.6),bw=lerp(900,780,oA),bh=bw*0.58,bx=lerp(510,130,oA),by=lerp(200,236,oA);
    yearTag(ctx,120,120,"1755 · Johnson",CLAY,fin(t,0.4,0.6));
    kt_book(ctx,bx,by,bw,bh,t,{a:fin(t,0.5,0.8),open:fin(t,c("johnson")+2.4,1.0),drift:fin(t,cA+0.8,1.4),hi:"CREDENTIAL"});
    const fx=kt_w(sc,"johnson","fix"),lk=fin(t,fx-0.3,0.5)*(1-fin(t,cA+2.2,0.8));kt_lock(ctx,bx+bw/2,by+bh/2-10,1.3,[232,192,112],lk,fin(t,cA+1.0,0.8));
    withA(ctx,fin(t,fx,0.5)*(1-fin(t,cA+0.6,0.5)),()=>tag(ctx,bx+bw/2,by+bh+46,"hoped: to fix the language in place",CLAY,{align:"center",size:22}));
    withA(ctx,fin(t,kt_w(sc,"admit","no dictionary"),0.6),()=>tag(ctx,bx+bw/2,by+bh+46,"no dictionary can embalm a language",PARCH,{align:"center",size:22}));
    withA(ctx,oeA,()=>{yearTag(ctx,1060,120,"today · Oxford English Dictionary",CLAY,1);kt_oed(ctx,1060,ph?150:190,640,ph?600:520,t,{p:clamp((t-kt_w(sc,"admit","still"))/2.2,0,1)});
      withA(ctx,fin(t,kt_w(sc,"admit","still"),0.5),()=>tag(ctx,1380,ph?792:776,"still revised",[150,185,255],{align:"center",size:22}));});});
  // 2006: a definition of planet; nothing in the sky changed, and the count went from nine to eight
  withA(ctx,plA,()=>{yearTag(ctx,120,120,"2006 · Prague",CLAY,1);const st=fin(t,kt_w(sc,"planet","nine"),0.7),n8=t>kt_w(sc,"planet","eight")-0.2;
    kt_sky(ctx,700,470,t,{dwarf:fin(t,kt_w(sc,"planet","eight"),0.6)});
    kt_list(ctx,150,170,330,"planets",KT_PLANETS.map(p=>p[0]),{rh:44,strike:{8:st},foot:84,t});
    ctx.strokeStyle="rgba(120,90,50,0.35)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(180,660);ctx.quadraticCurveTo(315,662,450,659);ctx.stroke();T(ctx,"count",180,712,{w:700,size:22,color:"rgba(90,70,48,0.9)"});T(ctx,n8?"8":"9",450,722,{w:800,size:56,align:"right",color:n8?"rgba(150,60,30,1)":"rgba(60,44,30,0.95)"});
    withA(ctx,fin(t,kt_w(sc,"planet","agreed")-0.2,0.6),()=>{glass(ctx,1250,100,580,210,18,CLAY,{glow:14,ea:0.8,fill:"rgba(26,16,10,0.94)"});T(ctx,"planet · IAU, 2006",1278,144,{w:800,size:27,color:rgba(CLAY,1)});
      ["orbits the Sun","is nearly round","has cleared its orbit"].forEach((s,i)=>T(ctx,(i+1)+". "+s,1282,194+i*38,{w:600,size:25,color:rgba(PARCH,1)}));});
    withA(ctx,fin(t,kt_w(sc,"planet","Nothing"),0.6),()=>tag(ctx,1180,790,"nothing in the sky changed",CLAY,{align:"center",size:22}));});
  // 2019: the kilogram, from a metal cylinder to a constant of nature
  withA(ctx,kgA,()=>{yearTag(ctx,120,120,"2019 · the kilogram",CLAY,1);const rp=fin(t,kt_w(sc,"kilo","kilogram")-0.2,0.8);
    kt_kilo(ctx,600,480,1.6,1-0.55*rp,t);T(ctx,"a metal cylinder, 1889 to 2019",600,700,{w:700,size:22,align:"center",color:rgba(PARCH,0.9-0.4*rp)});
    arrowTo(ctx,800,440,1000,440,CLAY,rp,{p:rp,head:14});
    withA(ctx,rp,()=>{glass(ctx,1020,350,700,190,20,CLAY,{glow:18,ea:0.85,fill:"rgba(26,16,10,0.94)"});kt_planck(ctx,1370,448,34,rgba(PARCH,1));T(ctx,"the Planck constant, fixed exactly",1370,500,{w:600,size:20,align:"center",color:rgba(CLAY,1)});
      tag(ctx,1370,610,"defined by a constant of nature",CLAY,{align:"center",size:22});});});
  // meaning moves: every definition needs an owner, a date and a version
  withA(ctx,mvA,()=>{const X=[400,960,1520];
    kt_book(ctx,X[0]-160,180,320,190,t,{a:1});kt_sky(ctx,X[1],275,t,{s:0.27,ang:2});glass(ctx,X[2]-230,215,460,110,16,CLAY,{glow:12,ea:0.7,fill:"rgba(26,16,10,0.92)"});phAsDeco(ph,()=>kt_planck(ctx,X[2],282,22,rgba(PARCH,1)));
    ctx.strokeStyle=rgba(CLAY,0.7);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(200,450);ctx.lineTo(1640,450);ctx.stroke();arrowTo(ctx,1600,450,1660,450,CLAY,1,{head:14});
    [["dictionary","1755"],["planet","2006"],["kilogram","2019"]].forEach(([n,y_],i)=>{T(ctx,n,X[i],410,{w:800,size:24,align:"center",color:rgba(PARCH,1)});ctx.fillStyle=rgba(CLAY,1);ctx.beginPath();ctx.arc(X[i],450,8,0,TAU);ctx.fill();T(ctx,y_,X[i],492,{f:"mono",w:500,size:20,align:"center",color:rgba(CLAY,1)});});
    withA(ctx,fin(t,cM+0.2,0.6),()=>tag(ctx,1680,450,"meaning moves",CLAY,{size:20}));
    const rows=[["owner",["Samuel Johnson","IAU","CGPM"]],["date",["1755","24 Aug 2006","20 May 2019"]],["version",["1st edition","Resolution B5","revised SI"]]];
    rows.forEach(([k,v],r)=>{const a=fin(t,kt_w(sc,"moves",k==="owner"?"an owner":k==="date"?"a date":"a version")-0.1,0.5),yy=590+r*70;withA(ctx,a,()=>{T(ctx,k,110,yy+8,{f:"mono",w:500,size:23,color:rgba(TRUST,1)});v.forEach((s,i)=>tag(ctx,X[i],yy,s,TRUST,{align:"center",size:23}));});});});
  seriesTitle(ctx,S,t,B,"Keeping it true","who keeps the meaning up to date",KT_AI);
  fadeIn(ctx,S,t);vign(ctx,S);});

/* ---------- 2. Change arrives ---------- */
scene("arrives",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),ph=phMin(ctx)>0;setScreen(ctx,S);bg2(ctx);
  const cG=c("gov"),cE=c("error"),cR=c("rate"),gA=fin(t,cG-0.3,0.6),eA=fin(t,cE-0.3,0.6),rA=fin(t,kt_w(sc,"rate","appears")-0.3,0.6);
  kt_cal(ctx,90,140,470,{a:fin(t,0.3,0.6),today:1,marks:[{d:6,col:AMBER,a:gA},{d:14,col:BAD,a:eA},{d:22,col:EDGE_,a:rA}]});
  withA(ctx,fin(t,c("month")+0.6,0.6),()=>tag(ctx,90,580,"three changes, one month",[170,205,255],{size:20}));
  [["6 Oct","a new field to report",AMBER,gA],["14 Oct","a credential revoked",BAD,eA],["22 Oct","one measure, three numbers",EDGE_,rA]].forEach(([d,s,col,a],i)=>withA(ctx,a,()=>{const y=650+i*52;ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(104,y-7,7,0,TAU);ctx.fill();
    T(ctx,d,124,y,{f:"mono",w:500,size:19,color:rgba(col,1)});T(ctx,s,ph?140+tw(ctx,"14 Oct",phMin(ctx),500,"mono"):214,y,{w:600,size:21});}));
  // the government adds a field to the microcredential report
  const slide=a=>(1-ease(a))*120;
  kt_form(ctx,640+slide(gA),126,500,{a:gA,hi:fin(t,kt_w(sc,"gov","new field"),0.8)});
  // a credential issued in error, revoked
  withA(ctx,eA,()=>{T(ctx,"Microcredential",1204+slide(eA),152,{w:800,size:24,color:rgba(TRUST,1)});credCard(ctx,1200+slide(eA),170,560,{era:"digital",issuer:"the university",holder:"Jordan Lee",claim:"Data Visualisation",date:"14 Oct 2026",col:TRUST,rh:40,h:360});
    withA(ctx,fin(t,kt_w(sc,"error","issued in error"),0.5),()=>tag(ctx,ph?1640:1480,122,"issued in error",BAD,{align:"center",size:18}));
    kt_rstamp(ctx,1500,400,"REVOKED",BAD,1,fin(t,kt_w(sc,"error","revoked")-0.1,0.35),{size:40,rot:-0.16});});
  // a new measure on three dashboards, with three definitions
  KT_DASH.forEach((d,i)=>{const a=fin(t,kt_w(sc,"rate","three dashboards")-0.2+i*0.3,0.5);kt_dash(ctx,640+i*380,610,350,210,{a,name:d.name,col:d.col,num:d.num,hi:pulseAt(t,kt_w(sc,"rate","three different")+i*0.35,1.2)});});
  withA(ctx,fin(t,kt_w(sc,"rate","completion rate")-0.2,0.6),()=>{[815,1195,1575].forEach(x=>{ctx.strokeStyle=rgba(EDGE_,0.45);ctx.lineWidth=1.5;ctx.setLineDash([6,8]);ctx.beginPath();ctx.moveTo(1195,578);ctx.lineTo(x,604);ctx.stroke();ctx.setLineDash([]);});
    tag(ctx,1195,566,"“completion rate”",EDGE_,{align:"center",size:22});});
  vign(ctx,S);});

/* ---------- 3. How models go stale ---------- */
scene("stale",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),ph=phMin(ctx)>0,bs=ph?1.25:1;setScreen(ctx,S);bg2(ctx);
  // the board starts to drift as the word is said, and keeps drifting, up and away, a little smaller and turned, through the chapter
  const cK=c("kinds"),cG=c("gap"),d0=kt_w(sc,"drift","They drift")-0.3,dr=1-Math.pow(1-clamp((t-d0)/(sc.dur-d0-0.6),0,1),3),gp=fin(t,cG-0.2,0.8);
  const bk=1-0.1*dr,bw=1100*bk,bh=320*bk,bcx=930+140*dr,bcy=256-20*dr,bx=bcx-bw/2,by=bcy-bh/2,brot=-0.03*dr,onB=(dx,dy)=>[bcx+(dx*Math.cos(brot)-dy*Math.sin(brot))*bk,bcy+(dx*Math.sin(brot)+dy*Math.cos(brot))*bk];
  const TX=444,TY=590,TS=1.2,CW=ph?[130,280,170,130,150]:KT_CW,col=i=>TX+CW.slice(0,i).reduce((p,q)=>p+q,0)*TS,colW=i=>CW[i]*TS,rowY=j=>TY+(46+40*(j+1)+20)*TS;
  // the gap between what's written and what's used, opening slowly
  if(dr>0.05){const g=ctx.createLinearGradient(0,by+bh,0,TY);g.addColorStop(0,rgba(EDGE_,0));g.addColorStop(0.5,rgba(EDGE_,0.05+0.1*gp));g.addColorStop(1,rgba(EDGE_,0));ctx.fillStyle=g;ctx.fillRect(0,by+bh,W,TY-by-bh);}
  // what's written: the model on its board, stamped v3, still a draft
  kt_board(ctx,bx,by,bw,bh,t,{a:fin(t,0.2,0.6),s:0.8*bs*bk,label:"the model · what's written",stamp:"sketch v3 · draft",rot:brot});
  // what's used: the data. Dashed lines join what each box means to the columns that carry it, and stretch as the model drifts
  [[...onB(-256*bs,122*bs),1],[...onB(0,-70*bs),2],[...onB(256*bs,122*bs),4]].forEach(([x0,y0,ci],k)=>{const x1=col(ci)+colW(ci)/2,y1=TY-4,red=clamp(dr*1.6-0.3,0,1);
    ctx.save();ctx.setLineDash([7,9]);ctx.strokeStyle=rgba(mix(SK,EDGE_,red),0.55);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0,y0);ctx.bezierCurveTo(x0,y0+100,x1,y1-100,x1,y1);ctx.stroke();ctx.restore();});
  withA(ctx,fin(t,0.4,0.6),()=>{tag(ctx,TX,560,"the data · what's used",[170,205,255],{size:17});ctx.save();ctx.translate(TX,TY);ctx.scale(TS,TS);table(ctx,0,0,"enrolments",KT_COLS,KT_ROWS,{cw:CW,col:[170,205,255]});ctx.restore();});
  const k1=fin(t,kt_w(sc,"kinds","A value"),0.5),k2=fin(t,kt_w(sc,"kinds","A column"),0.5),k3=fin(t,kt_w(sc,"kinds","One measure"),0.5),k4=fin(t,kt_w(sc,"kinds","A standard"),0.5),lab=1-gp;
  // 1. a value nobody announced
  if(k1>0){const x=col(2),y=rowY(1);withA(ctx,k1,()=>{ctx.fillStyle="rgba(24,8,10,0.96)";ctx.fillRect(x+3,y-20,colW(2)-6,40);glow(ctx,x+colW(2)/2,y,70,EDGE_,0.3);T(ctx,"WAITLISTED",x+14,y+7,{f:"mono",w:500,size:19,color:rgba(EDGE_,1)});ctx.strokeStyle=rgba(EDGE_,0.9);ctx.lineWidth=2.5;rr(ctx,x+3,y-20,colW(2)-6,40,8);ctx.stroke();
    withA(ctx,lab,()=>{tag(ctx,x+colW(2)/2,538,"a value nobody announced",EDGE_,{align:"center",size:18});});});}
  // 2. a column whose meaning slowly shifts
  if(k2>0){const x=col(3),y=TY+66*TS,m=0.5+0.5*Math.sin(t*2.2);withA(ctx,k2,()=>{ctx.strokeStyle=rgba(EDGE_,0.5+0.5*m);ctx.lineWidth=2.5;rr(ctx,x+3,y-22,colW(3)-6,40,8);ctx.stroke();
    withA(ctx,lab,()=>tag(ctx,x+colW(3)/2+40,ph?490:498,"meaning shifts: recorded → live",EDGE_,{align:"center",size:18}));});}
  // 3. one measure, defined twice
  withA(ctx,k3,()=>{if(ph){[["dashboard A","completed / census"],["dashboard B","completed / started"]].forEach(([n,f],i)=>{const y=588+i*150;glass(ctx,1500,y,380,128,12,EDGE_,{glow:10,ea:0.7,fill:"rgba(6,10,20,0.95)"});
      T(ctx,n,1520,y+38,{w:600,size:18,color:rgba(SOFT,1)});T(ctx,"completion_rate",1520,y+74,{f:"mono",w:500,size:18,color:rgba(INK,0.95)});T(ctx,"= "+f,1520,y+110,{f:"mono",w:500,size:19,color:rgba(INK,0.95)});});
      T(ctx,"≠",1690,738,{w:800,size:30,align:"center",color:rgba(EDGE_,1)});withA(ctx,lab,()=>tag(ctx,1690,538,"one measure, defined twice",EDGE_,{align:"center",size:18}));return;}
    [["dashboard A","completed / census"],["dashboard B","completed / started"]].forEach(([n,f],i)=>{const y=600+i*110;glass(ctx,1500,y,380,90,12,EDGE_,{glow:10,ea:0.7,fill:"rgba(6,10,20,0.95)"});T(ctx,n+" · completion_rate",1520,y+34,{f:"mono",w:500,size:18,color:rgba(SOFT,1)});T(ctx,"= "+f,1520,y+70,{f:"mono",w:500,size:19,color:rgba(INK,0.95)});});
    T(ctx,"≠",1690,707,{w:800,size:30,align:"center",color:rgba(EDGE_,1)});withA(ctx,lab,()=>tag(ctx,1690,538,"one measure, defined twice",EDGE_,{align:"center",size:18}));});
  // 4. a standard, updated for a new year
  withA(ctx,k4,()=>{const f=fin(t,kt_w(sc,"kinds","new year"),0.6);glass(ctx,70,600,330,200,16,[200,215,240],{glow:10,ea:0.6,fill:"rgba(8,14,28,0.94)"});T(ctx,"Government spec",94,640,{w:700,size:18,color:rgba(SOFT,1)});
    T(ctx,"2026",94,712,{w:800,size:52,color:rgba(INK,0.95*(1-f))});withA(ctx,f,()=>{T(ctx,"2027",94,712,{w:800,size:52,color:rgba(EDGE_,1)});T(ctx,"+ outcome field",94,768,{w:600,size:19,color:rgba(EDGE_,1)});});
    withA(ctx,lab,()=>tag(ctx,236,538,"updated for a new year",EDGE_,{align:"center",size:18}));});
  // drift: the gap between what's written down and what's actually used
  withA(ctx,gp,()=>{ctx.save();ctx.setLineDash([12,10]);ctx.strokeStyle=rgba(EDGE_,0.8);ctx.lineWidth=2.5;[by+bh+22,TY-60].forEach(y=>{ctx.beginPath();ctx.moveTo(120,y);ctx.lineTo(1800,y);ctx.stroke();});ctx.restore();
    tag(ctx,960,(by+bh+22+TY-60)/2,"drift: what's written vs what's used",EDGE_,{align:"center",size:26});});
  vign(ctx,S);});

/* ---------- 4. AI as a watcher ---------- */
const KT_SRC=[["catalog",120,120],["lineage",1400,120],["queries",120,540],["new data",1400,540]];
function kt_source(ctx,k,x,y,t,a,hi){const ph=phMin(ctx)>0;withA(ctx,a,()=>{const w=ph?480:400,h=250;glass(ctx,x,y,w,h,18,hi?KT_AI:[170,205,255],{glow:10+14*hi,ea:0.5+0.4*hi,fill:"rgba(8,14,28,0.93)"});
  T(ctx,["catalog","lineage","queries people run","new data"][k],x+24,y+40,{w:800,size:24,color:hi>0.5?rgba(KT_AI,1):rgba(INK,0.95)});
  if(k===0)["credentials","enrolments","completions","learners"].forEach((n,i)=>{const yy=y+84+i*40;ctx.strokeStyle=rgba(SOFT,0.8);ctx.lineWidth=1.5;ctx.strokeRect(x+26,yy-16,22,18);ctx.beginPath();ctx.moveTo(x+26,yy-10);ctx.lineTo(x+48,yy-10);ctx.stroke();T(ctx,n,x+62,yy,{f:"mono",w:500,size:19});T(ctx,["registrar","short courses","platform","registrar"][i],x+w-24,yy,{w:600,size:15,align:"right",color:rgba(SOFT,0.9)});});
  if(k===1){const N=ph?[[70,170,LAYER.bronze],[180,170,LAYER.silver],[290,170,LAYER.gold],[410,110,KT_PLAN],[410,170,OFFICE.short.c],[410,230,OFFICE.lms.c]]:[[60,160,LAYER.bronze],[150,160,LAYER.silver],[240,160,LAYER.gold],[340,100,KT_PLAN],[340,160,OFFICE.short.c],[340,220,OFFICE.lms.c]];[[0,1],[1,2],[2,3],[2,4],[2,5]].forEach(([i,j])=>{ctx.strokeStyle="rgba(170,200,245,0.45)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+N[i][0],y+N[i][1]);ctx.lineTo(x+N[j][0],y+N[j][1]);ctx.stroke();});
    N.forEach(([nx,ny,cl],i)=>{glow(ctx,x+nx,y+ny,18,cl,0.4);ctx.fillStyle=rgba(cl,0.95);ctx.beginPath();ctx.arc(x+nx,y+ny,i<3?12:9,0,TAU);ctx.fill();});
    ["bronze","silver","gold"].forEach((n,i)=>T(ctx,n,x+N[i][0],y+N[i][1]+34,{w:600,size:14,align:"center",color:rgba(SOFT,1)}));if(ph)T(ctx,"dashboards",x+w-18,y+84,{w:600,size:14,align:"right",color:rgba(SOFT,1)});else T(ctx,"dashboards",x+340,y+84,{w:600,size:14,align:"center",color:rgba(SOFT,1)});}
  if(k===2){const Q=["SELECT avg(completed)","  FROM enrolments","WHERE status = 'enrolled'","COUNT(DISTINCT learner)","GROUP BY microcredential","sum(finished) / count(logged_in)"];ctx.save();rr(ctx,x+10,y+64,w-20,h-74,10);ctx.clip();
    // on a phone the queries scroll by as a texture: the card's name says what they are
    const off=(t*22)%34;if(ph)PH_OFF++;Q.concat(Q).forEach((q,i)=>{const yy=y+88+i*34-off-(Math.floor(t*22/34)%Q.length)*0;if(yy>y+50&&yy<y+h+20)T(ctx,Q[(i+Math.floor(t*22/34))%Q.length],x+24,yy,{f:"mono",w:500,size:17,color:rgba(i%2?INK:[190,220,255],0.85)});});if(ph)PH_OFF--;ctx.restore();}
  if(k===3){for(let i=0;i<24;i++){const r=Math.floor(i/8),cI=i%8,u=clamp((t*1.3-i*0.18)%6,0,1),px=x+30+cI*44+(1-ease(u))*200,py=y+80+r*50;withA(ctx,ease(u),()=>{ctx.fillStyle=rgba([AMBER,KT_PLAN,OFFICE.lms.c][(i*7)%3],0.35+0.5*hash(i,4));rr(ctx,px,py,34,34,6);ctx.fill();});}}});}
scene("watch",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),ph=phMin(ctx)>0;setScreen(ctx,S);bg2(ctx);
  const cC=c("compare"),cF=c("flags"),cN=c("notice"),rA=1-fin(t,cC-0.5,0.7),cA=fin(t,cC-0.3,0.7)*(1-fin(t,cF-0.5,0.7)),fA=fin(t,cF-0.3,0.7);
  // the agent reads the catalog, the lineage, the queries people run, and new data as it arrives
  withA(ctx,rA,()=>{const aT=kt_w(sc,"reads","An agent")-0.4;kt_agent(ctx,960,440,72,t,{a:0.3*fin(t,0.2,0.8)+0.7*fin(t,aT,0.7),label:"agent",labelA:fin(t,aT,0.7),busy:fin(t,kt_w(sc,"reads","catalog"),1)});
    withA(ctx,fin(t,0.4,0.6)*(1-fin(t,c("reads")+3.6,0.6)),()=>tag(ctx,960,250,"where AI helps first",KT_AI,{align:"center",size:28}));
    KT_SRC.forEach(([w_,x0,y],k)=>{const x=ph&&x0>960?x0-80:x0,t0=kt_w(sc,"reads",w_==="queries"?"the queries":w_),a=fin(t,t0-0.3,0.5),on=pulseAt(t,t0,2.2),cx=x+(ph?240:200),cy=y+125;
      kt_scan(ctx,960,440,cx,cy,a*(0.35+0.65*on),t,{w:90,ph:k});kt_source(ctx,k,x,y,t,a,on);});});
  // it compares each definition in the glossary with the code that calculates it
  withA(ctx,cA,()=>{const gT=kt_w(sc,"compare","definition"),dT=kt_w(sc,"compare","code"),pT=kt_w(sc,"compare","parted");kt_agent(ctx,960,196,54,t,{busy:0.6});
    kt_scan(ctx,960,196,500,380,fin(t,gT,0.5)*0.8,t,{w:120});kt_scan(ctx,960,196,1420,380,fin(t,dT,0.5)*0.8,t,{w:120,ph:2});
    withA(ctx,fin(t,gT-0.3,0.5),()=>{tag(ctx,500,318,"what's written",KIND,{align:"center",size:18});kt_gloss(ctx,150,350,700,{term:"completion rate",ver:"v2 · 2025",lines:["learners who completed","÷ all who started"],owner:"owner: Registrar's office",h:270,hi:[1,"all who started"],hiA:fin(t,pT,0.5)});});
    withA(ctx,fin(t,dT-0.3,0.5),()=>{tag(ctx,1420,318,"what's used",[170,205,255],{align:"center",size:18});kt_code(ctx,1070,350,700,"learning_platform_dashboard.sql",["SELECT sum(finished_all_modules)","     / count(logged_in)","FROM platform.progress"],{h:270,hi:[1,"count(logged_in)"],hiA:fin(t,pT,0.5)});});
    withA(ctx,fin(t,pT+0.3,0.5),()=>{glow(ctx,960,485,60,EDGE_,0.4);T(ctx,"≠",960,505,{w:800,size:56,align:"center",color:rgba(EDGE_,1)});tag(ctx,960,690,"the two have parted",EDGE_,{align:"center",size:24});});});
  // it flags each drift, with evidence: three definitions, and the dashboards that use each
  withA(ctx,fA,()=>{const dT=kt_w(sc,"flags","each drift"),bT=kt_w(sc,"flags","the dashboards");kt_agent(ctx,170,410,56,t,{busy:fin(t,cN,1),label:"agent"});
    withA(ctx,fin(t,cF,0.5),()=>tag(ctx,380,118,"evidence · completion rate, defined three ways",KT_AI,{size:20}));
    KT_DASH.forEach((d,i)=>{const y=160+i*176,a=fin(t,dT-0.2+i*0.45,0.5),b=fin(t,bT-0.2+i*0.3,0.5);
      withA(ctx,a,()=>{ctx.strokeStyle=rgba(KT_AI,0.4);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(230,410);ctx.lineTo(380,y+66);ctx.stroke();
        glass(ctx,380,y,660,132,16,EDGE_,{glow:10,ea:0.7,fill:"rgba(7,12,24,0.95)"});T(ctx,"definition "+(i+1)+" · "+d.v,406,y+40,{w:700,size:19,color:rgba(SOFT,1)});T(ctx,d.f,406,y+92,{f:"mono",w:500,size:24});kt_flag(ctx,1010,y+34,1,fin(t,dT+0.4+i*0.45,0.4));});
      withA(ctx,b,()=>{arrowTo(ctx,1050,y+66,1150,y+66,EDGE_,0.8,{head:12});kt_dash(ctx,1170,y+4,300,124,{name:d.name,col:d.col,num:d.num});T(ctx,d.name,1500,y+60,{w:700,size:23,color:rgba(d.col,1)});T(ctx,"uses definition "+(i+1),1500,y+94,{w:600,size:19,color:rgba(SOFT,1)});});});
    // noticing: tedious for people, cheap for machines
    withA(ctx,fin(t,cN,0.6),()=>{const n=countTo(t,cN+0.2,0,12480)+(t>cN+1.2?(t-cN-1.2)*37:0);[[fmtNum(n),"queries read tonight"],["214","definitions compared"],["3","drifts flagged"]].forEach(([v,s],i)=>{const x=380+i*430;
      T(ctx,v,x,740,{w:800,size:40,color:rgba(KT_AI,1)});if(ph)T(ctx,s,x,784,{w:600,size:20,color:rgba(SOFT,1)});else T(ctx,s,x+tw(ctx,v,40,800)+14,738,{w:600,size:20,color:rgba(SOFT,1)});});});});
  vign(ctx,S);});

/* ---------- 5. AI as a drafter ---------- */
const KT_KEY=["glossary","ontology","logical","mapping","semantic","contract","tests","note"];
scene("draft",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const ax=380,ay=440,cC=c("cheap");kt_agent(ctx,ax,ay,84,t,{a:fin(t,0.2,0.6),label:"agent",busy:fin(t,c("drafts"),0.8)*(1-fin(t,c("list")+12,1))});
  kt_folder(ctx,900,150,880,660,{a:fin(t,c("drafts")+0.2,0.6),title:phMin(ctx)>0?"change package":"change package · draft",stamp:"draft",stampA:fin(t,cC+0.2,0.5)});
  KT_PKG.forEach((p,k)=>{const t0=kt_w(sc,"list",KT_KEY[k])-0.25,u=ease(clamp((t-t0)/0.8,0,1));if(u<=0)return;const sx=940+(k%2)*420,sy=222+Math.floor(k/2)*146,x=lerp(ax-60,sx,u),y=lerp(ay-40,sy,u)-Math.sin(u*Math.PI)*120;
    kt_pcard(ctx,x,y,lerp(160,400,u),lerp(60,126,u),k,{a:fin(u,0,0.25),hi:pulseAt(t,t0+0.8,1.0)});});
  // drafting is cheap now; judging the draft is still the job
  withA(ctx,fin(t,cC,0.6),()=>tag(ctx,ax,640,"drafting: cheap",KT_AI,{align:"center",size:24}));
  const jT=kt_w(sc,"cheap","Judging");withA(ctx,fin(t,jT,0.6),()=>{tag(ctx,ax,706,"judging: still the job",TRUST,{align:"center",size:24});
    const u=clamp((t-jT)/3.4,0,1),mx=lerp(1140,1560,0.5-0.5*Math.cos(u*Math.PI*2)),my=lerp(290,720,u);ctx.save();ctx.strokeStyle=rgba(TRUST,1);ctx.lineWidth=5;ctx.shadowColor=rgba(TRUST,0.9);ctx.shadowBlur=16;ctx.beginPath();ctx.arc(mx,my,62,0,TAU);ctx.stroke();ctx.lineWidth=10;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(mx+46,my+46);ctx.lineTo(mx+96,my+96);ctx.stroke();ctx.restore();glow(ctx,mx,my,70,TRUST,0.18);});
  vign(ctx,S);});

/* ---------- 6. People decide ---------- */
const KT_WHO=[["mei","the meaning","Mei · registrar's office",[0,1],"meaning"],["noor","the model","Noor · data architect",[2,3],"model"],["team","the build","the teams",[4,5,6],"build"]];
scene("decide",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),ph=phMin(ctx)>0;setScreen(ctx,S);bg2(ctx);
  const cR=c("review"),cU=c("rule"),wA=1-fin(t,cR-0.5,0.7),pA=fin(t,cR+0.2,0.6);
  // who approves what: the meaning, the model, the build
  withA(ctx,wA,()=>{KT_WHO.forEach(([id,what,who,ks,key],i)=>{const x=380+i*580,tk=kt_w(sc,"who",key),a=fin(t,0.3+i*0.3,0.6),on=fin(t,tk,0.5),col=mix(KT_AI,TRUST,on);
    withA(ctx,a,()=>{glass(ctx,x-250,170,500,ph?350:280,20,TRUST,{glow:10+14*on,ea:0.4+0.5*on,fill:"rgba(7,12,24,0.94)"});T(ctx,what,x-222,226,{w:800,size:32,color:rgba(TRUST,0.5+0.5*on)});T(ctx,who,x-222,262,{w:600,size:20,color:rgba(SOFT,1)});
      // on a phone each layer's name and what changes in it take a line each
      if(ph)ks.forEach((k,j)=>{const y=314+j*74;ctx.fillStyle=rgba(col,0.95);rr(ctx,x-222,y-20,10,52,3);ctx.fill();T(ctx,KT_PKG[k][0],x-202,y,{w:700,size:20,color:rgba(col,1)});T(ctx,KT_PKG[k][1],x-202,y+34,{w:600,size:20});});
      else ks.forEach((k,j)=>{const y=318+j*42;ctx.fillStyle=rgba(col,0.95);rr(ctx,x-222,y-15,10,18,3);ctx.fill();T(ctx,KT_PKG[k][0]+": ",x-202,y,{w:700,size:20,color:rgba(col,1)});T(ctx,KT_PKG[k][1],x-202+tw(ctx,KT_PKG[k][0]+": ",20,700),y,{w:600,size:20});});
      kt_gtick(ctx,x+204,216,22,on);
      if(id==="team"){person(ctx,"sam",x-70,870,0.5,{t});person(ctx,"ben",x+70,870,0.5,{t:t+1});}else person(ctx,id,x,870,0.52,{t,pose:t>tk-0.5&&t<tk+2.4?"explain":"stand",expr:on>0.5?"relieved":"calm"});});});});
  // the same review as anyone's, and tests on the proposed change, before anything ships
  withA(ctx,pA,()=>{const mT=kt_w(sc,"review","same review"),tT=kt_w(sc,"review","The tests"),sT=kt_w(sc,"review","ships"),u=ease(clamp((t-mT+0.6)/1.4,0,1)),Y=560;
    // the agent's proposal and Sam's arrive side by side, stacked, and stop just short of the same review
    const PR=[["#214 · from: the agent",KT_AI,Y-100],["#213 · from: Sam",TECH,Y+100]];
    PR.forEach(([s,col,y])=>{ctx.strokeStyle=rgba(col,0.4);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(250,y);ctx.bezierCurveTo(420,y,420,Y,560,Y);ctx.stroke();});
    glass(ctx,560,Y-90,280,180,18,TRUST,{glow:14,ea:0.8,fill:"rgba(7,12,24,0.95)"});
    const pe=ph?Math.min(430,548-(tw(ctx,PR[0][0],phMin(ctx),700)+36)/2):430;PR.forEach(([s,col,y],i)=>kt_prop(ctx,lerp(250,pe,u),lerp(y,Y,u)+(i?30:-30)*u,s,col,1));T(ctx,"review",700,Y-40,{w:800,size:28,align:"center",color:rgba(TRUST,1)});T(ctx,"by people",700,Y-8,{w:600,size:19,align:"center",color:rgba(SOFT,1)});
    ["mei","noor","sam"].forEach((id,i)=>{ctx.fillStyle=rgba(PEOPLE[id].edge,0.9);ctx.beginPath();ctx.arc(650+i*50,Y+40,12,0,TAU);ctx.fill();ctx.beginPath();ctx.arc(650+i*50,Y+70,18,Math.PI,0);ctx.fill();});
    withA(ctx,fin(t,mT,0.5),()=>tag(ctx,700,Y-128,"the same review as anyone's",TRUST,{align:"center",size:22}));
    arrowTo(ctx,850,Y,900,Y,SOFT,0.8,{head:12});
    glass(ctx,910,Y-150,ph?480:450,300,18,[170,205,255],{glow:10,ea:0.6,fill:"rgba(7,12,24,0.95)"});T(ctx,"tests, on the proposed change",934,Y-108,{w:700,size:21,color:rgba(SOFT,1)});
    ["allowed values","revoked not counted","one definition, one measure","2025 report unchanged"].forEach((s,i)=>{const on=fin(t,tT+0.5+i*0.6,0.3);const y=Y-54+i*54;ctx.fillStyle="rgba(10,16,30,0.95)";ctx.beginPath();ctx.arc(954,y-7,16,0,TAU);ctx.fill();ring(ctx,954,y-7,16,on>0.5?GOOD:SOFT,0.9,2);if(on>0)tick_(ctx,954,y-6,20,GOOD,on);T(ctx,s,984,y,{w:600,size:22,color:on>0.5?rgba(INK,1):rgba(SOFT,0.8)});});
    const sh=fin(t,sT+0.2,0.5);gate(ctx,1430,Y+5,190,sh>0.5?GOOD:[150,165,190],"tests");T(ctx,"ships",1430,Y+140,{w:700,size:21,align:"center",color:sh>0.5?rgba(GOOD,1):rgba(SOFT,0.8)});
    kt_versions(ctx,1520,Y,3,{p:2+fin(t,sT+0.4,0.6),sub:"completion rate v3"});});
  // the agent recommends; people approve; everything is versioned
  const rp=[["The agent recommends.",KT_AI,"recommends"],["People approve.",TRUST,"approve"],["Everything is versioned.",INK,"versioned"]];
  rp.forEach(([s,col,k],i)=>withA(ctx,fin(t,kt_w(sc,"rule",k)-0.5,0.5),()=>tag(ctx,[440,960,1480][i],230,s,col,{align:"center",size:30})));
  withA(ctx,fin(t,kt_w(sc,"rule","versioned")-0.2,0.5),()=>{glow(ctx,1650,530,160,TRUST,0.15+0.1*Math.sin(t*3));});
  vign(ctx,S);});

/* ---------- 7. What can go wrong ---------- */
scene("wrong",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const cS=c("slip"),cK=c("check"),GX=1360,GY=470,stop=fin(t,cK+0.3,0.5),oursT=kt_w(sc,"check","just as");
  // Sam's change, later, passes the same gate: it turns green while the change goes through
  const su=ease(clamp((t-oursT)/1.8,0,1)),sx=lerp(1060,1620,su),pass=t>oursT?clamp(1-Math.abs(sx-GX)/140,0,1):0,gc=mix(BAD,GOOD,pass);
  // the gate: the contract and the tests, in front of the dashboards
  gate(ctx,GX,GY,440,stop>0.5?gc:[170,205,255],"tests");withA(ctx,0.6+0.4*stop,()=>T(ctx,"contract · tests",GX,730,{w:800,size:22,align:"center",color:stop>0.5?rgba(gc,1):rgba(SOFT,1)}));
  kt_dash(ctx,1540,112,300,190,{name:"Dashboards",col:KT_PLAN,num:"71%"});T(ctx,"unchanged",1690,346,{w:600,size:18,align:"center",color:rgba(SOFT,1)});
  const lane=(y,col,a,dash,x0)=>withA(ctx,a,()=>{x0=x0||760;ctx.save();if(dash)ctx.setLineDash([12,10]);ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x0,y);ctx.bezierCurveTo(Math.max(x0+120,1000),y,1100,GY+(y-GY)*0.3,lerp(760,GX-40,1),GY+(y-GY)*0.3);ctx.stroke();ctx.restore();});
  // each proposal is stopped by a check it breaks, named beside its cross
  const stopAt=(y,a,why)=>withA(ctx,a,()=>{const yy=GY+(y-GY)*0.3;kt_rcross(ctx,GX-70,yy,24,1);tag(ctx,GX+50,yy,why,BAD,{size:18});});
  // a confident draft that invents a definition nobody agreed
  const iA=fin(t,0.3,0.6),nT=kt_w(sc,"invent","nobody");withA(ctx,iA,()=>{kt_agent(ctx,90,220,40,t,{busy:0.3});glass(ctx,150,120,600,220,18,KT_AI,{glow:20,ea:0.9,fill:"rgba(6,16,20,0.96)"});T(ctx,"draft · glossary",176,158,{w:700,size:19,color:rgba(KT_AI,1)});tag(ctx,650,152,"confident",KT_AI,{align:"center",size:18});
    T(ctx,"completion rate =",176,206,{w:800,size:28});T(ctx,"passed ÷ enrolled on day one",176,250,{f:"mono",w:500,size:24});kt_rstamp(ctx,560,300,"nobody agreed",EDGE_,1,fin(t,nT,0.35),{size:26,rot:-0.05});
    lane(225,KT_AI,fin(t,cS-0.4,0.6),false);});
  // a change that slips through, unreviewed, on a red dashed path
  const sA=fin(t,cS,0.6);withA(ctx,sA,()=>{glass(ctx,760,370,200,70,14,TRUST,{glow:8,ea:0.5,fill:"rgba(7,12,24,0.9)"});T(ctx,"review",860,414,{w:700,size:20,align:"center",color:rgba(TRUST,0.7)});
    ctx.save();ctx.setLineDash([12,10]);ctx.strokeStyle=rgba(BAD,0.85);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(300,480);ctx.lineTo(700,480);ctx.bezierCurveTo(800,480,800,500,1000,490);ctx.lineTo(GX-40,GY);ctx.stroke();ctx.restore();
    const u=ease(clamp((t-cS-0.4)/3.4,0,1)),pw=phMin(ctx)>0?tw(ctx,"change #219",phMin(ctx),700)+36:136,px=lerp(300,GX-150-(pw-136)/2,u);kt_prop(ctx,px,480+(px>800?4:0),"change #219",BAD,1,{dash:true});T(ctx,"not reviewed",860,530,{w:700,size:19,align:"center",color:rgba(BAD,1)});});
  // an agent that learns from old reports proposes an old meaning back
  const gT=kt_w(sc,"slip","And an agent"),hA=fin(t,gT-0.3,0.6);withA(ctx,hA,()=>{[2,1,0].forEach(k=>kt_report(ctx,140+k*18,610-k*14,phMin(ctx)>0?300:260,{h:200,t,seed:k+11,curl:k?0:1,title:"Report "+[2019,2020,2021][k],rows:[["completion","58%"]],rot:-0.02+k*0.01}));
    const u=ease(clamp((t-gT)/2.2,0,1)),gx=lerp(300,500,u),gy=lerp(700,690,u),wob=Math.sin(t*3)*4;withA(ctx,0.35+0.35*u,()=>{glass(ctx,gx,gy-60+wob,380,120,16,[200,210,230],{glow:22,ea:0.6,fill:"rgba(12,16,28,0.6)"});T(ctx,"completion rate (v1)",gx+22,gy-24+wob,{w:700,size:19,color:rgba(SOFT,1)});T(ctx,"finished ÷ logged in",gx+22,gy+18+wob,{f:"mono",w:500,size:21});});
    withA(ctx,fin(t,kt_w(sc,"slip","old meaning"),0.6),()=>tag(ctx,gx+190,gy+86,"an old meaning, proposed back",[200,210,230],{align:"center",size:18}));lane(700,[200,210,230],fin(t,gT+1.6,0.6),true,gx+390);});
  // the tests and the contracts check the agent's work too, just as they check ours
  if(stop>0){glow(ctx,GX,GY,200,gc,0.2*stop);stopAt(225,fin(t,cK+0.3,0.4),"fails: one definition, one measure");stopAt(480,fin(t,cK+0.6,0.4),"fails: revoked not counted");stopAt(700,fin(t,cK+0.9,0.4),"fails: 2025 report unchanged");withA(ctx,stop,()=>tag(ctx,GX,196,"stopped",BAD,{align:"center",size:20}));}
  withA(ctx,fin(t,oursT,0.5),()=>{const y=lerp(560,640,su);kt_prop(ctx,sx,y,"from: Sam",TECH,1);if(su>0.99)kt_gtick(ctx,1620+80,640,16,fin(t,oursT+1.8,0.4));
    tag(ctx,1100,800,"everyone's work, the same checks",TRUST,{align:"center",size:20});});
  vign(ctx,S);});

/* ---------- 8. End to end ---------- */
// what changes in the layers the voice names: [layer, heading, line]. The logical model and the shapes for writing and reading
// light in passing, between the ontology and the semantic layer, without a card of their own: the voice doesn't stop on them
const KT_DETAIL=[[0,"Glossary · completion rate v3","completed ÷ enrolled at census date; revoked excluded"],[1,"Ontology","a revoked credential is not a completion"],
  [4,"Semantic layer","completion_rate = completed / enrolled_at_census"],[5,"Contract · test","outcome has 3 values · revoked never counted"]];
scene("e2e",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),B=c("breath"),ph=phMin(ctx)>0,CX=ph?40:90,CW=ph?1840:1740,CG=ph?8:16;setScreen(ctx,S);bg2(ctx);
  const cA=c("agree"),cO=c("old"),cV=c("v3"),oT=kt_w(sc,"chain","one statement"),mT=kt_w(sc,"chain","one measure")-0.1,T6=[kt_w(sc,"chain","one definition")-0.1,oT-0.1,oT+1.2,oT+1.55,mT,kt_w(sc,"chain","one test")-0.1,cA+0.2],DT=[T6[0],T6[1],T6[4],T6[5]];
  let lit=0;T6.forEach(q=>{lit+=fin(t,q,0.5);});
  withA(ctx,fin(t,0.3,0.6),()=>tag(ctx,960,100,"one change, end to end",TRUST,{align:"center",size:24}));
  const cb=150+(kt_chain(ctx,CX,150,CW,{lit,h:120,ticks:true,gap:CG})||120);
  if(t>B){const u=((t-B)/2.4)%1;glow(ctx,90+1740*u,210,90,TRUST,0.4*Math.sin(Math.PI*u));}
  // under each layer as it lights: what changes in it
  const dA=fin(t,T6[0],0.5)*(1-fin(t,cA-0.5,0.6));if(dA>0){const d=Math.max(0,DT.filter(q=>t>=q).length-1),[k,h1,l1]=KT_DETAIL[d],nx=CX+k*(CW+CG)/7+(CW-6*CG)/14,x=clamp(nx-330,90,1830-660);
    withA(ctx,dA,()=>{ctx.strokeStyle=rgba(TRUST,0.6);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(nx,cb+2);ctx.lineTo(nx,360);ctx.stroke();glass(ctx,x,360,660,150,18,TRUST,{glow:16,ea:0.85,fill:"rgba(7,12,24,0.95)"});
      T(ctx,h1,x+28,408,{w:700,size:20,color:rgba(TRUST,1)});wrapT(ctx,l1,x+28,452,604,{f:"mono",w:500,size:21});});}
  // the three dashboards agree; Genie gives the same number, and shows why
  const gA=fin(t,cA-0.3,0.6)*(1-fin(t,cO-0.5,0.6));withA(ctx,gA,()=>{const sw=fin(t,cA+0.6,0.6);KT_DASH.forEach((d,i)=>kt_dash(ctx,110+i*370,380,340,220,{name:d.name,col:d.col,num:sw>0.5?"71%":d.num,hi:pulseAt(t,cA+0.6+i*0.2,1.2),formula:"completion_rate · v3",fA:sw}));
    withA(ctx,fin(t,cA+0.8,0.6),()=>tag(ctx,650,660,"three dashboards, one number",TRUST,{align:"center",size:22}));
    const gT=kt_w(sc,"agree","Genie");withA(ctx,fin(t,gT-0.2,0.6),()=>{orb(ctx,1290,470,38,t);T(ctx,"Genie",1290,560,{w:700,size:18,align:"center",color:rgba([255,226,160],1)});
      bubble(ctx,1360,330,470,"71% of microcredential learners completed.",[255,226,160],{size:22});
      withA(ctx,fin(t,kt_w(sc,"agree","shows why"),0.5),()=>{glass(ctx,1360,480,530,ph?176:136,14,TRUST,{glow:12,ea:0.7,fill:"rgba(7,12,24,0.95)"});T(ctx,"why: completion rate v3",1384,518,{w:700,size:20,color:rgba(TRUST,1)});
        const fl=wrapT(ctx,"completed ÷ enrolled at census date",1384,556,482,{f:"mono",w:500,size:ph?Math.max(18,phMin(ctx)):18,lh:ph?34:24}).length;T(ctx,"from the semantic layer",1384,556+(ph?fl*34:38),{w:600,size:18,color:rgba(SOFT,1)});});});});
  // last year's report still reads with last year's definition
  const oA=fin(t,cO-0.3,0.6)*(1-fin(t,cV-0.5,0.6));withA(ctx,oA,()=>{kt_report(ctx,180,360,520,{h:330,t,stamp:"read with v2",stampA:fin(t,kt_w(sc,"old","version two")-0.3,0.5)});
    [["completion rate · v2 · 2025","completed ÷ all who started",SOFT,380,"version two"],["completion rate · v3 · 2026","completed ÷ enrolled at census date",TRUST,560,"Each number"]].forEach(([h1,f,col,y,k],i)=>withA(ctx,fin(t,kt_w(sc,"old",k)-0.3,0.6),()=>{
      const gx=ph?860:880,gw=ph?660:600;glass(ctx,gx,y,gw,140,16,col,{glow:12,ea:0.8,fill:"rgba(7,12,24,0.95)"});T(ctx,h1,gx+26,y+44,{w:700,size:19,color:rgba(col,1)});T(ctx,f,gx+26,y+96,{f:"mono",w:500,size:22});
      arrowTo(ctx,i?1640:720,i?y+70:y+120,i?gx+gw+20:gx-10,y+70,col,0.8,{head:12,bend:i?0:0.1});}));
    withA(ctx,fin(t,kt_w(sc,"old","Each number")-0.1,0.6),()=>{kt_dash(ctx,1650,570,210,140,{name:"This year",col:TRUST,num:"71%"});tag(ctx,1180,770,"each number keeps the meaning it had",TRUST,{align:"center",size:22});});});
  // and the sketch's stamp finally reads v3
  const vA=fin(t,cV-0.4,0.6);withA(ctx,vA,()=>{const sT=kt_w(sc,"v3","version three")-0.2,on=fin(t,sT,0.4);if(on>0)glow(ctx,960,560,420,TRUST,0.12*on);
    kt_board(ctx,440,340,1040,420,t,{s:ph?0.95:0.78,edge:mix(SK,TRUST,on*0.6)});
    ctx.save();ctx.translate(1462,386);ctx.scale(1.7,1.7);if(on>0)glow(ctx,-80,0,90,TRUST,0.35*on*(0.7+0.3*Math.sin(t*3)));stamp(ctx,0,0,on>0.5?"sketch v3":"sketch v3 · draft",on>0.5?TRUST:[200,170,120],1,t>sT&&t<sT+0.8?t-sT:0);ctx.restore();
    withA(ctx,fin(t,sT+0.8,0.6),()=>{T(ctx,"approved: Mei, Noor and the teams",960,800,{w:700,size:22,align:"center",color:rgba(TRUST,1)});[0,1,2].forEach(i=>kt_gtick(ctx,1300+i*52,450,18,fin(t,sT+0.4+i*0.2,0.3)));});});
  vign(ctx,S);});

/* ---------- 9. What remains ---------- */
scene("remains",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),ph=phMin(ctx)>0;setScreen(ctx,S);bg2(ctx);
  const cS=c("same"),cC=c("change"),cA=c("alike"),cL=c("last"),FW4=["What a","What makes","What one","when each"],LW4=["meaning","identity","grain","time"];
  // the patterns arrive one by one as they're named, then a dashed card for the next one; later they shrink to a row above the rest
  const sh=ease(fin(t,cC-0.2,1.2)),rs=lerp(1,0.62,sh),ry=lerp(190,96,sh),ra=1-0.45*fin(t,cC,0.8)+0.45*fin(t,cL,0.8);
  const four=j=>Math.max(fin(t,kt_w(sc,"four",FW4[j])-0.1,0.5),fin(t,kt_w(sc,"last",LW4[j])-0.2,0.5));
  // once the row has shrunk it's a reminder above the rest, drawn as a picture
  withA(ctx,ra,()=>phAsDeco(ph&&rs<0.97,()=>{ctx.save();ctx.translate(960,ry);ctx.scale(rs,rs);const cw=ph?262:250;
    for(let k=0;k<6;k++){const x=-815+k*276,ta=k<5?kt_w(sc,"shapes",KT_PAT[k][3])-0.25:kt_w(sc,"shapes","More")-0.2,u=ease(fin(t,ta,0.6));
      kt_patCard(ctx,k<5?k:-1,x-(cw-250)/2,(1-u)*40,cw,300,t,{a:u,hi:pulseAt(t,ta+0.4,0.9),four:k<5?[0,1,2,3].map(four):null});}
    ctx.restore();}));
  withA(ctx,fin(t,0.3,0.6)*(1-fin(t,cS-0.2,0.6)),()=>T(ctx,"new shapes keep arriving",960,600,{w:700,size:28,align:"center",color:rgba(INK,0.85)}));
  // the same four answers, inside every one
  withA(ctx,1-fin(t,cC-0.3,0.6),()=>KT_FOUR.forEach(([n,sub,col],j)=>{const a=fin(t,kt_w(sc,"four",FW4[j])-0.1,0.5),x=960+(j-1.5)*410;if(a<=0.01)return;
    withA(ctx,a,()=>{glass(ctx,x-185,560,370,ph?150:120,18,col,{glow:14,ea:0.8,fill:"rgba(7,12,24,0.93)"});kt_four(ctx,j,x-128,ph?635:620,26,1);T(ctx,n,x-86,ph?606:612,{w:800,size:28,color:rgba(col,1)});
      if(ph)wrapT(ctx,sub,x-86,644,255,{w:600,size:Math.max(17,phMin(ctx)),lh:32,color:rgba(SOFT,1)});else T(ctx,sub,x-86,642,{w:600,size:17,color:rgba(SOFT,1)});});}));
  withA(ctx,fin(t,kt_w(sc,"same","the same four"),0.6)*(1-fin(t,cC-0.3,0.6)),()=>T(ctx,"the same four answers, in every shape",960,760,{w:700,size:24,align:"center",color:rgba(INK,0.9)}));
  // what changes is the shape: the agent drafts a vault and a star from the model
  withA(ctx,fin(t,cC+0.4,0.7)*(1-fin(t,cA-0.4,0.6)),()=>{const eT=kt_w(sc,"change","Engines"),dT=kt_w(sc,"change","draft");
    withA(ctx,fin(t,eT-0.2,0.5),()=>tag(ctx,960,370,"the shape changes · engines change",SOFT,{align:"center",size:22}));
    phAsDeco(ph,()=>kt_board(ctx,130,440,560,320,t,{s:0.42,label:ph?null:"the model",stamp:"sketch v3",stampCol:TRUST}));if(ph)tag(ctx,154,440,"the model",SK,{size:17});
    kt_agent(ctx,960,600,56,t,{busy:fin(t,dT,0.6)});arrowTo(ctx,700,600,890,600,KT_AI,0.8*fin(t,dT-0.3,0.5),{p:fin(t,dT-0.3,0.6)});
    [0,"star"].forEach((k,i)=>{const t0=dT+0.5+i*0.5,u=ease(fin(t,t0,0.8));if(u<=0)return;const tx=1170+i*330,x=lerp(930,tx,u),y=lerp(560,440,u);
      kt_patCard(ctx,k,x,y,lerp(60,290,u),lerp(60,320,u),t,{a:fin(u,0,0.3),gs:u});withA(ctx,fin(t,t0+0.8,0.4),()=>stamp(ctx,tx+250,y+352,"draft",KT_AI,1,0));});
    withA(ctx,fin(t,kt_w(sc,"change","in minutes")-0.2,0.5),()=>tag(ctx,960,700,"drafted in minutes",KT_AI,{align:"center",size:22}));});
  // two credentials that look alike; only the model says they aren't the same one
  withA(ctx,fin(t,cA-0.1,0.6)*(1-fin(t,cL-0.4,0.6)),()=>{const oT=kt_w(sc,"alike","Only the model"),hl=fin(t,oT,0.6);
    [["C-88","Aisha K."],["C-91","Aisha R."]].forEach(([id,who],i)=>{const x=i?1070:290;T(ctx,"id "+id,x+280,420,{f:"mono",w:500,size:22,align:"center",color:rgba(mix(SOFT,TRUST,hl),1)});
      credCard(ctx,x,440,560,{era:"digital",issuer:"the university",holder:who,claim:"Microcredential, Data Visualisation",date:"June 2026",h:250,rh:44,hl:{holder:hl}});});
    withA(ctx,fin(t,cA+0.6,0.6),()=>{ctx.save();ctx.setLineDash([8,8]);ctx.strokeStyle=rgba(KT_AI,0.8);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(860,565);ctx.lineTo(1060,565);ctx.stroke();ctx.restore();tag(ctx,960,370,"search: looks alike · 97%",KT_AI,{align:"center",size:22});});
    withA(ctx,hl,()=>{kt_rcross(ctx,960,565,22,1);tag(ctx,960,760,"the model: two credentials, not one",TRUST,{align:"center",size:24});});});
  // what lasts: meaning, identity, grain, time; every shape is another way to write them down
  withA(ctx,fin(t,cL-0.2,0.6),()=>T(ctx,"the part that lasts",960,390,{w:800,size:30,align:"center",color:rgba(TRUST,0.95)}));
  withA(ctx,fin(t,cL,0.6),()=>{KT_FOUR.forEach(([n,sub,col],j)=>{const a=fin(t,kt_w(sc,"last",LW4[j])-0.2,0.5),x=960+(j-1.5)*420;if(a<=0.01)return;
      withA(ctx,a,()=>{glass(ctx,x-190,430,380,250,22,col,{glow:18,ea:0.85,fill:"rgba(7,12,24,0.94)"});kt_four(ctx,j,x,500,34,1);T(ctx,n,x,590,{w:800,size:34,align:"center",color:rgba(col,1)});if(ph)wrapT(ctx,sub,x,630,340,{w:600,size:Math.max(18,phMin(ctx)),lh:32,align:"center",color:rgba(SOFT,1)});else T(ctx,sub,x,630,{w:600,size:18,align:"center",color:rgba(SOFT,1)});
        ctx.save();ctx.strokeStyle=rgba(col,0.35*fin(t,kt_w(sc,"last","Every new")-0.2,0.8));ctx.lineWidth=1.5;ctx.setLineDash([4,6]);for(let k=0;k<5;k++){const tx=960+(-815+k*276+125)*0.62;ctx.beginPath();ctx.moveTo(tx+(j-1.5)*30*0.62,96+(300-38)*0.62);ctx.lineTo(x,430);ctx.stroke();}ctx.restore();});});
    withA(ctx,fin(t,kt_w(sc,"last","Every new")-0.2,0.6),()=>tag(ctx,960,760,"every shape: another way to write them down",TRUST,{align:"center",size:24}));});
  vign(ctx,S);});

/* ---------- 10. Pull back ---------- */
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),B=c("breath");histBg(ctx,S,t,{light:0.12});
  const cC=c("claim"),cJ=c("job"),sA=1-fin(t,cC-0.5,0.7),mA=fin(t,cC-0.3,0.7)*(1-fin(t,cJ-0.5,0.7)),jA=fin(t,cJ-0.3,0.7);
  // back to the start: a word, an idea, a thing, and a mark in clay
  withA(ctx,sA,()=>{const wT=kt_w(sc,"start","a word"),iT=kt_w(sc,"start","an idea"),hT=kt_w(sc,"start","a thing"),mT=kt_w(sc,"start","a mark");
    trio(ctx,640,440,0.85,{t,word:"credential",idea:"a trusted, checkable claim",thing:(cx,x,y,s)=>kt_diploma(cx,x-90,y-96,180,150,t,{title:"Diploma"}),thingLab:"a credential",thingDy:92,
      a:fin(t,0.2,0.8),wa:0.55+0.45*fin(t,wT-0.2,0.5),ia:0.55+0.45*fin(t,iT-0.2,0.5),ha:0.55+0.45*fin(t,hT-0.2,0.5),e1:fin(t,0.4,1.2),e2:fin(t,0.8,1.2),e3:0});
    withA(ctx,fin(t,mT-0.3,0.6),()=>{yearTag(ctx,1200,250,"c. 3300 BCE · Uruk",CLAY,1);kt_tablet(ctx,1200,300,520,300,clamp((t-mT+0.2)/2,0,1),1,t);});
    withA(ctx,fin(t,0.3,0.6),()=>T(ctx,"What's in a word",640,150,{w:700,size:22,align:"center",color:rgba(KIND,0.9)}));});
  // a credential is a claim that others can check; so is every number in a report
  withA(ctx,mA,()=>{const nT=kt_w(sc,"claim","So is"),hl=fin(t,nT+0.6,0.6);
    withA(ctx,fin(t,cC,0.6),()=>{T(ctx,"a credential",540,158,{w:700,size:24,align:"center",color:rgba(TRUST,0.95)});credCard(ctx,240,190,600,{era:"digital",issuer:"the university",holder:"Aisha K.",claim:"Microcredential, Data Visualisation",evidence:"project, assessed",date:"2026",h:300,rh:48,hl:{issuer:hl,claim:hl,evidence:hl}});});
    withA(ctx,fin(t,nT-0.2,0.6),()=>{T(ctx,"a number in a report",1380,158,{w:700,size:24,align:"center",color:rgba(TRUST,0.95)});credCard(ctx,1080,190,600,{era:"digital",issuer:"the university",claim:"completion rate, 71%",evidence:"definition v3 · tests",date:"2026 report",h:300,rh:48,hl:{issuer:hl,claim:hl,evidence:hl}});});
    withA(ctx,fin(t,nT+1.0,0.6),()=>tag(ctx,960,620,"a claim that others can check",TRUST,{align:"center",size:28}));});
  // the tools have changed; the job hasn't
  withA(ctx,jA,()=>{const hT=kt_w(sc,"job","The job"),X=[400,960,1520],ph=[["agree what things are","agree"],["write it down","write"],["keep it true","keep"]];
    const tools=[(x,y)=>kt_tablet(ctx,x-70,y-40,140,84,1,1,t),(x,y)=>waxSeal(ctx,x,y,34,WAX,1,1),(x,y)=>kt_diploma(ctx,x-60,y-46,120,92,t,{title:"Diploma"}),(x,y)=>credCard(ctx,x-70,y-48,140,{era:"digital",h:96}),(x,y)=>kt_agent(ctx,x,y,34,t)];
    tools.forEach((f,i)=>withA(ctx,fin(t,cJ+0.1+i*0.3,0.4)*(1-0.55*fin(t,hT,0.6)),()=>phAsDeco(true,()=>f(560+i*200,230))));
    ph.forEach(([s,k],i)=>{const a=fin(t,kt_w(sc,"job",k)-0.2,0.5),x=X[i];withA(ctx,a,()=>{glass(ctx,x-240,400,480,230,22,TRUST,{glow:16,ea:0.85,fill:"rgba(20,14,8,0.92)"});T(ctx,s,x,590,{w:800,size:30,align:"center",color:rgba(TRUST,1)});
      if(i===0){const P=[[x-70,530],[x,440],[x+70,530]];ctx.strokeStyle=rgba(KIND,0.9);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(P[0][0],P[0][1]);ctx.lineTo(P[1][0],P[1][1]);ctx.lineTo(P[2][0],P[2][1]);ctx.stroke();
        ctx.save();ctx.setLineDash([6,7]);ctx.strokeStyle=rgba(EDGE_,0.7);ctx.beginPath();ctx.moveTo(P[0][0]+14,P[0][1]);ctx.lineTo(P[2][0]-14,P[2][1]);ctx.stroke();ctx.restore();P.forEach(([px,py])=>{glow(ctx,px,py,22,KIND,0.5);ctx.fillStyle=rgba(mix(KIND,[255,255,255],0.5),1);ctx.beginPath();ctx.arc(px,py,9,0,TAU);ctx.fill();});}
      if(i===1)phAsDeco(true,()=>{ctx.save();ctx.translate(x,483);ctx.rotate(-0.03);kt_paper(ctx,-90,-55,180,110,t,{seed:7});ctx.restore();pencilText(ctx,"completion rate:",x-70,470,{size:16});pencilText(ctx,"completed ÷ …",x-70,500,{size:16});});
      if(i===2){stamp(ctx,x+40,480,"v3",TRUST,1,0);kt_agent(ctx,x-80,478,26,t);kt_gtick(ctx,x+90,478,16,1);}});});});
  endCard(ctx,S,t,B+0.3,"Keeping it true",KT_AI,"Agree what things are, write it down, and keep it true.");
  vign(ctx,S);});
