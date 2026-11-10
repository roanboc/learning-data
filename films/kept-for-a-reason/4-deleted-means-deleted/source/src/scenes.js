/* ===== Deleted means deleted: the scenes =====
   Eight chapters, each timed to its narration: wAt(sc, "line", "word") is the moment a word is said. The places are painted once
   (dd_kanesh.js, dd_platform.js); what moves is drawn live in the shots of ag_shots. In one room the camera never cuts: a shot's keys
   glide it from one framing to the next, and what changes fades; between rooms the picture dissolves, and a chapter that opens where
   the last one ends glides on from it (ag_cutInto, at the end). In Kanesh the camera comes close, so the words there are drawn in the
   frame (dd_scr), over the place as the camera sees it, frosted (dd_view): a card stays put while the room moves under it, and a card
   that lasts across a change of room is drawn over both, after the shots, so it never shows twice. Inside the platform the camera
   stays near the whole frame, and its pages are drawn in the place. */

DP_PEOPLE.push("linh","ingrid","jun");

/* ---------------------------------------------------------------- Kanesh: framings and the room's live things */
// [x, y, zoom] of the room's framings: the whole room, the table, the tablet being written, the shelf, and the table with the shelf
const DD_CAM={WIDE:[960,540,1],TABLE:[760,640,1.75],WRITE:[700,650,2.0],SHELF:[1440,470,2.0],MID:[1150,600,1.3],ASHUR:[960,520,1.18]};
const dd_key=(t,k)=>[t].concat(DD_CAM[k]);
// the story's tablet: where it's written on the table, and where it stands on the shelf
const DD_DESK=[660,790],DD_RECEIPT=[520,790],DD_DESKDIM=0.24;
// what the shelf's light leaves on the story's tablet: a little less dark than its neighbours, so the eye finds it
const dd_mineDim=()=>(1-dd_lit(DD_MINE[0],DD_MINE[1]-40))*0.6;
/* the room's live things, drawn over its picture: the flame, the shelf's tablets (rim: 0 to 1, each rimmed in coral), the tin and the
   cloth (o.tin, o.cloth: seconds since each came; o.goods: their opacity), the scale (o.n bars of silver), the story's tablet (o.mine),
   the broken tablet (o.shards: u, fade), the receipt (o.receipt: seconds since it came; o.seal 0 to 1, the seal's light across it) */
function dd_roomLive(c,tt,o){o=o||{};dd_flame(c,tt,1);dd_shelfTablets(c,{rim:o.rim||0});
  const ga=o.goods==null?1:o.goods;if(ga>0){c.save();c.globalAlpha*=ga;if(o.tin!=null)dd_tin(c,520,784,0.6,o.tin);if(o.cloth!=null)dd_cloth(c,680,786,0.56,o.cloth);c.restore();}
  if(o.scale!==false)dd_scale(c,920,786,0.72,{n:o.n||0});
  if(o.shards)dd_shards(c,DD_DESK[0],DD_DESK[1],1,o.shards.u,{kind:"envelope",fade:o.shards.fade||0,dim:DD_DESKDIM});
  if(o.receipt!=null&&o.receipt>0){const k=o.receipt,e=Math.min(1.04,ag_spr(k,0,0.5));c.save();c.globalAlpha*=clamp(k*3,0,1);ag_about(c,DD_RECEIPT[0],DD_RECEIPT[1]-50,lerp(0.6,1,e));
    dd_tablet(c,DD_RECEIPT[0],DD_RECEIPT[1],1,{kind:"receipt",dim:DD_DESKDIM});
    if(o.seal>0&&o.seal<1){// the seal rolled across it: a band of lamp light runs along its band
      const w=84,h=100,x0=DD_RECEIPT[0]-w/2,by=DD_RECEIPT[1]-h+h*0.38,bh=h*0.22,sx=x0+w*ag_sine(o.seal);c.save();c.globalCompositeOperation="lighter";
      const g=c.createLinearGradient(sx-30,0,sx+30,0);g.addColorStop(0,"rgba(255,210,150,0)");g.addColorStop(0.5,"rgba(255,210,150,0.55)");g.addColorStop(1,"rgba(255,210,150,0)");c.fillStyle=g;c.fillRect(x0,by-4,w,bh+8);c.restore();}
    c.restore();}
  if(o.mine)dd_mine(c,o.mine);}
/* the story's tablet: m.mode "write" (u, the rows written), "seal" (env, roll), "move" (u from the table to the shelf), "shelf" (lift,
   rim), "down" (u from the shelf to the table); always at its place along the way */
function dd_mine(c,m){const [dx,dy]=DD_DESK,[sx,sy]=[DD_MINE[0],DD_MINE[1]+2],a=m.a==null?1:m.a;if(a<=0)return;
  if(a<1){c.save();c.globalAlpha*=a;dd_mine(c,Object.assign({},m,{a:1}));c.restore();return;}
  if(m.mode==="write"){c.save();c.translate(0,14*(1-ag_eo(m.rise==null?1:m.rise)));dd_writing(c,dx,dy,1,m.u,{dim:DD_DESKDIM});c.restore();return;}
  if(m.mode==="seal"){dd_envelope(c,dx,dy,1,m.env,m.roll,{dim:DD_DESKDIM});return;}
  let x,y,s,sh=1,dim=0,lift=m.lift||0;
  if(m.mode==="move"||m.mode==="down"){const u=ag_sine(m.u),f=m.mode==="move"?u:1-u;x=lerp(dx,sx,f);y=lerp(dy,sy,f)-Math.sin(Math.PI*u)*130;s=lerp(1,0.5,f);sh=1-Math.sin(Math.PI*u)*0.9;dim=lerp(DD_DESKDIM,dd_mineDim(),f);}
  else{x=sx;y=sy;s=0.5;dim=dd_mineDim();}
  c.save();c.translate(0,-lift);dd_envelope(c,x,y,s,1,1,{dim,rim:m.rim||0,shadow:sh*clamp(1-lift/60,0.3,1)});c.restore();}

/* the house in Ashur: tablets on the niche's ledge, by moonlight; o.hl rims the middle one (the debt), o.grey and o.stamp make it void */
const DD_NICHE=[[760,0,0.6],[858,1,0.56],[960,0,0.62],[1064,0,0.58],[1162,1,0.6]];
function dd_ashurLive(c,tt,o){o=o||{};DD_NICHE.forEach(([x,k,s],i)=>{const mid=i===2;
    dd_tablet(c,x,642,s,{kind:k?"tablet":"envelope",light:"moon",rim:mid?(o.hl||0):0,grey:mid?(o.grey||0):0});});
  if(o.stamp>0)dd_stamp(c,960,560,"Void",o.stamp,{size:34});}

/* ---------------------------------------------------------------- the hall's files: the opening's data, on a shelf of light */
const DD_SHELFX=[520,640,760,880,1000,1120],DD_SHELFY=600;
// o.n files come in (0 to 6, each springing), mine (0 to 1: her line in each), now (0 to 1: her line leaves the newest), glow (the old
// files' lines glow), crack [u for the first two], grey (0 to 1, the rest void)
function dd_hallShelf(c,tt,o){o=o||{};const n=o.n==null?6:o.n;
  c.save();const lg=c.createLinearGradient(440,0,1200,0);lg.addColorStop(0,"rgba(120,230,240,0)");lg.addColorStop(0.15,"rgba(120,230,240,0.7)");lg.addColorStop(0.85,"rgba(120,230,240,0.7)");lg.addColorStop(1,"rgba(120,230,240,0)");
  c.globalAlpha*=clamp(n,0,1);c.fillStyle=lg;c.shadowColor="rgba(120,230,240,0.8)";c.shadowBlur=10;c.fillRect(440,DD_SHELFY+2,760,2.4);c.restore();
  DD_SHELFX.forEach((x,i)=>{const k=clamp(n-i,0,1);if(k<=0)return;const e=Math.min(1.04,ag_spr(k,0,0.45)),last=i===DD_SHELFX.length-1;c.save();c.globalAlpha*=clamp(k*2.5,0,1);ag_about(c,x,DD_SHELFY-60,lerp(0.6,1,e));
    const cr=!last&&i<2&&o.crack?o.crack[i]:0,gr=!last&&i>=2&&o.grey?o.grey:0;
    dd_file(c,x,DD_SHELFY,1,{mine:last?(o.mine||0)*(1-(o.now||0)):(o.mine||0),grey:gr,crack:cr});
    if(!last&&o.glow>0&&cr<=0&&gr<0.5)dp_halo(c,x,DD_SHELFY-60,90,"violet",0.16*o.glow);
    c.restore();});}

