/* ===== Hot, warm, cold: the scenes =====
   Seven chapters, each timed to its narration: wAt(sc, "line", "word") is the moment a word is said. The places are painted once
   (rk_places.js, and the module's map and night); what moves is drawn live in the shots of ag_shots. In one place the camera never
   jumps: most chapters are one shot on one place, its camera still, and what changes there fades or slides while the rest stays put.
   A new place dissolves in, since no two places here show the same people or words. Words drawn in the frame (dates, cards, pills)
   go through rk_scr, so they keep their size whatever the camera does, and come in once the camera has arrived. */

// a moment's date or time, at the top left of the frame
const RK_WHEN=[214,222,240];
function rk_when(ctx,S,text,a){if(!(a>0.004))return;rk_scr(ctx,S,()=>md_tag(ctx,96,96,text,{col:RK_WHEN,a}));}
// a card, pill or tag that comes in at t0 (cards and pills spring from their centre) and leaves at t1
function rk_cardAt(ctx,x,y,w,words,tt,t0,t1,o){const a=rk_io(tt,t0,t1==null?1e9:t1,0.4,0.4);if(a<=0.004)return;md_textCard(ctx,x,y,w,words,Object.assign({a,k:(tt-t0)/0.9},o||{}));}
function rk_pillAt(ctx,x,y,text,tt,t0,t1,o){const a=rk_io(tt,t0,t1==null?1e9:t1,0.35,0.4);if(a<=0.004)return;md_pill(ctx,x,y,text,Object.assign({a,k:(tt-t0)/0.9,size:28},o||{}));}
function rk_tagAt(ctx,x,y,text,tt,t0,t1,o){const a=rk_io(tt,t0,t1==null?1e9:t1,0.35,0.4);if(a<=0.004)return;md_tag(ctx,x,y,text,Object.assign({a},o||{}));}
// a person who comes in at t0 and leaves at t1, faded as one picture (md_person draws them whole, then lays them on at the context's opacity)
function rk_personAt(ctx,who,x,y,s,tt,t0,t1,o){const a=rk_io(tt,t0,t1==null?1e9:t1,0.6,0.6);if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;md_person(ctx,who,x,y,s,Object.assign({t:tt},o||{}));ctx.restore();}
// the night laid softly over the frame, for a turn in the story
function rk_dim(ctx,S,a){if(!(a>0.004))return;rk_scr(ctx,S,()=>{ctx.fillStyle="rgba(4,8,18,"+clamp(a,0,1).toFixed(3)+")";ctx.fillRect(0,0,W,H);});}
// two words, a label and its value, on one line of a card
function rk_pair(ctx,x,y,k,v,o){o=o||{};md_T(ctx,k,x,y,{w:600,size:28,col:MD.soft});md_T(ctx,v,x+(o.dx||200),y,{w:700,size:28,col:o.col||MD.ink});}

/* ---------------------------------------------------------------- 1 · The seed vault */
// the opening's lanes on the map: Aleppo's copies up to Svalbard, the copies sent back down to Lebanon and to Morocco, and the seeds a
// gene bank sends out to breeders
const rk_bz=(a,b,c,d)=>bez(P(a[0],a[1]),P(b[0],b[1]),P(c[0],c[1]),P(d[0],d[1]),40).map(p=>[p.x,p.y]);
const RK_LANES={up:rk_bz([1069,773],[1190,560],[1010,190],[765,120]),toLeb:rk_bz([765,120],[1010,190],[1180,560],[1065,811]),
  toMor:rk_bz([765,120],[560,250],[400,560],[471,814]),out:[[1300,690],[880,700],[1215,860]].map(p=>rk_arc([1069,773],p,50))};
// a few of the world's gene banks, unnamed: points of warm light
const RK_BANKS=[[612,606],[700,560],[842,520],[560,690],[930,640],[1180,612],[1340,520],[760,470]];

