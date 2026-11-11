# Labs: the brain as a prediction machine

Three hands-on labs for the film *Borrowed from the brain*, in the series *What an agent is*. They follow its last two chapters,
*A step ahead* and *A loop that expects*: a brain guesses what comes next and pays attention to the gap; a plain script only
reacts. You build both and run them on the same data as the film's story, one university's nightly course registrations.

Everything here is invented: the university, its three campuses (North, South and City) and every number.

## Setup

You need Python 3.9 or later and nothing else (only the standard library).

```
cd films/what-an-agent-is/2-borrowed-from-the-brain/labs
python make_data.py        # writes data/ (about 2 MB), the same every time
```

Each lab is one file with a few functions marked `TODO`. Fill them in, run the file, then check it:

```
python check.py 1          # or 2, or 3; with no number it checks all three
```

`solutions/` holds one way to do each lab. Try first: the point is to see the surprise for yourself.

## Lab 1 · The reflex and the predictor

`lab1_reflex_vs_predictor.py` · the film's chapter *A loop that expects*

**Objective.** See why a rule that checks one thing misses what a guess catches. A reflex waits for its trigger and checks a
fixed rule. A predictor says what it expects before it looks, then measures the gap: its *prediction error*.

**What you do.** Write four short functions:

1. `reflex(n)`: the script's one rule, "the table isn't empty".
2. `threshold(n)`: a fixed range someone tuned once by eye, 2,000 to 5,000 rows.
3. `prediction_error(expected, actual)`: the gap as a share of the guess.
4. `predictor(totals, day)`: expect the median of the same weekday over the last four weeks, and pass the night only if the
   gap is within 15% either way.

**Expected outcome.** Over fourteen weeks, 5 January to 12 April:

| Check | Nights flagged | What it means |
|---|---|---|
| Reflex | 0 | It never notices anything: no night was empty. |
| Fixed range | 29 | It cries wolf on all 28 quiet weekend nights, catches the double load on 5 March, and misses Monday 16 March. |
| Predictor | 2 | Exactly the two real problems: 5 March (loaded twice) and 16 March (2,030 rows where about 4,100 were expected). |

## Lab 2 · The foraging loop

`lab2_foraging_loop.py` · the film's chapters *A step ahead* and *A loop that expects*

**Objective.** Build an agent's loop that meets a failed assumption, finds out why, adapts where it's safe, and hands the rest
to a person, without ever crashing. An animal that forages doesn't stop at the first empty patch: it looks elsewhere and
remembers what it found.

**The data.** Three weeks of nightly extracts (9 to 29 March), each a CSV of registration rows. Some nights break an assumption:

- From 11 March, the course column is called `course_code` instead of `course_id` (schema drift).
- On 16 March, City campus sends nothing (missing rows).
- On 18 March, City leaves `credits` empty on every row (nulls).
- From 23 March, South sends credits in hours, ten times the number (a shift in the distribution).

**What you do.** Write three functions:

1. `match_columns(header)`: find each expected column, or the closest name to it, and say which ones you had to guess.
2. `load(path)`: read a night's file through that mapping, and never fail on a missing or odd value.
3. `night(day)`: the loop itself. Expect (rows by weekday, columns, credits), load, measure every gap, look for the cause
   (which campus, which column), adapt where nothing a report shows would change, and put the rest on the list for a person.

**Expected outcome.** All 21 nights run with no crash. On 11 March the agent adopts `course_code` as `course_id` on its own
and notes it, since that changes no number. A person hears, once each, about 16 March (City sent no rows), 18 March (City's
credits are empty) and 23 March (South's credits look ten times too big). After 23 March, South's hours are only noted, since
the person already knows.

## Lab 3 · Learning from the miss

`lab3_learning_from_the_miss.py` · the film's chapter *A step ahead* (the escalator, and Schultz's juice)

**Objective.** See that learning from every surprise is as bad as learning from none. A stumble on a stopped escalator doesn't
teach your legs that escalators never move.

**What you do.** Write `learn()`, which decides whether a night moves the expectation, for each campus and weekday. Compare
three ways to learn from 9 March to 26 April:

- `never`: the expectation stays what it was in March.
- `blindly`: every night moves it, the outage included.
- `gated`: it learns only from nights that matched, and from a change a person has confirmed (a new campus, East, opens on
  13 April; the agent proposes, a person confirms).

**Expected outcome.**

| Way to learn | Nights flagged | What happens |
|---|---|---|
| Never | 15 | East is a surprise every night after it opens. |
| Blindly | 10 | It learns the outage as normal, then cries wolf on Mondays that were fine (23 and 30 March). |
| Gated | 2 | Only the two real surprises. |

## Where this sits

The site's labs for the series (on each film's page) are short exercises you do in the browser. These three are the longer,
hands-on ones, in Python. The repository's tests run `python check.py --solutions`, so the labs, their data and their answers
stay in step.
