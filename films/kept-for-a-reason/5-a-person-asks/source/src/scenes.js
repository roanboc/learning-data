/* ===== A person asks: the scenes =====
   Eight chapters, each timed to its narration: wAt(sc, "line", "word") is the moment a word is said. The places are painted once
   (ap_past.js, ap_hall.js); what moves is drawn live in the shots of ag_shots. London in 1676 and Westminster in 1679 dissolve from
   place to place, where the whole picture changes; in the hall, a shot that names what the one before showed comes in on a cut, and a
   later moment in one corner (later:true) lets what was there leave before what comes later comes in. Cards come in by fading up and
   rising a little, never from a smaller size, so their words are never under 28 px. The place and the day are on a tag, top left. The
   title card ends chapter 2, the end card chapter 8. */
const ap_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// a thing coming in at a, over d: its opacity and how far it still has to rise
const ap_rise=(t,a,d)=>{const u=clamp((t-a)/(d||0.5),0,1);return{a:ag_sine(u),dy:(1-ag_eo(u))*14};};
function ap_up(c,t,a,fn,o){o=o||{};const r=ap_rise(t,a,o.d),out=o.out!=null?1-ag_in(t,o.out,o.od||0.4):1,al=r.a*out;if(al<=0)return;c.save();c.globalAlpha*=al;c.translate(0,r.dy);fn();c.restore();}
// a person faded in or out as one picture
function ap_who_at(c,who,x,y,s,a,o){if(a<=0)return;c.save();c.globalAlpha*=a;dp_person(c,who,x,y,s,o);c.restore();}
// the privacy office's pane of frosted glass, in its corner of the hall
const ap_office=cx=>dp_wall(cx,80,230,320,650,{frosted:true,col:"cyan",label:"Privacy office"});
// the tag that gives the place and the day, top left, in the frame
function ap_tag(ctx,S,s,a){if(a<=0)return;setScreen(ctx,S);dp_kicker(ctx,s,null,{a});}

/* ---------------------------------------------------------------- 1 · Held through the summer */
scene("summer",(ctx,S,t,sc)=>{const c=sc.cues,T=ap_once(sc,"T",()=>({
    jenkes:wAt(sc,"jenkes","Francis"),linen:wAt(sc,"jenkes","linen"),parl:wAt(sc,"guildhall","new Parliament"),mend:wAt(sc,"guildhall","mend"),
    gate:wAt(sc,"council","Gatehouse"),kept:wAt(sc,"council","kept"),noday:wAt(sc,"noday","names"),
    copy:wAt(sc,"copy","copy of the warrant"),promises:wAt(sc,"stalls","promises"),stalls:wAt(sc,"stalls","stalls"),
    bail:wAt(sc,"bail","bail"),pledge:wAt(sc,"bail","pledge"),refused:wAt(sc,"refused","Refused"),
    habeas:wAt(sc,"writ","habeas corpus"),body:wAt(sc,"latin","have the body"),bring:wAt(sc,"latin","bring"),why:wAt(sc,"latin","say why"),
    refuses:wAt(sc,"holiday","refuses"),hol:wAt(sc,"holiday","summer holiday"),
    aug:wAt(sc,"august","August"),loss:wAt(sc,"august","great loss"),months:wAt(sc,"months","months"),change:wAt(sc,"change","Something")}));
  ag_shots(ctx,S,t,sc.dur,[
    // Guildhall Yard at evening: the camera glides in towards the hall's lit windows
    {at:0,place:"apYard",keys:[[0,960,560,1.0],[1.2,960,500,1.12]],d:5.6,push:0},
    // inside: Jenkes at the rail; on "a new Parliament", what he asked for
    {at:T.jenkes-0.5,place:"apGuild",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      dp_person(cx,ap_who("jenkes"),470,610,1.0,{t:tt,light:"lamp",cut:AP_RAIL});
      ap_up(cx,tt,T.jenkes+0.2,()=>dp_card(cx,690,600,540,{title:"Francis Jenkes",sub:"linen draper · on the City's council"},{col:"grey"}));
      ap_up(cx,tt,T.parl-0.2,()=>dp_card(cx,1270,600,580,{title:"Call a new Parliament",sub:"at the Guildhall"},{col:"grey"}));
      ap_up(cx,tt,T.mend-0.1,()=>dp_slip(cx,1270,786,"to mend the City's trade","grey",{ink:true}));}},
    // the Gatehouse at Westminster: the Council's warrant, sealed; it names no day
    {at:c.council-0.3,place:"apGate",keys:[[0,960,560,1.0],[1,960,540,1.05]],d:5,push:0,draw:(cx,tt)=>{
      ap_gate(cx,0);
      ap_up(cx,tt,T.gate-0.1,()=>dp_slip(cx,1330,150,"The Gatehouse · Westminster","grey",{ink:true}));
      ap_up(cx,tt,T.kept-0.4,()=>ap_warrant(cx,80,170,{w:520,seal:ag_in(tt,T.kept+0.4,0.5)}));
      ap_up(cx,tt,T.noday,()=>dp_pill(cx,100,620,"No day named","denied"));}},
    // inside the Gatehouse: the copy he asks for, promised and not given; bail offered and refused
    {at:c.copy-0.4,place:"apCell",keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
      dp_person(cx,ap_who("jenkes"),470,630,0.9,{t:tt,light:"lamp"});
      dp_person(cx,ap_who("keeper"),1450,630,0.9,{t:tt,flip:true,light:"lamp",pose:"hold",hold:ap_keyRing});
      const out=T.bail-0.5;
      ap_up(cx,tt,T.copy-0.2,()=>{const k=ag_sine(clamp((tt-T.promises)/1.2,0,1));cx.save();cx.translate(70*k,0);dp_card(cx,700,170,480,{title:"A copy of the warrant"},{col:"grey"});cx.restore();},{out});
      ap_up(cx,tt,T.promises,()=>dp_pill(cx,760,400,"Tomorrow","grey"),{out});
      ap_up(cx,tt,T.stalls,()=>dp_pill(cx,760,490,"Not given","denied"),{out});
      // the friends' purse, pushed over the table, and back
      const pa=ag_in(tt,T.bail,0.4),go=ag_sine(clamp((tt-T.pledge)/1.0,0,1))-ag_sine(clamp((tt-T.refused+0.4)/0.9,0,1));
      ap_purse(cx,lerp(820,1060,go),846,0.9,pa);
      ap_up(cx,tt,T.refused,()=>dp_pill(cx,820,560,"Bail refused","denied"));}},
    // the Lord Chief Justice's door: what the writ is, and the plea sent back in the courts' holiday
    {at:c.writ-0.4,place:"apDoor",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      ap_door(cx,0);ap_plea(cx,clamp((tt-T.refuses)/1.4,0,2));
      ap_up(cx,tt,T.habeas,()=>dp_card(cx,100,200,700,{title:"Habeas corpus: have the body"},{col:"grey"}));
      ap_up(cx,tt,T.bring,()=>dp_slip(cx,100,360,"bring the prisoner to a judge","grey",{ink:true}));
      ap_up(cx,tt,T.why,()=>dp_slip(cx,100,456,"say why he's held","grey",{ink:true}));
      ap_up(cx,tt,T.hol,()=>dp_pill(cx,780,780,"Vacation: no writ","denied"));}},
    // August: still inside, his letter; the window's light crossing the wall, day after day
    {at:c.august-0.6,place:"apCell",keys:[[0,960,540,1.0],[1,1000,530,1.05]],d:6,push:0,dis:0.8,draw:(cx,tt)=>{
      const days=clamp(tt-T.months,0,T.change-T.months)/1.5;ap_dayLight(cx,days,ag_io(tt,T.months,T.change+0.4,0.8));
      dp_person(cx,ap_who("jenkes"),520,640,0.95,{t:tt,light:"lamp",pose:"hold",hold:ap_paper});
      ap_up(cx,tt,T.aug,()=>dp_card(cx,700,170,640,{kick:"11 August 1676",title:"“my great loss, charge and prejudice of my health”"},{col:"grey"}));}}
  ],0.5);
  ap_tag(ctx,S,"London · 1676",ag_in(t,0.8,0.8));});

