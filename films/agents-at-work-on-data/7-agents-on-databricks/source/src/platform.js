/* ===== Working with agents on Databricks: the platform =====
   The data team's room is the module's lab ("lab", and at night "labNight"); what the film puts in it is drawn here, live, in the
   module's colours, never a product's own: no logo, no screen captured. The platform's pages are matte off-white cards with a small
   bar naming the product ("Databricks · Genie One"), as Meaning on the platform drew its own.
     od_shelf       the long oak shelf of the opening, "Databricks", with three blue sections and the tools' sockets
     od_strip       the four ways agents work on the platform, four numbered cards along the top, from One place to the end of
                    Agents that write code, each lit in its chapter
     od_dbCard      the platform, and its governed data: "Databricks", with Unity Catalog inside it
     od_page        a page of the platform, with its bar; od_genieOne and od_genieAgent fill two of them
     od_tool        a tool server's card, with the matte box behind it and its socket; od_fnCard the census count as a function
     od_job, od_trace, od_eval, od_bricks   the nightly job, the census check agent's trace, its evaluation, and Agent Bricks
     od_pipeline, od_editor   Sam's pipeline editor with Genie Code beside it; Jun's editor
     od_draft       a draft on a branch, with its marks
   Every name starts with od_ or OD_. Sizes are in the 1920 x 1080 frame, seen at zoom 1. */

/* ---------------------------------------------------------------- the opening's shelf: one place for data and tools */
const OD_SHELF={x:120,y:236,w:1100,secs:["governed tables","definitions","tools"]};
// o.a; o.k (0 to 1) it builds, section by section; o.glow (0 to 1) the tools' section lit. Returns the tools' sockets [[x, y], ...]
function od_shelf(ctx,o){o=o||{};const S_=OD_SHELF,a=o.a==null?1:o.a,py=S_.y+150;if(a<=0)return od_sockets();ctx.save();ctx.globalAlpha*=a;
  ag_label(ctx,S_.x+8,S_.y,"Databricks",{col:AG.blue,size:30});
  // the plank, on two brackets, with its shadow on the marble
  ctx.save();ctx.shadowColor="rgba(46,38,28,0.28)";ctx.shadowBlur=18;ctx.shadowOffsetX=AG.sdx;ctx.shadowOffsetY=12;ctx.fillStyle=rgba(AG_OAK.base,1);ctx.fillRect(S_.x,py,S_.w,26);ctx.restore();
  let g=ctx.createLinearGradient(0,py,0,py+26);g.addColorStop(0,rgba(AG_OAK.hi,1));g.addColorStop(0.3,rgba(AG_OAK.base,1));g.addColorStop(1,rgba(AG_OAK.dark,1));ctx.fillStyle=g;ctx.fillRect(S_.x,py,S_.w,26);
  for(const bx of [S_.x+60,S_.x+S_.w-80]){ctx.fillStyle="#3A3B40";ctx.fillRect(bx,py+26,14,30);}
  const b=od_secBoxes(ctx);b.forEach((r,i)=>{const k=o.k==null?1:clamp(o.k*3-i,0,1);if(k<=0)return;const e=ag_spr(k,0,0.5);ctx.save();ctx.globalAlpha*=ag_in(k,0,0.4);
    ctx.translate(0,(1-e)*-24);const gl=i===2?(o.glow||0):0;ag_box(ctx,r.x,r.y,r.w,r.h,16,{edge:AG.blue,edgeA:0.55+0.4*gl,glow:gl>0.05?AG.blue:null,glowA:gl});
    ag_T(ctx,S_.secs[i],r.x+r.w/2,r.y+r.h/2+10,{w:700,size:30,align:"center",col:AG.blue});ctx.restore();});
  for(const [sx,sy] of od_sockets()){ctx.fillStyle="#2E2F34";rr(ctx,sx-11,sy-8,22,16,5);ctx.fill();ctx.fillStyle="rgba(255,255,255,0.25)";ctx.fillRect(sx-6,sy-3,12,2);}
  ctx.restore();return od_sockets();}
function od_secBoxes(ctx){const S_=OD_SHELF,ws=S_.secs.map(s=>ag_tw(ctx,s,{w:700,size:30})+64),gap=(S_.w-40-ws.reduce((p,q)=>p+q,0))/2;let x=S_.x+20;
  return ws.map(w=>{const r={x,y:S_.y+40,w,h:104};x+=w+gap;return r;});}
// three sockets on the plank's front edge, under the tools' section
function od_sockets(){const S_=OD_SHELF,x1=S_.x+S_.w-20,py=S_.y+150+13;return[[x1-250,py],[x1-160,py],[x1-70,py]];}

