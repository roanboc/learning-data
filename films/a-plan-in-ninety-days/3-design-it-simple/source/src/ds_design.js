/* ===== Design it simple: the university's papers =====
   The data story's own pictures, on the module's sheets of thick paper (cards.js), in its colours: blue design and plans, green done or
   value, amber risk, cost or waiting, orange data, violet only an agent (prefix ds_, DS_). Every word is 28 px or more in the frame and
   drawn with lp_T; the small pictures in the rows of the five layers have no words.
     DS_PRIN, ds_prin          a principle on a strip of paper: its number (or, later, a letter in its place), what it says, what it rules out
     DS_LAYER, ds_layerPage    a layer of the target: its page on the left, its picture on the right, drawn together (o.u)
     ds_layerPic               a layer's picture in a box, with its words
     ds_layers                 the five layers in rows on one sheet, a small page and a small picture in each: "now" or "target"
     ds_queue, ds_copies       today: one queue at the centre, private copies at the edges
     ds_ring                   a small team in the middle, its four jobs, and the seven data partners around it
     DS_PAGES, ds_pageRow      the six procedures, a page each; ds_buildPage the build page, whole; ds_flow its picture
     ds_form                   the front door's form, five questions
     ds_grid                   a spreadsheet; ds_report Health's report of casual teaching hours
     ds_marks                  forty small sheets: the people who do data work part of their week, in spreadsheets */

const DS_SHEETW=[248,244,236];
// a word or two, centred, at 28 px: a label inside a picture
const ds_say=(ctx,s,x,y,o)=>lp_T(ctx,s,x,y,Object.assign({w:600,size:28,align:"center"},o||{}));
// an arrow from (x0, y0) to (x1, y1), drawn to u (0 to 1), in col
function ds_arrow(ctx,x0,y0,x1,y1,u,col,o){o=o||{};u=clamp(u,0,1);if(u<=0.01)return;const x=lerp(x0,x1,u),y=lerp(y0,y1,u),an=Math.atan2(y1-y0,x1-x0),hd=o.head||16;
  ctx.save();ctx.strokeStyle=rgba(col,o.al==null?1:o.al);ctx.fillStyle=rgba(col,o.al==null?1:o.al);ctx.lineWidth=o.lw||4;ctx.lineCap="round";
  if(o.dash)ctx.setLineDash(o.dash);ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x-Math.cos(an)*hd*0.6,y-Math.sin(an)*hd*0.6);ctx.stroke();ctx.setLineDash([]);
  if(u>0.25){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-Math.cos(an-0.45)*hd,y-Math.sin(an-0.45)*hd);ctx.lineTo(x-Math.cos(an+0.45)*hd,y-Math.sin(an+0.45)*hd);ctx.closePath();ctx.fill();}
  ctx.restore();}
// a small sheet seen whole, with grey lines for words: (x, y) its top left, w by h; o.col (a band), o.lines (how many), o.a
function ds_mini(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor="rgba(52,36,30,0.24)";ctx.shadowBlur=10;ctx.shadowOffsetX=LP.sdx*0.5;ctx.shadowOffsetY=5;ctx.fillStyle=rgba(o.fill||LP.paper,1);ctx.fillRect(x,y,w,h);ctx.restore();
  if(o.col){ctx.fillStyle=rgba(o.col,1);ctx.fillRect(x,y,w,Math.max(4,h*0.06));}
  const n=o.lines==null?3:o.lines;ctx.fillStyle=rgba(LP.mut,0.28);for(let i=0;i<n;i++){const lw=w*(i===0?0.62:0.78-0.12*(i%2));ctx.fillRect(x+w*0.12,y+h*(0.24+i*0.17),lw,Math.max(2,h*0.045));}
  if(o.edge){ctx.strokeStyle=rgba(o.edge,0.95);ctx.lineWidth=o.ew||4;ctx.strokeRect(x-3,y-3,w+6,h+6);}
  ctx.restore();}

/* ---------------------------------------------------------------- the five principles */
const DS_PRIN=[
  {kick:"One",title:"Start from the decision",out:"Building with no decision behind it"},
  {kick:"Two",title:"One copy, governed once",out:"Private copies of what everyone shares"},
  {kick:"Three",title:"Owners in the business, builders beside them",out:"The data team deciding what data means"},
  {kick:"Four",title:"Simple before clever",out:"A new tool where one they have will do"},
  {kick:"Five",title:"Measure what people use",out:"Counting how busy the team is"}];
const DS_PRINLET=["g","n","m","s","ng"];
const DS_STRIP={x:110,y:150,w:1110,h:130,gap:14};
// a principle on a strip of paper: its number in blue at the left, what it says, and under it what it rules out (o.ro, 0 to 1); o.hi (0
// to 1: a blue edge round it, as a choice is tested against it); o.letter (0 to 1: the number gives way to the letter of the same place,
// drawing itself); o.a, o.k. Returns its box
function ds_prin(ctx,i,o){o=o||{};const S=DS_STRIP,x=S.x,y=S.y+i*(S.h+S.gap),w=o.w||S.w,h=S.h,bb={x,y,w,h},a=o.a==null?1:o.a;if(a<=0.004)return bb;const P=DS_PRIN[i];
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.blue,light:o.light===undefined?"day":o.light,pin:false});
  if(o.hi>0.004){ctx.save();ctx.strokeStyle=rgba(LP.blue,o.hi);ctx.lineWidth=5;rr(ctx,x-7,y-7,w+14,h+14,10);ctx.stroke();ctx.restore();}
  const lt=o.letter||0;if(lt<0.999)lp_T(ctx,P.kick.toUpperCase(),x+36,y+80,{w:800,size:28,ls:3,col:LP.blue,a:1-ag_sine(lt*2)});
  if(lt>0.001)ds_letter(ctx,DS_PRINLET[i],x+40,y+28,80,{p:ag_sine((lt-0.25)/0.75),col:LP.ink,wd:0.12});
  lp_T(ctx,P.title,x+190,y+70,{w:800,size:40});
  const ro=o.ro==null?1:o.ro;if(ro>0.004){const lw=lp_tw(ctx,"Rules out:",{w:700,size:28});lp_T(ctx,"Rules out:",x+190,y+110,{w:700,size:28,col:LP.mut,a:ag_sine(ro)});
    lp_T(ctx,P.out,x+190+lw+14,y+110,{w:600,size:28,a:ag_sine(ro)});}
  ctx.restore();return bb;}

