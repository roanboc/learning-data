# The Inner Life of Data

A 7-minute film that follows one enrolment at a fictional university, from a tap on a phone to a decision. It shows how data is captured, refined through bronze, silver and gold with dbt on Databricks, given meaning through a shared conceptual model, and shared without copies. It is written for anyone aged 14 and up, with nothing a data engineer would need to correct.

- **Watch, with chapters:** [https://roanboc.github.io/learning-data/#watch](https://roanboc.github.io/learning-data/#watch). Turn on *Pause and think* to stop after most chapters for one question. Then try the [hands-on labs](https://roanboc.github.io/learning-data/labs/) and the [scenarios](https://roanboc.github.io/learning-data/scenarios/).
- **Download the video (MP4, 1080p):** [https://github.com/roanboc/learning-data/releases/latest/download/inner-life-of-data.mp4](https://github.com/roanboc/learning-data/releases/latest/download/inner-life-of-data.mp4)
- **Script, with rigour notes and sources:** [script.md](script.md)
- **Captions:** [en.vtt](captions/en.vtt), [en.srt](captions/en.srt)
- **En español (Latin American Spanish, 8:24):** [watch](https://roanboc.github.io/learning-data/es/#watch), [download](https://github.com/roanboc/learning-data/releases/latest/download/inner-life-of-data.es.mp4), captions [es.vtt](captions/es.vtt) and [es.srt](captions/es.srt)

## Chapters

| Time | Chapter |
|---|---|
| 0:00 | [The tap](https://roanboc.github.io/learning-data/#t=0) |
| 0:25 | [Into the platform](https://roanboc.github.io/learning-data/#t=26) |
| 1:11 | [The sketch](https://roanboc.github.io/learning-data/#t=72) |
| 1:45 | [Refining with dbt](https://roanboc.github.io/learning-data/#t=106) |
| 2:42 | [Gold](https://roanboc.github.io/learning-data/#t=163) |
| 3:29 | [The layers together](https://roanboc.github.io/learning-data/#t=210) |
| 4:00 | [Meaning](https://roanboc.github.io/learning-data/#t=241) |
| 4:53 | [Two speeds](https://roanboc.github.io/learning-data/#t=294) |
| 5:20 | [Ways out](https://roanboc.github.io/learning-data/#t=321) |
| 6:17 | [Apps and Genie](https://roanboc.github.io/learning-data/#t=378) |
| 6:53 | [Pull back](https://roanboc.github.io/learning-data/#t=414) |

## How it was made

The film is generated entirely from code; the source and a step-by-step rebuild guide are in [source/](source/). This is the fourth cut. It brings the lessons of the later films back to this one: its text reads on a phone (at least 28 px in the frame, checked with `source/tools/legible.py`), its sounds are soft and low with a pulse that marks the moments of error or rush, and it flows like them, with a beat after every sentence and wordless endings only in the sketch, the people and the end. The earlier pauses, and how they were tuned, are described in [breathing-cut.md](breathing-cut.md) and [pacing-review.md](pacing-review.md); what to reuse for future films is in the [playbook](../../PLAYBOOK.md). The story of how it was made, with the analogies explored, the pushback and the lessons learned, is in [the making-of journey](../../site/journey/index.md).
