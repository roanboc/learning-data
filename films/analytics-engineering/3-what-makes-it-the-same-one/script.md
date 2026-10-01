# In the weeds of data crafting · What makes it the same one: script

*The script of a film of In the weeds of data crafting, a technical series for analytics engineers, as planned: about 4:30, in eight chapters, in English, 30 September 2026. The narration lives in [`source/src/narration.js`](source/src/narration.js) and the pauses in [`source/src/breath.js`](source/src/breath.js); this page and those files say the same thing, and where they differ, the source wins. The times below are estimates from the word count (584 narrated words); the voiced ones replace them after `tools/tts.py` and `tools/pace.py`. It covers the second of Jun's ten steps: learn what the sources really hold. "Identity is a decision, written down" is a working subtitle.*

## The promise

A practitioner follows every line, and a data architect agrees with it. A learner who arrives under three keys is one learner only because someone decided so, and the decision has to be written where the code and the tests can see it. So: profile the sources first, with the query behind every claim; qualify every key by the system it comes from; match keys by written rules, most trusted first; let a person decide what the rules can't, and turn that decision into data and a test; hash the result the same way in every model and on every engine, and keep the readable key beside the hash. Codes get the same care, and the business owns them. **Identity is a decision, written down.**

## The story in one paragraph

In the 1880s, Alphonse Bertillon, a clerk at the Paris police, identified repeat offenders by measuring them and filing the numbers on cards. The story goes that in 1903, at Leavenworth, a new prisoner matched the card of a man already inside, and fingerprints told them apart. Looking alike isn't being the same. At the university, Aisha arrives three times: under her student ID, her learning platform account, and an email typed with a space either side. Jun asks what the sources really hold; the agent profiles them, and every claim comes with its query and its result. Every key is qualified by its key set and written one way in staging. Rules, most trusted first, resolve Aisha's three keys to her student ID, and 90 keys to 46 learners. But another Aisha's platform account holds our Aisha's student ID by mistake: the rules merge them, Aisha's wallet shows six credentials, and every test passes. Mei records a decision, different people; the merge undoes, and a test now holds the decision. Each learner's key is hashed by one macro that trims, upper-cases and marks missing parts, so it gives the same hash everywhere, and the readable key stays beside it. Status codes from three systems map to one meaning, through a status map the registrar's office owns. Every learner now has one key; the next film asks what one row of them holds, and when.

## What each object stands for

| Object | Stands for |
|---|---|
| Brass calipers closing on a sketched profile | Identifying someone by what can be measured about them: attributes |
| A card of measurements filed in a drawer by its numbers | A match on attributes, filed for lookup |
| Two cards with the same numbers, two different fingerprints | Look-alikes: attributes collide; sameness needs something more |
| Three coloured streams (blue, green, pink) | The student system, the learning platform, the short-course platform |
| Aisha's three keys, one per stream; the email's spaces drawn as visible dots | System keys: each means something only inside its own system |
| The agent's teal orb, and evidence cards (claim · query · result) | Profiling, with evidence before assumptions |
| A prefix tag clipping onto each key (`SIS|`, `LMS|`, `SC|`) | The key set: where a key comes from, and who owns it |
| A stack of rule cards, each with a priority number | Identity rules, most trusted first |
| Keys flowing into learner circles: 90 in, 46 out | Identity resolution |
| A second Aisha, drawn in outline; a dashed line merging her into ours | The look-alike, and the wrong merge |
| Green ticks that stay green while a credential slides into the wrong wallet | Tests only check what's written down |
| Mei's gold stamp on a decision row | A person decides what rules can't; the decision becomes data |
| A string rolling into 64 hex characters | A hash |
| A trailing space turning the hash red, then the macro healing it | Normalise before hashing |
| The readable key pinned beside the hash | A hash can't be read or checked by eye |
| Three code chips (`ENR`, `active`, `1`) folding into one: studying | Reference data: a status map |
| A small label beside every code card: `runs on dbt Core · DuckDB` | The code on screen is real and runs in the repository |

## Script

Every code card carries its file name on its tab and the label **`runs on dbt Core · DuckDB`** beside it. Numbers are from `dbt build --profiles-dir . --vars '{as_is_date: 2026-09-30}'` on 30 September 2026 (PASS 143, WARN 1, ERROR 0), and from `dbt show` and DuckDB queries against `target/credentials.duckdb`. Rows on screen show keys, not names.

