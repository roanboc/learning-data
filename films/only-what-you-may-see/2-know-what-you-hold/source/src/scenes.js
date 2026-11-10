/* ===== Know what you hold: the scenes =====
   Eight chapters, each timed to its narration: wAt(sc, "line", "word") is the moment a word is said. The places are painted once
   (kw_hall.js, kw_chile.js); what changes is drawn live in the shots of ag_shots. In one room the camera glides and only what changes
   fades: a card leaves before another takes its place, so no words show twice. Between rooms a shot comes in on a cut where both show
   the same thing (the box, the agreement card), and dissolves where the whole picture changes. The title card ends chapter 1, the end
   card chapter 8. */

const kw_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// a value that comes in at a and leaves at b (each over d seconds)
const kw_io=(t,a,b,d)=>ag_in(t,a,d||0.5)*(b==null?1:1-ag_in(t,b,d||0.5));
// the learner table's chips, as Mei's register gives them in chapter 2, and after Yusuf's list (date of birth indirect)
const KW_CH2={num:"direct",name:"direct",email:"direct",dob:"none",course:"none",results:"none",exam:"none"};
const KW_NOW={num:"direct",name:"direct",email:"direct",dob:"indirect",course:"none",results:"none",exam:"none"};
function kw_chips(map,o){const out={};for(const k in map)out[k]=Object.assign({cls:map[k]},o&&o[k]);return out;}

