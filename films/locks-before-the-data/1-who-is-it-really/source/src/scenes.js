/* ===== Who is it, really?: the scenes, chapter by chapter =====
   Each chapter is a run of shots (ag_shots): a place painted once, a slow camera, and what's drawn live. Times come from the cues
   (c.<line>, when each line starts) and from the words of the lines (wAt), so the pictures stay with the voice. The opening story is
   told in the Warring States' places (wi_past.js); everything at the university happens in one hall (wiHall, wi_hall.js), where one
   moment leaves before the next comes in (later:true), and the chapters glide on from each other (ag_cutInto, at the end). */

const wi_once=(sc,k,f)=>sc["wi_"+k]||(sc["wi_"+k]=f());
// a chapter's kicker, on the frame (not in the place, where the camera would move it)
function wi_kick(ctx,S,top,title,a){if(a>0)wi_screen(ctx,S,q=>dp_kicker(q,top,title,{a}));}
// a tag (dp_tag's look) whose words are ice white: for coral, whose own words don't stand out 4.5 to 1 on every glass
function wi_tagInk(ctx,x,y,text,col,o){o=o||{};const size=o.size||30,w=dp_tw(ctx,text,{w:700,size})+44,h=size+32,a=o.a==null?1:o.a,hc=dp_f(col);if(a<=0)return w;
  ctx.save();ctx.globalAlpha*=a;dp_panel(ctx,x,y,w,h,{col,r:14,glowR:26,behind:o.behind});dp_T(ctx,text,x+22,y+h/2+size*0.36,{w:700,size});
  if(o.to){const [lx,ly]=o.to,inY=ly>=y&&ly<=y+h,sy=inY?y+h/2:(ly<y?y:y+h),sx=inY?(lx<x?x:x+w):Math.max(x+24,Math.min(x+w-24,lx)),p=o.p==null?1:o.p;
    const ex=lerp(sx,lx,p),ey=lerp(sy,ly,p);ctx.save();ctx.strokeStyle=rgba(hc,1);ctx.lineWidth=2.4;ctx.lineCap="round";ctx.shadowColor=rgba(hc,0.8);ctx.shadowBlur=8;
    ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(ex,ey);ctx.stroke();if(p>=1){ctx.fillStyle=rgba(mix(hc,[255,255,255],0.35),1);ctx.beginPath();ctx.arc(lx,ly,6,0,TAU);ctx.fill();}ctx.restore();}
  ctx.restore();return w;}
// a tag that comes in at t0 (and leaves at t1, if given), its line to what it names drawn on as it comes; coral ones in white words
function wi_tagAt(ctx,tt,t0,t1,x,y,text,col,to,o){const a=t1==null?ag_in(tt,t0,0.5):ag_io(tt,t0,t1,0.5);if(a<=0)return;
  (col==="coral"?wi_tagInk:dp_tag)(ctx,x,y,text,col,Object.assign({to,p:ag_sine((tt-t0-0.2)/0.5),a},o||{}));}
// a slip that comes in at t0 (and leaves at t1): grey and coral ones in white words, the others in their colour's
function wi_slipAt(ctx,tt,t0,t1,x,y,text,col,o){const a=t1==null?ag_in(tt,t0,0.5):ag_io(tt,t0,t1,0.5);if(a<=0)return;dp_slip(ctx,x,y,text,col,Object.assign({a,ink:col==="grey"||col==="coral"},o||{}));}
// the fires of the army at the border, and of the army round Handan
function wi_campfires(ctx,t,a){for(const [fx,fy] of WI_CAMPFIRES)wi_fire(ctx,fx,fy-4,0.72,t,a);}
function wi_siegefires(ctx,t,a){for(const [fx,fy] of WI_SIEGEFIRES)wi_fire(ctx,fx,fy,0.42,t,a);}
// a torch carried along a road P, at u (0 to 1), smaller where the road is further off
function wi_carry(ctx,P,u,t,a,k){const p=wi_along(P,u);wi_torch(ctx,p[0],p[1]-12,(k||1)*(0.35+0.75*p[2]/60),t,a);}
// an army marching by night: n torches in a column along P, its head at u, each d behind the one before (dir 1: behind is further
// along the road, so the column comes back down it; -1: behind is nearer its start)
function wi_march(ctx,P,u,n,d,dir,t,a){for(let i=0;i<n;i++){const v=u+dir*i*d;if(v<0||v>1)continue;wi_carry(ctx,P,v,t+i*0.37,a,0.75);}}
// a mark faded as one (wi_mark's p draws it on; this takes it away)
function wi_markA(ctx,x,y,kind,col,p,a){if(a<=0||p<=0)return;withA(ctx,a,()=>wi_mark(ctx,x,y,kind,col,p));}

/* ---------------------------------------------------------------- 1 · Two halves */
scene("halves",(ctx,S,t,sc)=>{const c=sc.cues,P=wi_once(sc,"P",()=>({armies:wAt(sc,"war","armies"),days:wAt(sc,"war","days from"),msg:wAt(sc,"travel","travel with"),
    lie:wAt(sc,"forged","a forged"),nobody:wAt(sc,"die","nobody gave"),brings:wAt(sc,"sees","the man who brings")}));
  const order=(q,h)=>wi_slips(q,h.near[0]+62,h.near[1]-56,0.9,{rot:-0.1});
  ag_shots(ctx,S,t,sc.dur,[
    // China, about 2,300 years ago: a capital, the road, and an army's camp on the border, days away; the king's orders go by messenger
    {at:0,place:"wiRoad",keys:[[0,960,560,1.06],[P.armies-0.3,1290,590,1.3],[P.days-0.1,960,560,1]],push:0.012,draw:(x,tt)=>{wi_campfires(x,tt);
      wi_kick(x,S,"Opening story","China, about 2,300 years ago",ag_io(tt,0.6,c.travel-0.5));
      wi_slipAt(x,tt,P.armies+0.4,c.travel-0.3,1310,500,"An army on the border","grey");
      wi_slipAt(x,tt,P.days+0.3,P.msg-0.1,960,690,"Days from the capital","grey",{align:"center"});
      wi_carry(x,WI_ROAD,ag_sine((tt-P.msg)/(c.raise+0.5-P.msg)),tt,ag_in(tt,P.msg-0.3,0.5),1.4);}},
    // the messenger reaches the camp with an order to raise troops, on bamboo slips; but anyone could bring one
    {at:c.raise-0.2,place:"wiNear",keys:[[c.raise-0.2,900,560,1.04]],push:0.03,draw:(x,tt)=>{
      dp_person(x,WI_P.messenger,560,650,0.9,{t:tt,light:"lamp",gaze:[3,0],pose:"hold",hold:order});
      wi_tagAt(x,tt,c.raise+0.5,null,820,712,"An order to raise troops","amber",[690,744]);
      wi_slipAt(x,tt,P.lie,null,820,600,"Who sent it?","cyan");}},
    // an army on the march for an order nobody gave, back down the road towards the capital
    {at:c.die-0.2,place:"wiRoad",keys:[[c.die-0.2,960,560,1]],push:0.02,draw:(x,tt)=>{wi_campfires(x,tt);
      wi_march(x,WI_ROAD,1-0.62*ag_sine((tt-c.die)/6.4),16,0.022,1,tt,ag_in(tt,c.die,0.6));
      wi_slipAt(x,tt,P.nobody,null,1000,590,"An order nobody gave","coral",{align:"center"});}},
    // and in his tent the commander sees only the man who brings it
    {at:c.sees-0.2,place:"wiTent",keys:[[c.sees-0.2,960,540,1],[c.change-0.2,900,530,1.07]],push:0,draw:(x,tt)=>{wi_lampGlow(x,tt,1010,470);
      dp_person(x,WI_P.commander,560,610,1,{t:tt,light:"lamp",gaze:[3,0]});
      dp_person(x,WI_P.messengerL,1340,630,0.96,{t:tt+1.7,flip:true,light:"lamp",gaze:[3,0],pose:"hold",hold:order});
      wi_tagAt(x,tt,P.brings,null,1180,250,"All he sees: the man who brings it","cyan",wi_head(1340,630,0.96,true));}}
  ]);});

