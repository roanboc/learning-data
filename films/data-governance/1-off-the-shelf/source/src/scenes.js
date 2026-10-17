/* ===== Off the shelf: the ten chapters =====
   Each chapter is a few shots in the toy town, cut together with short dissolves. Times inside a chapter come from its cues
   (when each line starts), so the pictures stay with the voice if it's recorded again. Words on screen are signs, tags and
   speech bubbles, drawn after the blur, at least 28 px, and kept above the captions. */

// made once per chapter, the first time it draws: its cues are known by then
const os_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// a hammer's strike: 0 (raised) to 1 (down) and back, over d seconds from t0
const os_strike=(t,t0,d)=>{const u=(t-t0)/(d||0.6);return u<=0||u>=1?0:u<0.35?easeCam(u/0.35):1-easeCam((u-0.35)/0.65);};
// the shop's own coordinates in the town's (it faces the square, so only a shift)
const os_shopP=(x,y,z)=>v3(OS_SHOP.x+x,y,OS_SHOP.z+z),os_hallP=(x,y,z)=>v3(OS_HALL.x+x,y,OS_HALL.z+z);

// ---- 1 · One measure: the market town, from 1215 to the 1880s ----
// the jugs on the wine stall, year by year: none of them the same
const OS_JUGS=[[0.32,0.24,0.4],[0.26,0.38,0.3],[0.4,0.28,0.22],[0.3,0.34,0.26],[0.24,0.42,0.33]];
scene("measure",(ctx,S,t,sc)=>{const c=sc.cues,P=os_once(sc,"P",()=>{
    const years=[c.repeat+0.2,c.repeat+1.5,c.repeat+2.8,c.repeat+4.1],hall=c.kings-0.4,y1871=wAt(sc,"county","In eighteen")-0.5,shop=c.worked-0.4,close=c.breath-1.8,title=c.breath+0.7;
    return{years,hall,y1871,shop,close,title,
      // where each shot's camera goes
      kA:os_keys([[0,v3(0,9.5,-12),v3(0,1.2,7),1450],[4.6,v3(0.5,4.4,-3.2),v3(0,1.25,6.0),1400],[c.repeat-0.6,v3(0.1,2.6,1.3),v3(-0.3,1.6,6.0),1400]]),
      kB:os_keys([[years[0]-0.3,v3(-4.4,2.0,1.6),v3(-4.4,1.0,6.0),1400],[hall+0.7,v3(-4.6,1.8,2.4),v3(-4.5,1.05,6.0),1400]]),
      kC:os_keys([[hall,v3(3.4,3.0,6.2),v3(6.2,1.5,14.0),1400],[hall+4.2,v3(4.6,2.7,7.6),v3(6.9,1.5,15.6),1400]]),
      kD:os_keys([[y1871,v3(4.3,2.3,1.2),v3(4.3,1.0,6.0),1400],[shop+0.7,v3(4.3,1.95,2.3),v3(4.3,1.05,6.0),1400]]),
      kE:os_keys([[shop,os_shopP(0.2,2.8,-6.0),os_shopP(0,1.4,2.0),1400],[shop+3.4,os_shopP(0.2,2.35,-4.4),os_shopP(0,1.4,2.0),1400],[close+0.7,os_shopP(0.15,2.25,-3.8),os_shopP(-0.05,1.4,2.0),1400]]),
      kF:os_keys([[close,os_shopP(-1.0,1.95,-0.6),os_shopP(-0.45,1.5,2.0),1450],[title+0.7,os_shopP(-0.85,1.9,-0.25),os_shopP(-0.45,1.5,2.0),1450]]),
      kG:os_keys([[title,v3(0,8.6,-10.4),v3(0,1.0,7.0),1500],[sc.dur+1,v3(0.6,9.2,-11.4),v3(0,1.0,7.0),1500]])};});
  const years=["England · 1225","England · 1297","England · 1640","England · 1824"];
  const mk=[[0,"England · 1215"],...P.years.map((y,i)=>[y,years[i]]),[P.hall,"England · 1497"],[P.y1871,"England · 1871"],[P.shop,"England · 1880s"]];
  const marker_=c_=>os_marker(c_,t,mk,os_in01(t,0.8,0.5)*(1-os_in01(t,P.close,0.5)));
  // the crier, his listeners: 1215
  const shotA=(ctx,S,t)=>{const C=os_cam(P.kA,t),say=os_io(t,c.quote-0.1,c.repeat-0.2,0.35);
    os_market(ctx,S,C,{t,era:1215,figs:[{id:"crier",x:-0.4,z:5.72,y:0.44,pose:"hold",t,carry:heldScroll,nod:0.05*Math.sin(t*2.2)*say,onDraw:(c_,B)=>os_say(B,["One measure of wine","throughout our kingdom."],{size:34,a:say})},
      {id:"vintner",x:-3.9,z:4.7,pose:"listen",t,flip:true},{id:"alewife",x:-2.4,z:4.2,pose:"hold",t,carry:heldJug},{id:"miller",x:3.3,z:4.6,pose:"listen",t},{id:"buyer",x:1.5,z:4.0,pose:"listen",t}],after:marker_});};
  // the years turn over at the wine stall: the charter read again, the jugs still all different
  const shotB=(ctx,S,t)=>{const C=os_cam(P.kB,t);let k=0;P.years.forEach((y,i)=>{if(t>=y)k=i+1;});const y0=k?P.years[k-1]:-9,u=clamp((t-y0)/0.45,0,1),g=spring(clamp((t-y0-0.2)/0.6,0,1));
    const jugs=OS_JUGS[k].map((h,i)=>k?lerp(OS_JUGS[k-1][i],h,g):h);
    os_market(ctx,S,C,{t,era:1215,jugs,charter:{flip:k?u:0,seal:k?clamp((t-y0-0.25)/0.5,0,1):1},after:marker_});};
  // 1497: the king's standards in a cupboard in the market hall; the clerk of the market checks a trader's jug now and then
  const shotC=(ctx,S,t)=>{const C=os_cam(P.kC,t),off=wAt(sc,"kings","Officers"),cl=along([[-1.4,2.3],[-0.9,0.8]],t,off-0.6,0.9),tr=along([[9.8,12.1],[7.5,12.6]],t,off-1.4,1.4);
    os_market(ctx,S,C,{t,era:1497,hall:{glow:os_io(t,wAt(sc,"kings","standards")-0.3,P.y1871+0.5,0.5)},
      figs:[{id:"clerk",at:"hall",x:cl.x,z:cl.z,hop:cl.hop,pose:"hold",t,carry:os_heldGallon},{id:"trader",x:tr.x,z:tr.z,hop:tr.hop,pose:"hold",t,carry:heldJug,flip:true}],
      extra:(C_,add)=>os_tag(C_,os_hallP(0,2.5,3.1),"the king's standard",{a:os_io(t,wAt(sc,"kings","standards"),P.y1871+0.3,0.4),size:30}),after:marker_});};
  // 1871: the corn stall, every measure on it called a bushel
  const shotD=(ctx,S,t)=>{const C=os_cam(P.kD,t),n32=wAt(sc,"county","thirty");
    os_market(ctx,S,C,{t,era:1871,figs:[{id:"grocer",x:4.7,z:7.1,pose:"listen",t}],bushels:clamp((t-wAt(sc,"county","bushel")+0.3)/2.2,0,1),after:c_=>{marker_(c_);const a=os_io(t,n32,P.shop+0.6,0.4);if(a>0)os_board(c_,W/2,214,"32 measures in one county",{size:36,a:clamp(a*1.6,0,1),k:0.8+0.2*spring(a),bg:[255,236,200],rim:[214,150,80]});}});};
  // the 1880s: what worked, all of it together: the Act, a copy of the standard, an inspector who checks, and stamps
  const law=c.three,copy=wAt(sc,"three","a copy"),insp=wAt(sc,"three","an inspector"),chk=wAt(sc,"three","checked"),again=wAt(sc,"three","again and"),behind=wAt(sc,"three","with the law");
  const shopState=(t,o)=>{const set=os_in01(t,chk+0.2,0.3),s1=os_strike(t,again,0.55),s2=os_strike(t,again+0.6,0.55);
    return Object.assign({tilt:0.2*(1-spring(clamp((t-chk-0.3)/0.9,0,1))),brass:set>=1,crown:clamp((t-again-0.2)/0.4,0,1),act:Math.max(os_io(t,law-0.1,copy,0.4),os_io(t,behind-0.1,P.close+0.4,0.4)),caseGlow:os_io(t,copy-0.1,insp+0.6,0.4),strike:Math.max(s1,s2)},o||{});};
  // he walks in to the counter beside the scale, shows a brass copy, sets it in the pan, and stamps the grocer's weight
  const inspector=(t,s,o)=>{const w=along([[-1.9,0.25],[0.75,1.4]],t,P.shop+0.1,1.0),hammer=t>=again-0.5,hold=t>=insp&&t<chk+0.2;
    return Object.assign({id:"inspector",at:"shop",x:w.x,z:w.z,hop:w.hop,t,flip:true,pose:hammer?"os_hitUp":hold?"hold":"stand",pose2:hammer?"os_hitDown":null,mix:s.strike,
      carry:hammer?os_hammer(lerp(1.35,0,s.strike),true):hold?heldWeight:null,wide:hammer},o||{});};
  const shotE=(ctx,S,t)=>{const C=os_cam(P.kE,t),s=shopState(t);
    os_market(ctx,S,C,{t,era:1880,shop:s,figs:[inspector(t,s,{onDraw:(c_,B)=>os_figTag(B,"an inspector who checks",{a:os_io(t,insp,P.close+0.3,0.4),size:30,dy:20,dx:130})}),{id:"grocer",at:"shop",x:-1.4,z:2.6,pose:"listen",t}],
      extra:(C_,add)=>{os_tag(C_,os_shopP(-2.55,2.0,0.36),"one definition, in law",{a:os_io(t,law,P.close+0.3,0.4),size:30});os_tag(C_,os_shopP(1.75,1.42,1.05),"a copy in every county",{a:os_io(t,copy,P.close+0.3,0.4),size:30});
        os_tag(C_,os_shopP(-0.55,1.32,1.75),"again and again",{a:os_io(t,again,P.close+0.3,0.4),size:30,dy:-70});},after:marker_});};
  // the stamp, close; then the title over the square
  const shotF=(ctx,S,t)=>{const C=os_cam(P.kF,t),hit=c.breath-0.6,s=shopState(t,{tilt:0,brass:true,act:0,caseGlow:0,crown:clamp((t-hit-0.18)/0.4,0,1),strike:os_strike(t,hit-0.2,0.7)});
    os_market(ctx,S,C,{t,era:1880,inside:"os_shop",shop:s,figs:[inspector(t,s,{x:0.75,z:1.4,hop:0}),{id:"grocer",at:"shop",x:-1.4,z:2.6,pose:"listen",t}],ts:[150,950,5]});};
  const shotG=(ctx,S,t)=>{const C=os_cam(P.kG,t);os_market(ctx,S,C,{t,era:1880,after:c_=>os_card(c_,os_in01(t,P.title+0.2,0.8),["Off the shelf",110],"where a policy meets the work","Film 1 of 16 · data governance")});};
  os_shots(ctx,S,t,[[0,shotA],[P.years[0]-0.3,shotB],[P.hall,shotC],[P.y1871,shotD],[P.shop,shotE],[P.close,shotF],[P.title,shotG]]);});