/* ---------------------------------------------------------------- the five layers */
const DS_LAYER=[
  {name:"Strategy",lines:["The same four goals","Delivering data becomes quick","Reporting happens in one place"]},
  {name:"Business",lines:["The same twelve decisions","A small team, data partners around it","Six procedures, one front door"]},
  {name:"Information",lines:["One governed copy of each thing","An owner in the business","One staff list, not three"]},
  {name:"Application",lines:["One platform for data and reports","Its catalog","Agents, each with a written mandate","The old warehouse gone"]},
  {name:"Technology",lines:["The platform, in the cloud","The old warehouse's servers, off"]}];
const DS_PAGE={x:120,y:170,w:700},DS_PIC={x:860,y:170,w:940,h:600};
// a cloud's outline, for the platform's home, in the box (x, y, w by h)
function ds_cloudPath(c,x,y,w,h){c.moveTo(x+w*0.2,y+h);c.bezierCurveTo(x-w*0.04,y+h,x-w*0.02,y+h*0.52,x+w*0.18,y+h*0.5);c.bezierCurveTo(x+w*0.18,y+h*0.12,x+w*0.5,y,x+w*0.6,y+h*0.26);
  c.bezierCurveTo(x+w*0.72,y+h*0.08,x+w*0.94,y+h*0.2,x+w*0.86,y+h*0.5);c.bezierCurveTo(x+w*1.04,y+h*0.52,x+w*1.04,y+h,x+w*0.8,y+h);c.closePath();}
// a server: a dark rack with its slots, its lights on (lit 1) or off (0); (x, y) its top left
function ds_rack(ctx,x,y,w,h,lit){ctx.fillStyle=rgba(mix(LP.graphite,[120,116,120],0.25*(1-lit)),1);rr(ctx,x,y,w,h,6);ctx.fill();
  for(let k=0;k<5;k++){const yy=y+h*(0.1+k*0.17);ctx.fillStyle="rgba(255,255,255,0.12)";ctx.fillRect(x+w*0.12,yy,w*0.76,h*0.1);
    ctx.fillStyle=lit>0.01?rgba(mix([120,116,120],LP.green,lit),1):"rgba(150,146,150,0.6)";ctx.beginPath();ctx.arc(x+w*0.78,yy+h*0.05,Math.max(2.5,w*0.05),0,TAU);ctx.fill();}}
// a staff list: a sheet in data's orange with grey rows; o.edge, o.a
function ds_list(ctx,x,y,w,h,o){o=o||{};ds_mini(ctx,x,y,w,h,{col:LP.orange,lines:4,a:o.a,edge:o.edge,fill:o.fill});}
// the ring in small: a dot for the team, seven around it; (cx, cy) its middle, R its radius; o.a, o.u (0 to 1, the partners come in)
function ds_miniRing(ctx,cx,cy,R,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;const u=o.u==null?1:o.u;
  ctx.strokeStyle=rgba(LP.blue,0.45);ctx.lineWidth=Math.max(2,R*0.04);for(let i=0;i<7;i++){const f=clamp(u*7-i,0,1);if(f<=0)continue;const an=-Math.PI/2+i*TAU/7,px=cx+Math.cos(an)*R,py=cy+Math.sin(an)*R;
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(lerp(cx,px,f),lerp(cy,py,f));ctx.stroke();}
  for(let i=0;i<7;i++){const f=ag_spr(u*7-i,0,0.5);if(f<=0)continue;const an=-Math.PI/2+i*TAU/7;ctx.fillStyle=rgba(LP.paper,1);ctx.strokeStyle=rgba(LP.blue,1);ctx.lineWidth=Math.max(2,R*0.05);
    ctx.beginPath();ctx.arc(cx+Math.cos(an)*R,cy+Math.sin(an)*R,R*0.2*f,0,TAU);ctx.fill();ctx.stroke();}
  ctx.fillStyle=rgba(LP.blue,1);ctx.beginPath();ctx.arc(cx,cy,R*0.36,0,TAU);ctx.fill();ctx.restore();}
// a reader: a head and shoulders in ink, centred on (x, y), r the head's radius; a, its alpha
function ds_reader(ctx,x,y,r,a){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ctx.fillStyle=rgba(LP.ink,0.85);ctx.beginPath();ctx.arc(x,y-r*0.9,r,0,TAU);ctx.fill();
  ctx.beginPath();ctx.moveTo(x-r*1.8,y+r*1.9);ctx.bezierCurveTo(x-r*1.8,y+r*0.4,x-r*1.0,y+r*0.25,x,y+r*0.25);ctx.bezierCurveTo(x+r*1.0,y+r*0.25,x+r*1.8,y+r*0.4,x+r*1.8,y+r*1.9);ctx.closePath();ctx.fill();ctx.restore();}
// a door, small, in a frame
function ds_miniDoor(ctx,x,y,w,h){ctx.fillStyle=rgba(mix(LP.timber,LP.shade,0.3),1);ctx.fillRect(x-4,y-4,w+8,h+4);ctx.fillStyle=rgba(LP.timber,1);ctx.fillRect(x,y,w,h);
  ctx.strokeStyle=rgba(mix(LP.timber,LP.shade,0.45),1);ctx.lineWidth=2;ctx.strokeRect(x+w*0.14,y+h*0.08,w*0.72,h*0.38);ctx.strokeRect(x+w*0.14,y+h*0.54,w*0.72,h*0.38);
  ctx.fillStyle=rgba(LP.graphite,1);ctx.beginPath();ctx.arc(x+w*0.84,y+h*0.52,Math.max(2,w*0.06),0,TAU);ctx.fill();}
