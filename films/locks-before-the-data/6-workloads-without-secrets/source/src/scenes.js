/* ===== Workloads without secrets: the scenes =====
   Nine chapters, each timed to its narration: wAt(sc, "line", "word") is the moment a word is said. The places are painted once
   (ws_car.js, ws_kit.js); what moves is drawn live in the shots of ag_shots. In one room the camera glides on from shot to shot and
   only what changes fades; between rooms the picture dissolves, since nothing on one shows on the other. The opening story's street
   at night and at dawn are two rooms: a dissolve between them with one camera keeps every house where it is while the light changes.
   Chapters that open in the room the last one ends in glide on from its camera (ag_cutInto, at the end). The title card ends
   chapter 2, the end card chapter 9. */

DP_PEOPLE.push("sam","jun",[WS_OWNER,WS_DAWN]);

// the owner at dawn, where she stands by the empty space, facing it; smile 0 to 1
const WS_OWN={x:1330,y:806,s:0.74};
// (a person fades as one picture: drawn whole, then faded, by ag_person itself when the alpha is below 1)
function ws_owner(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  dp_person(ctx,WS_OWNER,WS_OWN.x,WS_OWN.y,WS_OWN.s,{t,flip:true,light:WS_DAWN,gaze:[-0.4,0.25],smile:o.smile||0});ctx.restore();}

/* ---------------------------------------------------------------- 1 · A key anyone could copy */
scene("copy",(ctx,S,t,sc)=>{const c=sc.cues,T=ws_once(sc,"T",()=>({
    nl:wAt(sc,"n1995","Netherlands"),cars:wAt(sc,"streets","Cars"),year:wAt(sc,"streets","every year"),stolen:wAt(sc,"streets","stolen"),
    trouble:wAt(sc,"switch","trouble"),turns:wAt(sc,"switch","turns"),sw:wAt(sc,"switch","switch"),
    wire:wAt(sc,"wire","A wire"),close:wAt(sc,"wire","close"),copy:wAt(sc,"wire","copy of"),
    owner:wAt(sc,"owner","For the owner"),work:wAt(sc,"owner","no way to work"),claim:wAt(sc,"owner","a claim"),back:wAt(sc,"owner","a car that may"),
    change:wAt(sc,"change","Something")}));
  ag_shots(ctx,S,t,sc.dur,[
    // the street at night: the houses, the lamps, the cars along the road
    {at:0,place:"wsStreet",keys:[[0,960,540,1.0],[T.cars,990,560,1.05]],d:7,draw:(x,tt)=>{
      dp_pill(x,960,300,"About 1 car in 200 stolen each year","coral",{align:"center",a:ag_in(tt,T.year,0.5)});}},
    // inside a car: the key turns a switch; a wire closes it too, and so does a copy of the key
    {at:T.trouble-0.6,place:"wsCabin",keys:[[0,1000,560,1.0],[T.wire,1060,620,1.04]],d:3,draw:(x,tt)=>{
      const out=ag_in(tt,T.wire-0.6,0.9),cin=ag_in(tt,T.copy-0.2,0.7);
      ws_key(x,{turn:ag_in(tt,T.turns,0.7)*(1-out),out,a:1-cin});
      ws_key(x,{copy:true,turn:ag_in(tt,T.copy+0.7,0.7),out:1-cin,a:cin});
      ws_circuit(x,clamp((tt-T.sw)/0.8,0,1)*(1-ag_in(tt,T.wire-0.7,0.4)),"cyan");
      ws_wire(x,tt,ag_in(tt,T.close-0.2,0.5),ag_in(tt,T.wire-0.2,0.5)*(1-ag_in(tt,T.copy,0.5)));
      ws_circuit(x,clamp((tt-T.close)/0.8,0,1)*(1-ag_in(tt,T.copy,0.4))+clamp((tt-T.copy-1.2)/0.8,0,1),"coral");
      dp_pill(x,1640,330,"The key only turns a switch","cyan",{align:"center",a:ag_io(tt,T.sw,T.wire-0.3,0.4)});
      dp_pill(x,1640,330,"A wire starts it","coral",{align:"center",a:ag_io(tt,T.close+0.4,T.copy-0.1,0.4)});
      dp_pill(x,1640,330,"So does a copy","coral",{align:"center",a:ag_in(tt,T.copy+1.2,0.4)});}},
    // the next morning: the space where her car was
    {at:T.owner-0.8,place:"wsDawn",keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      ws_owner(x,tt,{});
      const gx=WS_CARS[WS_GAP][0]+165;
      const lv=1-ag_in(tt,T.change+1.6,0.6);
      dp_pill(x,gx,560,"No way to work","coral",{align:"center",a:ag_in(tt,T.work,0.4)*lv});
      dp_pill(x,gx,640,"A claim to make","coral",{align:"center",a:ag_in(tt,T.claim,0.4)*lv});
      dp_pill(x,gx,480,"A car that may never come back","coral",{align:"center",a:ag_in(tt,T.back,0.4)*lv});}}]);
  ws_kick(ctx,S,t,"Opening story","The Netherlands, 1990s",0.4,T.trouble-1.2);
  ws_kick(ctx,S,t,"The next morning","",T.owner-0.2,T.change+1.5);});

