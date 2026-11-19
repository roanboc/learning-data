#!/usr/bin/env python3
"""Builds the pages of the site's series, and the Topics page, in English and Spanish:

    python site-tools/build_series.py

The site is organised in big topics (TOPICS below), each holding films and series. Thirty-three series are built this way:
From words to data (films/from-words-to-data/, on the site at from-words-to-data/), Model the business (films/model-the-business/,
at model-the-business/, whose second film, A Sharper Sketch, keeps its own hand-written pages: "outside" below), In the weeds of data crafting
(films/analytics-engineering/, at in-the-weeds/), The map before the data (films/enterprise-architecture/, at
enterprise-architecture/), the five series that follow it in the topic Enterprise architecture, each the next of the one before:
Business architecture for data (films/business-architecture-for-data/, at business-architecture-for-data/, which holds what the
four share), Data architecture (films/data-architecture/, at data-architecture/), Platform and solution architecture
(films/platform-and-solution-architecture/, at platform-and-solution-architecture/), Continuous architecture
(films/continuous-architecture/, at continuous-architecture/) and AI architecture (films/ai-and-continuous-architecture/, at
ai-architecture/; the two were one series, AI and continuous architecture, until 19 November 2026, and its old pages lead to
theirs: MOVED below), The same one, everywhere (films/master-and-reference-data/, at master-and-reference-data/), and
the three series of data governance: Governance principles (films/data-governance/, at data-governance/), Governance on the
map (films/governance-on-the-map/, at governance-on-the-map/) and Governance you can use (films/governance-in-practice/, at
governance-in-practice/); and the series of the module on AI agents in data work: What an agent is
(films/what-an-agent-is/, at what-an-agent-is/), Agents at work on data (films/agents-at-work-on-data/, at
agents-at-work-on-data/) and From helper to colleague (films/from-helper-to-colleague/, at from-helper-to-colleague/); and the
four series of the module Modern data basics: Data that moves (films/data-that-moves/, at data-that-moves/, which holds the
module's plan), Data as software (films/data-as-software/, at data-as-software/), From tables to decisions
(films/from-tables-to-decisions/, at from-tables-to-decisions/) and Documents and closing remarks (films/documents-as-data/, at
documents-as-data/, two films); and the three series of the module Data protection and privacy: Locks before the
data (films/locks-before-the-data/, at locks-before-the-data/, which holds the module's plan), Only what you may see
(films/only-what-you-may-see/, at only-what-you-may-see/) and Kept for a reason (films/kept-for-a-reason/, at
kept-for-a-reason/); and the two series of the module Data quality: Fit for use (films/fit-for-use/, at fit-for-use/, which
holds the module's plan) and Quality as a habit (films/quality-as-a-habit/, at quality-as-a-habit/); and the five series of the module
Leading data people: People first (films/people-first/, at people-first/), The new skills (films/the-new-skills/, at
the-new-skills/, which holds the module's plan and the kit it shares with Data management), Working with people
(films/working-with-people/, at working-with-people/), Leading a data team
(films/leading-a-data-team/, at leading-a-data-team/) and Ownership and performance (films/ownership-and-performance/, at
ownership-and-performance/); and the three series of the module Data
management: A plan in ninety days (films/a-plan-in-ninety-days/, at a-plan-in-ninety-days/, which holds the module's plan), Making
the case (films/making-the-case/, at making-the-case/) and Small steps, measured (films/small-steps-measured/, at
small-steps-measured/). A series with no film on the site yet has no pages, and the topics leave it out until its first
film is out, as the Topics and home pages leave out a topic with nothing on the site yet. Each is described once, in SERIES below: its folder, its place on the site, its names, the
hand-written pages that show its cards, and what each film builds on. The films and series whose pages are written by hand
(The Inner Life of Data, A Sharper Sketch, When things go wrong) are described, for their cards, in HAND.
For each series: its page (site/<slug>/) and, for each film, its Watch page (site/<slug>/<film>/) and, if it has them, its
Take it apart and Make the call pages (labs/, scenarios/), and their twins under site/es/. Then the Topics page (topics/):
the learning route and the list, from modules/route.json (see docs/navigation.md); the ways on from the home page, and the topics as
tiles on the intro's scenarios page (between <!-- topics: made by site-tools/build_series.py --> and <!-- /topics -->); and the
route's data (assets/learn/route.<lang>.js). The words come from the series' series.json and each film's site.json; the length and chapters from
the film's own source (narration.js, vodur.js and breath.js, timed as The Inner Life of Data's engine times them); the counts
of labs and scenarios from the film's words in site/assets/<film>/learn.en.js (a film without one has none, and its page
offers its Pause and think questions instead), and the count of Pause and think questions from think.en.js. A film whose
player isn't in site/assets/<film>/ yet is left out.
A series can instead have labs and scenarios of its own, for all its films ("learn" in SERIES, and its words in
site/assets/<dir>/learn.en.js): they get their own pages (site/<slug>/labs/ and site/<slug>/scenarios/), the series' page
gets their course bar, and each film's page links to its own lab and situations among them. series_learn() below says what
the words must keep; each series draws them with its own engine (site/assets/<dir>/learn.js).
A film's page can also link to another site that shows its idea, from its site.json's "elsewhere" (elsewhere_section()).
A series or a film its author hasn't reviewed yet is a draft ("draft": true in its series.json or site.json): its pages say so
under their title (DRAFT, is_draft() and draft_note() below).
Never edit the generated pages by hand: change the words, and run this again. check_site.py and smoke.py read every series
through SERIES and films() below, so a new film, or a new series, needs no change to them."""
import hashlib, html, json, math, pathlib, posixpath, re, sys
from media import available as media_available

ROOT = pathlib.Path(__file__).resolve().parents[1]
WEB = ROOT / "site"
BASE = "https://data.learn-all.org/"
REPO = "https://github.com/roanboc/learning-data"
E = lambda s: html.escape(s, quote=False).replace('"', "&quot;")
NUM = {"en": "one two three four five six seven eight nine ten eleven twelve".split(),
       "es": "uno dos tres cuatro cinco seis siete ocho nueve diez once doce".split()}
say_n = lambda lg, n: NUM[lg][n - 1] if 1 <= n <= len(NUM[lg]) else str(n)  # a count in words, up to twelve


def T(lg, en, es):
    return en if lg == "en" else es


def series_link(lg, RE, sid):
    """A link to a series' page, by its id in SERIES, with its name, from a page whose path to its language's root is RE."""
    S = next(x for x in SERIES if x["id"] == sid)
    return f'<a href="{RE}{S["slug"]}/"><i>{S["name"][lg]}</i></a>'


# ---------------------------------------------------------------- the series
# id: the series' key; dir: its folder under films/; slug: its path on the site; name: its title;
# place: where its films happen, as its footer says it ("The university, people, numbers and records… are fictional"; a film whose
# history is real, such as a prologue, says its own line instead, its site.json's "fiction", and the series' page adds its
# "fiction_series");
# marks: the trademarks its footer names, if not the Databricks and dbt logos; learn: the series' own labs and scenarios, for all its films,
# if it has them (see series_learn below): dir, the folder under site/assets/ of their engine and words; bundle, the film whose
# bundle their pages load for its parts (the newest film's if not given); engine, the folder of their engine and its styles, if not
# dir; lazy, True when the engine fetches each film's own words and bundle only as a visitor opens one of its labs or situations
# (In the weeds of data crafting's: each lab and situation is its film's own, and the pack in dir names which), so the pages load no bundle;
# coming, True to count and show those of the films still
# being made (series.json's "coming") too; next: the id of the series to watch after this one, which its last film's page offers
# (in Where next? and beside the series' films) once that series has a film on the site;
# blocks: the hand-written pages that show its first film's card, between <!-- <id>: made by site-tools/build_series.py --> and
# <!-- /<id> -->: (path under site/, language, "card", the path from that page to the site's root, and to the series' folder);
# project: the folder under films/ whose example project its films show (its own folder if not given); built: the id of the series
# that built that project, which each film's See it in the project names for how it was built (none if not given).
# single: True for a film that stands alone, such as More than a platform, which follows the introduction: its folder is a series'
# (films/<dir>/1-<film>/, with a series.json), but the site shows no series page: the film's page is where the series' page would
# be (site/<slug>/), its cards and crumbs say nothing of a series, and a block with "next" is its card on the home pages, a row.
# A series can also count among its films one whose pages are written by hand (HAND below), such as A Sharper Sketch, film 2 of
# Model the business: "outside" in its series.json, {its number: its id in HAND}. It keeps its pages, player, labs and progress; the
# series' pages, its film before and the topics show it among the series' films (outside()), and the topics no longer show it alone.
# A block with "prev" is the card of the film before it, on its page.
# The series' place among the topics, and its card on the Topics and home pages, are in TOPICS below. The three series of data
# governance are one pack: principles, then the organisation's map, then making it work, each the next of the one before. What an
# agent is opens the module AI agents in data work. Data that moves opens the module Modern data basics, whose four series are
# each the next of the one before; the last, Documents and closing remarks, has two films. Locks before the data opens the module
# Data protection and privacy, whose three series are each the next of the one before. Fit for use opens the module Data quality,
# and Quality as a habit follows it; the topic Data quality holds them after When things go wrong. People first opens the module
# Leading data people, whose five series are each the next of the one before; its topic sits just before Data management's. A plan
# in ninety days opens the module Data management, whose three series are each the next of the one before; its topic is the site's
# last.
SERIES = [
    dict(id="from-words-to-data", dir="from-words-to-data", slug="from-words-to-data",
         name={"en": "From words to data", "es": "De las palabras a los datos"},
         place={"en": "university", "es": "universidad"},
         learn=dict(dir="from-words-to-data", bundle="keeping-it-true"),
         blocks=[("sketch/index.html", "en", "card", "../", "../from-words-to-data/"), ("es/sketch/index.html", "es", "card", "../../", "../from-words-to-data/")]),
    dict(id="model-the-business", dir="model-the-business", slug="model-the-business",
         name={"en": "Model the business", "es": "Modelar el negocio"},
         place={"en": "university", "es": "universidad"}, project="analytics-engineering", built="in-the-weeds",
         learn=dict(dir="model-the-business", bundle="the-map-behind-the-sketch"),
         blocks=[("sketch/index.html", "en", "prev", "../", "../model-the-business/"), ("es/sketch/index.html", "es", "prev", "../../", "../model-the-business/")]),
    dict(id="in-the-weeds", dir="analytics-engineering", slug="in-the-weeds",
         name={"en": "In the weeds of data crafting", "es": "En las entrañas del oficio de datos"},
         place={"en": "university", "es": "universidad"}, blocks=[],
         learn=dict(dir="in-the-weeds", bundle="end-to-end")),
    dict(id="enterprise-architecture", dir="enterprise-architecture", slug="enterprise-architecture",
         name={"en": "The map before the data", "es": "El mapa antes de los datos"},
         place={"en": "utility", "es": "empresa de energía"}, blocks=[],
         learn=dict(dir="enterprise-architecture", bundle="now-the-questions-appear"),
         next="business-architecture-for-data",
         marks={"en": "TOGAF and ArchiMate are trademarks of The Open Group, and Zachman of Zachman International, named only to identify those frameworks; this project is not affiliated with or endorsed by them.",
                "es": "TOGAF y ArchiMate son marcas de The Open Group, y Zachman de Zachman International, nombradas solo para identificar esos marcos; este proyecto no está afiliado a ellos ni cuenta con su respaldo."}),
    dict(id="business-architecture-for-data", dir="business-architecture-for-data", slug="business-architecture-for-data",
         name={"en": "Business architecture for data", "es": "Arquitectura de negocio para datos"},
         place={"en": "utility", "es": "empresa de energía"}, blocks=[], next="data-architecture",
         learn=dict(dir="business-architecture-for-data", bundle="what-the-business-owns"),
         marks={"en": "TOGAF and ArchiMate are trademarks of The Open Group, BIZBOK of the Business Architecture Guild, APQC and its Process Classification Framework of APQC, and DAMA-DMBOK of DAMA International, named only to identify those frameworks; this project is not affiliated with or endorsed by them.",
                "es": "TOGAF y ArchiMate son marcas de The Open Group, BIZBOK de la Business Architecture Guild, APQC y su Process Classification Framework de APQC, y DAMA-DMBOK de DAMA International, nombradas solo para identificar esos marcos; este proyecto no está afiliado a ellos ni cuenta con su respaldo."}),
    dict(id="data-architecture", dir="data-architecture", slug="data-architecture",
         name={"en": "Data architecture", "es": "Arquitectura de datos"},
         place={"en": "utility", "es": "empresa de energía"}, blocks=[], next="platform-and-solution-architecture",
         learn=dict(dir="data-architecture", bundle="one-language-kept"),
         marks={"en": "DAMA and DAMA-DMBOK are trademarks of DAMA International, and TOGAF and ArchiMate of The Open Group, named only to identify those bodies of knowledge; this project is not affiliated with or endorsed by them.",
                "es": "DAMA y DAMA-DMBOK son marcas de DAMA International, y TOGAF y ArchiMate de The Open Group, nombradas solo para identificar esos cuerpos de conocimiento; este proyecto no está afiliado a ellos ni cuenta con su respaldo."}),
    dict(id="platform-and-solution-architecture", dir="platform-and-solution-architecture", slug="platform-and-solution-architecture",
         name={"en": "Platform and solution architecture", "es": "Arquitectura de plataforma y de soluciones"},
         place={"en": "utility", "es": "empresa de energía"}, blocks=[], next="continuous-architecture",
         learn=dict(dir="platform-and-solution-architecture", bundle="built-to-change"),
         marks={"en": "TOGAF and ArchiMate are trademarks of The Open Group, named only to identify those frameworks. Company logos and trademarks, including the Databricks and dbt logos, are not covered by either licence and belong to their owners; this project is not affiliated with or endorsed by them.",
                "es": "TOGAF y ArchiMate son marcas de The Open Group, nombradas solo para identificar esos marcos. Los logos y marcas de empresas, incluidos los de Databricks y dbt, no están cubiertos por ninguna de las dos licencias y pertenecen a sus dueños; este proyecto no está afiliado a ellos ni cuenta con su respaldo."}),
    dict(id="continuous-architecture", dir="continuous-architecture", slug="continuous-architecture",
         name={"en": "Continuous architecture", "es": "Arquitectura continua"},
         place={"en": "utility", "es": "empresa de energía"}, blocks=[], next="ai-architecture",
         learn=dict(dir="continuous-architecture", engine="ai-and-continuous-architecture", bundle="every-change-checked"),
         marks={"en": "TOGAF and ArchiMate are trademarks of The Open Group, named only to identify those frameworks. Company logos and trademarks, including the Databricks and dbt logos, are not covered by either licence and belong to their owners; this project is not affiliated with or endorsed by them.",
                "es": "TOGAF y ArchiMate son marcas de The Open Group, nombradas solo para identificar esos marcos. Los logos y marcas de empresas, incluidos los de Databricks y dbt, no están cubiertos por ninguna de las dos licencias y pertenecen a sus dueños; este proyecto no está afiliado a ellos ni cuenta con su respaldo."}),
    dict(id="ai-architecture", dir="ai-and-continuous-architecture", slug="ai-architecture",
         name={"en": "AI architecture", "es": "Arquitectura de IA"},
         place={"en": "utility", "es": "empresa de energía"}, blocks=[],
         learn=dict(dir="ai-and-continuous-architecture", bundle="every-change-checked"),
         marks={"en": "TOGAF and ArchiMate are trademarks of The Open Group, named only to identify those frameworks. Company logos and trademarks, including the Databricks and dbt logos, are not covered by either licence and belong to their owners; this project is not affiliated with or endorsed by them.",
                "es": "TOGAF y ArchiMate son marcas de The Open Group, nombradas solo para identificar esos marcos. Los logos y marcas de empresas, incluidos los de Databricks y dbt, no están cubiertos por ninguna de las dos licencias y pertenecen a sus dueños; este proyecto no está afiliado a ellos ni cuenta con su respaldo."}),
    dict(id="master-and-reference-data", dir="master-and-reference-data", slug="master-and-reference-data",
         name={"en": "The same one, everywhere", "es": "El mismo, en todas partes"},
         place={"en": "university", "es": "universidad"}, blocks=[], next="data-governance",
         learn=dict(dir="master-and-reference-data", bundle="one-person-many-roles"),
         marks={"en": "DAMA and DAMA-DMBOK are trademarks of DAMA International, and ArchiMate of The Open Group, named or drawn only to identify that body of knowledge and that notation. This project is not affiliated with or endorsed by them.",
                "es": "DAMA y DAMA-DMBOK son marcas de DAMA International, y ArchiMate de The Open Group, nombradas o dibujadas solo para identificar ese cuerpo de conocimiento y esa notación. Este proyecto no está afiliado a ellos ni cuenta con su respaldo."}),
    dict(id="data-governance", dir="data-governance", slug="data-governance",
         name={"en": "Governance principles", "es": "Principios de gobernanza"},
         place={"en": "university", "es": "universidad"}, blocks=[], next="governance-on-the-map",
         learn=dict(dir="data-governance", bundle="off-the-shelf"),
         marks={"en": "DAMA and DAMA-DMBOK are trademarks of DAMA International, and DCAM of the EDM Association, named or drawn only to identify those bodies of knowledge; this project is not affiliated with or endorsed by them.",
                "es": "DAMA y DAMA-DMBOK son marcas de DAMA International, y DCAM de la EDM Association, nombradas o dibujadas solo para identificar esos cuerpos de conocimiento; este proyecto no está afiliado a ellos ni cuenta con su respaldo."}),
    dict(id="governance-on-the-map", dir="governance-on-the-map", slug="governance-on-the-map",
         name={"en": "Governance on the map", "es": "La gobernanza en el mapa"},
         place={"en": "university", "es": "universidad"}, blocks=[], next="governance-in-practice",
         learn=dict(dir="governance-on-the-map", bundle="a-capability-not-a-project"),
         marks={"en": "DAMA and DAMA-DMBOK are trademarks of DAMA International, DCAM of the EDM Association, and ArchiMate of The Open Group, named or drawn only to identify those bodies of knowledge and that notation; this project is not affiliated with or endorsed by them.",
                "es": "DAMA y DAMA-DMBOK son marcas de DAMA International, DCAM de la EDM Association, y ArchiMate de The Open Group, nombradas o dibujadas solo para identificar esos cuerpos de conocimiento y esa notación; este proyecto no está afiliado a ellos ni cuenta con su respaldo."}),
    dict(id="governance-in-practice", dir="governance-in-practice", slug="governance-in-practice",
         name={"en": "Governance you can use", "es": "Gobernanza que puedes usar"},
         place={"en": "university", "es": "universidad"}, blocks=[], project="analytics-engineering",
         learn=dict(dir="governance-in-practice", bundle="the-marketplace")),
    dict(id="what-an-agent-is", dir="what-an-agent-is", slug="what-an-agent-is",
         name={"en": "What an agent is", "es": "Qué es un agente"},
         place={"en": "university", "es": "universidad"}, blocks=[], next="agents-at-work-on-data",
         learn=dict(dir="what-an-agent-is", bundle="many-agents")),
    dict(id="agents-at-work-on-data", dir="agents-at-work-on-data", slug="agents-at-work-on-data",
         name={"en": "Agents at work on data", "es": "Agentes trabajando con datos"},
         place={"en": "university", "es": "universidad"}, blocks=[], project="analytics-engineering",
         next="from-helper-to-colleague", learn=dict(dir="agents-at-work-on-data")),
    dict(id="from-helper-to-colleague", dir="from-helper-to-colleague", slug="from-helper-to-colleague",
         name={"en": "From helper to colleague", "es": "De ayudante a colega"},
         place={"en": "university", "es": "universidad"}, blocks=[], project="analytics-engineering",
         built="in-the-weeds", learn=dict(dir="from-helper-to-colleague", engine="agents-at-work-on-data")),
    dict(id="data-that-moves", dir="data-that-moves", slug="data-that-moves",
         name={"en": "Data that moves", "es": "Datos que se mueven"},
         place={"en": "university", "es": "universidad"}, blocks=[], project="analytics-engineering",
         built="in-the-weeds", next="data-as-software",
         learn=dict(dir="data-that-moves", bundle="hot-warm-cold")),
    dict(id="data-as-software", dir="data-as-software", slug="data-as-software",
         name={"en": "Data as software", "es": "Datos como software"},
         place={"en": "university", "es": "universidad"}, blocks=[], project="analytics-engineering",
         built="in-the-weeds", next="from-tables-to-decisions",
         learn=dict(dir="data-as-software", bundle="a-platform-that-watches-itself")),
    dict(id="from-tables-to-decisions", dir="from-tables-to-decisions", slug="from-tables-to-decisions",
         name={"en": "From tables to decisions", "es": "De las tablas a las decisiones"},
         place={"en": "university", "es": "universidad"}, blocks=[], project="analytics-engineering",
         built="in-the-weeds", next="documents-as-data",
         learn=dict(dir="from-tables-to-decisions", bundle="more-readers-than-people")),
    dict(id="documents-as-data", dir="documents-as-data", slug="documents-as-data",
         name={"en": "Documents and closing remarks", "es": "Documentos y comentarios finales"},
         place={"en": "university", "es": "universidad"}, blocks=[], project="analytics-engineering",
         built="in-the-weeds",
         learn=dict(dir="documents-as-data", bundle="ideas-that-last")),
    dict(id="more-than-a-platform", dir="more-than-a-platform", slug="more-than-a-platform", single=True,
         name={"en": "More than a platform", "es": "Más que una plataforma"},
         place={"en": "university", "es": "universidad"},
         blocks=[("index.html", "en", "next", "", "more-than-a-platform/"), ("es/index.html", "es", "next", "../", "more-than-a-platform/"),
                 ("scenarios/index.html", "en", "next", "../", "more-than-a-platform/"), ("es/scenarios/index.html", "es", "next", "../../", "more-than-a-platform/")],
         learn=dict(dir="more-than-a-platform", bundle="more-than-a-platform")),
    dict(id="locks-before-the-data", dir="locks-before-the-data", slug="locks-before-the-data",
         name={"en": "Locks before the data", "es": "Cerraduras antes que los datos"},
         place={"en": "university", "es": "universidad"}, blocks=[], project="analytics-engineering",
         built="in-the-weeds", next="only-what-you-may-see",
         learn=dict(dir="locks-before-the-data", bundle="power-you-switch-on")),
    dict(id="only-what-you-may-see", dir="only-what-you-may-see", slug="only-what-you-may-see",
         name={"en": "Only what you may see", "es": "Solo lo que puedes ver"},
         place={"en": "university", "es": "universidad"}, blocks=[], project="analytics-engineering",
         built="in-the-weeds", next="kept-for-a-reason",
         learn=dict(dir="only-what-you-may-see", bundle="one-policy-for-many-tables")),
    dict(id="kept-for-a-reason", dir="kept-for-a-reason", slug="kept-for-a-reason",
         name={"en": "Kept for a reason", "es": "Guardado por una razón"},
         place={"en": "university", "es": "universidad"}, blocks=[], project="analytics-engineering",
         built="in-the-weeds",
         learn=dict(dir="kept-for-a-reason", bundle="a-person-asks")),
    dict(id="fit-for-use", dir="fit-for-use", slug="fit-for-use",
         name={"en": "Fit for use", "es": "Apto para su uso"},
         place={"en": "university", "es": "universidad"}, blocks=[], project="analytics-engineering",
         built="in-the-weeds", next="quality-as-a-habit",
         learn=dict(dir="fit-for-use", bundle="good-enough-for-what")),
    dict(id="quality-as-a-habit", dir="quality-as-a-habit", slug="quality-as-a-habit",
         name={"en": "Quality as a habit", "es": "La calidad como hábito"},
         place={"en": "university", "es": "universidad"}, blocks=[], project="analytics-engineering",
         built="in-the-weeds",
         learn=dict(dir="quality-as-a-habit", bundle="the-hidden-factory")),
    dict(id="people-first", dir="people-first", slug="people-first",
         name={"en": "People first", "es": "Las personas primero"},
         place={"en": "university", "es": "universidad"}, blocks=[], project="analytics-engineering",
         built="in-the-weeds", next="the-new-skills"),
    dict(id="the-new-skills", dir="the-new-skills", slug="the-new-skills",
         name={"en": "The new skills", "es": "Las nuevas habilidades"},
         place={"en": "university", "es": "universidad"}, blocks=[], project="analytics-engineering",
         built="in-the-weeds", next="working-with-people"),
    dict(id="working-with-people", dir="working-with-people", slug="working-with-people",
         name={"en": "Working with people", "es": "Trabajar con personas"},
         place={"en": "university", "es": "universidad"}, blocks=[], project="analytics-engineering",
         built="in-the-weeds", next="leading-a-data-team"),
    dict(id="leading-a-data-team", dir="leading-a-data-team", slug="leading-a-data-team",
         name={"en": "Leading a data team", "es": "Liderar un equipo de datos"},
         place={"en": "university", "es": "universidad"}, blocks=[], project="analytics-engineering",
         built="in-the-weeds", next="ownership-and-performance"),
    dict(id="ownership-and-performance", dir="ownership-and-performance", slug="ownership-and-performance",
         name={"en": "Ownership and performance", "es": "Responsabilidad y desempeño"},
         place={"en": "university", "es": "universidad"}, blocks=[], project="analytics-engineering",
         built="in-the-weeds"),
    dict(id="a-plan-in-ninety-days", dir="a-plan-in-ninety-days", slug="a-plan-in-ninety-days",
         name={"en": "A plan in ninety days", "es": "Un plan en noventa días"},
         place={"en": "university", "es": "universidad"}, blocks=[], project="analytics-engineering",
         built="in-the-weeds", next="making-the-case",
         learn=dict(dir="a-plan-in-ninety-days", engine="data-management", bundle="from-gaps-to-a-roadmap")),
    dict(id="making-the-case", dir="making-the-case", slug="making-the-case",
         name={"en": "Making the case", "es": "Construir el caso"},
         place={"en": "university", "es": "universidad"}, blocks=[], project="analytics-engineering",
         built="in-the-weeds", next="architecture-that-keeps-up",
         learn=dict(dir="making-the-case", engine="data-management", bundle="one-list-not-twenty")),
    dict(id="architecture-that-keeps-up", dir="architecture-that-keeps-up", slug="architecture-that-keeps-up",
         name={"en": "Architecture that keeps up", "es": "Una arquitectura al día"},
         place={"en": "university", "es": "universidad"}, blocks=[], project="analytics-engineering",
         built="in-the-weeds", next="small-steps-measured",
         learn=dict(dir="architecture-that-keeps-up", engine="data-management", bundle="a-path-for-every-provider")),
    dict(id="small-steps-measured", dir="small-steps-measured", slug="small-steps-measured",
         name={"en": "Small steps, measured", "es": "Pasos pequeños, medidos"},
         place={"en": "university", "es": "universidad"}, blocks=[], project="analytics-engineering",
         built="in-the-weeds",
         learn=dict(dir="small-steps-measured", engine="data-management", bundle="strategy-is-a-habit")),
]
for _S in SERIES:
    _S["root"] = ROOT / "films" / _S["dir"]
FW = SERIES[0]
SER = FW["root"]  # kept for callers that read From words to data's folder


def load_obj(p):
    s = p.read_text()
    return json.loads(s[s.index("{"):s.rindex("}") + 1])


def length(src):
    """The film's length in seconds, timed as engine3.js times it."""
    return timing(src)[1]


def timing(src):
    """When each chapter starts, in seconds ({chapter id: start}), and the film's length, timed as engine3.js times them."""
    N = load_obj(src / "src" / "narration.js")
    V = load_obj(src / "src" / "vodur.js") if (src / "src" / "vodur.js").exists() else {}
    B = load_obj(src / "src" / "breath.js") if (src / "src" / "breath.js").exists() else {}
    tot, starts = 0.0, {}
    for sid, sc in N.items():
        starts[sid] = tot
        b = B.get(sid, {}); hold, pz = b.get("hold", {}), b.get("pause", {}); t = sc.get("lead") or 0.6
        for i, ch in enumerate(sc["vo"]):
            t += (ch.get("pause") or 0) + pz.get(ch["id"], 0)
            d = V.get(sid + "/" + ch["id"]) or max(1.3, len(ch["text"].split()) / 2.7)
            last = i == len(sc["vo"]) - 1
            gap = ch["gap"] if ch.get("gap") is not None else (0.7 if not last and re.search(r'[.?!…]["\'”’»)]*$', ch["text"].strip()) else 0.3)
            t += d + gap + hold.get(ch["id"], 0)
        tot += t + (sc.get("tail") or 1.2) + b.get("breathe", 0)
    return starts, tot


