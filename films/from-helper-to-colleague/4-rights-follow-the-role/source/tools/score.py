# Rights follow the role: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette, reserved for this film by the series thread on 5 November 2026 after checking every score.py on main and on every
# branch (/mnt/project-files/agentic-data-engineering/series-3/palettes.md), both made here (music.py has neither):
#  - The lead, brake drums: the iron drums of a car's brakes, as twentieth-century percussion music used them, struck softly with a
#    yarn mallet, low in their range, and damped by a hand at once. A struck iron ring: a strong first partial and four weaker ones at
#    ratios no string has (1.42, 2.17, 2.86 and 3.62), each dying sooner than the one below it; the mallet's soft thump first. It
#    sounds where a limit holds: no more than a day's doses on the ward, a slip that can't reach further than its work, where the
#    planning contributor's steps end, the steps that are other roles', the check that fails the map, the agent that stops and asks.
#  - The partner, a prepared piano, as John Cage prepared his from 1940: a bolt or a strip of rubber set between the strings of each
#    note it plays, so whoever presses the key, the note sounds as it was prepared. A bolt: a short, dull note with the bolt's own
#    small ring at pitches no string has (2.37, 3.53 and 4.83 times the note); rubber: a muted thud, the string stopped almost at
#    once. Never the open, held sound of the site's felt pianos. It plays what was prepared: the pharmacy's doses, each step's right.
#  - The mark: three prepared notes, one for each of the planning contributor's steps (B, D and G), then one damped stroke of the brake
#    drum where its steps end; nothing sounds that wasn't prepared. Heard in the opening in two halves (the pharmacy's single doses,
#    a note each; then the brake as no more than a day's reaches the ward), whole under the title, where its rights are made from its
#    steps, and on the end card.
#  - Keys, all tuned pure (just intonation from G, see hz()): E minor for the ward's problem, and for a person's rights; G major from
#    Little Rock on. E and A never sound together (their fourth isn't pure in this tuning), so nothing beats.
# The rules the module keeps (the author's, 20 October and 4 November 2026; tools/quiet.py checks them):
#  - Music only from time to time: under the opening story, and after it only at a chapter's turn or under a moment on screen; never
#    a bed under the voice. Silence while the harms are told (the wrong drug, the wrong amount, an injection meant to be swallowed).
#  - Nothing trembles, rolls or pulses (no chapter is urgent): no vibrato, no tremolo, no ostinato.
#  - Every sound is an event on screen, at the moment it appears, timed by the same word and offset as the picture in src/scenes.js,
#    so sound and picture stay together when the voice is re-timed: a card laid down, a pen as a line is written or struck, a drawer
#    slid open or shut, a dose dropped in its drawer, a soft lock where a right is closed. Many things at once (46 rights, a shelf
#    of 30, six rights' steps named) are one soft sound, never one for each.
#  - Each note keeps its own level in the room (_band, _held; held.py checks it).
# And everything stays low and soft, below about 2.5 kHz.

# when a word of a line is spoken, as the film's own wAt() estimates it: along the line's voiced length, from the words the voice reads.
# wAt() falls back to the line's start when a word isn't in it; here a missing word stops the mix, so a typo can't move a sound
import json as _json, pathlib as _pl
from scipy.signal import fftconvolve
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = s.find(word)
    assert i >= 0, '%s/%s has no "%s"' % (sid, lid, word)
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def END(sid, lid):
    """when a line's voice stops (the film's sc.ends)"""
    return G(sid, lid) + _DUR[sid + '/' + lid]
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(1969)  # this film's own randomness: the room, the mallet, the paper (1969: the year Barker's study was published)

# ---- tuning: just intonation from G, so a chord's notes are whole-number ratios of each other and nothing beats
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (43, 98.0)  # G 2: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
E2, G2, B2, D3, E3, Fs3, G3, A3, B3, C4, D4, E4, Fs4, G4, A4, B4 = 40, 43, 47, 50, 52, 54, 55, 57, 59, 60, 62, 64, 66, 67, 69, 71

