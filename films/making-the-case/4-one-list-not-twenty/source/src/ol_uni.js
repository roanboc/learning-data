/* ===== One list, not twenty: the university, June and July 2027 =====
   The film's own pictures at the university, on the module's kit (prefix ol_). Colour keeps the module's meaning: requests for data in
   orange, the roadmap's work and the front door's form in blue (plans and design), what waiting costs and "not now" in amber, work done
   in green; running and improving what the team has wears none of the five, and the agents' queue alone has a touch of violet.
     olRoom, olMonday, olJuly   the team's room on an afternoon, on Monday 7 June's morning, and on a grey July day
     ol_doors        the eleven places requests arrive, each a small sheet with how many wait there; o.note pins a note on each,
                     pointing to the front door
     ol_form         the front door's form: five questions
     ol_list         the one list: every request as a small card in a grid, gathering from the eleven places, the duplicates joining
                     their twins, the ones no longer needed leaving with thanks, 45 left
     ol_card         one request, large: who asked, what for, and its value, urgency, risk and effort, with what waiting costs, its
                     place in the order, and, for one that waits, "not now", why and when
     ol_board        the one list as a board in the tracker: not now, next, in progress (six at most) and done, in three lanes
     ol_split        the team's time: half for the roadmap, a third for requests, the rest for running and improving
     ol_triage       an emergency department's five categories, each with a longest wait
     ol_print        Larrey's plate, framed small on the team's wall */

AG_PLACES.olRoom=c=>lp_paintRoom(c,{light:"day",seed:11});
AG_PLACES.olMonday=c=>lp_paintRoom(c,{light:"morning",seed:12});
AG_PLACES.olJuly=c=>lp_paintRoom(c,{light:"grey",seed:13});

/* ---------------------------------------------------------------- small icons, drawn in one colour */
function ol_glyph(ctx,kind,x,y,s,col){ctx.save();ctx.translate(x,y);ctx.scale(s/48,s/48);ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);ctx.lineWidth=4;ctx.lineCap="round";ctx.lineJoin="round";
  if(kind==="mail"){rr(ctx,-20,-14,40,28,4);ctx.stroke();ctx.beginPath();ctx.moveTo(-20,-12);ctx.lineTo(0,4);ctx.lineTo(20,-12);ctx.stroke();}
  else if(kind==="list"){for(const yy of [-12,0,12]){ctx.beginPath();ctx.arc(-14,yy,3,0,TAU);ctx.fill();ctx.beginPath();ctx.moveTo(-6,yy);ctx.lineTo(18,yy);ctx.stroke();}}
  else if(kind==="grid"){rr(ctx,-18,-16,36,32,3);ctx.stroke();ctx.beginPath();ctx.moveTo(-18,-5);ctx.lineTo(18,-5);ctx.moveTo(-18,6);ctx.lineTo(18,6);ctx.moveTo(-5,-16);ctx.lineTo(-5,16);ctx.stroke();}
  else if(kind==="chat"){ctx.beginPath();ctx.moveTo(-18,-14);ctx.lineTo(18,-14);ctx.lineTo(18,8);ctx.lineTo(-2,8);ctx.lineTo(-12,17);ctx.lineTo(-10,8);ctx.lineTo(-18,8);ctx.closePath();ctx.stroke();}
  else if(kind==="form"){rr(ctx,-16,-19,32,38,3);ctx.stroke();for(const yy of [-8,2,12]){ctx.beginPath();ctx.moveTo(-9,yy);ctx.lineTo(9,yy);ctx.stroke();}}
  else if(kind==="agent"){ctx.beginPath();ctx.arc(0,0,16,0,TAU);ctx.stroke();ctx.strokeStyle=rgba(LP.violet,1);ctx.lineWidth=5;ctx.beginPath();ctx.arc(0,0,16,-0.5,0.5);ctx.stroke();}
  else if(kind==="council"){ctx.beginPath();ctx.ellipse(0,4,20,10,0,0,TAU);ctx.stroke();for(const xx of [-14,0,14]){ctx.beginPath();ctx.arc(xx,-12,4,0,TAU);ctx.fill();}}
  ctx.restore();}

