/* ===== Good enough for what?: the graduation list, its uses, and the people =====
   The film's own pictures in the module's look, drawn live on the kit's places: the bench (the workroom's wall), the bench from above
   (its granite) and the Great Hall.
     ge_person(ctx, who, x, y, s, o, a)  a person, faded as one picture (drawn whole, then laid down at a), never layer by layer
     ge_listCard(ctx, x, y, w, o)        the graduation list, as a card: o.kick (its date), o.a, o.k, o.on; returns bb
     ge_useCard(ctx, x, y, w, i, o)      one of the list's four uses (GE_USES[i]): its icon, its name, what it needs, its level in brass
                                         (o.level 0 to 1) and who agreed it (o.who 0 to 1); o.a, o.k, o.on; returns bb
     ge_folder(ctx, x, y, s, o)          a certificate folder, open and empty
     ge_quote(ctx, x, y, w, o)           a card of words in the middle of the wall: o.kick, o.lines (36 px), o.sub; o.a, o.k
     ge_dimChip(ctx, x, y, text, on, icon, o)  a question as a centred chip that turns brass (on 0 to 1) for the use leaning on it
   Every top-level name starts with ge_ or GE_. */

function ge_person(ctx,who,x,y,s,o,a){a=a==null?1:a;if(a<=0.004)return null;ctx.save();ctx.globalAlpha*=a;
  // dq_person lays the person down as one picture when it has light to lay over them: a trace of it here, for every person
  const h=dq_person(ctx,who,x,y,s,Object.assign({},o,{warm:Math.max((o&&o.warm)||0,1e-4)}));ctx.restore();return h;}

// the list's four uses, as Malia, Mei and Jun wrote them down in January 2026 (the example project's meta.quality, and its contract)
const GE_USES=[
  {icon:"seat",use:"Seating plan",need:"Each ceremony's count",level:"Within 2%",who:"Malia Fonoti"},
  {icon:"certificate",use:"Certificates",need:"Every name, award and date",level:"Zero wrong",who:"Malia Fonoti"},
  {icon:"programme",use:"Printed programme",need:"The certificates' names",level:"No difference",who:"Malia Fonoti"},
  {icon:"count",use:"Government's count",need:"Each award, once",level:"Exact",who:"Planning"}];

function ge_listCard(ctx,x,y,w,o){o=o||{};return dq_textCard(ctx,x,y,w,{kick:o.kick||"December 2025",title:"The graduation list",sub:o.sub},{icon:"list",a:o.a,k:o.k,on:o.on});}

function ge_useCard(ctx,x,y,w,i,o){o=o||{};const U=GE_USES[i],h=o.h||184,bb={x,y,w,h},a=o.a==null?1:o.a;if(a<=0.004)return bb;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  dq_card(ctx,x,y,w,h,{on:o.on});dq_icon(ctx,U.icon,x+DQ_PAD+26,y+62,50,DQ.ink);
  const tx=x+DQ_PAD+82;dq_T(ctx,U.use,tx,y+64,{w:800,size:36});dq_T(ctx,U.need,tx,y+106,{w:600,size:28,col:DQ.soft});
  // its level, in brass: what good means for this use; and who agreed it
  const lv=o.level==null?1:o.level;if(lv>0){ctx.save();ctx.globalAlpha*=sstep(0,0.6,lv);const cw=dq_tw(ctx,U.level,{w:700,size:28})+44;
    if(o.k==null||lv>=1)dq_chip(ctx,x+w-DQ_PAD-cw,y+56,U.level,{col:"brass",on:o.on});else{ctx.save();ag_about(ctx,x+w-DQ_PAD-cw/2,y+56,lerp(0.7,1,ag_spr(lv,0,0.5)));dq_chip(ctx,x+w-DQ_PAD-cw,y+56,U.level,{col:"brass",on:o.on});ctx.restore();}
    ctx.restore();}
  const wh=o.who||0;if(wh>0)dq_T(ctx,"Agreed with "+U.who,tx,y+148,{w:700,size:28,col:"brass",a:sstep(0,0.6,wh)});
  ctx.restore();return bb;}

