/* ===== Decades in the making: the chapters =====
   Each chapter is a few shots (ag_shots), cut together with short dissolves. Times inside a chapter come from its cues (when each
   line starts) and the words of its lines (wAt), so the pictures stay with the voice if it's recorded again. Words on screen are on
   cards, tabs and pages, at least 28 px as seen, and above the captions. */

// made once per chapter, the first time it draws: its cues are known by then
const dm_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// a place's label in the corner, in for a shot: from t0, out at t1
const dm_whereAt=(ctx,t,text,t0,t1,o)=>dm_where(ctx,text,ag_io(t,t0,t1,0.5),o);

// ---- 1 · An idea that waited: books copied by hand, few and full of mistakes; printing's pieces, four hundred years apart; an
//          agent joins Jun's team, and seems to have come from nowhere ----
scene("story",(ctx,S,t,sc)=>{const c=sc.cues,P=dm_once(sc,"P",()=>({
    letter:wAt(sc,"europe","letter by"),slow:wAt(sc,"rare","slow"),rare:wAt(sc,"rare","rare"),held:wAt(sc,"cambridge","held"),books:wAt(sc,"cambridge","a hundred"),
    copy:wAt(sc,"mistakes","copy"),mist:wAt(sc,"mistakes","mistakes"),will:wAt(sc,"old","will change"),four:wAt(sc,"old","four hundred"),
    piece:wAt(sc,"clay","piece"),each:wAt(sc,"clay","each character"),set:wAt(sc,"frame","set them"),printed:wAt(sc,"frame","printed"),again:wAt(sc,"frame","used them"),
    metal:wAt(sc,"korea","cast in metal"),oldest:wAt(sc,"korea","the oldest"),gut:wAt(sc,"mainz","Gootenberg"),together:wAt(sc,"mainz","brought"),
    letters:wAt(sc,"pieces","Letters"),ink:wAt(sc,"pieces","an ink"),press:wAt(sc,"pieces","a press"),paper:wAt(sc,"pieces","and paper"),
    lender:wAt(sc,"fust","a lender"),money:wAt(sc,"fust","the money"),
    two:wAt(sc,"towns","two hundred"),thirty:wAt(sc,"towns","thirty thousand"),cheaper:wAt(sc,"cheaper","cheaper"),readers:wAt(sc,"cheaper","far more"),
    once:wAt(sc,"seemed","all at once"),taken:wAt(sc,"seemed","It had taken"),
    joins:wAt(sc,"agent","joins"),step:wAt(sc,"agent","step by"),fear:wAt(sc,"nowhere","fear"),magic:wAt(sc,"nowhere","magic"),decades:wAt(sc,"ideas","decades"),understand:wAt(sc,"ideas","understand")}));
  ag_shots(ctx,S,t,sc.dur,[
    // the scribe copies a book, letter by letter; the light comes and goes over days of it
    {at:0,place:"dmScribe",keys:[[0,960,540,1],[P.letter-0.6,860,720,1.45],[P.slow,940,600,1.12]],d:1.8,draw:(x,t)=>{
      // one page, written at a steady hand's pace (a row about every second and a half), while the light comes and goes; he glances up
      // at the book he copies now and then, turning his head over a few tenths of a second
      const p=0.12+0.62*clamp(t/c.cambridge,0,1),tip=dm_writing(x,p);
      const look=sstep(0.35,0.75,Math.sin(t*1.3));dm_scribe(x,t,tip,{look});
      const night=Math.sin(Math.PI*clamp((t-P.slow)/1.8,0,1));if(night>0){x.fillStyle=rgba([40,44,70],0.32*night);x.fillRect(0,0,W,H);}
}},
    // Cambridge's whole library, 122 books on four lecterns
    {at:c.cambridge-0.3,place:"dmLibrary",keys:[[c.cambridge-0.3,330,560,1.9],[P.books-0.4,960,540,1]],d:2.2,draw:(x,t)=>{
      const t0=P.held,dt=(P.books+1.2-t0)/122,n=Math.floor(clamp((t-t0)/dt,0,122));dm_library(x,122,t,t0,dt);
      const a=ag_in(t,P.books-0.6,0.5);if(a>0)ag_textCard(x,760,120,400,{kick:"The whole library",title:dm_num(dm_count(t,t0,P.books+1.2,122))+" books"},{a,k:ag_spr(t,P.books-0.6,0.6)});
}},
    // a line copied, and copied again: the dose and the hour drift
    {at:c.mistakes-0.3,place:"dmTable",keys:[[c.mistakes-0.3,960,540,1],[c.change-0.2,1430,360,1.5]],d:1.8,draw:(x,t)=>{
      dm_sheet(x,0,430,340,-0.04,ag_in(t,c.mistakes-0.2,0.6),0);
      dm_sheet(x,1,960,600,0.03,ag_in(t,P.copy-0.3,0.6),ag_in(t,P.mist,0.6));
      dm_sheet(x,2,1460,340,-0.02,ag_in(t,P.copy+0.5,0.6),ag_in(t,P.mist+0.3,0.6));
      for(const [a,b,t0] of [[[560,470],[690,530],P.copy-0.4],[[1240,540],[1300,470],P.copy+0.4]]){const u=ag_in(t,t0,0.6);if(u<=0)continue;x.save();x.strokeStyle=rgba(AG.ink,0.4*u);x.lineWidth=3;x.setLineDash([8,8]);
        x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(lerp(a[0],b[0],u),lerp(a[1],b[1],u));x.stroke();x.setLineDash([]);ag_arrowHead(x,lerp(a[0],b[0],u),lerp(a[1],b[1],u),Math.atan2(b[1]-a[1],b[0]-a[0]),12,rgba(AG.ink,0.5*u));x.restore();}}},
    // the idea that will change it: Mainz, 1450, and four hundred years before it, China
    {at:c.old-0.3,place:"dmWall",keys:[[c.old-0.3,1300,540,1.45],[P.four-0.3,960,540,1]],d:1.8,draw:(x,t)=>{
      dm_printRail(x,{draw:ag_in(t,c.old-0.4,1.2),lit:[ag_in(t,P.four+0.4,0.6),0,ag_in(t,P.will,0.6)],a:[ag_in(t,P.four+0.2,0.5),ag_in(t,P.four+0.6,0.5),ag_in(t,P.will-0.2,0.5)],span:clamp((t-P.four)/1.0,0,1)});}},
    // Bi Sheng's clay pieces: made, set in the iron frame, inked, printed, lifted out to be used again
    {at:c.clay-0.3,place:"dmBench",keys:[[c.clay-0.3,420,520,1.5],[P.set-0.6,960,540,1]],d:2.0,draw:(x,t)=>{
      const made=0.06+0.94*clamp((t-c.clay)/(P.each-c.clay+1.2),0,1),set=clamp((t-P.set+0.1)/1.6,0,1),inked=ag_in(t,P.printed-0.5,0.5),
        sheet=ag_keys(t,[[P.printed-0.2,0],[P.printed+0.5,1],[P.again-0.3,1],[P.again+0.4,0]]),back=clamp((t-P.again)/1.6,0,1);
      dm_ironPieces(x,made,set,inked*(1-back),back);
      // the sheet slides over the frame, is pressed, and comes back printed
      const [qx,qy,qw,qh]=DM_IRON.paper,[fx,fy,fw,fh]=DM_IRON.frame,sx=lerp(qx,fx-20,ag_sine(sheet)),sy=lerp(qy,fy-30,ag_sine(sheet));
      if(t>P.printed-0.3){x.save();x.shadowColor="rgba(30,18,8,0.3)";x.shadowBlur=20;x.shadowOffsetX=-6;x.shadowOffsetY=8;x.fillStyle=rgba(DM.paper,1);x.fillRect(sx,sy,qw,qh);x.restore();
        dm_printed(x,sx+40,sy+40,qw-80,qh-80,ag_in(t,P.printed+0.6,0.6)*(sheet<0.6||t>P.again?1:0.4),{});}
}},
    // Korea, 1377: metal pieces, and the oldest book printed with them that survives
    {at:c.korea-0.3,place:"dmCloth",keys:[[c.korea-0.3,700,520,1.25],[P.oldest-0.5,1060,520,1.12]],d:2.0,draw:(x,t)=>{
      dm_bronzeTray(x,170,400,ag_in(t,P.metal-0.4,0.6));
      const op=ag_in(t,c.korea+1.4,1.2);dm_threadBook(x,1080,520,op);
      const sp=ag_in(t,P.oldest,1.0);if(sp>0){x.save();x.globalCompositeOperation="soft-light";const g=x.createRadialGradient(1080,520,100,1080,520,900);g.addColorStop(0,rgba([255,250,236],0.5*sp));g.addColorStop(1,rgba([30,24,16],0.6*sp));x.fillStyle=g;x.fillRect(0,0,W,H);x.restore();}
}},
    // Mainz: Gutenberg brings the pieces together, and Fust lends the money
    {at:c.mainz-0.3,place:"dmMainz",keys:[[c.mainz-0.3,900,560,1.3],[P.letters-0.3,960,540,1]],d:2.0,draw:(x,t)=>{
      const lift=ag_in(t,P.together,0.9);dm_pressBar(x,0.5+0.5*Math.sin(t*0.8));
      ag_person(x,DM_PEOPLE.gutenberg,420,640,1.0,{t,pose:"hang",pose2:"hold",mix:lift,nod:0.06*lift,gaze:[3,2+lift],hold:(cc,h)=>{if(lift<0.5)return;cc.save();cc.translate(h.near[0]+40,h.near[1]-150);cc.rotate(-0.08);dm_page42(cc,0,0,170,ag_in(t,P.together+0.4,0.4));cc.restore();}});
      const fu=ag_in(t,P.lender-0.5,1.0);if(fu>0)ag_person(x,DM_PEOPLE.fust,1580+(1-ag_eo(fu))*380,640,1.0,{t,flip:true,pose:"hang",pose2:"hold",mix:ag_in(t,P.money-0.4,0.6),hold:(cc,h)=>{cc.save();cc.translate(h.near[0]+70,h.near[1]+10);dm_icon(cc,"purse");cc.restore();}});
      const PC=[["sorts","Metal letters","all alike",P.letters],["ink","Ink that clings","",P.ink],["press","A press","like a wine press",P.press],["paper","Paper","made in Germany",P.paper],["purse","A lender","Johann Fust",P.lender]];
      PC.forEach((p,i)=>dm_piece(x,90+i*352,70,320,p[0],p[1],p[2],ag_in(t,p[3]-0.2,0.4),ag_spr(t,p[3]-0.2,0.6)));
}},
    // by 1500: presses in more than two hundred towns, thirty thousand books, cheaper, for far more readers
    {at:c.towns-0.3,place:"dmMap",keys:[[c.towns-0.3,820,460,1.6],[c.towns+0.4,960,540,1]],d:2.4,draw:(x,t)=>{
      const yr=ag_keys(t,[[c.towns+0.2,1450],[P.thirty+0.6,1500]],u=>u);dm_towns(x,yr,{glow:ag_in(t,P.readers-0.3,1.6)});
      ag_pill(x,1560,300,String(Math.floor(yr)),{size:36,a:ag_in(t,c.towns+1.8,0.5)});
      const t2=Math.max(P.two-0.2,c.towns+2.7),a=ag_in(t,t2,0.5);if(a>0)ag_textCard(x,1220,380,650,{kick:"By 1500",title:"Presses in more than 200 towns",sub:ag_in(t,P.thirty-0.2,0.4)>0?"Some 30,000 different books":""},{a,k:ag_spr(t,t2,0.6)});
      const b=ag_in(t,P.cheaper-0.2,0.5);if(b>0)ag_textCard(x,1220,620,650,{title:"Cheaper books, far more readers"},{a:b,k:ag_spr(t,P.cheaper-0.2,0.6)});}},
    // it seemed to arrive all at once: close on 1450, then back out over four hundred years
    {cut:true,at:c.seemed-0.3,place:"dmWall",keys:[[c.seemed-0.3,1493,430,2.4],[P.taken-0.2,960,540,1]],d:2.2,draw:(x,t)=>{
      dm_printRail(x,{lit:[ag_in(t,P.taken+0.6,0.5),ag_in(t,P.taken+0.4,0.5),1],span:clamp((t-P.taken-0.6)/1.0,0,1),spanText:"About 400 years"});}},
    // this term an agent joins Jun's team; some fear it, some expect magic; its ideas are decades old
    {at:c.agent-0.3,place:"dmLab",keys:[[c.agent-0.3,1100,560,1.25],[c.nowhere-0.2,960,540,1],[P.decades-0.4,960,470,1.08]],d:2.0,draw:(x,t)=>{
      const doing=clamp((t-P.step+0.2)/2.2,0,3)*1.0;
      dm_team(x,{t,agent:clamp((t-P.joins+0.3)/0.9,0,1),think:ag_io(t,P.step-0.4,c.nowhere,0.5),yusuf:ag_in(t,c.nowhere-0.2,0.8),mei:ag_in(t,c.nowhere,0.8),
        ySmile:0.05,mSmile:0.55,junSmile:0.35,screen:(cx,sx,sy,sw,sh)=>{cx.fillStyle=rgba(AG.violet,0.12*ag_io(t,P.step-0.4,c.nowhere,0.5));cx.fillRect(sx,sy,sw,sh);}});
      dm_tasks(x,1490,250,doing*3/3,ag_io(t,P.step-0.5,c.nowhere-0.1,0.5));
      const cardsA=1-ag_in(t,P.decades-0.4,0.6);
      const f=ag_in(t,P.fear-0.2,0.5)*cardsA;if(f>0)ag_textCard(x,120,180,300,{title:"Danger?"},{a:f,k:ag_spr(t,P.fear-0.2,0.6),tail:{side:"bottom",at:0.35,px:250,py:300}});
      const m=ag_in(t,P.magic-0.2,0.5)*cardsA;if(m>0)ag_textCard(x,1540,180,300,{title:"Magic?"},{a:m,k:ag_spr(t,P.magic-0.2,0.6),tail:{side:"bottom",at:0.6,px:1700,py:300}});
      dm_labRail(x,{focus:1991,ppy:24,draw:ag_in(t,P.decades-0.6,2.0),a:ag_in(t,P.decades-0.6,0.4),show:[1958,1986,2012,2022],flat:true,
        tabA:y=>ag_in(t,P.decades-0.4+(y-1958)/66*1.8,0.4),lit:y=>y===1958?ag_io(t,P.decades,P.understand+0.4,0.5):0});}}
  ],0.6);
  // each past scene's place and year, in the corner of the screen (not of the place, so the camera doesn't move it)
  for(const [s_,t0,t1,col] of [["Europe · the 1440s",0.8,P.rare+0.8],["Cambridge · 1424",c.cambridge+0.2,c.mistakes-0.2],["China · the 1040s",c.clay,c.korea-0.4],
    ["Korea · 1377",c.korea,c.mainz-0.4],["Mainz · around 1450",c.mainz,P.letters-0.3]])dm_whereAt(ctx,t,s_,t0,t1,col?{col}:null);
  ag_title(ctx,S,t,c.breath+0.4,"Decades in the making","Where AI agents came from","FILM 1 OF 9 · WHAT AN AGENT IS");
});

