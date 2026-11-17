/* ===== Wellbeing is in the work: the university, February 2027 =====
   The film's own pictures for Helena's first month (prefix ww_). The module's kit draws the rooms, the people, the sheets and the
   things in them, and is never changed for this film; what is here is this film's alone:
     wwOne, wwMeet, wwLate          the small room where Helena holds her half-hours, on a morning; the room where the people who asked
                                    meet her; the team's room late on a Friday
     WW_MARTA, WW_ERIN, WW_TOMAS    Marta Silva, Erin Walsh and Tomás Ortega, as the module's numbers set them, each with this film's key
     WW_ASKERS                      the nine people who asked: the kit's crowd of eight and one more (nobody from a later film)
     WW_VISITORS                    the two visitors of October 1972, in plain field clothes; nobody's likeness
     ww_req(ctx, x, y, o)           one request: a small card with data's orange band; o.urgent (an amber corner), o.n (its place in the
                                    order, in blue), o.date (a blue slip: it has a date), o.hand (a blue edge: in hand), o.done (a green
                                    tick), o.gone (struck out: no longer needed)
     WW_MINE, ww_gridAt, ww_blockAt where each of the 46 open requests sits on the wall, which fourteen wait on Marta, and where a block
                                    of cards sits, row by row
     ww_weekPage(ctx, x, y, w, o)   Marta's week on one page: what the work asks (amber) and what helps (green), line by line
     ww_miniPage(ctx, x, y, w, o)   the same page seen small, as a thing someone carries or pins up: its two columns as bars, no words
     ww_dots, ww_answers            seven people as dots, some filled; and a sheet of what the seven answered, as counts
     ww_list(ctx, x, y, w, words, o) a list on a sheet, its lines one size up from the kit's and each brought in on its own
     ww_quote(ctx, x, y, w, words, o) what someone said, large, and who said it and when
     WW_LOOK, WW_QUESTIONS, WW_TEAM where a manager looks in the work; the five questions; the seven, in the order they stand
     WW_FAR                         the two visitors of 1972 as small figures, for the wide view of the gorge
     ww_months(ctx, x, y, o)        February to June as five leaves: when the questions were asked, and when they are asked again
     ww_weather(ctx, t, o)          rain, as soft slanted strokes over the gorge (o.rain), and gusts of wind crossing it (o.wind)
     ww_fall, ww_ends               the bridge giving way, and what is left at its bases
     ww_desk, ww_pileAt             one workstation, and where each card of a pile on it sits
   Colour keeps the module's meaning: orange the data (a request, an answer counted), blue plans (the agreed order, a date), green
   what's done or what helps, amber a cost, a risk or waiting (what the work asks, what wears people out). People are never a colour. */

/* ---------------------------------------------------------------- the places */
AG_PLACES.wwOne=c=>lp_paintRoom(c,{light:"morning",seed:4,base:[226,212,194]});
AG_PLACES.wwMeet=c=>lp_paintRoom(c,{light:"day",seed:11,base:[220,208,190]});
AG_PLACES.wwLate=c=>lp_paintRoom(c,{light:"late",seed:3});

/* ---------------------------------------------------------------- the people this film adds
   Marta, Erin and Tomás are the module's (numbers.md, "The three who are new to the screen"), copied as they are with a key of this
   film's own; each was looked at full size, facing both ways, on 12 November 2026. */