/* ---------------------------------------------------------------- 2 · The match */
const WI_TA=[540,700],WI_TB=[1380,700],WI_TS=1.4;   // on the table: where the commander's half and the king's lie apart, and their size
// the tally parting: one tiger at m becomes two halves, the commander's (the left) sliding to a and then turning to face left, the
// king's (the right) to b; u from 0 (one tiger) to 1 (apart); seam lights the cut along its back. The turn comes once they are apart,
// so the two tails never meet halfway
function wi_part(ctx,m,a,b,s,u,o){o=o||{};const k=ag_sine(clamp(u/0.6,0,1)),turn=lerp(1,-1,ag_sine(clamp((u-0.55)/0.45,0,1)));
  if(u>0){ctx.save();ctx.translate(lerp(m[0],a[0],k),lerp(m[1],a[1],k));ctx.scale(turn>=0?Math.max(0.04,turn):Math.min(-0.04,turn),1);
    wi_tiger(ctx,0,0,s,{t:o.t,seam:o.seam});ctx.restore();}
  wi_tiger(ctx,lerp(m[0],b[0],k),lerp(m[1],b[1],k),s,{t:o.t,seam:o.seam});}
scene("match",(ctx,S,t,sc)=>{const c=sc.cues,P=wi_once(sc,"P",()=>({cut:wAt(sc,"tally","cut in two"),right:wAt(sc,"keeps","right half"),left:wAt(sc,"keeps","the commander takes"),
    fit:wAt(sc,"counts","fit together"),msgr:wAt(sc,"needn","the messenger"),match:wAt(sc,"needn","only the match"),carries:wAt(sc,"museum","carries"),
    forty:wAt(sc,"museum","forty characters"),must:wAt(sc,"fifty","the halves must match"),fire:wAt(sc,"beacon","a beacon fire"),far:wAt(sc,"power","however far"),
    read:wAt(sc,"order","read these records"),change:wAt(sc,"order","change that table"),proves:wAt(sc,"really","proves who sent it")}));
  ag_shots(ctx,S,t,sc.dur,[
    // the answer: a small bronze tiger, cut in two along its back; the king keeps the right half, the commander the left; an order to
    // raise troops comes with the king's half, and counts only if the halves fit; so the commander trusts the match, not the messenger
    {at:0,place:"wiTally",keys:[[0,960,560,1.05]],push:0.02,draw:(x,tt)=>{const fu=clamp((tt-P.fit+0.4)/2.2,0,1),ok=ag_in(tt,P.fit+1.5,0.6);
      if(fu<=0)wi_part(x,[960,700],WI_TA,WI_TB,WI_TS,clamp((tt-P.cut-1.4)/2.4,0,1),{t:tt,seam:ag_sine((tt-P.cut)/1.2)*(1-ag_in(tt,P.cut+2.4,0.6))});
      else wi_fit(x,WI_TA,WI_TB,WI_TS,fu,{t:tt,seam:ok,seamCol:"green",glow:ok});
      wi_tagAt(x,tt,P.right-0.3,c.counts-0.3,1010,420,"The king keeps the right half","cyan",[WI_TB[0]+10,620],{behind:false});
      wi_tagAt(x,tt,P.left,c.counts-0.3,260,420,"The commander takes the left","cyan",[WI_TA[0]-10,620],{behind:false});
      wi_slips(x,1790,690,0.75,{rot:0.08,a:ag_io(tt,c.counts+0.2,P.fit+1.0,0.5)});
      wi_tagAt(x,tt,c.counts+0.4,P.fit+1.0,1440,420,"An order to raise troops","amber",[1790,636]);
      dp_pill(x,WI_TB[0],452,"A match","green",{align:"center",a:ok});
      const na=ag_in(tt,c.needn,0.5);if(na>0)wi_list(x,110,300,640,{kick:"The commander trusts",a:na,rows:[["cross","The messenger",ag_sine((tt-P.msgr-0.2)/0.5)],
        ["tick","The match",ag_sine((tt-P.match-0.2)/0.5)]]});}},
    // one such tiger, today, in a museum in Xi'an: its rule inlaid along its flank in forty characters of gold
    {at:c.museum-0.2,place:"wiMuseum",cut:true,keys:[[c.museum-0.2,960,540,1],[P.carries-0.3,965,500,1.5],[c.fifty-1.4,960,540,1]],push:0.01,draw:(x,tt)=>{
      wi_tiger(x,965,547,0.9,{flip:true,t:tt,glow:0.6*ag_io(tt,P.forty,c.fifty+0.4,0.8)});
      wi_kick(x,S,"Today","A museum in Xi'an",ag_io(tt,c.museum+0.4,c.fifty-0.3));
      wi_slipAt(x,tt,P.carries+0.9,c.fifty-0.2,965,250,"Its rule, in 40 characters of gold","grey",{align:"center"});
      const ra=ag_in(tt,c.fifty+0.2,0.5);if(ra>0)wi_list(x,60,250,620,{kick:"The rule on its flank",a:ra,rows:[[null,"Fifty soldiers or more:"],
        ["tick","only when the halves match",ag_sine((tt-P.must-0.1)/0.5),"green",ag_in(tt,P.must-0.3,0.4)],
        ["dot","A beacon fire: act without it",ag_sine((tt-P.fire)/0.5),"amber",ag_in(tt,P.fire-0.2,0.4)]]});}},
    // the power to send soldiers stays with the king, however far the order travels
    {at:c.power-0.2,place:"wiRoad",keys:[[c.power-0.2,960,560,1]],push:0.02,draw:(x,tt)=>{wi_campfires(x,tt);
      dp_halo(x,555,440,300,"amber",0.42*ag_in(tt,c.power+0.2,0.8));
      wi_tagAt(x,tt,c.power+0.3,null,150,250,"The power stays with the king","amber",[555,440]);
      wi_carry(x,WI_ROAD,0.94*ag_sine((tt-P.far+0.3)/4.6),tt,ag_in(tt,P.far-0.5,0.5),1.4);}},
    // a request to a data platform is an order too, and should count only when it proves who sent it
    // (it all leaves under the title card, which comes in over it)
    {at:c.order-0.2,place:"wiHall",keys:[[c.order-0.2,960,540,1]],push:0.02,draw:(x,tt)=>withA(x,1-ag_in(tt,c.breath,0.6),()=>{const pa=ag_in(tt,c.order,0.6);
      wi_platform(x,1150,230,650,400,{a:pa});
      withA(x,pa,()=>{wi_tables(x,1182,326,1);dp_T(x,"Records and tables",1372,358,{w:600,size:30});});
      for(const [t0,y,s] of [[P.read,330,"Read these records"],[P.change,470,"Change that table"]]){
        wi_request(x,lerp(110,410,ag_eo((tt-t0)/1.2)),y,s,{a:ag_in(tt,t0,0.5)});
        wi_slipAt(x,tt,P.proves+(y>400?0.4:0),null,820,y,"Who sent it?","cyan");}})}
  ]);
  dp_title(ctx,S,t,c.breath,"Who is it, really?","Every request proves who it is","FILM 1 OF 9 · LOCKS BEFORE THE DATA");});

