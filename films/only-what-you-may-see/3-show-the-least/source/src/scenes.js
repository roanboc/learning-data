/* ===== Show the least: the chapters =====
   Each chapter is a few shots (ag_shots). Times inside a chapter come from its cues (when each line starts) and the words of its lines
   (wAt), so the pictures stay with the voice if it's recorded again. In one room the camera glides on and only what changes fades:
   in the polling room of 1856 the people stay where they are while the booth and the box come in, and the count is a later moment
   (later:true); in the hall, Samuel's record keeps its place on the left from chapter to chapter, each value changing in its cell,
   and the way in use on the right. Between rooms the picture dissolves: 1856 to the hall, the hall to 1872 and back, the count of
   1856 at the end of chapter 5. Words on screen are on glass, at least 28 px as seen, and above the captions (y 890). */

/* ---------------------------------------------------------------- the people of 1856, as the story moves them */
// the official's reach as he hands over the paper, and the voter's as he takes it: hand-held poses, blended in from arms down
const SL_REACH={near:[55,105,"hold"]},SL_TAKE={near:[45,115,"hold"]},SL_HOLD={near:[10,128,"hold"]};
// a figure point of a person at X, Y, size s (flip: facing left), in the frame
const sl_frame=(X,Y,s,flip,f)=>[X+(flip?-1:1)*(f[0]-AG_FIG.anchor[0])*s,Y+(f[1]-AG_FIG.anchor[1])*s];
// the paper is held between the thumb and the fingers: its middle a little beyond the fist, on the thumb's side, from the elbow and the
// wrist (figure space); drawn under the hand (holdBack), so the fingers close over it. Where it is in the frame for a person in a pose,
// and how far a person's breathing has moved them down at t (people.js: 2.2 figure units at their own pace)
const sl_gripOf=(E,Wr)=>{const dx=Wr[0]-E[0],dy=Wr[1]-E[1],l=Math.hypot(dx,dy)||1,u0=dx/l,u1=dy/l;return[Wr[0]+u0*66+u1*30,Wr[1]+u1*66-u0*30];};
const sl_gripAt=(X,Y,s,flip,pose)=>{const j=ag_joints(AG_FIG.shoulder.near,pose.near);return sl_frame(X,Y,s,flip,sl_gripOf(j.E,j.Wr));};
const sl_breath=(who,t)=>Math.sin(t*TAU*SL_CAST[who].breath)*2.2;
// the official, behind his desk: everything of him below its back edge is hidden, his arm as it moves too (people.js hides only the
// hanging arms), so his hand comes up from behind the desk with the paper and goes back down behind it
function sl_official(x,t,o){o=o||{};const [X,Y,s]=SL_R.official;x.save();x.beginPath();x.rect(-W,-H,3*W,H+SL_R.desk[2]+2);x.clip();
  dp_person(x,SL_CAST.official,X,Y,s,{t,light:SL_LAMP,cut:SL_R.desk[2]+2,nod:o.nod||0,gaze:o.gaze||[3,1],pose:"hang",pose2:SL_REACH,mix:o.reach||0,holdBack:o.hold});x.restore();}
function sl_voter(x,t,o){o=o||{};const [X0,Y,s]=SL_R.voter;
  return dp_person(x,SL_CAST.voter,o.x==null?X0:o.x,Y,s,{t,light:SL_LAMP,flip:true,nod:o.nod||0,gaze:o.gaze||[2,0],talk:o.talk||0,pose:o.pose||"hang",pose2:o.pose2,mix:o.mix||0,holdBack:o.hold});}
// those who could learn his vote, behind the rail (cut at its top), each faded in and out as a whole picture (a: [candidate, landlord,
// employer])
function sl_watchers(x,t,a){SL_R.watchers.forEach(([k,X,s],i)=>{const al=a[i];if(al<=0)return;withA(x,al,()=>dp_person(x,SL_CAST[k],X,sl_eyeY(s),s,{t,light:SL_LAMP,flip:true,gaze:[2,0],cut:SL_R.rail[1]-6}));});}
// the official's tick by the voter's name on the roll, drawn on by u
function sl_tick(x,u){if(u<=0)return;const [rx,ry]=SL_R.roll;x.save();x.translate(rx,ry);x.strokeStyle="rgba(40,28,20,0.95)";x.lineWidth=2.8;x.lineCap="round";x.lineJoin="round";
  x.beginPath();x.moveTo(186,-20);if(u<0.4)x.lineTo(186+5*u/0.4,-20+5*u/0.4);else{x.lineTo(191,-15);x.lineTo(191+12*(u-0.4)/0.6,-15-14*(u-0.4)/0.6);}x.stroke();x.restore();}
// a small pile of printed papers on the desk, by the official's hand
function sl_blanks(x){for(let i=0;i<5;i++){x.fillStyle=i%2?"rgb(226,216,190)":"rgb(236,228,204)";x.fillRect(724+(i%2)*2,SL_R.desk[2]+12-i*3,58,10);}}
// a tag over a person of 1856: a label of glass, a line of light down to the top of their head
function sl_headTag(x,i,text,tx,ty,a,p){const [,X,s]=SL_R.watchers[i];dp_tag(x,tx,ty,text,"cyan",{a,p,to:[X-4*s,sl_eyeY(s)-296*s+10],behind:"slRoom"});}

/* ---------------------------------------------------------------- Samuel's record, in the hall */
const SL_RECAT=[80,120,980];
const SL_VAL={num:{s:"S-20412",mono:true},name:{s:"Samuel Osei"},email:{s:"samuel.osei@mail.example"},dob:{s:"14 May 1987"},course:{s:"Public health"},res:{s:"90 of 120"},
  star:{s:"***",col:"violet"},scr:{s:"e69dec44…",col:"violet",mono:true},code:{s:"a7772705…",col:"violet",mono:true},year:{s:"1987"},token:{s:"TKN-0381",col:"violet",mono:true}};