/* ---------------------------------------------------------------- the four ways, along the top */
const OD_WAYS=["Agents that answer","Tool servers","Agents the team builds","Agents that write code"];
function od_wayBoxes(ctx){const ws=OD_WAYS.map(s=>ag_tw(ctx,s,{w:700,size:28})+56+28),gap=(1728-ws.reduce((p,q)=>p+q,0))/3;let x=96;return ws.map(w=>{const r={x,y:130,w,h:60};x+=w+gap;return r;});}
// in screen space. o.k [4] each card springs in; o.on [4] how lit each is (its edge blue, its words ink, the others quieter); o.a.
// Returns the cards' boxes
function od_strip(ctx,o){o=o||{};const a=o.a==null?1:o.a,b=od_wayBoxes(ctx);if(a<=0)return b;ctx.save();ctx.globalAlpha*=a;
  b.forEach((r,i)=>{const k=o.k?o.k[i]:1;if(k<=0)return;const e=Math.min(1,ag_spr(k,0,0.5)),on=o.on?o.on[i]:0,quiet=o.on&&Math.max(...o.on)>0.5&&on<0.5;
    ctx.save();ctx.globalAlpha*=ag_in(k,0,0.3);ag_about(ctx,r.x+r.w/2,r.y+r.h/2,lerp(0.7,1,e));
    ag_box(ctx,r.x,r.y,r.w,r.h,16,{edge:on>0.05?AG.blue:null,edgeA:0.9*on,glow:on>0.05?AG.blue:null,glowA:on});
    ag_T(ctx,String(i+1),r.x+26,r.y+40,{w:500,size:28,f:"mono",col:AG.violet});
    ag_T(ctx,OD_WAYS[i],r.x+56,r.y+40,{w:700,size:28,col:quiet?AG.mut:AG.ink});
    ctx.restore();});
  ctx.restore();return b;}

/* ---------------------------------------------------------------- the platform, and its governed data */
const OD_DB={x:330,y:214,w:1260,h:280},OD_UC={x:362,y:290,w:1196,h:176},OD_UCP=["tables","definitions","who may read what"];
// o.parts [3] each part of Unity Catalog lit; o.uc (0 to 1) Unity Catalog's frame drawn; o.from {x, y, w, h}: it grows from there (u)
function od_dbCard(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const D=OD_DB,U=OD_UC;ctx.save();ctx.globalAlpha*=a;
  if(o.from&&o.u<1){const e=ag_sine(o.u),f=o.from;ctx.translate(lerp(f.x+f.w/2,D.x+D.w/2,e),lerp(f.y+f.h/2,D.y+D.h/2,e));ctx.scale(lerp(f.w/D.w,1,e),lerp(f.h/D.h,1,e));ctx.translate(-(D.x+D.w/2),-(D.y+D.h/2));}
  ag_box(ctx,D.x,D.y,D.w,D.h,24,{edge:AG.blue,edgeA:0.5});ag_T(ctx,"Databricks",D.x+32,D.y+54,{w:800,size:40,a:o.title==null?1:o.title});
  const uc=o.uc==null?1:o.uc;if(uc>0){ctx.save();ctx.globalAlpha*=uc;ctx.strokeStyle=rgba(AG.blue,0.75);ctx.lineWidth=2.5;rr(ctx,U.x,U.y,U.w,U.h,18);ctx.stroke();
    ctx.fillStyle=rgba(AG.blue,0.05);rr(ctx,U.x,U.y,U.w,U.h,18);ctx.fill();ag_label(ctx,U.x+28,U.y+46,"Unity Catalog",{col:AG.blue});
    od_ucParts(ctx).forEach((r,i)=>{const on=o.parts?o.parts[i]:1;if(on<=0)return;ctx.save();ctx.globalAlpha*=ag_in(on,0,0.5);
      ag_box(ctx,r.x,r.y,r.w,r.h,r.h/2,{edge:AG.blue,edgeA:0.4+0.5*clamp(on,0,1)});ag_T(ctx,OD_UCP[i],r.x+r.w/2,r.y+r.h/2+10,{w:700,size:30,align:"center",col:AG.blue});ctx.restore();});
    ctx.restore();}
  ctx.restore();}
function od_ucParts(ctx){const U=OD_UC,ws=OD_UCP.map(s=>ag_tw(ctx,s,{w:700,size:30})+72),gap=(U.w-56-ws.reduce((p,q)=>p+q,0))/2;let x=U.x+28;return ws.map(w=>{const r={x,y:U.y+86,w,h:62};x+=w+gap;return r;});}

/* ---------------------------------------------------------------- a page of the platform
   A matte page with a bar along its top, naming the product in the module's blue: "Databricks · Genie One". o.a; o.dx, o.dy slide it;
   o.dim (0 to 1) it sinks back, behind another */
function od_page(ctx,x,y,w,h,bar,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(o.dx||0,o.dy||0);
  ag_box(ctx,x,y,w,h,22,{});ctx.save();rr(ctx,x,y,w,h,22);ctx.clip();ctx.fillStyle=rgba(AG.blue,0.09);ctx.fillRect(x,y,w,64);ctx.fillStyle=rgba(AG.blue,0.25);ctx.fillRect(x,y+64,w,1.5);ctx.restore();
  for(let i=0;i<3;i++){ctx.fillStyle=rgba(AG.mut,0.35);ctx.beginPath();ctx.arc(x+30+i*20,y+32,5,0,TAU);ctx.fill();}
  ag_T(ctx,bar,x+100,y+42,{w:700,size:28,col:AG.blue});
  if(o.dim>0){ctx.fillStyle="rgba(232,230,225,"+(0.55*o.dim)+")";rr(ctx,x,y,w,h,22);ctx.fill();}
  ctx.restore();}