// a layer's picture in the box (x, y, w by h): i the layer (0 strategy to 4 technology), u (0 to 1) how much is drawn; o.words (false: shapes
// only, for the rows), o.kind ("target", or "now": today's state)
function ds_layerPic(ctx,i,x,y,w,h,u,o){o=o||{};const words=o.words!==false,now=o.kind==="now",f=k=>ag_sine(clamp(u*1.6-k*0.3,0,1)),cx=x+w/2;
  ctx.save();ctx.lineCap="round";ctx.lineJoin="round";
  if(i===0){// four goals, one disc each; under them what data must do: deliver (quick, or slow today) and report (one place, or two)
    const names=["Students","Research","Campus","Finances"];for(let k=0;k<4;k++){const a=ag_spr(u*4-k*0.7,0,0.5);if(a<=0)continue;const gx=x+w*(0.14+k*0.24),gy=y+h*0.3,r=Math.min(w*0.08,h*0.17)*a;
      ctx.fillStyle=rgba(LP.paper,1);ctx.strokeStyle=rgba(LP.blue,1);ctx.lineWidth=Math.max(2,r*0.12);ctx.beginPath();ctx.arc(gx,gy,r,0,TAU);ctx.fill();ctx.stroke();
      ctx.fillStyle=rgba(LP.blue,1);ctx.beginPath();ctx.arc(gx,gy,r*0.32,0,TAU);ctx.fill();if(words)ds_say(ctx,names[k],gx,gy+r+44,{a});}
    const d=f(2.2);if(d>0.004){if(words){lp_pill(ctx,x+w*0.27,y+h*0.82,now?"Deliver: 41 days":"Deliver: quick",{col:now?LP.amber:LP.green,a:d,size:28});
        lp_pill(ctx,x+w*0.73,y+h*0.82,now?"Report: two places":"Report: one place",{col:now?LP.amber:LP.green,a:d,size:28});}
      else{ctx.globalAlpha*=d;ctx.fillStyle=rgba(now?LP.amber:LP.green,1);rr(ctx,x+w*0.1,y+h*0.72,w*0.36,h*0.2,h*0.1);ctx.fill();rr(ctx,x+w*0.54,y+h*0.72,w*0.36,h*0.2,h*0.1);ctx.fill();ctx.globalAlpha/=d;}}}
  else if(i===1){// twelve decisions along the top; under them the team and its partners, six pages and one door (today: eleven ways in, one queue)
    for(let k=0;k<12;k++){const a=ag_spr(u*5-k*0.25,0,0.5);if(a<=0)continue;const s=Math.min(w*0.045,h*0.08)*a,dx=x+w*(0.08+k*0.0764),dy=y+h*0.16;ctx.fillStyle=rgba(LP.blue,1);rr(ctx,dx-s/2,dy-s/2,s,s,s*0.2);ctx.fill();}
    if(words)ds_say(ctx,"12 decisions",cx,y+h*0.16+62,{a:f(0.6)});
    if(now){const q=f(1.4);if(q>0.004){ctx.globalAlpha*=q;for(let k=0;k<11;k++){const an=Math.PI*(0.15+0.7*k/10);ds_arrow(ctx,cx+Math.cos(an)*w*0.42,y+h*0.95-Math.sin(an)*h*0.3,cx+Math.cos(an)*w*0.08,y+h*0.95-Math.sin(an)*h*0.06,1,LP.amber,{lw:Math.max(2,w*0.004),head:Math.max(6,w*0.012),al:0.8});}
        ctx.fillStyle=rgba(LP.amber,1);ctx.beginPath();ctx.arc(cx,y+h*0.88,Math.min(w,h)*0.07,0,TAU);ctx.fill();ctx.globalAlpha/=q;}}
    else{const rg=f(1.2),pg=f(2.0),dg=f(2.6),ry=y+h*(words?0.6:0.62),R=Math.min(w*0.12,h*0.22);ds_miniRing(ctx,x+w*0.2,ry,R,{a:rg,u:rg});
      for(let k=0;k<6;k++){const a=ag_spr(pg*6-k,0,0.5);if(a>0)ds_mini(ctx,x+w*(0.42+k*0.067),ry-R*0.6,w*0.052,R*1.2,{col:LP.blue,lines:2,a:Math.min(1,a)});}
      if(dg>0.004){ctx.save();ctx.globalAlpha*=dg;ds_miniDoor(ctx,x+w*0.86,ry-R*0.85,w*0.07,R*1.7);ctx.restore();}
      if(words){ds_say(ctx,"Team, 7 partners",x+w*0.2,ry+R+56,{a:rg});ds_say(ctx,"6 pages",x+w*0.58,ry+R+56,{a:pg});ds_say(ctx,"1 door",x+w*0.895,ry+R+56,{a:dg});}}}
  else if(i===2){// one governed copy, its owner in the business, read by everyone allowed to (today: three copies of the staff list)
    const lw=Math.min(w*0.2,h*0.42),lh=lw*1.25,ly=y+h*(words?0.12:0.14);
    if(now){for(let k=0;k<3;k++){const a=ag_spr(u*3-k*0.8,0,0.5);if(a>0)ds_list(ctx,x+w*(0.12+k*0.29),ly,lw,lh,{a:Math.min(1,a),edge:LP.amber,ew:Math.max(2,w*0.004)});}
      if(words)ds_say(ctx,"Three copies",cx,y+h*0.9,{a:f(1.8),col:LP.amber});}
    else{const m=f(0.4);for(let k=0;k<3;k++){const ox=lerp(x+w*(0.12+k*0.29),cx-lw/2,ag_sine(clamp(u*1.8-0.4,0,1)));ds_list(ctx,ox,ly,lw,lh,{a:k===1?1:1-ag_sine(clamp(u*1.8-0.6,0,1))});}
      const ow=f(1.6);if(ow>0.004){ctx.save();ctx.globalAlpha*=ow;ctx.fillStyle=rgba(LP.green,1);ctx.beginPath();ctx.arc(cx+lw*0.5,ly+lh*0.1,Math.max(8,lw*0.14),0,TAU);ctx.fill();
        lp_icon(ctx,"tick",cx+lw*0.5,ly+lh*0.1,Math.max(16,lw*0.2),[255,255,255]);ctx.restore();}
      const rd=f(2.4);for(let k=0;k<3;k++){const rx=x+w*(0.18+k*0.32),ry=y+h*0.78;ds_arrow(ctx,cx,ly+lh+8,rx,ry-Math.min(w,h)*0.06,rd,LP.mut,{lw:Math.max(2,w*0.003),head:Math.max(6,w*0.012),al:0.7});
        if(rd>0.6)ds_reader(ctx,rx,ry,Math.min(w,h)*0.05,ag_sine((rd-0.6)/0.4));}
      if(words){ds_say(ctx,"One staff list",cx-lw*0.62,ly+lh*0.55,{a:m,align:"right"});ds_say(ctx,"Owner: HR",cx+lw*0.75,ly+lh*0.18,{a:ow,align:"left",col:LP.green});
        ds_say(ctx,"Read by everyone allowed to",cx,y+h*0.94,{a:rd});}}}
  else if(i===3){// one platform for data and reports, its catalog, and an agent with its written mandate; the old warehouse gone
    const px=x+w*0.36,py=y+h*0.1,pw=w*0.6,ph=h*0.62,g=f(0.2);
    const ow=words?f(0.3):1,gone=now?0:f(2.6);if(ow>0.004){ctx.save();ctx.globalAlpha*=ow*(1-0.8*gone);ctx.fillStyle="rgb(196,190,184)";rr(ctx,x+w*0.04,y+h*0.26,w*0.24,h*0.4,10);ctx.fill();
      ctx.fillStyle="rgba(255,255,255,0.4)";for(let k=0;k<3;k++)ctx.fillRect(x+w*0.07,y+h*(0.34+k*0.09),w*0.18,h*0.04);ctx.restore();
      if(gone>0.004){ctx.save();ctx.strokeStyle=rgba(LP.mut,gone);ctx.lineWidth=Math.max(3,w*0.005);ctx.beginPath();ctx.moveTo(x+w*0.05,y+h*0.27);ctx.lineTo(x+w*0.27,y+h*0.65);ctx.moveTo(x+w*0.27,y+h*0.27);ctx.lineTo(x+w*0.05,y+h*0.65);ctx.stroke();ctx.restore();}
      if(words)ds_say(ctx,now?"Old warehouse":"Old warehouse: gone",x+w*0.16,y+h*0.78,{a:ow,col:LP.mut});}
    if(g>0.004){ctx.save();ctx.globalAlpha*=g;ctx.fillStyle=rgba(LP.paper,1);ctx.strokeStyle=rgba(LP.blue,1);ctx.lineWidth=Math.max(3,w*0.005);rr(ctx,px,py,pw,ph,14);ctx.fill();ctx.stroke();
      const tw=pw*0.4,th=ph*0.34;for(const [k,lab] of [[0,"Data"],[1,"Reports"]]){const tx=px+pw*(0.07+k*0.47),ty=py+ph*0.2;ctx.fillStyle=rgba(k?LP.blue:LP.orange,0.14);rr(ctx,tx,ty,tw,th,8);ctx.fill();
        ctx.strokeStyle=rgba(k?LP.blue:LP.orange,0.9);ctx.lineWidth=Math.max(2,w*0.003);rr(ctx,tx,ty,tw,th,8);ctx.stroke();if(words)ds_say(ctx,lab,tx+tw/2,ty+th/2+10);}
      const cg=f(1.2);if(cg>0.004){ctx.globalAlpha*=cg;ctx.fillStyle=rgba(LP.blue,0.14);rr(ctx,px+pw*0.07,py+ph*0.64,pw*0.86,ph*0.24,8);ctx.fill();if(words)ds_say(ctx,"Catalog",px+pw/2,py+ph*0.76+10);ctx.globalAlpha/=cg;}
      if(words&&!now)ds_say(ctx,"One platform",px+pw/2,py-18,{w:800});ctx.restore();}
    const ag=f(1.9);if(ag>0.004&&!now){const ax=px+pw*0.22,ay=y+h*0.87,r=Math.min(w,h)*0.07;ag_model(ctx,ax,ay,r,{a:ag,core:0.8});
      ds_mini(ctx,ax+r*1.6,ay-r*1.1,r*1.6,r*2.1,{col:LP.violet,lines:3,a:ag});if(words)ds_say(ctx,"A written mandate",ax+r*3.6,ay+10,{a:ag,align:"left"});}}
  else{// the platform in the cloud; the old servers, switched off (today they run)
    const cw=w*0.5,chh=h*0.5,cx0=x+w*0.42,cy0=y+h*0.12,g=f(0.2);
    if(g>0.004){ctx.save();ctx.globalAlpha*=g;ctx.beginPath();ds_cloudPath(ctx,cx0,cy0,cw,chh);ctx.fillStyle=rgba(LP.paper,1);ctx.fill();ctx.strokeStyle=rgba(LP.blue,1);ctx.lineWidth=Math.max(3,w*0.005);ctx.stroke();
      ctx.fillStyle=rgba(LP.blue,0.16);rr(ctx,cx0+cw*0.3,cy0+chh*0.5,cw*0.42,chh*0.32,8);ctx.fill();if(words)ds_say(ctx,"The platform",cx0+cw/2,cy0+chh+48);ctx.restore();}
    const s=f(1.2),off=now?0:f(2.2);if(s>0.004){ctx.save();ctx.globalAlpha*=s*(1-0.45*off);for(let k=0;k<3;k++)ds_rack(ctx,x+w*(0.06+k*0.1),y+h*0.22,w*0.08,h*0.48,1-off);ctx.restore();
      if(words)ds_say(ctx,now?"Own servers, since 2012":"Old servers: off",x+w*0.2,y+h*0.82,{a:s,col:off>0.5?LP.mut:LP.ink});}}
  ctx.restore();}
