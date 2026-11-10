/* ===== Grants by design: the chapters =====
   Nine chapters. The opening story on a shore of the Galápagos (gdShore), from the late 1960s to 2025; then the university's side in
   the module's hall (gdHall), where the registrar's catalog is a room of glass on the right and the groups stand on the left; the end
   comes back to the islands. In the hall the camera never cuts: each chapter glides on from where the last one left it (ag_cutInto),
   what stays stays put and only what changes fades. Words that explain sit in the frame's own space (setScreen), never below y 890. */
DP_PEOPLE.push("mei","anil");

/* ---------------------------------------------------------------- 1. The plan for the islands */
// the chapter first, so the checks find which chapter each word belongs to; its pictures follow (functions are known before they run)
scene("islands",(ctx,S,t,sc)=>{const c=id=>sc.cues[id],B=sc.cues.breath;
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"gdShore",keys:[[0,980,600,1.06],[c("fear")-0.4,860,650,1.2],[c("lost")+0.2,1000,630,1.14],[c("change")+0.2,960,600,1.03]],push:0.02,d:2.0,draw:(x,tt)=>gd_islandsBefore(x,tt,sc)},
    {at:c("plan")-0.5,place:"gdShore",later:true,dis:0.6,keys:[[0,960,590,1.02],[c("guide")-0.6,900,640,1.12],[c("held")-0.2,960,600,1.03],[c("flamingos")-0.6,1560,690,1.62],[c("now")-0.4,960,600,1.03]],d:2.2,push:0.015,
      draw:(x,tt)=>{gd_islandsAfter(x,tt,sc);const nv=0.28*ag_in(tt,c("held"),14);if(nv>0){x.fillStyle=rgba([2,8,16],nv);x.fillRect(0,0,W,H);}}},
    {at:c("too")-0.5,place:"gdHall",dis:1.0,keys:[[0,1010,500,1.1]],push:0.02,draw:(x,tt)=>gd_preHall(x,tt,sc)}
  ]);
  gd_islandsCards(ctx,S,t,sc);
  if(t>B-0.2)dp_title(ctx,S,t,B,"Grants by design","Design the grants once, by area and role.","FILM 4 OF 8 · ONLY WHAT YOU MAY SEE");});

// the boats of the late 1960s, coming in one after another; then the ones that wait at anchor once the plan is made
const GD_BOATS=[[1480,604,0.5],[1700,630,0.62],[1180,616,0.55],[880,600,0.44],[1360,650,0.72]];
function gd_islandsBefore(x,tt,sc){const c=id=>sc.cues[id];
  // the boats: one far off, then more each year
  GD_BOATS.forEach(([bx,by,s],i)=>{const t0=i?c("boats")+0.2+i*0.6:-1,u=ag_eo(clamp((tt-t0)/4,0,1)),a=i?ag_in(tt,t0,0.8):1;gd_boat(x,lerp(bx+420,bx,u),by,s,{a,lamp:0.9});});
  // more boats to come, far off on the horizon, faint: thousands of visitors
  const fa=ag_io(tt,c("change")+0.2,c("plan")-1.0,0.8);if(fa>0){const R=ag_rnd(77);for(let i=0;i<12;i++){const bx=200+R()*1600,by=574+R()*22,s=0.22+R()*0.14;gd_boat(x,bx,by,s,{a:fa*ag_in(tt,c("change")+0.2+i*0.12,0.5)*0.75,lamp:0.6});}}
  // the animals, at home: sea lions on the landing rock, boobies on their nests, an iguana on a boulder
  gd_sealion(x,300,772,0.9,{lift:0.25+0.15*Math.sin(tt*0.7)});gd_sealion(x,470,784,0.72,{dir:-1});
  const gone=ag_in(tt,c("lost")+0.3,0.4);
  GD_NESTS.forEach(([nx,ny,s],i)=>{if(i===1){gd_booby(x,nx,ny,s,{a:1-gone,up:0.3});if(gone>0)gd_booby(x,nx,ny,s,{a:0,up:0});return;}gd_booby(x,nx,ny,s,{dir:nx>1000?-1:1,up:0.2+0.2*Math.sin(tt*0.5+i)});});
  if(gone>0){// the nest left empty, and the bird going for good
    x.save();x.fillStyle="rgba(150,150,140,0.35)";x.beginPath();x.ellipse(GD_NESTS[1][0],GD_NESTS[1][1]+1,24,5,0,0,TAU);x.fill();x.restore();
    const u=clamp((tt-c("lost")-0.3)/4.2,0,1);gd_flyer(x,lerp(930,1500,u),lerp(800,380,ag_eo(u)),lerp(1.0,0.5,u),tt*9,{a:1-ag_in(tt,c("lost")+3.4,1.0)});}
  gd_iguana(x,1320,830,0.8,{});
  for(let i=0;i<4;i++)gd_flamingo(x,1560+i*72,736-(i%2)*6,0.55,{dir:i%2?-1:1,dip:0.5+0.5*Math.sin(tt*0.6+i*1.7)});
  // visitors, from the boats: anywhere on the shore, a step from the nests, wearing it down; one carries off coral
  const v0=c("fear")+0.4,ws=38,wa=ag_in(tt,v0,0.8)*(1-ag_in(tt,c("plan")-1.2,0.8));
  if(wa>0){const worn=ag_in(tt,c("harm")+0.3,2.4);
    GD_WANDER.forEach((P,i)=>{const t0=v0+i*0.9,d=Math.max(0,tt-t0)*ws;if(tt<t0)return;let tot=0;for(let k=1;k<P.length;k++)tot+=Math.hypot(P[k][0]-P[k-1][0],P[k][1]-P[k-1][1]);
      const u=Math.min(1,d/tot);gd_worn(x,P,u,worn*wa);const q=gd_walkAt(P,u);
      gd_walker(x,q.x,q.y,gd_depth(q.y),q.dist/11,{k:i,dir:q.dir,still:u>=1,a:wa*ag_in(tt,t0,0.5)});});
    // the coral: carried back to the landing from the water's edge
    const ct=wAt(sc,"harm","coral",-0.2),cu=clamp((tt-ct)/4.2,0,1),ca=wa*ag_in(tt,ct,0.5);
    if(ca>0){const cx=lerp(1000,600,cu),cy=lerp(786,792,cu),s=gd_depth(cy);gd_walker(x,cx,cy,s,(1000-cx)/11,{k:6,dir:-1,a:ca});gd_coral(x,cx-8*s,cy-40*s,1.5*s,ca);}}
}
// the trail's groups: each a guide in front and visitors behind, walking from the landing at t0
function gd_group_walk(x,tt,t0,n,o){o=o||{};if(tt<t0)return;const sp=0.026,u0=Math.min(0.96,(tt-t0)*sp+(o.u||0));
  for(let i=n;i>=0;i--){const u=u0-i*0.024;if(u<0)continue;const p=gd_along(u),s=gd_depth(p[1]);
    gd_walker(x,p[0]+(i%2?6:-6),p[1]+(i%2?5:-2),s,u*160,{guide:i===0,k:(i+(o.k||0))%8,dir:1,a:(o.a==null?1:o.a)*ag_in(tt,t0+i*0.35,0.6)});}}
