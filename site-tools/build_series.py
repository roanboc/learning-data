#!/usr/bin/env python3
"""Builds the pages of the series From words to data, in English and Spanish:

    python site-tools/build_series.py

For the series page (site/from-words-to-data/) and, for each film, its Watch, Take it apart and Make the call pages
(site/from-words-to-data/<film>/, labs/, scenarios/), and their twins under site/es/. The words come from
films/from-words-to-data/series.json and each film's site.json; the length and chapters from the film's own source
(narration.js, vodur.js and breath.js, timed as The Inner Life of Data's engine times them); the counts of labs and scenarios
from the film's words in site/assets/<film>/learn.en.js. A film whose player isn't in site/assets/<film>/ yet is left out.
Never edit the generated pages by hand: change the words, and run this again. check_site.py and smoke.py read the series
through films() below, so a new film needs no change to them."""
import html, json, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
WEB = ROOT / "site"
SER = ROOT / "films" / "from-words-to-data"
BASE = "https://roanboc.github.io/learning-data/"
REPO = "https://github.com/roanboc/learning-data"
E = lambda s: html.escape(s, quote=False).replace('"', "&quot;")
NUM = {"en": "one two three four five six seven eight nine ten eleven twelve".split(),
       "es": "uno dos tres cuatro cinco seis siete ocho nueve diez once doce".split()}


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


def films():
    """Every film of the series whose player is on the site, in order, with everything its pages need."""
    series = json.loads((SER / "series.json").read_text())
    out = []
    for i, d in enumerate(series["films"]):
        src = SER / d / "source"
        meta = json.loads((src / "film.json").read_text())
        key = meta["key"]
        if not (WEB / "assets" / key / "film.js").exists() or not (SER / d / "site.json").exists():
            continue
        site = json.loads((SER / d / "site.json").read_text())
        words = (WEB / "assets" / key / "learn.en.js").read_text()
        labs_part = words[words.index("labs:["):words.index("qs:[")]
        nl, nq = len(re.findall(r'\bkind:"', labs_part)), len(re.findall(r'\{type:"', words))
        # the Pause and think questions: one per stop, in the film's think pack
        nt = len(re.findall(r'\bstop:"', (WEB / "assets" / key / "think.en.js").read_text()))
        N = load_obj(src / "src" / "narration.js")
        out.append(dict(dir=d, key=key, title=meta["title"], site=site, labs=nl, quiz=nq, think=nt, len=minutes(length(src)), sec=length(src),
                        chapters=[(k, v["name"]) for k, v in N.items()], prefix="ld-" + key, index=i))
    return series, out


# ---------------------------------------------------------------- page parts
FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
         '<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet">')
FOOT = {"en": '<footer><p class="foot-links"><a href="https://github.com/roanboc/learning-data">Source on GitHub</a></p><p>The university, people, numbers and records in the film, the labs and the scenarios are fictional. The narration is a synthetic voice. Code: MIT licence. Film, script, captions, images and text: CC BY 4.0. Company logos and trademarks, including the Databricks and dbt logos, are not covered by either licence and belong to their owners; this project is not affiliated with or endorsed by them. See <a href="https://github.com/roanboc/learning-data/blob/main/NOTICE.md">notices</a>.</p></footer>',
        "es": '<footer><p class="foot-links"><a href="https://github.com/roanboc/learning-data">Código en GitHub</a></p><p>La universidad, las personas, las cifras y los registros de la película, los labs y las situaciones son ficticios. La narración es una voz sintética. Código: licencia MIT. Película, guion, subtítulos, imágenes y textos: CC BY 4.0. Los logos y marcas de empresas, incluidos los de Databricks y dbt, no están cubiertos por ninguna de las dos licencias y pertenecen a sus dueños; este proyecto no está afiliado a ellos ni cuenta con su respaldo. Ver <a href="https://github.com/roanboc/learning-data/blob/main/NOTICE.md">avisos</a> (en inglés).</p></footer>'}
