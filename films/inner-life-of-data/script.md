# The Inner Life of Data

**Video script v4, university edition** · Matches the second cut of the film

Runtime 6:17, with 922 words of narration read by a synthetic voice (Kokoro, American female, open source under Apache 2.0). The master is 16:9, 1080p, 30 fps, with narration, music and sound effects mixed to about -16 LUFS for the web, and burned-in captions. Every name, place and number is fictional, and no real institution is shown.

New in v4: the tap is stored first in the system of record; events go through an integration platform; the sketch (conceptual model) gets its own scene, including what goes wrong without it; dbt is visible at every layer, with tests everywhere, and runs on Databricks; gold paintings are data products defined as dbt marts with contracts, shown through dbt exposures; a new overview shows all layers together, including consumption through Databricks Apps, Genie, and dashboards and SQL; and every component carries its platform logo. The look is one modern design language throughout.

## Visual language

| On screen | Stands for |
|---|---|
| Light, and a data tile | A record or a small batch of records |
| Each source system's colour | Application domains (source-aligned data) |
| A tile written into a system card | A write to the system of record |
| Glass vaults (bronze, silver, gold) | Delta tables in each layer |
| The sketch | The conceptual model: entities and relationships |
| Housings on the refining line | dbt layers: sources, staging, intermediate |
| Check marks and test tags | dbt tests at every layer |
| Business-domain LED colours | Business domains (gold, consumer-aligned data) |
| Paintings and their plaques | Data products (dbt marts with contracts) and dbt exposures |
| Catalog panel with the dbt logo | dbt Catalog: definitions, sources, lineage, data products |
| Unity Catalog panel | Certification, access control and masking |
| Star map with the sketch | Genie Ontology |
| Bell, reading room, copies, projector | Events, SQL endpoints, integration copies, zero-copy sharing |

## Script

### Scene 0 · The tap · 0:00–0:23

**Narration.** You just enrolled in your first university class. One tap. It feels like nothing happened. But that tap was written straight into the student system, the system of record: a snapshot of that moment. Now it's about to travel through a platform most people never see. Let's follow it.

**Picture.** Title card. A phone shows the enrol button; a tap ripples, and a small data tile is written into the Student system, the system of record. We zoom in on the tile: rough, glitched, stamped 9:02 am. It turns into light and races off along a lane.

**On screen.** written first, in the system of record

### Scene 1 · Into the platform · 0:23–1:04

**Narration.** Every system at the university keeps its own records: students, learning, people and finance. Think of each one as its own colour of light. Some changes travel as events, the moment they happen. An integration platform routes them, retries them and keeps them secure, and Zerobus Ingest lands them in the lakehouse within seconds. Other data arrives in bulk, as files, like the nightly file of new offers. Auto Loader reads each new file exactly once, and remembers where it stopped. Everything lands in bronze, exactly as it arrived. Only what matters right now travels hot. The rest can wait for the next delivery.

**Picture.** Four source systems appear, each with its own light colour: Student system, Learning platform, HR and payroll, Finance system. Events flow through the integration platform and Zerobus Ingest into the bronze vault. Nightly files drop into a landing zone; Auto Loader reads each one once while its checkpoint counts up. A magnifier shows a raw tile. Hot and warm lanes are labelled.

**On screen.** Integration platform · Zerobus Ingest · Landing zone · Auto Loader · Bronze · hot · seconds · warm or cold · minutes to days

### Scene 2 · The sketch · 1:04–1:29

**Narration.** Before any of this can make sense, we need a sketch of the world we're trying to understand. What is a student? A class? An enrolment? And how do they connect? That's the conceptual model: agreed with the business, and written down once. Get the sketch wrong, and the pieces never fit. Every picture built on top of it is wrong too, no matter how clean the data is. Get it right, and every piece has its place.

**Picture.** Raw tiles float over an empty canvas with nowhere to go. The conceptual model draws itself: Student, Class, Enrolment, then Term (census date) and Course, with their relationships. Split screen: with the wrong sketch the pieces never fit and the downstream number reads 312%; with the right sketch every piece snaps into place and the number reads 98%.

**On screen.** Conceptual model · Wrong sketch · Right sketch · Class fill: 312% · Class fill: 98%

### Scene 3 · Refining with dbt · 1:29–2:19

