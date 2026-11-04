/* ===== Skills and workflows: the seven chapters =====
   Each chapter is a few shots, in the places of sw_past.js and the module's lab, cut together with short dissolves (sw_shots); a shot
   that shows the same place or people as the one before comes in on a cut. Times inside a chapter come from its cues and the words of
   its lines (wAt), so the pictures stay with the voice if it's recorded again. Words on screen are on cards, labels and pills, at least
   28 px as seen, and above the captions. */

// made once per chapter, the first time it draws: its cues are known by then
const sw_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// the shared ag_shots, with a dissolve of each shot's own (sh.dis, seconds; 0.5 by default); a shot marked cut comes in on a cut
function sw_shots(ctx,S,t,end,shots){let i=0;for(let k=1;k<shots.length;k++)if(t>=shots[k].at)i=k;
  const dis=i>0?(shots[i].dis||0.5):0.5,u=i>0&&!shots[i].cut?clamp((t-shots[i].at)/dis,0,1):1,till=k=>shots[k+1]?shots[k+1].at:end;
  if(u<1){ag_shot(ctx,S,t,shots[i-1],shots[i].at);const [bc,bx]=ag_buf("cut",ctx.canvas.width,ctx.canvas.height);ag_shot(bx,S,t,shots[i],till(i));
    ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=ease(u);ctx.drawImage(bc,0,0);ctx.restore();setScreen(ctx,S);}
  else ag_shot(ctx,S,t,shots[i],till(i));return i;}
// a card that springs in at t0 and goes at t1 (or stays): its k and a
const sw_pop=(t,t0,t1)=>({k:clamp(ag_spr(t,t0,0.8),0,1.2),a:t1==null?ag_in(t,t0,0.35):ag_io(t,t0,t1,0.35)});
const SW_TITLE="Skills and workflows";
// the film's kicker over the lab's chapters, in the frame's own coordinates
function sw_kick(ctx,S,a,dark){if(a<=0.01)return;setScreen(ctx,S);ag_kicker(ctx,"2.2",SW_TITLE,{a,dark});}
// a value of each shot (f), blended across the dissolve into the shot on screen at t, as sw_shots blends their pictures
function sw_mix(shots,t,f){let i=0;for(let k=1;k<shots.length;k++)if(t>=shots[k].at)i=k;const sh=shots[i];if(i===0||sh.cut)return f(sh);
  return lerp(f(shots[i-1]),f(sh),ease(clamp((t-sh.at)/(sh.dis||0.5),0,1)));}
// a person drawn whole, then laid on the picture at a: a person fading in or out never shows through themselves
function sw_whole(ctx,a,fn){if(a<=0.004)return;if(a>=0.996){fn(ctx);return;}ctx.save();ctx.globalAlpha*=a;fn(ctx);ctx.restore();}

// the shares of the estate in the courtyard's wide shot: where each heir stands, and their card
const SW_HEIRS=[{who:"widow",x:1200,y:705,s:0.8,kick:"Widow",title:"an eighth",sub:"120 dirhams"},
  {who:"son",x:1450,y:690,s:0.84,kick:"Son",title:"two parts",sub:"560 dirhams"},
  {who:"daughter",x:1700,y:712,s:0.8,kick:"Daughter",title:"one part",sub:"280 dirhams"}];
const SW_CARDW=236;
function sw_family(x,tt,o){o=o||{};for(const k of [2,1,0]){const h=SW_HEIRS[k];ag_person(x,SW_FOLK[h.who],h.x,h.y,h.s,{t:tt+k*1.3,flip:true,gaze:o.gaze||[2,0.4]});}}
function sw_reckonerAt(x,tt,who,px,o){o=o||{};sw_table(x,px-290,960,560,120);ag_person(x,SW_FOLK[who],px,730,0.84,{t:tt,flip:!!o.flip,cut:840,gaze:o.gaze||[2,0.6]});
  const R=ag_rnd(px);for(let i=0;i<(o.sheets==null?2:o.sheets);i++)sw_sheet(x,px-250+i*190,872+R()*6,150,86,(R()-0.5)*0.2,(px+i*7)|0);
  if(o.book)sw_codex(x,px+40,870,120,74,[120,72,52],{a:o.book});}

