/* ===== The map behind the sketch: the university's map =====
   The map a modeller reads before modelling, in four parts, each in its colour: what each thing is for (the university's capabilities,
   adopted from HERM), who answers for it (data domains, each with one owner), where it's first written (systems of record) and what
   its word means (the business glossary). The names are the example project's map (10-enterprise-architecture/, 20-data-governance/).
   Every piece of text is sized as the phone layer draws it, and every box is made from its words as drawn. */
const CAPC=[245,206,140],DOMC=[255,168,138],SYSC=[150,226,150],GLOC=[200,172,255],QC=[255,176,64],COPYC=[120,200,255];
const MP_PARTS=[["What it's for",CAPC],["Who answers for it",DOMC],["Where it's written",SYSC],["What it means",GLOC]];
const MP_CAPS=["Learning and teaching","Research","Engagement and advancement","Strategy and planning","People","Finance","Information and data","Campus and technology"];
const MP_CAPXY=i=>[160+(i%4)*410,210+Math.floor(i/4)*190];
const MP_DOMS=[["Person","Registrar's office"],["Student","Registrar's office"],["Course","Registrar's office, with the faculties"],["Staff","HR"],["Finance","Finance"],["Organisation","Planning"],["Admissions","Admissions office"],["Research","Graduate research school"],["Fees","Finance"]];
const MP_DOMXY=i=>[420+(i%3)*450,196+Math.floor(i/3)*176];

/* ---------- the four parts, across the top ---------- */
function mp_indexLayout(ctx){const sz=phSz(ctx,28),ws=MP_PARTS.map(p=>tw(ctx,p[0],sz,700)+70),gap=24,tot=ws.reduce((s,w)=>s+w,0)+gap*3;let x=960-tot/2;
  return ws.map(w=>{const b={x,w,cx:x+w/2,y:84,h:sz+26,sz};x+=w+gap;return b;});}
// one part's chip, centred on (cx, cy): its dot and its words, as lit as on (0..1)
function mp_chip(ctx,cx,cy,i,on,a){if(a!=null&&a<=0.01)return;const[s,c]=MP_PARTS[i],sz=phSz(ctx,28),w=tw(ctx,s,sz,700)+70,h=sz+26,x=cx-w/2;
  withA(ctx,(a==null?1:a)*(0.5+0.5*on),()=>{if(on>0)glow(ctx,cx,cy,w*0.6,c,0.2*on);glass(ctx,x,cy-h/2,w,h,h/2,c,{glow:6+10*on,ea:0.4+0.5*on,fill:"rgba(7,12,24,0.92)"});
    ctx.fillStyle=rgba(c,1);ctx.beginPath();ctx.arc(x+24,cy,7,0,TAU);ctx.fill();T(ctx,s,x+42,cy+sz*0.36,{w:700,size:sz,color:rgba(mix(SOFT,c,on),1)});});}
// the four parts across the top: lit(i) gives how lit each is (0..1); a part not lit stays dim
function mp_index(ctx,lit,a){if(a<=0.01)return;const L=mp_indexLayout(ctx);withA(ctx,a,()=>MP_PARTS.forEach((p,i)=>mp_chip(ctx,L[i].cx,L[i].y,i,lit?lit(i):0)));}

/* ---------- tiles, boxes and pins ---------- */
// a tile of the map: a glass card in its part's colour, its name wrapped to fit at the size it's drawn, an optional line under it
function mp_tile(ctx,x,y,w,h,name,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const hi=o.hi||0;
  withA(ctx,a*(1-0.62*(o.dim||0)),()=>{if(hi>0)glow(ctx,x+w/2,y+h/2,Math.max(w,h)*0.72,col,0.22*hi);glass(ctx,x,y,w,h,16,col,{glow:8+12*hi,ea:0.5+0.45*hi,fill:"rgba(8,13,26,0.93)"});
    ctx.fillStyle=rgba(col,1);rr(ctx,x+16,y+20,6,34,3);ctx.fill();
    const ns=phSz(ctx,o.size||30),L=phWrap(ctx,name,w-58,ns,700);L.forEach((l,i)=>T(ctx,l,x+34,y+16+ns+i*ns*1.16,{w:700,size:ns,color:rgba(mix(col,[255,255,255],0.42),1)}));
    if(o.sub){const ss=phSz(ctx,28),SL=phWrap(ctx,o.sub,w-58,ss,600),y0=y+16+ns+(L.length-1)*ns*1.16+ss*1.3;withA(ctx,o.subA==null?1:o.subA,()=>SL.forEach((l,i)=>T(ctx,l,x+34,y0+i*ss*1.18,{w:600,size:ss,color:rgba(o.subCol||SOFT,1)})));}});}