/* ---------------------------------------------------------------- 3 · Trusting nothing without proof */
const WI_IN=[[560,430,"person"],[820,560,"gear"],[1080,420,"person"],[1340,560,"person"]],WI_OUT=[[160,480,"person"],[1760,560,"person"]];
scene("trust",(ctx,S,t,sc)=>{const c=sc.cues,P=wi_once(sc,"P",()=>({job:wAt(sc,"two","a job"),loads:wAt(sc,"two","loads"),recs:wAt(sc,"two","the registrar's records"),
    tok:wAt(sc,"token","Jun Park's personal token"),isJun:wAt(sc,"token","the job is Jun"),net:wAt(sc,"open","open to the internet"),
    inside:wAt(sc,"wall","whoever was inside"),trusted:wAt(sc,"wall","was trusted"),pw:wAt(sc,"stolen","a stolen password"),inWall:wAt(sc,"stolen","inside the wall"),
    says:wAt(sc,"proves","says who it is"),prove:wAt(sc,"proves","and proves it"),may:wAt(sc,"proves","what that identity may do"),usual:wAt(sc,"proves","what's usual for it"),
    next:wAt(sc,"least","the next request"),noOne:wAt(sc,"zero","not trusting no one"),proof:wAt(sc,"zero","trusting nothing without proof")}));
  ag_shots(ctx,S,t,sc.dur,[
    // today, at the university: Sam runs the data platform; every night at two, a job loads the registrar's records onto it, signed in
    // with Jun's personal token, so to the platform the job is Jun; and its one workspace is open to the internet
    {at:0,place:"wiHall",later:true,keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{
      wi_kick(x,S,"Today","At the university",ag_io(tt,0.6,c.token-0.4));
      withA(x,ag_in(tt,0.6,0.7),()=>dp_person(x,"sam",330,615,0.95,{t:tt,gaze:[3,0]}));
      wi_tagAt(x,tt,c.sam+0.4,null,90,238,"Sam Okafor · runs the data platform","cyan",wi_head(330,615,0.95));
      wi_platform(x,1150,190,650,540,{a:ag_in(tt,c.sam+0.8,0.6),records:ag_in(tt,P.recs,0.5),signed:"Jun Park",signedP:(tt-P.isJun)/0.6,open:ag_in(tt,P.net-0.2,0.6),globe:[1862,360]});
      const ja=ag_in(tt,P.job-0.2,0.5);if(ja>0){wi_disc(x,840,400,WI_PIC.gear,{r:70,a:ja,k:ag_spr(tt,P.job-0.2)});dp_T(x,"Nightly load",840,302,{w:700,size:32,align:"center",a:ja});}
      wi_slipAt(x,tt,c.two+0.2,null,840,488,"Every night at 02:00","grey",{align:"center"});
      dp_link(x,[910,400],[1150,400],"cyan",ag_sine((tt-P.loads)/0.6));
      const ta=ag_in(tt,P.tok-0.2,0.5);if(ta>0)dp_sealed(x,576,600,560,"Jun Park's personal token",{sub:"Made 14 March 2024 · no end date",a:ta,behind:false});
      withA(x,ag_in(tt,P.isJun-0.2,0.4),()=>dp_link(x,[1136,640],[1186,430],"cyan",ag_sine((tt-P.isJun+0.2)/0.6)));}},
    // for years, security was a wall round the network, and whoever was inside it was trusted; a stolen password works inside as well
    // as out; so the platform trusts no request for where it comes from
    {at:c.wall-0.3,place:"wiHall",later:true,keys:[[c.wall-0.3,960,540,1]],push:0.02,draw:(x,tt)=>{const dim=ag_in(tt,c.where,0.8),ok=ag_in(tt,P.trusted,0.4)*(1-dim);
      wi_ring(x,330,250,1260,540,ag_sine((tt-c.wall)/1.6),{label:"A wall round the network",dash:dim>0.5,a:1-0.45*dim});
      WI_IN.forEach(([dx,dy,k],i)=>{const t0=c.wall+0.6+i*0.15;wi_disc(x,dx,dy,WI_PIC[k],{r:52,a:ag_in(tt,t0,0.5),k:ag_spr(tt,t0)});
        wi_markA(x,dx+44,dy-40,"tick","green",ag_sine((tt-P.trusted-i*0.1)/0.5),ok);});
      WI_OUT.forEach(([dx,dy,k],i)=>{const t0=c.wall+0.9+i*0.2;wi_disc(x,dx,dy,WI_PIC[k],{r:52,a:ag_in(tt,t0,0.5),k:ag_spr(tt,t0)});
        wi_markA(x,dx+44,dy-40,"cross","coral",ag_sine((tt-P.inside-i*0.1)/0.5),1-dim);});
      const sx=lerp(1700,600,ag_eo((tt-P.pw)/1.8));dp_sealed(x,sx,660,400,"A stolen password",{a:ag_in(tt,P.pw-0.2,0.4)});
      wi_markA(x,sx+372,668,"tick","green",ag_sine((tt-P.inWall)/0.5),1-dim);
      wi_tagAt(x,tt,P.inWall+0.4,null,1040,672,"Trusted, for being inside","coral");}},
    // each request says who it is, proves it, and is checked against what that identity may do and what's usual for it; it gets the
    // least it needs, and the next is checked again
    {at:c.proves-0.3,place:"wiHall",later:true,keys:[[c.proves-0.3,960,540,1]],push:0.02,draw:(x,tt)=>{const two=ag_in(tt,P.next,0.4);
      dp_badge(x,80,200,600,372,{kind:"Person",title:"Mei Tanaka",lines:[["Registrar's office"]],pic:(q,px,py)=>dp_personPic(q,px,py),t:tt,scan:(tt-P.says)/1.0,
        a:ag_in(tt,c.proves,0.5),mrz:"IDP<TANAKA<<MEI<<<<<<<<<<<<<<<<<<<0417"});
      wi_request(x,80,620,"Read the learner records",{a:ag_in(tt,c.proves+0.3,0.5)*(1-two)});
      wi_request(x,80,620,"Change that table",{a:two});
      const ROWS=["Says who it is","Proves it","May it do this?","Is it usual for it?"],T1=[P.says,P.prove,P.may,P.usual],la=ag_in(tt,c.proves+0.4,0.5);
      if(la>0){const b=wi_list(x,780,200,760,{kick:"Checked, every time",a:la,rows:ROWS.map(s=>["tick",s,0])});
        withA(x,la,()=>ROWS.forEach((s,i)=>{const my=b.y+62+42+i*60-10;
          wi_markA(x,b.x+48,my,"tick","green",ag_sine((tt-T1[i]-0.1)/0.5),1-two);
          wi_markA(x,b.x+48,my,i===2?"cross":"tick",i===2?"coral":"green",ag_sine((tt-P.next-0.6-i*0.4)/0.5),two);}));}
      dp_pill(x,1160,640,"Only the least it needs","green",{align:"center",a:ag_io(tt,c.least,P.next-0.1,0.4)});
      dp_pill(x,1160,640,"Not allowed","coral",{align:"center",a:ag_in(tt,P.next+1.8,0.4)});}},
    // this is zero trust: not trusting no one, but trusting nothing without proof
    {at:c.zero-0.3,place:"wiHall",later:true,keys:[[c.zero-0.3,960,540,1]],push:0.02,draw:(x,tt)=>{
      wi_list(x,500,330,920,{kick:"Zero trust",a:ag_in(tt,c.zero,0.5),k:ag_spr(tt,c.zero),size:36,lh:72,rows:[["cross","Not trusting no one",ag_sine((tt-P.noOne)/0.5),"coral"],
        ["tick","Trusting nothing without proof",ag_sine((tt-P.proof)/0.5),"green",ag_in(tt,P.proof-0.3,0.4)]]});}}
  ]);});