const WW_MARTA={name:"Marta Silva",role:"Data analyst",key:"ww-marta",skin:[156,108,80],hair:{style:"coily",c:[40,30,26]},earrings:[214,180,120],top:{kind:"cardigan",c:[168,150,126],inner:[70,66,70]},breath:0.3};
const WW_ERIN={name:"Erin Walsh",role:"Platform engineer",key:"ww-erin",skin:[232,196,170],hair:{style:"bun",c:[132,76,48]},earrings:[214,200,170],top:{kind:"sweater",c:[126,106,96]},breath:0.28};
const WW_TOMAS={name:"Tomás Ortega",role:"Report developer",key:"ww-tomas",skin:[198,150,114],hair:{style:"side",c:[46,36,30],streak:[120,108,100]},beard:[58,46,40],top:{kind:"cardigan",c:[112,100,88],inner:[226,222,214]},breath:0.27};
// the nine who asked, from six offices and faculties: the kit's crowd and one more, so nobody from a later film sits in that room
const WW_ASKERS=LP_CROWD.concat([{key:"ww-asker9",name:"",skin:[186,138,104],hair:{style:"cropped",c:[96,90,88]},glasses:[62,54,50],top:{kind:"blazer",c:[98,96,100],inner:[234,230,224]},breath:0.27}]);
// the two visitors of October 1972: plain field clothes of the time, no likeness
const WW_VISITORS=[
  {key:"ww-visitor1",name:"",skin:[226,188,158],hair:{style:"cropped",c:[150,142,134]},top:{kind:"overshirt",c:[152,140,112],inner:[226,220,206]},breath:0.25},
  {key:"ww-visitor2",name:"",skin:[196,150,116],hair:{style:"side",c:[40,32,28]},glasses:[58,50,46],top:{kind:"sweater",c:[92,88,92]},breath:0.28}];
// the same two from far off, as small whole figures (ww_fig): no hat, the same clothes
const WW_FAR=[{k:"man",hat:"none",hair:[150,142,134],top:[152,140,112],legs:[96,88,76],skin:[226,188,158]},{k:"man",hat:"none",hair:[40,32,28],top:[92,88,92],legs:[62,60,66],skin:[196,150,116]}];
// the seven of the team, in the order they stand in a row (Yusuf and Tomás apart), each with the first name on their tag
const WW_TEAM=[["noor","Noor"],["yusuf","Yusuf"],["sam","Sam"],[WW_MARTA,"Marta"],["jun","Jun"],[WW_ERIN,"Erin"],[WW_TOMAS,"Tomás"]];

/* ---------------------------------------------------------------- one request
   A small card of thick paper with data's orange band, centred on (x, y): o.w, o.h (96 by 64); o.urgent 0 to 1 (an amber corner:
   called urgent); o.hand 0 to 1 (a blue edge: in hand); o.n (its place in the agreed order, in blue; o.nA 0 to 1 brings the number in
   over the card's two grey lines); o.date 0 to 1 (a blue slip under
   it: it has a date); o.done 0 to 1 (a green tick: delivered); o.gone 0 to 1 (struck out: no longer needed); o.dim 0 to 1 (pale: not
   part of this story); o.a; o.rot (radians) */
