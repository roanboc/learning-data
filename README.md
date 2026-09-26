# learning-data

Learning artifacts for data: short, visual explanations of how modern data platforms work, from capture to decision.

**Site:** [https://roanboc.github.io/learning-data/](https://roanboc.github.io/learning-data/)

## What's here

```
index.html                     landing page (GitHub Pages)
assets/                        site styles, icon and poster image
films/inner-life-of-data/      the first film: interactive player, script, captions
  index.html                   the player (chapters, captions, embedded soundtrack)
  script.md                    narration, pictures, rigour notes and sources
  captions.en.vtt / .srt       captions for video platforms
  source/                      the code that generates the film, and how to rebuild it
NOTICE.md                      credits and trademarks
```

## Publishing

1. **Turn on GitHub Pages:** Settings → Pages → Build and deployment → Source: *Deploy from a branch* → Branch: `main`, folder `/ (root)`.
2. **Attach the video to a release:** create a release (for example `v1.0`) and upload the MP4 as `inner-life-of-data.mp4`. The site's download link points to the latest release, so it works as soon as the release exists. Keeping the video out of the repository itself keeps clones small.

## Adding learning paths

Add pages under `paths/` and link them from the "Coming next" section of `index.html`. The site is plain HTML (the `.nojekyll` file turns off Jekyll processing). To write pages in Markdown instead, delete `.nojekyll` and GitHub Pages will render Markdown with Jekyll.
