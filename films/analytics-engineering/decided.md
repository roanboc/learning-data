# Decided: In the weeds of data crafting

The series' own decisions. With each film's rows (`<n-film>/decided.md`), they make the *Decided* table in [proposal.md](proposal.md): run `python site-tools/build_series.py` after adding a row. A decision a film's thread makes, even one for the whole series, goes in that film's file, so threads never edit the same lines.

| Date | Decision |
|---|---|
| 29 September 2026 | A series for analytics engineers that continues *From words to data*, one level deeper: how modelling decisions become dbt code. |
| 29 September 2026 | The stack: Databricks, with dbt Cloud. |
| 29 September 2026 | The thread stays the credential, at the same university, with the same sources. |
| 29 September 2026 | A **core** layer between intermediate and marts holds the enterprise contract. |
| 29 September 2026 | Enterprise (core) models are `public`; consumer marts are `protected`. Domains and dbt Mesh get their own film. |
| 29 September 2026 | Known modelling approaches are named once, in the opening film. After that, the series teaches mechanisms (key sets, hashing, grain, timelines) without saying which approach each came from. |
| 29 September 2026 | Ingestion is out of scope: data arrives with every version kept (SCD2) and system keys identified. Ingestion can be its own series. |
| 29 September 2026 | *A model is not a transformation* opens in the past, with a blueprint; alternatives to dbt get generic labels; it ends by showing what the series covers. |
| 29 September 2026 | A new character, Jun, the analytics engineer, builds what Noor, the architect, owns. |
| 30 September 2026 | The series title: *In the weeds of data crafting*. It says the content is technical; the title card and the opening film's narration say it's for analytics engineers. |
| 30 September 2026 | The series gets its own sound: an electric piano, a plucked bass and a brushed pulse, and its own four-note mark. |
| 5 November 2026 | Words never show twice where one chapter meets the next, as the author asked on 5 November 2026 ("Yes, fix that everywhere"). The engine fades each chapter into the next over 0.8 s, and 31 joins in films 1 to 9 showed the same words twice for that time, a little apart or at another size. Each film's `CHAPTER_JOINS` (From words to data's `shared/src/joins.js`) now says how such a chapter comes in: 21 carry the picture on, the camera starting where the chapter before left it (`glide`), and 10 later moments let what was there leave first, over the bare screen (`leave`). `tools/check.py` now runs the governance films' `twice.py` on every chapter join, so CI stops one that shows words twice. |
