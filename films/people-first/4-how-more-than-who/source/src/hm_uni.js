/* ===== How, more than who: the university in February 2027, and what this film adds to the gorge =====
   The film's own pictures (prefix hm_). The module's kit draws the rooms, the people, the sheets and the things in them, and is never
   changed for this film; the gorge, the bridge and the communities' people are the series' shared drawing, copied into this film's
   source (hm_place.js, hm_bridge.js, hm_people.js). What is here is this film's alone:
     hmWed, hmMorning, hmFri        the team's room, one room in three lights: Wednesday 24 February by day, a morning (Thursday 25
                                    February, and Monday 1 March), and Friday 26 February late in the afternoon
     HM_MARTA, HM_ERIN, HM_TOMAS    Marta Silva, Erin Walsh and Tomás Ortega, copied from the module's numbers as they are
     hm_team(ctx, t, o)             the eight at the team's table, Tomás and Jun at its two ends
     hm_say(ctx, x, y, text, to, o) words said aloud: an outlined slip with a tail towards whoever says them
     hm_marks(ctx, t, o)            a ring above each of the eight, filled when their turn has come
     hm_count, hm_door              a number card that waits for its number; the room's door, open on a lit corridor
     hm_quote, hm_five              the study of 180 teams: its sentence as it's written, and its list of five, in its order
     hm_three(ctx, x, y, w, o)      the three things, as a table on the wall: what you saw, what you feel and need, what you ask
     hm_page(ctx, x, y, w, o)       the team's page, How we work together: five lines, in their own words
     hm_glossary(ctx, x, y, w, o)   the glossary's two words, student and learner, and who owns them
     hm_split(ctx, x, y, w, o)      the two numbers as one bar: the students, and the people on short courses beside them
     hm_talkBars(ctx, x, y, w, h, vals, o)   how much each member of a small group spoke
     hm_chain(ctx, t, o)            a data team's work as four parts, each leaning on the one before
     hm_print(ctx, x, y, w, o)      a print of the gorge and its new bridge, for the team's wall
     hm_banks(ctx, t, o)            the families and the men on the two banks of the gorge
     hm_fall(ctx, s, o)             last year's bridge cut loose, falling into the river
     hm_label, hm_measure           a tag or a measure fixed to a place in the gorge, the same size on screen however near the camera is
   Colour keeps the module's meaning: orange the data (the two numbers), blue plans and what is agreed about how to work (the three
   things, the team's page), green what is done or kept (a cord checked in, a promise kept, a word in the glossary), amber a risk (a
   disagreement that has turned to the person). A person is never a colour. */

/* ---------------------------------------------------------------- the places */
AG_PLACES.hmWed=c=>lp_paintRoom(c,{light:"day",seed:13});
AG_PLACES.hmMorning=c=>lp_paintRoom(c,{light:"morning",seed:13});
AG_PLACES.hmFri=c=>lp_paintRoom(c,{light:"late",seed:13});
AG_ROOMS.hmMorning="hmWed";AG_ROOMS.hmFri="hmWed";

/* ---------------------------------------------------------------- the three who are new to the screen
   As the module's numbers set them (/mnt/project-files/leading-data-people/numbers.md), with keys of this film's own. */
const HM_MARTA={name:"Marta Silva",role:"Data analyst",key:"hm-marta",skin:[156,108,80],hair:{style:"coily",c:[40,30,26]},earrings:[214,180,120],top:{kind:"cardigan",c:[168,150,126],inner:[70,66,70]},breath:0.3};
const HM_ERIN={name:"Erin Walsh",role:"Platform engineer",key:"hm-erin",skin:[232,196,170],hair:{style:"bun",c:[132,76,48]},earrings:[214,200,170],top:{kind:"sweater",c:[126,106,96]},breath:0.28};
const HM_TOMAS={name:"Tomás Ortega",role:"Report developer",key:"hm-tomas",skin:[198,150,114],hair:{style:"side",c:[46,36,30],streak:[120,108,100]},beard:[58,46,40],top:{kind:"cardigan",c:[112,100,88],inner:[226,222,214]},breath:0.27};

/* ---------------------------------------------------------------- the eight at the team's table
   Left to right. Tomás and Jun sit at its two ends, so their disagreement runs the length of the table, and Tomás and Yusuf, who look
   alike at this size, are far apart. The four on the left face right, the four on the right face left. */
const HM_SEATS=[["tomas",170],["marta",396],["sam",621],["helena",847],["noor",1073],["erin",1299],["yusuf",1524],["jun",1750]];
const HM_WHO={tomas:HM_TOMAS,marta:HM_MARTA,sam:"sam",helena:"helena",noor:"noor",erin:HM_ERIN,yusuf:"yusuf",jun:"jun"};
const HM_ROW={y:704,s:0.6,cut:838,table:844,head:520};
const hm_seat=id=>HM_SEATS.find(s=>s[0]===id)[1];
// a mouth that opens and closes while someone speaks, from t0 to t1
const hm_talk=(t,t0,t1)=>ag_io(t,t0,t1,0.12)*(0.3+0.7*Math.abs(Math.sin(t*10.3)*Math.sin(t*3.7+1.1)));
// o.light; o.talk, o.nod, o.gaze {id: value}; o.a (all of them, with their table)
function hm_team(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const lt={light:o.light||"day"};ctx.save();ctx.globalAlpha*=a;
  HM_SEATS.forEach(([id,px],i)=>{lp_person(ctx,HM_WHO[id],px,HM_ROW.y,HM_ROW.s,{t,flip:i>=4,cut:HM_ROW.cut,light:lt,talk:o.talk&&o.talk[id]||0,nod:o.nod&&o.nod[id]||0,gaze:o.gaze&&o.gaze[id]});});
  lp_table(ctx,14,HM_ROW.table,1892);ctx.restore();}