def minutes(sec):
    """A length as the site states it: the nearest half minute, "5½" or "6"."""
    h = round(sec / 30)
    return str(h // 2) + ("½" if h % 2 else "")


def number(d, i):
    """A film's place in its series, from 0: its folder's number less one ("3-which-value-wins" is 2), so a series' films can come
    out in any order; a folder without a number takes its place in series_data()'s list. A prologue, folder 0, is -1: it comes
    before the first film and isn't counted among the films (see num())."""
    m = re.match(r"\d+", d)
    return int(m.group()) - 1 if m else i


def series_data(S):
    """A series' series.json, with "films": its films' folders, in order. A film is a numbered folder with a source/film.json,
    so a new film needs no line in a shared list (a folder without a number can still be listed in series.json's "films")."""
    series = json.loads((S["root"] / "series.json").read_text())
    found = sorted((d.name for d in S["root"].iterdir() if re.match(r"\d+-", d.name) and (d / "source" / "film.json").exists()),
                   key=lambda d: int(re.match(r"\d+", d).group()))
    series["films"] = found + [d for d in series.get("films", []) if d not in found]
    return series


def film_path(S, key):
    """A film's page, from the language's root: under its series' page, or, for a film that stands alone ("single" in SERIES),
    where a series' page would be. Such a film has no series page: its cards, crumbs and links go to the film itself."""
    return f'{S["slug"]}/' if S.get("single") else f'{S["slug"]}/{key}/'


def films(S=FW):
    """Every film of a series whose player is on the site, in order, with everything its pages need."""
    series = series_data(S)
    out = []
    for i, d in enumerate(series["films"]):
        src = S["root"] / d / "source"
        meta = json.loads((src / "film.json").read_text())
        key = meta["key"]
        if not (WEB / "assets" / key / "film.js").exists() or not (S["root"] / d / "site.json").exists():
            continue
        site = json.loads((S["root"] / d / "site.json").read_text())
        learn = WEB / "assets" / key / "learn.en.js"
        if learn.exists() and not S.get("learn"):  # labs and scenarios of its own (in a series with a pack, its words are the pack's source)
            words = learn.read_text()
            labs_part = words[words.index("labs:["):words.index("qs:[")]
            nl, nq = len(re.findall(r'\bkind:"', labs_part)), len(re.findall(r'\{type:"', words))
        else:
            nl = nq = 0
        # the Pause and think questions: one per chapter it stops after, in the film's think pack
        think = WEB / "assets" / key / "think.en.js"
        nt = len(re.findall(r'[{,]q:"', think.read_text())) if think.exists() else 0
        if think.exists() and (nt == 0 or nt != len(re.findall(r'[{,]\s*"?q"?\s*:', think.read_text()))):  # a quoted "q": counts none, and the page said "twelve"
            sys.exit(f"{think.relative_to(ROOT)}: write each question as q:\"...\", unquoted, as the other packs do: it is how the film's page counts them")
        N = load_obj(src / "src" / "narration.js"); starts, sec = timing(src)
        es = site.get("chapters_es")
        if not isinstance(es, dict) or set(es) != set(N):  # a list, or other ids, left the Spanish page's chapter buttons in English
            sys.exit(f"{(S['root'] / d / 'site.json').relative_to(ROOT)}: write chapters_es as {{chapter id: Spanish name}}, one for each "
                     f"chapter of narration.js ({', '.join(N)}), as the other films do: the Spanish page names its chapters by those ids")
        out.append(dict(dir=d, key=key, title=meta["title"], site=site, labs=nl, quiz=nq, think=nt, len=minutes(sec), sec=sec, starts=starts,
                        chapters=[(k, v["name"]) for k, v in N.items()], prefix="ld-" + key, index=number(d, i), series=S,
                        path=film_path(S, key)))
    return series, out


def all_films():
    """Every film on the site that a series page makes, across every series."""
    return [f for S in SERIES for f in films(S)[1]]


_LEARN = {}


def series_learn(S):
    """A series' own labs and scenarios, for all its films ("learn" in SERIES), from its words in site/assets/<dir>/learn.en.js
    and learn.es.js: in each language, each lab's id, film, chapter and name, and each scenario's number, film and lab; their counts;
    their progress prefix ("ld-" and the series' id); the film whose bundle their pages load; the films they cover. Only the labs
    and scenarios of the films on the site count, and with coming=True those of the films still being made. None for a series
    without them.
    The words are read as text: "labs:[" and "qs:[" each start a line; each lab starts with these keys, in this order,
    {id:"…",kind:"…",film:…,chapter:"…" or null,c:"#…",name:"…"}, and each scenario with {type:"…",n:…,lab:"…",film:…};
    and nothing else in them, comments included, holds kind:", {type:" or {id:" (they are counted)."""
    L = S.get("learn")
    if not L:
        return None
    if S["id"] in _LEARN:
        return _LEARN[S["id"]]
    series, films_ = films(S)
    shown = {x["index"] + 1 for x in films_} | ({n for n, _, _ in series.get("coming", [])} if L.get("coming") else set())
    out = dict(dir=L["dir"], engine=L.get("engine", L["dir"]), lazy=bool(L.get("lazy")), prefix="ld-" + S["id"], bundle=L.get("bundle") or (films_[-1]["key"] if films_ else None), films=sorted(shown))
    for lg in ("en", "es"):
        p = WEB / "assets" / L["dir"] / f"learn.{lg}.js"
        words = p.read_text()
        i, j = re.search(r"^labs:\[", words, re.M), re.search(r"^qs:\[", words, re.M)  # each starts a line
        if not i or not j:
            sys.exit(f"{p.relative_to(ROOT)}: no line starting labs:[ and qs:[, which series_learn() reads")
        part, rest = words[i.start():j.start()], words[j.start():]
        labs = re.findall(r'\{id:"(\w+)",kind:"\w+",film:(\d+),chapter:(?:"(\w+)"|null),c:"#[0-9a-f]{6}",name:"([^"]+)"', part)
        qs = re.findall(r'\{type:"\w+",n:(\d+),lab:"(\w+)",film:(\d+)', rest)
        if len(labs) != len(re.findall(r'\bkind:"', part)) or len(labs) != words.count('{id:"') or len(qs) != len(re.findall(r'\{type:"', rest)):
            sys.exit(f"{p.relative_to(ROOT)}: a lab or a scenario doesn't start with the keys series_learn() reads")
        out[lg] = dict(labs=[dict(id=i, film=int(f), chapter=c or None, name=n) for i, f, c, n in labs if int(f) in shown],
                       qs=[(int(n), int(f), lab) for n, lab, f in qs if int(f) in shown])
    out["labs"], out["quiz"] = len(out["en"]["labs"]), len(out["en"]["qs"])
    _LEARN[S["id"]] = out
    return out


def learn_text(lg, S, series, key):
    """A text of a series' own labs and scenarios, from its series.json (learn_p, labs_lead, quiz_lead, each with an _es twin),
    with their counts: {Labs} and {labs}, the labs in words; {quiz}, the scenarios."""
    k = T(lg, key, key + "_es")
    if k not in series:
        sys.exit(f"films/{S['dir']}/series.json: no \"{k}\", which the series' own labs and scenarios need")
    SL = series_learn(S)
    return series[k].format(Labs=say_n(lg, SL["labs"]).capitalize(), labs=say_n(lg, SL["labs"]), quiz=SL["quiz"])


# ---------------------------------------------------------------- the topics
# The films and series whose pages are written by hand, as their cards on the Topics and home pages show them. href: the page,
# from the site's root (its Spanish twin is the same path under es/); a film: its posters, length, labs, scenarios and progress
# prefix; a series: its films, as (key, progress prefix, source folder under films/), to time them and to count them as watched.
HAND = {
    "intro": dict(href="", source="films/inner-life-of-data", learning=["site/assets/learn/learn.en.js", "site/assets/learn/learn.es.js"],
                  title={"en": "The Inner Life of Data", "es": "La vida interior de los datos"},
                  poster={"en": "poster.jpg", "es": "poster.es.jpg"}, len={"en": "7½", "es": "8"}, labs=8, quiz=12, prefix="ld",
                  card={"en": "Follow one enrolment from a tap on a phone to a decision, through Databricks and dbt.",
                        "es": "Sigue una inscripción desde un toque en el teléfono hasta una decisión, pasando por Databricks y dbt."},
                  note={"en": "English and Spanish", "es": "En español e inglés"}),
    "sketch": dict(href="sketch/", source="films/a-sharper-sketch", learning=["site/assets/sketch/sketch.js"],
                   title={"en": "A Sharper Sketch", "es": "A Sharper Sketch"}, title_lang="en",
                   poster={"en": "sketch-poster.jpg", "es": "sketch-poster.jpg"}, len={"en": "7½", "es": "7½"}, labs=6, quiz=12, prefix="ld3",
                   kicker={"en": "Reference models", "es": "Modelos de referencia"},
                   card={"en": "Two trusted numbers disagree. When does a simple model need more precision, and how do you use a reference model without copying it?",
                         "es": "Dos cifras confiables no coinciden. ¿Cuándo necesita más precisión un modelo sencillo, y cómo se usa un modelo de referencia sin copiarlo?"},
                   note={"en": "", "es": "En inglés"}),
    "when-things-go-wrong": dict(href="when-things-go-wrong/", source="films/when-things-go-wrong",
                   learning=["site/assets/when-things-go-wrong/learn.en.js", "site/assets/when-things-go-wrong/learn.es.js"],
                   title={"en": "When things go wrong", "es": "Cuando algo sale mal"},
                   card={"en": "Two bad mornings at the university: a change only half of it saw, and a number too good to be true. Each ends with what catches it next time.",
                         "es": "Dos malas mañanas en la universidad: un cambio que solo la mitad vio, y una cifra demasiado buena para ser verdad. Cada una termina con lo que lo detecta la próxima vez."},
                   films=[("silent-change", "ld-silent-change", "when-things-go-wrong/1-silent-change"),
                          ("too-good-to-be-true", "ld-too-good-to-be-true", "when-things-go-wrong/2-too-good-to-be-true")], labs=True),
}


def outside(S):
    """The films of a series whose pages are written by hand ("outside" in its series.json, {its number: its id in HAND}), such as
    A Sharper Sketch, film 2 of Model the business: [(number, id, its HAND entry, its length in seconds)], in order."""
    out = []
    for n, i in sorted(series_data(S).get("outside", {}).items(), key=lambda x: int(x[0])):
        if i not in HAND or "films" in HAND[i]:
            sys.exit(f"films/{S['dir']}/series.json: \"outside\" names {i!r}, which isn't a film in HAND")
        out.append((int(n), i, HAND[i], length(ROOT / HAND[i]["source"] / "source")))
    return out


def outside_ids():
    """The films in HAND that a series counts among its own (outside()): the topics show them in the series, not alone."""
    return {i for S in SERIES for _, i, _, _ in outside(S)}


def outside_card(lg, S, n, h, R, kicker=None):
    """The card of a series' film whose page is written by hand (outside()), as card() draws a film's: its number and topic, unless
    kicker says otherwise. R: the way from the page to the site's root."""
    kicker = kicker or f'{num(lg, dict(index=n - 1, series=S))} · {h["kicker"][lg]}'
    lang = ' lang="en"' if lg == "es" and h.get("title_lang") == "en" else ""
    meta = f'{h["len"][lg]} min · {h["labs"]} labs · {h["quiz"]} {T(lg, "scenarios", "situaciones")} · {SN(lg, S)}' + T(lg, "", " · En inglés")
    return (f'<article class="topic-card">\n<img src="{R}assets/{h["poster"][lg]}" alt="" width="1280" height="720" loading="lazy">\n<div class="tc-body">\n'
            f'<p class="kicker">{E(kicker)}</p>\n<h3{lang}><a href="{R if lg == "en" else R[3:]}{h["href"]}">{E(h["title"][lg])}</a></h3>\n'
            f'<p>{E(h["card"][lg])}</p>\n<p class="meta">{meta}</p>\n'
            f'<p class="tc-progress" data-progress="{h["prefix"]}" data-labs="{h["labs"]}" data-quiz="{h["quiz"]}" hidden></p>\n</div>\n</article>')


# The big topics, in order: their names, who each is for, what it covers, and what it holds (an id of HAND or SERIES). The Topics
# page shows them all, each with its cards, as a route and as a list; the home page plays the first and leads to the route.
from catalog import load_modules
TOPICS = load_modules()


def topic_of(item_id):
    """The topic that holds a film or a series of HAND or SERIES."""
    return next(t for t in TOPICS if item_id in t["items"])


def shown(t):
    """The films and series a topic's cards show: all of them, but a series with no film on the site yet."""
    return [i for i in t["items"] if all(S["id"] != i or films(S)[1] for S in SERIES)]


def live():
    """The topics the site shows: those with a film or a series on the site (a new topic waits for its first film, as its series does)."""
    return [t for t in TOPICS if shown(t)]


def topic_words(lg):
    """The topics the site shows, how many and which, for the Topics page's words: {n} "seven", {N} "Seven", {list} "data platforms,
    data modelling, …, and data governance"."""
    ns = [t["name"][lg] for t in live()]; ns = [x if x[1:2].isupper() else x[0].lower() + x[1:] for x in ns]  # "AI agents" keeps its capitals
    n = say_n(lg, len(ns))
    last = ", e " if lg == "es" and re.match(r"h?i(?!e)", ns[-1]) else T(lg, ", and ", ", y ")  # "y" becomes "e" before an i sound
    return dict(n=n, N=n[0].upper() + n[1:], list=", ".join(ns[:-1]) + last + ns[-1])


def entry(lg, item_id):
    """What a topic's card says about one of its films or series, in a language: kind ("film" or "series"), href (from the
    language's root), title, posters, card, kicker, meta, and progress: ("film", prefix, labs, quiz) or ("series", prefixes)."""
    S = next((x for x in SERIES if x["id"] == item_id), None)
    if S is not None and S.get("single"):
        f = films(S)[1][0]
        return dict(kind="film", href=f["path"], title=SN(lg, S), title_lang=None, posters=[f'{f["key"]}-poster.jpg'],
                    card=f["site"][T(lg, "card", "card_es")], kicker=T(lg, "One film", "Una película"), len=f["len"],
                    meta=f'{f["len"]} min' + T(lg, "", " · Inglés y español" if spanish_audio(f) else " · En inglés"),
                    progress=("film", f["prefix"], None, None))
    if S is not None:
        series, films_ = films(S)
        out = outside(S)  # its films whose pages are written by hand count too
        n, planned = sum(x["index"] >= 0 for x in films_) + len(out), series.get("planned", len(series["films"]))  # a prologue isn't one of the films
        many = (T(lg, f"{n} of {planned} films", f"{n} de {planned} películas") if planned > n else
                T(lg, "1 film", "1 película") if n == 1 else T(lg, f"{n} films", f"{n} películas")) + \
            (T(lg, " and a prologue", " y un prólogo") if any(x["index"] < 0 for x in films_) else "")
        extra = T(lg, "labs and scenarios", "labs y situaciones") if any(x["labs"] for x in films_) or series_learn(S) else T(lg, "Pause and think", "Pausa para pensar")
        by = sorted([(x["index"] + 1, f'{x["key"]}-poster.jpg', x["prefix"]) for x in films_] + [(k, h["poster"][lg], h["prefix"]) for k, _, h, _ in out])
        return dict(kind="series", href=S["slug"] + "/", title=SN(lg, S), title_lang=None, posters=[p for _, p, _ in by],
                    card=series[T(lg, "card", "card_es")], kicker=T(lg, "Series · ", "Serie · ") + many,
                    meta=f'{round((sum(x["sec"] for x in films_) + sum(sec for _, _, _, sec in out)) / 60)} min · {extra}' + T(lg, "", " · Inglés y español" if any(spanish_audio(x) for x in films_) else " · En inglés"),
                    progress=("series", [x for _, _, x in by]))
    h = HAND[item_id]
    if "films" in h:
        secs = [length(ROOT / "films" / d / "source") for _, _, d in h["films"]]
        n = len(h["films"])
        extra = T(lg, "labs and scenarios", "labs y situaciones") if h.get("labs") else T(lg, "Pause and think", "Pausa para pensar")
        return dict(kind="series", href=h["href"], title=h["title"][lg], title_lang=None, posters=[f"{k}-poster.jpg" for k, _, _ in h["films"]],
                    card=h["card"][lg], kicker=T(lg, f"Series · {n} films", f"Serie · {n} películas"),
                    meta=f'{round(sum(secs) / 60)} min · {extra}' + T(lg, "", " · En inglés"), progress=("series", [p for _, p, _ in h["films"]]))
    note = h["note"][lg]
    return dict(kind="film", href=h["href"], title=h["title"][lg], title_lang=h.get("title_lang"), posters=[h["poster"][lg]],
                card=h["card"][lg], kicker=T(lg, "One film", "Una película"),
                len=h["len"][lg], meta=f'{h["len"][lg]} min · {h["labs"]} labs · {h["quiz"]} {T(lg, "scenarios", "situaciones")}' + (f" · {note}" if note else ""),
                progress=("film", h["prefix"], h["labs"], h["quiz"]))


def series_totals():
    """The total length of every series a topic card shows, as "35 min": check_site.py allows these lengths."""
    return {f'{e["meta"].split(" · ")[0]}' for t in TOPICS for i in shown(t) for e in [entry("en", i)] if e["kind"] == "series"}


# ---------------------------------------------------------------- page parts
FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
         '<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet">')
LOGOS = {"en": "Company logos and trademarks, including the Databricks and dbt logos, are not covered by either licence and belong to their owners; this project is not affiliated with or endorsed by them.",
         "es": "Los logos y marcas de empresas, incluidos los de Databricks y dbt, no están cubiertos por ninguna de las dos licencias y pertenecen a sus dueños; este proyecto no está afiliado a ellos ni cuenta con su respaldo."}
NOTICES = {"en": 'See <a href="https://github.com/roanboc/learning-data/blob/main/NOTICE.md">notices</a>.',
           "es": 'Ver <a href="https://github.com/roanboc/learning-data/blob/main/NOTICE.md">avisos</a> (en inglés).'}
SOURCE = {"en": '<p class="foot-links"><a href="https://github.com/roanboc/learning-data">Source on GitHub</a></p>',
          "es": '<p class="foot-links"><a href="https://github.com/roanboc/learning-data">Código en GitHub</a></p>'}


def foot(lg, S=FW, learn=True, many=False, own=None, also=""):
    """The footer of a series' pages: what's fictional (the series' place; the labs and scenarios too, if its films have them), the voice, the licences.
    many: the page is about the whole series (its labs and scenarios, or its page when it has them), so it speaks of its films.
    own: a film's own line, in place of the series' (its site.json's "fiction"), for a film whose history is real, such as a prologue;
    also: what the series' page adds for such a film (its "fiction_series")."""
    if lg == "en":
        what = own or (f'The {S["place"]["en"]}, people, numbers and records in the film' + ("s" if many else "") + (", the labs and the scenarios" if learn else "") + " are fictional.")
        lic = "The narration is a synthetic voice. Code: MIT licence. Film, script, captions, images and text: CC BY 4.0."
    else:
        art = "La" if S["place"]["es"] in ("universidad", "empresa de energía") else "El"
        what = own or (f'{art} {S["place"]["es"]}, las personas, las cifras y los registros de ' + ("las películas" if many else "la película") + (", los labs y las situaciones" if learn else "") + " son ficticios.")
        lic = "La narración es una voz sintética. Código: licencia MIT. Película, guion, subtítulos, imágenes y textos: CC BY 4.0."
    return f'<footer>{SOURCE[lg]}<p>{E(what)}{" " + E(also) if also else ""} {lic} {S.get("marks", LOGOS)[lg]} {NOTICES[lg]}</p></footer>'


PT = {"en": '{"watched":"Watched","labs":"{n} of {of} labs","quiz":"{n} of {of} scenarios"}', "es": '{"watched":"Vista","labs":"{n} de {of} labs","quiz":"{n} de {of} situaciones"}'}
# a series' progress, on its card: how many of its films were watched
ST = {"en": '{"films":"{n} of {of} films watched"}', "es": '{"films":"{n} de {of} películas vistas"}'}


def head(lg, path, title, desc, og, img, twin=True):
    """<head>, for a page at site/<path> (English) or site/es/<path> (Spanish)."""
    depth = path.count("/") + (1 if lg == "es" else 0)
    R = "../" * depth
    alt = (f'<link rel="alternate" hreflang="en" href="{BASE}{path}"><link rel="alternate" hreflang="es" href="{BASE}es/{path}">\n' if twin else "")
    loc = '<meta property="og:locale" content="es_419">' if lg == "es" else ""
    return (f'<!doctype html>\n<html lang="{lg}">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
            f'<title>{E(title)}</title>\n<meta name="description" content="{E(desc)}">\n'
            f'<meta property="og:title" content="{E(title)}"><meta property="og:description" content="{E(og)}"><meta property="og:image" content="{BASE}assets/{img}">{loc}\n'
            f'{alt}<link rel="icon" href="{R}assets/favicon.svg" type="image/svg+xml">\n{FONTS}\n<link rel="stylesheet" href="{R}assets/site.css">\n'), R


def header(lg, path, R, cur="true", item="topics", other=None, here=None):
    """The site's header, on every page: the brand, Start here, Topics and Making of, then the EN/ES toggle, the dark mode switch
    and the links to learn-all.org and to Rodrigo (in a "More" menu on phones). path: the page's folder from its language's root ("" for the home page); R: the way from the
    page to the site's root. item is marked as the current page (cur="page") or as its section (cur="true"); None marks none.
    other: where the toggle leads, for a page without a twin in the other language (then without hreflang); here: the toggle's link to this page, if not "./"
    (then it isn't marked as the current one)."""
    base = R if lg == "en" else R[3:]
    home = base or "./"
    twin = "" if other else f' hreflang="{"es" if lg == "en" else "en"}"'
    other = other or (f"{R}es/{path}" if lg == "en" else f"{R}{path}")
    names = (("start", "Start here", ""), ("topics", "Topics", "topics/"), ("journey", "Making of", "journey/")) if lg == "en" else \
            (("start", "Empieza aquí", ""), ("topics", "Temas", "topics/"), ("journey", "Cómo se hizo", "journey/"))
    nav = "".join(f'<a href="{base + to or "./"}"' + (f' aria-current="{cur}"' if key == item else "") + f">{name}</a>" for key, name, to in names)
    own = f'<a href="{here}" lang="{lg}">' if here else f'<a href="./" aria-current="true" lang="{lg}">'
    en, es = (f'{own}EN</a>', f'<a href="{other}" lang="es"{twin}>ES</a>') if lg == "en" else \
             (f'<a href="{other}" lang="en"{twin}>EN</a>', f'{own}ES</a>')
    site, language, more = ("Site", "Language", "More options") if lg == "en" else ("Sitio", "Idioma", "Más opciones")
    # On phones the language, the theme and the two icon links fold into one "More" menu (a popover), so the header keeps one row.
    return (f'<header class="top"><div class="top-in"><a class="brand" href="{home}"><img src="{R}assets/favicon.svg" alt=""><span>Learning Data</span></a>'
            f'<nav aria-label="{site}">{nav}</nav><button class="more-btn" type="button" popovertarget="top-more" aria-label="{more}">'
            '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg></button>'
            f'<div class="more" id="top-more" popover><span class="lang" role="group" aria-label="{language}">{en}{es}</span>{external_nav(lg, R)}</div>'
            f'<script>{THEME_JS};{TOUR_JS}</script></div></header>')


# The theme switch: the visitor's choice, kept in this browser, else the device's setting. Run inside the header, before the page is drawn.
THEME_JS = ('(function(){var d=document.documentElement,b=document.currentScript.parentNode.querySelector(".theme"),'
            'm=matchMedia("(prefers-color-scheme: dark)");try{var t=localStorage.getItem("theme");if(t=="dark"||t=="light")d.dataset.theme=t}catch(e){}'
            'function dark(){return d.dataset.theme?d.dataset.theme=="dark":m.matches}function show(){b.setAttribute("aria-pressed",dark())}'
            'show();m.addEventListener("change",show);b.addEventListener("click",function(){d.dataset.theme=dark()?"light":"dark";'
            'try{localStorage.setItem("theme",d.dataset.theme)}catch(e){}show()})})()')


# The guided tour: "?" in the header. Nothing of it loads until someone asks: then its styles, its words in the page's language and
# its script (assets/learn/tour.css, tour.<lang>.js, tour.js), and it starts. On a phone "?" is in the More menu, which closes first.
TOUR_JS = ('(function(){var h=document.currentScript.parentNode.querySelector(".help");if(!h)return;h.addEventListener("click",function(){'
           'var m=document.getElementById("top-more");try{if(m&&m.matches(":popover-open"))m.hidePopover()}catch(e){}'
           'if(window.LD_TOUR){window.LD_TOUR.start(h);return}var p=h.getAttribute("data-tour"),l=document.documentElement.lang=="es"?"es":"en";'
           'function add(t,a,f){var e=document.createElement(t);for(var k in a)e[k]=a[k];if(f)e.onload=f;document.head.appendChild(e)}'
           'add("link",{rel:"stylesheet",href:p+"tour.css"});add("script",{src:p+"tour."+l+".js"},function(){'
           'add("script",{src:p+"tour.js"},function(){window.LD_TOUR.start(h)})})})})()')


# The hand-written pages: their header is made by header() too, and written over theirs by blocks() below.
HAND_PAGES = ["404.html", "index.html", "labs/index.html", "scenarios/index.html", "sketch/index.html", "sketch/labs/index.html",
              "sketch/scenarios/index.html", "when-things-go-wrong/index.html", "when-things-go-wrong/silent-change/index.html",
              "when-things-go-wrong/too-good-to-be-true/index.html", "when-things-go-wrong/labs/index.html",
              "when-things-go-wrong/scenarios/index.html"]
HAND_PAGES += ["es/" + p for p in HAND_PAGES if (WEB / "es" / p).exists()]


def hand_header(rel):
    """The header of a hand-written page (its path under site/). The home page and the intro's labs and scenarios belong to
    Start here, the rest to Topics; A Sharper Sketch's labs and scenarios, in English only, toggle to es/sketch/; the 404 page,
    served at any address, links from the root."""
    if rel == "404.html":
        return header("en", "", "/", item=None, here="/")
    lg = "es" if rel.startswith("es/") else "en"
    path = rel[3 if lg == "es" else 0:].removesuffix("index.html")
    R = "../" * rel.count("/")
    other = f"{R}es/sketch/" if path in ("sketch/labs/", "sketch/scenarios/") else None
    return header(lg, path, R, cur="page" if path == "" else "true", item="start" if path in ("", "labs/", "scenarios/") else "topics", other=other)


def external_nav(lg, R=""):
    """The header's tools: the guided tour ("?"), the dark mode switch, and the links to learn-all.org and to Rodrigo. R: the way to
    the site's root, from which the tour's script, words and styles load when someone asks for it (assets/learn/tour*)."""
    home, contact, theme, tour = (("Ir a learn-all.org", "Contactar a Rodrigo en LinkedIn", "Modo oscuro", "Cómo funciona este sitio") if lg == "es"
                                  else ("Go to learn-all.org", "Contact Rodrigo on LinkedIn", "Dark mode", "How this site works"))
    return (f'<div class="nav-tools"><button class="help" type="button" aria-label="{tour}" data-tour="{R}assets/learn/">'
            '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9.2 9.3a2.9 2.9 0 1 1 4.6 2.3c-1 .7-1.8 1.4-1.8 2.8"/><path d="M12 17.7v.1"/></svg></button>'
            f'<button class="theme" type="button" aria-pressed="false" aria-label="{theme}">'
            '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/></svg></button>'
            f'<a class="parent-site" href="https://learn-all.org" aria-label="{home}">'
            '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m3 10 9-7 9 7M5 9v12h5v-7h4v7h5V9"/></svg><span>learn-all.org</span></a>'
            f'<a href="https://www.linkedin.com/in/roanboc" aria-label="{contact}">'
            '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></svg></a></div>')


def SN(lg, S):
    """The series' name, in a language."""
    return S["name"][lg]


# A draft is content its author hasn't reviewed yet: a series whose series.json says "draft": true, and each of its films,
# unless the film's site.json says "draft": false (its author has reviewed it); a film can also be a draft on its own. Its
# pages say so under their title.
DRAFT = {"en": ("Draft", "The author hasn't reviewed it yet, so some details may change."),
         "es": ("Borrador", "El autor aún no lo ha revisado, así que algunos detalles pueden cambiar.")}


def is_draft(f):
    """Whether a film is a draft: its own site.json says so, or else its series' series.json does."""
    return bool(f["site"].get("draft", series_data(f["series"]).get("draft", False)))


def draft_note(lg, on):
    """The line under a draft's title, on its own pages: nothing for content its author has reviewed."""
    return f'<p class="note draft"><b>{DRAFT[lg][0]}</b> · {DRAFT[lg][1]}</p>\n' if on else ""


def crumbs(lg, R, S, up=None, alone=False):
    """A series page's breadcrumb: Topics › the series' topic › the series, a link (up, from a page under it) or text (on its own page).
    A film that stands alone (alone) sits under its topic: Topics › the topic."""
    RT = R if lg == "en" else R[3:]
    t = topic_of(S["id"])
    if alone:
        return f'<p class="eyebrow crumbs"><a href="{RT}topics/">{T(lg, "Topics", "Temas")}</a> › <a href="{RT}topics/#{t["id"]}">{t["name"][lg]}</a></p>'
    last = f'<a href="{up}">{SN(lg, S)}</a>' if up else SN(lg, S)
    return f'<p class="eyebrow crumbs"><a href="{RT}topics/">{T(lg, "Topics", "Temas")}</a> › <a href="{RT}topics/#{t["id"]}">{t["name"][lg]}</a> › {last}</p>'


def num(lg, f):
    """A film's place in its series, always as "Film 2 of 7": site-tools/check_site.py allows numbering only in this form.
    A series still being made counts the films it plans ("planned" in its series.json), not only those made so far.
    A prologue (folder 0) comes before the films, and is "Prologue"; the film of a series of one is "A single film"."""
    if f["index"] < 0:
        return T(lg, "Prologue", "Prólogo")
    ser = series_data(f["series"])
    n = ser.get("planned", len(ser["films"]))  # a series still being made says how many films it will have
    if n == 1:
        return T(lg, "A single film", "Una sola película")
    return T(lg, "Film", "Película") + f' {f["index"] + 1} {T(lg, "of", "de")} {n}'


def offers(lg, f):
    """What a film offers besides itself, as its card says it: labs and scenarios, or its Pause and think questions."""
    return (f'{f["labs"]} labs · {f["quiz"]} {T(lg, "scenarios", "situaciones")}' if f["labs"] else T(lg, "Pause and think", "Pausa para pensar") if f["think"] else "")


def spanish_audio(f):
    """Whether a film has a Spanish soundtrack for its Spanish page."""
    return media_available(WEB / "assets" / f["key"] / "soundtrack.es.mp3")


def card(lg, f, rel, R, kicker=None):
    """A topic card for a film of a series, linking to it from a page whose path to the series folder is rel.
    Its kicker says the film's number in the series, unless the card stands for the whole series (kicker)."""
    s = f["site"]
    kicker = kicker or f'{num(lg, f)} · {s[T(lg, "kicker", "kicker_es")]}'
    alone = f["series"].get("single")  # a film that stands alone: its card names no series, and links to where the series' page would be
    meta = " · ".join(x for x in (f'{f["len"]} min', offers(lg, f), "" if alone else SN(lg, f["series"])) if x) + T(lg, "", " · En español" if spanish_audio(f) else " · En inglés")
    counts = f' data-labs="{f["labs"]}" data-quiz="{f["quiz"]}"' if f["labs"] else ""
    return (f'<article class="topic-card">\n<img src="{R}assets/{f["key"]}-poster.jpg" alt="" width="1280" height="720" loading="lazy">\n<div class="tc-body">\n'
            f'<p class="kicker">{E(kicker)}</p>\n<h3><a href="{rel}{"" if alone else f["key"] + "/"}">{E(f["title"] if lg == "en" else s["title_es"])}</a></h3>\n'
            f'<p>{E(s[T(lg, "card", "card_es")])}</p>\n<p class="meta">{meta}</p>\n'
            f'<p class="tc-progress" data-progress="{f["prefix"]}"{counts} hidden></p>\n</div>\n</article>')


def course(lg, f, step):
    s = f["site"]; name = f["title"] if lg == "en" else s["title_es"]; nl, nq = f["labs"], f["quiz"]
    here = lambda i: ' aria-current="step"' if i == step else ""
    up = {0: "./", 1: "../", 2: "../"}[step]
    txt = (json.dumps({"watched": "Watched", "labs": "{n} of %d labs explored" % nl, "quiz": "{n} of %d answered · {ok} right" % nq}) if lg == "en" else
           json.dumps({"watched": "Vista", "labs": "{n} de %d labs explorados" % nl, "quiz": "{n} de %d respondidas · {ok} correctas" % nq}, ensure_ascii=False))
    w = NUM[lg]
    steps = ([("#watch", "Watch", f'A {f["len"]} min film'), ("labs/", "Take it apart", f"{w[nl-1].capitalize()} hands-on labs"), ("scenarios/", "Make the call", f"{w[nq-1].capitalize()} real situations")] if lg == "en" else
             [("#watch", "Mira", f'Una película de {f["len"]} min'), ("labs/", "Desarma", f"{w[nl-1].capitalize()} labs interactivos"), ("scenarios/", "Tú decides", f"{w[nq-1].capitalize()} situaciones reales")])
    lis = "\n".join(f'<li><a href="{up}{h}"{here(i)}><span class="n"><b>{i+1}</b></span><b>{a}</b><span>{b}</span></a></li>' for i, (h, a, b) in enumerate(steps))
    return (f'<nav class="course" aria-label="{T(lg, "Course", "Curso")}: {E(name)}"><div class="course-in"><p class="course-t"><small>{num(lg, f)} · {E(s[T(lg, "kicker", "kicker_es")])}</small>{E(name)}</p>'
            f'<ol class="path" data-store="{f["prefix"]}" data-labs="{nl}" data-quiz="{nq}" data-text=\'{txt}\'>\n{lis}\n</ol></div></nav>')



def next_series(f):
    """The series to watch after f's ("next" in SERIES), with its films on the site, if f is the last film its series plans and that
    series has a film on the site; else None."""
    S = f["series"]; ser = series_data(S)
    if not S.get("next") or f["index"] + 1 < ser.get("planned", len(ser["films"])):
        return None
    after = next((x for x in SERIES if x["id"] == S["next"]), None)
    shown = films(after)[1] if after else []
    return (after, shown) if shown else None


def series_nav(lg, f, films_, R, rel):
    """In the series: the previous and the next film, as cards, and every film of the series, numbered, with this one marked.
    rel is the path from the page to the series folder."""
    by = {x["index"]: x for x in films_}; prv, nxt = by.get(f["index"] - 1), by.get(f["index"] + 1)
    nm = lambda x: E(x["title"] if lg == "en" else x["site"]["title_es"])
    hand = {n - 1: h for n, _, h, _ in outside(f["series"])}  # its films whose pages are written by hand
    hn = None if nxt else hand.get(f["index"] + 1)
    after = None if nxt or hn else next_series(f)  # the last film: the next series' first film
    cards = ([card(lg, prv, rel, R, kicker=f'← {T(lg, "Previous", "Anterior")} · {num(lg, prv)}')] if prv else []) + \
            ([card(lg, nxt, rel, R, kicker=f'{T(lg, "Next", "Siguiente")} · {num(lg, nxt)} →')] if nxt else []) + \
            ([outside_card(lg, f["series"], f["index"] + 2, hn, R, kicker=f'{T(lg, "Next", "Siguiente")} · {num(lg, dict(index=f["index"] + 1, series=f["series"]))} →')] if hn else []) + \
            ([card(lg, after[1][0], f'{R if lg == "en" else R[3:]}{after[0]["slug"]}/', R, kicker=f'{T(lg, "Next series", "Siguiente serie")} · {SN(lg, after[0])} →')] if after else [])
    lang = lambda h: ' lang="en"' if lg == "es" and h.get("title_lang") == "en" else ""
    lis = "\n".join(li for _, li in sorted([(x["index"], f'<li><a href="{rel}{x["key"]}/"' + (' aria-current="page"' if x is f else "") + f'><span class="n">{x["index"] + 1}</span>{nm(x)}</a></li>') for x in films_]
                           + [(i, f'<li><a href="{R if lg == "en" else R[3:]}{h["href"]}"><span class="n">{i + 1}</span><span{lang(h)}>{E(h["title"][lg])}</span></a></li>') for i, h in hand.items()]))
    return (f'<section class="module" id="in-the-series" aria-labelledby="series-h">\n<div class="mhead"><div><h2 id="series-h">{T(lg, "In the series", "En la serie")}: <a href="{rel}">{SN(lg, f["series"])}</a></h2>'
            f'<p>{num(lg, f)}.</p></div></div>\n'
            f'<div class="topic-grid series-pn" data-progress-text=\'{PT[lg]}\'>\n' + "\n".join(cards) + '\n</div>\n'
            f'<ol class="series-list" aria-label="{T(lg, "Every film of the series", "Todas las películas de la serie")}">\n{lis}\n</ol>\n</section>\n')


def project_url(f, path):
    """A file or folder of the example project on GitHub, in its own repository (proj_url): a folder ends with /."""
    return proj_url(path)


def project_section(lg, f):
    """See it in the project: for each chapter whose cards show files of the example project, a link to each, on GitHub.
    The files come from the film's site.json, "repo": {chapter id: [paths]}."""
    repo = f["site"].get("repo")
    if not repo:
        return ""
    names = dict(f["chapters"]) if lg == "en" else {k: f["site"]["chapters_es"].get(k, v) for k, v in f["chapters"]}
    built = f["series"].get("built")  # the series that built the project: how it was built is told there (a film page is two below its root)
    how = (T(lg, " How it was built, step by step, is told in ", " Cómo se construyó, paso a paso, lo cuenta ") + series_link(lg, "../../", built) + ".") if built else ""
    rows = []
    for cid, _ in f["chapters"]:
        paths = repo.get(cid)
        if paths:
            links = " ".join(f'<a href="{project_url(f, x)}"><code>{E(proj_shown(x))}</code></a>' for x in paths)
            rows.append(f'<li><b>{E(names[cid])}</b><span>{links}</span></li>')
    return (f'<section class="module" id="in-the-project" aria-labelledby="project-h">\n<div class="mhead"><div><h2 id="project-h">{T(lg, "See it in the project", "Míralo en el proyecto")}</h2>'
            f'<p>{T(lg, "Every card in the film shows a real file from the example dbt project. Open the ones each chapter shows, on GitHub, or run the whole project yourself.", "Cada tarjeta de la película muestra un archivo real del proyecto de dbt de ejemplo. Abre en GitHub los que muestra cada capítulo, o ejecuta tú el proyecto entero.")}{how}</p></div></div>\n'
            f'<ul class="repo-list">\n' + "\n".join(rows) + f'\n</ul>\n<p class="film-links"><a href="{project_url(f, "")}">{T(lg, "Explore the whole project", "Explora el proyecto entero")}</a><a href="{project_url(f, "README.md")}">{T(lg, "How to run it", "Cómo ejecutarlo")}</a></p>\n</section>\n\n')


def elsewhere_section(lg, f):
    """Elsewhere: another site that shows the film's idea, such as a lab on another learn-all.org site, linked from the film's
    page (the film itself names no site). Optional: the film's site.json, "elsewhere": {"h", "p", "links": [{"title", "line",
    "href"}], "more": [{"text", "href"}]}, each with its "_es" twin. A Spanish address opens the other site in Spanish where
    it has Spanish (such as ?lang=es); where it hasn't, its Spanish title says "(en inglés)"."""
    e = f["site"].get("elsewhere")
    if not e:
        return ""
    w = lambda o, k: o[k + "_es"] if lg == "es" else o[k]
    rows = "\n".join(f'<li><b><a href="{E(w(x, "href"))}">{E(w(x, "title"))}</a></b><span>{E(w(x, "line"))}</span></li>' for x in e["links"])
    more = "".join(f'<a href="{E(w(x, "href"))}">{E(w(x, "text"))}</a>' for x in e.get("more", []))
    return (f'<section class="module" id="elsewhere" aria-labelledby="elsewhere-h">\n<div class="mhead"><div><h2 id="elsewhere-h">{E(w(e, "h"))}</h2>'
            f'<p>{E(w(e, "p"))}</p></div></div>\n<ul class="repo-list">\n{rows}\n</ul>\n'
            + (f'<p class="film-links">{more}</p>\n' if more else "") + '</section>\n\n')


def es_scenes(f):
    names = f["site"]["chapters_es"]
    pictures = "the pictures stay in English" if spanish_audio(f) else "the film is in English"
    return (f'<script>/* {pictures}; its chapter buttons and the Pause and think kicker use these Spanish names */\n'
            '{const N=' + json.dumps(names, ensure_ascii=False) + ';SCENES.forEach(s=>{if(N[s.id])s.name=N[s.id];});}</script>')


