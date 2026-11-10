/* ===== Scripts became software: the scenes =====
   Seven chapters, each timed to its narration: wAt(sc, "line", "word") is the moment a word is said. The opening story is at the
   Tacoma Narrows (sbNarrows, painted once, sb_bridge.js) and in the night of the wind tunnel; the rest is on the module's map, one
   room. There the camera stays where it is, the people stand in a layer of their own, drawn after the shots, so they stay put while
   the cards change, and a new moment is a later one (later:true): what was there leaves before what comes in. Chapters on the map
   open on what the one before ends on (ag_cutInto). Between the Narrows, the night and the map the whole picture changes, so those
   shots dissolve. The title card ends chapter 1, the end card chapter 7. */

/* ---------------------------------------------------------------- the people on the map, and where they stand */
// [x, y, s, facing left]: half-figures from the frame's foot, heads at about y 415, faces turned to the middle
const SB_P={jun:[250,670,0.86,false],sam:[1670,670,0.86,true],ingrid:[1670,670,0.86,true],rohan:[1650,670,0.86,true],noor:[1660,720,0.8,true],farq:[330,672,0.88,false]};
const SB_SIDE={jun:MD.flow,sam:MD.flow,noor:MD.flow,ingrid:MD.sys.hr,rohan:MD.dom.finance};
function sb_who(ctx,S,t,who,a,o){if(a<=0.004)return;const p=SB_P[who];setScreen(ctx,S);ctx.save();ctx.globalAlpha=a;
  md_person(ctx,who==="farq"?SB_FARQ:who,p[0],p[1],p[2],Object.assign({t,flip:p[3],gaze:p[3]?[-3,1]:[3,1]},o||{}));ctx.restore();}
// a person's name and role above their head: at the left edge for those on the left, at the right edge for those on the right
function sb_tagOf(ctx,S,who,a,o){if(a<=0.004)return;const p=SB_P[who],right=p[3],at_=o&&o.at;setScreen(ctx,S);
  md_nameTag(ctx,at_?at_[0]:right?1824:96,at_?at_[1]:p[1]-340,who==="farq"?SB_FARQ:who,Object.assign({align:right?"right":"left",col:SB_SIDE[who],a},o||{}));}
// a person who comes in at t0 and leaves at t1 (each over 0.6 s), as one picture
const sb_there=(t,t0,t1)=>ag_in(t,t0,0.6)*(1-ag_in(t,t1==null?1e9:t1,0.6));

