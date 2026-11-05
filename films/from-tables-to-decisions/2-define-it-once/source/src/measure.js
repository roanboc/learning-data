/* ===== Defined in the open: the university's pictures =====
   Drawn live on the module's map, in the place's coordinates, with the module's colours (look.js, MD): gold for what people agree on,
   here the definition of casual teaching cost and the names the other two counts get; light blue for the platform and its structure;
   amber for a person's turn (an approval to give, a question, a converter's notice); green for an approval given; red only for the
   budget's gap. The three numbers are in plain ink: none of them is wrong.
     dn_win      one of the three tools that answered Health's question, with its number and what it counts
     dn_budget   a budget bar against what casual teaching cost, and the seven tutorials it pays a tutor for
     dn_def      the definition of casual teaching cost: its owner, its words, its rules, filling in a part at a time
     dn_named    a smaller gold card: one of the other two counts, under a name of its own
     dn_code     lines of code in IBM Plex Mono, each coming in, lit gold or dimmed
     dn_pr       a pull request with its two approvals
     dn_bi       a BI tool of the past, its definitions in marks of its own that no other tool reads
     dn_home     one of a measure's two homes: a metric view in Unity Catalog, or MetricFlow in dbt
     dn_hub      Apache Ossie in the middle, its converters on the spokes to each tool's own format
     dn_genie    Genie One's answer; dn_dash the fortnightly dashboard and its Ask Genie
   Every name starts with dn_ or DN_. */

/* ---------------------------------------------------------------- the three numbers, in August */
const DN_WIN=[{x:100,prod:"Faculty of Health",title:"spreadsheet",num:"A$2.46M",what:"hours in the contracts",q:"for planning?"},
  {x:700,prod:"Payroll",title:"report",num:"A$1.88M",what:"pay paid on the semester's pay days",q:"for each pay day?"},
  {x:1300,prod:"Finance",title:"report",num:"A$2.21M",what:"claims approved for the semester's teaching + on-costs",q:"for the semester's teaching?"}];
const DN_WY=300,DN_WW=520,DN_WH=300;
// window i (0 to 2): o.what (0 to 1) what it counts comes in under its number; o.num (another number in its place, o.swap 0 to 1);
// o.inner (0 to 1) the definition's words, inside the report and nowhere else; o.a, o.k, o.lit; returns its box
function dn_win(ctx,i,o){o=o||{};const D=DN_WIN[i],x=D.x,y=o.y==null?DN_WY:o.y,bb={x,y,w:DN_WW,h:DN_WH};
  md_window(ctx,x,y,DN_WW,DN_WH,{product:D.prod,title:D.title,a:o.a,k:o.k,lit:o.lit,edge:o.edge,draw:(c,b)=>{
    const sw=clamp(o.swap||0,0,1),wa=ag_sine(clamp(o.what||0,0,1))*(1-ag_in(clamp(o.inner||0,0,1),0,0.5));
    if(sw<1)md_T(c,D.num,b.x+16,b.y+76,{w:800,size:68,a:1-sw});if(sw>0)md_T(c,o.num||D.num,b.x+16,b.y+76,{w:800,size:68,a:sw,col:o.numCol||MD.ink});
    if(wa>0.01)md_wrap(c,D.what,b.w-32,{w:600,size:28}).forEach((l,k)=>md_T(c,l,b.x+16,b.y+128+k*36,{w:600,size:28,col:MD.soft,a:wa}));
    const ia=ag_in(clamp(o.inner||0,0,1),0.4,0.6);if(ia>0.01)["claims approved · casual staff","teaching duties + on-costs","by teaching period"].forEach((l,k)=>
      md_T(c,l,b.x+16,b.y+128+k*36,{w:600,size:28,col:MD.ink,a:ia}));}});
  return bb;}

