/* ===== Proof it held: the scenes =====
   Seven chapters, each timed to its narration: wAt(sc, "line", "word") is the moment a word is said. The places are painted once
   (ph_vial.js: the clinic and the label; ph_pages.js: the hall); what moves is drawn live. In the hall the camera glides and only what
   changes fades: a page that gives way to another leaves first, then the next comes in, so no words show twice; a person comes and
   goes faded whole (ph_whole). Between the hall and the vial, shots that show the same thing come in on a cut. The title card ends
   chapter 1, the end card chapter 7. */

const ph_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// what fn draws, laid on the picture at opacity a as one picture, so a person fading never shows through themselves
function ph_whole(ctx,a,fn){if(a<=0.004)return;if(a>=0.996){fn(ctx);return;}const cv=ctx.canvas,[bc,bx]=ag_buf("phWhole",cv.width,cv.height);
  bx.setTransform(ctx.getTransform());fn(bx);ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha*=a;ctx.drawImage(bc,0,0);ctx.restore();}
// in from t0, out from t1 (each over d): a thing that comes and goes in one shot; out before the next thing comes in its place
const ph_ab=(t,t0,t1,d)=>ag_in(t,t0,d||0.5)*(t1==null?1:1-ag_in(t,t1,d||0.4));
// a person, faded whole, in the hall's glass light (or the clinic's lamp)
function ph_person(ctx,who,x,y,s,a,o){ph_whole(ctx,a,c=>dp_person(c,who,x,y,s,o));}
// the people's places in the hall: Mei and Anil at the left, facing right; Yusuf at the right, facing left
const PH_AT={left:[280,632,0.9],right:[1660,632,0.9]};
const PH_NAMEY=206;