/* ---------------------------------------------------------------- 1 · Tested first */
scene("gertie",(ctx,S,t,sc)=>{const c=sc.cues,T=sb_once(sc,"T",()=>({
    state:wAt(sc,"opens","Washington"),newB:wAt(sc,"narrows","new bridge"),tacoma:wAt(sc,"narrows","Tacoma Narrows"),cables:wAt(sc,"narrows","two great cables"),susp:wAt(sc,"narrows","suspension bridge"),
    deck:wAt(sc,"slender","Its deck"),light:wAt(sc,"slender","light and slender"),theory:wAt(sc,"slender","best theory"),
    rises:wAt(sc,"gertie","rises and falls"),wind:wAt(sc,"gertie","in the wind"),gg:wAt(sc,"gertie","Galloping Gertie"),nobody:wAt(sc,"nobody","Nobody"),
    nov:wAt(sc,"twist","seventh of November"),forty:wAt(sc,"twist","forty miles"),twisting:wAt(sc,"twist","twisting"),tears:wAt(sc,"twist","tears away"),
    noone:wAt(sc,"gone","No one"),only:wAt(sc,"gone","only road"),change:wAt(sc,"gone","Something had to change"),
    eng:wAt(sc,"board","engineers"),wt:wAt(sc,"board","wind tunnel"),fan:wAt(sc,"board","a fan blows"),
    uw:wAt(sc,"tunnel","University of Washington"),farq:wAt(sc,"tunnel","Frederick"),years:wAt(sc,"tunnel","for years"),
    find:wAt(sc,"finds","find a deck"),cant:wAt(sc,"finds","can't twist"),deeper:wAt(sc,"finds","deeper"),stiffer:wAt(sc,"finds","stiffer"),open:wAt(sc,"finds","open to let"),
    n50:wAt(sc,"opens50","nineteen fifty"),before:wAt(sc,"opens50","tested before"),carried:wAt(sc,"opens50","carried traffic"),y76:wAt(sc,"opens50","seventy-six"),
    notnew:wAt(sc,"next","weren't new"),wright:wAt(sc,"next","Wright brothers"),bridges:wAt(sc,"next","Bridges took up"),
    dataW:wAt(sc,"data","Data work"),soft:wAt(sc,"data","software"),
    pe:wAt(sc,"export","payroll's export"),script:wAt(sc,"export","a script"),laptop:wAt(sc,"export","laptop"),
    nowS:wAt(sc,"now","software"),tbe:wAt(sc,"now","tested before"),rev:wAt(sc,"now","reviewed"),rel:wAt(sc,"now","released")}));
  const hit=k=>T.tears+SB_FALL[k][2]+Math.sqrt(2*(SB_G.water-SB_G.deck)/260);   // when each falling piece meets the water
  const tunnelAt=c.board-0.6,y50At=c.opens50-0.6,doorAt=c.next-0.6,mapAt=c.export-0.6;
  ag_shots(ctx,S,t,sc.dur,[
    // the Narrows: the bridge builds itself, gallops in the wind, twists, and its middle falls into the water
    {at:0,place:"sbNarrows",keys:[[0,960,560,1.0],[T.deck-0.8,960,600,1.3],[T.nov-1.2,960,604,1.32],[T.noone-0.4,960,590,1.12]],d:2.4,push:0.02,draw:(cx,tt)=>{
      const fw=ag_in(tt,T.forty-0.6,1.6),wind=ag_in(tt,T.wind-1.2,1.8)*(0.6+0.4*fw)*(1-0.5*ag_in(tt,T.noone,2.0));
      sb_wind(cx,tt,{n:Math.round(16+22*fw),speed:360+460*fw,tilt:0.05,a:wind,seed:19,len:200});
      const gallop=ag_in(tt,T.rises-0.5,2.4)*(1-ag_in(tt,T.twisting-0.8,2.4)),twist=ag_in(tt,T.twisting-1.0,2.2);
      sb_bridge(cx,{t:tt,era:1940,build:ag_sine(clamp((tt-T.newB+0.4)/3.8,0,1)),gallop,twist,tear:tt>=T.tears?T.tears:null,fallT:tt-T.tears,
        lamps:ag_in(tt,T.newB+2.8,1.0),cableLit:ag_io(tt,T.cables-0.1,T.susp+1.4,0.5)});
      SB_FALL.forEach(([u0,u1],k)=>sb_splash(cx,lerp(SB_G.t0,SB_G.t1,(u0+u1)/2),SB_G.water,tt-hit(k),(u1-u0)*(SB_G.t1-SB_G.t0)));
      // what the narration names, beside the thing it names
      md_tag(cx,960,476,"a suspension bridge",{align:"center",col:MD.ink,a:ag_io(tt,T.susp-0.2,T.deck-0.6,0.5)});
      md_tag(cx,960,488,"light and slender",{align:"center",col:MD.ink,a:ag_io(tt,T.light-0.2,T.rises-0.6,0.5)});
      md_T(cx,"built to the best theory of its day",960,560,{w:600,size:28,align:"center",col:MD.soft,a:ag_io(tt,T.theory-0.2,T.rises-0.6,0.5)});
      md_tag(cx,960,470,"“Galloping Gertie”",{align:"center",col:MD.ink,a:ag_io(tt,T.gg-0.2,T.nobody-0.5,0.4)});
      md_tag(cx,960,470,"Not tested in the wind before it was built",{align:"center",col:MD.fail,icon:"cross",a:ag_io(tt,T.nobody+0.1,T.nov-1.0,0.4)});
      // the gap the fall leaves: no road across, for ten years
      const ga=ag_in(tt,T.only-0.2,0.6);if(ga>0){cx.save();cx.globalAlpha*=ga;cx.setLineDash([12,10]);cx.lineWidth=3;cx.strokeStyle=rgba(MD.fail,0.9);
        const x0=lerp(SB_G.t0,SB_G.t1,SB_FALL[0][0])+12,x1=lerp(SB_G.t0,SB_G.t1,SB_FALL[2][1])-12;cx.beginPath();cx.moveTo(x0,SB_G.deck+22);cx.lineTo(x1,SB_G.deck+22);cx.stroke();cx.restore();
        md_tag(cx,960,500,"No road across the Narrows · 10 years",{align:"center",col:MD.fail,icon:"cross",a:ga});}}},
    // the engineers' report, and the wind tunnel: a fan blows a steady wind past a model of the deck on its springs
    {at:tunnelAt,place:"night",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const ca=ag_in(tt,c.board-0.2,0.6)*(1-ag_in(tt,T.uw-0.9,0.5));
      md_textCard(cx,120,110,940,{kick:"1941 · The engineers' report",title:"Test bridges like it first, as models in a wind tunnel"},{edge:MD.agreed,icon:"contract",a:ca,k:sb_k(tt,c.board-0.2)});
      const ta=ag_in(tt,T.wt-0.5,0.7),spin=ag_in(tt,T.fan-0.3,1.4),old=1-ag_in(tt,T.find-0.4,0.4),nw=ag_in(tt,T.find,0.5);
      const swing=ag_in(tt,T.uw+0.6,2.4)*0.36*Math.sin(TAU*0.5*tt);
      sb_tunnel(cx,640,300,1180,460,{t:tt,a:ta,spin,wind:spin,era:1940,th:swing,modelA:old,era2:1950,th2:0.015*Math.sin(TAU*0.5*tt),model2A:nw,size:340});
      md_label(cx,680,362,"1941 to 1947",{a:ag_io(tt,T.years-0.3,T.find-0.6,0.5)*ta});
      md_pill(cx,1348,352,"Steady in the wind",{col:MD.pass,icon:"tick",size:28,a:ag_in(tt,T.cant-0.1,0.5),k:sb_k(tt,T.cant-0.1)});
      [["deeper",T.deeper,640],["stiffer",T.stiffer,826],["open to the wind",T.open,1006]].forEach(([w_,at_,x])=>md_tag(cx,x,240,w_,{col:MD.pass,icon:"tick",a:ag_in(tt,at_-0.15,0.4)}));}},
    // 1950: the new bridge, its deck deep and open, steady in the wind, and traffic crossing
    {at:y50At,place:"sbNarrows",keys:[[0,960,560,1.0]],push:0.025,draw:(cx,tt)=>{
      sb_wind(cx,tt,{n:24,speed:520,tilt:0.05,a:0.55,seed:23,len:200});
      sb_bridge(cx,{t:tt,era:1950,gallop:0.04,cars:ag_in(tt,T.carried-0.6,1.0),lamps:1});
      md_pill(cx,960,470,"76 years of traffic",{col:MD.pass,size:30,a:ag_in(tt,T.y76-0.1,0.5),k:sb_k(tt,T.y76-0.1)});}},
    // a practice from next door: wings in wind tunnels, then bridges; software's way of working, then data work's
    {at:doorAt,place:"night",keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
      sb_nextDoor(cx,tt,{y:200,r1:ag_in(tt,T.notnew-0.3,0.6),arrow1:clamp((tt-T.bridges+0.5)/1.1,0,1),r2:ag_in(tt,T.dataW-0.3,0.6),arrow2:clamp((tt-T.soft+0.2)/1.1,0,1),
        a:1-ag_in(tt,mapAt-0.7,0.5)});}},
    // at the university: payroll's export, a script on one person's laptop; now software, tested, reviewed, released the same way
    {at:mapAt,place:"map",keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{const out=1-ag_in(tt,c.breath+0.4,1.0);
      cx.save();cx.globalAlpha*=out;
      md_label(cx,96,120,"At the university · payroll's export to Finance",{a:ag_in(tt,T.pe-0.3,0.6)});
      sb_laptop(cx,180,250,700,{lines:SB_SCRIPT,title:"payroll_export.py",a:ag_in(tt,T.script-0.4,0.6),codeA:ag_in(tt,T.script,0.8)});
      md_tag(cx,180,790,"one person's laptop",{col:MD.soft,icon:"person",a:ag_in(tt,T.laptop-0.2,0.5)*(1-ag_in(tt,T.nowS-0.4,0.5))});
      const rows=[["Tested before every change",T.tbe,MD.pass,"tick"],["Reviewed by someone else",T.rev,MD.wait,"person"],["Released the same way every time",T.rel,MD.flow,"refresh"]];
      rows.forEach(([w_,at_,col,ic],i)=>md_tag(cx,1000,330+i*110,w_,{col,icon:ic,size:32,a:ag_in(tt,at_-0.15,0.4)}));
      md_T(cx,"Now it's software",1000,240,{w:800,size:44,a:ag_in(tt,T.nowS-0.3,0.5)});cx.restore();}}
  ],0.6);
  // the date, the place and the wind, at the top left, through the camera's moves
  setScreen(ctx,S);const out1=1-ag_in(t,tunnelAt-0.8,0.5);
  withA(ctx,out1,()=>{md_label(ctx,96,110,"Washington State · 1 July 1940",{a:ag_in(t,T.state-0.2,0.6)*(1-ag_in(t,T.nov-0.6,0.5))});
    md_tag(ctx,96,178,"Tacoma Narrows",{col:MD.ink,a:ag_in(t,T.tacoma-0.2,0.5)*(1-ag_in(t,T.nov-0.6,0.5))});
    md_label(ctx,96,110,"7 November 1940",{a:ag_in(t,T.nov-0.2,0.5)});
    md_tag(ctx,96,178,"Wind about 40 mph · 64 km/h",{col:MD.ink,a:ag_in(t,T.forty-0.2,0.5)*(1-ag_in(t,T.noone-0.4,0.5))});
    md_tag(ctx,96,178,"No one is killed",{col:MD.ink,a:ag_in(t,T.noone-0.1,0.5)});});
  withA(ctx,ag_in(t,y50At+0.2,0.5)*(1-ag_in(t,doorAt-0.8,0.5)),()=>{md_label(ctx,96,110,"Tacoma Narrows · 14 October 1950",{a:ag_in(t,T.n50-0.4,0.6)});
    md_tag(ctx,96,178,"Tested before it was built",{col:MD.pass,icon:"tick",a:ag_in(t,T.before-0.15,0.5)});});
  // Frederick Farquharson, at the tunnel he worked in for years
  const fa=sb_there(t,T.uw-0.5,y50At-0.9);sb_who(ctx,S,t,"farq",fa);sb_tagOf(ctx,S,"farq",ag_in(t,T.farq-0.2,0.6)*(1-ag_in(t,y50At-0.9,0.6)),{role:"University of Washington"});
  md_title(ctx,S,t,c.breath,"Scripts became software","Tested, reviewed, and released the same way","FILM 1 OF 2 · DATA AS SOFTWARE");
});