// a speech bubble on a page: the question (right, pale) or the answer (left)
function od_bubble(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  ctx.fillStyle=o.ask?"rgba(86,92,100,0.08)":"rgba(255,255,255,0.75)";rr(ctx,x,y,w,h,20);ctx.fill();ctx.strokeStyle=o.ask?"rgba(86,92,100,0.22)":rgba(o.edge||AG.orange,0.5);ctx.lineWidth=1.8;rr(ctx,x,y,w,h,20);ctx.stroke();ctx.restore();}
// a chip: a small pill with a coloured edge, its words at 28 px; returns its width
function od_chip(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a,f={w:o.w||600,size:28,f:o.f},w=ag_tw(ctx,text,f)+(o.icon?72:40),h=48;if(a<=0)return w;ctx.save();ctx.globalAlpha*=a;
  ag_box(ctx,x,y,w,h,h/2,{edge:o.col||AG.blue,edgeA:0.75,lw:2});if(o.icon==="lock")ag_lock(ctx,x+34,y+h/2+4,26,rgba(o.col||AG.blue,1));else if(o.icon==="tick")ag_tick(ctx,x+34,y+h/2,22,rgba(o.col||AG.green,1),4);
  ag_T(ctx,text,x+(o.icon?60:20),y+h/2+10,Object.assign({},f,{col:o.tcol||AG.ink}));ctx.restore();return w;}

// Genie One: a question typed in, its answer, and where the answer's words come from. T: {q (0 to 1) typed, ans, chip, tag}
const OD_PG={x:240,y:222,w:1440,h:630};
function od_genieOne(ctx,T,o){o=o||{};const P=OD_PG,a=o.a==null?1:o.a;if(a<=0)return;od_page(ctx,P.x,P.y,P.w,P.h,"Databricks · Genie One",{a,dim:o.dim,dx:o.dx});ctx.save();ctx.globalAlpha*=a;ctx.translate(o.dx||0,0);
  if(o.dim>0)ctx.globalAlpha*=1-0.6*o.dim;
  const q="How many students did Health have on census day?",n=Math.round(q.length*clamp(T.q||0,0,1));
  if((T.q||0)>0){const qw=ag_tw(ctx,q,{w:600,size:30})+56;od_bubble(ctx,P.x+P.w-40-qw,P.y+110,qw,72,{ask:true});ag_T(ctx,q.slice(0,n),P.x+P.w-40-qw+28,P.y+156,{w:600,size:30});}
  const an=T.ans||0;if(an>0){ctx.save();ctx.globalAlpha*=ag_in(an,0,0.5);const by=P.y+230+(1-ag_eo(clamp(an,0,1)))*16;od_bubble(ctx,P.x+40,by,700,150,{});
    ag_model(ctx,P.x+88,by+52,24,{t:o.t||0,core:1});ag_T(ctx,"2,880",P.x+130,by+70,{w:800,size:48,col:AG.orange});
    ag_T(ctx,"students on census day",P.x+130+ag_tw(ctx,"2,880 ",{w:800,size:48}),by+70,{w:700,size:36});
    const ch=T.chip||0;if(ch>0)od_chip(ctx,P.x+130,by+90+(1-ag_spr(ch,0,0.5))*10,"census rule · Planning",{col:AG.orange,a:ag_in(ch,0,0.3)});ctx.restore();}
  const tg=T.tag||0;if(tg>0){const s="Meaning on the platform",f={w:500,size:28,f:"mono"},w=ag_tw(ctx,s,f)+48,x=P.x+P.w-40-w,y=P.y+P.h-90;ctx.save();ctx.globalAlpha*=ag_in(tg,0,0.5);
    ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(AG.mut,0.8);ctx.lineWidth=2.2;rr(ctx,x,y,w,56,12);ctx.stroke();ctx.setLineDash([]);ag_T(ctx,s,x+24,y+38,f);ctx.restore();}
  ctx.restore();}

