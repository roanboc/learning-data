/* ===== Older than the systems: scenes =====
   Eight chapters, as in ../script.md. A museum shelf of credentials, four thousand years long; the same five parts in every one of them;
   the conceptual model underneath, and today's standard using its words. Then the university's five systems, each with its own model
   inside; the translations between them; one learner with four IDs; the logical model as a yardstick; who owns each part; and the
   short-course platform, still saying "customer", joined to the shared meaning. */

/* ---------- 1. Same idea, new materials ---------- */
const OT_SX=i=>380+i*400,OT_SHELF=700;
// what each exhibit points out while the camera is on it: [text, x and y from the exhibit's foot, the cue and the delay it appears at]
const OT_NOTES=[[["teacher's model",-76,-268,"clay",5.8],["student's copy",76,-268,"clay",7.4]],
  [["a masterpiece",-40,-272,"guild",3.4],["the guild's mark",150,-230,"guild",6.2]],
  [["a rank",-104,-10,"exams",4.6],["the way to office",120,-270,"exams",6.2]],
  [["a licence to teach",0,-278,"seal",1.4],["a wax seal",120,-40,"seal",3.2]]];
scene("materials",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),B=c("breath"),cS=c("seal");histBg(ctx,S,t,{light:0.12});
  const rev=[c("clay")+0.3,c("guild")+0.2,c("exams")+0.2,cS+0.2,cS+4.2,cS+5.7,cS+6.8,cS+8.3],pull=cS+3.4,z0=2.0,y0=590;
  const cam=camAt([[0,OT_SX(0),y0,z0],[c("guild")-0.9,OT_SX(0),y0,z0],[c("guild")+0.8,OT_SX(1),y0,z0],[c("exams")-0.9,OT_SX(1),y0,z0],[c("exams")+0.8,OT_SX(2),y0,z0],
    [cS-0.9,OT_SX(2),y0,z0],[cS+0.8,OT_SX(3),y0,z0],[pull,OT_SX(3),y0,z0],[pull+2.6,(OT_SX(0)+OT_SX(7))/2,533,0.6]],t);
  const zo=clamp((z0-cam.z)/(z0-0.6),0,1);
  setCam(ctx,S,cam);
  ot_shelf(ctx,-400,3800,OT_SHELF);
  OT_EX.forEach((e,i)=>{const a=fin(t,rev[i],0.7);if(a<=0)return;const x=OT_SX(i);glow(ctx,x,OT_SHELF-140,240,[255,214,160],0.16*a);
    const o={a,t};if(i===0)o.p=clamp((t-c("clay")-4.4)/4.6,0,1);if(i===1)o.mark=fin(t,c("guild")+6.3,0.6);if(i===2)o.rank=fin(t,c("exams")+4.5,0.6);if(i===3)o.press=fin(t,cS+3.0,0.5);
    ot_ex(ctx,e[0],x,OT_SHELF-(i===6?20:0),1+0.2*zo,o);
    const gone=i<3?1-fin(t,rev[i+1]+0.3,0.8):1;if(i<4)OT_NOTES[i].forEach(([s,dx,dy,cid,d])=>withA(ctx,fin(t,c(cid)+d,0.5)*(1-zo)*gone,()=>ot_pill(ctx,x+dx,OT_SHELF+dy,s,i===3&&dx>0?OT_WAX:PARCH,{size:17})));
    // the masters of the guild: three approvals, before the mark
    if(i===1)[0,1,2].forEach(k=>withA(ctx,fin(t,c("guild")+5.2+k*0.3,0.3)*(1-zo)*gone,()=>{const mx=x-60+k*60,my=OT_SHELF-300;ctx.fillStyle="rgba(26,16,10,0.92)";ctx.beginPath();ctx.arc(mx,my,16,0,TAU);ctx.fill();ring(ctx,mx,my,16,OT_WAX,1,2);tick_(ctx,mx,my+1,20,OT_WAX,1);}));});
  setScreen(ctx,S);
  // where and when, while the camera is close
  const tags=[[0,c("guild")-0.6],[c("guild")+0.4,c("exams")-0.6],[c("exams")+0.4,cS-0.6],[cS+0.4,pull]];
  tags.forEach(([a0,a1],i)=>yearTag(ctx,110,110,OT_EX[i][3],CLAY,fin(t,a0,0.5)*(1-fin(t,a1,0.4))));
  // the overview: every material is different; one idea runs through them all
  if(zo>0){const sx=i=>W/2+(OT_SX(i)-cam.x)*cam.z,iT=c("idea");
    OT_EX.forEach((e,i)=>{if(i>=4)withA(ctx,fin(t,rev[i]+0.2,0.5)*(1-fin(t,iT,0.4)),()=>ot_pill(ctx,sx(i),708,e[1],PARCH,{size:22}));
      withA(ctx,fin(t,iT+0.3+i*0.12,0.4),()=>{const fl=0.75+0.25*Math.sin(t*3+i*1.7);ot_pill(ctx,sx(i),708,e[4],OT_MATCOL[i].map(v=>v*fl+255*(1-fl)*0.1),{size:22});});});
    const th=clamp((t-iT-2.0)/1.3,0,1);if(th>0){const y=440,x0=sx(0)-60,x1=sx(7)+60;ctx.save();ctx.strokeStyle=rgba(OT_WAX,0.95);ctx.lineWidth=4;ctx.shadowColor=rgba(OT_WAX,0.9);ctx.shadowBlur=16;
      ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(lerp(x0,x1,th),y);ctx.stroke();for(let i=0;i<8;i++){if(sx(i)<lerp(x0,x1,th)){ctx.beginPath();ctx.moveTo(sx(i),y);ctx.lineTo(sx(i),y+36);ctx.stroke();ctx.fillStyle=rgba(OT_WAX,1);ctx.beginPath();ctx.arc(sx(i),y,6,0,TAU);ctx.fill();}}ctx.restore();
      const pu=((t-iT)*0.35)%1;if(th>=1)glow(ctx,lerp(x0,x1,pu),y,40,OT_WAX,0.8);
      withA(ctx,fin(t,iT+2.6,0.5),()=>{ot_tag(ctx,960,360,"the same idea",OT_WAX,1,{size:26});ot_tag(ctx,960,790,"the materials changed",PARCH,1,{size:22});});}}
  seriesTitle(ctx,S,t,B,"Older than the systems","why the concepts outlive every system",OT_WAX);
  fadeIn(ctx,S,t);vign(ctx,S);});

/* ---------- 2. The model underneath ---------- */
// five exhibits, and the same parts in each
const OT_COLS=[["lock","Guild masterpiece",["the guild's masters","the apprentice","master locksmith","the masterpiece","1523","the guild's mark"]],
  ["scroll","Imperial examination",["the examiners","the candidate","passed, with a rank","the examination","1706","the official list"]],
  ["licence","Licence to teach",["a university","a new master","may teach","an examination","1290","the wax seal"]],
  ["diploma","Diploma",["a university","a graduate","Bachelor of Arts","assessments","1950","a signature"]],
  ["signed","Signed credential",["a university","a learner","Data Visualisation","an assessed project","2026","the digital key"]]];
