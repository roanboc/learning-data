/* ===== Keeping it true: the film's own pictures =====
   The meaning is written down end to end, then the world changes again. An AI agent watches and drafts, in teal: a geometric orb,
   unlike Genie's round one. A person's approval is gold (TRUST). Drift, the gap between what's written and what's used, is red (EDGE_).
   The past (Johnson's dictionary, the planets, the kilogram) is drawn warm, with the series' histBg; the present is the films' dark glass.
   The labs and the scenarios draw with these too (LV, at the end). */
const KT_AI=[130,230,215],KT_BLUE=[60,110,210],KT_PLAN=[120,190,255];
// the three dashboards that each count completion rate their own way, and the numbers they show
const KT_DASH=[{name:"Short courses",col:OFFICE.short.c,num:"71%",f:"completed ÷ enrolled at census",v:"their own"},
  {name:"Planning",col:KT_PLAN,num:"64%",f:"completed ÷ all who started",v:"glossary v2"},
  {name:"Learning platform",col:OFFICE.lms.c,num:"58%",f:"finished all modules ÷ logged in",v:"v1, 2019"}];
// the change package the agent drafts: the layer, and one line of what changes in it
const KT_PKG=[["Glossary","completion rate v3","completed ÷ enrolled at census"],["Ontology","revoked is not completed","a statement"],["Logical model","Enrolment + outcome","an attribute"],
  ["Mapping","outcome → gov. field","MC_OUTCOME"],["Semantic layer","completion_rate","one measure"],["Contract","outcome: 3 values","completed · withdrawn · enrolled"],
  ["Tests","revoked not counted","and 2025 unchanged"],["Change note","why","new field · 3 formulas"]];
// one change, end to end: each layer, and what it says about completion rate
const KT_CHAIN=[["Glossary","one definition"],["Ontology","one statement"],["Logical model","Enrolment.outcome"],["Write · read","both shapes"],["Semantic layer","one measure"],["Contract · test","one test"],["Dashboards · Genie","one number"]];

// when a word of a line is spoken: estimated along the line's voiced length, from the words the voice reads
function kt_w(sc,id,word,off){const ln=sc.vo.find(v=>v.id===id);if(!ln)return 0;const s=ln.say||ln.text,i=s.indexOf(word),d=sc.ends[id]-sc.cues[id];return sc.cues[id]+(i<0?0:d*i/s.length)+(off||0);}
const kt_out=(t,a,d)=>1-sstep(a,a+(d||0.6),t);

/* ---------- the agent: a teal, geometric orb (an icosahedron turning inside a hexagon) ---------- */
const KT_ICO=(()=>{const f=(1+Math.sqrt(5))/2,v=[];for(const a of[1,-1])for(const b of[1,-1])v.push([0,a,b*f],[a,b*f,0],[b*f,0,a]);
  const n=Math.hypot(1,f),V=v.map(p=>p.map(q=>q/n)),E=[];for(let i=0;i<12;i++)for(let j=i+1;j<12;j++){const d=Math.hypot(v[i][0]-v[j][0],v[i][1]-v[j][1],v[i][2]-v[j][2]);if(Math.abs(d-2)<0.01)E.push([i,j]);}return{V,E};})();
function kt_agent(ctx,x,y,r,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const busy=o.busy||0;
  withA(ctx,a,()=>{glow(ctx,x,y,r*2.4+Math.sin(t*1.7)*5,KT_AI,0.3+0.2*busy);
    ctx.save();ctx.strokeStyle=rgba(KT_AI,0.4);ctx.lineWidth=1.6;ctx.beginPath();for(let i=0;i<=6;i++){const an=i/6*TAU+t*0.15;ctx.lineTo(x+Math.cos(an)*r*1.45,y+Math.sin(an)*r*1.45);}ctx.stroke();
    for(let i=0;i<6;i++){const an=i/6*TAU+t*0.15;ctx.fillStyle=rgba(KT_AI,0.8);ctx.fillRect(x+Math.cos(an)*r*1.45-3,y+Math.sin(an)*r*1.45-3,6,6);}
    const ay=t*(0.45+busy*1.4)+(o.spin||0),ax=0.5,ca=Math.cos(ay),sa=Math.sin(ay),cb=Math.cos(ax),sb=Math.sin(ax);
    const P=KT_ICO.V.map(([px,py,pz])=>{const X=px*ca+pz*sa,Z0=-px*sa+pz*ca;return[x+X*r,y+(py*cb-Z0*sb)*r,py*sb+Z0*cb];});
    const g=ctx.createRadialGradient(x-r*0.35,y-r*0.35,r*0.1,x,y,r);g.addColorStop(0,rgba(mix(KT_AI,[255,255,255],0.55),0.45));g.addColorStop(1,rgba(KT_AI,0.05));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r*0.98,0,TAU);ctx.fill();
    ctx.lineCap="round";ctx.shadowColor=rgba(KT_AI,0.8);ctx.shadowBlur=8;
    KT_ICO.E.map(e=>[e,(P[e[0]][2]+P[e[1]][2])/2]).sort((p,q)=>p[1]-q[1]).forEach(([[i,j],z])=>{const k=(z+1)/2;ctx.strokeStyle=rgba(mix(KT_AI,[255,255,255],0.3*k),0.22+0.72*k);ctx.lineWidth=(1+1.8*k)*Math.max(0.6,r/60);ctx.beginPath();ctx.moveTo(P[i][0],P[i][1]);ctx.lineTo(P[j][0],P[j][1]);ctx.stroke();});
    ctx.shadowBlur=0;P.forEach(p=>{const k=(p[2]+1)/2;ctx.fillStyle=rgba(mix(KT_AI,[255,255,255],0.5),0.3+0.7*k);ctx.beginPath();ctx.arc(p[0],p[1],(1.5+2.5*k)*Math.max(0.6,r/60),0,TAU);ctx.fill();});
    ctx.fillStyle=rgba(mix(KT_AI,[255,255,255],0.75),0.95);ctx.beginPath();ctx.arc(x,y,r*0.14*(1+0.2*Math.sin(t*3.1)),0,TAU);ctx.fill();ctx.restore();
    if(o.label)withA(ctx,o.labelA==null?1:o.labelA,()=>tag(ctx,x,y+r*1.45+34,o.label,KT_AI,{align:"center",size:18}));});}
