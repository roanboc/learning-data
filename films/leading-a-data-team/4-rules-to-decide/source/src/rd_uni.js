/* ===== Rules that let people decide: the university, 2027 =====
   The film's own pictures for the data team's spring, September to November (prefix rd_). The module's kit draws the rooms, the people, the sheets and the
   things in them, and is never changed for this film; what is here is this film's alone:
     rdMorning, rdLate, rdFaculty, rdEng   the team's room on a morning and late in the afternoon, a faculty's office on a grey day,
                                           Engineering's office on a morning
     RD_PEOPLE                             Lucy Tran, Engineering's timetable officer, and the other three faculties' officers (Arts,
                                           Business, Health), never named in the film
     rd_hub(ctx, cx, cy, o)                every decision through one place: the data team in the middle, the four faculties round it,
                                           the arrows turning from inward (every question to the team) to outward (decisions given back)
     rd_queue(ctx, t, o)                   the faculties' room reports queuing at the team's one front door
     rd_rule(ctx, x, y, w, n, words, o)    one of the rules, on a card: what it says, and why
     rd_eleven(ctx, o), rd_drawer(...)     Yusuf's first list, eleven cards on the wall; the drawer the eight go into, until a real
                                           problem shows
     rd_template(ctx, X, Y, W, H, o)       the template, on a screen: who decides what, each room by the hour, booked beside counted,
                                           room use worked out the agreed way, and (later) the date of its data in the corner
     rd_labs(ctx, X, Y, W, H, o)           Lucy's page: Engineering's twelve teaching labs, booked and counted, mornings, Monday to Friday
     rd_spread(ctx, o)                     the four faculties, and Lucy's page copied from one to the next
   Colour keeps the module's meaning: orange the data (the product, the counts, the lab measure), blue plans and designs (the rules,
   the template's who-decides-what, the faculties' own decisions), green what's done, amber what waits or is at risk (the queue,
   the empty labs, the old copy); people wear none of them. */

/* ---------------------------------------------------------------- the places */
AG_PLACES.rdMorning=c=>lp_paintRoom(c,{light:"morning",seed:5});
AG_PLACES.rdLate=c=>lp_paintRoom(c,{light:"late",seed:9});
AG_PLACES.rdFaculty=c=>lp_paintRoom(c,{light:"grey",seed:11,base:[220,212,198]});
AG_PLACES.rdEng=c=>lp_paintRoom(c,{light:"morning",seed:13,base:[216,206,190]});

/* ---------------------------------------------------------------- the people this film adds */
const RD_PEOPLE={
  lucy:{name:"Lucy Tran",role:"Timetable officer, Engineering",skin:[224,186,152],hair:{style:"bun",c:[30,26,28]},earrings:[220,204,170],top:{kind:"cardigan",c:[106,110,80],inner:[238,234,224]},breath:0.3},
  arts:{name:"Arts officer",role:"Timetable officer, Arts",skin:[120,82,60],hair:{style:"coily",c:[34,28,26]},earrings:[220,200,160],top:{kind:"cardigan",c:[150,122,98],inner:[236,232,226]},breath:0.29},
  business:{name:"Business officer",role:"Timetable officer, Business",skin:[214,174,140],hair:{style:"cropped",c:[52,44,40]},glasses:[54,50,48],top:{kind:"overshirt",c:[112,108,100],inner:[226,228,230]},breath:0.26},
  health:{name:"Health officer",role:"Timetable officer, Health",skin:[196,146,112],hair:{style:"long",c:[44,34,30]},earrings:[214,196,150],top:{kind:"blazer",c:[96,98,104],inner:[236,236,232]},breath:0.28}
};
const RD_FAC=["Arts","Business","Engineering","Health"];

/* ---------------------------------------------------------------- small things */
// a box with words in it, centred on (x, y): o.col (its outline, when the colour means something), o.fill, o.a, o.w (its width)
function rd_node(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const w=o.w||Math.max(150,lp_tw(ctx,text,{w:700,size:28})+56),h=o.h||70;
  ctx.save();ctx.globalAlpha*=a;ctx.save();ctx.shadowColor="rgba(52,36,30,0.2)";ctx.shadowBlur=12;ctx.shadowOffsetX=LP.sdx*0.4;ctx.shadowOffsetY=5;rr(ctx,x-w/2,y-h/2,w,h,16);
  ctx.fillStyle=o.fill?rgba(o.fill,1):"rgba(250,247,240,0.98)";ctx.fill();ctx.restore();
  if(o.col){ctx.strokeStyle=rgba(o.col,1);ctx.lineWidth=o.lw||4;rr(ctx,x-w/2+1,y-h/2+1,w-2,h-2,16);ctx.stroke();}
  lp_T(ctx,text,x,y+10,{w:700,size:28,align:"center",col:o.tc||LP.ink});ctx.restore();}
