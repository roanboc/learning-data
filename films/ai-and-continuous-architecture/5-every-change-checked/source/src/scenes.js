/* ===== Every change, checked: scenes =====
   Eight chapters, as in ../script.md. Babylon, Nabopolassar's reign: the river wall of baked brick, laid at the water's edge and
   repaired by king after king on the same line; one brick among millions, who made it, and what for; the king's fear that his words
   would be removed, in his own words; the stretches, each needing to say who built it; a brick stamped on its edge, and one written by
   hand; what one says; the archaeologists' dig, and their plan of one stretch with sixteen of his bricks still in place. Then the
   utility: an element stamped as a brick is, and the map, checked and walked; Tomás's map, changing every day; planned work, and last
   year's letters with the wrong date; the head of retail's ticket; the checks that run on every change, each rule with a case that
   must fail; the map agent tested on the social tariff, whose answer is known; its walk of the new change down to the tables, and who
   must agree; what's really running, and the copy nobody had drawn; back to the river wall; and the answer.
   Made to read on a phone (tools/legible.py): text is at least 28 px in the frame; what's drawn small is texture. Motion: every shot
   drifts slowly, things arrive with a spring, a picture that leaves while another comes fades as one (a5_fade). Sound: every effect
   in tools/score.py fires at the same moment as the thing it belongs to here, so keep the two in step. */

/* ---------- small helpers ---------- */
// a label that comes in with a spring at t0 and leaves at t1 (or stays, if t1 is null), in screen space: what the narration names
function a5_say(ctx,t,x,y,s,col,t0,t1,o){o=o||{};const q=fin(t,t0,0.6)*(t1==null?1:1-fin(t,t1,0.6))*(o.a==null?1:o.a);if(q<=0.01)return;
  arrive(ctx,x,y,t,t0,()=>tag(ctx,x,y,s,col,{align:o.align||"center",size:o.size||30}),{dy:8,a:q});}
// a moment: in from a, out from b, each over d seconds
const a5_win=(t,a,b,d)=>fin(t,a,d||0.5)*(1-fin(t,b,d||0.5));

/* ---------- 1. A name and a purpose ---------- */
// The stretches of the river wall later kings laid again, on the same line: [x0, x1, delay after "king after king", tone]
const A5_KINGS=[[260,560,0,0.7],[780,1180,0.5,-0.7],[1400,1760,1.0,0.55]];
// The utility, at the opening's end: a brick of the river wall beside an element of the map, each saying who made it and what for;
// then the map, every element stamped, a change checked and walked over it before anyone builds; and the map, wordless, before the title
function a5_now(ctx,t,c,w,B){const tNo=c("now"),tSo=c("so"),bO=1-fin(t,tSo-0.8,0.5),tEl=w("now","every element"),tOw=w("now","who owns"),tSr=w("now","where it came");
  if(bO>0.01){const bA=fin(t,tNo-0.2,0.8)*bO,eA=fin(t,tEl-0.3,0.8)*bO;
    if(bA>0.01){arrive(ctx,480,590,t,tNo-0.2,()=>a5_brick3(ctx,200,600,400,{stamp:1}),{dy:-12,a:bA});withA(ctx,bA,()=>tag(ctx,480,420,"a brick of the river wall",BAB_CLAY,{align:"center",size:28}));}
    if(eA>0.01){arrive(ctx,1330,480,t,tEl-0.3,()=>a5_stamp(ctx,960,330,740,"object","OBJ-012","planned work","Grace","the network's procedures",A5_INF,
        {own:fin(t,tOw-0.3,0.6),src:fin(t,tSr-0.3,0.6),hiOwn:pulseAt(t,tOw-0.1,1.6),hiSrc:pulseAt(t,tSr-0.1,1.6)}),{dy:-12,a:eA});
      withA(ctx,eA,()=>tag(ctx,1330,280,"an element of the map",A5_INF,{align:"center",size:28}));}
    a5_say(ctx,t,480,760,"who built it, and what for",BAB_CLAY,tNo+0.4,null,{a:bO});
    a5_say(ctx,t,1330,700,"who owns it, and where it came from",BIZ,tOw-0.2,null,{a:bO});}
  // the map: every element stamped with its owner and its source; a change over it, checked, and walked through what it touches
  const mA=fin(t,tSo-0.3,0.8);if(mA>0.01){
    arrive(ctx,1090,430,t,tSo-0.3,()=>a5_texMap(ctx,t,A5_TM,{p:clamp((t-tSo+0.3)/1.4,0,1),stamp:clamp((t-tSo)/1.8,0,1),chg:fin(t,w("so","every change")-0.2,0.6),
      chk:clamp((t-w("so","checked")+0.1)/2.4,0,1),walk:clamp((t-w("so","walked")+0.1)/2.2,0,1)}),{dy:-12,a:mA});
    a5_say(ctx,t,1090,790,"before anyone builds",BIZ,w("so","before anyone")-0.2,B+0.6);}}