const OT_PARTS=["issuer","holder","claim","evidence","date","checked by"],OT_CX=i=>390+i*330,OT_RY=r=>r<5?412+r*60:728;
// the conceptual model: where each box sits, and the row it grows from
const OT_CM={issuer:[470,310,"Issuer",0],holder:[470,740,"Holder",1],cred:[960,510,"Credential",2],evidence:[1450,740,"Evidence",3],verifier:[1450,310,"Verifier",5]};
function ot_concept(ctx,t,o){o=o||{};const a=o.a==null?1:o.a,m=o.m==null?1:o.m,s=o.s||1.35,sp=o.sp||{},hi=o.hi||{};if(a<=0.01)return;const ox=o.ox||0,oy=o.oy||0,k=o.k||1;
  const P=q=>{const e=OT_CM[q],fx=o.from?o.from(q):[e[0],e[1]];return[lerp(fx[0],ox+e[0]*k+(1-k)*960,ease(m)),lerp(fx[1],oy+e[1]*k+(1-k)*540,ease(m))];};
  const E={};Object.keys(OT_CM).forEach(q=>{const[x,y]=P(q);E[q]={x,y,name:OT_CM[q][2],col:OT_GOLD,s:s*k,a:a*(sp[q]==null?1:sp[q]),hi:hi[q]||0};});
  E.cred.attrs=[["claim",""],["date",""],["status",""]];E.cred.attrA=o.attrA==null?1:o.attrA;
  const B={};Object.keys(E).forEach(q=>B[q]=entBox(ctx,E[q]));const vA=a*fin(m,0.7,0.3)*(o.vA==null?1:o.vA);
  if(vA>0.01){ot_verb(ctx,B.issuer,B.cred,"issues",OT_GOLD,vA*Math.min(E.issuer.a,E.cred.a),1,{size:21*k});ot_verb(ctx,B.holder,B.cred,"holds",OT_GOLD,vA*Math.min(E.holder.a,E.cred.a),1,{size:21*k});
    ot_verb(ctx,B.cred,B.evidence,"rests on",OT_GOLD,vA*Math.min(E.evidence.a,E.cred.a),1,{size:21*k});ot_verb(ctx,B.verifier,B.cred,"checks",OT_GOLD,vA*Math.min(E.verifier.a,E.cred.a),1,{size:21*k});}
  Object.keys(E).forEach(q=>ent(ctx,E[q]));
  // the status's three values, under the credential
  const st=a*(o.stA==null?1:o.stA);if(st>0.01){const b=B.cred,y=b.y+b.h/2+30*k;withA(ctx,st,()=>{[["valid",GOOD],["expired",SOFT],["revoked",BAD]].forEach(([s_,col],i)=>ot_pill(ctx,b.x+(i-1)*124*k,y,s_,col,{size:20*k}));});}
  return B;}
scene("model",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),B=c("breath");histBg(ctx,S,t,{light:0.1});
  const cI=c("issuer"),cH=c("holder"),cE=c("evidence"),cV=c("verify"),cSt=c("standard"),cO=c("outlast");
  const m=fin(t,cSt-1.5,1.9),bgm=fin(t,cSt-1.2,2.0);withA(ctx,bgm,()=>{setScreen(ctx,S);bg2(ctx);});setScreen(ctx,S);
  // when each row lights, and when each value appears (column by column, as the narration names them)
  const rowT=[cI+0.3,cH+0.3,cH+1.5,cE+0.3,cE+4.1,cV+0.3],valT=[[cI+1.6,cI+2.3,cI+3.3,cI+3.5,cI+3.7],[cH+0.5,cH+0.6,cH+0.7,cH+0.8,cH+0.9],[cH+1.7,cH+1.8,cH+1.9,cH+2.0,cH+2.1],
    [cE+1.4,cE+2.2,cE+2.4,cE+2.6,cE+3.1],[cE+4.2,cE+4.3,cE+4.4,cE+4.5,cE+4.6],[cV+0.9,cV+1.1,cV+1.8,cV+2.6,cV+4.2]];
  const tbl=1-fin(t,cSt-1.6,1.0);
  if(tbl>0)withA(ctx,tbl,()=>{
    ctx.fillStyle="rgba(24,15,9,0.55)";rr(ctx,60,366,1810,470,18);ctx.fill();
    OT_COLS.forEach(([k,name],i)=>{const x=OT_CX(i),a=fin(t,0.2+i*0.18,0.6);glow(ctx,x,200,150,[255,214,160],0.12*a);ot_ex(ctx,k,x,300-(k==="signed"?6:0),0.66,{a,t});
      withA(ctx,fin(t,c("parts")+0.4+i*0.15,0.5),()=>T(ctx,name,x,346,{w:800,size:23,align:"center",color:rgba(k==="signed"?OT_GOLD:PARCH,1)}));});
    OT_PARTS.forEach((p,r)=>{const y=OT_RY(r),on=fin(t,rowT[r],0.4),hot=pulseAt(t,rowT[r],1.6);
      if(on>0){withA(ctx,on,()=>{ctx.fillStyle=rgba(OT_WAX,0.10+0.14*hot);rr(ctx,70,y-28,1790,50,10);ctx.fill();ctx.strokeStyle=rgba(OT_WAX,0.35+0.5*hot);ctx.lineWidth=1.5;rr(ctx,70,y-28,1790,50,10);ctx.stroke();});}
      T(ctx,p,222,y+9,{w:800,size:26,align:"right",color:on>0?rgba(mix(PARCH,OT_WAX,on),0.6+0.4*on):rgba(PARCH,0.22*fin(t,c("parts")+1.4,0.8))});
      OT_COLS.forEach((col,i)=>withA(ctx,fin(t,valT[r][i],0.4),()=>T(ctx,col[2][r],OT_CX(i),y+8,{w:700,size:23,align:"center",color:r===5?rgba(OT_WAX,1):rgba(INK,0.95)})));});
    // "look closely": a lens drifts over the columns
    const lu=clamp((t-c("parts")-0.6)/3.2,0,1);if(lu>0&&lu<1)ot_lens(ctx,lerp(300,1760,ease(lu)),210+Math.sin(lu*9)*20,56,PARCH,Math.sin(Math.PI*lu));
    // checking: by the seal, by the signature, by the key
    [[2,cV+1.8],[3,cV+2.6],[4,cV+4.2]].forEach(([i,t0])=>{const u=clamp((t-t0+0.4)/1.0,0,1);if(u>0&&u<1)ot_lens(ctx,OT_CX(i)+40,236,44,OT_WAX,Math.sin(Math.PI*u));ot_mark(ctx,OT_CX(i)+118,252,true,fin(t,t0+0.4,0.4),16);});
    // status: valid, expired, revoked
    const sa=fin(t,cV+5.2,0.4);withA(ctx,sa,()=>{const y=800;T(ctx,"status",222,y+9,{w:800,size:26,align:"right",color:rgba(mix(PARCH,OT_WAX,0.7),1)});
      ot_pill(ctx,340,y,"valid",GOOD,{size:22});withA(ctx,fin(t,cV+5.4,0.4),()=>ot_pill(ctx,500,y,"expired",SOFT,{size:22}));withA(ctx,fin(t,cV+6.3,0.4),()=>{ot_pill(ctx,680,y,"revoked",BAD,{size:22});T(ctx,"some expire · a few are revoked",790,y+8,{w:600,size:22,color:rgba(SOFT,1)});});});});
  // the materials, kept small at the top while the model forms; they fade, and the model stays
  const fade=fin(t,cO+1.0,2.2);
  if(m>0){withA(ctx,m*(1-fade),()=>{ctx.fillStyle="rgba(90,62,40,0.7)";ctx.fillRect(380,170,1160,6);OT_EX.forEach((e,i)=>{const x=440+i*148,d=clamp((t-cO-1.0-i*0.12)/1.4,0,1);
      withA(ctx,1-d,()=>ot_ex(ctx,e[0],x,170-d*30,0.3,{t}));if(d>0&&d<1)for(let k=0;k<10;k++){ctx.fillStyle=rgba(OT_MATCOL[i],0.6*(1-d));ctx.beginPath();ctx.arc(x+(hash(k,i)-0.5)*90,150-d*80*hash(k,i+3)-hash(k,9)*60,2+hash(k,5)*2,0,TAU);ctx.fill();}});});
    // the model grows from the rows of the table
    const from=q=>[222,OT_RY(OT_CM[q][3])];const lit=fin(t,cO+0.6,1.2)+0.35*Math.sin(t*1.6)*fin(t,B,1);
    const Bx=ot_concept(ctx,t,{a:m,m,from,hi:{cred:lit*0.8,issuer:lit*0.5,holder:lit*0.5,evidence:lit*0.5,verifier:lit*0.5}});
    // today's standard, word for word
    withA(ctx,fin(t,cSt+0.6,0.6),()=>{tag(ctx,1510,110,"W3C Verifiable Credentials",OT_STD,{size:20});T(ctx,"today's standard for digital credentials",1510,160,{w:600,size:17,color:rgba(SOFT,1)});});
    const W3=[["issuer","issuer",-1,4.2],["holder","holder",-1,4.8],["verifier","verifier",1,5.4],["cred","claims",1,6.1],["evidence","evidence",1,6.8]];
    if(Bx)W3.forEach(([q,s_,sd,d])=>{const b=Bx[q],a=fin(t,cSt+d,0.4),hot=pulseAt(t,cSt+d,1.2);if(a<=0)return;const x=q==="cred"?b.x+b.w/2+96:b.x+sd*(b.w/2+92),y=q==="cred"?b.y+b.h/2-122:b.y;
      withA(ctx,a,()=>{if(hot)glow(ctx,x,y,70,OT_STD,0.5*hot);ctx.strokeStyle=rgba(OT_STD,0.6);ctx.lineWidth=1.6;ctx.setLineDash([4,6]);ctx.beginPath();ctx.moveTo(x-sd*48,y);ctx.lineTo(q==="cred"?b.x+b.w/2-8:b.x+sd*b.w/2,y);ctx.stroke();ctx.setLineDash([]);ot_pill(ctx,x,y,s_,OT_STD,{size:23});});});
    withA(ctx,fin(t,cO+3.1,0.8),()=>ot_tag(ctx,960,120,"a conceptual model: no material, no technology",OT_GOLD,1,{size:24}));}
  vign(ctx,S);});