// the agent reading something: a soft cone of light from the orb to its target, with a line sweeping across it
function kt_scan(ctx,x0,y0,x1,y1,a,t,o){if(a<=0.01)return;o=o||{};const an=Math.atan2(y1-y0,x1-x0),w=o.w||60,nx=Math.cos(an+Math.PI/2),ny=Math.sin(an+Math.PI/2);
  ctx.save();ctx.globalAlpha*=a;const g=ctx.createLinearGradient(x0,y0,x1,y1);g.addColorStop(0,rgba(KT_AI,0.28));g.addColorStop(1,rgba(KT_AI,0.05));ctx.fillStyle=g;
  ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1+nx*w,y1+ny*w);ctx.lineTo(x1-nx*w,y1-ny*w);ctx.closePath();ctx.fill();
  const sw=Math.sin(t*2.4+(o.ph||0))*w*0.85;ctx.strokeStyle=rgba(KT_AI,0.85);ctx.lineWidth=2;ctx.shadowColor=rgba(KT_AI,0.9);ctx.shadowBlur=8;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1+nx*sw,y1+ny*sw);ctx.stroke();ctx.restore();}
// a small flag: the agent's mark on something that has drifted
function kt_flag(ctx,x,y,s,a){withA(ctx,a,()=>{ctx.strokeStyle=rgba(KT_AI,1);ctx.lineWidth=3*s;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x,y+18*s);ctx.lineTo(x,y-20*s);ctx.stroke();
  ctx.fillStyle=rgba(KT_AI,0.95);ctx.shadowColor=rgba(KT_AI,0.9);ctx.shadowBlur=10;ctx.beginPath();ctx.moveTo(x,y-20*s);ctx.lineTo(x+24*s,y-12*s);ctx.lineTo(x,y-3*s);ctx.closePath();ctx.fill();ctx.shadowBlur=0;});}
// a gold tick in a ring: a person's approval
function kt_gtick(ctx,x,y,r,a){withA(ctx,a,()=>{glow(ctx,x,y,r*2.2,TRUST,0.35);ctx.fillStyle="rgba(26,20,8,0.95)";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ring(ctx,x,y,r,TRUST,1,2.5);tick_(ctx,x,y+1,r*1.25,TRUST,1);});}
function kt_rcross(ctx,x,y,r,a){withA(ctx,a,()=>{glow(ctx,x,y,r*2.2,BAD,0.3);ctx.fillStyle="rgba(30,8,10,0.95)";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ring(ctx,x,y,r,BAD,1,2.5);cross_(ctx,x,y,r*1.2,BAD,1);});}
// a rubber stamp, pressed at an angle: press (0..1) brings it down from above
function kt_rstamp(ctx,x,y,s,col,a,press,o){if(a<=0.01)return;o=o||{};const sz=o.size||30,w=tw(ctx,s,sz,800)+40,h=sz+30,pr=ease(clamp(press==null?1:press,0,1));
  withA(ctx,a*pr,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(o.rot==null?-0.12:o.rot);ctx.scale(1.5-0.5*pr,1.5-0.5*pr);ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=4;ctx.shadowColor=rgba(col,0.7);ctx.shadowBlur=10;rr(ctx,-w/2,-h/2,w,h,8);ctx.stroke();
    ctx.lineWidth=1.5;rr(ctx,-w/2+6,-h/2+6,w-12,h-12,5);ctx.stroke();ctx.shadowBlur=0;T(ctx,s,0,sz*0.36,{w:800,size:sz,align:"center",color:rgba(col,1)});ctx.restore();});}

/* ---------- the past: Johnson's dictionary, the OED, the planets, the kilogram ---------- */
const KT_WORDS=[["CREDENTIAL",3],["CREDIT",2],["DEGREE",3],["DIPLOMA",3],["ENROL",2],["NICE",4]];
// a heavy book: closed (a leather cover, gilt, with the page edges showing its weight), or open on two pages of entries
function kt_book(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a,op=clamp(o.open||0,0,1);if(a<=0.01)return;
  withA(ctx,a,()=>{
    if(op<1)withA(ctx,1-op,()=>{const bw=w*0.5,bx=x+w*0.25;ctx.save();ctx.shadowColor="rgba(0,0,0,0.7)";ctx.shadowBlur=30;
      for(let k=4;k>=1;k--){ctx.fillStyle=k%2?"#d9c8a4":"#c9b58c";rr(ctx,bx+k*3,y+k*5,bw,h,6);ctx.fill();}ctx.restore();
      const g=ctx.createLinearGradient(bx,y,bx+bw,y+h);g.addColorStop(0,"#6a3c24");g.addColorStop(1,"#35190e");ctx.fillStyle=g;rr(ctx,bx,y,bw,h,8);ctx.fill();
      ctx.strokeStyle="rgba(222,178,98,0.85)";ctx.lineWidth=3;rr(ctx,bx+18,y+18,bw-36,h-36,4);ctx.stroke();ctx.lineWidth=1.2;rr(ctx,bx+28,y+28,bw-56,h-56,3);ctx.stroke();
      const gold="rgba(232,192,112,0.95)";[["A",0.24,22],["DICTIONARY",0.33,30],["OF THE",0.42,18],["ENGLISH",0.5,26],["LANGUAGE",0.58,26],["SAMUEL JOHNSON",0.74,17],["1755",0.82,17]].forEach(([s,fy,sz])=>T(ctx,s,bx+bw/2,y+h*fy,{w:800,size:sz*(w/800),align:"center",color:gold}));});
    if(op>0)withA(ctx,op,()=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.7)";ctx.shadowBlur=34;ctx.fillStyle="#5a3220";rr(ctx,x-12,y-10,w+24,h+22,10);ctx.fill();ctx.restore();
      [0,1].forEach(side=>{const px=x+side*w/2,g=ctx.createLinearGradient(px,y,px+w/2,y);g.addColorStop(side?0:1,"#cdb98f");g.addColorStop(side?0.12:0.88,"#ece0c2");g.addColorStop(side?1:0,"#f1e7cf");ctx.fillStyle=g;ctx.fillRect(px,y,w/2,h);
        // two columns of entries on each page: a headword, then its definition, as lines of type
        const cw=w/4-40;[[0,1],[2]].forEach((ks,col)=>{let yy=y+54;const cx0=px+24+col*(w/4-6);ks.forEach(k=>{const [hw,n]=KT_WORDS[side*3+k],hi=o.hi===hw,hwW=tw(ctx,hw,15,800);
          T(ctx,hw,cx0,yy,{w:800,size:15,color:hi?"rgba(150,70,20,1)":"rgba(52,40,30,0.95)"});
          for(let q=0;q<n*2+2;q++){const lx=q?cx0:cx0+hwW+8,lw=(q?cw:cw-hwW-8)*(q===n*2+1?0.5:0.85+0.15*hash(k*9+q+side*31+col*7,3));ctx.fillStyle="rgba(80,64,46,0.3)";ctx.fillRect(lx,yy-9+q*15,Math.max(10,lw),5);}
          yy+=(n*2+2)*15+26;});});});
      const gx=x+w/2,gg=ctx.createLinearGradient(gx-26,0,gx+26,0);gg.addColorStop(0,"rgba(0,0,0,0)");gg.addColorStop(0.5,"rgba(60,40,20,0.35)");gg.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=gg;ctx.fillRect(gx-26,y,52,h);
      // letters lifting off the page: a language won't stay pinned down
      const dr=o.drift||0;if(dr>0)for(let i=0;i<34;i++){const u=((t*0.22+hash(i,4))%1),px=x+30+hash(i,2)*(w-60),py=y+60+hash(i,3)*(h-90),ch="aeinorstlcdumphgbfywkv"[i%22];
        withA(ctx,dr*Math.sin(Math.PI*u)*0.9,()=>T(ctx,ch,px+u*120*(hash(i,5)-0.3),py-u*220,{w:700,size:16+hash(i,6)*10,color:"rgba(90,64,40,1)"}));}});});}