scene("brick",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tNe=c("never"),tLo=c("lost"),tFe=c("feared"),tNd=c("need"),tEd=c("edge"),tRe=c("reads"),tFo=c("found"),tSi=c("sixteen"),tNo=c("now");
  const uF=fin(t,tLo-0.7,1.3),uD=fin(t,tFo-0.6,1.3),uN=fin(t,tNo-0.6,1.3);
  // the utility, today
  if(uN>0.001){setScreen(ctx,S);bg2(ctx);motes(ctx,t);ctx.save();drift(ctx,t-tNo+0.6,{dur:sc.dur-tNo},{z:0.02,y:480});a5_now(ctx,t,c,w,B);ctx.restore();vign(ctx,S);}
  // the archaeologists at the river wall; then their plan of one stretch, and the sixteen bricks of his they found in place
  if(uD>0.001&&uN<0.999)a5_fade(ctx,uN>0.001?1-uN:1,cx=>{setScreen(cx,S);cx.save();drift(cx,t-tFo+0.6,{dur:sc.dur-tFo},{z:0.03,y:560});
      a5_dig(cx,t,{p:clamp((t-w("found","archaeologists")+0.2)/2.4,0,1),st:fin(t,w("found","each stretch")-0.4,1.2),found:clamp((t-w("found","still said")+0.1)/2.4,0,1)});cx.restore();
    const pA=fin(t,tSi-0.5,0.9);if(pA>0.01){setScreen(cx,S);cx.fillStyle="rgba(8,6,5,"+(0.8*pA)+")";cx.fillRect(0,0,W,H);}
    vign(cx,S);
    eaYear(cx,80,80,"Babylon · the early 1900s",ACA,fin(t,tFo+0.3,0.7)*(1-fin(t,tSi-0.5,0.6)));
    bab_tag(cx,960,214,"the river wall, dug out",a5_win(t,w("found","dug out")-0.2,w("found","its bricks")-0.3,0.6));
    bab_tag(cx,960,214,"its bricks still said who built each stretch",a5_win(t,w("found","its bricks")+0.2,tSi-0.5,0.6));
    if(pA>0.01){const n=16*clamp((t-w("sixteen","mapped")+0.1)/2.2,0,1);
      arrive(cx,710,450,t,tSi-0.4,()=>a5_plan(cx,180,140,1060,620,t,{p:clamp((t-tSi+0.4)/1.6,0,1),n}),{dy:-14,a:pA});
      bab_tag(cx,710,104,"one stretch of the river wall: the archaeologists' plan",pA,{size:28});
      const nA=fin(t,w("sixteen","sixteen")-0.3,0.6);if(nA>0.01)withA(cx,nA,()=>{T(cx,String(Math.round(n)),1560,430,{w:800,size:132,align:"center",color:rgba(BAB_CLAY,1)});
        T(cx,"of his bricks,",1560,500,{w:800,size:34,align:"center",color:rgba(BAB_CLAY,1)});T(cx,"still in place",1560,544,{w:800,size:34,align:"center",color:rgba(BAB_CLAY,1)});});
      const lA=fin(t,w("sixteen","still in place")-0.1,0.6);if(lA>0.01)withA(cx,lA,()=>{cx.fillStyle=rgba([170,46,36],0.95);cx.beginPath();cx.arc(586,694,10,0,TAU);cx.fill();cx.strokeStyle="rgba(250,246,236,0.9)";cx.lineWidth=2;cx.stroke();
        T(cx,"one of his bricks, in place",608,704,{w:700,size:28,color:"rgba(70,52,38,0.95)"});});}});
  // the river wall close up: one brick among millions; the king's fear, in his own words; its stretches; a brick stamped on its edge,
  // and one written by hand; and what one says
  if(uF>0.001&&uD<0.999)a5_fade(ctx,uD>0.001?1-uD:1,cx=>{setScreen(cx,S);cx.save();
      const tA=w("lost","a brick");focus(cx,t,[[0,960,540,1.0],[tA-0.3,A5_ONE[0],A5_ONE[1]-20,1.32],[tNd-0.5,960,540,1.0],[tEd-0.5,960,556,1.04]],1.8);
      const st=fin(t,w("need","stretch")-0.2,1.2)*(1-fin(t,tEd-0.4,1.0)),one=fin(t,tA-0.2,0.8)*(1-fin(t,tFe-0.2,0.8));
      a5_face(cx,t,{st,one,dim:Math.max(0.6*a5_win(t,tFe-0.3,tNd-0.5,0.8),0.8*fin(t,tEd-0.4,0.9))});cx.restore();setScreen(cx,S);vign(cx,S);
      bab_tag(cx,960,214,"one brick among millions",a5_win(t,w("lost","among millions")-0.2,w("lost","nobody")+0.5,0.6));
      bab_tag(cx,640,214,"who made it?",a5_win(t,w("lost","who had made")-0.2,tFe-0.3,0.6),{col:ACA_WARN});
      bab_tag(cx,1280,214,"what was it for?",a5_win(t,w("lost","what it was for")-0.2,tFe-0.3,0.6),{col:ACA_WARN});
      bab_tag(cx,960,214,"his work, forgotten?",a5_win(t,w("feared","his work")-0.2,w("feared","his words")-0.7,0.6),{col:ACA_WARN});
      bab_quote(cx,470,150,980,"so that any future king does not have my carefully selected words removed","Nabopolassar, in his own words",{a:a5_win(t,w("feared","his words")-0.1,tNd-0.5,0.7),size:40});
      bab_tag(cx,640,214,"who built this stretch?",a5_win(t,w("need","who had built")-0.2,tEd-0.4,0.6));
      bab_tag(cx,1280,214,"and what for?",a5_win(t,w("need","what for")-0.2,tEd-0.4,0.6));
      // two bricks of the river wall: one stamped on its edge, one written by hand; the first moves to the middle as it's read
      const tB1=w("edge","edges")-0.4,tSt=w("edge","stamped"),tWr=w("edge","wrote"),tNm=w("edge","king's name"),tWk=w("edge","the work"),tRk=w("reads","Nabopolassar, king"),tRw=w("reads","the one who");
      const mv=easeCam(clamp((t-tRe+0.3)/1.4,0,1)),bx=lerp(170,470,mv),R=a5_brick3(cx,bx,560,700,{a:0}),b1A=fin(t,tB1,0.8);
      if(b1A>0.01){arrive(cx,bx+490,560,t,tB1,()=>{a5_brick3(cx,bx,560,700,{stamp:fin(t,tSt-0.15,0.35),press:pulseAt(t,tSt-0.3,0.7),
            hiName:Math.max(a5_win(t,tNm-0.2,tWk-0.2,0.4),a5_win(t,tRk-0.2,tRw-0.2,0.4)),hiWork:Math.max(a5_win(t,tWk-0.2,tRe-0.6,0.4),a5_win(t,tRw-0.2,w("reads","his lord")+0.8,0.5))});
          // its edge, lit as the voice names it
          const eA=a5_win(t,tB1+0.4,tSt+0.2,0.5);if(eA>0.01){cx.save();cx.strokeStyle=rgba(ACA,0.9*eA);cx.lineWidth=4;cx.shadowColor=rgba(ACA,0.9);cx.shadowBlur=18;rr(cx,bx-4,556,708,176,8);cx.stroke();cx.restore();}},{dy:-16,a:b1A});
        // what the labels point at
        const lO=1-fin(t,tRe-0.6,0.5),nA=fin(t,tNm-0.2,0.5)*lO,kA=fin(t,tWk-0.2,0.5)*lO;
        [[nA,330,R.name],[kA,790,R.work]].forEach(([q,lx,[px,py]])=>{if(q>0.01)withA(cx,q,()=>{cx.save();cx.strokeStyle=rgba(BAB_CLAY,0.85);cx.lineWidth=2.2;cx.beginPath();cx.moveTo(lx,778);cx.lineTo(px,py+10);cx.stroke();cx.fillStyle=rgba(BAB_CLAY,1);cx.beginPath();cx.arc(px,py+10,5,0,TAU);cx.fill();cx.restore();});});
        bab_tag(cx,bx+350,800,"on the edge",a5_win(t,w("edge","edges")-0.1,tSt-0.8,0.5));
        bab_tag(cx,bx+350,800,"stamped",a5_win(t,tSt-0.2,tNm-0.4,0.5));
        bab_tag(cx,330,800,"the king's name",nA);bab_tag(cx,790,800,"the work it was for",kA);}
      const b2A=fin(t,tWr-0.3,0.7)*(1-fin(t,tRe-0.6,0.6));
      if(b2A>0.01){arrive(cx,1566,620,t,tWr-0.3,()=>a5_brick3(cx,1300,610,380,{hand:clamp((t-tWr+0.1)/1.6,0,1)}),{dy:-16,a:b2A});bab_tag(cx,1566,800,"or written by hand",b2A);}
      // what one reads
      bab_quote(cx,260,90,1400,"Nabopolassar, king of Babylon, … the one who built the embankment of the Arahtu River for the god Marduk, his lord.","on a brick of the river wall",{a:fin(t,tRe-0.1,0.8),size:40});});
  // Babylon from across the river, at sunrise: the river wall's last courses being laid, and the stretches later kings laid again
  if(uF<0.999)a5_fade(ctx,1-uF,cx=>{setScreen(cx,S);cx.save();
      const tWo=w("city","workmen"),tBk=w("city","wall of baked brick"),tKa=w("never","king after king");
      focus(cx,t,[[0,960,560,1.0],[w("city","Along the river")-0.4,920,640,1.2],[tWo-0.5,800,742,1.7],[tNe-0.3,1010,700,1.24]],1.9);
      const dawn=0.5+0.4*fin(t,0,14),day=0.3*fin(t,6,12),emb=0.6+0.4*clamp((t-tWo+0.4)/5.8,0,1);
      const kings=A5_KINGS.map(([x0,x1,d,tone])=>[x0,x1,clamp((t-tKa-d+0.2)/1.4,0,1),tone]),wA=fin(t,tWo-0.8,1.0)*(1-fin(t,tNe+1.4,1.4));
      a5_view(cx,t,{dawn,day,emb,kings,embHi:0.5*pulseAt(t,tBk-0.2,2.2),near:c2=>{if(wA<=0.01)return;const y=a5_embTop(emb);
        a5_fade(c2,wA,c3=>{for(let i=0;i<4;i++)bab_folk(c3,520+i*150+(t-tWo)*12,y,34,"carry",t,{dir:1,step:t*3.4+i*1.7,rim:0.7});bab_folk(c3,1160,y,36,"stand",t,{dir:-1,rim:0.7});});}});
      const bA=fin(t,1.5,1.5)*(1-fin(t,tLo-1.4,1.0));if(bA>0.01)bab_boat(cx,1700-t*10,A5_WY+56,0.4,t,{a:bA,rim:0.3});
      cx.restore();setScreen(cx,S);
      eaYear(cx,80,80,"Babylon · Nabopolassar's reign, 625 to 605 BCE",ACA,fin(t,0.6,0.8)*(1-fin(t,tNe-0.4,0.6)));
      bab_tag(cx,960,214,"a river wall of baked brick",a5_win(t,tBk-0.2,w("city","to keep")+0.1,0.6));
      bab_tag(cx,960,214,"to keep the river's water out",a5_win(t,w("city","to keep")+0.6,tNe-0.3,0.6));
      bab_tag(cx,960,214,"never done: king after king, on the same line",a5_win(t,tKa-0.3,w("never","for centuries")-0.2,0.6));
      bab_tag(cx,960,214,"repaired for centuries",a5_win(t,w("never","for centuries")+0.3,tLo-0.8,0.6));});
  acaTitle(ctx,S,t,B+0.8,"Every change, checked","every element owned and sourced; every change tested and walked","Film 5 of 6 · AI and continuous architecture");});

/* ---------- 2. What will it touch? ---------- */
// Tomás and the map, changing every day; planned work on a street; last year's move to a new table, and the letters that kept reading
// the old one; the wrong date, and power off without warning; nobody could see what read the old table; the head of retail's ticket;
// and what Tomás needs to know before anyone builds
// the changes of a day: each one lands on an element of the map, dashed, and its owner confirms it with a gold tick
function a5_changes(ctx,t,R,t0,t1,a){if(a<=0.01||!R.length)return;withA(ctx,a,()=>{for(let i=0;i<40;i++){const ti=t0+i*0.32;if(ti>t1)break;const u=(t-ti)/1.6;if(u<=0||u>=1)continue;
  const[x,y,bw,bh]=R[Math.floor(hash(i,951)*R.length)],q=Math.sin(Math.PI*u);
  ctx.save();ctx.setLineDash([7,6]);ctx.strokeStyle=rgba(KT_AI,0.9*q);ctx.lineWidth=2.4;rr(ctx,x-5,y-5,bw+10,bh+10,10);ctx.stroke();ctx.restore();
  if(u>0.35)kt_gtick(ctx,x+bw-4,y+2,11,clamp((u-0.35)*4,0,1)*clamp(q*1.6,0,1));}});}