/* ---------------------------------------------------------------- a turn each
   A small ring above each of the eight; it fills when that person's turn has come. o.at {id: t0} when each one's does (others stay
   rings); o.col {id: colour} (blue unless given); o.a. */
function hm_marks(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  HM_SEATS.forEach(([id,px])=>{const y=HM_ROW.head-34,t0=o.at&&o.at[id],f=t0==null?0:ag_in(t,t0,0.3),col=(o.col&&o.col[id])||LP.blue;
    ctx.fillStyle="rgba(250,247,240,0.96)";ctx.beginPath();ctx.arc(px,y,15,0,TAU);ctx.fill();ctx.strokeStyle=rgba(mix(LP.mut,col,f),0.9);ctx.lineWidth=3;ctx.beginPath();ctx.arc(px,y,13.5,0,TAU);ctx.stroke();
    if(f>0.004){ctx.fillStyle=rgba(col,f);ctx.beginPath();ctx.arc(px,y,8.5*lerp(0.5,1,ag_spr(t,t0,0.5)),0,TAU);ctx.fill();}});
  ctx.restore();}

/* ---------------------------------------------------------------- a number that is on its way
   The kit's figure card with its number left out until it is known: o.a and o.k the card's, o.n the number's opacity. Data: orange. */
function hm_count(ctx,x,y,w,kick,num,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;lp_figure(ctx,x,y,w,{kick,num:""},{a,k:o.k,light:o.light});
  const n=(o.n||0)*a;if(n>0.004)lp_T(ctx,num,x+LP_PAD,y+LP_PAD+30+44+92,{w:800,size:96,col:LP.orange,a:n});}

/* ---------------------------------------------------------------- the door of the team's room
   The kit's timber door in the far wall, open by op (0 to 1): beyond it a lit corridor, and its light on the floor in front. o.a. */
function hm_door(ctx,x,y,w,h,op,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;lp_door(ctx,x,y,w,h,{open:op,a});if(op<=0.004)return;const dw=w*(1-op*0.8);ctx.save();ctx.globalAlpha*=a;
  let g=ctx.createLinearGradient(0,y,0,y+h);g.addColorStop(0,rgba([248,236,210],1));g.addColorStop(0.7,rgba([240,224,192],1));g.addColorStop(1,rgba([216,194,156],1));ctx.fillStyle=g;ctx.fillRect(x+dw,y,w-dw,h);
  ctx.fillStyle=rgba(LP.shade,0.2);ctx.fillRect(x+dw,y,7,h);
  g=ctx.createLinearGradient(0,y+h,0,y+h+130);g.addColorStop(0,rgba([255,238,204],0.34*op));g.addColorStop(1,rgba([255,238,204],0));ctx.fillStyle=g;
  ctx.beginPath();ctx.moveTo(x+dw,y+h);ctx.lineTo(x+w,y+h);ctx.lineTo(x+w+60,y+h+130);ctx.lineTo(x+dw-36,y+h+130);ctx.closePath();ctx.fill();ctx.restore();}

/* ---------------------------------------------------------------- sheets, tags and pills that come and go
   The module's own, timed: in at t0, out at o.out or t1. */
function hm_sheet(ctx,t,t0,x,y,w,words,o){o=o||{};const a=ag_in(t,t0,0.35)*(o.out!=null?1-ag_in(t,o.out,0.4):1);if(a<=0.004)return null;
  return lp_textSheet(ctx,x,y,w,words,Object.assign({},o,{a,k:t-t0}));}
const hm_u=(t,ts)=>ts.reduce((s,t0)=>s+ag_in(t,t0,0.5),0)/ts.length;
function hm_tag(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_tag(ctx,x,y,text,Object.assign({},o,{a}));}
function hm_pill(ctx,t,t0,t1,x,y,text,o){const a=ag_in(t,t0,0.4)*(t1==null?1:1-ag_in(t,t1,0.4));if(a>0.004)lp_pill(ctx,x,y,text,Object.assign({},o,{a,k:t-t0}));}
function hm_kick(ctx,S,a,o){if(a<=0.004)return;setScreen(ctx,S);lp_kicker(ctx,"4","How, more than who",Object.assign({a},o||{}));}

/* ---------------------------------------------------------------- words said aloud
   A slip of paper with an outline in o.col, its words wrapped at o.w, and a small tail from its lower edge towards the speaker at
   x = to, so it's clear who says them when eight people sit in a row. A "\n" in the words starts a new line. o.align ("center" by
   default), o.a, o.k. Returns its box. */