// ---- 2 · A machine that learns: 1958, the perceptron; the newspaper's hopes; 1969, what one layer can't learn ----
// a trial of the perceptron: which card, its guess, right or wrong (the first few wrong more often, then right)
// the trials, in three parts: six shown one by one, then forty-three in a rush (the card hidden, the dials turning), then the fiftieth, right
const DM_TRY=[1.7,1.4,1.05,1.05,1.05,1.05],DM_WRONG=[1,1,0,1,0,1];
const dm_dial0=i=>[-0.9,0.5,1.4,-0.2,2.2,-1.5][i],dm_nudge=(k,i)=>{const r=ag_rnd(k*17+i*5+3);return (r()-0.5)*0.9;},dm_dialEnd=i=>[0.3,-0.8,0.6,1.7,-0.4,0.9][i];
function dm_trials(t,tA,tB,tC){const ends=[];let e=tA;for(const d of DM_TRY){e+=d;ends.push(e);}
  // the dials after k of the first trials
  const after=(k,i)=>{let v=dm_dial0(i);for(let q=0;q<k;q++)if(DM_WRONG[q])v+=dm_nudge(q,i);return v;};
  if(t<tA)return{k:-1,show:0,dial:i=>dm_dial0(i),nudge:0};
  if(t<ends[5]){let k=0;while(t>=ends[k])k++;const t0=k?ends[k-1]:tA,d=DM_TRY[k],f=(t-t0)/d,card=[0,1,1,0,1,0][k],wrong=DM_WRONG[k];
    const show=ag_in(f,0.02,0.2)*(1-ag_in(f,0.9,0.1)),guess=f>0.42?(wrong?1-card:card):null,right=f>0.58?!wrong:null,nf=wrong?ag_sine(clamp((f-0.62)/0.3,0,1)):0;
    return{k,card,show,guess,right,tries:k+1,nudge:wrong?Math.sin(Math.PI*clamp((f-0.6)/0.36,0,1)):0,dial:i=>after(k,i)+(wrong?dm_nudge(k,i)*nf:0)};}
  if(t<tC){const u=clamp((t-ends[5])/(tC-ends[5]),0,1),n=Math.round(lerp(7,49,ag_sine(u)));return{k:n-1,show:0,tries:n,nudge:0,dial:i=>lerp(after(6,i),dm_dialEnd(i),ag_sine(u))+Math.sin(t*9+i)*0.06*Math.sin(Math.PI*u)};}
  const f=(t-tC)/1.1;return{k:49,card:0,show:ag_in(f,0,0.2),guess:f>0.42?0:null,right:f>0.58?true:null,tries:50,nudge:0,dial:i=>dm_dialEnd(i)};}

