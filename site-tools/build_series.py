#!/usr/bin/env python3
"""Builds the pages of the site's series, and the Topics page, in English and Spanish:

    python site-tools/build_series.py

The site is organised in big topics (TOPICS below), each holding films and series. Three series are built this way:
From words to data (films/from-words-to-data/, on the site at from-words-to-data/), In the weeds of data crafting
(films/analytics-engineering/, at in-the-weeds/) and The map before the data (films/enterprise-architecture/, at
enterprise-architecture/). Each is described once, in SERIES below: its folder, its place on the site, its names, the
hand-written pages that show its cards, and what each film builds on. The films and series whose pages are written by hand
(The Inner Life of Data, A Sharper Sketch, When things go wrong) are described, for their cards, in HAND.
For each series: its page (site/<slug>/) and, for each film, its Watch page (site/<slug>/<film>/) and, if it has them, its
Take it apart and Make the call pages (labs/, scenarios/), and their twins under site/es/. Then the Topics page (topics/),
and the topics on the home page and the intro's scenarios page (between <!-- topics: made by site-tools/build_series.py -->
and <!-- /topics -->). The words come from the series' series.json and each film's site.json; the length and chapters from
the film's own source (narration.js, vodur.js and breath.js, timed as The Inner Life of Data's engine times them); the counts
of labs and scenarios from the film's words in site/assets/<film>/learn.en.js (a film without one has none, and its page
offers its Pause and think questions instead), and the count of Pause and think questions from think.en.js. A film whose
player isn't in site/assets/<film>/ yet is left out.
Never edit the generated pages by hand: change the words, and run this again. check_site.py and smoke.py read every series
through SERIES and films() below, so a new film, or a new series, needs no change to them."""
import html, json, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
WEB = ROOT / "site"
BASE = "https://roanboc.github.io/learning-data/"
REPO = "https://github.com/roanboc/learning-data"
E = lambda s: html.escape(s, quote=False).replace('"', "&quot;")
NUM = {"en": "one two three four five six seven eight nine ten eleven twelve".split(),
       "es": "uno dos tres cuatro cinco seis siete ocho nueve diez once doce".split()}


def T(lg, en, es):
    return en if lg == "en" else es


# ---------------------------------------------------------------- what each film builds on
def fw_builds_on(lg, f, all_films, R):
    """From words to data: the chapter of The Inner Life of Data and A Sharper Sketch for the first film, the films before it for the rest."""
    i = f["index"]; by = {x["index"]: x for x in all_films}
    name = lambda x: E(x["title"] if lg == "en" else x["site"]["title_es"])
    if i == 0:
        return (f'<p class="builds-on">Builds on <i>The Inner Life of Data</i> · <a href="{R}#t=75">The sketch</a>, and <a href="{R}sketch/"><i>A Sharper Sketch</i></a></p>' if lg == "en" else
                f'<p class="builds-on">Amplía <a href="{R[3:]}#t=84"><i>El boceto</i></a> de <i>La vida interior de los datos</i>, y <a href="{R[3:]}sketch/"><i>Un boceto más preciso</i></a></p>')
    prev = {1: [0], 2: [1], 3: [2], 4: [2, 3], 5: [0, 1], 6: list(range(6))}[i]
    got = [by[j] for j in prev if j in by]
    if i == 6:
        return f'<p class="builds-on">{T(lg, "Builds on", "Amplía")} <a href="../">{T(lg, "the whole series", "toda la serie")}</a></p>'
    links = f' {T(lg, "and", "y")} '.join(f'<a href="../{x["key"]}/"><i>{name(x)}</i></a>' for x in got)
    return f'<p class="builds-on">{T(lg, "Builds on", "Amplía")} {links}</p>' if got else ""


def after_previous(lg, f, all_films):
    """The film before this one in its series, as "Builds on", or nothing for the first."""
    by = {x["index"]: x for x in all_films}
    got = [by[f["index"] - 1]] if f["index"] - 1 in by else []
    name = lambda x: E(x["title"] if lg == "en" else x["site"]["title_es"])
    return (f'<p class="builds-on">{T(lg, "Builds on", "Amplía")} ' + "".join(f'<a href="../{x["key"]}/"><i>{name(x)}</i></a>' for x in got) + '</p>') if got else ""


def weeds_builds_on(lg, f, all_films, R):
    """In the weeds of data crafting: the first film builds on From words to data (and Keeping it true, where it ends); each later film on the one before."""
    if f["index"] == 0:
        RE = R if lg == "en" else R[3:]
        return (f'<p class="builds-on">Builds on the series <a href="{RE}from-words-to-data/"><i>From words to data</i></a>, and where it ends: <a href="{RE}from-words-to-data/keeping-it-true/"><i>Keeping it true</i></a></p>' if lg == "en" else
                f'<p class="builds-on">Amplía la serie <a href="{RE}from-words-to-data/"><i>De las palabras a los datos</i></a>, y donde termina: <a href="{RE}from-words-to-data/keeping-it-true/"><i>Que siga siendo verdad</i></a></p>')
    return after_previous(lg, f, all_films)


def ea_builds_on(lg, f, all_films, R):
    """The map before the data: the first film opens the series and needs nothing before it; each later film builds on the one before."""
    return after_previous(lg, f, all_films)