PT = {"en": '{"watched":"Watched","labs":"{n} of {of} labs","quiz":"{n} of {of} scenarios"}', "es": '{"watched":"Vista","labs":"{n} de {of} labs","quiz":"{n} de {of} situaciones"}'}


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


def header(lg, path, R):
    if lg == "en":
        return (f'<header class="top"><div class="top-in"><a class="brand" href="{R}"><img src="{R}assets/favicon.svg" alt=""><span>Learning Data</span></a><nav aria-label="Site">'
                f'<a href="{R}">Start here</a><a href="{R}topics/" aria-current="true">Topics</a><a href="{R}journey/">Making of</a><span class="lang" role="group" aria-label="Language">'
                f'<a href="./" aria-current="true" lang="en">EN</a><a href="{R}es/{path}" lang="es" hreflang="es">ES</a></span></nav></div></header>')
    RE = R[3:]
    return (f'<header class="top"><div class="top-in"><a class="brand" href="{RE}"><img src="{R}assets/favicon.svg" alt=""><span>Learning Data</span></a><nav aria-label="Sitio">'
            f'<a href="{RE}">Empieza aquí</a><a href="{RE}topics/" aria-current="true">Temas</a><a href="{RE}journey/">Cómo se hizo</a><span class="lang" role="group" aria-label="Idioma">'
            f'<a href="{R}{path}" lang="en" hreflang="en">EN</a><a href="./" aria-current="true" lang="es">ES</a></span></nav></div></header>')


def T(lg, en, es):
    return en if lg == "en" else es


def num(lg, f):
    """A film's place in the series, always as "Film 2 of 7": site-tools/check_site.py allows numbering only in this form."""
    n = len(json.loads((SER / "series.json").read_text())["films"])
    return T(lg, "Film", "Película") + f' {f["index"] + 1} {T(lg, "of", "de")} {n}'


def card(lg, f, rel, R, kicker=None):
    """A topic card for a film of the series, linking to it from a page whose path to the series folder is rel.
    Its kicker says the film's number in the series, unless the card stands for the whole series (kicker)."""
    s = f["site"]
    kicker = kicker or f'{num(lg, f)} · {s[T(lg, "kicker", "kicker_es")]}'
    meta = f'{f["len"]} min · {f["labs"]} labs · {f["quiz"]} {T(lg, "scenarios", "situaciones")} · {T(lg, "From words to data", "De las palabras a los datos")}' + T(lg, "", " · En inglés")
    return (f'<article class="topic-card">\n<img src="{R}assets/{f["key"]}-poster.jpg" alt="" width="1280" height="720" loading="lazy">\n<div class="tc-body">\n'
            f'<p class="kicker">{E(kicker)}</p>\n<h3><a href="{rel}{f["key"]}/">{E(f["title"] if lg == "en" else s["title_es"])}</a></h3>\n'
            f'<p>{E(s[T(lg, "card", "card_es")])}</p>\n<p class="meta">{meta}</p>\n'
            f'<p class="tc-progress" data-progress="{f["prefix"]}" data-labs="{f["labs"]}" data-quiz="{f["quiz"]}" hidden></p>\n</div>\n</article>')


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


def builds_on(lg, f, all_films, R):
    """What the film builds on: the chapter of The Inner Life of Data and A Sharper Sketch for the first, the films before it for the rest."""
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


