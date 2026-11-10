/* ===== The draft and the decision: the university, 2027 =====
   The film's own pictures for Ivy's Wednesday with the team's agent (prefix dd_). The module's kit draws the rooms, the people, the
   sheets and the things in them, and is never changed for this film; what is here is this film's alone:
     ddMorning, ddGraham, ddLate             the team's room on an April morning, Graham's office on a grey day, the room late in the day
     dd_agent(ctx, x, y, r, o)               the team's agent: the agent films' ceramic sphere with its violet band, and its light on the wall
     dd_draft(ctx, x, y, w, o)               the agent's draft of the model, on a sheet with a violet band and dbt's mark (o.v 2: the second)
     dd_notes(ctx, x, y, w, o)               the agent's notes, what it assumed, one line ringed in amber when Ivy reads it (o.hi)
     dd_tests(ctx, x, y, w, o)               the draft's four tests, each ticked: they check the data's form
     dd_hours(ctx, x, y, o)                  a hundred booked hours, as the sensors saw them: people counted in 79, nobody in 21
     dd_week(ctx, x, y, o)                   one room's week, worked out by hand: its booked hours, those nobody came to, and the draft's
                                             answer for each, ticked
     dd_glossary(ctx, x, y, w, h, o)         the glossary's entry for room use, in the catalog, with its owner
     dd_ask(ctx, o)                          the three things Ivy gives the agent: the decision, the words, what counts
     dd_pr(ctx, x, y, w, h, o)               Ivy's pull request, in GitHub, with GitHub's mark: what changed, why, how she checked, and
                                             Jun's review
   Colour keeps the module's meaning: violet only the agent and what it wrote; blue the question, the glossary's word and what Ivy gives
   the agent; orange the data; green what's done or approved; amber the line the agent assumed and the hours nobody came to. */

/* ---------------------------------------------------------------- the places */
AG_PLACES.ddMorning=c=>lp_paintRoom(c,{light:"morning",seed:5});
AG_PLACES.ddGraham=c=>lp_paintRoom(c,{light:"grey",seed:7});
AG_PLACES.ddLate=c=>lp_paintRoom(c,{light:"late",seed:8});

/* ---------------------------------------------------------------- the agent */
function dd_agent(ctx,x,y,r,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  ag_modelLight(ctx,x,y,r,0.8,o.floor);ag_model(ctx,x,y,r,{t:o.t||0,core:o.core==null?0.6:o.core,think:o.think||0,label:o.label});ctx.restore();}

/* ---------------------------------------------------------------- where each line of a sheet sits: lp_textSheet's layout, so a ring or a tick
   can go beside a line. Returns the baselines of each line's first and last row. */
function dd_lineYs(ctx,y,w,words){const inner=w-LP_PAD*2;let yy=y+LP_PAD+30;if(words.kick)yy+=44;
  const tl=words.title?lp_wrap(ctx,words.title,inner,{w:800,size:40}):[];yy+=tl.length*50;
  const sl=words.sub?lp_wrap(ctx,words.sub,inner,{w:600,size:28}):[];yy+=sl.length*38;if(tl.length&&(sl.length||(words.lines||[]).length))yy+=10;
  return (words.lines||[]).map(l=>{const n=lp_wrap(ctx,l,inner-34,{w:600,size:28}).length,first=yy+38;yy+=n*38+12;return{first,last:first+(n-1)*38};});}
// a sheet that springs in: everything drawn by f inside the same spring as the sheet
function dd_spring(ctx,x,y,w,h,o,f){const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));f();ctx.restore();}
// a small green tick in a disc
function dd_tickAt(ctx,x,y,r,a){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ctx.fillStyle=rgba(LP.green,1);ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();lp_icon(ctx,"tick",x,y,r*1.3,[255,255,255]);ctx.restore();}

/* ---------------------------------------------------------------- the agent's draft: a dbt model, its sheet violet as only the agent's work is */
function dd_draftWords(v){return v===2?{kick:"Draft · dbt model",title:"Room use, booked and used",lines:["Room use, as the glossary defines it","Booked and used, side by side"]}
  :{kick:"Draft · dbt model",title:"Room use, by room and hour",lines:["Every column described","Four tests, all passing"]};}