// ---- 2 · A machine that learns: July 1958, the perceptron shown to reporters; fifty tries; the newspaper's hopes; one layer's limit ----
scene("learns",(ctx,S,t,sc)=>{const c=sc.cues,P=dm_once(sc,"P",()=>({rep:wAt(sc,"navy","reporters"),perc:wAt(sc,"navy","perceptron"),frank:wAt(sc,"navy","Frank"),shown:wAt(sc,"cards","Shown"),
    nudged:wAt(sc,"cards","nudged"),fifty:wAt(sc,"fifty","fifty"),apart:wAt(sc,"fifty","tell them apart"),paper:wAt(sc,"paper","newspaper"),walk:wAt(sc,"paper","walk"),
    conscious:wAt(sc,"paper","conscious"),single:wAt(sc,"layer","single layer"),some:wAt(sc,"layer","some patterns"),book:wAt(sc,"layer","a book"),money:wAt(sc,"layer","money")}));
  const MX=470,MY=330;
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"dmLab",keys:[[0,960,488,1.107],[c.road+0.4,960,540,1],[c.cards-1.4,780,610,1.32],[P.paper-2.2,960,540,1]],d:2.0,draw:(x,t)=>{
    dm_railAt(x,t,[[0,1991,24],[0.7,1991,24],[2.5,1958,40],[P.book-0.8,1958,40],[P.book+0.8,1969,40]],{draw:1,tabA:y=>[1958,1986,2012,2022].includes(y)?1:ag_in(t,0.9,0.6),flat:t<0.9});
    const T=dm_trials(t,P.shown+0.1,P.fifty-0.4,P.apart-0.9),off=ag_in(t,P.money,1.2),on=ag_in(t,P.perc-0.1,0.6)*(1-off);
    // Frank Rosenblatt shows it; two reporters watch, a camera flashes
    const sad=ag_in(t,P.single,1.0);
    ag_person(x,DM_PEOPLE.y1958,250,620,0.92,{t,pose:"hang",pose2:"explain",mix:ag_io(t,P.frank-0.3,P.paper-0.4,0.8),smile:0.45*(1-sad)+0.05,gaze:[4,1+2*sad],nod:0.06*sad});
    const fl=[P.rep+0.15,P.rep+0.85,P.perc+0.7].reduce((m,f)=>Math.max(m,t>=f&&t<f+0.5?1-(t-f)/0.5:0),0),ra=1-ag_in(t,P.fifty,0.8);
    if(ra>0){x.save();x.globalAlpha*=ra;ag_person(x,DM_PEOPLE.reporter,1800,668,0.84,{t,flip:true,pose:"hold",hold:(c2,h)=>dm_notebook(c2,h),gaze:[3,2],smile:0.15});
      ag_person(x,DM_PEOPLE.press,1570,668,0.84,{t,flip:true,pose:"hold",hold:(c2,h)=>dm_pressCamera(c2,h,fl),gaze:[3,1]});x.restore();}
    const lit=off<0.4;dm_perceptron(x,MX,MY,{on,card:T.card||0,show:T.show*(1-off),guess:lit?T.guess:null,right:lit?T.right:null,dial:T.dial,nudge:T.nudge,tries:T.k>=0?T.tries:null});
    if(fl>0){x.save();x.setTransform(1,0,0,1,0,0);x.fillStyle="rgba(255,252,240,"+(0.22*fl)+")";x.fillRect(0,0,x.canvas.width,x.canvas.height);x.restore();}
    if(t>P.apart-0.2)ag_verdict(x,MX+160,MY-44,"Tells left from right","pass",ag_io(t,P.apart-0.2,P.single,0.4));
    // the newspaper the next day
    dm_clipping(x,1210+(1-ag_eo(ag_in(t,P.paper-0.2,0.7)))*60,300,ag_io(t,P.paper-0.2,P.single-0.2,0.6),ag_in(t,P.walk,0.5));
    // 1969: one straight line can't split this pattern; a book shows it; the money goes elsewhere
    const xa=ag_in(t,P.single,0.7),tr=t-P.single;
    dm_xor(x,1420,452,300,-0.6+Math.sin(tr*1.3)*0.75,Math.sin(tr*0.9)*46,xa,ag_in(t,P.some+0.6,0.4));
    ag_verdict(x,1474,684,"No straight line splits them","fail",xa*ag_in(t,P.some+0.6,0.5));
    dm_bookCover(x,1640,280+(1-ag_eo(ag_in(t,P.book-0.2,0.7)))*30,"Perceptrons","1969",ag_in(t,P.book-0.2,0.6));
    dm_coinsAway(x,860,840,clamp((t-P.money)/1.8,0,1));}}],0.6);});