### 1 · Look-alikes · 0:00–0:34

**Narration.** In the eighteen-eighties, a Paris police clerk, Alphonse Bertillon, identified repeat offenders by measuring them. The head, the arms, a finger: each measured, written on a card, and filed by its numbers. The story goes that in nineteen-oh-three, at Leavenworth prison, a new prisoner matched the card of a man already inside. Fingerprints told them apart. Looking alike isn't being the same. At the university, the question is Aisha.

**Picture.** The warm past, "1880s · Paris" in the corner. Brass calipers close on a sketched profile, once per measurement (head length, arm span, left middle finger), and each number writes itself onto a card. The card slides into a drawer of cards, sorted by its numbers. Cut: "1903 · Leavenworth", with a small tag "as the story is told". Two cards side by side, the same numbers on both, two different names. Below them, two fingerprints draw themselves, loop by loop: different. The two cards fade to one outline, and the outline becomes Aisha's, drawn in the films' dark glass. Wordless breather: the title card over the two cards and their fingerprints: "IN THE WEEDS OF DATA CRAFTING", *What makes it the same one*, "identity is a decision, written down".

**On screen.** 1880s · Paris · Bertillon · head · arm span · left middle finger · one card, filed by its numbers · 1903 · Leavenworth · as the story is told · the same numbers · different fingerprints · looking alike ≠ being the same · IN THE WEEDS OF DATA CRAFTING · *What makes it the same one* · identity is a decision, written down

### 2 · Three keys · 0:34–1:01

**Narration.** Aisha is studying for a graduate certificate in data analytics. The student system knows her by her student ID. The learning platform, by her account. The short-course platform, by the email she typed, with a space either side, in mixed case. Three keys. Each one means something only inside its own system. None of them says which learner she is.

**Picture.** Three streams pour in from the left, each in its colour: blue (student system), green (learning platform), pink (short-course platform). A key lifts out of each as it's named, with a knock: `S-20417`, `u-88213`, and `·Aisha.K@Mail.example·`, its leading and trailing spaces drawn as visible dots. Each key sits inside a faint outline of its own system. Aisha's outline in the centre, with a question mark between her and the three keys.

**On screen.** Graduate Certificate in Data Analytics · student system `S-20417` · learning platform `u-88213` · short-course platform `·Aisha.K@Mail.example·` · three keys · each means something only in its own system · which learner?

### 3 · Profile first · 1:01–1:33

**Narration.** Before matching anything, Jun learns what the sources really hold. The agent profiles them, and every claim comes with the query that shows it. Four of forty-two platform accounts have no student ID. Two students share one family email, and so do their two platform accounts. Two short-course enrolments point at no customer, as typed. Trimmed and in lower case, none do. A claim without its query is a guess.

**Picture.** Jun, cyan, beside the teal agent orb. The orb opens a query card, `analyses/profile_null_keys.sql`, lines 1-7:

```sql
-- Evidence: keys that are missing or blank, in the current version of each source table.
-- Run: dbt show --select profile_null_keys --profiles-dir .
select 'learning_platform.users' as source_table, 'student_id' as key_column,
    count(*) as current_rows,
    count(case when nullif(trim(student_id), '') is null then 1 end) as missing
from {{ source('learning_platform', 'users') }}
where _is_current = 'true'
```

Its result row slides out beneath: `learning_platform.users | student_id | 42 | 4`. The three together form an evidence card: claim, query, result. Two more evidence cards stack beside it as they're named: `analyses/profile_shared_emails.sql` → `student_system | nguyen.family@… | 2` and `learning_platform | nguyen.family@… | 2`; `analyses/profile_orphans.sql` → `short_courses.enrolments -> learners | 2 | 0`. A fourth card arrives with no query attached: it greys out and a small tag says "guess".

**On screen.** profile first · claim · query · result · 4 of 42 accounts: no student ID · one email, two students · one email, two accounts · 2 orphans as typed · 0 once trimmed and lower-cased · a claim without its query is a guess

### 4 · Key sets · 1:33–2:02