/* ---------------------------------------------------------------- the frame's chrome: what lasts across a change of room */
// the camera and place of the shot drawn last, so a card drawn after the shots is frosted with what is under it
let DD_NOW={place:null,cam:{x:960,y:540,z:1}};
const dd_seen=(place,cam)=>{DD_NOW={place,cam};};
function dd_behind(){return DD_NOW.place?dd_view(DD_NOW.place,DD_NOW.cam):undefined;}
// a line of light drawn on (p) at an opacity, its end's dot with it (dp_link's alpha leaves the dot)
function dd_link(c,a,b,col,p,al,o){if(!(al>0)||!(p>0))return;c.save();c.globalAlpha*=al;dp_link(c,a,b,col,p,o);c.restore();}
const dd_toScreen=(x,y)=>{const c=DD_NOW.cam;return[(x-c.x)*c.z+960,(y-c.y)*c.z+540];};
// a card in the frame, frosted with the shot under it, in at t0 and out at t1
function dd_frameCard(ctx,S,x,y,w,words,t,t0,t1,o){dd_scr(ctx,S,()=>dd_cardAt(ctx,x,y,w,words,t,t0,t1,Object.assign({behind:dd_behind()},o)));}
// the place and time of the opening story, top left
function dd_where(ctx,S,text,a){if(a<=0)return;dd_scr(ctx,S,()=>dp_slip(ctx,72,56,text,"cyan",{ink:true,a,behind:dd_behind()}));}

/* ================================================================ 1. The note that turns up */
scene("tablet",(ctx,S,t,sc)=>{
  const T={mer:wAt(sc,"merchants","Merchants"),weeks:wAt(sc,"merchants","weeks"),bring:wAt(sc,"merchants","bring"),tin:wAt(sc,"merchants","tin"),cloth:wAt(sc,"merchants","cloth"),
    lend:wAt(sc,"lend","lend"),silver:wAt(sc,"lend","silver"),
    loan:wAt(sc,"written","Each"),clay:wAt(sc,"written","clay"),who:wAt(sc,"written","who"),
    sealed:wAt(sc,"sealed","sealed"),env:wAt(sc,"sealed","envelope"),rolled:wAt(sc,"sealed","rolled"),nobody:wAt(sc,"sealed","nobody"),
    keeps:wAt(sc,"keeps","keeps"),proof:wAt(sc,"keeps","proof"),
    paying:wAt(sc,"away","paying"),away:wAt(sc,"away","away"),
    sit:wAt(sc,"shelf","sit"),shelf:wAt(sc,"shelf","shelf"),house:wAt(sc,"shelf","house"),
    turns:wAt(sc,"twice","turns"),claim:wAt(sc,"twice","claim"),pays:wAt(sc,"twice","pays"),
    every:wAt(sc,"risk","Every"),done:wAt(sc,"done","Something")};
  // the story's tablet, from the table to the shelf; the silver lent (and gone with the borrower), then paid back
  const mine=tt=>tt<T.sealed-0.2?{mode:"write",u:clamp((tt-T.clay)/(sc.ends.written-T.clay+0.2),0,1),a:ag_in(tt,T.loan-0.1,0.4),rise:clamp((tt-T.loan+0.1)/0.5,0,1)}
    :tt<T.keeps+0.25?{mode:"seal",env:clamp((tt-T.env+0.1)/1.0,0,1),roll:clamp((tt-T.rolled)/1.6,0,1)}
    :tt<T.keeps+1.85?{mode:"move",u:(tt-T.keeps-0.25)/1.6}
    :{mode:"shelf",lift:34*ag_sine((tt-T.turns)/0.8)*(1-ag_sine((tt-T.every)/0.8)),rim:ag_in(tt,T.claim,0.5)};
  const silver=tt=>tt<T.loan?clamp((tt-T.silver+0.2)/1.05,0,3):tt<T.paying?3*(1-clamp((tt-T.loan+0.2)/0.6,0,1)):clamp((tt-T.paying)/1.05,0,3);
  const rims=tt=>clamp((tt-T.every-0.2)/1.4,0,1);
  const room=(c,tt,cam,o)=>{dd_seen("ddRoom",cam);dd_roomLive(c,tt,Object.assign({tin:tt-T.tin,cloth:tt-T.cloth,goods:1-ag_in(tt,T.loan-0.3,0.5),n:silver(tt),rim:rims(tt),mine:mine(tt)},o));};
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"ddRoom",keys:[dd_key(0,"WIDE")],push:0.03,draw:(c,tt,cam)=>room(c,tt,cam,{tin:null,cloth:null,mine:null,n:0})},
    {at:T.mer-0.3,place:"ddRoad",keys:[[0,960,540,1]],push:0.03,draw:(c,tt,cam)=>{dd_seen("ddRoad",cam);
      dd_caravan(c,lerp(0.04,0.6,ag_sine((tt-T.mer+0.6)/(T.bring-T.mer+1.2))),tt,1);
      dp_tag(c,1080,300,"Ashur · weeks away","cyan",{behind:dd_dark("ddRoad"),a:ag_in(tt,T.weeks-0.1,0.4),to:[1620,552],p:ag_sine((tt-T.weeks)/0.6)});}},
    {at:T.bring-0.3,place:"ddRoom",d:1.9,push:0,keys:[dd_key(0,"TABLE"),dd_key(T.loan-0.4,"WRITE"),dd_key(T.keeps+0.1,"SHELF"),dd_key(T.paying-0.3,"MID"),dd_key(T.sit-0.5,"SHELF")],
      draw:(c,tt,cam)=>room(c,tt,cam,{mine:tt<T.loan-0.1?null:mine(tt)})},
    {at:T.house-0.3,place:"ddAshur",keys:[dd_key(0,"ASHUR")],push:0.03,draw:(c,tt,cam)=>{dd_seen("ddAshur",cam);dd_ashurLive(c,tt,{});}},
    {at:T.turns-0.35,place:"ddRoom",d:2.2,push:0,keys:[dd_key(0,"SHELF"),dd_key(T.every-0.3,"WIDE")],draw:(c,tt,cam)=>room(c,tt,cam,{})}
  ]);
  // the words, in the frame
  dd_where(ctx,S,"Kanesh, Anatolia · about 1900 BC",dd_io(t,0.7,T.mer-0.5,0.5));
  dd_frameCard(ctx,S,96,130,720,{kick:"A loan, in clay",title:"Who owes whom, how much, by when"},t,T.who-0.1,T.env-0.3);
  dd_frameCard(ctx,S,96,130,620,{kick:"Sealed in clay",title:"Nobody can change it unseen"},t,T.nobody-0.1,T.keeps-0.2);
  dd_frameCard(ctx,S,96,130,620,{kick:"Kept by the lender",title:"The proof of the debt"},t,T.proof-0.1,T.paying-0.2);
  dd_scr(ctx,S,()=>dp_tag(ctx,96,170,"A shelf in Kanesh","cyan",{a:dd_io(t,T.sit,T.house-0.45,0.4),behind:dd_behind(),to:dd_toScreen(DD_MINE[0]-34,DD_MINE[1]-40),p:ag_sine((t-T.sit-0.1)/0.5)}));
  dd_scr(ctx,S,()=>dp_tag(ctx,1180,150,"A house in Ashur","cyan",{a:dd_io(t,T.house+0.15,T.turns-0.6,0.4),behind:dd_behind(),to:dd_toScreen(1040,560),p:ag_sine((t-T.house-0.25)/0.5)}));
  dd_frameCard(ctx,S,96,130,640,{kick:"Turns up later",title:"The borrower pays twice"},t,T.claim+0.2,T.every-0.4,{col:"coral"});
});