function ww_req(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const w=o.w||96,h=o.h||64,dim=clamp(o.dim||0,0,1),gone=clamp(o.gone||0,0,1);
  ctx.save();ctx.globalAlpha*=a*(1-0.62*dim)*(1-0.5*gone);ctx.translate(x,y);if(o.rot)ctx.rotate(o.rot);
  ctx.save();ctx.shadowColor="rgba(52,36,30,"+(0.26*(1-dim))+")";ctx.shadowBlur=10;ctx.shadowOffsetX=-4;ctx.shadowOffsetY=6;ctx.fillStyle=rgba(LP.paper,1);ctx.fillRect(-w/2,-h/2,w,h);ctx.restore();
  ctx.fillStyle=rgba(LP.orange,1);ctx.fillRect(-w/2,-h/2,w,8);
  const nA=o.n==null?0:clamp(o.nA==null?1:o.nA,0,1);
  if(nA<1){ctx.fillStyle=rgba(LP.mut,0.3*(1-nA));ctx.fillRect(-w/2+12,-h/2+22,w*0.62,6);ctx.fillRect(-w/2+12,-h/2+38,w*0.44,6);}
  if(nA>0)lp_T(ctx,String(o.n),0,h/2-14,{w:800,size:Math.max(28,h*0.5),align:"center",col:LP.blue,a:nA});
  const ur=clamp(o.urgent||0,0,1);if(ur>0){ctx.save();ctx.globalAlpha*=ur;const s=lerp(0.4,1,ag_spr(ur*1.2,0,0.5))*22;ctx.fillStyle=rgba(LP.amber,1);ctx.beginPath();ctx.moveTo(w/2,-h/2);ctx.lineTo(w/2-s,-h/2);ctx.lineTo(w/2,-h/2+s);ctx.closePath();ctx.fill();ctx.restore();}
  const hd=clamp(o.hand||0,0,1);if(hd>0){ctx.save();ctx.globalAlpha*=hd;ctx.strokeStyle=rgba(LP.blue,1);ctx.lineWidth=5;ctx.strokeRect(-w/2-4,-h/2-4,w+8,h+8);ctx.restore();}
  const dt=clamp(o.date||0,0,1);if(dt>0){ctx.save();ctx.globalAlpha*=dt;ctx.fillStyle=rgba(LP.blue,1);ctx.fillRect(-w/2,h/2+6,w,10);ctx.restore();}
  const dn=clamp(o.done||0,0,1);if(dn>0){ctx.save();ctx.globalAlpha*=dn;const f=lerp(0.6,1,ag_spr(dn*1.2,0,0.5));ctx.fillStyle=rgba(LP.green,1);ctx.beginPath();ctx.arc(w/2-6,-h/2+6,17*f,0,TAU);ctx.fill();lp_icon(ctx,"tick",w/2-6,-h/2+6,22*f,[255,255,255]);ctx.restore();}
  if(gone>0){ctx.save();ctx.globalAlpha*=gone;ctx.strokeStyle=rgba(LP.mut,1);ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-w/2+8,h/2-8);ctx.lineTo(lerp(-w/2+8,w/2-8,gone),lerp(h/2-8,-h/2+14,gone));ctx.stroke();ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- the 46 open requests on the wall, and Marta's fourteen
   ww_gridAt: 46 places in rows of twelve (the last row two short). WW_MINE: the fourteen that wait on Marta, spread among them. */
const WW_MINE=[2,5,9,12,15,19,22,24,27,31,34,38,41,45];
function ww_gridAt(i,o){o=o||{};const x0=o.x||700,y0=o.y||250,dx=o.dx||96,dy=o.dy||84;return[x0+(i%12)*dx,y0+Math.floor(i/12)*dy];}
// cards drawn together, row by row: o.n in a row (seven), o.x, o.y the first one's centre, o.dx, o.dy apart
function ww_blockAt(k,o){o=o||{};const x0=o.x||760,y0=o.y||330,dx=o.dx||132,dy=o.dy||104,n=o.n||7;return[x0+(k%n)*dx,y0+Math.floor(k/n)*dy];}

/* ---------------------------------------------------------------- rain and wind over the gorge
   o.rain 0 to 1: soft slanted strokes, falling; o.wind 0 to 1: pale gusts crossing the gorge. Drawn in the place's own px. */
function ww_weather(ctx,t,o){o=o||{};const rn=clamp(o.rain||0,0,1),wd=clamp(o.wind||0,0,1);
  if(rn>0.004){ctx.save();ctx.globalAlpha*=rn;ctx.lineCap="round";ctx.strokeStyle="rgba(226,232,238,0.5)";ctx.lineWidth=2;ctx.beginPath();
    for(let i=0;i<150;i++){const hx=ww_hash(i,61),hy=ww_hash(i,67),sp=420+ww_hash(i,71)*220,y=((hy*1180+t*sp)%1180)-60,x=hx*2100-90-(y*0.22),l=26+ww_hash(i,73)*30;
      ctx.moveTo(x,y);ctx.lineTo(x-l*0.22,y+l);}ctx.stroke();ctx.restore();}
  if(wd>0.004){ctx.save();ctx.globalAlpha*=wd;ctx.lineCap="round";ctx.strokeStyle="rgba(240,240,236,0.34)";ctx.lineWidth=3;
    for(let i=0;i<9;i++){const sp=260+ww_hash(i,79)*200,x=((ww_hash(i,83)*2600+t*sp)%2600)-340,y=250+ww_hash(i,89)*420,l=150+ww_hash(i,97)*160;
      ctx.beginPath();ctx.moveTo(x,y);ctx.bezierCurveTo(x+l*0.3,y-14,x+l*0.6,y+12,x+l,y-4);ctx.stroke();}ctx.restore();}}

/* ---------------------------------------------------------------- the bridge giving way, and what is left at the bases
   ww_fall(ctx, o, k): the bridge o (ww_bridge's options) as it falls, k from 0 (still hanging) to 1 (gone): each cable drops a little
   after the one before it, and the whole fades as it reaches the river. No page read says how the bridge looked as it fell: this is
   the drawing's own, kept short, with nobody on it.
   ww_ends(ctx, o): the turns of each cable still round its stone, and a short end hanging from each base. */
function ww_fall(ctx,o,k){k=clamp(k,0,1);const S={};WW_CABLES.forEach((id,i)=>{const kk=clamp(k*1.3-i*0.05,0,1);S[id]=ww_sagOf(id,o)+380*kk*kk;});
  ww_bridge(ctx,Object.assign({},o,{sag:S,extra:null,a:(o.a==null?1:o.a)*(1-ag_in(k,0.5,0.5))}));}
function ww_ends(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  WW_CABLES.forEach((id,i)=>{for(const side of [0,1]){const A=ww_anchor(id,side),dir=side?-1:1,rail=id[0]==="r",w=rail?4.6:5.6,l=34+ww_hash(i,side+3)*46;
    ww_tie(ctx,id,side,{age:o.age},w);ww_rope(ctx,ww_hang(A,[A[0]+dir*(5+ww_hash(i,side+9)*9),A[1]+l],-4,8),w,{age:o.age,braid:!rail});}});
  ctx.restore();}

/* ---------------------------------------------------------------- a workstation, and the pile on it */
function ww_desk(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  // the chair behind the desk, pushed in a little
  ctx.fillStyle=rgba(mix(LP.graphite,LP.wall,0.25),1);ctx.beginPath();ctx.moveTo(x-80,y-170);ctx.quadraticCurveTo(x,y-200,x+80,y-170);ctx.lineTo(x+70,y-40);ctx.lineTo(x-70,y-40);ctx.closePath();ctx.fill();
  lp_table(ctx,x-300,y,600,{});lp_laptop(ctx,x-90,y-34,200,{});ctx.restore();}
// where the k-th card of a pile sits, the pile's foot at (x, y): each a little askew on the one below
function ww_pileAt(k,x,y){return[x+(ww_hash(k,5)-0.5)*18,y-k*9,(ww_hash(k,7)-0.5)*0.16];}

/* ---------------------------------------------------------------- Marta's week, on one page
   The page Marta and Helena write on Monday 8 February, as the module's numbers have it: what the work asks on the left (amber: what
   it costs her) and what helps on the right (green). o.a, o.k (the spring it comes in on), o.light; o.heads ([left, right]), o.asks and
   o.helps (each line's 0 to 1); o.jdr ([left, right]: the researchers' name for each side, and under the page who named them).
   Nothing on it is about Marta: every line is about the work. It returns its box. */
const WW_ASKS=["14 requests at once","Every one called urgent","No say in their order","9 picked up, none finished","2 Sundays worked in January"],
  WW_HELPS=["Knows the university's numbers better than anyone","Jun checks a query when she asks"];
function ww_weekPage(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,pad=48,gap=64,cw=(w-pad*2-gap)/2,wrap=l=>lp_wrap(ctx,l,cw-36,{w:600,size:32}),
    L=WW_ASKS.map(wrap),R=WW_HELPS.map(wrap),rows=ls=>ls.reduce((s,l)=>s+l.length*44+14,0),h=232+Math.max(rows(L),rows(R))+92,bb={x,y,w,h};
  if(o.measure||a<=0.004)return bb;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{light:o.light});lp_T(ctx,"MARTA'S WEEK · 1 TO 5 FEBRUARY",x+pad,y+92,{w:800,size:28,ls:3,col:LP.mut});
  const col=(cx,head,c,lines,us,hu,name,ju)=>{ctx.save();ctx.globalAlpha*=ag_sine(hu==null?1:hu);lp_T(ctx,head,cx,y+170,{w:800,size:40,col:c});ctx.fillStyle=rgba(c,1);ctx.fillRect(cx,y+188,cw,5);ctx.restore();
      // the researchers' name for this side, at the right end of its heading
      if(ju>0.004){ctx.save();ctx.globalAlpha*=ag_sine(ju);const tw=lp_tw(ctx,name,{w:700,size:28});ag_about(ctx,cx+cw-tw/2-20,y+152,lerp(0.7,1,ag_spr(ju*1.2,0,0.5)));
        rr(ctx,cx+cw-tw-40,y+128,tw+40,48,24);ctx.fillStyle=rgba(c,1);ctx.fill();lp_T(ctx,name,cx+cw-tw-20,y+162,{w:700,size:28,color:"#fff"});ctx.restore();}
      let yy=y+232;lines.forEach((l,n)=>{const u=us?clamp(us[n]||0,0,1):1;ctx.save();ctx.globalAlpha*=ag_sine(u);
        l.forEach((s,i)=>{yy+=44;if(i===0){ctx.fillStyle=rgba(c,1);ctx.beginPath();ctx.arc(cx+9,yy-11,7,0,TAU);ctx.fill();}lp_T(ctx,s,cx+36,yy,{w:600,size:32});});yy+=14;ctx.restore();});},
    hd=o.heads||[1,1],jd=o.jdr||[0,0];
  col(x+pad,"What the work asks",LP.amber,L,o.asks,hd[0],"Job demands",clamp(jd[0],0,1));col(x+pad+cw+gap,"What helps",LP.green,R,o.helps,hd[1],"Job resources",clamp(jd[1],0,1));
  const fu=clamp(Math.min(jd[0],jd[1]),0,1);if(fu>0.004)lp_T(ctx,"Named by Demerouti, Bakker, Nachreiner and Schaufeli, 2001",x+pad,y+h-40,{w:600,size:28,col:LP.mut,a:ag_sine(fu)});
  ctx.restore();return bb;}
