/* ===== Ideas that last, features you test: the scenes =====
   Five chapters, each timed to its narration: wAt(sc, "line", "word") is the moment a word is said. The opening moves between two
   places of the 1940s and 1950s, each painted once (a wheat field in Sonora at dusk, and the map of Mexico), and comes to the
   university's night map for its last line and the title card. The three chapters after it stay in one room, the map, where the camera
   holds and only what changes fades; each opens on the one before (ag_cutInto). The last goes back to the field, now a harvest, then to
   the map for its end. Words over the field and the map of Mexico are drawn in the frame itself (il_scr), so they stay put while the
   camera moves. */

// the film's name at the top left, and the chapter's case under it
function il_top(ctx,a){md_label(ctx,96,100,"Ideas that last, features you test",{col:MD.soft,a});}
function il_case(ctx,text,a,col){md_tag(ctx,96,166,text,{col:col||MD.soft,a});}
// a person, faded as one picture
function il_who(ctx,who,x,y,s,a,o){if(a<=0.004)return null;let h=null;withA(ctx,a,()=>{h=md_person(ctx,who,x,y,s,o);});return h;}
// a lane of the map's light from a to b, drawn as far as u, with what moves along it
function il_link(ctx,pts,u,t,o){o=o||{};if(u<=0)return;md_lane(ctx,pts,o.col||MD.flow,o.a==null?0.85:o.a,{u,dash:o.dash,t});
  if(u>=1&&o.flow!==false)md_flow(ctx,pts,t,{kind:o.kind||"events",col:o.col||MD.flow,a:o.a==null?1:o.a,every:o.every||1.1,off:o.off||0});}
// a line struck through a card, drawn from its left as u goes from 0 to 1
function il_strike(ctx,x0,y0,x1,y1,u,a){if(u<=0||a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(MD.fail,0.95);ctx.lineWidth=5;ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(lerp(x0,x1,ag_eo(u)),lerp(y0,y1,ag_eo(u)));ctx.stroke();ctx.restore();}
// the loop: a ring of the map's light round (cx, cy), drawn as far as u, and its four steps at the top, right, bottom and left, each lit
// while its line is said (lit: the index, or -1)
const IL_STEPS=["Investigate","Adapt","Implement","Iterate"];
function il_loop(ctx,t,cx,cy,R,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const ring=[];for(let i=0;i<=72;i++){const an=-Math.PI/2+i/72*TAU;ring.push([cx+Math.cos(an)*R,cy+Math.sin(an)*R]);}
  const u=o.u==null?1:o.u;md_lane(ctx,ring,MD.flow,0.8*a,{u,t});if(u>=1)md_flow(ctx,ring,t,{kind:"events",col:MD.flow,a,every:o.every||0.9});
  const P_=[[cx,cy-R],[cx+R,cy],[cx,cy+R],[cx-R,cy]];
  IL_STEPS.forEach((s,i)=>{const q=a*(o.stepA?o.stepA(i):1);if(q<=0)return;const lit=o.lit===i,b=md_tag(ctx,P_[i][0],P_[i][1],s,{align:"center",col:lit?MD.agreed:MD.flow,a:q});
    if(lit)glow(ctx,P_[i][0],P_[i][1],b.w*0.7,MD.agreed,0.25*q);});}
// a small card with an icon and words that wrap to its width, at 30 px; returns its height
function il_idea(ctx,x,y,w,text,o){o=o||{};const a=o.a==null?1:o.a,lines=md_wrap(ctx,text,w-96,{w:600,size:30}),h=30+lines.length*40;if(a<=0.004)return h;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,ag_spr(o.k,0,0.5)));md_card(ctx,x,y,w,h,{edge:o.edge||null,glow:0.5});
  md_icon(ctx,o.icon||"tick",x+40,y+h/2,30,o.edge||MD.soft);lines.forEach((l,i)=>md_T(ctx,l,x+72,y+50+i*40,{w:600,size:30,col:o.col||MD.ink}));ctx.restore();return h;}