// a padlock over the page: fixing the language in place; open (0..1) lifts its shackle
function kt_lock(ctx,x,y,s,col,a,open){withA(ctx,a,()=>{const u=ease(clamp(open||0,0,1));ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle=rgba(col,1);ctx.lineWidth=7;ctx.shadowColor=rgba(col,0.8);ctx.shadowBlur=14;
  ctx.beginPath();ctx.arc(0,-22-u*22,22,Math.PI,0);ctx.lineTo(22,-22+(u>0.5?-22*u:0));ctx.moveTo(-22,-22-u*22);ctx.lineTo(-22,-4);ctx.stroke();ctx.shadowBlur=0;
  ctx.fillStyle="rgba(40,26,14,0.95)";rr(ctx,-34,-6,68,52,8);ctx.fill();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3;rr(ctx,-34,-6,68,52,8);ctx.stroke();ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(0,14,6,0,TAU);ctx.fill();ctx.fillRect(-2.5,16,5,14);ctx.restore();});}
// the Oxford English Dictionary: a modern page, with an editor's revisions in blue pencil (p reveals them)
function kt_oed(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a,p=o.p||0;if(a<=0.01)return;withA(ctx,a,()=>{
  [2,1].forEach(k=>{ctx.fillStyle=k===2?"#d9d2c4":"#e6e0d4";ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(0.02*k);ctx.fillRect(-w/2+k*6,-h/2+k*6,w,h);ctx.restore();});
  ctx.save();ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=24;ctx.fillStyle="#f6f2ea";ctx.fillRect(x,y,w,h);ctx.restore();
  T(ctx,"OXFORD ENGLISH DICTIONARY",x+w/2,y+36,{w:800,size:14,align:"center",color:"rgba(40,50,70,0.7)"});ctx.fillStyle="rgba(40,50,70,0.25)";ctx.fillRect(x+30,y+48,w-60,1.5);
  const E=[["credential, n.",4],["credit, n.",3],["curriculum, n.",3]];let yy=y+86;const ink="rgba(34,36,44,0.95)",blue=rgba(KT_BLUE,1),rev=k=>fin(p,k*0.18,0.2);
  E.forEach(([hw,n],i)=>{T(ctx,hw,x+30,yy,{w:800,size:24,color:ink});yy+=18;for(let k=0;k<n;k++){const bw=(w-60)*(0.55+0.4*hash(i*5+k,7));ctx.fillStyle="rgba(60,64,76,0.3)";ctx.fillRect(x+30+(k?16:0),yy+k*18,bw-(k?16:0),6);
      // the editor's marks: a sense struck out, a new one written in, and a date in the margin
      if(i===0&&k===1){const r=rev(0);ctx.strokeStyle=blue;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+46,yy+k*18+3);ctx.lineTo(x+46+(bw-16)*r,yy+k*18+3);ctx.stroke();}
      if(i===0&&k===2)withA(ctx,rev(1),()=>{ctx.strokeStyle=blue;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x+40,yy+k*18+10);ctx.lineTo(x+48,yy+k*18-2);ctx.lineTo(x+56,yy+k*18+10);ctx.stroke();T(ctx,"digital, too",x+62,yy+k*18-4,{w:700,size:21,color:blue});});
      if(i===1&&k===0)withA(ctx,rev(2),()=>{ctx.strokeStyle=blue;ctx.lineWidth=2.5;ctx.beginPath();ctx.ellipse(x+30+bw*0.6,yy+3,bw*0.22,11,0,0,TAU);ctx.stroke();});}
    if(i===2)withA(ctx,rev(3),()=>{ctx.fillStyle=rgba(KT_BLUE,0.12);ctx.fillRect(x+26,yy-34,w-52,n*18+38);T(ctx,"new sense",x+w-34,yy-40,{w:700,size:19,align:"right",color:blue});});
    yy+=n*18+30;});
  withA(ctx,rev(1.5),()=>{ctx.save();ctx.translate(x+w-24,y+120);ctx.rotate(-Math.PI/2);T(ctx,"revised",0,0,{w:700,size:19,align:"center",color:blue});ctx.restore();});});}
