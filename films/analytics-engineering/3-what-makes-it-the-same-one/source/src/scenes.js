/* ===== What makes it the same one: scenes =====
   Eight chapters, as in ../script.md. Look-alikes in the past (Bertillon's cards, the West story) and the title; Aisha under
   three keys; profiling with evidence; key sets; rules, most trusted first; the look-alike kept apart by a person's decision;
   one hash everywhere; and codes, owned by the business. The end card follows the last chapter.
   Motion (the series' helpers in shared/src/weeds.js): every shot drifts, things arrive with a spring, and what two chapters
   share carries across the cut: Aisha's outline (1 → 2), her learner circle (5 → 6), her key (6 → 7) and its row (7 → 8).
   Sound: every effect in tools/score.py fires at the same moment as the thing it belongs to here, so keep the two in step. */

// what three things share: Aisha's keys as each system wrote them, and as staging writes them
const SM_AK=[["SIS|","S-20417"],["LMS|","u-88213"],["SC|","·Aisha.K@Mail.example·"]];
// a tag whose right edge sits at x
function sm_tagR(ctx,x,y,s,col,sz){tag(ctx,x-tw(ctx,s,sz||18,700)-26,y,s,col,{size:sz||18});}

// a tag whose last part (a code character, like |) is set in the mono font, so it can't be misread
function sm_tagBar(ctx,x,y,s,m,col,sz){const w1=tw(ctx,s,sz,700),w=w1+sz*0.62+26,h=sz+16;glass(ctx,x,y-h/2,w,h,h/2,col,{fill:"rgba(7,12,24,0.88)",glow:10,ea:0.8});
  T(ctx,s,x+13,y+sz*0.36,{w:700,size:sz,color:rgba(col,1)});T(ctx,m,x+13+w1,y+sz*0.36,{f:"mono",w:700,size:sz,color:rgba(col,1)});}

/* ---------- 1. Look-alikes ---------- */
scene("west",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");histBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.04,y:460});
  const cS=c("story"),m1=w("measure","Bertillon"),m2=w("measure","repeat"),m3=w("measure","measuring"),fl=w("card","filed");
  const A1=1-fin(t,cS-0.4,0.8),A2=fin(t,cS-0.1,0.9);
  // Paris: the sketched man on a sheet; calipers close on his head, a tape takes his arm span, calipers take his finger
  withA(ctx,A1,()=>{yearTag(ctx,60,80,"1880s · Paris",CLAY,fin(t,0.3,0.6));
    arrive(ctx,520,490,t,0.5,()=>{kt_paper(ctx,140,170,760,640,t,{seed:5,col:[236,226,204],curl:0.5});
      sm_profile(ctx,470,420,1.05,clamp((t-0.9)/3.0,0,1),t);sm_hand(ctx,745,700,0.55,fin(t,1.6,1.4),t);},{d:1.0,from:0.94});
    const c1=ease(fin(t,m1-0.5,0.5)),c3=ease(fin(t,m3-0.4,0.5)),mv=ease(fin(t,m2-0.4,1.3));
    sm_calipers(ctx,lerp(442,865,mv),lerp(112,632,mv),lerp(205,120,mv),lerp(lerp(380,262,c1),lerp(170,104,c3),mv),lerp(0,Math.PI/2,mv),fin(t,m1-1.0,0.5));
    sm_tape(ctx,190,640,690,fin(t,m2-0.1,0.9),fin(t,m2-0.2,0.3));
    withA(ctx,fin(t,m2+0.8,0.4),()=>T(ctx,"arm span",415,730,{w:700,size:20,align:"center",color:rgba(SM_INK,0.9)}));
    // the card, written as each measure is taken; then it files itself into the drawer, by its numbers
    const fk=ease(fin(t,fl-0.2,1.1)),cx=lerp(1060,1250,fk),cy=lerp(200,610,fk),cs=lerp(1,0.32,fk);
    arrive(ctx,1335,640+90,t,c("card")-0.6,()=>sm_drawer(ctx,1075,640,520,200,t,1),{dy:30,from:0.95});
    ctx.save();ctx.translate(cx,cy);ctx.scale(cs,cs);ctx.translate(-cx,-cy);
    arrive(ctx,cx+280,cy+130,t,m1-1.2,()=>sm_card(ctx,cx,cy,560,270,t,{a:1-fin(fk,0.78,0.22),title:"Bertillon · measures, cm",seed:3,
      rows:[["head length","19.4"],["arm span","181.0"],["left middle finger","11.6"]],on:[fin(t,m1+0.2,0.7),fin(t,m2+0.8,0.7),fin(t,m3+0.3,0.7)]}),{dy:24});ctx.restore();
    arrive(ctx,1335,595,t,fl+1.0,()=>T(ctx,"one card, filed by its numbers",1335,600,{w:700,size:24,align:"center",color:rgba(PARCH,1)}),{dy:12});});
  // Leavenworth: two cards with nearly the same numbers, and two fingerprints that differ
  const bA=w("bridge","Aisha"),sp=ease(fin(t,bA-0.6,1.3)),gone=fin(t,bA-0.7,0.5);
  withA(ctx,A2,()=>{yearTag(ctx,60,80,"1903 · Leavenworth",CLAY,1);arrive(ctx,170,134,t,cS+0.6,()=>tag(ctx,60,134,"as the story is told",PARCH,{size:18}),{from:0.8});
    const C=[["Will West",[["head length","19.7"],["arm span","187.0"],["left middle finger","12.2"]],520-200*sp,1],["William West",[["head length","19.8"],["arm span","188.0"],["left middle finger","12.3"]],1020+200*sp,0]];
    C.forEach(([nm,rows,x,kind],i)=>{arrive(ctx,x+190,320,t,cS+0.3+i*0.5,()=>sm_card(ctx,x,180,380,260,t,{title:nm,rows,seed:7+i}),{dy:30});
      arrive(ctx,x+190,650,t,w("story","Fingerprints")-0.4,()=>{kt_paper(ctx,x+105,545,170,210,t,{seed:11+i,col:[240,232,214],curl:0.3});sm_print(ctx,x+190,650,82,kind,clamp((t-w("story","Fingerprints"))/2.2,0,1),1);},{from:0.9});});
    withA(ctx,1-gone,()=>{arrive(ctx,960,500,t,w("story","matched"),()=>tag(ctx,960,500,"nearly the same numbers",PARCH,{align:"center",size:20}),{from:0.8});
      arrive(ctx,960,650,t,w("story","apart"),()=>tag(ctx,960,650,"different fingerprints",EDGE_,{align:"center",size:20}),{from:0.8});});
    arrive(ctx,960,112,t,c("bridge"),()=>T(ctx,"looking alike ≠ being the same",960,118,{w:800,size:38,align:"center",color:rgba(PARCH,1)}),{from:0.92});
    // the two cards give up an outline each; the outlines meet, and become Aisha's, in the films' dark glass
    const mg=ease(fin(t,bA-0.5,1.1));if(mg>0&&mg<1)withA(ctx,Math.sin(Math.PI*mg)*0.8,()=>{[520,1020].forEach(x0=>{const x=lerp(x0+190,960,mg),y=lerp(310,640,mg),ww=lerp(380,300,mg),hh=lerp(260,320,mg);ctx.save();ctx.setLineDash([8,8]);ctx.strokeStyle=rgba(INK,0.7);ctx.lineWidth=2;rr(ctx,x-ww/2,y-hh/2,ww,hh,lerp(6,120,mg));ctx.stroke();ctx.restore();});});
    sm_bust(ctx,960,800,320,KIND,{a:fin(t,bA,0.5),p:fin(t,bA,1.4)});
    arrive(ctx,960,842,t,bA+0.8,()=>T(ctx,"Aisha",960,850,{w:800,size:28,align:"center",color:rgba(KIND,1)}),{dy:10});});
  ctx.restore();dark(ctx,S,fin(t,B+0.3,0.8));weedsTitle(ctx,S,t,B,"What makes it the same one","identity is a decision, written down",WEED);
  fadeIn(ctx,S,t);vign(ctx,S);});