// ---- the people at work round the green, where they stand in their rooms ----
const OS_AT={jun:{id:"jun",at:"data",x:1.85,z:2.25,pose:"stand"},mei:{id:"mei",at:"registrar",x:0.35,z:2.2,pose:"stand"},sam:{id:"sam",at:"platform",x:0.55,z:2.5,pose:"stand"},clara:{id:"clara",at:"planning",x:-0.75,z:2.05,pose:"explain"}};
const os_at=(id,t,o)=>Object.assign({},OS_AT[id],{t},o||{});
// a camera in a room, in the room's own coordinates: [t, eye, target, f]
const os_rk=(id,t,e,g,f,mode)=>[t,bldP(id,...e),bldP(id,...g),f||1400,null,mode];
// Yusuf's way in, along a path from the south to his office's front, and up onto its floor
const OS_IN=[[-0.3,-7.4],[-0.4,-3.0],[-0.5,-0.9]];
const os_floor=z=>clamp((z+2.12)/0.3,0,1)*0.3;

// ---- 2 · The shelf: Yusuf's first day, and what he inherits ----
scene("shelf",(ctx,S,t,sc)=>{const c=sc.cues,P=os_once(sc,"P",()=>{const b=c.shelf-0.6,ch=c.chart-0.5,co=c.council-0.6,br=c.brief-0.5;
    return{b,ch,co,br,kA:os_keys([[0,v3(-4,9,-21),v3(-0.8,0.9,-4),1500],[c.starts+3.6,v3(0.2,2.7,-8.8),v3(-0.3,1.3,-1.2),1450]]),
      kB:os_keys([[b,v3(0.55,2.62,-6.45),v3(-0.12,1.36,0.3),1360],[ch+0.7,v3(-0.6,2.3,-4.2),v3(-0.95,1.6,1.0),1400]]),
      kC:os_keys([os_rk("office",ch,[-0.72,1.8,1.12],[-2.29,1.8,1.07],1400),os_rk("office",co+0.7,[-0.8,1.8,1.05],[-2.29,1.8,1.07],1400)]),
      kD:os_keys([os_rk("office",co,[0.95,2.05,1.2],[0.95,1.06,2.05],1450),os_rk("office",br+0.7,[0.98,1.95,1.32],[0.95,1.06,2.05],1450)]),
      kE:os_keys([[br,v3(0.6,2.45,-6.2),v3(0,1.4,0.2),1360],[sc.dur+1,v3(0.45,2.35,-5.5),v3(0,1.45,0.2),1360]])};});
  const yu=(t,o)=>{const w=along(OS_IN,t,0.5,1.25);return Object.assign({id:"yusuf",x:w.x,z:w.z,y:os_floor(w.z),hop:w.hop,pose:"stand",t},o||{});};
  const shotA=(ctx,S,t)=>{const C=os_cam(P.kA,t);drawCampus(ctx,S,C,{t,figs:[Object.assign(yu(t),{onDraw:(c_,B)=>os_figTag(B,["Yusuf Demir","data governance lead"],{a:os_io(t,c.starts+0.3,P.b+0.6,0.4),size:30})})]});};
  const shotB=(ctx,S,t)=>{const C=os_cam(P.kB,t);drawCampus(ctx,S,C,{t,figs:[yu(t,{x:-0.45,z:-0.75,y:0.3,hop:0,pose:"listen"})],
    office:{shelfSign:os_in01(t,wAt(sc,"shelf","thirty")-0.2,0.5),maturity:os_io(t,wAt(sc,"shelf","maturity"),P.ch+0.6,0.4),tbc:0},
    extra:(C_,add)=>os_tag(C_,bldP("office",0.15,2.5,3.55),"maturity · 2.1 / 5",{a:os_io(t,wAt(sc,"shelf","maturity"),P.ch+0.6,0.4),size:32})});};
  const shotC=(ctx,S,t)=>{const C=os_cam(P.kC,t);drawCampus(ctx,S,C,{t,inside:"office",office:{tbc:clamp((t-wAt(sc,"chart","half")+0.2)/2.2,0,1)},ts:[120,960,5]});};
  // the council's minutes, open on the desk: the same action, carried forward again
  const shotD=(ctx,S,t)=>{const C=os_cam(P.kD,t),st=pop(t,wAt(sc,"council","once")-0.1,0.6);
    drawCampus(ctx,S,C,{t,inside:"office",office:{bare:1,tbc:1},ts:[110,980,5],hooks:{officeDesk:(ctx,C_,top)=>{fq3(ctx,C_,0.5,1.8,1.42,2.36,top+0.002,[200,70,60],{edge:0.4});
      os_paper(ctx,C_,0.56,1.84,0.96,2.32,top+0.006,c_=>{Tw(c_,"Council minutes",20,6,{w:800,size:3.6,align:"center",color:rgba(PAL.ink,1)});[0,1,2].forEach(i=>{c_.fillStyle="rgba(150,150,170,0.6)";c_.fillRect(4,12+i*3,32-(i===2?10:0),0.6);});
        Tw(c_,"Action: name",20,27.3,{w:700,size:3.5,align:"center",color:rgba([70,76,100],1)});Tw(c_,"the data owners",20,32.2,{w:700,size:3.5,align:"center",color:rgba([70,76,100],1)});
        if(st>0){c_.save();c_.translate(20,40.5);c_.rotate(-0.12);const k=1+1.2*(1-st);c_.scale(k,k);c_.globalAlpha*=clamp(st*3,0,1);c_.strokeStyle=rgba([200,52,44],0.9);c_.lineWidth=0.5;rr(c_,-17,-4.2,34,7,1);c_.stroke();
          Tw(c_,"CARRIED FORWARD",0,1.3,{w:800,size:3.3,align:"center",color:rgba([200,52,44],0.95)});c_.restore();}});
      os_paper(ctx,C_,0.98,1.84,1.38,2.32,top+0.006,c_=>{[0,1,2,3,4,5].forEach(i=>{c_.fillStyle="rgba(150,150,170,0.55)";c_.fillRect(4,8+i*5,32-(i%3===2?12:0),0.6);});});}}});};
  const shotE=(ctx,S,t)=>{const C=os_cam(P.kE,t),say=os_in01(t,c.brief+0.1,0.4);
    drawCampus(ctx,S,C,{t,office:{tbc:1},figs:[yu(t,{x:-0.5,z:-0.7,y:0.3,hop:0,pose:"hold",expr:"worried",carry:heldBinder("12",PAL.navy)}),
      {id:"david",x:1.75,z:-2.6,pose:"explain",t,flip:true,onDraw:(c_,B)=>os_say(B,["Can you fix governance","before the submission?"],{size:32,a:say,left:true})}]});};
  os_shots(ctx,S,t,[[0,shotA],[P.b,shotB],[P.ch,shotC],[P.co,shotD],[P.br,shotE]]);});