/* ================================================================ 2. Broken, or void */
scene("void",(ctx,S,t,sc)=>{
  const T={paid:wAt(sc,"broken","paid"),hands:wAt(sc,"broken","hands"),broken:wAt(sc,"broken","broken"),
    handed:wAt(sc,"receipt","handed"),ashur:wAt(sc,"receipt","Ashur"),rcpt:wAt(sc,"receipt","receipt"),sealed:wAt(sc,"receipt","sealed"),
    any:wAt(sc,"void","any"),voidW:wAt(sc,"void","void"),worth:wAt(sc,"void","worth"),
    stays:wAt(sc,"stays","stays"),nobody:wAt(sc,"stays","nobody"),
    more:wAt(sc,"found","More"),rcpts:wAt(sc,"found","receipts"),
    data:wAt(sc,"same","Data"),writes:wAt(sc,"writes","writes"),table:wAt(sc,"writes","table"),gone:wAt(sc,"writes","gone"),
    old:wAt(sc,"still","old"),broke2:wAt(sc,"still","broken"),never:wAt(sc,"still","never"),staysD:wAt(sc,"deleted","stays")};
  const rimOff=1-ag_in(t,0.3,1.0);
  // the tablet comes down from the shelf to the table, lies there whole, and breaks (at tb)
  const t0=T.hands-0.2,t1=t0+1.2,tb=Math.max(t1+0.1,T.broken-0.1);
  const mine=tt=>tt<t0?{mode:"shelf",rim:rimOff}:tt<t1?{mode:"down",u:(tt-t0)/1.2}:null;
  const room=(c,tt,cam,o)=>{dd_seen("ddRoom",cam);
    dd_roomLive(c,tt,Object.assign({tin:null,cloth:null,n:3,rim:rimOff,mine:mine(tt),shards:tt>=tb?{u:clamp((tt-tb)/0.7,0,1)}:null,
      receipt:tt-T.rcpt,seal:clamp((tt-T.sealed)/1.4,0,1)},o));
    if(tt>=t1&&tt<tb)dd_envelope(c,DD_DESK[0],DD_DESK[1],1,1,1,{dim:DD_DESKDIM});};
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"ddRoom",d:1.8,push:0,keys:[dd_key(0,"WIDE"),dd_key(0.5,"MID"),dd_key(T.hands-0.3,"TABLE")],draw:(c,tt,cam)=>room(c,tt,cam,{})},
    {at:T.handed-0.3,place:"ddAshur",keys:[dd_key(0,"ASHUR")],push:0.03,draw:(c,tt,cam)=>{dd_seen("ddAshur",cam);dd_ashurLive(c,tt,{hl:ag_in(tt,T.ashur,0.5)});}},
    {at:T.rcpt-0.4,place:"ddRoom",keys:[dd_key(0,"TABLE")],push:0.02,draw:(c,tt,cam)=>room(c,tt,cam,{})},
    {at:T.any-0.3,place:"ddAshur",keys:[dd_key(0,"ASHUR")],push:0.03,draw:(c,tt,cam)=>{dd_seen("ddAshur",cam);
      dd_ashurLive(c,tt,{hl:1-ag_in(tt,T.voidW,0.5),grey:ag_in(tt,T.voidW,0.6),stamp:tt-T.voidW-0.1});}},
    {at:T.stays-0.35,place:"ddRoom",d:2.0,push:0.02,keys:[dd_key(0,"WIDE"),dd_key(T.more,"MID")],draw:(c,tt,cam)=>room(c,tt,cam,{})},
    {at:T.data-0.3,place:"ddHall",keys:[[0,960,540,1]],push:0.025,draw:(c,tt,cam)=>{dd_seen("ddHall",cam);
      dd_hallShelf(c,tt,{n:clamp((tt-T.data+0.1)/2.4*6,0,6),mine:1,now:ag_in(tt,T.gone-0.1,0.6),glow:ag_in(tt,T.old,0.5)*(1-ag_in(tt,T.staysD,0.5)),
        crack:[clamp((tt-T.broke2)/0.9,0,1),clamp((tt-T.broke2-0.35)/0.9,0,1)],grey:ag_in(tt,T.never,0.8)});
      dd_history(c,520,150,620,[["DELETE · her row","ink",clamp((tt-T.writes)/0.6,0,1)]],{a:ag_in(tt,T.writes-0.2,0.4),k:Math.min(1,ag_spr(tt,T.writes-0.2,0.5))});
      dd_pillAt(c,1120,680,"Gone","green",tt,T.gone,sc.cues.breath+0.6,{align:"center",size:28});
      dp_tag(c,150,320,"Old copies, still there","violet",{a:dd_io(tt,T.old+0.2,T.staysD-0.3,0.4),to:[524,488],p:ag_sine((tt-T.old-0.3)/0.5)});
      dd_pillAt(c,820,780,"Stays deleted","green",tt,T.staysD,sc.cues.breath+0.6,{align:"center",size:30});}}
  ]);
  dd_frameCard(ctx,S,96,130,620,{kick:"Paid",title:"Handed back, and broken"},t,T.broken+0.2,T.handed-0.6,{col:"green"});
  dd_frameCard(ctx,S,96,130,700,{kick:"The receipt",title:"Paid. Any tablet of it that turns up is void."},t,T.any-0.2,T.stays-0.5);
  dd_frameCard(ctx,S,96,130,620,{kick:"A paid debt stays paid",title:"Nobody pays twice"},t,T.nobody-0.1,T.more-0.4,{col:"green"});
  dd_frameCard(ctx,S,96,130,700,{kick:"Kültepe, today",title:"More than 20,000 tablets found",sub:"in the merchants' houses, receipts among them"},t,T.more+0.2,T.data-0.6);
  dp_title(ctx,S,t,sc.cues.breath,"Deleted means deleted","every copy, on its date","FILM 4 OF 5 · KEPT FOR A REASON");
});

/* ================================================================ 3. A delete writes a receipt */
// the tutors' mailing list as the platform shows it; o.out (0 to 1) her row leaves, o.hl lights it first, o.a
const DD_LISTCOLS=[{t:"staff_id",w:190},{t:"given_name",w:230},{t:"email",w:420}];
function dd_listPage(c,x,y,o){o=o||{};const out=o.out||0,up=ag_sine(clamp(out*2-1,0,1));
  return dd_tablePage(c,x,y,1000,340,{a:o.a,name:"hr.mart_hr__tutors_mailing_list",cols:DD_LISTCOLS,rows:[
    {cells:["E-4417","Linh","linh.nguyen@uni.example"],hl:o.hl||0,dx:70*ag_sine(clamp(out*2,0,1)),a:1-ag_sine(clamp(out*2,0,1))},
    {cells:["E-4602","Ethan","ethan.brown@uni.example"],dy:-56*up}]});}
// a query's result, as a grid under it: her row in violet
function dd_result(c,x,y,a){if(a<=0)return;c.save();c.globalAlpha*=a;dp_panel(c,x,y,1000,200,{col:"cyan",r:18,glowR:30});
  dp_rows(c,x+32,y+18,DD_LISTCOLS,[[{t:"E-4417",mono:true,col:"violet"},{t:"Linh",mono:true,col:"violet"},{t:"linh.nguyen@uni.example",mono:true,col:"violet"}],
    [{t:"E-4602",mono:true},{t:"Ethan",mono:true},{t:"ethan.brown@uni.example",mono:true}]],{lh:56});c.restore();}
// a row of days, the old file's seven: each fills as a night passes (n, 0 to 7), the first and last named
function dd_days(c,x,y,n,a,o){o=o||{};if(a<=0)return;c.save();c.globalAlpha*=a;for(let i=0;i<7;i++){const k=clamp(n-i,0,1),cx=x+i*84;
    c.strokeStyle=rgba(DP.F.cyan,0.8);c.lineWidth=2;c.beginPath();c.arc(cx,y,15,0,TAU);c.stroke();
    if(k>0){c.save();c.shadowColor=rgba(DP.F.cyan,0.8);c.shadowBlur=10;c.fillStyle=rgba(DP.F.cyan,k);c.beginPath();c.arc(cx,y,15*Math.min(1,ag_spr(k,0,0.35)),0,TAU);c.fill();c.restore();}}
  dp_T(c,"26 Nov",x,y+58,{w:600,size:28,col:"mut",align:"center"});dp_T(c,"2 Dec",x+6*84,y+58,{w:700,size:28,col:o.lastCol||"mut",align:"center"});c.restore();}