// the Census day Genie Agent: its four parts down the left, each lit in turn, and what each holds. T: {top (title), tab [4] how lit
// each part is, data, instr, bench (0 to 1 the rows come in), sqlA (the chips "SQL answer"), good (0 to 3, each row marked Good),
// code (0 to 1, an answer with its code open)}
const OD_TABS=["Data","Instructions","Example query","Benchmarks"];
const OD_BENCH=[["Health's students on census day","2,880"],["Students in no faculty","31"],["All students on census day","18,412"]];
function od_genieAgent(ctx,T,o){o=o||{};const P=OD_PG,a=o.a==null?1:o.a;if(a<=0)return;od_page(ctx,P.x,P.y,P.w,P.h,"Databricks · Genie Agent",{a,dx:o.dx});ctx.save();ctx.globalAlpha*=a;ctx.translate(o.dx||0,0);
  const tp=T.top==null?1:T.top;if(tp>0){ctx.save();ctx.globalAlpha*=tp;ag_T(ctx,"Census day",P.x+40,P.y+132,{w:800,size:44});ag_T(ctx,"built by the data team",P.x+40,P.y+176,{w:600,size:28,col:AG.mut});ctx.restore();}
  ctx.fillStyle="rgba(60,50,40,0.12)";ctx.fillRect(P.x+330,P.y+214,1.5,P.h-244);
  OD_TABS.forEach((s,i)=>{const on=T.tab?T.tab[i]:0,y=P.y+262+i*70;if(on>0.02){ctx.save();ctx.globalAlpha*=on;ctx.fillStyle=rgba(AG.blue,0.1);rr(ctx,P.x+24,y-38,292,56,14);ctx.fill();ctx.fillStyle=rgba(AG.blue,0.9);rr(ctx,P.x+24,y-38,6,56,3);ctx.fill();ctx.restore();}
    ag_T(ctx,s,P.x+48,y,{w:700,size:30,col:on>0.5?AG.blue:AG.ink});});
  const cx=P.x+370,cw=P.w-410,cy=P.y+226;
  // Data: the governed table it reads, read only
  const d=T.data||0;if(d>0){ctx.save();ctx.globalAlpha*=ag_in(d,0,0.4)*(1-ag_in(d,1.5,0.5));const s="Students on census day · Planning's count",w=ag_tw(ctx,s,{w:700,size:30})+120;
    ag_box(ctx,cx,cy+(1-ag_eo(clamp(d,0,1)))*14,w,92,18,{edge:AG.blue,edgeA:0.6});ag_lock(ctx,cx+44,cy+52,30,rgba(AG.blue,1));ag_T(ctx,s,cx+84,cy+58,{w:700,size:30});ctx.restore();}
  // Instructions: the team's definition, in its own words
  const ins=T.instr||0;if(ins>0){ctx.save();ctx.globalAlpha*=ag_in(ins,0,0.4)*(1-ag_in(ins,1.5,0.5));const L=ag_wrap(ctx,"A student is a person, counted once, as their record stood on census day.",cw-120,{w:600,size:32});
    ag_box(ctx,cx,cy,cw,60+L.length*46,18,{});ctx.fillStyle=rgba(AG.violet,0.6);rr(ctx,cx+24,cy+24,6,L.length*46+12,3);ctx.fill();ag_lines(ctx,L,cx+56,cy+62,46,{w:600,size:32});ctx.restore();}
  // Benchmarks: the questions behind Health's three answers, each with its right answer and its SQL answer, marked Good
  const bn=T.bench||0;if(bn>0){ctx.save();ctx.globalAlpha*=1-ag_in(bn,1.5,0.5);OD_BENCH.forEach((r,i)=>{const k=clamp(Math.min(bn,1)*3-i,0,1);if(k<=0)return;const y=cy+i*112,e=ag_eo(k);
      ctx.save();ctx.globalAlpha*=ag_in(k,0,0.4);ctx.translate((1-e)*30,0);ag_box(ctx,cx,y,cw,92,18,{edge:(T.good||0)-i>0.5?AG.green:null,edgeA:0.7});
      ag_T(ctx,r[0],cx+28,y+58,{w:700,size:30});ag_T(ctx,r[1],cx+cw-420,y+58,{w:800,size:32,col:AG.orange,align:"right"});
      const sq=clamp((T.sqlA||0)*3-i,0,1);if(sq>0)od_chip(ctx,cx+cw-396,y+22,"SQL answer",{col:AG.blue,a:ag_in(sq,0,0.3),f:"mono",w:500});
      const g=clamp((T.good||0)-i,0,1);if(g>0){ctx.save();ctx.globalAlpha*=ag_in(g,0,0.25);const gk=ag_spr(g,0,0.4);ag_about(ctx,cx+cw-90,y+46,lerp(0.6,1,Math.min(1.1,gk)));
        ag_box(ctx,cx+cw-160,y+22,140,48,24,{edge:AG.green});ag_tick(ctx,cx+cw-130,y+46,20,rgba(AG.green,1),4);ag_T(ctx,"Good",cx+cw-106,y+56,{w:700,size:28,col:AG.green});ctx.restore();}
      else{ctx.setLineDash([6,6]);ctx.strokeStyle=rgba(AG.mut,0.5);ctx.lineWidth=2;rr(ctx,cx+cw-160,y+22,140,48,24);ctx.stroke();ctx.setLineDash([]);}
      ctx.restore();});ctx.restore();}
  // an answer, with its code open
  const cd=T.code||0;if(cd>0){ctx.save();ctx.globalAlpha*=ag_in(cd,0,0.4);const y=cy+(1-ag_eo(clamp(cd,0,1)))*16;ag_box(ctx,cx,y,cw,340,18,{edge:AG.orange,edgeA:0.5});
    ag_model(ctx,cx+50,y+56,24,{t:o.t||0,core:1});ag_T(ctx,"2,880",cx+90,y+74,{w:800,size:48,col:AG.orange});ag_T(ctx,"Health's students on census day",cx+90+ag_tw(ctx,"2,880 ",{w:800,size:48}),y+74,{w:700,size:32});
    const op=clamp(cd*2-0.6,0,1);ag_T(ctx,"Show code",cx+40,y+150,{w:700,size:28,col:AG.blue});ag_arrowHead(ctx,cx+40+ag_tw(ctx,"Show code",{w:700,size:28})+20,y+140,lerp(0,Math.PI/2,ag_sine(op)),9,rgba(AG.blue,1));
    if(op>0){ctx.save();ctx.globalAlpha*=op;ctx.fillStyle="rgba(46,47,52,0.06)";rr(ctx,cx+28,y+174,cw-56,76,12);ctx.fill();
      ag_T(ctx,"select census_day_students('Faculty of Health')",cx+52,y+222,{w:500,size:30,f:"mono"});
      ag_T(ctx,"result",cx+52,y+300,{w:600,size:28,col:AG.mut});ag_T(ctx,"2,880",cx+52+ag_tw(ctx,"result ",{w:600,size:28}),y+300,{w:800,size:30,col:AG.orange});ctx.restore();}
    ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- the tool servers
   The platform runs them, in one panel of its own ("Databricks"), a card for each: its name and what it does, a socket on the card's
   left where an agent plugs in. od_tool: o.touch (0 to 1) lit blue; o.badge [text, a] a small grey pill at its right ("generally
   available", "preview"); o.plug (0 to 1) a plug in its socket, the open standard's; o.a; o.k (0 to 1) it slides in */
const OD_TOOLS=[["Databricks SQL","runs queries"],["Unity Catalog functions","a function as a tool"],["AI Search","searches documents"],["Genie One","ask it"],["Genie Agent","Census day"]];
const OD_TP={x:1200,y:206,w:656,h:640};
function od_toolBox(i,o){o=o||{};const h=o.h||94,p=o.pitch||110;return{x:o.x||1232,y:(o.y||286)+i*p,w:o.w||592,h};}
function od_toolPanel(ctx,a,o){o=o||{};od_page(ctx,OD_TP.x,OD_TP.y,OD_TP.w,OD_TP.h,"Databricks",{a});
  if(o.mcp>0)ag_pill(ctx,OD_TP.x+OD_TP.w-24-(ag_tw(ctx,"MCP · an open standard",{w:700,size:28})+56)/2,OD_TP.y+32,"MCP · an open standard",{size:28,col:AG.blue,a:ag_in(o.mcp,0,0.4)*(a==null?1:a)});}
// a plug in a card's socket: its head, two pins in the socket, and a short cable away to the left
function od_plug(ctx,x,y,a,col){if(a<=0)return;col=col||AG.blue;ctx.save();ctx.globalAlpha*=a;const e=ag_eo(clamp(a,0,1)),dx=(1-e)*-30;ctx.translate(dx,0);ctx.lineCap="round";
  ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(x-30,y);ctx.bezierCurveTo(x-60,y,x-62,y+34,x-92,y+40);ctx.stroke();
  ctx.fillStyle=rgba(col,1);rr(ctx,x-34,y-13,26,26,6);ctx.fill();ctx.fillStyle="#B8B2A6";ctx.fillRect(x-8,y-8,10,4);ctx.fillRect(x-8,y+4,10,4);ctx.restore();}
function od_tool(ctx,b,name,sub,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null){ctx.translate((1-ag_eo(clamp(o.k,0,1)))*80,0);ctx.globalAlpha*=ag_in(o.k,0,0.4);}
  const on=o.touch||0,cy=b.y+b.h/2;
  ag_box(ctx,b.x,b.y,b.w,b.h,18,{edge:AG.blue,edgeA:0.35+0.6*on,glow:on>0.05?AG.blue:null,glowA:on});
  ag_T(ctx,name,b.x+44,b.y+(sub?44:b.h/2+11),{w:700,size:30});if(sub)ag_T(ctx,sub,b.x+44,b.y+80,{w:500,size:28,col:AG.mut});
  // the socket, on the left edge, and a plug in it
  ctx.fillStyle="#2E2F34";rr(ctx,b.x-8,cy-12,16,24,5);ctx.fill();if(o.plug>0)od_plug(ctx,b.x-8,cy,o.plug);
  if(o.badge&&o.badge[1]>0){const s=o.badge[0],w=ag_tw(ctx,s,{w:600,size:28})+36,bx=b.x+b.w-w-18,by=cy-22;ctx.save();ctx.globalAlpha*=ag_in(o.badge[1],0,0.35);
    const e=ag_spr(o.badge[1],0,0.4);ag_about(ctx,bx+w/2,cy,lerp(0.7,1,Math.min(1.1,e)));ctx.fillStyle="rgba(236,234,230,1)";rr(ctx,bx,by,w,44,22);ctx.fill();ctx.strokeStyle=rgba(AG.mut,0.6);ctx.lineWidth=1.8;rr(ctx,bx,by,w,44,22);ctx.stroke();
    ag_T(ctx,s,bx+w/2,cy+10,{w:600,size:28,col:AG.mut,align:"center"});ctx.restore();}
  ctx.restore();}

// the census count, written once, as a function: its name, its comment (what an agent reads as the tool's description), and the
// marks of its review and approval. o.k springs it in; o.rev, o.app (0 to 1) the marks; o.glow (0 to 1) it's being called
const OD_FN={x:96,y:236,w:720};
function od_fnCard(ctx,o){o=o||{};const a=o.a==null?1:o.a,F=OD_FN;if(a<=0)return{x:F.x,y:F.y,w:F.w,h:0};
  const L=ag_wrap(ctx,"Students on census day in one faculty, each counted once, as their record stood that day",F.w-64,{w:500,size:28}),h=108+L.length*38+96;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,F.x+F.w/2,F.y+h/2,lerp(0.6,1,Math.min(1,ag_spr(o.k,0,0.5))));const gl=o.glow||0;
  ag_box(ctx,F.x,F.y,F.w,h,20,{edge:AG.blue,edgeA:0.7+0.25*gl,glow:gl>0.05?AG.blue:null,glowA:gl});
  ag_T(ctx,"census_day_students(faculty)",F.x+32,F.y+58,{w:500,size:34,f:"mono",col:AG.blue});ctx.fillStyle="rgba(60,50,40,0.14)";ctx.fillRect(F.x+28,F.y+80,F.w-56,1.5);
  ag_lines(ctx,L,F.x+32,F.y+122,38,{w:500,size:28,col:AG.mut});
  const my=F.y+h-62;if(o.rev>0)od_chip(ctx,F.x+32,my,"reviewed · Jun",{col:AG.mut,a:ag_in(o.rev,0,0.35)});
  if(o.app>0)od_chip(ctx,F.x+32+ag_tw(ctx,"reviewed · Jun",{w:600,size:28})+60,my,"approved · Noor",{col:AG.green,icon:"tick",tcol:AG.green,a:ag_in(o.app,0,0.35)});
  ctx.restore();return{x:F.x,y:F.y,w:F.w,h};}

/* ---------------------------------------------------------------- the census check agent */
// the nightly job: a plain step, blue, and its check against the census report. o.fail (0 to 1) the pill turns amber
function od_job(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const w=540;
  ag_box(ctx,x,y,w,100,20,{edge:AG.blue,edgeA:0.75});ag_T(ctx,"Census-day count · every night",x+30,y+60,{w:700,size:30});
  const f=o.fail||0,px=x+w/2,py=y+156;if(f<1)ag_verdict(ctx,px,py,"Matches the census report","pass",(o.pa==null?1:o.pa)*(1-ag_in(f,0,0.3)));
  if(f>0){ctx.save();const k=ag_spr(f,0,0.45);ag_about(ctx,px,py,lerp(0.8,1,Math.min(1.1,k)));ag_verdict(ctx,px,py,"Check failed · census report","fail",ag_in(f,0,0.3));ctx.restore();}
  ctx.restore();}
// an outlined card, dashed: a question nobody has answered yet ("Why?", "Whose reads?")
function od_ask(ctx,x,y,text,a,o){o=o||{};if(a<=0)return;const size=o.size||32,w=ag_tw(ctx,text,{w:700,size})+56,h=size+40;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,Math.min(1.1,ag_spr(o.k,0,0.45))));ctx.fillStyle="rgba(243,241,237,0.92)";rr(ctx,x,y,w,h,16);ctx.fill();
  ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(o.col||AG.mut,0.85);ctx.lineWidth=2.4;rr(ctx,x,y,w,h,16);ctx.stroke();ctx.setLineDash([]);ag_T(ctx,text,x+28,y+h/2+size*0.36,{w:700,size,col:o.col||AG.ink});ctx.restore();return w;}