const SL_ROWK=[["num","Student number","direct"],["name","Name","direct"],["email","Email","direct"],["dob","Date of birth","indirect"],["course","Course","none"],["res","Results","none"]];
// the rows at t: o[key] = {v: value steps, chip: chip steps, label: [[t, new label]], lit: t => 0..1}; o.chipA fades every chip
function sl_samRows(t,o){o=o||{};return SL_ROWK.map(([k,label,cls])=>{const q=o[k]||{},row=Object.assign({label},sl_steps(t,q.v||[[0,SL_VAL[k]]],q.d),q.chip?sl_chipSteps(t,q.chip):{chip:cls});
  if(q.label){const L=sl_steps(t,[[0,{s:label}]].concat(q.label.map(([lt,s])=>[lt,{s}])));row.label=L.v;if(L.v2!=null){row.label2=L.v2;row.lu=L.u;}}
  row.chipA=o.chipA==null?1:o.chipA;row.lit=q.lit?q.lit(t):0;return row;});}
function sl_rec(x,t,o){const [rx,ry,rw]=SL_RECAT;return sl_record(x,rx,ry,sl_samRows(t,Object.assign({},o.rows,{chipA:o.chipA})),Object.assign({w:rw},o));}
// where a row's value is, and its right edge, on the record
const sl_recRow=i=>[SL_RECAT[0]+290,SL_RECAT[1]+138+i*SL_RW-10],sl_recEnd=i=>[SL_RECAT[0]+SL_RECAT[2],SL_RECAT[1]+138+i*SL_RW-10];
// the support table, under the record
const SL_SUPAT=[80,630,980];
const sl_sup=(x,o)=>sl_support(x,SL_SUPAT[0],SL_SUPAT[1],SL_SUPAT[2],o);
// a light that comes and goes: in at a, out at b
const sl_lit=(a,b)=>t=>ag_io(t,a,b,0.4);

