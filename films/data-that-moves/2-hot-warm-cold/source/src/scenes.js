/* ===== Hot, warm, cold: the scenes =====
   Six chapters, each timed to its narration: wAt(sc, "line", "word") is the moment a word is said. The place is painted once
   (hw_places.js, and the module's map and night); what moves is drawn live in the shots of ag_shots. In one place the camera never
   jumps: it glides on from where it is, and what changes there fades or slides while the rest stays put. A new place dissolves in,
   since no two places here show the same people or words. Words drawn in the frame (dates, cards, pills) go through hw_scr, so they
   keep their size whatever the camera does, and come in once the camera has arrived. */

// a moment's date or time, at the top left of the frame
const HW_WHEN=[214,222,240];
function hw_when(ctx,S,text,a){if(!(a>0.004))return;hw_scr(ctx,S,()=>md_tag(ctx,96,96,text,{col:HW_WHEN,a}));}
// a card, pill or tag that comes in at t0 (cards and pills spring from their centre) and leaves at t1
function hw_cardAt(ctx,x,y,w,words,tt,t0,t1,o){const a=hw_io(tt,t0,t1==null?1e9:t1,0.4,0.4);if(a<=0.004)return;md_textCard(ctx,x,y,w,words,Object.assign({a,k:(tt-t0)/0.9},o||{}));}
function hw_pillAt(ctx,x,y,text,tt,t0,t1,o){const a=hw_io(tt,t0,t1==null?1e9:t1,0.35,0.4);if(a<=0.004)return;md_pill(ctx,x,y,text,Object.assign({a,k:(tt-t0)/0.9,size:28},o||{}));}
function hw_tagAt(ctx,x,y,text,tt,t0,t1,o){const a=hw_io(tt,t0,t1==null?1e9:t1,0.35,0.4);if(a<=0.004)return;md_tag(ctx,x,y,text,Object.assign({a},o||{}));}
// a person who comes in at t0 and leaves at t1, faded as one picture (md_person draws them whole, then lays them on at the context's opacity)
function hw_personAt(ctx,who,x,y,s,tt,t0,t1,o){const a=hw_io(tt,t0,t1==null?1e9:t1,0.6,0.6);if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;md_person(ctx,who,x,y,s,Object.assign({t:tt},o||{}));ctx.restore();}
// the night laid softly over the frame, for a turn in the story
function hw_dim(ctx,S,a){if(!(a>0.004))return;hw_scr(ctx,S,()=>{ctx.fillStyle="rgba(4,8,18,"+clamp(a,0,1).toFixed(3)+")";ctx.fillRect(0,0,W,H);});}
// two words, a label and its value, on one line of a card
function hw_pair(ctx,x,y,k,v,o){o=o||{};md_T(ctx,k,x,y,{w:600,size:28,col:MD.soft});md_T(ctx,v,x+(o.dx||200),y,{w:700,size:28,col:o.col||MD.ink});}
// a dashed card: something asked, or not yet here
function hw_ghost(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const w=md_tw(ctx,s,{w:700,size:28})+56;md_card(ctx,x-(o.align==="center"?w/2:0),y-28,w,56,{dash:true,edge:o.col||MD.soft,r:28,a});
  md_T(ctx,s,x+(o.align==="center"?0:28),y+10,{w:700,size:28,align:o.align==="center"?"center":"left",col:o.col||MD.soft,a});}

/* ---------------------------------------------------------------- 1 · The pigeon post */
// the opening's lanes on the map: the wire from Berlin through Cologne to Aachen, the wire from Paris to Brussels, the gap between
// Brussels and Aachen, the railway across it by Liège, and the pigeons' way over it
const hw_bz=(a,b,c,d)=>bez(P(a[0],a[1]),P(b[0],b[1]),P(c[0],c[1]),P(d[0],d[1]),40).map(p=>[p.x,p.y]);
const HW_LANES={berlin:hw_bz(HW_AT.berlin,[1260,240],[980,400],HW_AT.cologne).concat(hw_bz(HW_AT.cologne,[820,452],[790,462],HW_AT.aachen).slice(1)),
  paris:hw_bz(HW_AT.paris,[420,690],[520,560],HW_AT.brussels),gap:hw_arc(HW_AT.brussels,HW_AT.aachen,0),
  rail:hw_bz(HW_AT.brussels,[610,500],[650,512],HW_AT.liege).concat(hw_bz(HW_AT.liege,[722,500],[742,488],HW_AT.aachen).slice(1)),
  birds:hw_arc(HW_AT.brussels,HW_AT.aachen,34),london:hw_bz(HW_AT.aachen,[640,330],[300,250],HW_AT.london)};