function gd_islandsAfter(x,tt,sc){const c=id=>sc.cues[id];
  // night comes on over the years: the 1970s at dusk, 2025 by night
  // the boats at anchor, lamps lit; a new boat comes in to the landing
  for(const [bx,by,s] of [[1480,604,0.5],[1180,616,0.55],[880,600,0.44]])gd_boat(x,bx,by,s,{lamp:0.9});
  const nb=c("fits")-0.2,nu=ag_eo(clamp((tt-nb)/3.6,0,1));if(tt>nb-1)gd_boat(x,lerp(1100,700,nu),lerp(650,716,nu),lerp(0.6,0.9,nu),{a:ag_in(tt,nb-1,0.8),lamp:1});
  // most of the park closed, a few sites open along their trails
  gd_zones(x,clamp((tt-c("most")-0.2)/2.4,0,1));
  // the animals, all of them where they were
  gd_sealion(x,300,772,0.9,{lift:0.25+0.15*Math.sin(tt*0.7)});gd_sealion(x,470,784,0.72,{dir:-1});
  GD_NESTS.forEach(([nx,ny,s],i)=>gd_booby(x,nx,ny,s,{dir:nx>1000?-1:1,up:0.2+0.2*Math.sin(tt*0.5+i)}));gd_iguana(x,1320,830,0.8,{});
  // flamingos at the lagoon, and from 1982 nesting beside it
  for(let i=0;i<4;i++)gd_flamingo(x,1560+i*72,736-(i%2)*6,0.55,{dir:i%2?-1:1,dip:0.5+0.5*Math.sin(tt*0.6+i*1.7)});
  const na=ag_in(tt,c("flamingos")+0.4,1.0);for(let i=0;i<3;i++)gd_sitter(x,1500+i*120,768+(i%2)*8,0.6,{dir:i===1?-1:1,a:na*ag_in(tt,c("flamingos")+0.4+i*0.5,0.8)});
  gd_trail(x,ag_sine(clamp((tt-c("sites")-0.3)/3.0,0,1)),clamp((tt-c("sites")-0.3)/3.0,0,1));
  // every group with its guide, on the trail: the first, a new one off the new boat, and in 2025 more of them
  gd_group_walk(x,tt,c("guide")-0.3,5,{});
  gd_group_walk(x,tt,c("fits")+2.6,4,{k:3});
  gd_group_walk(x,tt,c("now")+0.2,5,{k:5,u:0.16});
}
// cards over the opening, in the frame's own space: where and when, the map, the plan, its rules, and what it gave
function gd_islandsCards(ctx,S,t,sc){const c=id=>sc.cues[id];setScreen(ctx,S);
  const ka=ag_io(t,0.6,c("anywhere")-0.4,0.6);if(ka>0)dp_kicker(ctx,"Opening story","The Galápagos, late 1960s",{a:ka});
  const mp=gd_pop(t,c("far")+0.3,c("boats")+1.6);if(mp.a>0)gd_map(ctx,1240,96,600,330,{a:mp.a,k:mp.k,p:clamp((t-wAt(sc,"far","thousand",-0.3))/1.2,0,1)});
  const pc=gd_pop(t,c("plan")+0.4,c("sites")-0.4);if(pc.a>0)dp_card(ctx,72,96,900,{kick:"The plan",title:"The visits planned once, for the whole park",sub:"Galápagos National Park, on the Charles Darwin Research Station's advice"},{a:pc.a,k:pc.k});
  const R=[["Keep to the trail","keep"],["Touch nothing","touch"],["Feed nothing","feed"],["Take nothing","take"]];
  R.forEach(([s,wd],i)=>{const a=ag_io(t,wAt(sc,"rules",wd,-0.15),c("held")-0.5,0.4);if(a>0)dp_slip(ctx,72,96+i*92,s,"cyan",{a,ink:true});});
  const yc=(t0,t1,kick,title,sub)=>{const p=gd_pop(t,t0,t1);if(p.a>0)dp_card(ctx,72,96,640,{kick,title,sub},{a:p.a,k:p.k});};
  yc(c("held")+0.3,c("flamingos")-0.5,"1982","25,000 visitors","The sites they walk near pristine");
  const fl=ag_io(t,c("flamingos")+1.2,c("now")-0.6,0.5);if(fl>0)dp_slip(ctx,72,96,"Flamingos nesting again, after 14 years","cyan",{a:fl,ink:true});
  yc(c("now")+0.3,c("too")-0.6,"2025","290,404 visitors","Still on the trails, still with a guide");
}
/* the university's data, in the hall, before its plan: visitors (groups, unnamed: three small heads on glass) and tables, each
   table opened on its own: one group given one table, one waiting, one reaching a table it shouldn't; then the plan, a shelf for each
   set of readers, the tables on them and a grant on each shelf; then a new person and a new table, which fit at once */
const GD_PT=[[860,300,"violet",0,0],[1040,300,"grey",1,0],[1220,300,"violet",0,1],[860,460,"grey",1,1],[1040,460,"violet",0,2],[1220,460,"grey",2,0]];
const GD_PS=[[800,250,"violet"],[800,410,"grey"],[800,570,"grey"]],GD_PG=[340,480,620];
function gd_preHall(x,tt,sc){const c=id=>sc.cues[id],so=c("so")+0.3,lay=ag_sine(clamp((tt-so)/1.8,0,1)),tf=c("fitsdata")+0.5,in0=c("too")+0.2;
  // the shelves of the plan: records, lists, and one nobody reads
  GD_PS.forEach(([sx,sy,col],i)=>{const a=ag_in(tt,so+i*0.2,0.6);if(a<=0)return;x.save();x.globalAlpha*=a;
    if(i===2)dp_frost(x,sx,sy,760,124,null,{col:"grey",r:16});else{rr(x,sx,sy,760,124,16);x.fillStyle="rgba(8,24,30,0.62)";x.fill();x.strokeStyle=rgba(mix([120,170,176],dp_f(col),0.75),0.95);x.lineWidth=2.2;x.stroke();}x.restore();});
  // the tables: where each stood, opened on its own, and where the plan puts it
  GD_PT.forEach(([tx,ty,col,sh,k],i)=>{const dx=840+k*170,dy=GD_PS[sh][1]+25,px=lerp(tx,dx,lay),py=lerp(ty,dy,lay),
      one=i===1?ag_in(tt,wAt(sc,"opened","one",0.5),0.4):0,bad=i===4?ag_in(tt,wAt(sc,"opened","shouldn't",0.2),0.4):0,read=sh<2?ag_in(tt,so+2.2,0.6):0;
    gd_table(x,px,py,140,74,{col,a:ag_in(tt,in0+i*0.12,0.5),rows:Math.max(lerp(Math.max(one,bad),0,lay),read),dark:sh===2?0.6*lay:0});});
  // a new table on the shelf of records, read from its first minute
  const nt=ag_in(tt,tf,0.5);if(nt>0)gd_table(x,1350,lerp(215,275,ag_eo(clamp((tt-tf)/0.8,0,1))),140,74,{col:"violet",a:nt,rows:ag_in(tt,tf+0.7,0.4)});
  // the visitors
  GD_PG.forEach((y,i)=>gd_group(x,420,y,"",{a:ag_in(tt,in0+0.3+i*0.2,0.5),lit:i===0?ag_in(tt,wAt(sc,"opened","one",0.3),0.4):0}));
  // a new person joins a group, and reads what it reads at once
  const np=clamp((tt-tf-0.2)/1.0,0,1);if(np>0&&np<1){x.save();x.globalAlpha*=1-ag_in(np,0.75,0.25);x.translate(lerp(300,470,ag_sine(np)),lerp(760,620,ag_sine(np)));x.scale(0.34,0.34);dp_personPic(x,0,0,"cyan");x.restore();}
  // one table at a time: a grant to one table; a group that waits; one that reaches a table it shouldn't
  const pre=1-ag_in(tt,so,0.5),R0=[528,340],R1=[528,480],R2=[528,620];
  if(pre>0){gd_grant(x,R0,[1040,337],clamp((tt-wAt(sc,"opened","one",0.3))/0.9,0,1),{a:pre});
    const wt=ag_in(tt,wAt(sc,"opened","wait",-0.2),0.4)*pre;if(wt>0){x.save();x.globalAlpha*=wt;x.strokeStyle=rgba(DP.T.mut,0.95);x.lineWidth=3;x.lineCap="round";
      const cx=576,cy=480;x.beginPath();x.arc(cx,cy,18,0,TAU);x.stroke();const an=tt*1.4;x.beginPath();x.moveTo(cx,cy);x.lineTo(cx,cy-11);x.moveTo(cx,cy);x.lineTo(cx+Math.cos(an)*13,cy+Math.sin(an)*13);x.stroke();x.restore();}
    gd_grant(x,R2,[1040,497],clamp((tt-wAt(sc,"opened","shouldn't",0.0))/0.9,0,1),{a:pre,col:"coral"});}
  // the plan: a grant on each shelf, never on one table
  const g=(from,to,t0)=>gd_grant(x,from,to,clamp((tt-t0)/0.9,0,1));
  if(tt>so+1.2){g(R0,[798,300],so+1.2);g(R1,[798,326],so+1.5);g(R1,[798,460],so+1.8);g(R2,[798,486],so+2.1);}
}


/* ---------------------------------------------------------------- 2. One table at a time */
scene("one",(ctx,S,t,sc)=>{const c=id=>sc.cues[id];
  const T={g:wAt(sc,"giuc","groups",-0.3),hand:c("hand")+0.4,count:c("count")+0.2,n58:wAt(sc,"count","Fifty-eight",-0.1),n163:wAt(sc,"count","hundred",-0.2),
    wait:wAt(sc,"wait","new",-0.2),own:wAt(sc,"owned","nine",-0.2),left:wAt(sc,"owned","left",-0.3),say:c("say")-0.2,move:c("move")+0.3,mei:c("mei")-0.2};
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"gdHall",later:true,keys:[[0,1000,520,1.0]],push:0.015,draw:(x,tt)=>gd_one(x,tt,sc,T)}]);
  setScreen(ctx,S);gd_kick(ctx,S,t,"Grants by design","One table at a time",0.7,5.6);
  const uc=ag_io(t,0.9,T.say,0.5);if(uc>0)dp_page(ctx,72,214,470,76,{tool:"databricks",name:"Unity Catalog",a:uc});
  const n1=ag_io(t,T.n58,T.say+0.4,0.4),n2=ag_io(t,T.n163,T.say+0.4,0.4);if(n1>0)dp_tag(ctx,1180,64,"58 tables","grey",{a:n1});if(n2>0)dp_tag(ctx,1440,64,"163 grants","green",{a:n2});});