// the solar system: the sun, and nine bodies on their orbits; Pluto's orbit is tilted and off-centre
const KT_PLANETS=[["Mercury",[200,180,160],5],["Venus",[240,210,150],7],["Earth",[110,170,240],7],["Mars",[230,120,80],6],["Jupiter",[230,190,140],14],["Saturn",[235,210,150],12],["Uranus",[160,220,230],10],["Neptune",[100,140,240],10],["Pluto",[210,190,170],4]];
function kt_sky(ctx,cx,cy,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const sc=o.s||1;withA(ctx,a,()=>{glow(ctx,cx,cy,90*sc,[255,200,110],0.9);ctx.fillStyle="#ffe7a8";ctx.beginPath();ctx.arc(cx,cy,26*sc,0,TAU);ctx.fill();
  KT_PLANETS.forEach(([n,col,r],i)=>{const rx=(110+i*108)*sc,ry=rx*0.24,pl=i===8,ox=pl?40*sc:0,rot=pl?0.09:0;ctx.save();ctx.translate(cx+ox,cy);ctx.rotate(rot);ctx.strokeStyle=rgba(pl?[200,190,180]:[230,220,200],pl?0.22:0.18);ctx.lineWidth=1.2;if(pl)ctx.setLineDash([6,6]);ctx.beginPath();ctx.ellipse(0,0,rx,ry,0,0,TAU);ctx.stroke();ctx.setLineDash([]);
    const an=pl?0.32+t*0.01:(o.ang||0.6)+t*0.5/Math.pow(i+1,1.1)+i*1.9,px=Math.cos(an)*rx,py=Math.sin(an)*ry;glow(ctx,px,py,r*2.2*sc,col,0.4);ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(px,py,r*sc,0,TAU);ctx.fill();
    if(pl&&o.dwarf)withA(ctx,o.dwarf,()=>tag(ctx,px,py-38,"dwarf planet",CLAY,{align:"center",size:17}));ctx.restore();});});}
// the kilogram, 1889 to 2019: a metal cylinder under a glass bell jar
function kt_kilo(ctx,x,y,s,a){withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  ctx.fillStyle="rgba(60,48,40,0.95)";rr(ctx,-110,70,220,22,8);ctx.fill();
  const g=ctx.createLinearGradient(-40,0,40,0);g.addColorStop(0,"#8c8a86");g.addColorStop(0.35,"#f0ede6");g.addColorStop(0.6,"#bdb9b0");g.addColorStop(1,"#6e6b66");ctx.fillStyle=g;ctx.fillRect(-40,-10,80,80);
  ctx.fillStyle="#e4e0d8";ctx.beginPath();ctx.ellipse(0,-10,40,9,0,0,TAU);ctx.fill();ctx.fillStyle="#7a7772";ctx.beginPath();ctx.ellipse(0,70,40,9,0,0,Math.PI);ctx.fill();
  ctx.strokeStyle="rgba(210,230,255,0.55)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-90,70);ctx.lineTo(-90,-60);ctx.bezierCurveTo(-90,-150,90,-150,90,-60);ctx.lineTo(90,70);ctx.stroke();
  ctx.fillStyle="rgba(210,230,255,0.07)";ctx.fill();ctx.strokeStyle="rgba(255,255,255,0.4)";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-68,40);ctx.lineTo(-68,-58);ctx.quadraticCurveTo(-66,-100,-30,-116);ctx.stroke();
  ctx.fillStyle="rgba(210,230,255,0.6)";ctx.beginPath();ctx.arc(0,-133,9,0,TAU);ctx.fill();ctx.restore();});}
// the Planck constant, written with a raised exponent
function kt_planck(ctx,x,y,sz,col){const a="h = 6.626 070 15 × 10",b="−34",c=" J s",wa=tw(ctx,a,sz,700,"mono"),wb=tw(ctx,b,sz*0.6,700,"mono"),wc=tw(ctx,c,sz,700,"mono"),x0=x-(wa+wb+wc)/2;
  T(ctx,a,x0,y,{f:"mono",w:700,size:sz,color:col});T(ctx,b,x0+wa+2,y-sz*0.45,{f:"mono",w:700,size:sz*0.6,color:col});T(ctx,c,x0+wa+wb+4,y,{f:"mono",w:700,size:sz,color:col});}
// a parchment card with a list of names, some struck through
function kt_list(ctx,x,y,w,title,items,o){o=o||{};const a=o.a==null?1:o.a,rh=o.rh||50;if(a<=0.01)return;withA(ctx,a,()=>{const h=80+items.length*rh+(o.foot||0);ctx.save();ctx.shadowColor="rgba(0,0,0,0.6)";ctx.shadowBlur=24;ctx.fillStyle="#ece2cc";ctx.fillRect(x,y,w,h);ctx.restore();
  T(ctx,title,x+30,y+50,{w:800,size:26,color:"rgba(60,44,30,0.95)"});ctx.fillStyle="rgba(120,90,50,0.35)";ctx.fillRect(x+30,y+64,w-60,2);
  items.forEach((s,i)=>{const yy=y+80+i*rh+rh*0.62,st=(o.strike||{})[i]||0;T(ctx,s,x+44,yy,{w:600,size:24,color:st>0.5?"rgba(60,44,30,0.5)":"rgba(52,40,30,0.95)"});
    if(st>0){const sw=tw(ctx,s,24,600);ctx.strokeStyle=rgba([190,50,40],0.95);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x+38,yy-8);ctx.lineTo(x+38+(sw+14)*st,yy-9);ctx.stroke();}});});}

/* ---------- the present: the calendar, the government's form, the dashboards ---------- */
function kt_cal(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const cw=(w-40)/7,rh=52,h=130+5*rh;withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,[170,205,255],{glow:12,ea:0.5,fill:"rgba(8,14,28,0.92)"});
  T(ctx,o.month||"October 2026",x+24,y+48,{w:800,size:28});"MTWTFSS".split("").forEach((d,i)=>T(ctx,d,x+20+cw*(i+0.5),y+92,{w:700,size:16,align:"center",color:rgba(SOFT,0.9)}));
  const first=3;for(let d=1;d<=31;d++){const k=first+d-1,cx=x+20+cw*((k%7)+0.5),cy=y+130+Math.floor(k/7)*rh,m=(o.marks||[]).find(q=>q.d===d);
    if(m&&m.a>0)withA(ctx,m.a,()=>{glow(ctx,cx,cy-6,34,m.col,0.35);ctx.fillStyle=rgba(m.col,0.22);ctx.beginPath();ctx.arc(cx,cy-6,21,0,TAU);ctx.fill();ring(ctx,cx,cy-6,21,m.col,1,2.5);});
    T(ctx,String(d),cx,cy,{w:m&&m.a>0.5?800:600,size:18,align:"center",color:m&&m.a>0.5?rgba(m.col,1):rgba(INK,0.75)});}
  if(o.today!=null){const k=first+o.today-1,cx=x+20+cw*((k%7)+0.5),cy=y+130+Math.floor(k/7)*rh;ctx.strokeStyle=rgba(INK,0.5);ctx.lineWidth=1.5;rr(ctx,cx-cw/2+3,cy-30,cw-6,40,8);ctx.stroke();}});return h;}