// ---- 1 · Completion and balancing: Baghdad about 820; the sums of every day, the law's shares; each problem on its own, a slip, two
// answers; al-Khwarizmi's book: two moves, six forms, steps, an example, a drawn square; real cases; anyone, the same way; copied, into
// Latin, two words; today's data teams; solve it once ----
scene("book",(ctx,S,t,sc)=>{const c=sc.cues,P=sw_once(sc,"P",()=>({
    sums:["Estates","legacies","fields","lawsuits","trade","land","canals"].map(w=>wAt(sc,"kinds",w)),
    court:c.law-0.5,heir:wAt(sc,"law","each heir"),legacy:wAt(sc,"law","legacy"),outside:wAt(sc,"law","outside"),
    own:c.own-0.4,tricks:wAt(sc,"own","own tricks"),newk:wAt(sc,"own","new kind"),nothing:wAt(sc,"own","nothing"),
    slip:c.slip-0.4,slipW:wAt(sc,"slip","slip"),less:wAt(sc,"slip","less"),
    two:c.two-0.4,tw1:wAt(sc,"two","two reckoners"),tw2:wAt(sc,"two","two answers"),
    study:c.writes-0.6,caliph:c.writes,khw:wAt(sc,"writes","Muhammad"),book:wAt(sc,"writes","short book"),require:wAt(sc,"require","constantly"),
    moves:c.moves-0.5,comp:wAt(sc,"moves","completion"),bal:wAt(sc,"moves","balancing"),six:wAt(sc,"moves","six forms"),
    steps:wAt(sc,"steps","steps"),example:wAt(sc,"steps","example"),drawn:wAt(sc,"steps","drawn square"),
    ex1:c.ex1,halve:wAt(sc,"ex2","Halve"),mult:wAt(sc,"ex2","Multiply"),add:wAt(sc,"ex2","Add"),root:wAt(sc,"ex2","Take its root"),away:wAt(sc,"ex2","Take away"),
    cases:c.cases-0.3,legs:wAt(sc,"cases","legacies"),
    anyone:c.anyone-0.4,never:wAt(sc,"anyone","never seen"),same:wAt(sc,"anyone","same way"),
    latin:c.latin-0.4,copied:wAt(sc,"latin","copied"),lat:wAt(sc,"latin","Latin"),year:wAt(sc,"latin","eleven forty-five"),
    words:c.words-0.3,jabr:wAt(sc,"words","al-jabr"),algebra:wAt(sc,"words","algebra"),name:wAt(sc,"words","his own name"),algo:wAt(sc,"words","algorithm"),
    lab:c.data-0.5,chat1:wAt(sc,"data","one chat"),again:wAt(sc,"data","solved again"),nothingD:wAt(sc,"data","from nothing"),
    once:c.reuse,write:wAt(sc,"reuse","write it down"),every:wAt(sc,"reuse","every agent"),
    title:c.breath+0.2}));
  const shots=[
    // the Tigris in the morning: the round boat crossing, a sail far off; the sums of every day, one by one, over the city
    {at:0,place:"swRiver",keys:[[0,880,540,1.04],[0.1,1040,520,1.08]],d:14,push:0.01,draw:(x,tt)=>{
      sw_sail(x,1560-tt*6,600,0.7,tt);sw_quffa(x,640+tt*9,664,0.9,tt);
      const L=[["Estates shared",330,300],["Legacies",640,226],["Fields divided",960,300],["Lawsuits",1250,214],["Trade",1560,290],["Land measured",820,412],["Canals dug",1180,420]];
      L.forEach(([s,px,py],i)=>{const p=sw_pop(tt,P.sums[i]-0.15,P.court-0.3);if(p.a>0.01){x.save();ag_about(x,px,py,lerp(0.6,1,p.k));ag_pill(x,px,py,s,{a:p.a,size:30});x.restore();}});}},
    // a house's courtyard: a family, a reckoner at his table; the estate, and the law's share for each heir; a legacy can go outside
    {at:P.court,place:"swCourt",dis:0.7,keys:[[P.court,980,540,1.0],[P.court+0.1,1000,530,1.03]],d:6,push:0.01,draw:(x,tt)=>{
      sw_reckonerAt(x,tt,"reckoner",470,{});sw_family(x,tt,{gaze:[2,0.2]});ag_roomLight(x,0.5);
      const e=sw_pop(tt,P.court+0.5,null);ag_textCard(x,640,130,400,{kick:"The estate",title:"960 dirhams"},{k:e.k,a:e.a,kickCol:SW_PAL.tag});
      SW_HEIRS.forEach((h,i)=>{const p=sw_pop(tt,P.heir+0.25*i,null);ag_textCard(x,h.x-SW_CARDW/2,236,SW_CARDW,{kick:h.kick,title:h.title,sub:h.sub},{tail:{side:"bottom",at:0.5,px:h.x,py:h.y-262*h.s},k:p.k,a:p.a,kickCol:SW_PAL.tag});});
      const lg=sw_pop(tt,P.legacy,null);ag_textCard(x,640,400,400,{kick:"A legacy can leave",title:"up to a third",sub:"to someone outside the family"},{k:lg.k,a:lg.a,kickCol:SW_PAL.tag});}},
    // close on the reckoner: each problem on its own sheet, each worked its own way; a new kind, a blank sheet
    {cut:true,at:P.own,place:"swCourt",keys:[[P.own,500,736,1.42],[P.own+0.1,520,740,1.46]],d:5,push:0.01,draw:(x,tt)=>{
      sw_table(x,180,960,560,120);ag_person(x,SW_FOLK.reckoner,470,730,0.84,{t:tt,cut:840,gaze:[2,1.2],nod:0.04});
      [[220,872,-0.12,3],[372,866,0.06,4],[520,874,-0.04,5]].forEach(([sx,sy,r,sd],i)=>sw_sheet(x,sx,sy,140,84,r,sd,{a:ag_in(tt,P.own+0.2+i*0.5,0.4)}));
      const nb=ag_in(tt,P.newk-0.1,0.6);if(nb>0)sw_sheet(x,lerp(820,650,ag_eo(nb)),842,140,84,0.1,9,{blank:true,a:nb});
      const p=sw_pop(tt,P.nothing-0.1,null);x.save();ag_about(x,870,600,lerp(0.6,1,p.k));ag_pill(x,870,600,"a new kind: from nothing",{col:AG.amber,icon:"warn",a:p.a,size:28});x.restore();}},
    // the family again: one slip, and the daughter's share comes out less than the law gives her
    {cut:true,at:P.slip,place:"swCourt",keys:[[P.slip,1300,560,1.12],[P.slip+0.1,1320,560,1.15]],d:5,push:0.01,draw:(x,tt)=>{
      sw_reckonerAt(x,tt,"reckoner",470,{});sw_family(x,tt,{gaze:[2,0.2]});ag_roomLight(x,0.5);
      const sl=ag_in(tt,P.less-0.2,0.5);
      SW_HEIRS.forEach((h,i)=>{const d=i===2;ag_textCard(x,h.x-SW_CARDW/2,236,SW_CARDW,{kick:h.kick,title:h.title,sub:d&&sl>0.5?"240 dirhams":h.sub},{tail:{side:"bottom",at:0.5,px:h.x,py:h.y-262*h.s},edge:d&&sl>0.5?AG.amber:null,kickCol:SW_PAL.tag});});
      const p=sw_pop(tt,P.less+0.1,null);ag_pill(x,1620,188,"less than the law gives her",{col:AG.amber,icon:"warn",a:p.a,size:28});}},
    // two reckoners, one estate, two answers
    {cut:true,at:P.two,place:"swCourt",keys:[[P.two,960,560,1.02],[P.two+0.1,960,550,1.06]],d:6,push:0.01,draw:(x,tt)=>{
      sw_reckonerAt(x,tt,"reckoner",560,{gaze:[3,0.4]});sw_reckonerAt(x,tt+2,"reckoner2",1400,{flip:true,gaze:[3,0.4]});ag_roomLight(x,0.5);
      const p1=sw_pop(tt,P.tw1,null),p2=sw_pop(tt,P.tw1+0.4,null);
      ag_textCard(x,300,190,470,{kick:"One reckoner",title:"Her share: 280 dirhams"},{tail:{side:"bottom",at:0.6,px:580,py:470},k:p1.k,a:p1.a,kickCol:SW_PAL.tag});
      ag_textCard(x,1150,190,470,{kick:"Another reckoner",title:"Her share: 240 dirhams"},{tail:{side:"bottom",at:0.4,px:1380,py:470},k:p2.k,a:p2.a,kickCol:SW_PAL.tag});
      const v=ag_in(tt,P.tw2,0.5);ag_verdict(x,960,560,"two answers for one estate","fail",v);}},
    // the House of Wisdom: al-Khwarizmi, his book in his hand; his name, and what the book is for, in his words
    {at:P.study,place:"swStudy",dis:0.8,keys:[[P.study,900,560,1.0],[P.study+0.1,920,540,1.05]],d:8,push:0.012,draw:(x,tt)=>{
      ag_person(x,SW_FOLK.scholar,700,650,1.0,{t:tt,pose:"hold",gaze:[3,0],holdBack:(c,h)=>sw_codex(c,h.near[0]-34,h.near[1]-112,128,160,[118,70,50])});ag_roomLight(x,0.4);
      const p0=sw_pop(tt,P.caliph+0.1,null);ag_pill(x,1360,150,"Encouraged by the caliph",{a:p0.a,size:28});
      const p1=sw_pop(tt,P.khw-0.1,null);ag_textCard(x,1020,230,700,{kick:"A scholar of the House of Wisdom",title:"Muhammad ibn Musa al-Khwarizmi"},{k:p1.k,a:p1.a,kickCol:SW_PAL.tag});
      const p2=sw_pop(tt,P.require-0.8,null);ag_textCard(x,1020,440,700,{kick:"His short book, in his words",title:"“such as men constantly require”",sub:"in inheritance, legacies, partition, lawsuits and trade"},{k:p2.k,a:p2.a,kickCol:SW_PAL.tag});}},
    // the book open: two moves bring a problem to its form; the six forms
    {at:P.moves,place:"swBook",dis:0.7,keys:[[P.moves,960,520,1.0],[P.moves+0.1,960,510,1.02]],d:6,push:0.01,draw:(x,tt)=>sw_moves(x,tt,P)},
    // one form's steps, an example, and the square drawn on the page as each step is said
    {cut:true,at:P.steps-0.3,place:"swBook",keys:[[P.steps-0.3,960,500,1.0],[P.steps,960,490,1.03]],d:8,push:0.01,draw:(x,tt)=>sw_steps(x,tt,P)},
    // pages of real cases, legacies most of all
    {cut:true,at:P.cases,place:"swBook",keys:[[P.cases,960,500,1.03],[P.cases+0.1,960,500,1.06]],d:4,push:0.01,draw:(x,tt)=>{
      const turn=ag_sine(clamp((tt-P.cases)/1.0,0,1));if(turn<1)sw_pageTurn(x,turn);
      const p=sw_pop(tt,P.legs-0.2,null);ag_textCard(x,560,300,800,{kick:"Legacies",title:"A man dies, leaving two sons, and leaves a third of his capital to a stranger.",sub:"How much does each one get?"},{k:p.k,a:p.a,kickCol:SW_PAL.tag});}},
    // the two reckoners again, each with the book: the same steps, the same answer
    {at:P.anyone,place:"swCourt",dis:0.6,keys:[[P.anyone,960,560,1.02],[P.anyone+0.1,960,550,1.06]],d:6,push:0.01,draw:(x,tt)=>{
      sw_reckonerAt(x,tt,"reckoner",560,{gaze:[3,0.8],book:1,sheets:1});sw_reckonerAt(x,tt+2,"reckoner2",1400,{flip:true,gaze:[3,0.8],book:1,sheets:1});ag_roomLight(x,0.5);
      const p1=sw_pop(tt,P.anyone+0.6,null),p2=sw_pop(tt,P.anyone+1.0,null);
      ag_textCard(x,300,190,470,{kick:"One reckoner",title:"Her share: 280 dirhams"},{tail:{side:"bottom",at:0.6,px:580,py:470},k:p1.k,a:p1.a,edge:AG.green,icon:"tick",kickCol:SW_PAL.tag});
      ag_textCard(x,1150,190,470,{kick:"Another reckoner",title:"Her share: 280 dirhams"},{tail:{side:"bottom",at:0.4,px:1380,py:470},k:p2.k,a:p2.a,edge:AG.green,icon:"tick",kickCol:SW_PAL.tag});
      const v=ag_in(tt,P.same-0.2,0.5);ag_verdict(x,960,560,"the same steps, the same answer","pass",v);}},
    // copied for centuries: copies of the book along the years from about 820; then into Latin, in Segovia in 1145
    {at:P.latin,place:"swWood",dis:0.6,keys:[[P.latin,960,540,1.0],[P.latin+0.1,960,530,1.04]],d:6,push:0.01,draw:(x,tt)=>sw_copies(x,tt,P)},
    // two words: al-jabr, algebra; al-Khwarizmi, algorithm
    {at:P.words,place:"swWood",cut:true,keys:[[P.words,960,540,1.04],[P.words+0.1,960,540,1.07]],d:5,push:0.01,draw:(x,tt)=>{
      const row=(y,a0,a1,kick,from,to)=>{const p=sw_pop(tt,a0,null),q=sw_pop(tt,a1,null);ag_textCard(x,330,y,520,{kick,title:from},{k:p.k,a:p.a,kickCol:SW_PAL.tag});
        if(q.a>0.01){x.save();x.globalAlpha*=q.a;x.strokeStyle="rgba(238,228,208,0.8)";x.lineWidth=4;x.lineCap="round";x.beginPath();x.moveTo(880,y+66);x.lineTo(1036,y+66);x.stroke();ag_arrowHead(x,1052,y+66,0,14,"rgba(238,228,208,0.9)");x.restore();}
        ag_textCard(x,1090,y,500,{kick:"The word",title:to},{k:q.k,a:q.a,kickCol:AG.kick});};
      row(250,P.jabr-0.2,P.algebra-0.1,"His book's first move","al-jabr","algebra");
      row(500,P.name-0.2,P.algo-0.1,"His own name","al-Khwarizmi","algorithm");}},
    // today: a data team's job, solved in one chat, then again in the next, from nothing; then written down once, and every agent reads it
    {at:P.lab,place:"lab",dis:0.8,keys:[[P.lab,960,540,1.0],[P.lab+0.1,960,530,1.03]],d:8,push:0.01,draw:(x,tt)=>sw_reuse(x,tt,P)},
    // the book's square again, settling under the title
    {at:c.breath-0.6,place:"swBook",dis:0.9,keys:[[c.breath-0.6,960,500,1.06],[c.breath-0.5,960,500,1.1]],d:4,push:0.01,draw:(x,tt)=>{
      sw_square(x,760,270,150,{p:1,strips:1,corner:1,side:1,root:1});}}
  ];
  sw_shots(ctx,S,t,sc.dur,shots);const dk=sw_mix(shots,t,sh=>sh.place==="swBook"||sh.place==="swWood"?1:0);
  sw_place(ctx,S,"Baghdad · about 820",ag_io(t,0.5,P.latin-0.2,0.6),dk);
  sw_place(ctx,S,"Today",ag_io(t,P.lab+0.4,c.breath-0.6,0.5),0);
  ag_title(ctx,S,t,P.title,SW_TITLE,null,"AGENTS AT WORK ON DATA · FILM 2 OF 9");});

// the two moves, each on one of the book's own kinds of example, on cards over the open book: completion takes what is subtracted to
// the other side ("a square equals forty roots less four squares": five squares equal forty roots); balancing takes the same from both
// sides ("a square and fourteen roots equal thirty-nine and four roots": a square and ten roots equal thirty-nine); then the six forms,
// and the balanced problem goes to its own, the fourth, whose steps come next
function sw_moves(x,tt,P){const ca=ag_io(tt,P.comp-0.4,P.six-0.55,0.3),ba=ag_io(tt,P.bal-0.3,P.six-0.55,0.3);
  if(ca>0.01){ag_box(x,330,190,1260,200,22,{a:ca});ag_label(x,370,246,"Completion",{col:AG.blue,a:ca});
    const m=ag_in(tt,P.comp+0.5,0.5);
    sw_eq(x,960,320,[["a square",0,1-m],["5 squares",0,m,AG.blue],["40 roots",1,1],["less 4 squares",1,1-m,AG.amber]],{a:ca});}
  if(ba>0.01){ag_box(x,330,430,1260,200,22,{a:ba});ag_label(x,370,486,"Balancing",{col:AG.blue,a:ba});
    const m=ag_in(tt,P.bal+0.6,0.5);
    sw_eq(x,960,560,[["a square",0,1],["14 roots",0,1-m,AG.amber,null,"+"],["10 roots",0,m,AG.blue,null,"+"],["39",1,1],["4 roots",1,1-m,AG.amber,null,"+"]],{a:ba});}
  const fa=ag_in(tt,P.six-0.25,0.45);if(fa>0.01){const lit=ag_in(tt,P.six+1.1,0.5),boxes=sw_forms(x,426,300,{a:fa,k:ag_spr(tt,P.six-0.25,0.8),lit:3,litA:lit});
    ag_label(x,960,266,"Six forms",{align:"center",col:AG.blue,a:fa});
    const da=ag_in(tt,P.six-0.1,0.4);if(da>0.01){sw_eq(x,1265,190,[["a square",0,1],["10 roots",0,1,null,null,"+"],["39",1,1]],{a:da,col:AG.blue});
      sw_toForm(x,1578,190,boxes[3],ag_in(tt,P.six+0.4,0.7)*da);}}}