def series_nav(lg, f, films_, R, rel):
    """In the series: the previous and the next film, as cards, and every film of the series, numbered, with this one marked.
    rel is the path from the page to the series folder."""
    by = {x["index"]: x for x in films_}; prv, nxt = by.get(f["index"] - 1), by.get(f["index"] + 1)
    nm = lambda x: E(x["title"] if lg == "en" else x["site"]["title_es"])
    cards = ([card(lg, prv, rel, R, kicker=f'← {T(lg, "Previous", "Anterior")} · {num(lg, prv)}')] if prv else []) + \
            ([card(lg, nxt, rel, R, kicker=f'{T(lg, "Next", "Siguiente")} · {num(lg, nxt)} →')] if nxt else [])
    lis = "\n".join(f'<li><a href="{rel}{x["key"]}/"' + (' aria-current="page"' if x is f else "") + f'><span class="n">{x["index"] + 1}</span>{nm(x)}</a></li>' for x in films_)
    return (f'<section class="module" id="in-the-series" aria-labelledby="series-h">\n<div class="mhead"><div><h2 id="series-h">{T(lg, "In the series", "En la serie")}: <a href="{rel}">{T(lg, "From words to data", "De las palabras a los datos")}</a></h2>'
            f'<p>{num(lg, f)}.</p></div></div>\n'
            f'<div class="topic-grid series-pn" data-progress-text=\'{PT[lg]}\'>\n' + "\n".join(cards) + '\n</div>\n'
            f'<ol class="series-list" aria-label="{T(lg, "Every film of the series", "Todas las películas de la serie")}">\n{lis}\n</ol>\n</section>\n')


def es_scenes(f):
    names = f["site"]["chapters_es"]
    return ('<script>/* the film is in English; its chapter buttons and the Pause and think kicker use these Spanish names */\n'
            '{const N=' + json.dumps(names, ensure_ascii=False) + ';SCENES.forEach(s=>{if(N[s.id])s.name=N[s.id];});}</script>')


