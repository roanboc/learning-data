# What an agent is

*Proposal for the first series of the module AI agents in data work (agentic data engineering): nine films that define agents and reflect on them, with no product. Planned on 3 November 2026 from version 4 of the module's plan, which the author settled that day, and made from it without a script review, as he asked. Status: the shared look and tools are in [`shared/`](shared/); the films are being made, one thread each, and merge one at a time, in order.*

## Decided

<!-- decided: made by site-tools/build_series.py from decided.md, the series' and each film's -->
| Date | Decision |
|---|---|
| 3 November 2026 | A module on agentic data engineering: the basic ideas first, then the journey from people using agents on their behalf to autonomous contributors with their own identity, permissions and human owner, designed and managed as the enterprise architecture, governance and security series describe. Each series starts with films that name no product, then shows how each idea is built. |
| 3 November 2026 | Series 1, *What an agent is* (*Qué es un agente*), is the definition and the reflection, with no product: how AI reached today's models, what an agent is (a model with reasoning, hands and a loop), what agents are like to work with, why that means governing them, and what they tell us about ourselves. Nine films, in `films/what-an-agent-is/`, at `what-an-agent-is/` on the site with its page once its opening film is out; its cards say "Film N of 9". Series 2, *Agents at work on data*, follows. |
| 3 November 2026 | A series of films reflects on the nature of agents (the feeling of understanding, more than a junior, minds that change, ethics and accountability) before saying why they must be governed. It ends with two open films: one agent and one mind (1.8), then many agents and what emerges (1.9), so people wonder about themselves. |
| 3 November 2026 | The module's rules, which no film may contradict: agents are never approvers, and their review is only for reference; nothing reaches production without a person, and a change to production needs a second person's approval, for agents as for people; in test, an agent may do agreed tasks alone and report; tool servers get the fewest rights (read-only when reading is enough, writes only as drafts in sandboxes, no sensitive data); automate deterministically first, and use an agent only where the work isn't deterministic; memory is shared by the team, outside a single chat; an agent in the wrong hands is more dangerous. |
| 3 November 2026 | The look is the white lab made Nordic, version 3 of the style prototype (style X): a pale grey marble wall with soft veins over a pale oak floor, daylight from the right, matte off-white cards, the agent a matte ceramic sphere with a violet band of light, the loop a bent oak ring, the hands pale robot arms with oak joints. Blue is tools and structure, violet the model thinking, orange data coming back, green a check that passes, amber a check that fails or a loop. About as light as the governance films, with no film grain. |
| 3 November 2026 | People have an adult's proportions, as the author asked ("Keep the bodies with good proportions as the example shows weird dimensions"): a full-size head with the eyes halfway down, the face in thirds, short hair that follows the skull, a neck about half as wide as the head is tall, shoulders a third of a head below the chin, arms that hang from the shoulders. The data team is the governance films' cast at the same university: Jun Park, Yusuf Demir, Mei Tanaka, Noor Rahman, Sam Okafor, Anil Kurian, Clara and Prof. David Mensah. |
| 3 November 2026 | The nine films are made without a script review, as the author asked ("I don't need to check the scripts as I already provided all my insights and the plan is right, so just ask me any question you might have for each video if needed"), one thread per film, each at the highest effort, asking him only real questions. Each film is rendered and shared on a review page with its pull request (AGENTS.md, step 4.3), and the films merge one at a time, in order. |
| 3 November 2026 | The series' shared code, in `shared/`, ported from style X: the lab by day and by night, the floor lamp, a desk, a screen and a framed picture on the wall (`room.js`); the cast of eight, with poses and a desk to sit behind (`people.js`); the model, the ring, the steps of the loop, the hands, tools, data and verdicts (`agent.js`); cards, pills, icons, the kicker, the mark and the title and end cards (`cards.js`); and the tools that build and check a film. The module's later series bundle it as it is. A film keeps its own pictures in its own source, and asks the series thread for anything shared. |
| 3 November 2026 | The module's sound: music under the opening story, then only at a chapter's turn, a moment on screen or a pause without words, never a constant bed, and nothing that beats or pulses, except an urgent pulse where a film's story turns to an error or a rush, in the chapters its `film.json` lists in `urgent`. `shared/tools/quiet.py` checks it. Each film has a palette of its own, and the voice says Jun as "Joon" and AI as one word. |
| 3 November 2026 | The module is *AI agents in data work* (*Agentes de IA en el trabajo con datos*), the author's choice of the names proposed for it: a topic of its own on the site, which shows once its opening film is out. Its line on the site says "agentic data engineering", for people who search for it. |
| 3 November 2026 | The film opens on Eastgate, Harare, Zimbabwe (commissioned 1992, opened 1996): asked for offices and shops that would cool themselves, the architect Mick Pearce built them to breathe the way termite mounds were then thought to, with many simple parts instead of one big machine; it cost about a tenth less to build, used far less energy, and was let before it was finished. The film comes back to it with the 2015 and 2017 mound research (the air moves more like a lung than a chimney) and a scientist's line that Eastgate was built on the wrong idea and still works, because people kept measuring and tuning it. The client is unnamed ("a property company"). Chosen by the film's thread; no other film of the series opens in Africa or on a building. |
| 3 November 2026 | The film's story at the university: after census day, the council asks why each faculty's count changed; the counts come from the platform, and helper agents, one per faculty, read-only in a sandbox, pin the reasons from the notes and emails, with their sources, to one shared board; a checking agent flags, and Clara, in Planning, decides. Two things emerge that no one asked for: the same 31 students behind small drops in three faculties (a new joint degree with no faculty, fixed with a plain test) and a wrong word, "dropouts", copied into every draft. The numbers agree with films 1.2 and 1.3: 18,412 students on census day, Arts and Education 4,236, Business 6,018, Engineering and IT 5,247, Health 2,880, and 31 in no faculty. |
| 3 November 2026 | No number for Eastgate's energy (the sources give 5%, 10% and a garbled 35%): "about a tenth less to build" and "far less energy". No real person's face: Pearce is his hands and a name card, Maturana and Varela their names, Grey Walter his tortoise. |
| 3 November 2026 | Sound: many small pure voices that fall into step as one chord (the film's mark for emergence) and a bass clarinet; E flat major with the Lydian A natural; an urgent pulse only under the 2010 crash. The film runs about eight minutes, the series' longest, as the briefs allow for its last two films. |
| 3 November 2026 | Made without a render or a review page, as the author asked that day ("Don't render the videos, just create and merge the PRs as the work finishes, I will check the new videos in the portal directly"): the films of *What an agent is* merge once their checks pass, one at a time, in order, so this one after films 1.1 to 1.8, and the release renders its video. It runs 7:25, at 133 words a minute. After the full-size stills, two shots were reframed: the drawing board, so its title block, the bills and the shops sit above the captions, and the trading room, so the seller's card keeps a margin from the frame. |
<!-- /decided -->

## The brief

The module, in the author's words of 3 November 2026: the basic ideas first, then the journey from people using agents on their behalf to autonomous contributors, with their own identity, permissions and human owner, designed and managed as the enterprise architecture, governance and security series describe. Four series, about 31 films: *What an agent is* (this one), *Agents at work on data*, *From helper to colleague* and *A colleague that isn't a person*.

This series is the definition and the reflection, before any rule or product: how AI got here ("not a sudden discovery, but work cooking for years until there was the computing power"), what an agent is ("a model with reasoning, feedback and checks, hands and a loop working towards a goal"), five quieter films on what agents are like to work with and why that means governing them, and two last films on what they tell us about ourselves and a future we don't know.

On making it, 3 November 2026, 08:11: "Let's start creating the videos in the first series of agentic data engineering. I don't need to check the scripts as I already provided all my insights and the plan is right, so just ask me any question you might have for each video if needed. Create a new thread for each video." And on the people: "Keep the bodies with good proportions as the example shows weird dimensions."

## The reference, and its alternatives

There is no single framework for what an agent is, so the series follows the plan's working definition and checks each film against the research it draws on.

| Body of knowledge | What it adds | Here |
|---|---|---|
| The history of neural networks and language models: Rosenblatt (1958); Rumelhart, Hinton and Williams (1986); the 2012 image-recognition result on graphics chips; Vaswani and others, *Attention Is All You Need* (2017); Ouyang and others (2022) | Why today's models took decades, then seemed to arrive at once | 1.1, and 1.8 |
| Workflows versus agents (common practice since 2024) | A fixed workflow where the steps are known; an agent only where they aren't | 1.2 |
| The Model Context Protocol (MCP), an open standard | One way to plug tools into any agent | 1.2, named only as a standard |
| Automation bias and complacency (Parasuraman and Manzey, 2010); the illusion of explanatory depth (Rozenblit and Keil, 2002) | Why people stop checking a system that is usually right, and think they understand far better than they do | 1.3 |
| Reconstructive memory (Bartlett, *Remembering*, 1932; Loftus and Palmer, 1974) | Human memory rebuilds itself each time, and changes | 1.5 |
| OWASP's agentic threats (excessive agency); Europe's AI law on human oversight | What goes wrong when an agent has too much power, and people able to understand, watch and stop a system | 1.6 |
| Levels of autonomy by the person's role (Feng, McDonald and Zhang, 2025: operator, collaborator, consultant, approver, observer); ISO/IEC 42001; the NIST AI Risk Management Framework | Autonomy as a design choice; owners, risk reviews and records for AI | Named once in 1.7; series 3 and 4 teach them |
| Creativity, the mind and life (Boden, *The Creative Mind*; the predicting brain; OpenWorm and the FlyWire connectome; Llinás; Penrose and Hameroff; the Cogitate collaboration; Butlin and others, 2023; Holland, *Emergence*; Maturana and Varela) | Open questions about ourselves | 1.8 and 1.9 |

Alternatives worth knowing, named once:

- **Russell and Norvig's agent** (*Artificial Intelligence: A Modern Approach*): anything that perceives its environment and acts on it. The series is narrower: its agents have a language model at their centre. It adopts the idea that an agent is defined by what it perceives and does, not by what it is made of.
- **Wooldridge and Jennings (1995)**: an agent acts on its own, reacts to what changes, pursues goals and works with others. The series agrees, and adds what a data team needs: hands with limited rights, checks, and an owner.
- **Levels of automation** (Parasuraman, Sheridan and Wickens, 2000; the six levels of driving automation, SAE J3016): how much a machine decides. The module prefers levels set by the person's role (Feng, McDonald and Zhang), because in data work what matters is what the person still does: approve, watch or answer.

Where the series differs from them all: it treats an agent as a capable contributor that answers to no one, so a person always answers for it; an agent never approves.

## The insights, and where each comes from

| Insight (the author's words, shortened) | Where it comes from | Film |
|---|---|---|
| Today's models were not a sudden discovery but work cooking for years until there was the computing power | His practice; the history in 1.1's sources | 1.1 |
| An agent is a model with reasoning (feedback and checks), hands and a loop working towards a goal | His practice | 1.2 |
| Agents can overcomplicate things and cost more: automate deterministically, and keep agents for what isn't deterministic | His practice; workflows versus agents | 1.2 |
| Agents give us a sense of security and understanding when we don't know what's happening, not even roughly; both sides can think they understand and mean different things | His practice; automation bias; the illusion of explanatory depth | 1.3 |
| Not people; "a junior that needs supervision" undersells them: capable bodies of knowledge that can be really dangerous | His practice | 1.4 |
| Inventing and changing their mind is not the real complaint: our memory is volatile too | His practice; reconstructive memory | 1.5 |
| Loose ethics we don't understand, and no accountability of their own: the person who set them up holds it | His practice; Europe's AI law on human oversight | 1.6, 1.7 |
| An agent in the wrong hands is even more dangerous | His practice; OWASP's excessive agency | 1.6 |
| A person in every critical loop; every change to production approved by a second person, for agents as for people | His practice | 1.6, 1.7 |
| What agents teach us about the brain, being human, creativity, consciousness, robots and life: questions without answers yet | His practice; the sources of 1.8 and 1.9 | 1.8, 1.9 |

## Practical advice the films carry

- Use a plain script where the steps are known: it is cheaper, faster and gives the same answer every time. A plain rerun needs no agent.
- Say what the agent may use. An agent once browsed the web instead of using its tool server, because the plan didn't say what was available.
- Check an agent's work against something it didn't make, and read what its hands did, not only what it says.
- Give an agent the fewest rights the task needs: read-only when reading is enough, drafts in a sandbox when it must write, and no sensitive data.
- Keep what the team learns outside one person's chat, where the next person, and the next agent, can find it.
- A person approves; the agent's review is for reference. Supervise it for what it is, not for what it looks like.

## The thread, the world and the people

The fictional university of the earlier series. Jun Park builds its data project, and this term an agent works beside him: it reads the catalogue, writes queries and checks its own work. Each reflective film opens with a story from outside data and comes back to Jun's team: Anil Kurian, an analyst in the Faculty of Health, who plans with the agent's numbers; Yusuf Demir, who leads data governance; Mei Tanaka, in the registrar's office, who owns what words mean; Noor Rahman, the data architect, who approves changes to the model; and, as films need them, Sam Okafor, who runs the platform, Clara in Planning, and Prof. David Mensah, the deputy vice-chancellor. Numbers are invented and believable, and every story is blameless.

## The look

The white lab made Nordic, chosen on 3 November 2026 (style X of the style prototype): a pale grey marble wall with soft diagonal veins, quieter where the films put words; a slim white skirting; wide planks of pale oak; daylight from a window on the right. Matte off-white cards with soft shadows. The model is a matte ceramic sphere with a band of violet light that runs faster while it thinks; the loop is a bent oak ring with small graphite arrows and its steps as pills; the hands are pale robot arms with oak joints and graphite grippers, reaching into tools; data comes back as small orange pellets. Colours mean the same in every film: blue tools and structure, violet the model thinking, orange data coming back, green a check that passes, amber a check that fails or a loop. A night version of the lab, with a floor lamp, serves a story that turns on a failure at night. Openings from other places and times are drawn in the same matte style, dressed for their time. People are drawn from the waist up, with an adult's proportions.

## The sound

Each film has a palette of its own, made in its `tools/score.py`. Music plays under the opening story, then only at a chapter's turn, under a moment on screen or in a pause without words; there is no constant bed, and nothing beats or pulses, except an urgent pulse where a film's story turns to an error or a rush. Effects are soft, low and tied to something on screen. The mix is at -16 LUFS.

## The films

| # | Folder | Film | What it shows | The idea to take away |
|---|---|---|---|---|
| 1 | `1-decades-in-the-making` | Decades in the making | The road to today's models: the perceptron (1958), learning from errors in many layers (1986), deep learning on graphics chips (2012), attention and the transformer (2017), models trained on much of the written web (2018 to 2020), training from people's feedback (2022), models that reason step by step and use tools (2024 on); why it seemed sudden | It wasn't a sudden discovery; it was long work that finally had the power to run. |
| 2 | `2-a-model-reasoning-hands-and-a-loop` | A model, reasoning, hands and a loop | The model writes; reasoning adds feedback and checks; hands let it read and act; a loop keeps it going until the checks pass; where the steps are known, a plain script is better | An agent is a model that reasons, with hands, in a loop; use one only where a plain script can't do. |
| 3 | `3-it-feels-like-understanding` | It feels like understanding | Fluent answers give us the feeling we understand and are safe; a person and an agent can each believe they understand the other while meaning different things | Feeling sure is not knowing. |
| 4 | `4-more-than-a-junior` | More than a junior, less than a person | Where "a junior who needs supervision" breaks: it knows more and works faster, but has no career, no fear of consequences and no memory of yesterday unless we give it one | Supervise it for what it is, not for what it looks like. |
| 5 | `5-minds-that-change` | Minds that change | It invents and changes its answer, and so do we; the answer is evidence and checks, for people and agents alike | Trust no mind blindly; check the work. |
| 6 | `6-ethics-and-accountability` | Ethics we can't read, accountability it can't hold | Values learned in training that we don't fully understand; no accountability of its own; in the wrong hands, its power serves the wrong aims faster | The agent acts; a person answers. |
| 7 | `7-why-we-govern-them` | Why we govern them | Capable, convincing and unaccountable, so every agent needs an owner, an identity, limits and review | We govern agents because they are capable, not because they are bad. |
| 8 | `8-what-they-tell-us-about-ourselves` | What they tell us about ourselves | One agent and one mind: the brain, creativity, consciousness, and what makes us human; questions left open | We don't have the answers yet; keep wondering. |
| 9 | `9-many-agents` | Many agents, and what emerges | Swarms of agents, emergence in nature and in us, what makes something alive, and a future we don't know, labelled as imagined | When many work together, something new appears, and we don't yet know what. |

Every opening is a story from outside data, in four beats said outright (scenario, problem, solution, benefits), checked against its own sources, with cultures and eras varied across the series; each film comes back to it and closes on its benefit for data.

## Rules from the plan

- No product is named. MCP may be named in *A model, reasoning, hands and a loop* only as an open standard. No company's model is named.
- Every claim about the mind is checked against its research; imagined futures are labelled as imagined; sources are listed with the date checked.
- The fictional university, people and numbers. Nothing from the author's own talk is named; it is input only.
- Spanish is captions and pages only. Site text follows the short style. Each film has Pause and think questions; the module's labs come later, as one set.