// the government's reporting form for microcredentials, with a new field
function kt_form(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const F=["Provider code","Microcredential code","Learner ID","Volume of learning (hours)"],rh=52,h=112+(F.length+1)*rh+12;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,[200,215,240],{glow:14,ea:0.55,fill:"rgba(8,14,28,0.94)"});ctx.fillStyle="rgba(200,215,240,0.12)";rr(ctx,x+2,y+2,w-4,62,16);ctx.fill();
    T(ctx,"Government",x+24,y+30,{w:700,size:15,color:rgba(SOFT,1)});T(ctx,"Microcredential report · 2027",x+24,y+54,{w:800,size:21});
    F.forEach((f,i)=>{const yy=y+100+i*rh;T(ctx,f,x+24,yy,{w:600,size:16,color:rgba(SOFT,1)});ctx.strokeStyle="rgba(170,200,245,0.35)";ctx.lineWidth=1.5;rr(ctx,x+24,yy+8,w-48,26,6);ctx.stroke();});
    const hi=o.hi||0,yy=y+100+F.length*rh;withA(ctx,0.3+0.7*hi,()=>{ctx.fillStyle=rgba(AMBER,0.14*hi);rr(ctx,x+12,yy-24,w-24,rh+14,10);ctx.fill();ctx.strokeStyle=rgba(AMBER,0.9);ctx.lineWidth=2.5;rr(ctx,x+12,yy-24,w-24,rh+14,10);ctx.stroke();
      T(ctx,"Outcome",x+24,yy,{w:800,size:17,color:rgba(AMBER,1)});T(ctx,"completed · withdrawn · enrolled",x+34,yy+27,{f:"mono",w:500,size:14,color:rgba(INK,0.9)});});
    if(hi>0.5)withA(ctx,fin(hi,0.5,0.5),()=>tag(ctx,x+w-80,yy-6,"new",AMBER,{align:"center",size:16}));});return h;}
// a dashboard, in the style of Silent change's (a light canvas in a dark bezel): one number, its name, and optionally its formula
function kt_dash(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=o.col||[7,122,157],s=h/230,hi=o.hi||0;
  withA(ctx,a,()=>{if(hi>0)glow(ctx,x+w/2,y+h/2,w*0.7,o.hiCol||col,0.3*hi);glass(ctx,x-8,y-8,w+16,h+16,16,o.edge||[170,205,255],{glow:10+14*hi,ea:0.4+0.5*hi,fill:"rgba(8,14,28,0.95)"});
    ctx.save();rr(ctx,x,y,w,h,10);ctx.clip();ctx.fillStyle=DB.canvas;ctx.fillRect(x,y,w,h);ctx.fillStyle=DB.card;ctx.fillRect(x,y,w,46*s);ctx.fillStyle=rgba(col,1);ctx.fillRect(x,y,7*s,46*s);ctx.fillStyle=DB.line;ctx.fillRect(x,y+46*s,w,1.2);
    T(ctx,o.name||"Dashboard",x+20*s,y+30*s,{w:700,size:18*s,color:DB.text});
    T(ctx,o.title||"Completion rate",x+20*s,y+82*s,{w:600,size:18*s,color:DB.muted});
    T(ctx,o.num||"71%",x+18*s,y+152*s,{w:800,size:62*s,color:o.numCol||DB.text});
    if(o.formula)withA(ctx,o.fA==null?1:o.fA,()=>{T(ctx,o.formula,x+20*s,y+h-22*s,{f:"mono",w:500,size:Math.min(14*s,(w-40*s)/o.formula.length*1.62),color:o.fCol||DB.muted});});
    else{const v=parseFloat(o.num)||0,bw=w-40*s;ctx.fillStyle=DB.track;rr(ctx,x+20*s,y+h-34*s,bw,12*s,6*s);ctx.fill();ctx.fillStyle=rgba(col,1);rr(ctx,x+20*s,y+h-34*s,bw*v/100,12*s,6*s);ctx.fill();}
    ctx.restore();if(o.flag)kt_flag(ctx,x+w-26,y-4,1,o.flag);});}
// a glossary entry: the term, its version and owner, and its definition (lines given, so a phrase can be highlighted)
function kt_gloss(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const L=o.lines||[],h=o.h||(140+L.length*38);
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,o.edge||KIND,{glow:14+10*(o.glow||0),ea:0.75,fill:"rgba(7,12,24,0.94)"});T(ctx,o.kind||"Glossary",x+24,y+34,{w:700,size:16,color:rgba(o.edge||KIND,1)});
    T(ctx,o.term||"completion rate",x+24,y+74,{w:800,size:30});if(o.ver)stamp(ctx,x+w-20,y+38,o.ver,o.verCol||KIND,1,o.flick||0);
    L.forEach((l,i)=>{const yy=y+120+i*38;T(ctx,l,x+24,yy,{w:600,size:22,color:rgba(INK,0.92)});
      if(o.hi&&o.hi[0]===i&&o.hiA>0){const p0=l.indexOf(o.hi[1]),x0=x+24+tw(ctx,l.slice(0,p0),22,600),x1=x0+tw(ctx,o.hi[1],22,600);withA(ctx,o.hiA,()=>{ctx.fillStyle=rgba(o.hiCol||EDGE_,0.2);rr(ctx,x0-4,yy-24,x1-x0+8,32,6);ctx.fill();ctx.strokeStyle=rgba(o.hiCol||EDGE_,1);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x0,yy+8);ctx.lineTo(x1,yy+8);ctx.stroke();});}});
    if(o.owner)T(ctx,o.owner,x+24,y+h-20,{w:600,size:16,color:rgba(SOFT,1)});});return h;}