**Narration.** Now the refining starts. dbt holds the recipes: models, tests and documentation, all in version control. Databricks runs them, on a SQL warehouse. Look closer at bronze, and the pieces are rough: glitches, duplicates, errors, different formats, different clocks. First, dbt declares each source, and checks that it's fresh. Staging models clean each source: clear names, one format, one clock, no duplicates. Tests run at every step. A missing value stops here. Intermediate models join the sources, exactly as the sketch says. An enrolment with no matching class stops here. What comes out is silver: one clean, consistent picture of the university. And every step is recorded, so any piece can be traced back to the tap that started it.

**Picture.** The dbt panel (models, tests, docs and lineage in version control) sits above the refining line; a Databricks SQL warehouse runs underneath. A freeze-frame zoom labels glitches, a duplicate, an error and different clocks. Three dbt layers light up in turn: sources (freshness checked), staging models (one format, one clock, no duplicates) and intermediate models (joined as the sketch says), each with its own tests. A missing value stops at staging; an enrolment with no matching class stops at intermediate. The clean pieces assemble the silver picture on top of the sketch, and a gold lineage thread runs back to bronze.

**On screen.** dbt · SQL warehouse · sources · staging models · intermediate models · tests · not_null · relationships · Silver · lineage

### Scene 4 · Gold · 2:19–3:02

**Narration.** Then the light is split again, this time into business domains: teaching, students, research and finance. Each domain holds many data products. Think of them as paintings. The subject is the domain. The style is what the audience needs. Analysts get every detail. Executives get the essence, in a few bold shapes. Government reports get a painting made by strict rules, like counting students on census date. Live operations get a quick impression of right now. In dbt, each painting is a mart with a contract and an owner: a data product. And its label is an exposure, recording where the painting is shown, and to whom. That's gold.

**Picture.** The silver picture passes through a prism into four business-domain colours: Teaching, Students, Research, Finance. Each domain wing shows six different, named data products (for example Admissions funnel, Census count, Retention), a sample of the dozens it holds. The camera visits one painting per audience: Finance in realism for analysts, Research in bold shapes for executives, Students by strict rules (a census-date count) for government reports, Teaching as a live impression for operations. A plaque shows the data product, its dbt mart with an enforced contract, its dbt exposure and its owner.

**On screen.** for analysts · for executives · for government reports · for live operations · DATA PRODUCT · DBT MART · DBT EXPOSURE · OWNER

### Scene 5 · The layers together · 3:02–3:30

**Narration.** Step back, and the whole system comes into view. Application domains flow in on one side. Bronze keeps what arrived. Silver makes it consistent. Gold makes it useful. Business domains flow out on the other, into dashboards, apps and Genie. dbt governs every step, from source to exposure, and its lineage maps every connection. And the Databricks lakehouse runs and stores it all, governed by Unity Catalog.

**Picture.** The whole system in one view: application domains flow into bronze, silver and gold on the Databricks Lakehouse (Delta Lake storage, SQL warehouses, Unity Catalog), and business domains flow out. Above, the dbt lineage graph lights up from sources through staging, intermediate and marts to exposures, with dashed links showing that dbt compiles the SQL and Databricks runs it. On the right, consumption: Databricks Apps, Genie, and dashboards and SQL.

**On screen.** dbt · sources · staging · intermediate · marts · exposures · Bronze keeps what arrived · Silver makes it consistent · Gold makes it useful · Databricks Lakehouse · Consumption: Databricks Apps, Genie, Dashboards and SQL

### Scene 6 · Meaning · 3:30–4:18

**Narration.** But pictures without meaning are just noise. The platform is the bricks. Meaning is the shared language. In the dbt Catalog, anyone can read what each picture shows, where it came from, and who owns it. Words are defined once: an enrolled student is one still enrolled on census date. Unity Catalog marks trusted data as certified, decides who can see what, and masks personal details. And a university's knowledge lives everywhere: intranet pages, policy libraries, the handbook, process maps. Through MCP, a standard plug that lets AI connect to other systems, the platform reads those sources where they live, with your permissions. Together with the sketch, they become one map of meaning: Genie Ontology.

**Picture.** A wall of data products flickers with static until shared words appear. The dbt Catalog shows what a data product shows, where it came from and who owns it, then the definition of an enrolled student. Unity Catalog marks a table as certified, shows who can see what, and masks a student's name. The camera rises to four knowledge sources (Intranet, Policy library, Handbook, Process maps); MCP connectors send snippets into the sketch, a gold thread rises from the catalogue, and together they form Genie Ontology.

**On screen.** Catalog in dbt · Unity Catalog · certified · MCP · Genie Ontology

