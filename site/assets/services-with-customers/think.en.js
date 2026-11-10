/* Learning Data: "Pause and think" for Services with customers, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (customers, layers, door), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  customers:{q:"Helena names her customers in four groups. Why write down what hurts and what drives each group?",
    opts:[{t:"So the team can rank the groups, and serve first the one that complains the loudest about its data."},{t:"So each service is designed for what the team believes each group needs, from its own long experience.",near:true},{t:"So each service is designed for a need a customer has said, in their own words, not for the team's guess.",ok:true}],
    why:"The pains and drivers come from the 31 conversations of Listen first, in the customers' own words: two numbers for the same thing, weeks of waiting for access, not knowing which table to trust. The team's experience matters, but a service designed from its guess can miss what people need. Which of your customers' pains could you quote today?"},
  layers:{q:"Walking down the layers, Helena finds 17 of the old warehouse's 38 reports that no one opened in a year. What does the film say to do?",
    opts:[{t:"Ask why each one is there: a system that serves no customer's need may have no reason left to stay.",ok:true},{t:"Switch them all off that night, since a report that no one opened in a year can't serve anyone at all.",near:true},{t:"Add each one to a service, so that every report the warehouse keeps has a customer named on the page."}],
    why:"A system that serves no customer's need raises one question: why is it there? Asking comes first: a report opened once a year, for an audit, may still have a reason. Then each one either finds its customer or goes. Which of your systems would you struggle to give a customer?"},
  door:{q:"When the front door opens, three of the 45 requests land on none of the four services. What does that show?",
    opts:[{t:"That the front door failed, since a page of services written well would catch every request that comes."},{t:"Where the page needs to change: a gap the team can fill, or work that belongs to someone else.",ok:true},{t:"That the page needs a fifth service, so every request that comes to the door has a place of its own.",near:true}],
    why:"A request that lands on no service isn't a failure: it shows where the page needs to change. Two belonged to digital services and went there with a note; one, help with a staff survey, was a gap the team could fill inside advice and training. A new service for every stray request would blur the page. What landed on none of your services last month?"}
  }}};
