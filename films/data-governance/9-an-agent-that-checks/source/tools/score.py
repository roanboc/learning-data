# An agent that checks: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette for this film (PLAYBOOK.md: vary the sound itself; Off the shelf has its brass choir and music box). Three instruments,
# each standing for one thing, as the film's colours do:
#  - A nylon-string guitar, fingerpicked, holds the chords. It plays under the opening, the imagined night, all through; after that only
#    from time to time: at a chapter's turn, rolled in the pause and fading under the first words, and for a rule that runs (green):
#    a note rising as each of the skill's steps lights, and a chord as binder 26's line goes green.
#  - A soft electric piano is the agent. Its sign is two notes rising a fourth, from the key's second to its fifth, never coming home:
#    it plays whenever the agent reads or drafts. For each thing the agent can't do (approve, edit the glossary, weaken a test, show a
#    value, write to production, read in bulk, check "care"), one low note, the same each time.
#  - An alto flute is a person deciding: three notes falling home, 3-2-1, when Anil marks the column, when he confirms, as the owners
#    approve one by one, when data governance approves a step, and when he can overrule. Where nobody has decided yet ("who decides?"),
#    it falls 3-2 and stops.
#  - The series' mark, 1-5-4-8, plays at the title and on the end card on the flute, a person, with the agent's piano an octave under it.
# A major for the imagined night, then and at the end; D major for today, which shares every note of A major but B.
# The rules of the series' sound (decided with the master data films, 20 October 2026) hold, and tools/quiet.py checks them:
#  - Music under the opening, then only from time to time, never as a bed under the voice: after the opening no chapter has music for
#    more than half its length, or for 12 seconds without a break. Under a line, the opening's guitar plays fewer notes, and softer.
#  - Nothing tense, trembling or pulsing: no urgent pulse, even at the three failed checks; no tremolo on the piano; a slight vibrato.
#  - Nothing beats on a phone's one speaker: every note is tuned just, a whole-number ratio of A (or of the D a fourth above it), so
#    the overtones of a chord meet exactly.
#  - Nothing loops. Where the picture repeats (keys, ticks, crosses, stamps), the sound plays the first round, the rest softer.
#  - Every effect is something on screen, at the moment it appears. Each uses the same timing as the picture in src/scenes.js (the same
#    word, and the same offset), so sound and picture stay together when the voice is re-timed: night air, keys, paper slid across a
#    desk, a pin in cork, a pencil, a highlighter, a pen, a rubber stamp, soft wooden knocks for cards and tags, all below about 2.5 kHz.

# when a word of a line is spoken, as the film's own wAt() estimates it: along the line's voiced length, from the words the voice reads
import json as _json, pathlib as _pl
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = max(0, s.find(word))
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def E_(sid, lid, off=0):
    """when a line ends (the film's sc.ends)"""
    return G(sid, lid) + _DUR[sid + '/' + lid] + off
# the voice's lines, as (start, end) in the film: under them the opening's guitar plays less
LINES = [(G(sid, v['id']), E_(sid, v['id'])) for sid in ST for v in _NARR[sid]['vo']]
voiced = lambda t: any(a - 0.35 < t < b + 0.15 for a, b in LINES)
R9 = np.random.default_rng(9)  # this film's own randomness: the players' small unevenness

# ---- tuning: just, in A. A major's notes are A's own ratios; D major, today's, is built on the D a fourth above A, so the two share
# every note but B (A's 9/8, D's 5/3), which the score never holds from one key into the other
JUST = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEYS = {'A': (57, 220.0), 'D': (50, 220.0 * 4 / 3 / 2)}
TOP = {'A': 57, 'D': 62}  # where the agent's sign starts in each key: A3's B and E, or D4's E and A
FL = {'A': 69, 'D': 62}  # and the flute's home note: A4, or D4, in its low, breathy register
def hz(m, key):
    r, f = KEYS[key]; o, d = divmod(m - r, 12); return f * JUST[d] * 2 ** o