/* ---------------------------------------------------------------- a budget, and the tutorials it pays a tutor for */
// a bar from 0 to A$2.5M at (x, y), w wide: filled to o.v (millions) from o.label's figure, against the line at A$2.21M, what casual
// teaching cost; o.gap (0 to 1) the shortfall turns red, "A$330,000 short"; o.tut (0 to 1) seven tutorials come in, o.empty (0 to 1)
// the seventh has no tutor; o.a
function dn_budget(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;const sc=v=>x+w*v/2.5,h=56,v=o.v==null?1.88:o.v;
  md_T(ctx,o.label||"Health's budget, on payroll's number",x,y-22,{w:700,size:28,col:MD.soft});
  md_card(ctx,x,y,w,h,{r:12,fill:"rgba(9,15,31,0.94)"});rr(ctx,x+4,y+4,Math.max(0,sc(v)-x-8),h-8,9);ctx.fillStyle=rgba(o.col||MD.soft,0.55);ctx.fill();
  md_T(ctx,"A$"+v.toFixed(2)+"M",x+24,y+h/2+10,{w:800,size:30});
  const gx=sc(2.21),gp=clamp(o.gap||0,0,1);
  if(gp>0){ctx.save();ctx.globalAlpha*=gp;rr(ctx,sc(v),y+4,gx-sc(v)-4,h-8,6);ctx.fillStyle=rgba(MD.fail,0.35);ctx.fill();ctx.strokeStyle=rgba(MD.fail,0.95);ctx.lineWidth=2;ctx.stroke();ctx.restore();
    md_pill(ctx,(sc(v)+gx)/2,y+h+52,"A$330,000 short",{col:MD.fail,a:gp,size:30});}
  ctx.strokeStyle=rgba(MD.ink,0.9);ctx.lineWidth=3;ctx.setLineDash([8,6]);ctx.beginPath();ctx.moveTo(gx,y-14);ctx.lineTo(gx,y+h+14);ctx.stroke();ctx.setLineDash([]);
  md_T(ctx,"what it cost · A$2.21M",gx+16,y-22,{w:700,size:28});
  const tu=clamp(o.tut||0,0,1);if(tu>0){const tx=x+w+70,ty=y-10;
    for(let k=0;k<7;k++){const ka=ag_in(tu*1.4-k*0.06,0,0.3);if(ka<=0)continue;const bx=tx+(k%4)*74,by=ty+Math.floor(k/4)*74,em=k===6?clamp(o.empty||0,0,1):0;ctx.save();ctx.globalAlpha*=ka;
      md_card(ctx,bx,by,62,62,{r:12,edge:em>0.5?MD.fail:null,dash:em>0.5?[6,6]:false});if(em<1)md_icon(ctx,"person",bx+31,by+31,36,MD.ink,{a:1-em});ctx.restore();}
    if(o.empty>0)md_T(ctx,"no money for a tutor",tx+228,ty+74+42,{w:700,size:28,col:MD.fail,a:ag_in(o.empty,0.3,0.5)});}
  ctx.restore();}

/* ---------------------------------------------------------------- the definition, defined once */
// at (x, y), 860 wide: o.n (0 to 9) how many of its parts have come in: owner, words, also called, the three rules, on-costs, and
// the period (two lines); o.a, o.k, o.empty (0 to 1: only its outline, dashed, as it waits for its words); returns its box
const DN_DEF=[{h:"owner"},{s:"Rohan Desai, Finance"},{h:"words"},{s:"what the casual teaching in a teaching period costs"},{s:"also called: sessional teaching cost",col:MD.soft},
  {h:"rules"},{s:"claims approved"},{s:"by casual staff (pay type CAS)"},{s:"for teaching: tutorial · marking · consultation"},{s:"+ on-costs, at Finance's rate for the year"},
  {s:"by the teaching period it was done in,"},{s:"not the day it was paid"}];