**Narration.** So first, every key says where it comes from. A key set: the student system, the learning platform or short courses, each with a short code, and an owner. Two systems can use the same-looking key for two different people. Qualified, they can't be confused. And staging writes every key one way: trimmed, and in one case. Aisha's email loses its spaces and its capitals.

**Picture.** A small table card, `seeds/key_sets.csv`, lines 1-4:

```csv
key_set,system_name,owner
SIS,student system,Registrar's office
LMS,learning platform,Learning team
SC,short-course platform,Learning team
```

A tag beside it: "decided 5 Oct 2026 · Noor". A prefix clips onto each of Aisha's keys: `SIS|S-20417`, `LMS|u-88213`, `SC|…`. Then the macro's comment, `macros/keys.sql`, lines 4-7:

```
    business_key('SIS', 'student_id')                  ->  'SIS|S-20417'
    business_key('SIS', ['student_id', 'award_code'])  ->  'SIS|S-20417|GCDA'
    hash_key(['learner_bk'])                            ->  sha-256 of 'SIS|S-20417', 64 hex characters
    hash_key(['learner_bk', 'award_bk'])                ->  the key of a relationship between two keys
```

and the line in staging that writes the email one way, `models/staging/short_courses/stg_short_courses__learners.sql`, line 12 and lines 26-28:

```sql
        nullif(lower(trim(customer_email)), '') as email,
…
    select
        {{ business_key('SC', 'email') }} as customer_bk,
        *
```

The visible dots fall off Aisha's email and its capitals drop: `SC|aisha.k@mail.example`.

**On screen.** key set · `SIS` student system · Registrar's office · `LMS` learning platform · `SC` short-course platform · Learning team · same-looking key, different people · qualified · trimmed · one case · `SC|aisha.k@mail.example`

### 5 · Rules, most trusted first · 2:02–2:47

**Narration.** Then: which keys are the same learner? Jun writes it as rules, most trusted first, one block of the query for each. A student ID is a learner. A platform account is the student whose ID it holds. An email names a student, but only if exactly one student has it. Anything left is a learner of its own. Each key takes the most trusted rule that fits. Aisha's three keys resolve to her student ID. Across the university, ninety keys become forty-six learners. The rules are written in words in the model, and in code in one query. Mei, who owns what a learner means, approved them.

**Picture.** A code card, `models/intermediate/int_learner_key_candidates.sql`, lines 34-44 and a trimmed line, as rule cards stack, each with its priority in a circle:

```sql
-- a student ID is a learner
by_student_id as (

    select
        qualified_key,
        qualified_key as learner_bk,
        2 as priority,
        'student ID' as match_rule
    from learner_keys
    where key_set = 'SIS'
…
```

A second card, lines 47-57, trimmed: `-- a platform account is the student whose ID it holds` … `student_bk_held as learner_bk,` / `3 as priority,`. A third, lines 61-71, trimmed: `-- an email identifies a student only if exactly one student has it` … `group by email` / `having count(*) = 1`. A last card, `by_own_key`, priority 9. Aisha's three keys run down the stack; each stops at the first card that fits and takes its learner, shown as a query result from `int_learner_keys_matched`:

| qualified_key | match_rule | learner_bk |
|---|---|---|
| `SIS|S-20417` | student ID | `SIS|S-20417` |
| `LMS|u-88213` | student ID held by the learning platform | `SIS|S-20417` |
| `SC|aisha.k@mail.example` | same email as one student | `SIS|S-20417` |

Pull back: 90 key dots (40 blue, 42 green, 8 pink) flow into 46 learner circles; a counter reads "90 keys → 46 learners". Beside it, the rules in words, `model/conceptual.yml`, lines 43-48:

```yaml
    identity:
      - A student ID is a learner.
      - A learning platform account is the learner whose student ID it holds.
      - An account or a short-course customer with no student ID is the learner whose email it shares, if exactly one student has that email.
      - A short-course customer can also be the learner of a platform account with the same email, if exactly one has it.
      - Anything left is a learner of its own.
```

Mei, in her business outline, and a gold tick: "approved 6 Oct 2026".

**On screen.** rules, most trusted first · 1 a recorded decision · 2 student ID · 3 student ID held by the platform · 4 same email as exactly one student · 9 own key · the most trusted rule that fits · 90 keys → 46 learners · in words: the model · in code: one query · approved · Mei Tanaka, registrar's office

### 6 · Keep them apart · 2:47–3:25