// ---- 1 · The roll and the box: Victoria, 1856: a vote said out loud, then a secret ballot; the roll says who, the box says how;
//          today Anil's study, Samuel's record as kept, and what the study needs: follow each learner, never see who ----
scene("ballot",(ctx,S,t,sc)=>{const c=sc.cues,P=sl_once(sc,"P",()=>{const P={
    said:wAt(sc,"aloud","said"),emp:wAt(sc,"aloud","employer"),land:wAt(sc,"aloud","landlord"),cand:wAt(sc,"aloud","candidate"),
    job:wAt(sc,"cost","job"),home:wAt(sc,"cost","home"),dare:wAt(sc,"dare","dare"),
    act:wAt(sc,"passed","secret ballot"),marked:wAt(sc,"roll","marked"),handed:wAt(sc,"roll","handed"),
    crossed:wAt(sc,"alone","crossed out"),folded:wAt(sc,"alone","folded"),put:wAt(sc,"alone","put it"),box:wAt(sc,"alone","box"),
    nobody:wAt(sc,"free","nobody could see"),how:wAt(sc,"who","The box"),
    names:wAt(sc,"kept","names"),bdays:wAt(sc,"kept","birthdays"),dis:wAt(sc,"kept","disability"),
    hide:wAt(sc,"all","Hide it all"),picks:wAt(sc,"mei","picks"),never:wAt(sc,"follows","never sees")};
    // the hand-over: the official's hand comes up from behind the desk with a paper and holds it out; the voter's hand takes it; the
    // official lets go and his hand goes back down; the voter draws it in
    P.give0=P.handed-0.4;P.take0=P.handed-0.1;P.pass0=P.handed+0.35;P.free0=P.pass0+0.3;P.draw0=P.handed+1.0;
    // into the booth and out: he steps across to it, the curtain closes, the paper (close) is struck and folded, the curtain opens,
    // he steps back, and the folded paper goes into the box's slot
    P.in0=c.alone+0.1;P.in1=P.in0+1.0;P.shut0=P.in1-0.15;P.ins0=P.shut0+0.3;P.fold0=Math.max(P.folded,P.ins0+1.55);P.ins1=P.fold0+0.8;P.open0=P.ins1-0.1;P.out0=P.open0+0.2;P.out1=P.out0+0.9;
    P.drop0=P.out1+0.05;P.down0=P.drop0+0.55;
    // where the paper is held out, in the frame, as the official holds it there (his breathing included)
    P.A=sl_gripAt(...SL_R.official,false,SL_REACH);P.A[1]+=sl_breath("official",P.pass0)*SL_R.official[2];return P;});
  // the voter's arm, from down to taking the paper, to holding it, to down again once it's in the box
  const vpose=tt=>tt<P.take0?{}:tt<P.draw0?{pose:"hang",pose2:SL_TAKE,mix:ag_sine((tt-P.take0)/0.45)}:tt<P.down0?{pose:SL_TAKE,pose2:SL_HOLD,mix:ag_sine((tt-P.draw0)/0.5)}
    :tt<P.down0+0.5?{pose:SL_HOLD,pose2:"hang",mix:ag_sine((tt-P.down0)/0.5)}:{};
  const reach=tt=>ag_in(tt,P.give0,0.5)*(1-ag_in(tt,P.pass0+0.1,0.45));
  const vx=tt=>tt<P.out0?lerp(SL_R.voter[0],SL_R.inBooth,ag_sine((tt-P.in0)/(P.in1-P.in0))):lerp(SL_R.inBooth,SL_R.voter[0],ag_sine((tt-P.out0)/(P.out1-P.out0)));
  const fold=tt=>tt>P.ins1?1:0;
  // the people of the room at tt, the same in every shot of it: the official, the voter, and his paper wherever it is
  // the paper's way, one paper in one place at a time, always under the fingers that hold it: in the official's hand; held out at P.A
  // while the voter's hand takes it (drawn with the official, so both hands are over it); once the official's hand has left it, with
  // the voter, sliding from P.A into his grip as he draws it in (in the frame, growing to his size); in his hand into the booth and out,
  // folded; at the box it slips down out of his fingers into the slot (the box, drawn over him, hides it as it goes in)
  const pk=tt=>lerp(SL_R.official[2],SL_R.voter[2],ag_sine((tt-P.pass0)/(P.draw0+0.5-P.pass0)));
  const room=(x,tt,o)=>{o=o||{};const vp=vpose(tt),r=reach(tt),M=x.getTransform(),
    held=(cc,p,k,fold,dy)=>{cc.save();cc.setTransform(M);cc.translate(p[0],p[1]+(dy||0));cc.scale(k,k);sl_held(cc,0,0,fold);cc.restore();},
    toFrame=(cc,p)=>{const q=M.inverse().multiply(cc.getTransform()).transformPoint(new DOMPoint(p[0],p[1]));return[q.x,q.y];};
    sl_official(x,tt,{nod:0.07*ag_io(tt,P.marked-0.5,P.marked+0.9,0.35),reach:r,hold:(cc,h)=>{
      if(tt>=P.give0&&tt<P.pass0)sl_held(cc,...sl_gripOf(h.nearElbow,h.near),0);else if(tt>=P.pass0&&tt<P.free0)held(cc,P.A,pk(tt),0);}});
    const voter=xx=>sl_voter(xx,tt,Object.assign({x:vx(tt),talk:(0.4+0.4*Math.sin(tt*13.7))*ag_io(tt,P.said,P.said+1.5,0.15),
      nod:0.07*ag_io(tt,P.dare,c.passed+0.3,0.5),hold:(cc,h)=>{if(tt<P.free0||tt>=P.drop0+0.45)return;const g=sl_gripOf(h.nearElbow,h.near);
        if(tt<P.draw0+0.5){const e=ag_sine((tt-P.draw0)/0.5),gv=toFrame(cc,g);held(cc,[lerp(P.A[0],gv[0],e),lerp(P.A[1],gv[1],e)],pk(tt),0);}
        else{const u=clamp((tt-P.drop0)/0.45,0,1);sl_held(cc,g[0],g[1]+120*u*u,fold(tt));}}},vp));
    if(o.booth)sl_booth(x,1-ag_in(tt,P.shut0,0.6)+ag_in(tt,P.open0,0.5),voter);else voter(x);
    if(o.box)sl_box(x,...SL_R.box);};
  const mid=SL_R.voter[0];
  ag_shots(ctx,S,t,sc.dur,[
    // Victoria, 1856: the room at dusk; a man says his vote out loud, and anyone can learn it; a vote against them could cost him
    {at:0,place:"slRoom",keys:[[0,960,560,1],[c.aloud,1000,540,1.04]],d:2.4,draw:(x,tt)=>{
      sl_watchers(x,tt,[0,1,2].map(i=>{const tin=[P.cand,P.land,P.emp][i];return ag_in(tt,tin-0.4,0.5)*(1-ag_in(tt,c.passed-0.4+i*0.2,0.5));}));
      room(x,tt);
      sl_where(x,"Opening story","Victoria, 1856",ag_io(tt,0.8,c.aloud+1.2,0.6));
      dp_slip(x,mid,166,"His vote, out loud","coral",{align:"center",ink:true,a:ag_io(tt,P.said-0.1,c.cost-0.1,0.4),behind:"slRoom"});
      const tg=tt0=>ag_in(tt,tt0-0.2,0.4)*(1-ag_in(tt,c.passed-0.45,0.4));
      sl_headTag(x,2,"his employer",1240,196,tg(P.emp),ag_in(tt,P.emp,0.5));
      sl_headTag(x,1,"his landlord",1490,108,tg(P.land),ag_in(tt,P.land,0.5));
      sl_headTag(x,0,"a candidate",1680,196,tg(P.cand),ag_in(tt,P.cand,0.5));
      const pa=tt0=>ag_in(tt,tt0-0.25,0.4)*(1-ag_in(tt,c.passed-0.5,0.4));
      dp_pill(x,mid-28,240,"his job","coral",{align:"right",a:pa(P.job)});dp_pill(x,mid-4,240,"his home","coral",{a:pa(P.home)});
      // the Act: a card where the watchers stood, once they've gone
      const ka=ag_io(tt,c.passed+0.5,c.roll-0.75,0.4);if(ka>0)dp_card(x,1300,170,560,{kick:"March 1856",title:"A secret ballot",sub:"Worked out by Henry Chapman, one of the colony's lawmakers"},{a:ka,k:ag_spr(tt,c.passed+0.5,0.6),behind:"slRoom"});}},
    // the Act at work: the booth and the box come in; the official marks the voter off the roll and hands him a paper; alone behind
    // the curtain he crosses out the names he doesn't want and folds it; back at the box, it goes in
    {at:c.roll-0.45,place:"slBallot",keys:[[c.roll-0.45,960,560,1]],d:1.8,dis:0.8,draw:(x,tt)=>{
      sl_blanks(x);sl_tick(x,clamp((tt-P.marked-0.1)/0.5,0,1));room(x,tt,{booth:true,box:true});
      // behind the curtain, close: the paper, three names struck one after another, then folded
      const ia=ag_io(tt,P.ins0,P.ins1,0.35);if(ia>0){withA(x,ia,()=>{dp_panel(x,1290,104,566,560,{col:"cyan",r:20,behind:"slBallotDrawn"});
        dp_T(x,"BEHIND THE CURTAIN",1320,152,{w:800,size:28,ls:4,col:"cyan"});
        const s0=P.ins0+0.35;sl_paper(x,1573,410,300,{struck:[ag_in(tt,s0,0.3),0,ag_in(tt,s0+0.4,0.3),ag_in(tt,s0+0.8,0.3)],fold:clamp((tt-P.fold0)/0.5,0,1)});});}}},
    // at the end, the count: the papers in piles, the totals on the board; free to vote as he wished; Britain, then America; the roll
    // says who, the box says how
    {at:c.count-0.1,place:"slCount",later:true,dis:0.6,keys:[[c.count-0.1,960,560,1]],d:1.8,draw:(x,tt)=>{
      sl_box(x,...SL_R.box,{open:true});
      const fa=ag_io(tt,c.free+0.3,c.spread-0.3,0.4);if(fa>0)dp_card(x,1260,140,600,{kick:"Now",title:"Free to vote as he wished",sub:"Nobody could see his vote, so nobody could punish him for it"},{col:"green",a:fa,k:ag_spr(tt,c.free+0.3,0.6),behind:"slCount"});
      const sa=ag_io(tt,c.spread+0.3,c.who-0.3,0.4);if(sa>0)dp_card(x,1260,140,600,{kick:"The Australian ballot",title:"Britain, 1872",sub:"38 American states, by 1892"},{a:sa,k:ag_spr(tt,c.spread+0.3,0.6),behind:"slCount"});
      const ra=ag_in(tt,c.who+0.2,0.4),ba=ag_in(tt,P.how,0.4);
      if(ra>0){const bb=dp_card(x,110,500,540,{title:"The roll",sub:"Who voted, nothing about how"},{a:ra,k:ag_spr(tt,c.who+0.2,0.6),behind:"slCount"});dp_link(x,[bb.x+bb.w*0.7,bb.y+bb.h],[SL_R.roll[0]+150,SL_R.roll[1]-30],"cyan",ag_in(tt,c.who+0.6,0.5));}
      if(ba>0){const bb=dp_card(x,1100,520,500,{title:"The box",sub:"How, nothing about who"},{col:"violet",a:ba,k:ag_spr(tt,P.how,0.6),behind:"slCount"});dp_link(x,[bb.x+60,bb.y+bb.h],[SL_R.box[0]+SL_R.box[2]-20,SL_R.box[1]+30],"violet",ag_in(tt,P.how+0.4,0.5));}}},
    // today: Anil's study in the Faculty of Health; the records as kept would show him far more; hide it all and nothing can be
    // followed; Mei picks a way for each column; the study follows 2,614 learners and never sees who
    {at:c.today-0.3,place:"slHall",keys:[[c.today-0.3,960,540,1]],d:1.8,draw:(x,tt)=>{
      const ea=1-ag_in(tt,c.breath-0.2,0.6);  // the cards leave as the title comes in, so no words sit under its veil
      dp_person(x,"anil",1390,600,1.0,{t:tt,flip:true});
      const ma=ag_in(tt,c.mei+0.3,0.7);if(ma>0)withA(x,ma,()=>dp_person(x,"mei",1740+(1-ag_eo(ma))*60,600,1.0,{t:tt,flip:true}));
      sl_where(x,"Today","At the university",ag_io(tt,c.today+0.3,c.kept-0.5,0.5));
      dp_tag(x,1150,150,"Anil Kurian","cyan",{a:ag_io(tt,c.today+0.6,c.kept,0.4),to:[1386,300],p:ag_in(tt,c.today+0.9,0.5)});
      const sa=ag_io(tt,c.today+1.2,c.kept-0.2,0.4);if(sa>0)dp_card(x,80,250,920,{kick:"A study",title:"How learners in the Faculty of Health progress"},{a:sa,k:ag_spr(tt,c.today+1.2,0.6)});
      // the record as kept, its rows lit as they're named; all of it hidden, then shown again; then as the study sees it
      const ra=ea*ag_in(tt,c.kept+0.1,0.4);if(ra>0){const st=P.never-0.6,hid=[0,1,2,3].map(i=>[[0,SL_VAL[["num","name","email","dob"][i]]],[P.hide+0.2+i*0.12,SL_VAL.star],[c.mei+0.2+i*0.12,SL_VAL[["num","name","email","dob"][i]]]]);
        const rows={num:{v:hid[0].concat([[st,SL_VAL.code]])},name:{v:hid[1].concat([[st+0.15,SL_VAL.star]]),lit:sl_lit(P.names-0.2,P.bdays-0.2)},email:{v:hid[2].concat([[st+0.3,SL_VAL.star]])},
          dob:{v:hid[3].concat([[st+0.45,SL_VAL.year]]),lit:sl_lit(P.bdays-0.2,P.dis-0.2)},course:{v:[[0,SL_VAL.course],[P.hide+0.68,SL_VAL.star],[c.mei+0.68,SL_VAL.course]]},
          res:{v:[[0,SL_VAL.res],[P.hide+0.8,SL_VAL.star],[c.mei+0.8,SL_VAL.res]]}};
        sl_rec(x,tt,{rows,chipA:0,title:"Learner records, as kept",title2:"What the study sees",tu:(tt-st)/0.8,a:ra,k:ag_spr(tt,c.kept+0.1,0.6)});}
      const pa=ea*ag_in(tt,P.dis-0.4,0.4);if(pa>0){const lit=ag_io(tt,P.dis-0.2,c.all,0.4);withA(x,pa,()=>{const bb=sl_sup(x,{chip:false,closed:ag_in(tt,P.never,0.6)});
        if(lit>0){x.save();x.globalAlpha*=lit;rr(x,bb.x-4,bb.y-4,bb.w+8,bb.h+8,24);x.strokeStyle=rgba(DP.F.cyan,0.9);x.lineWidth=3;x.stroke();x.restore();}});}
      dp_slip(x,1120,150,"The study can't follow anyone","coral",{ink:true,a:ag_io(tt,P.hide+0.6,c.mei-0.1,0.4)});
      dp_tag(x,1290,150,"Mei Tanaka · owns the records","cyan",{a:ag_io(tt,c.mei+0.8,c.follows-0.2,0.4),to:[1736,300],p:ag_in(tt,c.mei+1.1,0.5)});
      dp_slip(x,1120,150,"2,614 learners, year by year","green",{ink:true,a:ea*ag_in(tt,c.follows+0.6,0.4)});
      dp_title(x,S,tt,c.breath,"Show the least","The ways to hide a value","FILM 3 OF 8 · ONLY WHAT YOU MAY SEE");}}
  ],0.6);});

