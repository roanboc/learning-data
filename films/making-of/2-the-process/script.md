# That's not quite right: script

*Script for the second of [two films on the Making of page](../README.md), draft 1, with the rigour sheet. The narration lives in [`source/src/narration.js`](source/src/narration.js), and the film re-times itself to the voice; this page copies it for reading.*

**Length:** about 4:27, 128 words a minute, with the voice speaking 72% of the time (`python tools/pace.py`).
**Voice:** the synthetic voice of every Learning Data film (Kokoro, `af_heart`).
**Sources:** [the making-of story](../../../site/journey/index.md) and this repository's history. Nothing in the film goes beyond them.

## Decisions taken for this draft

The treatment left these open; this draft picks one answer each, and each is easy to change:

1. **The title:** *That's not quite right*, the words the film ends on. It names the author's role (the pushback) rather than Claude's. Changing it means the title card, the end card, the site's heading and the release file name (`thats-not-quite-right.mp4`).
2. **The conversation on screen:** only words already published in the making-of story appear in quotation marks, as the author's: "There is no better light than other" and "That's not quite right". The first message is shown "in short", and Claude's messages are paraphrased; the page around the film says so.
3. **Which film it follows:** *The Inner Life of Data*, with one line on the three films that followed.
4. **The order on the page:** *Data for Films* first, then this one.

## What the picture does

| Chapter | Picture |
|---|---|
| 1. One message | The first message types itself out; a purpose, an audience and a standard light up; Claude's first reply. The title. |
| 2. Two sides | Two lanes, warm for the author and cool for Claude, fill with what each brought; messages travel between them. |
| 3. Options, not answers | Five analogy cards, the test (share it without copying it), five red crosses. Then the author's choice, drawn live by *The Inner Life of Data* itself. |
| 4. Facts | Sources checked; Delta Sharing becomes OpenSharing and dbt Cloud the dbt platform; the rigour sheet fills. |
| 5. That's not quite right | The real style boards, and the author's words. Tiles that sharpen, three paintings for three audiences, Claude's precision, a frame of the first cut. The words, alone. |
| 6. A note, not a restart | "Start at the system of record", the change to the scene's code, new frames of *The Tap*, and the chapters re-timing. Two of the real style frames, the sound sketch, four voice tests with one chosen; Claude looks, the author listens. |
| 7. What went wrong | Three of Claude's mistakes, in red, each turning green when fixed; the crow's foot moves to the right end. |
| 8. Publishing | The site with the film playing live, its three steps and Spanish; commit, render on a clean machine, release. The playbook, and the posters of the three films that followed. |
| 9. Who does what | The two lanes, full: the why, and the next version, cheap. The last words, and the end card. |

## Narration

### 1. One message

> Every film on this site started the same way: one person, and one message.

> Explain how a data platform works, so that anyone can understand it, even a teenager, without losing a data engineer's rigour.

> That message holds what only a person could bring: a purpose, an audience, and a standard to meet.

> Everything after it was one long conversation, between that person and Claude, an AI model.

### 2. Two sides

> On one side, the author. They brought what they knew about a real platform, their taste, and every decision.

> On the other side, Claude: options, fact checks, code, pictures, sound and pages.

> Between them, the conversation. Let's follow what travelled along it.

### 3. Options, not answers

> The first question was the analogy. Claude offered five: rivers, libraries, cyberpunk, pipes and the human body.

> And tested each one against the hardest idea in the film: sharing data without copying it.

> Water can't be in two places at once. Neither can a book. Every one of them broke.

> So the author chose none of them: a documentary flight through the real platform, with data travelling as light.

> Claude widened the choice. The person made it.

### 4. Facts

> Before any animation, Claude checked every product name against current sources.

> Several had changed that year. Delta Sharing was now OpenSharing, and dbt Cloud was the dbt platform.

> Checking is quick for Claude and tedious for people, so it happened every time.

> Each claim went into a rigour sheet: what the picture shows, and what an expert would add.

### 5. That's not quite right

> Then came four style boards, and the pushback that changed the film.

> The author wrote: there is no better light than other. Light can't show data getting better.

> Their idea was pictures that get sharper as they're refined, and paintings at the end, painted for whoever will use them.

> Claude's part was to make it precise: the style follows what the audience needs, not the channel it arrives by.

> Nearly every improvement began with the same words.

### 6. A note, not a restart

> Because the film is code, a note never means starting again.

> Start at the system of record, the author said. Claude changed the scene's code, and rendered new frames to check.

> Once the film had a voice, changing one line re-timed the whole film by itself.

> Big changes waited for small checkpoints: five style frames, a forty-second sound sketch, and four five-second voice tests.

> Claude looked at every frame. The author listened to every sound, because Claude can't hear.

### 7. What went wrong

> Claude made mistakes, some of them with confidence.

> It said a voice couldn't be made, until the author pushed back. It said voice clips were attached when they weren't. It drew a diagram's relationship marks backwards.

> Each one was caught because the person checked, and then fixed.

> Checking isn't a courtesy. It's part of the work.

### 8. Publishing

> Then the site: the film drawn live, labs to take it apart, scenarios to make the call, and all of it in Spanish too.

> A workflow renders the videos on a clean machine, so what you download is what the site plays.

> What worked was written down as a playbook, and three more films followed in the next two days.

### 9. Who does what

> So who does what?

> The person brings the why: the purpose, the audience, the knowledge, the taste, and the final say.

> Claude makes the next version cheap: options, facts, code, pictures, sound and checks.

> And because the next version is cheap, the person can say it again, and again.

> That's not quite right.

## Rigour sheet

| Claim | Source | Notes |
|---|---|---|
| The first message asked for a film "anyone can understand, even a teenager", without losing rigour | The making-of story, *The brief* | The film shows it "in short": a paraphrase of the brief's first message. |
| Five analogies tested against zero-copy sharing, and all broke; the author chose a documentary fly-through with data as light | *Finding the analogy* | — |
| Delta Sharing had been renamed OpenSharing; dbt Cloud had become the dbt platform; the rest of the rigour sheet | *Getting the facts right* | The rigour sheet on screen lists five of its real lines, shortened. |
| Four style boards; "there is no better light than other"; pictures that sharpen and paintings for audiences were the author's ideas; Claude tied style to the audience's need, not the channel | *From light to pictures* | The pictures on screen are the real style boards and a real frame of the first cut, from the story's images. |
| "Start at the system of record" | *The big review* | The code change on screen is simplified: it names what changed in the scene *The tap*, not its code. |
| Changing a line re-times the whole film | *The second cut*, and the playbook (*Media as code*) | This became true once the film was timed to its narration, in the second cut. |
| Five style frames, a 40-second sound sketch, four five-second voice tests; the American female voice was chosen | *Checkpoints before the rebuild* | The story names only the voice that was chosen, so the others are "voice A, B, C". Two of the five style frames are shown, the two the story publishes. |
| Claude can't hear the audio, so the author judged the balance | *Lessons learned*, 12 | — |
| Claude said it couldn't produce a voice; said voice clips were attached when they weren't; drew crow's-foot marks backwards | *What went wrong along the way* | "Then they were": the clips were sent afterwards. |
| The site draws the film live, with labs, scenarios and Spanish; a workflow renders the videos on a clean machine | *One film, two ways to play*, and `.github/workflows/release.yml` | — |
| Three more films in the next two days | This repository: *The Inner Life of Data* was made on 25 and 26 September 2026 (Australian time); *A Sharper Sketch*, *Silent change* and *Too good to be true* were started on 26 September (UTC) and published by 27 September | — |
| Claude is an AI model made by Anthropic | The making-of story, *The brief* | — |