/* ---------------------------------------------------------------- 1 · Two harvests a year */
const IL_LOST=[["A year's work, lost","clock"],["The seed, lost","warn"],["Wheat bought from abroad","share"]];
scene("seasons",(ctx,S,t,sc)=>{const c=sc.cues,T=il_once(sc,"T",()=>({
    mexico:wAt(sc,"place","Mexico"),yaqui:wAt(sc,"place","Yaqui Valley"),hardly:wAt(sc,"place","hardly grew wheat"),
    rust:wAt(sc,"rust","Stem rust"),fungus:wAt(sc,"rust","a fungus"),chokes:wAt(sc,"rust","chokes the plant"),whole:wAt(sc,"rust","a whole field"),
    one:wAt(sc,"field","One field"),ten:wAt(sc,"field","ten bushels"),poor:wAt(sc,"field","a poor harvest"),
    farmer:wAt(sc,"lost","For a farmer"),work:wAt(sc,"lost","a year's work"),seed:wAt(sc,"lost","seed lost"),abroad:wAt(sc,"lost","from abroad"),
    breeding:wAt(sc,"slow","breeding a wheat"),gen:wAt(sc,"slow","one generation a year"),years:wAt(sc,"slow","many years"),farm:wAt(sc,"slow","reached a farm"),
    y1945:wAt(sc,"team","nineteen forty-five"),ministry:wAt(sc,"team","Ministry of Agriculture"),borlaug:wAt(sc,"team","Norman Borlaug"),another:wAt(sc,"team","another way"),
    twoGen:wAt(sc,"two","two generations a year"),summer:wAt(sc,"two","in summer"),highlands:wAt(sc,"two","the highlands"),winter:wAt(sc,"two","in winter"),north:wAt(sc,"two","far to the north"),
    crossed:wAt(sc,"each","crossed plants"),tested:wAt(sc,"each","tested them"),kept:wAt(sc,"each","kept the few"),sowed:wAt(sc,"each","sowed those"),
    said:wAt(sc,"dogma","Many breeders said"),only:wAt(sc,"dogma","only where it would grow"),anyway:wAt(sc,"dogma","tried it anyway"),measured:wAt(sc,"dogma","measured"),
    half:wAt(sc,"half","in half"),both:wAt(sc,"half","both places"),beyond:wAt(sc,"half","far beyond"),
    y1956:wAt(sc,"enough","nineteen fifty-six"),needed:wAt(sc,"enough","all the wheat it needed"),twenty:wAt(sc,"enough","first twenty years"),tripled:wAt(sc,"enough","tripled"),
    never:wAt(sc,"kept","never stopped"),changing:wAt(sc,"kept","the rust kept changing"),too:wAt(sc,"kept","change too"),
    platforms:wAt(sc,"same","Data platforms"),month:wAt(sc,"same","every month"),lasts:wAt(sc,"same","What lasts"),test:wAt(sc,"same","a quick, honest way")}));
  const map0=T.twoGen-1.0,uni0=T.platforms-0.9;
  // the rust spreads from the field's right, and the stalks it reaches bow over a little later
  const rustOf=s=>il_rustAt(s,t,T.rust-0.4,1500,900,170),bowOf=s=>clamp((il_rustAt(s,t,T.rust-0.4,1500,900,170)-0.75)*4,0,1)*ag_in(t,T.whole-0.3,1.6);
  ag_shots(ctx,S,t,sc.dur,[
    // the Yaqui Valley at dusk: the wheat, then the rust spreading through it; the field's poor harvest, what it cost, and how slow a cure was;
    // and the people of the program in the field, each holding a stalk
    {at:0,place:"ilField",keys:[[0,960,500,1.0],[T.rust-0.6,1240,700,1.4],[T.farmer-0.2,960,540,1.0]],d:2.4,push:0.015,draw:(cx,tt)=>{
      il_field(cx,tt,{band:0,rust:rustOf,bow:bowOf,wind:0.8,a:1});
      il_scr(cx,S,()=>{const lA=ag_io(tt,0.5,T.rust-0.8,0.7);md_label(cx,96,118,"Sonora, Mexico, 1944",{col:MD.soft,a:lA});md_T(cx,"The Yaqui Valley",96,166,{w:700,size:36,a:lA*ag_in(tt,T.yaqui-0.3,0.7)});
        md_tag(cx,96,240,"Hardly any wheat grown",{col:MD.soft,a:lA*ag_in(tt,T.hardly-0.2,0.5)});
        md_tag(cx,1240,180,"Stem rust · a fungus",{col:IL.rust,icon:"warn",a:ag_io(tt,T.fungus-0.3,c.field-1.0,0.5)});
        md_tag(cx,1240,262,"It chokes the plant",{col:IL.rust,a:ag_io(tt,T.chokes-0.2,c.field-1.0,0.5)});
        // one field's expected harvest
        const fA=ag_io(tt,T.one-0.3,c.lost-1.0,0.5);md_textCard(cx,1180,170,640,{kick:"One field, 1944",title:"Expected: 10 bushels an acre",sub:"A poor harvest for a season's work"},{edge:MD.fail,icon:"warn",a:fA,k:il_k(tt,T.one-0.3)});
        // what it cost: the farmer, and the country
        IL_LOST.forEach(([s,ic],i)=>md_tag(cx,1240,200+i*92,s,{col:MD.ink,icon:ic,a:ag_io(tt,[T.work,T.seed,T.abroad][i]-0.25,c.slow-1.0,0.4)}));
        // one generation a year: ten years, and many before a new wheat reaches a farm
        const gA=ag_io(tt,c.slow-0.2,c.change+0.2,0.5);if(gA>0){md_card(cx,1080,170,740,300,{edge:MD.flow,a:gA,glow:0.5});md_T(cx,"ONE GENERATION A YEAR",1108,222,{w:800,size:28,ls:4,col:MD.flow,a:gA});
          for(let i=0;i<10;i++){const q=gA*ag_in(tt,T.gen+i*0.32,0.3);il_stalk(cx,1130+i*68,404,118,{a:q,sway:0.04*Math.sin(tt*1.2+i),leaf:i%2?1:-1,lit:1.3});md_T(cx,String(i+1),1130+i*68,440,{w:600,size:28,align:"center",col:MD.soft,a:q});}
          md_T(cx,"Years, one harvest each",1108,268,{w:500,size:28,col:MD.soft,a:gA*ag_in(tt,T.years-0.3,0.5)});}
        md_tag(cx,1450,520,"Many years to reach a farm",{align:"center",col:MD.wait,icon:"clock",a:ag_io(tt,T.farm-0.3,c.change+0.2,0.5)});
        // the program: a plant breeder and a young agronomist, among the stalks
        const pA=ag_in(tt,c.team-0.4,0.8);if(pA>0){withA(cx,pA,()=>il_period(cx,"breeder",300,590,0.98,{t:tt,gaze:[3,0]}));withA(cx,pA,()=>il_period(cx,"agronomist",1620,590,0.98,{t:tt,gaze:[-3,0],flip:true}));
          md_nameTag(cx,420,400,IL_P.breeder,{col:MD.agreed,a:pA*ag_in(tt,T.borlaug-0.3,0.5)});md_nameTag(cx,1500,400,IL_P.agronomist,{align:"right",col:MD.agreed,a:pA*ag_in(tt,T.borlaug+0.4,0.5)});
          md_textCard(cx,700,170,520,{kick:"From 1945",title:"Mexico's wheat program",sub:"Its Ministry of Agriculture"},{edge:MD.agreed,a:pA*ag_in(tt,T.ministry-0.4,0.5),k:il_k(tt,T.ministry-0.4)});}});
}},
    // the map of Mexico: two places, two generations a year; the seed carried between them; the plots, crossed, tested, the best kept; the
    // breeders who said it couldn't work; half the time; Mexico's own wheat by 1956, the harvest tripled; and the rust that kept changing
    {at:map0,place:"ilMexico",dis:0.9,keys:[[0,920,560,1.0]],push:0.015,draw:(cx,tt,cam)=>{
      const arc=il_arc(),sA=ag_in(tt,T.summer-0.3,0.6),wA=ag_in(tt,T.winter-0.3,0.6);
      il_site(cx,"toluca",{cam,a:sA,lit:ag_io(tt,T.summer-0.2,T.winter-0.2,0.5),name:"The highlands, in summer",sub:"Near Mexico City",col:MD.agreed});
      il_site(cx,"sonora",{cam,a:wA,lit:ag_io(tt,T.winter-0.2,T.crossed,0.5),name:"Sonora, in winter",sub:"Far to the north",col:MD.agreed,dy:-6});
      // the way between them, and the seed carried along it: each season's best, sown in the other place
      const lu=ag_sine((tt-T.twoGen+0.2)/1.4);il_link(cx,arc,lu,tt,{col:MD.agreed,a:0.75*Math.min(sA+wA,1),flow:false,dash:true});
      const trip=(t0,back)=>{const u=ag_sine((tt-t0)/2.0);if(u<=0||u>=1)return;const p=at(mk(arc.map(q=>P(q[0],q[1]))),back?1-u:u);il_packet(cx,p.x,p.y,58,{a:Math.min(1,Math.sin(Math.PI*u)*2.5)});};
      trip(T.summer+0.4,false);trip(T.winter+0.6,true);trip(T.sowed-0.2,false);trip(T.both-0.4,true);trip(T.changing-0.2,false);trip(T.too+0.8,true);
      il_scr(cx,S,()=>{md_label(cx,96,118,"Mexico, from 1945",{col:MD.soft,a:ag_in(tt,map0+0.3,0.6)});
        const gA=0.75*ag_in(tt,map0+0.4,0.8);md_T(cx,"United States",900,150,{w:500,size:28,col:MD.soft,a:gA});md_T(cx,"Gulf of Mexico",1330,690,{w:500,size:28,col:MD.soft,a:gA});md_T(cx,"Pacific Ocean",360,760,{w:500,size:28,col:MD.soft,a:gA});
        md_tag(cx,96,186,"Two generations a year",{col:MD.agreed,icon:"refresh",a:ag_in(tt,T.twoGen-0.2,0.5)});
        // the plots: crossed, tested, the few that did best kept (green), the rest let go
        const pA=ag_io(tt,c.each-0.4,c.dogma-1.0,0.5);if(pA>0){md_card(cx,1240,150,600,450,{a:pA});md_T(cx,"EACH SEASON",1268,202,{w:800,size:28,ls:4,col:MD.soft,a:pA});
          const r=ag_rnd(56);for(let j=0;j<2;j++)for(let i=0;i<7;i++){const k=j*7+i,keep=[3,9].includes(k),x=1300+i*78,y=410+j*110,q=pA*ag_in(tt,T.crossed+k*0.05,0.3),dimK=keep?0:ag_in(tt,T.kept-0.2,0.6);
            cx.save();cx.globalAlpha*=q*0.6;cx.fillStyle="rgba(60,44,34,0.9)";cx.beginPath();cx.ellipse(x,y+40,30,7,0,0,TAU);cx.fill();cx.restore();
            il_stalk(cx,x-8,y+40,96,{a:q*(1-0.65*dimK),sway:0.05*Math.sin(tt*1.4+k),rust:keep?0:0.6*ag_in(tt,T.tested,0.8)*r(),leaf:1,lit:1.2});il_stalk(cx,x+8,y+40,84,{a:q*(1-0.65*dimK),sway:-0.04+0.05*Math.sin(tt*1.2+k),rust:keep?0:0.5*ag_in(tt,T.tested,0.8)*r(),lit:1.2});
            if(keep){const kA=q*ag_in(tt,T.kept-0.1,0.5);if(kA>0){cx.save();cx.globalAlpha*=kA;cx.strokeStyle=rgba(MD.pass,0.95);cx.lineWidth=3.5;cx.beginPath();cx.arc(x,y-4,52,0,TAU);cx.stroke();cx.restore();}}}
          [["Crossed",T.crossed],["Tested",T.tested],["The best kept",T.kept]].forEach(([s,a_],i)=>md_T(cx,s,1268+i*186,262,{w:600,size:28,col:i===2?MD.pass:MD.ink,a:pA*ag_in(tt,a_-0.2,0.4)}));
          md_tag(cx,1540,636,"Sown in the other place",{align:"center",col:MD.agreed,a:pA*ag_in(tt,T.sowed-0.2,0.5)});}
        // the breeders who said it couldn't work, and the team that measured
        const dA=ag_io(tt,c.dogma-0.3,c.half-1.0,0.5);md_textCard(cx,1240,170,600,{kick:"Many breeders said",title:"Breed a wheat only where it will grow"},{edge:MD.soft,a:dA,k:il_k(tt,c.dogma-0.3)});
        md_tag(cx,1300,420,"Tried anyway, and measured",{col:MD.pass,icon:"tick",a:dA*ag_in(tt,T.measured-0.4,0.5)});
        // half the time to breed a new wheat
        const hA=ag_io(tt,c.half-0.3,c.enough-1.0,0.5);if(hA>0){md_card(cx,1180,170,660,300,{edge:MD.pass,a:hA,glow:0.5});md_T(cx,"YEARS TO BREED A NEW WHEAT",1208,222,{w:800,size:28,ls:4,col:MD.pass,a:hA});
          const b1=600,b2=lerp(600,300,ag_sine((tt-T.half+0.3)/1.0));cx.save();cx.globalAlpha*=hA;cx.fillStyle=rgba(MD.soft,0.55);rr(cx,1208,262,b1,30,15);cx.fill();cx.fillStyle=rgba(MD.pass,0.9);rr(cx,1208,360,b2,30,15);cx.fill();cx.restore();
          md_T(cx,"One generation a year",1208,330,{w:500,size:28,col:MD.soft,a:hA});md_T(cx,"Two a year: half the time",1208,428,{w:600,size:28,col:MD.pass,a:hA*ag_in(tt,T.half-0.2,0.5)});}
        md_tag(cx,1510,520,"Grew well in both places, and beyond",{align:"center",col:MD.pass,icon:"tick",a:ag_io(tt,T.both-0.3,c.enough-1.0,0.5)});
        // by 1956, all the wheat Mexico needed; in twenty years, the harvest tripled
        const eA=ag_io(tt,c.enough-0.3,c.kept-1.0,0.5);md_textCard(cx,1180,150,660,{kick:"By 1956",title:"All the wheat Mexico needed"},{edge:MD.pass,icon:"tick",a:eA,k:il_k(tt,T.y1956-0.3)});
        const tA=eA*ag_in(tt,T.twenty-0.3,0.5);if(tA>0){md_card(cx,1180,350,660,250,{a:tA});md_T(cx,"THE HARVEST, FIRST TWENTY YEARS",1208,402,{w:800,size:28,ls:4,col:MD.soft,a:tA});
          [[1,"Year 1"],[3,"Year 20"]].forEach(([m,s],i)=>{const g=ag_sine((tt-T.twenty-0.2-i*0.6)/1.0)*(i?ag_in(tt,T.tripled-0.6,0.2):1),x=1260+i*300,hh=40*m*g;
            cx.save();cx.globalAlpha*=tA;cx.fillStyle=rgba(i?MD.pass:MD.soft,i?0.9:0.6);rr(cx,x,560-hh,120,hh,8);cx.fill();cx.restore();md_T(cx,s,x+60,592,{w:500,size:28,align:"center",col:MD.soft,a:tA});});
          md_T(cx,"× 3",1700,520,{w:800,size:48,col:MD.pass,a:tA*ag_in(tt,T.tripled-0.2,0.4)});}
        // and the testing never stopped: the rust kept changing
        const kA=ag_io(tt,c.kept-0.3,uni0+0.2,0.5);md_tag(cx,1240,200,"The rust kept changing",{col:IL.rust,icon:"warn",a:kA*ag_in(tt,T.changing-0.3,0.5)});
        md_tag(cx,1240,282,"So the testing never stopped",{col:MD.flow,icon:"refresh",a:kA*ag_in(tt,T.never-0.3,0.5)});});}},
    // today: the university's map, its tools always changing; what lasts, the ideas and a quick, honest test
    {at:uni0,place:"map",dis:0.9,keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
      const ch=["New feature","New name","New limit","New option","New screen","New default"];
      ch.forEach((s,i)=>{const t0=T.month-0.6+i*0.42,q=ag_io(tt,t0,t0+1.5,0.3)*(1-ag_in(tt,T.lasts-0.4,0.4));if(q<=0)return;md_tag(cx,[300,1380,520,1240,360,1500][i],[300,330,720,660,520,520][i],s,{col:MD.soft,a:q});});
      md_pill(cx,960,430,"The ideas",{col:MD.agreed,icon:"person",a:ag_in(tt,T.lasts-0.2,0.5),k:il_k(tt,T.lasts-0.2)});
      md_pill(cx,960,560,"A quick, honest test",{col:MD.flow,icon:"refresh",a:ag_in(tt,T.test-0.2,0.5),k:il_k(tt,T.test-0.2)});}}
  ],0.9);
  md_title(ctx,S,t,c.breath,"Ideas that last, features you test","What the module taught, and how to keep up","Documents and closing remarks · Modern data basics");});