/* ---------------------------------------------------------------- 2 · Three days */
scene("days",(ctx,S,t,sc)=>{const c=sc.cues,T=ap_once(sc,"T",()=>({
    act:wAt(sc,"act","Habeas Corpus Act"),three:wAt(sc,"three","three days"),certify:wAt(sc,"three","certify"),ten:wAt(sc,"far","Ten days"),twenty:wAt(sc,"far","twenty if"),
    any:wAt(sc,"anyjudge","any judge"),six:wAt(sc,"sixhours","six hours"),hundred:wAt(sc,"pays","hundred pounds"),two:wAt(sc,"second","two hundred"),loses:wAt(sc,"second","loses"),
    hours:wAt(sc,"learns","within hours"),summer:wAt(sc,"learns","not a summer"),us:wAt(sc,"century","United States"),hold:wAt(sc,"today","what do you hold"),
    waits:wAt(sc,"inbox","waits"),clock:wAt(sc,"trusted","clock"),reasons:wAt(sc,"trusted","true reasons"),proof:wAt(sc,"trusted","proof"),onTime:wAt(sc,"trusted","on time")}));
  const roll=(cx,tt)=>ap_roll(cx,250,170,780,600,clamp((tt-c.act-0.2)/2.0,0,1));
  ag_shots(ctx,S,t,sc.dur,[
    // the Act, unrolled; the keeper's clock by distance, and the true causes
    {at:0,place:"apTable",keys:[[0,960,560,1.0],[2,960,540,1.04]],d:6,push:0,draw:(cx,tt)=>{roll(cx,tt);
      ap_up(cx,tt,T.three,()=>dp_slip(cx,1160,170,"3 days · within 20 miles","grey",{ink:true}));
      ap_up(cx,tt,T.ten,()=>dp_slip(cx,1160,266,"10 days · up to 100 miles","grey",{ink:true}));
      ap_up(cx,tt,T.twenty,()=>dp_slip(cx,1160,362,"20 days · beyond","grey",{ink:true}));
      ap_up(cx,tt,T.certify,()=>dp_card(cx,1160,480,600,{title:"The true causes, certified"},{col:"grey"}));}},
    // the door, open: any judge, in the holiday too
    {at:c.anyjudge-0.4,place:"apDoor",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{ap_door(cx,ag_sine(clamp((tt-c.anyjudge)/1.6,0,1)));
      ap_up(cx,tt,T.any,()=>dp_card(cx,100,240,720,{title:"Any judge, in the holiday too"},{col:"grey"}));}},
    // the keeper hands over the copy, within six hours; a keeper who stalls pays
    {at:c.sixhours-0.4,place:"apCell",keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
      dp_person(cx,ap_who("keeper"),1450,630,0.9,{t:tt,flip:true,light:"lamp",pose:"hold",hold:ap_paper});
      ap_up(cx,tt,c.sixhours-0.1,()=>{dp_card(cx,560,170,560,{title:"A copy of the warrant"},{col:"grey"});dp_tick(cx,1070,234,"green",ag_in(tt,T.six-0.2,0.6));});
      ap_up(cx,tt,T.six,()=>dp_pill(cx,560,380,"within 6 hours","allowed"));
      ap_purse(cx,860,846,0.9,ag_in(tt,T.hundred-0.4,0.4));ap_up(cx,tt,T.hundred,()=>dp_slip(cx,560,470,"£100 to the prisoner","grey",{ink:true}));
      ap_purse(cx,1120,846,0.9,ag_in(tt,T.two-0.4,0.4));ap_up(cx,tt,T.two,()=>dp_slip(cx,560,566,"£200 · and his post","grey",{ink:true}));}},
    // the Gatehouse's gate opens: within days, not a summer
    {at:c.learns-0.4,place:"apGate",keys:[[0,960,540,1.0],[1,960,560,1.06]],d:5,push:0,draw:(cx,tt)=>{ap_gate(cx,ag_sine(clamp((tt-c.learns)/1.8,0,1)));
      ap_up(cx,tt,T.hours,()=>dp_card(cx,30,300,500,{title:"Within days, not a summer"},{col:"grey"}));}},
    // a century later: the writ in the United States Constitution
    {at:c.century-0.4,place:"apTable",keys:[[0,960,700,1.3]],push:0.02,draw:(cx,tt)=>{
      ap_up(cx,tt,c.century-0.1,()=>ap_page1787(cx,580,560,{}),{d:0.8});}},
    // today: a person asks the university; a request left in an inbox, and a request given a clock
    {at:c.today-0.4,place:"hall",keys:[[0,960,540,1.0]],push:0.015,dis:0.8,draw:(cx,tt)=>{
      const sink=ag_sine(clamp((tt-T.waits+0.6)/1.0,0,1))*(1-ag_sine(clamp((tt-T.clock+0.4)/1.0,0,1))),pile=ag_io(tt,c.inbox-0.3,T.clock+0.6,0.6);
      if(pile>0){cx.save();cx.globalAlpha*=pile;for(let k=0;k<6;k++){const px=650+((k*137)%80)-40,py=700-k*16;dp_panel(cx,px,py,620,90,{col:"grey",r:16,glowR:16,glowA:0.5});}cx.restore();}
      ap_up(cx,tt,T.hold-0.3,()=>{cx.save();cx.translate(0,330*sink);cx.globalAlpha*=1-0.45*sink;dp_card(cx,660,300,600,{kick:"A person asks",title:"What do you hold about me, and why?"},{col:"cyan"});cx.restore();});
      ap_up(cx,tt,T.waits,()=>dp_pill(cx,1300,620,"Waiting","grey"),{out:T.clock});
      ap_clock(cx,960,385,330,30,clamp((tt-T.clock)/1.4,0,1),{});
      ap_up(cx,tt,T.reasons,()=>dp_pill(cx,600,840,"The true reasons","allowed"));
      ap_up(cx,tt,T.proof,()=>dp_pill(cx,890,840,"Proof","allowed"));
      ap_up(cx,tt,T.onTime,()=>dp_pill(cx,1050,840,"On time","allowed"));}}
  ],0.5);
  ap_tag(ctx,S,"Westminster · 1679",ag_in(t,0.4,0.8)*(1-ag_in(t,c.century-0.5,0.5)));
  dp_title(ctx,S,t,c.breath,"A person asks",null,"FILM 5 OF 5 · KEPT FOR A REASON");});