scene("touch",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tPl=c("planned"),tMo=c("moved"),tWr=c("wrong"),tNb=c("nobody"),tTi=c("ticket"),tAs=c("ask");
  ctx.save();drift(ctx,t,sc,{z:0.02,y:480});
  // Tomás, with the map; away while the street is shown; back, concerned, then thinking it through
  a5_who(ctx,"tomas",200,Math.min(1,fin(t,0.3,0.8)*(1-fin(t,tPl-0.7,0.7))+fin(t,tNb-0.3,0.8)),t,{expr:a5_expr("calm","concerned",a5_win(t,tNb-0.2,tTi-0.4,0.6))});
  a5_name(ctx,"Tomás Herrera · enterprise architect",a5_win(t,0.8,4.2,0.6));
  // the map, changing every day: changes landing on its elements, each confirmed by its owner
  const mA=fin(t,0.5,0.8)*(1-fin(t,tPl-0.9,0.5));
  if(mA>0.01){const R=a5_texMap(ctx,t,A5_TM,{a:mA,p:clamp((t-0.5)/1.4,0,1)});a5_changes(ctx,t,R||[],1.4,tPl-1.2,mA);
    a5_say(ctx,t,1090,770,"140 changes last month",KT_AI,w("busy","a hundred and forty")-0.3,tPl-0.7,{a:mA});
    a5_say(ctx,t,1090,840,"each confirmed by its owner",BIZ,w("busy","confirmed")-0.3,tPl-0.7,{a:mA});}
  // planned work: the network's crew switches a street off to mend its lines; the households' letter
  const sA=fin(t,tPl-0.3,0.8)*(1-fin(t,tMo-0.9,0.5)),tSw=w("planned","switch a street off"),tHh=w("planned","Households");
  if(sA>0.01){withA(ctx,sA,()=>a5_street(ctx,t,{homes:clamp((t-tPl+0.3)/1.0,0,1),work:fin(t,w("planned","crews")-0.3,0.6),dark:A5_SX.map((_,i)=>fin(t,tSw+0.2+i*0.12,0.5)),
      sparks:a5_win(t,w("planned","mend")-0.2,tHh+0.2,0.5),letters:A5_SX.map((_,i)=>fin(t,w("planned","a letter")-0.2+i*0.08,0.5))}));
    a5_say(ctx,t,960,214,"planned work",A5_NET,tPl-0.1,tSw-0.6);
    a5_say(ctx,t,960,214,"the crews switch the street off",A5_NET,tSw,w("planned","mend")-0.6);
    a5_say(ctx,t,960,214,"to mend or replace its lines",A5_NET,w("planned","mend"),tHh-0.6);
    const lA=fin(t,tHh-0.2,0.7)*sA;if(lA>0.01)arrive(ctx,1480,270,t,tHh-0.2,()=>a5_letter(ctx,1200,100,560,"the network",["Planned work","on your street:","Thursday, 9:00 to 15:00"],{}),{dy:-12,a:lA});
    a5_say(ctx,t,640,214,"a letter first",A5_HH,tHh,tMo-0.6,{a:sA});}
  // last year: planned work moved to a new table; the crews' plan read the new one, and the letters kept reading the old one
  const vA=fin(t,tMo-0.3,0.7)*(1-fin(t,tWr-0.9,0.5)),tNw=w("moved","to a new table"),tKp=w("moved","kept reading");
  if(vA>0.01){withA(ctx,vA,()=>{a5_table(ctx,520,300,440,"planned work, old",{old:fin(t,tNw+0.6,1.0),t});
      const nA=fin(t,tNw-0.3,0.7);if(nA>0.01)arrive(ctx,740,598,t,tNw-0.3,()=>a5_table(ctx,520,550,440,"planned work, new",{hi:pulseAt(t,tNw,1.6),rows:clamp((t-tNw)/1.4,0,1),t}),{dy:10,a:nA});
      a5_flow(ctx,740,400,740,546,t,TECH,a5_win(t,tNw-0.2,tKp+1.0,0.6),{head:true,n:3,v:0.8});
      a5_job(ctx,1180,306,520,"the letters",{col:A5_NET,t,hi:pulseAt(t,w("moved","the letters")-0.2,1.6)});
      a5_job(ctx,1180,556,520,"the crews' plan",{col:A5_NET,t,a:fin(t,tNw+0.2,0.7)});
      a5_flow(ctx,964,348,1176,348,t,ACA_WARN,fin(t,tKp-0.3,0.6),{head:true,n:3});
      a5_flow(ctx,964,598,1176,598,t,A5_NET,fin(t,tNw+0.3,0.6),{head:true,n:3});});
    a5_say(ctx,t,960,180,"last year",SOFT,tMo-0.1,tWr-0.6,{a:vA});
    a5_say(ctx,t,1440,470,"still reading the old table",ACA_WARN,tKp-0.1,tWr-0.6,{size:28,a:vA});}
  // the wrong date: the letter's day against the crews'; for three weeks, 1,900 households; on the real day, power off without warning
  const gA=fin(t,tWr-0.3,0.7)*(1-fin(t,tNb-0.9,0.5)),tRd=w("wrong","real day"),tOf=w("wrong","went off"),tWn=w("wrong","without warning");
  if(gA>0.01){withA(ctx,gA,()=>{arrive(ctx,740,265,t,tWr-0.3,()=>a5_day(ctx,560,170,360,"Monday","the letter said",[214,206,190],{bad:fin(t,w("wrong","wrong date")-0.2,0.5)}),{dy:-10});
      arrive(ctx,1180,265,t,tWr,()=>a5_day(ctx,1000,170,360,"Thursday","the crews came",A5_NET,{}),{dy:-10});
      a5_street(ctx,t,{homes:clamp((t-tRd+0.3)/0.9,0,1),dark:A5_SX.map((_,i)=>fin(t,tOf+i*0.08,0.4)),warn:A5_SX.map((_,i)=>fin(t,tWn-0.1+i*0.08,0.5))});});
    a5_say(ctx,t,760,430,"for three weeks",ACA_WARN,w("wrong","three weeks")-0.2,tNb-0.6,{size:28,a:gA});
    a5_say(ctx,t,1160,430,"1,900 households",ACA_WARN,w("wrong","nineteen hundred")-0.2,tNb-0.6,{size:28,a:gA});
    a5_say(ctx,t,960,760,"no warning",A5_RED,tWn,tNb-0.6,{a:gA});}
  // nobody had done anything wrong; nobody could see what read the old table
  const nA=fin(t,tNb-0.3,0.7)*(1-fin(t,tTi-0.9,0.5)),tSe=w("nobody","could see");
  if(nA>0.01){withA(ctx,nA,()=>{a5_table(ctx,700,382,440,"planned work, old",{old:1,t});
      [[1290,262],[1290,402],[1290,542]].forEach(([x,y],i)=>{const q=fin(t,tSe-0.2+i*0.2,0.6);if(q>0.01){a5_job(ctx,x,y,330,"?",{miss:1,t,a:q});a5_flow(ctx,1144,430,x-4,y+42,t,ACA_WARN,q*0.8,{n:2});}});});
    a5_say(ctx,t,1100,214,"nobody did anything wrong",SOFT,tNb+0.2,tSe-0.7);
    a5_say(ctx,t,1100,214,"what reads the old table?",ACA_WARN,tSe-0.1,tTi-0.6,{a:nA});}
  // the head of retail's ask, in a ticket: a text to each household, two days before planned work
  const kA=fin(t,tTi-0.3,0.7),tTx=w("ticket","for a text");
  if(kA>0.01){arrive(ctx,880,330,t,tTi-0.2,()=>a5_ticket(ctx,520,210,720,"A text to each household, two days before planned work","asked by the head of retail",{hi:pulseAt(t,w("ticket","in a ticket")-0.1,1.6)}),{dy:-12,a:kA});
    const pA=fin(t,tTx-0.2,0.7)*(1-fin(t,tAs-0.4,0.6));if(pA>0.01)arrive(ctx,1600,370,t,tTx-0.2,()=>a5_phone(ctx,1340,220,"your retailer",["Planned work on","your street on","Thursday, 9:00 to 15:00"],{p:clamp((t-tTx)/1.6,0,1)}),{dy:-12,a:pA});
    a5_say(ctx,t,1600,580,"two days before",A5_RET,w("ticket","two days")-0.2,tAs-0.4);
    // what Tomás needs to know, before anyone builds it
    a5_say(ctx,t,880,530,"before anyone builds it",BIZ,tAs-0.1,null);
    a5_say(ctx,t,1540,330,"what does it touch?",ACA_WARN,w("ask","what it touches")-0.2,null,{size:34});
    a5_say(ctx,t,1540,420,"who must agree?",ACA_WARN,w("ask","who must agree")-0.2,null,{size:34});}
  ctx.restore();vign(ctx,S);});

/* ---------- 3. Checked on every change ---------- */
// Like a stamped brick, every element says who owns it and where it came from; the checks the map is tested on, each named as it
// passes; a check that has never failed, and a change that breaks it; the case that must fail: the network's list of homes with solar
// panels, stopped at the wall; fitness functions; and a change that fails one, waiting until it's fixed or its owner says why
const A5_CHK=[["every element has an owner and a source","list","Every element","a source"],["every capability is realised by a process or a system","list","Every capability","or a system"],
  ["every data object stands for a business object","none","Every data object","business object"],["no element is left unlinked","none","No element","unlinked"],
  ["none is there twice","none","none is there","twice"],["every rule has a home, and a case that must fail","rule","every rule","must fail"]];
