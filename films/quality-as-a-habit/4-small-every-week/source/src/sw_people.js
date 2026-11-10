/* ===== Small, every week: the people of Mexico's wheat, 1945 to 1955 =====
   The agent films' people (ag_person, through dq_person), in clothes of their time and place, painted over the body and the head in
   figure space: field shirts of plain cotton, rolled at nothing (the arms hang), and a felt or straw field hat with a brim wide
   enough for the sun. Nothing worn is a symbol of Mexico: no wide sombreros, no serapes, no colours of the flag. The team stands in
   the wheat, which hides them below the waist (o.covered, the wheat drawn over them), and is never named one by one on screen: the
   narration names the team, a small team of young Mexican agronomists and Norman Borlaug, a plant scientist from the United States.
   Clothes wear none of the module's six colours that mean something (look.js), so no shirt reads as a verdict.
   Each has its own key, so it is painted once. Looked at full size, facing both ways, on 5 November 2026. */

/* ---------------------------------------------------------------- a field hat
   A rounded crown with a soft pinch at the front, a band, and a brim wide enough for the sun, turned down a little at the front; all
   inside the head's picture (figure x 160 to 440, y 262 to 560), so nothing is cut off in a straight line. col: the felt or the straw;
   band: its band. */
function sw_hat(c,col,band,o){o=o||{};const straw=!!o.straw;
  const brim=cc=>{cc.moveTo(170,380);cc.bezierCurveTo(186,352,296,340,420,350);cc.bezierCurveTo(436,354,438,368,424,376);
    cc.bezierCurveTo(330,374,236,384,190,400);cc.bezierCurveTo(170,402,162,390,170,380);cc.closePath();};
  const crown=cc=>{cc.moveTo(212,366);cc.bezierCurveTo(202,326,210,292,240,280);cc.bezierCurveTo(268,270,296,280,316,276);cc.bezierCurveTo(346,270,374,280,382,306);
    cc.bezierCurveTo(388,326,388,344,386,360);cc.bezierCurveTo(330,352,262,356,212,366);cc.closePath();};
  ag_soft(c,brim,ag_dk(col,0.1),ag_lt(col,0.3),360,352,130,rgba(ag_dk(col,0.7),0.45),8);
  ag_soft(c,crown,col,ag_lt(col,0.32),340,284,124,rgba(ag_dk(col,0.7),0.45),14);
  ag_folds(c,crown,[[[244,296],[298,290],[352,294]]],rgba(ag_dk(col,0.55),0.5),rgba(ag_lt(col,0.3),0.4));
  // straw shows its weave as faint rows; felt stays plain
  if(straw){c.save();ag_shape(c,crown);c.clip();c.strokeStyle=rgba(ag_dk(col,0.3),0.28);c.lineWidth=1.6;for(let y=290;y<366;y+=9){c.beginPath();c.moveTo(200,y);c.bezierCurveTo(260,y-6,330,y-6,392,y-2);c.stroke();}c.restore();
    c.save();ag_shape(c,brim);c.clip();c.strokeStyle=rgba(ag_dk(col,0.3),0.22);c.lineWidth=1.4;for(let k=0;k<4;k++){const y=356+k*8;c.beginPath();c.moveTo(176,y+22);c.bezierCurveTo(260,y+2,340,y-2,430,y+6);c.stroke();}c.restore();}
  const bd=cc=>{cc.moveTo(210,346);cc.bezierCurveTo(270,334,340,332,386,340);cc.lineTo(386,358);cc.bezierCurveTo(340,350,270,352,212,366);cc.closePath();};
  ag_soft(c,bd,band,ag_lt(band,0.3),350,340,80,null,0);}

/* ---------------------------------------------------------------- the people
   The team, 1945 to 1948: three young Mexican agronomists and Norman Borlaug, in field shirts; two wear field hats. The farmers at the
   field day of 1954, and at the table in 1955: in plain shirts and work clothes, two in straw hats, one woman with her hair tied back. */
const SW_P={
  agr1:{key:"sw_agr1",name:"a young agronomist",skin:[186,136,102],hair:{style:"side",c:[26,22,22]},top:{kind:"shirt",c:[224,216,196]},
    hat:{paint:(c,P)=>sw_hat(c,[150,124,92],[70,54,40])},breath:0.29},
  agr2:{key:"sw_agr2",name:"a young agronomist",skin:[170,120,88],hair:{style:"cropped",c:[22,20,20]},top:{kind:"shirt",c:[196,178,140]},breath:0.31},
  agr3:{key:"sw_agr3",name:"a young agronomist",skin:[198,150,114],hair:{style:"side",c:[34,28,26]},top:{kind:"shirt",c:[170,156,132]},breath:0.27},
  borlaug:{key:"sw_borlaug",name:"Norman Borlaug",skin:[230,192,160],hair:{style:"side",c:[118,92,66]},top:{kind:"shirt",c:[206,196,172]},
    hat:{paint:(c,P)=>sw_hat(c,[176,160,128],[86,72,54])},breath:0.25},
  farmer1:{key:"sw_farmer1",name:"a farmer",skin:[166,114,82],hair:{style:"cropped",c:[30,26,24]},top:{kind:"shirt",c:[234,228,214]},
    hat:{paint:(c,P)=>sw_hat(c,[214,190,140],[120,96,64],{straw:true})},breath:0.28},
  farmer2:{key:"sw_farmer2",name:"a farmer",skin:[182,130,96],hair:{style:"bun",c:[28,24,24]},earrings:[200,180,140],top:{kind:"tunic",c:[206,184,160]},breath:0.31},
  farmer3:{key:"sw_farmer3",name:"a farmer",skin:[150,104,76],hair:{style:"side",c:[40,34,30]},top:{kind:"shirt",c:[190,170,146]},
    hat:{paint:(c,P)=>sw_hat(c,[200,176,128],[104,82,56],{straw:true})},breath:0.26},
  farmer4:{key:"sw_farmer4",name:"a farmer",skin:[176,124,90],hair:{style:"side",c:[52,44,38]},top:{kind:"shirt",c:[212,204,188]},breath:0.24}
};