# ---------------------------------------------------------------- the series
# id: the series' key; dir: its folder under films/; slug: its path on the site; name: its title; builds_on: what each film builds on;
# place: where its films happen, as its footer says it ("The university, people, numbers and records… are fictional"); marks: the
# trademarks its footer names, if not the Databricks and dbt logos;
# blocks: the hand-written pages that show its first film's card, between <!-- <id>: made by site-tools/build_series.py --> and
# <!-- /<id> -->: (path under site/, language, "card", the path from that page to the site's root, and to the series' folder).
# The series' place among the topics, and its card on the Topics and home pages, are in TOPICS below.
SERIES = [
    dict(id="from-words-to-data", dir="from-words-to-data", slug="from-words-to-data",
         name={"en": "From words to data", "es": "De las palabras a los datos"}, builds_on=fw_builds_on,
         place={"en": "university", "es": "universidad"},
         blocks=[("sketch/index.html", "en", "card", "../", "../from-words-to-data/"), ("es/sketch/index.html", "es", "card", "../../", "../from-words-to-data/")]),
    dict(id="in-the-weeds", dir="analytics-engineering", slug="in-the-weeds",
         name={"en": "In the weeds of data crafting", "es": "En las entrañas del oficio de datos"}, builds_on=weeds_builds_on,
         place={"en": "university", "es": "universidad"}, blocks=[]),
    dict(id="enterprise-architecture", dir="enterprise-architecture", slug="enterprise-architecture",
         name={"en": "The map before the data", "es": "El mapa antes de los datos"}, builds_on=ea_builds_on,
         place={"en": "utility", "es": "empresa de energía"}, blocks=[],
         marks={"en": "TOGAF and ArchiMate are trademarks of The Open Group, and Zachman of Zachman International, named only to identify those frameworks; this project is not affiliated with or endorsed by them.",
                "es": "TOGAF y ArchiMate son marcas de The Open Group, y Zachman de Zachman International, nombradas solo para identificar esos marcos; este proyecto no está afiliado a ellos ni cuenta con su respaldo."}),
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
    N = load_obj(src / "src" / "narration.js")
    V = load_obj(src / "src" / "vodur.js") if (src / "src" / "vodur.js").exists() else {}
    B = load_obj(src / "src" / "breath.js") if (src / "src" / "breath.js").exists() else {}
    tot = 0.0
    for sid, sc in N.items():
        b = B.get(sid, {}); hold, pz = b.get("hold", {}), b.get("pause", {}); t = sc.get("lead") or 0.6
        for i, ch in enumerate(sc["vo"]):
            t += (ch.get("pause") or 0) + pz.get(ch["id"], 0)
            d = V.get(sid + "/" + ch["id"]) or max(1.3, len(ch["text"].split()) / 2.7)
            last = i == len(sc["vo"]) - 1
            gap = ch["gap"] if ch.get("gap") is not None else (0.7 if not last and re.search(r'[.?!…]["\'”’»)]*$', ch["text"].strip()) else 0.3)
            t += d + gap + hold.get(ch["id"], 0)
        tot += t + (sc.get("tail") or 1.2) + b.get("breathe", 0)
    return tot


def minutes(sec):
    """A length as the site states it: the nearest half minute, "5½" or "6"."""
    h = round(sec / 30)
    return str(h // 2) + ("½" if h % 2 else "")


def films(S=FW):
    """Every film of a series whose player is on the site, in order, with everything its pages need."""
    series = json.loads((S["root"] / "series.json").read_text())
    out = []
    for i, d in enumerate(series["films"]):
        src = S["root"] / d / "source"
        meta = json.loads((src / "film.json").read_text())
        key = meta["key"]
        if not (WEB / "assets" / key / "film.js").exists() or not (S["root"] / d / "site.json").exists():
            continue
        site = json.loads((S["root"] / d / "site.json").read_text())
        learn = WEB / "assets" / key / "learn.en.js"
        if learn.exists():  # labs and scenarios
            words = learn.read_text()
            labs_part = words[words.index("labs:["):words.index("qs:[")]
            nl, nq = len(re.findall(r'\bkind:"', labs_part)), len(re.findall(r'\{type:"', words))
        else:
            nl = nq = 0
        # the Pause and think questions: one per chapter it stops after, in the film's think pack
        think = WEB / "assets" / key / "think.en.js"
        nt = len(re.findall(r'[{,]q:"', think.read_text())) if think.exists() else 0
        N = load_obj(src / "src" / "narration.js")
        out.append(dict(dir=d, key=key, title=meta["title"], site=site, labs=nl, quiz=nq, think=nt, len=minutes(length(src)), sec=length(src),
                        chapters=[(k, v["name"]) for k, v in N.items()], prefix="ld-" + key, index=i, series=S))
    return series, out


def all_films():
    """Every film on the site that a series page makes, across every series."""
    return [f for S in SERIES for f in films(S)[1]]


# ---------------------------------------------------------------- the topics
# The films and series whose pages are written by hand, as their cards on the Topics and home pages show them. href: the page,
# from the site's root (its Spanish twin is the same path under es/); a film: its posters, length, labs, scenarios and progress
# prefix; a series: its films, as (key, progress prefix, source folder under films/), to time them and to count them as watched.
HAND = {
    "intro": dict(href="", title={"en": "The Inner Life of Data", "es": "La vida interior de los datos"},
                  poster={"en": "poster.jpg", "es": "poster.es.jpg"}, len={"en": "7½", "es": "8½"}, labs=8, quiz=12, prefix="ld",
                  card={"en": "Follow one enrolment from a tap on a phone to a decision, through Databricks and dbt.",
                        "es": "Sigue una inscripción desde un toque en el teléfono hasta una decisión, pasando por Databricks y dbt."},
                  note={"en": "English and Spanish", "es": "En español e inglés"}),
    "sketch": dict(href="sketch/", title={"en": "A Sharper Sketch", "es": "A Sharper Sketch"}, title_lang="en",
                   poster={"en": "sketch-poster.jpg", "es": "sketch-poster.jpg"}, len={"en": "5½", "es": "5½"}, labs=6, quiz=12, prefix="ld3",
                   card={"en": "Two trusted numbers disagree. When does a simple model need more precision, and how do you use a reference model without copying it?",
                         "es": "Dos cifras confiables no coinciden. ¿Cuándo necesita más precisión un modelo sencillo, y cómo se usa un modelo de referencia sin copiarlo?"},
                   note={"en": "", "es": "En inglés"}),
    "when-things-go-wrong": dict(href="when-things-go-wrong/", title={"en": "When things go wrong", "es": "Cuando algo sale mal"},
                   card={"en": "Two bad mornings at the university: a change only half of it saw, and a number too good to be true. Each ends with what catches it next time.",
                         "es": "Dos malas mañanas en la universidad: un cambio que solo la mitad vio, y una cifra demasiado buena para ser verdad. Cada una termina con lo que lo detecta la próxima vez."},
                   films=[("silent-change", "ld-silent-change", "when-things-go-wrong/1-silent-change"),
                          ("too-good-to-be-true", "ld-too-good-to-be-true", "when-things-go-wrong/2-too-good-to-be-true")], labs=True),
}
# The big topics, in order: their names, who each is for, what it covers, and what it holds (an id of HAND or SERIES). The Topics
# page shows them all, each with its cards; the home page plays the first and shows the others as tiles.
TOPICS = [
    dict(id="data-platforms", items=["intro"],
         name={"en": "Data platforms", "es": "Plataformas de datos"},
         who={"en": "Start here: for everyone", "es": "Empieza aquí: para todos"},
         line={"en": "How data moves through a modern data platform, from a tap on a phone to a decision.",
               "es": "Cómo se mueven los datos en una plataforma de datos moderna, desde un toque en el teléfono hasta una decisión."}),
    dict(id="data-modelling", items=["sketch", "from-words-to-data"],
         name={"en": "Data modelling", "es": "Modelado de datos"},
         who={"en": "For anyone who designs models, definitions or reports", "es": "Para quien diseña modelos, definiciones o reportes"},
         line={"en": "What the numbers mean, and the shapes that hold them: words and definitions first, then models, before any system.",
               "es": "Lo que significan las cifras, y las formas que las contienen: primero las palabras y las definiciones, luego los modelos, antes que cualquier sistema."}),
    dict(id="analytics-engineering", items=["in-the-weeds"],
         name={"en": "Analytics engineering", "es": "Ingeniería analítica"},
         who={"en": "For analytics engineers", "es": "Para analytics engineers"},
         line={"en": "How an agreed data model becomes tested, documented tables, with dbt.",
               "es": "Cómo un modelo de datos acordado se convierte en tablas probadas y documentadas, con dbt."}),
    dict(id="data-quality", items=["when-things-go-wrong"],
         name={"en": "Data quality and change", "es": "Calidad de datos y cambios"},
         who={"en": "For anyone who builds pipelines, or owns a source system or a data product", "es": "Para quien construye pipelines, o es responsable de un sistema de origen o de un producto de datos"},
         line={"en": "What goes wrong on a data platform, and what catches it: changes, data contracts and tests.",
               "es": "Lo que sale mal en una plataforma de datos, y lo que lo detecta: cambios, contratos de datos y pruebas."}),
    dict(id="enterprise-architecture", items=["enterprise-architecture"],
         name={"en": "Enterprise architecture", "es": "Arquitectura empresarial"},
         who={"en": "For architects, and anyone new to an organisation", "es": "Para arquitectos, y para quien llega nuevo a una organización"},
         line={"en": "How an organisation works, in layers, before you ask what its data should answer.",
               "es": "Cómo funciona una organización, por capas, antes de preguntar qué deberían responder sus datos."}),
]


def topic_of(item_id):
    """The topic that holds a film or a series of HAND or SERIES."""
    return next(t for t in TOPICS if item_id in t["items"])


def entry(lg, item_id):
    """What a topic's card says about one of its films or series, in a language: kind ("film" or "series"), href (from the
    language's root), title, posters, card, kicker, meta, and progress: ("film", prefix, labs, quiz) or ("series", prefixes)."""
    S = next((x for x in SERIES if x["id"] == item_id), None)
    if S is not None:
        series, films_ = films(S)
        n, planned = len(films_), series.get("planned", len(series["films"]))
        many = T(lg, f"{n} of {planned} films", f"{n} de {planned} películas") if planned > n else T(lg, f"{n} films", f"{n} películas")
        extra = T(lg, "labs and scenarios", "labs y situaciones") if any(x["labs"] for x in films_) else T(lg, "Pause and think", "Pausa para pensar")
        return dict(kind="series", href=S["slug"] + "/", title=SN(lg, S), title_lang=None, posters=[f'{x["key"]}-poster.jpg' for x in films_],
                    card=series[T(lg, "card", "card_es")], kicker=T(lg, "Series · ", "Serie · ") + many,
                    meta=f'{round(sum(x["sec"] for x in films_) / 60)} min · {extra}' + T(lg, "", " · En inglés"),
                    progress=("series", [x["prefix"] for x in films_]))
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
    return {f'{e["meta"].split(" · ")[0]}' for t in TOPICS for i in t["items"] for e in [entry("en", i)] if e["kind"] == "series"}


# ---------------------------------------------------------------- page parts
FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
         '<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet">')
LOGOS = {"en": "Company logos and trademarks, including the Databricks and dbt logos, are not covered by either licence and belong to their owners; this project is not affiliated with or endorsed by them.",
         "es": "Los logos y marcas de empresas, incluidos los de Databricks y dbt, no están cubiertos por ninguna de las dos licencias y pertenecen a sus dueños; este proyecto no está afiliado a ellos ni cuenta con su respaldo."}
NOTICES = {"en": 'See <a href="https://github.com/roanboc/learning-data/blob/main/NOTICE.md">notices</a>.',
           "es": 'Ver <a href="https://github.com/roanboc/learning-data/blob/main/NOTICE.md">avisos</a> (en inglés).'}
SOURCE = {"en": '<p class="foot-links"><a href="https://github.com/roanboc/learning-data">Source on GitHub</a></p>',
          "es": '<p class="foot-links"><a href="https://github.com/roanboc/learning-data">Código en GitHub</a></p>'}


def foot(lg, S=FW, learn=True):
    """The footer of a series' pages: what's fictional (the series' place; the labs and scenarios too, if its films have them), the voice, the licences."""
    if lg == "en":
        what = f'The {S["place"]["en"]}, people, numbers and records in the film' + (", the labs and the scenarios" if learn else "") + " are fictional."
        lic = "The narration is a synthetic voice. Code: MIT licence. Film, script, captions, images and text: CC BY 4.0."
    else:
        art = "La" if S["place"]["es"] in ("universidad", "empresa de energía") else "El"
        what = f'{art} {S["place"]["es"]}, las personas, las cifras y los registros de la película' + (", los labs y las situaciones" if learn else "") + " son ficticios."
        lic = "La narración es una voz sintética. Código: licencia MIT. Película, guion, subtítulos, imágenes y textos: CC BY 4.0."
    return f'<footer>{SOURCE[lg]}<p>{what} {lic} {S.get("marks", LOGOS)[lg]} {NOTICES[lg]}</p></footer>'


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


def header(lg, path, R, cur="true"):
    """The site's header; Topics is marked as the current page on the Topics page (cur="page"), and as its section elsewhere."""
    if lg == "en":
        return (f'<header class="top"><div class="top-in"><a class="brand" href="{R}"><img src="{R}assets/favicon.svg" alt=""><span>Learning Data</span></a><nav aria-label="Site">'
                f'<a href="{R}">Start here</a><a href="{R}topics/" aria-current="{cur}">Topics</a><a href="{R}journey/">Making of</a><span class="lang" role="group" aria-label="Language">'
                f'<a href="./" aria-current="true" lang="en">EN</a><a href="{R}es/{path}" lang="es" hreflang="es">ES</a></span></nav></div></header>')
    RE = R[3:]
    return (f'<header class="top"><div class="top-in"><a class="brand" href="{RE}"><img src="{R}assets/favicon.svg" alt=""><span>Learning Data</span></a><nav aria-label="Sitio">'
            f'<a href="{RE}">Empieza aquí</a><a href="{RE}topics/" aria-current="{cur}">Temas</a><a href="{RE}journey/">Cómo se hizo</a><span class="lang" role="group" aria-label="Idioma">'
            f'<a href="{R}{path}" lang="en" hreflang="en">EN</a><a href="./" aria-current="true" lang="es">ES</a></span></nav></div></header>')


def SN(lg, S):
    """The series' name, in a language."""
    return S["name"][lg]


def crumbs(lg, R, S, up=None):
    """A series page's breadcrumb: Topics › the series' topic › the series, a link (up, from a page under it) or text (on its own page)."""
    RT = R if lg == "en" else R[3:]
    t = topic_of(S["id"])
    last = f'<a href="{up}">{SN(lg, S)}</a>' if up else SN(lg, S)
    return f'<p class="eyebrow crumbs"><a href="{RT}topics/">{T(lg, "Topics", "Temas")}</a> › <a href="{RT}topics/#{t["id"]}">{t["name"][lg]}</a> › {last}</p>'


def num(lg, f):
    """A film's place in its series, always as "Film 2 of 7": site-tools/check_site.py allows numbering only in this form.
    A series still being made counts the films it plans ("planned" in its series.json), not only those made so far."""
    ser = json.loads((f["series"]["root"] / "series.json").read_text())
    n = ser.get("planned", len(ser["films"]))  # a series still being made says how many films it will have
    return T(lg, "Film", "Película") + f' {f["index"] + 1} {T(lg, "of", "de")} {n}'


def offers(lg, f):
    """What a film offers besides itself, as its card says it: labs and scenarios, or its Pause and think questions."""
    return (f'{f["labs"]} labs · {f["quiz"]} {T(lg, "scenarios", "situaciones")}' if f["labs"] else T(lg, "Pause and think", "Pausa para pensar"))


def card(lg, f, rel, R, kicker=None):
    """A topic card for a film of a series, linking to it from a page whose path to the series folder is rel.
    Its kicker says the film's number in the series, unless the card stands for the whole series (kicker)."""
    s = f["site"]
    kicker = kicker or f'{num(lg, f)} · {s[T(lg, "kicker", "kicker_es")]}'
    meta = f'{f["len"]} min · {offers(lg, f)} · {SN(lg, f["series"])}' + T(lg, "", " · En inglés")
    counts = f' data-labs="{f["labs"]}" data-quiz="{f["quiz"]}"' if f["labs"] else ""
    return (f'<article class="topic-card">\n<img src="{R}assets/{f["key"]}-poster.jpg" alt="" width="1280" height="720" loading="lazy">\n<div class="tc-body">\n'
            f'<p class="kicker">{E(kicker)}</p>\n<h3><a href="{rel}{f["key"]}/">{E(f["title"] if lg == "en" else s["title_es"])}</a></h3>\n'
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


def builds_on(lg, f, all_films_, R):
    return f["series"]["builds_on"](lg, f, all_films_, R)


def series_nav(lg, f, films_, R, rel):
    """In the series: the previous and the next film, as cards, and every film of the series, numbered, with this one marked.
    rel is the path from the page to the series folder."""
    by = {x["index"]: x for x in films_}; prv, nxt = by.get(f["index"] - 1), by.get(f["index"] + 1)
    nm = lambda x: E(x["title"] if lg == "en" else x["site"]["title_es"])
    cards = ([card(lg, prv, rel, R, kicker=f'← {T(lg, "Previous", "Anterior")} · {num(lg, prv)}')] if prv else []) + \
            ([card(lg, nxt, rel, R, kicker=f'{T(lg, "Next", "Siguiente")} · {num(lg, nxt)} →')] if nxt else [])
    lis = "\n".join(f'<li><a href="{rel}{x["key"]}/"' + (' aria-current="page"' if x is f else "") + f'><span class="n">{x["index"] + 1}</span>{nm(x)}</a></li>' for x in films_)
    return (f'<section class="module" id="in-the-series" aria-labelledby="series-h">\n<div class="mhead"><div><h2 id="series-h">{T(lg, "In the series", "En la serie")}: <a href="{rel}">{SN(lg, f["series"])}</a></h2>'
            f'<p>{num(lg, f)}.</p></div></div>\n'
            f'<div class="topic-grid series-pn" data-progress-text=\'{PT[lg]}\'>\n' + "\n".join(cards) + '\n</div>\n'
            f'<ol class="series-list" aria-label="{T(lg, "Every film of the series", "Todas las películas de la serie")}">\n{lis}\n</ol>\n</section>\n')


def project_url(f, path):
    """A file or folder of the series' example project on GitHub: a folder ends with /."""
    kind = "tree" if path.endswith("/") or not path else "blob"
    return f'{REPO}/{kind}/main/films/{f["series"]["dir"]}/project/{path}'.rstrip("/")


def project_section(lg, f):
    """See it in the project: for each chapter whose cards show files of the example project, a link to each, on GitHub.
    The files come from the film's site.json, "repo": {chapter id: [paths]}."""
    repo = f["site"].get("repo")
    if not repo:
        return ""
    names = dict(f["chapters"]) if lg == "en" else {k: f["site"]["chapters_es"].get(k, v) for k, v in f["chapters"]}
    rows = []
    for cid, _ in f["chapters"]:
        paths = repo.get(cid)
        if paths:
            links = " ".join(f'<a href="{project_url(f, x)}"><code>{E(x)}</code></a>' for x in paths)
            rows.append(f'<li><b>{E(names[cid])}</b><span>{links}</span></li>')
    return (f'<section class="module" id="in-the-project" aria-labelledby="project-h">\n<div class="mhead"><div><h2 id="project-h">{T(lg, "See it in the project", "Míralo en el proyecto")}</h2>'
            f'<p>{T(lg, "Every card in the film shows a real file from the example dbt project. Open the ones each chapter shows, on GitHub, or run the whole project yourself.", "Cada tarjeta de la película muestra un archivo real del proyecto de dbt de ejemplo. Abre en GitHub los que muestra cada capítulo, o ejecuta tú el proyecto entero.")}</p></div></div>\n'
            f'<ul class="repo-list">\n' + "\n".join(rows) + f'\n</ul>\n<p class="film-links"><a href="{project_url(f, "")}">{T(lg, "Explore the whole project", "Explora el proyecto entero")}</a><a href="{project_url(f, "README.md")}">{T(lg, "How to run it", "Cómo ejecutarlo")}</a></p>\n</section>\n\n')


def es_scenes(f):
    names = f["site"]["chapters_es"]
    return ('<script>/* the film is in English; its chapter buttons and the Pause and think kicker use these Spanish names */\n'
            '{const N=' + json.dumps(names, ensure_ascii=False) + ';SCENES.forEach(s=>{if(N[s.id])s.name=N[s.id];});}</script>')


# ---------------------------------------------------------------- pages
def film_page(lg, f, films_, series):
    """A film's Watch page. A film with labs and scenarios has the course bar (Watch, Take it apart, Make the call); one without
    offers its Pause and think questions, as Silent change does."""
    s = f["site"]; key = f["key"]; S = f["series"]; path = f'{S["slug"]}/{key}/'; learn = bool(f["labs"])
    name = f["title"] if lg == "en" else s["title_es"]
    title = f'{name} · {SN(lg, S)} · Learning Data'
    h, R = head(lg, path, title, s[T(lg, "description", "description_es")], s[T(lg, "card", "card_es")], f"{key}-poster.jpg")
    nxt = next((x for x in films_ if x["index"] == f["index"] + 1), None)
    script = f'{REPO}/blob/main/films/{S["dir"]}/{f["dir"]}/script.md'; caps = f'{REPO}/tree/main/films/{S["dir"]}/{f["dir"]}/captions'
    note = ('' if lg == "en" else
            '<p class="note">La película está en inglés, con subtítulos en español. Esta página, los capítulos, las preguntas, los labs y las situaciones están en español.</p>\n' if learn else
            '<p class="note">La película está en inglés, con subtítulos en español. Esta página, los capítulos y las preguntas están en español.</p>\n')
    ntw = NUM[lg][f["think"] - 1]  # how many Pause and think questions, in words
    extra = (f'<span>{f["labs"]} labs</span><span>{f["quiz"]} {T(lg, "scenarios", "situaciones")}</span>' if learn else "")
    meta = (f'<p class="meta-row"><span>{f["len"]} min</span>{extra}<span>Pause and think</span><span>English captions</span></p>' if lg == "en" else
            f'<p class="meta-row"><span>{f["len"]} min</span>{extra}<span>Pausa para pensar</span><span>En inglés, con subtítulos en español</span></p>')
    nm = lambda x: E(x["title"] if lg == "en" else x["site"]["title_es"])
    third = (f'<a class="btn" href="../{nxt["key"]}/">{T(lg, "Next in the series", "Sigue en la serie")}: {nm(nxt)}</a>' if nxt else
             f'<a class="btn" href="../">{T(lg, "The whole series", "Toda la serie")}: {SN(lg, S)}</a>')
    player = (f'<div class="player" data-labs="{"labs/" if learn else ""}">\n<audio id="snd" preload="metadata" src="{R}assets/{key}/soundtrack.mp3"></audio><div class="poster"><img src="{R}assets/{key}-poster.jpg" alt="" width="1280" height="720" data-play>'
              f'<div class="poster-cta"><button type="button" class="play-badge" data-play>{T(lg, "▶ Play the film", "▶ Ver la película")} · {f["len"]} min</button><button type="button" class="think-badge" data-think>{T(lg, "Play with pauses to think", "Ver con pausas para pensar")}</button></div></div>'
              f'<canvas id="film" width="1280" height="720" aria-label="{T(lg, "Animated film", "Película animada, en inglés")}: {E(f["title"])}"></canvas>\n'
              + (f'<div class="bar"><button id="play">Play</button><input id="scrub" type="range" min="0" step="0.01" value="0" aria-label="Seek"><span id="time">0:00</span><button id="think" aria-pressed="false" title="Stop at the end of {ntw} chapters, with one question each">Pause and think</button><button id="cc" class="on" aria-pressed="true">Captions</button><button id="fs">Full screen</button></div>' if lg == "en" else
                 f'<div class="bar"><button id="play">Reproducir</button><input id="scrub" type="range" min="0" step="0.01" value="0" aria-label="Buscar"><span id="time">0:00</span><button id="think" aria-pressed="false" title="Detenerse al final de {ntw} capítulos, con una pregunta cada vez">Pausa para pensar</button><button id="cc" class="on" aria-pressed="true">Subtítulos</button><button id="fs">Pantalla completa</button></div>')
              + '\n</div>')
    links = (f'<p class="film-links"><a href="https://github.com/roanboc/learning-data/releases/latest/download/{key}.mp4">Download the video</a><a href="{caps}">Caption files</a><a href="{script}">Read the script</a></p>' if lg == "en" else
             f'<p class="film-links"><a href="https://github.com/roanboc/learning-data/releases/latest/download/{key}.mp4">Descargar el video (en inglés)</a><a href="{caps}">Archivos de subtítulos</a><a href="{script}" hreflang="en">Leer el guion (en inglés)</a></p>')
    first = (f'<a class="btn primary" href="labs/">{T(lg, "Take it apart", "Desarma")}: {f["labs"]} {T(lg, "hands-on labs", "labs interactivos")} →</a><a class="btn" href="scenarios/">{T(lg, "Make the call", "Tú decides")}: {f["quiz"]} {T(lg, "situations", "situaciones")}</a>' if learn else
             f'<a class="btn primary" href="#think-it-through">{T(lg, "Think it through", "Piénsalo")}: {f["think"]} {T(lg, "questions", "preguntas")}</a>')
    nextp = (f'<template id="next-panel"><div class="think-card"><p class="think-k">{T(lg, "Where next?", "¿Y ahora?")}</p><h3>{E(s[T(lg, "next_h", "next_h_es")])}</h3>\n'
             f'<div class="next-opts">{first}{third}</div>\n'
             f'<div class="think-foot"><button type="button" class="btn" data-again>{T(lg, "Watch again", "Ver de nuevo")}</button></div></div></template>')
    body = (f'<body>\n{header(lg, path, R)}\n<main>\n<section class="hero cine"><div class="bg" aria-hidden="true"><img src="{R}assets/{key}-poster.jpg" alt=""></div><canvas class="fx" aria-hidden="true"></canvas>\n'
            f'{crumbs(lg, R, S, "../")}\n'
            f'<h1>{E(s[T(lg, "h1", "h1_es")])}</h1>\n<p class="lead">{E(s[T(lg, "lead", "lead_es")])}</p>\n{meta}\n{note}{builds_on(lg, f, films_, R if lg == "en" else R)}\n</section>\n'
            + (f'{course(lg, f, 0)}\n' if learn else "") +
            f'<section class="module" id="watch" data-store="{f["prefix"]}" aria-labelledby="watch-h">\n'
            f'<div class="mhead"><div><h2 id="watch-h">{T(lg, "Watch the film", "Mira la película")}</h2><p>{T(lg, "Press Play, or pick a chapter. Turn on <b>Pause and think</b> to stop for one question at the end of chapters.", "Presiona Reproducir, o salta a un capítulo. Activa <b>Pausa para pensar</b> y la película se detiene con una pregunta al final de los capítulos.")}</p></div></div>\n'
            f'{player}\n<div class="chapters" id="chapters" aria-label="{T(lg, "Chapters", "Capítulos")}"></div>\n{links}\n{nextp}\n</section>\n\n'
            + project_section(lg, f) +
            f'<section class="module" id="think-it-through" aria-labelledby="think-h">\n<div class="mhead"><div><h2 id="think-h">{T(lg, "Think it through", "Piénsalo")}</h2><p>{T(lg, f"The {ntw} Pause and think questions, for a class or a team. Open one to see the answer.", f"Las {ntw} preguntas de Pausa para pensar, para una clase o un equipo. Abre una para ver la respuesta.")}</p></div></div>\n<div id="think-list"></div>\n</section>\n\n'
            + series_nav(lg, f, films_, R, "../") + '</main>\n'
            f'{foot(lg, S, learn)}\n'
            + ('' if lg == "en" else '<script>window.L10N={ui:{play:"Reproducir",pause:"Pausa",load:"Cargando…",fs:"Pantalla completa",fsExit:"Salir de pantalla completa"}};</script>\n')
            + ('' if lg == "en" else f'<script src="{R}assets/{key}/captions.es.js"></script>\n')
            + f'<script src="{R}assets/{key}/film.js"></script>\n' + ('' if lg == "en" else es_scenes(f) + "\n")
            + f'<script src="{R}assets/{key}/think.{lg}.js"></script>\n<script src="{R}assets/learn/think.js"></script>\n<script src="{R}assets/learn/path.js"></script>\n<script src="{R}assets/learn/next.js"></script>\n<script src="{R}assets/ambient.js"></script>\n</body>\n</html>\n')
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
            f'<h1>{E(h1)}</h1>\n<p class="lead">{E(lead)}</p>\n</section>\n{course(lg, f, 1 if which == "labs" else 2)}\n{mid}</main>\n{foot(lg, S)}\n'
            f'<script src="{R}assets/{key}/film.js"></script>\n<script src="{R}assets/{key}/learn.{lg}.js"></script>\n<script src="{R}assets/from-words-to-data/learn.js"></script>\n'
            f'<script src="{R}assets/learn/path.js"></script>\n<script src="{R}assets/ambient.js"></script>\n</body>\n</html>\n')
    return h + "</head>\n" + body


def series_page(lg, series, films_, S=FW):
    """The series' page: its films, then the sections its series.json has (the films still to come, the thread, what each film
    opens with, its people)."""
    path = f'{S["slug"]}/'
    title = f'{SN(lg, S)} · Learning Data'
    img = films_[0]["key"] + "-poster.jpg" if films_ else "sketch-poster.jpg"
    learn = any(x["labs"] for x in films_)
    h, R = head(lg, path, title, series[T(lg, "description", "description_es")], series[T(lg, "lead", "lead_es")], img)
    posters = [f'<img src="{R}assets/{x["key"]}-poster.jpg" alt="">' for x in films_] * (8 if len(films_) < 4 else 2)
    body = (f'<body>\n{header(lg, path, R)}\n<main>\n<section class="hero cine"><div class="bg mosaic" aria-hidden="true">' + "".join(posters[:8]) + '</div><canvas class="fx" aria-hidden="true"></canvas>\n'
            f'{crumbs(lg, R, S)}\n'
            f'<h1>{SN(lg, S)}</h1>\n<p class="lead">{E(series[T(lg, "lead", "lead_es")])}</p>\n'
            + ('' if lg == "en" else
               '<p class="note">Las películas están en inglés, con subtítulos en español. Estas páginas, los capítulos, las preguntas, los labs y las situaciones están en español.</p>\n' if learn else
               '<p class="note">Las películas están en inglés, con subtítulos en español. Estas páginas, los capítulos y las preguntas están en español.</p>\n')
            + '</section>\n\n'
            f'<section class="module" id="films" aria-labelledby="films-h">\n<div class="mhead"><div><h2 id="films-h">{T(lg, "The films", "Las películas")}</h2><p>{E(series[T(lg, "order", "order_es")])}</p></div></div>\n'
            f'<div class="topic-grid" data-progress-text=\'{PT[lg]}\'>\n' + "\n".join(card(lg, x, "", R) for x in films_) + '\n</div>\n</section>\n\n')
    if "coming" in series:
        rows = "\n".join(f'<li><span class="n">{i}</span><span><b>{E(t)}</b> · {E(d)}</span></li>' for i, t, d in series[T(lg, "coming", "coming_es")])
        body += (f'<section class="module" id="coming" aria-labelledby="coming-h">\n<div class="mhead"><div><h2 id="coming-h">{E(series[T(lg, "coming_h", "coming_h_es")])}</h2><p>{E(series[T(lg, "coming_p", "coming_p_es")])}</p></div></div>\n'
                 f'<ol class="series-list coming">\n{rows}\n</ol>\n</section>\n\n')
    body += f'<section class="module" id="thread" aria-labelledby="thread-h">\n<div class="mhead"><div><h2 id="thread-h">{E(series[T(lg, "thread_h", "thread_h_es")])}</h2><p>{E(series[T(lg, "thread", "thread_es")])}</p></div></div>\n</section>\n\n'
    if "past" in series:
        past = series[T(lg, "past", "past_es")]
        rows = "\n".join(f'<tr><td>{E(x["title"] if lg == "en" else x["site"]["title_es"])}</td><td>{E(past[x["index"]][0])}</td><td>{E(past[x["index"]][1])}</td></tr>' for x in films_)
        body += (f'<section class="module" id="past" aria-labelledby="past-h">\n<div class="mhead"><div><h2 id="past-h">{E(series[T(lg, "past_h", "past_h_es")])}</h2></div></div>\n'
                 f'<div class="prose"><table><thead><tr><th>{T(lg, "Film", "Película")}</th><th>{T(lg, "Opens with", "Empieza con")}</th><th>{T(lg, "Still true today", "Sigue siendo cierto")}</th></tr></thead><tbody>\n{rows}\n</tbody></table></div>\n</section>\n\n')
    people = "\n".join(f'<div class="card {k}"><h3>{E(a)}</h3><p>{E(b)}</p></div>' for k, a, b in series[T(lg, "people", "people_es")])
    body += (f'<section class="module" id="four-sides" aria-labelledby="four-sides-h">\n<div class="mhead"><div><h2 id="four-sides-h">{E(series[T(lg, "people_h", "people_h_es")])}</h2><p>'
             + T(lg, "Cyan outlines are technical; gold outlines are business.", "Los contornos cian son del lado técnico; los dorados, del lado de negocio.") + f'</p></div></div>\n<div class="four">\n{people}\n</div>\n</section>\n</main>\n'
             f'{foot(lg, S, learn)}\n<script src="{R}assets/learn/path.js"></script>\n<script src="{R}assets/ambient.js"></script>\n</body>\n</html>\n')
    return h + "</head>\n" + body


# ---------------------------------------------------------------- the topics: their page, and their tiles on other pages
def media(e, R):
    """A card's picture: a film's poster, or a series' first three, as one picture."""
    pics = [f'<img src="{R}assets/{p}" alt="" width="1280" height="720" loading="lazy">' for p in e["posters"][:3]]
    return pics[0] if e["kind"] == "film" else f'<div class="sc-media">{"".join(pics)}</div>'


def progress(e):
    """A card's progress, filled by assets/learn/path.js: a film's (watched, labs, scenarios), or how many of a series' films were watched."""
    if e["progress"][0] == "film":
        _, p, nl, nq = e["progress"]
        return f'<p class="tc-progress" data-progress="{p}" data-labs="{nl}" data-quiz="{nq}" hidden></p>'
    return f'<p class="tc-progress" data-films="{" ".join(e["progress"][1])}" hidden></p>'


def topic_card(lg, e, RL, R):
    """A film's or a series' card on the Topics page: the picture on the left, from 700 px wide; the whole card is one link."""
    lang = ' lang="en"' if lg == "es" and e["title_lang"] == "en" else ""
    cls = "topic-card row" + (" series-card" if e["kind"] == "series" else "")
    return (f'<article class="{cls}">\n{media(e, R)}\n<div class="tc-body">\n<p class="kicker">{E(e["kicker"])}</p>\n'
            f'<h3><a href="{RL}{e["href"]}"{lang}>{E(e["title"])}</a></h3>\n<p>{E(e["card"])}</p>\n<p class="meta">{e["meta"]}</p>\n{progress(e)}\n</div>\n</article>')


TOPICS_PAGE = {
    "title": {"en": "Topics · Learning Data", "es": "Temas · Learning Data"},
    "desc": {"en": "Short films on data, in five topics: data platforms, data modelling, analytics engineering, data quality and change, and enterprise architecture. Start with how a data platform works, then pick the topic you need.",
             "es": "Películas cortas sobre datos, en cinco temas: plataformas de datos, modelado de datos, ingeniería analítica, calidad de datos y cambios, y arquitectura empresarial. Empieza por cómo funciona una plataforma de datos y luego elige el tema que necesitas."},
    "lead": {"en": "Five topics, each with its films and series. Start with how a data platform works, then pick the topic you need. Your progress stays in this browser.",
             "es": "Cinco temas, cada uno con sus películas y series. Empieza por cómo funciona una plataforma de datos y luego elige el tema que necesitas. Tu progreso se guarda en este navegador."},
    "foot": {"en": "The university, the utility, people, numbers and records in the films, the labs and the scenarios are fictional. The narration is a synthetic voice. Code: MIT licence. Films, scripts, captions, images and text: CC BY 4.0. Company logos and trademarks, including the Databricks and dbt logos, are not covered by either licence and belong to their owners; this project is not affiliated with or endorsed by them.",
             "es": "La universidad, la empresa de energía, las personas, las cifras y los registros de las películas, los labs y las situaciones son ficticios. La narración es una voz sintética. Código: licencia MIT. Películas, guiones, subtítulos, imágenes y texto: CC BY 4.0. Los logotipos y marcas de empresas, incluidos los de Databricks y dbt, no están cubiertos por ninguna de las dos licencias y pertenecen a sus dueños; este proyecto no está afiliado a ellos ni cuenta con su respaldo."},
}


def topics_page(lg):
    """The Topics page: every topic, who it's for and what it covers, with a card for each of its films and series."""
    path = "topics/"
    h, R = head(lg, path, TOPICS_PAGE["title"][lg], TOPICS_PAGE["desc"][lg], TOPICS_PAGE["desc"][lg], "poster.jpg")
    RL = R if lg == "en" else R[3:]
    es = {t["id"]: [entry(lg, i) for i in t["items"]] for t in TOPICS}
    firsts = [e["posters"][0] for t in TOPICS for e in es[t["id"]]]
    seconds = [p for t in TOPICS for e in es[t["id"]] for p in e["posters"][1:2]]
    mosaic = "".join(f'<img src="{R}assets/{p}" alt="">' for p in (firsts + seconds)[:8])
    jump = "".join(f'<a href="#{t["id"]}">{E(t["name"][lg])}</a>' for t in TOPICS)
    body = (f'<body>\n{header(lg, path, R, cur="page")}\n<main>\n<section class="hero cine"><div class="bg mosaic" aria-hidden="true">{mosaic}</div><canvas class="fx" aria-hidden="true"></canvas>\n'
            f'<p class="eyebrow">Learning Data</p>\n<h1>{T(lg, "Topics", "Temas")}</h1>\n<p class="lead">{TOPICS_PAGE["lead"][lg]}</p>\n'
            f'<nav class="topic-jump" aria-label="{T(lg, "The five topics", "Los cinco temas")}">{jump}</nav>\n</section>\n')
    for t in TOPICS:
        cards = "\n".join(topic_card(lg, e, RL, R) for e in es[t["id"]])
        body += (f'\n<section class="module topic" id="{t["id"]}" aria-labelledby="{t["id"]}-h">\n'
                 f'<div class="mhead"><div><p class="step">{E(t["who"][lg])}</p><h2 id="{t["id"]}-h">{E(t["name"][lg])}</h2><p>{E(t["line"][lg])}</p></div></div>\n'
                 f'<div class="topic-grid rows" data-progress-text=\'{PT[lg]}\' data-series-text=\'{ST[lg]}\'>\n{cards}\n</div>\n</section>\n')
    body += (f'</main>\n<footer>{SOURCE[lg]}<p>{TOPICS_PAGE["foot"][lg]} {NOTICES[lg]}</p></footer>\n'
             f'<script src="{R}assets/learn/path.js"></script>\n<script src="{R}assets/ambient.js"></script>\n</body>\n</html>\n')
    return h + "</head>\n" + body


def tiles(lg, R):
    """Every topic after the first, as a tile: its name (a link to it on the Topics page), what it covers, and its films and
    series, each a link. For the home page and the intro's scenarios page, whose path to the site's root is R."""
    RL = R if lg == "en" else R[3:]
    out = []
    for t in TOPICS[1:]:
        rows = []
        for i in t["items"]:
            e = entry(lg, i)
            lang = ' lang="en"' if lg == "es" and e["title_lang"] == "en" else ""
            small = e["kicker"] if e["kind"] == "series" else f'{e["kicker"]} · {e["len"]} min'
            rows.append(f'<li><a href="{RL}{e["href"]}"><img src="{R}assets/{e["posters"][0]}" alt="" width="1280" height="720" loading="lazy">'
                        f'<span><b{lang}>{E(e["title"])}</b><small>{E(small)}</small></span></a></li>')
        out.append(f'<div class="topic-tile">\n<h3><a href="{RL}topics/#{t["id"]}">{E(t["name"][lg])}</a></h3>\n<p>{E(t["line"][lg])}</p>\n'
                   f'<ul class="tt-items">\n' + "\n".join(rows) + '\n</ul>\n</div>')
    return '<div class="topic-tiles">\n' + "\n".join(out) + '\n</div>\n'


def marks(S):
    return f'<!-- {S["id"]}: made by site-tools/build_series.py -->', f'<!-- /{S["id"]} -->'


OPEN, CLOSE = marks(FW)
BLOCKS = FW["blocks"]  # kept for callers that count From words to data's blocks
# the hand-written pages that show the topics as tiles: (path under site/, language, the path from that page to the site's root)
TILES = [("index.html", "en", ""), ("es/index.html", "es", "../"), ("scenarios/index.html", "en", "../"), ("es/scenarios/index.html", "es", "../../")]
TILE_MARKS = ('<!-- topics: made by site-tools/build_series.py -->', '<!-- /topics -->')


def block(lg, what, R, rel, films_, S=FW):
    """A series' card on a hand-written page: its first film, with a kicker that names the series."""
    if not films_:
        return ""
    n = len(json.loads((S["root"] / "series.json").read_text())["films"])
    kicker = f'{SN(lg, S)}: {NUM[lg][n - 1]} {T(lg, "films", "películas")}' if n > 1 else SN(lg, S)
    return card(lg, films_[0], rel, R, kicker=kicker) + "\n"


def blocks():
    """The hand-written pages, with every series' blocks and the topics' tiles filled in: (path under site/, html). A page with
    several blocks is listed once, with all of them filled."""
    texts = {}

    def fill(rel_path, o, c, inner):
        src = texts.get(rel_path) or (WEB / rel_path).read_text(); i, j = src.index(o), src.index(c)
        texts[rel_path] = src[:i + len(o)] + "\n" + inner + src[j:]
    for S in SERIES:
        films_ = films(S)[1]; o, c = marks(S)
        for rel_path, lg, what, R, rel in S["blocks"]:
            fill(rel_path, o, c, block(lg, what, R, rel, films_, S))
    for rel_path, lg, R in TILES:
        fill(rel_path, *TILE_MARKS, tiles(lg, R))
    return list(texts.items())


def readme(S=FW):
    """A series' README, with its table of films filled in from the same data."""
    src = (S["root"] / "README.md").read_text(); o, c = "<!-- films: made by site-tools/build_series.py's readme() -->", "<!-- /films -->"
    learn = any(f["labs"] for f in films(S)[1])
    rows = (["| Film | Topic | Length | Chapters | Labs and scenarios | Script |", "|---|---|---|---|---|---|"] if learn else
            ["| Film | Topic | Length | Chapters | Pause and think | Script |", "|---|---|---|---|---|---|"])
    for f in films(S)[1]:
        rows.append(f"| [{f['title']}]({BASE}{S['slug']}/{f['key']}/) | {f['site']['kicker']} | {f['len']} min | {len(f['chapters'])} | "
                    + (f"{f['labs']} labs, {f['quiz']} scenarios" if learn else f"{f['think']} questions")
                    + f" | [script]({f['dir']}/script.md) · [source]({f['dir']}/source/README.md) |")
    i, j = src.index(o), src.index(c)
    return src[:i + len(o)] + "\n" + "\n".join(rows) + "\n" + src[j:]


def pages():
    """Every generated page, of every series, and the Topics page: (path under site/, html)."""
    out = [("topics/index.html", topics_page("en")), ("es/topics/index.html", topics_page("es"))]
    for S in SERIES:
        series, films_ = films(S)
        if not films_:
            continue
        for lg in ("en", "es"):
            pre = "" if lg == "en" else "es/"
            out.append((f'{pre}{S["slug"]}/index.html', series_page(lg, series, films_, S)))
            for f in films_:
                out.append((f'{pre}{S["slug"]}/{f["key"]}/index.html', film_page(lg, f, films_, series)))
                if f["labs"]:
                    out.append((f'{pre}{S["slug"]}/{f["key"]}/labs/index.html', learn_page(lg, f, "labs")))
                    out.append((f'{pre}{S["slug"]}/{f["key"]}/scenarios/index.html', learn_page(lg, f, "scenarios")))
    return out


if __name__ == "__main__":
    n = 0
    for rel, text in pages() + blocks():
        p = WEB / rel
        p.parent.mkdir(parents=True, exist_ok=True)
        if not p.exists() or p.read_text() != text:
            p.write_text(text); n += 1
    for S in SERIES:
        if readme(S) != (S["root"] / "README.md").read_text():
            (S["root"] / "README.md").write_text(readme(S)); n += 1
        series, films_ = films(S)
        print(f"{S['name']['en']}: {len(films_)} film{'s' if len(films_) != 1 else ''}: " + ", ".join(f"{f['title']} ({f['len']} min, {offers('en', f)})" for f in films_))
    print(f"wrote {n} of {len(pages()) + len(blocks())} pages (the series' own and the Topics page, and their blocks in {len(blocks())} others)")