/* ---------------------------------------------------------------- the eleven places requests arrive */
// [what it is, its icon, how many requests wait there on 7 June]: 61 in all
const OL_PLACES=[["Inbox","mail",9],["Inbox","mail",7],["The tracker","list",12],["Spreadsheet","grid",6],["Spreadsheet","grid",4],["Spreadsheet","grid",5],
  ["Chat","chat",5],["Chat","chat",4],["Warehouse form","form",3],["Agents' queue","agent",2],["Council's actions","council",4]];
// where each sheet sits, inside a box (x, y, w, h): 3, 3, 3 and 2 in rows, or, compact (o.cols 4), 4, 4 and 3
function ol_doorBox(i,box,cols){cols=cols||3;const rows=Math.ceil(OL_PLACES.length/cols),gx=18,gy=20,w=(box[2]-gx*(cols-1))/cols,h=(box[3]-gy*(rows-1))/rows,r=Math.floor(i/cols),cI=i%cols,
  inRow=Math.min(cols,OL_PLACES.length-r*cols);return[box[0]+cI*(w+gx)+(cols-inRow)*(w+gx)/2,box[1]+r*(h+gy),w,h];}
// o.u (0 to 1 each: the sheets come in), o.count (0 to 1: how many wait, written on each), o.left (i => 0 to 1: how many have left
// it for the one list), o.note (0 to 1: a note pinned on each, and the sheet dimmed: closed, kindly), o.hl (an index picked out, or a
// list), o.compact (no names: the icons say which), o.cols (3, or 4), o.a, o.light
function ol_doors(ctx,box,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;const nt=clamp(o.note||0,0,1),hl=[].concat(o.hl==null?[]:o.hl);
  const cols=o.cols||3;OL_PLACES.forEach(([name,ic,n],i)=>{const k=o.u?clamp(o.u[i],0,1):1;if(k<=0.004)return;const [x,y,w,h]=ol_doorBox(i,box,cols);ctx.save();ctx.globalAlpha*=k;
    lp_sheet(ctx,x,y,w,h,{light:o.light,pin:false,a:1-nt*0.35});
    ol_glyph(ctx,ic,x+46,y+h/2,46,LP.mut);
    if(!o.compact){const lines=lp_wrap(ctx,name,w-170,{w:700,size:28});lines.slice(0,2).forEach((l,j)=>lp_T(ctx,l,x+90,y+h/2+10+(j-(lines.length>1?0.5:0))*34,{w:700,size:28,a:1-nt*0.3}));}
    const cnt=o.left?Math.round(n*(1-clamp(o.left(i),0,1))):n;
    if((o.count||0)>0&&cnt>0)lp_T(ctx,String(cnt),x+w-24,y+h/2+12,{w:800,size:34,align:"right",col:LP.orange,a:clamp(o.count,0,1)});
    if(hl.includes(i)){ctx.strokeStyle=rgba(LP.amber,1);ctx.lineWidth=4;rr(ctx,x-6,y-6,w+12,h+12,10);ctx.stroke();}
    // closed, kindly: a small note pinned over the corner, pointing to the front door
    if(nt>0.004){const q=ag_sine(clamp(nt*1.4-i*0.04,0,1));if(q>0.004){ctx.save();ctx.globalAlpha*=q;const nx=x+w-120,ny=y-14;ctx.translate(nx+60,ny+28);ctx.rotate(0.05);ctx.translate(-nx-60,-ny-28);
      lp_sheet(ctx,nx,ny,130,56,{light:o.light,col:LP.blue,pin:false});ol_arrow(ctx,nx+92,ny+30,nx+38,ny+30,LP.blue);ctx.restore();}}
    ctx.restore();});
  ctx.restore();}