/* ---------------------------------------------------------------- 2 · A script on a laptop */
const SB_LAP={x:470,y:300,w:600};
scene("laptop",(ctx,S,t,sc)=>{const c=sc.cues,T=sb_once(sc,"T",()=>({
    thu:wAt(sc,"payday","Thursday"),pd:wAt(sc,"payday","pay day"),every:wAt(sc,"rohan","Every second"),rohanN:wAt(sc,"rohan","Rohan"),needs:wAt(sc,"rohan","needs to know"),faculty:wAt(sc,"rohan","by faculty"),
    scriptW:wAt(sc,"script","a script"),told:wAt(sc,"script","told him"),six:wAt(sc,"byhand","Before six"),ran:wAt(sc,"byhand","ran it by hand"),emailed:wAt(sc,"byhand","emailed"),
    inside:wAt(sc,"rule","inside it"),noon:wAt(sc,"rule","approved by noon"),later:wAt(sc,"rule","approved later"),
    worked:wAt(sc,"worked","It worked"),blame:wAt(sc,"worked","nobody is to blame"),author:wAt(sc,"worked","Its author"),kept:wAt(sc,"worked","kept running"),
    febW:wAt(sc,"feb","February"),app:wAt(sc,"feb","claims app"),sheets:wAt(sc,"feb","spreadsheets"),stopped:wAt(sc,"feb","stopped coming"),
    copy:wAt(sc,"unsafe","One copy"),hist:wAt(sc,"unsafe","no history"),test:wAt(sc,"unsafe","no test"),safely:wAt(sc,"unsafe","nobody could change")}));
  const L=SB_LAP,end=sc.dur-1.6;   // by the end, only the laptop is left, as the next chapter opens on it
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"map",keys:[[0,960,540,1.0]],push:0,draw:(cx,tt)=>{const go=1-ag_in(tt,end,0.8);
      cx.save();cx.globalAlpha*=go;
      md_label(cx,96,110,"Thursday 5 November 2026 · pay day",{a:ag_in(tt,T.thu-0.2,0.6)});
      // what Rohan needs, every second Thursday; then payroll's rule, found inside the script
      const na=ag_in(tt,T.every-0.2,0.6)*(1-ag_in(tt,T.inside-0.6,0.5));
      md_textCard(cx,1110,100,714,{kick:"Every second Thursday",title:"What casual staff are paid that day",sub:"by faculty and unit"},{edge:MD.dom.finance,icon:"table",a:na,k:sb_k(tt,T.every-0.2)});
      sb_rule(cx,1110,100,714,{a:ag_in(tt,T.inside,0.6),k:sb_k(tt,T.inside),r1:ag_in(tt,T.noon-0.2,0.5),r2:ag_in(tt,T.later-0.2,0.5)});
      // the spreadsheets each faculty sent, until February; then the claims app
      const sa=ag_in(tt,T.scriptW+0.6,0.6),stop=ag_in(tt,T.stopped-0.3,0.5),src={x:96,y:340,w:310};
      md_reader(cx,src.x,src.y,src.w,{title:"Spreadsheets",sub:"from each faculty",icon:"batch",a:sa*(1-0.55*stop),h:110});
      const lane=md_path([[src.x+src.w,src.y+55],[L.x-14,src.y+55]]);md_lane(cx,lane,stop>0.5?MD.fail:MD.flow,sa*0.9,{dash:stop>0.5?[10,8]:null});
      if(stop<1)md_flow(cx,lane,tt,{kind:"batch",a:sa*(1-stop),every:2.4});
      if(stop>0)md_icon(cx,"cross",(src.x+src.w+L.x)/2,src.y+55,40,MD.fail,{a:stop});
      md_system(cx,96,510,310,{n:"Claims app",s:"since February",c:MD.sys.hr},{a:ag_in(tt,T.app-0.3,0.6)});
      // by hand, before six, and emailed to Finance
      const ha=ag_in(tt,T.six-0.2,0.5)*(1-ag_in(tt,T.inside-0.6,0.5));md_tag(cx,L.x,800,"Before 6:00, by hand",{col:MD.soft,icon:"clock",a:ha});
      const mail=md_curve([L.x+L.w+14,L.y+200],[1440,L.y+300],{bend:0.5}),ma=ag_in(tt,T.emailed-0.3,0.5)*(1-ag_in(tt,T.inside-0.6,0.5));
      md_lane(cx,mail,MD.flow,ma*0.8,{u:clamp((tt-T.emailed+0.3)/0.8,0,1)});
      const eu=((tt-T.emailed)/2.2)%1;if(tt>T.emailed&&ma>0){const q=at(mk(mail.map(p=>P(p[0],p[1]))),ag_sine(eu));sb_envelope(cx,q.x,q.y,46,MD.flow,ma*Math.min(1,eu*6,(1-eu)*6));}
      // it worked, and nobody is to blame; its author moved team, and it kept running
      const wa=ag_in(tt,T.worked-0.15,0.5)*(1-ag_in(tt,T.copy-0.6,0.5));md_pill(cx,L.x+100,800,"It worked",{col:MD.pass,icon:"tick",size:28,a:wa,k:sb_k(tt,T.worked-0.15)});
      md_tag(cx,L.x+250,800,"Nobody is to blame",{col:MD.ink,a:ag_in(tt,T.blame-0.2,0.5)*(1-ag_in(tt,T.author-0.4,0.5))});
      const au=ag_sine(clamp((tt-T.author-0.4)/2.2,0,1));md_tag(cx,L.x+250-90*au,800,"Its author moved to another team",{col:MD.soft,icon:"person",a:ag_in(tt,T.author-0.2,0.5)*(1-au)});
      // one copy, no history, no test
      [["One copy","doc",T.copy,0],["No history of why","clock",T.hist,230],["No test","cross",T.test,600]].forEach(([w_,ic,at_,dx])=>md_tag(cx,L.x+dx,800,w_,{col:MD.fail,icon:ic,a:ag_in(tt,at_-0.15,0.4)}));
      cx.restore();
      // the laptop itself stays: the next chapter opens on it
      const warn=ag_in(tt,T.stopped-0.2,0.6)*(1-ag_in(tt,end,0.8)),run=ag_in(tt,T.kept-0.2,0.5)*(1-ag_in(tt,T.stopped-0.3,0.4))*(0.6+0.4*Math.sin(tt*3.2));
      sb_laptop(cx,L.x,L.y,L.w,{lines:SB_SCRIPT,title:"payroll_export.py",a:ag_in(tt,T.scriptW-0.3,0.6),codeA:1,rule:ag_in(tt,T.inside-0.2,0.6)*(1-ag_in(tt,end,0.8)),warn,run});}}
  ],0.6);
  // Rohan Desai, in Finance
  const ra=sb_there(t,T.rohanN-0.5,end);sb_who(ctx,S,t,"rohan",ra);sb_tagOf(ctx,S,"rohan",ag_in(t,T.rohanN-0.2,0.5)*(1-ag_in(t,end,0.6)),{role:"Finance",at:[1440,700]});
});

