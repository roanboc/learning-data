/* ===== A reason to keep it: the scenes =====
   Seven chapters, every moment timed to the voice with wAt and the cues. The opening is Oregon in December 1986 (rk_oregon.js): the
   street in the rain, the clinic inside by night and, later, by day; it ends in the hall. The rest is the module's hall at night
   (rk_hall.js), one room: the camera glides and only what changes fades; a later moment there (later:true) lets what was there leave
   first, and Ingrid stays in her place (AG_BARE). Chapters open where the one before ends (ag_cutInto, at the foot). */

function rk_once(sc,k,f){return sc[k]||(sc[k]=f());}
// the series' kicker over the hall's chapters, and where the opening is, in the frame's own coordinates
function rk_kick(ctx,S,a){if(a<=0)return;setScreen(ctx,S);dp_kicker(ctx,"Kept for a reason · 1",null,{a});}
function rk_where(ctx,S,a){if(a<=0)return;setScreen(ctx,S);dp_T(ctx,"OREGON · 1986",72,98,{w:700,size:28,ls:4,col:"cyan",a});}
// a card's way in (and out at t1): its opacity, and a spring for its size that is past full size before it can be read
const rk_ink=(t,t0,t1)=>({a:ag_in(t,t0,0.4)*(t1==null?1:1-ag_in(t,t1,0.5)),k:ag_spr(t,t0,0.5)});

/* ---------------------------------------------------------------- 1 · Under a number: Oregon, 1986 */
// inside, by night: the counsellor behind the counter; what the test needs; the card of a name and a result, filed away
function rk_inside(x,tt,P,c){
  dp_person(x,RK_P.counsellor,1640,560,0.8,{t:tt,flip:true,light:"lamp",cut:RK_CL.top+2,gaze:[3,1]});
  const out=c.names-0.2,s1=rk_ink(tt,P.sample,out),s2=rk_ink(tt,P.way,out);
  if(s1.a>0)withA(x,s1.a,()=>{dp_link(x,[1040,474],rk_tubeAt(1),"grey",ag_in(tt,P.sample+0.2,0.5));dp_slip(x,970,404,"a sample","grey",{ink:true});});
  if(s2.a>0)withA(x,s2.a,()=>{dp_link(x,[1262,562],[1270,664],"grey",ag_in(tt,P.way+0.2,0.5));dp_slip(x,970,494,"a way to give the result","grey",{ink:true,size:28});});
  // the index card: up from the tray, then into the cabinet, behind its frosted door
  const u0=P.name-0.2,u1=P.priv-1.1;
  if(tt>u0){const up=ag_sine(clamp((tt-u0)/0.9,0,1)),file=ag_sine(clamp((tt-u1)/1.2,0,1)),a=ag_in(up,0,0.4)*(1-ag_in(tt,u1+0.4,0.5));
    rk_index(x,lerp(lerp(1210,990,up),640,file),lerp(lerp(560,300,up),340,file),{k:lerp(1,0.7,file),a});}
  const kp=rk_ink(tt,P.priv,null);if(kp.a>0)dp_tag(x,640,226,"kept private","violet",{a:kp.a,to:[818,306],p:ag_in(tt,P.priv+0.2,0.5)});}
// the street again: a young man walks to the clinic's door, stops, and walks on past it; the clinic's list; what it could cost
function rk_passBy(x,tt,P,c){rk_clinicWords(x,1);
  const t0=c.away-1.0,stop=c.away+0.6,go=P.stay+1.2,w1=ag_sine(clamp((tt-t0)/(stop-t0),0,1)),w2=clamp((tt-go)/4.0,0,1),X=lerp(420,880,w1)+1240*w2*w2;
  const walk=tt<stop-0.3||tt>go+0.2?1:0,bob=walk*Math.abs(Math.sin(tt*5.2))*3;
  if(X<2150)dp_person(x,RK_P.young,X,792-bob,0.62,{t:tt,light:"lamp",gaze:[3,-1],nod:tt>stop&&tt<go?0.05:0});
  rk_rain(x,tt,{seed:3,n:170});
  // the names the clinic keeps, behind frost; the frost thins on "a list of names"; one slides out, its rim coral
  const L=rk_ink(tt,c.list-0.5,null);if(L.a>0)rk_names(x,250,210,{a:L.a,thin:ag_in(tt,P.names,1.0),out:ag_in(tt,P.out,0.8)});
  // what could follow it out: three tags in coral, one as each is said
  [["job",P.job],["home",P.home],["health insurance",P.ins]].forEach(([s,w],i)=>{const q=rk_ink(tt,w,null);
    if(q.a>0)dp_tag(x,1060,194+i*80,s,"coral",{a:q.a,to:[1000,447],p:ag_in(tt,w+0.15,0.4)});});}