**Narration.** But another Aisha has a platform account, and its student ID field holds our Aisha's number, typed by mistake. The rules merge them. Aisha's wallet now shows six credentials, one she never earned. And every test still passes. No test knew they were two people, because nobody had written it down. Mei checks, and records a decision: different people. A person's decision beats every rule. The merge undoes, and Aisha holds five. A test now holds the decision, so no rule can merge them again.

**Picture.** A second Aisha, drawn in outline, green: her account `LMS|u-88231`, holding `SIS|S-20417`. Rule card 3 lights; a dashed line pulls her account into our Aisha's circle. Aisha's wallet card counts up: 5 → 6 credentials, a microcredential sliding in with a faint amber edge. On the right, the test list stays green, tick after tick: "PASS 143 · WARN 1 · ERROR 0". A low held note. Mei arrives and a decision row writes itself, `seeds/learner_identity_decisions.csv`, lines 1 and 4, trimmed:

```csv
decision_id,qualified_key,decision,other_qualified_key,decided_by,decided_on,…
D-003,LMS|u-88231,different,SIS|S-20417,"Mei Tanaka, registrar's office",2026-10-07,…
```

Her gold stamp lands on it. In the code, the anti-join lights, `int_learner_key_candidates.sql`, lines 115-134, trimmed:

```sql
kept_apart as (
    select
        qualified_key,
        other_qualified_key as learner_bk
    from decisions
    where decision = 'different'
)
…
from candidates
left join kept_apart
    on kept_apart.qualified_key = candidates.qualified_key
    and kept_apart.learner_bk = candidates.learner_bk
where kept_apart.qualified_key is null
```

The dashed line breaks; the microcredential slides back; the wallet reads 5. A last card, the test, `tests/keys_decided_different_stay_apart.sql`, lines 1-2:

```sql
-- When a person decides two keys are different people, they never end up as one learner.
-- Fails with one row per decision that the matching broke.
```

**On screen.** another Aisha · her account holds our Aisha's student ID · typed by mistake · merged · 6 credentials · one she never earned · every test passes · no test knew · D-003 · different · Mei Tanaka · 7 Oct 2026 · a decision beats every rule · 5 credentials · a decision became a test

### 7 · The same hash everywhere · 3:25–4:00

**Narration.** Now every learner has one business key, and Jun hashes it. Sixty-four characters. Add one trailing space, and the hash is completely different. So one macro builds every hash. It trims each part, writes it in upper case, marks a missing part, and joins the parts with a bar. The same key gives the same hash, in every model, and on every engine. And the readable key stays beside the hash. A hash can't be read, or checked by eye.

**Picture.** `SIS|S-20417` rolls into `0905e6e2…f76a2`, 64 characters, a short muffled run of keys. A dot appears after the key, `SIS|S-20417·`: the hash rolls again and turns red, `78e86f04…b2ef`. The macro's comment, `macros/keys.sql`, lines 66-70:

```
    The string that gets hashed. Each part is trimmed and upper-cased, so keys that differ only
    by case or spaces hash the same; a blank part counts as missing. A missing part becomes the
    sentinel '<null>', so ('a', null) and (null, 'a') differ; the sentinel is lower case, so no
    upper-cased part can equal it. Parts are joined with '|'. When every part is missing, the
    string is null, and so is the hash: no key, no hash.
```

`sis|s-20417·` goes through it: trimmed, upper-cased, and the hash heals to `0905e6e2…f76a2`, green. Then lines 52-58 of the same file, the two engines side by side:

```sql
{% macro duckdb__hash_key(columns) -%}
    sha256({{ credentials.key_string(columns) }})
{%- endmacro %}

{% macro databricks__hash_key(columns) -%}
    sha2({{ credentials.key_string(columns) }}, 256)
{%- endmacro %}
```

Both give `0905e6e2…`. Finally a row: `learner_bk SIS|S-20417` pinned beside `learner_key 0905e6e2…`.

**On screen.** 64 hex characters · one trailing space · a different hash · trim · upper case · `<null>` for a missing part · joined with `|` · one macro · the same hash, every model, every engine · DuckDB `sha256` · Databricks `sha2(…, 256)` · the readable key stays beside the hash

### 8 · Codes, too · 4:00–4:26

