/* ===== Making of · That's not quite right: scenes =====
   Nine chapters, as in ../script.md: how The Inner Life of Data was made, on two lanes, the author's and Claude's. */
const BRIEF="Explain how a data platform works, so anyone can understand it, even a teenager, without losing a data engineer's rigour.";
const A_ITEMS=["purpose","audience","knowledge","taste","decisions"],C_ITEMS=["options","fact checks","code","pictures","sound","pages"];

/* ---------- 1. One message ---------- */
scene("message",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),B=c("breath");setScreen(ctx,S);bg2(ctx);
  // the first message, typed out
  const h=bubble(ctx,420,280,1080,BRIEF,"author",fin(t,c("started")+1.2,0.6),{size:32,type:(t-c("brief")+0.2)/4.2,kicker:"the first message, in short"});
  // what only a person could bring
  [["a purpose",620],["an audience",960],["a standard",1300]].forEach(([s,x],i)=>withA(ctx,fin(t,c("only")+1.4+i*0.9,0.5),()=>tag(ctx,x,540,s,WARM,{align:"center",size:26})));
  // the conversation begins: a reply
  withA(ctx,fin(t,c("conv")+2.0,0.6),()=>{ctx.strokeStyle=rgba(COOL,0.5);ctx.setLineDash([6,8]);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(960,572);ctx.lineTo(960,640);ctx.stroke();ctx.setLineDash([]);});
  bubble(ctx,560,650,800,"Five analogies to test first: rivers, libraries, cyberpunk, pipes, the human body…","claude",fin(t,c("conv")+2.4,0.6),{size:22,type:(t-c("conv")-2.6)/2.0});
  // the title
  const oA=fin(t,B+0.1,0.7),tA=fin(t,B+0.6,0.7);if(oA>0){dark(ctx,S,oA*0.92);setScreen(ctx,S);withA(ctx,tA,()=>{glow(ctx,960,500,460,WARM,0.07);T(ctx,"MAKING OF",960,440,{w:800,size:26,align:"center",color:rgba(WARM,0.95)});
    T(ctx,"That's not quite right",960,540,{w:800,size:92,align:"center"});T(ctx,"how the films are made, by a person and Claude",960,604,{w:600,size:28,align:"center",color:rgba(SOFT,0.95)});});}
  if(t<1.2){setScreen(ctx,S);ctx.fillStyle="rgba(0,0,0,"+(1-ease(t/1.2))+")";ctx.fillRect(0,0,W,H);}
  vign(ctx,S);});

/* ---------- 2. Two sides ---------- */
scene("lanes",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const ai=A_ITEMS.map((s,i)=>[s,fin(t,c("author")+1.2+i*0.7,0.4)]),ci=C_ITEMS.map((s,i)=>[s,fin(t,c("claude")+0.9+i*0.55,0.4)]);
  lanes(ctx,t,fin(t,0.2,0.8),{authorItems:ai,claudeItems:ci,thread:fin(t,c("between")+0.2,0.8)});
  withA(ctx,fin(t,c("between")+1.0,0.6),()=>{tag(ctx,960,450,"the conversation",[210,220,240],{align:"center",size:24});});
  travel(ctx,t,c("between")+2.0,700,"author","a question");travel(ctx,t,c("between")+2.6,1220,"claude","options");
  vign(ctx,S);});

