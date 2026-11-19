# The map behind the sketch: questions and assumptions

*Data modelling* · *Model the business*, film 1

[Watch it on the site](https://data.learn-all.org/model-the-business/the-map-behind-the-sketch/)

> Kept by the film's thread, 19 November 2026.

Made while Rodrigo was away, on stated assumptions. The series' own questions are in [0-series.md](0-series.md); this file holds the film's. One line each: the question, the assumption made instead, where it shows, and what changes if it's wrong. The same choices are in the film's *Decided* rows (`films/model-the-business/1-the-map-behind-the-sketch/decided.md`).

| # | Question | Assumption made | Where it shows | If it's wrong |
|---|---|---|---|---|
| 1 | Is the Ming's two registers the right opening, and are its facts right? | Yes, from the Ming History (*Mingshi*, juan 77) and what Wikipedia's *Yellow Registers* and *Fish-Scale Registers* cite: households in the Yellow Registers from 1381, in village units of 110 led by ten of them in turn; land in the fish-scale registers from 1387, measured by students of the Imperial Academy; Zhejiang's landowners writing fields under other households' names; the History calling the two the warp and the weft. | Chapters *Lost registers*, *Two registers*, *Warp and weft*, and the close | A line or two of narration |
| 2 | How does the voice say the count of 1393? | "Ten and a half million households", for the History's 10,652,870. | *Two registers* | One line |
| 3 | Is it fair to say a sold field's tax "went with it"? | Yes: the fish-scale registers tied the tax to the plot, so a sale moved it to the buyer. Said once, as the benefit. | *Two registers* | One line |
| 4 | How does the voice say Nanjing and Zhejiang? | As written, with no respelling: the voice says them close to their pinyin. | *Lost registers* | A respelling in `film.json`, voiced again |
| 5 | Which of the university's capabilities, domains, systems and words does the film show? | The example project's map, as it is: eight level-1 capabilities named after HERM's; nine data domains with their owners; the student system, HR's and Finance's as systems of record, and the data platform's copies; the glossary's *unit offering* and *teaching period*, the registrar's words for *class* and *term*. | *What it does* to *What the words mean* | The map's names in `source/src/map.js` |
| 6 | Which two boxes find no place? | The class, whose word isn't the university's (*unit offering*), and the term, whose census date two areas share (the registrar's office keeps the periods, Planning counts by their census date). The film leaves both open, for *A Sharper Sketch*. | *Warp and weft* | Two lines, and the crossing |
| 7 | Where does the work start when a new question comes? | As the site does it (the author, 16 November 2026): a ticket names the question, the map finds its things, owners and records, the glossary gives the words, a contract fixes the shape, and only then is the model built, from what already exists. | *Where the work starts* | Three lines |
| 8 | Which instruments? | A harpsichord for the weft and a bass clarinet for the warp: a pair no film has, and neither plays in the topic Data modelling. Nothing borrowed from Chinese music; F major and its neighbours. | The score | `source/tools/score.py`, mixed again |
| 9 | What does the poster show? | The two maps crossed, with the two open questions in amber. | The film's card and page | `film.json`'s `poster` |
| 10 | Which Spanish words? | The site's: *boceto*, *inscripción*, *periodo*, *carrera* and *clase*; *capacidad*, *dominio de datos*, *dueño*, *responsable de datos*, *sistema de registro* and *glosario de negocio*; *fecha de corte*, *oficina de registro*, *periodo lectivo* and *oferta de unidad*; *la urdimbre y la trama*. | The Spanish captions and pages | `source/src/i18n/es/captions.js` |
| 11 | Where does the intro lead? | Its question after the sketch chapter now offers this film to go deeper (it offered *A Sharper Sketch*), since this film opens on the intro's last promise: *what it means, and who decides, is the rest of the story*. | The intro's Pause and think | One link in `site/assets/learn/learn.en.js` and `learn.es.js` |
| 12 | A review page before merging? | No render or review page in the thread: the author reviews the film on the site, with its Draft label, as he asked for every thread. | The pull request | Make one from the merged film |
