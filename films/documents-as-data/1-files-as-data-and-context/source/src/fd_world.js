/* ===== Files as data and as context: the film's own world, 1842 to 1855 =====
   The film draws with the module's look (films/data-that-moves/shared/README.md); these are its own pictures, each name starting
   with fd_ or FD_. This file holds the opening's world: the chart of the oceans, the places painted once, the logbooks and the log of
   1853, and the people of that time. fd_docs.js holds the documents of today.
     the chart       the land from Natural Earth's 1:110m land (public domain, naturalearthdata.com; NOTICE.md), simplified to about a
                     third of a degree and kept here in tenths of a degree; fd_xy projects them, plate carrée, into the place's 1920 x
                     1080 (7 px a degree), so the camera can come close and they stay sharp: fd_land, the winds (fd_winds), the currents
                     (fd_currents), the routes (fd_route), a ship (fd_ship), the five-degree squares (fd_squares), a port (fd_port)
     the places      the Navy's office in Washington (fdOffice), the hall in Brussels (fdHall) and the night sea (fdSea), each painted once
     paper           a page (fd_paper), a logbook's page in three hands (fd_logPage), a logbook shut (fd_book), and the log agreed at
                     Brussels in 1853 (fd_form53)
     the people      a captain and Adolphe Quetelet (FD_P), dressed for the 1850s: a dark coat, a white shirt and a black stock
   The routes are a picture of the idea, not a ship's track: the habit's road far to the east and through the calms, and the charts'
   more direct one. Every word is at least 28 px as seen, or marked as decoration ({deco:1}); none but the captions below y 890. */

const FD={paper:[232,222,198],paperHi:[247,241,226],paperDk:[186,168,136],ink:[56,44,34],inkSoft:[112,94,74],
  land:[24,33,50],landHi:[36,48,70],coast:[128,164,214],grat:[120,160,230],wind:[170,208,242],habit:[206,214,230],
  lamp:[255,196,124],wood:[44,30,22],woodHi:[96,66,44],gilt:[214,178,110]};
const FD_PRJ={lon0:-130,lat1:62,k:7,x0:60,y0:20};
const fd_xy=(lon,lat)=>[FD_PRJ.x0+(lon-FD_PRJ.lon0)*FD_PRJ.k,FD_PRJ.y0+(FD_PRJ.lat1-lat)*FD_PRJ.k];
const fd_ll=(x,y)=>[(x-FD_PRJ.x0)/FD_PRJ.k+FD_PRJ.lon0,FD_PRJ.lat1-(y-FD_PRJ.y0)/FD_PRJ.k];
// a camera on the chart, looking at (lon, lat) at zoom z: [x, y, z] for a shot's keys
const fd_on=(lon,lat,z)=>{const p=fd_xy(lon,lat);return[p[0],p[1],z];};
// words drawn in the chart's coordinates, sized so they read at size px as seen through the camera
function fd_say(ctx,cam,s,x,y,o){o=o||{};const z=cam&&cam.z||1;md_T(ctx,s,x,y,Object.assign({},o,{size:(o.size||30)/z,ls:o.ls?o.ls/z:0}));}
// screen space inside a shot: what's drawn here stays put while the camera moves
function fd_scr(ctx,S,fn){ctx.save();setScreen(ctx,S);try{fn();}finally{ctx.restore();}}
// a value that comes in at a and leaves at b, over d
const fd_io=(t,a,b,d)=>ag_io(t,a,b,d||0.5);