# ---------------------------------------------------------------- pages
def film_page(lg, f, films_, series):
    s = f["site"]; key = f["key"]; path = f"from-words-to-data/{key}/"
    name = f["title"] if lg == "en" else s["title_es"]
    title = f'{name} · {T(lg, "From words to data", "De las palabras a los datos")} · Learning Data'
    h, R = head(lg, path, title, s[T(lg, "description", "description_es")], s[T(lg, "card", "card_es")], f"{key}-poster.jpg")
    nxt = next((x for x in films_ if x["index"] == f["index"] + 1), None)
    script = f'{REPO}/blob/main/films/from-words-to-data/{f["dir"]}/script.md'; caps = f'{REPO}/tree/main/films/from-words-to-data/{f["dir"]}/captions'
    note = ('' if lg == "en" else '<p class="note">La película está en inglés, con subtítulos en español. Esta página, los capítulos, las preguntas, los labs y las situaciones están en español.</p>\n')
    ntw = NUM[lg][f["think"] - 1]  # how many Pause and think questions, in words
    meta = (f'<p class="meta-row"><span>{f["len"]} min</span><span>{f["labs"]} labs</span><span>{f["quiz"]} scenarios</span><span>Pause and think</span><span>English captions</span></p>' if lg == "en" else
            f'<p class="meta-row"><span>{f["len"]} min</span><span>{f["labs"]} labs</span><span>{f["quiz"]} situaciones</span><span>Pausa para pensar</span><span>En inglés, con subtítulos en español</span></p>')
    nm = lambda x: E(x["title"] if lg == "en" else x["site"]["title_es"])
    third = (f'<a class="btn" href="../{nxt["key"]}/">{T(lg, "Next in the series", "Sigue en la serie")}: {nm(nxt)}</a>' if nxt else
             f'<a class="btn" href="../">{T(lg, "The whole series", "Toda la serie")}: {T(lg, "From words to data", "De las palabras a los datos")}</a>')
    player = (f'<div class="player" data-labs="labs/">\n<audio id="snd" preload="metadata" src="{R}assets/{key}/soundtrack.mp3"></audio><div class="poster"><img src="{R}assets/{key}-poster.jpg" alt="" width="1280" height="720" data-play>'
              f'<div class="poster-cta"><button type="button" class="play-badge" data-play>{T(lg, "▶ Play the film", "▶ Ver la película")} · {f["len"]} min</button><button type="button" class="think-badge" data-think>{T(lg, "Play with pauses to think", "Ver con pausas para pensar")}</button></div></div>'
              f'<canvas id="film" width="1280" height="720" aria-label="{T(lg, "Animated film", "Película animada, en inglés")}: {E(f["title"])}"></canvas>\n'
              + (f'<div class="bar"><button id="play">Play</button><input id="scrub" type="range" min="0" step="0.01" value="0" aria-label="Seek"><span id="time">0:00</span><button id="think" aria-pressed="false" title="Stop at the end of {ntw} chapters, with one question each">Pause and think</button><button id="cc" class="on" aria-pressed="true">Captions</button><button id="fs">Full screen</button></div>' if lg == "en" else
                 f'<div class="bar"><button id="play">Reproducir</button><input id="scrub" type="range" min="0" step="0.01" value="0" aria-label="Buscar"><span id="time">0:00</span><button id="think" aria-pressed="false" title="Detenerse al final de {ntw} capítulos, con una pregunta cada vez">Pausa para pensar</button><button id="cc" class="on" aria-pressed="true">Subtítulos</button><button id="fs">Pantalla completa</button></div>')
              + '\n</div>')
    links = (f'<p class="film-links"><a href="https://github.com/roanboc/learning-data/releases/latest/download/{key}.mp4">Download the video</a><a href="{caps}">Caption files</a><a href="{script}">Read the script</a></p>' if lg == "en" else
             f'<p class="film-links"><a href="https://github.com/roanboc/learning-data/releases/latest/download/{key}.mp4">Descargar el video (en inglés)</a><a href="{caps}">Archivos de subtítulos</a><a href="{script}" hreflang="en">Leer el guion (en inglés)</a></p>')
    nextp = (f'<template id="next-panel"><div class="think-card"><p class="think-k">{T(lg, "Where next?", "¿Y ahora?")}</p><h3>{E(s[T(lg, "next_h", "next_h_es")])}</h3>\n'
             f'<div class="next-opts"><a class="btn primary" href="labs/">{T(lg, "Take it apart", "Desarma")}: {f["labs"]} {T(lg, "hands-on labs", "labs interactivos")} →</a><a class="btn" href="scenarios/">{T(lg, "Make the call", "Tú decides")}: {f["quiz"]} {T(lg, "situations", "situaciones")}</a>{third}</div>\n'
             f'<div class="think-foot"><button type="button" class="btn" data-again>{T(lg, "Watch again", "Ver de nuevo")}</button></div></div></template>')
    body = (f'<body>\n{header(lg, path, R)}\n<main>\n<section class="hero cine"><div class="bg" aria-hidden="true"><img src="{R}assets/{key}-poster.jpg" alt=""></div><canvas class="fx" aria-hidden="true"></canvas>\n'
            f'<p class="eyebrow crumbs"><a href="{R if lg == "en" else R[3:]}topics/">{T(lg, "Topics", "Temas")}</a> › <a href="../">{T(lg, "From words to data", "De las palabras a los datos")}</a></p>\n'
            f'<h1>{E(s[T(lg, "h1", "h1_es")])}</h1>\n<p class="lead">{E(s[T(lg, "lead", "lead_es")])}</p>\n{meta}\n{note}{builds_on(lg, f, films_, R if lg == "en" else R)}\n</section>\n'
            f'{course(lg, f, 0)}\n'
            f'<section class="module" id="watch" data-store="{f["prefix"]}" aria-labelledby="watch-h">\n'
            f'<div class="mhead"><div><h2 id="watch-h">{T(lg, "Watch the film", "Mira la película")}</h2><p>{T(lg, "Press Play, or pick a chapter. Turn on <b>Pause and think</b> to stop for one question at the end of chapters.", "Presiona Reproducir, o salta a un capítulo. Activa <b>Pausa para pensar</b> y la película se detiene con una pregunta al final de los capítulos.")}</p></div></div>\n'
            f'{player}\n<div class="chapters" id="chapters" aria-label="{T(lg, "Chapters", "Capítulos")}"></div>\n{links}\n{nextp}\n</section>\n\n'
            f'<section class="module" id="think-it-through" aria-labelledby="think-h">\n<div class="mhead"><div><h2 id="think-h">{T(lg, "Think it through", "Piénsalo")}</h2><p>{T(lg, f"The {ntw} Pause and think questions, for a class or a team. Open one to see the answer.", f"Las {ntw} preguntas de Pausa para pensar, para una clase o un equipo. Abre una para ver la respuesta.")}</p></div></div>\n<div id="think-list"></div>\n</section>\n\n'
            + series_nav(lg, f, films_, R, "../") + '</main>\n'
            f'{FOOT[lg]}\n'
            + ('' if lg == "en" else '<script>window.L10N={ui:{play:"Reproducir",pause:"Pausa",load:"Cargando…",fs:"Pantalla completa",fsExit:"Salir de pantalla completa"}};</script>\n')
            + ('' if lg == "en" else f'<script src="{R}assets/{key}/captions.es.js"></script>\n')
            + f'<script src="{R}assets/{key}/film.js"></script>\n' + ('' if lg == "en" else es_scenes(f) + "\n")
            + f'<script src="{R}assets/{key}/think.{lg}.js"></script>\n<script src="{R}assets/learn/think.js"></script>\n<script src="{R}assets/learn/path.js"></script>\n<script src="{R}assets/learn/next.js"></script>\n<script src="{R}assets/ambient.js"></script>\n</body>\n</html>\n')
    return h + "</head>\n" + body