function hm_say(ctx,x,y,text,to,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return null;const col=o.col||LP.ink,size=28,lh=38,
    L=String(text).split("\n").reduce((l,s)=>l.concat(lp_wrap(ctx,s,o.w||560,{w:700,size})),[]),tw=Math.max.apply(null,L.map(s=>lp_tw(ctx,s,{w:700,size}))),w=tw+56,h=L.length*lh+30,
    bx=o.align==="left"?x:o.align==="right"?x-w:x-w/2,by=y-h/2;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,bx+w/2,y,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  ctx.save();ctx.shadowColor="rgba(52,36,30,0.22)";ctx.shadowBlur=12;ctx.shadowOffsetX=LP.sdx*0.4;ctx.shadowOffsetY=5;rr(ctx,bx,by,w,h,22);ctx.fillStyle="rgba(250,247,240,0.97)";ctx.fill();ctx.restore();
  ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.5;rr(ctx,bx+1,by+1,w-2,h-2,21);ctx.stroke();
  if(to!=null){const rx=clamp(to,bx+40,bx+w-40),ry=by+h,tx=rx+clamp((to-rx)*0.5,-18,18);
    ctx.fillStyle="rgba(250,247,240,1)";ctx.beginPath();ctx.moveTo(rx-13,ry-4);ctx.lineTo(tx,ry+20);ctx.lineTo(rx+13,ry-4);ctx.closePath();ctx.fill();
    ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.5;ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(rx-12,ry-1);ctx.lineTo(tx,ry+20);ctx.lineTo(rx+12,ry-1);ctx.stroke();}
  L.forEach((s,i)=>lp_T(ctx,s,bx+w/2,by+43+i*lh,{w:700,size,align:"center",col}));
  ctx.restore();return{x:bx,y:by,w,h};}

/* ---------------------------------------------------------------- the study of 180 teams
   hm_quote: the study's sentence as its guide writes it (checked 12 November 2026), in three parts: o.u [a, a, a]. The part about
   who is in muted ink, the part about how in blue. hm_five: its list, in its order. o.u [a x 5] each row; o.sub [a x 5] the plain
   words under a row; o.hi {row: colour} and o.hiA {row: a} mark the two that are this film's. o.light, o.a, o.k. Each returns its box. */
const HM_QUOTE=["“…what really mattered was","less about who is on the team,","and more about how the team worked together.”"];
function hm_quote(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,lh=54,h=LP_PAD+30+44+3*lh+20+38+LP_PAD-10,bb={x,y,w,h};
  if(o.measure||a<=0.004)return bb;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{light:o.light});let yy=y+LP_PAD+30;
  lp_T(ctx,"WHAT IT FOUND",x+LP_PAD,yy+14,{w:800,size:28,ls:3,col:LP.mut});yy+=44;
  HM_QUOTE.forEach((s,i)=>{yy+=lh;const la=o.u?(o.u[i]||0):1;if(la>0.004)lp_T(ctx,s,x+LP_PAD,yy,{w:i===2?800:600,size:36,col:i===1?LP.mut:i===2?LP.blue:LP.ink,a:ag_sine(la)});});
  yy+=20+38;lp_T(ctx,"Google re:Work, “Understand team effectiveness”",x+LP_PAD,yy,{w:600,size:28,col:LP.mut});
  ctx.restore();return bb;}
const HM_FIVE=[["Psychological safety","People speak up when it's safe to"],["Dependability","Keeping your word"],["Structure and clarity","Clear about who does what"],["Meaning",""],["Impact",""]];
function hm_five(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,rh=HM_FIVE.map(r=>r[1]?98:60),h=LP_PAD+30+44+10+rh.reduce((s,v)=>s+v,0)+LP_PAD-22,bb={x,y,w,h};
  if(o.measure||a<=0.004)return bb;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{light:o.light});let yy=y+LP_PAD+30;
  lp_T(ctx,"IN ORDER OF IMPORTANCE",x+LP_PAD,yy+14,{w:800,size:28,ls:3,col:LP.mut});yy+=44+10;
  HM_FIVE.forEach(([name,sub],n)=>{const la=o.u?(o.u[n]||0):1,sa=o.sub?(o.sub[n]==null?1:o.sub[n]):1,hc=o.hi&&o.hi[n],ha=hc?(o.hiA&&o.hiA[n])||0:0,col=sub?LP.ink:LP.mut;
    if(ha>0.004){ctx.fillStyle=rgba(hc,0.13*ha);ctx.fillRect(x+10,yy+2,w-20,rh[n]-8);ctx.fillStyle=rgba(hc,ha);ctx.fillRect(x+10,yy+2,7,rh[n]-8);}
    if(la>0.004){ctx.save();ctx.globalAlpha*=ag_sine(la);
      lp_T(ctx,String(n+1),x+LP_PAD,yy+42,{w:800,size:34,col:LP.mut});lp_T(ctx,name,x+LP_PAD+48,yy+42,{w:800,size:34,col});
      if(sub&&sa>0.004)lp_T(ctx,sub,x+LP_PAD+48,yy+82,{w:600,size:28,col:LP.mut,a:sa});ctx.restore();}
    yy+=rh[n];});
  ctx.restore();return bb;}

