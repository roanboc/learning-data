# Page templates and navigation

Every page on the site follows one template for its type. Read this before you add or change a page, a section or a link. The HTML templates in [page-templates/](page-templates/) show each one beside a real example from *Data quality*: open them in a browser from your checkout, so their pictures load.

The templates are being applied one page type at a time. Until a type's pull request merges, its pages may still differ from its template: build to the template, not to the page.

| Page type | Template | Address |
|---|---|---|
| Topic | [topic.html](page-templates/topic.html) | `/topics/<topic>/` |
| Series | [series.html](page-templates/series.html) | `/<series>/` |
| Film | [film.html](page-templates/film.html) | `/<series>/<film>/` |
| Labs | [labs.html](page-templates/labs.html) | `/<series>/labs/` |
| Evaluation | [evaluation.html](page-templates/evaluation.html) | `/<series>/scenarios/` |
| Topics page (one view; the old Progress view, for reference) | [progress.html](page-templates/progress.html) | `/topics/` |

Every Spanish page under `/es/` follows the same template as its English twin, with the same sections in the same order.

## The levels

The site has four levels: **Topics › topic › series › film**. Labs and the evaluation belong to a series. Nothing sits outside this tree, except the home page, the Making of pages and the example project's page (`dbt-project/`).

- **Say "topic", never "module"** (the author, 20 November 2026), in every page, heading, breadcrumb and button. In Spanish it is *tema*. The folder `modules/` and the file `module.json` keep their names, so that links and progress keys stay stable.
- A topic page lives at `/topics/<topic>/`, not `/<topic>/`, because some topic ids are already series addresses (`data-governance`, `enterprise-architecture`).

## Rules every page follows

1. **Know where you are.** Every page below Topics opens with a breadcrumb from *Topics*: `Topics › topic › series`. A film page also says *Film 2 of 4*, with a bar of the series' films: watched, this one, still to watch.
2. **One line under every title.** The lead is one line: the film's or series' card text, not a paragraph. Page text limits still apply (kicker ≤ 32, title ≤ 75, lead ≤ 300 characters).
3. **One main button per page.** It says what to do next, such as *Continue: A hundred records*. Every other link is secondary.
4. **No dead ends.** Every page ends by leading on:
   - a film leads to the next film;
   - a series' last film leads to the next series, or to its topic when the topic ends;
   - a series leads to the next series;
   - a topic leads to the previous and next topic on the route;
   - a lab leads to the next lab, and the last lab leads to the evaluation;
   - the evaluation's result leads to the next series.