/* ---------- 2. Three keys ---------- */
scene("three",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.03});
  // Aisha's outline, carried from the past, moves to her place
  const m=ease(fin(t,0,1.4)),bx=lerp(960,1420,m),by=lerp(800,730,m),bh=lerp(320,300,m);
  sm_bust(ctx,bx,by,bh,KIND,{});T(ctx,"Aisha",bx,by+44,{w:800,size:28,align:"center",color:rgba(KIND,1)});
  arrive(ctx,1450,205,t,w("aisha","graduate")-0.2,()=>{glass(ctx,1150,150,600,112,18,TRUST,{glow:14,ea:0.8,fill:"rgba(7,12,24,0.95)"});T(ctx,"Graduate Certificate in Data Analytics",1172,196,{w:800,size:26});
    tag(ctx,1172,232,"completed",GOOD,{size:18});},{dy:24});
  // three streams, each into its system's faint outline; a key lifts out of each as it's named
  const K=[w("keys","student ID"),w("keys","account"),w("typed","email")],Y=[280,450,620];
  SRC3.forEach(([nm,col],i)=>{sm_stream(ctx,-20,[170,500,850][i],380,Y[i]+55,col,t,fin(t,0.3+i*0.3,0.8),fin(t,0.3+i*0.3,1.6));
    arrive(ctx,640,Y[i]+55,t,[w("keys","student system"),w("keys","learning platform"),w("typed","short-course")][i]-0.2,()=>sm_sysBox(ctx,380,Y[i],520,110,i,1),{from:0.95});
    arrive(ctx,560,Y[i]+76,t,K[i],()=>sm_key(ctx,404,Y[i]+76,SM_AK[i][1],col,{hi:pulseAt(t,K[i],1.0)}),{dy:40,from:0.8});});
  arrive(ctx,640,232,t,w("inside","Three keys"),()=>tag(ctx,640,232,"three keys",INK,{align:"center",size:20}),{from:0.8});
  arrive(ctx,640,792,t,w("inside","Each one"),()=>T(ctx,"each means something only in its own system",640,800,{w:600,size:22,align:"center",color:rgba(SOFT,1)}),{dy:12});
  // between the keys and Aisha: which learner?
  const q=fin(t,c("which")-0.2,0.6);Y.forEach((y,i)=>arrowTo(ctx,905,y+55,1080,540,SRC3[i][1],q*0.6,{p:q,dash:[6,8],nohead:true,lw:1.8}));
  arrive(ctx,1130,520,t,c("which")-0.2,()=>{T(ctx,"?",1130,560,{w:800,size:96,align:"center",color:rgba(EDGE_,1)});T(ctx,"which learner?",1130,610,{w:700,size:22,align:"center",color:rgba(EDGE_,1)});},{from:0.7});
  ctx.restore();vign(ctx,S);});

/* ---------- 3. Profile first ---------- */
const SM_NULLQ=["-- Evidence: keys that are missing or blank, in the current version of each source table.","-- Run: dbt show --select profile_null_keys --profiles-dir .","select 'learning_platform.users' as source_table, 'student_id' as key_column,","    count(*) as current_rows,","    count(case when nullif(trim(student_id), '') is null then 1 end) as missing","from {{ source('learning_platform', 'users') }}","where _is_current = 'true'"];
// an evidence card: the claim, the query it comes from, and its result rows; o.grey turns it into a guess
function sm_evid(ctx,x,y,w,claims,file,rows,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const g=o.grey||0,col=mix(KT_AI,SOFT,g);
  withA(ctx,a*(1-0.45*g),()=>{const h=o.h;glass(ctx,x,y,w,h,16,col,{glow:10,ea:0.7,fill:"rgba(6,10,20,0.95)"});
    claims.forEach((s,i)=>withA(ctx,o.cA?o.cA[i]:1,()=>T(ctx,s,x+20,y+38+i*30,{w:700,size:21,color:rgba(mix(INK,col,0.35),1)})));let yy=y+38+claims.length*30;
    ctx.fillStyle="rgba(170,200,245,0.14)";ctx.fillRect(x+14,yy-8,w-28,1.2);
    if(file){ctx.fillStyle=rgba(KIND,0.9);rr(ctx,x+20,yy+6,10,10,3);ctx.fill();T(ctx,file,x+38,yy+18,{f:"mono",w:500,size:18,color:rgba(KIND,1)});yy+=34;
      ctx.fillStyle="rgba(255,255,255,0.04)";rr(ctx,x+14,yy,w-28,rows.length*28+14,8);ctx.fill();
      rows.forEach((r,i)=>withA(ctx,o.rA?o.rA[i]:1,()=>T(ctx,r,x+26,yy+28+i*28,{f:"mono",w:500,size:18})));yy+=rows.length*28+14;
      if(o.note)withA(ctx,o.noteA==null?1:o.noteA,()=>T(ctx,o.note,x+26,yy+26,{w:600,size:18,color:rgba(SOFT,1)}));T(ctx,SM_RUNS,x+w-18,y+h-16,{w:600,size:18,align:"right",color:rgba(SOFT,0.9)});}
    else T(ctx,"no query",x+20,yy+20,{f:"mono",w:500,size:18,color:rgba(SOFT,0.9)});});}