// a layer of the target, whole: its page on the left and its picture on the right, drawn together (u, 0 to 1); o.a
function ds_layerPage(ctx,i,u,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const L=DS_LAYER[i];ctx.save();ctx.globalAlpha*=a;
  lp_textSheet(ctx,DS_PAGE.x,DS_PAGE.y,DS_PAGE.w,{kick:(i+1)+" of 5 · "+L.name,lines:L.lines},{col:LP.blue,light:o.light,u:clamp(u*1.15,0,1),k:o.k});
  const P=DS_PIC;lp_sheet(ctx,P.x,P.y,P.w,P.h,{light:o.light,k:o.k});ds_layerPic(ctx,i,P.x+40,P.y+50,P.w-80,P.h-90,u,{});
  ctx.restore();}
const DS_ROWS={x:520,y:140,w:880,h:720},DS_ROWPIC={w:860,h:510};
// the five layers on one sheet, in rows: each row its name, a small page and the layer's picture made small. o.kind ("target" or "now"),
// o.u [0 to 1 for each row], o.hi (the row to pick out, or -1), o.threads (0 to 1: blue threads from the information, application and
// technology rows up to the business row's decisions: every system and every copy has a decision behind it), o.x, o.y (where the sheet's
// top left is, if not DS_ROWS'), o.a, o.k, o.light. Returns the rows' boxes
function ds_layers(ctx,o){o=o||{};const R=Object.assign({},DS_ROWS,{x:o.x==null?DS_ROWS.x:o.x,y:o.y==null?DS_ROWS.y:o.y}),a=o.a==null?1:o.a,rh=(R.h-60)/5,boxes=[];
  for(let i=0;i<5;i++)boxes.push({x:R.x,y:R.y+30+i*rh,w:R.w,h:rh});if(a<=0.004)return boxes;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,R.x+R.w/2,R.y+R.h/2,lerp(0.7,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,R.x,R.y,R.w,R.h,{col:o.kind==="now"?null:LP.blue,light:o.light===undefined?"day":o.light,pin:false});
  const k=(rh-20)/DS_ROWPIC.h,pw=DS_ROWPIC.w*k,px=R.x+R.w-pw-110;
  for(let i=0;i<5;i++){const b=boxes[i],u=o.u?o.u[i]:1;if(i){ctx.fillStyle=rgba(LP.mut,0.18);ctx.fillRect(b.x+30,b.y,b.w-60,2);}if(u<=0.004)continue;
    const hi=o.hi===i;if(hi){ctx.fillStyle=rgba(LP.blue,0.08);ctx.fillRect(b.x+12,b.y+4,b.w-24,b.h-8);}
    lp_T(ctx,DS_LAYER[i].name,b.x+40,b.y+b.h/2+10,{w:800,size:30,col:hi?LP.blue:LP.ink,a:ag_sine(u)});
    ds_mini(ctx,px-b.h*0.62-40,b.y+14,b.h*0.62,b.h-28,{col:o.kind==="now"?null:LP.blue,lines:3,a:ag_sine(u)});
    ctx.save();ctx.translate(px,b.y+10);ctx.scale(k,k);ds_layerPic(ctx,i,0,0,DS_ROWPIC.w,DS_ROWPIC.h,u,{words:false,kind:o.kind});ctx.restore();}
  const th=o.threads||0;if(th>0.004){const ex=px+pw+20,ey=boxes[1].y+boxes[1].h*0.5;ctx.save();ctx.strokeStyle=rgba(LP.blue,0.9);ctx.lineWidth=4;ctx.lineCap="round";
    [2,3,4].forEach((r,j)=>{const v=ag_sine(clamp(th*1.5-j*0.25,0,1));if(v<=0)return;const sy=boxes[r].y+boxes[r].h*0.5,bend=40+j*22;
      const P=[[ex,sy],[ex+bend,sy],[ex+bend,ey],[ex,ey]],q=u2=>{const m=1-u2;return[m*m*m*P[0][0]+3*m*m*u2*P[1][0]+3*m*u2*u2*P[2][0]+u2*u2*u2*P[3][0],m*m*m*P[0][1]+3*m*m*u2*P[1][1]+3*m*u2*u2*P[2][1]+u2*u2*u2*P[3][1]];};
      ctx.beginPath();for(let n=0;n<=24;n++){const pt=q(v*n/24);n?ctx.lineTo(pt[0],pt[1]):ctx.moveTo(pt[0],pt[1]);}ctx.stroke();
      if(v>0.95){const e=q(1),f=q(0.94),an=Math.atan2(e[1]-f[1],e[0]-f[0]);ctx.fillStyle=rgba(LP.blue,0.9);ctx.beginPath();ctx.moveTo(e[0],e[1]);
        ctx.lineTo(e[0]-Math.cos(an-0.5)*16,e[1]-Math.sin(an-0.5)*16);ctx.lineTo(e[0]-Math.cos(an+0.5)*16,e[1]-Math.sin(an+0.5)*16);ctx.closePath();ctx.fill();}});ctx.restore();}
  ctx.restore();return boxes;}