function dd_draft(ctx,x,y,w,o){o=o||{};const words=dd_draftWords(o.v),q=Object.assign({col:LP.violet},o,{a:1,k:null}),b=lp_textSheet(ctx,x,y,w,words,Object.assign({},q,{measure:true}));
  dd_spring(ctx,x,y,w,b.h,o,()=>{lp_textSheet(ctx,x,y,w,words,q);ctx.save();ctx.globalAlpha*=0.92;logo(ctx,"dbt",x+w-36-64,y+44,30);ctx.restore();
    if(o.tick!=null){const L=dd_lineYs(ctx,y,w,words);dd_tickAt(ctx,x+w-56,L[L.length-1].first-10,18,o.tick);}});
  return b;}
// the agent's notes, what it assumed: o.lines, o.hi (0 to 1: the line o.hiLine ringed in amber), o.u (the lines come in)
const DD_NOTES1=["Teaching hours: 8:00 to 18:00, Monday to Friday","Rooms: named as in the timetable","A booked hour is a used hour"];
const DD_NOTES2=["Used: at least one person counted, as in the glossary","Teaching hours: 8:00 to 18:00, Monday to Friday","Booked and used: kept apart"];
function dd_notes(ctx,x,y,w,o){o=o||{};const words={kick:o.kick||"What I assumed",lines:o.lines||DD_NOTES1},q=Object.assign({col:LP.violet},o,{a:1,k:null}),b=lp_textSheet(ctx,x,y,w,words,Object.assign({},q,{measure:true}));
  dd_spring(ctx,x,y,w,b.h,o,()=>{lp_textSheet(ctx,x,y,w,words,q);const hi=o.hi||0;if(hi>0.004){const L=dd_lineYs(ctx,y,w,words)[o.hiLine==null?2:o.hiLine];
      ctx.save();ctx.globalAlpha*=hi;ctx.fillStyle=rgba(LP.amber,0.12);rr(ctx,x+18,L.first-34,w-36,L.last-L.first+50,10);ctx.fill();ctx.strokeStyle=rgba(LP.amber,1);ctx.lineWidth=4;
      rr(ctx,x+18,L.first-34,w-36,L.last-L.first+50,10);ctx.stroke();ctx.restore();}});
  return b;}
// the draft's tests: each ticked in turn (o.ticks 0 to 1)
const DD_TESTS=["Every room has a name","No room counted twice","No hour left out","Use between 0% and 100%"];
function dd_tests(ctx,x,y,w,o){o=o||{};const words={kick:"The draft's tests",lines:DD_TESTS},q=Object.assign({},o,{a:1,k:null}),b=lp_textSheet(ctx,x,y,w,words,Object.assign({},q,{measure:true}));
  dd_spring(ctx,x,y,w,b.h,o,()=>{lp_textSheet(ctx,x,y,w,words,q);const L=dd_lineYs(ctx,y,w,words),tk=o.ticks==null?1:o.ticks;
    L.forEach((l,i)=>dd_tickAt(ctx,x+w-52,l.first-10,17,ag_in(tk,i/4,0.25)));});
  return b;}

/* ---------------------------------------------------------------- a hundred booked hours, as the sensors saw them
   Squares in rows of 20: orange where the sensors counted people, an amber outline where they counted nobody (21 of the 100: one in
   five, as across the semester). o.u (0 to 1: the squares come in), o.seen (0 to 1: the sensors' counts come in, left to right),
   o.draft (0 to 1: the draft's answer laid over them: every hour used, the empty ones too), o.light, o.a, o.k */