// one form's steps on a card on the left page; the example; the square drawn on the right page as each step is said
const SW_STEPS=[["Halve the roots","5"],["Multiply it by itself","25"],["Add the numbers","64"],["Take its root","8"],["Take away the half","3"]];
function sw_steps(x,tt,P){const B=SW_BOOK;
  // the form, lit, at the top of the left page
  ag_textCard(x,360,150,560,{kick:"Form 4",title:"Squares and roots equal numbers"},{edge:AG.blue,kickCol:AG.blue,a:ag_in(tt,P.steps-0.3,0.4)});
  const times=[P.halve,P.mult,P.add,P.root,P.away];
  SW_STEPS.forEach(([s,v],i)=>{const a=ag_in(tt,P.steps+0.2+i*0.25,0.4);if(a<=0.01)return;const y=370+i*74,on=ag_io(tt,times[i]-0.1,times[i+1]?times[i+1]-0.1:1e9,0.25);
    ag_box(x,370,y,540,60,16,{a,edge:on>0.05?AG.blue:null,edgeA:0.9*on});ag_T(x,(i+1)+". "+s,394,y+41,{w:600,size:28,a,col:on>0.5?AG.blue:AG.ink});
    const va=ag_in(tt,times[i]+0.4,0.3)*a;if(va>0.01)ag_T(x,v,880,y+41,{w:800,size:30,align:"right",col:i===4?AG.green:AG.ink,a:va});});
  // the example, under the steps
  const ea=ag_in(tt,P.example-0.1,0.4),k=ag_spr(tt,P.example-0.1,0.8);if(ea>0.01){x.save();ag_about(x,640,790,lerp(0.6,1,k));ag_box(x,360,750,560,90,18,{a:ea});
    ag_T(x,"A square and ten roots",392,790,{w:700,size:30,a:ea});ag_T(x,"make thirty-nine",392,826,{w:600,size:28,col:AG.mut,a:ea});x.restore();}
  // the square, on the right page
  const u=170,sx=1110,sy=236;sw_square(x,sx,sy,u,{p:clamp((tt-P.drawn)/1.2,0,1),strips:clamp((tt-P.halve-0.3)/1.0,0,1),corner:clamp((tt-P.mult-0.2)/0.8,0,1),side:ag_in(tt,P.root,0.5),root:ag_in(tt,P.away+0.2,0.6)});
  const l39=ag_in(tt,P.add-0.1,0.4);if(l39>0.01)ag_pill(x,sx+(u+u*5/3)/2,sy-66,"39 + 25 = 64",{a:l39,size:30});
  const ans=sw_pop(tt,P.away+0.5,null);x.save();ag_about(x,1300,800,lerp(0.6,1,ans.k));ag_verdict(x,1300,800,"the root is 3","pass",ans.a);x.restore();}
// a page turning from right to left over the open book (u 0 to 1)
function sw_pageTurn(x,u){const B=SW_BOOK,g=B.gut,ex=lerp(B.x1,B.x0,u),lift=Math.sin(u*Math.PI)*60;x.save();
  x.fillStyle="rgba(40,26,14,"+(0.25*Math.sin(u*Math.PI))+")";x.fillRect(Math.min(g,ex),B.y0,Math.abs(ex-g),B.y1-B.y0);
  x.beginPath();x.moveTo(g,B.y0);x.quadraticCurveTo((g+ex)/2,B.y0-lift,ex,B.y0+lift*0.2);x.lineTo(ex,B.y1-lift*0.2);x.quadraticCurveTo((g+ex)/2,B.y1+lift*0.3,g,B.y1);x.closePath();
  const gr=x.createLinearGradient(g,0,ex,0);gr.addColorStop(0,"rgb(226,216,196)");gr.addColorStop(1,"rgb(246,240,226)");x.fillStyle=gr;x.fill();x.restore();}
// today: three chats, each solving the same job from nothing; then the job written down once, and every agent reading it
function sw_reuse(x,tt,P){ag_roomLight(x,1);const fa=ag_in(tt,P.write-0.2,0.6),at=[P.lab+0.6,P.again-0.2,P.again+0.5];
  [[150,170],[710,170],[1270,170]].forEach(([cx,cy],i)=>{const a=ag_in(tt,at[i],0.5)*(1-fa);if(a<=0.01)return;sw_chat(x,cx,cy,500,320,{a,k:ag_spr(tt,at[i],0.8),ask:"Reconcile the count"});
    const sp=ag_in(tt,P.nothingD-0.1+i*0.25,0.4);ag_pill(x,cx+250,cy+384,"solved from nothing",{col:AG.amber,icon:"loop",a:a*sp,size:28});
    sw_model(x,cx+452,cy+272,30,{t:tt+i,core:0.6,a});});
  if(fa>0.01){const k=ag_spr(tt,P.write-0.2,0.8);sw_file(x,560,210,800,330,"skills/…/SKILL.md",[{k:"front",t:"name: the job"},{k:"front",t:"description: when to use it"},{k:"h2",t:"Its steps"},{k:"li",t:"1. …"}],{a:fa,k,edge:AG.blue});
    const ev=ag_in(tt,P.every-0.1,0.5);[[560,720],[960,760],[1360,720]].forEach(([mx,my],i)=>{const a=ev*ag_in(tt,P.every+i*0.2,0.4);if(a<=0.01)return;
      x.save();x.globalAlpha*=a;x.strokeStyle=rgba(AG.blue,0.5);x.lineWidth=3;x.setLineDash([8,8]);x.beginPath();x.moveTo(960,540);x.lineTo(mx,my-48);x.stroke();x.restore();sw_model(x,mx,my,44,{t:tt+i,core:0.8,a});});}}

// copied for centuries: copies of the book along the years, from about 820, one after another; then the Latin one, in 1145, in a
// lighter binding, and its card
function sw_copies(x,tt,P){const xa=300,xb=1560,yr=v=>lerp(xa,xb,(v-820)/(1145-820)),ry=660,L=[238,228,208];
  const rp=ag_sine(clamp((tt-P.copied+0.3)/2.8,0,1));x.save();x.strokeStyle=rgba(L,0.5);x.lineWidth=5;x.lineCap="round";x.beginPath();x.moveTo(xa-50,ry);x.lineTo(lerp(xa-50,xb+50,rp),ry);x.stroke();x.restore();
  const cols=[[118,70,50],[96,74,56],[132,96,64],[84,66,60],[110,84,58]];
  [820,865,910,955,1000,1045,1090].forEach((v,i)=>{const t0=P.copied-0.3+i*0.36,a=ag_in(tt,t0,0.4);if(a<=0.01)return;const px=yr(v),lift=(1-ag_eo(clamp((tt-t0)/0.6,0,1)))*24;
    sw_codex(x,px-62,ry-200-lift,124,150,cols[i%5],{a});x.save();x.globalAlpha*=a;x.fillStyle=rgba(L,0.7);x.beginPath();x.arc(px,ry,7,0,TAU);x.fill();x.restore();});
  ag_T(x,"about 820",yr(820),ry+58,{w:600,size:28,align:"center",col:L,a:ag_in(tt,P.copied-0.3,0.4)});
  const la=ag_in(tt,P.lat-0.2,0.5);if(la>0.01){const px=yr(1145),lift=(1-ag_eo(clamp((tt-P.lat+0.2)/0.6,0,1)))*24;sw_codex(x,px-62,ry-200-lift,124,150,[178,150,110],{a:la});
    x.save();x.globalAlpha*=la;x.fillStyle=rgba(L,0.95);x.beginPath();x.arc(px,ry,9,0,TAU);x.fill();x.restore();ag_T(x,"1145",px,ry+58,{w:600,size:28,align:"center",col:L,a:la});}
  const p=sw_pop(tt,P.lat+0.3,null);ag_textCard(x,960,170,560,{kick:"Segovia, 1145",title:"Into Latin",sub:"Robert of Chester's translation"},{k:p.k,a:p.a,kickCol:SW_PAL.tag});}

// the walnut desk alone, for the copies and the words
AG_PLACES.swWood=c=>{let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgb(96,68,46)");g.addColorStop(1,"rgb(72,50,34)");c.fillStyle=g;c.fillRect(0,0,W,H);
  const R=ag_rnd(78);c.save();c.globalAlpha=0.12;c.strokeStyle="rgb(40,26,16)";c.lineWidth=2;for(let i=0;i<60;i++){const y=R()*H;c.beginPath();c.moveTo(0,y);c.bezierCurveTo(600,y+(R()-0.5)*30,1300,y+(R()-0.5)*30,W,y+(R()-0.5)*20);c.stroke();}c.restore();
  g=c.createRadialGradient(1500,200,50,1300,400,1500);g.addColorStop(0,"rgba(255,230,190,0.18)");g.addColorStop(1,"rgba(255,230,190,0)");c.fillStyle=g;c.fillRect(0,0,W,H);sw_light(c,0.8);};

/* ===== chapters 2 to 7, in the lab: the module's room, Jun at his desk on the left, and by night the same room with its lamp ===== */
// the kicker over a lab chapter's first seconds
const sw_kickA=t=>ag_io(t,0.3,4.6,0.5);
// the three causes as short cards: their titles, then o.sub (a line under each), o.k springs
function sw_causeCards(x,tt,at,o){o=o||{};const out=[];for(let i=0;i<3;i++){const p=sw_pop(tt,at[i],o.till==null?null:o.till),y=(o.y||200)+i*(o.dy||150);
    const b=ag_textCard(x,o.x||580,y,o.w||760,{title:SW_CAUSES[i].title,sub:o.sub?o.sub(i):null},{k:p.k,a:p.a*(o.a==null?1:o.a),edge:o.edge||null});out.push(b);}return out;}

