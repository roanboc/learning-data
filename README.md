# learning-data

Learning artifacts for data: short, visual explanations of how modern data platforms work, from capture to decision.

**Site:** [https://roanboc.github.io/learning-data/](https://roanboc.github.io/learning-data/)

## The films

Start with *The Inner Life of Data*, the overview. Then go deeper, one topic at a time, in any order. Each topic builds on part of the overview.

| Topic | Film | Builds on |
|---|---|---|
| How a data platform works | [The Inner Life of Data](https://roanboc.github.io/learning-data/), in English and Spanish | Start here |
| Data modelling | [A Sharper Sketch](https://roanboc.github.io/learning-data/sketch/) | *The sketch* |
| Changes and data contracts | [Silent change](https://roanboc.github.io/learning-data/when-things-go-wrong/silent-change/), from the series *When things go wrong* | *Refining with dbt* and *Gold* |
| Data quality checks | [Too good to be true](https://roanboc.github.io/learning-data/when-things-go-wrong/too-good-to-be-true/), from the series *When things go wrong*, with labs and scenarios | *Refining with dbt* and *Gold* |

And on the [Making of page](https://roanboc.github.io/learning-data/journey/), two short films about the films themselves: *Data for Films*, how they're drawn, and *That's not quite right*, how they're made, by a person and Claude.

## What's here

```
site/                            the website, published to GitHub Pages as it is
  index.html                     Start here: The Inner Life of Data, with chapters, then "Go deeper" into the topics
  labs/                          its eight hands-on labs, one per chapter, on the platform map
  scenarios/                     its twelve scenarios, ending with the topics to go deeper
  topics/                        Topics: every film, under the chapter of The Inner Life of Data it goes deeper on
  sketch/                        Data modelling: A Sharper Sketch, with labs/ (six labs) and scenarios/ (twelve scenarios)
  when-things-go-wrong/          the series When things go wrong: a page for the series, and a folder per film
    silent-change/               Changes and data contracts: Silent change, with "Pause and think" questions
    too-good-to-be-true/         Data quality checks: Too good to be true, with "Pause and think", labs/ (three labs) and scenarios/ (ten)
  journey/                       Making of: two films (Data for Films, That's not quite right), then how the films were made; index.md (source) and index.html (generated)
  films/                         redirects: films/ goes to topics/, and the old player address films/inner-life-of-data/ to the home page
  404.html                       "Page not found", in English and Spanish
  es/                            the Spanish site, at the same paths. es/sketch/ and the pages of When things go wrong
                                 are Spanish pages around English films; Too good to be true's labs and scenarios are in Spanish too; A Sharper Sketch's labs and scenarios are in English only
  assets/                        styles (site.css), ambient.js (the moving light behind each page's hero), doc-nav.js (the Making of page's "On this page"), the icon, and a poster per film: poster.jpg, poster.es.jpg,
                                 sketch-poster.jpg, silent-change-poster.jpg and too-good-to-be-true-poster.jpg
    film/                        The Inner Life of Data's player and soundtrack, per language (built in films/inner-life-of-data/source/)
    film3/                       A Sharper Sketch's player and soundtrack (built in films/a-sharper-sketch/source/)
    silent-change/               Silent change's player and soundtrack (built in its source/), and its questions in think.en.js and think.es.js
    making-of/                   the Making of films' players, soundtracks and posters (built in films/making-of/*/source/)
    too-good-to-be-true/         Too good to be true's player and soundtrack, its questions (think.en.js, think.es.js), and its labs and
                                 scenarios: learn.js, drawn with the film's own components, with their words in learn.en.js and learn.es.js
    learn/                       for every film page: path.js (the stepper and progress), think.js ("Pause and think")
                                 and next.js ("Where next?" when a film ends); for The Inner Life of Data: learn.js (map and stops),
                                 labs.js and labs2.js (the eight labs), quiz.js (the scenarios), and their words in learn.en.js and learn.es.js
    sketch/                      A Sharper Sketch's stepper, labs and scenarios (sketch.js, sketch.css)
films/                           one folder per film: script or story, captions/, and source/ (the code that generates the film,
                                 and how to rebuild and publish it)
  inner-life-of-data/            The Inner Life of Data, plus breathing-cut.md (how its pauses work) and pacing-review.md (how they were tuned)
  a-sharper-sketch/              A Sharper Sketch, on data modelling
  from-words-to-data/            From words to data: proposal.md, for an advanced series on data modelling, from language to AI (not made yet)
  when-things-go-wrong/          the series When things go wrong: its README, the characters it shares, and one folder per film
    1-silent-change/             Silent change: treatment, story outline, captions and source
    2-too-good-to-be-true/       Too good to be true: treatment, script (with the rigour sheet), style frames, captions and source
  making-of/                     the two Making of films: 1-data-for-films and 2-the-process, each with treatment, script, captions and source
site-tools/                      build_pages.py turns the Markdown pages into site pages; check_site.py and smoke.py check the site
.github/workflows/pages.yml      publishes site/ on every push to main
.github/workflows/release.yml    renders the films (all, the changed ones, or a list) and publishes every video to a release, when you run it
.github/scripts/plan.py          chooses which films the release renders
PLAYBOOK.md                      what made the films work, and how to reuse it for the next film or course
LICENSE                          MIT licence for the code
LICENSE-CONTENT.md               CC BY 4.0 for the films, scripts and text, with exclusions
NOTICE.md                        credits and trademarks
```

Internal names never appear as text on the site. The numbers in the series' folder names only keep the folders in order; the release workflow and the site's links to GitHub use them, so don't rename them. The same goes for `assets/film3/`.

## How the site is organised

- **Header, the same on every page:** *Start here · Topics · Making of · GitHub · EN/ES*. On phones, Making of and GitHub move to the footer row, which every page has. The header never lists a film's own steps. The Topics link is marked as current on every topic's page.
- **Stepper, on a film's own pages:** the film's steps, such as *Watch · Take it apart · Make the call*, as an `ol.path` under the title. Only a film with labs or scenarios has one; Silent change has none yet, and Too good to be true has one.
- **Breadcrumbs:** every film, labs, scenarios and series page starts with one, such as *Topics › Data modelling*.
- **Guidance after a film:** a "Where next?" panel when the film ends (`next.js` shows the page's `<template id="next-panel">`), "Go deeper" on the home page and at the end of the scenarios of *The Inner Life of Data*, and "Go further" on each topic's page.
- **No film numbers.** Each film is shown by its topic, then its title. The order comes from the chapter of *The Inner Life of Data* that each topic builds on, never from when it was made.
- **English and Spanish:** English pages sit at the root and Spanish ones under `es/`, at the same paths. Every page has an EN/ES toggle to the same page in the other language; A Sharper Sketch's labs and scenarios, which are in English only, toggle to `es/sketch/`. A film that exists only in English gets a Spanish page around it, with Spanish chapter names and controls; links from there to English pages say "(en inglés)".

**Progress** stays in the visitor's browser (local storage), under one prefix per film:

| Prefix | Film | Keys |
|---|---|---|
| `ld:` | The Inner Life of Data | `watched`, `visited`, `stop`, `quiz`, and `think` (the "Pause and think" setting, shared by every film) |
| `ld3:` | A Sharper Sketch | `watched`, `visited`, `quiz`. A historical name: never rename it, or visitors lose their progress. |
| `ld-silent-change:` | Silent change | `watched` |
| `ld-too-good-to-be-true:` | Too good to be true | `watched`, `visited` (labs), `quiz` (scenarios) |

A film's page sets its prefix with `data-store` on `section#watch`, and `path.js` marks the film as watched once 85% of its length has actually played (seconds of playback, so a seek or one late chapter doesn't count). A page without `data-store` records nothing, so one film's page never marks another film as watched. Topic cards show each film's progress from `data-progress="<prefix>"`. The Sketch pages don't load `path.js`: `sketch.js` paints their stepper, records `ld3:watched` by the same rule, and fills the topic cards' progress there.

## Publishing

1. **Turn on GitHub Pages (once):** Settings → Pages → Build and deployment → Source: *GitHub Actions*. From then on, every push to `main` publishes `site/`. You can also run it by hand from the Actions tab (*Publish site* → *Run workflow*).
2. **Release the videos:** in the Actions tab, open *Render and release the films* → *Run workflow*, and give a tag such as `v2.0`, and which films to render: `changed` (the default: only the films whose source, or the shared code they draw with, changed since the latest release), `all`, or a list of keys such as `silent-change-en,too-good-to-be-true-en`. It renders them from the committed source at the same time, in about 30 to 45 minutes for all of them, and publishes `inner-life-of-data.mp4`, `inner-life-of-data.es.mp4`, `a-sharper-sketch.mp4`, `silent-change.mp4`, `too-good-to-be-true.mp4`, the Making of films `data-for-films.mp4` and `thats-not-quite-right.mp4`, and their `.srt` captions to a release with that tag. Before rendering, it checks that each film's player on the site is byte for byte the one its source builds. The videos it doesn't render are copied from the latest release, so every release carries every film, and the site's download buttons, which point to the latest release, work as soon as it's published. The run's summary lists which films changed, which were rendered and which were carried over, and warns about a film that changed but wasn't rendered. Tick *draft* to watch the videos before they go live. Keeping videos out of the repository keeps clones small. To render on your own computer instead, see each film's `source/README.md`, starting with [the build guide of *The Inner Life of Data*](films/inner-life-of-data/source/README.md).

## The labs and scenarios

*The Inner Life of Data* has three pages: *Watch* (the home page), *Take it apart* (`labs/`) and *Make the call* (`scenarios/`). *Take it apart* has eight stops, one per chapter of the film, each with a hands-on lab, and each stop has its own link, such as `labs/#refine`. Its "Watch this part" buttons play that chapter in a pop-up player. *Make the call* has twelve scenarios in four formats: choose, sort, order and spot the row, and each one links back to its lab. Both draw with the film's own components (vaults, data tiles, the sketch, paintings, Genie), which `assets/film/film.js` provides, and both take their words from `assets/learn/learn.en.js` and `learn.es.js`. To change a text, edit both language files and keep their keys the same. To add a scenario, add it to `quiz.qs` in both files; `vis` picks one of the small scenes in `quiz.js`.

*A Sharper Sketch* follows the same shape with six labs and twelve scenarios, all in `assets/sketch/sketch.js`; see [its README](films/a-sharper-sketch/README.md). *Too good to be true* has three labs and ten scenarios in `assets/too-good-to-be-true/learn.js`, with their words in `learn.en.js` and `learn.es.js`, so both languages share one engine; its Pause and think questions link to its own labs. Old links to the one-page version of the home page (`#explore`, `#practise`) redirect to the labs and scenarios pages.

## Making the next one

[PLAYBOOK.md](PLAYBOOK.md) collects what made the films work, from the two-audience promise to pacing, rigour and the labs, with checklists for the script, the render and the release.

## Writing pages

Write pages in Markdown and turn them into site pages with `python site-tools/build_pages.py` (it needs `pip install markdown`). It builds `site/journey/index.md` and `site/es/journey/index.md` with the templates `site-tools/page.html` and `page.es.html`, which hold the header, the hero and the footer: the first heading and the italic line under it become the hero, and every section (each `##` heading, and the films at the top of the Making of page) goes into "On this page": a sidebar beside the text on wide screens, and a bar under the header on phones that names the section being read and opens the list (`assets/doc-nav.js`). Never edit the generated `index.html` by hand. Keep each Spanish page at the same path under `site/es/`, so the language toggle finds it.

## Adding a topic

The site is plain HTML, published as it is. For a new film:

1. **Pages.** A folder `site/<topic>/` for the film, plus `labs/` and `scenarios/` if it has them, mirrored under `site/es/`. A film in a series goes under the series, as `site/when-things-go-wrong/<film>/`. Start from the closest existing page, such as Silent change's: header with Topics as current, breadcrumb, a meta row (length, labs, scenarios, language), a "Builds on" link to its chapter of *The Inner Life of Data*, and the footer row. Link the two languages with the EN/ES toggle and an `hreflang` pair. For a film in English only, the Spanish page sets the player's labels in `window.L10N` before the film's bundle and renames the chapters in `SCENES` after it (see `site/es/when-things-go-wrong/silent-change/`). Chapter links use the chapter's start rounded up (`#t=145` for a start at 144.7 s), or they land on the previous chapter.
2. **Assets.** The player and soundtrack in `site/assets/<film>/`, copied from the film's `source/dist/`, and a 1280×720 poster in `site/assets/<film>-poster.jpg`. Load one film bundle per page: two bundles declare the same names and the second fails. Add the film to `.github/workflows/release.yml`, so each release renders it and checks the site's copy.
3. **Progress.** A `data-store` prefix `ld-<film>`, such as `ld-silent-change`, on `section#watch`, and the same prefix in `data-progress` on its topic cards.
4. **Cards.** A topic card on the home page and at the end of the scenarios of *The Inner Life of Data* ("Go deeper"), on `topics/` under the chapter it builds on, and on its series page if it has one, in both languages. Spanish cards link to Spanish pages.
5. **Where next.** A `<template id="next-panel">` on its own page, and a link to it in the panel of the page it builds on.
6. **Check.** Run `python site-tools/check_site.py` and `python site-tools/smoke.py`, and fix what they find. `check_site.py` only reads the files, in a second: links, header, `hreflang`, breadcrumbs, film numbering and stated lengths. `smoke.py` opens every page in Chromium, in about five minutes: it serves `site/` on port 8110 with `npx http-server` and checks the players, chapter links, panels, keyboard focus, progress, phone and tablet layouts, heading levels and text contrast in both themes. It needs `pip install playwright` and Node. Both exit with an error when something fails. A new film page needs its chapter count in `FILMS` in `smoke.py`, and a new page under a topic needs its breadcrumb in `CRUMBS` in `check_site.py`.

## Licence

- **Code:** MIT, see [LICENSE](LICENSE).
- **Film, script, captions, images and text:** CC BY 4.0, see [LICENSE-CONTENT.md](LICENSE-CONTENT.md).
- **Not covered:** company logos and trademarks, including the Databricks and dbt logos, which belong to their owners. See [NOTICE.md](NOTICE.md).