scene("checks",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tLi=c("list"),tNv=c("never"),tSo=c("solar"),tNa=c("name"),tHe=c("held"),tTe=w("like","tested");
  ctx.save();drift(ctx,t,sc,{z:0.02,y:480});
  // like a stamped brick, every element says who owns it and where it came from; so the map is tested on every change, as code is
  const lO=1-fin(t,tLi-0.9,0.6);
  if(lO>0.01){const bA=fin(t,w("like","stamped brick")-0.3,0.8)*lO,eA=fin(t,w("like","every element")-0.3,0.8)*lO;
    if(bA>0.01)arrive(ctx,480,590,t,w("like","stamped brick")-0.3,()=>a5_brick3(ctx,200,600,400,{stamp:1}),{dy:-12,a:bA});
    if(eA>0.01)arrive(ctx,1330,480,t,w("like","every element")-0.3,()=>a5_stamp(ctx,960,330,740,"object","OBJ-012","planned work","Grace","the network's procedures",A5_INF,
      {hiOwn:pulseAt(t,w("like","who owns")-0.1,1.6),hiSrc:pulseAt(t,w("like","where it came")-0.1,1.6),hi:fin(t,tTe-0.2,0.6)}),{dy:-12,a:eA});
    a5_runs(ctx,722,770,14,clamp((t-tTe-0.2)/2.2,0,1),{a:fin(t,tTe-0.2,0.5)*lO});
    a5_say(ctx,t,960,846,"tested on every change, as code is",A5_OK,w("like","as code")-0.2,tLi-0.9,{a:lO});}
  // the checks, run on every change: each named as it passes; then the rule's own check, shown a change that breaks it
  const pA=fin(t,tLi-0.35,0.6)*(1-fin(t,tSo-0.9,0.6))+fin(t,tNa-0.3,0.6)*(1-fin(t,tHe-0.8,0.5)),back=t>tSo;
  if(pA>0.01){const dm=back?0:a5_win(t,tNv-0.3,tSo,0.6),tBr=w("never","shown a change"),tSp=w("never","must stop");
    const rows=A5_CHK.map(([label,ln,a0,p0],i)=>{const ta=w(ln,a0)-0.2,tp=w(ln,p0)+0.3;
      return{label,a:(back?1:fin(t,ta,0.5))*(i===5?1:1-0.65*dm),run:back?0:fin(t,ta+0.3,0.4),pass:back?1:fin(t,tp,0.4),fail:i===5&&!back?fin(t,tSp-0.1,0.4):0,hi:i===5?dm:0};});
    const gx=back?0:-150*easeCam(clamp((t-tBr+0.6)/1.4,0,1));ctx.save();ctx.translate(gx,0);
    arrive(ctx,960,376,t,back?tNa-0.3:tLi-0.35,()=>a5_checks(ctx,380,130,1160,rows,{t}),{dy:-12,a:pA});
    if(!back){// a check that has never failed: a row of green runs; then a change that breaks the rule, stopped
      const rA=a5_win(t,w("never","never failed")-0.4,tSo-0.9,0.5);if(rA>0.01)a5_runs(ctx,620,700,20,clamp((t-w("never","never failed")+0.4)/1.0,0,1),{a:rA});
      a5_say(ctx,t,960,786,"never failed?",ACA_WARN,w("never","never failed")-0.2,tBr-0.3);
      a5_say(ctx,t,960,840,"it may be checking nothing",ACA_WARN,w("never","checking nothing")-0.2,tBr-0.3);
      a5_say(ctx,t,960,786,"stopped: the check works",A5_OK,tSp+0.2,tSo-0.9);}
    ctx.restore();
    if(!back){const bA=a5_win(t,tBr-0.2,tSo-0.9,0.6);if(bA>0.01)arrive(ctx,1590,574,t,tBr-0.2,()=>{a5_card(ctx,1440,500,330,"a change",["that breaks it"],A5_RED,{size:30});kt_rcross(ctx,1754,506,18,fin(t,tSp,0.4));},{dy:8,a:bA});}}
  // the case that must fail: the network's list of homes with solar panels, sent to retail, stopped at the wall
  const cA=fin(t,tSo-0.3,0.7)*(1-fin(t,tNa-0.8,0.5));
  if(cA>0.01)arrive(ctx,960,420,t,tSo-0.3,()=>a5_case(ctx,360,200,1200,t,{go:clamp((t-w("solar","Sending")+0.1)/3.6,0,1),stop:fin(t,w("solar","must fail")-0.1,0.5),ok:fin(t,w("solar","It does")-0.1,0.6)}),{dy:-12,a:cA});
  // fitness functions: tests that the architecture still holds
  const fA=fin(t,w("name","fitness functions")-0.3,0.6)*(1-fin(t,tHe-0.8,0.5));
  if(fA>0.01)arrive(ctx,960,730,t,w("name","fitness functions")-0.3,()=>{T(ctx,"fitness functions",960,734,{w:800,size:52,align:"center",color:rgba(A5_OK,1)});
    withA(ctx,fin(t,w("name","tests that")-0.2,0.6),()=>T(ctx,"tests that the architecture still holds",960,800,{w:700,size:32,align:"center",color:rgba(INK,0.94)}));},{dy:8,a:fA});
  // a change that fails one waits, until it's fixed, or its owner says why
  const hA=fin(t,tHe-0.3,0.7);
  if(hA>0.01){arrive(ctx,960,430,t,tHe-0.3,()=>a5_gate(ctx,900,430,t,{wait:fin(t,w("held","fails one")-0.2,0.5),fix:clamp((t-w("held","fixed")+0.1)/1.2,0,1)}),{dy:-10,a:hA});
    a5_say(ctx,t,760,700,"until it's fixed",A5_OK,w("held","until it's fixed")-0.2,null);
    a5_say(ctx,t,1240,700,"or its owner says why",BIZ,w("held","owner says why")-0.2,null);}
  ctx.restore();vign(ctx,S);});

/* ---------- 4. Test the agent first ---------- */
// Tomás walked the social tariff by hand in a day; the map agent drafts a walk in minutes; before anyone relies on it, it's tested on
// a change whose answer is known: the social tariff's fourteen elements and five owners (as When strategy moves walked it); the
// first run finds thirteen and misses the secure exchange; nothing on the map linked the agreement to it; the line is drawn and a
// check added; run again, it finds all fourteen; and the test runs again whenever its model or instructions change
const A5_TL={x:170,y:120,w:1300,sh:90,gap:12},A5_TH=70;
// [layer, x, width, name, kind]: the social tariff's walk, fourteen elements; the agreement and the secure exchange at the left
const A5_T14=[[0,430,260,"the direction","driver"],[0,710,250,"keep bills affordable","goal"],[0,980,520,"eligible households on the tariff","outcome"],
  [1,710,250,"sell energy","capability"],[1,980,250,"serve customers","capability"],[1,1250,260,"meet obligations","capability"],
  [2,430,220,"agreement","object"],[2,670,250,"social tariff","product"],[2,940,260,"apply the discount","process"],[2,1220,300,"social services agency","actor"],
  [3,980,250,"eligibility","object"],[4,710,250,"billing system","component"],[4,980,250,"customer system","component"],[5,430,250,"secure exchange","node"]];
const A5_TOWN=["Ama","the board","head of retail","IT","the agency"];
// the walk's map: its six layers and fourteen elements, each in its state (o.st[k]: lit, gold, miss, dim); o.gap (0..1) the line
// nobody had drawn, between the agreement and the secure exchange, dashed with a question; o.line (0..1) that line, drawn
function a5_tmap(ctx,t,o){const M=A5_TL,p=o.p==null?1:o.p,B=layerStack(ctx,M.x,M.y,M.w,{p,sh:M.sh,gap:M.gap,size:30});if(p<0.4)return;
  withA(ctx,clamp(p*2-0.8,0,1),()=>{A5_T14.forEach(([li,x,w_,nm,kind],k)=>{const s=o.st[k]||{};a5_el(ctx,x,B[li][1]+(M.sh-A5_TH)/2,w_,A5_TH,nm,LAY6[li][1],kind,{t,size:28,lit:s.lit,gold:s.gold,miss:s.miss,dim:s.dim});});
    const ag=A5_T14[6],x=ag[1]+ag[2]/2,y0=B[2][1]+(M.sh+A5_TH)/2+6,y1=B[5][1]+(M.sh-A5_TH)/2-6,g=clamp(o.gap||0,0,1),ln=clamp(o.line||0,0,1);
    if(g>0.01)withA(ctx,g*(1-ln),()=>{ctx.save();ctx.setLineDash([10,10]);ctx.lineDashOffset=-t*8;ctx.strokeStyle=rgba(ACA_WARN,0.9);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,y0);ctx.lineTo(x,y1);ctx.stroke();ctx.restore();
      const my=(y0+y1)/2;ctx.save();ctx.fillStyle="rgba(30,20,6,0.96)";ctx.beginPath();ctx.arc(x,my,24,0,TAU);ctx.fill();ctx.restore();ring(ctx,x,my,24,ACA_WARN,1,2.6);T(ctx,"?",x,my+11,{w:800,size:32,align:"center",color:rgba(ACA_WARN,1)});});
    if(ln>0.01){ctx.save();ctx.strokeStyle=rgba(BIZ,0.95);ctx.lineWidth=3.4;ctx.shadowColor=rgba(BIZ,0.8);ctx.shadowBlur=12;ctx.beginPath();ctx.moveTo(x,y0);ctx.lineTo(x,lerp(y0,y1,ease(ln)));ctx.stroke();ctx.restore();}});}
// the five owners who had to agree, on the right: each with a gold tick
function a5_towners(ctx,t,a,t0){if(a<=0.01)return;withA(ctx,a,()=>{T(ctx,"5 owners",1580,190,{f:"mono",w:500,size:28,color:rgba(BIZ,1)});
  A5_TOWN.forEach((nm,i)=>a5_owner(ctx,1600,250+i*66,nm,fin(t,t0+i*0.12,0.4),{size:28}));});}