scene("pigeons",(ctx,S,t,sc)=>{
  const T={aachen:wAt(sc,"april","In Aachen"),reuter:wAt(sc,"april","Paul Julius Reuter"),news:wAt(sc,"april","the news"),lines:sc.cues.lines,berlin:wAt(sc,"lines","from Berlin"),
    paris:wAt(sc,"lines","from Paris"),gap:sc.cues.gap,nowire:wAt(sc,"gap","no wire"),traders:sc.cues.traders,act:wAt(sc,"traders","they act"),train:sc.cues.train,byTrain:wAt(sc,"train","by train"),
    hoursOld:wAt(sc,"train","hours after"),useless:sc.cues.useless,deal:wAt(sc,"useless","someone else"),need:sc.cues.need,before:wAt(sc,"need","before they acted"),faster:wAt(sc,"need","cross the gap faster"),
    birds:sc.cues.birds,geller:wAt(sc,"birds","Heinrich Geller"),flew:wAt(sc,"birds","flew the prices"),slip:sc.cues.slip,sent:wAt(sc,"slip","the telegraph"),hours:sc.cues.hours,two:wAt(sc,"hours","two hours"),six:wAt(sc,"hours","ahead of the train"),
    time:wAt(sc,"hours","still time"),while:sc.cues.while,joined:wAt(sc,"while","until the wire"),fresh:sc.cues.fresh,whoever:wAt(sc,"fresh","whoever acts"),night:sc.cues.night,once:wAt(sc,"night","once a night"),
    live:wAt(sc,"night","wanted theirs live"),slow:sc.cues.slow,tutors:wAt(sc,"slow","twenty-three"),thief:wAt(sc,"slow","two people's pay"),now:sc.cues.now,serves:wAt(sc,"now","the action it serves"),br:sc.cues.breath};
  const A=HW_AT,CARD=[1220,640,600];
  ag_shots(ctx,S,t,sc.dur,[
    // April 1850: the map of 1850, the two wires and the gap between them; the train across it, and the pigeons over it
    {at:0,place:"hwRoute",keys:[[0,1000,480,1.2],[T.lines-0.4,960,520,1],[T.birds-0.4,700,470,1.6],[T.while-0.3,960,520,1]],d:2.0,push:0.01,draw:(c,tt)=>{
      const bw=ag_in(tt,T.berlin-0.2,0.5),pw=ag_in(tt,T.paris-0.2,0.5),gap=ag_in(tt,T.gap-0.1,0.6),rail=ag_in(tt,T.byTrain-0.3,0.6)*(1-ag_in(tt,T.birds,0.8)),fly=ag_in(tt,T.flew-0.2,0.5);
      hw_wire(c,HW_LANES.berlin,tt,{a:bw,u:ag_sine((tt-T.berlin)/1.6),back:true,every:0.9});
      hw_wire(c,HW_LANES.paris,tt,{a:pw,u:ag_sine((tt-T.paris)/1.4),every:0.9});
      // the gap: no wire, only a dashed line, until the wire is joined
      if(gap>0.004)md_lane(c,HW_LANES.gap,MD.soft,0.7*gap,{dash:true,t:tt});
      // the railway across it, by Liège: the prices go in the mail train's bags, slowly
      if(rail>0.004){md_lane(c,HW_LANES.rail,HW_WHEN,0.7*rail);md_flow(c,HW_LANES.rail,tt,{kind:"batch",col:HW_WHEN,a:rail,every:5.2,dur:5.0,size:0.55});}
      // the pigeons, from Brussels to Aachen, each with its slip of paper
      if(fly>0.004)hw_flock(c,HW_LANES.birds,tt,{a:fly*(1-ag_in(tt,T.fresh-0.6,0.6)),every:1.7,dur:3.4,s:0.82});
      hw_pin(c,A.aachen[0],A.aachen[1],{col:HW.seed,label:{title:"Aachen"},side:"below",a:ag_in(tt,T.aachen-0.1,0.5),k:(tt-T.aachen+0.1)/0.9});
      hw_pin(c,A.berlin[0],A.berlin[1],{col:MD.flow,label:{title:"Berlin"},side:"left",labelA:1-hw_io(tt,T.birds-0.6,T.while+1.5,0.5,0.5),a:bw,k:(tt-T.berlin+0.2)/0.9});
      hw_pin(c,A.paris[0],A.paris[1],{col:MD.flow,label:{title:"Paris"},side:"right",labelA:1-hw_io(tt,T.birds-0.6,T.while+1.5,0.5,0.5),a:pw,k:(tt-T.paris+0.2)/0.9});
      hw_pin(c,A.brussels[0],A.brussels[1],{col:MD.flow,label:{title:"Brussels"},side:"above",a:pw,k:(tt-T.paris)/0.9});
      hw_dim(c,S,0.4*hw_io(tt,T.useless+0.2,T.birds-0.4,0.6,0.8));
      hw_scr(c,S,()=>{const [x,y,w]=CARD;
        hw_when(c,S,"Aachen · April 1850",ag_in(tt,0.9,0.6)*(1-ag_in(tt,T.fresh-0.4,0.5)));
        hw_cardAt(c,x,y,w,{kick:"In Aachen",title:"Paul Julius Reuter",sub:"sells the news of Europe's stock exchanges"},tt,T.reuter,T.lines+0.4,{edge:HW.seed});
        hw_tagAt(c,600,330,"122 km · no wire",tt,T.nowire,T.traders+0.4,{col:HW_WHEN,icon:"warn"});
        hw_cardAt(c,x,y,w,{kick:"Bankers and merchants",title:"They act the same day",sub:"on the prices from other cities' exchanges"},tt,T.traders+0.3,T.train,{edge:MD.agreed});
        hw_cardAt(c,x,y,w,{kick:"By train",title:"Hours old on arrival",sub:"after the day's trading had begun"},tt,T.byTrain+0.2,T.useless,{icon:"clock"});
        hw_cardAt(c,x,y,w,{title:"Too late to act",sub:"someone with fresher news has made the deal"},tt,T.useless+0.3,T.need,{icon:"warn"});
        hw_cardAt(c,x,y,w,{kick:"What they needed",title:"The prices before they acted",sub:"so the news had to cross the gap faster"},tt,T.before,T.birds,{edge:MD.agreed});
        hw_cardAt(c,x,y,w,{kick:"An innkeeper in Aachen",title:"Heinrich Geller's pigeons",sub:"fly the prices across the gap"},tt,T.geller,T.slip,{edge:HW.seed});
        hw_cardAt(c,x,y,w,{kick:"Brussels to Aachen",title:"A thin slip of paper",sub:"then the telegraph, on to Berlin"},tt,T.slip+0.2,T.hours,{edge:HW.seed});
        // the two ways across the gap, side by side: the pigeons and the train
        const ha=hw_io(tt,T.two-0.2,T.while,0.4,0.4);
        if(ha>0.004){c.save();c.globalAlpha*=ha;ag_about(c,x+w/2,y+130,lerp(0.7,1,Math.min(1,ag_spr((tt-T.two+0.2)/0.9,0,0.5))));md_card(c,x,y,w,250,{edge:HW.seed,glow:0.6});
          md_T(c,"ACROSS THE GAP",x+30,y+52,{w:800,size:28,ls:4,col:HW.seed});
          const bx=x+190,bw=w-240;for(const [k,lbl,v,col,t0] of [[0,"pigeons",2,HW.seed,T.two],[1,"train",8,HW_WHEN,T.six]]){const yy=y+112+k*68,u=ag_sine((tt-t0)/1.0);
            md_T(c,lbl,x+30,yy+10,{w:600,size:28,col:MD.soft});rr(c,bx,yy-14,bw*v/8*u,28,14);c.fillStyle=rgba(col,0.85);c.fill();
            md_T(c,(k?"about 8 hours":"about 2 hours"),bx+bw*v/8*u+(k?-16:16),yy+10,{w:700,size:28,align:k?"right":"left",col:k?MD.navy:MD.ink,a:ag_in(tt,t0+0.6,0.4)});}c.restore();}
        hw_tagAt(c,560,330,"until the wire was joined",tt,T.joined,T.fresh,{col:HW.seed,icon:"clock"});});}},
    // the university: three kinds of data, from where each is born to who acts on it; once a night, until September; now, each in time
    {at:T.fresh-0.3,place:"map",keys:[[0,960,540,1]],push:0.012,draw:(c,tt)=>{
      const on=[0,1,2].map(i=>clamp((tt-T.night-0.2-i*0.35)/1.0,0,1)),found=[0,1,2].map(i=>clamp((tt-T.serves+0.2-i*0.3)/0.8,0,1)),own=ag_in(tt,T.now,0.4);
      hw_rows(c,tt,{on,therm:ag_in(tt,T.night,0.6),temp:found,t:tt,night:1-own,a:1-ag_in(tt,T.br+0.1,0.8)});
      hw_scr(c,S,()=>{hw_when(c,S,"Until September",hw_io(tt,T.night,T.now,0.4,0.4));hw_when(c,S,"Now",ag_in(tt,T.now+0.1,0.4)*(1-ag_in(tt,T.br,0.6)));
        hw_cardAt(c,560,420,800,{kick:"Fresh enough",title:"There in time for whoever acts on it"},tt,T.whoever-0.2,T.night,{edge:MD.agreed});
        hw_tagAt(c,700,96,"once a night",tt,T.once,T.now,{col:MD.flow,icon:"clock"});
        hw_ghost(c,1100,96,"asked: “we want it live”",{a:hw_io(tt,T.live,T.now,0.4,0.5)});
        hw_pillAt(c,1630,607,"23 tutors paid late",tt,T.tutors,T.now,{col:MD.fail,icon:"cross"});
        hw_pillAt(c,1630,387,"two people's pay to a thief",tt,T.thief,T.now,{col:MD.fail,icon:"cross"});});}}
  ],0.6);
  md_title(ctx,S,t,T.br,"Hot, warm, cold","in time for whoever acts on it","FILM 2 OF 4 · DATA THAT MOVES");
});

