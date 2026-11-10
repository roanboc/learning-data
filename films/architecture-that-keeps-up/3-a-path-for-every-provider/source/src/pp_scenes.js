/* ===== A path for every provider: the chapters, shot by shot =====
   Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt), so the pictures stay with the voice if it's recorded
   again; the score (tools/score.py) takes the same words. In one room the camera glides and only what changes fades; a later moment in
   a room (later:true) lets what was there leave first; between rooms a shot dissolves. Sizes in the 1920 x 1080 frame. */

const PP_LAST="One preferred way, a path for every provider, and value first.";
const PP_MOD={module:"Data management",mark:dm_mark};
// the film's number and title at the top left, from the second chapter on
function pp_kick(ctx,S,a){if(a<=0.004)return;setScreen(ctx,S);lp_kicker(ctx,"3","A path for every provider",{a});}

/* ---------------------------------------------------------------- 1. The ship that brought its own cranes */
scene("box",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),out={light:"day",wall:0};
  const SX=1400;  // the ship's stern, against the quay
  // the box lifted by the shore crane at Newark: from the quay, up, across, down onto the deck
  const liftPath=tt=>{const u=clamp((tt-w("lift","lifted",-0.4))/4.2,0,1),P=[[1640,560],[1640,330],[1000,300],[1000,470]],seg=u*3,k=Math.min(2,Math.floor(seg)),f=ag_sine(seg-k);
    return[lerp(P[k][0],P[k+1][0],f),lerp(P[k][1],P[k+1][1],f)];};
  ag_shots(ctx,S,t,sc.dur,[
    // Port Newark, April 1956: the Ideal X along the quay, its boxes on deck, and McLean on the quay
    {at:0,place:"ppNewark",keys:[[0,1000,520,1.08],[c.when+0.4,960,540,1.0]],d:3,draw:(x,tt)=>{
      pp_ship(x,SX,{place:"ppNewark",kind:"tanker",boxes:8,t:tt});
      pp_shoreCrane(x,{tip:[1020,240],hook:[1020,300]});
      pp_sheet(x,tt,w("when","Newark",-0.2),110,110,560,{kick:"New Jersey",title:"Port Newark",sub:"April 1956"},{light:null,pin:false,out:c.ideal+1.6});
      pp_sheet(x,tt,w("ideal","Ideal",-0.1),110,110,560,{kick:"An old tanker",title:"The Ideal X",lines:["To Houston","58 boxes on its deck"]},{light:null,pin:false,out:c.cost-0.4,
        u:pp_u(tt,[w("ideal","Houston",-0.1),w("ideal","58",-0.1)])});
      lp_person(x,PP_PEOPLE.mclean,1640,690,0.8,{t:tt,flip:true,light:out,a:ag_io(tt,w("ideal","McLean",-0.6),c.lift+0.2,0.5)});
      pp_tag(x,tt,w("ideal","McLean",0.1),c.lift+0.2,1640,330,"Malcom McLean",{align:"center",col:LP.ink});}},
    // each box lifted on whole, by crane
    {at:c.lift-0.3,place:"ppNewark",keys:[[c.lift-0.3,960,540,1.0],[c.lift+1.6,1180,470,1.18],[c.cost-2.8,1180,470,1.18],[c.cost-1.1,960,540,1.0]],draw:(x,tt)=>{const [hx,hy]=liftPath(tt);
      pp_ship(x,SX,{place:"ppNewark",kind:"tanker",boxes:7,t:tt});
      pp_shoreCrane(x,{tip:[hx,240],hook:[hx,hy-22],load:true});
      pp_tag(x,tt,w("lift","whole",0.1),c.cost-0.4,1460,180,"Lifted whole, by crane",{align:"center",col:LP.ink});}},
    // the cost of loading, by McLean's own figures
    {at:c.cost-0.3,place:"ppNewark",keys:[[c.cost-0.3,960,540,1.0]],draw:(x,tt)=>{
      pp_ship(x,SX,{place:"ppNewark",kind:"tanker",boxes:8,t:tt});pp_shoreCrane(x,{tip:[1000,240],hook:[1000,300]});
      const s0=w("cost","figures",-0.2),b0=w("cost","16",-0.2),h0=w("cost","5.83",-0.2);
      if(tt>=s0){const a=ag_in(tt,s0,0.35)*(1-ag_in(tt,c.needs-0.4,0.4));if(a>0.004){x.save();x.globalAlpha*=a;ag_about(x,520,330,lerp(0.6,1,ag_spr(tt-s0,0,0.5)));
        lp_sheet(x,110,110,820,420,{light:null,pin:false});lp_T(x,"LOADING A SHIP, PER TON",146,184,{w:800,size:28,ls:3,col:LP.mut});lp_T(x,"McLean's own figures, 1956",146,232,{w:800,size:36});
        const hb=ag_sine(ag_in(tt,h0,0.9)),bb=ag_sine(ag_in(tt,b0,0.9));
        lp_T(x,"By hand",146,312,{w:700,size:30});x.fillStyle=rgba(LP.amber,1);x.fillRect(330,286,420*hb,36);lp_T(x,"$5.83",770,316,{w:800,size:30,col:LP.amber,a:hb});
        lp_T(x,"In boxes",146,412,{w:700,size:30});x.fillStyle=rgba(LP.green,1);x.fillRect(330,386,Math.max(6,420*0.0274)*bb,36);lp_T(x,"Under 16 cents",362,416,{w:800,size:30,col:LP.green,a:bb});
        x.restore();}}}},
    // a port with no crane: the box stops at the quay; ships sit for days, unloaded by hand, the old way
    {at:c.needs-0.3,place:"ppNoCrane",keys:[[c.needs-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{const h0=w("harm","unloaded",-0.2),d0=w("harm","days",-0.2);
      pp_ship(x,SX,{place:"ppNoCrane",kind:"tanker",boxes:8,t:tt});
      pp_tag(x,tt,w("needs","crane",0.1),c.few-0.2,1640,420,"A crane at both ends",{align:"center",col:LP.ink});
      pp_tag(x,tt,w("few","Few",0.0),null,1640,420,"No crane for boxes",{align:"center",col:LP.amber});
      pp_net(x,1300,lerp(640,560,ag_sine(clamp((tt-h0)/2.4,0,1))),ag_sine(clamp((tt-h0)/2.4,0,1)),{a:ag_in(tt,h0-0.2,0.5)});
      pp_sheet(x,tt,d0,110,110,620,{kick:"Without a crane",title:"Days at the quay",lines:["Unloaded by hand","Goods cost more"]},{col:LP.amber,light:null,pin:false,
        u:pp_u(tt,[w("harm","unloaded",-0.1),w("harm","cost",-0.1)]),out:c.gateway-0.4});}},
    // the Gateway City, with two cranes of its own on rails along its deck, reaching out over the quay
    {at:c.gateway-0.3,place:"ppNoCrane",keys:[[c.gateway-0.3,960,540,1.0],[c.rails-0.2,960,540,1.0],[c.rails+1.6,1160,500,1.14],[c.years-1.8,1160,500,1.14],[c.years-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{
      const r0=w("rails","rails",-0.2),o0=w("rails","reach",-0.2),k1=lerp(620,900,ag_sine(clamp((tt-r0)/2.2,0,1))),k2=lerp(300,420,ag_sine(clamp((tt-r0)/2.2,0,1)));
      const reach=ag_in(tt,o0,1.4),hook=ag_in(tt,o0+1.4,1.2),onQuay=tt>o0+2.8;
      pp_ship(x,SX,{place:"ppNoCrane",kind:"cellular",boxes:onQuay?15:16,t:tt,cranes:[{x:k2,reach:0.15},{x:k1,reach,hook:onQuay?1-ag_in(tt,o0+3.0,0.8):hook,drop:300,load:!onQuay&&hook>0.02}]});
      if(onQuay)pp_box(x,1560,PP_Q.quayTop-46,124,{a:1});
      pp_sheet(x,tt,w("gateway","Gateway",-0.1),110,110,620,{kick:"October 1957",title:"The Gateway City",lines:["A rebuilt ship","Two cranes of its own"]},{light:null,pin:false,out:c.rails-0.5,
        u:pp_u(tt,[w("gateway","rebuilt",-0.1),w("gateway","cranes",-0.1)])});
      pp_tag(x,tt,w("rails","rails",0.1),c.any-0.2,760,330,"On rails along its deck",{align:"center",col:LP.ink});
      pp_pill(x,tt,w("any","boxes",-0.1),null,1660,560,"Boxes, crane or not",{col:LP.green,icon:"tick"});}},
    // years later: the port's own crane; the ship's cranes folded, no longer needed there; still, ships with cranes call where there are none
    {at:c.years-0.3,place:"ppLater",keys:[[c.years-0.3,960,540,1.0]],dis:1.6,draw:(x,tt)=>{const g0=w("years","build",-0.2),f0=w("years","needed",-0.4);
      pp_ship(x,SX,{place:"ppLater",kind:"cellular",boxes:16,t:tt,cranes:[{x:320,reach:0.15,fold:ag_in(tt,f0,1.2)},{x:880,reach:0.15,fold:ag_in(tt,f0,1.2)}]});
      pp_gantry(x,{a:ag_in(tt,g0,0.8),u:ag_in(tt,g0+0.3,1.6)});
      pp_tag(x,tt,g0+1.0,c.still-0.2,1640,150,"The port's own crane",{align:"center",col:LP.ink});
      pp_sheet(x,tt,w("still","still",-0.2),110,110,700,{title:"Ships with their own cranes",sub:"Still call at ports that have none"},{light:null,pin:false,out:c.reach-0.3});
      pp_sheet(x,tt,w("reach","savings",-0.2),110,110,760,{kick:"The box's savings",title:"Reached each port before it met the standard",lines:["Each joined the standard when it could"]},
        {col:LP.green,light:null,pin:false,u:ag_in(tt,w("reach","joined",-0.1),0.5),out:c.data-0.3});}},
    // data's standard ways, and its providers who can't meet them yet; a path for each, all arriving now
    {at:c.data-0.3,place:"lpRoom",keys:[[c.data-0.3,960,540,1.0]],push:0,draw:(x,tt)=>{const p0=w("data","providers",-0.2),q0=w("path","path",-0.2),n0=w("path","now",-0.3),ga=1-ag_in(tt,c.breath+0.2,0.8);
      if(ga<=0.004)return;x.save();x.globalAlpha*=ga;
      pp_sheet(x,tt,w("data","standard",-0.2),1240,300,520,{kick:"The preferred way",title:"One standard way"},{col:LP.blue,light:"day"});
      PP_LANES.forEach((L,i)=>{const y=PP_LY[i]+40,v=ag_in(tt,p0+i*0.25,0.4);if(v<=0.004)return;x.save();x.globalAlpha*=v;
        lp_sheet(x,120,y-50,380,100,{col:LP.orange,light:"day",pin:false});pp_icon(x,L.icon,176,y+6,LP.orange,0.8);lp_T(x,"A provider",222,y+14,{w:700,size:30});x.restore();
        pp_arrow(x,512,y,1228,lerp(y,460,0.85),ag_in(tt,q0+i*0.3,1.4),{col:i===0?LP.green:LP.mut,w:i===0?7:5,dash:i===0?null:[2,14]});});
      pp_pill(x,tt,n0,null,1500,640,"Arriving now",{col:LP.green,icon:"tick"});x.restore();}}
  ]);
  lp_title(ctx,S,t,c.breath+0.2,"A path for every provider","One preferred way, and a path for the rest","Data management · Architecture that keeps up",PP_MOD);
});

/* ---------------------------------------------------------------- 2. One preferred way */
scene("way",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"};
  const wayU=tt=>[ag_in(tt,w("product","governed",-0.2),0.6),ag_in(tt,w("event","event",-0.3),0.6),ag_in(tt,w("deleted","deleted",-0.3),0.6)];
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"lpRoom",keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{
      pp_sheet(x,tt,1.0,560,280,800,{kick:"Architecture that keeps up",title:"Borrowed from architecture, to run a data team's services",lines:["This film: the data coming in"]},
        {col:LP.blue,light:"day",u:ag_in(tt,w("series","coming",-0.2),0.5)});}},
    // June, a year from now: Helena and Noor write the preferred way, on one page
    {at:c.when-0.3,place:"ppJune",keys:[[c.when-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{const p0=w("helena","write",-0.1);
      pp_sheet(x,tt,w("when","June",-0.1),800,150,320,{kick:"The university",title:"June 2027"},{light:"morning",out:p0-0.4});
      if(tt>=p0)pp_way(x,660,110,700,{a:ag_in(tt,p0,0.35),k:tt-p0,u:wayU(tt),light:"morning"});
      lp_person(x,"helena",380,650,1.0,{t:tt,a:ag_in(tt,w("helena","Helena",-0.6),0.6),light:mo});
      lp_person(x,"noor",1580,650,1.0,{t:tt,flip:true,a:ag_in(tt,w("helena","Noor",-0.6),0.6),light:mo});
      pp_tag(x,tt,w("helena","Helena",0.1),c.product,380,330,"Helena Novak · Data manager",{align:"center",col:LP.ink});
      pp_tag(x,tt,w("helena","Noor",0.1),c.product,1580,330,"Noor Rahman · Architect",{align:"center",col:LP.ink});}},
    // the films of their own
    {at:c.films-0.3,place:"ppJune",later:true,keys:[[c.films-0.3,960,540,1.0]],draw:(x,tt)=>{
      pp_sheet(x,tt,w("films","Moving",-0.2),300,240,600,{kick:"Contracts",title:"Moving is easy, agreeing is the work",sub:"A film of its own"},{light:"morning"});
      pp_sheet(x,tt,w("films","Deleted",-0.2),1020,240,600,{kick:"Deletions",title:"Deleted means deleted",sub:"A film of its own"},{light:"morning"});}},
    // Sam's list: what each provider can give
    {at:c.sam-0.3,place:"ppJune",later:true,keys:[[c.sam-0.3,960,540,1.0]],draw:(x,tt)=>{const l0=w("sam","lists",-0.2);
      if(tt>=l0)pp_providers(x,640,140,1100,{a:ag_in(tt,l0,0.35),k:tt-l0,light:"morning",
        rows:[ag_in(tt,c.sensors,0.6),ag_in(tt,c.payroll,0.6),ag_in(tt,c.timetable,0.6),ag_in(tt,c.labs,0.6)]});
      lp_person(x,"sam",330,650,1.0,{t:tt,light:mo});
      pp_tag(x,tt,w("sam","Sam",0.1),c.sensors,330,330,"Sam Okafor · The platform",{align:"center",col:LP.ink});
      pp_tag(x,tt,w("short","Old",-0.1),null,1190,780,"Old and new alike fall short",{align:"center",col:LP.amber});}}
  ]);
  setScreen(ctx,S);lp_sceneTag(ctx,"The university, 2027 · imagined",{a:ag_io(t,w("when","university",-0.3),c.films,0.5)});
  pp_kick(ctx,S,ag_in(t,0.6,0.6));
});