// ---- 3 · Learning from mistakes: 1986, a network of layers guesses, measures its error, passes it back; twenty years small ----
const DM_NET1=[3,5,5,2];
scene("mistakes",(ctx,S,t,sc)=>{const c=sc.cues,P=dm_once(sc,"P",()=>({three:wAt(sc,"layers","three researchers"),several:wAt(sc,"layers","several layers"),guessW:wAt(sc,"guess","guess"),wrong:wAt(sc,"guess","how wrong"),
    passed:wAt(sc,"back","passed back"),nudged:wAt(sc,"back","nudged"),smaller:wAt(sc,"back","smaller"),many:wAt(sc,"patterns","many examples"),between:wAt(sc,"patterns","in between"),
    noone:wAt(sc,"patterns","no one"),slow:wAt(sc,"small","slow"),few:wAt(sc,"small","few"),twenty:wAt(sc,"small","twenty years")}));
  const PX=560,PY=340,PW=1280,PH=510,NX=900,NY=430,NW=540,NH=340;
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"dmLab",keys:[[0,960,540,1.025],[0.3,960,540,1]],d:2.0,draw:(x,t)=>{
    const RX=dm_railAt(x,t,[[0,1969,40],[0.7,1969,40],[2.3,1986,40],[P.twenty+0.2,1986,40],[P.twenty+2.2,2006,40]]);
    // twenty years: a bracket under the rail from 1986, drawn as the rail moves on
    if(t>P.twenty){const x0=RX(1986),x1=RX(2006),u=ag_in(t,P.twenty+0.2,2.0);
      x.save();x.strokeStyle=rgba(AG.ink,0.5);x.lineWidth=3;x.lineCap="round";x.beginPath();x.moveTo(x0,282);x.lineTo(lerp(x0,x1,u),282);x.stroke();x.restore();ag_pill(x,(x0+x1)/2,282,"Twenty years",{a:ag_in(t,P.twenty+0.8,0.6)});}
    // the paper, pinned to the wall; later, a computer of the time, slow
    const pa=ag_in(t,P.three-0.4,0.6)*(1-ag_in(t,P.slow-0.6,0.6));
    dm_paperSheet(x,110,330+(1-ag_eo(ag_in(t,P.three-0.4,0.7)))*24,"Learning representations by back-propagating errors","1986",pa,{w:360,h:470,size:30});
    const ca=ag_in(t,P.slow-0.3,0.8);if(ca>0){ag_desk(x,60,760,440,{depth:70});dm_oldComputer(x,130,470+(1-ag_eo(ca))*20,clamp((t-P.slow)/30,0,1)*0.42+0.05,ca);}
    // the network on its panel
    const na=ag_in(t,c.layers+0.4,0.8),dim=1-0.3*ag_in(t,P.twenty,1.0);dm_panel(x,PX,PY,PW,PH,na);if(na<=0)return;
    const fwd=clamp((t-P.guessW+0.1)/1.3,0,1),back=clamp((t-P.passed)/2.2,0,1),many=clamp((t-P.many)/(P.slow-P.many),0,1),nud=ag_sine(back);
    const wt=(l,i,j)=>{const r=ag_rnd(l*31+i*7+j*3+1);const w0=r(),w1=r(),w2=r();return lerp(lerp(w0,w1,nud),w2,ag_sine(many));};
    const ex=many>0&&many<1?Math.floor(many*14):-1,exCard=ex>=0?(ex*7+3)%2:0;
    const lit=(l,i)=>l===0?(fwd>0?0.85:0.3):(l===1||l===2)?0.3+0.55*ag_in(t,P.between,0.6)*((i*3+l)%4!==0?1:0.25):(l===3?(fwd>=1&&many<=0?(i===1?0.95:0.3):(ex>=0?(i===exCard?0.9:0.3):0.3)):0.3);
    x.save();x.globalAlpha*=na*dim;const Pn=dm_net(x,NX,NY,NW,NH,DM_NET1,{fwd,back,wt,lit,r:26});
    // the input: a card marked on the left (then many examples, each marked left or right); the outputs: Left and Right
    const ia=ag_in(t,P.guessW-0.6,0.5);if(ia>0){const card=ex>=0?exCard:0,sl=ex>=0?ag_eo(clamp((many*14-ex)/0.35,0,1)):1;x.save();x.globalAlpha*=ia;
      x.translate((1-sl)*-60,0);x.globalAlpha*=sl;x.fillStyle="#FBFAF6";x.shadowColor="rgba(46,38,28,0.25)";x.shadowBlur=12;x.fillRect(PX+50,NY+NH/2-75,190,150);x.shadowColor="transparent";
      x.fillStyle=rgba(DM.ink,0.85);x.beginPath();x.arc(PX+50+(card?140:50),NY+NH/2,32,0,TAU);x.fill();x.restore();
      ag_T(x,ex>=0?"Examples":"Shown",PX+145,NY+NH/2+120,{w:600,size:28,align:"center",col:AG.mut,a:ia});}
    for(const [i,lab] of [[0,"Left"],[1,"Right"]]){const [ox,oy]=Pn[3][i];ag_T(x,lab,ox+44,oy+11,{w:700,size:30,col:lit(3,i)>0.6?AG.violet:AG.ink});}
    // how wrong: an amber bar the error, passed back, makes smaller
    const ea=ag_io(t,P.wrong-0.3,P.many+0.4,0.4);if(ea>0){const ew=lerp(250,50,ag_in(t,P.smaller-0.3,1.4));x.save();x.globalAlpha*=ea;
      ag_T(x,"How wrong",1590,NY+40,{w:700,size:30});x.fillStyle=rgba([226,222,214],1);rr(x,1590,NY+64,250,28,14);x.fill();x.fillStyle=rgba(AG.amber,0.9);rr(x,1590,NY+64,ew,28,14);x.fill();x.restore();}
    // the layers in between, and the patterns they found
    const ba=ag_io(t,P.between-0.3,P.slow,0.5);if(ba>0){const xa=Pn[1][0][0],xb=Pn[2][0][0],yb=NY-44;x.save();x.globalAlpha*=ba;x.strokeStyle=rgba(AG.violet,0.6);x.lineWidth=3;
      x.beginPath();x.moveTo(xa-30,yb+12);x.lineTo(xa-30,yb);x.lineTo(xb+30,yb);x.lineTo(xb+30,yb+12);x.stroke();x.restore();ag_T(x,"Layers in between",(xa+xb)/2,yb-14,{w:700,size:30,align:"center",col:AG.violet,a:ba});}
    [[1,1],[2,1],[1,3],[2,3]].forEach(([l,i],k)=>{const [nx,ny]=Pn[l][i];dm_pattern(x,nx+(l===1?-90:90),ny,DM_PATTERNS[k],ag_io(t,P.noone-0.3+k*0.3,P.slow+0.4,0.4));});
    x.restore();}}],0.6);});

// ---- 4 · The power to run: 2012, a far bigger network, a million labelled photos, two graphics chips, and a contest ----
const DM_NET2=[5,9,9,9,9,6,3];
scene("power",(ctx,S,t,sc)=>{const c=sc.cues,P=dm_once(sc,"P",()=>({pieces:wAt(sc,"together","the pieces"),team:wAt(sc,"photos","A team"),bigger:wAt(sc,"photos","much bigger"),million:wAt(sc,"photos","a million"),
    two:wAt(sc,"chips","two graphics"),games:wAt(sc,"chips","video games"),hundreds:wAt(sc,"chips","hundreds"),contest:wAt(sc,"contest","image contest"),fifteen:wAt(sc,"contest","fifteen"),
    nextW:wAt(sc,"next","next best"),twenty:wAt(sc,"next","twenty-six"),old:wAt(sc,"new","were old"),newW:wAt(sc,"new","What was new")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"dmLab",keys:[[0,960,540,1.025],[0.3,960,540,1]],d:2.0,draw:(x,t)=>{
    dm_railAt(x,t,[[0,2006,40],[0.7,2006,40],[2.3,2012,40]]);
    // the three pieces come together; they come back at the end, the ideas old, the data and the power new
    const PC=[["net","The ideas","1958 · 1986"],["photos","Data","labelled photos"],["chip","Power","graphics chips"]],back=ag_in(t,c.new-0.2,0.6),away=1-ag_in(t,P.team-0.4,0.5);
    PC.forEach((p,i)=>{const t0=back>0?c.new-0.2+i*0.12:P.pieces-0.1+i*0.15,u=ag_spr(t,t0,0.7),gx=back>0?280+i*480:lerp([-300,700,1800][i],280+i*480,clamp(u,0,1.1));
      const a=back>0?ag_in(t,t0,0.4):ag_in(t,t0,0.4)*away,cold=i===0?ag_in(t,P.old,0.5)*back:0,hot=i>0?ag_in(t,P.newW+0.2,0.5)*back:0;
      dm_piece(x,gx,400,400,p[0],p[1],p[2],a*(1-0.4*cold),u);if(cold>0)ag_pill(x,gx+200,690,"Old",{size:32,a:cold});if(hot>0)ag_pill(x,gx+200,690,"New",{size:32,a:hot,col:AG.green});});
    // the panel: labelled photos flow into a far bigger network, run on two graphics chips
    const pa=ag_io(t,P.team-0.3,c.new-0.4,0.6);dm_panel(x,120,350,1680,500,pa);if(pa<=0)return;
    const na=ag_io(t,P.team-0.2,c.contest-0.3,0.6);if(na>0){x.save();x.globalAlpha*=na;const g=ag_in(t,P.bigger-0.3,1.2);
      if(g<1){x.save();x.globalAlpha*=1-g;dm_net(x,860,460,360,300,DM_NET1,{r:22});x.restore();}
      if(g>0){x.save();x.globalAlpha*=g;ag_about(x,1040,590,lerp(0.7,1,ag_eo(g)));dm_net(x,820,420,440,370,DM_NET2,{r:14,fwd:t>P.million?((t-P.million)*0.45)%1:0,lit:(l,i)=>0.35+0.3*Math.sin(t*2+l+i*0.7)});x.restore();}
      // photos, a million and more, a few of them flying in
      const n=Math.min(24,Math.floor(clamp((t-P.million+0.6)/1.4,0,1)*24));dm_photos(x,170,446,n,1);ag_pill(x,430,400,"More than a million labelled photos",{a:ag_in(t,P.million,0.5)});
      if(t>P.million+0.8){for(let k=0;k<4;k++){const u=((t-P.million-0.8)*0.5+k/4)%1,px=lerp(700,800,ag_sine(u)),py=lerp(470+k*80,590,ag_sine(u));x.save();x.globalAlpha*=Math.sin(Math.PI*u)*0.9;
        x.fillStyle="#fff";x.fillRect(px-24,py-18,48,36);x.fillStyle=rgba([[96,140,170],[150,170,110],[190,140,90],[170,120,150]][k],1);x.fillRect(px-20,py-14,40,22);x.restore();}}
      // two graphics chips, made for games, doing hundreds of small sums at once
      const ch=ag_in(t,P.two-0.2,0.6),wave=t>P.hundreds?((t-P.hundreds)*0.7)%1:null;
      dm_chip(x,1400,452,0.92,wave,ch);dm_chip(x,1400,640,0.92,wave==null?null:(wave+0.3)%1,ch);ag_pill(x,1540,400,"Graphics chips, made for games",{a:ch*ag_in(t,P.games-0.2,0.5)});
      if(wave!=null){x.save();x.globalAlpha*=ch*0.8;x.strokeStyle=rgba(AG.blue,0.5);x.lineWidth=4;x.setLineDash([10,10]);x.lineDashOffset=-t*40;
        for(const cy of [530,720]){x.beginPath();x.moveTo(1390,cy);x.quadraticCurveTo(1320,cy,1290,590);x.stroke();}x.setLineDash([]);x.restore();}
      x.restore();}
    // the contest: its five best guesses missed 15 in a hundred; the next best entry, 26
    const ga=ag_io(t,P.contest-0.2,c.new-0.4,0.6);if(ga>0){ag_T(x,"Its five best guesses missed the answer",960,420,{w:700,size:34,align:"center",a:ga});
      dm_hundred(x,380,452,15,ga,clamp((t-P.fifteen+0.6)/1.0,0,1));dm_hundred(x,1200,452,26,ga*ag_in(t,P.nextW-0.3,0.5),clamp((t-P.twenty+0.6)/1.0,0,1));
      ag_T(x,"This network: 15 in 100",548,836,{w:700,size:32,align:"center",a:ga*ag_in(t,P.fifteen,0.4)});ag_T(x,"Next best: 26 in 100",1368,836,{w:700,size:32,align:"center",a:ga*ag_in(t,P.twenty,0.4)});}}}],0.6);});

