/* ===== Teachers of data: the eight chapters ===== */
// a test of the people (temporary)
function tt_testPeople(ctx,S,t,cam,place){setScreen(ctx,S);ctx.drawImage(gv_place(place),0,0,W,H);tt_signal(ctx,cam,0,1);
  const row=[["ttBag",-6.2,15.6,{pose:"tt_bag",carry:tt_heldBag([196,120,80])}],["ttSuit",-4.8,16.2,{pose:"tt_umbrella",umbrella:[40,40,48]}],["ttStudent",-3.4,15.2,{pose:"tt_whistle"}],
    ["ttFlatCap",-2.2,16,{pose:"tt_lips",expr:"ttWhistle",marks:(x,X,Y,k)=>tt_whistleMarks(x,X,Y,k,t,1)}],["ttLong",-0.8,15.4,{pose:"tt_clapB",marks:(x,X,Y,k)=>tt_clapMarks(x,X,Y,k,1,1)}],["ttWorker",3.2,15.8,{pose:"tt_clapA"}],
    ["ttBun",4.4,15.2,{pose:"tt_umbrella",umbrella:[176,60,56]}],["ttSpecs",5.6,16.3,{pose:"tt_nod",nod:0.1}],
    ["ttMime1",0.2,14.9,{pose:"tt_bow"}],["ttMime2",1.4,15.0,{pose:"tt_palms"}],["ttMime3",2.3,15.4,{pose:"tt_sweep",expr:"smile"}],["ttMime4",-1.7,14.8,{pose:"shrug"}],
    ["ttOfficer",6.8,15.2,{pose:"write",carry:heldNotebook}]];
  row.sort((a,b)=>b[2]-a[2]).forEach(([id,X,d,o])=>tt_who(ctx,cam,id,X,d,Object.assign({t},o)));
  tt_car(ctx,cam,"sedan",TT_PAINT.blue,-1.66,5.25,{brake:1,driver:tt_driver("ttDrv1",{expr:"ttLaugh",pose:"tt_nod",t})});
  tt_who(ctx,cam,"ttMime1",3.1,4.3,{pose:"tt_sweep",t});
  wc_paperOver(ctx,S);}
scene("crossing",(ctx,S,t,sc)=>{if(t<20)tt_testPeople(ctx,S,t,TT_CAM.wide,"bogota");else tt_testPeople(ctx,S,t,TT_CAM.mid,"bogotaMid");});
["today","beside","each","warn","measured","teach","lasts"].forEach(id=>scene(id,(ctx,S,t,sc)=>{setScreen(ctx,S);ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_paperOver(ctx,S);}));