/* ---------------------------------------------------------------- 3. A tree for the rest */
scene("tree",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  const R=tt=>[ag_in(tt,w("q1","event",-0.6),2.2),ag_in(tt,w("q2","changes",-0.6),2.2),ag_in(tt,w("q3","deleted",-0.6),2.6),ag_in(tt,w("q4","file",-0.4),2.2),ag_in(tt,w("q5","spreadsheet",-0.4),2.4)];
  ag_shots(ctx,S,t,sc.dur,[
    // the page gets a second half
    {at:0,place:"ppJune",keys:[[0,960,540,1.0]],draw:(x,tt)=>{const g=1-ag_in(tt,0.05,0.5);
      if(g>0.004){pp_providers(x,640,140,1100,{a:g,light:"morning"});lp_person(x,"sam",330,650,1.0,{t:tt,a:g,light:{light:"morning"}});
        lp_tag(x,1190,780,"Old and new alike fall short",{align:"center",col:LP.amber,a:g});}
      pp_way(x,560,110,800,{a:ag_in(tt,0.7,0.4),k:tt-0.7,light:"morning",tree:ag_in(tt,w("half","tree",-0.3),0.8)});}},
    // the tree, branch by branch
    {at:c.q1-0.3,place:"ppJune",later:true,keys:[[c.q1-0.3,960,540,1.0],[c.each,960,540,1.0]],draw:(x,tt)=>{
      pp_tree(x,{rows:R(tt),light:"morning",hl:tt>c.names-0.2&&tt<c.each-0.2?[0,1]:null,ticks:clamp(tt-w("each","recommendation",-0.2),0,2)});
      pp_sheet(x,tt,w("names","names",-0.1),1020,500,760,{kick:"Their names",lines:["Event-driven integration","Change data capture"]},{col:LP.blue,light:"morning",pin:false,out:c.each-0.5,
        u:pp_u(tt,[w("names","event-driven",-0.1),w("names","change",-0.1)])});
      pp_tag(x,tt,w("each","contract",-0.2),null,1810,74,"Every path: a contract, with an owner",{align:"right",col:LP.blue});}},
    // kept as text in the repository; the picture drawn from it
    {at:c.repo-0.3,place:"ppJune",later:true,keys:[[c.repo-0.3,960,540,1.0]],draw:(x,tt)=>{const s0=w("repo","text",-0.3),d0=w("repo","drawn",-0.2);
      lp_screen(x,110,170,980,500,{a:ag_in(tt,s0,0.4),draw:(cx,X,Y,Wd,Hd)=>pp_text(cx,X,Y,Wd,Hd,{u:ag_in(tt,s0+0.2,2.4)})});
      pp_arrow(x,1110,420,1290,420,ag_in(tt,d0,0.8),{col:LP.blue,w:6});
      if(tt>=d0+0.4){const a=ag_in(tt,d0+0.4,0.4);x.save();x.globalAlpha*=a;lp_sheet(x,1310,230,520,380,{col:LP.blue,light:"morning"});pp_miniTree(x,1360,300,420,260,{u:ag_in(tt,d0+0.5,1.2)});x.restore();}
      pp_tag(x,tt,s0+0.3,null,600,740,"In the team's repository",{align:"center",col:LP.ink});}}
  ]);
  pp_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 4. What the timetable never says */
scene("gone",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),dy={light:"day"};
  const can0=w("cancel","cancels",-0.1),st0=w("stays","booked",-0.3);
  ag_shots(ctx,S,t,sc.dur,[
    // Sam tests the new timetable
    {at:0,place:"lpRoom",keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      pp_sheet(x,tt,0.6,820,170,620,{kick:"Monday 14 June",title:"Testing the new timetable"},{col:LP.orange,light:"day"});
      lp_person(x,"sam",560,690,0.9,{t:tt,cut:794,light:dy});lp_table(x,300,800,700);lp_laptop(x,650,768,220,{glow:0.6});}},
    // a class cancelled in the timetable; the hourly changes never mention it; on the platform it stays booked
    {at:c.cancel-0.3,place:"lpRoom",later:true,keys:[[c.cancel-0.3,960,540,1.0]],draw:(x,tt)=>{
      pp_twin(x,{a:ag_in(tt,c.cancel-0.2,0.4),cancel:clamp((tt-can0)/1.2,0,1),stays:ag_in(tt,st0,0.6),flow:tt-c.cancel});
      lp_nameTag(x,110,690,"mei",{role:"The registrar's office",a:ag_io(tt,w("cancel","Mei",-0.1),c.graham-0.3,0.4)});
      pp_tag(x,tt,w("cancel","never",-0.1),null,960,690,"Hourly changes",{align:"center",col:LP.orange});
      pp_tag(x,tt,w("cancel","mention",0.0),null,960,760,"Not the cancellation",{align:"center",col:LP.amber});
      pp_pill(x,tt,st0+0.3,null,1450,700,"Still booked",{col:LP.amber});}},
    // Graham would see a booked room with nobody in it
    {at:c.graham-0.3,place:"ppGrey",keys:[[c.graham-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{const r0=w("graham","nobody",-0.2),f0=w("graham","free",-0.2);
      pp_emptyRoom(x,760,200,560,{a:ag_in(tt,r0,0.5)});
      pp_tag(x,tt,r0+0.4,f0,1040,620,"Booked, nobody in it",{align:"center",col:LP.amber});
      pp_tag(x,tt,f0,null,1040,620,"Free all along",{align:"center",col:LP.ink});
      lp_person(x,"graham",400,650,1.0,{t:tt,light:{light:"grey"}});
      pp_tag(x,tt,w("graham","Graham",0.1),c.vendor,400,330,"Graham Ellis · Facilities",{align:"center",col:LP.ink});
      pp_sheet(x,tt,w("vendor","vendor",-0.1),1380,200,440,{kick:"The vendor",title:"Deletions in its changes",lines:["Not before its 2028 renewal"]},{col:LP.amber,light:"grey",u:ag_in(tt,w("vendor","renewal",-0.2),0.5)});}},
    // the tree's answer: the changes every hour, and the full list every night
    {at:c.tree-0.3,place:"lpRoom",keys:[[c.tree-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{
      pp_tree(x,{light:"day",hl:[1,2],dimAll:0});}},
    // the nightly comparison
    {at:c.compare-0.3,place:"ppLate",keys:[[c.compare-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{const m0=w("compare","booking",-0.2),g0=w("compare","deleted",-0.4);
      pp_compare(x,140,140,{a:ag_in(tt,c.compare-0.1,0.4),k:tt-c.compare+0.1,u:ag_in(tt,c.compare+0.2,1.4),match:ag_in(tt,m0,1.2),gone:ag_in(tt,g0,0.8),light:"late"});
      pp_tag(x,tt,w("compare","night",-0.1),null,960,740,"Every night",{align:"center",col:LP.ink});}},
    // live; and what it found in the first week
    {at:c.live-0.3,place:"ppLate",later:true,keys:[[c.live-0.3,960,540,1.0]],draw:(x,tt)=>{const f0=w("found","212",-0.3),fa=1-ag_in(tt,sc.dur-1.0,0.7);if(fa<=0.004)return;x.save();x.globalAlpha*=fa;
      pp_sheet(x,tt,c.live+0.2,200,160,520,{kick:"The new timetable",title:"Live on Monday 19 July"},{col:LP.orange,light:"late"});
      if(tt>=f0){const a=ag_in(tt,f0,0.35);lp_figure(x,840,160,520,{kick:"Found by Friday 30 July",num:"212",label:"Deleted bookings the changes never mentioned"},{col:LP.green,a,k:tt-f0,light:"late"});}
      lp_screen(x,200,420,520,330,{a:ag_in(tt,c.live+0.6,0.4),draw:(cx,X,Y,Wd,Hd)=>pp_counts(cx,X,Y,Wd,Hd,{u:ag_in(tt,c.live+0.8,1.2),ghost:1-ag_in(tt,w("off","stay",-0.2),1.4)})});
      pp_pill(x,tt,w("off","stay",0.4),null,1100,640,"Kept off Graham's page",{col:LP.green,icon:"tick"});x.restore();}}
  ]);
  pp_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 5. Four providers, four paths */
scene("paths",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),dy={light:"day"};
  ag_shots(ctx,S,t,sc.dur,[
    // the four paths: the sensors' events, the timetable's changes and nightly list, payroll's whole file, the labs' governed table
    {at:0,place:"lpRoom",keys:[[0,960,540,1.0]],draw:(x,tt)=>{const a0=w("anil","table",-0.4);
      pp_lanes(x,{light:"day",lanes:[ag_in(tt,w("sensors","event",-0.3),1.2),ag_in(tt,0.4,1.2),ag_in(tt,w("payroll","whole",-0.2),1.2),0],flow:tt,
        labels:[ag_in(tt,w("sensors","event",0.2),0.5),ag_in(tt,0.9,0.5),ag_in(tt,w("payroll","compared",-0.1),0.5),0],people:ag_in(tt,w("payroll","Finance's",-0.1),0.8),
        hl:tt>w("sensors","preferred",-0.3)&&tt<c.payroll-0.2?0:tt>w("payroll","Payroll's",-0.2)&&tt<c.weaker?2:null});}},
    // a weaker path is checked more often: a night's file much smaller than the night before stops the comparison
    {at:c.weaker-0.3,place:"lpRoom",later:true,keys:[[c.weaker-0.3,960,540,1.0]],draw:(x,tt)=>{const b0=c.small+0.2,cut0=w("cut","short",-0.2);
      pp_sheet(x,tt,c.weaker+0.1,180,140,600,{kick:"A weaker path",title:"Checked more often"},{light:"day"});
      if(tt>=b0){const a=ag_in(tt,b0,0.4);x.save();x.globalAlpha*=a;lp_sheet(x,860,140,900,560,{col:LP.orange,light:"day"});
        lp_T(x,"PAYROLL'S FILE, NIGHT BY NIGHT",900,222,{w:800,size:28,ls:3,col:LP.orange});
        const cutV=ag_in(tt,cut0,0.8);
        pp_nights(x,900,250,820,420,{u:ag_in(tt,b0+0.2,1.2),cut:cutV,line:ag_in(tt,w("small","smaller",-0.1),0.6)});x.restore();}
      pp_sheet(x,tt,w("cut","24",-0.2),180,360,600,{kick:"Tuesday 24 August",title:"The file arrives cut short"},{col:LP.amber,light:"day"});
      pp_pill(x,tt,w("cut","stops",-0.1),null,480,640,"Stopped: asks a person",{col:LP.green,icon:"tick"});
      pp_tag(x,tt,w("cut","2,400",-0.1),null,480,730,"2,400 staff not marked as gone",{align:"center",col:LP.green});}},
    // the labs' spreadsheet, moved into a governed table, owned by Anil
    {at:c.anil-0.3,place:"ppJune",keys:[[c.anil-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{const m0=w("anil","moves",-0.2),o0=w("anil","owns",-0.2);
      pp_sheet(x,tt,m0,780,150,520,{kick:"Faculty of Health",title:"Nine clinical labs",sub:"A spreadsheet"},{col:LP.amber,light:"morning",out:o0-0.5});
      pp_sheet(x,tt,o0-0.3,780,150,520,{kick:"A governed table",title:"The Health labs",lines:["Owner: Anil Kurian"]},{col:LP.orange,light:"morning"});
      pp_disc(x,tt,o0+0.3,1300-36,150+56,LP.green,"tick");
      lp_person(x,"anil",420,650,1.0,{t:tt,light:{light:"morning"}});
      pp_tag(x,tt,w("anil","Anil",0.1),null,420,330,"Anil Kurian · Data partner",{align:"center",col:LP.ink});}},
    // each provider's next step up, in writing
    {at:c.step-0.3,place:"ppJune",later:true,keys:[[c.step-0.3,960,540,1.0]],draw:(x,tt)=>{
      pp_sheet(x,tt,c.step+0.2,560,140,800,{kick:"In writing",title:"Each provider's next step up",
        lines:["The timetable: its deletions, in the 2028 renewal","Payroll: a file of its changes, at its next upgrade","The labs: into the timetable"]},
        {col:LP.amber,light:"morning",u:pp_u(tt,[w("asks","timetable",-0.2),w("asks","Payroll",-0.2),w("asks","labs",-0.2)])});}}
  ]);
  pp_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 6. Value first */
scene("value",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),gr={light:"grey"};
  ag_shots(ctx,S,t,sc.dur,[
    // lifted a step at a time; never held back
    {at:0,place:"lpRoom",keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      pp_steps(x,{light:"day",u:ag_in(tt,0.6,1.6),lift:ag_in(tt,w("lift","step",-0.2),1.2)});
      pp_sheet(x,tt,w("wait","never",-0.2),140,140,620,{title:"Never held back, waiting for the ideal"},{col:LP.green,light:"day"});}},
    // Graham's page: every room and lab, four sources, four paths; counts he can trust
    {at:c.page-0.3,place:"ppGrey",keys:[[c.page-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{
      lp_screen(x,820,150,900,560,{draw:(cx,X,Y,Wd,Hd)=>pp_counts(cx,X,Y,Wd,Hd,{u:ag_in(tt,c.page+0.3,1.4),ghost:0,src:ag_in(tt,w("page","four",-0.1),0.6)})});
      lp_person(x,"graham",420,650,1.0,{t:tt,light:gr});
      pp_pill(x,tt,w("sees","trust",-0.2),null,1270,790,"Counts he can trust",{col:LP.green,icon:"tick"});}},
    // Helena's page, still one page
    {at:c.one-0.3,place:"ppLate",keys:[[c.one-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{
      pp_sheet(x,tt,c.one+0.3,700,130,760,{kick:"Helena's page",title:"Still one page",lines:["The preferred way","The tree","Each provider's next step"]},
        {col:LP.blue,light:"late",u:pp_u(tt,[w("one","preferred",-0.1),w("one","tree",-0.1),w("one","next",-0.1)])});
      lp_person(x,"helena",400,650,1.0,{t:tt,light:{light:"late"}});}}
  ]);
  pp_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 7. On Monday */
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"},e0=c.breath+0.6;
  ag_shots(ctx,S,t,sc.dur,[
    // back to the Gateway City: its cranes reaching a port with none
    {at:0,place:"ppNoCrane",keys:[[0,1000,520,1.06],[3.0,960,540,1.0]],draw:(x,tt)=>{const r0=w("back","cranes",-0.3);
      pp_ship(x,1400,{place:"ppNoCrane",kind:"cellular",boxes:15,t:tt,cranes:[{x:320,reach:0.15},{x:900,reach:ag_in(tt,r0,1.4)}]});
      pp_pill(x,tt,w("back","reached",-0.1),null,1660,560,"Years before their cranes",{col:LP.green,icon:"tick"});}},
    // Helena's team did the same
    {at:c.team-0.3,place:"lpRoom",keys:[[c.team-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{
      pp_lanes(x,{light:"day",lanes:[1,1,1,1],labels:[1,1,1,1],people:1,flow:tt});
      pp_pill(x,tt,w("team","true",-0.2),null,1690,800,"True from the first week",{col:LP.green,icon:"tick"});}},
    // what to do on Monday
    {at:c.page-0.3,place:"ppJune",keys:[[c.page-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{const g=1-ag_in(tt,e0,0.8);
      if(g<=0.004)return;x.save();x.globalAlpha*=g;
      pp_sheet(x,tt,c.page+0.3,140,170,520,{kick:"One",title:"Write your preferred way on one page"},{col:LP.blue,light:"morning"});
      pp_sheet(x,tt,w("tree","Draw",-0.1),700,170,520,{kick:"Two",title:"Draw the tree for the rest"},{col:LP.blue,light:"morning"});
      pp_sheet(x,tt,w("ask","Ask",-0.1),1260,170,520,{kick:"Three",title:"Ask each provider for its next step up"},{col:LP.amber,light:"morning"});
      pp_sheet(x,tt,w("check","Check",-0.1),560,520,800,{kick:"Four",title:"Check the weaker paths more often; don't hold value back"},{col:LP.green,light:"morning"});
      x.restore();}}
  ]);
  lp_end(ctx,S,t,e0,"A path for every provider",PP_LAST,"Film 3 of 3","Architecture that keeps up",PP_MOD);
  pp_kick(ctx,S,1-ag_in(t,e0,0.8));
});
ag_cutInto(["way","tree"]);