// Agent Bricks: a bar over the agent, and the base it runs on, Agent Runtime
function od_bricks(ctx,x,y,w,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_box(ctx,x,y,w,62,16,{edge:AG.blue,edgeA:0.6});ctx.save();rr(ctx,x,y,w,62,16);ctx.clip();ctx.fillStyle=rgba(AG.blue,0.09);ctx.fillRect(x,y,w,62);ctx.restore();
  ag_T(ctx,"Databricks · Agent Bricks",x+w/2,y+41,{w:700,size:28,col:AG.blue,align:"center"});ctx.restore();}
function od_runtime(ctx,cx,y,w,a,o){o=o||{};if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(0,(1-ag_eo(clamp(o.u==null?1:o.u,0,1)))*30);ag_floorShadow(ctx,cx+AG.sdx*2,y+62,w*0.55,14,0.25);
  ag_soft(ctx,c=>ag_rect(c,cx-w/2,y,w,56,14),[214,210,202],[246,244,240],cx+w*0.2,y+8,w*0.6,"rgba(46,38,28,0.3)",12,0.6);
  ag_T(ctx,"Agent Runtime",cx,y+38,{w:700,size:28,align:"center",col:AG.ink});ctx.restore();}
// the trace: every step the agent takes, recorded, filling in as it takes them. o.n (0 to 4)
const OD_STEPS=["1 · SQL · count by faculty","2 · SQL · what changed","3 · AI Search · the census rule","4 · Note for Jun"];
function od_trace(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=600,h=300;ctx.save();ctx.globalAlpha*=a;ag_box(ctx,x,y,w,h,20,{});
  ag_T(ctx,"Trace",x+30,y+52,{w:800,size:32});ctx.fillStyle="rgba(60,50,40,0.14)";ctx.fillRect(x+26,y+72,w-52,1.5);
  OD_STEPS.forEach((s,i)=>{const k=clamp((o.n||0)-i,0,1);const yy=y+118+i*50;if(k<=0){ctx.fillStyle="rgba(86,92,100,0.12)";rr(ctx,x+30,yy-22,w-60,28,8);ctx.fill();return;}
    ctx.save();ctx.globalAlpha*=ag_in(k,0,0.35);ag_T(ctx,s,x+30,yy,{w:600,size:28,col:i===3?AG.violet:AG.ink});ctx.restore();});
  ctx.restore();}