function ol_arrow(ctx,x0,y0,x1,y1,col){ctx.strokeStyle=rgba(col,1);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();
  const an=Math.atan2(y1-y0,x1-x0);ctx.beginPath();ctx.moveTo(x1-Math.cos(an-0.5)*14,y1-Math.sin(an-0.5)*14);ctx.lineTo(x1,y1);ctx.lineTo(x1-Math.cos(an+0.5)*14,y1-Math.sin(an+0.5)*14);ctx.stroke();}
// the middle of one place's sheet, for what flies from it
function ol_doorMid(i,box,cols){const [x,y,w,h]=ol_doorBox(i,box,cols);return[x+w/2,y+h/2];}

/* ---------------------------------------------------------------- the front door */
// the kit's timber door (lp_door), open by op: beyond it a warm, lit corridor, and its light spilling onto the floor in front, so the one
// way in reads as a welcome, not a dark hole
function ol_frontDoor(ctx,x,y,w,h,op,a){if(a<=0.004)return;lp_door(ctx,x,y,w,h,{open:op,a});if(op<=0.004)return;const dw=w*(1-op*0.8);ctx.save();ctx.globalAlpha*=a;
  let g=ctx.createLinearGradient(0,y,0,y+h);g.addColorStop(0,rgba([246,232,204],1));g.addColorStop(0.7,rgba([238,220,186],1));g.addColorStop(1,rgba([214,190,150],1));
  ctx.fillStyle=g;ctx.fillRect(x+dw,y,w-dw,h);ctx.fillStyle=rgba([255,246,226],0.5*op);ctx.fillRect(x+dw+(w-dw)*0.25,y+h*0.08,(w-dw)*0.5,h*0.62);
  ctx.fillStyle=rgba(LP.shade,0.18);ctx.fillRect(x+dw,y,8,h);
  g=ctx.createLinearGradient(0,y+h,0,y+h+150);g.addColorStop(0,rgba([255,236,200],0.32*op));g.addColorStop(1,rgba([255,236,200],0));ctx.fillStyle=g;
  ctx.beginPath();ctx.moveTo(x+dw,y+h);ctx.lineTo(x+w,y+h);ctx.lineTo(x+w+70,y+h+150);ctx.lineTo(x+dw-40,y+h+150);ctx.closePath();ctx.fill();ctx.restore();}

/* ---------------------------------------------------------------- the front door's form */
const OL_FIVE=["What decision is it for?","By when?","Who decides?","What data do you use now?","Who else needs it?"];
function ol_form(ctx,x,y,w,o){o=o||{};return lp_textSheet(ctx,x,y,w,{kick:"The front door",title:"Five questions",lines:OL_FIVE},Object.assign({col:LP.blue},o));}

/* ---------------------------------------------------------------- the one list */
// every request a small card (an orange band: data) in a grid on a tall sheet. From the eleven places they fly in (o.fly: 0 to 1), the
// nine duplicates slide onto their twins (o.twin), the seven no longer needed leave with a green tick (o.thanks), and the 45 left close
// up (o.close); o.count writes how many are on the list. o.a, o.light
const OL_N=61,OL_TWIN=[3,8,14,20,27,33,40,47,55],OL_GONE=[5,11,18,24,37,44,58];
const OL_FROM=(()=>{const out=[];OL_PLACES.forEach(([,,n],i)=>{for(let k=0;k<n;k++)out.push(i);});return out;})();
function ol_listBox(x,y){return{x,y,w:470,h:720};}
function ol_slot(L,j,cols){cols=cols||5;const cw=78,ch=48,gx=(L.w-60-cols*cw)/(cols-1);return[L.x+30+(j%cols)*(cw+gx),L.y+140+Math.floor(j/cols)*(ch+12),cw,ch];}
function ol_chip(ctx,x,y,w,h,a,col){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ctx.fillStyle="rgba(52,36,30,0.16)";ctx.fillRect(x+LP.sdx*0.3,y+4,w,h);ctx.fillStyle=rgba(LP.paper,1);ctx.fillRect(x,y,w,h);
  ctx.fillStyle=rgba(col||LP.orange,1);ctx.fillRect(x,y,10,h);ctx.fillStyle=rgba(LP.mut,0.35);ctx.fillRect(x+20,y+14,w-34,6);ctx.fillRect(x+20,y+28,(w-34)*0.6,6);ctx.restore();}