/* ---------------------------------------------------------------- 1 · The square on the vial */
scene("square",(ctx,S,t,sc)=>{const c=sc.cues,T=ph_once(sc,"T",()=>({
    workers:wAt(sc,"place","health workers"),polioW:wAt(sc,"polio","Polio"),paralysed:wAt(sc,"polio","paralysed"),
    two:wAt(sc,"drops","two drops"),vial:wAt(sc,"drops","vial"),cold:wAt(sc,"cold","cold"),factory:wAt(sc,"cold","factory"),child0:wAt(sc,"cold","child"),
    heat:wAt(sc,"heat","heat"),noSign:wAt(sc,"heat","no sign"),sun:wAt(sc,"sun","sun"),good:wAt(sc,"sun","good one"),
    threw:wAt(sc,"threw","threw away"),vouch:wAt(sc,"threw","vouch"),given:wAt(sc,"child","given"),safe:wAt(sc,"child","safe"),
    see:wAt(sc,"change","whether the cold"),y1979:wAt(sc,"asked","World Health"),show:wAt(sc,"asked","show it"),path:wAt(sc,"path","PATH"),company:wAt(sc,"path","company"),monitor:wAt(sc,"path","vaccine vial monitor"),
    sq:wAt(sc,"square","square"),circle:wAt(sc,"square","circle"),darkens:wAt(sc,"darkens","darkens"),never:wAt(sc,"darkens","never"),
    lighter:wAt(sc,"lighter","Lighter"),used:wAt(sc,"lighter","used"),asDark:wAt(sc,"darker","As dark"),away:wAt(sc,"darker","thrown away"),
    y1996:wAt(sc,"cents","ninety-six"),cents:wAt(sc,"cents","few cents"),use:wAt(sc,"moment","moment of use"),good2:wAt(sc,"moment","still good"),
    unicef:wAt(sc,"saves","UNICEF"),million:wAt(sc,"saves","fourteen million"),protects:wAt(sc,"protects","still protects"),
    same:wAt(sc,"data","same problem"),failed:wAt(sc,"mark","failed"),held:wAt(sc,"mark","one that held"),wrong:wAt(sc,"mark","wrong person"),noMark:wAt(sc,"mark","no mark"),
    adds:wAt(sc,"adds","adds the monitor"),study:wAt(sc,"adds","Anil's study"),proof:wAt(sc,"adds","proof"),
    learner:wAt(sc,"show","any learner"),who:wAt(sc,"show","who could see"),did:wAt(sc,"show","who did")}));
  const end=c.breath;
  ag_shots(ctx,S,t,sc.dur,[
    // a clinic at night: a health worker of the time, a vial in hand; polio, said, never drawn
    {at:0,place:"phClinic",keys:[[0,980,540,1.0]],push:0.02,draw:(cx,tt)=>{
      dp_person(cx,PH_WORKER,520,520,1.0,{t:tt,light:"lamp",pose:"hold",gaze:[3,2],nod:0.06,cut:830,holdBack:(c2,h)=>ph_heldVial(c2,h,0.1)});ph_benchFront(cx);
      dp_tag(cx,72,60,"Polio vaccine · from the 1970s","cyan",{a:ag_in(tt,T.workers-0.3,0.5),behind:"phClinic"});
      dp_card(cx,790,300,560,{kick:"Polio",title:"Can leave a child paralysed for life",sub:null},{col:"coral",a:ag_in(tt,T.polioW-0.2,0.5),k:Math.min(1,ag_spr(tt,T.polioW-0.2,0.6)),behind:"phClinic"});}},
    // close on a vial: two drops by mouth; the cold chain, from the factory to the child; heat leaves no sign
    {at:c.drops-0.4,place:"phLabel",cut:true,keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const sunA=ag_in(tt,T.heat-0.2,0.8),two=ag_in(tt,T.sun-0.3,0.6),chain=ph_ab(tt,T.cold-0.3,T.heat-0.4,0.5);
      // the cold chain, along the top: four stops, lit in turn
      if(chain>0){const st=["Factory","Cold store","Clinic","Child"],x0=300,dx=440,y=170;cx.save();cx.globalAlpha*=chain;
        const p=ag_sine(clamp((tt-T.factory+0.2)/(T.child0-T.factory+0.6),0,1));dp_link(cx,[x0,y],[x0+dx*3,y],"cyan",p,{dot:false});
        st.forEach((s,i)=>{const on=p>=i/3-0.01;dp_slip(cx,x0+i*dx,y-35,s,on?"cyan":"grey",{align:"center",size:28,a:0.5+0.5*(on?1:0),behind:"phLabel"});});cx.restore();}
      ph_sun(cx,1720,140,900,sunA);
      // the vial: alone, then beside one kept cold; both look the same
      const vx=lerp(640,560,ag_sine(two)),dropA=[T.two,T.two+0.9];
      ph_vial(cx,vx,780,1.75,{dark:0.1,warm:0,drop:Math.max(clamp((tt-dropA[0])/1.0,0,1)*(tt<dropA[1]+0.6?1:0),tt>dropA[1]?clamp((tt-dropA[1])/1.0,0,1):0)});
      if(tt>T.two-0.2&&tt<T.cold)dp_tag(cx,960,420,"2 drops · by mouth","cyan",{a:ph_ab(tt,T.two-0.2,T.vial+0.6,0.4),behind:"phLabel"});
      dp_tag(cx,940,560,"A vial","cyan",{a:ph_ab(tt,T.vial-0.2,T.cold-0.5,0.4),to:[vx+70,560],behind:"phLabel"});
      if(two>0){ph_vial(cx,1300,780,1.75,{dark:0.1,warm:sunA,a:two});
        dp_slip(cx,560,820,"Kept cold","cyan",{align:"center",size:28,a:two,behind:"phLabel"});dp_slip(cx,1300,820,"Left in the sun","grey",{align:"center",size:28,a:two,behind:"phLabel"});
        ph_ask(cx,930,520,96,ag_in(tt,T.good-0.3,0.5));}
      if(tt<T.sun)dp_tag(cx,1080,300,"Heat leaves no sign","grey",{a:ph_ab(tt,T.noSign-0.3,T.sun-0.4,0.4),behind:"phLabel"});}},
    // so they threw vials away, or a child was given vaccine that no longer worked
    {at:c.threw-0.4,place:"phClinic",cut:true,keys:[[0,980,540,1.0]],push:0.02,draw:(cx,tt)=>{
      dp_person(cx,PH_WORKER,520,520,1.0,{t:tt,light:"lamp",pose:"hold",gaze:[3,2],nod:0.06,cut:830,holdBack:(c2,h)=>ph_heldVial(c2,h,0.1)});ph_benchFront(cx);
      ph_bin(cx,1060,830,0.9,{});
      // three vials on the bench go one by one into the bin
      for(let i=0;i<3;i++){const t0=T.threw+0.2+i*0.55,u=ag_sine(clamp((tt-t0)/0.9,0,1)),x=lerp(1250+i*110,1060,u),y=830-ag_eo(u)*70+u*u*90;
        const a=1-ag_in(tt,t0+0.75,0.3);if(a>0)ph_vial(cx,x,y,0.62,{dark:0.1,a,tilt:-u*0.9,label:true});}
      dp_slip(cx,1060,560,"Thrown away: can't vouch for it","coral",{ink:true,align:"center",size:28,a:ph_ab(tt,T.vouch-0.3,T.given-0.6,0.4),behind:"phClinic"});
      dp_card(cx,780,190,620,{kick:"Or given anyway",title:"No protection left",sub:"and the family thought the child was safe"},{col:"coral",a:ag_in(tt,T.given-0.1,0.5),k:Math.min(1,ag_spr(tt,T.given-0.1,0.6)),behind:"phClinic"});}},
    // they needed to see whether the cold had held; the WHO asks, PATH and a company make one
    {at:c.change-0.4,place:"phLabel",cut:true,keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      ph_vial(cx,560,780,1.75,{dark:0.1});ph_ask(cx,560,330,110,ph_ab(tt,T.see-0.4,T.y1979+0.2,0.5));
      dp_card(cx,1000,150,760,{kick:"1979",title:"The World Health Organization",sub:"asks for a way to show it"},{col:"cyan",a:ag_in(tt,T.y1979-0.6,0.5),k:Math.min(1,ag_spr(tt,T.y1979-0.6,0.6)),behind:"phLabel"});
      dp_card(cx,1000,420,760,{kick:"PATH, a health non-profit",title:"Years of work with a company",sub:"the vaccine vial monitor"},{col:"cyan",a:ag_in(tt,T.path-0.2,0.5),k:Math.min(1,ag_spr(tt,T.path-0.2,0.6)),behind:"phLabel"});}},
    // the monitor: a square inside a circle; heat darkens the square, and it never turns light again
    {later:true,at:c.square-0.5,place:"phLabel",keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
      const d=0.1+0.42*ag_sine(clamp((tt-T.darkens)/2.6,0,1));
      ph_vial(cx,430,780,1.75,{dark:d});
      const lx=430+22*1.75,ly=780+(-150+28+48)*1.75,lens=ag_in(tt,T.sq-0.2,0.6);
      if(lens>0){cx.save();cx.globalAlpha*=lens;cx.strokeStyle=rgba(DP.ice,0.55);cx.lineWidth=2;cx.beginPath();cx.moveTo(lx+19*1.75,ly);cx.lineTo(1010,330);cx.stroke();cx.restore();
        ph_vvm(cx,1180,330,160,d,{a:lens});}
      dp_T(cx,"The circle: stays the same",1380,210,{w:700,size:30,col:"mut",a:ag_in(tt,T.circle-0.2,0.5)});
      dp_T(cx,"The square: darkens with heat",1380,470,{w:700,size:30,col:"mut",a:ag_in(tt,T.darkens-0.2,0.5)});
      dp_slip(cx,1380,500,"Never lighter again","grey",{size:28,a:ag_in(tt,T.never-0.2,0.5),behind:"phLabel"});
      // three monitors as WHO draws them: usable, at the discard point, beyond it
      const st=[[0.15,"USE","green",T.lighter],[0.75,"DO NOT USE","coral",T.asDark],[1,"DO NOT USE","coral",T.asDark+0.6]];
      st.forEach(([dd,l,cc,t0],i)=>{const sa=ag_in(tt,t0-0.2,0.5),x=1000+i*300;if(sa<=0)return;ph_vvm(cx,x,700,64,dd,{a:sa});dp_pill(cx,x,826,l,cc,{align:"center",a:ag_in(tt,t0+0.3,0.4)});});}},
    // 1996: on polio vaccine, at the moment of use; over $14 million a year; a child still protected
    {at:c.cents-0.4,place:"phClinic",cut:true,keys:[[0,980,540,1.0]],push:0.02,draw:(cx,tt)=>{
      dp_person(cx,PH_WORKER,520,520,1.0,{t:tt,light:"lamp",pose:"hold",gaze:[3,2],nod:0.06,cut:830,holdBack:(c2,h)=>ph_heldVial(c2,h,0.15)});ph_benchFront(cx);
      dp_tag(cx,72,60,"1996 · on polio vaccine · a few cents a vial","cyan",{a:ag_in(tt,T.y1996-0.3,0.5),behind:"phClinic"});
      // at the moment of use, the monitor on the vial in her hand, seen close: lighter than its circle
      const la=ag_in(tt,T.use-0.3,0.5);if(la>0){const [hx,hy]=ph_labelAt(cx),dx=900-hx,dy=580-hy,dd=Math.hypot(dx,dy)||1;
        cx.save();cx.globalAlpha*=la;cx.strokeStyle=rgba(DP.ice,0.5);cx.lineWidth=2;cx.beginPath();cx.moveTo(hx+dx/dd*14,hy+dy/dd*14);cx.lineTo(900-dx/dd*64,580-dy/dd*64);cx.stroke();cx.restore();
        ph_vvm(cx,900,580,62,0.15,{a:la});dp_pill(cx,900,694,"USE","green",{align:"center",a:ag_in(tt,T.use+0.3,0.4)});}
      dp_card(cx,780,150,600,{kick:"UNICEF and WHO estimate",title:"Over $14 million a year",sub:"in good vaccine no longer thrown away"},{col:"green",a:ag_in(tt,T.unicef-0.2,0.5),k:Math.min(1,ag_spr(tt,T.unicef-0.2,0.6)),behind:"phClinic"});
      dp_slip(cx,1060,730,"A child, still protected","green",{size:30,a:ag_in(tt,T.protects-0.3,0.5),behind:"phClinic"});}},
    // data has the same problem: a protection that failed looks just like one that held
    {at:c.data-0.4,place:"phHall",cut:true,keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const out=1-ag_in(tt,T.adds-0.9,0.4);
      if(out>0){cx.save();cx.globalAlpha*=out;
        ph_masked(cx,200,360,640,"Held",{a:ag_in(tt,T.same-0.2,0.5),behind:"phHall"});ph_masked(cx,1080,360,640,"Failed",{a:ag_in(tt,T.failed-0.2,0.5),behind:"phHall"});
        ph_ask(cx,960,456,96,ag_in(tt,T.held,0.5));
        dp_slip(cx,960,600,"Seen by the wrong person: no mark","coral",{ink:true,align:"center",size:30,a:ag_in(tt,T.wrong-0.2,0.5),behind:"phHall"});cx.restore();}
      // the monitor, added to Anil's study; and the question any learner can ask
      const sa=ag_in(tt,T.adds-0.4,0.5);
      if(sa>0){const k=Math.min(1,ag_spr(tt,T.adds-0.4,0.6));cx.save();cx.globalAlpha*=sa;ag_about(cx,560,400,lerp(0.6,1,k));
        dp_panel(cx,200,250,720,300,{col:"green",r:22,behind:"phHall"});dp_T(cx,"HEALTH PROGRESS STUDY",240,310,{w:800,size:28,ls:3,col:"cyan"});
        dp_T(cx,"Proof, whenever someone asks,",240,384,{w:700,size:36});dp_T(cx,"that each protection held",240,434,{w:700,size:36});
        ph_vvm(cx,820,470,40,0.1,{a:ag_in(tt,T.proof,0.5)});cx.restore();}
      ph_asks(cx,1040,250,680,{a:ag_in(tt,T.learner-0.3,0.5),k:Math.min(1,ag_spr(tt,T.learner-0.3,0.6)),ans:ag_in(tt,T.did+0.4,0.6),behind:"phHall"});}}
  ]);
  dp_title(ctx,S,t,end,"Proof it held",null,"FILM 8 OF 8 · ONLY WHAT YOU MAY SEE");
});