/* ---------------------------------------------------------------- 4 · Three kinds of who */
const WI_WHO=[380,1010,1600];   // where each kind of who stands: a person, a workload, an agent
scene("who",(ctx,S,t,sc)=>{const c=sc.cues,P=wi_once(sc,"P",()=>({mei:wAt(sc,"person","Mei Tanaka"),jun:wAt(sc,"person","or Jun"),keys:wAt(sc,"workload","with no one"),
    answers:wAt(sc,"own","a person who answers"),job:wAt(sc,"borrow","A job never"),agent:wAt(sc,"borrow","neither does an agent")}));
  ag_shots(ctx,S,t,sc.dur,[
    // three kinds of who: a person (Mei, or Jun), a workload (a job with no one at the keyboard), an agent (an AI assistant given a task)
    {at:0,place:"wiHall",later:true,keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{const T=[c.person,c.workload,c.agent];
      WI_WHO.forEach((wx,i)=>{wi_slot(x,wx,520,92,ag_in(tt,c.three+0.3+i*0.2,0.5)*(1-ag_in(tt,T[i],0.5)));
        dp_pill(x,wx,190,["A person","A workload","An agent"][i],"cyan",{align:"center",a:ag_in(tt,T[i],0.5)});});
      withA(x,ag_in(tt,P.jun-0.2,0.6),()=>dp_person(x,"jun",600,680,0.8,{t:tt+2.3,gaze:[3,0]}));
      withA(x,ag_in(tt,P.mei-0.3,0.6),()=>dp_person(x,"mei",210,670,0.82,{t:tt,gaze:[3,0]}));
      wi_tagAt(x,tt,P.mei,null,60,330,"Mei Tanaka","cyan",wi_head(210,670,0.82));
      wi_tagAt(x,tt,P.jun,null,540,330,"Jun Park","cyan",wi_head(600,680,0.8));
      const wa=ag_in(tt,c.workload+0.2,0.5);if(wa>0)wi_disc(x,WI_WHO[1],520,WI_PIC.gear,{r:92,a:wa,k:ag_spr(tt,c.workload+0.2)});
      wi_slipAt(x,tt,P.keys,null,WI_WHO[1],650,"No one at the keyboard","grey",{align:"center"});
      const aa=ag_in(tt,c.agent+0.2,0.5);if(aa>0)ag_model(x,WI_WHO[2],510,92,{t:tt,a:aa});
      wi_slipAt(x,tt,c.agent+0.8,null,WI_WHO[2],650,"An AI assistant, given a task","grey",{align:"center"});}},
    // each gets a name of its own, an identity, and a person who answers for it; a job never borrows a person's name, nor does an
    // agent (its own comes from AI agents in data work); then what each one does shows under its own name
    {at:c.own-0.3,place:"wiHall",later:true,keys:[[c.own-0.3,960,540,1]],push:0.02,draw:(x,tt)=>{
      [["Person","Mei Tanaka","Registrar's office","Answers: Mei",(q,px,py)=>dp_personPic(q,px,py),"IDP<TANAKA<<MEI<<<<<<<<<<<<<<<<<<<0417"],
       ["Workload","Its own name","A job or a service","Answers: its owner",(q,px,py)=>dp_gearPic(q,px,py),"WKL<ITS<OWN<NAME<<<<<<<<<<<<<<<<<0000"],
       ["Agent","Its own name","An AI assistant","Answers: its owner",(q,px,py)=>wi_agentPic(q,px,py),"AGT<ITS<OWN<NAME<<<<<<<<<<<<<<<<<0000"]].forEach(([kind,title,l1,l2,pic,mrz],i)=>{
        const bx=30+i*630,a=ag_in(tt,c.own+i*0.25,0.5);if(a<=0)return;dp_badge(x,bx,210,600,372,{kind,title,pic,t:tt,a,mrz});
        dp_T(x,l1,bx+206,438,{w:600,size:28,col:"mut",a});dp_T(x,l2,bx+206,482,{w:700,size:28,col:"cyan",a:a*ag_in(tt,P.answers,0.5)});});
      wi_slipAt(x,tt,P.job,c.shows-0.3,960,612,"Never a person's name","coral",{align:"center"});
      wi_slipAt(x,tt,P.agent,c.shows-0.3,1590,612,"Never a person's name","coral",{align:"center"});
      wi_slipAt(x,tt,c.module+0.3,c.shows-0.3,1590,712,"See AI agents in data work","grey",{align:"center"});
      [["09:12 · read the learner records",330],["02:00 · loaded the night's files",960],["10:30 · ran the tests",1590]].forEach(([s,sx],i)=>
        wi_slipAt(x,tt,c.shows+0.2+i*0.3,null,sx,640,s,"grey",{align:"center"}));}}
  ]);});