/* ---------------------------------------------------------------- today: one queue, private copies */
// one queue at the centre: requests waiting in a line to the data team's desk, and the wait in amber; (x, y) the line's left end, w long;
// o.u (0 to 1), o.t (time: the line moves, slowly), o.a
function ds_queue(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const u=o.u==null?1:o.u,t=o.t||0;ctx.save();ctx.globalAlpha*=a;
  const n=9,step=w/(n+1);for(let k=0;k<n;k++){const f=ag_spr(u*n-k*0.6,0,0.5);if(f<=0)continue;const sx=x+(n-1-k)*step+((t*6)%step)*0.0,sy=y-60;
    ds_mini(ctx,sx,sy,step*0.7,120,{col:LP.amber,lines:3,a:Math.min(1,f)});}
  ctx.restore();}
// three copies of the staff list, side by side, each with its own total bar: numbers that disagree; (x, y) the first's top left; o.u, o.dis
// (0 to 1: their totals show, and differ), o.a
function ds_copies(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const u=o.u==null?1:o.u,d=o.dis||0;ctx.save();ctx.globalAlpha*=a;
  const lens=[0.78,0.62,0.9];for(let k=0;k<3;k++){const f=ag_spr(u*3-k*0.7,0,0.5);if(f<=0)continue;const sx=x+k*190,sy=y+(k%2)*26;ds_list(ctx,sx,sy,160,200,{a:Math.min(1,f)});
    if(d>0.004){ctx.fillStyle=rgba(LP.amber,d);ctx.fillRect(sx+18,sy+214,124*lens[k]*ag_sine(d),12);}}
  ctx.restore();}