/* ---------------------------------------------------------------- 2 · What the module showed */
// the four series, and what each one showed, line by line
const IL_SERIES=[["Data that moves",[["Agree what each field means","moves"],["As fresh as the business acts","fresh"],["Written once, read by all","once"]]],
  ["Data as software",[["Tested, reviewed, released","software"],["The platform watches; a person decides","watches"]]],
  ["From tables to decisions",[["Answers on demand","tables"],["Each measure defined in the open","tables"],["Every reader reads as itself","readers"]]],
  ["Documents and closing remarks",[["Read it, keep it, or write it as data","docs"]]]];
scene("recap",(ctx,S,t,sc)=>{const c=sc.cues,T=il_once(sc,"T",()=>({
    walk:wAt(sc,"walk","walked"),born:wAt(sc,"walk","where data is born"),reads:wAt(sc,"walk","who reads it"),
    dtm:wAt(sc,"moves","Data that moves"),fresh:wAt(sc,"fresh","How fresh"),acts:wAt(sc,"fresh","acts on it"),day:wAt(sc,"fresh","a day old"),
    das:wAt(sc,"software","Data as software"),ftd:wAt(sc,"tables","From tables to decisions"),open:wAt(sc,"tables","defined in the open"),
    docs:wAt(sc,"docs","Documents and closing remarks"),older:wAt(sc,"older","older than the tools")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"map",keys:[[0,960,540,1.0]],push:0.012,draw:(cx,tt)=>{
    // the platform's map, walked from where data is born to who reads it
    const mA=ag_in(tt,0.1,0.6)*(1-ag_in(tt,c.moves-0.8,0.6));
    md_map(cx,tt,{a:mA,lit:tt<T.born-0.2?null:tt<T.reads-0.2?["hr","fin","sis","lms"]:tt<c.moves-0.8?["fabric","genie","dash","apps"]:null});
    // then the four series, in columns, each lit as it's named, its ideas under it
    const sA=ag_in(tt,c.moves-0.5,0.6);if(sA<=0)return;il_top(cx,sA);il_case(cx,"Modern data basics · four series",sA,MD.ink);
    const at0=[T.dtm,T.das,T.ftd,T.docs];
    IL_SERIES.forEach(([name,ideas],i)=>{const x=72+i*450,q=sA*ag_in(tt,at0[i]-0.4,0.5),on=i<3?ag_in(tt,at0[i]-0.3,0.4)*(1-ag_in(tt,at0[i+1]-0.3,0.4)):ag_in(tt,at0[i]-0.3,0.4);
      md_textCard(cx,x,270,420,{kick:"Series "+(i+1),title:name},{edge:mix(MD.dim,MD.flow,Math.max(on,0.35)),a:q,k:il_k(tt,at0[i]-0.4)});
      let y=470;ideas.forEach(([s,lid],j)=>{const t0=lid==="tables"?(j?T.open:T.ftd):c[lid];const h=il_idea(cx,x,y,420,s,{a:sA*ag_in(tt,t0-0.2+(lid===ideas[0][1]&&j?0.4:0),0.5),edge:MD.flow,icon:"tick",k:il_k(tt,t0-0.2)});y+=h+16;});});
    md_pill(cx,960,836,"Each idea is older than the tools that showed it",{col:MD.agreed,icon:"person",a:ag_in(tt,T.older-0.3,0.5),k:il_k(tt,T.older-0.3)});}}],0.6);});