// the land: Natural Earth's 1:110m land (public domain), each ring simplified to about a third of a degree, in tenths of a degree:
// the first point, then each step from the one before, longitude then latitude
const FD_LAND=[[-1212,-735,25,0,-15,-6,-14,1,-10,3,2,4,12,-2],[-1256,-735,16,-4,-33,4,17,0],[-990,-719,22,-1,6,-5,-46,0,-15,6,33,0],[-685,-710,-3,-12,-23,-3,-13,0,5,4,-31,0,0,4,11,4,18,1,4,17,14,6,18,-21],[-586,-642,-34,-6,-6,-7,5,-7,-16,-3,-20,-15,25,-12,17,-19,8,-21,-7,-9,-30,-12,-62,-13,-66,-1,35,-12,-43,-1,495,0,-74,0,184,29,18,6,3,4,-11,2,4,4,38,11,20,11,29,-4,5,8,26,-6,36,3,5,-4,79,17,18,-1,13,-8,26,8,17,-4,42,5,22,-2,11,-6,45,2,49,8,19,12,47,-13,34,12,54,9,71,19,19,-2,23,-13,27,-7,27,6,48,-5,8,-13,-1,-5,-18,-6,1,-4,12,0,-12,-12,20,-4,11,2,29,22,37,4,15,12,37,11,40,0,12,10,17,-10,100,0,31,16,34,-13,40,2,34,8,38,-10,24,-4,34,8,56,-3,41,4,19,2,3,9,15,-15,9,-2,80,1,11,-10,22,-5,37,-5,18,3,49,-10,24,-10,68,-4,28,-7,-1,-4,-18,-16,-32,-7,-19,-11,-7,-12,8,-11,27,-2,-72,0,202,0,-3600,0,371,0,-152,0,-3,11,14,-4,57,-1,52,9,-4,8,3,3,19,-1,91,12,141,-2,72,8,16,-10,10,3,37,-8,70,-1,5,4,-12,7,-12,1,-12,15,46,-3,28,-7,62,3,9,7,8,-4,69,-9,12,8,54,-8,75,14,1,9,-12,19,11,16,-3,8,47,27,52,13,6,-2,-14,-7],[-678,-539,28,-8,-5,-5,-15,3,-11,-7,-29,5,-23,11,-14,12,36,-13,8,12,10,4,7,-1,8,-13],[-585,-511,7,-4,-2,-4,-14,-3,-5,3,-8,-4,-5,4,27,8],[703,-497,-16,-1,2,12,16,-5,-2,-6],[1454,-408,10,-3,19,2,1,-12,-5,-11,-3,3,-7,-7,-9,1,-13,23,0,5,7,-1],[1730,-409,2,-4,8,4,2,-4,-15,-21,4,-5,-16,-3,-9,-17,-13,-7,-9,0,-17,4,3,11,35,21,16,20,7,5,2,-4],[1746,-362,7,-10,1,7,6,-11,8,-3,17,2,-5,-15,-8,1,-12,-22,-9,-1,-4,1,5,8,-3,6,-11,4,8,7,1,14,-21,29,17,-8,3,-9],[1671,-222,-4,-2,-12,7,-15,16,31,-21],[1784,-173,2,-9,-12,0,3,8,7,1],[1794,-168,-7,-2,-1,4,8,2,6,3,0,-5,-6,-2],[1671,-149,2,-8,-5,0,-2,11,5,-3],[501,-136,3,-21,-7,0,1,-12,-27,-80,-17,-7,-14,6,-7,22,1,15,10,12,-4,27,4,12,19,4,14,12,2,9,4,-1,9,18,9,-16],[1436,-138,3,-7,7,3,8,-8,10,-40,24,-14,9,-19,10,-1,2,-11,20,-18,2,-8,5,-20,-7,-35,-12,-14,-14,-27,-3,-17,-6,-4,-11,0,-20,-12,-14,6,1,5,-14,-9,-30,8,-10,19,-15,5,1,12,-5,-7,-9,-2,11,17,-1,7,-18,-20,-8,4,-9,19,-30,11,-52,-7,-19,-8,-5,-9,-38,-1,-19,-11,-14,1,-16,8,0,6,7,3,1,11,-12,37,-13,24,5,-4,-4,9,8,-7,-8,19,7,26,1,-7,4,7,21,11,42,10,13,15,1,9,7,9,4,-9,5,2,-4,5,3,5,5,-2,1,7,13,14,14,4,13,-11,12,-1,-2,6,12,19,20,4,0,5,-8,3,6,2,29,-11,12,3,5,-5,-10,-9,-5,-17,47,-27,7,3,8,24,-2,13,6,27,4,3,3,-5,8,-26],[1621,-105,3,-3,-7,0,-4,6,8,-3],[1207,-102,-17,6,9,2,8,-8],[1609,-99,-11,1,-1,6,12,-7],[1244,-101,-9,-1,5,9,19,9,14,0,-22,-10,-7,-7],[1179,-81,12,-6,-18,-3,-6,0,4,5,8,4],[1229,-81,-1,-5,-15,-3,-14,1,0,4,30,3],[1086,-68,19,-1,3,4,49,-19,-11,-4,-40,7,-52,12,7,10,12,-1,13,-8],[1347,-62,-5,-7,1,11,2,4,2,-8],[1559,-68,-7,3,-5,15,12,-18],[1520,-55,-23,-8,-14,6,15,2,2,5,2,-5,6,0,8,7,-1,6,6,1,-1,-14],[1272,-35,-3,-3,-9,6,12,-3],[1305,-31,3,-8,-22,5,-7,0,2,6,24,-3],[1531,-45,-3,-3,-4,10,-17,11,2,2,13,-7,9,-13],[1341,-12,3,-16,11,-6,8,11,20,6,63,-22,14,-16,16,-6,3,-5,-9,-1,2,-7,15,-17,6,0,0,-4,15,-8,-8,-4,-21,6,-19,20,-13,5,-14,-6,1,-8,-8,-3,-16,2,-9,8,-10,2,-15,-3,11,11,-8,19,-42,19,-7,-6,-2,8,-8,5,17,6,-15,0,-17,13,19,5,17,-8],[1252,14,-8,-10,-7,-2,-35,0,-2,-7,9,-9,24,8,0,-5,-5,2,-13,-10,17,-34,-6,-3,-4,3,5,8,-12,-1,1,4,-7,6,1,10,-7,-3,1,-26,-10,1,1,19,-7,7,12,34,9,7,20,-4,23,5],[1287,11,-1,-8,-5,1,-1,-7,4,-5,-7,5,-1,21,3,4,8,-11],[1058,-59,-11,0,-21,17,-33,44,-7,16,-32,32,-1,5,22,-3,31,-31,11,0,21,-20,-4,-8,10,-4,5,-12,12,-8,-3,-28],[1179,18,11,-9,-12,-1,-3,-16,-9,-7,-5,-25,-1,3,-11,-4,-4,6,-12,4,-12,-4,-4,5,-15,1,-1,13,-10,11,-1,9,7,16,7,-3,8,2,2,8,16,4,37,38,25,-15,-19,-22,7,-9,-1,-5],[1264,84,1,-12,-3,-9,-4,10,-4,-5,0,-12,-12,6,0,12,-6,4,-8,-3,-7,-6,2,11,32,10,-1,8,8,-5,2,-9],[812,62,-9,-2,-4,8,-2,14,4,16,7,-5,10,-18,-6,-13],[-609,101,-11,0,3,7,8,1,0,-8],[1240,103,-10,-13,-6,7,4,6,1,6,6,0,-2,-6,8,9,-1,-9],[1185,93,-13,-9,18,20,5,10,2,-8,-12,-13],[1219,119,12,-3,-5,-9,-6,-3,-1,15],[1255,122,3,-12,-8,3,3,-9,-5,-3,-3,8,-2,6,6,-1,0,4,-6,8,12,-4],[1215,131,-2,-9,-10,13,12,-4],[1213,185,9,0,3,-14,-8,-12,0,-16,23,-5,1,-13,-8,5,-4,6,-2,-4,-7,6,-14,1,4,6,-3,3,-1,-4,-5,6,-2,14,4,-4,4,25,6,0],[-656,182,-16,-3,0,5,16,-2],[-769,179,-14,3,5,3,14,-3,2,-3,-7,0],[-726,199,26,-3,17,-10,-4,-4,-23,1,-4,-7,-10,6,-21,1,1,4,21,0,-5,8,-6,1,8,3],[1103,187,-8,-5,-8,3,-1,9,16,7,8,-4,-7,-10],[-1555,191,-4,0,0,12,11,-8,-7,-4],[-797,228,14,-3,26,-18,15,-4,-36,-4,7,5,-22,12,-25,6,-4,2,4,2,-32,-7,27,13,26,-4],[-775,238,-9,8,2,6,7,-14],[1212,228,-5,-8,-5,8,-1,8,6,9,8,8,5,-3,-8,-22],[-778,266,-11,-2,4,5,7,-3],[-770,266,-2,-7,-1,6,-5,5,8,-4],[1346,341,-4,-9,-4,3,-8,-8,-6,3,5,11,17,0],[346,357,-16,-11,-7,5,23,6],[237,357,26,-4,-16,-4,-12,4,2,4],[155,382,-4,-16,-13,5,-14,5,2,5,29,1],[92,412,6,-7,-1,-13,-13,0,-2,18,10,2],[1410,371,-7,-20,-31,-5,-14,-11,-7,3,0,8,-41,-7,10,-8,-7,-16,-6,-5,-5,4,2,9,-10,10,32,21,31,1,10,18,7,-5,20,14,9,30,11,2,5,-14,0,-8,-9,-10,0,-11],[96,422,-4,-8,-7,9,9,7,2,-8],[1439,442,7,-2,7,4,2,-11,-14,-3,-9,-10,-16,7,-5,-11,-11,0,-2,10,5,7,11,1,6,22,19,-14],[-637,466,17,-2,-9,-4,-12,4,-3,3,4,3,3,-4],[-618,491,-18,3,-6,6,24,-9],[-1235,485,-22,3,-24,12,-3,8,26,-5,23,-18],[-561,507,-7,-9,7,4,6,-3,-3,-3,23,-4,-3,-7,7,2,5,-12,-5,-8,-11,1,0,10,-12,-9,-6,0,7,5,-10,2,-30,0,5,7,-4,2,18,22,15,9,5,0,-7,-9],[-1327,540,10,1,-3,-11,8,-8,-4,0,-15,12,-1,8,5,-2],[1436,507,11,-17,-15,3,-6,-14,9,-11,0,-7,-8,6,-6,-7,0,36,1,14,-6,9,1,14,9,5,-4,4,5,2,9,-37],[-68,523,-18,-6,-14,1,8,11,-5,10,21,12,19,-5,-11,-23],[127,556,-6,-8,-12,10,15,3,3,-5],[-1530,571,-15,-1,-2,5,9,3,17,-2,-9,-5],[-30,586,-11,-10,21,1,-11,-17,10,-1,10,-13,7,-1,9,-16,12,-2,-6,-9,3,-5,-8,-5,-64,-6,24,12,-19,6,11,3,-6,5,2,7,15,-1,2,6,-7,6,-12,2,-2,10,-6,-5,-5,15,11,18,20,0],[-1656,599,-19,3,18,1,1,-4],[-793,622,-4,-6,-6,5,10,1],[-819,627,-12,-5,-9,3,7,4,14,-2],[-1717,638,30,-5,-8,-3,-21,3,-1,5],[-852,657,2,-5,49,-15,-24,0,-6,4,-24,-10,-4,5,-13,-1,8,5,5,17,7,0],[-145,665,-2,-7,11,-7,-13,-7,-38,-9,-41,5,10,4,-22,5,18,2,-21,5,6,7,16,1,15,-7,15,6,13,-3,16,5,17,0],[-759,671,-11,0,-2,5,4,5,9,2,8,-3,0,-4,-8,-5],[-1750,666,7,-3,-3,8,27,-2,20,-9,-26,-6,-1,-9,-4,-2,-30,6,-2,5,-22,0,-5,3,2,4,-12,-2,5,-5,-6,-4,0,40,51,-18,-1,-6],[-956,691,-7,-3,-21,2,-14,4,9,3,7,4,26,-10],[1800,708,-13,3,13,4,0,-7],[-1787,709,-13,-1,0,7,10,1,14,-3,-11,-4],[-905,695,-1,-10,14,8,12,-7,-3,-7,9,-7,18,16,1,11,29,-2,13,-5,1,-5,-8,-6,7,-5,-1,-5,-19,-7,-25,2,-15,-18,-12,-7,-14,-1,-8,-4,-1,-6,-11,-2,-13,-8,-10,-11,-5,-20,15,-1,9,-17,14,2,59,-20,27,-2,2,-18,7,-11,15,-10,8,3,5,11,-5,15,-7,6,16,4,17,14,-8,16,-12,7,12,11,-8,24,43,1,24,-13,18,0,3,-21,17,-8,14,6,16,15,32,-33,-4,-7,45,-17,4,-8,11,-5,1,-12,-43,-19,-64,0,-47,-34,24,15,36,9,9,-5,-9,-6,6,-19,13,-5,17,2,10,11,1,-7,6,-4,-56,-24,-7,1,-1,9,18,8,-27,-2,1,-3,-31,-11,-6,-7,-1,-7,8,-7,-37,-7,18,0,-21,-1,-9,-19,-6,6,4,-11,-8,-12,2,7,-6,13,0,-11,-7,1,7,-3,6,-23,-34,-21,-22,-21,0,-14,12,-31,-3,-17,-8,0,-5,7,-12,20,0,12,-12,10,-10,-5,-13,8,-28,-1,-4,-1,4,-9,-10,-2,-14,6,-22,0,-28,-14,-8,-9,3,-15,-8,-35,16,-31,19,-12,24,6,12,6,5,17,32,5,3,-7,-10,-25,-5,2,-1,-20,-5,-6,39,1,16,-7,2,-10,-6,-32,16,-21,8,-2,18,8,28,-10,11,8,2,12,6,5,15,1,16,12,7,-3,-8,-7,2,-23,7,8,-4,11,12,4,3,8,17,-16,20,0,13,-5,6,5,24,1,-8,-3,3,-5,16,-5,1,-8,16,-6,6,-12,14,-8,31,-2,27,-16,8,-23,5,-2,1,-7,-8,-8,3,-3,18,-1,0,-10,8,6,29,-10,5,-5,-2,-6,12,3,34,-5,28,-19,16,-3,9,-22,-4,-17,-36,-41,-6,-48,-16,-40,-11,-11,-26,-4,-30,-15,-9,-10,-4,-28,-49,-57,-11,-6,-13,1,-22,10,-1,-5,13,-9,-2,-7,7,-4,-1,-5,-9,-13,-15,-5,-31,-1,2,-19,-6,-3,-24,-1,1,-10,7,-3,5,4,3,-6,-17,-9,-4,-15,-17,-6,-3,-7,20,-9,-4,-9,-12,-6,-6,-12,-13,-8,9,-16,-13,0,-13,-6,-2,-9,-4,-1,-35,16,-4,7,3,6,-5,6,-1,17,4,10,11,8,-15,3,9,8,3,17,12,-4,5,21,-7,3,-3,-13,-6,2,11,39,-4,21,4,1,18,47,-1,35,6,13,7,78,-2,15,-11,9,-45,28,-38,74,-14,11,3,4,-5,10,16,20,-2,5,-4,-5,-6,5,1,11,8,19,12,6,5,12,13,12,-4,3,0,26,-7,8,0,8,-14,6,-9,-8,5,-6,-9,-3,-2,6,-24,6,-1,7,-14,10,-1,-5,-6,3,0,12,-20,18,2,4,-37,6,-35,23,-19,-5,-69,26,-20,16,-2,5,4,10,-7,14,-33,28,0,8,-29,26,-9,22,-8,4,-9,2,1,-16,31,-35,9,-24,13,-9,-6,-6,-22,19,-1,13,-28,17,5,0,4,9,-13,10,-18,34,-12,10,-21,6,-38,57,-1,25,6,27,-8,27,16,-2,5,-9,-2,19,-46,18,-6,9,1,6,-12,5,-2,8,-27,19,-2,9,-13,8,-6,9,-25,1,-33,13,-72,14,-11,-2,2,-7,-37,-8,3,15,11,3,-3,3,-34,-19,7,-5,-9,-8,-21,-7,-21,-14,-64,-16,71,32,7,13,-21,-5,-13,7,-16,-4,1,9,-6,4,-13,-2,-15,7,-1,6,-7,4,15,16,15,0,23,7,-7,6,7,4,-42,-4,-14,3,-17,10,36,9,8,0,-1,-5,21,0,-51,23,6,5,30,5,13,9,53,11,23,-7,107,-5,71,-13,21,7,15,-1,31,7,7,-4,10,7,23,-10,14,7,1,-8,28,4,63,-9,13,-5,-14,-5,54,1,10,-6,11,5,-10,4,6,4,20,1,19,-8,28,-4,31,2,-2,6,9,2,16,-4,0,-9,6,8,8,0,5,10,-23,10,1,11,12,7,23,-6,14,-11,-9,-5,19,-2],[-1142,731,-5,-4,23,3,13,-5,12,5,17,-13,5,4,-7,10,30,-4,9,-17,35,-10,-1,-4,-16,-1,6,-4,-3,-3,-47,3,-62,-6,-6,5,-22,2,-12,8,49,4,-55,1,-5,4,23,4,-33,3,15,11,27,6,10,-2],[-1045,734,-9,-6,-15,7,3,1,21,-2],[-763,731,-35,-3,-11,5,5,5,41,-7],[-866,732,8,-7,9,8,26,5,17,-11,-1,-6,29,6,36,-9,1,-5,19,3,43,-15,9,-9,-18,-5,39,-9,15,-9,15,0,-3,-7,-17,-12,-28,14,-13,-1,-1,-6,28,-13,6,-10,-3,-7,-38,10,26,-18,-48,10,-12,5,3,3,-29,10,-29,-5,-9,4,7,7,39,2,-3,3,16,15,-2,4,-40,12,7,2,-28,11,-23,-5,-74,7,-8,4,10,4,-14,0,-3,10,18,13,26,3,-8,-6],[-1004,738,33,-3,-10,-5,16,-4,-2,-9,-17,-4,-41,12,0,3,21,-1,-11,7,11,4],[1436,732,-36,1,8,5,13,1,15,-7],[-932,728,-11,-8,-11,1,-6,8,5,10,50,0,-27,-11],[-1205,714,-26,-5,-28,10,20,18,-10,6,34,1,39,-2,21,-7,-37,-10,-13,-7,0,-4],[1507,751,-11,-4,-35,5,3,3,43,-4],[-936,750,-20,-3,-12,2,5,5,14,2,13,-6],[1451,756,-8,-8,-53,-2,-20,7,5,6,13,2,63,-5],[-985,767,8,-4,-5,-13,-27,1,0,5,-16,0,-1,7,41,4],[-1082,762,4,-4,19,2,2,-5,-6,-5,-74,-6,-2,3,21,5,-45,-2,-14,2,23,13,63,-10,-14,9,9,4,11,-1,3,-5],[575,707,-38,1,-3,4,-18,3,-1,5,29,16,-9,1,24,9,-3,5,56,12,70,6,7,-4,-104,-22,-31,-19,2,-9,19,-8],[-947,771,31,-3,9,-4,-3,-3,18,-5,81,1,10,-4,3,-4,-7,-2,-77,-3,-42,4,-5,11,-10,4,-32,5,4,4,20,-1],[-1162,776,-1,-7,-8,-4,-44,-6,-14,2,38,14,29,1],[1070,770,2,-5,39,2,30,-9,-2,-5,-45,-11,36,-2,5,-7,21,5,76,-8,1,7,37,-1,16,-6,5,-6,-6,-4,28,-12,10,10,16,-4,60,1,-8,9,14,4,90,-6,35,-14,60,1,8,-4,-1,-8,12,-3,69,2,18,-9,12,3,-8,7,5,4,81,-7,14,-4,0,-40,-26,-4,21,-20,-58,-9,-34,-18,-14,7,-26,-8,-5,4,-9,-5,-14,2,-15,-17,1,-4,11,-2,-1,-14,-10,-1,-4,-8,4,-4,-17,-6,-4,-11,-15,-2,-3,-11,-14,-9,-14,44,5,14,9,10,16,3,53,30,8,15,-12,-1,-6,-9,-26,-11,-8,13,-26,-4,-25,-16,8,-7,-37,-3,0,7,-15,2,-13,-5,-63,-2,-71,-43,16,-1,15,-8,6,5,11,-1,14,-11,1,-9,-8,-10,-5,-28,-19,-21,-33,-29,-14,-6,-12,5,-23,-14,-3,-10,-22,-11,-1,-6,9,-6,12,-18,-4,-17,-26,-7,-4,23,8,2,-7,8,-15,4,6,15,-10,3,-32,-10,11,15,-6,5,-26,-16,-10,-1,-5,-5,14,-8,0,-5,8,-2,11,7,16,-4,1,-6,-14,-2,-19,-18,10,-5,17,-27,0,-8,-6,-2,8,-9,-4,-16,-6,-1,-24,-36,-28,-17,-17,-6,-4,3,-30,-11,-4,-11,-5,0,0,11,-14,3,-26,-19,-2,-7,32,-38,4,-19,-1,-17,-40,-31,-4,6,3,7,-16,7,-9,16,-18,4,2,8,-9,0,-9,-42,7,0,6,-18,25,-19,12,-42,-7,-1,-21,16,-13,37,-16,19,-2,-6,5,36,-16,55,-18,-12,-12,3,1,22,-6,15,-13,10,-10,21,-9,0,-2,-10,-13,3,-1,-4,-19,-2,0,-8,-5,-5,-14,-7,-29,-25,0,-4,-19,-7,-4,-55,-6,-1,-4,-8,3,-3,-9,-3,-8,-9,-9,9,-31,71,-9,54,-21,-5,-13,12,4,4,-3,3,-19,11,-10,15,-49,-3,-41,6,-4,13,-5,1,-18,-6,-32,14,-14,22,-21,-1,8,-23,14,-10,6,-19,2,12,6,-2,-2,-12,4,-6,22,1,24,23,4,-22,19,-6,11,-13,-13,-19,-7,-2,-1,-13,-24,-13,0,-4,-29,-8,-2,-8,-35,-16,-31,-7,-6,-6,-15,-1,-9,26,0,16,-17,27,-18,18,-6,24,-10,6,-24,38,-5,0,3,14,-10,-19,-15,23,17,-38,16,-22,-2,-8,14,-11,6,-34,9,-6,9,-21,40,-35,-6,-7,19,-13,65,16,-5,-28,-20,-39,-20,-24,-63,-55,-16,-33,7,-9,-2,-17,13,-23,3,-39,-13,-20,-21,-9,-26,-22,-1,-7,9,-16,-1,-20,-29,-16,3,-5,-7,-26,-40,-40,-24,-11,-32,0,-25,-9,-17,7,-5,15,3,9,-30,46,-13,54,-21,36,-2,14,9,32,11,15,1,13,-8,15,3,6,-13,36,-31,39,10,42,-4,6,-9,11,-26,-5,-16,20,-24,-2,-39,-14,-26,5,-29,-9,-15,5,-34,25,-24,36,-18,13,-1,14,-9,11,11,14,4,20,-9,38,19,26,7,18,18,17,9,1,21,18,-2,13,5,14,24,15,10,17,37,-6,37,14,69,3,11,5,7,-2,0,-5,9,2,-5,-5,3,-7,-1,-9,-7,-5,2,-5,49,-15,5,-9,34,-11,10,7,0,12,14,6,74,-19,21,7,10,-7,2,4,16,-3,8,5,14,31,1,12,-3,5,4,4,-15,1,-7,-6,-15,-1,-8,5,-20,-5,-21,6,-13,15,5,8,-6,5,11,9,15,1,4,7,19,-1,24,9,17,0,31,-11,21,1,13,10,-2,6,-48,26,15,10,-5,4,14,7,-41,-10,0,-6,15,-2,-2,-4,-24,-7,-6,2,2,4,-10,3,11,6,-3,2,-26,5,-11,-16,-8,-1,-11,-23,11,-15,-12,-1,-12,-8,-3,6,-12,1,-12,-2,7,-6,-5,-1,-13,3,8,-11,-4,-2,10,-8,0,-5,-9,2,3,-5,-6,-1,4,-9,-7,0,-8,4,-6,15,-17,20,1,14,-35,18,-11,16,-6,1,-3,-4,-1,8,-8,1,-8,-3,3,-13,25,-21,8,0,0,-5,26,-13,-2,-4,-14,6,-5,-6,8,-4,-1,-5,-10,-9,-4,-1,4,11,-7,10,-33,17,-16,12,-3,10,-13,5,-24,-13,-19,3,-15,-3,-1,-12,-22,-9,-11,-17,4,-6,-22,-20,-23,0,-10,-8,-11,10,-24,0,1,14,-7,4,7,21,-6,22,14,7,61,-3,5,6,2,20,-18,16,-15,4,-1,7,30,-1,-3,12,9,-5,23,8,3,8,22,7,9,15,34,4,7,5,-7,15,4,16,21,6,-3,-8,6,-4,-12,-10,2,-9,11,-2,-1,-4,16,5,16,-7,35,11,21,-5,16,8,-2,16,5,6,9,4,8,-8,8,0,3,14,-10,2,-1,6,47,3,11,5,-10,5,-52,-7,-16,9,2,10,-4,9,4,6,39,19,-1,4,-14,5,-17,-3,-10,-7,2,-6,-36,-17,-7,-14,17,-12,-9,-11,-11,-3,-9,-26,-12,1,-6,-8,-12,0,-25,41,-20,-12,-14,-2,-13,5,-7,34,55,25,43,33,44,20,38,4,15,8,37,2,31,-7,-13,-3,11,-6,10,3,82,-20,8,-4,0,-7,-11,-5,-16,-3,-52,6,16,-7,1,-15,21,-6,1,5,-6,5,7,3,24,-6,8,3,-6,7,23,10,18,-4,6,7,-8,6,5,6,-7,6,28,-3,5,-6,-12,-1,0,-6,7,-3,16,2,2,6,56,14,8,-1,-10,-6,53,7,11,-6,12,6,-11,6,6,4,29,-4,50,-14,7,5,-11,8,-12,1,4,4,-6,11,18,9,7,9,34,0,2,-6,-10,-8,10,-10,-2,-14,11,-6,-24,-21,11,-1,27,16,-6,5,4,7,-11,1,-2,5,8,10,-13,8,18,7,-2,7,10,-5,-4,-10,11,-1,-5,7,17,4,21,0,18,-5,-9,8,-1,10,63,3,-8,6,12,6,60,9,35,-1,41,5,12,9,24,4,17,-3,-14,-3,23,-1],[-1102,777,-19,-3,-14,3,8,4,28,-1,-3,-3],[247,779,-22,-5,-18,3,7,2,-6,4,21,2,18,-6],[-958,781,-23,0,-5,8,30,-5,-2,-3],[-1001,783,4,-4,-16,1,-39,4,10,3,-12,2,-1,4,20,-1,34,-9],[1051,783,-57,-4,27,14,33,-6,-3,-4],[183,797,32,-7,-25,-4,-19,-18,-33,6,9,3,-15,3,-28,17,66,4,13,-4],[254,804,20,-3,-15,-6,-74,4,-11,4,31,3,49,-2],[511,805,-35,-5,-11,2,6,4,-23,0,37,-1,15,4,11,-4],[999,789,-49,1,-38,13,47,10,43,-15,-3,-9],[-870,797,12,-4,-32,-10,-18,-1,-32,6,9,6,-30,3,-6,5,24,8,-4,2,23,1,46,-10,8,-6],[-685,831,48,-2,18,-5,-58,-9,22,0,-57,-17,-57,-5,14,-1,-7,-2,8,-5,-44,-13,19,-4,-27,-6,-89,3,-1,5,18,2,-5,7,33,-4,-30,9,29,9,-18,10,51,2,-58,0,-40,14,61,8,23,-4,8,6,31,2,108,0],[-271,835,63,-8,-106,-7,85,1,8,-4,-11,-5,74,7,30,-2,6,-4,-78,-11,23,-1,-20,-13,0,-12,12,-6,-32,-4,19,-5,2,-9,-11,0,13,-9,-22,-1,12,-4,-4,-3,-28,-2,13,-7,0,-4,-25,1,27,-8,3,-8,-17,-2,-20,9,3,-6,-12,-6,41,-1,-54,-16,-41,-4,-24,-14,-56,-12,-9,-7,-5,-13,-16,-8,4,-8,-10,-18,-14,-1,-15,9,-20,0,-9,5,-24,22,-7,16,-14,9,4,7,-7,4,10,12,15,3,6,12,-26,-6,-12,3,3,12,30,-2,-26,9,-18,2,11,9,-26,21,-13,4,0,4,-27,6,-72,0,-29,9,46,4,-42,2,-23,4,1,4,75,10,4,4,-27,3,58,12,-5,5,24,2,73,-1,26,5,59,-7,-24,5,1,4,34,6,163,3]];