# ---------------------------------------------------------------- pages
def film_page(lg, f, films_, series):
    """A film's Watch page. A film with labs and scenarios has the course bar (Watch, Take it apart, Make the call); one without
    offers its Pause and think questions, as Silent change does."""
    s = f["site"]; key = f["key"]; S = f["series"]; path = f["path"]; learn = bool(f["labs"])
    alone = bool(S.get("single")); think = bool(f["think"])  # a film that stands alone has no series page; one may have no Pause and think
    SL = None if learn else series_learn(S)  # the series' own labs and scenarios, for every film
    name = f["title"] if lg == "en" else s["title_es"]
    title = f'{name} · Learning Data' if alone else f'{name} · {SN(lg, S)} · Learning Data'
    h, R = head(lg, path, title, s[T(lg, "description", "description_es")], s[T(lg, "card", "card_es")], f"{key}-poster.jpg")
    nxt = next((x for x in films_ if x["index"] == f["index"] + 1), None)
    script = f'{REPO}/blob/main/films/{S["dir"]}/{f["dir"]}/script.md'; caps = f'{REPO}/tree/main/films/{S["dir"]}/{f["dir"]}/captions'
    es_audio = lg == "es" and spanish_audio(f)
    ntw = NUM[lg][f["think"] - 1] if think else ""  # how many Pause and think questions, in words
    nm = lambda x: E(x["title"] if lg == "en" else x["site"]["title_es"])
    hn = None if nxt else next((h for n, _, h, _ in outside(S) if n == f["index"] + 2), None)  # the next film, if its page is written by hand
    after = None if nxt or hn else next_series(f)  # the last film: the series to watch next, once it's on the site
    third = (f'<a class="btn" href="../{nxt["key"]}/">{T(lg, "Next in the series", "Sigue en la serie")}: {nm(nxt)}</a>' if nxt else
             f'<a class="btn" href="{R if lg == "en" else R[3:]}{hn["href"]}">{T(lg, "Next in the series", "Sigue en la serie")}: {E(hn["title"][lg])}</a>' if hn else
             f'<a class="btn" href="{R if lg == "en" else R[3:]}{after[0]["slug"]}/">{T(lg, "Next series", "Siguiente serie")}: {SN(lg, after[0])}</a>' if after else
             f'<a class="btn primary" href="{R if lg == "en" else R[3:]}topics/">{HOME_TEXT[lg][0]}</a>' if alone else
             f'<a class="btn" href="../">{T(lg, "The whole series", "Toda la serie")}: {SN(lg, S)}</a>')
    think_btn = "" if not think else T(lg, f'<button id="think" aria-pressed="true" title="Stop at the end of {ntw} chapters, with one question each">Pause and think</button>',
                                         f'<button id="think" aria-pressed="true" title="Detenerse al final de {ntw} capítulos, con una pregunta cada vez">Pausa para pensar</button>')
    player = (f'<div class="player" data-labs="{"labs/" if learn or SL and alone else "../labs/" if SL else ""}">\n<audio id="snd" preload="metadata" src="{R}assets/{key}/soundtrack{".es" if es_audio else ""}.mp3"></audio><div class="poster"><img src="{R}assets/{key}-poster.jpg" alt="" width="1280" height="720" data-play>'
              f'<div class="poster-cta"><button type="button" class="play-badge" data-play>{T(lg, "▶ Play the film", "▶ Ver la película")} · {f["len"]} min</button></div></div>'
              f'<canvas id="film" width="1280" height="720" aria-label="{T(lg, "Animated film", "Película animada" if es_audio else "Película animada, en inglés")}: {E(f["title"])}"></canvas>\n'
              + (f'<div class="bar"><button id="play">Play</button><input id="scrub" type="range" min="0" step="0.01" value="0" aria-label="Seek"><span id="time">0:00</span>{think_btn}<button id="cc" class="on" aria-pressed="true">Captions</button><button id="fs">Full screen</button></div>' if lg == "en" else
                 f'<div class="bar"><button id="play">Reproducir</button><input id="scrub" type="range" min="0" step="0.01" value="0" aria-label="Buscar"><span id="time">0:00</span>{think_btn}<button id="cc" class="on" aria-pressed="true">Subtítulos</button><button id="fs">Pantalla completa</button></div>')
              + '\n</div>')
    links = (f'<p class="film-links"><a href="https://github.com/roanboc/learning-data/releases/latest/download/{key}.mp4">Download the video</a><a href="{caps}">Caption files</a><a href="{script}">Read the script</a></p>' if lg == "en" else
             f'<p class="film-links"><a href="https://github.com/roanboc/learning-data/releases/latest/download/{key}.mp4">Descargar el video (en inglés)</a><a href="{caps}">Archivos de subtítulos</a><a href="{script}" hreflang="en">Leer el guion (en inglés)</a></p>')
    first = (f'<a class="btn primary" href="labs/">{T(lg, "Take it apart", "Desarma")}: {f["labs"]} {T(lg, "hands-on labs", "labs interactivos")} →</a><a class="btn" href="scenarios/">{T(lg, "Make the call", "Tú decides")}: {f["quiz"]} {T(lg, "situations", "situaciones")}</a>' if learn else
             (film_learn(lg, f, SL, True) if SL else ""))
    nextp = (f'<template id="next-panel"><div class="think-card"><p class="think-k">{T(lg, "Where next?", "¿Y ahora?")}</p><h3>{E(s[T(lg, "next_h", "next_h_es")])}</h3>\n'
             f'<div class="next-opts">{first}{third}</div>\n'
             f'<div class="think-foot"><button type="button" class="btn" data-again>{T(lg, "Watch again", "Ver de nuevo")}</button></div></div></template>')
    watch_p = (T(lg, "<b>Pause and think</b> is on: the film stops for one question at the end of chapters.", "<b>Pausa para pensar</b> está activada: la película se detiene con una pregunta al final de los capítulos.") if think else
               E(s[T(lg, "watch_p", "watch_p_es")]))  # a film with no questions says, in its site.json, what to do while it plays
    body = (f'<body>\n{header(lg, path, R)}\n<main>\n<section class="hero cine"><div class="bg" aria-hidden="true"><img src="{R}assets/{key}-poster.jpg" alt=""></div><canvas class="fx" aria-hidden="true"></canvas>\n'
            f'{crumbs(lg, R, S, "../", alone)}\n'
            f'<h1>{E(s[T(lg, "h1", "h1_es")])}</h1>\n<p class="lead">{E(s[T(lg, "lead", "lead_es")])}</p>\n{draft_note(lg, is_draft(f))}</section>\n'
            + (f'{course(lg, f, 0)}\n' if learn else "") +
            f'<section class="module" id="watch" data-store="{f["prefix"]}" aria-labelledby="watch-h">\n'
            f'<div class="mhead"><div><h2 id="watch-h">{T(lg, "Watch the film", "Mira la película")}</h2><p>{watch_p}</p></div></div>\n'
            f'{player}\n<div class="chapters" id="chapters" aria-label="{T(lg, "Chapters", "Capítulos")}"></div>\n{links}\n{nextp}\n</section>\n\n'
            + project_section(lg, f)
            + (film_learn_section(lg, f, SL) if SL else "")
            + elsewhere_section(lg, f)
            + ("" if alone else series_nav(lg, f, films_, R, "../")) + '</main>\n'
            f'{foot(lg, S, learn, own=s.get(T(lg, "fiction", "fiction_es")))}\n'
            + ('' if lg == "en" else '<script>window.L10N={ui:{play:"Reproducir",pause:"Pausa",load:"Cargando…",fs:"Pantalla completa",fsExit:"Salir de pantalla completa"}};</script>\n')
            + ('' if lg == "en" else f'<script src="{R}assets/{key}/captions.es.js"></script>\n')
            + f'<script src="{R}assets/{key}/film.js"></script>\n' + ('' if lg == "en" else es_scenes(f) + "\n")
            + (f'<script src="{R}assets/{key}/think.{lg}.js"></script>\n<script src="{R}assets/learn/think.js"></script>\n' if think else "") + f'<script src="{R}assets/learn/path.js"></script>\n<script src="{R}assets/learn/next.js"></script>\n<script src="{R}assets/seek.js"></script>\n<script src="{R}assets/ambient.js"></script>\n</body>\n</html>\n')
    return h + "</head>\n" + body


def learn_page(lg, f, which):
    """The labs page (which="labs") or the scenarios page (which="scenarios") of a film. Every series uses From words to data's engine."""
    s = f["site"]; key = f["key"]; S = f["series"]; path = f'{S["slug"]}/{key}/{which}/'
    name = f["title"] if lg == "en" else s["title_es"]
    if which == "labs":
        h1 = s[T(lg, "labs_h1", "labs_h1_es")]; lead = s[T(lg, "labs_lead", "labs_lead_es")] + T(lg, " Your progress stays in this browser.", " Tu avance queda en este navegador.")
        t0 = f'{T(lg, "Take it apart", "Desarma")} · {name} · Learning Data'
    else:
        h1 = T(lg, "Make the call", "Tú decides"); lead = s[T(lg, "quiz_lead", "quiz_lead_es")] + T(lg, " Your answers stay in this browser.", " Tus respuestas quedan en este navegador.")
        t0 = f'{T(lg, "Make the call", "Tú decides")} · {name} · Learning Data'
    h, R = head(lg, path, t0, lead, lead, f"{key}-poster.jpg")
    h += f'<link rel="stylesheet" href="{R}assets/from-words-to-data/learn.css">\n'
    nq, nl = f["quiz"], f["labs"]
    if which == "labs":
        mid = (f'<section aria-labelledby="labs-h">\n<h2 class="sr" id="labs-h">Labs</h2>\n<div id="fw-labs"><noscript><p class="noscript">{T(lg, "The labs need JavaScript.", "Los labs necesitan JavaScript.")}</p></noscript></div>\n</section>\n\n'
               f'<section class="next-step" aria-labelledby="next-step-h"><img src="{R}assets/{key}-poster.jpg" alt="" width="1280" height="720" loading="lazy"><div><p class="step">{T(lg, "Next", "Siguiente")}</p>'
               f'<h2 id="next-step-h"><a href="../scenarios/">{T(lg, "Make the call", "Tú decides")} →</a></h2><p>'
               + T(lg, f"{NUM['en'][nq-1].capitalize()} situations a data team really faces. Decide what you'd do; each answer explains why and points back to the lab that covers it.",
                   f"{NUM['es'][nq-1].capitalize()} situaciones que un equipo de datos enfrenta de verdad. Decide qué harías; cada respuesta explica por qué y te lleva al lab que lo trata.") + '</p></div></section>\n')
    else:
        films_ = films(S)[1]
        mid = (f'<section aria-labelledby="scenarios-h" class="section-gap">\n<h2 class="sr" id="scenarios-h">{T(lg, "Scenarios", "Situaciones")}</h2>\n'
               f'<div id="fw-quiz"><noscript><p class="noscript">{T(lg, "The scenarios need JavaScript.", "Las situaciones necesitan JavaScript.")}</p></noscript></div>\n</section>\n\n'
               + series_nav(lg, f, films_, R, "../../"))
    body = (f'<body>\n{header(lg, path, R)}\n<main>\n<section class="page-head cine"><div class="bg" aria-hidden="true"><img src="{R}assets/{key}-poster.jpg" alt=""></div><canvas class="fx" aria-hidden="true"></canvas>\n'
            f'{crumbs(lg, R, S, "../../")}\n'
            f'<h1>{E(h1)}</h1>\n<p class="lead">{E(lead)}</p>\n{draft_note(lg, is_draft(f))}</section>\n{course(lg, f, 1 if which == "labs" else 2)}\n{mid}</main>\n{foot(lg, S)}\n'
            f'<script src="{R}assets/{key}/film.js"></script>\n<script src="{R}assets/{key}/learn.{lg}.js"></script>\n<script src="{R}assets/from-words-to-data/learn.js"></script>\n'
            f'<script src="{R}assets/learn/path.js"></script>\n<script src="{R}assets/ambient.js"></script>\n</body>\n</html>\n')
    return h + "</head>\n" + body


def series_page(lg, series, films_, S=FW):
    """The series' page: its films, then the sections its series.json has (the films still to come, the thread, what each film
    opens with, its people)."""
    path = f'{S["slug"]}/'
    title = f'{SN(lg, S)} · Learning Data'
    img = films_[0]["key"] + "-poster.jpg" if films_ else "sketch-poster.jpg"
    SL = series_learn(S)  # labs and scenarios of its own, for all its films
    learn = any(x["labs"] for x in films_) or bool(SL)
    h, R = head(lg, path, title, series[T(lg, "description", "description_es")], series[T(lg, "lead", "lead_es")], img)
    out = outside(S)  # its films whose pages are written by hand, among the others by number
    pics = [p for _, p in sorted([(x["index"], f'{x["key"]}-poster.jpg') for x in films_] + [(n - 1, h["poster"][lg]) for n, _, h, _ in out])]
    posters = [f'<img src="{R}assets/{p}" alt="">' for p in pics] * (8 if len(pics) < 4 else 2)
    body = (f'<body>\n{header(lg, path, R)}\n<main>\n<section class="hero cine"><div class="bg mosaic" aria-hidden="true">' + "".join(posters[:8]) + '</div><canvas class="fx" aria-hidden="true"></canvas>\n'
            f'{crumbs(lg, R, S)}\n'
            f'<h1>{SN(lg, S)}</h1>\n<p class="lead">{E(series[T(lg, "lead", "lead_es")])}</p>\n{draft_note(lg, series.get("draft"))}</section>\n'
            + (series_course(lg, S, SL, series, films_, 0) + "\n" if SL else "") + '\n'
            f'<section class="module" id="films" aria-labelledby="films-h">\n<div class="mhead"><div><h2 id="films-h">{T(lg, "The films", "Las películas")}</h2><p>{E(series[T(lg, "order", "order_es")])}</p></div></div>\n'
            f'<div class="topic-grid" data-progress-text=\'{PT[lg]}\'>\n'
            + "\n".join(c for _, c in sorted([(x["index"], card(lg, x, "", R)) for x in films_] + [(n - 1, outside_card(lg, S, n, h, R)) for n, _, h, _ in out]))
            + '\n</div>\n</section>\n\n')
    if SL:
        nl, nq = SL["labs"], SL["quiz"]
        body += (f'<section class="module" id="labs-and-scenarios" aria-labelledby="learn-h">\n<div class="mhead"><div><h2 id="learn-h">{T(lg, "Take it apart, then make the call", "Desarma, y luego tú decides")}</h2><p>'
                 + E(learn_text(lg, S, series, "learn_p")) + T(lg, " Your progress stays in this browser.", " Tu avance queda en este navegador.")
                 + f'</p></div></div>\n<p class="stop-nav"><a class="btn primary" href="labs/">{T(lg, "Take it apart", "Desarma")}: {nl} {T(lg, "hands-on lab" + "s" * (nl != 1), "lab interactivo" if nl == 1 else "labs interactivos")} →</a>'
                 f'<a class="btn" href="scenarios/">{T(lg, "Make the call", "Tú decides")}: {nq} {T(lg, "situations", "situaciones")}</a></p>\n</section>\n\n')
    if "coming" in series:
        out = {x["index"] + 1 for x in films_}  # a film that is out leaves the list by itself
        rows = "\n".join(f'<li><span class="n">{i}</span><span><b>{E(t)}</b> · {E(d)}</span></li>' for i, t, d in series[T(lg, "coming", "coming_es")] if i not in out)
        body += (f'<section class="module" id="coming" aria-labelledby="coming-h">\n<div class="mhead"><div><h2 id="coming-h">{E(series[T(lg, "coming_h", "coming_h_es")])}</h2><p>{E(series[T(lg, "coming_p", "coming_p_es")])}</p></div></div>\n'
                 f'<ol class="series-list coming">\n{rows}\n</ol>\n</section>\n\n')
    # a series page keeps its films, its labs and scenarios and the films to come: the recaps it once had (its thread, the
    # table of what each film opens with, the people at the table) are in the films themselves (Rodrigo, 19 November 2026)
    body += ('</main>\n'
             f'{foot(lg, S, learn, bool(SL), also=" ".join(x["site"][T(lg, "fiction_series", "fiction_series_es")] for x in films_ if "fiction_series" in x["site"]))}\n<script src="{R}assets/learn/path.js"></script>\n<script src="{R}assets/ambient.js"></script>\n</body>\n</html>\n')
    return h + "</head>\n" + body


# ---------------------------------------------------------------- a series' own labs and scenarios
def film_mine(lg, f, SL):
    """A film's labs among its series' own (its number on them), and how many of the series' scenarios come from it."""
    n = f["index"] + 1
    return [x for x in SL[lg]["labs"] if x["film"] == n], sum(1 for q in SL[lg]["qs"] if q[1] == n)


def film_learn(lg, f, SL, panel=False):
    """A film's own lab (or labs) and its situations, among its series' labs and scenarios, as buttons; the "Where next?"
    panel (panel) offers only the first lab."""
    labs, nq = film_mine(lg, f, SL)
    up = "" if f["series"].get("single") else "../"  # a film that stands alone has its series' labs and scenarios under its own page
    out = [f'<a class="btn{" primary" if i == 0 else ""}" href="{up}labs/#{x["id"]}">{T(lg, "Take it apart", "Desarma")}: {E(x["name"])}{" →" if i == 0 else ""}</a>'
           for i, x in enumerate(labs[:1] if panel else labs)]
    if nq:
        out.append(f'<a class="btn" href="{up}scenarios/#film-{f["index"] + 1}">{T(lg, "Make the call", "Tú decides")}: {nq} '
                   + T(lg, "situations" if nq > 1 else "situation", "situaciones" if nq > 1 else "situación") + '</a>')
    return "".join(out)


def film_learn_section(lg, f, SL):
    """On a film's page: its lab and its situations, among its series' own."""
    labs, nq = film_mine(lg, f, SL)
    if not labs and not nq:
        return ""
    many = len(labs) > 1
    mine = (T(lg, f"This film's lab{'s' if many else ''}" + ((", and its situations," if nq > 1 else ", and its situation,") if nq else ","),
              f"{'Los labs' if many else 'El lab'} de esta película" + ((", y sus situaciones," if nq > 1 else ", y su situación,") if nq else ","))
            if labs else T(lg, "This film's situations," if nq > 1 else "This film's situation,", "Las situaciones de esta película," if nq > 1 else "La situación de esta película,"))
    alone = f["series"].get("single")  # a film that stands alone: its labs and situations are the series' own, and "Every lab" says nothing more
    nl = SL["labs"]  # a series with one film made so far has one lab
    p = mine[:-1] + "." if alone else mine + T(lg, f" among the series' {nl} lab{'s' * (nl != 1)} and {SL['quiz']} situations.",
                                               f" entre {'el único lab' if nl == 1 else f'los {nl} labs'} y las {SL['quiz']} situaciones de la serie.")
    p += T(lg, " Your progress stays in this browser.", " Tu avance queda en este navegador.")
    every = "" if alone else f'<a class="btn" href="../labs/">{T(lg, "Every lab", "Todos los labs")}</a>'
    return (f'<section class="module" id="take-it-apart" aria-labelledby="take-h">\n<div class="mhead"><div><h2 id="take-h">{T(lg, "Take it apart, then make the call", "Desarma, y luego tú decides")}</h2><p>{p}</p></div></div>\n'
            f'<p class="stop-nav">{film_learn(lg, f, SL)}{every}</p>\n</section>\n\n')


def learn_films(lg, S, series, films_):
    """The films a series' own labs and scenarios cover (data-films, for its engine), by number: on the site, its title (t), key
    (k), page from the labs and scenarios pages (href) and chapters' starts, rounded up as a chapter link needs them (starts);
    still being made, its title and "coming". An engine that fetches a film's player and words as a lab opens asks for them by
    their versions (v, lv: asset_v()), as a page's links do."""
    vers = lambda k, lg: {n: asset_v(f) for n, f in (("v", f"assets/{k}/film.js"), ("lv", f"assets/{k}/learn.{lg}.js")) if (WEB / f).is_file()}
    by = {x["index"] + 1: x for x in films_}
    coming = {n: t for n, t, _ in series.get(T(lg, "coming", "coming_es"), [])}
    out = {}
    for n in series_learn(S)["films"]:
        x = by.get(n)
        out[n] = (dict(t=x["title"] if lg == "en" else x["site"]["title_es"], k=x["key"], **vers(x["key"], lg), href="../" if S.get("single") else f'../{x["key"]}/', starts={k: math.ceil(v) for k, v in x["starts"].items()})
                  if x else dict(t=coming.get(n, ""), coming=1))
    return json.dumps(out, ensure_ascii=False, separators=(",", ":"))


def series_course(lg, S, SL, series, films_, step):
    """The course bar of a series with its own labs and scenarios: its films (how many were watched: data-series names their
    progress prefixes), its labs and its scenarios. step: 0 on the series' page, 1 on its labs page, 2 on its scenarios page."""
    hand = [h["prefix"] for _, _, h, _ in outside(S)]  # its films whose pages are written by hand
    n, planned, nl, nq = len(films_) + len(hand), series.get("planned", len(series["films"])), SL["labs"], SL["quiz"]
    w = lambda k: say_n(lg, k)
    up = "" if step == 0 else "../"
    txt = (json.dumps({"watched": "Watched", "films": "{n} of %d films watched" % n, "labs": "{n} of %d lab%s explored" % (nl, "s" * (nl != 1)), "quiz": "{n} of %d answered · {ok} right" % nq}) if lg == "en" else
           json.dumps({"watched": "Vista", "films": "{n} de %d películas vistas" % n, "labs": "{n} de %d %s" % (nl, "lab explorado" if nl == 1 else "labs explorados"), "quiz": "{n} de %d respondidas · {ok} correctas" % nq}, ensure_ascii=False))
    made = (T(lg, "One film", "Una película") if n == 1 else T(lg, f"{w(n).capitalize()} films", f"{w(n).capitalize()} películas")) + \
        (T(lg, f", {w(planned - n)} coming", f", {w(planned - n)} en camino") if planned > n else "")
    fl = "#watch" if S.get("single") else "#films"  # a film that stands alone: its page, where the series' page would be
    steps = ([(fl, "The films", made), ("labs/", "Take it apart", "One hands-on lab" if nl == 1 else f"{w(nl).capitalize()} hands-on labs"), ("scenarios/", "Make the call", f"{nq} real situations")] if lg == "en" else
             [(fl, "Las películas", made), ("labs/", "Desarma", "Un lab interactivo" if nl == 1 else f"{w(nl).capitalize()} labs interactivos"), ("scenarios/", "Tú decides", f"{nq} situaciones reales")])
    here = lambda i: ' aria-current="step"' if i == step else ""
    lis = "\n".join(f'<li><a href="{up}{h}"{here(i)}><span class="n"><b>{i + 1}</b></span><b>{a}</b><span>{b}</span></a></li>' for i, (h, a, b) in enumerate(steps))
    return (f'<nav class="course" aria-label="{T(lg, "Course", "Curso")}: {E(SN(lg, S))}"><div class="course-in"><p class="course-t"><small>{T(lg, "Series", "Serie")} · {E(topic_of(S["id"])["name"][lg])}</small>{E(SN(lg, S))}</p>'
            f'<ol class="path" data-store="{SL["prefix"]}" data-labs="{nl}" data-quiz="{nq}" data-series="{" ".join([x["prefix"] for x in films_] + hand)}" data-text=\'{txt}\'>\n{lis}\n</ol></div></nav>')


def series_learn_page(lg, S, series, films_, which):
    """A series' own labs page (which="labs") or scenarios page (which="scenarios"), for all its films. Its engine
    (site/assets/<dir>/learn.js) fills #series-labs or #series-quiz, and draws their pictures with a film's parts: that film's
    bundle loads here, and never plays."""
    SL = series_learn(S); path = f'{S["slug"]}/{which}/'; nq = SL["quiz"]
    if which == "labs":
        h1, img = T(lg, "Take it apart", "Desarma"), films_[-1]["key"]
        lead = learn_text(lg, S, series, "labs_lead") + T(lg, " Your progress stays in this browser.", " Tu avance queda en este navegador.")
    else:
        h1, img = T(lg, "Make the call", "Tú decides"), films_[0]["key"]
        lead = learn_text(lg, S, series, "quiz_lead") + T(lg, " Your answers stay in this browser.", " Tus respuestas quedan en este navegador.")
    h, R = head(lg, path, f'{h1} · {SN(lg, S)} · Learning Data', lead, lead, f"{img}-poster.jpg")
    h += f'<link rel="stylesheet" href="{R}assets/{SL["engine"]}/learn.css">\n'
    if which == "labs":  # the classic kinds a film's labs beside its playground may take (site/assets/learn/classic.js)
        h += f'<link rel="stylesheet" href="{R}assets/learn/classic.css">\n'
    app = f'data-store="{SL["prefix"]}" data-films="{E(learn_films(lg, S, series, films_))}"'
    if which == "labs":
        mid = (f'<section aria-labelledby="labs-h">\n<h2 class="sr" id="labs-h">Labs</h2>\n<div id="series-labs" {app}><noscript><p class="noscript">{T(lg, "The labs need JavaScript.", "Los labs necesitan JavaScript.")}</p></noscript></div>\n</section>\n\n'
               f'<section class="next-step" aria-labelledby="next-step-h"><img src="{R}assets/{films_[0]["key"]}-poster.jpg" alt="" width="1280" height="720" loading="lazy"><div><p class="step">{T(lg, "Next", "Siguiente")}</p>'
               f'<h2 id="next-step-h"><a href="../scenarios/">{T(lg, "Make the call", "Tú decides")} →</a></h2><p>'
               + T(lg, f"{nq} situations from every film. Decide what you'd do; each answer explains why, and points back to the lab that covers it.",
                   f"{nq} situaciones de todas las películas. Decide qué harías; cada respuesta explica por qué, y te lleva al lab que lo trata.") + '</p></div></section>\n')
    else:
        nm = lambda x: E(x["title"] if lg == "en" else x["site"]["title_es"])
        lang = lambda h: ' lang="en"' if lg == "es" and h.get("title_lang") == "en" else ""
        lis = "\n".join(li for _, li in sorted([(x["index"], f'<li><a href="{"../" if S.get("single") else "../" + x["key"] + "/"}"><span class="n">{x["index"] + 1}</span>{nm(x)}</a></li>') for x in films_]
                                               + [(n - 1, f'<li><a href="{R if lg == "en" else R[3:]}{h["href"]}"><span class="n">{n}</span><span{lang(h)}>{E(h["title"][lg])}</span></a></li>') for n, _, h, _ in outside(S)]))
        mid = (f'<section aria-labelledby="scenarios-h" class="section-gap">\n<h2 class="sr" id="scenarios-h">{T(lg, "Scenarios", "Situaciones")}</h2>\n'
               f'<div id="series-quiz" {app}><noscript><p class="noscript">{T(lg, "The scenarios need JavaScript.", "Las situaciones necesitan JavaScript.")}</p></noscript></div>\n</section>\n\n'
               f'<section class="module" id="in-the-series" aria-labelledby="series-h">\n<div class="mhead"><div><h2 id="series-h">{T(lg, "The films", "Las películas")}: <a href="../">{SN(lg, S)}</a></h2>'
               f'<p>{E(series[T(lg, "order", "order_es")])}</p></div></div>\n<ol class="series-list" aria-label="{T(lg, "Every film of the series", "Todas las películas de la serie")}">\n{lis}\n</ol>\n</section>\n')
    body = (f'<body>\n{header(lg, path, R)}\n<main>\n<section class="page-head cine"><div class="bg" aria-hidden="true"><img src="{R}assets/{img}-poster.jpg" alt=""></div><canvas class="fx" aria-hidden="true"></canvas>\n'
            f'{crumbs(lg, R, S, "../")}\n<h1>{E(h1)}</h1>\n<p class="lead">{E(lead)}</p>\n{draft_note(lg, series.get("draft"))}</section>\n{series_course(lg, S, SL, series, films_, 1 if which == "labs" else 2)}\n{mid}</main>\n{foot(lg, S, True, True)}\n'
            + ("" if SL["lazy"] else f'<script src="{R}assets/{SL["bundle"]}/film.js"></script>\n')
            + f'<script src="{R}assets/{SL["dir"]}/learn.{lg}.js"></script>\n'
            + (f'<script src="{R}assets/learn/classic.js"></script>\n' if which == "labs" else "")
            + f'<script src="{R}assets/{SL["engine"]}/learn.js"></script>\n'
            f'<script src="{R}assets/learn/path.js"></script>\n<script src="{R}assets/ambient.js"></script>\n</body>\n</html>\n')
    return h + "</head>\n" + body


def moved_page(lg, S, f, which):
    """The old labs or scenarios page of a film whose series now has one pack for all its films: it leads to the film's lab in the
    pack (the labs page), or to its situation (the scenarios page), so old links keep working."""
    SL = series_learn(S); n = f["index"] + 1
    mine = [x["id"] for x in SL[lg]["labs"] if x["film"] == n]
    to = f'../../labs/{"#" + mine[0] if mine else ""}' if which == "labs" else f'../../scenarios/{"#film-%d" % n if any(q[1] == n for q in SL[lg]["qs"]) else ""}'
    name = f["title"] if lg == "en" else f["site"]["title_es"]
    what = T(lg, "Take it apart" if which == "labs" else "Make the call", "Desarma" if which == "labs" else "Tú decides")
    say = T(lg, f'The labs and situations of <i>{E(name)}</i> are now part of one pack for the whole series, <i>{E(SN(lg, S))}</i>: they\'re <a href="{to}">here</a>.',
            f'Los labs y las situaciones de <i>{E(name)}</i> son ahora parte de un solo paquete para toda la serie, <i>{E(SN(lg, S))}</i>: están <a href="{to}">aquí</a>.')
    return (f'<!doctype html><html lang="{lg}"><head><meta charset="utf-8"><title>{what} · {E(SN(lg, S))} · Learning Data</title><meta name="robots" content="noindex">\n'
            f'<link rel="canonical" href="{BASE}{"es/" if lg == "es" else ""}{S["slug"]}/{which}/">\n'
            f'<!-- made by site-tools/build_series.py: the series has one pack of labs and scenarios for all its films -->\n'
            f'<script>location.replace("{to}");</script><meta http-equiv="refresh" content="0; url={to}"></head>\n'
            f'<body><p>{say}</p></body></html>\n')


# A series split in two: its old pages lead to its films' new series, so old links keep working. slug: its old place on the site;
# name: its old name; was: the ids in SERIES of the series its films are now in, in the order the old series showed them (its film
# N is the Nth of their films, counted across them); first: the one its own page leads to, which names both.
MOVED = [dict(slug="ai-and-continuous-architecture", name={"en": "AI and continuous architecture", "es": "IA y arquitectura continua"},
              was=["ai-architecture", "continuous-architecture"], first="continuous-architecture")]


def moved_series_pages():
    """The old pages of every series in MOVED: (path under site/, html). Each film's page leads to its page in its new series; the
    series' page to its first new series, naming both; the labs page to the series of the lab its link asks for (#id), and the
    scenarios page to the series of the film it asks for (#film-N, counted as the old series counted its films)."""
    out = []
    for M in MOVED:
        new = [next(S for S in SERIES if S["id"] == i) for i in M["was"]]
        old = [(S, f) for S in new for f in films(S)[1]]
        first = next(S for S in new if S["id"] == M["first"])
        for lg in ("en", "es"):
            pre = "" if lg == "en" else "es/"
            def page(rel, to, say, script=None):
                go = script or f'location.replace("{to}"+location.search+location.hash);'
                return (rel, f'<!doctype html><html lang="{lg}"><head><meta charset="utf-8"><title>{E(M["name"][lg])} · Learning Data</title><meta name="robots" content="noindex">\n'
                             f'<link rel="canonical" href="{BASE}{pre}{to.replace("../", "")}">\n'
                             f'<!-- made by site-tools/build_series.py: the series was split in two (MOVED) -->\n'
                             f'<script>{go}</script><meta http-equiv="refresh" content="0; url={to}"></head>\n<body><p>{say}</p></body></html>\n')
            both = T(lg, " and ", " y ").join(f'<a href="../{S["slug"]}/"><i>{E(S["name"][lg])}</i></a>' for S in new)
            out.append(page(f'{pre}{M["slug"]}/index.html', f'../{first["slug"]}/',
                            T(lg, f'<i>{E(M["name"][lg])}</i> is now two series: {both}.', f'<i>{E(M["name"][lg])}</i> es ahora dos series: {both}.')))
            for S, f in old:
                name = f["title"] if lg == "en" else f["site"]["title_es"]
                out.append(page(f'{pre}{M["slug"]}/{f["key"]}/index.html', f'../../{S["slug"]}/{f["key"]}/',
                                T(lg, f'<i>{E(name)}</i> is now in <a href="../../{S["slug"]}/{f["key"]}/"><i>{E(S["name"][lg])}</i></a>.',
                                  f'<i>{E(name)}</i> está ahora en <a href="../../{S["slug"]}/{f["key"]}/"><i>{E(S["name"][lg])}</i></a>.')))
            labs = {x["id"]: S["slug"] for S in new if series_learn(S) for x in series_learn(S)[lg]["labs"]}
            films_at = {str(i + 1): (S["slug"], f["index"] + 1) for i, (S, f) in enumerate(old)}
            for which in ("labs", "scenarios"):
                if which == "labs":
                    js = (f'var L={json.dumps(labs)},h=location.hash.slice(1),s=L[h]||"{first["slug"]}";'
                          f'location.replace("../../"+s+"/labs/"+(L[h]?"#"+h:""));')
                else:
                    js = (f'var F={json.dumps({k: [s, n] for k, (s, n) in films_at.items()})},m=/^#film-(\\d+)$/.exec(location.hash),f=m&&F[m[1]];'
                          f'location.replace("../../"+(f?f[0]+"/scenarios/#film-"+f[1]:"{first["slug"]}/scenarios/"));')
                out.append(page(f'{pre}{M["slug"]}/{which}/index.html', f'../../{first["slug"]}/{which}/',
                                T(lg, f'<i>{E(M["name"][lg])}</i> is now two series, each with its own labs and scenarios: '
                                      + " and ".join(f'<a href="../../{S["slug"]}/{which}/"><i>{E(S["name"][lg])}</i></a>' for S in new) + ".",
                                  f'<i>{E(M["name"][lg])}</i> es ahora dos series, cada una con sus labs y situaciones: '
                                      + " y ".join(f'<a href="../../{S["slug"]}/{which}/"><i>{E(S["name"][lg])}</i></a>' for S in new) + "."), js))
    return out


# ---------------------------------------------------------------- the topics: their page, and their tiles on other pages
def media(e, R):
    """A card's picture: a film's poster, or a series' first three, as one picture."""
    pics = [f'<img src="{R}assets/{p}" alt="" width="1280" height="720" loading="lazy">' for p in e["posters"][:3]]
    return pics[0] if e["kind"] == "film" else f'<div class="sc-media">{"".join(pics)}</div>'


def progress(e):
    """A card's progress, filled by assets/learn/path.js: a film's (watched, labs, scenarios), or how many of a series' films were watched."""
    if e["progress"][0] == "film":
        _, p, nl, nq = e["progress"]
        if nl is None:  # a film with no labs or scenarios: watched, or not
            return f'<p class="tc-progress" data-progress="{p}" hidden></p>'
        return f'<p class="tc-progress" data-progress="{p}" data-labs="{nl}" data-quiz="{nq}" hidden></p>'
    return f'<p class="tc-progress" data-films="{" ".join(e["progress"][1])}" hidden></p>'


def topic_card(lg, e, RL, R):
    """A film's or a series' card on the Topics page: the picture on the left, from 700 px wide; the whole card is one link."""
    lang = ' lang="en"' if lg == "es" and e["title_lang"] == "en" else ""
    cls = "topic-card row" + (" series-card" if e["kind"] == "series" else "")
    return (f'<article class="{cls}">\n{media(e, R)}\n<div class="tc-body">\n<p class="kicker">{E(e["kicker"])}</p>\n'
            f'<h3><a href="{RL}{e["href"]}"{lang}>{E(e["title"])}</a></h3>\n<p>{E(e["card"])}</p>\n<p class="meta">{e["meta"]}</p>\n{progress(e)}\n</div>\n</article>')