# ---- the levels: the music's loud moments well under -26.5 dB of full scale as one speaker plays the score (tools/quiet.py), as
# low as the governance films'; the effects about 14 dB under the music (FX scales them all)
PL, BL, FX = 0.106, 0.098, 1.3

# a room round the players: a quiet hall, ringing on for about a second, nothing much above 1.7 kHz. Its level is set by what it rings
# where the notes are (its gain from 100 Hz to 1.5 kHz is one), so a note keeps its level, as the video guidelines ask
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.1)).astype(np.float32))(np.arange(int(1.1 * SR)) / SR)
_IR = filt(_IR, 'low', 1700); _IR[:int(0.02 * SR)] = 0
def _band(h):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << 17; p = np.abs(np.fft.rfft(np.asarray(h, np.float64), nf)) ** 2; f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt(p[(f > 100) & (f < 1500)].mean()))
_IR /= _band(_IR)
def _room(s, wet):
    return np.pad(s, (0, len(_IR) - 1)) + wet * fftconvolve(s, _IR).astype(np.float32) if wet else s
def _held(s, wet):
    """a note in the room, at its own level: even at a gain of one, the room moves a note's level up or down by where its
    reflections meet it, so the note is set back to the level it had before the room, measured over its body, not its start and end"""
    r = _room(s, wet)
    if not wet:
        return r
    a, b = int(0.05 * SR), max(int(0.05 * SR) + 1, len(s) - int(0.2 * SR))
    return r * float(np.sqrt((s[a:b].astype(np.float64) ** 2).mean() / max(1e-12, (r[a:b].astype(np.float64) ** 2).mean())))
def _shaped(x, lo, hi):
    """noise of its own, band-limited and scaled to peak at one"""
    z = filt(R1.standard_normal(len(x)).astype(np.float32), 'band', (lo, hi)).astype(np.float64)
    return z / max(1e-9, float(np.abs(z[:int(0.06 * SR)]).max()))

# ---- the prepared piano: the key struck by a soft hammer, its string's partials a little stretched (as a piano's are), each upper
# one dying sooner. A bolt between the strings shortens the note and adds its own small ring, at ratios no string has; a strip of
# rubber stops the string almost at once and leaves a low thud. Nothing held, nothing open
def prep(m, a, g=1.0, pan=0.0, kind='bolt', room=0.25):
    f, bolt = hz(m), kind == 'bolt'
    T, roll = (0.5, 4.5) if bolt else (0.26, 2.4)
    n = int((T * 5 + 0.35) * SR); x = np.arange(n) / SR; s = np.zeros(n)
    for k in range(1, 40):
        fk = f * k * np.sqrt(1 + 0.0003 * k * k)
        if fk > 2300:
            break
        s += np.exp(-(k - 1) / roll) / k * np.exp(-x * (1 + 0.5 * (k - 1)) / T) * np.sin(2 * np.pi * fk * x + 0.37 * k)
    if bolt:
        for r, w, tb in ((2.37, 0.22, 0.40), (3.53, 0.12, 0.28), (4.83, 0.06, 0.20)):
            if f * r < 2300:
                s += w * np.exp(-x / tb) * np.sin(2 * np.pi * f * r * x + 1.3 * r)
    else:
        s += 0.45 * _shaped(x, 60, 380) * np.exp(-x / 0.03)
    s *= np.sin(0.5 * np.pi * np.minimum(x / 0.004, 1)) ** 2
    s += 0.05 * _shaped(x, 250, 1300) * np.exp(-x / 0.006)
    sig = filt((s / max(1e-9, float(np.abs(s).max()))).astype(np.float32), 'low', 2300)
    put(_held(sig, room), a, g * PL, pan)
def preps(notes, a, g=0.6, pans=None, step=0.0, kind='bolt', **k):
    """several prepared notes, together or step seconds apart, a little spread across the field"""
    c = len(notes)
    for i, m in enumerate(notes):
        prep(m, a + i * step, g / np.sqrt(max(1, c) / 2), pans[i] if pans else 0.25 * (i / max(1, c - 1) - 0.5) if c > 1 else 0.0,
             kind, **k)