/* ---------------------------------------------------------------- 2 · When someone acts */
scene("act",(ctx,S,t,sc)=>{
  const T={noor:wAt(sc,"noor","Noor"),q:wAt(sc,"noor","when does someone act"),prefer:sc.cues.prefer,yes:wAt(sc,"prefer","always say yes"),watch:sc.cues.watch,real:wAt(sc,"watch","real use"),
    open:wAt(sc,"watch","when people open"),next:wAt(sc,"watch","what they do next"),cold:wAt(sc,"cold","cold"),warm:wAt(sc,"warm","warm"),hot:wAt(sc,"hot","hot"),offer:sc.cues.offer,
    call:wAt(sc,"offer","the business's call"),contract:sc.cues.contract,fr:wAt(sc,"contract","how fresh"),act:wAt(sc,"contract","the action")};
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"night",keys:[[0,960,540,1]],push:0.015,draw:(c,tt)=>{
    md_person(c,"noor",360,800,0.95,{t:tt,gaze:[4,0]});
    hw_scr(c,S,()=>{hw_when(c,S,"September",ag_in(tt,0.6,0.5));md_nameTag(c,150,330,"noor",{col:MD.flow,a:ag_in(tt,T.noor-0.1,0.5)});
      // her one question, the answer asking gives, and what she looked at instead; then the three answers it leads to, one band each
      const qOut=ag_in(tt,T.cold-0.7,0.5);
      if(qOut<1){c.save();c.globalAlpha*=1-qOut;
        hw_cardAt(c,760,190,1080,{kick:"One question",title:"When does someone act on it?"},tt,T.q-0.1,null,{edge:MD.flow});
        hw_ghost(c,760,420,"asked “would you like it fresher?”: always yes",{a:ag_in(tt,T.yes-0.2,0.4)*(1-0.5*ag_in(tt,T.real,0.5))});
        hw_cardAt(c,760,500,1080,{kick:"Real use",title:"When it's opened, and what's done next",sub:"not the answer to a question"},tt,T.real,null,{edge:MD.agreed,icon:"eye"});c.restore();}
      const on=[(tt-T.hot+0.4)/1.0,(tt-T.warm+0.4)/1.0,(tt-T.cold+0.4)/1.0].map(v=>clamp(v,0,1));
      const cOut=ag_in(tt,T.contract-0.2,0.5);
      c.save();c.globalAlpha*=1-0.55*cOut;hw_bands(c,760,150,1080,{on,t:tt});c.restore();
      hw_tagAt(c,1290,104,"the platform offers all three",tt,T.offer,T.contract,{col:MD.flow,icon:"tick"});
      hw_tagAt(c,1240,676,"which one: the business's call",tt,T.call,T.contract,{col:MD.agreed,icon:"person"});
      // the answer for one kind of data, written into its contract: how fresh, and the action it's fresh for
      const k=(tt-T.contract-0.2)/0.9,a=ag_in(tt,T.contract+0.2,0.5);
      if(a>0.004){c.save();c.globalAlpha*=a;ag_about(c,1300,770,lerp(0.6,1,Math.min(1,ag_spr(k,0,0.5))));
        md_card(c,760,676,1080,190,{edge:MD.agreed,glow:0.8});md_icon(c,"contract",808,716,38,MD.agreed);
        md_T(c,"DATA CONTRACT · CONTRACTS",850,726,{w:800,size:28,ls:4,col:MD.agreed});
        withA(c,ag_in(tt,T.fr,0.4),()=>hw_pair(c,808,786,"fresh","within 5 minutes",{dx:130}));
        withA(c,ag_in(tt,T.act,0.4),()=>hw_pair(c,808,834,"for","claims approved by noon each Monday",{dx:130}));c.restore();}});}}],0.6);
});