/* ---------------------------------------------------------------- 2 · Four promises */
scene("promises",(ctx,S,t,sc)=>{const c=sc.cues,T=ph_once(sc,"T",()=>({
    first:wAt(sc,"months","An agreement first"),mei:wAt(sc,"months","Mei Tanaka"),anil:wAt(sc,"months","Anil Kurian"),
    since:wAt(sc,"built","Since then"),classes:wAt(sc,"built","classes"),copies:wAt(sc,"built","copies"),
    today:wAt(sc,"today","Tuesday"),review:wAt(sc,"today","first review"),yusuf:wAt(sc,"yusuf","Yusuf Demir"),prove:wAt(sc,"yusuf","can we prove"),
    who:wAt(sc,"who","Who"),never:wAt(sc,"never","Never"),where:wAt(sc,"where","Where"),ends:wAt(sc,"ends","Ends"),
    four:wAt(sc,"four","Four promises"),proofs:wAt(sc,"four","four proofs"),record:wAt(sc,"four","record")}));
  const lits=[T.who,T.never,T.where,T.ends];
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"phHall",keys:[[0,960,540,1.0]],push:0.01,draw:(cx,tt)=>{
      // Mei, who signed it; the agreement, as An agreement first sets it down
      const [mx,my,ms]=PH_AT.left;ph_person(cx,"mei",mx,my,ms,ag_in(tt,0,0.6),{t:tt});
      ph_name(cx,mx,PH_NAMEY,"Mei Tanaka","Registrar's office",{align:"center",a:ph_ab(tt,T.mei-0.3,T.today-0.7,0.5),behind:"phHall"});
      let lit=null;lits.forEach((l,k)=>{if(tt>=l-0.2)lit=k;});if(tt>T.four)lit=null;
      ph_agreement(cx,600,130,880,{a:ag_in(tt,0.2,0.6),lit,proof:lits.map(l=>ag_in(tt,l+0.1,0.5)),behind:"phHall"});
      dp_tag(cx,600,52,"From An agreement first","cyan",{a:ph_ab(tt,T.first-0.3,T.today-0.6,0.4),size:28,behind:"phHall"});
      // every protection since, from classes to copies
      const P=["Classes","The least shown","Grants","Tags","One policy","Copies"],pa=ph_ab(tt,T.since-0.3,T.yusuf-0.9,0.4);
      if(pa>0)P.forEach((p,k)=>{const a=pa*ag_in(tt,T.since+k*((T.copies-T.since)/5),0.4);if(a<=0)return;const b=dp_slip(cx,1560,150+k*92,p,"green",{size:28,a,behind:"phHall"});dp_tick(cx,b.x+b.w+30,b.y+b.h/2,"green",a);});
      // today: the first review; Yusuf asks of each line
      ph_calendar(cx,60,96,"Tue 12 Jan 2027","the study's first review",{a:ag_in(tt,T.today-0.2,0.5),k:Math.min(1,ag_spr(tt,T.today-0.2,0.6)),behind:"phHall"});
      const [yx,yy,ys]=PH_AT.right,ya=ag_in(tt,T.yusuf-0.5,0.6);ph_person(cx,"yusuf",yx,yy,ys,ya,{t:tt,flip:true});
      ph_name(cx,yx,PH_NAMEY,"Yusuf Demir","Data governance",{align:"center",a:ag_in(tt,T.yusuf,0.5),behind:"phHall"});
      dp_slip(cx,1040,786,"Can we prove it held?","cyan",{align:"center",size:30,a:ph_ab(tt,T.prove-0.2,T.proofs-0.7,0.5),behind:"phHall"});
      dp_slip(cx,1040,786,"Four promises, four proofs, read from records","green",{align:"center",size:30,a:ag_in(tt,T.proofs-0.2,0.5),behind:"phHall"});}}
  ]);
});

