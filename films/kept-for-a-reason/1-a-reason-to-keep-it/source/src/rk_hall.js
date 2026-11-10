/* ===== A reason to keep it: the hall and what is shown in it =====
   The module's hall at night (hall.js), with pools of light where Ingrid stands, at the left, and where Mei, Clara and Linh stand in
   turn, at the right; Ingrid stays in her place in every chapter, so the hall's later moments (later:true) keep her (AG_BARE). In it:
   the ten pieces HR holds about Linh, each a card of glass, its label clear and its value under violet frost; the reason that allows
   each, a green pill (green: allowed) on the card's top edge, or an empty outline, "for: ?", where none is said yet; the band of the
   six reasons; the 2023 and 2027 application forms; the consent line; the wishes kept on the person and the mailing list built from
   them; the privacy check, the counts it allows and the deeper check; and the small cards that bring back Oregon. Every word is at
   least 28 px at the camera's widest (z 1) and stands out 4.5 to 1. Every top-level name starts with rk_ or RK_. */

AG_PLACES.rkHall=c=>dp_paintHall(c,{seed:18,horizon:640,vx:980,pools:[[180,1010,420,0.13],[1750,1010,420,0.11],[960,900,760,0.05]]});
DP_PEOPLE.push("ingrid","mei","clara","linh");
// where the people stand: Ingrid at the left, facing right; the person at the right facing left (neck x, y, size)
const RK_IN=[180,690,0.86],RK_RT=[1750,690,0.86];
function rk_ingrid(ctx,t,o){dp_person(ctx,"ingrid",RK_IN[0],RK_IN[1],RK_IN[2],Object.assign({t,gaze:[3,0]},o||{}));}
function rk_right(ctx,who,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;withA(ctx,a,()=>dp_person(ctx,who,RK_RT[0]+(o.dx||0),RK_RT[1],RK_RT[2],Object.assign({t,flip:true,gaze:[3,0]},o)));}
AG_BARE.rkHall=(ctx,t)=>rk_ingrid(ctx,t);

/* ---------------------------------------------------------------- the pieces and their reasons */
const RK_WORDS={agreed:"agreed",contract:"contract",law:"law",task:"public task",life:"someone's life",fair:"fair interest"};
const RK_ORDER=["agreed","contract","law","task","life","fair"];
const RK_PIECES=[
  {label:"Contracts",reason:"contract"},{label:"Hours",reason:"contract"},{label:"Bank details",reason:"contract"},
  {label:"Tax number",reason:"law"},{label:"Pay records",reason:"law"},
  {label:"Date of birth",reason:"law"},{label:"Tutors' mailing list",reason:"agreed"},{label:"Marital status",reason:null},
  {label:"Photo",reason:null},{label:"Student records",reason:"task"}];
const RK_CW=230,RK_CH=150,RK_COL=[344,590,836,1082,1328],RK_ROW=[300,500];
// where piece i sits in the two rows (gap: Student records moved into the place Marital status left, 0 to 1)
function rk_home(i,gap){const r=i<5?0:1,c=i<5?i:i-5;let x=RK_COL[c];if(i===9&&gap)x=lerp(RK_COL[4],RK_COL[2],ag_sine(gap));return[x,RK_ROW[r]];}
// an empty outline on a card's top edge, the question "for: ?" in it (cx its middle, y the card's top edge)
function rk_outline(ctx,cx,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const text=o.text||"for: ?",w=dp_tw(ctx,text,{w:700,size:28})+36,h=48,col=o.col?dp_f(o.col):[190,214,216];
  ctx.save();ctx.globalAlpha*=a;rr(ctx,cx-w/2,y-h/2,w,h,h/2);ctx.fillStyle="rgba(6,22,28,0.92)";ctx.fill();ctx.setLineDash([7,6]);ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=2.2;ctx.stroke();ctx.setLineDash([]);
  dp_T(ctx,text,cx,y+10,{w:700,size:28,align:"center",col:o.col||"mut"});ctx.restore();}