// one of the sketch's boxes, small: its name in the sketch's ink, in a box made from its words as drawn
function mp_boxW(ctx,name,size){return tw(ctx,name,phSz(ctx,size||28),700)+38;}
function mp_box(ctx,x,y,name,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const sz=phSz(ctx,o.size||28),w=mp_boxW(ctx,name,o.size),h=sz+24,col=o.col||SK,X=x-w/2,Y=y-h/2;
  withA(ctx,a,()=>{if(o.hi)glow(ctx,x,y,w*0.7,o.hiCol||col,0.32*o.hi);ctx.fillStyle="rgba(8,14,30,0.96)";rr(ctx,X,Y,w,h,10);ctx.fill();ctx.save();ctx.shadowColor=rgba(col,0.8);ctx.shadowBlur=10;ctx.strokeStyle=rgba(o.edge||col,0.95);ctx.lineWidth=2.4;if(o.dash)ctx.setLineDash([8,6]);rr(ctx,X,Y,w,h,10);ctx.stroke();ctx.restore();
    T(ctx,name,x,y+sz*0.36,{w:700,size:sz,align:"center",color:rgba(col,1)});
    if(o.strike){const k=o.strike;ctx.strokeStyle=rgba(QC,1);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(X+10,y);ctx.lineTo(X+10+(w-20)*k,y);ctx.stroke();}});}
// a pin: a small disc in a part's colour; q puts an amber question in it instead
function mp_pin(ctx,x,y,col,a,q){if(a<=0.01)return;withA(ctx,a,()=>{const r=q?21:15;ctx.fillStyle=q?"rgba(30,18,6,0.95)":rgba(col,1);ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
  ctx.strokeStyle=rgba(q?QC:mix(col,[255,255,255],0.4),1);ctx.lineWidth=2.5;ctx.stroke();if(q){glow(ctx,x,y,46,QC,0.3*q);T(ctx,"?",x,y+10,{w:800,size:28,align:"center",color:rgba(QC,1)});}else glow(ctx,x,y,30,col,0.25);});}

/* ---------- the sketch, as the intro drew it, now with its place on the map ---------- */
// the five boxes and their relations on the board; o.ap fades the boxes in one by one ({Student:0..1, ...}); o.pins gives each box's
// four pins (how far each is in), o.q the pins still in question ({Class:{3:1}}), o.hi a glow on a box
function mp_sketch(ctx,o){o=o||{};const ap=o.ap||{},pins=o.pins||{},Q=o.q||{},E={};
  Object.keys(V1).forEach(k=>{E[k]={x:V1[k][0],y:V1[k][1]-(o.lift||0),name:k,s:1.25,a:ap[k]==null?1:ap[k],hi:(o.hi||{})[k]||0};});if(o.termSub)E.Term.sub="census date";
  const rf=o.rel==null?1:o.rel;diagram(ctx,E,V1R.map((r,i)=>r.concat([{f:clamp(rf*4-i,0,1),a:o.relA==null?1:o.relA}])));
  Object.keys(V1).forEach(k=>{const P=pins[k];if(!P)return;const b=entBox(ctx,E[k]),up=b.y<540,edge=up?b.y-b.h/2:b.y+b.h/2;[0,1,2,3].forEach(i=>{const v=P[i]||0,q=(Q[k]||{})[i]||0;if(v<=0&&q<=0)return;
    const[x,y]=mp_pinAt(ctx,E[k],i);ctx.save();ctx.strokeStyle=rgba(MP_PARTS[i][1],0.5*Math.max(v,q));ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,edge);ctx.lineTo(x,y+(up?14:-14));ctx.stroke();ctx.restore();
    mp_pin(ctx,x,y,MP_PARTS[i][1],Math.max(v,q),q);});});return E;}
