# learning-data

Learning artifacts for data: short, visual explanations of how modern data platforms work, from capture to decision.

**Site:** [https://roanboc.github.io/learning-data/](https://roanboc.github.io/learning-data/)

## What's here

```
index.html                     landing page (GitHub Pages)
journey/                       the making-of story: index.md (source) and index.html (generated)
site-tools/                    turns Markdown pages into site pages
assets/                        site styles, icon and poster image
films/inner-life-of-data/      the first film: interactive player, script, captions
  index.html                   the player (chapters, captions, embedded soundtrack)
  script.md                    narration, pictures, rigour notes and sources
  captions.en.vtt / .srt       captions for video platforms
  source/                      the code that generates the film, and how to rebuild it
LICENSE                        MIT licence for the code
LICENSE-CONTENT.md             CC BY 4.0 for the film, script and text, with exclusions
NOTICE.md                      credits and trademarks
```

## Publishing

1. **Turn on GitHub Pages:** Settings → Pages → Build and deployment → Source: *Deploy from a branch* → Branch: `main`, folder `/ (root)`.
2. **Attach the video to a release:** create a release (for example `v1.0`) and upload the MP4 as `inner-life-of-data.mp4`. The site's download link points to the latest release, so it works as soon as the release exists. Keeping the video out of the repository itself keeps clones small.

## Writing pages

Write pages in Markdown and turn them into site pages with `python site-tools/build_pages.py` (it needs `pip install markdown`). It builds every `index.md` under `journey/` and `paths/`.

## Adding learning paths

Add Markdown pages under `paths/`, build them, and link them from the "Coming next" section of `index.html`. The site is plain HTML (the `.nojekyll` file turns off Jekyll processing). To write pages in Markdown instead, delete `.nojekyll` and GitHub Pages will render Markdown with Jekyll.

## Licence

- **Code:** MIT, see [LICENSE](LICENSE).
- **Film, script, captions, images and text:** CC BY 4.0, see [LICENSE-CONTENT.md](LICENSE-CONTENT.md).
- **Not covered:** company logos and trademarks, including the Databricks and dbt logos, which belong to their owners. See [NOTICE.md](NOTICE.md).