# the Topics page's words; {n}, {N} and {list} say how many topics the site shows, and which (topic_words())
TOPICS_PAGE = {
    "title": {"en": "Topics · Learning Data", "es": "Temas · Learning Data"},
    "h1": {"en": "Find your learning route", "es": "Encuentra tu ruta de aprendizaje"},
    "desc": {"en": "Short films on data, in {n} topics: {list}. Start with how a data platform works, then pick the topic you need.",
             "es": "Películas cortas sobre datos, en {n} temas: {list}. Empieza por cómo funciona una plataforma de datos y luego elige el tema que necesitas."},
    "lead": {"en": "{N} topics on one route. Start with the introduction, build the foundations, then take the line you need. Your progress stays in this browser.",
             "es": "{N} temas en una ruta. Empieza por la introducción, construye los fundamentos y luego toma la línea que necesitas. Tu progreso se guarda en este navegador."},
    "foot": {"en": "The university, the utility, people, numbers and records in the films, the labs and the scenarios are fictional. The narration is a synthetic voice. Code: MIT licence. Films, scripts, captions, images and text: CC BY 4.0. Company logos and trademarks, including the Databricks and dbt logos, are not covered by either licence and belong to their owners; this project is not affiliated with or endorsed by them.",
             "es": "La universidad, la empresa de energía, las personas, las cifras y los registros de las películas, los labs y las situaciones son ficticios. La narración es una voz sintética. Código: licencia MIT. Películas, guiones, subtítulos, imágenes y texto: CC BY 4.0. Los logotipos y marcas de empresas, incluidos los de Databricks y dbt, no están cubiertos por ninguna de las dos licencias y pertenecen a sus dueños; este proyecto no está afiliado a ellos ni cuenta con su respaldo."},
}
# The Topics page has two views of the same topics: the learning route (a line map, drawn by assets/learn/route.js from
# assets/learn/route.<lang>.js) and the list (every topic a row that opens on its films and series, with a search of every
# film's words). Without scripts the page is the list. VIEW: the words of the switch, the search and the rows.
VIEW = {
    "en": dict(view="View", route="Learning route", list="Topics list", search="Search the films: a word, a tool, an idea", soon="Coming soon",
               more1="1 more series coming", more="{n} more series coming",
               text=dict(loading="Reading the films…", none="Nothing found for “{q}”. Try a shorter word.", near="No film says “{q}”. Showing “{s}”.",
                         film1="1 film", films="{n} films", topics="Topics and series", said="Said in the film", off="Search isn't available right now.",
                         clear="Clear the search", topic="Topic", series="Series")),
    "es": dict(view="Vista", route="Ruta de aprendizaje", list="Lista de temas", search="Busca en las películas: una palabra, una herramienta, una idea", soon="Próximamente",
               more1="1 serie más en camino", more="{n} series más en camino",
               text=dict(loading="Leyendo las películas…", none="No hay nada para «{q}». Prueba con una palabra más corta.", near="Ninguna película dice «{q}». Se muestra «{s}».",
                         film1="1 película", films="{n} películas", topics="Temas y series", said="Se dice en la película", off="La búsqueda no está disponible ahora.",
                         clear="Borrar la búsqueda", topic="Tema", series="Serie")),
}


def soon_card(lg, u):
    """A series still being made, on its topic's row: its name and how many films it plans; no link and no progress."""
    n = u["films"]
    return (f'<article class="topic-card row soon">\n<div class="tc-body">\n<p class="kicker">{T(lg, f"Series · {n} films", f"Serie · {n} películas")} · {VIEW[lg]["soon"]}</p>\n'
            f'<h3>{E(u["name"][lg])}</h3>\n</div>\n</article>')


def topics_page(lg):
    """The Topics page: the learning route, and the list: every topic a row, in the route's groups, that opens on who it's for,
    what it covers, and a card for each of its films and series."""
    path = "topics/"
    TW = topic_words(lg); desc = TOPICS_PAGE["desc"][lg].format(**TW); V = VIEW[lg]
    h, R = head(lg, path, TOPICS_PAGE["title"][lg], desc, desc, "poster.jpg")
    RL = R if lg == "en" else R[3:]
    D = route_data(lg); TL = {t["id"]: t for t in live()}; PC = project_counts()
    es = {tid: [entry(lg, i) for i in shown(t)] for tid, t in TL.items()}
    order = [TL[t["id"]] for t in D["topics"]]
    firsts = [e["posters"][0] for t in order for e in es[t["id"]]]
    seconds = [p for t in order for e in es[t["id"]] for p in e["posters"][1:2]]
    mosaic = "".join(f'<img src="{R}assets/{p}" alt="">' for p in (firsts + seconds)[:8])
    body = (f'<body>\n{header(lg, path, R, cur="page")}\n<main>\n<section class="hero cine"><div class="bg mosaic" aria-hidden="true">{mosaic}</div><canvas class="fx" aria-hidden="true"></canvas>\n'
            f'<p class="eyebrow">Learning Data</p>\n<h1>{TOPICS_PAGE["h1"][lg]}</h1>\n<p class="lead">{TOPICS_PAGE["lead"][lg].format(**TW)}</p>\n'
            f'<div class="view-switch" role="group" aria-label="{V["view"]}" hidden><button type="button" data-view="route" aria-pressed="false">{V["route"]}</button>'
            f'<button type="button" data-view="list" aria-pressed="true">{V["list"]}</button></div>\n</section>\n'
            f'\n<section class="route-view" id="route" aria-labelledby="route-h" hidden>\n<h2 class="route-sr" id="route-h">{V["route"]}</h2>\n'
            f'{route_box(lg, R, RL)}\n</section>\n'
            f'\n<div class="list-view" id="list">\n<div class="ix-tools" hidden>\n<label class="ix-search" for="ix-q"><svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">'
            '<circle cx="8.5" cy="8.5" r="5.5"/><path d="M13 13l4.5 4.5"/></svg>'
            f'<input id="ix-q" type="search" autocomplete="off" placeholder="{E(V["search"])}" aria-label="{E(V["search"])}" data-index="{R}assets/learn/search.{lg}.json" '
            f'data-base="{RL}" data-root="{R}" data-text="{E(json.dumps(V["text"], ensure_ascii=False))}"></label>\n'
            '<p class="ix-count" id="ix-count" role="status" hidden></p>\n</div>\n<div class="ix-results" id="ix-results" hidden></div>\n')
    for g in D["groups"]:
        body += f'\n<div class="ix-group ln-{g["line"]}">\n<p class="step ix-gh"><i></i>{E(g["name"])}</p>\n'
        for t in (TL[x["id"]] for x in D["topics"] if x["group"] == g["id"]):
            up = upcoming(t)
            cards = "\n".join([topic_card(lg, e, RL, R) for e in es[t["id"]]] + [soon_card(lg, u) for u in up])
            more = f' · {V["more1"] if len(up) == 1 else V["more"].format(n=len(up))}' if up else ""
            body += (f'<section class="module topic" id="{t["id"]}" aria-labelledby="{t["id"]}-h">\n<details>\n'
                     f'<summary><i class="ix-ring" aria-hidden="true"></i><h2 id="{t["id"]}-h">{E(t["name"][lg])}'
                     + (f'<span class="pj-mark" title="{E(ROUTE_TEXT[lg]["projmark"])}">{PROJECT_ICON}<span class="route-sr">{E(ROUTE_TEXT[lg]["projmark"])}</span></span>' if PC.get(t["id"]) else "")
                     + f'</h2><span class="ix-who">{E(t["who"][lg])}</span><span class="ix-cnt">{topic_counts(lg, es[t["id"]])}{more}</span></summary>\n'
                     f'<p class="ix-line">{E(t["line"][lg])}</p>\n'
                     + f'<div class="topic-grid rows" data-progress-text=\'{PT[lg]}\' data-series-text=\'{ST[lg]}\'>\n{cards}\n</div>\n'
                     + (project_box(lg, PC[t["id"]], RL) + "\n" if PC.get(t["id"]) else "") + '</details>\n</section>\n')
        body += '</div>\n'
    body += (f'</div>\n</main>\n<footer>{SOURCE[lg]}<p>{TOPICS_PAGE["foot"][lg]} {NOTICES[lg]}</p></footer>\n'
             f'<script src="{R}assets/learn/path.js"></script>\n<script src="{R}assets/learn/route.{lg}.js"></script>\n<script src="{R}assets/learn/route.js"></script>\n<script src="{R}assets/learn/topics.js"></script>\n'
             f'<script src="{R}assets/ambient.js"></script>\n</body>\n</html>\n')
    return h + f'<link rel="stylesheet" href="{R}assets/learn/route.css">\n</head>\n' + body


def tiles(lg, R):
    """Every topic after the first, as a tile: its name (a link to it on the Topics page), what it covers, and its films and
    series, each a link. For the intro's scenarios page, whose path to the site's root is R (the home page only leads to the route: home_next())."""
    RL = R if lg == "en" else R[3:]
    out = []
    for t in live()[1:]:
        rows = []
        for i in shown(t):
            e = entry(lg, i)
            lang = ' lang="en"' if lg == "es" and e["title_lang"] == "en" else ""
            # A series' count of films ("3 of 4 films") changes with every film, and the tiles of a topic's series sit on
            # neighbouring lines, so film branches of different series clashed on these pages. The committed pages say only
            # "Series"; the site's publish fills in the count (python site-tools/build_series.py --publish).
            small = (e["kicker"] if PUBLISH else T(lg, "Series", "Serie")) if e["kind"] == "series" else f'{e["kicker"]} · {e["len"]} min'
            rows.append(f'<li><a href="{RL}{e["href"]}"><img src="{R}assets/{e["posters"][0]}" alt="" width="1280" height="720" loading="lazy">'
                        f'<span><b{lang}>{E(e["title"])}</b><small>{E(small)}</small></span></a></li>')
        out.append(f'<div class="topic-tile">\n<h3><a href="{RL}topics/#{t["id"]}">{E(t["name"][lg])}</a></h3>\n<p>{E(t["line"][lg])}</p>\n'
                   f'<ul class="tt-items">\n' + "\n".join(rows) + '\n</ul>\n</div>')
    return '<div class="topic-tiles">\n' + "\n".join(out) + '\n</div>\n'


# ---------------------------------------------------------------- the learning route
# modules/route.json puts the topics on one route: its groups, in order (the first is the start, the film every visitor begins
# with; a group on the "main" line is a stretch of the suggested route, and a group on another line is a loop beside it, which
# leaves after the foundations and joins again before the last stretch), each with its topics in order; the goals, each a short
# list of films and series to watch in order; and the series a topic has in the works (upcoming), named on its row until their
# first film is on the site. A new topic is added to one group there.
ROUTE_FILE = ROOT / "modules" / "route.json"
LINES = ("main", "share", "agents")  # the suggested route, and the two loops assets/learn/route.js draws above and below it
_ROUTE = []


def load_route():
    """modules/route.json, checked against the topics: every topic in one group, and every goal's stops among the films and series."""
    if _ROUTE:
        return _ROUTE[0]
    R = json.loads(ROUTE_FILE.read_text(encoding="utf-8")); where = "modules/route.json"
    known = [t["id"] for t in TOPICS]; placed = [x for g in R["groups"] for x in g["topics"]]
    if sorted(placed) != sorted(known):
        sys.exit(f"{where}: every topic belongs to one group of the route. Not placed: {sorted(set(known) - set(placed)) or 'none'}; "
                 f"unknown or placed twice: {sorted(x for x in set(placed) if x not in known or placed.count(x) > 1) or 'none'}")
    both = lambda d: isinstance(d, dict) and set(d) == {"en", "es"} and all(isinstance(v, str) and v.strip() for v in d.values())
    lines = [g["line"] for g in R["groups"]]
    if any(l not in LINES or not both(g["name"]) for l, g in zip(lines, R["groups"])) or any(lines.count(l) > 1 for l in LINES[1:]):
        sys.exit(f"{where}: a group needs a name in English and Spanish and a line ({', '.join(LINES)}); each loop is one group")
    if lines[0] != "main" or len(R["groups"][0]["topics"]) != 1 or lines[-1] != "main":
        sys.exit(f"{where}: the first group is the start, one topic on the main line, and the route ends on the main line")
    items = {i for t in live() for i in shown(t)}
    for g in R["goals"]:
        bad = [x for x in g["stops"] if x not in items]
        if bad or not both(g["name"]) or not both(g["line"]) or not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", g["id"]):
            sys.exit(f"{where}: goal {g.get('id')!r} needs an id, a name and a line in English and Spanish, and stops that are films or series "
                     f"on the site ({', '.join(bad) or 'none'} isn't)")
    for tid, us in R.get("upcoming", {}).items():
        if tid not in known or any(not both(u["name"]) or type(u["films"]) is not int for u in us):
            sys.exit(f"{where}: upcoming names series by their topic ({tid!r}), each with a name in English and Spanish and its count of films")
    _ROUTE.append(R)
    return R


def upcoming(t):
    """The series a topic has in the works (modules/route.json's "upcoming"), until their first film is on the site."""
    out = {S["dir"] for S in SERIES if S["id"] in shown(t)} | set(shown(t))
    return [u for u in load_route().get("upcoming", {}).get(t["id"], []) if u["id"] not in out]


def dur(m):
    """Minutes as the route and the list say them: "40½ min", "2 h 3 min"."""
    if m < 60:
        return f'{int(m)}{"½" if m % 1 else ""} min'
    h, r = divmod(round(m), 60)
    return f"{h} h {r} min" if r else f"{h} h"


def mins(e):
    """An entry's length in minutes, from its card's words ("35 min", "5½ min")."""
    return float(e["meta"].split(" · ")[0].split()[0].replace("½", ".5"))


def watch(e):
    """The progress prefixes of the films an entry counts as watched: a film's own, or each of a series' films."""
    return [e["progress"][1]] if e["kind"] == "film" else list(e["progress"][1])


def topic_counts(lg, entries):
    """A topic's row, in numbers: "3 series · 20 films · 2 h 3 min"."""
    ns, nf = sum(e["kind"] == "series" for e in entries), sum(len(watch(e)) for e in entries)
    return " · ".join(([f"{ns} series"] if ns > 1 else []) + [T(lg, "1 film", "1 película") if nf == 1 else f'{nf} {T(lg, "films", "películas")}',
                                                               dur(sum(mins(e) for e in entries))])


def topic_totals():
    """The minutes each topic's row states, as check_site.py allows lengths: whole ("3 min", of "2 h 3 min") and with a half ("40½")."""
    whole, halves = set(), set()
    for t in live():
        for lg in ("en", "es"):  # a film's Spanish cut can be longer (the introduction's is), so a topic's total can differ by language
            m = re.search(r"(\d+)(½?) min$", dur(sum(mins(entry(lg, i)) for i in shown(t))))
            if m:
                (halves if m.group(2) else whole).add(m.group(1) + ("½" if m.group(2) else " min"))
    return whole, halves


ROUTE_TEXT = {
    "en": dict(start="Start here", play="Play introduction", open="Open topic", next="Your next stop", soon="Coming soon", route="Suggested route",
               any="Suggested paths, not locked steps. Open any topic at any time.", whole="Whole route", want="I want to", stops="{n} stops",
               go="Start this route", on="Continue this route", again="Watch again", watched="Watched", of="{n} of {of} watched", yours="Your route",
               film1="1 film", films="{n} films", series="{n} series", more1="1 more series coming", more="{n} more series coming",
               map="The learning route: {n} topics. Select a topic to see its films and series.",
               proj="The example dbt project", proj1="1 film here shows its real files, and you can run it yourself.",
               projn="{n} films here show its real files, and you can run it yourself.", projpage="About the project",
               projmark="Shows the example dbt project"),
    "es": dict(start="Empieza aquí", play="Ver la introducción", open="Abrir el tema", next="Tu próxima parada", soon="Próximamente", route="Ruta sugerida",
               any="Rutas sugeridas, no pasos obligatorios. Abre cualquier tema cuando quieras.", whole="Toda la ruta", want="Quiero", stops="{n} paradas",
               go="Empezar esta ruta", on="Seguir esta ruta", again="Ver de nuevo", watched="Vista", of="{n} de {of} vistas", yours="Tu ruta",
               film1="1 película", films="{n} películas", series="{n} series", more1="1 serie más en camino", more="{n} series más en camino",
               map="La ruta de aprendizaje: {n} temas. Elige un tema para ver sus películas y series.",
               proj="El proyecto de dbt de ejemplo", proj1="1 película de aquí muestra sus archivos reales, y puedes ejecutarlo tú.",
               projn="{n} películas de aquí muestran sus archivos reales, y puedes ejecutarlo tú.", projpage="Sobre el proyecto",
               projmark="Muestra el proyecto de dbt de ejemplo"),
}


def route_data(lg):
    """What assets/learn/route.js draws, in a language: the route's groups, its topics in the route's order (each with who it's
    for, what it covers, and its films and series: title, page, poster, length, and the progress prefixes of its films), the
    goals, and the words."""
    R = load_route(); TL = {t["id"]: t for t in live()}; PC = project_counts()
    topics = []
    for g in R["groups"]:
        for tid in g["topics"]:
            if tid not in TL:
                continue
            t = TL[tid]; items = []
            for i in shown(t):
                e = entry(lg, i)
                items.append(dict(id=i, kind=e["kind"], title=e["title"], href=e["href"], poster=e["posters"][0], kicker=e["kicker"],
                                  len=e["meta"].split(" · ")[0], min=mins(e), films=watch(e),
                                  **({"lang": "en"} if lg == "es" and e["title_lang"] == "en" else {})))
            items += [dict(id=u["id"], soon=True, title=u["name"][lg], kicker=T(lg, f'Series · {u["films"]} films', f'Serie · {u["films"]} películas'))
                      for u in upcoming(t)]
            topics.append(dict(id=tid, group=g["id"], name=t["name"][lg], who=t["who"][lg], line=t["line"][lg], items=items,
                               **({"proj": PC[tid]} if PC.get(tid) else {})))
    on = {t["group"] for t in topics}
    return dict(lang=lg, text=ROUTE_TEXT[lg], groups=[dict(id=g["id"], line=g["line"], name=g["name"][lg]) for g in R["groups"] if g["id"] in on],
                project=dict(href=PROJECT_PATH, icon=PROJECT_ICON), topics=topics, goals=[dict(id=g["id"], name=g["name"][lg], line=g["line"][lg], stops=g["stops"]) for g in R["goals"]])


def route_js(lg):
    """assets/learn/route.<lang>.js: the route's data, one value a line, so two films of different series never change the same line."""
    return ("/* Learning Data: the learning route's topics, films and series, in one language. Made by site-tools/build_series.py from\n"
            "   modules/route.json and the topics: never edit it by hand. Drawn by route.js. */\n"
            "window.LD_ROUTE = " + json.dumps(route_data(lg), ensure_ascii=False, indent=1) + ";\n")


def route_box(lg, R, RL):
    """Where assets/learn/route.js draws the route, on the Topics page."""
    return f'<div class="route" data-route data-root="{R}" data-base="{RL}" data-topics=""></div>'


# ---------------------------------------------------------------- the example dbt project
# One dbt project, in its own repository (PROJECT_REPO), is behind many films: In the weeds builds it, and later series
# add to it. A film "shows" it when its site.json has "repo" (its chapters' files, as on its See it in the project). Its page,
# dbt-project/, says what it is, how to run it, where things live, and which films show which files; the learning route marks
# each topic with such films with the project's icon, readable on a closed station, and opens on a box that links to it.
PROJECT_DIR = "analytics-engineering"
PROJECT_PATH = "dbt-project/"
# The project's own repository: three teams' folders, the architecture, governance and the data project (the dbt project)
PROJECT_REPO = "https://github.com/roanboc/learning-data-project"
PROJECT_FOLDER = "30-data-project/"
# a box with its lid: the project's mark on the route, the list and its page (no product's logo)
PROJECT_ICON = ('<svg class="pj-ic" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M10 2.4l6.6 3.8v7.6L10 17.6l-6.6-3.8V6.2z"/>'
                '<path d="M3.6 6.3L10 10l6.4-3.7M10 10v7.4"/></svg>')
PROJECT_TEXT = {
    "en": dict(
        title="The example dbt project · Learning Data", h1="The example dbt project",
        desc="One real dbt project behind many of the films: what it answers, how to run it on your laptop or on Databricks, where each part lives, and which films show it.",
        lead="One real project, for a fictional university, is behind many of these films. It adds what a dbt project lacks on its own: who asks, what the words mean, who owns the data and what was promised.",
        repo="Open it on GitHub", run="How to run it",
        run_h="Run it yourself",
        laptop="On your laptop", laptop_p="Python 3.11 or later, no account. dbt loads the sample data, builds every model and runs every test, on DuckDB.",
        dbx="On Databricks", dbx_p="The same code, with dbt Cloud or dbt Core. Load the sample files into Unity Catalog first; the README has the steps.",
        where_h="Where things live", where_p="The project has a repository of its own: a folder where each question starts, then three folders that are usually three teams' own, the enterprise architecture, data governance and the data project. Below, the main folders, and what each holds. Each link opens it on GitHub.",
        films_h="Films that show it", films_p="{n} films show its real files on screen. In the weeds of data crafting builds Planning's answer; later films add a wallet app, Finance, payroll's jobs, data quality checks and the rules AI agents work under. Open a film to see which files each chapter shows.",
        files1="1 file", files="{n} files",
        icon="Shows the example dbt project",
        foot="The university, people and records in the project are fictional. Code: MIT licence. Text: CC BY 4.0.",
    ),
    "es": dict(
        title="El proyecto de dbt de ejemplo · Learning Data", h1="El proyecto de dbt de ejemplo",
        desc="Un proyecto de dbt real detrás de muchas de las películas: qué responde, cómo ejecutarlo en tu computadora o en Databricks, dónde está cada parte y qué películas lo muestran.",
        lead="Un proyecto real, para una universidad ficticia, está detrás de muchas de estas películas. Suma lo que a un proyecto de dbt le falta solo: quién pregunta, qué significan las palabras, de quién son los datos y qué se prometió.",
        repo="Ábrelo en GitHub", run="Cómo ejecutarlo",
        run_h="Ejecútalo tú",
        laptop="En tu computadora", laptop_p="Python 3.11 o posterior, sin cuenta. dbt carga los datos de muestra, construye cada modelo y corre cada prueba, en DuckDB.",
        dbx="En Databricks", dbx_p="El mismo código, con dbt Cloud o dbt Core. Primero carga los archivos de muestra en Unity Catalog; el README tiene los pasos.",
        where_h="Dónde está cada cosa", where_p="El proyecto tiene un repositorio propio: una carpeta donde empieza cada pregunta, y luego tres carpetas que suelen ser de tres equipos, la arquitectura empresarial, el gobierno de datos y el proyecto de datos. Abajo, las carpetas principales y lo que guarda cada una. Cada enlace la abre en GitHub.",
        films_h="Películas que lo muestran", films_p="{n} películas muestran en pantalla sus archivos reales. In the weeds of data crafting construye la respuesta de Planificación; las siguientes suman una billetera digital, Finanzas, los trabajos de la nómina, controles de calidad de datos y las reglas de los agentes de IA. Abre una película para ver qué archivos muestra cada capítulo.",
        files1="1 archivo", files="{n} archivos",
        icon="Muestra el proyecto de dbt de ejemplo",
        foot="La universidad, las personas y los registros del proyecto son ficticios. Código: licencia MIT. Texto: CC BY 4.0.",
    ),
}
# the main folders of the project, and what each holds
PROJECT_PARTS = [
    (["../00-initiatives/"], "Where a question starts: Analytics' record of every question it's asked, each initiative's business requirements, as its tickets hold them, and each goal's tree, where the data team finds the questions to suggest first.",
     "Donde empieza una pregunta: el registro de Analítica de cada pregunta que recibe, los requisitos del negocio de cada iniciativa, tal como los guardan sus tickets, y el árbol de cada meta, donde el equipo de datos encuentra las preguntas que sugerir primero."),
    (["../10-enterprise-architecture/"], "The university's enterprise architecture: every area and data domain, and below them only what the questions need: their data objects and the systems of record that feed them.",
     "La arquitectura empresarial de la universidad: cada área y dominio de datos, y debajo solo lo que las preguntas necesitan: sus objetos de datos y los sistemas de registro que los alimentan."),
    (["models/"], "What's built, by domain: staging, the core tables every team shares, and the marts each team reads.",
     "Lo que se construye, por dominio: staging, las tablas centrales que comparten todos y los marts que lee cada equipo."),
    (["sources/"], "What comes in from the three systems: tables, keys, freshness and known limits.",
     "Lo que llega de los tres sistemas: tablas, claves, frescura y límites conocidos."),
    (["seeds/"], "Reference data the business owns, and published numbers to reconcile against.",
     "Datos de referencia que son del negocio, y cifras publicadas para conciliar."),
    (["tests/"], "Business rules that must hold, reconciliations, and rules about the project itself.",
     "Reglas del negocio que deben cumplirse, conciliaciones y reglas sobre el propio proyecto."),
    (["macros/"], "Conventions written once: keys, point in time, Planning's rule, and Databricks tags and masks.",
     "Convenciones escritas una vez: claves, punto en el tiempo, la regla de Planificación, y etiquetas y máscaras en Databricks."),
    (["analyses/"], "The evidence: profiling the sources, a design choice, and checking the result.",
     "La evidencia: perfilar las fuentes, una decisión de diseño y la revisión del resultado."),
    (["exposures/"], "Who uses each output: dashboards, apps, forecasts and agents.",
     "Quién usa cada resultado: tableros, aplicaciones, pronósticos y agentes."),
    (["governance/"], "Data governance's own folder, beside the project: the glossary, owners, the architecture map, information assets, data products, contracts, metrics and agents' mandates.",
     "La carpeta propia de gobierno de datos, junto al proyecto: el glosario, los responsables, el mapa de arquitectura, los activos de información, los productos de datos, los contratos, las métricas y los mandatos de los agentes."),
    (["docs/"], "How the work is done: the process, conventions, decisions and the quality scorecard.",
     "Cómo se hace el trabajo: el proceso, las convenciones, las decisiones y el tablero de calidad."),
    (["AGENTS.md", "skills/"], "What an AI agent may and may not do here, and the skills it uses.",
     "Qué puede y qué no puede hacer aquí un agente de IA, y las habilidades que usa."),
    (["examples/"], "Pull requests, nights and Databricks set-ups that the films tell as stories.",
     "Pull requests, noches y configuraciones de Databricks que las películas cuentan como historias."),
    (["databricks.yml", "resources/"], "The jobs, deployed as one bundle to test and to production.",
     "Los trabajos, desplegados como un solo paquete en prueba y en producción."),
]


def proj_path(path=""):
    """Where a path the films name lives in the project's repository. The films name the data project's files from its
    own folder (models/, AGENTS.md) and governance's as governance/...: data governance has its own folder now."""
    if path.startswith("governance/"):
        return "20-data-governance/" + path[len("governance/"):]
    if path.startswith("../"):  # the repository's other folders, beside the data project
        return path[len("../"):]
    if path == "CODEOWNERS":  # GitHub reads it only at the repository's root, in .github/ or in docs/
        return ".github/CODEOWNERS"
    return PROJECT_FOLDER + path


def proj_shown(path):
    """A path as a page shows it: the data project's from its folder, as the films do; governance's from the repository."""
    return proj_path(path) if path.startswith(("governance/", "../")) else path


def proj_url(path="", root=False):
    """A file or folder of the example project on GitHub, in its own repository: a folder ends with /. root: the repository."""
    if root:
        return PROJECT_REPO
    kind = "tree" if path.endswith("/") or not path else "blob"
    return f'{PROJECT_REPO}/{kind}/main/{proj_path(path)}'.rstrip("/")


def route_topics():
    """The topics the site shows, in the route's order."""
    TL = {t["id"]: t for t in live()}
    return [TL[tid] for g in load_route()["groups"] for tid in g["topics"] if tid in TL]


def project_films():
    """The films that show the example project (site.json's "repo"), by topic in the route's order, then by series:
    [(topic, [(series, [film, ...]), ...]), ...]."""
    out = []
    for t in route_topics():
        rows = []
        for i in shown(t):
            S = next((x for x in SERIES if x["id"] == i), None)
            if S is None or S.get("project", S["dir"]) != PROJECT_DIR:
                continue
            fs = [f for f in films(S)[1] if f["site"].get("repo")]
            if fs:
                rows.append((S, fs))
        if rows:
            out.append((t, rows))
    return out


def project_counts():
    """How many films of each topic show the example project: {topic id: n}."""
    return {t["id"]: sum(len(fs) for _, fs in rows) for t, rows in project_films()}


def project_box(lg, n, RL):
    """The box a topic with films that show the project opens on, in the Topics list (route.js draws the same on the route)."""
    X = ROUTE_TEXT[lg]
    return (f'<div class="pj-box">{PROJECT_ICON}<div><p class="pj-t">{E(X["proj"])}</p><p class="pj-l">{E(X["proj1"] if n == 1 else X["projn"].format(n=n))}</p>'
            f'<p class="pj-a"><a href="{RL}{PROJECT_PATH}">{E(X["projpage"])}</a></p></div></div>')


# The example project's page shows how the business reaches the code, in five parts to play with (the author, 15 November 2026:
# "make it more interactive"; 16 November: the question starts in Analytics' records, and an initiative's ticket brings it to the
# architecture; 17 November: Goal–Question–Metric frames the question, and a goal's tree holds the measures): Planning's goal and
# its question, followed in twelve steps across the four folders, each with its real file; the eight questions a dbt project
# alone can't answer, and the piece of context that answers each; one learner through the data project's seven layers; the
# three open standards, line by line; and the check that holds each handoff. Each part is HTML that
# reads on its own; assets/learn/project.js makes it interactive, and assets/learn/project.css draws it. The files' lines are
# copied as they are in the project's repository (path, first line, lines): check_site.py compares them with a checkout of it.
# The page loads the script and the stylesheet by a hash of each (stamp(), as every page): after changing either, run this again.
PROJECT_LANES = {  # the folders: their number, name and what each says
    "in": ("00", ("Initiatives", "Iniciativas"), ("Where a question starts", "Donde empieza una pregunta")),
    "ea": ("10", ("Enterprise architecture", "Arquitectura empresarial"), ("Why, and where", "Por qué y dónde")),
    "dg": ("20", ("Data governance", "Gobierno de datos"), ("What it means, who answers, what is promised", "Qué significa, quién responde, qué se promete")),
    "dp": ("30", ("Data project", "Proyecto de datos"), ("Built, tested and run", "Construido, probado y ejecutado")),
}
PROJECT_FACULTIES = [(("Arts and Education", "Artes y Educación"), 2), (("Business", "Negocios"), 3),
                     (("Engineering and IT", "Ingeniería y TI"), 5), (("Health", "Salud"), 2)]  # the census report's, as the mart gives them