/* ---------- 3. Options, not answers ---------- */
scene("options",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const ch=fin(t,c("chose")-0.2,0.7),wd=fin(t,c("widen")-0.2,0.6);
  lanes(ctx,t,0.35+0.65*wd,{authorItems:[["chooses",wd]],claudeItems:[["widens the choice",wd]],thread:wd});
  // five analogies, each tested against copying
  withA(ctx,1-ch,()=>{ANA.forEach((a,i)=>{const x=260+i*350,y=440;anaCard(ctx,x,y,i,fin(t,c("first")+2.2+i*0.6,0.5),fin(t,c("broke")+0.4+i*0.35,0.4));});
    withA(ctx,fin(t,c("test")+0.6,0.6)*(1-fin(t,c("broke")+2.8,0.6)),()=>{glass(ctx,610,640,700,120,16,COOL,{glow:12,ea:0.5,fill:"rgba(8,12,22,0.95)"});T(ctx,"the test: share it without copying it",960,684,{w:700,size:22,align:"center",color:rgba(COOL,1)});
      dtile(ctx,850,730,50,0,{cell:14,q:2},1);T(ctx,"→ two places at once?",1010,738,{w:600,size:19,align:"center"});dtile(ctx,1160,730,50,0,{cell:14,q:2},0.4);});});
  // the author's choice: a documentary flight, data as light, drawn by the film itself
  withA(ctx,ch,()=>{const tt=58+(t-c("chose"));ctx.drawImage(ildMini(tt,880),520,300,880,495);ctx.strokeStyle=rgba(WARM,0.9);ctx.lineWidth=3;ctx.strokeRect(520,300,880,495);
    tag(ctx,960,300,"the author's choice: a flight through the real platform",WARM,{align:"center",size:20});});
  vign(ctx,S);});

/* ---------- 4. Facts ---------- */
const RIG=[["Delta Sharing","renamed OpenSharing"],["dbt Cloud","now the dbt platform"],["Genie Ontology","in preview: say so"],["Lakebase synced tables","a managed copy, not zero-copy"],["Fabric mirroring","reads Databricks data without a copy"]];
scene("facts",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  lanes(ctx,t,0.35,{thread:0.3});const sh=fin(t,c("sheet")-0.3,0.7);
  // sources checked
  withA(ctx,fin(t,c("check")+0.3,0.6)*(1-sh),()=>{[0,1,2,3].forEach(i=>{const x=380+i*300,y=330;glass(ctx,x,y,260,150,14,COOL,{glow:10,ea:0.4,fill:"rgba(8,12,22,0.94)"});for(let k=0;k<5;k++){ctx.fillStyle="rgba(200,215,240,0.25)";rr(ctx,x+20,y+30+k*20,200-hash(i*7+k,2)*80,8,4);ctx.fill();}
    const ok=fin(t,c("check")+1.4+i*0.5,0.3);withA(ctx,ok,()=>T(ctx,"✓ checked",x+20,y+136,{w:700,size:18,color:rgba(GOOD,1)}));});
    rename(ctx,460,520,"Delta Sharing","OpenSharing",(t-c("changed")-1.0)/1.6,fin(t,c("changed")+0.6,0.4));rename(ctx,460,600,"dbt Cloud","the dbt platform",(t-c("changed")-3.6)/1.6,fin(t,c("changed")+3.2,0.4));
    withA(ctx,fin(t,c("quick")+0.4,0.5),()=>{tag(ctx,1500,560,"quick for Claude",COOL,{align:"center",size:20});tag(ctx,1500,620,"tedious for people",WARM,{align:"center",size:20});});});
  // the rigour sheet
  withA(ctx,sh,()=>{glass(ctx,260,300,1400,460,18,COOL,{glow:14,ea:0.5,fill:"rgba(6,10,20,0.95)"});T(ctx,"the rigour sheet",290,344,{w:800,size:22,color:rgba(COOL,1)});
    T(ctx,"in the film",290,392,{w:700,size:17,color:rgba(SOFT,1)});T(ctx,"what an expert would add",900,392,{w:700,size:17,color:rgba(SOFT,1)});
    RIG.forEach(([a,b],i)=>withA(ctx,fin(t,c("sheet")+0.5+i*0.45,0.4),()=>{T(ctx,a,290,440+i*60,{w:600,size:21});T(ctx,b,900,440+i*60,{w:500,size:21,color:rgba(INK,0.85)});ctx.fillStyle="rgba(255,255,255,0.06)";ctx.fillRect(290,456+i*60,1340,1);}));});
  vign(ctx,S);});