scene("receipt",(ctx,S,t,sc)=>{
  const T={linh:wAt(sc,"linh","Linh"),since:wAt(sc,"linh","since"),asked:wAt(sc,"asked","asked"),logged:wAt(sc,"logged","logged"),approved:wAt(sc,"logged","approved"),
    job:wAt(sc,"night","job"),wed:wAt(sc,"wed","Wednesday"),deletes:wAt(sc,"wed","deletes"),hist:wAt(sc,"history","history"),
    versions:wAt(sc,"versions","versions"),back:wAt(sc,"versions","back"),ask:wAt(sc,"ask","Ask"),there:wAt(sc,"ask","there"),
    file:wAt(sc,"marks","file"),mark:wAt(sc,"save","marks"),still:wAt(sc,"save","still"),rew:wAt(sc,"rewrites","rewrites"),without:wAt(sc,"rewrites","without"),
    seven:wAt(sc,"seven","seven"),mistake:wAt(sc,"seven","mistake"),vac:wAt(sc,"vacuum","vacuum"),each:wAt(sc,"vacuum","each"),removes:wAt(sc,"vacuum","removes"),
    hers:wAt(sc,"dec","hers"),noq:wAt(sc,"back","query")};
  const night=sc.cues.night,marks=sc.cues.marks,back=sc.cues.back;
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"ddHall",keys:[[0,960,540,1]],push:0.02,draw:(c,tt,cam)=>{dd_seen("ddHall",cam);
      const la=ag_in(tt,0.2,0.7)*(1-ag_in(tt,night-0.1,0.6));if(la>0){c.save();c.globalAlpha*=la;dp_person(c,"linh",560,650,0.9,{t:tt,gaze:[3,-1]});c.restore();}
      dd_cardAt(c,820,170,600,{title:"Linh Nguyen",sub:"Casual tutor since 2023"},tt,T.linh,night-0.3);
      dd_cardAt(c,820,330,680,{kick:"24 November",title:"Please take me off the tutors' mailing list"},tt,T.asked,night-0.3);
      const r3=dd_cardAt(c,820,540,680,{kick:"Privacy office",title:"Request 2026-117"},tt,T.logged,T.wed-0.6);
      dd_pillAt(c,1300,642,"Approved","green",tt,T.approved,T.wed-0.6,{size:28});
      dd_jobBadge(c,820,120,{t:tt,a:ag_in(tt,night+0.3,0.5)*(1-ag_in(tt,T.wed-0.6,0.4))});
      dd_link(c,[1120,494],[1120,540],"cyan",clamp((tt-T.job)/0.5,0,1),ag_in(tt,T.job,0.3)*(1-ag_in(tt,T.wed-0.6,0.4)));}},
    {at:T.wed-0.35,place:"ddInside",keys:[[0,960,540,1]],push:0.02,draw:(c,tt,cam)=>{dd_seen("ddInside",cam);
      // the list, and her row leaving it
      const lA=ag_in(tt,T.wed-0.2,0.4)*(1-ag_in(tt,T.ask-0.3,0.4));
      dd_listPage(c,120,120,{a:lA,hl:ag_in(tt,T.deletes-0.5,0.4),out:clamp((tt-T.deletes-0.1)/1.2,0,1)});
      // the table's history: a line for each step, each in when it's done
      // (a slot for each from the start, oldest first, so no line moves and the card never changes size)
      dd_history(c,1180,120,620,[["v51 · 24 Nov · with her","violet",clamp((tt-T.versions)/0.6,0,1)],["v52 · DELETE · 25 Nov, 01:00","ink",clamp((tt-T.hist)/0.6,0,1)],
        ["v53 · REORG · 25 Nov, 01:02","ink",clamp((tt-T.rew-0.2)/0.6,0,1)],["v54 · VACUUM · 2 Dec, 01:10","green",clamp((tt-T.hers)/0.6,0,1)]],
        {a:ag_in(tt,T.hist-0.3,0.4),k:Math.min(1,ag_spr(tt,T.hist-0.3,0.5))});
      // yesterday's list: the query, and her row in it
      const qA=ag_in(tt,T.ask-0.1,0.4)*(1-ag_in(tt,marks-0.4,0.4));
      dd_code(c,120,120,1000,[["select * from mart_hr__tutors_mailing_list","ink"],["  timestamp as of '2026-11-24'","cyan"]],{a:qA,head:"Databricks · a query",tool:"databricks",p:clamp((tt-T.ask)/1.0,0,1)});
      dd_result(c,120,350,ag_in(tt,T.there-0.6,0.4)*(1-ag_in(tt,marks-0.4,0.4)));
      dd_pillAt(c,1180,470,"She's there","violet",tt,T.there,marks-0.4,{size:28});
      // the file that holds her row: marked, rewritten without her, kept 7 days, then gone
      const fA=ag_in(tt,marks,0.4),fk=Math.min(1,ag_spr(tt,marks,0.5));
      if(fA>0){c.save();c.globalAlpha*=fA;ag_about(c,520,630,lerp(0.6,1,fk));dd_file(c,520,760,2.2,{mine:1,mark:clamp((tt-T.mark)/0.6,0,1),grey:ag_in(tt,T.without,0.6),crack:clamp((tt-T.hers)/1.0,0,1),lines:5});c.restore();}
      const f2=ag_in(tt,T.rew+0.3,0.4);if(f2>0){c.save();c.globalAlpha*=f2;ag_about(c,900,630,lerp(0.6,1,Math.min(1,ag_spr(tt,T.rew+0.3,0.5))));dd_file(c,900,760,2.2,{mine:0,lines:5});c.restore();}
      dd_link(c,[640,628],[780,628],"cyan",clamp((tt-T.rew-0.1)/0.5,0,1),ag_in(tt,T.rew,0.3)*(1-ag_in(tt,T.hers,0.6)));
      dp_tag(c,680,400,"A file of the table","cyan",{a:dd_io(tt,T.file-0.2,T.mark-0.2,0.4),to:[632,560],p:ag_sine((tt-T.file)/0.5)});
      dp_tag(c,680,400,"Marked deleted, still in the file","coral",{a:dd_io(tt,T.mark+0.3,T.rew-0.3,0.4),to:[632,560],p:ag_sine((tt-T.mark-0.4)/0.5)});
      dp_tag(c,1030,400,"New file, without her","green",{a:dd_io(tt,T.without,T.seven-0.2,0.4),to:[1012,520],p:ag_sine((tt-T.without-0.1)/0.5)});
      // the code of each step, at the top
      dd_code(c,120,120,1000,[["reorg table mart_hr__tutors_mailing_list","ink"],["  apply (purge)","cyan"]],{a:ag_in(tt,T.rew-0.2,0.4)*(1-ag_in(tt,T.vac-0.5,0.4)),head:"Databricks · the job's next step",tool:"databricks",p:clamp((tt-T.rew)/1.0,0,1)});
      dd_code(c,120,120,1000,[["vacuum mart_hr__tutors_mailing_list","ink"]],{a:ag_in(tt,T.vac-0.1,0.4)*(1-ag_in(tt,back-0.5,0.4)),head:"Databricks · the job's last step, each night",tool:"databricks",p:clamp((tt-T.vac)/0.8,0,1)});
      // seven days kept, a night at a time
      dp_slip(c,1180,470,"Old files kept 7 days","cyan",{a:ag_in(tt,T.seven-0.1,0.4)*(1-ag_in(tt,back-0.5,0.4))});
      dd_days(c,1222,640,clamp((tt-T.each)/0.45,0,7),ag_in(tt,T.seven+0.2,0.4)*(1-ag_in(tt,back-0.5,0.4)),{lastCol:tt>=T.hers?"green":"mut"});
      // and then no query can bring her back
      dd_code(c,120,120,1000,[["select * from mart_hr__tutors_mailing_list","ink"],["  timestamp as of '2026-11-24'","cyan"]],{a:ag_in(tt,back-0.2,0.4),head:"Databricks · a query",tool:"databricks",p:clamp((tt-back)/1.0,0,1)});
      dd_pillAt(c,1180,470,"Those files are gone","coral",tt,T.noq+0.2,null,{size:28});}}
  ]);
});

/* ================================================================ 4. Delete where it starts */
// HR's system, where the list is made from: her record, and her wish about news of tutoring work (o.no 0 to 1: the yes becomes a no)
function dd_hrPane(c,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;c.save();c.globalAlpha*=a;dp_page(c,x,y,580,380,{name:"HR's system",where:"Staff record",behind:o.behind});
  dp_T(c,"E-4417 · Linh Nguyen",x+32,y+132,{w:700,size:32});dp_T(c,"Her wishes",x+32,y+196,{w:600,size:28,col:"mut"});
  if(o.hl>0){c.save();c.globalAlpha*=o.hl;c.fillStyle=rgba(o.no>0.5?DP.F.coral:DP.F.green,0.12);rr(c,x+18,y+214,544,124,12);c.fill();c.restore();}
  dp_T(c,"News of tutoring work",x+32,y+254,{w:700,size:30});
  const n=clamp(o.no||0,0,1);
  if(n<1){c.save();c.globalAlpha*=1-n;dp_pill(c,x+430,y+254,"yes","green",{size:28});dp_T(c,"16 Jan 2023 · tutor application",x+32,y+306,{w:600,size:28,col:"mut"});c.restore();}
  if(n>0){c.save();c.globalAlpha*=n;dp_pill(c,x+430,y+254,"no","coral",{size:28});dp_T(c,"24 Nov 2026 · privacy office form",x+32,y+306,{w:600,size:28,col:"mut"});c.restore();}
  c.restore();}
// the request's keys: a restricted table, under frost, with a lock
function dd_keysPane(c,x,y,a){if(a<=0)return;c.save();c.globalAlpha*=a;dp_frost(c,x,y,720,150,null,{col:"violet",r:18});dp_lock(c,x+62,y+72,54,"violet",0);
  dp_T(c,"privacy.request_keys",x+120,y+62,{w:500,size:30,f:"mono"});dp_T(c,"Only the privacy office and its jobs",x+120,y+112,{w:600,size:28,col:"mut"});c.restore();}