def learn_page(lg, f, which):
    """The labs page (which="labs") or the scenarios page (which="scenarios") of a film."""
    s = f["site"]; key = f["key"]; path = f"from-words-to-data/{key}/{which}/"
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
        films_ = films()[1]
        mid = (f'<section aria-labelledby="scenarios-h" class="section-gap">\n<h2 class="sr" id="scenarios-h">{T(lg, "Scenarios", "Situaciones")}</h2>\n'
               f'<div id="fw-quiz"><noscript><p class="noscript">{T(lg, "The scenarios need JavaScript.", "Las situaciones necesitan JavaScript.")}</p></noscript></div>\n</section>\n\n'
               + series_nav(lg, f, films_, R, "../../"))
    body = (f'<body>\n{header(lg, path, R)}\n<main>\n<section class="page-head cine"><div class="bg" aria-hidden="true"><img src="{R}assets/{key}-poster.jpg" alt=""></div><canvas class="fx" aria-hidden="true"></canvas>\n'
            f'<p class="eyebrow crumbs"><a href="{R if lg == "en" else R[3:]}topics/">{T(lg, "Topics", "Temas")}</a> › <a href="../../">{T(lg, "From words to data", "De las palabras a los datos")}</a></p>\n'
            f'<h1>{E(h1)}</h1>\n<p class="lead">{E(lead)}</p>\n</section>\n{course(lg, f, 1 if which == "labs" else 2)}\n{mid}</main>\n{FOOT[lg]}\n'
            f'<script src="{R}assets/{key}/film.js"></script>\n<script src="{R}assets/{key}/learn.{lg}.js"></script>\n<script src="{R}assets/from-words-to-data/learn.js"></script>\n'
            f'<script src="{R}assets/learn/path.js"></script>\n<script src="{R}assets/ambient.js"></script>\n</body>\n</html>\n')
    return h + "</head>\n" + body