/* ---------------------------------------------------------------- the chart */
// the land, unpacked once into the place's coordinates: each ring a flat list of points
let FD_RINGS=null;
function fd_rings(){if(FD_RINGS)return FD_RINGS;FD_RINGS=FD_LAND.map(r=>{const out=[];let lo=0,la=0;for(let i=0;i<r.length;i+=2){lo+=r[i];la+=r[i+1];const p=fd_xy(lo/10,la/10);out.push(p[0],p[1]);}return out;});return FD_RINGS;}
function fd_ringPath(ctx,r){ctx.moveTo(r[0],r[1]);for(let i=2;i<r.length;i+=2)ctx.lineTo(r[i],r[i+1]);ctx.closePath();}
// the land, its coast lit faintly in the map's light, and the lines of latitude and longitude every ten degrees: o.a, o.grat (0 to 1),
// o.coast (0 to 1, how lit the coast is), o.cam (for the lines' width)
function fd_land(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const z=o.cam&&o.cam.z||1,R=fd_rings();ctx.save();ctx.globalAlpha*=a;
  const ga=o.grat==null?1:o.grat;if(ga>0){ctx.strokeStyle=rgba(FD.grat,0.075*ga);ctx.lineWidth=1.2/z;ctx.beginPath();
    for(let lo=-180;lo<=180;lo+=10){const p=fd_xy(lo,85),q=fd_xy(lo,-85);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}
    for(let la=-80;la<=80;la+=10){const p=fd_xy(-200,la),q=fd_xy(200,la);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}ctx.stroke();
    // the equator a little brighter
    ctx.strokeStyle=rgba(FD.grat,0.14*ga);ctx.beginPath();const e0=fd_xy(-200,0),e1=fd_xy(200,0);ctx.moveTo(e0[0],e0[1]);ctx.lineTo(e1[0],e1[1]);ctx.stroke();}
  ctx.beginPath();for(const r of R)fd_ringPath(ctx,r);const g=ctx.createLinearGradient(0,0,0,1080);g.addColorStop(0,rgba(FD.landHi,1));g.addColorStop(1,rgba(FD.land,1));ctx.fillStyle=g;ctx.fill();
  const cl=o.coast==null?1:o.coast;ctx.lineJoin="round";ctx.strokeStyle=rgba(FD.coast,0.16*cl);ctx.lineWidth=5/z;ctx.stroke();ctx.strokeStyle=rgba(FD.coast,0.62*cl);ctx.lineWidth=1.4/z;ctx.stroke();
  ctx.restore();}