function ol_list(ctx,L,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;const fly=o.fly==null?1:o.fly,tw=clamp(o.twin||0,0,1),th=clamp(o.thanks||0,0,1),cl=ag_sine(clamp(o.close||0,0,1));
  lp_sheet(ctx,L.x,L.y,L.w,L.h,{light:o.light,col:LP.orange});lp_label(ctx,L.x+30,L.y+70,"One list",{col:LP.orange});
  if(o.count!=null)lp_T(ctx,String(o.count),L.x+L.w-30,L.y+76,{w:800,size:44,align:"right"});
  // where each card ends: first in the order it came, then, once the others have gone, closed up
  let kept=0;const keptAt={};for(let j=0;j<OL_N;j++)if(!OL_TWIN.includes(j)&&!OL_GONE.includes(j))keptAt[j]=kept++;
  for(let j=0;j<OL_N;j++){const k=ag_sine(clamp(fly*1.5-j/OL_N*0.5,0,1));if(k<=0.002)continue;let [sx,sy,cw,ch]=ol_slot(L,j,7);const from=o.from?o.from(OL_FROM[j]):[sx,sy];
    let x=lerp(from[0]-cw/2,sx,k),y=lerp(from[1]-ch/2,sy,k),al=1,col=LP.orange;
    if(OL_TWIN.includes(j)&&tw>0){const tgt=ol_slot(L,j-1,7),u=ag_sine(clamp(tw*1.3-OL_TWIN.indexOf(j)*0.03,0,1));x=lerp(x,tgt[0]+6,u);y=lerp(y,tgt[1]+6,u);al=1-clamp(u*1.4-0.4,0,1);}
    if(OL_GONE.includes(j)&&th>0){const u=clamp(th*1.3-OL_GONE.indexOf(j)*0.04,0,1);col=mix(LP.orange,LP.green,clamp(u*3,0,1));y-=ag_sine(clamp(u*2-0.8,0,1))*40;al=1-clamp(u*2-1,0,1);
      if(u>0.2&&u<0.95){ol_chip(ctx,x,y,cw,ch,al,col);lp_icon(ctx,"tick",x+cw-18,y+ch/2,30,LP.green);continue;}}
    if(keptAt[j]!=null&&cl>0){const t2=ol_slot(L,keptAt[j],5);x=lerp(x,t2[0],cl);y=lerp(y,t2[1],cl);cw=lerp(cw,t2[2],cl);}
    ol_chip(ctx,x,y,cw,ch,al,col);}
  ctx.restore();}

/* ---------------------------------------------------------------- one request, large */
// words {who, what, why, when}; v [value, urgency, risk, effort], 1 to 3 each. o.u (0 to 1: its four measures come in), o.cost (0 to 1:
// the first three bracketed, what waiting costs), o.score (0 to 1: its place in the order, written), o.top (0 to 1: "Near the top"),
// o.hl (a measure picked out, 0 to 3), o.wait (0 to 1: "Not now"), o.why (0 to n: its n lines, words.why then words.when, one by one),
// o.a, o.k, o.light. A card that can wait (words.why) is its full height from the start, so it never grows in one frame
const OL_MEAS=["Value","Urgency","Risk while it waits","Effort"];
const ol_cardLines=words=>[].concat(words.why||[],words.when||[]);
function ol_cardH(words){const n=ol_cardLines(words).length;return n?530+(n-1)*38+40:450;}
// its place in the order, written "cost of delay ÷ effort = order", the sign drawn as large as the figures (the font's own is small)
function ol_score(ctx,v,x,y,a){const cod=v[0]+v[1]+v[2],n=Math.round(cod/v[3]*10)/10,o={w:800,size:36,a},A=String(cod),wa=lp_tw(ctx,A,o),sw=24,sx=x+wa+14,sy=y-13;
  lp_T(ctx,A,x,y,o);ctx.save();ctx.globalAlpha*=a;ctx.fillStyle=rgba(LP.ink,1);ctx.fillRect(sx,sy-2,sw,4);
  for(const dy of [-10,10]){ctx.beginPath();ctx.arc(sx+sw/2,sy+dy,3.8,0,TAU);ctx.fill();}ctx.restore();
  lp_T(ctx,v[3]+" = "+(Number.isInteger(n)?n:n.toFixed(1)),sx+sw+14,y,o);}