/* ---------------------------------------------------------------- 3 · Cold */
scene("cold",(ctx,S,t,sc)=>{
  const T={rohan:wAt(sc,"rohan","Rohan"),mgr:wAt(sc,"rohan","the faculties' managers"),spent:wAt(sc,"rohan","what each faculty"),asked:sc.cues.asked,live:wAt(sc,"asked","wanted it live"),
    meeting:sc.cues.meeting,month:wAt(sc,"meeting","once a month"),move:wAt(sc,"meeting","money move"),enough:sc.cues.enough,view:wAt(sc,"enough","A view"),two:wAt(sc,"enough","each night at two"),
    seven:wAt(sc,"enough","by seven"),dbt:sc.cues.dbt,jun:wAt(sc,"dbt","Jun"),sched:wAt(sc,"dbt","its schedule"),tested:wAt(sc,"dbt","tested"),most:sc.cues.most,days:wAt(sc,"most","days and weeks"),
    small:wAt(sc,"most","a small part")};
  const FIN=[96,170,420],finP=[516,225],MV=[690,174,440],BARS=[1180,150,660];
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"map",later:true,keys:[[0,960,540,1]],push:0.012,draw:(c,tt)=>{
    const now=ag_in(tt,T.view-0.2,0.6);
    md_system(c,FIN[0],FIN[1],FIN[2],"fin",{a:ag_in(tt,T.spent-0.3,0.5)});
    // each night at two, one batch from the ledger to the view; the view ready to read by seven
    const bp=[BARS[0],BARS[1]+190];
    if(now>0.004){md_table(c,MV[0],MV[1],MV[2],{name:"spending_by_faculty",kind:"materialized view",lit:0.8*hw_io(tt,T.seven,T.dbt,0.4,0.6),a:now,k:(tt-T.view+0.2)/0.9});
      md_way(c,"batch",finP,[MV[0],MV[1]+52],tt,{a:now*ag_in(tt,T.two-0.2,0.5),every:4.6});
      md_lane(c,md_curve([MV[0]+MV[2],MV[1]+52],bp,{bend:0.5}),MD.flow,0.85*ag_in(tt,T.seven,0.5));}
    hw_bars(c,BARS[0],BARS[1],BARS[2],{a:ag_in(tt,T.spent-0.2,0.5),k:(tt-T.spent+0.2)/0.9,spent:HW_SPENT.map((v,i)=>ag_sine((tt-T.spent-0.2-i*0.15)/1.2)),edge:MD.dom.finance,col:MD.dom.finance});
    hw_scr(c,S,()=>{
      hw_when(c,S,"Each morning",hw_io(tt,0.6,T.asked,0.4,0.4));hw_when(c,S,"August",hw_io(tt,T.asked,T.meeting,0.4,0.4));hw_when(c,S,"Now",ag_in(tt,T.enough+0.1,0.4));
      md_nameTag(c,470,540,"rohan",{col:MD.sys.fin,a:ag_in(tt,T.rohan-0.1,0.5)});
      hw_tagAt(c,470,640,"and the faculties' managers",tt,T.mgr,T.asked,{col:HW_WHEN,icon:"person"});
      hw_ghost(c,700,330,"asked: “live, to the minute”",{a:hw_io(tt,T.live-0.2,T.enough,0.4,0.5)});
      hw_tagAt(c,700,420,"talked over once a month",tt,T.month,T.enough+0.2,{col:MD.agreed,icon:"person"});
      hw_tagAt(c,700,500,"budgets move only then",tt,T.move,T.enough+0.2,{col:MD.agreed,icon:"refresh"});
      hw_tagAt(c,540,330,"each night · 02:00",tt,T.two,T.most,{col:MD.flow,icon:"clock"});
      hw_tagAt(c,640,410,"ready by 07:00",tt,T.seven,T.dbt,{col:MD.flow,icon:"tick"});
      // Jun's dbt model: the view, and its schedule, in its own config
      const dA=hw_io(tt,T.dbt-0.1,T.most-0.1,0.5,0.5);
      if(dA>0.004){md_window(c,680,500,700,330,{logo:"dbt",product:"dbt",title:"spending_by_faculty.sql",a:dA,k:(tt-T.dbt+0.1)/0.9,draw:(cc,b)=>{
        hw_code(cc,b.x+16,b.y+44,[{s:"{{ config("},{s:"  materialized='materialized_view',"},{s:"  schedule={'cron': '0 0 2 * * ?'}"},{s:") }}"}],{hl:tt>T.sched?2:null,hlCol:MD.flow,w:640});
        md_T(cc,"Jun Park's model · tested like any other",b.x+16,b.y+b.h-20,{w:600,size:28,col:MD.soft,a:ag_in(tt,T.jun,0.4)});}});
        hw_pillAt(c,1530,780,"tests pass",tt,T.tested+0.2,T.most-0.1,{col:MD.pass,icon:"tick"});}
      hw_cardAt(c,680,520,1000,{kick:"Cold",title:"Most analysis: decided over days and weeks",sub:"a nightly run costs a small part of a stream"},tt,T.most+0.2,1e9,{edge:hw_band("cold").tint,kickCol:hw_band("cold").tint});});
    hw_personAt(c,"rohan",300,660,0.85,tt,0.3,1e9,{gaze:[4,-1]});}}],0.6);
});