/* ---------- 3. Every system has a model inside ---------- */
const OT_CARD=i=>[85+i*355,130],OT_CW=330,OT_CH=470;
scene("inside",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const cF=c("five"),cL=c("list"),cB=c("bought"),cA=c("adopt"),cV=c("vendors");
  const holdT=[cL+1.4,cL+3.4,cL+5.0,cL+6.6,cB+3.3],openT=cB+2.4;
  withA(ctx,fin(t,cF+0.2,0.6),()=>tag(ctx,85,96,"At the university",CYAN,{size:20}));
  const tops=[];
  OT_KEYS.forEach((k,i)=>{const[x,y]=OT_CARD(i);
    if(i<4){const a=fin(t,cF+0.5+i*0.3,0.5),ha=fin(t,holdT[i],0.5),hot=pulseAt(t,cA+0.3+i*0.3,1.4);
      tops[i]=ot_sysCard(ctx,k,x,y,OT_CW,OT_CH,{a,holdsA:ha,modelA:fin(t,holdT[i]+0.3,0.6),hi:hot,ms:1.05});}
    else{// the fifth: an empty place, then a vendor's box that slides in and opens
      withA(ctx,fin(t,cF+1.8,0.5)*(1-fin(t,cB,0.4)),()=>{ctx.strokeStyle=rgba(SOFT,0.4);ctx.lineWidth=2;ctx.setLineDash([8,8]);rr(ctx,x,y,OT_CW,OT_CH,18);ctx.stroke();ctx.setLineDash([]);T(ctx,"?",x+OT_CW/2,y+OT_CH/2+20,{w:800,size:60,align:"center",color:rgba(SOFT,0.5)});});
      const sl=ease(clamp((t-cB)/1.3,0,1)),bx=lerp(2000,x+15,sl),op=clamp((t-openT)/0.9,0,1),ca=fin(t,openT+0.4,0.6),hot=pulseAt(t,cA+1.5,1.4);
      tops[i]=ot_sysCard(ctx,k,x,y,OT_CW,OT_CH,{a:ca,holdsA:fin(t,holdT[4],0.5),modelA:fin(t,holdT[4]+0.3,0.6),hi:hot,hiTop:pulseAt(t,cB+5.2,1.6),ms:1.05});
      ot_crate(ctx,bx,y+OT_CH-260,OT_CW-30,260,op,OT_SYS.short.c,fin(t,cB,0.3)*(1-fin(t,openT+0.5,0.6)));
      withA(ctx,fin(t,cB+5.0,0.5),()=>{ot_pill(ctx,x+OT_CW/2,y+OT_CH+34,"learners, called “customers”",OT_SYS.short.c,{size:20});});}});
  // whether you look at it or not: five models, and none of them ours
  const ourA=fin(t,cA+2.0,0.6),fill=fin(t,cV+0.6,1.2);withA(ctx,ourA,()=>{ctx.save();ctx.strokeStyle=rgba(mix(OT_GOLD,OT_WAX,fill),0.75);ctx.lineWidth=2.4;ctx.setLineDash([10,8]);rr(ctx,640,660,640,130,16);ctx.stroke();ctx.restore();
    withA(ctx,1-fill,()=>{T(ctx,"our own model",960,716,{w:800,size:28,align:"center",color:rgba(OT_GOLD,0.9)});T(ctx,"not written down",960,752,{w:600,size:20,align:"center",color:rgba(SOFT,1)});});});
  // if you don't, the vendors' words fill it
  const land=[[760,712,-0.06],[960,706,0.04],[1160,714,-0.03],[860,760,0.05],[1060,762,-0.05]];
  OT_KEYS.forEach((k,i)=>{const u=ease(clamp((t-cV-0.2-i*0.18)/1.1,0,1));if(u<=0||!tops[i])return;const b=tops[i].top,[tx,ty,rot]=land[i];
    withA(ctx,u,()=>{ctx.save();ctx.translate(lerp(b.x,tx,u),lerp(b.y,ty,u));ctx.rotate(rot*u);T(ctx,OT_SYS[k].m[0],0,9,{w:800,size:26,align:"center",color:rgba(OT_SYS[k].c,1)});ctx.restore();});});
  withA(ctx,fin(t,cV+1.6,0.6),()=>ot_tag(ctx,960,836,"If you don't model your business, your vendors will.",OT_WAX,1,{size:26}));
  vign(ctx,S);});