function ol_card(ctx,x,y,w,words,v,o){o=o||{};const a=o.a==null?1:o.a,ws=ol_cardLines(words),h=ol_cardH(words);if(a<=0.004)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.orange,light:o.light});
  lp_label(ctx,x+36,y+76,words.who,{col:LP.orange});lp_T(ctx,words.what,x+36,y+128,{w:800,size:36});
  OL_MEAS.forEach((m,i)=>{const k=o.u==null?1:clamp(o.u*4-i,0,1);if(k<=0.004)return;const ry=y+186+i*52;ctx.save();ctx.globalAlpha*=k;
    if(o.hl===i){ctx.fillStyle=rgba(LP.amber,0.13);rr(ctx,x+18,ry-25,w-36,50,10);ctx.fill();}
    lp_T(ctx,m,x+36,ry+10,{w:700,size:28});
    for(let d=0;d<3;d++){ctx.fillStyle=d<v[i]?rgba(i===3?LP.graphite:LP.amber,1):rgba(LP.mut,0.18);ctx.beginPath();ctx.arc(x+w-150+d*44,ry,13,0,TAU);ctx.fill();}
    ctx.restore();});
  // what waiting costs: value, urgency and risk, bracketed
  const cst=clamp(o.cost||0,0,1);if(cst>0.004){ctx.save();ctx.globalAlpha*=cst;ctx.strokeStyle=rgba(LP.amber,1);ctx.lineWidth=4;ctx.lineCap="round";const bx=x+w-26,y0=y+164,y1=y+312;
    ctx.beginPath();ctx.moveTo(bx-12,y0);ctx.lineTo(bx,y0);ctx.lineTo(bx,y1);ctx.lineTo(bx-12,y1);ctx.stroke();ctx.restore();}
  const sc=clamp(o.score||0,0,1);if(sc>0.004)ol_score(ctx,v,x+36,y+410,sc);
  const tp=clamp(o.top||0,0,1);if(tp>0.004)lp_pill(ctx,x+w-196,y+398,"Near the top",{col:LP.green,icon:"tick",size:28,a:tp,k:o.topK});
  const wt=clamp(o.wait||0,0,1);if(wt>0.004)lp_pill(ctx,x+36+102,y+472,"Not now",{col:LP.amber,icon:"wait",size:28,a:wt,k:o.waitK});
  ws.forEach((l,j)=>{const q=clamp((o.why||0)-j,0,1);if(q>0.004)lp_T(ctx,l,x+36,y+530+j*38,{w:j?600:700,size:28,a:ag_sine(q),col:j?LP.mut:LP.ink});});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the board */