// a reason's pill, its middle at (cx, cy); k springs it from a little larger (landing)
function rk_reason(ctx,key,cx,cy,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null&&o.k!==1)ag_about(ctx,cx,cy,o.k);
  dp_pill(ctx,cx,cy+12,RK_WORDS[key]||key,"allowed",{align:"center",glow:o.glow});ctx.restore();}
// a value under violet frost, on a card: a bar of blurred light, never readable
function rk_value(ctx,x,y,w,o){dp_frost(ctx,x,y,w,30,c=>{c.fillStyle="rgba(240,236,255,0.9)";c.fillRect(x+12,y+9,w*0.62,12);},Object.assign({r:9},o||{}));}
/* a piece: o.x, o.y (its top left; its home by default), a, k (springs it in), pill (a reason's key: its pill sits on the top edge),
   land (0 to 1: the pill landing), outline (0 to 1: the empty "for: ?"), coral (0 to 1: its rim turns coral), dim (0 to 1: its rim and
   words fade a little), lit (0 to 1: it glows), thick (0 to 1: its value's frost thickens) */
function rk_piece(ctx,i,o){o=o||{};const P=RK_PIECES[i],h0=rk_home(i,o.gap),x=o.x==null?h0[0]:o.x,y=o.y==null?h0[1]:o.y,a=o.a==null?1:o.a;if(a<=0)return;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+RK_CW/2,y+RK_CH/2,lerp(0.94,1,o.k));
  const cor=clamp(o.coral||0,0,1),dim=clamp(o.dim||0,0,1),lit=clamp(o.lit||0,0,1);
  dp_panel(ctx,x,y,RK_CW,RK_CH,{col:cor>0.5?"coral":"violet",r:18,glowA:(0.7+lit*1.2+cor*0.8)*(1-dim*0.6),glowR:30+lit*24,behind:o.behind});
  const lines=ag_wrap(ctx,P.label,RK_CW-36,{w:700,size:30});lines.forEach((l,j)=>dp_T(ctx,l,x+18,y+(lines.length>1?50:58)+j*36,{w:700,size:30,a:1-dim*0.25}));
  rk_value(ctx,x+18,y+RK_CH-44,RK_CW-36,{behind:o.behind});
  if(o.thick>0)dp_frost(ctx,x+12,y+RK_CH-50,RK_CW-24,42,null,{col:"violet",a:clamp(o.thick,0,1)*0.85,r:10,behind:o.behind});
  const cx=x+RK_CW/2;
  if(o.outline>0&&!(o.pill&&o.land>=1))rk_outline(ctx,cx,y,{a:o.outline*(o.pill?1-clamp(o.land||0,0,1):1),col:o.outCol});
  // the reason lands on the piece's top edge: it fades in, and swells a little and settles over 0.6 s from when it starts to land
  if(o.pill&&o.land>0)rk_reason(ctx,o.pill,cx,y,{a:clamp(o.land*3,0,1),k:1+0.06*Math.sin(Math.PI*clamp((o.since==null?9:o.since)/0.6,0,1)),glow:o.glow});
  ctx.restore();}

/* ---------------------------------------------------------------- the band of the six reasons */
const RK_BAND=[344,150,1214,88];
// where reason k's pill sits in the band (its middle)
function rk_bandAt(key){const ws=RK_ORDER.map(k=>RK_PILLW[k]),tot=ws.reduce((s,w)=>s+w,0)+24*5;let x=RK_BAND[0]+(RK_BAND[2]-tot)/2;
  for(const k of RK_ORDER){if(k===key)return[x+RK_PILLW[k]/2,RK_BAND[1]+RK_BAND[3]/2];x+=RK_PILLW[k]+24;}return[0,0];}
const RK_PILLW={agreed:131,contract:154,law:82,task:184,life:230,fair:196};
// the band: its glass (a), each reason's pill as it lands (land[k] 0 to 1), one lifted (lift[k] 0 to 1)
function rk_band(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const [x,y,w,h]=RK_BAND;ctx.save();ctx.globalAlpha*=a;
  dp_panel(ctx,x,y,w,h,{col:"green",r:24,glowA:0.6,behind:o.behind});
  for(const k of RK_ORDER){const u=(o.land||{})[k]||0;if(u<=0)continue;const [cx,cy]=rk_bandAt(k),lift=((o.lift||{})[k]||0)*14;
    rk_reason(ctx,k,cx,cy-lift-(1-ag_spr(u,0,0.5))*30,{a:clamp(u*3,0,1)});}
  ctx.restore();}