scene("profile",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.03,x:900});
  const cF=w("first","agent profiles"),cN=c("nulls"),cSh=c("shared"),cO=c("orphans"),cG=c("guess");
  arrive(ctx,150,700,t,0.3,()=>{person(ctx,"jun",150,850,0.52,{pose:t>cF?"explain":"stand",t});roleTag(ctx,150,500,"jun");},{dy:20,from:0.95});
  arrive(ctx,170,300,t,c("first")+0.8,()=>{kt_agent(ctx,170,300,30,t,{busy:fin(t,cF,0.5)*(1-fin(t,cO+4,1))});tag(ctx,170,385,"agent",KT_AI,{align:"center",size:18});},{from:0.7});
  arrive(ctx,825,96,t,0.4,()=>tag(ctx,825,96,"profile first",WEED,{align:"center",size:22}),{from:0.8});
  // the first claim: its query, then its result
  const cQ=c("first")+1.4;arrive(ctx,825,320,t,cQ,()=>sm_file(ctx,360,180,910,"analyses/profile_null_keys.sql",SM_NULLQ,{size:18,lh:29,wrap:true,p:clamp((t-cQ-0.2)/3.0,0,1),edge:KT_AI}),{dy:30});
  arrive(ctx,560,150,t,w("nulls","Four"),()=>tag(ctx,360,148,"4 of 42 accounts: no student ID",KT_AI,{size:20}),{from:0.85});
  arrive(ctx,700,550,t,w("nulls","no student ID"),()=>sm_rows(ctx,360,506,["source_table","key_column","current_rows","missing"],[["learning_platform.users","student_id","42","4"]],{col:KT_AI}),{dy:20});
  [["claim",148,w("first","every claim")],["query",330,w("first","query")],["result",550,w("nulls","no student ID")]].forEach(([s,y,t0])=>arrive(ctx,300,y,t,t0,()=>sm_tagR(ctx,348,y,s,SOFT,18),{from:0.8}));
  // two more evidence cards stack beside it as they're named, then a claim with no query
  arrive(ctx,1565,245,t,cSh-0.1,()=>sm_evid(ctx,1290,120,550,["one email, two students","one email, two accounts"],"analyses/profile_shared_emails.sql",["student_system | nguyen.family@… | 2","learning_platform | nguyen.family@… | 2"],
    {h:252,cA:[1,fin(t,w("shared","so do"),0.5)],rA:[fin(t,w("shared","family email"),0.5),fin(t,w("shared","platform accounts"),0.5)]}),{dy:30});
  arrive(ctx,1565,510,t,cO-0.1,()=>sm_evid(ctx,1290,392,550,["2 orphans as typed","0 once trimmed and lower-cased"],"analyses/profile_orphans.sql",["short_courses.enrolments -> learners | 2 | 0"],
    {h:262,cA:[1,fin(t,w("orphans","Trimmed"),0.5)],rA:[fin(t,w("orphans","no customer"),0.5)],note:"of the enrolments with an email",noteA:fin(t,w("orphans","with an email"),0.5)}),{dy:30});
  const gr=fin(t,w("guess","without"),0.6);
  arrive(ctx,1565,712,t,cG-0.7,()=>{sm_evid(ctx,1290,676,550,["Emails are unique across the student system."],null,[],{h:108,grey:gr});withA(ctx,fin(t,w("guess","guess")-0.1,0.4),()=>sm_tagR(ctx,1822,760,"guess",EDGE_,20));},{dy:30});
  arrive(ctx,825,660,t,w("guess","claim"),()=>T(ctx,"a claim without its query is a guess",825,668,{w:700,size:28,align:"center",color:rgba(INK,1)}),{dy:12});
  ctx.restore();vign(ctx,S);});

/* ---------- 4. Key sets ---------- */
const SM_KS=["key_set,system_name,owner","SIS,student system,Registrar's office","LMS,learning platform,Learning team","SC,short-course platform,Learning team"];
const SM_KM=["    business_key('SIS', 'student_id')                  ->  'SIS|S-20417'","    business_key('SIS', ['student_id', 'award_code'])  ->  'SIS|S-20417|GCDA'","    hash_key(['learner_bk'])                            ->  sha-256 of 'SIS|S-20417', 64 hex characters","    hash_key(['learner_bk', 'award_bk'])                ->  the key of a relationship between two keys"];
const SM_ST=["        nullif(lower(trim(customer_email)), '') as email,","…","    select","        {{ business_key('SC', 'email') }} as customer_bk,","        *"];
// Aisha's keys in this chapter's places, as they stand at time t (also where chapter 5 picks them up)
function sm_setKeys(ctx,t,sc,o){o=o||{};const w=(id,s,of)=>kt_w(sc,id,s,of),dots=1-fin(t,w("case","spaces"),0.9),low=fin(t,w("case","capitals"),0.3);
  SM_AK.forEach(([pre,k],i)=>{const q=fin(t,w("set","short code")+i*0.35,0.8),s=i<2?k:(dots<=0.01?(low>0.5?"aisha.k@mail.example":"Aisha.K@Mail.example"):k);
    sm_key(ctx,1000,170+i*80,s,SRC3[i][1],{pre,q,dots,a:o.a,hi:i===2?pulseAt(t,w("case","capitals"),1.2):0});});}