// inside again, by night: the empty chairs; two people at a kitchen table across the street; the counsellor; a name or a number
function rk_choice1(x,tt,P,c){rk_rain(x,tt,{seed:9,n:60,area:RK_CL.win,a:0.6,len:26});
  dp_person(x,RK_P.counsellor,1640,560,0.8,{t:tt,flip:true,light:"lamp",cut:RK_CL.top+2,gaze:[4,2]});
  const gone=P.match+0.5,D=rk_ink(tt,P.dec,gone);if(D.a>0)dp_slip(x,920,190,"December 1986","grey",{ink:true,a:D.a});
  const N=rk_ink(tt,P.nm,gone);if(N.a>0)rk_nameCard(x,920,320,{a:N.a,k:N.k});
  const O=ag_in(tt,P.num-0.2,0.4)*(1-ag_in(tt,gone,0.5));if(O>0)dp_T(x,"or",1217,412,{w:700,size:32,col:"mut",a:O,align:"center"});
  const M=rk_ink(tt,P.num,gone);if(M.a>0)rk_numberCard(x,1250,320,{a:M.a,k:M.k});
  // the number on a tube's label: a small card by the rack, with a line of light to the tube
  const L=rk_ink(tt,P.match+0.3,null);if(L.a>0)withA(x,L.a,()=>{dp_link(x,[1046,562],rk_tubeAt(2),"cyan",ag_in(tt,P.match+0.5,0.5));dp_slip(x,980,488,"4127","cyan",{size:34});});}
// the people waiting by day, in the chairs, the chairs' fronts over them
function rk_waiting(x,tt){for(const [who,cx,g,nod] of [[RK_P.coat,132,[3,1],0.03],[RK_P.elder,292,[2,0],-0.02],[RK_P.student,452,[3,-1],0],[RK_P.friend,612,[3,0],0.02]])
  dp_person(x,who,cx+6,540,0.52,{t:tt,light:RK_DAY,covered:true,gaze:g,nod});rk_seats(x,true);}
// the same room by day: he's come back, the number in his hand, his result on the counter face down; the counts; the chairs full
function rk_byDay(x,tt,P,c,o){o=o||{};rk_waiting(x,tt);
  dp_person(x,RK_P.counsellor,1640,560,0.8,{t:tt,flip:true,light:RK_DAY,cut:RK_CL.top+2,gaze:[3,1]});
  const rc=clamp((tt-(o.t0==null?P.back:o.t0)-0.6)/1.4,0,1);rk_resultCard(x,lerp(1560,1440,ag_sine(rc)),RK_CL.top-6,ag_in(rc,0,0.3));
  dp_person(x,RK_P.young,1290,660,0.84,{t:tt,light:RK_DAY,pose:"hold",holdBack:rk_held,gaze:[3,0]});
  if(o.counts===false)return;
  const C1=rk_ink(tt,c.rose-0.2,c.found-0.7);if(C1.a>0)rk_count(x,760,96,"Gay and bisexual men tested, each month",42,108,{w:720,a:C1.a,k:C1.k,u:ag_in(tt,P.m42,0.8),v:ag_in(tt,P.m108,1.0)});
  const C2=rk_ink(tt,c.found,c.health-0.6);if(C2.a>0)rk_count(x,760,96,"People with the virus found, in 3½ months",36,85,{w:720,a:C2.a,k:C2.k,u:ag_in(tt,P.f36,0.8),v:ag_in(tt,P.f85,1.0)});}
// the hall: one piece of what's held about a person, before a pane; its question; and a reason
function rk_onePiece(x,tt,P,c){const clear=ag_in(tt,c.trust,1.6);
  dp_wall(x,690,120,540,560,{frosted:true,col:"cyan",a:1-clear*0.7});if(clear>0)dp_wall(x,690,120,540,560,{col:"cyan",a:clear*0.7});
  const a=ag_in(tt,c.same+0.2,0.6)*(1-ag_in(tt,c.breath-0.4,0.6)),cor=ag_io(tt,P.getout,P.getout+1.4,0.3);if(a<=0)return;
  x.save();ag_about(x,960,520,1.5);rk_piece(x,5,{x:845,y:445,a,coral:cor,outline:ag_in(tt,P.forq,0.4),pill:"a reason",land:ag_in(tt,P.needs2,0.3),since:tt-P.needs2});x.restore();}