// which part each line belongs to: the owner (1), the words (2), also called (3), the rules (4 to 6), on-costs (7), the period (8)
const DN_DEF_PART=[1,1,2,2,3,4,4,5,6,7,8,8];
function dn_def(ctx,x,y,o){o=o||{};const n=o.n||0,w=o.w||860,lines=[{s:"casual teaching cost",size:40,w:800,lh:54}];
  DN_DEF.forEach((d,i)=>{const k=clamp(n-DN_DEF_PART[i]+1,0,1);lines.push(d.h?{s:d.h.toUpperCase(),size:28,w:800,col:MD.agreed,k,lh:37}:{s:d.s,size:30,w:600,col:d.col,k,lh:39});});
  if(o.empty>0){const ea=clamp(o.empty,0,1);ctx.save();ctx.globalAlpha*=ea*(o.a==null?1:o.a);md_card(ctx,x,y,w,o.emptyH||150,{edge:MD.agreed,dash:[12,10]});ctx.restore();if(ea>=1)return{x,y,w,h:150};}
  return dn_card(ctx,x,y,w,lines,{edge:MD.agreed,kick:"measure",kickCol:MD.agreed,a:o.a,k:o.k});}
// one of the other counts, under a name of its own: a smaller gold card
function dn_named(ctx,x,y,w,title,sub,o){o=o||{};return md_textCard(ctx,x,y,w,{title,sub},{edge:MD.agreed,a:o.a,k:o.k,glow:0.6});}

/* ---------------------------------------------------------------- code, a line at a time */
// lines [{s, ind (indent in characters), k (0 to 1), lit (0 to 1: gold), dim (0 to 1)}], at (x, y), lh apart, 30 px IBM Plex Mono
function dn_code(ctx,x,y,lines,o){o=o||{};const lh=o.lh||44,size=o.size||30,cw=md_tw(ctx,"m",{w:500,size,f:"mono"});
  lines.forEach((l,i)=>{const k=clamp(l.k==null?1:l.k,0,1);if(k<=0.01)return;const by=y+i*lh,lx=x+(l.ind||0)*cw,lit=clamp(l.lit||0,0,1),dm=clamp(l.dim||0,0,1);
    if(lit>0){const tw=md_tw(ctx,l.s,{w:500,size,f:"mono"});ctx.save();ctx.globalAlpha*=lit*k;ctx.fillStyle=rgba(MD.agreed,0.14);rr(ctx,lx-10,by-size*0.92,tw+20,size*1.32,8);ctx.fill();
      ctx.strokeStyle=rgba(MD.agreed,0.7);ctx.lineWidth=1.6;rr(ctx,lx-10,by-size*0.92,tw+20,size*1.32,8);ctx.stroke();ctx.restore();}
    md_T(ctx,l.s,lx,by,{w:500,size,f:"mono",col:lit>0.5?MD.agreed:(l.col||MD.ink),a:k*(1-0.6*dm)});});}

/* ---------------------------------------------------------------- a pull request, and its two approvals */
// at (x, y), w wide: o.ok [meaning, production] (0 to 1 each: amber, waiting, to green, given); o.a, o.k; returns its box
function dn_pr(ctx,x,y,w,o){o=o||{};const ok=o.ok||[0,0],h=296,a=o.a==null?1:o.a,bb={x,y,w,h};if(a<=0.004)return bb;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));md_card(ctx,x,y,w,h,{edge:MD.flow,glow:0.5});
  md_T(ctx,"PULL REQUEST",x+MD_PAD,y+MD_PAD+24,{w:800,size:28,ls:4,col:MD.flow});md_T(ctx,"Finance: casual teaching cost,",x+MD_PAD,y+MD_PAD+76,{w:700,size:32});
  md_T(ctx,"defined once",x+MD_PAD,y+MD_PAD+116,{w:700,size:32});
  [["Rohan Desai · meaning",ok[0]],["Noor Rahman · production",ok[1]]].forEach(([s,k],i)=>{const ry=y+MD_PAD+176+i*54,col=mix(MD.wait,MD.pass,ag_sine(clamp(k,0,1)));
    ctx.save();ctx.fillStyle=rgba(col,0.18);ctx.beginPath();ctx.arc(x+MD_PAD+20,ry-10,20,0,TAU);ctx.fill();ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=2;ctx.stroke();ctx.restore();
    md_icon(ctx,"clock",x+MD_PAD+20,ry-10,26,MD.wait,{a:1-ag_in(k,0,0.4)});md_icon(ctx,"tick",x+MD_PAD+20,ry-10,26,MD.pass,{a:ag_in(k,0,0.4)});
    md_T(ctx,s,x+MD_PAD+56,ry,{w:600,size:28,col:k>0.5?MD.ink:MD.soft});});
  ctx.restore();return bb;}