/* ---------------------------------------------------------------- cards about people, and Oregon brought back */
const rk_owner=(ctx,a,o)=>dp_card(ctx,40,150,290,{kick:"Who decides",title:"Ingrid Holm",sub:"owns HR's data"},Object.assign({col:"cyan",a},o||{}));
const rk_whoRight=(ctx,kick,name,a,k)=>dp_card(ctx,1590,150,300,{kick,title:name},{col:"cyan",a,k});
// the small card that brings back the opening: "Oregon · 1986" and what it showed; at the top left unless o gives x, y and w
function rk_oregonCard(ctx,title,sub,a,k,o){o=o||{};return dp_card(ctx,o.x==null?40:o.x,o.y==null?150:o.y,o.w||290,{kick:"Oregon · 1986",title,sub},{col:"cyan",a,k});}
// Linh's card at the middle of the hall (x, y its top left), with her contract beside it, at its right (ended: 0 to 1, the contract has ended)
function rk_linhCard(ctx,x,y,a,o){o=o||{};if(a<=0)return;const b=dp_card(ctx,x,y,430,{kick:"Tutor since 2023",title:"Linh Nguyen"},{col:"cyan",a,k:o.k});
  if(o.contract>0){const e=clamp(o.ended||0,0,1);withA(ctx,a*o.contract,()=>{const sx=x+446;
    if(e<1)withA(ctx,1-e,()=>dp_slip(ctx,sx,b.y+(b.h-68)/2,"T-26188 · ends 20 Nov 2026","cyan",{size:28}));
    if(e>0)withA(ctx,e,()=>{const s=dp_slip(ctx,sx+52,b.y+(b.h-68)/2,"T-26188 · ended 20 Nov 2026","green",{size:28});dp_tick(ctx,sx+22,s.y+s.h/2,"green",clamp((e-0.3)/0.7,0,1));});});}
  return b;}

/* ---------------------------------------------------------------- the application forms
   rk_form(ctx, x, y, o): a tall sheet of frosted glass, 760 wide. year 2023: eight lines, each a label and its value under frost, then
   two ticked boxes (the news, and "I agree to ... for HR purposes"); mark[i] (0 to 1) rings line i in coral; stack (0 to 1) shows the
   sheets of everyone else who applied behind it. year 2027: four lines, the notice (open: 0 to 1, its three parts), and the one
   question (ask: 0 to 1, the box becomes a question with a Yes and a No, lit: 0 to 1, the No lit). */
const RK_F23=["Name","Email","Subjects you can teach","Experience","Marital status","Photo","Date of birth","Bank details"];
const RK_F27=["Name","Email","Subjects you can teach","Experience"];
function rk_box(ctx,x,y,ticked,col){ctx.save();rr(ctx,x,y-24,30,30,6);ctx.fillStyle="rgba(6,22,28,0.85)";ctx.fill();ctx.strokeStyle=rgba(dp_f(col||"cyan"),0.95);ctx.lineWidth=2.2;ctx.stroke();
  if(ticked>0){ctx.strokeStyle=rgba(DP.F.cyan,1);ctx.lineWidth=4;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(x+7,y-9);ctx.lineTo(x+13,y-3);ctx.lineTo(x+24,y-18);ctx.globalAlpha*=clamp(ticked,0,1);ctx.stroke();}ctx.restore();}