// code that calculates a number: a file name and a few lines of SQL, one phrase of which can be highlighted
function kt_code(ctx,x,y,w,name,lines,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const h=o.h||(78+lines.length*34);
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,14,o.edge||[170,205,255],{glow:12,ea:0.6,fill:"rgba(6,10,20,0.95)"});T(ctx,name,x+22,y+34,{f:"mono",w:500,size:16,color:rgba(o.edge||SOFT,1)});ctx.fillStyle="rgba(170,200,245,0.15)";ctx.fillRect(x+14,y+48,w-28,1.2);
    const n=o.p==null?lines.length:lines.length*o.p;lines.forEach((l,i)=>{if(i>=n)return;const yy=y+84+i*34,q=clamp(n-i,0,1);T(ctx,typeOn(l,q),x+22,yy,{f:"mono",w:500,size:18,color:rgba(i%2?INK:[190,220,255],0.92)});
      if(o.hi&&o.hi[0]===i&&o.hiA>0){const p0=l.indexOf(o.hi[1]),x0=x+22+tw(ctx,l.slice(0,p0),18,500,"mono"),x1=x0+tw(ctx,o.hi[1],18,500,"mono");withA(ctx,o.hiA,()=>{ctx.fillStyle=rgba(o.hiCol||EDGE_,0.22);rr(ctx,x0-4,yy-22,x1-x0+8,30,6);ctx.fill();ctx.strokeStyle=rgba(o.hiCol||EDGE_,1);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x0,yy+8);ctx.lineTo(x1,yy+8);ctx.stroke();});}});});return h;}

/* ---------- the model on its board, and the data under it ---------- */
// the sketch: the credential and its kinds, as the films' glass boxes, on a board with its version stamp
function kt_board(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot||0);ctx.translate(-w/2,-h/2);
  glass(ctx,0,0,w,h,20,o.edge||SK,{glow:16,ea:0.5,fill:"rgba(10,18,36,0.72)"});if(o.label)tag(ctx,24,0,o.label,o.edge||SK,{size:17});
  const s=o.s||0.5,ox=w/2-960*s,oy=h/2-445*s;credKinds(ctx,{ox,oy,s,hi:o.hi});
  if(o.stamp)stamp(ctx,w-18,42,o.stamp,o.stampCol||[200,170,120],1,o.flick||0);ctx.restore();});}
// the data as it's used: a table of enrolments
const KT_COLS=["learner","microcredential","status","online","completed"],KT_CW=[130,250,190,140,150];
const KT_ROWS=[["L-2041","Data Visualisation","enrolled","live","yes"],["L-2217","SQL Basics","WAITLISTED","live","—"],["L-1180","Data Ethics","withdrawn","recorded","no"]];
const kt_cellX=(x,i)=>x+KT_CW.slice(0,i).reduce((p,q)=>p+q,0);

/* ---------- the change package, and the chain ---------- */
function kt_pcard(ctx,x,y,w,h,k,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const [lay,l1,l2]=KT_PKG[k],col=o.col||KT_AI;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,12,col,{glow:10+10*(o.hi||0),ea:0.75,fill:"rgba(6,16,20,0.95)"});ctx.fillStyle=rgba(col,0.9);rr(ctx,x+12,y+14,5,h-28,2);ctx.fill();
    T(ctx,lay,x+30,y+32,{w:700,size:17,color:rgba(col,1)});T(ctx,l1,x+30,y+66,{w:700,size:23});if(h>100&&l2)T(ctx,l2,x+30,y+98,{f:"mono",w:500,size:16,color:rgba(SOFT,1)});
    if(o.tick)kt_gtick(ctx,x+w-22,y+22,13,o.tick);});}
function kt_folder(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=o.col||KT_AI;withA(ctx,a,()=>{
  ctx.save();ctx.shadowColor=rgba(col,0.5);ctx.shadowBlur=24;ctx.fillStyle="rgba(8,20,24,0.9)";ctx.beginPath();ctx.moveTo(x,y+24);ctx.lineTo(x,y+h-16);ctx.quadraticCurveTo(x,y+h,x+16,y+h);ctx.lineTo(x+w-16,y+h);ctx.quadraticCurveTo(x+w,y+h,x+w,y+h-16);ctx.lineTo(x+w,y+40);ctx.quadraticCurveTo(x+w,y+24,x+w-16,y+24);ctx.lineTo(x+260,y+24);ctx.lineTo(x+236,y);ctx.lineTo(x+16,y);ctx.quadraticCurveTo(x,y,x,y+16);ctx.closePath();ctx.fill();ctx.restore();
  ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=2;ctx.stroke();T(ctx,o.title||"change package",x+24,y+17,{w:800,size:16,color:rgba(col,1)});
  if(o.stamp)stamp(ctx,x+w-18,y+60,o.stamp,o.stampCol||col,o.stampA==null?1:o.stampA,0);});}
// the stack of versions: v1 at the back, the newest in front
function kt_versions(ctx,x,y,n,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{for(let i=0;i<n;i++){const k=clamp((o.p==null?n:o.p)-i,0,1);if(k<=0)continue;const top=i===n-1,xx=x+i*16,yy=y-i*26;
  withA(ctx,k,()=>{glass(ctx,xx,yy,220,110,14,top?(o.col||TRUST):[150,165,190],{glow:top?16:6,ea:top?0.9:0.5,fill:"rgba(8,12,24,0.96)"});T(ctx,"v"+(i+1),xx+22,yy+44,{f:"mono",w:500,size:26,color:top?rgba(o.col||TRUST,1):rgba(SOFT,1)});
    T(ctx,(o.dates||["2019","2025","2027"])[i]||"",xx+198,yy+42,{f:"mono",w:500,size:16,align:"right",color:rgba(SOFT,0.9)});if(top&&o.sub)T(ctx,o.sub,xx+22,yy+84,{w:600,size:16,color:rgba(INK,0.85)});});}});}