/* ---------------------------------------------------------------- 3 · Into the project */
const SB_MID={x:470,w:980};
scene("project",(ctx,S,t,sc)=>{const c=sc.cues,T=sb_once(sc,"T",()=>({
    sam:wAt(sc,"move","Sam"),jun:wAt(sc,"move","Jun Park"),moved:wAt(sc,"move","moved it"),project:wAt(sc,"move","data project"),
    gitW:wAt(sc,"git","Git"),beside:wAt(sc,"git","beside the models"),kept:wAt(sc,"git","every change is kept"),who:wAt(sc,"git","who made it"),why:wAt(sc,"git","and why"),
    sums:wAt(sc,"model","sums"),dbt:wAt(sc,"model","dbt"),once:wAt(sc,"model","written once"),cal:wAt(sc,"model","calendar"),
    ingridN:wAt(sc,"ingrid","Ingrid"),confirmed:wAt(sc,"ingrid","confirmed"),asks:wAt(sc,"ingrid","asks HR to review"),
    first:wAt(sc,"tests","tests first"),edge:wAt(sc,"tests","rule's edge"),e59:wAt(sc,"tests","eleven fifty-nine"),paid:wAt(sc,"tests","paid that Thursday"),t01:wAt(sc,"tests","twelve oh one"),twoW:wAt(sc,"tests","two weeks later"),
    declare:wAt(sc,"weeds","Declare it"),promises:wAt(sc,"weeds","Promises and proofs"),layers:wAt(sc,"weeds","Built in layers"),
    br:wAt(sc,"branch","a branch"),pr:wAt(sc,"branch","pull request"),build:wAt(sc,"branch","build it"),every:wAt(sc,"branch","every test")}));
  const L=SB_LAP,M=SB_MID,modelAt=c.model-0.5,weedsAt=c.weeds-0.5,branchAt=c.branch-0.5;
  ag_shots(ctx,S,t,sc.dur,[
    // the laptop's script goes into the data project, in Git: beside the models, every change kept, with who made it and why
    {at:0,place:"map",keys:[[0,960,540,1.0]],push:0,draw:(cx,tt)=>{
      const la=1-ag_in(tt,T.moved-0.2,0.6);sb_laptop(cx,L.x,L.y,L.w,{lines:SB_SCRIPT,title:"payroll_export.py",a:la,codeA:1});
      const ga=ag_in(tt,T.project-0.3,0.6);sb_git(cx,M.x,150,M.w,600,{a:ga,k:sb_k(tt,T.project-0.3),files:ag_in(tt,T.beside-0.3,1.0),history:ag_in(tt,T.kept-0.3,0.5),rows:clamp((tt-T.who+0.4)/0.8,0,2)});}},
    // its sums, a model in dbt; payroll's rule written once, on HR's calendar of pay days; then the test, written first
    {later:true,at:modelAt,place:"map",keys:[[0,960,540,1.0]],push:0,draw:(cx,tt)=>{
      const da=ag_in(tt,modelAt+0.1,0.5)*(1-ag_in(tt,T.first-0.9,0.4));
      md_window(cx,M.x,130,M.w,300,{logo:"dbt",product:"dbt",title:"mart_finance__casual_pay_paid",a:da,draw:(w,b)=>{
        [["{{ pay_day_for('claims.approved_at') }}",1],["sum(hours) as hours_paid,",0],["sum(amount) as casual_pay_paid",0],["group by pay_day, faculty, unit",0]].forEach(([s,r],i)=>{
          const lit=r?ag_in(tt,T.once-0.3,0.5):0;if(lit>0){w.fillStyle=rgba(MD.agreed,0.13*lit);rr(w,b.x-6,b.y+8+i*44,b.w+12,42,8);w.fill();}
          md_T(w,s,b.x+8,b.y+38+i*44,{w:500,size:28,f:"mono",col:lit>0.5?MD.agreed:MD.ink,a:clamp((tt-T.sums+0.3-i*0.25)/0.4,0,1)});});}});
      sb_test(cx,M.x,130,M.w,{a:ag_in(tt,T.first-0.4,0.5),k:sb_k(tt,T.first-0.4),r1:ag_in(tt,T.e59-0.3,0.4),r2:ag_in(tt,T.t01-0.3,0.4),p1:ag_in(tt,T.paid-0.1,0.4),p2:ag_in(tt,T.twoW-0.1,0.4),pass:ag_in(tt,T.twoW+0.4,0.5)});
      sb_calendar(cx,M.x,500,M.w,{a:ag_in(tt,T.cal-0.4,0.6),lit:tt>T.first-0.2?1:null});
      md_tag(cx,M.x+M.w/2,466,"A change here asks HR to review it",{col:MD.wait,icon:"person",a:ag_io(tt,T.asks-0.2,T.first-0.9,0.4),align:"center"});
      md_pill(cx,M.x+M.w/2,466,"Confirmed by HR",{col:MD.pass,icon:"tick",size:28,a:ag_io(tt,T.confirmed-0.1,T.asks-0.5,0.4)});}},
    // In the weeds of data crafting shows how: three films
    {later:true,at:weedsAt,place:"map",keys:[[0,960,540,1.0]],push:0,draw:(cx,tt)=>{
      md_label(cx,M.x,180,"In the weeds of data crafting",{a:ag_in(tt,weedsAt+0.6,0.5)});
      [["Declare it, then build it",T.declare],["Promises and proofs",T.promises],["Built in layers",T.layers]].forEach(([w_,at_],i)=>
        md_textCard(cx,M.x,230+i*170,M.w,{kick:"Film",title:w_},{edge:MD.flow,icon:"doc",a:ag_in(tt,at_-0.2,0.5),k:sb_k(tt,at_-0.2)}));}},
    // each change on a branch, back as a pull request, with checks that build it and run every test
    {later:true,at:branchAt,place:"map",keys:[[0,960,540,1.0]],push:0,draw:(cx,tt)=>{
      sb_branch(cx,M.x,M.x+M.w,190,M.x+130,M.x+M.w-130,{a:ag_in(tt,branchAt+0.6,0.5),u:clamp((tt-T.br+0.2)/1.4,0,1),name:"payroll-export-model"});
      sb_pr(cx,M.x,400,M.w,{title:"Payroll's export as a model",by:"Jun Park",a:ag_in(tt,T.pr-0.2,0.5),k:sb_k(tt,T.pr-0.2),checks:[ag_in(tt,T.build,0.4),ag_in(tt,T.every,0.4)],checksA:ag_in(tt,T.build-0.6,0.4),review:0,reviewA:ag_in(tt,T.every+0.8,0.5)});}}
  ],0.6);
  // Jun, and Sam, who steps aside for Ingrid from HR while the rule is confirmed, then comes back
  sb_who(ctx,S,t,"jun",sb_there(t,T.jun-0.6));sb_tagOf(ctx,S,"jun",ag_in(t,T.jun-0.2,0.5),{role:"Data project"});
  const sa=sb_there(t,T.sam-0.6,T.ingridN-1.5)+ag_in(t,branchAt+0.6,0.6);sb_who(ctx,S,t,"sam",sa);sb_tagOf(ctx,S,"sam",sa,{role:"Data platform"});
  const ia=sb_there(t,T.ingridN-0.7,T.first+0.4);sb_who(ctx,S,t,"ingrid",ia);sb_tagOf(ctx,S,"ingrid",ia,{role:"HR"});
});