// the evaluation: four past cases, and the three ways each answer is scored. o.rows (0 to 4), o.cols [3] (0 to 4 marks each)
const OD_CASES=[["Left out 37 who withdrew after census day","they still count: 18,412"],["Engineering and IT: 134 against 131","three counted twice"],
  ["Health: 2,160","load read as people"],["Health: 2,911","Health data counted in Health"]],OD_COLS=["judges","sums","Mei · Jun"];
const OD_EVAL={x:120,y:236,w:1680};
function od_eval(ctx,o){o=o||{};const a=o.a==null?1:o.a,E=OD_EVAL;if(a<=0)return;const h=150+4*100;ctx.save();ctx.globalAlpha*=a;ag_box(ctx,E.x,E.y,E.w,h,22,{});
  ag_T(ctx,"Evaluation",E.x+36,E.y+60,{w:800,size:36});const cx=[E.x+E.w-470,E.x+E.w-300,E.x+E.w-110];
  OD_COLS.forEach((s,i)=>ag_T(ctx,s,cx[i],E.y+60,{w:700,size:28,col:AG.mut,align:"center",a:o.colA?o.colA[i]:1}));
  ctx.fillStyle="rgba(60,50,40,0.14)";ctx.fillRect(E.x+30,E.y+90,E.w-60,1.5);
  OD_CASES.forEach((r,i)=>{const k=clamp((o.rows||0)-i,0,1),y=E.y+140+i*100;
    // o.ghost: the rows still to come, as faint outlines, so the card isn't empty while the cases are named
    const g=(o.ghost||0)*(1-ag_in(k,0,0.4));if(g>0){ctx.save();ctx.globalAlpha*=g;ctx.fillStyle="rgba(86,92,100,0.13)";rr(ctx,E.x+40,y-24,380,26,13);ctx.fill();rr(ctx,E.x+40,y+20,250,22,11);ctx.fill();
      cx.forEach(x=>{ctx.beginPath();ctx.arc(x,y+6,20,0,TAU);ctx.fill();});ctx.restore();}
    if(k<=0)return;ctx.save();ctx.globalAlpha*=ag_in(k,0,0.4);ctx.translate((1-ag_eo(k))*24,0);
    ag_T(ctx,r[0],E.x+40,y,{w:700,size:30});ag_T(ctx,r[1],E.x+40,y+40,{w:500,size:28,col:AG.mut});
    OD_COLS.forEach((c,j)=>{const m=clamp((o.cols?o.cols[j]:0)-i,0,1);const bad=j===2&&i===(o.amber==null?-1:o.amber);
      if(m<=0){ctx.fillStyle="rgba(86,92,100,0.12)";ctx.beginPath();ctx.arc(cx[j],y+6,20,0,TAU);ctx.fill();return;}
      ctx.save();ctx.globalAlpha*=ag_in(m,0,0.25);const s=lerp(0.6,1,Math.min(1.1,ag_spr(m,0,0.35)));ag_about(ctx,cx[j],y+6,s);
      ctx.fillStyle=bad?rgba(AG.amber,0.12):rgba(AG.green,0.12);ctx.beginPath();ctx.arc(cx[j],y+6,26,0,TAU);ctx.fill();
      if(bad)ag_warn(ctx,cx[j],y+6,30,rgba(AG.amber,1));else ag_tick(ctx,cx[j],y+6,26,rgba(AG.green,1),5);ctx.restore();});
    ctx.restore();});
  ctx.restore();}