/* ---------------------------------------------------------------- 3 · A request with a clock */
const AP_FORM="My tutoring contract ended on 20 November. Please tell me what you hold about me, and take me off the tutors' mailing list.";
scene("clock",(ctx,S,t,sc)=>{const c=sc.cues,T=ap_once(sc,"T",()=>({
    ended:wAt(sc,"ended","ended"),signed:wAt(sc,"signedin","signed in"),more:wAt(sc,"signedin","nothing more"),please:wAt(sc,"asks","Please"),
    logs:wAt(sc,"logs","logs"),clock:wAt(sc,"due","clock"),thirty:wAt(sc,"due","thirty days"),dec:wAt(sc,"due","December"),
    ingrid:wAt(sc,"ingrid","Ingrid"),part:wAt(sc,"ingrid","HR's part"),ticket:wAt(sc,"ticket","ticket"),noone:wAt(sc,"noone","names no one"),steps:wAt(sc,"noone","steps"),
    one:wAt(sc,"oneplace","one place"),office:wAt(sc,"oneplace","privacy office")}));
  const form=(cx,tt,a)=>ap_typed(cx,1000,140,840,"Privacy office · Ask about your data",AP_FORM,clamp((tt-c.asks+0.2)/(sc.ends.asks-c.asks+0.2),0,1),{a});
  ag_shots(ctx,S,t,sc.dur,[
    // Linh at her laptop: her contract ended; she's signed in, and writes
    {at:0,place:"apDesk",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      dp_person(cx,"linh",430,640,1.0,{t:tt,cut:AP_DESK});ap_laptop(cx,760,AP_DESK,{glow:1});
      ap_up(cx,tt,T.ended-0.2,()=>dp_card(cx,1000,150,520,{kick:"Tutoring contract",title:"T-26188",sub:"ended 20 Nov 2026"},{col:"grey"}),{out:c.asks-0.6});
      ap_up(cx,tt,T.signed-0.2,()=>{dp_slip(cx,1000,440,"Signed in: Linh Nguyen · student account","cyan");dp_link(cx,[1000,475],[905,640],"cyan",1,{lw:2,alpha:0.8});});
      ap_up(cx,tt,T.more,()=>dp_pill(cx,1000,600,"Nothing more asked","allowed"));
      if(tt>c.asks-0.3)form(cx,tt,ag_in(tt,c.asks-0.3,0.3));}},
    // the privacy office logs it, with its clock; Ingrid takes HR's part
    {at:c.logs-0.3,place:"apOffice",cut:true,keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{ap_office(cx);
      const fa=1-ag_in(tt,c.logs+0.1,0.5);if(fa>0)form(cx,tt,fa);
      ap_up(cx,tt,c.logs+0.3,()=>ap_request(cx,{due:ag_in(tt,T.dec-0.2,0.5)}));
      ap_clock(cx,780,690,130,30,clamp((tt-T.clock)/1.6,0,1),{label:ag_in(tt,T.thirty,0.4)>0?"30 days":null,a:1});
      const ia=ag_in(tt,T.ingrid-0.5,0.6);if(ia>0){cx.save();cx.globalAlpha*=ia;dp_wall(cx,1250,200,600,680,{frosted:true,col:"cyan"});cx.restore();}
      ap_who_at(cx,"ingrid",1520,650,1.0,ia,{t:tt,flip:true});
      ap_up(cx,tt,T.ingrid,()=>dp_card(cx,1300,150,470,{title:"Ingrid Holm",sub:"owns HR's data"},{col:"cyan"}));
      dp_link(cx,[1090,250],[1296,215],"cyan",ag_sine(clamp((tt-T.part+0.2)/0.8,0,1)),{lw:2.4});
      ap_up(cx,tt,T.part,()=>dp_slip(cx,1108,300,"HR's part","cyan",{size:28}));}},
    // the data team's ticket: it names no one
    {at:c.ticket-0.3,place:"apRepo",cut:true,keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
      ap_issue(cx,300,110,1320,760,{rows:clamp((tt-T.ticket-0.6)/0.4,0,5),noone:ag_in(tt,T.noone,0.5),ticks:[0,0,0,0,0]});}},
    // her numbers, in one place: a table only the privacy office and its jobs may read
    {at:c.oneplace-0.3,place:"apOffice",cut:true,keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{ap_office(cx);
      ap_up(cx,tt,T.one,()=>ap_keys(cx,{rows:()=>0}),{d:0.7});
      ap_readers(cx,{each:i=>ap_rise(tt,T.office+i*0.3,0.5).a});}}
  ],0.5);
  ap_tag(ctx,S,"Tue 24 Nov 2026",ag_in(t,0.6,0.8));});