**Narration.** Codes need the same care. Three systems, three codes, one meaning: studying. A status map says so, one row per code. The registrar's office owns it, and approves every change. Now every learner has one key. But one key can still mean many rows, and many versions.

**Picture.** Three code chips in their colours, `ENR`, `active`, `1`, fold into one word, "studying". The map, `seeds/status_map.csv`, lines 1-9:

```csv
key_set,source_code,source_label,canonical_status
SIS,ENR,Enrolled,studying
SIS,LOA,Leave of absence,inactive
SIS,WD,Withdrawn,withdrawn
SIS,CMP,Completed,completed
LMS,active,Active account,studying
LMS,inactive,Inactive account,inactive
SC,1,Active customer,studying
SC,0,Inactive customer,inactive
```

A tag from `seeds/_seeds.yml`, line 10: `meta: {owner: "Mei Tanaka, registrar's office", domain: registrar}`, with a gold tick. Then Aisha's single key; behind it, rows begin to stack, one behind another, and a clock face appears faintly: the next film's question. Wordless end card: "Looking alike isn't being the same. Write down what is." *What makes it the same one* · In the weeds of data crafting.

**On screen.** `ENR` · `active` · `1` → studying · status map · one row per code · owner: registrar's office · one key · many rows? · many versions? · Looking alike isn't being the same. Write down what is.

## Pause and think

Four stops, one question each.

| After | Question | Answer, in short |
|---|---|---|
| 3 · `profile` | Why keep the query beside each claim? | So anyone can run it again and see the same result. A claim without its query is a guess, and a reviewer treats it as one (AGENTS.md, "Evidence"). |
| 4 · `sets` | `S-20417` on the platform and `S-20417` in the student system: always the same learner? | Only if the platform's field really holds the student ID and was typed right. Qualify each key by its key set first, then decide by a rule, or by a person. |
| 6 · `apart` | Every test passed. How did the wrong merge get through? | No test knew the two were different people until a person wrote it down. The decision became data, and then a test. |
| 7 · `hash` | Why keep the readable key beside the hash? | A hash can't be read or checked by eye; with the key beside it, any row can be traced back to its source, and a hash can be recomputed. |

## Rigour sheet

Technical claims checked on 30 September 2026 against a run of the project (dbt Core 1.12.5, dbt-duckdb 1.11.0; `dbt build --profiles-dir . --vars '{as_is_date: 2026-09-30}'`: 146 nodes, PASS 143, WARN 1, ERROR 0). The dbt and Databricks documentation pages are cited by address; docs.getdbt.com and docs.databricks.com could not be fetched from the build environment that day, so the Databricks `sha2` page was checked through its search summary and the dbt pages are to recheck before release.