// the same page seen small, as a thing someone carries or pins up: its two columns as bars, no words (o.a, o.k, o.light, o.pin)
function ww_miniPage(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=Math.round(w*0.62),bb={x,y,w,h};if(a<=0.004)return bb;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));lp_sheet(ctx,x,y,w,h,{light:o.light,pin:o.pin});
  const p=w*0.09,g=w*0.08,cw=(w-p*2-g)/2,bh=Math.max(4,w*0.024),bar=(bx,by,bw,c,al)=>{ctx.fillStyle=rgba(c,al);ctx.fillRect(bx,by,bw,bh);};
  bar(x+p,y+h*0.17,w*0.46,LP.mut,0.45);
  [[x+p,LP.amber,5],[x+p+cw+g,LP.green,2]].forEach(([cx,c,n],j)=>{bar(cx,y+h*0.31,cw*0.82,c,1);for(let i=0;i<n;i++)bar(cx,y+h*0.44+i*h*0.105,cw*(0.92-0.13*((i*7+j*3)%4)),LP.mut,0.32);});
  ctx.restore();return bb;}

/* ---------------------------------------------------------------- what the seven answered, as counts
   ww_dots(ctx, x, y, n, k, o): n people as dots from (x, y), the first k filled in data's orange (o.r, o.dx, o.u 0 to 1: they fill one
   by one, o.a). ww_answers(ctx, x, y, w, o): the three questions about the needs, each with its seven dots and its count (o.us: each
   row's 0 to 1; o.a, o.k, o.light; o.rows and o.col for another set of counts, as what wears them out, in amber). The counts are the
   module's numbers: a say in the order, 2 of 7; get to finish things, 3; someone to turn to, 7; and what wears them out: the standing
   meetings, 5; requests with no order, 4; the nights, 1. */