/* ---------- 5. That's not quite right ---------- */
scene("push",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),B=c("breath");setScreen(ctx,S);bg2(ctx);
  const id=fin(t,c("idea")-0.2,0.7),pr=fin(t,c("precise")-0.2,0.6),wd=fin(t,B-0.4,0.8);
  // four style boards, and the pushback
  withA(ctx,(1-id)*(1-wd),()=>{if(ART["style-boards"])pic(ctx,ART["style-boards"],300,160,760,ART["style-boards"].height*760/ART["style-boards"].width,COOL,{label:"the four style boards: living light, a glass factory, a blueprint, a miniature campus"});
    bubble(ctx,1130,300,660,"“There is no better light than other.”","author",fin(t,c("light")-0.1,0.5),{size:34,quote:true,wt:700});
    withA(ctx,fin(t,c("light")+2.6,0.6),()=>T(ctx,"light can't show data getting better",1460,520,{w:600,size:20,align:"center",color:rgba(SOFT,1)}));});
  // their idea: pictures that sharpen, then paintings for each audience
  withA(ctx,id*(1-wd),()=>{const u=clamp((t-c("idea"))/2.4,0,1);[0,1,2].forEach(q=>{const x=330+q*230;dtile(ctx,x,360,170,q===0?-0.08:0,{cell:14,q,app:q<2?"lms":undefined},fin(t,c("idea")+0.3+q*0.6,0.4));});
    T(ctx,"sharper as it's refined",560,500,{w:600,size:20,align:"center",color:rgba(SOFT,1)});
    const P2=[["realism","every detail, for analysts"],["modern","the essence, for leaders"],["live","live, for operations"]];P2.forEach(([k,n],i)=>withA(ctx,fin(t,c("idea")+2.6+i*0.5,0.5),()=>{const x=1060+i*260,img=painting2(k);ctx.fillStyle="rgba(0,0,0,0.4)";rr(ctx,x-6,270,232,160,8);ctx.fill();ctx.drawImage(img,x,276,220,148);ctx.strokeStyle=rgba(LAYER.gold,0.8);ctx.lineWidth=3;ctx.strokeRect(x,276,220,148);T(ctx,n,x+110,462,{w:600,size:16,align:"center",color:rgba(SOFT,1)});}));
    bubble(ctx,1040,540,780,"The style follows what the audience needs, not the channel it arrives by.","claude",pr,{size:24,type:(t-c("precise"))/2.2});
    withA(ctx,fin(t,c("words")+0.2,0.6),()=>{if(ART["first-cut"])pic(ctx,ART["first-cut"],300,560,420,236,COOL);});});
  // the words
  withA(ctx,wd,()=>{dark(ctx,S,0.6);setScreen(ctx,S);glow(ctx,960,470,420,WARM,0.1);T(ctx,"“That's not quite right.”",960,500,{w:800,size:80,align:"center",color:rgba(WARM,1)});T(ctx,"the author",960,570,{w:600,size:24,align:"center",color:rgba(SOFT,1)});});
  vign(ctx,S);});