/* ---------------------------------------------------------------- 4 · Someone else reads it */
scene("review",(ctx,S,t,sc)=>{const c=sc.cues,T=sb_once(sc,"T",()=>({
    someone:wAt(sc,"other","someone other"),reviews:wAt(sc,"other","reviews it"),
    junW:wAt(sc,"swap","Jun wrote"),samR:wAt(sc,"swap","so Sam reviewed"),samW:wAt(sc,"swap","Sam wrote the job"),junR:wAt(sc,"swap","so Jun reviewed"),
    nothing:wAt(sc,"merge","Nothing merges"),green:wAt(sc,"merge","every check green"),cws:wAt(sc,"surprises","Change without surprises"),reaches:wAt(sc,"surprises","reaches the people"),
    agentW:wAt(sc,"agents","an agent writes"),proposes:wAt(sc,"agents","proposes"),approves:wAt(sc,"agents","a person approves")}));
  const M=SB_MID,surAt=c.surprises-0.5,agAt=c.agents-0.5,end=sc.dur-1.6;
  ag_shots(ctx,S,t,sc.dur,[
    // Jun's change, reviewed by Sam; Sam's, reviewed by Jun; merged once reviewed and green
    {at:0,place:"map",keys:[[0,960,540,1.0]],push:0,draw:(cx,tt)=>{
      // the branch the last chapter drew leaves; Jun's pull request rises to make room for Sam's
      sb_branch(cx,M.x,M.x+M.w,190,M.x+130,M.x+M.w-130,{a:1-ag_in(tt,0.9,0.5),u:1,name:"payroll-export-model"});
      const up=ag_sine(clamp((tt-1.3)/1.4,0,1)),y1=lerp(400,150,up),merged=ag_in(tt,T.green-0.1,0.5);
      const p1=sb_pr(cx,M.x,y1,M.w,{title:"Payroll's export as a model",by:"Jun Park",checks:[1,1],review:tt>T.samR+0.3?1:0,reviewer:"Sam Okafor",merged});
      const p2=sb_pr(cx,M.x,460,M.w,{title:"A job for the export",by:"Sam Okafor",a:ag_in(tt,T.samW-0.3,0.5),k:sb_k(tt,T.samW-0.3),checks:[1,1],review:tt>T.junR+0.3?1:0,reviewer:"Jun Park",merged});
      // who reviews whose: a line from each reviewer to the other's pull request
      const l1=ag_io(tt,T.samR-0.4,T.green-0.4,0.4),l2=ag_io(tt,T.junR-0.4,T.green-0.4,0.4);
      if(l1>0)md_lane(cx,md_curve([1520,500],[p1.x+p1.w+8,p1.y+p1.h-44],{bend:0.4}),MD.wait,l1*0.9,{u:clamp((tt-T.samR+0.4)/0.7,0,1)});
      if(l2>0)md_lane(cx,md_curve([400,560],[p2.x-8,p2.y+p2.h-44],{bend:0.4}),MD.wait,l2*0.9,{u:clamp((tt-T.junR+0.4)/0.7,0,1)});
      md_tag(cx,M.x+M.w/2,96,"Reviewed by someone other than its author",{align:"center",col:MD.wait,icon:"person",a:ag_io(tt,T.someone-0.2,T.green+1.5,0.5)});}},
    // Change without surprises: how a change reaches the people it touches
    {later:true,at:surAt,place:"map",keys:[[0,960,540,1.0]],push:0,draw:(cx,tt)=>{
      md_textCard(cx,M.x,330,M.w,{kick:"A series of its own",title:"Change without surprises",sub:"how a change reaches the people it touches"},{edge:MD.flow,icon:"doc",a:ag_in(tt,T.cws-0.3,0.5),k:sb_k(tt,T.cws-0.3)});}},
    // an agent's change: the agent proposes, a person approves
    {later:true,at:agAt,place:"map",keys:[[0,960,540,1.0]],push:0,draw:(cx,tt)=>{const go=1-ag_in(tt,end,0.8);cx.save();cx.globalAlpha*=go;
      sb_pr(cx,M.x,240,M.w,{title:"A test for Easter's early close",by:"an agent",agent:true,t:tt,a:ag_in(tt,T.agentW-0.3,0.5),k:sb_k(tt,T.agentW-0.3),checks:[1,1],review:tt>T.approves+0.2?1:0,reviewer:"Jun Park"});
      md_tag(cx,M.x+M.w/2,560,"An agent proposes · a person approves",{align:"center",col:MD.agreed,icon:"contract",size:32,a:ag_in(tt,T.proposes-0.2,0.5)});cx.restore();}}
  ],0.6);
  const pa=1-ag_in(t,end,0.8);sb_who(ctx,S,t,"jun",pa);sb_tagOf(ctx,S,"jun",pa,{role:"Data project"});sb_who(ctx,S,t,"sam",pa);sb_tagOf(ctx,S,"sam",pa,{role:"Data platform"});
});