// an arrow from (x0, y0) to (x1, y1), drawn on up to part u, with its head
function rd_arrow(ctx,x0,y0,x1,y1,u,col,a,lw){if(u<=0.004||a<=0.004)return;const x=lerp(x0,x1,u),y=lerp(y0,y1,u),an=Math.atan2(y1-y0,x1-x0);lw=lw||5;
  ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);ctx.lineWidth=lw;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x-Math.cos(an)*lw*2.4,y-Math.sin(an)*lw*2.4);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-Math.cos(an-0.45)*lw*4.4,y-Math.sin(an-0.45)*lw*4.4);ctx.lineTo(x-Math.cos(an+0.45)*lw*4.4,y-Math.sin(an+0.45)*lw*4.4);ctx.closePath();ctx.fill();ctx.restore();}

/* ---------------------------------------------------------------- every decision through one place
   rd_hub(ctx, cx, cy, o): o.u (0 to 1: the nodes and arrows come in), o.flip (0 to 1: the arrows turn from inward to outward), o.a,
   o.centre (the middle's words), o.wait (0 to 1: the inward arrows' little queue of waiting cards), o.light (the sheet's light) */
function rd_hub(ctx,cx,cy,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const u=o.u==null?1:o.u,fl=ag_sine(o.flip||0),dx=520,dy=200;
  ctx.save();ctx.globalAlpha*=a;lp_sheet(ctx,cx-700,cy-300,1400,600,{light:o.light===undefined?"day":o.light});
  const P=[[cx-dx,cy-dy],[cx+dx,cy-dy],[cx-dx,cy+dy],[cx+dx,cy+dy]];
  P.forEach(([x,y],i)=>{const ui=clamp(u*5-i*0.6,0,1);if(ui<=0)return;const sx=lerp(x,cx,0.27),sy=lerp(y,cy,0.27),ex=lerp(x,cx,0.72),ey=lerp(y,cy,0.72);
    // inward (amber: every question waits on the team) turning outward (blue: the decision given back)
    if(fl<1)rd_arrow(ctx,sx,sy,ex,ey,ag_sine(ui),LP.amber,1-fl,6);
    if(fl>0)rd_arrow(ctx,ex,ey,sx,sy,ag_sine(fl),LP.blue,fl,6);
    rd_node(ctx,x,y,RD_FAC[i],{a:ui,w:250,col:fl>0.5?LP.blue:null,lw:3+2*fl});});
  const ct=o.centre||"The data team";rd_node(ctx,cx,cy,ct,{a:clamp(u*3,0,1),w:Math.max(300,lp_tw(ctx,ct,{w:700,size:28})+64),h:84,col:fl<0.5?LP.amber:null});
  ctx.restore();}

/* ---------------------------------------------------------------- the queue at the front door
   rd_queue(ctx, t, o): o.t0 (when the first card comes), o.n (how many), o.gap (seconds between cards), o.door [x, y] (where they
   go), o.a. Each card is a faculty's request, with an amber band: it waits */
function rd_queue(ctx,t,o){const a=o.a==null?1:o.a;if(a<=0.004)return;const n=o.n||9,[dx,dy]=o.door;
  // two rows, so every card's faculty can be read; the first to come waits nearest the door; each card fades in at the left
  // edge, inside the frame, so its words never run off it
  for(let i=n-1;i>=0;i--){const t0=o.t0+i*(o.gap||0.45);if(t<t0)continue;const u=ag_sine(clamp((t-t0)/1.6,0,1)),slot=[dx-140-Math.floor(i/2)*205,dy+((i%2)?75:-75)],from=[115+(i%3)*25,dy+40-(i%3)*30];
    const x=lerp(from[0],slot[0],u),y=lerp(from[1],slot[1],u);ctx.save();ctx.globalAlpha*=a*ag_in(t,t0,0.3);
    lp_sheet(ctx,x-95,y-52,190,104,{col:LP.amber,light:null,pin:false,tilt:((i*37)%7-3)});lp_T(ctx,RD_FAC[i%4],x,y+16,{w:700,size:28,align:"center",col:LP.ink});ctx.restore();}}