/* ---------------------------------------------------------------- 2 · The car asks the key */
scene("asks",(ctx,S,t,sc)=>{const c=sc.cues,T=ws_once(sc,"T",()=>({
    eu:wAt(sc,"eu","European Union"),every:wAt(sc,"eu","every new car"),imm:wAt(sc,"eu","electronic"),
    chip:wAt(sc,"chip","small chip"),turns:wAt(sc,"radio","turns"),asks:wAt(sc,"radio","asks"),code:wAt(sc,"radio","its code"),
    without:wAt(sc,"run","Without"),wont:wAt(sc,"run","won't run"),
    wire:wAt(sc,"nowire","A wire"),shape:wAt(sc,"nowire","a key cut"),
    nl:wAt(sc,"fifth","In the Netherlands"),five:wAt(sc,"fifth","one in five"),all:wAt(sc,"fifth","all of them"),
    forty:wAt(sc,"forty","forty percent"),fifty:wAt(sc,"forty","fifty euros"),fewer:wAt(sc,"fewer","Far fewer"),
    data:wAt(sc,"data","for data"),proves:wAt(sc,"data","proves"),nothing:wAt(sc,"data","nothing anyone"),
    univ:wAt(sc,"still","At the university"),copyK:wAt(sc,"still","a copy"),
    film:wAt(sc,"builds","This film"),entra:wAt(sc,"builds","Microsoft Entra ID"),dbx:wAt(sc,"builds","Azure Databricks"),gh:wAt(sc,"builds","GitHub")}));
  ag_shots(ctx,S,t,sc.dur,[
    // the same morning: the European Union's rule
    {at:0,place:"wsDawn",keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      ws_owner(x,tt,{});
      const a=ag_in(tt,T.eu-0.2,0.5);if(a>0)dp_card(x,90,150,760,{kick:"European Union · 8 November 1995",title:"From 1 October 1998, every new car sold has an electronic immobiliser",sub:"Directive 95/56/EC"},{col:"cyan",a,k:ws_k(tt,T.eu-0.2)});}},
    // the new key: a chip in it, which the car asks for its code, by radio, before the engine runs; a wire, or a copy, can't answer
    {at:T.chip-0.7,place:"wsCabin",keys:[[0,1000,560,1.0],[T.wire,1060,620,1.04]],d:3,draw:(x,tt)=>{
      const out=ag_in(tt,T.wire-0.5,0.9),cin=ag_in(tt,T.shape-0.2,0.7),turn=ag_in(tt,T.turns,0.7)*(1-out);
      ws_key(x,{turn,out,chip:ag_in(tt,T.chip,0.6),a:1-cin});
      ws_key(x,{copy:true,turn:ag_in(tt,T.shape+0.8,0.7),out:1-cin,a:cin});
      const asking=ag_io(tt,T.asks-0.1,T.code+1.0,0.4)+ag_io(tt,T.shape+1.3,T.shape+3.6,0.4);
      ws_ask(x,tt,asking,ag_io(tt,T.code-0.1,T.code+1.0,0.3),turn);
      ws_circuit(x,clamp((tt-T.code-0.3)/0.8,0,1)*(1-out),"green");
      ws_wire(x,tt,ag_in(tt,T.wire+0.3,0.5),ag_in(tt,T.wire-0.1,0.5)*(1-ag_in(tt,T.shape,0.5)));
      dp_tag(x,1430,180,"A chip in the key","cyan",{a:ag_io(tt,T.chip,T.asks-0.2,0.4)});
      dp_pill(x,1640,330,"The right answer: it runs","green",{align:"center",a:ag_io(tt,T.code+0.4,T.wire-0.3,0.4)});
      dp_pill(x,1640,420,"No answer: no engine","coral",{align:"center",a:ag_io(tt,T.wont-0.3,T.wire-0.3,0.4)});
      dp_pill(x,1640,330,"A wire starts nothing","coral",{align:"center",a:ag_io(tt,T.wire+0.9,T.shape-0.1,0.4)});
      dp_pill(x,1640,330,"Nor does a copy","coral",{align:"center",a:ag_in(tt,T.shape+2.6,0.4)});
      if(tt>T.wire+0.9&&tt<T.shape-0.1)dp_cross(x,1640,420,"coral",clamp((tt-T.wire-0.9)/0.5,0,1));
      if(tt>T.shape+2.6)dp_cross(x,1640,420,"coral",clamp((tt-T.shape-2.6)/0.5,0,1));}},
    // the same street, mornings later: new cars with one, theft down; and her car where she left it
    {at:T.nl-0.7,place:"wsDawn",keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      const back=ag_in(tt,T.fewer-0.3,1.0);
      ws_car(x,WS_CARS[WS_GAP][0],WS_ROADY,WS_CARS[WS_GAP][1],{lit:0.5,dawn:true,a:back});
      ws_owner(x,tt,{smile:ag_in(tt,T.fewer+0.4,0.6)});
      const ca=ag_in(tt,T.nl-0.2,0.5)*(1-ag_in(tt,T.fewer-0.6,0.6));
      ws_bars(x,90,140,{a:ca,p1:clamp((tt-T.five+0.3)/0.9,0,1),p2:clamp((tt-T.all+0.2)/1.1,0,1)});
      dp_pill(x,90,650,"Car theft: about 40% lower","green",{a:ca*ag_in(tt,T.forty,0.4)});
      dp_pill(x,90,730,"At most €50 a car","grey",{a:ca*ag_in(tt,T.fifty,0.4)});
      dp_T(x,"van Ours and Vollaard, 2016",90,810,{w:600,size:28,col:"mut",a:ca*ag_in(tt,T.forty+0.6,0.5)});}},
    // for data: a job that proves who it is each time it runs; at the university, it still starts with a copy of a person's key
    {at:T.data-0.8,place:"wsHall",keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      ws_platformLabel(x,ag_in(tt,T.data-0.4,0.6));
      const lv=1-ag_in(tt,c.breath-0.2,0.6);
      ws_badge(x,640,250,{a:ag_in(tt,T.proves-0.4,0.6)*lv,k:ws_k(tt,T.proves-0.4),t:tt});
      ws_door(x,ag_io(tt,T.proves+0.6,T.univ-0.2,0.5),"cyan");
      const tk=ag_in(tt,T.copyK-0.2,0.5)*(1-ag_in(tt,T.film-0.2,0.5));ws_token(x,660,650,{a:tk});
      const L=[["entra","Microsoft Entra ID",T.entra],["databricks","Azure Databricks",T.dbx],["github","GitHub",T.gh]];
      L.forEach(([tool,name,at],i)=>ws_logoTag(x,560+i*330,700,tool,name,ag_in(tt,at-0.2,0.5)*lv));}}]);
  ws_kick(ctx,S,t,"Opening story","1995 to 1998",T.eu-0.4,T.chip-1.0);
  ws_kick(ctx,S,t,"At the university","",T.univ-0.4,T.film+0.2);
  dp_title(ctx,S,t,c.breath,"Workloads without secrets","A job that proves who it is, with nothing to copy","FILM 6 OF 9 · LOCKS BEFORE THE DATA");});