// one change, end to end: seven layers in a row, lit up to "lit" (0..7); a light travels along them
function kt_chain(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const n=KT_CHAIN.length,gap=o.gap||16,bw=(w-gap*(n-1))/n,bh=o.h||110,lit=o.lit||0,sz=o.size||1;
  withA(ctx,a,()=>{const cy=y+bh/2;ctx.strokeStyle="rgba(170,200,245,0.25)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+bw/2,cy);ctx.lineTo(x+w-bw/2,cy);ctx.stroke();
    if(lit>0){const e=x+bw/2+(bw+gap)*Math.min(n-1,lit-0.5);beam(ctx,[{x:x+bw/2,y:cy},{x:Math.max(x+bw/2+1,e),y:cy}],TRUST,[[18,0.06],[7,0.18],[2.6,0.8],[1.2,1]]);}
    KT_CHAIN.forEach(([t1,t2],i)=>{const bx=x+i*(bw+gap),on=clamp(lit-i,0,1),hi=o.hiK===i?1:0,col=mix([150,165,190],TRUST,on);
      glass(ctx,bx,y,bw,bh,14,col,{glow:6+16*on+10*hi,ea:0.35+0.6*on,fill:"rgba(8,12,24,0.95)"});
      T(ctx,t1,bx+bw/2,y+bh*0.44,{w:800,size:Math.min(22*sz,(bw-16)/t1.length*1.9),align:"center",color:on>0.5?rgba(INK,1):rgba(SOFT,0.8)});
      withA(ctx,0.4+0.6*on,()=>T(ctx,(o.sub||[])[i]||t2,bx+bw/2,y+bh*0.74,{w:600,size:Math.min(18*sz,(bw-12)/((o.sub||[])[i]||t2).length*1.75),align:"center",color:on>0.5?rgba(TRUST,1):rgba(SOFT,0.8)}));
      if(o.ticks&&on>0.98)kt_gtick(ctx,bx+bw-14,y+2,11,fin(lit-i,1,0.4));});});}
// a report from an earlier year, read with the definitions it was written with
function kt_report(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const h=o.h||300;withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{plain:true,rot:o.rot||-0.015});
  T(ctx,o.title||"Annual report 2025",x+30,y+54,{w:800,size:26,color:"rgba(40,36,34,0.95)"});ctx.fillStyle="rgba(80,76,70,0.3)";ctx.fillRect(x+30,y+70,w-60,2);
  (o.rows||[["microcredentials issued","2,960"],["completion rate","62%"]]).forEach(([k,v],i)=>{T(ctx,k,x+30,y+120+i*52,{w:600,size:21,color:"rgba(60,56,52,0.9)"});T(ctx,v,x+w-30,y+120+i*52,{w:800,size:26,align:"right",color:"rgba(40,36,34,0.95)"});});
  for(let i=0;i<3;i++){ctx.fillStyle="rgba(80,76,70,0.2)";ctx.fillRect(x+30,y+h-86+i*22,(w-60)*(0.5+0.4*hash(i,4)),7);}
  if(o.stamp)stamp(ctx,x+w-16,y+h-18,o.stamp,o.stampCol||KIND,o.stampA==null?1:o.stampA,0);});}
// a clay tablet with a few wedges pressed in: the series' first marks
function kt_tablet(ctx,x,y,w,h,p,a){withA(ctx,a==null?1:a,()=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.7)";ctx.shadowBlur=30;ctx.fillStyle="#9a7650";rr(ctx,x,y,w,h,26);ctx.fill();ctx.shadowBlur=0;
  const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,"rgba(255,230,190,0.25)");g.addColorStop(1,"rgba(40,20,10,0.35)");ctx.fillStyle=g;rr(ctx,x,y,w,h,26);ctx.fill();
  ctx.strokeStyle="rgba(70,44,24,0.5)";ctx.lineWidth=2;for(let r=1;r<4;r++){ctx.beginPath();ctx.moveTo(x+22,y+r*h/4);ctx.lineTo(x+w-22,y+r*h/4);ctx.stroke();}
  const n=32,sh=Math.floor(n*clamp(p,0,1));for(let i=0;i<sh;i++){const row=Math.floor(i/8),c=i%8,px=x+34+c*(w-68)/8+hash(i,2)*6,py=y+row*h/4+h/8+6,k=hash(i,3);ctx.fillStyle="rgba(60,36,18,0.85)";ctx.beginPath();
    if(k<0.5){ctx.moveTo(px,py-9);ctx.lineTo(px+15,py-5);ctx.lineTo(px,py-1);}else{ctx.moveTo(px,py-11);ctx.lineTo(px+5,py+8);ctx.lineTo(px+10,py-11);}ctx.closePath();ctx.fill();}ctx.restore();});}
// a proposal on its way: a small card carried along a path, for the review and the gate
function kt_prop(ctx,x,y,s,col,a,o){o=o||{};withA(ctx,a,()=>{const w=tw(ctx,s,17,700)+36;glass(ctx,x-w/2,y-22,w,44,12,col,{glow:14,ea:0.85,fill:"rgba(8,12,24,0.95)",lw:o.dash?2:1.6});if(o.dash){ctx.save();ctx.setLineDash([6,5]);ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2;rr(ctx,x-w/2,y-22,w,44,12);ctx.stroke();ctx.restore();}
  T(ctx,s,x,y+6,{w:700,size:17,align:"center",color:rgba(col,1)});});}

/* ---------- pictures for the labs and the scenarios (site/assets/keeping-it-true/learn.*.js name them in "vis") ----------
   Each draws on a canvas of w × h, with the lab's state and the page's words (window.FW). */