/* ---------------------------------------------------------------- the three things
   A table on the wall: a column for each of the three things Helena asks for, a row for each person who says them. o.head [a, a, a]
   the headings' opacity; o.rows [{name, cells: [three], u: [a, a, a], a}]; o.light, o.a, o.k. Returns its box. */
const HM_THREE=["What you saw","What you feel and need","What you ask"];
function hm_three(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,nw=140,pad=22,lh=36,cw=(w-nw-pad)/3,rows=o.rows||[],
    wr=rows.map(r=>r.cells.map(s=>lp_wrap(ctx,s,cw-2*pad,{w:600,size:28}))),rh=wr.map(r=>Math.max.apply(null,r.map(l=>l.length))*lh+2*pad-4),hh=74,
    h=12+hh+rh.reduce((s,v)=>s+v,0)+8,bb={x,y,w,h};
  if(a<=0.004)return bb;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.blue,light:o.light,pin:false});
  HM_THREE.forEach((s,i)=>{const ha=o.head?o.head[i]:1;if(ha>0.004)lp_T(ctx,s,x+nw+i*cw+pad,y+12+48,{w:800,size:30,col:LP.blue,a:ha});});
  let yy=y+12+hh;
  rows.forEach((r,n)=>{const ra=r.a==null?1:r.a;if(ra>0.004){ctx.save();ctx.globalAlpha*=ra;
      ctx.fillStyle=rgba(LP.mut,0.22);ctx.fillRect(x+pad,yy,w-2*pad,2);lp_T(ctx,r.name,x+pad,yy+pad+24,{w:800,size:28});
      r.cells.forEach((s,i)=>{const ca=r.u?r.u[i]:1;if(ca<=0.004)return;wr[n][i].forEach((l,k)=>lp_T(ctx,l,x+nw+i*cw+pad,yy+pad+24+k*lh,{w:600,size:28,a:ca}));});
      ctx.restore();}
    yy+=rh[n];});
  ctx.restore();return bb;}

/* ---------------------------------------------------------------- the team's page
   How we work together: five lines, as the module's numbers have them. o.u how many lines are written (0 to 5; a part of a line
   fades in), or [a, ...] each line's opacity; o.body false: each line's heading only, with a rule where its words are (the page seen
   from further off); o.hi a line to mark, o.hiA how strongly; o.light, o.pin, o.a, o.k, o.measure. Returns its box. */
const HM_PAGE=[["How we meet","The question the day before, and a turn each."],
  ["How we ask for help","Early, and out loud."],
  ["How we disagree","About the work, never the person. Say what you saw, what you need and what you ask."],
  ["How we decide","Whoever owns it decides, after hearing the others, and writes it down."],
  ["How we say \"I can't make that date\"","As soon as we know, with a new date."]];
function hm_page(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,inner=w-LP_PAD*2,body=o.body!==false,lh=38,gap=body?16:22,
    L=HM_PAGE.map(([hd,tx])=>({hd:lp_wrap(ctx,hd,inner,{w:800,size:28}),tx:body?lp_wrap(ctx,tx,inner,{w:600,size:28}):[]})),
    eh=L.map(l=>(l.hd.length+l.tx.length)*lh+gap),h=LP_PAD+30+44+50+10+eh.reduce((s,v)=>s+v,0)+LP_PAD-22,bb={x,y,w,h};
  if(o.measure||a<=0.004)return bb;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.blue,light:o.light,pin:o.pin===true});let yy=y+LP_PAD+30;
  lp_T(ctx,"THE DATA TEAM",x+LP_PAD,yy+14,{w:800,size:28,ls:3,col:LP.blue});yy+=44;
  lp_T(ctx,"How we work together",x+LP_PAD,yy+42,{w:800,size:40});yy+=50+10;
  L.forEach((l,n)=>{const la=o.u==null?1:typeof o.u==="number"?clamp(o.u-n,0,1):(o.u[n]||0),y0=yy;
    if(o.hi===n&&(o.hiA||0)>0.004){ctx.fillStyle=rgba(LP.green,0.14*o.hiA);ctx.fillRect(x+10,y0+4,w-20,eh[n]-6);ctx.fillStyle=rgba(LP.green,o.hiA);ctx.fillRect(x+10,y0+4,7,eh[n]-6);}
    if(la>0.004){ctx.save();ctx.globalAlpha*=ag_sine(la);let ly=y0;
      l.hd.forEach(s=>{ly+=lh;lp_T(ctx,s,x+LP_PAD,ly,{w:800,size:28,col:LP.blue});});
      if(body)l.tx.forEach(s=>{ly+=lh;lp_T(ctx,s,x+LP_PAD,ly,{w:600,size:28});});
      else{ctx.fillStyle=rgba(LP.mut,0.3);ctx.fillRect(x+LP_PAD,ly+11,inner*[0.82,0.5,0.94,0.88,0.7][n],5);}
      ctx.restore();}
    yy+=eh[n];});
  ctx.restore();return bb;}

/* ---------------------------------------------------------------- the glossary's two words
   Student and learner, as the registrar's office, which owns them, has them. o.u [a, a] each word's opacity; o.owner its last
   line's; o.light, o.pin, o.a, o.k. Returns its box. */