/* ---------------------------------------------------------------- 5 · Rights from a role */
scene("role",(ctx,S,t,sc)=>{const c=sc.cues,P=wi_once(sc,"P",()=>({found:wAt(sc,"fortyone","forty-one"),table:wAt(sc,"fortyone","the whole learner table"),
    byname:wAt(sc,"fortyone","by name"),owner:wAt(sc,"map","a data owner"),eng:wAt(sc,"map","an analytics engineer"),stew:wAt(sc,"map","a data steward"),
    needs:wAt(sc,"group","holding what"),nomore:wAt(sc,"group","no more"),joinG:wAt(sc,"join","Join the group"),leave:wAt(sc,"join","leave it"),gone:wAt(sc,"join","they're gone"),
    say:wAt(sc,"mei","is Mei's to say")}));
  ag_shots(ctx,S,t,sc.dur,[
    // what may each one do? Sam's team once found 41 people who could read the whole learner table, each given it by name; nine had
    // moved to other jobs, and still could
    {at:0,place:"wiHall",later:true,keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{const lp=ag_sine((tt-P.byname)/1.0),G=WI_41.map((q,i)=>{const n=WI_9.indexOf(i);return n<0?0:ag_in(tt,c.nine+0.3+n*0.12,0.4);});
      wi_slipAt(x,tt,c.next,null,960,96,"What may each one do?","cyan",{align:"center"});
      const ca=ag_in(tt,P.table,0.5);if(ca>0)dp_card(x,1150,330,640,{kick:"Personal data",title:"The whole learner table"},{col:"violet",a:ca,k:ag_spr(tt,P.table)});
      if(lp>0)WI_41.forEach(([px,py],i)=>dp_link(x,[px+30,py],[1150,400],G[i]>0.5?"coral":"violet",lp,{lw:1.2,alpha:G[i]>0.5?0.6:0.3,dot:false}));
      WI_41.forEach(([px,py],i)=>{const t0=P.found+i*0.045;wi_disc(x,px,py,WI_PIC.person,{r:30,a:ag_in(tt,t0,0.4),k:ag_spr(tt,t0),col:G[i]>0.5?"coral":"cyan",ring:G[i]>0.5?"coral":null});});
      wi_slipAt(x,tt,P.table+0.6,null,1150,500,"From Who may see it","grey");
      wi_slipAt(x,tt,c.nine+0.4,null,1150,600,"Nine moved on, and still could","coral");}},
    // so rights go to a role, never to a person: the roles on the university's map, each a group holding what its work needs and no
    // more; join the group and you have its rights, leave it and they're gone
    {at:c.never-0.3,place:"wiHall",later:true,keys:[[c.never-0.3,960,540,1]],push:0.02,draw:(x,tt)=>{const dim=ag_in(tt,c.group,0.6);
      dp_card(x,90,110,820,{kick:"The rule",title:"Rights go to a role, never to a person"},{a:ag_in(tt,c.never,0.5),k:ag_spr(tt,c.never)});
      wi_slipAt(x,tt,c.map+0.2,null,1000,140,"From Who does what, end to end","grey");
      [["Data owner",90,P.owner],["Analytics engineer",700,P.eng],["Data steward",1310,P.stew]].forEach(([s,rx,t0],i)=>
        dp_card(x,rx,330,520,{kick:"Role",title:s},{a:ag_in(tt,t0,0.5)*(i===1?1:1-0.6*dim),k:ag_spr(tt,t0)}));
      const ga=ag_in(tt,c.group+0.2,0.5);if(ga>0)wi_list(x,640,510,640,{kick:"Group: analytics engineers",a:ga,rows:[["tick","Build and test the data project",ag_sine((tt-P.needs-0.2)/0.5)],
        ["tick","Read development data",ag_sine((tt-P.needs-0.6)/0.5)],["cross","Change production",ag_sine((tt-P.nomore)/0.5)]]});
      const ju=ag_eo((tt-P.joinG)/1.0),lu=ag_sine((tt-P.leave)/1.0),jx=lerp(lerp(1800,1420,ju),1760,lu),ja=ag_in(tt,P.joinG-0.3,0.4),held=1-ag_in(tt,P.leave,0.3);
      if(ja>0){withA(x,held,()=>dp_link(x,[1280,640],[jx-52,640],"green",clamp(ju*1.2,0,1)));wi_disc(x,jx,640,WI_PIC.person,{r:52,a:ja});
        wi_markA(x,jx+40,600,"tick","green",ag_sine((tt-P.joinG-0.8)/0.5),held);}
      dp_pill(x,1760,560,"Rights gone","coral",{align:"center",a:ag_in(tt,P.gone,0.4)});}},
    // and who may use the registrar's data is Mei's to say, as its owner
    {at:c.mei-0.3,place:"wiHall",later:true,keys:[[c.mei-0.3,960,540,1]],push:0.02,draw:(x,tt)=>{
      withA(x,ag_in(tt,c.mei,0.6),()=>dp_person(x,"mei",1450,640,0.9,{t:tt,flip:true,gaze:[3,0]}));
      dp_card(x,140,300,820,{kick:"Owner of the registrar's data",title:"Mei Tanaka",sub:"Says who may use it"},{a:ag_in(tt,c.mei+0.3,0.5),k:ag_spr(tt,c.mei+0.3)});
      wi_slipAt(x,tt,P.say,null,140,520,"From Who decides","grey");}}
  ]);});