scene("number",(ctx,S,t,sc)=>{const c=sc.cues,P=rk_once(sc,"P",()=>({
    sample:wAt(sc,"needs","a sample"),way:wAt(sc,"needs","a way"),name:wAt(sc,"names","name with"),priv:wAt(sc,"names","private"),
    stay:wAt(sc,"away","stay away"),names:wAt(sc,"list","list of names"),out:wAt(sc,"fear","could get out"),
    job:wAt(sc,"cost","job"),home:wAt(sc,"cost","home"),ins:wAt(sc,"cost","health insurance"),love:wAt(sc,"know","the people they love"),
    dec:wAt(sc,"choose","December"),nm:wAt(sc,"choose","their name"),num:wAt(sc,"choose","or a number"),
    match:wAt(sc,"does","matches"),back:wAt(sc,"does","come back"),m42:wAt(sc,"rose","forty-two"),m108:wAt(sc,"rose","hundred"),
    f36:wAt(sc,"found","thirty-six"),f85:wAt(sc,"found","eighty-five"),getout:wAt(sc,"same","could get out"),
    forq:wAt(sc,"ask","what each piece"),needs2:wAt(sc,"ask","only what")}));
  const T1=c.test-0.5,T2=c.away-1.0,T3=c.know-0.5,T4=P.back-0.2,T5=c.same-0.4;
  ag_shots(ctx,S,t,sc.dur,[
    // the street at evening, in the rain, the camera drifting toward the clinic's door
    {at:0,place:"rkStreet",keys:[[0,980,560,1.02],[0.3,1150,600,1.2]],d:5.2,draw:(x,tt)=>{rk_clinicWords(x,1);rk_rain(x,tt,{seed:3,n:170});}},
    // inside: the counsellor behind the counter
    {at:T1,place:"rkClinic",keys:[[T1,1220,520,1.16],[P.sample-0.4,1130,520,1.2],[P.name-0.2,1020,470,1.24]],d:2.2,draw:(x,tt)=>rk_inside(x,tt,P,c)},
    // the street: a young man comes to the door, stops, and walks on past it
    {at:T2,place:"rkStreet",keys:[[T2,960,560,1.16],[c.list-0.4,980,480,1.04],[c.cost-0.6,1000,470,1.06]],d:2.4,draw:(x,tt)=>rk_passBy(x,tt,P,c)},
    // inside: the empty chairs; two people at a table across the street; the counsellor looks at the chairs; a name or a number
    {at:T3,place:"rkClinic",keys:[[T3,470,640,1.42],[P.love-0.5,458,346,1.55],[c.change-0.3,860,520,1.08],[c.choose-0.2,1130,450,1.2],[P.match-0.3,1080,540,1.38]],d:2.2,draw:(x,tt)=>rk_choice1(x,tt,P,c)},
    // later, the same room by day: he comes back with the number; the counts; the chairs full
    {at:T4,place:"rkClinicDay",later:true,keys:[[T4,1060,545,1.2],[c.rose-0.6,1000,540,1.06],[c.health-0.4,470,610,1.3]],d:2.4,draw:(x,tt)=>rk_byDay(x,tt,P,c)},
    // the hall: one piece of what's held about a person, and a reason for it
    {at:T5,place:"rkHall",keys:[[T5,960,520,1.3],[c.trust,960,540,1.12]],d:3.0,draw:(x,tt)=>rk_onePiece(x,tt,P,c)}
  ],0.7);
  rk_where(ctx,S,1-ag_in(t,T4-0.3,0.5));
  dp_title(ctx,S,t,c.breath,"A reason to keep it",null,"FILM 1 OF 5 · KEPT FOR A REASON");});