// ---- 2 · Three questions: the agreement's lines, the class of each column, nine ways and the three questions that tell them apart ----
scene("questions",(ctx,S,t,sc)=>{const c=sc.cues,P=sl_once(sc,"P",()=>({
    direct:wAt(sc,"class","direct"),indirect:wAt(sc,"class","indirect"),special:wAt(sc,"class","special"),none:wAt(sc,"class","none"),
    nine:wAt(sc,"nine","There are nine")}));
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"slHall",later:true,keys:[[0,960,540,1]],d:1.8,draw:(x,tt)=>{
      const aa=1-ag_in(tt,c.class-0.4,0.4);if(aa>0)sl_agree(x,80,130,1000,["May have","Never"],{a:aa,lit:{"May have":ag_io(tt,c.may+0.4,c.never,0.5),"Never":ag_in(tt,c.never+0.2,0.5)},dim:0.7,from:"From An agreement first"});
      // each column's class, as its owner set it: the chips come in as each class is named
      const ra=ag_in(tt,c.class,0.4)*(1-ag_in(tt,P.nine-0.5,0.4));if(ra>0){const ch=i=>ag_in(tt,[P.direct,P.direct+0.15,P.direct+0.3,P.indirect,P.none,P.none+0.15][i]-0.1,0.4);
        withA(x,ra,()=>{const [rx,ry,rw]=SL_RECAT,rows=sl_samRows(tt).map((r,i)=>Object.assign(r,{chipA:ch(i)}));sl_record(x,rx,ry,rows,{w:rw,title:"Learner records, as kept",level:"confidential",levelA:ag_in(tt,c.class+0.6,0.4),k:ag_spr(tt,c.class,0.6)});
          sl_sup(x,{chipA:ag_in(tt,P.special-0.1,0.4)});dp_T(x,"Classes from Know what you hold",80,866,{w:600,size:28,col:"mut",a:ag_in(tt,c.class+1.0,0.5)});});}
      // nine ways, and three questions that tell them apart
      sl_tiles(x,80,120,{a:1,p:SL_WAYS.map((n,i)=>clamp((tt-P.nine-0.1-i*0.2)/0.6,0,1))});
      sl_questions(x,460,520,1000,{a:ag_in(tt,c.see-0.4,0.4),p:[ag_in(tt,c.see,0.4),ag_in(tt,c.undo,0.4),ag_in(tt,c.works,0.4)]});}}
  ]);});