/* ---------- 4. Where meanings meet ---------- */
const OT_RING=i=>{const an=(-90+72*i)*Math.PI/180;return[960+520*Math.cos(an),450+285*Math.sin(an)];};
const OT_PAIRS=[[0,1],[1,2],[2,3],[3,4],[4,0],[0,2],[0,3],[1,3],[1,4],[2,4]],OT_SLIP=[3,6,8];
function ot_counter(ctx,x,y,n,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,300,128,18,o.col||CYAN,{glow:14,ea:0.75,fill:"rgba(7,12,24,0.94)"});T(ctx,"translations",x+24,y+40,{w:700,size:20,color:rgba(SOFT,1)});
  T(ctx,String(n),x+24,y+106,{w:800,size:60,color:rgba(o.col||CYAN,1)});if(o.was)withA(ctx,o.wasA,()=>{T(ctx,o.was,x+170,y+100,{w:800,size:40,color:rgba(BAD,0.9)});ctx.strokeStyle=rgba(BAD,1);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x+160,y+86);ctx.lineTo(x+226,y+76);ctx.stroke();});});}
scene("meet",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const cP=c("pairs"),cM=c("mars"),cB=c("both"),cH=c("hub");
  const ringA=Math.max(1-fin(t,cM-0.4,0.6),fin(t,cH-0.8,0.8)),marsA=fin(t,cM-0.2,0.7)*(1-fin(t,cH-0.9,0.7));
  if(marsA>0)withA(ctx,marsA,()=>{ot_stars(ctx,t,110);});
  // the ring: five systems, joined pair by pair
  if(ringA>0)withA(ctx,ringA,()=>{const pa=1-fin(t,cH+0.4,0.9);let n=0;
    OT_PAIRS.forEach(([i,j],q)=>{const t0=cP+0.6+q*0.32,p=clamp((t-t0)/0.35,0,1);if(p<=0)return;n++;const A=OT_RING(i),Bp=OT_RING(j),slip=OT_SLIP.includes(q)&&t>cP+4.6,fl=slip?0.5+0.5*Math.abs(Math.sin(t*7+q)):0;
      const col=slip?mix(SOFT,BAD,fl):SOFT;withA(ctx,pa,()=>{ctx.save();ctx.strokeStyle=rgba(col,0.55+0.4*fl);ctx.lineWidth=2+1.5*fl;ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(lerp(A[0],Bp[0],p),lerp(A[1],Bp[1],p));ctx.stroke();ctx.restore();
        if(p>=1){const mx=(A[0]+Bp[0])/2,my=(A[1]+Bp[1])/2;ctx.save();ctx.translate(mx,my);ctx.rotate(Math.PI/4);ctx.fillStyle="rgba(7,12,24,0.95)";ctx.fillRect(-9,-9,18,18);ctx.strokeStyle=rgba(slip?BAD:CYAN,0.9);ctx.lineWidth=2;ctx.strokeRect(-9,-9,18,18);ctx.restore();
          if(slip&&fl>0.2)withA(ctx,fl,()=>T(ctx,"≠",mx+18,my-12,{w:800,size:30,color:rgba(BAD,1)}));}});});
    // five spokes to one shared model
    const hubA=fin(t,cH+0.8,0.7);OT_KEYS.forEach((k,i)=>{const P=OT_RING(i),p=clamp((t-cH-1.2-i*0.3)/0.5,0,1);if(p<=0)return;arrowTo(ctx,P[0]+(960-P[0])*0.12,P[1]+(450-P[1])*0.12,lerp(P[0],960,0.78),lerp(P[1],450,0.78),OT_GOLD,0.95,{p,lw:3.2,nohead:true});
      if(p>=1){const mx=lerp(P[0],960,0.46),my=lerp(P[1],450,0.46);ctx.save();ctx.translate(mx,my);ctx.rotate(Math.PI/4);ctx.fillStyle="rgba(7,12,24,0.95)";ctx.fillRect(-9,-9,18,18);ctx.strokeStyle=rgba(OT_GOLD,1);ctx.lineWidth=2;ctx.strokeRect(-9,-9,18,18);ctx.restore();}});
    ot_hub(ctx,960,450,118,t,hubA);
    OT_KEYS.forEach((k,i)=>{const P=OT_RING(i);ot_node(ctx,k,P[0],P[1],fin(t,0.2+i*0.12,0.5),pulseAt(t,cP+0.2,1.2)*0.5);});
    const nPairs=OT_PAIRS.filter((q,j)=>t>cP+0.6+j*0.32+0.2).length,drop=fin(t,cH+3.5,0.6);
    ot_counter(ctx,1580,58,drop>0.5?5:nPairs,fin(t,cP+0.5,0.5),{col:drop>0.5?OT_GOLD:CYAN,was:"10",wasA:drop});
    withA(ctx,fin(t,cP+4.8,0.5)*(1-fin(t,cM-0.6,0.4)),()=>ot_tag(ctx,960,812,"each translation: a place where meaning can slip",BAD,1,{size:22}));
    withA(ctx,fin(t,cH+5.8,0.6),()=>ot_tag(ctx,960,812,"one place where the meaning is written down",OT_GOLD,1,{size:24}));});
  // 1999: the spacecraft lost at Mars
  if(marsA>0)withA(ctx,marsA,()=>{yearTag(ctx,110,110,"1999 · Mars",CLAY,1);const mx=1420,my=540,r=200;ot_mars(ctx,mx,my,r,t);
    // the paths: planned, at a safe height, and actual, too low
    const path=(alt,u,end)=>{const an=lerp(-2.6,end||-0.7,u),rr_=r+(alt<50?alt-20*u*u:alt)+(1-u)*260*(1-u);return[mx+Math.cos(an)*rr_,my+Math.sin(an)*rr_];};
    const drawPath=(alt,col,dash,p,end)=>{ctx.save();ctx.strokeStyle=col;ctx.lineWidth=3;if(dash)ctx.setLineDash([10,9]);ctx.beginPath();for(let k=0;k<=40*p;k++){const q=path(alt,k/40,end);k?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);}ctx.stroke();ctx.restore();};
    drawPath(95,"rgba(220,230,255,0.6)",true,fin(t,cM+0.2,1.0),0.1);const up=clamp((t-cM-0.3)/2.6,0,1);drawPath(18,rgba(BAD,0.9),false,up);
    const q=path(18,up),q2=path(18,Math.min(1,up+0.02)),lost=fin(t,cM+2.7,0.5);ot_craft(ctx,q[0],q[1],1.1,Math.atan2(q2[1]-q[1],q2[0]-q[0]),1-lost);
    if(t>cM+2.6&&t<cM+3.6)glow(ctx,q[0],q[1],90,[255,160,120],0.8*(1-fin(t,cM+2.8,0.8)));
    withA(ctx,fin(t,cM+3.0,0.5),()=>{const e=path(18,1);ot_pill(ctx,e[0]+96,e[1]+6,"signal lost",BAD,{size:21});const pl=path(95,0.45,0.1);ot_pill(ctx,pl[0]+60,pl[1]-34,"planned",[220,230,255],{size:21});const ac=path(18,0.42);ot_pill(ctx,ac[0]-40,ac[1]+46,"actual: too low",BAD,{size:21});});
    // two teams, two units
    const card=(y,a,title,verb,unit,col,ok)=>withA(ctx,a,()=>{glass(ctx,110,y,600,160,18,col,{glow:14,ea:0.8,fill:"rgba(7,12,24,0.94)"});T(ctx,title,140,y+44,{w:700,size:22,color:rgba(SOFT,1)});T(ctx,verb,140,y+80,{w:600,size:20,color:rgba(SOFT,1)});T(ctx,unit,140,y+132,{w:800,size:40,color:rgba(col,1)});ot_mark(ctx,670,y+40,true,ok,20);});
    card(230,fin(t,cM+3.7,0.5),"One team's software","gave the thrusters' push in","pound-force seconds",[255,190,110],fin(t,cB+0.4,0.4));
    card(520,fin(t,cM+7.9,0.5),"The navigation software","expected","newton-seconds",CYAN,fin(t,cB+0.9,0.4));
    const lk=fin(t,cM+8.3,0.5),br=fin(t,cB+1.9,0.4);withA(ctx,lk,()=>{const col=mix(SOFT,BAD,br);arrowTo(ctx,410,398,410,512,col,0.9,{lw:3+2*br,head:14});
      if(br>0){glow(ctx,410,455,80,BAD,0.6*br*(0.7+0.3*Math.sin(t*6)));withA(ctx,br,()=>{T(ctx,"≠",448,468,{w:800,size:40,color:rgba(BAD,1)});ot_pill(ctx,610,456,"the meaning broke here",BAD,{size:19});});}});
    withA(ctx,fin(t,cM+9.4,0.5),()=>T(ctx,"1 pound-force second = 4.45 newton-seconds",410,728,{w:600,size:19,align:"center",color:rgba(SOFT,1)}));});
  vign(ctx,S);});