# ---- the brake drum: an iron ring struck softly with a yarn mallet, its partials at ratios no string has, each dying sooner than the
# one below; ring=0.2, the hand laid on it at once (damped short), up to 0.5, let ring a little, never more
BR = ((1.0, 1.0, 1.0), (1.42, 0.5, 0.7), (2.17, 0.34, 0.48), (2.86, 0.18, 0.34), (3.62, 0.10, 0.24))  # ratio, weight, decay (s)
def brake(m, a, g=1.0, pan=0.0, ring=0.2, room=0.3):
    f = hz(m); n = int((1.0 * ring * 5 + 0.4) * SR); x = np.arange(n) / SR; s = np.zeros(n)
    for r, w, d in BR:
        if f * r < 2300:
            s += w * np.exp(-x / (d * ring)) * np.sin(2 * np.pi * f * r * x + 0.7 * r)
    s *= np.sin(0.5 * np.pi * np.minimum(x / 0.006, 1)) ** 2
    s += 0.16 * _shaped(x, 140, 700) * np.exp(-x / 0.012)
    sig = filt((s / max(1e-9, float(np.abs(s).max()))).astype(np.float32), 'low', 2300)
    put(_held(sig, room), a, g * BL, pan)

def mark(a, g=0.8, pan=0.0, step=0.45):
    """the mark: three prepared notes, one for each of the planning contributor's steps (B, D and G), then one damped stroke of the
    brake drum where its steps end"""
    for i, m in enumerate((B3, D4, G4)):
        prep(m, a + i * step, g * 0.75, pan + 0.22 * (i - 1))
    brake(G4, a + 2 * step + 0.65, g * 0.85, pan, 0.2)