# Planning's goal and its question, in twelve steps, in the order the work happens (the author, 16 November 2026: the question is
# born in analytics, often with no known answer; an initiative carries it into a ticket; then the architecture's data objects and
# systems of record, governance's glossary entities and the core entity's contract, and the data team builds up to that core
# entity, or checks first what's already built; 17 November: Goal–Question–Metric, so the goal comes first, with its tree of
# measures, where the data team finds the questions to suggest before anyone asks). Each step: the lane, the node's name and a
# short tag, what the step is, what it passes on, and its file: a table's row (rows: the header and the row), a table's rows of
# names and values (pairs), or YAML lines (code: blocks of (first line, lines); hi: the lines to light). paths: two ways the step
# can go, which the panel switches between; tree: the goal's tree (PROJECT_TREE).
# Planning's goal, and its tree as 00-initiatives/goals/learning-and-teaching.md draws it (the author, 17 November 2026: "let's go
# with goal question metric", a metric tree holding the measures): the goal's rows, its measures and arrows and the suggested
# questions' rows are copied as they are, and check_site.py holds each line to the file. The page draws the tree as an outline,
# from the goal's measure down: a solid arrow is a formula (+ or ×), a dotted one a driver. Then, in Spanish, each measure's name,
# and each suggested question, where it stands, why now, the decision it informs and its size.
PROJECT_GOAL_FILE = "../00-initiatives/goals/learning-and-teaching.md"
PROJECT_GOAL_ROWS = [
    "| **Goal** | **More learners finish the award they started** |",
    "| Owner | Clara Jensen, Planning |",
    "| What for | To put advising, units and support where they keep learners on track |",
    "| Seeded from | The measures the whole sector reports: completions, retention and success, as the Department of Education publishes them from TCSI |",
]
PROJECT_GOAL_ES = "Más estudiantes terminan el título que empezaron"
PROJECT_TREE = [
    '  awards["Awards completed"]:::starter',
    '  bach["Bachelor degrees"]:::starter',
    '  gc["Graduate certificates"]:::starter',
    '  mast["Masters and other awards"]:::starter',
    '  fy["Final-year learners"]:::starter',
    '  bshare["Share completing this year"]:::starter',
    '  ret["Retention after first year · SQ3"]:::suggested',
    '  succ["Final-year success rate"]:::starter',
    '  nearfin["Finished from near the award"]:::starter',
    '  far["Finished from further away"]:::starter',
    '  near["Learners near the award · AQ1"]:::answered',
    '  cp["Credit points held · AQ1"]:::answered',
    '  finish["Share who finish this year · SQ1"]:::suggested',
    '  pass["Pass rate, remaining units"]:::starter',
    '  unit["Can\'t get a unit they need · SQ2"]:::suggested',
    '  credit["Credit recognised"]:::starter',
    '  bach -->|"+"| awards',
    '  gc -->|"+"| awards',
    '  mast -->|"+"| awards',
    '  fy -->|"×"| bach',
    '  bshare -->|"×"| bach',
    '  ret -.->|"drives"| fy',
    '  succ -.->|"drives"| bshare',
    '  nearfin -->|"+"| gc',
    '  far -->|"+"| gc',
    '  near -->|"×"| nearfin',
    '  finish -->|"×"| nearfin',
    '  cp -.->|"drives"| near',
    '  pass -.->|"drives"| finish',
    '  unit -.->|"drives"| finish',
    '  credit -.->|"drives"| finish',
]
PROJECT_TREE_ES = {
    "awards": "Títulos completados", "bach": "Licenciaturas", "gc": "Certificados de posgrado", "mast": "Maestrías y otros títulos",
    "fy": "Estudiantes de último año", "bshare": "Proporción que se titula este año", "ret": "Retención tras el primer año",
    "succ": "Tasa de éxito en el último año", "nearfin": "Terminaron estando cerca del título", "far": "Terminaron desde más lejos",
    "near": "Estudiantes cerca del título", "cp": "Créditos que tienen", "finish": "Proporción que termina este año",
    "pass": "Tasa de aprobación, unidades que faltan", "unit": "No consiguen una unidad que necesitan", "credit": "Créditos reconocidos",
}
PROJECT_SUGGESTED = [  # each suggested question: its row in the questions, its row in what each suggestion says, and in Spanish
    ("| `SQ1` | **Of the learners near a graduate certificate at census, how many finish within the year?** | Share who finish this year | Suggested to Clara Jensen, no answer yet |",
     "| `SQ1` | Planning puts advising where learners are near an award at census. This shows whether it worked, faculty by faculty. | Where to put advising next census | Small: the date each award is conferred, beside what's already counted |",
     ("De los estudiantes cerca de un certificado de posgrado en el censo, ¿cuántos terminan dentro del año?", "Sugerida a Clara Jensen, sin respuesta aún",
      "Planificación pone la asesoría donde hay estudiantes cerca de un título en el censo. Esto muestra si funcionó, facultad por facultad.",
      "Dónde poner la asesoría en el próximo censo", "Pequeña: la fecha en que se otorga cada título, junto a lo que ya se cuenta")),
    ("| `SQ2` | **How many learners near an award can't get a unit they need next term, by faculty?** | Can't get a unit they need | Suggested to Clara Jensen, for Planning and the faculties, no answer yet |",
     "| `SQ2` | It warns before census, while there's still time to put a unit on. Counts only, no names, as `BR3` asks of `AQ1` in [Census planning 2026](../census-planning-2026.md). | Which units to run next term | Medium: learners' study plans and the units on offer, neither read yet |",
     ("¿Cuántos estudiantes cerca de un título no consiguen una unidad que necesitan el próximo periodo, por facultad?",
      "Sugerida a Clara Jensen, para Planificación y las facultades, sin respuesta aún",
      "Avisa antes del censo, cuando aún hay tiempo de abrir una unidad. Solo conteos, sin nombres, como pide `BR3` para `AQ1` en Census planning 2026.",
      "Qué unidades abrir el próximo periodo", "Mediana: los planes de estudio de los estudiantes y las unidades que se ofrecen, ninguno leído todavía")),
    ("| `SQ3` | **Of last year's new bachelor learners who didn't finish, how many came back this year, by faculty?** | Retention after first year | Suggested to Clara Jensen, no answer yet |",
     "| `SQ3` | It's the sector's own retention rate, which the Department of Education publishes for every university, so the definition exists. | Where to put first-year support | Small: enrolments, year on year |",
     ("De los nuevos estudiantes de licenciatura del año pasado que no terminaron, ¿cuántos volvieron este año, por facultad?",
      "Sugerida a Clara Jensen, sin respuesta aún",
      "Es la tasa de retención del propio sector, que el Departamento de Educación publica para cada universidad, así que la definición ya existe.",
      "Dónde poner el apoyo de primer año", "Pequeña: matrículas, año contra año")),
]
PROJECT_STEPS = [
    dict(lane="in", node=("Goal", "Meta"), tag=("Goal", "Meta"), title=("A goal, and its tree", "Una meta, y su árbol"),
         text=("Planning's goal comes first: more learners finish the award they started. Below it hang the questions that show whether it's met, each with a measure, in a tree. This is Goal–Question–Metric. Clara Jensen asked one question herself; the data team keeps the tree with her and suggests first the ones nobody has asked.",
               "Primero está la meta de Planificación: que más estudiantes terminen el título que empezaron. De ella cuelgan las preguntas que muestran si se cumple, cada una con su medida, en un árbol. Es el método Goal–Question–Metric. Clara Jensen hizo una pregunta ella misma; el equipo de datos cuida el árbol con ella y sugiere primero las que nadie ha hecho."),
         passes=("Clara's own question goes to Analytics' records. A suggestion goes there too, once its owner says yes in a ticket.",
                 "La pregunta de Clara va a los registros de Analítica. Una sugerencia también va allí, cuando su responsable dice que sí en un ticket."),
         file=PROJECT_GOAL_FILE, pairs=PROJECT_GOAL_ROWS, tree=True,
         holds=PROJECT_TREE + [line for q, w, _ in PROJECT_SUGGESTED for line in (q, w)]),
    dict(lane="in", node=("Question", "Pregunta"), tag=("AQ1", "AQ1"), title=("A question, born in analytics", "Una pregunta que nace en la analítica"),
         text=("Planning needs to know how many learners are close to a graduate certificate. Most questions arrive with no known answer; this one had only a count by hand. Analytics records it: who asks, what's known of the answer and who will check the result.",
               "Planificación necesita saber cuántos estudiantes están cerca de un certificado de posgrado. La mayoría de las preguntas llegan sin respuesta conocida; esta solo tenía un conteo a mano. Analítica la registra: quién pregunta, qué se sabe de la respuesta y quién revisará el resultado."),
         passes=("An initiative takes it on, as a business requirement.", "Una iniciativa la asume, como un requisito del negocio."),
         file="../00-initiatives/analytics-questions.md",
         rows=["| ID | The question | Asked by | Known when asked | Checked by | Initiative | Ticket |",
               "| `AQ1` | **How many learners are within 15 credit points of a graduate certificate, by faculty, as at census date?** | Clara Jensen, Planning | The census team's count, by hand, two weeks after census day | Clara Jensen, in test, against the census team's count | [Census planning 2026](census-planning-2026.md) | `DATA-142` |"]),
    dict(lane="in", node=("Ticket", "Ticket"), tag=("DATA-142", "DATA-142"), title=("An initiative, and its ticket", "Una iniciativa, y su ticket"),
         text=("The initiative Census planning 2026 turns the question into business requirements, in a Jira ticket. Planning approves the ticket, and closes it only once it has checked the result.",
               "La iniciativa Census planning 2026 convierte la pregunta en requisitos del negocio, en un ticket de Jira. Planificación aprueba el ticket, y lo cierra solo cuando ha revisado el resultado."),
         passes=("With the question in hand, the architecture finds what it needs.", "Con la pregunta en la mano, la arquitectura encuentra lo que necesita."),
         file="../00-initiatives/census-planning-2026.md",
         rows=["| ID | Business requirement | Question | Ticket | Accepted when |",
               "| `BR1` | **Count the learners within 15 credit points of a graduate certificate, by faculty, as at census date** | `AQ1` | `DATA-142` | Clara Jensen has checked the numbers in test, against the census team's count |"]),
    dict(lane="ea", node=("Data objects", "Objetos de datos"), tag=("DOBJ2.1", "DOBJ2.1"), title=("What the question needs", "Lo que la pregunta necesita"),
         text=("The architecture finds the question's domain, Student, and the data objects it needs: Learner, and the credit each learner holds towards an award. It records the question as driver DRV1, in the same words.",
               "La arquitectura encuentra el dominio de la pregunta, Student, y los objetos de datos que necesita: Learner, y los créditos que cada estudiante tiene para un título. Registra la pregunta como el impulsor DRV1, con las mismas palabras."),
         passes=("Each data object maps to a glossary entity, in data governance.", "Cada objeto de datos se asocia a una entidad del glosario, en gobierno de datos."),
         file="../10-enterprise-architecture/architecture/3_information/1_data-domains-and-objects.md",
         rows=["| ID | Data object | Needed by | Recorded first in | Shared table | Source |",
               "| `DOBJ2.1` | **Learner**: anyone who has learned with the university, in any system | `DRV1`, `DRV2`, `DRV8` | `ACMP1` | `30-data-project/models/core/student/core_learner.sql` | `20-data-governance/5-data-contracts/core_learner_v1.yaml` |"],
         std=("ArchiMate's elements", "Los elementos de ArchiMate")),
    dict(lane="ea", node=("Systems", "Sistemas"), tag=("ACMP1", "ACMP1"), title=("Where it's born", "Dónde nace"),
         text=("A learner is recorded first in the student system, the system of record, and copied in the learning platform and the short-courses system. The architecture keeps which entities each application holds.",
               "Un estudiante se registra primero en el sistema de estudiantes, el sistema de registro, y se copia en la plataforma de aprendizaje y en el sistema de cursos cortos. La arquitectura guarda qué entidades tiene cada aplicación."),
         passes=("The three systems are the dbt project's sources.", "Los tres sistemas son las fuentes del proyecto de dbt."),
         file="../10-enterprise-architecture/architecture/4_application/1_realization-register.md",
         rows=["| ID | Application component | Serves | Specification | Realized by |",
               "| `ACMP1` | **Student system**: learners, awards, enrolments, graduations | `BSVC1`, `BSVC2`, `BSVC3`, `BSVC4` | The vendor's; the project reads it as a source | `30-data-project/sources/student_system/` |"],
         std=("ArchiMate's elements", "Los elementos de ArchiMate")),
    dict(lane="dg", node=("Glossary", "Glosario"), tag=("Glossary", "Glosario"), title=("What the words mean", "Qué significan las palabras"),
         text=("Each data object maps to a glossary entity that data governance manages, owned by the area that answers for the data. Learner means anyone who has learned with the university, in any of its systems. The registrar's office owns the student domain, so Mei Tanaka, of that office, owns the term.",
               "Cada objeto de datos se asocia a una entidad del glosario que gestiona gobierno de datos, y su responsable es el área que responde por esos datos. Learner es toda persona que ha aprendido con la universidad, en cualquiera de sus sistemas. La oficina de registro es responsable del dominio de estudiantes, así que Mei Tanaka, de esa oficina, es la responsable del término."),
         passes=("The data project copies the definition into its conceptual model, with its source. The glossary sync fails on any drift.",
                 "El proyecto de datos copia la definición en su modelo conceptual, con su fuente. La sincronización del glosario falla ante cualquier desvío."),
         file="governance/1-glossary/business-glossary.yml",
         code=[(49, ["- term: Learner",
                     "  definition: 'A person the university has recorded learning with it, in any of its systems: a student",
                     "    of an award, a learning platform user, or a short-course customer.'",
                     "  owner: Mei Tanaka, registrar's office",
                     "  updated_on: '2026-11-16'"])], hi=(49, 52), std=None),
    dict(lane="dg", node=("Contract", "Contrato"), tag=("ODCS", "ODCS"), title=("The core entity, under contract", "La entidad central, con contrato"),
         text=("The glossary entity maps to a core entity, core_learner, which every team shares. Data governance's information architect writes its enterprise contract first, in the Open Data Contract Standard: columns, keys, each column's class and known limits.",
               "La entidad del glosario se asocia a una entidad central, core_learner, que comparten todos los equipos. El arquitecto de información de gobierno de datos escribe primero su contrato empresarial, en el Open Data Contract Standard: columnas, claves, la clase de cada columna y sus límites conocidos."),
         passes=("The data team builds core_learner to it. A check fails if the two differ, and a change that breaks a reader needs a new version.",
                 "El equipo de datos construye core_learner según él. Una verificación falla si difieren, y un cambio que rompe a un lector necesita una versión nueva."),
         file="governance/5-data-contracts/core_learner_v1.yaml",
         code=[(3, ["apiVersion: v3.1.0", "kind: DataContract", "id: 7f4e3b17-5f84-50e5-8580-d6f86325f4da", "name: core_learner_v1",
                    "version: 1.0.0", "status: active", "domain: student", "dataProduct: learner_records"]),
               (56, ["  - name: learner_bk", "    logicalType: string", "    physicalType: string", "    required: true", "    classification: direct"])],
         hi=(3, 7, 60), std=("Open Data Contract Standard 3.1.0", "Open Data Contract Standard 3.1.0")),
    dict(lane="dp", node=("Build", "Construir"), tag=("dbt", "dbt"), title=("Built up to the core", "Construido hasta el núcleo"),
         text=("The data team builds what it takes to reach the contract, in dbt's layers. How it starts depends on what's already there.",
               "El equipo de datos construye lo necesario para llegar al contrato, en las capas de dbt. Cómo empieza depende de lo que ya existe."),
         paths=dict(label=("Where the build starts", "Dónde empieza la construcción"),
                    new=(("Nothing built yet", "Aún no hay nada"),
                         ("From the sources: each system's tables staged, one learner matched across systems, and core_learner built to its contract.",
                          "Desde las fuentes: las tablas de cada sistema preparadas, cada estudiante reconocido en todos los sistemas, y core_learner construido según su contrato.")),
                    exists=(("Models already exist", "Ya hay modelos"),
                            ("No core entity defined yet: the team checks first what the existing models do, then adds core_learner on top of their staging and intermediate models, and doesn't start again from the sources.",
                             "Aún no hay una entidad central: el equipo revisa primero qué hacen los modelos que existen, luego agrega core_learner encima de sus modelos de staging e intermedios, y no empieza otra vez desde las fuentes.")),
                    built=("Built before", "Ya existía"), top=("Added on top", "Se agrega encima")),
         passes=("Each model carries its owner, its glossary term and each column's class, so the platform's catalog shows them too.",
                 "Cada modelo lleva su responsable, su término del glosario y la clase de cada columna, así que el catálogo de la plataforma también los muestra."),
         file="models/core/student/_core_student__models.yml",
         code=[(3, ["  - name: core_learner", "    description: >", "      What the model knows about a learner from valid_from until valid_to.",
                    "      {{ doc(\"learner\") }}", "    latest_version: 1", "    config:", "      meta:", "        grain: One row per learner per version",
                    "        owner: Mei Tanaka, registrar's office", "        domain: student", "        glossary_term: learner"])],
         hi=(11, 13), std=("dbt", "dbt"), more=("layers", ("Follow one learner through the layers", "Sigue a una persona por las capas"))),
    dict(lane="dg", node=("Product", "Producto"), tag=("ODPS", "ODPS"), title=("What Planning is promised", "Qué se le promete a Planificación"),
         text=("The answer is a data product, Learners near an award, built on core_learner. Clara Jensen, of Planning, owns it. It's built every night, and ready by 7 a.m. on census day, as the ticket asked.",
               "La respuesta es un producto de datos, Learners near an award, construido sobre core_learner. Clara Jensen, de Planificación, es su responsable. Se construye cada noche y está listo a las 7 a. m. el día del censo, como pidió el ticket."),
         passes=("A script writes its descriptor in the Open Data Product Standard, from this file and the dbt models. CI fails if it's out of date.",
                 "Un script escribe su descriptor en el Open Data Product Standard, desde este archivo y los modelos de dbt. La integración continua falla si está desactualizado."),
         file="governance/4-data-products/learners_near_an_award.yml",
         code=[(6, ["name: learners_near_an_award", "title: Learners near an award", "owner: \"Clara Jensen, Planning\"", "domain: planning"]),
               (18, ["outputs:", "  - {model: mart_planning__near_award}", "service_levels:",
                     "  - {property: latency, value: 1, unit: d, description: Built every night.}",
                     "  - {property: timeOfAvailability, value: \"07:00\", description: Ready by 7 a.m. on census day.}"])],
         hi=(8, 22), std=("Open Data Product Standard 1.0.0", "Open Data Product Standard 1.0.0")),
    dict(lane="dg", node=("Metric", "Métrica"), tag=("Ossie", "Ossie"), title=("How it's counted, once", "Cómo se cuenta, una sola vez"),
         text=("Its owner defines the measure once, in Apache Ossie, an open format no tool owns: each learner counted once, and only near a graduate certificate.",
               "Su responsable define la medida una sola vez, en Apache Ossie, un formato abierto que no es de ninguna herramienta: cada estudiante contado una vez, y solo cerca de un certificado de posgrado."),
         passes=("dbt's semantic layer builds the same metric. A check fails if it names another measure or filter.",
                 "La capa semántica de dbt construye la misma métrica. Una verificación falla si nombra otra medida u otro filtro."),
         file="governance/11-metrics/learners_near_an_award.ossie.yaml",
         code=[(38, ["    metrics:",
                     "      - name: learners_near_graduate_certificate",
                     "        description: >",
                     "          Planning's question: learners studying for a graduate certificate and within 15 credit",
                     "          points of it, as at census date. By faculty for the answer by faculty.",
                     "        expression:",
                     "          dialects:",
                     "            - dialect: ANSI_SQL",
                     "              expression: >-",
                     "                COUNT(DISTINCT near_award.learner_key) FILTER (WHERE near_award.is_near_award",
                     "                AND near_award.award_type = 'graduate certificate')"])],
         hi=(39, 47, 48), std=("Apache Ossie 0.1.1", "Apache Ossie 0.1.1")),
    dict(lane="dp", node=("Validated", "Validado"), tag=("In test", "En prueba"), title=("Explored, then checked", "Explorado, y luego revisado"),
         text=("While the work is built, the team explores the answer in development, with personal data masked, and tests say what any right answer must meet. Then Planning checks the numbers in test. Here the count by hand existed, so one more test holds the mart to it, faculty by faculty.",
               "Mientras se construye, el equipo explora la respuesta en desarrollo, con los datos personales enmascarados, y las pruebas dicen lo que toda respuesta correcta debe cumplir. Luego Planificación revisa los números en prueba. Aquí existía el conteo a mano, así que otra prueba sostiene el mart contra él, facultad por facultad."),
         passes=("Once Planning agrees, the test keeps those numbers, so no later change moves them unseen.",
                 "Cuando Planificación está de acuerdo, la prueba guarda esos números, así que ningún cambio posterior los mueve sin que se note."),
         file="tests/reconciliation/_reconciliation__tests.yml",
         code=[(3, ["  - name: reconcile_planning_with_census_report",
                    "    description: >",
                    "      The Planning mart gives the census team's published number, faculty by faculty. If it",
                    "      doesn't, the mart is wrong or the report is; either way, nobody ships until someone knows",
                    "      which. The mart applies identity as it's known today: the census team matched two",
                    "      learners by hand in April, and the registrar's office recorded those matches as D-001 and",
                    "      D-002 in October (LIM-PLN-01 on mart_planning__near_award).",
                    "    config:",
                    "      meta: {owner: Planning, dimension: accuracy, reference: \"the census team's published report\"}"])],
         hi=(3, 11), std=("dbt tests", "Pruebas de dbt")),
    dict(lane="dp", node=("Dashboard", "Tablero"), tag=("Exposure", "Exposición"), title=("Who reads it", "Quién lo lee"),
         text=("The census dashboard reads the metric. dbt knows it as an exposure, so a change that reaches it names Planning before it merges. The answer goes back to the question, and the ticket closes.",
               "El tablero del censo lee la métrica. dbt lo conoce como una exposición, así que un cambio que lo alcanza nombra a Planificación antes de fusionarse. La respuesta vuelve a la pregunta, y el ticket se cierra."),
         passes=("12 learners, in four faculties.", "12 estudiantes, en cuatro facultades."),
         file="exposures/planning/_planning__exposures.yml",
         code=[(3, ["  - name: census_dashboard", "    label: Census dashboard", "    type: dashboard", "    maturity: high"]),
               (10, ["    owner:", "      name: Planning", "      email: planning@uni.example", "    depends_on:",
                     "      - ref('mart_planning__near_award')", "      - metric('learners_near_graduate_certificate')"])],
         hi=(3, 15), std=("dbt exposures", "Exposiciones de dbt"), answer=True),
]
# The eight questions a newcomer asks about Planning's number: what a dbt project alone has, and the piece of context that answers
# each (dbt: answered by the project alone). The switches add each piece; their lanes colour them.
PROJECT_PIECES = [("q", "in", ("The question", "La pregunta"), "00"), ("g", "dg", ("Glossary", "Glosario"), "20"),
                  ("o", "dg", ("Owners and classes", "Responsables y clases"), "20"), ("c", "dg", ("Contract", "Contrato"), "ODCS"),
                  ("p", "dg", ("Product", "Producto"), "ODPS"), ("m", "dg", ("Metric", "Métrica"), "Ossie"), ("a", "dg", ("Mandate", "Mandato"), "20")]
PROJECT_ASKS = [
    ("dbt", ("How is it built, and is it tested?", "¿Cómo se construye, y está probado?"),
     ("Its SQL, its lineage back to each source and its tests are all in the project.", "Su SQL, su linaje hasta cada fuente y sus pruebas están en el proyecto."),
     None, ("30 · dbt", "30 · dbt"), "models/marts/planning/mart_planning__near_award.sql"),
    ("q", ("Who asked for it, and why?", "¿Quién lo pidió, y para qué?"),
     ("A model's description, if someone wrote one.", "La descripción de un modelo, si alguien la escribió."),
     ("Planning, for the census and for its goal: more learners finish the award they started. Analytics recorded the question as AQ1, and the initiative Census planning 2026 carries it in ticket DATA-142.",
      "Planificación, para el censo y para su meta: que más estudiantes terminen el título que empezaron. Analítica registró la pregunta como AQ1, y la iniciativa Census planning 2026 la lleva en el ticket DATA-142."),
     ("00 · Analytics’ records", "00 · Registros de Analítica"), "../00-initiatives/analytics-questions.md"),
    ("g", ("What counts as an award?", "¿Qué cuenta como un título?"),
     ("A column description, written model by model, maybe differently in each.", "Una descripción de columna, escrita modelo por modelo, quizá distinta en cada uno."),
     ("One meaning, from the business glossary: a qualification for a set number of credit points, such as a graduate certificate. Mei Tanaka owns it.",
      "Un solo significado, del glosario del negocio: una titulación por un número fijo de créditos, como un certificado de posgrado. Su responsable es Mei Tanaka."),
     ("20 · Glossary", "20 · Glosario"), "governance/1-glossary/business-glossary.yml"),
    ("o", ("May a dashboard show learners' student IDs?", "¿Puede un tablero mostrar los números de estudiante?"),
     ("Nothing in the project says.", "Nada en el proyecto lo dice."),
     ("No. The learner asset is confidential, and a student ID is direct personal data. On Databricks it's masked for anyone not allowed to read it.",
      "No. El activo de estudiantes es confidencial, y un número de estudiante es un dato personal directo. En Databricks queda enmascarado para quien no tenga permiso de leerlo."),
     ("20 · Information assets", "20 · Activos de información"), "governance/9-information-assets/information-assets.yml"),
    ("c", ("If the shared learner table changes, what keeps my numbers safe?", "Si cambia la tabla compartida de estudiantes, ¿qué protege mis números?"),
     ("The model's own dbt contract, if it has one. It can change in the same pull request as the code.",
      "El contrato de dbt del propio modelo, si lo tiene. Puede cambiar en el mismo pull request que el código."),
     ("An enterprise contract in ODCS, written first by data governance. A check fails if the model differs, and a breaking change needs a new version.",
      "Un contrato empresarial en ODCS, escrito primero por gobierno de datos. Una verificación falla si el modelo difiere, y un cambio que rompe necesita una versión nueva."),
     ("20 · Contract, ODCS", "20 · Contrato, ODCS"), "governance/5-data-contracts/core_learner_v1.yaml"),
    ("p", ("When is it ready, and who answers for it?", "¿Cuándo está listo, y quién responde por él?"),
     ("When the job finishes. An owner tag, if anyone added one.", "Cuando termina el trabajo. Una etiqueta de responsable, si alguien la puso."),
     ("Ready by 7 a.m. on census day, built every night. Clara Jensen, of Planning, owns the product, with a channel for issues.",
      "Listo a las 7 a. m. del día del censo, construido cada noche. Clara Jensen, de Planificación, es responsable del producto, con un canal para problemas."),
     ("20 · Product, ODPS", "20 · Producto, ODPS"), "governance/4-data-products/learners_near_an_award.yml"),
    ("m", ("Is it counted the same way in every tool?", "¿Se cuenta igual en cada herramienta?"),
     ("Each tool keeps its own copy of the formula.", "Cada herramienta guarda su propia copia de la fórmula."),
     ("Yes. It's defined once, in Apache Ossie, and built from there into dbt's semantic layer. A check fails if dbt's version differs.",
      "Sí. Se define una vez, en Apache Ossie, y desde ahí se construye en la capa semántica de dbt. Una verificación falla si la versión de dbt difiere."),
     ("20 · Metric, Apache Ossie", "20 · Métrica, Apache Ossie"), "governance/11-metrics/learners_near_an_award.ossie.yaml"),
    ("a", ("May an AI agent change it on its own?", "¿Puede un agente de IA cambiarlo por su cuenta?"),
     ("Whatever its credentials allow.", "Lo que permitan sus credenciales."),
     ("No. An agent works alone only under a signed mandate, in test, in its own folders. No mandate covers Planning's models, and in production agents only read, with personal and sensitive data masked.",
      "No. Un agente trabaja solo únicamente bajo un mandato firmado, en prueba, en sus propias carpetas. Ningún mandato cubre los modelos de Planificación, y en producción los agentes solo leen, con los datos personales y sensibles enmascarados."),
     ("20 · Mandates", "20 · Mandatos"), "governance/8-mandates/"),
]
# The data project's seven layers, and one learner (S-20417) through them to Planning's count, as the project builds it
# (dbt build on DuckDB, 15 November 2026): three systems, three keys matched to one learner and one kept apart by decision D-003;
# 30 credit points from units and 15 from microcredentials on census date, 45 of 60, so near the award; one of Engineering and
# IT's 5. Without the short course's match: 40, 20 to go, not near, and the reconciliation with the census report would fail.
PROJECT_LAYERS = [
    dict(key="sources", name=("Sources", "Fuentes"), tag=None,
         job=("What comes in, as each system sends it, with its keys, freshness and known limits.", "Lo que llega, tal como lo envía cada sistema, con sus claves, su frescura y sus límites conocidos."),
         paths=["sources/student_system/", "sources/learning_platform/", "sources/short_courses/"],
         access=("Read only by staging", "Solo las lee staging"),
         promise=("Each source says how fresh it must be, who owns it and what it gets wrong. On the platform, staff type the student ID in by hand: often missing, sometimes wrong.",
                  "Cada fuente dice qué tan fresca debe estar, de quién es y en qué se equivoca. En la plataforma, el personal escribe el número de estudiante a mano: a menudo falta, y a veces está mal.")),
    dict(key="staging", name=("Staging", "Staging"), tag=None,
         job=("One model per table: rename, cast, and give every row a key that names its system.", "Un modelo por tabla: renombrar, tipar y dar a cada fila una clave que nombra su sistema."),
         paths=["models/staging/student_system/", "models/staging/learning_platform/", "models/staging/short_courses/"],
         access=("Private: only the project's own models read it", "Privada: solo la leen los modelos del propio proyecto"),
         promise=("No contract: nobody outside the project reads it.", "Sin contrato: nadie fuera del proyecto la lee.")),
    dict(key="intermediate", name=("Intermediate", "Intermedia"), tag=None,
         job=("One learner across every system, and one timeline of what was true when.", "Un estudiante en todos los sistemas, y una línea de tiempo de qué era cierto y cuándo."),
         paths=["models/intermediate/student/int_learner_keys_matched.sql", "models/intermediate/student/int_learner_timeline.sql"],
         access=("Private: only the project's own models read it", "Privada: solo la leen los modelos del propio proyecto"),
         promise=("Who is the same learner is a rule in the conceptual model, and a decision the registrar's office records beats every rule.",
                  "Quién es el mismo estudiante es una regla del modelo conceptual, y una decisión que registra la oficina de registro le gana a cualquier regla.")),
    dict(key="core", name=("Core", "Central"), tag="ODCS",
         job=("One table per entity, shared by every team, built to its enterprise contract.", "Una tabla por entidad, compartida por todos los equipos, construida según su contrato empresarial."),
         paths=["models/core/student/core_learner.sql", "models/core/student/core_credit_towards_award.sql"],
         access=("Public: any team may build on it, by version", "Pública: cualquier equipo puede construir sobre ella, por versión"),
         promise=("An enterprise contract in ODCS, written first by data governance and enforced in the build.",
                  "Un contrato empresarial en ODCS, escrito primero por gobierno de datos y exigido en la construcción.")),
    dict(key="marts", name=("Marts", "Marts"), tag="ODPS",
         job=("One per consumer team. Planning's holds what each learner held on census date.", "Uno por equipo consumidor. El de Planificación guarda lo que cada estudiante tenía en la fecha del censo."),
         paths=["models/marts/planning/mart_planning__near_award.sql"],
         access=("Protected: built for Planning, and on Databricks read only by the groups Planning names", "Protegido: construido para Planificación, y en Databricks lo leen solo los grupos que nombra Planificación"),
         promise=("A contract agreed with Planning, team to team, and the data product in ODPS.", "Un contrato acordado con Planificación, de equipo a equipo, y el producto de datos en ODPS.")),
    dict(key="metrics", name=("Metrics", "Métricas"), tag="Ossie",
         job=("Each measure built from its one definition.", "Cada medida construida desde su única definición."),
         paths=["models/marts/planning/_planning__semantic.yml"],
         access=("Read through dbt's semantic layer", "Se lee por la capa semántica de dbt"),
         promise=("Defined in Apache Ossie by its owner. A check holds dbt's metric to it.", "Definida en Apache Ossie por su responsable. Una verificación sostiene la métrica de dbt contra ella.")),
    dict(key="exposures", name=("Exposures", "Exposiciones"), tag=None,
         job=("Who reads each output: dashboards, apps, exports and agents.", "Quién lee cada resultado: tableros, aplicaciones, exportaciones y agentes."),
         paths=["exposures/planning/_planning__exposures.yml"],
         access=("Each with an owner, told before a change reaches it", "Cada una con un responsable, avisado antes de que un cambio la alcance"),
         promise=("Checked by Planning in test before anything ships, and held to the census team's count, faculty by faculty.",
                  "Revisado por Planificación en prueba antes de que algo salga, y sostenido contra el conteo del equipo del censo, facultad por facultad.")),
]
# The three open standards, each opened on its real file: who writes it, what it holds, where it lands in dbt, and notes that light
# their lines (first line: the lines it lights, and what they say)
PROJECT_STANDARDS = [
    dict(name=("Data contract", "Contrato de datos"), std="Open Data Contract Standard 3.1.0", short="ODCS 3.1.0",
         who=("Data governance's information architect, first, and only for canonical tables. The data team builds the model to it.",
              "El arquitecto de información de gobierno de datos, primero, y solo para las tablas canónicas. El equipo de datos construye el modelo según él."),
         holds=("Columns, keys, each column's class, known limits and a version.", "Columnas, claves, la clase de cada columna, límites conocidos y una versión."),
         lands=("The core model's enforced dbt contract. A script fails if the two differ.", "El contrato de dbt exigido del modelo central. Un script falla si difieren."),
         file="governance/5-data-contracts/core_learner_v1.yaml",
         code=[(3, ["apiVersion: v3.1.0", "kind: DataContract", "id: 7f4e3b17-5f84-50e5-8580-d6f86325f4da", "name: core_learner_v1",
                    "version: 1.0.0", "status: active", "domain: student", "dataProduct: learner_records"]),
               (46, ["  properties:", "  - name: learner_key", "    logicalType: string", "    physicalType: string", "    required: true",
                     "    classification: pseudonymous", "    primaryKey: true"]),
               (56, ["  - name: learner_bk", "    logicalType: string", "    physicalType: string", "    required: true", "    classification: direct"])],
         notes={3: ((3,), ("The standard and its version: the Open Data Contract Standard 3.1.0.", "El estándar y su versión: el Open Data Contract Standard 3.1.0.")),
                5: ((5,), ("The contract's id. A data product names it to say exactly what it reads.", "El id del contrato. Un producto de datos lo nombra para decir exactamente qué lee.")),
                7: ((7,), ("Its version. A change that breaks a reader becomes a new version, beside this one.", "Su versión. Un cambio que rompe a un lector se vuelve una versión nueva, junto a esta.")),
                10: ((10,), ("The product it belongs to: learner records, owned by the registrar's office.", "El producto al que pertenece: learner records, de la oficina de registro.")),
                52: ((47, 52), ("The key: the learner's hash key, the same in every model, on every engine.", "La clave: la clave hash del estudiante, la misma en cada modelo, en cada motor.")),
                60: ((56, 60), ("Each column's class. The business key is direct personal data, so on Databricks it's masked for anyone not allowed to read it.",
                                "La clase de cada columna. La clave de negocio es un dato personal directo, así que en Databricks queda enmascarada para quien no tenga permiso de leerla."))}),
    dict(name=("Data product", "Producto de datos"), std="Open Data Product Standard 1.0.0", short="ODPS 1.0.0",
         who=("The product's owner, in a file of their own. A script writes this descriptor from it and the dbt models.",
              "El responsable del producto, en un archivo propio. Un script escribe este descriptor desde él y los modelos de dbt."),
         holds=("Owner, purpose, what it reads by contract, what it serves, support and who reads it.", "Responsable, propósito, qué lee por contrato, qué sirve, soporte y quién lo lee."),
         lands=("Planning's mart, and the exposures that read it.", "El mart de Planificación, y las exposiciones que lo leen."),
         file="governance/6-product-descriptors/learners_near_an_award.yaml",
         code=[(1, ["# Generated by scripts/generate/products.py from 20-data-governance/4-data-products/learners_near_an_award.yml and the dbt models. Don't edit it:",
                    "# change those, then run the script. CI fails if it's out of date.", "apiVersion: v1.0.0", "kind: DataProduct",
                    "id: 9142b409-57dc-5f1c-a585-2512dff30787", "name: Learners near an award", "version: 1.0.0", "status: active", "domain: planning"]),
               (16, ["inputPorts:", "- name: core_learner_v1", "  version: 1.0.0", "  contractId: 7f4e3b17-5f84-50e5-8580-d6f86325f4da"]),
               (26, ["outputPorts:", "- name: mart_planning__near_award"]),
               (32, ["team:", "  name: Clara Jensen, Planning"]),
               (43, ["customProperties:", "- property: consumers", "  value:", "  - exposure census_dashboard"])],
         notes={1: ((1, 2), ("Written by a script, from the owner's file and the dbt models. Nobody edits it, and CI fails if it's out of date.",
                             "Lo escribe un script, desde el archivo del responsable y los modelos de dbt. Nadie lo edita, y la integración continua falla si está desactualizado.")),
                3: ((3,), ("The standard and its version: the Open Data Product Standard 1.0.0.", "El estándar y su versión: el Open Data Product Standard 1.0.0.")),
                19: ((17, 19), ("What it reads: the shared learner table, by its contract's id, the same as in the contract.", "Qué lee: la tabla compartida de estudiantes, por el id de su contrato, el mismo que en el contrato.")),
                27: ((27,), ("What it serves: Planning's mart.", "Qué sirve: el mart de Planificación.")),
                33: ((33,), ("Who owns it, and answers for it.", "Quién es su responsable, y responde por él.")),
                46: ((46,), ("Who reads it, taken from dbt's exposures.", "Quién lo lee, tomado de las exposiciones de dbt."))}),
    dict(name=("Metric", "Métrica"), std="Apache Ossie 0.1.1", short="Ossie 0.1.1",
         who=("Each measure's owner, once: here Clara Jensen, for Planning.", "El responsable de cada medida, una vez: aquí Clara Jensen, para Planificación."),
         holds=("The dataset, its fields, each measure's expression, and context for AI.", "El conjunto de datos, sus campos, la expresión de cada medida y contexto para la IA."),
         lands=("dbt's semantic layer. A check holds dbt's metric to this definition.", "La capa semántica de dbt. Una verificación sostiene la métrica de dbt contra esta definición."),
         file="governance/11-metrics/learners_near_an_award.ossie.yaml",
         code=[(6, ["version: \"0.1.1\"", "semantic_model:", "  - name: learners_near_an_award"]),
               (12, ["    ai_context:", "      instructions: >", "        Count learners once each. The numbers are as at census date and reconcile with the census",
                     "        report. Group by faculty for Planning's answer.", "    datasets:", "      - name: near_award",
                     "        source: marts.mart_planning__near_award"]),
               (38, ["    metrics:", "      - name: learners_near_graduate_certificate", "        description: >",
                     "          Planning's question: learners studying for a graduate certificate and within 15 credit",
                     "          points of it, as at census date. By faculty for the answer by faculty.", "        expression:", "          dialects:",
                     "            - dialect: ANSI_SQL", "              expression: >-",
                     "                COUNT(DISTINCT near_award.learner_key) FILTER (WHERE near_award.is_near_award",
                     "                AND near_award.award_type = 'graduate certificate')"]),
               (51, ["        custom_extensions:", "          - vendor_name: DBT"])],
         notes={6: ((6,), ("Apache Ossie, version 0.1.1: an open format for semantic models.", "Apache Ossie, versión 0.1.1: un formato abierto para modelos semánticos.")),
                13: ((12, 15), ("Context for AI: how an assistant should use it. Count each learner once.", "Contexto para la IA: cómo debe usarlo un asistente. Contar a cada estudiante una vez.")),
                18: ((18,), ("Where its data comes from: Planning's mart.", "De dónde vienen sus datos: el mart de Planificación.")),
                47: ((47, 48), ("The measure itself: each learner once, only near a graduate certificate.", "La medida misma: cada estudiante una vez, solo cerca de un certificado de posgrado.")),
                52: ((51, 52), ("How dbt builds it: the same measure, aggregation and filter, written for dbt.", "Cómo la construye dbt: la misma medida, agregación y filtro, escritos para dbt."))}),
]
# Every handoff, and the check that holds it: change one side, and it fails
PROJECT_HANDOFFS = [
    ("in", ("Question AQ1, in Analytics’ records", "Pregunta AQ1, en los registros de Analítica"), "ea", ("Driver DRV1, in the same words", "Impulsor DRV1, con las mismas palabras"),
     ("The questions check", "La verificación de preguntas"), "../10-enterprise-architecture/scripts/check_questions.py",
     ("Analytics rewords the question.", "Analítica cambia las palabras de la pregunta."),
     ("The architecture's check fails until its driver says the same.", "La verificación de la arquitectura falla hasta que su impulsor diga lo mismo.")),
    ("ea", ("Data object: Learner", "Objeto de datos: Learner"), "dg", ("Information asset, with its owner", "Activo de información, con su responsable"),
     ("Governance's check", "La verificación de gobierno"), "governance/scripts/check.py",
     ("The data object is renamed on the map.", "El objeto de datos cambia de nombre en el mapa."),
     ("Governance's check fails: the asset names a data object the map no longer has.", "La verificación de gobierno falla: el activo nombra un objeto de datos que el mapa ya no tiene.")),
    ("dg", ("Glossary term: Learner", "Término del glosario: Learner"), "dp", ("The conceptual model's copy, with its source", "La copia del modelo conceptual, con su fuente"),
     ("The glossary sync", "La sincronización del glosario"), "skills/sync-the-glossary/sync_glossary.py",
     ("The glossary changes the definition.", "El glosario cambia la definición."),
     ("The sync finds the drift, fails, and reports every model and owner it reaches.", "La sincronización encuentra el desvío, falla y reporta cada modelo y responsable que alcanza.")),
    ("dg", ("Enterprise contract: core_learner v1", "Contrato empresarial: core_learner v1"), "dp", ("core_learner, its contract enforced", "core_learner, con su contrato exigido"),
     ("The products script", "El script de productos"), "scripts/generate/products.py",
     ("A column is dropped from the model.", "Se quita una columna del modelo."),
     ("The script fails: the model no longer matches its contract. The contract changes first, as a new version.",
      "El script falla: el modelo ya no coincide con su contrato. El contrato cambia primero, como una versión nueva.")),
    ("dg", ("Data product: Learners near an award", "Producto de datos: Learners near an award"), "dp", ("Its descriptor, in ODPS", "Su descriptor, en ODPS"),
     ("The products script, in CI", "El script de productos, en la integración continua"), "scripts/generate/products.py",
     ("The product's file changes, and nobody runs the script.", "Cambia el archivo del producto y nadie corre el script."),
     ("CI fails: the descriptor is out of date.", "La integración continua falla: el descriptor está desactualizado.")),
    ("dg", ("Metric, in Apache Ossie", "Métrica, en Apache Ossie"), "dp", ("dbt's semantic layer", "La capa semántica de dbt"),
     ("The check against governance", "La verificación contra gobierno"), "scripts/check/from_governance.py",
     ("Someone edits the metric's filter in dbt only.", "Alguien edita el filtro de la métrica solo en dbt."),
     ("The check fails: dbt's metric no longer matches its definition.", "La verificación falla: la métrica de dbt ya no coincide con su definición.")),
    ("dg", ("Agent mandate", "Mandato de agente"), "dp", ("The agent's grants and tools", "Los permisos y herramientas del agente"),
     ("The mandates check", "La verificación de mandatos"), "scripts/check/mandates.py",
     ("A grant lets the agent write outside its own schemas.", "Un permiso deja al agente escribir fuera de sus propios esquemas."),
     ("The check fails: a tool allows more than the mandate.", "La verificación falla: una herramienta permite más que el mandato.")),
]
PROJECT_UI = {
    "en": dict(
        jump="On this page", follow="Follow one question",
        jumps=[("journey", "The map"), ("context", "What dbt alone misses"), ("standards", "Open standards"), ("run", "Run it")],
        j_h="Follow one question",
        j_p="A goal comes first, with the questions that show whether it's met. A question starts in analytics, usually with no answer yet, and an initiative carries it into a ticket. The architecture finds what it needs, data governance says what its words mean and what is promised, and the dbt project builds it. Press Play, or pick any piece of the map.",
        asks="Planning asks", question="How many learners are within 15 credit points of a graduate certificate, by faculty, as at census date?",
        answer="Answer", steps="Twelve steps, from the goal to the answer", goal_k="Goal · Planning",
        tree="Its measures, as a tree", t_legend=[("ok", "Answered"), ("in", "Suggested"), ("st", "Not asked yet")],
        t_f="A formula", t_d="A driver, checked in the data", t_hint="Pick a question in the tree to see it.",
        t_add="adds to the measure above", t_mul="multiplies into the measure above", t_drv="drives the measure above, with no formula",
        t_why="Why now", t_dec="The decision it informs", t_size="Size, when suggested", t_aq="Asked by Clara Jensen: the next step follows it",
        t_yes="If Clara says yes in a ticket, the question takes the next AQ number and follows the steps after this one.",
        play="Play", pause="Pause", again="Play again", back="Back", next="Next", step="Step {n} of {of}",
        passes="Passes on", result="The answer", open="Open the file", std="Standard", left="lines left out", left1="line left out",
        chart="Learners near a graduate certificate, as at 31 March 2026", total="In all",
        ok="Matches the census team’s report, faculty by faculty",
        map="The example project’s map", pieces="The map’s pieces",
        map_d="A map of the example project, in four folders, read in a loop. At the top right, the initiatives: Planning’s goal, its question in Analytics’ records, and the ticket that carries it. At the top left, the enterprise architecture: the data object the question needs, Learner, and the student system, where it’s recorded first. In the middle, data governance: the information asset and its owner, the glossary’s Learner, the contract for the shared learner table, Planning’s data product, the metric and agents’ mandates, each beside the layer of the dbt project it lands on. Then the dbt project’s seven layers, from three systems to the census dashboard, which gives the answer, 12 learners, back to the question.",
        show="Show", lenses=[("learner", "dp", "One learner"), ("owners", "dg", "Owners"), ("pii", "dg", "Personal data"), ("promises", "dg", "Promises"), ("checks", "ok", "Checks")],
        lens_p={"learner": "Learner S-20417, from three systems to Planning’s count: what each layer holds of them. Pick a layer to see the records.",
                "owners": "Who answers for each piece. Every model names its owner too, so the platform’s catalog shows them.",
                "pii": "Each column’s class follows the learner. Direct personal data is masked from the core on, and Planning’s mart holds no names or emails.",
                "promises": "What is promised where, in open standards: a contract for the shared table, a product for Planning and one definition for the measure.",
                "checks": "A check holds each handoff. Pick a shield to change one side, and see what stops the merge."},
        zin="Zoom in", zout="Zoom out", fit="Show all", side="Show or hide the details", wide="Expand the details",
        big="Best on a bigger screen.", big_p="On a phone, the map runs top to bottom. Open this page on a laptop or a tablet to see it whole.",
        intro_k="The map", intro_h="A goal, a question, four folders",
        intro_p="Light is data. Planning’s goal comes first, then its question, in Analytics’ records, and the question’s ticket takes it to the architecture. Data governance adds what the code can’t know, each piece landing where it applies, and rows flow through the dbt project’s seven layers. The answer goes back to the question.",
        legend=[("in", "The goal and its question"), ("dp", "Rows of data"), ("dg", "Business context"), ("ok", "The answer")], go="Follow the question",
        whole="The whole map", handoff="Handoff {n} of {of}", gate="Validated", dash="Census dashboard", learners="learners",
        drag="Drag to move · Ctrl or ⌘ and scroll to zoom",
        touch="Two fingers move and zoom the map",
        a_h="What dbt alone can’t tell you",
        a_p="Planning’s answer is 12. Ask it eight questions. A dbt project alone answers one well: how it’s built. Add the business context, one piece at a time, and see what each piece answers.",
        add="Add the context", add1="Add: {x}", plain="dbt alone", all="All of it", score="{n} of {of} answered", alone="dbt alone", with_="With the context",
        itself="Answered by the project itself",
        done="All eight answered. Seven of the answers came from outside the code, written by the people who answer for them, and checks hold the code to them.",
        layer="Layer {n} of {of}", here="This learner, in this layer",
        promised="Promised here", reads="Who may use it", next_layer="Next layer",
        s_h="Open standards carry the business",
        s_p="Three kinds of promise, each written by the people who answer for it, in an open standard no tool owns. Pick one, then a note, to see its line in the real file.",
        who="Written by", holds="Holds", lands="Lands in dbt", notes="What its lines say", line="Line {a}", lines="Lines {a} to {b}", files="Its files",
        k_ok="All {n} handoffs hold.", k_bad="{k} of {n} hold. Nothing merges until the rest are fixed.",
        change="Change one side", restore="Put it back", held="Held by", if_="If", m_ok="Ready to merge", m_bad="Merge blocked",
        k_foot="And the owners: before a change merges, its impact report names everyone it reaches. They’re told, not asked to review.",
        all_h="Every folder, and what it holds"),
    "es": dict(
        jump="En esta página", follow="Sigue una pregunta",
        jumps=[("journey", "El mapa"), ("context", "Lo que dbt solo no tiene"), ("standards", "Estándares abiertos"), ("run", "Ejecútalo")],
        j_h="Sigue una pregunta",
        j_p="Primero, una meta, con las preguntas que muestran si se cumple. Una pregunta empieza en la analítica, casi siempre sin respuesta todavía, y una iniciativa la lleva a un ticket. La arquitectura encuentra lo que necesita, gobierno de datos dice qué significan sus palabras y qué se promete, y el proyecto de dbt la construye. Pulsa Reproducir, o elige cualquier pieza del mapa.",
        asks="Planificación pregunta", question="¿Cuántos estudiantes están a 15 créditos o menos de un certificado de posgrado, por facultad, a la fecha del censo?",
        answer="Respuesta", steps="Doce pasos, de la meta a la respuesta", goal_k="Meta · Planificación",
        tree="Sus medidas, en un árbol", t_legend=[("ok", "Respondida"), ("in", "Sugerida"), ("st", "Sin preguntar")],
        t_f="Una fórmula", t_d="Un impulsor, que se comprueba en los datos", t_hint="Elige una pregunta del árbol para verla.",
        t_add="se suma a la medida de arriba", t_mul="se multiplica en la medida de arriba", t_drv="impulsa la medida de arriba, sin fórmula",
        t_why="Por qué ahora", t_dec="La decisión que informa", t_size="Tamaño, al sugerirla", t_aq="La pidió Clara Jensen: el paso siguiente la sigue",
        t_yes="Si Clara dice que sí en un ticket, la pregunta toma el siguiente número AQ y sigue los pasos que vienen después de este.",
        play="Reproducir", pause="Pausa", again="Otra vez", back="Atrás", next="Siguiente", step="Paso {n} de {of}",
        passes="Lo que entrega", result="La respuesta", open="Abrir el archivo", std="Estándar", left="líneas omitidas", left1="línea omitida",
        chart="Estudiantes cerca de un certificado de posgrado, al 31 de marzo de 2026", total="En total",
        ok="Coincide con el informe del equipo del censo, facultad por facultad",
        map="El mapa del proyecto de ejemplo", pieces="Las piezas del mapa",
        map_d="Un mapa del proyecto de ejemplo, en cuatro carpetas, que se lee en círculo. Arriba a la derecha, las iniciativas: la meta de Planificación, su pregunta en los registros de Analítica, y el ticket que la lleva. Arriba a la izquierda, la arquitectura empresarial: el objeto de datos que la pregunta necesita, Learner, y el sistema de estudiantes, donde se registra primero. En medio, gobierno de datos: el activo de información y su responsable, el término Learner del glosario, el contrato de la tabla compartida de estudiantes, el producto de datos de Planificación, la métrica y los mandatos de los agentes, cada uno junto a la capa del proyecto de dbt donde llega. Después, las siete capas del proyecto de dbt, desde tres sistemas hasta el tablero del censo, que devuelve la respuesta, 12 estudiantes, a la pregunta.",
        show="Mostrar", lenses=[("learner", "dp", "Una persona"), ("owners", "dg", "Responsables"), ("pii", "dg", "Datos personales"), ("promises", "dg", "Promesas"), ("checks", "ok", "Verificaciones")],
        lens_p={"learner": "La persona S-20417, desde tres sistemas hasta el conteo de Planificación: qué guarda de ella cada capa. Elige una capa para ver los registros.",
                "owners": "Quién responde por cada pieza. Cada modelo nombra también a su responsable, así que el catálogo de la plataforma lo muestra.",
                "pii": "La clase de cada columna sigue a la persona. Los datos personales directos quedan enmascarados desde la capa central, y el mart de Planificación no guarda nombres ni correos.",
                "promises": "Qué se promete y dónde, en estándares abiertos: un contrato para la tabla compartida, un producto para Planificación y una sola definición para la medida.",
                "checks": "Una verificación sostiene cada traspaso. Elige un escudo para cambiar un lado y mira qué detiene la fusión."},
        zin="Acercar", zout="Alejar", fit="Ver todo", side="Mostrar u ocultar los detalles", wide="Ampliar los detalles",
        big="Se ve mejor en una pantalla grande.", big_p="En un teléfono, el mapa va de arriba abajo. Abre esta página en una computadora o una tableta para verlo entero.",
        intro_k="El mapa", intro_h="Una meta, una pregunta, cuatro carpetas",
        intro_p="La luz es dato. Primero está la meta de Planificación, luego su pregunta, en los registros de Analítica, y el ticket de la pregunta la lleva a la arquitectura. Gobierno de datos suma lo que el código no puede saber, cada pieza llegando donde se aplica, y las filas fluyen por las siete capas del proyecto de dbt. La respuesta vuelve a la pregunta.",
        legend=[("in", "La meta y su pregunta"), ("dp", "Filas de datos"), ("dg", "Contexto del negocio"), ("ok", "La respuesta")], go="Sigue la pregunta",
        whole="Todo el mapa", handoff="Traspaso {n} de {of}", gate="Validado", dash="Tablero del censo", learners="estudiantes",
        drag="Arrastra para moverte · Ctrl o ⌘ y desplaza para acercar",
        touch="Con dos dedos mueves y acercas el mapa",
        a_h="Lo que dbt solo no puede decirte",
        a_p="La respuesta de Planificación es 12. Hazle ocho preguntas. Un proyecto de dbt solo responde bien una: cómo se construye. Agrega el contexto del negocio, pieza por pieza, y mira qué responde cada una.",
        add="Agrega el contexto", add1="Agrega: {x}", plain="dbt solo", all="Todo", score="{n} de {of} respondidas", alone="dbt solo", with_="Con el contexto",
        itself="Lo responde el propio proyecto",
        done="Las ocho respondidas. Siete respuestas vinieron de fuera del código, escritas por quienes responden por ellas, y hay verificaciones que sostienen el código contra ellas.",
        layer="Capa {n} de {of}", here="Esta persona, en esta capa",
        promised="Lo que se promete", reads="Quién puede usarla", next_layer="Siguiente capa",
        s_h="Los estándares abiertos llevan el negocio",
        s_p="Tres tipos de promesa, cada uno escrito por quienes responden por él, en un estándar abierto que no es de ninguna herramienta. Elige uno, y luego una nota, para ver su línea en el archivo real.",
        who="Lo escribe", holds="Guarda", lands="Llega a dbt", notes="Qué dicen sus líneas", line="Línea {a}", lines="Líneas {a} a {b}", files="Sus archivos",
        k_ok="Los {n} traspasos se sostienen.", k_bad="Se sostienen {k} de {n}. Nada se fusiona hasta arreglar el resto.",
        change="Cambia un lado", restore="Déjalo como estaba", held="Lo sostiene", if_="Si", m_ok="Listo para fusionar", m_bad="Fusión bloqueada",
        k_foot="Y los responsables: antes de que un cambio se fusione, su informe de impacto nombra a todos los que alcanza. Se les informa; no se les pide revisar.",
        all_h="Cada carpeta y lo que guarda"),
}