# ---- this film's instruments ----
def guitar(f, start, g=0.06, pan=-0.12):
    """a nylon string plucked by a finger, near the soundhole: warm, its fundamental ringing longest, the low strings longer than the
    high, its bright partials gone in a moment, and the finger's touch at the start"""
    lo = max(0.0, np.log2(f / 82.4)); d1 = 0.75 + 0.45 * lo; sec = min(4.5, 4.6 / d1); x = tt(sec); s = np.zeros_like(x)
    for k in range(1, 14):
        if f * k > 2300:
            break
        s += abs(np.sin(np.pi * k * 0.2)) / k ** 1.15 * np.sin(2 * np.pi * f * k * x + 0.37 * k) * np.exp(-x * (d1 + 1.1 * (k - 1) * (0.6 + 0.4 * lo)))
    s = s * np.minimum(1, x / 0.004) + 0.03 * filt(noise(sec), 'band', (f, min(4 * f, 1800)))[:len(x)] * np.exp(-x * 80)
    put(norm(filt((s * env(sec, 0.002, 0.3)).astype(np.float32), 'low', 2000)), start, g, pan)
def roll(ch, s, key, g=0.06, gap=0.12, pan=-0.12):
    """a chord rolled, thumb then fingers, each string a little later and a little softer"""
    for i, m in enumerate(ch):
        guitar(hz(m, key), s + i * gap * (0.85 + 0.3 * R9.random()), g * (1 - 0.07 * i) * (0.9 + 0.1 * R9.random()), pan + 0.05 * i)
PATS = ([0, 1, 2, 'F', 1, 2, 0], [1, 0, 2, 'F', 0, 1, 3], [2, 1, 0, 'F', 2, 3, 1], [0, 2, 1, 'F', 3, 1, 2])
def pick(ch, s0, s1, key, k, g=0.06, step=0.5, pan=-0.12):
    """a chord fingerpicked from s0 to s1 (ch: the bass, its fifth, then the strings above): the thumb on the bass every fourth beat and
    on the fifth between, the fingers in an order of the chord's own (k picks it), so no two chords go alike. Under a line, the thumb
    keeps to the bass and the fingers play every other note, more softly"""
    up = ch[2:]; pat = PATS[k % len(PATS)]; n = max(1, int(round((s1 - s0) / step)))
    for i in range(n):
        t = s0 + i * step + 0.012 * R9.standard_normal(); v = 0.88 + 0.12 * R9.random(); j = i % 8; vo = voiced(t)
        if j == 0:
            guitar(hz(ch[0], key), t, g * v, pan - 0.08)
        elif vo and j in (1, 4, 7):
            continue
        elif pat[j - 1] == 'F':
            guitar(hz(ch[1], key), t, g * 0.8 * v, pan - 0.04)
        else:
            guitar(hz(up[pat[j - 1] % len(up)], key), t, g * (0.56 if vo else 0.72) * v, pan + 0.1)
def rhodes(f, start, g=0.04, pan=-0.28, sec=2.6):
    """the agent: a soft electric piano, a tine struck by a felt hammer, its brightness gone in a moment; no tremolo, and low-passed"""
    x = tt(sec); idx = 1.1 * np.exp(-x * 5.0) + 0.22
    s = np.sin(2 * np.pi * f * x + idx * np.sin(2 * np.pi * f * x)) * np.exp(-x * 0.85) + 0.05 * np.sin(2 * np.pi * f * 4 * x) * np.exp(-x * 16)
    put(norm(filt((s * np.minimum(1, x / 0.003) * env(sec, 0.003, 0.4)).astype(np.float32), 'low', 2300)), start, g, pan)
def agent(s, key, g=0.042):
    """the agent reads or drafts: its second and fifth, a fourth apart, rising, never home"""
    r = TOP[key]
    rhodes(hz(r + 2, key), s, g * 0.85, -0.3, 1.4); rhodes(hz(r + 7, key), s + 0.36, g, -0.22, 2.6)
def cant(s, key, g=0.04):
    """a thing the agent can't do: one low note, its second, an octave down"""
    rhodes(hz(TOP[key] - 10, key), s, g, -0.3, 1.5)