/* ---------------------------------------------------------------- a small team in the middle, the partners around it */
const DS_RING={cx:720,cy:460,r:110,rx:560,ry:290};
const DS_AREAS=["Arts","Business","Engineering","Health","Finance","HR","Facilities"];
const DS_JOBS=[["Platform",476,437],["Standards",970,437],["Shared products",410,595],["Guardrails",1000,595]];
// where partner k sits on the ring
const ds_partnerAt=k=>{const an=-Math.PI/2+k*TAU/7;return[DS_RING.cx+Math.cos(an)*DS_RING.rx,DS_RING.cy+Math.sin(an)*DS_RING.ry];};
// the ring: the team in the middle (o.core, 0 to 1), its four jobs (o.jobs [0 to 1 each]; o.jobsA, their alpha), the help that goes out
// from it (o.help, 0 to 1: green threads to every partner), and the seven partners (o.u [0 to 1 each]); o.hi (a partner to pick out); o.a
function ds_ring(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const R=DS_RING;ctx.save();ctx.globalAlpha*=a;
  const pu=o.u||[];for(let k=0;k<7;k++){const f=ag_sine(clamp((pu[k]||0)*1.4,0,1));if(f<=0)continue;const [px,py]=ds_partnerAt(k);
    ctx.strokeStyle=rgba(LP.mut,0.35);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(R.cx,R.cy);ctx.lineTo(lerp(R.cx,px,f),lerp(R.cy,py,f));ctx.stroke();}
  const hp=o.help||0;if(hp>0.004)for(let k=0;k<7;k++){if(!(pu[k]>0.5))continue;const [px,py]=ds_partnerAt(k),v=ag_sine(clamp(hp*1.5-k*0.07,0,1));
    ds_arrow(ctx,lerp(R.cx,px,0.2),lerp(R.cy,py,0.2),lerp(R.cx,px,lerp(0.2,0.84,v)),lerp(R.cy,py,lerp(0.2,0.84,v)),v>0?1:0,LP.green,{lw:4,head:16});}
  const core=o.core==null?1:o.core;if(core>0.004){const s=ag_spr(core,0,0.5);ctx.save();ctx.shadowColor="rgba(52,36,30,0.26)";ctx.shadowBlur=18;ctx.shadowOffsetX=LP.sdx*0.6;ctx.shadowOffsetY=8;
    ctx.fillStyle=rgba(LP.paper,1);ctx.beginPath();ctx.arc(R.cx,R.cy,R.r*s,0,TAU);ctx.fill();ctx.restore();ctx.strokeStyle=rgba(LP.blue,1);ctx.lineWidth=6;ctx.beginPath();ctx.arc(R.cx,R.cy,R.r*s,0,TAU);ctx.stroke();
    ds_say(ctx,"A small",R.cx,R.cy-6,{w:800,a:core});ds_say(ctx,"team",R.cx,R.cy+30,{w:800,a:core});}
  const jA=o.jobsA==null?1:o.jobsA;(o.jobs||[]).forEach((v,k)=>{if(v<=0.004||jA<=0.004)return;const [lab,jx,jy]=DS_JOBS[k];lp_tag(ctx,jx,jy,lab,{align:"center",col:LP.blue,a:ag_sine(v)*jA});});
  for(let k=0;k<7;k++){const f=ag_spr(pu[k]||0,0,0.5);if(f<=0)continue;const [px,py]=ds_partnerAt(k),hi=o.hi===k;
    ctx.save();ctx.shadowColor="rgba(52,36,30,0.24)";ctx.shadowBlur=12;ctx.shadowOffsetX=LP.sdx*0.5;ctx.shadowOffsetY=6;ctx.fillStyle=rgba(LP.paper,1);ctx.beginPath();ctx.arc(px,py,36*f,0,TAU);ctx.fill();ctx.restore();
    ctx.strokeStyle=rgba(hi?LP.green:LP.blue,1);ctx.lineWidth=5;ctx.beginPath();ctx.arc(px,py,36*f,0,TAU);ctx.stroke();ctx.fillStyle=rgba(hi?LP.green:LP.blue,1);ctx.beginPath();ctx.arc(px,py,12*f,0,TAU);ctx.fill();
    ds_say(ctx,DS_AREAS[k],px,py+(py<DS_RING.cy-100?-52:76),{w:700,a:Math.min(1,f)});}
  ctx.restore();}
// forty small sheets in rows, each a spreadsheet: the people who already do data work part of their week; (x, y) the top left; o.u, o.a
function ds_marks(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const u=o.u==null?1:o.u;ctx.save();ctx.globalAlpha*=a;
  for(let k=0;k<40;k++){const f=ag_spr(u*40-k,0,0.4);if(f<=0)continue;const i=k%10,j=(k/10)|0,sx=x+i*74,sy=y+j*84;ds_grid(ctx,sx,sy,56,66,{a:Math.min(1,f),rows:4,cols:3});}
  ctx.restore();}

/* ---------------------------------------------------------------- six procedures, a page each */
const DS_PAGES=["Ask","Choose","Build","Release","Fix","Retire"];
// the six pages in a row from (x, y), each w wide: its name and grey lines, and a small picture of its four roles at its foot; o.u (0 to 1),
// o.hi (the page to pick out), o.his (how much each page is picked out, 0 to 1 each), o.dim (0 to 1: the others fade back), o.a
function ds_pageRow(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const u=o.u==null?1:o.u,h=w*1.3,gap=w*0.14;ctx.save();ctx.globalAlpha*=a;
  DS_PAGES.forEach((nm,k)=>{const f=ag_spr(u*6-k*0.8,0,0.5);if(f<=0)return;const px=x+k*(w+gap),hi=o.hi===k,al=hi?1:1-0.6*(o.dim||0);ctx.save();ctx.globalAlpha*=al;
    ag_about(ctx,px+w/2,y+h/2,lerp(0.7,1,Math.min(1,f)));lp_sheet(ctx,px,y,w,h,{col:LP.blue,light:o.light===undefined?"day":o.light,pin:false});
    const hv=o.his?(o.his[k]||0):hi?1:0;if(hv>0.004){ctx.strokeStyle=rgba(LP.blue,hv);ctx.lineWidth=5;rr(ctx,px-7,y-7,w+14,h+14,10);ctx.stroke();}
    lp_T(ctx,nm,px+w/2,y+86,{w:800,size:36,align:"center"});ctx.fillStyle=rgba(LP.mut,0.25);for(let i=0;i<4;i++)ctx.fillRect(px+w*0.16,y+122+i*24,w*(i%2?0.56:0.68),8);
    ds_flow(ctx,px+w*0.12,y+h*0.74,w*0.76,h*0.16,{small:1});ctx.restore();});
  ctx.restore();}