// ---- 3 · Ways that can't be undone: leave it out, mask it whole, mask it in part, generalise, and filter rows ----
scene("oneway",(ctx,S,t,sc)=>{const c=sc.cues,P=sl_once(sc,"P",()=>({
    given:wAt(sc,"out","isn't given"),whole:wAt(sc,"names","mask them whole"),stars:wAt(sc,"stars","reads as stars"),
    two:wAt(sc,"part","the last two digits"),first:wAt(sc,"part","the first letter"),gen:wAt(sc,"born","generalise it"),becomes:wAt(sc,"born","becomes"),
    one:wAt(sc,"anon","only one"),only:wAt(sc,"rows","gets only"),filter:wAt(sc,"rows","filter rows")}));
  const rows=tt=>({name:{v:[[0,SL_VAL.name],[P.stars,SL_VAL.star]],lit:sl_lit(c.names+0.3,c.desk)},email:{v:[[0,SL_VAL.email],[P.stars+0.2,SL_VAL.star]],lit:sl_lit(c.names+0.3,c.desk)},
    dob:{v:[[0,SL_VAL.dob],[P.becomes+0.2,SL_VAL.year]],lit:sl_lit(c.born+0.3,c.rows-0.4)}});
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"slHall",later:true,keys:[[0,960,540,1]],d:1.8,draw:(x,tt)=>{
      sl_rec(x,tt,{rows:rows(tt),title:"Learner records, as kept",level:"confidential"});
      const lit=ag_io(tt,c.health+0.3,c.names,0.4);const bb=sl_sup(x,{closed:ag_in(tt,P.given,0.6)});
      if(lit>0){x.save();x.globalAlpha*=lit;rr(x,bb.x-4,bb.y-4,bb.w+8,bb.h+8,24);x.strokeStyle=rgba(DP.F.cyan,0.9);x.lineWidth=3;x.stroke();x.restore();}
      // the agreement says never; then the way in use, on the right
      const aa=ag_io(tt,c.health+0.2,c.out-0.4,0.4);if(aa>0)sl_agree(x,1120,120,720,["Never"],{a:aa,lit:{"Never":ag_in(tt,c.health+0.6,0.5)}});
      sl_wayAt(x,tt,[[c.out+0.2,"Leave it out"],[P.whole,"Mask it whole"],[c.part+0.1,"Mask it in part"],[P.gen,"Generalise"],[P.filter,"Filter rows"]]);
      // the help desk sees a little more: enough to recognise a record
      const ha=ag_io(tt,c.desk+0.4,c.born-0.2,0.4);if(ha>0){const hr=[{label:"Student number",...sl_steps(tt,[[0,SL_VAL.star],[P.two,{s:"S-***12",col:"violet",mono:true}]]),chipA:0},
          {label:"Email",...sl_steps(tt,[[0,SL_VAL.star],[P.first,{s:"s***@mail.example",col:"violet"}]]),chipA:0}];
        sl_record(x,1120,430,hr,{w:720,title:"As the help desk sees it",a:ha,k:ag_spr(tt,c.desk+0.4,0.6)});}
      // in a small course, one year may fit only one learner
      const ca=ag_io(tt,c.anon+0.4,c.stays+0.2,0.4);if(ca>0)sl_course(x,1120,440,{a:ca,k:ag_spr(tt,c.anon+0.4,0.6),ring:clamp((tt-P.one+0.2)/0.8,0,1)});
      // the year's class stays indirect: its chip glows
      const gl=ag_io(tt,c.stays+0.4,c.rows-0.3,0.4);if(gl>0){const [cx,cy]=sl_recEnd(3);x.save();x.globalAlpha*=gl;sl_chip(x,cx-30,cy+10,"indirect",{align:"right",glow:30});x.restore();}
      // filter rows: only the Faculty of Health's learners
      const fa=ag_in(tt,c.rows+0.3,0.4);if(fa>0)sl_rows(x,1120,430,{a:fa,k:ag_spr(tt,c.rows+0.3,0.6),filter:clamp((tt-P.only)/1.6,0,1)});}}
  ]);});

