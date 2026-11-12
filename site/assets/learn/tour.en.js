/* Learning Data: the words of the guided tour ("?" in the header), in English. tour.js shows, in this order, each step whose part
   (sel) is on the page and visible, so the same list serves every page; a step without sel is always shown. */
window.LD_TOUR_STEPS={
 text:{name:"How this site works",next:"Next",back:"Back",done:"Done",close:"Close the tour",of:"{n} of {of}"},
 steps:[
  {sel:"header.top nav",title:"Three places",text:"Start here plays the introduction. Topics holds everything else. Making of shows how the films are made."},
  {sel:".player",title:"The film",text:"Press Play. The buttons under the film jump to any chapter."},
  {sel:"#think",title:"Pause and think",text:"When it's on, the film stops at the end of chapters with one question. Turn it off to watch straight through."},
  {sel:"#cc",title:"Captions",text:"Turn the captions on or off. The Spanish pages have them in Spanish."},
  {sel:"nav.course .path",title:"A film's steps",text:"Watch the film, then try what it offers: labs to take it apart, situations to test yourself. What you've done shows here."},
  {sel:".view-switch",title:"Two views",text:"The learning route shows how the topics connect. The list shows every topic as a row, with a search."},
  {sel:".route .r-goals",title:"Pick a goal",text:"A goal lights up a short route and numbers its stops. Whole route shows everything again."},
  {sel:".route .r-map, .route .r-rail",title:"The route",text:"Each station is a topic. Select one to see its films and series. Its ring fills as you watch."},
  {sel:"#ix-q",title:"Search what the films say",text:"Type a word. The results name the film and the lines that say it, and each line opens the film at that second."},
  {sel:".list-view .ix-group",title:"A row for each topic",text:"Open a row to see who the topic is for, and its films and series."},
  {sel:".more .lang",title:"English or Spanish",text:"Every page has both. The films are in English, with Spanish captions, and some have Spanish sound."},
  {sel:".nav-tools .theme",title:"Dark or light",text:"Switch the look. Your choice is remembered on this device."},
  {title:"Your progress stays with you",text:"What you watch and answer is kept in this browser only. Nothing is sent anywhere."}
 ]};