// the old catalog's moments: its tables, the groups, a grant at a time, the owners, the list of grants, and the move into the area catalogs
const GD_OG=[["registrar_office",380],["data_team",490],["planning_learner_readers",600]];
// the grants made by hand: [group, table], the first few slowly, then the rest
const GD_HAND=(()=>{const R=ag_rnd(163),L=[[0,4],[2,30],[0,11],[1,45],[0,19],[2,8],[1,26],[0,40],[2,52],[1,14]];while(L.length<64)L.push([Math.floor(R()*3),Math.floor(R()*57)]);return L;})();
function gd_one(x,tt,sc,T){const c=id=>sc.cues[id],out=ag_in(tt,T.move,0.6),ua=ag_in(tt,0.6,1.0)*(1-out);
  gd_oldCatalog(x,{a:ua});
  // the registrar's own catalog and the other areas', as the tables move in
  const ra=ag_in(tt,T.move+0.5,0.8);
  const land=(j)=>T.move+0.7+j*0.07+1.5,dest=[];for(const k of ["staging","intermediate","reference","core","published"])for(let j=0;j<GD_NT[k];j++)dest.push([k,j]);
  if(ra>0){const sh={};for(const k of GD_SHELF){sh[k]={label:0,tables:[]};}sh.support.a=0;
    dest.forEach(([k,j],n)=>{sh[k].tables[j]={a:ag_in(tt,land(n),0.25)};});
    gd_world(x,{room:{a:ra},sh});}
  const aa=ag_io(tt,T.move+0.8,T.mei,0.7);if(aa>0)gd_areaRooms(x,{a:aa,each:clamp((tt-T.move-0.8)*2.2,0,4)});
  // the grants, one table at a time: lines of light from a group to one table
  const la=1-ag_in(tt,T.move-0.4,0.6);
  if(la>0&&tt>T.hand)GD_HAND.forEach(([g,i],n)=>{const t0=n<10?T.hand+n*0.36:T.count+(n-10)*0.05,p=clamp((tt-t0)/(n<10?0.7:0.4),0,1);if(p<=0)return;const Tb=GD_OLD[i];
    gd_grant(x,[GD_GX+gd_group(x,0,0,GD_OG[g][0],{measure:true}).w,GD_OG[g][1]],[Tb.x,Tb.y+19],p,{a:la*(n<10?1:0.42),lw:n<10?2.6:1.6,dot:n<10});});
  // the tables: 57 at first, the 58th new and dark, waiting for its first reader; then, from the move, flying to their catalogs
  GD_OLD.forEach((Tb,i)=>{const a0=i===GD_NEW?ag_in(tt,T.wait,0.5):ag_in(tt,0.9+i*0.018,0.4);if(a0<=0)return;
    const lit=i===GD_NEW?0:0.3+0.4*(GD_HAND.some(h=>h[1]===i)&&tt>T.hand?1:0);
    const di=dest.findIndex((d,n)=>n===i),ft=T.move+0.7+(di>=0?di*0.07:(i-20)*0.03),u=clamp((tt-ft)/1.5,0,1);
    if(u<=0){gd_oldTable(x,Tb,{a:a0,lit,dark:i===GD_NEW?1:0});return;}
    if(di>=0){if(u>=1)return;const [k,j]=dest[di],[dx,dy]=gd_tableXY(k,j),e=ag_sine(u);gd_oldTable(x,Tb,{a:a0,lit,at:[lerp(Tb.x,dx,e),lerp(Tb.y,dy,e)-Math.sin(Math.PI*e)*40,lerp(1,GD_TW/56,e)]});return;}
    const A=GD_AREAS[i%4],e=ag_sine(u);gd_oldTable(x,Tb,{a:a0*(1-ag_in(u,0.7,0.3)),lit,at:[lerp(Tb.x,A[1]+160,e),lerp(Tb.y,A[2]+90,e)-Math.sin(Math.PI*e)*60,lerp(1,0.5,e)]});});
  // its owners: nine tables owned by the person who made them, two of whom have left
  const oa=ag_in(tt,T.own,0.4)*(1-out);if(oa>0)GD_OLD.forEach((Tb,i)=>{if(!Tb.person)return;const k=[3,9,14,21,27,33,40,47,52].indexOf(i);gd_owner(x,Tb.x+50,Tb.y-4,oa*ag_in(tt,T.own+k*0.14,0.3),Tb.left?ag_in(tt,T.left,0.5):0);});
  // the groups that read it
  const ga=ag_in(tt,T.g,0.5)*(1-ag_in(tt,T.say-0.5,0.4));GD_OG.forEach(([k,y],i)=>gd_group(x,GD_GX,y,k,{a:ga*ag_in(tt,T.g+i*0.2,0.4),lit:0}));
  // the new table's wait: a clock beside it, and how long
  const wa=ag_io(tt,T.wait+0.4,T.say,0.4);if(wa>0){const Tb=GD_OLD[GD_NEW];x.save();x.globalAlpha*=wa;x.strokeStyle=rgba(DP.T.mut,0.95);x.lineWidth=3;x.lineCap="round";const cx=Tb.x+86,cy=Tb.y+19,an=tt*1.3;
    x.beginPath();x.arc(cx,cy,18,0,TAU);x.stroke();x.beginPath();x.moveTo(cx,cy);x.lineTo(cx,cy-11);x.moveTo(cx,cy);x.lineTo(cx+Math.cos(an)*13,cy+Math.sin(an)*13);x.stroke();x.restore();
    dp_slip(x,Tb.x-200,Tb.y+62,"6 days, on average, to its first reader","grey",{a:wa,ink:true});}
  // to say who could read what: every grant read, one after another
  const pa=ag_io(tt,T.say,T.move,0.5);if(pa>0){x.save();x.globalAlpha*=pa;dp_panel(x,72,330,520,500,{col:"cyan",r:18});
    dp_T(x,"Every grant, one by one",104,386,{w:700,size:30});x.save();rr(x,96,410,472,396,10);x.clip();const off=((tt-T.say)*46)%46;
    for(let r=0;r<10;r++){const ry=420+r*46-off,R=ag_rnd(r+Math.floor((tt-T.say)*46/46)*10);x.fillStyle=rgba(DP.T.mut,0.32);x.fillRect(112,ry+12,140+R()*90,8);x.fillStyle=rgba(dp_f("green"),0.5);x.fillRect(290,ry+12,70,8);x.fillStyle=rgba(DP.T.mut,0.22);x.fillRect(380,ry+12,120+R()*50,8);}
    x.fillStyle=rgba(dp_f("cyan"),0.18);x.fillRect(96,560,472,40);x.restore();x.restore();}
  // Mei, who owns the registrar's records, and asks for a plan first
  const ma=ag_in(tt,T.mei,0.8);if(ma>0){gd_whole(x,ma,c2=>dp_person(c2,"mei",360,700,0.95,{t:tt}));
    const k=gd_pop(tt,T.mei+0.5,null);dp_card(x,600,300,380,{kick:"Data owner",title:"Mei Tanaka",sub:"Registrar's office"},{a:k.a,k:k.k});
    const pl=ag_in(tt,wAt(sc,"mei","a plan",-0.1),0.5);if(pl>0)dp_slip(x,600,520,"A plan before any grant","cyan",{a:pl,ink:true});}
}

/* ---------------------------------------------------------------- 3. Three doors to a table */
scene("doors",(ctx,S,t,sc)=>{const c=id=>sc.cues[id];
  const T={tab:wAt(sc,"levels","a table",-0.2),sch:wAt(sc,"levels","a schema",-0.2),cat:wAt(sc,"levels","a catalog",-0.2),room:wAt(sc,"room","a room",-0.2),shelf:wAt(sc,"room","a shelf",-0.2),
    g:c("three")-0.2,d1:wAt(sc,"three","into the room",-0.2),d2:wAt(sc,"three","onto the shelf",-0.2),d3:wAt(sc,"three","into the table",-0.2),
    n1:wAt(sc,"names","Use catalog",-0.1),n2:wAt(sc,"names","use schema",-0.1),n3:wAt(sc,"names","select",-0.1),trail:c("trail")-0.2,
    alone:c("alone"),none:wAt(sc,"alone","opens nothing",-0.2),browse:c("browse")-0.3,bw:wAt(sc,"browse","browse",-0.3),find:c("find")-0.2};
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"gdHall",keys:[[0,1000,520,1.0],[T.tab-0.1,1290,590,1.45],[T.cat-0.2,980,540,1.0]],d:1.5,push:0.015,draw:(x,tt)=>gd_doorsDraw(x,tt,sc,T)}]);
  setScreen(ctx,S);gd_kick(ctx,S,t,"Grants by design","Three doors to a table",T.room+0.2,c("three")-0.6);
  // as on the islands: a landing, a trail and a site, numbered as the doors are
  const pc=gd_pop(t,T.trail,T.alone-0.3);if(pc.a>0){gd_postcard(ctx,80,130,560,{a:pc.a,k:pc.k,label:"A landing, a trail, a site",draw:c2=>{gd_zones(c2,1,{});gd_trail(c2,1,1);gd_group_walk(c2,sc.dur,0,4,{u:0.4});}});
    [[370,764],[1000,768],[1660,724]].forEach(([px,py],i)=>{const q=ag_in(t,T.trail+0.5+i*0.5,0.4)*pc.a;if(q<=0)return;const sx=80+px*560/W,sy=130+py*560/W-34;ctx.save();ctx.globalAlpha*=q;ctx.fillStyle=rgba(dp_f("green"),1);
      ctx.shadowColor=rgba(dp_f("green"),0.7);ctx.shadowBlur=10;ctx.beginPath();ctx.arc(sx,sy,18,0,TAU);ctx.fill();ctx.restore();dp_T(ctx,String(i+1),sx,sy+10,{w:800,size:28,align:"center",col:DP.on,a:q});});}
  // the table, found by anyone who may browse: what it holds and who owns it, and a way to ask; its rows stay frosted
  const fc=gd_pop(t,T.find,null);if(fc.a>0){ctx.save();ctx.globalAlpha*=fc.a;ag_about(ctx,390,330,lerp(0.6,1,fc.k));dp_panel(ctx,80,120,620,420,{col:"cyan",r:20});
    dp_T(ctx,"TABLE",112,170,{w:800,size:28,ls:4,col:"cyan"});dp_T(ctx,"core_learner_v1",112,218,{w:500,size:34,f:"mono"});
    dp_T(ctx,"What it holds",112,276,{w:600,size:28,col:"mut"});dp_T(ctx,"The registrar's learner records",112,314,{w:700,size:28});
    dp_T(ctx,"Owner",112,370,{w:600,size:28,col:"mut"});dp_T(ctx,"registrar_owners",112,408,{w:500,size:28,f:"mono"});
    dp_pill(ctx,112,488,"Request access","cyan",{a:ag_in(t,wAt(sc,"find","ask for it",-0.2),0.4)});ctx.restore();}});