// ---- 5 · Attention: 2017, read all the words at once and learn which matter to each other ----
const DM_SENT=["The","team","fixed","the","report","because","it","was","wrong"];
scene("attention",(ctx,S,t,sc)=>{const c=sc.cues,P=dm_once(sc,"P",()=>({called:wAt(sc,"paper","Attention Is"),read:wAt(sc,"paper","read"),one:wAt(sc,"before","one word"),
    design:wAt(sc,"once","transformer"),all:wAt(sc,"once","all the words"),which:wAt(sc,"once","which matter"),itW:wAt(sc,"report","it learns"),isW:wAt(sc,"report","is the report"),
    splits:wAt(sc,"bigger","splits"),many:wAt(sc,"bigger","many chips"),grow:wAt(sc,"bigger","grow")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"dmLab",keys:[[0,960,540,1.025],[0.3,960,540,1]],d:2.0,draw:(x,t)=>{
    dm_railAt(x,t,[[0,2012,40],[0.7,2012,40],[2.3,2017,40]]);
    // the paper, then set aside on the left
    const side=ag_in(t,c.before-0.6,1.2),sa=ag_in(t,P.called-0.6,0.6);if(sa>0){x.save();x.translate(lerp(770,90,ag_sine(side)),lerp(350+(1-ag_eo(sa))*24,370,ag_sine(side)));x.scale(lerp(1,0.88,ag_sine(side)),lerp(1,0.88,ag_sine(side)));
      dm_paperSheet(x,0,0,"Attention Is All You Need","2017",sa);x.restore();}
    // one word at a time, then all at once, then which matter to each other
    const pa=ag_io(t,c.before-0.3,P.splits+0.2,0.6);dm_panel(x,520,350,1320,500,pa);
    if(pa>0){const seq=t<P.all-0.2,cur=Math.floor((t-P.one+0.2)/0.42);
      const on=i=>seq?(i===cur?1:(i<cur?0.35:0.12)):(t<P.itW-0.2?ag_in(t,P.all-0.2,0.4):(i===4||i===6?1:0.3+0.7*(1-ag_in(t,P.itW-0.2,0.6))));
      const arcs=[];if(!seq){const base=ag_io(t,P.all,P.itW+0.4,0.5),r=ag_rnd(9);for(let i=0;i<9;i++)for(let j=i+1;j<9;j++)if(r()<0.32)arcs.push([i,j,base*(0.15+r()*0.5)]);
        const it=ag_in(t,P.itW-0.2,0.6);if(it>0){arcs.push([4,6,it]);arcs.push([1,6,it*0.22]);arcs.push([6,8,it*0.16]);}}
      const M=dm_sentence(x,1180,750,DM_SENT,{on,arcs,arcH:0.3,size:36,center:true,a:pa});
      // the reader: a mark under the word being read, one at a time
      if(seq&&cur>=0&&cur<9&&t>P.one-0.4){const [mx]=M[cur];x.save();x.globalAlpha*=pa;x.fillStyle=rgba(AG.violet,0.9);rr(x,mx-24,792,48,6,3);x.fill();x.restore();}}
    // the work split across many chips, and a model that grows far bigger
    const ba=ag_in(t,P.splits-0.2,0.6);if(ba>0){for(let k=0;k<8;k++){const u=ag_in(t,P.many-0.5+k*0.08,0.5);dm_chip(x,520+k*160,720,0.42,(t*0.8+k*0.1)%1,ba*u);}
      const g=ag_in(t,P.grow-0.3,1.6),R=lerp(60,160,ag_eo(g));ag_modelLight(x,1190,525,R,0.5*ba);ag_model(x,1190,525,R,{t,core:0.7,think:0.4,a:ba,label:g>0.6?"Model":null});
      x.save();x.globalAlpha*=ba*0.6;x.strokeStyle=rgba(AG.blue,0.5);x.lineWidth=3;x.setLineDash([8,10]);x.lineDashOffset=-t*30;for(let k=0;k<8;k++){const cx=520+k*160+63;x.beginPath();x.moveTo(cx,716);x.quadraticCurveTo(cx,650,1190,525+R*0.7);x.stroke();}x.setLineDash([]);x.restore();}}}],0.6);});

// ---- 6 · The written web: 2018 to 2020, guess the next word, billions of times; 175 billion numbers; but it only carried on ----
const DM_MORE=["How do I change my email?","How do I delete my account?","How do I contact support?"];
scene("web",(ctx,S,t,sc)=>{const c=sc.cues,P=dm_once(sc,"P",()=>({huge:wAt(sc,"text","huge"),guessW:wAt(sc,"task","guess the next"),check:wAt(sc,"task","check it"),adjust:wAt(sc,"task","adjust"),
    billions:wAt(sc,"billions","Billions"),grammar:wAt(sc,"billions","grammar"),facts:wAt(sc,"billions","facts"),ways:wAt(sc,"billions","ways of writing"),
    hundred:wAt(sc,"largest","a hundred and seventy-five"),fluently:wAt(sc,"help","fluently"),help:wAt(sc,"help","trying to help"),carried:wAt(sc,"help","carried on")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"dmLab",keys:[[0,960,540,1.025],[0.3,960,540,1]],d:2.0,draw:(x,t)=>{
    dm_railAt(x,t,[[0,2017,40],[0.7,2017,40],[2.3,2020,40]]);
    const big=ag_in(t,P.hundred-0.4,1.8),R=lerp(118,178,ag_eo(big)),mx=1450,my=560;
    // text from the web and books, flowing in
    const fa=ag_io(t,c.text,c.task+0.6,0.8)+0.6*ag_io(t,P.billions,c.largest,0.6);dm_textIn(x,mx,my,t,fa);
    ag_pill(x,470,380,"Text from the web and books",{a:ag_io(t,P.huge-0.2,c.task,0.5)});
    ag_modelLight(x,mx,my,R,0.6);ag_model(x,mx,my,R,{t,core:0.7,think:ag_io(t,P.guessW,P.adjust+1.2,0.4)});
    // guess the next word, check it, adjust
    const ta=ag_io(t,c.task-0.3,c.largest-0.3,0.5);if(ta>0){const filled=ag_in(t,P.guessW+0.4,0.4);x.save();x.globalAlpha*=ta;ag_box(x,140,430,760,130,22,{});
      ag_T(x,"The data team fixed the",184,512,{w:700,size:38});const bx=184+ag_tw(x,"The data team fixed the ",{w:700,size:38});
      x.strokeStyle=rgba(AG.violet,0.8);x.lineWidth=3;x.beginPath();x.moveTo(bx,524);x.lineTo(bx+140,524);x.stroke();if(filled>0)ag_T(x,"report",bx,512,{w:700,size:38,col:AG.violet,a:filled});
      if(t>P.check)ag_tick(x,bx+176,496,30,rgba(AG.green,ag_in(t,P.check,0.3)),5);
      const steps=[["Guess",P.guessW,AG.violet],["Check",P.check,AG.green],["Adjust",P.adjust,AG.blue]],cyc=t>P.billions?Math.floor((t-P.billions)*3)%3:-1;
      steps.forEach(([s2,t0,col],i)=>{const on=cyc>=0?cyc===i:t>t0-0.2&&t<(steps[i+1]?steps[i+1][1]-0.2:t0+1.4);ag_pill(x,260+i*250,650,s2,{size:32,a:ag_in(t,t0-0.2,0.4),col:on?col:null});
        if(i<2){x.save();x.globalAlpha*=ag_in(t,steps[i+1][1]-0.3,0.4);ag_arrowHead(x,260+i*250+170,650,0,12,rgba(AG.label,0.7));x.restore();}});x.restore();}
    // billions of times: grammar, facts, ways of writing, taken in
    const ba=ag_io(t,P.billions-0.2,c.help-0.3,0.5);if(ba>0){ag_pill(x,520,372,dm_num(Math.round(Math.pow(10,lerp(0,9,ag_eo(clamp((t-P.billions)/1.8,0,1))))))+" times",{size:34,a:ba*(1-ag_in(t,P.hundred+0.6,0.6))});
      [["Grammar",P.grammar],["Facts",P.facts],["Ways of writing",P.ways]].forEach(([s2,t0],i)=>{const inA=ag_in(t,c.largest-0.2+i*0.15,0.9),px=lerp(1080,mx,ag_sine(inA)),py=lerp(440+i*100,my,ag_sine(inA));
        x.save();ag_about(x,px,py,1-1.2*Math.max(0,inA-0.5));ag_pill(x,px,py,s2,{size:32,a:ba*ag_in(t,t0-0.1,0.4)*(1-sstep(0.5,0.7,inA)),col:AG.violet});x.restore();});}
    // a hundred and seventy-five billion numbers to tune
    const na=ag_io(t,P.hundred-0.2,c.help-0.2,0.6);if(na>0){x.save();x.globalAlpha*=na;ag_box(x,mx-350,768,700,92,20,{});
      for(let k=0;k<4;k++){const dx=mx-308+k*44,dy=814;x.fillStyle="#fff";x.beginPath();x.arc(dx,dy,17,0,TAU);x.fill();x.strokeStyle=rgba(AG.label,0.4);x.lineWidth=2;x.stroke();
        const an=Math.sin(t*1.7+k*1.3)*1.4;x.strokeStyle=rgba(AG.blue,0.95);x.lineWidth=4;x.beginPath();x.moveTo(dx,dy);x.lineTo(dx+Math.sin(an)*12,dy-Math.cos(an)*12);x.stroke();}
      ag_T(x,"175,000,000,000 numbers to tune",mx+96,826,{w:700,size:32,align:"center"});x.restore();}
    // it wrote fluently, but only carried on the text
    const ha=ag_in(t,c.help-0.3,0.6);if(ha>0){x.save();x.globalAlpha*=ha;ag_box(x,140,400,780,300,22,{});ag_T(x,"How do I reset my password?",184,470,{w:800,size:34});
      const ty=clamp((t-P.fluently)/(P.carried-P.fluently+0.4),0,1),all=DM_MORE.join("\n"),n=Math.floor(all.length*ty);let shown=all.slice(0,n).split("\n");
      shown.forEach((l,i)=>ag_T(x,l,184,540+i*50,{w:500,size:32,col:AG.violet}));
      if(ty<1&&Math.floor(t*2.5)%2===0){const lx=184+ag_tw(x,shown[shown.length-1]||"",{w:500,size:32});x.fillStyle=rgba(AG.violet,0.9);x.fillRect(lx+4,510+(shown.length-1)*50,3,38);}
      x.restore();ag_verdict(x,530,780,"It only carried on the text","loop",ag_in(t,P.carried-0.2,0.5));}}}],0.6);});