scene("source",(ctx,S,t,sc)=>{
  const T={last:wAt(sc,"alone","last"),semester:wAt(sc,"rebuilt","semester"),rebuilt:wAt(sc,"rebuilt","rebuilt"),yes1:wAt(sc,"rebuilt","yes"),
    yes:wAt(sc,"yes","yes"),straight:wAt(sc,"yes","straight"),no:wAt(sc,"no","no"),record:wAt(sc,"no","record"),
    ingrid:wAt(sc,"ingrid","Ingrid"),puts:wAt(sc,"ingrid","puts"),morning:wAt(sc,"ingrid","morning"),follows:wAt(sc,"follows","follows"),
    adds:wAt(sc,"adds","adds"),log:wAt(sc,"adds","send"),ownDel:wAt(sc,"own","delete"),names:wAt(sc,"names","names"),
    restr:wAt(sc,"restricted","restricted"),only:wAt(sc,"restricted","only"),req:wAt(sc,"code","request")};
  const adds=sc.cues.adds,p1=tt=>1-ag_in(tt,adds-0.4,0.5);
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"ddInside",keys:[[0,960,540,1]],push:0.02,draw:(c,tt,cam)=>{dd_seen("ddInside",cam);
      // Ingrid, who owns HR's records, and her name
      const ia=ag_in(tt,T.rebuilt-0.2,0.6)*p1(tt);if(ia>0){c.save();c.globalAlpha*=ia;dp_person(c,"ingrid",300,660,0.92,{t:tt,gaze:[3,-1]});c.restore();}
      dd_cardAt(c,60,150,440,{title:"Ingrid Holm",sub:"Owns HR's records"},tt,T.ingrid,adds-0.4);
      // HR's record, and the list made from it each semester
      dd_hrPane(c,560,150,{a:ag_in(tt,T.semester-0.3,0.4)*p1(tt),hl:ag_in(tt,T.yes,0.4),no:clamp((tt-T.puts)/0.5,0,1)});
      dd_tablePage(c,1220,150,650,340,{a:ag_in(tt,0.2,0.4)*p1(tt),name:"hr.mart_hr__tutors_mailing_list",cols:[{t:"staff_id",w:200},{t:"given_name",w:240}],
        rows:[{cells:["E-4602","Ethan"]},{cells:["E-4417","Linh"],dash:true,a:ag_in(tt,T.straight-0.3,0.4)*(1-ag_in(tt,T.follows,0.6))}]});
      dd_link(c,[1140,330],[1220,330],"cyan",clamp((tt-T.rebuilt)/0.5,0,1),ag_in(tt,T.rebuilt,0.3)*p1(tt));
      dp_tag(c,1000,560,"Rebuilt each semester","cyan",{a:dd_io(tt,T.rebuilt+0.2,T.no-0.3,0.4),to:[1180,330],p:ag_sine((tt-T.rebuilt-0.3)/0.5)});
      dp_tag(c,1000,560,"Her no goes here","coral",{a:dd_io(tt,T.record-0.2,T.follows-0.3,0.4),to:[1140,410],p:ag_sine((tt-T.record-0.1)/0.5)});
      dp_tag(c,1340,560,"Every table follows","green",{a:dd_io(tt,T.follows,adds-0.4,0.4),to:[1545,450],p:ag_sine((tt-T.follows-0.1)/0.5)});
      // the send log, which only adds rows; her two rows leave it
      const sA=ag_in(tt,adds,0.5),out=clamp((tt-T.ownDel)/1.2,0,1),o1=ag_sine(clamp(out*2,0,1)),up=ag_sine(clamp(out*2-1,0,1));
      dd_tablePage(c,120,140,960,450,{a:sA,name:"hr.mart_hr__tutor_news_sent",cols:[{t:"newsletter",w:300},{t:"staff_id",w:220},{t:"sent_on",w:300}],rows:[
        {cells:["2026-S1 news","E-4417","2 Mar 2026"],hl:ag_in(tt,T.ownDel-0.6,0.4),dx:70*o1,a:1-o1},{cells:["2026-S1 news","E-4602","2 Mar 2026"],dy:-56*up},
        {cells:["2026-S2 news","E-4417","3 Aug 2026"],hl:ag_in(tt,T.ownDel-0.6,0.4),dx:70*o1,a:1-o1,dy:-56*up},{cells:["2026-S2 news","E-4602","3 Aug 2026"],dy:-112*up}]});
      dp_slip(c,1120,150,"Only ever adds rows","cyan",{a:dd_io(tt,T.adds+0.1,T.names-0.4,0.4)});
      dp_slip(c,1120,260,"Its own delete · 25 Nov, 01:00","cyan",{a:dd_io(tt,T.ownDel+0.2,T.names-0.4,0.4)});
      // the job's code, which names only the request; her numbers in a restricted table
      dd_code(c,1120,140,720,[["delete from mart_hr__tutor_news_sent","ink"],["where staff_id in (","ink"],["  select key from privacy.request_keys","ink"],["  where request = '2026-117'","cyan"],["    and system = 'HR')","ink"]],
        {a:ag_in(tt,T.names+0.05,0.4),head:"Databricks · the job's code",tool:"databricks",p:clamp((tt-T.names-0.1)/1.6,0,1),hl:[3,8,28],hlA:ag_in(tt,T.req,0.4)});
      dd_link(c,[1480,466],[1480,520],"violet",clamp((tt-T.restr)/0.5,0,1),ag_in(tt,T.restr,0.3));
      dd_keysPane(c,1120,520,ag_in(tt,T.restr+0.2,0.4));}}
  ]);
});

/* ================================================================ 5. Every copy */
// the lineage of HR's records as the platform shows it: each table made from them, and each column's tag; o.hl: which node is lit
const DD_NODES={staff:[180,300,"hr_system.staff"],contracts:[180,490,"hr_system.contracts"],list:[640,300,"mart_hr__tutors_mailing_list"],
  log:[1250,300,"mart_hr__tutor_news_sent"]};
function dd_node(c,k){const [x,y,t]=DD_NODES[k],w=dp_tw(c,t,{w:500,size:28,f:"mono"})+48;return{x,y,w,h:64,t};}
function dd_lineage(c,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;c.save();c.globalAlpha*=a;
  dp_page(c,120,170,1680,480,{tool:"databricks",name:"Databricks",where:"Lineage"});
  const L=[["staff","list"],["contracts","list"],["list","log"]];
  L.forEach(([f,g],i)=>{const A=dd_node(c,f),B=dd_node(c,g);dd_link(c,[A.x+A.w,A.y+32],[B.x,B.y+32],"cyan",clamp((o.p||0)*3-i*0.6,0,1),1,{lw:2});});
  for(const k in DD_NODES){const b=dd_node(c,k),hl=(o.hl&&o.hl[k])||0;if(hl>0)dp_halo(c,b.x+b.w/2,b.y+32,b.w*0.7,"violet",0.22*hl);
    dp_panel(c,b.x,b.y,b.w,b.h,{col:hl>0.5?"violet":"cyan",r:14,glowR:22});dp_T(c,b.t,b.x+24,b.y+42,{w:500,size:28,f:"mono"});}
  // the tags on the columns that hold who she is
  const tg=o.tags||0;if(tg>0){c.save();c.globalAlpha*=tg;dp_pill(c,640,434,"email · direct","violet",{size:28,glow:(o.hl&&o.hl.list||0)*22});
    dp_pill(c,1250,434,"staff_id · direct","violet",{size:28,glow:(o.hl&&o.hl.log||0)*22});c.restore();}
  c.restore();}
// the mailing tool, outside the platform: its contacts, hers leaving (out 0 to 1)
function dd_toolPane(c,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;c.save();c.globalAlpha*=a;dp_page(c,x,y,540,300,{name:"Mailing tool",where:"HR's contacts"});
  const out=o.out||0,e=ag_sine(clamp(out*2,0,1)),up=ag_sine(clamp(out*2-1,0,1));
  dp_T(c,"ethan.brown@uni.example",x+32,y+150,{w:500,size:28,f:"mono"});
  c.save();c.globalAlpha*=1-e;c.translate(60*e,0);dp_T(c,"linh.nguyen@uni.example",x+32,y+150+56,{w:500,size:28,f:"mono"});c.restore();c.restore();}
// the copies in the place apart: five slots, newest at the top; each [label, holds her row]
const DD_COPIES=[["26 Nov",0],["25 Nov",0],["24 Nov",1],["23 Nov",1],["22 Nov",1]],DD_CX=520,DD_CY=270,DD_CDY=100;