/* ---------------------------------------------------------------- a rule, on a card
   rd_rule(ctx, x, y, w, n, words, o): words {title, what, why}; o as lp_textSheet (a, k, u, light) */
function rd_rule(ctx,x,y,w,n,words,o){o=o||{};const lines=[];if(words.what)lines.push(words.what);if(words.why)lines.push("Why: "+words.why);
  return lp_textSheet(ctx,x,y,w,{kick:"Rule "+n,title:words.title,lines},Object.assign({col:LP.blue},o));}
const RD_RULES=[
  {title:"Room use means one thing",what:"The share of hours with someone counted",why:"so the faculties' numbers add up"},
  {title:"The product's promise holds",what:"Counts per room per hour, never a person",why:"so nobody is watched"},
  {title:"Ask the owner before a new measure",what:"Ivy, who owns Teaching space use",why:"so each new number means one thing, written down first"},
  {title:"Share the live page, not a copy",what:"A copy shows the date of its data",why:"copies go stale"}];

/* ---------------------------------------------------------------- Yusuf's first list, and the drawer
   rd_eleven(ctx, o): eleven cards in a row on the wall, each with its lines as decoration; o.u (0 to 1: they come in), o.keep (0 to 1: three
   take the blue band, the others fade back), o.drop (0 to 1: the eight go down into the drawer at o.drawer [x, y]), o.out (0 to 1: the
   three leave too), o.light */
const RD_KEEP=[0,4,8];
function rd_eleven(ctx,o){const u=o.u==null?1:o.u,keep=ag_sine(o.keep||0),drop=o.drop||0,out=o.out||0,[qx,qy]=o.drawer||[1500,760];
  for(let i=0;i<11;i++){const ui=clamp(u*6-i*0.45,0,1);if(ui<=0)continue;const kept=RD_KEEP.includes(i),x=520+i*120,y=150;
    let px=x,py=y,s=0.62,al=ui*(1-(kept?out:0));
    if(!kept){const k=RD_KEEP.length,j=[...Array(11).keys()].filter(q=>!RD_KEEP.includes(q)).indexOf(i),dd=ag_sine(clamp(drop*1.6-j*0.08,0,1));
      px=lerp(x,qx-60+j*14,dd);py=lerp(y,qy-40,dd);s=lerp(0.62,0.4,dd);al*=lerp(1-0.45*keep,1,dd)*(1-ag_in(dd,0.8,0.2));}
    if(al<=0.004)continue;ctx.save();ctx.globalAlpha*=al;ctx.translate(px+46,py+62);ctx.scale(s,s);ctx.translate(-75,-100);
    lp_sheet(ctx,0,0,150,200,{col:kept&&keep>0.5?LP.blue:null,light:o.light||null,tilt:((i*29)%7-3)*0.8});
    ctx.fillStyle=rgba(LP.mut,0.35);for(let k=0;k<5;k++)ctx.fillRect(24,52+k*26,k===0?90:102-(k*13)%30,8);ctx.restore();}}
function rd_drawer(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const h=o.h||120,op=o.open||0;ctx.save();ctx.globalAlpha*=a;
  // the cabinet, timber, and its drawer pulled out by op
  const Tb=LP.timber;let g=ctx.createLinearGradient(x,0,x+w,0);g.addColorStop(0,rgba(ag_dk(Tb,0.25),1));g.addColorStop(1,rgba(Tb,1));
  ctx.save();ctx.shadowColor="rgba(52,36,30,0.28)";ctx.shadowBlur=18;ctx.shadowOffsetX=LP.sdx;ctx.shadowOffsetY=8;ctx.fillStyle=g;ctx.fillRect(x,y,w,h);ctx.restore();
  const dy=op*24;ctx.fillStyle=rgba(ag_lt(Tb,0.12),1);ctx.fillRect(x+14,y+14+dy,w-28,h-28);ctx.strokeStyle=rgba(ag_dk(Tb,0.35),0.8);ctx.lineWidth=2;ctx.strokeRect(x+14,y+14+dy,w-28,h-28);
  ctx.fillStyle=rgba(LP.graphite,1);rr(ctx,x+w/2-50,y+h/2-8+dy,100,16,8);ctx.fill();ctx.restore();}