/* ---------------------------------------------------------------- 4 · Warm */
// the claims app's page: the claims of one Monday morning, each with its unit and duty, and where it stands
const HW_CLAIMS=[["HI101","tutorial"],["HI101","marking"],["BU210","tutorial"],["EN110","tutorial"]];
function hw_claims(ctx,tt,o){o=o||{};const st=o.state||(()=>"waiting");return hw_app(ctx,1240,130,600,400,{rows:HW_CLAIMS.map((r,i)=>[r[0],r[1],st(i)]),a:o.a,k:o.k,lit:o.lit,litCol:o.litCol});}
scene("warm",(ctx,S,t,sc)=>{
  const T={app:wAt(sc,"claims","the claims app"),noon:wAt(sc,"claims","approved by noon"),checks:sc.cues.checks,contract:wAt(sc,"checks","contract"),hr:wAt(sc,"checks","another system"),
    change:sc.cues.change,ingrid:wAt(sc,"change","Ingrid's"),monday:wAt(sc,"change","on a Monday"),coord:wAt(sc,"change","coordinators approve"),night:sc.cues.night,once:wAt(sc,"night","once a night"),
    tues:wAt(sc,"night","on Tuesday"),late:sc.cues.late,tutors:wAt(sc,"late","twenty-three"),why:sc.cues.why,ideal:wAt(sc,"why","Ideally"),erp:wAt(sc,"why","the new E R P"),gap:sc.cues.gap,
    fills:wAt(sc,"gap","fills the gap"),pigeons:wAt(sc,"gap","as the pigeons did"),mix:sc.cues.mix,old:wAt(sc,"mix","old systems"),rare:wAt(sc,"mix","the ideal path is rare"),job:wAt(sc,"mix","part of the job"),
    push:sc.cues.push,made:wAt(sc,"push","as it's made"),zb:wAt(sc,"push","Zerobus"),five:sc.cues.five,stands:wAt(sc,"five","as it stands"),mon:sc.cues.monday,every:wAt(sc,"monday","every claim"),
    enough:sc.cues.enough,never:wAt(sc,"enough","never stops")};
  const HR=[96,170,420],TB=[720,174,400],tbR=[1120,226],appL=[1240,330],hrP=[516,225],tbL=[720,226];
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"map",later:true,keys:[[0,960,540,1]],push:0.012,draw:(c,tt)=>{
    const before=1-ag_in(tt,T.push-0.2,0.6),now=ag_in(tt,T.push,0.6),pipe=ag_in(tt,T.five-0.2,0.6);
    // the HR system, the platform's table of contracts, and the lanes between them and the claims app
    md_system(c,HR[0],HR[1],HR[2],"hr",{a:ag_in(tt,T.hr-0.2,0.5),lit:0.8*hw_io(tt,T.monday,T.night+0.6,0.4,0.6)+0.6*hw_io(tt,T.made,T.five,0.4,0.6)});
    if(pipe>0.004){c.save();c.globalAlpha*=pipe;md_card(c,690,118,460,196,{dash:true,edge:MD.flow,r:20});md_label(c,712,150,"Pipeline · every 5 minutes",{col:MD.flow});c.restore();}
    md_table(c,TB[0],TB[1],TB[2],{name:"contracts",kind:"table",lit:0.6*ag_in(tt,T.stands,0.6),a:ag_in(tt,T.contract-0.3,0.5)});
    const lanesA=ag_in(tt,T.hr,0.6),gapLit=hw_io(tt,T.fills,T.mix+0.6,0.4,0.6);
    // until September, a whole file once a night; now each change pushed as it's made, through Zerobus Ingest, and taken in every five minutes
    if(before>0.004)md_way(c,"batch",hrP,tbL,tt,{a:lanesA*before,every:3.2,flow:tt>T.once-0.4});
    if(now>0.004)md_way(c,"events",hrP,tbL,tt,{a:now,icon:ag_in(tt,T.zb-0.3,0.4)>0,iconA:ag_in(tt,T.zb-0.3,0.4),label:"Zerobus Ingest",labelBelow:128,every:0.8});
    // the app asks the platform for each claim's contract, and has its answer
    md_way(c,"api",tbR,appL,tt,{a:ag_in(tt,T.contract,0.5)});
    // the gap the platform fills, lit, with a pigeon over it, as in 1850
    if(gapLit>0.004){glow(c,900,300,420,MD.flow,0.18*gapLit);hw_flock(c,md_curve(hrP,appL,{bend:0.5}).map(p=>[p[0],p[1]-70]),tt,{a:ag_in(tt,T.pigeons-0.1,0.4)*(1-ag_in(tt,T.mix+0.4,0.5)),every:2.6,dur:2.6,s:0.9});}
    const ok=i=>i===3||tt>T.every+0.3+i*0.25;
    hw_claims(c,tt,{a:ag_in(tt,0.4,0.5),k:(tt-0.4)/0.9,state:i=>ok(i)?"approved":"waiting",lit:tt<T.enough?[0,1,2].filter(i=>ok(i)):null,litCol:MD.pass});
    hw_scr(c,S,()=>{
      hw_when(c,S,"Monday morning",hw_io(tt,T.monday,T.night,0.4,0.4));hw_when(c,S,"Until September",hw_io(tt,T.night,T.why,0.4,0.4));hw_when(c,S,"Now",hw_io(tt,T.push+0.1,T.mon,0.4,0.4));hw_when(c,S,"This Monday",hw_io(tt,T.mon,T.enough,0.4,0.4));
      hw_cardAt(c,1240,552,600,{kick:"Each pay day",title:"Approved by noon Monday",sub:"paid on Thursday"},tt,T.noon,T.night,{});
      md_nameTag(c,470,560,"ingrid",{col:MD.sys.hr,a:hw_io(tt,T.ingrid-0.1,T.night-0.3,0.5,0.5)});
      hw_tagAt(c,1240,720,"coordinators approve until noon",tt,T.coord,T.night,{col:MD.wait,icon:"person"});
      // the pay week: a change on Monday morning, claims close at noon, the night's load, pay day
      const tlA=hw_io(tt,T.night+0.3,T.why-0.2,0.5,0.6);
      if(tlA>0.004){const late=ag_in(tt,T.late,0.5);
        hw_timeline(c,330,700,1260,{a:tlA,t:tt,stops:[{t:"Monday 09:00",s:"a change in HR",col:MD.sys.hr},{t:"Monday 12:00",s:"claims close",col:mix(MD.wait,MD.fail,late),a:ag_in(tt,T.night+0.6,0.4)},
          {t:"Tuesday 02:00",s:"the night's load",col:MD.flow,a:ag_in(tt,T.once,0.4)},{t:"Thursday",s:"pay day",col:MD.ink,a:ag_in(tt,T.night+1.2,0.4)}],
          span:[{from:0,to:2*ag_sine((tt-T.tues)/1.4),col:MD.flow,dash:true,a:ag_in(tt,T.tues,0.3)}]});
        hw_pillAt(c,960,594,"23 tutors waited two more weeks for their pay",tt,T.tutors,T.why-0.2,{col:MD.fail,icon:"cross"});}
      // the ideal: one system, two years away; until then, the platform fills the gap; old beside new is the job
      const ea=hw_io(tt,T.ideal,T.push-0.2,0.5,0.5);
      if(ea>0.004){c.save();c.globalAlpha*=ea;md_card(c,330,600,1260,120,{dash:true,edge:MD.agreed,r:20});md_icon(c,"store",384,660,40,MD.agreed);
        md_T(c,"Contracts and claims in one system",430,650,{w:700,size:32});md_T(c,"the new ERP, in 2028",430,690,{w:600,size:28,col:MD.soft,a:ag_in(tt,T.erp,0.4)});c.restore();}
      hw_tagAt(c,620,350,"until then, the platform fills the gap",tt,T.fills,T.push-0.2,{col:MD.flow,icon:"connector"});
      hw_tagAt(c,330,790,"old systems beside new ones",tt,T.old,T.push-0.2,{col:HW_WHEN,icon:"store"});
      hw_tagAt(c,960,790,"working around the gaps: part of the job",tt,T.job,T.push-0.2,{col:HW_WHEN,icon:"tick"});
      hw_tagAt(c,930,380,"within 5 minutes",tt,T.stands+0.2,T.enough,{col:MD.flow,icon:"clock"});
      hw_pillAt(c,960,640,"11 contracts changed · every claim approved by noon",tt,T.every,T.enough-0.1,{col:MD.pass,icon:"tick"});
      hw_cardAt(c,480,600,960,{kick:"Warm",title:"Every 5 minutes: in time for a person",sub:"far less than a pipeline that never stops"},tt,T.enough+0.2,1e9,{edge:hw_band("warm").tint,kickCol:hw_band("warm").tint});});
    hw_personAt(c,"ingrid",270,660,0.85,tt,T.ingrid-0.3,T.night-0.4,{gaze:[4,-1]});}}],0.6);
});