// the one list, in the tracker: four columns, not now (amber), next, in progress (six at most) and done (green), and three lanes, the
// roadmap (blue), requests (orange) and running and improving (no colour). o.hl ("wip": the in-progress column picked out), o.pull (0 to
// 1: a request finishes and the next one moves in), o.extra (0 to 1: a seventh piece pushed in, against the limit, for "without the
// limit"), o.lanes (0 to 1: the lanes named), o.a. Drawn inside a screen (lp_screen's draw), X, Y, Wd, Hd its inner box.
const OL_COLS=["Not now","Next","In progress","Done"],OL_LANES=[["The roadmap",LP.blue],["Requests",LP.orange],["Running",LP.graphite]];
const OL_WIP=[3,2,1],OL_NEXT=[3,4,2],OL_DONE=[2,2,2],OL_LATER=[1,4,1];  // at most four cards a lane, so none crosses into the next lane or meets its name
function ol_board(ctx,X,Y,Wd,Hd,o){o=o||{};const cw=Wd/4,hh=70,lh=(Hd-hh-10)/3,hl=o.hl,pull=ag_sine(clamp(o.pull||0,0,1));
  ctx.fillStyle="#FBF9F4";ctx.fillRect(X,Y,Wd,Hd);
  OL_COLS.forEach((c,i)=>{const cx=X+i*cw;if(i===2&&hl==="wip"){ctx.fillStyle=rgba(LP.blue,0.07);ctx.fillRect(cx,Y,cw,Hd);}
    ctx.fillStyle=i===0?rgba(LP.amber,0.1):i===3?rgba(LP.green,0.08):"rgba(0,0,0,0.03)";ctx.fillRect(cx+4,Y+4,cw-8,hh-8);
    lp_T(ctx,c,cx+cw/2,Y+hh/2+10,{w:800,size:30,align:"center",col:i===0?LP.amber:i===3?LP.green:LP.ink});
    if(i>0){ctx.fillStyle="rgba(60,50,40,0.12)";ctx.fillRect(cx,Y+10,2,Hd-20);}});
  OL_LANES.forEach(([n,col],r)=>{const ly=Y+hh+r*lh;ctx.fillStyle="rgba(60,50,40,0.1)";ctx.fillRect(X+10,ly,Wd-20,2);
    const card=(cx,cy,c2,al,tick)=>{if(al<=0.004)return;ctx.save();ctx.globalAlpha*=al;ctx.fillStyle="rgba(52,36,30,0.12)";ctx.fillRect(cx-3,cy+3,cw-40,28);ctx.fillStyle="#fff";ctx.fillRect(cx,cy,cw-40,28);
      ctx.fillStyle=rgba(c2,1);ctx.fillRect(cx,cy,8,28);ctx.fillStyle=rgba(LP.mut,0.3);ctx.fillRect(cx+18,cy+11,(cw-80)*0.7,6);if(tick)lp_icon(ctx,"tick",cx+cw-62,cy+14,24,LP.green);ctx.restore();};
    const x0=X+20,yy=(k)=>ly+14+k*34;
    // not now: amber cards, each with its date
    for(let k=0;k<OL_LATER[r];k++){card(x0,yy(k),LP.amber,1);ctx.fillStyle=rgba(LP.amber,1);ctx.fillRect(x0+cw-74,yy(k)+8,22,12);}
    // next: the order, top first; the top request moves into progress when one is done
    for(let k=0;k<OL_NEXT[r];k++){let cx=x0+cw,cy=yy(k),al=1;if(r===1&&k===0){cx=lerp(cx,x0+cw*2,pull);cy=lerp(cy,yy(0),pull);}else if(r===1&&k>0){cy=lerp(cy,yy(k-1),pull);}card(cx,cy,col,al);}
    // in progress, at most six: three, two and one
    for(let k=0;k<OL_WIP[r];k++){let cx=x0+cw*2,cy=yy(k);if(r===1&&k===0){cx=lerp(cx,x0+cw*3,pull);cy=lerp(cy,yy(OL_DONE[r]),pull);card(cx,cy,mix(col,LP.green,pull),1,pull>0.6);continue;}card(cx,cy,col,1);}
    if(r===1&&(o.extra||0)>0)card(x0+cw*2,yy(2),col,clamp(o.extra,0,1));
    for(let k=0;k<OL_DONE[r];k++)card(x0+cw*3,yy(k),LP.green,1,true);
    if((o.lanes||0)>0)lp_T(ctx,n,X+Wd-24,ly+lh-14,{w:700,size:28,align:"right",col:r===2?LP.mut:col,a:clamp(o.lanes,0,1)});});
  if(hl==="wip"){ctx.strokeStyle=rgba(LP.blue,1);ctx.lineWidth=4;rr(ctx,X+2*cw+4,Y+4,cw-8,Hd-8,8);ctx.stroke();}}