// a small card on the wall, its lines as decoration, not words to read: o.blue (a rule's blue band), o.s (its size), o.tilt, o.light, o.a
function rd_card(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const s=o.s||1;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);
  lp_sheet(ctx,0,0,150,200,{col:o.blue?LP.blue:null,light:o.light||null,tilt:o.tilt||0});
  ctx.fillStyle=rgba(LP.mut,0.35);for(let k=0;k<5;k++)ctx.fillRect(24,52+k*26,k===0?90:102-(k*13)%30,8);ctx.restore();}
// the template, small, as a picture: its orange band and the grid of booked and counted hours, without words; seed picks the rooms
function rd_mini(ctx,X,Y,Wd,Hd,seed){const R=ag_rnd(seed||17);ctx.fillStyle=rgba(LP.paper,1);ctx.fillRect(X,Y,Wd,Hd);ctx.fillStyle=rgba(LP.orange,1);ctx.fillRect(X,Y,Wd,Hd*0.05);
  const gx=X+Wd*0.08,gy=Y+Hd*0.18,cw=(Wd*0.84)/20,ch=Hd*0.11;
  for(let i=0;i<6;i++)for(let j=0;j<20;j++){const x=gx+j*cw,y=gy+i*ch,booked=R()<0.7,counted=booked&&R()<0.72;
    if(booked){ctx.strokeStyle=rgba(LP.mut,0.8);ctx.lineWidth=2;ctx.strokeRect(x+2,y+2,cw-4,ch-4);}
    if(counted){ctx.fillStyle=rgba(LP.orange,0.85);ctx.fillRect(x+5,y+5,cw-10,ch-10);}}}

/* ---------------------------------------------------------------- the template, on a screen
   rd_template(ctx, X, Y, Wd, Hd, o): o.u (0 to 1: the grid fills in), o.who (0 to 1: the who-decides-what box), o.whoU (its lines,
   one by one), o.use (0 to 1: room use), o.date (0 to 1: the date of its data in the corner), o.title */
