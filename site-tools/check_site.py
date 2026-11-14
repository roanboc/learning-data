#!/usr/bin/env python3
"""Static checks for the Learning Data site. Run before every commit, from anywhere:

    python site-tools/check_site.py

It only reads files: no browser and no network (site-tools/smoke.py does the browser checks).
Declared audio can resolve through per-film audio.json pointers; deployment and browser checks restore and verify its bytes.
It prints what each check found, and exits with 1 if anything fails.

What it checks, page by page (every .html under site/):
- links: every local href and src resolves to a file (a folder means its index.html; /... and
  https://data.learn-all.org/... map to site/), every #id exists on its target page (except #t=,
  and the lab and old home hashes that scripts read), GitHub blob/tree links name a file in this repo, and
  download links name a file the release workflow publishes. Links inside the "Pause and think" packs count too.
- header: Start here, Topics, Making of, then EN and ES (in the "More" menu), with the right targets and the right current page;
  and "?", the guided tour, with the same steps in both languages.
- no leftover labels in the nav (Watch, Take it apart, Sharpen it, All films, Mira, Desarma).
- hreflang: exactly the pairs of real twins, each pointing back.
- the footer's one link (the source on GitHub), breadcrumbs, and the course bar (the sticky Watch · Labs · Scenarios steps).
- no film numbering (on the site and in the Markdown docs), and no stale film lengths.
- one film bundle per page, scripts in order, and each film's progress prefix where it belongs.
- Spanish captions: a Spanish page that plays an English film loads the film's captions first, each a copy of its source.
- Spanish pages: in Spanish, linking to Spanish pages when a twin exists, and marking links to English-only pages.
- a series' own labs and scenarios (build_series.series_learn): the same in both languages, each lab on one of its film's
  chapters, the labs listed in film order (the labs page numbers them 1 to N in that order), each scenario numbered by its film,
  in order, and pointing to a lab; its films' "Pause and think" questions stop at its labs.
- the journey pages are what site-tools/build_pages.py makes from their Markdown.
- the learning route (modules/route.json): every topic on it once, each goal's stops among the films and series on the site,
  the Topics page draws it, the list's rows in the route's order, and the home page leads to it, in both languages.
- opening stories: a film that opens on one (a "past" row in its site.json) quotes the line that says each beat, scenario,
  problem, solution, benefits and back to the story, in its script's Opening story table, in its narration's own words.
- opening turns: no film's narration or captions say the stock "Something had to change" (or "has to", "Algo tenía que cambiar"):
  each says why it couldn't go on in its own story's words; the reviewed films that still say it are left as they are.
- page intros: every film's site.json keeps its topic label (kicker) to 32 characters, its title (h1) to 75 and its intro (lead)
  to 300, in English and Spanish: on a laptop, one line, three lines and four lines at most, as on Day one.
- release status: no film's voice, captions, page text, Pause and think, labs or scenarios says a feature is in preview, in beta
  or generally available, in English or Spanish; it changes, and the film would have to change with it (tools/check.py looks on screen).
- no zero copy where the platform keeps one: a film that names Lakebase, LTAP, synced tables or a change data feed never says, in
  its voice, captions, page or Pause and think, that nothing is copied ("zero copy", "in place", "not one claim was copied"):
  the platform keeps the rows in a second form, or a managed copy; only a query sent to the source stores none.
- Pause and think: every pack's questions have one right answer and one near miss, options of like length (the right one at most a quarter
  longer than the longest wrong one, and clearly the longest in at most half a pack's questions), right answers spread across the options,
  and each Spanish pack's right answers and near misses in the English places. The first film's questions, a block of its pack of labs
  and scenarios, are read too.
- scenarios and labs: in every pack of labs and scenarios, each choice has one right option; a pack's right answers are spread across
  the options (at most half of its scenarios' in one place, and of its labs' rows, where a row marks one option right; a lab's own rows
  never all in one place); a sorting list's cards aren't written box by box, nor two boxes turn and turn about; an order scenario first shows its steps mixed, from its pack's start or by the one line every engine shares (MIXED); and the Spanish pack keeps the English places. A page shows
  them in the order written. Only the labs a page shows are read (a series' pack can point to one lab of each film's own pack), and not a
  series whose engine mixes the options as it shows them.
- scenarios' lengths: in the scenarios a page shows, in English and Spanish, the right option is at most a quarter longer than the
  longest wrong one, no option is under half the longest, and the right one is clearly the longest in at most half of a page's
  scenarios, as in Pause and think. Options that only name something (every one under 25 characters) aren't compared, nor the
  scenarios no page shows. A lab's rows of options are held to the same limits: among the rows of the labs a page shows, in each
  pack, in English and Spanish.
- posters: each poster tools/publish.py draws (site/assets/<key>-poster.jpg) carries its stamp, naming the player it was drawn
  from, and that is the player the site plays (its film.js), at the moment the film's film.json names. A player rebuilt without
  its poster, as after a fix in a series' shared code, would otherwise leave the old picture on the film's page and cards.
- places: a film drawn in the master data series' watercolour (its film.js declares WC_PLACES) has each place as a picture,
  drawn by tools/publish.py from the player the site plays (site/assets/<key>/places/, listed with that player in places.json),
  and no other film has the folder. The site's player shows those pictures instead of painting the places while the film plays,
  which froze the governance films again and again on a laptop (5 November 2026).
"""
import hashlib
import html.parser
import json
import pathlib
import re
import shutil
import subprocess
import sys
import tempfile
import urllib.parse
from media import available as media_available
from collections import Counter, defaultdict

ROOT = pathlib.Path(__file__).resolve().parents[1]
WEB = ROOT / "site"
SITE = "https://data.learn-all.org/"
REPO = "https://github.com/roanboc/learning-data"
RELEASES = sorted(ROOT.glob("films/**/release.json"))  # each film's videos, as the release workflow publishes them
# a film page's hero, in characters (Rodrigo, 10 November 2026): on a laptop the intro (lead) takes four lines at most, the title
# (h1) three, and the topic label (kicker) one; Day one is the model, with a title of two lines and an intro of four
INTRO_MOST = {"kicker": 32, "h1": 75, "lead": 300}

# ---------------------------------------------------------------- the site's rules, in one place
# pages with a real twin in the other language (§3.2); everything else has no hreflang
TWINS = ["", "labs/", "scenarios/", "journey/", "topics/", "sketch/", "when-things-go-wrong/",
         "when-things-go-wrong/silent-change/", "when-things-go-wrong/too-good-to-be-true/",
         "when-things-go-wrong/too-good-to-be-true/labs/", "when-things-go-wrong/too-good-to-be-true/scenarios/"]
# English-only pages and where their ES toggle goes
ES_TOGGLE = {"sketch/labs/": "es/sketch/", "sketch/scenarios/": "es/sketch/"}
NAV = {"en": ["Start here", "Topics", "Making of"], "es": ["Empieza aquí", "Temas", "Cómo se hizo"]}
# the footer holds no second navigation, only the source
FOOT = {"en": "Source on GitHub", "es": "Código en GitHub"}
OLD_NAV = {"Watch", "Take it apart", "Sharpen it", "All films", "Mira", "Desarma", "Labs", "Scenarios", "Situaciones"}
CRUMBS = {  # page: (text, the pages its links go to, in order)
    "labs/": ("Start here › The Inner Life of Data", [""]),
    "scenarios/": ("Start here › The Inner Life of Data", [""]),
    "es/labs/": ("Empieza aquí › La vida interior de los datos", ["es/"]),
    "es/scenarios/": ("Empieza aquí › La vida interior de los datos", ["es/"]),
    # a page under a topic names it, and links to it on the Topics page: Topics › the topic › the film or series
    "sketch/": ("Topics › Data modelling", ["topics/", "topics/"]),
    "es/sketch/": ("Temas › Modelado de datos", ["es/topics/", "es/topics/"]),
    "sketch/labs/": ("Topics › Data modelling › A Sharper Sketch", ["topics/", "topics/", "sketch/"]),
    "sketch/scenarios/": ("Topics › Data modelling › A Sharper Sketch", ["topics/", "topics/", "sketch/"]),
    "when-things-go-wrong/": ("Topics › Data quality › When things go wrong", ["topics/", "topics/"]),
    "es/when-things-go-wrong/": ("Temas › Calidad de datos › Cuando algo sale mal", ["es/topics/", "es/topics/"]),
    "when-things-go-wrong/silent-change/": ("Topics › Data quality › When things go wrong", ["topics/", "topics/", "when-things-go-wrong/"]),
    "es/when-things-go-wrong/silent-change/": ("Temas › Calidad de datos › Cuando algo sale mal", ["es/topics/", "es/topics/", "es/when-things-go-wrong/"]),
    **{f"{lg}when-things-go-wrong/too-good-to-be-true/{sub}": crumb
       for lg, crumb in (("", ("Topics › Data quality › When things go wrong", ["topics/", "topics/", "when-things-go-wrong/"])),
                         ("es/", ("Temas › Calidad de datos › Cuando algo sale mal", ["es/topics/", "es/topics/", "es/when-things-go-wrong/"])))
       for sub in ("", "labs/", "scenarios/")},
}
# the film bundles (one per page: they declare the same top-level names) and the progress prefix of each film
BUNDLES = {"assets/film/film.js": "ld", "assets/film/film.es.js": "ld",
           "assets/film3/film.js": "ld3", "assets/silent-change/film.js": "ld-silent-change",
           "assets/too-good-to-be-true/film.js": "ld-too-good-to-be-true"}
# the Making of films, sealed in a function each with their own element prefix, so both can play on one page; they record no progress
SEALED = {"assets/making-of/data-for-films.js": "dff", "assets/making-of/thats-not-quite-right.js": "nqr"}
# English films with Spanish captions: a Spanish page that plays one loads its captions first, a copy of src/i18n/es/captions.js in the film's source
CAPTIONS_ES = {"assets/film3/film.js": ("assets/film3/captions.es.js", "films/a-sharper-sketch/source"),
               "assets/silent-change/film.js": ("assets/silent-change/captions.es.js", "films/when-things-go-wrong/1-silent-change/source"),
               "assets/too-good-to-be-true/film.js": ("assets/too-good-to-be-true/captions.es.js", "films/when-things-go-wrong/2-too-good-to-be-true/source"),
               "assets/making-of/data-for-films.js": ("assets/making-of/data-for-films.captions.es.js", "films/making-of/1-data-for-films/source"),
               "assets/making-of/thats-not-quite-right.js": ("assets/making-of/thats-not-quite-right.captions.es.js", "films/making-of/2-the-process/source")}
PACKS = {"assets/learn/learn.en.js", "assets/learn/learn.es.js",
         "assets/silent-change/think.en.js", "assets/silent-change/think.es.js",
         "assets/too-good-to-be-true/think.en.js", "assets/too-good-to-be-true/think.es.js"}
# "Pause and think" packs whose stops are the film's own labs (the rest point to The Inner Life of Data's): the labs page, and the pack that names its labs
OWN_LABS = {"assets/too-good-to-be-true/think.en.js": ("when-things-go-wrong/too-good-to-be-true/labs/index.html", "assets/too-good-to-be-true/learn.en.js"),
            "assets/too-good-to-be-true/think.es.js": ("es/when-things-go-wrong/too-good-to-be-true/labs/index.html", "assets/too-good-to-be-true/learn.es.js")}
# a film's labs and scenarios, as its stepper and topic cards count them (None: it has none)
COUNTS = {"ld": ("8", "12"), "ld3": ("6", "12"), "ld-silent-change": (None, None), "ld-too-good-to-be-true": ("3", "10")}
# no film numbering (§8); only these code comments may match, and film3/film.js's recap line if it was never re-voiced
# a series numbers its own films, always as "Film 2 of 7" ("Película 2 de 7"): that's allowed; numbering the site's films isn't
NUMBERING = re.compile(r"film (one|two|three|[123])\b(?! of \d)(?!-)|(first|second|third) film|(primera|segunda|tercera) película|"
                       r"episod(e|io) [0-9]|\b(first|second|third) (video|episode)\b|"
                       r"\b(primer|segundo|tercer)[oa]? (video|episodio)\b|película (uno|dos|tres|[123])\b(?! de \d)(?!-)", re.I)  # (?!-): a key such as one-map-in-the-repo is a name, not a number
COMMENT_OK = {"assets/film3/film.js", "assets/silent-change/film.js", "assets/too-good-to-be-true/film.js"}
LENGTHS = re.compile(r"eight-minute|five-minute|six-minute|nueve minutos|seis minutos|· 9 min|· 5 min|"
                     r"\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)-minute\b|"
                     r"\b(un|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez) minutos\b|"
                     r"(?<![\d½.,:])\d+ ?(min|minute|minutes|minuto|minutos)\b", re.I)
# the stated lengths: 7½ min (intro, EN), 8 min (intro, ES, since its Spanish voice changed on 12 November 2026), 5½ (A Sharper Sketch,
# Silent change), and 6 min (Too good to be true)
HALVES = {"en": {"5½", "7½"}, "es": {"5½"}}
WHOLE = {"6 min", "8 min", "8 minutos"}
# time in a story, not a film's length, that this rule would read as one, by page: in Data architecture's labs and scenarios, an
# interruption is power lost for more than five minutes, and a cut of three minutes falls short of it; Spanish says the number in words.
# In Platform and solution architecture's, minutes without power per customer jump from about eight to nineteen and go back to nine
# (Spanish "diecinueve minutos" ends in "nueve minutos"), and the regulator's answer takes ten minutes
STORY_TIME = {"assets/data-architecture/learn.es.js": {"cinco minutos", "tres minutos"},
              "assets/platform-and-solution-architecture/learn.en.js": {"19 minutes"},
              "assets/platform-and-solution-architecture/learn.es.js": {"nueve minutos", "diez minutos", "19 minutos"}}
# the series (From words to data, In the weeds of data crafting, The map before the data): their pages, players, packs, counts,
# lengths and topics come from their own data, through site-tools/build_series.py (which makes their pages, and the Topics page),
# so a new film, or a new series, needs no change here
sys.path.insert(0, str(ROOT / "site-tools"))
sys.dont_write_bytecode = True
import build_series  # noqa: E402
SERIES_FILMS = build_series.all_films()
for _S in build_series.SERIES:
    _sl, _nm = _S["slug"], _S["name"]
    if not build_series.films(_S)[1] or _S.get("single"):  # a film that stands alone has no series page
        continue
    _tn = build_series.topic_of(_S["id"])["name"]
    TWINS.append(f"{_sl}/")
    CRUMBS[f"{_sl}/"] = (f"Topics › {_tn['en']} › {_nm['en']}", ["topics/", "topics/"])
    CRUMBS[f"es/{_sl}/"] = (f"Temas › {_tn['es']} › {_nm['es']}", ["es/topics/", "es/topics/"])