def series_page(lg, series, films_):
    path = "from-words-to-data/"
    title = f'{T(lg, "From words to data", "De las palabras a los datos")} · Learning Data'
    img = films_[0]["key"] + "-poster.jpg" if films_ else "sketch-poster.jpg"
    h, R = head(lg, path, title, series[T(lg, "description", "description_es")], series[T(lg, "lead", "lead_es")], img)
    posters = [f'<img src="{R}assets/{x["key"]}-poster.jpg" alt="">' for x in films_] * 2
    past = series[T(lg, "past", "past_es")]
    rows = "\n".join(f'<tr><td>{E(x["title"] if lg == "en" else x["site"]["title_es"])}</td><td>{E(past[x["index"]][0])}</td><td>{E(past[x["index"]][1])}</td></tr>' for x in films_)
    people = "\n".join(f'<div class="card {k}"><h3>{E(a)}</h3><p>{E(b)}</p></div>' for k, a, b in series[T(lg, "people", "people_es")])
    body = (f'<body>\n{header(lg, path, R)}\n<main>\n<section class="hero cine"><div class="bg mosaic" aria-hidden="true">' + "".join(posters[:8]) + '</div><canvas class="fx" aria-hidden="true"></canvas>\n'
            f'<p class="eyebrow crumbs"><a href="{R if lg == "en" else R[3:]}topics/">{T(lg, "Topics", "Temas")}</a> › {T(lg, "From words to data", "De las palabras a los datos")}</p>\n'
            f'<h1>{T(lg, "From words to data", "De las palabras a los datos")}</h1>\n<p class="lead">{E(series[T(lg, "lead", "lead_es")])}</p>\n'
            + ('' if lg == "en" else '<p class="note">Las películas están en inglés, con subtítulos en español. Estas páginas, los capítulos, las preguntas, los labs y las situaciones están en español.</p>\n')
            + '</section>\n\n'
            f'<section class="module" id="films" aria-labelledby="films-h">\n<div class="mhead"><div><h2 id="films-h">{T(lg, "The films", "Las películas")}</h2><p>{E(series[T(lg, "order", "order_es")])}</p></div></div>\n'
            f'<div class="topic-grid" data-progress-text=\'{PT[lg]}\'>\n' + "\n".join(card(lg, x, "", R) for x in films_) + '\n</div>\n</section>\n\n'
            f'<section class="module" id="thread" aria-labelledby="thread-h">\n<div class="mhead"><div><h2 id="thread-h">{E(series[T(lg, "thread_h", "thread_h_es")])}</h2><p>{E(series[T(lg, "thread", "thread_es")])}</p></div></div>\n</section>\n\n'
            f'<section class="module" id="past" aria-labelledby="past-h">\n<div class="mhead"><div><h2 id="past-h">{E(series[T(lg, "past_h", "past_h_es")])}</h2></div></div>\n'
            f'<div class="prose"><table><thead><tr><th>{T(lg, "Film", "Película")}</th><th>{T(lg, "Opens with", "Empieza con")}</th><th>{T(lg, "Still true today", "Sigue siendo cierto")}</th></tr></thead><tbody>\n{rows}\n</tbody></table></div>\n</section>\n\n'
            f'<section class="module" id="four-sides" aria-labelledby="four-sides-h">\n<div class="mhead"><div><h2 id="four-sides-h">{E(series[T(lg, "people_h", "people_h_es")])}</h2><p>'
            + T(lg, "Cyan outlines are technical; gold outlines are business.", "Los contornos cian son del lado técnico; los dorados, del lado de negocio.") + f'</p></div></div>\n<div class="four">\n{people}\n</div>\n</section>\n</main>\n'
            f'{FOOT[lg]}\n<script src="{R}assets/learn/path.js"></script>\n<script src="{R}assets/ambient.js"></script>\n</body>\n</html>\n')
    return h + "</head>\n" + body


# the series in the site's hand-written pages: between <!-- from-words-to-data: made by site-tools/build_series.py --> and <!-- /from-words-to-data -->
# path, language, what goes there, the path from that page to the site's root, and to the series' folder
BLOCKS = [("index.html", "en", "card", "", "from-words-to-data/"), ("es/index.html", "es", "card", "../", "from-words-to-data/"),
          ("scenarios/index.html", "en", "card", "../", "../from-words-to-data/"), ("es/scenarios/index.html", "es", "card", "../../", "../from-words-to-data/"),
          ("sketch/index.html", "en", "card", "../", "../from-words-to-data/"), ("es/sketch/index.html", "es", "card", "../../", "../from-words-to-data/"),
          ("topics/index.html", "en", "branch", "../", "../from-words-to-data/"), ("es/topics/index.html", "es", "branch", "../../", "../from-words-to-data/")]
