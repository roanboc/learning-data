# Finding your way around the site

How the Topics page and the home page show the topics, and where to change it.

## Decisions, 11 and 12 November 2026

| Date | Decision |
|---|---|
| 11 November 2026 | The Topics page has two views of the same topics: the **learning route**, a line map, and the **list**. A first visit gets the route; the choice is kept in the visitor's browser. Without scripts the page is the list. |
| 11 November 2026 | The route starts with the introduction, *The Inner Life of Data*, then the foundations (*Enterprise architecture*, then *Data governance*), then *Build and monitor* (*Data modelling*, *Modern data basics*, *Analytics engineering*, *Data quality*), and ends on *Lead* (*Data management*, then *Leading data people*, the last stop). Two loops leave after the foundations and join again before *Lead*: *Share and protect* (*Master and reference data*, *Data protection and privacy*) and *Agents* (*AI agents in data work*). |
| 11 November 2026 | The route is a suggestion: nothing is locked, and every topic opens at any time. |
| 11 November 2026 | Five goals light up a short route on the same map, which never changes shape: *start with data*, *build a report people trust*, *make governance work*, *work beside AI agents* and *lead a data team*. A goal's stops are films and series, not whole topics. |
| 12 November 2026 | The home page stays a first view: the film, then a short text that there is more to data than moving it, and two buttons, to the learning route and to how the films were made. It draws no route and lists no topics: a first cut drew the route and a second listed every topic, and both were too much for a first page, which will also hold another film. The box *How to read the film* is gone too. The intro's scenarios pages keep their tiles. |
| 12 November 2026 | The home page says the film's two other steps twice, because the bar above the film is easy to miss: a section right after the film offers *Take it apart* (labs to interact with) and *Make the call* (a check of what you know), in words only, and the panel that shows when the film ends offers them first, then the topics. |
| 12 November 2026 | *More than a platform*, the film that follows the introduction, has a page of its own, to see whether that works better than a second player on the home page (the author). The home page shows it as one card, above the two buttons; the Topics page shows it under *Data platforms*, and the goal *start with data* stops at it. It is the only film that stands alone: it has no series page (`single` in `site-tools/build_series.py`). |
| 11 November 2026 | A series in the works can be named on its topic, as *Coming soon*, until one of its films is on the site (`upcoming` in `modules/route.json`). The four new architecture series were the reason; their films reached the site on 12 November, so the list is empty again. |
| 11 November 2026 | The list searches what the films say, from their captions, so a word finds the film and the line that says it. If no film says a word, it is shortened until one does (*agentic* finds *agent*), and the page says so. |
| 11 November 2026 | Both views follow the visitor's theme, and are checked in dark mode first: many visitors prefer it. |

## Where it lives

- **`modules/route.json`** holds the route: its groups in order, each with its topics in order; the goals and their stops; and the series in the works (`upcoming`). The first group is the start. A group on the `main` line is a stretch of the suggested route; the other two lines are the loops.
- **`site-tools/build_series.py`** reads it and makes `site/assets/learn/route.en.js` and `route.es.js` (the route's data, one value a line), the Topics page, and the card and the two buttons on the home pages. It stops if a topic isn't in one group, or a goal's stop isn't a film or series on the site.
- **`site/assets/learn/route.js`** draws the route in any `[data-route]` box: a map from 880 px, and below that a list with a rail, with no sideways panning. **`topics.js`** switches the Topics page's views, fills each row's ring and runs the search. **`route.css`** styles both; only these pages load it.
- **Progress** comes from the keys the films already write (`<prefix>:watched`), in the visitor's browser only.

## Changing it

- **A new topic:** add its module as before, then add its id to one group in `modules/route.json`.
- **A new series or film:** nothing to do. The route, the list and the search pick it up.
- **A series in the works:** add it to `upcoming` under its topic, with its name in English and Spanish and its count of films. Once one of its films is on the site it drops out by itself; remove the entry then.
- **A goal:** edit its `stops`, two to six films or series, in the order to watch them. Write its name so it reads after *I want to* and *Quiero*.
- Then run `python site-tools/build_series.py` and the checks.

## The search's words

`site/assets/learn/search.en.json` and `search.es.json` hold every film's title, series, topic, intro and captions, each line with its second. They change with every film, so they aren't committed: the site's publish writes them (`build_series.py --publish`), the browser checks write them when they serve the site, and `python site-tools/build_series.py --search` writes them for a local look. The page fetches them the first time someone types in the search box, not before.