scene("vault",(ctx,S,t,sc)=>{
  const T={deep:wAt(sc,"feb","Deep"),open:wAt(sc,"feb","a vault opens"),copies:sc.cues.copies,minus:wAt(sc,"copies","minus eighteen"),from:wAt(sc,"copies","from gene banks"),
    banks:sc.cues.banks,breed:wAt(sc,"banks","so breeders"),aleppo:sc.cues.aleppo,samples:wAt(sc,"aleppo","samples"),send:sc.cues.send,toV:wAt(sc,"send","to the vault"),
    lost:sc.cues.lost,war:sc.cues.war,leave:wAt(sc,"war","had to leave"),noSend:wAt(sc,"war","no longer send"),risk:sc.cues.risk,every:wAt(sc,"risk","every variety"),
    change:sc.cues.unless,ask:sc.cues.ask,asked:wAt(sc,"ask","they asked"),sown:sc.cues.sown,out:wAt(sc,"sown","came out"),nov:wAt(sc,"sown","that November"),
    gone:sc.cues.gone,few:sc.cues.few,again:wAt(sc,"few","breeders can order"),kept:sc.cues.kept,far:wAt(sc,"kept","their copies"),
    data:sc.cues.data,same:wAt(sc,"data","the same way"),alike:sc.cues.alike,daily:wAt(sc,"alike","every day"),once7:wAt(sc,"alike","once in seven years"),
    costly:sc.cues.costly,never:wAt(sc,"costly","none was ever"),riskC:wAt(sc,"costly","a risk"),now:sc.cues.now,follows:wAt(sc,"now","follows how often"),br:sc.cues.breath};
  const A=RK_AT,CARD=[1290,150,560];
  ag_shots(ctx,S,t,sc.dur,[
    // February 2008: Svalbard in the polar night, the mountain cut open; the vault's door, its tunnel and its halls light, and the copies come in
    {at:0,place:"rkVault",keys:[[0,700,610,1.5],[T.deep-0.5,960,540,1]],d:4.2,push:0.015,draw:(c,tt)=>{
      const op=ag_in(tt,T.open-0.1,0.7);
      if(op>0){glow(c,525,680,110,RK.frost,0.5*op);c.save();c.globalAlpha*=op;rr(c,511,653,28,54,1);c.fillStyle=rgba(RK.frost,0.6);c.fill();c.restore();}
      rk_vaultLive(c,tt,{tunnel:ag_sine((tt-T.open)/1.6),halls:ag_sine((tt-T.open-0.8)/1.4),boxes:clamp((tt-T.copies)/3.4,0,1),cold:ag_in(tt,T.minus,1.8)});
      if(tt>T.from-0.3)md_flow(c,RK_VAULT.tunnel,tt,{kind:"batch",col:RK.seed,every:0.9,dur:1.6,size:0.5,a:rk_io(tt,T.from-0.2,T.banks,0.5,0.4)});
      rk_tempTag(c,1544,566,"cold",{text:"minus 18 °C",align:"center",a:ag_in(tt,T.minus,0.5),k:(tt-T.minus)/0.9});
      rk_when(c,S,"Svalbard · February 2008",ag_in(tt,0.9,0.6));}},
    // the world's gene banks, the vault far north, and the bank near Aleppo: its copies sent up to the vault, its seeds out to breeders
    {at:T.banks-0.35,place:"rkWorld",keys:[[0,960,540,1]],push:0.012,draw:(c,tt)=>{
      const war=ag_in(tt,T.leave,1.2),stop=ag_in(tt,T.noSend,0.8),ask=ag_in(tt,T.asked,0.6),sown=ag_in(tt,T.out,0.5);
      RK_BANKS.forEach(([x,y],i)=>{const a=ag_in(tt,T.banks+0.5+i*0.18,0.5)*(1-0.6*ag_in(tt,T.aleppo,0.6));if(a>0.004){glow(c,x,y,22,RK.seed,0.5*a);c.fillStyle=rgba(RK.seed,0.85*a);c.beginPath();c.arc(x,y,4.5,0,TAU);c.fill();}});
      // the seeds the bank sends out to breeders, until the war
      RK_LANES.out.forEach((pts,i)=>{const a=ag_in(tt,T.samples+0.4+i*0.25,0.6)*(1-stop);if(a<=0.004)return;md_lane(c,pts,RK.seed,0.55*a,{u:ag_sine((tt-T.samples-0.4-i*0.25)/1.2)});
        if(tt>T.samples+1.6)rk_seeds(c,pts,tt,{every:1.4,dur:1.8,a,size:0.45,off:i*0.5});});
      withA(c,ag_in(tt,T.samples+1.2,0.5)*(1-stop),()=>md_T(c,"to breeders",1318,676,{w:600,size:28,col:MD.soft}));
      // its copies, up to the vault, from 2008, until it can't send them
      const upA=ag_in(tt,T.send+0.2,0.5)*(1-0.85*stop);
      if(upA>0.004){md_lane(c,RK_LANES.up,RK.seed,0.75*upA,{u:ag_sine((tt-T.send-0.2)/1.6)});if(tt>T.send+1.4)rk_seeds(c,RK_LANES.up,tt,{every:1.5,dur:2.6,a:upA*(1-stop)});}
      rk_tagAt(c,1124,452,"copies, from 2008",tt,T.send+0.9,T.lost,{col:RK.seed});
      // 2015: the keepers, now in Lebanon, ask the vault for their copies; the copies come down to Lebanon and to Morocco
      if(ask>0.004&&sown<1)md_way(c,"api",[1065,811],[765,120],tt,{pts:RK_LANES.toLeb.slice().reverse(),col:RK.seed,a:ask*(1-sown)});
      if(sown>0.004){for(const [pts,o] of [[RK_LANES.toLeb,0],[RK_LANES.toMor,0.7]]){md_lane(c,pts,RK.seed,0.8*sown,{u:ag_sine((tt-T.out-o*0.4)/1.4)});if(tt>T.out+1.2)rk_seeds(c,pts,tt,{every:0.9,dur:2.2,off:o});}}
      rk_pin(c,A.svalbard[0],A.svalbard[1],{col:RK.frost,lit:1,label:{title:"Svalbard",sub:"the seed vault"},side:"above",a:ag_in(tt,T.banks+0.2,0.5),k:(tt-T.banks-0.2)/0.9});
      rk_pin(c,A.aleppo[0],A.aleppo[1],{col:RK.seed,lit:1-0.85*war,label:{title:"Aleppo"},side:"left",labelA:1-ag_in(tt,T.ask,0.5),a:ag_in(tt,T.aleppo+0.2,0.5),k:(tt-T.aleppo-0.2)/0.9});
      rk_pin(c,A.terbol[0],A.terbol[1],{col:RK.seed,lit:1,label:{title:"Lebanon"},side:"right",a:ag_in(tt,T.ask+0.4,0.5),k:(tt-T.ask-0.4)/0.9});
      rk_pin(c,A.rabat[0],A.rabat[1],{col:RK.seed,lit:1,label:{title:"Morocco"},side:"above",a:ag_in(tt,T.out+0.6,0.5),k:(tt-T.out-0.6)/0.9});
      rk_dim(c,S,0.45*rk_io(tt,T.change-0.1,T.ask-0.5,0.6,0.8));
      rk_scr(c,S,()=>{const [x,y,w]=CARD;
        rk_when(c,S,"2008",rk_io(tt,T.send,T.war,0.4,0.4));rk_when(c,S,"2012",rk_io(tt,T.war,T.ask,0.4,0.4));rk_when(c,S,"2015",ag_in(tt,T.ask,0.4));
        rk_cardAt(c,x,y,w,{kick:"Gene banks",title:"Seeds of crops and their wild relatives",sub:"so breeders can grow crops that stand drought and disease"},tt,T.banks+0.5,T.aleppo,{edge:RK.seed});
        rk_cardAt(c,x,y,w,{kick:"A gene bank near Aleppo",title:"141,052 samples",sub:"wheat, barley, lentils and chickpeas, from the world's dry lands"},tt,T.aleppo+0.5,T.lost-0.1,{edge:RK.seed});
        rk_cardAt(c,x,y,w,{title:"A gene bank can be lost",sub:"to war, flood or a power cut, and a variety lost is lost for good"},tt,T.lost+0.3,T.war-0.1,{icon:"warn"});
        rk_cardAt(c,x,y,w,{kick:"2012",title:"Most of the keepers leave",sub:"and no seeds go out"},tt,T.leave,T.risk-0.1,{});
        rk_cardAt(c,x,y,w,{title:"Every variety at risk",sub:"breeders can't get the seeds they relied on"},tt,T.risk+0.3,T.change+0.6,{icon:"warn"});
        rk_cardAt(c,x,y,w,{kick:"2015",title:"They ask for their copies",sub:"no one had done it before"},tt,T.asked+0.2,T.sown-0.1,{edge:RK.seed});
        rk_cardAt(c,x,y,w,{kick:"Out of the mountain",title:"38,073 samples"},tt,T.out,1e9,{edge:RK.seed});});}},
    // November 2015: the copies sown in Lebanon and Morocco; by 2020 nothing is left in Aleppo, yet few samples are lost
    {at:T.nov-0.25,place:"rkFields",keys:[[0,960,560,1]],push:0.03,draw:(c,tt)=>{
      rk_shoots(c,ag_sine((tt-T.nov)/3.2),{ripe:ag_sine((tt-T.again+0.6)/4)});
      rk_scr(c,S,()=>{rk_when(c,S,"Lebanon and Morocco · November 2015",rk_io(tt,T.nov+0.3,T.gone,0.5,0.4));rk_when(c,S,"2020",ag_in(tt,T.gone,0.4));
        rk_cardAt(c,610,170,700,{title:"Nothing left in Aleppo",sub:"of the collection that was kept there"},tt,T.gone+0.2,T.few,{});
        rk_cardAt(c,610,170,700,{title:"1,657 of 141,052 samples lost",sub:"and breeders can order its seeds again"},tt,T.few+0.2,T.kept-0.1,{edge:RK.seed});
        rk_tempTag(c,960,236,"warm",{text:"in use · close and ready",align:"center",a:ag_in(tt,T.kept+0.1,0.5),k:(tt-T.kept-0.1)/0.9});});}},
    // their copies, frozen far away
    {at:T.far-0.25,place:"rkVault",keys:[[0,1280,610,1.2]],push:0.02,draw:(c,tt)=>{
      c.save();c.globalAlpha*=1;glow(c,525,680,90,RK.frost,0.3);c.restore();
      rk_vaultLive(c,tt,{tunnel:1,halls:1,boxes:1,cold:1});
      rk_scr(c,S,()=>rk_tempTag(c,1180,250,"cold",{text:"copies · frozen far away",align:"center",a:ag_in(tt,T.far+0.3,0.5),k:(tt-T.far-0.3)/0.9}));}},
    // the university: every year of pay records on one shelf, the costliest, read every day or once in seven years; now, kept as it's read
    {at:T.data-0.3,place:"map",keys:[[0,960,540,1]],push:0.012,draw:(c,tt)=>{const out=1-ag_in(tt,T.br+0.1,0.8);c.save();c.globalAlpha*=out;
      rk_shelf(c,60,526,1500,"One storage for all","the costliest",{a:ag_in(tt,T.data+0.4,0.5)*(1-ag_in(tt,T.follows-0.3,0.5))});
      rk_shelf(c,60,526,1500,"Hot tier","read often",{a:ag_in(tt,T.follows-0.3,0.5)});
      rk_shelf(c,60,746,1500,"Archive tier","rarely read",{cold:true,a:ag_in(tt,T.follows,0.5)});
      const sink=RK_YEARS.map((y,i)=>i<10?0.85*ag_sine((tt-T.follows-0.3-i*0.12)/1.0):0),
        read=RK_YEARS.map((y,i)=>i===10?rk_io(tt,T.daily,T.costly,0.3,0.5):i===0?rk_io(tt,T.once7,T.costly,0.3,0.5):0);
      const yc=rk_years(c,130,{years:RK_YEARS,top:520,low:740,sink,read,a:ag_in(tt,T.data+0.6,0.6)});c.restore();
      rk_scr(c,S,()=>{rk_when(c,S,"Until September",rk_io(tt,T.alike,T.now,0.4,0.4));rk_when(c,S,"Now",ag_in(tt,T.now+0.1,0.4)*(1-ag_in(tt,T.br,0.6)));
        rk_tagAt(c,yc[10][0]-180,250,"read every day",tt,T.daily,T.costly,{col:MD.flow,icon:"eye"});
        rk_tagAt(c,yc[0][0]-40,250,"read once in seven years",tt,T.once7,T.costly,{col:RK_WHEN,icon:"eye"});
        rk_tagAt(c,96,250,"none ever deleted",tt,T.never,T.now,{col:RK_WHEN,icon:"warn"});
        rk_tagAt(c,520,250,"a risk to everyone in them",tt,T.riskC,T.now,{col:MD.personal,icon:"lock"});
        rk_pillAt(c,960,180,"kept as it's read",tt,T.follows+0.4,T.br,{col:MD.pass,icon:"tick"});});}}
  ],0.6);
  md_title(ctx,S,t,T.br,"Read often, kept close","where data lives, and for how long","FILM 4 OF 4 · DATA THAT MOVES");
});