// a page's picture: the four roles, and how the work passes between them: who asks, who decides, who builds, who checks; (x, y) the top
// left of its box, w by h. o.u (0 to 1), o.small (shapes only), o.wait (0 to 1: the work stuck before the check, in amber), o.fix (0 to
// 1: one reviewer named at the check, in green), o.a
const DS_ROLES=["Asks","Decides","Builds","Checks"];
function ds_flow(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const u=o.u==null?1:o.u,sm=o.small,r=sm?Math.min(h*0.34,w*0.07):Math.min(h*0.2,w*0.06);ctx.save();ctx.globalAlpha*=a;
  const cy=y+h*(sm?0.5:0.36),xs=[0,1,2,3].map(k=>x+w*(0.1+k*0.267));
  for(let k=0;k<3;k++){const v=ag_sine(clamp(u*4-k-0.6,0,1)),stuck=k===2?(o.wait||0):0;ds_arrow(ctx,xs[k]+r+6,cy,xs[k+1]-r-6,cy,v,stuck>0.5?LP.amber:LP.blue,{lw:sm?2.5:5,head:sm?8:18});}
  const back=ag_sine(clamp(u*4-3.2,0,1));if(back>0.01){const y0=cy+r+(sm?6:76),dy=sm?14:60,P=[[xs[3],y0],[xs[3],y0+dy],[xs[0],y0+dy],[xs[0],y0]],
      q=v=>{const m=1-v;return[m*m*m*P[0][0]+3*m*m*v*P[1][0]+3*m*v*v*P[2][0]+v*v*v*P[3][0],m*m*m*P[0][1]+3*m*m*v*P[1][1]+3*m*v*v*P[2][1]+v*v*v*P[3][1]];};
    ctx.save();ctx.strokeStyle=rgba(LP.blue,0.6);ctx.lineWidth=sm?2:4;ctx.setLineDash(sm?[4,5]:[10,10]);ctx.beginPath();for(let n=0;n<=30;n++){const pt=q(back*n/30);n?ctx.lineTo(pt[0],pt[1]):ctx.moveTo(pt[0],pt[1]);}ctx.stroke();ctx.setLineDash([]);
    if(back>0.95&&!sm){const e=q(1),f=q(0.95),an=Math.atan2(e[1]-f[1],e[0]-f[0]);ctx.fillStyle=rgba(LP.blue,0.6);ctx.beginPath();ctx.moveTo(e[0],e[1]);ctx.lineTo(e[0]-Math.cos(an-0.5)*16,e[1]-Math.sin(an-0.5)*16);ctx.lineTo(e[0]-Math.cos(an+0.5)*16,e[1]-Math.sin(an+0.5)*16);ctx.closePath();ctx.fill();}
    ctx.restore();}
  for(let k=0;k<4;k++){const f=ag_spr(u*4-k,0,0.5);if(f<=0)continue;const hiW=k===3&&(o.fix||0)>0.5?LP.green:LP.blue;ctx.fillStyle=rgba(LP.paper,1);ctx.strokeStyle=rgba(hiW,1);ctx.lineWidth=sm?2.5:5;
    ctx.beginPath();ctx.arc(xs[k],cy,r*f,0,TAU);ctx.fill();ctx.stroke();ctx.fillStyle=rgba(hiW,1);ctx.beginPath();ctx.arc(xs[k],cy,r*0.34*f,0,TAU);ctx.fill();
    if(!sm)ds_say(ctx,DS_ROLES[k],xs[k],cy+r+52,{w:700,a:Math.min(1,f)});}
  if(!sm){const wt=o.wait||0;if(wt>0.004){lp_icon(ctx,"wait",lerp(xs[2],xs[3],0.5),cy-r-24,40,LP.amber);ctx.save();ctx.globalAlpha*=wt;ds_say(ctx,"4 working days",lerp(xs[2],xs[3],0.5),cy-r-70,{w:700,col:LP.amber});ctx.restore();}
    const fx=o.fix||0;if(fx>0.004){ctx.save();ctx.globalAlpha*=fx;ds_say(ctx,"One reviewer",xs[3],cy-r-70,{w:700,col:LP.green});ds_say(ctx,"2 working days",xs[3],cy-r-30,{w:600,col:LP.green});ctx.restore();}}
  ctx.restore();}
// the build page, whole: who asks, decides, builds and checks; its five steps; what it leaves behind. (x, y) its top left, w wide. o.u (0
// to 1: its parts come in), o.step (0 to 1: step four picked out in amber, as Anil's change waits), o.fix (0 to 1: step four and who checks
// rewritten), o.a, o.k, o.light. Returns its box
const DS_BUILD={roles:[["Asks","The person with the decision"],["Decides","The product's owner"],["Builds","A data partner, or the team"],["Checks","The data team"]],
  steps:["Settle the meaning in the glossary","Build and test it on the platform","Tell the owners what it touches","The team checks it","Release it, with its owner"],
  fixed:"One reviewer, from a rota, within 2 working days; never the builder",fixRole:"One reviewer, from a rota",leaves:"Tested code, a catalog entry, an owner"};