/* ---------------------------------------------------------------- 6 · Joiners, movers and leavers */
scene("change",(ctx,S,t,sc)=>{const c=sc.cues,P=wi_once(sc,"P",()=>({join:wAt(sc,"follow","join"),move:wAt(sc,"follow","move"),leave:wAt(sc,"follow","leave"),
    hrr:wAt(sc,"hr","from HR's records"),nobody:wAt(sc,"hr","nobody has to remember"),day:wAt(sc,"joiner","on the first day"),noacc:wAt(sc,"joiner","no access yet"),
    six:wAt(sc,"sign","six lines"),signs:wAt(sc,"every","signs it"),year:wAt(sc,"every","every year"),current:wAt(sc,"every","only while"),owner:wAt(sc,"agent","its owner signs"),
    oldG:wAt(sc,"mover","leaves the old group"),newG:wAt(sc,"mover","join the new one"),off:wAt(sc,"leaver","turned off"),every:wAt(sc,"leaver","every right"),
    moves:wAt(sc,"jun","when he moves"),stops:wAt(sc,"jun","it stops"),next:wAt(sc,"jun","or goes on")}));
  ag_shots(ctx,S,t,sc.dur,[
    // people join, move and leave, and their groups follow: the directory takes it from HR's records, so nobody has to remember
    {at:0,place:"wiHall",later:true,keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{
      [["Joiners",420,P.join],["Movers",960,P.move],["Leavers",1500,P.leave]].forEach(([s,px,t0])=>wi_slipAt(x,tt,t0,null,px,170,s,"cyan",{align:"center"}));
      [[680,560,"cyan","Directory","The university's directory",c.hr+0.2],[130,440,"grey","HR","HR's records",P.hrr],[1360,430,"cyan","Access","Groups",P.hrr+0.9]].forEach(([cx,w,col,k,s,t0])=>
        dp_card(x,cx,370,w,{kick:k,title:s},{col,a:ag_in(tt,t0,0.5),k:ag_spr(tt,t0)}));
      dp_link(x,[570,440],[680,440],"grey",ag_sine((tt-P.hrr-0.3)/0.6));
      dp_link(x,[1240,440],[1360,440],"cyan",ag_sine((tt-P.hrr-1.0)/0.6));
      wi_slipAt(x,tt,P.nobody,null,960,640,"Nobody has to remember","green",{align:"center"});}},
    // a joiner gets an account on the first day and no access yet; first, they sign a confidentiality agreement, and again every year;
    // an agent signs nothing: its owner signs for it
    {at:c.joiner-0.3,place:"wiHall",later:true,keys:[[c.joiner-0.3,960,540,1]],push:0.02,draw:(x,tt)=>{const ba=ag_in(tt,c.joiner,0.5);
      if(ba>0){dp_badge(x,90,200,600,372,{kind:"Person",title:"A joiner",pic:(q,px,py)=>dp_personPic(q,px,py),t:tt,a:ba,mrz:"IDP<JOINER<<<<<<<<<<<<<<<<<<<<<<<<0000"});
        dp_T(x,"Account from day one",296,428,{w:700,size:28,col:"cyan",a:ba*ag_in(tt,P.day,0.5)});
        dp_T(x,"No access yet",296,472,{w:700,size:28,col:"coral",a:ba*ag_in(tt,P.noacc,0.5)});}
      wi_agreement(x,760,110,1070,(tt-P.six)/0.55,{a:ag_in(tt,c.sign,0.5),k:ag_spr(tt,c.sign),signed:ag_sine((tt-P.signs)/1.2)});
      wi_slipAt(x,tt,P.year,null,760,670,"Signed again every year","cyan");
      wi_slipAt(x,tt,P.current,null,760,760,"In a group only while it's current","green");
      const aa=ag_in(tt,c.agent,0.5);if(aa>0)wi_disc(x,170,700,WI_PIC.agent,{r:56,a:aa,k:ag_spr(tt,c.agent)});
      wi_slipAt(x,tt,P.owner,null,250,665,"An agent: its owner signs","grey");}},
    // a mover leaves the old group as they join the new one; a leaver's account is turned off on their last day, and every right with it
    {at:c.mover-0.3,place:"wiHall",later:true,keys:[[c.mover-0.3,960,540,1]],push:0.02,draw:(x,tt)=>{
      dp_card(x,160,250,560,{kick:"Group",title:"The old team"},{a:ag_in(tt,c.mover,0.5)});
      dp_card(x,1200,250,560,{kick:"Group",title:"The new team"},{a:ag_in(tt,c.mover+0.2,0.5)});
      const mx=lerp(560,1360,ag_sine((tt-P.oldG-0.2)/1.8)),ma=ag_in(tt,c.mover+0.3,0.5);
      if(ma>0){withA(x,ma*(1-ag_in(tt,P.oldG,0.3)),()=>dp_link(x,[560,388],[560,468],"green",1));dp_link(x,[1360,388],[1360,468],"green",ag_sine((tt-P.newG)/0.4));
        wi_disc(x,mx,520,WI_PIC.person,{r:52,a:ma});}
      const la=ag_in(tt,c.mover+0.5,0.5),off=ag_in(tt,P.off,0.4);
      if(la>0){withA(x,la*(1-off),()=>dp_link(x,[300,388],[300,508],"green",1));wi_disc(x,300,560,WI_PIC.person,{r:52,a:la*(1-0.5*ag_in(tt,P.every,0.6)),ring:off>0.5?"coral":null,col:off>0.5?"coral":"cyan"});}
      wi_slipAt(x,tt,P.off+0.2,null,380,530,"Account off on the last day","coral");}},
    // but the nightly job runs as Jun: when he moves, it stops, or goes on with whatever he may do next
    {at:c.jun-0.3,place:"wiHall",later:true,keys:[[c.jun-0.3,960,540,1]],push:0.02,draw:(x,tt)=>{const ja=ag_in(tt,c.jun,0.5),jx=lerp(1100,1500,ag_sine((tt-P.moves)/1.4));
      if(ja>0){withA(x,ja,()=>dp_link(x,[630,450],[jx-60,450],"cyan",1,{dot:false}));wi_disc(x,560,450,WI_PIC.gear,{r:70,a:ja});dp_T(x,"Nightly load",560,350,{w:700,size:32,align:"center",a:ja});
        wi_disc(x,jx,450,WI_PIC.person,{r:60,a:ja});dp_T(x,"Jun Park",jx,350,{w:700,size:32,align:"center",col:"cyan",a:ja});}
      wi_slipAt(x,tt,c.jun+0.6,null,835,480,"Runs as Jun","grey",{align:"center"});
      wi_mark(x,612,398,"cross","coral",ag_sine((tt-P.stops)/0.5));
      wi_slipAt(x,tt,P.stops,null,560,600,"It stops","coral",{align:"center"});
      wi_slipAt(x,tt,P.next,null,560,690,"Or runs with his next rights","coral",{align:"center"});}}
  ]);});