/* ---------------------------------------------------------------- 5 · Hot */
const HW_SIGNIN=[150,210,200];
scene("hot",(ctx,S,t,sc)=>{
  const T={machine:sc.cues.machine,noone:wAt(sc,"machine","no person"),once:wAt(sc,"machine","at once"),aug:sc.cues.august,stole:wAt(sc,"august","stole"),bank:wAt(sc,"august","bank accounts"),
    eve:wAt(sc,"august","the night before"),stranger:sc.cues.stranger,weeks:wAt(sc,"stranger","three weeks"),report:sc.cues.report,gone:wAt(sc,"report","the money had gone"),rule:sc.cues.rule,
    moment:wAt(sc,"rule","the moment"),signin:wAt(sc,"rule","the sign-in"),hold:sc.cues.hold,device:wAt(sc,"hold","a new device"),second:wAt(sc,"hold","within a second"),confirm:wAt(sc,"hold","to confirm"),
    held:sc.cues.held,three:wAt(sc,"held","Three were"),notone:wAt(sc,"held","one was not"),only:sc.cues.only,what:wAt(sc,"only","only what changed"),full:wAt(sc,"only","The full record"),file:wAt(sc,"only","the nightly file"),
    costs:sc.cues.costs,beside:wAt(sc,"costs","the cold path"),most:wAt(sc,"costs","costs the most"),stops:wAt(sc,"costs","never stops"),few:sc.cues.few,now:wAt(sc,"few","act now")};
  const HR=[96,150,420],SG=[96,330,420],RULE=[690,190,520],PAY=[1360,190,460],hrP=[516,205],sgP=[516,385],ruleL=[690,262],ruleR=[1210,262],payL=[1360,245],COLD=[690,560,460];
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"map",later:true,keys:[[0,960,540,1]],push:0.012,draw:(c,tt)=>{
    const now=ag_in(tt,T.rule-0.2,0.6),ruleA=ag_in(tt,T.moment-0.2,0.6),coldA=ag_in(tt,T.full-0.2,0.6);
    md_system(c,HR[0],HR[1],HR[2],"hr",{a:ag_in(tt,T.bank-0.3,0.5),lit:0.8*hw_io(tt,T.bank,T.stranger,0.4,0.6)});
    md_system(c,SG[0],SG[1],SG[2],{n:"Sign-in service",s:"Who signed in, where",c:HW_SIGNIN},{a:ag_in(tt,T.signin-0.3,0.5)});
    md_system(c,PAY[0],PAY[1],PAY[2],{n:"Payroll system",s:"Each pay, each pay day",c:HW_PAYROLL},{a:ag_in(tt,T.eve-0.3,0.5),lit:0.8*hw_io(tt,T.second,T.held+0.4,0.3,0.6)});
    // August: the change goes through, and the pay goes with it; the morning's report finds it too late
    const augA=hw_io(tt,T.bank,T.rule-0.2,0.5,0.6);
    if(augA>0.004)md_way(c,"batch",hrP,payL,tt,{a:augA,col:MD.personal,every:3.6,pts:md_curve(hrP,payL,{bend:0.4}).map(p=>[p[0],p[1]-40])});
    // now: each change, and the sign-in behind it, the moment they happen, into a rule that acts within a second
    if(ruleA>0.004){c.save();c.globalAlpha*=ruleA;md_card(c,RULE[0],RULE[1],RULE[2],144,{edge:MD.flow,glow:0.7});md_icon(c,"event",RULE[0]+46,RULE[1]+56,40,MD.flow);
      md_T(c,"A rule, on each event",RULE[0]+92,RULE[1]+62,{w:700,size:30});md_T(c,"new device · close to pay day",RULE[0]+92,RULE[1]+104,{w:600,size:28,col:MD.soft,a:ag_in(tt,T.device,0.4)});c.restore();
      md_way(c,"events",hrP,ruleL,tt,{a:ruleA*now,col:MD.personal,every:0.45});md_way(c,"events",sgP,[ruleL[0],ruleL[1]+40],tt,{a:ruleA*ag_in(tt,T.signin,0.5),col:HW_SIGNIN,every:0.5});
      md_way(c,"api",ruleR,payL,tt,{a:ruleA*ag_in(tt,T.second-0.2,0.5)});}
    // the cold path beside it: the HR system's whole file, each night, with every correction
    if(coldA>0.004){md_table(c,COLD[0],COLD[1],COLD[2],{name:"bank_details",kind:"each night",col:MD.personal,icon:"lock",a:coldA,k:(tt-T.full+0.2)/0.9});
      md_way(c,"batch",[HR[0]+HR[2]/2,HR[1]+110],[COLD[0],COLD[1]+52],tt,{a:coldA,col:MD.personal,every:4.6,pts:md_curve([HR[0]+HR[2]-40,HR[1]+110],[COLD[0],COLD[1]+52],{bend:0.2})});}
    hw_scr(c,S,()=>{
      hw_when(c,S,"August",hw_io(tt,T.aug,T.rule,0.4,0.4));hw_when(c,S,"Now",hw_io(tt,T.rule+0.1,T.costs,0.4,0.4));
      hw_cardAt(c,690,560,1150,{kick:"Hot",title:"No person waiting to decide",sub:"the action comes at once, or it's useless"},tt,T.noone,T.aug,{edge:hw_band("hot").tint,kickCol:hw_band("hot").tint});
      hw_tagAt(c,96,520,"two passwords stolen",tt,T.stole,T.rule-0.2,{col:MD.fail,icon:"lock"});
      hw_tagAt(c,1360,350,"the night before pay day",tt,T.eve,T.rule-0.2,{col:HW_WHEN,icon:"clock"});
      hw_pillAt(c,1590,440,"pay to a stranger's account",tt,T.stranger,T.rule-0.2,{col:MD.fail,icon:"cross"});
      hw_tagAt(c,1360,520,"three weeks to be paid again",tt,T.weeks,T.rule-0.2,{col:HW_WHEN,icon:"clock"});
      const ra=hw_io(tt,T.report,T.rule-0.2,0.5,0.5);
      if(ra>0.004){md_reader(c,690,620,560,{title:"The next morning's report",sub:"the money had gone",icon:"doc",col:MD.ink,a:ra});md_icon(c,"cross",1210,672,34,MD.fail,{a:ra*ag_in(tt,T.gone,0.4)});}
      hw_tagAt(c,690,420,"within a second",tt,T.second,T.only,{col:MD.flow,icon:"clock"});
      hw_tagAt(c,1240,350,"holds that one pay · asks the person",tt,T.confirm-0.3,T.only,{col:MD.wait,icon:"person"});
      hw_pillAt(c,1480,450,"4 held · 3 confirmed within the hour · 1 stopped",tt,T.held+0.2,T.only,{col:MD.pass,icon:"tick"});
      hw_tagAt(c,690,420,"an event: only what changed",tt,T.what,T.costs,{col:MD.flow,icon:"event"});
      hw_tagAt(c,1180,612,"the full record, every correction",tt,T.file,T.costs,{col:MD.personal,icon:"lock"});
      hw_cardAt(c,480,700,960,{kick:"Hot",title:"Never alone: the cold path beside it",sub:"and the costliest, because it never stops"},tt,T.beside,T.few,{edge:hw_band("hot").tint,kickCol:hw_band("hot").tint});
      hw_cardAt(c,480,700,960,{kick:"Very few needs",title:"Keep hot for a machine that must act now"},tt,T.few+0.2,1e9,{edge:hw_band("hot").tint,kickCol:hw_band("hot").tint});});}}],0.6);
});