// ---- 7 · Helpful, with hands: 2022, people rank answers; 2024, steps before an answer; tools; a loop: an agent ----
const DM_ANS=[["Here is how to reset it: go to","Settings, then Password."],["Passwords can be reset","in several ways."],["How do I change my email?"]];
scene("helpful",(ctx,S,t,sc)=>{const c=sc.cues,P=dm_once(sc,"P",()=>({rank:wAt(sc,"rank","rank"),best:wAt(sc,"rank","best"),trained:wAt(sc,"trained","trained"),preferred:wAt(sc,"trained","preferred"),
    smallerW:wAt(sc,"smaller","preferred"),hundred:wAt(sc,"smaller","a hundred times"),step:wAt(sc,"steps","step by step"),before:wAt(sc,"steps","before they answer"),
    tools:wAt(sc,"tools","tools"),search:wAt(sc,"tools","search"),query:wAt(sc,"tools","run a query"),file:wAt(sc,"tools","read a file"),back:wAt(sc,"tools","what comes back"),
    reasons:wAt(sc,"agent","reasons"),hands:wAt(sc,"agent","hands"),loop:wAt(sc,"agent","in a loop"),agentW:wAt(sc,"agent","an agent")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"dmLab",keys:[[0,960,540,1.025],[0.3,960,540,1]],d:2.0,draw:(x,t)=>{
    dm_railAt(x,t,[[0,2020,40],[0.7,2020,40],[2.3,2022,40],[c.steps-0.6,2022,40],[c.steps+1.0,2024,40]]);
    // people rank a model's answers, from best to worst
    const ra=ag_io(t,c.rank-0.3,c.smaller-0.9,0.6);if(ra>0){x.save();x.globalAlpha*=ra;ag_person(x,DM_PEOPLE.rater,300,620,0.92,{t,pose:"hang",pose2:"point",mix:ag_in(t,P.rank-0.2,0.8),gaze:[4,1],smile:0.3});
      DM_ANS.forEach((a2,i)=>{const rk=ag_in(t,P.best-0.6+i*0.55,0.3)>0.5?i+1:0;dm_answer(x,640,370+i*150,580,a2,rk,{edge:rk===1?AG.green:null,a:ag_in(t,c.rank+0.2+i*0.2,0.4)});});x.restore();}
    // trained on the answers people preferred
    const ma=ag_io(t,c.rank+0.4,c.smaller-0.9,0.6),glow=ag_in(t,P.preferred-0.2,0.8);if(ma>0){ag_modelLight(x,1560,560,100,ma*(0.4+0.5*glow));ag_model(x,1560,560,100,{t,core:0.5+0.5*glow,a:ma});}
    const fb=ag_io(t,P.trained-0.3,c.smaller-0.9,0.4);if(fb>0){x.save();x.globalAlpha*=fb;x.strokeStyle=rgba(AG.green,0.8);x.lineWidth=4;x.setLineDash([12,10]);x.lineDashOffset=-t*30;
      x.beginPath();x.moveTo(1240,440);x.quadraticCurveTo(1380,400,1450,500);x.stroke();x.setLineDash([]);ag_arrowHead(x,1452,504,1.0,14,rgba(AG.green,0.9));x.restore();}
    // preferred to a model a hundred times bigger
    const ca=ag_io(t,c.smaller-0.25,c.steps-0.3,0.6);if(ca>0){ag_modelLight(x,640,560,96,ca*0.7);ag_model(x,640,560,96,{t,core:1,a:ca});
      ag_T(x,"Trained on people’s choices",640,720,{w:700,size:30,align:"center",a:ca});ag_verdict(x,640,400,"Preferred","pass",ca*ag_in(t,P.smallerW-0.2,0.5));
      ag_model(x,1300,540,230,{t,core:0.45,a:ca*ag_in(t,P.hundred-0.5,0.7)});ag_T(x,"100 times bigger",1300,830,{w:700,size:30,align:"center",col:AG.mut,a:ca*ag_in(t,P.hundred-0.3,0.5)});}
    // since 2024: work through it step by step before answering
    const MX=560,MY=560,ma2=ag_in(t,c.steps-0.4,0.6)*(1-ag_in(t,P.loop-0.6,0.6));if(ma2>0){ag_modelLight(x,MX,MY,120,ma2*0.8);ag_model(x,MX,MY,120,{t,core:0.9,think:ag_io(t,c.steps,c.tools+1,0.5),a:ma2});}
    const st=ag_io(t,P.step-0.4,c.tools-0.2,0.5);if(st>0){const ST=["1  Read the question","2  Work it out","3  Check the work"];x.save();x.globalAlpha*=st;x.strokeStyle=rgba(AG.violet,0.35);x.lineWidth=3;
      x.beginPath();x.moveTo(1040,410);x.lineTo(1040,730);x.stroke();x.restore();
      ST.forEach((s2,i)=>ag_pill(x,1040,410+i*104,s2,{size:32,a:st*ag_in(t,P.step-0.2+i*0.5,0.4),col:AG.violet}));ag_pill(x,1040,730,"Answer",{size:32,a:st*ag_in(t,P.before,0.4),col:AG.green});}
    // hands for tools: search, run a query, read a file; what comes back is data
    const ha=ag_io(t,c.tools-0.3,P.loop-0.4,0.5);if(ha>0){[["Search",P.search,390],["Query",P.query,560],["Files",P.file,730]].forEach(([n,t0,ty])=>{const u=ag_in(t,t0-0.5,0.8);
      ag_tool(x,1400,ty-56,320,112,n,{a:ha,touch:u});ag_reach(x,[MX+124,MY,MX+400,MY,1100,ty,1390,ty],u*ha,{data:ag_in(t,P.back-0.2,1.2)});});}
    // a model that reasons, with hands for tools, in a loop: an agent
    const la=ag_in(t,P.loop-0.5,0.9);if(la>0){ag_loop(x,960,580,{R:200,r:100,p:la,core:0.9,think:0.4,t,lit:Math.floor(t*1.1)%3,a:la});
      ag_pill(x,960,842,"An agent",{size:36,a:ag_in(t,P.agentW-0.2,0.5),col:AG.violet});}}}],0.6);});