// a tool's logo and its full name on a small slip of glass, as the pages' headers show them (x the slip's left, y its top)
function ws_logoTag(ctx,x,y,tool,name,a){if(!(a>0))return;const im=typeof LOGO!=="undefined"&&LOGO[tool],lh=36,lw=im&&im.width?lh*im.width/im.height:0,w=dp_tw(ctx,name,{w:700,size:30})+lw+70;
  ctx.save();ctx.globalAlpha*=a;dp_panel(ctx,x,y,w,72,{col:"cyan",r:16,glowR:26});if(lw)ctx.drawImage(im,x+22,y+18,lw,lh);dp_T(ctx,name,x+36+lw,y+47,{w:700,size:30});ctx.restore();}

/* ---------------------------------------------------------------- 3 · A key with no end
   The hall at night: the job's badge, top left, and the records it loads every night at two, into the platform's door; Jun Park, at
   the left, and his token under the badge; the door lit, and who the platform takes it for; the three copies; what could happen; the
   car's lock with a copy turned; then the ladder of No secret to lose, the job on its lowest rung. */
scene("noend",(ctx,S,t,sc)=>{const T=ws_once(sc,"T",()=>({
    job:wAt(sc,"two","a job"),loads:wAt(sc,"two","loads"),
    rl:wAt(sc,"named","registrar loader"),
    but:wAt(sc,"token","But"),jun:wAt(sc,"token","Jun Park"),
    holds:wAt(sc,"holds","whoever holds"),every:wAt(sc,"holds","everything"),
    copies:wAt(sc,"copies","copies"),settings:wAt(sc,"copies","the job's settings"),notebook:wAt(sc,"copies","a notebook"),laptop:wAt(sc,"copies","Jun's laptop"),
    moved:wAt(sc,"moves","If Jun moved"),found:wAt(sc,"moves","If someone"),
    car:wAt(sc,"car","Like a car"),starts:wAt(sc,"car","starts for anyone"),
    ladder:wAt(sc,"ladder","No secret to lose"),up:wAt(sc,"ladder","the way up"),top:wAt(sc,"ladder","at the top"),nobody:wAt(sc,"ladder","nobody keeps")}));
  const end=sc.dur;
  ag_shots(ctx,S,t,end,[{at:0,place:"wsHall",keys:[[0,960,540,1]],draw:(x,tt)=>{
    const out=1-ag_in(tt,T.ladder-0.7,0.6);            // all of it leaves as the ladder comes in
    ws_platformLabel(x,1);
    // the job's badge, and the registrar's records it loads, from the left, through it, into the platform
    ws_badge(x,100,150,{a:ag_in(tt,T.job-0.3,0.6)*out,k:ws_k(tt,T.job-0.3),t:tt});
    const fl=ag_io(tt,T.loads-0.2,T.rl+1.4,0.7);
    ws_flow(x,[[-30,330],[100,330]],tt,fl,"violet");ws_flow(x,[[700,330],[1250,330],[1590,730]],tt,fl,"violet");
    dp_tag(x,760,180,"Its own name","cyan",{a:ag_io(tt,T.rl-0.3,T.but-0.3,0.4),to:[652,318]});
    // Jun Park, and his token: who the platform takes the job for, with all he may do
    ws_who(x,"jun",tt,ag_in(tt,T.jun-0.5,0.7)*out,230,840,0.8,{gaze:[1.6,0.4]});
    const tk=ag_in(tt,T.jun-0.2,0.6)*(1-ag_in(tt,T.copies-0.2,0.6));
    ws_token(x,470,640,{a:tk});
    if(tk>0){x.save();x.globalAlpha*=tk;dp_link(x,[1030,700],[1532,740],"cyan",clamp((tt-T.holds)/0.8,0,1));x.restore();}
    const hold=ag_io(tt,T.holds-0.2,T.ladder-0.7,0.5),bad=ag_in(tt,T.starts,0.6);
    ws_door(x,Math.max(ag_io(tt,T.loads,T.rl+1.4,0.6),hold*(1-bad)),"cyan");ws_door(x,hold*bad,"coral");
    dp_slip(x,1590,436,"Signed in: Jun Park","cyan",{align:"center",a:hold});
    dp_pill(x,1590,566,"Everything Jun may do","amber",{align:"center",a:ag_io(tt,T.every-0.2,T.ladder-0.7,0.4)});
    // its copies: in the job's settings, in a notebook in GitHub, on Jun's laptop
    [["The job's settings",T.settings],["A notebook in GitHub",T.notebook],["Jun's laptop",T.laptop]].forEach(([lab,at],i)=>
      ws_pane(x,430+i*330,600,310,250,lab,{a:ag_in(tt,at-0.3,0.5)*out,col:bad>0.5?"coral":"grey",paint:(c,cx,cy)=>ws_sealedMini(c,cx,cy,{label:"Jun's token"})}));
    // what could happen
    dp_pill(x,760,276,"If Jun moves team, the job stops","coral",{a:ag_io(tt,T.moved-0.2,T.car-0.5,0.4)});
    dp_pill(x,760,356,"If someone finds a copy, they're Jun","coral",{a:ag_io(tt,T.found-0.2,T.car-0.5,0.4)});
    // like the car before the immobiliser: a copy turned in the lock starts it
    const ka=ag_io(tt,T.car-0.2,T.ladder-0.7,0.5);
    ws_keyInset(x,1000,340,150,{a:ka,copy:true,turn:ag_in(tt,T.starts-0.4,0.7),circuit:clamp((tt-T.starts)/0.9,0,1),cc:"coral",col:"coral"});
    dp_pill(x,1000,556,"Starts for anyone with a copy","coral",{align:"center",a:ka*ag_in(tt,T.starts,0.4)});
    // the ladder of No secret to lose: the job on its lowest rung; at the top, nobody keeps a secret
    const la=ag_in(tt,T.ladder-0.2,0.7)*(1-ag_in(tt,end-1.0,0.6));
    ws_ladder(x,520,220,760,{a:la,lit:[ag_in(tt,T.top,0.6),0,0,0,0,ag_in(tt,T.ladder+0.4,0.5)],cols:["cyan","cyan","cyan","cyan","cyan","coral"]});
    dp_slip(x,100,628,"registrar-loader, today","coral",{a:la*ag_in(tt,T.ladder+0.4,0.5)});
    if(la>0){x.save();x.globalAlpha*=la;dp_link(x,[492,640],[492,230],"cyan",clamp((tt-T.up)/1.4,0,1));x.restore();}
    dp_tag(x,1300,190,"Nobody keeps a secret","cyan",{a:la*ag_in(tt,T.nobody-0.2,0.5)});
    dp_tag(x,520,760,"From No secret to lose","cyan",{a:la*ag_in(tt,T.ladder,0.5)});}}]);});