/* ---------------------------------------------------------------- 4 · Every place she is */
scene("places",(ctx,S,t,sc)=>{const c=sc.cues,T=ap_once(sc,"T",()=>({
    master:wAt(sc,"master","master record"),nums:wAt(sc,"six","her numbers"),sixAll:wAt(sc,"six","six in all"),dbt:wAt(sc,"dbt","dbt"),nModels:wAt(sc,"dbt","more than thirty"),
    lineage:wAt(sc,"lineage","lineage"),nb:wAt(sc,"lineage","notebook's"),dash:wAt(sc,"lineage","dashboard"),other:wAt(sc,"lineage","another team's job"),
    tags:wAt(sc,"tags","tags"),person:wAt(sc,"tags","names a person"),code:wAt(sc,"tags","code for one"),job:wAt(sc,"job","job"),
    table:wAt(sc,"looks","Table by table"),codes:wAt(sc,"looks","codes"),marts:wAt(sc,"marts","marts"),asCode:wAt(sc,"marts","only as a code"),miss:wAt(sc,"miss","miss"),
    typed:wAt(sc,"typed","typed"),year:wAt(sc,"typed","a year"),joins:wAt(sc,"joins","joins"),reqNo:wAt(sc,"joins","request's number"),
    lin:wAt(sc,"owners","Lineage only"),payroll:wAt(sc,"owners","payroll"),own:wAt(sc,"owners","search their own")}));
  ag_shots(ctx,S,t,sc.dur,[
    // Mei's master record; her six numbers go into the table of keys
    {at:0,place:"apOffice",keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
      const pa=1-ag_in(tt,0.2,0.6);if(pa>0){cx.save();cx.globalAlpha*=pa;ap_office(cx);cx.restore();}
      ap_who_at(cx,"mei",330,650,1.0,ag_in(tt,0.2,0.6),{t:tt});
      const land=i=>T.sixAll-1.4+i*0.25+0.6;
      ap_keys(cx,{rows:i=>ag_in(tt,land(i)-0.15,0.3),glow:i=>ag_io(tt,land(i)-0.15,land(i)+1.4,0.3)});ap_readers(cx,{});
      ap_up(cx,tt,T.master-0.3,()=>ap_master(cx,540,170,{}));
      for(let i=0;i<6;i++){const a0=T.nums+i*0.3,fly=ag_sine(clamp((tt-(land(i)-0.6))/0.6,0,1));if(tt<a0)continue;
        const x0=540,y0=430+i*66,x1=AP_KEYS.x+180,y1=AP_KROW(i)-34,x=lerp(x0,x1,fly),y=lerp(y0,y1,fly),a=ap_rise(tt,a0,0.4).a*(1-ag_in(fly,0.75,0.25));
        if(a>0)ap_num(cx,x,y,i,{a,v:ag_in(fly,0.2,0.5)});}
      ap_up(cx,tt,T.sixAll,()=>dp_slip(cx,AP_KEYS.x,AP_KEYS.y+AP_KEYS.h+24,"6 numbers · 5 systems","grey",{ink:true}));}},
    // Jun, and dbt's list of every model built from those five systems
    {at:c.dbt-0.4,place:"apRepo",cut:true,keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
      dp_person(cx,"jun",330,650,1.0,{t:tt});
      ap_term(cx,640,170,1240,520,{u:clamp((tt-T.dbt)/2.4,0,1),res:ag_in(tt,T.nModels-0.1,0.5)});}},
    // the platform's lineage adds the rest; the tags point to the columns that name a person, or hold a code for one
    {at:c.lineage-0.4,place:"apPlatform",cut:true,keys:[[0,960,540,1.0]],push:0.012,draw:(cx,tt)=>{
      ap_lineage(cx,{lines:ag_sine(clamp((tt-T.lineage)/1.2,0,1)),rest:i=>ag_in(tt,[T.nb,T.dash,T.other][i]-0.1,0.5)*(1-ag_in(tt,T.tags-0.6,0.5))});
      ap_up(cx,tt,T.tags,()=>ap_classes(cx,1390,250,{each:i=>ag_in(tt,[T.person,T.code,T.code+1.0][i],0.5)}));}},
    // a job runs as its own identity; it looks in those columns, table by table, for her numbers and for the codes made from them
    {at:c.job-0.4,later:true,place:"apPlatform",keys:[[0,960,540,1.0]],push:0.012,draw:(cx,tt)=>{
      ap_finder(cx,40,110,{t:tt,a:1,scan:clamp((tt-T.job-0.3)/1.2,0,1)});
      ap_up(cx,tt,T.codes-0.6,()=>ap_query(cx,30,500,{u:clamp((tt-T.codes+0.6)/1.6,0,1),hi:ag_io(tt,T.codes+0.6,T.marts+0.4,0.4)}));
      const st=AP_STG.length;
      ap_search(cx,1110,170,{rows:i=>ag_in(tt,T.table-0.4+i*0.08,0.4),
        tick:i=>i<st?ag_in(tt,T.table+0.4+i*0.45,0.5):ag_in(tt,T.miss+1.6+(i-st)*0.25,0.5),
        cross:i=>i<st?0:ag_io(tt,T.miss+0.1+(i-st)*0.15,T.miss+1.5,0.3),violet:ag_in(tt,T.marts+0.2,0.6)});}},
    // her numbers are never typed into a query: each query joins the table of keys, by the request's number
    {at:c.typed-0.4,later:true,place:"apPlatform",keys:[[0,960,540,1.0]],push:0.012,draw:(cx,tt)=>{
      ap_up(cx,tt,c.typed+0.2,()=>ap_qtext(cx,470,170,{ring:clamp((tt-T.year-0.2)/0.8,0,1)}));
      ap_up(cx,tt,T.joins-0.2,()=>{dp_frost(cx,620,600,680,110,null,{col:"violet",r:20});dp_lock(cx,680,654,46,"violet",0);dp_T(cx,"privacy.request_keys",730,666,{w:500,size:30,f:"mono"});});
      dp_link(cx,[1010,450],[960,598],"green",ag_sine(clamp((tt-T.reqNo+0.3)/0.7,0,1)),{lw:2.6});}},
    // lineage only sees the platform: outside it, each owner searches their own
    {at:c.owners-0.4,later:true,place:"apPlatform",keys:[[0,960,540,1.0]],push:0.012,draw:(cx,tt)=>{
      dp_wall(cx,560,190,800,600,{col:"cyan",label:"The platform · what lineage sees"});
      for(let k=0;k<20;k++)ap_tableIcon(cx,640+(k%5)*140,300+Math.floor(k/5)*120,"cyan",0.8);
      ap_outside(cx,{each:i=>ap_rise(tt,T.lin+0.6+i*0.35,0.5).a,tick:i=>ag_in(tt,T.own+i*0.3,0.5)});}}
  ],0.5);});