scene("sets",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.03});
  const cA=c("alike"),cC=c("case"),tm=w("set","owner")+0.5;
  arrive(ctx,420,220,t,0.4,()=>sm_file(ctx,80,120,680,"seeds/key_sets.csv",SM_KS,{size:20,lh:32,edge:TRUST,lit:{1:pulseAt(t,w("set","short code"),1.4),2:pulseAt(t,w("set","short code")+0.35,1.4),3:pulseAt(t,w("set","short code")+0.7,1.4)}}),{dy:30});
  arrive(ctx,230,350,t,w("where","key sets"),()=>tag(ctx,80,350,"decided 5 Oct 2026 · Noor",TECH,{size:18}),{from:0.85});
  arrive(ctx,1200,250,t,0.8,()=>sm_setKeys(ctx,t,sc),{dy:24,from:0.95});
  const ow=fin(t,w("set","owner"),0.5);[["Registrar's office",TRUST],["Learning team",[126,224,140]],["Learning team",[255,128,168]]].forEach(([s,col],i)=>withA(ctx,ow,()=>{const kw=sm_keyW(i<2?SM_AK[i][1]:"·Aisha.K@Mail.example·",22,SM_AK[i][0]);
    T(ctx,s,1000+kw+22,170+i*80+7,{w:600,size:19,color:rgba(SOFT,1)});}));
  // the same-looking key, for two different people; qualified, they can't be confused
  const qa=fin(t,w("alike","Qualified"),0.8);
  arrive(ctx,1530,420,t,cA,()=>tag(ctx,1530,420,"same-looking key, different people",EDGE_,{align:"center",size:18}),{from:0.85});
  [[1340,0],[1720,1]].forEach(([x,k],i)=>{arrive(ctx,x,560,t,cA+0.3+i*0.3,()=>{sm_bust(ctx,x,580,120,SRC3[k][1],{});sm_key(ctx,x,630,"S-20417",SRC3[k][1],{align:"center",size:20,pre:["SIS|","LMS|"][k],q:qa});},{dy:24});});
  arrive(ctx,1530,700,t,w("alike","Qualified"),()=>tag(ctx,1530,700,"qualified",GOOD,{align:"center",size:20}),{from:0.8});
  // the macro that writes a qualified key, and the line in staging that writes the email one way
  arrive(ctx,670,485,t,tm,()=>sm_file(ctx,80,390,1180,"macros/keys.sql",SM_KM,{size:18,lh:29,edge:[200,170,255],p:clamp((t-tm-0.1)/1.4,0,1)}),{dy:30});
  arrive(ctx,450,700,t,cC,()=>sm_file(ctx,80,610,740,"models/staging/short_courses/stg_short_courses__learners.sql",SM_ST,{size:18,lh:29,edge:LAYER4[0][1],label:null,lit:{0:fin(t,w("case","trimmed"),0.5)}}),{dy:30});
  withA(ctx,fin(t,cC,0.5),()=>T(ctx,SM_RUNS,820-18,610+219+30,{w:600,size:18,align:"right",color:rgba(SOFT,0.9)}));
  arrive(ctx,920,700,t,w("case","trimmed"),()=>tag(ctx,860,700,"trimmed",LAYER4[0][1],{size:20}),{from:0.8});
  arrive(ctx,920,756,t,w("case","one case"),()=>tag(ctx,860,756,"one case",LAYER4[0][1],{size:20}),{from:0.8});
  ctx.restore();vign(ctx,S);});

/* ---------- 5. Rules, most trusted first ---------- */
const SM_RC=[["int_learner_key_candidates.sql",["-- a student ID is a learner","by_student_id as (","","    select","        qualified_key,","        qualified_key as learner_bk,","        2 as priority,","        'student ID' as match_rule","    from learner_keys","    where key_set = 'SIS'","…"],6],
  ["int_learner_key_candidates.sql",["-- a platform account is the student whose ID it holds","by_student_id_held as (","…","        student_bk_held as learner_bk,","        3 as priority,","…"],4],
  ["int_learner_key_candidates.sql",["-- an email identifies a student only if exactly one student has it","student_emails as (","…","    group by email","    having count(*) = 1","…"],4],
  ["int_learner_key_candidates.sql",["-- anything else is a learner of its own","by_own_key as (","…","        9 as priority,","        'own key' as match_rule","…"],3],
  ["int_learner_keys_matched.sql",["by_platform_email as (","…","        5 as priority,","        'same email as one platform user' as match_rule"],2]];