// a certificate folder, open and empty: dark leather outside, cream inside, a ribbon across the right page where the certificate goes
function ge_folder(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);
  if(o.k!=null){const k=lerp(0.7,1,ag_spr(o.k,0,0.5));ctx.scale(k,k);}
  ctx.save();dq_shadow(ctx,o.on||"granite");ctx.fillStyle="rgb(44,36,40)";rr(ctx,-250,-170,500,340,14);ctx.fill();ctx.restore();
  ctx.fillStyle="rgb(58,48,54)";rr(ctx,-250,-170,500,340,14);ctx.fill();ctx.fillStyle="rgba(255,255,255,0.06)";ctx.fillRect(-2,-170,4,340);
  for(const sx of [-1,1]){ctx.fillStyle="rgb(240,232,214)";rr(ctx,sx<0?-232:12,-150,220,300,6);ctx.fill();ctx.strokeStyle="rgba(150,126,90,0.5)";ctx.lineWidth=1.6;rr(ctx,sx<0?-222:22,-140,200,280,4);ctx.stroke();}
  // the two corners that would hold the certificate, holding nothing
  ctx.fillStyle="rgba(58,48,54,0.85)";for(const [cx,cy,r] of [[32,-130,0],[202,130,Math.PI]]){ctx.save();ctx.translate(cx,cy);ctx.rotate(r);ctx.beginPath();ctx.moveTo(-10,-10);ctx.lineTo(34,-10);ctx.lineTo(-10,34);ctx.closePath();ctx.fill();ctx.restore();}
  ctx.restore();}

function ge_quote(ctx,x,y,w,o){o=o||{};const lines=o.lines||[],h=DQ_PAD*2+(o.kick?44:0)+lines.length*54+(o.sub?72:0),bb={x,y,w,h},a=o.a==null?1:o.a;if(a<=0.004)return bb;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));dq_card(ctx,x,y,w,h,{on:o.on,edge:o.edge});let yy=y+DQ_PAD+28;
  if(o.kick){dq_label(ctx,x+w/2,yy,o.kick,{align:"center"});yy+=44;}
  for(const l of lines){yy+=8;dq_T(ctx,l,x+w/2,yy+16,{w:800,size:44,align:"center"});yy+=46;}
  if(o.sub)dq_T(ctx,o.sub,x+w/2,yy+34,{w:600,size:30,align:"center",col:DQ.soft,a:o.subA==null?1:o.subA});
  ctx.restore();return bb;}

// a question as a chip that turns brass for the use that leans on it. dq_chip lays out with or without an icon, so a chip that gains
// one would jump: this one widens, fades its icon in and slides its words over, together, as on goes from 0 to 1
function ge_dimChip(ctx,x,y,text,on,icon,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const size=o.size||34,e=sstep(0,1,on),B=dq_tone("brass"),
    mix=(p,q)=>p.map((v,i)=>Math.round(lerp(v,q[i],e))),w=dq_tw(ctx,text,{w:700,size})+lerp(44,84,e),h=size+26,bx=x-w/2,by=y-h/2;
  ctx.save();ctx.globalAlpha*=a;
  ctx.save();dq_shadow(ctx,o.on,0.45);ctx.shadowBlur=10;rr(ctx,bx,by,w,h,h/2);ctx.fillStyle=rgba(DQ.paper,1);ctx.fill();ctx.restore();
  ctx.lineWidth=lerp(1.4,2.4,e);ctx.strokeStyle=rgba(mix([110,90,66],B.col),lerp(0.45,1,e));rr(ctx,bx+1,by+1,w-2,h-2,h/2);ctx.stroke();
  if(e>0.004)dq_icon(ctx,icon,bx+36,y,30,B.word,{a:e});
  dq_T(ctx,text,bx+lerp(22,62,e),y+size*0.36,{w:700,size,col:mix(DQ.ink,B.word)});ctx.restore();}