# a series' own labs and scenarios (build_series.series_learn): their two pages, the ids learn.js makes on them (each lab's, and
# #film-<n> for a film's situations), and their progress prefix, the series'
SERIES_LEARN, LEARN_IDS, LEARN_STORE = {}, {}, {}
for _S in build_series.SERIES:
    _SL = build_series.series_learn(_S) if build_series.films(_S)[1] else None
    if not _SL:
        continue
    _sl, _nm = _S["slug"], _S["name"]; _tn = build_series.topic_of(_S["id"])["name"]
    SERIES_LEARN[_S["id"]] = (_S, _SL)
    for _sub in ("labs/", "scenarios/"):
        TWINS.append(f"{_sl}/{_sub}")
        CRUMBS[f"{_sl}/{_sub}"] = (f"Topics › {_tn['en']} › {_nm['en']}", ["topics/", "topics/", f"{_sl}/"])
        CRUMBS[f"es/{_sl}/{_sub}"] = (f"Temas › {_tn['es']} › {_nm['es']}", ["es/topics/", "es/topics/", f"es/{_sl}/"])
    for _lg, _pre in (("en", ""), ("es", "es/")):
        LEARN_IDS[f"{_pre}{_sl}/labs/"] = {x["id"] for x in _SL[_lg]["labs"]}
        LEARN_IDS[f"{_pre}{_sl}/scenarios/"] = {f"film-{f}" for _, f, _ in _SL[_lg]["qs"]}
        LEARN_STORE[f"{_pre}{_sl}/labs/"] = LEARN_STORE[f"{_pre}{_sl}/scenarios/"] = _SL["prefix"]
for _f in SERIES_FILMS:
    _k, _S = _f["key"], _f["series"]; _sl, _nm = _S["slug"], _S["name"]; _tn = build_series.topic_of(_S["id"])["name"]
    for _sub in ("", "labs/", "scenarios/") if _f["labs"] else ("",):  # a film without labs and scenarios has only its Watch page
        TWINS.append(f"{_f['path']}{_sub}")
        if _S.get("single"):  # a film that stands alone sits under its topic, where a series' page would be
            CRUMBS[f"{_f['path']}{_sub}"] = (f"Topics › {_tn['en']}", ["topics/", "topics/"])
            CRUMBS[f"es/{_f['path']}{_sub}"] = (f"Temas › {_tn['es']}", ["es/topics/", "es/topics/"])
            continue
        CRUMBS[f"{_sl}/{_k}/{_sub}"] = (f"Topics › {_tn['en']} › {_nm['en']}", ["topics/", "topics/", f"{_sl}/"])
        CRUMBS[f"es/{_sl}/{_k}/{_sub}"] = (f"Temas › {_tn['es']} › {_nm['es']}", ["es/topics/", "es/topics/", f"es/{_sl}/"])
    BUNDLES[f"assets/{_k}/film.js"] = f"ld-{_k}"
    COMMENT_OK.add(f"assets/{_k}/film.js")  # the shared code's comments name The Inner Life of Data as the first film
    for _lg in ("en", "es") if _f["think"] else ():  # a film may have no Pause and think
        PACKS.add(f"assets/{_k}/think.{_lg}.js")
        if _f["labs"]:  # its questions' lab links go to its own labs; a film without labs has none (its .player data-labs is empty)
            OWN_LABS[f"assets/{_k}/think.{_lg}.js"] = (("es/" if _lg == "es" else "") + f"{_sl}/{_k}/labs/index.html", f"assets/{_k}/learn.{_lg}.js")
        elif _S["id"] in SERIES_LEARN:  # or to its series' own
            OWN_LABS[f"assets/{_k}/think.{_lg}.js"] = (("es/" if _lg == "es" else "") + f"{_sl}/labs/index.html", f"assets/{SERIES_LEARN[_S['id']][1]['dir']}/learn.{_lg}.js")
    COUNTS[f"ld-{_k}"] = (str(_f["labs"]), str(_f["quiz"])) if _f["labs"] else (None, None)
    CAPTIONS_ES[f"assets/{_k}/film.js"] = (f"assets/{_k}/captions.es.js", f"films/{_S['dir']}/{_f['dir']}/source")
    if "½" in _f["len"]:
        HALVES["en"].add(_f["len"]); HALVES["es"].add(_f["len"])
    else:
        WHOLE.add(_f["len"] + " min")
# the Topics page states each series' length in all, in whole minutes, from the same data
WHOLE |= build_series.series_totals()
# and each topic's row its films' length in all ("2 h 3 min", "40½ min")
_whole, _halves = build_series.topic_totals()
WHOLE |= _whole; HALVES["en"] |= _halves; HALVES["es"] |= _halves
# the Making of page states its two films' lengths: 5 min (Data for Films) and 4½ min (That's not quite right)
MAKING_OF_PAGES = {"journey/index.html", "es/journey/index.html", "journey/index.md", "es/journey/index.md"}
WORDS = {"en": "one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen "
               "seventeen eighteen nineteen twenty".split(),
         "es": "uno dos tres cuatro cinco seis siete ocho nueve diez once doce trece catorce quince dieciséis "
               "diecisiete dieciocho diecinueve veinte".split()}
TEXT_EXT = {".html", ".js", ".css", ".md", ".json", ".txt", ".svg", ".xml", ".vtt", ".srt", ".webmanifest"}
BLOCK = {"address", "article", "aside", "blockquote", "br", "dd", "details", "div", "dl", "dt", "figcaption", "figure",
         "footer", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hr", "li", "main", "nav", "ol", "p", "section",
         "summary", "table", "td", "th", "tr", "ul"}
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}


# every opening story's beats, said outright in the narration (AGENTS.md, Story and world): a film that opens on a story (a "past"
# row in its site.json) has a table under "## Opening story" in its script.md, a row for each beat, quoting the narration's words
BEATS = ["Scenario", "Problem", "Solution", "Benefits", "Back to the story"]
# the films made before the rule (28 October 2026), by series folder and number; a film that changes its opening adds its table
BEATS_BEFORE = {"analytics-engineering": range(1, 11), "enterprise-architecture": range(1, 12), "from-words-to-data": range(1, 8),
                "master-and-reference-data": range(1, 10), "data-governance": (0, 2, 3)}

# the turn from problem to solution said in the story's own words (AGENTS.md, Story and world; the author, 11 November 2026): no film
# says the stock "Something had to change" (or "has to", "Algo tenía que cambiar"); the reviewed films that still do are left as they are
STOCK_TURN = re.compile(r"\bsomething\s+(?:had|has|have|must|needs?|needed)\s+to\s+change\b|\bsomething\s+must\s+change\b"
                        r"|\balgo\s+(?:tiene|ten[ií]a|tendr[ií]a|deb[ei]a?|necesitaba)\s+(?:que\s+)?cambiar\b", re.I)
STOCK_BEFORE = {"agents-at-work-on-data": (1, 2, 3, 4, 6), "data-governance": (1, 6, 7), "governance-in-practice": (2, 3, 4, 5, 6),
                "governance-on-the-map": (2, 3), "what-an-agent-is": (1, 2, 3, 4, 5, 8, 9, 10)}

# a feature's release status changes, so no film says it (AGENTS.md, Sources and names on the day; the author, 5 November 2026):
# "preview", "beta", "generally available" (or GA), in English or in Spanish. The script's sources keep it, with its date.
STATUS = re.compile(r"\b(?:public |private )?preview\b|\bbeta\b|\bgenerally available\b|\bgeneral availability\b|\bversi[oó]n preliminar\b|"
                    r"\bvista previa\b|\bdisponib\w+ (?:de forma |en forma )?general\b|\bdisponibilidad general\b", re.I)
STATUS_GA = re.compile(r"\bGA\b")


# the platform's own copies (the author, 10 November 2026, on One copy, one platform): LTAP keeps "one logical copy", Postgres pages
# for the app and Parquet in the lake for analysis; Lakebase's change data feed writes a managed Delta table; synced tables are "a
# managed copy". A film about them says what copies and who keeps it, never that nothing is copied.
COPY_KEPT = re.compile(r"\bLakebase\b|\bLTAP\b|\bsynced tables?\b|\bchange data feed\b|\btablas sincronizadas\b", re.I)
NO_COPY = re.compile(r"\bzero[- ]cop(?:y|ies)\b|\bin place\b|\bnot (?:one|a single) \w+ (?:was |is |is ever )?copied\b|\bnothing (?:is |was )?copied\b|"
                     r"\bno cop(?:y|ies)\b(?! (?:for|of) )|\bcero copias\b|\ben su sitio\b|\bsin copiar\b|\bsin copias?\b", re.I)


# names the voice misreads as written (PLAYBOOK §5, Hear a real person's name, too): it reads "Deming", and "Deeming", with a long e,
# and W. Edwards Deming's surname is said DEM-ing, with a short e. A line's "say", or a pair in the film's film.json "say", spells
# such a name for the voice ("Demming"); the words on screen, the captions and the page keep it as it is written. Each row: the
# name as the voice would misread it, the spelling that makes the voice say it, and how it is said
VOICE_NAMES = [(re.compile(r"\bDe+ming\b"), "Demming", "W. Edwards Deming's surname is said DEM-ing, with a short e"),
               # The rope bridge at Quehue, which three films of People first follow, each made by its own thread: one spelling
               # of each name for the voice in every film, with the two spellings set aside on 12 November 2026 found too.
               (re.compile(r"\bQuehue\b|\bKeh?way\b"), "Kehweh",
                "Quehue, in Peru, is said KEH-weh, and every film that names it spells it one way for the voice"),
               (re.compile(r"\bApur[ií]mac\b|\bApooreemak\b"), "Ahpooreemahk",
                "the Apurímac is said ah-poo-REE-mahk, and every film that names it spells it one way for the voice"),
               (re.compile(r"\bQuechua\b"), "Ketchwa", "Quechua is said KETCH-wa"),
               (re.compile(r"\b[Mm]inka\b"), "meenka", "minka is said MEEN-ka")]


def release_status(text):
    """where a piece of a film's text names a feature's release status: (the words, the words around them)"""
    return [(m.group(0), ("…" if m.start() > 50 else "") + text[max(0, m.start() - 50):m.end() + 30].strip() + ("…" if m.end() + 30 < len(text) else ""))
            for m in sorted(list(STATUS.finditer(text)) + list(STATUS_GA.finditer(text)), key=lambda m: m.start())]


def voice_names(narr, pairs=None):
    """The names a film's voice would misread. Each line is taken as the voice reads it: its "say", or its text, after the film's
    own respellings (film.json "say": [[pattern, words], ...], as the voice tool applies them)."""
    src = narr.read_text(encoding="utf-8")
    if pairs is None:
        meta = narr.parents[1] / "film.json"
        pairs = json.loads(meta.read_text(encoding="utf-8")).get("say", []) if meta.exists() else []
    out = []
    for sid, sc in json.loads(src[src.index("{"):src.rindex("}") + 1]).items():
        for ln in sc.get("vo", []):
            said = ln.get("say") or ln["text"]
            for pattern, words in pairs:
                said = re.sub(pattern, words, said)
            for name, spelled, how in VOICE_NAMES:
                for hit in name.finditer(said):
                    out.append(f"{narr.relative_to(ROOT)} {sid}/{ln['id']}: the voice would read \"{hit.group(0)}\" as it's written: {how}; "
                               f"spell it \"{spelled}\" in the line's \"say\", or in film.json's \"say\"")
    return out


def json_strings(v, where=""):
    """every string in a JSON value, with where it is ("lead_es", "past[2].text")"""
    if isinstance(v, str):
        yield where, v
    elif isinstance(v, dict):
        for k, x in v.items():
            yield from json_strings(x, f"{where}.{k}" if where else k)
    elif isinstance(v, list):
        for i, x in enumerate(v):
            yield from json_strings(x, f"{where}[{i}]")

# ---------------------------------------------------------------- a small DOM, from the standard library's parser
class Node:
    def __init__(self, tag, attrs, parent, line):
        self.tag, self.attrs, self.parent, self.line, self.kids = tag, attrs, parent, line, []

    @property
    def cls(self):
        return (self.attrs.get("class") or "").split()

    def walk(self):
        for k in self.kids:
            if isinstance(k, Node):
                yield k
                yield from k.walk()

    def all(self, tag=None, cls=None, **attrs):
        out = []
        for n in self.walk():
            if tag and n.tag != tag:
                continue
            if cls and cls not in n.cls:
                continue
            if any(n.attrs.get(k.replace("_", "-")) != v if v is not True else k.replace("_", "-") not in n.attrs
                   for k, v in attrs.items()):
                continue
            out.append(n)
        return out

    def first(self, tag=None, cls=None, **attrs):
        r = self.all(tag, cls, **attrs)
        return r[0] if r else None

    def elements(self):
        return [k for k in self.kids if isinstance(k, Node)]

    def text(self):
        out = []
        for k in self.kids:
            if isinstance(k, Node):
                if k.tag not in ("script", "style"):
                    out.append(f" {k.text()} " if k.tag in BLOCK else k.text())
            else:
                out.append(k)
        return re.sub(r"\s+", " ", "".join(out)).strip()

    def up(self, pred):
        n = self.parent
        while n is not None:
            if pred(n):
                return n
            n = n.parent
        return None

    def lang(self):
        n = self
        while n is not None:
            if "lang" in n.attrs:
                return n.attrs["lang"]
            n = n.parent
        return None