def alto(f, start, sec, g=0.05, pan=0.22):
    """an alto flute, low and breathy: a person's decision. Low on a flute, the octave above is nearly as strong as the note (which
    also carries it on a phone's small speaker), less so higher up; a slight vibrato comes in once the note is held"""
    x = tt(sec); vib = 1 + 0.0025 * np.sin(2 * np.pi * 4.6 * x) * np.clip((x - 0.35) / 0.5, 0, 1); ph = 2 * np.pi * np.cumsum(f * vib) / SR
    lo = float(np.clip(400 / f, 0.4, 1.2)); s = np.sin(ph) + 0.45 * lo * np.sin(2 * ph) + 0.15 * lo ** 1.5 * np.sin(3 * ph) + 0.05 * lo ** 2 * np.sin(4 * ph)
    s = s + filt(noise(sec), 'band', (f * 0.9, min(f * 3.2, 2200)))[:len(x)] * (0.1 + 0.25 * np.exp(-x * 9))
    put(norm(filt((s * env(sec, 0.09, min(0.45, sec * 0.4))).astype(np.float32), 'low', 2400)), start, g, pan)
def decide(times, key, deg=(4, 2, 0), last=2.0, g=0.042):
    """a person decides: the flute falls home, 3-2-1, a note at each time; given two times, it falls 3-2 and stops, undecided"""
    r = FL[key]
    for i, t in enumerate(times):
        end = times[i + 1] + 0.1 if i + 1 < len(times) else t + last
        alto(hz(r + deg[i], key), t, end - t, g * (1 if i + 1 < len(times) else 1.1))
def mark(s, key='A', g=0.07):
    """the series' four notes, 1-5-4-8: the alto flute, a person, and the agent's piano an octave under it"""
    r = FL[key]
    for i, iv in enumerate([0, 7, 5, 12]):
        alto(hz(r + iv, key), s + i * 0.45, 0.52 if i < 3 else 2.6, g * 0.8, 0.12)
        rhodes(hz(r - 12 + iv, key), s + i * 0.45, g * 0.42, -0.2, 1.6 if i < 3 else 3.0)

# ---- soft sounds, all below about 2.5 kHz. A pencil, a key or a footstep is fainter than a knock, so each kind has its own level, to sit
# about 25 to 32 dB under the voice: heard in a pause, there under a line, never over it
PEN, KEY, FOOT, AIR = 1.7, 1.8, 2.0, 1.4
def knock(s, g=0.026, pan=0.0, f=260):
    """a soft wooden knock: a card or a tag arriving"""
    s_knock(s, g, pan, f)
def keys(s, n, g=0.016, pan=0.0):
    """muffled keys, typing; after the first few, softer"""
    t = s
    for i in range(n):
        s_tap(t, KEY * g * (1 if i < 4 else 0.7) * (0.8 + 0.3 * R9.random()), pan + 0.05 * R9.standard_normal()); t += 0.1 + 0.11 * R9.random()
def send(s, g=0.02, pan=0.0):
    """a key pressed firmly, to send"""
    s_knock(s, KEY * g, pan, 300); s_tap(s + 0.003, KEY * g * 0.8, pan)
def stroke(s, sec=0.2, g=0.014, pan=0.0, lo=700, hi=2000):
    """one stroke of a pencil on paper: grit, swelling and fading"""
    x = tt(sec); X(filt(noise(sec), 'band', (lo, hi))[:len(x)] * np.sin(np.pi * x / sec) ** 0.6 * (0.75 + 0.25 * np.sin(2 * np.pi * 23 * x + 1.3)), s, PEN * g, pan)
def pencil(s, sec=0.8, g=0.014, pan=0.0, lo=700, hi=2000):
    """writing: short strokes, each a little different"""
    t = 0.0
    while t < sec - 0.05:
        d = 0.05 + 0.09 * R9.random(); stroke(s + t, d, g * (0.6 + 0.4 * R9.random()), pan, lo, hi); t += d + 0.02 + 0.05 * R9.random()
def cross(s, g=0.016, pan=0.0):
    """a cross, two strokes, as the film draws it: each stroke a quarter of a second"""
    stroke(s, 0.2, g, pan); stroke(s + 0.25, 0.2, g * 0.9, pan)
def tick(s, g=0.014, pan=0.0):
    """a tick: down, then up and longer"""
    stroke(s, 0.05, g * 0.8, pan); stroke(s + 0.06, 0.11, g, pan)
def marker(s, sec=0.8, g=0.016, pan=0.0):
    """a highlighter drawn along a line: a felt tip, smoother and lower than a pencil"""
    stroke(s, sec, g, pan, 300, 1500)