/* ---------------------------------------------------------------- 2 · What is it for? */
function rk_ch2(x,tt,P,c,sc){rk_ingrid(x,tt);const end=sc.dur-1.0;
  const ow=rk_ink(tt,P.ingrid-0.2,end);if(ow.a>0)rk_owner(x,ow.a,{k:ow.k});
  const tu=rk_ink(tt,P.next,c.pieces-0.6);if(tu.a>0)dp_slip(x,960,150,"Tutors · 2027","cyan",{align:"center",a:tu.a});
  // Linh's card at the middle, then up to the top as her record comes out of it in pieces
  const lu=rk_ink(tt,P.linh,null),up=ag_sine(clamp((tt-c.pieces+0.2)/1.0,0,1));
  if(lu.a>0)rk_linhCard(x,745,lerp(300,120,up),lu.a,{k:lu.k,contract:ag_in(tt,P.last,0.5)});
  // the ten pieces under her card, one after another, in two rows of five; then an empty "for: ?" on each
  for(let i=0;i<10;i++){const s0=c.pieces+0.9+i*0.16,u=ag_sine(clamp((tt-s0)/0.6,0,1));if(u<=0)continue;const [hx,hy]=rk_home(i);
    rk_piece(x,i,{x:hx,y:hy-28*(1-u),a:ag_in(u,0,0.5),outline:ag_in(tt,P.really+0.3+i*0.12,0.3),
      lit:i===2?ag_io(tt,P.sent-0.6,c.hold-0.2,0.4):0,outCol:(i===7||i===8)&&tt>P.hold?"coral":null});}
  const pu=rk_ink(tt,P.purpose,P.any+1.2);if(pu.a>0)dp_card(x,1592,300,290,{kick:"Earlier film",title:"For this purpose only"},{col:"cyan",a:pu.a,k:pu.k});
  const an=rk_ink(tt,P.any,end);if(an.a>0)dp_slip(x,951,666,"for: HR purposes","grey",{align:"center",a:an.a,ink:true});
  const se=rk_ink(tt,P.sent-0.4,end);if(se.a>0)dp_slip(x,960,770,"“We hold your bank details to pay you.”","cyan",{align:"center",a:se.a,ink:true});}
scene("whatfor",(ctx,S,t,sc)=>{const c=sc.cues,P=rk_once(sc,"P",()=>({
    ingrid:wAt(sc,"today","Ingrid Holm"),next:wAt(sc,"ready","next year's tutors"),linh:wAt(sc,"linh","Linh Nguyen"),last:wAt(sc,"linh","Her last contract"),
    purpose:wAt(sc,"written","For this purpose only"),any:wAt(sc,"anything","anything"),really:wAt(sc,"asks","really for"),
    sent:wAt(sc,"sentence","in a sentence"),hold:wAt(sc,"hold","shouldn't hold")}));
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"rkHall",keys:[[0,960,540,1.12],[0.3,640,480,1.28],[c.ready-0.4,900,500,1.1],[c.pieces-0.3,960,540,1.0]],d:2.2,
     draw:(x,tt)=>rk_ch2(x,tt,P,c,sc)}],0.6);
  // the series' name comes in once the camera has drawn back from Ingrid, so the card beside her never sits under it
  rk_kick(ctx,S,ag_in(t,sc.cues.ready+1.2,0.6));});

