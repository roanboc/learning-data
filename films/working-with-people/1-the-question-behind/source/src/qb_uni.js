/* ===== The question behind the request: the university, 2027 =====
   The film's own pictures for the data team's year (prefix qb_). The module's kit draws the rooms, the people, the sheets and the things
   in them, and is never changed for this film; what is here is this film's alone:
     qbGraham, qbMorning                 Graham's office on a grey day, and the team's room on a March morning, as Many hats, one picture
                                         paints them (the same light and the same wall, so they are the same rooms)
     qb_email(ctx, x, y, w, h, o)        Graham's email on a screen: who, when, and his one line (o.hl: the line picked out)
     qb_dash(ctx, x, y, w, h, o)         a dashboard of room use: a big share, bars by week, a line by building (o.grey: faded)
     qb_page(ctx, x, y, w, o)            the one page agreed with Graham: his words at the top, the question under them, then the
                                         decision, the dates, who decides, what would change his mind and what "used" means
     qb_form(ctx, x, y, w, h, o)         the team's front door from June: a form of five questions, on a screen
     qb_building(ctx, o)                 the teaching building cut open, made small: each room lit when it's booked, people in it when
                                         it's used, an amber line round a room booked with nobody in it
     qb_whys(ctx, t, t0, x, y, o)        "Why?" five times, one after another
   Colour keeps the module's meaning: orange the data (the bookings, the head counts, the dashboard), blue the plan (the question agreed,
   the page), green what's agreed or done, amber a risk or a wait (a guess at a solution, the request waiting its turn, a room booked
   with nobody in it). */

/* ---------------------------------------------------------------- the places */
AG_PLACES.qbGraham=c=>lp_paintRoom(c,{light:"grey",seed:3});
AG_PLACES.qbMorning=c=>lp_paintRoom(c,{light:"morning",seed:2});

/* ---------------------------------------------------------------- what a screen shows: Graham's email, a dashboard, the front door
   Each draws inside a screen's glass (lp_screen's o.draw), so one screen can show one, then the other: qb_screen(ctx, x, y, w, h, parts),
   parts [[what, a, o], ...], each at its own opacity (the first leaves before the next comes in, so their words never show twice). */
function qb_screen(ctx,x,y,w,h,parts,o){o=o||{};lp_screen(ctx,x,y,w,h,{a:o.a,draw:(c,X,Y,Wd,Hd)=>{for(const [fn,a,po] of parts){if(!(a>0.004))continue;c.save();c.globalAlpha*=a;fn(c,X,Y,Wd,Hd,po||{});c.restore();}}});}
// Graham's email: who, when, and his one line (o.hl: the line picked out)
function qb_emailIn(c,X,Y,Wd,Hd,o){c.fillStyle="rgb(236,234,230)";c.fillRect(X,Y,Wd,118);c.fillStyle="rgba(60,50,46,0.12)";c.fillRect(X,Y+118,Wd,2);
  lp_T(c,"From: Graham Ellis, Facilities",X+36,Y+50,{w:700,size:28});lp_T(c,"To: the data team",X+36,Y+94,{w:600,size:28,col:LP.mut});
  lp_T(c,"Thursday 11 February 2027",X+Wd-36,Y+94,{w:600,size:28,col:LP.mut,align:"right"});
  lp_T(c,"Room use",X+36,Y+186,{w:800,size:36});
  const s="Could I have a dashboard of room use, by Easter?",hl=ag_sine(o.hl||0),ly=Y+268;if(hl>0){c.fillStyle=rgba(LP.sun,0.6*hl);c.fillRect(X+28,ly-36,lp_tw(c,s,{w:600,size:32})*hl+16,48);}
  lp_T(c,s,X+36,ly,{w:600,size:32});lp_T(c,"Thanks, Graham",X+36,ly+64,{w:600,size:28,col:LP.mut});}
