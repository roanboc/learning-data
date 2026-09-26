# learning-data

Learning artifacts for data: short, visual explanations of how modern data platforms work, from capture to decision.

**Site:** [https://roanboc.github.io/learning-data/](https://roanboc.github.io/learning-data/)

## What's here

```
site/                          the website, published to GitHub Pages as it is
  index.html                   one page: Watch (the film), Take it apart (eight labs) and Make the call (twelve scenarios)
  assets/                      styles, icon and poster images (English and Spanish)
    film/                      the film's player code and soundtrack, per language (built in films/inner-life-of-data/source/)
    learn/                     the labs and scenarios: learn.js (map and stops), labs.js and labs2.js (the eight labs),
                               quiz.js (the scenarios), and their words in learn.en.js and learn.es.js
  films/inner-life-of-data/    redirects the old player address to the home page
  journey/                     the making-of story: index.md (source) and index.html (generated)
  es/                          the Spanish site, with the same layout as the English above
films/inner-life-of-data/      the first film: everything used to make it
  script.md                    narration, pictures, rigour notes and sources
  captions/                    captions for video platforms: en.srt, en.vtt, es.srt, es.vtt
  source/                      the code that generates the film in each language, and how to rebuild it
site-tools/                    turns the Markdown pages in site/ into site pages
.github/workflows/pages.yml    publishes site/ on every push to main
LICENSE                        MIT licence for the code
LICENSE-CONTENT.md             CC BY 4.0 for the film, script and text, with exclusions
NOTICE.md                      credits and trademarks
```

The site's English pages sit at its root and the Spanish ones under `es/`, at the same paths. Every page has an EN/ES toggle that links to the same page in the other language.

## Publishing

1. **Turn on GitHub Pages (once):** Settings → Pages → Build and deployment → Source: *GitHub Actions*. From then on, every push to `main` publishes `site/`. You can also run it by hand from the Actions tab (*Publish site* → *Run workflow*).
2. **Attach the videos to a release:** create a release (for example `v1.0`) and upload the MP4s as `inner-life-of-data.mp4` and `inner-life-of-data.es.mp4`. The site's download buttons point to the latest release, so they work as soon as the release exists. Keeping videos out of the repository keeps clones small. To render them, see [the film's build guide](films/inner-life-of-data/source/README.md).

## The labs and scenarios

*Take it apart* has eight stops, one per part of the film, each with a hands-on lab. *Make the call* has twelve scenarios in four formats: choose, sort, order and spot the row. Both draw with the film's own components (vaults, data tiles, the sketch, paintings, Genie), which `assets/film/film.js` provides, and both take their words from `assets/learn/learn.en.js` and `learn.es.js`. To change a text, edit both language files and keep their keys the same. To add a scenario, add it to `quiz.qs` in both files; `vis` picks one of the small scenes in `quiz.js`.

The labs remember the last stop and the scenario answers in the browser only (local storage), so each visitor keeps their own progress.

## Writing pages

Write pages in Markdown and turn them into site pages with `python site-tools/build_pages.py` (it needs `pip install markdown`). It builds every `index.md` under `site/journey/` and `site/paths/`, and the Spanish pages under `site/es/journey/` and `site/es/paths/`. Keep each Spanish page at the same path under `site/es/`, so the language toggle finds it.

## Adding learning paths

Add Markdown pages under `site/paths/` (and their Spanish versions under `site/es/paths/`), build them, and link them from the "Coming next" section of `site/index.html` and `site/es/index.html`. The site is plain HTML, published as it is.

## Licence

- **Code:** MIT, see [LICENSE](LICENSE).
- **Film, script, captions, images and text:** CC BY 4.0, see [LICENSE-CONTENT.md](LICENSE-CONTENT.md).
- **Not covered:** company logos and trademarks, including the Databricks and dbt logos, which belong to their owners. See [NOTICE.md](NOTICE.md).