/* ---------------------------------------------------------------- BI tools of the past */
// a plain window, i (0 to 3), at (x, y), w by h: its definitions in marks of its own (no words: no other tool can read them);
// o.n (0 to 1) how many have been written so far; o.a, o.k
function dn_bi(ctx,x,y,w,h,i,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  const col=[[150,190,240],[200,170,250],[150,230,200],[240,200,150]][i%4];md_card(ctx,x,y,w,h,{edge:col,glow:0.3,edgeA:0.5});
  ctx.fillStyle="rgba(255,255,255,0.05)";rr(ctx,x+1,y+1,w-2,44,17);ctx.fill();for(let d=0;d<3;d++){ctx.fillStyle=rgba(col,0.5);ctx.beginPath();ctx.arc(x+24+d*20,y+22,5,0,TAU);ctx.fill();}
  const n=o.n==null?1:o.n,rows=4;for(let r=0;r<rows;r++){const k=clamp(n*rows-r,0,1);if(k<=0)continue;const ry=y+84+r*((h-110)/rows);ctx.save();ctx.globalAlpha*=k;ctx.fillStyle=rgba(col,0.9);
    const mx=x+34;if(i===0){ctx.beginPath();ctx.moveTo(mx,ry-10);ctx.lineTo(mx+10,ry);ctx.lineTo(mx,ry+10);ctx.lineTo(mx-10,ry);ctx.closePath();ctx.fill();}
    else if(i===1){ctx.beginPath();ctx.arc(mx,ry,9,0,TAU);ctx.fill();}else if(i===2){ctx.fillRect(mx-9,ry-9,18,18);}else{ctx.beginPath();ctx.moveTo(mx,ry-11);ctx.lineTo(mx+11,ry+9);ctx.lineTo(mx-11,ry+9);ctx.closePath();ctx.fill();}
    ctx.fillStyle=rgba(col,0.4);rr(ctx,mx+26,ry-6,(w-110)*(0.5+0.4*hash(r,i+2))*k,12,6);ctx.fill();ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- a measure's two homes */
// at (x, y), 560 wide: k 0 the metric view in Unity Catalog, 1 MetricFlow in dbt; o.lit, o.a
function dn_home(ctx,x,y,k,o){o=o||{};const w=o.w||560,h=150,a=o.a==null?1:o.a,bb={x,y,w,h};if(a<=0.004)return bb;ctx.save();ctx.globalAlpha*=a;const lg=k?"dbt":"databricks",col=k?MD.dbt:MD.dbx;
  if(o.lit>0)glow(ctx,x+w/2,y+h/2,w*0.6,MD.flow,0.25*o.lit);md_card(ctx,x,y,w,h,{edge:mix(col,MD.flow,0.4),glow:0.4,edgeA:0.7});let tx=x+MD_PAD;
  if(typeof LOGO!=="undefined"&&LOGO[lg])tx+=logo(ctx,lg,x+MD_PAD,y+MD_PAD+2,44)+20;md_T(ctx,k?"MetricFlow":"a metric view",tx,y+MD_PAD+38,{w:800,size:34});
  md_T(ctx,k?"in dbt, in the project's YAML":"in Unity Catalog, near the data",x+MD_PAD,y+MD_PAD+92,{w:600,size:28,col:MD.soft});ctx.restore();return bb;}

/* ---------------------------------------------------------------- Apache Ossie, and its converters */
const DN_HUB={c:[960,470],tools:[{x:90,y:420,w:430,title:"a metric view",logo:"databricks"},{x:1400,y:420,w:430,title:"MetricFlow",logo:"dbt"},{x:1370,y:690,w:460,title:"other tools",icon:"api"}]};
function dn_hubPort(i){const T_=DN_HUB.tools[i];return i===0?[T_.x+T_.w,T_.y+50]:i===1?[T_.x,T_.y+50]:[T_.x,T_.y+50];}
// o.hub (0 to 1) the hub; o.was (0 to 1) its first name under it; o.ring (0 to 1) the organisations round it, o.named (0 to 1) two of them;
// o.tools (0 to 1) the tools, before their converters; o.spokes (0 to 1) the converters to each tool; o.lit [i...] tools lit;
// o.subs [i: text] what a tool shows it has read, o.subA its light; o.a
function dn_hub(ctx,t,o){o=o||{};const a=o.a==null?1:o.a,[cx,cy]=DN_HUB.c;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  const rg=clamp(o.ring||0,0,1);if(rg>0){for(let i=0;i<54;i++){const k=clamp(rg*1.6-i/54*0.6,0,1);if(k<=0)continue;const an=-Math.PI/2+i*TAU/54,r=200+18*hash(i,5);
      ctx.fillStyle=rgba(mix(MD.soft,MD.ink,hash(i,9)),0.75*k);ctx.beginPath();ctx.arc(cx+Math.cos(an)*r,cy+Math.sin(an)*r*0.82,5,0,TAU);ctx.fill();}
    md_T(ctx,"50+ organisations",cx,cy-220,{w:800,size:30,align:"center",a:ag_in(rg,0.4,0.5)});}
  const nm=clamp(o.named||0,0,1);if(nm>0)md_tag(ctx,cx,cy-288,"Databricks · dbt Labs",{align:"center",col:MD.soft,a:nm});
  const sp=clamp(o.spokes||0,0,1),tl=clamp(o.tools||0,0,1);DN_HUB.tools.forEach((T_,i)=>{const k=clamp(sp*1.5-i*0.25,0,1),ba=Math.max(ag_in(k,0.3,0.5),tl);if(ba<=0.004)return;
    const p=dn_hubPort(i),q=i===0?[cx-170,cy]:i===1?[cx+170,cy]:[cx+120,cy+60],pts=md_curve(q,p,{bend:0.5});if(k>0)md_lane(ctx,pts,MD.agreed,0.7*k,{u:ag_sine(k)});
    if(k>=1){const m=at(mk(pts.map(z=>P(z[0],z[1]))),0.5);ctx.save();ctx.beginPath();ctx.arc(m.x,m.y,30,0,TAU);ctx.fillStyle="rgba(7,12,26,0.96)";ctx.fill();ctx.strokeStyle=rgba(MD.agreed,0.9);ctx.lineWidth=2;ctx.stroke();
      // a converter: one arrow each way
      ctx.strokeStyle=rgba(MD.agreed,1);ctx.lineWidth=3;ctx.lineCap="round";for(const [dy,dir] of [[-7,1],[7,-1]]){ctx.beginPath();ctx.moveTo(m.x-13*dir,m.y+dy);ctx.lineTo(m.x+13*dir,m.y+dy);ctx.lineTo(m.x+7*dir,m.y+dy-5);ctx.stroke();}ctx.restore();}
    // what a tool has read comes in under its name, which rises to make room for it
    const sb=o.subs&&o.subs[i],sa=sb?clamp(o.subA||0,0,1):0,lit=Math.max(o.lit&&o.lit.includes(i)?1:0,sa);ctx.save();ctx.globalAlpha*=ba;
    if(!sb)md_reader(ctx,T_.x,T_.y,T_.w,{title:T_.title,logo:T_.logo,icon:T_.icon,col:T_.icon?MD.soft:null,lit,h:100});
    else{md_reader(ctx,T_.x,T_.y,T_.w,{title:"",icon:T_.icon,col:MD.soft,lit,h:100});const tx=T_.x+88,u=ag_sine(sa);
      md_T(ctx,T_.title,tx,T_.y+lerp(61,44,u),{w:800,size:32});md_T(ctx,sb,tx,T_.y+82,{w:500,size:28,col:MD.soft,a:ag_in(sa,0.4,0.6)});}
    ctx.restore();});
  const hb=clamp(o.hub==null?1:o.hub,0,1);if(hb>0){ctx.save();ctx.globalAlpha*=hb;ag_about(ctx,cx,cy,lerp(0.6,1,ag_spr(hb,0,0.5)));glow(ctx,cx,cy,260,MD.agreed,0.25);
    md_card(ctx,cx-170,cy-56,340,112,{edge:MD.agreed,r:56,fill:"rgba(12,18,34,0.97)"});md_T(ctx,"Apache Ossie",cx,cy+15,{w:800,size:42,align:"center",col:MD.agreed});ctx.restore();}
  const ws=clamp(o.was||0,0,1);if(ws>0)md_T(ctx,"formerly the Open Semantic Interchange",cx,cy+214,{w:600,size:28,align:"center",col:MD.soft,a:ws});
  ctx.restore();}

/* ---------------------------------------------------------------- Genie One, and the fortnightly dashboard */
// Genie One's page at (x, y), w by h: o.q (0 to 1) the question types itself in; o.ans (0 to 1) the answer, with its measure; o.a, o.k
function dn_genie(ctx,x,y,w,h,o){o=o||{};return md_window(ctx,x,y,w,h,{logo:"databricks",product:"Genie One",a:o.a,k:o.k,draw:(c,b)=>{
  const q="What has casual teaching cost Health this semester so far?",n=Math.round(q.length*clamp(o.q||0,0,1)),shown=q.slice(0,n),ls=md_wrap(c,q,b.w-80,{w:600,size:30});
  if(n>0){let left=n;const bh=ls.length*40+34;md_card(c,b.x+b.w-((b.w-40)+8),b.y+8,b.w-48,bh,{r:16,fill:"rgba(30,44,74,0.9)"});
    ls.forEach((l,k)=>{const s=l.slice(0,Math.max(0,left));left-=l.length+1;if(s)md_T(c,s,b.x+40,b.y+50+k*40,{w:600,size:30});});}
  const an=clamp(o.ans||0,0,1);if(an>0){const ay=b.y+ls.length*40+80;c.save();c.globalAlpha*=ag_in(an,0,0.4);
    md_T(c,"A$1.84 million",b.x+16,ay+56,{w:800,size:56});md_T(c,"Semester 2 so far · Faculty of Health",b.x+16,ay+104,{w:600,size:28,col:MD.soft});
    md_tag(c,b.x+16,ay+160,"measure · casual teaching cost",{col:MD.agreed,a:ag_in(an,0.4,0.5)});c.restore();}}});}
// the dashboard at (x, y), w by h: its three tiles, dimmed (o.dim), and its Ask Genie with the same answer (o.ans); o.a, o.k
function dn_dash(ctx,x,y,w,h,o){o=o||{};return md_window(ctx,x,y,w,h,{logo:"databricks",product:"Dashboard",a:o.a,k:o.k,draw:(c,b)=>{
  md_T(c,"The fortnightly figures",b.x+12,b.y+40,{w:800,size:32});const dm=1-0.55*clamp(o.dim||0,0,1);
  [["pay run","A$9.6M"],["casual hours","10,090"],["claims waiting","143"]].forEach(([l,v],i)=>{const ty=b.y+62+i*58;c.save();c.globalAlpha*=dm;md_card(c,b.x+12,ty,b.w-24,50,{r:10});
    md_T(c,l,b.x+30,ty+35,{w:600,size:28,col:MD.soft});md_T(c,v,b.x+b.w-30,ty+36,{w:800,size:32,align:"right"});c.restore();});
  const an=clamp(o.ans||0,0,1);md_pill(c,b.x+110,b.y+278,"Ask Genie",{col:MD.flow,size:28,a:ag_in(clamp(o.ask||0,0,1),0,0.4)});
  if(an>0){c.save();c.globalAlpha*=ag_in(an,0,0.4);md_T(c,"A$1.84 million",b.x+12,b.y+356,{w:800,size:48});md_T(c,"the same measure, the same answer",b.x+12,b.y+398,{w:600,size:28,col:MD.soft});c.restore();}}});}