def paper(s, g=0.02, pan=0.0, sec=0.45):
    """paper, softly"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g, pan)
def slide(s, sec=0.9, g=0.02, pan=0.3):
    """a sheet slid across a desk, and settling"""
    x = tt(sec); X(filt(noise(sec), 'band', (300, 1700))[:len(x)] * np.sin(np.pi * x / sec) ** 1.5 * np.linspace(1, 0.5, len(x)), s, AIR * g, pan)
    paper(s + sec - 0.05, g * 0.6, pan, 0.18)
def pin(s, g=0.026, pan=0.0):
    """a push pin into cork: a small, dull tuck"""
    s_knock(s, g, pan, 360); s_tap(s + 0.004, g * 0.5, pan)
def stamp(s, g=0.04, pan=0.0):
    """a rubber stamp on paper: a padded thump, and the paper under it"""
    x = tt(0.25); X(norm((np.sin(2 * np.pi * 120 * x) * np.exp(-x * 22) + 0.5 * filt(noise(0.25), 'band', (200, 1200))[:len(x)] * np.exp(-x * 45)).astype(np.float32)), s, g, pan)
def steps(s, n, every=0.5, g=0.014, pan=0.4):
    """footsteps on the office floor, going; after the first two, softer"""
    for i in range(n):
        s_knock(s + i * every, FOOT * g * (1 if i < 2 else 0.6), pan + 0.12 * i, 110); s_air(s + i * every, 0.09, FOOT * g * 0.5, pan + 0.12 * i, 150, 700)
def outside(s, sec, g=0.011):
    """the campus outside: a breath of night air, wide"""
    s_air(s, sec, AIR * g, -0.5, 120, 650); s_air(s + 0.4, sec - 0.4, AIR * g * 0.9, 0.5, 140, 700)

# chords: the bass, its fifth, then the strings above (MIDI note numbers; hz() tunes them in the chapter's key)
A9 = [45, 52, 59, 61, 64]; D9 = [38, 45, 54, 57, 61, 64]; FSM7 = [42, 49, 52, 57, 61]; DS11 = [38, 45, 57, 61, 68]
CSM7 = [49, 56, 59, 64, 68]; DM7 = [38, 45, 54, 57, 61]; ESUS = [40, 47, 52, 57, 59, 64]
DD = [38, 45, 50, 54, 57, 64]; GM7 = [43, 50, 54, 59, 62]; G9 = [43, 50, 57, 59, 62]; ASUS = [45, 52, 57, 62, 64]
BM7 = [47, 54, 57, 62, 66]; FSM7D = [42, 49, 52, 57, 61, 64]

# 1. A night, imagined (the opening, so the guitar plays all through): A major at dusk and as Anil adds his column; F sharp minor at
#    three in the morning, under the agent reading; the D with a raised fourth where nothing says the column is personal data; then
#    C sharp minor, D and E as the agent leaves its comment, a fix to consider; A again at eight, the flute falling home as Anil marks
#    the column and the check passes; each part of what this shows on its own instrument; the mark under the title
fac, col, dob = G('night', 'adds', -0.6), W('night', 'adds', 'adds a column'), W('night', 'adds', 'date of birth')
nite, reads, q = G('night', 'three', -0.5), W('night', 'three', 'reads'), W('night', 'nothing', 'Nothing', -0.1)
appr, leaves, fix = W('night', 'comment', 'approve it'), W('night', 'comment', 'It leaves'), W('night', 'comment', 'a fix')
morn, marks, pd = G('night', 'eight', -0.5), W('night', 'eight', 'marks'), W('night', 'eight', 'personal data')
tg = [W('night', 'shows', 'rules written', -0.1), W('night', 'shows', 'applied by', -0.1), W('night', 'shows', 'a person', -0.1)]
br, title = G('night', 'breath', -0.2), G('night', 'breath', 1.4)
for k, (ch, a, b, key) in enumerate([(A9, 0.25, fac + 0.3, 'A'), (D9, fac + 0.3, col - 0.3, 'A'), (A9, col - 0.3, dob - 0.2, 'A'),
                                    (ESUS, dob - 0.2, nite + 0.2, 'A'), (FSM7, nite + 0.2, q - 0.2, 'A'), (DS11, q - 0.2, G('night', 'comment', -0.3), 'A'),
                                    (CSM7, G('night', 'comment', -0.3), leaves - 0.1, 'A'), (DM7, leaves - 0.1, fix - 0.2, 'A'), (ESUS, fix - 0.2, morn + 0.2, 'A'),
                                    (A9, morn + 0.2, marks + 0.1, 'A'), (D9, marks + 0.1, pd + 0.4, 'A'), (A9, pd + 0.4, tg[0], 'A'),
                                    (DM7, tg[0], tg[1], 'A'), (ESUS, tg[1], tg[2], 'A'), (A9, tg[2], br - 1.6, 'A'), (D9, br - 1.6, br + 0.4, 'A'),
                                    (A9, br + 0.4, title + 0.3, 'A')]):
    pick(ch, a, b, key, k, g=0.055)
outside(0.0, fac + 0.5); outside(nite - 0.1, G('night', 'three', 1.4) - nite, 0.009)
keys(col, 9, 0.014, 0.25); send(dob + 0.2, 0.02, 0.25); steps(dob + 1.45, 4, 0.5, 0.012, 0.3)
agent(reads, 'A')
knock(q + 0.05, 0.024, 0.15, 190)
stroke(appr - 0.5, 0.45, 0.012, 0.4)
knock(leaves, 0.024, 0.0, 280); agent(fix - 0.1, 'A')
marker(marks + 0.1, 0.45, 0.016, 0.2); tick(pd + 0.45, 0.014, -0.25)
decide([marks + 0.1, marks + 0.75, pd + 0.4], 'A', last=2.0)
knock(tg[0], 0.022, 0.0, 300); knock(tg[1], 0.022, 0.0, 280); knock(tg[2], 0.022, -0.3, 260)
roll([50, 57, 61, 66], tg[0] + 0.05, 'A', 0.05)
agent(tg[1] + 0.05, 'A', 0.04)
decide([tg[2] + 0.05, tg[2] + 0.55, tg[2] + 1.05], 'A', last=1.8, g=0.036)
tick(br + 0.45, 0.014, 0.2)
roll([45, 52, 57], title + 0.45, 'A', 0.045); mark(title + 0.45)

# 2. Thirteen problems (today, D major): the mark rings on into it; a knock as each column of the list comes; three low knocks as the
#    checks fail; the cards of their messages; a gold question, and another: the flute falls 3-2 and stops over a suspended chord; a pin
#    as the Faculty of Health's change goes up on Jun's board; and, as Anil waits and the light moves, B minor and G, into the next chapter
lt = lambda w, o=0: W('today', 'list', w, o)
for w in ['awards', 'how far', 'a name']:
    knock(lt(w, -0.15), 0.016, 0.2, 320)
three = W('today', 'fail', 'Three checks')
for i in range(3):
    knock(three + 0.25 * i + 0.05, 0.026 * (1 - 0.15 * i), -0.35, 230 - 25 * i)
paper(G('today', 'says', -0.05), 0.016, 0.1, 1.4)
dec = W('today', 'says', 'who decides', -0.2)
decide([W('today', 'says', 'right for', -0.2), dec], 'D', last=2.4, g=0.038)
roll([45, 52, 57, 62], dec, 'D', 0.045)
pin(W('today', 'waits', 'nobody else owns', 0.2), 0.026, 0.0)
wt = E_('today', 'waits')
roll(BM7, wt + 0.1, 'D', 0.05); roll(GM7, wt + 1.6, 'D', 0.046)

# 3. Rules an agent can follow: the pencil, as the skill's title and steps go onto the page on the board; a guitar note rising as each
#    step lights, green; for each thing it never does, a pencil cross and the agent's low note, softer each time; A, suspended, then A,
#    into the review
bc = W('skill', 'skill', 'a skill', 0.05)
pencil(bc, 0.48, 0.014, 0.3); pencil(bc + 0.5, 0.48, 0.013, 0.3)
st0, st1 = W('skill', 'skill', 'the steps'), W('skill', 'skill', 'change', 0.4)
for i in range(7):
    stroke(st0 + (st1 - st0) * i / 7, (st1 - st0) / 7 * 0.8, 0.012 * (1 if i < 3 else 0.75), 0.3)
lit = [G('skill', 'steps1'), W('skill', 'steps1', 'Find'), W('skill', 'steps1', 'Take'), G('skill', 'steps2'), W('skill', 'steps2', 'Test'),
       G('skill', 'steps3'), W('skill', 'steps3', 'Then report')]
for i, (t, m) in enumerate(zip(lit, [62, 64, 66, 69, 71, 74, 76])):
    guitar(hz(m, 'D'), t - 0.1, 0.05, -0.05 + 0.04 * i)
for i, w in enumerate(['approves', 'edits', 'weakens', 'shows']):
    t = W('skill', 'never', w, -0.05); cross(t, 0.015 * (1 if i < 2 else 0.75), 0.35); cant(t, 'D', 0.04 * 0.85 ** i)
nv = E_('skill', 'never', 1.0)
roll(ASUS, nv, 'D', 0.048); guitar(hz(61, 'D'), nv + 1.3, 0.04, 0.0)

# 4. Three findings: the agent reads Anil's change, and its review comes in; a tick for each of the two things that pass; a knock for
#    each finding's card, and a low one for "nobody named"; the email column counted, a tick a row, softer after the first; the agent's
#    sign as it drafts the class, and the test; a note home as the drafted test passes on every row; F sharp minor into People decide
agent(G('review', 'reviews', -0.4), 'D'); knock(G('review', 'reviews', 0.6), 0.022, 0.2, 280)
for w in ['touches', 'needs']:
    tick(W('review', 'reviews', w, -0.05), 0.013, 0.0)
for i in range(3):
    knock(W('review', 'findings', 'three findings', 0.2 * i + 0.05), 0.02, -0.4 + 0.4 * i, 270 + 20 * i)
knock(W('review', 'one', 'asked', 0.05), 0.02, -0.4, 190)
cn = W('review', 'tally', 'counts')
for i in range(7):
    tick(cn + 1.5 * i / 7 + 0.08, 0.012 * (1 if i < 3 else 0.7), -0.3)
agent(W('review', 'tally', 'look like', 0.8), 'D')
agent(W('review', 'rule', 'The draft'), 'D')
tick(W('review', 'rule', "row's", 0.05), 0.013, 0.1); guitar(hz(62, 'D'), W('review', 'rule', "row's", 0.05), 0.045, 0.1)
roll(FSM7D, E_('review', 'rule', 1.3), 'D', 0.046)

# 5. People decide: the agent's sign as it marks two classes "not sure"; a knock for the grey question; the sheet with the skill's step;
#    the agent drafts the stricter class and asks; Anil's answer typed, the flute falling home under G and D; a highlighter as the
#    classes go gold; the three approvals, the flute falling a note with each, and the stamp; air as the gold threads are drawn; G into
#    Governed, too
agent(W('decides', 'unsure', "wasn't sure", -0.1), 'D')
knock(G('decides', 'doubt', 0.1), 0.02, 0.4, 210)
slide(W('decides', 'doubt', 'But when', -0.2), 0.8, 0.014, 0.2)
agent(W('decides', 'doubt', 'draft the', -0.1), 'D'); knock(W('decides', 'doubt', 'and ask', -0.05), 0.022, 0.2, 280)
cf = W('decides', 'confirms', 'confirms')
knock(cf - 0.25, 0.018, 0.25, 300); keys(cf, 11, 0.014, 0.25)
decide([W('decides', 'confirms', 'a course', -0.1), W('decides', 'confirms', 'not a', -0.1), W('decides', 'confirms', 'person', -0.1)], 'D', last=2.0)
roll([43, 50, 59, 62], W('decides', 'confirms', 'a course', -0.15), 'D', 0.04); roll([38, 45, 54, 57], W('decides', 'confirms', 'person', -0.15), 'D', 0.042)
marker(W('decides', 'classed', 'classed', -0.15), 0.6, 0.014, 0.0)
ap = [W('decides', 'owners', 'the faculty', -0.15), W('decides', 'owners', 'Yusuf', -0.15), W('decides', 'owners', 'Jun', -0.15)]
decide(ap, 'D', last=2.4)
for i, t in enumerate(ap):
    stamp(t + 0.62, 0.036 * (1 - 0.12 * i), [0.0, -0.45, 0.45][i])
roll(DD, ap[2] + 0.05, 'D', 0.044)
s_air(W('decides', 'decided', 'brought', -0.1), 2.0, 0.016, 0.0, 200, 900)
roll(G9, E_('decides', 'decided', 0.45), 'D', 0.046)

# 6. Governed, too: the page for agents slid onto the desk, and the agent's sign as its star comes on; Sam's keys; a tick for each thing
#    the agent may do, and for each it may not, a cross and its low note; its low note again by the grey Approve, the flute as the owners
#    light gold, a knock for "owners only"; the highlighter along binder 26's line, a chord as it goes green, and the pen; G, then A
#    suspended, into Only what's written
slide(W('agent', 'binder', 'The agent', -0.4), 0.9, 0.018, 0.35); agent(W('agent', 'binder', 'governed', -0.05), 'D')
keys(G('agent', 'own', 0.1), 6, 0.013, 0.3)
acc = [(W('agent', 'own', 'reads'), 1), (W('agent', 'own', 'writes'), 1), (W('agent', 'own', 'workspace', 0.2), 0), (W('agent', 'samples', 'counts'), 1),
       (W('agent', 'samples', 'bulk'), 0), (W('agent', 'samples', 'only reads'), 1)]
for i, (t, ok) in enumerate(acc):
    if ok:
        tick(t, 0.012 * (1 if i < 2 else 0.8), 0.1)
    else:
        cross(t, 0.014, 0.1); cant(t, 'D', 0.036)
cant(W('agent', 'approve', "can't", 0.0), 'D', 0.036)
decide([W('agent', 'approve', 'owners,', -0.15), W('agent', 'approve', 'owners,', 0.35)], 'D', deg=(2, 0), last=1.6, g=0.036)
knock(W('agent', 'approve', 'owns', -0.05), 0.022, 0.3, 280)
gr = W('agent', 'green', 'green:', -0.2)
marker(gr, 0.9, 0.016, 0.1); roll(DD, gr + 0.1, 'D', 0.048)
for i, w in enumerate(["agent's access", 'its steps', "owners' approvals"]):
    pencil(W('agent', 'green', w, -0.1), 0.75, 0.012 * (1 if i < 1 else 0.8), 0.25, 500, 1800)
ag = E_('agent', 'green', 0.9)
roll(GM7, ag, 'D', 0.046); roll(ASUS, ag + 1.4, 'D', 0.04)

# 7. Only what's written: the agent's sign as it reads the skill; on policy 12's last line it starts, finds nothing to check, and its
#    low note comes instead of the rest; Anil's question in pencil; the flute as data governance approves a step, a knock for the tag;
#    the agent's sign as the next review follows the steps; knocks for "read it" and "question it", and the flute falls home on
#    "overrule it"; F sharp minor, the night's, into That night
agent(W('written', 'plain', 'follow', -0.2), 'D')
rhodes(hz(64, 'D'), W('written', 'care', 'No agent'), 0.036, -0.3, 1.2); cant(E_('written', 'care', -0.3), 'D', 0.04)
pencil(W('written', 'open', 'argue', -0.3), 1.4, 0.013, 0.2)
decide([W('written', 'change', 'data governance', -0.2), W('written', 'change', 'data governance', 0.3)], 'D', deg=(2, 0), last=1.6, g=0.036)
knock(W('written', 'change', 'data governance', 0.05), 0.022, -0.2, 280)
knock(W('written', 'change', 'next', -0.05), 0.02, 0.4, 300); agent(W('written', 'change', 'next'), 'D')
knock(W('written', 'trust', 'read,', -0.05), 0.02, -0.4, 300); knock(W('written', 'trust', 'question', -0.05), 0.02, -0.4, 280)
ov = W('written', 'trust', 'overrule', -0.1)
knock(ov + 0.05, 0.02, -0.4, 260); decide([ov, ov + 0.35, ov + 0.7], 'D', last=1.8, g=0.038)
roll(FSM7D, E_('written', 'trust', 1.15), 'D', 0.046)

# 8. That night: the night air again; a knock, paper, the agent's sign and a knock as the four parts come in, each on its own sign;
#    at eight, the flute falls home as the gold comes on "direct": people decide; the mark under the end card
outside(S0('close'), 3.4, 0.009)
pt = [W('close', 'parts', w, -0.15) for w in ['rules written', 'steps in', 'an agent', 'people']]
knock(pt[0] + 0.1, 0.022, -0.2, 300); paper(pt[1] + 0.05, 0.018, 0.2, 0.4); agent(pt[2] + 0.05, 'A', 0.04); knock(pt[3] + 0.1, 0.022, 0.2, 260)
pdec = W('close', 'last', 'People decide', -0.1)
decide([pdec, pdec + 0.45, pdec + 0.9], 'A', last=1.6)
mark(G('close', 'breath', 0.4))