/* ---------------------------------------------------------------- the team's time */
// one bar on a sheet: half for the roadmap (blue), a third for requests (orange), the rest for running and improving (graphite); o.u
// (0 to 1: the parts come in), o.flood (0 to 1: without the split, requests swell over the rest), o.a, o.k, o.light
function ol_split(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;const h=330;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{light:o.light});lp_label(ctx,x+44,y+80,"The team's time",{col:LP.mut});
  const bx=x+44,bw=w-88,by=y+120,bh=70,fl=ag_sine(clamp(o.flood||0,0,1)),parts=[[0.5,LP.blue,"The roadmap","Half"],[1/3,LP.orange,"Requests","A third"],[1/6,LP.graphite,"Running and improving","The rest"]];
  let cx=bx;parts.forEach(([f,col,name,share],i)=>{const k=o.u?clamp(o.u*3-i,0,1):1;if(k<=0.004){return;}let fw=f*bw;
    if(fl>0){fw=i===1?lerp(fw,bw,fl):lerp(fw,0,fl);}
    ctx.save();ctx.globalAlpha*=k;ctx.fillStyle=rgba(col,1);ctx.fillRect(cx,by,Math.max(0,fw-6),bh);
    // the shares' words, gone while requests swell over the rest (they would name a third under the whole bar)
    const la=1-clamp(fl*3,0,1);if(fw>120&&la>0.004){const r=i===2,tx=r?bx+bw-6:cx+14,al=r?"right":"left";lp_T(ctx,share,tx,by+bh+46,{w:800,size:30,col:r?LP.ink:col,align:al,a:la});lp_T(ctx,name,tx,by+bh+86,{w:600,size:28,col:LP.mut,align:al,a:la});}
    ctx.restore();cx+=fw;});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- an emergency department's five categories */
// the Australasian Triage Scale: five categories, each with a longest wait; the bars grow with the wait. o.u (0 to 1), o.a, o.k, o.light
const OL_ATS=[["1","At once",2],["2","Within 10 minutes",10],["3","Within 30 minutes",30],["4","Within an hour",60],["5","Within two hours",120]];
function ol_triage(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;const h=566;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{light:o.light,col:LP.amber});lp_label(ctx,x+44,y+80,"Triage, today",{col:LP.amber});lp_T(ctx,"Five categories, each with a longest wait",x+44,y+132,{w:800,size:36});
  OL_ATS.forEach(([n,lab,m],i)=>{const k=o.u?clamp(o.u*5-i,0,1):1;if(k<=0.004)return;const ry=y+200+i*62;ctx.save();ctx.globalAlpha*=k;
    lp_T(ctx,n,x+60,ry+10,{w:800,size:30,align:"center"});lp_T(ctx,lab,x+100,ry+10,{w:700,size:28});
    const bw=(w-560)*Math.sqrt(m/120)*ag_sine(k);ctx.fillStyle=rgba(LP.amber,0.85);rr(ctx,x+460,ry-14,Math.max(8,bw),28,6);ctx.fill();ctx.restore();});
  if(o.src)lp_T(ctx,o.src,x+44,y+h-34,{w:600,size:28,col:LP.mut,a:clamp(o.srcA==null?1:o.srcA,0,1)});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- Larrey's plate, framed small on the team's wall */
function ol_print(ctx,x,y,w,a){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;const h=w*0.62;
  ctx.save();ctx.shadowColor="rgba(52,36,30,0.3)";ctx.shadowBlur=18;ctx.shadowOffsetX=LP.sdx;ctx.shadowOffsetY=10;ctx.fillStyle=rgba(mix(LP.timber,LP.shade,0.15),1);ctx.fillRect(x-14,y-14,w+28,h+28);ctx.restore();
  ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.fillStyle=rgba(LP.paper,1);ctx.fillRect(x,y,w,h);ctx.translate(x,y);const s=w/1240;ctx.scale(s,s);
  ol_plate(ctx,0,0,1240,{u:1,bare:true,light:null});ctx.restore();ctx.restore();}