// ---- 3 · Two numbers: two reports across the green that don't agree ----
// Planning's census report, on the wall screen in its office (in centimetres from the screen's top left, 253 x 133)
function os_census(c,n){c.fillStyle="#f4f8fc";c.fillRect(0,0,253,133);Tw(c,"Census report",14,24,{w:800,size:15,color:rgba(PAL.ink,1)});Tw(c,"awards conferred this year",14,44,{w:600,size:12,color:rgba([96,104,128],1)});
  for(let i=0;i<6;i++){const h=22+46*hash(i,41);c.fillStyle=rgba(i===5?PAL.gold:[150,186,222],1);c.fillRect(16+i*19,122-h,13,h);}
  if(n>0){c.save();c.translate(190,96);const k=0.7+0.3*spring(n);c.scale(k,k);c.globalAlpha*=clamp(n*2,0,1);Tw(c,"4,812",0,0,{w:800,size:44,align:"center",color:rgba([40,96,150],1)});c.restore();}}
// the registrar's draft submission, held out (in the figure's units, the page 200 x 246 round its middle)
const os_draft=n=>c=>{c.fillStyle="rgba(100,150,200,1)";c.fillRect(-100,-122,200,86);c.fillStyle="#fff";c.textAlign="center";c.font=font(800,34);c.fillText("Draft",0,-86);c.fillText("submission",0,-50);
  for(let i=0;i<2;i++){c.fillStyle="rgba(150,150,170,0.6)";c.fillRect(-74,-16+i*16,148-(i===1?50:0),6);}
  if(n>0){c.save();c.translate(0,72);const k=0.7+0.3*spring(n);c.scale(k,k);c.globalAlpha*=clamp(n*2,0,1);c.fillStyle=rgba([40,96,150],1);c.font=font(800,70);c.fillText("4,867",0,0);c.restore();}
  c.fillStyle=rgba([96,104,128],1);c.font=font(700,30);c.fillText("awards",0,110);};
scene("numbers",(ctx,S,t,sc)=>{const c=sc.cues,P=os_once(sc,"P",()=>{const pl=c.census-0.6,rg=c.draft-0.6,wh=c.which-0.6;
    return{pl,rg,wh,kA:os_keys([[0,v3(0.2,11,-6.5),v3(0,0.8,9.5),950],[pl+0.7,v3(0.05,9.0,0.6),v3(0,0.8,9.5),950]]),
      kB:os_keys([os_rk("planning",pl,[-0.2,1.95,-0.6],[-0.4,1.7,3.8],1400),os_rk("planning",rg+0.7,[-0.3,1.9,-0.1],[-0.45,1.7,3.8],1400)]),
      kC:os_keys([os_rk("registrar",rg,[0.75,1.75,-2.3],[0.75,1.42,2.5],1250),os_rk("registrar",wh+0.7,[0.75,1.7,-1.8],[0.78,1.45,2.5],1250)]),
      kD:os_keys([[wh,v3(0,8.6,1.8),v3(0,0.8,9.5),950],[sc.dur+1,v3(0.25,8.2,2.4),v3(0,0.8,9.5),950]])};});
  const cen=wAt(sc,"census","four"),dr=wAt(sc,"draft","four");
  // Yusuf crosses the green from his office, and stops in the middle of it
  const yu=t=>{const w=along([[-1.4,2.4],[-0.6,4.2],[0,5.9]],t,0.6,1.1);return{id:"yusuf",x:w.x,z:w.z,hop:w.hop,pose:w.done?"listen":"stand",t,expr:t>c.which?"concerned":"calm"};};
  const shotA=(ctx,S,t)=>drawCampus(ctx,S,os_cam(P.kA,t),{t,office:{tbc:1},figs:[yu(t),os_at("clara",t),os_at("mei",t)]});
  const shotB=(ctx,S,t)=>drawCampus(ctx,S,os_cam(P.kB,t),{t,inside:"planning",ts:[110,980,5],hooks:{planningScreen:c_=>os_census(c_,os_in01(t,cen-0.1,0.5))},
    figs:[os_at("clara",t,{x:1.3,z:3.05,pose:"point",flip:true})]});
  const shotC=(ctx,S,t)=>drawCampus(ctx,S,os_cam(P.kC,t),{t,inside:"registrar",ts:[110,980,5],figs:[os_at("mei",t,{x:0.75,z:0.85,pose:"hold",carry:os_heldDoc(os_draft(os_in01(t,dr-0.1,0.5)))})]});
  const shotD=(ctx,S,t)=>drawCampus(ctx,S,os_cam(P.kD,t),{t,office:{tbc:1},names:{planning:1,registrar:1},
    figs:[Object.assign(yu(t),{onDraw:(c_,B)=>os_figTag(B,"?",{a:os_in01(t,c.which,0.5),size:64,bg:[255,226,150],rim:[214,160,60],ink:[120,80,20],dy:24})}),os_at("clara",t),os_at("mei",t)],
    extra:(C_,add)=>{os_tag(C_,bldP("planning",0.8,0.3,-0.15),["census report","4,812 awards"],{size:34,pop:false});os_tag(C_,bldP("registrar",-0.95,0.3,-0.15),["draft submission","4,867 awards"],{size:34,pop:false});}});
  os_shots(ctx,S,t,[[0,shotA],[P.pl,shotB],[P.rg,shotC],[P.wh,shotD]]);});