function rk_form(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return null;const w=760,mark=o.mark||{};ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+300,lerp(0.8,1,o.k));
  if(o.stack>0)for(let s=3;s>=1;s--)withA(ctx,clamp(o.stack*3-(3-s),0,1),()=>dp_panel(ctx,x+s*26,y-s*22,w,640,{col:"cyan",r:22,glowA:0.3,behind:o.behind}));
  if(o.year===2023){const h=650;dp_panel(ctx,x,y,w,h,{col:"cyan",r:22,behind:o.behind});dp_T(ctx,"Tutor application · 2023",x+30,y+60,{w:700,size:36});
    RK_F23.forEach((l,i)=>{const ly=y+118+i*50;dp_T(ctx,l,x+30,ly,{w:600,size:30});rk_value(ctx,x+430,ly-26,300,{behind:o.behind});
      const m=mark[i]||0;if(m>0)withA(ctx,clamp(m,0,1),()=>{rr(ctx,x+14,ly-38,w-28,48,12);ctx.strokeStyle=rgba(DP.F.coral,1);ctx.lineWidth=2.6;ctx.save();ctx.shadowColor=rgba(DP.F.coral,0.8);ctx.shadowBlur=10+(o.pulse||0)*18;ctx.stroke();ctx.restore();});});
    const ty=y+118+8*50+14;rk_box(ctx,x+30,ty,1);dp_T(ctx,"Send me news of tutoring work",x+76,ty,{w:600,size:30});
    rk_box(ctx,x+30,ty+56,1,mark.consent>0.5?"coral":"cyan");dp_T(ctx,"I agree to the university using my",x+76,ty+56,{w:600,size:30});dp_T(ctx,"personal data for HR purposes",x+76,ty+92,{w:600,size:30});
    ctx.restore();return{x,y,w,h};}
  const open=ag_sine(clamp(o.open||0,0,1)),ask=clamp(o.ask||0,0,1),h=470+open*150+ask*84;dp_panel(ctx,x,y,w,h,{col:"cyan",r:22,behind:o.behind});
  dp_T(ctx,"Tutor application · 2027",x+30,y+60,{w:700,size:36});
  RK_F27.forEach((l,i)=>{const ly=y+118+i*50;dp_T(ctx,l,x+30,ly,{w:600,size:30});rk_value(ctx,x+430,ly-26,300,{behind:o.behind});});
  // the notice: what HR holds, why, and for how long, said plainly; open, its three parts
  const ny=y+118+4*50+16;ctx.save();ctx.fillStyle=rgba(DP.F.cyan,1);ctx.beginPath();ctx.arc(x+45,ny-11,15,0,TAU);ctx.fill();ctx.restore();
  dp_T(ctx,"i",x+45,ny-1,{w:800,size:28,align:"center",col:DP.on});dp_T(ctx,"What we hold, why, and for how long",x+76,ny,{w:600,size:30});
  const oa=clamp((open-0.6)/0.4,0,1);if(oa>0)withA(ctx,oa,()=>["What we hold","Why","For how long"].forEach((l,i)=>{const ly=ny+48+i*46;dp_T(ctx,l,x+96,ly,{w:600,size:28,col:"mut"});
    ctx.fillStyle="rgba(190,214,216,0.35)";rr(ctx,x+330,ly-16,300-i*40,10,5);ctx.fill();}));
  // the one real question: a box, or, asked, the question with two answers the same size and colour
  const qy=ny+60+open*150;
  if(ask<1)withA(ctx,1-ask,()=>{rk_box(ctx,x+30,qy,0);dp_T(ctx,"Send me news of tutoring work",x+76,qy,{w:600,size:30});});
  if(ask>0)withA(ctx,ask,()=>{dp_T(ctx,"Send me news of tutoring work?",x+30,qy,{w:700,size:32});rk_choice(ctx,x+30,qy+30,"Yes",0);rk_choice(ctx,x+200,qy+30,"No",o.lit||0);});
  ctx.restore();return{x,y,w,h};}
// an answer: the same size and colour for either, so neither is the easy one; lit (0 to 1) when chosen
function rk_choice(ctx,x,y,text,lit){const w=140,h=56;ctx.save();ctx.shadowColor=rgba(DP.F.cyan,0.4+lit*0.5);ctx.shadowBlur=12+lit*20;rr(ctx,x,y,w,h,h/2);ctx.fillStyle="rgba(6,22,28,0.9)";ctx.fill();ctx.restore();
  rr(ctx,x+1,y+1,w-2,h-2,h/2-1);ctx.strokeStyle=rgba(mix(DP.F.cyan,[255,255,255],0.3*lit),1);ctx.lineWidth=2.4+lit*1.4;ctx.stroke();dp_T(ctx,text,x+w/2,y+38,{w:700,size:30,align:"center"});}