scene("copies",(ctx,S,t,sc)=>{
  const T={shows:wAt(sc,"shows","shows"),tag:wAt(sc,"shows","tag"),email:wAt(sc,"email","email"),number:wAt(sc,"number","staff"),
    leaves:wAt(sc,"leaves","leaves"),tool:wAt(sc,"leaves","mailing"),copiesW:wAt(sc,"leaves","copies"),drops:wAt(sc,"drops","drops"),four:wAt(sc,"drops","four"),
    contract:wAt(sc,"contract","contract"),within:wAt(sc,"contract","within"),copy:wAt(sc,"apart","copy"),apartW:wAt(sc,"apart","apart"),early:sc.cues.early,goes:wAt(sc,"apart","goes"),locked:wAt(sc,"apart","locked"),
    del:wAt(sc,"early","delete"),row:wAt(sc,"use","row"),out:wAt(sc,"use","out"),removed:wAt(sc,"use","removed"),lastW:wAt(sc,"last","last"),
    restored:wAt(sc,"restored","restored"),applies:wAt(sc,"restored","applies"),answered:wAt(sc,"restored","answered"),kanesh:wAt(sc,"void","receipt"),voidW:wAt(sc,"void","void")};
  const leaves=sc.cues.leaves,show=sc.cues.show,door=[1488,690];
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"ddInside",keys:[[0,960,540,1]],push:0.02,draw:(c,tt,cam)=>{dd_seen("ddInside",cam);
      dd_lineage(c,{a:ag_in(tt,T.shows-0.3,0.5),p:clamp((tt-T.shows)/2.0,0,1),tags:ag_in(tt,T.tag,0.5),
        hl:{list:dd_io(tt,T.email-0.1,T.number-0.2,0.3),log:ag_in(tt,T.number,0.3)}});}},
    {at:leaves-0.3,place:"ddHall",d:2.0,push:0,keys:[[0,1060,540,1.06],[show-0.2,880,560,1.1]],draw:(c,tt,cam)=>{dd_seen("ddHall",cam);
      // one line out of the platform, to the mailing tool, which copies the list each night and drops her
      const p1=1-ag_in(tt,show-0.3,0.5);
      dd_link(c,door,[1240,470],"cyan",clamp((tt-T.leaves)/0.8,0,1),p1);
      dd_toolPane(c,700,180,{a:ag_in(tt,T.tool-0.1,0.4)*p1,out:clamp((tt-T.drops)/1.2,0,1)});
      const pk=clamp((tt-T.copiesW)/1.2,0,1);if(pk>0&&pk<1){c.save();c.globalAlpha*=p1*Math.sin(Math.PI*pk);dp_halo(c,lerp(door[0],1240,ag_sine(pk)),lerp(door[1],470,ag_sine(pk)),40,"cyan",0.6);c.restore();}
      dp_slip(c,700,520,"25 Nov, 04:00","cyan",{a:ag_in(tt,T.four-0.1,0.4)*p1});
      dd_cardAt(c,700,640,640,{kick:"The tool's contract",title:"Its own backups lose her within 30 days"},tt,T.contract,show-0.3);
      // the place apart: a copy each night, locked for 30 days
      DD_COPIES.forEach(([lab,her],i)=>{const k=ag_in(tt,T.copy+0.3*(4-i),0.4),gone=i>=3?ag_in(tt,T.removed+0.4*(i-3),0.6):0,x=DD_CX,y=DD_CY+i*DD_CDY;
        // the restored copy goes to the platform's door, and back as void
        const mv=i===2?ag_sine(clamp((tt-T.restored)/1.6,0,1)):0,cx=lerp(x,1240,mv),cy=lerp(y,520,mv);
        dd_copy(c,cx,cy,{a:k*(1-gone),mine:her?ag_in(tt,T.row,0.5):0,label:mv>0.05?null:lab,labelCol:her&&tt>T.row?"violet":"mut"});
        if(i===2&&tt>T.answered){const m=clamp((tt-T.answered)/0.6,0,1);c.save();c.strokeStyle=rgba(DP.F.coral,1);c.lineWidth=3;c.shadowColor=rgba(DP.F.coral,0.8);c.shadowBlur=8;
          c.beginPath();c.moveTo(cx+66,cy+37);c.lineTo(cx+66+(250-92)*ag_sine(m),cy+37);c.stroke();c.restore();}});
      // the place apart, where the copies go: its glass wakes as the camera comes to it
      const ap=dd_io(tt,show,T.restored-0.4,0.8);if(ap>0){c.save();c.globalAlpha*=ap;dp_halo(c,300,600,240,"cyan",0.16);c.restore();}
      dp_tag(c,170,300,"A place apart","cyan",{a:dd_io(tt,T.apartW,T.early-0.3,0.4),to:[300,420],p:ag_sine((tt-T.apartW-0.1)/0.5)});
      dp_slip(c,DD_CX,170,"Locked 30 days","cyan",{a:ag_in(tt,T.locked,0.4)*(1-ag_in(tt,T.restored-0.4,0.4))});
      const pk2=clamp((tt-T.goes)/1.4,0,1);if(pk2>0&&pk2<1){c.save();c.globalAlpha*=Math.sin(Math.PI*pk2);dp_halo(c,lerp(door[0],DD_CX+250,ag_sine(pk2)),lerp(door[1],DD_CY+40,ag_sine(pk2)),40,"cyan",0.6);c.restore();}
      dd_pillAt(c,900,330,"Can't be deleted early","coral",tt,T.del,T.row-0.3,{size:30});
      // out of use beside the three that hold her; once two have gone, it moves up to the last, which goes on 24 December
      const up=ag_sine(clamp((tt-T.removed-0.7)/0.8,0,1)),rowY=DD_CY+2*DD_CDY+51;
      dd_pillAt(c,900,lerp(rowY+DD_CDY,rowY,up),"Out of use","violet",tt,T.out,T.restored-0.4,{size:30});
      dd_pillAt(c,900,rowY+80,"Goes 24 Dec","cyan",tt,T.lastW,T.restored-0.4,{size:30});
      // a restore: the job applies every answered request again, before anyone reads it
      dp_slip(c,1300,420,"privacy-deleter","cyan",{a:ag_in(tt,T.applies-0.3,0.4)});
      dd_cardAt(c,700,640,700,{kick:"Before anyone reads it",title:"Every answered request, applied again"},tt,T.applies,T.kanesh-0.4);
      // like the receipt in Kanesh: void wherever it turns up
      const ka=ag_in(tt,T.kanesh,0.5);if(ka>0){c.save();c.globalAlpha*=ka;dd_tablet(c,1150,604,1.0,{kind:"receipt",shadow:0.5});c.restore();}
      dd_stamp(c,1365,566,"Void",tt-T.voidW,{size:34});}}
  ]);
});

/* ================================================================ 6. Cold, until its day */
// her eight contracts' pay records, as chips; the years of pay_records' files, 2019 (after October's clean-up) to 2026
const DD_PAY=["T-23014","T-23187","T-24021","T-24166","T-25033","T-25172","T-26041","T-26188"];
const DD_YEARS=["2019","2020","2021","2022","2023","2024","2025","2026"],DD_YX=113,DD_YDX=214,DD_YW=196,DD_YY=420,DD_YH=330;
// a year of the table's files: lilac frost while on the archive tier (others' records under it, blurred); thaw (0 to 1): online, clear glass
function dd_year(c,i,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.003)return;const x=DD_YX+i*DD_YDX,y=DD_YY,w=DD_YW,h=DD_YH,th=clamp(o.thaw||0,0,1),n=o.lines||5;
  const lines=b=>{for(let k=0;k<n;k++){b.fillStyle=rgba(DP.T.mut,0.55);rr(b,x+22,y+h-34-k*22,(w-44)*(k%3===1?0.7:1),7,3);b.fill();}};
  c.save();c.globalAlpha*=a;
  if(th<1){c.save();c.globalAlpha*=1-th;dp_frost(c,x,y,w,h,lines,{col:"violet2",r:16});c.restore();}
  if(th>0){c.save();c.globalAlpha*=th;dp_panel(c,x,y,w,h,{col:"cyan",r:16,glowR:20,glowA:0.7});c.restore();}
  dp_T(c,DD_YEARS[i],x+24,y+46,{w:700,size:30});c.restore();}
// the whole table, before it shows its years: one long pane of lilac frost
function dd_payPane(c,a){if(a<=0)return;const w=DD_YDX*7+DD_YW;
  dp_frost(c,DD_YX,DD_YY,w,DD_YH,b=>{for(let k=0;k<5;k++){b.fillStyle=rgba(DP.T.mut,0.5);rr(b,DD_YX+30,DD_YY+DD_YH-34-k*22,w-60,7,3);b.fill();}},{col:"violet2",r:18,a});}
// the storage's access tiers: o.lit, how lit each is (0 to 1); o.notes, [words, opacity] beside them, one at a time
function dd_tiers(c,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;c.save();c.globalAlpha*=a;
  dp_page(c,x,y,1100,200,{tool:"storage",name:"Azure Blob Storage",where:"Access tier"});
  let px=x+40;["Hot","Cool","Cold","Archive"].forEach(k=>{const l=(o.lit&&o.lit[k])||0;
    if(l>0)dp_halo(c,px+60,y+150,100,"violet2",0.28*l);px+=dp_pill(c,px,y+164,k,l>0.5?"violet2":"grey",{size:30,glow:l*18})+28;});
  (o.notes||[]).forEach(([text,na])=>{if(na>0){c.save();c.globalAlpha*=na;dp_T(c,text,px+12,y+164,{w:500,size:30,col:"mut"});c.restore();}});
  c.restore();}