### Scene 7 · Two speeds · 4:18–4:42

**Narration.** Some questions need one answer, right now: is there still a seat in Tuesday's 9 am class? Others need every record, over years: which classes fill up first? Different jobs, different engines. Lakebase, a Postgres database built into the platform, gives apps a fast desk copy of what they need, kept in sync automatically, with changes flowing back.

**Picture.** Split screen. Left: the phone asks for a seat and Lakebase answers from a fast desk copy in 8 ms. Right: a reading room scans years of records into a heat map of classes by week. A gold vault syncs into Lakebase, and changes flow back.

**On screen.** One answer, right now · Every record, over years · Lakebase · Lakehouse · synced automatically · changes flow back

### Scene 8 · Ways out · 4:42–5:34

**Narration.** Now the pictures go out, four ways. Events: when something changes, the integration platform rings a bell, and each system comes back for exactly what it needs. SQL endpoints: a reading room where tools can scan millions of records for big questions. Copies: for older systems that can't read the originals, the integration platform delivers copies. Useful, but every copy has to be kept up to date. [one-second pause] And the fourth way changes everything. A projector shows the original somewhere else, without making a copy. OpenSharing projects live research data to a partner university. Mirroring lets Microsoft Fabric see the same pictures in place. Federation turns the projector around, so we can see other systems where they live. One original. No copies to keep in sync.

**Picture.** The gold vault feeds four ways out. The integration platform rings a bell and systems come back for what they need; a SQL endpoint fills a dashboard; the integration platform copies data to an older system, and the copies go out of date when the original changes. Everything holds for a one-second pause while the projector lens starts to glow. Then a projector shows the original, live, on a partner university screen (OpenSharing) and a Microsoft Fabric screen that shows several data products in place (mirroring); a second projector turned around shows a research grants system in place (federation).

**On screen.** Integration platform · SQL endpoint · Older system · out of date · Projector · OpenSharing · Mirroring · Federation · Zero-copy

### Scene 9 · Apps and Genie · 5:34–6:02

**Narration.** People meet the data in two ways. Apps: a Databricks App shows an officer a student's record, she fixes a wrong degree code, and the correction flows straight back into the platform. And conversation: Genie. Ask: which first-year classes need more seats next semester? A Genie Agent answers with certified numbers and shows its sources, guided by Genie Ontology. And it only shows you what you're allowed to see.

**Picture.** A Databricks App scans in a student's record; the officer retypes a wrong degree code, and the correction flows back through Lakebase into bronze. A glowing Genie orb sits under a small version of the sketch; the question appears, and the answer card shows certified numbers, a suggestion, three sources and masked names.

**On screen.** Databricks App · Lakebase · back into the platform · Genie

### Scene 10 · Pull back · 6:02–6:17

**Narration.** One tap became a snapshot, then a clear picture, and finally a decision: a new class opens, and 140 more students get a seat. Move less. Mean more.

**Picture.** The whole system again, with one pulse of light travelling from the student system to a business domain. Cut to the phone, Enrolment confirmed, beside a card: New class added, 140 more seats. Black, then the tagline.

**On screen.** Move less. Mean more. · The Inner Life of Data · University edition

## Rigour sheet

