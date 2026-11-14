# Films' questions and assumptions

Films made while the author was away were built on stated assumptions instead of waiting for answers. Each film's questions, and the assumption taken for each, are here, so the author can watch the film and confirm or correct them.

## How it is laid out

One file per film, in the films' natural order: a folder per module (numbered in the site's order), a folder per series (numbered in the module's order), and a file per film (numbered as its film folder is). A module's or series' own questions sit beside its films, in `0-module.md` or `0-series.md`. A film that stands alone in its module, as *The Inner Life of Data* does, has its file in the module's folder, numbered in the module's order. Each film's file starts with its pull request and a link to watch it on the site.

To read everything as one file:

```
python site-tools/assumptions.py --out all-assumptions.md
```

## Adding or changing a film's assumptions

A film's thread writes its questions and assumptions to that film's own file, in the film's own pull request: `docs/assumptions/<NN-module>/<n-series>/<film folder>.md`, named exactly as the film folder is (for example `04-data-quality/2-fit-for-use/1-good-enough-for-what.md`). One file per film keeps parallel film pull requests from editing the same lines. Keep the first lines as the other files have them: the title, then the module, series, film number, pull request and site link. This index lists modules, series and the films that stand alone, so a new film of a series doesn't change it.

## Modules and series

- [Data platforms](00-data-platforms/)
  - [The Inner Life of Data](00-data-platforms/1-inner-life-of-data.md)
  - [More than a platform](00-data-platforms/1-more-than-a-platform/)
- [Data modelling](01-data-modelling/)
  - [A Sharper Sketch](01-data-modelling/1-a-sharper-sketch.md)
  - [From words to data](01-data-modelling/2-from-words-to-data/)
- [Modern data basics](02-modern-data-basics/)
  - [Data that moves](02-modern-data-basics/1-data-that-moves/)
  - [Data as software](02-modern-data-basics/2-data-as-software/)
  - [From tables to decisions](02-modern-data-basics/3-from-tables-to-decisions/)
  - [Documents and closing remarks](02-modern-data-basics/4-documents-as-data/)
- [Analytics engineering](03-analytics-engineering/)
  - [In the weeds of data crafting](03-analytics-engineering/1-analytics-engineering/)
- [Data quality](04-data-quality/)
  - [When things go wrong](04-data-quality/1-when-things-go-wrong/)
  - [Fit for use](04-data-quality/2-fit-for-use/)
  - [Quality as a habit](04-data-quality/3-quality-as-a-habit/)
- [Enterprise architecture](05-enterprise-architecture/)
  - [The map before the data](05-enterprise-architecture/1-enterprise-architecture/)
  - [Business architecture for data](05-enterprise-architecture/2-business-architecture-for-data/)
  - [Data architecture](05-enterprise-architecture/3-data-architecture/)
  - [Platform and solution architecture](05-enterprise-architecture/4-platform-and-solution-architecture/)
  - [AI and continuous architecture](05-enterprise-architecture/5-ai-and-continuous-architecture/)
- [Data governance](07-data-governance/)
  - [Governance principles](07-data-governance/1-data-governance/)
  - [Governance you can use](07-data-governance/3-governance-in-practice/)
- [Data protection and privacy](08-data-protection/)
  - [Locks before the data](08-data-protection/1-locks-before-the-data/)
  - [Only what you may see](08-data-protection/2-only-what-you-may-see/)
  - [Kept for a reason](08-data-protection/3-kept-for-a-reason/)
- [AI agents in data work](09-ai-agents/)
  - [What an agent is](09-ai-agents/1-what-an-agent-is/)
  - [Agents at work on data](09-ai-agents/2-agents-at-work-on-data/)
  - [From helper to colleague](09-ai-agents/3-from-helper-to-colleague/)
- [Leading data people](10-leading-data-people/)
  - [People first](10-leading-data-people/1-people-first/)
  - [The new skills](10-leading-data-people/2-the-new-skills/)
  - [Working with people](10-leading-data-people/3-working-with-people/)
  - [Leading a data team](10-leading-data-people/4-leading-a-data-team/)
  - [Ownership and performance](10-leading-data-people/5-ownership-and-performance/)
- [Data management](11-data-management/)
  - [A plan in ninety days](11-data-management/1-a-plan-in-ninety-days/)
  - [Making the case](11-data-management/2-making-the-case/)
  - [Architecture that keeps up](11-data-management/3-architecture-that-keeps-up/)
  - [Small steps, measured](11-data-management/4-small-steps-measured/)
- [Making of](12-making-of/)