const HM_WORDS=[["Student","A person taking the units that make up a degree."],["Learner","A student, or a person on a short course."]];
function hm_glossary(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,inner=w-LP_PAD*2,lh=38,
    L=HM_WORDS.map(([wd,df])=>lp_wrap(ctx,df,inner,{w:600,size:28})),h=LP_PAD+30+44+L.reduce((s,l)=>s+46+l.length*lh+16,0)+lh+LP_PAD-8,bb={x,y,w,h};
  if(o.measure||a<=0.004)return bb;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.green,light:o.light,pin:o.pin===true});let yy=y+LP_PAD+30;
  lp_T(ctx,"THE GLOSSARY",x+LP_PAD,yy+14,{w:800,size:28,ls:3,col:LP.green});yy+=44;
  HM_WORDS.forEach(([wd],n)=>{const la=o.u?(o.u[n]||0):1;ctx.save();ctx.globalAlpha*=ag_sine(la);
    lp_T(ctx,wd,x+LP_PAD,yy+38,{w:800,size:36});let ly=yy+46;L[n].forEach(s=>{ly+=lh;lp_T(ctx,s,x+LP_PAD,ly,{w:600,size:28});});ctx.restore();yy+=46+L[n].length*lh+16;});
  const oa=o.owner==null?1:o.owner;if(oa>0.004)lp_T(ctx,"Owner: the registrar's office",x+LP_PAD,yy+lh-6,{w:600,size:28,col:LP.mut,a:oa});
  ctx.restore();return bb;}

/* ---------------------------------------------------------------- the two numbers as one bar
   The learners the new model counts, 19,549, as one bar: the 18,412 students the old report counts, and beside them the 1,137 people
   on short courses. o.u (0 to 1: the students' part draws on), o.v (0 to 1: the short courses' part), o.a. Data: orange. */