/* ---------------------------------------------------------------- 3 · Who could read it */
scene("review",(ctx,S,t,sc)=>{const c=sc.cues,T=ph_once(sc,"T",()=>({
    first:wAt(sc,"first","who could read"),grants:wAt(sc,"grants","grants"),contract:wAt(sc,"grants","contract"),group0:wAt(sc,"grants","study's group"),
    person:wAt(sc,"hand","names a person"),byHand:wAt(sc,"hand","by hand"),inGroup:wAt(sc,"group","in the group"),entra:wAt(sc,"group","Microsoft Entra ID"),
    every:wAt(sc,"every","Every three months"),asks:wAt(sc,"every","asks Mei"),needs:wAt(sc,"every","still needs"),
    week:wAt(sc,"week","unanswered"),away:wAt(sc,"week","takes the access away"),two:wAt(sc,"two","Two people"),elena:wAt(sc,"two","Elena Lindgren"),
    moved:wAt(sc,"moved","moved"),works:wAt(sc,"account","still works"),acct:wAt(sc,"account","account works"),nothing:wAt(sc,"account","nothing took her out"),
    keeps:wAt(sc,"keeps","keeps Anil"),removes:wAt(sc,"keeps","removes Elena"),closes:wAt(sc,"keeps","review closes"),itself:wAt(sc,"keeps","by itself"),
    tells:wAt(sc,"tells","tells Yusuf"),leaves:wAt(sc,"tells","leaves the study"),net:wAt(sc,"tells","the net"),plan:wAt(sc,"tells","not the plan"),
    agent:wAt(sc,"agent","An agent"),list:wAt(sc,"agent","on the list"),owner:wAt(sc,"agent","its owner"),module:wAt(sc,"agent","AI agents")}));
  const tick=c.breath-0.2;
  ag_shots(ctx,S,t,sc.dur,[
    {later:true,at:0,place:"phHall",keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
      // the agreement's four proofs, at the left, while the pages are up; Mei takes its place for the review; they come back for
      // the tick, and leave before the chapter ends
      const pfA=ph_ab(tt,0,T.every-0.9,0.5)+ph_ab(tt,tick-0.9,sc.dur-0.6,0.5);
      ph_proofs(cx,60,180,{a:pfA,lit:0,proof:[tt<tick?1:1+ag_in(tt,tick,0.9),1,1,1],behind:"phHall"});
      // the grants, from the contract, to the group
      const gA=ph_ab(tt,T.first-0.3,T.inGroup-0.7,0.5);
      ph_grants(cx,640,90,1220,640,{a:gA,rows:clamp((tt-T.grants+0.3)/0.8*2,0,2),code:ag_in(tt,T.contract,0.5),hand:ag_in(tt,T.person,0.5),hand2:ag_in(tt,T.byHand,0.5),behind:"phHall"});
      // the group, in the directory
      const grA=ph_ab(tt,T.inGroup-0.1,T.every-0.7,0.5);
      ph_group(cx,840,170,760,{a:grA,k:Math.min(1,ag_spr(tt,T.inGroup-0.1,0.6)),behind:"phHall"});
      // the access review, as Mei answers it
      const rA=ph_ab(tt,T.every-0.1,T.tells-0.8,0.5);
      ph_review(cx,640,90,1220,700,{a:rA,fields:clamp((tt-T.every)/2.4,0,1),members:clamp((tt-T.two+0.2)/1.2,0,1),note:ag_in(tt,T.moved,0.5),
        dec:[ag_in(tt,T.keeps,0.5),ag_in(tt,T.removes,0.5)],acct:ph_ab(tt,T.acct-0.3,T.removes-0.6,0.4),closed:ag_in(tt,T.closes,0.5),out:ag_in(tt,T.itself-0.4,0.8),behind:"phHall"});
      const [mx,my,ms]=PH_AT.left;ph_person(cx,"mei",mx,my,ms,ph_ab(tt,T.every-0.4,T.tells-0.8,0.6),{t:tt});
      ph_name(cx,mx,PH_NAMEY,"Mei Tanaka","Answers the review",{align:"center",a:ph_ab(tt,T.asks-0.3,T.tells-0.8,0.5),behind:"phHall"});
      // from now on: Anil tells Yusuf the day anyone leaves; the review is the net
      const pa=ph_ab(tt,T.tells-0.3,tick-1.5,0.6);
      ph_person(cx,"anil",...PH_AT.left,pa,{t:tt});ph_person(cx,"yusuf",...PH_AT.right,pa,{t:tt,flip:true});
      ph_name(cx,PH_AT.left[0],PH_NAMEY,"Anil Kurian","Faculty of Health",{align:"center",a:pa,behind:"phHall"});ph_name(cx,PH_AT.right[0],PH_NAMEY,"Yusuf Demir","Data governance",{align:"center",a:pa,behind:"phHall"});
      if(pa>0){const lp=ag_sine(clamp((tt-T.leaves+0.2)/0.9,0,1));dp_link(cx,[560,300],[1380,300],"cyan",lp*pa,{alpha:pa});
        dp_slip(cx,960,220,"The day anyone leaves the study","cyan",{align:"center",size:28,a:pa*ag_in(tt,T.leaves-0.3,0.5),behind:"phHall"});
        dp_slip(cx,960,360,"The plan: Anil tells Yusuf","green",{align:"center",size:28,a:pa*ag_in(tt,T.net,0.5),behind:"phHall"});
        dp_slip(cx,960,450,"The net: the review","cyan",{align:"center",size:28,a:pa*ag_in(tt,T.net+0.5,0.5),behind:"phHall"});
        // an agent working for the study: on the list too, answered for by its owner
        const ga=pa*ag_in(tt,T.agent-0.3,0.6);if(ga>0){ag_model(cx,960,620,56,{t:tt,a:ga});
          dp_slip(cx,960,700,"On the review too · answered for by its owner","cyan",{align:"center",size:28,a:pa*ag_in(tt,T.owner-0.3,0.5),behind:"phHall"});
          dp_slip(cx,960,790,"AI agents in data work","grey",{align:"center",size:28,a:pa*ag_in(tt,T.module-0.2,0.5),behind:"phHall"});}}}}
  ]);
});