// ---- 4 · Who decides? Yusuf follows the numbers back to the data team, the registrar, and his own chart ----
scene("decides",(ctx,S,t,sc)=>{const c=sc.cues,P=os_once(sc,"P",()=>{const b1=c.both-0.5,b2=c.monday-0.6,b3=c.before-0.6,cc=c.gov-0.6,d=c.answers-0.6,e=c.tbc-0.6;
    return{b1,b2,b3,cc,d,e,kA:os_keys([[0,v3(0.25,8.2,2.4),v3(0,0.8,9.5),950],[b1+0.7,v3(-1.4,4.4,7.0),v3(9.6,1.2,3.1),1150]]),
      kB:os_keys([os_rk("data",b1,[1.25,2.04,1.3],[1.25,1.93,3.8],1400),os_rk("data",b2+0.7,[1.25,2.03,1.55],[1.25,1.93,3.8],1400)]),
      kS:os_keys([os_rk("data",b2,[0.8,1.6,0.05],[0.95,1.55,1.25],1400),os_rk("data",b3+0.7,[0.84,1.6,0.25],[0.95,1.55,1.25],1400)]),
      kB3:os_keys([os_rk("data",b3,[1.25,2.03,1.55],[1.25,1.93,3.8],1400),os_rk("data",cc+0.7,[1.25,2.02,1.75],[1.25,1.93,3.8],1400)]),
      kC:os_keys([os_rk("registrar",cc,[0.1,1.85,-0.75],[0.1,1.45,1.5],1400),os_rk("registrar",d+0.7,[0.1,1.8,-0.4],[0.1,1.45,1.5],1400)]),
      kD:os_keys([[d,v3(0.5,13,0.8),v3(2.2,0,8.6),900],[e+0.7,v3(0.75,12.6,1.4),v3(2.2,0,8.6),900]]),
      kE:os_keys([[e,v3(-0.9,1.95,-1.95),v3(-2.28,1.8,-0.84),1360],[sc.dur+1,v3(-1.05,1.93,-1.72),v3(-2.28,1.8,-0.84),1360]])};});
  const right=wAt(sc,"both","right"),mon=wAt(sc,"monday","microcredentials"),chg=wAt(sc,"monday","the word"),bef=wAt(sc,"before","before"),aft=wAt(sc,"before","after");
  // the cork board: the two reports and when each ran; later, Monday's change between them
  const board=(ctx,C,z,o)=>{const card=(x0,x1,lines,a)=>os_reportCard(ctx,C,x0,1.62,x1,2.22,z,[255,252,244],lines,a);
    card(0.1,1.02,[["census report",8.5,800],["ran Friday",7.5,600],["4,812",18,800,[40,96,150]]],1);card(1.48,2.4,[["draft submission",8.5,800],["ran Wednesday",7.5,600],["4,867",18,800,[40,96,150]]],1);
    os_tick(ctx,C,v3(0.97,2.17,z-0.012),o.tick);os_tick(ctx,C,v3(2.35,2.17,z-0.012),o.tick);
    if(o.mon>0)os_reportCard(ctx,C,1.06,1.74,1.44,2.12,z,[255,226,150],[["Monday",8.5,800],["award",7,700],["changed",7,700]],o.mon);
    surfDraw(ctx,C,v3(0.1,1.6,z-0.006),v3(1,0,0),v3(0,1,0),c_=>{if(o.bef>0)Tw(c_,"before",46,6,{w:800,size:7.5,align:"center",color:rgba([40,96,150],clamp(o.bef*2,0,1))});if(o.aft>0)Tw(c_,"after",184,6,{w:800,size:7.5,align:"center",color:rgba([40,96,150],clamp(o.aft*2,0,1))});});};
  const yu=t=>{const w=along([[0,5.9],[4.4,4.5]],t,0.3,1.25);return{id:"yusuf",x:w.x,z:w.z,hop:w.hop,pose:"stand",t,expr:"concerned"};};
  const shotA=(ctx,S,t)=>drawCampus(ctx,S,os_cam(P.kA,t),{t,office:{tbc:1},figs:[yu(t),os_at("jun",t),os_at("mei",t),os_at("clara",t)]});
  const shotB=(ctx,S,t)=>drawCampus(ctx,S,os_cam(P.kB,t),{t,inside:"data",ts:[100,990,4],hooks:{dataBoard:(ctx,C,z)=>board(ctx,C,z,{tick:os_in01(t,right-0.1,0.5)})}});
  const shotS=(ctx,S,t)=>drawCampus(ctx,S,os_cam(P.kS,t),{t,inside:"data",ts:[100,990,4],hooks:{dataScreen:c_=>os_term(c_,os_in01(t,mon-0.1,0.6),os_in01(t,chg,0.5))},figs:[os_at("jun",t,{x:1.95,z:2.0,pose:"point"})]});
  const shotB3=(ctx,S,t)=>drawCampus(ctx,S,os_cam(P.kB3,t),{t,inside:"data",ts:[100,990,4],hooks:{dataBoard:(ctx,C,z)=>board(ctx,C,z,{tick:1,mon:os_in01(t,P.b3+0.5,0.6),bef:os_in01(t,bef,0.4),aft:os_in01(t,aft,0.4)})}});
  // the registrar's counter: the government's reporting manual, the university's own term, and no one who maps one to the other
  const who=wAt(sc,"gov","Who");
  const shotC=(ctx,S,t)=>{const top=1.31;drawCampus(ctx,S,os_cam(P.kC,t),{t,inside:"registrar",ts:[100,990,4],
    figs:[os_at("mei",t,{x:1.05,z:2.3,pose:t>who?"shrug":"listen",expr:"concerned"})],
    hooks:{registrarCounter:(ctx,C,top_)=>{os_bookUp(ctx,C,-0.46,1.38,top_,0.36,0.46,[46,72,120],c_=>{Tw(c_,"Reporting",18,13,{w:800,size:5,align:"center",color:"#fff"});Tw(c_,"manual",18,20,{w:800,size:5,align:"center",color:"#fff"});
        c_.fillStyle="rgba(255,255,255,0.5)";c_.fillRect(8,26,20,0.6);Tw(c_,"awards",18,33,{w:700,size:4,align:"center",color:"rgba(255,255,255,0.85)"});});
      os_tent(ctx,C,0.42,1.4,top_,c_=>{Tw(c_,"award",15,9,{w:800,size:5.4,align:"center",color:rgba(PAL.ink,1)});Tw(c_,"our term",15,16.4,{w:600,size:4.0,align:"center",color:rgba([96,104,128],1)});});}},
    extra:(C_,add)=>{const g=c.gov;os_tag(C_,bldP("registrar",-0.28,top+0.5,1.38),"the government's definition",{a:os_in01(t,g+0.2,0.5),size:30,dy:20});os_tag(C_,bldP("registrar",0.57,top+0.24,1.42),"ours",{a:os_in01(t,wAt(sc,"gov","ours"),0.4),size:30,dy:20});
      os_arc(C_,bldP("registrar",0.5,top+0.26,1.42),bldP("registrar",-0.12,top+0.42,1.38),os_in01(t,who,0.9),{lift:150,label:"?",la:os_in01(t,who+0.6,0.4),size:56,bg:[255,226,150],rim:[214,160,60],ink:[120,80,20]});}});};
  // three people, three answers, and nobody's is the mapping
  const ans=[wAt(sc,"answers","Mei"),wAt(sc,"answers","Jun"),wAt(sc,"answers","Planning")];
  const shotD=(ctx,S,t)=>drawCampus(ctx,S,os_cam(P.kD,t),{t,office:{tbc:1},
    figs:[os_at("mei",t,{onDraw:(c_,B)=>os_figTag(B,["Mei","owns the meaning"],{a:os_in01(t,ans[0]-0.1,0.4),size:30})}),os_at("jun",t,{onDraw:(c_,B)=>os_figTag(B,["Jun","builds the model"],{a:os_in01(t,ans[1]-0.1,0.4),size:30})}),
      os_at("clara",t,{onDraw:(c_,B)=>os_figTag(B,["Planning","reports what it's given"],{a:os_in01(t,ans[2]-0.1,0.4),size:30})}),{id:"yusuf",x:4.4,z:4.5,pose:"listen",t,expr:"concerned"}]});
  // back in his office: the chart, the government submission's row, and its answer
  const shotE=(ctx,S,t)=>drawCampus(ctx,S,os_cam(P.kE,t),{t,inside:"office",ts:[150,950,5],office:{tbc:1,raciHi:os_in01(t,P.e+0.5,0.6),stamp:os_in01(t,wAt(sc,"tbc","to be")-0.15,0.5)}});
  os_shots(ctx,S,t,[[0,shotA],[P.b1,shotB],[P.b2,shotS],[P.b3,shotB3],[P.cc,shotC],[P.d,shotD],[P.e,shotE]]);});

