/* Learning Data: "Pause and think" for Files as data and as context, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (invoices, contracts, written), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "invoices":{q:"The functions read October's 3,860 invoices into rows, and checks sort them. Why does every row keep the path of its file?",
    opts:[{t:"So the function can read each file again next month, and correct its own rows.",near:true},{t:"So whoever checks a row can open the invoice it came from, as it was sent.",ok:true},{t:"So Finance can delete each PDF file once its row has passed every check."}],
    why:"What a model reads is checked like any other data, and a person decides what doesn't pass. With the file's path on every row, Rohan's team opens the invoice behind any row in a moment, sees what the supplier really sent, and fixes the row or the check. The file is kept: better readers may read it again. Which rows where you work can't be traced back to the document they came from?"},
  "contracts":{q:"Linh asks when her contract ends. Its two files, the offer and the signed contract, look alike. How does an agent answer?",
    opts:[{t:"It answers from the offer, which HR sent first, so its end date came first."},{t:"It reads both files' terms into a table, and answers from the later end date.",near:true},{t:"It finds the signed version by the metadata beside it, and cites that file.",ok:true}],
    why:"A signed contract is official: it's kept as signed, not rewritten as a table, and its metadata (its ID, version, the day it was signed, and its file) is written beside it as HR makes it. By that metadata the signed version is found at once, and the answer cites its file: the 20th of November. Reading both and guessing which counts is how an answer goes wrong. Which official documents where you work have no metadata beside them?"},
  "written":{q:"Claims for hours used to arrive as spreadsheets by email. What makes the claims app's claims data from the start?",
    opts:[{t:"It writes each claim as a row, with its metadata, and its meaning in a contract.",ok:true},{t:"It saves each claim as a PDF file, and a function reads it into a row each night.",near:true},{t:"It emails each claim to Payroll as a spreadsheet, in one form every tutor uses."}],
    why:"What we write, we can write as data: each claim a row any system can read the moment it's made, with who claimed, on which contract, whether it's approved and when, and what each field means in a data contract, in an open standard. Nobody has to read it back, as the 1853 log meant nobody had to read the next logs. A PDF read by a function is still read back. Which document does your team write that another team types in again?"}
  }}};