/* ---------------------------------------------------------------- 7 · Thinking like an attacker */
scene("attacker",(ctx,S,t,sc)=>{const c=sc.cues,P=wi_once(sc,"P",()=>({q1:wAt(sc,"four","what are we working on?"),q2:wAt(sc,"four","What can go wrong?"),
    q3:wAt(sc,"do","What are we going to do about it?"),q4:wAt(sc,"do","did we do a good enough job?"),other:wAt(sc,"trick","being someone else"),
    told:wAt(sc,"wait","told it to wait"),taken:wAt(sc,"prince","had the king's half taken"),matched:wAt(sc,"fitted","they matched"),
    chariot:wAt(sc,"doubt","one man in a single chariot"),marched:wAt(sc,"killed","the army marched"),saved:wAt(sc,"killed","Handan was saved"),
    never:wAt(sc,"killed","an order the king never gave"),holds:wAt(sc,"proof","someone holds the half"),notwho:wAt(sc,"proof","not who they are"),
    king:wAt(sc,"proof","or that the king sent them"),who:wAt(sc,"keeps","who is it"),where:wAt(sc,"keeps","from where"),device:wAt(sc,"keeps","on which device"),
    what:wAt(sc,"keeps","asking for what"),usual:wAt(sc,"keeps","is that usual?"),stolen:wAt(sc,"least","a proof can be stolen"),copy:wAt(sc,"copy","a copy of Jun's token"),
    isJun:wAt(sc,"copy","is Jun")}));
  const T4=[P.q1,P.q2,P.q3,P.q4],TQ=[P.who,P.where,P.device,P.what,P.usual];
  ag_shots(ctx,S,t,sc.dur,[
    // before Sam builds anything, he thinks like an attacker: four questions; what can go wrong starts with the oldest trick
    {at:0,place:"wiHall",later:true,keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{
      withA(x,ag_in(tt,0.4,0.7),()=>dp_person(x,"sam",330,615,0.95,{t:tt,gaze:[3,0]}));
      wi_tagAt(x,tt,c.before+0.6,c.four+0.2,90,238,"Thinking like an attacker","cyan",wi_head(330,615,0.95));
      const la=ag_in(tt,c.four-0.2,0.5);if(la>0)wi_list(x,760,190,820,{kick:"Before building",title:"Four questions",a:la,
        rows:["What are we working on?","What can go wrong?","What are we going to do about it?","Did we do a good enough job?"].map((s,i)=>[i+1,s,ag_sine((tt-T4[i])/0.5),"cyan",ag_in(tt,T4[i]-0.2,0.4)])});
      wi_tagAt(x,tt,P.other,null,1180,640,"Being someone else","coral",[1140,418]);}},
    // the tallies had that weak spot too
    {at:c.tallies-0.2,place:"wiTally",keys:[[c.tallies-0.2,960,560,1.05]],push:0.02,draw:(x,tt)=>{
      wi_tiger(x,WI_TA[0],WI_TA[1],WI_TS,{flip:true,t:tt});wi_tiger(x,WI_TB[0],WI_TB[1],WI_TS,{t:tt});
      wi_slipAt(x,tt,c.tallies+0.4,null,960,330,"The same weak spot","coral",{align:"center"});}},
    // in 257 BC, Qin had Handan, the capital of Zhao, under siege
    {at:c.siege-0.2,place:"wiSiege",keys:[[c.siege-0.2,1000,580,1.06]],push:0.02,draw:(x,tt)=>{wi_siegefires(x,tt);
      wi_kick(x,S,"257 BC","Handan, under siege",ag_io(tt,c.siege+0.3,c.wait-0.4));
      wi_slipAt(x,tt,c.siege+1.6,c.wait-0.3,1280,420,"Qin's army, all round it","grey");}},
    // Wei's king sent an army to help, then told it to wait; Lord Xinling had the king's half taken from his rooms
    {at:c.wait-0.2,place:"wiCourt",keys:[[c.wait-0.2,960,540,1]],push:0.02,draw:(x,tt)=>{const sw=c.prince-0.5;
      withA(x,1-ag_in(tt,sw,0.5),()=>dp_person(x,WI_P.weiking,560,640,0.95,{t:tt,light:"lamp",gaze:[3,0]}));
      withA(x,ag_in(tt,sw+0.5,0.5),()=>dp_person(x,WI_P.xinling,560,640,0.95,{t:tt+1.1,light:"lamp",gaze:[3,0]}));
      wi_tiger(x,1240,573,0.42,{t:tt,a:1-ag_in(tt,P.taken+0.6,0.8)});
      wi_tagAt(x,tt,c.wait+0.3,sw-0.1,340,230,"Wei's king","cyan",wi_head(560,640,0.95),{behind:false});
      wi_slipAt(x,tt,P.told,sw-0.1,760,160,"His army, told to wait","grey");
      wi_tagAt(x,tt,c.wait+1.0,P.taken+0.4,1150,420,"The king's half","cyan",[1240,548],{behind:false});
      wi_tagAt(x,tt,sw+0.7,null,250,230,"Lord Xinling, a prince of Wei","cyan",wi_head(560,640,0.95),{behind:false});
      wi_slipAt(x,tt,P.taken+0.9,null,1060,440,"The king's half, taken","grey");}},
    // at the camp, Jin Bi, the general, fitted the halves together, and they matched
    {at:c.fitted-0.2,place:"wiTally",keys:[[c.fitted-0.2,960,560,1.05]],push:0.02,draw:(x,tt)=>{const ok=ag_in(tt,P.matched,0.5);
      wi_fit(x,WI_TA,WI_TB,WI_TS,clamp((tt-c.fitted-0.8)/2.2,0,1),{t:tt,seam:ok,seamCol:"green",glow:ok});
      dp_pill(x,WI_TB[0],452,"They matched","green",{align:"center",a:ok});}},
    // still he doubted: would the king send one man in a single chariot to take his army? He was killed
    {at:c.doubt-0.2,place:"wiTent",cut:true,keys:[[c.doubt-0.2,960,540,1]],push:0.02,draw:(x,tt)=>{wi_lampGlow(x,tt,1010,470);
      withA(x,1-ag_in(tt,c.killed+0.4,1.2),()=>dp_person(x,WI_P.jinbi,560,610,1,{t:tt,light:"lamp",gaze:[3,0],pose:"hold",
        hold:(q,h)=>wi_tiger(q,h.near[0]+60,h.near[1]-34,0.3,{t:tt,seam:1,seamCol:"green"})}));
      dp_person(x,WI_P.xinlingL,1340,630,0.96,{t:tt+0.8,flip:true,light:"lamp",gaze:[3,0]});
      wi_tagAt(x,tt,c.doubt+0.2,c.killed,180,220,"Jin Bi, the general","cyan",wi_head(560,610,1));
      wi_tagAt(x,tt,P.chariot,c.killed,1000,200,"One man, in a single chariot?","cyan",wi_head(1340,630,0.96,true));}},
    // the army marched, and Handan was saved, by an order the king never gave
    {at:P.marched-0.2,place:"wiSiege",keys:[[P.marched-0.2,1000,580,1.06]],push:0.02,draw:(x,tt)=>{
      wi_siegefires(x,tt,1-ag_in(tt,P.saved,1.6));
      wi_march(x,WI_SIEGE_ROAD,0.95*ag_sine((tt-P.marched)/4.4),14,0.035,-1,tt,ag_in(tt,P.marched,0.5));
      wi_tagAt(x,tt,P.never,null,150,560,"An order the king never gave","coral",[360,760]);}},
    // a match proves someone holds the half, not who they are; so the platform keeps Jin Bi's doubt, and gives each the least it needs
    {at:c.proof-0.2,place:"wiHall",keys:[[c.proof-0.2,960,540,1]],push:0.02,draw:(x,tt)=>{
      const pa=ag_in(tt,c.proof,0.5);if(pa>0)wi_list(x,80,200,760,{kick:"A match proves",a:pa,rows:[["tick","Someone holds the half",ag_sine((tt-P.holds)/0.5),"green",ag_in(tt,P.holds-0.2,0.4)],
        ["cross","Who they are",ag_sine((tt-P.notwho)/0.5),"coral",ag_in(tt,P.notwho-0.2,0.4)],["cross","That the king sent them",ag_sine((tt-P.king)/0.5),"coral",ag_in(tt,P.king-0.2,0.4)]]});
      const da=ag_in(tt,c.keeps,0.5);if(da>0)wi_list(x,920,200,920,{kick:"Jin Bi's doubt, kept",a:da,
        rows:["Who is it?","From where?","On which device?","Asking for what?","Is that usual?"].map((s,i)=>["q",s,ag_sine((tt-TQ[i])/0.5),"cyan",ag_in(tt,TQ[i]-0.2,0.4)])});
      dp_pill(x,1380,660,"Only the least it needs","green",{align:"center",a:ag_in(tt,P.stolen+1.0,0.5)});}},
    // for the nightly job, what can go wrong is plain: a copy of Jun's token is Jun
    {at:c.copy-0.3,place:"wiHall",later:true,keys:[[c.copy-0.3,960,540,1]],push:0.02,draw:(x,tt)=>{const a=ag_in(tt,c.copy,0.5),ca=ag_in(tt,P.copy,0.4);
      if(a>0){wi_disc(x,250,450,WI_PIC.gear,{r:70,a});dp_T(x,"Nightly load",250,350,{w:700,size:32,align:"center",a});}
      dp_wall(x,1300,230,400,540,{col:"cyan",label:"The data platform",a});
      dp_sealed(x,420,402,560,"Jun Park's personal token",{a});
      dp_sealed(x,420,lerp(402,560,ag_eo((tt-P.copy)/1.0)),560,"A copy of Jun's token",{a:ca});
      for(const [y0,t0] of [[450,c.copy+0.4],[608,P.copy+1.1]])withA(x,ag_in(tt,t0,0.3),()=>dp_link(x,[980,y0],[1300,y0],"cyan",ag_sine((tt-t0)/0.6)));
      dp_pill(x,1500,466,"Jun Park","cyan",{align:"center",a:ag_in(tt,c.copy+1.0,0.4)});
      dp_pill(x,1500,624,"Jun Park","cyan",{align:"center",a:ag_in(tt,P.isJun,0.4)});
      wi_tagAt(x,tt,P.isJun+0.3,null,560,700,"To the platform, the copy is Jun","coral");}}
  ]);});