/* ---------------------------------------------------------------- 4 · A class and a policy */
scene("gap",(ctx,S,t,sc)=>{const c=sc.cues,T=ph_once(sc,"T",()=>({
    personal:wAt(sc,"second","personal column"),policy0:wAt(sc,"second","every class a policy"),like:wAt(sc,"like","monitor on every vial"),needs:wAt(sc,"like","needs its class"),
    seven:wAt(sc,"seven","seven"),gaps:wAt(sc,"seven","two gaps"),g1:wAt(sc,"gap1","A column"),g2:wAt(sc,"gap2","a class that has to be hidden"),
    alert:wAt(sc,"alert","an alert"),ys:wAt(sc,"alert","Yusuf and Sam"),friday:wAt(sc,"friday","Friday"),found:wAt(sc,"friday","found one"),
    mobile:wAt(sc,"mobile","mobile number"),texts:wAt(sc,"mobile","to text them"),load:wAt(sc,"load","night load"),newCol:wAt(sc,"load","new column"),
    project:wAt(sc,"project","data project"),doesnt:wAt(sc,"project","doesn't build"),phone:wAt(sc,"phone","phone number"),
    nine:wAt(sc,"mei","half past nine"),direct:wAt(sc,"mei","direct"),itself:wAt(sc,"mei","by itself"),masks:wAt(sc,"policy","masks it"),rule:wAt(sc,"policy","no new rule"),
    hours:wAt(sc,"hours","thirty-one hours"),noClass:wAt(sc,"hours","had no class"),go:wAt(sc,"went","Where did it go"),who:wAt(sc,"went","who read it")}));
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"phHall",keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
      // the proofs at the left, Never lit; Mei takes their place when she classes the column
      const pfA=ph_ab(tt,0.85,T.nine-0.9,0.5);ph_proofs(cx,60,180,{a:pfA,lit:1,proof:[2,1,1,1],behind:"phHall"});
      // like a monitor on every vial: every column, its class
      const lk=ph_ab(tt,T.like-0.3,T.seven-0.5,0.4);if(lk>0){const b=dp_slip(cx,1000,170,"Every column, its class, as every vial its monitor","cyan",{align:"center",size:30,a:lk,behind:"phHall"});
        ph_vvm(cx,b.x-50,b.y+b.h/2,30,0.12,{a:lk});}
      // the morning check, a SQL alert: two gaps; on Friday 8 January, one found
      const aA=ph_ab(tt,T.seven-0.2,T.mobile-0.7,0.5),fri=ag_in(tt,T.found-0.2,0.4);
      if(aA>0){const day=fri>0.5?"Fri 8 Jan 2027 · 07:00":"Thu 7 Jan 2027 · 07:00";
        ph_alert(cx,640,90,1220,590,{a:aA,rows:clamp((tt-T.g1+0.3)/1.2,0,1)*(tt<T.g2-0.3?0.5:1)+(tt>=T.g2-0.3?0:0),n1:fri>0.5?1:0,n2:0,day,dayCol:fri>0.5?"coral":"mut",dayA:ag_in(tt,T.alert-0.4,0.4),sent:ag_in(tt,T.found+0.6,0.5),behind:"phHall"});}
      // the new column, on the exam support table
      const cA=ph_ab(tt,T.mobile-0.2,T.hours-0.7,0.5);
      ph_columns(cx,640,90,1220,600,{a:cA,newA:ag_in(tt,T.newCol-0.2,0.5),hl:ag_in(tt,T.newCol,0.5),slot:ag_in(tt,T.newCol+0.2,0.5),q:ag_in(tt,T.newCol+0.5,0.5),found:ag_in(tt,T.phone,0.5),cls:ag_in(tt,T.direct,0.6),behind:"phHall"});
      if(cA>0){dp_slip(cx,640,720,"The data project: no class, no merge","grey",{size:28,a:cA*ph_ab(tt,T.project-0.2,T.nine-0.5,0.4),behind:"phHall"});
        dp_slip(cx,1210,720,"This table: loaded straight in","coral",{ink:true,size:28,a:cA*ph_ab(tt,T.doesnt-0.2,T.nine-0.5,0.4),behind:"phHall"});
        dp_slip(cx,640,720,"Policy hide_direct: masks it · no new rule","violet",{ink:true,size:28,a:cA*ag_in(tt,T.masks-0.2,0.5),behind:"phHall"});}
      const [mx,my,ms]=PH_AT.left;ph_person(cx,"mei",mx,my,ms,ph_ab(tt,T.nine-0.4,T.hours-0.7,0.6),{t:tt});
      ph_name(cx,mx,PH_NAMEY,"Mei Tanaka","Classes it: direct",{align:"center",a:ph_ab(tt,T.nine,T.hours-0.7,0.5),behind:"phHall"});
      // thirty-one hours with no class: where did it go, and who read it?
      const hA=ag_in(tt,T.hours-0.2,0.5);if(hA>0){cx.save();cx.globalAlpha*=hA;
        dp_panel(cx,360,250,1200,300,{col:"coral",r:22,behind:"phHall"});
        dp_T(cx,"Thu 7 Jan 02:04",420,330,{w:700,size:32});dp_T(cx,"Fri 8 Jan 09:30",1500,330,{w:700,size:32,align:"right"});
        const bp=ag_sine(clamp((tt-T.hours)/1.2,0,1));cx.fillStyle=rgba(dp_f("coral"),1);rr(cx,420,370,1080*bp,26,13);cx.fill();
        dp_T(cx,"31 hours with no class",960,470,{w:800,size:40,align:"center",col:"coral",a:ag_in(tt,T.noClass-0.2,0.5)});cx.restore();
        dp_slip(cx,700,620,"Where did it go?","cyan",{align:"center",size:30,a:ag_in(tt,T.go-0.2,0.4),behind:"phHall"});
        dp_slip(cx,1220,620,"Who read it?","cyan",{align:"center",size:30,a:ag_in(tt,T.who-0.2,0.4),behind:"phHall"});}}}
  ]);
});