/* ---------------------------------------------------------------- 3 · Why the films stay light */
const IL_SLOW=[["Agree what data means","person"],["Test it","tick"],["Govern it","lock"],["Serve it when the business acts","clock"]];
const IL_FAST=["New feature","New name","New limit","New option","New screen","New default","New price"];
scene("light",(ctx,S,t,sc)=>{const c=sc.cues,T=il_once(sc,"T",()=>({
    fast:wAt(sc,"fast","change fast"),feat:wAt(sc,"fast","new features"),names:wAt(sc,"fast","new names"),limits:wAt(sc,"fast","new limits"),
    button:wAt(sc,"date","every button"),months:wAt(sc,"date","within months"),
    slowly:wAt(sc,"slow","changes slowly"),agree:wAt(sc,"slow","agree what data means"),test:wAt(sc,"slow","test it"),govern:wAt(sc,"slow","govern it"),serve:wAt(sc,"slow","serve it"),
    how:wAt(sc,"source","For the how"),docs:wAt(sc,"source","official documentation"),training:wAt(sc,"source","training"),build:wAt(sc,"source","the people who build it"),
    notOn:wAt(sc,"other","Not on Databricks"),hold:wAt(sc,"other","still hold"),own:wAt(sc,"other","your own platform"),each:wAt(sc,"other","for each one"),name:wAt(sc,"other","another name"),
    isNew:wAt(sc,"need","because it's new"),film:wAt(sc,"need","because a film showed it"),real:wAt(sc,"need","a real need")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"map",keys:[[0,960,540,1.0]],push:0.012,draw:(cx,tt)=>{
    il_top(cx,1);const out1=1-ag_in(tt,c.source-1.0,0.5);il_case(cx,"Why the films stay light",ag_in(tt,0.2,0.6)*out1,MD.ink);
    // what changes fast: tags that come and go, one after another
    const fA=ag_in(tt,T.fast-0.3,0.5)*out1;md_T(cx,"WHAT CHANGES FAST",96,290,{w:800,size:28,ls:4,col:MD.soft,a:fA});
    IL_FAST.forEach((s,i)=>{const t0=T.feat-0.6+i*0.8,u=(tt-t0)/4.4;if(u<=0||u>=1)return;const q=fA*Math.min(1,u*6,(1-u)*6)*(1-ag_in(tt,c.slow+1.0,0.5));md_tag(cx,96+(i%2)*70,lerp(350,820,u),s,{col:MD.soft,a:q});});
    // a film of every button, out of date within months
    md_textCard(cx,560,320,500,{kick:"Every button, filmed",title:"Out of date within months"},{edge:MD.fail,icon:"clock",a:ag_io(tt,T.button-0.3,c.slow+0.4,0.5),k:il_k(tt,T.button-0.3)});
    // what changes slowly: the ideas, which these films stay with
    const sA=ag_in(tt,c.slow-0.3,0.5)*out1;md_T(cx,"WHAT CHANGES SLOWLY",1180,290,{w:800,size:28,ls:4,col:MD.agreed,a:sA});
    let y=330;IL_SLOW.forEach(([s,ic],i)=>{const t0=[T.agree,T.test,T.govern,T.serve][i];y+=il_idea(cx,1180,y,640,s,{a:sA*ag_in(tt,t0-0.3,0.5),edge:MD.agreed,icon:ic,k:il_k(tt,t0-0.3)})+18;});
    md_tag(cx,1180,790,"What these films teach",{col:MD.agreed,a:sA*ag_in(tt,T.slowly,0.5)});
    // for the how, the official documentation and training, from the people who build each tool
    const dA=ag_in(tt,c.source-0.3,0.5)*(1-ag_in(tt,c.other-1.0,0.5));if(dA>0){il_case(cx,"For the how · the official sources",dA,MD.ink);
      md_reader(cx,180,320,720,{title:"Databricks",sub:"Documentation · training",logo:"databricks",a:dA*ag_in(tt,T.docs-0.3,0.5),lit:0.4*ag_io(tt,T.docs,T.build,0.5)});
      md_reader(cx,1020,320,720,{title:"dbt",sub:"Documentation · training",logo:"dbt",a:dA*ag_in(tt,T.docs,0.5),lit:0.4*ag_io(tt,T.docs+0.3,T.build,0.5)});
      md_tag(cx,960,520,"Kept up to date by the people who build it",{align:"center",col:MD.flow,icon:"refresh",a:dA*ag_in(tt,T.build-0.3,0.5)});}
    // another platform? the same ideas, and what it offers for each
    const oA=ag_in(tt,c.other-0.3,0.5)*(1-ag_in(tt,c.need-1.0,0.5));if(oA>0){il_case(cx,"Not on Databricks?",oA,MD.ink);
      let yy=300;IL_SLOW.forEach(([s,ic],i)=>{yy+=il_idea(cx,180,yy,600,s,{a:oA*ag_in(tt,T.hold-0.3+i*0.12,0.4),edge:MD.agreed,icon:ic})+16;});
      md_reader(cx,1160,330,620,{title:"Microsoft Fabric",sub:"Or any other platform",logo:"fabric",a:oA*ag_in(tt,T.own-0.3,0.5)});
      md_reader(cx,1160,470,620,{title:"Your own platform",sub:"What does it offer?",icon:"query",col:MD.flow,a:oA*ag_in(tt,T.own,0.5),lit:0.4*ag_io(tt,T.each-0.2,c.need-0.6,0.5)});
      for(let i=0;i<4;i++){const y0=300+i*96+40;il_link(cx,md_curve([780,y0],[1160,525],{bend:0.5}),ag_sine((tt-T.each+0.2-i*0.1)/0.9),tt,{a:0.7*oA,off:i*0.3,every:1.4});}
      md_tag(cx,1470,660,"Most have an answer, under another name",{align:"center",col:MD.pass,icon:"tick",a:oA*ag_in(tt,T.name-0.4,0.5)});}
    // choose what answers a real need
    const nA=ag_in(tt,c.need-0.3,0.5);if(nA>0){il_case(cx,"How to choose",nA,MD.ink);
      [["Because it's new",T.isNew],["Because a film showed it",T.film]].forEach(([s,a_],i)=>{const b=md_tag(cx,560+i*800,360,s,{align:"center",col:MD.soft,a:nA*ag_in(tt,a_-0.4,0.4)});
        il_strike(cx,b.x+14,b.y+b.h/2,b.x+b.w-14,b.y+b.h/2,ag_in(tt,a_+0.3,0.4),nA);});
      md_pill(cx,960,560,"Because it answers a real need",{col:MD.pass,icon:"tick",a:nA*ag_in(tt,T.real-0.4,0.5),k:il_k(tt,T.real-0.4)});}}}],0.6);});

