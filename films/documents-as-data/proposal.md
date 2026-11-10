# Documents as data

*Proposal for the last series of the module Modern data basics: one film on documents as data and as context. Planned on 5 November 2026 from the module's plan, [`../data-that-moves/proposal.md`](../data-that-moves/proposal.md), which holds the brief, the reference, the insights, the advice, the world, the people, the look and the sound the four series share; this file holds what is this series' own. Status: agreed; the film is being made after the module's other films, in order.*

## Decided

<!-- decided: made by site-tools/build_series.py from decided.md, the series' and each film's -->
| Date | Decision |
|---|---|
| 5 November 2026 | *Documents as data* (*Documentos como datos*), the last series of *Modern data basics*, is one film: *Files as data and as context*, in `films/documents-as-data/`, at `documents-as-data/` on the site, with its page once the film is out; its card says "A single film". *From tables to decisions* comes before it. The module's plan, its rules and its world are in `films/data-that-moves/proposal.md`. |
| 5 November 2026 | One film, as the author asked: "document and unstructured is an interesting one as context and data itself, but they are generally very specific in use cases so probably good to mention and all the new functions in Databricks to process them more easily but not much more from there." Its practical advice comes from his own work, on the application side: "official documents with metadata, scraping and standard json or yaml structures but that's more on the application side rather than business documents". The film shows supplier invoices read into tables with `ai_parse_document` and `ai_extract` from a Unity Catalog volume, and HR's signed contracts kept with their metadata; it says that business documents are use-case specific, and points to the docs. Documents as an agent's context (permissions on chunks, personal data in PDFs, old versions) belong to the agent films. |
<!-- /decided -->

## The brief

The author, 5 November 2026: "document and unstructured is an interesting one as context and data itself, but they are generally very specific in use cases so probably good to mention and all the new functions in Databricks to process them more easily but not much more from there." From his own work: "official documents with metadata, scraping and standard json or yaml structures but that's more on the application side rather than business documents".

So the series is one film. A document is data to extract and context for an agent. Finance's supplier invoices, most of them PDF files, are read into a table with the platform's functions, from files kept in a governed volume, and checked like any other data; HR's signed contracts are kept with their metadata, so a person or an agent can find the right version and cite it. Where an application writes documents of its own, it writes them in standard structures (JSON, YAML) with their metadata, so nothing needs reading back. Business documents differ in every use case, so the film shows the idea once and points to the docs.

## The film

| # | Folder | Film (working title) | What it shows | The idea to take away |
|---|---|---|---|---|
| 1 | `1-files-as-data-and-context` | Files as data and as context | October's supplier invoices, from PDF files in a Unity Catalog volume to a tested table with `ai_parse_document` and `ai_extract`; each file and its metadata kept beside the row; HR's contracts as context an agent may cite; standard structures where an application writes documents | Read documents where a use case needs it; keep the file and its metadata. |

It opens with a story from outside data, in the four beats said outright: Matthew Maury's wind charts, drawn from thousands of ships' logbooks, and the standard log agreed at Brussels in 1853 (the module's `openings.md`).

## Rules from the plan

The module's rules hold (`../data-that-moves/proposal.md`, *Rules from the plan*). Who may read a document's content, personal data inside files, and documents as an agent's context (permissions on chunks, old versions) are left to data protection and to the agent films; the film names them in a line and doesn't teach them.
