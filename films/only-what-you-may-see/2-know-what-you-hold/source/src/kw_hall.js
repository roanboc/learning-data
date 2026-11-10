/* ===== Know what you hold: the university's rooms in the hall =====
   Three rooms of the module's hall, each painted once (the kit's dp_paintHall): the registrar's office, where Mei keeps the learner
   table (chapters 2, 5 and 6); data governance, where Yusuf keeps the list of classes (chapters 3 and 4); and the wide hall where the
   study's own space and the published totals stand (chapters 7 and 8). The pools of light fall where people stand. */
AG_PLACES.kwOffice=c=>dp_paintHall(c,{seed:11,horizon:690,vx:1260,pools:[[1740,1010,520,0.13],[560,900,700,0.07]]});
AG_PLACES.kwGov=c=>dp_paintHall(c,{seed:23,horizon:700,vx:720,pools:[[1730,1010,520,0.13],[620,900,700,0.07]]});
AG_PLACES.kwWide=c=>dp_paintHall(c,{seed:5,horizon:720,vx:960,pools:[[300,1030,440,0.12],[1180,1030,440,0.12],[1600,900,560,0.06]]});
// the people the film shows, painted while the page is idle once Play is near
DP_PEOPLE.push("mei","yusuf");   // Anil is on cards only (his name card), never drawn

// where people stand in each room (x, y where the neck meets the shoulders, s), and the learner table's place in the office
const KW_AT={meiOffice:[1745,640,0.88],yusufGov:[1740,640,0.88],meiGov:[260,640,0.88]};
const KW_LTX=70,KW_LTY=236;
// a person who comes in or leaves, faded whole (the kit's people are pictures; ag_person fades them as one)
function kw_person(ctx,who,at,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.001)return;ctx.save();ctx.globalAlpha*=clamp(a,0,1);
  dp_person(ctx,who,at[0]+(o.dx||0),at[1],at[2],Object.assign({flip:true},o));ctx.restore();}
// the chapter's kicker, top left, in the frame (drawn after the shots); o.scrim lays a soft dark under it first, where a bright place
// (the aisle's near shelves) would show through its words
function kw_kick(ctx,S,top,title,a,o){if(!(a>0.001))return;setScreen(ctx,S);if(o&&o.scrim)kw_scrim(ctx,a);dp_kicker(ctx,top,title,{a});}
// a soft dark in the frame's top left, under a kicker and a title (as wide as the longest, fading out before the middle of the frame)
function kw_scrim(ctx,a){ctx.save();ctx.globalAlpha*=clamp(a,0,1);ctx.translate(250,118);ctx.scale(1,0.4);const R=600,g=ctx.createRadialGradient(0,0,0,0,0,R);
  g.addColorStop(0,"rgba(5,14,18,0.5)");g.addColorStop(0.45,"rgba(5,14,18,0.38)");g.addColorStop(1,"rgba(5,14,18,0)");ctx.fillStyle=g;ctx.fillRect(-R,-R,2*R,2*R);ctx.restore();}