function ds_buildPage(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,B=DS_BUILD,fx=o.fix||0,inner=w-72,fl=lp_wrap(ctx,"4  "+B.fixed,inner-20,{w:600,size:28}),h=716+(fl.length-1)*38*ag_sine(fx),bb={x,y,w,h};
  if(a<=0.004)return bb;const u=o.u==null?1:o.u,part=k=>ag_sine(clamp(u*3-k,0,1));ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.blue,light:o.light===undefined?"day":o.light});let yy=y+66;
  lp_T(ctx,"BUILD",x+36,yy+14,{w:800,size:28,ls:3,col:LP.blue});yy+=56;lp_T(ctx,"Build a product",x+36,yy,{w:800,size:40});yy+=30;
  ctx.save();ctx.globalAlpha*=part(0);B.roles.forEach(([r,v],k)=>{yy+=40;lp_T(ctx,r,x+36,yy,{w:800,size:28,col:LP.blue});
    if(k===3&&fx>0.004){lp_T(ctx,v,x+220,yy,{w:600,size:28,a:1-ag_sine(fx)});lp_T(ctx,B.fixRole,x+220,yy,{w:700,size:28,col:LP.green,a:ag_sine(fx)});}else lp_T(ctx,v,x+220,yy,{w:600,size:28});});ctx.restore();
  yy+=30;ctx.save();ctx.globalAlpha*=part(1);lp_T(ctx,"STEPS",x+36,yy+24,{w:800,size:28,ls:3,col:LP.mut});yy+=30;
  B.steps.forEach((s,k)=>{yy+=40;if(k===3){const st=o.step||0;if(st>0.004){ctx.fillStyle=rgba(fx>0.5?LP.green:LP.amber,0.13*st);ctx.fillRect(x+20,yy-30,w-40,40+(fl.length-1)*38*ag_sine(fx)+4);}
      if(fx<0.999)lp_T(ctx,(k+1)+"  "+s,x+36,yy,{w:600,size:28,col:st>0.5&&fx<0.5?LP.amber:LP.ink,a:1-ag_sine(fx)});
      if(fx>0.001){fl.forEach((l,i)=>lp_T(ctx,l,x+36+(i?40:0),yy+i*38,{w:700,size:28,col:LP.green,a:ag_sine(fx)}));yy+=(fl.length-1)*38*ag_sine(fx);}}
    else lp_T(ctx,(k+1)+"  "+s,x+36,yy,{w:600,size:28});});ctx.restore();
  yy+=30;ctx.save();ctx.globalAlpha*=part(2);lp_T(ctx,"LEAVES BEHIND",x+36,yy+24,{w:800,size:28,ls:3,col:LP.mut});yy+=70;lp_T(ctx,B.leaves,x+36,yy,{w:600,size:28});ctx.restore();
  ctx.restore();return bb;}

/* ---------------------------------------------------------------- the front door, a spreadsheet, the report */
const DS_QS=["What decision?","By when?","Who decides?","What data do you use already?","Who else needs it?"];
// the front door's form: five questions, each with its box to fill; (x, y) its top left, w wide; o.u (0 to 1: the questions come in), o.a, o.k
function ds_form(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=660,bb={x,y,w,h};if(a<=0.004)return bb;const u=o.u==null?1:o.u;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,ag_spr(o.k,0,0.5)));lp_sheet(ctx,x,y,w,h,{col:LP.blue,light:o.light===undefined?"day":o.light});
  lp_T(ctx,"ONE FRONT DOOR",x+36,y+80,{w:800,size:28,ls:3,col:LP.blue});lp_T(ctx,"Ask for data",x+36,y+136,{w:800,size:40});
  DS_QS.forEach((q,k)=>{const f=ag_sine(clamp(u*5-k,0,1));if(f<=0)return;const yy=y+210+k*92;ctx.save();ctx.globalAlpha*=f;lp_T(ctx,(k+1)+"  "+q,x+36,yy,{w:700,size:28});
    ctx.strokeStyle=rgba(LP.mut,0.4);ctx.lineWidth=2;ctx.strokeRect(x+36,yy+16,w-72,40);ctx.restore();});
  ctx.restore();return bb;}
// a spreadsheet: a sheet ruled in cells, a few of them filled; (x, y) its top left, w by h; o.rows, o.cols, o.a, o.edge
function ds_grid(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const rows=o.rows||8,cols=o.cols||5,R=ag_rnd(o.seed||7);ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor="rgba(52,36,30,0.24)";ctx.shadowBlur=10;ctx.shadowOffsetX=LP.sdx*0.5;ctx.shadowOffsetY=5;ctx.fillStyle="rgb(250,250,246)";ctx.fillRect(x,y,w,h);ctx.restore();
  ctx.fillStyle=rgba(LP.green,0.16);ctx.fillRect(x,y,w,h/rows);
  for(let i=1;i<rows;i++)for(let j=0;j<cols;j++)if(R()<0.6){ctx.fillStyle=rgba(LP.mut,0.22);ctx.fillRect(x+j*w/cols+w/cols*0.15,y+i*h/rows+h/rows*0.35,w/cols*(0.4+R()*0.4),Math.max(2,h/rows*0.3));}
  ctx.strokeStyle=rgba(LP.mut,0.3);ctx.lineWidth=1;for(let i=1;i<rows;i++){ctx.beginPath();ctx.moveTo(x,y+i*h/rows);ctx.lineTo(x+w,y+i*h/rows);ctx.stroke();}
  for(let j=1;j<cols;j++){ctx.beginPath();ctx.moveTo(x+j*w/cols,y);ctx.lineTo(x+j*w/cols,y+h);ctx.stroke();}
  if(o.edge){ctx.strokeStyle=rgba(o.edge,0.95);ctx.lineWidth=4;ctx.strokeRect(x-3,y-3,w+6,h+6);}ctx.restore();}
// Health's report of casual teaching hours, by teaching period: a sheet with its bars in data's orange; (x, y) its top left, w by h; o.u, o.a, o.k
function ds_report(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.orange,light:o.light===undefined?"day":o.light});lp_T(ctx,"HEALTH",x+36,y+80,{w:800,size:28,ls:3,col:LP.orange});lp_T(ctx,"Casual teaching hours",x+36,y+134,{w:800,size:40});
  lp_bars(ctx,x+50,y+170,w-100,h-190,[{v:62,label:"Feb"},{v:88,label:"Mar"},{v:74,label:"Apr"},{v:40,label:"May"},{v:22,label:"Jun"}],{u:o.u==null?1:o.u});
  ctx.restore();}