/* ---------------------------------------------------------------- 5 · Where it went, and who read it */
scene("reads",(ctx,S,t,sc)=>{const c=sc.cues,T=ph_once(sc,"T",()=>({
    lineage:wAt(sc,"lineage","Lineage"),columnBy:wAt(sc,"lineage","column by column"),nowhere:wAt(sc,"nowhere","went nowhere"),made:wAt(sc,"nowhere","made anything"),
    student:wAt(sc,"study","student number"),code:wAt(sc,"study","learner code"),dob:wAt(sc,"study","date of birth"),year:wAt(sc,"study","the year"),
    namesW:wAt(sc,"never","Names"),exam:wAt(sc,"never","exam support"),audit:wAt(sc,"audit","audit log"),each:wAt(sc,"audit","read each table"),
    hours:wAt(sc,"hours","thirty-one hours"),night:wAt(sc,"hours","night load"),months:wAt(sc,"months","three months"),anil:wAt(sc,"months","Anil"),elena:wAt(sc,"months","Elena"),noOne:wAt(sc,"months","No one else"),
    quake:wAt(sc,"quake","earthquake"),days:wAt(sc,"quake","for days"),still:wAt(sc,"doses","still good"),doses:wAt(sc,"doses","fifty thousand"),
    proof:wAt(sc,"proof","Proof finds"),none:wAt(sc,"proof","none"),real:wAt(sc,"real","The gap was real"),saw:wAt(sc,"real","no one saw")}));
  ag_shots(ctx,S,t,sc.dur,[
    // lineage, column by column: mobile, on the exam support table, went nowhere; the study's columns arrive only as the code and the year
    {later:true,at:0,place:"phHall",keys:[[0,960,540,1.0]],push:0.012,draw:(cx,tt)=>{
      const lA=ph_ab(tt,0.3,T.audit-0.7,0.5);
      ph_lineage(cx,60,70,1800,810,{a:lA,nodes:clamp((tt-T.lineage)/1.6,0,1),sup:ag_in(tt,T.nowhere-0.5,0.5),mobile:ph_ab(tt,T.nowhere-0.2,T.student-0.4,0.5),code:clamp((tt-T.code+0.4)/1.4,0,1),year:clamp((tt-T.year+0.4)/1.2,0,1),
        stop:clamp((tt-T.namesW+0.2)/1.2,0,1),support:clamp((tt-T.exam+0.2)/1.0,0,1),behind:"phHall"});
      // who read: the audit log, for the thirty-one hours, then for the three months
      const pf=ag_in(tt,T.audit-0.2,0.5);ph_proofs(cx,60,180,{a:pf,lit:tt<T.months?1:2,proof:[2,1+ag_in(tt,T.noOne,0.9),1+ag_in(tt,T.noOne+0.6,0.9),1],behind:"phHall"});
      const a1=ph_ab(tt,T.audit-0.2,T.months-0.7,0.5),a2=ag_in(tt,T.months-0.1,0.5);
      ph_audit(cx,640,90,1220,600,{a:a1,title:"Who read the support table, 7 to 8 Jan",rows:[["Thu 7 Jan 02:04","registrar-loader","the night load"],["Fri 8 Jan 02:03","registrar-loader","the night load"]],
        n:clamp((tt-T.night+0.4)/0.6,0,2),foot:"Anyone else: no one",footA:ag_in(tt,T.night+0.6,0.5),behind:"phHall"});
      ph_audit(cx,640,90,1220,600,{a:a2,title:"Who read the study's tables, 12 Oct to 12 Jan",rows:[["Mon 11 Jan 16:20","Anil Kurian","its own space"],["Fri 11 Dec 15:42","Elena Lindgren","its own space"]],
        n:clamp((tt-T.anil+0.3)/0.5,0,1)+clamp((tt-T.elena+0.3)/0.5,0,1),foot:"Anyone else: no one",footA:ag_in(tt,T.noOne-0.2,0.5),behind:"phHall"});}},
    // Yogyakarta: the power out for days; the monitors showed most of the vaccine still good
    {at:c.quake-0.4,place:"phLabel",cut:true,keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const heat=ag_in(tt,T.days-0.6,1.2);ph_sun(cx,1700,120,1000,0.7*heat);
      for(let i=0;i<9;i++){const x=300+i*150;ph_vial(cx,x,820,0.9,{dark:0.18+0.05*((i*7)%3),warm:0.5*heat,a:ag_in(tt,i*0.08,0.4)});}
      dp_tag(cx,72,60,"Yogyakarta, Indonesia · the power out for days","cyan",{a:ag_in(tt,T.quake-0.1,0.5),behind:"phLabel"});
      // one of them, seen close: the square darker than it was, still lighter than its circle
      const la=ag_in(tt,T.still-0.6,0.6);if(la>0){const vx=1350+22*0.9,vy=820-74*0.9;cx.save();cx.globalAlpha*=la;cx.strokeStyle=rgba(DP.ice,0.5);cx.lineWidth=2;cx.beginPath();cx.moveTo(vx+8,vy-14);cx.lineTo(1420,438);cx.stroke();cx.restore();
        ph_vvm(cx,1460,330,110,0.32,{a:la});dp_slip(cx,1460,470,"Every square still lighter than its circle","grey",{align:"center",size:28,a:ag_in(tt,T.still-0.3,0.5),behind:"phLabel"});}
      dp_card(cx,180,200,560,{kick:"PATH",title:"50,000 doses kept",sub:"not thrown away"},{col:"green",a:ag_in(tt,T.doses-0.2,0.5),k:Math.min(1,ag_spr(tt,T.doses-0.2,0.6)),behind:"phLabel"});}},
    // back in the hall: the gap was real, and no one saw what they shouldn't
    {at:c.proof-0.4,place:"phHall",cut:true,keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
      ph_proofs(cx,60,180,{a:1-ag_in(tt,sc.dur-0.6,0.5),lit:2,proof:[2,2,2,1],behind:"phHall"});
      dp_card(cx,700,250,1000,{kick:"What proof does",title:"Finds the harm, and shows where there was none",sub:null},{col:"green",a:ag_in(tt,T.proof-0.1,0.5),k:Math.min(1,ag_spr(tt,T.proof-0.1,0.6)),behind:"phHall"});
      dp_slip(cx,700,470,"31 hours with no class: a real gap","coral",{ink:true,size:30,a:ag_in(tt,T.real-0.2,0.5),behind:"phHall"});
      dp_slip(cx,700,570,"Read by anyone who shouldn't: no one","green",{size:30,a:ag_in(tt,T.saw-0.2,0.5),behind:"phHall"});}}
  ]);
});