const SM_RULES=[[1,"a recorded decision"],[2,"student ID"],[3,"student ID held by the platform"],[4,"same email as exactly one student"],[5,"same email as one platform user"],[9,"own key"]];
const SM_YML=["    identity:","      - A student ID is a learner.","      - A learning platform account is the learner whose student ID it holds.","      - An account or a short-course customer with no student ID is the learner whose email it shares, if exactly one student has that email.","      - A short-course customer can also be the learner of a platform account with the same email, if exactly one has it.","      - Anything left is a learner of its own."];
scene("rules",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.03});
  const cB=c("best"),cAi=c("aisha"),acr=w("aisha","ninety")-0.6,cOw=c("owned"),P1=1-fin(t,acr-0.6,0.5);
  // Aisha's qualified keys, carried from the last chapter, slip away to make room for the rules
  // Aisha's qualified keys, carried from the last chapter, move left and wait for the rules
  const kk=ease(fin(t,0,1.4)),ko=fin(t,c("id")-0.6,0.5);withA(ctx,1-ko,()=>{SM_AK.forEach(([pre,k],i)=>sm_key(ctx,lerp(1000,160,kk),lerp(170+i*80,260+i*90,kk),i<2?k:"aisha.k@mail.example",SRC3[i][1],{pre}));
    arrive(ctx,360,180,t,w("same","same learner"),()=>tag(ctx,160,180,"the same learner?",EDGE_,{size:20}),{from:0.85});});
  withA(ctx,fin(t,w("same","most trusted"),0.6)*(1-fin(t,acr-0.4,0.7)),()=>{for(let k=0;k<6;k++){ctx.save();ctx.setLineDash([6,8]);ctx.strokeStyle=rgba(LAYER4[1][1],0.25);ctx.lineWidth=1.5;rr(ctx,1100,140+k*76,720,60,14);ctx.stroke();ctx.restore();}});
  withA(ctx,P1,()=>{
    arrive(ctx,1460,92,t,0.6,()=>tag(ctx,1460,92,"rules, most trusted first",LAYER4[1][1],{align:"center",size:22}),{from:0.85});
    // one block of code for each rule: the card shows the rule being named
    const RT=[c("id"),c("held"),c("email"),c("left"),cB-0.2];
    SM_RC.forEach(([f,ls,lit],i)=>{const t0=RT[i]-0.15,t1=i<4?RT[i+1]-0.5:1e9,a=1-fin(t,t1,0.35);if(t>t1+0.4)return;
      arrive(ctx,510,300,t,t0,()=>sm_file(ctx,60,130,900,"models/intermediate/"+f,ls,{size:18,lh:29,edge:LAYER4[1][1],a,lit:{[lit]:fin(t,t0+0.6,0.5)},litCol:LAYER4[1][1]}),{dy:24});});
    // the rule cards, most trusted first; the recorded decision waits for the next chapter
    const RA=[cB-0.2,c("id"),c("held"),c("email"),cB-0.2,c("left")],RY=k=>140+k*76;
    SM_RULES.forEach(([p,s],k)=>{const lit=k===1?fin(t,cAi+0.3+1.0,0.3):k===2?fin(t,cAi+0.6+1.2,0.3):k===3?fin(t,cAi+0.9+1.4,0.3):0;
      arrive(ctx,1460,RY(k)+30,t,RA[k],()=>sm_rule(ctx,1100,RY(k),720,p,s,{dash:k===0,dim:k===0?0.3:0,on:Math.max(lit*(1-fin(t,acr-1,0.6)),pulseAt(t,RA[k],1.2))}),{dy:20,from:0.9});});
    arrive(ctx,1460,622,t,w("best","most trusted"),()=>T(ctx,"each key: the most trusted rule that fits",1460,628,{w:600,size:22,align:"center",color:rgba(SOFT,1)}),{dy:12});
    // Aisha's three keys run down the lane beside the stack, each to the first card that fits
    [1,2,3].forEach((k,i)=>{const t0=cAi+0.3*i,u=ease(fin(t,t0,1.0+0.2*i)),y=lerp(110,RY(k)+30,u);if(t<t0)return;glow(ctx,1062,y,18,SRC3[i][1],0.5);ctx.fillStyle=rgba(SRC3[i][1],1);ctx.beginPath();ctx.arc(1062-i*10+10,y,8,0,TAU);ctx.fill();});
    arrive(ctx,510,690,t,cAi+0.9,()=>sm_rows(ctx,60,600,["qualified_key","match_rule","learner_bk"],[["SIS|S-20417","student ID","SIS|S-20417"],["LMS|u-88213","student ID held by the learning platform","SIS|S-20417"],["SC|aisha.k@mail.example","same email as one student","SIS|S-20417"]],
      {col:LAYER4[1][1],rowA:[fin(t,cAi+1.0,0.4),fin(t,cAi+1.4,0.4),fin(t,cAi+1.8,0.4)],cellCol:(i,j)=>j===0?SRC3[i][1]:j===2?SRC3[0][1]:INK}),{dy:20});
    withA(ctx,fin(t,cAi+0.9,0.4),()=>T(ctx,"int_learner_keys_matched · Aisha's keys",60,588,{f:"mono",w:500,size:18,color:rgba(SOFT,0.95)}));});
  // pull back: ninety keys fall into forty-six learners; the rules in words, approved by Mei
  const pA=fin(t,acr,0.5),lp=clamp((t-acr)/3.2,0,1);
  sm_learners(ctx,80,140,840,520,lp,t,{a:pA,hi:fin(t,acr+3,0.6)});
  withA(ctx,pA,()=>{arrive(ctx,463,110,t,acr+3,()=>tag(ctx,463,112,"Aisha",KIND,{align:"center",size:18}),{from:0.8});
    arrive(ctx,500,600,t,w("aisha","ninety"),()=>T(ctx,"90 keys",420,612,{w:800,size:40,align:"right"}),{from:0.9});
    arrive(ctx,600,600,t,w("aisha","forty-six"),()=>T(ctx,"→ 46 learners",440,612,{w:800,size:40,color:rgba(TRUST,1)}),{from:0.9});
    [["40 student system",0],["42 learning platform",1],["8 short courses",2]].forEach(([s,k],i)=>T(ctx,s,80+i*230,690,{w:600,size:19,color:rgba(SRC3[k][1],1)}));});
  const yh=sm_fileH(SM_YML,900,{size:18,lh:29,wrap:true});
  arrive(ctx,1410,280,t,cOw-0.1,()=>{sm_file(ctx,960,150,900,"model/conceptual.yml",SM_YML,{size:18,lh:29,wrap:true,edge:BPL,p:clamp((t-cOw)/2.0,0,1)});tag(ctx,960,112,"in words: the model",BPL,{size:18});},{dy:30});
  arrive(ctx,1100,150+yh+34,t,w("owned","in code"),()=>tag(ctx,960,150+yh+34,"in code: two models",LAYER4[1][1],{size:18}),{from:0.85});
  const mA=w("owned","May")-0.4;arrive(ctx,1080,700,t,mA,()=>{person(ctx,"mei",1080,840,0.46,{pose:"explain",t});},{dy:20,from:0.95});
  arrive(ctx,1400,690,t,w("owned","approved"),()=>{kt_gtick(ctx,1210,700,20,1);T(ctx,"approved 6 Oct 2026",1244,708,{w:700,size:22,color:rgba(TRUST,1)});T(ctx,"Mei Tanaka, registrar's office",1210,752,{w:600,size:19,color:rgba(SOFT,1)});},{from:0.85});
  ctx.restore();vign(ctx,S);});

/* ---------- 6. Keep them apart ---------- */
const SM_TESTS=["unique_int_learner_keys_qualified_key","unique_int_learners_learner_key","unique_int_learners_learner_bk","not_null_int_learners_key_set","unique_mart_wallet__learners_learner_key","keys_decided_different_stay_apart"];
const SM_DEC=["decision_id,qualified_key,decision,other_qualified_key,decided_by,decided_on,…","D-003,LMS|u-88231,different,SIS|S-20417,\"Mei Tanaka, registrar's office\",2026-10-07,…"];
const SM_AJ=["kept_apart as (","","    select","        qualified_key,","        other_qualified_key as learner_bk","    from decisions","    where decision = 'different'","",")","…","from candidates","left join kept_apart","    on kept_apart.qualified_key = candidates.qualified_key","    and kept_apart.learner_bk = candidates.learner_bk","where kept_apart.qualified_key is null"];
const SM_TT=["-- When a person decides two keys are different people, they never end up as one learner.","-- Fails with one row per decision that the matching broke."];
// Aisha's learner: a circle with her key, and her three keys as dots on its edge
function sm_learner(ctx,x,y,r,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glow(ctx,x,y,r*1.4,KIND,0.12+0.2*(o.hi||0));ctx.fillStyle="rgba(7,12,24,0.95)";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ring(ctx,x,y,r,mix(SOFT,KIND,0.7),1,2.6);
  const ta=o.text==null?1:o.text;withA(ctx,ta,()=>{T(ctx,"Aisha",x,y-14,{w:800,size:28,align:"center",color:rgba(KIND,1)});T(ctx,"SIS|S-20417",x,y+24,{f:"mono",w:500,size:20,align:"center",color:rgba(SRC3[0][1],1)});
    [-2.3,-0.85,0.6].forEach((an,i)=>{ctx.fillStyle=rgba(SRC3[i][1],1);ctx.beginPath();ctx.arc(x+Math.cos(an)*r,y+Math.sin(an)*r,8,0,TAU);ctx.fill();});});});}