def px_md(s):
    """A Markdown table cell as HTML: its **bold** and `code`."""
    s = E(s.strip())
    s = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", s)
    s = re.sub(r"\[(.+?)\]\((.+?)\)", r"\1", s)
    return re.sub(r"`(.+?)`", r"<code>\1</code>", s)


def px_yaml(s):
    """One YAML line, with its key, value and comment marked so the page can colour them."""
    m = re.match(r"^(\s*)(#.*)$", s)
    if m:
        return E(m.group(1)) + f'<span class="c">{E(m.group(2))}</span>'
    m = re.match(r"^(\s*)(- )?([A-Za-z_$][\w.$-]*)(:)( .*)?$", s)
    if m:
        ind, dash, key, _, rest = m.groups()
        return (E(ind) + ('<span class="p">- </span>' if dash else "") + f'<span class="k">{E(key)}</span>:'
                + (f'<span class="v">{E(rest)}</span>' if rest else ""))
    m = re.match(r"^(\s*)- (.*)$", s)
    if m:
        return E(m.group(1)) + f'<span class="p">- </span><span class="v">{E(m.group(2))}</span>'
    return E(s)


def px_code(lg, blocks, hi=(), ids=None, notes=(), box=None):
    """A file's lines as the page shows them: each with its number, the lines that matter lit, and the lines left out between two
    blocks counted. ids: the prefix of each line's id, so a note can link to it; notes: the lines a note explains; box: the name
    of the lines when they scroll in a box of their own, which the keyboard can then reach."""
    U = PROJECT_UI[lg]; out, end = [], None
    for first, lines in blocks:
        if end is not None and first > end + 1:
            k = first - end - 1
            out.append(f'<span class="px-gap">{k} {E(U["left1"] if k == 1 else U["left"])}</span>')
        for i, s in enumerate(lines):
            n = first + i
            cls = "px-ln" + (" hi" if n in hi else "") + (" nt" if n in notes else "")
            at = f' id="{ids}{n}"' if ids else ""
            out.append(f'<span class="{cls}" data-n="{n}"{at}><span class="n" aria-hidden="true">{n}</span><span class="t">{px_yaml(s)}</span></span>')
        end = first + len(lines) - 1
    at = f' tabindex="0" role="region" aria-label="{E(box)}"' if box else ""
    return f'<pre class="px-code"{at}><code>' + "".join(out) + "</code></pre>"


def px_rows(rows):
    """A Markdown table's header and one of its rows, a column to a line, so it reads on a phone."""
    cells = lambda r: r.strip().strip("|").split("|")
    return ('<table class="px-rows"><tbody>' + "".join(f'<tr><th scope="row">{px_md(h)}</th><td>{px_md(v)}</td></tr>'
                                                    for h, v in zip(cells(rows[0]), cells(rows[1]))) + "</tbody></table>")


def md_cells(line):
    """A Markdown table row's cells, trimmed."""
    return [c.strip() for c in line.strip().strip("|").split("|")]


def px_pairs(rows):
    """A Markdown table's rows of a name and a value, each a line of the table."""
    return ('<table class="px-rows"><tbody>' + "".join(f'<tr><th scope="row">{px_md(k)}</th><td>{px_md(v)}</td></tr>'
                                                    for k, v in (md_cells(r) for r in rows)) + "</tbody></table>")


def px_tree(lg):
    """The goal's tree, as an outline from the goal's measure down (PROJECT_TREE, as the goal's file draws it): each measure says
    how it makes the one above, by a formula (+, ×) or as a driver; the questions asked are answered, those suggested wait for
    their owner. Each question opens what it asks and, for a suggestion, why now, the decision it informs and its size.
    Without the script every suggestion is shown under the tree; with it, one at a time."""
    U = PROJECT_UI[lg]
    names, state, kids, up = {}, {}, {}, set()
    for line in PROJECT_TREE:
        m = re.match(r'\s*(\w+)\["(.+)"\]:::(\w+)$', line)
        if m:
            names[m[1]], state[m[1]] = m[2], m[3]
            continue
        m = re.match(r'\s*(\w+) (-->|-\.->)\|"(.+)"\| (\w+)$', line)
        kids.setdefault(m[4], []).append((m[1], m[3])); up.add(m[1])
    root = next(k for k in names if k not in up)
    cls = {"answered": "px-ok", "suggested": "px-in", "starter": "px-gqx"}
    sign = {"+": ("+", U["t_add"]), "×": ("×", U["t_mul"]), "drives": ("", U["t_drv"])}

    def node(k, how=None):
        name, q = (names[k].split(" · ") + [None])[:2]
        name = PROJECT_TREE_ES[k] if lg == "es" else name
        sg = ""
        if how:
            mark, say = sign[how]
            sg = f'<span class="px-gqs{"" if mark else " px-gqo"}" aria-hidden="true">{mark}</span><span class="sr">{E(say)}: </span>'
        if q and q.startswith("SQ"):
            label = f'<a class="px-gqn" href="#px-gq-{q}" data-q="{q}"><span>{E(name)}</span><b class="px-gqp">{q}</b></a>'
        elif q:  # asked, and followed by the map from the next step
            label = (f'<a class="px-gqn" href="#px-s{PX_STORY.index("q") + 1}" title="{E(U["t_aq"])}"><span>{E(name)}</span><b class="px-gqp">{q}</b>'
                     f'<span class="sr"> · {E(U["t_aq"])}</span></a>')
        else:
            label = f'<span class="px-gqn">{E(name)}</span>'
        sub = "".join(node(c, h) for c, h in kids.get(k, []))
        return f'<li class="{cls[state[k]]}">{sg}{label}' + (f'<ul>{sub}</ul>' if sub else "") + '</li>'

    legend = "".join(f'<li class="{"px-gqx" if k == "st" else "px-" + k}"><i aria-hidden="true"></i>{E(x)}</li>' for k, x in U["t_legend"])
    legend += (f'<li class="px-gql-f"><span aria-hidden="true">+ ×</span>{E(U["t_f"])}</li>'
               f'<li class="px-gql-d"><span class="px-gqs px-gqo" aria-hidden="true"></span>{E(U["t_d"])}</li>')
    details = ""
    for qline, wline, es in PROJECT_SUGGESTED:
        qid = md_cells(qline)[0].strip("`")
        if lg == "es":
            ask, stands, why, dec, size = es
        else:
            ask, stands = md_cells(qline)[1].strip("*"), md_cells(qline)[3]
            why, dec, size = md_cells(wline)[1:4]
        why = re.sub(r"\[(.+?)\]\(.+?\)", r"\1", why)  # a link in the file reads as its words here
        details += (f'<div class="px-gqd px-in" id="px-gq-{qid}" data-q="{qid}"><p class="px-gqm"><b class="px-gqp">{qid}</b>{E(stands)}</p>'
                    f'<p class="px-gqq">{E(ask)}</p><dl><dt>{E(U["t_why"])}</dt><dd>{px_md(why)}</dd><dt>{E(U["t_dec"])}</dt><dd>{E(dec)}</dd>'
                    f'<dt>{E(U["t_size"])}</dt><dd>{E(size)}</dd></dl></div>')
    return (f'<figure class="px-gqt"><figcaption>{E(U["tree"])}</figcaption><ul class="px-gql" aria-hidden="true">{legend}</ul>'
            f'<ul class="px-gqu">{node(root)}</ul><p class="px-gqh" hidden>{E(U["t_hint"])}</p></figure>'
            f'<div class="px-gqds">{details}<p class="px-gqy">{E(U["t_yes"])}</p></div>')


def px_file(lg, path, inner, std=None):
    """A file of the project, as a figure: its path, a link to it on GitHub, its lines and the standard it's written in."""
    U = PROJECT_UI[lg]; shown = proj_path(path)
    s = f'<p class="px-std"><span>{E(U["std"])}</span> {E(std)}</p>' if std else ""
    return (f'<figure class="px-file"><figcaption class="px-fh"><code>{E(shown)}</code><a href="{proj_url(path)}">{E(U["open"])}'
            f'<span class="sr"> {E(shown)}</span></a></figcaption>{inner}{s}</figure>')


def px_chart(lg, mark=None):
    """Planning's answer, faculty by faculty, as a table drawn as bars; mark: a line under the faculty of the learner followed."""
    U = PROJECT_UI[lg]; top = max(v for _, v in PROJECT_FACULTIES); tot = sum(v for _, v in PROJECT_FACULTIES)
    rows = ""
    for i, (name, v) in enumerate(PROJECT_FACULTIES):
        me = mark and i == 2  # Engineering and IT, the learner's
        note = f'<small class="px-me">{E(mark)}</small>' if me else ""
        rows += (f'<tr{" class=" + chr(34) + "is-me" + chr(34) if me else ""}><th scope="row">{E(T(lg, *name))}{note}</th>'
                 f'<td><span class="px-cbar" style="--v:{v / top:.3f};--d:{i * 90}ms"></span><b>{v}</b></td></tr>')
    return (f'<table class="px-chart"><caption>{E(U["chart"])}</caption><tbody>{rows}'
            f'<tr class="px-tot"><th scope="row">{E(U["total"])}</th><td><b>{tot}</b></td></tr></tbody></table>'
            f'<p class="px-cok"><span aria-hidden="true">✓</span> {E(U["ok"])}</p>')


def px_lane(lg, k):
    """A lane's number and name: "20 · Data governance"."""
    nb, name, _ = PROJECT_LANES[k]
    return f'{nb} · {T(lg, *name)}'


# The map at the top of the page (the author, 15 November 2026: "I don't see relevant improvements in GUI or UX, you really need
# to try harder"): the folders as one live map, in the films' own language, where light is data. Planning's question starts in
# Analytics' records, top right, and its ticket takes it to the architecture (16 November 2026); each of data governance's pieces sits
# right above the dbt layer it lands on; the dbt project's seven layers are a line that rows of data flow along, and the answer flows
# back up to the question, so the map reads as a loop. Planning's goal sits above the question (17 November 2026: Goal–Question–
# Metric, the goal first). A play bar follows the goal and its question in twelve steps,
# five lenses show what attaches where, each layer opens on what it holds of one learner, and a shield on each handoff can be
# broken to see what stops the merge. Without the script it reads as a plain picture, with every step, layer and handoff below it.
# Each piece's box, in the map's own units: on a wide screen (x, y, w, h), and tall, for a phone.
PX_WIDE, PX_TALL = (932, 750), (400, 1618)
PX_LAYER_IDS = [ly["key"] for ly in PROJECT_LAYERS]  # sources … exposures, left to right (wide) or top to bottom (tall)
PX_GOV = ["a", "g", "c", "p", "m", "k"]  # data governance's pieces, each beside the layer it lands on: staging … exposures
PX_STORY = ["goal", "q", "t", "o", "s", "g", "c", "dp", "p", "m", "gate", "dash"]  # the piece each of the twelve steps is about
PX_ALSO = {"a": "h2", "k": "h7"}  # the pieces no step is about open the handoff they hold
PATH_STEP = next(s for s in PROJECT_STEPS if s.get("paths"))  # the step that can start from models already built
PATH_STAMPS = {"staging": "built", "intermediate": "built", "core": "top"}  # what those models are, on the map


def px_geo():
    """Each piece's box, wide and tall: {id: (x, y, w, h)}. Wide, the map reads as a loop: the goal and its question top right,
    the question's ticket and the architecture leftwards, governance and the data project down and to the right, and the answer
    back up the right edge. The goal sits right of the initiatives' name, above the question; tall, above the question."""
    L, P = {}, {}
    L["z-ea"], L["z-in"], L["z-dg"], L["z-dp"] = (0, 0, 380, 232), (392, 0, 500, 232), (0, 244, 892, 194), (0, 450, 892, 292)
    P["z-in"], P["z-ea"], P["z-dg"], P["z-dp"] = (0, 0, 400, 418), (0, 430, 400, 200), (0, 642, 198, 852), (206, 642, 194, 976)
    L["goal"], P["goal"] = (628, 6, 250, 72), (14, 56, 372, 74)
    L["q"], P["q"] = (546, 92, 332, 132), (14, 144, 372, 150)
    L["t"], P["t"] = (406, 100, 118, 118), (14, 306, 372, 98)
    L["o"], P["o"] = (186, 100, 180, 118), (16, 486, 176, 132)
    L["s"], P["s"] = (14, 100, 160, 118), (208, 486, 176, 132)
    for i, k in enumerate(PX_GOV):  # each right above the layer it lands on
        L[k], P[k] = (131 + 126 * i, 282, 118, 136), (16, 785 + 120 * i, 156, 96)
    for i, k in enumerate(PX_LAYER_IDS):
        L[k], P[k] = (14 + 126 * i, 518, 100, 94), (228, 673 + 120 * i, 156, 80)
    L["gate"], P["gate"] = (620, 554, 22, 22), (293, 1240, 26, 26)
    L["dash"], P["dash"] = (752, 642, 136, 92), (228, 1504, 156, 100)
    L["dp"], P["dp"] = (14, 686, 380, 42), (208, 647, 190, 24)
    return L, P


# Each line on the map: its id, the pieces it joins, its colour (the folder it starts from; ok: the answer), the step that lights it
# (None: only the whole map shows it), and the handoff it is (1 to 7, PROJECT_HANDOFFS' order; 0: none)
PX_EDGES = [("gq", "goal", "q", "in", 2, 0), ("qt", "q", "t", "in", 3, 0), ("to", "t", "o", "in", 4, 1), ("os", "o", "s", "ea", 5, 0),
            ("ssrc", "s", "sources", "ea", 5, 0), ("og", "o", "g", "ea", 6, 0), ("oa", "o", "a", "ea", 6, 2), ("gin", "g", "intermediate", "dg", 6, 3),
            ("cco", "c", "core", "dg", 7, 4), ("ast", "a", "staging", "dg", 8, 0), ("pma", "p", "marts", "dg", 9, 5),
            ("mme", "m", "metrics", "dg", 10, 6), ("kex", "k", "exposures", "dg", None, 7),
            ("pipe", "sources", "exposures", "dp", 8, 0), ("xd", "exposures", "dash", "dp", 12, 0), ("ans", "dash", "q", "ok", 12, 0)]
# What the camera frames for each step, layer and handoff ("*": the whole map)
PX_FRAMES = ["goal q", "q", "q t", "t o", "o s sources", "o a g intermediate", "g c core", "sources core dp", "p marts", "m metrics", "marts gate metrics", "*"]
PX_LFRAMES = ["s sources", "a staging", "g intermediate", "c core", "p marts gate", "m metrics", "k exposures dash"]
PX_HFRAMES = ["t o", "o a", "g intermediate", "c core", "p marts", "m metrics", "k exposures"]
# What each card says: its kind (above its title) and its title; the layers' short job; the icon each piece is drawn with
PX_CARDS = {
    "t": (("Ticket", "Ticket"), ("DATA-142", "DATA-142"), ("Census planning 2026", "Census planning 2026"), "ticket"),
    "o": (("Data object", "Objeto de datos"), ("Learner", "Learner"), ("Student domain", "Dominio Student"), "cube"),
    "s": (("System of record", "Sistema de registro"), ("Student system", "Sistema de estudiantes"), ("Copied in two more", "Copiado en dos más"), "apps"),
    "a": (("Asset", "Activo"), ("Learner", "Learner"), None, "person"),
    "g": (("Glossary", "Glosario"), ("Learner", "Learner"), None, "book"),
    "c": (("Contract · ODCS", "Contrato · ODCS"), ("core_learner v1", "core_learner v1"), None, "seal"),
    "p": (("Product · ODPS", "Producto · ODPS"), ("Learners near an award", "Learners near an award"), None, "box"),
    "m": (("Metric · Ossie", "Métrica · Ossie"), ("Near a graduate certificate", "Cerca de un certificado de posgrado"), None, "sigma"),
    "k": (("Mandates", "Mandatos"), ("What an agent may do", "Lo que puede hacer un agente"), None, "key"),
}
PX_JOBS = {"sources": ("3 systems", "3 sistemas", "db"), "staging": ("One per table", "Uno por tabla", "tag"),
           "intermediate": ("One learner", "Una persona", "merge"), "core": ("Shared, by contract", "Compartida, por contrato", "table"),
           "marts": ("For Planning", "Para Planificación", "target"), "metrics": ("Defined once", "Definidas una vez", "sigma"),
           "exposures": ("Who reads it", "Quién lo lee", "eye")}