function gd_doorsDraw(x,tt,sc,T){const c=id=>sc.cues[id];
  // the room as the last chapter left it, its shelves dimmed while one group finds its way to one table
  const dim=1-0.62*ag_in(tt,T.g,0.6)*(1-ag_in(tt,c("find")+2.8,1.0)),st={room:{a:1,lit:ag_io(tt,T.room,T.shelf+1.2,0.5)},sh:{},g:{},grants:[]};
  for(const k of GD_SHELF)st.sh[k]={label:k==="core"?1:0,dim:k==="core"?1:dim,rim:k==="core"?ag_in(tt,T.sch,0.5)*(1-ag_in(tt,T.cat,0.5))+ag_io(tt,T.shelf,T.shelf+1.5,0.4):ag_io(tt,T.shelf+0.1*GD_SHELF.indexOf(k),T.shelf+1.5,0.4)};
  st.sh.support.a=0;
  // the learner table: lit as the group reaches it, frosted again for those who may only look
  const open=ag_in(tt,T.n3+0.3,0.4)*(1-ag_in(tt,T.alone,0.4));st.sh.core.tables=[{},{lit:Math.max(open,0.15)},{},{}];
  gd_world(x,st);
  const tx=gd_tableXY("core",1);
  if(tt>T.tab-0.2){const la=ag_in(tt,T.tab,0.4);gd_label(x,"core_learner_v1",tx[0]+GD_TW/2,tx[1]-12,{align:"center",a:la});
    const tt1=ag_io(tt,T.tab+0.2,T.cat+0.6,0.4);if(tt1>0)dp_tag(x,tx[0]+GD_TW+26,tx[1]-8,"table","cyan",{a:tt1,size:28});
    const ts=ag_io(tt,T.sch,T.cat+0.6,0.4);if(ts>0)dp_tag(x,1130,gd_shelfY("core")+12,"schema","cyan",{a:ts,size:28});}
  // the demo's group: the registrar's office, then everyone in the account
  const g1=ag_in(tt,T.g,0.5)*(1-ag_in(tt,T.browse,0.4)),g2=ag_in(tt,T.browse+0.5,0.5),gy=GD_G["account users"];
  if(g1>0)gd_group(x,GD_GX,gy,"registrar_office",{a:g1,lit:open});
  if(g2>0)gd_group(x,GD_GX,gy,"account users",{a:g2});
  // the path in: through each door as it opens; with SELECT alone, it stops at the first
  const from=[GD_GX+gd_group(x,0,0,"registrar_office",{measure:true}).w,gy],P=[[GD_R.x-2,gy],[1214,gy],[1384,gy]];
  const reach=tt<T.alone?(tt<T.n1?0:tt<T.n2?1:tt<T.n3?2:3):(tt<T.none?0:0);
  const pp=clamp((tt-T.n1+0.1)/0.6,0,1)*(1-ag_in(tt,T.alone,0.3)),p2=clamp((tt-T.n2)/0.6,0,1),p3=clamp((tt-T.n3)/0.6,0,1);
  if(pp>0&&g1>0){gd_grant(x,from,P[0],pp,{a:g1,dot:false});if(p2>0)gd_grant(x,P[0],P[1],p2,{a:g1*(1-ag_in(tt,T.alone,0.3)),dot:false});if(p3>0)gd_grant(x,P[1],[tx[0],gy],p3,{a:g1*(1-ag_in(tt,T.alone,0.3))});}
  // SELECT alone: the line stops at the room's shut door
  const sa=clamp((tt-T.none+0.4)/0.7,0,1)*(1-ag_in(tt,T.browse,0.4));if(sa>0){gd_grant(x,from,[GD_R.x-30,gy],sa,{a:g1,col:"coral",dot:false});if(sa>=1)dp_cross(x,GD_R.x-56,gy-46,"coral",clamp((tt-T.none-0.3)/0.5,0,1));}
  // the doors, each opened by its right
  const dA=ag_in(tt,T.d1,0.4)*(1-ag_in(tt,c("find")+2.6,0.8));
  const o1=ag_in(tt,T.n1+0.4,0.3)*(1-ag_in(tt,T.alone,0.3)),o2=ag_in(tt,T.n2+0.4,0.3)*(1-ag_in(tt,T.alone,0.3)),o3=ag_in(tt,T.n3+0.4,0.3)*(1-ag_in(tt,T.alone,0.3));
  gd_doors(x,[[dA,o1],[ag_in(tt,T.d2,0.4)*dA,o2],[ag_in(tt,T.d3,0.4)*dA,o3]],ag_in(tt,T.d1,0.4)*(1-ag_in(tt,T.browse,0.4)));
  // the three rights, over the doors they open: USE CATALOG, USE SCHEMA, SELECT; SELECT stays without the other two
  const pY=gd_shelfY("core")-58,fade=1-ag_in(tt,T.alone,0.4),selA=ag_in(tt,T.n3,0.3)*(1-ag_in(tt,T.browse,0.4));
  dp_pill(x,GD_R.x-100,pY,"USE CATALOG","green",{a:ag_in(tt,T.n1,0.3)*fade,align:"center"});
  dp_pill(x,1214,pY,"USE SCHEMA","green",{a:ag_in(tt,T.n2,0.3)*fade,align:"center"});
  dp_pill(x,1438,pY,"SELECT","green",{a:selA,align:"center"});
  // BROWSE: on the catalog, a right to look; a dashed line to the room, the doors still shut
  const ba=ag_in(tt,T.bw,0.4)*(1-ag_in(tt,c("find")+2.6,0.8));if(ba>0){dp_pill(x,GD_R.x-100,pY,"BROWSE","green",{a:ba,align:"center"});
    gd_grant(x,[GD_GX+gd_group(x,0,0,"account users",{measure:true}).w,gy],GD_BROWSE,clamp((tt-T.bw-0.2)/0.7,0,1),{a:ba,dash:[10,9]});}
}

/* ---------------------------------------------------------------- 4. Shelves by who reads them */
scene("shelves",(ctx,S,t,sc)=>{const c=id=>sc.cues[id];
  const T={pc:c("start")+0.2,same:c("same")-0.1,stg:wAt(sc,"build","Staging",-0.1),int:wAt(sc,"build","intermediate",-0.1),core:wAt(sc,"core","Core",-0.1),ref:wAt(sc,"core","reference",-0.1),
    pub:wAt(sc,"core","published",-0.1),sup:wAt(sc,"support","support",-0.1),g:c("groups"),never:wAt(sc,"groups","never",-0.2),
    oc:wAt(sc,"office","core",-0.2),orf:wAt(sc,"office","reference",-0.2),oes:wAt(sc,"office","arrange",-0.2),hd:wAt(sc,"desk","help desk",-0.2),pl:wAt(sc,"desk","Planning",-0.2),
    pol:wAt(sc,"desk","policies",-0.2),team:c("team"),rule:wAt(sc,"rule","never",-0.3),mv:c("another")+0.3};
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"gdHall",keys:[[0,980,540,1.0]],push:0.015,draw:(x,tt)=>gd_shelvesDraw(x,tt,sc,T)}]);
  setScreen(ctx,S);gd_kick(ctx,S,t,"Grants by design","Shelves by who reads them",0.6,T.pc+0.2);
  const pc=gd_pop(t,T.pc+0.4,T.same);if(pc.a>0)gd_postcard(ctx,80,130,560,{a:pc.a,k:pc.k,label:"Where people may walk",draw:c2=>{gd_zones(c2,1,{});gd_trail(c2,1,1);}});});