/* ---------------------------------------------------------------- 4 · Test what's new */
// 200 of September's invoices: which 12 didn't match (most of them poor scans)
const IL_MISS=[7,23,38,51,66,90,104,121,137,152,176,191];
scene("loop",(ctx,S,t,sc)=>{const c=sc.cues,T=il_once(sc,"T",()=>({
    keep:wAt(sc,"loop","keep up"),small:wAt(sc,"loop","small and quick"),inv:wAt(sc,"loop","investigate"),adapt:wAt(sc,"loop","adapt"),impl:wAt(sc,"loop","implement"),iter:wAt(sc,"loop","iterate"),
    seasons:wAt(sc,"shorter","two seasons"),shorter:wAt(sc,"shorter","the shorter the loop"),more:wAt(sc,"shorter","the more you learn"),
    realNeed:wAt(sc,"need","a real need"),notFeat:wAt(sc,"need","not from the feature"),typed:wAt(sc,"need","typed every invoice"),ticket:wAt(sc,"need","in a ticket"),
    docs:wAt(sc,"read","the official docs"),what:wAt(sc,"read","what they do"),cost:wAt(sc,"read","what they cost"),stop:wAt(sc,"read","where they stop"),
    small2:wAt(sc,"adapt","trying it small"),own:wAt(sc,"adapt","your own data"),sandbox:wAt(sc,"adapt","in a sandbox"),set:wAt(sc,"adapt","a set time"),days:wAt(sc,"adapt","two days"),n200:wAt(sc,"adapt","two hundred"),
    compared:wAt(sc,"compare","compared"),typed2:wAt(sc,"compare","Finance had typed"),n188:wAt(sc,"compare","a hundred and eighty-eight"),n12:wAt(sc,"compare","twelve"),scans:wAt(sc,"compare","poor scans"),
    told:wAt(sc,"learned","Two days told"),works:wAt(sc,"learned","where it works"),doesnt:wAt(sc,"learned","where it doesn't"),
    one:wAt(sc,"implement","one use case"),project:wAt(sc,"implement","the data project"),tests:wAt(sc,"implement","its tests"),back:wAt(sc,"implement","a way back"),
    reviewed:wAt(sc,"review","The data team reviewed"),checked:wAt(sc,"review","checked October's results"),closed:wAt(sc,"review","ticket closed"),
    watching:wAt(sc,"iterate","watching what happens"),again:wAt(sc,"iterate","trying again"),month:wAt(sc,"iterate","each month"),person:wAt(sc,"iterate","went to a person"),why:wAt(sc,"iterate","and why"),
    notYes:wAt(sc,"drop","Not every trial"),tried:wAt(sc,"drop","They tried"),centre:wAt(sc,"drop","cost centre"),list:wAt(sc,"list","supplier list"),dropped:wAt(sc,"list","dropped it"),
    no:wAt(sc,"cost","ends in no"),twoDays:wAt(sc,"cost","two days"),year:wAt(sc,"cost","not a year")}));
  // which step is lit: investigate from "need", adapt from "adapt", implement from "implement", iterate from "iterate"
  const lit=t<c.need-0.2?-1:t<c.adapt-0.2?0:t<c.implement-0.2?1:t<c.iterate-0.2?2:3;
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"map",keys:[[0,960,540,1.0]],push:0.012,draw:(cx,tt)=>{
    il_top(cx,1);il_case(cx,"Test what's new · a short loop",ag_in(tt,0.2,0.6),MD.ink);
    // the loop, drawn as it's named, each step lit while its line is said
    const rA=ag_in(tt,T.small-0.4,0.6);il_loop(cx,tt,400,500,210,{a:rA,u:ag_sine((tt-T.small+0.2)/2.2),lit,stepA:i=>ag_in(tt,[T.inv,T.adapt,T.impl,T.iter][i]-0.25,0.4)});
    // a shorter loop learns more in the same time: the breeders' two seasons again
    const shA=ag_io(tt,c.shorter-0.3,c.need-0.3,0.5);if(shA>0){md_card(cx,960,260,860,360,{a:shA});md_T(cx,"IN THE SAME TIME",988,312,{w:800,size:28,ls:4,col:MD.soft,a:shA});
      [["A long loop",1,MD.soft,T.seasons],["A short loop",3,MD.pass,T.shorter]].forEach(([s,n,col,a_],i)=>{const q=shA*ag_in(tt,a_-0.3,0.5),y=400+i*130;md_T(cx,s,988,y,{w:600,size:30,col,a:q});
        for(let k=0;k<n;k++){const u=ag_sine((tt-a_-k*0.35)/0.9);if(u<=0)continue;cx.save();cx.globalAlpha*=q;cx.strokeStyle=rgba(col,0.9);cx.lineWidth=4;cx.beginPath();cx.arc(1380+k*120+(n===1?120:0),y-10,n===1?100:46,-Math.PI/2,-Math.PI/2+TAU*u);cx.stroke();cx.restore();}});
      md_tag(cx,988,580,"More learned",{col:MD.pass,icon:"tick",a:shA*ag_in(tt,T.more-0.2,0.5)});}
    // the person each step is about, at the right
    // Jun, who runs the loop, at the right
    const junA=ag_in(tt,c.need-0.4,0.7);il_who(cx,"jun",1640,590,0.98,junA,{t:tt,gaze:[-3,0],flip:true});md_nameTag(cx,1520,400,"jun",{align:"right",col:MD.flow,a:junA});
    // investigate: the need first, in Finance's ticket; then the official docs: what they do, what they cost, where they stop
    const iA=ag_io(tt,c.need-0.3,c.adapt-1.0,0.5);
    md_textCard(cx,740,250,560,{kick:"A ticket · Finance",title:"Invoices typed by hand",sub:"Rohan's team asks for a better way"},{edge:MD.wait,icon:"doc",a:iA*ag_in(tt,T.typed-0.5,0.5)*(1-ag_in(tt,c.read-1.0,0.5)),k:il_k(tt,T.typed-0.5)});
    md_tag(cx,740,530,"A real need, not a feature",{col:MD.agreed,icon:"person",a:iA*ag_in(tt,T.realNeed-0.2,0.5)*(1-ag_in(tt,c.read-1.0,0.5))});
    const oA=iA*ag_in(tt,c.read-0.3,0.5);md_textCard(cx,740,250,560,{kick:"Read first",title:"The official docs"},{edge:MD.flow,icon:"doc",a:oA*ag_in(tt,T.docs-0.4,0.5),k:il_k(tt,T.docs-0.4)});
    [["What they do",T.what],["What they cost",T.cost],["Where they stop",T.stop]].forEach(([s,a_],i)=>md_tag(cx,740,470+i*76,s,{col:MD.flow,icon:"tick",a:oA*ag_in(tt,a_-0.2,0.4)}));
    // adapt: small, on our own data, in a sandbox, for two days: 200 of September's invoices, compared with what Finance typed
    const aA=ag_io(tt,c.adapt-0.3,c.implement-1.0,0.5);if(aA>0){md_card(cx,740,220,560,470,{edge:MD.flow,a:aA,glow:0.4});md_T(cx,"A SANDBOX · TWO DAYS",768,272,{w:800,size:28,ls:4,col:MD.flow,a:aA*ag_in(tt,T.sandbox-0.3,0.5)});
      md_T(cx,"200 of September's invoices",768,318,{w:600,size:28,col:MD.soft,a:aA*ag_in(tt,T.n200-0.3,0.5)});
      const cmp=ag_in(tt,T.compared,1.6);for(let k=0;k<200;k++){const i=k%20,j=Math.floor(k/20),q=aA*ag_in(tt,T.n200-0.3+k*0.006,0.25);if(q<=0)continue;const miss=IL_MISS.includes(k),
        u=clamp(cmp*1.3-k/200*0.3,0,1),col=u<=0?MD.dim:mix(MD.dim,miss?MD.wait:MD.pass,u);cx.save();cx.globalAlpha*=q;cx.fillStyle=rgba(col,0.9);rr(cx,772+i*24,348+j*22,18,16,4);cx.fill();cx.restore();}
      md_T(cx,"188 matched",768,610,{w:700,size:32,col:MD.pass,a:aA*ag_in(tt,T.n188-0.2,0.5)});md_T(cx,"12 didn't: most were poor scans",768,650,{w:500,size:28,col:MD.wait,a:aA*ag_in(tt,T.scans-0.4,0.5)});}
    md_tag(cx,740,740,"Where it works, and where it doesn't",{col:MD.pass,icon:"tick",a:ag_io(tt,T.works-0.4,c.implement-1.0,0.5)});
    // implement: one use case, in the data project, with its tests and a way back; reviewed by the data team, checked by Finance, the ticket closed
    const mA=ag_io(tt,c.implement-0.3,c.iterate-1.0,0.5);if(mA>0){md_textCard(cx,740,230,560,{kick:"One use case",title:"In the data project"},{edge:MD.flow,icon:"table",a:mA*ag_in(tt,T.project-0.4,0.5),k:il_k(tt,T.project-0.4)});
      [["Its tests","tick",MD.pass,T.tests],["A way back","refresh",MD.flow,T.back]].forEach(([s,ic,col,a_],i)=>md_tag(cx,740+i*250,440,s,{col,icon:ic,a:mA*ag_in(tt,a_-0.2,0.4)*(1-ag_in(tt,c.review-0.4,0.4))}));
      [["Reviewed by the data team",T.reviewed],["Finance checked October's results",T.checked],["The ticket closed",T.closed]].forEach(([s,a_],i)=>{const q=mA*ag_in(tt,a_-0.3,0.4),ok=ag_in(tt,a_+0.8,0.4);
        md_tag(cx,740,440+i*84,s,{col:mix(MD.wait,MD.pass,ok),icon:ok>0.5?"tick":"clock",a:q});});}
    // iterate: each month, what went to a person, and why; a trial that ended in no, dropped; two days, not a year
    const tA=ag_in(tt,c.iterate-0.3,0.5)*(1-ag_in(tt,c.drop-1.0,0.5));if(tA>0){md_textCard(cx,740,250,560,{kick:"Each month",title:"What went to a person, and why"},{edge:MD.wait,icon:"refresh",a:tA*ag_in(tt,T.month-0.3,0.5),k:il_k(tt,T.month-0.3)});
      [["A field not read",72],["A supplier Finance didn't know",31],["Lines that don't add up",14],["Sent twice",9]].forEach(([s,n],i)=>{const q=tA*ag_in(tt,T.why-0.2+i*0.18,0.4),y=480+i*56;
        md_T(cx,s,740,y,{w:500,size:28,col:MD.soft,a:q});cx.save();cx.globalAlpha*=q;cx.fillStyle=rgba(MD.wait,0.85);rr(cx,1130,y-20,n*2.2,22,6);cx.fill();cx.restore();});}
    const dA=ag_in(tt,c.drop-0.3,0.5)*(1-ag_in(tt,c.cost-1.0,0.5));if(dA>0){const b=md_textCard(cx,740,250,560,{kick:"Tried",title:"The model picks each invoice's cost centre"},{edge:MD.soft,a:dA*ag_in(tt,T.tried-0.4,0.5),k:il_k(tt,T.tried-0.4)});
      md_tag(cx,740,b.y+b.h+60,"The supplier list already gives it",{col:MD.flow,icon:"table",a:dA*ag_in(tt,T.list-0.3,0.5)});
      md_pill(cx,920,b.y+b.h+170,"Dropped",{col:MD.soft,icon:"cross",a:dA*ag_in(tt,T.dropped-0.3,0.5),k:il_k(tt,T.dropped-0.3)});}
    md_pill(cx,1020,420,"Two days, not a year",{col:MD.pass,icon:"clock",a:ag_in(tt,T.twoDays-0.3,0.5),k:il_k(tt,T.twoDays-0.3)});}}],0.6);});