/* ---------------------------------------------------------------- 3 · Six reasons */
scene("six",(ctx,S,t,sc)=>{const c=sc.cues,P=rk_once(sc,"P",()=>({
    allows:wAt(sc,"allows","what allows it"),europe:wAt(sc,"gdpr","Europe's"),one:wAt(sc,"one","one of the six"),
    contracts:wAt(sc,"rests","contracts"),hours:wAt(sc,"rests","hours"),bank:wAt(sc,"rests","bank details"),
    tax:wAt(sc,"bylaw","tax number"),pay:wAt(sc,"bylaw","pay records"),dob:wAt(sc,"bylaw","date of birth"),pension:wAt(sc,"bylaw","pension"),
    yes:wAt(sc,"yes","her yes"),news:wAt(sc,"yes","send me news"),mei:wAt(sc,"mei","Mei's"),task:wAt(sc,"mei","public task"),
    none:wAt(sc,"none","no reason at all")}));
  const F=[P.contracts,P.hours,P.bank,P.tax,P.pay,P.dob,P.yes,null,null,P.task],FD=0.6;
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"rkHall",keys:[[0,960,540,1.0],[c.mei-0.4,1000,540,1.02]],d:2.0,draw:(x,tt)=>{rk_ingrid(x,tt);
      // Linh's card leaves; the band of the six reasons comes in, each as it's said
      const lo=1-ag_in(tt,0.6,0.6);if(lo>0)rk_linhCard(x,745,120,lo,{contract:1});
      // each reason lifts on the band as it's named: agreeing as "just one of the six", and each reason as a piece rests on it
      const land={},lift={agreed:ag_io(tt,P.one,P.one+1.3,0.35)};RK_ORDER.forEach(k=>{land[k]=Math.max(0,tt-c[k]+0.1);});
      F.forEach((f,i)=>{if(f!=null){const r=RK_PIECES[i].reason;lift[r]=Math.max(lift[r]||0,ag_io(tt,f-0.1,f+FD+0.5,0.25));}});
      // a line of light runs from the reason on the band to the piece's top edge, behind the pieces, and the reason lands there
      F.forEach((f,i)=>{if(f==null)return;const la=1-ag_in(tt,f+FD+0.3,0.5);if(tt<f||la<=0)return;const r=RK_PIECES[i].reason,[bx,by]=rk_bandAt(r),[hx,hy]=rk_home(i);
        withA(x,la,()=>dp_link(x,[bx,by+26],[hx+RK_CW/2+(i===9?16:0),hy-26],"green",ag_sine(clamp((tt-f)/FD,0,1))));});
      rk_band(x,{a:ag_in(tt,P.allows,0.6),land,lift});
      const gt=rk_ink(tt,P.europe,null);if(gt.a>0)dp_tag(x,699,84,"GDPR · Europe, and others like it","grey",{a:gt.a});
      // the pieces, each with its reason on its top edge as it lands; two find none
      for(let i=0;i<10;i++){const r=RK_PIECES[i].reason,f=F[i],none=(i===7||i===8)?ag_in(tt,P.none,0.8):0,mv=i===9?16*ag_in(tt,P.task+FD,0.8):0;
        rk_piece(x,i,{x:rk_home(i)[0]+mv,outline:1,pill:r,land:f==null?0:ag_in(tt,f+FD-0.15,0.3),since:tt-(f||0)-FD+0.15,thick:none,dim:none*0.6,outCol:(i===7||i===8)?"coral":null});}
      const pe=rk_ink(tt,P.pension,c.yes-0.2);if(pe.a>0)dp_tag(x,344,670,"for her pension","green",{a:pe.a,to:[459,650],p:ag_in(tt,P.pension+0.2,0.4)});
      const ye=rk_ink(tt,P.news,c.mei-0.4);if(ye.a>0)dp_tag(x,380,670,"“Send me news of tutoring work” · 2023","green",{a:ye.a,to:[705,650],p:ag_in(tt,P.news+0.2,0.4)});
      // Mei, who owns the registrar's data
      const me=ag_in(tt,P.mei-0.3,0.6);if(me>0)rk_right(x,"mei",tt,{a:me,dx:(1-ag_sine(me))*40});
      const mc=rk_ink(tt,P.mei+0.2,null);if(mc.a>0)rk_whoRight(x,"Registrar","Mei Tanaka",mc.a,mc.k);}}
  ],0.6);
  rk_kick(ctx,S,1);});