// a dashboard of room use, what the request literally asks for: a big share, bars by week, a line by building (o.u: drawn in; o.grey)
function qb_dashIn(c,X,Y,Wd,Hd,o){const g=o.grey||0,col=mix(LP.orange,[170,166,160],g),u=o.u==null?1:o.u;lp_T(c,"Room use",X+36,Y+58,{w:800,size:36});
  c.fillStyle="rgba(60,50,46,0.06)";rr(c,X+30,Y+86,Wd*0.32,Hd-116,10);c.fill();rr(c,X+Wd*0.36,Y+86,Wd*0.6,(Hd-130)/2,10);c.fill();rr(c,X+Wd*0.36,Y+100+(Hd-130)/2,Wd*0.6,(Hd-130)/2,10);c.fill();
  lp_T(c,"38%",X+30+Wd*0.16,Y+86+(Hd-116)/2+20,{w:800,size:72,align:"center",col:col,a:ag_in(u,0,0.3)});lp_T(c,"Booked",X+30+Wd*0.16,Y+86+(Hd-116)/2+70,{w:600,size:28,align:"center",col:LP.mut});
  const bx=X+Wd*0.36+24,bw=Wd*0.6-48,by=Y+86+(Hd-130)/2-18;for(let i=0;i<13;i++){const v=0.35+0.25*Math.sin(i*1.3)+0.1*Math.cos(i*0.7),bh=((Hd-130)/2-56)*v*ag_eo(clamp(u*2-i*0.06,0,1));
    c.fillStyle=rgba(col,1);c.fillRect(bx+i*bw/13+4,by-bh,bw/13-8,bh);}
  lp_T(c,"By week",bx,Y+86+36,{w:600,size:28,col:LP.mut});
  const ly0=Y+100+(Hd-130)/2,lh=(Hd-130)/2;lp_T(c,"By building",bx,ly0+36,{w:600,size:28,col:LP.mut});c.strokeStyle=rgba(col,1);c.lineWidth=4;c.lineJoin="round";c.beginPath();
  for(let i=0;i<=20;i++){const px=bx+i*bw/20,py=ly0+lh-24-(lh-70)*(0.4+0.25*Math.sin(i*0.8+1)+0.1*Math.sin(i*2.1))*clamp(u*1.5,0,1);i?c.lineTo(px,py):c.moveTo(px,py);}c.stroke();
  if(g>0){c.fillStyle=rgba([236,234,230],0.4*g);c.fillRect(X,Y,Wd,Hd);}}
const qb_email=(ctx,x,y,w,h,o)=>qb_screen(ctx,x,y,w,h,[[qb_emailIn,1,o]],o),qb_dash=(ctx,x,y,w,h,o)=>qb_screen(ctx,x,y,w,h,[[qb_dashIn,1,o]],o);

/* ---------------------------------------------------------------- the one page, agreed with Graham
   His words at the top, the question under them (blue: the plan), then the rows. o: a, k (spring), light; words, q (0 to 1: each comes
   in); rows (one 0 to 1 per row); hl (0 to 1: his words and the question joined, picked out); tick (0 to 1: answered, a green tick by
   the question); compact (only his words and the question, for the title). Returns the sheet's box. */
const QB_ROWS=[["Decision:","ask the University Council for a new building?"],["When:","paper due 1 June; the University Council decides 24 June"],
  ["Who decides:","the University Council, on his advice"],["Changes his mind:","rooms short at every hour, or only at some"],["“Used”:","people in the room, not a booking"]];
function qb_pageLayout(ctx,w,compact){const inner=w-2*LP_PAD,ql=lp_wrap(ctx,"Do we have too few rooms, or too few at some hours?",inner,{w:800,size:40});let y=LP_PAD+44;
  const L={words:y+40};y+=40+44;L.arrow=y;y+=34;L.qk=y+30;y+=30;L.q=ql.map((l,i)=>y+44+i*50);y+=ql.length*50+12;L.ql=ql;
  if(!compact){y+=20;L.rule=y;y+=4;L.rows=QB_ROWS.map(r=>{const lw=lp_tw(ctx,r[0]+" ",{w:800,size:28}),vl=lp_wrap(ctx,r[1],inner-34-lw,{w:600,size:28}),top=y;y+=vl.length*38+12;return{top,vl,lw};});}
  L.h=y+LP_PAD-4;return L;}