scene("apart",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.03});
  const cM=c("merge"),cD=c("decide"),cU=c("undo"),un=w("undo","merge undoes"),dd=w("undo","decision is data"),ck=w("undo","code keeps"),tf=w("undo","test fails");
  // Aisha's circle, carried from the pull back, grows to its place
  const g=ease(fin(t,0,1.3));sm_learner(ctx,lerp(463,370,g),lerp(170,290,g),lerp(21,120,g),{text:fin(t,0.9,0.5),hi:pulseAt(t,un,1.4)});
  // the other Aisha: her account holds our Aisha's student ID
  const oA=1-fin(t,dd-0.2,0.6);
  withA(ctx,oA,()=>{arrive(ctx,960,300,t,0.6,()=>{sm_bust(ctx,960,400,220,SRC3[1][1],{dash:[8,6],p:fin(t,0.6,1.4)});T(ctx,"another Aisha",960,158,{w:700,size:22,align:"center",color:rgba(SRC3[1][1],1)});},{dy:20});
    arrive(ctx,960,450,t,w("other","platform account"),()=>sm_key(ctx,960,450,"LMS|u-88231",SRC3[1][1],{align:"center",size:20}),{from:0.85});
    arrive(ctx,960,505,t,w("other","student ID field"),()=>{T(ctx,"student ID:",930,512,{w:600,size:20,align:"right",color:rgba(SOFT,1)});sm_key(ctx,944,505,"S-20417",EDGE_,{size:20,hi:pulseAt(t,w("other","our Aisha"),1.2)});},{from:0.85});
    arrive(ctx,960,560,t,w("other","typed by mistake"),()=>tag(ctx,960,560,"typed by mistake",EDGE_,{align:"center",size:18}),{from:0.8});});
  // rule 3 lights and pulls her account into our Aisha's circle; the wallet takes a sixth credential
  const r3=fin(t,cM-0.1,0.4)*(1-fin(t,cD,0.6)),pull=fin(t,w("merge","merge them"),1.0)*(1-fin(t,un,0.25));
  arrive(ctx,880,670,t,cM-0.1,()=>withA(ctx,1-fin(t,cD,0.6),()=>sm_rule(ctx,620,640,520,3,"student ID held by the platform",{on:r3})),{from:0.9});
  if(pull>0){ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(SM_AMBER,0.9*pull*oA);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(870,450);const p=fin(t,w("merge","merge them"),1.0);ctx.lineTo(lerp(870,488,p),lerp(450,330,p));ctx.stroke();ctx.restore();
    withA(ctx,pull*oA,()=>tag(ctx,700,360,"merged",SM_AMBER,{align:"center",size:18}));}
  const x6=fin(t,w("merge","six"),0.8)*(1-fin(t,un+0.3,0.8));
  arrive(ctx,320,605,t,0.9,()=>sm_wallet(ctx,60,500,520,{x6}),{dy:24});
  withA(ctx,fin(t,w("merge","never earned"),0.5)*(1-fin(t,un+0.3,0.6)),()=>T(ctx,"one she never earned",320,752,{w:700,size:22,align:"center",color:rgba(SM_AMBER,1)}));
  // every test stays green, tick after tick
  const tA=1-fin(t,dd-0.2,0.6),tt0=w("merge","every test");
  arrive(ctx,1610,300,t,w("merge","And every")-0.4,()=>sm_tests(ctx,1310,110,530,SM_TESTS,SM_TESTS.map((_,i)=>fin(t,tt0+i*0.25,0.3)),{a:tA}),{dy:24});
  withA(ctx,tA,()=>{arrive(ctx,1575,484,t,tt0+1.6,()=>tag(ctx,1575,484,"every test: green",GOOD,{align:"center",size:20}),{from:0.85});
    withA(ctx,1-fin(t,cD-0.9,0.4),()=>arrive(ctx,1575,560,t,w("nobody","No test"),()=>T(ctx,"no test knew they were two people",1575,568,{w:600,size:21,align:"center",color:rgba(SOFT,1)}),{dy:10}));});
  // Mei records a decision: different people; her stamp lands on it
  const mA=cD-0.2,dk=ease(fin(t,dd,1.2));
  withA(ctx,oA,()=>arrive(ctx,1740,700,t,mA,()=>{person(ctx,"mei",1740,840,0.44,{pose:"explain",t});T(ctx,"Mei Tanaka",1740,556,{w:800,size:22,align:"center"});T(ctx,"registrar's office",1740,580,{w:600,size:17,align:"center",color:rgba(SOFT,1)});},{dy:20,from:0.95}));
  const dy_=lerp(600,90,dk);
  arrive(ctx,1090,dy_+67,t,w("decide","records"),()=>{sm_file(ctx,600,dy_,980,"seeds/learner_identity_decisions.csv",SM_DEC,{size:18,lh:30,wrap:true,edge:TRUST,p:clamp((t-w("decide","records"))/1.2,0,1),lit:{1:fin(t,w("decide","different people"),0.5)}});
    kt_rstamp(ctx,1440,dy_+166,"decided · Mei",TRUST,fin(t,w("decide","A person"),0.2)*(1-fin(t,dd-0.3,0.3)),fin(t,w("decide","A person"),0.35),{size:22,rot:-0.06});},{dy:24});
  withA(ctx,fin(t,w("decide","beats"),0.5)*(1-fin(t,dd-0.2,0.5)),()=>T(ctx,"a decision beats every rule",1000,812,{w:700,size:26,align:"center",color:rgba(TRUST,1)}));
  arrive(ctx,1700,157,t,dd+0.6,()=>tag(ctx,1600,157,"the decision is data",TRUST,{size:18}),{from:0.85});
  // the code keeps them apart, and a test holds the decision
  arrive(ctx,920,520,t,ck-0.3,()=>sm_file(ctx,600,268,690,"models/intermediate/int_learner_key_candidates.sql",SM_AJ,{size:18,lh:28,edge:LAYER4[1][1],label:null,p:clamp((t-ck)/1.6,0,1),lit:{0:fin(t,ck+1.6,0.5),11:fin(t,ck+1.8,0.5),14:fin(t,ck+2.0,0.5)},litCol:LAYER4[1][1]}),{dy:30});
  withA(ctx,fin(t,ck-0.3,0.5),()=>T(ctx,SM_RUNS,1290-18,268+sm_fileH(SM_AJ,690,{size:18,lh:28})+30,{w:600,size:18,align:"right",color:rgba(SOFT,0.9)}));
  arrive(ctx,1575,360,t,tf-0.3,()=>sm_file(ctx,1310,268,530,"tests/keys_decided_different_stay_apart.sql",SM_TT,{size:18,lh:29,wrap:true,edge:EDGE_,label:null}),{dy:30});
  withA(ctx,fin(t,tf-0.3,0.5),()=>T(ctx,SM_RUNS,1822,268+sm_fileH(SM_TT,530,{size:18,lh:29,wrap:true})+30,{w:600,size:18,align:"right",color:rgba(SOFT,0.9)}));
  arrive(ctx,1575,575,t,ck+0.2,()=>tag(ctx,1575,575,"the code keeps them apart",LAYER4[1][1],{align:"center",size:20}),{from:0.85});
  arrive(ctx,1575,635,t,w("undo","fails"),()=>tag(ctx,1575,635,"a test fails if they merge",EDGE_,{align:"center",size:20}),{from:0.85});
  ctx.restore();vign(ctx,S);});