// the sea or the land at a point of the place, from a small picture of the land made once
let FD_MASK=null;
function fd_isSea(x,y){if(!FD_MASK){const w=480,h=270,c=mkCanvas(w,h),q=c.getContext("2d");q.scale(w/1920,h/1080);q.fillStyle="#fff";q.beginPath();for(const r of fd_rings())fd_ringPath(q,r);q.fill();
    FD_MASK={w,h,d:q.getImageData(0,0,w,h).data};}
  const i=Math.floor(x/4),j=Math.floor(y/4);if(i<0||j<0||i>=FD_MASK.w||j>=FD_MASK.h)return true;return FD_MASK.d[(j*FD_MASK.w+i)*4+3]<60;}
// the winds as the charts showed them, by belt: where the wind blows to (east, north) and how strongly. The belts move north in the
// northern summer (m, the month, 0 for January); the trades, the calms near the equator, the westerlies
function fd_wind(lon,lat,m){const sh=m==null?0:5*Math.sin((m-3)/12*TAU),l=lat-sh;
  if(l>36)return[0.9,0.38,1.0];if(l>30)return[0.3,-0.2,0.3];if(l>8)return[-0.86,-0.48,0.9];if(l>1)return[0.15,0.1,0.12];
  if(l>-28)return[-0.72,0.66,0.9];if(l>-36)return[0.4,0.1,0.35];return[0.98,0.12,1.2];}