/* ---------------------------------------------------------------- 8 · A name of its own */
scene("own",(ctx,S,t,sc)=>{const c=sc.cues,P=wi_once(sc,"P",()=>({job:wAt(sc,"name","The nightly job"),loader:wAt(sc,"name","registrar-loader"),
    files:wAt(sc,"may","read the registrar's nightly files"),tables:wAt(sc,"may","write the registrar's tables"),nothing:wAt(sc,"may","nothing in any other area"),
    before:wAt(sc,"agrees","before the job ever signs in"),known:wAt(sc,"nist","known"),checked:wAt(sc,"nist","checked"),least:wAt(sc,"nist","given the least it needs"),
    trustOrder:wAt(sc,"tiger","trust an order"),get:wAt(sc,"every","get the least it needs"),token:wAt(sc,"notyet","with Jun's token")}));
  const MRZ="WKL<REGISTRAR<LOADER<<OKAFOR<<<<<<<0217",gear=(q,px,py)=>dp_gearPic(q,px,py);
  ag_shots(ctx,S,t,sc.dur,[
    // so what are we going to do about it? The four questions again: two answered, and now the third
    {at:0,place:"wiHall",later:true,keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{const la=ag_in(tt,0.6,0.5);if(la<=0)return;
      wi_list(x,550,250,820,{kick:"Before building",title:"Four questions",a:la,
        rows:["What are we working on?","What can go wrong?","What are we going to do about it?","Did we do a good enough job?"].map((s,i)=>[i<2?"tick":i+1,s,1,i<2?"green":"cyan"])});
      dp_halo(x,598,538,46,"cyan",0.55*la*ag_in(tt,1.2,0.5));}},
    // the nightly job gets a name of its own, owned by Sam, its rights from a role written for it, and Mei, who owns the data, agrees
    // before it ever signs in
    {at:P.job-0.3,place:"wiHall",later:true,keys:[[P.job-0.3,960,540,1]],push:0.02,draw:(x,tt)=>{const ba=ag_in(tt,P.job,0.5);
      withA(x,ag_in(tt,c.owns-0.4,0.6),()=>dp_person(x,"sam",300,625,0.95,{t:tt,gaze:[3,0]}));
      if(ba>0){dp_badge(x,640,170,600,372,{kind:"Workload",pic:gear,t:tt,a:ba,scan:(tt-P.loader)/1.2,mrz:MRZ});
        dp_T(x,"registrar-loader",846,350,{w:700,size:42,a:ba*ag_in(tt,P.loader,0.5)});
        dp_T(x,"Owned by Sam Okafor",846,398,{w:700,size:28,col:"cyan",a:ba*ag_in(tt,c.owns,0.5)});
        dp_T(x,"Rights: the loader role",846,442,{w:600,size:28,col:"mut",a:ba*ag_in(tt,c.role,0.5)});}
      const ra=ag_in(tt,c.role+0.6,0.5);if(ra>0){withA(x,ra,()=>dp_link(x,[1240,300],[1280,300],"cyan",1,{dot:false}));
        wi_list(x,1280,170,600,{kick:"Loader role",a:ra,rows:[["tick","Read the nightly files",ag_sine((tt-P.files)/0.5),"green",ag_in(tt,P.files-0.2,0.4)],
          ["tick","Write the registrar's tables",ag_sine((tt-P.tables)/0.5),"green",ag_in(tt,P.tables-0.2,0.4)],
          ["cross","Anything in any other area",ag_sine((tt-P.nothing)/0.5),"coral",ag_in(tt,P.nothing-0.2,0.4)]]});}
      withA(x,ag_in(tt,c.agrees,0.6),()=>dp_person(x,"mei",1560,700,0.8,{t:tt,flip:true,gaze:[3,0]}));
      wi_slipAt(x,tt,P.before,null,940,600,"Agreed by Mei, before its first sign-in","green",{align:"center"});}},
    // this is where most security work starts: NIST's Cybersecurity Framework puts it first under Protect
    {at:c.nist-0.3,place:"wiHall",later:true,keys:[[c.nist-0.3,960,540,1]],push:0.02,draw:(x,tt)=>{
      dp_card(x,310,300,1300,{kick:"NIST Cybersecurity Framework 2.0",title:"Under Protect, first: every user, service and device"},{a:ag_in(tt,c.nist,0.6),k:ag_spr(tt,c.nist)});
      let px=310;for(const [s,t0] of [["Known",P.known],["Checked",P.checked],["Given the least it needs",P.least]])px+=dp_pill(x,px,540,s,"green",{a:ag_in(tt,t0,0.4)})+24;}},
    // in the Warring States, a bronze tiger let a commander trust an order without trusting the man who brought it
    {at:c.tiger-0.2,place:"wiTally",keys:[[c.tiger-0.2,960,560,1.05],[P.trustOrder,1000,620,1.2]],push:0.02,draw:(x,tt)=>{
      wi_tiger(x,960,700,1.5,{t:tt,seam:1,seamCol:"green",glow:0.6});}},
    // on the platform, every request can say who it is, and get the least it needs
    {at:c.every-0.2,place:"wiHall",keys:[[c.every-0.2,960,540,1]],push:0.02,draw:(x,tt)=>{
      [["person","Mei Tanaka","Read the learner records",230],["gear","registrar-loader","Load the night's files",410],["agent","An agent","Run the tests",590]].forEach(([k,name,req,y],i)=>{
        const a=ag_in(tt,c.every+0.3+i*0.3,0.5);if(a<=0)return;
        wi_disc(x,200,y,WI_PIC[k],{r:52,a});dp_T(x,name,280,y+12,{w:700,size:34,col:"cyan",a});
        wi_request(x,720,y-35,req,{a});wi_mark(x,1200,y,"tick","green",ag_sine((tt-P.get-i*0.25)/0.5));});
      dp_pill(x,960,770,"Each gets the least it needs","green",{align:"center",a:ag_in(tt,P.get+0.8,0.5)});}},
    // did we do a good enough job? Not yet: tonight, the job still signs in with Jun's token
    // (it all leaves under the end card, which comes in over it)
    {at:c.notyet-0.3,place:"wiHall",later:true,keys:[[c.notyet-0.3,960,540,1]],push:0.02,draw:(x,tt)=>withA(x,1-ag_in(tt,c.breath,0.6),()=>{const a=ag_in(tt,c.notyet,0.5);
      dp_badge(x,250,190,600,372,{kind:"Workload",title:"registrar-loader",lines:[["Owned by Sam Okafor","cyan"],["Rights: the loader role"]],pic:gear,t:tt,a,mrz:MRZ});
      dp_sealed(x,960,300,620,"Jun Park's personal token",{sub:"Still signing in, tonight",a:ag_in(tt,P.token,0.5),behind:false});
      withA(x,ag_in(tt,P.token+0.3,0.4),()=>dp_link(x,[850,370],[960,360],"coral",ag_sine((tt-P.token-0.3)/0.6),{dash:[8,8]}));
      wi_slipAt(x,tt,P.token+1.6,null,960,470,"Next: No secret to lose","cyan");})}
  ]);
  dp_end(ctx,S,t,c.breath,"Who is it, really?","Every request says who it is, and gets the least it needs.","Film 1 of 9");});

// the chapters at the university open on what the one before ends on, in the same hall
ag_cutInto(["trust","who","role","change","attacker","own"]);
