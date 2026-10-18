/* Learning Data: "Pause and think" for Which value wins, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (hidden, rules, emails, dryrun), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "hidden":{q:"The quick fix lets the newest value win. Why does Linh's birth date become HR's typo?",
    opts:[{t:"HR is the source the university trusts most."},{t:"HR sends its whole file again every teaching period, so its values always look newest, typo included.",ok:true},{t:"The student system lost her birth date."}],
    why:"Newest means the last one received, not the last one confirmed, so a source that sends everything again wins every time. And one order for every field, inside the SQL, hides the choice from the people who own the data. Which of your systems sends its whole file again every night?"},
  "rules":{q:"HR sends a birth date that differs from the student system's. What does Jun's rule do?",
    opts:[{t:"HR's value takes the field, because it's newer."},{t:"The student system's value stays, and HR's waits for Mei, who can pin the right one with a reason, until a date.",ok:true},{t:"The record keeps both birth dates and shows them side by side."}],
    why:"Each field has the source it trusts most, like the Beagle's two standards. A different value from another source doesn't take over: it waits for a person to decide. Every other field falls back on the same order: the most trusted source, then the newest confirmed value, then the most complete. Which field in your data would you trust to one source only?"},
  "emails":{q:"Linh has four emails. Why doesn't one of them win?",
    opts:[{t:"Emails are too hard to compare."},{t:"None of them is wrong: each is for something, so each is kept as a contact point with its purpose, its source and the day she last confirmed it.",ok:true},{t:"The email column can hold four values."}],
    why:"Not every field has one right value. Her student email is for study, her staff email for work, and two are personal, so each office uses the one for its purpose: HR writes to her staff email, the alumni office to a personal one. What would break if only one were kept?"},
  "dryrun":{q:"The alumni office asks for a new rule for personal email. What happens before it runs?",
    opts:[{t:"It runs at once, and replaces the old rule without a trace."},{t:"A dry run lists every value it would change, 1,284 of them; Mei checks a sample, and the registrar, who owns the data, approves.",ok:true},{t:"Jun tries it on Linh's record alone."}],
    why:"Rules change too. A dry run shows every value a change would touch before it touches any, the owner of the data approves it, and it runs as version two, with its date, so anyone can see which rule chose a value, and when. In your organisation, who should approve a change to a rule like this?"}
  }}};