// ---- 4 · Ways that can be undone: a scramble anyone can match, a keyed hash, Britain's numbered papers in 1872, a token, encryption ----
scene("undo",(ctx,S,t,sc)=>{const c=sc.cues,P=sl_once(sc,"P",()=>({
    scr:wAt(sc,"plain","scrambles"),match:wAt(sc,"plain","anyone can match"),secret:wAt(sc,"keyed","secret key"),kh:wAt(sc,"keyed","a keyed hash"),
    whose:wAt(sc,"with","whose code"),sealed:wAt(sc,"with","kept sealed"),
    number:wAt(sc,"n1872","each paper had a number"),matched:wAt(sc,"n1872","matched"),packet:wAt(sc,"n1872","sealed packet"),fraud:wAt(sc,"n1872","trace a fraud"),
    stand:wAt(sc,"token","stand-in"),vault:wAt(sc,"token","in a vault"),takes:wAt(sc,"noone","keyed hash"),
    there:wAt(sc,"lock","all there"),allowed:wAt(sc,"lock","allowed")}));
  // Samuel's record through the chapter: as chapter 3 left it, then its student number scrambled, keyed, its class and name changed;
  // the email a token for a while
  const rows=tt=>({num:{v:[[0,SL_VAL.num],[P.scr,SL_VAL.scr],[P.kh,SL_VAL.code]],chip:[[0,"direct"],[c.still+0.3,"pseudonymous"]],label:[[c.still+0.3,"Learner code"]],
      lit:t2=>ag_io(t2,c.follow+0.4,c.n1872-0.4,0.4)*(1-0.6*ag_io(t2,c.nothing,c.with,0.4))},
    name:{v:[[0,SL_VAL.star]]},email:{v:[[0,SL_VAL.star],[P.stand,SL_VAL.token],[c.noone+0.3,SL_VAL.star]],lit:sl_lit(c.token+0.3,c.noone+0.8)},dob:{v:[[0,SL_VAL.year]]}});
  const hall=(x,tt)=>{sl_rec(x,tt,{rows:rows(tt),title:"Learner records, as kept",level:"confidential"});sl_sup(x,{closed:1});
    // what chapter 3 left on the right leaves
    const la=1-ag_in(tt,c.follow-0.3,0.5);if(la>0){sl_way(x,...SL_WAYAT,"Filter rows",{a:la});sl_rows(x,1120,430,{a:la,filter:1});}
    // the registrar's list: the plain scramble of each number, which anyone with the list can match
    const li=ag_io(tt,c.plain+0.4,c.with-0.3,0.4);if(li>0){const hl=ag_io(tt,P.match,P.kh,0.4),bb=sl_list(x,1120,120,{a:li,k:ag_spr(tt,c.plain+0.4,0.6),hl});
      if(hl>0){x.save();x.globalAlpha*=hl;dp_link(x,[bb.x,bb.y+104+2*46-10],sl_recEnd(0),"coral",ag_in(tt,P.match+0.1,0.5));x.restore();}}
    dp_slip(x,1120,470,"The list matches nothing","grey",{ink:true,a:ag_io(tt,c.nothing+0.3,c.with-0.3,0.4)});
    // the key, sealed, kept apart from the study; with it the registrar's office can find whose code it is
    const ka=ag_io(tt,P.secret-0.2,c.lock-0.2,0.4);if(ka>0){const bb=dp_sealed(x,1120,640,600,"The study's key",{sub:"Kept sealed by the registrar's office",a:ka});
      const la2=ag_io(tt,P.whose,c.n1872-0.4,0.4);if(la2>0){x.save();x.globalAlpha*=la2;dp_link(x,[bb.x,bb.y+bb.h/2],sl_recEnd(0),"violet",ag_in(tt,P.whose,0.6),{dash:[10,8]});x.restore();}}
    sl_wayAt(x,tt,[[c.with+0.3,"Keyed hash"],[c.token+0.4,"Token"],[P.takes,"Keyed hash"],[c.lock+0.2,"Encryption"]]);
    // the token's vault, kept by the registrar's office
    const va=ag_io(tt,P.vault-0.2,c.noone+0.6,0.4);if(va>0)dp_sealed(x,1120,470,600,"The vault",{sub:"Kept by the registrar's office",a:va});
    // encryption: the whole value, unreadable without the key; all there for an allowed reader
    const ea=ag_in(tt,c.lock+0.4,0.4);if(ea>0){withA(x,ea,()=>{dp_panel(x,1120,430,720,250,{col:"violet",r:20});dp_T(x,"Stored, encrypted",1150,484,{w:700,size:34});
      const op=ag_io(tt,P.there,P.allowed+1.6,0.5);dp_T(x,"Samuel Osei",1170,580,{w:600,size:32,a:op});
      dp_frost(x,1150,520,660,96,cc=>{cc.font="600 32px Manrope";cc.fillStyle="#fff";cc.fillText("Samuel Osei",1170,580);},{a:1-op});
      dp_pill(x,1810,664,"An allowed reader","green",{align:"right",a:op});});}};
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"slHall",keys:[[0,960,540,1]],d:1.8,draw:hall},
    // Britain, 1872: a number on the back of each paper, the same number on its counterfoil, the counterfoils sealed in a packet
    {at:c.n1872-0.3,place:"slTable",keys:[[c.n1872-0.3,960,540,1.06],[c.n1872+2,960,540,1]],d:2.4,draw:(x,tt)=>{
      sl_where(x,"Britain, 1872","A number on each paper",ag_in(tt,c.n1872+0.2,0.5));
      sl_1872(x,tt,{paper:ag_in(tt,c.n1872+0.4,0.5),stub:ag_in(tt,P.matched-0.3,0.5),packet:ag_in(tt,P.packet-0.4,0.5),seal:clamp((tt-P.packet)/0.6,0,1)});
      dp_slip(x,360,700,"Opened only to trace a fraud","violet",{ink:true,a:ag_in(tt,P.fraud-0.3,0.4),behind:"slTable"});}},
    {at:c.token-0.3,place:"slHall",keys:[[c.token-0.3,960,540,1]],d:1.8,draw:hall}
  ]);});