| Chapter | What the film says | What an expert would add, or what it simplifies |
|---|---|---|
| 1 | In the 1880s, Alphonse Bertillon, a Paris police clerk, identified repeat offenders by measuring them. | Bertillon worked at the Paris Prefecture of Police; his anthropometric system (*bertillonage*) was trialled from 1882 and credited with its first identification in February 1883. It used a fixed set of body measurements (eleven is often cited; sources vary), a description and, later, standard photographs; cards were filed by measurement ranges, not alphabetically, because offenders gave false names. The film names three measurements. |
| 1 | The story goes that in 1903, at Leavenworth, a new prisoner matched the card of a man already inside; fingerprints told them apart. | Told in many textbooks (the Will West and William West case, 1 May 1903). It was first published in 1918 (Wilder and Wentworth, *Personal Identification*), fifteen years later; Leavenworth adopted fingerprints only in 1904; research (Olsen 1987; Cole 2001) finds the records don't support the dramatic meeting as told, and the two men may have been related. Hence "the story goes" in the narration and "as the story is told" on screen. |
| 2 | Aisha has three keys: student ID, platform account, an email with a space either side, in mixed case. | `data/student_system/learners.csv` (S-20417), `data/learning_platform/users.csv` line 14 (u-88213), `data/short_courses/learners.csv` line 2 (` Aisha.K@Mail.example `). The university, its people and the data are fictional. |
| 2 | Each key means something only inside its own system. | A student ID is a business key issued by the registrar's office (`model/conceptual.yml` 36-42); inside one system it's also that system's key. The film's point is that none is yet a key for the learner across systems. |
| 3 | Four of forty-two platform accounts have no student ID. | `dbt show --select profile_null_keys --profiles-dir .` → `learning_platform.users | student_id | 42 | 4`; the same claim is AGENTS.md's example of evidence (lines 53-54). |
| 3 | Two students share one family email, and so do their two platform accounts. | `profile_shared_emails` → `student_system | nguyen.family@mail.example | 2`, `learning_platform | nguyen.family@mail.example | 2` (Linh and Minh Nguyen, `S-20435` and `S-20436`). Decision D-001 (6 Oct 2026) says the short-course customer with that email is Linh. |
| 3 | Two short-course enrolments point at no customer as typed; none once trimmed and lower-cased. | `profile_orphans` → `short_courses.enrolments -> learners | 2 | 0`; platform student IDs → student system: 0 and 0. |
| 3 | The agent profiles; every claim comes with its query. | AGENTS.md, "Evidence" (lines 48-56). `dbt show` runs a model or analysis and prints a preview (docs.getdbt.com/reference/commands/show); analyses are compiled but not built (docs.getdbt.com/docs/build/analyses). An agent's access to dbt (the dbt MCP server, dbt Cloud's assistant) is the subject of a later film and named only there. |
| 4 | Every key is qualified by a key set, with a code and an owner. | `seeds/key_sets.csv` 1-4, generated from `model/conceptual.yml` 18-27 by `scripts/definitions.py`; decided 5 Oct 2026 by Noor (`docs/decisions.md` line 12). `business_key()` in `macros/keys.sql` 36-44 returns null when any part is blank. |
| 4 | Staging writes every key one way: trimmed, in one case. | `docs/conventions.md` line 63: IDs and codes upper case, platform user IDs and emails lower case. Treating emails as case-insensitive is a choice: RFC 5321 allows the local part to be case-sensitive, though providers rarely treat it so; the project records it as a convention. |
| 5 | Rules, most trusted first; each key takes the most trusted rule that fits. | `int_learner_key_candidates.sql` (one CTE per rule, priorities 1, 2, 3, 4, 9) and `int_learner_keys_matched.sql` (`qualify row_number() over (partition by qualified_key order by priority) = 1`, and a fifth rule, priority 5, that builds on the others: a short-course customer with the email of exactly one platform learner). The narration lists four rules; the card shows all; the decision rule (priority 1) is introduced in chapter 6. Learners with no student ID keep the key of the first system that recorded them (`first_known_keys`). |
| 5 | Aisha's three keys resolve to her student ID; ninety keys become forty-six learners. | Query of `int_learner_keys_matched`: the three rows as shown, all with `learner_key` `0905e6e2b60bd76bfa5c6d3ed43ac6a4d55cf046c2c0cbce4c590300145f76a2`. 90 keys (SIS 40, LMS 42, SC 8) → 46 distinct `learner_key`. By rule: student ID 40, student ID held by the platform 37, own key 6, same email as one student 4, recorded decision 2, same email as one platform user 1. |
| 5 | Mei approved the rules. | `docs/decisions.md` line 14 (6 Oct 2026, Mei Tanaka); the rules in words are `model/conceptual.yml` 43-50, owned by Mei (line 35). |
| 6 | Another Aisha's account holds our Aisha's student ID, typed by mistake; without a decision the rules merge them, Aisha's wallet shows six credentials, and every test passes. | Run on a scratch copy of the project with row D-003 removed from `seeds/learner_identity_decisions.csv`: `LMS|u-88231` matched by "student ID held by the learning platform" to `SIS|S-20417`; `mart_wallet__learners` for Aisha: 6 credentials (1 award, 4 microcredentials, 1 badge) against 5 (1, 3, 1) with it; the build was PASS 143, WARN 1, ERROR 0 both times. The other Aisha's short-course key stays apart in both runs, held by D-004. The experiment isn't committed (see the plan's flags); to repeat it, delete line 4 of the seed and build. |
| 6 | A person's decision beats every rule. | `int_learner_key_candidates.sql` 21-32 (a "same" decision is priority 1) and 115-134 (a "different" decision removes any candidate it names, whatever the rule); `int_learner_keys_matched.sql` 148-169 applies it to the fifth rule too. The unit test `each_rule_proposes_and_decisions_keep_look_alikes_apart` (`_int_models.yml` 241-264) checks both (docs.getdbt.com/docs/build/unit-tests). |
| 6 | A test now holds the decision. | `tests/keys_decided_different_stay_apart.sql`, a singular data test (docs.getdbt.com/docs/build/data-tests): it returns a row for any "different" decision whose two keys share a `learner_key`. The seed is reference data owned by the registrar's office (`seeds/_seeds.yml` 34-47; docs.getdbt.com/docs/build/seeds). |
| 7 | Sixty-four characters; one trailing space gives a completely different hash. | DuckDB, 30 Sept 2026: `sha256('SIS|S-20417')` = `0905e6e2…f76a2`; `sha256('SIS|S-20417 ')` = `78e86f0409de0bfa214c7b25a2346d10c541a178bcd7fc875a006de515c1b2ef`; `sha256(upper(trim('sis|s-20417 ')))` = `0905e6e2…` again. SHA-256 gives 256 bits, 64 hex characters (FIPS 180-4). |
| 7 | One macro trims, upper-cases, marks a missing part, and joins with a bar. | `macros/keys.sql` 65-83 (`key_string`): a blank part counts as missing; a missing part becomes the lower-case sentinel `'<null>'`; all parts missing gives a null hash. Upper-casing is safe here because every key in these sources is case-insensitive (`docs/conventions.md` 65); a case-sensitive key would need its own rule. |
| 7 | The same hash on every engine. | `macros/keys.sql` 48-62: `adapter.dispatch` picks `duckdb__hash_key` (`sha256`) or `databricks__hash_key` (`sha2(…, 256)`) by target (docs.getdbt.com/reference/dbt-jinja-functions/dispatch). Databricks' `sha2(expr, bitLength)` returns the SHA-2 checksum as a hex string; bit length 256 (or 0) gives SHA-256 (docs.databricks.com/aws/en/sql/language-manual/functions/sha2, checked through its search summary). DuckDB's `sha256` returns lower-case hex (duckdb.org/docs/stable/sql/functions/text). Both hash the UTF-8 bytes of the same string, so the values match. |
| 7 | Keep the readable key beside the hash. | `docs/decisions.md` line 12; `docs/conventions.md` 67. A hash is one-way, and sha-256 of a guessable key such as a student ID can be reversed by trying every ID: a hash of personal data is pseudonymous, not anonymous (the project tags it `personal_data: pseudonymous`, `docs/conventions.md` 90). Hash collisions for SHA-256 are negligible at this scale. |
| 8 | Three systems, three codes, one meaning: studying; the registrar's office owns the map. | `seeds/status_map.csv` 1-9; `seeds/_seeds.yml` 3-10 (owner Mei Tanaka, registrar's office; "changes come through a pull request they approve"). Used in `int_learner_timeline.sql` 191-195. No `LOA` (leave of absence) appears in the data today (`profile_value_sets`: `ENR` 29, `CMP` 8, `WD` 3, `active` 41, `inactive` 1, `1` 7, `0` 1). |