/* ---------------------------------------------------------------- 5 · What we hold about you */
scene("copy",(ctx,S,t,sc)=>{const c=sc.cues,T=ap_once(sc,"T",()=>({
    pile:wAt(sc,"pile","pile"),written:wAt(sc,"written","written"),h0:wAt(sc,"part","what it is"),h1:wAt(sc,"part","why it's held"),h2:wAt(sc,"part","where it came from"),
    h3:wAt(sc,"part","who else"),h4:wAt(sc,"part","until when"),causes:wAt(sc,"causes","true causes"),con:wAt(sc,"contract","A contract"),law:wAt(sc,"law","A law"),
    task:wAt(sc,"task","public task"),res:wAt(sc,"research","research"),others:wAt(sc,"others","other people"),marks:wAt(sc,"others","marks"),
    each:wAt(sc,"check","each owner"),ingrid:wAt(sc,"check","Ingrid"),mei:wAt(sc,"check","Mei"),ro:wAt(sc,"check","research office")}));
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"hall",keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
      // not a pile of tables: they fold away, and her copy rises in their place
      const pa=ag_in(tt,T.pile-0.3,0.5)*(1-ag_in(tt,T.written-0.2,0.6));if(pa>0){cx.save();cx.globalAlpha*=pa;for(let k=0;k<7;k++){const x=520+((k*173)%260),y=260+k*58;
        dp_panel(cx,x,y,640,110,{col:"grey",r:16,glowR:16,glowA:0.4});ap_tableIcon(cx,x+30,y+66,"grey");for(let j=0;j<4;j++){cx.fillStyle="rgba(176,194,196,0.35)";cx.fillRect(x+80+j*130,y+48,110,10);}}cx.restore();}
      ap_up(cx,tt,T.written,()=>ap_copy(cx,60,110,{head:i=>ag_in(tt,[T.h0,T.h1,T.h2,T.h3,T.h4][i]-0.1,0.4),rows:i=>ap_rise(tt,[T.con,T.law,T.task,T.res][i]-0.1,0.5).a,
        others:ag_in(tt,T.others-0.1,0.5),strike:clamp((tt-T.marks-0.2)/0.8,0,1),left:ag_in(tt,T.marks+0.6,0.5)}),{d:0.8});
      ap_up(cx,tt,T.causes,()=>dp_card(cx,60,740,640,{title:"The true causes, certified"},{col:"grey"}),{out:T.con-0.3});
      ap_owners(cx,60,740,{each:i=>ap_rise(tt,[T.ingrid,T.mei,T.ro][i]-0.2,0.5).a,tick:i=>ag_in(tt,[T.ingrid,T.mei,T.ro][i]+0.3,0.6)});}}
  ],0.5);});