function gd_shelvesDraw(x,tt,sc,T){const c=id=>sc.cues[id];
  // the room: its shelves named as the plan names them; support, the registrar's own, comes last
  const st={room:{a:1},sh:{},g:{},grants:[]},lab={staging:T.stg,intermediate:T.int,core:-1,reference:T.ref,published:T.pub,support:T.sup};
  for(const k of GD_SHELF)st.sh[k]={label:lab[k]<0?1:ag_in(tt,lab[k],0.4),rim:k==="core"?ag_io(tt,T.core,T.core+2.6,0.5):0};
  st.sh.support.a=ag_in(tt,T.sup,0.6);st.sh.core.lit=0.3;
  // a table that needs other readers: from reference to published
  const mv=clamp((tt-T.mv)/1.8,0,1),e=ag_sine(mv);if(mv>=1){st.sh.reference.n=3;st.sh.published.n=4;}
  else{st.sh.reference.tables=[{},{},{},{a:mv>0?0:1}];}
  // the groups, and the grants the plan gives them, each as it's said
  for(const k of Object.keys(GD_G))st.g[k]={a:k==="account users"?1:ag_in(tt,T.g+0.2+Object.keys(GD_G).indexOf(k)*0.15,0.5),lit:k==="data_team"?ag_io(tt,T.team,c("rule"),0.4):0};
  const add=(g,to,t0)=>{if(tt>t0)st.grants.push({g,to,p:clamp((tt-t0)/0.8,0,1)});};
  add("account users","published",T.pub+0.3);add("account users","browse",T.pub+0.6);
  add("registrar_office","reference",T.orf);add("registrar_office","core",T.oc);add("help_desk","core",T.hd);add("planning_learner_readers","core",T.pl);add("health_progress_study","core",T.pl+1.6);
  add("registrar_exam_support","support",T.oes);
  gd_world(x,st);
  if(mv>0&&mv<1){const [ax,ay]=gd_tableXY("reference",3),[bx,by]=gd_tableXY("published",3);gd_table(x,lerp(ax,bx,e)+Math.sin(Math.PI*e)*60,lerp(ay,by,e),GD_TW,GD_TH,{col:"grey",rows:0.3});}
  // the other areas: the same shelves in every catalog
  const aa=ag_io(tt,T.same,T.sup-0.4,0.6);if(aa>0)gd_areaRooms(x,{a:aa,each:clamp((tt-T.same)*2.4,0,4)});
  // never a person: a grant to one person, struck out
  const pa=ag_io(tt,T.never,T.never+2.2,0.3);if(pa>0){x.save();x.globalAlpha*=pa;x.translate(760,470);x.scale(0.55,0.55);dp_personPic(x,0,0,"cyan");x.restore();dp_cross(x,800,440,"coral",clamp((tt-T.never-0.2)/0.5,0,1)*pa);}
  // the policies decide what each reader of core sees
  const po=ag_io(tt,T.pol,c("team")+0.6,0.4);if(po>0)dp_tag(x,1520,gd_shelfY("core")+10,"policies","violet",{a:po,size:28});
  // the data team builds in development, so here it has nothing of its own
  const ta=ag_io(tt,T.team+0.4,c("rule")+0.2,0.4);if(ta>0)dp_slip(x,370,GD_G.data_team-35,"Builds in development, on made-up records","grey",{a:ta,ink:true,size:28});
  // never on one table: a grant made straight to a table is struck out
  const ra=ag_io(tt,T.rule,T.rule+2.4,0.3);if(ra>0){const [qx,qy]=gd_tableXY("core",2);gd_grant(x,gd_group(x,GD_GX,GD_G.health_progress_study,"health_progress_study",{measure:true}).r,[qx-4,qy+26],clamp((tt-T.rule)/0.8,0,1),{a:ra,col:"coral",dot:false});
    dp_cross(x,qx+GD_TW/2,qy-6,"coral",clamp((tt-T.rule-0.7)/0.5,0,1)*ra);}
}

/* ---------------------------------------------------------------- 5. A table built tomorrow */
scene("tomorrow",(ctx,S,t,sc)=>{const c=id=>sc.cues[id];
  const T={today:wAt(sc,"reach","today",-0.2),later:wAt(sc,"reach","made later",-0.2),v:c("version")+0.3,first:wAt(sc,"version","first minute",-0.3),asks:c("asks")-0.2,
    ex:c("exam")+0.3,only:wAt(sc,"exam","only those",-0.2),nd:wAt(sc,"never","help desk",-0.2),np:wAt(sc,"never","Planning",-0.2),ns:wAt(sc,"never","the study",-0.2),
    none:wAt(sc,"never","none of them",-0.2),boat:c("boat")-0.2};
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"gdHall",keys:[[0,980,540,1.0]],push:0.015,draw:(x,tt)=>gd_tomorrowDraw(x,tt,sc,T)}]);
  setScreen(ctx,S);gd_kick(ctx,S,t,"Grants by design","A table built tomorrow",0.6,T.v-0.4);
  const s1=ag_io(t,T.first,T.asks,0.4);if(s1>0)dp_slip(ctx,1040,40,"Read from its first minute","green",{a:s1});
  const s2=ag_io(t,T.asks+0.3,T.ex,0.4);if(s2>0)dp_slip(ctx,1040,40,"No request, no new grant","cyan",{a:s2,ink:true});
  const pc=gd_pop(t,T.boat,null);if(pc.a>0)gd_postcard(ctx,560,96,420,{a:pc.a,k:pc.k,label:"A new boat keeps the plan",draw:c2=>{gd_zones(c2,1,{});gd_trail(c2,1,1);
    const nb=ag_eo(clamp((t-T.boat)/2.6,0,1));gd_boat(c2,lerp(1300,700,nb),lerp(640,716,nb),0.9,{lamp:1});gd_group_walk(c2,t,T.boat+2.0,4,{k:2});}});});
function gd_tomorrowDraw(x,tt,sc,T){
  const st=gd_planState();
  // a grant on a shelf reaches every table on it, today's and tomorrow's
  const flow=k=>clamp((tt-T.today-k*0.3)/0.6,0,1)*(1-ag_in(tt,T.today+2.6,0.6));st.sh.core.tables=[0,1,2,3].map(k=>({lit:0.85+0.15*flow(k)}));
  st.sh.core.n=5;const nu=ag_eo(clamp((tt-T.v)/1.2,0,1));st.sh.core.tables[4]={a:ag_in(tt,T.v,0.4),dy:lerp(-120,0,nu),lit:ag_in(tt,T.first+0.2,0.5)};
  st.sh.support.n=1;const eu=ag_eo(clamp((tt-T.ex)/1.2,0,1));st.sh.support.tables=[{a:ag_in(tt,T.ex,0.4),dy:lerp(-120,0,eu),lit:ag_in(tt,T.only+0.3,0.5)}];
  st.sh.support.rim=ag_io(tt,T.only,T.only+2.4,0.5);
  gd_world(x,st);
  // tomorrow's place on the shelf, waiting
  const sl=ag_io(tt,T.later,T.v,0.4);if(sl>0){const [qx,qy]=gd_tableXY("core",4);x.save();x.globalAlpha*=sl*(0.6+0.4*Math.sin(tt*4));x.setLineDash([8,7]);x.strokeStyle=rgba(dp_f("violet"),0.9);x.lineWidth=2.2;rr(x,qx,qy,GD_TW,GD_TH,8);x.stroke();x.restore();}
  // the new tables' names
  const [vx,vy]=gd_tableXY("core",4);gd_label(x,"core_credential_v2",vx+GD_TW,vy-12,{align:"right",a:ag_in(tt,T.v+0.8,0.4)});
  const [ex,ey]=gd_tableXY("support",0);gd_label(x,"Exam support table",ex,ey-12,{mono:false,a:ag_in(tt,T.ex+0.8,0.4)});
  // the readers of core never reach it: their way to support is shut
  const ns=[["help_desk",T.nd],["planning_learner_readers",T.np],["health_progress_study",T.ns]];
  ns.forEach(([g,t0],i)=>{const a=ag_io(tt,t0,T.none+3.0,0.4);if(a<=0)return;const fr=gd_group(x,GD_GX,GD_G[g],g,{measure:true}).r;
    gd_grant(x,fr,[GD_SH.x-40,gd_shelfMid("support")-10+i*10],clamp((tt-t0)/0.8,0,1),{a:a*0.8,col:"coral",dash:[6,8],dot:false});});
  const nx=ag_io(tt,T.none,T.none+3.0,0.4);if(nx>0)dp_cross(x,GD_SH.x-62,gd_shelfMid("support"),"coral",clamp((tt-T.none)/0.5,0,1)*nx);
}

/* ---------------------------------------------------------------- 6. Owners who don't leave */
scene("owners",(ctx,S,t,sc)=>{const c=id=>sc.cues[id];
  const T={cat:wAt(sc,"any","catalog",-0.1),shelf:wAt(sc,"any","shelf",-0.1),table:wAt(sc,"any","table",-0.1),can:wAt(sc,"any","the owner",-0.2),even:wAt(sc,"any","even",-0.2),
    first:c("first")-0.1,gcat:wAt(sc,"group","catalog",-0.1),all:wAt(sc,"group","everything",-0.1),grp:wAt(sc,"group","a group",-0.2),ro:wAt(sc,"group","registrar owners",-0.2),
    none:c("member")-0.1,sp:wAt(sc,"member","registrar loader",-0.2),builds:wAt(sc,"member","builds",-0.1),deploys:wAt(sc,"member","deploys",-0.1),
    leaves:wAt(sc,"leaves","leaves",-0.2),ntab:wAt(sc,"leaves","no table",-0.2),nper:wAt(sc,"leaves","no one person",-0.2),
    mei:c("decides")-0.3,says:wAt(sc,"kinds","Mei says",-0.2),them:wAt(sc,"kinds","the group",-0.2)};
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"gdHall",keys:[[0,980,540,1.0]],push:0.015,draw:(x,tt)=>gd_ownersDraw(x,tt,sc,T)}]);
  setScreen(ctx,S);gd_kick(ctx,S,t,"Grants by design","Owners who don't leave",0.9,c("group")-0.4);});