/* ---------------------------------------------------------------- 1 · High in */
scene("high",(ctx,S,t,sc)=>{const c=sc.cues,T=kw_once(sc,"T",()=>({
    place:c.place,onback:wAt(sc,"back","on the back"),nf:wAt(sc,"back","energy"),print:c.print,small:wAt(sc,"print","small print"),lot:c.lot,
    obese:c.obese,four:wAt(sc,"obese","one child"),risk:wAt(sc,"obese","at risk"),change:c.change,
    law:c.law,lawW:wAt(sc,"law","a law"),five:wAt(sc,"law","five senators"),limits:c.limits,limW:wAt(sc,"limits","sets limits"),
    sug:wAt(sc,"limits","sugars"),sod:wAt(sc,"limits","sodium"),sat:wAt(sc,"limits","saturated"),cal:wAt(sc,"limits","calories"),
    octagon:c.octagon,june:wAt(sc,"octagon","June"),black:wAt(sc,"octagon","black octagon"),stop:wAt(sc,"octagon","stop sign"),hisug:wAt(sc,"octagon","high in sugars"),
    maker:c.maker,makerW:wAt(sc,"maker","maker"),schools:c.schools,school:wAt(sc,"schools","school"),ads:wAt(sc,"schools","advertised"),
    bought:c.bought,quarter:wAt(sc,"bought","a quarter"),reform:c.reform,sugar:wAt(sc,"reform","sugar"),sodium:wAt(sc,"reform","sodium"),
    front:c.front,frontW:wAt(sc,"front","The front"),breath:c.breath}));
  const B={x:960,y:1010,s:1.35},bt=tt=>T.front<=tt?(tt<T.frontW?1-ag_sine((tt-T.front-0.3)/1.5):ag_sine((tt-T.frontW+0.1)/1.5)):1;
  const oct=tt=>[ag_spr(tt,T.black,0.8),ag_spr(tt,T.black+0.45,0.8)];
  ag_shots(ctx,S,t,sc.dur,[
    // the aisle at evening, 2012: the parent with a cereal box
    {at:0,place:"kwAisle",keys:[[0,960,540,1.0],[2,930,548,1.03]],push:0.02,draw:(cx,tt)=>{
      dp_person(cx,KW_PARENT,700,640,0.95,{t:tt,pose:"hold",gaze:[3,1],holdBack:(c,h)=>kw_box(c,h.near[0]+44,h.near[1]+64,0.4,{turn:0.9,small:1})});}},
    // the box close up: its back, the numbers in small print
    {at:T.onback-0.25,place:"kwShelf",cut:true,keys:[[0,960,560,1.0],[T.onback+0.5,960,560,1.28],[T.small,960,560,1.04],[T.lot-0.3,1010,520,1.2]],d:1.6,push:0.02,draw:(cx,tt)=>{
      const turn=1-ag_sine((tt-T.onback+0.1)/1.2),sug=ag_in(tt,T.lot,0.6);
      kw_box(cx,B.x,B.y,B.s,{turn,sugar:sug});
      dp_tag(cx,1300,380,"Nutrition facts · per 100 g","grey",{a:ag_in(tt,T.nf,0.5),to:[1190,420],p:ag_eo((tt-T.nf)/0.6)});
      // "Sugars 33 g", lifted from the table to full size, with a question
      const la=ag_in(tt,T.lot,0.5);if(la>0){const y=B.y-B.s*KW_BOX.h+B.s*(156+5*33);
        dp_slip(cx,1300,y-50,"Sugars 33 g","ink",{a:la,size:40});dp_link(cx,[1290,y-16],[1130,y-10],"grey",ag_eo((tt-T.lot)/0.5),{dot:false});
        cx.save();cx.globalAlpha*=ag_in(tt,T.lot+0.5,0.4);dp_panel(cx,1580,y-62,64,64,{col:"grey",r:32,glowR:22});dp_T(cx,"?",1612,y-16,{w:800,size:40,align:"center"});cx.restore();}}},
    // the end of the aisle: one child in four, and the law
    {at:T.obese-0.6,place:"kwEnd",keys:[[0,960,520,1.0],[T.law,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      kw_backpacks(cx,195,286,{a:ag_in(tt,T.obese-0.4,0.6),lit:clamp((tt-T.four)/1.2,0,1)});
      kw_card(cx,190,470,700,[["kick","about 1 in 4"],["title","obese · children starting school"],["sub","at risk of diabetes and heart disease later"]],{a:ag_in(tt,T.four+0.3,0.5),ra:{2:ag_in(tt,T.risk,0.5)}});
      kw_card(cx,1010,470,720,[["kick","Law 20.606 · 2012"],["sub","five senators · from left, centre and right"]],{a:ag_in(tt,T.lawW,0.5),ra:{1:ag_in(tt,T.five,0.5)}});
      const la=ag_in(tt,T.limW,0.5);if(la>0){const bb=kw_card(cx,1010,654,720,[["kick","Limits per 100 g"],["sub","set by the Ministry of Health"],["gap",58]],{a:la});
        let x=1040;[["sugars",T.sug],["sodium",T.sod],["saturated fats",T.sat],["calories",T.cal]].forEach(([w,at])=>{x+=12+dp_pill(cx,x,bb.y+bb.h-36,w,"grey",{a:la*ag_in(tt,at,0.4)});});}}},
    // the front, from 2016: the octagons, the maker who puts them there, and what they set off
    {at:T.octagon-0.5,place:"kwShelf",keys:[[0,960,560,1.0],[T.black+0.1,1040,520,1.1],[T.makerW-0.2,900,540,1.04]],d:1.6,push:0.015,draw:(cx,tt)=>{
      const k=oct(tt);kw_box(cx,B.x,B.y,B.s,{turn:1,oct:k});
      const o1=kw_octAt(B.x,B.y,B.s,0),o2=kw_octAt(B.x,B.y,B.s,1),r=66*B.s;
      // the shape of a stop sign, a moment behind the first
      const sa=kw_io(tt,T.stop,T.stop+1.6,0.4);if(sa>0){cx.save();cx.globalAlpha*=sa*0.8;kw_octPath(cx,o1[0],o1[1],r*1.45);cx.strokeStyle=rgba(DP.ice,0.9);cx.lineWidth=3;cx.setLineDash([10,9]);cx.stroke();cx.restore();}
      dp_tag(cx,1310,o1[1]-31,"high in sugars","grey",{a:ag_in(tt,T.hisug,0.4)*(1-ag_in(tt,T.schools-0.3,0.4)),to:[o1[0]+r,o1[1]],p:ag_eo((tt-T.hisug)/0.5)});
      dp_tag(cx,1310,o2[1]-31,"high in calories","grey",{a:ag_in(tt,T.hisug+0.6,0.4)*(1-ag_in(tt,T.schools-0.3,0.4)),to:[o2[0]+r,o2[1]],p:ag_eo((tt-T.hisug-0.6)/0.5)});
      const ra=ag_in(tt,T.makerW,0.5);if(ra>0){const rc=kw_recipe(cx,230,360,{a:ra});dp_link(cx,[rc.x+rc.w,rc.y+70],[o1[0]-r,o1[1]],"grey",ag_eo((tt-T.makerW-0.4)/0.7),{alpha:0.8});}
      dp_pill(cx,1310,o1[1]+200,"Not sold in schools","coral",{a:ag_in(tt,T.school,0.4)});
      dp_pill(cx,1310,o1[1]+280,"No ads aimed at children under 14","coral",{a:ag_in(tt,T.ads,0.4)});}},
    // what changed: drinks bought, against what was expected
    {at:T.bought-0.5,place:"kwEnd",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const a=ag_in(tt,T.bought-0.3,0.5);if(a<=0)return;const bb=kw_card(cx,430,200,1060,[["kick","Drinks with an octagon, bought"],["gap",300],["title","23.7% less than expected"],["sub","in the first 18 months"]],{a,ra:{2:ag_in(tt,T.quarter,0.5),3:ag_in(tt,T.quarter+0.3,0.5)}});
      cx.save();cx.globalAlpha*=a;const r=kw_chart(cx,470,300,780,250,(tt-T.bought)/3.2);
      dp_T(cx,"expected",r.x1+20,r.exY+10,{w:600,size:28,col:"grey"});cx.save();cx.globalAlpha*=ag_in(tt,T.bought+3,0.5);dp_T(cx,"bought",r.x1+20,r.gotY+30,{w:700,size:28});cx.restore();cx.restore();}},
    // makers take sugar and sodium out; the box turns, back and front
    {at:T.reform-0.5,place:"kwShelf",keys:[[0,960,560,1.0],[T.front,960,560,1.06]],d:1.8,push:0.015,draw:(cx,tt)=>{cx.save();cx.globalAlpha*=1-0.6*ag_in(tt,T.breath,0.8);
      kw_box(cx,B.x,B.y,B.s,{turn:bt(tt),oct:[1,1]});
      kw_recipe(cx,230,360,{sugar:1-0.55*ag_sine((tt-T.sugar)/1.2)});
      // a packet of crackers that loses its octagon
      cx.save();const px=1420,py=1010;rr(cx,px,py-330,400,330,8);const g=cx.createLinearGradient(px,0,px+400,0);g.addColorStop(0,"rgb(170,150,112)");g.addColorStop(1,"rgb(130,112,82)");cx.fillStyle=g;cx.fill();
      cx.fillStyle="rgb(96,128,96)";cx.fillRect(px,py-330,400,70);cx.fillStyle="rgba(230,214,170,0.9)";for(let i=0;i<4;i++){cx.beginPath();cx.arc(px+70+i*86,py-150,30,0,TAU);cx.fill();}
      cx.restore();kw_octagon(cx,px+320,py-240,66,"SODIO",{a:1-ag_in(tt,T.sodium,1.0)});cx.restore();}}
  ]);
  // the kicker: the opening story, where and when
  const ka=ag_in(t,T.place-0.4,0.6)*(1-ag_in(t,T.breath-0.6,0.5)),k16=ag_in(t,T.june,0.4);
  kw_kick(ctx,S,"Opening story",null,ka,{scrim:1});setScreen(ctx,S);
  withA(ctx,ka*(1-ag_in(t,T.june-0.35,0.3)),()=>dp_T(ctx,"Chile, 2012",72,172,{w:700,size:46}));
  withA(ctx,ka*k16,()=>dp_T(ctx,"Chile, 2016",72,172,{w:700,size:46}));
  dp_title(ctx,S,t,T.breath,"Know what you hold",null,"FILM 2 OF 8 · ONLY WHAT YOU MAY SEE");});