/* ---------------------------------------------------------------- agents that write code */
// Sam's pipeline editor, with Genie Code beside it: three lines of the nightly load (the example project's, reflowed), and the
// panel: Genie Code, with Sam's rights, the team's skills, and the evidence behind a claim. T: {code, panel, rights, skills,
// using, claim, chip, res}
const OD_PIPE={x:520,y:236,w:1320,h:610};
const OD_SQL=["create or refresh streaming table","  student_system.learners (","  constraint has_an_id","    expect (student_id is not null)","    on violation drop row",")"];
const OD_SKILLS=["profile-a-source","draft-a-model","reconcile-and-diff"];
function od_pipeline(ctx,T,o){o=o||{};const P=OD_PIPE,a=o.a==null?1:o.a;if(a<=0)return;od_page(ctx,P.x,P.y,P.w,P.h,"Databricks · Lakeflow Pipelines Editor",{a});ctx.save();ctx.globalAlpha*=a;
  const cd=T.code==null?1:T.code;OD_SQL.forEach((l,i)=>{const k=clamp(cd*6-i,0,1);if(k>0)ag_T(ctx,l,P.x+36,P.y+120+i*44,{w:500,size:28,f:"mono",a:k,col:i===2||i===3||i===4?AG.blue:AG.ink});});
  const px=P.x+700,pw=P.w-728,pn=T.panel||0;if(pn>0){ctx.save();ctx.globalAlpha*=ag_in(pn,0,0.4);ctx.translate((1-ag_eo(clamp(pn,0,1)))*60,0);
    ctx.fillStyle="rgba(88,78,196,0.05)";rr(ctx,px,P.y+84,pw,P.h-104,18);ctx.fill();ctx.strokeStyle=rgba(AG.violet,0.35);ctx.lineWidth=1.8;rr(ctx,px,P.y+84,pw,P.h-104,18);ctx.stroke();
    ag_model(ctx,px+46,P.y+130,24,{t:o.t||0,core:1,think:T.think||0});ag_T(ctx,"Genie Code",px+76,P.y+141,{w:800,size:30});
    if(T.rights>0)od_chip(ctx,px+28,P.y+170,"with Sam's rights",{icon:"lock",col:AG.blue,a:ag_in(T.rights,0,0.35)});
    const sk=T.skills||0,us=T.using||0;
    if(sk>0&&us<0.45){ctx.save();ctx.globalAlpha*=ag_in(sk,0,0.4)*(1-clamp(us/0.45,0,1));ag_T(ctx,"Skills · the team's",px+28,P.y+284,{w:700,size:28,col:AG.violet});
      OD_SKILLS.forEach((s,i)=>{const k=clamp(sk*3-i,0,1);if(k>0)ag_T(ctx,s,px+28,P.y+336+i*46,{w:500,size:28,f:"mono",a:k});});ctx.restore();}
    if(us>0.5){ctx.save();ctx.globalAlpha*=ag_in(us,0.5,0.4);ag_T(ctx,"Using profile-a-source",px+28,P.y+284,{w:700,size:28,col:AG.violet});
      const cl=T.claim||0;if(cl>0){const L=ag_wrap(ctx,"4 of 42 current learning platform accounts have no student ID.",pw-80,{w:600,size:28});ctx.save();ctx.globalAlpha*=ag_in(cl,0,0.4);
        ag_box(ctx,px+20,P.y+306,pw-40,40+L.length*38,16,{edge:AG.orange,edgeA:0.6});ag_lines(ctx,L,px+44,P.y+352,38,{w:600,size:28});ctx.restore();}
      const yy=P.y+306+40+2*38+18;if(T.chip>0){ag_clip(ctx,px+40,yy+4,40,"#5E5A55");od_chip(ctx,px+72,yy,"profile_null_keys",{col:AG.orange,f:"mono",w:500,a:ag_in(T.chip,0,0.35)});}
      if(T.res>0){ctx.save();ctx.globalAlpha*=ag_in(T.res,0,0.4);ag_T(ctx,"learning_platform.users",px+40,yy+100,{w:500,size:28,f:"mono"});ag_T(ctx,"student_id · 42 · 4",px+40,yy+140,{w:500,size:28,f:"mono",col:AG.orange});ctx.restore();}
      ctx.restore();}
    ctx.restore();}
  ctx.restore();}