# What each lens shows on a piece: one learner (S-20417, as the project builds them), owners, personal data, and promises. A piece
# a lens says nothing about fades while it's on; checks put a shield on each handoff instead.
PX_BADGES = {
    "goal": {"owners": ("Clara Jensen, Planning", "Clara Jensen, Planificación"), "pii": ("Counts and rates only", "Solo conteos y tasas"),
             "promises": ("The data team suggests first", "El equipo de datos sugiere primero")},
    "q": {"owners": ("Asked by Planning", "Lo pide Planificación"), "promises": ("Checked before it closes", "Se revisa antes de cerrarse")},
    "t": {"owners": ("Approved by Planning", "Lo aprueba Planificación"), "promises": ("By 7 a.m. on census day", "A las 7 a. m. del día del censo")},
    "o": {"owners": ("Registrar’s office", "Oficina de registro"), "pii": ("A person", "Una persona")},
    "s": {"learner": ("S-20417 is born here", "S-20417 nace aquí"), "owners": ("Each system’s owner", "El responsable de cada sistema"),
          "pii": ("IDs, names, emails", "Números, nombres, correos")},
    "a": {"owners": ("Mei Tanaka, registrar’s office", "Mei Tanaka, oficina de registro"), "pii": ("Confidential, direct personal data", "Confidencial, datos personales directos")},
    "g": {"owners": ("Mei Tanaka", "Mei Tanaka")},
    "c": {"owners": ("Written by data governance", "Lo escribe gobierno de datos"), "pii": ("Each column’s class", "La clase de cada columna"), "promises": ("ODCS 3.1.0", "ODCS 3.1.0")},
    "p": {"owners": ("Clara Jensen, Planning", "Clara Jensen, Planificación"), "promises": ("ODPS 1.0.0", "ODPS 1.0.0")},
    "m": {"owners": ("Clara Jensen", "Clara Jensen"), "promises": ("Apache Ossie 0.1.1", "Apache Ossie 0.1.1")},
    "k": {"owners": ("Signed by its owner", "Lo firma su responsable"), "pii": ("Agents read it masked", "Los agentes lo leen enmascarado")},
    "sources": {"learner": ("5 records, 3 systems", "5 registros, 3 sistemas"), "owners": ("Each system’s owner", "El responsable de cada sistema"),
                "pii": ("Direct: IDs and emails", "Directos: números y correos"), "promises": ("Freshness and known limits", "Frescura y límites conocidos")},
    "staging": {"learner": ("5 keys, each naming its system", "5 claves, cada una con su sistema"), "owners": ("Each system’s owner", "El responsable de cada sistema"),
                "pii": ("Each column classed", "Cada columna con su clase")},
    "intermediate": {"learner": ("3 keys, 1 learner", "3 claves, 1 persona"), "pii": ("Matched by ID and email", "Por número y correo")},
    "core": {"learner": ("45 of 60 credit points", "45 de 60 créditos"), "owners": ("Mei Tanaka", "Mei Tanaka"),
             "pii": ("Names and emails masked", "Nombres y correos enmascarados"), "promises": ("Enterprise contract, enforced", "Contrato empresarial, exigido")},
    "marts": {"learner": ("15 to go: near", "Faltan 15: cerca"), "owners": ("Planning", "Planificación"), "pii": ("No names or emails", "Sin nombres ni correos"),
              "promises": ("Data product, by 7 a.m.", "Producto, a las 7 a. m.")},
    "metrics": {"learner": ("Counted once", "Contada una vez"), "owners": ("Clara Jensen", "Clara Jensen"), "pii": ("Counts only", "Solo conteos"),
                "promises": ("One definition", "Una sola definición")},
    "exposures": {"learner": ("1 of Engineering’s 5", "1 de las 5 de Ingeniería"), "owners": ("Planning", "Planificación"), "pii": ("Counts only", "Solo conteos"),
                  "promises": ("Owner told first", "Se avisa al responsable")},
    "dash": {"learner": ("Counted in the 12", "Contada entre las 12"), "owners": ("Planning", "Planificación"), "pii": ("Counts, by faculty", "Conteos, por facultad"),
             "promises": ("Checked by Planning first", "Revisado antes por Planificación")},
}
# The icons, drawn on a 24-unit grid with the text's colour
PX_ICONS = {
    "ask": '<path d="M4 4.5h16v11.5H10l-6 4.5z"/><path d="M9.8 8.6a2.3 2.3 0 1 1 3.2 2.1c-.7.3-1 .8-1 1.5"/><path d="M12 14.6v.1"/>',
    "cube": '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>',
    "person": '<circle cx="12" cy="8" r="3.6"/><path d="M5 20c.8-3.7 3.6-5.6 7-5.6s6.2 1.9 7 5.6"/>',
    "book": '<path d="M12 6.2C9.6 4.6 6.6 4.4 4 5.4v13.4c2.6-1 5.6-.8 8 .8 2.4-1.6 5.4-1.8 8-.8V5.4c-2.6-1-5.6-.8-8 .8z"/><path d="M12 6.2v13.4"/>',
    "seal": '<path d="M6.5 3h7.5l4 4v14h-11.5z"/><path d="M14 3v4h4"/><path d="M9.6 13.4l2 2 3.6-4"/>',
    "box": '<path d="M3.5 7.5L12 3l8.5 4.5v9L12 21l-8.5-4.5z"/><path d="M3.5 7.5L12 12l8.5-4.5M12 12v9M7.8 5.3l8.4 4.5"/>',
    "sigma": '<path d="M17 4.5H7l5.4 7.5L7 19.5h10"/>',
    "key": '<circle cx="8" cy="12" r="3.8"/><path d="M11.8 12H21M17.6 12v3.2M20.6 12v2.4"/>',
    "db": '<ellipse cx="12" cy="5.6" rx="7" ry="2.6"/><path d="M5 5.6v12.8c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6V5.6"/><path d="M5 12c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6"/>',
    "tag": '<path d="M3.5 12.4V4h8.4l8.6 8.6-8.4 8.4z"/><circle cx="8" cy="8.4" r="1.4"/>',
    "merge": '<path d="M5 3.5v3.8c0 3.2 7 3.2 7 7.4v5.8M19 3.5v3.8c0 3.2-7 3.2-7 7.4M12 3.5v6"/>',
    "table": '<rect x="3.5" y="4.5" width="17" height="15" rx="2.2"/><path d="M3.5 9.5h17M9.5 9.5v10"/>',
    "target": '<circle cx="12" cy="12" r="8.2"/><circle cx="12" cy="12" r="4.4"/><circle cx="12" cy="12" r="1"/>',
    "eye": '<path d="M2.5 12S6 5.6 12 5.6 21.5 12 21.5 12 18 18.4 12 18.4 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    "tree": '<circle cx="12" cy="5" r="2.3"/><circle cx="5.5" cy="19" r="2.3"/><circle cx="12" cy="19" r="2.3"/><circle cx="18.5" cy="19" r="2.3"/>'
            '<path d="M12 7.3v9.4M12 12H5.5v4.7M12 12h6.5v4.7"/>',
    "ticket": '<path d="M3.5 7.5a2 2 0 0 0 2-2h13a2 2 0 0 0 2 2v2.2a2.3 2.3 0 0 0 0 4.6v2.2a2 2 0 0 0-2 2h-13a2 2 0 0 0-2-2v-2.2a2.3 2.3 0 0 0 0-4.6z"/><path d="M14.5 6v2.2M14.5 10.9v2.2M14.5 15.8V18"/>',
    "apps": '<rect x="3.5" y="4" width="17" height="6.5" rx="1.6"/><rect x="3.5" y="13.5" width="17" height="6.5" rx="1.6"/><path d="M6.5 7.25h.1M6.5 16.75h.1M9.5 7.25h6M9.5 16.75h6"/>',
    "check": '<path d="M12 3l7 3v5.8c0 4.4-3 7.6-7 9.2-4-1.6-7-4.8-7-9.2V6z"/><path d="M8.7 12.1l2.3 2.3 4.3-4.7"/>',
    "layers": '<path d="M12 3.5l8.5 4.6-8.5 4.6-8.5-4.6z"/><path d="M3.5 12.2l8.5 4.6 8.5-4.6M3.5 16.2l8.5 4.6 8.5-4.6"/>',
    "panel": '<rect x="3.5" y="4.5" width="17" height="15" rx="2.2"/><path d="M14.5 4.5v15"/>',
    "screen": '<rect x="3" y="4.5" width="18" height="12" rx="2"/><path d="M8.5 20h7M12 16.5V20"/>',
    "widen": '<g class="px-wo"><path d="M14 4h6v6M10 20H4v-6M20 4l-6.5 6.5M4 20l6.5-6.5"/></g>'
             '<g class="px-wi"><path d="M20 4l-6 6M14 5v5h5M4 20l6-6M10 19v-5H5"/></g>',
}


def px_icon(name, cls="px-ic"):
    return (f'<svg class="{cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" '
            f'stroke-linecap="round" stroke-linejoin="round">{PX_ICONS[name]}</svg>')


def px_pts(e, G, tall):
    """An edge's points, from its first piece to its last, in straight lines."""
    cx = lambda k: G[k][0] + G[k][2] / 2
    cy = lambda k: G[k][1] + G[k][3] / 2
    top = lambda k: G[k][1]
    bot = lambda k: G[k][1] + G[k][3]
    lef = lambda k: G[k][0]
    rig = lambda k: G[k][0] + G[k][2]
    i, a, b = e[0], e[1], e[2]
    if i == "gq":  # the goal down to its question
        return [(cx("q"), bot("goal")), (cx("q"), top("q"))] if tall else [(cx("goal"), bot("goal")), (cx("goal"), top("q"))]
    if i == "qt":  # the question to its ticket: leftwards (wide), down (tall)
        return [(cx("q"), bot("q")), (cx("q"), top("t"))] if tall else [(lef("q"), cy("t")), (rig("t"), cy("t"))]
    if i == "to":  # the ticket to the architecture
        return [(cx("o"), bot("t")), (cx("o"), top("o"))] if tall else [(lef("t"), cy("o")), (rig("o"), cy("o"))]
    if i == "os":  # the data object to its system of record
        return [(rig("o"), cy("o")), (lef("s"), cy("s"))] if tall else [(lef("o"), cy("s")), (rig("s"), cy("s"))]
    if i == "ssrc":  # the systems of record are the sources: down the left edge (wide), down the data project's column (tall)
        return ([(cx("sources"), bot("s")), (cx("sources"), top("sources"))] if tall
                else [(lef("s"), cy("s")), (6, cy("s")), (6, cy("sources")), (lef("sources"), cy("sources"))])
    if i == "og":  # the data object to its glossary entity: tall, down the left edge, past the asset
        return ([(lef("o"), cy("o")), (8, cy("o")), (8, cy("g")), (lef("g"), cy("g"))] if tall
                else [(cx("g"), bot("o")), (cx("g"), top("g"))])
    if i == "oa":  # tall: to the side of governance's label
        return [(160, bot("o")), (160, top("a"))] if tall else [(cx("a"), bot("o")), (cx("a"), top("a"))]
    if i == "pipe":
        return [(cx("sources"), cy("sources")), (cx("exposures"), cy("exposures"))]
    if i == "xd":
        return [(cx("dash"), bot("exposures")), (cx("dash"), top("dash"))]
    if i == "ans":  # back up the right edge, to the question
        lane = 393 if tall else 912
        return [(rig("dash"), cy("dash")), (lane, cy("dash")), (lane, cy("q")), (rig("q"), cy("q"))]
    return [(rig(a), cy(b)), (lef(b), cy(b))] if tall else [(cx(b), bot(a)), (cx(b), top(b))]  # governance, down to its layer


def px_path(pts, r=18):
    """Straight lines through the points, each corner rounded."""
    f = lambda v: f"{round(v, 1):g}"
    d = f"M{f(pts[0][0])} {f(pts[0][1])}"
    for (x0, y0), (x1, y1), (x2, y2) in zip(pts, pts[1:], pts[2:]):
        l1, l2 = math.hypot(x1 - x0, y1 - y0), math.hypot(x2 - x1, y2 - y1)
        k = min(r, l1 / 2, l2 / 2)
        d += (f"L{f(x1 - (x1 - x0) / l1 * k)} {f(y1 - (y1 - y0) / l1 * k)}"
              f"Q{f(x1)} {f(y1)} {f(x1 + (x2 - x1) / l2 * k)} {f(y1 + (y2 - y1) / l2 * k)}")
    return d + f"L{f(pts[-1][0])} {f(pts[-1][1])}"


def px_mid(pts):
    """The point halfway along the lines."""
    segs = [(p, q, math.hypot(q[0] - p[0], q[1] - p[1])) for p, q in zip(pts, pts[1:])]
    half = sum(s[2] for s in segs) / 2
    for p, q, n in segs:
        if half <= n:
            return round(p[0] + (q[0] - p[0]) * half / n, 1), round(p[1] + (q[1] - p[1]) * half / n, 1)
        half -= n
    return pts[-1]


def px_box(k, L, P):
    """A piece's place, wide and tall: as CSS variables, and as data the script reads."""
    x, y, w, h = L[k]; X, Y, W, H = P[k]
    return (f'style="--x:{x:g};--y:{y:g};--w:{w:g};--h:{h:g};--X:{X:g};--Y:{Y:g};--W:{W:g};--H:{H:g}" '
            f'data-r="{x:g} {y:g} {w:g} {h:g}" data-t="{X:g} {Y:g} {W:g} {H:g}"')


def px_badges(lg, k):
    """What each lens shows on a piece."""
    return "".join(f'<span class="px-bdg" data-lens="{lens}" aria-hidden="true">{E(T(lg, *txt))}</span>'
                   for lens, txt in PX_BADGES.get(k, {}).items())


def px_edges_svg(cls, size, G, tall):
    """The lines of one layout: a faint track, a glow and the line itself, which lights when its step comes."""
    W, H = size; out = ""
    for e in PX_EDGES:
        d = px_path(px_pts(e, G, tall), 6 if tall else 18)
        at = f'data-e="{e[0]}" data-a="{e[1]}" data-b="{e[2]}" data-step="{e[4] if e[4] is not None else ""}" data-h="{e[5]}"'
        out += (f'<g class="px-eg px-{e[3]}{" px-pipe" if e[0] == "pipe" else ""}" {at}><path class="px-tr" d="{d}"/>'
                f'<path class="px-gl" d="{d}" pathLength="1"/><path class="px-e" d="{d}" pathLength="1"/></g>')
    return (f'<svg class="px-edges {cls}" viewBox="0 0 {W} {H}" width="{W}" height="{H}" aria-hidden="true" focusable="false">'
            f'{out}</svg>')


def px_step_article(lg, i, s):
    """One step of the question, as the panel beside the map shows it: what it is, what it passes on, and its real file."""
    U = PROJECT_UI[lg]; L = lambda p: T(lg, *p); k = s["lane"]; n = len(PROJECT_STEPS)
    lines = px_rows(s["rows"]) if "rows" in s else px_pairs(s["pairs"]) if "pairs" in s else px_code(lg, s["code"], s.get("hi", ()))
    more = (f'<p class="px-more"><a href="#px-l1"><span aria-hidden="true">{px_icon("layers", "px-mi")}</span>{E(L(s["more"][1]))}</a></p>'
            if s.get("more") else "")
    chart = px_chart(lg) if s.get("answer") else ""
    paths = ""
    if s.get("paths"):  # two ways the step can go: buttons with the script; both paragraphs without it
        pt = s["paths"]
        paths = (f'<div class="px-path" role="group" aria-label="{E(L(pt["label"]))}">'
                 + "".join(f'<button type="button" class="px-pth" data-path="{w}" aria-pressed="{"true" if w == "new" else "false"}" hidden>{E(L(pt[w][0]))}</button>'
                           for w in ("new", "exists")) + '</div>'
                 + "".join(f'<p class="px-pthp" data-path="{w}"><b>{E(L(pt[w][0]))}.</b> {E(L(pt[w][1]))}</p>' for w in ("new", "exists")))
    return (f'<article class="px-art px-panel px-{k}" id="px-s{i}" data-frame="{PX_FRAMES[i - 1]}" data-node="{PX_STORY[i - 1]}" aria-labelledby="px-s{i}-h">'
            f'<div class="px-say"><p class="px-k"><span class="px-lane">{E(px_lane(lg, k))}</span><span class="px-of">{E(U["step"].format(n=i, of=n))}</span></p>'
            f'<h3 id="px-s{i}-h">{E(L(s["title"]))}</h3><p>{E(L(s["text"]))}</p>{paths}{px_tree(lg) if s.get("tree") else ""}'
            f'<p class="px-pass"><b>{E(U["result"] if s.get("answer") else U["passes"])}</b> {E(L(s["passes"]))}</p>{chart}{more}</div>'
            f'{px_file(lg, s["file"], lines, L(s["std"]) if s.get("std") else None)}</article>\n')


def px_layer_article(lg, i, ly):
    """One layer of the data project: its job, who may use it, what is promised there, what it holds of the learner, its files."""
    U = PROJECT_UI[lg]; L = lambda p: T(lg, *p); n = len(PROJECT_LAYERS)
    tag = f'<span class="px-tag">{E(ly["tag"])}</span>' if ly["tag"] else ""
    paths = "".join(f'<li><a href="{proj_url(p)}"><code>{E(proj_shown(p))}</code></a></li>' for p in ly["paths"])
    nav = ""
    if i > 1:
        nav += f'<a class="px-lgo" href="#px-l{i - 1}"><span aria-hidden="true">‹</span> {E(L(PROJECT_LAYERS[i - 2]["name"]))}</a>'
    if i < n:
        nav += f'<a class="px-lgo px-lgn" href="#px-l{i + 1}">{E(U["next_layer"])}: {E(L(PROJECT_LAYERS[i]["name"]))} <span aria-hidden="true">›</span></a>'
    return (f'<article class="px-art px-lp px-dp" id="px-l{i}" data-frame="{PX_LFRAMES[i - 1]}" data-node="{ly["key"]}" aria-labelledby="px-l{i}-h">'
            f'<div class="px-lsay"><p class="px-k"><span class="px-lane">{E(px_lane(lg, "dp"))}</span><span class="px-of">{E(U["layer"].format(n=i, of=n))}</span>{tag}</p>'
            f'<h3 id="px-l{i}-h">{E(L(ly["name"]))}</h3><p>{E(L(ly["job"]))}</p>'
            f'<dl><dt>{E(U["reads"])}</dt><dd>{E(L(ly["access"]))}</dd><dt>{E(U["promised"])}</dt><dd>{E(L(ly["promise"]))}</dd></dl></div>'
            f'<figure class="px-see"><figcaption>{E(U["here"])}</figcaption><div class="px-view" data-k="{ly["key"]}">{px_learner(lg, ly["key"])}</div></figure>'
            f'<p class="px-files">{E(U["files"])}</p><ul class="px-paths">{paths}</ul>'
            f'<p class="px-lnav">{nav}</p></article>\n')


def px_handoff_article(lg, i, h):
    """One handoff: from one folder to the next, the check that holds it, and what happens if one side changes alone."""
    U = PROJECT_UI[lg]; L = lambda p: T(lg, *p); n = len(PROJECT_HANDOFFS)
    fk, fl, tk, tl, held, path, change, broken = h
    about = f'<p>{E(T(lg, *PROJECT_ASKS[-1][3]))}</p>' if path == "scripts/check/mandates.py" else ""  # what an agent may do alone
    return (f'<article class="px-art px-ho" id="px-h{i}" data-frame="{PX_HFRAMES[i - 1]}" data-h="{i}" aria-labelledby="px-h{i}-h">'
            f'<p class="px-k"><span class="px-of">{E(U["handoff"].format(n=i, of=n))}</span></p>'
            f'<h3 id="px-h{i}-h">{E(L(held))}</h3>{about}'
            f'<div class="px-hrow"><p class="px-ha px-{fk}"><small>{E(px_lane(lg, fk))}</small><b>{E(L(fl))}</b></p>'
            f'<p class="px-harr" aria-hidden="true">↓</p><p class="px-ha px-{tk}"><small>{E(px_lane(lg, tk))}</small><b>{E(L(tl))}</b></p></div>'
            f'<p class="px-hby"><a href="{proj_url(path)}"><small>{E(U["held"])}</small> <code>{E(proj_shown(path))}</code></a></p>'
            f'<p class="px-hif"><b>{E(U["if_"])}:</b> {E(L(change))}</p>'
            f'<p class="px-hx"><span aria-hidden="true">✕</span> {E(L(broken))}</p>'
            f'<p class="px-hgo"><button type="button" class="px-hbtn" data-h="{i}" data-go="{E(U["change"])}" data-back="{E(U["restore"])}" hidden>{E(U["change"])}</button></p>'
            f'<p class="px-hfoot"><a href="{proj_url("scripts/check/impact.py")}">{E(U["k_foot"])}</a></p></article>\n')


def px_canvas(lg):
    """Follow one question, on the map of the example project: the four folders, what flows between them, and a panel beside
    the map with the real file behind each piece. Without the script, the map is a still picture with every panel below it."""
    U = PROJECT_UI[lg]; L = lambda p: T(lg, *p); n = len(PROJECT_STEPS)
    GL, GP = px_geo()
    # the folders: the architecture and the initiatives side by side on top, then a band each (wide); or the initiatives, then the
    # architecture, on top, and the other two side by side (tall)
    zones = ""
    for k, (nb, name, says) in PROJECT_LANES.items():
        lab = f'<p class="px-zl"><b>{nb}</b><span>{E(L(name))}<small>{E(L(says))}</small></span></p>' if k != "dp" else ""
        zones += f'<div class="px-zone px-{k}" data-nb="{nb}" {px_box("z-" + k, GL, GP)}>{lab}</div>'
    svg = px_edges_svg("px-wide", PX_WIDE, GL, False) + px_edges_svg("px-tall", PX_TALL, GP, True)
    # the pieces: buttons, in the order the keyboard walks them
    sn = lambda k: f'<span class="sr">{E(U["step"].format(n=PX_STORY.index(k) + 1, of=n))}: </span>' if k in PX_STORY else ""
    badge = lambda k: f'<i class="px-num" aria-hidden="true">{PX_STORY.index(k) + 1}</i>' if k in PX_STORY else ""
    goal = md_cells(PROJECT_GOAL_ROWS[0])[1].strip("*") if lg == "en" else PROJECT_GOAL_ES
    nodes = (f'<button type="button" class="px-nd px-gc px-in" data-id="goal" data-go="s{PX_STORY.index("goal") + 1}" {px_box("goal", GL, GP)}>{sn("goal")}'
             f'<span class="px-gck">{px_icon("tree")}<span>{E(U["goal_k"])}</span>{badge("goal")}</span><b class="px-gct">{E(goal)}</b>'
             f'{px_badges(lg, "goal")}</button>')
    nodes += (f'<button type="button" class="px-nd px-qn px-in" data-id="q" data-go="s{PX_STORY.index("q") + 1}" {px_box("q", GL, GP)}>{sn("q")}'
              f'<span class="px-qk">{px_icon("ask")}<span>AQ1 · {E(U["asks"])}</span>{badge("q")}</span>'
              f'<span class="px-qq">{E(U["question"])}</span>'
              f'<span class="px-qa"><small>{E(U["answer"])}</small><b>12</b><i aria-hidden="true">?</i></span>{px_badges(lg, "q")}</button>')
    for k in ["t", "o", "s"] + PX_GOV:
        kind, title, meta, icon = PX_CARDS[k]
        lane = {"t": "in", "o": "ea", "s": "ea"}.get(k, "dg")
        go = f's{PX_STORY.index(k) + 1}' if k in PX_STORY else PX_ALSO[k]
        m = f'<small class="px-ndm">{E(L(meta))}</small>' if meta else ""
        nodes += (f'<button type="button" class="px-nd px-nc px-{lane}" data-id="{k}" data-go="{go}" {px_box(k, GL, GP)}>{sn(k)}'
                  f'<span class="px-ndi">{px_icon(icon)}{badge(k)}</span><span class="px-ndk">{E(L(kind))}</span><b class="px-ndt">{E(L(title))}</b>{m}{px_badges(lg, k)}</button>')
    nb, name, says = PROJECT_LANES["dp"]
    nodes += (f'<button type="button" class="px-nd px-zlb px-dp" data-id="dp" data-go="s{PX_STORY.index("dp") + 1}" {px_box("dp", GL, GP)}>{sn("dp")}'
              f'<b>{nb}</b><span>{E(L(name))}<small>{E(L(says))} · dbt</small></span>{badge("dp")}</button>')
    for i, ly in enumerate(PROJECT_LAYERS, 1):
        k = ly["key"]; job_en, job_es, icon = PX_JOBS[k]
        stamp = PATH_STAMPS.get(k)
        stamp = f'<span class="px-stamp px-stamp-{stamp}" aria-hidden="true">{E(L(PATH_STEP["paths"][stamp]))}</span>' if stamp else ""
        nodes += (f'<button type="button" class="px-nd px-st px-dp" data-id="{k}" data-go="l{i}" {px_box(k, GL, GP)}>'
                  f'<span class="px-sti">{px_icon(icon)}</span><b>{E(L(ly["name"]))}</b><small>{E(T(lg, job_en, job_es))}</small>{stamp}'
                  f'{"<span class=" + chr(34) + "px-stt" + chr(34) + ">" + E(ly["tag"]) + "</span>" if ly["tag"] else ""}{px_badges(lg, k)}</button>')
        if k == "marts":  # the reconciliation: between the mart and what reads it
            nodes += (f'<button type="button" class="px-nd px-gate px-dp" data-id="gate" data-go="s{PX_STORY.index("gate") + 1}" {px_box("gate", GL, GP)}>{sn("gate")}'
                      f'{px_icon("check")}<span class="px-gtl">{E(U["gate"])}</span>{badge("gate")}</button>')
    top = max(v for _, v in PROJECT_FACULTIES)
    bars = "".join(f'<i style="--v:{v / top:.3f};--d:{j * 90}ms"></i>' for j, (_, v) in enumerate(PROJECT_FACULTIES))
    nodes += (f'<button type="button" class="px-nd px-dash px-dp" data-id="dash" data-go="s{PX_STORY.index("dash") + 1}" {px_box("dash", GL, GP)}>{sn("dash")}'
              f'<span class="px-ndk">{E(U["dash"])}</span>{badge("dash")}<span class="px-dsb"><span class="px-bars" aria-hidden="true">{bars}</span>'
              f'<b>12</b><small>{E(U["learners"])}</small></span>{px_badges(lg, "dash")}</button>')
    # a shield on each handoff, for the checks lens
    for e in PX_EDGES:
        if not e[5]:
            continue
        (x, y), (X, Y) = px_mid(px_pts(e, GL, False)), px_mid(px_pts(e, GP, True))
        h = PROJECT_HANDOFFS[e[5] - 1]
        nodes += (f'<button type="button" class="px-shd" data-id="h{e[5]}" data-go="h{e[5]}" data-edge="{e[0]}" aria-pressed="false" '
                  f'style="--x:{x:g};--y:{y:g};--X:{X:g};--Y:{Y:g}" hidden><span class="sr">{E(U["handoff"].format(n=e[5], of=len(PROJECT_HANDOFFS)))}: </span>'
                  f'{px_icon("check")}<span class="sr">{E(L(h[4]))}</span></button>')
    lenses = "".join(f'<button type="button" class="px-lens px-{lane}" data-lens="{k}" aria-pressed="false"><i aria-hidden="true"></i>{E(x)}</button>'
                     for k, lane, x in U["lenses"])
    lensp = "".join(f'<p class="px-lensp" data-lens="{k}" hidden>{E(x)}</p>' for k, x in U["lens_p"].items())
    ticks = "".join(f'<li class="px-{s["lane"]}"><i></i><span>{E(L(s["node"]))}</span></li>' for s in PROJECT_STEPS)
    legend = "".join(f'<li class="px-{k}"><i aria-hidden="true"></i>{E(x)}</li>' for k, x in U["legend"])
    intro = (f'<article class="px-art px-intro" id="px-i0" data-frame="*" aria-labelledby="px-i0-h"><p class="px-k"><span class="px-of">{E(U["intro_k"])}</span></p>'
             f'<h3 id="px-i0-h">{E(U["intro_h"])}</h3><p>{E(U["intro_p"])}</p><ul class="px-legend">{legend}</ul>'
             f'<p class="px-gop"><button type="button" class="px-go" hidden><span class="px-ico" aria-hidden="true"></span>{E(U["go"])}</button></p></article>\n')
    arts = (intro + "".join(px_step_article(lg, i, s) for i, s in enumerate(PROJECT_STEPS, 1))
            + "".join(px_layer_article(lg, i, ly) for i, ly in enumerate(PROJECT_LAYERS, 1))
            + "".join(px_handoff_article(lg, i, h) for i, h in enumerate(PROJECT_HANDOFFS, 1)))
    W, H = PX_WIDE; TW, TH = PX_TALL
    merge = (f'<p class="px-merge" hidden data-ok="{E(U["k_ok"])}" data-bad="{E(U["k_bad"])}" data-mok="{E(U["m_ok"])}" data-mbad="{E(U["m_bad"])}" aria-live="polite">'
             f'<span class="px-mi" aria-hidden="true"></span><span class="px-mt">{E(U["m_ok"])}</span><small></small></p>')
    return (f'<section class="px-band px" id="journey" aria-labelledby="journey-h">\n<div class="px-bh"><h2 id="journey-h">{E(U["j_h"])}</h2><p>{E(U["j_p"])}</p></div>\n'
            f'<div class="px-app" data-n="{n}" style="--WW:{W};--WH:{H};--TW:{TW};--TH:{TH}">\n'
            f'<div class="px-bar" hidden><div class="px-lenses" role="group" aria-labelledby="px-show"><span id="px-show">{E(U["show"])}</span>{lenses}</div>'
            f'<div class="px-tools">{merge}<button type="button" class="px-z" data-z="out" aria-label="{E(U["zout"])}" title="{E(U["zout"])}">−</button>'
            f'<button type="button" class="px-z px-zf" data-z="fit">{E(U["fit"])}</button>'
            f'<button type="button" class="px-z" data-z="in" aria-label="{E(U["zin"])}" title="{E(U["zin"])}">+</button>'
            f'<button type="button" class="px-z px-side" aria-pressed="true" aria-label="{E(U["side"])}" title="{E(U["side"])}">{px_icon("panel", "px-zi")}</button></div>'
            f'{lensp}</div>\n'
            # on a phone the map runs top to bottom: a note, shown only then (project.css), says it's best on a bigger screen
            f'<p class="px-big" role="note">{px_icon("screen", "px-bigi")}<span><b>{E(U["big"])}</b> {E(U["big_p"])}</span></p>\n'
            f'<div class="px-vp" role="region" aria-label="{E(U["map"])}" aria-describedby="px-map-d"><p class="sr" id="px-map-d">{E(U["map_d"])}</p>\n'
            f'<div class="px-w px-back">{zones}{svg}</div>\n'
            f'<canvas class="px-dots" aria-hidden="true"></canvas>\n'
            f'<div class="px-w px-front" role="group" aria-label="{E(U["pieces"])}">{nodes}</div>\n'
            f'<p class="px-hint" aria-hidden="true" data-touch="{E(U["touch"])}">{E(U["drag"])}</p></div>\n'
            f'<div class="px-foot" hidden><button type="button" class="px-play" data-play="{E(U["play"])}" data-pause="{E(U["pause"])}" data-again="{E(U["again"])}">'
            f'<span class="px-ico" aria-hidden="true"></span><span class="px-pl">{E(U["play"])}</span><span class="px-timer" aria-hidden="true"><i></i></span></button>'
            f'<button type="button" class="px-prev" aria-label="{E(U["back"])}" title="{E(U["back"])}"><span aria-hidden="true">‹</span></button>'
            f'<div class="px-scrub"><span class="px-fill" aria-hidden="true"></span><input type="range" min="0" max="{n}" step="1" value="0" aria-label="{E(U["steps"])}">'
            f'<ol class="px-ticks" aria-hidden="true"><li class="px-map"><i></i><span>{E(U["intro_k"])}</span></li>{ticks}</ol></div>'
            f'<button type="button" class="px-next" aria-label="{E(U["next"])}" title="{E(U["next"])}"><span aria-hidden="true">›</span></button>'
            f'<p class="px-count" aria-live="polite" data-of="{E(U["step"])}" data-map="{E(U["whole"])}">{E(U["whole"])}</p></div>\n'
            f'<button type="button" class="px-expand" hidden aria-pressed="false" aria-label="{E(U["wide"])}" title="{E(U["wide"])}">{px_icon("widen", "px-zi")}</button>\n'
            f'<div class="px-insp">\n{arts}</div>\n</div>\n</section>\n\n')


def px_context(lg):
    """What dbt alone can't tell you: eight questions about Planning's number, and the piece of context that answers each. Without
    the script, each card shows both answers; project.js adds the pieces one at a time."""
    U = PROJECT_UI[lg]; L = lambda p: T(lg, *p)
    piece = {k: (lane, name) for k, lane, name, _ in PROJECT_PIECES}
    sw = "".join(f'<button type="button" class="px-pc px-{lane}" data-k="{k}" aria-pressed="false"><i aria-hidden="true">{E(std)}</i>{E(L(name))}</button>'
                 for k, lane, name, std in PROJECT_PIECES)
    # the score: a ring of eight, one for each question, lit in its piece's colour when it's answered
    ring = "".join(f'<circle class="px-dn px-{"dp" if k == "dbt" else piece[k][0]}" data-k="{k}" r="40" cx="50" cy="50" pathLength="80" '
                   f'stroke-dasharray="8.6 71.4" stroke-dashoffset="{-10 * i - .7:g}"/>' for i, (k, *_) in enumerate(PROJECT_ASKS))
    n = len(PROJECT_ASKS)
    cards = ""
    for k, q, alone, with_, src, path in PROJECT_ASKS:
        link = f'<p class="px-src"><a href="{proj_url(path)}">{E(L(src))}</a></p>'
        if with_ is None:  # the project answers it alone
            cards += (f'<li class="px-card px-dp is-on" data-k="{k}"><h3>{E(L(q))}</h3><div class="px-with"><p class="px-al">{E(U["itself"])}</p>'
                      f'<p>{E(L(alone))}</p>{link}</div></li>\n')
            continue
        lane, name = piece[k]
        cards += (f'<li class="px-card px-{lane}" data-k="{k}"><h3>{E(L(q))}</h3>'
                  f'<div class="px-alone"><p class="px-al">{E(U["alone"])}</p><p>{E(L(alone))}</p></div>'
                  f'<button type="button" class="px-add" data-k="{k}" hidden><span aria-hidden="true">+</span> {E(U["add1"].format(x=L(name)))}</button>'
                  f'<div class="px-with" tabindex="-1"><p class="px-al">{E(U["with_"])}</p><p>{E(L(with_))}</p>{link}</div></li>\n')
    return (f'<section class="module px" id="context" aria-labelledby="context-h">\n<div class="mhead"><div><h2 id="context-h">{E(U["a_h"])}</h2>'
            f'<p>{E(U["a_p"])}</p></div></div>\n<div class="px-cx">\n<div class="px-cx-bar" hidden>'
            f'<div class="px-donut" aria-hidden="true"><svg viewBox="0 0 100 100" focusable="false">{ring}</svg><b>1</b><small>/ {n}</small></div>'
            f'<div class="px-cx-sw"><p class="px-cx-k" id="px-cx-k">{E(U["add"])}</p><div class="px-sw" role="group" aria-labelledby="px-cx-k">{sw}</div>'
            f'<p class="px-cx-q"><button type="button" data-all="0">{E(U["plain"])}</button><button type="button" data-all="1">{E(U["all"])}</button>'
            f'<span class="px-cx-n" aria-live="polite" data-of="{E(U["score"])}">{E(U["score"].format(n=1, of=n))}</span></p></div></div>\n'
            f'<ul class="px-cards">\n{cards}</ul>\n<p class="px-cx-done"><span aria-hidden="true">✓</span> {E(U["done"])}</p>\n</div>\n</section>\n\n')


# The learner followed through the layers, S-20417, as the project builds it: what each layer holds of them
PX_MASKED = ("a••••k@mail.example", "a••••r@mail.example")  # the two emails, masked: they're direct personal data