// ---- 8 · Why it seemed sudden: computing power, data and money arrived together; printing waited for its pieces too ----
// today's picture, beside Mainz's: the model on its chips
function dm_today(c,x,y,w,h){const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,"#EDEBE6");g.addColorStop(1,"#D9D4CB");c.fillStyle=g;c.fillRect(x,y,w,h);
  for(let k=0;k<5;k++)dm_chip(c,x+40+k*(w-80)/5,y+h-86,0.3,0.5,1);ag_modelLight(c,x+w/2,y+h*0.4,70,0.6);ag_model(c,x+w/2,y+h*0.4,70,{t:2,core:0.8});}
// pills in a row, centred at cx and measured so they never touch; items: [[text, alpha], ...]
function dm_pillRow(ctx,cx,y,items,o){o=o||{};const size=o.size||28,gap=o.gap||14,ws=items.map(it=>ag_tw(ctx,it[0],{w:700,size})+56),tot=ws.reduce((s,v)=>s+v,0)+gap*(items.length-1);
  let px=cx-tot/2;items.forEach((it,i)=>{ag_pill(ctx,px+ws[i]/2,y,it[0],{size,a:it[1]});px+=ws[i]+gap;});}
// one of the three things that arrived together: a card whose lower part grows to show what it brought; draw(ctx,x,y,w,h) fills that part
function dm_thing(ctx,x,y,w,icon,title,o){const a=o.a==null?1:o.a;if(a<=0)return;const g=clamp(o.grow||0,0,1),h=lerp(232,520,ag_sine(g));
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+116,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,22,{});ctx.save();ctx.translate(x+w/2,y+84);dm_icon(ctx,icon);ctx.restore();
  const ta=o.ta==null?1:o.ta;ag_T(ctx,title,x+w/2,y+184,{w:700,size:34,align:"center",a:ta});
  const u=clamp(g*1.6-0.6,0,1)*ta;if(u>0&&o.draw){ctx.save();ctx.globalAlpha*=u;ctx.strokeStyle=rgba(AG.label,0.2);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+40,y+226);ctx.lineTo(x+w-40,y+226);ctx.stroke();
    o.draw(ctx,x,y+232,w,288);ctx.restore();}
  ctx.restore();}
// a stack of n gold coins standing on (x, y)
function dm_coins(c,x,y,n){for(let i=0;i<n;i++){const yy=y-i*8;c.fillStyle="#9A7630";c.beginPath();c.moveTo(x-26,yy);c.lineTo(x-26,yy+6);c.ellipse(x,yy+6,26,10,0,Math.PI,0,true);c.lineTo(x+26,yy);c.closePath();c.fill();
    const g=c.createLinearGradient(x-26,0,x+26,0);g.addColorStop(0,"#F0D88E");g.addColorStop(1,"#C69A42");c.fillStyle=g;c.beginPath();c.ellipse(x,yy,26,10,0,0,TAU);c.fill();
    c.strokeStyle="rgba(122,92,34,0.55)";c.lineWidth=1.2;c.stroke();}}
// the film's last word, large: a kicker and one line
function dm_bigCard(ctx,cx,y,kick,title,o){const a=o.a==null?1:o.a;if(a<=0)return;const tw=ag_tw(ctx,title,{w:700,size:48}),w=Math.max(760,tw+120),h=196,x=cx-w/2;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,cx,y+h/2,lerp(0.6,1,o.k));ag_box(ctx,x,y,w,h,26,{});
  ag_T(ctx,kick.toUpperCase(),cx,y+72,{w:700,size:30,ls:4,align:"center",col:AG.violet});
  ag_T(ctx,title,cx,y+146,{w:700,size:48,align:"center",a:o.ta==null?1:o.ta});ctx.restore();}
