/* ===== A person asks: its people =====
   The film shows six people, drawn as the module's kit draws everyone (night.js: the agent films' shapes, faces and cast, lit at
   night; arms down, one three-quarter head, a hand only on what the story is about):
     - in London, 1676 and 1679, lit by the kit's "lamp": Francis Jenkes, a linen draper on the City's council, in a plain dark coat
       buttoned down the front and a white linen band at the neck, his own brown hair to the jaw; and the Gatehouse's keeper, a heavy man
       in a leather jerkin over a shirt, cropped grey-brown hair and a beard, his hand only on his ring of keys;
     - at the university, in the hall's "glass" light: Linh Nguyen and Ingrid Holm from the kit's cast (night.js), and Mei Tanaka and
       Jun Park from the agent films' cast.
   AP_PEOPLE holds the two of 1676; ap_who(name) gives one of them, or a person of the cast. */
const AP_PEOPLE={
  jenkes:{name:"Francis Jenkes",key:"apJenkes",skin:[226,190,160],hair:{style:"bob",c:[98,70,48]},
    top:{kind:"tunic",c:[46,46,54],paint:(c,P)=>ap_band(c,P)},breath:0.27},
  keeper:{name:"The keeper",key:"apKeeper",skin:[212,168,134],hair:{style:"cropped",c:[96,84,74]},beard:[104,92,82],
    top:{kind:"tunic",c:[112,80,54],belt:[60,44,32]},breath:0.22}
};
function ap_who(k){return AP_PEOPLE[k]||AG_CAST[k];}
// Jenkes's coat, in figure space: a white linen band falling from the collar, and buttons down the front
function ap_band(c,P){c.save();ag_shape(c,AG_F.torso);c.clip();
  const lin=[236,232,220];
  for(const y of [712,772,832,892,952,1012]){const x=320+(y-616)/484*8;c.fillStyle=rgba(ag_lt(P.top.c,0.28),1);c.beginPath();c.arc(x,y,5.2,0,TAU);c.fill();
    c.strokeStyle=rgba(ag_dk(P.top.c,0.5),0.7);c.lineWidth=1.2;c.stroke();}
  c.strokeStyle=rgba(ag_dk(P.top.c,0.45),0.6);c.lineWidth=2.4;c.beginPath();c.moveTo(314,690);c.bezierCurveTo(316,820,320,960,324,1100);c.stroke();
  ag_soft(c,cc=>{cc.moveTo(282,598);cc.bezierCurveTo(302,614,330,616,352,606);cc.lineTo(350,618);cc.lineTo(344,692);cc.bezierCurveTo(334,696,326,696,320,692);
    cc.lineTo(318,642);cc.lineTo(314,692);cc.bezierCurveTo(306,696,298,694,292,690);cc.closePath();},lin,[255,255,255],322,628,70,"rgba(70,58,44,0.32)",6);
  c.strokeStyle="rgba(120,104,84,0.45)";c.lineWidth=1.6;c.beginPath();c.moveTo(318,642);c.lineTo(318,690);c.stroke();
  c.restore();}
// what a hand holds, in figure space at the near wrist: the keeper's ring of keys, a paper, a phone
function ap_keyRing(c,h){const [x,y]=h.near,iron=[78,74,72],hi=[200,186,160];c.save();c.translate(x+30,y-8);
  c.strokeStyle=rgba(iron,1);c.lineWidth=7;c.beginPath();c.arc(0,30,30,0,TAU);c.stroke();c.strokeStyle=rgba(hi,0.45);c.lineWidth=2;c.beginPath();c.arc(0,30,30,-2.4,-0.9);c.stroke();
  [[-0.5,96],[0.15,112],[0.75,88]].forEach(([a,L])=>{c.save();c.translate(Math.sin(a)*30,30+Math.cos(a)*30);c.rotate(-a*0.6);
    c.fillStyle=rgba(iron,1);c.beginPath();c.ellipse(0,10,10,13,0,0,TAU);c.fill();c.fillStyle="rgba(0,0,0,0.5)";c.beginPath();c.arc(0,10,4,0,TAU);c.fill();
    c.fillStyle=rgba(iron,1);c.fillRect(-4,20,8,L-30);c.fillRect(0,L-22,18,8);c.fillRect(0,L-8,14,8);c.fillStyle=rgba(hi,0.35);c.fillRect(-3,22,2,L-34);c.restore();});
  c.restore();}
function ap_paper(c,h){const [x,y]=h.near;c.save();c.translate(x+70,y-70);c.rotate(-0.12);c.shadowColor="rgba(0,0,0,0.35)";c.shadowBlur=10;
  c.fillStyle="rgb(232,220,192)";c.fillRect(-10,0,120,150);c.shadowBlur=0;c.strokeStyle="rgba(110,84,52,0.45)";c.lineWidth=2;for(let i=0;i<6;i++){c.beginPath();c.moveTo(6,24+i*20);c.lineTo(94-(i%3)*12,24+i*20);c.stroke();}
  c.fillStyle="rgb(168,44,36)";c.beginPath();c.arc(70,128,9,0,TAU);c.fill();c.restore();}
function ap_phone(c,h){const [x,y]=h.near;c.save();c.translate(x+74,y-128);c.rotate(-0.08);c.shadowColor="rgba(72,222,244,0.5)";c.shadowBlur=24;
  rr(c,0,0,92,176,14);c.fillStyle="rgb(14,22,26)";c.fill();c.shadowBlur=0;rr(c,6,10,80,156,9);const g=c.createLinearGradient(0,10,0,166);g.addColorStop(0,"rgb(40,96,110)");g.addColorStop(1,"rgb(18,50,60)");c.fillStyle=g;c.fill();
  c.fillStyle="rgba(150,235,245,0.8)";c.fillRect(16,40,58,8);c.fillRect(16,58,44,6);c.fillStyle="rgba(72,222,244,0.9)";rr(c,16,120,60,22,8);c.fill();c.restore();}
// the people the player paints before they're needed (finish.js), each in their light
DP_PEOPLE.push([ap_who("jenkes"),"lamp"],[ap_who("keeper"),"lamp"],"linh","ingrid","mei","jun");