// ---- 5 · What governance is for: policy 12, open on the desk, and the market's answer ----
scene("for",(ctx,S,t,sc)=>{const c=sc.cues,P=os_once(sc,"P",()=>{const b=c.for-0.6,cc=c.like-0.6,d=c.mgmt-0.6;
    return{b,cc,d,kA:os_keys([os_rk("office",0,[1.2,1.82,1.6],[1.2,1.06,2.1],1450),os_rk("office",b+0.7,[1.2,1.74,1.68],[1.2,1.06,2.1],1450)]),
      kB:os_keys([[b,v3(0.4,2.6,-7.2),v3(0,1.4,0),1400],[b+4.2,v3(0,14,-11.5),v3(0,0,3.2),1300],[cc+0.7,v3(0.3,14.4,-11.8),v3(0,0,3.2),1300]]),
      kC:os_keys([[cc,os_shopP(0.2,2.6,-5.2),os_shopP(0,1.4,2.0),1400],[d+0.7,os_shopP(0.15,2.35,-4.2),os_shopP(-0.05,1.4,2.0),1400]]),
      kD:os_keys([[d,v3(0,13,-13),v3(0,0.5,2.5),1350],[sc.dur+1,v3(0.4,12.6,-12.4),v3(0,0.5,2.5),1350]])};});
  // the open binder: what policy 12 says, and the two things it leaves out
  const who=wAt(sc,"doesnt","who"),how=wAt(sc,"doesnt","how");
  const shotA=(ctx,S,t)=>{const g1=os_in01(t,who-0.1,0.5),g2=os_in01(t,how-0.1,0.5);drawCampus(ctx,S,os_cam(P.kA,t),{t,inside:"office",office:{bare:1,tbc:1},ts:[90,990,4],hooks:{officeDesk:(ctx,C_,top)=>{
    os_binderOpen(ctx,C_,1.2,2.1,top,{pw:0.3,pd:0.4,col:PAL.navy,left:c_=>{Tw(c_,"Policy 12",14.5,7,{w:800,size:3.6,align:"center",color:rgba(PAL.navy,1)});c_.fillStyle=rgba(PAL.navy,0.5);c_.fillRect(5,9.6,19,0.3);
        ["Business terms","are defined","consistently","across the","organisation."].forEach((s,i)=>Tw(c_,s,14.5,15.5+i*4.4,{w:600,size:2.7,align:"center",color:rgba([60,70,100],1)}));},
      right:c_=>{const box=(y0,y1,u,lines)=>{if(u<=0)return;c_.save();c_.globalAlpha*=clamp(u*2,0,1);c_.strokeStyle=rgba(PAL.red,0.8);c_.lineWidth=0.35;c_.setLineDash([1.4,1]);rr(c_,1.8,y0,25.4,y1-y0,1.2);c_.stroke();c_.setLineDash([]);
          lines.forEach((s,i)=>Tw(c_,s,14.5,y0+5.2+i*4.2,{w:800,size:2.6,align:"center",color:rgba(PAL.red,1)}));c_.restore();};
        box(5,14,g1,["who decides?"]);box(18,30,g2,["how does it","reach the work?"]);}});}}});};
  // what governance is for: from the office, gold along every path to the work round the green
  const shotB=(ctx,S,t)=>{const dd=wAt(sc,"for","deciding"),mk=wAt(sc,"for","making");drawCampus(ctx,S,os_cam(P.kB,t),{t,office:{tbc:1},gold:clamp((t-mk+0.2)/3.2,0,1),
    figs:[os_at("jun",t),os_at("mei",t),os_at("sam",t),os_at("clara",t),{id:"yusuf",x:-0.5,z:-2.35,pose:"stand",t}],
    extra:(C_,add)=>{os_tag(C_,v3(0,4.7,0),"deciding who decides",{a:os_io(t,dd-0.1,P.cc+0.2,0.4),size:34});os_tag(C_,v3(0,3.2,9.9),"each decision reaches the work",{a:os_io(t,mk+0.6,P.cc+0.2,0.4),size:34});}});};
  // the 1880s shop again: a rule, a copy where the work happens, someone who checks
  const rule=wAt(sc,"like","a rule"),copy=wAt(sc,"like","a copy"),chk=wAt(sc,"like","someone");
  const shotC=(ctx,S,t)=>{const C=os_cam(P.kC,t),out=P.d+0.3;
    os_market(ctx,S,C,{t,era:1880,shop:{tilt:0,brass:true,crown:1,act:os_io(t,rule-0.1,out,0.4),caseGlow:os_io(t,copy-0.1,out,0.4),strike:0},
      figs:[{id:"inspector",at:"shop",x:0.75,z:1.4,t,flip:true,pose:"hold",carry:heldWeight,onDraw:(c_,B)=>os_figTag(B,"someone who checks",{a:os_io(t,chk,out,0.4),size:30,dy:20})},{id:"grocer",at:"shop",x:-1.4,z:2.6,pose:"listen",t}],
      extra:(C_,add)=>{os_tag(C_,os_shopP(-2.55,2.0,0.36),"a rule",{a:os_io(t,rule,out,0.4),size:30});os_tag(C_,os_shopP(1.75,1.42,1.05),["a copy where","the work happens"],{a:os_io(t,copy,out,0.4),size:30,dx:40,dy:40});},
      after:c_=>os_marker(c_,t,[[0,"England · 1880s"]],os_io(t,P.cc+0.3,out,0.5))});};
  // governance and management: the office that sets the rules and checks, the offices that do the work
  const gv=wAt(sc,"mgmt","Governance"),mg=wAt(sc,"mgmt","Management");
  const shotD=(ctx,S,t)=>{const a=os_in01(t,mg-0.2,0.6);drawCampus(ctx,S,os_cam(P.kD,t),{t,office:{tbc:1},gold:1,glowFront:{platform:a,registrar:a,data:a,planning:a,office:os_in01(t,gv-0.2,0.6)},
    figs:[os_at("jun",t),os_at("mei",t),os_at("sam",t),os_at("clara",t),{id:"yusuf",x:-0.5,z:-2.35,pose:"stand",t}],
    extra:(C_,add)=>{os_tag(C_,v3(0,4.7,0),["governance","sets the rules, checks they're kept"],{a:os_in01(t,gv-0.1,0.4),size:32});os_tag(C_,bldP("platform",0,3.9,1.9),["management","does the work"],{a:os_in01(t,mg-0.1,0.4),size:32});}});};
  os_shots(ctx,S,t,[[0,shotA],[P.b,shotB],[P.cc,shotC],[P.d,shotD]]);});