function qb_page(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,L=qb_pageLayout(ctx,w,o.compact),h=L.h,bb={x,y,w,h};if(a<=0.004)return bb;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.blue,light:o.light===undefined?"day":o.light,pin:o.pin});const X=x+LP_PAD,wa=o.words==null?1:o.words,qa=o.q==null?1:o.q,hl=ag_sine(o.hl||0);
  // his words, as he wrote them
  if(wa>0){ctx.save();ctx.globalAlpha*=ag_sine(wa);lp_T(ctx,"HIS WORDS",X,y+L.words-44,{w:800,size:28,ls:3,col:LP.mut});
    if(hl>0){ctx.fillStyle=rgba(LP.sun,0.5*hl);ctx.fillRect(X-8,y+L.words-34,lp_tw(ctx,"“A dashboard of room use, by Easter”",{w:600,size:32})+16,46);}
    lp_T(ctx,"“A dashboard of room use, by Easter”",X,y+L.words,{w:600,size:32});ctx.restore();}
  // the arrow from his words to the question
  if(qa>0){ctx.save();ctx.globalAlpha*=ag_sine(qa);ctx.strokeStyle=rgba(hl>0?LP.blue:LP.mut,0.6+0.4*hl);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(X+18,y+L.arrow-6);ctx.lineTo(X+18,y+L.arrow+26);
    ctx.moveTo(X+8,y+L.arrow+16);ctx.lineTo(X+18,y+L.arrow+28);ctx.lineTo(X+28,y+L.arrow+16);ctx.stroke();
    lp_T(ctx,"THE QUESTION BEHIND IT",X,y+L.qk,{w:800,size:28,ls:3,col:LP.blue});
    L.ql.forEach((l,i)=>lp_T(ctx,l,X,y+L.q[i],{w:800,size:40}));ctx.restore();}
  if(o.tick>0){const tx=x+w-LP_PAD-22,ty=y+L.qk-10,f=lerp(0.6,1,ag_spr(o.tick,0,0.5));ctx.save();ctx.globalAlpha*=clamp(o.tick*3,0,1);ctx.fillStyle=rgba(LP.green,1);ctx.beginPath();ctx.arc(tx,ty,22*f,0,TAU);ctx.fill();lp_icon(ctx,"tick",tx,ty,30*f,[255,255,255]);ctx.restore();}
  if(!o.compact){const R=o.rows||[];if(R.some(v=>v>0)){ctx.fillStyle=rgba(LP.mut,0.25);ctx.fillRect(X,y+L.rule,w-2*LP_PAD,2);}
    L.rows.forEach((r,j)=>{const u=R[j]||0;if(u<=0)return;ctx.save();ctx.globalAlpha*=ag_sine(clamp(u,0,1));const ty=y+r.top+38;
      ctx.fillStyle=rgba(LP.blue,1);ctx.beginPath();ctx.arc(X+8,ty-10,6,0,TAU);ctx.fill();lp_T(ctx,QB_ROWS[j][0],X+34,ty,{w:800,size:28,col:LP.mut});
      r.vl.forEach((l,i)=>lp_T(ctx,l,X+34+r.lw,ty+i*38,{w:600,size:28}));ctx.restore();});}
  ctx.restore();return bb;}

/* ---------------------------------------------------------------- the team's front door, from June: five questions on a form */
const QB_FORM=["What decision is it for?","By when?","Who decides?","What data do you already use?","Who else needs it?"];
function qb_formIn(c,X,Y,Wd,Hd,o){c.fillStyle="rgb(236,234,230)";c.fillRect(X,Y,Wd,84);lp_T(c,"Ask the data team",X+36,Y+56,{w:800,size:36});
  QB_FORM.forEach((q,i)=>{const u=o.u==null?1:clamp(o.u*QB_FORM.length-i,0,1);if(u<=0)return;const ty=Y+136+i*((Hd-150)/5);c.save();c.globalAlpha*=ag_sine(u);
    lp_T(c,(i+1)+"   "+q,X+36,ty,{w:600,size:28});c.strokeStyle="rgba(60,50,46,0.25)";c.lineWidth=2;c.strokeRect(X+36,ty+14,Wd-72,30);c.restore();});}