function gd_ownersDraw(x,tt,sc,T){const c=id=>sc.cues[id];
  // the room as the plan left it; its readers step back, as this chapter is about who owns it
  const st=gd_laterState(),ga=1-ag_in(tt,0.3,0.6);for(const k in st.g)st.g[k].a=ga;
  gd_world(x,st);
  // who owns each thing: what made it, the job's identity (the gear); then, handed over, the group
  const ring=(t0)=>tt>t0&&tt<t0+0.9?(tt-t0)/0.9:0,grR=gd_group(x,GD_GX,300,"registrar_owners",{measure:true}).r;
  GD_CHIPS.forEach(([cx,cy,r],i)=>{const t0=i===0?T.cat:i===GD_CHIPS.length-1?T.table:T.shelf+(i-1)*0.08,a=ag_in(tt,t0,0.4);if(a<=0)return;
    // the handing over: a light from the group to each chip, which turns to the group's sign as it arrives
    const d0=T.grp+0.3+i*0.09,du=clamp((tt-d0)/0.9,0,1),u=ag_in(tt,d0+0.85,0.4);
    if(du>0&&du<1){const e=ag_sine(du),px=lerp(grR[0],cx,e),py=lerp(grR[1],cy,e)-Math.sin(Math.PI*e)*40;dp_halo(x,px,py,22,"cyan",0.6);x.save();x.fillStyle=rgba(mix(dp_f("cyan"),[255,255,255],0.5),1);x.beginPath();x.arc(px,py,4.5,0,TAU);x.fill();x.restore();}
    const rg=Math.max(ring(T.first+0.1),ring(i===0?T.gcat:T.all),ring(T.them+0.2)),rgG=ring(T.ntab+0.2);
    gd_chip(x,cx,cy,r,u,{a,ring:rgG||rg,ringCol:rgG?"green":"cyan"});});
  // the owner can do anything with it; whoever makes it owns it first
  const s1=ag_io(tt,T.can,c("group")-0.3,0.4),k1=gd_pop(tt,T.can,null).k;if(s1>0)dp_card(x,80,240,620,{kick:"Owner",title:"Can do anything with it"},{a:s1,k:k1});
  const s2=ag_io(tt,T.even,c("group")-0.3,0.4);if(s2>0)dp_slip(x,80,402,"Even let anyone read it","coral",{a:s2,ink:true});
  const s3=ag_io(tt,T.first,c("group")-0.3,0.4);if(s3>0)dp_slip(x,80,496,"Its first owner: whoever makes it","cyan",{a:s3,ink:true});
  // the group that owns it all, with no person in it: only registrar-loader
  const ga2=ag_io(tt,T.grp,T.mei-0.5,0.5);if(ga2>0)gd_group(x,GD_GX,300,"registrar_owners",{a:ga2,lit:ag_in(tt,T.ro,0.5)*(1-ag_in(tt,T.leaves,0.6))+ag_io(tt,T.ntab,T.ntab+1.6,0.4)});
  const np=ag_io(tt,T.none,T.leaves-0.6,0.4);if(np>0)dp_slip(x,grR[0]+28,265,"No person in it","cyan",{a:np,ink:true});
  const ba=ag_io(tt,T.sp,T.leaves-0.6,0.4),bk=gd_pop(tt,T.sp,null).k;if(ba>0){x.save();x.globalAlpha*=ba;ag_about(x,380,558,lerp(0.6,1,bk));
    dp_badge(x,80,372,600,372,{kind:"Service principal",pic:dp_gearPic,title:"registrar-loader",t:tt});
    dp_T(x,"Builds the tables",286,600,{w:600,size:28,col:"mut",a:ag_in(tt,T.builds,0.4)});dp_T(x,"Deploys the plan",286,644,{w:600,size:28,col:"mut",a:ag_in(tt,T.deploys,0.4)});x.restore();}
  // when someone leaves, every table keeps its owner, and no one person can open one up
  const pa=ag_in(tt,T.leaves,0.4)*(1-ag_in(tt,T.ntab+0.2,0.5));if(pa>0){const gone=ag_in(tt,T.leaves+0.5,0.5),dx=-60*ag_sine(clamp((tt-T.leaves-0.9)/1.2,0,1));
    x.save();x.globalAlpha*=pa;x.translate(260+dx,560);x.scale(0.9,0.9);dp_personPic(x,0,0,gone>0.5?"grey":"cyan");x.restore();
    if(gone>0){const cc=dp_f("coral");x.save();x.globalAlpha*=pa*gone;x.strokeStyle=rgba(cc,1);x.lineWidth=4;x.lineCap="round";x.shadowColor=rgba(cc,0.8);x.shadowBlur=8;
      x.beginPath();x.moveTo(214+dx,604);x.lineTo(214+dx+92*ag_sine(gone),604-110*ag_sine(gone));x.stroke();x.restore();}}
  const t1=ag_io(tt,T.ntab,T.mei-0.5,0.4);if(t1>0){x.save();x.globalAlpha*=t1;dp_tick(x,104,435,"green",clamp((tt-T.ntab-0.2)/0.5,0,1));x.restore();dp_slip(x,140,400,"No table left without its owner","green",{a:t1,ink:true});}
  const t2=ag_io(tt,T.nper,T.mei-0.5,0.4);if(t2>0){x.save();x.globalAlpha*=t2;dp_cross(x,104,529,"coral",clamp((tt-T.nper-0.2)/0.5,0,1));x.restore();dp_slip(x,140,494,"No one person can open one up","coral",{a:t2,ink:true});}
  // Mei decides who may see the records; the group is who may change them: two kinds of owner
  const ma=ag_in(tt,T.mei,0.8);if(ma>0){gd_whole(x,ma,c2=>dp_person(c2,"mei",360,700,0.95,{t:tt}));
    const k=gd_pop(tt,T.mei+0.5,null);gd_card(x,600,300,390,"Data owner","Mei Tanaka",[["Registrar's office",1-ag_in(tt,T.says,0.3)],["Says who may see them",ag_in(tt,T.says+0.35,0.4)]],{a:k.a,k:k.k});
    const k2=gd_pop(tt,T.them,null);if(k2.a>0)gd_card(x,600,520,390,"Catalog owner","registrar_owners",[["Who may change them",1]],{mono:true,a:k2.a,k:k2.k});}
}

/* ---------------------------------------------------------------- 7. Where it can be read from */
scene("where",(ctx,S,t,sc)=>{const c=id=>sc.cues[id];
  const T={own:wAt(sc,"bound","its own workspace",-0.2),grant:wAt(sc,"bound","a grant",-0.2),els:wAt(sc,"bound","anywhere else",-0.2),
    anil:c("study")-0.3,ws:wAt(sc,"study","a workspace",-0.2),dl:wAt(sc,"study","downloaded",-0.1),cp:wAt(sc,"study","copied out",-0.1),
    ro:c("readonly")+0.2,rd:wAt(sc,"readonly","read only",-0.2),
    reads:wAt(sc,"write","reads",-0.2),allow:wAt(sc,"write","grants allow",-0.3),never:wAt(sc,"write","never write",-0.2),what:wAt(sc,"write","whatever",-0.2),
    space:c("space")-0.1,hp:wAt(sc,"space","health progress",-0.2),made:wAt(sc,"space","made for",-0.2),del:wAt(sc,"space","deleted",-0.2),look:c("look")-0.2};
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"gdHall",keys:[[0,980,540,1.0]],push:0.015,draw:(x,tt)=>gd_whereDraw(x,tt,sc,T)}]);
  setScreen(ctx,S);gd_kick(ctx,S,t,"Grants by design","Where it can be read from",0.9,c("study")-0.8);
  // look, don't touch: the islands' trail, on a card over the shelves nobody reads
  const pc=gd_pop(t,T.look,null);if(pc.a>0)gd_postcard(ctx,1420,270,380,{a:pc.a,k:pc.k,label:"Look, don't touch",draw:c2=>{gd_zones(c2,1,{});gd_trail(c2,1,1);gd_group_walk(c2,t,T.look-4,4,{u:0.3});}});});