/* ---------- 7. The same hash everywhere ---------- */
const SM_KC=["    The string that gets hashed. Each part is trimmed and upper-cased, so keys that differ only","    by case or spaces hash the same; a blank part counts as missing. A missing part becomes the","    sentinel '<null>', so ('a', null) and (null, 'a') differ; the sentinel is lower case, so no","    upper-cased part can equal it. Parts are joined with '|'. When every part is missing, the","    string is null, and so is the hash: no key, no hash."];
const SM_EN=["{% macro duckdb__hash_key(columns) -%}","    sha256({{ credentials.key_string(columns) }})","{%- endmacro %}","","{% macro databricks__hash_key(columns) -%}","    sha2({{ credentials.key_string(columns) }}, 256)","{%- endmacro %}"];
scene("hash",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.03});
  const h0=w("one","hashes"),sp=w("space","trailing space"),cMc=c("macro"),heal=w("macro","joins")+0.4,cE=c("every"),cBs=c("beside");
  // the key, carried from Aisha's circle, and its hash rolling out; the band rises when the macro arrives
  const up=lerp(240,-40,ease(fin(t,cMc-0.7,1.3))),m=ease(fin(t,0,1.3)),kx=lerp(370-66-14,100,m),ky=lerp(314,200+up,m),dot=fin(t,sp,0.3),healed=t>heal;
  const inM=t>cMc-0.2,trd=inM?fin(t,w("macro","trims"),0.6):0,upd=t>w("macro","upper case");
  sm_key(ctx,kx,ky,dot<0.5?"SIS|S-20417":!inM?"SIS|S-20417·":upd?"SIS|S-20417":trd>=1?"sis|s-20417":"sis|s-20417·",SRC3[0][1],{size:26,dots:1-trd,hi:Math.max(pulseAt(t,sp,1.0),pulseAt(t,w("macro","upper case"),1.0))});
  const red=dot>0.5&&!healed,hcol=red?BAD:healed?GOOD:INK;
  ctx.save();ctx.translate(0,up);arrowTo(ctx,350,200,420,200,SOFT,fin(t,h0,0.4),{p:fin(t,h0,0.5),head:12});
  arrive(ctx,715,200,t,h0,()=>{glass(ctx,430,136,570,128,14,hcol,{glow:12+10*pulseAt(t,red?sp:heal,1.2),ea:0.7,fill:"rgba(6,10,20,0.95)"});
    const t0=healed?heal:red?sp:h0;sm_hex(ctx,450,190,healed||!red?SM_H0:SM_H1,t,t0,{col:hcol});},{from:0.92});
  arrive(ctx,1030,176,t,w("space","Sixty-four"),()=>tag(ctx,1030,176,"64 hex characters · sha-256",INK,{size:18}),{from:0.85});
  withA(ctx,fin(t,sp,0.4)*(1-fin(t,heal,0.4)),()=>{tag(ctx,1030,228,"one trailing space",SM_AMBER,{size:18});tag(ctx,1236,228,"a different hash",BAD,{size:18});});
  withA(ctx,fin(t,heal,0.4),()=>tag(ctx,1030,228,"the same hash again",GOOD,{size:18}));ctx.restore();
  // the macro arrives: the key goes through it as typed, loses its space, takes upper case, and the hash heals
  const mA=fin(t,cMc-0.2,0.6),tr=w("macro","trims"),uc=w("macro","upper case"),mk=w("macro","marks a missing"),jn=w("macro","joins");
  arrive(ctx,960,362,t,cMc-0.2,()=>sm_file(ctx,100,250,1720,"macros/keys.sql",SM_KC,{size:19,lh:30,edge:[200,170,255],p:clamp((t-cMc)/1.4,0,1),
    lit:{0:fin(t,tr,0.4)*(1-fin(t,cE-0.4,0.5)),1:fin(t,mk,0.4)*(1-fin(t,cE-0.4,0.5)),2:fin(t,mk,0.4)*(1-fin(t,cE-0.4,0.5)),3:fin(t,jn,0.4)*(1-fin(t,cE-0.4,0.5))},litCol:[200,170,255]}),{dy:30});
  [["trim",tr,100],["upper case",uc,210],["<null> for a missing part",mk,370],["joined with ",jn,650]].forEach(([s,t0,x],i)=>arrive(ctx,x+60,512,t,t0,()=>i<3?tag(ctx,x,512,s,[200,170,255],{size:20}):sm_tagBar(ctx,x,512,s,"|",[200,170,255],20),{from:0.85}));
  // the two engines, side by side: both give the same hash
  const eA=fin(t,cE-0.3,0.6);arrive(ctx,550,680,t,cE-0.3,()=>sm_file(ctx,100,556,900,"macros/keys.sql",SM_EN,{size:19,lh:29,edge:LAYER4[2][1],lit:{1:fin(t,w("every","every engine")-0.2,0.4),5:fin(t,w("every","every engine")+0.2,0.4)}}),{dy:30});
  const gA=1-fin(t,cBs-0.9,0.4);withA(ctx,gA,()=>{
    arrive(ctx,1300,600,t,w("every","every engine")-0.2,()=>{T(ctx,"DuckDB  sha256",1060,608,{f:"mono",w:500,size:20,color:rgba(SOFT,1)});T(ctx,"→ 0905e6e2…",1450,608,{f:"mono",w:500,size:20,color:rgba(GOOD,1)});},{from:0.9});
    arrive(ctx,1300,660,t,w("every","every engine")+0.2,()=>{T(ctx,"Databricks  sha2(…, 256)",1060,668,{f:"mono",w:500,size:20,color:rgba(SOFT,1)});T(ctx,"→ 0905e6e2…",1450,668,{f:"mono",w:500,size:20,color:rgba(GOOD,1)});},{from:0.9});
    arrive(ctx,1300,730,t,w("every","same hash"),()=>tag(ctx,1060,730,"one macro · the same hash, every model, every engine",GOOD,{size:20}),{from:0.85});});
  // the readable key stays beside the hash
  arrive(ctx,1300,630,t,cBs-0.2,()=>{T(ctx,"core_learner",1060,576,{f:"mono",w:500,size:18,color:rgba(SOFT,0.95)});sm_rows(ctx,1060,594,["learner_bk","learner_key"],[["SIS|S-20417","0905e6e2…f76a2"]],{size:22,lh:40,col:TRUST,cellCol:(i,j)=>j===0?SRC3[0][1]:INK});},{dy:24});
  arrive(ctx,1300,730,t,w("beside","readable key"),()=>tag(ctx,1060,730,"the readable key stays beside the hash",TRUST,{size:20}),{from:0.85});
  arrive(ctx,1300,790,t,w("beside","can't be read"),()=>T(ctx,"a hash can't be read, or checked by eye",1060,798,{w:600,size:20,color:rgba(SOFT,1)}),{dy:10});
  ctx.restore();vign(ctx,S);});