const HM_N={students:18412,short:1137,learners:19549};
function hm_split(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const u=ag_sine(o.u==null?1:o.u),v=ag_sine(o.v==null?1:o.v),h=56,ws=w*HM_N.students/HM_N.learners,wc=w-ws;
  ctx.save();ctx.globalAlpha*=a;
  if(u>0.004){ctx.fillStyle=rgba(LP.orange,1);ctx.fillRect(x,y,ws*u,h);ctx.save();ctx.globalAlpha*=clamp(u*2-1,0,1);
    lp_T(ctx,"18,412 students",x+22,y+h-17,{w:800,size:30,color:"#fff"});ctx.restore();}
  if(v>0.004){ctx.save();ctx.globalAlpha*=v;ctx.fillStyle=rgba(mix(LP.orange,LP.paper,0.45),1);ctx.fillRect(x+ws+4,y,wc-4,h);
    // its label above it, on a slip, with a line down to the part it names
    ctx.strokeStyle=rgba(LP.orange,1);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+ws+wc/2,y-6);ctx.lineTo(x+ws+wc/2,y-36);ctx.stroke();
    lp_tag(ctx,x+w,y-62,"+ 1,137 on short courses",{align:"right",col:LP.orange});
    ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- how much each member of a small group spoke
   Bars for a group's members, each as high as its share of the talk (vals 0 to 100). o.u (0 to 1: they grow), o.col, o.a. */
function hm_talkBars(ctx,x,y,w,h,vals,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const n=vals.length,gap=22,bw=(w-gap*(n-1))/n,u=ag_sine(o.u==null?1:o.u);
  ctx.save();ctx.globalAlpha*=a;ctx.fillStyle=rgba(LP.mut,0.5);ctx.fillRect(x,y+h,w,2);
  vals.forEach((v,i)=>{const bh=h*v/100*u,bx=x+i*(bw+gap);ctx.fillStyle=rgba(o.col||LP.orange,1);ctx.fillRect(bx,y+h-bh,bw,bh);
    // whose share it is: a head and shoulders under the bar, in ink (a person is never a colour)
    ctx.fillStyle=rgba(LP.ink,0.82);ctx.beginPath();ctx.arc(bx+bw/2,y+h+26,11,0,TAU);ctx.fill();ctx.beginPath();ctx.moveTo(bx+bw/2-19,y+h+62);ctx.quadraticCurveTo(bx+bw/2,y+h+26,bx+bw/2+19,y+h+62);ctx.closePath();ctx.fill();});
  ctx.restore();}

/* ---------------------------------------------------------------- a data team's work, in four parts
   Four sheets in a row, each leaning on the one before: an arrow from each to the next. o.at [t0, t1, t2, t3] when each comes in,
   o.out when all go; o.light. */
const HM_CHAIN=[["The platform","Loads the data"],["The model","Shapes and tests it"],["The report","Shows the numbers"],["The readers","Decide with them"]];
function hm_chain(ctx,t,o){o=o||{};const w=404,gap=40,x0=(W-4*w-3*gap)/2,y=o.y||250;
  HM_CHAIN.forEach(([k,ti],i)=>{const t0=o.at[i],x=x0+i*(w+gap);hm_sheet(ctx,t,t0,x,y,w,{kick:k,title:ti},{col:LP.orange,light:o.light,out:o.out});
    if(i){const aa=ag_in(t,t0-0.1,0.4)*(o.out!=null?1-ag_in(t,o.out,0.4):1);if(aa>0.004){ctx.save();ctx.globalAlpha*=aa;ctx.strokeStyle=rgba(LP.ink,0.85);ctx.fillStyle=rgba(LP.ink,0.85);ctx.lineWidth=4;ctx.lineCap="round";
      const ax=x-gap+6,ay=y+96;ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(ax+gap-16,ay);ctx.stroke();ctx.beginPath();ctx.moveTo(ax+gap-8,ay);ctx.lineTo(ax+gap-20,ay-8);ctx.lineTo(ax+gap-20,ay+8);ctx.closePath();ctx.fill();ctx.restore();}}});}

/* ---------------------------------------------------------------- the people on the two banks
   Families with their cord on both banks, some sitting at their work; men by the left base. o.come: the time from which more of them
   walk in along each bank (null: all there); o.men (0 to 1: the men by the left base, who go to the bridge when the work starts);
   o.kids (0 to 1: children beside their parents on the left bank); o.a. */
const HM_COME=[[0,96,-9,2,0.4],[0,188,-10,4,3.6],[0,282,-9,7,7.2],[0,238,13,5,10.6],[1,1566,-9,6,1.6],[1,1664,-10,1,5.0],[1,1762,-9,3,8.4],[1,1838,12,0,11.4]];
function hm_banks(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const L=HM_BANK.L,R=HM_BANK.R,men=o.men==null?1:o.men,kids=o.kids||0;ctx.save();ctx.globalAlpha*=a;
  // those who walk in, behind the others: from the frame's edge to their place, then they stand
  for(const [side,sx,dy,who,t0] of HM_COME){const y=(side?R.y:L.y)+dy,sp=30;let x=sx,still=1;
    if(o.come!=null){const tt=t-o.come-t0,from=side?W+30:-30,d=Math.abs(sx-from)/sp;if(tt<d){x=from+(side?-1:1)*sp*Math.max(0,tt);still=clamp((tt-(d-0.5))/0.5,0,1);}}
    hm_fig(ctx,x,y,47,{who,pose:"walk",t:t+t0,still,flip:!!side});}
  for(let i=0;i<7;i++){const x=L.x0+30+i*46,y=L.y+6+(i%2)*5;hm_fig(ctx,x,y,50,{who:[1,3,5,7][i%4],pose:i%3===2?"stand":"sit",flip:i%2===1});
    if(kids>0.004&&i%3!==2&&i%2===0)hm_fig(ctx,x+22,y+3,50,{who:[3,0,5,2][i%4],pose:"sit",kid:true,flip:false,a:kids});}
  if(men>0.004)for(let i=0;i<5;i++)hm_fig(ctx,L.x0+310+i*20-(i%2)*6,L.y-3+(i%3)*3,49,{who:[0,2,4,6][i%4],pose:"stand",flip:i%2===0,a:men});
  for(let i=0;i<8;i++)hm_fig(ctx,R.x0+20+i*40,R.y+4+(i%2)*5,50,{who:i,pose:i%4===0?"sit":"stand",flip:i%3!==0});
  ctx.restore();}

/* ---------------------------------------------------------------- last year's bridge, cut loose
   s: seconds since its far end was cut (o.from 1: its left end first, else its right). Each of its six cables falls from the cut end
   first, as a wave along it: what is near the other base swings down to hang against the wall, the rest lies on the water (about
   1.5 s). Then that end is cut too, the rest drops, and the river takes it all (hm_fallen: o.drift seconds). Before the cut the film
   draws the bridge itself. o.age. */
const HM_FALL={G:620,T1:1.55,T2:2.15,len:940,water:846};
function hm_fall(ctx,s,o){o=o||{};if(s<0)return;const F=HM_FALL,age=o.age==null?1:o.age,la=1-ag_in(s,F.T2-0.1,0.45);
  ctx.save();if(o.from){ctx.translate(W,0);ctx.scale(-1,1);}
  if(la>0.004){ctx.save();ctx.globalAlpha*=la;
    HM_CABLES.forEach((id,k)=>{const A=HM_A[id][0],rail=id[0]==="r",off=(k%4)*4-6,wy=x=>F.water+off*0.7+4*Math.sin(x*0.021+k),uw=(F.water-A[1])/F.len,P=[];
      for(let i=0;i<=44;i++){const u=i/44,C=hm_at(id,u,{age}),
          // where this part of the cable comes to rest: hanging from the base down the wall, or lying on the water beyond
          rest=u<uw?[A[0]+44*(u/uw)+6*Math.sin(u*40),A[1]+u*F.len]:[A[0]+44+(u-uw)*F.len*0.93,wy(A[0]+(u-uw)*F.len)],
          d=(1-u)*0.5,f=clamp(0.5*F.G*Math.pow(Math.max(0,s-d),2)/Math.max(1,rest[1]-C[1]),0,1);
        let x=lerp(C[0],rest[0],f*f*(3-2*f)),y=lerp(C[1],rest[1],f);
        // the second cut: what hung from the base drops to the water too
        if(s>F.T1&&u<uw){const g=clamp(0.5*F.G*Math.pow(s-F.T1,2)/Math.max(1,wy(x)-rest[1]),0,1);y=lerp(y,wy(x),g);x+=g*18*(1-u/uw);}
        P.push([x,y]);}
      hm_rope(ctx,P,rail?4.6:5.6,{age,braid:!rail});});
    ctx.restore();}
  // the water where it lands
  const sp=ag_io(s,0.75,F.T2+0.6,0.3);if(sp>0.004)for(let n=0;n<14;n++){const r=8+Math.max(0,s-0.75)*16+hm_hash(n,71)*14;ctx.fillStyle=rgba(HM_K.foam,0.5*sp*(0.5+0.5*hm_hash(n,73)));
    ctx.beginPath();ctx.ellipse(lerp(600,1300,hm_hash(n,79)),F.water+hm_hash(n,83)*18,r,r*0.2,0,0,TAU);ctx.fill();}
  hm_fallen(ctx,{age,a:ag_in(s,F.T2-0.3,0.6),k:clamp((s-F.T2)/(o.drift||9),0,1)});
  ctx.restore();}

/* ---------------------------------------------------------------- words fixed to a place in the gorge
   The camera closes in to more than twice the size, and words must stay words: hm_label draws fn at the place (wx, wy) at the screen's
   own size, whatever the camera's zoom (cam, as a shot's draw gets it). hm_measure draws a measure from a to b with small ends, and
   its words on a tag at its middle (o.dx, o.dy move the tag; o.a). */
function hm_label(ctx,cam,wx,wy,fn){const k=1/((cam&&cam.z)||1);ctx.save();ctx.translate(wx,wy);ctx.scale(k,k);fn();ctx.restore();}
function hm_measure(ctx,cam,a,b,text,o){o=o||{};const al=o.a==null?1:o.a;if(al<=0.004||(o.u!=null&&o.u<=0.004))return;const k=1/((cam&&cam.z)||1),dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy)||1,nx=-dy/d*10*k,ny=dx/d*10*k,u=ag_sine(o.u==null?1:o.u),
    e=[lerp(a[0],b[0],u),lerp(a[1],b[1],u)];
  ctx.save();ctx.globalAlpha*=al;ctx.strokeStyle=rgba(LP.paper,0.9);ctx.lineCap="round";
  for(const [col,lw] of [[rgba(LP.paper,0.85),7*k],[rgba(LP.ink,1),3*k]]){ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(e[0],e[1]);ctx.moveTo(a[0]-nx,a[1]-ny);ctx.lineTo(a[0]+nx,a[1]+ny);
    if(u>=0.999){ctx.moveTo(b[0]-nx,b[1]-ny);ctx.lineTo(b[0]+nx,b[1]+ny);}ctx.stroke();}
  if(text&&u>0.6)hm_label(ctx,cam,(a[0]+b[0])/2+(o.dx||0)*k,(a[1]+b[1])/2+(o.dy||0)*k,()=>lp_tag(ctx,0,0,text,{align:o.align||"center",col:LP.ink,a:clamp((u-0.6)/0.4,0,1)}));
  ctx.restore();}