// ---- 5 · Totals, small counts hidden: the 4 that would name who left, the total that gives it back, one more hidden ----
scene("totals",(ctx,S,t,sc)=>{const c=sc.cues,P=sl_once(sc,"P",()=>({
    fewer:wAt(sc,"fewer","fewer than ten"),gives:wAt(sc,"back","gives the four back"),nine:wAt(sc,"answer","about nine in ten"),
    sees:wAt(sc,"vote","everyone sees"),nob:wAt(sc,"vote","nobody sees")}));
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"slHall",later:true,keys:[[0,960,540,1]],d:1.8,draw:(x,tt)=>{
      sl_agree(x,80,120,980,["May leave"],{lit:{"May leave":ag_in(tt,c.publish+0.5,0.5)}});
      const ta=ag_in(tt,c.left+0.2,0.4);if(ta>0)sl_totals(x,80,350,{a:ta,k:ag_spr(tt,c.left+0.2,0.6),
        lit:[ag_io(tt,c.back+0.5,c.more+0.5,0.4),ag_io(tt,c.small+0.3,c.back,0.4),ag_io(tt,c.back+0.7,c.more+0.5,0.4),ag_io(tt,c.back+0.9,c.more+0.5,0.4),ag_io(tt,c.back+0.3,c.more+0.5,0.4)],
        u:[0,clamp((tt-P.fewer)/0.8,0,1),0,clamp((tt-c.more-0.3)/0.8,0,1),0],nv:[null,"fewer than 10",null,"hidden",null]});
      dp_slip(x,80,758,"80 − 38 − 21 − 17 = 4","coral",{ink:true,a:ag_io(tt,P.gives-0.6,c.more+0.6,0.4)});
      sl_wayAt(x,tt,[[c.fewer+0.4,"Totals, small counts hidden"]]);
      const na=ag_in(tt,P.nine-0.3,0.4);if(na>0)dp_card(x,1120,440,720,{kick:"The answer",title:"About 9 in 10 first-year learners went on to second year"},{a:na,k:ag_spr(tt,P.nine-0.3,0.6)});}},
    // as in 1856: the totals on the board for everyone, and no vote for anyone
    {at:c.vote-0.3,place:"slCount",keys:[[c.vote-0.3,960,560,1.05],[c.vote+1.5,960,560,1]],d:2.4,draw:(x,tt)=>{
      sl_box(x,...SL_R.box);
      sl_where(x,"Victoria, 1856","The count",ag_in(tt,c.vote+0.2,0.5));
      dp_tag(x,1250,520,"Everyone sees the totals","grey",{a:ag_in(tt,P.sees-0.2,0.4),to:[SL_R.board[0]+SL_R.board[2],SL_R.board[1]+SL_R.board[3]-40],p:ag_in(tt,P.sees,0.5),behind:"slCount"});
      dp_tag(x,1180,650,"Nobody sees a vote","violet",{a:ag_in(tt,P.nob-0.2,0.4),to:[SL_R.box[0]+SL_R.box[2]-10,SL_R.box[1]+20],p:ag_in(tt,P.nob,0.5),behind:"slCount"});}}
  ]);});