/* ---------------------------------------------------------------- 6 · Taken off, and kept off */
scene("off",(ctx,S,t,sc)=>{const c=sc.cues,T=ap_once(sc,"T",()=>({
    second:wAt(sc,"first","second ask"),job:wAt(sc,"night","deletion job"),row:wAt(sc,"night","her row"),table:wAt(sc,"night","list's table"),log:wAt(sc,"night","its log"),
    tool:wAt(sc,"sync","mailing tool"),sync:wAt(sc,"sync","sync"),ingrid:wAt(sc,"morning","Ingrid"),no:wAt(sc,"morning","her no"),yes:wAt(sc,"morning","the yes"),
    rebuilt:wAt(sc,"rebuilt","rebuilt"),casual:wAt(sc,"rebuilt","casual contracts"),whose:wAt(sc,"rebuilt","whose yes"),leaves:wAt(sc,"leaves","leaves her out"),
    old:wAt(sc,"versions","old versions"),seven:wAt(sc,"versions","seven days"),clean:wAt(sc,"versions","cleaned up"),dec2:wAt(sc,"versions","second of December"),dmd:wAt(sc,"versions","Deleted means deleted"),
    alone:wAt(sc,"alone","Deleting her row alone"),still:wAt(sc,"alone","yes still there"),back:wAt(sc,"alone","brought her back")}));
  ag_shots(ctx,S,t,sc.dur,[
    // 01:00: the deletion job takes her row out of the list's table and its send log; at 04:00 the mailing tool drops her
    {at:0,place:"apPlatform",keys:[[0,960,540,1.0]],push:0.012,draw:(cx,tt)=>{
      ap_listTable(cx,60,150,"mart_hr__tutors_mailing_list",{mark:ag_in(tt,T.row,0.4),strike:clamp((tt-T.table)/0.7,0,1),out:clamp((tt-T.table-0.8)/1.0,0,1)});
      ap_listTable(cx,60,540,"mart_hr__tutor_news_sent",{mark:ag_in(tt,T.row,0.4),strike:clamp((tt-T.log)/0.7,0,1),out:clamp((tt-T.log-0.8)/1.0,0,1)});
      ap_up(cx,tt,T.job-0.3,()=>ap_deleter(cx,860,150,{t:tt}));
      dp_wall(cx,1470,330,380,480,{frosted:true,col:"grey",label:"Mailing tool"});dp_T(cx,"04:00",1660,400,{w:700,size:30,align:"center",a:ag_in(tt,T.tool,0.5)});
      for(let i=0;i<5;i++){const her=i===1,st=her?clamp((tt-T.sync)/0.6,0,1):0,ra=her?1-ag_in(tt,T.sync+0.7,0.6):1;if(ra<=0)continue;cx.save();cx.globalAlpha*=ra;
        ap_bar(cx,1500,480+i*60,320,{col:"violet"});if(st>0){cx.strokeStyle=rgba(DP.F.coral,1);cx.lineWidth=4;cx.beginPath();cx.moveTo(1500,471+i*60);cx.lineTo(1500+320*ag_sine(st),471+i*60);cx.stroke();}cx.restore();}}},
    // that morning: her no on the person, in place of her yes; the list takes only those whose yes is on the person
    {at:c.morning-0.4,place:"apOffice",cut:true,keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
      ap_who_at(cx,"ingrid",330,650,1.0,1-ag_in(tt,c.rebuilt-0.6,0.6),{t:tt});
      ap_person(cx,1120,140,{});
      const sw=clamp((tt-T.no)/1.0,0,1),go=ag_in(sw,0,0.45),come=ag_in(sw,0.55,0.45);ap_wish(cx,1120,430,true,{a:1-go,dy:24*go});ap_wish(cx,1120,430,false,{a:come,dy:-24*(1-come)});  // the yes leaves, then the no comes: never both at once, so no words show twice
      ap_up(cx,tt,T.rebuilt-0.2,()=>ap_rule(cx,90,150,{each:i=>ag_in(tt,[T.rebuilt,T.casual,T.whose][i]-0.1,0.5),dbt:ag_in(tt,T.whose+0.6,0.6)}));
      const lp=ag_sine(clamp((tt-T.leaves+0.2)/0.9,0,1));if(lp>0){dp_link(cx,[890,290],[1110,520],"coral",lp,{lw:2.6,dot:false});if(lp>=1)dp_cross(cx,1110,520,"coral",ag_in(tt,T.leaves+0.7,0.4));}}},
    // the table's old versions keep her row seven days more, until they're cleaned up; deleting the row alone would not have been enough
    {at:c.versions-0.4,place:"apPlatform",cut:true,keys:[[0,960,540,1.0]],push:0.012,draw:(cx,tt)=>{
      const re=ag_io(tt,T.alone+0.3,sc.ends.alone+0.2,0.6),rest=1-re;
      ap_versions(cx,200,400,{open:clamp((tt-T.old+0.3)/1.0,0,1),gone:clamp((tt-T.dec2)/1.4,0,1)});
      ap_up(cx,tt,T.old,()=>dp_T(cx,"old versions",980,260,{w:600,size:28,col:"mut"}),{out:T.dec2+0.6});
      if(rest>0){cx.save();cx.globalAlpha*=rest;
        ap_clock(cx,1300,420,120,7,clamp((tt-T.seven)/1.0,0,1),{label:"7 days",size:36});
        ap_up(cx,tt,T.dec2,()=>dp_slip(cx,1200,600,"Wed 2 Dec","grey",{ink:true}));
        ap_up(cx,tt,T.dmd,()=>dp_slip(cx,1200,696,"Film 4 of 5 · Deleted means deleted","grey",{ink:true}));cx.restore();}
      ap_up(cx,tt,T.dmd+1.0,()=>dp_slip(cx,200,770,"Locked backups · out of use · the last gone 24 Dec","grey",{ink:true}));
      // what would have happened: her yes still on her, and the next rebuild bringing her row back
      if(re>0){cx.save();cx.globalAlpha*=re;ap_wish(cx,1260,170,true,{});dp_link(cx,[1258,300],[764,520],"coral",ag_sine(clamp((tt-T.back+0.8)/0.8,0,1)),{lw:2.6});
        dp_pill(cx,1260,470,"back next semester","denied",{a:ag_in(tt,T.back,0.5)});cx.restore();}}}
  ],0.5);
  ap_tag(ctx,S,"Wed 25 Nov · 01:00",ag_in(t,0.6,0.8)*(1-ag_in(t,c.morning-0.6,0.4)));ap_tag(ctx,S,"Wed 25 Nov · morning",ag_in(t,c.morning-0.1,0.4)*(1-ag_in(t,c.versions-0.6,0.4)));});