/* ---------- 5. One person, many records ---------- */
const OT_IDS=[["sis","student number","S1048221"],["lms","platform login","aisha.k"],["short","customer number","C-77310"],["wallet","wallet address","did:key:z6Mk…4f2a"]];
const OT_SRC=[["sis",190],["it",300],["short",410],["careers",520]];
const OT_FACTS=[["name","Aisha Khan",0],["email","aisha.khan@uni.example",1],["award","BSc, Data Science",0],["microcredential","Data Visualisation",2],["badge","data ethics, assessed",3]];
scene("person",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const cI=c("ids"),cF=c("facts"),cM=c("master"),cC=c("codes");
  // Aisha
  person(ctx,"aisha",210,862,0.7,{t,pose:t>cI+3.0&&t<cI+8.2?"explain":"stand",expr:t>cM+3?"relieved":"calm"});
  withA(ctx,fin(t,cI+0.4,0.5),()=>ot_tag(ctx,210,478,"Aisha",KIND,1,{size:24}));
  // four IDs, four records
  const idT=[cI+3.1,cI+4.2,cI+5.2,cI+6.4];
  OT_IDS.forEach(([k,kind,id],i)=>{const a=fin(t,idT[i],0.5),y=150+i*112;withA(ctx,a*0.6,()=>{ctx.strokeStyle=rgba(KIND,0.45);ctx.lineWidth=1.6;ctx.setLineDash([5,7]);ctx.beginPath();ctx.moveTo(290,580);ctx.lineTo(400,y+46);ctx.stroke();ctx.setLineDash([]);});
    ot_idCard(ctx,400,y,470,k,kind,id,a,{hi:pulseAt(t,idT[i],1.2)+pulseAt(t,cM+2.8+i*0.15,1.2)});});
  // the same person: the four records linked into one learner
  const ln=fin(t,cM+2.7,0.8);withA(ctx,ln,()=>{ctx.save();ctx.strokeStyle=rgba(OT_GOLD,0.95);ctx.lineWidth=4;ctx.shadowColor=rgba(OT_GOLD,0.8);ctx.shadowBlur=12;ctx.beginPath();ctx.moveTo(884,196);ctx.lineTo(904,196);ctx.lineTo(904,532);ctx.lineTo(884,532);ctx.stroke();ctx.restore();
    arrowTo(ctx,906,364,944,364,OT_GOLD,1,{lw:4,head:14});ot_pill(ctx,904,596,"same person",OT_GOLD,{size:19});});
  // her facts, each from one source
  const fA=fin(t,cF+0.1,0.6),mA=fin(t,cM+0.2,0.6),mx=950,my=140,mw=470;
  withA(ctx,fA,()=>{glass(ctx,mx,my,mw,440,18,mA>0?mix(KIND,OT_GOLD,mA):KIND,{glow:14+10*mA,ea:0.85,fill:"rgba(7,12,24,0.95)"});
    T(ctx,ln>0.5?"one learner · L-000418":"Aisha's facts",mx+24,my+44,{w:800,size:24,color:rgba(ln>0.5?OT_GOLD:KIND,1)});
    T(ctx,"credentials",mx+24,my+222,{f:"mono",w:500,size:16,color:rgba(SOFT,1)});});
  const fT=[cF+0.5,cF+2.5,cF+3.9,cF+4.4,cF+4.9];
  OT_FACTS.forEach(([k,v,src],i)=>{const y=my+(i<2?96+i*64:258+(i-2)*58),a=fin(t,fT[i],0.5);withA(ctx,a,()=>{T(ctx,k,mx+24,y,{f:"mono",w:500,size:16,color:rgba(SOFT,1)});T(ctx,v,mx+24,y+28,{w:700,size:22});});
    const P=OT_SRC[src],sx=1670-(src===1?118:src===2?158:src===3?92:120),p=clamp((t-fT[i]+0.3)/0.6,0,1);if(p>0){const col=src===1?OT_IT:OT_SYS[P[0]].c;arrowTo(ctx,sx,P[1],mx+mw+6,y+10,col,0.85,{p,bend:0.08,lw:2.4,head:12});
      withA(ctx,fin(t,cM+0.4+i*0.25,0.4),()=>ot_mark(ctx,mx+mw-30,y+10,true,1,14));}});
  OT_SRC.forEach(([k,y],i)=>ot_node(ctx,k,1670,y,fin(t,cF+(i===0?0.2:i===1?2.2:3.7+i*0.3),0.5),0,k==="it"?{sys:{c:OT_IT,n:"IT directory"}}:{}));
  withA(ctx,fin(t,cM+0.6,0.5),()=>ot_pill(ctx,1670,110,"one source for each fact",OT_GOLD,{size:19}));
  withA(ctx,fin(t,cM+5.0,0.6),()=>ot_tag(ctx,1185,640,"master data",OT_GOLD,1,{size:26}));
  // one list of values, used by every system
  const cl=fin(t,cC+1.6,0.6),ch=pulseAt(t,cC+3.6,2.0);ot_codeList(ctx,480,728,cl,ch);
  withA(ctx,cl*fin(t,cC+3.4,0.8),()=>{ctx.save();ctx.strokeStyle=rgba(OT_STD,0.55);ctx.lineWidth=1.6;ctx.setLineDash([4,6]);OT_SRC.forEach(([k,y])=>{if(k==="it")return;ctx.beginPath();ctx.moveTo(1120,760);ctx.quadraticCurveTo(1480,720,1670-110,y+30);ctx.stroke();});
    ctx.beginPath();ctx.moveTo(1000,728);ctx.lineTo(1000,my+440);ctx.stroke();ctx.restore();});
  withA(ctx,fin(t,cC+6.5,0.6),()=>ot_tag(ctx,1420,800,"reference data",OT_STD,1,{size:26}));
  vign(ctx,S);});