// ---- 6 · Governance at the centre: DAMA's wheel, drawn on the green ----
scene("wheel",(ctx,S,t,sc)=>{const c=sc.cues,P=os_once(sc,"P",()=>{const d=c.takes-0.3;
    return{d,k:os_keys([[0,v3(0.4,12.6,-12.4),v3(0,0.5,2.5),1350],[c.wheel,v3(0,19,-6.5),v3(0,0,-1.0),905],[d,v3(0.12,18.8,-6.35),v3(0,0,-1.0),905],[sc.dur+0.8,v3(0.6,2.9,-8.2),v3(0,1.25,0),1400]])};});
  const C=os_cam(P.k,t),w0=wAt(sc,"wheel","eleven"),gv=wAt(sc,"wheel","governance"),mt=wAt(sc,"wheel","where"),oth=c.others,dc=wAt(sc,"others","Dee"),iso8=wAt(sc,"others","eight thousand"),iso38=wAt(sc,"others","thirty"),out=c.takes;
  // each area's board dims while the others are named, except the one a standard covers
  const lab=k=>{const dim=os_io(t,oth+0.2,out,0.5)*(k===9?1-os_in01(t,iso8-0.3,0.4):1);return(1-0.62*dim)*(1-os_in01(t,out+0.6,0.6));};
  drawCampus(ctx,S,C,{t,office:{tbc:1},gold:os_in01(t,mt-0.2,2.4)*(1-os_in01(t,out+0.6,0.8)),glowFront:{office:os_io(t,gv-0.2,out+0.6,0.5)},
    figs:[os_at("jun",t),os_at("mei",t),os_at("sam",t),os_at("clara",t)],
    posts:(C_,add)=>{for(let k=0;k<10;k++){const p=os_postP(k,0.8);add(p,ctx=>os_signpost(ctx,C_,k,os_in01(t,w0+k*0.24,0.6),lab(k)));}},
    extra:(C_,add)=>{const fade=1-os_in01(t,out+0.6,0.6);
      os_tag(C_,v3(0,4.9,0),"data governance",{a:os_in01(t,gv-0.1,0.5)*fade*(1-0.62*os_io(t,oth+0.2,iso38-0.3,0.5)),size:34,bg:[255,226,150],rim:[214,160,60],ink:[74,52,20]});
      os_ring(C_,9.92,os_in01(t,dc-0.2,1.4)*(1-os_in01(t,out+0.3,0.5)));
      os_tag(C_,os_postP(9,1.7),"ISO 8000 · data quality",{a:os_io(t,iso8-0.1,out+0.4,0.4),size:30,dx:-330,dy:20,bg:[230,244,236],rim:[96,160,120]});
      os_tag(C_,v3(0,4.9,0),"ISO/IEC 38505 · governing data",{a:os_io(t,iso38-0.1,out+0.4,0.4),size:30,dy:-84,bg:[230,244,236],rim:[96,160,120]});},
    after:c_=>{os_board(c_,W/2,150,["DAMA-DMBOK","the Data Management Body of Knowledge"],{size:30,a:os_io(t,wAt(sc,"body","body")-0.2,w0-0.2,0.5)});
      os_board(c_,1660,150,["DCAM","the same ground"],{size:32,a:os_io(t,dc-0.1,out+0.4,0.4),bg:[230,244,236],rim:[96,160,120]});}});});

// ---- 7 · Listen first: no thirty-fifth policy; one question, asked in every office ----
scene("listen",(ctx,S,t,sc)=>{const c=sc.cues,P=os_once(sc,"P",()=>{const a2=wAt(sc,"ask","He asks")-0.3,b=c.jun-0.6,m=c.mei-0.6,s=c.sam-0.6,p=c.plan-0.6,f=c.binder-0.6,g=c.tools-0.6;
    const room=(id,t0,t1,e,g_,f_)=>os_keys([os_rk(id,t0,e,g_,f_||1200),os_rk(id,t1+0.7,[e[0]+0.05,e[1]-0.05,e[2]+0.35],g_,f_||1200)]);
    return{a2,b,m,s,p,f,g,kA:os_keys([os_rk("office",0,[1.16,1.78,1.62],[1.16,1.06,2.12],1450),os_rk("office",a2+0.7,[1.1,1.9,1.45],[1.12,1.06,2.12],1450)]),
      kA2:os_keys([[a2,v3(0.6,2.3,-7.8),v3(0.1,1.3,-1.6),1400],[b+0.7,v3(0.4,2.2,-7.2),v3(0.1,1.3,-1.6),1400]]),
      kB:room("data",b,m,[0.6,1.95,-2.7],[0.7,1.35,2.2]),kC:room("registrar",m,s,[-0.25,1.9,-2.8],[-0.25,1.4,2.2]),kD:room("platform",s,p,[-0.3,1.95,-2.8],[-0.4,1.5,2.4]),
      kE:room("planning",p,f,[0.1,1.9,-2.8],[0,1.4,2.2]),kF:room("office",f,g,[1.0,1.95,-0.7],[-1.45,1.55,2.2],1250),kG:os_keys([os_rk("data",g,[0.3,2.0,-2.6],[0.4,1.3,2.2],1150),os_rk("data",sc.dur+1,[0.35,1.95,-2.1],[0.4,1.3,2.2],1150)])};});
  // a person's answer, in a bubble from their head
  const ans=(lines,t0,t1,o)=>(c_,B)=>os_say(B,lines,Object.assign({size:32,a:os_io(t,t0,t1,0.4)},o||{}));
  const note={pose:"write",carry:heldNotebook,t};
  // the thirty-fifth policy: a blank page he turns over instead of writing
  const flip=wAt(sc,"ask","doesn't")+0.3;
  const shotA=(ctx,S,t)=>{const th=Math.PI*easeCam(clamp((t-flip)/1.1,0,1));drawCampus(ctx,S,os_cam(P.kA,t),{t,inside:"office",office:{bare:1,tbc:1},ts:[90,990,4],hooks:{officeDesk:(ctx,C_,top)=>{
    os_pen(ctx,C_,1.38,1.98,top);os_pageFlip(ctx,C_,1.0,1.9,1.32,2.32,top,th,c_=>{Tw(c_,"Policy 35",16,6.5,{w:800,size:3.4,align:"center",color:rgba(PAL.navy,1)});c_.fillStyle=rgba(PAL.navy,0.45);c_.fillRect(6,9,20,0.3);});}}});};
  // he goes out with a notebook and one question
  const q=wAt(sc,"ask","what slows");
  const shotA2=(ctx,S,t)=>{const w=along([[0.9,-0.9],[0.5,-2.0],[0.2,-3.0]],t,P.a2+0.2,1.0);drawCampus(ctx,S,os_cam(P.kA2,t),{t,office:{tbc:1},
    figs:[{id:"yusuf",x:w.x,z:w.z,y:os_floor(w.z),hop:w.hop,pose:"hold",carry:heldNotebook,t,onDraw:ans(["What slows you down?"],q-0.1,P.b+0.4,{size:34})}]});};
  const visit=(K,id,who,lines,t0,t1,o,yo,extra)=>(ctx,S,t)=>drawCampus(ctx,S,os_cam(K,t),{t,inside:id,ts:[100,990,4],
    figs:[os_at(who,t,Object.assign({onDraw:ans(lines,t0,t1,o.say)},o.fig)),Object.assign({id:"yusuf",at:id},note,yo)],extra});
  const shotB=visit(P.kB,"data","jun",["The rules arrive","after I've built it."],c.jun+0.2,P.m+0.5,{fig:{x:2.25,z:1.5,pose:"explain",flip:true},say:{left:true}},{x:-1.0,z:1.0});
  const shotC=visit(P.kC,"registrar","mei",["I never see where","my words are used."],c.mei+0.2,P.s+0.5,{fig:{pose:"explain"}},{x:-1.2,z:0.9});
  const shotD=visit(P.kD,"platform","sam",["No one says which","columns are personal."],c.sam+0.2,P.p+0.5,{fig:{x:0.75,z:2.55,pose:"point"},say:{left:true}},{x:-1.45,z:1.0});
  const shotE=visit(P.kE,"planning","clara",["Which number","do I trust?"],c.plan+0.1,P.f+0.5,{fig:{pose:"shrug",expr:"concerned"}},{x:1.2,z:1.0,flip:true});
  // back at the office: the four answers pinned up, beside the shelf the binder came from
  const shotF=(ctx,S,t)=>{const lit=os_io(t,wAt(sc,"binder","weren't")-0.3,P.g+0.6,0.6);drawCampus(ctx,S,os_cam(P.kF,t),{t,inside:"office",ts:[110,980,5],office:{tbc:1,cards:clamp((t-P.f-0.4)/1.8*4,0,4)},
    figs:[{id:"yusuf",x:-2.0,z:0.1,y:0.3,pose:t<P.f+2.4?"reach":"stand",carry:t<P.f+2.4?heldPins:null,flip:true,t}],
    over:(ctx,C_)=>{if(lit>0)glowQuad(ctx,C_,[bldP("office",-2.34,0.3,3.36),bldP("office",-0.49,0.3,3.36),bldP("office",-0.49,2.52,3.36),bldP("office",-2.34,2.52,3.36)],lit);}});};
  // people agree; then a tool carries it out
  const run=wAt(sc,"tools","Tools");
  const shotG=(ctx,S,t)=>drawCampus(ctx,S,os_cam(P.kG,t),{t,inside:"data",ts:[100,990,4],hooks:{dataScreen:c_=>os_testScreen(c_,os_in01(t,run,0.6))},
    figs:[os_at("jun",t,{x:2.25,z:1.5,pose:"listen",nod:0.06*Math.sin(t*3.1)*os_io(t,P.g+0.4,run,0.4)}),{id:"mei",at:"data",x:-0.9,z:1.6,pose:"explain",t},{id:"yusuf",at:"data",x:-1.75,z:0.9,pose:"listen",t,nod:0.05*Math.sin(t*2.7+1)*os_io(t,P.g+0.4,run,0.4)}]});
  os_shots(ctx,S,t,[[0,shotA],[P.a2,shotA2],[P.b,shotB],[P.m,shotC],[P.s,shotD],[P.p,shotE],[P.f,shotF],[P.g,shotG]]);});