/* ---------------------------------------------------------------- 2 · Read often, or rarely */
scene("tiers",(ctx,S,t,sc)=>{
  const T={noor:wAt(sc,"noor","Noor"),second:wAt(sc,"noor","a second question"),often:wAt(sc,"noor","how often is it read"),names:sc.cues.names,hot:wAt(sc,"names","named hot"),
    cool:wAt(sc,"names","cool"),cold:wAt(sc,"names","cold and"),arch:wAt(sc,"names","archive"),after:wAt(sc,"names","after how often"),not:sc.cues.not,acts:wAt(sc,"not","when someone acts"),
    reads:wAt(sc,"not","how often anyone reads"),cost:sc.cues.cost,keep:wAt(sc,"cost","less to keep"),read:wAt(sc,"cost","more to read"),hours:wAt(sc,"cost","takes hours"),
    rule:sc.cues.rule,rOften:wAt(sc,"rule","what's read often"),rRare:wAt(sc,"rule","what's rarely read"),long:sc.cues.long,law:wAt(sc,"long","the law and the business"),contract:wAt(sc,"long","the data's contract")};
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"night",keys:[[0,960,540,1]],push:0.015,draw:(c,tt)=>{
    md_person(c,"noor",360,800,0.95,{t:tt,gaze:[4,0]});
    rk_scr(c,S,()=>{rk_when(c,S,"September",ag_in(tt,0.6,0.5));md_nameTag(c,150,330,"noor",{col:MD.flow,a:ag_in(tt,T.noor-0.1,0.5)});
      // her second question, after how fresh it must be
      const qa=rk_io(tt,T.second-0.1,T.names-0.3,0.5,0.5);
      if(qa>0.004){c.save();c.globalAlpha*=qa;md_T(c,"First: how fresh must it be?",760,170,{w:600,size:28,col:MD.soft});c.restore();
        rk_cardAt(c,760,210,1080,{kick:"A second question",title:"How often is it read?"},tt,T.often-0.2,T.names-0.3,{edge:MD.flow});}
      // the cloud's tiers, named by how often data is read; what each costs to keep and to read, and how soon a file comes back
      const on=[T.hot,T.cool,T.cold,T.arch].map(v=>clamp((tt-v+0.2)/0.8,0,1)),hl=tt>T.rOften&&tt<T.rRare?0:tt>=T.rRare&&tt<T.long?3:null;
      const ta=1-0.55*ag_in(tt,T.long-0.2,0.5);
      rk_tiers(c,760,130,1080,{on,cols:ag_in(tt,T.keep-0.2,0.8),hl,a:ta*ag_in(tt,T.hot-0.4,0.5)});
      // the names sound like temperature, but answer another question
      const na=rk_io(tt,T.not,T.cost,0.4,0.5);
      if(na>0.004){c.save();c.globalAlpha*=na;const s1="not \u201cwhen does someone act on it?\u201d",s2="but \u201chow often does anyone read it?\u201d";
        md_card(c,760,640,1080,150,{edge:MD.agreed,glow:0.5});md_T(c,s1,800,700,{w:600,size:30,col:MD.soft});withA(c,ag_in(tt,T.reads,0.4),()=>md_T(c,s2,800,750,{w:700,size:32,col:MD.agreed}));c.restore();}
      rk_tagAt(c,1360,640,"hours to bring a file back",tt,T.hours,T.rule,{col:MD.wait,icon:"clock"});
      rk_tagAt(c,760,690,"read often: where reading is cheap",tt,T.rOften,T.long,{col:MD.flow,icon:"eye"});
      rk_tagAt(c,760,760,"rarely read: where keeping is cheap",tt,T.rRare,T.long,{col:RK.frost,icon:"clock"});
      // how long it's kept at all, set by the law and the business, in the data's contract
      const k=(tt-T.contract-0.2)/0.9,a=ag_in(tt,T.contract-0.2,0.5);
      if(a>0.004){c.save();c.globalAlpha*=a;c.translate(0,24*(1-Math.min(1,ag_spr(k,0,0.5))));
        md_card(c,760,676,1080,190,{edge:MD.agreed,glow:0.8});md_icon(c,"contract",808,716,38,MD.agreed);
        md_T(c,"DATA CONTRACT · PAY RECORDS",850,726,{w:800,size:28,ls:4,col:MD.agreed});
        rk_pair(c,808,786,"read","often for a year, then rarely",{dx:130});
        rk_pair(c,808,834,"kept","7 years after each contract ends, then deleted",{dx:130});c.restore();}
      rk_tagAt(c,1290,620,"set by the law and the business",tt,T.law,T.contract,{col:MD.agreed,icon:"doc"});});}}],0.6);
});