// the wind's particles over the sea: o.a, o.month, o.box [lon0, lat0, lon1, lat1] (where they blow), o.n, o.calm (0 to 1: the calms glow)
let FD_PARTS=null;
function fd_winds(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const z=o.cam&&o.cam.z||1;
  if(!FD_PARTS){const r=ag_rnd(1842),out=[];let k=0;while(out.length<1100&&k<20000){k++;const lon=lerp(-135,40,r()),lat=lerp(-64,64,r()),p=fd_xy(lon,lat);if(fd_isSea(p[0],p[1]))out.push({lon,lat,x:p[0],y:p[1],ph:r(),life:lerp(2.2,3.6,r())});}FD_PARTS=out;}
  const b=o.box||[-135,-64,40,64],m=o.month==null?6:o.month;ctx.save();ctx.lineCap="round";
  for(const p of FD_PARTS){if(p.lon<b[0]||p.lon>b[2]||p.lat<b[1]||p.lat>b[3])continue;const w=fd_wind(p.lon,p.lat,m),u=((t/p.life+p.ph)%1+1)%1,f=Math.sin(Math.PI*u)*a*Math.min(1,w[2]+0.15);
    if(f<0.02)continue;const L=26*w[2],x=p.x+w[0]*L*u,y=p.y-w[1]*L*u;if(!fd_isSea(x,y))continue;
    ctx.strokeStyle=rgba(FD.wind,0.55*f);ctx.lineWidth=2.1/Math.sqrt(z);ctx.beginPath();ctx.moveTo(x-w[0]*10*w[2],y+w[1]*10*w[2]);ctx.lineTo(x,y);ctx.stroke();}
  // the calms near the equator: a pale band where the trades die away and ships lie still
  const ca=o.calm||0;if(ca>0){const sh=5*Math.sin((m-3)/12*TAU),y0=fd_xy(0,8+sh)[1],y1=fd_xy(0,1+sh)[1],x0=fd_xy(-52,0)[0],x1=fd_xy(-12,0)[0],cy=(y0+y1)/2;
    // a soft band, fading at its ends: the same light laid in short strips, each as strong as it is far from the ends
    for(let i=0;i<24;i++){const u=(i+0.5)/24,f=Math.sin(Math.PI*u),xa=lerp(x0,x1,i/24),xb=lerp(x0,x1,(i+1)/24),g=ctx.createLinearGradient(0,y0,0,y1);
      g.addColorStop(0,rgba(FD.wind,0));g.addColorStop(0.5,rgba(FD.wind,0.13*ca*f));g.addColorStop(1,rgba(FD.wind,0));ctx.fillStyle=g;ctx.fillRect(xa,y0,xb-xa+0.5,y1-y0);}}
  ctx.restore();}
// the currents, as lanes of the map's light with a steady run along them: o.a, o.only (names)
const FD_CURRENTS={gulf:[[-80,25],[-79.5,30],[-76,34.5],[-70,38],[-60,40.5],[-48,42],[-38,45],[-25,49],[-12,52]],
  canary:[[-12,40],[-15,32],[-18,25],[-22,18],[-28,14]],northEq:[[-28,13],[-40,14.5],[-55,16],[-66,18]],
  southEq:[[2,-2],[-14,-3],[-28,-5],[-35,-8]],brazil:[[-35.5,-10],[-38.5,-18],[-44,-25],[-50,-33]],
  humboldt:[[-75,-45],[-75,-35],[-73,-25],[-79,-12],[-86,-4]]};
function fd_spline(ll,n){const P_=ll.map(q=>fd_xy(q[0],q[1])),out=[];n=n||10;for(let i=0;i<P_.length-1;i++){const p0=P_[Math.max(0,i-1)],p1=P_[i],p2=P_[i+1],p3=P_[Math.min(P_.length-1,i+2)];
    for(let k=0;k<n;k++){const u=k/n,u2=u*u,u3=u2*u;out.push([0.5*((2*p1[0])+(-p0[0]+p2[0])*u+(2*p0[0]-5*p1[0]+4*p2[0]-p3[0])*u2+(-p0[0]+3*p1[0]-3*p2[0]+p3[0])*u3),
      0.5*((2*p1[1])+(-p0[1]+p2[1])*u+(2*p0[1]-5*p1[1]+4*p2[1]-p3[1])*u2+(-p0[1]+3*p1[1]-3*p2[1]+p3[1])*u3)]);}}out.push(P_[P_.length-1]);return out;}
const FD_CPTS={};
function fd_currents(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;for(const k of Object.keys(FD_CURRENTS)){if(o.only&&!o.only.includes(k))continue;const pts=FD_CPTS[k]||(FD_CPTS[k]=fd_spline(FD_CURRENTS[k],8));
    md_lane(ctx,pts,MD.flow,0.55*a);md_flow(ctx,pts,t,{kind:"stream",col:MD.flow,a:0.7*a,every:0.35,dur:2.6,off:k.length*0.13});}}
// the routes from New York to San Francisco, round Cape Horn: the habit's and the charts'
const FD_PORT={ny:[-74,40.6,"New York"],sf:[-122.5,37.8,"San Francisco"],horn:[-67.3,-56,"Cape Horn"],wash:[-77,38.9,"Washington"],
  brussels:[4.35,50.85,"Brussels"],london:[-0.1,51.5,"London"],lisbon:[-9.1,38.7,"Lisbon"],hamburg:[10,53.5,"Hamburg"],
  copen:[12.6,55.7,"Copenhagen"],rio:[-43.2,-22.9,"Rio de Janeiro"],brest:[-4.5,48.4,"Brest"]};
const FD_ROUTE={
  habit:[[-74,40.6],[-62,38],[-45,34],[-31,26.5],[-23,18],[-20.5,10],[-21.5,4],[-24.5,-1],[-30,-8],[-36,-16],[-42,-26],[-50,-36],[-58,-46],[-63,-53],[-66.5,-57],[-71,-57.8],[-75,-55.5],
    [-78,-50],[-77,-40],[-76.5,-30],[-81,-17],[-89,-3],[-101,9],[-113,20],[-120.5,30],[-122.5,37.8]],
  charted:[[-74,40.6],[-66,34],[-55,25],[-44,15],[-36,6],[-31.5,0],[-32,-7],[-36,-15],[-42,-25],[-50,-36],[-58,-46],[-63,-53],[-66.5,-57],[-71,-57.8],[-76,-55.5],
    [-83,-50],[-93,-38],[-104,-24],[-113,-8],[-120,6],[-128,20],[-130,30],[-125.5,36],[-122.5,37.8]]};
const FD_RPTS={};
const fd_routePts=k=>FD_RPTS[k]||(FD_RPTS[k]=fd_spline(FD_ROUTE[k],8));
// a route drawn as far as u (0 to 1): o.col, o.a, o.dash (the habit's road is dashed: the way people went, not where the wind was)
function fd_route(ctx,k,u,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004||u<=0)return;md_lane(ctx,fd_routePts(k),o.col||FD.habit,a*(o.dim||0.85),{u,dash:o.dash?[10,12]:false,t:o.t||0});}
// where a ship is, u (0 to 1) of the way along a route, and which way it heads
function fd_along(k,u){const p=mk(fd_routePts(k).map(q=>P(q[0],q[1]))),q=at(p,clamp(u,0,1)),q2=at(p,clamp(u+0.004,0,1));return{x:q.x,y:q.y,dx:q2.x-q.x,dy:q2.y-q.y};}
// a sailing ship, seen from the side, its sails pale in the night: s its height, flip true to sail left; o.a, o.col (its glow)
function fd_ship(ctx,x,y,s,flip,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;glow(ctx,x,y-s*0.3,s*1.5,o.col||FD.habit,0.35);ctx.translate(x,y);ctx.scale((flip?-1:1)*s/40,s/40);
  ctx.fillStyle=rgba(FD.wood,1);ctx.strokeStyle=rgba(FD.paperHi,0.9);ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-24,-2);ctx.lineTo(24,-2);ctx.lineTo(18,8);ctx.lineTo(-19,8);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.strokeStyle=rgba(FD.paperHi,0.8);ctx.lineWidth=1.6;for(const mx of[-11,1,12]){ctx.beginPath();ctx.moveTo(mx,-2);ctx.lineTo(mx,-36+(mx===1?-2:0));ctx.stroke();}
  ctx.fillStyle=rgba(FD.paperHi,0.95);for(const [mx,h] of[[-11,26],[1,30],[12,24]]){for(let k=0;k<3;k++){const y0=-h-2+k*(h/3.2),w=9-k*0.8;ctx.beginPath();ctx.moveTo(mx-w,y0+1);ctx.quadraticCurveTo(mx,y0-2,mx+w,y0+1);ctx.lineTo(mx+w-1,y0+h/3.6);ctx.quadraticCurveTo(mx,y0+h/3.6+3,mx-w+1,y0+h/3.6);ctx.closePath();ctx.fill();}}
  ctx.beginPath();ctx.moveTo(24,-2);ctx.lineTo(36,-14);ctx.lineTo(23,-22);ctx.closePath();ctx.fill();ctx.restore();}
// a port: a point of light and its name, read at 30 px as seen; o.side "left" or "right", o.dy, o.a
function fd_port(ctx,cam,k,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const P_=FD_PORT[k],p=fd_xy(P_[0],P_[1]),z=cam&&cam.z||1;ctx.save();ctx.globalAlpha*=a;
  glow(ctx,p[0],p[1],16/z,MD.ink,0.9);ctx.fillStyle=rgba(MD.ink,1);ctx.beginPath();ctx.arc(p[0],p[1],4.2/z,0,TAU);ctx.fill();
  const left=o.side==="left";fd_say(ctx,cam,o.name||P_[2],p[0]+(left?-16:16)/z,p[1]+((o.dy||0)+10)/z,{w:700,size:o.size||30,align:left?"right":"left",col:o.col||MD.ink});ctx.restore();return p;}