// ---- 6 · Show the least: a way for each line of the agreement; the new columns' classes; the agent sees what the study sees; the roll,
//          the box and the totals; Samuel's row as the study sees it ----
const SL_PICK=[["Keyed hash","May have"],["Generalise","May have"],["Mask it whole","Never"],["Leave it out","Never"],["Filter rows","From"],["Totals, small counts hidden","May leave"]];
scene("least",(ctx,S,t,sc)=>{const c=sc.cues,P=sl_once(sc,"P",()=>({
    totals:wAt(sc,"faculty","only totals"),pseudo:wAt(sc,"newclass","pseudonymous"),indirect:wAt(sc,"newclass","still indirect"),
    roll:wAt(sc,"least","roll"),box:wAt(sc,"least","box"),tot:wAt(sc,"least","totals"),nothing:wAt(sc,"samuel","says nothing")}));
  const pick=[c.code,c.year,c.nonames,c.nohealth,c.faculty,P.totals];
  ag_shots(ctx,S,t,sc.dur,[
    // for each line of the agreement, the way that keeps what the study needs
    {at:0,place:"slHall",keys:[[0,960,540,1]],d:1.8,draw:(x,tt)=>{
      dp_person(x,"mei",1740,600,1.0,{t:tt,flip:true});
      const lit={};SL_PICK.forEach(([w,k],i)=>{lit[k]=Math.max(lit[k]||0,ag_io(tt,pick[i]-0.2,(pick[i+1]||c.newclass)-0.1,0.4));});
      const bb=sl_agree(x,80,120,860,["May have","Never","From","May leave"],{lit,dim:0.7});
      SL_PICK.forEach(([w,k],i)=>{const ty=150+i*88,a=ag_in(tt,pick[i]-0.1,0.4);if(a<=0)return;const on=ag_io(tt,pick[i]-0.1,(pick[i+1]||c.newclass)-0.1,0.4);
        x.save();x.globalAlpha*=a;ag_about(x,1230,ty+36,lerp(0.8,1,ag_spr(tt,pick[i]-0.1,0.5)));dp_panel(x,1000,ty,460,72,{col:"cyan",r:14,glowA:0.4+0.8*on});dp_T(x,w,1230,ty+46,{w:700,size:28,align:"center"});x.restore();
        const at=bb.at[k];if(at)dp_link(x,[940,at[1]],[1000,ty+36],"cyan",ag_in(tt,pick[i]-0.1,0.4),{alpha:lerp(0.45,1,on)});});}},
    // the study's columns and their classes; built later in the series; an agent helping the study sees what it sees; the roll, the
    // box and the totals; Samuel's row as the study sees it
    {at:c.newclass-0.3,place:"slHall",later:true,keys:[[c.newclass-0.3,960,540,1]],d:1.8,draw:(x,tt)=>{
      const rows={num:{v:[[0,SL_VAL.code]],chip:[[0,"pseudonymous"]],label:[[-1,"Learner code"]],lit:sl_lit(P.pseudo-0.2,c.build)},name:{v:[[0,SL_VAL.star]]},email:{v:[[0,SL_VAL.star]]},
        dob:{v:[[0,SL_VAL.year]],label:[[-1,"Year of birth"]],lit:sl_lit(P.indirect-0.2,c.build)}};
      // as the end card comes, the row and its slips leave, so nothing is left under the card's words
      const ea=1-ag_in(tt,c.breath-0.2,0.6);sl_rec(x,tt,{rows,title:"What the study sees",level:"confidential",a:ea});
      const ba=ag_io(tt,c.build+0.2,c.agent-0.3,0.4);if(ba>0)dp_card(x,1120,120,720,{kick:"Later in this series",title:"One policy for many tables",sub:"Each class hidden the same way, every time"},{a:ba,k:ag_spr(tt,c.build+0.2,0.6)});
      const ga=ag_io(tt,c.agent+0.2,c.least-0.2,0.5);if(ga>0){withA(x,ga,()=>dp_person(x,"anil",1740,600,1.0,{t:tt,flip:true}));
        ag_model(x,1330,470,64,{t:tt,a:ga});dp_tag(x,1120,150,"Sees what the study sees","cyan",{a:ga,to:[1330,402],p:ag_in(tt,c.agent+0.6,0.5)});
        dp_T(x,"More in AI agents in data work",1120,300,{w:600,size:28,col:"mut",a:ga*ag_in(tt,c.agent+1.0,0.5)});}
      const pics=[["The roll: who",sl_crop("slRoom",370,760,400,109),P.roll],
        ["The box: how",(cc,px,py,pw,ph)=>{cc.drawImage(dp_place0("slBallot"),685,771,587,160,px,py,pw,ph);cc.save();cc.translate(px,py);cc.scale(pw/587,ph/160);cc.translate(-685,-771);sl_box(cc,...SL_R.box);cc.restore();},P.box],
        ["The totals",sl_crop("slCount",686,156,548,150),P.tot]];
      pics.forEach(([lab,paint,t0],i)=>{const a=ag_io(tt,t0-0.2,c.samuel-0.2,0.4);if(a>0)sl_pane(x,1160,110+i*250,560,170,lab,paint,{a,k:ag_spr(tt,t0-0.2,0.6)});});
      dp_slip(x,1120,150,"Answers the study's question","green",{ink:true,a:ea*ag_in(tt,c.samuel+0.2,0.4)});
      dp_slip(x,1120,250,"Says nothing about who he is","violet",{ink:true,a:ea*ag_in(tt,P.nothing,0.4)});
      dp_end(x,S,tt,c.breath,"Show the least","Show the least that still answers the question.","Film 3 of 8","Only what you may see");}}
  ]);});
// the hall's chapters open in the hall the one before ends in: the camera glides on, and what changes fades
ag_cutInto(["questions","oneway","undo","totals"]);
DP_PEOPLE.push("anil","mei");