// where a box's pin i sits: above the boxes of the board's top row, below those of its bottom row, clear of the lines between them
function mp_pinAt(ctx,e,i){const b=entBox(ctx,e),up=b.y<540;return[b.x+(i-1.5)*46,up?b.y-b.h/2-30:b.y+b.h/2+30];}
// what each pin means, in a row under the board
function mp_legend(ctx,y,a){if(a<=0.01)return;const sz=phSz(ctx,28),items=["for","owner","home","meaning"],ws=items.map(s=>tw(ctx,s,sz,600)+52),gap=34,tot=ws.reduce((s,w)=>s+w,0)+gap*3;let x=960-tot/2;
  withA(ctx,a,()=>items.forEach((s,i)=>{const c=MP_PARTS[i][1];ctx.fillStyle=rgba(c,1);ctx.beginPath();ctx.arc(x+15,y,12,0,TAU);ctx.fill();T(ctx,s,x+38,y+sz*0.36,{w:600,size:sz,color:rgba(mix(SOFT,c,0.5),1)});x+=ws[i]+gap;}));}

/* ---------- cards ---------- */
// a card with a kicker, a title and wrapped lines: for the glossary, the systems and the steps of the work
function mp_card(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return 0;const col=o.col||GLOC,ks=phSz(ctx,28),ts=phSz(ctx,o.ts||34),ls=phSz(ctx,28);
  const L=(o.lines||[]).map(s=>typeof s==="string"?phWrap(ctx,s,w-60,ls,600):[]),nl=L.reduce((s,l)=>s+l.length,0),h=o.h||(28+(o.kicker?ks*1.25:0)+ts*1.1+(nl?14+nl*ls*1.22:0)+22);
  withA(ctx,a,()=>{const hi=o.hi||0;if(hi>0)glow(ctx,x+w/2,y+h/2,w*0.7,col,0.2*hi);glass(ctx,x,y,w,h,18,col,{glow:10+12*hi,ea:0.55+0.4*hi,fill:"rgba(8,13,26,0.94)"});
    let yy=y+22;if(o.kicker){T(ctx,o.kicker,x+30,yy+ks*0.9,{w:700,size:ks,color:rgba(col,1)});yy+=ks*1.25;}
    T(ctx,o.title,x+30,yy+ts*0.92,{w:800,size:ts,color:rgba(INK,0.98)});yy+=ts*1.1+14;
    let k=0;L.forEach((ls_,i)=>{const lc=(o.lineCols||[])[i]||SOFT,la=(o.lineA||[])[i];withA(ctx,la==null?1:la,()=>ls_.forEach(l=>{T(ctx,l,x+30,yy+ls*0.95+k*ls*1.22,{w:600,size:ls,color:rgba(lc,1)});k++;}));if(la!=null&&la<=0)k+=0;});});return h;}
// a step of the work, from a question to a model
function mp_step(ctx,x,y,w,h,name,sub,col,on,a){if(a<=0.01)return;withA(ctx,a,()=>{withA(ctx,0.45+0.55*on,()=>{if(on>0)glow(ctx,x+w/2,y+h/2,w*0.7,col,0.25*on);glass(ctx,x,y,w,h,18,col,{glow:8+14*on,ea:0.45+0.5*on,fill:"rgba(8,13,26,0.94)"});
  const ns=phSz(ctx,34),ss=phSz(ctx,28);T(ctx,name,x+w/2,y+20+ns,{w:800,size:ns,align:"center",color:rgba(mix(INK,col,0.35*on),1)});
  phWrap(ctx,sub,w-36,ss,600).forEach((l,i)=>withA(ctx,on,()=>T(ctx,l,x+w/2,y+40+ns+ss*1.05+i*ss*1.2,{w:600,size:ss,align:"center",color:rgba(SOFT,1)})));});});}