/* ---------------------------------------------------------------- a print of the gorge, for the team's wall
   Painted once: the gorge by a June sun, its new bridge, people crossing and people on both banks, in a timber frame. o.light (the
   room's, so its sun falls on the print as on the wall), o.a. */
function hm_printPic(){return ag_kept("hmPrint",960,540,(c)=>{c.save();c.scale(0.5,0.5);c.drawImage(ag_place("hmGorge"),0,0,W,H);hm_banks(c,0,{});
  const q={age:0};hm_bridge(c,Object.assign({mid:cc=>{for(const [u,wh] of [[0.3,0],[0.38,3],[0.62,4]]){const p=hm_deck(u,q);hm_fig(cc,p[0],p[1],50,{who:wh,pose:"walk",t:u*9,shadow:0});}}},q));c.restore();});}
function hm_print(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const h=w*9/16;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  ctx.save();ctx.shadowColor="rgba(52,36,30,0.34)";ctx.shadowBlur=24;ctx.shadowOffsetX=LP.sdx;ctx.shadowOffsetY=12;ctx.fillStyle=rgba(mix(LP.timber,LP.shade,0.2),1);ctx.fillRect(x-18,y-18,w+36,h+36);ctx.restore();
  ctx.fillStyle=rgba(LP.paper,1);ctx.fillRect(x-6,y-6,w+12,h+12);ctx.drawImage(hm_printPic(),x,y,w,h);
  const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,"rgba(255,255,255,0.12)");g.addColorStop(0.5,"rgba(255,255,255,0)");ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
  if(o.light&&LP_LIGHT[o.light]&&LP_LIGHT[o.light].sun)lp_sun(ctx,LP_LIGHT[o.light].sun,{a:0.6,col:LP_LIGHT[o.light].col,clip:cc=>{cc.beginPath();cc.rect(x-18,y-18,w+36,h+36);cc.clip();}});
  ctx.restore();}