/* ---------------------------------------------------------------- 7 · Proof, on time */
scene("proof",(ctx,S,t,sc)=>{const c=sc.cues,T=ap_once(sc,"T",()=>({
    proof:wAt(sc,"every","proof"),ticked:wAt(sc,"ticked","ticked"),run:wAt(sc,"run","run"),hist:wAt(sc,"history","history"),del:wAt(sc,"history","deleted"),clean:wAt(sc,"history","cleaned up"),
    audit:wAt(sc,"audit","audit log"),only:wAt(sc,"audit","only the office"),table:wAt(sc,"table","table of every request"),near:wAt(sc,"near","near its date"),late:wAt(sc,"late","late answer"),
    dec7:wAt(sc,"ready","seventh of December"),early:wAt(sc,"ready","seventeen days early"),opens:wAt(sc,"ready","she opens"),sign:wAt(sc,"ready","signing in"),
    closes:wAt(sc,"closes","closes"),nums:wAt(sc,"closes","Her numbers"),until:wAt(sc,"closes","until the last locked copy"),dec24:wAt(sc,"closes","twenty-fourth"),body:wAt(sc,"n1679","the body"),causes:wAt(sc,"n1679","true causes"),days:wAt(sc,"n1679","within days"),
    held:wAt(sc,"here","what's held"),reasons:wAt(sc,"here","true reasons"),onTime:wAt(sc,"here","on time")}));
  const ticks=tt=>[ag_in(tt,T.ticked+0.3,0.6),ag_in(tt,sc.ends.run+0.2,0.6),ag_in(tt,T.hist+0.2,0.6),ag_in(tt,sc.ends.audit+0.2,0.6),ag_in(tt,c.closes+0.2,0.6)];
  const issue=(cx,tt)=>{const k=ticks(tt);ap_issue(cx,40,110,1000,760,{rows:5,noone:1,ticks:k,links:k.map(v=>ag_in(v,0.5,0.5)),closed:ag_in(tt,T.closes-0.1,0.6)});};
  const proofs=(cx,tt)=>{ap_up(cx,tt,T.hist,()=>ap_history(cx,1080,110,{rows:i=>ag_in(tt,[T.del,T.del+0.4,T.clean,T.clean+0.4][i],0.4)}));
    ap_up(cx,tt,T.audit,()=>ap_audit(cx,1080,500,{rows:i=>ag_in(tt,T.only+i*0.3,0.4)}));};
  ag_shots(ctx,S,t,sc.dur,[
    // the ticket: each box ticked with a link to its proof; the table's history, and the audit log
    {at:0,place:"apRepo",keys:[[0,960,540,1.0]],push:0.012,draw:(cx,tt)=>{issue(cx,tt);proofs(cx,tt);}},
    // the privacy office's table of requests: tracked like work
    {at:c.table-0.4,place:"apOffice",cut:true,keys:[[0,960,540,1.0]],push:0.012,draw:(cx,tt)=>{
      ap_up(cx,tt,c.table-0.1,()=>ap_requests(cx,340,140,{near:ag_in(tt,T.near,0.5),mine:ag_in(tt,T.dec7-0.3,0.4),ans:ag_in(tt,T.dec7+0.3,0.5),early:ag_in(tt,T.early,0.5)}));
      ap_up(cx,tt,T.late,()=>dp_card(cx,340,700,760,{title:"Tracked like work · not a failing test"},{col:"grey"}));}},
    // Linh opens her answer on her phone, signed in
    {at:T.opens-0.3,place:"hall",cut:true,keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
      dp_person(cx,"linh",430,640,1.0,{t:tt,pose:"hold",hold:ap_phone});
      ap_up(cx,tt,T.opens-0.2,()=>dp_slip(cx,900,170,"Your answer is ready · sign in to read it","grey",{ink:true}));
      ap_up(cx,tt,T.sign,()=>dp_slip(cx,900,270,"Signed in: Linh Nguyen · student account","cyan"));
      ap_up(cx,tt,T.sign+0.6,()=>ap_answer(cx,900,400,{}),{d:0.7});}},
    // the ticket closes
    {at:c.closes-0.3,place:"apRepo",cut:true,keys:[[0,960,540,1.0]],push:0.012,draw:(cx,tt)=>{issue(cx,tt);proofs(cx,tt);}},
    // her numbers stay in the table of keys, under its lock, until the last locked copy that can hold her rows is gone: a copy
    // restored before then has her request applied again (Deleted means deleted)
    {at:T.nums-0.1,place:"apOffice",cut:true,keys:[[0,960,540,1.0]],push:0.012,draw:(cx,tt)=>{
      const out=1-ag_in(tt,c.n1679-0.9,0.5);if(out<=0)return;cx.save();cx.globalAlpha*=out;ap_keys(cx,{glow:i=>ag_io(tt,T.nums+0.3+i*0.12,T.nums+1.6+i*0.12,0.3)});ap_readers(cx,{});  // all of it leaves before 1679 comes in
      ap_up(cx,tt,T.until,()=>dp_slip(cx,200,420,"Kept until the last locked copy is gone","grey",{ink:true}));
      ap_up(cx,tt,T.dec24,()=>dp_slip(cx,200,516,"Thu 24 Dec","grey",{ink:true}));cx.restore();}},
    // 1679: a keeper answered with the body, the true causes, within days
    {at:c.n1679-0.3,place:"apTable",keys:[[0,960,540,1.04]],push:0.012,draw:(cx,tt)=>{ap_roll(cx,250,170,780,600,1);
      ap_up(cx,tt,T.body,()=>dp_slip(cx,1160,170,"the body","grey",{ink:true}));
      ap_up(cx,tt,T.causes,()=>dp_slip(cx,1160,266,"the true causes","grey",{ink:true}));
      ap_up(cx,tt,T.days,()=>dp_slip(cx,1160,362,"within days","grey",{ink:true}));}},
    // here: what's held, the true reasons, on time, with proof
    {at:c.here-0.3,place:"hall",keys:[[0,960,540,1.0]],push:0.012,draw:(cx,tt)=>{
      const P=[["what's held",T.held],["the true reasons",T.reasons],["on time, with proof",T.onTime]],gap=36,ws=P.map(([s])=>dp_tw(cx,s,{w:600,size:40})+44);
      let x=960-(ws.reduce((u,v)=>u+v,0)+gap*2)/2;P.forEach(([s,at],i)=>{const px=x;ap_up(cx,tt,at,()=>dp_pill(cx,px,560,s,"allowed",{size:40}));x+=ws[i]+gap;});}}
  ],0.5);
  ap_tag(ctx,S,"Westminster · 1679",ag_in(t,c.n1679-0.2,0.4)*(1-ag_in(t,c.here-0.5,0.4)));});