// ---- 2 · Solved again, from nothing: the census-day count and the census report; when they differ, the same few causes, each found
// before and settled by a person, but kept in one chat, one note, one email; the agent starts from nothing, and may answer another way ----
scene("again",(ctx,S,t,sc)=>{const c=sc.cues,P=sw_once(sc,"P",()=>({
    team:wAt(sc,"today","Jun's team"),count:wAt(sc,"today","18,412"),gov:wAt(sc,"today","government"),
    recon:c.recon,change:wAt(sc,"recon","code"),reconW:wAt(sc,"recon","reconciles"),
    still:wAt(sc,"matches","still matches"),report:wAt(sc,"matches","census report"),official:wAt(sc,"matches","official"),
    differ:c.differ,why:wAt(sc,"differ","why"),
    causes:c.causes,c1:wAt(sc,"three","withdrew"),c2:wAt(sc,"three","new degree"),c3:wAt(sc,"three","counted twice"),
    found:wAt(sc,"found","found before"),settled:wAt(sc,"found","settled"),
    stayed:c.stayed,chat:wAt(sc,"stayed","one chat"),note:wAt(sc,"stayed","one note"),mail:wAt(sc,"stayed","one email"),
    nothing:c.nothing,start:wAt(sc,"nothing","starts from nothing"),aft:wAt(sc,"nothing","afternoon"),knew:wAt(sc,"nothing","already knew"),
    twice:c.twice,another:wAt(sc,"twice","another way"),two:wAt(sc,"twice","two answers")}));
  const shots=[
    // Jun at his desk: the census-day count, the number the university reports to the government
    {at:0,place:"lab",keys:[[0,960,540,1.0],[0.1,970,530,1.02]],d:12,push:0.01,draw:(x,tt)=>{
      sw_jun(x,tt,{gaze:[3,0.3],nod:0.06*ag_io(tt,P.team-0.2,P.team+0.9,0.3),smile:0.3});ag_roomLight(x,1);
      const p=sw_pop(tt,P.count-0.3,null);sw_num(x,1000,250,700,"The census-day count","18,412 students",null,{k:p.k,a:p.a});
      const q=sw_pop(tt,P.gov-0.4,null);ag_pill(x,1350,500,"the number reported to the government",{a:q.a,size:28});}},
    // the count beside the census report: they match; then, after a change, they differ by 37
    {at:P.recon-0.4,place:"lab",cut:true,keys:[[P.recon-0.4,960,540,1.0],[P.recon-0.3,960,532,1.03]],d:12,push:0.01,draw:(x,tt)=>{ag_roomLight(x,1);
      const m=ag_in(tt,P.differ+0.2,0.6),L=sw_pop(tt,P.recon-0.2,null);sw_num(x,160,260,660,"The count","18,412",null,{k:L.k,a:L.a,num2:"18,375",m,col2:AG.amber,edge:m>0.5?AG.amber:null});
      const ch=sw_pop(tt,P.change-0.2,null);ag_pill(x,490,490,"its code or a source changed",{a:ch.a,size:28});
      const R=sw_pop(tt,P.report-0.3,null);sw_num(x,1100,260,660,"The census report","18,412","the university's official count",{k:R.k,a:R.a});
      const eq=ag_in(tt,P.still-0.1,0.4);if(eq>0.01){ag_T(x,"=",960,382,{w:700,size:64,align:"center",a:eq,col:m>0.5?AG.amber:AG.ink});
        if(m>0.01){x.save();x.globalAlpha*=eq*m;x.strokeStyle=rgba(AG.amber,1);x.lineWidth=5;x.lineCap="round";x.beginPath();x.moveTo(978,330);x.lineTo(942,398);x.stroke();x.restore();}}
      ag_verdict(x,960,580,"they match","pass",ag_io(tt,P.still+0.3,P.differ+0.1,0.4));ag_verdict(x,960,580,"37 fewer: why?","fail",ag_in(tt,P.why-0.3,0.4));}},
    // the same few causes, each found before and settled by a person; each answer kept where it was found; the agent starts from nothing
    {at:P.causes-0.3,place:"lab",cut:true,keys:[[P.causes-0.3,960,540,1.0],[P.causes-0.2,960,536,1.02]],d:30,push:0.008,draw:(x,tt)=>sw_kept(x,tt,P)},
    // two answers for one count
    {at:P.twice-0.4,place:"lab",cut:true,keys:[[P.twice-0.4,960,540,1.0],[P.twice-0.3,960,530,1.03]],d:6,push:0.01,draw:(x,tt)=>{ag_roomLight(x,1);
      const p=sw_pop(tt,P.twice,null),q=sw_pop(tt,P.another-0.1,null);
      sw_model(x,520,250,46,{t:tt,core:0.8,a:p.a});ag_textCard(x,240,350,560,{kick:"One afternoon",title:"Leave the 37 out"},{k:p.k,a:p.a,kickCol:AG.kick,tail:{side:"top",at:0.5,px:520,py:300}});
      sw_model(x,1400,250,46,{t:tt+1,core:0.8,a:q.a});ag_textCard(x,1120,350,560,{kick:"Another afternoon",title:"They still count"},{k:q.k,a:q.a,kickCol:AG.kick,tail:{side:"top",at:0.5,px:1400,py:300}});
      ag_verdict(x,960,640,"two answers for one count","fail",ag_in(tt,P.two-0.1,0.5));}}];
  sw_shots(ctx,S,t,sc.dur,shots);sw_kick(ctx,S,sw_kickA(t));});
// the causes: three cards; then each answer flies into where it stayed (a chat, a note, an email), and the agent below starts from nothing
function sw_kept(x,tt,P){ag_roomLight(x,1);
  const hd=ag_io(tt,P.causes,P.stayed-0.2,0.4);ag_label(x,960,170,"The same few causes",{align:"center",col:AG.kick,a:hd});
  const fly=[P.chat,P.note,P.mail].map(w=>ag_eo(clamp((tt-w+0.2)/0.9,0,1))),home=[[400,330],[960,330],[1520,340]];
  for(let i=0;i<3;i++){const p=sw_pop(tt,[P.c1,P.c2,P.c3][i]-0.2,null),u=fly[i];if(p.a<=0.01||u>=0.99)continue;const y=220+i*170,sub=ag_in(tt,P.found+0.2*i,0.4);
    const words={title:SW_CAUSES[i].title,sub:sub>0.5?"found before, and settled by a person":null},h=ag_textCard(x,580,y,760,words,{measure:true}).h,w0=[P.chat,P.note,P.mail][i],ta=1-ag_in(tt,w0-0.6,0.3),la=ag_in(tt,w0-0.3,0.2);
    x.save();const cx=lerp(960,home[i][0],u),cy=lerp(y+h/2,home[i][1],u);x.translate(cx-960,cy-(y+h/2));ag_about(x,960,y+h/2,lerp(1,0.2,u));
    if(ta<0.999)sw_blank(x,580,y,760,h,p.a*(1-u*0.6),la);if(ta>0.001)ag_textCard(x,580,y,760,words,{k:p.k,a:p.a*ta});x.restore();}
  // where each answer stayed
  const ca=ag_in(tt,P.chat-0.3,0.4),na=ag_in(tt,P.note-0.3,0.4),ma=ag_in(tt,P.mail-0.3,0.4),dim=1-0.35*ag_in(tt,P.knew-0.6,0.6);
  sw_chat(x,200,190,400,260,{a:ca*dim,k:ag_spr(tt,P.chat-0.3,0.8),label:"one chat"});sw_note(x,850,200,220,{a:na*dim,k:ag_spr(tt,P.note-0.3,0.8),label:"one note"});
  sw_mail(x,1340,210,360,{a:ma*dim,k:ag_spr(tt,P.mail-0.3,0.8),label:"one email"});
  // the agent, starting from nothing, going round and round for an afternoon
  const ga=ag_in(tt,P.nothing-0.2,0.5);if(ga>0.01){const R=118,cx=960,cy=700,lit=Math.floor(Math.max(0,tt-P.start)*1.6)%3;
    sw_fade(x,ga,c2=>ag_loop(c2,cx,cy,{R,r:46,t:tt,core:0.8,think:0.6,lit:tt>P.start?lit:null,label:null,p:1,stepA:[1,1,1]}));
    const pa=ag_in(tt,P.aft-0.2,0.4);ag_pill(x,1430,700,"an afternoon, from nothing",{col:AG.amber,icon:"loop",a:pa*ga,size:28});
    const ka=ag_in(tt,P.knew-0.3,0.5);if(ka>0.01){ag_label(x,960,110,"What the team already knew",{align:"center",col:AG.kick,a:ka});}}}

// ---- 3 · A skill, earned by hand: Jun does the job once more and writes down each step; the skill file, its name and its line; its
// steps; its causes met so far; the agent reads only names and lines, and loads a skill's steps when a job needs them; a new case gets a
// line; al-Khwarizmi's book again ----
const SW_NOTES=["1. Build the count","2. Compare it with the census report","3. Find the students behind the difference","4. Report each cause, with its query"];
const SW_FRONT=[{k:"front",t:"name: reconcile-and-diff"},{k:"front",t:"description: Validate a change before sign-off, by reconciling with the census report and diffing against the previous version. Use before asking an owner to approve a change to the core or the marts."}];
const SW_RECON_STEPS=["1. Build on the development target …","2. The singular test reconcile_planning_with_census_report must pass. It compares Planning's mart with … census_report.csv, faculty by faculty.","3. For the sign-off, show every row, not just the failures …","4. If they differ, find the learners behind the difference … Report each cause with its query."];
scene("skill",(ctx,S,t,sc)=>{const c=sc.cues,P=sw_once(sc,"P",()=>({
    hand:c.hand,byHand:wAt(sc,"hand","by hand"),writes:wAt(sc,"hand","writes down"),
    file:c.file,skillW:wAt(sc,"file","a skill"),fileW:wAt(sc,"file","a file"),name:wAt(sc,"file","a name"),line:wAt(sc,"file","a line"),
    steps:c.steps,build:wAt(sc,"steps","build the count"),compare:wAt(sc,"steps","compare"),
    behind:c.behind,find:wAt(sc,"behind","Find the students"),report:wAt(sc,"behind","report each cause"),
    causes:c.causes,shows:wAt(sc,"causes","how it shows"),settled:wAt(sc,"causes","what settled"),decided:wAt(sc,"causes","who decided"),
    loads:c.loads,every:wAt(sc,"loads","every skill"),just:wAt(sc,"loads","name and line"),loadsW:wAt(sc,"loads","loads the steps"),job:wAt(sc,"loads","a job"),
    grows:c.grows,newc:wAt(sc,"grows","new case"),aline:wAt(sc,"grows","a line too"),twice:wAt(sc,"grows","Nothing is solved"),
    book:c.book,forms:wAt(sc,"book","each form"),real:wAt(sc,"book","real cases")}));
  const shots=[
    // Jun at his desk, writing down each step as he goes
    {at:0,place:"lab",keys:[[0,960,540,1.0],[0.1,970,530,1.02]],d:7,push:0.01,draw:(x,tt)=>{
      sw_jun(x,tt,{gaze:[3,0.6],nod:0.05*ag_io(tt,P.writes-0.3,P.writes+1.6,0.4),smile:0.25});ag_roomLight(x,1);
      const p=sw_pop(tt,P.byHand-0.2,null);if(p.a>0.01){x.save();ag_about(x,1300,420,lerp(0.6,1,p.k));x.globalAlpha*=p.a;ag_box(x,860,190,880,400,22,{});
        ag_T(x,"JUN'S NOTES",900,250,{w:700,size:28,ls:4,col:AG.kick});
        SW_NOTES.forEach((s,i)=>ag_T(x,s,900,330+i*70,{w:600,size:32,a:ag_in(tt,P.writes+i*0.45,0.35)}));x.restore();}}},
    // the skill: a file in the project, its name, and the line that says when to use it; then its steps
    {at:P.file-0.4,place:"lab",cut:true,keys:[[P.file-0.4,960,540,1.0],[P.file-0.3,960,534,1.02]],d:18,push:0.008,draw:(x,tt)=>{ag_roomLight(x,1);
      const k=ag_spr(tt,P.skillW-0.2,0.8),a=ag_in(tt,P.skillW-0.2,0.5),sa=ag_in(tt,P.steps-0.3,0.5);
      const L=[{k:"front",t:SW_FRONT[0].t,hi:ag_io(tt,P.name-0.1,P.line-0.2,0.3)},{k:"front",t:SW_FRONT[1].t,hi:ag_io(tt,P.line-0.1,P.steps-0.3,0.3)},{k:"gap"},{k:"h2",t:"Reconcile",a:sa}]
        .concat(SW_RECON_STEPS.map((s,i)=>({k:"li",t:s,a:ag_in(tt,P.steps+0.1+i*0.2,0.4),hi:[ag_io(tt,P.build-0.1,P.compare-0.2,0.3),ag_io(tt,P.compare-0.1,P.find-0.3,0.3),0,ag_in(tt,P.find-0.1,0.3)][i]})));
      sw_file(x,260,180,1400,560,"skills/reconcile-and-diff/SKILL.md",L,{a,k,edge:AG.blue});}},
    // its causes met so far: how each shows, what settled it, who decided
    {at:P.causes-0.4,place:"lab",cut:true,keys:[[P.causes-0.4,960,540,1.0],[P.causes-0.3,960,536,1.02]],d:7,push:0.008,draw:(x,tt)=>{ag_roomLight(x,1);
      ag_T(x,"skills/reconcile-and-diff/SKILL.md · Causes met so far",960,150,{w:500,size:28,f:"mono",col:AG.blue,align:"center",a:ag_in(tt,P.causes-0.3,0.4)});
      const parts=ag_in(tt,P.shows-0.2,0.4)+ag_in(tt,P.settled-0.2,0.4)+ag_in(tt,P.decided-0.2,0.4);let y=190;
      for(let i=0;i<3;i++){const p=sw_pop(tt,P.causes-0.2+i*0.3,null);const b=sw_cause(x,360,y,1200,SW_CAUSES[i],{parts,a:p.a,k:p.k});y+=b.h+16;}}},
    // the agent reads only each skill's name and line; a job comes, and it loads the steps of the one it needs
    {at:P.loads-0.4,place:"lab",cut:true,keys:[[P.loads-0.4,960,540,1.0],[P.loads-0.3,960,536,1.02]],d:9,push:0.008,draw:(x,tt)=>sw_loads(x,tt,P)},
    // a new case gets a line too
    {at:P.grows-0.4,place:"lab",cut:true,keys:[[P.grows-0.4,960,540,1.0],[P.grows-0.3,960,536,1.02]],d:6,push:0.008,draw:(x,tt)=>{ag_roomLight(x,1);
      ag_T(x,"skills/reconcile-and-diff/SKILL.md · Causes met so far",960,150,{w:500,size:28,f:"mono",col:AG.blue,align:"center"});
      for(let i=0;i<3;i++)ag_textCard(x,480,190+i*130,960,{title:SW_CAUSES[i].title});
      const n=sw_pop(tt,P.newc-0.1,null);if(n.a>0.01){const b=ag_textCard(x,480,580,960,{title:"The next new case",sub:"how it shows, what settled it, who decided"},{k:n.k,a:n.a,kickCol:AG.kick});sw_dash(x,b.x,b.y,b.w,b.h,AG.blue,n.a);}
      ag_verdict(x,960,800,"nothing is solved twice","pass",ag_in(tt,P.twice-0.1,0.5));}},
    // al-Khwarizmi's book again: a form and a skill, its steps and the skill's steps, real cases and the causes met so far
    {at:P.book-0.4,place:"swBook",dis:0.8,keys:[[P.book-0.4,960,500,1.0],[P.book-0.3,960,496,1.02]],d:7,push:0.008,draw:(x,tt)=>{
      const rows=[["A form","A skill",P.book],["Its steps","Its steps",P.forms],["Real cases","Causes met so far",P.real]];
      ag_label(x,630,200,"In the book",{align:"center",col:SW_PAL.tag,a:ag_in(tt,P.book-0.2,0.4)});ag_label(x,1290,200,"In the skill",{align:"center",col:AG.blue,a:ag_in(tt,P.book,0.4)});
      rows.forEach(([l,r,w],i)=>{const p=sw_pop(tt,w-0.2,null),q=sw_pop(tt,w+0.2,null),y=250+i*170;ag_textCard(x,380,y,500,{title:l},{k:p.k,a:p.a});
        ag_textCard(x,1040,y,500,{title:r},{k:q.k,a:q.a,edge:AG.blue});if(q.a>0.01)ag_T(x,"=",960,y+58,{w:700,size:44,align:"center",a:q.a,col:SW_PAL.ink});});}}];
  sw_shots(ctx,S,t,sc.dur,shots);sw_kick(ctx,S,sw_kickA(t));});