scene("cold",(ctx,S,t,sc)=>{
  const T={stay:sc.cues.stay,law:wAt(sc,"pay","law"),closed:sc.cues.closed,only:wAt(sc,"closed","only"),
    tier:sc.cues.tier,archW:wAt(sc,"tier","archive"),cheap:wAt(sc,"tier","cheapest"),read:sc.cues.read,hours:wAt(sc,"read","hours"),
    gone:sc.cues.gone,sorted:sc.cues.sorted,year:wAt(sc,"sorted","year"),jan:sc.cues.january,jback:wAt(sc,"january","back"),
    dels:wAt(sc,"whole","deletes"),hold:wAt(sc,"whole","hold"),jan1:wAt(sc,"steps","January")};
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"ddVault",keys:[[0,960,540,1]],push:0.015,draw:(c,tt,cam)=>{dd_seen("ddVault",cam);
      // the law, for pay records
      dd_cardAt(c,520,96,880,{kick:"Pay records, by law",title:"Kept 7 years after each contract ends"},tt,T.law-0.1,T.tier-0.5);
      // the table they are in, open only to HR's records team once a contract has ended; then its years
      dd_payPane(c,ag_in(tt,T.closed,0.6)*(1-ag_sine(clamp((tt-T.sorted-0.2)/1.0,0,1))));
      const hA=ag_in(tt,T.closed+0.2,0.5);if(hA>0){c.save();c.globalAlpha*=hA;dp_lock(c,DD_YX+26,382,46,"violet2",0);dp_T(c,"pay_records",DD_YX+62,396,{w:500,size:30,f:"mono"});c.restore();}
      dd_pillAt(c,DD_YX+300,396,"Only HR's records team","violet2",tt,T.only,T.tier+0.3,{size:28});
      // the years: 2026's files are less than a year old, still online; 2019's come back in January, then go, but for a held record
      const thaw=ag_sine(clamp((tt-T.jback)/1.6,0,1)),goA=1-ag_in(tt,T.dels+0.2,0.9);
      DD_YEARS.forEach((y,i)=>dd_year(c,i,{a:ag_in(tt,T.sorted+0.15+i*0.06,0.6)*(i===0?goA:1),thaw:i===7?0.75:(i===0?thaw:0),lines:i<4?8:2}));
      const hx=DD_YX+(DD_YW-dp_tw(c,"On hold",{w:700,size:28})-48)/2;
      dd_chip(c,hx,488,"On hold",{a:ag_in(tt,T.sorted+0.4,0.6),col:"amber"});
      if(tt>T.hold){const g=Math.sin(Math.PI*clamp((tt-T.hold)/1.4,0,1));if(g>0)dp_halo(c,DD_YX+DD_YW/2,522,120,"amber",0.3*g);}
      // her contracts' pay records: a row, then each into the year its contract ended
      const pulse=Math.sin(Math.PI*clamp((tt-T.gone)/1.6,0,1));
      dp_T(c,"Linh's contracts",DD_YX+84,520,{w:600,size:28,col:"mut",a:dd_io(tt,T.stay+0.4,T.closed-0.3,0.4)});
      DD_PAY.forEach((id,j)=>{const w=dp_tw(c,id,{w:700,size:28})+48,x0=DD_YX+84+j*196,y0=548,bi=4+Math.floor(j/2),x1=DD_YX+bi*DD_YDX+(DD_YW-w)/2,y1=488+(j%2)*82;
        const m=ag_sine(clamp((tt-T.year+0.6-j*0.08)/1.2,0,1)),x=lerp(x0,x1,m),y=lerp(y0,y1,m),ka=ag_in(tt,T.stay+0.5+j*0.07,0.4);if(ka<=0)return;
        if(pulse>0){c.save();c.globalAlpha*=ka;dp_halo(c,x+w/2,y+34,90,"violet",0.22*pulse);c.restore();}
        dd_chip(c,x,y,id,{a:ka,col:"violet"});});
      // the storage's tiers: the files on the archive tier, the cheapest and offline, and hours to bring back
      dd_tiers(c,410,96,{a:ag_in(tt,T.tier,0.5),lit:{Archive:ag_in(tt,T.archW,0.4)},
        notes:[["The cheapest · offline",dd_io(tt,T.cheap,T.read-0.1,0.4)],["Up to 15 hours to bring back",ag_in(tt,T.hours-0.2,0.4)]]});
      // the dates: 2019's January, then hers
      const lab=(i,text,t0)=>{const k=ag_in(tt,t0,0.4);if(k<=0)return;c.save();c.globalAlpha*=k;dp_T(c,text,DD_YX+i*DD_YDX+DD_YW/2,806,{w:700,size:30,align:"center"});c.restore();};
      lab(0,"Jan 2027",T.jan+0.2);["Jan 2031","Jan 2032","Jan 2033","Jan 2034"].forEach((d,k)=>lab(4+k,d,T.jan1+k*0.5));}}
  ]);
});

/* ================================================================ 7. Out of the logs */
// the platform's query history: what each query said, and who ran it; each names the request, never the person
const DD_QCOLS=[{t:"statement_text",w:810},{t:"executed_by",w:310},{t:"",w:56}];
const DD_QROWS=[["delete … where request = '2026-117'","privacy-deleter"],["select count(*) … where request = '2026-117'","jun.park@uni.example"],
  ["select … where request = '2026-117'","privacy-finder"]];
function dd_queryPage(c,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;c.save();c.globalAlpha*=a;
  const b=dp_page(c,x,y,1260,430,{tool:"databricks",name:"Databricks",where:"Query history"});
  dp_rows(c,b.x,b.y,DD_QCOLS,DD_QROWS.map(([q,who],i)=>[{t:q,mono:true},{t:who},{tick:"green",p:clamp(((o.tick||0)*3-i*0.6)/1.0,0,1)}]),{lh:58});
  // the request, ringed where each query names it
  const hl=o.hl||0;if(hl>0)DD_QROWS.forEach(([q],i)=>{const k=q.indexOf("'2026-117'"),px=b.x+dp_tw(c,q.slice(0,k),{w:500,size:28,f:"mono"}),pw=dp_tw(c,"'2026-117'",{w:500,size:28,f:"mono"}),ry=b.y+58*(i+1)+30;
    c.save();c.globalAlpha*=hl;c.strokeStyle=rgba(DP.F.cyan,1);c.lineWidth=2.4;c.shadowColor=rgba(DP.F.cyan,0.8);c.shadowBlur=10;rr(c,px-8,ry-30,pw+16,42,10);c.stroke();c.restore();});
  // had someone typed her email: a row that never was, dashed in coral
  const ha=o.typed||0;if(ha>0){const ry=b.y+58*4+30;c.save();c.globalAlpha*=ha;c.setLineDash([10,8]);c.strokeStyle=rgba(DP.F.coral,0.95);c.lineWidth=2.4;rr(c,b.x-12,ry-38,b.w+24,54,12);c.stroke();c.setLineDash([]);
    dp_T(c,"… where email = 'linh.nguyen@uni.example'",b.x,ry,{w:500,size:28,f:"mono",col:"coral"});dp_T(c,"—",b.x+810,ry,{w:500,size:28,col:"mut"});c.restore();}
  c.restore();}
// an agent's trace: the prompt and the answer; mask (0 to 1) turns her email into a mask before it's saved
function dd_tracePage(c,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;c.save();c.globalAlpha*=a;
  dp_page(c,x,y,1260,250,{tool:"databricks",name:"Databricks",where:"Agent's trace"});
  const lead="Check the tutors' list for ",lx=x+200,ex=lx+dp_tw(c,lead,{w:500,size:28}),m=clamp(o.mask||0,0,1),e1=1-ag_sine(clamp(m*2,0,1)),e2=ag_sine(clamp(m*2-1,0,1));
  dp_T(c,"Prompt",x+32,y+150,{w:600,size:28,col:"mut"});dp_T(c,lead,lx,y+150,{w:500,size:28});
  if(e1>0)dp_T(c,"linh.nguyen@uni.example",ex,y+150,{w:500,size:28,col:"violet",a:e1});
  if(e2>0){c.save();c.globalAlpha*=e2;ag_about(c,ex+90,y+138,lerp(0.8,1,e2));dp_pill(c,ex,y+150,"email masked","violet",{size:28,glow:10});c.restore();}
  dp_T(c,"Answer",x+32,y+208,{w:600,size:28,col:"mut"});dp_T(c,"She isn't on it: request 2026-117 took her off on 25 Nov.",lx,y+208,{w:500,size:28});
  c.restore();}
// the gateway's own table: each request and response, kept whole, under violet frost
function dd_gatewayPage(c,x,y,a){if(a<=0)return;c.save();c.globalAlpha*=a;dp_page(c,x,y,1260,240,{tool:"databricks",name:"Databricks",where:"Gateway's table"});
  dp_T(c,"request",x+32,y+136,{w:600,size:28,col:"mut"});dp_T(c,"response",x+672,y+136,{w:600,size:28,col:"mut"});
  const bar=(bx,w)=>b=>{for(let k=0;k<2;k++){b.fillStyle=rgba(DP.T.ink,0.7);rr(b,bx+16,y+160+k*20,(w-32)*(k?0.6:1),8,4);b.fill();}};
  dp_frost(c,x+32,y+150,600,64,bar(x+32,600),{col:"violet",r:12});dp_frost(c,x+672,y+150,556,64,bar(x+672,556),{col:"violet",r:12});c.restore();}
// the data team's ticket: the request, its due date and its steps, and nobody's name
const DD_STEPS=["Find every place","The copy, by part","Off the mailing list","Owners check their parts","Answer sent"];
function dd_issuePage(c,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return null;c.save();c.globalAlpha*=a;
  dp_page(c,x,y,1060,620,{tool:"github",name:"GitHub",where:"Issues",title:"Request 2026-117 · due 24 Dec"});
  const tw=dp_tw(c,"Request 2026-117 · due 24 Dec",{w:700,size:36}),ex=x+32+tw+24;
  if(o.edited>0){c.save();c.globalAlpha*=o.edited;dp_pill(c,ex,y+76+56,"edited","grey",{size:28});c.restore();}
  dp_pill(c,x+32,y+76+120,"privacy request","grey",{size:28});
  if(o.none>0){c.save();c.globalAlpha*=o.none;dp_T(c,"Names no one · the numbers are in the restricted table",x+32,y+76+184,{w:600,size:28,col:"green"});c.restore();}
  DD_STEPS.forEach((st,i)=>{const sy=y+76+250+i*56;c.strokeStyle=rgba(DP.T.mut,0.9);c.lineWidth=2;rr(c,x+34,sy-24,26,26,6);c.stroke();dp_T(c,st,x+80,sy,{w:500,size:28});});
  c.restore();return{ex:ex+dp_tw(c,"edited",{w:700,size:28})+36,ey:y+76+44};}
// a clone of the repository, on someone's laptop: the commit arrives in it (k 0 to 1)
function dd_clone(c,x,y,who,k,a){if(a<=0)return;c.save();c.globalAlpha*=a;dp_panel(c,x,y,560,92,{col:"cyan",r:16,glowR:20,glowA:0.6});
  dp_T(c,who,x+28,y+58,{w:600,size:28});if(k>0){c.save();c.globalAlpha*=clamp(k*2,0,1);ag_about(c,x+460,y+46,lerp(0.7,1,Math.min(1,ag_spr(k,0,0.5))));
    dp_pill(c,x+372,y+58,"a41f9c2","cyan",{size:28,glow:8});c.restore();}c.restore();}