/* ---------------------------------------------------------------- 4 · A name of its own
   Microsoft Entra ID's page for registrar-loader (a service principal, owned by Sam Okafor, the only member of registrar_owners) and
   Azure Databricks reading both from the directory; the chain its rights come by; the job's page, run as registrar-loader now, Jun's
   token taken out of its settings, Sam beside it; the badge let in by the platform with nothing anyone keeps; the job's runs, the
   first under its own name on Tuesday 20 October. */
scene("name",(ctx,S,t,sc)=>{const T=ws_once(sc,"T",()=>({
    ms:wAt(sc,"entra","Microsoft Entra ID"),sp:wAt(sc,"entra","service principal"),wl:wAt(sc,"entra","an identity for a workload"),
    owns:wAt(sc,"owner","Sam Okafor"),only:wAt(sc,"group","the only member"),cat:wAt(sc,"group","which owns"),
    reads:wAt(sc,"reads","reads both"),
    rights:wAt(sc,"rights","its rights"),grp:wAt(sc,"rights","from a group"),who:wAt(sc,"rights","Who is it"),
    sam:wAt(sc,"runas","Sam sets"),runas:wAt(sc,"runas","run as registrar loader"),takes:wAt(sc,"runas","takes Jun's token"),
    knows:wAt(sc,"vouches","knows which job"),gives:wAt(sc,"vouches","gives each run"),nothing:wAt(sc,"vouches","nothing anyone keeps"),
    night:wAt(sc,"night","On Tuesday"),first:wAt(sc,"night","for the first time"),
    record:wAt(sc,"record","The record"),notJun:wAt(sc,"record","not Jun"),
    breaks:wAt(sc,"breaks","if Jun moves"),nb:wAt(sc,"breaks","nothing breaks")}));
  const end=sc.dur;
  ag_shots(ctx,S,t,end,[{at:0,place:"wsHall",keys:[[0,960,540,1]],draw:(x,tt)=>{
    ws_platformLabel(x,1);
    // A: the directory's page for it, and the platform reading it
    const A=ag_in(tt,T.ms-0.3,0.6)*(1-ag_in(tt,T.rights-0.7,0.5));
    if(A>0){dp_page(x,80,140,620,560,{tool:"entra",name:"Microsoft Entra ID",where:"Enterprise apps",title:"registrar-loader",a:A});
      dp_field(x,112,346,"Kind","Service principal",{col:"cyan",a:A*ag_in(tt,T.sp-0.2,0.5)});
      dp_pill(x,112,448,"A workload, not a person","cyan",{a:A*ag_in(tt,T.wl,0.4)});
      dp_field(x,112,512,"Owner","Sam Okafor",{a:A*ag_in(tt,T.owns-0.2,0.5)});
      dp_field(x,112,612,"Member of","registrar_owners",{mono:true,a:A*ag_in(tt,T.only-0.2,0.5)});
      dp_T(x,"its only member",440,656,{w:600,size:28,col:"mut",a:A*ag_in(tt,T.only+0.4,0.5)});
      const B=A*ag_in(tt,T.reads-0.3,0.6);
      if(B>0){dp_page(x,820,140,560,440,{tool:"databricks",name:"Azure Databricks",where:"Account",title:"From the directory",a:B});
        dp_T(x,"registrar-loader",852,350,{w:500,size:28,f:"mono",a:B});dp_T(x,"Service principal",852,392,{w:600,size:28,col:"mut",a:B});
        dp_T(x,"registrar_owners",852,458,{w:500,size:28,f:"mono",a:B});dp_T(x,"Group",852,500,{w:600,size:28,col:"mut",a:B});
        dp_T(x,"Read from Microsoft Entra ID",852,552,{w:600,size:28,col:"cyan",a:B});
        x.save();x.globalAlpha*=A;dp_link(x,[700,420],[820,420],"cyan",clamp((tt-T.reads)/0.8,0,1));x.restore();}}
    // its rights come from a group, never from a person
    const R=ag_in(tt,T.rights-0.2,0.6)*(1-ag_in(tt,T.sam-0.7,0.5));
    if(R>0){const b1=dp_slip(x,120,380,"registrar-loader","cyan",{a:R}),b2=dp_slip(x,b1.x+b1.w+120,380,"registrar_owners","cyan",{a:R*ag_in(tt,T.grp-0.2,0.5)}),
        b3=dp_slip(x,b2.x+b2.w+120,380,"The registrar's catalog","green",{a:R*ag_in(tt,T.grp+0.6,0.5)});
      x.save();x.globalAlpha*=R;dp_link(x,[b1.x+b1.w,415],[b2.x,415],"cyan",clamp((tt-T.grp+0.2)/0.6,0,1));dp_link(x,[b2.x+b2.w,415],[b3.x,415],"green",clamp((tt-T.grp-0.6)/0.6,0,1));x.restore();dp_T(x,"member of",(b1.x+b1.w+b2.x)/2,486,{w:600,size:28,col:"mut",align:"center",a:R*ag_in(tt,T.grp,0.5)});
      dp_T(x,"owns",(b2.x+b2.w+b3.x)/2,486,{w:600,size:28,col:"mut",align:"center",a:R*ag_in(tt,T.grp+0.8,0.5)});
      dp_tag(x,120,560,"From Who is it, really?","cyan",{a:R*ag_in(tt,T.who-0.2,0.5)});}
    // B: the job's page: run as registrar-loader now, and Jun's token out of its settings; Sam beside it
    const J=ag_in(tt,T.sam-0.2,0.6)*(1-ag_in(tt,T.knows-0.6,0.5)),ra=ag_in(tt,T.runas+0.4,0.5);
    ws_who(x,"sam",tt,ag_in(tt,T.sam-0.4,0.7)*(1-ag_in(tt,T.night-0.6,0.6)),1190,850,0.78,{flip:true,gaze:[1.4,0.3]});
    if(J>0){dp_page(x,90,140,900,600,{tool:"databricks",name:"Azure Databricks",where:"Jobs & Pipelines",title:"registrar_nightly_load",a:J});
      dp_T(x,"Run as",122,346,{w:600,size:28,col:"mut",a:J});
      dp_T(x,"Jun Park",122,390,{w:700,size:30,a:J*(1-ag_in(tt,T.runas,0.4))});
      dp_T(x,"registrar-loader",122,390,{w:700,size:30,col:"cyan",a:J*ra});
      dp_T(x,"Schedule",122,456,{w:600,size:28,col:"mut",a:J});dp_T(x,"Every night at 02:00",122,500,{w:700,size:30,a:J});
      dp_T(x,"Settings",122,566,{w:600,size:28,col:"mut",a:J});
      const go=ag_sine(clamp((tt-T.takes-0.3)/1.2,0,1));ws_sealedMini(x,262+go*160,640,{label:"Jun's token",a:J*(1-go)});
      dp_T(x,"No token",122,654,{w:700,size:30,col:"green",a:J*ag_in(tt,T.takes+1.4,0.5)});}
    // C: the platform knows which job it is, and lets each run in, with nothing anyone keeps
    const V=ag_in(tt,T.knows-0.2,0.6)*(1-ag_in(tt,T.night-0.6,0.5));
    ws_badge(x,300,200,{a:V,k:ws_k(tt,T.knows-0.2),t:tt,lines:[["Owned by Sam Okafor"],["Runs as itself"]]});
    ws_door(x,V*ag_in(tt,T.gives,0.6),"cyan");
    ws_flow(x,[[900,386],[1250,386],[1590,730]],tt,V*ag_in(tt,T.gives,0.6),"cyan");
    dp_pill(x,300,660,"Nothing anyone keeps","green",{a:V*ag_in(tt,T.nothing,0.4)});
    // D: the job's runs: the first under its own name
    const D=ag_in(tt,T.night-0.2,0.6)*(1-ag_in(tt,end-1.0,0.6));
    if(D>0){const bx=dp_page(x,90,140,1100,380,{tool:"databricks",name:"Azure Databricks",where:"Job runs",title:"registrar_nightly_load",a:D});
      const hi=ag_in(tt,T.record-0.2,0.5);if(hi>0){x.save();x.globalAlpha*=D*hi;rr(x,bx.x-10,bx.y+100,bx.w+20,56,10);x.fillStyle=rgba(DP.F.cyan,0.14);x.fill();x.restore();}
      dp_rows(x,bx.x,bx.y-6,[{t:"Started",w:430},{t:"Run as",w:420},{t:"",w:100}],[
        ["Mon 19 October · 02:00","Jun Park",{tick:"grey"}],
        [{t:"Tue 20 October · 02:00",a:ag_in(tt,T.first-0.6,0.5)},{t:"registrar-loader",col:"cyan",a:ag_in(tt,T.first-0.6,0.5)},{tick:"green",p:clamp((tt-T.first)/0.6,0,1)}]],{a:D});
      dp_pill(x,90,620,"If Jun moves team, nothing breaks","green",{a:D*ag_in(tt,T.nb-0.2,0.4)});}}}]);});