/* ---------- 6. Precise, but not yet technical ---------- */
const OT_VEND=[["learner","customer",1],["credential id","certificate no.",1],["claim","course name",1],["level","level",1],["volume","hours",1],["status","—",0],["evidence","—",0],["counts towards","—",0]];
scene("logical",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const cS=c("sketch"),cI=c("id"),cA=c("attrs"),cC=c("card"),cR=c("rules"),cT=c("still"),Z=1.2;
  // the sketch on paper, from What's in a word
  const sk=fin(t,0.1,0.6)*(1-fin(t,cS+2.4,1.0));if(sk>0)withA(ctx,sk,()=>{sheet(ctx,330,140,1260,600,{rot:-0.01});credKinds(ctx,{paper:true,ox:0,oy:40,s:1,p:{cred:1,award:1,micro:1,badge:1}});
    pencilText(ctx,"what matters",400,210,{size:26});stamp(ctx,1560,190,"sketch v3 · draft",[150,90,30],1,0);});
  const lm=fin(t,cS+2.6,1.1),yard=fin(t,cT+2.6,1.0),mA=lm*(1-yard);
  if(mA>0.01)withA(ctx,mA,()=>{const E={learner:{name:"Learner",attrs:[["learner id","id"],["name",""]]},issuer:{name:"Issuer",attrs:[["issuer id","id"],["name",""]]},
      cred:{name:"Credential",attrs:OT_CRED_ATTRS},evidence:{name:"Evidence",attrs:[["evidence id","id"],["kind",""]]},micro:{name:"Microcredential",sub:"a kind of credential"},award:{name:"Award",sub:"a kind of credential"}};
    Object.keys(E).forEach(k=>Object.assign(E[k],{x:OT_LM[k][0],y:OT_LM[k][1],col:OT_GOLD,s:Z,a:k==="cred"?1:fin(t,cS+3.0+(k==="micro"||k==="award"?0.5:0.2),0.6)}));
    const B={};Object.keys(E).forEach(k=>B[k]=entBox(ctx,E[k]));
    // relationships: plain lines first, then how many of one relate to another
    const rel=(a,b,ca,cb,t0,verb,dx,dy)=>{const on=fin(t,t0,0.5),aa=Math.min(E[a].a,E[b].a);if(aa<=0.01)return;withA(ctx,aa,()=>{if(on<1){const s_=ot_edge(B[a],B[b].x,B[b].y),e_=ot_edge(B[b],B[a].x,B[a].y);ctx.save();ctx.strokeStyle=rgba(OT_GOLD,0.45*(1-on));ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(s_[0],s_[1]);ctx.lineTo(e_[0],e_[1]);ctx.stroke();ctx.restore();}
      if(on>0){relLine(ctx,B[a],B[b],ca,cb,{col:OT_GOLD,a:on,words:on,s:Z});if(verb)withA(ctx,on,()=>ot_pill(ctx,(B[a].x+B[b].x)/2+(dx||0),(B[a].y+B[b].y)/2+(dy||0),verb,OT_GOLD,{size:20}));}
      const hot=pulseAt(t,t0,1.6);if(hot)glow(ctx,(B[a].x+B[b].x)/2,(B[a].y+B[b].y)/2,100,OT_GOLD,0.5*hot);});};
    rel("learner","cred","1","*",cC+2.2,"holds",0,-30);rel("issuer","cred","1","*",cC+3.0,"issues",-50,34);rel("cred","evidence","1","*",cC+3.6,"rests on",0,-30);
    ["micro","award"].forEach(k=>withA(ctx,E[k].a,()=>isa(ctx,B[k].x,B[k].y-B[k].h/2,B.cred.x+B.cred.w/2-(k==="award"?30:110),B.cred.y+B.cred.h/2+4,1,OT_GOLD,{fill:"#0a1020"})));
    rel("micro","award","*","*",cC+5.0,"counts towards",0,-34);
    Object.keys(E).forEach(k=>ent(ctx,E[k]));
    // the rows of the credential, lit as the narration names them
    const bx=B.cred,x0=bx.x-bx.w/2,y0=bx.y-bx.h/2+58*Z,rowY=i=>y0+28*Z+i*30*Z,row=(i,a,col)=>{if(a<=0.01)return;withA(ctx,a,()=>{ctx.fillStyle=rgba(col,0.2);rr(ctx,x0+8,rowY(i)-23*Z,bx.w-16,30*Z,6);ctx.fill();ctx.fillStyle=rgba(col,0.95);rr(ctx,x0+8,rowY(i)-23*Z,5,30*Z,3);ctx.fill();});};
    const idA=fin(t,cI+0.3,0.4)*(1-fin(t,cA,0.5));row(0,idA,OT_WAX);[[1,cI+1.9],[2,cI+2.7],[3,cI+3.2],[4,cI+3.7]].forEach(([i,t0])=>row(i,fin(t,t0,0.3)*(1-fin(t,cA,0.5)),OT_WAX));
    [[5,cA+2.8],[6,cA+3.5],[7,cA+4.5]].forEach(([i,t0])=>row(i,fin(t,t0,0.3)*(1-fin(t,cC+0.5,0.6)),OT_STD));row(7,pulseAt(t,cR+1.2,2.0),BAD);
    withA(ctx,fin(t,cI+4.0,0.4)*(1-fin(t,cA,0.5)),()=>{ctx.strokeStyle=rgba(OT_WAX,0.9);ctx.lineWidth=3;const b0=x0+bx.w+12,ya=rowY(0)-22*Z,yb=rowY(4)+8;ctx.beginPath();ctx.moveTo(b0,ya);ctx.lineTo(b0+14,ya);ctx.lineTo(b0+14,yb);ctx.lineTo(b0,yb);ctx.stroke();ot_pill(ctx,b0+120,(ya+yb)/2,"identifies it",OT_WAX,{size:22});});
    withA(ctx,fin(t,cA+2.6,0.4)*(1-fin(t,cC+0.5,0.6)),()=>{ctx.strokeStyle=rgba(OT_STD,0.9);ctx.lineWidth=3;const b0=x0+bx.w+12,ya=rowY(5)-22*Z,yb=rowY(7)+8;ctx.beginPath();ctx.moveTo(b0,ya);ctx.lineTo(b0+14,ya);ctx.lineTo(b0+14,yb);ctx.lineTo(b0,yb);ctx.stroke();ot_pill(ctx,b0+130,(ya+yb)/2,"allowed values",OT_STD,{size:22});});
    // the rule
    withA(ctx,fin(t,cR+0.3,0.5),()=>{const rx=200,ry=720;glass(ctx,rx,ry,460,112,16,BAD,{glow:14,ea:0.8,fill:"rgba(7,12,24,0.95)"});T(ctx,"rule",rx+24,ry+38,{f:"mono",w:500,size:20,color:rgba(BAD,1)});
      T(ctx,"revoked → never counted",rx+24,ry+84,{w:800,size:30});arrowTo(ctx,rx+440,ry+30,x0+14,rowY(7)-6,BAD,0.8,{lw:2.4,head:12,bend:-0.15});});});
  // still no technology: the model becomes a yardstick, held against a vendor's model
  withA(ctx,fin(t,cT+0.2,0.5),()=>{const x=1560,y=110;dbGlyph(ctx,x-150,y,SOFT,0.8);cross_(ctx,x-150,y,44,BAD,0.9);ot_tag(ctx,x+20,y,"no technology",OT_GOLD,1,{size:24});});
  if(yard>0)withA(ctx,yard,()=>{const x0=160,x1=1760,cw=(x1-x0)/8;T(ctx,"our logical model: the yardstick",x0,290,{w:800,size:26,color:rgba(OT_GOLD,1)});ot_ruler(ctx,x0,x1,350,OT_VEND.map(v=>v[0]),1,clamp((t-cT-2.7)/1.0,0,1));
    const va=fin(t,cT+3.4,0.6);withA(ctx,va,()=>{T(ctx,"a vendor's model · short-course platform",x0,470,{w:700,size:22,color:rgba(OT_SYS.short.c,1)});glass(ctx,x0,490,x1-x0,100,16,OT_SYS.short.c,{glow:14,ea:0.8,fill:"rgba(7,12,24,0.94)"});
      OT_VEND.forEach(([m,v],i)=>T(ctx,v,x0+(i+0.5)*cw,550,{w:700,size:22,align:"center",color:v==="—"?rgba(SOFT,0.7):rgba(INK,1)}));});
    OT_VEND.forEach(([m,v,ok],i)=>ot_mark(ctx,x0+(i+0.5)*cw,420,!!ok,fin(t,cT+3.8+i*0.2,0.3),18));
    withA(ctx,fin(t,cT+5.6,0.4),()=>{const br=(i0,i1,col,s_)=>{const a=x0+i0*cw+14,b=x0+i1*cw-14;ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(a,606);ctx.lineTo(a,618);ctx.lineTo(b,618);ctx.lineTo(b,606);ctx.stroke();ot_pill(ctx,(a+b)/2,640,s_,col,{size:22});};
      br(0,5,GOOD,"fit");br(5,8,BAD,"gap");});
    [["choose a package",520,cT+5.9],["map its fields",960,cT+7.2],["move to a new one",1400,cT+8.5]].forEach(([s_,x,t0])=>withA(ctx,fin(t,t0,0.4),()=>ot_tag(ctx,x,760,s_,OT_GOLD,1,{size:26})));});
  vign(ctx,S);});