const DD_EMPTY=(()=>{const R=ag_rnd(2105),s=new Set();while(s.size<21)s.add((R()*100)|0);return s;})();
function dd_hours(ctx,x,y,o){o=o||{};const sq=38,gp=9,w=20*(sq+gp)-gp+72,h=5*(sq+gp)-gp+290;
  dd_spring(ctx,x,y,w,h,o,()=>{lp_sheet(ctx,x,y,w,h,{col:LP.orange,light:o.light==null?null:o.light,pin:false});
    lp_T(ctx,"100 BOOKED HOURS · AS THE SENSORS SAW THEM",x+36,y+64,{w:800,size:28,ls:3,col:LP.orange});
    const u=o.u==null?1:o.u,seen=o.seen||0,dr=o.draft||0;
    for(let i=0;i<100;i++){const c=i%20,r=(i/20)|0,bx=x+36+c*(sq+gp),by=y+100+r*(sq+gp),ia=ag_in(u,c/24,0.2);if(ia<=0.004)continue;const sn=ag_in(seen,c/24,0.2),empty=DD_EMPTY.has(i);
      ctx.save();ctx.globalAlpha*=ia;
      if(empty&&sn>0){ctx.fillStyle=rgba(LP.paper,1);ctx.fillRect(bx,by,sq,sq);ctx.strokeStyle=rgba(LP.amber,sn);ctx.lineWidth=5;ctx.strokeRect(bx+2.5,by+2.5,sq-5,sq-5);
        ctx.globalAlpha*=1-sn;ctx.fillStyle=rgba(mix(LP.orange,LP.paper,0.55),1);ctx.fillRect(bx,by,sq,sq);}
      else{ctx.fillStyle=rgba(sn>0?mix(mix(LP.orange,LP.paper,0.55),LP.orange,sn):mix(LP.orange,LP.paper,0.55),1);ctx.fillRect(bx,by,sq,sq);}
      if(dr>0.004){ctx.globalAlpha=ia*dr;ctx.strokeStyle=rgba(LP.violet,1);ctx.lineWidth=3;ctx.strokeRect(bx-3,by-3,sq+6,sq+6);}
      ctx.restore();}
    const ly=y+100+5*(sq+gp)+30,la=ag_in(seen,0.7,0.3);
    if(la>0.004){ctx.save();ctx.globalAlpha*=la;ctx.fillStyle=rgba(LP.orange,1);ctx.fillRect(x+36,ly,30,30);lp_T(ctx,"People counted: 79",x+80,ly+26,{w:700,size:30});
      ctx.strokeStyle=rgba(LP.amber,1);ctx.lineWidth=5;ctx.strokeRect(x+452,ly+2.5,25,25);lp_T(ctx,"Nobody: 21, one in five",x+496,ly+26,{w:700,size:30,col:LP.amber});ctx.restore();}
    if(dr>0.004){ctx.save();ctx.globalAlpha*=dr;ctx.strokeStyle=rgba(LP.violet,1);ctx.lineWidth=3;ctx.strokeRect(x+36,ly+59,30,30);lp_T(ctx,"The draft: all used",x+80,ly+86,{w:700,size:30,col:LP.violet});ctx.restore();}});
  return{w,h};}

/* ---------------------------------------------------------------- one room's week, worked out by hand
   Room 1.02, one week: the days down the side, the hours across (8:00 to 17:00, each for an hour); booked hours filled orange where
   people were counted, an amber outline where nobody came; o.u (the hours come in), o.marks (0 to 1: Ivy's hand marks, row by row),
   o.ticks (0 to 1: the draft's answer for each day, ticked, matching), o.light, o.a, o.k */