/* ---------------------------------------------------------------- 6 · Until its date */
scene("ends",(ctx,S,t,sc)=>{const c=sc.cues,T=ph_once(sc,"T",()=>({
    june:wAt(sc,"last","thirtieth of June"),endW:wAt(sc,"last","end with it"),place:wAt(sc,"place","place in the group"),date:wAt(sc,"place","that date"),
    day:wAt(sc,"day","On the day"),out:wAt(sc,"day","takes them out"),grants:wAt(sc,"day","grants"),promise:wAt(sc,"promise","promise"),checked:wAt(sc,"promise","checked"),
    july:wAt(sc,"july","first of July"),empty:wAt(sc,"july","empty"),noGrant:wAt(sc,"july","no grant"),gone:wAt(sc,"july","gone"),totals:wAt(sc,"totals","totals"),
    proofW:wAt(sc,"register","Every proof"),reg:wAt(sc,"register","register")}));
  const tick=c.breath-0.2;
  ag_shots(ctx,S,t,sc.dur,[
    {later:true,at:0,place:"phHall",keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
      ph_proofs(cx,60,180,{a:ag_in(tt,0.85,0.5),lit:3,proof:[2,2,2,tt<tick?1:1+ag_in(tt,tick,0.9)],behind:"phHall"});
      ph_calendar(cx,1480,60,tt<T.july-0.3?"Wed 30 Jun 2027":"Thu 1 Jul 2027",tt<T.july-0.3?"the agreement ends":"the morning after",{a:ph_ab(tt,T.june-0.3,T.totals-0.6,0.4),behind:"phHall"});
      // each member's place ends on that date; the directory takes them out, and the grants end
      const gA=ph_ab(tt,T.place-0.3,T.promise-0.5,0.5);
      ph_group(cx,660,230,760,{a:gA,rows:["Anil Kurian"],until:ag_in(tt,T.date-0.3,0.5),rowA:k=>1-ag_in(tt,T.out-0.2,0.7),foot:"Members: none",footCol:"coral",footA:ag_in(tt,T.out+0.4,0.5),behind:"phHall"});
      dp_slip(cx,660,620,"Grants made from 2026-14: ended","coral",{ink:true,size:28,a:ph_ab(tt,T.grants-0.2,T.promise-0.5,0.4),behind:"phHall"});
      dp_slip(cx,1040,330,"An ending is a promise too","cyan",{align:"center",size:32,a:ph_ab(tt,T.promise-0.2,T.july-0.6,0.4),behind:"phHall"});
      // 1 July: Yusuf checks; only the totals stay; every proof is kept in his register
      const yA=ag_in(tt,T.july-0.6,0.6);ph_person(cx,"yusuf",...PH_AT.right,yA,{t:tt,flip:true});
      ph_endCheck(cx,660,200,760,{a:ph_ab(tt,T.july-0.3,T.proofW-0.6,0.5),p:[ag_in(tt,T.empty-0.1,0.6),ag_in(tt,T.noGrant-0.1,0.6),ag_in(tt,T.gone-0.1,0.6)],behind:"phHall"});
      dp_card(cx,660,620,760,{kick:"Published totals · public",title:"Left after first year · by course",sub:null},{col:"green",a:ph_ab(tt,T.totals-0.2,T.proofW-0.6,0.4),behind:"phHall"});
      ph_register(cx,660,200,760,{a:ag_in(tt,T.proofW-0.2,0.5),n:clamp((tt-T.proofW)/0.5,0,5),behind:"phHall"});}}
  ]);
});