const WW_COUNTS=[["A say in the order",2],["Get to finish things",3],["Someone to turn to",7]],
  WW_WEARS=[["The standing meetings",5],["Requests with no order",4],["The nights",1]];
function ww_dots(ctx,x,y,n,k,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const r=o.r||13,dx=o.dx||36,col=o.col||LP.orange,u=o.u==null?1:o.u;ctx.save();ctx.globalAlpha*=a;
  for(let i=0;i<n;i++){const cx=x+i*dx,f=i<k?ag_sine(clamp(u*k-i,0,1)):0;ctx.lineWidth=3;ctx.strokeStyle=rgba(LP.mut,0.55);ctx.beginPath();ctx.arc(cx,y,r-1.5,0,TAU);ctx.stroke();
    if(f>0){ctx.fillStyle=rgba(col,f);ctx.beginPath();ctx.arc(cx,y,r,0,TAU);ctx.fill();}}
  ctx.restore();}
function ww_answers(ctx,x,y,w,o){o=o||{};const R=o.rows||WW_COUNTS,col=o.col||LP.orange,a=o.a==null?1:o.a,h=LP_PAD+30+44+R.length*76+LP_PAD-22,bb={x,y,w,h};if(o.measure||a<=0.004)return bb;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));lp_sheet(ctx,x,y,w,h,{light:o.light,col});
  lp_T(ctx,String(o.kick||"The answers, as counts").toUpperCase(),x+LP_PAD,y+LP_PAD+44,{w:800,size:28,ls:3,col});
  R.forEach(([lab,k],i)=>{const u=clamp((o.us&&o.us[i])||0,0,1);if(u<=0)return;const yy=y+LP_PAD+30+44+50+i*76;ctx.save();ctx.globalAlpha*=ag_sine(u*2);
    lp_T(ctx,lab,x+LP_PAD,yy,{w:600,size:28});ww_dots(ctx,x+w-LP_PAD-112-6*36,yy-10,7,k,{u:clamp(u*1.5-0.3,0,1),col});lp_T(ctx,k+" of 7",x+w-LP_PAD,yy,{w:800,size:28,align:"right",col});ctx.restore();});
  ctx.restore();return bb;}