/* ---------- 6. A note costs minutes ---------- */
scene("cheap",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const sm=fin(t,c("small")-0.2,0.7),ea=fin(t,c("ears")-0.2,0.6);
  lanes(ctx,t,0.35*(1-sm),{thread:0.3});
  withA(ctx,1-sm,()=>{bubble(ctx,120,300,560,"Start at the system of record.","author",fin(t,c("record")-0.1,0.5),{size:28,quote:true,wt:700});
    const cp=fin(t,c("record")+2.4,0.5);withA(ctx,cp,()=>codePanel(ctx,760,290,1040,[[["−  phone ",BAD],["→ writes to the platform",SOFT]],[["+  phone ",GOOD],["→ student system ",INK],["(the system of record)",SOFT]],[["+  student system ",GOOD],["→ integration → platform",SOFT]]],{title:"scene \"The tap\", changed",size:22,lh:52,edge:COOL}));
    [0,1,2,3].forEach(i=>withA(ctx,fin(t,c("record")+4.2+i*0.3,0.4),()=>{const im=ildThumb([12,20,40,62][i],300);ctx.drawImage(im,760+i*262,540,250,141);ctx.strokeStyle=rgba(COOL,0.7);ctx.lineWidth=2;ctx.strokeRect(760+i*262,540,250,141);}));
    withA(ctx,fin(t,c("frames"),0.6),()=>reTime(ctx,120,760,1680,3*fin(t,c("frames")+1.0,1.4),1));});
  // small checkpoints before big changes
  withA(ctx,sm,()=>{T(ctx,"style frames: two of the five",120,330,{w:700,size:20,color:rgba(SOFT,1)});
    ["style-frame-sources","style-frame"].forEach((k,i)=>withA(ctx,fin(t,c("small")+0.8+i*0.4,0.4),()=>{const im=ART[k];if(!im)return;ctx.drawImage(im,120+i*420,350,400,im.height*400/im.width);ctx.strokeStyle=rgba(COOL,0.6);ctx.lineWidth=2;ctx.strokeRect(120+i*420,350,400,im.height*400/im.width);}));
    withA(ctx,fin(t,c("small")+2.4,0.5),()=>{T(ctx,"a 40-second sound sketch",120,650,{w:700,size:20,color:rgba(SOFT,1)});waveBar(ctx,120,668,700,50,(t-c("small")-2.4)/6,COOL);});
    withA(ctx,fin(t,c("small")+3.6,0.5),()=>{T(ctx,"four 5-second voice tests",1000,650,{w:700,size:20,color:rgba(SOFT,1)});["voice A","voice B","voice C","American female"].forEach((n,i)=>{const on=i===3?fin(t,c("small")+5.0,0.4):0;glass(ctx,1000+i*200,672,186,50,12,on?GOOD:COOL,{glow:on?12:0,fill:"rgba(8,12,22,0.95)"});T(ctx,(on?"✓ ":"")+n,1093+i*200,704,{w:600,size:15,align:"center",color:rgba(on?GOOD:INK,1)});});});
    withA(ctx,ea,()=>{eye(ctx,1020,380,30,COOL);T(ctx,"Claude looks at every frame",1062,388,{w:700,size:20,color:rgba(COOL,1)});ear(ctx,1060,790,34,WARM);T(ctx,"the author listens",1100,798,{w:700,size:20,color:rgba(WARM,1)});});});
  vign(ctx,S);});

/* ---------- 7. What went wrong ---------- */
scene("wrong",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const L=c("list"),items=[["said it couldn't make a voice","a voice model that runs offline",L+0.2],["said voice clips were attached","they weren't; then they were",L+3.0],["a relationship drawn backwards","the crow's foot on the right end",L+5.6]];
  items.forEach(([a,b,t0],i)=>{const y=200+i*160,fx=fin(t,c("caught")+0.3+i*0.5,0.5);withA(ctx,fin(t,t0,0.5),()=>{glass(ctx,160,y,1600,120,16,fx>0.5?GOOD:BAD,{glow:12,ea:0.5,fill:"rgba(8,12,22,0.95)"});
    T(ctx,fx>0.5?"✓":"✗",200,y+74,{w:800,size:40,color:rgba(fx>0.5?GOOD:BAD,1)});T(ctx,a,270,y+56,{w:700,size:26});withA(ctx,fx,()=>T(ctx,"fixed: "+b,270,y+94,{w:500,size:20,color:rgba(GOOD,1)}));
    if(i===2)crow(ctx,1260,y+60,300,fx<0.5,fx>0.5?GOOD:BAD);});});
  withA(ctx,fin(t,c("part")+0.2,0.6),()=>tag(ctx,960,720,"caught because the person checked",WARM,{align:"center",size:22}));
  vign(ctx,S);});