/* ---------------------------------------------------------------- 5 · The same way, every time */
const SB_BUNDLE=[{s:"bundle:"},{s:"  name: data_project"},{s:"include:"},{s:"  - resources/*.yml",j:1},{s:"targets:"},{s:"  dev:",w:1},{s:"  test:",w:1},{s:"  prod:",w:1}];
const SB_ROAD=[{n:"Pull request",x:96,icon:"doc"},{n:"main",x:536,icon:"tick"},{n:"Test",x:976,icon:"refresh"},{n:"Production",x:1416,icon:"store"}];
scene("release",(ctx,S,t,sc)=>{const c=sc.cues,T=sb_once(sc,"T",()=>({
    file:wAt(sc,"bundle","a file too"),dab:wAt(sc,"bundle","Declarative"),jobs:wAt(sc,"bundle","project's jobs"),where:wAt(sc,"bundle","where each one runs"),
    six:wAt(sc,"job","at six"),builds:wAt(sc,"job","builds and tests"),reads:wAt(sc,"job","everything it reads"),
    merged:wAt(sc,"test","merged"),deployed:wAt(sc,"test","deployed to test"),first:wAt(sc,"test","runs there first"),
    waits:wAt(sc,"noor","waits for Noor"),approves:wAt(sc,"noor","When she approves"),prod:wAt(sc,"noor","go to production"),
    acct:wAt(sc,"account","platform's own account"),laptop:wAt(sc,"account","nobody deploys"),
    sameF:wAt(sc,"drift","same files"),sameS:wAt(sc,"drift","same steps"),driftW:wAt(sc,"drift","drift apart"),
    morning:wAt(sc,"today","This morning"),e18:wAt(sc,"today","eighteenth"),n856:wAt(sc,"today","eight hundred")}));
  const roadAt=c.test-0.5,todayAt=c.today-0.5;
  ag_shots(ctx,S,t,sc.dur,[
    // the bundle: a file that lists the project's jobs and where each one runs; payroll's export, at six every Thursday
    {at:0,place:"map",keys:[[0,960,540,1.0]],push:0,draw:(cx,tt)=>{
      const jl=ag_in(tt,T.jobs-0.2,0.5)*(1-ag_in(tt,T.where-0.2,0.4)),wl=ag_in(tt,T.where-0.2,0.5);
      sb_file(cx,96,140,760,"databricks.yml",SB_BUNDLE.map((l,i)=>({s:l.s,lit:l.j?jl:l.w?wl:0,col:l.j&&jl>0.5||l.w&&wl>0.5?MD.flow:MD.ink,a:clamp((tt-T.file+0.2-i*0.12)/0.4,0,1)})),{a:ag_in(tt,T.file-0.3,0.5),k:sb_k(tt,T.file-0.3)});
      md_tag(cx,96,96,"A Declarative Automation Bundle",{col:MD.flow,a:ag_in(tt,T.dab-0.2,0.5)});
      const wa=ag_in(tt,T.jobs-0.3,0.6);md_window(cx,940,140,884,500,{logo:"databricks",product:"Databricks",title:"Jobs",a:wa,k:sb_k(tt,T.jobs-0.3),draw:(w,b)=>{
        md_T(w,"Payroll's export",b.x+10,b.y+46,{w:800,size:40});
        md_rows(w,b.x,b.y+76,[{h:"",w:200},{h:"",w:b.w-200}],[["Runs","Thursdays at 06:00, Sydney"],["Task","dbt build"],["As","the platform's own account"]],{rowA:(r,i)=>i===2?ag_in(tt,T.acct,0.4):ag_in(tt,(i?T.builds:T.six)-0.2,0.4)});
        const ra=ag_in(tt,T.reads-0.2,0.5);if(ra>0){const items=["claims","units","pay days"];items.forEach((s,i)=>{const x=b.x+10+i*250;md_icon(w,"tick",x+16,b.y+330,30,MD.pass,{a:ra});md_T(w,s,x+40,b.y+340,{w:600,size:28,a:ra});});
          md_T(w,"built and tested first",b.x+10,b.y+392,{w:600,size:28,col:MD.soft,a:ra});}}});}},
    // the road to production: merged, deployed to test, run there; then Noor approves, and the same files go to production
    {later:true,at:roadAt,place:"map",keys:[[0,960,540,1.0]],push:0,draw:(cx,tt)=>{
      const lit=[ag_in(tt,roadAt+0.6,0.4),ag_in(tt,T.merged-0.1,0.4),ag_in(tt,T.deployed+0.4,0.4),ag_in(tt,T.prod,0.4)];
      const waitA=ag_in(tt,T.waits-0.2,0.4)*(1-ag_in(tt,T.approves,0.3));
      const boxes=SB_ROAD.map((r,i)=>{const isP=i===3,sub=i===2?(tt>T.first?"the job ran first":"deployed by the platform"):isP?(tt>T.approves?"approved by Noor":waitA>0?"waits for Noor":"after an approval"):i===1?"merged, reviewed":"checks green";
        return sb_stage(cx,r.x,180,i===3?408:380,{name:r.n,sub,icon:r.icon,lit:isP&&waitA>0.02?waitA:lit[i],col:isP&&waitA>0.02?MD.wait:MD.pass,a:ag_in(tt,roadAt+0.5+i*0.15,0.5),subCol:i===2&&tt>T.first||isP&&tt>T.approves?MD.pass:isP&&waitA>0.5?MD.wait:MD.soft});});
      for(let i=0;i<3;i++){const a_=boxes[i].r,b_=boxes[i+1].l;md_lane(cx,md_path([[a_[0]+6,a_[1]],[b_[0]-6,b_[1]]]),MD.flow,0.8*ag_in(tt,roadAt+0.8,0.5),{});}
      // the same files, carried to test and then to production
      const carry=(t0,i)=>{const u=ag_sine(clamp((tt-t0)/1.2,0,1));if(u<=0||u>=1)return;const a_=boxes[i].r,b_=boxes[i+1].l;for(let k=0;k<3;k++)md_icon(cx,"doc",lerp(a_[0],b_[0],u)+k*10-10,a_[1]-k*6,34,MD.flow,{a:Math.min(1,u*8,(1-u)*8)});};
      carry(T.deployed-0.5,1);carry(T.prod-0.4,2);
      const files=(x,a_)=>{if(a_<=0.004)return;for(let k=0;k<3;k++)md_icon(cx,"doc",x-24+k*24,370,36,MD.flow,{a:a_});};
      files(1166,ag_in(tt,T.deployed+0.6,0.4));files(1620,ag_in(tt,T.prod+0.7,0.4));
      md_tag(cx,1166,440,"same files",{align:"center",col:MD.flow,a:ag_in(tt,T.sameF-0.2,0.4)});md_tag(cx,1620,440,"same files",{align:"center",col:MD.flow,a:ag_in(tt,T.sameF,0.4)});
      md_tag(cx,1166,520,"same steps",{align:"center",col:MD.flow,a:ag_in(tt,T.sameS-0.2,0.4)});
      md_pill(cx,1166,610,"No drift",{col:MD.pass,icon:"tick",size:28,a:ag_in(tt,T.driftW-0.2,0.4),k:sb_k(tt,T.driftW-0.2)});
      // as the platform's own account, never a person's; nobody deploys from a laptop
      md_tag(cx,96,400,"Runs as the platform's own account",{col:MD.flow,icon:"key",a:ag_in(tt,T.acct-0.2,0.5)});
      md_tag(cx,96,490,"Nobody deploys from a laptop",{col:MD.fail,icon:"cross",a:ag_in(tt,T.laptop-0.2,0.5)});}},
    // this morning at six: the eighteenth run, and 856 casual staff paid today
    {later:true,at:todayAt,place:"map",keys:[[0,960,540,1.0]],push:0,draw:(cx,tt)=>{const go=1-ag_in(tt,sc.dur-1.6,0.8);cx.save();cx.globalAlpha*=go;
      md_window(cx,360,150,1200,400,{logo:"databricks",product:"Databricks",title:"Payroll's export · runs",a:ag_in(tt,todayAt+0.6,0.5),draw:(w,b)=>{
        sb_runs(w,b.x+10,b.y+6,b.w-20,[["18","Thursday 5 November 2026, 06:00","Succeeded"],["17","Thursday 22 October 2026, 06:00","Succeeded"],["16","Thursday 8 October 2026, 06:00","Succeeded"]],{lit:tt>T.e18-0.2?0:null,litCol:MD.pass,rowA:(r,i)=>ag_in(tt,T.morning+0.2+i*0.15,0.4)});}});
      md_pill(cx,960,640,"856 casual staff paid today",{col:MD.pass,icon:"tick",size:34,a:ag_in(tt,T.n856-0.1,0.5),k:sb_k(tt,T.n856-0.1)});cx.restore();}}
  ],0.6);
  // Noor Rahman, the data architect, who approves the release
  const na=sb_there(t,T.waits-0.8,todayAt-0.2);sb_who(ctx,S,t,"noor",na);sb_tagOf(ctx,S,"noor",na,{role:"Data architect",at:[1450,780]});
});