/* ---------------------------------------------------------------- 5 · Asked, not stored
   GitHub's page for the code, and Jun's laptop with his token, the way each change went out until now; the workflow, run by GitHub
   Actions, with no token: it asks GitHub for a note for each run; the note, signed; the federation policy Sam set on registrar-loader
   in Azure Databricks, matched line by line; the pass, good for an hour, through the door; a note from anywhere else, matching
   nothing; Microsoft Entra ID's federated credential for Azure; the car's lock, asking its key; and where approvals live. */
const WS_NOTE=["Repository: uni-example/data-platform","Environment: production","Signed: now, for this run"];
const WS_ELSE=["Repository: someone-else/data-platform","Environment: production","Signed: now, for this run"];
// a row of a settings page: its label, quieter, and its value, at (x, y), the value at x + dx; o.mono, o.col, o.a
function ws_row(ctx,x,y,label,value,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;dp_T(ctx,label,x,y,{w:600,size:28,col:"mut",a});dp_T(ctx,value,x+(o.dx||230),y,{w:o.mono?500:700,size:28,f:o.mono?"mono":undefined,col:o.col||"ink",a});}
scene("asked",(ctx,S,t,sc)=>{const T=ws_once(sc,"T",()=>({
    gh:wAt(sc,"code","GitHub"),until:wAt(sc,"code","until now"),laptop:wAt(sc,"code","from his laptop"),token:wAt(sc,"code","with his token"),
    actions:wAt(sc,"actions","GitHub Actions"),keeps:wAt(sc,"actions","keeps no token"),
    note:wAt(sc,"note","For every run"),signs:wAt(sc,"note","signs"),repo:wAt(sc,"note","this repository"),env:wAt(sc,"note","this environment"),now:wAt(sc,"note","now"),
    checks:wAt(sc,"checks","checks GitHub's signature"),more:wAt(sc,"checks","one thing more"),exactly:wAt(sc,"checks","exactly"),
    once:wAt(sc,"once","Sam set"),prepo:wAt(sc,"once","the platform's repository"),penv:wAt(sc,"once","production environment"),nothing:wAt(sc,"once","nothing else"),
    match:wAt(sc,"pass","When they match"),gives:wAt(sc,"pass","gives the run a pass"),hour:wAt(sc,"pass","good for an hour"),
    elsewhere:wAt(sc,"elsewhere","Run from anywhere else"),where:wAt(sc,"elsewhere","says where"),nopass:wAt(sc,"elsewhere","no pass"),
    minutes:wAt(sc,"minutes","good for minutes"),stored:wAt(sc,"minutes","nothing is stored"),
    azure:wAt(sc,"azure","Where a workflow"),entra:wAt(sc,"azure","Microsoft Entra ID"),same:wAt(sc,"azure","the same note"),
    like:wAt(sc,"like","Like the car"),asks:wAt(sc,"like","asks each run"),copy:wAt(sc,"like","a copy"),
    from:wAt(sc,"review","From a branch")}));
  const end=sc.dur;
  ag_shots(ctx,S,t,end,[{at:0,place:"wsHall",keys:[[0,960,540,1]],draw:(x,tt)=>{
    ws_platformLabel(x,1);const lv=1-ag_in(tt,end-1.0,0.6);
    // A: the code in GitHub, and until now, Jun's laptop and his token, each change deployed from there
    const G=ag_in(tt,T.gh-0.3,0.6)*(1-ag_in(tt,T.note-0.8,0.5));
    if(G>0){dp_page(x,90,140,760,420,{tool:"github",name:"GitHub",where:"uni-example/data-platform",title:"registrar",a:G});
      ["databricks.yml","resources/","notebooks/"].forEach((f,i)=>dp_T(x,f,122,350+i*50,{w:500,size:28,f:"mono",a:G}));}
    const Lp=ag_in(tt,T.until-0.2,0.6)*(1-ag_in(tt,T.actions+0.6,0.6));
    ws_pane(x,960,170,400,250,"Jun's laptop",{a:Lp,paint:(c,cx,cy)=>ws_sealedMini(c,cx,cy,{label:"Jun's token"})});
    if(Lp>0){x.save();x.globalAlpha*=Lp;dp_link(x,[1160,420],[1560,700],"coral",clamp((tt-T.token)/0.9,0,1),{dash:[10,10]});x.restore();}
    ws_door(x,Lp*ag_in(tt,T.token+0.6,0.5),"coral");
    // B: the workflow GitHub Actions runs: production's environment, and the right to ask for a note; no token kept
    const W=ag_in(tt,T.actions-0.2,0.6)*(1-ag_in(tt,T.note-0.8,0.5));
    ws_code(x,90,600,["environment: production","permissions:","  id-token: write","DATABRICKS_AUTH_TYPE: github-oidc"],{w:760,a:W,hi:[2,ag_in(tt,T.keeps,0.5)]});
    dp_tag(x,900,610,"GitHub Actions","cyan",{a:W});
    dp_pill(x,900,742,"No token kept","green",{a:W*ag_in(tt,T.keeps,0.4)});
    // C: the note GitHub signs for each run: this repository, this environment, now
    const N=ag_in(tt,T.note-0.1,0.6)*lv,fresh=ag_in(tt,T.azure-0.4,0.6);
    ws_note(x,90,180,WS_NOTE.map((l,i)=>[l,"ink"]),{w:640,a:N,k:ws_k(tt,T.note-0.1),seal:clamp((tt-T.signs)/1.0,0,1),t:tt,used:ag_in(tt,T.minutes,0.6)*(1-fresh)});
    // the policy Sam set on registrar-loader, matched line by line
    const P=ag_in(tt,T.more-0.3,0.6)*(1-ag_in(tt,T.azure-0.7,0.5)),hiR=ag_in(tt,T.prepo-0.2,0.4),hiE=ag_in(tt,T.penv-0.2,0.4),ok=clamp((tt-T.match)/0.6,0,1);
    if(P>0){dp_page(x,780,140,620,520,{tool:"databricks",name:"Azure Databricks",where:"Federation policy",title:"registrar-loader",a:P});
      const rows=[["Issuer","GitHub Actions",0,0],["Organization","uni-example",1,hiR],["Repository","data-platform",1,hiR],["Entity type","Environment",0,hiE],["Environment","production",1,hiE]];
      rows.forEach(([l,v,m,h],i)=>{const ry=350+i*60;if(h>0){x.save();x.globalAlpha*=P*h;rr(x,800,ry-38,580,54,10);x.fillStyle=rgba(DP.F.cyan,0.14);x.fill();x.restore();}
        ws_row(x,812,ry,l,v,{mono:!!m,a:P});if(ok>0&&i>0){x.save();x.globalAlpha*=P;dp_tick(x,1352,ry-10,"green",ok);x.restore();}});
      dp_pill(x,812,640,"Nothing else","cyan",{a:P*ag_in(tt,T.nothing,0.4)});
      x.save();x.globalAlpha*=P*N;dp_link(x,[730,276],[800,442],ok>0?"green":"cyan",clamp((tt-T.exactly)/0.7,0,1));dp_link(x,[730,322],[800,562],ok>0?"green":"cyan",clamp((tt-T.exactly-0.3)/0.7,0,1));x.restore();}
    ws_who(x,"sam",tt,ag_in(tt,T.once-0.5,0.7)*(1-ag_in(tt,T.elsewhere-0.7,0.6)),250,890,0.76,{gaze:[1.6,0.2]});
    // the pass, good for an hour, through the door
    const ps=ag_in(tt,T.gives-0.2,0.5),inn=ag_sine(clamp((tt-T.hour-0.9)/1.3,0,1));
    ws_pass(x,780+inn*700,730,{a:ps*(1-inn)});
    ws_door(x,ag_io(tt,T.hour+1.4,T.elsewhere-0.3,0.5),"cyan");
    // a note from anywhere else: signed, but no policy names it
    const E=ag_io(tt,T.elsewhere-0.2,T.minutes-0.4,0.5);
    ws_note(x,90,430,WS_ELSE,{w:640,col:"coral",a:E,seal:1,t:tt});
    if(E>0){x.save();x.globalAlpha*=E*P;dp_link(x,[730,526],[800,502],"coral",clamp((tt-T.where)/0.7,0,1),{dash:[8,8]});dp_cross(x,770,512,"coral",clamp((tt-T.nopass+0.2)/0.6,0,1));x.restore();}
    dp_pill(x,1090,792,"No pass","coral",{align:"center",a:E*ag_in(tt,T.nopass,0.4)});
    // the note is good for minutes, for that run; nothing stored in GitHub
    const M=ag_io(tt,T.minutes-0.1,T.azure-0.5,0.4);
    dp_pill(x,90,500,"Good for minutes, for one run","grey",{a:M});
    dp_pill(x,90,580,"Stored in GitHub: nothing","green",{a:M*ag_in(tt,T.stored,0.4)});
    // Azure: Microsoft Entra ID trusts the same note, the same way
    const Z=ag_in(tt,T.entra-0.3,0.6)*(1-ag_in(tt,T.like-0.6,0.5)),zok=clamp((tt-T.same)/0.6,0,1);
    if(Z>0){dp_page(x,780,140,620,520,{tool:"entra",name:"Microsoft Entra ID",where:"Federated credential",title:"registrar-loader",a:Z});
      dp_T(x,"GitHub Actions deploying",812,350,{w:700,size:30,a:Z});dp_T(x,"Azure resources",812,394,{w:700,size:30,a:Z});
      [["Organization","uni-example",1],["Repository","data-platform",1],["Entity","Environment",0],["Environment","production",1]].forEach(([l,v,m],i)=>{const ry=460+i*56;
        ws_row(x,812,ry,l,v,{mono:!!m,a:Z});if(zok>0){x.save();x.globalAlpha*=Z;dp_tick(x,1352,ry-10,"green",zok);x.restore();}});}
    // like the car asking its key: the chip answers; a copy can't
    const K=ag_in(tt,T.like-0.2,0.6)*lv,cp=ag_in(tt,T.copy-0.5,0.6),kt=ag_in(tt,T.like+0.4,0.7);
    if(K>0){x.save();x.globalAlpha*=K*(1-cp);ws_keyInset(x,1090,390,170,{chip:1,turn:kt,ask:ag_io(tt,T.asks-0.2,T.copy-0.5,0.3),answer:ag_io(tt,T.asks+0.5,T.copy-0.5,0.3),t:tt,circuit:clamp((tt-T.asks-0.9)/0.8,0,1),cc:"green",col:"cyan"});x.restore();
      x.save();x.globalAlpha*=K*cp;ws_keyInset(x,1090,390,170,{copy:true,turn:ag_in(tt,T.copy,0.7),ask:1,t:tt,col:"coral"});x.restore();
      dp_pill(x,1090,634,"A copy can't answer","coral",{align:"center",a:K*ag_in(tt,T.copy+0.4,0.4)});}
    dp_tag(x,90,700,"From a branch to production","cyan",{a:ag_in(tt,T.from-0.3,0.5)*lv});}}]);});