const RD_WEEK=["Mon","Tue","Wed","Thu","Fri"];
function rd_template(ctx,X,Y,Wd,Hd,o){o=o||{};const u=o.u==null?1:o.u,R=ag_rnd(17);
  ctx.fillStyle=rgba(LP.paper,1);ctx.fillRect(X,Y,Wd,Hd);ctx.fillStyle=rgba(LP.orange,1);ctx.fillRect(X,Y,Wd,10);
  lp_T(ctx,o.title||"Teaching space use · template",X+32,Y+58,{w:800,size:30,col:LP.ink});
  // the grid: rooms down the side, the week across; each hour's booking an outline, its count a fill
  const gx=X+150,gy=Y+150,cw=(Wd-150-560)/5,ch=56,rooms=["G.04","1.02","1.05","2.01","2.03","3.02"];
  RD_WEEK.forEach((d,j)=>lp_T(ctx,d,gx+cw*j+cw/2,gy-18,{w:700,size:28,align:"center",col:LP.mut}));
  rooms.forEach((r,i)=>{const ri=clamp(u*7-i*0.8,0,1);if(ri<=0)return;ctx.save();ctx.globalAlpha*=ri;lp_T(ctx,r,X+40,gy+i*ch+38,{w:700,size:28,col:LP.mut});
    for(let j=0;j<5;j++)for(let k=0;k<4;k++){const x=gx+cw*j+6+k*(cw-12)/4,y=gy+i*ch+8,w=(cw-12)/4-4,h=ch-16,booked=R()<0.7,counted=booked&&R()<0.72;
      if(booked){ctx.strokeStyle=rgba(LP.mut,0.8);ctx.lineWidth=2;ctx.strokeRect(x+1,y+1,w-2,h-2);}
      if(counted){ctx.fillStyle=rgba(LP.orange,0.85);ctx.fillRect(x+4,y+4,w-8,h-8);}}ctx.restore();});
  // the key, and room use worked out the one agreed way
  const ky=gy+rooms.length*ch+44;ctx.save();ctx.globalAlpha*=clamp(u*2-1,0,1);ctx.strokeStyle=rgba(LP.mut,0.8);ctx.lineWidth=2;ctx.strokeRect(X+40,ky-24,30,30);lp_T(ctx,"Booked",X+84,ky,{w:600,size:28,col:LP.ink});
  ctx.fillStyle=rgba(LP.orange,0.85);ctx.fillRect(X+250,ky-24,30,30);lp_T(ctx,"Counted",X+294,ky,{w:600,size:28,col:LP.ink});ctx.restore();
  if(o.use>0.004){ctx.save();ctx.globalAlpha*=o.use;lp_T(ctx,"Room use: the share of hours with someone counted",X+40,ky+56,{w:700,size:28,col:LP.orange});ctx.restore();}
  // who decides what, at the top
  if(o.who>0.004){const bx=X+Wd-540,by=Y+100,bw=500,lines=[["Faculties","their classes"],["Ivy","what the numbers mean"],["The team","the platform"],["Registrar's office","the timetable"]];
    ctx.save();ctx.globalAlpha*=o.who;ctx.fillStyle="rgba(250,247,240,1)";ctx.fillRect(bx,by,bw,400);ctx.strokeStyle=rgba(LP.blue,1);ctx.lineWidth=4;ctx.strokeRect(bx+2,by+2,bw-4,396);
    lp_T(ctx,"WHO DECIDES WHAT",bx+28,by+52,{w:800,size:28,ls:3,col:LP.blue});
    lines.forEach(([who,what],i)=>{const la=o.whoU==null?1:clamp(o.whoU*4-i,0,1);if(la<=0.004)return;ctx.save();ctx.globalAlpha*=ag_sine(la);
      lp_T(ctx,who,bx+28,by+110+i*76,{w:800,size:28,col:LP.ink});lp_T(ctx,what,bx+28,by+144+i*76,{w:600,size:28,col:LP.mut});ctx.restore();});ctx.restore();}
  // the date of its data, in the corner
  if(o.date>0.004){ctx.save();ctx.globalAlpha*=o.date;const t="Data as of Monday 22 November, 07:00",tw=lp_tw(ctx,t,{w:700,size:28})+40;
    ctx.fillStyle=rgba(LP.orange,1);rr(ctx,X+Wd-tw-24,Y+Hd-74,tw,52,26);ctx.fill();lp_T(ctx,t,X+Wd-tw/2-24,Y+Hd-38,{w:700,size:28,align:"center",color:"#fff"});ctx.restore();}}

/* ---------------------------------------------------------------- Lucy's page: Engineering's twelve labs, mornings
   rd_labs(ctx, X, Y, Wd, Hd, o): o.u (the grid fills in: bookings first), o.counts (0 to 1: the counts come in beside them), o.mon (0 to 1:
   Monday's nine empty bookings outlined in amber), o.freed (0 to 1: they're released, the outlines going), o.title */
const RD_LABS=(()=>{const R=ag_rnd(912),g=[];for(let i=0;i<12;i++){const row=[];for(let d=0;d<5;d++){let booked=R()<0.8,counted=booked&&R()<0.85;
  if(d===0){booked=i<9||R()<0.3;counted=i>=9&&booked;}row.push({booked,counted});}g.push(row);}return g;})();