/* ---------------------------------------------------------------- 6 · What to keep */
const SB_KEEP=[["In Git",null,"github",MD.ink],["Tested","tick",null,MD.pass],["Reviewed by someone else","person",null,MD.wait],["Deployed the same way every time","refresh",null,MD.flow]];
scene("choose",(ctx,S,t,sc)=>{const c=sc.cues,T=sb_once(sc,"T",()=>({
    softW:wAt(sc,"decades","software"),took:wAt(sc,"decades","data work took"),asB:wAt(sc,"decades","as bridges"),
    inGit:wAt(sc,"keep","in Git"),tested:wAt(sc,"keep","tested"),reviewed:wAt(sc,"keep","reviewed"),deployed:wAt(sc,"keep","deployed"),
    nextF:wAt(sc,"night","next film"),fails:wAt(sc,"night","a job fails"),std:wAt(sc,"wheel","standards"),wheelW:wAt(sc,"wheel","reinvent the wheel"),
    inv:wAt(sc,"docs","Investigate"),adapt:wAt(sc,"docs","adapt"),impl:wAt(sc,"docs","implement"),iter:wAt(sc,"docs","iterate"),off:wAt(sc,"docs","official docs")}));
  const keepAt=c.keep-0.5,nightAt=c.night-0.5,wheelAt=c.wheel-0.5,end=sc.dur-1.6;
  ag_shots(ctx,S,t,sc.dur,[
    // none of this is new: software's way of working, taken up by data work, as bridges took up the wind tunnel
    {at:0,place:"map",keys:[[0,960,540,1.0]],push:0,draw:(cx,tt)=>{
      sb_nextDoor(cx,tt,{y:200,r2:ag_in(tt,T.softW-0.3,0.6),arrow2:clamp((tt-T.took+0.2)/1.1,0,1),lit2:ag_in(tt,T.took+0.6,0.6),r1:ag_in(tt,T.asB-0.3,0.6),arrow1:clamp((tt-T.asB)/1.1,0,1)});}},
    // so keep data work as software: in Git, tested, reviewed by someone else, deployed the same way every time
    {later:true,at:keepAt,place:"map",keys:[[0,960,540,1.0]],push:0,draw:(cx,tt)=>{
      SB_KEEP.forEach(([w_,ic,lg,col],i)=>{const x=96+i*436,a_=ag_in(tt,[T.inGit,T.tested,T.reviewed,T.deployed][i]-0.2,0.5);if(a_<=0.004)return;cx.save();cx.globalAlpha*=a_;
        ag_about(cx,x+200,400,lerp(0.6,1,ag_spr(sb_k(tt,[T.inGit,T.tested,T.reviewed,T.deployed][i]-0.2),0,0.5)));md_card(cx,x,280,400,240,{edge:col,glow:0.6});
        if(lg&&typeof LOGO!=="undefined"&&LOGO[lg])logo(cx,lg,x+28,312,52);else md_icon(cx,ic,x+56,338,52,col);
        md_wrap(cx,w_,344,{w:800,size:36}).forEach((l,j)=>md_T(cx,l,x+28,428+j*46,{w:800,size:36}));cx.restore();});}},
    // the next film
    {later:true,at:nightAt,place:"map",keys:[[0,960,540,1.0]],push:0,draw:(cx,tt)=>{
      md_textCard(cx,460,320,1000,{kick:"Next · Film 2 of 2",title:"A platform that watches itself",sub:"a night when a job fails"},{edge:MD.flow,icon:"doc",a:ag_in(tt,T.nextF-0.3,0.5),k:sb_k(tt,T.nextF-0.3)});}},
    // standards already exist: start from the official docs, then investigate, adapt, implement and iterate
    {later:true,at:wheelAt,place:"map",keys:[[0,960,540,1.0]],push:0,draw:(cx,tt)=>{const go=1-ag_in(tt,end,0.8);cx.save();cx.globalAlpha*=go;
      const ma=ag_in(tt,wheelAt+0.5,0.5)*(1-ag_in(tt,T.inv-0.6,0.5));md_mark(cx,960,340,92,(tt-wheelAt-0.5)/1.8,ma);
      md_T(cx,"Standards already exist",960,540,{w:800,size:44,align:"center",a:ag_in(tt,T.std-0.2,0.5)*(1-ag_in(tt,T.inv-0.6,0.5))});
      md_T(cx,"Don't reinvent the wheel",960,604,{w:600,size:36,align:"center",col:MD.soft,a:ag_in(tt,T.wheelW-0.2,0.5)*(1-ag_in(tt,T.inv-0.6,0.5))});
      [["databricks","Databricks","Declarative Automation Bundles"],["dbt","dbt","Data tests and unit tests"],["github","GitHub","Protected branches and environments"]].forEach(([lg,pr,ti],i)=>
        sb_doc(cx,96+i*586,250,556,{logo:lg,product:pr,title:ti,a:ag_in(tt,T.off-0.5+i*0.15,0.5),k:sb_k(tt,T.off-0.5+i*0.15)}));
      const steps=[["Investigate",T.inv],["Adapt",T.adapt],["Implement",T.impl],["Iterate",T.iter]];let x=96;
      steps.forEach(([w_,at_],i)=>{const b=md_tag(cx,x,540,w_,{col:i===3?MD.pass:MD.flow,icon:i===3?"refresh":null,size:32,a:ag_in(tt,at_-0.15,0.4)});
        if(i<3){const ar=ag_in(tt,steps[i+1][1]-0.3,0.4);if(ar>0){cx.strokeStyle=rgba(MD.ink,0.7*ar);cx.lineWidth=3;cx.beginPath();cx.moveTo(b.x+b.w+14,540);cx.lineTo(b.x+b.w+56,540);cx.stroke();}}x+=b.w+70;});
      cx.restore();}}
  ],0.6);
});