/* ---------- 7. Who owns what ---------- */
const OT_BAND=[[64,"the words","the business decides"],[304,"the logical model","one model for all"],[544,"the systems","each team, its tables"]],OT_BH=222;
scene("owners",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const cW=c("words"),cA=c("arch"),cD=c("down"),cS=c("stewards");
  OT_BAND.forEach(([y,n,sub],i)=>withA(ctx,fin(t,0.3+i*0.25,0.6),()=>{const hot=pulseAt(t,cD+0.6+i*1.0,1.2)+pulseAt(t,cD+5.6-i*0.8,1.2),col=i===2?CYAN:OT_GOLD;glass(ctx,60,y,1460,OT_BH,20,col,{glow:10+14*hot,ea:0.35+0.4*hot,fill:"rgba(10,16,32,0.55)"});
    T(ctx,n,90,y+56,{w:800,size:30,color:rgba(col,1)});T(ctx,sub,90,y+92,{w:600,size:20,color:rgba(SOFT,1)});}));
  const card=(x,y,w,word,owner,col,a)=>withA(ctx,a,()=>{glass(ctx,x,y,w,124,16,col,{glow:14,ea:0.85,fill:"rgba(7,12,24,0.95)"});T(ctx,word,x+24,y+52,{w:800,size:32,color:rgba(col,1)});T(ctx,owner,x+24,y+94,{w:600,size:20,color:rgba(SOFT,1)});});
  // the words, and their owners
  const y1=OT_BAND[0][0],y2=OT_BAND[1][0],y3=OT_BAND[2][0],mA=fin(t,cW+1.9,0.5),tA=fin(t,cW+4.3,0.5);
  withA(ctx,mA,()=>person(ctx,"mei",470,y1+OT_BH-6,0.4,{t,pose:t>cW+2&&t<cW+4.2?"explain":"stand",expr:"calm"}));card(560,y1+50,360,"award","owner: Registrar · Mei",TRUST,mA);
  withA(ctx,tA,()=>person(ctx,"tom",1020,y1+OT_BH-6,0.4,{t,pose:t>cW+4.4&&t<cW+6.6?"explain":"stand",expr:"calm"}));card(1100,y1+50,400,"microcredential","owner: Short courses · Tom",OFFICE.short.c,tA);
  // the model, and its owner
  const nA=fin(t,cA+0.3,0.5);withA(ctx,nA,()=>{person(ctx,"noor",470,y2+OT_BH-6,0.4,{t,pose:t>cA+0.4&&t<cA+3?"explain":"stand"});
    const yy=y2+88,E={l:{x:700,y:yy,name:"Learner",col:OT_GOLD,s:0.95},c_:{x:1010,y:yy,name:"Credential",col:OT_GOLD,s:0.95},e:{x:1320,y:yy,name:"Evidence",col:OT_GOLD,s:0.95}};diagram(ctx,E,[["l","c_","1","*",{col:OT_GOLD}],["c_","e","1","*",{col:OT_GOLD}]]);
    ot_pill(ctx,1010,y2+170,"owner: Noor, data architect",OT_GOLD,{size:21});});
  // the tables, and their teams
  const bA=fin(t,cA+3.4,0.5);withA(ctx,bA,()=>{person(ctx,"ben",470,y3+OT_BH-6,0.4,{t});
    [["awards","sis","student system team"],["certificates","short","platform team"],["badges","careers","careers team"]].forEach(([n,k,own],i)=>{const x=560+i*322,y=y3+42,col=OT_SYS[k].c;glass(ctx,x,y,300,140,14,col,{glow:12,ea:0.8,fill:"rgba(7,12,24,0.95)"});
      T(ctx,n,x+22,y+42,{f:"mono",w:500,size:24,color:rgba(col,1)});for(let r=0;r<2;r++){ctx.fillStyle=rgba(col,0.22);ctx.fillRect(x+22,y+58+r*18,256,11);}T(ctx,"owner: "+own,x+22,y+122,{w:600,size:19,color:rgba(SOFT,1)});});});
  // a change of meaning travels down; news of a change in a system travels up, before it ships
  const dA=fin(t,cD+0.1,0.5),uA=fin(t,cD+3.6,0.5),ax=1620,ux=1810;
  withA(ctx,dA,()=>{arrowTo(ctx,ax,110,ax,760,OT_WAX,0.85,{lw:4,head:18});ot_pill(ctx,ax,74,"meaning",OT_WAX,{size:21});});
  withA(ctx,uA,()=>{arrowTo(ctx,ux,760,ux,110,CYAN,0.85,{lw:4,head:18});ot_pill(ctx,ux,796,"news",CYAN,{size:21});});
  const du=clamp((t-cD-0.3)/3.2,0,1);if(du>0&&du<1)withA(ctx,Math.min(1,Math.sin(Math.PI*du)*2),()=>{const y=lerp(150,720,ease(du));glow(ctx,ax,y,60,OT_WAX,0.6);ot_pill(ctx,ax,y,"v1.1",OT_WAX,{size:20});});
  const uu=clamp((t-cD-3.8)/2.6,0,1);if(uu>0&&uu<1)withA(ctx,Math.min(1,Math.sin(Math.PI*uu)*2),()=>{const y=lerp(720,150,ease(uu));glow(ctx,ux,y,60,CYAN,0.6);ot_pill(ctx,ux,y,"upgrade",CYAN,{size:20});});
  withA(ctx,fin(t,cD+6.0,0.5),()=>{ot_pill(ctx,ux,440,"before it ships",CYAN,{size:21});});
  // owners decide; stewards keep it written down
  withA(ctx,fin(t,cS+0.2,0.5),()=>ot_tag(ctx,560,828,"Owners decide.",OT_GOLD,1,{size:26}));
  withA(ctx,fin(t,cS+1.3,0.5),()=>{ot_tag(ctx,1090,828,"Stewards keep it written down.",CYAN,1,{size:26});stamp(ctx,1500,y1+OT_BH-22,"glossary v1."+(t>cS+2.2?"5 · 28 Sep":"4 · 12 Aug"),TRUST,1,t>cS+2.2&&t<cS+3.0?t-cS:0);});
  vign(ctx,S);});