/* ---------------------------------------------------------------- a list on a sheet
   The kit's sheet of words with its lines one size up, each brought in on its own: words.kick, words.title, words.lines. o.us ([each
   line's 0 to 1]); o.marks ([each line's 0 to 1]: its bullet grows and takes o.markCol, amber by default); o.nums (1, 2, 3 in place
   of bullets); o.size (32); o.col; o.light; o.pin; o.a; o.k (the spring it comes in on). The sheet is made at least as wide as its
   top line is drawn. It returns its box, with rows and ends: where each line's first and last row of words sit. */
const WW_LOOK=["How much is in hand at once","Who decides its order","How often people are interrupted","Who is alone on something","Nights and weekends","What is unclear","Who thanks whom"],
  WW_QUESTIONS=["Do you have a say in the order of your work?","Do you get to finish things, and to do what you're good at?","When you're stuck, is there someone to turn to?","What in the work wears you out?","What one change would help most?"];
function ww_list(ctx,x,y,w,words,o){o=o||{};const a=o.a==null?1:o.a,size=o.size||32,pitch=Math.round(size*1.32),gap=14,col=o.col||LP.mut,ind=o.nums?48:38;
  if(words.kick)w=Math.max(w,Math.ceil(lp_tw(ctx,String(words.kick).toUpperCase(),{w:800,size:28,ls:3}))+LP_PAD*2);
  const tl=words.title?lp_wrap(ctx,words.title,w-LP_PAD*2,{w:800,size:40}):[],L=words.lines.map(l=>lp_wrap(ctx,l,w-LP_PAD*2-ind,{w:600,size})),rows=[],ends=[];
  let yy=y+LP_PAD+30+(words.kick?44:0)+tl.length*50+(tl.length?10:0);for(const l of L){rows.push(yy+pitch);ends.push(yy+l.length*pitch);yy+=l.length*pitch+gap;}
  const h=yy+LP_PAD-16-y,bb={x,y,w,h,rows,ends};if(o.measure||a<=0.004)return bb;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{light:o.light,col:o.col,pin:o.pin});let ty=y+LP_PAD+30;
  if(words.kick){lp_T(ctx,String(words.kick).toUpperCase(),x+LP_PAD,ty+14,{w:800,size:28,ls:3,col});ty+=44;}
  for(const l of tl){ty+=42;lp_T(ctx,l,x+LP_PAD,ty,{w:800,size:40});ty+=8;}
  L.forEach((l,n)=>{const u=o.us?clamp(o.us[n]||0,0,1):1,mk=o.marks?ag_sine(clamp(o.marks[n]||0,0,1)):0;if(u<=0)return;ctx.save();ctx.globalAlpha*=ag_sine(u);
    if(o.nums)lp_T(ctx,String(n+1),x+LP_PAD,rows[n],{w:800,size,col});
    else{ctx.fillStyle=rgba(mix(col,o.markCol||LP.amber,mk),1);ctx.beginPath();ctx.arc(x+LP_PAD+11,rows[n]-size*0.33,lerp(7,11,mk),0,TAU);ctx.fill();}
    l.forEach((sx,i)=>lp_T(ctx,sx,x+LP_PAD+ind,rows[n]+i*pitch,{w:600,size}));ctx.restore();});
  ctx.restore();return bb;}