/* ---------------------------------------------------------------- 4 · As little as needed */
scene("little",(ctx,S,t,sc)=>{const c=sc.cues,P=rk_once(sc,"P",()=>({
    step:wAt(sc,"step","a step toward a contract"),marital:wAt(sc,"asked","marital status"),nostep:wAt(sc,"asked","no step used"),
    every:wAt(sc,"everyone","everyone who applied"),dob:wAt(sc,"everyone","date of birth"),hired:wAt(sc,"payroll","once a tutor"),
    out:wAt(sc,"held","could get out"),offer:wAt(sc,"after","after the offer"),del:wAt(sc,"deletes","deletes"),like:wAt(sc,"clinics","Like the clinics")}));
  const S2=c.drops-0.2,S3=c.deletes-0.3;
  ag_shots(ctx,S,t,sc.dur,[
    // later: the 2023 form, its lines one under another, what no step uses and what only payroll needs, once hired
    {at:0,place:"rkHall",later:true,keys:[[0,960,500,1.0]],draw:(x,tt)=>{rk_ingrid(x,tt);
      const f=rk_ink(tt,0.7,null),mk={4:ag_in(tt,P.marital,0.4),5:ag_in(tt,P.marital+0.6,0.4),6:ag_in(tt,P.dob,0.4),7:ag_in(tt,P.dob+0.6,0.4)};
      rk_form(x,580,150,{year:2023,a:f.a,k:f.k,mark:mk,stack:ag_in(tt,P.every,0.8),pulse:ag_io(tt,P.out,P.out+1.0,0.3)});
      const cp=rk_ink(tt,P.step,null);if(cp.a>0){rk_reason(x,"contract",1230,150,{a:cp.a});dp_slip(x,1370,190,"a step toward one","green",{a:cp.a});}
      const ns=rk_ink(tt,P.nostep,null);if(ns.a>0)dp_tag(x,1370,449,"no step uses it","coral",{a:ns.a,to:[1326,480],p:ag_in(tt,P.nostep+0.2,0.4)});
      const op=rk_ink(tt,P.hired,null);if(op.a>0)dp_tag(x,1370,549,"only payroll, once hired","coral",{a:op.a,to:[1326,580],p:ag_in(tt,P.hired+0.2,0.4)});}},
    // later: the 2027 form, without the two; payroll's two after the offer
    {at:S2,place:"rkHall",later:true,keys:[[S2,960,500,1.0]],draw:(x,tt)=>{rk_ingrid(x,tt);
      const f=rk_ink(tt,S2+0.6,null);rk_form(x,580,150,{year:2027,a:f.a,k:f.k});
      const ao=rk_ink(tt,P.offer,null);if(ao.a>0)dp_card(x,1370,300,330,{kick:"After the offer",title:"Date of birth",sub:"and bank details"},{col:"cyan",a:ao.a,k:ao.k});}},
    // later: the pieces again; the two with no reason deleted; Oregon brought back
    {at:S3,place:"rkHall",later:true,keys:[[S3,960,540,1.0]],draw:(x,tt)=>{rk_ingrid(x,tt);
      const back=ag_in(tt,S3+0.6,0.5),go=ag_in(tt,P.del+0.4,0.8),gap=clamp((tt-P.del-1.4)/1.0,0,1);
      for(let i=0;i<10;i++){const two=i===7||i===8;if(two&&go>=1)continue;
        rk_piece(x,i,{a:back*(two?1-go:1),outline:1,pill:RK_PIECES[i].reason,land:1,thick:two?1:0,dim:two?0.6:0,outCol:"coral",gap});}
      const dl=rk_ink(tt,P.del+1.0,null);if(dl.a>0)dp_slip(x,1074,666,"deleted · 6 Nov 2026","coral",{align:"center",a:dl.a,ink:true});
      const oc=rk_ink(tt,P.like,null);if(oc.a>0)rk_oregonCard(x,"A sample, a\u00a0number","nothing more",oc.a,oc.k);}}
  ],0.6);
  rk_kick(ctx,S,1);});