/* ---------------------------------------------------------------- 5 · Keep the method */
const IL_MOD=[["Data that moves","Moving data"],["Data as software","Running the platform"],["From tables to decisions","Serving it to people and agents"],["Documents and closing remarks","Reading documents"]];
scene("close",(ctx,S,t,sc)=>{const c=sc.cues,T=il_once(sc,"T",()=>({
    gone:wAt(sc,"wheats","long gone"),method:wAt(sc,"wheats","The method"),places:wAt(sc,"wheats","two places"),still:wAt(sc,"wheats","still used"),
    ideas:wAt(sc,"keep","keep the ideas"),features:wAt(sc,"keep","test the features"),small:wAt(sc,"keep","small, soon"),need:wAt(sc,"keep","a real need"),
    moving:wAt(sc,"module","moving data"),running:wAt(sc,"module","running the platform"),serving:wAt(sc,"module","serving it"),reading:wAt(sc,"module","reading documents"),
    whole:wAt(sc,"team","a whole team"),dbx:wAt(sc,"team","Databricks and dbt"),agree:wAt(sc,"team","agreeing what the data means"),
    docs:wAt(sc,"end","the official docs"),inv:wAt(sc,"end","Investigate"),going:wAt(sc,"end","keep going")}));
  const map0=c.keep-1.0;
  ag_shots(ctx,S,t,sc.dur,[
    // the field again, now a harvest; the wheats are gone, the method stays
    {at:0,place:"ilField",keys:[[0,960,520,1.0]],push:0.02,draw:(cx,tt)=>{
      il_field(cx,tt,{wind:0.7,health:1.15,a:1});
      il_scr(cx,S,()=>{md_textCard(cx,1180,170,640,{kick:"The wheats of the 1950s",title:"Long gone from the fields"},{edge:MD.soft,a:ag_in(tt,T.gone-0.4,0.5),k:il_k(tt,T.gone-0.4)});
        md_textCard(cx,1180,380,640,{kick:"The method",title:"Two places, two seasons",sub:"Still used by wheat breeders today"},{edge:MD.agreed,icon:"refresh",a:ag_in(tt,T.method-0.3,0.5),k:il_k(tt,T.method-0.3)});});}},
    // keep the ideas, test the features; the module; what's left for people; start from the docs, and the loop
    {at:map0,place:"map",dis:0.9,keys:[[0,960,540,1.0]],push:0.012,draw:(cx,tt)=>{
      il_top(cx,1);const kA=ag_in(tt,map0+0.3,0.5)*(1-ag_in(tt,c.module-0.6,0.5));
      md_pill(cx,960,360,"Keep the ideas",{col:MD.agreed,icon:"person",a:kA*ag_in(tt,T.ideas-0.3,0.5),k:il_k(tt,T.ideas-0.3)});
      md_pill(cx,960,480,"Test the features",{col:MD.flow,icon:"refresh",a:kA*ag_in(tt,T.features-0.3,0.5),k:il_k(tt,T.features-0.3)});
      md_tag(cx,960,600,"Small · soon · on a real need",{align:"center",col:MD.ink,a:kA*ag_in(tt,T.small-0.3,0.5)});
      // the module: four series, each once a whole team's work; the tools do much of it, and people agree what the data means
      const mA=ag_in(tt,c.module-0.4,0.5)*(1-ag_in(tt,c.end-0.7,0.5));il_case(cx,"Modern data basics",mA*ag_in(tt,c.module-0.2,0.5),MD.ink);
      IL_MOD.forEach(([ti,sub],i)=>{const x=200+(i%2)*800,y=220+Math.floor(i/2)*200,at_=[T.moving,T.running,T.serving,T.reading][i],q=mA*ag_in(tt,at_-0.3,0.5);
        md_textCard(cx,x,y,720,{title:ti,sub},{edge:i===3?MD.agreed:MD.flow,a:q,k:il_k(tt,at_-0.3)});
        const many=1-ag_in(tt,T.dbx,0.6);for(let j=0;j<5;j++){const pa=q*ag_in(tt,T.whole-0.3+j*0.08,0.4)*(j===2?1:many);if(pa>0)md_icon(cx,"person",x+650+(j-2)*30,y+40,28,j===2?mix(MD.ink,MD.agreed,ag_in(tt,T.agree-0.3,0.6)):MD.soft,{a:pa});}});
      md_reader(cx,200,650,560,{title:"Databricks",logo:"databricks",a:mA*ag_in(tt,T.dbx-0.3,0.5)});md_reader(cx,1160,650,560,{title:"dbt",logo:"dbt",a:mA*ag_in(tt,T.dbx+0.1,0.5)});
      md_pill(cx,960,810,"Agreeing what the data means",{col:MD.agreed,icon:"person",a:mA*ag_in(tt,T.agree-0.3,0.5),k:il_k(tt,T.agree-0.3)});
      // start from the official docs: the loop, and keep going
      const eA=ag_in(tt,c.end-0.4,0.5)*(1-ag_in(tt,c.breath-0.2,0.8));
      md_textCard(cx,240,420,480,{kick:"Start from",title:"The official docs"},{icon:"doc",edge:MD.flow,a:eA*ag_in(tt,T.docs-0.3,0.5),k:il_k(tt,T.docs-0.3)});
      il_link(cx,[[720,480],[1050,480]],ag_sine((tt-T.docs)/0.7),tt,{a:0.85*eA,flow:false});
      il_loop(cx,tt,1320,480,230,{a:eA,u:ag_sine((tt-T.inv+0.2)/2.4),stepA:i=>ag_in(tt,T.inv-0.2+i*0.35,0.4)});
      md_tag(cx,1320,480,"Keep going",{align:"center",col:MD.agreed,icon:"refresh",a:eA*ag_in(tt,T.going-0.3,0.5)});}}
  ],0.9);
  md_end(ctx,S,t,c.breath,"Ideas that last, features you test","Keep the ideas. Test the features.","Film 2 of 2 · Documents and closing remarks","Modern data basics");});

ag_cutInto(["recap","light","loop"]);