// the five-degree squares the office read the logs into, over the North Atlantic: o.u (0 to 1, how many are lit, in a sweep from the
// west), o.month (0 to 11: the arrows turn with the season), o.a, o.cam. Each lit square shows where its wind blows most days
function fd_squares(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const z=o.cam&&o.cam.z||1,u=o.u==null?1:o.u,m=o.month==null?5:o.month;ctx.save();ctx.globalAlpha*=a;
  for(let lo=-80;lo<-5;lo+=5)for(let la=0;la<50;la+=5){const c=fd_xy(lo+2.5,la+2.5);if(!fd_isSea(c[0],c[1]))continue;const p0=fd_xy(lo,la+5),k=clamp((u*1.3-(lo+80)/75*0.9-((la)/50)*0.25)*3,0,1);if(k<=0)continue;
    ctx.save();ctx.globalAlpha*=ag_eo(k);ctx.fillStyle=rgba(MD.flow,0.07);ctx.fillRect(p0[0]+1/z,p0[1]+1/z,35-2/z,35-2/z);ctx.strokeStyle=rgba(MD.flow,0.42);ctx.lineWidth=1.2/z;ctx.strokeRect(p0[0]+1/z,p0[1]+1/z,35-2/z,35-2/z);
    const w=fd_wind(lo+2.5,la+2.5,m),L=12*Math.min(1,w[2]+0.2);if(w[2]<0.2){ctx.strokeStyle=rgba(MD.flow,0.9);ctx.lineWidth=1.8/z;ctx.beginPath();ctx.arc(c[0],c[1],4,0,TAU);ctx.stroke();}
    else{const dx=w[0]*L,dy=-w[1]*L;ctx.strokeStyle=rgba(MD.flow,0.95);ctx.lineWidth=2.2/z;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(c[0]-dx,c[1]-dy);ctx.lineTo(c[0]+dx,c[1]+dy);ctx.stroke();
      const an=Math.atan2(dy,dx);ctx.beginPath();ctx.moveTo(c[0]+dx,c[1]+dy);ctx.lineTo(c[0]+dx-6*Math.cos(an-0.5),c[1]+dy-6*Math.sin(an-0.5));ctx.moveTo(c[0]+dx,c[1]+dy);ctx.lineTo(c[0]+dx-6*Math.cos(an+0.5),c[1]+dy-6*Math.sin(an+0.5));ctx.stroke();}
    ctx.restore();}
  ctx.restore();}
// the weather reports read again, over a century later: points of light where ships kept their logs, more where more sailed. o.u (0 to 1:
// how many are lit), o.a. Each point stands for many reports
let FD_DOTS=null;
function fd_reports(ctx,t,o){o=o||{};const a=o.a==null?1:o.a,u=o.u==null?1:o.u;if(a<=0.004||u<=0)return;
  if(!FD_DOTS){const r=ag_rnd(1853),out=[],lanes=[fd_routePts("habit"),fd_routePts("charted"),FD_CPTS.gulf||fd_spline(FD_CURRENTS.gulf,8)];
    // most along the ships' roads, the rest scattered over every sea
    for(let i=0;i<2600;i++){let x,y;if(r()<0.55){const L=lanes[Math.floor(r()*lanes.length)],q=L[Math.floor(r()*L.length)];x=q[0]+(r()-0.5)*90;y=q[1]+(r()-0.5)*70;}
      else{const p=fd_xy(lerp(-135,135,r()),lerp(-60,62,r()));x=p[0];y=p[1];}if(fd_isSea(x,y))out.push([x,y,r()]);}FD_DOTS=out;}
  ctx.save();const ga=ctx.globalAlpha;ctx.fillStyle=rgba(MD.flow,0.75);const z=o.cam&&o.cam.z||1,rr0=1.7/Math.sqrt(z);
  for(const d of FD_DOTS){if(d[2]>u)continue;ctx.globalAlpha=ga*a*(0.35+0.65*clamp((u-d[2])*8,0,1));ctx.fillRect(d[0]-rr0,d[1]-rr0,rr0*2,rr0*2);}ctx.restore();}

/* ---------------------------------------------------------------- the places, each painted once */
// the night sea the chart is drawn over: the module's navy, a little bluer, with no grid (the chart has its own lines)
AG_PLACES.fdSea=c=>{let g=c.createLinearGradient(0,0,0,1080);g.addColorStop(0,"#0a1430");g.addColorStop(0.55,"#071026");g.addColorStop(1,"#040812");c.fillStyle=g;c.fillRect(0,0,1920,1080);
  for(const [x,y,r,a] of [[700,420,900,0.06],[1500,700,700,0.04]]){const q=c.createRadialGradient(x,y,0,x,y,r);q.addColorStop(0,rgba(MD.flow,a));q.addColorStop(1,rgba(MD.flow,0));c.fillStyle=q;c.fillRect(0,0,1920,1080);}};
// a row of logbooks on a shelf, from x0 to x1 standing on y, lit from the right (lx) as the lamp lights them; seed for their sizes
function fd_paintBooks(c,x0,x1,y,hMax,seed,lx){const r=ag_rnd(seed),cols=[[92,52,36],[70,44,34],[108,74,46],[60,48,40],[86,40,34],[58,62,52],[98,82,58],[74,58,44]];let x=x0;
  while(x<x1-14){if(r()<0.07){// a few lie flat, in a short stack
      const n=2+Math.floor(r()*3),w=Math.min(x1-x,70+r()*40);for(let k=0;k<n;k++){const col=cols[Math.floor(r()*cols.length)],f=0.42+0.5*clamp((x-x0+lx)/1400,0,1),cc=mix([10,8,8],col,f);
        c.fillStyle=rgba(cc,1);c.fillRect(x,y-(k+1)*15,w-k*4,14);c.fillStyle=rgba(mix(cc,FD.gilt,0.35),0.6);c.fillRect(x,y-(k+1)*15+6,w-k*4,2);}x+=w+4;continue;}
    const w=16+r()*16,h=hMax*(0.74+0.26*r()),col=cols[Math.floor(r()*cols.length)],f=0.4+0.55*clamp((x-x0+lx)/1400,0,1),cc=mix([10,8,8],col,f);
    const g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,rgba(mix(cc,[0,0,0],0.35),1));g.addColorStop(0.55,rgba(cc,1));g.addColorStop(1,rgba(mix(cc,[0,0,0],0.25),1));c.fillStyle=g;c.fillRect(x,y-h,w,h);
    c.fillStyle=rgba(mix(cc,FD.gilt,0.45),0.75);c.fillRect(x+2,y-h+10,w-4,2.5);c.fillRect(x+2,y-12,w-4,2.5);if(r()<0.5){c.fillStyle=rgba(mix(cc,FD.paper,0.35),0.7);c.fillRect(x+3,y-h+h*0.3,w-6,h*0.16);}
    x+=w+(r()<0.15?3:1);}}