scene("test",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tBe=c("before"),tTa=c("tariff"),tFi=c("first"),tLn=c("line"),tGp=c("gap"),tAg=c("again"),tAI=w("day","The map agent");
  const tFt=w("tariff","fourteen"),tFv=w("tariff","five owners"),tFd=w("first","finds thirteen"),tMs=w("first","misses"),tR=w("again","finds all"),tKn=w("line","Tomás knew");
  const tDr=w("gap","line is drawn"),tCa=w("gap","a check added"),tTr=w("again","The test runs");
  ctx.save();drift(ctx,t,sc,{z:0.02,y:480});
  // Tomás walked the social tariff through every layer by hand: a day
  a5_who(ctx,"tomas",200,fin(t,0.3,0.8)*(1-fin(t,tBe-0.4,0.7)),t,{});
  const dA=fin(t,0.6,0.8)*(1-fin(t,tBe-0.4,0.6));
  if(dA>0.01){arrive(ctx,840,290,t,0.6,()=>a5_card(ctx,520,220,640,"the social tariff",["walked through every layer, by hand"],BIZ),{dy:-10,a:dA});
    const kA=fin(t,w("day","a day")-0.3,0.6)*dA;if(kA>0.01)withA(ctx,kA,()=>{a5_clock(ctx,600,440,34,BIZ,t,1);T(ctx,"a day",656,456,{w:800,size:44,color:rgba(BIZ,1)});});}
  // before anyone relies on its walks: a test, on a change whose answer is known
  a5_say(ctx,t,960,520,"before anyone relies on its walks",KT_AI,w("before","before anyone")-0.2,tTa-1.0);
  const bA=fin(t,w("before","tested")-0.3,0.7)*(1-fin(t,tTa-0.9,0.5));
  if(bA>0.01)arrive(ctx,960,330,t,w("before","tested")-0.3,()=>a5_card(ctx,560,240,800,"a test",["a change whose answer is known:","the social tariff, as Tomás walked it"],TECH,{size:32}),{dy:-10,a:bA});
  // the walk's map, whose answer is known: fourteen elements; five owners
  const mA=fin(t,tTa-0.3,0.8);
  if(mA>0.01){const st=A5_T14.map((e,k)=>{const sec=k===13;return{gold:fin(t,tFt-0.2+k*0.05,0.4)*(1-fin(t,tFi-0.4,0.6)),
        lit:sec?fin(t,tR-0.1+k*0.04,0.4):Math.max(fin(t,tFd-0.6+k*0.06,0.4)*(1-fin(t,tLn-0.4,0.6)),fin(t,tR-0.1+k*0.04,0.4)),
        miss:sec?fin(t,tMs-0.1,0.5)*(1-fin(t,tR,0.6)):0,dim:(k===6||k===13)?0:0.85*a5_win(t,tLn-0.3,tAg-0.4,0.7)};});
    withA(ctx,mA,()=>a5_tmap(ctx,t,{p:clamp((t-tTa+0.3)/1.3,0,1),st,gap:a5_win(t,w("line","nothing linked")-0.2,tDr+0.4,0.5),line:clamp((t-tDr+0.2)/0.9,0,1)}));}
  a5_say(ctx,t,620,800,"14 elements",BIZ,tFt-0.2,tFi-0.4);
  a5_towners(ctx,t,a5_win(t,tFv-0.3,tFi-0.4,0.6)+fin(t,w("again","five owners")-0.3,0.6)*(1-fin(t,sc.dur-1.6,0.6)),t<tAg?tFv-0.2:w("again","five owners")-0.2);
  // the first run: thirteen of fourteen; the secure exchange missed
  a5_say(ctx,t,560,800,"13 of 14",KT_AI,tFd,tLn-0.4);
  a5_say(ctx,t,1010,800,"missed: the secure exchange",ACA_WARN,tMs-0.1,tLn-0.4);
  a5_say(ctx,t,1000,676,"it carries the agency's answers",SOFT,w("first","carries")-0.2,tLn-0.4,{size:28});
  // nothing on the map linked the agreement to it; Tomás knew it from his walk, but nobody had drawn the line
  a5_say(ctx,t,820,800,"nothing linked the agreement to it",ACA_WARN,w("line","nothing linked")-0.2,w("line","nobody had drawn")-0.8);
  a5_say(ctx,t,820,800,"nobody had drawn the line",ACA_WARN,w("line","nobody had drawn")-0.2,tGp-0.7);
  a5_who(ctx,"tomas",1720,a5_win(t,tKn-0.4,tAg-0.6,0.7),t,{right:true,expr:a5_expr("calm","concerned",a5_win(t,tKn-0.2,tGp+1.2,0.6))});
  // the gap was the map's: the line drawn, and a check added for every agreement with a partner
  a5_say(ctx,t,820,800,"the gap was the map's",BIZ,tGp-0.1,tCa-0.8);
  const rA=a5_win(t,tCa-0.2,tAg-0.4,0.6);if(rA>0.01)arrive(ctx,920,800,t,tCa-0.2,()=>a5_checkRow(ctx,360,800,1120,"every agreement with a partner says how its data travels",
    {add:1,run:fin(t,tCa+0.4,0.4),pass:fin(t,w("gap","data travels")+0.3,0.4),t}),{dy:8,a:rA});
  // run again: all fourteen, and the five owners; the test runs again whenever its model or its instructions change
  a5_say(ctx,t,560,800,"14 of 14",KT_AI,w("again","all fourteen")-0.2,tTr-0.7);
  a5_say(ctx,t,820,800,"run again when its model or instructions change",KT_AI,tTr-0.1,sc.dur-1.5);
  // the map agent: named in the middle; then in its corner while the test runs; it leaves before the chapter ends
  const mv=easeCam(clamp((t-tTa+1.8)/1.8,0,1)),ax=lerp(1440,100,mv),ay=lerp(470,826,mv),ar=lerp(46,22,mv),agA=fin(t,tAI-0.3,0.8)*(1-fin(t,sc.dur-1.9,0.8));
  if(agA>0.01){aca_agent(ctx,ax,ay,ar,t,{a:agA,busy:0.3+0.5*a5_win(t,tFd-0.8,tMs+0.6,0.6)+0.5*a5_win(t,tR-0.6,tR+1.4,0.6)});
    withA(ctx,agA,()=>{const nm="the map agent";if(mv<0.5)withA(ctx,1-mv*2,()=>T(ctx,nm,ax,ay+ar*1.95+38,{w:800,size:30,align:"center",color:rgba(KT_AI,1)}));
      if(mv>0.5)withA(ctx,mv*2-1,()=>T(ctx,nm,156,836,{w:800,size:28,color:rgba(KT_AI,1)}));});
    a5_loop(ctx,ax,ay,40,t,KT_AI,fin(t,tTr-0.2,0.6)*agA);}
  a5_say(ctx,t,1440,660,"a draft walk, in minutes",KT_AI,w("day","in minutes")-0.3,tBe+0.6);
  ctx.restore();vign(ctx,S);});

/* ---------- 5. Walking the change ---------- */
// The new change, walked down the map from the ticket to the tables: the network's side and retail's, with the wall between them;
// planned work, the network's; phone numbers, retail's; the notice the network gives every retailer on the same terms; the tables;
// the one new element, a texting service with no owner, where the checks stop until the head of retail takes it; who must agree,
// each with an ID and evidence
const A5_WR=[200,340,480,620],A5_WL=[["business",A5_BUS],["information",A5_INF],["application",A5_APP],["tables",TECH]];
// [row, x, width, name, kind]: the board's elements, the network's on the left, retail's on the right, the notice on the wall
const A5_WE=[[0,330,300,"plan the work","process"],[0,1040,320,"text customers","process"],
  [1,330,300,"planned work","object"],[1,800,300,"the notice","object"],[1,1180,320,"phone numbers","object"],
  [2,330,300,"work planning","component"],[2,1040,300,"customer system","component"],[2,1360,300,"texting service","component"],
  [3,330,280,"planned work","table"],[3,630,280,"supply points","table"],[3,1040,340,"customer contacts","table"]];
// who must agree, as the agent lists them: name, what of the change is theirs, its ID, its evidence
const A5_WOWN=[["Grace Achieng","planned work","OBJ-012","the network's procedures"],["the head of retail","the texting service","APP-051","the ticket"],
  ["Ama Owusu","the rule at the wall","PRN-003","the regulator's code"],["Inés Duarte","the notice's data contract","planned_work_notice v1","the code"]];
// the ticket the change comes from, as a pill at the top of the board
function a5_tix(ctx,cx,y,a,hi){if(a<=0.01)return;withA(ctx,a,()=>{const s="a text to each household, two days before planned work",k="ticket",sw=tw(ctx,s,28,800),kw=tw(ctx,k,28,500,"mono"),w_=sw+kw+90;
  glass(ctx,cx-w_/2,y-26,w_,52,26,BIZ,{glow:10+14*(hi||0),ea:0.9,fill:"rgba(14,12,6,0.97)"});T(ctx,k,cx-w_/2+30,y+10,{f:"mono",w:500,size:28,color:rgba(BIZ,1)});T(ctx,s,cx-w_/2+60+kw,y+10,{w:800,size:28,color:rgba(INK,0.96)});});}