const DD_WEEK=["00001110000","00111111100","00011111111","01011111100","01100001000"].map(r=>r.slice(0,10));
const DD_WEEK_EMPTY=new Set(["0,4","4,1","2,9","3,1"]);
function dd_week(ctx,x,y,o){o=o||{};const sq=66,gp=10,w=150+10*(sq+gp)+80,h=110+5*(sq+gp)+116;
  dd_spring(ctx,x,y,w,h,o,()=>{lp_sheet(ctx,x,y,w,h,{light:o.light==null?null:o.light,pin:false});
    lp_T(ctx,"ROOM 1.02 · ONE WEEK · BY HAND",x+36,y+64,{w:800,size:28,ls:3,col:LP.mut});
    for(const [c,s] of [[0,"8:00"],[5,"13:00"],[9,"17:00"]])lp_T(ctx,s,x+150+c*(sq+gp)+sq/2,y+108,{w:600,size:28,align:"center",col:LP.mut});
    const u=o.u==null?1:o.u,mk=o.marks||0,tk=o.ticks||0;
    ["Mon","Tue","Wed","Thu","Fri"].forEach((d,r)=>{const ry=y+130+r*(sq+gp);lp_T(ctx,d,x+36,ry+sq/2+10,{w:700,size:30});
      for(let c=0;c<10;c++){const bx=x+150+c*(sq+gp),ia=ag_in(u,(r*10+c)/60,0.15);if(ia<=0.004)continue;const booked=DD_WEEK[r][c]==="1",empty=DD_WEEK_EMPTY.has(r+","+c),m=ag_in(mk,r/5,0.2);
        ctx.save();ctx.globalAlpha*=ia;ctx.strokeStyle=rgba(LP.mut,0.35);ctx.lineWidth=2;ctx.strokeRect(bx+1,ry+1,sq-2,sq-2);
        if(booked){if(empty&&m>0){ctx.strokeStyle=rgba(LP.amber,m);ctx.lineWidth=5;ctx.strokeRect(bx+2.5,ry+2.5,sq-5,sq-5);}
          else{ctx.fillStyle=rgba(mix(LP.orange,LP.paper,empty?0.55:0.55*(1-m)),1);ctx.fillRect(bx,ry,sq,sq);}}
        ctx.restore();}
      dd_tickAt(ctx,x+150+10*(sq+gp)+36,ry+sq/2,20,ag_in(tk,r/5,0.2));});
    const ly=y+130+5*(sq+gp)+24,la=ag_in(mk,0.15,0.3);
    if(la>0.004){ctx.save();ctx.globalAlpha*=la;ctx.fillStyle=rgba(LP.orange,1);ctx.fillRect(x+150,ly,30,30);lp_T(ctx,"People counted",x+194,ly+26,{w:700,size:30});
      ctx.strokeStyle=rgba(LP.amber,1);ctx.lineWidth=5;ctx.strokeRect(x+452,ly+2.5,25,25);lp_T(ctx,"Booked, nobody came",x+496,ly+26,{w:700,size:30,col:LP.amber});ctx.restore();}});
  return{w,h};}

/* ---------------------------------------------------------------- the glossary's entry, in the catalog
   o.u (0 to 1: the definition is written), o.owner (0 to 1: its owner), o.ok (seconds since its owner approved it, 0 before), o.a */
const DD_DEF="The share of a room's teaching hours in which the sensors counted at least one person";
function dd_glossary(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;
  lp_screen(ctx,x,y,w,h,{a,draw:(c,X,Y,Wd,Hd)=>{c.fillStyle=rgba(LP.blue,1);c.fillRect(X,Y,Wd,12);
    lp_T(c,"CATALOG · GLOSSARY",X+44,Y+70,{w:800,size:28,ls:3,col:LP.blue});lp_T(c,"Room use",X+44,Y+140,{w:800,size:48});
    const ls=lp_wrap(c,DD_DEF,Math.min(Wd-88,740),{w:600,size:32}),u=o.u==null?1:o.u;ls.forEach((l,i)=>{const la=clamp(u*ls.length-i,0,1);if(la<=0)return;c.save();c.globalAlpha*=la;lp_T(c,l,X+44,Y+200+i*46,{w:600,size:32});c.restore();});
    const oy=Y+200+ls.length*46+40,oa=o.owner||0;if(oa>0.004){c.save();c.globalAlpha*=oa;lp_T(c,"Owner: Graham Ellis, Facilities",X+44,oy,{w:700,size:30,col:LP.mut});c.restore();}
    if((o.ok||0)>0.004)lp_pill(c,X+44+190,oy+70,"Approved by its owner",{col:LP.green,icon:"tick",a:ag_in(o.ok,0,0.4),k:o.ok});}});}