// a screen's own content, as the wide shot of chapter 6 sees it: Genie Code's panel with the team's skills (Sam's), or Jun's editor
// with the project's folders; each a few lines at 28 px
function od_skillsScreen(ctx,x,y,w,h,o){o=o||{};ctx.fillStyle="#F5F4F1";ctx.fillRect(x,y,w,h);ctx.fillStyle="rgba(88,78,196,0.08)";ctx.fillRect(x,y,w,52);
  ag_model(ctx,x+30,y+26,16,{t:o.t||0,core:1});ag_T(ctx,"Genie Code",x+56,y+36,{w:700,size:28});
  ag_T(ctx,"Skills · the team's",x+22,y+94,{w:700,size:28,col:AG.violet});OD_SKILLS.forEach((s,i)=>ag_T(ctx,s,x+22,y+138+i*36,{w:500,size:28,f:"mono"}));}
const OD_TREE=["AGENTS.md","skills/","models/","examples/"];
function od_editorScreen(ctx,x,y,w,h,o){o=o||{};ctx.fillStyle="#F5F4F1";ctx.fillRect(x,y,w,h);ctx.fillStyle="rgba(86,92,100,0.1)";ctx.fillRect(x,y,w,52);
  ag_T(ctx,"dbt project",x+22,y+36,{w:700,size:28});OD_TREE.forEach((s,i)=>{const k=o.tree==null?1:clamp(o.tree*4-i,0,1);if(k>0)ag_T(ctx,s,x+22,y+94+i*40,{w:500,size:28,f:"mono",a:k,col:s==="skills/"?AG.violet:AG.ink});});}
// a folder card on the wall: an icon and its name in mono; o.col its edge
function od_folderCard(ctx,x,y,name,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return 0;const f={w:o.mono===false?700:500,size:30,f:o.mono===false?null:"mono"},w=ag_tw(ctx,name,f)+108,h=78;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,Math.min(1.1,ag_spr(o.k,0,0.45))));ag_box(ctx,x,y,w,h,16,{edge:o.col||AG.violet,edgeA:0.6});
  const ix=x+26,iy=y+24;ctx.fillStyle=rgba(o.col||AG.violet,0.75);ctx.beginPath();ctx.moveTo(ix,iy);ctx.lineTo(ix+16,iy);ctx.lineTo(ix+22,iy+6);ctx.lineTo(ix+42,iy+6);ctx.lineTo(ix+42,iy+32);ctx.lineTo(ix,iy+32);ctx.closePath();ctx.fill();
  ag_T(ctx,name,x+84,y+h/2+10,Object.assign({},f,{col:AG.ink}));ctx.restore();return w;}
// a thread, violet (the model reading) or blue (a tool): a soft curve from p0 to p1, drawn on to u
function od_thread(ctx,p0,p1,u,col,o){o=o||{};if(u<=0.01)return;const dx=p1[0]-p0[0],dy=p1[1]-p0[1],p=[p0[0],p0[1],p0[0]+dx*0.15,p0[1]+dy*0.6+(o.bend||0),p1[0]-dx*0.15,p1[1]-dy*0.6+(o.bend||0),p1[0],p1[1]];
  ctx.save();ctx.globalAlpha*=o.a==null?1:o.a;ctx.lineCap="round";ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=o.lw||4;if(o.dash)ctx.setLineDash(o.dash);ag_bzPath(ctx,p,0,u);ctx.stroke();ctx.setLineDash([]);
  const e=ag_bz(p,u);ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(e[0],e[1],(o.lw||4)*1.4,0,TAU);ctx.fill();ctx.restore();return p;}
// a draft on a branch: who wrote it, and its marks. o.rev [text, a], o.app (0 to 1). 500 x 220
function od_draft(ctx,x,y,who,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=500,h=220;ctx.save();ctx.globalAlpha*=a;if(o.s!=null)ag_about(ctx,x+w/2,y+h/2,o.s);
  ag_box(ctx,x,y,w,h,20,{edge:o.app>0.5?AG.green:AG.blue,edgeA:o.app>0.5?0.8:0.45});ag_pen(ctx,x+40,y+46,30,rgba(AG.blue,1));ag_T(ctx,"draft",x+70,y+56,{w:800,size:32});
  ag_T(ctx,"by "+who,x+70+ag_tw(ctx,"draft ",{w:800,size:32}),y+56,{w:600,size:30,col:AG.mut});
  ctx.fillStyle="rgba(86,92,100,0.16)";rr(ctx,x+30,y+76,w*0.62,9,4.5);ctx.fill();
  if(o.rev&&o.rev[1]>0)od_chip(ctx,x+30,y+102,o.rev[0],{col:AG.mut,a:ag_in(o.rev[1],0,0.35)});
  if(o.app>0)od_chip(ctx,x+30,y+158,"approved · Noor",{col:AG.green,icon:"tick",tcol:AG.green,a:ag_in(o.app,0,0.35)});
  ctx.restore();}