// ---- 8 · Where does it run? Every line of the binder, sorted into three trays ----
// the binder's lines, in the order they're sorted: which tray each goes to, and the word it goes on
const OS_SORT=[[0,"runs","required"],[0,"runs","a check"],[0,"runs","a tag"],[0,"runs","a test"],[1,"owned","decisions"],[1,"owned","writes"],[2,"go","go"]];
scene("runs",(ctx,S,t,sc)=>{const c=sc.cues,P=os_once(sc,"P",()=>{const b=c.runs-0.6;
    return{b,when:OS_SORT.map(([k,id,w])=>wAt(sc,id,w)-0.5),kA:os_keys([os_rk("office",0,[0.75,2.15,-1.4],[1.05,1.3,2.3],1350),os_rk("office",b+0.7,[0.85,2.05,-0.9],[1.05,1.25,2.3],1350)]),
      kB:os_keys([os_rk("office",b,[1.32,1.98,1.02],[1.32,1.06,2.2],1300),os_rk("office",sc.dur+1,[1.32,1.92,1.2],[1.32,1.06,2.2],1300)])};});
  const y0=1.06,where=wAt(sc,"takes","where");
  // the desk: the open binder, its lines marked as they're sorted, the three trays and the pages flying into them
  const desk=(ctx,C_,top,t)=>{const fly=P.when.map(w=>clamp((t-w)/0.8,0,1)),n=[0,0,0];OS_SORT.forEach(([k],i)=>{if(fly[i]>=1)n[k]++;});
    OS_TRAYS.forEach((tr,k)=>os_tray(ctx,C_,tr.x,2.36,top,tr.col,n[k]));
    os_binderOpen(ctx,C_,1.32,1.97,top,{pw:0.24,pd:0.36,col:PAL.navy,left:c_=>{Tw(c_,"Policy 12",12,6,{w:800,size:3,align:"center",color:rgba(PAL.navy,1)});for(let i=0;i<6;i++){c_.fillStyle="rgba(150,150,170,0.6)";c_.fillRect(3,11+i*3.6,18-(i%3===2?6:0),0.6);}},
      right:c_=>OS_SORT.forEach(([k],i)=>{const y=5+i*4.4,u=clamp((t-P.when[i]+0.2)/0.4,0,1);c_.fillStyle="rgba(150,150,170,0.6)";c_.fillRect(5,y,15-(i%2?4:0),0.7);
        if(u>0){c_.fillStyle=rgba(OS_TRAYS[k].col,u);c_.beginPath();c_.arc(2.6,y+0.35,1.1*(0.6+0.4*spring(u)),0,TAU);c_.fill();}})});
    OS_SORT.forEach(([k],i)=>os_flyPage(ctx,C_,bldP("office",1.44,top+0.02,1.97),bldP("office",OS_TRAYS[k].x,top+0.03,2.36),fly[i],0.3));};
  const shotA=(ctx,S,t)=>drawCampus(ctx,S,os_cam(P.kA,t),{t,inside:"office",office:{bare:1,tbc:1,cards:4},ts:[110,980,5],
    hooks:{officeDesk:(ctx,C_,top)=>desk(ctx,C_,top,t)},figs:[{id:"yusuf",x:-0.12,z:0.1,y:0.3,pose:"listen",t}],
    after:c_=>os_board(c_,1190,190,"Where does it run?",{size:44,a:os_io(t,where-0.1,P.b+0.9,0.5),bg:[255,236,200],rim:[214,150,80]})});
  // over each tray, its name when the voice says it, and above that what goes in it, a line at a time
  const T8=os_once(sc,"T",()=>[{name:wAt(sc,"runs","run")-0.1,items:[["a required field",wAt(sc,"runs","required")],["a check",wAt(sc,"runs","a check")],["a tag",wAt(sc,"runs","a tag")],["a test",wAt(sc,"runs","a test")]]},
    {name:wAt(sc,"owned","decisions")-0.1,items:[["award mapping",wAt(sc,"owned","owns")],["owner: Mei · 14 Oct",wAt(sc,"owned","writes")]]},{name:wAt(sc,"go","go")-0.2,items:[]}]);
  const shotB=(ctx,S,t)=>drawCampus(ctx,S,os_cam(P.kB,t),{t,inside:"office",office:{bare:1,tbc:1,cards:4},ts:[90,990,4],hooks:{officeDesk:(ctx,C_,top)=>desk(ctx,C_,top,t)},
    extra:(C_,add)=>OS_TRAYS.forEach((tr,k)=>{const q=T8[k],a=os_in01(t,q.name,0.4);if(a<=0)return;const p=bldP("office",tr.x,y0+0.08,2.44),bg=mix(tr.col,[255,255,255],0.84);
      os_tag(C_,p,tr.name,{a,size:30,bg,rim:tr.col,dy:24});const it=q.items.filter(([,w])=>t>=w).map(([s_])=>s_);if(it.length)os_tag(C_,p,it,{size:28,pop:false,bg:[255,252,244],rim:tr.col,dy:24+64});})});
  os_shots(ctx,S,t,[[0,shotA],[P.b,shotB]]);});