/* ---------------------------------------------------------------- 6 · No keys to keep
   Azure's page for the catalog's access connector: an identity of its own, its credentials kept by Azure and seen by nobody, the only
   one that may read the registrar's files; Azure Databricks' Git integration, people linked to GitHub with their own tokens, Jun's
   reaching every repository he can, then the Databricks GitHub app, on the platform's repository alone, its passes ending after eight
   hours; and the rule for every tool that works in GitHub. */
scene("nokeys",(ctx,S,t,sc)=>{const T=ws_once(sc,"T",()=>({
    res:wAt(sc,"azure","a resource"),mi:wAt(sc,"azure","a managed identity"),
    after:wAt(sc,"sees","looks after"),nobody:wAt(sc,"sees","nobody ever sees"),
    cat:wAt(sc,"connector","gives the catalog one"),only:wAt(sc,"connector","the only identity"),files:wAt(sc,"connector","the registrar's files"),
    git:wAt(sc,"git","on the platform"),tokens:wAt(sc,"git","personal tokens"),
    every:wAt(sc,"juns","every repository"),noend:wAt(sc,"juns","no end date"),
    app:wAt(sc,"app","Databricks GitHub app"),alone:wAt(sc,"app","repository alone"),
    each:wAt(sc,"hours","each person"),eight:wAt(sc,"hours","eight hours"),renew:wAt(sc,"hours","renew themselves"),
    rule:wAt(sc,"rule","When a tool"),needs:wAt(sc,"rule","only what it needs"),never:wAt(sc,"rule","never a person's token")}));
  const end=sc.dur;
  ag_shots(ctx,S,t,end,[{at:0,place:"wsHall",keys:[[0,960,540,1]],draw:(x,tt)=>{
    ws_platformLabel(x,1);
    // A: a resource's own identity: the catalog's access connector
    const A=ag_in(tt,T.res-0.3,0.6)*(1-ag_in(tt,T.git-0.7,0.5));
    if(A>0){dp_page(x,90,140,820,560,{tool:"managedIdentity",name:"Microsoft Azure",where:"Identity",title:"catalog-connector-prod",a:A});
      dp_T(x,"Access connector for Azure Databricks",122,350,{w:600,size:28,col:"mut",a:A*ag_in(tt,T.cat-0.2,0.5)});
      dp_switch(x,122,384,ag_in(tt,T.mi,0.6),{col:"cyan",label:"An identity of its own: on",a:A});
      dp_sealed(x,122,460,640,"Its credentials",{sub:"Kept and changed by Azure",a:A*ag_in(tt,T.after-0.2,0.5)});
      dp_pill(x,122,642,"Seen by nobody","green",{a:A*ag_in(tt,T.nobody,0.4)});
      const F=A*ag_in(tt,T.files-0.4,0.6);
      if(F>0){const b=dp_slip(x,1000,420,"The registrar's files","green",{a:F});x.save();x.globalAlpha*=F;dp_link(x,[910,455],[1000,455],"green",clamp((tt-T.files)/0.6,0,1));x.restore();
        dp_pill(x,1000,560,"The only identity that may read them","green",{a:F*ag_in(tt,T.only+0.2,0.4)});
        dp_tag(x,1000,620,"From Network, storage and keys","cyan",{a:F});}}
    // B: Git folders linked to GitHub: each person's own token, then the Databricks GitHub app
    const B=ag_in(tt,T.git-0.2,0.6)*(1-ag_in(tt,T.rule-0.6,0.5)),ap=ag_in(tt,T.app,0.5),jh=ag_io(tt,T.every-0.3,T.app-0.2,0.4);
    if(B>0){const bx=dp_page(x,90,140,900,560,{tool:"databricks",name:"Azure Databricks",where:"Linked accounts",title:"Git folders, linked to GitHub",a:B});
      if(jh>0){x.save();x.globalAlpha*=B*jh;rr(x,bx.x-10,bx.y+44,bx.w+20,56,10);x.fillStyle=rgba(DP.F.coral,0.16);x.fill();x.restore();}
      const tokA=ag_in(tt,T.tokens-0.3,0.5)*(1-ap);
      dp_rows(x,bx.x,bx.y-6,[{t:"Person",w:300},{t:"Linked with",w:500}],["Jun Park","Ingrid Holm","Linh Nguyen"].map(n=>[n,null]),{a:B});
      [0,1,2].forEach(i=>{const ry=bx.y-6+58*(i+1)+30;dp_T(x,"Their own GitHub token",bx.x+300,ry,{w:700,size:28,col:"coral",a:B*tokA});
        dp_T(x,"The Databricks GitHub app",bx.x+300,ry,{w:700,size:28,col:"cyan",a:B*ag_in(tt,T.app+0.4,0.5)});});
      dp_pill(x,bx.x,bx.y+260,"Jun's: every repository he can reach, no end date","coral",{a:B*jh});
      dp_sealed(x,bx.x,bx.y+214,760,"A pass from the app, for each person",{sub:"Ends after eight hours, and renews itself",col:"cyan",a:B*ag_in(tt,T.each-0.2,0.5)});}
    const Ap=ag_in(tt,T.alone-0.6,0.6)*(1-ag_in(tt,T.rule-0.6,0.5));
    if(Ap>0){dp_page(x,1030,140,370,330,{tool:"github",name:"GitHub",title:"Databricks app",a:Ap});
      dp_T(x,"Installed on",1062,350,{w:600,size:28,col:"mut",a:Ap});dp_T(x,"one repository:",1062,392,{w:600,size:28,col:"mut",a:Ap});
      dp_T(x,"uni-example/",1062,440,{w:500,size:28,f:"mono",a:Ap});dp_T(x,"data-platform",1062,480,{w:500,size:28,f:"mono",a:Ap});}
    // C: the rule
    const R=ag_in(tt,T.rule-0.2,0.6)*(1-ag_in(tt,end-1.0,0.6));
    dp_card(x,300,300,1000,{kick:"Tools that work in GitHub",title:"An app with only what it needs",sub:"Never a person's token"},{col:"cyan",a:R,k:ws_k(tt,T.rule-0.2)});}}]);});

/* ---------------------------------------------------------------- the rest, for now: the hall */
["vault","found","close"].forEach(id=>scene(id,(ctx,S,t,sc)=>{ag_shots(ctx,S,t,sc.dur,[{at:0,place:"wsHall",keys:[[0,960,540,1]],draw:(x,tt)=>{}}]);}));

ag_cutInto(["asks","noend","name","asked","nokeys"]);