// the Navy's office in Washington, 1842: shelves of old logbooks on the left, a chart on the wall, a desk with a lamp. Night, lamp-lit
function fd_paintOffice(c){let g=c.createLinearGradient(0,0,0,1080);g.addColorStop(0,"#0c1220");g.addColorStop(0.7,"#0a0e19");g.addColorStop(1,"#050608");c.fillStyle=g;c.fillRect(0,0,1920,1080);
  // the panelled wall
  c.strokeStyle="rgba(170,180,210,0.05)";c.lineWidth=2;for(let x=840;x<1920;x+=230){c.strokeRect(x+16,640,198,210);c.strokeRect(x+16,70,198,500);}
  c.fillStyle="rgba(140,100,64,0.16)";c.fillRect(800,606,1120,12);
  // the floor
  g=c.createLinearGradient(0,872,0,1080);g.addColorStop(0,"#0b0907");g.addColorStop(1,"#040303");c.fillStyle=g;c.fillRect(0,872,1920,208);
  c.strokeStyle="rgba(120,90,60,0.07)";c.lineWidth=2;for(let k=-12;k<26;k++){c.beginPath();c.moveTo(960+k*90,1080);c.lineTo(960+k*40,872);c.stroke();}
  // the bookcase and its six shelves of logbooks
  const bx=60,by=80,bw=720,bh=800;c.fillStyle=rgba(FD.wood,1);c.fillRect(bx,by,bw,bh);c.fillStyle="#0a0705";c.fillRect(bx+22,by+22,bw-44,bh-30);
  for(let k=0;k<6;k++){const y=by+22+(k+1)*((bh-30)/6);fd_paintBooks(c,bx+26,bx+bw-26,y-12,104,42+k*7,bx+400);c.fillStyle=rgba(FD.woodHi,0.85);c.fillRect(bx+22,y-12,bw-44,12);c.fillStyle="rgba(0,0,0,0.5)";c.fillRect(bx+22,y,bw-44,3);}
  g=c.createLinearGradient(bx,0,bx+bw,0);g.addColorStop(0,"rgba(0,0,0,0.55)");g.addColorStop(1,"rgba(0,0,0,0)");c.fillStyle=g;c.fillRect(bx,by,bw,bh);
  c.fillStyle=rgba(FD.woodHi,0.5);c.fillRect(bx,by,bw,10);c.fillRect(bx+bw-14,by,14,bh);
  // the chart on the wall, in its frame: the North Atlantic, its coasts in sepia
  const fx=900,fy=110,fw=660,fh=440;c.fillStyle=rgba(FD.wood,1);c.fillRect(fx-16,fy-16,fw+32,fh+32);c.fillStyle=rgba(mix(FD.paperDk,[0,0,0],0.35),1);c.fillRect(fx,fy,fw,fh);
  c.save();c.beginPath();c.rect(fx,fy,fw,fh);c.clip();const k=fw/115,mx=lo=>fx+(lo+100)*k,my=la=>fy+(64-la)*k;
  c.fillStyle=rgba(mix(FD.paperDk,[60,40,20],0.55),1);c.strokeStyle=rgba([70,50,32],0.9);c.lineWidth=1.6;c.beginPath();
  for(const r of FD_LAND){let lo=0,la=0;for(let i=0;i<r.length;i+=2){lo+=r[i];la+=r[i+1];const X=mx(lo/10),Y=my(la/10);i?c.lineTo(X,Y):c.moveTo(X,Y);}c.closePath();}c.fill();c.stroke();
  c.strokeStyle="rgba(70,50,32,0.35)";c.lineWidth=1;for(let lo=-100;lo<=15;lo+=10){c.beginPath();c.moveTo(mx(lo),fy);c.lineTo(mx(lo),fy+fh);c.stroke();}for(let la=0;la<=64;la+=10){c.beginPath();c.moveTo(fx,my(la));c.lineTo(fx+fw,my(la));c.stroke();}
  // a compass rose's lines across the sea
  const ox=mx(-42),oy=my(30);c.strokeStyle="rgba(70,50,32,0.4)";for(let i=0;i<16;i++){const an=i*TAU/16;c.beginPath();c.moveTo(ox,oy);c.lineTo(ox+Math.cos(an)*900,oy+Math.sin(an)*900);c.stroke();}
  c.restore();g=c.createLinearGradient(fx,0,fx+fw,0);g.addColorStop(0,"rgba(0,0,0,0.35)");g.addColorStop(1,"rgba(0,0,0,0)");c.fillStyle=g;c.fillRect(fx,fy,fw,fh);
  // the desk, its top lit by the lamp
  c.fillStyle="#1d140e";c.beginPath();c.moveTo(760,770);c.lineTo(1740,770);c.lineTo(1890,900);c.lineTo(620,900);c.closePath();c.fill();
  g=c.createRadialGradient(1500,790,10,1500,790,700);g.addColorStop(0,"rgba(140,98,62,0.85)");g.addColorStop(1,"rgba(60,40,26,0)");c.fillStyle=g;c.beginPath();c.moveTo(760,770);c.lineTo(1740,770);c.lineTo(1890,900);c.lineTo(620,900);c.closePath();c.fill();
  c.fillStyle="#120c08";c.fillRect(620,900,1270,180);c.fillStyle="rgba(150,110,70,0.25)";c.fillRect(620,900,1270,4);
  // papers and a shut logbook on the desk, an inkwell and its pen
  c.fillStyle="rgba(200,184,150,0.5)";c.beginPath();c.moveTo(1040,800);c.lineTo(1240,792);c.lineTo(1262,850);c.lineTo(1050,860);c.closePath();c.fill();
  c.fillStyle="#3a2418";c.fillRect(1290,812,170,40);c.fillStyle="rgba(214,178,110,0.5)";c.fillRect(1290,822,170,3);
  c.fillStyle="#0e0c0c";c.beginPath();c.ellipse(1630,846,26,10,0,0,TAU);c.fill();c.fillRect(1606,820,48,26);c.strokeStyle="rgba(230,220,200,0.55)";c.lineWidth=2.4;c.beginPath();c.moveTo(1640,826);c.lineTo(1700,740);c.stroke();
  // the lamp: a brass foot and a glass chimney, its flame
  c.fillStyle="#6e5530";c.beginPath();c.ellipse(1500,800,46,12,0,0,TAU);c.fill();c.fillRect(1490,700,20,100);c.beginPath();c.ellipse(1500,700,40,26,0,0,TAU);c.fill();
  g=c.createLinearGradient(1474,560,1526,560);g.addColorStop(0,"rgba(255,230,190,0.25)");g.addColorStop(0.5,"rgba(255,240,210,0.55)");g.addColorStop(1,"rgba(255,230,190,0.2)");c.fillStyle=g;c.beginPath();c.moveTo(1484,690);c.bezierCurveTo(1460,650,1474,610,1486,580);c.lineTo(1514,580);c.bezierCurveTo(1526,610,1540,650,1516,690);c.closePath();c.fill();
  c.fillStyle="rgba(255,214,140,1)";c.beginPath();c.ellipse(1500,650,7,16,0,0,TAU);c.fill();
  // the lamp's light on the room
  c.globalCompositeOperation="lighter";g=c.createRadialGradient(1500,640,10,1500,640,1150);g.addColorStop(0,"rgba(255,200,130,0.42)");g.addColorStop(0.12,"rgba(255,180,110,0.16)");g.addColorStop(0.5,"rgba(255,160,90,0.05)");g.addColorStop(1,"rgba(255,150,80,0)");c.fillStyle=g;c.fillRect(0,0,1920,1080);c.globalCompositeOperation="source-over";
  const v=c.createRadialGradient(1100,540,300,1100,540,1250);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(0,0,0,0.6)");c.fillStyle=v;c.fillRect(0,0,1920,1080);}
AG_PLACES.fdOffice=c=>fd_paintOffice(c);
// the hall in Brussels, 1853: tall windows on the night, a lamp above, and the long table the delegates sat at
function fd_paintHall(c){let g=c.createLinearGradient(0,0,0,1080);g.addColorStop(0,"#0d1322");g.addColorStop(0.7,"#0a0f1c");g.addColorStop(1,"#050609");c.fillStyle=g;c.fillRect(0,0,1920,1080);
  for(const x of [120,1620]){const w=210;g=c.createLinearGradient(0,90,0,700);g.addColorStop(0,"rgba(60,90,150,0.42)");g.addColorStop(1,"rgba(30,50,90,0.25)");c.fillStyle=g;rr(c,x,90,w,640,w/2);c.fill();
    c.strokeStyle="rgba(150,120,80,0.35)";c.lineWidth=8;rr(c,x,90,w,640,w/2);c.stroke();c.lineWidth=4;c.beginPath();c.moveTo(x+w/2,90);c.lineTo(x+w/2,730);for(let y=300;y<730;y+=140){c.moveTo(x,y);c.lineTo(x+w,y);}c.stroke();
    c.fillStyle="rgba(70,26,30,0.85)";c.fillRect(x-60,60,56,720);c.fillRect(x+w+4,60,56,720);}
  c.strokeStyle="rgba(170,180,210,0.05)";c.lineWidth=2;for(let x=420;x<1560;x+=190)c.strokeRect(x+12,560,166,200);
  c.fillStyle="rgba(150,110,64,0.16)";c.fillRect(380,530,1180,10);
  // the long table, its green cloth, and papers on it
  c.fillStyle="#13221a";c.beginPath();c.moveTo(150,780);c.lineTo(1770,780);c.lineTo(1920,930);c.lineTo(0,930);c.closePath();c.fill();
  g=c.createRadialGradient(960,760,20,960,800,1000);g.addColorStop(0,"rgba(70,110,80,0.6)");g.addColorStop(1,"rgba(30,50,40,0)");c.fillStyle=g;c.beginPath();c.moveTo(150,780);c.lineTo(1770,780);c.lineTo(1920,930);c.lineTo(0,930);c.closePath();c.fill();
  c.fillStyle="#0e0a07";c.fillRect(0,930,1920,150);c.fillStyle="rgba(150,110,70,0.3)";c.fillRect(0,930,1920,4);
  const r=ag_rnd(1853);for(let i=0;i<12;i++){const x=220+i*130+r()*40,y=800+r()*80;c.save();c.translate(x,y);c.rotate((r()-0.5)*0.3);c.fillStyle="rgba(214,200,170,0.55)";c.fillRect(-36,-12,72,24);c.restore();}
  // the lamp's light from above
  c.globalCompositeOperation="lighter";g=c.createRadialGradient(960,120,10,960,300,1100);g.addColorStop(0,"rgba(255,200,130,0.38)");g.addColorStop(0.25,"rgba(255,180,110,0.12)");g.addColorStop(1,"rgba(255,160,90,0)");c.fillStyle=g;c.fillRect(0,0,1920,1080);c.globalCompositeOperation="source-over";
  c.fillStyle="rgba(255,214,150,0.9)";for(let i=0;i<5;i++){c.beginPath();c.arc(860+i*50,70+(i%2)*10,5,0,TAU);c.fill();}
  const v=c.createRadialGradient(960,500,300,960,540,1200);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(0,0,0,0.6)");c.fillStyle=v;c.fillRect(0,0,1920,1080);}
AG_PLACES.fdHall=c=>fd_paintHall(c);

/* ---------------------------------------------------------------- paper */
// a sheet of paper, lit softly, with a shadow under it: o.col (its colour), o.a, o.r, o.rot (radians, about its middle)
function fd_paper(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const r=o.r==null?6:o.r,col=o.col||FD.paper;ctx.save();ctx.globalAlpha*=a;
  if(o.rot){ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot);ctx.translate(-x-w/2,-y-h/2);}
  ctx.shadowColor="rgba(0,0,0,0.55)";ctx.shadowBlur=34;ctx.shadowOffsetY=14;rr(ctx,x,y,w,h,r);ctx.fillStyle=rgba(col,1);ctx.fill();ctx.shadowColor="transparent";ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  const g=ctx.createRadialGradient(x+w*0.35,y+h*0.3,0,x+w*0.5,y+h*0.5,Math.max(w,h)*0.85);g.addColorStop(0,"rgba(255,252,240,0.32)");g.addColorStop(1,o.white?"rgba(150,160,180,0.18)":"rgba(120,92,56,0.26)");ctx.fillStyle=g;rr(ctx,x,y,w,h,r);ctx.fill();ctx.restore();}
// words in a hand of the time: the module's face, leaning, in ink. Under 28 px as seen it is decoration (o.deco)
function fd_hand(ctx,s,x,y,o){o=o||{};ctx.save();ctx.translate(x,y);ctx.transform(1,0,-0.2,1,0,0);T(ctx,s,0,0,{w:o.w||600,size:o.size||30,color:rgba(o.col||FD.ink,o.a==null?0.92:o.a),align:o.align||"left",deco:o.deco?1:0});ctx.restore();}
// a logbook's page, as one ship kept it (kind 0: in columns; 1: in sentences; 2: in its own short hand), at (x, y), w wide, its height
// from its width; o.heads and o.rows (each 0 to 1, in order) bring its headings and its lines in; o.a; o.dim (0 to 1: it greys, unread)
const FD_LOGS=[
  {title:"Logbook · June 1841",heads:["Where it was","Wind","Weather","Current"],cols:[0,0.31,0.53,0.74],
    rows:[["38°N 64°W","SW, fresh","Fair","NE, 1 knot"],["36°N 58°W","W, strong","Squalls","E, 2 knots"],["33°N 52°W","NW, light","Clear","E, 1 knot"]]},
  {title:"Journal · 3rd June",lines:["Fresh breeze from the N.E. and","cloudy. Current setting to the","eastward, about one knot. At","noon, Lat. 36 N, Long. 58 W."]},
  {title:"Remarks",heads:["Lat.","Long.","Wd.","Wr.","Cur."],cols:[0,0.2,0.4,0.62,0.8],rows:[["36.2","58.1","WSW 6","b.c.","E 1½"],["35.9","56.4","W 7","q.","E 2"],["35.1","54.0","NW 4","b.","E 1"]]}];
function fd_logPage(ctx,x,y,w,kind,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const k=w/1000,h=600*k,L=FD_LOGS[kind],sc=o.scale||1,deco=30*k*sc<28;
  ctx.save();ctx.globalAlpha*=a;fd_paper(ctx,x,y,w,h,{rot:o.rot||0,col:mix(FD.paper,[150,140,120],0.35*(o.dim||0))});
  if(o.rot){ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot);ctx.translate(-x-w/2,-y-h/2);}
  const ink=mix(FD.ink,FD.inkSoft,0.6*(o.dim||0)),mx=x+60*k,hd=o.heads||[1,1,1,1,1],rw=o.rows||[1,1,1,1];
  ctx.strokeStyle=rgba(FD.inkSoft,0.25);ctx.lineWidth=1.4*k;for(let i=0;i<7;i++){const yy=y+(150+i*66)*k;ctx.beginPath();ctx.moveTo(x+40*k,yy);ctx.lineTo(x+w-40*k,yy);ctx.stroke();}
  ctx.strokeStyle=rgba([150,60,50],0.35);ctx.beginPath();ctx.moveTo(x+44*k,y+20*k);ctx.lineTo(x+44*k,y+h-20*k);ctx.stroke();
  fd_hand(ctx,L.title,mx,y+92*k,{size:34*k,w:700,col:ink,deco});
  if(L.heads){L.heads.forEach((s,i)=>{const ha=hd[i]==null?1:hd[i];if(ha<=0)return;fd_hand(ctx,s,mx+L.cols[i]*(w-120*k),y+176*k,{size:30*k,w:800,col:ink,a:0.95*ha,deco});});
    ctx.strokeStyle=rgba(FD.ink,0.5);ctx.lineWidth=2*k;ctx.beginPath();ctx.moveTo(x+40*k,y+196*k);ctx.lineTo(x+w-40*k,y+196*k);ctx.stroke();
    L.rows.forEach((r,j)=>{const ra=rw[j]==null?1:rw[j];if(ra<=0)return;r.forEach((s,i)=>{const ha=hd[i]==null?1:hd[i];if(ha<=0)return;fd_hand(ctx,s,mx+L.cols[i]*(w-120*k),y+(262+j*66)*k,{size:30*k,col:ink,a:0.9*ra*ha,deco});});});}
  else L.lines.forEach((s,j)=>{const ra=rw[j]==null?1:rw[j];if(ra<=0)return;fd_hand(ctx,s,mx,y+(196+j*66)*k,{size:30*k,col:ink,a:0.9*ra,deco});});
  ctx.restore();return{x,y,w,h};}