scene("walk",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tWo=c("work"),tPh=c("phones"),tWa=c("wall"),tTb=c("tables"),tNe=c("new"),tOw=c("owners"),tCi=c("cites");
  const tTx=w("new","texting service"),tNo=w("new","no owner"),tSt=w("new","checks stop"),tTk=w("new","takes it");
  ctx.save();drift(ctx,t,sc,{z:0.015,y:480});
  const dm=0.8*fin(t,tOw-0.4,0.8);
  a5_fade(ctx,1-dm,cx=>{
    // the ticket the change comes from, and the board: two sides, the wall between, four rows down to the tables
    a5_tix(cx,960,74,fin(t,0.6,0.7),pulseAt(t,w("down","from the ticket")-0.1,1.6));
    const bd=fin(t,0.9,0.8);withA(cx,bd,()=>{cx.save();cx.fillStyle=rgba(A5_NET,0.05);rr(cx,300,150,620,580,20);cx.fill();cx.fillStyle=rgba(A5_RET,0.05);rr(cx,1000,150,700,580,20);cx.fill();cx.restore();
      T(cx,"the network",610,136,{w:800,size:28,align:"center",color:rgba(A5_NET,1)});T(cx,"retail",1350,136,{w:800,size:28,align:"center",color:rgba(A5_RET,1)});
      A5_WL.forEach(([nm,col],r)=>T(cx,nm,60,A5_WR[r]+52,{w:800,size:28,color:rgba(col,0.95)}));});
    a5_wallV(cx,930,150,60,580,{a:bd,hi:a5_win(t,w("wall","same terms")-0.3,tTb-0.4,0.6)});
    // the elements, each lit as the agent walks past it, and as the voice names it
    // each row as the agent passes it, on its way down (its ease, solved for the row's middle; the tables just before it stops)
    const tWk=w("down","walks it")-0.1,walkAt=r=>tWk+2.8*Math.acos(1-2*Math.min(0.985,(A5_WR[r]+42-110)/552))/Math.PI,lit=(r,k)=>Math.max(0.8*pulseAt(t,walkAt(r)-0.1,1.4),k);
    const name=(k,t0,t1)=>a5_win(t,t0,t1==null?tOw:t1,0.5);
    const L={0:name(0,tWo-0.2,tWo+3.6),1:name(1,w("wall","texts its own")-0.3,tTb-0.4),2:name(2,tWo-0.2,tPh-0.6),3:name(3,w("wall","which homes")-0.3,w("wall","each retailer texts")-0.3),
      4:Math.max(name(4,tPh-0.2,tWa-0.4),name(4,w("wall","texts its own")-0.3,tTb-0.4)),5:name(5,tWo+1.6,tPh-0.6),6:name(6,w("wall","texts its own")-0.1,tTb-0.4),
      8:name(8,w("tables","the planned work")-0.2,tNe-0.4),9:name(9,w("tables","supply points")-0.2,tNe-0.4),10:name(10,w("tables","customer contacts")-0.2,tNe-0.4)};
    A5_WE.forEach(([r,x,w_,nm,kind],k)=>{const isNew=k===7,a=isNew?fin(t,tTx-0.3,0.6):fin(t,walkAt(r)-0.4,0.5);if(a<=0.01)return;const y=A5_WR[r];
      const o={a,t,size:28,lit:lit(r,L[k]||0)};
      if(k===0||k===2)Object.assign(o,{own:"Grace",ownA:fin(t,w("work","Grace's")-0.2,0.6)});
      if(k===4)Object.assign(o,{own:"head of retail",ownA:fin(t,w("phones","retail's")-0.2,0.6)});
      if(isNew)Object.assign(o,{ghost:1,lit:a5_win(t,tTx-0.2,tOw,0.5),own:"head of retail",ownA:fin(t,tTk-0.3,0.6),noOwn:a5_win(t,tNo-0.2,tTk-0.9,0.5)});
      a5_el(cx,x,y,w_,84,nm,kind==="table"?TECH:A5_WL[r][1],kind,o);
      if(isNew)withA(cx,a,()=>tag(cx,x+w_+46,y+42,"new",KT_AI,{align:"center",size:28}));});
    // the notice: planned work into it on the network's side; out to every retailer on the same terms; each retailer's texts
    const nf=fin(t,w("wall","network tells")-0.3,0.6);a5_flow(cx,630,382,796,382,t,A5_NET,nf,{head:true,n:3});a5_flow(cx,1104,382,1176,382,t,A5_RET,fin(t,w("wall","every retailer")-0.3,0.6),{head:true,n:2});
    a5_flow(cx,1504,370,1364,244,t,A5_RET,fin(t,w("wall","texts its own")-0.3,0.6),{head:true,n:2,bend:110});
    // the tables, below what reads them
    a5_flow(cx,470,566,470,616,t,TECH,fin(t,w("tables","the planned work")-0.3,0.6),{n:2});a5_flow(cx,1190,566,1190,616,t,TECH,fin(t,w("tables","customer contacts")-0.3,0.6),{n:2});
    // what the narration names, under the board
    a5_say(cx,t,610,800,"the network's: Grace's teams plan it",A5_NET,w("work","Grace's")-0.2,tPh-0.6,{size:28});
    a5_say(cx,t,1350,800,"retail's: each retailer holds its own",A5_RET,w("phones","each retailer")-0.2,tWa-0.4,{size:28});
    a5_say(cx,t,960,800,"to every retailer, on the same terms",BIZ,w("wall","every retailer")-0.2,w("wall","which homes")-0.8,{size:28});
    a5_say(cx,t,960,800,"which homes lose power, and when",BIZ,w("wall","which homes")-0.2,w("wall","each retailer texts")-0.8,{size:28});
    a5_say(cx,t,960,800,"each retailer texts its own customers",A5_RET,w("wall","each retailer texts")-0.2,tTb-0.7,{size:28});
    a5_say(cx,t,960,800,"down to the tables",TECH,tTb-0.1,tNe-0.4,{size:28});
    // the checks stop at the new element, until the head of retail takes it
    const kA=a5_win(t,tSt-0.5,tOw-0.4,0.5);if(kA>0.01)arrive(cx,960,800,t,tSt-0.5,()=>a5_checkRow(cx,560,800,800,"every element has an owner",{run:fin(t,tSt-0.3,0.3),fail:a5_win(t,tSt,tTk+0.1,0.4),pass:fin(t,tTk+0.3,0.4),t}),{dy:8,a:kA});});
  // the map agent: at the top by the ticket, then down the map, from the ticket to the tables; beside the list it drafts
  const dn=easeCam(clamp((t-w("down","walks it")+0.1)/2.8,0,1)),up=easeCam(clamp((t-tOw+0.4)/1.4,0,1)),ay=lerp(lerp(110,662,dn),430,up),aA=fin(t,w("down","The agent")-0.4,0.7);
  if(aA>0.01){aca_agent(ctx,1790,ay,30,t,{a:aA,busy:0.3+0.5*a5_win(t,w("down","walks it")-0.2,tTb+2,0.6)+0.4*a5_win(t,tOw-0.2,tCi+2,0.6)});
    withA(ctx,aA*(1-dn),()=>T(ctx,"the map agent",1790,ay+30*1.95+38,{w:800,size:28,align:"center",color:rgba(KT_AI,1)}));
    if(dn>0.02&&up<0.98){const y0=110+30*1.95;withA(ctx,aA*(1-up),()=>{ctx.save();ctx.strokeStyle=rgba(KT_AI,0.6);ctx.lineWidth=2.4;ctx.setLineDash([6,8]);ctx.lineDashOffset=-t*14;ctx.beginPath();ctx.moveTo(1790,y0);ctx.lineTo(1790,ay-30*1.95);ctx.stroke();ctx.restore();});}}
  // who must agree, as the agent lists them: each with what of the change is theirs, then its ID and its evidence
  const pA=fin(t,tOw-0.2,0.7);
  if(pA>0.01)arrive(ctx,960,440,t,tOw-0.2,()=>{const x=260,y=150,h=600;glass(ctx,x,y,1380,h,24,BIZ,{glow:14,ea:0.9,fill:"rgba(12,11,8,0.97)"});
      T(ctx,"who must agree",x+34,y+54,{f:"mono",w:500,size:28,color:rgba(BIZ,1)});
      const named=[w("owners","Grace, the"),w("owners","the head of retail"),w("owners","Ama for"),w("owners","Inés for")],tId=w("cites","ID")-0.2,tEv=w("cites","evidence")-0.2;
      A5_WOWN.forEach(([nm,what,id,ev],i)=>{const yy=y+128+i*118,q=fin(t,named[i]-0.25,0.5);if(q<=0.01)return;withA(ctx,q,()=>{
        a5_owner(ctx,x+60,yy,nm,1,{size:30,hi:pulseAt(t,named[i],1.4)});T(ctx,what,x+560,yy+11,{w:700,size:30,color:rgba(INK,0.96)});
        const iA=fin(t,tId+i*0.12,0.5);if(iA>0.01)withA(ctx,iA,()=>T(ctx,id,x+560,yy+56,{f:"mono",w:500,size:28,color:rgba(TECH,1)}));
        const eA=fin(t,tEv+i*0.12,0.5);if(eA>0.01)withA(ctx,eA,()=>{const ex=x+560+tw(ctx,id,28,500,"mono")+46;a5_clip(ctx,ex,yy+46,SOFT);T(ctx,"evidence: "+ev,ex+22,yy+56,{w:700,size:28,color:rgba(mix(SOFT,INK,0.3),1)});});});});},{dy:-12,a:pA});
  a5_say(ctx,t,960,800,"so a person can check it",BIZ,w("cites","so a person")-0.2,null);
  ctx.restore();vign(ctx,S);});

/* ---------- 6. What's really running ---------- */
// The map and the code say how things are meant to run, the running estate how they do; the walk checked against the estate: what
// reads each table, what runs each night; the agent reads there read-only, personal and sensitive data masked; the contact centre's
// software and its own copy of phone numbers, which the map doesn't show; a household calls with a new number, and the customer
// system never hears of it; one number in eleven; the head of retail's decision; and the copy on the map, with an owner
// the estate's tables [name, y] and what reads them [name, y, night]
const A5_ET=[["planned work",170],["supply points",300],["customer contacts",430]],A5_EJ=[["the notice, each night",176,1],["billing",306,0],["the customer portal",436,0]];
// the running estate, live: a trace that spikes each time a job runs, scrolling as it runs, with its newest point lit
function a5_live(ctx,x,y,w,h,t){glass(ctx,x,y,w,h,16,A5_OK,{glow:8,ea:0.7,fill:"rgba(6,16,12,0.92)"});
  const at=u=>{const ph=u*7-t*0.9,k=ph-Math.floor(ph),sp=Math.exp(-Math.pow((k-0.5)*10,2))*(0.55+0.45*hash(Math.floor(ph),77));return y+h*0.66-sp*h*0.46+Math.sin(ph*9.1)*3;};
  ctx.save();rr(ctx,x+4,y+4,w-8,h-8,12);ctx.clip();ctx.strokeStyle=rgba(A5_OK,0.12);ctx.lineWidth=1;
  for(let i=1;i<4;i++){ctx.beginPath();ctx.moveTo(x,y+i*h/4);ctx.lineTo(x+w,y+i*h/4);ctx.stroke();}
  ctx.strokeStyle=rgba(A5_OK,0.92);ctx.lineWidth=2.8;ctx.lineJoin="round";ctx.shadowColor=rgba(A5_OK,0.6);ctx.shadowBlur=8;ctx.beginPath();
  for(let i=0;i<=140;i++){const u=i/140,xx=x+24+u*(w-56);i?ctx.lineTo(xx,at(u)):ctx.moveTo(xx,at(u));}ctx.stroke();ctx.restore();
  const ey=at(1),pu=0.5+0.5*Math.sin(t*4);glow(ctx,x+w-32,ey,22,A5_OK,0.5+0.3*pu);ctx.save();ctx.fillStyle=rgba(A5_OK,1);ctx.beginPath();ctx.arc(x+w-32,ey,6,0,TAU);ctx.fill();ctx.restore();}