/* ---------------------------------------------------------------- 2 · Plain words */
// the registrar's register: the one question, and its three answers until now, each a chip with its words under it
function kw_register(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,w=430;if(a<=0.001)return null;const rows=[["direct","by itself"],["pseudonymous","with a key kept elsewhere"],["none","not at all"]];
  const h=548;ctx.save();ctx.globalAlpha*=clamp(a,0,1);dp_panel(ctx,x,y,w,h,{col:"grey",r:20,glowR:34});
  dp_T(ctx,"Classification register",x+30,y+60,{w:700,size:32});dp_T(ctx,"registrar's office",x+30,y+98,{w:500,size:28,col:"mut"});
  dp_T(ctx,"Does it identify a person?",x+30,y+156,{w:700,size:30});
  rows.forEach((r,i)=>{const ra=o.rows?o.rows[i]:1;if(ra<=0.001)return;const yy=y+226+i*98;ctx.save();ctx.globalAlpha*=ra;kw_chip(ctx,x+30,yy,r[0],{k:o.k?o.k[i]:null});
    dp_T(ctx,r[1],x+30,yy+44,{w:500,size:28,col:"mut"});ctx.restore();});
  dp_T(ctx,"Decided in “Who may see it”",x+30,y+h-26,{w:500,size:28,col:"mut",a:o.tagA==null?1:o.tagA});
  ctx.restore();return{x,y,w,h};}