/* ---------- 8. Publishing ---------- */
scene("publish",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const mo=fin(t,c("more")-0.2,0.7);
  withA(ctx,1-mo,()=>{browserWin(ctx,140,140,900,560,"roanboc.github.io/learning-data");const im=ildMini(160+(t%40),860);ctx.drawImage(im,160,190,860,484);
    [["Watch",0],["Take it apart",1],["Make the call",2],["ES",3]].forEach(([n,i])=>withA(ctx,fin(t,c("site")+1.0+i*0.8,0.4),()=>tag(ctx,1180,230+i*80,n,i===3?WARM:COOL,{size:22})));
    withA(ctx,fin(t,c("release")-0.1,0.6),()=>{["commit","render on a clean machine","release"].forEach((n,i)=>{chip(ctx,1180,560+i*80,null,n,null,{edge:i===2?GOOD:COOL});});
      T(ctx,"what you download is what the site plays",1180,800,{w:600,size:18,color:rgba(SOFT,1)});});});
  // three more films
  withA(ctx,mo,()=>{if(ART.playbook)0;glass(ctx,160,200,420,120,16,WARM,{glow:12,ea:0.5,fill:"rgba(8,12,22,0.95)"});T(ctx,"PLAYBOOK.md",190,250,{f:"mono",w:500,size:26,color:rgba(WARM,1)});T(ctx,"what worked, written down",190,290,{w:500,size:19,color:rgba(SOFT,1)});
    [["poster-sketch","A Sharper Sketch"],["poster-silent","Silent change"],["poster-good","Too good to be true"]].forEach(([k,n],i)=>withA(ctx,fin(t,c("more")+2.2+i*0.6,0.5),()=>{if(ART[k])pic(ctx,ART[k],660+i*400,380,360,203,COOL,{label:n});}));});
  vign(ctx,S);});

/* ---------- 9. Who does what ---------- */
scene("split",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),B=c("breath"),la=c("last");setScreen(ctx,S);bg2(ctx);
  const A=["the purpose","the audience","the knowledge","the taste","the final say"],Cl=["options","facts","code","pictures","sound","checks"];
  const end=fin(t,la-0.2,0.6);
  withA(ctx,1-end,()=>{lanes(ctx,t,1,{authorItems:A.map((s,i)=>[s,fin(t,c("person")+1.6+i*0.5,0.4)]),claudeItems:Cl.map((s,i)=>[s,fin(t,c("claude")+1.8+i*0.4,0.4)]),thread:1});
    withA(ctx,fin(t,c("person")+0.4,0.5),()=>tag(ctx,1780,120,"the why",WARM,{align:"center",size:20}));withA(ctx,fin(t,c("claude")+0.4,0.5),()=>tag(ctx,1740,600,"the next version, cheap",COOL,{align:"center",size:20}));
    for(let k=0;k<6;k++){travel(ctx,t,c("again")+k*0.45,500+k*220,k%2?"claude":"author",null);}});
  // the last words, then the end card
  const eA=fin(t,B+1.0,0.8);withA(ctx,end*(1-eA),()=>{glow(ctx,960,470,420,WARM,0.1);T(ctx,"That's not quite right.",960,500,{w:800,size:84,align:"center",color:rgba(WARM,1)});});
  if(eA>0){dark(ctx,S,eA*0.92);setScreen(ctx,S);withA(ctx,fin(t,B+1.4,0.8),()=>{T(ctx,"MAKING OF",960,420,{w:800,size:24,align:"center",color:rgba(WARM,0.95)});T(ctx,"That's not quite right",960,510,{w:800,size:76,align:"center"});
    T(ctx,"Made by a person and Claude, an AI model by Anthropic. The narration is a synthetic voice.",960,580,{w:500,size:24,align:"center",color:rgba(SOFT,0.95)});T(ctx,"Learning Data",960,650,{w:700,size:22,align:"center",color:rgba(SOFT,0.8)});});}
  vign(ctx,S);});