scene("logs",(ctx,S,t,sc)=>{
  const T={type:sc.cues.type,yearW:wAt(sc,"year","year"),edit:wAt(sc,"year","edit"),typedW:wAt(sc,"typed","typed"),admins:wAt(sc,"typed","admins"),
    name:sc.cues.name,req:wAt(sc,"name","request"),agents:sc.cues.agents,trace:sc.cues.trace,gw:wAt(sc,"trace","gateway"),
    maskedW:wAt(sc,"masked","masked"),del:wAt(sc,"masked","deleted"),ticket:sc.cues.ticket,none:wAt(sc,"ticket","no"),
    edits:wAt(sc,"clone","edits"),commit:wAt(sc,"clone","commit"),copied:wAt(sc,"clone","copied")};
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"ddInside",keys:[[0,960,540,1]],push:0.02,draw:(c,tt,cam)=>{dd_seen("ddInside",cam);
      // Jun, and the platform's history of what was typed
      const out1=1-ag_in(tt,T.agents-0.5,0.5);
      const ja=ag_in(tt,0.3,0.6)*out1;if(ja>0){c.save();c.globalAlpha*=ja;dp_person(c,"jun",300,660,0.92,{t:tt,gaze:[3,-1]});c.restore();}
      dd_cardAt(c,60,150,440,{title:"Jun Park",sub:"Data engineer"},tt,0.6,T.agents-0.5);
      dd_queryPage(c,560,150,{a:ag_in(tt,T.type+0.6,0.5)*out1,typed:dd_io(tt,T.typedW,T.name-0.2,0.5),hl:ag_in(tt,T.req,0.4),tick:clamp((tt-T.req-0.2)/1.2,0,1)});
      const w1=dp_tw(c,"Kept a year",{w:700,size:30})+36;
      dd_pillAt(c,560,660,"Kept a year","cyan",tt,T.yearW,T.agents-0.5,{size:30});
      dd_pillAt(c,560+w1+24,660,"Nobody can edit it","grey",tt,T.edit,T.agents-0.5,{size:30});
      dd_pillAt(c,1290,660,"A year, for admins to read","coral",tt,T.admins,T.name-0.2,{size:30});
      // the agent, its trace, and the gateway's table
      const out2=1-ag_in(tt,T.ticket-0.5,0.5);
      ag_model(c,330,560,92,{t:tt,a:ag_in(tt,T.agents+0.1,0.6)*out2});
      dd_tracePage(c,560,100,{a:ag_in(tt,T.trace,0.5)*out2,mask:clamp((tt-T.maskedW)/0.8,0,1)});
      dd_gatewayPage(c,560,470,ag_in(tt,T.gw,0.5)*out2);
      dp_slip(c,1430,380,"Deleted after 30 days","cyan",{a:ag_in(tt,T.del,0.4)*out2});
      // the ticket, which names no one; its edits kept; a commit copied to every clone
      const ia=ag_in(tt,T.ticket,0.5),box=dd_issuePage(c,120,120,{a:ia,none:ag_in(tt,T.none,0.4),edited:ag_in(tt,T.edits-0.1,0.4)});
      if(box)dp_tag(c,1230,214,"Every edit kept","cyan",{a:ag_in(tt,T.edits+0.2,0.4),to:[box.ex,box.ey],p:ag_sine((tt-T.edits-0.1)/0.5)});
      dp_slip(c,1230,326,"commit a41f9c2","cyan",{a:ag_in(tt,T.commit,0.4)});
      ["Jun's clone","Sam's clone","Noor's clone"].forEach((who,i)=>{const ca=ag_in(tt,T.copied+0.1*i,0.4),k=clamp((tt-T.copied-0.5-0.35*i)/0.6,0,1);
        dd_clone(c,1230,440+i*110,who,k,ca);
        const pk=clamp((tt-T.copied-0.2-0.35*i)/0.6,0,1);if(pk>0&&pk<1){c.save();c.globalAlpha*=Math.sin(Math.PI*pk);dp_halo(c,lerp(1420,1690,ag_sine(pk)),lerp(394,486+i*110,ag_sine(pk)),30,"cyan",0.6);c.restore();}});}}
  ]);
});

/* ================================================================ 8. Gone */
// a warm light over a thing on the table in Kanesh
function dd_warm(c,x,y,r,a){if(!(a>0))return;c.save();c.globalCompositeOperation="lighter";const g=c.createRadialGradient(x,y,0,x,y,r);
  g.addColorStop(0,"rgba(255,196,130,"+(0.30*a).toFixed(3)+")");g.addColorStop(1,"rgba(255,196,130,0)");c.fillStyle=g;c.fillRect(x-r,y-r,2*r,2*r);c.restore();}
// a chip under a date: what went then, ticked
function dd_wentChip(c,x,y,text,k){if(k<=0)return;c.save();c.globalAlpha*=clamp(k*2,0,1);const bb=dp_slip(c,x,y,text,"green",{size:28,ink:true,align:"center"});
  dp_tick(c,bb.x-26,y+34,"green",clamp(k*1.5-0.3,0,1));c.restore();}

scene("gone",(ctx,S,t,sc)=>{
  const T={dec:sc.cues.dec,list:wAt(sc,"dec","list"),send:wAt(sc,"dec","send"),old:wAt(sc,"dec","old"),mail:wAt(sc,"dec","mailing"),
    locked:sc.cues.locked,lastC:wAt(sc,"locked","last"),pay:sc.cues.pay,lastP:wAt(sc,"pay","last"),date:sc.cues.date,record:wAt(sc,"date","record"),
    kanesh:sc.cues.kanesh,broken:wAt(sc,"kanesh","broken"),voidW:wAt(sc,"kanesh","void"),off:sc.cues.off,offW:wAt(sc,"off","off"),last:sc.cues.last};
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"ddHall",keys:[[0,960,540,1]],push:0.02,draw:(c,tt,cam)=>{dd_seen("ddHall",cam);
      // every copy's date, along a line, each ticked as it's said
      dd_timeline(c,160,1760,440,[{x:330,text:"2 Dec",t0:T.dec,tick:T.dec+0.6},{x:900,text:"24 Dec",t0:T.locked,tick:T.locked+0.6},{x:1600,text:"Jan 2034",t0:T.pay,tick:T.pay+0.6}],tt,{draw:clamp((tt-0.2)/1.6,0,1),a:ag_in(tt,0.1,0.5)});
      [1240,1360,1480].forEach((x,i)=>{const k=ag_in(tt,T.pay-0.3+i*0.12,0.4);if(k>0){c.save();c.globalAlpha*=k;c.fillStyle=rgba(DP.F.cyan,0.7);c.beginPath();c.arc(x,440,6,0,TAU);c.fill();c.restore();}});
      [["The list",T.list],["The send log",T.send],["Every old file",T.old],["The mailing tool",T.mail]].forEach(([w,t0],i)=>dd_wentChip(c,330,500+i*80,w,clamp((tt-t0)/0.6,0,1)));
      dd_wentChip(c,900,500,"The last locked copy",clamp((tt-T.lastC)/0.6,0,1));
      dd_wentChip(c,1600,500,"The last of her pay records",clamp((tt-T.lastP)/0.6,0,1));
      dp_slip(c,960,250,"Request 2026-117 · every step on the record","cyan",{a:ag_in(tt,T.record-0.2,0.4),align:"center"});}},
    {at:T.kanesh-0.3,place:"ddRoom",keys:[dd_key(0,"TABLE")],push:0.03,draw:(c,tt,cam)=>{dd_seen("ddRoom",cam);
      dd_roomLive(c,tt,{tin:null,cloth:null,n:3,rim:0,shards:{u:1},receipt:99,seal:1});
      dd_warm(c,DD_DESK[0],DD_DESK[1]-40,150,Math.sin(Math.PI*clamp((tt-T.broken)/2.2,0,1)));
      dd_warm(c,DD_RECEIPT[0],DD_RECEIPT[1]-50,140,Math.sin(Math.PI*clamp((tt-T.voidW)/2.2,0,1)));}},
    {at:T.off-0.3,place:"ddHall",keys:[[0,960,540,1]],push:0.02,draw:(c,tt,cam)=>{dd_seen("ddHall",cam);
      // Linh, off the list: only Ethan is on it now
      const la=ag_in(tt,T.off,0.7);if(la>0){c.save();c.globalAlpha*=la;dp_person(c,"linh",560,650,0.9,{t:tt,gaze:[3,-1]});c.restore();}
      dd_listPage(c,820,200,{a:ag_in(tt,T.off+0.3,0.5),out:1});
      dd_pillAt(c,820,640,"Off the list","green",tt,T.offW,sc.cues.breath+0.6,{size:30});}}
  ]);
  dd_where(ctx,S,"Kanesh, Anatolia · about 1900 BC",dd_io(t,T.kanesh,T.off-0.5,0.5));
  dp_end(ctx,S,t,sc.cues.breath,"Deleted means deleted","Deleting is done when the last copy is gone.","Film 4 of 5","Kept for a reason");
});

ag_cutInto(["void","receipt","source","copies"]);