/* ---------------------------------------------------------------- what each community brings
   A coil of cable lying on the ground (o.braid: a cable of the floor, a braid of three ropes; else a handrail, two ropes twisted),
   the floor's mat rolled up, and a bundle of the rods that go across. Seen close, on the bank. */
function hm_cableCoil(ctx,x,y,r,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const n=o.n||4,w=o.w||r*0.2;ctx.save();ctx.globalAlpha*=a;
  ag_floorShadow(ctx,x-r*0.12,y+r*0.52,r*1.2,r*0.2,0.3);
  for(let i=0;i<n;i++){const rx=r*(1-i*0.07),ry=r*0.5*(1-i*0.05),P=[],ph=i*0.9;for(let k=0;k<=36;k++){const an=k/36*TAU+ph;P.push([x+Math.cos(an)*rx,y+Math.sin(an)*ry-i*w*0.62]);}
    hm_rope(ctx,P,w,{age:o.age,braid:o.braid});}
  ctx.restore();}
function hm_matRoll(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const col=mix(HM_K.straw,[168,150,98],0.4);ctx.save();ctx.globalAlpha*=a;
  ag_floorShadow(ctx,x+w*0.42,y+h*0.52,w*0.62,h*0.2,0.3);
  let g=ctx.createLinearGradient(0,y-h/2,0,y+h/2);g.addColorStop(0,rgba(ag_lt(col,0.28),1));g.addColorStop(0.55,rgba(col,1));g.addColorStop(1,rgba(ag_dk(col,0.3),1));
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x,y-h/2);ctx.lineTo(x+w,y-h/2);ctx.ellipse(x+w,y,h*0.22,h/2,0,-Math.PI/2,Math.PI/2);ctx.lineTo(x,y+h/2);ctx.ellipse(x,y,h*0.22,h/2,0,Math.PI/2,-Math.PI/2);ctx.closePath();ctx.fill();
  // the weave along it, and the roll's turns at the end towards us
  ctx.strokeStyle=rgba(ag_dk(col,0.4),0.4);ctx.lineWidth=2;for(let i=1;i<9;i++){const xx=x+w*i/9;ctx.beginPath();ctx.ellipse(xx,y,h*0.22,h/2,0,-Math.PI/2,Math.PI/2);ctx.stroke();}
  ctx.fillStyle=rgba(ag_dk(col,0.12),1);ctx.beginPath();ctx.ellipse(x+w,y,h*0.22,h/2,0,0,TAU);ctx.fill();
  ctx.strokeStyle=rgba(ag_dk(col,0.5),0.7);ctx.lineWidth=2;for(const k of [0.75,0.5,0.25]){ctx.beginPath();ctx.ellipse(x+w,y,h*0.22*k,h/2*k,0,0,TAU);ctx.stroke();}
  ctx.restore();}
function hm_rods(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ag_floorShadow(ctx,x+w*0.45,y+16,w*0.6,9,0.28);ctx.lineCap="round";
  for(let i=0;i<9;i++){const dy=(hm_hash(i,5)-0.5)*26,dx=(hm_hash(i,9)-0.5)*24;ctx.strokeStyle=rgba(mix(HM_K.stick,i%2?[150,124,92]:[98,78,58],0.5),1);ctx.lineWidth=7;
    ctx.beginPath();ctx.moveTo(x+dx,y+dy);ctx.lineTo(x+w+dx*0.6,y+dy*0.5-6);ctx.stroke();}
  for(const k of [0.25,0.72])hm_rope(ctx,[[x+w*k,y-22],[x+w*k+3,y+20]],6,{});
  ctx.restore();}

/* ---------------------------------------------------------------- a rope in a builder's hand
   hm_palm: where the palm of someone's near hand is in the picture, m of the way from hanging (0) to holding (1); (x, y, s, flip) as
   lp_person takes them. hm_over: for a rope that runs across the picture and into that hand. Draw the rope first (fn, in the
   picture's own coordinates), then the person with holdBack: hm_over(...): it draws the rope again over their body only, under the
   hand, so the rope passes in front of them and the hand closes over it. t and who as the person's own (for their breathing). */
function hm_palm(x,y,s,flip,m){const sp=[lerp(AG_HANG.near[0],AG_POSES.hold.near[0],m),lerp(AG_HANG.near[1],AG_POSES.hold.near[1],m)],j=ag_joints(AG_FIG.shoulder.near,sp),A=AG_FIG.anchor,
    d=[j.Wr[0]-j.E[0],j.Wr[1]-j.E[1]],l=Math.hypot(d[0],d[1])||1,px=j.Wr[0]+d[0]/l*56,py=j.Wr[1]+d[1]/l*56;
  return[x+(flip?-1:1)*(px-A[0])*s,y+(py-A[1])*s];}
function hm_over(who,x,y,s,flip,t,fn){const br=Math.sin(t*TAU*(who.breath||1/3.6))*2.2,A=AG_FIG.anchor;
  return c=>{c.save();ag_shape(c,cc=>{AG_F.torso(cc);AG_F.farArm(cc);});c.clip();c.translate(0,-br);c.translate(A[0],A[1]);c.scale(1/(flip?-s:s),1/s);c.translate(-x,-y);fn(c);c.restore();};}