function rd_labs(ctx,X,Y,Wd,Hd,o){o=o||{};const u=o.u==null?1:o.u,cn=o.counts==null?1:o.counts,mon=o.mon||0,fr=o.freed||0;
  ctx.fillStyle=rgba(LP.paper,1);ctx.fillRect(X,Y,Wd,Hd);ctx.fillStyle=rgba(LP.orange,1);ctx.fillRect(X,Y,Wd,10);
  lp_T(ctx,o.title||"Engineering's teaching labs · mornings",X+32,Y+58,{w:800,size:30,col:LP.ink});
  const gx=X+170,gy=Y+130,cw=(Wd-210)/5,ch=(Hd-200)/12;
  RD_WEEK.forEach((d,j)=>lp_T(ctx,d,gx+cw*j+cw/2,gy-14,{w:700,size:28,align:"center",col:j===0&&mon>0.5?LP.amber:LP.mut}));
  for(let i=0;i<12;i++){const ri=clamp(u*8-i*0.5,0,1);if(ri<=0)continue;ctx.save();ctx.globalAlpha*=ri;if(i%2===0)lp_T(ctx,"Lab "+(i+1),X+40,gy+i*ch+ch*0.5+10,{w:700,size:28,col:LP.mut});
    for(let d=0;d<5;d++){const c=RD_LABS[i][d],x=gx+cw*d+10,y=gy+i*ch+4,w=cw-20,h=ch-8,rel=d===0&&!c.counted&&c.booked?fr:0;
      if(c.booked){ctx.strokeStyle=rgba(LP.mut,0.8*(1-rel));ctx.lineWidth=2;ctx.strokeRect(x+1,y+1,w-2,h-2);}
      if(c.counted){ctx.fillStyle=rgba(LP.orange,0.85*cn);ctx.fillRect(x+4,y+3,w-8,h-6);}}ctx.restore();}
  // Monday morning: nine labs booked, and nobody counted in them
  if(mon>0.004){const x=gx+4,y=gy-2,w=cw-8,h=ch*9+4;ctx.save();ctx.globalAlpha*=mon*(1-fr);ctx.strokeStyle=rgba(LP.amber,1);ctx.lineWidth=6;rr(ctx,x,y,w,h,10);ctx.stroke();ctx.restore();}
  ctx.save();ctx.globalAlpha*=clamp(u*2-1,0,1);const ky=Y+Hd-34;ctx.strokeStyle=rgba(LP.mut,0.8);ctx.lineWidth=2;ctx.strokeRect(X+40,ky-24,30,30);lp_T(ctx,"Booked",X+84,ky,{w:600,size:28,col:LP.ink});
  ctx.fillStyle=rgba(LP.orange,0.85*cn);ctx.fillRect(X+250,ky-24,30,30);ctx.globalAlpha*=cn;lp_T(ctx,"Counted",X+294,ky,{w:600,size:28,col:LP.ink});ctx.restore();}

/* ---------------------------------------------------------------- one faculty's page, copied by the next
   rd_spread(ctx, o): the four faculties as nodes on a sheet; o.u (they come in), o.lucy (0 to 1: Lucy's page at Engineering), o.copies
   [u for Health, u for Arts] (each copy flying over and landing), o.labels (0 to 1: what each copied it for), o.light */
function rd_spread(ctx,o){const u=o.u==null?1:o.u,P={Engineering:[700,330],Health:[1280,330],Arts:[700,640],Business:[1280,640]};
  lp_sheet(ctx,330,150,1260,680,{light:o.light===undefined?"day":o.light});
  for(const [f,[x,y]] of Object.entries(P)){const ui=clamp(u*3-["Engineering","Health","Arts","Business"].indexOf(f)*0.4,0,1);rd_node(ctx,x,y,f,{a:ui,w:280});}
  const page=(x,y,a,k)=>{if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x,y,lerp(0.6,1,ag_spr(k,0,0.5)));lp_sheet(ctx,x-46,y-58,92,116,{col:LP.orange,light:null,pin:false});
    ctx.fillStyle=rgba(LP.orange,0.8);for(let r=0;r<4;r++)for(let c2=0;c2<3;c2++)if((r+c2)%3)ctx.fillRect(x-30+c2*22,y-24+r*18,16,12);ctx.restore();};
  const L=o.lucy||0;page(860,330,ag_in(L,0,0.3),L*2);
  const targets=[[1440,330,"Clinical skills rooms",1280,410],[860,640,"Studios",700,720]];
  (o.copies||[]).forEach((cu,i)=>{if(cu<=0.004)return;const [tx,ty,lab,lx,ly]=targets[i],s=ag_sine(clamp(cu,0,1)),x=lerp(860,tx,s),y=lerp(330,ty,s)-Math.sin(s*Math.PI)*90;
    if(cu<1){ctx.save();ctx.setLineDash([10,12]);ctx.strokeStyle=rgba(LP.orange,0.6);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(860,330);ctx.quadraticCurveTo((860+tx)/2,(330+ty)/2-120,x,y);ctx.stroke();ctx.restore();}
    page(x,y,ag_in(cu,0,0.15),cu*3);
    const la=o.labels==null?ag_in(cu,1,0.4):o.labels[i];if(la>0.004)lp_tag(ctx,lx,ly,lab,{align:"center",a:la,col:LP.mut});});}