class Parser(html.parser.HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node("#root", {}, None, 0)
        self.cur = self.root
        self.problems = []

    def handle_starttag(self, tag, attrs):
        n = Node(tag, {k: (v if v is not None else "") for k, v in attrs}, self.cur, self.getpos()[0])
        self.cur.kids.append(n)
        if tag not in VOID:
            self.cur = n

    def handle_startendtag(self, tag, attrs):
        self.cur.kids.append(Node(tag, {k: (v if v is not None else "") for k, v in attrs}, self.cur, self.getpos()[0]))

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        if self.cur.tag != tag:
            self.problems.append(f"line {self.getpos()[0]}: </{tag}> closes <{self.cur.tag}> (from line {self.cur.line})")
        n = self.cur
        while n is not self.root and n.tag != tag:
            n = n.parent
        if n is not self.root:
            self.cur = n.parent

    def handle_data(self, data):
        self.cur.kids.append(data)


# ---------------------------------------------------------------- pages
class Page:
    def __init__(self, path):
        self.path = path
        self.file = path.relative_to(WEB).as_posix()                       # "sketch/labs/index.html"
        self.key = self.file[:-len("index.html")] if self.file.endswith("index.html") else self.file  # "sketch/labs/"
        self.url = SITE + self.key
        self.src = path.read_text(encoding="utf-8")
        p = Parser()
        p.feed(self.src)
        p.close()
        if p.cur is not p.root:
            p.problems.append(f"<{p.cur.tag}> from line {p.cur.line} is never closed")
        self.markup = p.problems
        self.dom = p.root
        h = self.dom.first("html")
        self.lang = h.attrs.get("lang", "") if h else ""
        self.ids = Counter(n.attrs["id"] for n in self.dom.walk() if n.attrs.get("id"))
        self.redirect = bool(self.dom.first("meta", http_equiv="refresh"))
        self.is404 = self.file == "404.html"
        self.scripts = [n for n in self.dom.all("script")]
        self.local_scripts = []
        for s in self.scripts:
            if s.attrs.get("src"):
                kind, target, _ = resolve(self, s.attrs["src"])
                if kind == "site":
                    self.local_scripts.append(target)
        self.bundles = [s for s in self.local_scripts if s in BUNDLES]
        self.sealed = [s for s in self.local_scripts if s in SEALED]

    @property
    def es(self):
        return self.key.startswith("es/")

    def twin_key(self):
        base = self.key[3:] if self.es else self.key
        if base not in TWINS:
            return None
        return base if self.es else "es/" + base


def resolve(page, ref):
    """-> (kind, target, fragment). kind: site (target = path under site/), repo (path in this repo),
    release (file name), external, special."""
    ref = ref.strip()
    if not ref or re.match(r"(mailto|tel|javascript|data|blob):", ref, re.I):
        return "special", None, None
    url, frag = urllib.parse.urldefrag(urllib.parse.urljoin(page.url, ref))
    if url.startswith(SITE) or url + "/" == SITE:
        path = urllib.parse.unquote(urllib.parse.urlsplit(url).path)[len("/"):]
        return "site", path, frag
    if urllib.parse.urlsplit(url).netloc == urllib.parse.urlsplit(SITE).netloc:
        return "outside", url, frag  # too many ../: the link climbs out of /
    m = re.match(re.escape(REPO) + r"/(?:blob|tree)/main/(.*)$", url)
    if m:
        return "repo", urllib.parse.unquote(m.group(1)).rstrip("/"), frag
    m = re.match(re.escape(REPO) + r"/releases/(?:latest/)?download/(?:[^/]+/)?([^/]+)$", url)
    if m:
        return "release", m.group(1), frag
    return "external", url, frag


def file_of(path):
    """site/ path of a link target -> (file under site/ or None, problem or None)"""
    if path == "" or path.endswith("/"):
        f = path + "index.html"
    else:
        f = path
    if media_available(WEB / f):
        return f, None
    if (WEB / f).is_dir():
        return None, "is a folder: add a trailing /"
    return None, "missing"


def key_of(f):
    return f[:-len("index.html")] if f.endswith("index.html") else f


# ---------------------------------------------------------------- report
class Report:
    def __init__(self):
        self.sections = []

    def check(self, name):
        s = {"name": name, "fails": [], "notes": []}
        self.sections.append(s)
        return s

    def done(self):
        bad = 0
        for s in self.sections:
            ok = not s["fails"]
            bad += not ok
            print(f"{'PASS' if ok else 'FAIL'}  {s['name']}" + ("" if ok else f"  ({len(s['fails'])})"))
            for f in s["fails"]:
                print(f"      - {f}")
            for n in s["notes"]:
                print(f"      · {n}")
        print()
        print(f"{len(self.sections) - bad} of {len(self.sections)} checks passed." +
              (" All good." if not bad else f" {bad} failed."))
        return 1 if bad else 0


def js_comment_spans(src):
    """Where the comments are in a JavaScript file: [(start, end)]. Skips strings, template literals and
    (roughly) regular expressions, so a // inside a string isn't taken for a comment."""
    spans, i, n = [], 0, len(src)
    prev = ""  # last significant character, to tell a regex from a division
    while i < n:
        c = src[i]
        if c == "/" and i + 1 < n and src[i + 1] == "/":
            j = src.find("\n", i)
            j = n if j < 0 else j
            spans.append((i, j))
            i = j
            continue
        if c == "/" and i + 1 < n and src[i + 1] == "*":
            j = src.find("*/", i + 2)
            j = n if j < 0 else j + 2
            spans.append((i, j))
            i = j
            continue
        if c in "'\"`":
            j = i + 1
            while j < n and src[j] != c:
                j += 2 if src[j] == "\\" else 1
            i = j + 1
            prev = c
            continue
        if c == "/" and (prev == "" or prev in "(,=:[!&|?{};+-*%<>~^\n" or re.search(r"\b(return|typeof|case|in|of)\s*$", src[max(0, i - 12):i])):
            j, cls = i + 1, False
            while j < n and src[j] != "\n":
                if src[j] == "\\":
                    j += 2
                    continue
                if src[j] == "[":
                    cls = True
                elif src[j] == "]":
                    cls = False
                elif src[j] == "/" and not cls:
                    break
                j += 1
            i = j + 1
            prev = "/"
            continue
        if not c.isspace():
            prev = c
        i += 1
    return spans


def js_flat(src):
    """A script with its comments, and the words inside its strings, blanked: every bracket, comma and key stays where it was,
    so brackets can be matched and keys found without a string's words getting in the way."""
    out, i, n = list(src), 0, len(src)
    for a, b in js_comment_spans(src):
        out[a:b] = [c if c == "\n" else " " for c in out[a:b]]
    while i < n:
        c = out[i]
        if c in "'\"`":
            j = i + 1
            while j < n and out[j] != c:
                j += 2 if out[j] == "\\" else 1
            out[i + 1:j] = [x if x == "\n" else " " for x in out[i + 1:j]]
            i = j
        i += 1
    return "".join(out)


def js_close(flat, i):
    """The place just past the bracket that closes the one opening at flat[i], in a script js_flat() has blanked."""
    depth = 0
    for j in range(i, len(flat)):
        if flat[j] in "[{(":
            depth += 1
        elif flat[j] in "]})":
            depth -= 1
            if not depth:
                return j + 1
    return len(flat)


def js_items(flat, i):
    """The items of the array (or the entries of the object) that opens at flat[i], as (start, end), split at its own commas."""
    out, depth, start = [], 0, i + 1
    for j in range(i, len(flat)):
        c = flat[j]
        if c in "[{(":
            depth += 1
        elif c in "]})":
            depth -= 1
            if not depth:
                return out + ([(start, j)] if flat[start:j].strip() else [])
        elif c == "," and depth == 1:
            out.append((start, j))
            start = j + 1
    return out


# ---------------------------------------------------------------- opening stories
def plain_words(t):
    """Text as it's said: JS escapes undone, curly quotes straightened, spaces collapsed."""
    t = re.sub(r"\\u([0-9a-fA-F]{4})", lambda m: chr(int(m.group(1), 16)), t)
    t = re.sub(r"\\(.)", r"\1", t)
    t = t.translate(str.maketrans({"\u2018": "'", "\u2019": "'", "\u201c": '"', "\u201d": '"', "\u00a0": " "}))
    return re.sub(r"\s+", " ", t).strip()


def opening_beats(film):
    """What's missing from a film's Opening story table (in its script.md): a row for each beat, each quoting words its narration says."""
    script, narr = film / "script.md", film / "source/src/narration.js"
    if not script.exists() or not narr.exists():
        return [f"{film.relative_to(ROOT)}: no script.md or source/src/narration.js to find its opening story's beats in"]
    m = re.search(r"^## Opening story\n(.*?)(?=^## |\Z)", script.read_text(), re.M | re.S)
    if not m:
        return [f"{script.relative_to(ROOT)}: no \"## Opening story\" table quoting the line that says each beat "
                f"({', '.join(BEATS)}): see AGENTS.md, Story and world"]
    said = plain_words(" ".join(re.findall(r'"text":"((?:[^"\\]|\\.)*)"', narr.read_text())))
    rows = {}
    for line in m.group(1).splitlines():
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if line.startswith("|") and len(cells) > 1:
            rows[cells[0].strip("* ").lower()] = " | ".join(cells[1:])
    out = []
    for beat in BEATS:
        quotes = re.findall(r'["\u201c]([^"\u201c\u201d]+)["\u201d]', rows.get(beat.lower(), ""))
        if not quotes:
            out.append(f"{script.relative_to(ROOT)}: its Opening story table has no row \"{beat}\" quoting the line that says it")
        for q in quotes:
            for part in re.split(r"\s*(?:\u2026|\.\.\.)\s*", plain_words(q)):
                if part and part not in said:
                    out.append(f"{script.relative_to(ROOT)}: {beat}: \"{part[:70]}\" isn't in source/src/narration.js as it's said")
    return out


# Pause and think: what makes a question fair but not obvious (AGENTS.md, Video craft; PLAYBOOK §7)
THINK_LONGER = 1.25   # the right answer at most this much longer than the longest wrong one
THINK_SHORTEST = 0.5  # the shortest option at least this share of the longest
THINK_CLEARLY = 1.10  # "clearly the longest": longer than every other option by more than this, in at most half a pack's questions
THINK_ONE_PLACE = 0.40  # across the site, no position holds more than this share of the right answers


def think_questions(path):
    """A Pause and think pack's questions, in order: {key: [(text, ok, near), ...]}, read from its source as written. The first
    film's are the think:{ block of its pack of labs and scenarios (assets/learn/learn.<lang>.js), and only that block is read."""
    src, out = path.read_text(), {}
    block = re.search(r"^think:\{", src, re.M)
    if block:
        src = src[block.end() - 1:]
        src = src[:js_close(js_flat(src), 0)]
    said = r'"(?:[^"\\]|\\.)*"'  # a string; a key before the question holds one, or an object of them (a link to go deeper)
    for m in re.finditer(r'(?:"([\w-]+)"|\b([\w-]+))\s*:\s*\{(?:\s*\w+:(?:' + said + r'|\{(?:[^{}"]|' + said + r')*\}),)*\s*q:"', src):
        s = src.find("opts:[", m.end())
        i, depth, in_str = s + 6, 1, False
        while i < len(src) and depth:
            c = src[i]
            if in_str:
                if c == "\\":
                    i += 1
                elif c == '"':
                    in_str = False
            elif c == '"':
                in_str = True
            elif c == "[":
                depth += 1
            elif c == "]":
                depth -= 1
            i += 1
        out[m.group(1) or m.group(2)] = [(json.loads('"' + t + '"'), "ok:true" in f, "near:true" in f)
                                        for t, f in re.findall(r'\{t:"((?:[^"\\]|\\.)*)"((?:,\s*\w+:true)*)\}', src[s + 6:i - 1])]
    return out


def think_faults(path, en=None):
    """What gives a pack's answers away: one right answer and one near miss per question, options of like length,
    the right one not clearly the longest in most questions, nor always in one place; a Spanish pack's in the English places."""
    rel, qs, out = path.relative_to(ROOT), think_questions(path), []
    clearly = 0
    for k, opts in qs.items():
        ok = [i for i, o in enumerate(opts) if o[1]]
        near = [i for i, o in enumerate(opts) if o[2] and not o[1]]
        if len(opts) < 3 or len(ok) != 1 or len(near) != 1 or any(o[1] and o[2] for o in opts):
            out.append(f"{rel}: \"{k}\" needs three options or more, one right (ok:true) and one near miss (near:true) that is wrong for a clear reason")
            continue
        n = [len(o[0]) for o in opts]
        right, wrong = n[ok[0]], max(x for i, x in enumerate(n) if i != ok[0])
        if right > THINK_LONGER * wrong:
            out.append(f"{rel}: \"{k}\": the right answer is {right} characters, the longest wrong one {wrong}: its length gives it away")
        if min(n) < THINK_SHORTEST * max(n):
            out.append(f"{rel}: \"{k}\": options of {'/'.join(map(str, n))} characters: give the short ones the same detail")
        clearly += right > THINK_CLEARLY * wrong
        if en is not None and k in en and [i for i, o in enumerate(en[k]) if o[1]] + [i for i, o in enumerate(en[k]) if o[2]] != ok + near:
            out.append(f"{rel}: \"{k}\": its right answer and near miss aren't in the places the English pack puts them")
    if en is not None and set(qs) != set(en):
        out.append(f"{rel}: its questions {sorted(qs)} aren't the English pack's {sorted(en)}")
    if clearly > -(-len(qs) // 2):
        out.append(f"{rel}: the right answer is clearly the longest option in {clearly} of {len(qs)} questions: make the wrong ones as full")
    places = {[i for i, o in enumerate(opts) if o[1]][0] for opts in qs.values() if sum(o[1] for o in opts) == 1}
    if len(qs) > 1 and len(places) == 1:
        out.append(f"{rel}: every right answer is option {places.pop() + 1}: spread them")
    return out


# Scenarios and labs: where the right answer sits (AGENTS.md, Video craft; PLAYBOOK §7). A page shows a scenario's options, a
# lab's rows of options and a sorting list's cards in the order their pack writes them. Until 12 November 2026 only Pause and
# think was checked, and in most scenarios the right answer was the second option.
SPREAD_ONE_PLACE = 0.40  # across the site's scenarios, no position holds more than this share of the right answers
# an engine (site/assets/<engine>/learn.js) that mixes the options itself each time it shows them, with the words that do it:
# the packs of the series it shows aren't read
SPREAD_SHUFFLED = {"enterprise-architecture": "ix=order(O.map("}
# an order scenario's first showing, where its pack gives no start: the one line every engine mixes the steps with, mixed(n, s) for
# n steps and a number s of the scenario's own, so each scenario is mixed its own way, the same each time. It holds to
# order_mixed(), which tests/test_spread.py tries on this line itself.
MIXED = ("const mixed=(n,s)=>{"
         "const hs=x=>{x=Math.imul(x^x>>>16,0x45d9f3b);x=Math.imul(x^x>>>16,0x45d9f3b);return(x^x>>>16)>>>0;},"
         "run=o=>[1,n-1].some(d=>o.every((k,p)=>!p||(k-o[p-1]+n)%n===d)),"
         "fine=o=>n<4?o.some((k,p)=>k!==p):!run(o)&&o.filter((k,p)=>k===p).length<=n/4&&o.filter((k,p)=>p&&k===o[p-1]+1).length<=n/3;"
         "for(let t=0;t<60;t++){const key=Array.from({length:n},(_,i)=>hs(((s|0)+1)*7919+t*104729+i*1013+n)),"
         "o=key.map((_,i)=>i).sort((a,b)=>key[a]-key[b]||a-b);if(fine(o))return o;}"
         "return Array.from({length:n},(_,i)=>(2*i+1)%(n|1));};")
# A scenario's options: the right one mustn't be the one that explains everything. The limits are Pause and think's (THINK_*), read
# on the scenarios a page shows, in English and Spanish. In the packs written before 12 November 2026, the right option was more
# than a quarter longer than every wrong one in 85 of the 97 scenarios a page shows. A lab's rows of options are held to the same
# limits: the right phrase was that much longer in 16 of the 25 rows a page shows whose options are more than names.
SPREAD_NAMES = 25  # options that only name something, every one shorter than this, aren't compared: a name's length says nothing


def spread_most(n, k):
    """How many of n right answers one place may hold, with k options each: half of them, or an even share where the options
    are too few for half (three rows of two options can do no better than two and one)."""
    return max(n // 2, -(-n // k))


def box_by_box(boxes):
    """True where a sorting list's cards are written box by box: in the boxes' own order, or each box's cards together."""
    if len(boxes) < 3 or len(set(boxes)) < 2:
        return False
    runs = [b for i, b in enumerate(boxes) if not i or boxes[i - 1] != b]
    return runs == sorted(runs) or (len(runs) == len(set(boxes)) and len(boxes) > len(runs))


def turn_about(boxes):
    """True where four or more cards go to two boxes turn and turn about: one, the other, one, the other."""
    return len(boxes) > 3 and len(set(boxes)) == 2 and all(x != y for x, y in zip(boxes, boxes[1:]))


def order_mixed(start):
    """Whether an order's first showing, the steps' numbers in the places it shows them, is mixed enough not to give the order
    away: not in order; and with four steps or more, not in reverse, nor in either from some step on round to the one before
    it, with at most a quarter of the steps where they belong and at most a third still following the step before them."""
    n = len(start)
    if n < 4:
        return start != sorted(start)
    run = any(all((start[p] - start[p - 1]) % n == d for p in range(1, n)) for d in (1, n - 1))
    return not run and sum(k == p for p, k in enumerate(start)) <= n / 4 and sum(start[p] == start[p - 1] + 1 for p in range(1, n)) <= n / 3


def learn_pack(path):
    """What a pack of labs and scenarios asks, read from its source as written: {"qs": [...], "labs": {id: {...}}}.
    A scenario has its type and title; for a "choice", opts, the (text, right) of its options; for a "sort", boxes, the place
    of each card's box among the boxes; for an "order", n, its steps, and start, its first showing where the pack gives one;
    film and q where a series' pack only points to a film's own scenario (its place in that film's pack).
    A lab has its kind and film; rows, the (text, right) options of each row that marks one right (a compose lab's parts, a
    field's rules); and boxes for a sorting lab.
    The scenarios are the array that starts a line with qs:[ (the first film's is inside its quiz:{, A Sharper Sketch's is
    const QS=[), and the labs the one that starts a line with labs:[."""
    src, out = path.read_text(), {"qs": [], "labs": {}}

    def part(pattern, text):
        m = re.search(pattern, text, re.M)
        if not m:
            return None, None
        text = text[m.end() - 1:]
        flat = js_flat(text)
        end = js_close(flat, 0)
        return text[:end], flat[:end]

    def word(text, flat, a, b, key):
        m = re.compile(r"\b" + key + r':"').search(flat, a, b)
        return plain_words(text[m.end():flat.index('"', m.end())]) if m else None

    def number(flat, a, b, key):
        m = re.compile(r"\b" + key + r":(\d+)").search(flat, a, b)
        return int(m.group(1)) if m else None

    def options(text, flat, i):
        return [(word(text, flat, a, b, "t") or "", bool(re.compile(r"\bok:(?:true|!0)").search(flat, a, b)))
                for a, b in js_items(flat, i) if flat[a:b].lstrip().startswith("{")]

    def boxes(text, flat, a, b):
        bm, im = re.compile(r"\bbuckets:\[").search(flat, a, b), re.compile(r"\bitems:\[").search(flat, a, b)
        if not bm or not im:
            return None
        keys = [plain_words(m.group(1)) for x, y in js_items(flat, bm.end() - 1) for m in [re.match(r'\s*\["((?:[^"\\]|\\.)*)"', text[x:y])] if m]
        cards = [word(text, flat, x, y, "b") for x, y in js_items(flat, im.end() - 1)]
        return [keys.index(c) if c in keys else -1 for c in cards]

    text, flat = part(r"^(?:qs:|const QS=)\[", src)
    if text is None:
        text, flat = part(r"^quiz:\{", src)
        if text is not None:
            m = re.search(r"\bqs:\[", flat)
            text, flat = (text[m.end() - 1:], flat[m.end() - 1:]) if m else (None, None)
    for a, b in js_items(flat, 0) if flat else []:
        if not flat[a:b].lstrip().startswith("{"):
            continue
        q = {"type": word(text, flat, a, b, "type"), "title": word(text, flat, a, b, "title") or "", "film": number(flat, a, b, "film"),
             "q": number(flat, a, b, "q"), "opts": None, "boxes": None, "n": None, "start": None}
        m = re.compile(r"\bopts:\[").search(flat, a, b)
        if q["type"] == "choice" and m:
            q["opts"] = options(text, flat, m.end() - 1)
        elif q["type"] == "sort":
            q["boxes"] = boxes(text, flat, a, b)
        elif q["type"] == "order":
            m, st = re.compile(r"\bitems:\[").search(flat, a, b), re.compile(r"\bstart:\[([\d,\s]*)\]").search(flat, a, b)
            q["n"] = len(js_items(flat, m.end() - 1)) if m else 0
            q["start"] = [int(x) for x in st.group(1).split(",") if x.strip()] if st else None
        out["qs"].append(q)
    text, flat = part(r"^labs:\[", src)
    for a, b in js_items(flat, 0) if flat else []:
        if not flat[a:b].lstrip().startswith("{"):
            continue
        lab = {"kind": word(text, flat, a, b, "kind"), "film": number(flat, a, b, "film"), "rows": [], "boxes": None}
        for m in re.compile(r"\b(?:opts|rules):\[").finditer(flat, a, b):
            if re.compile(r"\bok:").search(flat, m.end(), js_close(flat, m.end() - 1)):
                lab["rows"].append(options(text, flat, m.end() - 1))
        if lab["kind"] == "sort":
            lab["boxes"] = boxes(text, flat, a, b)
        out["labs"][word(text, flat, a, b, "id")] = lab
    return out


def spread_faults(rel, P, labs, es=None):
    """What gives a pack's answers away by where they sit: P is what learn_pack() read, labs the ids of the labs a page shows,
    es the Spanish pack (rel names the English one, so the Spanish one's faults name its twin). One right option in each
    choice; among the scenarios, and again among the labs' rows, no place holds more of the right answers than spread_most()
    allows; a lab's own rows not all in one place; a sorting list's cards not box by box, nor two boxes turn and turn about; an
    order's first showing mixed (order_mixed()), where the pack gives it; and the Spanish pack's options and cards in the English
    places."""
    out = []
    choices = [(f'"{q["title"]}"', q["opts"]) for q in P["qs"] if q["opts"] is not None]
    rows = [(f'lab "{k}"', row) for k, lab in P["labs"].items() if k in labs for row in lab["rows"]]
    for name, opts in choices + rows:
        if sum(r for _, r in opts) != 1:
            out.append(f"{rel}: {name}: {sum(r for _, r in opts)} of its options are marked right (ok:true); a choice has one")
    at = lambda opts: next(i for i, (_, r) in enumerate(opts) if r)
    for what, group in (("scenarios", choices), ("labs' rows", rows)):
        group = [opts for _, opts in group if sum(r for _, r in opts) == 1]
        if len(group) > 1:
            most, (i, c) = spread_most(len(group), min(map(len, group))), Counter(map(at, group)).most_common(1)[0]
            if c > most:
                out.append(f"{rel}: the right answer is option {i + 1} in {c} of its {len(group)} {what} (at most {most} in one place): spread them")
    for k, lab in P["labs"].items():
        one = [row for row in lab["rows"] if sum(r for _, r in row) == 1] if k in labs else []
        if len(one) > 1 and len({at(row) for row in one}) == 1:
            out.append(f"{rel}: lab \"{k}\": the right option is number {at(one[0]) + 1} in every row: spread them")
    sorts = [(f'"{q["title"]}"', q["boxes"]) for q in P["qs"] if q["boxes"]] + [(f'lab "{k}"', lab["boxes"]) for k, lab in P["labs"].items() if k in labs and lab["boxes"]]
    for name, boxes in sorts:
        if -1 in boxes:
            out.append(f"{rel}: {name}: a card names a box that isn't one of its boxes")
        elif box_by_box(boxes) or turn_about(boxes):
            out.append(f"{rel}: {name} lists its cards {'box by box' if box_by_box(boxes) else 'turn and turn about'} ({', '.join(str(b + 1) for b in boxes)}): mix them")
    for q in P["qs"]:
        if q["start"] is not None and (sorted(q["start"]) != list(range(q["n"])) or not order_mixed(q["start"])):
            out.append(f"{rel}: \"{q['title']}\": its start ({q['start']}) must hold each of its {q['n']} steps once, and mixed: not in order, in reverse, in either from some step on round, nor with most steps where they belong")
    if es is not None:
        shape = lambda X: ([(q["type"], [r for _, r in q["opts"]] if q["opts"] is not None else None, q["boxes"], q["start"]) for q in X["qs"]],
                           {k: ([[r for _, r in row] for row in lab["rows"]], lab["boxes"]) for k, lab in X["labs"].items()})
        (qs, ls), (qs_es, ls_es) = shape(P), shape(es)
        twin = str(rel).replace(".en.js", ".es.js")
        if len(qs) != len(qs_es) or set(ls) != set(ls_es):
            out.append(f"{twin}: its labs and scenarios aren't the English pack's")
        else:
            out += [f"{twin}: scenario {i + 1} (\"{P['qs'][i]['title']}\"): its options or cards aren't in the places the English pack puts them" for i, (x, y) in enumerate(zip(qs, qs_es)) if x != y]
            out += [f"{twin}: lab \"{k}\": its options or cards aren't in the places the English pack puts them" for k in ls if ls[k] != ls_es[k]]
    return out


def length_read(q):
    """A scenario's options by their lengths: (the right one's, the longest wrong one's, every option's), or None where lengths
    aren't compared: no options, not one right option (spread_faults() says so), or options that only name something, every
    one under SPREAD_NAMES characters."""
    opts = q["opts"]
    if opts is None or len(opts) < 2 or sum(r for _, r in opts) != 1:
        return None
    size = [len(t) for t, _ in opts]
    if max(size) < SPREAD_NAMES:
        return None
    return next(x for x, (_, r) in zip(size, opts) if r), max(x for x, (_, r) in zip(size, opts) if not r), size


def lab_rows(P, labs):
    """The rows of options in the labs a page shows, as length_faults() reads a scenario: P is what learn_pack() read, labs the
    ids of the labs a page shows. Each row is named by its lab and its place there."""
    return [{"title": f"lab {k}, row {i + 1}", "opts": row} for k, lab in P["labs"].items() if k in labs for i, row in enumerate(lab["rows"])]


def length_faults(group, shown, what="scenarios"):
    """What gives a scenario's answer away by its length, as in Pause and think: shown is [(file, scenario)], the scenarios one
    page shows, as learn_pack() read them, and group names that page's pack in the fault about them all. The right option at most
    THINK_LONGER times the longest wrong one; no option under THINK_SHORTEST of the longest; and the right one clearly the
    longest (by more than THINK_CLEARLY) in at most half of the page's scenarios. A pack's lab rows are read the same way
    (lab_rows(), with what="lab rows")."""
    out, clearly, n = [], 0, 0
    for rel, q in shown:
        if length_read(q) is None:
            continue
        right, wrong, size = length_read(q)
        n += 1
        if right > THINK_LONGER * wrong:
            out.append(f"{rel}: \"{q['title']}\": the right option is {right} characters, the longest wrong one {wrong}: its length gives it away")
        if min(size) < THINK_SHORTEST * max(size):
            out.append(f"{rel}: \"{q['title']}\": options of {'/'.join(map(str, size))} characters: give the short ones the same detail")
        clearly += right > THINK_CLEARLY * wrong
    if clearly > -(-n // 2):
        out.append(f"{group}: the right option is clearly the longest in {clearly} of the {n} {what} its page shows: make the wrong ones as full")
    return out


def jpeg_comments(b):
    """the comments (COM segments) in a JPEG's headers"""
    out, i = [], 2
    while b[:2] == b"\xff\xd8" and i + 4 <= len(b) and b[i] == 0xFF and b[i + 1] != 0xDA:
        n = int.from_bytes(b[i + 2:i + 4], "big")
        if b[i + 1] == 0xFE:
            out.append(b[i + 4:i + 2 + n].decode("utf-8", "replace"))
        i += 2 + n
    return out


def poster_faults():
    """What's wrong with the posters tools/publish.py draws: each must carry its stamp, naming the player it was drawn from (the
    first 16 hex digits of its film.js's SHA-256) and the moment, and that must be the player the site plays, at the moment the
    film's film.json names. publish.py writes the stamp as it draws the poster."""
    out, seen = [], set()
    for rel in RELEASES:
        for e in json.loads(rel.read_text()):
            src = ROOT / e["dir"]
            if src in seen or not (src / "film.json").exists() or not (src / "tools" / "publish.py").exists():
                continue
            seen.add(src)
            meta = json.loads((src / "film.json").read_text())
            if not meta.get("poster"):
                continue
            fix = f"run python tools/build.py, then python tools/publish.py --keep-sound, in {e['dir']}, and look at the poster it draws"
            poster, player = WEB / "assets" / f"{meta['key']}-poster.jpg", ROOT / e["site_player"]
            if not poster.exists() or not player.exists():
                out.append(f"site/assets/{meta['key']}-poster.jpg or {e['site_player']}: missing: {fix}")
                continue
            notes = [c for c in jpeg_comments(poster.read_bytes()) if c.startswith("Drawn by tools/publish.py")]
            m = re.search(r"from the player ([0-9a-f]{16}) at (\S+)", notes[-1]) if notes else None
            sha = hashlib.sha256(player.read_bytes()).hexdigest()[:16]
            moment = "%s/%s%+g" % tuple(meta["poster"])
            if not m:
                out.append(f"site/assets/{meta['key']}-poster.jpg: no stamp of the player it was drawn from: {fix}")
            elif m.group(1) != sha:
                out.append(f"site/assets/{meta['key']}-poster.jpg: drawn from another player than {e['site_player']} (an older build?): {fix}")
            elif m.group(2) != moment:
                out.append(f"site/assets/{meta['key']}-poster.jpg: drawn at {m.group(2)}, but film.json's poster is {moment}: {fix}")
    return out, len(seen)


def places_faults():
    """What's wrong with the places tools/publish.py draws as pictures for the site's player (wash.js): a film whose film.js declares
    WC_PLACES needs site/assets/<key>/places/places.json, stamped with that film.js (the first 16 hex digits of its SHA-256), and
    each picture it lists, a WebP; the folder holds nothing else, and a film without places has no folder."""
    out, n, seen = [], 0, set()
    for rel in RELEASES:
        for e in json.loads(rel.read_text()):
            player = ROOT / e["site_player"]
            if not player.exists() or player in seen:
                continue
            seen.add(player)
            folder, fix = player.parent / "places", f"run python tools/build.py, then python tools/publish.py --keep-sound, in {e['dir']}"
            where = folder.relative_to(ROOT).as_posix()
            js = player.read_text(errors="replace")
            if "const WC_PLACES=" not in js:
                if folder.exists():
                    out.append(f"{where}: the film paints no places (no WC_PLACES in its film.js), so remove the folder: {fix}")
                continue
            n += 1
            listing = folder / "places.json"
            if not listing.exists():
                out.append(f"{where}/places.json: missing, so the player paints every place while the film plays: {fix}")
                continue
            m = json.loads(listing.read_text())
            if m.get("player") != hashlib.sha256(player.read_bytes()).hexdigest()[:16]:
                out.append(f"{where}: drawn from another player than {e['site_player']} (an older build?): {fix}")
            files = {v.get("file") for v in m.get("places", {}).values()}
            for f in sorted(x for x in files if x):
                b = (folder / f).read_bytes()[:12] if (folder / f).exists() else b""
                if b[:4] != b"RIFF" or b[8:12] != b"WEBP":
                    out.append(f"{where}/{f}: {'not a WebP picture' if b else 'missing'}: {fix}")
            for f in sorted(folder.iterdir()):
                if f.name != "places.json" and f.name not in files:
                    out.append(f"{where}/{f.name}: no place of the film's lists it: {fix}")
    return out, n


# ---------------------------------------------------------------- the checks
def md_links(text):
    """The relative links of a Markdown text, [words](target), leaving out code blocks and code spans."""
    text = re.sub(r"```.*?```", "", text, flags=re.S)
    text = re.sub(r"`[^`\n]*`", "", text)
    for m in re.finditer(r"\]\(<?([^)\s>]+)>?(?:\s+\"[^\"]*\")?\)", text):
        ref = m.group(1).split("#")[0].split("?")[0]
        if ref and not re.match(r"[a-zA-Z][\w+.-]*:", ref) and not ref.startswith("/"):
            yield m.group(1), urllib.parse.unquote(ref)


def md_link_faults():
    """Every relative link in the repository's Markdown resolves (the site's own pages are read as pages). A row of a film's
    decided.md is copied into its series' proposal.md, so a link there may resolve from either folder."""
    try:
        r = subprocess.run(["git", "ls-files", "*.md"], cwd=ROOT, capture_output=True, text=True, check=True)
        files = [ROOT / f for f in r.stdout.splitlines()]
    except (OSError, subprocess.CalledProcessError):
        files = [p for p in ROOT.rglob("*.md") if "node_modules" not in p.parts]
    bad, n = [], 0
    for f in sorted(files):
        rel = f.relative_to(ROOT)
        if rel.parts[0] in ("site", "dist", "node_modules") or not f.exists():
            continue
        bases = [f.parent]
        if f.name == "decided.md" and len(rel.parts) == 4 and rel.parts[0] == "films":
            bases.append(f.parent.parent)
        for shown, ref in md_links(f.read_text(encoding="utf-8")):
            n += 1
            if not any((b / ref).exists() for b in bases):
                bad.append(f"{rel.as_posix()}: the link ({shown}) points at nothing in the repository: add the file, "
                           "or mend the link (a series' table of films links each film's source/README.md)")
    return bad, n


def main():
    rep = Report()
    pages = {}
    for p in sorted(WEB.rglob("*.html")):
        pg = Page(p)
        pages[pg.file] = pg
    by_key = {pg.key: pg for pg in pages.values()}
    normal = [pg for pg in pages.values() if not pg.redirect]
    release_names = "\n".join(p.read_text() for p in RELEASES)
    intro_stops = re.findall(r'\["(\w+)","\w+",\[', (WEB / "assets/learn/learn.js").read_text())
    sketch_labs = re.findall(r'\bid:"(\w+)"', (WEB / "assets/sketch/sketch.js").read_text())

    # -- markup
    s = rep.check("Markup: tags balanced, ids unique, labels point at real ids, images have alt text")
    for pg in pages.values():
        for m in pg.markup:
            s["fails"].append(f"{pg.file}: {m}")
        for i, c in pg.ids.items():
            if c > 1:
                s["fails"].append(f"{pg.file}: id \"{i}\" appears {c} times")
        for n in pg.dom.walk():
            for a in ("aria-labelledby", "aria-describedby", "for"):
                for ref in (n.attrs.get(a) or "").split():
                    if ref not in pg.ids:
                        s["fails"].append(f"{pg.file}:{n.line}: {a}=\"{ref}\" has no element with that id")
            if n.tag == "img" and "alt" not in n.attrs:
                s["fails"].append(f"{pg.file}:{n.line}: <img> without alt")
        if pg.lang != ("es" if pg.es else "en"):
            s["fails"].append(f"{pg.file}: <html lang=\"{pg.lang}\">, expected \"{'es' if pg.es else 'en'}\"")

    # -- links
    s = rep.check("Links: every local href and src resolves, and every #id exists on its target page")
    checked = 0

    def check_link(pg, ref, where, frag_ok=True):
        nonlocal checked
        kind, target, frag = resolve(pg, ref)
        checked += 1
        if kind == "site":
            f, problem = file_of(target)
            if problem:
                s["fails"].append(f"{where}: {ref} → site/{target} {problem}")
                return None
            if frag and f in pages and frag_ok:
                check_frag(pg, ref, where, pages[f], frag)
            return f
        if kind == "outside":
            s["fails"].append(f"{where}: {ref} climbs out of the site (to {target})")
        if kind == "repo":
            if target and not (ROOT / target).exists():
                s["fails"].append(f"{where}: {ref} → {target} is not in the repository")
        elif kind == "release":
            if target not in release_names:
                s["fails"].append(f"{where}: {ref} → the release workflow publishes no file named {target}")
        return None

    def check_frag(pg, ref, where, tp, frag):
        frag = urllib.parse.unquote(frag)
        if frag in tp.ids:
            return
        if re.fullmatch(r"t=\d+(:\d{1,2})?(\.\d+)?", frag):
            if tp.dom.first("canvas", id="film") or tp.redirect:
                return
            s["fails"].append(f"{where}: {ref}: #{frag} goes to a page without a film")
            return
        if tp.key in ("labs/", "es/labs/") and re.fullmatch(r"(explore[-/])?(\w+)", frag) and \
                re.fullmatch(r"(explore[-/])?(\w+)", frag).group(2) in intro_stops:
            return
        if tp.key == "sketch/labs/" and frag in sketch_labs:
            return
        if frag in LEARN_IDS.get(tp.key, ()):  # made by the series' learn.js
            return
        if tp.dom.first(cls="path", data_home=True) and re.fullmatch(r"(explore|practise)([-/]\w+)?", frag):
            return
        s["fails"].append(f"{where}: {ref}: no id \"{frag}\" on {tp.file}")

    for pg in pages.values():
        for n in pg.dom.walk():
            for a in ("href", "src", "poster"):
                v = n.attrs.get(a)
                if v is None or (n.tag == "link" and n.attrs.get("rel") in ("preconnect", "dns-prefetch")):
                    continue
                if pg.is404 and not re.match(r"(/|https?:|#|mailto:)", v):
                    s["fails"].append(f"{pg.file}:{n.line}: {a}=\"{v}\" is relative; the 404 page is served at any depth, so use /…")
                check_link(pg, v, f"{pg.file}:{n.line}")
            if n.tag == "img" and n.attrs.get("srcset"):
                for part in n.attrs["srcset"].split(","):
                    check_link(pg, part.split()[0], f"{pg.file}:{n.line}")
            if n.tag == "meta" and (n.attrs.get("property") in ("og:image", "og:url") or n.attrs.get("name") == "twitter:image"):
                check_link(pg, n.attrs.get("content", ""), f"{pg.file}:{n.line}")
            if n.tag == "meta" and n.attrs.get("http-equiv", "").lower() == "refresh":
                m = re.search(r"url=(.+)$", n.attrs.get("content", ""), re.I)
                if m:
                    check_link(pg, m.group(1).strip(), f"{pg.file}:{n.line} (refresh)")
        for sc in pg.scripts:
            if not sc.attrs.get("src"):
                for m in re.finditer(r"location\.(?:replace|assign)\(\s*\"([^\"]*)\"", sc.text()):
                    check_link(pg, m.group(1), f"{pg.file}:{sc.line} (redirect)", frag_ok=False)
        # links the "Pause and think" packs add: "more" links, and each question's lab
        packs = [x for x in pg.local_scripts if x in PACKS]
        for pk in packs:
            src = (WEB / pk).read_text()
            # only think.js uses the pack's links (the labs and scenarios pages load the pack for other things)
            if "assets/learn/think.js" in pg.local_scripts:
                for m in re.finditer(r'href:"([^"]*)"', src):
                    check_link(pg, m.group(1), f"{pg.file} (via {pk})")
                player = pg.dom.first(cls="player")
                labs = player.attrs.get("data-labs", "labs/") if player is not None else "labs/"
                if labs:
                    f = check_link(pg, labs, f"{pg.file} (.player data-labs, via {pk})")
                    want = OWN_LABS[pk][0] if pk in OWN_LABS else "es/labs/index.html" if pg.es else "labs/index.html"
                    if f and f != want:
                        s["fails"].append(f"{pg.file}: \"Pause and think\" lab links go to site/{f}, expected site/{want}")
                    own = re.findall(r'\{id:"(\w+)"', (WEB / OWN_LABS[pk][1]).read_text()) if pk in OWN_LABS else None
                    for stop in sorted(set(re.findall(r'stop:"([a-z]\w*)"', src))):
                        if own is not None and stop not in own:
                            s["fails"].append(f"{pk}: stop \"{stop}\" is not one of this film's labs ({', '.join(own)})")
                        elif own is None and stop not in intro_stops:
                            s["fails"].append(f"{pk}: stop \"{stop}\" is not a lab of The Inner Life of Data ({', '.join(intro_stops)})")
    s["notes"].append(f"{checked} links on {len(pages)} pages")

    # -- header
    s = rep.check("Header: Start here · Topics · Making of · EN/ES on every page, with the right current page")
    for pg in normal:
        lang = "es" if pg.es else "en"
        head = pg.dom.first("header", cls="top")
        nav = head.first("nav") if head else None
        if nav is None:
            s["fails"].append(f"{pg.file}: no header.top nav")
            continue
        kids = nav.elements()
        links = [k for k in kids if k.tag == "a"]
        # the language toggle sits in the header's "More" menu (folded on phones), after the nav
        more = head.all(cls="more")
        lang_box = [k for k in more[0].elements() if k.tag == "span" and "lang" in k.cls] if len(more) == 1 else []
        labels = [a.text() for a in links]
        want = NAV[lang]
        if labels != want or [k.tag for k in kids] != ["a"] * 3 or not lang_box:
            s["fails"].append(f"{pg.file}: nav reads {labels + ['EN/ES' if lang_box else '(no .lang)']}, expected {want + ['EN/ES']}")
            continue
        home = "es/" if pg.es else ""
        targets = [home, home + "topics/", home + "journey/"]
        for a, t in zip(links[:3], targets):
            kind, target, _ = resolve(pg, a.attrs.get("href", ""))
            f, _ = file_of(target) if kind == "site" else (None, None)
            if f != t + "index.html":
                s["fails"].append(f"{pg.file}: nav \"{a.text()}\" → {a.attrs.get('href')}, expected site/{t}")
        if any("nav-extra" in a.cls for a in links):
            s["fails"].append(f"{pg.file}: every nav link stays visible on phones (no nav-extra)")
        brand = head.first("a", cls="brand")
        bk, bt, _ = resolve(pg, brand.attrs.get("href", "")) if brand is not None else (None, None, None)
        if bk != "site" or file_of(bt)[0] != home + "index.html":
            s["fails"].append(f"{pg.file}: the brand must link to site/{home}")
        # language toggle
        tl = lang_box[0].all("a")
        if [a.text() for a in tl] != ["EN", "ES"]:
            s["fails"].append(f"{pg.file}: language toggle reads {[a.text() for a in tl]}, expected ['EN', 'ES']")
        else:
            for a, lg in zip(tl, ("en", "es")):
                kind, target, _ = resolve(pg, a.attrs.get("href", ""))
                f, problem = file_of(target) if kind == "site" else (None, "not a site page")
                if problem:
                    s["fails"].append(f"{pg.file}: {lg.upper()} → {a.attrs.get('href')} {problem}")
                    continue
                if pages[f].lang != lg:
                    s["fails"].append(f"{pg.file}: {lg.upper()} → site/{f}, which is not in {lg}")
                if lg == lang:
                    if not pg.is404 and f != pg.file:
                        s["fails"].append(f"{pg.file}: {lg.upper()} should stay on this page, goes to site/{f}")
                    if not pg.is404 and a.attrs.get("aria-current") != "true":
                        s["fails"].append(f"{pg.file}: {lg.upper()} is this page's language: add aria-current=\"true\"")
                else:
                    twin = pg.twin_key()
                    expect = twin if twin is not None else ("" if pg.es else ES_TOGGLE.get(pg.key, "es/" if not pg.is404 else "es/"))
                    if pg.is404:
                        expect = "es/"
                    if key_of(f) != expect:
                        s["fails"].append(f"{pg.file}: {lg.upper()} → site/{f}, expected site/{expect}")
                    has = a.attrs.get("hreflang") == lg
                    if twin is not None and not has:
                        s["fails"].append(f"{pg.file}: {lg.upper()} goes to this page's twin: add hreflang=\"{lg}\"")
                    if twin is None and has and not pg.is404:
                        s["fails"].append(f"{pg.file}: {lg.upper()} has hreflang, but this page has no twin")
        # current page
        cur = [(i, a.attrs.get("aria-current")) for i, a in enumerate(links) if "aria-current" in a.attrs]
        if sum(1 for _, v in cur if v == "page") > 1:
            s["fails"].append(f"{pg.file}: more than one nav link has aria-current=\"page\"")
        base = pg.key[3:] if pg.es else pg.key
        exp = None
        if base == "":
            exp = (0, "page")
        elif base == "topics/":
            exp = (1, "page")
        elif base == "journey/":
            exp = (2, "page")
        elif base.startswith(("labs/", "scenarios/")):
            exp = (0, "true")
        elif base.startswith(("sketch/", "when-things-go-wrong/") + tuple(S["slug"] + "/" for S in build_series.SERIES)):
            exp = (1, "true")
        if pg.is404:
            exp = None
        if cur != ([exp] if exp else []):
            name = lambda c: f"{links[c[0]].text()}={c[1]}"
            s["fails"].append(f"{pg.file}: current marker {[name(c) for c in cur] or 'none'}, expected {[name(exp)] if exp else 'none'}")
    s["notes"].append(f"{len(normal)} pages with a header; {len(pages) - len(normal)} redirect pages skipped")

    # Every header is made by header() in build_series.py, and every page is checked against what makes it (below), so its parts
    # are checked once here, in each language, and each page only for coming from a generator.
    s = rep.check("Header: made by build_series.py's header() on every page; its links to learn-all.org and LinkedIn, in each language")
    made = {rel for rel, _ in build_series.pages()} | set(build_series.HAND_PAGES) | MAKING_OF_PAGES
    for pg in normal:
        if pg.file not in made:
            s["fails"].append(f"{pg.file}: its header isn't made by header(): add the page to HAND_PAGES in site-tools/build_series.py")
    targets = ["https://learn-all.org", "https://www.linkedin.com/in/roanboc"]
    for lg, labels in (("en", ["Go to learn-all.org", "Contact Rodrigo on LinkedIn"]), ("es", ["Ir a learn-all.org", "Contactar a Rodrigo en LinkedIn"])):
        p = Parser()
        p.feed(build_series.header(lg, "", "../"))
        head = p.root.first("header", cls="top")
        tools = head.all(cls="nav-tools") if head else []
        links = tools[0].all("a") if len(tools) == 1 else []
        if [a.attrs.get("href") for a in links] != targets or [a.attrs.get("href") for a in head.all("a")].count(targets[0]) != 1:
            s["fails"].append(f"header({lg}): expected one link to learn-all.org and one to LinkedIn, in .nav-tools")
        for a, label in zip(links, labels):
            if a.attrs.get("aria-label") != label or "title" in a.attrs:
                s["fails"].append(f"header({lg}): the link needs one name in the page's language, without a title: {label}")
            icons = a.all("svg")
            if len(icons) != 1 or icons[0].attrs.get("aria-hidden") != "true" or icons[0].attrs.get("focusable") != "false" or icons[0].all("title"):
                s["fails"].append(f"header({lg}): {label} needs one decorative, non-focusable icon")
            if "tabindex" in a.attrs or "aria-current" in a.attrs:
                s["fails"].append(f"header({lg}): {label} must keep the browser's own keyboard behaviour, and not claim the current page")
        # the guided tour: one "?" in the tools, named in the page's language, that says where the tour's files are
        helps = tools[0].all("button", cls="help") if len(tools) == 1 else []
        if len(helps) != 1 or helps[0].attrs.get("aria-label") != {"en": "How this site works", "es": "Cómo funciona este sitio"}[lg] \
                or helps[0].attrs.get("data-tour") != "../assets/learn/" or helps[0].attrs.get("type") != "button":
            s["fails"].append(f"header({lg}): one button.help in .nav-tools, named in the page's language, with data-tour, the way to assets/learn/")
    # the tour's words: the same steps, on the same parts, in both languages, and every file its loader asks for
    tour = {lg: re.findall(r'\{(?:sel:"([^"]*)",)?title:"[^"]+",text:"[^"]+"\}', (WEB / "assets/learn" / f"tour.{lg}.js").read_text(encoding="utf-8")) for lg in ("en", "es")}
    if not tour["en"] or tour["en"] != tour["es"] or tour["en"][-1] != "":
        s["fails"].append("assets/learn/tour.en.js and tour.es.js: the same steps on the same parts (sel), in the same order, the last one with no part")
    for f in ("tour.js", "tour.css"):
        if not (WEB / "assets/learn" / f).is_file():
            s["fails"].append(f"assets/learn/{f}: missing; the header's \"?\" loads it")
    s["notes"].append(f"{len(normal)} pages with a header, each made by a generator; the guided tour has {len(tour['en'])} steps")

    # -- leftover labels
    s = rep.check("Nav: no leftover labels (Watch, Take it apart, Sharpen it, All films, Mira, Desarma…)")
    for pg in pages.values():
        for nav in pg.dom.all("nav"):
            for a in nav.all("a"):
                if a.text() in OLD_NAV:
                    s["fails"].append(f"{pg.file}:{a.line}: \"{a.text()}\" in <nav>")

    # -- hreflang
    s = rep.check("hreflang: exactly the pairs of real twins, each pointing back")
    alts = {}
    for pg in normal:
        alts[pg.file] = {n.attrs.get("hreflang"): n.attrs.get("href") for n in pg.dom.all("link", rel="alternate") if n.attrs.get("hreflang")}
    for pg in normal:
        a = alts[pg.file]
        twin = pg.twin_key()
        if twin is None:
            if a:
                s["fails"].append(f"{pg.file}: has hreflang links, but no twin page: remove them")
            continue
        en, es = (twin, pg.key) if pg.es else (pg.key, twin)
        if twin + "index.html" not in pages:
            s["fails"].append(f"{pg.file}: its twin site/{twin} is missing")
            continue
        for lg, k in (("en", en), ("es", es)):
            if a.get(lg) != SITE + k:
                s["fails"].append(f"{pg.file}: hreflang=\"{lg}\" is {a.get(lg)}, expected {SITE + k}")
        if set(a) - {"en", "es"}:
            s["fails"].append(f"{pg.file}: unexpected hreflang {sorted(set(a) - {'en', 'es'})}")
        if alts.get(twin + "index.html") != a:
            s["fails"].append(f"{pg.file}: its twin site/{twin} lists different hreflang links")
    s["notes"].append(f"{len(TWINS)} pairs expected")

    # -- footer
    s = rep.check("Footer: one link, to the source on GitHub, in the page's language; no second navigation row")
    for pg in normal:
        rows = [p for p in pg.dom.all("p", cls="foot-links") if p.up(lambda n: n.tag == "footer")]
        lg = "es" if pg.es else "en"
        if len(rows) != 1:
            s["fails"].append(f"{pg.file}: {len(rows)} footer rows, expected 1")
            continue
        links = rows[0].all("a")
        if [a.text() for a in links] != [FOOT[lg]] or links[0].attrs.get("href", "").rstrip("/") != REPO:
            s["fails"].append(f"{pg.file}: footer row reads {[a.text() for a in links]}, expected [{FOOT[lg]!r}] → {REPO}")
        if not pg.is404 and len(pg.dom.first("footer").all("p")) < 2:
            s["fails"].append(f"{pg.file}: the footer needs its licence text under the row")

    # -- course bar
    s = rep.check("Course bar: a film's steps sit in nav.course, right after the hero, never inside it")
    for pg in normal:
        path = pg.dom.first("ol", cls="path")
        if path is None:
            continue
        bar = path.up(lambda n: n.tag == "nav" and "course" in n.cls)
        if bar is None:
            s["fails"].append(f"{pg.file}: ol.path outside a nav.course")
            continue
        sibs = bar.parent.elements()
        k = sibs.index(bar)
        if k == 0 or not ({"hero", "page-head"} & set(sibs[k - 1].cls)):
            s["fails"].append(f"{pg.file}: nav.course should come right after the hero")
        if not bar.attrs.get("aria-label"):
            s["fails"].append(f"{pg.file}: nav.course needs an aria-label naming the film")

    # -- breadcrumbs
    s = rep.check("Breadcrumbs: on every page except home, topics and the journey, in place of the eyebrow")
    for pg in normal:
        base = pg.key[3:] if pg.es else pg.key
        crumbs = pg.dom.all("p", cls="crumbs")
        want = CRUMBS.get(pg.key)
        if want is None and base.startswith(("sketch/", "when-things-go-wrong/", "labs/", "scenarios/")):
            s["fails"].append(f"{pg.file}: a new page under a topic: add it to CRUMBS in check_site.py")
            continue
        if want is None:
            if crumbs:
                s["fails"].append(f"{pg.file}: has breadcrumbs, but home, topics and journey pages don't")
            continue
        if len(crumbs) != 1:
            s["fails"].append(f"{pg.file}: {len(crumbs)} breadcrumbs, expected 1")
            continue
        c = crumbs[0]
        if "eyebrow" not in c.cls:
            s["fails"].append(f"{pg.file}: the breadcrumb should be p.eyebrow.crumbs")
        if c.text() != want[0]:
            s["fails"].append(f"{pg.file}: breadcrumb reads \"{c.text()}\", expected \"{want[0]}\"")
        got = []
        for a in c.all("a"):
            kind, target, _ = resolve(pg, a.attrs.get("href", ""))
            got.append(key_of(file_of(target)[0] or "?") if kind == "site" else "?")
        if got != want[1]:
            s["fails"].append(f"{pg.file}: breadcrumb links go to {got}, expected {want[1]}")
        hero = c.up(lambda n: n.tag == "section")
        if hero is not None and [e for e in hero.all("p", cls="eyebrow") if "crumbs" not in e.cls]:
            s["fails"].append(f"{pg.file}: an eyebrow next to the breadcrumb; the breadcrumb replaces it")

    # -- numbering and lengths
    s = rep.check("No film numbering anywhere on the site (only allowlisted code comments)")
    t = rep.check("No stale film lengths (7½, 8, 5½, 5½ and 6 min; the journey says \"short film\")")
    allowed = []
    for p in sorted(WEB.rglob("*")):
        if not p.is_file() or p.suffix not in TEXT_EXT:
            continue
        rel = p.relative_to(WEB).as_posix()
        src = p.read_text(encoding="utf-8", errors="replace")
        spans = js_comment_spans(src) if rel in COMMENT_OK else []
        for m in NUMBERING.finditer(src):
            line = src.count("\n", 0, m.start()) + 1
            if any(a <= m.start() < b for a, b in spans):
                allowed.append(f"site/{rel}:{line}")
                continue
            s["fails"].append(f"site/{rel}:{line}: \"{m.group(0)}\"")
        if rel in BUNDLES or rel in SEALED or rel in {c for c, _ in CAPTIONS_ES.values()} or re.fullmatch(r"assets/learn/search\.\w+\.json", rel):
            continue  # the players' own code (timings, comments) and their captions (time in the story) are not site copy; nor
            # are the search's words, made from those captions when someone runs build_series.py --search (never committed)
        mk = rel in MAKING_OF_PAGES
        for m in LENGTHS.finditer(src):
            if m.group(0).lstrip("· ") in WHOLE or mk and m.group(0).lstrip("· ") == "5 min" or m.group(0).lower() in STORY_TIME.get(rel, ()):
                continue
            t["fails"].append(f"site/{rel}:{src.count(chr(10), 0, m.start()) + 1}: \"{m.group(0)}\"")
        if p.suffix == ".html":
            lg = "es" if rel.startswith("es/") else "en"
            for m in re.finditer(r"\d+½", src):  # the whole number, so a film of 10½ min reads as 10½, not 0½
                if m.group(0) not in HALVES[lg] and not (mk and m.group(0) == "4½"):
                    t["fails"].append(f"site/{rel}:{src.count(chr(10), 0, m.start()) + 1}: \"{m.group(0)}\" (this language's films are {' and '.join(sorted(HALVES[lg]))} min)")
    if allowed:
        s["notes"].append("allowed, in code comments: " + ", ".join(allowed))

    s = rep.check("No film numbering in the repository's Markdown docs either")
    docs = 0
    for md in sorted(ROOT.rglob("*.md")):
        if any(part in ("build", "dist", "models", "node_modules", ".git") for part in md.relative_to(ROOT).parts):
            continue
        # The films' questions and assumptions are the author's review notes, copied from each film's
        # thread, and name films by their number in a series; nothing in them reaches the site.
        if md.relative_to(ROOT).parts[:2] == ("docs", "assumptions"):
            continue
        docs += 1
        for i, line in enumerate(md.read_text(encoding="utf-8", errors="replace").splitlines(), 1):
            for m in NUMBERING.finditer(line):
                s["fails"].append(f"{md.relative_to(ROOT)}:{i}: \"{m.group(0)}\"")
    s["notes"].append(f"{docs} Markdown files")

    s = rep.check("Opening stories: each beat said outright (scenario, problem, solution, benefits, back to the story), quoted in the script")
    films = 0
    for site in sorted(ROOT.glob("films/*/*/site.json")):
        film, m = site.parent, re.match(r"(\d+)-", site.parent.name)
        if not m or not json.loads(site.read_text()).get("past") or int(m.group(1)) in BEATS_BEFORE.get(film.parent.name, ()):
            continue
        films += 1
        s["fails"] += opening_beats(film)
    s["notes"].append(f"{films} films; the {sum(len(v) for v in BEATS_BEFORE.values())} made before the rule (28 October 2026) are left as they are")

    s = rep.check("Opening turns: no film says the stock \"Something had to change\"; each says why it couldn't go on in its own story's words")
    films = 0
    for narr in sorted(ROOT.glob("films/*/*/source/src/narration.js")):
        film = narr.parents[2]
        m = re.match(r"(\d+)-", film.name)
        if m and (int(m.group(1)) in STOCK_BEFORE.get(film.parent.name, ())):
            continue
        films += 1
        for f in [narr] + sorted((film / "source/src/i18n").glob("*/captions.js")):
            for i, line in enumerate(f.read_text(encoding="utf-8").splitlines(), 1):
                for hit in STOCK_TURN.finditer(plain_words(line)):
                    s["fails"].append(f"{f.relative_to(ROOT)}:{i}: \"{hit.group(0)}\": say why it couldn't go on, in this story's own words")
    s["notes"].append(f"{films} films; the {sum(len(v) for v in STOCK_BEFORE.values())} reviewed films that still say it are left as they are")

    s = rep.check("Page intros: each film's topic label, title and intro short, as on Day one (an intro of four lines at most)")
    intros = sorted(ROOT.glob("films/**/site.json"))
    for f in intros:
        page = json.loads(f.read_text(encoding="utf-8"))
        for key, most in INTRO_MOST.items():
            for k in (key, key + "_es"):
                if len(page.get(k) or "") > most:
                    s["fails"].append(f"{f.relative_to(ROOT)} {k}: {len(page[k])} characters, at most {most}: \"{page[k][:60]}...\"")
    if s["fails"]:
        s["notes"].append("say who, what goes wrong and what is done, in the film's own world; the opening story and the details belong in the film")
    s["notes"].append(f"{len(intros)} films' page text, in English and Spanish")

    s = rep.check("Release status: no film says a feature is in preview, in beta or generally available, in its voice, captions, page, Pause and think, labs or scenarios")
    says = lambda f, where, t: [f"{f.relative_to(ROOT)}{where}: \"{w}\" in \"{near}\"" for w, near in release_status(plain_words(t))]
    made = lambda f: "/build/" in f.as_posix() or "/dist/" in f.as_posix()
    st_voices = [f for f in sorted(ROOT.glob("films/**/source/src/narration.js")) if not made(f)]
    for f in st_voices:
        for m in re.finditer(r'"(?:text|say)"\s*:\s*"((?:[^"\\]|\\.)*)"', f.read_text(encoding="utf-8")):
            s["fails"] += says(f, "", m.group(1))
    st_caps = [f for f in sorted(ROOT.glob("films/**/captions/*.vtt")) if not made(f)]
    for f in st_caps:
        for i, line in enumerate(f.read_text(encoding="utf-8", errors="replace").splitlines(), 1):
            s["fails"] += says(f, f":{i}", line)
    st_pages = sorted(ROOT.glob("films/**/site.json"))
    for f in st_pages:
        for where, t in json_strings(json.loads(f.read_text(encoding="utf-8"))):
            s["fails"] += says(f, f" {where}", t)
    st_packs = sorted(ROOT.glob("site/assets/**/think.*.js"))
    st_learn = sorted(ROOT.glob("site/assets/**/learn.*.js"))  # labs and scenarios: their notes too ("In the film vs in real life")
    for f in st_packs + st_learn:
        src = f.read_text(encoding="utf-8")
        for a, b in reversed(js_comment_spans(src)):
            src = src[:a] + re.sub(r"[^\n]", " ", src[a:b]) + src[b:]  # blank, keeping its lines
        for i, line in enumerate(src.splitlines(), 1):
            s["fails"] += says(f, f":{i}", line)
    if s["fails"]:
        s["notes"].append("say what the feature does, and keep its release status, with its date, in the script's sources: it changes, "
                          "and the film would have to change with it")
    s["notes"].append(f"{len(st_voices)} films' voices, {len(st_caps)} caption files, {len(st_pages)} films' page text, {len(st_packs)} Pause and think packs "
                      f"and {len(st_learn)} lab and scenario packs")
    s = rep.check("No zero copy where the platform keeps one: a film about Lakebase, LTAP, synced tables or a change data feed never says nothing is copied")
    nc_films = 0
    for f in st_pages:
        film = f.parent
        voice = film / "source" / "src" / "narration.js"
        if not voice.exists():
            continue
        page = json.loads(f.read_text(encoding="utf-8"))
        if not COPY_KEPT.search(voice.read_text(encoding="utf-8") + " " + " ".join(t for _, t in json_strings(page))):
            continue
        nc_films += 1
        texts = [(f"{voice.relative_to(ROOT)}", m.group(1)) for m in re.finditer(r'"(?:text|say)"\s*:\s*"((?:[^"\\]|\\.)*)"', voice.read_text(encoding="utf-8"))]
        texts += [(f"{c.relative_to(ROOT)}:{i}", line) for c in sorted((film / "captions").glob("*.vtt")) for i, line in enumerate(c.read_text(encoding="utf-8", errors="replace").splitlines(), 1)]
        texts += [(f"{f.relative_to(ROOT)} {where}", t) for where, t in json_strings(page)]
        key = None
        fj = film / "source" / "film.json"
        if fj.exists():
            key = json.loads(fj.read_text(encoding="utf-8")).get("key")
        for pk in sorted(WEB.glob(f"assets/{key}/think.*.js")) if key else []:
            src = pk.read_text(encoding="utf-8")
            for a, b in reversed(js_comment_spans(src)):
                src = src[:a] + re.sub(r"[^\n]", " ", src[a:b]) + src[b:]
            texts += [(f"{pk.relative_to(ROOT)}:{i}", line) for i, line in enumerate(src.splitlines(), 1)]
        for where, t in texts:
            for m in NO_COPY.finditer(plain_words(t)):
                s["fails"].append(f"{where}: \"{m.group(0)}\" in \"{plain_words(t)[max(0, m.start() - 50):m.end() + 30].strip()}\"")
    if s["fails"]:
        s["notes"].append("say what copies and who keeps it: the platform keeps the rows in a second form, or a managed copy, with no pipeline "
                          "a team runs; only a query sent to the source, as Lakehouse Federation does, stores no copy")
    s["notes"].append(f"{nc_films} films that name Lakebase, LTAP, synced tables or a change data feed")
    s = rep.check("Names in the voice: a name the voice misreads as written is spelled for it (Deming, said with its short e), "
                  "and a story's names are spelled one way in every film that tells it (the rope bridge at Quehue)")
    for f in st_voices:
        s["fails"] += voice_names(f)
    s["notes"].append(f"{len(st_voices)} films' voices, each line as the voice reads it: its \"say\" or its text, after the film's own respellings")
    s = rep.check("Pause and think: one right answer and one near miss per question, options of like length, right answers spread")
    places, packs = Counter(), 0
    # every film's pack, and the first film's, whose questions are a block of its pack of labs and scenarios
    for en_path in sorted(WEB.glob("assets/*/think.en.js")) + [WEB / "assets/learn/learn.en.js"]:
        packs += 1
        en = think_questions(en_path)
        s["fails"] += think_faults(en_path)
        es_path = en_path.with_name(en_path.name.replace(".en.js", ".es.js"))
        if es_path.exists():
            s["fails"] += think_faults(es_path, en)
        places.update(i for opts in en.values() for i, o in enumerate(opts) if o[1])
    total = sum(places.values())
    for i, c in sorted(places.items()):
        if total and c > THINK_ONE_PLACE * total:
            s["fails"].append(f"Pause and think: {c} of {total} right answers are option {i + 1}: spread them")
    s["notes"].append(f"{packs} packs, {total} questions; right answers by option: " + ", ".join(f"{i + 1}: {c}" for i, c in sorted(places.items())))

    s = rep.check("Scenarios and labs: one right option in each choice, right answers spread across the options, sorting cards not box by box, an order's steps mixed")
    learn = {p.parent.name: p for p in sorted(WEB.glob("assets/*/learn.en.js"))}
    learn["sketch"] = WEB / "assets/sketch/sketch.js"
    for k, words in SPREAD_SHUFFLED.items():
        if words not in (WEB / "assets" / k / "learn.js").read_text():
            s["fails"].append(f"site/assets/{k}/learn.js no longer mixes its options as it shows them ({words}…): take \"{k}\" off SPREAD_SHUFFLED, and spread the right answers of the packs it shows")
    mixed = sorted(SL["dir"] for _, SL in SERIES_LEARN.values() if SL["engine"] in SPREAD_SHUFFLED)
    read = {k: learn_pack(p) for k, p in learn.items() if k not in mixed}
    shown = {k: set(P["labs"]) for k, P in read.items()}  # the labs a page shows, by pack: every lab of a pack with pages of its own
    faults = defaultdict(list)
    # a series' pack that only points to each film's own lab and scenario: the film's pack holds the words, and shows nothing else
    for S, SL in SERIES_LEARN.values():
        P = read.get(SL["dir"])
        if not P or not any(q["q"] is not None and q["opts"] is None for q in P["qs"]):
            continue
        rel, keys = learn[SL["dir"]].relative_to(ROOT), {x["index"] + 1: x["key"] for x in build_series.films(S)[1]}
        shown.update({k: set() for k in keys.values() if k in read})
        for i, lab in P["labs"].items():
            if keys.get(lab["film"]) in read:
                shown[keys[lab["film"]]].add(i)
        mine = []
        for q in P["qs"]:
            F = read.get(keys.get(q["film"]))
            if F is None:
                continue  # a film still being made
            if q["q"] is None or q["q"] >= len(F["qs"]) or F["qs"][q["q"]]["type"] != q["type"]:
                faults[SL["dir"]].append(f"{rel}: \"{q['title']}\" points to scenario {q['q']} of film {q['film']}, which isn't a {q['type']} in site/assets/{keys[q['film']]}/learn.en.js")
            else:
                mine.append(F["qs"][q["q"]])
        faults[SL["dir"]] += spread_faults(rel, {"qs": mine, "labs": {}}, set())
    places = Counter()
    for k, P in read.items():
        rel, es_path = learn[k].relative_to(ROOT), learn[k].with_name("learn.es.js")
        faults[k] += spread_faults(rel, P, shown[k], learn_pack(es_path) if es_path.exists() else None)
        places.update(i for q in P["qs"] if q["opts"] is not None for i, (_, r) in enumerate(q["opts"]) if r)
    for k in sorted(read):
        s["fails"] += faults[k]
    total = sum(places.values())
    for i, c in sorted(places.items()):
        if total and c > SPREAD_ONE_PLACE * total:
            s["fails"].append(f"Scenarios: {c} of {total} right answers are option {i + 1}: spread them")
    s["notes"].append(f"{len(read)} packs, {total} scenarios with options; right answers by option: " + ", ".join(f"{i + 1}: {c}" for i, c in sorted(places.items())))
    s["notes"].append("not read, since their engine mixes the options as it shows them: " + ", ".join(mixed))
    # an order scenario's first showing: the pack's own start, or the one mix the engines share
    engines = [p for p in sorted(WEB.glob("assets/*/*.js")) if not re.match(r"film\.|captions\.|think\.e|learn\.e", p.name) and ".captions." not in p.name]
    orders = [p for p in engines if 'type==="order"' in p.read_text(encoding="utf-8")]
    for p in orders:
        src, rel = p.read_text(encoding="utf-8"), p.relative_to(ROOT)
        if "mixed(" in src:
            if MIXED not in src:
                s["fails"].append(f"{rel}: its mixed() isn't the line every engine mixes an order's steps with: copy MIXED from site-tools/check_site.py")
        elif "q.start" not in src and p.parent.name not in SPREAD_SHUFFLED:
            s["fails"].append(f"{rel}: an order scenario's first showing comes neither from its pack's start nor from mixed(), so it can show in order: mix it with MIXED (site-tools/check_site.py)")
    s["notes"].append(f"{len(orders)} engines show order scenarios: {sum('mixed(' in p.read_text(encoding='utf-8') for p in orders)} mix the steps with the shared line, the others take the pack's start or mix every list themselves")

    s = rep.check("Scenarios and labs' rows: options of like length, the right one not the one that explains everything")
    theirs = {k: learn_pack(p) for k, p in learn.items()}  # every pack, also those an engine mixes as it shows them: a length shows either way
    twin = lambda k: learn[k].with_name("learn.es.js")
    theirs_es = {k: learn_pack(twin(k)) for k in theirs if twin(k).exists()}
    shows, through = [], set()  # (the series' pack, the file a fault names, the scenarios its page shows); packs a page shows only through a series' pack
    for S, SL in SERIES_LEARN.values():
        P = theirs.get(SL["dir"])
        if not P or not any(q["q"] is not None and q["opts"] is None for q in P["qs"]):
            continue
        keys = {x["index"] + 1: x["key"] for x in build_series.films(S)[1]}
        through |= {SL["dir"]} | {k for k in keys.values() if k in theirs}
        for lg, all_ in (("en", theirs), ("es", theirs_es)):
            mine = [(f"site/assets/{keys[q['film']]}/learn.{lg}.js", all_[keys[q["film"]]]["qs"][q["q"]]) for q in P["qs"]
                    if keys.get(q["film"]) in all_ and q["q"] is not None and q["q"] < len(all_[keys[q["film"]]]["qs"])]
            shows.append((SL["dir"], f"site/assets/{SL['dir']}/learn.{lg}.js", mine))
    for k, P in theirs.items():
        if k not in through:
            shows.append((k, learn[k].relative_to(ROOT), [(learn[k].relative_to(ROOT), q) for q in P["qs"]]))
            if k in theirs_es:
                shows.append((k, twin(k).relative_to(ROOT), [(twin(k).relative_to(ROOT), q) for q in theirs_es[k]["qs"]]))
    lengths = defaultdict(list)
    for k, rel, mine in shows:
        lengths[k] += length_faults(rel, mine)
    packs, rows = len(lengths), []  # a lab's rows of options: those of the labs a page shows, pack by pack
    for k, P in theirs.items():
        for path, X in ((learn[k], P), (twin(k), theirs_es.get(k))):
            mine = [(path.relative_to(ROOT), row) for row in lab_rows(X, shown.get(k, set(P["labs"])))] if X else []
            lengths[k] += length_faults(path.relative_to(ROOT), mine, "lab rows")
            rows += [(k, row) for _, row in mine]
    for k in sorted(lengths):
        s["fails"] += lengths[k]
    compared = sum(length_read(q) is not None for _, _, mine in shows for _, q in mine)
    s["notes"].append(f"{packs} packs, {compared} scenarios compared, in English and Spanish; a page's own scenarios only, and not options that only name something (every one under {SPREAD_NAMES} characters)")
    s["notes"].append(f"{len({k for k, _ in rows})} packs with lab rows, {sum(length_read(row) is not None for _, row in rows)} of their {len(rows)} rows compared, in English and Spanish; the labs a page shows only")

    # -- scripts and progress
    s = rep.check("Scripts: one film bundle per page, in order, and each film's progress prefix")
    for pg in normal:
        ls = pg.local_scripts
        if len(pg.bundles) > 1:
            s["fails"].append(f"{pg.file}: {len(pg.bundles)} film bundles ({', '.join(pg.bundles)}); only one can load")
        order = [x for x in ls if x in BUNDLES or x in PACKS or x in ("assets/learn/think.js", "assets/learn/path.js", "assets/learn/next.js", "assets/sketch/sketch.js")]
        rank = lambda x: 0 if x in BUNDLES else 1 if x in PACKS else {"assets/learn/think.js": 2, "assets/sketch/sketch.js": 2, "assets/learn/path.js": 3, "assets/learn/next.js": 4}[x]
        if [rank(x) for x in order] != sorted(rank(x) for x in order):
            s["fails"].append(f"{pg.file}: scripts load as {order}; the order is film bundle → pack → think.js → path.js → next.js")
        film = pg.bundles[0] if pg.bundles else None
        tpl = pg.dom.first("template", id="next-panel")
        if ("assets/learn/next.js" in ls) != bool(tpl) and pg.dom.first("canvas", id="film"):
            s["fails"].append(f"{pg.file}: next.js and <template id=\"next-panel\"> go together")
        # back and forward 10 seconds come from one file, after the film bundle, on every page with the film's player bar
        if film and pg.dom.first("canvas", id="film") and pg.dom.first("input", id="scrub"):
            if "assets/seek.js" not in ls:
                s["fails"].append(f"{pg.file}: a film player without assets/seek.js (back and forward 10 seconds)")
            elif ls.index("assets/seek.js") < ls.index(film):
                s["fails"].append(f"{pg.file}: assets/seek.js loads before the film bundle")
        if "assets/learn/think.js" in ls and not any(x in PACKS for x in ls):
            s["fails"].append(f"{pg.file}: think.js without a language pack")
        if film == "assets/film3/film.js":
            if "assets/learn/path.js" in ls:
                s["fails"].append(f"{pg.file}: A Sharper Sketch's pages never load path.js (sketch.js paints the stepper)")
            if "assets/sketch/sketch.js" not in ls:
                s["fails"].append(f"{pg.file}: loads A Sharper Sketch without sketch.js")
        watch = pg.dom.first(id="watch")
        if film and watch is not None and watch.first("canvas", id="film") is not None:
            ds = watch.attrs.get("data-store")
            if ds is None and "assets/learn/path.js" in ls:
                s["fails"].append(f"{pg.file}: section#watch needs data-store=\"{BUNDLES[film]}\", or \"watched\" is never recorded")
            elif ds is not None and ds != BUNDLES[film]:
                s["fails"].append(f"{pg.file}: section#watch data-store=\"{ds}\", but the film here is {BUNDLES[film]}")
        path = pg.dom.first("ol", cls="path")
        if path is not None:
            try:
                json.loads(path.attrs.get("data-text", "{}"))
            except ValueError as e:
                s["fails"].append(f"{pg.file}: .path data-text is not JSON ({e})")
            ds = path.attrs.get("data-store", "ld")
            if pg.key in LEARN_STORE:  # a series' own labs and scenarios keep their progress under the series' prefix
                if ds != LEARN_STORE[pg.key]:
                    s["fails"].append(f"{pg.file}: .path data-store=\"{ds}\", but this series' labs and scenarios keep theirs as {LEARN_STORE[pg.key]}")
            elif film and ds != BUNDLES[film]:
                s["fails"].append(f"{pg.file}: .path data-store=\"{ds}\", but the film here is {BUNDLES[film]}")

    # -- the Making of films: sealed players, each with its own prefixed elements
    s = rep.check("Sealed films: each player's prefixed elements, and no unsealed film bundle beside them")
    for pg in normal:
        for sb in pg.sealed:
            p = SEALED[sb]
            for el in ("film", "play", "scrub", "time", "cc", "fs", "chapters", "snd"):
                if pg.ids.get(f"{p}-{el}", 0) != 1:
                    s["fails"].append(f"{pg.file}: loads {sb}, but has no #{p}-{el}")
            if pg.bundles:
                s["fails"].append(f"{pg.file}: a sealed film beside {', '.join(pg.bundles)}: that film would take the ids its player needs")
        if pg.sealed:
            s["notes"].append(f"{pg.file}: {len(pg.sealed)} sealed films")

    # -- Spanish captions over the English films
    s = rep.check("Spanish captions: each English film on a Spanish page loads its captions first, and each copy matches its film's source")
    for film, (cap, src) in CAPTIONS_ES.items():
        mine, theirs = WEB / cap, ROOT / src / "src/i18n/es/captions.js"
        if not mine.exists() or not theirs.exists() or mine.read_bytes() != theirs.read_bytes():
            s["fails"].append(f"site/{cap}: not a copy of {src}/src/i18n/es/captions.js; copy it, as the film's source README says")
    for pg in normal:
        ls = pg.local_scripts
        for film, (cap, _) in CAPTIONS_ES.items():
            if cap in ls and not pg.es:
                s["fails"].append(f"{pg.file}: an English page loads {cap}")
            player = f"{SEALED[film]}-film" if film in SEALED else "film"
            if film not in ls or not pg.es or not pg.ids.get(player):
                continue  # a lab or scenario page draws with the film's code, but never plays it
            if cap not in ls:
                s["fails"].append(f"{pg.file}: plays {film} without its Spanish captions: load {cap} before it")
            elif ls.index(cap) > ls.index(film):
                s["fails"].append(f"{pg.file}: loads {cap} after {film}; the captions must come first")
            else:
                s["notes"].append(f"{pg.file}: {cap}")

    # -- posters
    s = rep.check("Posters: each film's poster was drawn from the player the site plays, at the moment its film.json names")
    faults, n = poster_faults()
    s["fails"] += faults
    s["notes"].append(f"{n} posters drawn by tools/publish.py")

    # -- places, as pictures
    s = rep.check("Places: each watercolour film's places are pictures drawn from the player the site plays")
    faults, n = places_faults()
    s["fails"] += faults
    s["notes"].append(f"{n} films show their places as pictures")

    # -- the learning route
    s = rep.check("The learning route: every topic on it once, each goal's stops on the site, the Topics page draws it and the home page leads to it, in both languages")
    R = build_series.load_route()  # stops the run itself on a topic that isn't placed, or a goal's stop that isn't on the site
    for lg in ("en", "es"):
        D = build_series.route_data(lg); pre = "" if lg == "en" else "es/"
        on = [t["id"] for t in D["topics"]]
        if sorted(on) != sorted(t["id"] for t in build_series.live()):
            s["fails"].append(f"route.{lg}.js: its topics aren't the topics the site shows")
        if D["topics"][0]["items"][0]["kind"] != "film":
            s["fails"].append("modules/route.json: the route starts with one film, the introduction; its first topic's first item is a series")
        rel = f"{pre}topics/index.html"; pg = pages.get(rel)
        if pg is None:
            s["fails"].append(f"site/{rel}: missing"); continue
        need = [f"assets/learn/route.{lg}.js", "assets/learn/route.js", "assets/learn/topics.js"]
        if len([n for n in pg.dom.walk() if "data-route" in n.attrs]) != 1:
            s["fails"].append(f"site/{rel}: needs one [data-route] box, where route.js draws the route")
        if [x for x in need if x not in pg.local_scripts] or pg.local_scripts.index(need[0]) > pg.local_scripts.index(need[1]):
            s["fails"].append(f"site/{rel}: loads {', '.join(need)}, the route's data before its script")
        rows = [n.attrs.get("id") for n in pg.dom.all("section", cls="topic") if n.first("details") and n.first("summary")]
        if rows != on:
            s["fails"].append(f"site/{rel}: its list has a row for {rows}, but the route has {on}, in that order")
        # the home page stays a first view: no map and no list of topics, only the ways on, to the route and the Making of
        rel = f"{pre}index.html"; pg = pages.get(rel)
        if pg is None:
            s["fails"].append(f"site/{rel}: missing"); continue
        ways = [a.attrs.get("href") for p in pg.dom.all("p", cls="home-next") for a in p.all("a")]
        if ways != ["topics/", "journey/"]:
            s["fails"].append(f"site/{rel}: after the film's steps, two buttons: the learning route (topics/) and how the films were made (journey/); it has {ways}")
        # and the film's two other steps are said twice, since the bar above the film is easy to miss: in a section right
        # after the film, and first in the panel that shows when the film ends
        steps = [a.attrs.get("href") for d in pg.dom.all("div", cls="more-steps") for a in d.all("a")]
        tpl = re.search(r'<template id="next-panel">.*?</template>', pg.src, re.S)
        ends = re.findall(r'<a class="btn[^"]*" href="([^"]*)"', tpl.group(0)) if tpl else []
        if steps != ["labs/", "scenarios/"] or ends[:2] != ["labs/", "scenarios/"] or pg.src.find('class="more-steps"') > pg.src.find('class="home-next"') or pg.dom.first("details", cls="howto"):
            s["fails"].append(f"site/{rel}: after the film and before the ways on, a section offers the labs and the situations ({steps}), with no box to open, and the "
                              f"\"Where next?\" panel offers them first ({ends[:2]}): people miss them in the bar above the film (the author, 12 November 2026)")
        if [n for n in pg.dom.walk() if "data-route" in n.attrs] or any("route" in x for x in pg.local_scripts):
            s["fails"].append(f"site/{rel}: the home page doesn't draw the route (the author, 12 November 2026): it links to it")
        for t in D["topics"]:
            if not any(not i.get("soon") for i in t["items"]):
                s["fails"].append(f"route.{lg}.js: {t['id']} has no film or series on the site")
    for g in R["goals"]:
        if not 2 <= len(g["stops"]) <= 6 or len(set(g["stops"])) != len(g["stops"]):
            s["fails"].append(f"modules/route.json: goal {g['id']} needs two to six stops, each once")
    s["notes"].append(f"{len(R['groups'])} groups, {len(R['goals'])} goals; in the works: " +
                      (", ".join(u["name"]["en"] for t in build_series.live() for u in build_series.upcoming(t)) or "nothing"))

    # -- topic cards
    s = rep.check("Topic cards: one link each, the linked film's progress prefix and counts (a series' card: its films'), a real poster")
    ncards = 0
    for pg in normal:
        for card in pg.dom.all("article", cls="topic-card"):
            ncards += 1
            where = f"{pg.file}:{card.line}"
            box = card.up(lambda n: "data-progress-text" in n.attrs)
            prog = card.first(cls="tc-progress")
            links = card.first("h3").all("a") if card.first("h3") else []
            if "soon" in card.cls:
                if links or prog is not None:
                    s["fails"].append(f"{where}: an \"In the works\" card has no link and no progress")
                continue
            if len(links) != 1:
                s["fails"].append(f"{where}: the card's h3 needs exactly one link")
                continue
            for extra in card.all("a"):
                if extra is not links[0] and not extra.up(lambda n: "cta" in n.cls):
                    s["fails"].append(f"{where}: a link inside the card outside its buttons ({extra.text()}): the whole card is already a link")
            img = card.first("img")
            if img is None or img.attrs.get("alt") != "":
                s["fails"].append(f"{where}: the card's poster needs alt=\"\" (the title names it)")
            kind, target, _ = resolve(pg, links[0].attrs.get("href", ""))
            f = file_of(target)[0] if kind == "site" else None
            if not f:
                continue
            if "series-card" in card.cls:
                # a series' card links to the series' page, and counts its films as watched: data-films names, in order, the
                # progress prefix of each film the series' page has a card for
                if pages[f].bundles:
                    s["fails"].append(f"{where}: a series' card links to site/{f}, which plays a film: link to the series' page")
                    continue
                want = []
                for c2 in pages[f].dom.all("article", cls="topic-card"):
                    a2 = c2.first("h3").all("a") if c2.first("h3") else []
                    k2, t2, _ = resolve(pages[f], a2[0].attrs.get("href", "")) if a2 else (None, None, None)
                    f2 = file_of(t2)[0] if k2 == "site" else None
                    if f2 and pages[f2].bundles and BUNDLES[pages[f2].bundles[0]] not in want:
                        want.append(BUNDLES[pages[f2].bundles[0]])
                sbox = card.up(lambda n: "data-series-text" in n.attrs)
                if prog is None or sbox is None:
                    s["fails"].append(f"{where}: a series' card needs p.tc-progress inside [data-series-text]")
                    continue
                try:
                    T = json.loads(sbox.attrs["data-series-text"])
                    if set(T) != {"films"} or ("películas" in T["films"]) != pg.es:
                        s["fails"].append(f"{where}: data-series-text is {T}: one key, films, in the page's language")
                except ValueError as e:
                    s["fails"].append(f"{where}: data-series-text is not JSON ({e})")
                if (prog.attrs.get("data-films") or "").split() != want:
                    s["fails"].append(f"{where}: data-films=\"{prog.attrs.get('data-films')}\", but site/{f} has cards for {' '.join(want) or 'no film'}")
                if "hidden" not in prog.attrs:
                    s["fails"].append(f"{where}: p.tc-progress starts hidden")
                continue
            tb = pages[f].bundles
            prefix = BUNDLES[tb[0]] if tb else None
            if prefix is None:
                s["fails"].append(f"{where}: the card links to site/{f}, which has no film")
                continue
            if prog is None or box is None:
                s["fails"].append(f"{where}: needs p.tc-progress inside [data-progress-text]")
                continue
            try:
                T = json.loads(box.attrs["data-progress-text"])
                if set(T) != {"watched", "labs", "quiz"}:
                    s["fails"].append(f"{where}: data-progress-text keys {sorted(T)}")
                if pg.es and T.get("watched") != "Vista" or not pg.es and T.get("watched") != "Watched":
                    s["fails"].append(f"{where}: data-progress-text is not in the page's language")
            except ValueError as e:
                s["fails"].append(f"{where}: data-progress-text is not JSON ({e})")
            if prog.attrs.get("data-progress") != prefix:
                s["fails"].append(f"{where}: data-progress=\"{prog.attrs.get('data-progress')}\", but the card links to {f} ({prefix})")
            elif (prog.attrs.get("data-labs"), prog.attrs.get("data-quiz")) != COUNTS[prefix]:
                s["fails"].append(f"{where}: data-labs/data-quiz {prog.attrs.get('data-labs'), prog.attrs.get('data-quiz')}, expected {COUNTS[prefix]}")
            if "hidden" not in prog.attrs:
                s["fails"].append(f"{where}: p.tc-progress starts hidden")
    s["notes"].append(f"{ncards} cards")

    # -- Spanish
    s = rep.check("Spanish pages: link to Spanish pages when a twin exists, mark English-only links, differ from the English twin")
    for pg in normal:
        if pg.is404:
            continue
        for a in pg.dom.all("a"):
            if a.up(lambda n: "lang" in n.cls and n.tag == "span"):
                continue  # the language toggle
            kind, target, _ = resolve(pg, a.attrs.get("href", ""))
            if kind != "site":
                continue
            f = file_of(target)[0]
            if not f or not f.endswith(".html"):
                continue
            tk = key_of(f)
            if pg.es and not tk.startswith("es/"):
                if tk in TWINS:
                    s["fails"].append(f"{pg.file}:{a.line}: \"{a.text()}\" goes to the English page site/{tk}; link to site/es/{tk}")
                else:
                    if a.attrs.get("hreflang") != "en" and a.lang() != "en":
                        s["fails"].append(f"{pg.file}:{a.line}: \"{a.text()}\" goes to an English-only page: add hreflang=\"en\"")
                    ctx = a.text() + " " + (a.parent.text() if a.parent is not None else "")
                    if "inglés" not in ctx:
                        s["fails"].append(f"{pg.file}:{a.line}: \"{a.text()}\" goes to an English-only page: say \"(en inglés)\"")
            if not pg.es and tk.startswith("es/") and a.lang() != "es":
                s["fails"].append(f"{pg.file}:{a.line}: \"{a.text()}\" goes to a Spanish page from an English one")
        twin = pg.twin_key()
        if pg.es and twin is not None and twin + "index.html" in pages:
            en = pages[twin + "index.html"]
            for what, get in (("title", lambda d: d.first("title").text() if d.first("title") else ""),
                              ("description", lambda d: (d.first("meta", name="description") or Node("", {}, None, 0)).attrs.get("content", ""))):
                a, b = get(pg.dom), get(en.dom)
                if b and not a:
                    s["fails"].append(f"{pg.file}: no {what}, and the English page has one")
                elif a and a == b:
                    s["fails"].append(f"{pg.file}: the {what} is the same as the English page's")
            ft = lambda d: " ".join(p.text() for p in d.first("footer").all("p") if "foot-links" not in p.cls) if d.first("footer") else ""
            if ft(pg.dom) == ft(en.dom):
                s["fails"].append(f"{pg.file}: the footer text is the same as the English page's")

    # -- generated pages
    s = rep.check("The series: their pages, and their blocks in other pages, are what site-tools/build_series.py makes")
    for rel, text in build_series.pages() + build_series.blocks() + build_series.data():
        f = WEB / rel
        if not f.exists() or f.read_text() != text:
            s["fails"].append(f"site/{rel} is not what build_series.py makes: run python site-tools/build_series.py")
    for S in build_series.SERIES:
        if build_series.readme(S) != (S["root"] / "README.md").read_text():
            s["fails"].append(f"films/{S['dir']}/README.md: its table of films is not what build_series.py makes")
        s["notes"].append(f"{S['name']['en']}: {len(build_series.films(S)[1])} films")
    for rel, text in build_series.lists():
        if (ROOT / rel).read_text() != text:
            s["fails"].append(f"{rel}: its table is not what build_series.py makes from the films' own rows (decided.md, release.json): run python site-tools/build_series.py")
    rep_md = (ROOT / "films" / "legibility-report.md").read_text()
    if build_series.fill(rep_md, build_series.LEGIBLE, [build_series.LEGIBLE_NOTE]) != rep_md:
        s["fails"].append("films/legibility-report.md: keep only the note between its marks; the table is made when it's printed "
                          "(python site-tools/build_series.py --legibility), so films merging at once don't clash on it")

    s = rep.check("Repository links: every relative link in the repository's Markdown, such as a series' table of films, points at a file that is there")
    bad, n = md_link_faults()
    s["fails"] += bad
    s["notes"].append(f"{n} relative links read in the repository's Markdown files (the site's own pages are checked above)")

    s = rep.check("A series' own labs and scenarios: the same in both languages, each lab on one of its film's chapters, each scenario on a lab")
    for S, SL in SERIES_LEARN.values():
        words = f"site/assets/{SL['dir']}/learn"
        en, es = SL["en"], SL["es"]
        key = lambda x: (x["id"], x["film"], x["chapter"])
        if [key(x) for x in en["labs"]] != [key(x) for x in es["labs"]]:
            s["fails"].append(f"{words}.es.js: its labs (ids, films, chapters, in order) differ from {words}.en.js's")
        if en["qs"] != es["qs"]:
            s["fails"].append(f"{words}.es.js: its scenarios (numbers, films, labs, in order) differ from {words}.en.js's")
        ids, ns = [x["id"] for x in en["labs"]], [n for n, _, _ in en["qs"]]
        for k, c in Counter(ids).items():
            if c > 1:
                s["fails"].append(f"{words}.en.js: {c} labs have the id \"{k}\"")
        for k, c in Counter(ns).items():
            if c > 1:
                s["fails"].append(f"{words}.en.js: {c} scenarios have the number {k}, which keeps their answers apart")
        # one numbering for the whole pack: the labs page numbers its labs 1 to N in the order they're listed, under their films'
        # buttons, so they're listed in film order; the scenarios likewise, by their numbers
        fl = [x["film"] for x in en["labs"]]
        if fl != sorted(fl):
            s["fails"].append(f"{words}.en.js: its labs aren't listed in film order (" + ", ".join(f"{x['id']} (film {x['film']})" for x in en["labs"]) + "): "
                              "the labs page numbers them in that order, so a lab listed after a later film's shows under its film with the wrong number")
        if ns != sorted(ns):
            s["fails"].append(f"{words}.en.js: its scenarios aren't listed in order of their numbers ({', '.join(map(str, ns))})")
        on = {x["index"] + 1: x for x in build_series.films(S)[1]}
        for x in en["labs"]:
            f = on.get(x["film"])
            if f and x["chapter"] not in dict(f["chapters"]):
                s["fails"].append(f"{words}.en.js: lab \"{x['id']}\" plays chapter {x['chapter']!r} of {f['title']}, which has "
                                  + ", ".join(k for k, _ in f["chapters"]) + " (a lab of a film still being made has chapter null)")
        for n, f, lab in en["qs"]:
            if n // 10 != f:
                s["fails"].append(f"{words}.en.js: scenario {n} is from film {f}, but its number isn't film × 10 + its place")
            if lab not in ids:
                s["fails"].append(f"{words}.en.js: scenario {n} points to lab \"{lab}\", which isn't one of the labs")
        for n, f in on.items():
            if not f["labs"] and not any(x["film"] == n for x in en["labs"]) and not any(q[1] == n for q in en["qs"]):
                s["notes"].append(f"{f['title']}: no lab or scenario among the series' own")
        s["notes"].append(f"{S['name']['en']}: {SL['labs']} labs and {SL['quiz']} scenarios, for films {', '.join(map(str, SL['films']))}")

    s = rep.check("Journey pages: the same as site-tools/build_pages.py makes from their Markdown")
    try:
        with tempfile.TemporaryDirectory() as tmp:
            tmp = pathlib.Path(tmp)
            shutil.copytree(ROOT / "site-tools", tmp / "site-tools")
            shutil.copytree(ROOT / "modules", tmp / "modules")
            mds = [p for d in ["journey", "paths", "es/journey", "es/paths"] for p in WEB.glob(d + "/**/*.md")]
            for md in mds:
                dst = tmp / "site" / md.relative_to(WEB)
                dst.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy(md, dst)
            r = subprocess.run([sys.executable, str(tmp / "site-tools/build_pages.py")], capture_output=True, text=True)
            if r.returncode:
                s["fails"].append("build_pages.py failed: " + (r.stderr.strip().splitlines() or ["?"])[-1])
            for md in mds:
                rel = md.relative_to(WEB).with_suffix(".html")
                built, have = tmp / "site" / rel, WEB / rel
                if not built.exists():
                    continue
                if not have.exists() or built.read_text() != have.read_text():
                    s["fails"].append(f"site/{rel.as_posix()} differs from what build_pages.py makes: run python site-tools/build_pages.py (never hand-edit it)")
            s["notes"].append(f"{len(mds)} Markdown pages rebuilt in a scratch folder")
    except Exception as e:  # noqa: BLE001
        s["fails"].append(f"could not run build_pages.py: {e}")

    return rep.done()


if __name__ == "__main__":
    sys.exit(main())