const qb_form=(ctx,x,y,w,h,o)=>qb_screen(ctx,x,y,w,h,[[qb_formIn,1,o]],o);

/* ---------------------------------------------------------------- the teaching building cut open, made small
   The module's LP_TEACHING drawn at sc of its size (0.5) with its ground's left end at (ox, the ground), each room lit when it's booked
   (o.lit: id -> 0 to 1), the people in it when it's used (o.used: id -> 0 to 1), an amber line round a room booked with nobody in it
   (o.edge: id -> 0 to 1). The people are painted once, in every teaching room, and shown room by room. */
const QB_TEACH=["G.01","G.03","1.01","1.02","1.03","1.04","2.01","2.02","2.03","3.01","3.02","3.03"];
const QB_SEATS={"G.01":[0.1,0.28,0.46,0.64,0.82],"G.03":[0.15,0.42,0.7,0.9],"1.01":[0.2,0.6],"1.02":[0.15,0.5,0.85],"1.03":[0.3,0.7],"1.04":[0.2,0.55,0.9],
  "2.01":[0.25,0.6],"2.02":[0.1,0.4,0.7],"2.03":[0.2,0.5,0.8],"3.01":[0.35,0.7],"3.02":[0.1,0.4,0.75],"3.03":[0.3,0.65]};
function qb_students(){return ag_kept("qbStudents",W,H,(c)=>{let n=0;for(const id of QB_TEACH)for(const u of QB_SEATS[id]){const p=lp_seat(LP_TEACHING,id,u,0.17);
  lp_person(c,lp_crowd(n*3+2),p.x,p.y,p.s,{cut:p.cut,flip:n%3===1,t:n*0.7,light:{wall:0}});n++;}});}
function qb_building(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const sc=o.sc||0.5,ox=o.ox==null?100:o.ox,gy=LP_TEACHING.ground,lit=o.lit||{},used=o.used||{},edge=o.edge||{};
  ctx.save();ctx.globalAlpha*=a;ctx.translate(ox,gy);ctx.scale(sc,sc);ctx.translate(-LP_TEACHING.x0,-gy);
  lp_section(ctx,LP_TEACHING,{room:(id)=>({lit:lit[id]||0,edge:edge[id]>0?LP.amber:null,edgeA:edge[id]||0})});
  const pp=qb_students();for(const id of QB_TEACH){const l=used[id]||0;if(l<=0.004)continue;const r=lp_roomBox(LP_TEACHING,id);ctx.save();ctx.globalAlpha*=l;ctx.beginPath();ctx.rect(r.x,r.y,r.w,r.h);ctx.clip();ctx.drawImage(pp,0,0);ctx.restore();}
  ctx.restore();}
// where a room of the small building is, in the frame: {x, y, w, h}
function qb_roomAt(id,o){const sc=o.sc||0.5,ox=o.ox==null?100:o.ox,gy=LP_TEACHING.ground,r=lp_roomBox(LP_TEACHING,id);return{x:ox+(r.x-LP_TEACHING.x0)*sc,y:gy+(r.y-gy)*sc,w:r.w*sc,h:r.h*sc};}

/* ---------------------------------------------------------------- "Why?", five times, one after another, each in amber (o.a fades
   them all; o.gap between them) */
function qb_whys(ctx,t,t0,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const gap=o.gap||210;
  for(let i=0;i<5;i++){const ai=ag_in(t,t0+i*0.32,0.3)*a;if(ai<=0.004)continue;lp_tag(ctx,x+i*gap,y,"Why?",{align:"center",col:LP.amber,a:ai});}}