scene("estate",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tRd=c("read"),tMk=c("masked"),tCp=c("copy"),tCl=c("calls"),tCo=c("count"),tDe=c("decide"),tDr=c("drawn");
  const tOn=w("intent","Only the running"),tEs=w("read","checked against"),tRe=w("read","what reads"),tNi=w("read","runs each night"),tFr=w("copy","finds a reader"),tOc=w("copy","own copy");
  const tNh=w("calls","never hears"),tCh=w("calls","copy changes"),tGo=w("decide","go back"),tOw=w("drawn","with an owner");
  ctx.save();drift(ctx,t,sc,{z:0.015,y:480});
  // how things are meant to run, and how they do
  const iA=fin(t,0.6,0.7)*(1-fin(t,tRd-0.9,0.5));
  if(iA>0.01){arrive(ctx,580,450,t,0.6,()=>{a5_card(ctx,260,230,640,"the map and the code",["how things are meant to run"],TECH,{size:32});
        ctx.save();ctx.translate(580,566);ctx.scale(0.4,0.4);ctx.translate(-1100,-426);a5_texMap(ctx,t,A5_TM,{deco:true,stamp:1});ctx.restore();},{dy:-10,a:iA});
    arrive(ctx,1340,450,t,tOn-0.3,()=>{a5_card(ctx,1020,230,640,"the running estate",["how they really run"],A5_OK,{size:32,hi:pulseAt(t,tOn,1.8)});
        a5_live(ctx,1080,466,520,196,t);},{dy:-10,a:iA*fin(t,tOn-0.3,0.6)});}
  // the estate: its tables, and what reads each; what runs each night; the reader nobody had drawn, and its own copy
  const gA=fin(t,tRd-0.3,0.8);
  if(gA>0.01)withA(ctx,gA,()=>{const solid=fin(t,tDr+0.1,0.8),cc=fin(t,tFr-0.2,0.6),cp=fin(t,tOc-0.3,0.6);
    A5_ET.forEach(([nm,y],i)=>a5_table(ctx,560,y,400,nm,{t,a:fin(t,tRd-0.2+i*0.15,0.5),hi:pulseAt(t,tEs+i*0.15,1.4)}));
    A5_EJ.forEach(([nm,y,nt],i)=>a5_job(ctx,1180,y,480,nm,{t,a:fin(t,tRe-0.3+i*0.2,0.5),night:nt?fin(t,tNi-0.2,0.6):0,col:A5_APP,spin:1}));
    const fl=(x0,y0,x1,y1,col,a,o)=>a5_flow(ctx,x0,y0,x1,y1,t,col,a,Object.assign({head:true,n:2},o||{}));
    fl(964,218,1176,218,A5_APP,fin(t,tRe-0.1,0.5));fl(964,348,1176,230,A5_APP,fin(t,tRe+0.1,0.5),{bend:20});
    fl(964,478,1176,348,A5_APP,fin(t,tRe+0.3,0.5),{bend:-20});fl(964,478,1176,478,A5_APP,fin(t,tRe+0.5,0.5));
    // the contact centre's software, which the map doesn't show, and its own copy of phone numbers
    if(cc>0.01){a5_job(ctx,1180,606,480,"the contact centre's software",{t,a:cc,miss:1-solid,col:A5_APP,spin:1,hi:pulseAt(t,tFr,1.6)});fl(964,490,1176,640,ACA_WARN,cc*(1-solid),{bend:-30});fl(964,490,1176,640,A5_APP,cc*solid,{bend:-30});}
    if(cp>0.01){a5_table(ctx,560,610,400,"phone numbers, its own copy",{t,a:cp,miss:1-solid,rows:clamp((t-tCh+0.2)/1.6,0,1),hi:pulseAt(t,tOc,1.6)});a5_flow(ctx,1176,660,966,660,t,mix(ACA_WARN,A5_APP,solid),cp,{n:2});}
    // the copy goes on the map, with an owner
    const oA=fin(t,tOw-0.3,0.6);if(oA>0.01)withA(ctx,oA,()=>{const s="head of retail",w2=tw(ctx,s,28,800)+64,tx=570,ty=588;glass(ctx,tx,ty-22,w2,44,22,BIZ,{glow:8,ea:0.9,fill:"rgba(14,12,6,0.97)"});kt_gtick(ctx,tx+22,ty,11,1);T(ctx,s,tx+42,ty+10,{w:800,size:28,color:rgba(BIZ,1)});});});
  // the map agent reads the estate as it reads the map: read-only, personal and sensitive data masked
  const aA=fin(t,tRd-0.1,0.7);
  if(aA>0.01){aca_agent(ctx,250,250,40,t,{a:aA,busy:0.3+0.4*a5_win(t,tEs,tMk+2,0.6)+0.4*a5_win(t,tFr-0.4,tOc+1,0.6)});
    withA(ctx,aA,()=>T(ctx,"the map agent",250,250+40*1.95+38,{w:800,size:28,align:"center",color:rgba(KT_AI,1)}));
    A5_ET.forEach(([nm,y],i)=>{const q=a5_win(t,tEs-0.2+i*0.12,tCl-0.4,0.6)*aA;if(q>0.01)withA(ctx,q,()=>{ctx.save();ctx.strokeStyle=rgba(KT_AI,0.55);ctx.lineWidth=2.2;ctx.setLineDash([5,8]);ctx.lineDashOffset=-t*12;ctx.beginPath();ctx.moveTo(300,262);ctx.quadraticCurveTo(440,y+48,556,y+48);ctx.stroke();ctx.restore();});});
    a5_badge(ctx,250,450,t,{a:a5_win(t,tMk+0.1,tCl-0.4,0.6),hi:pulseAt(t,tMk+0.3,1.6)});
    a5_say(ctx,t,250,560,"read-only",KT_AI,w("masked","read-only")-0.2,tCl-0.4,{size:28});
    a5_mask(ctx,600,534,320,22,{a:fin(t,w("masked","personal")-0.2,0.6)});}
  a5_say(ctx,t,960,820,"what reads each table, what runs each night",A5_APP,tRe-0.2,tMk-0.3,{size:28});
  a5_say(ctx,t,960,820,"personal and sensitive data masked",KT_AI,w("masked","personal")-0.2,tFr-0.8,{size:28});
  a5_say(ctx,t,960,820,"a reader the map doesn't show",ACA_WARN,tFr-0.2,tOc-0.8,{size:28});
  a5_say(ctx,t,960,820,"its own copy of phone numbers",ACA_WARN,tOc-0.2,tCl-0.4,{size:28});
  // a household calls with a new number: the copy changes; the customer system never hears of it
  const hA=a5_win(t,tCl-0.2,tDe-0.4,0.6);
  if(hA>0.01){a5_handset(ctx,250,670,36,A5_HH,t,{a:hA,ring:a5_win(t,w("calls","household calls")-0.2,tCh,0.4)});withA(ctx,hA,()=>T(ctx,"a new number",250,750,{w:800,size:28,align:"center",color:rgba(A5_HH,1)}));
    a5_flow(ctx,300,664,556,658,t,A5_HH,fin(t,w("calls","new number")-0.2,0.5)*hA,{head:true,n:3});
    const bk=fin(t,tNh-0.3,0.5)*(1-fin(t,tGo-0.4,0.5));if(bk>0.01)withA(ctx,bk,()=>{ctx.save();ctx.setLineDash([6,7]);ctx.strokeStyle=rgba(A5_RED,0.85);ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(880,606);ctx.lineTo(880,530);ctx.stroke();ctx.restore();kt_rcross(ctx,880,568,16,1);});}
  a5_say(ctx,t,960,820,"the customer system never hears of it",A5_RED,tNh-0.2,tCo-0.7,{size:28});
  // one number in eleven: the texts would have gone to old numbers
  const nA=a5_win(t,w("count","one number")-0.3,tDe-0.4,0.6);
  if(nA>0.01)withA(ctx,nA,()=>{for(let i=0;i<11;i++){const x=560+i*64,y=726,bad=i===7,q=fin(t,w("count","one number")-0.3+i*0.04,0.4);if(q<=0.01)continue;
      withA(ctx,q,()=>{ctx.save();ctx.fillStyle=bad?"rgba(40,10,10,0.96)":"rgba(8,22,16,0.9)";rr(ctx,x,y,52,40,8);ctx.fill();ctx.strokeStyle=rgba(bad?A5_RED:A5_OK,0.9);ctx.lineWidth=2.2;rr(ctx,x,y,52,40,8);ctx.stroke();ctx.restore();
        if(bad)kt_rcross(ctx,x+26,y+20,13,fin(t,w("count","in eleven")-0.1,0.4));else tick_(ctx,x+26,y+20,16,A5_OK,0.9);});}});
  a5_say(ctx,t,960,820,"the data team counts the difference",A5_APP,tCo-0.1,w("count","one number")-0.8,{size:28});
  a5_say(ctx,t,960,820,"1 number in 11",A5_RED,w("count","one number")-0.2,w("count","The texts")-0.8,{size:28});
  a5_say(ctx,t,960,820,"the texts would have gone to old numbers",A5_RED,w("count","The texts")-0.2,tDe-0.4,{size:28});
  ctx.restore();
  // the head of retail decides: the customer system is the source, and the contact centre's changes go back to it first
  const dd=0.6*a5_win(t,tDe-0.4,tDr-0.4,0.7);if(dd>0.01){setScreen(ctx,S);ctx.fillStyle="rgba(3,5,11,"+dd+")";ctx.fillRect(0,0,W,H);}
  ctx.save();drift(ctx,t,sc,{z:0.015,y:480});
  const kA=a5_win(t,tDe-0.2,tDr-0.4,0.7);
  if(kA>0.01)arrive(ctx,1380,290,t,tDe-0.2,()=>a5_dec(ctx,980,150,800,"DEC-032",["the customer system is the source","the contact centre's changes go back to it first"],"head of retail",
    {p:clamp((t-w("decide","the customer")+0.2)/4.6,0,1),who:fin(t,tDe-0.1,0.6),hi:pulseAt(t,tDe+0.2,1.8)}),{dy:-12,a:kA});
  a5_flow(ctx,880,606,880,532,t,A5_OK,fin(t,tGo-0.3,0.6),{head:true,n:3,v:0.6,solid:true});
  a5_say(ctx,t,960,820,"on the map, with an owner",BIZ,w("drawn","on the map")-0.2,null,{size:28});
  ctx.restore();vign(ctx,S);});