/* ---------------------------------------------------------------- 7 · Still standing */
scene("stands",(ctx,S,t,sc)=>{const c=sc.cues,T=sb_once(sc,"T",()=>({
    b50:wAt(sc,"bridge","nineteen fifty"),tb:wAt(sc,"bridge","tested before"),still:wAt(sc,"bridge","still stands"),
    pe:wAt(sc,"export","Payroll's export"),tbe:wAt(sc,"export","tested before"),another:wAt(sc,"export","just another Thursday"),dw:wAt(sc,"takeaway","Data work")}));
  const mapAt=c.export-0.6,lastAt=c.takeaway-0.5;
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"sbNarrows",keys:[[0,960,560,1.0]],push:0.03,draw:(cx,tt)=>{
      sb_wind(cx,tt,{n:20,speed:480,tilt:0.05,a:0.45,seed:29,len:200});sb_bridge(cx,{t:tt+40,era:1950,gallop:0.03,cars:1,lamps:1});
      md_tag(cx,960,470,"Tested before it was built",{align:"center",col:MD.pass,icon:"tick",a:ag_in(tt,T.tb-0.15,0.5)});}},
    // payroll's export: tested before every change; pay day, just another Thursday
    {at:mapAt,place:"map",keys:[[0,960,540,1.0]],push:0,draw:(cx,tt)=>{
      md_label(cx,960,250,"Payroll's export · pay days",{align:"center",a:ag_in(tt,T.pe-0.3,0.5)});
      const days=["8 Oct","22 Oct","5 Nov","19 Nov"];days.forEach((d,i)=>{const x=510+i*300,a_=ag_in(tt,T.pe+i*0.25,0.4),now=i===2;if(a_<=0.004)return;cx.save();cx.globalAlpha*=a_;
        md_card(cx,x-120,300,240,200,{edge:now?MD.pass:null,glow:now?0.8:0});md_T(cx,"Thursday",x,356,{w:600,size:28,align:"center",col:MD.soft});md_T(cx,d,x,410,{w:800,size:40,align:"center"});
        if(i<3)md_icon(cx,"tick",x,462,40,MD.pass,{a:ag_in(tt,T.tbe+i*0.2,0.4)});else md_icon(cx,"clock",x,462,36,MD.soft);cx.restore();});
      md_tag(cx,960,590,"just another Thursday",{align:"center",col:MD.ink,a:ag_in(tt,T.another-0.2,0.5)});}},
    {later:true,at:lastAt,place:"map",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      md_T(cx,"Data work is software.",960,520,{w:800,size:72,align:"center",a:ag_in(tt,T.dw-0.2,0.6)*(1-ag_in(tt,c.breath-0.3,0.5))});}}
  ],0.6);
  setScreen(ctx,S);md_label(ctx,96,110,"Tacoma Narrows · today",{a:ag_in(t,0.3,0.6)*(1-ag_in(t,mapAt-0.8,0.5))});
  md_end(ctx,S,t,c.breath,"Scripts became software","Data work is software.","Film 1 of 2","Data as software");
});

ag_cutInto(["laptop","project","review","release","choose"]);