scene("sudden",(ctx,S,t,sc)=>{const c=sc.cues,P=dm_once(sc,"P",()=>({suddenW:wAt(sc,"why","sudden"),three:wAt(sc,"three","three things"),
    ten:wAt(sc,"compute","twenty ten"),doubled:wAt(sc,"compute","doubled"),six:wAt(sc,"compute","six months"),
    web:wAt(sc,"data","the web"),millions:wAt(sc,"data","millions"),nine:wAt(sc,"money","nine hundred"),tens:wAt(sc,"money","tens of millions"),
    longW:wAt(sc,"long","long work"),metal:wAt(sc,"printing","metal letters"),paperW:wAt(sc,"printing","paper"),
    press:wAt(sc,"printing","a press"),lender:wAt(sc,"printing","a lender"),chips:wAt(sc,"decades","chips"),data2:wAt(sc,"decades","data"),money2:wAt(sc,"decades","money"),
    magic:wAt(sc,"team","magic"),where:wAt(sc,"team","where it came from"),tH:(SCENES.find(s=>s.id==="helpful")||{dur:0}).dur}));
  // the rail, the same in both shots so it carries across the cut. It pulls back from 2024 to the whole road, where the years after 2012 crowd so
  // close that 2017, 2020 and 2022 become studs between the 2012 and 2024 tabs; they flash one after another at "sudden". A light runs the length
  // of the rail at "long work", lighting every year, and again, quickly, at "where it came from".
  const LATE=[2012,2017,2020,2022,2024],f=ag_keys(t,[[0.6,2024],[3.4,1991]]),pp=ag_keys(t,[[0.6,40],[3.4,25.5]]),X=yr=>960+(yr-f)*pp;
  const flash=(t0,d)=>ag_in(t,t0,0.12)*(1-ag_in(t,t0+0.2,d||0.9)),run=(t0,d,yr,back)=>ag_in(t,t0+(back?2024-yr:yr-1958)/66*d,0.3),T_IN=c.long-0.35,T_RUN=c.long+0.9;
  const lit=yr=>{const i=LATE.indexOf(yr),first=yr===2024?1-ag_in(t,0.6,1.0):0,land=yr===2024?flash(1.85,0.8):0,burst=i>=0?Math.max(flash(P.suddenW-0.1+i*0.13,0.8),flash(T_RUN-0.25+(4-i)*0.05,0.6)):0,
      long=run(T_RUN,1.8,yr,true)*(0.75-0.4*ag_in(t,c.printing-0.4,1.4)),again=run(P.where-0.3,0.9,yr)*(1-ag_in(t,P.where+1.2,1.0))*0.5;
    return clamp(Math.max(first,land,burst,0.18+long+again),0,1);};
  const glow=(x,t0,d,amt,back)=>{const u=(t-t0)/d;if(u<0||u>1.6)return;const gx=back?lerp(X(2024)+60,X(1958)-60,clamp(u,0,1)):lerp(X(1958)-60,X(2024)+60,clamp(u,0,1)),fa=amt*(u<1?ag_in(t,t0,0.3):1-clamp((u-1)/0.6,0,1));if(fa<=0)return;
    x.save();x.globalCompositeOperation="screen";const g=x.createRadialGradient(gx,196,0,gx,196,120);g.addColorStop(0,"rgba(255,226,170,"+(0.75*fa).toFixed(3)+")");g.addColorStop(1,"rgba(255,226,170,0)");
    x.fillStyle=g;x.fillRect(gx-120,76,240,240);x.restore();};
  const rail=x=>{dm_labRail(x,{focus:f,ppy:pp,grow:0.16*(1-ag_in(t,0.6,1.0)),lit,pin:yr=>yr>2012&&yr<2024?ag_in(t,1.5,1.0):0,drop:yr=>yr===2024?lerp(72,0,ag_in(t,2.2,0.9)):null});
    glow(x,T_RUN,1.8,1,true);glow(x,P.where-0.3,0.9,0.6);};
  // what each thing brought: computing that doubles about every six months since 2010; the web and labelled examples; $900, then tens of millions or more
  const DRAW=[
    (q,x0,y0,w,h)=>{const A=x0+56,B=x0+w-44,base=y0+196,top=y0+58,Xy=yr=>A+(yr-1960)/64*(B-A),Ly=yr=>yr<2010?0.03+(yr-1960)/50*0.09:0.12+Math.pow((yr-2010)/14,2.6)*0.88,
        v=ag_keys(t,[[c.compute+0.2,0],[P.ten+0.5,50/64],[P.doubled,50/64],[P.six+0.4,1]]),m=ag_in(t,P.ten,0.5);
      q.strokeStyle=rgba(AG.label,0.35);q.lineWidth=2;q.beginPath();q.moveTo(A,base);q.lineTo(B,base);q.stroke();
      if(m>0){const yT=base-Ly(2010)*(base-top);q.save();q.globalAlpha*=m;q.setLineDash([6,8]);q.beginPath();q.moveTo(Xy(2010),base);q.lineTo(Xy(2010),yT);q.stroke();q.restore();}
      q.save();q.strokeStyle=rgba(AG.blue,0.95);q.lineWidth=6;q.lineCap="round";q.lineJoin="round";q.beginPath();
      for(let k=0;k<=128;k++){const u=k/128;if(u>v)break;const yr=1960+u*64,px=A+u*(B-A),py=base-Ly(yr)*(base-top);if(k===0)q.moveTo(px,py);else q.lineTo(px,py);}q.stroke();q.restore();
      if(m>0){q.save();q.globalAlpha*=m;q.fillStyle=rgba(AG.blue,1);q.beginPath();q.arc(Xy(2010),base-Ly(2010)*(base-top),7,0,TAU);q.fill();q.restore();}
      ag_T(q,"1960",A+30,base+46,{w:600,size:28,align:"center",col:AG.mut});ag_T(q,"2010",Xy(2010),base+46,{w:600,size:28,align:"center",col:AG.mut,a:m});
      ag_T(q,"Doubling every 6 months",A-6,top+8,{w:700,size:28,col:AG.blue,a:ag_in(t,P.doubled-0.2,0.5)});},
    (q,x0,y0,w,h)=>{const r1=ag_in(t,P.web-0.3,0.5),r2=ag_in(t,P.millions-0.3,0.5);
      if(r1>0){q.save();q.globalAlpha*=r1;q.translate(x0+104,y0+82);q.scale(0.85,0.85);DM_ICONS.pages(q);q.restore();ag_T(q,"The web",x0+184,y0+92,{w:700,size:30,a:r1});}
      if(r2>0){q.save();q.globalAlpha*=r2;q.translate(x0+104,y0+204);q.scale(0.85,0.85);DM_ICONS.photos(q);q.restore();ag_T(q,"Labelled examples",x0+184,y0+214,{w:700,size:30,a:r2});}},
    (q,x0,y0,w,h)=>{const m1=ag_in(t,P.nine-0.3,0.5),base=y0+196,m2=ag_in(t,P.tens+0.1,0.5);
      if(m1>0){q.save();q.globalAlpha*=m1;dm_coins(q,x0+92,base,2);q.restore();ag_T(q,"$900",x0+92,base-54,{w:700,size:32,align:"center",a:m1});ag_T(q,"2017",x0+92,base+50,{w:600,size:28,align:"center",col:AG.mut,a:m1});}
      [9,12,10,13,11,8].forEach((n,i)=>{const g=ag_in(t,P.tens-0.4+i*0.08,0.7);if(g>0)dm_coins(q,x0+200+i*50,base,Math.max(1,Math.round(n*g)));});
      ag_T(q,"Tens of millions+",x0+325,y0+52,{w:700,size:30,align:"center",a:m2});ag_T(q,"2023",x0+325,base+50,{w:600,size:28,align:"center",col:AG.mut,a:m2});}];
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"dmLab",push:0,keys:[[0,960,540,1.025],[0.6,960,540,1]],d:2.8,draw:(x,t)=>{rail(x);
      // the agent from the last chapter goes to its place on the rail: 2024
      const fl=ag_in(t,0.5,1.4);if(fl<1){const Y24=196+22+lerp(72,0,ag_in(t,2.2,0.9)),px=lerp(960,X(2024),fl),py=lerp(580,Y24,fl)-Math.sin(Math.PI*fl)*40,k=lerp(1,0.06,ag_eo(fl)),
          la=1-ag_in(t,0.15,0.4),tH=P.tH+t;
        x.save();x.translate(px,py);x.scale(k,k);ag_loop(x,0,0,{R:200,r:100,p:1,core:0.9,think:0.4,t:tH,lit:Math.floor(tH*1.1)%3,stepA:[la,la,la],label:"",a:1-ag_in(t,1.55,0.35)});x.restore();
        if(la>0)ag_T(x,"Model",960,640,{w:700,size:28,align:"center",col:AG.label,a:la});
        ag_pill(x,960,842,"An agent",{size:36,a:1-ag_in(t,0.05,0.4),col:AG.violet});}
      // three things arrived together, and each card grows, in turn, to show what it brought
      const on=ag_in(t,c.compute-0.3,0.4),focus=[ag_io(t,c.compute-0.3,c.data-0.3,0.4),ag_io(t,c.data-0.3,c.money-0.3,0.4),ag_in(t,c.money-0.3,0.4)];
      [["chip","Computing power",c.compute],["pages","Data",c.data],["coins","Money",c.money]].forEach(([icon,title,tg],i)=>{const t0=P.three-0.15+i*0.07,ar=ag_in(t,t0,0.5),tf=T_IN+i*0.12,fly=ag_in(t,tf,1.0);
        if(ar<=0||fly>=1)return;const cx0=370+i*590,cy0=590,fs=lerp(1,0.07,ag_eo(fly));x.save();x.translate((X(2017)+(i-1)*44-cx0)*fly,(196-cy0)*fly);ag_about(x,cx0,cy0,fs);
        dm_thing(x,120+i*590,330+(1-ag_spr(t,t0,0.8))*70,500,icon,title,{a:ar*(1-0.42*(1-focus[i])*on*(1-ag_in(t,tf-0.3,0.3)))*(1-ag_in(t,tf+0.75,0.25)),ta:1-ag_in(t,tf-0.35,0.25),grow:ag_in(t,tg-0.2,1.0),draw:DRAW[i]});x.restore();});
      // the takeaway
      const ka=ag_io(t,c.long+0.95,c.printing-0.4,0.5);if(ka>0)dm_bigCard(x,960,430,"Not a sudden discovery","Long work that finally had the power to run",{a:ka,k:ag_spr(t,c.long+0.95,0.7)});
      // printing waited four hundred years for its pieces; these ideas waited decades for theirs
      const pa=ag_in(t,c.printing-0.3,0.8);if(pa>0){ag_picture(x,100,340,700,340,{img:ag_place("dmMainz"),a:pa});
        dm_pillRow(x,450,752,[["Metal letters",pa*ag_in(t,P.metal-0.2,0.4)],["Paper",pa*ag_in(t,P.paperW-0.2,0.4)],["A press",pa*ag_in(t,P.press-0.2,0.4)],["A lender",pa*ag_in(t,P.lender-0.2,0.4)]]);
        ag_T(x,"About 400 years",450,836,{w:700,size:32,align:"center",a:pa*ag_in(t,P.lender+0.3,0.5)});}
      const qa=ag_in(t,c.decades-0.3,0.8);if(qa>0){ag_picture(x,1120,340,700,340,{draw:(c2,px,py,pw,ph)=>dm_today(c2,px,py,pw,ph),a:qa});
        dm_pillRow(x,1470,752,[["Chips",qa*ag_in(t,P.chips-0.2,0.4)],["Data",qa*ag_in(t,P.data2-0.2,0.4)],["Money",qa*ag_in(t,P.money2-0.2,0.4)]]);
        ag_T(x,"About 60 years",1470,836,{w:700,size:32,align:"center",a:qa*ag_in(t,P.money2+0.3,0.5)});}}},
    // Jun's team, under the same rail: nobody expects magic or needs to fear it, because they know where it came from
    {at:c.team-0.4,place:"dmLab",push:0.012,keys:[[c.team-0.4,960,540,1]],d:2.0,draw:(x,t)=>{rail(x);
      dm_team(x,{t,agent:1,think:0.2,yusuf:1,mei:1,ySmile:0.2+0.3*ag_in(t,P.where-0.4,0.8),mSmile:0.2+0.3*ag_in(t,P.where-0.2,0.8),junSmile:0.3+0.25*ag_in(t,P.magic,0.8)});}}],0.6);
  ag_end(ctx,S,t,c.breath+0.6,"Decades in the making","Long work that finally had the power to run","Film 1 of 9","What an agent is");});

// chapters that open on a cut: each shows people, a place or words the chapter before ends on, which a crossfade would show twice
ag_cutInto(["mistakes", "web"]);