// ---- 9 · Where decisions enter: the data team's loop, and a pin at the right steps ----
scene("enter",(ctx,S,t,sc)=>{const c=sc.cues,P=os_once(sc,"P",()=>{const b=c.pin-0.6;
    return{b,pins:OS_PINS.map(([i,lab])=>wAt(sc,"pins",lab[0])-0.15),kA:os_keys([[0,bldP("data",-0.2,3.4,-7.6),bldP("data",-0.5,1.2,2.5),1300],[b+0.7,bldP("data",-0.5,2.1,-1.9),bldP("data",-0.8,1.7,3.8),1300]]),
      kB:os_keys([[b,bldP("data",-1.32,1.86,0.45),bldP("data",-1.32,1.86,3.8),1250],[sc.dur+1,bldP("data",-1.32,1.86,0.85),bldP("data",-1.32,1.86,3.8),1250]])};});
  const X0=-2.45,Y0=0.98,X1=-0.2,Y1=2.72,Z=4-0.2-0.03;
  // Yusuf brings a box of pins to the data team; Jun's at his desk, the poster of their loop on the wall
  const shotA=(ctx,S,t)=>{const w=along([[-1.0,-3.6],[-1.7,-1.2],[-2.0,1.0]],t,0.6,1.0),lp=wAt(sc,"loop","loop");
    drawCampus(ctx,S,os_cam(P.kA,t),{t,inside:t>P.b-1.5?"data":null,data:{loopHi:os_io(t,lp-0.2,P.b+0.6,0.5)},
      figs:[Object.assign({id:"yusuf",at:"data",x:w.x,z:w.z,hop:w.hop,pose:"hold",carry:heldPins,t},w.z<0?{at:null,x:bldP("data",w.x,0,w.z).x,z:bldP("data",w.x,0,w.z).z}:{}),os_at("jun",t,{x:0.5,z:0.95,pose:"listen"})],
      extra:(C_,add)=>os_tag(C_,bldP("data",-1.32,2.8,3.75),"a loop of ten steps",{a:os_io(t,lp,P.b+0.4,0.4),size:32})});};
  // the poster, close: a pin at each step where a decision enters, with what's pinned there
  const shotB=(ctx,S,t)=>drawCampus(ctx,S,os_cam(P.kB,t),{t,inside:"data",ts:[80,1000,3],
    extra:(C_,add)=>OS_PINS.forEach(([i,lab],k)=>{const u=os_in01(t,P.pins[k],0.5);if(u<=0)return;const an=-Math.PI/2+i/10*TAU,q=loopPos(i,X0,Y0,X1,Y1,Z-0.01),p=bldP("data",q.x,q.y,q.z),rim=bldP("data",q.x+Math.cos(an)*0.155,q.y-Math.sin(an)*0.155,q.z);
      os_stepRing(C_,p,0.195,u);os_pinQ(C_,rim,u);os_tag(C_,p,lab,{a:u,size:30,dx:Math.cos(an)*190,dy:-Math.sin(an)*96+18,bg:[255,236,190],rim:[214,160,60]});})});
  os_shots(ctx,S,t,[[0,shotA],[P.b,shotB]]);});

// ---- 10 · The series: the binders still on the shelf, the films on the tools, and the policy taken to the work ----
scene("series",(ctx,S,t,sc)=>{const c=sc.cues,P=os_once(sc,"P",()=>{const b=c.tools-0.6,w=c.wish-0.6,n0=wAt(sc,"next","nine")-0.1,tk=wAt(sc,"next","takes")-0.2;
    return{b,w,tk,slide:OS_SHELF9.map((_,k)=>n0+k*0.24),cards:OS_TOOLS.map((_,k)=>wAt(sc,"tools","six")-0.1+k*0.3),
      kA:os_keys([os_rk("office",0,[-0.55,1.6,0.0],[-1.95,1.4,3.2],1050),os_rk("office",b+0.7,[-0.6,1.6,0.45],[-1.95,1.4,3.2],1050)]),
      kB:os_keys([os_rk("data",b,[1.25,2.4,0.35],[1.25,1.95,3.77],2050),os_rk("data",w+0.7,[1.25,2.38,0.6],[1.25,1.95,3.77],2050)]),
      kC:os_keys([[w,v3(-3.2,4.6,-10.5),v3(1.6,0.8,-1.4),1050],[sc.dur+1,v3(-2.4,10.5,-14.5),v3(4.2,0.4,1.6),1000]])};});
  // the shelf: nine binders come forward, one for each film on a kind of policy; Yusuf takes the first
  const shotA=(ctx,S,t)=>{const u=P.slide.map(t0=>os_in01(t,t0,0.45)),took=t>P.tk+0.9,hi=os_in01(t,P.tk+0.9,0.4);
    drawCampus(ctx,S,os_cam(P.kA,t),{t,inside:"office",ts:[110,980,5],office:{tbc:1,shelfSkip:(r,j)=>(r===2&&j===4)||(took&&r===2&&j===9),
        shelfOut:(r,j)=>{const k=OS_SHELF9.findIndex(([a,b_])=>a===r&&b_===j);return k<0?0:0.09*easeCam(u[k])+(k===0?0.1*os_in01(t,P.tk+0.3,0.6):0);}},
      figs:[{id:"yusuf",at:"office",x:-0.45,z:2.7,pose:t>P.tk&&!took?"reach":took?"hold":"stand",flip:true,carry:took?os_heldTitled(["Who","decides"],PAL.gold):null,t}],
      over:(ctx,C_)=>{const M_=MX;mxSet(BLDI.office.x,BLDI.office.z,BLDI.office.ang);OS_SHELF9.forEach(([r,j],k)=>{if(u[k]<=0||(k===0&&t>P.tk-0.1))return;os_binderTag(ctx,C_,r,j,0.09*easeCam(u[k]),k+2,u[k]);});MX=M_;},
      after:c_=>os_needsList(c_,74,96,u,hi,os_in01(t,P.slide[0]-0.3,0.5))});};
  // the data team's board: six cards, one for each film on the tools
  const shotB=(ctx,S,t)=>drawCampus(ctx,S,os_cam(P.kB,t),{t,inside:"data",ts:[80,1000,3],hooks:{dataBoard:(ctx,C_,z)=>OS_TOOLS.forEach((_,k)=>{const u=os_in01(t,P.cards[k],0.45);if(u<=0)return;
      const col=k%3,row=(k/3)|0,x0=0.13+col*0.785,y1=2.6-row*0.66,lift=(1-spring(u))*0.05;surfDraw(ctx,C_,v3(x0,y1+lift,z-0.004),v3(1,0,0),v3(0,1,0),c_=>os_toolCard(c_,k,u));
      const p=pj(C_,v3(x0+0.35,y1-0.03+lift,z-0.008));if(p.z>NEAR){ctx.fillStyle=rgba([200,70,60],1);ctx.beginPath();ctx.arc(p.x,p.y,Math.max(3,0.016*p.s),0,TAU);ctx.fill();}})},
    after:c_=>os_board(c_,W/2,128,"With the tools",{size:34,a:os_in01(t,P.cards[0]-0.2,0.5),bg:[236,244,255],rim:[90,130,200],ink:[40,60,110]})});
  // the policy leaves the shelf: Yusuf takes it out across the green, to where the work is done
  const shotC=(ctx,S,t)=>{const wk=along([[0.5,-2.35],[2.4,-2.6],[3.9,0.0],[6.4,2.1]],t,P.w+0.2,1.05);
    drawCampus(ctx,S,os_cam(P.kC,t),{t,office:{tbc:1},figs:[{id:"yusuf",x:wk.x,z:wk.z,y:os_floor(wk.z),hop:wk.hop,pose:"hold",carry:os_heldTitled(["Who","decides"],PAL.gold),t}],
      after:c_=>os_card(c_,os_in01(t,c.breath-0.2,0.8),["Off the shelf",110],"A policy that doesn't run anywhere is a wish.","Film 1 of 16 · data governance")});};
  os_shots(ctx,S,t,[[0,shotA],[P.b,shotB],[P.w,shotC]]);});