/* ---------------------------------------------------------------- 3 · Pay records */
const RK_YEARS=["2016","2017","2018","2019","2020","2021","2022","2023","2024","2025","2026"];
scene("records",(ctx,S,t,sc)=>{
  const T={records:sc.cues.records,payday:wAt(sc,"records","Every pay day"),hours:wAt(sc,"records","with the hours"),law:sc.cues.law,seven:wAt(sc,"law","seven years"),rarely:wAt(sc,"law","rarely read"),
    before:sc.cues.before,costliest:wAt(sc,"before","the hot tier"),none:wAt(sc,"before","none was ever"),
    archive:sc.cues.archive,written:wAt(sc,"archive","a year after"),tier:wAt(sc,"archive","archive tier"),cheapest:wAt(sc,"archive","the cheapest"),vault:sc.cues.vault,sleep:wAt(sc,"vault","they sleep"),
    told:sc.cues.told,recent:wAt(sc,"told","queries for recent pay"),archived:wAt(sc,"told","one that needs"),which:wAt(sc,"told","which files"),back:sc.cues.hours,audit:wAt(sc,"hours","an audit"),
    turn:sc.cues.seven,date:wAt(sc,"seven","on a date"),removed:wAt(sc,"seven","removed for good"),oct:sc.cues.october,oldest:wAt(sc,"october","the oldest"),gone:wAt(sc,"october","were deleted"),
    privacy:sc.cues.privacy};
  const PAY=[96,150,420],payP=[516,205],REC=[700,154,460],TOP=520,LOW=740;
  // the shelves, the years on them, and what sank, was read or went: the same picture before and after the vault
  const shelves=(c,tt)=>{
    rk_shelf(c,60,TOP+6,1500,"Hot tier","read often, costliest",{a:ag_in(tt,T.costliest-0.4,0.5)});rk_shelf(c,60,LOW+6,1500,"Archive tier","rarely read, cheapest",{cold:true,a:ag_in(tt,T.tier-0.4,0.5)});
    const sink=RK_YEARS.map((y,i)=>i<10?ag_sine((tt-T.written-0.2-i*0.22)/1.0):0),gone=RK_YEARS.map((y,i)=>i<3?ag_in(tt,T.gone+i*0.3,0.8):0),
      read=RK_YEARS.map((y,i)=>i===10?ag_in(tt,T.rarely-0.2,0.5)*(1-ag_in(tt,T.before,0.5))+rk_io(tt,T.recent,T.archived,0.3,0.4):i===5?rk_io(tt,T.which,T.turn,0.3,0.5):0);
    const lift=ag_sine((tt-T.back-0.2)/1.4)*(1-ag_in(tt,T.turn,0.8));sink[5]=sink[5]*(1-0.35*lift);
    return rk_years(c,130,{years:RK_YEARS,top:TOP,low:LOW,sink,gone,read,a:ag_in(tt,T.payday,0.6)});};
  const ui=(c,tt)=>{
    md_system(c,PAY[0],PAY[1],PAY[2],{n:"Payroll system",s:"Each pay, each pay day",c:RK_PAYROLL},{a:ag_in(tt,0.5,0.5)});
    md_table(c,REC[0],REC[1],REC[2],{name:"pay_records",kind:"table",col:MD.personal,icon:"lock",a:ag_in(tt,T.payday,0.5),lit:0.7*rk_io(tt,T.told,T.back,0.4,0.6)});
    md_way(c,"batch",payP,[REC[0],REC[1]+52],tt,{col:MD.personal,a:ag_in(tt,T.payday+0.2,0.5),every:2.6});};
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"map",later:true,keys:[[0,960,540,1]],push:0.01,draw:(c,tt)=>{ui(c,tt);shelves(c,tt);
      rk_scr(c,S,()=>{rk_when(c,S,"Every pay day",rk_io(tt,T.payday,T.before,0.4,0.4));rk_when(c,S,"Until September",rk_io(tt,T.before,T.archive,0.4,0.4));rk_when(c,S,"Now",ag_in(tt,T.archive+0.1,0.4));
        rk_tagAt(c,1200,206,"with each casual tutor's hours",tt,T.hours,T.law,{col:MD.personal,icon:"lock"});
        rk_tagAt(c,1200,206,"the law: kept 7 years",tt,T.seven,T.before,{col:RK_WHEN,icon:"doc"});
        rk_tagAt(c,1200,300,"after the first year, rarely read",tt,T.rarely,T.before,{col:RK_WHEN,icon:"eye"});
        rk_tagAt(c,96,350,"none ever deleted",tt,T.none,T.archive,{col:RK_WHEN,icon:"warn"});
        rk_tagAt(c,96,350,"a year after it's written",tt,T.written,T.vault-0.3,{col:RK.frost,icon:"clock"});});}},
    // like the copies on Svalbard, they sleep until someone needs them
    {at:T.vault-0.3,place:"rkVault",keys:[[0,1280,610,1.2]],push:0.02,draw:(c,tt)=>{rk_vaultLive(c,tt,{tunnel:1,halls:1,boxes:1,cold:1});
      rk_scr(c,S,()=>rk_tempTag(c,1180,250,"cold",{text:"asleep until they're needed",align:"center",a:ag_in(tt,T.sleep,0.5),k:(tt-T.sleep)/0.9}));}},
    // the table is told: recent pay still runs; an archived year says which files to bring back; hours, fine for an audit; deleted at seven
    {at:T.told-0.35,place:"map",keys:[[0,960,540,1]],push:0.01,draw:(c,tt)=>{ui(c,tt);const yc=shelves(c,tt);
      rk_scr(c,S,()=>{rk_when(c,S,"Now",rk_io(tt,0,T.oct,0.4,0.4));rk_when(c,S,"October 2026",ag_in(tt,T.oct,0.4));
        const pa=rk_io(tt,T.told+0.2,T.oct,0.5,0.5);
        if(pa>0.004){const s="delta.timeUntilArchived = '365 days'",w=md_tw(c,s,{w:500,size:28,f:"mono"})+56;md_card(c,1180,178,w,56,{edge:MD.personal,r:14,a:pa});md_T(c,s,1208,216,{w:500,size:28,f:"mono",a:pa});
          md_lane(c,[[REC[0]+REC[2],206],[1180,206]],MD.personal,0.7*pa,{dash:true});}
        rk_pillAt(c,yc[10][0],yc[10][1]-150,"recent pay: runs",tt,T.recent+0.2,T.archived,{col:MD.pass,icon:"tick"});
        const fa=rk_io(tt,T.which,T.turn,0.4,0.5);
        if(fa>0.004){c.save();c.globalAlpha*=fa;ag_about(c,620,380,lerp(0.6,1,Math.min(1,ag_spr((tt-T.which)/0.9,0,0.5))));md_card(c,300,300,640,160,{edge:MD.wait,glow:0.6});
          md_T(c,"2021 · FILES TO BRING BACK",328,344,{w:800,size:28,ls:3,col:MD.wait});
          ["part-00003.parquet","part-00017.parquet"].forEach((f,i)=>md_T(c,f,328,394+i*44,{w:500,size:28,f:"mono"}));c.restore();}
        rk_tagAt(c,980,440,"hours · fine for an audit",tt,T.back+0.2,T.turn,{col:MD.wait,icon:"clock"});
        rk_tagAt(c,490,400,"7 years after each contract ends, then deleted",tt,T.turn+0.4,T.privacy-0.2,{col:MD.agreed,icon:"contract"});
        rk_cardAt(c,1240,130,600,{kick:"Data protection",title:"Deleting well",sub:"is for the films on data protection"},tt,T.privacy+0.2,1e9,{edge:MD.personal,icon:"lock"});});}}
  ],0.6);
});