/* ---------------------------------------------------------------- 5 · A yes that means it */
scene("yes",(ctx,S,t,sc)=>{const c=sc.cues,P=rk_once(sc,"P",()=>({
    wrong:wAt(sc,"wrong","wrong reason"),saidno:wAt(sc,"no","said no"),pay:wAt(sc,"no","pay records"),law:wAt(sc,"no","a law requires"),
    bank:wAt(sc,"bank","bank details"),choice:wAt(sc,"real","real choice"),nameNum:wAt(sc,"oregon","a name or a number"),
    plain:wAt(sc,"plainly","plainly"),q:wAt(sc,"question","one real question"),nothing:wAt(sc,"nothing","nothing else changes"),
    built:wAt(sc,"built","built each semester"),saysno:wAt(sc,"built","says no"),leaves:wAt(sc,"built","leaves her out")}));
  const S2=c.plainly-0.3,S3=c.kept-0.3;
  ag_shots(ctx,S,t,sc.dur,[
    // later: the 2023 form's consent, alone; the wrong reason; what a no couldn't stop
    {at:0,place:"rkHall",later:true,keys:[[0,960,500,1.0]],draw:(x,tt)=>{rk_ingrid(x,tt);
      const f=rk_ink(tt,0.7,null);rk_consent(x,500,170,{a:f.a,k:f.k,wrong:ag_in(tt,P.wrong,0.4),ticked:1-ag_in(tt,P.saidno,0.4),no:ag_in(tt,P.saidno+0.3,0.4)});
      const wt=rk_ink(tt,P.wrong+0.2,null);if(wt.a>0)dp_tag(x,1440,200,"wrong reason","coral",{a:wt.a});
      const pr=ag_in(tt,P.pay,0.5);if(pr>0)rk_piece(x,4,{x:520,y:470,a:pr,pill:"law",land:1,outline:1});
      const ka=rk_ink(tt,P.law,null);if(ka.a>0)dp_slip(x,635,636,"kept anyway","green",{align:"center",a:ka.a});
      const bk=ag_in(tt,P.bank,0.5);if(bk>0)rk_piece(x,2,{x:800,y:470,a:bk,pill:"contract",land:1,outline:1});
      const rc=rk_ink(tt,P.choice,null);if(rc.a>0)dp_slip(x,960,740,"a yes only where a no is a real choice","cyan",{align:"center",a:rc.a,ink:true});
      const oc=rk_ink(tt,P.nameNum,null);if(oc.a>0)rk_oregonCard(x,"A real choice","the same test either way",oc.a,oc.k);}},
    // later: the 2027 form; what it holds, why and for how long; one real question
    {at:S2,place:"rkHall",later:true,keys:[[S2,960,500,1.0]],draw:(x,tt)=>{rk_ingrid(x,tt);
      const f=rk_ink(tt,S2+0.6,null);rk_form(x,580,120,{year:2027,a:f.a,k:f.k,open:clamp((tt-P.plain)/1.0,0,1),ask:ag_in(tt,P.q,0.6),lit:ag_io(tt,P.nothing,P.nothing+1.6,0.3)});}},
    // later: her wishes, kept on the person; the list built from the yeses, and without her once she says no
    {at:S3,place:"rkHall",later:true,keys:[[S3,960,520,1.0]],draw:(x,tt)=>{rk_ingrid(x,tt);
      const w=rk_ink(tt,S3+0.6,null);rk_wishes(x,360,190,{a:w.a,k:w.k,no:ag_in(tt,P.saysno,0.6)});
      const l=rk_ink(tt,P.built-0.2,null);rk_list(x,1040,190,{a:l.a,k:l.k,build:clamp((tt-P.built)/1.6,0,1),out:clamp((tt-P.leaves)/0.9,0,1)});}}
  ],0.6);
  rk_kick(ctx,S,1);});

/* ---------------------------------------------------------------- 6 · Before a new use */
scene("newuse",(ctx,S,t,sc)=>{const c=sc.cues,P=rk_once(sc,"P",()=>({
    clara:wAt(sc,"clara","Clara Jensen"),records:wAt(sc,"clara","the tutors' records"),employ:wAt(sc,"new","employ and pay"),plan:wAt(sc,"new","not to plan"),
    check:wAt(sc,"check","privacy check"),q1:wAt(sc,"q1","What is it for?"),q2:wAt(sc,"q1","Does it fit"),q3:wAt(sc,"q2","What's the least"),
    q4:wAt(sc,"q2","Which reason"),q5:wAt(sc,"q3","What could go wrong"),q6:wAt(sc,"q3","who decides"),needs:wAt(sc,"needs","Clara needs"),
    unit:wAt(sc,"needs","hours by unit"),nonames:wAt(sc,"needs","no names"),small:wAt(sc,"small","small units"),owns:wAt(sc,"signs","who owns the data"),
    signs:wAt(sc,"signs","signs yes"),gov:wAt(sc,"signs","data governance"),oregon:wAt(sc,"counts","In Oregon"),deeper:wAt(sc,"deeper","deeper check")}));
  ag_shots(ctx,S,t,sc.dur,[
    // later: Clara and her request; then the privacy check, its answers one at a time, the counts it allows, and the deeper check
    {at:0,place:"rkHall",later:true,keys:[[0,1000,520,1.0]],draw:(x,tt)=>{rk_ingrid(x,tt);
      const ca=ag_in(tt,0.7,0.6);rk_right(x,"clara",tt,{a:ca,dx:(1-ag_sine(ca))*40});
      const cc=rk_ink(tt,P.clara,null);if(cc.a>0)rk_whoRight(x,"Planning","Clara Jensen",cc.a,cc.k);
      const mv=ag_sine(clamp((tt-c.check)/1.0,0,1)),rq=rk_ink(tt,P.records,null);if(rq.a>0)rk_request(x,1090,lerp(360,140,mv),rq.a,rq.k);
      const h1=rk_ink(tt,P.employ,c.check),h2=rk_ink(tt,P.plan,c.check);
      if(h1.a>0)dp_tag(x,380,300,"held: to employ and pay tutors","grey",{a:h1.a});if(h2.a>0)dp_tag(x,1090,570,"asked: to plan","grey",{a:h2.a});
      const ck=rk_ink(tt,P.check,null);
      if(ck.a>0)rk_check(x,340,120,{a:ck.a,k:ck.k,q:[P.q1,P.q2,P.q3,P.q4,P.q5,P.q6].map(q=>ag_in(tt,q,0.4)),
        ans:[P.needs,P.unit-0.3,P.unit+0.8,P.nonames+0.5,P.small,P.owns].map(q=>ag_in(tt,q,0.5)),signed:ag_in(tt,P.signs,0.6),kept:ag_in(tt,P.gov,0.5)});
      const cn=rk_ink(tt,P.unit+1.2,P.deeper-0.3);if(cn.a>0)rk_counts(x,1090,350,{a:cn.a,k:cn.k,u:clamp((tt-P.unit-1.4)/1.2,0,1),tag:ag_in(tt,P.nonames+0.3,0.4)});
      const oc=rk_ink(tt,P.oregon,null);if(oc.a>0)rk_oregonCard(x,"42 a month to 108","counted with no names",oc.a,oc.k,{x:1090,y:652,w:460});
      const dk=rk_ink(tt,P.deeper+0.3,null);if(dk.a>0)rk_deeper(x,1090,350,dk.a,dk.k);}}
  ],0.6);
  rk_kick(ctx,S,1);});