/* ---------------------------------------------------------------- 7 · Proof it held */
scene("held",(ctx,S,t,sc)=>{const c=sc.cues,T=ph_once(sc,"T",()=>({
    vial:wAt(sc,"vial","monitor"),coldW:wAt(sc,"cold","whether the cold held"),use:wAt(sc,"cold","moment of use"),records:wAt(sc,"records","records"),
    show:wAt(sc,"show","show"),held:wAt(sc,"show","protection held"),who:wAt(sc,"list","who could read"),did:wAt(sc,"list","who did"),where:wAt(sc,"list","where each column"),ended:wAt(sc,"list","ended on its date"),
    hope:wAt(sc,"hope","Protection"),next:wAt(sc,"next","Kept for a reason")}));
  const end=c.breath;
  ag_shots(ctx,S,t,sc.dur,[
    // the monitor doesn't keep the vaccine cold: it shows whether the cold held
    {at:0,place:"phLabel",cut:true,keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      ph_vial(cx,640,800,1.75,{dark:0.15});ph_vvm(cx,1260,400,150,0.15,{a:ag_in(tt,0.3,0.6)});
      dp_pill(cx,1260,640,"USE","green",{align:"center",a:ag_in(tt,T.coldW,0.5)});}},
    // the study's records show it held: who could read, who did, where each column went, and that it ended on its date
    {at:c.records-0.4,place:"phHall",cut:true,keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
      const out=1-ag_in(tt,T.hope-0.6,0.5);
      if(out>0){ph_proofs(cx,560,110,{a:out,w:800,by:true,proof:[2,2,2,2],behind:"phHall"});
        const R=[["Grants and reviews",T.who],["The audit log",T.did],["Lineage",T.where],["The end, checked",T.ended]],B=R.map(r=>dp_slip(cx,0,0,r[0],"green",{size:30,measure:true})),
          tw=B.reduce((q,b)=>q+b.w,0)+3*28;let x0=960-tw/2;
        R.forEach((r,k)=>{const a=out*ag_in(tt,r[1]-0.2,0.5);dp_slip(cx,x0,660,r[0],"green",{size:30,a,behind:"phHall"});x0+=B[k].w+28;});}
      // the series, film by film, then what to remember
      ph_series(cx,64,240,{a:1-ag_in(tt,end-0.3,0.4),n:clamp((tt-T.hope)/0.35,0,8),behind:"phHall"});
      dp_slip(cx,960,560,"Next: Kept for a reason","cyan",{align:"center",size:30,a:ag_in(tt,T.next-0.2,0.5)*(1-ag_in(tt,end-0.3,0.4)),behind:"phHall"});}}
  ]);
  dp_end(ctx,S,t,end,"Proof it held","Protection you can't prove is protection you hope for.","Film 8 of 8","Only what you may see");
});

// the chapters that open in the hall where the last one ends glide on (a later moment: what was there leaves first)
ag_cutInto(["promises","review","gap","reads","ends"]);