/* ---------------------------------------------------------------- 6 · In time to act */
scene("close",(ctx,S,t,sc)=>{
  const T={wire:sc.cues.wire,closed:wAt(sc,"wire","closed the gap"),no:wAt(sc,"wire","no longer needed"),london:sc.cues.london,lon:wAt(sc,"london","to London"),world:wAt(sc,"london","the world"),
    univ:sc.cues.university,three:sc.cues.three,c1:wAt(sc,"three","Spending"),c2:wAt(sc,"three","contracts"),c3:wAt(sc,"three","a bank account change"),today:sc.cues.today,
    take:sc.cues.takeaway,where:sc.cues.where,docs:sc.cues.docs,verbs:wAt(sc,"docs","then investigate"),next:sc.cues.next,br:sc.cues.breath};
  const A=HW_AT;
  ag_shots(ctx,S,t,sc.dur,[
    // 1851: the wire joined across the gap; the last pigeons fly home; Reuter's news goes on to London
    {at:0,place:"hwRoute",keys:[[0,860,480,1.15],[T.london-0.3,760,440,1.05]],d:2.0,push:0.01,draw:(c,tt)=>{
      hw_wire(c,HW_LANES.berlin,tt,{back:true,every:0.9});hw_wire(c,HW_LANES.paris,tt,{every:0.9});
      hw_wire(c,HW_LANES.gap,tt,{u:ag_sine((tt-T.closed+0.3)/1.4),every:0.7});
      hw_flock(c,HW_LANES.birds.slice().reverse(),tt,{a:1-ag_in(tt,T.no,0.8),every:1.8,dur:3.4,s:0.7});
      const la=ag_in(tt,T.lon-0.2,0.5);if(la>0.004){hw_wire(c,HW_LANES.london,tt,{a:la,u:ag_sine((tt-T.lon)/1.6),back:true,every:0.9});
        hw_pin(c,A.london[0],A.london[1],{col:MD.flow,label:{title:"London"},side:"below",a:la,k:(tt-T.lon)/0.9});}
      for(const [k,side] of [["aachen","below"],["berlin","left"],["paris","right"],["brussels","above"]])hw_pin(c,A[k][0],A[k][1],{col:k==="aachen"?HW.seed:MD.flow,label:{title:k[0].toUpperCase()+k.slice(1)},side});
      hw_when(c,S,"1851",ag_in(tt,0.6,0.5));
      hw_scr(c,S,()=>hw_tagAt(c,1150,600,"the gap closed: no pigeons needed",tt,T.no,T.london+0.2,{col:HW.seed,icon:"tick"}));}},
    // the university: each kind of data in time for whoever acts on it
    {at:T.univ-0.3,place:"map",keys:[[0,960,540,1]],push:0.012,draw:(c,tt)=>{
      hw_rows(c,tt,{on:[1,1,1],temp:[1,1,1],t:tt,hl:tt<T.c1?null:tt<T.c2?2:tt<T.c3?1:0,say:["within a second","every 5 minutes, until the ERP","each night"],
        sayA:[ag_in(tt,T.c3,0.4),ag_in(tt,T.c2,0.4),ag_in(tt,T.c1,0.4)]});
      hw_when(c,S,"The university",ag_in(tt,T.univ,0.5));}},
    {at:T.today-0.3,place:"night",keys:[[0,960,540,1]],push:0.015,draw:(c,tt)=>{
      hw_personAt(c,"linh",360,800,0.95,tt,-1,T.br,{gaze:[4,0]});
      hw_scr(c,S,()=>{hw_when(c,S,"Today · pay day",hw_io(tt,T.today,T.br,0.4,0.6));
        hw_cardAt(c,820,250,900,{kick:"Paid today",title:"2,960 people",sub:"856 of them casual staff, Linh among them"},tt,T.today+0.3,T.take-0.2,{edge:MD.pass});
        // what the film found: how fresh data must be is set by when someone acts on it
        const k=(tt-T.take)/0.9,a=hw_io(tt,T.take,T.where,0.5,0.5);
        if(a>0.004){c.save();c.globalAlpha*=a;ag_about(c,1270,420,lerp(0.85,1,Math.min(1,ag_spr(k,0,0.5))));md_card(c,820,300,900,220,{edge:MD.flow,glow:0.6});
          md_T(c,"How fresh data must be is set",1270,388,{w:700,size:40,align:"center"});md_T(c,"by when someone acts on it",1270,446,{w:700,size:40,align:"center",col:MD.flow});c.restore();}
        hw_cardAt(c,820,300,900,{kick:"Another question, for a later film",title:"Where data is kept, and for how long",sub:"Read often, kept close"},tt,T.where+0.2,T.docs,{edge:MD.soft});
        // the official docs, then investigate, adapt, implement, iterate
        const da=hw_io(tt,T.docs,T.next,0.5,0.5);
        if(da>0.004){c.save();c.globalAlpha*=da;md_card(c,820,240,900,320,{edge:MD.flow,glow:0.5});md_T(c,"Start from the official docs",880,310,{w:700,size:36});
          let x=880;for(const lg of["databricks","dbt"]){if(typeof LOGO!=="undefined"&&LOGO[lg])x+=logo(c,lg,x,350,48)+28;}
          let vx=880;["investigate","adapt","implement","iterate"].forEach((v,i)=>{md_T(c,v,vx,480,{w:700,size:32,col:MD.flow,a:ag_in(tt,T.verbs+i*0.35,0.4)});vx+=md_tw(c,v,{w:700,size:32})+56;});c.restore();}
        hw_cardAt(c,820,330,900,{kick:"Next",title:"One copy, one platform",sub:"one copy of the claims, for the app and for Finance"},tt,T.next+0.2,T.br,{edge:MD.flow});});}}
  ],0.6);
  md_end(ctx,S,t,T.br,"Hot, warm, cold","How fresh data must be is set by when someone acts on it.","Film 2 of 4","Data that moves");
});

// chapters that open in the room the one before ends in: the camera glides on, and what the last one shows leaves first
ag_cutInto(["warm","hot"]);