/* ---------------------------------------------------------------- 7 · A reason you can say */
scene("reason",(ctx,S,t,sc)=>{const c=sc.cues,P=rk_once(sc,"P",()=>({
    ends:wAt(sc,"ends","contract ends"),say:wAt(sc,"every","a reason it can say"),next:wAt(sc,"next","comes next"),
    asks:wAt(sc,"answer","When she asks"),why:wAt(sc,"answer","what, and why")}));
  const S2=c.answer-0.3,S3=c.oregon-0.4,KEEP=[0,1,2,3,4,5,6,9];
  ag_shots(ctx,S,t,sc.dur,[
    // later: the eight pieces, each with its reason; her contract ends; each reason lit in turn
    {at:0,place:"rkHall",later:true,keys:[[0,960,520,1.0]],draw:(x,tt)=>{rk_ingrid(x,tt);
      const b=ag_in(tt,0.7,0.6);rk_linhCard(x,745,120,b,{contract:1,ended:clamp((tt-P.ends-0.2)/0.8,0,1)});
      KEEP.forEach((i,j)=>{const l=ag_io(tt,P.say+j*0.3,P.say+j*0.3+0.7,0.25);rk_piece(x,i,{a:b,pill:RK_PIECES[i].reason,land:1,outline:1,gap:1,glow:18+30*l,lit:l});});
      const nx=rk_ink(tt,P.next,null);if(nx.a>0)dp_tag(x,690,700,"Next: How long, and then what","cyan",{a:nx.a});}},
    // later: Linh, and what HR can tell her it holds about her, and why
    {at:S2,place:"rkHall",later:true,keys:[[S2,980,520,1.0]],draw:(x,tt)=>{rk_ingrid(x,tt);
      const la=ag_in(tt,S2+0.6,0.6);rk_right(x,"linh",tt,{a:la,dx:(1-ag_sine(la))*40});
      const an=rk_ink(tt,P.asks+0.6,null);if(an.a>0)rk_answer(x,380,240,{a:an.a,k:an.k,u:clamp((tt-P.why+0.6)/1.4,0,1)});}},
    // Oregon again, by day: the chairs full, the number in his hand
    {at:S3,place:"rkClinicDay",keys:[[S3,1180,500,1.12],[c.keep,1100,520,1.06]],d:4,draw:(x,tt)=>rk_byDay(x,tt,P,c,{counts:false,t0:S3-0.6})}
  ],0.6);
  rk_kick(ctx,S,1-ag_in(t,S3-0.2,0.6));
  dp_end(ctx,S,t,c.keep-0.2,"A reason to keep it","Keep data for a reason you can say.","Film 1 of 5","Kept for a reason");});

ag_cutInto(["whatfor","six","little","yes","newuse","reason"]);