/* ---------------------------------------------------------------- consent, wishes and the list */
// the 2023 form's consent line, alone and large: ticked (1) or not (0), its rim coral (wrong 0 to 1)
function rk_consent(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,w=920,h=210,wr=clamp(o.wrong||0,0,1),tk=clamp(o.ticked==null?1:o.ticked,0,1);if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.8,1,o.k));dp_panel(ctx,x,y,w,h,{col:wr>0.5?"coral":"cyan",r:22,glowA:0.8+wr,behind:o.behind});
  rk_box(ctx,x+40,y+92,tk,wr>0.5?"coral":"cyan");dp_T(ctx,"“I agree to the university using my",x+90,y+92,{w:700,size:36});dp_T(ctx,"personal data for HR purposes.”",x+90,y+142,{w:700,size:36});
  if(o.no>0)withA(ctx,o.no,()=>dp_T(ctx,"no",x+90,y+188,{w:700,size:28,col:"coral"}));
  ctx.restore();}
// Linh's wishes, kept on the person: her card with a band, two lines, the news line turning to "no" (no: 0 to 1)
function rk_wishes(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,w=620,h=300,n=clamp(o.no||0,0,1);if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,o.k));
  dp_panel(ctx,x,y,w,h,{col:"cyan",r:22,behind:o.behind});dp_T(ctx,"Linh Nguyen",x+30,y+62,{w:700,size:36});dp_band(ctx,x,y+88,w,54,0,"cyan","Wishes");
  dp_T(ctx,"No fundraising asks · 2022",x+30,y+192,{w:600,size:30});
  if(n<1)withA(ctx,1-n,()=>dp_T(ctx,"News of tutoring work: yes · January 2023",x+30,y+244,{w:600,size:28}));
  if(n>0)withA(ctx,n,()=>dp_T(ctx,"News of tutoring work: no · 24 Nov 2026",x+30,y+244,{w:700,size:28,col:"coral"}));
  ctx.restore();}
// the list, built each semester from the yeses: five lines under frost and Linh's; out (0 to 1) takes hers away as it's built again
function rk_list(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,w=480,out=ag_sine(clamp(o.out||0,0,1)),rows=6,lh=56,h=110+(rows-out)*lh;if(a<=0)return;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,o.k));dp_panel(ctx,x,y,w,h,{col:"cyan",r:22,behind:o.behind});
  dp_T(ctx,"Tutors' mailing list · 2027",x+30,y+60,{w:700,size:32});
  for(let i=0;i<rows;i++){const yy=y+90+i*lh-(i>3?out*lh:0),mine=i===3,sh=(o.build==null?1:clamp(o.build*rows-i,0,1));if(sh<=0)continue;
    if(mine){if(out<1)withA(ctx,sh*(1-out),()=>dp_T(ctx,"Linh Nguyen",x+30,yy+38,{w:700,size:30}));}
    else withA(ctx,sh,()=>rk_value(ctx,x+30,yy+12,w-60-((i*67)%90),{behind:o.behind}));}
  ctx.restore();}

/* ---------------------------------------------------------------- the privacy check, its counts, and the deeper check */
const RK_Q=[["What is it for?",["to plan 2027's tutoring"]],["Does it fit why the data is held?",["yes, if it's only counts"]],["What's the least it needs?",["hours by unit and teaching period"]],
  ["Which reason allows it?",null],["What could go wrong, and for whom?",["one tutor's hours could show:","units under five tutors counted together"]],["Who decides?",["Ingrid Holm, HR"]]];