/* ---------- 8. Codes, too ---------- */
const SM_SM=["key_set,source_code,source_label,canonical_status","SIS,ENR,Enrolled,studying","SIS,LOA,Leave of absence,inactive","SIS,WD,Withdrawn,withdrawn","SIS,CMP,Completed,completed","LMS,active,Active account,studying","LMS,inactive,Inactive account,inactive","SC,1,Active customer,studying","SC,0,Inactive customer,inactive"];
const SM_SY=["      meta: {owner: \"Mei Tanaka, registrar's office\", domain: registrar}"];
// Aisha's one key, as a row: learner_bk beside learner_key (carried from the last chapter)
function sm_keyRow(ctx,x,y,s,a){ctx.save();ctx.translate(x,y);ctx.scale(s,s);sm_rows(ctx,0,0,["learner_bk","learner_key"],[["SIS|S-20417","0905e6e2…f76a2"]],{a,size:22,lh:40,col:TRUST,cellCol:(i,j)=>j===0?SRC3[0][1]:INK});ctx.restore();}
scene("codes",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.03});
  const cN=c("next"),out=1-fin(t,cN-0.3,0.7),fold=ease(fin(t,w("codes","one meaning")-0.1,1.0));
  // three codes in their colours fold into one meaning
  withA(ctx,out,()=>{arrive(ctx,380,110,t,0.4,()=>tag(ctx,380,110,"codes, too",WEED,{align:"center",size:22}),{from:0.85});
    [["ENR",0],["active",1],["1",2]].forEach(([s,k],i)=>{const t0=w("codes","same care")+i*0.4,y0=220+i*110,x=lerp(140,560,fold),y=lerp(y0,330,fold);
      withA(ctx,1-fin(fold,0.8,0.2),()=>arrive(ctx,x+60,y,t,t0,()=>{sm_key(ctx,x,y,s,SRC3[k][1],{size:26});T(ctx,SRC3[k][0],x,y+52,{w:600,size:18,color:rgba(SRC3[k][1],0.9*(1-fold))});},{dy:24,from:0.8}));});
    arrive(ctx,620,330,t,w("codes","studying")-0.1,()=>{glass(ctx,480,290,280,80,40,GOOD,{glow:18,ea:0.9,fill:"rgba(7,12,24,0.95)"});T(ctx,"studying",620,342,{w:800,size:32,align:"center",color:rgba(GOOD,1)});},{from:0.7});
    // the status map, one row per code; the registrar's office owns it
    const cM=c("map");arrive(ctx,1340,300,t,cM-0.3,()=>sm_file(ctx,880,130,920,"seeds/status_map.csv",SM_SM,{size:19,lh:30,edge:TRUST,p:clamp((t-cM+0.1)/1.6,0,1),
      lit:{1:fin(t,w("map","one row"),0.4),5:fin(t,w("map","one row")+0.2,0.4),7:fin(t,w("map","one row")+0.4,0.4)},litCol:GOOD}),{dy:30});
    arrive(ctx,1340,540,t,w("map","status map"),()=>tag(ctx,880,92,"status map · one row per code",TRUST,{size:20}),{from:0.85});
    const oT=w("map","registrar's");arrive(ctx,1340,640,t,oT-0.2,()=>sm_file(ctx,880,560,920,"seeds/_seeds.yml",SM_SY,{size:19,lh:30,edge:TRUST}),{dy:24});
    arrive(ctx,1100,720,t,w("map","approves"),()=>{kt_gtick(ctx,900,722,18,1);T(ctx,"owner: registrar's office · approves every change",930,730,{w:700,size:22,color:rgba(TRUST,1)});},{from:0.85});});
  // the key from the last chapter waits below, then takes the centre: one key, many rows behind it, and a clock
  const mv=ease(fin(t,cN-0.3,1.4)),rx=lerp(lerp(1060,140,ease(fin(t,0,1.4))),700,mv),ry=lerp(lerp(594,700,ease(fin(t,0,1.4))),470,mv),rs=lerp(1,1.2,mv);
  const nR=w("next","many rows"),nV=w("next","many versions");
  for(let k=4;k>=1;k--){const q=fin(t,nR+k*0.18-0.18,0.5);if(q<=0)continue;withA(ctx,q*(0.75-k*0.12),()=>glass(ctx,rx+k*22,ry-k*22,410*rs,102*rs,12,TRUST,{glow:6,ea:0.4,fill:"rgba(6,10,20,0.9)"}));}
  sm_keyRow(ctx,rx,ry,rs,1);
  arrive(ctx,900,420,t,w("next","one key"),()=>tag(ctx,700,420,"one key",TRUST,{size:20}),{from:0.85});
  arrive(ctx,900,640,t,nR,()=>tag(ctx,700,640,"many rows?",SOFT,{size:20}),{from:0.85});
  const ck=fin(t,nV,0.8);if(ck>0){const cx=1580,cy=470,r=120;withA(ctx,ck*0.6,()=>{ring(ctx,cx,cy,r,SOFT,0.8,2);for(let k=0;k<12;k++){const an=k/12*TAU;ctx.strokeStyle=rgba(SOFT,0.6);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx+Math.cos(an)*r*0.85,cy+Math.sin(an)*r*0.85);ctx.lineTo(cx+Math.cos(an)*r*0.95,cy+Math.sin(an)*r*0.95);ctx.stroke();}
    const ha=t*0.05,ma=t*0.6;ctx.lineCap="round";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.sin(ha)*r*0.5,cy-Math.cos(ha)*r*0.5);ctx.stroke();ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.sin(ma)*r*0.78,cy-Math.cos(ma)*r*0.78);ctx.stroke();});
    arrive(ctx,1580,640,t,nV,()=>tag(ctx,1580,640,"many versions?",SOFT,{align:"center",size:20}),{from:0.85});}
  ctx.restore();dark(ctx,S,fin(t,B+0.3,0.9));weedsEnd(ctx,S,t,B,"What makes it the same one",WEED,"Looking alike isn't being the same. Write down what is.");
  fadeIn(ctx,S,t,0.01);vign(ctx,S);});