/* ---------------------------------------------------------------- the three things Ivy gives the agent the second time
   o.ks: three times since each card came in (or null: not yet); o.a; the agent sits below them (the scene draws it) */
const DD_ASK=[{kick:"The decision",lines:["Whether to ask the University Council for a new building"]},{kick:"The words",lines:["Room use, as the glossary defines it"]},
  {kick:"What counts",lines:["Teaching hours, 8:00 to 18:00, Monday to Friday","Booked and used, side by side"]}];
function dd_ask(ctx,o){o=o||{};DD_ASK.forEach((wd,i)=>{const k=o.ks?o.ks[i]:null;if(k==null||k<0)return;lp_textSheet(ctx,120+i*580,140,540,wd,{col:LP.blue,light:o.light,a:ag_in(k,0,0.35)*(o.a==null?1:o.a),k});});}

/* ---------------------------------------------------------------- Ivy's pull request, in GitHub
   o.u (0 to 1: the description's lines come in), o.rev (0 to 1: Jun as reviewer), o.q (0 to 1: his question), o.ans (0 to 1: the answer),
   o.ok (seconds since Jun approved it, 0 before), o.merged (seconds since it was merged), o.a */
const DD_PR_LINES=["Asked for: room use, by room and hour","The agent assumed: booked means used","Changed: used means people counted","Checked: room 1.02, one week, by hand"];
function dd_pr(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;
  lp_screen(ctx,x,y,w,h,{a,draw:(c,X,Y,Wd,Hd)=>{c.fillStyle="rgb(240,238,234)";c.fillRect(X,Y,Wd,76);logo(c,"github",X+36,Y+18,40);lp_T(c,"Pull request",X+92,Y+50,{w:700,size:30});
    lp_T(c,"Room use: booked and used",X+36,Y+134,{w:800,size:38});lp_T(c,"Ivy Reyes wants to merge into main",X+36,Y+178,{w:600,size:28,col:LP.mut});
    const u=o.u==null?1:o.u;DD_PR_LINES.forEach((l,i)=>{const la=clamp(u*4-i,0,1);if(la<=0)return;c.save();c.globalAlpha*=la;c.fillStyle=rgba(LP.mut,1);c.beginPath();c.arc(X+44,Y+236+i*44-10,6,0,TAU);c.fill();
      lp_T(c,l,X+66,Y+236+i*44,{w:600,size:28});c.restore();});
    const ry=Y+236+3*44+34;if((o.rev||0)>0.004){c.save();c.globalAlpha*=o.rev;c.strokeStyle=rgba(LP.mut,0.3);c.lineWidth=2;c.beginPath();c.moveTo(X+36,ry);c.lineTo(X+Wd-36,ry);c.stroke();
      lp_T(c,"Reviewer: Jun Park",X+36,ry+44,{w:700,size:30});c.restore();}
    if((o.q||0)>0.004){c.save();c.globalAlpha*=o.q;c.fillStyle="rgb(244,242,238)";rr(c,X+36,ry+64,Wd-72,54,10);c.fill();lp_T(c,"Jun: Which room did you check by hand?",X+60,ry+101,{w:600,size:28});c.restore();}
    if((o.ans||0)>0.004){c.save();c.globalAlpha*=o.ans;c.fillStyle="rgb(244,242,238)";rr(c,X+36,ry+128,Wd-72,54,10);c.fill();lp_T(c,"Ivy: Room 1.02, one week: in the description",X+60,ry+165,{w:600,size:28});c.restore();}
    if((o.ok||0)>0.004)lp_pill(c,X+Wd-150,Y+124,"Approved",{col:LP.green,icon:"tick",a:ag_in(o.ok,0,0.4),k:o.ok});
    if((o.merged||0)>0.004)lp_pill(c,X+Wd-150,Y+190,"Merged",{col:LP.green,icon:"tick",a:ag_in(o.merged,0,0.4),k:o.merged});}});}