/* rk_check(ctx, x, y, o): q[i] and ans[i] (0 to 1) bring in each question and its answer; signed (0 to 1) the owner's yes */
function rk_check(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,w=720,h=720,q=o.q||[],an=o.ans||[];if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.85,1,o.k));
  const sg=clamp(o.signed||0,0,1);dp_panel(ctx,x,y,w,h,{col:sg>0.5?"green":"cyan",r:24,behind:o.behind});
  dp_T(ctx,"PRIVACY CHECK",x+30,y+52,{w:800,size:28,ls:4,col:"cyan"});
  // who keeps the check: a grey pill at the top right, beside its name
  if(o.kept>0)withA(ctx,o.kept,()=>dp_pill(ctx,x+w-24,y+56,"Kept by data governance","grey",{align:"right"}));
  let yy=y+104;RK_Q.forEach(([qs,as],i)=>{const qa=clamp(q[i]||0,0,1),aa=clamp(an[i]||0,0,1);
    if(qa>0)withA(ctx,qa,()=>dp_T(ctx,qs,x+30,yy,{w:700,size:30}));
    if(aa>0)withA(ctx,aa,()=>{if(!as)rk_reason(ctx,"task",x+40+RK_PILLW.task/2,yy+42,{});else as.forEach((l,j)=>dp_T(ctx,l,x+46,yy+38+j*34,{w:600,size:28,col:"green"}));});
    yy+=!as?100:as.length>1?112:78;});
  if(sg>0)withA(ctx,sg,()=>{const sy=y+638;dp_tick(ctx,x+50,sy-10,"green",clamp(sg*1.4,0,1));dp_T(ctx,"Signed yes: Ingrid Holm, 12 Nov 2026,",x+86,sy,{w:700,size:28});
    dp_T(ctx,"until the plan is set",x+86,sy+36,{w:600,size:28,col:"mut"});});
  ctx.restore();}
// the counts the check allows: three columns, the rows soft grey bars (counts, no names), and "no names"
function rk_counts(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,w=460,h=280,u=clamp(o.u==null?1:o.u,0,1);if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,o.k));
  dp_panel(ctx,x,y,w,h,{col:"grey",r:20,behind:o.behind});for(const [s,cx] of [["Unit",22],["Teaching period",98],["Hours",346]])dp_T(ctx,s,x+cx,y+52,{w:700,size:28});
  ctx.fillStyle="rgba(176,194,196,0.18)";ctx.fillRect(x+20,y+70,w-40,2);
  for(let i=0;i<4;i++){const ry=y+92+i*36,p=clamp(u*4-i,0,1);if(p<=0)continue;ctx.save();ctx.globalAlpha*=p;ctx.fillStyle=rgba(DP.F.grey,0.85);
    rr(ctx,x+22,ry,54,14,7);ctx.fill();rr(ctx,x+98,ry,120+((i*41)%70),14,7);ctx.fill();rr(ctx,x+346,ry,40+((i*29)%40),14,7);ctx.fill();ctx.restore();}
  if(o.tag>0)withA(ctx,o.tag,()=>dp_pill(ctx,x+w-24,y+h-20,"no names","grey",{align:"right"}));
  ctx.restore();}
const rk_request=(ctx,x,y,a,k)=>dp_card(ctx,x,y,460,{kick:"Request · 9 Nov 2026",title:"Tutors' records",sub:"to plan 2027's tutoring"},{col:"cyan",a,k});
const rk_deeper=(ctx,x,y,a,k)=>dp_card(ctx,x,y,460,{kick:"Deeper check",title:"Decides about a person",sub:"asks the people it's about"},{col:"cyan",a,k});

/* ---------------------------------------------------------------- what HR holds about Linh, and why: the answer she'll get */
function rk_answer(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,w=1120,h=400;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.8,1,o.k));
  dp_panel(ctx,x,y,w,h,{col:"green",r:24,behind:o.behind});dp_T(ctx,"What we hold, and why",x+34,y+64,{w:700,size:36});
  const keep=[0,1,2,3,4,5,6,9];keep.forEach((pi,j)=>{const col=j<4?0:1,row=j%4,lx=x+34+col*560,ly=y+130+row*66,u=clamp((o.u==null?1:o.u)*8-j,0,1);if(u<=0)return;
    withA(ctx,u,()=>{dp_T(ctx,RK_PIECES[pi].label,lx,ly+10,{w:600,size:30});rk_reason(ctx,RK_PIECES[pi].reason,lx+430,ly,{});});});
  ctx.restore();}