// a logbook, shut, in its leather: o.col, o.a
function fd_book(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const col=o.col||[96,58,38];ctx.save();ctx.globalAlpha*=a;
  ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=18;ctx.shadowOffsetY=8;rr(ctx,x,y,w,h,5);ctx.fillStyle=rgba(col,1);ctx.fill();ctx.shadowColor="transparent";
  ctx.fillStyle=rgba(FD.paper,0.9);ctx.fillRect(x+w-7,y+5,5,h-10);ctx.fillStyle=rgba(mix(col,FD.gilt,0.5),0.8);ctx.fillRect(x+10,y+12,w-24,3);ctx.fillRect(x+10,y+h-15,w-24,3);
  rr(ctx,x+w*0.28,y+h*0.32,w*0.4,h*0.22,3);ctx.fillStyle=rgba(mix(col,FD.paper,0.4),0.8);ctx.fill();ctx.restore();}
// the log agreed at Brussels in 1853, as a card in the colour of what people agree on: o.a, o.k (springs in), o.kick
function fd_form53(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return{x,y,w,h:360};const h=360;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  md_card(ctx,x,y,w,h,{edge:MD.agreed,glow:0.8});md_icon(ctx,"contract",x+w-56,y+52,40,MD.agreed);
  md_T(ctx,(o.kick||"Agreed at Brussels, 1853").toUpperCase(),x+28,y+52,{w:800,size:28,ls:4,col:MD.agreed});
  md_T(ctx,"One log for ships of every flag",x+28,y+104,{w:700,size:36});
  const rows=[["Once a day","Position, current, barometer, air and sea"],["Three times a day","The wind: its force and direction"]];
  rows.forEach((r,i)=>{const yy=y+180+i*96;ctx.strokeStyle="rgba(255,209,102,0.25)";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x+28,yy-44);ctx.lineTo(x+w-28,yy-44);ctx.stroke();
    md_T(ctx,r[0],x+28,yy,{w:800,size:28,col:MD.agreed});md_T(ctx,r[1],x+28,yy+36,{w:500,size:28,col:MD.ink});});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the people of 1842 to 1853 */
// a dark coat's brass buttons (a captain's), in figure space, outside the shirt's opening
function fd_buttons(c){for(const [x,y] of [[374,652],[378,716],[376,780],[370,844]])ag_soft(c,cc=>cc.arc(x,y,7,0,TAU),FD.gilt,[255,240,200],x-2,y-3,8,null);}
// a black stock at the throat, tied in a small bow: drawn over the person (o.front), in figure space, as the 1850s wore it
function fd_stock(c){ag_soft(c,cc=>{cc.moveTo(276,590);cc.bezierCurveTo(300,606,330,608,352,600);cc.lineTo(350,624);cc.bezierCurveTo(326,634,296,630,280,616);cc.closePath();},[22,20,24],[90,90,104],320,600,60,null);
  ag_soft(c,cc=>{cc.moveTo(316,616);cc.lineTo(292,604);cc.lineTo(296,638);cc.closePath();cc.moveTo(318,616);cc.lineTo(344,606);cc.lineTo(340,640);cc.closePath();},[26,24,28],[110,110,124],318,612,40,null);
  ag_soft(c,cc=>cc.ellipse(317,618,8,9,0,0,TAU),[16,16,18],[90,90,100],316,614,10,null);}
const FD_P={
  captain:{name:"A captain",skin:[222,182,150],hair:{style:"side",c:[96,72,54]},beard:[104,80,60],top:{kind:"suit",c:[30,36,58],inner:[234,230,218],paint:fd_buttons},breath:0.27},
  quetelet:{name:"Adolphe Quetelet",skin:[232,198,172],hair:{style:"side",c:[178,172,164]},top:{kind:"suit",c:[34,32,40],inner:[236,232,220]},breath:0.24}};
// a person of that time, holding the paper the story is about (o.paper(ctx, x, y) draws it in figure space, above the near hand)
// held at its upper left corner, under the hand, below the stock, so the hand shows on its edge
function fd_period(ctx,who,x,y,s,o){o=o||{};return md_person(ctx,FD_P[who],x,y,s,Object.assign({pose:"hold",holdBack:(c,h)=>{if(o.paper)o.paper(c,h.near[0]-26,h.near[1]-58);},front:c=>fd_stock(c)},o));}
// a small sheet held up: the log form, its edge in gold, lines on it (decoration: the card beside it says what it is)
function fd_heldForm(c,x,y,o){o=o||{};const w=170,h=220;c.save();c.translate(x,y);c.rotate(-0.06);
  c.fillStyle=rgba(FD.paperHi,1);c.shadowColor="rgba(0,0,0,0.4)";c.shadowBlur=14;c.fillRect(0,0,w,h);c.shadowColor="transparent";c.strokeStyle=rgba(MD.agreed,o.gold==null?0.9:o.gold);c.lineWidth=5;c.strokeRect(2,2,w-4,h-4);
  c.strokeStyle=rgba(FD.inkSoft,0.6);c.lineWidth=2;for(let i=0;i<7;i++){c.beginPath();c.moveTo(16,34+i*25);c.lineTo(w-16,34+i*25);c.stroke();}for(const xx of[56,96,130]){c.beginPath();c.moveTo(xx,26);c.lineTo(xx,h-18);c.stroke();}c.restore();}