# ---- the effects, soft and low, each where something happens on screen
def paper(s, g=0.011, pan=0.0, sec=0.42):
    """a card laid down"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def shuffle(s, sec=1.2, g=0.006, pan=0.0):
    """many things at once (rights, a shelf's tiles, a step named on each right), as one soft texture that swells in and out"""
    x = tt(sec); X(filt(noise(sec), 'band', (300, 1800))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def pencil(s, sec=0.7, g=0.005, pan=0.0):
    """a pen writing, or striking a line through: a soft, even scratch"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 2000))[:len(x)] * np.minimum(1, np.minimum(x, sec - x) / 0.08), s, g * FX, pan)
def slide(s, sec=0.9, g=0.007, pan=0.0):
    """cards slid along the wall, into a row"""
    x = tt(sec); X(filt(noise(sec), 'band', (300, 1400))[:len(x)] * np.sin(np.pi * np.minimum(1, x / sec)) ** 2, s, g * FX, pan)
def drawer(s, sec=0.8, g=0.006, pan=0.0, shut=False):
    """a steel drawer slid on its runners, low and soft, and its stop: a soft knock as it opens fully or shuts"""
    x = tt(sec); X(filt(noise(sec), 'band', (180, 900))[:len(x)] * np.sin(np.pi * x / sec) ** 2 * (1 - 0.3 * np.cos(9 * np.pi * x / sec)), s, g * FX, pan)
    s_knock(s + sec - 0.05, g * 0.9 * FX, pan, 150 if shut else 190)
def dose(s, g=0.007, pan=0.0):
    """a dose dropped in its drawer: a small paper packet, a soft tap"""
    s_tap(s, g * FX, pan)
def tap(s, g=0.008, pan=0.0):
    """a muffled tap: a pill set on, a name written under a role"""
    s_tap(s, g * FX, pan)
def lock(s, g=0.010, pan=0.0):
    """a small lock closing: a right that only people hold"""
    s_knock(s, g * FX, pan, 420); s_tap(s + 0.012, g * 0.6 * FX, pan)

# =============================================================================================================================
# 1. A drawer filled from the order. The ward in the late 1950s: E minor, a rubber-muted E, then a bolted B. The ward's stock: a
#    muted G as the cabinet comes, its card laid down. The doctor's order laid down, the copy beside it, and a bolted F sharp, left
#    unresolved; a pen as the clerk copies it. The slip: a low muted E as the copy's edge turns amber; then silence while the harms are
#    told. Every medicine within reach of every hand: E, B and G as the lines reach the beds, one soft texture under them. "Something
#    had to change": D, leaning towards G. Little Rock: G and D together, the pharmacists' card laid down. The pharmacist reads the
#    order (it's lifted); "single doses, labelled and ready to give", a prepared note for each (B, D and G), as the pharmacy sends
#    them one by one. The three cards, laid down. The study: G major, rolled, and the brake let ring a little. As other hospitals
#    take it up, a drawer slides open and three doses drop in, and the brake drum, damped, as no more than one day's doses reach
#    the ward. The university: the agent's question, a bolted E. A person's rights: the
#    shelf lit (one soft texture) and a muted E and B; locks on approving and changing production. The rights of its work: G and D as
#    the drawer is named; and, as a slip can't reach any further, the brake, damped. The title: the mark
ww = lambda lid, word, off=0: W('ward', lid, word, off)
wc = lambda lid, off=0: G('ward', lid, off)
w0 = S0('ward')
prep(E3, w0 + 0.7, 0.8, -0.2, 'rubber')
prep(B3, w0 + 2.9, 0.62, 0.25)
P_big = ww('stock', 'big bottles')
prep(G3, P_big - 0.2, 0.62, px(700), 'rubber')
paper(P_big + 0.1, 0.011, px(1555))
paper(ww('order', "the doctor's order"), 0.011, px(1385))
P_copy = ww('order', 'only a copy')
paper(P_copy, 0.011, px(1705)); prep(Fs3, P_copy + 0.15, 0.58, px(1705))
pencil(ww('order', 'written out'), 0.8, 0.005, px(1500))
prep(E2, ww('wrong', 'a slip'), 0.85, px(1705), 'rubber')
P_hands = ww('reach', 'every hand')
shuffle(P_hands - 0.5, 2.2, 0.005, px(900))
prep(E3, P_hands - 0.3, 0.62, -0.3, 'rubber'); prep(B3, P_hands + 0.1, 0.55, 0.0); prep(G4, P_hands + 0.5, 0.5, 0.3)
prep(D4, wc('change', 0.3), 0.6, 0.0)
paper(ww('arkansas', 'pharmacists', 0.2), 0.011, px(1555))
preps((G3, D4), ww('arkansas', 'another way'), 0.75, [px(700), px(1200)])
P_reado = ww('drawer', "each doctor's order")
paper(P_reado - 0.3, 0.008, px(430))
for w_, m, x_ in (('single doses', B3, 1340), ('labelled', D4, 1550), ('ready to give', G4, 1550)):
    prep(m, ww('drawer', w_, 0.05), 0.55, px(x_))
paper(wc('each'), 0.010, px(720)); paper(ww('each', 'the pharmacist checked'), 0.010, px(1154)); paper(ww('each', 'the nurse gave'), 0.010, px(1578))
paper(ww('fell', 'In their study'), 0.011, px(990))
P_thirty = ww('fell', 'one in thirty')
preps((G3, B3, D4, G4), P_thirty + 0.1, 0.75, [-0.3, -0.1, 0.1, 0.3], 0.12)
brake(G4, P_thirty + 0.25, 0.55, 0.0, 0.45)
P_gotd = ww('day', 'a drawer')
drawer(P_gotd, 0.9, 0.006, px(1550))
for i in range(3):
    dose(ww('day', 'filled from the order', 0.1 + i / 2.4), 0.006, px(1500 + 60 * i))
brake(D4, ww('day', "one day's doses", 0.1), 0.8, px(1500), 0.2)
paper(ww('spread', 'nine American hospitals', -0.2), 0.011, px(990))
prep(E4, ww('uni', 'what should it'), 0.55, px(960))
paper(ww('uni', 'the same question'), 0.010, px(960))
paper(ww('shelf', "a person's rights"), 0.011, px(490))
P_whole = ww('shelf', 'the whole shelf')
shuffle(P_whole, 1.6, 0.005, px(490)); preps((E3, B3), P_whole + 0.1, 0.7, [px(400), px(620)], 0.0, 'rubber')
lock(ww('shelf', 'approving'), 0.009, px(250)); lock(ww('shelf', 'changing production'), 0.009, px(560))
paper(ww('fill', 'the rights of its work'), 0.011, px(1430))
for i in range(3):
    tap(ww('fill', 'each of its steps', 0.3 * i), 0.007, px(1250))
preps((G3, D4), ww('fill', 'a drawer'), 0.7, [px(1300), px(1560)])
brake(D4, ww('slip', "can't reach", 0.2), 0.75, px(1430), 0.2)
mark(wc('breath', 0.3), 0.8, 0.0)

# 2. What Jun's helper had: Clara's card, and the quote's. The helper's badge lit (a tap); Jun's 46 rights, one soft texture, and a
#    muted E and B as "gathered over the years" comes. The three kinds named, a tap each, a lock for what only a person should use.
#    The two reasons, each written. Noor and Sam, from the work to the rights: G, B and D, rising, one for each pill
bw = lambda lid, word, off=0: W('borrowed', lid, word, off)
bc = lambda lid, off=0: G('borrowed', lid, off)
paper(bw('ask', 'Clara Jensen'), 0.011, px(390)); tap(bw('ask', 'the simple way'), 0.008, px(260))
paper(bc('quote'), 0.012, px(1070))
tap(bw('helper', 'own sign-in'), 0.009, px(650))
P_every = bw('helper', 'every right')
paper(P_every, 0.011, px(1380)); shuffle(P_every + 0.2, 1.0, 0.005, px(1380))
preps((E3, B3), bw('many', 'gathered'), 0.7, [px(1200), px(1560)], 0.0, 'rubber')
tap(bw('today', 'builds the project'), 0.008, px(1180)); tap(bw('today', 'reviews and approves'), 0.008, px(1250))
lock(bw('person', 'to approve'), 0.010, px(1090))
tap(bw('old', "the research system's"), 0.007, px(1250))
paper(bc('twice', 0.2), 0.011, px(1380))
pencil(bw('wide', 'too wide'), 0.7, 0.005, px(1380)); pencil(bw('history', 'years of'), 0.7, 0.005, px(1380))
P_work = bw('other', 'from the work')
paper(P_work - 0.2, 0.011, px(1380))
for i, m in enumerate((G3, B3, D4)):
    prep(m, P_work + 0.35 * i, 0.5, px(1100 + 200 * i))

# 3. Rights from the steps: the agent takes its role, G and D together. The service's card, and its seven steps slid into their row.
#    The three that are the planning contributor's, a prepared note for each as it's named (B, D and G). Each step's card laid down,
#    and a pen as it says what it reads. Its rights, exactly those: the card laid down, the steps named on its rights (one soft
#    texture), and the mark. Like the drawer: its picture, the drawer slid open. The map makes the list (a tap); Sam's grants, and
#    "nothing more": the brake, damped
sw = lambda lid, word, off=0: W('steps', lid, word, off)
sc_ = lambda lid, off=0: G('steps', lid, off)
paper(sw('monday', 'on the map'), 0.011, px(1020))
P_role = sw('monday', 'planning contributor')
tap(P_role, 0.008, px(330)); preps((G3, D4), P_role + 0.1, 0.65, [px(250), px(400)])
paper(sw('service', 'one service'), 0.011, px(1070)); slide(sw('service', 'seven steps'), 1.4, 0.007, px(960))
tap(sw('three', 'three of them'), 0.008, px(710))
for w_, m, x_ in (('draft the change', B3, 460), ('build it', D4, 710), ('open a pull request', G4, 960)):
    prep(m, sw('three', w_), 0.55, px(x_))
paper(sw('each', 'what it reads', -0.3), 0.011, px(1270))
pencil(sw('draft', 'it reads'), 0.6, 0.005, px(1270))
paper(sc_('build', 0.2), 0.010, px(1270)); pencil(sw('build', 'it reads'), 0.6, 0.005, px(1270))
paper(sc_('open', 0.2), 0.010, px(1270)); pencil(sw('open', 'it reads'), 0.6, 0.005, px(1270))
paper(sw('exactly', 'exactly those'), 0.012, px(1270))
P_names = sw('exactly', 'every right names')
shuffle(P_names, 1.6, 0.005, px(1650)); mark(P_names + 0.1, 0.8, px(1270))
drawer(sw('like', 'the drawer', -0.1), 0.6, 0.005, px(550))
tap(sw('short', 'the map makes'), 0.008, px(330))
tap(sw('grants', 'set up its grants'), 0.008, px(330))
brake(D4, sw('grants', 'nothing more', 0.1), 0.75, px(1270), 0.2)

# 4. What it reads, and in what order: the two pills, a tap each. The governed context: its card, and D and G as it's named; its owner
#    and its review, a tap each. The team's memory: its card, laid down softly, and a muted B. They disagree (a tap); the definition
#    wins: D, G and B, rolled. The report laid down, its owner told (a tap); the doctor's own order, framed
rw = lambda lid, word, off=0: W('reads', lid, word, off)
tap(rw('part', 'part of its rights'), 0.008, px(330)); tap(rw('part', 'the order matters'), 0.008, px(330))
P_gov = rw('first', 'the governed context')
paper(P_gov - 0.2, 0.011, px(1010)); preps((D4, G4), P_gov + 0.1, 0.65, [px(900), px(1120)])
tap(rw('owner', 'an owner'), 0.008, px(860)); tap(rw('owner', 'through review'), 0.008, px(900))
P_mem = rw('second', "the team's memory")
paper(P_mem, 0.008, px(1580)); prep(B3, P_mem + 0.1, 0.55, px(1580), 'rubber')
tap(rw('wins', 'disagree'), 0.008, px(1315))
preps((D4, G4, B4), rw('wins', 'the definition wins'), 0.7, [px(860), px(960), px(1060)], 0.15)
paper(rw('says', 'in its report'), 0.011, px(390)); tap(rw('says', "the definition's owner"), 0.008, px(390))
paper(rw('original', "the doctor's own order"), 0.011, px(1550))

# 5. What's left out, and why: the seven steps slid back into their row, the card laid down. The other four steps light, and the brake
#    drum, damped: they're other roles'. Each person's name written under their role (a tap each). What a word means: its card. The
#    four nevers, a lock each. Separation of duties falls out of the steps: G, D and G, open. The ward's three hands, framed. The
#    map's check: its card, and as the map fails, the brake on E with a muted E under it
lw = lambda lid, word, off=0: W('left', lid, word, off)
lc = lambda lid, off=0: G('left', lid, off)
slide(lc('left'), 1.0, 0.006, px(960)); paper(lw('left', 'written down'), 0.011, px(1030))
brake(D4, lw('four', 'other four steps', 0.3), 0.7, px(1200), 0.2)
for lid, w_, x_ in (('ticket', "Clara's", 210), ('review', "Jun's", 1210), ('approve', "Noor's", 1460), ('release', "Noor's", 1710)):
    tap(lw(lid, w_), 0.007, px(x_))
paper(lw('word', 'what a word means'), 0.011, px(1070))
for w_ in ('never approves', 'never releases', 'never changes', 'never writes'):
    lock(lw('never', w_), 0.009, px(940))
P_sod = lw('falls', 'separation of duties')
paper(P_sod, 0.011, px(1580)); preps((G3, D4, G4), P_sod + 0.2, 0.7, [px(1450), px(1580), px(1710)], 0.2)
paper(lw('ward', 'one ordered', -0.2), 0.011, px(980))
paper(lw('check', 'a check fails'), 0.011, px(1220))
P_fills = lw('check', 'an agent fills', 0.3)
brake(E4, P_fills, 0.7, px(1220), 0.2); prep(E3, P_fills + 0.02, 0.5, px(1220), 'rubber')

# 6. When the work changes: the work, its steps, its rights, its tools, rising, G, A, B and D, one for each pill. The new work's card;
#    the role's card and the new step's, and a pen as it says what it reads. Noor's two agreements, a tap each. Its rights follow: the
#    card, and the new step's own note, C, prepared like the others. The tools follow (a tap); a grant by hand, struck (a pen). A
#    ticket that needs more: its card; borrowing a way in, struck; "it stops": the brake, damped. When the step goes, its note goes,
#    muted. Drift, and the next film's check, a tap each
cw = lambda lid, word, off=0: W('change', lid, word, off)
cc = lambda lid, off=0: G('change', lid, off)
P_fol = cw('follow', 'the rights follow')
for i, (t_, m) in enumerate(((cc('follow'), G3), (P_fol - 0.2, A3), (P_fol + 0.2, B3), (P_fol + 0.6, D4))):
    prep(m, t_, 0.5, px(820 + 240 * i))
paper(cw('say', 'answer its questions', -0.2), 0.011, px(1070))
paper(cw('step', 'a new step', -0.4), 0.010, px(390)); paper(cw('step', 'saying what'), 0.011, px(1270))
pencil(cw('step', 'saying what', 0.2), 1.0, 0.005, px(1270))
tap(cw('agree', 'once Clara'), 0.008, px(1000)); tap(cw('agree', 'the owners', 0.3), 0.008, px(1100))
paper(cw('view', 'its rights follow', -0.2), 0.011, px(1270)); prep(C4, cw('view', 'new lines'), 0.6, px(1270))
tap(cw('tools', 'the tools follow'), 0.008, px(1000)); tap(cw('tools', 'a grant by hand'), 0.008, px(950))
pencil(cw('tools', 'a grant by hand', 0.3), 0.5, 0.005, px(950))
paper(cw('asks', 'needs more', -0.2), 0.011, px(1140)); tap(cw('asks', 'borrow a way in'), 0.008, px(900))
pencil(cw('asks', 'borrow a way in', 0.3), 0.5, 0.005, px(900))
brake(G4, cw('asks', 'it stops'), 0.75, px(1150), 0.2)
prep(C4, cw('goes', 'a step goes', 0.2), 0.5, px(1270), 'rubber')
tap(cw('drift', 'is drift', -0.2), 0.008, px(1000)); tap(cw('drift', 'the next film'), 0.007, px(1000))

# 7. A drawer of its own: back on the ward, B and G as the drawer comes, the order laid by it, the drawer slid shut. Here: "nothing
#    more", the brake, damped. None reaches production: a lock. Jun's rights stay his own: a tap. The end card: the mark, the last
#    time, and G, D and G after it, prepared like every note before
kw = lambda lid, word, off=0: W('close', lid, word, off)
kc = lambda lid, off=0: G('close', lid, off)
preps((B3, G4), S0('close') + 0.5, 0.6, [px(1400), px(1600)])
P_order = kw('drawer', 'one order')
paper(P_order - 0.3, 0.010, px(1374)); tap(kw('drawer', "one day's doses"), 0.007, px(560))
drawer(kc('here', -1.5), 0.8, 0.006, px(1550), shut=True)
brake(D4, kw('here', 'nothing more', 0.1), 0.7, px(1270), 0.2)
lock(kw('reason', 'reaches production'), 0.009, px(990))
tap(kw('jun', 'his own', -0.2), 0.008, px(960))
P_end = kc('breath')
mark(P_end + 0.3, 0.8, 0.0)
preps((G3, D4, G4), P_end + 2.6, 0.6, [-0.25, 0.0, 0.25])