function gd_whereDraw(x,tt,sc,T){const c=id=>sc.cues[id];
  // the room as the last chapter left it; the learner table lit while the study reads it
  const st=gd_laterState();for(const k in st.g)st.g[k].a=0;
  const rd=ag_io(tt,T.reads,T.space,0.4);st.sh.core.tables[1]={lit:Math.max(0.85,rd)};st.sh.core.rim=ag_io(tt,T.allow,T.space,0.4);
  gd_world(x,st);
  if(rd>0){const [qx,qy]=gd_tableXY("core",1);dp_halo(x,qx+GD_TW/2,qy+GD_TH/2,90,"violet",0.35*rd);}
  // as far as its grants allow: support stays shut to it
  const lk=ag_io(tt,T.allow,T.allow+1.6,0.4);if(lk>0)dp_halo(x,1770,gd_shelfMid("support")-6,70,"violet",0.5*lk);
  // each catalog bound to its own workspace: production reads and writes; from test, a grant opens nothing
  const out=1-ag_in(tt,c("study")-0.7,0.5);
  const pw=ag_in(tt,T.own,0.5)*out;if(pw>0){gd_workspace(x,80,230,560,220,"production",{a:pw});gd_bridge(x,[640,340],[998,340],clamp((tt-T.own-0.3)/0.8,0,1),{a:pw});}
  const tw=ag_in(tt,T.grant-0.3,0.5)*out;if(tw>0){gd_workspace(x,80,490,560,220,"test",{a:tw});dp_pill(x,108,676,"SELECT","green",{a:tw*ag_in(tt,T.grant,0.4)});
    const p=clamp((tt-T.els)/0.8,0,1);if(p>0){gd_bridge(x,[640,600],[998,600],Math.min(p,0.62),{a:tw,col:"coral",ro:true});if(p>=0.62)dp_cross(x,862,600,"coral",clamp((tt-T.els-0.55)/0.5,0,1)*tw);}}
  // Anil's study works in a workspace of its own, studies: nothing downloaded or copied out
  const aa=ag_in(tt,T.anil,0.8);if(aa>0)gd_whole(x,aa,c2=>dp_person(c2,"anil",260,860,0.72,{t:tt}));
  const sw=gd_pop(tt,T.ws,null);if(sw.a>0){x.save();x.globalAlpha*=sw.a;ag_about(x,380,255,lerp(0.7,1,sw.k));gd_workspace(x,80,100,600,310,"studies",{});
    [["Downloads",T.dl],["Exports",T.cp],["Clipboard",T.cp+0.3]].forEach(([s,t0],i)=>dp_switch(x,108,236+i*60,1-ag_in(tt,t0,0.4),{label:s}));x.restore();}
  // the registrar's catalog, bound there too, read only: read from there, never written, whatever a grant says
  const ba=ag_in(tt,T.ro,0.4);if(ba>0){const p=clamp((tt-T.ro)/0.9,0,1),wr=clamp((tt-T.never)/0.8,0,1);
    gd_bridge(x,[680,265],[998,265],p,{a:ba,ro:true,cut:wr>=0.5?clamp((tt-T.never-0.4)/0.5,0,1):0});
    dp_pill(x,839,232,"Read only","green",{a:ba*ag_in(tt,T.rd,0.4),align:"center"});
    // what's read goes to the workspace; a write is stopped on the way
    const rp=clamp((tt-T.reads-0.3)/1.1,0,1);if(rp>0&&rp<1){const px=lerp(998,680,ag_sine(rp));dp_halo(x,px,260,26,"green",0.8);}
    if(wr>0&&wr<1){const px=lerp(680,839,ag_sine(Math.min(1,wr*1.25)));dp_halo(x,px,270,26,"coral",0.8*(1-ag_in(wr,0.8,0.2)));}
    const ma=ag_in(tt,T.what,0.4);if(ma>0){const w=dp_pill(x,839,352,"MODIFY","green",{a:ma*(1-0.45*ag_in(tt,T.what+0.6,0.4)),align:"center"});dp_cross(x,839+w/2+30,340,"coral",clamp((tt-T.what-0.6)/0.5,0,1)*ma);}}
  // what it makes goes in its own space, health progress: made for its agreement, deleted when it ends
  const ca=gd_pop(tt,T.space,null);if(ca.a>0){x.save();x.globalAlpha*=ca.a;ag_about(x,720,670,lerp(0.7,1,ca.k));
    gd_roomBox(x,{x:480,y:500,w:480,h:340,name:"studies"});
    const sy=610;x.save();rr(x,504,sy,432,84,14);x.fillStyle="rgba(8,24,30,0.62)";x.fill();const hl=ag_in(tt,T.hp,0.4);x.strokeStyle=rgba(mix([120,170,176],dp_f("violet"),0.35+0.65*hl),0.6+0.4*hl);x.lineWidth=1.8+0.8*hl;x.stroke();x.restore();
    dp_T(x,"health_progress",530,sy+52,{w:500,size:28,f:"mono"});
    const nu=ag_eo(clamp((tt-T.hp-0.3)/1.0,0,1));gd_table(x,840,sy+16+lerp(-90,0,nu),GD_TW,GD_TH,{col:"violet",a:ag_in(tt,T.hp+0.3,0.4),rows:ag_in(tt,T.hp+1.2,0.5)});
    dp_T(x,"Made for agreement 2026-14",508,746,{w:600,size:28,col:"mut",a:ag_in(tt,T.made,0.4)});
    dp_T(x,"Deleted when it ends",508,790,{w:600,size:28,col:"mut",a:ag_in(tt,T.del,0.4)});x.restore();
    gd_bridge(x,[600,412],[600,498],clamp((tt-T.space-0.4)/0.7,0,1),{a:ca.a});}
}

/* ---------------------------------------------------------------- 8. Written once, kept as code */
scene("code",(ctx,S,t,sc)=>{const c=id=>sc.cues[id];
  const T={files:wAt(sc,"files","two files",-0.2),job:wAt(sc,"files","the job's code",-0.2),lines:c("lines")-0.3,few:wAt(sc,"lines","a few lines",-0.2),
    team:wAt(sc,"yes","reviews",-0.3),yes:wAt(sc,"yes","change",-0.1),told:wAt(sc,"yes","told",-0.2),con:c("contract"),agr:wAt(sc,"contract","agreement's contract",-0.2),names:wAt(sc,"contract","names it",-0.2),
    pol:wAt(sc,"after","policies",-0.2),first:wAt(sc,"after","go in first",-0.2),grant:wAt(sc,"after","its grant",-0.2),unm:wAt(sc,"after","unmasked",-0.3),
    path:c("path"),test:wAt(sc,"path","test first",-0.2),ok:wAt(sc,"path","says yes",-0.2),
    hand:c("byhand")-0.2,nob:wAt(sc,"byhand","nobody",-0.2),only:wAt(sc,"byhand","only",-0.2),main:wAt(sc,"byhand","one member",-0.2),adm:c("admin")-0.1,sw:wAt(sc,"admin","switched on",-0.2)};
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"gdHall",keys:[[0,980,540,1.0]],push:0.015,draw:(x,tt)=>gd_codeDraw(x,tt,sc,T)}]);
  setScreen(ctx,S);gd_kick(ctx,S,t,"Grants by design","Written once, kept as code",0.6,1.8);});
// the plan's two files in GitHub, the registrar's folder of the platform's repository: [depth, name, folder]
const GD_TREE=[[0,"registrar",true],[1,"databricks.yml",false],[1,"resources",true],[2,"catalog.yml",false],[2,"schemas.yml",false],[2,"registrar_job.yml",false],[1,"src",true]];
function gd_codeDraw(x,tt,sc,T){const c=id=>sc.cues[id];
  // the room, its readers in the files now; the learner table masked by the study's policies before its grant reaches it
  const st=gd_laterState();for(const k in st.g)st.g[k].a=0;
  // the two shelves under the cards on the right let their names go as the first card comes, so no word shows through a card
  const ov=1-ag_in(tt,T.team+0.3,0.4);st.sh.staging.label=ov;st.sh.intermediate.label=ov;
  st.sh.core.rim=ag_io(tt,T.few+0.3,T.con,0.4);
  const ms=ag_io(tt,T.pol+0.4,T.path,0.5),rd=ag_io(tt,T.grant+0.6,T.path,0.4);st.sh.core.tables[1]={lit:Math.max(0.85,rd)};
  gd_world(x,st);
  if(ms>0){const [qx,qy]=gd_tableXY("core",1);dp_frost(x,qx+GD_TW*0.45,qy,GD_TW*0.55,GD_TH,null,{col:"violet",r:8,a:ms});dp_halo(x,qx+GD_TW/2,qy+GD_TH/2,80,"violet",0.3*ms*(1+ag_io(tt,T.unm,T.unm+1.2,0.3)));}
  // GitHub: the registrar's folder, then the file that names each shelf's readers
  const ga=gd_pop(tt,2.4,null).a*(1-ag_in(tt,T.hand-0.5,0.4));
  if(ga>0){x.save();x.globalAlpha*=ga;dp_page(x,60,100,900,772,{tool:"github",name:"GitHub",where:"uni-example/data-platform"});
    const ta=1-ag_in(tt,T.lines-0.3,0.3);if(ta>0){x.save();x.globalAlpha*=ta;dp_T(x,"registrar",92,234,{w:700,size:36});
      const hi=ag_in(tt,T.files,0.4),hj=0.45*ag_in(tt,T.job,0.4);gd_tree(x,100,320,GD_TREE.map((r,i)=>r.concat([i===3||i===4?hi:i===5||i===6?hj:0])),{});x.restore();}
    const fa=ag_in(tt,T.lines+0.1,0.4);if(fa>0){x.save();x.globalAlpha*=fa;dp_T(x,"resources/schemas.yml",92,234,{w:500,size:32,f:"mono"});
      // the files' code owner: the data team, who review the code (owners never review a pull request)
      const oa=ag_in(tt,T.team,0.4);if(oa>0){x.save();x.globalAlpha*=oa;dp_T(x,"Code owner",92,294,{w:600,size:28,col:"mut"});dp_T(x,"@uni-example/data-team",262,294,{w:500,size:28,f:"mono",col:"cyan"});x.restore();}
      x.fillStyle=rgba(DP.T.mut,0.35);x.fillRect(92,318,836,1.4);
      const sc4=ag_sine(clamp((tt-T.con-0.1)/1.2,0,1))*4*42,h1=ag_io(tt,T.few,T.con,0.4),h2=ag_io(tt,T.agr,T.path,0.4),h3=ag_io(tt,T.grant,T.path,0.4);
      gd_code_lines(x,104,370-sc4,GD_YAML,{lh:42,clip:[330,852],hi:h1>0?{from:2,to:11,a:h1,col:"cyan",w:820}:h2>0?{from:12,to:13+(h3>0.5?2:0),a:h2,col:"amber",w:820}:null});
      x.restore();
      // a few lines for each shelf: these are core's readers
      const lk=ag_io(tt,T.few+0.3,T.con,0.4);if(lk>0)dp_link(x,[904,606],[GD_SH.x-4,gd_shelfMid("core")],"cyan",clamp((tt-T.few-0.3)/0.6,0,1),{alpha:lk});}
    x.restore();}
  // the data team reviews each change; Mei, who decides who may see her records, is told what it touches
  const rv=gd_pop(tt,T.team+0.6,T.con-0.4);if(rv.a>0){gd_card(x,1040,236,780,"Review","Approved by the data team",[["Mei Tanaka is told what it touches",ag_in(tt,T.told,0.4)]],{a:rv.a,k:rv.k});x.save();x.globalAlpha*=rv.a;dp_tick(x,1764,290,"green",clamp((tt-T.yes-0.1)/0.6,0,1));x.restore();}
  // the study's grant, made from its agreement's contract, names it
  const cc=gd_pop(tt,T.agr,T.pol-0.6);if(cc.a>0){dp_card(x,1040,236,780,{kick:"Contract",title:"Data sharing agreement 2026-14",sub:"Until 30 June 2027"},{a:cc.a,k:cc.k,col:"amber"});
    const p=clamp((tt-T.names)/0.7,0,1);if(p>0)dp_link(x,[908,717],[1036,330],"amber",p,{alpha:cc.a});}
  // its policies first, then its grant: it never reads the table unmasked
  const s1=gd_pop(tt,T.pol,T.path-0.4);if(s1.a>0)gd_steps(x,1040,236,780,"In this order",[["The study's policies",{p:clamp((tt-T.first-0.1)/0.6,0,1)}],["Its grant",{p:clamp((tt-T.grant-0.6)/0.6,0,1),a:ag_in(tt,T.grant,0.4)}]],{a:s1.a,k:s1.k});
  // the path of From a branch to production
  const pa=gd_pop(tt,T.path+0.3,T.hand-0.4);if(pa.a>0)gd_steps(x,1040,236,780,"From a branch to production",[["Test",{p:clamp((tt-T.test-0.4)/0.6,0,1)}],["A release approver says yes",{p:clamp((tt-T.ok-0.2)/0.6,0,1)}],["Production",{p:clamp((tt-T.ok-0.9)/0.6,0,1)}]],{a:pa.a,k:pa.k});
  // nobody grants by hand: in Catalog Explorer, only the owners' group may, and its one member deploys only from main
  const da=gd_pop(tt,T.hand+0.1,null);if(da.a>0){x.save();x.globalAlpha*=da.a;ag_about(x,510,486,lerp(0.85,1,da.k));
    dp_page(x,60,100,900,772,{tool:"databricks",name:"Catalog Explorer",where:"registrar",title:"Permissions"});
    const gw=dp_pill(x,928,234,"Grant","grey",{a:0.55,align:"right"});dp_cross(x,928-gw-34,222,"coral",clamp((tt-T.nob-0.2)/0.5,0,1));
    dp_T(x,"Owner",92,302,{w:600,size:28,col:"mut"});gd_group(x,200,292,"registrar_owners",{});
    const m=s=>({mono:true,t:s});
    dp_rows(x,92,350,[{t:"Principal",w:470},{t:"Privilege",w:340}],[[m("account users"),"BROWSE"],[m("account users"),"USE CATALOG"],[m("registrar_office"),"USE CATALOG"],
      [m("registrar_exam_support"),"USE CATALOG"],[m("help_desk"),"USE CATALOG"],[m("planning_learner_readers"),"USE CATALOG"],[m("health_progress_study"),"USE CATALOG"]],{lh:58});x.restore();}
  const ob=gd_pop(tt,T.only,null);if(ob.a>0)gd_steps(x,1040,236,780,"Grants by hand",[["Only the owners' group can grant",{col:"cyan"}],["Its one member deploys only from main",{col:"cyan",a:ag_in(tt,T.main,0.4)}]],{a:ob.a,k:ob.k});
  // anything else: an admin account, switched on, approved and recorded
  const ad=gd_pop(tt,T.adm,null);if(ad.a>0){dp_card(x,1040,476,780,{kick:"Admin account",title:"Switched on, approved, recorded"},{a:ad.a,k:ad.k,col:"amber"});
    x.save();x.globalAlpha*=ad.a;dp_switch(x,1720,500,ag_in(tt,T.sw,0.5),{});x.restore();}
}