OPEN, CLOSE = "<!-- from-words-to-data: made by site-tools/build_series.py -->", "<!-- /from-words-to-data -->"


def block(lg, what, R, rel, films_):
    if not films_:
        return ""
    if what == "card":
        return card(lg, films_[0], rel, R, kicker=T(lg, "From words to data: seven films", "De las palabras a los datos: siete películas")) + "\n"
    head_ = (f'<li class="series"><p>From <a href="{R}#t=75"><i>The sketch</i></a>, in depth: the series <a href="{rel}"><i>From words to data</i></a>, {NUM["en"][len(films_) - 1]} films, in order</p>' if lg == "en" else
             f'<li class="series"><p>Desde <a href="{R[3:]}#t=84"><i>El boceto</i></a>, en profundidad: la serie <a href="{rel}"><i>De las palabras a los datos</i></a>, {NUM["es"][len(films_) - 1]} películas, en orden</p>')
    return (head_ + f'\n<div class="topic-grid" data-progress-text=\'{PT[lg]}\'>\n' + "\n".join(card(lg, x, rel, R) for x in films_) + '\n</div></li>\n')


def blocks():
    """The hand-written pages, with the series' blocks filled in: (path under site/, html)."""
    films_ = films()[1]; out = []
    for rel_path, lg, what, R, rel in BLOCKS:
        src = (WEB / rel_path).read_text(); i, j = src.index(OPEN), src.index(CLOSE)
        out.append((rel_path, src[:i + len(OPEN)] + "\n" + block(lg, what, R, rel, films_) + src[j:]))
    return out


def readme():
    """The series README, with its table of films filled in from the same data."""
    src = (SER / "README.md").read_text(); o, c = "<!-- films: made by site-tools/build_series.py's readme() -->", "<!-- /films -->"
    rows = ["| Film | Topic | Length | Chapters | Labs and scenarios | Script |", "|---|---|---|---|---|---|"]
    for f in films()[1]:
        rows.append(f"| [{f['title']}]({BASE}from-words-to-data/{f['key']}/) | {f['site']['kicker']} | {f['len']} min | {len(f['chapters'])} | "
                    f"{f['labs']} labs, {f['quiz']} scenarios | [script]({f['dir']}/script.md) · [source]({f['dir']}/source/README.md) |")
    i, j = src.index(o), src.index(c)
    return src[:i + len(o)] + "\n" + "\n".join(rows) + "\n" + src[j:]


def pages():
    """Every generated page: (path under site/, html)."""
    series, films_ = films()
    out = []
    for lg in ("en", "es"):
        pre = "" if lg == "en" else "es/"
        out.append((f"{pre}from-words-to-data/index.html", series_page(lg, series, films_)))
        for f in films_:
            out.append((f"{pre}from-words-to-data/{f['key']}/index.html", film_page(lg, f, films_, series)))
            out.append((f"{pre}from-words-to-data/{f['key']}/labs/index.html", learn_page(lg, f, "labs")))
            out.append((f"{pre}from-words-to-data/{f['key']}/scenarios/index.html", learn_page(lg, f, "scenarios")))
    return out


if __name__ == "__main__":
    n = 0
    for rel, text in pages() + blocks():
        p = WEB / rel
        p.parent.mkdir(parents=True, exist_ok=True)
        if not p.exists() or p.read_text() != text:
            p.write_text(text); n += 1
    if readme() != (SER / "README.md").read_text():
        (SER / "README.md").write_text(readme()); n += 1
    series, films_ = films()
    print(f"{len(films_)} films: " + ", ".join(f"{f['title']} ({f['len']} min, {f['labs']} labs, {f['quiz']} scenarios)" for f in films_))
    print(f"wrote {n} of {len(pages()) + len(BLOCKS)} pages (the series' own, and its blocks in {len(BLOCKS)} others)")
