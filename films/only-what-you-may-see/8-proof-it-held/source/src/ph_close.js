/* ===== Proof it held: the data's same problem, and the series' close =====
   Two masked values that look the same, one whose protection held and one whose didn't; the question a learner can ask; and the
   series' eight films, in two rows of four, the last with the monitor's square in its circle (the take-away is on the end card).
   Every name starts with ph_. */

// a masked value on frosted violet glass, with its label above: held (o.ok 1) or failed, which looks exactly the same
function ph_masked(ctx,x,y,w,label,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  dp_T(ctx,label,x+w/2,y-24,{w:700,size:30,align:"center",col:"mut"});
  dp_frost(ctx,x,y,w,120,c=>{c.fillStyle="rgb(240,240,250)";c.font=font(700,40);c.fillText("Samuel Osei",x+30,y+76);},{behind:o.behind});
  dp_lock(ctx,x+w-56,y+62,46,"violet",0);ctx.restore();}

// the question any learner can ask, and its two answers, each read from a record
function ph_asks(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+130,lerp(0.6,1,o.k));
  dp_panel(ctx,x,y,w,272,{col:"cyan",r:20,behind:o.behind,glowR:36});
  dp_T(ctx,"A LEARNER ASKS",x+30,y+52,{w:800,size:28,ls:3,col:"cyan"});
  dp_T(ctx,"Who could see my data?",x+30,y+120,{w:700,size:36});dp_T(ctx,"And who did?",x+30,y+172,{w:700,size:36});
  if(o.ans>0){dp_T(ctx,"answered from records, not memory",x+30,y+232,{w:600,size:28,col:"green",a:o.ans});}
  ctx.restore();}

// the series' eight films, two rows of four: their titles, ticked as they come in (n, 0 to 8); the last carries the monitor
const PH_SERIES=["An agreement first","Know what you hold","Show the least","Grants by design","Tags that travel","One policy for many tables","Copies that keep the rules","Proof it held"];
function ph_series(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const cw=436,ch=104,gx=16,gy=20;ctx.save();ctx.globalAlpha*=a;
  PH_SERIES.forEach((s,k)=>{const p=clamp((o.n||0)-k,0,1);if(p<=0)return;const cx=x+(k%4)*(cw+gx),cy=y+Math.floor(k/4)*(ch+gy),last=k===7;
    ctx.save();ctx.globalAlpha*=ag_in(p,0,0.6);dp_panel(ctx,cx,cy,cw,ch,{col:last?"green":"cyan",r:16,behind:o.behind,glowR:22});
    dp_T(ctx,(k+1)+"",cx+22,cy+64,{w:800,size:30,col:last?"green":"cyan"});dp_T(ctx,s,cx+56,cy+64,{w:700,size:28});
    if(last)ph_vvm(ctx,cx+cw-46,cy+ch/2,26,0.12);ctx.restore();});
  ctx.restore();}