/* ---------------------------------------------------------------- 4 · One record's years */
// three shelves, top to bottom: where Linh's pay record lives as it ages, and what happens to it there
const RK_STEPS=[{n:"Hot tier",l:"read often",s:"her payslip, a question, the year's end"},{n:"Archive tier",l:"a year on, rarely read",s:"back in hours, for an audit"},
  {n:"Deleted",l:"7 years after her contract ends",s:"its files removed for good"}];
scene("years",(ctx,S,t,sc)=>{
  const T={ages:sc.cues.ages,linh:wAt(sc,"linh","Linh's"),written:wAt(sc,"linh","is written"),often:wAt(sc,"linh","read often"),year:sc.cues.year,moves:wAt(sc,"year","moves to"),small:wAt(sc,"year","a small part"),
    audit:sc.cues.audit,back:wAt(sc,"audit","comes back"),seven:sc.cues.seven,deleted:wAt(sc,"seven","it's deleted"),removed:wAt(sc,"seven","removed for good"),follow:sc.cues.follow};
  const BX=760,BY=150,BH=150,GAP=20,CX=1380;
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"night",keys:[[0,960,540,1]],push:0.015,draw:(c,tt)=>{
    md_person(c,"linh",360,800,0.95,{t:tt,gaze:[4,0]});
    rk_scr(c,S,()=>{md_nameTag(c,150,330,"linh",{a:ag_in(tt,T.linh-0.1,0.5)});
      rk_when(c,S,"Today · pay day",rk_io(tt,T.linh,T.year,0.4,0.4));rk_when(c,S,"A year from now",rk_io(tt,T.year,T.seven,0.4,0.4));rk_when(c,S,"Seven years after her contract ends",ag_in(tt,T.seven,0.4));
      const step=ag_sine((tt-T.moves+0.2)/1.4)+ag_sine((tt-T.deleted+0.2)/1.4),hl=tt<T.follow?Math.min(2,Math.round(step)):null;
      RK_STEPS.forEach((b,i)=>{const k=clamp((tt-T.ages-0.2-i*0.3)/0.9,0,1);if(k<=0.004)return;const y=BY+i*(BH+GAP),dim=hl==null?1:hl===i?1:0.42;
        c.save();c.globalAlpha*=ag_in(k,0,0.35)*dim;ag_about(c,BX+540,y+BH/2,lerp(0.94,1,Math.min(1,ag_spr(k,0,0.5))));
        md_card(c,BX,y,1080,BH,{edge:i===0?[214,222,240]:i===1?RK.frost:MD.dim,glow:0.5,fill:"rgba(11,19,38,0.94)"});if(i===1)rk_frost(c,BX,y,1080,BH,0.55,18);
        md_T(c,b.n.toUpperCase(),BX+40,y+54,{w:800,size:32,ls:5,col:i===1?RK.frost:MD.ink});md_T(c,b.l,BX+40,y+96,{w:600,size:28});md_T(c,b.s,BX+40,y+134,{w:600,size:28,col:MD.soft});c.restore();});
      // Linh's pay record, moving down as it ages, cooling, then gone
      const y=BY+step*(BH+GAP),temp=lerp(1,0,Math.min(1,step)),gone=ag_in(tt,T.removed,1.0),ca=ag_in(tt,T.written-0.3,0.5)*(1-gone);
      const state=tt<T.moves?"read often":tt<T.deleted?"archived":"deleted";
      if(ca>0.004)rk_claim(c,CX,y+8,{kick:"LINH'S PAY RECORD",title:"Pay, 5 November 2026",temp,state,w:440,a:ca,k:(tt-T.written+0.3)/0.9});
      rk_tagAt(c,CX,y+190,"back in hours",tt,T.back,T.seven,{col:MD.wait,icon:"clock"});
      rk_tagAt(c,BX+40,700,"keeping it: a small part of the cost",tt,T.small,T.audit,{col:RK.frost,icon:"tick"});});}}],0.6);
});