/* ---------- 8. Pull back ---------- */
const OT_ERA=[[1970,1985,"mainframe"],[1985,1998,"client–server"],[1998,2010,"web portal"],[2010,2021,"cloud suite"],[2021,2032,"platforms"]];
const ot_yx=y=>y<1955?120+(y-1150)/805*480:640+(y-1955)/80*1180;
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),B=c("breath");setScreen(ctx,S);bg2(ctx);
  const cS=c("same"),cJ=c("joined"),cO=c("outlive"),cL=c("last"),tl=fin(t,cO-0.3,1.1);
  if(tl<1)withA(ctx,1-tl,()=>{// the platform, unchanged; its words mapped to ours
    const B1=ot_sysCard(ctx,"short",140,160,480,540,{a:fin(t,0.1,0.6),ms:1.3,hiTop:pulseAt(t,cS+0.8,1.6),hiBot:pulseAt(t,cJ+2.6,1.4)});
    withA(ctx,fin(t,cS+3.3,0.5),()=>ot_pill(ctx,380,742,"nothing inside it changed",OT_SYS.short.c,{size:22}));
    const gA=fin(t,cJ+0.2,0.6);withA(ctx,gA,()=>{ctx.save();ctx.strokeStyle=rgba(OT_GOLD,0.5);ctx.lineWidth=1.6;ctx.setLineDash([6,8]);rr(ctx,1180,160,600,540,20);ctx.stroke();ctx.restore();T(ctx,"the shared model",1480,214,{w:800,size:28,align:"center",color:rgba(OT_GOLD,1)});});
    const L={x:1480,y:414,name:"Learner",col:OT_GOLD,s:1.3,a:gA},M={x:1480,y:606,name:"Microcredential",col:OT_GOLD,s:1.3,a:gA};const bL=entBox(ctx,L),bM=entBox(ctx,M);relLine(ctx,bL,bM,"1","*",{col:OT_GOLD,a:gA,s:1.3});ent(ctx,L);ent(ctx,M);
    if(B1){const jn=fin(t,cJ+4.6,0.6);[[B1.top,bL,cJ+0.8],[B1.bot,bM,cJ+2.8]].forEach(([a,b,t0])=>{const p=clamp((t-t0)/1.0,0,1);if(p<=0)return;const s_=[a.x+a.w/2+10,a.y],e_=[b.x-b.w/2-12,b.y];
      arrowTo(ctx,s_[0],s_[1],e_[0],e_[1],OT_GOLD,0.9,{p,bend:0.06,lw:3+1.5*jn,dash:jn>0.5?null:[10,8],head:16});if(p>=1)withA(ctx,fin(t,t0+0.8,0.4),()=>ot_pill(ctx,(s_[0]+e_[0])/2,(s_[1]+e_[1])/2-34,"maps to",OT_GOLD,{size:21}));});
      if(jn>0)withA(ctx,jn,()=>{glow(ctx,900,500,300,OT_GOLD,0.12);ot_tag(ctx,960,806,"mapped, not renamed: the meaning is joined",OT_GOLD,1,{size:26});});}});
  if(tl>0)withA(ctx,tl,()=>{// systems come and go; the ideas stay
    const y=660,x0=ot_yx(1150),x1=ot_yx(2032);ctx.fillStyle=rgba(OT_WAX,0.18);rr(ctx,x0,y-36,x1-x0,72,36);ctx.fill();ctx.save();ctx.strokeStyle=rgba(OT_WAX,0.9);ctx.lineWidth=2.4;ctx.shadowColor=rgba(OT_WAX,0.8);ctx.shadowBlur=14;rr(ctx,x0,y-36,x1-x0,72,36);ctx.stroke();ctx.restore();
    T(ctx,"students · courses · degrees, since the Middle Ages",(x0+x1)/2,y+10,{w:700,size:28,align:"center",color:rgba(PARCH,1)});
    ctx.strokeStyle=rgba(SOFT,0.4);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x0,y+52);ctx.lineTo(x1,y+52);ctx.stroke();
    [[1200,"1200s"],[1500,"1500s"],[1800,"1800s"],[1970,"1970"],[1990,"1990"],[2010,"2010"],[2030,"2030"]].forEach(([yr,s_])=>{const x=ot_yx(yr);ctx.fillStyle=rgba(SOFT,0.8);ctx.fillRect(x-1,y+46,2,12);T(ctx,s_,x,y+86,{f:"mono",w:500,size:20,align:"center",color:rgba(SOFT,1)});});
    T(ctx,"⋯",ot_yx(1955)-10,y+88,{w:800,size:24,align:"center",color:rgba(SOFT,0.8)});
    OT_ERA.forEach(([a,b,n],i)=>{const t0=cO+0.3+i*0.55,on=fin(t,t0,0.4),gone=i<4?fin(t,cO+0.3+(i+1)*0.55,0.4):0;if(on<=0)return;const xa=ot_yx(a)+4,xb=ot_yx(b)-4,yy=i%2?520:440;
      withA(ctx,on*(1-0.55*gone),()=>{glass(ctx,xa,yy,xb-xa,64,12,CYAN,{glow:10,ea:0.7,fill:"rgba(7,12,24,0.94)"});T(ctx,n,(xa+xb)/2,yy+40,{w:700,size:21,align:"center"});});
      if(gone>0)withA(ctx,gone,()=>T(ctx,"replaced",(xa+xb)/2,yy-10,{f:"mono",w:500,size:16,align:"center",color:rgba(SOFT,0.9)}));
      // hold every system up to the model
      const h=fin(t,cL+2.0+i*0.2,0.4);if(h>0)withA(ctx,h,()=>{ctx.save();ctx.strokeStyle=rgba(OT_GOLD,0.6);ctx.lineWidth=1.8;ctx.setLineDash([4,6]);ctx.beginPath();ctx.moveTo(1230,300);ctx.lineTo((xa+xb)/2,yy);ctx.stroke();ctx.restore();ot_mark(ctx,xb-14,yy+2,true,h,13);});});
    withA(ctx,fin(t,cO+0.4,0.5),()=>ot_pill(ctx,1580,360,"a new system every decade or so",CYAN,{size:21}));
    withA(ctx,fin(t,cL+0.2,0.7),()=>{ot_hub(ctx,1230,210,92,t,1,{title:"the model"});});
    withA(ctx,fin(t,cO+3.0,0.6),()=>ot_pill(ctx,360,560,"the ideas: centuries old",OT_WAX,{size:24}));
    withA(ctx,fin(t,cL+4.0,0.6),()=>ot_tag(ctx,960,812,"Next: one model, many shapes",OT_GOLD,1,{size:26}));});
  endCard(ctx,S,t,B+0.3,"Older than the systems",OT_WAX,"The concepts outlive the systems.");
  vign(ctx,S);});