// the seven skills folded to their names and lines, in two columns; the agent reads each line in turn; a job comes, and the one it needs
// unfolds to its steps while the others dim
const SW_GRID=SW_SKILLS.map((s,i)=>({x:i<4?640:1270,y:150+(i%4)*156,w:600}));
function sw_loads(x,tt,P){ag_roomLight(x,1);const ma=ag_in(tt,P.loads-0.3,0.5);sw_model(x,330,450,62,{t:tt,core:0.7+0.3*ag_in(tt,P.just,0.4),think:ag_io(tt,P.just,P.loadsW+1,0.4),a:ma});
  const open=ag_eo(clamp((tt-P.job-0.2)/0.9,0,1));
  SW_SKILLS.forEach(([n,d],i)=>{const g=SW_GRID[i],p=sw_pop(tt,P.loads-0.2+i*0.12,null),rd=clamp((tt-P.just+0.3-i*0.28)/0.5,0,1),me=i===SW_RECON;
    if(me&&open>0.01)return;sw_slim(x,g.x,g.y,g.w,n,d,{rows:2,a:p.a,k:p.k,read:rd,dim:me?0:open*1.4});});
  const ja=sw_pop(tt,P.job-0.4,null);ag_pill(x,330,640,"a job needs it",{a:ja.a,size:28});
  if(open>0.01){const g=SW_GRID[SW_RECON],X=lerp(g.x,640,open),Y=lerp(g.y,150,open),Wd=lerp(g.w,1230,open),Hd=lerp(142,470,open);
    if(open<0.5)sw_slim(x,X,Y,Wd,SW_SKILLS[SW_RECON][0],SW_SKILLS[SW_RECON][1],{rows:2,lit:1,a:1-open*2});
    else sw_file(x,X,Y,Wd,Hd,"skills/reconcile-and-diff/SKILL.md",[{k:"h2",t:"Reconcile"}].concat(SW_RECON_STEPS.map(s=>({k:"li",t:s}))),{a:(open-0.5)*2,edge:AG.blue});}}

// ---- 4 · A router picks the skill: seven skills; which one does a job need? a router, a skill whose only job is to choose; it reads
// the job, compares it with each skill's line, loads the one that fits; when none fits, it says so and asks a person; that job is done
// by hand first, and may become the next skill; the book's two moves did the same ----
scene("router",(ctx,S,t,sc)=>{const c=sc.cues,P=sw_once(sc,"P",()=>({
    seven:wAt(sc,"seven","seven skills"),eachJob:wAt(sc,"seven","one for each job"),which:c.which,
    router:c.router,choose:wAt(sc,"router","only job"),reads:wAt(sc,"reads","reads the job"),compares:wAt(sc,"reads","compares"),fits:wAt(sc,"reads","loads the one"),
    check:c.check,recon:wAt(sc,"check","reconcile and diff"),
    none:c.none,noFit:wAt(sc,"none","no skill fits"),guess:wAt(sc,"none","doesn't guess"),says:wAt(sc,"none","says so"),asks:wAt(sc,"none","asks a person"),
    next:c.next,hand:wAt(sc,"next","by hand"),nextW:wAt(sc,"next","next skill"),
    forms:c.forms,same:wAt(sc,"forms","did the same"),brought:wAt(sc,"forms","brought each problem"),solve:wAt(sc,"forms","would solve")}));
  const shots=[
    {at:0,place:"lab",keys:[[0,960,540,1.0],[0.1,960,536,1.02]],d:34,push:0.006,draw:(x,tt)=>sw_route(x,tt,P)},
    // the job no skill fits, done by hand first: Jun, and the next skill, still a draft
    {at:P.next-0.4,place:"lab",cut:true,keys:[[P.next-0.4,960,540,1.0],[P.next-0.3,970,530,1.02]],d:5,push:0.01,draw:(x,tt)=>{
      sw_jun(x,tt,{gaze:[3,0.6],nod:0.05*ag_io(tt,P.hand-0.3,P.hand+1.2,0.4),smile:0.25});ag_roomLight(x,1);
      const p=sw_pop(tt,P.next-0.2,null);ag_textCard(x,860,190,820,{kick:"A job, done by hand first",title:"Forecast next year's intake"},{k:p.k,a:p.a,kickCol:AG.kick});
      const q=sw_pop(tt,P.nextW-0.2,null);if(q.a>0.01){x.save();ag_about(x,1270,520,lerp(0.6,1,q.k));const b=sw_slim(x,970,450,600,"the next skill?","… Use when …",{a:q.a});sw_dash(x,b.x,b.y,b.w,b.h,AG.blue,q.a);x.restore();}}},
    // the book: completion and balancing brought each problem to the one form whose steps would solve it
    {at:P.forms-0.4,place:"swBook",dis:0.8,keys:[[P.forms-0.4,960,500,1.0],[P.forms-0.3,960,496,1.02]],d:7,push:0.008,draw:(x,tt)=>{
      const fa=ag_in(tt,P.forms-0.2,0.5),lit1=ag_in(tt,P.brought+0.9,0.4),lit4=ag_in(tt,P.brought+1.6,0.4);
      const boxes=sw_forms(x,426,300,{a:fa,k:ag_spr(tt,P.forms-0.2,0.8),lits:{0:lit1,3:lit4}});
      ag_label(x,960,266,"Six forms",{align:"center",col:AG.blue,a:fa});
      const a1=sw_pop(tt,P.brought-0.4,null),a2=sw_pop(tt,P.brought+0.4,null),b1=boxes[0];
      if(a1.a>0.01){x.save();ag_about(x,600,190,lerp(0.6,1,a1.k));sw_eq(x,600,190,[["5 squares",0,1],["40 roots",1,1]],{a:a1.a,col:AG.blue});x.restore();
        sw_link(x,600,236,600,b1.y-8,AG.blue,ag_in(tt,P.brought+0.4,0.4)*fa);}
      if(a2.a>0.01){x.save();ag_about(x,1265,190,lerp(0.6,1,a2.k));sw_eq(x,1265,190,[["a square",0,1],["10 roots",0,1,null,null,"+"],["39",1,1]],{a:a2.a,col:AG.blue});x.restore();
        sw_toForm(x,1578,190,boxes[3],ag_in(tt,P.brought+1.1,0.6)*fa);}}}];
  sw_shots(ctx,S,t,sc.dur,shots);sw_kick(ctx,S,sw_kickA(t));});