## Project files each snippet comes from

All under `films/analytics-engineering/project/`, lines as the files stand on 30 September 2026.

| Chapter | File | Lines |
|---|---|---|
| 3 | `analyses/profile_null_keys.sql` | 1-7 |
| 3 | `analyses/profile_shared_emails.sql`, `analyses/profile_orphans.sql` | results only, from `dbt show` |
| 4 | `seeds/key_sets.csv` | 1-4 |
| 4 | `macros/keys.sql` | 4-7 |
| 4 | `models/staging/short_courses/stg_short_courses__learners.sql` | 12, 26-28 |
| 5 | `models/intermediate/int_learner_key_candidates.sql` | 34-44, 47-57, 61-71 (trimmed with `…`), 88-98 (`by_own_key`, name and priority only) |
| 5 | `model/conceptual.yml` | 43-48 |
| 5 | query of `int_learner_keys_matched` | — |
| 6 | `seeds/learner_identity_decisions.csv` | 1, 4 (columns trimmed) |
| 6 | `models/intermediate/int_learner_key_candidates.sql` | 115-134 (trimmed) |
| 6 | `tests/keys_decided_different_stay_apart.sql` | 1-2 |
| 7 | `macros/keys.sql` | 66-70, 52-58 |
| 8 | `seeds/status_map.csv` | 1-9 |
| 8 | `seeds/_seeds.yml` | 10 |

