/* Learning Data: "Pause and think" for Which value wins, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (hidden, rules, emails, dryrun), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series' labs and scenarios are its own, for all its films
   (assets/master-and-reference-data/), so no question has a "stop"; the page's .player data-labs leads to them. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "hidden":{q:"The quick fix lets the newest value win. Why does Linh's birth date become HR's typo?",
    opts:[{t:"HR sends its whole file again every teaching period, so its values always look newest, typo included.",ok:true},{t:"The student system lost her birth date, so HR's was the only value left to win."},{t:"HR sends only its changes, and the typo was a change, so it was the newest value that period.",near:true}],
    why:"Newest means the last one received, not the last one confirmed, so a source that sends everything again wins every time. And one order for every field, inside the code, hides the choice from the people who own the data. Which of your systems sends its whole file again every night?"},
  "rules":{q:"HR sends a birth date that differs from the student system's. What does Jun's rule do?",
    opts:[{t:"HR's value takes the field, because it's the newer, and the old one is kept in the history."},{t:"The student system's value stays, and HR's waits for Mei, who can pin the right one with a reason, until a date.",ok:true},{t:"The student system's value stays, and HR's is dropped, since the student system always wins for birth dates.",near:true}],
    why:"Each field has the source it trusts most, like the Beagle's two standards. A different value from another source doesn't take over: it waits for a person to decide. Every other field falls back on the same order: the most trusted source, then the newest confirmed value, then the most complete. Which field in your data would you trust to one source only?"},
  "emails":{q:"Linh has four emails. Why doesn't one of them win?",
    opts:[{t:"Emails are too hard to compare across systems, so the rules leave them as each system sent them."},{t:"None is wrong, so all four are kept, and the one she used most recently is shown first wherever an email is needed.",near:true},{t:"None is wrong: each is for something, so each is kept as a contact point with its purpose, its source and when she last confirmed it.",ok:true}],
    why:"Not every field has one right value. Her student email is for study, her staff email for work, and two are personal, so each office uses the one for its purpose: HR writes to her staff email, the alumni office to a personal one. What would break if only one were kept?"},
  "dryrun":{q:"The alumni office asks for a new rule for personal email. What happens before it runs?",
    opts:[{t:"A dry run lists every value it would change, 1,284 of them; Mei checks a sample, and the registrar, who owns the data, approves.",ok:true},{t:"It runs at once on every record, and the old rule's results are kept in case it has to be undone."},{t:"A dry run lists every value it would change, 1,284 of them, and the alumni office, which asked for it, approves.",near:true}],
    why:"Rules change too. A dry run shows every value a change would touch before it touches any, the owner of the data approves it, and it runs as version two, with its date, so anyone can see which rule chose a value, and when. In your organisation, who should approve a change to a rule like this?"}
  }}};