// a sort lab: its buckets as three trays, with a numbered chip for each item placed (green or red once checked)
function kt_trays(c,w,h,st,L,id,cols,icons){const lab=L.labs.find(x=>x.id===id),B=lab.w.buckets,n=B.length,tw_=(w-40-(n-1)*20)/n,pick=st.pick||{};
  B.forEach(([k,name],i)=>{const x=20+i*(tw_+20),y=56,col=cols[i];glass(c,x,y,tw_,h-76,16,col,{glow:10,ea:0.7,fill:"rgba(7,12,24,0.94)"});icons[i](c,x+30,y-18);
    wrapT(c,name,x+60,y-10,tw_-70,{w:700,size:17,color:rgba(col,1)});
    const inB=lab.w.items.map((it,j)=>[it,j]).filter(([it,j])=>pick[j]===k);inB.forEach(([it,j],q)=>{const cx=x+30+(q%4)*((tw_-40)/4)+10,cy=y+54+Math.floor(q/4)*62,ok=it.b===k,cc=st.checked?(ok?GOOD:BAD):[190,205,230];
      glow(c,cx+14,cy+14,30,cc,0.25);c.fillStyle="rgba(10,16,30,0.95)";c.beginPath();c.arc(cx+14,cy+14,22,0,TAU);c.fill();ring(c,cx+14,cy+14,22,cc,1,2.5);T(c,String(j+1),cx+14,cy+21,{w:800,size:20,align:"center",color:rgba(cc,1)});});});}
const LV={
  // Spot the drift: drift, fine as agreed, or a new version
  drift:(c,w,h,st,L)=>kt_trays(c,w,h,st,L,"drift",[EDGE_,GOOD,TRUST],[(c,x,y)=>{c.fillStyle=rgba(EDGE_,1);c.font=font(800,26);c.fillText("≈",x-10,y+14);},(c,x,y)=>tick_(c,x,y+6,26,GOOD,1),(c,x,y)=>stamp(c,x+24,y+6,"v3",TRUST,1,0)]),
  // Approve or reject: the agent's proposals, sorted by the people who own them
  review:(c,w,h,st,L)=>kt_trays(c,w,h,st,L,"review",[TRUST,BAD,AMBER],[(c,x,y)=>kt_gtick(c,x,y+4,13,1),(c,x,y)=>kt_rcross(c,x,y+4,13,1),(c,x,y)=>{ring(c,x,y+4,13,AMBER,1,2.5);T(c,"?",x,y+11,{w:800,size:18,align:"center",color:rgba(AMBER,1)});}]),
  // Follow one change: the chain, lit up to the step you're on; the last step is the version note
  chain:(c,w,h,st)=>{const k=st.step||0;kt_chain(c,20,90,w-40,{lit:Math.min(7,k+1),h:120,size:0.9,gap:10,hiK:Math.min(6,k)});
    kt_agent(c,70,290,26,1.2,{a:k<1?1:0.5});T(c,"agent drafts",110,298,{w:700,size:16,color:rgba(KT_AI,1)});
    if(k>=7){kt_versions(c,w-300,330,3,{sub:"completion rate v3"});kt_report(c,330,215,300,{h:180,rows:[["completion rate","62%"]],stamp:"read with v2"});}
    else T(c,["Mei approves the meaning","Mei approves the meaning","Noor approves the model","the teams build both shapes","the teams build the measure","the tests run first","every tool asks the same measure"][k],w/2,320,{w:700,size:22,align:"center",color:rgba(TRUST,1)});},
  // scenarios
  three:(c,w,h)=>{KT_DASH.forEach((d,i)=>kt_dash(c,24+i*194,70,178,150,{name:d.name,col:d.col,num:d.num}));T(c,"“completion rate”",300,270,{w:700,size:22,align:"center",color:rgba(EDGE_,1)});},
  invent:(c,w,h)=>{kt_agent(c,80,120,34,1);glass(c,150,60,420,150,16,KT_AI,{glow:14,ea:0.8,fill:"rgba(6,16,20,0.95)"});T(c,"draft · glossary",176,94,{w:700,size:16,color:rgba(KT_AI,1)});T(c,"completion rate =",176,134,{w:800,size:22});T(c,"passed ÷ enrolled on day one",176,168,{f:"mono",w:500,size:18});kt_rstamp(c,390,250,"nobody agreed",EDGE_,1,1,{size:26});},
  skip:(c,w,h)=>{glass(c,210,40,180,90,14,TRUST,{glow:10,ea:0.6,fill:"rgba(7,12,24,0.94)"});T(c,"review",300,94,{w:700,size:20,align:"center",color:rgba(TRUST,1)});c.save();c.setLineDash([9,8]);c.strokeStyle=rgba(BAD,0.9);c.lineWidth=3;c.beginPath();c.moveTo(60,230);c.lineTo(430,230);c.stroke();c.restore();
    kt_prop(c,120,230,"change #219",BAD,1,{dash:true});gate(c,460,220,150,BAD,"tests");T(c,"contract · tests",460,310,{w:700,size:16,align:"center",color:rgba(BAD,1)});kt_dash(c,500,170,90,90,{name:"",num:"71%",col:KT_PLAN});},
  lastyear:(c,w,h)=>{kt_report(c,40,30,300,{h:230,stamp:"read with v2"});kt_gloss(c,370,50,210,{term:"v3",lines:["÷ enrolled","at census"],ver:"2027",h:210,kind:"completion rate"});},
  spec:(c,w,h)=>{[["2026",0.5],["2027",1]].forEach(([y_,a],i)=>withA(c,a,()=>{glass(c,60+i*270,50,240,220,16,[200,215,240],{glow:10,ea:0.6,fill:"rgba(8,14,28,0.94)"});T(c,"Government spec",80+i*270,88,{w:700,size:16,color:rgba(SOFT,1)});T(c,y_,80+i*270,140,{w:800,size:44});if(i)tag(c,180+i*270,210,"+ outcome",AMBER,{align:"center",size:16});}));},
  who:(c,w,h)=>{[["mei","the meaning"],["noor","the model"],["sam","the build"]].forEach(([id,s],i)=>{person(c,id,110+i*190,300,0.36,{t:1});tag(c,110+i*190,50,s,TRUST,{align:"center",size:17});});},
  ghost:(c,w,h)=>{kt_report(c,30,60,230,{h:200,title:"Report 2019",rows:[["completion","58%"]]});withA(c,0.55,()=>{glass(c,290,70,280,130,16,[200,210,230],{glow:18,ea:0.6,fill:"rgba(10,14,26,0.7)"});T(c,"completion rate (v1)",310,108,{w:700,size:18,color:rgba(SOFT,1)});T(c,"finished ÷ logged in",310,146,{f:"mono",w:500,size:17});});kt_agent(c,500,250,28,1);},
  order:(c,w,h)=>{kt_chain(c,20,110,w-40,{lit:7,h:100,size:0.62,gap:6});}
};