## Sources

- Simon A. Cole, *Suspect Identities: A History of Fingerprinting and Criminal Identification*, Harvard University Press, 2001: Bertillon's system, its adoption in Paris, and the West case as told and as recorded.
- Robert D. Olsen Sr., "A fingerprint fable: the Will and William West case", *Identification News*, 1987 (also reprinted in the *Journal of Forensic Identification*). To confirm the issue.
- Harris Hawthorne Wilder and Bert Wentworth, *Personal Identification*, 1918: the first published account of the West case.
- Leavenworth penitentiary inmate files, US National Archives at Kansas City. To check.
- dbt documentation: `dbt show`, analyses, seeds, singular data tests, unit tests, `adapter.dispatch`. To recheck on the day of release.
- Databricks SQL reference: `sha2`. DuckDB documentation: text functions, `sha256`. NIST FIPS 180-4, *Secure Hash Standard*.

## Labs

Four labs, each words plus one picture drawn with the film's own components.

| Lab | Kind | What people do | The mechanism they can break |
|---|---|---|---|
| *Same learner?* | pick | Pairs of records: the same email in two cases; a platform account holding a student ID; the Nguyens' shared family email; the look-alike account with the wrong student ID. For each: match, don't match, or ask a person. Each answer shows the rule that decides, or the decision that was needed. | Matching on an attribute that isn't unique (the shared email), or trusting a typed field (the wrong student ID) without a person's decision. |
| *Break the hash* | step through | Type a key; add a space, change the case, blank one part of a two-part key. Watch the raw sha-256 change and the macro's stay the same; a blank part becomes `<null>`, and swapping which part is blank changes the hash. | Hashing before normalising; joining parts without a delimiter or a sentinel, so `('a', null)` and `(null, 'a')` collide. |
| *Rules in order* | sort | Put five identity rules in priority order (recorded decision, student ID, student ID held by the platform, email of exactly one student, own key), then run Aisha's three keys and the look-alike's account through them and see where each lands. | Putting a looser rule above a stricter one, so an email match overrides a student ID; forgetting that a "different" decision removes a match. |
| *Claim and evidence* | compose | Pair each of four profiling claims with the query and the result that prove it (null student IDs, shared emails, orphans, status codes); one claim has no query, and must be marked a guess. | Accepting a claim with no query behind it, or a query whose result doesn't say what the claim says. |

## Scenarios

Eight situations, varied in form, in this order.

1. **A ticket.** "Two platform accounts hold the same student ID." Which rule matches them, and what do you ask before accepting it? *(Both land on the student under rule 3; ask whether it's one person with two accounts, or a typo, as with the other Aisha; a person decides.)*
2. **A profiling result.** An email matches one student in the student system and two accounts on the platform. What can the email rule conclude? *(The student-email rule still names the one student, for the short-course key and for both accounts, unless a more trusted rule, such as a student ID the account holds, says otherwise. Two accounts sharing an email is worth a question: one person twice, or a family, like the Nguyens?)*
3. **An agent's message.** "Emails are unique across the student system." No query attached. What do you reply? *(Ask for the query and the result; `profile_shared_emails` says otherwise.)*
4. **A morning after.** Every learner's hash changed overnight; a vendor now sends emails in upper case. What went wrong, and where is it fixed? *(If staging lower-cases and the macro upper-cases, nothing changes; if hashes moved, something hashed before normalising.)*
5. **A pull request.** "Drop `learner_bk` from core: the hash is enough, and it saves space." Approve? *(No: the readable key is how anyone reads, checks or traces a row, and it's a decision on record.)*
6. **A complaint from the wallet.** Every test passes, and a learner holds a microcredential she never earned. Where do you look first? *(At the keys matched to her learner, their rules, and whether a "different" decision is missing.)*
7. **A change in a source.** The learning platform issues a new user ID when an account is reopened. What happens to the learner, and what should? *(The new key matches by the student ID it holds, if it holds one; if not, it becomes a learner of its own until a rule or a person joins them.)*
8. **A request.** Short courses want to send `INACTIVE` instead of `0` from next term. Who approves, and what changes? *(The registrar's office approves a new row in the status map, by pull request; no SQL changes.)*