// the agreement, signed the day before: what the study may have and must never have, in plain words
function kw_agreement(ctx,x,y,o){o=o||{};return kw_card(ctx,x,y,1000,[["kick","Data sharing agreement 2026-14"],["title","For a study in the Faculty of Health"],["gap",4],
  ["kick","May have","green"],["line","Each learner's course and results; their year of birth; a code in place of who they are"],["kick","Never","coral"],["line","Anything that names a learner; anything about their health"],
  ["gap",6],["sub","Signed: Mei Tanaka and Anil Kurian, 12 October 2026"],["sub","From “An agreement first”"]],{a:o.a,col:"grey",ra:o.ra});}
// the two phrases the study's question turns on, small, beside the learner table
function kw_twoPhrases(ctx,x,y,o){o=o||{};return kw_card(ctx,x,y,430,[["kick","Agreement 2026-14","grey"],["kick","May have","green"],["line","their year of birth"],["kick","Never","coral"],["line","anything about their health"]],{a:o.a,col:"grey",ra:o.ra});}
scene("plain",(ctx,S,t,sc)=>{const c=sc.cues,T=kw_once(sc,"T",()=>({
    tables:c.tables,frontW:wAt(sc,"tables","the front"),tuesday:c.tuesday,anil:wAt(sc,"tuesday","Anil"),signed:c.signed,mei:wAt(sc,"signed","Mei"),signedW:wAt(sc,"signed","signed"),
    may:c.may,mayW:wAt(sc,"may","may have"),never:c.never,columns:c.columns,question:c.question,q:wAt(sc,"question","does it"),three:c.three,
    direct:wAt(sc,"three","direct"),nm:wAt(sc,"three","name"),em:wAt(sc,"three","email"),sn:wAt(sc,"three","student"),pseudo:wAt(sc,"three","pseudonymous"),noneW:wAt(sc,"three","none"),
    course:wAt(sc,"none","Course"),results:wAt(sc,"none","results"),dob:wAt(sc,"none","Date of birth"),exam:wAt(sc,"none","exam support"),
    both:c.both,bothW:wAt(sc,"both","both"),only:wAt(sc,"both","only the year"),health:wAt(sc,"both","nothing about health"),breath:c.breath}));
  // the learner table is there, then leaves for the agreement, then comes back for the register's question
  const ltA=tt=>(1-ag_in(tt,T.signed-0.2,0.5))+ag_in(tt,T.columns+0.45,0.5),agA=tt=>ag_in(tt,T.signed+0.35,0.5)*(1-ag_in(tt,T.columns-0.1,0.45));
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"kwOffice",keys:[[0,960,540,1.0],[T.question,960,550,1.02],[T.both,950,560,1.03]],d:1.8,push:0.012,draw:(cx,tt)=>{
      const lt=ltA(tt);if(lt>0){const ch={};KW_COLS.forEach((col,i)=>{const at={num:T.sn,name:T.nm,email:T.em,course:T.course,results:T.results,dob:T.dob,exam:T.exam}[col.key];
          const k=ag_spr(tt,at,0.7),slot=ag_in(tt,T.frontW+i*0.12,0.4);ch[col.key]=tt<at?{slot:true,a:slot}:{cls:KW_CH2[col.key],k,glow:(col.key==="dob"||col.key==="exam")?kw_io(tt,T.bothW,T.health+1.2,0.4):0};});
        kw_learner(cx,KW_LTX,KW_LTY,{a:lt,chips:ch,level:"confidential",levelA:1});}
      // Anil's card, then Mei and the agreement she signed
      kw_card(cx,1100,300,430,[["kick","Faculty of Health"],["title","Anil Kurian"],["sub","Health progress study"]],{a:kw_io(tt,T.anil,T.columns-0.2,0.5)});
      const ma=ag_in(tt,T.mei-0.2,0.6);kw_person(cx,"mei",KW_AT.meiOffice,{a:ma,t:tt,gaze:[-2,1]});kw_name(cx,1890,205,"Mei Tanaka","Registrar's office",{a:ma*(1-ag_in(tt,T.three,0.5)),align:"right"});
      const aa=agA(tt);if(aa>0)kw_agreement(cx,KW_LTX,KW_LTY,{a:aa,ra:{3:0.55+0.45*ag_in(tt,T.mayW,0.4),4:0.55+0.45*ag_in(tt,T.mayW,0.4),5:0.55+0.45*ag_in(tt,T.never,0.4),6:0.55+0.45*ag_in(tt,T.never,0.4)}});
      // the register: the one question, and its three answers until now
      kw_register(cx,1100,236,{a:ag_in(tt,T.question,0.5)*(1-ag_in(tt,T.bothW-0.6,0.4)),rows:[ag_in(tt,T.direct,0.3),ag_in(tt,T.pseudo,0.3),ag_in(tt,T.noneW,0.3)],
        k:[ag_spr(tt,T.direct,0.7),ag_spr(tt,T.pseudo,0.7),ag_spr(tt,T.noneW,0.7)]});
      // so the study could have both: the agreement's two phrases, and a question to each chip
      const pa=ag_in(tt,T.bothW-0.1,0.5);if(pa>0){const bb=kw_twoPhrases(cx,1100,300,{a:pa,ra:{2:ag_in(tt,T.only,0.4)*0.5+0.5,4:ag_in(tt,T.health,0.4)*0.5+0.5}});
        const yDob=KW_LTY+KW_LT.top+3*KW_LT.rowH,yEx=KW_LTY+KW_LT.top+6*KW_LT.rowH,cx0=KW_LTX+KW_LT.chipX+kw_chipW(cx,"none")+44;
        kw_dots(cx,[1096,bb.ys[2][0]-10],[cx0,yDob-12],"green",ag_eo((tt-T.bothW-0.3)/0.7),{q:1,qa:ag_in(tt,T.bothW+0.9,0.3)});
        kw_dots(cx,[1096,bb.ys[4][0]-10],[cx0,yEx-12],"coral",ag_eo((tt-T.bothW-0.6)/0.7),{q:1,qa:ag_in(tt,T.bothW+1.2,0.3)});}}}
  ]);
  kw_kick(ctx,S,"Plain words","Tuesday, 13 October 2026",ag_in(t,T.tuesday-0.2,0.5)*(1-ag_in(t,T.signed+2.5,0.6)));});