5. **Extras are folded.** The example project's files and *Go further* open on a tap, each under one heading. They are never shown open.
6. **The same headings everywhere,** in this order and with these words: *Try it*, *In the example project*, *Go further*, *Up next*. In Spanish they get one fixed translation each.
7. **Show a section only when it has something to show.** For example, *Coming next* and *Films to come* show only while series or films are being made. No empty headings.
8. **No recaps.** No story summary, no people cards and no film-by-film table: the films hold them (#504).
9. **Four icons for progress, on every page:** play for films watched, flask for labs, speech bubble for situations answered, check circle for right answers. A page shows the key once. Progress uses bars and rings, not long sentences.
10. **Mark watched.** Progress lives in each browser, so every film row on a series page and every film hero has a *Mark watched* toggle. It lets a film watched on another device be ticked by hand.

## Each page type

The numbers match the numbered blocks in each HTML template.

### Topic page

1. **Hero.** Breadcrumb (*Topics*), the topic's name, who it is for in one line, progress, and *Continue*.
2. **The series, each with its practice.** One card per series, in route order: poster, title and films watched. Beside the card, a short list of three thin bars (labs seen, answered, right), with no numbers. The whole card opens the series.
3. **In the example project,** folded. Only when the project covers this topic.
4. **Coming next.** Only while series are being made.
5. **Up next on the route.** The previous and next topic.

### Series page

1. **Hero.** Breadcrumb, the title, one line, progress, and *Continue* to the next film not yet watched.
2. **The films.** Numbered compact rows: tile, title, minutes, and *Mark watched*. The tile is a square close-up of the film's poster, on one thing the film is about, and no two tiles of a page look alike (`site-tools/tiles.py`).
3. **Practise.** The same strip as the topic page (labs seen, answered, right) with one button. Under it, links to all labs and to the evaluation.
4. **In the example project,** folded. Only when its films show project files.
5. **Films to come.** Only while the series is being made.
6. **Up next.** The next series, or the topic page at the topic's end.

### Film page

1. **Hero.** Breadcrumb, *Film 2 of 4* with the series bar, the title, one line, and *Mark watched*.
2. **Watch.** The player, its chapters, and small links (video, captions, script). When the film ends, the menu is always: *Try the first lab* · *Next film* (or *Next series*, or the topic) · *Watch again*.
3. **Try it.** The film's 2 to 4 labs as tiles, and its situations.
4. **In the example project,** folded: the files each chapter shows.
5. **Go further,** folded, always under this one heading.
6. **Previous and next.** Two cards. At the series' end: the next series, or the topic.

### Labs page

1. **Short hero.** Breadcrumb, *Labs*, one line, and the practice strip.
2. **Labs by film.** Numbered circles grouped by film, like the evaluation's dots. Each ring fills as experiments are done, with a tick when all are done. One line says where you are: *Lab 1 of 8 · 2 of 4 experiments done*. Labs are numbered 1 to N across the series, in film order.
3. **The playground first,** full width. The lab's name is its title. *Try these* goals sit right above the controls and are ticked as they happen. One line under the picture says what the last press changed.
4. **What this shows,** folded: the film's ideas and *Watch this chapter*.
5. **Next.** One button: the next lab, then the evaluation.

### Evaluation page

1. **Short hero.** Breadcrumb, *Evaluation*, one line, and the strip: answered, right, still to go.
2. **Question map.** Up to 12 dots grouped by film, coloured right, wrong or not yet.
3. **One situation.** The question and its options first, with the picture small beside it (above it on a phone).
4. **After you answer.** Right or not, why, and two buttons: *Next situation* and *Try the lab that covers it*.
5. **Your result.** Once all questions are answered: the score by film, *Retry the ones you missed*, and *Next series*.

### Topics page

The Topics page is one view (the author, 21 November 2026): the list of topics, the learning route's paths and progress in one place, with no view switch. Old links to `#list`, `#route` and `#progress` land on it.

- **Progress first.** The hero holds *Your progress*: one line of four icons (films watched, labs seen, situations answered, right answers), never bars, and *Continue* to the next film not watched. A chosen goal narrows it to that goal's films.
- **The railway map, from 880 px.** The route as a line map, starting at the start's station (*Data platforms*) on the line, with no separate introduction card. A station's ring fills as films are watched; the next stop is circled; hovering or focusing names it. Selecting a station opens its topic's row below and scrolls to it; a topic's own page opens from *Open the topic* in its row. On a phone the list itself is the rail.
- **One bar of tools.** Search, *I want to…* as a drop-down of the goals (each with its one line, and *see all topics*), and *Show*: all, in progress, not started, done. The goal is kept in the visitor's browser and shared with the map. A goal numbers its films and series (*Step 2 of 5*), opens its topics, and dims the rest, here and on the map.
- **Rows and tiles.** Each topic is a row in the route's groups, with its ring, counts and line of icons; it opens on its films and series as big tiles, as the list always had, each with its own line of icons and *Start*, *Continue* or *Watched · review*.

Progress shows:

1. the hero and the view switch;
2. **your route**: the chosen route, a switch to change it, and the link to Learning route;
3. **progress on this route** in two lines (films watched and labs seen; then answered and right), counting only the route's films, labs and situations, with *Continue* to its next stop;
4. one tile per topic on the route, grouped by route stage. Each tile names the series the route uses there and has a ring and the same two lines of bars ("Not started" before you start);
5. the route's next stop, marked.

## The header

The header is one row, made only by `header()` and `external_nav()` in `site-tools/build_series.py`:

- **Start here** and **Topics**, then the example project's box icon, which goes to `dbt-project/`;
- **More options** (⋯), which holds Making of, learn-all.org and LinkedIn;
- EN/ES, the guided tour (?) and the theme switch, all inside the More menu on a phone.

No page adds its own links to the header.

## Changing a page

- Pages are generated by `site-tools/build_series.py`. Change the template there, never in a generated page, and then run it again.
- A new kind of section needs a place in one template here, with its number, and an update to this file and to the HTML template, in the same pull request.
- A new control also gets a step in the guided tour (`site/assets/learn/tour.en.js` and `tour.es.js`).
- `site-tools/check_site.py` (*Page templates*) holds every film, series and topic page to its sections: in the template's order, under the fixed headings, *In the example project* and *Go further* folded, the hero's Continue (or the series bar and *Mark watched* on a film), and a last section that leads on. A new section gets its heading id there too.
- Check on a phone (390 px), at 1024 px and in dark mode.

## Decisions

| Date | Decision |
|---|---|
| 19 November 2026 | One template for each page type: topic, series, film, labs and evaluation (the author). It follows an audit of main at 29540656, which found 10 film layouts, 5 series layouts, 11 end-of-film menus, project files shown in 4 ways, 10 series whose last film led nowhere, and *Go further* under 7 headings. |
| 20 November 2026 | Pages are lighter: one line under each title, one main button, extras folded. A film shows its place in the series in its hero (the author). |
| 20 November 2026 | Topics get their own page. Series cards there carry their practice as three thin bars, with no numbers. Every film can be marked watched by hand (the author). |
| 20 November 2026 | Labs are circles grouped by film that fill as experiments are done. The playground comes first. The evaluation puts the question first (the author). |
| 20 November 2026 | The four progress icons are used on every page. Progress is the Topics page's third view. The Learning route and Topics list stay as they are (the author). |
| 20 November 2026 | "Topic", never "module", on the site (the author). |
| 20 November 2026 | Topics views in this order: Topics list, Learning route, Progress. A chosen route filters Progress to its own results, is the same on both views, and can hide the topics not on it on Learning route; the two views link to each other (the author). |