// the router at work: the agent on the left with the job and the router above it; the seven skills on the right
function sw_route(x,tt,P){ag_roomLight(x,1);const ma=ag_in(tt,0.2,0.6);sw_model(x,330,660,54,{t:tt,core:0.8,think:ag_io(tt,P.reads,P.fits+0.6,0.4)+ag_io(tt,P.none,P.says,0.4),a:ma});
  // the job: first Jun's change, then one no skill fits
  const j2=ag_in(tt,P.none-0.3,0.5),j1=sw_pop(tt,P.which-0.2,null);
  const rj=clamp((tt-P.reads+0.1)/0.6,0,1),fitA=ag_in(tt,P.fits-0.1,0.4)*(1-j2);
  if(j1.a*(1-j2)>0.01){x.save();ag_about(x,330,230,lerp(0.6,1,j1.k));const b=ag_textCard(x,70,140,520,{kick:"A job",title:"Check Jun's change before Noor signs it off"},{a:j1.a*(1-j2),kickCol:AG.kick,edge:fitA>0.5?AG.blue:null});
    if(rj>0.01&&rj<0.99){x.save();x.beginPath();rr(x,b.x,b.y,b.w,b.h,22);x.clip();const sx=b.x+b.w*rj,g=x.createLinearGradient(sx-140,0,sx+40,0);g.addColorStop(0,rgba(AG.violet,0));g.addColorStop(0.75,rgba(AG.violet,0.14));g.addColorStop(1,rgba(AG.violet,0));x.fillStyle=g;x.fillRect(sx-140,b.y,180,b.h);x.restore();}x.restore();}
  if(j2>0.01){const p=sw_pop(tt,P.none-0.3,null);ag_textCard(x,70,140,520,{kick:"Another job",title:"Forecast next year's intake"},{k:p.k,a:p.a,kickCol:AG.kick});}
  // the router: a skill whose only job is to choose
  const ra=sw_pop(tt,P.router-0.2,null);sw_slim(x,40,410,580,SW_ROUTER[0],SW_ROUTER[1],{rows:2,a:ra.a,k:ra.k,lit:ag_in(tt,P.choose,0.4)});
  // the seven skills, each line read in turn, twice: for the first job, and for the job none fits
  const ask=sw_pop(tt,P.asks-0.2,null);
  SW_SKILLS.forEach(([n,d],i)=>{const g=SW_GRID[i],p=sw_pop(tt,P.seven-0.3+i*0.12,null),rd1=clamp((tt-P.compares+0.2-i*0.22)/0.45,0,1),rd2=clamp((tt-P.noFit+0.2-i*0.18)/0.4,0,1);
    const me=i===SW_RECON,lit=me?ag_in(tt,P.fits,0.4)*(1-j2):0;sw_slim(x,g.x,g.y,g.w,n,d,{rows:2,a:p.a,k:p.k,read:j2>0.5?rd2:rd1,lit,dim:Math.max(lit>0.5?0:(fitA>0.5?0.8:0),ask.a)});});
  // "So which one?" over the skills
  ag_pill(x,1240,790,"So which one does a job need?",{a:ag_io(tt,P.which-0.2,P.router-0.3,0.4),size:28});
  // the one that fits: a line from the router to it
  const la=fitA;if(la>0.01){const g=SW_GRID[SW_RECON];x.save();x.globalAlpha*=la;x.strokeStyle=rgba(AG.blue,0.7);x.lineWidth=3;x.setLineDash([9,9]);x.beginPath();x.moveTo(620,481);x.lineTo(g.x,g.y+71);x.stroke();x.setLineDash([]);ag_arrowHead(x,g.x-2,g.y+71,Math.atan2(g.y+71-481,g.x-620),12,rgba(AG.blue,0.85));x.restore();}
  ag_verdict(x,1240,830,"reconcile-and-diff","pass",ag_io(tt,P.recon-0.4,P.none-0.4,0.4));
  // none fits: it says so, and asks a person
  ag_verdict(x,1240,790,"No skill fits","fail",ag_in(tt,P.says-0.3,0.4));
  ag_textCard(x,700,560,620,{kick:"To Jun",title:"No skill fits this job. Can you do it first?"},{k:ask.k,a:ask.a,kickCol:AG.kick,edge:AG.violet,tail:{side:"left",at:0.5,px:400,py:640}});}

// ---- 5 · A workflow runs what's known: every night the count is built again; fixed steps, in order; when the count and the census
// report agree, no agent; the rule; when they don't, the workflow calls the agent with the reconcile skill, and a person decides; in
// the book, a form's steps never change: the thinking is in bringing each problem to its form ----
scene("workflow",(ctx,S,t,sc)=>{const c=sc.cues,P=sw_once(sc,"P",()=>({
    choose:wAt(sc,"night","no choosing"),every:wAt(sc,"night","Every night"),built:wAt(sc,"night","built again"),recs:wAt(sc,"night","day's records"),
    fixed:c.fixed,wf:wAt(sc,"fixed","workflow"),steps:wAt(sc,"fixed","fixed steps"),order:wAt(sc,"fixed","in order"),same:wAt(sc,"fixed","same way"),
    s1:wAt(sc,"list","Build"),s2:wAt(sc,"list","Count as"),s3:wAt(sc,"list","Run the tests"),s4:wAt(sc,"list","Compare"),
    agree:c.agree,whole:wAt(sc,"agree","whole job"),noagent:wAt(sc,"agree","no agent"),
    rule:c.rule,plain:wAt(sc,"rule","plain steps"),keep:wAt(sc,"rule","keep the agent"),
    call:c.call,dont:wAt(sc,"call","don't agree"),callW:wAt(sc,"call","call the agent"),more:wAt(sc,"call","one more step"),skill:wAt(sc,"call","reconcile skill"),
    person:c.person,why:wAt(sc,"person","finds out why"),decides:wAt(sc,"person","A person decides"),
    book:c.book,never:wAt(sc,"book","never change"),thinking:wAt(sc,"book","thinking"),bring:wAt(sc,"book","bringing")}));
  const slots=sw_slots(5,250),four=sw_slots(4,250,330,1810);
  const rail=(x,tt,o)=>{const st=o.states(tt),sl=o.four?four:slots;sw_rail(x,sl.map((s,i)=>({x:s.x,y:s.y,w:s.w,num:i+1,label:i<4?SW_STEPS_NIGHT[i]:"Call the agent",state:st[i],a:o.stepA(i),k:o.stepK?o.stepK(i):null})),{p:o.p});};
  const shots=[
    // the lab at night: every night, the count is built again from the day's records
    {at:0,place:"swNight",keys:[[0,960,540,1.0],[0.1,960,536,1.02]],d:8,push:0.008,draw:(x,tt)=>{sw_night(x);
      sw_clock(x,960,170,"Every night · 02:00",ag_in(tt,P.every-0.2,0.4));
      const ra=sw_pop(tt,P.recs-0.6,null);ag_textCard(x,260,330,560,{kick:"The day's records",title:"from the student system"},{k:ra.k,a:ra.a,kickCol:AG.kick});
      const ca=sw_pop(tt,P.built-0.3,null);sw_num(x,1100,330,560,"The count","18,412","built again every night",{k:ca.k,a:ca.a});
      if(ra.a>0.5&&ca.a>0.5){for(let i=0;i<5;i++){const u=((tt-P.recs)*0.5+i/5)%1;if(tt<P.recs)break;ag_pellet(x,lerp(840,1080,u),410+Math.sin(u*Math.PI)*-24,Math.sin(u*Math.PI));}}}},
    // the workflow: fixed steps, in order, the same way every time; when the count and the report agree, no agent is needed
    {at:P.fixed-0.4,place:"swNight",cut:true,keys:[[P.fixed-0.4,960,540,1.0],[P.fixed-0.3,960,536,1.02]],d:14,push:0.006,draw:(x,tt)=>{
      const sa=ag_in(tt,P.noagent-0.5,0.5);sw_model(x,1640,690,46,{t:tt,core:0,a:sa});sw_night(x);
      const on=[P.s1,P.s2,P.s3,P.s4];
      rail(x,tt,{four:true,p:clamp((tt-P.wf+0.3)/1.2,0,1),stepA:i=>i<4?ag_in(tt,P.steps-0.2+i*0.25,0.35):0,stepK:i=>ag_spr(tt,P.steps-0.2+i*0.25,0.8),
        states:tt=>on.map((w,i)=>tt<w-0.1?0:tt<(on[i+1]||P.agree)-0.2?1:2)});
      ag_pill(x,960,500,"the same way every time",{a:ag_io(tt,P.same-0.2,P.s1-0.3,0.4),size:28});
      ag_verdict(x,960,560,"18,412 · matches the census report","pass",ag_in(tt,P.agree-0.3,0.4));
      ag_pill(x,1640,800,"no agent needed",{a:sa,size:28});}},
    // the rule: plain steps for what's known; the agent for what isn't
    {at:P.rule-0.4,place:"swNight",cut:true,keys:[[P.rule-0.4,960,540,1.0],[P.rule-0.3,960,536,1.02]],d:6,push:0.008,draw:(x,tt)=>{
      const p=sw_pop(tt,P.plain-0.3,null),q=sw_pop(tt,P.keep-0.2,null);
      sw_model(x,440,539,48,{t:tt,core:0.8,a:q.a});sw_night(x);ag_model(x,440,539,48,{only:"light",t:tt,core:0.8,a:q.a});
      sw_miniRail(x,440,319,p.a);
      ag_textCard(x,560,250,800,{kick:"First",title:"Plain steps for what's known"},{k:p.k,a:p.a,kickCol:AG.blue,edge:AG.blue});
      ag_textCard(x,560,470,800,{kick:"Then",title:"The agent for what isn't"},{k:q.k,a:q.a,kickCol:AG.violet,edge:AG.violet});}},
    // when the numbers don't agree, one more step calls the agent, with the reconcile skill; it finds out why, and a person decides
    {at:P.call-0.4,place:"swNight",cut:true,keys:[[P.call-0.4,960,540,1.0],[P.call-0.3,960,536,1.02]],d:12,push:0.006,draw:(x,tt)=>{
      const fail=ag_in(tt,P.dont-0.2,0.3)>0.5,g=slots[4],ax=g.x+g.w/2,ay=560,ma=ag_in(tt,P.more-0.3,0.4),wa=ag_in(tt,P.callW,0.5);
      sw_model(x,ax,ay,56,{t:tt,core:wa,think:wa*0.7,a:ma});sw_night(x);ag_model(x,ax,ay,56,{only:"light",t:tt,core:wa,think:wa*0.7,a:ma*wa});
      rail(x,tt,{p:1,stepA:i=>i<4?1:ma,stepK:i=>i<4?null:ag_spr(tt,P.more-0.3,0.8),states:tt=>[2,2,2,fail?3:2,4]});
      sw_link(x,ax,g.y+136,ax,ay-70,AG.violet,ag_in(tt,P.callW-0.1,0.4));
      ag_verdict(x,slots[3].x+slots[3].w/2,440,"the numbers don't agree","fail",ag_in(tt,P.dont,0.4));
      const sk=sw_pop(tt,P.skill-0.3,null);sw_slim(x,560,ay-52,880,SW_SKILLS[SW_RECON][0],SW_SKILLS[SW_RECON][1],{a:sk.a,k:sk.k,lit:1});sw_link(x,1452,ay,ax-72,ay,AG.blue,sk.a);
      const rp=sw_pop(tt,P.why-0.2,null);if(rp.a>0.01){const b=ag_textCard(x,560,650,880,{kick:"The agent's draft",title:"Why they differ"},{k:rp.k,a:rp.a,kickCol:AG.violet});
        sw_dash(x,b.x,b.y,b.w,b.h,AG.violet,rp.a);sw_link(x,ax-24,ay+66,b.x+b.w+12,b.y+b.h/2,AG.violet,rp.a,true);}
      ag_verdict(x,1000,846,"A person decides","pass",ag_in(tt,P.decides-0.2,0.4));}},
    // the book: a form's steps never change; the thinking is in bringing each problem to its form
    {at:P.book-0.4,place:"swBook",dis:0.8,keys:[[P.book-0.4,960,500,1.0],[P.book-0.3,960,496,1.02]],d:7,push:0.008,draw:(x,tt)=>sw_bookFixed(x,tt,P)}];
  sw_shots(ctx,S,t,sc.dur,shots);sw_kick(ctx,S,sw_kickA(t),true);});