/* ---------------------------------------------------------------- 5 · Kept as it's read */
scene("close",(ctx,S,t,sc)=>{
  const T={still:wAt(sc,"svalbard","cold and still"),leb:wAt(sc,"svalbard","In Lebanon"),again:wAt(sc,"svalbard","sends out"),univ:sc.cues.university,q1:wAt(sc,"university","what's read often"),
    q2:wAt(sc,"university","old pay records"),today:sc.cues.today,take:sc.cues.takeaway,wheel:sc.cues.wheel,docs:sc.cues.docs,verbs:wAt(sc,"docs","then investigate"),next:sc.cues.next,br:sc.cues.breath};
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"rkVault",keys:[[0,1280,610,1.2]],push:0.02,draw:(c,tt)=>{rk_vaultLive(c,tt,{tunnel:1,halls:1,boxes:1,cold:1});rk_when(c,S,"Svalbard",ag_in(tt,0.6,0.5));}},
    {at:T.leb-0.3,place:"rkFields",keys:[[0,960,560,1]],push:0.025,draw:(c,tt)=>{rk_shoots(c,1,{ripe:1});
      const pts=[[[960,600],[200,420]],[[960,600],[1720,420]]].map(([a,b])=>rk_arc(a,b,120));
      pts.forEach((p,i)=>{const a=ag_in(tt,T.again+i*0.3,0.6);if(a>0.004){md_lane(c,p,RK.seed,0.6*a,{u:ag_sine((tt-T.again-i*0.3)/1.2)});if(tt>T.again+1)rk_seeds(c,p,tt,{every:1.1,dur:2,off:i*0.5,a});}});
      rk_when(c,S,"Lebanon and Morocco",ag_in(tt,T.leb,0.5));}},
    // the university: what's read often, on the hot tier; old pay records, cheaply, in the archive, until they're deleted
    {at:T.univ-0.3,place:"map",keys:[[0,960,540,1]],push:0.012,draw:(c,tt)=>{
      rk_shelf(c,60,526,1500,"Hot tier","read often",{});rk_shelf(c,60,746,1500,"Archive tier","rarely read",{cold:true});
      const sink=RK_YEARS.map((y,i)=>i<3?0:i<10?1:0),gone=RK_YEARS.map((y,i)=>i<3?1:0),read=RK_YEARS.map((y,i)=>i===10?ag_in(tt,T.q1,0.4):0);
      rk_years(c,130,{years:RK_YEARS,top:520,low:740,sink,gone,read});
      rk_scr(c,S,()=>{rk_when(c,S,"The university",ag_in(tt,T.univ,0.5));
        rk_tagAt(c,1100,250,"quick to read",tt,T.q1,1e9,{col:MD.flow,icon:"eye"});rk_tagAt(c,500,250,"cheap to keep, until deleted",tt,T.q2,1e9,{col:RK.frost,icon:"clock"});});}},
    {at:T.today-0.3,place:"night",keys:[[0,960,540,1]],push:0.015,draw:(c,tt)=>{
      rk_personAt(c,"linh",360,800,0.95,tt,-1,T.br,{gaze:[4,0]});
      rk_scr(c,S,()=>{rk_when(c,S,"Today · pay day",rk_io(tt,T.today,T.br,0.4,0.6));
        rk_cardAt(c,820,250,900,{kick:"Written today",title:"2,960 pay records",sub:"Linh's among them"},tt,T.today+0.3,T.take-0.2,{edge:MD.personal});
        // what the film found: how often data is read decides where it's kept; the law and the business, for how long
        const k=(tt-T.take)/0.9,a=rk_io(tt,T.take,T.wheel,0.5,0.5);
        if(a>0.004){c.save();c.globalAlpha*=a;ag_about(c,1270,420,lerp(0.85,1,Math.min(1,ag_spr(k,0,0.5))));md_card(c,820,280,900,260,{edge:MD.flow,glow:0.6});
          md_T(c,"How often it's read decides",1270,370,{w:700,size:40,align:"center"});md_T(c,"where it's kept;",1270,426,{w:700,size:40,align:"center",col:MD.flow});
          md_T(c,"the law and the business, for how long",1270,490,{w:600,size:32,align:"center",col:MD.agreed});c.restore();}
        // storage has had tiers for years: no wheel to reinvent
        const wa=rk_io(tt,T.wheel,T.docs,0.5,0.5);if(wa>0.004){md_mark(c,1270,380,80,(tt-T.wheel)/1.6,wa);md_T(c,"storage has had tiers for years",1270,540,{w:700,size:32,align:"center",col:MD.soft,a:wa});}
        // the official docs, then investigate, adapt, implement, iterate
        const da=rk_io(tt,T.docs,T.next,0.5,0.5);
        if(da>0.004){c.save();c.globalAlpha*=da;md_card(c,820,240,900,320,{edge:MD.flow,glow:0.5});md_T(c,"Start from the official docs",880,310,{w:700,size:36});
          let x=880;for(const lg of["databricks"]){if(typeof LOGO!=="undefined"&&LOGO[lg])x+=logo(c,lg,x,350,48)+28;}
          let vx=880;["investigate","adapt","implement","iterate"].forEach((v,i)=>{md_T(c,v,vx,480,{w:700,size:32,col:MD.flow,a:ag_in(tt,T.verbs+i*0.35,0.4)});vx+=md_tw(c,v,{w:700,size:32})+56;});c.restore();}
        rk_cardAt(c,820,330,900,{kick:"Next",title:"Data as software",sub:"where scripts became software"},tt,T.next+0.2,T.br,{edge:MD.flow});});}}
  ],0.6);
  md_end(ctx,S,t,T.br,"Read often, kept close","How often data is read decides where it's kept.","Film 4 of 4","Data that moves");
});

// chapters that open in the room the one before ends in: the camera glides on, and what the last one shows leaves first