| Scene | Real technology | Simplified on screen |
|---|---|---|
| 0 · The tap | The enrolment is written to the student information system's own database first; the platform receives it afterwards as an event or in a file. | One tile stands for one record. |
| 1 · Into the platform | Zerobus Ingest (Lakeflow Connect) accepts records over REST or gRPC and writes them to Unity Catalog Delta tables within seconds; an integration platform can be the caller that routes, retries and secures messages. Auto Loader reads new files from cloud storage incrementally, with checkpoints for exactly-once loading. | Change data capture from databases is a third common path, left out for simplicity. Hot, warm and cold is a design principle, not a product. |
| 2 · The sketch | A conceptual model defines entities and relationships (here: a student enrols in classes; classes belong to a term with a census date; students belong to a course), agreed with the business and kept as the reference for integration models and definitions. | The wrong-sketch example (enrolments attached to courses, not classes) is illustrative. |
| 3 · Refining with dbt | dbt sources declare raw tables and can check freshness; staging models clean one source each; intermediate models join them; tests (not_null, unique, accepted_values, relationships) run after each model, and with dbt build a failing test skips downstream models. dbt compiles SQL that runs on a Databricks SQL warehouse; results are Delta tables governed by Unity Catalog. | Where deduplication lives (staging or intermediate) varies by team. |
| 4 · Gold | Gold marts are published as data products, with enforced model contracts and owners; dbt exposures declare the dashboards, reports and apps that depend on them. | Painting styles stand for shape and grain (detail, headline measures, rule-bound extracts, low latency), not chart styles. |
| 5 · The layers together | Bronze and silver are source-aligned; gold is organised by business domain. The dbt lineage graph runs from sources to exposures; Unity Catalog also records lineage at the platform level. | The DAG shows a handful of models; real projects have hundreds. |
| 6 · Meaning | The dbt Catalog surfaces descriptions, sources, lineage and exposures. Unity Catalog provides access control, row filters, column masks and certification tags. Genie Ontology (Public Preview) combines Unity Catalog semantics with knowledge from sources such as SharePoint or Confluence reached through Databricks-provided MCP connectors, checked against each user's permissions. | Some connectors are still in Beta or Preview. |
| 7 · Two speeds | Lakebase (managed Postgres, GA January 2026) serves apps; synced tables copy Delta data into Postgres; Lakehouse Sync streams changes back to Delta (Public Preview). | The 8 ms is illustrative. |
| 8 · Ways out | Events: a table update trigger starts a job that notifies subscribers through the integration platform, and consumers query back for what they need. SQL endpoints: SQL warehouses over JDBC, ODBC and APIs. Zero-copy: OpenSharing (formerly Delta Sharing), Fabric mirroring of Azure Databricks Unity Catalog (metadata mirrored, data read through shortcuts), and Lakehouse Federation. | "No copy" means no stored copy or sync pipeline; bytes still travel when data is read. |
| 9 · Apps and Genie | Databricks Apps governed by Unity Catalog can write corrections to Lakebase, which flow back to Delta. Genie Agents answer with governed data and cite sources, filtered by each user's permissions. | The agent recommends; people still approve the new class. |

## LinkedIn cut (about 101 seconds)

Take these ranges from the master, in order: 0:03–0:20, 0:32–0:44, 1:17–1:29, 1:57–2:13, 2:49–3:01, 5:08–5:25, 5:48–5:58, 6:12–6:17. Some labels sit near the frame edges, so square or 4:5 crops need a reframing pass.

## Production notes

Narration is generated per line and the film is timed to it, so any line can be re-recorded (for example by a human narrator) and the film re-timed automatically. Music and sound effects are synthesised in code and placed on the same cues; the only silence, one second before the twist, is deliberate. The paintings are code-drawn evocations of each style; an illustrator can replace them. Keep any replacement art original, and avoid dot-painting styles, which are protected by Aboriginal cultural protocols in Australia.

For other universities, localise "class" (unit, subject, course or module), "census date", and the domain names; naming domains after the Higher Education Reference Model (HERM) capability areas makes the map familiar across the sector.

## Sources (checked September 2026)

[Genie One, Genie Agents and Genie Ontology](https://www.databricks.com/blog/introducing-genie-one-genie-ontology-and-genie-agents) · [Genie One external sources and MCP](https://learn.microsoft.com/en-us/azure/databricks/genie-one/external-sources) · [Unity Catalog semantics](https://docs.databricks.com/aws/en/uc-semantics/) · [Zerobus Ingest GA](https://www.databricks.com/blog/announcing-general-availability-zerobus-ingest-part-lakeflow-connect) · [Lakebase synced tables](https://docs.databricks.com/aws/en/oltp/instances/sync-data/sync-table) · [Lakebase release notes](https://docs.databricks.com/aws/en/release-notes/lakebase/) · [OpenSharing](https://www.databricks.com/blog/announcing-new-opensharing-and-marketplace-capabilities-ai-era) · [Fabric mirroring of Azure Databricks](https://learn.microsoft.com/fabric/mirroring/azure-databricks) · [Table update triggers](https://www.databricks.com/blog/announcing-table-update-triggers-lakeflow-jobs) · [dbt exposures](https://docs.getdbt.com/docs/build/exposures) · [dbt model contracts](https://docs.getdbt.com/docs/collaborate/govern/model-contracts) · [dbt platform naming](https://getdbt.com/blog/updated-names-for-dbt-platform-and-features) · [Kokoro voice model](https://huggingface.co/hexgrad/Kokoro-82M) · [Higher Education Reference Models](https://library.educause.edu/resources/2021/9/the-higher-education-reference-models)