/* ---------------------------------------------------------------- 9. Back to the islands */
scene("back",(ctx,S,t,sc)=>{const c=id=>sc.cues[id],B=sc.cues.breath;
  const T={here:c("here")-0.6,ro:wAt(sc,"who","registrar's office",-0.2),st:wAt(sc,"who","the study",-0.2),agr:wAt(sc,"who","its agreement",-0.2),
    els:wAt(sc,"who","everyone else",-0.2),find:wAt(sc,"who","find",-0.2),ask:wAt(sc,"who","ask",-0.2),
    nt:wAt(sc,"every","new table",-0.2),np:wAt(sc,"every","new person",-0.2),fits:wAt(sc,"every","fits",-0.2),idea:c("idea")-0.2};
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"gdShore",keys:[[0,960,600,1.03],[3.2,900,640,1.1]],d:3.0,push:0.01,draw:(x,tt)=>gd_backShore(x,tt)},
    {at:T.here,place:"gdHall",dis:1.0,keys:[[0,980,540,1.0]],push:0.015,draw:(x,tt)=>gd_backHall(x,tt,sc,T)}]);
  setScreen(ctx,S);gd_kick(ctx,S,t,"Grants by design","Back to the islands",0.9,T.here-0.8);
  // the idea, once more, before the end card says it
  const ic=gd_pop(t,T.idea,B-0.6);if(ic.a>0)dp_card(ctx,480,40,960,{title:"Design the grants once, by area and role."},{a:ic.a,k:ic.k});
  if(t>B-0.2)dp_end(ctx,S,t,B,"Grants by design","Design the grants once, by area and role.","Film 4 of 8","Only what you may see");});
// the islands today, by night: the boats at anchor, the closed land under frost, the open trail, and every group on it with its guide
function gd_backShore(x,tt){
  for(const [bx,by,s] of [[1480,604,0.5],[1180,616,0.55],[880,600,0.44],[700,716,0.9]])gd_boat(x,bx,by,s,{lamp:1});
  gd_zones(x,1,{});
  gd_sealion(x,300,772,0.9,{lift:0.25+0.15*Math.sin(tt*0.7)});gd_sealion(x,470,784,0.72,{dir:-1});
  GD_NESTS.forEach(([nx,ny,s],i)=>gd_booby(x,nx,ny,s,{dir:nx>1000?-1:1,up:0.2+0.2*Math.sin(tt*0.5+i)}));gd_iguana(x,1320,830,0.8,{});
  for(let i=0;i<4;i++)gd_flamingo(x,1560+i*72,736-(i%2)*6,0.55,{dir:i%2?-1:1,dip:0.5+0.5*Math.sin(tt*0.6+i*1.7)});
  for(let i=0;i<3;i++)gd_sitter(x,1500+i*120,768+(i%2)*8,0.6,{dir:i===1?-1:1});
  gd_trail(x,1,1);
  gd_group_walk(x,tt,-6,5,{k:5,u:0.1});gd_group_walk(x,tt,-6,4,{k:2,u:0.5});
  x.fillStyle=rgba([2,8,16],0.28);x.fillRect(0,0,W,H);}
// the university's plan, the same: who reads what, said once more; a new table and a new person fit it from their first day
function gd_backHall(x,tt,sc,T){
  // under the end card, the room's words and panes fade, so none shows through it
  const end=1-ag_in(tt,sc.cues.breath-0.1,0.9);if(end<=0)return;x.save();x.globalAlpha*=end;
  const st=gd_laterState(),L={registrar_office:ag_io(tt,T.ro,T.st,0.4),health_progress_study:ag_io(tt,T.st,T.els,0.4),"account users":ag_io(tt,T.els,T.nt-0.3,0.4)},
    any=Math.max(...Object.values(L));
  for(const k in st.g){const l=L[k]||0;st.g[k]={a:lerp(1,0.5,any*(1-l)),lit:l};}
  st.grants.forEach(g=>{const l=L[g.g]||0;g.a=lerp(1,0.3,any*(1-l));});
  // a new table on published: everyone reads it at once
  st.sh.published.n=5;const nu=ag_eo(clamp((tt-T.nt)/1.2,0,1));st.sh.published.tables=[{},{},{},{},{a:ag_in(tt,T.nt,0.4),dy:lerp(-120,0,nu),lit:ag_in(tt,T.nt+1.0,0.5)}];
  st.sh.published.rim=ag_io(tt,T.nt+1.0,T.idea,0.5);
  // a new person in the registrar's office: reads what the office reads at once
  const pj=clamp((tt-T.np)/1.3,0,1),joined=ag_io(tt,T.np+1.2,T.idea,0.4);st.g.registrar_office.lit=Math.max(st.g.registrar_office.lit,joined);
  gd_world(x,st);
  // the study: only what its agreement allows; its policies hide the rest of the learner table
  const fr=ag_io(tt,T.agr,T.els+0.6,0.4);if(fr>0){const [qx,qy]=gd_tableXY("core",1);dp_frost(x,qx+GD_TW*0.45,qy,GD_TW*0.55,GD_TH,null,{col:"violet",r:8,a:fr});}
  if(pj>0&&pj<1){x.save();x.globalAlpha*=1-ag_in(pj,0.75,0.25);x.translate(lerp(40,112,ag_sine(pj)),lerp(380,GD_G.registrar_office+4,ag_sine(pj)));x.scale(0.34,0.34);dp_personPic(x,0,0,"cyan");x.restore();}
  x.restore();
}
ag_cutInto(["one","doors","shelves","tomorrow","owners","where","code"]);