/* ---------------------------------------------------------------- words someone said
   A plain sheet with what was said, large, and under it who said it and when: words.quote, words.by; o.a, o.k, o.light, o.pin (none
   by default: it is held up out of doors). Returns its box. */
function ww_quote(ctx,x,y,w,words,o){o=o||{};const a=o.a==null?1:o.a,ql=lp_wrap(ctx,words.quote,w-LP_PAD*2,{w:800,size:44}),bl=words.by?lp_wrap(ctx,words.by,w-LP_PAD*2,{w:600,size:28}):[],
    h=LP_PAD+8+ql.length*56+(bl.length?6+bl.length*38:0)+LP_PAD-10,bb={x,y,w,h};if(o.measure||a<=0.004)return bb;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));lp_sheet(ctx,x,y,w,h,{light:o.light===undefined?null:o.light,pin:!!o.pin});let yy=y+LP_PAD+8;
  for(const l of ql){yy+=46;lp_T(ctx,l,x+LP_PAD,yy,{w:800,size:44});yy+=10;}yy+=bl.length?6:0;for(const l of bl){yy+=30;lp_T(ctx,l,x+LP_PAD,yy,{w:600,size:28,col:LP.mut});yy+=8;}
  ctx.restore();return bb;}

/* ---------------------------------------------------------------- the team's date
   February to June as five leaves from (x, y), 176 apart: o.u 0 to 1 (they come one by one), o.ring 0 to 1 (June is ringed, and says
   what happens then), o.light, o.a. February is when the five questions were first asked. */
function ww_months(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const M=["Feb","Mar","Apr","May","Jun"],u=o.u==null?1:o.u,rg=clamp(o.ring||0,0,1);ctx.save();ctx.globalAlpha*=a;
  M.forEach((m,i)=>{const v=clamp(u*M.length-i,0,1);if(v<=0)return;const bx=x+i*176,key=i===0||i===4;ctx.save();ctx.globalAlpha*=ag_sine(v);
    lp_sheet(ctx,bx,y,150,136,{light:o.light,pin:false,col:key?LP.blue:null});lp_T(ctx,m,bx+75,y+70,{w:800,size:36,align:"center",col:key?LP.blue:LP.mut});
    if(i===0)lp_T(ctx,"Asked",bx+75,y+112,{w:600,size:28,align:"center"});if(i===4&&rg>0)lp_T(ctx,"Again",bx+75,y+112,{w:600,size:28,align:"center",a:ag_sine(rg*2-1)});ctx.restore();});
  if(rg>0){const cx=x+4*176+75,cy=y+68;ctx.strokeStyle=rgba(LP.blue,1);ctx.lineWidth=6;ctx.lineCap="round";ctx.beginPath();ctx.ellipse(cx,cy,112,100,-0.1,-Math.PI/2,-Math.PI/2+TAU*ag_sine(rg*1.4));ctx.stroke();}
  ctx.restore();}