def px_learner(lg, key):
    """What one layer holds of the learner followed, drawn in HTML."""
    t = lambda en, es: E(T(lg, en, es))
    if key == "sources":
        rec = lambda code, what: f'<p class="px-rec"><code>{code}</code><span>{what}</span></p>'
        item = lambda code, what, late=False: f'<li{" class=" + chr(34) + "px-late" + chr(34) if late else ""}><code>{code}</code><span>{what}</span></li>'
        return ('<div class="px-sys">'
                f'<div class="px-sc"><p class="px-sysn">{t("Student system", "Sistema de estudiantes")}</p>'
                + rec("S-20417", t("Enrolled: Graduate Certificate in Data Analytics, Engineering and IT", "Matrícula: Graduate Certificate in Data Analytics, Ingeniería y TI"))
                + '<ul class="px-it">' + item("R-1053", t("15 credit points, Dec 2025", "15 créditos, dic. 2025"))
                + item("R-1054", t("15 credit points, Feb 2026", "15 créditos, feb. 2026"))
                + item("R-1055", t("15 credit points, Jul 2026: after census date", "15 créditos, jul. 2026: después del censo"), True) + '</ul></div>'
                f'<div class="px-sc"><p class="px-sysn">{t("Learning platform", "Plataforma de aprendizaje")}</p>'
                + rec("u-88213", t("Student ID typed in: S-20417", "Número de estudiante escrito: S-20417"))
                + '<ul class="px-it">' + item("B-5010", t("SQL for Analysis, 5 credit points", "SQL for Analysis, 5 créditos"))
                + item("B-5025", t("Python Foundations, 5 credit points", "Python Foundations, 5 créditos")) + '</ul>'
                + rec("u-88231", t("Student ID typed in: S-20417", "Número de estudiante escrito: S-20417"))
                + '<ul class="px-it">' + item("B-5020", t("Data Visualisation, 5 credit points", "Data Visualisation, 5 créditos")) + '</ul></div>'
                f'<div class="px-sc"><p class="px-sysn">{t("Short-courses system", "Sistema de cursos cortos")}</p>'
                + rec(PX_MASKED[0], t("The student record's email", "El correo del registro de estudiante"))
                + '<ul class="px-it">' + item("C-88", t("Data Visualisation Essentials, 5 credit points", "Data Visualisation Essentials, 5 créditos")) + '</ul>'
                + rec(PX_MASKED[1], t("Another email", "Otro correo"))
                + '<ul class="px-it">' + item("C-91", t("The same course, the same day", "El mismo curso, el mismo día")) + '</ul></div></div>'
                f'<p class="px-sum">{t("Five records, in three systems, might be this learner. Which ones are?", "Cinco registros, en tres sistemas, podrían ser esta persona. ¿Cuáles lo son?")}</p>')
    if key == "staging":
        rows = [("SIS", "S-20417", ("Student system", "Sistema de estudiantes")), ("LMS", "u-88213", ("Learning platform", "Plataforma de aprendizaje")),
                ("LMS", "u-88231", ("Learning platform", "Plataforma de aprendizaje")), ("SC", PX_MASKED[0], ("Short-courses system", "Sistema de cursos cortos")),
                ("SC", PX_MASKED[1], ("Short-courses system", "Sistema de cursos cortos"))]
        body = "".join(f'<tr><td><code><b>{a}</b>|{b.replace("@", "@<wbr>")}</code></td><td>{t(*c)}</td></tr>' for a, b, c in rows)
        return (f'<table class="px-keys"><thead><tr><th scope="col">{t("Key", "Clave")}</th><th scope="col">{t("From", "De")}</th></tr></thead><tbody>{body}</tbody></table>'
                f'<p class="px-sum">{t("Every key names its system, so keys from two systems never clash. The emails are masked here: they are direct personal data.", "Cada clave nombra su sistema, así que las claves de dos sistemas nunca chocan. Los correos van enmascarados aquí: son datos personales directos.")}</p>')
    if key == "intermediate":
        one = t("one learner", "una persona"); apart = t("kept apart", "separado")
        rows = [(True, "SIS|S-20417", ("The student ID", "El número de estudiante")),
                (True, "LMS|u-88213", ("Holds the student ID", "Guarda el número de estudiante")),
                (True, "SC|" + PX_MASKED[0], ("The same email as the student record", "El mismo correo que el registro de estudiante")),
                (False, "LMS|u-88231", ("Decision D-003: another person's account, with this student ID typed by mistake", "Decisión D-003: la cuenta de otra persona, con este número de estudiante escrito por error")),
                (False, "SC|" + PX_MASKED[1], ("Decision D-004: a look-alike, on the same course the same day. Two people.", "Decisión D-004: alguien parecido, en el mismo curso el mismo día. Dos personas."))]
        li = "".join(f'<li class="{"px-yes" if ok else "px-no"}"><code>{k}</code><span class="px-to"><span aria-hidden="true">{"→" if ok else "✕"}</span> '
                     f'{(one + " <code>0905e6e2…</code>") if ok else apart}</span><small>{t(*why)}</small></li>' for ok, k, why in rows)
        return (f'<ul class="px-match">{li}</ul>'
                f'<p class="px-sum">{t("Three keys, one learner. The registrar’s office decided the other two, and a decision it records beats every rule.", "Tres claves, una persona. La oficina de registro decidió las otras dos, y una decisión que registra le gana a cualquier regla.")}</p>')
    if key == "core":
        kv = (f'<tr><th scope="row"><code>learner_key</code></th><td><code>0905e6e2…</code> <span class="px-cl">pseudonymous</span></td></tr>'
              f'<tr><th scope="row"><code>learner_bk</code></th><td><code class="px-mask">••••••••</code> <span class="px-cl px-direct">direct · {t("masked", "enmascarado")}</span></td></tr>'
              f'<tr><th scope="row"><code>status</code></th><td><code>studying</code></td></tr>'
              f'<tr><th scope="row"><code>keys_held</code></th><td><code>3</code></td></tr>')
        bar = t("45 of 60 credit points: 30 from two units, 15 from three microcredentials, 15 to go", "45 de 60 créditos: 30 de dos unidades, 15 de tres microcredenciales, faltan 15")
        return (f'<p class="px-tn"><code>core_learner</code><small>{t("as at census date", "a la fecha del censo")}</small></p><table class="px-kv">{kv}</table>'
                f'<p class="px-tn"><code>core_credit_towards_award</code><small>{t("Graduate Certificate in Data Analytics, on 31 March 2026", "Graduate Certificate in Data Analytics, al 31 de marzo de 2026")}</small></p>'
                f'<div class="px-credit" role="img" aria-label="{bar}"><span class="px-cu" style="--w:50%">30</span><span class="px-cm" style="--w:25%">15</span><span class="px-cg" style="--w:25%">15</span></div>'
                f'<p class="px-cleg"><span class="px-cu">{t("Two units", "Dos unidades")}: 30</span><span class="px-cm">{t("Three microcredentials", "Tres microcredenciales")}: 15</span>'
                f'<span class="px-cg">{t("To go", "Faltan")}: 15</span></p>'
                f'<p class="px-sum">{t("From the core on, the student ID is masked for anyone not allowed to read it. The third unit counts from July, after census date.", "Desde la capa central, el número de estudiante queda enmascarado para quien no tenga permiso de leerlo. La tercera unidad cuenta desde julio, después del censo.")}</p>')
    if key == "marts":
        # <wbr> after each "_" (and after "@" in the staging keys): a narrow panel breaks a name between its words, not inside one
        rows = [("award_name", "Graduate Certificate in Data Analytics", None), ("faculty_name", "Faculty of Engineering and IT", None),
                ("credit_points_required", "60", None), ("credit_points_earned", "45", "40"), ("credit_points_remaining", "15", "20"), ("is_near_award", "true", "false")]
        kv = "".join(f'<tr{" class=" + chr(34) + "px-alt" + chr(34) if alt else ""}><th scope="row"><code>{a.replace("_", "_<wbr>")}</code></th><td><code{" data-alt=" + chr(34) + alt + chr(34) if alt else ""}>{b}</code></td></tr>'
                     for a, b, alt in rows)
        return (f'<p class="px-tn"><code>mart_planning__near_award</code><small>{t("census date: 31 March 2026", "fecha del censo: 31 de marzo de 2026")}</small></p><table class="px-kv">{kv}</table>'
                f'<p class="px-tog-p"><button type="button" class="px-tog" aria-pressed="false" hidden>{t("Without the email match", "Sin el reconocimiento por correo")}</button></p>'
                f'<p class="px-sum px-if">{t("Without the short course matched by email: 40 earned, 20 to go, not near the award. Engineering and IT would count 4, not 5, and the reconciliation with the census report would fail.", "Sin el curso corto reconocido por correo: 40 obtenidos, faltan 20, lejos del título. Ingeniería y TI contaría 4, no 5, y la conciliación con el informe del censo fallaría.")}</p>')
    if key == "metrics":
        rows = [(True, "Graduate Certificate in Data Analytics", ("graduate certificate · 15 to go · near", "graduate certificate · faltan 15 · cerca"), ("Counted", "Se cuenta")),
                (False, "Graduate Certificate in Cyber Security", ("graduate certificate · 55 to go", "graduate certificate · faltan 55"), ("Not near", "No está cerca")),
                (False, "Master of Data Analytics", ("master · 110 to go", "master · faltan 110"), ("Not a graduate certificate", "No es un certificado de posgrado"))]
        li = "".join(f'<li class="{"px-yes" if ok else "px-no"}"><b>{a}</b><span>{t(*b)}</span><em><span aria-hidden="true">{"✓" if ok else "–"}</span> {t(*c)}</em></li>'
                     for ok, a, b, c in rows)
        return (f'<p class="px-tn"><code>COUNT(DISTINCT learner_key)</code><small>{t("each learner once, only near a graduate certificate", "cada persona una vez, solo cerca de un certificado de posgrado")}</small></p>'
                f'<ul class="px-cnt">{li}</ul>'
                f'<p class="px-sum">{t("Three rows in the mart, one learner, counted once: one of Engineering and IT’s 5.", "Tres filas en el mart, una persona, contada una vez: una de las 5 de Ingeniería y TI.")}</p>')
    if key == "exposures":
        return px_chart(lg, mark=T(lg, "This learner is one of the 5", "Esta persona es una de las 5"))
    raise KeyError(key)


def px_standards(lg):
    """Open standards carry the business: the three standards, each opened on its real file, with notes that light their lines.
    Without the script, the notes link to their lines; project.js makes the standards tabs and lights a note's lines."""
    U = PROJECT_UI[lg]; L = lambda p: T(lg, *p)
    tabs = "".join(f'<li><a href="#px-d{i}" id="px-dt{i}"><b>{E(L(s["name"]))}</b><small>{E(s["short"])}</small></a></li>' for i, s in enumerate(PROJECT_STANDARDS, 1))
    panels = ""
    for i, s in enumerate(PROJECT_STANDARDS, 1):
        lit = {x for rng, _ in s["notes"].values() for x in range(rng[0], rng[-1] + 1)}
        notes = ""
        for a in sorted(s["notes"]):
            rng, words = s["notes"][a]
            lab = U["line"].format(a=rng[0]) if len(rng) == 1 else U["lines"].format(a=rng[0], b=rng[-1])
            notes += (f'<li><a class="px-note" href="#px-d{i}-L{rng[0]}" data-a="{rng[0]}" data-b="{rng[-1]}"><span class="px-nl">{E(lab)}</span>'
                      f'<span>{E(L(words))}</span></a></li>')
        panels += (f'<article class="px-sp" id="px-d{i}" aria-labelledby="px-d{i}-h"><div class="px-ssay">'
                   f'<h3 id="px-d{i}-h">{E(L(s["name"]))}</h3><p class="px-sn">{E(s["std"])}</p>'
                   f'<dl><dt>{E(U["who"])}</dt><dd>{E(L(s["who"]))}</dd><dt>{E(U["holds"])}</dt><dd>{E(L(s["holds"]))}</dd>'
                   f'<dt>{E(U["lands"])}</dt><dd>{E(L(s["lands"]))}</dd></dl></div>'
                   f'{px_file(lg, s["file"], px_code(lg, s["code"], ids=f"px-d{i}-L", notes=lit, box=proj_path(s["file"])))}'
                   f'<div class="px-snotes"><p class="px-files">{E(U["notes"])}</p><ol class="px-notes">{notes}</ol></div></article>')
    return (f'<section class="module px" id="standards" aria-labelledby="standards-h">\n<div class="mhead"><div><h2 id="standards-h">{E(U["s_h"])}</h2>'
            f'<p>{E(U["s_p"])}</p></div></div>\n<div class="px-sd px-dg">\n<ol class="px-stabs" aria-label="{E(U["s_h"])}">{tabs}</ol>\n'
            f'<div class="px-spanels">\n{panels}\n</div>\n</div>\n</section>\n\n')


def project_excerpts():
    """Every file's lines the project page shows, to compare with the project's repository (check_site.py): [(path as the films
    name it, [(first line, [lines])], [whole lines that must be in the file])]."""
    return ([(st["file"], st.get("code", []), st.get("rows", []) + st.get("pairs", []) + st.get("holds", [])) for st in PROJECT_STEPS]
            + [(sd["file"], sd["code"], []) for sd in PROJECT_STANDARDS])


def project_visuals(lg):
    """The project page's parts, in order: the map, with one question followed, each layer and each handoff; what dbt alone
    misses; and the open standards, line by line."""
    return px_canvas(lg) + px_context(lg) + px_standards(lg)


def asset_v(rel):
    """A short hash of a file under site/, for the link that loads it: a browser keeps a stylesheet, a script or a picture for up
    to four hours, but a page for ten minutes, so a changed file gets a new address and never meets a page it doesn't fit (a film's
    page that played the player before its fix for four hours after the fix merged, 18 November 2026). Windows line endings count
    as Unix ones in a text file, so a Windows checkout builds the same page. A file this script writes (data()) is hashed as it
    will be written."""
    if rel not in _V:
        global _GEN
        if _GEN is None:
            _GEN = {}  # set first: data() makes pages' parts that may ask for a version
            _GEN.update(data())
        b = _GEN[rel].encode("utf-8") if rel in _GEN else (WEB / rel).read_bytes()
        if rel.endswith(STAMP_TEXT):
            b = b.replace(b"\r\n", b"\n")
        _V[rel] = hashlib.sha256(b).hexdigest()[:10]
    return _V[rel]


_V, _GEN = {}, None
STAMP_TEXT = (".js", ".css", ".svg")
# a page's link to a script, a stylesheet or a picture of the site's own, with the version it carries, if any. A soundtrack keeps its
# bare name for now: site-tools/smoke.py reads it as it is, and a change there browser-checks every page.
STAMP = re.compile(r'(\s(?:src|href|poster)=")([^"#?:]+?\.(?:js|css|jpe?g|png|webp|svg|gif))(?:\?v=[0-9a-f]*)?"')


def version_of(rel):
    """The version a page links a file under site/ by (rel, its path there: asset_v()), or None for a file it links as it is."""
    return asset_v(rel) if rel.startswith("assets/") and (rel in (_GEN or {}) or (WEB / rel).is_file()) else None


def stamp(page, text):
    """A page (its path under site/, its html) with every link to a script, a stylesheet or a picture under site/assets/ carrying
    that file's version (version_of()): ?v=<hash>. Every page the site has goes through it (site_files()), and check_site.py fails a
    link without its file's version, so a changed player, engine, stylesheet or poster is fetched again by every browser at once."""
    here = posixpath.dirname(page)

    def one(m):
        v = version_of(posixpath.normpath(posixpath.join(here, m.group(2))))
        return f'{m.group(1)}{m.group(2)}?v={v}"' if v else m.group(0)
    return STAMP.sub(one, text)


def project_page(lg):
    """dbt-project/: how the example project carries the business into the code, on a map to play with (project_visuals()),
    how to run it, where things live, and the films that show it, each with the files its chapters show."""
    P = PROJECT_TEXT[lg]; U = PROJECT_UI[lg]; path = PROJECT_PATH
    h, R = head(lg, path, P["title"], P["desc"], P["lead"], f'{project_films()[0][1][0][1][0]["key"]}-poster.jpg')
    RL = R if lg == "en" else R[3:]
    groups = project_films(); n = sum(len(fs) for _, rows in groups for _, fs in rows)
    parts = "\n".join(f'<li><b>' + " ".join(f'<a href="{proj_url(p)}"><code>{E(proj_shown(p))}</code></a>' for p in ps) + f'</b><span>{E(T(lg, en, es))}</span></li>'
                      for ps, en, es in PROJECT_PARTS)
    body = (f'<body>\n{header(lg, path, R)}\n<main>\n<section class="hero cine px-hero"><canvas class="fx" aria-hidden="true"></canvas>\n'
            f'<p class="eyebrow crumbs"><a href="{RL}topics/">{T(lg, "Topics", "Temas")}</a></p>\n<h1>{E(P["h1"])}</h1>\n<p class="lead">{E(P["lead"])}</p>\n'
            f'<p class="stop-nav"><a class="btn primary" href="#journey">{E(U["follow"])}</a><a class="btn" href="{proj_url(root=True)}">{E(P["repo"])}</a></p>\n'
            f'<p class="px-jump"><span>{E(U["jump"])}</span>' + "".join(f'<a href="#{a}">{E(x)}</a>' for a, x in U["jumps"]) + '</p>\n</section>\n\n'
            f'{project_visuals(lg)}'
            f'<section class="module" id="run" aria-labelledby="run-h">\n<div class="mhead"><div><h2 id="run-h">{E(P["run_h"])}</h2></div></div>\n<div class="pj-run">\n'
            f'<div><h3>{E(P["laptop"])}</h3><p>{E(P["laptop_p"])}</p><pre><code>git clone {PROJECT_REPO}\ncd learning-data-project/30-data-project\npip install -r requirements.txt\ndbt build --profiles-dir .</code></pre></div>\n'
            f'<div><h3>{E(P["dbx"])}</h3><p>{E(P["dbx_p"])}</p><pre><code>pip install -r requirements-databricks.txt\ndbt build --target databricks --profiles-dir .</code></pre></div>\n'
            f'</div>\n<p class="film-links"><a href="{proj_url("README.md")}">{E(P["run"])}</a></p>\n</section>\n\n'
            f'<section class="module" id="where" aria-labelledby="where-h">\n<div class="mhead"><div><h2 id="where-h">{E(P["where_h"])}</h2><p>{E(P["where_p"])}</p></div></div>\n'
            f'<details class="px-all"><summary>{E(U["all_h"])}</summary>\n<ul class="repo-list">\n{parts}\n</ul>\n</details>\n</section>\n\n'
            f'<section class="module" id="films" aria-labelledby="films-h">\n<div class="mhead"><div><h2 id="films-h">{E(P["films_h"])}</h2><p>{E(P["films_p"].format(n=n))}</p></div></div>\n')
    for t, rows in groups:
        body += f'<div class="pj-topic">\n<h3>{PROJECT_ICON}<a href="{RL}topics/#{t["id"]}">{E(t["name"][lg])}</a></h3>\n'
        for S, fs in rows:
            body += f'<p class="pj-series">{series_link(lg, RL, S["id"])}</p>\n<ul class="pj-films">\n'
            for f in fs:
                repo = f["site"]["repo"]
                names = dict(f["chapters"]) if lg == "en" else {k: f["site"]["chapters_es"].get(k, v) for k, v in f["chapters"]}
                uniq = {p for ps in repo.values() for p in ps}
                cnt = P["files1"] if len(uniq) == 1 else P["files"].format(n=len(uniq))
                title = f["title"] if lg == "en" else f["site"].get("title_es", f["title"])
                rws = "\n".join(f'<li><b>{E(names[cid])}</b><span>' + " ".join(f'<a href="{proj_url(p)}"><code>{E(proj_shown(p))}</code></a>' for p in repo[cid]) + '</span></li>'
                                for cid, _ in f["chapters"] if repo.get(cid))
                body += (f'<li><details><summary><span class="pj-ft">{E(title)}</span><small>{num(lg, f)} · {E(cnt)}</small></summary>\n'
                         f'<p class="film-links"><a href="{RL}{f["path"]}">{T(lg, "Watch the film", "Ver la película")}</a></p>\n'
                         f'<ul class="repo-list">\n{rws}\n</ul>\n</details></li>\n')
            body += '</ul>\n'
        body += '</div>\n'
    body += (f'</section>\n</main>\n<footer>{SOURCE[lg]}<p>{E(P["foot"])} {LOGOS[lg]} {NOTICES[lg]}</p></footer>\n'
             f'<script src="{R}assets/ambient.js"></script>\n<script src="{R}assets/learn/project.js" defer></script>\n</body>\n</html>\n')
    return h + f'<link rel="stylesheet" href="{R}assets/learn/route.css">\n<link rel="stylesheet" href="{R}assets/learn/project.css">\n</head>\n' + body


# The home page stays a first view: the film, its two other steps, then two ways on: the learning route, and how the films were
# made. It names no topic and draws no route: both are on the Topics page (the author, 12 November 2026).
HOME_TEXT = {"en": ("Find your learning route", "How the films were made", "The example dbt project"),
             "es": ("Encuentra tu ruta de aprendizaje", "Cómo se hicieron las películas", "El proyecto de dbt de ejemplo")}


def home_next(lg, R):
    """The home page's ways on, after the film and its steps: the learning route, and how the films were made."""
    RL = R if lg == "en" else R[3:]
    return (f'<p class="home-next"><a class="btn primary" href="{RL}topics/">{HOME_TEXT[lg][0]}</a>'
            f'<a class="btn" href="{RL}{PROJECT_PATH}">{HOME_TEXT[lg][2]}</a><a class="btn" href="{RL}journey/">{HOME_TEXT[lg][1]}</a></p>\n')


# ---------------------------------------------------------------- the search of every film's words
# The Topics list searches what the films say: assets/learn/search.<lang>.json holds, for every film on the site, its title,
# series, topic, page, intro and captions (each line with its second, so a result opens the film there), and the topics and
# series themselves. It is made from the films' own caption files and site.json, and it changes with every film, so it isn't
# committed: `python site-tools/build_series.py --search` writes it, and so does the site's publish (--publish).
def cues(p):
    """A caption file's lines: [[second, text], ...]."""
    out = []
    for block in re.split(r"\n\s*\n", p.read_text(encoding="utf-8")):
        m = re.search(r"(?:(\d+):)?(\d\d):(\d\d)[.,]\d+\s*-->", block)
        if m:
            text = " ".join(l.strip() for l in block[m.end():].split("\n")[1:] if l.strip())
            out.append([int(m.group(1) or 0) * 3600 + int(m.group(2)) * 60 + int(m.group(3)), re.sub(r"<[^>]+>", "", text)])
    return out


def search_index(lg):
    """Every film, series and topic the search finds, in a language."""
    out_f, out_s = [], []
    for t in live():
        tn = t["name"][lg]
        out_s.append(dict(k="topic", t=tn, u=f'topics/#{t["id"]}', x=f'{t["who"][lg]}. {t["line"][lg]}'))
        for i in shown(t):
            e = entry(lg, i)
            if e["kind"] == "series":
                out_s.append(dict(k="series", t=e["title"], m=tn, u=e["href"], x=e["card"]))
            S = next((x for x in SERIES if x["id"] == i), None)
            if S is not None:
                for f in films(S)[1]:
                    site = f["site"]
                    out_f.append(dict(t=site.get("title_es", f["title"]) if lg == "es" else f["title"], s=e["title"], m=tn, u=f["path"],
                                      p=f'{f["key"]}-poster.jpg', x=f'{site[T(lg, "kicker", "kicker_es")]}. {site[T(lg, "lead", "lead_es")]}',
                                      c=cues(S["root"] / f["dir"] / "captions" / f"{lg}.vtt")))
                for _, _, h, _ in outside(S):  # its films whose pages are written by hand
                    out_f.append(dict(t=h["title"][lg], s=e["title"], m=tn, u=h["href"], p=h["poster"][lg], x=h["card"][lg],
                                      c=cues(ROOT / h["source"] / "captions" / f"{lg}.vtt")))
                continue
            h = HAND[i]
            if "films" in h:
                for key, _, d in h["films"]:
                    meta = json.loads((ROOT / "films" / d / "source" / "film.json").read_text()) if (ROOT / "films" / d / "source" / "film.json").exists() else {}
                    out_f.append(dict(t=meta.get("title", key.replace("-", " ").capitalize()), s=e["title"], m=tn, u=f'{h["href"]}{key}/', p=f"{key}-poster.jpg", x=e["card"],
                                      c=cues(ROOT / "films" / d / "captions" / f"{lg}.vtt")))
            else:
                out_f.append(dict(t=e["title"], s="", m=tn, u=h["href"], p=h["poster"][lg], x=e["card"], c=cues(ROOT / h["source"] / "captions" / f"{lg}.vtt")))
    return dict(v=1, films=out_f, groups=out_s)


def write_search():
    """Writes the search's words for each language; returns how many films they hold."""
    n = 0
    for lg in ("en", "es"):
        D = search_index(lg); n = len(D["films"])
        (WEB / "assets" / "learn" / f"search.{lg}.json").write_text(json.dumps(D, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    return n


def data():
    """The generated files that aren't pages: (path under site/, text)."""
    return [(f"assets/learn/route.{lg}.js", route_js(lg)) for lg in ("en", "es")]


def marks(S):
    return f'<!-- {S["id"]}: made by site-tools/build_series.py -->', f'<!-- /{S["id"]} -->'


OPEN, CLOSE = marks(FW)
BLOCKS = FW["blocks"]  # kept for callers that count From words to data's blocks
# the hand-written pages that show the topics as tiles: (path under site/, language, the path from that page to the site's root)
PUBLISH = "--publish" in sys.argv[1:]  # the site's publish: the tiles carry each series' count of films
TILES = []  # the pages that showed the topics as tiles; Make the call ends as the home page does now (the author, 14 November 2026)
HOME = [("index.html", "en", ""), ("es/index.html", "es", "../"), ("scenarios/index.html", "en", "../"), ("es/scenarios/index.html", "es", "../../")]  # three ways on (home_next())
TILE_MARKS = ('<!-- topics: made by site-tools/build_series.py -->', '<!-- /topics -->')


def block(lg, what, R, rel, films_, S=FW, page=""):
    """A series' card on a hand-written page (page, under site/): its first film, with a kicker that names the series."""
    if not films_:
        return ""
    if what == "prev":  # on the page of a series' film written by hand (outside()): the film before it
        n = next(k for k, _, h, _ in outside(S) if page.removeprefix("es/") == h["href"] + "index.html")
        prv = next((x for x in films_ if x["index"] == n - 2), None)
        return card(lg, prv, rel, R, kicker=f'← {T(lg, "Previous", "Anterior")} · {num(lg, prv)}') + "\n" if prv else ""
    if what == "next":  # the home page's card for the film to watch after the introduction: a row, as on the Topics page
        return (f'<div class="topic-grid rows" data-progress-text=\'{PT[lg]}\'>\n' + topic_card(lg, entry(lg, S["id"]), R if lg == "en" else R[3:], R) + '\n</div>\n')
    n = len(series_data(S)["films"])
    kicker = f'{SN(lg, S)}: {NUM[lg][n - 1]} {T(lg, "films", "películas")}' if n > 1 else SN(lg, S)
    return card(lg, films_[0], rel, R, kicker=kicker) + "\n"


def blocks():
    """The hand-written pages, with every series' blocks, the topics' tiles and their header filled in: (path under site/, html).
    A page with several blocks is listed once, with all of them filled."""
    texts = {}

    def fill(rel_path, o, c, inner):
        src = texts.get(rel_path) or (WEB / rel_path).read_text(); i, j = src.index(o), src.index(c)
        texts[rel_path] = src[:i + len(o)] + "\n" + inner + src[j:]
    for S in SERIES:
        films_ = films(S)[1]; o, c = marks(S)
        for rel_path, lg, what, R, rel in S["blocks"]:
            fill(rel_path, o, c, block(lg, what, R, rel, films_, S, rel_path))
    for rel_path, lg, R in TILES:
        fill(rel_path, *TILE_MARKS, tiles(lg, R))
    for rel_path, lg, R in HOME:
        fill(rel_path, *TILE_MARKS, home_next(lg, R))
    for rel_path in HAND_PAGES:
        src = texts.get(rel_path) or (WEB / rel_path).read_text()
        texts[rel_path] = re.sub(r'<header class="top">.*?</header>', lambda m: hand_header(rel_path), src, count=1)
    return [(rel, stamp(rel, text)) for rel, text in texts.items()]


def readme(S=FW):
    """A series' README, with its table of films filled in from the same data."""
    src = (S["root"] / "README.md").read_text(); o, c = "<!-- films: made by site-tools/build_series.py's readme() -->", "<!-- /films -->"
    learn = any(f["labs"] for f in films(S)[1])
    rows = (["| Film | Topic | Length | Chapters | Labs and scenarios | Script |", "|---|---|---|---|---|---|"] if learn else
            ["| Film | Topic | Length | Chapters | Pause and think | Script |", "|---|---|---|---|---|---|"])
    for f in films(S)[1]:
        rows.append(f"| [{f['title']}]({BASE}{f['path']}) | {f['site']['kicker']} | {f['len']} min | {len(f['chapters'])} | "
                    + (f"{f['labs']} labs, {f['quiz']} scenarios" if learn else f"{f['think']} questions" if f['think'] else "none")
                    + f" | [script]({f['dir']}/script.md) · [source]({f['dir']}/source/README.md) |")
    for n, _, h, sec in outside(S):  # its films whose pages are written by hand, in their own folders
        up = posixpath.relpath(h["source"], f"films/{S['dir']}")
        rows.insert(1 + n, f"| [{h['title']['en']}]({BASE}{h['href']}) | {h['kicker']['en']} | {minutes(sec)} min | {len(timing(ROOT / h['source'] / 'source')[0])} | "
                           + f"its own {h['labs']} labs and {h['quiz']} scenarios" + f" | [script]({up}/script.md) · [source]({up}/source/README.md) |")
    SL = series_learn(S)
    if SL:  # the series' own, for all its films
        rows += ["", f"For the whole series, on the site: [{SL['labs']} lab{'s' if SL['labs'] != 1 else ''}]({BASE}{S['slug']}/labs/) and [{SL['quiz']} scenarios]({BASE}{S['slug']}/scenarios/), "
                     f"in English and Spanish, from the words in [site/assets/{SL['dir']}/](../../site/assets/{SL['dir']}/)."]
    i, j = src.index(o), src.index(c)
    return src[:i + len(o)] + "\n" + "\n".join(rows) + "\n" + src[j:]


# ---------------------------------------------------------------- the lists every film has a row in
# Each film keeps its rows in its own folder, so two films never edit the same line: its Decided rows in decided.md, and its
# videos with their legibility in release.json (which .github/scripts/films.py also gathers for the release workflow). lists()
# makes the shared lists from them: each series' Decided table in its proposal.md. The table of films/legibility-report.md, which
# every film adds a row to, isn't committed, so films merging at once don't clash: legibility() makes the report with it, printed
# by `python site-tools/build_series.py --legibility` and shown in the summary of every site publish.
DECIDED = ("<!-- decided: made by site-tools/build_series.py from decided.md, the series' and each film's -->", "<!-- /decided -->")
LEGIBLE = ("<!-- films: made by site-tools/build_series.py from each film's release.json -->", "<!-- /films -->")
MONTHS = "January February March April May June July August September October November December".split()


def fill(src, marks, rows):
    """src with the lines between the two marks replaced by rows."""
    i, j = src.index(marks[0]), src.index(marks[1])
    return src[:i + len(marks[0])] + "\n" + "\n".join(rows) + "\n" + src[j:]


def decided_rows(p):
    """A decided.md's rows: "| 16 October 2026 | the decision |"."""
    return [l for l in p.read_text().split("\n") if re.match(r"\| \d", l)] if p.exists() else []


def when(row, p):
    """A row's date, to sort by."""
    m = re.match(r"\| (\d{1,2}) (\w+) (\d{4}) \|", row)
    if not m or m.group(2) not in MONTHS:
        sys.exit(f"{p.relative_to(ROOT)}: a row must start with its date, as \"| 16 October 2026 |\": {row[:60]}")
    return (int(m.group(3)), MONTHS.index(m.group(2)), int(m.group(1)))


def decided(folder):
    """A series' proposal.md with its Decided table made from its decided.md and each film's (films/<series>/<n-film>/decided.md,
    or, for a film whose pages are written by hand (outside()), the decided.md in its own folder), by date; rows of the same day keep
    their order, the series' first, then the films' by number."""
    films_ = [(int(re.match(r"\d+", d.name).group()), d / "decided.md") for d in folder.iterdir() if re.match(r"\d+-", d.name)]
    films_ += [(n, ROOT / h["source"] / "decided.md") for S in SERIES if ROOT / "films" / S["dir"] == folder for n, _, h, _ in outside(S)]
    files = [folder / "decided.md"] + [f for _, f in sorted(films_, key=lambda x: x[0])]
    rows = [(when(r, p), r) for p in files for r in decided_rows(p)]
    rows.sort(key=lambda x: x[0])
    return fill((folder / "proposal.md").read_text(), DECIDED, ["| Date | Decision |", "|---|---|"] + [r for _, r in rows])


LEGIBLE_NOTE = ("The table isn't kept in this file, so films that merge at once don't clash on it. Each film's row is `legibility` in its "
                "`release.json`: `python site-tools/build_series.py --legibility` prints this report with its table, and every publish "
                "of the site shows it in its run's summary.")


def legibility():
    """films/legibility-report.md, with its table of films made from each film's release.json (the committed file holds LEGIBLE_NOTE)."""
    sys.path.insert(0, str(ROOT / ".github" / "scripts"))
    import films as release_films
    rows = ["| Film | Texts | Under 28 px | Under 20 px | Median | Status |", "|---|---|---|---|---|---|"]
    for e in release_films.films():
        L = e.get("legibility")
        if L:
            rows.append(f"| {e['name']} | {L['texts']} | {L['under_28']} | {L['under_20']} | {L['median']} | {L['status']} |")
    return fill((ROOT / "films" / "legibility-report.md").read_text(), LEGIBLE, rows)


TOPIC_ROWS = ("<!-- topics: made by site-tools/build_series.py from the topics and each module's module.json -->", "<!-- /topics -->")


def readme_topics():
    """README.md, with its table of topics made from the topics, their series and each module's "who", so a film never edits
    it: a row names a topic's films and series, not what each film covers (that is on the series' pages)."""
    who = {m["id"]: m["who"]["en"] for m in load_modules()}
    rows = [f"The site has {say_n('en', len(live()))} big topics. Start with the first, the overview; then pick the topic you need, "
            "in any order. Each topic holds films and series.", "", "| Topic | What it covers | Films and series | For |", "|---|---|---|---|"]
    for t in live():
        items = ", ".join(f"[{entry('en', i)['title']}]({BASE}{entry('en', i)['href']})" for i in shown(t))
        rows.append(f"| {t['name']['en']} | {t['line']['en']} | {items} | {who.get(t['id'], '')} |")
    return fill((ROOT / "README.md").read_text(), TOPIC_ROWS, rows)


def lists():
    """Every shared list made from the films' own rows: (path from the repository's root, text)."""
    out = [(p.parent / "proposal.md", decided(p.parent)) for p in sorted((ROOT / "films").glob("*/proposal.md"))
           if DECIDED[0] in p.read_text()]
    return [(p.relative_to(ROOT).as_posix(), s) for p, s in out] + [("README.md", readme_topics())]


def pages():
    """Every generated page, of every series, and the Topics page: (path under site/, html)."""
    out = [("topics/index.html", topics_page("en")), ("es/topics/index.html", topics_page("es")),
           (f"{PROJECT_PATH}index.html", project_page("en")), (f"es/{PROJECT_PATH}index.html", project_page("es"))]
    for S in SERIES:
        series, films_ = films(S)
        if not films_:
            continue
        for lg in ("en", "es"):
            pre = "" if lg == "en" else "es/"
            if not S.get("single"):  # a film that stands alone has its page where a series' would be
                out.append((f'{pre}{S["slug"]}/index.html', series_page(lg, series, films_, S)))
            for f in films_:
                out.append((f'{pre}{f["path"]}index.html', film_page(lg, f, films_, series)))
                if f["labs"]:
                    out.append((f'{pre}{S["slug"]}/{f["key"]}/labs/index.html', learn_page(lg, f, "labs")))
                    out.append((f'{pre}{S["slug"]}/{f["key"]}/scenarios/index.html', learn_page(lg, f, "scenarios")))
            if series_learn(S):
                for which in ("labs", "scenarios"):
                    out.append((f'{pre}{S["slug"]}/{which}/index.html', series_learn_page(lg, S, series, films_, which)))
                for f in films_:  # a film that had labs and scenarios of its own: their old pages lead to the series' pack
                    if not S.get("single") and ((WEB / "assets" / f["key"] / "learn.en.js").exists() or (WEB / S["slug"] / f["key"] / "labs" / "index.html").exists()):
                        for which in ("labs", "scenarios"):
                            out.append((f'{pre}{S["slug"]}/{f["key"]}/{which}/index.html', moved_page(lg, S, f, which)))
    out += moved_series_pages()
    return [(rel, stamp(rel, text)) for rel, text in out]


def site_files():
    """Every file this script makes or fills under site/: the generated pages, the hand-written pages with their blocks, the
    generated data, and every other page of the site, as it is but with its links' versions (stamp()). check_site.py holds site/ to it."""
    made = pages() + blocks() + data()
    seen = {rel for rel, _ in made}
    rest = sorted(p.relative_to(WEB).as_posix() for p in WEB.rglob("*.html"))
    return made + [(rel, stamp(rel, (WEB / rel).read_text())) for rel in rest if rel not in seen]


if __name__ == "__main__":
    if sys.argv[1:] == ["--legibility"]:
        print(legibility()); sys.exit()
    if PUBLISH:  # only at publish time, after check_site.py: never commit what this writes
        tiled = {rel for rel, _, _ in TILES}
        for rel, text in blocks():
            if rel in tiled:
                (WEB / rel).write_text(text)
        print(f"filled the series' counts of films in {len(tiled)} pages, and wrote the search's words for {write_search()} films"); sys.exit()
    if sys.argv[1:] == ["--search"]:  # for a local look or a browser check: the file isn't committed
        print(f"wrote the search's words for {write_search()} films"); sys.exit()
    n = 0
    for rel, text in site_files():
        p = WEB / rel
        p.parent.mkdir(parents=True, exist_ok=True)
        if not p.exists() or p.read_text() != text:
            p.write_text(text); n += 1
    for rel, text in lists():
        if (ROOT / rel).read_text() != text:
            (ROOT / rel).write_text(text); n += 1
    for S in SERIES:
        if readme(S) != (S["root"] / "README.md").read_text():
            (S["root"] / "README.md").write_text(readme(S)); n += 1
        series, films_ = films(S)
        print(f"{S['name']['en']}: {len(films_)} film{'s' if len(films_) != 1 else ''}: " + ", ".join(f"{f['title']} ({f['len']} min{', ' + offers('en', f) if offers('en', f) else ''})" for f in films_))
    print(f"wrote {n} of {len(pages()) + len(blocks()) + len(data()) + len(lists()) + len(SERIES)} files (the series' own pages and the Topics page, their blocks in {len(blocks())} others, "
          f"the series' READMEs, and {len(lists())} lists the films have rows in)")