// the open book: on the left page, form 4's steps, the same every time; on the right, the thinking: a problem brought to that form
function sw_bookFixed(x,tt,P){ag_label(x,640,190,"The same steps every time",{align:"center",col:AG.blue,a:ag_in(tt,P.never-0.3,0.4)});
  ag_textCard(x,370,226,540,{kick:"Form 4",title:"Squares and roots equal numbers"},{edge:AG.blue,kickCol:AG.blue,a:ag_in(tt,P.book-0.2,0.4)});
  SW_STEPS.forEach(([s],i)=>{const a=ag_in(tt,P.book+i*0.15,0.35);if(a<=0.01)return;const y=430+i*72;ag_box(x,380,y,520,58,16,{a,edge:AG.blue,edgeA:0.6});ag_T(x,(i+1)+". "+s,404,y+40,{w:600,size:28,a,col:AG.ink});});
  ag_label(x,1290,190,"The thinking",{align:"center",col:SW_PAL.tag,a:ag_in(tt,P.thinking-0.3,0.4)});
  const m=ag_in(tt,P.bring+0.2,0.6),ea=ag_in(tt,P.thinking-0.2,0.4);
  sw_eq(x,1290,330,[["a square",0,1],["14 roots",0,1-m,AG.amber,null,"+"],["10 roots",0,m,AG.blue,null,"+"]],{a:ea,noEq:true});
  sw_eq(x,1290,420,[["39",1,1],["4 roots",1,1-m,AG.amber,null,"+"]],{a:ea});
  const ar=ag_in(tt,P.bring+0.9,0.5);if(ar>0.01){x.save();x.globalAlpha*=ar;x.strokeStyle=rgba(AG.blue,0.75);x.lineWidth=3;x.setLineDash([9,9]);x.beginPath();x.moveTo(1064,330);x.quadraticCurveTo(1000,292,926,290);x.stroke();x.setLineDash([]);ag_arrowHead(x,920,290,Math.PI,12,rgba(AG.blue,0.85));x.restore();}}

// ---- 6 · One night, a new case: 18,426 against 18,412; the tests pass, the workflow calls the agent; it loads the skill, checks the
// causes met so far, none fits; it finds the records behind the difference, and drafts a report in its sandbox with a question; in the
// morning Mei decides; Jun adds the cause and a fixed step with a test; Noor approves; the next night, no agent ----
scene("night",(ctx,S,t,sc)=>{const c=sc.cues,P=sw_once(sc,"P",()=>({
    oct:wAt(sc,"one","October"),dont:wAt(sc,"one","don't agree"),n1:wAt(sc,"one","18,426"),n2:wAt(sc,"one","18,412"),
    tests:c.tests,pass:wAt(sc,"tests","pass"),calls:wAt(sc,"tests","calls the agent"),
    loads:c.loads,skill:wAt(sc,"loads","reconcile skill"),checks:wAt(sc,"loads","checks the causes"),one:wAt(sc,"loads","one by one"),none:wAt(sc,"loads","None fits"),
    finds:c.finds,fourteen:wAt(sc,"finds","fourteen"),week:wAt(sc,"finds","last week"),feb:wAt(sc,"finds","February"),
    drafts:c.drafts,report:wAt(sc,"drafts","drafts a report"),cause:wAt(sc,"drafts","the cause"),query:wAt(sc,"drafts","the query"),question:wAt(sc,"drafts","a question"),are:wAt(sc,"drafts","Are these"),
    mei:c.mei,decides:wAt(sc,"mei","decides"),test:wAt(sc,"mei","test records"),screen:wAt(sc,"mei","new screen"),never:wAt(sc,"mei","never count"),
    adds:c.adds,answer:wAt(sc,"adds","Mei's answer"),rule:wAt(sc,"adds","turns the rule"),fixed:wAt(sc,"adds","fixed step"),withT:wAt(sc,"adds","with a test"),
    noor:c.noor,appr:wAt(sc,"noor","approves"),
    next:c.next,leaves:wAt(sc,"next","leaves the fourteen"),noag:wAt(sc,"next","calls no agent")}));
  const s5=sw_slots(5,230);
  const shots=[
    // the night of 21 October: the numbers don't agree; the tests pass, so the workflow calls the agent
    {at:0,place:"swNight",keys:[[0,960,540,1.0],[0.1,960,536,1.02]],d:14,push:0.006,draw:(x,tt)=>{
      const g=s5[4],ax=g.x+g.w/2,ay=580,wa=ag_in(tt,P.calls,0.5),ma=ag_in(tt,P.calls-0.2,0.4);
      sw_model(x,ax,ay,54,{t:tt,core:wa,think:wa*0.7,a:ma});sw_night(x);ag_model(x,ax,ay,54,{only:"light",t:tt,core:wa,think:wa*0.7,a:ma*wa});
      sw_clock(x,1560,110,"Night of 21 October",ag_in(tt,P.oct-0.3,0.4));sw_link(x,ax,g.y+136,ax,ay-68,AG.violet,ag_in(tt,P.calls-0.1,0.4));
      const fail=tt>P.dont;ag_pill(x,s5[2].x+s5[2].w/2,410,"the tests pass",{col:AG.green,icon:"tick",a:ag_in(tt,P.pass-0.2,0.4),size:28});
      sw_rail(x,s5.map((s,i)=>({x:s.x,y:s.y,w:s.w,num:i+1,label:i<4?SW_STEPS_NIGHT[i]:"Call the agent",state:i<3?2:i===3?(fail?3:1):4,a:i<4?1:ag_in(tt,P.calls-0.2,0.4),k:i<4?null:ag_spr(tt,P.calls-0.2,0.8)})),{p:1});
      const a=sw_pop(tt,P.n1-0.3,null),b=sw_pop(tt,P.n2-0.2,null);
      sw_num(x,260,540,520,"The count","18,426",null,{k:a.k,a:a.a,edge:AG.amber});sw_num(x,840,540,520,"The census report","18,412",null,{k:b.k,a:b.a});}},
    // the agent loads the skill and checks the causes met so far, one by one: none fits; it finds the records behind the difference
    {at:P.loads-0.4,place:"swNight",cut:true,keys:[[P.loads-0.4,960,540,1.0],[P.loads-0.3,960,536,1.02]],d:15,push:0.006,draw:(x,tt)=>sw_finds(x,tt,P)},
    // in its sandbox, a draft report, and a question: are these students?
    {at:P.drafts-0.4,place:"swNight",cut:true,keys:[[P.drafts-0.4,960,540,1.0],[P.drafts-0.3,960,536,1.02]],d:8,push:0.006,draw:(x,tt)=>{
      sw_model(x,470,420,64,{t:tt,core:1,think:0.5});ag_sandbox(x,1120,780,1080,{depth:96});sw_night(x);ag_model(x,470,420,64,{only:"light",t:tt,core:1,think:0.5});
      const p=sw_pop(tt,P.report-0.3,null),L=[{k:"h2",t:"Why the count is 14 over"},{k:"p",t:"Cause: 14 records, all made last week, all dated back to February.",a:ag_in(tt,P.cause-0.2,0.4)},
        {k:"p",t:"Query: the one that finds them, attached.",a:ag_in(tt,P.query-0.2,0.4)},{k:"gap"},{k:"h2",t:"Question: are these students?",a:ag_in(tt,P.are-0.3,0.4)}];
      sw_file(x,660,390,920,350,"sandbox/report.md",L,{a:p.a,k:p.k,edge:AG.violet,draft:true});}},
    // in the morning, Mei decides
    {at:P.mei-0.4,place:"lab",dis:0.8,keys:[[P.mei-0.4,960,540,1.0],[P.mei-0.3,950,536,1.02]],d:9,push:0.008,draw:(x,tt)=>{
      ag_person(x,"mei",1500,610,1.0,{t:tt+5,flip:true,gaze:[4,0.2],smile:0.35,nod:0.05*ag_io(tt,P.decides-0.2,P.decides+1.0,0.4),talk:ag_talk(sc,"mei",tt)*0});ag_roomLight(x,1);
      sw_clock(x,1600,110,"22 October · morning",ag_in(tt,P.mei-0.2,0.4));
      const q=sw_pop(tt,P.mei+0.3,null);if(q.a>0.01){const ql=[{k:"h2",t:"Question: are these students?"}];sw_file(x,140,210,760,sw_fileH(x,760,ql),"sandbox/report.md",ql,{a:q.a*0.9,k:q.k,edge:AG.violet,draft:true});}
      const p=sw_pop(tt,P.test-0.4,null);ag_textCard(x,140,500,860,{kick:"Mei Tanaka, registrar's office",title:"They're test records, made to try a new screen.",sub:"Test records never count."},{k:p.k,a:p.a,kickCol:AG.kick,edge:AG.green,tail:{side:"right",at:0.3,px:1360,py:480}});}},
    // Jun adds the cause to the skill, with Mei's answer
    {at:P.adds-0.4,place:"lab",cut:true,keys:[[P.adds-0.4,960,540,1.0],[P.adds-0.3,970,530,1.02]],d:4,push:0.01,draw:(x,tt)=>{
      sw_jun(x,tt,{gaze:[3,0.6],nod:0.05*ag_io(tt,P.adds,P.adds+1.2,0.4),smile:0.3});ag_roomLight(x,1);
      ag_T(x,"skills/reconcile-and-diff/SKILL.md · Causes met so far",1290,180,{w:500,size:28,f:"mono",col:AG.blue,align:"center"});
      for(let i=0;i<3;i++)sw_row(x,860,216+i*94,860,SW_CAUSES[i].title,{a:0.8});
      const n=sw_pop(tt,P.adds+0.1,null);sw_cause(x,860,512,860,SW_CAUSES[3],{a:n.a,k:n.k,edge:AG.blue,parts:1+ag_in(tt,P.answer-0.2,0.4)*2});}},
    // and turns the rule into one more fixed step, with a test; Noor approves it before it runs
    {at:P.rule-0.4,place:"lab",cut:true,keys:[[P.rule-0.4,960,540,1.0],[P.rule-0.3,960,536,1.02]],d:11,push:0.006,draw:(x,tt)=>{ag_roomLight(x,1);
      const ins=ag_eo(clamp((tt-P.fixed+0.4)/1.0,0,1)),s4=sw_slots(4,230),s5b=s5;
      const steps=SW_STEPS_NIGHT.map((l,i)=>{const from=s4[i],to=s5b[i===0?0:i+1];return{x:lerp(from.x,to.x,ins),y:230,w:lerp(from.w,to.w,ins),num:i===0?1:Math.round(lerp(i+1,i+2,ins)),label:l,state:0};});
      const nw=s5b[1];steps.splice(1,0,{x:nw.x,y:230,w:nw.w,num:2,label:SW_NEWSTEP,state:0,a:ag_in(tt,P.fixed-0.1,0.4),k:ag_spr(tt,P.fixed-0.1,0.8),test:ag_in(tt,P.withT-0.1,0.4)});
      sw_rail(x,steps,{p:1});const pa=sw_pop(tt,P.noor-0.3,null);
      sw_whole(x,pa.a,c2=>ag_person(c2,"noor",1660,690,0.8,{t:tt,flip:true,gaze:[3,0.3],smile:0.35}));
      ag_textCard(x,780,560,660,{kick:"Noor Rahman, data architect",title:"Approved, before it runs"},{k:pa.k,a:ag_in(tt,P.appr-0.3,0.4),kickCol:AG.kick,edge:AG.green,icon:"tick",tail:{side:"right",at:0.5,px:1530,py:600}});}},
    // the next night: the fourteen are left out by a fixed step; the count matches; no agent called
    {at:P.next-0.4,place:"swNight",dis:0.8,keys:[[P.next-0.4,960,540,1.0],[P.next-0.3,960,536,1.02]],d:8,push:0.006,draw:(x,tt)=>{
      const sa=ag_in(tt,P.noag-0.5,0.5);sw_model(x,1640,690,46,{t:tt,core:0,a:sa});sw_night(x);
      sw_clock(x,1560,110,"Night of 22 October",ag_in(tt,P.next-0.2,0.4));const on=clamp((tt-P.next)/2.4,0,1)*5;
      const labels=[SW_STEPS_NIGHT[0],SW_NEWSTEP].concat(SW_STEPS_NIGHT.slice(1));
      sw_rail(x,s5.map((s,i)=>({x:s.x,y:s.y,w:s.w,num:i+1,label:labels[i],state:on>i+1?2:on>i?1:0})),{p:1});
      ag_pill(x,s5[1].x+s5[1].w/2,410,"14 left out",{col:AG.green,icon:"tick",a:ag_in(tt,P.leaves,0.4),size:28});
      ag_verdict(x,960,560,"18,412 · matches the census report","pass",ag_in(tt,P.next+2.6,0.4));
      ag_pill(x,1640,800,"no agent called",{a:sa,size:28});}}];
  sw_shots(ctx,S,t,sc.dur,shots);sw_kick(ctx,S,sw_kickA(t),true);});