/* ---------------------------------------------------------------- 8 · Kept for a reason */
scene("reason",(ctx,S,t,sc)=>{const c=sc.cues,T=ap_once(sc,"T",()=>({
    five:wAt(sc,"five","Five films"),say:wAt(sc,"say","Keep data"),end:wAt(sc,"end","end date"),ask:wAt(sc,"ask","can ask"),gone:wAt(sc,"gone","Deleting"),time:wAt(sc,"time","on time"),
    locks:wAt(sc,"module","Locks before the data"),only:wAt(sc,"module","Only what you may see"),dp:wAt(sc,"module","data protection"),
    come:wAt(sc,"three","Who may come in"),each:wAt(sc,"three","what each may see"),long:wAt(sc,"three","how long"),agents:wAt(sc,"next","AI agents")}));
  const L=[c.say,c.end,c.ask,c.gone,c.time],E=[sc.ends.say,sc.ends.end,sc.ends.ask,sc.ends.gone,sc.ends.time];
  ag_shots(ctx,S,t,sc.dur,[
    // the series: five films, and each one's lesson, written as it's said
    {at:0,later:true,place:"hall",keys:[[0,960,540,1.0]],push:0.012,draw:(cx,tt)=>{
      ap_films(cx,{each:i=>ap_rise(tt,T.five-0.2+i*0.2,0.5).a,line:i=>clamp((tt-L[i]+0.1)/(E[i]-L[i]+0.1),0,1)});}},
    // the module: three series, and what each keeps
    {at:c.module-0.4,later:true,place:"hall",keys:[[0,960,540,1.0]],push:0.012,draw:(cx,tt)=>{
      ap_series(cx,{each:i=>ap_rise(tt,[T.locks,T.only,c.module][i]-0.2,0.5).a,line:i=>ag_in(tt,[T.come,T.each,T.long][i],0.5)});}},
    // what's next
    {at:c.next-0.4,later:true,place:"hall",keys:[[0,960,540,1.0]],push:0.012,draw:(cx,tt)=>{ap_topics(cx,{a:ap_rise(tt,c.next-0.1,0.5).a*(1-ag_in(tt,c.breath,0.8)),next:ag_in(tt,T.agents,0.8)});}}
  ],0.5);
  dp_end(ctx,S,t,c.breath,"A person asks","A request answered on time, with proof.","Film 5 of 5","Kept for a reason");});

ag_cutInto(["places","reason"]);