/* ---------- 7. Back to the river wall ---------- */
// The river wall in the morning, brick by brick saying who built each stretch and what for; Nabopolassar's own words on an older
// king's inscription, and his ask of the kings after him; the wall beside the map, every element stamped, checked and walked; April's
// first texts, two days before the crews; every one with the crews' date; then the wall and the map side by side, wordless
scene("back",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tKe=c("kept"),tAs=c("asked"),tUt=c("utility"),tAp=c("april"),tDa=c("date");
  const sp=easeCam(clamp((t-tUt+0.6)/1.6,0,1)),dw=a5_win(t,tAp-0.6,B-0.5,0.8),dk=0.92*dw,hT=1-dw;
  setScreen(ctx,S);bg2(ctx);motes(ctx,t,{n:30});
  // the utility's map, on the right, as the frame opens beside the river wall: every element stamped, a change checked and walked
  if(sp>0.01){ctx.save();ctx.translate(1434,450);ctx.scale(0.62,0.62);ctx.translate(-1115,-400);
    a5_texMap(ctx,t,A5_TM,{a:sp,deco:true,stamp:1,chg:fin(t,w("utility","every change")-0.2,0.6),chk:clamp((t-w("utility","checked")+0.1)/2.4,0,1),walk:clamp((t-w("utility","walked")+0.1)/2.2,0,1)});ctx.restore();}
  // Babylon: the river wall in the morning, its stamped bricks catching the sun
  const cx_=lerp(W,948,sp);ctx.save();ctx.beginPath();ctx.rect(0,0,cx_,H);ctx.clip();ctx.translate(-486*sp,0);
  focus(ctx,t,[[0,960,600,1.0],[w("wall","river wall")-0.4,900,720,1.45],[tKe-0.5,980,640,1.1],[tUt-0.6,860,720,1.3]],1.9);
  a5_view(ctx,t,{dawn:0.9,day:0.55,glint:fin(t,w("wall","brick by brick")-0.4,1.2),embHi:0.5*pulseAt(t,w("wall","river wall")-0.2,2.2),kings:A5_KINGS.map(([x0,x1,d,tone])=>[x0,x1,1,tone])});
  ctx.restore();
  if(sp>0.01){setScreen(ctx,S);const sg=ctx.createLinearGradient(cx_-148,0,cx_,0);sg.addColorStop(0,"rgba(3,5,11,0)");sg.addColorStop(1,"rgba(3,5,11,0.95)");ctx.fillStyle=sg;ctx.fillRect(cx_-148,0,148,H);}
  setScreen(ctx,S);
  bab_tag(ctx,960,214,"brick by brick: who built each stretch, and what for",a5_win(t,w("wall","brick by brick")-0.3,tKe-0.4,0.6));
  bab_tag(ctx,960,214,"an older king's inscription, in a wall",a5_win(t,w("kept","older king's")-0.3,w("kept","in his own words")-1.0,0.6));
  bab_quote(ctx,360,150,1200,"exactly like when I found an inscription of a king who came before me and did not change its location","Nabopolassar, in his own words",{a:a5_win(t,w("kept","in his own words")-0.4,tAs-0.9,0.7),size:40});
  bab_quote(ctx,360,150,1200,"find an inscription written in my name, and place it with your inscribed objects","Nabopolassar, to the kings after him",{a:a5_win(t,tAs-0.1,tUt-1.3,0.7),size:40});
  // each half, with what it says
  bab_tag(ctx,474,830,"every brick: who built it, and what for",fin(t,tUt+0.4,0.7)*hT);
  a5_say(ctx,t,1434,760,"every element: its owner and its source",BIZ,w("utility","every element")-0.2,null,{size:28,a:hT});
  a5_say(ctx,t,1434,830,"checked and walked, before anyone builds",A5_OK,w("utility","checked")-0.2,null,{size:28,a:hT});
  // April: the first texts, two days before the crews; every one with the date the crews have
  if(dk>0.01){ctx.fillStyle="rgba(3,5,11,"+dk+")";ctx.fillRect(0,0,W,H);}
  const aA=a5_win(t,w("april","first texts")-0.3,B-0.5,0.7),tTu=w("april","two days"),tCr=w("april","crews reach"),tDt=w("date","date the crews");
  if(aA>0.01){arrive(ctx,580,350,t,w("april","first texts")-0.3,()=>a5_phone(ctx,320,200,"your retailer",["Planned work on","your street on","Thursday, 9:00 to 15:00"],{p:clamp((t-w("april","first texts")+0.1)/1.4,0,1)}),{dy:-12,a:aA});
    glow(ctx,500,406,110,A5_OK,0.3*fin(t,tDt-0.2,0.6)*aA);
    a5_say(ctx,t,580,580,"April: the first texts",A5_RET,w("april","first texts")-0.1,B-0.5);
    a5_say(ctx,t,580,650,"3,400 households",A5_HH,w("april","three thousand")-0.2,B-0.5);
    const d1=fin(t,tTu-0.3,0.6)*aA,d2=fin(t,tCr-0.3,0.6)*aA;
    if(d1>0.01)arrive(ctx,1160,315,t,tTu-0.3,()=>a5_day(ctx,1000,220,320,"Tuesday","the text comes",A5_RET,{}),{dy:-10,a:d1});
    if(d2>0.01){arrive(ctx,1620,315,t,tCr-0.3,()=>a5_day(ctx,1460,220,320,"Thursday","the crews come",A5_NET,{ok:fin(t,tDt-0.2,0.5)}),{dy:-10,a:d2});
      withA(ctx,d2,()=>{ctx.save();ctx.strokeStyle=rgba(SOFT,0.8);ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(1330,315);ctx.lineTo(1446,315);ctx.stroke();ctx.fillStyle=rgba(SOFT,0.9);ctx.beginPath();ctx.moveTo(1452,315);ctx.lineTo(1434,305);ctx.lineTo(1434,325);ctx.closePath();ctx.fill();ctx.restore();});}
    a5_say(ctx,t,1390,470,"two days before",SOFT,tCr+0.2,B-0.5);
    a5_say(ctx,t,1390,560,"the date the crews have",A5_OK,tDt-0.2,B-0.5);}
  vign(ctx,S);});

/* ---------- 8. Every change, checked ---------- */
// Tomás and Grace, and the answer, with the map under it, stamped, checked and walked; then the end card
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tA=c("answer"),fade=1-fin(t,B,1.0),rl=fin(t,w("walkit","let the owners")-0.2,0.6);
  ctx.save();ctx.globalAlpha*=fade;drift(ctx,t,sc,{z:0.02,y:480});
  a5_who(ctx,"tomas",230,fin(t,0.6,0.8),t,{expr:a5_expr("calm","relieved",rl)});a5_who(ctx,"grace",1690,fin(t,0.8,0.8),t,{right:true,expr:a5_expr("calm","relieved",rl)});
  arrive(ctx,960,250,t,tA+0.2,()=>sticky(ctx,960,250,860,280,"Give every element an owner and a source. Test the map on every change, with a case that must fail. Walk each change, check what's really running, and let the owners decide.",
    {col:NOTEC[3],size:30,rot:0.01,p:clamp((t-tA-0.4)/13.0,0,1)}),{dy:-16});
  // the map, under the note: stamped; checked, and walked, as the voice says each
  withA(ctx,fin(t,1.0,1.0),()=>{ctx.save();ctx.translate(960,646);ctx.scale(0.42,0.42);ctx.translate(-1115,-400);
    a5_texMap(ctx,t,A5_TM,{deco:true,stamp:1,chk:clamp((t-w("answer","test the map")+0.2)/2.4,0,1),walk:clamp((t-w("walkit","Walk each")+0.2)/2.2,0,1)});ctx.restore();});
  ctx.restore();vign(ctx,S);
  acaEnd(ctx,S,t,B,"Every change, checked","Give every element an owner and a source. Test every change.","Film 5 of 6");});