// the agent at work on the night: the skill's causes checked one by one, none fits; then a read-only query, the records it finds
function sw_finds(x,tt,P){const ax=520,ay=520,fa=ag_in(tt,P.finds-0.3,0.5),u=ag_eo(clamp((tt-P.finds)/0.9,0,1)),d=tt>P.finds+0.9?((tt-P.finds-0.9)*0.5)%1:0;
  sw_model(x,ax,ay,66,{t:tt,core:1,think:0.6});
  // the query tool: read only; the hand reaches it, and the records come back
  if(fa>0.01){ag_tool(x,1300,170,440,130,"Query",{a:fa,touch:ag_in(tt,P.finds+0.6,0.4)});ag_reach(x,[ax+60,ay-30,760,320,1060,240,1290,236],u,{grip:u>0.95?1:0,data:tt<P.feb+1.5?d:0});}
  sw_night(x);ag_model(x,ax,ay,66,{only:"light",t:tt,core:1,think:0.6});
  const ca=ag_io(tt,P.loads-0.2,P.finds-0.2,0.4),sk=sw_pop(tt,P.skill-0.3,null);
  if(ca>0.01){x.save();x.globalAlpha*=ca;sw_slim(x,760,140,1040,SW_SKILLS[SW_RECON][0],SW_SKILLS[SW_RECON][1],{a:sk.a,k:sk.k,lit:1});
    for(let i=0;i<3;i++){const p=sw_pop(tt,P.checks+i*0.3,null),y=290+i*150,b=ag_textCard(x,760,y,1040,{title:SW_CAUSES[i].title,sub:"Shows: "+SW_CAUSES[i].shows},{k:p.k,a:p.a});
      sw_mark(x,b.x+b.w-48,b.y+48,"no",ag_in(tt,P.one+i*0.55,0.3));}
    x.restore();ag_verdict(x,1280,790,"None fits","fail",ag_io(tt,P.none-0.2,P.finds-0.2,0.4));}
  if(fa>0.01){const r=sw_pop(tt,P.fourteen-0.2,null);ag_textCard(x,860,500,760,{kick:"Behind the difference",title:"14 records",sub:tt>P.week-0.2?(tt>P.feb-0.3?"all made last week, all dated back to February":"all made last week"):null},{k:r.k,a:r.a,kickCol:AG.orange,edge:AG.orange});}}

// ---- 7 · Solve it once: al-Khwarizmi's steps followed for centuries; a skill, a router, a workflow; the agent only where thinking is
// needed, and a person decides; each new case written down; solve it once, write it down, reuse it ----
scene("close",(ctx,S,t,sc)=>{const c=sc.cues,P=sw_once(sc,"P",()=>({
    once1:wAt(sc,"baghdad","once"),wrote:wAt(sc,"baghdad","wrote it down"),followed:wAt(sc,"baghdad","followed"),
    uni:c.uni,skillW:wAt(sc,"uni","a skill"),router:wAt(sc,"uni","A router"),wf:wAt(sc,"uni","A workflow"),night:wAt(sc,"uni","every night"),
    agent:c.agent,thinking:wAt(sc,"agent","thinking"),decides:wAt(sc,"agent","a person decides"),
    neu:c.new,written:wAt(sc,"new","written down"),never:wAt(sc,"new","never solved"),
    once:c.once,write:wAt(sc,"once","write it down"),reuse:wAt(sc,"once","reuse it")}));
  const shots=[
    // al-Khwarizmi, his book in his hand; his steps followed for centuries
    {at:0,place:"swStudy",keys:[[0,900,560,1.0],[0.1,910,550,1.04]],d:9,push:0.01,draw:(x,tt)=>{
      ag_person(x,SW_FOLK.scholar,700,650,1.0,{t:tt,pose:"hold",gaze:[3,0],holdBack:(c2,h)=>sw_codex(c2,h.near[0]-34,h.near[1]-112,128,160,[118,70,50])});ag_roomLight(x,0.4);
      const p=sw_pop(tt,P.followed-0.3,null);ag_textCard(x,1060,300,640,{kick:"His steps",title:"followed for centuries"},{k:p.k,a:p.a,kickCol:SW_PAL.tag});}},
    // at the university: a skill, a router, a workflow
    {at:P.uni-0.4,place:"lab",dis:0.8,keys:[[P.uni-0.4,960,540,1.0],[P.uni-0.3,960,536,1.02]],d:10,push:0.006,draw:(x,tt)=>{ag_roomLight(x,1);
      [["Done once by hand","A skill",P.skillW],["Finds it","A router",P.router],["Runs what's known","A workflow",P.wf]].forEach(([k,ti,w],i)=>{const p=sw_pop(tt,w-0.2,null);
        ag_textCard(x,160+i*560,300,480,{kick:k,title:ti},{k:p.k,a:p.a,kickCol:AG.blue,edge:AG.blue});});
      sw_clock(x,960,560,"the same way every night",ag_in(tt,P.night-0.3,0.4));}},
    // the agent called only where thinking is needed, and a person decides; each new case written down
    {at:P.agent-0.4,place:"lab",cut:true,keys:[[P.agent-0.4,960,540,1.0],[P.agent-0.3,960,536,1.02]],d:10,push:0.006,draw:(x,tt)=>{ag_roomLight(x,1);
      const s5=sw_slots(5,200),labels=[SW_STEPS_NIGHT[0],SW_NEWSTEP].concat(SW_STEPS_NIGHT.slice(1)),ra=ag_io(tt,P.agent-0.3,P.neu-0.3,0.4);
      if(ra>0.01){x.save();x.globalAlpha*=ra;sw_rail(x,s5.map((s,i)=>({x:s.x,y:s.y,w:s.w,num:i+1,label:labels[i],state:2})),{p:1});
        const g=s5[4],th=ag_in(tt,P.thinking-0.3,0.4);x.save();x.globalAlpha*=th;x.strokeStyle=rgba(AG.violet,0.7);x.lineWidth=3;x.setLineDash([9,9]);x.beginPath();x.moveTo(g.x+g.w/2,330);x.lineTo(g.x+g.w/2,470);x.stroke();x.restore();
        sw_model(x,g.x+g.w/2,530,48,{t:tt,core:th,think:th*0.6,a:th});ag_pill(x,1120,540,"only where thinking is needed",{a:th,size:28});
        ag_verdict(x,1120,640,"a person decides","pass",ag_in(tt,P.decides-0.2,0.4));x.restore();}
      const na=ag_in(tt,P.neu-0.3,0.5);if(na>0.01){ag_T(x,"skills/reconcile-and-diff/SKILL.md · Causes met so far",960,180,{w:500,size:28,f:"mono",col:AG.blue,align:"center",a:na});
        for(let i=0;i<4;i++)sw_row(x,480,220+i*96,960,SW_CAUSES[i].title,{a:na});
        const n=sw_pop(tt,P.written-0.3,null);if(n.a>0.01){const b=sw_row(x,480,604,960,"The next new case",{k:n.k,a:n.a*na});sw_dash(x,b.x,b.y,b.w,b.h,AG.blue,n.a*na*(1-ag_in(tt,P.never,0.5)));}}}},
    // solve it once, write it down, reuse it: the skill, and every agent reading it
    {at:P.once-0.4,place:"lab",cut:true,keys:[[P.once-0.4,960,540,1.0],[P.once-0.3,960,536,1.03]],d:8,push:0.008,draw:(x,tt)=>{ag_roomLight(x,1);
      const k=ag_spr(tt,P.once-0.3,0.8),fa=ag_in(tt,P.once-0.3,0.5)*(1-ag_in(tt,sc.cues.breath-0.3,0.8));sw_file(x,460,170,1000,330,"skills/reconcile-and-diff/SKILL.md",SW_FRONT,{a:fa,k,edge:AG.blue});
      const ev=ag_in(tt,P.reuse-0.2,0.5)*(1-ag_in(tt,sc.cues.breath-0.3,0.8));[[560,720],[960,760],[1360,720]].forEach(([mx,my],i)=>{const a=ev*ag_in(tt,P.reuse-0.2+i*0.2,0.4);if(a<=0.01)return;
        x.save();x.globalAlpha*=a;x.strokeStyle=rgba(AG.blue,0.5);x.lineWidth=3;x.setLineDash([8,8]);x.beginPath();x.moveTo(960,500);x.lineTo(mx,my-48);x.stroke();x.restore();sw_model(x,mx,my,44,{t:tt+i,core:0.8,a});});}}];
  const i=sw_shots(ctx,S,t,sc.dur,shots);
  sw_place(ctx,S,"Baghdad · about 820",ag_io(t,0.4,P.uni-0.4,0.5),0);sw_place(ctx,S,"Today",ag_io(t,P.uni,c.breath,0.5),0);
  ag_end(ctx,S,t,c.breath,SW_TITLE,"Solve it once, write it down, reuse it.","Film 2 of 9","Agents at work on data");});

// the skill chapter opens in the same lab the last one ends in: it comes in on a cut
ag_cutInto(["skill"]);
